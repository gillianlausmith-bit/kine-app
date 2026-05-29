import React, { useState, useEffect } from 'react'
import { supabase } from './supabase'
import { seedPacientes, seedSesiones, seedGastos, seedCitas } from './data/seed'
import Resumen    from './components/Resumen'
import Agenda     from './components/Agenda'
import Sesiones   from './components/Sesiones'
import Pacientes  from './components/Pacientes'
import Proyeccion from './components/Proyeccion'
import Gastos     from './components/Gastos'

const NAV = [
  { id: 'resumen',    label: 'Resumen',    icon: '🏠' },
  { id: 'agenda',     label: 'Agenda',     icon: '📅' },
  { id: 'sesiones',   label: 'Sesiones',   icon: '📋' },
  { id: 'pacientes',  label: 'Pacientes',  icon: '🧑‍⚕️' },
  { id: 'proyeccion', label: 'Proyección', icon: '📈' },
  { id: 'gastos',     label: 'Gastos',     icon: '🧾' },
]

const TAB_TITLES = {
  resumen:    'Panel de control',
  agenda:     'Agenda de citas',
  sesiones:   'Sesiones',
  pacientes:  'Pacientes',
  proyeccion: 'Proyección',
  gastos:     'Gastos y finanzas',
}

export default function App() {
  const [tab, setTab] = useState('resumen')
  const [pacientes,  setPacientes]  = useState([])
  const [sesiones,   setSesiones]   = useState([])
  const [gastos,     setGastos]     = useState([])
  const [citas,      setCitas]      = useState([])
  const [loading,    setLoading]    = useState(true)

  useEffect(() => {
    async function loadData() {
      setLoading(true)
      const [p, s, g, c] = await Promise.all([
        supabase.from('pacientes').select('*').order('id'),
        supabase.from('sesiones').select('*').order('fecha', { ascending: false }),
        supabase.from('gastos').select('*').order('fecha', { ascending: false }),
        supabase.from('citas').select('*').order('fecha'),
      ])
      setPacientes((p.data || []).map(x => ({ ...x, valorHabitual: x.valor_habitual, iniciales: x.iniciales || x.nombre.split(' ').map(w=>w[0]).join('').toUpperCase().slice(0,2) })))
      setSesiones((s.data || []).map(x => ({ ...x, pacienteId: x.paciente_id })))
      setGastos(g.data || [])
      setCitas((c.data || []).map(x => ({ ...x, pacienteId: x.paciente_id })))
      if (!p.data || p.data.length === 0) await seedAll()
      setLoading(false)
    }
    loadData()
  }, [])

  async function seedAll() {
    const { data: pacs } = await supabase.from('pacientes').insert(
      seedPacientes.map(p => ({ nombre: p.nombre, diagnostico: p.diagnostico, tel: p.tel, email: p.email, valor_habitual: p.valorHabitual, iniciales: p.iniciales, color: p.color }))
    ).select()
    if (!pacs) return
    const idMap = {}
    seedPacientes.forEach((sp, i) => { idMap[sp.id] = pacs[i].id })
    await supabase.from('sesiones').insert(seedSesiones.map(s => ({ fecha: s.fecha, paciente_id: idMap[s.pacienteId], tipo: s.tipo, monto: s.monto, pagado: s.pagado, notas: s.notas })))
    await supabase.from('gastos').insert(seedGastos.map(g => ({ concepto: g.concepto, cat: g.cat, monto: g.monto, fecha: g.fecha })))
    await supabase.from('citas').insert(seedCitas.map(c => ({ fecha: c.fecha, hora: c.hora, paciente_id: idMap[c.pacienteId], tipo: c.tipo, notas: c.notas, recordatorio: c.recordatorio })))
    const [p2, s2, g2, c2] = await Promise.all([
      supabase.from('pacientes').select('*').order('id'),
      supabase.from('sesiones').select('*').order('fecha', { ascending: false }),
      supabase.from('gastos').select('*').order('fecha', { ascending: false }),
      supabase.from('citas').select('*').order('fecha'),
    ])
    setPacientes((p2.data || []).map(x => ({ ...x, valorHabitual: x.valor_habitual, iniciales: x.iniciales || x.nombre.split(' ').map(w=>w[0]).join('').toUpperCase().slice(0,2) })))
    setSesiones((s2.data || []).map(x => ({ ...x, pacienteId: x.paciente_id })))
    setGastos(g2.data || [])
    setCitas((c2.data || []).map(x => ({ ...x, pacienteId: x.paciente_id })))
  }

  async function addPaciente(data) {
    const { data: row } = await supabase.from('pacientes').insert([{ nombre: data.nombre, diagnostico: data.diagnostico, tel: data.tel, email: data.email, valor_habitual: data.valorHabitual, iniciales: data.iniciales, color: data.color }]).select().single()
    if (row) setPacientes(prev => [...prev, { ...row, valorHabitual: row.valor_habitual }])
  }
  async function removePaciente(id) {
    await supabase.from('pacientes').delete().eq('id', id)
    setPacientes(prev => prev.filter(p => p.id !== id))
  }
  async function addSesion(data) {
    const { data: row } = await supabase.from('sesiones').insert([{ fecha: data.fecha, paciente_id: data.pacienteId, tipo: data.tipo, monto: data.monto, pagado: data.pagado, notas: data.notas }]).select().single()
    if (row) setSesiones(prev => [{ ...row, pacienteId: row.paciente_id }, ...prev])
  }
  async function removeSesion(id) {
    await supabase.from('sesiones').delete().eq('id', id)
    setSesiones(prev => prev.filter(s => s.id !== id))
  }
  async function addGasto(data) {
    const { data: row } = await supabase.from('gastos').insert([data]).select().single()
    if (row) setGastos(prev => [row, ...prev])
  }
  async function removeGasto(id) {
    await supabase.from('gastos').delete().eq('id', id)
    setGastos(prev => prev.filter(g => g.id !== id))
  }
  async function addCita(data) {
    const { data: row } = await supabase.from('citas').insert([{ fecha: data.fecha, hora: data.hora, paciente_id: data.pacienteId, tipo: data.tipo, notas: data.notas, recordatorio: data.recordatorio }]).select().single()
    if (row) setCitas(prev => [...prev, { ...row, pacienteId: row.paciente_id }])
  }
  async function removeCita(id) {
    await supabase.from('citas').delete().eq('id', id)
    setCitas(prev => prev.filter(c => c.id !== id))
  }

  const todayStr = new Date().toISOString().split('T')[0]
  const citasHoy = citas.filter(c => c.fecha === todayStr).length
  const pendientes = sesiones.filter(s => s.pagado === 'pendiente').length

  if (loading) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh', fontFamily: 'var(--font-body)', color: 'var(--text-2)', flexDirection: 'column', gap: 12 }}>
      <div style={{ fontSize: 32 }}>🩺</div>
      <div>Cargando KineApp...</div>
    </div>
  )

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', background: 'var(--bg)' }}>

      {/* Top header — mobile friendly */}
      <header style={{
        background: 'var(--surface)', borderBottom: '1px solid var(--border)',
        padding: '12px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        position: 'sticky', top: 0, zIndex: 100,
      }}>
        <div style={{ fontFamily: 'var(--font-display)', fontSize: 18, color: 'var(--accent)', fontStyle: 'italic' }}>Kine·App</div>
        <div style={{ fontSize: 14, fontWeight: 500, color: 'var(--text-2)' }}>{TAB_TITLES[tab]}</div>
        <div style={{ fontSize: 11, color: 'var(--text-3)' }}>☁️ nube</div>
      </header>

      {/* Main content */}
      <main style={{ flex: 1, overflowY: 'auto', padding: '20px 16px 90px' }}>
        {tab === 'resumen'    && <Resumen    sesiones={sesiones} pacientes={pacientes} gastos={gastos} citas={citas} />}
        {tab === 'agenda'     && <Agenda     citas={citas} setCitas={setCitas} addCita={addCita} removeCita={removeCita} pacientes={pacientes} sesiones={sesiones} setSesiones={setSesiones} addSesion={addSesion} />}
        {tab === 'sesiones'   && <Sesiones   sesiones={sesiones} addSesion={addSesion} removeSesion={removeSesion} pacientes={pacientes} />}
        {tab === 'pacientes'  && <Pacientes  pacientes={pacientes} addPaciente={addPaciente} removePaciente={removePaciente} sesiones={sesiones} />}
        {tab === 'proyeccion' && <Proyeccion sesiones={sesiones} />}
        {tab === 'gastos'     && <Gastos     gastos={gastos} addGasto={addGasto} removeGasto={removeGasto} sesiones={sesiones} />}
      </main>

      {/* Bottom nav — mobile style */}
      <nav style={{
        position: 'fixed', bottom: 0, left: 0, right: 0,
        background: 'var(--surface)', borderTop: '1px solid var(--border)',
        display: 'flex', zIndex: 100,
        paddingBottom: 'env(safe-area-inset-bottom)',
      }}>
        {NAV.map(item => {
          const active = tab === item.id
          const badge = item.id === 'agenda' && citasHoy > 0 ? citasHoy : item.id === 'sesiones' && pendientes > 0 ? pendientes : null
          return (
            <button key={item.id} onClick={() => setTab(item.id)} style={{
              flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
              padding: '8px 2px 6px', border: 'none', background: 'none', cursor: 'pointer',
              color: active ? 'var(--accent)' : 'var(--text-3)',
              position: 'relative',
              transition: 'color 0.15s',
            }}>
              <span style={{ fontSize: 20, lineHeight: 1 }}>{item.icon}</span>
              <span style={{ fontSize: 10, marginTop: 3, fontWeight: active ? 600 : 400, letterSpacing: '0.01em' }}>{item.label}</span>
              {active && <span style={{ position: 'absolute', top: 0, left: '50%', transform: 'translateX(-50%)', width: 24, height: 2, background: 'var(--accent)', borderRadius: 2 }} />}
              {badge && <span style={{ position: 'absolute', top: 6, right: '18%', background: 'var(--accent)', color: '#fff', fontSize: 9, fontWeight: 700, borderRadius: 10, padding: '1px 5px', minWidth: 16, textAlign: 'center' }}>{badge}</span>}
            </button>
          )
        })}
      </nav>
    </div>
  )
}
