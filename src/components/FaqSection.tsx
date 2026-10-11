import React, { useState } from 'react';
import { GENERAL_FAQS } from '../data/riceData';
import { HelpCircle, ChevronDown, ChevronUp, Search, MessageCircle, ShieldCheck } from 'lucide-react';

export const FaqSection: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [openFaqId, setOpenFaqId] = useState<string | null>(GENERAL_FAQS[0].id);

  const categories = [
    { id: 'all', label: 'All Questions' },
    { id: 'business-model', label: 'Broker Role & Business Model' },
    { id: 'samples', label: 'Sampling & Verification' },
    { id: 'varieties', label: 'Rice Varieties & Bagging' },
    { id: 'logistics', label: 'Logistics & 60+ Cities' },
    { id: 'pricing', label: 'Pricing & Terms' },
  ];

  const filteredFaqs = GENERAL_FAQS.filter((faq) => {
    const matchesCategory = selectedCategory === 'all' || faq.category === selectedCategory;
    const matchesSearch =
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const toggleFaq = (id: string) => {
    setOpenFaqId(openFaqId === id ? null : id);
  };

  return (
    <section id="faqs" className="py-16 bg-white border-b border-neutral-200">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-emerald-100 text-emerald-900 text-xs font-bold uppercase tracking-wider mb-2">
            <HelpCircle className="w-3.5 h-3.5" />
            Transparent Answers
          </div>
          <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-bold text-neutral-950 tracking-tight">
            Frequently Asked Questions on Rice Sourcing & Brokerage
          </h2>
          <p className="mt-2 text-neutral-600 text-sm leading-relaxed">
            Everything you need to know about our commission-based intermediary model, physical cooking samples, moisture standards, and Pakistan-wide logistics.
          </p>
        </div>

        {/* Search Bar */}
        <div className="relative max-w-xl mx-auto mb-8">
          <Search className="w-4 h-4 text-neutral-400 absolute left-4 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search questions (e.g., sample, commission, minimum order, delivery)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-11 pr-4 py-3 bg-neutral-50/60 border border-neutral-300 rounded-xl text-xs text-neutral-900 focus:outline-none focus:border-emerald-800 shadow-2xs"
          />
        </div>

        {/* Category Pills */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-8">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                selectedCategory === cat.id
                  ? 'bg-emerald-900 text-white shadow-xs'
                  : 'bg-neutral-50 text-neutral-700 hover:bg-neutral-100 border border-neutral-200'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* FAQ Accordion List */}
        <div className="space-y-3">
          {filteredFaqs.map((faq) => {
            const isOpen = openFaqId === faq.id;
            return (
              <div
                key={faq.id}
                className="bg-white rounded-xl border border-neutral-200 overflow-hidden shadow-2xs transition-all"
              >
                <button
                  onClick={() => toggleFaq(faq.id)}
                  className="w-full p-4 sm:p-5 text-left flex items-center justify-between gap-4 hover:bg-neutral-50/80 transition-colors focus:outline-none"
                >
                  <span className="font-serif text-sm sm:text-base font-bold text-neutral-900 leading-snug">
                    {faq.question}
                  </span>
                  <div className="w-7 h-7 rounded-full bg-neutral-100 flex items-center justify-center shrink-0 text-neutral-600">
                    {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </div>
                </button>

                {isOpen && (
                  <div className="px-4 sm:px-5 pb-5 pt-1 text-xs sm:text-sm text-neutral-600 leading-relaxed border-t border-neutral-100 bg-neutral-50/40">
                    <p>{faq.answer}</p>
                  </div>
                )}
              </div>
            );
          })}

          {filteredFaqs.length === 0 && (
            <div className="text-center py-10 bg-white rounded-xl border border-neutral-200 p-6">
              <p className="text-xs text-neutral-500">No questions matched your search query.</p>
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedCategory('all');
                }}
                className="mt-2 text-xs font-semibold text-emerald-800 hover:underline"
              >
                Clear Search Filter
              </button>
            </div>
          )}
        </div>

        {/* Have another question? WhatsApp bar */}
        <div className="mt-10 p-5 rounded-2xl bg-emerald-50 text-neutral-900 flex flex-col sm:flex-row items-center justify-between gap-4 border border-emerald-200 shadow-2xs">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-900 text-white flex items-center justify-center shrink-0 shadow-xs">
              <MessageCircle className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-serif text-sm font-bold text-neutral-950">Have a specific rice inquiry not covered above?</h4>
              <p className="text-[11px] text-neutral-600">
                Ask our sourcing broker directly on WhatsApp for instant clarification.
              </p>
            </div>
          </div>

          <a
            href="https://wa.me/923338990883?text=Hello%20Hashir%20Rice%20Supplier,%20I%20have%20a%20question%20regarding%20bulk%20rice%20sourcing."
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2 bg-emerald-900 hover:bg-emerald-950 text-white font-bold text-xs rounded-lg transition-colors shrink-0 shadow-xs"
          >
            Chat on WhatsApp
          </a>
        </div>
      </div>
    </section>
  );
};
