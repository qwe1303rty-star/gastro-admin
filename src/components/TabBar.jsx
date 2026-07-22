import { IconHome, IconList, IconChart, IconBell, IconSettings } from './Icons'

const tabs = [
  { id: 'home',     label: 'Главная',     Icon: IconHome },
  { id: 'orders',   label: 'Заказы',      Icon: IconList },
  { id: 'stats',    label: 'Статистика',  Icon: IconChart },
  { id: 'notif',    label: 'Уведомления', Icon: IconBell },
  { id: 'settings', label: 'Настройки',   Icon: IconSettings },
]

export default function TabBar({ active, onNavigate }) {
  return (
    <nav className="tabbar">
      {tabs.map(({ id, label, Icon }) => (
        <button
          key={id}
          className={'tabbar__item' + (active === id ? ' tabbar__item--active' : '')}
          onClick={() => onNavigate(id)}
        >
          <Icon width={22} height={22} strokeWidth={active === id ? 2 : 1.5} />
          <span>{label}</span>
        </button>
      ))}
    </nav>
  )
}
