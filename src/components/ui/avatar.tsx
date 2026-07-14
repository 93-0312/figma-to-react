import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../../lib/utils";

/**
 * Avatar — Figma "BO UI Kit" Avatar(node 1696:153). 이미지 + 폴백(이니셜).
 *
 * Figma 변형: Circular(True/False) → `shape` circle/square, Size 24/28/32/36/40/48 → `size`.
 * 폴백 배경=Figma VariableID:5632:2342(#e6eaf0, 2026-07-13 갱신)=프로젝트 `accent`, 텍스트=muted-foreground, medium.
 * `ring`(2px background 색 테두리)은 AvatarGroup 겹침 분리용. 이미지 로드 실패 시 폴백 표시.
 */
const avatarVariants = cva(
  "relative inline-flex shrink-0 select-none items-center justify-center overflow-hidden bg-accent font-medium text-muted-foreground",
  {
    variants: {
      size: {
        xs: "size-6 text-xs",
        sm: "size-7 text-xs",
        md: "size-8 text-sm",
        lg: "size-9 text-sm",
        xl: "size-10 text-base",
        "2xl": "size-12 text-base",
      },
      shape: { circle: "rounded-radius-full", square: "rounded-radius" },
    },
    defaultVariants: { size: "md", shape: "circle" },
  }
);

export interface AvatarProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof avatarVariants> {
  src?: string;
  alt?: string;
  /** 이미지 없음/로드 실패 시 표시할 이니셜 등 */
  fallback?: React.ReactNode;
  /** 2px background 색 테두리(그룹 겹침 분리용) */
  ring?: boolean;
}

const Avatar = React.forwardRef<HTMLDivElement, AvatarProps>(
  ({ className, size, shape, src, alt, fallback, ring, ...props }, ref) => {
    const [errored, setErrored] = React.useState(false);
    const showImage = src && !errored;
    return (
      <div
        ref={ref}
        data-node-id="1696:153"
        className={cn(
          avatarVariants({ size, shape }),
          ring && "ring-2 ring-background",
          className
        )}
        {...props}
      >
        {showImage ? (
          <img
            src={src}
            alt={alt}
            className="size-full object-cover"
            onError={() => setErrored(true)}
          />
        ) : (
          <span>{fallback}</span>
        )}
      </div>
    );
  }
);
Avatar.displayName = "Avatar";

export { Avatar, avatarVariants };
