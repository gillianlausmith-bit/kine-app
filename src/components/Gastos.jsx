import React, { useState } from 'react'
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts'
import { Card, CardTitle, MetricCard, Btn, Modal, Field, Input, Select, FormGrid, EmptyState } from './UI'
import { fmt, fmtDate, today, currentMonth, CATS_GASTO } from '../utils'

const CAT_COLORS = ['#1D9E75','#185FA5','#D85A30','#BA7517','#D4537E','#888780','#639922']
const defaultForm = { concepto: '', cat: 'Transporte', monto: '', fecha: today(), notas: '' }

export default function Gastos({ gastos, addGasto, removeGasto, sesiones }) {
  const [modalOpen, setModalOpen] = useState(false)
  const [form, setForm] = useState(defaultForm)

  const mes = currentMonth()
  const gastosMes = gastos.filter(g => g.fecha.startsWith(mes))
  const totalGastos = gastosMes.reduce((s, g) => s + g.monto, 0)
  const ingresosMes = sesiones.filter(s => s.fecha.startsWith(mes)).reduce((s, x) => s + x.monto, 0)
  const neto = ingresosMes - totalGastos
  const margen = ingresosMes ? Math.round(neto / ingresosMes * 100) : 0

  const pieData = Object.entries(
    gastosMes.reduce((acc, g) => { acc[g.cat] = (acc[g.cat] || 0) + g.monto; return acc }, {})
  ).map(([name, value]) => ({ name, value }))

  async function save() {
    if (!form.concepto || !form.monto) return alert('Completa concepto y monto')
    await addGasto({ concepto: form.concepto, cat: form.cat, monto: parseInt(form.monto), fecha: form.fecha, notas: form.notas })
    setModalOpen(false)
    setForm(defaultForm)
  }

  async function remove(id) {
    if (window.confirm('¿Eliminar este gasto?')) await removeGasto(id)
  }

  return (
    <div className="fade-in" style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12 }}>
        <MetricCard label="Ingresos del mes" value={fmt(ingresosMes)} sub="sesiones cobradas" icon="💰" />
        <MetricCard label="Gastos del mes" value={fmt(totalGastos)} sub={`${gastosMes.length} registros`} icon="🧾" />
        <MetricCard label="Ingreso neto" value={fmt(neto)} sub={`margen ${margen}%`} icon="📊" accent={neto > 0} />
        <MetricCard label="Margen" value={`${margen}%`} sub="sobre ingresos brutos" icon="📈" />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: 16, alignItems: 'start' }}>
        <Card>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
            <CardTitle>Gastos registrados</CardTitle>
            <Btn variant="primary" size="sm" onClick={() => { setForm(defaultForm); setModalOpen(true) }}>+ Registrar gasto</Btn>
          </div>
          {gastos.length === 0 ? (
            <EmptyState icon="🧾" text="Sin gastos registrados" />
          ) : (
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
              <thead>
                <tr>
                  {['Fecha', 'Concepto', 'Categoría', 'Monto', ''].map(h => (
                    <th key={h} style={{ textAlign: 'left', padding: '0 8px 10px', fontSize: 11, fontWeight: 600, color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: '0.05em', borderBottom: '1px solid var(--border)' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {[...gastos].sort((a, b) => b.fecha.localeCompare(a.fecha)).map(g => (
                  <tr key={g.id} style={{ borderBottom: '1px solid var(--border)' }}>
                    <td style={{ padding: '9px 8px', color: 'var(--text-3)', whiteSpace: 'nowrap' }}>{fmtDate(g.fecha)}</td>
                    <td style={{ padding: '9px 8px', fontWeight: 500 }}>{g.concepto}</td>
                    <td style={{ padding: '9px 8px', color: 'var(--text-2)' }}>{g.cat}</td>
                    <td style={{ padding: '9px 8px', fontWeight: 600, color: 'var(--red-600)' }}>−{fmt(g.monto)}</td>
                    <td style={{ padding: '9px 8px', textAlign: 'right' }}>
                      <button onClick={() => remove(g.id)} style={{ fontSize: 13, color: 'var(--text-3)', background: 'none', border: 'none', cursor: 'pointer' }}>✕</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </Card>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <Card>
            <CardTitle>Gastos por categoría · {mes}</CardTitle>
            {pieData.length === 0 ? (
              <EmptyState icon="📊" text="Sin datos este mes" />
            ) : (
              <ResponsiveContainer width="100%" height={220}>
                <PieChart>
                  <Pie data={pieData} cx="50%" cy="50%" innerRadius={55} outerRadius={85} dataKey="value" paddingAngle={2}>
                    {pieData.map((_, i) => <Cell key={i} fill={CAT_COLORS[i % CAT_COLORS.length]} />)}
                  </Pie>
                  <Tooltip formatter={v => fmt(v)} contentStyle={{ fontSize: 12, borderRadius: 8, border: '1px solid var(--border)' }} />
                  <Legend iconSize={10} iconType="square" wrapperStyle={{ fontSize: 11, color: 'var(--text-2)' }} />
                </PieChart>
              </ResponsiveContainer>
            )}
          </Card>

          <Card>
            <CardTitle>Resumen financiero</CardTitle>
            {[['Ingresos brutos', fmt(ingresosMes), false], ['Total gastos', '−' + fmt(totalGastos), true]].map(([l, v, neg]) => (
              <div key={l} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid var(--border)', fontSize: 13 }}>
                <span style={{ color: 'var(--text-2)' }}>{l}</span>
                <span style={{ fontWeight: 500, color: neg ? 'var(--red-600)' : 'var(--text-1)' }}>{v}</span>
              </div>
            ))}
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 0 0', fontSize: 14, fontWeight: 600 }}>
              <span>Ingreso neto</span>
              <span style={{ color: neto >= 0 ? 'var(--accent)' : 'var(--red-600)' }}>{fmt(neto)}</span>
            </div>
          </Card>
        </div>
      </div>

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title="Registrar gasto" width={480}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <FormGrid>
            <Field label="Concepto *">
              <Input placeholder="Ej: Bencina semana" value={form.concepto} onChange={e => setForm(f => ({ ...f, concepto: e.target.value }))} />
            </Field>
            <Field label="Categoría">
              <Select value={form.cat} onChange={e => setForm(f => ({ ...f, cat: e.target.value }))}>
                {CATS_GASTO.map(c => <option key={c}>{c}</option>)}
              </Select>
            </Field>
          </FormGrid>
          <FormGrid>
            <Field label="Monto ($) *">
              <Input type="number" placeholder="15000" value={form.monto} onChange={e => setForm(f => ({ ...f, monto: e.target.value }))} />
            </Field>
            <Field label="Fecha">
              <Input type="date" value={form.fecha} onChange={e => setForm(f => ({ ...f, fecha: e.target.value }))} />
            </Field>
          </FormGrid>
          <Field label="Notas (opcional)">
            <Input placeholder="Detalles adicionales" value={form.notas} onChange={e => setForm(f => ({ ...f, notas: e.target.value }))} />
          </Field>
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8, marginTop: 4 }}>
            <Btn onClick={() => setModalOpen(false)}>Cancelar</Btn>
            <Btn variant="primary" onClick={save}>Registrar gasto</Btn>
          </div>
        </div>
      </Modal>
    </div>
  )
}
