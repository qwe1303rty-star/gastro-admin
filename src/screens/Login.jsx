import { useState } from 'react'
import { motion } from 'framer-motion'
import { Eye, EyeOff, Lock, Fingerprint, ShieldCheck } from 'lucide-react'
import { Logo } from '../components/Logo'
import { Button } from '../components/ui/Button'

export function Login({ onLogin }) {
  const [pin, setPin] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(false)

  const submit = () => {
    setLoading(true)
    setError(false)
    setTimeout(() => {
      const ok = onLogin(pin)
      if (!ok) {
        setError(true)
        setLoading(false)
      }
    }, 400)
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 0.98 }}
      transition={{ duration: 0.4 }}
      className="absolute inset-0 overflow-y-auto no-scrollbar bg-bg"
    >
      <div className="relative flex flex-col items-center px-8 pb-20 pt-28" style={{ background: 'linear-gradient(160deg, #7c5cff 0%, #5b3ce6 50%, #3d26b4 100%)' }}>
        <div className="absolute -top-10 right-0 h-52 w-52 rounded-full bg-white/10 blur-[70px]" />
        <div className="absolute bottom-0 -left-10 h-48 w-48 rounded-full bg-accent-500/25 blur-[70px]" />
        <motion.div initial={{ scale: 0.7, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ type: 'spring', stiffness: 200, damping: 16 }}>
          <Logo className="h-20 w-20 drop-shadow-[0_16px_36px_rgba(0,0,0,0.3)]" />
        </motion.div>
        <motion.h1 initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="mt-5 text-lg font-extrabold tracking-[0.14em] text-white">
          ГАСТРОНОМИЧЕСКИЙ СПЕКТАКЛЬ
        </motion.h1>
        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.32 }} className="mt-1.5 text-sm font-medium text-white/75">
          Панель управления заказами
        </motion.p>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.25, type: 'spring', stiffness: 120, damping: 18 }}
        className="relative -mt-12 rounded-t-[34px] bg-surface px-6 pb-10 pt-8"
      >
        <div className="mx-auto mb-7 h-1.5 w-12 rounded-full bg-line-strong" />
        <h2 className="text-2xl font-extrabold tracking-tight text-content">Вход в систему</h2>
        <p className="mt-1 text-sm font-medium text-content-muted">Введите PIN-код для доступа</p>

        <div className="mt-7 space-y-4">
          <label className="block">
            <span className="mb-1.5 block text-[13px] font-semibold text-content-soft">PIN-код</span>
            <div className={`flex items-center gap-3 rounded-2xl border bg-surface-2 px-4 focus-within:border-primary-400 transition-colors ${error ? 'border-error-500' : 'border-line'}`}>
              <Lock size={18} className="text-content-muted" />
              <input
                value={pin}
                onChange={(e) => { setPin(e.target.value); setError(false) }}
                type="password"
                inputMode="numeric"
                maxLength={8}
                placeholder="····"
                onKeyDown={(e) => e.key === 'Enter' && pin && submit()}
                autoFocus
                className="w-full bg-transparent py-3.5 text-[28px] font-bold tracking-[0.4em] text-content outline-none text-center placeholder:text-content-muted placeholder:tracking-[0.4em]"
              />
            </div>
            {error && (
              <motion.p initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} className="mt-2 text-[13px] font-semibold text-error-500">
                Неверный PIN-код
              </motion.p>
            )}
          </label>

          <Button full size="lg" loading={loading} onClick={submit} disabled={!pin} className="mt-2">
            Войти
          </Button>
        </div>

        <div className="mt-7 flex items-center justify-center gap-1.5 text-[12px] font-medium text-content-muted">
          <ShieldCheck size={14} /> Безопасное подключение
        </div>
      </motion.div>
    </motion.div>
  )
}
