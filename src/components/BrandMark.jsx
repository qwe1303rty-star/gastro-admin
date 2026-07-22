export default function BrandMark({ size = 28 }) {
  return (
    <img
      src={`${import.meta.env.BASE_URL}icons/icon-512.png`}
      width={size}
      height={size}
      alt="ГС"
      style={{ filter: 'drop-shadow(0 0 8px rgba(212,175,110,.25))' }}
    />
  )
}
