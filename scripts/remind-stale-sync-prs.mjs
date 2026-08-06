#!/usr/bin/env node
/**
 * 검토 대기 중인 sync PR 리마인더.
 *
 * 2단계 머지 정책에서 **시각 변경이 있는 sync PR 은 자동 머지하지 않고 사람 검토를
 * 기다린다**(`.github/workflows/visual.yml`). 이때 유일한 실패 모드는 "아무도 모르는 채
 * 잊히는 것"이다 — 실제로 PR #150 이 15일 방치된 적이 있다.
 * → 오래 열려 있는 sync PR 에 하루 한 번 리마인더 코멘트를 남겨 알림이 가게 한다.
 *
 * 사용: GH_TOKEN=... GITHUB_REPOSITORY=owner/repo node scripts/remind-stale-sync-prs.mjs
 * 종료 코드: 항상 0 (알림 실패가 폴링을 막지 않도록)
 */
const STALE_DAYS = Number(process.env.STALE_DAYS || 3);
const COOLDOWN_HOURS = Number(process.env.COOLDOWN_HOURS || 20);
const MARKER = "<!-- stale-sync-reminder -->";

const token = process.env.GH_TOKEN || process.env.GITHUB_TOKEN;
const repo = process.env.GITHUB_REPOSITORY;
if (!token || !repo) {
  console.log("[remind] GH_TOKEN/GITHUB_REPOSITORY 없음 — 생략");
  process.exit(0);
}

const api = async (path, init) => {
  const res = await fetch(`https://api.github.com/repos/${repo}${path}`, {
    ...init,
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/vnd.github+json",
      "X-GitHub-Api-Version": "2022-11-28",
      "User-Agent": "figma-sync-reminder",
      ...(init?.body ? { "Content-Type": "application/json" } : {}),
    },
  });
  if (!res.ok) throw new Error(`${path} → ${res.status} ${res.statusText}`);
  return res.status === 204 ? null : res.json();
};

const hoursSince = (iso) => (Date.now() - new Date(iso).getTime()) / 36e5;

try {
  const prs = await api("/pulls?state=open&per_page=50");
  const syncPrs = prs.filter((p) => (p.head?.ref || "").startsWith("figma-sync/"));

  if (syncPrs.length === 0) {
    console.log("[remind] 열린 sync PR 없음 — 정상");
    process.exit(0);
  }

  for (const pr of syncPrs) {
    const ageDays = hoursSince(pr.created_at) / 24;
    if (ageDays < STALE_DAYS) {
      console.log(`[remind] #${pr.number} ${ageDays.toFixed(1)}일 — 아직 유예 내`);
      continue;
    }

    // 최근 리마인더가 있으면 도배하지 않는다
    const comments = await api(`/issues/${pr.number}/comments?per_page=100`);
    const recent = comments.some(
      (c) => c.body?.includes(MARKER) && hoursSince(c.created_at) < COOLDOWN_HOURS
    );
    if (recent) {
      console.log(`[remind] #${pr.number} 최근 리마인더 있음 — 생략`);
      continue;
    }

    const body =
      `${MARKER}\n### ⏰ 검토 대기 ${Math.floor(ageDays)}일째\n\n` +
      `이 Figma 동기화 PR 이 **시각 변경**을 담고 있어 자동 머지되지 않았습니다. ` +
      `위 시각 증거 코멘트(Figma 원본 / Before / After / Diff)를 확인해 주세요.\n\n` +
      `- 의도한 디자인 변경이면 → 머지\n` +
      `- 아니면 → PR 을 닫고 Figma 를 수정한 뒤 다시 발행(publish)\n\n` +
      `> 이 PR 이 열려 있어도 **다른 발행 건의 동기화는 정상 진행**됩니다. ` +
      `다만 오래 방치되면 브랜치가 main 과 벌어져 충돌할 수 있습니다.`;

    await api(`/issues/${pr.number}/comments`, {
      method: "POST",
      body: JSON.stringify({ body }),
    });
    console.log(`[remind] ✓ #${pr.number} 리마인더 게시 (${Math.floor(ageDays)}일째)`);
  }
} catch (e) {
  console.log(`[remind] ⚠ 실패(무시): ${e.message}`);
}
process.exit(0);
