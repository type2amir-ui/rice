import React from 'react';
import { ArrowRight, ShieldCheck, Sparkles, MessageCircle, CheckCircle2, MapPin, Truck, Layers, Award } from 'lucide-react';

interface HeroSectionProps {
  onOpenQuoteModal: (varietyName?: string) => void;
  onOpenSampleModal: (varietyName?: string) => void;
  setCurrentView: (view: string) => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  onOpenQuoteModal,
  onOpenSampleModal,
  setCurrentView,
}) => {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-emerald-50/70 via-white to-neutral-50/50 pt-10 pb-20 border-b border-neutral-200/80">
      {/* Background Accent Grid */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#05966908_1px,transparent_1px),linear-gradient(to_bottom,#05966908_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Hero Column: Value Proposition & Sourcing Positioning */}
          <div className="lg:col-span-7 space-y-6">
            {/* Verified Intermediary Badge */}
            <div className="inline-flex flex-wrap items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-900/10 border border-emerald-800/20 text-emerald-950 text-xs font-semibold tracking-wide">
              <span className="flex h-2 w-2 rounded-full bg-emerald-600 animate-ping"></span>
              <ShieldCheck className="w-4 h-4 text-emerald-800" />
              <span>Hashir Rice • Noor Galla Mandi Bucheki • Sourcing &amp; Brokerage Desk</span>
            </div>

            {/* Main Headline with High-Impact Semantic Keywords */}
            <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-neutral-950 leading-[1.15]">
              Rice Supplier, Wholesale Rice Broker &amp; Bulk Rice Supplier in <span className="text-emerald-900 underline decoration-amber-400 decoration-4 underline-offset-4">Pakistan</span>
            </h1>

            {/* Sub-headline integrating all user-requested primary business functions */}
            <p className="text-base sm:text-lg text-neutral-700 leading-relaxed max-w-2xl font-normal">
              <strong>Haji Muhammad Hashir</strong> is your trusted <strong>Rice Supplier</strong>, licensed <strong>Rice Broker</strong>, and premier <strong>Rice Wholesale Dealer</strong> operating from Noor Galla Mandi, Bucheki (Punjab). As top <strong>Wholesale Rice Suppliers</strong> and nationwide <strong>Bulk Rice Supplier</strong>, we supply 50kg and 25kg woven bags of <strong>Hashir Rice</strong> (1121 Kainat Steam &amp; Sella, Super Kernel Basmati, 1509, PK-386, and IRRI-6) with transparent mandi commission and express bilty logistics. In the future, we are expanding into centralized commodity <strong>Rice Trading</strong>.
            </p>

            {/* Trust Points Matrix */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-2 text-xs font-medium text-neutral-800">
              <div className="flex items-center gap-2 p-2 rounded-lg bg-white border border-neutral-200/90 shadow-2xs">
                <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
                <span>Wholesale Rice Suppliers</span>
              </div>
              <div className="flex items-center gap-2 p-2 rounded-lg bg-white border border-neutral-200/90 shadow-2xs">
                <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
                <span>Wholesale Rice Broker</span>
              </div>
              <div className="flex items-center gap-2 p-2 rounded-lg bg-white border border-neutral-200/90 shadow-2xs">
                <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
                <span>Bulk Rice Supplier</span>
              </div>
              <div className="flex items-center gap-2 p-2 rounded-lg bg-white border border-neutral-200/90 shadow-2xs">
                <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
                <span>Future Rice Trading Desk</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-3">
              <button
                onClick={() => onOpenQuoteModal()}
                className="px-6 py-3.5 rounded-xl bg-emerald-900 hover:bg-emerald-950 text-white font-semibold text-sm shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 active:scale-95 cursor-pointer"
              >
                <Sparkles className="w-4 h-4 text-amber-300" />
                <span>Request Wholesale Rice Quote</span>
              </button>

              <button
                onClick={() => onOpenSampleModal()}
                className="px-6 py-3.5 rounded-xl bg-white hover:bg-neutral-50 text-neutral-900 border border-neutral-300 font-semibold text-sm transition-all flex items-center justify-center gap-2 shadow-2xs cursor-pointer"
              >
                <span>Order Physical Sample</span>
                <ArrowRight className="w-4 h-4 text-neutral-500" />
              </button>

              <a
                href="https://wa.me/923338990883?text=Assalam-o-Alaikum%20Hashir%20Rice,%20I%20want%20to%20inquire%20about%20bulk%20wholesale%20rates%20and%20brokerage."
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-3.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-900 font-semibold text-sm border border-emerald-300 transition-all flex items-center justify-center gap-2"
              >
                <MessageCircle className="w-4 h-4 text-emerald-700 fill-emerald-600" />
                <span>WhatsApp (+92 333 8990883)</span>
              </a>
            </div>

            {/* Location quick snippet */}
            <div className="pt-2 flex items-center gap-2 text-xs text-neutral-600">
              <MapPin className="w-3.5 h-3.5 text-emerald-800 shrink-0" />
              <span><strong>Noor Galla Mandi, Bucheki (Punjab):</strong> Direct Rice Supplier &amp; Rice Wholesale Dealer with daily Bilty to Lahore, Karachi, Rawalpindi, Islamabad, Faisalabad, Peshawar, Quetta &amp; 60+ Cities</span>
            </div>
          </div>

          {/* Right Hero Column: Premium Interactive Product & Hashir Rice Packaging Bags Showcase */}
          <div className="lg:col-span-5 relative">
            <div className="relative mx-auto max-w-md lg:max-w-none">
              {/* Main Visual Image Card with Hashir Rice Bags */}
              <div className="rounded-2xl overflow-hidden shadow-2xl border border-neutral-200/90 bg-white group">
                <div className="relative h-72 sm:h-80 overflow-hidden bg-stone-100">
                  <img
                    src="/hashir_rice_bags.jpg"
                    alt="Hashir Rice 50kg and 25kg Wholesale Rice Bags Packaging - Noor Galla Mandi Bucheki"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    loading="eager"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent" />
                  
                  {/* Floating Grain Spec Badge */}
                  <div className="absolute top-4 left-4 bg-white/95 backdrop-blur-md px-3 py-1.5 rounded-lg shadow-md border border-neutral-200 text-xs">
                    <span className="font-bold text-emerald-950 block">Hashir Rice Bags</span>
                    <span className="text-[11px] text-neutral-600">50 KG &amp; 25 KG Woven Packaging</span>
                  </div>

                  <div className="absolute top-4 right-4 bg-emerald-900/90 text-amber-300 text-xs px-2.5 py-1 rounded-md font-semibold backdrop-blur-xs">
                    Lab Verified Lot
                  </div>

                  <div className="absolute bottom-4 left-4 right-4 text-white">
                    <div className="text-xs font-semibold uppercase tracking-wider text-amber-300 mb-1">
                      Direct Mill &amp; Mandi Brokerage Desk
                    </div>
                    <div className="text-base font-bold font-serif leading-tight">
                      Hashir Rice Supreme Basmati &amp; Kainat
                    </div>
                    <p className="text-[11px] text-emerald-100 mt-0.5">Double-stitched woven bags • Moisture &lt;12.0% • 100% Buhler Sortex</p>
                  </div>
                </div>

                {/* Sourcing Summary Metric Grid */}
                <div className="p-4 bg-neutral-50 grid grid-cols-3 gap-2.5 border-t border-neutral-200 text-center">
                  <div className="p-2 bg-white rounded-lg border border-neutral-200">
                    <div className="text-[10px] text-neutral-500 uppercase font-semibold">MOQ</div>
                    <div className="text-sm font-bold text-neutral-900">100 Bags</div>
                    <div className="text-[10px] text-emerald-700 font-medium">5 Metric Tons</div>
                  </div>
                  <div className="p-2 bg-white rounded-lg border border-neutral-200">
                    <div className="text-[10px] text-neutral-500 uppercase font-semibold">Packaging</div>
                    <div className="text-sm font-bold text-neutral-900">50kg / 25kg</div>
                    <div className="text-[10px] text-emerald-700 font-medium">Hashir Rice Bags</div>
                  </div>
                  <div className="p-2 bg-white rounded-lg border border-neutral-200">
                    <div className="text-[10px] text-neutral-500 uppercase font-semibold">Dispatch</div>
                    <div className="text-sm font-bold text-neutral-900">24–48 Hrs</div>
                    <div className="text-[10px] text-emerald-700 font-medium">Nationwide Bilty</div>
                  </div>
                </div>

                {/* Bottom interactive card banner */}
                <div className="p-3.5 bg-emerald-50 text-neutral-900 border-t border-emerald-200 flex items-center justify-between text-xs">
                  <div>
                    <span className="font-semibold text-neutral-950 block">Need testing samples before purchase?</span>
                    <span className="text-emerald-900 text-[11px] font-medium">We courier sealed Hashir Rice cooking test lots</span>
                  </div>
                  <button
                    onClick={() => onOpenSampleModal()}
                    className="px-3 py-1.5 bg-emerald-900 hover:bg-emerald-950 text-white font-bold rounded-lg transition-colors shrink-0 shadow-2xs cursor-pointer"
                  >
                    Request Sample
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
