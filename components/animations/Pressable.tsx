"use client";

import type { ButtonHTMLAttributes, ReactNode } from "react";

export function Pressable({ children, className = "", ...props }: ButtonHTMLAttributes<HTMLButtonElement> & { children: ReactNode }) {
  return <button className={`anim-press ${className}`} {...props}>{children}</button>;
}
