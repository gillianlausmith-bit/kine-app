import React, { useState, useMemo } from 'react'
import { Card, CardTitle, Avatar, Badge, Btn, Modal, Field, Input, Select, FormGrid, EmptyState } from './UI'
import { fmt, fmtDate, today, addDays, getWeekStart, DIAS_SEMANA, TIPOS_SESION, nextId } from '../utils'

const HOURS = ['08:00','08:30','09:00','09:30','10:00','10:30','11:00','11:30','12:00','12:30','13:00','13:30','14:00','14:30','15:00','15:30','16:00','16:30','17:00','17:30','18:00']

function CitaCard({ cita, paciente, onDelete }) {
  const [hover, setHover] = useState(false)
  return (
    <div
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        background: hover ? '#e1f5ee' : 'var(--teal-50)',
        border: '1px solid #9fe1cb',
        borderRadius: 6,
        padding: '5px 8px',
        fontSize: 11,
        cursor: 'default',
        position: 'relative',
        transition: 'background 0.15s',
      }}
    >
      <div style={{ fontWeight: 600, color: 'var(--teal-600)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
        {cita.hora} {paciente?.nombre.split(' ')[0]}
      </div>
      <div style={{ color: 'var(--teal-800)', opacity: 0.7, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{cita.tipo}</div>
      {hover && (
        <button
          onClick={() => onDelete(cita.id)}
          style={{ position: 'absolute', top: 3, right: 4, fontSize: 13, color: 'var(--red-600)', background: 'none', border: 'none', cursor: 'pointer', lineHeight: 1, fontWeight: 700 }}
          title="Eliminar cita"
        >×</button>
      )}
    </div>
  )
}

export default function Agenda({ citas, setCitas, pacientes, sesiones, setSesiones }) {
  const [weekStart, setWeekStart] = useState(getWeekStart(today()))
  const [modalOpen, setModalOpen] = useState(false)
  const [detailCita, setDetailCita] = useState(null)
  const [form, setForm] = useState({ fecha: today(), hora: '09:00', pacienteId: '', tipo: 'Rehabilitación', notas: '', recordatorio: true })

  const weekDays = useMemo(() => Array.from({ length: 7 }, (_, i) => addDays(weekStart, i)), [weekStart])

  const citasByDay = useMemo(() => {
    const map = {}
    weekDays.forEach(d => { map[d] = [] })
    citas.forEach(c => { if (map[c.fecha]) map[c.fecha].push(c) })
    Object.keys(map).forEach(k => map[k].sort((a, b) => a.hora.localeCompare(b.hora)))
    return map
  }, [citas, weekDays])

  const todayStr = today()
  const upcomingCitas = [...citas]
    .filter(c => c.fecha >= todayStr)
    .sort((a, b) => a.fecha === b.fecha ? a.hora.localeCompare(b.hora) : a.fecha.localeCompare(b.fecha))
    .slice(0, 10)

  const getPac = id => pacientes.find(p => p.id === id)

  function openNew() {
    setForm({ fecha: today(), hora: '09:00', pacienteId: '', tipo: 'Rehabilitación', notas: '', recordatorio: true })
    setModalOpen(true)
  }

  function saveCita() {
    if (!form.pacienteId || !form.fecha || !form.hora) return alert('Completa todos los campos obligatorios')
    setCitas(prev => [...prev, { ...form, id: nextId(citas), pacienteId: parseInt(form.pacienteId) }])
    setModalOpen(false)
  }

  function deleteCita(id) {
    if (window.confirm('¿Eliminar esta cita?')) setCitas(prev => prev.filter(c => c.id !== id))
  }

  function convertirSesion(cita) {
    const pac = getPac(cita.pacienteId)
    const monto = pac?.valorHabitual || 25000
    setSesiones(prev => [...prev, {
      id: nextId(sesiones),
      fecha: cita.fecha, pacienteId: cita.pacienteId,
      tipo: cita.tipo, monto, pagado: 'si', notas: cita.notas
    }])
    setCitas(prev => prev.filter(c => c.id !== cita.id))
    setDetailCita(null)
  }

  const prevWeek = () => setWeekStart(addDays(weekStart, -7))
  const nextWeek = () => setWeekStart(addDays(weekStart, 7))
  const goToday = () => setWeekStart(getWeekStart(todayStr))

  const diasLabel = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom']

  return (
    <div className="fade-in" style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <Btn onClick={prevWeek} size="sm">‹</Btn>
          <Btn onClick={goToday} size="sm">Hoy</Btn>
          <Btn onClick={nextWeek} size="sm">›</Btn>
          <span style={{ fontSize: 14, fontWeight: 500, marginLeft: 8, color: 'var(--text-2)' }}>
            {fmtDate(weekStart)} — {fmtDate(addDays(weekStart, 6))}
          </span>
        </div>
        <Btn variant="primary" onClick={openNew}>+ Nueva cita</Btn>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: 16, alignItems: 'start' }}>
        {/* Weekly calendar */}
        <Card style={{ padding: 0, overflow: 'hidden' }}>
          <div style={{ display: 'grid', gridTemplateColumns: `repeat(7, 1fr)`, borderBottom: '1px solid var(--border)' }}>
            {weekDays.map((d, i) => {
              const isToday = d === todayStr
              return (
                <div key={d} style={{
                  padding: '10px 8px',
                  textAlign: 'center',
                  borderRight: i < 6 ? '1px solid var(--border)' : 'none',
                  background: isToday ? 'var(--teal-50)' : 'var(--surface)',
                }}>
                  <div style={{ fontSize: 10, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em', color: isToday ? 'var(--accent)' : 'var(--text-3)' }}>{diasLabel[i]}</div>
                  <div style={{
                    fontSize: 16, fontWeight: 600, marginTop: 2,
                    color: isToday ? 'var(--accent)' : 'var(--text-1)',
                    width: 28, height: 28, borderRadius: '50%',
                    background: isToday ? 'var(--accent)' : 'transparent',
                    color: isToday ? '#fff' : 'var(--text-1)',
                    display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                    {d.split('-')[2]}
                  </div>
                </div>
              )
            })}
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: `repeat(7, 1fr)`, minHeight: 380 }}>
            {weekDays.map((d, i) => {
              const dayCitas = citasByDay[d] || []
              const isToday = d === todayStr
              return (
                <div key={d} style={{
                  borderRight: i < 6 ? '1px solid var(--border)' : 'none',
                  borderTop: '1px solid var(--border)',
                  padding: 6,
                  background: isToday ? '#fafffe' : 'var(--surface)',
                  display: 'flex', flexDirection: 'column', gap: 4,
                }}>
                  {dayCitas.length === 0 ? (
                    <div
                      onClick={() => { setForm(f => ({ ...f, fecha: d })); setModalOpen(true) }}
                      style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', opacity: 0.3, fontSize: 18, color: 'var(--text-3)' }}
                      title="Agregar cita"
                    >+</div>
                  ) : (
                    dayCitas.map(c => (
                      <div key={c.id} onClick={() => setDetailCita(c)} style={{ cursor: 'pointer' }}>
                        <CitaCard cita={c} paciente={getPac(c.pacienteId)} onDelete={deleteCita} />
                      </div>
                    ))
                  )}
                  {dayCitas.length > 0 && (
                    <button
                      onClick={() => { setForm(f => ({ ...f, fecha: d })); setModalOpen(true) }}
                      style={{ fontSize: 11, color: 'var(--text-3)', background: 'none', border: 'none', cursor: 'pointer', padding: '2px 0' }}
                    >+ agregar</button>
                  )}
                </div>
              )
            })}
          </div>
        </Card>

        {/* Upcoming list */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <Card>
            <CardTitle>Próximas citas</CardTitle>
            {upcomingCitas.length === 0 ? (
              <EmptyState icon="📅" text="Sin citas próximas" />
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {upcomingCitas.map(c => {
                  const p = getPac(c.pacienteId)
                  const isToday = c.fecha === todayStr
                  return (
                    <div
                      key={c.id}
                      onClick={() => setDetailCita(c)}
                      style={{
                        display: 'flex', gap: 10, alignItems: 'center',
                        padding: '9px 10px',
                        background: isToday ? 'var(--teal-50)' : 'var(--surface-2)',
                        borderRadius: 'var(--radius-sm)',
                        borderLeft: `3px solid ${isToday ? 'var(--accent)' : 'var(--slate-200)'}`,
                        cursor: 'pointer',
                        transition: 'background 0.15s',
                      }}
                    >
                      {p && <Avatar iniciales={p.iniciales} color={p.color} size={28} />}
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontWeight: 500, fontSize: 12, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{p?.nombre}</div>
                        <div style={{ fontSize: 11, color: 'var(--text-3)' }}>
                          {isToday ? '🟢 Hoy' : fmtDate(c.fecha)} · {c.hora}
                        </div>
                      </div>
                      {c.recordatorio && <span style={{ fontSize: 12 }}>🔔</span>}
                    </div>
                  )
                })}
              </div>
            )}
          </Card>

          <Card>
            <CardTitle>Resumen de la semana</CardTitle>
            {weekDays.map((d, i) => {
              const count = (citasByDay[d] || []).length
              return (
                <div key={d} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '5px 0', borderBottom: i < 6 ? '1px solid var(--border)' : 'none', fontSize: 12 }}>
                  <span style={{ color: d === todayStr ? 'var(--accent)' : 'var(--text-2)', fontWeight: d === todayStr ? 600 : 400 }}>{diasLabel[i]} {d.split('-')[2]}</span>
                  <span style={{ fontWeight: 500, color: count > 0 ? 'var(--text-1)' : 'var(--text-3)' }}>{count > 0 ? `${count} cita${count > 1 ? 's' : ''}` : '—'}</span>
                </div>
              )
            })}
          </Card>
        </div>
      </div>

      {/* New cita modal */}
      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title="Agendar nueva cita" width={480}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <FormGrid>
            <Field label="Paciente *">
              <Select value={form.pacienteId} onChange={e => setForm(f => ({ ...f, pacienteId: e.target.value }))}>
                <option value="">Seleccionar...</option>
                {pacientes.map(p => <option key={p.id} value={p.id}>{p.nombre}</option>)}
              </Select>
            </Field>
            <Field label="Tipo de sesión">
              <Select value={form.tipo} onChange={e => setForm(f => ({ ...f, tipo: e.target.value }))}>
                {TIPOS_SESION.map(t => <option key={t}>{t}</option>)}
              </Select>
            </Field>
          </FormGrid>
          <FormGrid>
            <Field label="Fecha *">
              <Input type="date" value={form.fecha} onChange={e => setForm(f => ({ ...f, fecha: e.target.value }))} />
            </Field>
            <Field label="Hora *">
              <Select value={form.hora} onChange={e => setForm(f => ({ ...f, hora: e.target.value }))}>
                {HOURS.map(h => <option key={h}>{h}</option>)}
              </Select>
            </Field>
          </FormGrid>
          <Field label="Notas (opcional)">
            <Input placeholder="Ej: Traer radiografía, puntual por favor..." value={form.notas} onChange={e => setForm(f => ({ ...f, notas: e.target.value }))} />
          </Field>
          <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, cursor: 'pointer' }}>
            <input type="checkbox" checked={form.recordatorio} onChange={e => setForm(f => ({ ...f, recordatorio: e.target.checked }))} />
            Marcar con recordatorio 🔔
          </label>
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8, marginTop: 4 }}>
            <Btn onClick={() => setModalOpen(false)}>Cancelar</Btn>
            <Btn variant="primary" onClick={saveCita}>Guardar cita</Btn>
          </div>
        </div>
      </Modal>

      {/* Detail/convert modal */}
      {detailCita && (
        <Modal open={!!detailCita} onClose={() => setDetailCita(null)} title="Detalle de cita" width={400}>
          {(() => {
            const p = getPac(detailCita.pacienteId)
            return (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  {p && <Avatar iniciales={p.iniciales} color={p.color} size={44} />}
                  <div>
                    <div style={{ fontWeight: 600, fontSize: 15 }}>{p?.nombre}</div>
                    <div style={{ fontSize: 12, color: 'var(--text-3)' }}>{p?.diagnostico}</div>
                  </div>
                </div>
                <div style={{ background: 'var(--surface-2)', borderRadius: 'var(--radius-sm)', padding: '12px 14px', fontSize: 13 }}>
                  <div><b>Fecha:</b> {fmtDate(detailCita.fecha)}</div>
                  <div><b>Hora:</b> {detailCita.hora}</div>
                  <div><b>Tipo:</b> {detailCita.tipo}</div>
                  {detailCita.notas && <div><b>Notas:</b> {detailCita.notas}</div>}
                </div>
                <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end', flexWrap: 'wrap' }}>
                  <Btn variant="danger" size="sm" onClick={() => { deleteCita(detailCita.id); setDetailCita(null) }}>Eliminar cita</Btn>
                  <Btn variant="primary" size="sm" onClick={() => convertirSesion(detailCita)}>✓ Registrar como sesión</Btn>
                </div>
              </div>
            )
          })()}
        </Modal>
      )}
    </div>
  )
}
