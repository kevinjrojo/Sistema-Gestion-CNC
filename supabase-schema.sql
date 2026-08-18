-- ============================================================
-- PROYECTO MICRO — Supabase Schema
-- Ejecutá esto en el SQL Editor de tu proyecto Supabase
-- ============================================================

-- Habilitar RLS en todas las tablas (solo usuarios autenticados)

-- ─── Programas CNC ────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS programas_cnc (
  id              uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  numero_programa text NOT NULL,          -- "O8768"
  nombre_pieza    text NOT NULL,
  operacion       text NOT NULL CHECK (operacion IN ('Op. 1','Op. 2')),
  maquina         text NOT NULL,
  material        text,
  tiempo_ciclo    text,
  responsable     text,
  notas           text,
  archivo_url     text,
  created_at      timestamptz DEFAULT now(),
  updated_at      timestamptz DEFAULT now()
);

ALTER TABLE programas_cnc ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Usuarios autenticados pueden ver" ON programas_cnc
  FOR SELECT TO authenticated USING (true);
CREATE POLICY "Usuarios autenticados pueden insertar" ON programas_cnc
  FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Usuarios autenticados pueden actualizar" ON programas_cnc
  FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Usuarios autenticados pueden eliminar" ON programas_cnc
  FOR DELETE TO authenticated USING (true);

-- ─── Herramientas CNC ─────────────────────────────────────────
CREATE TABLE IF NOT EXISTS herramientas_cnc (
  id           uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  codigo       text NOT NULL UNIQUE,     -- "HMECH-007"
  descripcion  text NOT NULL,
  tipo         text NOT NULL CHECK (tipo IN ('HMECH','HINSE','HPORT','HBRO','HOTRO')),
  stock        integer NOT NULL DEFAULT 0,
  stock_minimo integer NOT NULL DEFAULT 1,
  unidad       text DEFAULT 'unid.',
  proveedor    text,
  notas        text,
  created_at   timestamptz DEFAULT now(),
  updated_at   timestamptz DEFAULT now()
);

ALTER TABLE herramientas_cnc ENABLE ROW LEVEL SECURITY;
CREATE POLICY "auth read"   ON herramientas_cnc FOR SELECT    TO authenticated USING (true);
CREATE POLICY "auth insert" ON herramientas_cnc FOR INSERT    TO authenticated WITH CHECK (true);
CREATE POLICY "auth update" ON herramientas_cnc FOR UPDATE    TO authenticated USING (true);
CREATE POLICY "auth delete" ON herramientas_cnc FOR DELETE    TO authenticated USING (true);

-- ─── Herramientas de Medición ─────────────────────────────────
CREATE TABLE IF NOT EXISTS herramientas_medicion (
  id                 uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  codigo             text NOT NULL UNIQUE,
  descripcion        text NOT NULL,
  marca              text,
  rango              text,
  resolucion         text,
  stock              integer NOT NULL DEFAULT 0,
  stock_minimo       integer NOT NULL DEFAULT 1,
  calibrado          boolean DEFAULT false,
  fecha_calibracion  date,
  notas              text,
  created_at         timestamptz DEFAULT now(),
  updated_at         timestamptz DEFAULT now()
);

ALTER TABLE herramientas_medicion ENABLE ROW LEVEL SECURITY;
CREATE POLICY "auth read"   ON herramientas_medicion FOR SELECT TO authenticated USING (true);
CREATE POLICY "auth insert" ON herramientas_medicion FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "auth update" ON herramientas_medicion FOR UPDATE TO authenticated USING (true);
CREATE POLICY "auth delete" ON herramientas_medicion FOR DELETE TO authenticated USING (true);

-- ─── Herramientas Manuales ────────────────────────────────────
CREATE TABLE IF NOT EXISTS herramientas_manuales (
  id           uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  codigo       text NOT NULL UNIQUE,
  descripcion  text NOT NULL,
  categoria    text,
  stock        integer NOT NULL DEFAULT 0,
  stock_minimo integer NOT NULL DEFAULT 1,
  ubicacion    text,
  notas        text,
  created_at   timestamptz DEFAULT now(),
  updated_at   timestamptz DEFAULT now()
);

ALTER TABLE herramientas_manuales ENABLE ROW LEVEL SECURITY;
CREATE POLICY "auth read"   ON herramientas_manuales FOR SELECT TO authenticated USING (true);
CREATE POLICY "auth insert" ON herramientas_manuales FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "auth update" ON herramientas_manuales FOR UPDATE TO authenticated USING (true);
CREATE POLICY "auth delete" ON herramientas_manuales FOR DELETE TO authenticated USING (true);

-- ─── Trigger updated_at automático ───────────────────────────
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_programas_cnc_updated
  BEFORE UPDATE ON programas_cnc
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER trg_herramientas_cnc_updated
  BEFORE UPDATE ON herramientas_cnc
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER trg_herramientas_medicion_updated
  BEFORE UPDATE ON herramientas_medicion
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER trg_herramientas_manuales_updated
  BEFORE UPDATE ON herramientas_manuales
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
