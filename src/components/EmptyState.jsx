export function EmptyState({ icon: Icon, title, body }) {
  return (
    <div className="flex flex-col items-center justify-center px-8 py-16 text-center">
      <div className="grid h-16 w-16 place-items-center rounded-3xl bg-surface-2 text-content-muted">
        <Icon size={28} />
      </div>
      <p className="mt-4 text-base font-bold text-content">{title}</p>
      <p className="mt-1 max-w-[220px] text-sm font-medium text-content-muted">{body}</p>
    </div>
  )
}
