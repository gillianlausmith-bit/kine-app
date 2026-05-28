# 🩺 KineApp — Gestión de Kinesiología a Domicilio

App para que tu mamá organice su negocio de kine: pacientes, sesiones, agenda, ingresos y gastos.

## Requisitos

- Node.js 18+
- npm o yarn

## Instalación y arranque

```bash
# 1. Instalar dependencias
npm install

# 2. Iniciar en modo desarrollo
npm run dev

# 3. Abrir en el navegador
# → http://localhost:5173
```

## Producción (opcional)

```bash
npm run build    # genera la carpeta dist/
npm run preview  # previsualiza la build
```

---

## Funcionalidades

| Sección       | Descripción |
|---------------|-------------|
| **Resumen**   | Dashboard con métricas del mes, ingresos semanales, agenda del día y últimas sesiones |
| **Agenda**    | Calendario semanal para agendar citas. Con detalle, recordatorio y opción de convertir la cita en sesión registrada |
| **Sesiones**  | Registro de todas las atenciones: fecha, paciente, tipo, monto y estado de pago (contado, transferencia, pendiente) |
| **Pacientes** | Fichas de cada paciente: diagnóstico, contacto, valor habitual, historial de sesiones |
| **Proyección**| Simulador de ingresos con sliders y 3 escenarios (conservador, base, optimista) |
| **Gastos**    | Registro de gastos del negocio (bencina, insumos, etc.) con balance ingreso/gasto mensual |

## Datos

- Todos los datos se guardan automáticamente en **localStorage** del navegador.
- Al abrir por primera vez carga datos de ejemplo (pacientes y sesiones de demo).
- Para empezar limpio: abre DevTools → Application → Local Storage → borrar las claves `kine_*`.

## Estructura del proyecto

```
src/
├── components/
│   ├── UI.jsx          # Componentes reutilizables (Card, Modal, Badge, etc.)
│   ├── Resumen.jsx     # Dashboard principal
│   ├── Agenda.jsx      # Calendario de citas
│   ├── Sesiones.jsx    # Lista y registro de sesiones
│   ├── Pacientes.jsx   # Fichas de pacientes
│   ├── Proyeccion.jsx  # Simulador de ingresos
│   └── Gastos.jsx      # Gastos y balance
├── data/
│   └── seed.js         # Datos de ejemplo iniciales
├── hooks/
│   └── useLocalStorage.js
├── App.jsx             # Layout principal con sidebar
├── main.jsx
├── index.css
└── utils.js            # Helpers: formato, fechas, constantes
```
