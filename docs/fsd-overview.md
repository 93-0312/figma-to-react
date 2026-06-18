# FSD 협업 개요 (디자인팀 × UI팀)

> **프로젝트:** BO UI Kit  
> **대상:** 디자인팀, UI팀(프론트엔드)  
> **작성일:** 2026-06-17  
> **버전:** 1.0

---

## 이 문서는 무엇인가요?

디자인팀과 UI팀이 **같은 구조(FSD)와 같은 언어**로 협업하기 위한 **공통 기준 문서**입니다.

FSD는 “개발자만의 폴더 규칙”이 아니라, **Figma에서 화면을 설계하고 코드로 구현하기까지** 이어지는 전체 흐름의 뼈대입니다.

| 문서 | 역할 | 주 독자 |
|------|------|--------|
| **이 문서 (개요)** | 왜 FSD를 쓰는지, 팀 역할, 전체 흐름 이해 | 디자인팀 + UI팀 전원 |
| [FSD 운영 가이드](./fsd-operations-guide.md) | Figma·코드 각 단계 실무 규칙 | 작업 담당자 |
| [FSD 주요 용어 사전](./fsd-glossary.md) | 공식 용어·금지 표현·혼동 방지 | 디자인팀 + UI팀 전원 |
| [FSD × 디자이너 협업 가이드](./fsd-designer-guide.md) | 디자인 핸드오프·용어·싱크 상세 | 디자인팀 |
| [Figma FSD 정리 가이드](./figma-fsd-restructure-guide.md) | BO UI Kit Figma 정리 작업 지시 | 디자인팀 |

---

## 1. 왜 FSD를 도입하나요?

### 해결하려는 문제

| 문제 | FSD 도입 후 |
|------|------------|
| “이 컴포넌트 어디에 넣어요?” | 레이어별 역할이 정해져 있음 |
| Figma 이름 ≠ 코드 이름 | 1:1 명명 규칙으로 통일 |
| UI Kit vs 화면 디자인 혼재 | 파일·폴더 단위로 분리 |
| 핸드오프 시 매번 구두 설명 | 체크리스트·스토리로 자동 전달 |
| 디자인 변경 시 코드 영향 불명확 | 레이어 단위로 변경 범위 파악 |

### 한 줄 정의

> **FSD(Feature-Sliced Design)** 는 프론트엔드를 **역할 단위 레이어**로 나누고, **위 레이어는 아래 레이어만 참조**하는 구조 약속입니다.

```
app → pages → widgets → features → entities → shared
 ↑______________________________________________|
              (역방향 import 금지)
```

---

## 2. 팀별 역할

### 디자인팀

| 담당 | 산출물 | FSD 대응 |
|------|--------|----------|
| 디자인 시스템 | BO UI Kit Figma | `shared` |
| 토큰 정의 | Foundation(색·타이포·간격) | `shared/tokens` |
| 컴포넌트 정의 | Components + Usage(Stories) | `shared/components/ui` |
| 화면·플로우 | 앱 Figma 파일 | `pages`, `widgets`, `features` |

### UI팀 (프론트엔드)

| 담당 | 산출물 | FSD 대응 |
|------|--------|----------|
| 토큰 코드화 | `colors.css`, tailwind config | `shared/tokens` |
| UI 컴포넌트 | `button.tsx`, `input.tsx` … | `shared/components/ui` |
| 화면 조립 | 페이지·위젯·기능 구현 | `pages`, `widgets`, `features` |
| 싱크·검증 | `figma.manifest.json`, Storybook | 파이프라인 |

### 공동 책임

- **명칭 통일:** Variant, State, Slot, Token 등 공식 용어 사용
- **변경 기록:** Figma 코멘트 + PR + manifest 갱신
- **리뷰:** 핸드오프 체크리스트 기준으로 양팀 교차 확인

---

## 3. FSD 레이어 ↔ 디자인·코드 대응

| FSD 레이어 | 디자이너가 부르는 말 | 코드 위치 | Figma 위치 |
|-----------|-------------------|----------|-----------|
| `app` | 전체 테마·글로벌 설정 | `src/app/` | 앱 Figma / README |
| `pages` | 화면·스크린 | `src/pages/` | 앱 Figma `Pages` |
| `widgets` | 섹션·패널·블록 | `src/widgets/` | 앱 Figma `Widgets` |
| `features` | 기능·유저 플로우 | `src/features/` | 앱 Figma `Features` |
| `entities` | 도메인 오브젝트 | `src/entities/` | 앱 Figma `Entities` |
| `shared` | UI Kit·디자인 시스템 | `src/shared/` | **BO UI Kit 파일** |

### 핵심 구분

```
┌─────────────────────────────────────────────────────────┐
│  BO UI Kit Figma  =  shared 레이어 (재사용 UI 부품)      │
│  Button, Input, Badge, Dialog, Card …                   │
└─────────────────────────────────────────────────────────┘
                          ↓ 조립
┌─────────────────────────────────────────────────────────┐
│  앱 Figma  =  pages / widgets / features / entities     │
│  홈 화면, 로그인 플로우, 상품 카드 …                      │
└─────────────────────────────────────────────────────────┘
```

> **주의:** UI Kit의 `Form`, `Card`, `Dialog`는 FSD `features`가 아닙니다.  
> “로그인 기능”이 features이고, 그 안에서 쓰는 `Dialog` 컴포넌트는 shared입니다.

---

## 4. Figma → 구현 전체 흐름

```
① 토큰 정의 (Foundation)
        ↓
② 컴포넌트 정의 (Components)
        ↓
③ 사용 예시 (Usage / Stories)
        ↓
④ manifest 매핑 (figma.manifest.json)
        ↓
⑤ 코드 생성·수정 (shared/components/ui)
        ↓
⑥ Storybook / 스토리 검증
        ↓
⑦ 화면 조립 (pages / widgets / features)
        ↓
⑧ QA · 배포
```

### 단계별 게이트 (넘어가기 전 확인)

| 단계 | 게이트 | 확인자 |
|------|--------|--------|
| ① 토큰 | Variables 바인딩, hex 직접 사용 없음 | 디자인 |
| ② 컴포넌트 | 이름·Variant·State 전체 정의 | 디자인 |
| ③ 스토리 | 다크모드·Empty·슬롯 예시 | 디자인 |
| ④ manifest | Figma 노드 ID ↔ 코드 파일 매핑 | UI |
| ⑤ 코드 | 토큰 사용, shared만 참조 | UI |
| ⑥ 검증 | tsc + lint + Storybook | UI |
| ⑦ 화면 | Figma 화면 링크 ↔ pages 매칭 | 디자인 + UI |
| ⑧ QA | 체크리스트 전항 통과 | QA + 양팀 |

---

## 5. Figma 파일 구조 (목표)

### BO UI Kit (shared)

```
📌 README
🎨 Foundation          ← 토큰
🧩 Components          ← UI 컴포넌트 정의
📖 Usage (Stories)     ← 사용 예시
```

**Figma:** https://www.figma.com/design/LFA5EyNbUdPvi8Rbuf2tJC/BO-UI-Kit

### 앱 디자인 (pages 이상)

```
📌 README
🎨 Foundation          ← 앱 전용 토큰 오버라이드 (필요 시)
📄 Pages               ← URL 단위 화면
🧱 Widgets             ← 재사용 섹션
⚡ Features            ← 사용자 행동 단위
📦 Entities            ← 도메인 카드·리스트 아이템
```

---

## 6. 공식 용어 (양팀 공통)

> 전체 정의·금지 표현·혼동 방지: **[FSD 주요 용어 사전](./fsd-glossary.md)**

| 상황 | 공식 용어 | 예시 |
|------|----------|------|
| 디자인 시스템 전체 | **UI Kit / Shared** | “UI Kit에 Button 추가해주세요” |
| 색·타이포·간격 | **토큰 (Token)** | “primary 토큰 값 변경” |
| 컴포넌트 변형 | **Variant** | “Outline variant” |
| 상호작용 | **State** | “disabled 상태” |
| 아이콘·콘텐츠 영역 | **Slot** | “icon 슬롯” |
| 사용 예시 | **스토리 (Story)** | “스토리 업데이트 필요” |

---

## 7. 성공 기준 (도입 완료 정의)

다음이 모두 충족되면 FSD 협업 체계가 안착된 것으로 봅니다.

- [ ] BO UI Kit Figma가 `Foundation / Components / Usage` 구조로 정리됨
- [ ] manifest 등록 컴포넌트 100% Figma ↔ 코드 이름 일치
- [ ] 신규 컴포넌트 추가 시 가이드 체크리스트를 따름
- [ ] 화면 디자인은 앱 Figma에서 `pages` / `widgets` / `features`로 분리
- [ ] 핸드오프 시 구두 설명 없이 Figma 링크 + 체크리스트로 전달 가능
- [ ] 디자인 변경 → manifest → PR 파이프라인이 동작함

---

## 8. 자주 묻는 질문

**Q. FSD는 개발자만 알면 되는 거 아닌가요?**  
A. 아닙니다. FSD 레이어는 **Figma 페이지 구조·파일 분리·명명**과 1:1로 연결됩니다. 디자인팀이 구조를 모르면 핸드오프 비용이 커집니다.

**Q. UI Kit와 앱 화면을 한 Figma 파일에 두면 안 되나요?**  
A. BO UI Kit은 `shared`로 **단일 라이브러리 파일**에 집중합니다. 화면은 앱 파일로 분리해 관리합니다.

**Q. 디자인이 바뀌면 코드는 자동으로 바뀌나요?**  
A. manifest 등록 컴포넌트는 싱크 파이프라인 대상입니다. 다만 **PR 리뷰**는 필수이며, 화면 조립(pages 이상)은 수동 구현입니다.

**Q. 어떤 문서부터 읽어야 하나요?**  
A. 이 개요 → [운영 가이드](./fsd-operations-guide.md) → 역할별 상세 문서 순서를 권장합니다.

---

## 9. 관련 링크·리소스

| 리소스 | URL / 경로 |
|--------|-----------|
| BO UI Kit Figma | https://www.figma.com/design/LFA5EyNbUdPvi8Rbuf2tJC/BO-UI-Kit |
| FSD 공식 문서 | https://feature-sliced.design/ |
| manifest | `figma.manifest.json` (프로젝트 루트) |

---

*이 문서는 디자인팀·UI팀 공통 온보딩 및 이해관계자 공유용입니다.*  
*구조 변경 시 운영 가이드와 함께 갱신해주세요.*
