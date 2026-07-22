import { useEffect } from 'react'
import { motion } from 'framer-motion'
import { Logo } from '../components/Logo'

export function Splash({ onDone }) {
  useEffect(() => {
    const t = setTimeout(onDone, 2600)
    return () => clearTimeout(t)
  }, [onDone])

  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 1.04 }}
      transition={{ duration: 0.5, ease: 'easeInOut' }}
      className="absolute inset-0 flex flex-col items-center justify-center overflow-hidden"
      style={{ background: 'linear-gradient(160deg, #7c5cff 0%, #5b3ce6 45%, #3d26b4 100%)' }}
    >
      <div className="absolute -top-16 -left-10 h-64 w-64 rounded-full bg-white/15 blur-[80px]" />
      <div className="absolute bottom-10 -right-12 h-72 w-72 rounded-full bg-accent-500/30 blur-[90px]" />
      <motion.div
        initial={{ scale: 0.6, opacity: 0.5 }}
        animate={{ scale: 1.4, opacity: 0 }}
        transition={{ duration: 1.8, repeat: Infinity, ease: 'easeOut' }}
        className="absolute h-40 w-40 rounded-full border border-white/30"
      />
      <motion.div
        initial={{ scale: 0.6, opacity: 0, rotate: -10 }}
        animate={{ scale: 1, opacity: 1, rotate: 0 }}
        transition={{ type: 'spring', stiffness: 200, damping: 16, delay: 0.1 }}
      >
        <Logo className="h-24 w-24 drop-shadow-[0_18px_40px_rgba(0,0,0,0.35)]" />
      </motion.div>
      <motion.div
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.45, duration: 0.5 }}
        className="mt-7 text-center"
      >
        <h1 className="text-[2rem] font-extrabold tracking-[0.2em] text-white">ГАСТРОНОМИЧЕСКИЙ СПЕКТАКЛЬ</h1>
        <p className="mt-1 text-[13px] font-medium tracking-wide text-white/70">Панель администратора</p>
      </motion.div>
      <div className="absolute bottom-16 left-0 right-0 flex flex-col items-center">
        <div className="h-1 w-36 overflow-hidden rounded-full bg-white/20">
          <motion.div
            initial={{ width: '0%' }}
            animate={{ width: '100%' }}
            transition={{ duration: 2.2, ease: 'easeInOut' }}
            className="h-full rounded-full bg-white"
          />
        </div>
      </div>
    </motion.div>
  )
}
