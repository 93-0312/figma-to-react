# Figma 디자인 변경을 완전 무인으로 동기화하기 — 헤드리스 Claude, seat의 함정, 그리고 누적 드리프트 청소 (2편)

1편에서는 Figma 버전 변경을 폴링해 GitHub Issue로 알리고, 원격 MCP로 토큰을 추출해 코드와 대조하는 파이프라인을 만들었다. 그리고 "다음 단계"로 세 가지 숙제를 남겼다 — ① GitHub schedule이 실제로 도는지, ② 게시 버전만 감지할지, ③ 감지부터 PR까지 **완전 무인**으로 잇기. 2편은 그 숙제들을 실제로 밀어붙이며 만난 현실에 대한 기록이다. 결론부터 말하면, 기술보다 **계정·seat·인증** 같은 운영 디테일에서 더 많이 배웠다.

## 1. 1편의 숙제: GitHub schedule은 밤새 결국 돌았다

1편에서 cron을 걸고 40분을 기다렸지만 schedule 실행이 0건이었다. "best-effort라 못 믿겠다"는 잠정 결론을 내렸는데, 밤새 백그라운드로 추적한 결과가 흥미로웠다.

```
19:43  schedule ✅ → 변경 감지 → Issue 자동 생성
23:03  schedule ✅
02:34  schedule ✅
04:57  schedule ✅
07:02  schedule ✅
08:49  schedule ✅
```

**결국 돌긴 한다.** 단 `*/15`(15분) 설정인데 실제론 **약 2~3.5시간 간격**으로, 13시간 동안 6번 떴다. 그리고 그중 첫 실행이 밤새 디자이너가 바꾼 실제 변경을 잡아 **Issue를 자동 생성**했다 — 사람이 자는 동안 감지→알림이 무인으로 돈 것이다.

정리하면 GitHub schedule은 "되긴 하지만 띄엄띄엄"이다. **"몇 시간 내 알아채면 충분"한 용도엔 무료로 충분**하고, "저장 즉시"가 필요하면 결국 webhook이다. 1편의 잠정 결론("못 믿겠다")을 운영 데이터로 보정한 셈이다.

## 2. 완전 무인화: 헤드리스 Claude를 CI에 넣다

가장 큰 진전은 **추출까지 사람 손을 떼는 것**이었다. 1편에서 원격 MCP(fileKey) 헤드리스 추출이 된다는 걸 확인했으니, 이걸 GitHub Actions에서 돌리면 된다. 공식 `anthropics/claude-code-action@v1` + 구독 토큰(`claude setup-token`)으로 묶었다.

```yaml
- uses: anthropics/claude-code-action@v1
  with:
    claude_code_oauth_token: ${{ secrets.CLAUDE_CODE_OAUTH_TOKEN }}
    prompt: |
      figma.manifest.json 기준으로 변경분만 추출 → 검증 → 브랜치 → PR.
      반드시 CLAUDE.md 규칙(★ Variant 매핑)을 지켜라.
```

여기서 두 번 넘어졌다. **둘 다 코드가 아니라 권한/설정 문제였다.**

- **첫 실행, 27초 만에 실패** — `Could not fetch an OIDC token`. claude-code-action은 토큰 교환에 `permissions: id-token: write`가 필요한데 빠뜨렸다.
- **재실행은 성공했는데 PR이 안 생겼다** — 에이전트가 브랜치는 push했지만 PR 생성에서 멈췄다. 로그를 보니 `GitHub Actions is not permitted to create or approve pull requests`. 저장소 설정 *"Allow GitHub Actions to create and approve pull requests"* 가 기본 OFF였던 것. 켜자마자 다음 실행부터 PR이 자동 생성됐다.

> 교훈: **헤드리스 자동화의 첫 실패 절반은 코드가 아니라 권한(OIDC, PR 생성 권한)이다.** 로그의 에러 메시지를 그대로 믿고 권한부터 점검하는 게 빠르다.

그렇게 해서 *밤새 디자이너가 바꾼 변경 → 크론 감지 → Issue → 헤드리스 Claude 추출 → 자동 PR → 머지 → Issue 종료* 가 **사람 없이 한 바퀴** 돌았다. 1편의 마지막 숙제가 닫혔다.

## 3. 비용의 현실: 회당 1달러, 그리고 6/15의 분기점

무인이 되니 다음 질문은 "얼마 드나"였다. 헤드리스 sync 1회는 모델이 이미 Sonnet인데도 **~$1.37 상당**이 나왔다. 원인은 모델이 아니라 **양**이었다 — 무거운 전체 `design_context`(약 15만 자) 페이로드 + 40턴 탐색. 프롬프트를 "가벼운 값으로 먼저 비교 → 차이 나는 것만 깊게"로 바꾸자 다음 회차는 **$1.14**로 내려갔다. (max-turns는 *상한선*이지 비용의 직접 원인이 아니라는 것도 이때 정리했다 — 에이전트가 헤매며 상한까지 갈 때만 의미가 있다.)

더 중요한 발견은 **요금제 구조**였다. 2026-06-15부터 Agent SDK / `claude -p` / GitHub Actions 사용분이 대화형 한도에서 **분리되어 별도 월간 크레딧**(Max 5x 기준 $100/월)으로 청구된다. 즉,

- **6/15 전**: 헤드리스가 대화형(5시간 롤링)과 **같은 풀**을 먹는다 → 테스트 많이 하면 내 채팅이 막힌다.
- **6/15 후**: 헤드리스는 **별도 $100/월** → 대화형을 안 건드린다. 단 월 ~70회 상한.

> 한 줄: 회당 ~$1 수준이라 *하루 1~2회 동기화*는 충분히 감당된다. 다만 "오토세이브마다"처럼 자주 돌리면 월 크레딧이 빠르게 닳는다. **트리거를 게시 이벤트에만 거는 게 비용·노이즈 양쪽에 옳다.**

## 4. 진짜 함정은 seat이었다 — View 6회/월 vs Dev 200회/일

운영 중 원격 MCP가 갑자기 막혔다. `You've reached the Figma MCP tool call limit for your **View seat**`. 알고 보니 Figma MCP는 **seat 종류로 쿼터가 갈린다.**

| seat | 원격 MCP 호출 |
|---|---|
| View / Collab | **6회 / 월** |
| Dev / Full (Pro) | 200회 / 일 |

문제는 인증된 계정이 **개인 Gmail 계정**이었고, 그 계정은 디자인 팀에서 View seat이라 한 달에 6번이면 끝이었다는 것. 회사 계정(`it@eromnet.com`)은 같은 팀에서 **Dev seat**(200/일)인데, MCP가 엉뚱한 계정으로 붙어 있었다.

여기서 또 한참 헤맸다. **"앱 커넥터"와 "Claude Code의 CLI MCP"가 별개**라는 걸 몰라서, 앱 설정에서 아무리 figma를 다시 연결해도 CLI 쪽은 계속 "needs auth"였다. 결국:

1. 잘못 만든 중복 CLI 항목 제거
2. 앱 재시작으로 세션 토큰 갱신
3. `authenticate` → **브라우저를 it@eromnet.com으로 로그인한 뒤** 승인 → `complete_authentication(callback_url)`
4. `whoami`로 `it@eromnet.com` + **Dev seat** 확인

> 교훈: **"Dev Mode로 보기 가능"과 "Dev seat 쿼터"는 다르다.** View seat도 Dev Mode 인스펙트는 되지만 MCP 호출은 월 6회로 묶인다. 그리고 OAuth는 *브라우저에 로그인된 계정*으로 인증되니, 계정 전환은 "MCP 재인증"이 아니라 "브라우저 계정부터" 챙겨야 한다.

## 5. 전체 재동기화 = 누적 드리프트 청소

마지막으로, 그동안 추출한 컴포넌트들을 **전부 다시 대조**했다. 토큰 값은 Button/Checkbox/Field 모두 일치했지만, 두 종류의 드리프트가 나왔다.

**(1) 변형 커버리지 누락.** 체크박스의 모바일 indeterminate 막대 폭을 `w-1.5`(6px)로 고정해 뒀는데, Figma는 데스크톱 6px / **모바일 8px**로 나뉘어 있었다. 처음 추출할 때 모바일 "선택" 변형만 보고 모바일 "indeterminate" 변형(8012:7769)을 안 봐서 생긴 누락이다. `isSelected × isParent × disabled × mobile = 16조합` 중 한 칸을 빠뜨린 것 — 정확히 CLAUDE.md에 적어둔 *"2^N 조합 전체+엣지 확인"* 규칙을 내가 어긴 케이스였다.

**(2) "데모 헬퍼"가 정식 컴포넌트인 척하고 있었다.** Input은 원래 Field 데모를 띄우려고 **기본형 1개만** 급조한 것이었는데, 매니페스트엔 정식 컴포넌트로 들어가 있었다. 실제 Figma Input은 **8타입(Default/Focus/Error/ErrorFocused/Disabled/MultiSelect/File/InnerLabel) × 3사이즈 × 2fill = 48변형**의 슬롯형 컨테이너였다. 사이즈·에러 상태·focus 링·아이콘/접두접미 슬롯까지 제대로 재작성하고, 빠져 있던 **Label** 컴포넌트도 추가했다.

> 교훈: **동기화 파이프라인은 "새 변경"만 잡는 게 아니라 "누적된 과거 누락"도 청소해 준다.** 그리고 데모용으로 급조한 컴포넌트는 반드시 표시해 두자 — 안 그러면 미완성이 정식인 척 쌓인다.

## 6. 배운 것 요약

- **GitHub schedule은 best-effort지만 결국 돈다.** "몇 시간 내"면 무료로 충분, "즉시"면 webhook.
- **헤드리스 자동화의 첫 실패는 권한이다.** OIDC `id-token: write`, 그리고 "Actions가 PR 생성 허용" 설정.
- **비용은 양이 좌우한다.** 모델보다 페이로드·턴. "차이 나는 것만 깊게"가 회당 비용을 가른다. 6/15부터 헤드리스는 별도 월 크레딧.
- **seat이 곧 쿼터다.** View 6회/월 vs Dev 200회/일. "Dev Mode 보기"와 "Dev seat"은 다르다.
- **MCP 인증은 브라우저 계정부터.** 앱 커넥터 ≠ CLI MCP. 계정 전환은 재인증이 아니라 로그인 계정 확인이 먼저.
- **재동기화는 누적 드리프트를 청소한다.** 값 + 바인딩 + 변형 커버리지 3축으로 본다.
- **변경은 추적 가능한 단위로 닫는다.** 감지 → Issue → PR(closes #) → 머지 → 종료가 하나의 감사 추적.

## 7. 다음 단계

- webhook(Cloudflare Worker, 무료) + Figma 웹훅(유료 플랜)으로 "게시 즉시" 트리거
- "Components published"만 감지하는 노이즈 필터
- Input 특수 변형 + Textarea/Select/Switch 등 컴포넌트 확장

1편이 "변경을 얼마나 빨리, 얼마나 조용하게 알아채느냐"였다면, 2편은 **"알아챈 뒤 사람 손을 얼마나 떼느냐, 그리고 그 자동화를 어떤 계정·권한·비용 위에서 굴리느냐"** 의 이야기였다. 파이프라인을 만드는 것보다, 그걸 **운영 가능한 형태로 길들이는 것**이 더 많은 시간을 잡아먹었다 — 그리고 그게 진짜 배움이었다.
