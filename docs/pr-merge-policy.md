# PR 머지 정책 — 무엇이 자동이고 무엇이 사람 몫인가

> 내부 레퍼런스. "어떤 PR은 저절로 머지되고 어떤 건 안 되는지"가 헷갈릴 때 보는 문서.
> 근거는 `.github/workflows/visual.yml` 의 `sync PR 자동 머지` 스텝과 실제 머지 이력.

---

## 한 줄 요약

**시각 변화가 없을 때만 자동 머지한다. 화면이 바뀌면 무조건 사람이 시각 증거를 보고 머지한다.**
(2026-08-06 부터. 그 전에는 "재검증 green" 을 근거로 시각 변경까지 자동 머지했다 — 아래 참고)

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

### ① 자동 머지 — sync PR 중 **시각 변화가 없는 것만**

아래를 **전부** 만족할 때만 CI 가 스스로 머지한다.

1. PR 의 브랜치명이 `figma-sync/*` 로 시작
2. Visual regression 워크플로가 **dispatch 로 실행**됨 (`gh workflow run "Visual regression" -f pr=<번호>`)
   — 일반 `pull_request` 이벤트로 돈 실행은 대상이 아니다
3. **기존 baseline 대비 시각 diff 가 0** (= 스냅샷이 하나도 안 바뀜)
4. `gh pr merge --squash --delete-branch` 성공

실제로 여기 해당하는 건 **문서·매니페스트 워터마크·노드 지문만 바뀐 경우**다. 사람이 볼 게 없다.
통과하면 머지 + 브랜치 삭제 + 연결 이슈 자동 종료.

누가 2번의 dispatch 를 하는가: `figma-sync.yml` 의 `Ensure PR exists + trigger visual evidence`
스텝이 PR 생성 직후 자동 호출한다.

### ② 사람 검토 후 머지 — **시각 변화가 있는 sync PR**

화면이 바뀌면 자동 머지하지 않는다. CI 는 대신:
- `needs-design-review` 라벨을 붙이고
- "사람 검토 필요" 코멘트를 남기고
- PR 을 **열어둔 채** 끝낸다

사람은 위에 자동 생성된 **시각 증거 코멘트(Figma 원본 / Before / After / Diff)** 를 보고
의도한 디자인 변경인지 판단해 머지하거나, 아니면 PR 을 닫고 Figma 를 고쳐 다시 발행한다.
baseline·지문 갱신 커밋은 이미 브랜치에 들어가 있어 머지하면 그대로 반영된다.

> **왜 "재검증 green" 을 자동 머지 근거로 쓰지 않는가 (중요)**
> 파이프라인은 시각 변경을 감지하면 `--update-snapshots` 로 **새 렌더를 baseline 으로 덮어쓴다.**
> 그 다음 다시 테스트하면 *자기 자신과 비교*하는 셈이라 거의 항상 green 이다 — **동어반복**이다.
> 렌더 플레이크는 잡지만 "이 디자인 변경이 옳은가" 는 전혀 검증하지 못한다.
> 그 판단의 유일한 실질 근거는 시각 증거 코멘트이고, 그건 사람이 봐야 한다.
> (2026-08-06 이전에는 이 green 을 근거로 자동 머지했다. Meter 가 파랑→빨강으로 바뀐
> 것 같은 변경도 그대로 통과했을 구조다.)

### ③ 사람 머지 — 사람이 만든 모든 PR

`fix/*`, `feat/*`, `docs/*`, `release/*` 등은 브랜치명 검사에서 걸러져 자동 머지 대상이 아니다.
의도된 설계다 — 사람 PR 의 시각 회귀를 자동 수락하면 게이트가 무의미해진다.
`visual-baselines-*` (수동 baseline 갱신 PR) 도 사람 몫.

---

## 검토 대기가 파이프라인을 막지 않게 하는 장치

②가 정상 상태이므로, **PR 이 며칠 열려 있어도 나머지가 계속 돌아야 한다.** 두 가지로 보장한다.

| 장치 | 내용 |
|---|---|
| **발행 버전 단위 dedup** | poll 은 **같은 발행 버전**의 이슈가 열려 있을 때만 건너뛴다. 새 발행이 오면 검토 대기 PR 이 있어도 정상적으로 새 sync 를 돌린다. (종전엔 이슈가 하나라도 열려 있으면 전부 차단 → #150 사고) |
| **리마인더** | `scripts/remind-stale-sync-prs.mjs` 가 3일 이상 열린 sync PR 에 하루 한 번 코멘트를 남긴다. 잊히는 것이 유일한 실패 모드이기 때문. |

같은 날 두 번째 발행이면 브랜치명(`figma-sync/<날짜>`)이 겹치므로, sync 에이전트는
`-2`, `-3` 접미사를 붙여 **새 브랜치**를 만든다(검토 대기 PR 에 커밋을 얹지 않는다).

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
Figma 발행(publish)          ← 저장이 아니라 "발행"이 릴리즈 신호
   │
   ▼
figma-poll  ── 2단 게이트(발행 감지 → 노드 지문) ──▶ 변경 없음이면 워터마크만 전진(끝)
   │ 실제 변경
   ▼
figma-sync (헤드리스 Claude)
   │  발행 스냅샷 기준 추출 → 브랜치 push → PR 생성
   │  └─ visual 워크플로를 dispatch (-f pr=N)
   ▼
visual (dispatch)
   ├─ 시각 비교 (기존 baseline 대비)   ← 이 결과가 머지 판정 기준
   ├─ 증거 코멘트 (Figma 원본 / Before / After / Diff)
   ├─ baseline·지문 자동 갱신 커밋
   └─ 2단계 머지 판정
        ├─ 시각 diff 0     →  ✅ 자동 머지 + 브랜치 삭제 + 이슈 종료
        └─ 시각 diff 있음  →  ⏸ needs-design-review 라벨 + PR 열어둠
                               → 사람이 증거 보고 머지
                               → 3일 넘으면 리마인더 코멘트

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
- 열린 PR 0 / 열린 이슈 0
- 또는 `needs-design-review` 라벨이 붙은 sync PR 이 열려 있음 → **검토 대기 중, 정상**

**`needs-design-review` PR 이 있다면** — 사람이 판단할 차례다
1. PR 의 시각 증거 코멘트에서 Figma 원본과 After 를 대조
2. 의도한 디자인 변경 → `gh pr merge <번호> --squash --delete-branch`
3. 아니면 → PR 을 닫고 Figma 를 수정한 뒤 다시 **발행(publish)**

**라벨 없이 열린 sync PR 이라면**
1. dispatch 가 안 걸림 → `gh workflow run "Visual regression" -f pr=<번호>` 로 수동 트리거
2. 머지 충돌 → 브랜치에 main 을 머지한 뒤 다시 dispatch

**수동 명령 모음**
```bash
gh pr list --state open --label needs-design-review      # 검토 대기 PR 확인
gh pr list --state open                                  # 전체 열린 PR
gh issue list --state open                               # 열린 이슈
gh workflow run "Visual regression" -f pr=<번호>          # sync PR 게이트 재실행
gh pr merge <번호> --squash --delete-branch               # 머지(사람 PR·검토 완료 sync PR)
```

---

## 관련 문서·코드

- 자동 머지 구현: `.github/workflows/visual.yml` — `sync PR 자동 머지 (재검증 green 시)` 스텝
- dispatch 트리거: `.github/workflows/figma-sync.yml` — `Ensure PR exists + trigger visual evidence`
- 릴리즈 신호(발행 게이트): `CLAUDE.md` → "★ 릴리즈 신호 = 발행(publish)"
- 파이프라인 전체: `docs/CONFLUENCE.md`
