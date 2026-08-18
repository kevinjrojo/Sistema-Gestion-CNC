import { getEstadoStock } from "@/types";

interface BadgeStockProps {
  stock: number;
  minimo: number;
}

export function BadgeStock({ stock, minimo }: BadgeStockProps) {
  const estado = getEstadoStock(stock, minimo);

  if (estado === "sin_stock")
    return <span className="badge-empty">Sin stock</span>;
  if (estado === "bajo")
    return <span className="badge-bajo">Stock bajo</span>;
  return <span className="badge-ok">OK</span>;
}
