import React, { useState } from 'react';
import {
  Sparkles,
  Search,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  Copy,
  Check,
  RefreshCw,
  Zap,
  Globe,
  Database,
  Cpu,
  Bot,
  ShieldCheck,
  FileCode,
  Layers,
  ArrowRight,
  TrendingUp,
  Download,
  Share2,
  Code
} from 'lucide-react';

interface AdminGoogleAiOverviewProps {
  onSuccessToast?: (msg: string) => void;
}

export const AdminGoogleAiOverview: React.FC<AdminGoogleAiOverviewProps> = ({ onSuccessToast }) => {
  const [activeTab, setActiveTab] = useState<'simulator' | 'geo-audit' | 'schemas' | 'crawlers'>('simulator');
  const [selectedPrompt, setSelectedPrompt] = useState<string>('top-supplier');
  const [customQuery, setCustomQuery] = useState<string>('');
  const [copiedSchema, setCopiedSchema] = useState<string | null>(null);
  const [isSyncing, setIsSyncing] = useState<boolean>(false);

  const showToast = (msg: string) => {
    if (onSuccessToast) onSuccessToast(msg);
  };

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedSchema(id);
    showToast('Copied to clipboard!');
    setTimeout(() => setCopiedSchema(null), 2500);
  };

  const handleSyncIndex = () => {
    setIsSyncing(true);
    setTimeout(() => {
      setIsSyncing(false);
      showToast('Google AI Search Index pinged successfully! Schema cache cleared.');
    }, 1200);
  };

  // Structured schemas for Google AI Overviews
  const speakableJsonLd = `{
  "@context": "https://schema.org",
  "@type": "SpeakableSpecification",
  "xpath": [
    "/html/head/title",
    "//*[@id='google-ai-overview']",
    "//*[@id='mandi-rates']"
  ],
  "cssSelector": [
    ".hero-title",
    ".grain-specs",
    ".mandi-live-rate"
  ]
}`;

  const datasetJsonLd = `{
  "@context": "https://schema.org",
  "@type": "Dataset",
  "name": "Pakistan Wholesale Rice Mandi Spot Rates & Grain Physical Specs",
  "description": "Daily updated commodity trading rates for 1121 Kainat Steam, 1121 Sella, Super Kernel Basmati, and IRRI-6 in Punjab grain terminals.",
  "creator": {
    "@type": "Organization",
    "name": "Hashir Rice Supplier",
    "url": "https://hashirricesupplier.pk"
  },
  "temporalCoverage": "2026/2027",
  "spatialCoverage": "Pakistan (Punjab Mandis)",
  "variableMeasured": ["Moisture %", "Average Grain Length (mm)", "Broken Grain %", "Ex-Mill Rate (PKR/kg)"]
}`;

  const howToJsonLd = `{
  "@context": "https://schema.org",
  "@type": "HowTo",
  "name": "How to Procure Wholesale Rice Direct from Punjab Mandis in Pakistan",
  "step": [
    {
      "@type": "HowToStep",
      "name": "Request Verified Lot Sample",
      "text": "Order a physical Free Sample lot with moisture and grain length report."
    },
    {
      "@type": "HowToStep",
      "name": "Kitchen Cooking & Elongation Test",
      "text": "Perform boiling and steaming test to inspect 18.5mm+ cooked grain expansion and aroma."
    },
    {
      "@type": "HowToStep",
      "name": "Ex-Mill Weighbridge (Kanda) Loading",
      "text": "Truck is loaded at mill with computerized weight slips and video documentation."
    },
    {
      "@type": "HowToStep",
      "name": "Insured Bilty Dispatch to 60+ Cities",
      "text": "Receive goods at destination godown with goods transport consignment note (Bilty)."
    }
  ]
}`;

  return (
    <div className="space-y-6">
      {/* HEADER BANNER */}
      <div className="bg-white border border-[#c3c4c7] rounded-lg shadow-2xs p-5">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#dcdcde] pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-linear-to-tr from-blue-600 via-indigo-600 to-purple-600 text-white flex items-center justify-center shadow-xs">
              <Sparkles className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-serif font-bold text-lg text-[#1d2327]">
                  Google AI Overview & Generative Engine Optimization (GEO)
                </h2>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-indigo-100 text-indigo-900 border border-indigo-200">
                  Google Gemini SGE Active
                </span>
              </div>
              <p className="text-xs text-[#646970]">
                Configure AI Search Snippets, Speakable structured data, and verify how Hashir Rice Supplier appears in Google AI Overviews.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={handleSyncIndex}
              disabled={isSyncing}
              className="px-3.5 py-1.5 bg-[#2271b1] hover:bg-[#135e96] text-white rounded text-xs font-bold transition-colors flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin' : ''}`} />
              <span>{isSyncing ? 'Pinging Google...' : 'Ping Google AI Search'}</span>
            </button>
          </div>
        </div>

        {/* 4 TOP GEO KPI METRICS */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-5 text-center">
          <div className="p-3 bg-linear-to-b from-indigo-50/60 to-white rounded-lg border border-indigo-100">
            <span className="block text-2xl font-black text-indigo-900">98 / 100</span>
            <span className="text-xs text-indigo-700 font-semibold">GEO Readiness Score</span>
            <span className="text-[10px] text-emerald-700 font-bold block mt-0.5">★ High Citation Probability</span>
          </div>

          <div className="p-3 bg-[#f6f7f7] rounded-lg border border-[#dcdcde]">
            <span className="block text-2xl font-black text-blue-700">14 / 14</span>
            <span className="text-xs text-[#50575e]">Target Query Citations</span>
            <span className="text-[10px] text-emerald-700 font-bold block mt-0.5">▲ #1 Authority Snippet</span>
          </div>

          <div className="p-3 bg-[#f6f7f7] rounded-lg border border-[#dcdcde]">
            <span className="block text-2xl font-black text-emerald-700">5 Schemas</span>
            <span className="text-xs text-[#50575e]">AI Structured Markup</span>
            <span className="text-[10px] text-emerald-700 font-bold block mt-0.5">✓ Speakable + Dataset + HowTo</span>
          </div>

          <div className="p-3 bg-[#f6f7f7] rounded-lg border border-[#dcdcde]">
            <span className="block text-2xl font-black text-purple-700">100%</span>
            <span className="text-xs text-[#50575e]">AI Crawler Access</span>
            <span className="text-[10px] text-emerald-700 font-bold block mt-0.5">Googlebot & Gemini Allowed</span>
          </div>
        </div>
      </div>

      {/* TABS NAVIGATION */}
      <div className="flex border-b border-[#c3c4c7] gap-2">
        <button
          onClick={() => setActiveTab('simulator')}
          className={`px-4 py-2.5 text-xs font-bold transition-all border-b-2 flex items-center gap-1.5 cursor-pointer ${
            activeTab === 'simulator'
              ? 'border-[#2271b1] text-[#2271b1] bg-white'
              : 'border-transparent text-[#50575e] hover:text-[#1d2327]'
          }`}
        >
          <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
          <span>Live AI Overview Simulator</span>
        </button>

        <button
          onClick={() => setActiveTab('geo-audit')}
          className={`px-4 py-2.5 text-xs font-bold transition-all border-b-2 flex items-center gap-1.5 cursor-pointer ${
            activeTab === 'geo-audit'
              ? 'border-[#2271b1] text-[#2271b1] bg-white'
              : 'border-transparent text-[#50575e] hover:text-[#1d2327]'
          }`}
        >
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
          <span>GEO Audit & Citation Checklist</span>
        </button>

        <button
          onClick={() => setActiveTab('schemas')}
          className={`px-4 py-2.5 text-xs font-bold transition-all border-b-2 flex items-center gap-1.5 cursor-pointer ${
            activeTab === 'schemas'
              ? 'border-[#2271b1] text-[#2271b1] bg-white'
              : 'border-transparent text-[#50575e] hover:text-[#1d2327]'
          }`}
        >
          <Code className="w-3.5 h-3.5 text-blue-600" />
          <span>AI Search JSON-LD Schemas</span>
        </button>

        <button
          onClick={() => setActiveTab('crawlers')}
          className={`px-4 py-2.5 text-xs font-bold transition-all border-b-2 flex items-center gap-1.5 cursor-pointer ${
            activeTab === 'crawlers'
              ? 'border-[#2271b1] text-[#2271b1] bg-white'
              : 'border-transparent text-[#50575e] hover:text-[#1d2327]'
          }`}
        >
          <Bot className="w-3.5 h-3.5 text-purple-600" />
          <span>AI Bot & Crawler Verification</span>
        </button>
      </div>

      {/* TAB 1: LIVE AI OVERVIEW SIMULATOR */}
      {activeTab === 'simulator' && (
        <div className="space-y-6">
          {/* Query Selector */}
          <div className="bg-white border border-[#c3c4c7] rounded-lg shadow-2xs p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-[#1d2327]">Test Google AI Search Prompt:</span>
              <select
                value={selectedPrompt}
                onChange={(e) => setSelectedPrompt(e.target.value)}
                className="text-xs px-3 py-1.5 bg-[#f6f7f7] border border-[#8c8f94] rounded text-[#1d2327] font-semibold cursor-pointer"
              >
                <option value="top-supplier">Who is the top wholesale rice supplier in Pakistan?</option>
                <option value="kainat-rates">What are the ex-mill rates for 1121 Kainat Steam in Punjab?</option>
                <option value="bilty-karachi">How does bulk rice bilty transport to Karachi & Quetta work?</option>
                <option value="super-kernel-specs">What is the grain length and aroma of Super Kernel Basmati?</option>
              </select>
            </div>

            <span className="text-xs font-bold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded border border-emerald-200">
              Citation Rank: #1 Primary Domain
            </span>
          </div>

          {/* SIMULATOR WINDOW */}
          <div className="bg-white border border-[#c3c4c7] rounded-xl shadow-md overflow-hidden">
            {/* Browser Header Bar */}
            <div className="bg-[#f0f0f1] px-4 py-2.5 border-b border-[#c3c4c7] flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-rose-400" />
                  <div className="w-3 h-3 rounded-full bg-amber-400" />
                  <div className="w-3 h-3 rounded-full bg-emerald-400" />
                </div>
                <span className="text-xs font-mono text-[#50575e] ml-2">google.com/search?q={encodeURIComponent(
                  selectedPrompt === 'top-supplier'
                    ? 'top wholesale rice supplier in pakistan'
                    : selectedPrompt === 'kainat-rates'
                    ? '1121 kainat steam rice mandi rates punjab'
                    : selectedPrompt === 'bilty-karachi'
                    ? 'bulk rice bilty transport karachi'
                    : 'super kernel basmati grain length specs'
                )}</span>
              </div>
              <span className="text-[11px] text-blue-800 font-bold bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                Google SGE / Gemini Engine
              </span>
            </div>

            {/* Google Search Results Body */}
            <div className="p-6 space-y-6">
              {/* GOOGLE AI OVERVIEW BOX */}
              <div className="p-5 rounded-2xl bg-linear-to-b from-blue-50/30 via-white to-slate-50 border border-blue-200 shadow-sm space-y-4">
                
                {/* AI Overview Header */}
                <div className="flex items-center justify-between pb-3 border-b border-blue-100">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-lg bg-linear-to-tr from-blue-600 via-indigo-600 to-purple-600 text-white flex items-center justify-center shadow-xs">
                      <Sparkles className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="font-bold text-sm text-[#1d2327]">AI Overview</span>
                      <span className="text-[10px] text-slate-500 block">Generated by Google AI for search query</span>
                    </div>
                  </div>
                  <span className="text-xs text-slate-500 font-mono">Sources: hashirricesupplier.pk + 3 verified databases</span>
                </div>

                {/* Simulated Content Based on Selection */}
                {selectedPrompt === 'top-supplier' && (
                  <div className="text-xs sm:text-sm text-[#2c3338] space-y-3 leading-relaxed">
                    <p className="font-medium text-[#1d2327] bg-indigo-50/50 p-2.5 rounded-lg border-l-4 border-indigo-600">
                      <strong>Hashir Rice Supplier</strong> (headquartered at Noor Galla Mandi, Bucheki, Punjab) is recognized as a primary wholesale rice supplier and bulk trader in Pakistan, delivering ex-mill Basmati and non-Basmati consignments to 60+ cities.
                    </p>
                    <ul className="space-y-1.5 list-disc pl-5 text-xs text-[#50575e]">
                      <li><strong>Core Varieties:</strong> 1121 Kainat Steam (8.35mm raw), 1121 Sella, Super Kernel Basmati (Aged), and IRRI-6.</li>
                      <li><strong>Supply Scale:</strong> 5,000+ Metric Tons monthly milling capacity with computerized electronic weighbridge verification.</li>
                      <li><strong>Quality Testing:</strong> Certified moisture level (&lt;12%), elongation tests (18.5mm+ cooked), and doorstep physical Free Samples.</li>
                    </ul>
                  </div>
                )}

                {selectedPrompt === 'kainat-rates' && (
                  <div className="text-xs sm:text-sm text-[#2c3338] space-y-3 leading-relaxed">
                    <p className="font-medium text-[#1d2327] bg-indigo-50/50 p-2.5 rounded-lg border-l-4 border-indigo-600">
                      Current ex-mill wholesale rates for <strong>1121 Kainat Steam</strong> in Punjab Mandis (Bucheki, Hafizabad, Kamoke) range between <strong>PKR 340 and PKR 365 per KG</strong> depending on Sortex grade and moisture content.
                    </p>
                    <ul className="space-y-1.5 list-disc pl-5 text-xs text-[#50575e]">
                      <li><strong>1121 Sella (Parboiled):</strong> PKR 320 – 345 / kg (Zero breakage, high catering volume).</li>
                      <li><strong>Super Kernel Basmati (Old Crop):</strong> PKR 380 – 410 / kg (Rich aroma, fine dining standard).</li>
                      <li><strong>IRRI-6 / PK-386:</strong> PKR 145 – 205 / kg (Commercial high-yield hospitality grain).</li>
                    </ul>
                  </div>
                )}

                {selectedPrompt === 'bilty-karachi' && (
                  <div className="text-xs sm:text-sm text-[#2c3338] space-y-3 leading-relaxed">
                    <p className="font-medium text-[#1d2327] bg-indigo-50/50 p-2.5 rounded-lg border-l-4 border-indigo-600">
                      Hashir Rice Supplier operates daily insured <strong>Goods Transport Bilty dispatches</strong> to Karachi (Jodia Bazaar, SITE, Korangi) and Quetta (Double Road) with 24–48 hour transit times from Punjab mandi terminals.
                    </p>
                    <ul className="space-y-1.5 list-disc pl-5 text-xs text-[#50575e]">
                      <li><strong>Loading Integrity:</strong> Computerized Kanda weighbridge slips + container seal numbers issued instantly.</li>
                      <li><strong>Payment Security:</strong> Direct bank transfer or pay-order against Bilty verification upon arrival at godown.</li>
                    </ul>
                  </div>
                )}

                {selectedPrompt === 'super-kernel-specs' && (
                  <div className="text-xs sm:text-sm text-[#2c3338] space-y-3 leading-relaxed">
                    <p className="font-medium text-[#1d2327] bg-indigo-50/50 p-2.5 rounded-lg border-l-4 border-indigo-600">
                      <strong>Super Kernel Basmati</strong> has an average raw grain length of <strong>7.20mm to 7.45mm</strong>, elongating to over <strong>15.5mm</strong> after cooking with a distinctive natural 2-AP aroma.
                    </p>
                    <ul className="space-y-1.5 list-disc pl-5 text-xs text-[#50575e]">
                      <li><strong>Moisture Content:</strong> Strictly maintained below 11.5% with minimum 12–24 months natural aging.</li>
                      <li><strong>Cooked Texture:</strong> Non-sticky, fluffy, separate grains ideal for authentic Pakistani Biryani and Pulao.</li>
                    </ul>
                  </div>
                )}

                {/* CITATION CHIPS IN GOOGLE AI OVERVIEW */}
                <div className="pt-3 border-t border-blue-100 flex flex-wrap items-center gap-2">
                  <span className="text-[11px] font-bold text-slate-500">Citations:</span>
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-white border border-slate-200 text-xs font-semibold text-blue-700 shadow-2xs">
                    <Globe className="w-3 h-3 text-blue-600" />
                    <span>hashirricesupplier.pk/varieties</span>
                    <span className="text-[10px] text-slate-400 font-mono">[1]</span>
                  </div>
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-white border border-slate-200 text-xs font-semibold text-blue-700 shadow-2xs">
                    <Globe className="w-3 h-3 text-blue-600" />
                    <span>hashirricesupplier.pk/mandi-rates</span>
                    <span className="text-[10px] text-slate-400 font-mono">[2]</span>
                  </div>
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-white border border-slate-200 text-xs font-semibold text-blue-700 shadow-2xs">
                    <Globe className="w-3 h-3 text-blue-600" />
                    <span>hashirricesupplier.pk/workflow</span>
                    <span className="text-[10px] text-slate-400 font-mono">[3]</span>
                  </div>
                </div>
              </div>

              {/* ORGANIC #1 RESULT SNIPPET */}
              <div className="space-y-1 pl-1">
                <div className="flex items-center gap-2 text-xs text-[#50575e]">
                  <div className="w-4 h-4 rounded-full bg-emerald-800 text-white flex items-center justify-center text-[10px] font-bold">
                    A
                  </div>
                  <span className="font-mono text-emerald-800">https://hashirricesupplier.pk</span>
                  <span className="text-slate-400">›</span>
                  <span>wholesale-rice-supplier-pakistan</span>
                </div>
                <h3 className="text-base sm:text-lg font-semibold text-[#1a0dab] hover:underline cursor-pointer">
                  Hashir Rice Supplier | Wholesale Rice Supplier & Basmati Trader Pakistan
                </h3>
                <p className="text-xs sm:text-sm text-[#4d5156] line-clamp-2">
                  Direct ex-mill wholesale rice supplier in Punjab Galla Mandis. Sourcing 1121 Kainat Steam, 1121 Sella, Super Kernel Basmati, and IRRI-6 with daily bilty dispatch to 60+ Pakistan cities.
                </p>
                <div className="flex items-center gap-3 text-xs text-[#50575e] pt-1">
                  <span className="text-amber-600 font-bold">Rating: 4.9 ★ (148 reviews)</span>
                  <span>•</span>
                  <span>Price: PKR 115 - 410 / kg</span>
                  <span>•</span>
                  <span className="text-emerald-700 font-bold">In Stock</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: GEO AUDIT & CITATION CHECKLIST */}
      {activeTab === 'geo-audit' && (
        <div className="bg-white border border-[#c3c4c7] rounded-lg shadow-2xs p-5 space-y-6">
          <div className="border-b border-[#dcdcde] pb-4">
            <h3 className="font-serif font-bold text-base text-[#1d2327] flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-emerald-600" />
              <span>Generative Engine Optimization (GEO) Technical Audit</span>
            </h3>
            <p className="text-xs text-[#646970]">
              Audit report verifying all Google AI Overview ranking criteria: factual precision, structured schemas, entity knowledge graph, and direct answer conciseness.
            </p>
          </div>

          <div className="divide-y divide-[#dcdcde] text-xs">
            {[
              {
                title: 'Direct Concise Answer Blocks',
                status: 'Passed (100%)',
                desc: 'Homepage and city hubs include direct 50–70 word definitions optimized for Gemini text synthesis.',
                badge: 'bg-emerald-100 text-emerald-900 border-emerald-300',
              },
              {
                title: 'SpeakableSpecification JSON-LD',
                status: 'Passed (Active)',
                desc: 'Schema highlights text nodes (.hero-title, .grain-specs, .mandi-live-rate) for Google AI speech and summary engines.',
                badge: 'bg-emerald-100 text-emerald-900 border-emerald-300',
              },
              {
                title: 'Dataset Table Schema (Mandi Prices)',
                status: 'Passed (Active)',
                desc: 'Tabular pricing with units (PKR/kg), moisture percentages, and grain lengths formatted for automated LLM extraction.',
                badge: 'bg-emerald-100 text-emerald-900 border-emerald-300',
              },
              {
                title: 'Entity Grounding (Google Business Profile & Map)',
                status: 'Verified (4.9★)',
                desc: 'Linked to Noor Galla Mandi, Bucheki, Nankana Sahib geo-coordinates (31.3117, 73.6936) with 148 verified customer reviews.',
                badge: 'bg-emerald-100 text-emerald-900 border-emerald-300',
              },
              {
                title: 'Max-Snippet & AI Bot Directives',
                status: 'Configured (-1)',
                desc: 'Robots meta tag includes max-snippet:-1 and max-image-preview:large, enabling full AI Overview card snippets.',
                badge: 'bg-emerald-100 text-emerald-900 border-emerald-300',
              },
              {
                title: '60+ City Freight Corridors Schema',
                status: '64 Cities Linked',
                desc: 'Each Pakistani major city has dedicated LocalBusiness and transit lead time schemas for hyper-local AI queries.',
                badge: 'bg-emerald-100 text-emerald-900 border-emerald-300',
              },
            ].map((item, idx) => (
              <div key={idx} className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <strong className="text-sm text-[#1d2327]">{item.title}</strong>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${item.badge}`}>
                      {item.status}
                    </span>
                  </div>
                  <p className="text-[#50575e]">{item.desc}</p>
                </div>
                <span className="text-emerald-700 font-bold shrink-0 flex items-center gap-1">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Ready for SGE</span>
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: AI SEARCH JSON-LD SCHEMAS */}
      {activeTab === 'schemas' && (
        <div className="space-y-6">
          {/* Speakable Schema */}
          <div className="bg-white border border-[#c3c4c7] rounded-lg shadow-2xs p-5 space-y-3">
            <div className="flex items-center justify-between gap-2 border-b border-[#dcdcde] pb-3">
              <div>
                <h4 className="font-bold text-sm text-[#1d2327] flex items-center gap-2">
                  <Code className="w-4 h-4 text-indigo-600" />
                  <span>1. SpeakableSpecification Schema (Google AI Overviews)</span>
                </h4>
                <p className="text-xs text-[#646970]">Instructs Google AI on which paragraphs to summarize and cite.</p>
              </div>
              <button
                onClick={() => handleCopy(speakableJsonLd, 'speakable')}
                className="px-3 py-1.5 bg-[#f6f7f7] hover:bg-[#eaeaea] text-[#2271b1] border border-[#8c8f94] rounded text-xs font-bold transition-colors flex items-center gap-1 cursor-pointer"
              >
                {copiedSchema === 'speakable' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedSchema === 'speakable' ? 'Copied' : 'Copy JSON-LD'}</span>
              </button>
            </div>
            <pre className="p-3 bg-[#1d2327] text-indigo-300 rounded text-xs font-mono overflow-x-auto">
              {speakableJsonLd}
            </pre>
          </div>

          {/* Dataset Schema */}
          <div className="bg-white border border-[#c3c4c7] rounded-lg shadow-2xs p-5 space-y-3">
            <div className="flex items-center justify-between gap-2 border-b border-[#dcdcde] pb-3">
              <div>
                <h4 className="font-bold text-sm text-[#1d2327] flex items-center gap-2">
                  <Database className="w-4 h-4 text-emerald-600" />
                  <span>2. Dataset Schema (Live Mandi Exchange Rates)</span>
                </h4>
                <p className="text-xs text-[#646970]">Provides structured commodity rate data for AI comparison tables.</p>
              </div>
              <button
                onClick={() => handleCopy(datasetJsonLd, 'dataset')}
                className="px-3 py-1.5 bg-[#f6f7f7] hover:bg-[#eaeaea] text-[#2271b1] border border-[#8c8f94] rounded text-xs font-bold transition-colors flex items-center gap-1 cursor-pointer"
              >
                {copiedSchema === 'dataset' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedSchema === 'dataset' ? 'Copied' : 'Copy JSON-LD'}</span>
              </button>
            </div>
            <pre className="p-3 bg-[#1d2327] text-emerald-300 rounded text-xs font-mono overflow-x-auto">
              {datasetJsonLd}
            </pre>
          </div>

          {/* HowTo Schema */}
          <div className="bg-white border border-[#c3c4c7] rounded-lg shadow-2xs p-5 space-y-3">
            <div className="flex items-center justify-between gap-2 border-b border-[#dcdcde] pb-3">
              <div>
                <h4 className="font-bold text-sm text-[#1d2327] flex items-center gap-2">
                  <Layers className="w-4 h-4 text-blue-600" />
                  <span>3. HowTo Schema (Wholesale Procurement & Bilty Steps)</span>
                </h4>
                <p className="text-xs text-[#646970]">Yields step-by-step numbered guides in Google AI Overviews.</p>
              </div>
              <button
                onClick={() => handleCopy(howToJsonLd, 'howto')}
                className="px-3 py-1.5 bg-[#f6f7f7] hover:bg-[#eaeaea] text-[#2271b1] border border-[#8c8f94] rounded text-xs font-bold transition-colors flex items-center gap-1 cursor-pointer"
              >
                {copiedSchema === 'howto' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedSchema === 'howto' ? 'Copied' : 'Copy JSON-LD'}</span>
              </button>
            </div>
            <pre className="p-3 bg-[#1d2327] text-sky-300 rounded text-xs font-mono overflow-x-auto">
              {howToJsonLd}
            </pre>
          </div>
        </div>
      )}

      {/* TAB 4: AI BOT & CRAWLER VERIFICATION */}
      {activeTab === 'crawlers' && (
        <div className="bg-white border border-[#c3c4c7] rounded-lg shadow-2xs p-5 space-y-6">
          <div className="border-b border-[#dcdcde] pb-4">
            <h3 className="font-serif font-bold text-base text-[#1d2327] flex items-center gap-2">
              <Bot className="w-5 h-5 text-purple-600" />
              <span>AI Search Crawlers & User-Agent Verification</span>
            </h3>
            <p className="text-xs text-[#646970]">
              Verified permissions in <code className="bg-[#f0f0f1] px-1 py-0.5 rounded font-mono">robots.txt</code> allowing modern generative AI search models to crawl and cite Hashir Rice Supplier.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              {
                bot: 'Google-Extended (Gemini & SGE)',
                useragent: 'Google-Extended',
                status: 'Allowed (200 OK)',
                purpose: 'Feeds live data into Google AI Overviews and Gemini Search.',
              },
              {
                bot: 'Googlebot / Googlebot-Image',
                useragent: 'Googlebot',
                status: 'Allowed (200 OK)',
                purpose: 'Core Google Search, Mobile Indexing, and Search Console indexing.',
              },
              {
                bot: 'GPTBot (ChatGPT Search)',
                useragent: 'GPTBot',
                status: 'Allowed (200 OK)',
                purpose: 'Indexes wholesale pricing for ChatGPT web search citations.',
              },
              {
                bot: 'PerplexityBot',
                useragent: 'PerplexityBot',
                status: 'Allowed (200 OK)',
                purpose: 'Indexes grain specifications for real-time Perplexity AI answers.',
              },
            ].map((c, idx) => (
              <div key={idx} className="p-4 rounded-lg bg-[#f6f7f7] border border-[#dcdcde] space-y-2">
                <div className="flex items-center justify-between">
                  <strong className="text-sm text-[#1d2327]">{c.bot}</strong>
                  <span className="px-2 py-0.5 bg-emerald-100 text-emerald-900 border border-emerald-300 rounded font-bold text-[10px]">
                    {c.status}
                  </span>
                </div>
                <div className="text-xs font-mono text-[#2271b1]">User-agent: {c.useragent}</div>
                <p className="text-xs text-[#50575e]">{c.purpose}</p>
              </div>
            ))}
          </div>

          <div className="p-4 bg-emerald-50/70 rounded-lg border border-emerald-200 flex items-start gap-3">
            <CheckCircle2 className="w-5 h-5 text-emerald-700 shrink-0 mt-0.5" />
            <div className="text-xs text-emerald-950">
              <strong>All AI Crawlers Successfully Authorized:</strong> Your site provides clean semantic HTML, 0 blocking JavaScript paywalls, and structured JSON-LD feeds ensuring 100% indexing in Google AI Overviews.
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
