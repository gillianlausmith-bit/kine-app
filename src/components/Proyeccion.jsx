import React, { useState, useMemo } from 'react'
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend } from 'recharts'
import { Card, CardTitle, MetricCard } from './UI'
import { fmt } from '../utils'

const MESES = ['Ene','Feb','Mar','Abr','May','Jun','Jul','Ago','Sep','Oct','Nov','Dic']

export default function Proyeccion({ sesiones }) {
  const [sesPorSemana, setSesPorSemana] = useState(15)
  const [valorSesion, setValorSesion] = useState(25000)

  const mensual = sesPorSemana * 4 * valorSesion
  const anual = sesPorSemana * 52 * valorSesion
  const anualVac = sesPorSemana * 50 * valorSesion

  const chartData = useMemo(() => MESES.map((m, i) => ({
    mes: m,
    conservador: Math.round(sesPorSemana * 0.8 * 4 * valorSesion),
    base:         Math.round(sesPorSemana * 4 * valorSesion),
    optimista:    Math.round(sesPorSemana * 1.2 * 4 * valorSesion),
  })), [sesPorSemana, valorSesion])

  const escenarios = [
    { label: 'Conservador (80%)', ses: Math.round(sesPorSemana * 0.8), mes: Math.round(mensual * 0.8), anual: Math.round(anual * 0.8) },
    { label: 'Base (100%)',       ses: sesPorSemana,                    mes: mensual,                   anual },
    { label: 'Optimista (120%)', ses: Math.round(sesPorSemana * 1.2), mes: Math.round(mensual * 1.2), anual: Math.round(anual * 1.2) },
  ]

  return (
    <div className="fade-in" style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      {/* Sliders */}
      <Card>
        <CardTitle>Configurar proyección</CardTitle>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
              <span style={{ fontSize: 13, color: 'var(--text-2)' }}>Sesiones por semana</span>
              <span style={{ fontWeight: 600, fontSize: 14 }}>{sesPorSemana}</span>
            </div>
            <input type="range" min={1} max={40} step={1} value={sesPorSemana} onChange={e => setSesPorSemana(+e.target.value)}
              style={{ width: '100%', accentColor: 'var(--accent)' }} />
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: 'var(--text-3)', marginTop: 4 }}>
              <span>1</span><span>40</span>
            </div>
          </div>
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
              <span style={{ fontSize: 13, color: 'var(--text-2)' }}>Valor por sesión</span>
              <span style={{ fontWeight: 600, fontSize: 14 }}>{fmt(valorSesion)}</span>
            </div>
            <input type="range" min={5000} max={100000} step={1000} value={valorSesion} onChange={e => setValorSesion(+e.target.value)}
              style={{ width: '100%', accentColor: 'var(--accent)' }} />
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: 'var(--text-3)', marginTop: 4 }}>
              <span>$5k</span><span>$100k</span>
            </div>
          </div>
        </div>
      </Card>

      {/* Summary metrics */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
        <MetricCard label="Ingreso mensual estimado" value={fmt(mensual)} sub={`${sesPorSemana} ses/sem · ${fmt(valorSesion)}/ses`} icon="📅" />
        <MetricCard label="Ingreso anual (sin vacaciones)" value={fmt(anual)} sub="52 semanas activas" icon="📆" />
        <MetricCard label="Anual con 2 sem. vacaciones" value={fmt(anualVac)} sub="50 semanas activas" icon="🏖️" accent />
      </div>

      {/* Chart */}
      <Card>
        <CardTitle>Proyección a 12 meses · 3 escenarios</CardTitle>
        <div style={{ display: 'flex', gap: 20, marginBottom: 16, fontSize: 12 }}>
          {[['#1D9E75', 'Optimista'], ['#185FA5', 'Base'], ['#a09e99', 'Conservador']].map(([c, l]) => (
            <div key={l} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <span style={{ width: 10, height: 10, borderRadius: 2, background: c, display: 'inline-block' }} />
              <span style={{ color: 'var(--text-2)' }}>{l}</span>
            </div>
          ))}
        </div>
        <ResponsiveContainer width="100%" height={240}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
            <XAxis dataKey="mes" tick={{ fontSize: 11, fill: 'var(--text-3)' }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 11, fill: 'var(--text-3)' }} axisLine={false} tickLine={false} tickFormatter={v => '$' + Math.round(v/1000) + 'k'} />
            <Tooltip formatter={(v, n) => [fmt(v), n]} contentStyle={{ fontSize: 12, borderRadius: 8, border: '1px solid var(--border)' }} />
            <Line type="monotone" dataKey="optimista"    stroke="#1D9E75" strokeWidth={2} dot={false} />
            <Line type="monotone" dataKey="base"         stroke="#185FA5" strokeWidth={2.5} dot={false} />
            <Line type="monotone" dataKey="conservador"  stroke="#a09e99" strokeWidth={1.5} dot={false} strokeDasharray="5 3" />
          </LineChart>
        </ResponsiveContainer>
      </Card>

      {/* Scenarios table */}
      <Card>
        <CardTitle>Comparativa de escenarios</CardTitle>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
          <thead>
            <tr>
              {['Escenario', 'Ses/semana', 'Ingreso mensual', 'Ingreso anual'].map(h => (
                <th key={h} style={{ textAlign: 'left', padding: '0 12px 10px', fontSize: 11, fontWeight: 600, color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: '0.05em', borderBottom: '1px solid var(--border)' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {escenarios.map((e, i) => (
              <tr key={e.label} style={{ borderBottom: '1px solid var(--border)', fontWeight: i === 1 ? 600 : 400, background: i === 1 ? 'var(--teal-50)' : 'transparent' }}>
                <td style={{ padding: '11px 12px' }}>{e.label}</td>
                <td style={{ padding: '11px 12px', color: 'var(--text-2)' }}>{e.ses}</td>
                <td style={{ padding: '11px 12px' }}>{fmt(e.mes)}</td>
                <td style={{ padding: '11px 12px' }}>{fmt(e.anual)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </div>
  )
}
