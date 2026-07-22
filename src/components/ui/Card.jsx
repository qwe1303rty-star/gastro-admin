export function Card({ children, className = '', glass = false, onClick }) {
  return (
    <div
      onClick={onClick}
      className={`${glass ? 'glass' : 'bg-surface'} rounded-2xl border border-line ${onClick ? 'tap cursor-pointer' : ''} ${className}`}
    >
      {children}
    </div>
  )
}
