import { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import BrandMark from './BrandMark'
import { IconMail, IconLock, IconEye, IconArrowRight, IconShield, IconCheck } from './Icons'

export default function LoginScreen() {
  const { login } = useAuth()
  const [pin, setPin] = useState('')
  const [error, setError] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!pin) return
    setLoading(true)
    setError(false)
    setTimeout(() => {
      if (!login(pin)) {
        setError(true)
        setLoading(false)
      }
    }, 300)
  }

  return (
    <div className="app-screen" style={{ justifyContent: 'center', paddingBottom: 0 }}>
      <div style={{ padding: '24px 24px 40px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: 40 }}>
          <BrandMark size={64} />
          <div className="eyebrow" style={{ marginTop: 18 }}>ADMIN CONSOLE</div>
        </div>

        <div style={{ marginBottom: 28 }}>
          <div className="h2 serif">Добро пожаловать <span style={{ fontStyle: 'italic' }}>обратно</span></div>
          <div className="small" style={{ marginTop: 8, color: 'var(--text-mute)' }}>
            Войдите, чтобы управлять заказами и работой ресторана.
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <div>
              <div className="micro" style={{ marginBottom: 8, letterSpacing: '0.08em', textTransform: 'uppercase' }}>PIN-код</div>
              <div className="input-wrap">
                <IconLock width={18} height={18} style={{ color: 'var(--text-mute)' }}/>
                <input
                  type="password"
                  inputMode="numeric"
                  maxLength={4}
                  placeholder="••••"
                  value={pin}
                  onChange={(e) => { setPin(e.target.value.replace(/\D/g, '').slice(0, 4)); setError(false) }}
                  autoFocus
                  style={{ letterSpacing: '0.3em', fontSize: 18, textAlign: 'center' }}
                />
              </div>
            </div>

            {error && (
              <p style={{ color: 'var(--error)', fontSize: 13, textAlign: 'center', animation: 'fadeIn .3s ease' }}>
                Неверный код
              </p>
            )}
          </div>

          <div style={{ flex: 1 }}/>

          <button
            type="submit"
            className="btn btn--primary btn--full"
            disabled={pin.length < 4 || loading}
            style={{ marginTop: 32, opacity: pin.length < 4 ? 0.5 : 1 }}
          >
            {loading ? 'Входим...' : 'Войти в консоль'}
            <IconArrowRight width={18} height={18}/>
          </button>
        </form>

        <div className="gold-line" style={{ margin: '20px 0 14px' }}/>

        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 6 }}>
          <IconShield width={14} height={14} style={{ color: 'var(--gold)' }}/>
          <span className="micro">Защищено PIN-кодом</span>
        </div>
      </div>
    </div>
  )
}
