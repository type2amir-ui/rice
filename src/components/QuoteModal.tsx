import React, { useState } from 'react';
import { RICE_VARIETIES } from '../data/riceData';
import { ALL_PAKISTAN_CITIES, CUSTOM_CITY_OPTION } from '../data/allPakistanCities';
import { X, Sparkles, MessageCircle, CheckCircle2, ShieldCheck, ArrowRight, MapPin, Plus, AlertCircle } from 'lucide-react';
import { recordNewInquiry, generateWhatsAppInquiryUrl, StoredInquiry } from '../utils/inquiryManager';
import { InquirySuccessModal } from './InquirySuccessModal';

interface QuoteModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialVariety?: string;
  initialCity?: string;
  onSuccessToast?: (msg: string) => void;
}

export const QuoteModal: React.FC<QuoteModalProps> = ({
  isOpen,
  onClose,
  initialVariety,
  initialCity,
  onSuccessToast,
}) => {
  const [variety, setVariety] = useState<string>(initialVariety || RICE_VARIETIES[0].name);
  const [quantity, setQuantity] = useState<string>('10 Metric Tons (200 Bags of 50kg)');
  const [packaging, setPackaging] = useState<string>('50 kg Standard Woven PP Bag');
  const [city, setCity] = useState<string>(initialCity || 'Lahore');
  const [customCity, setCustomCity] = useState<string>('');
  const [fullName, setFullName] = useState<string>('');
  const [companyName, setCompanyName] = useState<string>('');
  const [phone, setPhone] = useState<string>('');
  const [targetRate, setTargetRate] = useState<string>('');
  const [validationError, setValidationError] = useState<string>('');
  const [activeInquiryModal, setActiveInquiryModal] = useState<StoredInquiry | null>(null);

  React.useEffect(() => {
    if (isOpen) {
      if (initialVariety) setVariety(initialVariety);
      if (initialCity) {
        // If initialCity is not in standard list, set as custom
        const exists = ALL_PAKISTAN_CITIES.some((c) => c.name.toLowerCase() === initialCity.toLowerCase());
        if (exists) {
          setCity(initialCity);
        } else {
          setCity(CUSTOM_CITY_OPTION);
          setCustomCity(initialCity);
        }
      }
      setValidationError('');
      setActiveInquiryModal(null);
    }
  }, [isOpen, initialVariety, initialCity]);

  if (!isOpen) return null;

  const effectiveCity = city === CUSTOM_CITY_OPTION ? (customCity.trim() || 'Custom City') : city;

  const handleWhatsAppSend = () => {
    if (!fullName.trim() || !phone.trim()) {
      setValidationError('Please fill in your Name and Phone/WhatsApp Number.');
      return;
    }
    if (city === CUSTOM_CITY_OPTION && !customCity.trim()) {
      setValidationError('Please enter your Custom City / Mandi name.');
      return;
    }
    setValidationError('');

    const stored = recordNewInquiry({
      customerName: fullName,
      phone: phone,
      city: effectiveCity,
      variety: variety,
      volume: `${quantity} (${packaging})`,
      businessName: companyName,
      message: targetRate ? `Target Price: ${targetRate}` : undefined,
      type: 'Wholesale Quotation Request'
    });

    const waUrl = generateWhatsAppInquiryUrl({
      customerName: fullName,
      phone: phone,
      city: effectiveCity,
      variety: variety,
      volume: `${quantity} (${packaging})`,
      businessName: companyName,
      message: targetRate ? `Target Price: ${targetRate}` : undefined,
      inquiryId: stored.id
    });

    window.open(waUrl, '_blank');
    setActiveInquiryModal(stored);
    if (onSuccessToast) onSuccessToast('Quotation logged & WhatsApp opened to Muhammad Amir Shahzad!');
  };

  const handleSubmitDirect = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim() || !phone.trim()) {
      setValidationError('Please provide your Name and Phone number.');
      return;
    }
    if (city === CUSTOM_CITY_OPTION && !customCity.trim()) {
      setValidationError('Please enter your Custom City / Mandi name.');
      return;
    }
    setValidationError('');

    const stored = recordNewInquiry({
      customerName: fullName,
      phone: phone,
      city: effectiveCity,
      variety: variety,
      volume: `${quantity} (${packaging})`,
      businessName: companyName,
      message: targetRate ? `Target Price: ${targetRate}` : undefined,
      type: 'Wholesale Quotation Request'
    });

    setActiveInquiryModal(stored);
    if (onSuccessToast) onSuccessToast(`Inquiry #${stored.id} logged for ${effectiveCity}!`);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs animate-fadeIn">
      <div
        className="bg-white w-full max-w-xl rounded-2xl overflow-hidden shadow-2xl border border-neutral-200 max-h-[90vh] flex flex-col"
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
            <Sparkles className="w-3.5 h-3.5 text-emerald-700" />
            <span>Fast Mandi Rate Inquiry</span>
          </div>

          <h2 className="font-serif text-2xl font-bold tracking-tight text-neutral-950">
            Request Bulk Rice Wholesale Quotation
          </h2>
          <p className="text-xs text-neutral-600 mt-0.5">
            Get transparent multi-mill pricing, bag packing options, and freight delivery terms.
          </p>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmitDirect} className="p-6 overflow-y-auto space-y-4 text-xs flex-1">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold text-neutral-800 mb-1">
                Select Rice Variety *
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
                Estimated Volume *
              </label>
              <select
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                className="w-full px-3 py-2 bg-neutral-50 border border-neutral-300 rounded-lg text-neutral-900 focus:outline-none focus:border-emerald-800"
              >
                <option value="5 Metric Tons (100 Bags of 50kg)">5 Metric Tons (100 Bags of 50kg)</option>
                <option value="10 Metric Tons (200 Bags of 50kg)">10 Metric Tons (200 Bags of 50kg)</option>
                <option value="20 Metric Tons (Full Truck Load)">20 Metric Tons (Full Truck Load)</option>
                <option value="30 to 50 Metric Tons (Trailer Load)">30 to 50 Metric Tons (Trailer Load)</option>
                <option value="Recurring Monthly Supply (50+ Tons)">Recurring Monthly Supply (50+ Tons)</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold text-neutral-800 mb-1">
                Packaging Specification
              </label>
              <select
                value={packaging}
                onChange={(e) => setPackaging(e.target.value)}
                className="w-full px-3 py-2 bg-neutral-50 border border-neutral-300 rounded-lg text-neutral-900 focus:outline-none focus:border-emerald-800"
              >
                <option value="50 kg Standard Woven PP Bag">50 kg Standard Woven PP Bag</option>
                <option value="25 kg Laminated BOPP Bag">25 kg Laminated BOPP Bag</option>
                <option value="10 kg Master Sack Packaging">10 kg Master Sack Packaging</option>
                <option value="Non-Woven Eco Fabric Bag">Non-Woven Eco Fabric Bag</option>
                <option value="Custom Private Label Printed Bags">Custom Private Label Printed Bags</option>
              </select>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block font-semibold text-neutral-800">
                  Delivery City in Pakistan *
                </label>
                <button
                  type="button"
                  onClick={() => {
                    setCity(CUSTOM_CITY_OPTION);
                  }}
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
                
                <optgroup label="🌟 Major Mandi & Consumption Metropolises">
                  {ALL_PAKISTAN_CITIES.filter(c => c.isMajorMandi).map((c) => (
                    <option key={`major-${c.name}`} value={c.name}>
                      {c.name} ({c.province})
                    </option>
                  ))}
                </optgroup>

                <optgroup label="🌾 Punjab (Mandi Network & Industrial Belts)">
                  {ALL_PAKISTAN_CITIES.filter(c => c.province === 'Punjab' && !c.isMajorMandi).map((c) => (
                    <option key={`pb-${c.name}`} value={c.name}>
                      {c.name} (Punjab)
                    </option>
                  ))}
                </optgroup>

                <optgroup label="🚢 Sindh (Ports, Rice Belts & Mandis)">
                  {ALL_PAKISTAN_CITIES.filter(c => c.province === 'Sindh' && !c.isMajorMandi).map((c) => (
                    <option key={`sd-${c.name}`} value={c.name}>
                      {c.name} (Sindh)
                    </option>
                  ))}
                </optgroup>

                <optgroup label="🏔️ Khyber Pakhtunkhwa (Northern Corridor)">
                  {ALL_PAKISTAN_CITIES.filter(c => c.province === 'Khyber Pakhtunkhwa' && !c.isMajorMandi).map((c) => (
                    <option key={`kpk-${c.name}`} value={c.name}>
                      {c.name} (KPK)
                    </option>
                  ))}
                </optgroup>

                <optgroup label="🏜️ Balochistan (Border Hubs & Coastal)">
                  {ALL_PAKISTAN_CITIES.filter(c => c.province === 'Balochistan' && !c.isMajorMandi).map((c) => (
                    <option key={`bal-${c.name}`} value={c.name}>
                      {c.name} (Balochistan)
                    </option>
                  ))}
                </optgroup>

                <optgroup label="🌲 Azad Kashmir & Gilgit-Baltistan">
                  {ALL_PAKISTAN_CITIES.filter(c => c.province.includes('Kashmir') || c.province.includes('Gilgit')).map((c) => (
                    <option key={`other-${c.name}`} value={c.name}>
                      {c.name} ({c.province})
                    </option>
                  ))}
                </optgroup>
              </select>

              {/* Custom City Name Input */}
              {city === CUSTOM_CITY_OPTION && (
                <div className="mt-2.5 p-2.5 rounded-lg bg-emerald-50 border border-emerald-300 space-y-1.5 animate-fadeIn">
                  <div className="flex items-center justify-between">
                    <label className="text-[11px] font-bold text-emerald-950 flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-emerald-700" />
                      <span>Enter Custom City / Town / Mandi Name *</span>
                    </label>
                    <span className="text-[10px] text-emerald-700 font-medium">Any location in Pakistan</span>
                  </div>
                  <input
                    type="text"
                    required={city === CUSTOM_CITY_OPTION}
                    placeholder="e.g. Chiniot, Burewala, Hub Chowki, Sanghar, Daska..."
                    value={customCity}
                    onChange={(e) => setCustomCity(e.target.value)}
                    className="w-full px-3 py-1.5 bg-white border border-emerald-400 rounded text-xs font-semibold text-neutral-900 focus:outline-none focus:ring-1 focus:ring-emerald-700 placeholder:text-neutral-400"
                    autoFocus
                  />
                  <p className="text-[10px] text-emerald-800">
                    We coordinate direct freight bilty & truckloads to every tehsil, mandi, and transport terminal across Pakistan.
                  </p>
                </div>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold text-neutral-800 mb-1">
                Your Full Name *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Tariq Mehmood"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full px-3 py-2 bg-neutral-50 border border-neutral-300 rounded-lg text-neutral-900 focus:outline-none focus:border-emerald-800"
              />
            </div>

            <div>
              <label className="block font-semibold text-neutral-800 mb-1">
                Business / Mandi Commission Shop
              </label>
              <input
                type="text"
                placeholder="e.g. Tariq Traders"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                className="w-full px-3 py-2 bg-neutral-50 border border-neutral-300 rounded-lg text-neutral-900 focus:outline-none focus:border-emerald-800"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold text-neutral-800 mb-1">
                Phone / WhatsApp Number *
              </label>
              <input
                type="tel"
                required
                placeholder="+92 3XX XXXXXXX"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full px-3 py-2 bg-neutral-50 border border-neutral-300 rounded-lg text-neutral-900 focus:outline-none focus:border-emerald-800"
              />
            </div>

            <div>
              <label className="block font-semibold text-neutral-800 mb-1">
                Target Rate per KG or 40KG (Optional)
              </label>
              <input
                type="text"
                placeholder="e.g. PKR 320 / kg"
                value={targetRate}
                onChange={(e) => setTargetRate(e.target.value)}
                className="w-full px-3 py-2 bg-neutral-50 border border-neutral-300 rounded-lg text-neutral-900 focus:outline-none focus:border-emerald-800"
              />
            </div>
          </div>

          <div className="p-3 bg-neutral-100 rounded-xl text-neutral-700 text-[11px] flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-800 shrink-0" />
            <span>
              Rates quoted on transparent ex-mill or FOR destination basis with verified bag weight inspection.
            </span>
          </div>

          {validationError && (
            <div className="p-3 bg-red-50 border border-red-200 text-red-800 rounded-xl flex items-center gap-2 text-xs">
              <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
              <span>{validationError}</span>
            </div>
          )}

          <div className="pt-2 flex flex-col sm:flex-row gap-3">
            <button
              type="button"
              onClick={handleWhatsAppSend}
              className="flex-1 py-3 rounded-xl bg-emerald-900 hover:bg-emerald-950 text-white font-bold shadow-sm transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <MessageCircle className="w-4 h-4 fill-white" />
              <span>Send to WhatsApp (+92 333 8990883)</span>
            </button>

            <button
              type="submit"
              className="py-3 px-5 rounded-xl bg-amber-400 hover:bg-amber-300 text-neutral-950 font-bold shadow-xs transition-all cursor-pointer"
            >
              Submit Inquiry
            </button>
          </div>

          <div className="text-[11px] text-neutral-500 flex items-center gap-1.5 pt-1">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>Instantly notifies trade desk (+92 333 8990883) and records order to Admin Inquiries pipeline.</span>
          </div>
        </form>
      </div>

      {/* Inquiry Success & Instant Notification Modal */}
      <InquirySuccessModal
        isOpen={Boolean(activeInquiryModal)}
        onClose={() => setActiveInquiryModal(null)}
        inquiry={activeInquiryModal}
      />
    </div>
  );
};
