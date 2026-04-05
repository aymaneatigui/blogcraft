export default function Loading() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-(--background)">
      <div className="flex items-center gap-3 rounded-xl border border-(--border-color) bg-black/30 px-4 py-3 text-sm text-(--light-gray)">
        <div className="h-4 w-4 animate-spin rounded-full border-2 border-(--accent-strong)/30 border-t-(--accent-strong)" />
        Loading BlogCraft...
      </div>
    </div>
  );
}
