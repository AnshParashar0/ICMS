import { THEME } from '../../utils/constants'
import logo from '../../assets/vecteezy_modern-real-estate-and-construction-logo_19897563.png'

const NAV_ITEMS = [
  { key: 'overview',    icon: 'bi-speedometer2',     label: 'Overview'    },
  { key: 'complaints',  icon: 'bi-list-task',        label: 'Complaints'  },
  { key: 'analytics',  icon: 'bi-bar-chart-line',   label: 'Analytics'   },
  { key: 'workers',    icon: 'bi-people',            label: 'Workers'     },
]

export default function Sidebar({ active, setActive, currentUser, onLogout }) {
  return (
    <nav style={{
      width: '240px', minWidth: '240px',
      background: THEME.gradient,
      display: 'flex', flexDirection: 'column',
      padding: '1.5rem 1rem',
      boxShadow: '4px 0 20px rgba(79,70,229,0.15)',
      position: 'sticky', top: 0, height: '100vh', overflow: 'hidden',
    }}>
      {/* Logo */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '2.5rem', padding: '0 0.25rem' }}>
        <img src={logo} alt="ICMS" style={{ width: '40px', height: '40px', objectFit: 'contain', mixBlendMode: 'screen' }} />
        <div>
          <div style={{ color: '#fff', fontWeight: '800', fontSize: '1.1rem' }}>ICMS</div>
          <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.7rem' }}>Admin Panel</div>
        </div>
      </div>

      {/* Menu label */}
      <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.68rem', fontWeight: '700', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '0.5rem', paddingLeft: '0.5rem' }}>
        Menu
      </div>

      {/* Nav items */}
      <div style={{ flex: 1 }}>
        {NAV_ITEMS.map(n => (
          <button
            key={n.key}
            onClick={() => setActive(n.key)}
            style={{
              width: '100%', display: 'flex', alignItems: 'center', gap: '10px',
              padding: '0.7rem 1rem', borderRadius: '10px', marginBottom: '4px',
              color: active === n.key ? '#fff' : 'rgba(255,255,255,0.65)',
              background: active === n.key ? 'rgba(255,255,255,0.18)' : 'transparent',
              fontWeight: active === n.key ? '700' : '500', fontSize: '0.9rem',
              border: 'none', cursor: 'pointer', transition: 'all 0.15s', textAlign: 'left',
            }}
            onMouseOver={e => { if (active !== n.key) e.currentTarget.style.background = 'rgba(255,255,255,0.08)' }}
            onMouseOut={e =>  { if (active !== n.key) e.currentTarget.style.background = 'transparent' }}
          >
            <i className={`bi ${n.icon}`} style={{ fontSize: '1rem', flexShrink: 0 }} />
            {n.label}
          </button>
        ))}
      </div>

      {/* User + logout */}
      <div style={{ borderTop: '1px solid rgba(255,255,255,0.12)', paddingTop: '1rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '0.75rem', padding: '0 0.25rem' }}>
          <div style={{ width: '34px', height: '34px', borderRadius: '50%', background: 'rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '700', color: '#fff', fontSize: '1rem', flexShrink: 0 }}>
            {currentUser ? currentUser.name.charAt(0).toUpperCase() : 'A'}
          </div>
          <div style={{ overflow: 'hidden' }}>
            <div style={{ color: '#fff', fontWeight: '600', fontSize: '0.85rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {currentUser?.name || 'Admin'}
            </div>
            <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.7rem' }}>Administrator</div>
          </div>
        </div>
        <button onClick={onLogout} style={{ width: '100%', background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', color: '#fff', borderRadius: '8px', padding: '0.55rem 1rem', fontWeight: '600', fontSize: '0.85rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <i className="bi bi-box-arrow-right" /> Logout
        </button>
      </div>
    </nav>
  )
}
