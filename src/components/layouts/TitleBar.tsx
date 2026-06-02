import { getCurrentWindow } from "@tauri-apps/api/window"

export function TitleBar() {
  const win = getCurrentWindow()

  return (
    <div
      className="flex items-center justify-between px-4 h-8 select-none"
      data-tauri-drag-region
    >
      <span className="text-sm font-semibold text-zinc-400" data-tauri-drag-region>
        PiPass
      </span>

      <div className="flex items-center gap-1">
        <button
          onClick={() => win.minimize()}
          className="w-7 h-7 flex items-center justify-center rounded hover:bg-zinc-700 text-zinc-400 hover:text-white transition-colors"
        >
          ─
        </button>
        <button
          onClick={() => win.toggleMaximize()}
          className="w-7 h-7 flex items-center justify-center rounded hover:bg-zinc-700 text-zinc-400 hover:text-white transition-colors"
        >
          ⬜
        </button>
        <button
          onClick={() => win.close()}
          className="w-7 h-7 flex items-center justify-center rounded hover:bg-red-500 text-zinc-400 hover:text-white transition-colors"
        >
          ✕
        </button>
      </div>
    </div>
  )
}