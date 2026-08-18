import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import {
  FileCode2,
  Wrench,
  Ruler,
  Hammer,
  CheckSquare,
  Clock,
  AlertTriangle,
} from "lucide-react";

const secciones = [
  {
    href: "/programas-cnc",
    titulo: "Programas CNC",
    descripcion: "Administrá tus programas de mecanizado organizados por pieza y operación.",
    icon: FileCode2,
    color: "#4a90e2",
    bg: "#eef4ff",
    border: "#bfdbfe",
  },
  {
    href: "/herramientas-cnc",
    titulo: "Herramientas CNC",
    descripcion: "Gestión de herramientas para tornos CNC. Códigos HMECH, HINSE, HPORT.",
    icon: Wrench,
    color: "#7c3aed",
    bg: "#f5f3ff",
    border: "#ddd6fe",
  },
  {
    href: "/medicion",
    titulo: "Herr. de Medición",
    descripcion: "Control de instrumentos de medición: micrómetros, calibres, comparadores.",
    icon: Ruler,
    color: "#0891b2",
    bg: "#ecfeff",
    border: "#a5f3fc",
  },
  {
    href: "/herramientas-manuales",
    titulo: "Herr. Manuales",
    descripcion: "Inventario de herramientas para el armado y mantenimiento de máquinas.",
    icon: Hammer,
    color: "#059669",
    bg: "#ecfdf5",
    border: "#a7f3d0",
  },
];

// Datos de ejemplo — después se reemplazan con queries reales a Supabase
const resumen = [
  { label: "Programas CNC",    valor: 85 },
  { label: "Herr. CNC",        valor: 120 },
  { label: "Herr. Medición",   valor: 48 },
  { label: "Herr. Manuales",   valor: 230 },
];

const actividad = [
  { texto: 'Programa O8768 actualizado',        tiempo: "Hace 30 min",  tipo: "ok" },
  { texto: 'Ingreso HMECH-007 al stock',         tiempo: "Hace 1 hora",  tipo: "ok" },
  { texto: 'Stock bajo: HINSE-234 (quedan 2)',   tiempo: "Hace 2 horas", tipo: "warn" },
  { texto: 'Calibración de micrómetro realizada',tiempo: "Ayer 17:40",  tipo: "ok" },
];

const notas = [
  { texto: "Revisar niveles de refrigerante",  done: true },
  { texto: "Actualizar stock de inserciones",   done: true },
  { texto: "Verificar calibre HINSE-234",       done: false },
];

export default async function DashboardPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const nombre = user?.user_metadata?.full_name ?? user?.email?.split("@")[0] ?? "Usuario";

  return (
    <div className="max-w-6xl mx-auto space-y-6">

      {/* Bienvenida */}
      <div className="text-center py-6">
        <h1 className="text-3xl font-medium text-slate-800">
          ¡Bienvenido, {nombre}!
        </h1>
        <p
          className="text-base font-medium mt-1"
          style={{ color: "#4a90e2" }}
        >
          Sistema de Gestión CNC
        </p>
        <div
          className="w-16 h-0.5 mx-auto mt-2 mb-3 rounded-full"
          style={{ background: "#4a90e2" }}
        />
        <p className="text-sm text-slate-500">
          Seleccioná una sección para comenzar
        </p>
      </div>

      {/* 4 Cards de secciones */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {secciones.map(({ href, titulo, descripcion, icon: Icon, color, bg, border }) => (
          <Link
            key={href}
            href={href}
            className="bg-white rounded-xl border flex items-center gap-4 p-5 transition hover:shadow-md hover:-translate-y-0.5 group"
            style={{ borderColor: "#e2e8f0" }}
          >
            <div
              className="w-16 h-16 rounded-xl flex items-center justify-center shrink-0 border transition group-hover:scale-105"
              style={{ background: bg, borderColor: border }}
            >
              <Icon size={30} style={{ color }} />
            </div>
            <div>
              <p className="text-[15px] font-medium text-slate-800">{titulo}</p>
              <div
                className="w-10 h-0.5 rounded-full my-1.5"
                style={{ background: color }}
              />
              <p className="text-xs text-slate-500 leading-relaxed">{descripcion}</p>
            </div>
          </Link>
        ))}
      </div>

      {/* Bottom widgets */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

        {/* Resumen rápido */}
        <div className="bg-white border border-slate-200 rounded-xl p-5">
          <p className="text-[13px] font-medium text-slate-800 pb-3 mb-3 border-b border-slate-100">
            Resumen rápido
          </p>
          <div className="space-y-2">
            {resumen.map(({ label, valor }) => (
              <div
                key={label}
                className="flex justify-between items-center py-1.5 border-b border-slate-50 last:border-0"
              >
                <span className="text-xs text-slate-500">{label}</span>
                <span className="text-sm font-medium text-slate-800">{valor}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Últimas actualizaciones */}
        <div className="bg-white border border-slate-200 rounded-xl p-5">
          <p className="text-[13px] font-medium text-slate-800 pb-3 mb-3 border-b border-slate-100 flex items-center gap-2">
            <Clock size={13} className="text-slate-400" />
            Últimas actualizaciones
          </p>
          <div className="space-y-3">
            {actividad.map(({ texto, tiempo, tipo }, i) => (
              <div key={i} className="flex items-start gap-2.5">
                <div
                  className="w-2 h-2 rounded-full mt-1 shrink-0"
                  style={{ background: tipo === "warn" ? "#f59e0b" : "#22c55e" }}
                />
                <div>
                  <p className="text-xs text-slate-700">{texto}</p>
                  <p className="text-[11px] text-slate-400 mt-0.5">{tiempo}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Notas y recordatorios */}
        <div className="bg-white border border-slate-200 rounded-xl p-5">
          <p className="text-[13px] font-medium text-slate-800 pb-3 mb-3 border-b border-slate-100 flex items-center gap-2">
            <AlertTriangle size={13} className="text-slate-400" />
            Notas y recordatorios
          </p>
          <div className="space-y-2.5">
            {notas.map(({ texto, done }, i) => (
              <div key={i} className="flex items-center gap-2.5">
                <div
                  className="w-4 h-4 rounded flex items-center justify-center shrink-0"
                  style={{ background: done ? "#4a90e2" : "#e2e8f0" }}
                >
                  {done && (
                    <CheckSquare size={10} color="#fff" />
                  )}
                </div>
                <span
                  className={`text-xs ${done ? "text-slate-800" : "text-slate-400 line-through"}`}
                >
                  {texto}
                </span>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
