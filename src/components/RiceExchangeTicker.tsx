import React, { useState, useEffect } from 'react';
import {
  Building2,
  Calendar,
  Sparkles,
  MessageCircle,
  ShieldCheck,
  CheckCircle2,
  Edit3,
  RefreshCw,
  TrendingUp,
  TrendingDown,
  Minus,
  Check,
  X,
  PlusCircle,
  Filter
} from 'lucide-react';

export interface DailyMandiRateItem {
  id: string;
  name: string;
  category: 'basmati' | 'broken' | 'commercial';
  grainLength: string;
  spec: string;
  useCase: string;
  ratePkr50kg: string; // e.g. "Rs. 16,800 - 17,200"
  ratePkrMaund: string; // e.g. "Rs. 13,440 - 13,760"
  trend: 'firm' | 'stable' | 'active' | 'bullish';
  moisture: string;
  sortex: string;
}

const DEFAULT_MANDI_RATES: DailyMandiRateItem[] = [
  {
    id: '1121-steam-rice',
    name: '1121 Kainat Steam Rice (8.35mm+)',
    category: 'basmati',
    grainLength: '8.35mm - 8.45mm Raw (22mm+ Cooked)',
    spec: 'Double Silky Steam • 100% Buhler Sortex Clean',
    useCase: 'Banquet Biryani, Arabian Mandi, Wedding Feasts',
    ratePkr50kg: 'Rs. 16,900 - 17,400',
    ratePkrMaund: 'Rs. 13,520 - 13,920',
    trend: 'firm',
    moisture: 'Max 12.0%',
    sortex: '100% Optical Sortex'
  },
  {
    id: '1121-sella-rice',
    name: '1121 Golden Sella (Parboiled)',
    category: 'basmati',
    grainLength: '8.30mm - 8.40mm Raw',
    spec: 'Hardened Starch Parboiled • Zero Daig Breakage',
    useCase: 'Commercial Catering, Messes, Heavy-Fire Cauldrons',
    ratePkr50kg: 'Rs. 16,200 - 16,700',
    ratePkrMaund: 'Rs. 12,960 - 13,360',
    trend: 'stable',
    moisture: 'Max 12.5%',
    sortex: '100% Optical Sortex'
  },
  {
    id: '1121-white-raw',
    name: '1121 Raw White Long Grain',
    category: 'basmati',
    grainLength: '8.35mm Raw • Snow White Polish',
    spec: 'Naturally Milled Non-Steam • Light Fluffy Grains',
    useCase: 'Fine Dining, Aromatic Restaurant Platters, Retail Packs',
    ratePkr50kg: 'Rs. 16,500 - 17,000',
    ratePkrMaund: 'Rs. 13,200 - 13,600',
    trend: 'firm',
    moisture: 'Max 12.0%',
    sortex: '100% Sortex Clean'
  },
  {
    id: 'super-kernel-basmati',
    name: 'Super Kernel Basmati (Aged Raw)',
    category: 'basmati',
    grainLength: '7.20mm - 7.45mm Needle-Thin Kernel',
    spec: 'Naturally Cured 12-24 Months • Rich 2-AP Natural Aroma',
    useCase: 'Traditional Mutton Pulao, Heritage Banquet Dining',
    ratePkr50kg: 'Rs. 15,400 - 15,900',
    ratePkrMaund: 'Rs. 12,320 - 12,720',
    trend: 'bullish',
    moisture: 'Max 11.5%',
    sortex: '100% Buhler Sortex'
  },
  {
    id: 'pk-386-fragrant',
    name: 'PK-386 Fragrant Rice',
    category: 'commercial',
    grainLength: '6.80mm - 7.00mm Slender Grain',
    spec: 'Non-Sticky Slender Separation • High Economy Yield',
    useCase: 'Hotel Staff Messes, Commercial Biryani Outlets',
    ratePkr50kg: 'Rs. 9,600 - 10,100',
    ratePkrMaund: 'Rs. 7,680 - 8,080',
    trend: 'active',
    moisture: 'Max 12.5%',
    sortex: '100% Sortex Clean'
  },
  {
    id: 'irri-6-white',
    name: 'IRRI-6 White Rice (Sindh & Punjab)',
    category: 'commercial',
    grainLength: '6.00mm Medium Grain • Firm Texture',
    spec: 'High Starch Density • 5% / 10% Broken Grades Available',
    useCase: 'Industrial Workforce Canteens, Bulk Container Export',
    ratePkr50kg: 'Rs. 6,800 - 7,200',
    ratePkrMaund: 'Rs. 5,440 - 5,760',
    trend: 'stable',
    moisture: 'Max 13.0%',
    sortex: 'Machine Cleaned'
  },
  {
    id: 'irri-9-long-grain',
    name: 'IRRI-9 Long Grain Silky',
    category: 'commercial',
    grainLength: '6.60mm - 6.80mm Slender White',
    spec: 'Double Water Polished • Budget Long-Grain Dining',
    useCase: 'Commercial Catering, University Hostels, Export',
    ratePkr50kg: 'Rs. 8,200 - 8,600',
    ratePkrMaund: 'Rs. 6,560 - 6,880',
    trend: 'active',
    moisture: 'Max 12.5%',
    sortex: 'Sortex Cleaned'
  },
  {
    id: 'b1-broken-rice',
    name: 'B1 Broken Rice (Biryani Tota 50% - 75%)',
    category: 'broken',
    grainLength: '4.50mm - 6.00mm Half-to-Three-Quarter Basmati',
    spec: '100% Basmati Origin • High Fragrance & Flavour Absorption',
    useCase: 'Budget Restaurant Biryani & Pulao Points, Dhaba Dining',
    ratePkr50kg: 'Rs. 9,400 - 9,800',
    ratePkrMaund: 'Rs. 7,520 - 7,840',
    trend: 'firm',
    moisture: 'Max 12.5%',
    sortex: 'Sortex Graded'
  },
  {
    id: 'b2-broken-rice',
    name: 'B2 Broken Rice (Kheer Tota / Kani 25% - 50%)',
    category: 'broken',
    grainLength: '2.00mm - 4.00mm Basmati Small Broken Fragments',
    spec: 'Cleaned & Destoned • Rapid Creamy Gelatinization',
    useCase: 'Commercial Kheer, Firni, Halwa, Bakeries, Rice Atta',
    ratePkr50kg: 'Rs. 7,600 - 8,000',
    ratePkrMaund: 'Rs. 6,080 - 6,400',
    trend: 'stable',
    moisture: 'Max 13.0%',
    sortex: 'Destoned & Air-Screened'
  },
  {
    id: 'b3-broken-rice',
    name: 'B3 Broken Rice (Barik Kani / Rice Grits <25%)',
    category: 'broken',
    grainLength: '1.00mm - 2.20mm Fine Basmati Broken Grits',
    spec: 'Fine Screened & Dust-Free • 100% Starch Recovery',
    useCase: 'Industrial Rice Flour (Atta), Extruded Snacks, Breweries',
    ratePkr50kg: 'Rs. 6,400 - 6,800',
    ratePkrMaund: 'Rs. 5,120 - 5,440',
    trend: 'active',
    moisture: 'Max 13.5%',
    sortex: 'Aspirator Screened'
  }
];

interface RiceExchangeTickerProps {
  onOpenQuoteModal: (varietyName?: string) => void;
}

export const RiceExchangeTicker: React.FC<RiceExchangeTickerProps> = ({ onOpenQuoteModal }) => {
  const [rates, setRates] = useState<DailyMandiRateItem[]>(DEFAULT_MANDI_RATES);
  const [ratesDate, setRatesDate] = useState<string>('');
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'basmati' | 'broken' | 'commercial'>('all');
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editFormRates, setEditFormRates] = useState<DailyMandiRateItem[]>(DEFAULT_MANDI_RATES);
  const [editDateInput, setEditDateInput] = useState<string>('');
  const [saveSuccessMsg, setSaveSuccessMsg] = useState(false);

  // Load persisted custom daily rates or initialize with today's date
  useEffect(() => {
    const todayFormatted = new Date().toLocaleDateString('en-PK', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });

    try {
      const storedRates = localStorage.getItem('hashir_custom_daily_rates');
      const storedDate = localStorage.getItem('hashir_custom_rates_date');
      
      if (storedRates) {
        const parsed = JSON.parse(storedRates);
        if (Array.isArray(parsed) && parsed.length > 0) {
          // Merge with DEFAULT_MANDI_RATES in case new items were added (like B3 or 1121 Steam)
          const merged = DEFAULT_MANDI_RATES.map((def) => {
            const found = parsed.find((p: any) => p.id === def.id || p.name === def.name);
            return found ? { ...def, ...found } : def;
          });
          setRates(merged);
          setEditFormRates(merged);
        }
      } else {
        setRates(DEFAULT_MANDI_RATES);
        setEditFormRates(DEFAULT_MANDI_RATES);
      }

      const effectiveDate = storedDate || todayFormatted;
      setRatesDate(effectiveDate);
      setEditDateInput(effectiveDate);
    } catch {
      setRates(DEFAULT_MANDI_RATES);
      setRatesDate(todayFormatted);
      setEditDateInput(todayFormatted);
    }
  }, []);

  const handleSaveRates = (e: React.FormEvent) => {
    e.preventDefault();
    try {
      localStorage.setItem('hashir_custom_daily_rates', JSON.stringify(editFormRates));
      localStorage.setItem('hashir_custom_rates_date', editDateInput);
      setRates(editFormRates);
      setRatesDate(editDateInput);
      setSaveSuccessMsg(true);
      setTimeout(() => {
        setSaveSuccessMsg(false);
        setIsEditModalOpen(false);
      }, 900);
    } catch (err) {
      console.error('Failed to save daily rates:', err);
    }
  };

  const handleResetToDefault = () => {
    const todayFormatted = new Date().toLocaleDateString('en-PK', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
    localStorage.removeItem('hashir_custom_daily_rates');
    localStorage.removeItem('hashir_custom_rates_date');
    setRates(DEFAULT_MANDI_RATES);
    setEditFormRates(DEFAULT_MANDI_RATES);
    setRatesDate(todayFormatted);
    setEditDateInput(todayFormatted);
    setSaveSuccessMsg(true);
    setTimeout(() => {
      setSaveSuccessMsg(false);
      setIsEditModalOpen(false);
    }, 700);
  };

  const handleRateInputChange = (id: string, field: 'ratePkr50kg' | 'ratePkrMaund' | 'trend', value: string) => {
    setEditFormRates((prev) =>
      prev.map((item) => (item.id === id ? { ...item, [field]: value } : item))
    );
  };

  const filteredRates = selectedFilter === 'all'
    ? rates
    : rates.filter((r) => r.category === selectedFilter);

  const getTrendBadge = (trend: DailyMandiRateItem['trend']) => {
    switch (trend) {
      case 'firm':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-900 text-[10px] font-bold border border-emerald-300">
            <TrendingUp className="w-2.5 h-2.5 text-emerald-700" />
            <span>Firm Market</span>
          </span>
        );
      case 'bullish':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-amber-100 text-amber-900 text-[10px] font-bold border border-amber-300">
            <TrendingUp className="w-2.5 h-2.5 text-amber-700" />
            <span>Bullish</span>
          </span>
        );
      case 'stable':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-blue-100 text-blue-900 text-[10px] font-bold border border-blue-300">
            <Minus className="w-2.5 h-2.5 text-blue-700" />
            <span>Stable Parity</span>
          </span>
        );
      case 'active':
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-stone-100 text-stone-800 text-[10px] font-bold border border-stone-300">
            <CheckCircle2 className="w-2.5 h-2.5 text-emerald-600" />
            <span>Active Spot</span>
          </span>
        );
    }
  };

  return (
    <section id="rice-exchange" className="py-8 sm:py-10 bg-stone-50 text-neutral-900 border-b border-stone-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        
        {/* Top Header & Mandi Desk Identity - Compact & Light */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-4 border-b border-stone-200">
          <div className="space-y-2 max-w-3xl">
            <div className="flex flex-wrap items-center gap-2">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-900 text-xs font-bold uppercase tracking-wider border border-emerald-200">
                <Building2 className="w-3.5 h-3.5 text-emerald-800" />
                <span>Noor Galla Mandi Bucheki • Ex-Mill Trading Desk</span>
              </div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white text-stone-700 text-xs font-semibold border border-stone-200 shadow-2xs">
                <Calendar className="w-3.5 h-3.5 text-amber-600" />
                <span>Rates Effective: <strong className="text-neutral-950">{ratesDate || 'Today'}</strong></span>
              </div>
            </div>

            <h2 className="font-serif text-2xl sm:text-3xl font-bold tracking-tight text-neutral-950 leading-tight">
              Today's Mandi Rice Rates &amp; Ex-Mill Spot Quotations
            </h2>
            <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
              Transparent daily wholesale spot quotations direct from Noor Galla Mandi Bucheki (Punjab). Laboratory-tested moisture (&lt;12.0%) and Sortex clean guarantee for commercial truckloads.
            </p>
          </div>

          {/* Action CTAs & Custom Rates Editor Trigger */}
          <div className="flex flex-wrap items-center gap-2.5 shrink-0">
            <button
              type="button"
              onClick={() => setIsEditModalOpen(true)}
              className="px-3 py-2 rounded-lg bg-white hover:bg-stone-100 text-stone-800 text-xs font-semibold transition-all border border-stone-300 flex items-center gap-1.5 cursor-pointer shadow-2xs"
              title="Manually update daily rates directly"
            >
              <Edit3 className="w-3.5 h-3.5 text-emerald-700" />
              <span>Edit Today's Rates</span>
            </button>

            <a
              href={`https://wa.me/923338990883?text=Assalam-o-Alaikum%2C%20please%20share%20today%27s%20official%20Noor%20Galla%20Mandi%20Bucheki%20rice%20rate%20sheet%20for%201121%20Steam%2C%20Super%20Kernel%2C%20and%20Broken%20varieties.`}
              target="_blank"
              rel="noopener noreferrer"
              className="px-3.5 py-2 rounded-lg bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-bold transition-all shadow-sm flex items-center gap-1.5"
            >
              <MessageCircle className="w-3.5 h-3.5" />
              <span>Full Sheet on WhatsApp</span>
            </a>
          </div>
        </div>

        {/* Category Filter Chips */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-1.5">
            {[
              { id: 'all', label: 'All 10 Mandi Varieties' },
              { id: 'basmati', label: '1121 & Super Basmati' },
              { id: 'broken', label: 'B1 / B2 / B3 Broken Rice' },
              { id: 'commercial', label: 'Commercial IRRI & PK-386' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setSelectedFilter(tab.id as any)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  selectedFilter === tab.id
                    ? 'bg-emerald-900 text-amber-300 shadow-xs border border-emerald-800'
                    : 'bg-white text-stone-700 hover:bg-stone-100 border border-stone-200'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="text-[11px] text-stone-500 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse" />
            <span>Ex-Mill Noor Galla Mandi Bucheki • Verified Bilty</span>
          </div>
        </div>

        {/* Daily Rates Grid - Compact Clean Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5 pt-1">
          {filteredRates.map((item) => (
            <div
              key={item.id}
              className="p-4 bg-white border border-stone-200 rounded-xl hover:border-emerald-600/70 transition-all space-y-3 group flex flex-col justify-between shadow-2xs hover:shadow-md"
            >
              <div className="space-y-2.5">
                {/* Header Row */}
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h3 className="font-serif font-bold text-sm sm:text-base text-neutral-950 group-hover:text-emerald-900 transition-colors">
                      {item.name}
                    </h3>
                    <span className="text-[11px] text-emerald-800 font-semibold block mt-0.5">
                      {item.grainLength}
                    </span>
                  </div>
                  <div className="shrink-0">
                    {getTrendBadge(item.trend)}
                  </div>
                </div>

                {/* Specs and Use Case */}
                <p className="text-xs text-stone-600 leading-relaxed">
                  {item.spec}
                </p>

                <div className="p-2.5 bg-stone-50 rounded-lg border border-stone-200 space-y-1.5">
                  <div className="flex items-baseline justify-between">
                    <span className="text-[11px] text-stone-600 font-medium">Rate / 50kg Bag:</span>
                    <strong className="text-sm sm:text-base text-emerald-900 font-mono font-bold tracking-tight">
                      {item.ratePkr50kg}
                    </strong>
                  </div>
                  <div className="flex items-baseline justify-between pt-1 border-t border-stone-200">
                    <span className="text-[11px] text-stone-600 font-medium">Rate / Maund (40kg):</span>
                    <strong className="text-xs text-amber-800 font-mono font-semibold">
                      {item.ratePkrMaund}
                    </strong>
                  </div>
                </div>

                <div className="flex items-center justify-between text-[11px] text-stone-500 pt-0.5">
                  <span>Moisture: <strong className="text-stone-700">{item.moisture}</strong></span>
                  <span>Sortex: <strong className="text-stone-700">{item.sortex}</strong></span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-2.5 border-t border-stone-100 flex items-center justify-between gap-2 text-xs">
                <a
                  href={`https://wa.me/923338990883?text=Assalam-o-Alaikum%2C%20I%20am%20interested%20in%20today%27s%20ex-mill%20rate%20for%20${encodeURIComponent(item.name)}.%20Please%20quote%20for%20truckload%20delivery.`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-2.5 py-1.5 rounded-lg bg-emerald-900 hover:bg-emerald-950 text-amber-300 font-bold text-[11px] flex items-center gap-1.5 transition-colors cursor-pointer shadow-2xs"
                >
                  <MessageCircle className="w-3.5 h-3.5" />
                  <span>Lock on WhatsApp</span>
                </a>

                <button
                  type="button"
                  onClick={() => onOpenQuoteModal(item.name)}
                  className="px-2.5 py-1.5 rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-800 text-[11px] font-semibold transition-colors cursor-pointer"
                >
                  Request Quote
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Brokerage & Weighbridge Guarantee Note */}
        <div className="p-3.5 bg-emerald-50/80 border border-emerald-200 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-stone-700">
          <div className="flex items-start sm:items-center gap-2.5">
            <ShieldCheck className="w-4 h-4 text-emerald-800 shrink-0 mt-0.5 sm:mt-0" />
            <p className="leading-relaxed">
              <strong>Transparent Mandi Sourcing:</strong> Direct ex-mill spot prices benchmarked at Noor Galla Mandi Bucheki. Digital weighbridge tare slips, laboratory moisture verification, and transparent 0.5%–1% brokerage commission.
            </p>
          </div>
          <div className="flex items-center gap-2 shrink-0 text-stone-600 text-[11px]">
            <span>Bucheki Mandi Desk:</span>
            <strong className="text-emerald-950 font-bold">+92 333 8990883</strong>
          </div>
        </div>
      </div>

      {/* MODAL: Edit Today's Rates Manually (Custom Daily Rates Management) */}
      {isEditModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-neutral-900 border border-neutral-700 rounded-3xl max-w-3xl w-full p-6 sm:p-8 space-y-6 max-h-[90vh] overflow-y-auto shadow-2xl">
            
            <div className="flex items-center justify-between pb-4 border-b border-neutral-800">
              <div>
                <h3 className="font-serif text-xl sm:text-2xl font-bold text-white flex items-center gap-2">
                  <Edit3 className="w-5 h-5 text-emerald-400" />
                  <span>Update Daily Mandi Rice Rates</span>
                </h3>
                <p className="text-xs text-neutral-400 mt-1">
                  Change rates per 50kg bag and Maund (40kg) for Noor Galla Mandi Bucheki. Changes reflect instantly on the website.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsEditModalOpen(false)}
                className="p-2 rounded-xl text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveRates} className="space-y-6">
              {/* Effective Date Input */}
              <div className="p-4 bg-neutral-950 rounded-2xl border border-neutral-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <label className="text-xs font-bold text-neutral-300">
                  Rate Effective Date:
                </label>
                <input
                  type="text"
                  value={editDateInput}
                  onChange={(e) => setEditDateInput(e.target.value)}
                  placeholder="e.g. October 8, 2026"
                  className="px-3.5 py-2 bg-neutral-900 border border-neutral-700 rounded-xl text-xs text-white focus:outline-none focus:border-emerald-500 w-full sm:w-64 font-medium"
                />
              </div>

              {/* Varieties Rates Input Rows */}
              <div className="space-y-3">
                <span className="text-xs font-bold uppercase tracking-wider text-neutral-400 block">
                  Rice Varieties (PKR / 50kg &amp; Maund):
                </span>

                <div className="space-y-3 max-h-[420px] overflow-y-auto pr-1">
                  {editFormRates.map((item) => (
                    <div
                      key={item.id}
                      className="p-3.5 bg-neutral-950 rounded-xl border border-neutral-800 space-y-2.5"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-xs text-white">
                          {item.name}
                        </span>
                        <select
                          value={item.trend}
                          onChange={(e) => handleRateInputChange(item.id, 'trend', e.target.value)}
                          className="text-[11px] bg-neutral-900 text-neutral-300 border border-neutral-700 rounded-lg px-2 py-1 focus:outline-none focus:border-emerald-500"
                        >
                          <option value="firm">Firm</option>
                          <option value="stable">Stable</option>
                          <option value="active">Active Spot</option>
                          <option value="bullish">Bullish</option>
                        </select>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                        <div>
                          <label className="text-[11px] text-neutral-400 block mb-1">
                            Rate / 50kg Bag:
                          </label>
                          <input
                            type="text"
                            value={item.ratePkr50kg}
                            onChange={(e) => handleRateInputChange(item.id, 'ratePkr50kg', e.target.value)}
                            placeholder="e.g. Rs. 16,800 - 17,200"
                            className="w-full px-3 py-1.5 bg-neutral-900 border border-neutral-700 rounded-lg text-xs text-emerald-300 font-mono focus:outline-none focus:border-emerald-500"
                          />
                        </div>

                        <div>
                          <label className="text-[11px] text-neutral-400 block mb-1">
                            Rate / Maund (40kg):
                          </label>
                          <input
                            type="text"
                            value={item.ratePkrMaund}
                            onChange={(e) => handleRateInputChange(item.id, 'ratePkrMaund', e.target.value)}
                            placeholder="e.g. Rs. 13,440 - 13,760"
                            className="w-full px-3 py-1.5 bg-neutral-900 border border-neutral-700 rounded-lg text-xs text-amber-300 font-mono focus:outline-none focus:border-emerald-500"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-4 border-t border-neutral-800">
                <button
                  type="button"
                  onClick={handleResetToDefault}
                  className="px-4 py-2.5 rounded-xl text-neutral-400 hover:text-white hover:bg-neutral-800 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer w-full sm:w-auto justify-center"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Reset to Default Mandi Rates</span>
                </button>

                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <button
                    type="button"
                    onClick={() => setIsEditModalOpen(false)}
                    className="px-4 py-2.5 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-300 text-xs font-semibold transition-colors cursor-pointer flex-1 sm:flex-initial"
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer shadow-md flex-1 sm:flex-initial"
                  >
                    {saveSuccessMsg ? (
                      <>
                        <Check className="w-4 h-4 text-white" />
                        <span>Rates Updated!</span>
                      </>
                    ) : (
                      <span>Save &amp; Apply Today's Rates</span>
                    )}
                  </button>
                </div>
              </div>
            </form>

          </div>
        </div>
      )}

    </section>
  );
};
