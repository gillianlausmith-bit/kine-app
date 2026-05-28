import React from 'react'
import { avatarColors } from '../utils'

/* ── Card ── */
export function Card({ children, style, className = '' }) {
  return (
    <div className={`card ${className}`} style={style}>
      {children}
    </div>
  )
}

/* ── Section title inside a card ── */
export function CardTitle({ children }) {
  return <p style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.07em', textTransform: 'uppercase', color: 'var(--text-3)', marginBottom: 14 }}>{children}</p>
}

/* ── Metric card ── */
export function MetricCard({ icon, label, value, sub, accent }) {
  return (
    <div style={{
      background: accent ? 'var(--accent)' : 'var(--surface)',
      border: accent ? 'none' : '1px solid var(--border)',
      borderRadius: 'var(--radius-md)',
      padding: '16px 18px',
      boxShadow: 'var(--shadow-sm)',
    }}>
      <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase', color: accent ? 'rgba(255,255,255,0.75)' : 'var(--text-3)', marginBottom: 8, display: 'flex', alignItems: 'center', gap: 5 }}>
        {icon && <span style={{ fontSize: 14 }}>{icon}</span>}
        {label}
      </div>
      <div style={{ fontSize: 24, fontWeight: 600, color: accent ? '#fff' : 'var(--text-1)', fontFamily: 'var(--font-display)', letterSpacing: '-0.01em' }}>{value}</div>
      {sub && <div style={{ fontSize: 12, color: accent ? 'rgba(255,255,255,0.65)' : 'var(--text-3)', marginTop: 3 }}>{sub}</div>}
    </div>
  )
}

/* ── Badge ── */
const badgeStyles = {
  green:   { background: '#eaf3de', color: '#3B6D11' },
  amber:   { background: '#faeeda', color: '#854F0B' },
  gray:    { background: '#f0efed', color: '#6b6966' },
  red:     { background: '#fcebeb', color: '#A32D2D' },
  blue:    { background: '#e6f1fb', color: '#185FA5' },
  teal:    { background: '#e1f5ee', color: '#0F6E56' },
}

export function Badge({ color = 'gray', children, style }) {
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center',
      padding: '2px 9px', borderRadius: 20,
      fontSize: 11, fontWeight: 600,
      ...badgeStyles[color],
      ...style,
    }}>
      {children}
    </span>
  )
}

/* ── Avatar ── */
export function Avatar({ iniciales, color = 'teal', size = 36 }) {
  const c = avatarColors[color] || avatarColors.teal
  return (
    <div style={{
      width: size, height: size, borderRadius: '50%',
      background: c.bg, color: c.text,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontSize: size * 0.35, fontWeight: 600,
      flexShrink: 0,
    }}>
      {iniciales}
    </div>
  )
}

/* ── Button ── */
export function Btn({ children, onClick, variant = 'default', size = 'md', disabled, style, type = 'button' }) {
  const base = {
    display: 'inline-flex', alignItems: 'center', gap: 6,
    borderRadius: 'var(--radius-sm)', fontWeight: 500,
    transition: 'all 0.15s', cursor: disabled ? 'not-allowed' : 'pointer',
    opacity: disabled ? 0.5 : 1, border: '1px solid',
  }
  const sizes = {
    sm: { padding: '5px 12px', fontSize: 12 },
    md: { padding: '8px 16px', fontSize: 13 },
    lg: { padding: '10px 22px', fontSize: 14 },
  }
  const variants = {
    default: { background: 'var(--surface)', borderColor: 'var(--border-md)', color: 'var(--text-1)' },
    primary: { background: 'var(--accent)', borderColor: 'var(--accent)', color: '#fff' },
    danger:  { background: '#fcebeb', borderColor: '#f09595', color: 'var(--red-600)' },
    ghost:   { background: 'transparent', borderColor: 'transparent', color: 'var(--text-2)' },
  }
  return (
    <button type={type} onClick={onClick} disabled={disabled} style={{ ...base, ...sizes[size], ...variants[variant], ...style }}>
      {children}
    </button>
  )
}

/* ── Modal ── */
export function Modal({ open, onClose, title, children, width = 500 }) {
  if (!open) return null
  return (
    <div onClick={onClose} style={{
      position: 'fixed', inset: 0, zIndex: 200,
      background: 'rgba(0,0,0,0.3)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: 20,
    }}>
      <div onClick={e => e.stopPropagation()} style={{
        background: 'var(--surface)', borderRadius: 'var(--radius-lg)',
        boxShadow: '0 20px 60px rgba(0,0,0,0.18)',
        width: '100%', maxWidth: width, maxHeight: '90vh', overflowY: 'auto',
        animation: 'fadeIn 0.2s ease',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '18px 22px', borderBottom: '1px solid var(--border)' }}>
          <span style={{ fontWeight: 600, fontSize: 15 }}>{title}</span>
          <button onClick={onClose} style={{ fontSize: 20, color: 'var(--text-3)', cursor: 'pointer', background: 'none', border: 'none', lineHeight: 1 }}>×</button>
        </div>
        <div style={{ padding: '22px' }}>{children}</div>
      </div>
    </div>
  )
}

/* ── Form field ── */
export function Field({ label, children, style }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 5, ...style }}>
      <label style={{ fontSize: 12, fontWeight: 500, color: 'var(--text-2)' }}>{label}</label>
      {children}
    </div>
  )
}

const inputStyle = {
  height: 36, border: '1px solid var(--border-md)', borderRadius: 'var(--radius-sm)',
  padding: '0 10px', fontSize: 13, background: 'var(--surface)', color: 'var(--text-1)',
  outline: 'none', width: '100%',
}

export function Input({ ...props }) {
  return <input style={inputStyle} {...props} />
}

export function Select({ children, ...props }) {
  return <select style={{ ...inputStyle, cursor: 'pointer' }} {...props}>{children}</select>
}

export function FormGrid({ children, cols = 2 }) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: `repeat(${cols}, 1fr)`, gap: 12 }}>
      {children}
    </div>
  )
}

/* ── Empty state ── */
export function EmptyState({ icon, text }) {
  return (
    <div style={{ textAlign: 'center', padding: '36px 20px', color: 'var(--text-3)' }}>
      <div style={{ fontSize: 32, marginBottom: 10 }}>{icon}</div>
      <div style={{ fontSize: 13 }}>{text}</div>
    </div>
  )
}

/* ── Divider ── */
export function Divider({ style }) {
  return <div style={{ height: 1, background: 'var(--border)', ...style }} />
}
