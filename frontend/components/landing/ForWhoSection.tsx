"use client";

import { useState, useRef } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";
import { Building2, Landmark, Briefcase } from "lucide-react";
import { useLanguage } from "@/lib/i18n-context";

type TabId = 'bank' | 'government' | 'investor';

const tabIcons: Record<TabId, typeof Building2> = {
  bank: Building2,
  government: Landmark,
  investor: Briefcase,
};

const tabGradients: Record<TabId, string> = {
  bank: "from-blue-500/5 to-cyan-500/5",
  government: "from-amber-500/5 to-orange-500/5",
  investor: "from-purple-500/5 to-pink-500/5",
};

export default function ForWhoSection() {
  const [activeTab, setActiveTab] = useState<TabId>("bank");
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });
  const { t } = useLanguage();

  const tabs: { id: TabId; label: string }[] = [
    { id: "bank", label: t.landing.forWho.bankLabel },
    { id: "government", label: t.landing.forWho.governmentLabel },
    { id: "investor", label: t.landing.forWho.investorLabel },
  ];

  const activeContent = t.landing.forWho[activeTab];
  const ActiveIcon = tabIcons[activeTab];

  return (
    <section id="untuk-siapa" className="py-24 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            <span className="gradient-text">{t.landing.forWho.heading}</span>
          </h2>
          <p className="text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
            {t.landing.forWho.subheading}
          </p>
        </motion.div>

        {/* Tabs */}
        <div className="flex justify-center mb-12">
          <div className="inline-flex glass rounded-xl p-1.5 gap-1 overflow-x-auto flex-nowrap max-w-full">
            {tabs.map((tab) => {
              const TabIcon = tabIcons[tab.id];
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-5 py-3 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${
                    activeTab === tab.id
                      ? "bg-gradient-to-r from-primary to-accent text-white shadow-lg"
                      : "text-slate-600 dark:text-slate-400 hover:text-accent dark:hover:text-white"
                  }`}
                >
                  <TabIcon className="w-4 h-4" />
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Tab Content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -30 }}
            transition={{ duration: 0.35, ease: "easeInOut" }}
            className={`glass-card p-8 md:p-12 bg-gradient-to-br ${tabGradients[activeTab]}`}
          >
            <div className="grid md:grid-cols-2 gap-8 items-center">
              {/* Icon placeholder */}
              <div className="flex items-center justify-center">
                <div className="w-48 h-48 rounded-2xl bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
                  <ActiveIcon className="w-24 h-24 text-accent/70" />
                </div>
              </div>

              {/* Benefits */}
              <div>
                <h3 className="text-2xl font-bold mb-2 text-foreground">
                  {activeContent.title}
                </h3>
                <p className="text-slate-600 dark:text-slate-400 text-sm mb-6 italic">
                  {activeContent.subtitle}
                </p>
                <ul className="space-y-4">
                  {activeContent.benefits.map((benefit, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <div className="w-5 h-5 rounded-full bg-accent/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <div className="w-2 h-2 rounded-full bg-accent" />
                      </div>
                      <span className="text-sm text-slate-700 dark:text-slate-300">{benefit}</span>
                    </li>
                  ))}
                </ul>
                <button className="mt-8 px-6 py-3 rounded-lg bg-gradient-to-r from-primary to-accent text-white text-sm font-semibold hover:shadow-lg hover:shadow-accent/25 transition-all">
                  {activeContent.cta}
                </button>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}
