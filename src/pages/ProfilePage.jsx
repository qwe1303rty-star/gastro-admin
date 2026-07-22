import { IconArrowLeft, IconEdit, IconMail, IconPhone, IconMapPin, IconChevronRight, IconStar, IconFire, IconShield, IconTrend } from '../components/Icons'

export default function ProfilePage({ onBack }) {
  return (
    <div className="app-screen">
      <div className="screen-header">
        <button className="btn btn--icon" onClick={onBack}><IconArrowLeft width={18} height={18}/></button>
        <div className="title" style={{ fontSize: 15 }}>Профиль</div>
        <button className="btn btn--icon"><IconEdit width={17} height={17}/></button>
      </div>

      <div className="screen-scroll">
        <div className="card card--gold" style={{ padding: 22, textAlign: 'center', marginBottom: 18 }}>
          <div style={{ position: 'relative', display: 'inline-block', marginBottom: 12 }}>
            <div className="avatar" style={{ width: 84, height: 84, fontSize: 28, border: '2px solid var(--gold)' }}>АД</div>
            <div style={{
              position: 'absolute', bottom: 2, right: 2,
              width: 20, height: 20, borderRadius: '50%',
              background: 'var(--success)', border: '3px solid var(--surface)'
            }}/>
          </div>
          <div className="h3 serif">Администратор</div>
          <div className="small" style={{ marginTop: 4 }}>Сменный администратор</div>
          <div className="micro gold" style={{ marginTop: 10, letterSpacing: '0.1em' }}>ID · GS-A-001</div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10, marginBottom: 20 }}>
          {[
            { l: 'Заказов', v: '—' },
            { l: 'Смен',    v: '—'  },
            { l: 'Рейтинг', v: '—' },
          ].map((s, i) => (
            <div key={i} className="card" style={{ padding: 12, textAlign: 'center' }}>
              <div className="serif" style={{ fontSize: 22 }}>{s.v}</div>
              <div className="micro" style={{ marginTop: 4 }}>{s.l}</div>
            </div>
          ))}
        </div>

        <div className="eyebrow" style={{ marginBottom: 8 }}>КОНТАКТЫ</div>
        <div className="card" style={{ padding: 0, marginBottom: 20 }}>
          {[
            { i: <IconMail width={16} height={16}/>, l: 'E-mail', v: 'admin@gspectacle.ru' },
            { i: <IconPhone width={16} height={16}/>, l: 'Телефон', v: '—' },
            { i: <IconMapPin width={16} height={16}/>, l: 'Ресторан', v: 'ГС' },
          ].map((r, i, a) => (
            <div key={i} style={{
              display: 'flex', alignItems: 'center', gap: 14, padding: '14px 16px',
              borderBottom: i < a.length - 1 ? '1px solid var(--divider)' : 'none'
            }}>
              <div className="ico ico--sm">{r.i}</div>
              <div style={{ flex: 1 }}>
                <div className="micro">{r.l}</div>
                <div style={{ fontSize: 13, color: 'var(--text)' }}>{r.v}</div>
              </div>
              <IconChevronRight width={16} height={16} style={{ color: 'var(--text-dim)' }}/>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
