import type * as React from "react";

/** 컨트롤 패널에 그려질 입력 위젯 스키마 */
export type Control =
  | { type: "select"; name: string; label: string; options: string[]; default: string }
  | { type: "boolean"; name: string; label: string; default: boolean }
  | { type: "text"; name: string; label: string; default: string };

/** 임의의 args 맵 (컨트롤 name → 값) */
export type Args = Record<string, string | boolean>;

/** 하나의 컴포넌트 "스토리" 정의 */
export interface Story {
  /** 탭/제목에 표시될 이름 */
  name: string;
  /** Figma 문서 링크 (선택) */
  docs?: string;
  /** 컨트롤 패널 구성 */
  controls: Control[];
  /** 현재 args 로 미리보기를 렌더 */
  render: (args: Args) => React.ReactNode;
  /** 정적 갤러리(매트릭스) — 기존 형태 유지용 (선택) */
  gallery?: React.ReactNode;
}
