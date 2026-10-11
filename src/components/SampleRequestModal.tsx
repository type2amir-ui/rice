import React, { useState } from 'react';
import { RICE_VARIETIES } from '../data/riceData';
import { ALL_PAKISTAN_CITIES, CUSTOM_CITY_OPTION } from '../data/allPakistanCities';
import {
  X,
  Sparkles,
  MessageCircle,
  CheckCircle2,
  ShieldCheck,
  CookingPot,
  Truck,
  Wallet,
  Copy,
  Check,
  ArrowRight,
  ExternalLink,
  MapPin,
  Plus,
  AlertCircle
} from 'lucide-react';
import { recordNewInquiry, generateWhatsAppInquiryUrl, StoredInquiry } from '../utils/inquiryManager';
import { InquirySuccessModal } from './InquirySuccessModal';

interface SampleRequestModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialVariety?: string;
  initialCity?: string;
  onSuccessToast?: (msg: string) => void;
}

export const SampleRequestModal: React.FC<SampleRequestModalProps> = ({
  isOpen,
  onClose,
  initialVariety,
  initialCity,
  onSuccessToast,
}) => {
  const [variety, setVariety] = useState<string>(initialVariety || RICE_VARIETIES[0].name);
  const [businessType, setBusinessType] = useState<string>('Restaurant / Biryani Chain');
  const [fullName, setFullName] = useState<string>('');
  const [companyName, setCompanyName] = useState<string>('');
  const [phoneOrWhatsApp, setPhoneOrWhatsApp] = useState<string>('');
  const [city, setCity] = useState<string>(initialCity || 'Lahore');
  const [customCity, setCustomCity] = useState<string>('');
  const [address, setAddress] = useState<string>('');
  const [testPurpose, setTestPurpose] = useState<string>('Kitchen Daig / Pot Cooking Elongation Test');
  const [estimatedMonthlyVolume, setEstimatedMonthlyVolume] = useState<string>('10 to 20 Tons');
  const [easyPaisaTrx, setEasyPaisaTrx] = useState<string>('');
  const [copiedEasyPaisa, setCopiedEasyPaisa] = useState<boolean>(false);
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [validationError, setValidationError] = useState<string>('');

  React.useEffect(() => {
    if (isOpen) {
      if (initialVariety) setVariety(initialVariety);
      if (initialCity) {
        const exists = ALL_PAKISTAN_CITIES.some((c) => c.name.toLowerCase() === initialCity.toLowerCase());
        if (exists) {
          setCity(initialCity);
        } else {
          setCity(CUSTOM_CITY_OPTION);
          setCustomCity(initialCity);
        }
      }
      setIsSubmitted(false);
      setCopiedEasyPaisa(false);
      setValidationError('');
    }
  }, [isOpen, initialVariety, initialCity]);

  if (!isOpen) return null;

  const effectiveCity = city === CUSTOM_CITY_OPTION ? (customCity.trim() || 'Custom City') : city;

  const handleCopyEasyPaisa = () => {
    navigator.clipboard.writeText('03338990883');
    setCopiedEasyPaisa(true);
    setTimeout(() => setCopiedEasyPaisa(false), 2500);
    if (onSuccessToast) onSuccessToast('EasyPaisa Account Number copied: 0333 8990883');
  };

  const handleWhatsAppSampleSend = () => {
    if (!fullName.trim() || !phoneOrWhatsApp.trim() || !address.trim()) {
      setValidationError('Please provide your Name, WhatsApp Number, and Complete Delivery Address for sample dispatch.');
      return;
    }
    if (city === CUSTOM_CITY_OPTION && !customCity.trim()) {
      setValidationError('Please enter your Custom City / Mandi name.');
      return;
    }
    setValidationError('');

    const stored = recordNewInquiry({
      customerName: fullName,
      phone: phoneOrWhatsApp,
      city: effectiveCity,
      variety: variety,
      volume: `Free Sample Pack (${businessType} - ${estimatedMonthlyVolume}/mo)`,
      businessName: companyName,
      message: `Address: ${address}. Purpose: ${testPurpose}. EasyPaisa Ref: ${easyPaisaTrx || 'Pending'}.`,
      type: 'Free Physical Sample Requisition'
    });

    const text = encodeURIComponent(
      `*Physical Rice Sample Requisition (ID: ${stored.id})*\n\n` +
      `👤 *Buyer Name:* ${fullName}\n` +
      `🏢 *Company / Brand:* ${companyName || 'Business'}\n` +
      `💼 *Business Type:* ${businessType}\n` +
      `📞 *WhatsApp:* ${phoneOrWhatsApp}\n` +
      `📍 *Delivery City:* ${effectiveCity}\n` +
      `🏠 *Courier Address:* ${address}\n` +
      `🌾 *Requested Sample Variety:* ${variety}\n` +
      `🧪 *Testing Purpose:* ${testPurpose}\n` +
      `📈 *Target Monthly Volume:* ${estimatedMonthlyVolume}\n` +
      `📦 *Courier Expenses:* Rs. 1,000 courier fee via EasyPaisa to 0333 8990883 (Muhammad Amir Shahzad)\n` +
      (easyPaisaTrx ? `🔖 *EasyPaisa Ref / Sender:* ${easyPaisaTrx}\n\n` : '\n') +
      `_Please dispatch a sealed Free Sample with laboratory parameters (grain length & moisture)._`
    );

    window.open(`https://wa.me/923338990883?text=${text}`, '_blank');
    setIsSubmitted(true);
    if (onSuccessToast) onSuccessToast('Free sample requisition logged & WhatsApp opened to Muhammad Amir Shahzad!');
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim() || !phoneOrWhatsApp.trim() || !address.trim()) {
      setValidationError('Please fill all required fields: Name, Phone, and Courier Address.');
      return;
    }
    if (city === CUSTOM_CITY_OPTION && !customCity.trim()) {
      setValidationError('Please enter your Custom City / Mandi name.');
      return;
    }
    setValidationError('');

    const stored = recordNewInquiry({
      customerName: fullName,
      phone: phoneOrWhatsApp,
      city: effectiveCity,
      variety: variety,
      volume: `Free Sample Pack (${businessType} - ${estimatedMonthlyVolume}/mo)`,
      businessName: companyName,
      message: `Address: ${address}. Purpose: ${testPurpose}. EasyPaisa Ref: ${easyPaisaTrx || 'Pending'}.`,
      type: 'Free Physical Sample Requisition'
    });

    setIsSubmitted(true);
    if (onSuccessToast) onSuccessToast(`Free sample request #${stored.id} submitted for ${effectiveCity}!`);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs animate-fadeIn">
      <div
        className="bg-white w-full max-w-2xl rounded-2xl overflow-hidden shadow-2xl border border-neutral-200 max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-white border-b border-neutral-200 text-neutral-900 p-6 relative shrink-0">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full bg-neutral-100 hover:bg-neutral-200 text-neutral-700 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded bg-emerald-100 text-emerald-900 text-[10px] font-bold uppercase tracking-wider mb-2 border border-emerald-200">
            <CookingPot className="w-3.5 h-3.5 text-emerald-700" />
            <span>Sample-Verified Buying Protocol</span>
          </div>

          <h2 className="font-serif text-2xl font-bold tracking-tight text-neutral-950">
            Request a Free Physical Rice Cooking Sample
          </h2>
          <p className="text-xs text-neutral-600 mt-1 max-w-lg">
            Inspect raw grain length, moisture %, and test cook in your kitchen or commercial daig with our official sealed test lot before committing to bulk wholesale orders.
          </p>
        </div>

        {/* Form Body */}
        <form onSubmit={handleFormSubmit} className="p-6 overflow-y-auto space-y-4 text-xs flex-1">
          {/* Sample Confirmation Notice */}
          <div className="flex items-center justify-between p-2.5 rounded-lg bg-emerald-50 border border-emerald-200">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-emerald-800 shrink-0" />
              <span className="font-bold text-neutral-900 text-xs">
                Official Sample: <span className="text-emerald-900 font-extrabold">100% Free Sample (No Product Cost)</span>
              </span>
            </div>
            <span className="px-2 py-0.5 rounded bg-emerald-700 text-white font-black text-[10px] uppercase">
              Free Sample
            </span>
          </div>

          {/* Variety & Business */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold text-neutral-800 mb-1">
                Select Rice Variety for Sample *
              </label>
              <select
                value={variety}
                onChange={(e) => setVariety(e.target.value)}
                className="w-full px-3 py-2 bg-neutral-50 border border-neutral-300 rounded-lg text-neutral-900 focus:outline-none focus:border-emerald-800"
              >
                {RICE_VARIETIES.map((v) => (
                  <option key={v.id} value={v.name}>
                    {v.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-semibold text-neutral-800 mb-1">
                Your Business Category
              </label>
              <select
                value={businessType}
                onChange={(e) => setBusinessType(e.target.value)}
                className="w-full px-3 py-2 bg-neutral-50 border border-neutral-300 rounded-lg text-neutral-900 focus:outline-none focus:border-emerald-800"
              >
                <option value="Restaurant / Biryani Chain">Restaurant / Biryani Chain</option>
                <option value="Wholesale Mandi Merchant">Wholesale Grain Stockist</option>
                <option value="Catering & Banquet Contractor">Catering & Banquet Contractor</option>
                <option value="Supermarket / Grocery Retailer">Supermarket / Grocery Retailer</option>
                <option value="Export Trading Company">Export Trading House</option>
                <option value="Industrial Canteen">Industrial Canteen</option>
              </select>
            </div>
          </div>

          {/* Contact Details */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold text-neutral-800 mb-1">
                Contact Person Name *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Asad Ullah"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full px-3 py-2 bg-neutral-50 border border-neutral-300 rounded-lg text-neutral-900 focus:outline-none focus:border-emerald-800"
              />
            </div>

            <div>
              <label className="block font-semibold text-neutral-800 mb-1">
                Company / Restaurant Name
              </label>
              <input
                type="text"
                placeholder="e.g. Karachi Biryani House"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                className="w-full px-3 py-2 bg-neutral-50 border border-neutral-300 rounded-lg text-neutral-900 focus:outline-none focus:border-emerald-800"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold text-neutral-800 mb-1">
                WhatsApp / Mobile Number *
              </label>
              <input
                type="tel"
                required
                placeholder="+92 3XX XXXXXXX"
                value={phoneOrWhatsApp}
                onChange={(e) => setPhoneOrWhatsApp(e.target.value)}
                className="w-full px-3 py-2 bg-neutral-50 border border-neutral-300 rounded-lg text-neutral-900 focus:outline-none focus:border-emerald-800"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block font-semibold text-neutral-800">
                  Destination City in Pakistan *
                </label>
                <button
                  type="button"
                  onClick={() => setCity(CUSTOM_CITY_OPTION)}
                  className="text-[11px] text-emerald-800 hover:text-emerald-950 font-bold flex items-center gap-0.5 hover:underline cursor-pointer"
                >
                  <Plus className="w-3 h-3" />
                  <span>Custom city name Add</span>
                </button>
              </div>
              <select
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="w-full px-3 py-2 bg-neutral-50 border border-neutral-300 rounded-lg text-neutral-900 focus:outline-none focus:border-emerald-800 text-xs"
              >
                <option value={CUSTOM_CITY_OPTION} className="font-bold text-emerald-800 bg-emerald-50">
                  ✍️ + Custom city name Add (اپنا شہر / منڈی خود درج کریں)
                </option>

                <optgroup label="🌟 Major Mandis & Metropolises">
                  {ALL_PAKISTAN_CITIES.filter(c => c.isMajorMandi).map((c) => (
                    <option key={`sample-maj-${c.name}`} value={c.name}>
                      {c.name} ({c.province})
                    </option>
                  ))}
                </optgroup>

                <optgroup label="🌾 Punjab (All Mandi Districts)">
                  {ALL_PAKISTAN_CITIES.filter(c => c.province === 'Punjab' && !c.isMajorMandi).map((c) => (
                    <option key={`sample-pb-${c.name}`} value={c.name}>
                      {c.name} (Punjab)
                    </option>
                  ))}
                </optgroup>

                <optgroup label="🚢 Sindh (All Hubs & Districts)">
                  {ALL_PAKISTAN_CITIES.filter(c => c.province === 'Sindh' && !c.isMajorMandi).map((c) => (
                    <option key={`sample-sd-${c.name}`} value={c.name}>
                      {c.name} (Sindh)
                    </option>
                  ))}
                </optgroup>

                <optgroup label="🏔️ Khyber Pakhtunkhwa">
                  {ALL_PAKISTAN_CITIES.filter(c => c.province === 'Khyber Pakhtunkhwa' && !c.isMajorMandi).map((c) => (
                    <option key={`sample-kpk-${c.name}`} value={c.name}>
                      {c.name} (KPK)
                    </option>
                  ))}
                </optgroup>

                <optgroup label="🏜️ Balochistan">
                  {ALL_PAKISTAN_CITIES.filter(c => c.province === 'Balochistan' && !c.isMajorMandi).map((c) => (
                    <option key={`sample-bal-${c.name}`} value={c.name}>
                      {c.name} (Balochistan)
                    </option>
                  ))}
                </optgroup>

                <optgroup label="🌲 Azad Kashmir & Gilgit-Baltistan">
                  {ALL_PAKISTAN_CITIES.filter(c => c.province.includes('Kashmir') || c.province.includes('Gilgit')).map((c) => (
                    <option key={`sample-other-${c.name}`} value={c.name}>
                      {c.name} ({c.province})
                    </option>
                  ))}
                </optgroup>
              </select>

              {/* Custom City Name Input */}
              {city === CUSTOM_CITY_OPTION && (
                <div className="mt-2.5 p-2 rounded-lg bg-emerald-50 border border-emerald-300 space-y-1 animate-fadeIn">
                  <div className="flex items-center justify-between">
                    <label className="text-[11px] font-bold text-emerald-950 flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-emerald-700" />
                      <span>Enter Custom City / Town / Mandi *</span>
                    </label>
                  </div>
                  <input
                    type="text"
                    required={city === CUSTOM_CITY_OPTION}
                    placeholder="e.g. Chiniot, Burewala, Hub, Sanghar..."
                    value={customCity}
                    onChange={(e) => setCustomCity(e.target.value)}
                    className="w-full px-2.5 py-1.5 bg-white border border-emerald-400 rounded text-xs font-semibold text-neutral-900 focus:outline-none"
                    autoFocus
                  />
                </div>
              )}
            </div>
          </div>

          <div>
            <label className="block font-semibold text-neutral-800 mb-1">
              Complete Delivery Address for Courier Dispatch *
            </label>
            <textarea
              rows={2}
              required
              placeholder="Shop/Office number, Street, Commercial market / Mandi area, City..."
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="w-full px-3 py-2 bg-neutral-50 border border-neutral-300 rounded-lg text-neutral-900 focus:outline-none focus:border-emerald-800 resize-none"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold text-neutral-800 mb-1">
                Testing Purpose
              </label>
              <select
                value={testPurpose}
                onChange={(e) => setTestPurpose(e.target.value)}
                className="w-full px-3 py-2 bg-neutral-50 border border-neutral-300 rounded-lg text-neutral-900 focus:outline-none focus:border-emerald-800"
              >
                <option value="Kitchen Daig / Pot Cooking Elongation Test">Kitchen Daig / Pot Cooking Test</option>
                <option value="Restaurant Menu Standard Trial">Restaurant Menu Standard Trial</option>
                <option value="Wholesale Batch Quality Inspection">Wholesale Batch Quality Inspection</option>
                <option value="Packaging & Moisture Laboratory Analysis">Packaging & Moisture Lab Analysis</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold text-neutral-800 mb-1">
                Target Monthly Volume
              </label>
              <select
                value={estimatedMonthlyVolume}
                onChange={(e) => setEstimatedMonthlyVolume(e.target.value)}
                className="w-full px-3 py-2 bg-neutral-50 border border-neutral-300 rounded-lg text-neutral-900 focus:outline-none focus:border-emerald-800"
              >
                <option value="5 to 10 Metric Tons">5 to 10 Metric Tons</option>
                <option value="10 to 20 Metric Tons">10 to 20 Metric Tons</option>
                <option value="20 to 50 Metric Tons (1-2 Trucks)">20 to 50 Metric Tons (1-2 Trucks)</option>
                <option value="50+ Metric Tons (Weekly Supply)">50+ Metric Tons (Weekly Supply)</option>
              </select>
            </div>
          </div>

          {/* Sourcing Seal Guarantee Notice */}
          <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 text-neutral-700 flex items-start gap-2.5">
            <ShieldCheck className="w-4 h-4 text-emerald-800 shrink-0 mt-0.5" />
            <div className="space-y-0.5">
              <span className="font-bold text-emerald-950 block">Sample Sealing Guarantee:</span>
              <p className="text-[11px] text-neutral-600">
                When you approve a sample lot, we retain a duplicate sealed test vial. All subsequent truckloads are matched strictly against this approved master batch.
              </p>
            </div>
          </div>

          {/* EasyPaisa Courier Expenses Section */}
          <div className="p-4 rounded-xl bg-gradient-to-br from-emerald-50 via-green-50/60 to-white border-2 border-emerald-500/40 space-y-3 shadow-xs">
            <div className="flex items-start justify-between gap-2">
              <div className="flex items-start gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-emerald-700 text-white flex items-center justify-center shrink-0 mt-0.5 shadow-xs">
                  <Wallet className="w-4 h-4" />
                </div>
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-bold text-neutral-950 text-xs">EasyPaisa Courier & Dispatch Expenses</span>
                    <span className="px-2 py-0.5 rounded-full bg-emerald-600 text-white font-black text-[10px] tracking-wide uppercase">
                      easypaisa
                    </span>
                    <span className="px-2 py-0.5 rounded-full bg-amber-400 text-emerald-950 font-black text-[10px] tracking-wide">
                      Rs. 1,000 Fixed Courier Fee
                    </span>
                  </div>
                  <p className="text-[11px] text-neutral-600 mt-0.5">
                    <strong>Note:</strong> The physical rice sample is provided <strong>100% free of product cost (Free Sample)</strong> from verified partner mills. A flat fee of <strong>Rs. 1,000 (One Thousand Rupees)</strong> covers courier & packaging delivery expenses (TCS / Leopards courier service across Pakistan).
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
                placeholder="Sender Mobile or EasyPaisa Trx ID (Optional if already sent)"
                value={easyPaisaTrx}
                onChange={(e) => setEasyPaisaTrx(e.target.value)}
                className="flex-1 px-3 py-2 bg-white border border-neutral-300 rounded-lg text-neutral-900 text-xs focus:outline-none focus:border-emerald-800"
              />
              <a
                href={`https://wa.me/923338990883?text=${encodeURIComponent(
                  `Hello Hashir Rice Supplier, I want to send Rs. 1,000 courier expenses via EasyPaisa to Muhammad Amir Shahzad (0333 8990883) for physical sample dispatch (${variety}).`
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-3.5 py-2 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-colors shrink-0 shadow-2xs"
              >
                <MessageCircle className="w-3.5 h-3.5 text-white" />
                <span>Share Rs. 1,000 Slip on WhatsApp</span>
              </a>
            </div>
          </div>

          {validationError && (
            <div className="p-3 bg-red-50 border border-red-200 text-red-800 rounded-xl flex items-center gap-2 text-xs">
              <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
              <span>{validationError}</span>
            </div>
          )}

          {/* Action Buttons */}
          <div className="pt-2 flex flex-col sm:flex-row gap-2.5">
            <button
              type="button"
              onClick={handleWhatsAppSampleSend}
              className="flex-1 py-3 rounded-xl bg-emerald-900 hover:bg-emerald-950 text-white font-bold shadow-sm transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-98"
            >
              <MessageCircle className="w-4 h-4 fill-white" />
              <span>Confirm Sample & Send on WhatsApp (+92 333 8990883)</span>
            </button>

            <button
              type="submit"
              className="py-3 px-5 rounded-xl bg-neutral-100 hover:bg-neutral-200 text-neutral-900 font-bold border border-neutral-300 shadow-2xs transition-all cursor-pointer"
            >
              Submit Request Direct
            </button>
          </div>

          {isSubmitted && (
            <div className="p-4 bg-emerald-50 text-emerald-950 border-2 border-emerald-400 rounded-xl space-y-2.5 animate-fadeIn">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-700 shrink-0" />
                <span className="font-bold text-sm">Sample Requisition Recorded Successfully!</span>
              </div>
              <p className="text-xs text-neutral-700">
                Your free physical cooking sample for <strong>{variety}</strong> will be prepared for courier dispatch to <strong>{city}</strong>.
              </p>
              <div className="p-3 bg-white rounded-lg border border-emerald-200 text-xs space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-emerald-900 block">Next Step: Courier Charges Confirmation:</span>
                  <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-950 font-bold text-[10px]">Fee: Rs. 1,000</span>
                </div>
                <p className="text-[11px] text-neutral-600">
                  Please transfer the <strong>Rs. 1,000</strong> courier delivery expenses via <strong>EasyPaisa</strong> to:
                </p>
                <div className="flex items-center justify-between font-mono font-bold bg-neutral-50 px-3 py-1.5 rounded border border-neutral-200">
                  <span>0333 8990883 (Muhammad Amir Shahzad)</span>
                  <button
                    type="button"
                    onClick={handleCopyEasyPaisa}
                    className="text-emerald-800 hover:underline text-[11px] font-sans font-semibold"
                  >
                    {copiedEasyPaisa ? 'Copied!' : 'Copy'}
                  </button>
                </div>
                <p className="text-[11px] text-neutral-500">
                  After sending, share your Rs. 1,000 payment screenshot on WhatsApp to receive the TCS / Leopards courier tracking receipt immediately.
                </p>
              </div>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};
