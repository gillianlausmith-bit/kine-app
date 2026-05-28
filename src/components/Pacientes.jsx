import React, { useState } from 'react'
import { Card, Avatar, Badge, Btn, Modal, Field, Input, Select, FormGrid, EmptyState } from './UI'
import { fmt, fmtDate, getInitials, COLORS_LIST, nextId } from '../utils'

const defaultForm = { nombre: '', diagnostico: '', tel: '', email: '', valorHabitual: '', color: 'teal' }

export default function Pacientes({ pacientes, addPaciente, removePaciente, sesiones }) {
  const [modalOpen, setModalOpen] = useState(false)
  const [form, setForm] = useState(defaultForm)
  const [selected, setSelected] = useState(null)
  const [search, setSearch] = useState('')

  function getPacStats(id) {
    const s = sesiones.filter(x => x.pacienteId === id)
    const total = s.reduce((acc, x) => acc + x.monto, 0)
    const ultima = [...s].sort((a, b) => b.fecha.localeCompare(a.fecha))[0]
    return { count: s.length, total, ultima }
  }

  const filtered = pacientes.filter(p =>
    p.nombre.toLowerCase().includes(search.toLowerCase()) ||
    (p.diagnostico || '').toLowerCase().includes(search.toLowerCase())
  )

  async function save() {
    if (!form.nombre.trim()) return alert('El nombre es obligatorio')
    await addPaciente({
      nombre: form.nombre,
      diagnostico: form.diagnostico,
      tel: form.tel,
      email: form.email,
      valorHabitual: parseInt(form.valorHabitual) || 25000,
      iniciales: getInitials(form.nombre),
      color: form.color || 'teal',
    })
    setModalOpen(false)
    setForm(defaultForm)
  }

  async function remove(id) {
    if (window.confirm('¿Eliminar este paciente?')) {
      await removePaciente(id)
      setSelected(null)
    }
  }

  return (
    <div className="fade-in" style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <input
          placeholder="Buscar paciente o diagnóstico..."
          value={search} onChange={e => setSearch(e.target.value)}
          style={{ height: 36, flex: 1, border: '1px solid var(--border-md)', borderRadius: 'var(--radius-sm)', padding: '0 12px', fontSize: 13, background: 'var(--surface)', color: 'var(--text-1)', outline: 'none' }}
        />
        <Btn variant="primary" onClick={() => { setForm(defaultForm); setModalOpen(true) }}>+ Agregar paciente</Btn>
      </div>

      {filtered.length === 0 ? (
        <EmptyState icon="🧑‍⚕️" text="No hay pacientes registrados" />
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 12 }}>
          {filtered.map(p => {
            const stats = getPacStats(p.id)
            return (
              <div key={p.id} onClick={() => setSelected(p)} style={{
                background: 'var(--surface)', border: '1px solid var(--border)',
                borderRadius: 'var(--radius-lg)', padding: '16px', cursor: 'pointer',
                transition: 'box-shadow 0.15s, border-color 0.15s', boxShadow: 'var(--shadow-sm)',
              }}
                onMouseEnter={e => { e.currentTarget.style.boxShadow = 'var(--shadow-md)'; e.currentTarget.style.borderColor = 'var(--border-md)' }}
                onMouseLeave={e => { e.currentTarget.style.boxShadow = 'var(--shadow-sm)'; e.currentTarget.style.borderColor = 'var(--border)' }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
                  <Avatar iniciales={p.iniciales} color={p.color} size={42} />
                  <div>
                    <div style={{ fontWeight: 600, fontSize: 14 }}>{p.nombre}</div>
                    <div style={{ fontSize: 12, color: 'var(--text-3)' }}>{p.diagnostico}</div>
                  </div>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, borderTop: '1px solid var(--border)', paddingTop: 12 }}>
                  <div>
                    <div style={{ fontSize: 10, color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 2 }}>Sesiones</div>
                    <div style={{ fontWeight: 600, fontSize: 15 }}>{stats.count}</div>
                  </div>
                  <div>
                    <div style={{ fontSize: 10, color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 2 }}>Total</div>
                    <div style={{ fontWeight: 600, fontSize: 15 }}>{fmt(stats.total)}</div>
                  </div>
                  <div style={{ gridColumn: '1 / -1' }}>
                    <div style={{ fontSize: 10, color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 2 }}>Última sesión</div>
                    <div style={{ fontSize: 12, color: 'var(--text-2)' }}>{stats.ultima ? fmtDate(stats.ultima.fecha) : 'Sin sesiones'}</div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title="Agregar paciente" width={500}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <FormGrid>
            <Field label="Nombre completo *">
              <Input placeholder="Ej: María González" value={form.nombre} onChange={e => setForm(f => ({ ...f, nombre: e.target.value }))} />
            </Field>
            <Field label="Diagnóstico / motivo">
              <Input placeholder="Ej: Lumbago crónico" value={form.diagnostico} onChange={e => setForm(f => ({ ...f, diagnostico: e.target.value }))} />
            </Field>
          </FormGrid>
          <FormGrid>
            <Field label="Teléfono">
              <Input placeholder="+56 9 XXXX XXXX" value={form.tel} onChange={e => setForm(f => ({ ...f, tel: e.target.value }))} />
            </Field>
            <Field label="Email">
              <Input type="email" placeholder="correo@email.com" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} />
            </Field>
          </FormGrid>
          <FormGrid>
            <Field label="Valor habitual de sesión ($)">
              <Input type="number" placeholder="25000" value={form.valorHabitual} onChange={e => setForm(f => ({ ...f, valorHabitual: e.target.value }))} />
            </Field>
            <Field label="Color de avatar">
              <Select value={form.color} onChange={e => setForm(f => ({ ...f, color: e.target.value }))}>
                {COLORS_LIST.map(c => <option key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</option>)}
              </Select>
            </Field>
          </FormGrid>
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8, marginTop: 4 }}>
            <Btn onClick={() => setModalOpen(false)}>Cancelar</Btn>
            <Btn variant="primary" onClick={save}>Agregar paciente</Btn>
          </div>
        </div>
      </Modal>

      {selected && (
        <Modal open={!!selected} onClose={() => setSelected(null)} title="Ficha del paciente" width={520}>
          {(() => {
            const stats = getPacStats(selected.id)
            const historial = sesiones.filter(s => s.pacienteId === selected.id).sort((a, b) => b.fecha.localeCompare(a.fecha))
            return (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                  <Avatar iniciales={selected.iniciales} color={selected.color} size={52} />
                  <div>
                    <div style={{ fontWeight: 600, fontSize: 17 }}>{selected.nombre}</div>
                    <div style={{ fontSize: 13, color: 'var(--text-3)' }}>{selected.diagnostico}</div>
                    <div style={{ fontSize: 12, color: 'var(--text-3)', marginTop: 3 }}>{selected.tel} {selected.email && `· ${selected.email}`}</div>
                  </div>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10 }}>
                  {[['Sesiones', stats.count], ['Total ingresos', fmt(stats.total)], ['Valor habitual', fmt(selected.valorHabitual || 0)]].map(([l, v]) => (
                    <div key={l} style={{ background: 'var(--surface-2)', borderRadius: 'var(--radius-sm)', padding: '10px 12px' }}>
                      <div style={{ fontSize: 10, color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 4 }}>{l}</div>
                      <div style={{ fontWeight: 600, fontSize: 16 }}>{v}</div>
                    </div>
                  ))}
                </div>
                {historial.length > 0 && (
                  <div>
                    <div style={{ fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--text-3)', marginBottom: 8 }}>Historial de sesiones</div>
                    {historial.slice(0, 8).map(s => (
                      <div key={s.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '7px 0', borderBottom: '1px solid var(--border)', fontSize: 13 }}>
                        <span style={{ color: 'var(--text-2)' }}>{fmtDate(s.fecha)}</span>
                        <span>{s.tipo}</span>
                        <span style={{ fontWeight: 500 }}>{fmt(s.monto)}</span>
                      </div>
                    ))}
                  </div>
                )}
                <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                  <Btn variant="danger" size="sm" onClick={() => remove(selected.id)}>Eliminar paciente</Btn>
                </div>
              </div>
            )
          })()}
        </Modal>
      )}
    </div>
  )
}
