"use client";

import { useState, useMemo } from "react";
import { HerramientaCNC, TipoHerramienta, getEstadoStock } from "@/types";
import { BadgeStock } from "@/components/ui/BadgeStock";
import { Modal } from "@/components/ui/Modal";
import { Plus, Search, Wrench, Pencil, Trash2 } from "lucide-react";

const TIPOS: { value: TipoHerramienta; label: string; color: string; bg: string }[] = [
  { value: "HMECH", label: "HMECH — Mecánica",      color: "#4a90e2", bg: "#eef4ff" },
  { value: "HINSE", label: "HINSE — Insertos",       color: "#7c3aed", bg: "#f5f3ff" },
  { value: "HPORT", label: "HPORT — Portaherr.",     color: "#059669", bg: "#ecfdf5" },
  { value: "HBRO",  label: "HBRO  — Brocas",        color: "#d97706", bg: "#fffbeb" },
  { value: "HOTRO", label: "HOTRO — Otros",          color: "#64748b", bg: "#f1f5f9" },
];

const MOCK: HerramientaCNC[] = [
  { id:"1", codigo:"HMECH-007", descripcion:"Fresa de desbaste Ø12mm 4F",    tipo:"HMECH", stock:8,  stock_minimo:3,  created_at:"", updated_at:"2026-04-16" },
  { id:"2", codigo:"HINSE-234", descripcion:"Inserto CCMT 09T308 PP",         tipo:"HINSE", stock:2,  stock_minimo:10, created_at:"", updated_at:"2026-04-16" },
  { id:"3", codigo:"HMECH-015", descripcion:"Fresa esférica Ø10mm 2F",        tipo:"HMECH", stock:5,  stock_minimo:2,  created_at:"", updated_at:"2026-04-14" },
  { id:"4", codigo:"HINSE-098", descripcion:"Inserto WNMG 080408 MF",         tipo:"HINSE", stock:0,  stock_minimo:8,  created_at:"", updated_at:"2026-04-13" },
  { id:"5", codigo:"HPORT-003", descripcion:"Portaherramienta VDI 40",        tipo:"HPORT", stock:12, stock_minimo:4,  created_at:"", updated_at:"2026-04-10" },
  { id:"6", codigo:"HMECH-031", descripcion:"Broca indexable Ø16mm",          tipo:"HMECH", stock:1,  stock_minimo:2,  created_at:"", updated_at:"2026-04-09" },
  { id:"7", codigo:"HINSE-311", descripcion:"Inserto DCMT 11T304 VP",         tipo:"HINSE", stock:0,  stock_minimo:5,  created_at:"", updated_at:"2026-04-08" },
  { id:"8", codigo:"HBRO-012",  descripcion:"Broca HSS-Co Ø8mm",              tipo:"HBRO",  stock:6,  stock_minimo:4,  created_at:"", updated_at:"2026-04-05" },
];

function tipoMeta(tipo: TipoHerramienta) {
  return TIPOS.find((t) => t.value === tipo) ?? TIPOS[4];
}

function FormHerramienta({
  initial,
  onSave,
  onCancel,
}: {
  initial?: Partial<HerramientaCNC>;
  onSave: (data: Partial<HerramientaCNC>) => void;
  onCancel: () => void;
}) {
  const [form, setForm] = useState<Partial<HerramientaCNC>>(initial ?? { tipo: "HMECH" });
  const set = (k: keyof HerramientaCNC, v: string | number) =>
    setForm((f) => ({ ...f, [k]: v }));

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-xs text-slate-500 mb-1">Código</label>
          <input className="input-base font-mono" placeholder="HMECH-007"
            value={form.codigo ?? ""} onChange={(e) => set("codigo", e.target.value)} />
        </div>
        <div>
          <label className="block text-xs text-slate-500 mb-1">Tipo</label>
          <select className="input-base" value={form.tipo ?? "HMECH"}
            onChange={(e) => set("tipo", e.target.value)}>
            {TIPOS.map((t) => <option key={t.value} value={t.value}>{t.label}</option>)}
          </select>
        </div>
      </div>
      <div>
        <label className="block text-xs text-slate-500 mb-1">Descripción</label>
        <input className="input-base" placeholder="Fresa de desbaste Ø12mm 4F"
          value={form.descripcion ?? ""} onChange={(e) => set("descripcion", e.target.value)} />
      </div>
      <div className="grid grid-cols-3 gap-3">
        <div>
          <label className="block text-xs text-slate-500 mb-1">Stock actual</label>
          <input className="input-base" type="number" min={0} placeholder="0"
            value={form.stock ?? ""} onChange={(e) => set("stock", Number(e.target.value))} />
        </div>
        <div>
          <label className="block text-xs text-slate-500 mb-1">Stock mínimo</label>
          <input className="input-base" type="number" min={0} placeholder="0"
            value={form.stock_minimo ?? ""} onChange={(e) => set("stock_minimo", Number(e.target.value))} />
        </div>
        <div>
          <label className="block text-xs text-slate-500 mb-1">Unidad</label>
          <input className="input-base" placeholder="unid."
            value={form.unidad ?? ""} onChange={(e) => set("unidad", e.target.value)} />
        </div>
      </div>
      <div>
        <label className="block text-xs text-slate-500 mb-1">Proveedor</label>
        <input className="input-base" placeholder="Ej: Sandvik, Kennametal..."
          value={form.proveedor ?? ""} onChange={(e) => set("proveedor", e.target.value)} />
      </div>
      <div>
        <label className="block text-xs text-slate-500 mb-1">Notas</label>
        <textarea className="input-base h-20 py-2 resize-none" placeholder="Observaciones..."
          value={form.notas ?? ""} onChange={(e) => set("notas", e.target.value)} />
      </div>
      <div className="flex justify-end gap-2 pt-2">
        <button onClick={onCancel} className="btn-secondary">Cancelar</button>
        <button onClick={() => onSave(form)} className="btn-primary" style={{ background: "#1a2540" }}>
          Guardar
        </button>
      </div>
    </div>
  );
}

export default function HerramientasCNCPage() {
  const [items, setItems] = useState<HerramientaCNC[]>(MOCK);
  const [busqueda, setBusqueda] = useState("");
  const [filtroTipo, setFiltroTipo] = useState("Todos");
  const [filtroStock, setFiltroStock] = useState("Todos");
  const [modal, setModal] = useState<{ open: boolean; editing?: HerramientaCNC }>({ open: false });

  const filtrados = useMemo(() => {
    return items.filter((h) => {
      const matchB = h.codigo.toLowerCase().includes(busqueda.toLowerCase()) ||
                     h.descripcion.toLowerCase().includes(busqueda.toLowerCase());
      const matchT = filtroTipo === "Todos" || h.tipo === filtroTipo;
      const estado = getEstadoStock(h.stock, h.stock_minimo);
      const matchS = filtroStock === "Todos" ||
        (filtroStock === "bajo" && estado === "bajo") ||
        (filtroStock === "sin_stock" && estado === "sin_stock");
      return matchB && matchT && matchS;
    });
  }, [items, busqueda, filtroTipo, filtroStock]);

  const stats = useMemo(() => ({
    total: items.length,
    tipos: new Set(items.map((i) => i.tipo)).size,
    bajo: items.filter((i) => getEstadoStock(i.stock, i.stock_minimo) === "bajo").length,
    sinStock: items.filter((i) => i.stock === 0).length,
  }), [items]);

  function handleSave(data: Partial<HerramientaCNC>) {
    if (modal.editing) {
      setItems((prev) => prev.map((h) => h.id === modal.editing!.id ? { ...h, ...data } : h));
    } else {
      setItems((prev) => [...prev, { ...data, id: String(Date.now()), created_at: "", updated_at: new Date().toISOString() } as HerramientaCNC]);
    }
    setModal({ open: false });
  }

  function handleDelete(id: string) {
    if (confirm("¿Eliminar esta herramienta?"))
      setItems((prev) => prev.filter((h) => h.id !== id));
  }

  return (
    <div className="max-w-6xl mx-auto space-y-5">

      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-lg font-medium text-slate-800 flex items-center gap-2">
            <Wrench size={20} style={{ color: "#7c3aed" }} />
            Herramientas CNC
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Inventario de herramientas para tornos CNC · HMECH / HINSE / HPORT
          </p>
        </div>
        <button onClick={() => setModal({ open: true })} className="btn-primary" style={{ background: "#1a2540" }}>
          <Plus size={14} /> Agregar herramienta
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-3">
        {[
          { label: "Total herramientas", val: stats.total, color: "#1a2540" },
          { label: "Tipos distintos",    val: stats.tipos, color: "#1a2540" },
          { label: "Stock crítico",      val: stats.bajo,  color: "#f59e0b" },
          { label: "Sin stock",          val: stats.sinStock, color: "#ef4444" },
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
        <select className="input-base w-52" value={filtroTipo} onChange={(e) => setFiltroTipo(e.target.value)}>
          <option value="Todos">Todos los tipos</option>
          {TIPOS.map((t) => <option key={t.value} value={t.value}>{t.label}</option>)}
        </select>
        <select className="input-base w-44" value={filtroStock} onChange={(e) => setFiltroStock(e.target.value)}>
          <option value="Todos">Todo el stock</option>
          <option value="bajo">Stock crítico</option>
          <option value="sin_stock">Sin stock</option>
        </select>
      </div>

      {/* Tabla */}
      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
        <div className="grid grid-cols-[1.3fr_2.2fr_0.9fr_0.7fr_0.7fr_1fr_0.7fr] px-4 py-2.5 bg-slate-50 border-b border-slate-200">
          {["Código","Descripción","Tipo","Stock","Mín.","Estado","Acciones"].map((h) => (
            <span key={h} className="text-[11px] font-medium text-slate-500 uppercase tracking-wide">{h}</span>
          ))}
        </div>

        {filtrados.length === 0 ? (
          <div className="py-12 text-center text-sm text-slate-400">No se encontraron herramientas.</div>
        ) : (
          filtrados.map((h, i) => {
            const meta = tipoMeta(h.tipo);
            const stockColor = h.stock === 0 ? "#ef4444" : h.stock < h.stock_minimo ? "#f59e0b" : "#1a2540";
            return (
              <div key={h.id} className={`grid grid-cols-[1.3fr_2.2fr_0.9fr_0.7fr_0.7fr_1fr_0.7fr] px-4 py-3 items-center border-b border-slate-100 hover:bg-slate-50 transition ${i % 2 === 1 ? "bg-slate-50/50" : ""}`}>
                <span className="text-[12px] font-medium text-slate-800 font-mono">{h.codigo}</span>
                <span className="text-[12px] text-slate-700 pr-2">{h.descripcion}</span>
                <span className="text-[11px] px-2 py-0.5 rounded font-medium inline-block" style={{ background: meta.bg, color: meta.color }}>{h.tipo}</span>
                <span className="text-[13px] font-medium" style={{ color: stockColor }}>{h.stock}</span>
                <span className="text-xs text-slate-400">{h.stock_minimo}</span>
                <BadgeStock stock={h.stock} minimo={h.stock_minimo} />
                <div className="flex gap-1">
                  <button onClick={() => setModal({ open: true, editing: h })} className="btn-secondary p-1.5"><Pencil size={12} /></button>
                  <button onClick={() => handleDelete(h.id)} className="btn-secondary p-1.5 text-red-500 border-red-200 hover:bg-red-50"><Trash2 size={12} /></button>
                </div>
              </div>
            );
          })
        )}
      </div>

      <p className="text-xs text-slate-400 text-right">
        Mostrando {filtrados.length} de {items.length} herramientas
      </p>

      <Modal open={modal.open} onClose={() => setModal({ open: false })}
        title={modal.editing ? "Editar herramienta" : "Nueva herramienta CNC"}>
        <FormHerramienta initial={modal.editing} onSave={handleSave} onCancel={() => setModal({ open: false })} />
      </Modal>
    </div>
  );
}
