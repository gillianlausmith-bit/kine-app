export const seedPacientes = [
  { id: 1, nombre: 'Carlos Muñoz', diagnostico: 'Lumbago crónico', tel: '+56 9 8765 4321', email: 'carlos@email.com', valorHabitual: 25000, iniciales: 'CM', color: 'teal' },
  { id: 2, nombre: 'Rosa Espinoza', diagnostico: 'Post operatorio rodilla', tel: '+56 9 7654 3210', email: 'rosa@email.com', valorHabitual: 30000, iniciales: 'RE', color: 'blue' },
  { id: 3, nombre: 'Felipe Araya', diagnostico: 'Lesión hombro deportiva', tel: '+56 9 6543 2109', email: 'felipe@email.com', valorHabitual: 28000, iniciales: 'FA', color: 'amber' },
  { id: 4, nombre: 'Lucía Vargas', diagnostico: 'Cervicalgia', tel: '+56 9 5432 1098', email: 'lucia@email.com', valorHabitual: 22000, iniciales: 'LV', color: 'red' },
]

export const seedSesiones = [
  { id: 1,  fecha: '2025-05-02', pacienteId: 1, tipo: 'Rehabilitación',         monto: 25000, pagado: 'si',            notas: '' },
  { id: 2,  fecha: '2025-05-05', pacienteId: 2, tipo: 'Post operatorio',         monto: 30000, pagado: 'transferencia', notas: '' },
  { id: 3,  fecha: '2025-05-06', pacienteId: 3, tipo: 'Kinesiología deportiva',  monto: 28000, pagado: 'si',            notas: '' },
  { id: 4,  fecha: '2025-05-08', pacienteId: 1, tipo: 'Rehabilitación',         monto: 25000, pagado: 'si',            notas: '' },
  { id: 5,  fecha: '2025-05-09', pacienteId: 4, tipo: 'Tratamiento postural',   monto: 22000, pagado: 'pendiente',     notas: 'Llevar radiografía' },
  { id: 6,  fecha: '2025-05-12', pacienteId: 2, tipo: 'Post operatorio',         monto: 30000, pagado: 'si',            notas: '' },
  { id: 7,  fecha: '2025-05-13', pacienteId: 3, tipo: 'Kinesiología deportiva',  monto: 28000, pagado: 'transferencia', notas: '' },
  { id: 8,  fecha: '2025-05-15', pacienteId: 1, tipo: 'Rehabilitación',         monto: 25000, pagado: 'si',            notas: '' },
  { id: 9,  fecha: '2025-05-19', pacienteId: 4, tipo: 'Tratamiento postural',   monto: 22000, pagado: 'si',            notas: '' },
  { id: 10, fecha: '2025-05-20', pacienteId: 2, tipo: 'Post operatorio',         monto: 30000, pagado: 'si',            notas: '' },
  { id: 11, fecha: '2025-05-22', pacienteId: 3, tipo: 'Kinesiología deportiva',  monto: 28000, pagado: 'si',            notas: '' },
  { id: 12, fecha: '2025-05-26', pacienteId: 1, tipo: 'Rehabilitación',         monto: 25000, pagado: 'si',            notas: '' },
]

export const seedGastos = [
  { id: 1, concepto: 'Bencina mayo',                  cat: 'Transporte',    monto: 45000, fecha: '2025-05-01' },
  { id: 2, concepto: 'Insumos (vendas, electrodos)',  cat: 'Insumos',       monto: 18000, fecha: '2025-05-03' },
  { id: 3, concepto: 'Plan celular',                  cat: 'Comunicaciones',monto: 12000, fecha: '2025-05-05' },
]

// Agenda: citas agendadas (fecha + hora + pacienteId + notas)
export const seedCitas = [
  { id: 1, fecha: '2025-05-28', hora: '09:00', pacienteId: 1, tipo: 'Rehabilitación',        notas: 'Control semanal', recordatorio: true },
  { id: 2, fecha: '2025-05-28', hora: '11:00', pacienteId: 2, tipo: 'Post operatorio',        notas: '',                recordatorio: true },
  { id: 3, fecha: '2025-05-29', hora: '10:00', pacienteId: 3, tipo: 'Kinesiología deportiva', notas: 'Evaluación post partido', recordatorio: false },
  { id: 4, fecha: '2025-05-29', hora: '14:30', pacienteId: 4, tipo: 'Tratamiento postural',   notas: '',                recordatorio: true },
  { id: 5, fecha: '2025-05-30', hora: '09:30', pacienteId: 1, tipo: 'Rehabilitación',        notas: '',                recordatorio: true },
  { id: 6, fecha: '2025-06-02', hora: '08:00', pacienteId: 2, tipo: 'Post operatorio',        notas: 'Traer informe médico', recordatorio: false },
  { id: 7, fecha: '2025-06-03', hora: '16:00', pacienteId: 3, tipo: 'Kinesiología deportiva', notas: '',                recordatorio: true },
]
