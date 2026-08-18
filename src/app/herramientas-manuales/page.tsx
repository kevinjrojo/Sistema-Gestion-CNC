"use client";

import { useState, useMemo } from "react";
import { HerramientaManual, getEstadoStock } from "@/types";
import { BadgeStock } from "@/components/ui/BadgeStock";
import { Modal } from "@/components/ui/Modal";
import { Plus, Search, Hammer, Pencil, Trash2 } from "lucide-react";

const CATEGORIAS = ["Llaves", "Destornilladores", "Alicates", "Martillos", "Medición", "Torquímetros", "Otros"];

const MOCK: HerramientaManual[] = [
  { id:"1", codigo:"MAN-001", descripcion:"Llave Allen 3mm",              categoria:"Llaves",         stock:8,  stock_minimo:3, ubicacion:"Cajón A1", created_at:"", updated_at:"" },
  { id:"2", codigo:"MAN-002", descripcion:"Destornillador Phillips #2",   categoria:"Destornilladores",stock:5,  stock_minimo:3, ubicacion:"Cajón A2", created_at:"", updated_at:"" },
  { id:"3", codigo:"MAN-003", descripcion:"Alicate de punta larga",       categoria:"Alicates",       stock:2,  stock_minimo:2, ubicacion:"Cajón B1", created_at:"", updated_at:"" },
  { id:"4", codigo:"MAN-004", descripcion:"Llave combinada 17mm",         categoria:"Llaves",         stock:4,  stock_minimo:2, ubicacion:"Panel",    created_at:"", updated_at:"" },
  { id:"5", codigo:"MAN-005", descripcion:"Martillo de goma 250g",        categoria:"Martillos",      stock:0,  stock_minimo:1, ubicacion:"Estante",  created_at:"", updated_at:"" },
  { id:"6", codigo:"MAN-006", descripcion:"Torquímetro 10-100 Nm",        categoria:"Torquímetros",   stock:1,  stock_minimo:1, ubicacion:"Armario",  created_at:"", updated_at:"" },
  { id:"7", codigo:"MAN-007", descripcion:"Llave Allen juego 1.5-10mm",   categoria:"Llaves",         stock:3,  stock_minimo:2, ubicacion:"Cajón A1", created_at:"", updated_at:"" },
  { id:"8", codigo:"MAN-008", descripcion:"Destornillador plano 5mm",     categoria:"Destornilladores",stock:1,  stock_minimo:3, ubicacion:"Cajón A2", created_at:"", updated_at:"" },
];

const CAT_COLORS: Record<string, { color: string; bg: string }> = {
  "Llaves":          { color: "#4a90e2", bg: "#eef4ff" },
  "Destornilladores":{ color: "#7c3aed", bg: "#f5f3ff" },
  "Alicates":        { color: "#0891b2", bg: "#ecfeff" },
  "Martillos":       { color: "#d97706", bg: "#fffbeb" },
  "Medición":        { color: "#059669", bg: "#ecfdf5" },
  "Torquímetros":    { color: "#dc2626", bg: "#fef2f2" },
  "Otros":           { color: "#64748b", bg: "#f1f5f9" },
};

function FormManual({
  initial,
  onSave,
  onCancel,
}: {
  initial?: Partial<HerramientaManual>;
  onSave: (d: Partial<HerramientaManual>) => void;
  onCancel: () => void;
}) {
  const [form, setForm] = useState<Partial<HerramientaManual>>(initial ?? { categoria: "Llaves" });
  const set = (k: keyof HerramientaManual, v: string | number) =>
    setForm((f) => ({ ...f, [k]: v }));

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-xs text-slate-500 mb-1">Código</label>
          <input className="input-base font-mono" placeholder="MAN-001"
            value={form.codigo ?? ""} onChange={(e) => set("codigo", e.target.value)} />
        </div>
        <div>
          <label className="block text-xs text-slate-500 mb-1">Categoría</label>
          <select className="input-base" value={form.categoria ?? "Llaves"}
            onChange={(e) => set("categoria", e.target.value)}>
            {CATEGORIAS.map((c) => <option key={c}>{c}</option>)}
          </select>
        </div>
      </div>
      <div>
        <label className="block text-xs text-slate-500 mb-1">Descripción</label>
        <input className="input-base" placeholder="Llave Allen 3mm"
          value={form.descripcion ?? ""} onChange={(e) => set("descripcion", e.target.value)} />
      </div>
      <div className="grid grid-cols-3 gap-3">
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
        <div>
          <label className="block text-xs text-slate-500 mb-1">Ubicación</label>
          <input className="input-base" placeholder="Cajón A1"
            value={form.ubicacion ?? ""} onChange={(e) => set("ubicacion", e.target.value)} />
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

export default function HerramientasManualesPage() {
  const [items, setItems] = useState<HerramientaManual[]>(MOCK);
  const [busqueda, setBusqueda] = useState("");
  const [filtroCat, setFiltroCat] = useState("Todas");
  const [filtroStock, setFiltroStock] = useState("Todos");
  const [modal, setModal] = useState<{ open: boolean; editing?: HerramientaManual }>({ open: false });

  const filtrados = useMemo(() => items.filter((h) => {
    const matchB = h.codigo.toLowerCase().includes(busqueda.toLowerCase()) ||
                   h.descripcion.toLowerCase().includes(busqueda.toLowerCase());
    const matchC = filtroCat === "Todas" || h.categoria === filtroCat;
    const estado = getEstadoStock(h.stock, h.stock_minimo);
    const matchS = filtroStock === "Todos" ||
      (filtroStock === "bajo" && estado === "bajo") ||
      (filtroStock === "sin_stock" && estado === "sin_stock");
    return matchB && matchC && matchS;
  }), [items, busqueda, filtroCat, filtroStock]);

  function handleSave(data: Partial<HerramientaManual>) {
    if (modal.editing) {
      setItems((prev) => prev.map((h) => h.id === modal.editing!.id ? { ...h, ...data } : h));
    } else {
      setItems((prev) => [...prev, { ...data, id: String(Date.now()), created_at: "", updated_at: "" } as HerramientaManual]);
    }
    setModal({ open: false });
  }

  function handleDelete(id: string) {
    if (confirm("¿Eliminar esta herramienta?"))
      setItems((prev) => prev.filter((h) => h.id !== id));
  }

  return (
    <div className="max-w-6xl mx-auto space-y-5">

      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-lg font-medium text-slate-800 flex items-center gap-2">
            <Hammer size={20} style={{ color: "#059669" }} />
            Herramientas Manuales
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Inventario de herramientas para armado y mantenimiento de máquinas.
          </p>
        </div>
        <button onClick={() => setModal({ open: true })} className="btn-primary" style={{ background: "#1a2540" }}>
          <Plus size={14} /> Agregar herramienta
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-3">
        {[
          { label: "Total herramientas",  val: items.length,                                                       color: "#1a2540" },
          { label: "Categorías",          val: new Set(items.map((i) => i.categoria)).size,                        color: "#1a2540" },
          { label: "Stock crítico",       val: items.filter((i) => getEstadoStock(i.stock, i.stock_minimo) === "bajo").length, color: "#f59e0b" },
          { label: "Sin stock",           val: items.filter((i) => i.stock === 0).length,                          color: "#ef4444" },
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
        <select className="input-base w-52" value={filtroCat} onChange={(e) => setFiltroCat(e.target.value)}>
          <option value="Todas">Todas las categorías</option>
          {CATEGORIAS.map((c) => <option key={c}>{c}</option>)}
        </select>
        <select className="input-base w-44" value={filtroStock} onChange={(e) => setFiltroStock(e.target.value)}>
          <option value="Todos">Todo el stock</option>
          <option value="bajo">Stock crítico</option>
          <option value="sin_stock">Sin stock</option>
        </select>
      </div>

      {/* Tabla */}
      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
        <div className="grid grid-cols-[1fr_2.2fr_1fr_0.7fr_0.7fr_1fr_0.8fr_0.7fr] px-4 py-2.5 bg-slate-50 border-b border-slate-200">
          {["Código","Descripción","Categoría","Stock","Mín.","Ubicación","Estado","Acciones"].map((h) => (
            <span key={h} className="text-[11px] font-medium text-slate-500 uppercase tracking-wide">{h}</span>
          ))}
        </div>
        {filtrados.length === 0 ? (
          <div className="py-12 text-center text-sm text-slate-400">No se encontraron herramientas.</div>
        ) : (
          filtrados.map((h, i) => {
            const cat = CAT_COLORS[h.categoria ?? "Otros"] ?? CAT_COLORS["Otros"];
            const stockColor = h.stock === 0 ? "#ef4444" : h.stock < h.stock_minimo ? "#f59e0b" : "#1a2540";
            return (
              <div key={h.id} className={`grid grid-cols-[1fr_2.2fr_1fr_0.7fr_0.7fr_1fr_0.8fr_0.7fr] px-4 py-3 items-center border-b border-slate-100 hover:bg-slate-50 transition ${i % 2 === 1 ? "bg-slate-50/50" : ""}`}>
                <span className="text-[12px] font-medium font-mono text-slate-800">{h.codigo}</span>
                <span className="text-[12px] text-slate-700 pr-2">{h.descripcion}</span>
                <span className="text-[11px] px-2 py-0.5 rounded font-medium inline-block" style={{ background: cat.bg, color: cat.color }}>{h.categoria}</span>
                <span className="text-[13px] font-medium" style={{ color: stockColor }}>{h.stock}</span>
                <span className="text-xs text-slate-400">{h.stock_minimo}</span>
                <span className="text-xs text-slate-500">{h.ubicacion ?? "—"}</span>
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

      <p className="text-xs text-slate-400 text-right">Mostrando {filtrados.length} de {items.length} herramientas</p>

      <Modal open={modal.open} onClose={() => setModal({ open: false })}
        title={modal.editing ? "Editar herramienta" : "Nueva herramienta manual"}>
        <FormManual initial={modal.editing} onSave={handleSave} onCancel={() => setModal({ open: false })} />
      </Modal>
    </div>
  );
}
