"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle, X, Send } from "lucide-react";

const placeholderMessages = [
  {
    role: "assistant" as const,
    content:
      "Halo! Saya asisten AI GeoUMKM. Saya bisa membantu Anda menganalisis data UMKM, credit scoring, dan insight lokasi. Ada yang bisa saya bantu?",
  },
  {
    role: "user" as const,
    content: "Berapa rata-rata skor kredit UMKM di Kecamatan Kebumen?",
  },
  {
    role: "assistant" as const,
    content:
      "Berdasarkan analisis model credit scoring kami, rata-rata skor kredit UMKM di Kecamatan Kebumen adalah 72.4 dari skala 100. Ini termasuk kategori 'Good' dengan PD estimasi 3.2%.",
  },
];

export default function FloatingChatPanel() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Floating Button */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-gradient-to-r from-accent to-accent-600 text-white shadow-xl shadow-accent/30 flex items-center justify-center hover:scale-110 transition-transform"
        whileTap={{ scale: 0.9 }}
        aria-label="Toggle AI Chat"
      >
        {isOpen ? (
          <X className="w-6 h-6" />
        ) : (
          <MessageCircle className="w-6 h-6" />
        )}
      </motion.button>

      {/* Chat Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ duration: 0.2 }}
            className="fixed bottom-24 right-6 z-50 w-[380px] h-[500px] glass-card flex flex-col overflow-hidden shadow-2xl"
          >
            {/* Header */}
            <div className="p-4 border-b border-slate-700 bg-slate-900/80">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-gradient-to-r from-accent to-accent-600 flex items-center justify-center">
                  <MessageCircle className="w-4 h-4 text-white" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-white">
                    AI Assistant
                  </h3>
                  <p className="text-xs text-slate-400">Powered by GPT-4o</p>
                </div>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {placeholderMessages.map((msg, i) => (
                <div
                  key={i}
                  className={`flex ${
                    msg.role === "user" ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`max-w-[85%] px-4 py-2.5 rounded-xl text-sm ${
                      msg.role === "user"
                        ? "bg-accent/20 text-slate-200 rounded-br-sm"
                        : "bg-slate-800 text-slate-300 rounded-bl-sm"
                    }`}
                  >
                    {msg.content}
                  </div>
                </div>
              ))}
            </div>

            {/* Input */}
            <div className="p-4 border-t border-slate-700">
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  placeholder="Tanya sesuatu..."
                  className="flex-1 px-4 py-2.5 rounded-lg bg-slate-800 border border-slate-700 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-accent"
                  disabled
                />
                <button
                  className="p-2.5 rounded-lg bg-accent text-white hover:bg-accent-600 transition-colors"
                  disabled
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
