import React, { useState } from 'react';
import { RICE_VARIETIES } from '../data/riceData';
import { ALL_PAKISTAN_CITIES, CUSTOM_CITY_OPTION } from '../data/allPakistanCities';
import { Sparkles, MessageCircle, Calculator, CheckCircle2, ShieldCheck, ArrowRight, Truck, Box, MapPin, Plus } from 'lucide-react';

interface QuoteEstimatorProps {
  initialVariety?: string;
  onSuccessToast?: (msg: string) => void;
}

export const QuoteEstimator: React.FC<QuoteEstimatorProps> = ({ initialVariety, onSuccessToast }) => {
  const [variety, setVariety] = useState<string>(initialVariety || RICE_VARIETIES[0].name);
  const [quantityValue, setQuantityValue] = useState<number>(10);
  const [quantityUnit, setQuantityUnit] = useState<'Tons' | '50kg Bags' | '25kg Bags'>('Tons');
  const [packagingType, setPackagingType] = useState<string>('50 kg Standard Woven PP Bag');
  const [destinationCity, setDestinationCity] = useState<string>('Lahore');
  const [customCity, setCustomCity] = useState<string>('');
  const [buyerType, setBuyerType] = useState<string>('Wholesale Mandi Merchant');
  const [fullName, setFullName] = useState<string>('');
  const [companyName, setCompanyName] = useState<string>('');
  const [phoneOrWhatsApp, setPhoneOrWhatsApp] = useState<string>('');
  const [notes, setNotes] = useState<string>('');
  const [submitted, setSubmitted] = useState<boolean>(false);

  // Derived metrics
  const totalWeightInKg = quantityUnit === 'Tons'
    ? quantityValue * 1000
    : quantityUnit === '50kg Bags'
    ? quantityValue * 50
    : quantityValue * 25;

  const totalBags50kg = Math.round(totalWeightInKg / 50);
  const totalBags25kg = Math.round(totalWeightInKg / 25);
  const estimatedTruckCapacity = totalWeightInKg >= 25000
    ? 'Full Trailer Load (25-40 Tons)'
    : totalWeightInKg >= 10000
    ? 'Standard 6-Wheeler Truck (10-15 Tons)'
    : 'Medium Commercial Mazda / Shared Load (5-10 Tons)';

  const selectedCityObj = ALL_PAKISTAN_CITIES.find((c) => c.name === destinationCity);
  const effectiveDestinationCity = destinationCity === CUSTOM_CITY_OPTION ? (customCity.trim() || 'Custom City') : destinationCity;
  const destinationProvince = selectedCityObj?.province || 'Pakistan';

  const handleWhatsAppSend = () => {
    if (destinationCity === CUSTOM_CITY_OPTION && !customCity.trim()) {
      alert('Please enter your Custom City / Mandi name.');
      return;
    }

    const text = encodeURIComponent(
      `*New Wholesale Rice Sourcing Inquiry*\n\n` +
      `👤 *Name:* ${fullName || 'Interested Buyer'}\n` +
      `🏢 *Company:* ${companyName || 'Business'}\n` +
      `📞 *Phone/WhatsApp:* ${phoneOrWhatsApp || 'Provided in chat'}\n` +
      `🌾 *Variety:* ${variety}\n` +
      `⚖️ *Volume:* ${quantityValue} ${quantityUnit} (Approx. ${totalWeightInKg.toLocaleString()} KG / ${totalBags50kg} Bags of 50kg)\n` +
      `📦 *Packaging:* ${packagingType}\n` +
      `📍 *Destination:* ${effectiveDestinationCity} (${destinationProvince})\n` +
      `💼 *Buyer Type:* ${buyerType}\n` +
      (notes ? `📝 *Notes:* ${notes}\n\n` : '\n') +
      `_Please share available mill batches, samples, and ex-mill/FOR rates._`
    );

    window.open(`https://wa.me/923338990883?text=${text}`, '_blank');
    setSubmitted(true);
    if (onSuccessToast) onSuccessToast('Inquiry drafted and WhatsApp opened!');
  };

  const handleDirectFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName || !phoneOrWhatsApp) {
      alert('Please fill in your Name and Phone/WhatsApp number to receive your quote.');
      return;
    }
    if (destinationCity === CUSTOM_CITY_OPTION && !customCity.trim()) {
      alert('Please enter your Custom City / Mandi name.');
      return;
    }
    setSubmitted(true);
    if (onSuccessToast) onSuccessToast(`Wholesale quote request logged for ${effectiveDestinationCity}! Our broker team will contact you shortly.`);
  };

  return (
    <section id="quote-calculator" className="py-16 bg-white text-neutral-900 border-b border-neutral-200 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-emerald-100 text-emerald-900 text-xs font-bold uppercase tracking-wider mb-2 border border-emerald-200">
            <Calculator className="w-3.5 h-3.5 text-emerald-800" />
            B2B Bulk Sourcing Estimator
          </div>
          <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-bold text-neutral-950 tracking-tight">
            Calculate Volume & Request a Real-Time Wholesale Rate
          </h2>
          <p className="mt-3 text-neutral-600 text-sm leading-relaxed">
            Select your required rice variety, packaging style, volume, and delivery destination across Pakistan. We calculate freight configuration and connect you with matching mills.
          </p>
        </div>

        {/* 2-Column Calculator Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Input Form */}
          <div className="lg:col-span-7 bg-neutral-50/70 rounded-2xl p-6 sm:p-8 border border-neutral-200 shadow-sm space-y-6">
            <form onSubmit={handleDirectFormSubmit} className="space-y-5">
              {/* Step 1: Variety & Buyer Profile */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-neutral-800 mb-1.5">
                    Rice Variety
                  </label>
                  <select
                    value={variety}
                    onChange={(e) => setVariety(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-white border border-neutral-300 rounded-xl text-xs text-neutral-900 focus:outline-none focus:border-emerald-800 focus:ring-1 focus:ring-emerald-800/40 transition-colors shadow-2xs"
                  >
                    {RICE_VARIETIES.map((v) => (
                      <option key={v.id} value={v.name} className="bg-white text-neutral-900">
                        {v.name} ({v.specs.averageGrainLength.split(' ')[0]}mm)
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-neutral-800 mb-1.5">
                    Your Business Category
                  </label>
                  <select
                    value={buyerType}
                    onChange={(e) => setBuyerType(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-white border border-neutral-300 rounded-xl text-xs text-neutral-900 focus:outline-none focus:border-emerald-800 focus:ring-1 focus:ring-emerald-800/40 transition-colors shadow-2xs"
                  >
                    <option value="Wholesale Mandi Merchant">Wholesale Mandi Merchant / Commission Agent</option>
                    <option value="Restaurant / Biryani Franchise">Restaurant / Biryani Chain</option>
                    <option value="Wedding / Banquet Caterer">Wedding & Banquet Caterer</option>
                    <option value="Supermarket / Retail Brand">Supermarket Chain / Retail Brand</option>
                    <option value="Export Trading Company">Export Trading House</option>
                    <option value="Industrial Mess / Food Processor">Industrial Canteen / Food Processor</option>
                  </select>
                </div>
              </div>

              {/* Step 2: Quantity & Units */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold uppercase tracking-wider text-neutral-800 mb-1.5">
                    Required Quantity Volume
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      min={1}
                      max={10000}
                      value={quantityValue}
                      onChange={(e) => setQuantityValue(Math.max(1, Number(e.target.value)))}
                      className="w-full px-3.5 py-2.5 bg-white border border-neutral-300 rounded-xl text-sm font-bold text-neutral-900 focus:outline-none focus:border-emerald-800 focus:ring-1 focus:ring-emerald-800/40 shadow-2xs"
                    />
                    <select
                      value={quantityUnit}
                      onChange={(e) => setQuantityUnit(e.target.value as any)}
                      className="px-3 py-2.5 bg-white border border-neutral-300 rounded-xl text-xs text-neutral-900 font-medium focus:outline-none focus:border-emerald-800 shrink-0 shadow-2xs"
                    >
                      <option value="Tons">Metric Tons</option>
                      <option value="50kg Bags">50kg Bags</option>
                      <option value="25kg Bags">25kg Bags</option>
                    </select>
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="block text-xs font-bold uppercase tracking-wider text-neutral-800">
                      Delivery City
                    </label>
                    <button
                      type="button"
                      onClick={() => setDestinationCity(CUSTOM_CITY_OPTION)}
                      className="text-[10px] text-emerald-800 font-bold hover:underline flex items-center gap-0.5 cursor-pointer"
                    >
                      <Plus className="w-3 h-3" />
                      <span>Custom city name Add</span>
                    </button>
                  </div>
                  <select
                    value={destinationCity}
                    onChange={(e) => setDestinationCity(e.target.value)}
                    className="w-full px-3 py-2.5 bg-white border border-neutral-300 rounded-xl text-xs text-neutral-900 focus:outline-none focus:border-emerald-800 focus:ring-1 focus:ring-emerald-800/40 shadow-2xs"
                  >
                    <option value={CUSTOM_CITY_OPTION} className="font-bold text-emerald-800 bg-emerald-50">
                      ✍️ + Custom city name Add (اپنا شہر خود درج کریں)
                    </option>

                    <optgroup label="🌟 Major Mandis & Commercial Hubs">
                      {ALL_PAKISTAN_CITIES.filter(c => c.isMajorMandi).map((c) => (
                        <option key={`est-maj-${c.name}`} value={c.name}>
                          {c.name} ({c.province})
                        </option>
                      ))}
                    </optgroup>

                    <optgroup label="🌾 Punjab (All Mandi Cities)">
                      {ALL_PAKISTAN_CITIES.filter(c => c.province === 'Punjab' && !c.isMajorMandi).map((c) => (
                        <option key={`est-pb-${c.name}`} value={c.name}>
                          {c.name} (Punjab)
                        </option>
                      ))}
                    </optgroup>

                    <optgroup label="🚢 Sindh (Ports & Districts)">
                      {ALL_PAKISTAN_CITIES.filter(c => c.province === 'Sindh' && !c.isMajorMandi).map((c) => (
                        <option key={`est-sd-${c.name}`} value={c.name}>
                          {c.name} (Sindh)
                        </option>
                      ))}
                    </optgroup>

                    <optgroup label="🏔️ Khyber Pakhtunkhwa">
                      {ALL_PAKISTAN_CITIES.filter(c => c.province === 'Khyber Pakhtunkhwa' && !c.isMajorMandi).map((c) => (
                        <option key={`est-kpk-${c.name}`} value={c.name}>
                          {c.name} (KPK)
                        </option>
                      ))}
                    </optgroup>

                    <optgroup label="🏜️ Balochistan">
                      {ALL_PAKISTAN_CITIES.filter(c => c.province === 'Balochistan' && !c.isMajorMandi).map((c) => (
                        <option key={`est-bal-${c.name}`} value={c.name}>
                          {c.name} (Balochistan)
                        </option>
                      ))}
                    </optgroup>

                    <optgroup label="🌲 Azad Kashmir & Gilgit-Baltistan">
                      {ALL_PAKISTAN_CITIES.filter(c => c.province.includes('Kashmir') || c.province.includes('Gilgit')).map((c) => (
                        <option key={`est-other-${c.name}`} value={c.name}>
                          {c.name} ({c.province})
                        </option>
                      ))}
                    </optgroup>
                  </select>

                  {/* Custom City Input for Estimator */}
                  {destinationCity === CUSTOM_CITY_OPTION && (
                    <div className="mt-2 p-2 rounded-lg bg-emerald-50 border border-emerald-300 space-y-1 animate-fadeIn">
                      <label className="text-[10px] font-bold text-emerald-950 flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-emerald-700" />
                        <span>Type Custom City / Mandi Name *</span>
                      </label>
                      <input
                        type="text"
                        required={destinationCity === CUSTOM_CITY_OPTION}
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

              {/* Step 3: Packaging Style */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-neutral-800 mb-1.5">
                  Bagging & Packaging Specification
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
                  {[
                    '50 kg Standard Woven PP Bag',
                    '25 kg Laminated BOPP Bag',
                    '10 kg / 5 kg Consumer Pouches',
                    '100 kg Traditional Jute Bag',
                    'Non-Woven Eco Fabric Bag',
                    'Custom Buyer Brand Printed Sacks',
                  ].map((pkg) => (
                    <button
                      type="button"
                      key={pkg}
                      onClick={() => setPackagingType(pkg)}
                      className={`p-2 rounded-lg text-left transition-all border text-[11px] ${
                        packagingType === pkg
                          ? 'bg-emerald-900 text-white border-emerald-900 font-semibold shadow-xs'
                          : 'bg-white text-neutral-700 border-neutral-200 hover:border-emerald-700 hover:bg-neutral-50'
                      }`}
                    >
                      {pkg}
                    </button>
                  ))}
                </div>
              </div>

              {/* Step 4: Contact Information */}
              <div className="pt-2 border-t border-neutral-200 space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-neutral-800 mb-1">
                      Your Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Haji Muhammad Aslam"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="w-full px-3 py-2 bg-white border border-neutral-300 rounded-lg text-xs text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:border-emerald-800 focus:ring-1 focus:ring-emerald-800/40 shadow-2xs"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-neutral-800 mb-1">
                      Business / Company Name
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Aslam Rice Traders"
                      value={companyName}
                      onChange={(e) => setCompanyName(e.target.value)}
                      className="w-full px-3 py-2 bg-white border border-neutral-300 rounded-lg text-xs text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:border-emerald-800 focus:ring-1 focus:ring-emerald-800/40 shadow-2xs"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-neutral-800 mb-1">
                      WhatsApp / Phone Number *
                    </label>
                    <input
                      type="tel"
                      required
                      placeholder="+92 3XX XXXXXXX"
                      value={phoneOrWhatsApp}
                      onChange={(e) => setPhoneOrWhatsApp(e.target.value)}
                      className="w-full px-3 py-2 bg-white border border-neutral-300 rounded-lg text-xs text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:border-emerald-800 focus:ring-1 focus:ring-emerald-800/40 shadow-2xs"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-neutral-800 mb-1">
                    Specific Quality Requirements / Target Rate per KG or Mund (Optional)
                  </label>
                  <textarea
                    rows={2}
                    placeholder="e.g. Need extra long cooked grain with minimum broken, aged lot preferred for biryani franchise..."
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-neutral-300 rounded-lg text-xs text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:border-emerald-800 focus:ring-1 focus:ring-emerald-800/40 resize-none shadow-2xs"
                  />
                </div>
              </div>

              {/* Action Triggers */}
              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <button
                  type="button"
                  onClick={handleWhatsAppSend}
                  className="flex-1 py-3 px-4 rounded-xl bg-emerald-900 hover:bg-emerald-950 text-white font-bold text-xs shadow-sm transition-all flex items-center justify-center gap-2 active:scale-95"
                >
                  <MessageCircle className="w-4 h-4 fill-white" />
                  <span>Send Quotation to WhatsApp (+92 333 8990883)</span>
                </button>

                <button
                  type="submit"
                  className="py-3 px-5 rounded-xl bg-amber-400 hover:bg-amber-300 text-neutral-950 font-bold text-xs shadow-sm transition-all active:scale-95"
                >
                  Submit Inquiry Direct
                </button>
              </div>

              {submitted && (
                <div className="p-3 bg-emerald-50 border border-emerald-300 rounded-lg text-xs text-emerald-900 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
                  <span>Inquiry recorded! Our sourcing coordinator will get back to you promptly.</span>
                </div>
              )}
            </form>
          </div>

          {/* Right Column: Dynamic Live Sourcing Breakdown */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white rounded-2xl p-6 border border-neutral-200 shadow-md space-y-5">
              <div className="flex items-center justify-between pb-3 border-b border-neutral-200">
                <h3 className="font-serif text-lg font-bold text-neutral-950">
                  Consignment Sourcing Overview
                </h3>
                <span className="text-[11px] px-2 py-0.5 rounded bg-emerald-100 text-emerald-900 border border-emerald-200 font-semibold">
                  Live Calculation
                </span>
              </div>

              {/* Summary Items */}
              <div className="space-y-3 text-xs">
                <div className="flex justify-between py-1.5 border-b border-neutral-100">
                  <span className="text-neutral-600">Selected Variety:</span>
                  <span className="font-bold text-neutral-950 text-right">{variety}</span>
                </div>

                <div className="flex justify-between py-1.5 border-b border-neutral-100">
                  <span className="text-neutral-600">Total Net Weight:</span>
                  <span className="font-bold text-emerald-900 text-sm">
                    {totalWeightInKg.toLocaleString()} KG ({(totalWeightInKg / 1000).toFixed(1)} MT)
                  </span>
                </div>

                <div className="flex justify-between py-1.5 border-b border-neutral-100">
                  <span className="text-neutral-600">Packaging Equivalent:</span>
                  <span className="font-medium text-neutral-900">
                    {totalBags50kg} Sacks (50kg) / {totalBags25kg} Sacks (25kg)
                  </span>
                </div>

                <div className="flex justify-between py-1.5 border-b border-neutral-100">
                  <span className="text-neutral-600">Packaging Type:</span>
                  <span className="font-medium text-neutral-900 text-right">{packagingType}</span>
                </div>

                <div className="flex justify-between py-1.5 border-b border-neutral-100">
                  <span className="text-neutral-600">Destination Hub:</span>
                  <span className="font-bold text-neutral-950">
                    {destinationCity} ({selectedCityObj.province})
                  </span>
                </div>

                <div className="flex justify-between py-1.5 border-b border-neutral-100">
                  <span className="text-neutral-600">Est. Freight Mode:</span>
                  <span className="font-semibold text-emerald-900">{estimatedTruckCapacity}</span>
                </div>

                <div className="flex justify-between py-1.5">
                  <span className="text-neutral-600">Typical Transit Time:</span>
                  <span className="font-semibold text-emerald-800">
                    {selectedCityObj?.province === 'Punjab' ? '12 to 24 Hours' : '24 to 48 Hours'}
                  </span>
                </div>
              </div>

              {/* Trust Callout */}
              <div className="p-3.5 bg-emerald-50/70 rounded-xl border border-emerald-200 text-[11px] text-neutral-700 space-y-2">
                <div className="flex items-center gap-1.5 text-emerald-950 font-bold">
                  <ShieldCheck className="w-4 h-4 shrink-0 text-emerald-700" />
                  <span>Broker Sourcing Guarantee</span>
                </div>
                <p>
                  No commitment required. We source matching lot options and courier a free physical cooking sample for your kitchen approval before commercial agreement.
                </p>
              </div>

              {/* Direct Quick WhatsApp Action */}
              <div className="pt-2">
                <button
                  type="button"
                  onClick={handleWhatsAppSend}
                  className="w-full py-2.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-950 font-semibold text-xs transition-colors flex items-center justify-center gap-2 border border-emerald-300 shadow-2xs"
                >
                  <MessageCircle className="w-4 h-4 text-emerald-700" />
                  <span>Fast WhatsApp Rate Check</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
