'use client';

import { ModeToggle } from "@/components/mode-toggle";

export default function TestThemePage() {
  return (
    <div className="p-10">
      <h1 className="mb-4 text-2xl font-bold">Theme Toggle Test</h1>
      <ModeToggle />
    </div>
  );
}
