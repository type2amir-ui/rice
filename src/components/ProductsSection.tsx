import React, { useState } from 'react';
import { RICE_VARIETIES } from '../data/riceData';
import { RiceVariety } from '../types';
import { Sparkles, MessageCircle, ArrowRight, ShieldCheck, CheckCircle, Info } from 'lucide-react';

interface ProductsSectionProps {
  onOpenQuoteModal: (varietyName?: string) => void;
  onOpenSampleModal: (varietyName?: string) => void;
  onSelectVarietyDetail: (variety: RiceVariety) => void;
}

export const ProductsSection: React.FC<ProductsSectionProps> = ({
  onOpenQuoteModal,
  onOpenSampleModal,
  onSelectVarietyDetail,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const categories = [
    { id: 'all', label: 'All 11 Varieties' },
    { id: 'basmati', label: '1121 & Super Basmati' },
    { id: 'broken', label: 'B1 / B2 / B3 Broken Rice' },
    { id: 'specialty', label: 'Brown & Short Grain' },
  ];

  const filteredVarieties = selectedCategory === 'all'
    ? RICE_VARIETIES
    : RICE_VARIETIES.filter((v) => v.category === selectedCategory);

  return (
    <section id="rice-varieties" className="py-16 bg-white border-b border-neutral-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-6">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 text-emerald-900 text-xs font-bold uppercase tracking-wider mb-2">
              <Sparkles className="w-3.5 h-3.5" />
              Wholesale Basmati Rice & Long Grain Rice Catalog
            </div>
            <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-bold text-neutral-950 tracking-tight">
              Basmati Rice, 1121 Steam Rice, 1121 Sella Rice & Super Kernel Basmati Rice
            </h2>
            <p className="mt-2 text-neutral-600 text-sm leading-relaxed">
              As a dedicated wholesale rice supplier Pakistan and bulk rice trader in Pakistan, we supply premium <strong>1121 Basmati Rice</strong>, <strong>Super Kernel Basmati Rice</strong>, <strong>1121 Steam Rice</strong>, <strong>1121 Sella Rice</strong>, <strong>PK-386 Rice</strong>, <strong>IRRI Rice (IRRI-6 & IRRI-9)</strong>, and long grain broken rice directly from certified Punjab and Sindh mills.
            </p>
          </div>

          {/* Category Filter Chips */}
          <div className="flex flex-wrap items-center gap-2">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  selectedCategory === cat.id
                    ? 'bg-emerald-900 text-white shadow-sm'
                    : 'bg-white text-neutral-700 hover:bg-neutral-100 border border-neutral-200'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Product Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredVarieties.map((variety) => (
            <div
              key={variety.id}
              className="bg-white rounded-2xl border border-neutral-200/90 overflow-hidden shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col group"
            >
              {/* Product Image Header */}
              <div className="relative h-48 overflow-hidden bg-neutral-100">
                <img
                  src={variety.imageUrl}
                  alt={`${variety.name} bulk supply in Pakistan`}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  loading="lazy"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/10 to-transparent" />

                {/* Category Badge */}
                <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-xs px-2.5 py-1 rounded-md text-[11px] font-bold text-emerald-950 shadow-xs uppercase tracking-wider">
                  {variety.category}
                </div>

                {variety.sampleAvailable && (
                  <div className="absolute top-3 right-3 bg-amber-400 text-neutral-950 text-[10px] font-bold px-2 py-0.5 rounded shadow-xs">
                    Sample Ready
                  </div>
                )}

                {/* Card Title on Image Overlay */}
                <div className="absolute bottom-3 left-3 right-3 text-white">
                  <h3 className="font-serif text-base font-bold leading-tight">
                    {variety.name}
                  </h3>
                  <p className="text-[11px] text-amber-200 line-clamp-1 mt-0.5">
                    {variety.tagline}
                  </p>
                </div>
              </div>

              {/* Card Specs Summary */}
              <div className="p-4 flex-1 flex flex-col justify-between space-y-4">
                <div className="space-y-2.5">
                  {/* Quick Specs Grid */}
                  <div className="grid grid-cols-2 gap-2 text-[11px] bg-neutral-50 p-2.5 rounded-lg border border-neutral-100">
                    <div>
                      <span className="text-neutral-500 block">Grain Length:</span>
                      <span className="font-semibold text-neutral-900">{variety.specs.averageGrainLength.split(' ')[0]} mm</span>
                    </div>
                    <div>
                      <span className="text-neutral-500 block">Cooked Length:</span>
                      <span className="font-bold text-emerald-800">{variety.specs.postCookingLength}</span>
                    </div>
                    <div>
                      <span className="text-neutral-500 block">Aroma:</span>
                      <span className="font-medium text-neutral-900">{variety.specs.aroma}</span>
                    </div>
                    <div>
                      <span className="text-neutral-500 block">Moisture:</span>
                      <span className="font-medium text-neutral-900">{variety.specs.moistureMax}</span>
                    </div>
                  </div>

                  <p className="text-xs text-neutral-600 line-clamp-2 leading-relaxed">
                    {variety.description}
                  </p>

                  {/* Suitable Culinary Uses */}
                  <div>
                    <span className="text-[11px] font-semibold text-neutral-500 block mb-1">Ideal For:</span>
                    <div className="flex flex-wrap gap-1">
                      {variety.suitableFor.slice(0, 2).map((use, i) => (
                        <span
                          key={i}
                          className="px-2 py-0.5 bg-emerald-50 text-emerald-900 rounded text-[10px] font-medium border border-emerald-200/60"
                        >
                          {use}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="pt-2 border-t border-neutral-100 flex flex-col gap-2">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => onOpenQuoteModal(variety.name)}
                      className="flex-1 py-2 rounded-lg bg-emerald-900 hover:bg-emerald-950 text-white font-semibold text-xs transition-colors flex items-center justify-center gap-1.5 shadow-2xs"
                    >
                      <span>Get Rate</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                    <button
                      onClick={() => onOpenSampleModal(variety.name)}
                      className="py-2 px-3 rounded-lg bg-amber-100 hover:bg-amber-200 text-amber-950 font-bold text-xs transition-colors"
                      title="Request Physical Cooking Sample"
                    >
                      Sample
                    </button>
                  </div>

                  <button
                    onClick={() => onSelectVarietyDetail(variety)}
                    className="w-full text-center text-[11px] text-neutral-500 hover:text-emerald-800 font-medium py-0.5 transition-colors flex items-center justify-center gap-1"
                  >
                    <Info className="w-3 h-3" />
                    <span>View Complete Laboratory Specs</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Custom Rice Variety Sourcing Banner */}
        <div className="mt-12 p-6 rounded-2xl bg-gradient-to-r from-emerald-900 to-neutral-900 text-white flex flex-col md:flex-row items-center justify-between gap-6 shadow-lg border border-emerald-800">
          <div>
            <span className="text-amber-400 text-xs font-bold uppercase tracking-wider block mb-1">
              Custom Milled Specs Available
            </span>
            <h3 className="font-serif text-lg sm:text-xl font-bold">
              Looking for a Specific Rice Grade, Grain Length, or Custom Private Bagging?
            </h3>
            <p className="text-xs sm:text-sm text-neutral-300 mt-1 max-w-xl">
              We arrange custom color-sorted lots, custom moisture curing, and private label master packaging with partner mills across Punjab.
            </p>
          </div>

          <a
            href="https://wa.me/923338990883?text=Hello%20Hashir%20Rice%20Supplier,%20I%20have%20a%20custom%20rice%20specification%20inquiry."
            target="_blank"
            rel="noopener noreferrer"
            className="px-5 py-2.5 rounded-lg bg-amber-400 hover:bg-amber-300 text-neutral-950 font-bold text-xs flex items-center gap-2 shrink-0 transition-all shadow"
          >
            <MessageCircle className="w-4 h-4 text-neutral-950 fill-neutral-950" />
            <span>Discuss Custom Sourcing</span>
          </a>
        </div>
      </div>
    </section>
  );
};
