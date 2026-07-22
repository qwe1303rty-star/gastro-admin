import { motion } from 'framer-motion'
import { Bell, ChevronRight, LogOut, Moon, Sun, Volume2, Zap, Building2, KeyRound, ShieldCheck, Smartphone } from 'lucide-react'
import { Avatar } from '../components/ui/Avatar'
import { Button } from '../components/ui/Button'
import { Card } from '../components/ui/Card'
import { SectionLabel } from '../components/ui/SectionLabel'
import { Switch } from '../components/ui/Switch'
import { TopBar } from '../components/TopBar'
import { Logo } from '../components/Logo'
import { BRAND } from '../config'

function ToggleRow({ icon: Icon, title, desc, checked, onChange }) {
  return (
    <div className="flex items-center gap-3 py-3.5">
      <div className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-surface-2 text-content-soft">
        <Icon size={17} />
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-[14px] font-semibold text-content">{title}</p>
        <p className="text-[12px] font-medium text-content-muted">{desc}</p>
      </div>
      <Switch checked={checked} onChange={onChange} />
    </div>
  )
}

function NavRow({ icon: Icon, label, value }) {
  return (
    <button className="flex w-full items-center gap-3 py-3.5">
      <div className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-surface-2 text-content-soft">
        <Icon size={17} />
      </div>
      <span className="flex-1 text-left text-[14px] font-semibold text-content">{label}</span>
      {value && <span className="text-[13px] font-medium text-content-muted">{value}</span>}
      <ChevronRight size={18} className="text-content-muted" />
    </button>
  )
}

export function Settings({ settings, updateSettings, simulateNewOrder, logout }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 14 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -14 }}
      transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
      className="absolute inset-0 flex flex-col"
    >
      <TopBar title="Настройки" subtitle="Параметры приложения" />

      <div className="no-scrollbar flex-1 overflow-y-auto px-5 pb-28 pt-1">
        <Card className="relative overflow-hidden p-5">
          <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-primary-500/10 blur-2xl" />
          <div className="relative flex items-center gap-4">
            <Logo className="h-14 w-14" />
            <div className="min-w-0 flex-1">
              <p className="truncate text-lg font-extrabold tracking-tight text-content">{BRAND.short}</p>
              <p className="truncate text-[13px] font-semibold text-primary-300">Администратор</p>
              <p className="mt-0.5 truncate text-[12px] font-medium text-content-muted">{BRAND.name}</p>
            </div>
          </div>
        </Card>

        <div className="mt-6">
          <SectionLabel className="mb-3 block">Уведомления</SectionLabel>
          <Card className="divide-y divide-line px-4 py-1">
            <ToggleRow icon={Bell} title="Push-уведомления" desc="Новые заказы в реальном времени" checked={settings.push} onChange={(v) => updateSettings({ push: v })} />
            <ToggleRow icon={Volume2} title="Звук" desc="Звуковой сигнал при новом заказе" checked={settings.sound} onChange={(v) => updateSettings({ sound: v })} />
            <ToggleRow icon={Smartphone} title="Вибрация" desc="Вибрация при новом заказе" checked={settings.vibrate !== false} onChange={(v) => updateSettings({ vibrate: v })} />
          </Card>
        </div>

        <Button full variant="soft" size="md" className="mt-4" onClick={simulateNewOrder}>
          <Zap size={17} /> Симулировать новый заказ
        </Button>

        <div className="mt-6">
          <SectionLabel className="mb-3 block">Аккаунт</SectionLabel>
          <Card className="divide-y divide-line px-4 py-1">
            <NavRow icon={Building2} label="Заведение" value="ГС · Основное" />
            <NavRow icon={KeyRound} label="Сменить PIN-код" />
            <NavRow icon={ShieldCheck} label="Безопасность" />
          </Card>
        </div>

        <Button full variant="surface" size="lg" className="mt-6 !text-error-500" onClick={logout}>
          <LogOut size={18} /> Выйти из аккаунта
        </Button>

        <div className="mt-6 flex flex-col items-center gap-2">
          <Logo className="h-8 w-8 opacity-70" />
          <p className="text-[11px] font-semibold text-content-muted">ГС Заказы · v{BRAND.version}</p>
        </div>
      </div>
    </motion.div>
  )
}
