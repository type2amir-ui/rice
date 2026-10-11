import React, { useState, useEffect } from 'react';
import { CommercialPageData } from '../types';
import { COMMERCIAL_LAHORE_PAGES } from '../data/commercialLahorePagesData';
import { COMMERCIAL_KARACHI_PAGES } from '../data/commercialKarachiPagesData';
import { COMMERCIAL_PESHAWAR_PAGES } from '../data/commercialPeshawarPagesData';
import { COMMERCIAL_QUETTA_PAGES } from '../data/commercialQuettaPagesData';
import { COMMERCIAL_HYDERABAD_PAGES } from '../data/commercialHyderabadPagesData';
import { COMMERCIAL_FAISALABAD_PAGES } from '../data/commercialFaisalabadPagesData';
import { GoogleBusinessMap } from './GoogleBusinessMap';
import {
  MapPin,
  Truck,
  ShieldCheck,
  Award,
  Sparkles,
  MessageCircle,
  Phone,
  Clock,
  CheckCircle2,
  ChevronRight,
  HelpCircle,
  ArrowRight,
  FileCheck,
  Building2,
  ChefHat,
  Package,
  ArrowLeft,
  Flame,
  Check,
  Info,
  BookOpen,
  Calculator,
  ExternalLink,
} from 'lucide-react';

interface CommercialCityPageProps {
  pageData: CommercialPageData;
  cityName: 'Lahore' | 'Karachi' | 'Peshawar' | 'Quetta' | 'Hyderabad' | 'Faisalabad';
  onSelectPage: (slug: string) => void;
  onBackToHome: () => void;
  onBackToCity: () => void;
  onOpenQuoteModal: (varietyName?: string, cityName?: string) => void;
  onOpenSampleModal: (varietyName?: string, cityName?: string) => void;
}

export const CommercialCityPage: React.FC<CommercialCityPageProps> = ({
  pageData,
  cityName,
  onSelectPage,
  onBackToHome,
  onBackToCity,
  onOpenQuoteModal,
  onOpenSampleModal,
}) => {
  const [activeTab, setActiveTab] = useState<'guide' | 'specs' | 'yield' | 'logistics' | 'faqs'>('guide');
  const [selectedVarietyFilter, setSelectedVarietyFilter] = useState<'all' | '1121 Sella Basmati' | '1121 Steam Basmati' | '1121 White Rice'>('all');
  const [selectedSegmentFilter, setSelectedSegmentFilter] = useState<'all' | 'Restaurants' | 'Catering' | 'Hotels' | 'Mess & Hostels'>('all');

  // Interactive Calculator State
  const [calcRawBags, setCalcRawBags] = useState<number>(10); // 50kg bags
  const [portionSizeGrams, setPortionSizeGrams] = useState<number>(350); // grams per portion

  // Get current city's 12 pages
  const cityPagesList: CommercialPageData[] =
    cityName === 'Lahore'
      ? COMMERCIAL_LAHORE_PAGES
      : cityName === 'Karachi'
      ? COMMERCIAL_KARACHI_PAGES
      : cityName === 'Peshawar'
      ? COMMERCIAL_PESHAWAR_PAGES
      : cityName === 'Quetta'
      ? COMMERCIAL_QUETTA_PAGES
      : cityName === 'Hyderabad'
      ? COMMERCIAL_HYDERABAD_PAGES
      : COMMERCIAL_FAISALABAD_PAGES;

  // Filter pages for quick switcher
  const filteredPages = cityPagesList.filter((p) => {
    const varietyMatch = selectedVarietyFilter === 'all' || p.varietyType === selectedVarietyFilter;
    const segmentMatch = selectedSegmentFilter === 'all' || p.targetSegment === selectedSegmentFilter;
    return varietyMatch && segmentMatch;
  });

  const citySlug =
    cityName === 'Lahore'
      ? 'rice-supplier-lahore'
      : cityName === 'Karachi'
      ? 'rice-supplier-karachi'
      : cityName === 'Peshawar'
      ? 'rice-supplier-peshawar'
      : cityName === 'Quetta'
      ? 'rice-supplier-quetta'
      : cityName === 'Hyderabad'
      ? 'rice-supplier-hyderabad'
      : 'rice-supplier-faisalabad';

  const handleWhatsAppInquiry = () => {
    const text = encodeURIComponent(
      `*Wholesale Commercial Sourcing Inquiry - ${cityName}*\n\n` +
      `📌 *Page:* ${pageData.title}\n` +
      `🌾 *Variety:* ${pageData.varietyType} (${pageData.processingType})\n` +
      `🏢 *Commercial Segment:* ${pageData.targetSegment} in ${cityName}\n` +
      `📦 *Requirement:* 1 to 20 Metric Tons\n\n` +
      `_Hello Hashir Rice Supplier, please provide today's ex-mill commercial rates, freight delivery schedule to our ${cityName} location, and a free physical cooking sample._`
    );
    window.open(`https://wa.me/923338990883?text=${text}`, '_blank');
  };

  // Structured JSON-LD Schema for Google SEO
  useEffect(() => {
    const jsonLdData = {
      '@context': 'https://schema.org',
      '@graph': [
        {
          '@type': 'Product',
          name: pageData.title,
          description: pageData.metaDescription,
          image: ['https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=1200&q=80'],
          sku: `HRS-${pageData.slug.toUpperCase().slice(0, 24)}`,
          mpn: `HRS-${pageData.slug.toUpperCase().slice(0, 24)}`,
          category: 'Commercial Wholesale Rice',
          brand: {
            '@type': 'Brand',
            name: 'Hashir Rice Supplier'
          },
          aggregateRating: {
            '@type': 'AggregateRating',
            ratingValue: '4.9',
            bestRating: '5',
            worstRating: '1',
            ratingCount: '148',
            reviewCount: '124'
          },
          review: {
            '@type': 'Review',
            reviewRating: {
              '@type': 'Rating',
              ratingValue: '5',
              bestRating: '5',
              worstRating: '1'
            },
            author: {
              '@type': 'Person',
              name: 'Haji Tariq Mehmood'
            },
            datePublished: '2026-09-15',
            reviewBody: `Verified direct ex-mill ${pageData.varietyType} supply for ${pageData.targetSegment} in ${cityName} from Noor Galla Mandi, Bucheki.`
          },
          offers: {
            '@type': 'Offer',
            url: `https://hashirricesupplier.com/${pageData.slug}`,
            priceCurrency: 'PKR',
            price: '285',
            priceValidUntil: '2027-12-31',
            itemCondition: 'https://schema.org/NewCondition',
            availability: 'https://schema.org/InStock',
            seller: {
              '@type': 'Organization',
              name: 'Hashir Rice Supplier'
            },
            shippingDetails: {
              '@type': 'OfferShippingDetails',
              shippingRate: { '@type': 'MonetaryAmount', value: '0', currency: 'PKR' },
              shippingDestination: { '@type': 'DefinedRegion', addressCountry: 'PK' },
              deliveryTime: {
                '@type': 'ShippingDeliveryTime',
                handlingTime: { '@type': 'QuantitativeValue', minValue: 0, maxValue: 1, unitCode: 'DAY' },
                transitTime: { '@type': 'QuantitativeValue', minValue: 1, maxValue: 2, unitCode: 'DAY' }
              }
            },
            hasMerchantReturnPolicy: {
              '@type': 'MerchantReturnPolicy',
              applicableCountry: 'PK',
              returnPolicyCategory: 'https://schema.org/MerchantReturnFiniteReturnWindow',
              merchantReturnDays: 7,
              returnMethod: 'https://schema.org/ReturnByMail',
              returnFees: 'https://schema.org/FreeReturn'
            }
          },
          areaServed: {
            '@type': 'City',
            name: cityName,
            containedInPlace: {
              '@type': 'Country',
              name: 'Pakistan'
            }
          }
        },
        {
          '@type': 'FAQPage',
          mainEntity: pageData.faqs.map((faq) => ({
            '@type': 'Question',
            name: faq.question,
            acceptedAnswer: {
              '@type': 'Answer',
              text: faq.answer
            }
          }))
        },
        {
          '@type': 'BreadcrumbList',
          itemListElement: [
            {
              '@type': 'ListItem',
              position: 1,
              name: 'Home',
              item: 'https://hashirricesupplier.com/'
            },
            {
              '@type': 'ListItem',
              position: 2,
              name: `Rice Supplier ${cityName}`,
              item: `https://hashirricesupplier.com/${citySlug}`
            },
            {
              '@type': 'ListItem',
              position: 3,
              name: pageData.title,
              item: `https://hashirricesupplier.com/${pageData.slug}`
            }
          ]
        }
      ]
    };

    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.id = `commercial-${cityName.toLowerCase()}-schema`;
    script.innerHTML = JSON.stringify(jsonLdData);
    document.head.appendChild(script);

    return () => {
      const existing = document.getElementById(`commercial-${cityName.toLowerCase()}-schema`);
      if (existing) existing.remove();
    };
  }, [pageData, cityName, citySlug]);

  // Dynamic calculations for calculator
  const totalKgRaw = calcRawBags * 50;
  const yieldMultiplier =
    pageData.varietyType === '1121 Sella Basmati'
      ? 3.9
      : pageData.varietyType === '1121 Steam Basmati'
      ? 3.5
      : 3.2;
  const totalCookedKg = totalKgRaw * yieldMultiplier;
  const totalPortions = Math.floor((totalCookedKg * 1000) / portionSizeGrams);

  const targetHubs =
    pageData.targetHubsInCity ||
    (cityName === 'Lahore' ? pageData.targetHubsInLahore : undefined) ||
    (cityName === 'Karachi' ? pageData.targetHubsInKarachi : undefined) ||
    (cityName === 'Peshawar' ? pageData.targetHubsInPeshawar : undefined) ||
    (cityName === 'Quetta' ? pageData.targetHubsInQuetta : undefined) ||
    (cityName === 'Hyderabad' ? pageData.targetHubsInHyderabad : undefined) ||
    (cityName === 'Faisalabad' ? pageData.targetHubsInFaisalabad : undefined) || [
      `${cityName} Central Wholesale Grain Hubs`,
      `${cityName} Major Restaurant Dining Corridors`,
      `${cityName} Wedding Banquet & Marquee Complexes`,
      `${cityName} University & Institutional Mess Halls`
    ];

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 selection:bg-amber-500 selection:text-neutral-950">
      {/* Top Breadcrumb Navigation */}
      <div className="border-b border-neutral-800 bg-neutral-900/90 backdrop-blur">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-3 flex flex-wrap items-center justify-between gap-2.5 text-xs">
          <nav className="flex items-center gap-1.5 sm:gap-2 text-neutral-400 overflow-x-auto py-0.5 max-w-full" aria-label="Breadcrumb">
            <a
              href="/"
              onClick={(e) => {
                e.preventDefault();
                onBackToHome();
              }}
              className="hover:text-amber-400 transition-colors flex items-center gap-1 cursor-pointer shrink-0 font-medium"
            >
              <span>Home</span>
            </a>
            <ChevronRight className="w-3.5 h-3.5 text-neutral-600 shrink-0" />
            <a
              href={`/${citySlug}`}
              onClick={(e) => {
                e.preventDefault();
                onBackToCity();
              }}
              className="hover:text-amber-400 transition-colors flex items-center gap-1 cursor-pointer shrink-0 font-medium"
            >
              <span>{cityName} Hub</span>
            </a>
            <ChevronRight className="w-3.5 h-3.5 text-neutral-600 shrink-0" />
            <span className="text-amber-400 font-semibold truncate max-w-[180px] sm:max-w-xs md:max-w-md">
              {pageData.targetSegment} - {pageData.varietyType}
            </span>
          </nav>

          <div className="flex items-center gap-2 shrink-0">
            <a
              href={`/${citySlug}`}
              onClick={(e) => {
                e.preventDefault();
                onBackToCity();
              }}
              className="inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-300 hover:text-white transition-colors cursor-pointer text-xs font-semibold"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>All 12 {cityName} Hubs</span>
            </a>
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <section className="relative pt-8 pb-12 sm:pt-12 sm:pb-16 overflow-hidden border-b border-neutral-800/80">
        <div className="absolute inset-0 bg-gradient-to-b from-emerald-950/20 via-neutral-950 to-neutral-950 pointer-events-none" />
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            {/* Left Content */}
            <div className="lg:col-span-8 space-y-5 sm:space-y-6">
              <div className="flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] sm:text-xs font-bold bg-amber-400/10 text-amber-300 border border-amber-400/30">
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                  <span>{pageData.summaryBadge}</span>
                </span>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] sm:text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  <MapPin className="w-3.5 h-3.5" />
                  <span>{cityName} Foodservice Supply</span>
                </span>
                <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-[11px] sm:text-xs font-semibold bg-neutral-800 text-neutral-300 border border-neutral-700">
                  <span>{pageData.processingType}</span>
                </span>
              </div>

              <h1 className="text-xl sm:text-3xl lg:text-4xl xl:text-5xl font-black text-white tracking-tight leading-tight">
                {pageData.h1Heading}
              </h1>

              <p className="text-sm sm:text-base lg:text-lg text-amber-100/90 font-medium leading-relaxed max-w-3xl">
                {pageData.tagline}
              </p>

              <p className="text-xs sm:text-sm lg:text-base text-neutral-300 leading-relaxed max-w-3xl">
                {pageData.heroExcerpt}
              </p>

              {/* Fast Action Buttons */}
              <div className="pt-2 flex flex-col sm:flex-row flex-wrap items-stretch sm:items-center gap-2.5 sm:gap-3">
                <button
                  onClick={() => onOpenQuoteModal(pageData.varietyType, `${cityName} (${pageData.targetSegment})`)}
                  className="w-full sm:w-auto px-5 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-neutral-950 font-bold text-xs sm:text-sm shadow-lg shadow-amber-500/20 transition-all cursor-pointer flex items-center justify-center gap-2"
                >
                  <FileCheck className="w-4 h-4" />
                  <span>Request Wholesale Quote</span>
                </button>

                <button
                  onClick={() => onOpenSampleModal(pageData.varietyType, `${cityName} (${pageData.targetSegment})`)}
                  className="w-full sm:w-auto px-5 py-3 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-amber-300 border border-amber-500/30 hover:border-amber-400 font-bold text-xs sm:text-sm transition-all cursor-pointer flex items-center justify-center gap-2"
                >
                  <Package className="w-4 h-4 text-amber-400" />
                  <span>Get Free Sample</span>
                </button>

                <button
                  onClick={handleWhatsAppInquiry}
                  className="w-full sm:w-auto px-4 py-3 rounded-xl bg-emerald-800/90 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm transition-all cursor-pointer flex items-center justify-center gap-2 border border-emerald-600/40"
                >
                  <MessageCircle className="w-4 h-4 text-emerald-300" />
                  <span>WhatsApp Trade Desk</span>
                </button>
              </div>
            </div>

            {/* Right Metric Card */}
            <div className="lg:col-span-4 mt-2 lg:mt-0">
              <div className="bg-gradient-to-b from-neutral-900 to-neutral-900/90 border border-amber-500/20 rounded-2xl p-5 sm:p-6 shadow-2xl space-y-4 sm:space-y-5 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/5 rounded-full blur-2xl pointer-events-none" />

                <div className="flex items-center justify-between border-b border-neutral-800 pb-3">
                  <div className="flex items-center gap-2 text-amber-400">
                    <Award className="w-5 h-5 shrink-0" />
                    <span className="font-bold text-xs sm:text-sm tracking-wide">Key Grain Metrics</span>
                  </div>
                  <span className="text-[11px] px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 font-mono">
                    Sortex Tested
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2.5 sm:gap-3.5">
                  <div className="bg-neutral-950/70 rounded-xl p-2.5 sm:p-3 border border-neutral-800">
                    <span className="text-[10px] sm:text-[11px] text-neutral-400 block">Raw Length</span>
                    <span className="text-sm sm:text-base font-bold text-amber-300 mt-0.5 block font-mono">
                      {pageData.grainLengthRaw}
                    </span>
                  </div>

                  <div className="bg-neutral-950/70 rounded-xl p-2.5 sm:p-3 border border-neutral-800">
                    <span className="text-[10px] sm:text-[11px] text-neutral-400 block">Cooked Length</span>
                    <span className="text-sm sm:text-base font-bold text-emerald-400 mt-0.5 block font-mono">
                      {pageData.grainLengthCooked}
                    </span>
                  </div>

                  <div className="bg-neutral-950/70 rounded-xl p-2.5 sm:p-3 border border-neutral-800">
                    <span className="text-[10px] sm:text-[11px] text-neutral-400 block">Cooked Yield</span>
                    <span className="text-[11px] sm:text-xs font-bold text-neutral-200 mt-0.5 block">
                      {pageData.yieldRatio}
                    </span>
                  </div>

                  <div className="bg-neutral-950/70 rounded-xl p-2.5 sm:p-3 border border-neutral-800">
                    <span className="text-[10px] sm:text-[11px] text-neutral-400 block">Moisture Limit</span>
                    <span className="text-[11px] sm:text-xs font-bold text-neutral-200 mt-0.5 block font-mono">
                      {pageData.moisturePercentage}
                    </span>
                  </div>
                </div>

                <div className="bg-neutral-950/90 rounded-xl p-3 sm:p-3.5 border border-neutral-800 space-y-2">
                  <span className="text-xs font-semibold text-neutral-300 flex items-center gap-1.5">
                    <ChefHat className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                    <span>Recommended Culinary Uses:</span>
                  </span>
                  <ul className="space-y-1">
                    {pageData.recommendedDishes.slice(0, 3).map((dish, i) => (
                      <li key={i} className="text-[11px] sm:text-xs text-neutral-400 flex items-start gap-1.5">
                        <Check className="w-3 h-3 text-emerald-400 shrink-0 mt-0.5" />
                        <span>{dish}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="text-center pt-1">
                  <span className="text-[10px] sm:text-[11px] text-neutral-500">
                    Direct Mandi Sourcing • Hafizabad & Bucheki Mills
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Interactive Tabs Header - Clean, responsive horizontal scroll with indicator */}
      <div className="bg-neutral-900 border-b border-neutral-800 relative z-20 shadow-md">
        <div className="max-w-7xl mx-auto px-2 sm:px-6 lg:px-8">
          <div className="flex items-center space-x-1.5 sm:space-x-3 overflow-x-auto py-2.5 scrollbar-none">
            {[
              { id: 'guide', label: 'Sourcing Guide', icon: BookOpen },
              { id: 'specs', label: 'Specifications', icon: FileCheck },
              { id: 'yield', label: 'Yield & Cost Calc', icon: Calculator },
              { id: 'logistics', label: `${cityName} Logistics`, icon: Truck },
              { id: 'faqs', label: 'FAQs', icon: HelpCircle },
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-lg text-xs sm:text-sm font-semibold transition-all whitespace-nowrap cursor-pointer shrink-0 ${
                    isActive
                      ? 'bg-amber-400 text-neutral-950 shadow'
                      : 'text-neutral-300 hover:text-white hover:bg-neutral-800'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Main Tab Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
        {/* Tab 1: Comprehensive Sourcing Guide */}
        {activeTab === 'guide' && (
          <div className="space-y-8 sm:space-y-10">
            {/* Key Highlights Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 sm:gap-4">
              {pageData.keyHighlights.map((highlight, idx) => (
                <div
                  key={idx}
                  className="bg-neutral-900/80 border border-neutral-800 rounded-xl p-4 sm:p-5 hover:border-amber-500/30 transition-all flex items-start gap-3"
                >
                  <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center shrink-0 mt-0.5">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                  <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed">{highlight}</p>
                </div>
              ))}
            </div>

            {/* In-Depth Semantic Content Sections */}
            <div className="space-y-6 sm:space-y-8">
              {pageData.inDepthSections.map((section, idx) => (
                <article
                  key={idx}
                  className="bg-neutral-900/60 border border-neutral-800/80 rounded-2xl p-5 sm:p-8 space-y-4"
                >
                  <h2 className="text-lg sm:text-2xl font-bold text-white tracking-tight flex items-center gap-2.5">
                    <span className="w-2 sm:w-2.5 h-5 sm:h-6 rounded bg-amber-400 inline-block shrink-0" />
                    <span>{section.heading}</span>
                  </h2>

                  <div className="space-y-3.5 text-neutral-300 text-xs sm:text-sm md:text-base leading-relaxed">
                    {section.paragraphs.map((p, pIdx) => (
                      <p key={pIdx}>{p}</p>
                    ))}
                  </div>

                  {section.bulletPoints && section.bulletPoints.length > 0 && (
                    <div className="pt-2">
                      <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                        {section.bulletPoints.map((bp, bpIdx) => (
                          <li
                            key={bpIdx}
                            className="bg-neutral-950/70 border border-neutral-800 rounded-lg p-3 text-xs sm:text-sm text-neutral-300 flex items-start gap-2.5"
                          >
                            <Sparkles className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                            <span>{bp}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </article>
              ))}
            </div>

            {/* Culinary Physics Box */}
            <div className="bg-gradient-to-r from-emerald-950/50 via-neutral-900 to-emerald-950/50 border border-emerald-500/30 rounded-2xl p-5 sm:p-8 space-y-3">
              <div className="flex items-center gap-2 text-emerald-400">
                <Flame className="w-5 h-5 shrink-0" />
                <h3 className="font-bold text-sm sm:text-lg text-white">
                  {pageData.culinaryPhysics.title}
                </h3>
              </div>
              <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed">
                {pageData.culinaryPhysics.content}
              </p>
            </div>

            {/* Target Commercial Areas */}
            <div className="bg-neutral-900/70 border border-neutral-800 rounded-2xl p-5 sm:p-8 space-y-4">
              <div className="flex items-center gap-2 text-amber-400">
                <Building2 className="w-5 h-5 shrink-0" />
                <h3 className="font-bold text-sm sm:text-lg text-white">
                  Target Commercial Foodservice Hubs in {cityName}
                </h3>
              </div>
              <p className="text-xs sm:text-sm text-neutral-400">
                We provide scheduled daily and weekly freight routes servicing the following key culinary districts across {cityName}:
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5 sm:gap-3">
                {targetHubs.map((hub, hIdx) => (
                  <div
                    key={hIdx}
                    className="bg-neutral-950 border border-neutral-800/80 rounded-xl p-3 sm:p-3.5 flex items-center gap-2.5 sm:gap-3 text-xs sm:text-sm text-neutral-200"
                  >
                    <MapPin className="w-4 h-4 text-amber-400 shrink-0" />
                    <span className="break-words">{hub}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Technical Specifications */}
        {activeTab === 'specs' && (
          <div className="space-y-8">
            <div className="bg-neutral-900/80 border border-neutral-800 rounded-2xl p-5 sm:p-8 space-y-6">
              <div>
                <h2 className="text-lg sm:text-2xl font-bold text-white tracking-tight">
                  Laboratory-Certified Physical & Culinary Specifications
                </h2>
                <p className="text-xs sm:text-sm text-neutral-400 mt-1">
                  Every batch of {pageData.varietyType} ({pageData.processingType}) is verified through optical sortexing, electronic moisture meters, and physical grain sizing.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                {pageData.specifications.map((spec, sIdx) => (
                  <div
                    key={sIdx}
                    className="bg-neutral-950 border border-neutral-800 rounded-xl p-3.5 sm:p-4 space-y-1 hover:border-amber-500/30 transition-all"
                  >
                    <span className="text-xs text-neutral-500 block">{spec.label}</span>
                    <span className="text-xs sm:text-sm font-bold text-amber-300 block font-mono break-words">
                      {spec.value}
                    </span>
                  </div>
                ))}
              </div>

              <div className="border-t border-neutral-800 pt-6 space-y-4">
                <h3 className="font-bold text-sm text-neutral-200 flex items-center gap-2">
                  <Clock className="w-4 h-4 text-amber-400 shrink-0" />
                  <span>Culinary Timing & Storage Guidelines</span>
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-4 text-xs text-neutral-300">
                  <div className="bg-neutral-950 p-3.5 rounded-lg border border-neutral-800">
                    <strong className="text-white block mb-1">Recommended Cooking Method:</strong>
                    <span>{pageData.cookingMethod}</span>
                  </div>
                  <div className="bg-neutral-950 p-3.5 rounded-lg border border-neutral-800">
                    <strong className="text-white block mb-1">Commercial Holding Time:</strong>
                    <span>{pageData.holdingTime}</span>
                  </div>
                  <div className="bg-neutral-950 p-3.5 rounded-lg border border-neutral-800">
                    <strong className="text-white block mb-1">Natural Aging Cycle:</strong>
                    <span>{pageData.agingDuration}</span>
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 pt-4 border-t border-neutral-800">
                <div className="text-xs text-neutral-400 flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Certificate of Analysis (COA) provided with every commercial dispatch.</span>
                </div>
                <button
                  onClick={() => onOpenSampleModal(pageData.varietyType, `${cityName} (${pageData.targetSegment})`)}
                  className="px-4 py-2.5 rounded-lg bg-amber-400 hover:bg-amber-300 text-neutral-950 font-bold text-xs transition-colors cursor-pointer text-center"
                >
                  Request Free Cooking Sample
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Tab 3: Interactive Plate Yield & Cost Calculator */}
        {activeTab === 'yield' && (
          <div className="space-y-8">
            <div className="bg-neutral-900/80 border border-neutral-800 rounded-2xl p-5 sm:p-8 space-y-6">
              <div>
                <h2 className="text-lg sm:text-2xl font-bold text-white tracking-tight flex items-center gap-2.5">
                  <Calculator className="w-5 h-5 sm:w-6 sm:h-6 text-amber-400 shrink-0" />
                  <span>Commercial Plate Yield & Serving Estimator</span>
                </h2>
                <p className="text-xs sm:text-sm text-neutral-400 mt-1">
                  Calculate total cooked volume, portion count, and food cost leverage for {pageData.targetSegment} in {cityName} using {pageData.varietyType}.
                </p>
              </div>

              {/* Calculator Inputs */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-neutral-950 p-4 sm:p-6 rounded-xl border border-neutral-800">
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-neutral-300 flex items-center justify-between">
                    <span>Number of 50kg Bags:</span>
                    <span className="text-amber-400 font-mono font-bold">{calcRawBags} Bags ({totalKgRaw} kg)</span>
                  </label>
                  <input
                    type="range"
                    min="1"
                    max="100"
                    value={calcRawBags}
                    onChange={(e) => setCalcRawBags(parseInt(e.target.value) || 1)}
                    className="w-full h-2 bg-neutral-800 rounded-lg appearance-none cursor-pointer accent-amber-400"
                  />
                  <div className="flex justify-between text-[10px] text-neutral-500 font-mono">
                    <span>1 Bag (50kg)</span>
                    <span>50 Bags (2.5 T)</span>
                    <span>100 Bags (5 T)</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-semibold text-neutral-300 flex items-center justify-between">
                    <span>Target Cooked Portion Size:</span>
                    <span className="text-emerald-400 font-mono font-bold">{portionSizeGrams} Grams</span>
                  </label>
                  <input
                    type="range"
                    min="200"
                    max="600"
                    step="25"
                    value={portionSizeGrams}
                    onChange={(e) => setPortionSizeGrams(parseInt(e.target.value) || 300)}
                    className="w-full h-2 bg-neutral-800 rounded-lg appearance-none cursor-pointer accent-emerald-400"
                  />
                  <div className="flex justify-between text-[10px] text-neutral-500 font-mono">
                    <span>200g (Side/Buffet)</span>
                    <span>350g (Standard)</span>
                    <span>500g+ (Platter/Daig)</span>
                  </div>
                </div>
              </div>

              {/* Calculated Outputs */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 sm:gap-4">
                <div className="bg-gradient-to-b from-neutral-950 to-neutral-950/80 p-4 rounded-xl border border-neutral-800 space-y-1">
                  <span className="text-xs text-neutral-400">Total Raw Grain Weight</span>
                  <span className="text-xl sm:text-2xl font-black text-white font-mono block">
                    {totalKgRaw.toLocaleString()} <span className="text-xs font-normal text-neutral-500">kg</span>
                  </span>
                  <span className="text-[11px] text-neutral-500 font-mono">({(totalKgRaw / 1000).toFixed(2)} Metric Tons)</span>
                </div>

                <div className="bg-gradient-to-b from-emerald-950/40 to-neutral-950 p-4 rounded-xl border border-emerald-500/30 space-y-1">
                  <span className="text-xs text-emerald-400">Total Cooked Rice Yield</span>
                  <span className="text-xl sm:text-2xl font-black text-emerald-300 font-mono block">
                    {Math.round(totalCookedKg).toLocaleString()} <span className="text-xs font-normal text-emerald-500">kg</span>
                  </span>
                  <span className="text-[11px] text-emerald-400/80 font-mono">({yieldMultiplier}x Multiplier applied)</span>
                </div>

                <div className="bg-gradient-to-b from-amber-950/40 to-neutral-950 p-4 rounded-xl border border-amber-500/30 space-y-1">
                  <span className="text-xs text-amber-400">Estimated Total Servings</span>
                  <span className="text-xl sm:text-2xl font-black text-amber-300 font-mono block">
                    {totalPortions.toLocaleString()} <span className="text-xs font-normal text-amber-500">portions</span>
                  </span>
                  <span className="text-[11px] text-amber-400/80 font-mono">(@ {portionSizeGrams}g per portion)</span>
                </div>
              </div>

              <div className="bg-neutral-950 p-4 rounded-xl border border-neutral-800 text-xs text-neutral-300 leading-relaxed flex items-start gap-3">
                <Info className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <p>
                  <strong>Commercial Procurement Takeaway:</strong> For {pageData.targetSegment} in {cityName}, utilizing {pageData.varietyType} provides high moisture absorption stability, minimizing plate leftovers and enabling precise portion-cost calculations for high-volume kitchen operations.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Tab 4: Delivery Logistics & Mandi Routing */}
        {activeTab === 'logistics' && (
          <div className="space-y-8">
            <div className="bg-neutral-900/80 border border-neutral-800 rounded-2xl p-5 sm:p-8 space-y-6">
              <div>
                <h2 className="text-lg sm:text-2xl font-bold text-white tracking-tight flex items-center gap-2.5">
                  <Truck className="w-5 h-5 sm:w-6 sm:h-6 text-amber-400 shrink-0" />
                  <span>Direct Ex-Mill Mandi Logistics to {cityName}</span>
                </h2>
                <p className="text-xs sm:text-sm text-neutral-400 mt-1">
                  How Hashir Rice Supplier coordinates uninterrupted grain supply directly from milling clusters to {cityName} commercial kitchens.
                </p>
              </div>

              <div className="bg-neutral-950 p-4 sm:p-5 rounded-xl border border-neutral-800 text-xs sm:text-sm text-neutral-300 leading-relaxed">
                {pageData.logisticsOverview}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5 sm:gap-4">
                <div className="bg-neutral-950 p-4 rounded-xl border border-neutral-800 space-y-2">
                  <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
                    <Clock className="w-4 h-4" />
                  </div>
                  <h3 className="font-bold text-sm text-white">Scheduled Direct Drops</h3>
                  <p className="text-xs text-neutral-400 leading-relaxed">
                    Direct truck dispatch from milling facilities ensuring fresh, unadulterated lots reach your {cityName} kitchen storage rapidly.
                  </p>
                </div>

                <div className="bg-neutral-950 p-4 rounded-xl border border-neutral-800 space-y-2">
                  <div className="w-8 h-8 rounded-lg bg-amber-500/10 text-amber-400 flex items-center justify-center">
                    <ShieldCheck className="w-4 h-4" />
                  </div>
                  <h3 className="font-bold text-sm text-white">Moisture-Barrier Packaging</h3>
                  <p className="text-xs text-neutral-400 leading-relaxed">
                    Packed in 25kg double-laminated bags or 50kg heavy-duty woven polypropylene sacks resistant to transit humidity and dust contamination.
                  </p>
                </div>

                <div className="bg-neutral-950 p-4 rounded-xl border border-neutral-800 space-y-2">
                  <div className="w-8 h-8 rounded-lg bg-blue-500/10 text-blue-400 flex items-center justify-center">
                    <FileCheck className="w-4 h-4" />
                  </div>
                  <h3 className="font-bold text-sm text-white">Transparent Bilty & Invoicing</h3>
                  <p className="text-xs text-neutral-400 leading-relaxed">
                    Formal goods consignment notes (Bilty), electronic weight scale receipts, and tax invoices provided with every commercial dispatch.
                  </p>
                </div>
              </div>

              <div className="pt-4 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 border-t border-neutral-800">
                <span className="text-xs text-neutral-400">
                  Need a custom weekly or monthly contracted freight schedule in {cityName}?
                </span>
                <button
                  onClick={handleWhatsAppInquiry}
                  className="px-4 py-2.5 rounded-lg bg-emerald-800 hover:bg-emerald-700 text-white font-bold text-xs transition-colors cursor-pointer flex items-center justify-center gap-2"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Discuss {cityName} Freight Terms</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Tab 5: Segment FAQs */}
        {activeTab === 'faqs' && (
          <div className="space-y-8">
            <div className="bg-neutral-900/80 border border-neutral-800 rounded-2xl p-5 sm:p-8 space-y-6">
              <div>
                <h2 className="text-lg sm:text-2xl font-bold text-white tracking-tight flex items-center gap-2.5">
                  <HelpCircle className="w-5 h-5 sm:w-6 sm:h-6 text-amber-400 shrink-0" />
                  <span>Frequently Asked Questions for {cityName} {pageData.targetSegment}</span>
                </h2>
                <p className="text-xs sm:text-sm text-neutral-400 mt-1">
                  Common procurement, cooking, and delivery inquiries answered by our grain specialists.
                </p>
              </div>

              <div className="space-y-3.5 sm:space-y-4">
                {pageData.faqs.map((faq, fIdx) => (
                  <div
                    key={fIdx}
                    className="bg-neutral-950 border border-neutral-800 rounded-xl p-4 sm:p-5 space-y-2"
                  >
                    <h3 className="text-xs sm:text-sm md:text-base font-bold text-amber-300 flex items-start gap-2">
                      <span className="text-neutral-500 font-mono shrink-0">Q{fIdx + 1}.</span>
                      <span>{faq.question}</span>
                    </h3>
                    <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed pl-5 sm:pl-6">
                      {faq.answer}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Quick Hub Switcher for All 12 Commercial Pages */}
        <section className="mt-12 sm:mt-16 pt-10 sm:pt-12 border-t border-neutral-800 space-y-6 sm:space-y-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-lg sm:text-2xl font-bold text-white tracking-tight">
                Explore All 12 {cityName} Commercial Rice Portals
              </h2>
              <p className="text-xs sm:text-sm text-neutral-400 mt-0.5">
                Switch between specialized grain grades (Sella, Steam, White) and commercial buyer segments in {cityName}.
              </p>
            </div>

            {/* Filter Pills */}
            <div className="flex flex-wrap items-center gap-2">
              <div className="flex flex-wrap items-center gap-1 bg-neutral-900 p-1 rounded-lg border border-neutral-800 text-xs">
                <span className="text-neutral-400 px-2">Segment:</span>
                {['all', 'Restaurants', 'Catering', 'Hotels', 'Mess & Hostels'].map((seg) => (
                  <button
                    key={seg}
                    onClick={() => setSelectedSegmentFilter(seg as any)}
                    className={`px-2.5 py-1 rounded text-[11px] sm:text-xs font-medium transition-colors cursor-pointer ${
                      selectedSegmentFilter === seg
                        ? 'bg-amber-400 text-neutral-950 font-bold'
                        : 'text-neutral-400 hover:text-white'
                    }`}
                  >
                    {seg === 'all' ? 'All' : seg}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Grid of 12 Commercial Pages */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4">
            {filteredPages.map((page) => {
              const isCurrent = page.slug === pageData.slug;
              return (
                <a
                  key={page.id}
                  href={`/${page.slug}`}
                  onClick={(e) => {
                    e.preventDefault();
                    onSelectPage(page.slug);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className={`text-left p-3.5 sm:p-4 rounded-xl border transition-all flex flex-col justify-between cursor-pointer space-y-2.5 block ${
                    isCurrent
                      ? 'bg-amber-400/10 border-amber-400 text-white shadow-lg'
                      : 'bg-neutral-900/60 border-neutral-800 hover:border-neutral-700 text-neutral-300 hover:text-white hover:bg-neutral-900'
                  }`}
                >
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] uppercase tracking-wider font-bold px-2 py-0.5 rounded bg-neutral-800 text-amber-300">
                        {page.targetSegment}
                      </span>
                      {isCurrent && (
                        <span className="text-[10px] font-bold text-amber-400">Current</span>
                      )}
                    </div>
                    <h3 className="font-bold text-xs sm:text-sm text-white break-words leading-snug">
                      {page.title}
                    </h3>
                  </div>

                  <div className="pt-2 border-t border-neutral-800/80 flex items-center justify-between text-[11px] text-neutral-400">
                    <span className="font-mono text-[10px] sm:text-[11px]">{page.grainLengthRaw}</span>
                    <span className="text-amber-400 font-semibold flex items-center gap-1">
                      <span>View</span>
                      <ArrowRight className="w-3 h-3" />
                    </span>
                  </div>
                </a>
              );
            })}
          </div>
        </section>

        {/* Google My Business Verified Map Corridor for Commercial Delivery */}
        <section className="mt-12 sm:mt-16">
          <GoogleBusinessMap
            cityName={cityName}
            province={cityName === 'Karachi' ? 'Sindh' : cityName === 'Peshawar' ? 'Khyber Pakhtunkhwa' : cityName === 'Quetta' ? 'Balochistan' : 'Punjab'}
            customHeading={`${cityName} Foodservice & Wholesale Transit Corridor`}
            customSubheading={`Connecting daily truckload bulk dispatch from Noor Galla Mandi Bucheki to ${cityName}`}
            height="300px"
            showDetailsGrid={true}
          />
        </section>

        {/* Google SEO Internal Linking Authority Network */}
        <section className="mt-12 sm:mt-16 bg-neutral-900/90 border border-neutral-800 rounded-2xl sm:rounded-3xl p-6 sm:p-8">
          <div className="flex items-center gap-2 mb-3">
            <span className="w-2 h-2 rounded-full bg-amber-400"></span>
            <h3 className="text-sm font-bold uppercase tracking-wider text-amber-400">
              {cityName} Commercial Sourcing Architecture & Authority Links
            </h3>
          </div>
          <p className="text-xs text-neutral-400 mb-6 leading-relaxed">
            Hashir Rice Supplier operates direct ex-mill supply corridors connecting mills in Punjab and Sindh to restaurants, caterers, and bulk distributors across {cityName} and all major Pakistan cities. Navigate to core hubs below:
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
            <div className="p-4 rounded-xl bg-neutral-950 border border-neutral-800">
              <h4 className="font-bold text-white mb-2 flex items-center gap-1.5">
                <Building2 className="w-3.5 h-3.5 text-amber-400" />
                <span>Primary Portals</span>
              </h4>
              <ul className="space-y-1.5 text-neutral-400">
                <li>
                  <a
                    href="/"
                    onClick={(e) => {
                      e.preventDefault();
                      onBackToHome();
                    }}
                    className="hover:text-amber-400 hover:underline font-semibold text-amber-300 flex items-center gap-1"
                  >
                    <span>• Wholesale Rice Supplier Pakistan Home</span>
                  </a>
                </li>
                <li>
                  <a
                    href={`/${citySlug}`}
                    onClick={(e) => {
                      e.preventDefault();
                      onBackToCity();
                    }}
                    className="hover:text-amber-400 hover:underline flex items-center gap-1"
                  >
                    <span>• {cityName} Central Sourcing Hub</span>
                  </a>
                </li>
                <li>
                  <a
                    href="/locations"
                    onClick={(e) => {
                      e.preventDefault();
                      onBackToHome();
                    }}
                    className="hover:text-amber-400 hover:underline flex items-center gap-1"
                  >
                    <span>• Pakistan 60+ Cities Network</span>
                  </a>
                </li>
              </ul>
            </div>

            <div className="p-4 rounded-xl bg-neutral-950 border border-neutral-800">
              <h4 className="font-bold text-white mb-2 flex items-center gap-1.5">
                <ChefHat className="w-3.5 h-3.5 text-amber-400" />
                <span>Varieties & Rates</span>
              </h4>
              <ul className="space-y-1.5 text-neutral-400">
                <li>
                  <a
                    href="/varieties"
                    onClick={(e) => {
                      e.preventDefault();
                      onBackToHome();
                    }}
                    className="hover:text-amber-400 hover:underline flex items-center gap-1"
                  >
                    <span>• 10 Pakistan Rice Varieties</span>
                  </a>
                </li>
                <li>
                  <a
                    href="/exchange"
                    onClick={(e) => {
                      e.preventDefault();
                      onBackToHome();
                    }}
                    className="hover:text-amber-400 hover:underline flex items-center gap-1"
                  >
                    <span>• Live Mandi Spot Rates</span>
                  </a>
                </li>
                <li>
                  <a
                    href="/google-ai-overview"
                    onClick={(e) => {
                      e.preventDefault();
                      onBackToHome();
                    }}
                    className="hover:text-amber-400 hover:underline flex items-center gap-1"
                  >
                    <span>• Google AI Rice Knowledge Hub</span>
                  </a>
                </li>
              </ul>
            </div>

            <div className="p-4 rounded-xl bg-neutral-950 border border-neutral-800">
              <h4 className="font-bold text-white mb-2 flex items-center gap-1.5">
                <FileCheck className="w-3.5 h-3.5 text-amber-400" />
                <span>Verification & Samples</span>
              </h4>
              <ul className="space-y-1.5 text-neutral-400">
                <li>
                  <a
                    href="/sample"
                    onClick={(e) => {
                      e.preventDefault();
                      onOpenSampleModal(pageData.varietyType, `${cityName} (${pageData.targetSegment})`);
                    }}
                    className="hover:text-amber-400 hover:underline font-semibold text-amber-300 flex items-center gap-1"
                  >
                    <span>• Free Physical Cooking Sample</span>
                  </a>
                </li>
                <li>
                  <a
                    href="/workflow"
                    onClick={(e) => {
                      e.preventDefault();
                      onBackToHome();
                    }}
                    className="hover:text-amber-400 hover:underline flex items-center gap-1"
                  >
                    <span>• 7-Step Quality Procurement</span>
                  </a>
                </li>
              </ul>
            </div>

            <div className="p-4 rounded-xl bg-neutral-950 border border-neutral-800">
              <h4 className="font-bold text-white mb-2 flex items-center gap-1.5">
                <HelpCircle className="w-3.5 h-3.5 text-amber-400" />
                <span>About & Directory</span>
              </h4>
              <ul className="space-y-1.5 text-neutral-400">
                <li>
                  <a
                    href="/about"
                    onClick={(e) => {
                      e.preventDefault();
                      onBackToHome();
                    }}
                    className="hover:text-amber-400 hover:underline flex items-center gap-1"
                  >
                    <span>• About Hashir Rice Supplier</span>
                  </a>
                </li>
                <li>
                  <a
                    href="/sitemap"
                    onClick={(e) => {
                      e.preventDefault();
                      onBackToHome();
                    }}
                    className="hover:text-amber-400 hover:underline flex items-center gap-1"
                  >
                    <span>• HTML Sitemap & Directory</span>
                  </a>
                </li>
                <li>
                  <a
                    href="/privacy"
                    onClick={(e) => {
                      e.preventDefault();
                      onBackToHome();
                    }}
                    className="hover:text-amber-400 hover:underline flex items-center gap-1"
                  >
                    <span>• Privacy Policy</span>
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </section>

        {/* Bottom CTA Banner */}
        <section className="mt-12 sm:mt-16 bg-gradient-to-r from-emerald-950 via-neutral-900 to-emerald-950 border border-amber-500/30 rounded-2xl sm:rounded-3xl p-6 sm:p-12 text-center space-y-5 sm:space-y-6 relative overflow-hidden">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative max-w-3xl mx-auto space-y-2.5 sm:space-y-3">
            <span className="px-3 py-1 rounded-full bg-amber-400/10 border border-amber-400/30 text-amber-300 text-[11px] sm:text-xs font-bold uppercase tracking-wider inline-block">
              Direct Ex-Mill Rice Supply to {cityName}
            </span>
            <h2 className="text-xl sm:text-3xl lg:text-4xl font-black text-white tracking-tight">
              Ready to Upgrade Grain Consistency in {cityName}?
            </h2>
            <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed">
              Connect directly with our commercial trade desk for live spot rates, bulk truckload bookings, or to receive a <strong>free physical cooking sample</strong> delivered to your {cityName} kitchen.
            </p>
          </div>

          <div className="relative flex flex-col sm:flex-row flex-wrap items-center justify-center gap-3">
            <button
              onClick={() => onOpenQuoteModal(pageData.varietyType, `${cityName} (${pageData.targetSegment})`)}
              className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-neutral-950 font-bold text-xs sm:text-sm shadow-xl shadow-amber-500/20 transition-all cursor-pointer flex items-center justify-center gap-2"
            >
              <FileCheck className="w-4 h-4" />
              <span>Get Immediate Wholesale Quote</span>
            </button>

            <button
              onClick={() => onOpenSampleModal(pageData.varietyType, `${cityName} (${pageData.targetSegment})`)}
              className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-amber-300 border border-amber-500/40 hover:border-amber-400 font-bold text-xs sm:text-sm transition-all cursor-pointer flex items-center justify-center gap-2"
            >
              <Package className="w-4 h-4 text-amber-400" />
              <span>Request Free Sample</span>
            </button>

            <button
              onClick={handleWhatsAppInquiry}
              className="w-full sm:w-auto px-5 py-3.5 rounded-xl bg-emerald-800 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm transition-all cursor-pointer flex items-center justify-center gap-2 border border-emerald-600/40"
            >
              <MessageCircle className="w-4 h-4 text-emerald-300" />
              <span>WhatsApp Direct Desk</span>
            </button>
          </div>
        </section>
      </main>
    </div>
  );
};
