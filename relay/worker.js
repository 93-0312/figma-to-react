/**
 * Figma 웹훅 → GitHub 중계자 (Cloudflare Worker).
 *
 * 흐름:
 *   Figma(FILE_UPDATE) --POST--> 이 Worker --repository_dispatch--> figma-poll(게이트) --> sync --> PR
 *
 * 검증 2단:
 *   1) passcode  — Figma 웹훅 등록 시 정한 공유 비밀(요청 본문에 동봉됨)과 대조.
 *   2) file_key  — "BO UI Kit" 파일에서 온 이벤트만 통과(다른 팀 파일 저장 무시).
 *
 * 시크릿(=`wrangler secret put`):
 *   - GITHUB_TOKEN    : repo 스코프 PAT (repository_dispatch 호출용)
 *   - FIGMA_PASSCODE  : 웹훅 등록 때 쓴 것과 동일한 문자열
 * 변수(wrangler.toml [vars], 비밀 아님):
 *   - GITHUB_REPO     : "93-0312/figma-to-react"
 *   - FIGMA_FILE_KEY  : "LFA5EyNbUdPvi8Rbuf2tJC"
 *   - DISPATCH_TYPE   : "figma-changed"
 */
export default {
  async fetch(request, env) {
    if (request.method !== "POST") {
      return new Response("ok (figma webhook relay; POST only)", { status: 200 });
    }

    let body;
    try {
      body = await request.json();
    } catch {
      return new Response("bad json", { status: 400 });
    }

    // 1) passcode 검증 — Figma 가 매 요청에 동봉하는 공유 비밀.
    if (!env.FIGMA_PASSCODE || body.passcode !== env.FIGMA_PASSCODE) {
      return new Response("unauthorized", { status: 401 });
    }

    // 등록 직후 Figma 가 보내는 헬스체크. 200 이어야 웹훅이 ACTIVE 로 바뀐다.
    if (body.event_type === "PING") {
      return new Response("pong", { status: 200 });
    }

    // 우리가 처리할 이벤트만(파일 내용 변경). 그 외(코멘트 등)는 무시.
    if (body.event_type !== "FILE_UPDATE") {
      return new Response(`ignored event: ${body.event_type}`, { status: 200 });
    }

    // 2) file_key 필터 — 추적 대상 파일에서 온 것만.
    if (env.FIGMA_FILE_KEY && body.file_key !== env.FIGMA_FILE_KEY) {
      return new Response(`ignored file: ${body.file_key}`, { status: 200 });
    }

    // GitHub 로 신호 → figma-poll 의 노드 핑거프린트 게이트가 진짜 변경인지 판단.
    const res = await fetch(`https://api.github.com/repos/${env.GITHUB_REPO}/dispatches`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${env.GITHUB_TOKEN}`,
        Accept: "application/vnd.github+json",
        "X-GitHub-Api-Version": "2022-11-28",
        "User-Agent": "figma-webhook-relay",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        event_type: env.DISPATCH_TYPE || "figma-changed",
        client_payload: {
          file_key: body.file_key,
          // Figma 가 주는 식별자들(있을 때만). 디버깅/추적용.
          timestamp: body.timestamp || null,
          triggered_by: body.triggered_by || null,
        },
      }),
    });

    if (!res.ok) {
      const detail = await res.text();
      return new Response(`github dispatch failed: ${res.status} ${detail}`, { status: 502 });
    }

    return new Response("dispatched", { status: 200 });
  },
};
