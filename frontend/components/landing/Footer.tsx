"use client";

import { MapPin } from "lucide-react";
import { useLanguage } from "@/lib/i18n-context";

export default function Footer() {
  const { t } = useLanguage();

  const footerLinks = {
    [t.landing.footer.product]: [
      { label: "Credit Scoring", href: "#" },
      { label: "Location Intelligence", href: "#" },
      { label: "Clustering", href: "#" },
      { label: "Policy Simulation", href: "#" },
      { label: "AI Chat", href: "#" },
    ],
    [t.landing.footer.company]: [
      { label: t.landing.footer.companyAbout, href: "#" },
      { label: t.landing.footer.companyCareer, href: "#" },
      { label: t.landing.footer.companyBlog, href: "#" },
      { label: t.landing.footer.companyContact, href: "#" },
    ],
    [t.landing.footer.legal]: [
      { label: t.landing.footer.legalPrivacy, href: "#" },
      { label: t.landing.footer.legalTerms, href: "#" },
      { label: t.landing.footer.legalSla, href: "#" },
    ],
  };

  return (
    <footer className="bg-slate-950 border-t border-slate-800 pt-16 pb-8 relative wave-border-top">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          {/* Brand */}
          <div className="md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                <MapPin className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-white">GeoUMKM</span>
            </div>
            <p className="text-sm text-slate-400 leading-relaxed">
              {t.landing.footer.description}
            </p>
          </div>

          {/* Links */}
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h4 className="font-semibold text-white mb-4">{category}</h4>
              <ul className="space-y-2">
                {links.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      className="text-sm text-slate-400 hover:text-accent hover:translate-x-1 inline-block transition-all duration-200"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom */}
        <div className="border-t border-slate-800 pt-8">
          <p className="text-center text-sm text-slate-500">
            {t.landing.footer.copyright}
          </p>
        </div>
      </div>
    </footer>
  );
}
