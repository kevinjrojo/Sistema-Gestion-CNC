# Proyecto Micro — Sistema de Gestión CNC

Next.js 15 + Supabase + Tailwind CSS

## Stack

- **Next.js 15** (App Router)
- **Supabase** — Base de datos PostgreSQL + Auth
- **Tailwind CSS** — Estilos
- **TypeScript**
- **Lucide React** — Iconos

## Estructura

```
src/
├── app/
│   ├── login/                  # Página de login
│   ├── dashboard/              # Inicio con 4 secciones
│   ├── programas-cnc/          # Gestión de programas
│   ├── herramientas-cnc/       # Inventario HMECH/HINSE/HPORT
│   ├── medicion/               # Instrumentos de medición
│   └── herramientas-manuales/  # Herramientas de armado
├── components/
│   ├── layout/Navbar.tsx       # Navbar compartido
│   └── ui/
│       ├── BadgeStock.tsx      # Badge de estado de stock
│       └── Modal.tsx           # Modal reutilizable
├── lib/supabase/
│   ├── client.ts               # Cliente browser
│   └── server.ts               # Cliente server
├── middleware.ts               # Protección de rutas
└── types/index.ts              # Tipos TypeScript
```

## Setup

### 1. Clonar e instalar

```bash
npm install
```

### 2. Variables de entorno

```bash
cp .env.local.example .env.local
```

Completá con tus credenciales de Supabase:

```env
NEXT_PUBLIC_SUPABASE_URL=https://TU_PROJECT_ID.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=TU_ANON_KEY
SUPABASE_SERVICE_ROLE_KEY=TU_SERVICE_ROLE_KEY
```

### 3. Base de datos Supabase

1. Entrá a tu proyecto en [supabase.com](https://supabase.com)
2. Abrí **SQL Editor**
3. Ejecutá el contenido de `supabase-schema.sql`

### 4. Autenticación

En Supabase → **Authentication → Providers**:
- Email/Password: habilitado por defecto
- Google OAuth: configurá Client ID y Secret (opcional)

### 5. Correr en desarrollo

```bash
npm run dev
```

Abrí [http://localhost:3000](http://localhost:3000)

## Conectar datos reales con Supabase

Cada página tiene datos mock que se reemplazan fácilmente. Ejemplo para Herramientas CNC:

```ts
// En herramientas-cnc/page.tsx — reemplazar MOCK por:
const supabase = createClient();
const { data } = await supabase
  .from("herramientas_cnc")
  .select("*")
  .order("codigo");
```

## Deploy en Vercel

```bash
vercel deploy
```

Configurá las variables de entorno en el dashboard de Vercel.
