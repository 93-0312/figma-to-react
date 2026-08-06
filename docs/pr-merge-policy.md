# PR 머지 정책 — 무엇이 자동이고 무엇이 사람 몫인가

> 내부 레퍼런스. "어떤 PR은 저절로 머지되고 어떤 건 안 되는지"가 헷갈릴 때 보는 문서.
> 근거는 `.github/workflows/visual.yml` 의 `sync PR 자동 머지` 스텝과 실제 머지 이력.

---

## 한 줄 요약

**자동 머지되는 것은 Figma sync PR 한 종류뿐이고, 나머지는 전부 사람이 머지한다.**
그마저도 조건 5개를 모두 통과했을 때만이다.

---

## 왜 헷갈리는가 — 머지 기록이 주체를 구분해주지 않는다

GitHub 머지 이력을 보면 대부분 계정 `93-0312` 로 찍혀 있어 "사람이 다 했다"처럼 보이지만,
그 안에는 **성격이 다른 두 가지**가 섞여 있다.

| 기록상 머지 주체 | 실제 주체 | 세션 필요? |
|---|---|---|
| `93-0312` | 사람이 GitHub UI 에서 직접 머지 | — |
| `93-0312` | **Claude 가 작업 세션에서 `gh pr merge` 실행** (gh CLI 가 사용자 토큰을 쓰므로 동일하게 기록됨) | ✅ 필요 |
| `app/github-actions` | **CI 의 무인 자동 머지** (이것만 진짜 자동) | ❌ 불필요 |

최근 20건 기준으로 `app/github-actions` 머지는 **단 1건**(PR #153)이다.
자동 머지 기능 자체가 2026-07-29(PR #152)에 도입돼 그 이후 sync PR 부터 적용되기 때문이다.

> **핵심**: "Claude 가 알아서 머지해준 것"과 "CI 가 무인으로 머지한 것"은 다르다.
> 전자는 대화 세션이 살아 있어야 하고, 후자는 아무도 없어도 돈다.

---

## 경로별 정리

### ① 자동 머지 — Figma sync PR (유일)

아래 조건을 **전부** 만족할 때만 CI 가 스스로 머지한다.

1. PR 의 브랜치명이 `figma-sync/*` 로 시작
2. Visual regression 워크플로가 **dispatch 로 실행**됨 (`gh workflow run "Visual regression" -f pr=<번호>`)
   — 일반 `pull_request` 이벤트로 돈 실행은 자동 머지 대상이 아니다
3. baseline·노드 지문 정합 커밋이 끝난 뒤
4. **갱신된 baseline 으로 전체 시각 테스트를 재실행해 green**
5. `gh pr merge --squash --delete-branch` 가 성공(충돌·권한 문제 없음)

통과하면 머지 + 브랜치 삭제 + 연결된 "Figma 변경 감지" 이슈까지 자동 종료한다.
**하나라도 어긋나면 PR 은 열린 채로 남고 사람 판단을 기다린다.**

누가 2번의 dispatch 를 하는가: `figma-sync.yml` 의 `Ensure PR exists + trigger visual evidence`
스텝이 PR 생성 직후 자동으로 호출한다.

### ② 사람(또는 세션 중인 Claude) 머지 — 그 외 전부

- `fix/*`, `feat/*`, `docs/*`, `release/*` 등 **사람이 만든 모든 브랜치**
  → 브랜치명 검사(조건 1)에서 걸러져 자동 머지 대상이 아니다. 의도된 설계다:
  사람 PR 의 시각 회귀를 자동 수락하면 게이트가 무의미해진다.
- **sync PR 이라도** 재검증이 red 면 자동 머지하지 않는다 (`::warning::재검증 red` 로그를 남기고 종료)
- `visual-baselines-*` (수동 baseline 갱신 PR) 도 사람 몫

---

## ⚠️ 주의: sync PR 의 "PR 체크"는 아예 실행되지 않는다

봇(`GITHUB_TOKEN`)이 만든 PR 은 GitHub 정책상 `pull_request` 이벤트 워크플로가
**`action_required`(승인 대기)** 로 멈춘다. 즉 sync PR 화면에서 보이는 visual/smoke/guard 체크는
승인 전까지 **돌지 않는다.**

실제로 자동 머지된 PR #153 에서 성공한 체크는 Vercel 뿐이었다.

그럼 뭐가 게이트였나 → **dispatch 로 돈 별도의 visual 런**이다. 이게 baseline 을 맞추고
재검증까지 수행한다. `main` 에 브랜치 보호(required checks)가 걸려 있지 않아서 이 구조가 성립한다.

> 브랜치 보호를 켜면 자동 머지가 막힌다. 켤 거라면 dispatch 런의 체크를 required 로
> 등록하거나 봇 승인 정책을 함께 조정해야 한다.

---

## 흐름도

```
Figma 발행(publish)
   │
   ▼
figma-poll  ── 2단 게이트(발행 감지 → 노드 지문) ──▶ 변경 없음이면 워터마크만 전진(끝)
   │ 실제 변경
   ▼
figma-sync (헤드리스 Claude)
   │  추출 → 브랜치 push → PR 생성
   │  └─ visual 워크플로를 dispatch (-f pr=N)   ← 자동 머지의 진입점
   ▼
visual (dispatch)
   ├─ 시각 비교 + 증거 코멘트
   ├─ baseline·지문 자동 갱신 커밋
   └─ 재검증
        ├─ green  →  ✅ 자동 머지 + 브랜치 삭제 + 이슈 종료
        └─ red    →  ⏸ PR 열어둠 (사람 판단)

사람이 만든 PR (fix/*, feat/*, …)
   └─ 게이트는 돌지만 자동 머지 대상 아님 → 항상 사람이 머지
```

---

## 과거 사고 — 왜 이 정책이 이렇게 됐나

- **PR #150 이 15일 방치**: 자동 머지 도입(#152) 전에는 "재검증 → 머지"가 세션 중 Claude 의
  몫이었다. #150 은 세션 종료 18분 뒤에 생성돼 아무도 그 마지막 단계를 밟지 않았다.
  연결 이슈도 열린 채라 poll 의 dedup 이 **그 기간의 후속 sync 를 전부 차단**했다.
  → 이 사고가 자동 머지(#152)를 도입한 이유다.
- **PR #142 좀비 부활**: 머지 후 늦게 도착한 baseline push 가 삭제된 브랜치를 되살렸고,
  안전판이 stale 브랜치로 PR 을 재생성했다. → #147 에서 "닫힌 PR 과 같은 SHA 면 부활 금지" 로 차단.
- **이슈 #151 미종료**: 머지된 PR 의 `Closes` 키워드가 처리되지 않아 dedup 이 계속 막았다.
  → #154 에서 자동 머지 후 이슈를 **명시적으로도** 닫도록 이중화.

---

## 운영 체크리스트

**정상 상태**
- 열린 PR 0 / 열린 이슈 0 이면 파이프라인이 밀린 게 없다는 뜻

**sync PR 이 열린 채 남아 있다면** — 아래 중 하나다
1. 재검증 red → 증거 코멘트와 diff 아티팩트를 보고 판단 (진짜 회귀인지 렌더 플레이크인지)
2. dispatch 가 안 걸림 → `gh workflow run "Visual regression" -f pr=<번호>` 로 수동 트리거
3. 머지 충돌 → 브랜치에 main 을 머지한 뒤 다시 dispatch

**"Figma 변경 감지" 이슈가 오래 열려 있다면**
연결 PR 이 머지 안 된 상태다. 이슈가 열려 있는 동안 **후속 sync 가 차단**되므로 우선 처리한다.

**수동 명령 모음**
```bash
gh pr list --state open                                  # 밀린 PR 확인
gh issue list --state open                               # 밀린 이슈 확인
gh workflow run "Visual regression" -f pr=<번호>          # sync PR 게이트 재실행(→ green 이면 자동 머지)
gh pr merge <번호> --squash --delete-branch               # 사람 PR 머지
```

---

## 관련 문서·코드

- 자동 머지 구현: `.github/workflows/visual.yml` — `sync PR 자동 머지 (재검증 green 시)` 스텝
- dispatch 트리거: `.github/workflows/figma-sync.yml` — `Ensure PR exists + trigger visual evidence`
- 릴리즈 신호(발행 게이트): `CLAUDE.md` → "★ 릴리즈 신호 = 발행(publish)"
- 파이프라인 전체: `docs/CONFLUENCE.md`
