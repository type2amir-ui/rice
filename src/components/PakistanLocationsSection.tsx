import React, { useState } from 'react';
import { CITIES_DATA } from '../data/citiesData';
import { CityData } from '../types';
import {
  MapPin,
  Search,
  Truck,
  Sparkles,
  Store,
  MessageCircle,
  Clock,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  HelpCircle,
  ArrowRight
} from 'lucide-react';

interface PakistanLocationsSectionProps {
  onOpenQuoteModal: (varietyName?: string, cityName?: string) => void;
  onOpenSampleModal?: (varietyName?: string, cityName?: string) => void;
  onSelectCity?: (citySlug: string) => void;
}

export const PakistanLocationsSection: React.FC<PakistanLocationsSectionProps> = ({
  onOpenQuoteModal,
  onOpenSampleModal,
  onSelectCity,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [expandedFaqCity, setExpandedFaqCity] = useState<string | null>(null);

  const categories = [
    { label: 'All Major Cities', value: 'All' },
    { label: 'Sindh Major Cities', value: 'Sindh' },
    { label: 'KPK Major Cities', value: 'Khyber Pakhtunkhwa' },
    { label: 'Punjab Major Cities', value: 'Punjab' },
    { label: 'Islamabad & Balochistan', value: 'Federal & Balochistan' },
  ];

  const filteredCities = CITIES_DATA.filter((city) => {
    let matchesCategory = true;
    if (selectedCategory === 'All') {
      matchesCategory = true;
    } else if (selectedCategory === 'Sindh') {
      matchesCategory = city.province === 'Sindh';
    } else if (selectedCategory === 'Khyber Pakhtunkhwa') {
      matchesCategory = city.province === 'Khyber Pakhtunkhwa';
    } else if (selectedCategory === 'Punjab') {
      matchesCategory = city.province === 'Punjab';
    } else if (selectedCategory === 'Federal & Balochistan') {
      matchesCategory =
        city.province === 'Islamabad Capital Territory' ||
        city.province === 'Balochistan';
    }

    const matchesSearch =
      searchQuery.trim() === '' ||
      city.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      city.province.toLowerCase().includes(searchQuery.toLowerCase()) ||
      city.majorMarkets.some((m) => m.toLowerCase().includes(searchQuery.toLowerCase())) ||
      city.primaryDemand.some((d) => d.toLowerCase().includes(searchQuery.toLowerCase()));

    return matchesCategory && matchesSearch;
  });

  const handleWhatsAppCityInquiry = (city: CityData) => {
    const text = encodeURIComponent(
      `*Wholesale Rice Sourcing Inquiry for ${city.name}*\n\n` +
      `📍 *Destination:* ${city.name} (${city.province})\n` +
      `🌾 *Demanded Varieties:* ${city.popularVarieties.slice(0, 2).join(', ')}\n` +
      `🏢 *Major Local Market:* ${city.majorMarkets[0]}\n\n` +
      `_Hello Hashir Rice Supplier, please provide today's ex-mill bulk rice rates, truck bilty freight, and sample delivery schedule to ${city.name}._`
    );
    window.open(`https://wa.me/923338990883?text=${text}`, '_blank');
  };

  return (
    <section id="pakistan-locations" className="py-16 bg-neutral-50/50 border-b border-neutral-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between mb-8 gap-6">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-emerald-100 text-emerald-950 text-xs font-bold uppercase tracking-wider mb-3 border border-emerald-200">
              <MapPin className="w-3.5 h-3.5 text-emerald-800" />
              <span>Direct Sourcing & Delivery Corridors</span>
            </div>
            <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-bold text-neutral-950 tracking-tight">
              Wholesale Rice Supplier Across Pakistan & Bulk Rice Supply in Major Cities
            </h2>
            <p className="mt-2 text-neutral-600 text-sm leading-relaxed">
              We specialize in direct mill-to-mandi brokerage and bulk rice supply focused on Pakistan’s major commercial hubs. Delivering certified <strong>1121 Kainat Steam (22mm+)</strong>, <strong>Golden Sella</strong>, <strong>Super Kernel Basmati</strong>, and <strong>IRRI-6</strong> across top trade centers in <strong>Sindh</strong>, <strong>Khyber Pakhtunkhwa (KPK)</strong>, <strong>Punjab</strong>, <strong>Balochistan</strong>, and <strong>Islamabad</strong>.
            </p>
          </div>

          {/* Quick Search */}
          <div className="relative w-full lg:w-80">
            <Search className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search major city, mandi, or variety..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-white border border-neutral-300 rounded-xl text-xs text-neutral-900 focus:outline-none focus:border-emerald-800 focus:ring-1 focus:ring-emerald-800 shadow-2xs transition-colors"
            />
          </div>
        </div>

        {/* Region Filter Tabs */}
        <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 mb-8 border-b border-neutral-200 pb-4">
          {categories.map((cat) => (
            <button
              key={cat.value}
              onClick={() => setSelectedCategory(cat.value)}
              className={`px-3.5 sm:px-4 py-2 min-h-[38px] rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                selectedCategory === cat.value
                  ? 'bg-emerald-900 text-white shadow-sm'
                  : 'bg-white text-neutral-700 hover:bg-neutral-100 border border-neutral-200'
              }`}
            >
              {cat.label}
            </button>
          ))}
          <span className="text-xs text-neutral-500 font-medium ml-auto hidden sm:inline">
            Showing {filteredCities.length} Major Cities
          </span>
        </div>

        {/* Major Cities Grid (Direct Action Cards, No Separate Sub-pages) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCities.map((city) => {
            const isFaqExpanded = expandedFaqCity === city.slug;

            return (
              <div
                key={city.slug}
                className="bg-white rounded-2xl p-5 border border-neutral-200/90 hover:border-emerald-800/60 shadow-xs hover:shadow-md transition-all flex flex-col justify-between group"
              >
                <div>
                  {/* Top Metadata Header */}
                  <div className="flex items-center justify-between gap-2 mb-2.5">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-900 bg-emerald-50 px-2.5 py-0.5 rounded border border-emerald-200">
                      {city.province === 'Islamabad Capital Territory' ? 'Islamabad (ICT)' : city.province}
                    </span>
                    <span className="text-[11px] text-neutral-500 flex items-center gap-1 font-medium bg-neutral-100/80 px-2 py-0.5 rounded">
                      <Clock className="w-3 h-3 text-emerald-700" />
                      {city.typicalLogisticsLeadTime.split('(')[0].trim()}
                    </span>
                  </div>

                  {/* City Name & Title */}
                  <div className="flex items-center justify-between">
                    <h3
                      onClick={() => onSelectCity && onSelectCity(city.slug)}
                      className={`font-serif text-xl font-bold text-neutral-950 transition-colors flex items-center gap-1.5 ${
                        onSelectCity ? 'cursor-pointer hover:text-emerald-800' : ''
                      }`}
                    >
                      <span>{city.name}</span>
                      <span className="text-xs font-sans font-normal text-neutral-500">Bulk Supply</span>
                    </h3>

                    {onSelectCity && (
                      <button
                        onClick={() => onSelectCity(city.slug)}
                        className="text-[11px] font-semibold text-emerald-800 hover:text-emerald-950 flex items-center gap-0.5"
                      >
                        <span>Full Page</span>
                        <ArrowRight className="w-3 h-3" />
                      </button>
                    )}
                  </div>

                  <p className="text-xs text-neutral-600 line-clamp-2 mt-1.5 leading-relaxed">
                    {city.description}
                  </p>

                  {/* Major Mandis / Key Commercial Markets */}
                  <div className="mt-3.5 pt-3 border-t border-neutral-100 space-y-2 text-xs">
                    <div>
                      <span className="text-[11px] font-bold text-neutral-700 block mb-1 flex items-center gap-1">
                        <Store className="w-3.5 h-3.5 text-emerald-700" />
                        <span>Major Wholesale Mandis & Markets:</span>
                      </span>
                      <p className="text-[11px] text-neutral-600 line-clamp-2 pl-4">
                        {city.majorMarkets.join(' • ')}
                      </p>
                    </div>

                    {/* Popular Varieties for this City */}
                    <div>
                      <span className="text-[11px] font-bold text-neutral-700 block mb-1">
                        High-Demand Rice Varieties:
                      </span>
                      <div className="flex flex-wrap gap-1">
                        {city.popularVarieties.map((v, i) => (
                          <span
                            key={i}
                            className="text-[10px] bg-neutral-50 px-2 py-0.5 rounded border border-neutral-200 text-neutral-800 font-medium"
                          >
                            {v.split('(')[0].trim()}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Accordion FAQ Toggle for Local City Insights */}
                  {city.localFaq && city.localFaq.length > 0 && (
                    <div className="mt-3 pt-2">
                      <button
                        onClick={() => setExpandedFaqCity(isFaqExpanded ? null : city.slug)}
                        className="text-[11px] font-semibold text-emerald-800 hover:text-emerald-950 flex items-center gap-1 transition-colors"
                      >
                        <HelpCircle className="w-3 h-3 text-emerald-700" />
                        <span>{isFaqExpanded ? 'Hide Local Supply FAQ' : `View ${city.name} Supply FAQ`}</span>
                        {isFaqExpanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                      </button>

                      {isFaqExpanded && (
                        <div className="mt-2 p-3 bg-neutral-50 rounded-xl border border-neutral-200 text-[11px] space-y-2 animate-fadeIn">
                          {city.localFaq.map((faq, fIdx) => (
                            <div key={fIdx} className="space-y-0.5">
                              <p className="font-bold text-neutral-900">Q: {faq.q}</p>
                              <p className="text-neutral-600 leading-relaxed">A: {faq.a}</p>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Primary Action CTAs on the Card */}
                <div className="mt-4 pt-3 border-t border-neutral-200/80 flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                  <button
                    onClick={() => onOpenQuoteModal(city.popularVarieties[0], city.name)}
                    className="w-full sm:flex-1 py-2.5 px-3 min-h-[40px] bg-emerald-900 hover:bg-emerald-950 text-white rounded-xl text-xs font-semibold transition-all flex items-center justify-center gap-1.5 shadow-2xs active:scale-[0.98] cursor-pointer"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-amber-300 shrink-0" />
                    <span>Get Rate for {city.name}</span>
                  </button>

                  <div className="flex items-center gap-1.5 w-full sm:w-auto">
                    {onOpenSampleModal && (
                      <button
                        onClick={() => onOpenSampleModal(city.popularVarieties[0], city.name)}
                        className="flex-1 sm:flex-initial py-2.5 px-3 min-h-[40px] bg-neutral-100 hover:bg-neutral-200 text-neutral-800 rounded-xl text-[11px] font-semibold transition-colors border border-neutral-200 whitespace-nowrap text-center cursor-pointer"
                        title={`Request Free Sample physical dispatch to ${city.name}`}
                      >
                        Sample
                      </button>
                    )}

                    <button
                      onClick={() => handleWhatsAppCityInquiry(city)}
                      className="flex-1 sm:flex-initial py-2.5 px-3 min-h-[40px] bg-emerald-50 hover:bg-emerald-100 text-emerald-900 rounded-xl text-[11px] font-semibold transition-colors border border-emerald-200 flex items-center justify-center gap-1 cursor-pointer"
                      title={`Chat on WhatsApp for ${city.name} wholesale delivery`}
                    >
                      <MessageCircle className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
                      <span className="sm:hidden text-xs font-medium">WhatsApp</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Empty State */}
        {filteredCities.length === 0 && (
          <div className="text-center py-12 bg-white rounded-2xl border border-neutral-200 shadow-xs">
            <p className="text-sm text-neutral-600 font-medium">No major cities found matching your search term.</p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('All');
              }}
              className="mt-3 px-4 py-2 rounded-xl bg-emerald-900 text-white text-xs font-semibold hover:bg-emerald-950"
            >
              Reset Filters & Show All Major Cities
            </button>
          </div>
        )}
      </div>
    </section>
  );
};
