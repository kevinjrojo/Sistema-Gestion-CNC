// ─── Auth ────────────────────────────────────────────────────────────────────
export interface UserProfile {
  id: string;
  email: string;
  full_name?: string;
  avatar_url?: string;
}

// ─── Programas CNC ───────────────────────────────────────────────────────────
export type Operacion = "Op. 1" | "Op. 2";

export interface ProgramaCNC {
  id: string;
  numero_programa: string;   // "O8768"
  nombre_pieza: string;      // "Eje Porta Pinza"
  operacion: Operacion;
  maquina: string;           // "Torno CNC #1"
  material?: string;
  tiempo_ciclo?: string;     // "4 min 30 s"
  responsable?: string;
  notas?: string;
  archivo_url?: string;
  created_at: string;
  updated_at: string;
}

// ─── Herramientas CNC ─────────────────────────────────────────────────────────
export type TipoHerramienta = "HMECH" | "HINSE" | "HPORT" | "HBRO" | "HOTRO";

export interface HerramientaCNC {
  id: string;
  codigo: string;            // "HMECH-007"
  descripcion: string;
  tipo: TipoHerramienta;
  stock: number;
  stock_minimo: number;
  unidad?: string;
  proveedor?: string;
  notas?: string;
  created_at: string;
  updated_at: string;
}

// ─── Herramientas de Medición ────────────────────────────────────────────────
export interface HerramientaMedicion {
  id: string;
  codigo: string;
  descripcion: string;
  marca?: string;
  rango?: string;            // "0-150 mm"
  resolucion?: string;       // "0.01 mm"
  stock: number;
  stock_minimo: number;
  calibrado: boolean;
  fecha_calibracion?: string;
  notas?: string;
  created_at: string;
  updated_at: string;
}

// ─── Herramientas Manuales ───────────────────────────────────────────────────
export interface HerramientaManual {
  id: string;
  codigo: string;
  descripcion: string;
  categoria?: string;        // "Llaves", "Destornilladores", etc.
  stock: number;
  stock_minimo: number;
  ubicacion?: string;
  notas?: string;
  created_at: string;
  updated_at: string;
}

// ─── Stock helpers ────────────────────────────────────────────────────────────
export type EstadoStock = "ok" | "bajo" | "sin_stock";

export function getEstadoStock(stock: number, minimo: number): EstadoStock {
  if (stock === 0) return "sin_stock";
  if (stock < minimo) return "bajo";
  return "ok";
}
