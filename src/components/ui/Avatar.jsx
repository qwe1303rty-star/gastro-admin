export function Avatar({ initials, size = 44, className = '' }) {
  return (
    <div
      className={`grid place-items-center rounded-full bg-gradient-to-br from-primary-400 to-primary-700 font-bold text-white ${className}`}
      style={{ width: size, height: size, fontSize: size * 0.36 }}
    >
      {initials}
    </div>
  )
}
