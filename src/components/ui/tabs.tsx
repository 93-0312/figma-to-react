import * as React from "react";
import { cn } from "../../lib/utils";

/**
 * Tabs — Figma "BO UI Kit" Tabs(node 7722:82). 관련 패널 전환.
 *
 * Type: Default(알약 — bg-accent 트랙 + 선택 탭 흰 카드+shadow) / WithLine(밑줄).
 * 합성: Tabs(상태) > TabsList > TabsTrigger / TabsContent. (Figma VariableID:5632:2342 #f1f5f9 = accent.)
 * 제어/비제어(value/defaultValue/onValueChange).
 */
type TabsVariant = "default" | "line";
interface TabsContextValue {
  value?: string;
  setValue: (v: string) => void;
  variant: TabsVariant;
}
const TabsContext = React.createContext<TabsContextValue | null>(null);
const useTabs = () => {
  const c = React.useContext(TabsContext);
  if (!c) throw new Error("Tabs components must be used within <Tabs>");
  return c;
};

export interface TabsProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "onChange"> {
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  variant?: TabsVariant;
}

const Tabs = React.forwardRef<HTMLDivElement, TabsProps>(
  ({ className, value, defaultValue, onValueChange, variant = "default", children, ...props }, ref) => {
    const isControlled = value !== undefined;
    const [internal, setInternal] = React.useState(defaultValue);
    const current = isControlled ? value : internal;
    return (
      <TabsContext.Provider
        value={{
          value: current,
          variant,
          setValue: (v) => {
            if (!isControlled) setInternal(v);
            onValueChange?.(v);
          },
        }}
      >
        <div ref={ref} data-node-id="7722:82" className={cn("flex flex-col gap-3", className)} {...props}>
          {children}
        </div>
      </TabsContext.Provider>
    );
  }
);
Tabs.displayName = "Tabs";

const TabsList = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => {
    const { variant } = useTabs();
    return (
      <div
        ref={ref}
        role="tablist"
        className={cn(
          "inline-flex items-center",
          variant === "default"
            ? "gap-0.5 rounded-radius-lg bg-accent p-0.5"
            : "gap-1 border-b border-border",
          className
        )}
        {...props}
      />
    );
  }
);
TabsList.displayName = "TabsList";

export interface TabsTriggerProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  value: string;
}
const TabsTrigger = React.forwardRef<HTMLButtonElement, TabsTriggerProps>(
  ({ className, value, ...props }, ref) => {
    const { value: current, setValue, variant } = useTabs();
    const active = current === value;
    return (
      <button
        ref={ref}
        type="button"
        role="tab"
        aria-selected={active}
        data-state={active ? "active" : "inactive"}
        onClick={() => setValue(value)}
        className={cn(
          "inline-flex min-w-9 items-center justify-center gap-1 text-sm font-medium outline-none transition-colors",
          "focus-visible:ring-[3px] focus-visible:ring-offset-0 focus-visible:ring-disabled/[0.07] disabled:pointer-events-none disabled:opacity-[0.64]",
          variant === "default"
            ? cn(
                "rounded-radius-lg px-2 py-1.5",
                active ? "bg-card text-foreground shadow-xs" : "text-muted-foreground hover:text-foreground"
              )
            : cn(
                "-mb-px border-b-2 px-2 pb-2",
                active ? "border-foreground text-foreground" : "border-transparent text-muted-foreground hover:text-foreground"
              ),
          className
        )}
        {...props}
      />
    );
  }
);
TabsTrigger.displayName = "TabsTrigger";

export interface TabsContentProps extends React.HTMLAttributes<HTMLDivElement> {
  value: string;
}
const TabsContent = React.forwardRef<HTMLDivElement, TabsContentProps>(
  ({ className, value, ...props }, ref) => {
    const { value: current } = useTabs();
    if (current !== value) return null;
    return <div ref={ref} role="tabpanel" className={cn("text-sm text-foreground", className)} {...props} />;
  }
);
TabsContent.displayName = "TabsContent";

export { Tabs, TabsList, TabsTrigger, TabsContent };
