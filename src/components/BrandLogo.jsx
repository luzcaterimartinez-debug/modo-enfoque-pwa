import { cn } from "@/lib/utils";

export function BrandLogo({ size = "md", className, glow = true }) {
  const box =
    size === "sm" ? "h-9 w-9" : size === "lg" ? "h-14 w-14" : "h-10 w-10";
  const icon = size === "sm" ? 22 : size === "lg" ? 34 : 26;

  return (
    <div
      className={cn(
        "relative grid shrink-0 place-items-center rounded-2xl",
        box,
        glow && "brand-logo-glow",
        className,
      )}
    >
      <svg
        width={icon}
        height={icon}
        viewBox="0 0 48 48"
        fill="none"
        aria-hidden="true"
        className="relative z-10"
      >
        <circle cx="24" cy="24" r="5" stroke="currentColor" strokeWidth="1.5" className="text-primary" />
        <circle cx="24" cy="24" r="2" fill="currentColor" className="text-primary" />
        <path
          d="M24 8C24 8 18 14 18 20C18 23 20.5 25.5 24 26C27.5 25.5 30 23 30 20C30 14 24 8 24 8Z"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinejoin="round"
          className="text-white"
        />
        <path
          d="M24 40C24 40 14 34 12 26C11 22 13 18 16 16"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          className="text-white/90"
        />
        <path
          d="M24 40C24 40 34 34 36 26C37 22 35 18 32 16"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          className="text-white/90"
        />
        <path
          d="M8 24C8 24 14 18 20 18C23 18 25.5 20.5 26 24C25.5 27.5 23 30 20 30C14 30 8 24 8 24Z"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinejoin="round"
          className="text-white/75"
        />
        <path
          d="M40 24C40 24 34 18 28 18C25 18 22.5 20.5 22 24C22.5 27.5 25 30 28 30C34 30 40 24 40 24Z"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinejoin="round"
          className="text-white/75"
        />
      </svg>
    </div>
  );
}

export function BrandMark({ subtitle = "Estudia con calma", compact = false }) {
  return (
    <div className="flex items-center gap-2.5">
      <BrandLogo size={compact ? "sm" : "md"} />
      <div className="min-w-0">
        <div className={cn("font-display font-bold leading-none text-white", compact ? "text-base" : "text-xl")}>
          Modo Enfoque
        </div>
        {subtitle && (
          <div className="text-[10px] text-primary/90 sm:text-xs">{subtitle}</div>
        )}
      </div>
    </div>
  );
}
