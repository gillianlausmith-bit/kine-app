import React, { useState } from 'react'
import { Card, CardTitle, Badge, Btn, Avatar, Modal, Field, Input, Select, FormGrid, EmptyState } from './UI'
import { fmt, fmtDate, today, TIPOS_SESION } from '../utils'

function payBadge(p) {
  if (p === 'si') return <Badge color="teal">Pagado</Badge>
  if (p === 'pendiente') return <Badge color="amber">Pendiente</Badge>
  return <Badge color="blue">Transferencia</Badge>
}

const defaultForm = { fecha: today(), pacienteId: '', tipo: 'Rehabilitación', monto: '', pagado: 'si', notas: '' }

export default function Sesiones({ sesiones, addSesion, removeSesion, pacientes }) {
  const [modalOpen, setModalOpen] = useState(false)
  const [form, setForm] = useState(defaultForm)
  const [filtro, setFiltro] = useState('todas')

  const getPac = id => pacientes.find(p => p.id === id)

  const filtradas = [...sesiones]
    .sort((a, b) => b.fecha.localeCompare(a.fecha))
    .filter(s => filtro === 'todas' ? true : s.pagado === filtro)

  async function save() {
    if (!form.pacienteId || !form.monto || !form.fecha) return alert('Completa todos los campos obligatorios')
    await addSesion({ ...form, pacienteId: parseInt(form.pacienteId), monto: parseInt(form.monto) })
    setModalOpen(false)
  }

  async function remove(id) {
    if (window.confirm('¿Eliminar esta sesión?')) await removeSesion(id)
  }

  const totalFiltrado = filtradas.reduce((s, x) => s + x.monto, 0)

  return (
    <div className="fade-in" style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', gap: 6 }}>
          {[['todas', 'Todas'], ['si', 'Pagadas'], ['pendiente', 'Pendientes'], ['transferencia', 'Transferencia']].map(([v, l]) => (
            <button key={v} onClick={() => setFiltro(v)} style={{
              padding: '5px 12px', borderRadius: 20, fontSize: 12, fontWeight: 500, border: '1px solid',
              background: filtro === v ? 'var(--accent)' : 'var(--surface)',
              borderColor: filtro === v ? 'var(--accent)' : 'var(--border-md)',
              color: filtro === v ? '#fff' : 'var(--text-2)',
              cursor: 'pointer', transition: 'all 0.15s',
            }}>{l}</button>
          ))}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <span style={{ fontSize: 13, color: 'var(--text-2)' }}>{filtradas.length} sesiones · <b>{fmt(totalFiltrado)}</b></span>
          <Btn variant="primary" onClick={() => { setForm(defaultForm); setModalOpen(true) }}>+ Registrar sesión</Btn>
        </div>
      </div>

      <Card>
        {filtradas.length === 0 ? (
          <EmptyState icon="📋" text="No hay sesiones registradas" />
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
            <thead>
              <tr>
                {['Fecha', 'Paciente', 'Tipo de sesión', 'Monto', 'Estado', ''].map(h => (
                  <th key={h} style={{ textAlign: 'left', padding: '0 10px 10px', fontSize: 11, fontWeight: 600, color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: '0.05em', borderBottom: '1px solid var(--border)' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtradas.map(s => {
                const p = getPac(s.pacienteId)
                return (
                  <tr key={s.id} style={{ borderBottom: '1px solid var(--border)' }}>
                    <td style={{ padding: '10px', color: 'var(--text-2)' }}>{fmtDate(s.fecha)}</td>
                    <td style={{ padding: '10px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        {p && <Avatar iniciales={p.iniciales} color={p.color} size={24} />}
                        <div>
                          <div style={{ fontWeight: 500 }}>{p?.nombre}</div>
                          {s.notas && <div style={{ fontSize: 11, color: 'var(--text-3)' }}>{s.notas}</div>}
                        </div>
                      </div>
                    </td>
                    <td style={{ padding: '10px', color: 'var(--text-2)' }}>{s.tipo}</td>
                    <td style={{ padding: '10px', fontWeight: 600 }}>{fmt(s.monto)}</td>
                    <td style={{ padding: '10px' }}>{payBadge(s.pagado)}</td>
                    <td style={{ padding: '10px', textAlign: 'right' }}>
                      <button onClick={() => remove(s.id)} style={{ fontSize: 13, color: 'var(--text-3)', background: 'none', border: 'none', cursor: 'pointer' }}>✕</button>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        )}
      </Card>

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title="Registrar sesión" width={500}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <FormGrid>
            <Field label="Paciente *">
              <Select value={form.pacienteId} onChange={e => setForm(f => ({ ...f, pacienteId: e.target.value }))}>
                <option value="">Seleccionar...</option>
                {pacientes.map(p => <option key={p.id} value={p.id}>{p.nombre}</option>)}
              </Select>
            </Field>
            <Field label="Fecha *">
              <Input type="date" value={form.fecha} onChange={e => setForm(f => ({ ...f, fecha: e.target.value }))} />
            </Field>
          </FormGrid>
          <FormGrid>
            <Field label="Tipo de sesión">
              <Select value={form.tipo} onChange={e => setForm(f => ({ ...f, tipo: e.target.value }))}>
                {TIPOS_SESION.map(t => <option key={t}>{t}</option>)}
              </Select>
            </Field>
            <Field label="Monto cobrado ($) *">
              <Input type="number" placeholder="25000" value={form.monto} onChange={e => setForm(f => ({ ...f, monto: e.target.value }))} />
            </Field>
          </FormGrid>
          <FormGrid>
            <Field label="Estado de pago">
              <Select value={form.pagado} onChange={e => setForm(f => ({ ...f, pagado: e.target.value }))}>
                <option value="si">Pagado al contado</option>
                <option value="transferencia">Transferencia</option>
                <option value="pendiente">Pendiente</option>
              </Select>
            </Field>
            <Field label="Notas (opcional)">
              <Input placeholder="Ej: traer radiografía" value={form.notas} onChange={e => setForm(f => ({ ...f, notas: e.target.value }))} />
            </Field>
          </FormGrid>
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8, marginTop: 4 }}>
            <Btn onClick={() => setModalOpen(false)}>Cancelar</Btn>
            <Btn variant="primary" onClick={save}>Registrar sesión</Btn>
          </div>
        </div>
      </Modal>
    </div>
  )
}
