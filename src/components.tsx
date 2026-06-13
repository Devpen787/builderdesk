import type { ReactNode } from 'react'
import { navigate } from './router'

export function Brand() {
  return (
    <button className="brand nav-link" onClick={() => navigate('/')} aria-label="BuilderDesk home">
      <BrandMark />
      <span className="wordmark">
        <span className="wordmark-builder">Builder</span>
        <span className="wordmark-desk">Desk</span>
      </span>
    </button>
  )
}

// Desk surface + accepted-proof check (BRANDLAB §7). Uses currentColor so it
// reads on both the light top bar and the dark side rail. Legible at 24px.
function BrandMark() {
  return (
    <svg className="brand-mark" width="28" height="28" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <rect x="3" y="3" width="18" height="18" rx="5" stroke="currentColor" strokeWidth="1.8" />
      <line x1="6" y1="8.5" x2="18" y2="8.5" stroke="currentColor" strokeWidth="1.4" opacity="0.35" />
      <path
        d="M8 13.6 L10.8 16.4 L16.4 10"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export function Button({
  children,
  onClick,
  variant = 'secondary',
  disabled,
  type = 'button',
}: {
  children: ReactNode
  onClick?: () => void
  variant?: 'primary' | 'secondary' | 'accent'
  disabled?: boolean
  type?: 'button' | 'submit'
}) {
  return (
    <button type={type} className={`button ${variant}`} onClick={onClick} disabled={disabled}>
      {children}
    </button>
  )
}

export function Badge({ label, tone }: { label: string; tone: string }) {
  return (
    <span className={`badge ${tone}`}>
      <span className="badge-dot" aria-hidden="true" />
      {label}
    </span>
  )
}

export function ProofDisclosure({ summary, children }: { summary: string; children: ReactNode }) {
  return (
    <details className="proof-disclosure">
      <summary>{summary}</summary>
      <div className="proof-disclosure-body">{children}</div>
    </details>
  )
}

export function PublicShell({ children }: { children: ReactNode }) {
  return (
    <div className="shell public-shell">
      <header className="topbar">
        <Brand />
        <Button onClick={() => navigate('/onboarding')}>Open app</Button>
      </header>
      {children}
    </div>
  )
}

export function OrganizerShell({ children, path }: { children: ReactNode; path: string }) {
  const links = [
    ['/app', 'Home'],
    ['/sources', 'Sources'],
    ['/radar', 'Radar'],
    ['/profile', 'Profile'],
  ]
  return (
    <div className="organizer-shell">
      <aside className="sidebar">
        <Brand />
        <nav className="side-nav" aria-label="BuilderDesk navigation">
          {links.map(([href, label]) => (
            <button
              key={href}
              className={`nav-link ${path === href ? 'active' : ''}`}
              onClick={() => navigate(href)}
            >
              {label}
            </button>
          ))}
        </nav>
      </aside>
      <main className="main">{children}</main>
    </div>
  )
}

export function PageHeader({
  eyebrow,
  title,
  children,
  action,
}: {
  eyebrow?: string
  title: string
  children?: ReactNode
  action?: ReactNode
}) {
  return (
    <div className="page-header">
      <div>
        {eyebrow && <span className="eyebrow">{eyebrow}</span>}
        <h2>{title}</h2>
        {children}
      </div>
      {action}
    </div>
  )
}

export function Panel({ children, className = '' }: { children: ReactNode; className?: string }) {
  return <section className={`panel panel-pad ${className}`}>{children}</section>
}

export function EmptyState({
  title,
  body,
  action,
}: {
  title: string
  body: string
  action?: ReactNode
}) {
  return (
    <div className="panel empty">
      <h3>{title}</h3>
      <p>{body}</p>
      {action && <div className="actions">{action}</div>}
    </div>
  )
}

export function Field({
  label,
  value,
  onChange,
  placeholder,
  multiline,
  required,
}: {
  label: string
  value: string
  onChange: (value: string) => void
  placeholder?: string
  multiline?: boolean
  required?: boolean
}) {
  return (
    <div className="field">
      <label>{label}</label>
      {multiline ? (
        <textarea
          className="textarea"
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder={placeholder}
          required={required}
        />
      ) : (
        <input
          className="input"
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder={placeholder}
          required={required}
        />
      )}
    </div>
  )
}
