export function SectionLabel({ children, className = '' }) {
  return (
    <p className={`text-[11px] font-bold uppercase tracking-[0.16em] text-content-muted ${className}`}>
      {children}
    </p>
  )
}
