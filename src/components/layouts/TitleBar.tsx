import { getCurrentWindow } from "@tauri-apps/api/window";
import { Minus, Square, X } from "lucide-react";
import { useRef } from "react";

export function TitleBar() {
  const win = useRef(getCurrentWindow())

  return (
    <div
      className="fixed top-0 z-50 h-6 w-full flex items-center justify-between select-none bg-muted"
      data-tauri-drag-region
    >
      <span
        className="text-sm font-semibold text-zinc-400 ml-2 pointer-events-none"
        data-tauri-drag-region
      >
        PiPass
      </span>

      <div className="flex items-center gap-1 z-10">
        <button
          onMouseDown={(e) => e.stopPropagation()}
          onClick={() => win.current.minimize()}
          className="w-7 h-7 flex items-center justify-center rounded text-zinc-400 hover:text-white transition-colors"
        >
          <Minus />
        </button>
        <button
          onMouseDown={(e) => e.stopPropagation()}
          onClick={() => win.current.toggleMaximize()}
          className="w-7 h-7 flex items-center justify-center rounded text-zinc-400 hover:text-white transition-colors"
        >
          <Square className="w-4 h-4" />
        </button>
        <button
          onMouseDown={(e) => e.stopPropagation()}
          onClick={() => win.current.close()}
          className="w-7 h-7 flex items-center justify-center rounded text-zinc-400 hover:text-red-400 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
