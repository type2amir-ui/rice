import React from 'react';
import { BookOpen, CheckCircle2, MapPin, Sparkles, Truck, ShieldCheck, Scale, ArrowRight } from 'lucide-react';

interface RiceTradingGuideSectionProps {
  onOpenQuoteModal: (varietyName?: string) => void;
  onOpenSampleModal: (varietyName?: string) => void;
}

export const RiceTradingGuideSection: React.FC<RiceTradingGuideSectionProps> = ({
  onOpenQuoteModal,
  onOpenSampleModal,
}) => {
  return (
    <section id="rice-procurement-guide" className="py-16 bg-neutral-50/70 border-b border-neutral-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-emerald-100 text-emerald-900 text-xs font-bold uppercase tracking-wider mb-2">
            <BookOpen className="w-3.5 h-3.5" />
            Wholesale Rice Buyer's Sourcing Guide
          </div>
          <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-bold text-neutral-950 tracking-tight">
            Pakistan Wholesale Rice Trade, Commercial Varieties & Procurement Standards
          </h2>
          <p className="mt-3 text-neutral-600 text-sm sm:text-base leading-relaxed">
            Essential commercial guidelines for grain wholesalers, restaurant chains, and bulk buyers sourcing <strong>Basmati Rice</strong>, <strong>1121 Steam Rice</strong>, <strong>1121 Sella Rice</strong>, and <strong>IRRI Rice</strong> across Pakistan.
          </p>
        </div>

        {/* 3 Pillar Informational Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1: Basmati Varieties */}
          <div className="bg-white rounded-2xl p-6 sm:p-7 border border-neutral-200 shadow-2xs hover:shadow-md transition-shadow flex flex-col justify-between">
            <div className="space-y-4">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-900 border border-emerald-200 flex items-center justify-center font-bold">
                01
              </div>
              <h3 className="font-serif text-lg font-bold text-neutral-950">
                Premium Basmati Rice Varieties
              </h3>
              <p className="text-xs text-neutral-600 leading-relaxed">
                Pakistan's fertile Kallar belt produces the world's most sought-after fragrant long grains. As a certified <strong>Basmati Rice Supplier Pakistan</strong>, we facilitate:
              </p>
              <ul className="space-y-2 text-xs text-neutral-700">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700 shrink-0 mt-0.5" />
                  <span><strong>1121 Basmati Rice:</strong> World-record 8.35mm raw length with exceptional elongation over 22mm post-cooking.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700 shrink-0 mt-0.5" />
                  <span><strong>1121 Steam Rice:</strong> Steam-conditioned to prevent cooking breakage, perfect for biryani and Mandi dishes.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700 shrink-0 mt-0.5" />
                  <span><strong>1121 Sella Rice:</strong> Hard parboiled golden/white grain capable of withstanding intense daig heat without breaking.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700 shrink-0 mt-0.5" />
                  <span><strong>Super Kernel Basmati Rice:</strong> The heritage monarch of aromatic rice, naturally aged 12 to 24 months.</span>
                </li>
              </ul>
            </div>
            <div className="pt-4 mt-4 border-t border-neutral-100">
              <button
                onClick={() => onOpenSampleModal('1121 Steam Rice')}
                className="text-xs font-bold text-emerald-900 hover:text-emerald-950 inline-flex items-center gap-1"
              >
                <span>Request Basmati Samples</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Card 2: Commercial Non-Basmati & Long Grain */}
          <div className="bg-white rounded-2xl p-6 sm:p-7 border border-neutral-200 shadow-2xs hover:shadow-md transition-shadow flex flex-col justify-between">
            <div className="space-y-4">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-900 border border-emerald-200 flex items-center justify-center font-bold">
                02
              </div>
              <h3 className="font-serif text-lg font-bold text-neutral-950">
                Commercial IRRI & PK-386 Rice
              </h3>
              <p className="text-xs text-neutral-600 leading-relaxed">
                For high-volume canteens, institutional kitchens, and budget-conscious dining, our network as a <strong>Wholesale Rice Trader Pakistan</strong> provides high-yield grains:
              </p>
              <ul className="space-y-2 text-xs text-neutral-700">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700 shrink-0 mt-0.5" />
                  <span><strong>IRRI Rice & IRRI-6 Rice:</strong> Highly economical non-basmati long grain rice widely used in catering and export.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700 shrink-0 mt-0.5" />
                  <span><strong>IRRI-9 Rice:</strong> Fine non-basmati grain offering longer cooking length and tender mouthfeel at competitive rates.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700 shrink-0 mt-0.5" />
                  <span><strong>PK-386 Rice:</strong> Aromatic hybrid long grain rice delivering fragrant basmati-like aroma at a fraction of the cost.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700 shrink-0 mt-0.5" />
                  <span><strong>B1 & B2 Broken Rice:</strong> Clean Sortex-graded half (Tota) and small broken (Kani) for kheer and rice flour.</span>
                </li>
              </ul>
            </div>
            <div className="pt-4 mt-4 border-t border-neutral-100">
              <button
                onClick={() => onOpenQuoteModal('IRRI-6 Rice')}
                className="text-xs font-bold text-emerald-900 hover:text-emerald-950 inline-flex items-center gap-1"
              >
                <span>Get IRRI & PK-386 Rates</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Card 3: Nationwide Logistics & Procurement */}
          <div className="bg-white rounded-2xl p-6 sm:p-7 border border-neutral-200 shadow-2xs hover:shadow-md transition-shadow flex flex-col justify-between">
            <div className="space-y-4">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-900 border border-emerald-200 flex items-center justify-center font-bold">
                03
              </div>
              <h3 className="font-serif text-lg font-bold text-neutral-950">
                Nationwide B2B Sourcing Logistics
              </h3>
              <p className="text-xs text-neutral-600 leading-relaxed">
                Operating as a leading <strong>Commercial Rice Supplier Pakistan</strong> and <strong>Rice Distributor Pakistan</strong>, we ensure uninterrupted logistics:
              </p>
              <ul className="space-y-2 text-xs text-neutral-700">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700 shrink-0 mt-0.5" />
                  <span><strong>Rice Supplier All Over Pakistan:</strong> Direct truck freight dispatches to Lahore, Karachi, Rawalpindi, Islamabad & 60+ cities.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700 shrink-0 mt-0.5" />
                  <span><strong>Bulk Rice Supply Across Pakistan:</strong> Flexible consignments from 5 metric tons to 50-ton multi-axle freight.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700 shrink-0 mt-0.5" />
                  <span><strong>Quality Sealing at Mill Gate:</strong> Strict verification against moisture limits (≤12.5%) and broken grain percentages.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700 shrink-0 mt-0.5" />
                  <span><strong>Transparent Mandi Brokerage:</strong> Real-time pricing with clear commission terms and zero hidden markups.</span>
                </li>
              </ul>
            </div>
            <div className="pt-4 mt-4 border-t border-neutral-100">
              <button
                onClick={() => onOpenQuoteModal()}
                className="text-xs font-bold text-emerald-900 hover:text-emerald-950 inline-flex items-center gap-1"
              >
                <span>Calculate Freight & Rate</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>

        {/* Informative Summary Box: Google E-E-A-T Trade Standards */}
        <div className="bg-emerald-900 text-white rounded-2xl p-6 sm:p-8 shadow-md">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
            <div className="lg:col-span-8 space-y-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-800 text-amber-300 text-xs font-semibold">
                <ShieldCheck className="w-3.5 h-3.5" />
                Trusted Pakistani Rice Supplier & Rice Merchant
              </div>
              <h3 className="font-serif text-xl sm:text-2xl font-bold tracking-tight text-white">
                Why Hashir Rice Supplier is the Preferred Rice Supply Company in Pakistan
              </h3>
              <p className="text-emerald-100 text-xs sm:text-sm leading-relaxed">
                Whether you need a full container of <strong>1121 Sella Rice</strong> for Middle East export, weekly supplies of <strong>1121 Steam Rice</strong> for Karachi biryani outlets, or bulk <strong>Super Kernel Basmati Rice</strong> for Islamabad banquet catering, <strong>Hashir Rice Supplier</strong> guarantees sample-verified excellence, transparent mandi pricing, and seamless truck freight across all major cities of Pakistan.
              </p>
            </div>
            <div className="lg:col-span-4 flex flex-col sm:flex-row lg:flex-col gap-3">
              <button
                onClick={() => onOpenQuoteModal()}
                className="w-full py-3 px-4 bg-amber-400 hover:bg-amber-300 text-neutral-950 font-bold text-xs rounded-xl transition-colors shadow-sm text-center"
              >
                Get Wholesale Rice Quote
              </button>
              <button
                onClick={() => onOpenSampleModal()}
                className="w-full py-3 px-4 bg-emerald-800 hover:bg-emerald-700 text-white font-semibold text-xs rounded-xl transition-colors border border-emerald-700 text-center"
              >
                Order Free Test Cooking Sample
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
