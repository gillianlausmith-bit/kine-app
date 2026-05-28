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
  const [pacientes,  setPacientes]  = useState([])
  const [sesiones,   setSesiones]   = useState([])
  const [gastos,     setGastos]     = useState([])
  const [citas,      setCitas]      = useState([])
  const [loading,    setLoading]    = useState(true)

  // Load all data from Supabase
  useEffect(() => {
    async function loadData() {
      setLoading(true)
      const [p, s, g, c] = await Promise.all([
        supabase.from('pacientes').select('*').order('id'),
        supabase.from('sesiones').select('*').order('fecha', { ascending: false }),
        supabase.from('gastos').select('*').order('fecha', { ascending: false }),
        supabase.from('citas').select('*').order('fecha'),
      ])
      
      // Map snake_case from DB to camelCase for app
      setPacientes((p.data || []).map(x => ({ ...x, valorHabitual: x.valor_habitual, iniciales: x.iniciales || x.nombre.split(' ').map(w=>w[0]).join('').toUpperCase().slice(0,2) })))
      setSesiones((s.data || []).map(x => ({ ...x, pacienteId: x.paciente_id })))
      setGastos(g.data || [])
      setCitas((c.data || []).map(x => ({ ...x, pacienteId: x.paciente_id })))

      // Seed if empty
      if (!p.data || p.data.length === 0) {
        await seedAll()
      }
      setLoading(false)
    }
    loadData()
  }, [])

  async function seedAll() {
    // Insert seed pacientes
    const { data: pacs } = await supabase.from('pacientes').insert(
      seedPacientes.map(p => ({ nombre: p.nombre, diagnostico: p.diagnostico, tel: p.tel, email: p.email, valor_habitual: p.valorHabitual, iniciales: p.iniciales, color: p.color }))
    ).select()

    if (!pacs) return
    const idMap = {}
    seedPacientes.forEach((sp, i) => { idMap[sp.id] = pacs[i].id })

    await supabase.from('sesiones').insert(
      seedSesiones.map(s => ({ fecha: s.fecha, paciente_id: idMap[s.pacienteId], tipo: s.tipo, monto: s.monto, pagado: s.pagado, notas: s.notas }))
    )
    await supabase.from('gastos').insert(
      seedGastos.map(g => ({ concepto: g.concepto, cat: g.cat, monto: g.monto, fecha: g.fecha }))
    )
    await supabase.from('citas').insert(
      seedCitas.map(c => ({ fecha: c.fecha, hora: c.hora, paciente_id: idMap[c.pacienteId], tipo: c.tipo, notas: c.notas, recordatorio: c.recordatorio }))
    )

    // Reload
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

  // CRUD helpers
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
    <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--bg)' }}>
      <aside style={{
        width: 220, background: 'var(--surface)', borderRight: '1px solid var(--border)',
        display: 'flex', flexDirection: 'column', flexShrink: 0,
        position: 'sticky', top: 0, height: '100vh', overflowY: 'auto',
      }}>
        <div style={{ padding: '28px 22px 20px' }}>
          <div style={{ fontFamily: 'var(--font-display)', fontSize: 20, color: 'var(--accent)', fontStyle: 'italic', letterSpacing: '-0.01em' }}>Kine·App</div>
          <div style={{ fontSize: 11, color: 'var(--text-3)', marginTop: 2 }}>Gestión de kinesiología</div>
        </div>
        <nav style={{ flex: 1, padding: '0 10px' }}>
          {NAV.map(item => {
            const active = tab === item.id
            const badge = item.id === 'agenda' && citasHoy > 0 ? citasHoy : item.id === 'sesiones' && pendientes > 0 ? pendientes : null
            return (
              <button key={item.id} onClick={() => setTab(item.id)} style={{
                width: '100%', textAlign: 'left',
                display: 'flex', alignItems: 'center', gap: 10, justifyContent: 'space-between',
                padding: '9px 12px', borderRadius: 'var(--radius-sm)',
                border: 'none', cursor: 'pointer',
                background: active ? 'var(--teal-50)' : 'transparent',
                color: active ? 'var(--accent-dk)' : 'var(--text-2)',
                fontWeight: active ? 600 : 400, fontSize: 13,
                transition: 'all 0.12s', marginBottom: 2,
              }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
                  <span style={{ fontSize: 15 }}>{item.icon}</span>
                  {item.label}
                </span>
                {badge && <span style={{ background: 'var(--accent)', color: '#fff', fontSize: 10, fontWeight: 700, borderRadius: 10, padding: '1px 6px', minWidth: 18, textAlign: 'center' }}>{badge}</span>}
              </button>
            )
          })}
        </nav>
        <div style={{ padding: '16px 22px', fontSize: 11, color: 'var(--text-3)', borderTop: '1px solid var(--border)' }}>
          <div>☁️ Datos en la nube</div>
          <div style={{ marginTop: 4 }}>{sesiones.length} sesiones · {pacientes.length} pacientes</div>
        </div>
      </aside>

      <main style={{ flex: 1, overflowY: 'auto' }}>
        <div style={{ padding: '24px 32px 0', marginBottom: 24 }}>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 26, fontWeight: 400, color: 'var(--text-1)', letterSpacing: '-0.01em' }}>{TAB_TITLES[tab]}</h1>
          <div style={{ height: 1, background: 'var(--border)', marginTop: 18 }} />
        </div>
        <div style={{ padding: '0 32px 40px' }}>
          {tab === 'resumen'    && <Resumen    sesiones={sesiones} pacientes={pacientes} gastos={gastos} citas={citas} />}
          {tab === 'agenda'     && <Agenda     citas={citas} setCitas={setCitas} addCita={addCita} removeCita={removeCita} pacientes={pacientes} sesiones={sesiones} setSesiones={setSesiones} addSesion={addSesion} />}
          {tab === 'sesiones'   && <Sesiones   sesiones={sesiones} addSesion={addSesion} removeSesion={removeSesion} pacientes={pacientes} />}
          {tab === 'pacientes'  && <Pacientes  pacientes={pacientes} addPaciente={addPaciente} removePaciente={removePaciente} sesiones={sesiones} />}
          {tab === 'proyeccion' && <Proyeccion sesiones={sesiones} />}
          {tab === 'gastos'     && <Gastos     gastos={gastos} addGasto={addGasto} removeGasto={removeGasto} sesiones={sesiones} />}
        </div>
      </main>
    </div>
  )
}
