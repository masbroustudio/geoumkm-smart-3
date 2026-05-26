'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, X, Send } from 'lucide-react';
import { postChat } from '@/lib/api';

type Message = {
  role: 'user' | 'assistant';
  content: string;
};

type Persona = 'government' | 'bank' | 'investor';

const personaLabels: Record<Persona, string> = {
  bank: 'Bank',
  government: 'Government',
  investor: 'Investor',
};

function getCannedResponse(message: string, persona: Persona): string {
  const lower = message.toLowerCase();

  if (lower.includes('kredit') || lower.includes('credit') || lower.includes('skor')) {
    if (persona === 'bank') {
      return 'Berdasarkan analisis credit scoring, portfolio UMKM terbagi dalam 7 band: AAA (9.8%) hingga CCC (10.1%). Rata-rata PD portfolio adalah 34.59% dengan konsentrasi terbesar di bucket 20-50% (very high risk). Rekomendasi: fokus ekspansi di area dengan PD < 20%.';
    }
    return 'Credit scoring menunjukkan 976 UMKM (9.8%) berada di kategori AAA dengan default rate hanya 3.9%. Sementara 1,010 UMKM (10.1%) di kategori CCC memiliki default rate 93.3%.';
  }

  if (lower.includes('cluster') || lower.includes('klaster') || lower.includes('segmen')) {
    if (persona === 'investor') {
      return 'Cluster Urban Digital Leaders (2,368 UMKM) memiliki investment score tertinggi (0.962) dengan market size Rp 182.2M. Cluster ini memiliki avg score 79.2, digital adoption 74.1%, dan survival rate 71.9%.';
    }
    return 'Terdapat 5 cluster utama: Urban Digital Leaders (2,368), Rural Developing (2,684), Urban Digital Leaders 2 (926), High-Risk Underserved (2,124), dan High-Risk Underserved 4 (1,898). Cluster prioritas pemerintah: High-Risk Underserved (priority score 0.968).';
  }

  if (lower.includes('lokasi') || lower.includes('location') || lower.includes('kecamatan')) {
    return 'Area dengan skor tertinggi: Pondok Gede, Kota Bekasi (94.85), Bekasi Selatan (92.0), dan Cilodong, Depok (90.3). Area terendah: Sagaranten, Sukabumi (1.36) dan Cisompet, Garut (6.82). Faktor utama: digital readiness dan infrastructure.';
  }

  if (lower.includes('kebijakan') || lower.includes('policy') || lower.includes('infrastruktur')) {
    if (persona === 'government') {
      return 'Simulasi kebijakan menunjukkan Infrastructure +30 memiliki dampak terbesar (avg improvement 19.87 poin, 244 UMKM baru di atas 70). Digital Training memiliki coverage terbaik (325 UMKM baru above 70). Budget: 41.5% untuk High-Risk Underserved, 27.8% untuk cluster 4.';
    }
    return 'Kebijakan Infrastructure +30 di area low-infra (2,507 UMKM) memberikan avg improvement 19.87 poin. Digital Training 50% menghasilkan 325 UMKM baru di atas skor 70.';
  }

  if (lower.includes('rekomendasi') || lower.includes('recommend')) {
    return 'Top recommendations: 1) Pondok Gede, Bekasi (Makanan, score 94.85) - high survival, good infrastructure. 2) Bekasi Selatan (92.0). 3) Cilodong, Depok (90.3). Filter by jenis usaha dan kabupaten untuk rekomendasi spesifik.';
  }

  // Default
  const defaults: Record<Persona, string> = {
    bank: 'Saya bisa membantu analisis credit scoring, PD estimation, dan risk assessment portfolio UMKM. Silakan tanya tentang distribusi kredit, default rate, atau rekomendasi lokasi ekspansi.',
    government: 'Saya bisa membantu analisis kebijakan, prioritas wilayah, dan simulasi dampak intervensi. Tanyakan tentang priority kecamatan, budget allocation, atau policy simulation.',
    investor: 'Saya bisa membantu analisis peluang investasi, market sizing, dan cluster profiling. Tanyakan tentang investment opportunity, market size, atau digital adoption rate.',
  };

  return defaults[persona];
}

export default function FloatingChatPanel() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', content: 'Halo! Saya asisten AI GeoUMKM. Saya bisa membantu Anda menganalisis data UMKM, credit scoring, dan insight lokasi. Pilih persona dan mulai bertanya!' },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [persona, setPersona] = useState<Persona>('government');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;
    const userMessage = input.trim();
    setMessages((prev) => [...prev, { role: 'user', content: userMessage }]);
    setInput('');
    setIsLoading(true);

    try {
      // Try API first
      const result = await postChat({
        message: userMessage,
        persona,
        history: messages.map((m) => ({ role: m.role, content: m.content })),
      });

      if (result.response) {
        setMessages((prev) => [...prev, { role: 'assistant', content: result.response }]);
      } else {
        // Fall back to canned response
        const response = getCannedResponse(userMessage, persona);
        setMessages((prev) => [...prev, { role: 'assistant', content: response }]);
      }
    } catch {
      // Fall back to canned response on error
      const response = getCannedResponse(userMessage, persona);
      setMessages((prev) => [...prev, { role: 'assistant', content: response }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* Floating Button */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-gradient-to-r from-accent to-accent-600 text-white shadow-xl shadow-accent/30 flex items-center justify-center hover:scale-110 transition-transform"
        whileTap={{ scale: 0.9 }}
        aria-label="Toggle AI Chat"
      >
        {isOpen ? <X className="w-6 h-6" /> : <MessageCircle className="w-6 h-6" />}
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
              <div className="flex items-center gap-2 mb-3">
                <div className="w-8 h-8 rounded-full bg-gradient-to-r from-accent to-accent-600 flex items-center justify-center">
                  <MessageCircle className="w-4 h-4 text-white" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-white">AI Assistant</h3>
                  <p className="text-xs text-slate-400">GeoUMKM Intelligence</p>
                </div>
              </div>
              {/* Persona Tabs */}
              <div className="flex gap-1">
                {(Object.keys(personaLabels) as Persona[]).map((p) => (
                  <button
                    key={p}
                    onClick={() => setPersona(p)}
                    className={`flex-1 px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
                      persona === p
                        ? 'bg-accent text-white'
                        : 'bg-slate-800 text-slate-400 hover:text-white'
                    }`}
                  >
                    {personaLabels[p]}
                  </button>
                ))}
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((msg, i) => (
                <div
                  key={i}
                  className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[85%] px-4 py-2.5 rounded-xl text-sm ${
                      msg.role === 'user'
                        ? 'bg-accent/20 text-slate-200 rounded-br-sm'
                        : 'bg-slate-800 text-slate-300 rounded-bl-sm'
                    }`}
                  >
                    {msg.content}
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-slate-800 text-slate-300 px-4 py-2.5 rounded-xl rounded-bl-sm text-sm">
                    <span className="inline-flex gap-1">
                      <span className="animate-bounce">.</span>
                      <span className="animate-bounce" style={{ animationDelay: '0.1s' }}>.</span>
                      <span className="animate-bounce" style={{ animationDelay: '0.2s' }}>.</span>
                    </span>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="p-4 border-t border-slate-700">
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                  placeholder="Tanya sesuatu..."
                  className="flex-1 px-4 py-2.5 rounded-lg bg-slate-800 border border-slate-700 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-accent"
                />
                <button
                  onClick={handleSend}
                  disabled={isLoading || !input.trim()}
                  className="p-2.5 rounded-lg bg-accent text-white hover:bg-accent-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
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
