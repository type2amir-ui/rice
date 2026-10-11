import React, { useState } from 'react';
import { GoogleBusinessMap } from './GoogleBusinessMap';
import {
  Package,
  Sparkles,
  CheckCircle2,
  Truck,
  CookingPot,
  Scale,
  ShieldCheck,
  Building2,
  Clock,
  ArrowRight,
  MessageCircle,
  FileCheck,
  HelpCircle,
  MapPin,
  Wallet,
  Copy,
  Check,
} from 'lucide-react';
import { RICE_VARIETIES } from '../data/riceData';
import { CITIES_DATA } from '../data/citiesData';
import { ALL_PAKISTAN_CITIES } from '../data/allPakistanCities';
import { recordNewInquiry } from '../utils/inquiryManager';

interface SampleRequestPageProps {
  onOpenQuoteModal: (varietyName?: string) => void;
  onOpenSampleModal: (varietyName?: string) => void;
  setCurrentView: (view: string) => void;
  onSuccessToast?: (msg: string) => void;
}

export const SampleRequestPage: React.FC<SampleRequestPageProps> = ({
  onOpenQuoteModal,
  setCurrentView,
  onSuccessToast,
}) => {
  const [selectedVariety, setSelectedVariety] = useState<string>(RICE_VARIETIES[0].name);
  const [secondaryVariety, setSecondaryVariety] = useState<string>('None (Single Free Sample Pack)');
  const [fullName, setFullName] = useState<string>('');
  const [businessName, setBusinessName] = useState<string>('');
  const [whatsapp, setWhatsapp] = useState<string>('');
  const [city, setCity] = useState<string>('Lahore');
  const [customCityName, setCustomCityName] = useState<string>('');
  const [deliveryAddress, setDeliveryAddress] = useState<string>('');
  const [businessType, setBusinessType] = useState<string>('Restaurant / Biryani House');
  const [estimatedMonthlyVolume, setEstimatedMonthlyVolume] = useState<string>('5 to 10 Tons (100 - 200 Bags)');
  const [notes, setNotes] = useState<string>('');
  const [easyPaisaTrx, setEasyPaisaTrx] = useState<string>('');
  const [copiedEasyPaisa, setCopiedEasyPaisa] = useState<boolean>(false);
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);

  const [validationError, setValidationError] = useState<string>('');

  const handleCopyEasyPaisa = () => {
    navigator.clipboard.writeText('03338990883');
    setCopiedEasyPaisa(true);
    setTimeout(() => setCopiedEasyPaisa(false), 2500);
    if (onSuccessToast) onSuccessToast('EasyPaisa Account Number copied: 0333 8990883');
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const finalCity = city === 'Custom city name Add' ? (customCityName.trim() || 'Custom City') : city;
    if (!fullName.trim() || !whatsapp.trim() || !deliveryAddress.trim()) {
      setValidationError('Please fill your Name, WhatsApp Number, and Delivery Address.');
      return;
    }
    setValidationError('');

    const stored = recordNewInquiry({
      customerName: fullName,
      phone: whatsapp,
      city: finalCity,
      variety: `${selectedVariety} (Secondary: ${secondaryVariety})`,
      volume: `Free Sample Pack (${businessType} - ${estimatedMonthlyVolume}/mo)`,
      businessName: businessName,
      message: `Address: ${deliveryAddress}. Notes: ${notes}. EasyPaisa: ${easyPaisaTrx || 'Pending'}.`,
      type: 'Free Physical Sample Requisition'
    });

    const text = encodeURIComponent(
      `*Free Physical Rice Cooking Sample Request (ID: ${stored.id})*\n\n` +
      `👤 *Name:* ${fullName}\n` +
      `🏢 *Business:* ${businessName || 'N/A'} (${businessType})\n` +
      `📞 *WhatsApp:* ${whatsapp}\n` +
      `📍 *City:* ${finalCity}\n` +
      `🏠 *Delivery Address:* ${deliveryAddress}\n` +
      `🌾 *Primary Variety:* ${selectedVariety}\n` +
      `🌾 *Secondary Variety:* ${secondaryVariety}\n` +
      `⚖️ *Expected Monthly Volume:* ${estimatedMonthlyVolume}\n` +
      (notes ? `📝 *Specific Quality Needs:* ${notes}\n` : '') +
      `📦 *Courier Expenses:* Rs. 1,000 courier fee via EasyPaisa to 0333 8990883 (Muhammad Amir Shahzad)\n` +
      (easyPaisaTrx ? `🔖 *EasyPaisa Ref / Sender:* ${easyPaisaTrx}\n\n` : '\n') +
      `_Please confirm sample courier tracking number via TCS / Leopards._`
    );

    window.open(`https://wa.me/923338990883?text=${text}`, '_blank');
    setIsSubmitted(true);
    if (onSuccessToast) {
      onSuccessToast(`Sample request #${stored.id} recorded & WhatsApp dispatched to Muhammad Amir Shahzad!`);
    }
  };

  return (
    <div className="bg-white min-h-screen">
      {/* Top Hero Banner */}
      <section className="bg-gradient-to-b from-neutral-900 via-emerald-950 to-neutral-900 text-white py-14 sm:py-18 relative overflow-hidden border-b border-emerald-800/40">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#10b981_1px,transparent_1px)] [background-size:16px_16px]"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center space-y-5">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-900/80 text-emerald-300 text-xs font-bold uppercase tracking-wider border border-emerald-700/50">
            <Package className="w-4 h-4 text-amber-400" />
            <span>100% Pre-Tested Grain Guarantee</span>
          </div>

          <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-white max-w-3xl mx-auto">
            Request a Free Physical Rice Cooking Sample
          </h1>

          <p className="max-w-2xl mx-auto text-neutral-300 text-sm sm:text-base leading-relaxed">
            Eliminate blind-buying risks. We courier sealed, lab-verified free physical sample bags directly from active Punjab mill runs to your commercial kitchen or office across Pakistan within 24 to 48 hours.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <div className="flex items-center gap-1.5 text-xs text-amber-300 bg-black/40 px-3 py-1.5 rounded-lg border border-amber-500/20">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Exact Batch Matching</span>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-amber-300 bg-black/40 px-3 py-1.5 rounded-lg border border-amber-500/20">
              <Truck className="w-3.5 h-3.5" />
              <span>TCS / Leopards Nationwide Dispatch</span>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-amber-300 bg-black/40 px-3 py-1.5 rounded-lg border border-amber-500/20">
              <CookingPot className="w-3.5 h-3.5" />
              <span>Commercial Daig Test Ready</span>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content Area: 2 Columns */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          
          {/* Left Column: Direct Sample Order Form */}
          <div className="lg:col-span-7 bg-white rounded-2xl p-6 sm:p-8 border border-neutral-200 shadow-sm space-y-6">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Sparkles className="w-4 h-4 text-emerald-800" />
                <span className="text-xs font-bold text-emerald-950 uppercase tracking-wider">Fast Courier Dispatch</span>
              </div>
              <h2 className="font-serif text-2xl font-bold text-neutral-950">
                Sample Dispatch Information
              </h2>
              <p className="text-xs text-neutral-600 mt-1">
                Fill in your delivery address below. Once submitted, our trade desk prepares a sealed tamper-proof sample pack matching your culinary grade.
              </p>
            </div>

            {isSubmitted ? (
              <div className="p-6 sm:p-8 bg-emerald-50 rounded-2xl border-2 border-emerald-400 text-center space-y-4 animate-fadeIn">
                <div className="w-14 h-14 rounded-full bg-emerald-900 text-amber-300 flex items-center justify-center mx-auto shadow-sm">
                  <CheckCircle2 className="w-7 h-7" />
                </div>
                <h3 className="font-serif text-xl font-bold text-emerald-950">Sample Request Received!</h3>
                <p className="text-xs sm:text-sm text-neutral-700 leading-relaxed max-w-md mx-auto">
                  Your free physical test lot for <strong>{selectedVariety}</strong> has been logged for dispatch to <strong>{city}</strong>.
                </p>

                {/* Prominent EasyPaisa Courier Fee Box */}
                <div className="p-5 bg-white rounded-xl border border-emerald-300 text-left space-y-3 shadow-xs max-w-lg mx-auto">
                  <div className="flex items-center justify-between border-b border-neutral-200 pb-2 flex-wrap gap-1.5">
                    <div className="flex items-center gap-2">
                      <Wallet className="w-4 h-4 text-emerald-700" />
                      <span className="font-bold text-neutral-900 text-xs sm:text-sm">EasyPaisa Courier Expenses</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="px-2 py-0.5 rounded-full bg-amber-400 text-emerald-950 font-black text-[10px] tracking-wide">
                        Fee: Rs. 1,000
                      </span>
                      <span className="px-2 py-0.5 rounded-full bg-emerald-600 text-white font-black text-[10px] tracking-wide uppercase">
                        easypaisa
                      </span>
                    </div>
                  </div>

                  <p className="text-[11px] text-neutral-600 leading-relaxed">
                    The physical rice sample is provided <strong>complimentary (Free Sample - free of grain cost)</strong>. A flat fee of <strong>Rs. 1,000 (One Thousand Rupees)</strong> covers the courier & packaging delivery expenses (TCS / Leopards courier service):
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
                    <div className="p-2.5 bg-neutral-50 rounded-lg border border-neutral-200">
                      <span className="text-[10px] uppercase font-bold text-neutral-500 block">Courier Charges</span>
                      <strong className="text-emerald-900 text-xs sm:text-sm font-extrabold block mt-0.5">Rs. 1,000</strong>
                    </div>

                    <div className="p-2.5 bg-neutral-50 rounded-lg border border-neutral-200">
                      <span className="text-[10px] uppercase font-bold text-neutral-500 block">Account Title</span>
                      <strong className="text-neutral-900 text-xs font-bold block mt-0.5 truncate" title="Muhammad Amir Shahzad">Muhammad Amir Shahzad</strong>
                    </div>

                    <div className="p-2.5 bg-neutral-50 rounded-lg border border-neutral-200 flex items-center justify-between">
                      <div>
                        <span className="text-[10px] uppercase font-bold text-neutral-500 block">EasyPaisa</span>
                        <strong className="text-emerald-900 text-xs font-extrabold tracking-wide block mt-0.5">0333 8990883</strong>
                      </div>
                      <button
                        type="button"
                        onClick={handleCopyEasyPaisa}
                        className="px-2 py-1 rounded bg-emerald-100 hover:bg-emerald-200 text-emerald-900 font-bold text-[10px] flex items-center gap-1 transition-colors border border-emerald-300 cursor-pointer"
                      >
                        {copiedEasyPaisa ? <Check className="w-3 h-3 text-emerald-700" /> : <Copy className="w-3 h-3 text-emerald-700" />}
                        <span>{copiedEasyPaisa ? 'Copied' : 'Copy'}</span>
                      </button>
                    </div>
                  </div>

                  <a
                    href={`https://wa.me/923338990883?text=${encodeURIComponent(
                      `Hello Hashir Rice Supplier, I have submitted a free sample request for ${selectedVariety} (${city}). Please find my Rs. 1,000 EasyPaisa courier fee payment confirmation to Muhammad Amir Shahzad (0333 8990883).`
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-2.5 rounded-lg bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-xs flex items-center justify-center gap-2 transition-colors shadow-2xs cursor-pointer"
                  >
                    <MessageCircle className="w-4 h-4 text-white" />
                    <span>Send Rs. 1,000 Slip on WhatsApp (+92 333 8990883)</span>
                  </a>
                </div>

                <div className="pt-2">
                  <button
                    onClick={() => setIsSubmitted(false)}
                    className="text-xs text-emerald-900 font-bold underline hover:text-emerald-950 cursor-pointer"
                  >
                    Submit another sample request
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleFormSubmit} className="space-y-4 text-xs">
                {/* Variety Selection */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-semibold text-neutral-800 mb-1.5">
                      Primary Rice Variety *
                    </label>
                    <select
                      value={selectedVariety}
                      onChange={(e) => setSelectedVariety(e.target.value)}
                      className="w-full px-3 py-2.5 bg-neutral-50 border border-neutral-300 rounded-lg text-neutral-900 focus:outline-none focus:border-emerald-800"
                    >
                      {RICE_VARIETIES.map((v) => (
                        <option key={v.id} value={v.name}>
                          {v.name} ({v.specs.averageGrainLength})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block font-semibold text-neutral-800 mb-1.5">
                      Secondary Comparison Sample (Optional)
                    </label>
                    <select
                      value={secondaryVariety}
                      onChange={(e) => setSecondaryVariety(e.target.value)}
                      className="w-full px-3 py-2.5 bg-neutral-50 border border-neutral-300 rounded-lg text-neutral-900 focus:outline-none focus:border-emerald-800"
                    >
                      <option value="None (Single Free Sample Pack)">None (Single Free Sample Pack)</option>
                      {RICE_VARIETIES.map((v) => (
                        <option key={`sec-${v.id}`} value={v.name}>
                          {v.name} ({v.specs.averageGrainLength})
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Personal & Business Info */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-semibold text-neutral-800 mb-1.5">Your Full Name *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Haji Muhammad Tariq"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="w-full px-3 py-2.5 bg-neutral-50 border border-neutral-300 rounded-lg text-neutral-900 focus:outline-none focus:border-emerald-800"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-neutral-800 mb-1.5">WhatsApp Mobile Number *</label>
                    <input
                      type="tel"
                      required
                      placeholder="0300-1234567"
                      value={whatsapp}
                      onChange={(e) => setWhatsapp(e.target.value)}
                      className="w-full px-3 py-2.5 bg-neutral-50 border border-neutral-300 rounded-lg text-neutral-900 focus:outline-none focus:border-emerald-800"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-semibold text-neutral-800 mb-1.5">Business / Hotel / Mill Name</label>
                    <input
                      type="text"
                      placeholder="e.g. Royal Crown Banquets / Tariq Traders"
                      value={businessName}
                      onChange={(e) => setBusinessName(e.target.value)}
                      className="w-full px-3 py-2.5 bg-neutral-50 border border-neutral-300 rounded-lg text-neutral-900 focus:outline-none focus:border-emerald-800"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-neutral-800 mb-1.5">Business Sector</label>
                    <select
                      value={businessType}
                      onChange={(e) => setBusinessType(e.target.value)}
                      className="w-full px-3 py-2.5 bg-neutral-50 border border-neutral-300 rounded-lg text-neutral-900 focus:outline-none focus:border-emerald-800"
                    >
                      <option value="Restaurant / Biryani House">Restaurant / Biryani House</option>
                      <option value="Catering & Banquet Hall">Catering & Banquet Hall</option>
                      <option value="Wholesale Rice Trader / Mandi Dealer">Wholesale Rice Trader / Mandi Dealer</option>
                      <option value="Hotel & Institutional Hospitality">Hotel & Institutional Hospitality</option>
                      <option value="University / Hospital Mess / Canteen">University / Hospital Mess / Canteen</option>
                      <option value="Export Trading Desk">Export Trading Desk</option>
                      <option value="Supermarket / Retail Chain">Supermarket / Retail Chain</option>
                    </select>
                  </div>
                </div>

                {/* City & Address */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block font-semibold text-neutral-800 mb-1.5">Destination City (All Pakistan) *</label>
                    <select
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      className="w-full px-3 py-2.5 bg-neutral-50 border border-neutral-300 rounded-lg text-neutral-900 focus:outline-none focus:border-emerald-800"
                    >
                      <option value="Custom city name Add">+ Custom city name Add (یہاں اپنا شہر لکھیں)</option>
                      <optgroup label="Major Wholesale Hubs">
                        {CITIES_DATA.map((c) => (
                          <option key={c.slug} value={c.name}>
                            {c.name} ({c.province})
                          </option>
                        ))}
                      </optgroup>
                      <optgroup label="All Pakistan Cities & Tehsils (A-Z)">
                        {ALL_PAKISTAN_CITIES.map((cItem) => (
                          <option key={`all-sample-${cItem.name}`} value={cItem.name}>
                            {cItem.name} ({cItem.province})
                          </option>
                        ))}
                      </optgroup>
                    </select>
                    {city === 'Custom city name Add' && (
                      <input
                        type="text"
                        required
                        value={customCityName}
                        onChange={(e) => setCustomCityName(e.target.value)}
                        placeholder="Type your custom city or mandi..."
                        className="mt-2 w-full px-3 py-2 bg-amber-50/70 border-2 border-emerald-700 rounded-lg text-xs text-neutral-900 font-semibold focus:outline-none"
                      />
                    )}
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block font-semibold text-neutral-800 mb-1.5">Full Delivery / Office Address *</label>
                    <input
                      type="text"
                      required
                      placeholder="Shop/Office No., Street, Market Area, City"
                      value={deliveryAddress}
                      onChange={(e) => setDeliveryAddress(e.target.value)}
                      className="w-full px-3 py-2.5 bg-neutral-50 border border-neutral-300 rounded-lg text-neutral-900 focus:outline-none focus:border-emerald-800"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-semibold text-neutral-800 mb-1.5">
                    Estimated Monthly Requirement If Sample Is Approved
                  </label>
                  <select
                    value={estimatedMonthlyVolume}
                    onChange={(e) => setEstimatedMonthlyVolume(e.target.value)}
                    className="w-full px-3 py-2.5 bg-neutral-50 border border-neutral-300 rounded-lg text-neutral-900 focus:outline-none focus:border-emerald-800"
                  >
                    <option value="Trial Order: 1 to 3 Tons (20 - 60 Bags)">Trial Order: 1 to 3 Tons (20 - 60 Bags)</option>
                    <option value="5 to 10 Tons (100 - 200 Bags)">5 to 10 Tons (100 - 200 Bags)</option>
                    <option value="15 to 30 Tons (300 - 600 Bags)">15 to 30 Tons (300 - 600 Bags)</option>
                    <option value="50+ Tons (Single/Multi Trailer)">50+ Tons (Single/Multi Trailer)</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-neutral-800 mb-1.5">
                    Special Cooking or Grain Length Requirements (Optional)
                  </label>
                  <textarea
                    rows={2}
                    placeholder="e.g. Need 22mm+ cooked elongation with high grease absorption for 20-daig catering setup."
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    className="w-full px-3 py-2.5 bg-neutral-50 border border-neutral-300 rounded-lg text-neutral-900 focus:outline-none focus:border-emerald-800"
                  />
                </div>

                {/* EasyPaisa Courier Expenses Box */}
                <div className="p-4 rounded-xl bg-gradient-to-br from-emerald-50 via-green-50/50 to-white border-2 border-emerald-500/40 space-y-3 shadow-2xs">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-start gap-2.5">
                      <div className="w-8 h-8 rounded-lg bg-emerald-700 text-white flex items-center justify-center shrink-0 mt-0.5 shadow-xs">
                        <Wallet className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-bold text-neutral-950 text-xs">EasyPaisa Courier & Dispatch Charges</span>
                          <span className="px-2 py-0.5 rounded-full bg-emerald-600 text-white font-black text-[10px] tracking-wide uppercase">
                            easypaisa
                          </span>
                          <span className="px-2 py-0.5 rounded-full bg-amber-400 text-emerald-950 font-black text-[10px] tracking-wide">
                            Rs. 1,000 Fixed Courier Fee
                          </span>
                        </div>
                        <p className="text-[11px] text-neutral-600 mt-0.5">
                          <strong>Note:</strong> All physical rice samples are provided <strong>free of product cost (Free Sample)</strong> from verified partner mills. A flat fee of <strong>Rs. 1,000 (One Thousand Rupees)</strong> covers courier and packaging dispatch expenses (TCS / Leopards courier service across Pakistan).
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-1">
                    <div className="p-2.5 bg-white rounded-lg border border-neutral-200 shadow-2xs">
                      <span className="text-[10px] uppercase font-bold text-neutral-500 block">Courier Charges</span>
                      <strong className="text-emerald-900 text-sm font-extrabold block mt-0.5">Rs. 1,000</strong>
                    </div>

                    <div className="p-2.5 bg-white rounded-lg border border-neutral-200 shadow-2xs">
                      <span className="text-[10px] uppercase font-bold text-neutral-500 block">Account Title / Name</span>
                      <strong className="text-neutral-950 text-xs font-bold block mt-0.5 truncate" title="Muhammad Amir Shahzad">Muhammad Amir Shahzad</strong>
                    </div>

                    <div className="p-2.5 bg-white rounded-lg border border-neutral-200 shadow-2xs flex items-center justify-between">
                      <div>
                        <span className="text-[10px] uppercase font-bold text-neutral-500 block">EasyPaisa Number</span>
                        <strong className="text-emerald-900 text-xs font-extrabold tracking-wide block mt-0.5">0333 8990883</strong>
                      </div>
                      <button
                        type="button"
                        onClick={handleCopyEasyPaisa}
                        className="px-2 py-1 rounded bg-emerald-100 hover:bg-emerald-200 text-emerald-900 font-bold text-[10px] flex items-center gap-1 transition-colors border border-emerald-300 cursor-pointer shrink-0"
                        title="Copy EasyPaisa Number"
                      >
                        {copiedEasyPaisa ? (
                          <>
                            <Check className="w-3 h-3 text-emerald-700" />
                            <span>Copied</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3 h-3 text-emerald-700" />
                            <span>Copy</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 pt-1">
                    <input
                      type="text"
                      placeholder="Sender Name or EasyPaisa Trx ID (Optional if paid)"
                      value={easyPaisaTrx}
                      onChange={(e) => setEasyPaisaTrx(e.target.value)}
                      className="flex-1 px-3 py-2 bg-white border border-neutral-300 rounded-lg text-neutral-900 text-xs focus:outline-none focus:border-emerald-800"
                    />
                    <a
                      href={`https://wa.me/923338990883?text=${encodeURIComponent(
                        `Hello Hashir Rice Supplier, I want to send Rs. 1,000 courier expenses via EasyPaisa to Muhammad Amir Shahzad (0333 8990883) for physical sample dispatch (${selectedVariety}).`
                      )}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3.5 py-2 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-colors shrink-0 shadow-2xs"
                    >
                      <MessageCircle className="w-3.5 h-3.5 text-white" />
                      <span>Share Rs. 1,000 Receipt on WhatsApp</span>
                    </a>
                  </div>
                </div>

                {validationError && (
                  <div className="p-3 bg-red-50 border border-red-200 text-red-800 rounded-xl text-xs font-semibold">
                    {validationError}
                  </div>
                )}

                <div className="pt-2">
                  <button
                    type="submit"
                    className="w-full py-3.5 bg-emerald-900 hover:bg-emerald-950 text-white font-bold rounded-xl text-sm transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer active:scale-98"
                  >
                    <MessageCircle className="w-4 h-4 text-amber-300" />
                    <span>Submit & Confirm Dispatch via WhatsApp</span>
                  </button>
                  <p className="text-[11px] text-neutral-500 text-center mt-2">
                    Official dispatch receipt and TCS/Leopards tracking ID provided directly to your WhatsApp.
                  </p>
                </div>
              </form>
            )}
          </div>

          {/* Right Column: 4-Step Sample Testing Protocol & Guarantees */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* Why Physical Testing is Critical */}
            <div className="bg-neutral-50 rounded-2xl p-6 border border-neutral-200 shadow-2xs space-y-4">
              <h3 className="font-serif text-lg font-bold text-neutral-950 border-b border-neutral-200 pb-3 flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-emerald-800" />
                <span>Our 4-Point Kitchen Test Guide</span>
              </h3>

              <div className="space-y-3.5 text-xs text-neutral-700">
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-emerald-900 text-amber-300 flex items-center justify-center font-bold text-[11px] shrink-0 mt-0.5">
                    1
                  </div>
                  <div>
                    <strong className="text-neutral-950 block font-semibold text-xs">Micrometer Grain Length Check:</strong>
                    <span>Measure raw grain length (e.g., 8.35mm for 1121 Kainat, 7.4mm for Super Kernel).</span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-emerald-900 text-amber-300 flex items-center justify-center font-bold text-[11px] shrink-0 mt-0.5">
                    2
                  </div>
                  <div>
                    <strong className="text-neutral-950 block font-semibold text-xs">Soaking & Water Absorption:</strong>
                    <span>Soak for 45-60 minutes (Steam) or 90-120 minutes (Sella) to test hydration expansion without curvature.</span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-emerald-900 text-amber-300 flex items-center justify-center font-bold text-[11px] shrink-0 mt-0.5">
                    3
                  </div>
                  <div>
                    <strong className="text-neutral-950 block font-semibold text-xs">Dum Resilience in Daig:</strong>
                    <span>Boil and apply steam dum to verify cooked elongation (18mm-24mm) and discrete non-sticky separation.</span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-emerald-900 text-amber-300 flex items-center justify-center font-bold text-[11px] shrink-0 mt-0.5">
                    4
                  </div>
                  <div>
                    <strong className="text-neutral-950 block font-semibold text-xs">Aroma & Taste Retention:</strong>
                    <span>Evaluate natural 2-acetyl-1-pyrroline Basmati aroma and authentic sweet aftertaste under commercial spices.</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Courier Guarantee Card */}
            <div className="bg-emerald-950 text-white rounded-2xl p-6 border border-emerald-800/80 shadow-md space-y-4">
              <div className="flex items-center gap-2">
                <Truck className="w-5 h-5 text-amber-400" />
                <span className="text-xs font-bold uppercase tracking-wider text-amber-300">Courier Timelines</span>
              </div>
              <h4 className="font-serif text-lg font-bold text-white">
                Fast Nationwide Delivery
              </h4>
              <div className="space-y-2 text-xs text-neutral-300">
                <div className="flex items-center justify-between border-b border-neutral-800 pb-2">
                  <span>Lahore, Sheikhupura, Faisalabad:</span>
                  <strong className="text-amber-300">Next Day Delivery</strong>
                </div>
                <div className="flex items-center justify-between border-b border-neutral-800 pb-2">
                  <span>Rawalpindi, Islamabad, Gujranwala:</span>
                  <strong className="text-amber-300">24 – 36 Hours</strong>
                </div>
                <div className="flex items-center justify-between border-b border-neutral-800 pb-2">
                  <span>Karachi, Hyderabad, Sukkur:</span>
                  <strong className="text-amber-300">36 – 48 Hours</strong>
                </div>
                <div className="flex items-center justify-between">
                  <span>Peshawar, Quetta, Mardan:</span>
                  <strong className="text-amber-300">36 – 48 Hours</strong>
                </div>
              </div>
            </div>

            {/* EasyPaisa Courier Expenses Policy Card */}
            <div className="bg-gradient-to-br from-white via-emerald-50/50 to-green-50/70 rounded-2xl p-6 border-2 border-emerald-500/40 shadow-sm space-y-3.5">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-emerald-700 text-white flex items-center justify-center font-black text-xs shadow-xs">
                    <Wallet className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="font-serif text-base font-bold text-neutral-950">
                      Sample Courier Expenses Policy
                    </h4>
                    <span className="text-[11px] text-emerald-800 font-semibold">
                      TCS / Leopards courier service across Pakistan
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="px-2 py-0.5 rounded-full bg-amber-400 text-emerald-950 font-black text-[10px] tracking-wide">
                    Fee: Rs. 1,000
                  </span>
                  <span className="px-2 py-0.5 rounded-full bg-emerald-600 text-white font-black text-[10px] tracking-wider uppercase">
                    easypaisa
                  </span>
                </div>
              </div>

              <p className="text-xs text-neutral-600 leading-relaxed">
                To prevent non-commercial frivolous requests, our rice grains are provided <strong>100% free of product cost</strong>; a fixed delivery charge of <strong>Rs. 1,000 (One Thousand Rupees)</strong> covers packaging and courier delivery across Pakistan via EasyPaisa.
              </p>

              <div className="p-3 bg-white rounded-xl border border-neutral-200 shadow-2xs space-y-2 text-xs">
                <div className="flex items-center justify-between border-b border-neutral-100 pb-1.5">
                  <span className="text-neutral-500">Fixed Courier Fee:</span>
                  <strong className="text-emerald-900 font-extrabold text-sm">Rs. 1,000</strong>
                </div>
                <div className="flex items-center justify-between border-b border-neutral-100 pb-1.5">
                  <span className="text-neutral-500">Account Name:</span>
                  <strong className="text-neutral-900 font-bold">Muhammad Amir Shahzad</strong>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-neutral-500">EasyPaisa Account:</span>
                  <div className="flex items-center gap-1.5">
                    <strong className="text-emerald-900 font-extrabold font-mono">0333 8990883</strong>
                    <button
                      type="button"
                      onClick={handleCopyEasyPaisa}
                      className="px-2 py-0.5 rounded bg-emerald-100 hover:bg-emerald-200 text-emerald-900 text-[10px] font-bold transition-colors cursor-pointer"
                    >
                      {copiedEasyPaisa ? 'Copied' : 'Copy'}
                    </button>
                  </div>
                </div>
              </div>

              <a
                href={`https://wa.me/923338990883?text=${encodeURIComponent(
                  'Hello Hashir Rice Supplier, I would like to confirm Rs. 1,000 courier delivery expenses via EasyPaisa to Muhammad Amir Shahzad (0333 8990883) for free physical sample lot.'
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-2.5 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-xs flex items-center justify-center gap-2 transition-colors shadow-2xs cursor-pointer"
              >
                <MessageCircle className="w-4 h-4 text-white" />
                <span>Confirm Rs. 1,000 on WhatsApp (+92 333 8990883)</span>
              </a>
            </div>

            {/* Direct Broker Desk Phone Contact */}
            <div className="bg-white rounded-2xl p-5 border border-neutral-200 shadow-2xs text-xs space-y-2.5">
              <span className="text-neutral-500 block font-medium">Prefer to speak directly to a grain broker?</span>
              <div className="flex flex-col gap-1.5">
                <div className="flex items-center justify-between">
                  <a
                    href="https://wa.me/923338990883"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-bold text-emerald-900 text-sm hover:underline"
                  >
                    +92 333 8990883
                  </a>
                  <span className="text-[11px] text-neutral-400">Desk 1 (Rates & Dispatch)</span>
                </div>
                <div className="flex items-center justify-between border-t border-neutral-100 pt-1.5">
                  <a
                    href="https://wa.me/923002861297"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-bold text-emerald-900 text-sm hover:underline"
                  >
                    +92 300 2861297
                  </a>
                  <span className="text-[11px] text-neutral-400">Desk 2 (Samples & Sourcing)</span>
                </div>
              </div>
            </div>

            {/* Embedded Google Business Map */}
            <div className="pt-2">
              <GoogleBusinessMap
                cityName={city || 'Bucheki'}
                province="Punjab"
                customHeading="Amir Rice Trader – Sample Dispatch Desk (Noor Galla Mandi)"
                customSubheading="Daily courier bag sealing and laboratory grain inspection"
                height="240px"
                showDetailsGrid={false}
              />
            </div>

          </div>

        </div>

        {/* Google SEO Internal Linking Hub */}
        <div className="mt-14 bg-neutral-50 rounded-2xl p-6 sm:p-8 border border-neutral-200">
          <div className="flex items-center gap-2 mb-3">
            <span className="w-2 h-2 rounded-full bg-emerald-700"></span>
            <h3 className="text-xs font-bold uppercase tracking-wider text-emerald-950">
              Verified Rice Sourcing Internal Navigation Network
            </h3>
          </div>
          <p className="text-xs text-neutral-600 mb-6 leading-relaxed">
            Hashir Rice Supplier provides certified physical sample dispatch and full-truckload bulk trading across all provinces. Explore related portals:
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
            <div className="p-4 rounded-xl bg-white border border-neutral-200">
              <h4 className="font-bold text-neutral-900 mb-2 flex items-center gap-1.5">
                <Building2 className="w-3.5 h-3.5 text-emerald-700" />
                <span>Primary Portals</span>
              </h4>
              <ul className="space-y-1.5 text-neutral-600">
                <li>
                  <a
                    href="https://trade.hashirricesupplier.com/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-red-700 hover:underline font-bold text-red-600 flex items-center gap-1"
                  >
                    <span>• Add your rice sample (B2B Trade Portal)</span>
                  </a>
                </li>
                <li>
                  <a
                    href="/"
                    onClick={(e) => {
                      e.preventDefault();
                      setCurrentView('home');
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className="hover:text-emerald-900 hover:underline font-semibold text-emerald-900 flex items-center gap-1"
                  >
                    <span>• Wholesale Rice Supplier Pakistan Home</span>
                  </a>
                </li>
                <li>
                  <a
                    href="/locations"
                    onClick={(e) => {
                      e.preventDefault();
                      setCurrentView('locations');
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className="hover:text-emerald-900 hover:underline flex items-center gap-1"
                  >
                    <span>• Pakistan 60+ Sourcing Cities</span>
                  </a>
                </li>
                <li>
                  <a
                    href="/about"
                    onClick={(e) => {
                      e.preventDefault();
                      setCurrentView('about');
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className="hover:text-emerald-900 hover:underline flex items-center gap-1"
                  >
                    <span>• About Hashir Rice Desk</span>
                  </a>
                </li>
              </ul>
            </div>

            <div className="p-4 rounded-xl bg-white border border-neutral-200">
              <h4 className="font-bold text-neutral-900 mb-2 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-emerald-700" />
                <span>Varieties & Rates</span>
              </h4>
              <ul className="space-y-1.5 text-neutral-600">
                <li>
                  <a
                    href="/varieties"
                    onClick={(e) => {
                      e.preventDefault();
                      setCurrentView('varieties');
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className="hover:text-emerald-900 hover:underline flex items-center gap-1"
                  >
                    <span>• 10 Pakistan Rice Varieties</span>
                  </a>
                </li>
                <li>
                  <a
                    href="/exchange"
                    onClick={(e) => {
                      e.preventDefault();
                      setCurrentView('exchange');
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className="hover:text-emerald-900 hover:underline flex items-center gap-1"
                  >
                    <span>• Live Mandi Spot Rates</span>
                  </a>
                </li>
                <li>
                  <a
                    href="/google-ai-overview"
                    onClick={(e) => {
                      e.preventDefault();
                      setCurrentView('google-ai-overview');
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className="hover:text-emerald-900 hover:underline flex items-center gap-1"
                  >
                    <span>• Google AI Knowledge Hub</span>
                  </a>
                </li>
              </ul>
            </div>

            <div className="p-4 rounded-xl bg-white border border-neutral-200">
              <h4 className="font-bold text-neutral-900 mb-2 flex items-center gap-1.5">
                <FileCheck className="w-3.5 h-3.5 text-emerald-700" />
                <span>Workflow & Trading</span>
              </h4>
              <ul className="space-y-1.5 text-neutral-600">
                <li>
                  <a
                    href="/workflow"
                    onClick={(e) => {
                      e.preventDefault();
                      setCurrentView('workflow');
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className="hover:text-emerald-900 hover:underline font-semibold text-emerald-900 flex items-center gap-1"
                  >
                    <span>• 7-Step Verified Sourcing</span>
                  </a>
                </li>
                <li>
                  <a
                    href="/blog"
                    onClick={(e) => {
                      e.preventDefault();
                      setCurrentView('blog');
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className="hover:text-emerald-900 hover:underline flex items-center gap-1"
                  >
                    <span>• Commercial Cooking & Grain Blog</span>
                  </a>
                </li>
              </ul>
            </div>

            <div className="p-4 rounded-xl bg-white border border-neutral-200">
              <h4 className="font-bold text-neutral-900 mb-2 flex items-center gap-1.5">
                <HelpCircle className="w-3.5 h-3.5 text-emerald-700" />
                <span>Site Map & Directory</span>
              </h4>
              <ul className="space-y-1.5 text-neutral-600">
                <li>
                  <a
                    href="/sitemap"
                    onClick={(e) => {
                      e.preventDefault();
                      setCurrentView('sitemap');
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className="hover:text-emerald-900 hover:underline flex items-center gap-1"
                  >
                    <span>• HTML Sitemap & Complete Directory</span>
                  </a>
                </li>
                <li>
                  <a
                    href="/privacy"
                    onClick={(e) => {
                      e.preventDefault();
                      setCurrentView('privacy');
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className="hover:text-emerald-900 hover:underline flex items-center gap-1"
                  >
                    <span>• Privacy Policy</span>
                  </a>
                </li>
                <li>
                  <a
                    href="/terms"
                    onClick={(e) => {
                      e.preventDefault();
                      setCurrentView('terms');
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className="hover:text-emerald-900 hover:underline flex items-center gap-1"
                  >
                    <span>• Brokerage Terms of Trade</span>
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
