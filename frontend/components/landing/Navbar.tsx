"use client";

import { useState, useEffect } from "react";
import { MapPin, Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";

const navLinks = [
  { label: "Fitur", href: "#fitur" },
  { label: "Untuk Siapa", href: "#untuk-siapa" },
  { label: "Teknologi", href: "#teknologi" },
  { label: "Harga", href: "#harga" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        scrolled
          ? "glass py-3 shadow-lg"
          : "bg-transparent py-5"
      )}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <a href="#" className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center">
              <MapPin className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-foreground">
              <span className="gradient-text">GeoUMKM</span>
            </span>
          </a>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="text-sm font-medium text-slate-300 hover:text-accent transition-colors"
              >
                {link.label}
              </a>
            ))}
          </div>

          {/* CTA */}
          <div className="hidden md:block">
            <a
              href="#harga"
              className="px-5 py-2.5 rounded-lg bg-gradient-to-r from-primary to-accent text-white text-sm font-semibold hover:shadow-lg hover:shadow-accent/25 transition-all"
            >
              Mulai Sekarang
            </a>
          </div>

          {/* Mobile Toggle */}
          <button
            className="md:hidden p-2 text-slate-300"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileOpen && (
          <div className="md:hidden mt-4 pb-4 border-t border-white/10">
            <div className="flex flex-col gap-3 pt-4">
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  className="text-sm font-medium text-slate-300 hover:text-accent transition-colors"
                  onClick={() => setMobileOpen(false)}
                >
                  {link.label}
                </a>
              ))}
              <a
                href="#harga"
                className="mt-2 px-5 py-2.5 rounded-lg bg-gradient-to-r from-primary to-accent text-white text-sm font-semibold text-center"
                onClick={() => setMobileOpen(false)}
              >
                Mulai Sekarang
              </a>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
