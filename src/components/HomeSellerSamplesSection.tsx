import React, { useState, useEffect } from 'react';
import {
  Store,
  Plus,
  CheckCircle2,
  MessageCircle,
  Sparkles,
  MapPin,
  ShieldCheck,
  ArrowRight,
  X,
  Check,
  Layers,
  ExternalLink
} from 'lucide-react';
import { SellerSample } from '../types';
import { INITIAL_SELLER_SAMPLES, PRESET_SAMPLE_PHOTOS, RICE_VARIETY_CATEGORIES } from '../data/sellerSamplesData';

interface HomeSellerSamplesSectionProps {
  onOpenSampleModal: (varietyName?: string) => void;
  onOpenQuoteModal: (varietyName?: string) => void;
  setCurrentView: (view: string) => void;
  onSuccessToast?: (msg: string) => void;
}

const STORAGE_KEY_SAMPLES = 'hashir_rice_seller_samples_v1';

export const HomeSellerSamplesSection: React.FC<HomeSellerSamplesSectionProps> = ({
  onOpenSampleModal,
  onOpenQuoteModal,
  setCurrentView,
  onSuccessToast,
}) => {
  const [samples, setSamples] = useState<SellerSample[]>([]);
  const [showAddSampleModal, setShowAddSampleModal] = useState(false);

  // Quick Add Sample Form Fields
  const [sellerName, setSellerName] = useState('');
  const [sellerCompany, setSellerCompany] = useState('');
  const [sellerMandi, setSellerMandi] = useState('Noor Galla Mandi, Bucheki');
  const [sellerCity, setSellerCity] = useState('Bucheki (Nankana Sahib)');
  const [sellerWhatsApp, setSellerWhatsApp] = useState('+92 333 8990883');
  const [varietyName, setVarietyName] = useState('1121 Kainat Basmati Steam (XXL Grain)');
  const [category, setCategory] = useState<string>('1121-kainat');
  const [grainLength, setGrainLength] = useState('8.38 mm');
  const [cookedLength, setCookedLength] = useState('19.5 mm - 21.0 mm');
  const [moisture, setMoisture] = useState('11.8%');
  const [brokenRatio, setBrokenRatio] = useState('1.5% max');
  const [remainingStock, setRemainingStock] = useState('55 Tons (1,100 Bags)');
  const [askingRate, setAskingRate] = useState('Rs. 13,200 / 40kg Ex-Mill');
  const [imageUrl, setImageUrl] = useState(PRESET_SAMPLE_PHOTOS[0].url);
  const [description, setDescription] = useState(
    'Direct mill-inspected lot with zero chalkiness, double silky sortex finish, and high culinary elongation.'
  );

  useEffect(() => {
    let isMounted = true;
    const loadSamples = async () => {
      // 1. Try to fetch 4 latest live Ads published on trade.hashirricesupplier.com
      try {
        const response = await fetch('https://trade.hashirricesupplier.com/wp-json/hashir/v1/featured-ads', {
          headers: { Accept: 'application/json' },
        });
        if (response.ok) {
          const remoteAds = await response.json();
          if (Array.isArray(remoteAds) && remoteAds.length > 0 && isMounted) {
            setSamples(remoteAds);
            return;
          }
        }
      } catch {
        // Fallback gracefully
      }

      // 2. Check localStorage
      try {
        const stored = localStorage.getItem(STORAGE_KEY_SAMPLES);
        if (stored) {
          const parsed = JSON.parse(stored);
          if (Array.isArray(parsed) && parsed.length > 0 && isMounted) {
            setSamples(parsed);
            return;
          }
        }
      } catch {
        // fallback
      }
      if (isMounted) {
        setSamples(INITIAL_SELLER_SAMPLES);
      }
    };
    loadSamples();
    window.addEventListener('storage', loadSamples);
    return () => {
      isMounted = false;
      window.removeEventListener('storage', loadSamples);
    };
  }, []);

  // Show top 4 verified seller samples on Home Page
  const featuredSamples = samples.slice(0, 4);

  const handleQuickAddSample = (e: React.FormEvent) => {
    e.preventDefault();
    const newSample: SellerSample = {
      id: `sample-home-${Date.now()}`,
      sellerId: `seller-${Date.now()}`,
      sellerName: sellerName.trim() || 'Hashir Rice Supplier',
      sellerCompany: sellerCompany.trim() || 'Hashir Rice Supplier (Owner: Muhammad Amir Shahzad)',
      sellerEmail: 'info@hasricesupplier.com',
      sellerWhatsApp: sellerWhatsApp.trim() || '+92 333 8990883',
      sellerMandiLocation: sellerMandi.trim() || 'Noor Galla Mandi, Bucheki',
      sellerCity: sellerCity.trim() || 'Bucheki',
      isVerifiedSeller: true,
      varietyName: varietyName.trim() || '1121 Kainat Basmati Steam',
      varietyCategory: category,
      processingGrade: 'Double Polished & Sortexed',
      sampleImageUrl: imageUrl || PRESET_SAMPLE_PHOTOS[0].url,
      totalLotSize: '100 Metric Tons',
      remainingStock: remainingStock.trim() || '50 Tons Available',
      remainingStockNumber: 50,
      stockUnit: 'Tons',
      stockStatus: 'available',
      averageGrainLength: grainLength.trim() || '8.35 mm',
      cookedLength: cookedLength.trim() || '19.5 mm',
      moisturePercent: moisture.trim() || '11.8%',
      brokenPercent: brokenRatio.trim() || '1.5% max',
      cropYear: '2025/2026 Crop',
      askingRatePkr: askingRate.trim() || 'Call for Spot Rate',
      priceType: 'Ex-Mill',
      minimumOrder: '5 Tons (100 Bags)',
      sampleCourierAvailable: true,
      labReportAvailable: true,
      description: description.trim(),
      createdDate: 'Just Now',
      viewsCount: 1,
    };

    const updated = [newSample, ...samples];
    setSamples(updated);
    try {
      localStorage.setItem(STORAGE_KEY_SAMPLES, JSON.stringify(updated));
    } catch {
      // ignore
    }
    setShowAddSampleModal(false);
    if (onSuccessToast) {
      onSuccessToast('Your Rice Sample has been published to the Home Page showcase!');
    }
  };

  return (
    <section id="home-seller-samples" className="py-16 bg-neutral-50 border-b border-neutral-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Section Header */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between mb-10 gap-6">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-100 text-amber-950 text-xs font-bold uppercase tracking-wider mb-2 border border-amber-300">
              <Store className="w-3.5 h-3.5 text-amber-800" />
              <span>Verified Punjab & Sindh Millers Sample Showcase</span>
            </div>
            <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-bold text-neutral-950 tracking-tight">
              Featured Sellers Rice Samples & Live Mandi Stock Lots
            </h2>
            <p className="mt-2 text-neutral-600 text-sm leading-relaxed">
              Inspect verified rice samples directly from partner mills and commission agents across Bucheki, Kamoke, Hafizabad, and Muridke. Rice sellers and millers can also add their own live rice sample directly below.
            </p>
          </div>

          {/* Action Buttons: Add Your Rice Sample + View All */}
          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <a
              id="btn-home-add-rice-sample-trade-portal"
              href="https://trade.hashirricesupplier.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs flex items-center gap-2 shadow-sm transition-all cursor-pointer"
              title="Add your rice sample on Trade Exchange Portal"
            >
              <Plus className="w-4 h-4 text-white" />
              <span>Add your rice sample</span>
              <ExternalLink className="w-3.5 h-3.5 opacity-90" />
            </a>
            <a
              id="btn-home-quick-add-sample"
              href="https://trade.hashirricesupplier.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2.5 rounded-xl bg-emerald-900 hover:bg-emerald-950 text-amber-300 font-bold text-xs flex items-center gap-2 shadow-sm transition-all cursor-pointer border border-emerald-800"
            >
              <Plus className="w-4 h-4 text-amber-400" />
              <span>+ Quick Add Sample</span>
            </a>
            <a
              id="btn-home-view-all-seller-samples"
              href="https://trade.hashirricesupplier.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2.5 rounded-xl bg-white hover:bg-neutral-100 text-neutral-900 font-bold text-xs flex items-center gap-1.5 border border-neutral-300 transition-all cursor-pointer shadow-2xs"
            >
              <span>View All Seller Samples</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>

        {/* 4 Sellers Sample Cards Grid on Home Page */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredSamples.map((sample) => (
            <div
              key={sample.id}
              className="bg-white rounded-2xl border border-neutral-200/90 overflow-hidden shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col group"
            >
              {/* Sample Image & Badges */}
              <div className="relative h-48 overflow-hidden bg-neutral-900">
                <img
                  src={sample.sampleImageUrl}
                  alt={`${sample.varietyName} by ${sample.sellerCompany}`}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  loading="lazy"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent" />

                <div className="absolute top-3 left-3 flex items-center gap-1.5">
                  <span className="px-2.5 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider bg-emerald-600 text-white shadow-xs flex items-center gap-1">
                    <ShieldCheck className="w-3 h-3" />
                    Verified Seller
                  </span>
                </div>

                <div className="absolute top-3 right-3 bg-amber-400 text-neutral-950 text-[10px] font-extrabold px-2 py-0.5 rounded shadow-xs">
                  {sample.remainingStock}
                </div>

                <div className="absolute bottom-3 left-3 right-3 text-white">
                  <span className="text-[10px] text-amber-300 font-semibold flex items-center gap-1">
                    <MapPin className="w-3 h-3 shrink-0" />
                    {sample.sellerMandiLocation}
                  </span>
                  <h3 className="font-serif text-base font-bold leading-snug mt-0.5 line-clamp-1">
                    {sample.varietyName}
                  </h3>
                </div>
              </div>

              {/* Seller & Lab Specs Body */}
              <div className="p-4 flex-1 flex flex-col justify-between space-y-4">
                <div className="space-y-3">
                  {/* Seller Info */}
                  <div className="flex items-center justify-between text-xs pb-2.5 border-b border-neutral-100">
                    <div>
                      <span className="text-[10px] text-neutral-400 uppercase font-bold block">Seller / Mill</span>
                      <strong className="text-neutral-900 font-bold line-clamp-1">{sample.sellerCompany}</strong>
                      <span className="text-[11px] text-neutral-500 block">{sample.sellerName}</span>
                    </div>
                    <span className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 border border-emerald-200 text-[10px] font-bold shrink-0">
                      {sample.cropYear.split(' ')[0]}
                    </span>
                  </div>

                  {/* Grain Specs Grid */}
                  <div className="grid grid-cols-2 gap-2 text-[11px] bg-neutral-50 p-2.5 rounded-xl border border-neutral-100">
                    <div>
                      <span className="text-neutral-500 block">Raw Length:</span>
                      <span className="font-bold text-neutral-900">{sample.averageGrainLength}</span>
                    </div>
                    <div>
                      <span className="text-neutral-500 block">Cooked:</span>
                      <span className="font-bold text-emerald-800">{sample.cookedLength}</span>
                    </div>
                    <div>
                      <span className="text-neutral-500 block">Moisture:</span>
                      <span className="font-semibold text-neutral-900">{sample.moisturePercent}</span>
                    </div>
                    <div>
                      <span className="text-neutral-500 block">Broken Max:</span>
                      <span className="font-semibold text-neutral-900">{sample.brokenPercent}</span>
                    </div>
                  </div>

                  {/* Asking Rate */}
                  <div className="flex items-center justify-between bg-amber-50/70 px-3 py-2 rounded-lg border border-amber-200/70 text-xs">
                    <span className="text-amber-900 font-medium text-[11px]">Mandi Asking Rate:</span>
                    <strong className="text-neutral-950 font-extrabold">{sample.askingRatePkr}</strong>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="pt-2 border-t border-neutral-100 flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => onOpenSampleModal(sample.varietyName)}
                    className="flex-1 py-2 px-3 rounded-lg bg-emerald-900 hover:bg-emerald-950 text-white font-bold text-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer shadow-2xs"
                  >
                    <span>Order Sample</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                  <a
                    href={`https://wa.me/${sample.sellerWhatsApp.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(
                      `Assalam-o-Alaikum ${sample.sellerName} (${sample.sellerCompany}), I saw your ${sample.varietyName} sample on Hashir Rice Supplier Home Page.`
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="py-2 px-3 rounded-lg bg-amber-400 hover:bg-amber-300 text-neutral-950 font-bold text-xs transition-colors flex items-center gap-1"
                    title="WhatsApp Seller Directly"
                  >
                    <MessageCircle className="w-3.5 h-3.5" />
                    <span>Chat</span>
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Add Your Rice Sample Modal on Home Page */}
      {showAddSampleModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-neutral-200 my-8 space-y-5">
            <div className="flex items-center justify-between border-b border-neutral-200 pb-4">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-800 block">
                  Live Seller Sample Listing
                </span>
                <h3 className="font-serif text-xl sm:text-2xl font-bold text-neutral-950">
                  Add Your Rice Sample to Home Page
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShowAddSampleModal(false)}
                className="p-2 rounded-lg text-neutral-500 hover:text-neutral-900 hover:bg-neutral-100 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-3 bg-red-50 border border-red-200 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
              <div className="flex items-center gap-2">
                <Store className="w-4 h-4 text-red-600 shrink-0" />
                <span className="text-[11px] font-semibold text-neutral-800">
                  Prefer to list directly on our live B2B Exchange Portal?
                </span>
              </div>
              <a
                href="https://trade.hashirricesupplier.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-1 px-3 py-1.5 rounded-lg bg-red-600 hover:bg-red-700 text-white font-bold text-[11px] shrink-0 transition-colors"
              >
                <span>Add your rice sample</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>

            <form onSubmit={handleQuickAddSample} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-neutral-800 mb-1">Your Name / Broker Name *</label>
                  <input
                    type="text"
                    required
                    value={sellerName}
                    onChange={(e) => setSellerName(e.target.value)}
                    placeholder="e.g., Hashir Rice Supplier"
                    className="w-full px-3 py-2 rounded-lg border border-neutral-300 focus:outline-none focus:border-emerald-700"
                  />
                </div>
                <div>
                  <label className="block font-bold text-neutral-800 mb-1">Rice Mill / Trading Company *</label>
                  <input
                    type="text"
                    required
                    value={sellerCompany}
                    onChange={(e) => setSellerCompany(e.target.value)}
                    placeholder="e.g., Al-Barakah Basmati Mills"
                    className="w-full px-3 py-2 rounded-lg border border-neutral-300 focus:outline-none focus:border-emerald-700"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block font-bold text-neutral-800 mb-1">Rice Variety Name *</label>
                  <input
                    type="text"
                    required
                    value={varietyName}
                    onChange={(e) => setVarietyName(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-neutral-300 focus:outline-none focus:border-emerald-700"
                  />
                </div>
                <div>
                  <label className="block font-bold text-neutral-800 mb-1">Variety Category</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-neutral-300 bg-white focus:outline-none focus:border-emerald-700"
                  >
                    {RICE_VARIETY_CATEGORIES.filter((c) => c.id !== 'all').map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-neutral-800 mb-1">WhatsApp Number *</label>
                  <input
                    type="text"
                    required
                    value={sellerWhatsApp}
                    onChange={(e) => setSellerWhatsApp(e.target.value)}
                    placeholder="+92 333 8990883"
                    className="w-full px-3 py-2 rounded-lg border border-neutral-300 focus:outline-none focus:border-emerald-700"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div>
                  <label className="block font-bold text-neutral-800 mb-1">Raw Grain Length</label>
                  <input
                    type="text"
                    value={grainLength}
                    onChange={(e) => setGrainLength(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-neutral-300"
                  />
                </div>
                <div>
                  <label className="block font-bold text-neutral-800 mb-1">Cooked Length</label>
                  <input
                    type="text"
                    value={cookedLength}
                    onChange={(e) => setCookedLength(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-neutral-300"
                  />
                </div>
                <div>
                  <label className="block font-bold text-neutral-800 mb-1">Available Stock</label>
                  <input
                    type="text"
                    value={remainingStock}
                    onChange={(e) => setRemainingStock(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-neutral-300"
                  />
                </div>
                <div>
                  <label className="block font-bold text-neutral-800 mb-1">Asking Rate (PKR)</label>
                  <input
                    type="text"
                    value={askingRate}
                    onChange={(e) => setAskingRate(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-neutral-300"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-neutral-800 mb-1">Mandi / Mill Location</label>
                  <input
                    type="text"
                    value={sellerMandi}
                    onChange={(e) => setSellerMandi(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-neutral-300"
                  />
                </div>
                <div>
                  <label className="block font-bold text-neutral-800 mb-1">Sample Photo Preset</label>
                  <select
                    value={imageUrl}
                    onChange={(e) => setImageUrl(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-neutral-300 bg-white"
                  >
                    {PRESET_SAMPLE_PHOTOS.map((p) => (
                      <option key={p.name} value={p.url}>
                        {p.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-neutral-200">
                <button
                  type="button"
                  onClick={() => setShowAddSampleModal(false)}
                  className="px-4 py-2 rounded-lg border border-neutral-300 text-neutral-700 font-semibold hover:bg-neutral-100 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg bg-emerald-900 hover:bg-emerald-950 text-amber-300 font-bold flex items-center gap-1.5 cursor-pointer shadow-sm"
                >
                  <Check className="w-4 h-4" />
                  <span>Publish Rice Sample Now</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  );
};
