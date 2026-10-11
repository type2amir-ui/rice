import React from 'react';
import { BrandLogo } from './BrandLogo';
import { GoogleBusinessMap } from './GoogleBusinessMap';
import {
  ShieldCheck,
  MapPin,
  Scale,
  Users,
  Award,
  CheckCircle2,
  MessageCircle,
  ExternalLink,
  ArrowRight,
  Sparkles,
  Building2,
  Truck,
  TrendingUp,
  Flame,
  Check
} from 'lucide-react';

interface AboutUsPageProps {
  onOpenQuoteModal: () => void;
  onOpenSampleModal: () => void;
  onSelectCity?: (citySlug: string) => void;
  setCurrentView: (view: string) => void;
}

export const AboutUsPage: React.FC<AboutUsPageProps> = ({
  onOpenQuoteModal,
  onOpenSampleModal,
  setCurrentView,
}) => {
  return (
    <div className="bg-white min-h-screen">
      {/* Hero / Header Banner */}
      <section className="bg-gradient-to-b from-neutral-900 via-emerald-950 to-neutral-900 text-white py-16 sm:py-20 relative overflow-hidden border-b border-emerald-800/40">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#10b981_1px,transparent_1px)] [background-size:16px_16px]"></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-6 text-center">
          <div className="flex justify-center">
            <BrandLogo size="xl" variant="image" className="shadow-xl" />
          </div>

          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-900/80 text-emerald-300 text-xs font-bold uppercase tracking-wider border border-emerald-700/50 shadow-inner">
            <Building2 className="w-3.5 h-3.5 text-amber-400" />
            <span>Company Profile & Sourcing Authority</span>
          </div>

          <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-white max-w-4xl mx-auto leading-tight">
            About Hashir Rice Supplier
            <span className="block text-amber-400 text-xl sm:text-2xl lg:text-3xl font-sans font-normal mt-2">
              Independent Wholesale Rice Sourcing &amp; Brokerage Desk (Bucheki, Nankana Sahib)
            </span>
          </h1>

          <p className="max-w-3xl mx-auto text-neutral-300 text-sm sm:text-base leading-relaxed">
            Headquartered at the historic grain crossroads of <strong>Noor Galla Mandi, Bucheki (District Nankana Sahib, Punjab)</strong>, Hashir Rice Supplier connects commercial grain merchants, catering houses, and food processors with certified Punjab and Sindh rice mills under transparent, commission-based terms.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3 pt-4">
            <button
              onClick={onOpenQuoteModal}
              className="px-6 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold text-sm shadow-md transition-all active:scale-[0.98]"
            >
              Request Bulk Rate Quote
            </button>
            <button
              onClick={onOpenSampleModal}
              className="px-6 py-3 rounded-xl bg-emerald-900/90 hover:bg-emerald-800 text-white font-semibold text-sm border border-emerald-600 transition-all"
            >
              Order Free Cooking Sample
            </button>
            <a
              href="https://share.google/Xog0BKr0oU1NiGIUL"
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-3 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-200 font-medium text-sm border border-neutral-700 inline-flex items-center gap-1.5 transition-all"
            >
              <span>Verified Google Profile</span>
              <ExternalLink className="w-3.5 h-3.5 text-neutral-400" />
            </a>
          </div>
        </div>
      </section>

      {/* Key Numbers / Trust Bar */}
      <section className="bg-emerald-900 text-white py-8 border-b border-emerald-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center divide-y md:divide-y-0 md:divide-x divide-emerald-800/80">
            <div className="pt-3 md:pt-0">
              <span className="font-serif text-2xl sm:text-3xl font-bold text-amber-300 block">60+ Cities</span>
              <span className="text-xs text-emerald-100 uppercase tracking-wider font-medium">Nationwide Freight Reach</span>
            </div>
            <div className="pt-3 md:pt-0">
              <span className="font-serif text-2xl sm:text-3xl font-bold text-amber-300 block">15+ Partner Mills</span>
              <span className="text-xs text-emerald-100 uppercase tracking-wider font-medium">Sortex-Certified Processing</span>
            </div>
            <div className="pt-3 md:pt-0">
              <span className="font-serif text-2xl sm:text-3xl font-bold text-amber-300 block">100% Blind-Test Free</span>
              <span className="text-xs text-emerald-100 uppercase tracking-wider font-medium">Free Physical Sample Lots</span>
            </div>
            <div className="pt-3 md:pt-0">
              <span className="font-serif text-2xl sm:text-3xl font-bold text-amber-300 block">4.9 / 5.0</span>
              <span className="text-xs text-emerald-100 uppercase tracking-wider font-medium">Verified Mandi Rating</span>
            </div>
          </div>
        </div>
      </section>

      {/* Main Narrative & Origins */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
          {/* Section 1: Geographic Origin in the Basmati Heart of Punjab */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            <div className="lg:col-span-7 space-y-5 text-neutral-700 text-sm sm:text-base leading-relaxed">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 text-emerald-900 text-xs font-bold uppercase tracking-wider border border-emerald-200">
                <MapPin className="w-3.5 h-3.5 text-emerald-700" />
                <span>Geographic Heritage</span>
              </div>
              <h2 className="font-serif text-2xl sm:text-3xl font-bold text-neutral-950">
                Born in the Geographic Epicenter of Punjab’s Rice Heartland
              </h2>
              <p>
                The Punjab plains between the Ravi and Chenab rivers, spanning Nankana Sahib, Hafizabad, Sheikhupura, and Gujranwala, are globally celebrated for yielding the finest long-grain fragrant rice varieties on Earth. The mineral-rich alluvial soil, glacial river waters, and cool autumn winds create ideal micro-climates for cultivating authentic <strong>Super Kernel Basmati</strong>, <strong>1121 Kainat</strong>, and <strong>PK-386</strong>.
              </p>
              <p>
                From our strategic desk at <strong>Noor Galla Mandi, Bucheki</strong>, Hashir Rice Supplier maintains daily ground presence across these historic trading yards. We monitor paddy arrivals, track moisture variances, evaluate milling yield percentages, and source directly from modern milling clusters equipped with multi-stage Buhler & Satake optical Sortex machinery.
              </p>
            </div>

            <div className="lg:col-span-5 bg-neutral-50 p-6 sm:p-8 rounded-2xl border border-neutral-200 shadow-2xs space-y-4">
              <h3 className="font-serif text-lg font-bold text-neutral-950 border-b border-neutral-200 pb-3 flex items-center gap-2">
                <Building2 className="w-5 h-5 text-emerald-800" />
                <span>Trade Desk Quick Facts</span>
              </h3>
              <ul className="space-y-3 text-xs text-neutral-700">
                <li className="flex items-start gap-2.5">
                  <Check className="w-4 h-4 text-emerald-750 shrink-0 mt-0.5" />
                  <span><strong>Physical Office:</strong> Noor Galla Mandi, Bucheki, District Nankana Sahib, Punjab, Pakistan.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <Check className="w-4 h-4 text-emerald-750 shrink-0 mt-0.5" />
                  <span><strong>Primary Role:</strong> B2B Rice Sourcing Intermediary, Mandi Commission Agent, and Commercial Bulk Broker.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <Check className="w-4 h-4 text-emerald-750 shrink-0 mt-0.5" />
                  <span><strong>Varieties Handled:</strong> 1121 Kainat (Steam & Sella), Super Kernel Basmati (Aged & Fresh), IRRI-6, IRRI-9, PK-386, Basmati Broken (Tota/Kani).</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <Check className="w-4 h-4 text-emerald-750 shrink-0 mt-0.5" />
                  <span><strong>Packaging Options:</strong> 25kg & 50kg PP, Non-Woven, Jute, BOPP laminated customized buyer branding.</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Section 2: Transparent Business Model */}
          <div className="p-8 sm:p-10 bg-emerald-50/70 rounded-2xl border border-emerald-200 shadow-2xs space-y-6">
            <div className="max-w-3xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-200/70 text-emerald-950 text-xs font-bold uppercase tracking-wider mb-3">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-900" />
                <span>Transparent Brokerage Disclosure</span>
              </div>
              <h2 className="font-serif text-2xl sm:text-3xl font-bold text-neutral-950">
                Why Operating as a Sourcing Intermediary Protects the Buyer
              </h2>
              <p className="mt-3 text-xs sm:text-sm text-neutral-700 leading-relaxed">
                Unlike a single rice mill that is obligated to sell its own aging or off-spec inventory regardless of quality, <strong>Hashir Rice Supplier operates with absolute supplier independence</strong>. We do not claim ownership of a single mill; instead, we act as the buyer’s dedicated advocate on the ground.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
              <div className="bg-white p-5 rounded-xl border border-emerald-200 shadow-2xs space-y-2.5">
                <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-900 flex items-center justify-center font-bold text-sm">
                  01
                </div>
                <h3 className="font-serif font-bold text-neutral-950 text-sm">Unbiased Mill Selection</h3>
                <p className="text-xs text-neutral-600 leading-relaxed">
                  We compare active daily run lots across 15+ partner mills to secure the lowest rate and highest grain specs for your budget.
                </p>
              </div>

              <div className="bg-white p-5 rounded-xl border border-emerald-200 shadow-2xs space-y-2.5">
                <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-900 flex items-center justify-center font-bold text-sm">
                  02
                </div>
                <h3 className="font-serif font-bold text-neutral-950 text-sm">Pre-Loading Quality Audits</h3>
                <p className="text-xs text-neutral-600 leading-relaxed">
                  Our quality auditor physically tests grain moisture, broken percentage, and average grain length (AGL) right before bag sealing.
                </p>
              </div>

              <div className="bg-white p-5 rounded-xl border border-emerald-200 shadow-2xs space-y-2.5">
                <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-900 flex items-center justify-center font-bold text-sm">
                  03
                </div>
                <h3 className="font-serif font-bold text-neutral-950 text-sm">Zero Hidden Markups</h3>
                <p className="text-xs text-neutral-600 leading-relaxed">
                  Clear, agreed brokerage commission structure with transparent freight bills and genuine mill purchase receipts.
                </p>
              </div>
            </div>
          </div>

          {/* Section 3: Our 4-Pillar Quality Assurance Standard */}
          <div className="space-y-8">
            <div className="text-center max-w-2xl mx-auto">
              <h2 className="font-serif text-2xl sm:text-3xl font-bold text-neutral-950">
                Rigorous Quality Verification Protocol
              </h2>
              <p className="mt-2 text-neutral-600 text-xs sm:text-sm">
                Every commercial consignment dispatched through Hashir Rice Supplier undergoes a 4-pillar technical audit:
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="p-5 rounded-xl bg-neutral-50 border border-neutral-200 space-y-3">
                <Scale className="w-6 h-6 text-emerald-800" />
                <h3 className="font-serif font-bold text-neutral-950 text-sm">1. Grain Caliper Measurement</h3>
                <p className="text-xs text-neutral-600 leading-relaxed">
                  Precise measurement of raw grain length (e.g., 8.35mm for 1121 Kainat) and verification of 2x+ cooked elongation ratio.
                </p>
              </div>

              <div className="p-5 rounded-xl bg-neutral-50 border border-neutral-200 space-y-3">
                <Award className="w-6 h-6 text-emerald-800" />
                <h3 className="font-serif font-bold text-neutral-950 text-sm">2. Digital Moisture Testing</h3>
                <p className="text-xs text-neutral-600 leading-relaxed">
                  Calibration via Kett grain moisture meters ensuring ≤12.5% max moisture to prevent warehouse mold or condensation spoilage.
                </p>
              </div>

              <div className="p-5 rounded-xl bg-neutral-50 border border-neutral-200 space-y-3">
                <Flame className="w-6 h-6 text-emerald-800" />
                <h3 className="font-serif font-bold text-neutral-950 text-sm">3. Commercial Daig Cooking Test</h3>
                <p className="text-xs text-neutral-600 leading-relaxed">
                  Practical cooking trial replicating commercial biryani and pulao cooking conditions to test grain separation and aroma release.
                </p>
              </div>

              <div className="p-5 rounded-xl bg-neutral-50 border border-neutral-200 space-y-3">
                <Truck className="w-6 h-6 text-emerald-800" />
                <h3 className="font-serif font-bold text-neutral-950 text-sm">4. Weighbridge & Seal Audit</h3>
                <p className="text-xs text-neutral-600 leading-relaxed">
                  Double weighbridge verification at the mill and bilty documentation checks for exact gross and tare weights.
                </p>
              </div>
            </div>
          </div>

          {/* Dedicated Section: Hashir Rice Bags & Primary Business Capabilities */}
          <div className="bg-stone-50 rounded-2xl p-8 sm:p-10 border border-stone-200 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-5">
              <div className="rounded-xl overflow-hidden border border-stone-200 shadow-md">
                <img
                  src="/hashir_rice_bags.jpg"
                  alt="Hashir Rice 50kg Supreme Basmati and 25kg Kainat Wholesale Rice Bags Packaging"
                  className="w-full h-64 sm:h-72 object-cover"
                  loading="lazy"
                />
              </div>
              <p className="text-[11px] text-stone-500 text-center mt-2 font-medium">
                Authentic 50kg and 25kg Hashir Rice commercial bags photographed at Noor Galla Mandi Bucheki warehouse.
              </p>
            </div>
            <div className="lg:col-span-7 space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 text-emerald-900 text-xs font-bold uppercase tracking-wider">
                <span>🌾</span>
                <span>Our Core Identity &amp; Industry Scope</span>
              </div>
              <h2 className="font-serif text-2xl sm:text-3xl font-bold text-neutral-950">
                Rice Supplier, Rice Broker, Bulk Supplier &amp; Future Trading Desk
              </h2>
              <p className="text-stone-700 text-xs sm:text-sm leading-relaxed">
                Our business is built upon four interconnected commercial pillars designed to serve every tier of the Pakistani rice value chain:
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="p-3 bg-white rounded-lg border border-stone-200 shadow-2xs">
                  <strong className="text-emerald-950 block font-bold mb-1">1. Rice Supplier &amp; Wholesale Suppliers:</strong>
                  <span className="text-stone-600">Supplying premium 50kg and 25kg branded <strong>Hashir Rice</strong> woven bags directly to restaurants, banquet caterers, institutions, and wholesale grain stockists.</span>
                </div>
                <div className="p-3 bg-white rounded-lg border border-stone-200 shadow-2xs">
                  <strong className="text-emerald-950 block font-bold mb-1">2. Rice Broker &amp; Wholesale Rice Broker:</strong>
                  <span className="text-stone-600">Representing buyers with transparent 0.5% to 1% mandi commission, negotiating true ex-mill prices across 15+ Bucheki, Hafizabad, and Kamoke shellers.</span>
                </div>
                <div className="p-3 bg-white rounded-lg border border-stone-200 shadow-2xs">
                  <strong className="text-emerald-950 block font-bold mb-1">3. Bulk Rice Supplier &amp; Wholesale Dealer:</strong>
                  <span className="text-stone-600">Handling 10-ton Mazda to 40-ton multi-axle trailer consignments with computerized weighbridge tare slips and 24 to 48 hour nationwide Bilty dispatch.</span>
                </div>
                <div className="p-3 bg-white rounded-lg border border-stone-200 shadow-2xs">
                  <strong className="text-emerald-950 block font-bold mb-1">4. Future Commodity Rice Trading:</strong>
                  <span className="text-stone-600">Expanding into structured commodity mercantile trading, digital warehouse warrants, and seasonal forward hedging for exporters and commercial buyers.</span>
                </div>
              </div>
            </div>
          </div>

          {/* Section 4: Who We Serve Across Pakistan */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center bg-neutral-900 text-white rounded-2xl p-8 sm:p-12 overflow-hidden relative">
            <div className="lg:col-span-8 space-y-4">
              <span className="text-amber-400 text-xs uppercase font-bold tracking-wider block">
                Serving Diverse Industry Verticals
              </span>
              <h2 className="font-serif text-2xl sm:text-3xl font-bold text-white">
                Trusted by Grain Wholesalers, Exporters & Hospitality Leaders
              </h2>
              <p className="text-neutral-300 text-xs sm:text-sm leading-relaxed">
                Whether you need a single 20-ton trailer for wholesale distribution in Karachi's Jodia Bazaar, regular weekly 1121 Steam supply for catering networks in Islamabad, or containerized lots for export shipping, our trade desk delivers guaranteed consistency lot after lot.
              </p>
              <div className="flex flex-wrap gap-4 pt-2">
                <button
                  onClick={() => setCurrentView('varieties')}
                  className="px-5 py-2.5 rounded-lg bg-emerald-700 hover:bg-emerald-600 text-white font-bold text-xs shadow-xs transition-colors cursor-pointer"
                >
                  Explore Rice Varieties
                </button>
                <button
                  onClick={() => setCurrentView('locations')}
                  className="px-5 py-2.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-200 font-semibold text-xs border border-neutral-700 transition-colors cursor-pointer"
                >
                  View Delivery Network (60+ Cities)
                </button>
              </div>
            </div>

            <div className="lg:col-span-4 bg-neutral-800/90 p-6 rounded-xl border border-neutral-700 text-xs space-y-3">
              <span className="font-bold text-neutral-200 uppercase tracking-wider block text-[11px]">
                Direct Desk Assistance
              </span>
              <p className="text-neutral-400">
                Speak directly with our senior trade brokers at Noor Galla Mandi for live rates, lot evaluations, or sampling schedules.
              </p>
              <div className="flex flex-col gap-2 pt-1">
                <a
                  href="https://wa.me/923338990883?text=Hello%20Hashir%20Rice%20Supplier,%20I%20want%20to%20learn%20more%20about%20your%20sourcing%20services."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-2.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold flex items-center justify-center gap-2 transition-colors cursor-pointer"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Desk 1: +92 333 8990883</span>
                </a>
                <a
                  href="https://wa.me/923002861297?text=Hello%20Hashir%20Rice%20Supplier,%20I%20want%20to%20learn%20more%20about%20your%20sourcing%20services."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-2.5 rounded-lg bg-emerald-700 hover:bg-emerald-600 text-white font-bold flex items-center justify-center gap-2 transition-colors cursor-pointer"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Desk 2: +92 300 2861297</span>
                </a>
              </div>
            </div>
          </div>

          {/* Section 5: Physical Sourcing Office Location & Google My Business Map */}
          <div className="space-y-4">
            <GoogleBusinessMap
              cityName="Bucheki"
              province="Punjab"
              customHeading="Amir Rice Trader – Noor Galla Mandi, Bucheki"
              customSubheading="Official Verified Google Business Profile & Wholesale Commission Trading Desk"
              height="340px"
            />
          </div>
        </div>
      </section>
    </div>
  );
};
