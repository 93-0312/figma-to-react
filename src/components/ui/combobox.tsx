import * as React from "react";
import { cn } from "../../lib/utils";
import { Input } from "./input";
import { selectTriggerVariants } from "./select";
import type { VariantProps } from "class-variance-authority";

/**
 * ComboBox — Figma "BO UI Kit" ComboBox(node 7758:403, 열린 패널) + ComboBoxItem(7758:172)을
 * 옮긴 검색형 선택 컴포넌트. Select 와 같지만 패널 상단에 검색 Input 이 있고 입력으로
 * 목록을 필터링한다.
 *
 * 구성:
 *  - 트리거: Select 트리거와 동일 토큰(selectTriggerVariants 재사용) — Figma 노드는 열린
 *    패널만 포함하므로 트리거는 Select 관례를 따른다(문서화된 결정).
 *  - 패널: popover 배경, border, rounded-radius-xl, shadow-overlay. 상단 InsideInput
 *    (p-2 + border-b, Input 재사용 — Figma 내부 Input 테두리는 --input 이 아니라 --border) +
 *    목록(p-1, gap-px) + 하단 페이드(Fader, 24px popover 그라데이션).
 *  - 항목(ComboBoxItem): h-28, rounded-radius-lg, px-2px, 좌측 28px 아이콘 프레임(선택 시 체크).
 *
 * ★ ComboBoxItem variant 진리표(Selected × Hover 2×2 — Figma 전 조합 확인):
 * | Selected | Hover | 렌더                                                       |
 * |----------|-------|------------------------------------------------------------|
 * | False    | False | 텍스트 #686f7a(→muted-foreground 근사), 배경 없음, 체크 없음  |
 * | True     | False | 텍스트/체크 info-foreground(#155dfc), 배경 없음               |
 * | False    | True  | 배경 #eff6ff(→primary/8% 근사) + 텍스트 info-foreground, 체크 없음 |
 * | True     | True  | 배경 + 텍스트/체크 info-foreground                            |
 *  → 배경은 Hover(하이라이트)만이 결정하고, 파란 텍스트는 Selected ‖ Hover.
 *
 * 동작: 트리거 클릭 토글 → 검색 Input 포커스. 입력으로 필터, ↑/↓ 하이라이트 이동,
 * Enter 선택, Escape/Tab/바깥 클릭 닫기(트리거 포커스 복귀). 제어·비제어 지원.
 *
 * 접근성/폼: 트리거 role=combobox aria-expanded/aria-controls, 검색 Input 은
 * aria-activedescendant 로 하이라이트 항목을 가리킨다. `name` 지정 시 hidden input.
 *
 * @see https://coss.com/ui/docs/components/combobox
 */
export interface ComboBoxOption {
  value: string;
  label: React.ReactNode;
  disabled?: boolean;
}

/** Figma GroupTitle(7758:271) — 그룹 라벨 + (첫 그룹 제외) 상단 구분선. */
export interface ComboBoxOptionGroup {
  label: React.ReactNode;
  options: ComboBoxOption[];
}

export interface ComboBoxProps
  extends VariantProps<typeof selectTriggerVariants> {
  options: (ComboBoxOption | ComboBoxOptionGroup)[];
  /** 제어 값 */
  value?: string;
  /** 비제어 초기 값 */
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  /** 트리거 placeholder */
  placeholder?: React.ReactNode;
  /** 검색 Input placeholder (Figma "e.g placeholder") */
  searchPlaceholder?: string;
  /** 결과 없음 문구(Figma IsEmpty=True "No items found.") */
  emptyText?: React.ReactNode;
  /** Figma `ShowInsideInput` — 패널 상단 검색 Input 표시(기본 true) */
  showInsideInput?: boolean;
  /** 목록 하단 페이드(Figma Fader — ComboBox 는 기본 표시) */
  fadeBottom?: boolean;
  disabled?: boolean;
  /** 트리거 클래스 */
  className?: string;
  /** 패널 클래스 */
  contentClassName?: string;
  id?: string;
  name?: string;
}

function isGroup(
  entry: ComboBoxOption | ComboBoxOptionGroup
): entry is ComboBoxOptionGroup {
  return (entry as ComboBoxOptionGroup).options !== undefined;
}

function ChevronDown({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      className={className}
      aria-hidden
    >
      <path d="m6 9 6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function CheckMark() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.2"
      className="size-4"
      aria-hidden
    >
      <path d="M20 6 9 17l-5-5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/** Figma solid/magnifying-glass(1637:4310) — tertiary-foreground(#8d95a2) 착색. */
function SearchIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      aria-hidden
    >
      <circle cx="11" cy="11" r="7" />
      <path d="m20 20-3.5-3.5" strokeLinecap="round" />
    </svg>
  );
}

const ComboBox = React.forwardRef<HTMLButtonElement, ComboBoxProps>(
  (
    {
      options,
      value,
      defaultValue,
      onValueChange,
      placeholder = "Select…",
      searchPlaceholder = "Search…",
      emptyText = "No items found.",
      showInsideInput = true,
      fadeBottom = true,
      disabled = false,
      inputSize,
      invalid,
      className,
      contentClassName,
      id,
      name,
    },
    ref
  ) => {
    const isControlled = value !== undefined;
    const [internal, setInternal] = React.useState<string | undefined>(
      defaultValue
    );
    const current = isControlled ? value : internal;

    const [open, setOpen] = React.useState(false);
    const [query, setQuery] = React.useState("");
    const [highlight, setHighlight] = React.useState(0);
    const rootRef = React.useRef<HTMLDivElement>(null);
    const triggerRef = React.useRef<HTMLButtonElement>(null);
    React.useImperativeHandle(ref, () => triggerRef.current as HTMLButtonElement);
    const searchRef = React.useRef<HTMLInputElement>(null);
    const listboxId = React.useId();

    const flatAll = React.useMemo(
      () => options.flatMap((e) => (isGroup(e) ? e.options : [e])),
      [options]
    );
    const selected = flatAll.find((o) => o.value === current);

    const match = (o: ComboBoxOption) =>
      query.trim() === "" ||
      String(typeof o.label === "string" ? o.label : o.value)
        .toLowerCase()
        .includes(query.trim().toLowerCase());

    /** 필터링된 그룹 구조 + 하이라이트 인덱싱용 평탄 목록 */
    const filtered = React.useMemo(() => {
      const groups = options
        .map((e) =>
          isGroup(e)
            ? { label: e.label as React.ReactNode | null, options: e.options.filter(match) }
            : { label: null, options: [e].filter(match) }
        )
        .filter((g) => g.options.length > 0);
      return groups;
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [options, query]);
    const flat = filtered.flatMap((g) => g.options);
    const enabled = flat.filter((o) => !o.disabled);

    const openPanel = () => {
      setQuery("");
      const idx = flat.findIndex((o) => o.value === current && !o.disabled);
      setHighlight(idx >= 0 ? idx : 0);
      setOpen(true);
    };

    const close = (refocus = true) => {
      setOpen(false);
      if (refocus) triggerRef.current?.focus();
    };

    // 바깥 클릭으로 닫기
    React.useEffect(() => {
      if (!open) return;
      const onPointerDown = (e: MouseEvent) => {
        if (rootRef.current && !rootRef.current.contains(e.target as Node)) {
          setOpen(false);
        }
      };
      document.addEventListener("mousedown", onPointerDown);
      return () => document.removeEventListener("mousedown", onPointerDown);
    }, [open]);

    // 열릴 때 검색 Input 포커스
    React.useEffect(() => {
      if (open && showInsideInput) searchRef.current?.focus();
    }, [open, showInsideInput]);

    const choose = (v: string) => {
      if (!isControlled) setInternal(v);
      onValueChange?.(v);
      close();
    };

    const moveHighlight = (dir: 1 | -1) => {
      if (!enabled.length) return;
      const currentFlatIdx = flat[highlight];
      const enabledIdx = enabled.findIndex((o) => o === currentFlatIdx);
      const next =
        enabled[(Math.max(enabledIdx, 0) + dir + enabled.length) % enabled.length];
      setHighlight(flat.indexOf(next));
    };

    const onNavKeyDown = (e: React.KeyboardEvent) => {
      if (e.key === "ArrowDown") {
        e.preventDefault();
        moveHighlight(1);
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        moveHighlight(-1);
      } else if (e.key === "Enter") {
        e.preventDefault();
        const opt = flat[highlight];
        if (opt && !opt.disabled) choose(opt.value);
      } else if (e.key === "Escape" || e.key === "Tab") {
        e.preventDefault();
        close();
      }
    };

    const optionId = (idx: number) => `${listboxId}-opt-${idx}`;
    let flatIdx = -1;

    return (
      <div ref={rootRef} className="relative">
        <button
          ref={triggerRef}
          type="button"
          id={id}
          disabled={disabled}
          role="combobox"
          aria-haspopup="listbox"
          aria-expanded={open}
          aria-controls={listboxId}
          data-node-id="7758:403"
          className={cn(selectTriggerVariants({ inputSize, invalid }), className)}
          onClick={() => (open ? close() : openPanel())}
          onKeyDown={(e) => {
            if (!open) {
              if (e.key === "ArrowDown" || e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                openPanel();
              }
              return;
            }
            // ShowInsideInput=false 면 포커스가 트리거에 남으므로 여기서 내비게이션.
            if (!showInsideInput) onNavKeyDown(e);
          }}
        >
          <span className={cn("truncate", !selected && "text-muted-foreground")}>
            {selected ? selected.label : placeholder}
          </span>
          <ChevronDown
            className={cn(
              "size-4 shrink-0 opacity-50 transition-transform",
              open && "rotate-180"
            )}
          />
        </button>

        {name != null && (
          <input type="hidden" name={name} value={current ?? ""} />
        )}

        {open && (
          <div
            className={cn(
              "absolute left-0 top-full z-50 mt-1 flex w-full flex-col overflow-hidden rounded-radius-xl border border-border bg-popover shadow-overlay",
              contentClassName
            )}
            data-node-id="7758:371"
          >
            {showInsideInput && (
              <div className="border-b border-border p-2">
                <Input
                  ref={searchRef}
                  inputSize="md"
                  // Figma InsideInput 의 Input 테두리는 --border(#e6eaf0) — 기본 --input 과 다름.
                  containerClassName="border-border"
                  leftIcon={
                    <span className="text-tertiary-foreground">
                      <SearchIcon />
                    </span>
                  }
                  placeholder={searchPlaceholder}
                  value={query}
                  onChange={(e) => {
                    setQuery(e.target.value);
                    setHighlight(0);
                  }}
                  onKeyDown={onNavKeyDown}
                  role="combobox"
                  aria-expanded={open}
                  aria-controls={listboxId}
                  aria-activedescendant={
                    flat[highlight] ? optionId(highlight) : undefined
                  }
                  aria-autocomplete="list"
                />
              </div>
            )}

            {flat.length === 0 ? (
              <div
                role="listbox"
                id={listboxId}
                className="flex items-center justify-center p-2 text-xs text-muted-foreground"
              >
                <span className="flex h-5 items-center">{emptyText}</span>
              </div>
            ) : (
              <div className="relative">
                <div
                  role="listbox"
                  id={listboxId}
                  aria-label={typeof placeholder === "string" ? placeholder : undefined}
                  className="flex max-h-64 flex-col gap-px overflow-auto p-1"
                >
                  {filtered.map((group, gi) => (
                    <React.Fragment key={gi}>
                      {group.label != null && (
                        <div
                          role="presentation"
                          className="flex flex-col gap-0.5 px-2"
                          data-node-id="7758:271"
                        >
                          {gi > 0 && (
                            <div className="py-1" role="separator">
                              <div className="border-t border-border" />
                            </div>
                          )}
                          <div className="flex h-7 items-center text-xs font-medium text-muted-foreground">
                            <span className="min-w-0 flex-1 truncate">
                              {group.label}
                            </span>
                          </div>
                        </div>
                      )}
                      {group.options.map((opt) => {
                        flatIdx += 1;
                        const idx = flatIdx;
                        const isSelected = opt.value === current;
                        const isHighlighted = idx === highlight;
                        return (
                          <button
                            key={opt.value}
                            type="button"
                            role="option"
                            id={optionId(idx)}
                            aria-selected={isSelected}
                            disabled={opt.disabled}
                            tabIndex={-1}
                            data-node-id="7758:172"
                            className={cn(
                              "flex h-7 w-full items-center gap-0.5 rounded-radius-lg px-0.5 text-left text-xs font-medium outline-none transition-colors",
                              "disabled:pointer-events-none disabled:opacity-[0.64]",
                              // 파란 텍스트 = Selected ‖ Hover(하이라이트) — Figma 진리표.
                              isSelected || isHighlighted
                                ? "text-info-foreground"
                                : "text-muted-foreground",
                              // 배경은 하이라이트(Hover)만 결정 — #eff6ff ≈ primary/8%.
                              isHighlighted && "bg-primary/[0.08]"
                            )}
                            onMouseEnter={() => setHighlight(idx)}
                            onClick={() => choose(opt.value)}
                          >
                            <span className="flex size-7 shrink-0 items-center justify-center">
                              {isSelected ? <CheckMark /> : null}
                            </span>
                            <span className="min-w-0 flex-1 truncate">
                              {opt.label}
                            </span>
                          </button>
                        );
                      })}
                    </React.Fragment>
                  ))}
                </div>
                {fadeBottom && (
                  // Figma Fader(7758:222) — 하단 24px popover 그라데이션.
                  <div
                    aria-hidden
                    className="pointer-events-none absolute inset-x-px bottom-0 h-6 rounded-b-radius-xl bg-gradient-to-t from-popover to-transparent"
                  />
                )}
              </div>
            )}
          </div>
        )}
      </div>
    );
  }
);
ComboBox.displayName = "ComboBox";

export { ComboBox };
