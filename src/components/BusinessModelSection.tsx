import React from 'react';
import { ShieldCheck, CheckCircle2, XCircle, Search, Scale, Eye, RefreshCw, Truck, FileCheck, ArrowRight } from 'lucide-react';

interface BusinessModelSectionProps {
  onOpenQuoteModal: () => void;
  onOpenSampleModal: () => void;
}

export const BusinessModelSection: React.FC<BusinessModelSectionProps> = ({
  onOpenQuoteModal,
  onOpenSampleModal,
}) => {
  return (
    <section className="py-16 bg-white border-b border-neutral-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-emerald-100 text-emerald-900 text-xs font-bold uppercase tracking-wider mb-3">
            <ShieldCheck className="w-3.5 h-3.5" />
            Wholesale Rice Trader & Sourcing Broker Pakistan
          </div>
          <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-bold text-neutral-950 tracking-tight">
            Premier Rice Trading Company Pakistan & Wholesale Rice Dealer
          </h2>
          <p className="mt-3 text-neutral-600 text-sm sm:text-base leading-relaxed">
            As an established <strong>Rice Trader in Pakistan</strong>, <strong>Rice Wholesaler Pakistan</strong>, and commercial <strong>Rice Distributor Pakistan</strong>, <strong>Hashir Rice Supplier</strong> acts as your strategic sourcing partner. We connect buyers to top Punjab and Sindh rice mills with multi-mill price leverage, sample validation, and transparent brokerage.
          </p>
        </div>

        {/* 4 Core Pillars of the Sourcing Intermediary Model */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <div className="p-6 rounded-xl bg-neutral-50 border border-neutral-200/90 hover:border-emerald-700/50 transition-all group">
            <div className="w-12 h-12 rounded-lg bg-emerald-900 text-amber-300 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform shadow-xs">
              <Search className="w-6 h-6" />
            </div>
            <h3 className="font-serif text-lg font-bold text-neutral-900 mb-2">1. Requirement-Driven Matching</h3>
            <p className="text-xs text-neutral-600 leading-relaxed">
              We analyze your exact target cooking length, moisture %, aroma grade, and price ceiling before filtering our partner network for the best matching batch.
            </p>
          </div>

          <div className="p-6 rounded-xl bg-neutral-50 border border-neutral-200/90 hover:border-emerald-700/50 transition-all group">
            <div className="w-12 h-12 rounded-lg bg-emerald-900 text-amber-300 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform shadow-xs">
              <Scale className="w-6 h-6" />
            </div>
            <h3 className="font-serif text-lg font-bold text-neutral-900 mb-2">2. Multi-Mill Price Leverage</h3>
            <p className="text-xs text-neutral-600 leading-relaxed">
              We negotiate transparent ex-mill prices across multiple Punjab and Sindh processing hubs, securing volume discounts no single buyer could achieve alone.
            </p>
          </div>

          <div className="p-6 rounded-xl bg-neutral-50 border border-neutral-200/90 hover:border-emerald-700/50 transition-all group">
            <div className="w-12 h-12 rounded-lg bg-emerald-900 text-amber-300 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform shadow-xs">
              <Eye className="w-6 h-6" />
            </div>
            <h3 className="font-serif text-lg font-bold text-neutral-900 mb-2">3. Unbiased Quality Inspection</h3>
            <p className="text-xs text-neutral-600 leading-relaxed">
              We physically verify that the rice loaded in trucks precisely matches your approved sample seal for grain length, polish, and moisture before dispatch.
            </p>
          </div>

          <div className="p-6 rounded-xl bg-neutral-50 border border-neutral-200/90 hover:border-emerald-700/50 transition-all group">
            <div className="w-12 h-12 rounded-lg bg-emerald-900 text-amber-300 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform shadow-xs">
              <Truck className="w-6 h-6" />
            </div>
            <h3 className="font-serif text-lg font-bold text-neutral-900 mb-2">4. Full Logistics Coordination</h3>
            <p className="text-xs text-neutral-600 leading-relaxed">
              From loading dock tarpaulins to transport bilty tracking and gate pass issuance, we handle transit logistics right up to your warehouse gates.
            </p>
          </div>
        </div>

        {/* Direct Mill vs Hashir Rice Sourcing Comparison Matrix */}
        <div className="bg-white text-neutral-900 rounded-2xl p-6 sm:p-8 border border-neutral-200 shadow-md">
          <div className="mb-6 text-center sm:text-left">
            <h3 className="font-serif text-xl sm:text-2xl font-bold text-emerald-950">
              Direct Single-Mill Buying vs. Hashir Rice Supplier (Rice Merchant & Broker Pakistan)
            </h3>
            <p className="text-xs sm:text-sm text-neutral-600 mt-1">
              Why commercial rice buyers, restaurant chains, and bulk rice wholesalers choose our brokerage intermediary model.
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse min-w-[600px]">
              <thead>
                <tr className="border-b border-neutral-200 text-neutral-500 uppercase text-[11px]">
                  <th className="py-3 px-4">Feature / Sourcing Aspect</th>
                  <th className="py-3 px-4 text-rose-700">Buying From Single Mill Alone</th>
                  <th className="py-3 px-4 text-emerald-900 font-bold bg-emerald-50 rounded-t-lg border border-b-0 border-emerald-200">
                    With Hashir Rice Supplier (Wholesale Rice Broker)
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-200 text-neutral-700">
                <tr>
                  <td className="py-3.5 px-4 font-semibold text-neutral-950">Variety Selection</td>
                  <td className="py-3.5 px-4 text-neutral-600">Limited only to what that specific mill is milling this month.</td>
                  <td className="py-3.5 px-4 text-emerald-950 font-medium bg-emerald-50/50 border-x border-emerald-200">
                    Unrestricted access to 10+ Basmati, 1121 Steam, 1121 Sella, Super Kernel, PK-386 & IRRI varieties.
                  </td>
                </tr>
                <tr>
                  <td className="py-3.5 px-4 font-semibold text-neutral-950">Quality Guarantee</td>
                  <td className="py-3.5 px-4 text-neutral-600">Mill inspects its own product (inherent conflict of interest).</td>
                  <td className="py-3.5 px-4 text-emerald-950 font-medium bg-emerald-50/50 border-x border-emerald-200">
                    Independent sample sealing & physical loading check on buyer's behalf.
                  </td>
                </tr>
                <tr>
                  <td className="py-3.5 px-4 font-semibold text-neutral-950">Price Transparency</td>
                  <td className="py-3.5 px-4 text-neutral-600">Single quoted rate with no market comparison.</td>
                  <td className="py-3.5 px-4 text-emerald-950 font-medium bg-emerald-50/50 border-x border-emerald-200">
                    Real-time mandi rates compared across competitive mills with fixed commission.
                  </td>
                </tr>
                <tr>
                  <td className="py-3.5 px-4 font-semibold text-neutral-950">Supply Continuity</td>
                  <td className="py-3.5 px-4 text-neutral-600">If mill halts for maintenance, your supply chain stops.</td>
                  <td className="py-3.5 px-4 text-emerald-950 font-medium bg-emerald-50/50 border-x border-emerald-200">
                    Seamless backup milling capacity guarantees uninterrupted weekly supply.
                  </td>
                </tr>
                <tr>
                  <td className="py-3.5 px-4 font-semibold text-neutral-950">Physical Sampling</td>
                  <td className="py-3.5 px-4 text-neutral-600">Often difficult or slow to arrange for non-local buyers.</td>
                  <td className="py-3.5 px-4 text-emerald-950 font-medium bg-emerald-50/50 border-x border-b border-emerald-200 rounded-b-lg">
                    Fast courier dispatch of Free Sample to any city in Pakistan.
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Bottom CTAs */}
          <div className="mt-8 pt-6 border-t border-neutral-200 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-xs text-neutral-600 text-center sm:text-left">
              <span className="text-emerald-900 font-bold">Transparent Disclosure:</span> We earn a standard, agreed commission per bag/ton for facilitating the entire transaction.
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={onOpenSampleModal}
                className="px-4 py-2 rounded-lg bg-neutral-100 hover:bg-neutral-200 text-neutral-800 font-semibold text-xs transition-colors border border-neutral-200"
              >
                Request Sample First
              </button>
              <button
                onClick={onOpenQuoteModal}
                className="px-4 py-2 rounded-lg bg-emerald-900 hover:bg-emerald-950 text-white font-bold text-xs shadow-sm transition-colors"
              >
                Get Sourcing Quote
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
