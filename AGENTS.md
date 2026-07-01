# AGENTS.md — AI 코딩 에이전트 안내 (Claude Code · Cursor 공용)

이 저장소는 여러 사람이 **서로 다른 AI 에디터**(Claude Code, Cursor 등)로 함께 작업한다.
에디터가 무엇이든 **동일한 규칙**을 따르도록, 규칙은 한 곳에서만 관리한다.

## 규칙의 단일 소스 (Single Source of Truth)

👉 **모든 코딩 규칙·컨벤션은 [`CLAUDE.md`](./CLAUDE.md) 에 있다.**

- **Claude Code** → `CLAUDE.md` 를 자동으로 읽는다.
- **Cursor** → `.cursor/rules/project.mdc` 가 `CLAUDE.md` 를 참조한다.
- 다른 에이전트 → 이 `AGENTS.md` 를 통해 `CLAUDE.md` 를 읽어라.

어떤 에디터를 쓰든 **작업 전 `CLAUDE.md` 를 규칙으로 삼는다.**

## 새 규칙/교훈을 추가할 때

버그를 고치고 일반화된 재발 방지 규칙을 남길 때는 **반드시 `CLAUDE.md` 에 적는다.**
에디터별 개인 메모리(Claude 자동 메모리, Cursor Memories)에만 적으면 협업자가 공유받지 못한다.
`CLAUDE.md` 한 곳에만 추가하면 모든 에디터가 자동으로 공유한다.

## 협업 셋업 (클론 직후 1회)

```bash
# 1) 커밋 훅 활성화 — @eromnet 멘션 사고 방지 (에디터 무관, git 레벨)
git config core.hooksPath .githooks

# 2) 의존성 설치
npm install
```

## 자주 쓰는 명령

| 목적 | 명령 |
|------|------|
| 플레이그라운드 개발 서버 | `npm run dev` |
| 타입 체크 | `npm run typecheck` |
| 라이브러리 빌드(dist) | `npm run build:lib` |
| 배포 전 내용물 확인 | `npm pack --dry-run` |
| npm 배포 (버전 올린 뒤) | `npm version patch && npm publish` |

## 배포 구조 (참고)

- **플레이그라운드** = Vercel 에 배포됨 (디자이너·개발자 열람용). npm 에는 안 올라감.
- **컴포넌트 라이브러리** = `bo-ui-kit` 로 npm 배포. `files: ["dist"]` 규칙대로 `dist/` 만 올라간다.
- 소스는 한 벌(`src/components/ui/`), 출구만 둘(플레이그라운드 + npm).
