"use client";

import { useState, useMemo } from "react";
import { ProgramaCNC } from "@/types";
import { Modal } from "@/components/ui/Modal";
import { Plus, Search, FileCode2, ChevronDown, ChevronUp, Pencil, Trash2 } from "lucide-react";

// ─── Datos de ejemplo — reemplazar con query Supabase ─────────────────────
const PROGRAMAS_MOCK: ProgramaCNC[] = [
  { id:"1", numero_programa:"O8768", nombre_pieza:"Eje Porta Pinza",   operacion:"Op. 1", maquina:"Torno CNC #1", material:"AISI 1045", tiempo_ciclo:"4 min 30 s", responsable:"Kevin R.", created_at:"", updated_at:"2026-04-16" },
  { id:"2", numero_programa:"O8769", nombre_pieza:"Eje Porta Pinza",   operacion:"Op. 2", maquina:"Torno CNC #2", material:"AISI 1045", tiempo_ciclo:"3 min 15 s", responsable:"Kevin R.", created_at:"", updated_at:"2026-04-16" },
  { id:"3", numero_programa:"O7421", nombre_pieza:"Tapa Hidráulica",   operacion:"Op. 1", maquina:"Torno CNC #1", material:"AISI 4140", tiempo_ciclo:"6 min",      responsable:"Kevin R.", created_at:"", updated_at:"2026-04-12" },
  { id:"4", numero_programa:"O7422", nombre_pieza:"Tapa Hidráulica",   operacion:"Op. 2", maquina:"Torno CNC #3", material:"AISI 4140", tiempo_ciclo:"4 min 10 s", responsable:"Kevin R.", created_at:"", updated_at:"2026-04-12" },
  { id:"5", numero_programa:"O6310", nombre_pieza:"Casquillo Guía",    operacion:"Op. 1", maquina:"Torno CNC #2", material:"Bronce",    tiempo_ciclo:"2 min 50 s", responsable:"Kevin R.", created_at:"", updated_at:"2026-04-08" },
  { id:"6", numero_programa:"O5500", nombre_pieza:"Piston Hidráulico", operacion:"Op. 1", maquina:"Torno CNC #1", material:"AISI 1020", tiempo_ciclo:"5 min",      responsable:"Kevin R.", created_at:"", updated_at:"2026-03-30" },
  { id:"7", numero_programa:"O5501", nombre_pieza:"Piston Hidráulico", operacion:"Op. 2", maquina:"Torno CNC #2", material:"AISI 1020", tiempo_ciclo:"3 min 40 s", responsable:"Kevin R.", created_at:"", updated_at:"2026-03-30" },
];

// Agrupa por pieza
function agruparPorPieza(programas: ProgramaCNC[]) {
  const map = new Map<string, ProgramaCNC[]>();
  programas.forEach((p) => {
    const key = p.nombre_pieza;
    if (!map.has(key)) map.set(key, []);
    map.get(key)!.push(p);
  });
  return map;
}

const OP_COLORS = {
  "Op. 1": { text: "#4a90e2", bg: "#eef4ff", label: "badge-op1" },
  "Op. 2": { text: "#7c3aed", bg: "#f5f3ff", label: "badge-op2" },
};

function FormPrograma({
  initial,
  onSave,
  onCancel,
}: {
  initial?: Partial<ProgramaCNC>;
  onSave: (data: Partial<ProgramaCNC>) => void;
  onCancel: () => void;
}) {
  const [form, setForm] = useState<Partial<ProgramaCNC>>(initial ?? {});
  const set = (k: keyof ProgramaCNC, v: string) =>
    setForm((f) => ({ ...f, [k]: v }));

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-xs text-slate-500 mb-1">N° Programa</label>
          <input className="input-base font-mono" placeholder="O8768"
            value={form.numero_programa ?? ""} onChange={(e) => set("numero_programa", e.target.value)} />
        </div>
        <div>
          <label className="block text-xs text-slate-500 mb-1">Operación</label>
          <select className="input-base" value={form.operacion ?? "Op. 1"}
            onChange={(e) => set("operacion", e.target.value)}>
            <option>Op. 1</option>
            <option>Op. 2</option>
          </select>
        </div>
      </div>
      <div>
        <label className="block text-xs text-slate-500 mb-1">Nombre de la pieza</label>
        <input className="input-base" placeholder="Eje Porta Pinza"
          value={form.nombre_pieza ?? ""} onChange={(e) => set("nombre_pieza", e.target.value)} />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-xs text-slate-500 mb-1">Máquina</label>
          <input className="input-base" placeholder="Torno CNC #1"
            value={form.maquina ?? ""} onChange={(e) => set("maquina", e.target.value)} />
        </div>
        <div>
          <label className="block text-xs text-slate-500 mb-1">Material</label>
          <input className="input-base" placeholder="AISI 1045"
            value={form.material ?? ""} onChange={(e) => set("material", e.target.value)} />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-xs text-slate-500 mb-1">Tiempo de ciclo</label>
          <input className="input-base" placeholder="4 min 30 s"
            value={form.tiempo_ciclo ?? ""} onChange={(e) => set("tiempo_ciclo", e.target.value)} />
        </div>
        <div>
          <label className="block text-xs text-slate-500 mb-1">Responsable</label>
          <input className="input-base" placeholder="Kevin R."
            value={form.responsable ?? ""} onChange={(e) => set("responsable", e.target.value)} />
        </div>
      </div>
      <div>
        <label className="block text-xs text-slate-500 mb-1">Notas</label>
        <textarea className="input-base h-20 py-2 resize-none" placeholder="Observaciones..."
          value={form.notas ?? ""} onChange={(e) => set("notas", e.target.value)} />
      </div>
      <div className="flex justify-end gap-2 pt-2">
        <button onClick={onCancel} className="btn-secondary">Cancelar</button>
        <button
          onClick={() => onSave(form)}
          className="btn-primary"
          style={{ background: "#1a2540" }}
        >
          Guardar
        </button>
      </div>
    </div>
  );
}

export default function ProgramasCNCPage() {
  const [programas, setProgramas] = useState<ProgramaCNC[]>(PROGRAMAS_MOCK);
  const [busqueda, setBusqueda] = useState("");
  const [filtroOp, setFiltroOp] = useState("Todas");
  const [expandido, setExpandido] = useState<string | null>(null);
  const [modal, setModal] = useState<{ open: boolean; editing?: ProgramaCNC }>({ open: false });

  const filtrados = useMemo(() => {
    return programas.filter((p) => {
      const matchBusq =
        p.numero_programa.toLowerCase().includes(busqueda.toLowerCase()) ||
        p.nombre_pieza.toLowerCase().includes(busqueda.toLowerCase());
      const matchOp = filtroOp === "Todas" || p.operacion === filtroOp;
      return matchBusq && matchOp;
    });
  }, [programas, busqueda, filtroOp]);

  const grupos = useMemo(() => agruparPorPieza(filtrados), [filtrados]);

  function handleSave(data: Partial<ProgramaCNC>) {
    if (modal.editing) {
      setProgramas((prev) =>
        prev.map((p) => (p.id === modal.editing!.id ? { ...p, ...data } : p))
      );
    } else {
      const nuevo: ProgramaCNC = {
        ...data,
        id: String(Date.now()),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      } as ProgramaCNC;
      setProgramas((prev) => [...prev, nuevo]);
    }
    setModal({ open: false });
  }

  function handleDelete(id: string) {
    if (confirm("¿Eliminar este programa?"))
      setProgramas((prev) => prev.filter((p) => p.id !== id));
  }

  return (
    <div className="max-w-6xl mx-auto space-y-5">

      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-lg font-medium text-slate-800 flex items-center gap-2">
            <FileCode2 size={20} style={{ color: "#4a90e2" }} />
            Programas CNC
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Los programas se agrupan por pieza. Cada pieza puede tener 2 operaciones.
          </p>
        </div>
        <button
          onClick={() => setModal({ open: true })}
          className="btn-primary"
          style={{ background: "#1a2540" }}
        >
          <Plus size={14} />
          Nuevo programa
        </button>
      </div>

      {/* Filtros */}
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            className="input-base pl-9"
            placeholder="Buscar por N° programa o nombre de pieza..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
          />
        </div>
        <select
          className="input-base w-44"
          value={filtroOp}
          onChange={(e) => setFiltroOp(e.target.value)}
        >
          <option value="Todas">Todas las operaciones</option>
          <option value="Op. 1">Op. 1</option>
          <option value="Op. 2">Op. 2</option>
        </select>
      </div>

      {/* Tabla agrupada */}
      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
        {/* Cabecera */}
        <div className="grid grid-cols-[1fr_1.8fr_0.9fr_1fr_1fr_auto] px-4 py-2.5 bg-slate-50 border-b border-slate-200">
          {["N° Programa","Pieza","Operación","Máquina","Última edición","Acciones"].map((h) => (
            <span key={h} className="text-[11px] font-medium text-slate-500 uppercase tracking-wide">{h}</span>
          ))}
        </div>

        {/* Filas */}
        {filtrados.length === 0 ? (
          <div className="py-12 text-center text-sm text-slate-400">
            No se encontraron programas.
          </div>
        ) : (
          filtrados.map((prog, i) => {
            const col = OP_COLORS[prog.operacion];
            const isExpanded = expandido === prog.id;
            return (
              <div key={prog.id}>
                <div
                  className={`grid grid-cols-[1fr_1.8fr_0.9fr_1fr_1fr_auto] px-4 py-3 items-center border-b border-slate-100 hover:bg-slate-50 transition cursor-pointer ${i % 2 === 1 ? "bg-slate-50/50" : ""}`}
                  onClick={() => setExpandido(isExpanded ? null : prog.id)}
                >
                  <span className="text-[13px] font-medium text-slate-800 font-mono">{prog.numero_programa}</span>
                  <span className="text-[13px] text-slate-700">{prog.nombre_pieza}</span>
                  <span className="text-[11px] px-2 py-0.5 rounded font-medium inline-block" style={{ background: col.bg, color: col.text }}>{prog.operacion}</span>
                  <span className="text-xs text-slate-500">{prog.maquina}</span>
                  <span className="text-xs text-slate-500">{prog.updated_at?.slice(0,10)}</span>
                  <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
                    <button onClick={() => setModal({ open: true, editing: prog })} className="btn-secondary p-1.5"><Pencil size={12} /></button>
                    <button onClick={() => handleDelete(prog.id)} className="btn-secondary p-1.5 text-red-500 border-red-200 hover:bg-red-50"><Trash2 size={12} /></button>
                    {isExpanded ? <ChevronUp size={14} className="text-slate-400 ml-1" /> : <ChevronDown size={14} className="text-slate-400 ml-1" />}
                  </div>
                </div>

                {/* Detalle expandible */}
                {isExpanded && (
                  <div className="border-b border-brand-200 bg-blue-50/40 px-4 py-4">
                    <div className="grid grid-cols-2 gap-4 max-w-2xl">
                      {[
                        { label: "Material", val: prog.material },
                        { label: "Tiempo de ciclo", val: prog.tiempo_ciclo },
                        { label: "Responsable", val: prog.responsable },
                        { label: "N° Programa", val: prog.numero_programa },
                      ].map(({ label, val }) => val ? (
                        <div key={label}>
                          <p className="text-[11px] text-slate-400">{label}</p>
                          <p className="text-[13px] text-slate-700 mt-0.5">{val}</p>
                        </div>
                      ) : null)}
                      {prog.notas && (
                        <div className="col-span-2">
                          <p className="text-[11px] text-slate-400">Notas</p>
                          <p className="text-[13px] text-slate-700 mt-0.5">{prog.notas}</p>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* Resumen grupos */}
      <p className="text-xs text-slate-400 text-right">
        {grupos.size} pieza{grupos.size !== 1 ? "s" : ""} · {filtrados.length} programa{filtrados.length !== 1 ? "s" : ""}
      </p>

      {/* Modal */}
      <Modal
        open={modal.open}
        onClose={() => setModal({ open: false })}
        title={modal.editing ? "Editar programa" : "Nuevo programa CNC"}
      >
        <FormPrograma
          initial={modal.editing}
          onSave={handleSave}
          onCancel={() => setModal({ open: false })}
        />
      </Modal>
    </div>
  );
}
