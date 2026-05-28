import React, { useState } from 'react'
import { useLocalStorage } from './hooks/useLocalStorage'
import { seedPacientes, seedSesiones, seedGastos, seedCitas } from './data/seed'
import Resumen    from './components/Resumen'
import Agenda     from './components/Agenda'
import Sesiones   from './components/Sesiones'
import Pacientes  from './components/Pacientes'
import Proyeccion from './components/Proyeccion'
import Gastos     from './components/Gastos'

const NAV = [
  { id: 'resumen',    label: 'Resumen',     icon: '🏠' },
  { id: 'agenda',     label: 'Agenda',      icon: '📅' },
  { id: 'sesiones',   label: 'Sesiones',    icon: '📋' },
  { id: 'pacientes',  label: 'Pacientes',   icon: '🧑‍⚕️' },
  { id: 'proyeccion', label: 'Proyección',  icon: '📈' },
  { id: 'gastos',     label: 'Gastos',      icon: '🧾' },
]

const TAB_TITLES = {
  resumen:    'Panel de control',
  agenda:     'Agenda de citas',
  sesiones:   'Sesiones',
  pacientes:  'Pacientes',
  proyeccion: 'Proyección de ingresos',
  gastos:     'Gastos y finanzas',
}

export default function App() {
  const [tab, setTab] = useState('resumen')
  const [pacientes,  setPacientes]  = useLocalStorage('kine_pacientes',  seedPacientes)
  const [sesiones,   setSesiones]   = useLocalStorage('kine_sesiones',   seedSesiones)
  const [gastos,     setGastos]     = useLocalStorage('kine_gastos',     seedGastos)
  const [citas,      setCitas]      = useLocalStorage('kine_citas',      seedCitas)

  // Today's cita count for badge
  const todayStr = new Date().toISOString().split('T')[0]
  const citasHoy = citas.filter(c => c.fecha === todayStr).length
  const pendientes = sesiones.filter(s => s.pagado === 'pendiente').length

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--bg)' }}>
      {/* Sidebar */}
      <aside style={{
        width: 220, background: 'var(--surface)', borderRight: '1px solid var(--border)',
        display: 'flex', flexDirection: 'column', flexShrink: 0,
        position: 'sticky', top: 0, height: '100vh', overflowY: 'auto',
      }}>
        {/* Logo */}
        <div style={{ padding: '28px 22px 20px' }}>
          <div style={{ fontFamily: 'var(--font-display)', fontSize: 20, color: 'var(--accent)', fontStyle: 'italic', letterSpacing: '-0.01em' }}>
            Kine·App
          </div>
          <div style={{ fontSize: 11, color: 'var(--text-3)', marginTop: 2 }}>Gestión de kinesiología</div>
        </div>

        {/* Nav */}
        <nav style={{ flex: 1, padding: '0 10px' }}>
          {NAV.map(item => {
            const active = tab === item.id
            const badge = item.id === 'agenda' && citasHoy > 0 ? citasHoy : item.id === 'sesiones' && pendientes > 0 ? pendientes : null
            return (
              <button
                key={item.id}
                onClick={() => setTab(item.id)}
                style={{
                  width: '100%', textAlign: 'left',
                  display: 'flex', alignItems: 'center', gap: 10, justifyContent: 'space-between',
                  padding: '9px 12px', borderRadius: 'var(--radius-sm)',
                  border: 'none', cursor: 'pointer',
                  background: active ? 'var(--teal-50)' : 'transparent',
                  color: active ? 'var(--accent-dk)' : 'var(--text-2)',
                  fontWeight: active ? 600 : 400,
                  fontSize: 13,
                  transition: 'all 0.12s',
                  marginBottom: 2,
                }}
                onMouseEnter={e => { if (!active) e.currentTarget.style.background = 'var(--surface-2)' }}
                onMouseLeave={e => { if (!active) e.currentTarget.style.background = 'transparent' }}
              >
                <span style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
                  <span style={{ fontSize: 15 }}>{item.icon}</span>
                  {item.label}
                </span>
                {badge && (
                  <span style={{ background: 'var(--accent)', color: '#fff', fontSize: 10, fontWeight: 700, borderRadius: 10, padding: '1px 6px', minWidth: 18, textAlign: 'center' }}>
                    {badge}
                  </span>
                )}
              </button>
            )
          })}
        </nav>

        {/* Footer */}
        <div style={{ padding: '16px 22px', fontSize: 11, color: 'var(--text-3)', borderTop: '1px solid var(--border)' }}>
          <div>Datos guardados localmente</div>
          <div style={{ marginTop: 4 }}>
            {sesiones.length} sesiones · {pacientes.length} pacientes
          </div>
        </div>
      </aside>

      {/* Main content */}
      <main style={{ flex: 1, overflowY: 'auto' }}>
        {/* Header */}
        <div style={{
          padding: '24px 32px 0',
          marginBottom: 24,
        }}>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 26, fontWeight: 400, color: 'var(--text-1)', letterSpacing: '-0.01em' }}>
            {TAB_TITLES[tab]}
          </h1>
          <div style={{ height: 1, background: 'var(--border)', marginTop: 18 }} />
        </div>

        {/* Tab content */}
        <div style={{ padding: '0 32px 40px' }}>
          {tab === 'resumen'    && <Resumen    sesiones={sesiones} pacientes={pacientes} gastos={gastos} citas={citas} />}
          {tab === 'agenda'     && <Agenda     citas={citas} setCitas={setCitas} pacientes={pacientes} sesiones={sesiones} setSesiones={setSesiones} />}
          {tab === 'sesiones'   && <Sesiones   sesiones={sesiones} setSesiones={setSesiones} pacientes={pacientes} />}
          {tab === 'pacientes'  && <Pacientes  pacientes={pacientes} setPacientes={setPacientes} sesiones={sesiones} />}
          {tab === 'proyeccion' && <Proyeccion sesiones={sesiones} />}
          {tab === 'gastos'     && <Gastos     gastos={gastos} setGastos={setGastos} sesiones={sesiones} />}
        </div>
      </main>
    </div>
  )
}
