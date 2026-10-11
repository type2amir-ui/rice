import React, { useState } from 'react';
import { MessageCircle, X, ChevronRight, Sparkles, CheckCircle2 } from 'lucide-react';

export const FloatingWhatsApp: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedDesk, setSelectedDesk] = useState<'desk1' | 'desk2'>('desk1');

  const desks = {
    desk1: {
      number: '923338990883',
      label: '+92 333 8990883',
      title: 'Mandi Rates & Dispatch Desk',
    },
    desk2: {
      number: '923002861297',
      label: '+92 300 2861297',
      title: 'Bulk Sourcing & Quality Samples',
    },
  };

  const quickPrompts = [
    {
      title: 'Current Basmati Wholesale Rates',
      msg: 'Hello Hashir Rice Supplier, please share today’s mandi rates for Super Kernel and 1121 Kainat Basmati.',
    },
    {
      title: 'Request Free Cooking Sample',
      msg: 'Hello, I want to request a free physical rice cooking sample for testing in my city. Please guide me.',
    },
    {
      title: '1121 Kainat Steam (22mm+) Sourcing',
      msg: 'Hello Hashir Rice Supplier, I need bulk quotation for 1121 Kainat Steam Basmati with 22mm+ cooked elongation.',
    },
    {
      title: 'IRRI-6 / Broken Rice (Tota) Bulk Inquiry',
      msg: 'Hello, please share rates and availability for IRRI-6 Long Grain / Basmati Broken (Tota) in bulk tonnage.',
    },
  ];

  const handleOpenWhatsApp = (customMsg?: string, deskKey?: 'desk1' | 'desk2') => {
    const activeDesk = desks[deskKey || selectedDesk];
    const text = encodeURIComponent(
      customMsg ||
        'Hello Hashir Rice Supplier, I am interested in bulk wholesale rice sourcing across Pakistan.'
    );
    window.open(`https://wa.me/${activeDesk.number}?text=${text}`, '_blank');
  };

  return (
    <div className="fixed bottom-5 right-5 z-40 flex flex-col items-end">
      {/* Pop-up Assistant Drawer */}
      {isOpen && (
        <div className="bg-white rounded-2xl shadow-2xl border border-neutral-200 w-80 sm:w-96 overflow-hidden mb-3 animate-fadeIn">
          {/* Header */}
          <div className="bg-emerald-950 text-white p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-emerald-900 border border-emerald-700 text-amber-400 flex items-center justify-center font-bold text-sm">
                HR
              </div>
              <div>
                <h4 className="font-serif font-bold text-sm leading-tight">Hashir Rice Supplier Desk</h4>
                <p className="text-[11px] text-emerald-300 flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                  Online • +92 333 8990883 | +92 300 2861297
                </p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1 rounded-full text-neutral-300 hover:text-white hover:bg-white/10"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Desk Selector */}
          <div className="bg-emerald-900/40 px-3 py-2 border-b border-emerald-800/30 flex gap-2">
            <button
              type="button"
              onClick={() => setSelectedDesk('desk1')}
              className={`flex-1 py-1.5 px-2 rounded-lg text-[11px] font-semibold transition-all text-center ${
                selectedDesk === 'desk1'
                  ? 'bg-emerald-700 text-white shadow-xs'
                  : 'bg-white/10 text-emerald-200 hover:bg-white/20'
              }`}
            >
              Desk 1: 0333 8990883
            </button>
            <button
              type="button"
              onClick={() => setSelectedDesk('desk2')}
              className={`flex-1 py-1.5 px-2 rounded-lg text-[11px] font-semibold transition-all text-center ${
                selectedDesk === 'desk2'
                  ? 'bg-emerald-700 text-white shadow-xs'
                  : 'bg-white/10 text-emerald-200 hover:bg-white/20'
              }`}
            >
              Desk 2: 0300 2861297
            </button>
          </div>

          {/* Body */}
          <div className="p-4 bg-neutral-50 text-neutral-800 space-y-3 text-xs">
            <p className="text-neutral-600 bg-white p-3 rounded-xl border border-neutral-200/80 shadow-2xs leading-relaxed">
              Assalam-o-Alaikum! Welcome to <strong>Hashir Rice Supplier</strong>. How can we help you source premium Pakistani rice today?
            </p>

            <div className="space-y-1.5">
              <span className="text-[11px] font-bold text-neutral-500 uppercase tracking-wider block">
                Quick Inquiries:
              </span>
              {quickPrompts.map((prompt, i) => (
                <button
                  key={i}
                  onClick={() => handleOpenWhatsApp(prompt.msg)}
                  className="w-full text-left p-2.5 bg-white hover:bg-emerald-50 rounded-xl border border-neutral-200 hover:border-emerald-700 transition-all flex items-center justify-between text-[11px] font-medium text-neutral-800 group"
                >
                  <span className="truncate pr-2">{prompt.title}</span>
                  <ChevronRight className="w-3.5 h-3.5 text-neutral-400 group-hover:text-emerald-900 group-hover:translate-x-0.5 transition-transform shrink-0" />
                </button>
              ))}
            </div>
          </div>

          {/* Footer */}
          <div className="p-3 bg-white border-t border-neutral-100 flex gap-2">
            <button
              onClick={() => handleOpenWhatsApp(undefined, 'desk1')}
              className="flex-1 py-2 bg-emerald-800 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl transition-colors flex items-center justify-center gap-1.5 shadow-2xs"
            >
              <MessageCircle className="w-3.5 h-3.5 fill-white" />
              <span>Desk 1 (0333)</span>
            </button>
            <button
              onClick={() => handleOpenWhatsApp(undefined, 'desk2')}
              className="flex-1 py-2 bg-emerald-700 hover:bg-emerald-600 text-white font-bold text-xs rounded-xl transition-colors flex items-center justify-center gap-1.5 shadow-2xs"
            >
              <MessageCircle className="w-3.5 h-3.5 fill-white" />
              <span>Desk 2 (0300)</span>
            </button>
          </div>
        </div>
      )}

      {/* Main Floating Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-4 py-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-full shadow-xl hover:shadow-2xl transition-all duration-300 active:scale-95 group border-2 border-white/80"
        aria-label="Chat on WhatsApp with Hashir Rice Supplier"
      >
        <MessageCircle className="w-6 h-6 fill-white" />
        <span className="text-xs font-bold hidden sm:inline tracking-wide">
          WhatsApp Sourcing Desk
        </span>
      </button>
    </div>
  );
};
