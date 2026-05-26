"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  ShieldCheck,
  MapPin,
  Layers,
  TrendingUp,
  FileBarChart,
  Settings,
  Menu,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { label: "Overview", href: "/overview", icon: LayoutDashboard },
  { label: "Credit Scoring", href: "/credit-scoring", icon: ShieldCheck },
  { label: "Location Intelligence", href: "/location-intelligence", icon: MapPin },
  { label: "Clustering", href: "/clustering", icon: Layers },
  { label: "Policy Simulation", href: "/policy-simulation", icon: TrendingUp },
  { label: "Reports", href: "/reports", icon: FileBarChart },
  { label: "Settings", href: "/settings", icon: Settings },
];

export default function Sidebar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <>
      {/* Mobile Toggle */}
      <button
        className="lg:hidden fixed top-4 left-4 z-50 p-2 rounded-lg glass"
        onClick={() => setMobileOpen(!mobileOpen)}
        aria-label="Toggle sidebar"
      >
        {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
      </button>

      {/* Overlay */}
      {mobileOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/50 z-30"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed top-0 left-0 h-full w-[260px] bg-slate-950 border-r border-slate-800 z-40 flex flex-col transition-transform duration-300",
          mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        )}
      >
        {/* Logo */}
        <div className="p-6 border-b border-slate-800">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center">
              <MapPin className="w-4 h-4 text-white" />
            </div>
            <span className="text-lg font-bold text-white">GeoUMKM</span>
          </Link>
        </div>

        {/* Nav Items */}
        <nav className="flex-1 py-4 px-3 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all",
                  isActive
                    ? "bg-primary/20 text-accent border-l-2 border-accent"
                    : "text-slate-400 hover:text-white hover:bg-slate-800/50"
                )}
              >
                <item.icon className="w-5 h-5" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* User */}
        <div className="p-4 border-t border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center">
              <span className="text-xs font-bold text-white">U</span>
            </div>
            <div>
              <p className="text-sm font-medium text-white">User</p>
              <p className="text-xs text-slate-500">Administrator</p>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
