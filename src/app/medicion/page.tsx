"use client";

import { useState, useMemo } from "react";
import { HerramientaMedicion, getEstadoStock } from "@/types";
import { BadgeStock } from "@/components/ui/BadgeStock";
import { Modal } from "@/components/ui/Modal";
import { Plus, Search, Ruler, Pencil, Trash2, CheckCircle2, XCircle } from "lucide-react";

const MOCK: HerramientaMedicion[] = [
  { id:"1", codigo:"MED-001", descripcion:"Micrómetro exterior 0-25mm",     marca:"Mitutoyo", rango:"0-25 mm",   resolucion:"0.001 mm", stock:3, stock_minimo:1, calibrado:true,  fecha_calibracion:"2026-01-15", created_at:"", updated_at:"2026-04-16" },
  { id:"2", codigo:"MED-002", descripcion:"Calibre Vernier 150mm",          marca:"Mitutoyo", rango:"0-150 mm",  resolucion:"0.02 mm",  stock:5, stock_minimo:2, calibrado:true,  fecha_calibracion:"2026-02-10", created_at:"", updated_at:"2026-04-10" },
  { id:"3", codigo:"MED-003", descripcion:"Comparador de carátula 0-10mm",  marca:"Starrett", rango:"0-10 mm",   resolucion:"0.01 mm",  stock:2, stock_minimo:1, calibrado:false, created_at:"", updated_at:"2026-03-20" },
  { id:"4", codigo:"MED-004", descripcion:"Micrómetro interior 5-30mm",     marca:"Mitutoyo", rango:"5-30 mm",   resolucion:"0.01 mm",  stock:1, stock_minimo:1, calibrado:true,  fecha_calibracion:"2026-03-01", created_at:"", updated_at:"2026-04-05" },
  { id:"5", codigo:"MED-005", descripcion:"Rugosímetro portátil",           marca:"Surftest",  rango:"Ra 0.05-10",resolucion:"0.01 µm",  stock:0, stock_minimo:1, calibrado:false, created_at:"", updated_at:"2026-04-01" },
  { id:"6", codigo:"MED-006", descripcion:"Calibre de profundidad 200mm",   marca:"Starrett", rango:"0-200 mm",  resolucion:"0.02 mm",  stock:4, stock_minimo:2, calibrado:true,  fecha_calibracion:"2026-02-20", created_at:"", updated_at:"2026-04-12" },
];

function FormMedicion({
  initial,
  onSave,
  onCancel,
}: {
  initial?: Partial<HerramientaMedicion>;
  onSave: (d: Partial<HerramientaMedicion>) => void;
  onCancel: () => void;
}) {
  const [form, setForm] = useState<Partial<HerramientaMedicion>>(initial ?? { calibrado: false });
  const set = (k: keyof HerramientaMedicion, v: string | number | boolean) =>
    setForm((f) => ({ ...f, [k]: v }));

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-xs text-slate-500 mb-1">Código</label>
          <input className="input-base font-mono" placeholder="MED-001"
            value={form.codigo ?? ""} onChange={(e) => set("codigo", e.target.value)} />
        </div>
        <div>
          <label className="block text-xs text-slate-500 mb-1">Marca</label>
          <input className="input-base" placeholder="Mitutoyo"
            value={form.marca ?? ""} onChange={(e) => set("marca", e.target.value)} />
        </div>
      </div>
      <div>
        <label className="block text-xs text-slate-500 mb-1">Descripción</label>
        <input className="input-base" placeholder="Micrómetro exterior 0-25mm"
          value={form.descripcion ?? ""} onChange={(e) => set("descripcion", e.target.value)} />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-xs text-slate-500 mb-1">Rango</label>
          <input className="input-base" placeholder="0-25 mm"
            value={form.rango ?? ""} onChange={(e) => set("rango", e.target.value)} />
        </div>
        <div>
          <label className="block text-xs text-slate-500 mb-1">Resolución</label>
          <input className="input-base" placeholder="0.001 mm"
            value={form.resolucion ?? ""} onChange={(e) => set("resolucion", e.target.value)} />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-xs text-slate-500 mb-1">Stock actual</label>
          <input className="input-base" type="number" min={0}
            value={form.stock ?? ""} onChange={(e) => set("stock", Number(e.target.value))} />
        </div>
        <div>
          <label className="block text-xs text-slate-500 mb-1">Stock mínimo</label>
          <input className="input-base" type="number" min={0}
            value={form.stock_minimo ?? ""} onChange={(e) => set("stock_minimo", Number(e.target.value))} />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div className="flex items-center gap-2 mt-2">
          <input type="checkbox" id="calibrado" checked={form.calibrado ?? false}
            onChange={(e) => set("calibrado", e.target.checked)}
            className="w-4 h-4 accent-blue-600" />
          <label htmlFor="calibrado" className="text-sm text-slate-700">Calibrado</label>
        </div>
        <div>
          <label className="block text-xs text-slate-500 mb-1">Fecha calibración</label>
          <input className="input-base" type="date"
            value={form.fecha_calibracion ?? ""} onChange={(e) => set("fecha_calibracion", e.target.value)} />
        </div>
      </div>
      <div>
        <label className="block text-xs text-slate-500 mb-1">Notas</label>
        <textarea className="input-base h-16 py-2 resize-none"
          value={form.notas ?? ""} onChange={(e) => set("notas", e.target.value)} />
      </div>
      <div className="flex justify-end gap-2 pt-2">
        <button onClick={onCancel} className="btn-secondary">Cancelar</button>
        <button onClick={() => onSave(form)} className="btn-primary" style={{ background: "#1a2540" }}>Guardar</button>
      </div>
    </div>
  );
}

export default function MedicionPage() {
  const [items, setItems] = useState<HerramientaMedicion[]>(MOCK);
  const [busqueda, setBusqueda] = useState("");
  const [filtroCal, setFiltroCal] = useState("Todos");
  const [filtroStock, setFiltroStock] = useState("Todos");
  const [modal, setModal] = useState<{ open: boolean; editing?: HerramientaMedicion }>({ open: false });

  const filtrados = useMemo(() => items.filter((h) => {
    const matchB = h.codigo.toLowerCase().includes(busqueda.toLowerCase()) ||
                   h.descripcion.toLowerCase().includes(busqueda.toLowerCase());
    const matchC = filtroCal === "Todos" ||
      (filtroCal === "calibrado" && h.calibrado) ||
      (filtroCal === "sin_calibrar" && !h.calibrado);
    const estado = getEstadoStock(h.stock, h.stock_minimo);
    const matchS = filtroStock === "Todos" ||
      (filtroStock === "bajo" && estado === "bajo") ||
      (filtroStock === "sin_stock" && estado === "sin_stock");
    return matchB && matchC && matchS;
  }), [items, busqueda, filtroCal, filtroStock]);

  function handleSave(data: Partial<HerramientaMedicion>) {
    if (modal.editing) {
      setItems((prev) => prev.map((h) => h.id === modal.editing!.id ? { ...h, ...data } : h));
    } else {
      setItems((prev) => [...prev, { ...data, id: String(Date.now()), created_at: "", updated_at: "" } as HerramientaMedicion]);
    }
    setModal({ open: false });
  }

  function handleDelete(id: string) {
    if (confirm("¿Eliminar este instrumento?"))
      setItems((prev) => prev.filter((h) => h.id !== id));
  }

  return (
    <div className="max-w-6xl mx-auto space-y-5">

      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-lg font-medium text-slate-800 flex items-center gap-2">
            <Ruler size={20} style={{ color: "#0891b2" }} />
            Herramientas de Medición
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">Control de instrumentos: micrómetros, calibres, comparadores.</p>
        </div>
        <button onClick={() => setModal({ open: true })} className="btn-primary" style={{ background: "#1a2540" }}>
          <Plus size={14} /> Agregar instrumento
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-3">
        {[
          { label: "Total instrumentos", val: items.length,                                                    color: "#1a2540" },
          { label: "Calibrados",         val: items.filter((i) => i.calibrado).length,                         color: "#059669" },
          { label: "Sin calibrar",       val: items.filter((i) => !i.calibrado).length,                        color: "#f59e0b" },
          { label: "Sin stock",          val: items.filter((i) => i.stock === 0).length,                       color: "#ef4444" },
        ].map(({ label, val, color }) => (
          <div key={label} className="bg-white border border-slate-200 rounded-xl p-4">
            <p className="text-[11px] text-slate-500 mb-1">{label}</p>
            <p className="text-2xl font-medium" style={{ color }}>{val}</p>
          </div>
        ))}
      </div>

      {/* Filtros */}
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input className="input-base pl-9" placeholder="Buscar por código o descripción..."
            value={busqueda} onChange={(e) => setBusqueda(e.target.value)} />
        </div>
        <select className="input-base w-48" value={filtroCal} onChange={(e) => setFiltroCal(e.target.value)}>
          <option value="Todos">Todos</option>
          <option value="calibrado">Calibrados</option>
          <option value="sin_calibrar">Sin calibrar</option>
        </select>
        <select className="input-base w-44" value={filtroStock} onChange={(e) => setFiltroStock(e.target.value)}>
          <option value="Todos">Todo el stock</option>
          <option value="bajo">Stock crítico</option>
          <option value="sin_stock">Sin stock</option>
        </select>
      </div>

      {/* Tabla */}
      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
        <div className="grid grid-cols-[1fr_2fr_0.8fr_0.8fr_0.7fr_0.7fr_1fr_1fr_0.7fr] px-4 py-2.5 bg-slate-50 border-b border-slate-200">
          {["Código","Descripción","Marca","Rango","Stock","Mín.","Estado","Calibrado","Acciones"].map((h) => (
            <span key={h} className="text-[11px] font-medium text-slate-500 uppercase tracking-wide">{h}</span>
          ))}
        </div>
        {filtrados.length === 0 ? (
          <div className="py-12 text-center text-sm text-slate-400">No se encontraron instrumentos.</div>
        ) : (
          filtrados.map((h, i) => {
            const stockColor = h.stock === 0 ? "#ef4444" : h.stock < h.stock_minimo ? "#f59e0b" : "#1a2540";
            return (
              <div key={h.id} className={`grid grid-cols-[1fr_2fr_0.8fr_0.8fr_0.7fr_0.7fr_1fr_1fr_0.7fr] px-4 py-3 items-center border-b border-slate-100 hover:bg-slate-50 transition ${i % 2 === 1 ? "bg-slate-50/50" : ""}`}>
                <span className="text-[12px] font-medium font-mono text-slate-800">{h.codigo}</span>
                <span className="text-[12px] text-slate-700 pr-2">{h.descripcion}</span>
                <span className="text-xs text-slate-500">{h.marca}</span>
                <span className="text-xs text-slate-500">{h.rango}</span>
                <span className="text-[13px] font-medium" style={{ color: stockColor }}>{h.stock}</span>
                <span className="text-xs text-slate-400">{h.stock_minimo}</span>
                <BadgeStock stock={h.stock} minimo={h.stock_minimo} />
                <div className="flex items-center gap-1">
                  {h.calibrado
                    ? <CheckCircle2 size={14} className="text-green-500" />
                    : <XCircle size={14} className="text-amber-400" />}
                  <span className="text-[11px] text-slate-500">{h.calibrado ? "Sí" : "No"}</span>
                </div>
                <div className="flex gap-1">
                  <button onClick={() => setModal({ open: true, editing: h })} className="btn-secondary p-1.5"><Pencil size={12} /></button>
                  <button onClick={() => handleDelete(h.id)} className="btn-secondary p-1.5 text-red-500 border-red-200 hover:bg-red-50"><Trash2 size={12} /></button>
                </div>
              </div>
            );
          })
        )}
      </div>

      <p className="text-xs text-slate-400 text-right">Mostrando {filtrados.length} de {items.length} instrumentos</p>

      <Modal open={modal.open} onClose={() => setModal({ open: false })}
        title={modal.editing ? "Editar instrumento" : "Nuevo instrumento de medición"} maxWidth="max-w-xl">
        <FormMedicion initial={modal.editing} onSave={handleSave} onCancel={() => setModal({ open: false })} />
      </Modal>
    </div>
  );
}
