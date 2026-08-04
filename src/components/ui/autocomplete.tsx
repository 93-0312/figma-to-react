import * as React from "react";
import { cn } from "../../lib/utils";
import { Input, type InputProps } from "./input";

/**
 * Autocomplete — Figma "BO UI Kit" Autocomplete(node 7757:187, 제안 패널) +
 * AutoCompleteItem(7757:91)을 옮긴 자동완성 입력.
 *
 * 구성:
 *  - 입력부: 디자인 시스템 Input 재사용(Figma Autocomplete 노드는 패널만 포함 —
 *    ComboBox 의 InsideInput 관례를 따른 문서화된 결정).
 *  - 패널: popover 배경, border, rounded-radius-xl, shadow-overlay, p-1, gap-px.
 *  - 항목(AutoCompleteItem): h-28, rounded-radius-lg, px-2, text-xs medium,
 *    텍스트 accent-foreground(#2b7fff — Select 항목과 동일 토큰).
 *
 * ★ AutoCompleteItem variant 진리표(Highlight 2조합):
 * | Highlight | 렌더                                        |
 * |-----------|---------------------------------------------|
 * | False     | 텍스트 accent-foreground, 배경 없음           |
 * | True      | + 배경 #eff6ff(→primary/8% 근사)             |
 *
 * Figma `IsEmpty` variant: 결과 없으면 p-2 중앙 "No items found."(muted-foreground, 400).
 * Figma `FadeOnBot`(기본 false): 패널 하단 24px popover 그라데이션 페이드.
 *
 * 동작: 입력하면 열리고 포함 검색으로 필터. ↑/↓ 하이라이트, Enter 선택(입력값 반영),
 * Escape 닫기, 바깥 클릭 닫기. 입력 텍스트 제어·비제어 지원.
 *
 * 접근성/폼: input 이 combobox(aria-expanded/aria-controls/aria-activedescendant,
 * aria-autocomplete=list). `name` 은 눈에 보이는 input 에 그대로 실려 폼 제출된다.
 *
 * @see https://coss.com/ui/docs/components/autocomplete
 */
export interface AutocompleteOption {
  value: string;
  label?: React.ReactNode;
}

export interface AutocompleteProps
  extends Omit<InputProps, "value" | "defaultValue" | "onChange" | "onSelect"> {
  /** 제안 목록 */
  options: (string | AutocompleteOption)[];
  /** 입력 텍스트(제어) */
  value?: string;
  /** 비제어 초기 텍스트 */
  defaultValue?: string;
  /** 입력/선택으로 텍스트가 바뀔 때 */
  onValueChange?: (value: string) => void;
  /** 항목 확정(Enter/클릭) 시 */
  onSelect?: (value: string) => void;
  /** 결과 없음 문구(Figma IsEmpty=True) */
  emptyText?: React.ReactNode;
  /** Figma `FadeOnBot` — 패널 하단 페이드(기본 false) */
  fadeOnBottom?: boolean;
  /** 패널 클래스 */
  contentClassName?: string;
}

const Autocomplete = React.forwardRef<HTMLInputElement, AutocompleteProps>(
  (
    {
      options,
      value,
      defaultValue = "",
      onValueChange,
      onSelect,
      emptyText = "No items found.",
      fadeOnBottom = false,
      contentClassName,
      onKeyDown,
      onFocus,
      disabled,
      ...inputProps
    },
    ref
  ) => {
    const isControlled = value !== undefined;
    const [internal, setInternal] = React.useState(defaultValue);
    const text = isControlled ? value : internal;

    const [open, setOpen] = React.useState(false);
    const [highlight, setHighlight] = React.useState(0);
    const rootRef = React.useRef<HTMLDivElement>(null);
    const inputRef = React.useRef<HTMLInputElement>(null);
    React.useImperativeHandle(ref, () => inputRef.current as HTMLInputElement);
    const listboxId = React.useId();

    const normalized = React.useMemo(
      () =>
        options.map((o) =>
          typeof o === "string"
            ? { value: o, label: o as React.ReactNode }
            : { value: o.value, label: o.label ?? o.value }
        ),
      [options]
    );
    const filtered = React.useMemo(() => {
      const q = text.trim().toLowerCase();
      if (q === "") return normalized;
      return normalized.filter((o) => o.value.toLowerCase().includes(q));
    }, [normalized, text]);

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

    const setText = (v: string) => {
      if (!isControlled) setInternal(v);
      onValueChange?.(v);
    };

    const choose = (v: string) => {
      setText(v);
      onSelect?.(v);
      setOpen(false);
      inputRef.current?.focus();
    };

    const moveHighlight = (dir: 1 | -1) => {
      if (!filtered.length) return;
      setHighlight((h) => (h + dir + filtered.length) % filtered.length);
    };

    const optionId = (idx: number) => `${listboxId}-opt-${idx}`;

    return (
      <div ref={rootRef} className="relative">
        <Input
          ref={inputRef}
          disabled={disabled}
          value={text}
          onChange={(e) => {
            setText(e.target.value);
            setHighlight(0);
            setOpen(true);
          }}
          onFocus={(e) => {
            setOpen(true);
            onFocus?.(e);
          }}
          onKeyDown={(e) => {
            if (e.key === "ArrowDown") {
              e.preventDefault();
              if (!open) setOpen(true);
              else moveHighlight(1);
            } else if (e.key === "ArrowUp") {
              e.preventDefault();
              moveHighlight(-1);
            } else if (e.key === "Enter") {
              if (open && filtered[highlight]) {
                e.preventDefault();
                choose(filtered[highlight].value);
              }
            } else if (e.key === "Escape") {
              setOpen(false);
            }
            onKeyDown?.(e);
          }}
          role="combobox"
          aria-expanded={open}
          aria-controls={listboxId}
          aria-activedescendant={
            open && filtered[highlight] ? optionId(highlight) : undefined
          }
          aria-autocomplete="list"
          data-node-id="7757:187"
          {...inputProps}
        />

        {open && (
          <div
            className={cn(
              "absolute left-0 top-full z-50 mt-1 w-full overflow-hidden rounded-radius-xl border border-border bg-popover shadow-overlay",
              contentClassName
            )}
            data-node-id="7757:186"
          >
            {filtered.length === 0 ? (
              // Figma IsEmpty=True(7757:188): p-2 중앙, muted-foreground, 400.
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
                  className="flex max-h-64 flex-col gap-px overflow-auto p-1"
                >
                  {filtered.map((opt, idx) => {
                    const isHighlighted = idx === highlight;
                    return (
                      <button
                        key={opt.value}
                        type="button"
                        role="option"
                        id={optionId(idx)}
                        aria-selected={isHighlighted}
                        tabIndex={-1}
                        data-node-id="7757:91"
                        className={cn(
                          "flex h-7 w-full items-center gap-0.5 rounded-radius-lg px-2 text-left text-xs font-medium text-accent-foreground outline-none transition-colors",
                          // Highlight=True — bg #eff6ff ≈ primary/8%.
                          isHighlighted && "bg-primary/[0.08]"
                        )}
                        onMouseEnter={() => setHighlight(idx)}
                        onClick={() => choose(opt.value)}
                      >
                        <span className="min-w-0 flex-1 truncate">
                          {opt.label}
                        </span>
                      </button>
                    );
                  })}
                </div>
                {fadeOnBottom && (
                  // Figma Fader(7757:143, FadeOnBot=True 시 표시) — 하단 24px 그라데이션.
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
Autocomplete.displayName = "Autocomplete";

export { Autocomplete };
