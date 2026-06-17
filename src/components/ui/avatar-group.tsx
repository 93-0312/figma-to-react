import * as React from "react";
import { cn } from "../../lib/utils";
import { Avatar, type AvatarProps } from "./avatar";

/**
 * AvatarGroup — Figma "BO UI Kit" AvatarGroup(node 1696:220). Avatar 겹쳐 쌓기.
 *
 * 자식 Avatar 들을 음수 마진으로 겹치고 각자 2px background 테두리(ring)로 분리한다.
 * `size` 를 자식에 주입(자식이 명시하면 우선), `max` 초과분은 "+N" 아바타로 요약.
 */
export interface AvatarGroupProps extends React.HTMLAttributes<HTMLDivElement> {
  /** 그룹 공통 아바타 크기(자식에 주입) */
  size?: AvatarProps["size"];
  /** 표시할 최대 개수, 초과분은 +N */
  max?: number;
}

const AvatarGroup = React.forwardRef<HTMLDivElement, AvatarGroupProps>(
  ({ className, size = "md", max, children, ...props }, ref) => {
    const items = React.Children.toArray(children).filter(
      React.isValidElement
    ) as React.ReactElement<AvatarProps>[];
    const shown = max != null ? items.slice(0, max) : items;
    const rest = max != null ? items.length - shown.length : 0;
    return (
      <div
        ref={ref}
        data-node-id="1696:220"
        className={cn(
          "flex items-center [&>*:not(:first-child)]:-ml-3",
          className
        )}
        {...props}
      >
        {shown.map((child, i) =>
          React.cloneElement(child, {
            key: child.key ?? i,
            ring: true,
            size: child.props.size ?? size,
          })
        )}
        {rest > 0 && <Avatar size={size} ring fallback={`+${rest}`} />}
      </div>
    );
  }
);
AvatarGroup.displayName = "AvatarGroup";

export { AvatarGroup };
