import React, { useState } from 'react';
import { GoogleBusinessMap } from './GoogleBusinessMap';
import { MapPin, Phone, MessageCircle, Mail, ExternalLink, Clock, Building2, CheckCircle2, Send, Facebook, Instagram, Linkedin, AlertCircle } from 'lucide-react';
import { RICE_VARIETIES } from '../data/riceData';
import { CITIES_DATA } from '../data/citiesData';
import { ALL_PAKISTAN_CITIES } from '../data/allPakistanCities';
import { recordNewInquiry, generateWhatsAppInquiryUrl, StoredInquiry } from '../utils/inquiryManager';
import { InquirySuccessModal } from './InquirySuccessModal';

interface ContactSectionProps {
  onSuccessToast?: (msg: string) => void;
}

export const ContactSection: React.FC<ContactSectionProps> = ({ onSuccessToast }) => {
  const [name, setName] = useState<string>('');
  const [phone, setPhone] = useState<string>('');
  const [company, setCompany] = useState<string>('');
  const [city, setCity] = useState<string>('Lahore');
  const [customCityName, setCustomCityName] = useState<string>('');
  const [variety, setVariety] = useState<string>(RICE_VARIETIES[0].name);
  const [quantity, setQuantity] = useState<string>('10 Tons (200 Bags of 50kg)');
  const [message, setMessage] = useState<string>('');
  const [validationError, setValidationError] = useState<string>('');
  const [activeInquiryModal, setActiveInquiryModal] = useState<StoredInquiry | null>(null);

  const getEffectiveCity = () => {
    return city === 'Custom city name Add' ? (customCityName.trim() || 'Custom City') : city;
  };

  const handleWhatsAppInquiry = () => {
    if (!name.trim() || !phone.trim()) {
      setValidationError('Please enter your Name and WhatsApp Number so our trade desk can assist you.');
      return;
    }
    setValidationError('');
    const finalCity = getEffectiveCity();

    const stored = recordNewInquiry({
      customerName: name,
      phone: phone,
      city: finalCity,
      variety: variety,
      volume: quantity,
      businessName: company,
      message: message,
      type: 'Commercial Sourcing Inquiry'
    });

    const waUrl = generateWhatsAppInquiryUrl({
      customerName: name,
      phone: phone,
      city: finalCity,
      variety: variety,
      volume: quantity,
      businessName: company,
      message: message,
      inquiryId: stored.id
    });

    window.open(waUrl, '_blank');
    setActiveInquiryModal(stored);
    if (onSuccessToast) onSuccessToast('Inquiry logged & WhatsApp opened to Muhammad Amir Shahzad!');
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim()) {
      setValidationError('Please enter your Name and Phone Number to submit an inquiry.');
      return;
    }
    setValidationError('');
    const finalCity = getEffectiveCity();

    const stored = recordNewInquiry({
      customerName: name,
      phone: phone,
      city: finalCity,
      variety: variety,
      volume: quantity,
      businessName: company,
      message: message,
      type: 'Commercial Sourcing Inquiry'
    });

    setActiveInquiryModal(stored);
    if (onSuccessToast) onSuccessToast(`Inquiry #${stored.id} logged! Notification dispatched.`);
  };

  return (
    <section id="contact" className="py-16 bg-white border-b border-neutral-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-emerald-100 text-emerald-900 text-xs font-bold uppercase tracking-wider mb-2">
            <Building2 className="w-3.5 h-3.5" />
            Connect With Our Sourcing Desk
          </div>
          <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-bold text-neutral-950 tracking-tight">
            Contact Hashir Rice Supplier
          </h2>
          <p className="mt-2 text-neutral-600 text-sm leading-relaxed">
            Reach out via WhatsApp or visit our central office at Noor Galla Mandi, Bucheki (Nankana Sahib) to discuss bulk rice requirements, physical sampling, and custom packaging.
          </p>
        </div>

        {/* 2-Column Contact Info & Form */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Office Details & Google Business Profile */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-neutral-50/60 rounded-2xl p-6 border border-neutral-200 shadow-2xs space-y-5">
              <h3 className="font-serif text-lg font-bold text-neutral-950 pb-3 border-b border-neutral-200">
                Head Office & Sourcing Base
              </h3>

              <div className="space-y-4 text-xs">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-white text-emerald-900 flex items-center justify-center shrink-0 border border-emerald-200 shadow-2xs">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <div>
                    <strong className="text-neutral-900 block font-semibold">Physical Head Office Address:</strong>
                    <span className="text-neutral-600">
                      Noor Galla Mandi, Bucheki, District Nankana Sahib, Punjab, Pakistan
                    </span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-white text-emerald-900 flex items-center justify-center shrink-0 border border-emerald-200 shadow-2xs">
                    <MessageCircle className="w-4 h-4 text-emerald-700" />
                  </div>
                  <div>
                    <strong className="text-neutral-900 block font-semibold">WhatsApp Direct Sourcing Desks:</strong>
                    <div className="flex flex-col gap-1 mt-1">
                      <a
                        href="https://wa.me/923338990883"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-emerald-900 hover:underline font-bold text-sm block"
                      >
                        +92 333 8990883 <span className="text-xs text-neutral-500 font-normal">(Desk 1 - Rates & Dispatch)</span>
                      </a>
                      <a
                        href="https://wa.me/923002861297"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-emerald-900 hover:underline font-bold text-sm block"
                      >
                        +92 300 2861297 <span className="text-xs text-neutral-500 font-normal">(Desk 2 - Inquiries & Samples)</span>
                      </a>
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-white text-emerald-900 flex items-center justify-center shrink-0 border border-emerald-200 shadow-2xs">
                    <Clock className="w-4 h-4 text-emerald-700" />
                  </div>
                  <div>
                    <strong className="text-neutral-900 block font-semibold">Trading & Sourcing Hours:</strong>
                    <span className="text-neutral-600">
                      Monday to Saturday: 8:00 AM – 8:00 PM PKT
                    </span>
                    <span className="text-emerald-800 block text-[11px] font-medium">WhatsApp inquiries answered 24/7</span>
                  </div>
                </div>
              </div>

              {/* Direct Google Business Profile Card */}
              <div className="p-4 bg-emerald-50 text-neutral-900 rounded-xl space-y-2 border border-emerald-200 shadow-2xs">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-emerald-950 uppercase tracking-wider">
                    Verified Google Profile
                  </span>
                  <ExternalLink className="w-3.5 h-3.5 text-emerald-700" />
                </div>
                <p className="text-xs text-neutral-600">
                  View our verified Google Business Profile for maps, authentic location reviews, and updates.
                </p>
                <a
                  href="https://share.google/Xog0BKr0oU1NiGIUL"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-1.5 w-full py-2 bg-emerald-900 hover:bg-emerald-950 text-white font-bold text-xs rounded-lg transition-colors shadow-xs"
                >
                  <span>Open Google Business Profile</span>
                </a>
              </div>

              {/* Official Social Media Channels Card */}
              <div className="p-4 bg-white rounded-xl space-y-2.5 border border-neutral-200 shadow-2xs">
                <span className="text-xs font-bold text-neutral-900 uppercase tracking-wider block">
                  Official Social Channels
                </span>
                <p className="text-xs text-neutral-600">
                  Follow Hashir Rice Supplier on social platforms for mandi updates, seasonal crop reports, and trade announcements:
                </p>
                <div className="grid grid-cols-2 gap-2 pt-1">
                  <a
                    id="contact-social-facebook"
                    href="https://www.facebook.com/hashirricesupplier"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 p-2 rounded-lg bg-neutral-50 hover:bg-emerald-50 text-neutral-800 hover:text-emerald-950 border border-neutral-200 hover:border-emerald-300 transition-colors text-xs font-medium"
                  >
                    <Facebook className="w-4 h-4 text-emerald-800 shrink-0" />
                    <span>Facebook</span>
                  </a>
                  <a
                    id="contact-social-instagram"
                    href="https://www.instagram.com/hashirricesuppliers/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 p-2 rounded-lg bg-neutral-50 hover:bg-emerald-50 text-neutral-800 hover:text-emerald-950 border border-neutral-200 hover:border-emerald-300 transition-colors text-xs font-medium"
                  >
                    <Instagram className="w-4 h-4 text-emerald-800 shrink-0" />
                    <span>Instagram</span>
                  </a>
                  <a
                    id="contact-social-tiktok"
                    href="https://www.tiktok.com/@hashirricesuppliers"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 p-2 rounded-lg bg-neutral-50 hover:bg-emerald-50 text-neutral-800 hover:text-emerald-950 border border-neutral-200 hover:border-emerald-300 transition-colors text-xs font-medium"
                  >
                    <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 text-emerald-800 shrink-0">
                      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64c.298-.002.595.042.88.13V9.4a6.33 6.33 0 0 0-1-.08A6.34 6.34 0 0 0 3 15.66a6.34 6.34 0 0 0 10.86 4.46V10.4a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-.04-1.83z" />
                    </svg>
                    <span>TikTok</span>
                  </a>
                  <a
                    id="contact-social-linkedin"
                    href="https://www.linkedin.com/company/hashir-rice-supplier/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 p-2 rounded-lg bg-neutral-50 hover:bg-emerald-50 text-neutral-800 hover:text-emerald-950 border border-neutral-200 hover:border-emerald-300 transition-colors text-xs font-medium"
                  >
                    <Linkedin className="w-4 h-4 text-emerald-800 shrink-0" />
                    <span>LinkedIn</span>
                  </a>
                </div>
              </div>
            </div>

            {/* Embedded Google Business Map Card */}
            <div className="pt-2">
              <GoogleBusinessMap
                cityName="Bucheki"
                province="Punjab"
                customHeading="Amir Rice Trader – Noor Galla Mandi Bucheki"
                customSubheading="Daily Mandi Trading & Physical Inspection Hub"
                height="220px"
                showDetailsGrid={false}
              />
            </div>
          </div>

          {/* Right Column: Direct Sourcing Inquiry Form */}
          <div className="lg:col-span-7 bg-white rounded-2xl p-6 sm:p-8 border border-neutral-200 shadow-2xs space-y-6">
            <div>
              <h3 className="font-serif text-xl font-bold text-neutral-950">
                Send a Direct Wholesale Inquiry
              </h3>
              <p className="text-xs text-neutral-600 mt-1">
                Fill out your requirement and our sourcing desk will contact you with matching sample options and ex-mill/FOR rates.
              </p>
            </div>

            <form onSubmit={handleFormSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-neutral-800 mb-1">Your Full Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Muhammad Amir Shahzad"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-3 py-2.5 bg-neutral-50 border border-neutral-300 rounded-lg text-neutral-900 focus:outline-none focus:border-emerald-800"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-neutral-800 mb-1">Business / Company Name</label>
                  <input
                    type="text"
                    placeholder="e.g. Hashir Food Corporation"
                    value={company}
                    onChange={(e) => setCompany(e.target.value)}
                    className="w-full px-3 py-2.5 bg-neutral-50 border border-neutral-300 rounded-lg text-neutral-900 focus:outline-none focus:border-emerald-800"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-neutral-800 mb-1">WhatsApp / Phone Number *</label>
                  <input
                    type="tel"
                    required
                    placeholder="+92 3XX XXXXXXX"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full px-3 py-2.5 bg-neutral-50 border border-neutral-300 rounded-lg text-neutral-900 focus:outline-none focus:border-emerald-800"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-neutral-800 mb-1">Delivery City (All Pakistan)</label>
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
                        <option key={`contact-city-${cItem.name}`} value={cItem.name}>
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
                      placeholder="Type custom city or mandi name..."
                      className="mt-2 w-full px-3 py-2 bg-amber-50/70 border-2 border-emerald-700 rounded-lg text-xs text-neutral-900 font-semibold focus:outline-none"
                    />
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-neutral-800 mb-1">Rice Variety</label>
                  <select
                    value={variety}
                    onChange={(e) => setVariety(e.target.value)}
                    className="w-full px-3 py-2.5 bg-neutral-50 border border-neutral-300 rounded-lg text-neutral-900 focus:outline-none focus:border-emerald-800"
                  >
                    {RICE_VARIETIES.map((v) => (
                      <option key={v.id} value={v.name}>
                        {v.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-neutral-800 mb-1">Required Volume</label>
                  <select
                    value={quantity}
                    onChange={(e) => setQuantity(e.target.value)}
                    className="w-full px-3 py-2.5 bg-neutral-50 border border-neutral-300 rounded-lg text-neutral-900 focus:outline-none focus:border-emerald-800"
                  >
                    <option value="5 Metric Tons (100 Bags of 50kg)">5 Metric Tons (100 Bags of 50kg)</option>
                    <option value="10 Metric Tons (200 Bags of 50kg)">10 Metric Tons (200 Bags of 50kg)</option>
                    <option value="20 Metric Tons (Full Truck Load)">20 Metric Tons (Full Truck Load)</option>
                    <option value="30 to 50 Metric Tons (Trailer Load)">30 to 50 Metric Tons (Trailer Load)</option>
                    <option value="Free Sample Pack Only">Free Sample Pack Only</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-neutral-800 mb-1">
                  Message / Specific Quality & Packing Requirements (Optional)
                </label>
                <textarea
                  rows={3}
                  placeholder="Mention desired cooked elongation, bag weight (25kg/50kg), target price, or recurring delivery schedule..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full px-3 py-2.5 bg-neutral-50 border border-neutral-300 rounded-lg text-neutral-900 focus:outline-none focus:border-emerald-800 resize-none"
                />
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
                  onClick={handleWhatsAppInquiry}
                  className="flex-1 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <MessageCircle className="w-4 h-4 fill-white" />
                  <span>Send via WhatsApp (+92 333 8990883)</span>
                </button>

                <button
                  type="submit"
                  className="py-3 px-6 rounded-xl bg-amber-400 hover:bg-amber-300 text-neutral-950 font-bold shadow transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Submit Inquiry</span>
                </button>
              </div>

              <div className="text-[11px] text-neutral-500 flex items-center gap-1.5 pt-1">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span>Submitting triggers instant notification to Muhammad Amir Shahzad via WhatsApp &amp; Inquiries CRM.</span>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* Inquiry Success & Instant Notification Modal */}
      <InquirySuccessModal
        isOpen={Boolean(activeInquiryModal)}
        onClose={() => setActiveInquiryModal(null)}
        inquiry={activeInquiryModal}
      />
    </section>
  );
};
