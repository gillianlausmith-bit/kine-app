import React, { useMemo } from 'react'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LineChart, Line, CartesianGrid } from 'recharts'
import { Card, CardTitle, MetricCard, Badge, Avatar } from './UI'
import { fmt, fmtDate, currentMonth, getWeekNumber } from '../utils'

function payBadge(pagado) {
  if (pagado === 'si') return <Badge color="teal">Pagado</Badge>
  if (pagado === 'pendiente') return <Badge color="amber">Pendiente</Badge>
  return <Badge color="blue">Transferencia</Badge>
}

export default function Resumen({ sesiones, pacientes, gastos, citas }) {
  const mes = currentMonth()
  const sesMes = useMemo(() => sesiones.filter(s => s.fecha.startsWith(mes)), [sesiones, mes])

  const totalMes = sesMes.reduce((s, x) => s + x.monto, 0)
  const totalGastos = gastos.filter(g => g.fecha.startsWith(mes)).reduce((s, g) => s + g.monto, 0)
  const neto = totalMes - totalGastos
  const pacMes = new Set(sesMes.map(s => s.pacienteId)).size
  const prom = sesMes.length ? totalMes / sesMes.length : 0
  const diaHoy = new Date().getDate()
  const diasMes = new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0).getDate()
  const proyectado = diaHoy > 0 ? (totalMes / diaHoy) * diasMes : 0

  // Weekly breakdown
  const semanas = [0, 0, 0, 0, 0]
  sesMes.forEach(s => {
    const w = Math.min(getWeekNumber(s.fecha) - 1, 4)
    semanas[w] += s.monto
  })
  const weekData = semanas.map((v, i) => ({ semana: `Sem ${i + 1}`, ingreso: v })).filter((_, i) => semanas[i] > 0 || i < 4)

  // Today's citas
  const todayStr = new Date().toISOString().split('T')[0]
  const citasHoy = citas.filter(c => c.fecha === todayStr).sort((a, b) => a.hora.localeCompare(b.hora))

  // Recent sessions
  const recent = [...sesiones].sort((a, b) => b.fecha.localeCompare(a.fecha)).slice(0, 6)

  const getPac = id => pacientes.find(p => p.id === id)

  return (
    <div className="fade-in" style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      {/* Metrics */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12 }}>
        <MetricCard label="Ingresos del mes" value={fmt(totalMes)} sub={`${sesMes.length} sesiones`} icon="💰" accent />
        <MetricCard label="Pacientes atendidos" value={pacMes} sub="este mes" icon="🧑‍⚕️" />
        <MetricCard label="Valor por sesión" value={fmt(prom)} sub="promedio" icon="📋" />
        <MetricCard label="Neto estimado" value={fmt(neto)} sub="ingresos − gastos" icon="📊" />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: 16 }}>
        {/* Weekly chart */}
        <Card>
          <CardTitle>Ingresos por semana · {mes}</CardTitle>
          <ResponsiveContainer width="100%" height={190}>
            <BarChart data={weekData} barSize={32}>
              <XAxis dataKey="semana" tick={{ fontSize: 11, fill: 'var(--text-3)' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: 'var(--text-3)' }} axisLine={false} tickLine={false} tickFormatter={v => '$' + (v / 1000) + 'k'} />
              <Tooltip formatter={v => [fmt(v), 'Ingresos']} contentStyle={{ fontSize: 12, borderRadius: 8, border: '1px solid var(--border)' }} />
              <Bar dataKey="ingreso" fill="var(--accent)" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </Card>

        {/* Today's agenda */}
        <Card>
          <CardTitle>Agenda de hoy · {fmtDate(todayStr)}</CardTitle>
          {citasHoy.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '30px 0', color: 'var(--text-3)', fontSize: 13 }}>
              <div style={{ fontSize: 28, marginBottom: 8 }}>🌿</div>
              Sin citas para hoy
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {citasHoy.map(c => {
                const p = getPac(c.pacienteId)
                return (
                  <div key={c.id} style={{ display: 'flex', gap: 10, alignItems: 'center', padding: '8px 10px', background: 'var(--surface-2)', borderRadius: 'var(--radius-sm)', borderLeft: '3px solid var(--accent)' }}>
                    {p && <Avatar iniciales={p.iniciales} color={p.color} size={30} />}
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontWeight: 500, fontSize: 13, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{p?.nombre}</div>
                      <div style={{ fontSize: 11, color: 'var(--text-3)' }}>{c.hora} · {c.tipo}</div>
                    </div>
                    {c.recordatorio && <span title="Con recordatorio" style={{ fontSize: 14 }}>🔔</span>}
                  </div>
                )
              })}
            </div>
          )}
        </Card>
      </div>

      {/* Recent sessions table */}
      <Card>
        <CardTitle>Últimas sesiones registradas</CardTitle>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
          <thead>
            <tr>
              {['Fecha', 'Paciente', 'Tipo', 'Monto', 'Estado'].map(h => (
                <th key={h} style={{ textAlign: 'left', padding: '0 10px 10px', fontSize: 11, fontWeight: 600, color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: '0.05em', borderBottom: '1px solid var(--border)' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {recent.map(s => {
              const p = getPac(s.pacienteId)
              return (
                <tr key={s.id} style={{ borderBottom: '1px solid var(--border)' }}>
                  <td style={{ padding: '10px', color: 'var(--text-2)' }}>{fmtDate(s.fecha)}</td>
                  <td style={{ padding: '10px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      {p && <Avatar iniciales={p.iniciales} color={p.color} size={24} />}
                      <span style={{ fontWeight: 500 }}>{p?.nombre}</span>
                    </div>
                  </td>
                  <td style={{ padding: '10px', color: 'var(--text-2)' }}>{s.tipo}</td>
                  <td style={{ padding: '10px', fontWeight: 600 }}>{fmt(s.monto)}</td>
                  <td style={{ padding: '10px' }}>{payBadge(s.pagado)}</td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </Card>
    </div>
  )
}
