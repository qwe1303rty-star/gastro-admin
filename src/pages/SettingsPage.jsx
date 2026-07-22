import { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import BrandMark from '../components/BrandMark'
import { IconMoon, IconSun, IconGlobe, IconBell, IconMessage, IconMail, IconUser, IconShield, IconLock, IconLogout, IconChevronRight } from '../components/Icons'

function SettingsRow({ icon, title, desc, right, last }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 14, padding: '14px 16px',
      borderBottom: last ? 'none' : '1px solid var(--divider)'
    }}>
      <div className="ico ico--sm">{icon}</div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 13.5, color: 'var(--text)', fontWeight: 500 }}>{title}</div>
        {desc && <div className="micro" style={{ marginTop: 2 }}>{desc}</div>}
      </div>
      {right ?? <IconChevronRight width={16} height={16} style={{ color: 'var(--text-dim)' }}/>}
    </div>
  )
}

function Toggle({ on, onToggle }) {
  return (
    <div className={'toggle' + (on ? ' toggle--on' : '')} onClick={onToggle}>
      <div className="toggle__knob"/>
    </div>
  )
}

export default function SettingsPage({ onNavigate }) {
  const { logout } = useAuth()
  const [dark, setDark] = useState(true)
  const [pushOn, setPushOn] = useState(true)
  const [soundOn, setSoundOn] = useState(true)
  const [dailyReport, setDailyReport] = useState(false)

  return (
    <div className="app-screen">
      <div className="screen-header">
        <div>
          <div className="eyebrow">КОНСОЛЬ</div>
          <div className="h3 serif">Настройки</div>
        </div>
        <div className="head-actions">
          {onNavigate && (
            <button className="btn btn--icon" onClick={() => onNavigate('profile')}>
              <IconUser width={17} height={17}/>
            </button>
          )}
        </div>
      </div>

      <div className="screen-scroll">
        <div className="card card--gold" style={{ padding: 16, marginBottom: 20, display: 'flex', alignItems: 'center', gap: 14 }}>
          <BrandMark size={44}/>
          <div style={{ flex: 1 }}>
            <div className="title" style={{ fontSize: 14 }}>Гастрономический Спектакль</div>
            <div className="micro">Админ-панель · Управление заказами</div>
          </div>
          <div className="status status--done" style={{ padding: '3px 8px', fontSize: 10 }}>
            <span className="status__dot"/>Онлайн
          </div>
        </div>

        <div className="eyebrow" style={{ marginBottom: 8 }}>ВНЕШНИЙ ВИД</div>
        <div className="card" style={{ padding: 0, marginBottom: 20 }}>
          <SettingsRow icon={<IconMoon width={16} height={16}/>} title="Тёмная тема" desc="Оптимально для вечерней смены" right={<Toggle on={dark} onToggle={() => setDark(!dark)}/>}/>
          <SettingsRow icon={<IconSun width={16} height={16}/>} title="Светлая тема" desc="Автоматически с 07:00" right={<Toggle on={!dark} onToggle={() => setDark(!dark)}/>}/>
          <SettingsRow icon={<IconGlobe width={16} height={16}/>} title="Язык · Русский" desc="RU" last/>
        </div>

        <div className="eyebrow" style={{ marginBottom: 8 }}>УВЕДОМЛЕНИЯ</div>
        <div className="card" style={{ padding: 0, marginBottom: 20 }}>
          <SettingsRow icon={<IconBell width={16} height={16}/>} title="Push-уведомления" desc="Новые заказы, оплаты, отмены" right={<Toggle on={pushOn} onToggle={() => setPushOn(!pushOn)}/>}/>
          <SettingsRow icon={<IconMessage width={16} height={16}/>} title="Звук нового заказа" desc="Мелодия · Golden Chime" right={<Toggle on={soundOn} onToggle={() => setSoundOn(!soundOn)}/>}/>
          <SettingsRow icon={<IconMail width={16} height={16}/>} title="Ежедневная сводка" desc="20:00 — итоги смены на e-mail" right={<Toggle on={dailyReport} onToggle={() => setDailyReport(!dailyReport)}/>} last/>
        </div>

        <div className="eyebrow" style={{ marginBottom: 8 }}>АККАУНТ</div>
        <div className="card" style={{ padding: 0, marginBottom: 20 }}>
          <SettingsRow icon={<IconUser width={16} height={16}/>} title="Профиль администратора" desc="Настройки аккаунта"/>
          <SettingsRow icon={<IconShield width={16} height={16}/>} title="Безопасность" desc="PIN-код, сессии"/>
          <SettingsRow icon={<IconLock width={16} height={16}/>} title="Изменить PIN" desc="Текущий: ••••" last/>
        </div>

        <button
          className="btn btn--dark btn--full"
          style={{ color: 'var(--error)', borderColor: 'rgba(217,105,94,.2)' }}
          onClick={logout}
        >
          <IconLogout width={17} height={17}/>
          Выйти из аккаунта
        </button>

        <div className="micro" style={{ textAlign: 'center', marginTop: 20 }}>
          Гастрономический Спектакль · Admin Console
        </div>
      </div>
    </div>
  )
}
