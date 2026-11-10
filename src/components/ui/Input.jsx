import { cloneElement, isValidElement } from "react";
import { cn } from "../../lib/utils";
export function Input({ className, ...props }) {
  return (
    <input
      className={cn(
        "h-12 w-full rounded-[4px] border border-[#949494] bg-white px-3 text-[14px] leading-[24.5px] text-[#1c383c] outline-none placeholder:text-[#666666] focus:border-[#154e55] focus:ring-1 focus:ring-[#154e55]",
        className,
      )}
      {...props}
    />
  );
}
export function Field({ label, hint, children, className = "" }) {
  return (
    <label
      className={`flex min-w-0 flex-col gap-1 text-[14px] leading-[24.5px] font-semibold text-[#1c383c] ${className}`}
    >
      <span>{label}</span>
      {isValidElement(children)
        ? cloneElement(children, {
            "aria-label": children.props["aria-label"] || label,
          })
        : children}
      {hint && (
        <span className="text-[12px] leading-[18px] font-normal text-[#666666]">
          {hint}
        </span>
      )}
    </label>
  );
}
