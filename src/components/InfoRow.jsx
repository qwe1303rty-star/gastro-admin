export function InfoRow({ icon: Icon, label, value, action }) {
  return (
    <div className="flex items-center gap-3 py-2.5">
      <div className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-surface-2 text-content-soft">
        <Icon size={17} />
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-[11px] font-semibold uppercase tracking-wide text-content-muted">{label}</p>
        <p className="truncate text-[15px] font-semibold text-content">{value}</p>
      </div>
      {action}
    </div>
  )
}
