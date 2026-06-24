"use client";

import { useState, useRef, useEffect } from "react";
import { cn } from "@/lib/utils";

interface Item {
  label: string;
  onClick: () => void;
  variant?: "default" | "danger";
  icon?: React.ReactNode;
}

interface DropdownMenuProps {
  trigger: React.ReactNode;
  items: Item[];
  align?: "left" | "right";
}

export function DropdownMenu({ trigger, items, align = "right" }: DropdownMenuProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  return (
    <div ref={ref} className="relative inline-block">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="inline-flex items-center justify-center rounded-lg p-2 text-zinc-500 transition-colors hover:bg-zinc-100 hover:text-zinc-700 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-zinc-200 cursor-pointer"
      >
        {trigger}
      </button>

      {open && (
        <div
          className={cn(
            "absolute z-50 mt-1 min-w-40 rounded-lg border border-zinc-200 bg-white py-1 shadow-lg dark:border-zinc-700 dark:bg-zinc-900",
            align === "right" ? "right-0" : "left-0"
          )}
        >
          {items.map((item, i) => (
            <button
              key={i}
              type="button"
              onClick={() => {
                item.onClick();
                setOpen(false);
              }}
              className={cn(
                "flex w-full items-center gap-2 px-4 py-2 text-left text-sm transition-colors cursor-pointer",
                item.variant === "danger"
                  ? "text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-950/50"
                  : "text-zinc-700 hover:bg-zinc-50 dark:text-zinc-300 dark:hover:bg-zinc-800"
              )}
            >
              {item.icon}
              {item.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
