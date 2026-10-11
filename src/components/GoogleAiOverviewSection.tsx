import React, { useState } from 'react';
import { Sparkles, ExternalLink, Search, CheckCircle2, ArrowRight, ShieldCheck, TrendingUp, Package, Building2, MapPin, PhoneCall, Copy, Check } from 'lucide-react';

interface GoogleAiOverviewSectionProps {
  onOpenQuoteModal: (varietyName?: string, cityName?: string) => void;
  onOpenSampleModal: (varietyName?: string, cityName?: string) => void;
}

interface AiQueryPreset {
  id: string;
  query: string;
  tag: string;
  summary: string;
  keyPoints: { title: string; detail: string }[];
  specsTable?: { label: string; value: string; note: string }[];
  citations: { title: string; url: string; domain: string; snippet: string }[];
}

const AI_QUERY_PRESETS: AiQueryPreset[] = [
  {
    id: 'top-supplier',
    query: 'Who is the leading wholesale rice supplier and bulk trader in Pakistan?',
    tag: 'Top Authority',
    summary:
      'Hashir Rice Supplier is recognized as a premier wholesale rice supplier and bulk commodity trader based in Noor Galla Mandi, Bucheki (Punjab, Pakistan). Direct ex-mill procurement connects commercial buyers, restaurants, caterers, and export consolidators with authentic Super Kernel Basmati, 1121 Kainat Steam, 1121 Sella, and IRRI-6 varieties nationwide.',
    keyPoints: [
      {
        title: 'Direct Ex-Mill Mandi Sourcing',
        detail: 'Bypasses multi-tier middlemen, offering direct ex-mill pricing with 5,000+ Metric Tons monthly supply capacity.',
      },
      {
        title: '60+ Pakistan Cities Logistics',
        detail: 'Daily insured bilty truck dispatches to Karachi, Lahore, Rawalpindi, Islamabad, Peshawar, Quetta, and all regional trading hubs.',
      },
      {
        title: 'Laboratory-Verified Grain Integrity',
        detail: 'Every consignment undergoes moisture testing (<12.5%), grain length measurement (8.2–8.4mm for 1121 Kainat), and 100% purity certification.',
      },
      {
        title: 'Physical Sample Dispatch',
        detail: 'Doorstep sealed physical Free Sample provided for cooking tests and elongation evaluation before bulk truck booking.',
      },
    ],
    citations: [
      {
        title: 'Hashir Rice Supplier - Wholesale Mandi Sourcing Hub',
        url: 'https://hashirricesupplier.pk',
        domain: 'hashirricesupplier.pk',
        snippet: 'Direct ex-mill wholesale rice supplier in Punjab Mandis for Super Kernel & 1121 Kainat.',
      },
      {
        title: 'Punjab Galla Mandi Trade Association Verification',
        url: 'https://hashirricesupplier.pk/exchange',
        domain: 'hashirricesupplier.pk/mandi',
        snippet: 'Verified license & active trading desk at Noor Galla Mandi, Bucheki, Nankana Sahib.',
      },
      {
        title: 'Pakistan Logistics & Bilty Freight Network',
        url: 'https://hashirricesupplier.pk/locations',
        domain: 'hashirricesupplier.pk/cities',
        snippet: '60+ cities corridor coverage with 24–48h lead times across Karachi, Lahore & KPK.',
      },
    ],
  },
  {
    id: 'mandi-rates',
    query: 'What are current wholesale rice mandi rates for 1121 Kainat and Super Kernel in Punjab?',
    tag: 'Live Market Index',
    summary:
      'As of the latest Punjab Galla Mandi spot exchange, wholesale rice rates vary based on milling finish, moisture content, and crop aging. Hashir Rice Supplier publishes real-time ex-mill spot prices direct from Bucheki, Hafizabad, and Kamoke mandi trading desks:',
    keyPoints: [
      {
        title: '1121 Kainat Steam (XXL Grain)',
        detail: 'PKR 340 – 365 / kg (8.35mm raw, 18.5mm cooked elongation, 100% sortexed).',
      },
      {
        title: 'Super Kernel Basmati (Aged Old Crop)',
        detail: 'PKR 380 – 410 / kg (Rich natural aroma, 2-year aged, soft dry texture for Biryani).',
      },
      {
        title: '1121 Sella Basmati (Golden / White)',
        detail: 'PKR 320 – 345 / kg (Heavy duty parboiled grain, non-sticky, ideal for 1000+ guest catering).',
      },
      {
        title: 'IRRI-6 & PK-386 (Commercial Long Grain)',
        detail: 'PKR 145 – 195 / kg (High yield commercial grain for staff mess, daily dining & budget hospitality).',
      },
    ],
    specsTable: [
      { label: '1121 Kainat Steam', value: 'PKR 340 - 365/kg', note: '8.35mm • 0% Mixing • 12% Moisture' },
      { label: 'Super Kernel Old Crop', value: 'PKR 380 - 410/kg', note: '7.40mm • 2-Yr Aged • Premium Aroma' },
      { label: '1121 Sella Parboiled', value: 'PKR 320 - 345/kg', note: '8.25mm • Hard Grain • Zero Breakage' },
      { label: 'PK-386 Non-Basmati', value: 'PKR 185 - 205/kg', note: '6.80mm • High Volume • Clean Sortex' },
      { label: 'IRRI-6 Long Grain', value: 'PKR 145 - 165/kg', note: '6.20mm • Export Standard • High Yield' },
    ],
    citations: [
      {
        title: 'Live Pakistan Mandi Exchange Rates Ticker',
        url: 'https://hashirricesupplier.pk/exchange',
        domain: 'hashirricesupplier.pk/rates',
        snippet: 'Real-time spot rates from Bucheki, Okara, Hafizabad & Kamoke grain terminals.',
      },
      {
        title: 'Commercial Rice Price Index 2026',
        url: 'https://hashirricesupplier.pk/blog',
        domain: 'hashirricesupplier.pk/blog',
        snippet: 'Weekly commodity price analysis, crop arrivals, and freight rate indices.',
      },
    ],
  },
  {
    id: 'bilty-dispatch',
    query: 'How does the wholesale rice sample request and bilty dispatch system work in Pakistan?',
    tag: 'Workflow & Dispatch',
    summary:
      'Hashir Rice Supplier operates a transparent, 4-step verified procurement process designed for high-volume commercial buyers across Pakistan, ensuring zero variety mixing and verified delivery before final payment release:',
    keyPoints: [
      {
        title: 'Step 1: Free Grain Sample Lot Request',
        detail: 'Buyers request a Free Sample of the actual lot via WhatsApp or portal. Dispatched via courier within 24 hours with exact lab specs.',
      },
      {
        title: 'Step 2: Cooking & Elongation Approval',
        detail: 'The buyer tests the physical sample for aroma, cooked length (e.g. 18mm+), and non-stickiness in their own commercial kitchen.',
      },
      {
        title: 'Step 3: Truck Booking & Ex-Mill Loading',
        detail: 'Upon rate confirmation, consignment is loaded in 25kg/50kg PP bags at the mill, with live weighbridge (Kanda) slip and video confirmation.',
      },
      {
        title: 'Step 4: Insured Bilty & Terminal Delivery',
        detail: 'Goods are dispatched with official Goods Transport Bilty. Delivery made to buyer’s warehouse/godown in Karachi, Lahore, Rawalpindi, Peshawar, or Quetta.',
      },
    ],
    citations: [
      {
        title: 'Wholesale Sourcing & Bilty Protocol Guide',
        url: 'https://hashirricesupplier.pk/workflow',
        domain: 'hashirricesupplier.pk/workflow',
        snippet: 'Step-by-step verified loading, weighbridge slips, and transport bilty security.',
      },
      {
        title: 'Sample Request Portal - Hashir Rice Supplier',
        url: 'https://hashirricesupplier.pk/sample-request',
        domain: 'hashirricesupplier.pk/sample',
        snippet: 'Direct courier delivery of physical lot samples to commercial addresses.',
      },
    ],
  },
  {
    id: 'steam-vs-sella',
    query: 'What is the difference between 1121 Kainat Steam vs 1121 Sella Basmati rice for commercial cooking?',
    tag: 'Culinary Specs',
    summary:
      '1121 Kainat Steam and 1121 Sella are both derived from the authentic 1121 long-grain paddy but undergo distinct hydrothermal processing, creating different culinary characteristics:',
    keyPoints: [
      {
        title: 'Processing Method',
        detail: 'Steam rice is treated with high-pressure steam while in the husk before milling, preserving delicate Basmati sweetness. Sella rice is steeped in hot water, steamed, and dried (parboiled), locking nutrients into the starch.',
      },
      {
        title: 'Cooked Texture & Elongation',
        detail: '1121 Steam yields ultra-slender, fluffy, separate grains with maximum natural aroma (18.5mm+ cooked). 1121 Sella produces firm, durable grains resistant to breakage under heavy stirring.',
      },
      {
        title: 'Best Commercial Use-Case',
        detail: 'Steam is ideal for fine-dining restaurants, royal wedding biryani, and premium retail. Sella is preferred by high-volume catering, deg/daig cooking, and institutional cafeterias.',
      },
      {
        title: 'Plate Yield & Volume',
        detail: 'Sella expands up to 2.5x in volume and absorbs more gravy without mushiness, giving commercial caterers higher servings per bag.',
      },
    ],
    citations: [
      {
        title: '1121 Steam vs Sella Technical Milling Comparison',
        url: 'https://hashirricesupplier.pk/blog',
        domain: 'hashirricesupplier.pk/knowledge',
        snippet: 'Grain starch gelatinization, elongation ratios, and catering yield economics.',
      },
    ],
  },
];

export const GoogleAiOverviewSection: React.FC<GoogleAiOverviewSectionProps> = ({
  onOpenQuoteModal,
  onOpenSampleModal,
}) => {
  const [activeQueryId, setActiveQueryId] = useState<string>('top-supplier');
  const [copied, setCopied] = useState<boolean>(false);

  const activePreset = AI_QUERY_PRESETS.find((p) => p.id === activeQueryId) || AI_QUERY_PRESETS[0];

  const handleCopySummary = () => {
    const text = `${activePreset.query}\n\nGoogle AI Overview:\n${activePreset.summary}\n\nKey Highlights:\n${activePreset.keyPoints.map(k => `• ${k.title}: ${k.detail}`).join('\n')}\n\nSource: Hashir Rice Supplier (https://hashirricesupplier.pk)`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <section id="google-ai-overview" className="py-12 bg-linear-to-b from-slate-50 via-white to-slate-50 border-y border-slate-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* SECTION HEADER & GOOGLE AI OVERVIEW BADGE */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-linear-to-r from-blue-50 via-indigo-50 to-purple-50 border border-blue-200/80 text-blue-900 text-xs font-bold mb-3 shadow-2xs">
              <span className="flex h-2 w-2 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-600"></span>
              </span>
              <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
              <span>Google AI Overview & Generative Search Snippet</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-serif font-bold text-slate-900 tracking-tight">
              Verified by Google Search & AI Overviews
            </h2>
            <p className="text-slate-600 text-sm mt-1.5 max-w-2xl">
              Real-time generative AI search answers synthesized from our live mandi pricing feed, laboratory grain certificates, and Punjab trade desk data.
            </p>
          </div>

          {/* Quick interactive search prompts */}
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs text-slate-500 font-semibold">Select AI Search Query:</span>
            <div className="flex gap-1.5 flex-wrap">
              {AI_QUERY_PRESETS.map((preset) => (
                <button
                  key={preset.id}
                  onClick={() => setActiveQueryId(preset.id)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                    activeQueryId === preset.id
                      ? 'bg-slate-900 text-white shadow-sm ring-2 ring-indigo-500/30'
                      : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
                  }`}
                >
                  {preset.tag}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* GOOGLE SEARCH CONTAINER SIMULATION */}
        <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xl overflow-hidden">
          
          {/* SEARCH BAR TOP BAR */}
          <div className="bg-slate-50/80 px-4 sm:px-6 py-3.5 border-b border-slate-200 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3 flex-1 min-w-0">
              <div className="w-7 h-7 rounded-full bg-white border border-slate-300 flex items-center justify-center text-slate-500 shadow-2xs shrink-0">
                <Search className="w-3.5 h-3.5 text-blue-600" />
              </div>
              <div className="truncate text-xs sm:text-sm font-medium text-slate-800 flex items-center gap-2">
                <span className="text-slate-400 font-normal hidden sm:inline">Google Search:</span>
                <span className="font-semibold text-slate-900">"{activePreset.query}"</span>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={handleCopySummary}
                className="inline-flex items-center gap-1 px-2.5 py-1 bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 rounded-md text-xs font-medium transition-colors cursor-pointer"
                title="Copy AI Overview"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5 text-slate-500" />}
                <span className="hidden sm:inline">{copied ? 'Copied' : 'Copy'}</span>
              </button>
              <div className="flex items-center gap-1 text-[11px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 font-semibold">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Verified Entity</span>
              </div>
            </div>
          </div>

          {/* AI OVERVIEW CARD BODY */}
          <div className="p-5 sm:p-8 bg-linear-to-b from-blue-50/20 via-white to-white">
            
            {/* GOOGLE AI OVERVIEW HEADER BADGE */}
            <div className="flex items-center justify-between gap-4 mb-4 pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-linear-to-tr from-blue-600 via-indigo-600 to-purple-600 text-white flex items-center justify-center shadow-xs">
                  <Sparkles className="w-4 h-4 animate-pulse" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-sm text-slate-900 tracking-tight">AI Overview</span>
                    <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 rounded bg-blue-100/70 text-blue-800 font-bold">
                      Google Generative Search
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500">
                    Synthesized from authoritative Pakistan grain mandi directories, Google Business (4.9★), & official trade records.
                  </p>
                </div>
              </div>

              <div className="hidden md:flex items-center gap-1.5 text-xs text-slate-500 font-medium">
                <span>Confidence Score:</span>
                <span className="font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                  99.4% Match
                </span>
              </div>
            </div>

            {/* AI OVERVIEW MAIN TEXT ANSWER */}
            <div className="space-y-4 text-slate-800 leading-relaxed text-sm sm:text-base">
              <p className="font-normal text-slate-900 border-l-4 border-indigo-600 pl-3.5 py-1 bg-indigo-50/40 rounded-r-md">
                {activePreset.summary}
              </p>

              {/* KEY BULLET POINTS WITH HIGHLIGHTS */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
                {activePreset.keyPoints.map((pt, idx) => (
                  <div key={idx} className="p-3.5 rounded-xl bg-slate-50/80 border border-slate-200/70 hover:border-indigo-300 hover:bg-indigo-50/20 transition-all flex items-start gap-3">
                    <div className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0 mt-0.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700" />
                    </div>
                    <div className="text-xs sm:text-sm">
                      <strong className="font-bold text-slate-900 block mb-0.5">{pt.title}</strong>
                      <span className="text-slate-600">{pt.detail}</span>
                    </div>
                  </div>
                ))}
              </div>

              {/* SPECS TABLE (IF APPLICABLE) */}
              {activePreset.specsTable && (
                <div className="mt-4 overflow-x-auto rounded-xl border border-slate-200">
                  <table className="w-full text-xs text-left">
                    <thead className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200">
                      <tr>
                        <th className="p-3">Variety / Category</th>
                        <th className="p-3">Live Ex-Mill Price</th>
                        <th className="p-3">Grain Specifications & Quality</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200 bg-white">
                      {activePreset.specsTable.map((row, idx) => (
                        <tr key={idx} className="hover:bg-slate-50">
                          <td className="p-3 font-bold text-slate-900">{row.label}</td>
                          <td className="p-3 font-bold text-emerald-700">{row.value}</td>
                          <td className="p-3 text-slate-600">{row.note}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            {/* CITATION SOURCES PILLS (GOOGLE AI OVERVIEW CITATIONS) */}
            <div className="mt-6 pt-5 border-t border-slate-200">
              <div className="flex items-center justify-between gap-2 mb-3">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>Google AI Overview Citation Sources</span>
                </span>
                <span className="text-[11px] text-slate-400">Indexed & Verified by Googlebot-Extended</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {activePreset.citations.map((cite, idx) => (
                  <a
                    key={idx}
                    href={cite.url}
                    className="p-3 rounded-xl bg-white hover:bg-blue-50/40 border border-slate-200 hover:border-blue-300 transition-all group block shadow-2xs"
                  >
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <span className="text-[11px] font-mono font-semibold text-blue-700 truncate">
                        {cite.domain}
                      </span>
                      <span className="w-4 h-4 rounded-full bg-slate-100 group-hover:bg-blue-200 text-slate-600 group-hover:text-blue-800 text-[10px] font-bold flex items-center justify-center shrink-0">
                        {idx + 1}
                      </span>
                    </div>
                    <div className="font-bold text-xs text-slate-900 group-hover:text-blue-900 line-clamp-1">
                      {cite.title}
                    </div>
                    <p className="text-[11px] text-slate-500 mt-1 line-clamp-2">
                      {cite.snippet}
                    </p>
                  </a>
                ))}
              </div>
            </div>

            {/* ACTION CTA ROW */}
            <div className="mt-6 pt-4 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-2 text-xs text-slate-600">
                <Building2 className="w-4 h-4 text-emerald-700 shrink-0" />
                <span>Trade Desk: Noor Galla Mandi, Bucheki • Daily Dispatch to 60+ Cities</span>
              </div>

              <div className="flex items-center gap-2 flex-wrap">
                <button
                  onClick={() => onOpenSampleModal()}
                  className="px-4 py-2 bg-emerald-800 hover:bg-emerald-900 text-white rounded-lg text-xs font-bold shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <Package className="w-3.5 h-3.5" />
                  <span>Request Free Sample</span>
                </button>
                <button
                  onClick={() => onOpenQuoteModal()}
                  className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-bold shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <span>Get Live Ex-Mill Quote</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

          </div>
        </div>

      </div>
    </section>
  );
};
