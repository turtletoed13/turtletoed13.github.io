"use client";

import type { ReactNode } from "react";

export function FadeScale({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <div className={`anim-fade-scale ${className}`}>{children}</div>;
}
