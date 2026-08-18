"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import {
  Home,
  FileCode2,
  Wrench,
  Ruler,
  Hammer,
  LogOut,
  ChevronDown,
  Settings2,
} from "lucide-react";
import { useState } from "react";

const navLinks = [
  { href: "/dashboard",             label: "Inicio",         icon: Home },
  { href: "/programas-cnc",         label: "Programas CNC",  icon: FileCode2 },
  { href: "/herramientas-cnc",      label: "Herr. CNC",      icon: Wrench },
  { href: "/medicion",              label: "Medición",       icon: Ruler },
  { href: "/herramientas-manuales", label: "Herr. Manuales", icon: Hammer },
];

interface NavbarProps {
  userEmail?: string;
  userName?: string;
}

export function Navbar({ userEmail, userName }: NavbarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);

  const initials = userName
    ? userName.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)
    : userEmail?.slice(0, 2).toUpperCase() ?? "US";

  async function handleLogout() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/login");
  }

  return (
    <nav
      className="navbar sticky top-0 z-50 shadow-sm"
      style={{ background: "var(--navy-950)" }}
    >
      {/* Logo */}
      <Link href="/dashboard" className="flex items-center gap-2.5 shrink-0">
        <div className="w-8 h-8 rounded-lg bg-navy-500 flex items-center justify-center border border-navy-500/50">
          <Settings2 size={16} className="text-brand-400" />
        </div>
        <span className="text-white font-medium text-[15px] hidden sm:block">
          Proyecto Micro
        </span>
      </Link>

      {/* Links */}
      <div className="flex items-center gap-0.5">
        {navLinks.map(({ href, label, icon: Icon }) => {
          const active = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-[13px] transition
                ${active
                  ? "bg-navy-500 text-white border-b-2 border-brand-500"
                  : "text-slate-400 hover:text-slate-200 hover:bg-navy-700/60"
                }`}
            >
              <Icon size={14} />
              <span className="hidden md:block">{label}</span>
            </Link>
          );
        })}
      </div>

      {/* User menu */}
      <div className="relative">
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="flex items-center gap-2 cursor-pointer"
        >
          <div className="w-8 h-8 rounded-full bg-navy-500 flex items-center justify-center text-xs font-medium text-brand-400 border border-navy-500/50">
            {initials}
          </div>
          <span className="text-slate-400 text-[13px] hidden sm:block">
            {userName ?? userEmail?.split("@")[0] ?? "Usuario"}
          </span>
          <ChevronDown size={13} className="text-slate-500" />
        </button>

        {menuOpen && (
          <div className="absolute right-0 top-10 w-52 bg-white border border-slate-200 rounded-xl shadow-lg py-1 z-50">
            <div className="px-3 py-2 border-b border-slate-100">
              <p className="text-xs font-medium text-slate-800 truncate">
                {userName ?? "Usuario"}
              </p>
              <p className="text-[11px] text-slate-500 truncate">{userEmail}</p>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 w-full px-3 py-2 text-sm text-red-600 hover:bg-red-50 transition"
            >
              <LogOut size={14} />
              Cerrar sesión
            </button>
          </div>
        )}
      </div>
    </nav>
  );
}
