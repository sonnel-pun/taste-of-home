"use client";

import { TouchButton } from "@/components/ui/TouchButton";

export default function TestPage() {
  return (
    <div className="p-8 max-w-md mx-auto">
      <h1 className="text-xl font-bold mb-6">Touch Test v2</h1>
      
      <TouchButton
        variant="card"
        className="mb-4 bg-accent text-white font-bold"
        onPress={() => alert("TouchButton WORKS!")}
      >
        TouchButton with pointerdown
      </TouchButton>

      <button
        type="button"
        onClick={() => alert("Native button WORKS!")}
        className="block w-full mb-4 p-4 bg-green-500 text-white rounded-xl text-lg font-bold"
        style={{ cursor: "pointer", WebkitTapHighlightColor: "transparent", touchAction: "manipulation" }}
      >
        Native HTML button (onClick)
      </button>

      <a
        href="https://google.com"
        className="block w-full mb-4 p-4 bg-purple-500 text-white rounded-xl text-lg font-bold text-center"
        style={{ cursor: "pointer" }}
      >
        Native link (to Google)
      </a>

      <p className="text-sm text-muted mt-8">
        If TouchButton works but native button doesn't, the fix is confirmed.
      </p>
    </div>
  );
}
