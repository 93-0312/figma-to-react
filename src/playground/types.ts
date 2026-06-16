import type * as React from "react";

/** 컨트롤 패널에 그려질 입력 위젯 스키마 */
export type Control =
  | { type: "select"; name: string; label: string; options: string[]; default: string }
  | { type: "boolean"; name: string; label: string; default: boolean }
  | { type: "text"; name: string; label: string; default: string };

/** 임의의 args 맵 (컨트롤 name → 값) */
export type Args = Record<string, string | boolean>;

/** 미리보기 → 컨트롤 역방향 동기화용 setter (예: 미리보기 클릭 시 컨트롤 값 갱신) */
export type SetArg = (name: string, value: string | boolean) => void;

/** 하나의 컴포넌트 "스토리" 정의 */
export interface Story {
  /** 탭/제목에 표시될 이름 */
  name: string;
  /** Figma 문서 링크 (선택) */
  docs?: string;
  /** 컨트롤 패널 구성 */
  controls: Control[];
  /**
   * 현재 args 로 미리보기를 렌더.
   * `setArg` 로 미리보기 상호작용을 컨트롤에 역방향 동기화할 수 있다(선택).
   */
  render: (args: Args, setArg: SetArg) => React.ReactNode;
  /** 정적 갤러리(매트릭스) — 기존 형태 유지용 (선택) */
  gallery?: React.ReactNode;
}
