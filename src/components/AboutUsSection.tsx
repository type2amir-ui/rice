import React from 'react';
import { ShieldCheck, MapPin, Scale, Users, Award, CheckCircle2, MessageCircle, ExternalLink } from 'lucide-react';
import { BrandLogo } from './BrandLogo';

interface AboutUsSectionProps {
  onOpenQuoteModal: () => void;
  onOpenSampleModal: () => void;
}

export const AboutUsSection: React.FC<AboutUsSectionProps> = ({
  onOpenQuoteModal,
  onOpenSampleModal,
}) => {
  return (
    <section id="about-us" className="py-16 bg-white border-b border-neutral-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-14">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-emerald-100 text-emerald-900 text-xs font-bold uppercase tracking-wider mb-2">
            <ShieldCheck className="w-3.5 h-3.5" />
            Pakistani Rice Supplier Profile
          </div>
          <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-bold text-neutral-950 tracking-tight">
            About Hashir Rice Supplier: Wholesale Rice Supplier Pakistan
          </h2>
          <p className="mt-3 text-neutral-600 text-sm sm:text-base leading-relaxed">
            As a leading <strong>Wholesale Rice Trader Pakistan</strong> and verified <strong>Rice Merchant Pakistan</strong>, we connect grain merchants, hospitality chains, and food distributors with certified Punjab and Sindh rice mills on clear, commission-based terms.
          </p>
        </div>

        {/* 2-Column Story & Business Model */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          <div className="lg:col-span-6 space-y-4 text-xs sm:text-sm text-neutral-700 leading-relaxed">
            <h3 className="font-serif text-xl sm:text-2xl font-bold text-neutral-950">
              Your Trusted Rice Trading Company Pakistan in Punjab’s Prime Rice Bowl
            </h3>
            <p>
              Headquartered at <strong>Noor Galla Mandi, Bucheki (District Nankana Sahib, Punjab)</strong>, <strong>Hashir Rice Supplier</strong> operates at the geographic epicenter of Pakistan's historic <strong>Basmati Rice</strong> cultivation basin. As a premier <strong>Bulk Rice Supplier Pakistan</strong> and <strong>Wholesale Basmati Rice Supplier</strong>, we manage end-to-end sourcing from paddy auctions to final dispatch.
            </p>
            <p>
              We operate daily on the ground, monitoring mandi auctions, evaluating milling yields, and maintaining direct partnerships with over a dozen modern rice milling and Sortex processing facilities located throughout Nankana Sahib, Gujranwala, Hafizabad, Sheikhupura, and Sindh.
            </p>

            {/* Official Transparent Disclosure Box */}
            <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-200 text-emerald-950 space-y-2 text-xs">
              <div className="flex items-center gap-2 font-bold text-emerald-900">
                <ShieldCheck className="w-4 h-4 text-emerald-700" />
                <span>Our Clear Business Model Disclosure</span>
              </div>
              <p className="text-neutral-700 leading-normal">
                "Hashir Rice Supplier operates strictly as a rice sourcing and trading intermediary. We work with supplier partner mills to arrange rice according to buyer requirements. We are not a single rice manufacturer or mill owner. This independence guarantees that our advice is completely unbiased and our pricing is competitively benchmarked across the market."
              </p>
            </div>

            <div className="flex items-center gap-4 pt-2">
              <a
                href="https://share.google/Xog0BKr0oU1NiGIUL"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-900 hover:underline"
              >
                <span>View Google Business Profile</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>

          {/* Visual Highlight Card */}
          <div className="lg:col-span-6">
            <div className="bg-emerald-50/70 text-neutral-900 rounded-2xl p-6 sm:p-8 border border-emerald-200 shadow-sm space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-emerald-200">
                <div className="flex items-center gap-3">
                  <BrandLogo size="md" variant="image" className="shrink-0" />
                  <div>
                    <h4 className="font-serif font-bold text-base text-neutral-950">Our 4 Guiding Principles</h4>
                    <p className="text-[11px] text-emerald-900 font-medium">Quality • Trust • Commitment</p>
                  </div>
                </div>
              </div>

              <div className="space-y-4 text-xs">
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-neutral-950 block font-semibold">1. Sample-First Assurance:</strong>
                    <span className="text-neutral-600 leading-relaxed">
                      We never ask a client to purchase blind stock. Physical Free Samples are dispatched for kitchen daig approval.
                    </span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-neutral-950 block font-semibold">2. Unbiased Mill Selection:</strong>
                    <span className="text-neutral-600 leading-relaxed">
                      We compare real-time prices across multiple mills to secure the best lot without being forced to sell obsolete inventory.
                    </span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-neutral-950 block font-semibold">3. Loading Inspection:</strong>
                    <span className="text-neutral-600 leading-relaxed">
                      Our representative monitors the loading dock, inspecting stitch seals, moisture levels, and exact bag weight consistency.
                    </span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-neutral-950 block font-semibold">4. Transparent Commission:</strong>
                    <span className="text-neutral-600 leading-relaxed">
                      We work on a fixed, agreed brokerage fee with zero undisclosed markups or hidden fees.
                    </span>
                  </div>
                </div>
              </div>

              <div className="pt-2 flex items-center gap-3">
                <button
                  onClick={onOpenSampleModal}
                  className="flex-1 py-2.5 rounded-lg bg-white hover:bg-neutral-100 text-neutral-900 font-bold text-xs shadow-2xs border border-neutral-300 transition-colors"
                >
                  Request Sample
                </button>
                <button
                  onClick={onOpenQuoteModal}
                  className="flex-1 py-2.5 rounded-lg bg-emerald-900 hover:bg-emerald-950 text-white font-semibold text-xs transition-colors shadow-2xs"
                >
                  Get Quote
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
