import { useState } from 'react'
import { useAuth } from '../context/AuthContext'

const dots = [0, 1, 2, 3]

export default function PinScreen() {
  const { login } = useAuth()
  const [pin, setPin] = useState('')
  const [error, setError] = useState(false)

  const handleDigit = (d) => {
    if (pin.length >= 4) return
    const next = pin + d
    setPin(next)
    setError(false)
    if (next.length === 4) {
      setTimeout(() => {
        if (!login(next)) {
          setError(true)
          setPin('')
        }
      }, 200)
    }
  }

  const handleDelete = () => {
    setPin((p) => p.slice(0, -1))
    setError(false)
  }

  return (
    <div className="fixed inset-0 bg-dark flex flex-col items-center justify-center px-8">
      <div className="mb-10 text-center">
        <div className="w-14 h-14 mx-auto mb-4 rounded-full border border-gold/40 flex items-center justify-center">
          <span className="font-mono text-gold text-lg font-medium">ГС</span>
        </div>
        <h1 className="text-[18px] font-light text-text">Введите PIN-код</h1>
      </div>

      <div className="flex gap-4 mb-10">
        {dots.map((i) => (
          <div
            key={i}
            className={`w-3 h-3 rounded-full transition-all duration-200 ${
              error
                ? 'bg-red-500'
                : i < pin.length
                ? 'bg-gold scale-110'
                : 'bg-border'
            }`}
          />
        ))}
      </div>

      {error && (
        <p className="text-red-400 text-[13px] mb-4 animate-pulse">
          Неверный код
        </p>
      )}

      <div className="grid grid-cols-3 gap-4 w-[240px]">
        {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((d) => (
          <button
            key={d}
            onClick={() => handleDigit(String(d))}
            className="w-[72px] h-[72px] rounded-full bg-card border border-border text-text text-[22px] font-light
                       active:bg-gold active:text-dark active:border-gold transition-all duration-150"
          >
            {d}
          </button>
        ))}
        <div />
        <button
          onClick={() => handleDigit('0')}
          className="w-[72px] h-[72px] rounded-full bg-card border border-border text-text text-[22px] font-light
                     active:bg-gold active:text-dark active:border-gold transition-all duration-150"
        >
          0
        </button>
        <button
          onClick={handleDelete}
          className="w-[72px] h-[72px] rounded-full flex items-center justify-center text-muted
                     active:text-text transition-colors duration-150"
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 4H8l-7 8 7 8h13a2 2 0 002-2V6a2 2 0 00-2-2z" />
            <line x1="18" y1="9" x2="12" y2="15" />
            <line x1="12" y1="9" x2="18" y2="15" />
          </svg>
        </button>
      </div>
    </div>
  )
}
