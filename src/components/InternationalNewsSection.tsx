import React, { useState, useEffect } from 'react';
import { INTERNATIONAL_NEWS_ARTICLES } from '../data/internationalNewsData';
import { InternationalNewsArticle } from '../types';
import {
  Globe,
  TrendingUp,
  Clock,
  ExternalLink,
  ShieldCheck,
  Building2,
  Ship,
  Sparkles,
  MessageCircle,
  X,
  ChevronRight,
  Filter,
  CheckCircle2,
  Calendar,
  Layers,
  ArrowUpRight,
  Search,
  PlusCircle,
  Trash2,
  Edit3,
  PenTool,
  Check
} from 'lucide-react';

interface InternationalNewsSectionProps {
  onOpenQuoteModal: (varietyName?: string) => void;
  onOpenSampleModal: (varietyName?: string) => void;
  isFullPageView?: boolean;
}

export const InternationalNewsSection: React.FC<InternationalNewsSectionProps> = ({
  onOpenQuoteModal,
  onOpenSampleModal,
  isFullPageView = false,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedRegion, setSelectedRegion] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeArticleModal, setActiveArticleModal] = useState<InternationalNewsArticle | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState<boolean>(false);

  // Custom User-Added Articles stored in localStorage
  const [customArticles, setCustomArticles] = useState<InternationalNewsArticle[]>(() => {
    try {
      const saved = localStorage.getItem('hashir_custom_news_articles');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Save custom articles to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('hashir_custom_news_articles', JSON.stringify(customArticles));
    } catch {
      // ignore
    }
  }, [customArticles]);

  // Combined articles list: custom articles shown first
  const allArticles = [...customArticles, ...INTERNATIONAL_NEWS_ARTICLES];

  // New Article Form State
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState<'global-trade' | 'export-policy' | 'freight-logistics' | 'market-prices' | 'regulatory'>('global-trade');
  const [newRegion, setNewRegion] = useState<'Middle East & GCC' | 'European Union' | 'East & West Africa' | 'South East Asia' | 'Global Markets'>('Global Markets');
  const [newImpact, setNewImpact] = useState<'Bullish' | 'Bearish' | 'High Impact' | 'Market Neutral'>('Bullish');
  const [newSource, setNewSource] = useState('Hashir Rice Mandi Desk (Muhammad Amir Shahzad)');
  const [newReadTime, setNewReadTime] = useState('4 Min Read');
  const [newSummary, setNewSummary] = useState('');
  const [newHighlights, setNewHighlights] = useState('Bucheki Mandi price parity confirmed\nHigh Sortex purity grain lots ready\nDirect FOB shipment available');
  const [newContent, setNewContent] = useState('');
  const [newImageUrl, setNewImageUrl] = useState('https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&q=80&w=1200');

  const presetImages = [
    { label: 'Rice Mandi Bags', url: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&q=80&w=1200' },
    { label: 'Paddy Harvest Field', url: 'https://images.unsplash.com/photo-1536304929831-ee1ca9d44906?auto=format&fit=crop&q=80&w=1200' },
    { label: 'Container Shipping', url: 'https://images.unsplash.com/photo-1578575437130-527eed3abbec?auto=format&fit=crop&q=80&w=1200' },
    { label: 'Golden Grain Texture', url: 'https://images.unsplash.com/photo-1509358271058-acd22cc93898?auto=format&fit=crop&q=80&w=1200' },
  ];

  const categories = [
    { id: 'all', label: 'All Global Updates' },
    { id: 'global-trade', label: 'Global Trade & REAP' },
    { id: 'export-policy', label: 'Export Policies & SFDA' },
    { id: 'freight-logistics', label: 'Maritime Freight & Ports' },
    { id: 'market-prices', label: 'FAO & Pricing Parity' },
    { id: 'regulatory', label: 'EU Standards & MRL' },
  ];

  const regions = ['all', 'Global Markets', 'Middle East & GCC', 'European Union', 'East & West Africa'];

  const filteredArticles = allArticles.filter((article) => {
    const matchesCategory = selectedCategory === 'all' || article.category === selectedCategory;
    const matchesRegion = selectedRegion === 'all' || article.region === selectedRegion;
    const matchesSearch =
      searchQuery.trim() === '' ||
      article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      article.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
      article.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));

    return matchesCategory && matchesRegion && matchesSearch;
  });

  const handleShareWhatsApp = (article: InternationalNewsArticle) => {
    const text = encodeURIComponent(
      `*Global Rice Trade News Update*\n\n` +
      `📰 *${article.title}*\n` +
      `📍 *Region:* ${article.region} | *Source:* ${article.source}\n\n` +
      `"${article.summary}"\n\n` +
      `_Sourced via Hashir Rice Supplier (Owner: Muhammad Amir Shahzad) - Bucheki Mandi, Pakistan._`
    );
    window.open(`https://wa.me/?text=${text}`, '_blank');
  };

  const handleCreateArticle = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newSummary.trim()) {
      return;
    }

    const highlightsArr = newHighlights
      .split('\n')
      .map((h) => h.trim())
      .filter(Boolean);

    const contentParagraphs = newContent.trim()
      ? newContent.split('\n\n').map((p) => p.trim()).filter(Boolean)
      : [
          newSummary,
          'Sourced and analyzed directly from our on-ground commodity desk at Noor Galla Mandi, Bucheki (District Nankana Sahib, Punjab). Direct ex-mill procurement guarantees laboratory-certified physical purity and optimal cooking parameters across every consignee delivery.',
        ];

    const slug = newTitle
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');

    const created: InternationalNewsArticle & { isCustom?: boolean } = {
      id: `custom-news-${Date.now()}`,
      title: newTitle.trim(),
      slug: slug || `custom-article-${Date.now()}`,
      category: newCategory,
      region: newRegion,
      impactLevel: newImpact,
      source: newSource.trim() || 'Hashir Rice Supplier',
      publishedDate: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      readTime: newReadTime.trim() || '3 Min Read',
      summary: newSummary.trim(),
      keyHighlights: highlightsArr.length > 0 ? highlightsArr : ['Mandi spot pricing verified', 'Sortex certified'],
      content: contentParagraphs,
      imageUrl: newImageUrl || presetImages[0].url,
      tags: ['Wholesale Rice', 'Bucheki Mandi', 'Custom Report'],
    };

    setCustomArticles([created, ...customArticles]);
    setIsAddModalOpen(false);

    // Reset form
    setNewTitle('');
    setNewSummary('');
    setNewContent('');
  };

  const handleDeleteCustomArticle = (id: string) => {
    setCustomArticles(customArticles.filter((a) => a.id !== id));
    if (activeArticleModal?.id === id) {
      setActiveArticleModal(null);
    }
  };

  return (
    <section className={`bg-neutral-100 text-neutral-900 relative overflow-hidden border-t border-neutral-200/80 ${isFullPageView ? 'py-12 sm:py-16' : 'py-16 sm:py-24'}`} id="international-news-section">
      {/* Subtle ambient background decoration */}
      <div className="absolute inset-0 opacity-[0.03] bg-[radial-gradient(#047857_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none" />
      <div className="absolute -top-40 right-0 w-96 h-96 bg-emerald-100/60 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-40 left-0 w-96 h-96 bg-amber-100/50 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Header Block with Add Article Button */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 border border-emerald-300 text-emerald-900 text-xs font-bold uppercase tracking-wider mb-3">
              <Globe className="w-3.5 h-3.5 text-emerald-700" />
              <span>Custom Market Intelligence &amp; Trade News</span>
            </div>

            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-neutral-950 leading-tight">
              International Rice Market &amp; Trade News
            </h2>

            <p className="text-sm sm:text-base text-neutral-600 mt-3 leading-relaxed">
              Curated market intelligence on Pakistani rice export benchmarks, GCC and European Union trade regulations, shipping freight dynamics, and live mandi updates.
            </p>
          </div>

          {/* Customize / Add Custom Article Button */}
          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="px-5 py-3 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-xs sm:text-sm shadow-md transition-all flex items-center gap-2 cursor-pointer"
            >
              <PlusCircle className="w-4 h-4 text-amber-300" />
              <span>+ Add Your Own News / Blog</span>
            </button>
          </div>
        </div>

        {/* Local Management Notice (Zero External API requirement) */}
        <div className="mb-8 p-3 bg-white rounded-xl border border-neutral-200/90 flex items-center justify-between gap-4 text-xs">
          <div className="flex items-center gap-2 text-neutral-700">
            <ShieldCheck className="w-4 h-4 text-emerald-700 shrink-0" />
            <span>
              <strong>Zero External API Dependency:</strong> All articles and blog updates are customized and stored locally on your server and browser without third-party Google News API quotas.
            </span>
          </div>
          {customArticles.length > 0 && (
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-900 font-bold text-[11px] shrink-0">
              {customArticles.length} Custom Added
            </span>
          )}
        </div>

        {/* Global Key Indicators Ticker Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
          <div className="p-4 rounded-xl bg-white border border-neutral-200/90 shadow-xs">
            <span className="text-[11px] text-neutral-500 block font-medium">Pakistan Rice Exports</span>
            <div className="flex items-baseline gap-2 mt-1">
              <strong className="text-xl font-bold text-emerald-950 font-serif">$3.88 Billion+</strong>
              <span className="text-[11px] text-emerald-700 font-semibold flex items-center gap-0.5">
                <TrendingUp className="w-3 h-3" /> +18.4%
              </span>
            </div>
            <span className="text-[10px] text-neutral-500 block mt-1">Record Kharif Outflow</span>
          </div>

          <div className="p-4 rounded-xl bg-white border border-neutral-200/90 shadow-xs">
            <span className="text-[11px] text-neutral-500 block font-medium">FAO Global Rice Index</span>
            <div className="flex items-baseline gap-2 mt-1">
              <strong className="text-xl font-bold text-neutral-900 font-serif">136.4 pts</strong>
              <span className="text-[11px] text-amber-700 font-semibold">Firm Basis</span>
            </div>
            <span className="text-[10px] text-neutral-500 block mt-1">Parboiled &amp; Long Grain</span>
          </div>

          <div className="p-4 rounded-xl bg-white border border-neutral-200/90 shadow-xs">
            <span className="text-[11px] text-neutral-500 block font-medium">Karachi to GCC Freight</span>
            <div className="flex items-baseline gap-2 mt-1">
              <strong className="text-xl font-bold text-neutral-900 font-serif">3 - 5 Days</strong>
              <span className="text-[11px] text-emerald-700 font-semibold">Stable Route</span>
            </div>
            <span className="text-[10px] text-neutral-500 block mt-1">Jebel Ali / Dammam</span>
          </div>

          <div className="p-4 rounded-xl bg-white border border-neutral-200/90 shadow-xs">
            <span className="text-[11px] text-neutral-500 block font-medium">EU MRL Compliance</span>
            <div className="flex items-baseline gap-2 mt-1">
              <strong className="text-xl font-bold text-emerald-800 font-serif">99.2% Pure</strong>
              <span className="text-[11px] text-neutral-600 font-semibold">Lab Certified</span>
            </div>
            <span className="text-[10px] text-neutral-500 block mt-1">Tricyclazole &lt; 0.01 mg/kg</span>
          </div>
        </div>

        {/* Filter and Search Bar */}
        <div className="bg-white p-4 rounded-2xl border border-neutral-200/90 shadow-xs mb-8 flex flex-col md:flex-row items-center justify-between gap-4">
          
          {/* Category Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-2 md:pb-0 scrollbar-none">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`text-xs px-3 py-2 rounded-xl font-bold transition-all whitespace-nowrap cursor-pointer ${
                  selectedCategory === cat.id
                    ? 'bg-emerald-900 text-white shadow-xs'
                    : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200 hover:text-neutral-950'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Search Input */}
          <div className="relative w-full md:w-64 shrink-0">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search news by topic or keyword..."
              className="w-full pl-9 pr-4 py-2 rounded-xl bg-neutral-50 border border-neutral-300 text-xs text-neutral-900 placeholder-neutral-500 focus:outline-none focus:border-emerald-700 transition-colors"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-900 text-xs cursor-pointer"
              >
                Clear
              </button>
            )}
          </div>
        </div>

        {/* News Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredArticles.map((article, idx) => {
            const isCustom = customArticles.some((ca) => ca.id === article.id);

            return (
              <article
                key={article.id}
                className={`rounded-2xl bg-white border border-neutral-200/90 shadow-xs overflow-hidden flex flex-col justify-between transition-all hover:border-emerald-700/60 hover:shadow-md hover:-translate-y-1 ${
                  idx === 0 && selectedCategory === 'all' && !searchQuery ? 'md:col-span-2 lg:col-span-2' : ''
                }`}
              >
                <div>
                  {/* Image Banner */}
                  <div className="relative h-48 sm:h-56 w-full overflow-hidden bg-neutral-100">
                    <img
                      src={article.imageUrl}
                      alt={article.title}
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                    {/* Badges on image */}
                    <div className="absolute top-3 left-3 flex flex-wrap items-center gap-2">
                      <span className="px-2.5 py-0.5 rounded-md bg-neutral-950/85 text-amber-300 text-[11px] font-bold uppercase tracking-wider backdrop-blur-xs border border-white/20">
                        {article.region}
                      </span>
                      <span
                        className={`px-2.5 py-0.5 rounded-md text-[11px] font-bold uppercase tracking-wider backdrop-blur-xs ${
                          article.impactLevel === 'Bullish'
                            ? 'bg-emerald-900/90 text-emerald-200 border border-emerald-500/50'
                            : article.impactLevel === 'High Impact'
                            ? 'bg-red-900/90 text-red-100 border border-red-500/50'
                            : 'bg-neutral-900/90 text-neutral-200 border border-neutral-600'
                        }`}
                      >
                        {article.impactLevel}
                      </span>
                      {isCustom && (
                        <span className="px-2 py-0.5 rounded-md bg-amber-500 text-neutral-950 text-[10px] font-black uppercase tracking-wider">
                          Custom Post
                        </span>
                      )}
                    </div>

                    <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-[11px] text-neutral-200 font-medium">
                      <span className="flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-neutral-300" />
                        {article.publishedDate}
                      </span>
                      <span className="flex items-center gap-1.5 text-amber-300 font-semibold">
                        <Clock className="w-3.5 h-3.5" />
                        {article.readTime}
                      </span>
                    </div>
                  </div>

                  {/* Content Body */}
                  <div className="p-6 space-y-4">
                    <div>
                      <h3 className="font-serif text-lg sm:text-xl font-bold text-neutral-950 leading-snug hover:text-emerald-900 transition-colors">
                        {article.title}
                      </h3>

                      <p className="text-xs sm:text-sm text-neutral-600 mt-2.5 line-clamp-3 leading-relaxed">
                        {article.summary}
                      </p>

                      {/* Highlights Bullet Preview */}
                      <div className="mt-4 pt-3 border-t border-neutral-100 space-y-1.5">
                        {article.keyHighlights.slice(0, 2).map((hl, hIdx) => (
                          <div key={hIdx} className="flex items-start gap-2 text-xs text-neutral-700">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700 shrink-0 mt-0.5" />
                            <span className="line-clamp-1">{hl}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Action Footer */}
                <div className="px-6 pb-6 pt-4 border-t border-neutral-100 flex items-center justify-between gap-2">
                  <span className="text-[11px] text-neutral-500 truncate max-w-[140px]" title={article.source}>
                    Source: {article.source}
                  </span>

                  <div className="flex items-center gap-2">
                    {isCustom && (
                      <button
                        onClick={() => handleDeleteCustomArticle(article.id)}
                        className="p-2 rounded-lg bg-red-50 hover:bg-red-100 text-red-700 transition-colors cursor-pointer border border-red-200"
                        title="Delete this custom post"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}

                    <button
                      onClick={() => handleShareWhatsApp(article)}
                      className="p-2 rounded-lg bg-neutral-100 hover:bg-emerald-50 text-neutral-600 hover:text-emerald-800 transition-colors cursor-pointer border border-neutral-200"
                      title="Share via WhatsApp"
                    >
                      <MessageCircle className="w-3.5 h-3.5" />
                    </button>

                    <button
                      onClick={() => setActiveArticleModal(article)}
                      className="px-3.5 py-1.5 rounded-lg bg-emerald-900 hover:bg-emerald-950 text-white text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs"
                    >
                      <span>Read Report</span>
                      <ArrowUpRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </article>
            );
          })}
        </div>

        {/* Global Sourcing Support Banner */}
        <div className="mt-12 p-6 sm:p-8 rounded-2xl bg-gradient-to-r from-emerald-950 via-emerald-900 to-neutral-950 text-white border border-emerald-800/80 shadow-md flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl text-center md:text-left">
            <h3 className="font-serif text-xl sm:text-2xl font-bold text-white">
              Need Real-Time FOB Export Parity or Ex-Mill Mandi Spot Quotes?
            </h3>
            <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed">
              Connect with our live commodity trading desk at Noor Galla Mandi, Bucheki (Nankana Sahib) for verified spot valuations on 1121 Kainat, Super Kernel Basmati, PK-386, and IRRI-6.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <button
              onClick={() => onOpenQuoteModal('1121 Kainat Steam')}
              className="px-5 py-3 bg-amber-400 hover:bg-amber-300 text-neutral-950 font-bold rounded-xl text-xs sm:text-sm transition-all shadow-md cursor-pointer flex items-center gap-2"
            >
              <Sparkles className="w-4 h-4 text-neutral-950" />
              <span>Get Spot Pricing</span>
            </button>
            <a
              href="https://wa.me/923338990883?text=Hello%20Hashir%20Rice%20Supplier,%20I%20want%20to%20inquire%20about%20international%20export%20and%20domestic%20ex-mill%20rates."
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-3 bg-emerald-800 hover:bg-emerald-700 text-white font-semibold rounded-xl text-xs sm:text-sm transition-colors flex items-center gap-2 cursor-pointer border border-emerald-600"
            >
              <MessageCircle className="w-4 h-4" />
              <span>WhatsApp Trading Desk</span>
            </a>
          </div>
        </div>

      </div>

      {/* MODAL: CUSTOM NEWS / BLOG CREATOR */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-neutral-950/75 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white border border-neutral-200 rounded-3xl max-w-2xl w-full max-h-[92vh] overflow-y-auto shadow-2xl p-6 sm:p-8 text-neutral-900 relative">
            <button
              onClick={() => setIsAddModalOpen(false)}
              className="absolute top-5 right-5 p-2 rounded-full bg-neutral-100 hover:bg-neutral-200 text-neutral-600 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2 mb-2 text-emerald-800 font-bold text-xs uppercase tracking-wider">
              <PenTool className="w-4 h-4" />
              <span>Direct Article &amp; News Customizer</span>
            </div>

            <h3 className="font-serif text-2xl font-bold text-neutral-950 mb-1">
              Add Your Own Blog or Market News
            </h3>
            <p className="text-xs text-neutral-600 mb-6">
              Write and publish original commodity updates, mandi pricing shifts, or mill news. Everything is saved locally without external Google API calls.
            </p>

            <form onSubmit={handleCreateArticle} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-neutral-800 mb-1">Article Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Bucheki Mandi Weekly Update: 1121 Kainat Ex-Mill Parity &amp; Moisture Analysis"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full px-3 py-2.5 bg-neutral-50 border border-neutral-300 rounded-xl text-neutral-900 focus:outline-none focus:border-emerald-700 text-sm font-semibold"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block font-bold text-neutral-800 mb-1">Category</label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value as any)}
                    className="w-full px-3 py-2 bg-neutral-50 border border-neutral-300 rounded-lg text-neutral-900 focus:outline-none focus:border-emerald-700"
                  >
                    <option value="global-trade">Global Trade &amp; REAP</option>
                    <option value="export-policy">Export Policies</option>
                    <option value="freight-logistics">Freight &amp; Logistics</option>
                    <option value="market-prices">FAO &amp; Pricing Parity</option>
                    <option value="regulatory">EU Standards &amp; MRL</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-neutral-800 mb-1">Region</label>
                  <select
                    value={newRegion}
                    onChange={(e) => setNewRegion(e.target.value as any)}
                    className="w-full px-3 py-2 bg-neutral-50 border border-neutral-300 rounded-lg text-neutral-900 focus:outline-none focus:border-emerald-700"
                  >
                    <option value="Global Markets">Global Markets</option>
                    <option value="Middle East & GCC">Middle East &amp; GCC</option>
                    <option value="European Union">European Union</option>
                    <option value="East & West Africa">East &amp; West Africa</option>
                    <option value="South East Asia">South East Asia</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-neutral-800 mb-1">Market Sentiment</label>
                  <select
                    value={newImpact}
                    onChange={(e) => setNewImpact(e.target.value as any)}
                    className="w-full px-3 py-2 bg-neutral-50 border border-neutral-300 rounded-lg text-neutral-900 focus:outline-none focus:border-emerald-700"
                  >
                    <option value="Bullish">Bullish</option>
                    <option value="High Impact">High Impact</option>
                    <option value="Market Neutral">Market Neutral</option>
                    <option value="Bearish">Bearish</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-neutral-800 mb-1">Author / Source Name</label>
                  <input
                    type="text"
                    value={newSource}
                    onChange={(e) => setNewSource(e.target.value)}
                    placeholder="Hashir Rice Mandi Desk (Muhammad Amir Shahzad)"
                    className="w-full px-3 py-2 bg-neutral-50 border border-neutral-300 rounded-lg text-neutral-900 focus:outline-none focus:border-emerald-700"
                  />
                </div>

                <div>
                  <label className="block font-bold text-neutral-800 mb-1">Estimated Reading Time</label>
                  <input
                    type="text"
                    value={newReadTime}
                    onChange={(e) => setNewReadTime(e.target.value)}
                    placeholder="4 Min Read"
                    className="w-full px-3 py-2 bg-neutral-50 border border-neutral-300 rounded-lg text-neutral-900 focus:outline-none focus:border-emerald-700"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-neutral-800 mb-1">Executive Summary *</label>
                <textarea
                  rows={2}
                  required
                  placeholder="2-3 sentences summarizing the mandi price changes, harvest lot availability, or export quota update..."
                  value={newSummary}
                  onChange={(e) => setNewSummary(e.target.value)}
                  className="w-full px-3 py-2 bg-neutral-50 border border-neutral-300 rounded-lg text-neutral-900 focus:outline-none focus:border-emerald-700 resize-none"
                />
              </div>

              <div>
                <label className="block font-bold text-neutral-800 mb-1">Key Takeaway Bullets (One per line)</label>
                <textarea
                  rows={3}
                  placeholder="One bullet point per line..."
                  value={newHighlights}
                  onChange={(e) => setNewHighlights(e.target.value)}
                  className="w-full px-3 py-2 bg-neutral-50 border border-neutral-300 rounded-lg text-neutral-900 focus:outline-none focus:border-emerald-700 resize-none font-mono text-[11px]"
                />
              </div>

              <div>
                <label className="block font-bold text-neutral-800 mb-1">Detailed Content Paragraphs</label>
                <textarea
                  rows={4}
                  placeholder="Write full article body paragraphs here (separate paragraphs with blank line)..."
                  value={newContent}
                  onChange={(e) => setNewContent(e.target.value)}
                  className="w-full px-3 py-2 bg-neutral-50 border border-neutral-300 rounded-lg text-neutral-900 focus:outline-none focus:border-emerald-700 resize-none"
                />
              </div>

              <div>
                <label className="block font-bold text-neutral-800 mb-1">Featured Image Presets</label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-2">
                  {presetImages.map((img, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => setNewImageUrl(img.url)}
                      className={`p-1.5 rounded-lg border text-[10px] text-center font-bold transition-all cursor-pointer truncate ${
                        newImageUrl === img.url
                          ? 'border-emerald-700 bg-emerald-50 text-emerald-900'
                          : 'border-neutral-200 bg-neutral-50 text-neutral-600 hover:bg-neutral-100'
                      }`}
                    >
                      {img.label}
                    </button>
                  ))}
                </div>
                <input
                  type="url"
                  placeholder="Or enter custom image URL"
                  value={newImageUrl}
                  onChange={(e) => setNewImageUrl(e.target.value)}
                  className="w-full px-3 py-1.5 bg-neutral-50 border border-neutral-300 rounded-lg text-neutral-900 text-xs focus:outline-none focus:border-emerald-700 font-mono"
                />
              </div>

              <div className="pt-3 flex items-center justify-end gap-3 border-t border-neutral-200">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl bg-neutral-100 hover:bg-neutral-200 text-neutral-700 font-bold transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold transition-colors shadow-sm cursor-pointer"
                >
                  Publish Article
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Full Article Modal */}
      {activeArticleModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-neutral-950/70 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white border border-neutral-200 rounded-3xl max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl p-6 sm:p-8 text-neutral-900 relative">
            
            {/* Close Button */}
            <button
              onClick={() => setActiveArticleModal(null)}
              className="absolute top-5 right-5 p-2 rounded-full bg-neutral-100 hover:bg-neutral-200 text-neutral-600 hover:text-neutral-950 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Header info */}
            <div className="flex flex-wrap items-center gap-2 mb-3">
              <span className="px-2.5 py-1 rounded bg-amber-100 text-amber-900 text-xs font-bold uppercase tracking-wider border border-amber-300">
                {activeArticleModal.region}
              </span>
              <span className="px-2.5 py-1 rounded bg-emerald-100 text-emerald-900 text-xs font-semibold border border-emerald-300">
                {activeArticleModal.category.toUpperCase()}
              </span>
              <span className="text-xs text-neutral-500">
                Published: {activeArticleModal.publishedDate}
              </span>
            </div>

            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-neutral-950 leading-tight mb-4">
              {activeArticleModal.title}
            </h2>

            <div className="text-xs text-neutral-500 mb-6 flex items-center gap-2 pb-4 border-b border-neutral-200">
              <span>Source: <strong className="text-neutral-800">{activeArticleModal.source}</strong></span>
              <span>•</span>
              <span>Reading Time: {activeArticleModal.readTime}</span>
            </div>

            {/* Key Highlights Box */}
            <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 mb-6 space-y-2">
              <strong className="text-amber-950 text-xs uppercase font-bold tracking-wider block">
                Executive Trade Highlights:
              </strong>
              {activeArticleModal.keyHighlights.map((hl, i) => (
                <div key={i} className="flex items-start gap-2 text-xs text-neutral-800">
                  <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
                  <span>{hl}</span>
                </div>
              ))}
            </div>

            {/* Main Content Paragraphs */}
            <div className="space-y-4 text-sm text-neutral-700 leading-relaxed">
              {activeArticleModal.content.map((p, pIdx) => (
                <p key={pIdx}>{p}</p>
              ))}
            </div>

            {/* Modal Footer CTAs */}
            <div className="mt-8 pt-6 border-t border-neutral-200 flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleShareWhatsApp(activeArticleModal)}
                  className="px-4 py-2 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-900 text-xs font-semibold flex items-center gap-2 transition-colors cursor-pointer border border-emerald-200"
                >
                  <MessageCircle className="w-4 h-4 text-emerald-700" />
                  <span>Forward on WhatsApp</span>
                </button>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    const variety = activeArticleModal.tags[0] || '1121 Kainat Steam';
                    setActiveArticleModal(null);
                    onOpenQuoteModal(variety);
                  }}
                  className="px-5 py-2 rounded-xl bg-emerald-900 hover:bg-emerald-950 text-white font-bold text-xs transition-colors cursor-pointer shadow-xs"
                >
                  Request Mandi Quote
                </button>
              </div>
            </div>

          </div>
        </div>
      )}
    </section>
  );
};
