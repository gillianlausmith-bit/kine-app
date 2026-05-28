export function fmt(n) {
  return '$' + Math.round(n).toLocaleString('es-CL')
}

export function fmtDate(dateStr) {
  if (!dateStr) return ''
  const [y, m, d] = dateStr.split('-')
  return `${d}/${m}/${y}`
}

export function today() {
  return new Date().toISOString().split('T')[0]
}

export function getWeekNumber(dateStr) {
  const d = new Date(dateStr + 'T12:00')
  return Math.ceil(d.getDate() / 7)
}

export function getMesStr(dateStr) {
  return dateStr ? dateStr.slice(0, 7) : ''
}

export function currentMonth() {
  return today().slice(0, 7)
}

// Avatar colors
export const avatarColors = {
  teal:  { bg: '#e1f5ee', text: '#0F6E56' },
  blue:  { bg: '#e6f1fb', text: '#185FA5' },
  amber: { bg: '#faeeda', text: '#854F0B' },
  red:   { bg: '#fcebeb', text: '#A32D2D' },
  green: { bg: '#eaf3de', text: '#3B6D11' },
}

export const COLORS_LIST = ['teal', 'blue', 'amber', 'red', 'green']

export function getInitials(nombre) {
  const parts = nombre.trim().split(' ')
  return (parts[0][0] + (parts[1] ? parts[1][0] : parts[0][1] || '')).toUpperCase()
}

export function nextId(arr) {
  return arr.length ? Math.max(...arr.map(x => x.id)) + 1 : 1
}

export const TIPOS_SESION = [
  'Rehabilitación',
  'Evaluación inicial',
  'Tratamiento postural',
  'Kinesiología deportiva',
  'Post operatorio',
  'Neurológica',
  'Adulto mayor',
  'Pediatría',
  'Otro',
]

export const CATS_GASTO = [
  'Transporte',
  'Insumos médicos',
  'Equipamiento',
  'Comunicaciones',
  'Capacitación',
  'Arriendo / espacio',
  'Otro',
]

export const DIAS_SEMANA = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb']

export function getDayOfWeek(dateStr) {
  return new Date(dateStr + 'T12:00').getDay()
}

export function addDays(dateStr, n) {
  const d = new Date(dateStr + 'T12:00')
  d.setDate(d.getDate() + n)
  return d.toISOString().split('T')[0]
}

export function isSameDay(a, b) {
  return a === b
}

export function getWeekStart(dateStr) {
  const d = new Date(dateStr + 'T12:00')
  const day = d.getDay() // 0=Sun
  const monday = new Date(d)
  monday.setDate(d.getDate() - ((day + 6) % 7))
  return monday.toISOString().split('T')[0]
}
