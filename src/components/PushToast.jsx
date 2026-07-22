import { AnimatePresence, motion } from 'framer-motion'
import { ShoppingBag, X } from 'lucide-react'
import { BRAND } from '../config'

export function PushToast({ toast, onDismiss, onOpenOrder }) {
  return (
    <AnimatePresence>
      {toast && (
        <motion.div
          initial={{ y: -90, opacity: 0, scale: 0.92 }}
          animate={{ y: 0, opacity: 1, scale: 1 }}
          exit={{ y: -90, opacity: 0, scale: 0.95 }}
          transition={{ type: 'spring', stiffness: 380, damping: 30 }}
          className="absolute inset-x-3 top-12 z-[60]"
        >
          <div className="glass overflow-hidden rounded-3xl border border-line shadow-float">
            <div className="flex items-center gap-3 p-3.5">
              <div className="relative grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-gradient-to-br from-primary-400 to-primary-700 text-white">
                <ShoppingBag size={22} />
                <motion.span
                  animate={{ scale: [1, 1.5, 1], opacity: [0.6, 0, 0.6] }}
                  transition={{ duration: 1.8, repeat: Infinity }}
                  className="absolute inset-0 rounded-2xl bg-primary-500"
                />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-[11px] font-bold uppercase tracking-wide text-primary-300">{BRAND.short} · новый заказ</p>
                <p className="truncate text-[14px] font-extrabold text-content">{toast.title}</p>
                <p className="truncate text-[12px] font-medium text-content-muted">{toast.body}</p>
              </div>
              {toast.orderId && (
                <motion.button
                  whileTap={{ scale: 0.9 }}
                  onClick={() => {
                    onOpenOrder(toast.orderId)
                    onDismiss()
                  }}
                  className="shrink-0 rounded-xl bg-primary-500/20 px-3 py-2 text-[12px] font-bold text-primary-300"
                >
                  Открыть
                </motion.button>
              )}
              <button onClick={onDismiss} className="shrink-0 text-content-muted">
                <X size={16} />
              </button>
            </div>
            <motion.div
              initial={{ scaleX: 1 }}
              animate={{ scaleX: 0 }}
              transition={{ duration: 5, ease: 'linear' }}
              className="h-0.5 origin-left bg-primary-500"
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
