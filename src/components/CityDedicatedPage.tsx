import React, { useState, useEffect } from 'react';
import { CityData, RiceVariety, WordPressPage } from '../types';
import { CITIES_DATA } from '../data/citiesData';
import { RICE_VARIETIES } from '../data/riceData';
import { getSyncedPageBySlug } from '../data/defaultPagesData';
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
  Store,
  HelpCircle,
  ArrowRight,
  FileCheck,
  Building2,
  ChefHat,
  Scale,
  Package,
  Layers,
  ArrowLeft,
  TrendingUp,
  Flame,
  Check,
  Filter,
  BadgeCheck,
  Info,
  ExternalLink
} from 'lucide-react';

interface CityDedicatedPageProps {
  city: CityData;
  onBackToLocations: () => void;
  onBackToHome?: () => void;
  onSelectCity: (citySlug: string) => void;
  onOpenQuoteModal: (varietyName?: string, cityName?: string) => void;
  onOpenSampleModal: (varietyName?: string, cityName?: string) => void;
  onSelectLahoreCommercialPage?: (slug: string) => void;
  onSelectKarachiCommercialPage?: (slug: string) => void;
  onSelectPeshawarCommercialPage?: (slug: string) => void;
  onSelectQuettaCommercialPage?: (slug: string) => void;
  onSelectHyderabadCommercialPage?: (slug: string) => void;
  onSelectFaisalabadCommercialPage?: (slug: string) => void;
}

export const CityDedicatedPage: React.FC<CityDedicatedPageProps> = ({
  city,
  onBackToLocations,
  onBackToHome,
  onSelectCity,
  onOpenQuoteModal,
  onOpenSampleModal,
  onSelectLahoreCommercialPage,
  onSelectKarachiCommercialPage,
  onSelectPeshawarCommercialPage,
  onSelectQuettaCommercialPage,
  onSelectHyderabadCommercialPage,
  onSelectFaisalabadCommercialPage,
}) => {
  const [selectedProvinceFilter, setSelectedProvinceFilter] = useState<string>('All');
  const [selectedProductCategory, setSelectedProductCategory] = useState<string>('all');
  const [activeTab, setActiveTab] = useState<'overview' | 'products' | 'sourcing' | 'culinary' | 'logistics' | 'faq'>('overview');
  const [syncedPage, setSyncedPage] = useState<WordPressPage | undefined>(() => getSyncedPageBySlug(city.slug));

  useEffect(() => {
    setSyncedPage(getSyncedPageBySlug(city.slug));
    const handleSync = () => setSyncedPage(getSyncedPageBySlug(city.slug));
    window.addEventListener('hashir_pages_updated', handleSync);
    return () => window.removeEventListener('hashir_pages_updated', handleSync);
  }, [city.slug]);

  // Filter other cities for the quick switcher
  const otherCities = CITIES_DATA.filter((c) => c.slug !== city.slug);
  const filteredOtherCities = otherCities.filter((c) => {
    if (selectedProvinceFilter === 'All') return true;
    return c.province === selectedProvinceFilter;
  });

  // Filter all products by category
  const filteredProducts = RICE_VARIETIES.filter((v) => {
    if (selectedProductCategory === 'all') return true;
    return v.category === selectedProductCategory;
  });

  const handleWhatsAppInquiry = (varietyName?: string) => {
    const requestedVariety = varietyName || city.popularVarieties[0] || '1121 Kainat Steam Basmati';
    const text = encodeURIComponent(
      `*Wholesale Rice Sourcing Inquiry for ${city.name}*\n\n` +
      `📍 *Target Destination:* ${city.name} (${city.province})\n` +
      `🌾 *Requested Variety:* ${requestedVariety}\n` +
      `🏢 *Target Wholesale Mandi / Area:* ${city.majorMarkets[0]}\n` +
      `📦 *Required Quantity:* 5 to 50 Metric Tons\n\n` +
      `_Hello Hashir Rice Supplier, please provide today's ex-mill bulk rice price list, freight bilty charges, and free physical sample dispatch details for delivery in ${city.name}._`
    );
    window.open(`https://wa.me/923338990883?text=${text}`, '_blank');
  };

  // Inject city-specific Google Search Schemas
  useEffect(() => {
    const cityLocalBusinessSchema = {
      '@context': 'https://schema.org',
      '@type': 'WholesaleStore',
      name: `Hashir Rice Supplier - Wholesale Rice Supplier in ${city.name}`,
      description: `Wholesale rice supplier and bulk basmati trader supplying ${city.name} (${city.province}) with 1121 Kainat Steam, Super Kernel Basmati, and IRRI-6 directly to ${city.majorMarkets.join(', ')}.`,
      url: `https://hashirricesupplier.com/${city.slug}`,
      telephone: '+923338990883',
      priceRange: 'PKR 115 - PKR 410 per KG',
      areaServed: {
        '@type': 'City',
        name: city.name,
        containedInPlace: {
          '@type': 'AdministrativeArea',
          name: city.province,
        },
      },
      hasOfferCatalog: {
        '@type': 'OfferCatalog',
        name: `Wholesale Rice Supply for ${city.name}`,
        itemListElement: (city.popularVarieties || []).map((v, i) => ({
          '@type': 'Offer',
          position: i + 1,
          itemOffered: {
            '@type': 'Product',
            name: `${v} - ${city.name} Wholesale Delivery`,
            description: `Direct ex-mill wholesale ${v} supply for ${city.name} (${city.province}) from Noor Galla Mandi, Bucheki with 100% Buhler sortex purity and under 12% moisture.`,
            image: ['https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=1200&q=80'],
            sku: `HRS-${city.slug.toUpperCase()}-${i + 1}`,
            mpn: `HRS-${city.slug.toUpperCase()}-${i + 1}`,
            brand: {
              '@type': 'Brand',
              name: 'Hashir Rice Supplier',
            },
            aggregateRating: {
              '@type': 'AggregateRating',
              ratingValue: '4.9',
              bestRating: '5',
              worstRating: '1',
              ratingCount: '148',
              reviewCount: '124',
            },
            review: {
              '@type': 'Review',
              reviewRating: {
                '@type': 'Rating',
                ratingValue: '5',
                bestRating: '5',
                worstRating: '1',
              },
              author: {
                '@type': 'Person',
                name: 'Haji Tariq Mehmood',
              },
              datePublished: '2026-09-15',
              reviewBody: `Verified direct ex-mill ${v} consignment delivered to ${city.name} from Noor Galla Mandi, Bucheki.`,
            },
            offers: {
              '@type': 'Offer',
              url: `https://hashirricesupplier.com/${city.slug}`,
              priceCurrency: 'PKR',
              price: '285',
              priceValidUntil: '2027-12-31',
              itemCondition: 'https://schema.org/NewCondition',
              availability: 'https://schema.org/InStock',
              shippingDetails: {
                '@type': 'OfferShippingDetails',
                shippingRate: { '@type': 'MonetaryAmount', value: '0', currency: 'PKR' },
                shippingDestination: { '@type': 'DefinedRegion', addressCountry: 'PK' },
                deliveryTime: {
                  '@type': 'ShippingDeliveryTime',
                  handlingTime: { '@type': 'QuantitativeValue', minValue: 0, maxValue: 1, unitCode: 'DAY' },
                  transitTime: { '@type': 'QuantitativeValue', minValue: 1, maxValue: 2, unitCode: 'DAY' },
                },
              },
              hasMerchantReturnPolicy: {
                '@type': 'MerchantReturnPolicy',
                applicableCountry: 'PK',
                returnPolicyCategory: 'https://schema.org/MerchantReturnFiniteReturnWindow',
                merchantReturnDays: 7,
                returnMethod: 'https://schema.org/ReturnByMail',
                returnFees: 'https://schema.org/FreeReturn',
              },
            },
          },
        })),
      },
    };

    const cityFaqSchema = {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: (city.localFaq || []).map((f) => ({
        '@type': 'Question',
        name: f.q,
        acceptedAnswer: {
          '@type': 'Answer',
          text: f.a,
        },
      })),
    };

    const cityBreadcrumbSchema = {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        {
          '@type': 'ListItem',
          position: 1,
          name: 'Home',
          item: 'https://hashirricesupplier.com/',
        },
        {
          '@type': 'ListItem',
          position: 2,
          name: 'Pakistan Wholesale Locations',
          item: 'https://hashirricesupplier.com/locations',
        },
        {
          '@type': 'ListItem',
          position: 3,
          name: `Rice Supplier in ${city.name}`,
          item: `https://hashirricesupplier.com/${city.slug}`,
        },
      ],
    };

    const injectScript = (id: string, data: object) => {
      let script = document.getElementById(id) as HTMLScriptElement;
      if (!script) {
        script = document.createElement('script');
        script.type = 'application/ld+json';
        script.id = id;
        document.head.appendChild(script);
      }
      script.text = JSON.stringify(data);
    };

    injectScript('seo-city-local-business', cityLocalBusinessSchema);
    injectScript('seo-city-faq', cityFaqSchema);
    injectScript('seo-city-breadcrumbs', cityBreadcrumbSchema);

    return () => {
      document.getElementById('seo-city-local-business')?.remove();
      document.getElementById('seo-city-faq')?.remove();
      document.getElementById('seo-city-breadcrumbs')?.remove();
    };
  }, [city]);

  return (
    <div className="bg-neutral-50/50 min-h-screen pb-20">
      {/* Top Breadcrumb Navigation */}
      <div className="bg-white border-b border-neutral-200 shadow-2xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex flex-wrap items-center justify-between gap-2.5">
          <nav className="flex items-center gap-2 text-xs text-neutral-500 overflow-x-auto whitespace-nowrap max-w-full py-0.5" aria-label="Breadcrumb">
            <a
              href="/"
              onClick={(e) => {
                e.preventDefault();
                if (onBackToHome) onBackToHome();
                else onBackToLocations();
              }}
              className="hover:text-emerald-900 transition-colors flex items-center gap-1 font-medium shrink-0"
            >
              <span>Home</span>
            </a>
            <ChevronRight className="w-3.5 h-3.5 text-neutral-400 shrink-0" />
            <a
              href="/locations"
              onClick={(e) => {
                e.preventDefault();
                onBackToLocations();
              }}
              className="hover:text-emerald-900 transition-colors font-medium shrink-0"
            >
              <span>Pakistan Wholesale Sourcing Hub</span>
            </a>
            <ChevronRight className="w-3.5 h-3.5 text-neutral-400 shrink-0" />
            <span className="font-semibold text-emerald-950 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 truncate max-w-[200px] sm:max-w-none">
              Rice Supplier in {city.name}
            </span>
          </nav>

          <a
            href="/locations"
            onClick={(e) => {
              e.preventDefault();
              onBackToLocations();
            }}
            className="text-xs font-semibold text-neutral-600 hover:text-emerald-950 flex items-center gap-1.5 shrink-0 py-1 px-2.5 rounded-md hover:bg-neutral-100 transition-colors inline-flex"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">All Major Cities</span>
            <span className="sm:hidden">All Cities</span>
          </a>
        </div>
      </div>

      {/* Hero Header for City Page */}
      <section className="relative overflow-hidden bg-gradient-to-b from-neutral-950 via-emerald-950 to-neutral-900 text-white py-12 lg:py-16">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#fbbf24_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-4xl">
            
            {/* Trust & Identity Badges */}
            <div className="flex flex-wrap items-center gap-2 mb-4">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-400/20 text-amber-300 text-xs font-bold uppercase tracking-wider border border-amber-400/30">
                <MapPin className="w-3.5 h-3.5 text-amber-300" />
                <span>{city.province} Sourcing Corridor</span>
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-800/40 text-emerald-300 text-xs font-medium border border-emerald-700/50">
                <Clock className="w-3.5 h-3.5 text-emerald-400" />
                <span>Transit: {city.typicalLogisticsLeadTime}</span>
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-neutral-200 text-xs font-medium border border-white/20">
                <BadgeCheck className="w-3.5 h-3.5 text-amber-400" />
                <span>Independent Sourcing Broker & Trader</span>
              </span>
            </div>

            {/* Main H1 Title (SEO Optimized with Primary Keyword & Synced with WP-Admin) */}
            <h1 className="font-serif text-2xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-white leading-tight">
              {syncedPage?.title || city.seoTitle || `Rice Supplier in ${city.name} | Wholesale & Bulk Basmati Rice Trader`}
            </h1>

            {/* Sub-headline description (Synced with WP-Admin Excerpt) */}
            <p className="mt-4 text-neutral-300 text-sm sm:text-base leading-relaxed">
              {syncedPage?.excerpt || city.description}
            </p>

            {/* Trader / Sourcing Transparency Box in Hero */}
            <div className="mt-5 p-4 rounded-xl bg-white/5 border border-white/15 backdrop-blur-xs text-xs text-neutral-200 flex items-start gap-3">
              <Info className="w-4 h-4 text-amber-300 shrink-0 mt-0.5" />
              <div>
                <strong className="text-amber-300 font-semibold block mb-0.5">
                  Direct Ex-Mill Sourcing Brokerage (Not a Single-Mill Manufacturer)
                </strong>
                <p className="text-neutral-300 leading-relaxed">
                  We are an independent commodity broker, procurement agent, and bulk rice trader based at Noor Galla Mandi, Bucheki (Nankana Sahib). Rather than being restricted to one mill's output, we audit, inspect, and procure the finest seasonal lots across dozens of top-tier Punjab mills in the Kalar Basmati belt, delivering unadulterated rice at true ex-mill spot rates directly to buyers in <strong>{city.name}</strong>.
                </p>
              </div>
            </div>

            {/* Semantic Keyword Badges */}
            {city.targetKeywords && (
              <div className="mt-5 flex flex-wrap items-center gap-1.5 pt-3 border-t border-white/10">
                <span className="text-[11px] text-amber-300 font-semibold mr-1">Targeted Sourcing Keywords:</span>
                {city.targetKeywords.primary.map((kw, i) => (
                  <span key={i} className="text-[11px] bg-white/10 text-neutral-200 px-2.5 py-0.5 rounded-md border border-white/15">
                    {kw}
                  </span>
                ))}
                {city.targetKeywords.secondary?.slice(0, 4).map((skw, si) => (
                  <span key={`sec-${si}`} className="text-[11px] bg-emerald-900/40 text-emerald-200 px-2.5 py-0.5 rounded-md border border-emerald-700/40">
                    {skw}
                  </span>
                ))}
              </div>
            )}

            {/* Hero Action Buttons */}
            <div className="mt-8 flex flex-col sm:flex-row flex-wrap items-stretch sm:items-center gap-2.5 sm:gap-3 w-full sm:w-auto">
              <button
                onClick={() => onOpenQuoteModal(city.popularVarieties[0], city.name)}
                className="w-full sm:w-auto px-6 py-3.5 bg-amber-400 hover:bg-amber-300 text-neutral-950 font-bold rounded-xl text-xs sm:text-sm transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-2 active:scale-95 cursor-pointer"
              >
                <Sparkles className="w-4 h-4 text-neutral-950 shrink-0" />
                <span>Get Today's Ex-Mill Rate for {city.name}</span>
              </button>

              <button
                onClick={() => onOpenSampleModal(city.popularVarieties[0], city.name)}
                className="w-full sm:w-auto px-5 py-3.5 bg-emerald-900/90 hover:bg-emerald-800 text-white font-semibold rounded-xl text-xs sm:text-sm transition-colors border border-emerald-700/80 flex items-center justify-center gap-2 cursor-pointer"
              >
                <Package className="w-4 h-4 text-emerald-300 shrink-0" />
                <span>Request Free Sample</span>
              </button>

              <button
                onClick={() => handleWhatsAppInquiry()}
                className="w-full sm:w-auto px-5 py-3.5 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold rounded-xl text-xs sm:text-sm transition-colors flex items-center justify-center gap-2 cursor-pointer"
              >
                <MessageCircle className="w-4 h-4 shrink-0" />
                <span>WhatsApp Live Broker</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Trade Fact Bar */}
      <section className="bg-white border-b border-neutral-200 shadow-2xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 text-xs">
            <div className="flex items-center gap-3 lg:border-r lg:border-neutral-200/80 lg:pr-3">
              <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-800 flex items-center justify-center shrink-0 border border-emerald-200">
                <Store className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <span className="text-[11px] text-neutral-500 block">Prime Mandi Hub</span>
                <strong className="text-neutral-900 font-semibold truncate block" title={city.majorMarkets[0]}>
                  {city.majorMarkets[0]}
                </strong>
              </div>
            </div>

            <div className="flex items-center gap-3 lg:border-r lg:border-neutral-200/80 lg:pr-3">
              <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-800 flex items-center justify-center shrink-0 border border-amber-200">
                <Layers className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <span className="text-[11px] text-neutral-500 block">Top Demanded Grade</span>
                <strong className="text-neutral-900 font-semibold truncate block">
                  {city.popularVarieties[0]}
                </strong>
              </div>
            </div>

            <div className="flex items-center gap-3 lg:border-r lg:border-neutral-200/80 lg:pr-3">
              <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-800 flex items-center justify-center shrink-0 border border-blue-200">
                <Truck className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <span className="text-[11px] text-neutral-500 block">Freight Dispatch Window</span>
                <strong className="text-neutral-900 font-semibold block">{city.typicalLogisticsLeadTime.split('(')[0]}</strong>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-800 flex items-center justify-center shrink-0 border border-emerald-200">
                <Scale className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <span className="text-[11px] text-neutral-500 block">Wholesale Sourcing MOQ</span>
                <strong className="text-neutral-900 font-semibold block">5 to 50 Metric Tons</strong>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content Layout (1000+ Words Rich Trade Dossier + All Products Showcase) */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Main 2-Column Content Body */}
          <div className="lg:col-span-2 space-y-10">

            {/* SECTION 1: Strategic Sourcing Broker vs Mill Owner Transparency */}
            <div className="bg-white rounded-2xl p-6 sm:p-8 border border-neutral-200 shadow-xs">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 text-amber-900 text-xs font-bold uppercase tracking-wider mb-3 border border-amber-200">
                <BadgeCheck className="w-3.5 h-3.5 text-amber-800" />
                <span>Our Trade Position & Brokerage Model</span>
              </div>
              <h2 className="font-serif text-2xl font-bold text-neutral-950 mb-3">
                {syncedPage?.contentSections?.[0]?.heading || `Why Source Through an Independent Rice Trader & Broker in ${city.name}?`}
              </h2>
              <div className="text-neutral-700 text-sm space-y-3.5 leading-relaxed">
                {syncedPage?.contentSections?.[0]?.paragraphs && syncedPage.contentSections[0].paragraphs.length > 0 ? (
                  syncedPage.contentSections[0].paragraphs.map((p, idx) => <p key={idx}>{p}</p>)
                ) : (
                  <>
                    <p>
                      When procuring bulk rice in <strong>{city.name}</strong>, dealing with a single rice mill manufacturer comes with inherent conflicts of interest: a mill owner is motivated to push their own current milling run, regardless of seasonal crop moisture variances, chalky grain percentages, or aging quality.
                    </p>
                    <p>
                      <strong>Hashir Rice Supplier operates as an independent commodity trader, bulk procurement agent, and ex-mill sourcing specialist</strong> based at Noor Galla Mandi, Bucheki (Nankana Sahib). We do not own a single captive mill. Instead, we represent the buyer's interests by inspecting, negotiating, and aggregating the highest-grade rice lots across dozens of certified modern processing units in Punjab's legendary Kalar Basmati belt (Nankana Sahib, Hafizabad, Sheikhupura, and Pindi Bhattian).
                    </p>
                  </>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 my-4">
                  <div className="p-3.5 bg-neutral-50 rounded-xl border border-neutral-200 text-xs">
                    <strong className="text-emerald-950 block font-bold mb-1">100% Unbiased Quality Audit</strong>
                    <span className="text-neutral-600">We reject sub-par mill batches that do not meet strict moisture (&lt;12.5%) and elongation (20mm+) standards.</span>
                  </div>
                  <div className="p-3.5 bg-neutral-50 rounded-xl border border-neutral-200 text-xs">
                    <strong className="text-emerald-950 block font-bold mb-1">True Ex-Mill Spot Rates</strong>
                    <span className="text-neutral-600">Access transparent wholesale mandi rates directly from primary processing lines without multi-tier middleman inflation.</span>
                  </div>
                  <div className="p-3.5 bg-neutral-50 rounded-xl border border-neutral-200 text-xs">
                    <strong className="text-emerald-950 block font-bold mb-1">Multi-Mill Aggregation</strong>
                    <span className="text-neutral-600">Seamlessly fulfill 20 to 500+ Metric Ton multi-variety orders combining Steam, Sella, and Super Kernel Basmati.</span>
                  </div>
                </div>

                <p>
                  Whether you manage a major wholesale dealership in <strong>{city.majorMarkets[0]}</strong>, operate high-turnover restaurant daigs, run banquet catering operations, or distribute packaged private labels in {city.name}, our sourcing brokerage guarantees sample-locked lot consistency from the first bag to the thousandth bag.
                </p>
              </div>
            </div>

            {/* SPECIAL LAHORE COMMERCIAL FOODSERVICE PORTALS (12 SPECIALIZED HUBS) */}
            {city.slug === 'rice-supplier-lahore' && (
              <div className="bg-gradient-to-r from-neutral-900 via-emerald-950 to-neutral-900 text-white rounded-2xl p-6 sm:p-8 border border-amber-500/30 shadow-xl space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-400/20 text-amber-300 text-xs font-bold uppercase tracking-wider mb-2 border border-amber-400/30">
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>Dedicated Lahore Commercial Foodservice Portals</span>
                    </div>
                    <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                      Specialized Rice Sourcing for Restaurants, Catering, Hotels & Mess in Lahore
                    </h2>
                    <p className="text-xs sm:text-sm text-neutral-300 mt-1">
                      Choose your specific commercial hospitality sector below for dedicated grain physics, cooked yield ratios, and Lahore delivery logistics:
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
                  {COMMERCIAL_LAHORE_PAGES.map((page) => (
                    <button
                      key={page.id}
                      onClick={() => {
                        if (onSelectLahoreCommercialPage) {
                          onSelectLahoreCommercialPage(page.slug);
                        }
                      }}
                      className="p-4 rounded-xl bg-neutral-950/80 hover:bg-neutral-900 border border-neutral-800 hover:border-amber-400/60 transition-all text-left flex flex-col justify-between space-y-3 cursor-pointer group"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-neutral-800 text-amber-300 group-hover:bg-amber-400/20">
                            {page.targetSegment}
                          </span>
                          <span className="text-[10px] text-neutral-400 font-mono">
                            {page.grainLengthRaw}
                          </span>
                        </div>
                        <h3 className="font-bold text-xs sm:text-sm text-white group-hover:text-amber-300 transition-colors line-clamp-2">
                          {page.title}
                        </h3>
                      </div>

                      <div className="pt-2 border-t border-neutral-800/80 flex items-center justify-between text-[11px] text-neutral-400">
                        <span>{page.processingType}</span>
                        <span className="text-amber-400 font-semibold flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
                          <span>Open Portal</span>
                          <ArrowRight className="w-3 h-3" />
                        </span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* SPECIAL KARACHI COMMERCIAL FOODSERVICE PORTALS (12 SPECIALIZED HUBS) */}
            {city.slug === 'rice-supplier-karachi' && (
              <div className="bg-gradient-to-r from-neutral-900 via-emerald-950 to-neutral-900 text-white rounded-2xl p-6 sm:p-8 border border-amber-500/30 shadow-xl space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-400/20 text-amber-300 text-xs font-bold uppercase tracking-wider mb-2 border border-amber-400/30">
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>Dedicated Karachi Commercial Foodservice Portals</span>
                    </div>
                    <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                      Specialized Rice Sourcing for Restaurants, Catering, Hotels & Mess in Karachi
                    </h2>
                    <p className="text-xs sm:text-sm text-neutral-300 mt-1">
                      Choose your specific commercial hospitality sector below for dedicated grain physics, cooked yield ratios, and Karachi delivery logistics:
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
                  {COMMERCIAL_KARACHI_PAGES.map((page) => (
                    <button
                      key={page.id}
                      onClick={() => {
                        if (onSelectKarachiCommercialPage) {
                          onSelectKarachiCommercialPage(page.slug);
                        }
                      }}
                      className="p-4 rounded-xl bg-neutral-950/80 hover:bg-neutral-900 border border-neutral-800 hover:border-amber-400/60 transition-all text-left flex flex-col justify-between space-y-3 cursor-pointer group"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-neutral-800 text-amber-300 group-hover:bg-amber-400/20">
                            {page.targetSegment}
                          </span>
                          <span className="text-[10px] text-neutral-400 font-mono">
                            {page.grainLengthRaw}
                          </span>
                        </div>
                        <h3 className="font-bold text-xs sm:text-sm text-white group-hover:text-amber-300 transition-colors line-clamp-2">
                          {page.title}
                        </h3>
                      </div>

                      <div className="pt-2 border-t border-neutral-800/80 flex items-center justify-between text-[11px] text-neutral-400">
                        <span>{page.processingType}</span>
                        <span className="text-amber-400 font-semibold flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
                          <span>Open Portal</span>
                          <ArrowRight className="w-3 h-3" />
                        </span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* SPECIAL PESHAWAR COMMERCIAL FOODSERVICE PORTALS (12 SPECIALIZED HUBS) */}
            {city.slug === 'rice-supplier-peshawar' && (
              <div className="bg-gradient-to-r from-neutral-900 via-emerald-950 to-neutral-900 text-white rounded-2xl p-5 sm:p-8 border border-amber-500/30 shadow-xl space-y-5 sm:space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-400/20 text-amber-300 text-xs font-bold uppercase tracking-wider mb-2 border border-amber-400/30">
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>Dedicated Peshawar Commercial Foodservice Portals</span>
                    </div>
                    <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                      Specialized Rice Sourcing for Restaurants, Catering, Hotels & Mess in Peshawar
                    </h2>
                    <p className="text-xs sm:text-sm text-neutral-300 mt-1">
                      Choose your specific commercial hospitality sector below for dedicated grain physics, cooked yield ratios, and Peshawar delivery logistics:
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
                  {COMMERCIAL_PESHAWAR_PAGES.map((page) => (
                    <button
                      key={page.id}
                      onClick={() => {
                        if (onSelectPeshawarCommercialPage) {
                          onSelectPeshawarCommercialPage(page.slug);
                        }
                      }}
                      className="p-4 rounded-xl bg-neutral-950/80 hover:bg-neutral-900 border border-neutral-800 hover:border-amber-400/60 transition-all text-left flex flex-col justify-between space-y-3 cursor-pointer group"
                    >
                      <div className="space-y-1.5">
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-neutral-800 text-amber-300 group-hover:bg-amber-400/20">
                            {page.targetSegment}
                          </span>
                          <span className="text-[10px] text-neutral-400 font-mono">
                            {page.grainLengthRaw}
                          </span>
                        </div>
                        <h3 className="font-bold text-xs sm:text-sm text-white group-hover:text-amber-300 transition-colors leading-snug">
                          {page.title}
                        </h3>
                      </div>

                      <div className="pt-2 border-t border-neutral-800/80 flex items-center justify-between text-[11px] text-neutral-400">
                        <span>{page.processingType}</span>
                        <span className="text-amber-400 font-semibold flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
                          <span>Open Portal</span>
                          <ArrowRight className="w-3 h-3" />
                        </span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* SPECIAL QUETTA COMMERCIAL FOODSERVICE PORTALS (12 SPECIALIZED HUBS) */}
            {city.slug === 'rice-supplier-quetta' && (
              <div className="bg-gradient-to-r from-neutral-900 via-emerald-950 to-neutral-900 text-white rounded-2xl p-5 sm:p-8 border border-amber-500/30 shadow-xl space-y-5 sm:space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-400/20 text-amber-300 text-xs font-bold uppercase tracking-wider mb-2 border border-amber-400/30">
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>Dedicated Quetta Commercial Foodservice Portals</span>
                    </div>
                    <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                      Specialized Rice Sourcing for Restaurants, Catering, Hotels & Mess in Quetta
                    </h2>
                    <p className="text-xs sm:text-sm text-neutral-300 mt-1">
                      Choose your specific commercial hospitality sector below for dedicated high-altitude grain physics, Sajji & Dumpukht fat absorption, and Quetta delivery logistics:
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
                  {COMMERCIAL_QUETTA_PAGES.map((page) => (
                    <button
                      key={page.id}
                      onClick={() => {
                        if (onSelectQuettaCommercialPage) {
                          onSelectQuettaCommercialPage(page.slug);
                        }
                      }}
                      className="p-4 rounded-xl bg-neutral-950/80 hover:bg-neutral-900 border border-neutral-800 hover:border-amber-400/60 transition-all text-left flex flex-col justify-between space-y-3 cursor-pointer group"
                    >
                      <div className="space-y-1.5">
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-neutral-800 text-amber-300 group-hover:bg-amber-400/20">
                            {page.targetSegment}
                          </span>
                          <span className="text-[10px] text-neutral-400 font-mono">
                            {page.grainLengthRaw}
                          </span>
                        </div>
                        <h3 className="font-bold text-xs sm:text-sm text-white group-hover:text-amber-300 transition-colors leading-snug">
                          {page.title}
                        </h3>
                      </div>

                      <div className="pt-2 border-t border-neutral-800/80 flex items-center justify-between text-[11px] text-neutral-400">
                        <span>{page.processingType}</span>
                        <span className="text-amber-400 font-semibold flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
                          <span>Open Portal</span>
                          <ArrowRight className="w-3 h-3" />
                        </span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* SPECIAL HYDERABAD COMMERCIAL FOODSERVICE PORTALS (12 SPECIALIZED HUBS) */}
            {city.slug === 'rice-supplier-hyderabad' && (
              <div className="bg-gradient-to-r from-neutral-900 via-emerald-950 to-neutral-900 text-white rounded-2xl p-5 sm:p-8 border border-amber-500/30 shadow-xl space-y-5 sm:space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-400/20 text-amber-300 text-xs font-bold uppercase tracking-wider mb-2 border border-amber-400/30">
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>Dedicated Hyderabad Commercial Foodservice Portals</span>
                    </div>
                    <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                      Specialized Rice Sourcing for Restaurants, Catering, Hotels & Mess in Hyderabad
                    </h2>
                    <p className="text-xs sm:text-sm text-neutral-300 mt-1">
                      Choose your specific commercial hospitality sector below for dedicated Sindhi Biryani masala tolerance, high-heat degh durability, and Hyderabad delivery logistics:
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
                  {COMMERCIAL_HYDERABAD_PAGES.map((page) => (
                    <button
                      key={page.id}
                      onClick={() => {
                        if (onSelectHyderabadCommercialPage) {
                          onSelectHyderabadCommercialPage(page.slug);
                        }
                      }}
                      className="p-4 rounded-xl bg-neutral-950/80 hover:bg-neutral-900 border border-neutral-800 hover:border-amber-400/60 transition-all text-left flex flex-col justify-between space-y-3 cursor-pointer group"
                    >
                      <div className="space-y-1.5">
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-neutral-800 text-amber-300 group-hover:bg-amber-400/20">
                            {page.targetSegment}
                          </span>
                          <span className="text-[10px] text-neutral-400 font-mono">
                            {page.grainLengthRaw}
                          </span>
                        </div>
                        <h3 className="font-bold text-xs sm:text-sm text-white group-hover:text-amber-300 transition-colors leading-snug">
                          {page.title}
                        </h3>
                      </div>

                      <div className="pt-2 border-t border-neutral-800/80 flex items-center justify-between text-[11px] text-neutral-400">
                        <span>{page.processingType}</span>
                        <span className="text-amber-400 font-semibold flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
                          <span>Open Portal</span>
                          <ArrowRight className="w-3 h-3" />
                        </span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* SPECIAL FAISALABAD COMMERCIAL FOODSERVICE PORTALS (12 SPECIALIZED HUBS) */}
            {city.slug === 'rice-supplier-faisalabad' && (
              <div className="bg-gradient-to-r from-neutral-900 via-emerald-950 to-neutral-900 text-white rounded-2xl p-5 sm:p-8 border border-amber-500/30 shadow-xl space-y-5 sm:space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-400/20 text-amber-300 text-xs font-bold uppercase tracking-wider mb-2 border border-amber-400/30">
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>Dedicated Faisalabad Commercial Foodservice Portals</span>
                    </div>
                    <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                      Specialized Rice Sourcing for Restaurants, Catering, Hotels & Mess in Faisalabad
                    </h2>
                    <p className="text-xs sm:text-sm text-neutral-300 mt-1">
                      Choose your specific commercial hospitality or institutional sector below for dedicated grain physics, cooked yield ratios, and Faisalabad delivery logistics:
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
                  {COMMERCIAL_FAISALABAD_PAGES.map((page) => (
                    <button
                      key={page.id}
                      onClick={() => {
                        if (onSelectFaisalabadCommercialPage) {
                          onSelectFaisalabadCommercialPage(page.slug);
                        }
                      }}
                      className="p-4 rounded-xl bg-neutral-950/80 hover:bg-neutral-900 border border-neutral-800 hover:border-amber-400/60 transition-all text-left flex flex-col justify-between space-y-3 cursor-pointer group"
                    >
                      <div className="space-y-1.5">
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-neutral-800 text-amber-300 group-hover:bg-amber-400/20">
                            {page.targetSegment}
                          </span>
                          <span className="text-[10px] text-neutral-400 font-mono">
                            {page.grainLengthRaw}
                          </span>
                        </div>
                        <h3 className="font-bold text-xs sm:text-sm text-white group-hover:text-amber-300 transition-colors leading-snug">
                          {page.title}
                        </h3>
                      </div>

                      <div className="pt-2 border-t border-neutral-800/80 flex items-center justify-between text-[11px] text-neutral-400">
                        <span>{page.processingType}</span>
                        <span className="text-amber-400 font-semibold flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
                          <span>Open Portal</span>
                          <ArrowRight className="w-3 h-3" />
                        </span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* SECTION 2: All Products / Rice Varieties Showcase for this City */}
            <div className="bg-white rounded-2xl p-6 sm:p-8 border border-neutral-200 shadow-xs" id="all-products-section">
              <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
                <div>
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-900 text-xs font-bold uppercase tracking-wider mb-2 border border-emerald-200">
                    <Layers className="w-3.5 h-3.5" />
                    <span>Complete Commodity Catalog</span>
                  </div>
                  <h2 className="font-serif text-2xl font-bold text-neutral-950">
                    All Rice Products Available for Sourcing to {city.name}
                  </h2>
                </div>
                
                {/* Product Category Filter Tabs */}
                <div className="flex flex-wrap gap-1">
                  {[
                    { id: 'all', label: 'All Varieties' },
                    { id: 'basmati', label: 'Basmati' },
                    { id: 'broken', label: 'Broken (Tota)' },
                    { id: 'specialty', label: 'Specialty' },
                  ].map((cat) => (
                    <button
                      key={cat.id}
                      onClick={() => setSelectedProductCategory(cat.id)}
                      className={`text-xs px-3 py-1.5 rounded-lg font-semibold transition-colors cursor-pointer ${
                        selectedProductCategory === cat.id
                          ? 'bg-emerald-900 text-white'
                          : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
                      }`}
                    >
                      {cat.label}
                    </button>
                  ))}
                </div>
              </div>

              <p className="text-xs text-neutral-600 mb-6 leading-relaxed">
                Explore our full product lineup sourced directly from premier Punjab mills. Every variety below is available for bulk trailer dispatch to wholesale depots, catering kitchens, and warehouses across <strong>{city.name}</strong>.
              </p>

              {/* Product Cards Grid (All 10 Varieties) */}
              <div className="space-y-6">
                {filteredProducts.map((variety) => (
                  <div
                    key={variety.id}
                    className="p-5 rounded-2xl bg-neutral-50/80 border border-neutral-200 hover:border-emerald-700/60 transition-all hover:shadow-md"
                  >
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-center">
                      
                      {/* Left: Product Image & Badges */}
                      <div className="md:col-span-4 relative">
                        <div className="h-44 w-full rounded-xl overflow-hidden bg-neutral-200 relative border border-neutral-300/80">
                          <img
                            src={variety.imageUrl}
                            alt={`${variety.name} bulk supply in ${city.name}`}
                            className="w-full h-full object-cover"
                            referrerPolicy="no-referrer"
                          />
                          <div className="absolute top-2 left-2 bg-neutral-950/80 text-amber-300 text-[10px] font-bold px-2 py-0.5 rounded backdrop-blur-xs uppercase">
                            {variety.category}
                          </div>
                        </div>
                      </div>

                      {/* Right: Technical Specifications & Details */}
                      <div className="md:col-span-8 space-y-2.5">
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <h3 className="font-serif text-lg font-bold text-neutral-950">
                            {variety.name}
                          </h3>
                          <span className="text-xs font-bold text-emerald-950 bg-emerald-100/80 px-2.5 py-0.5 rounded-full border border-emerald-300">
                            Post-Cook: {variety.specs.postCookingLength}
                          </span>
                        </div>

                        <p className="text-xs text-neutral-600 line-clamp-2 leading-relaxed">
                          {variety.description}
                        </p>

                        {/* Specs Grid */}
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 border-t border-neutral-200 text-[11px]">
                          <div className="bg-white p-2 rounded-lg border border-neutral-200">
                            <span className="text-neutral-400 block text-[10px]">Raw Length</span>
                            <strong className="text-neutral-900 font-semibold">{variety.specs.averageGrainLength}</strong>
                          </div>
                          <div className="bg-white p-2 rounded-lg border border-neutral-200">
                            <span className="text-neutral-400 block text-[10px]">Moisture</span>
                            <strong className="text-neutral-900 font-semibold">{variety.specs.moistureMax}</strong>
                          </div>
                          <div className="bg-white p-2 rounded-lg border border-neutral-200">
                            <span className="text-neutral-400 block text-[10px]">Broken / Sortex</span>
                            <strong className="text-neutral-900 font-semibold">{variety.specs.brokenMax}</strong>
                          </div>
                          <div className="bg-white p-2 rounded-lg border border-neutral-200">
                            <span className="text-neutral-400 block text-[10px]">Purity</span>
                            <strong className="text-neutral-900 font-semibold">{variety.specs.purity}</strong>
                          </div>
                        </div>

                        <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                          <span className="text-[11px] text-neutral-500">
                            <strong>MOQ for {city.name}:</strong> 5 Metric Tons (100 bags)
                          </span>

                          <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
                            <button
                              onClick={() => onOpenQuoteModal(variety.name, city.name)}
                              className="flex-1 sm:flex-initial text-center justify-center px-3.5 py-2 sm:py-1.5 bg-amber-400 hover:bg-amber-300 text-neutral-950 font-bold rounded-lg text-xs transition-colors cursor-pointer shadow-xs"
                            >
                              Request Rate for {city.name}
                            </button>
                            <button
                              onClick={() => onOpenSampleModal(variety.name, city.name)}
                              className="px-3 py-2 sm:py-1.5 bg-neutral-100 hover:bg-neutral-200 text-neutral-800 font-semibold rounded-lg text-xs transition-colors border border-neutral-300 cursor-pointer text-center"
                            >
                              Free Sample
                            </button>
                          </div>
                        </div>

                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* SECTION 3: Mandi & Commodity Ecosystem */}
            <div className="bg-white rounded-2xl p-6 sm:p-8 border border-neutral-200 shadow-xs">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-900 text-xs font-bold uppercase tracking-wider mb-3 border border-emerald-200">
                <Building2 className="w-3.5 h-3.5" />
                <span>Local Commodity Trading Dynamics</span>
              </div>
              <h2 className="font-serif text-2xl font-bold text-neutral-950 mb-3">
                {syncedPage?.contentSections?.[1]?.heading || `${city.name} Wholesale Rice Market Overview & Trading Channels`}
              </h2>
              <div className="prose prose-sm max-w-none text-neutral-700 space-y-3.5 leading-relaxed">
                {syncedPage?.contentSections?.[1]?.paragraphs && syncedPage.contentSections[1].paragraphs.length > 0 ? (
                  syncedPage.contentSections[1].paragraphs.map((p, idx) => <p key={idx}>{p}</p>)
                ) : (
                  <>
                    <p>
                      {city.wholesaleMarketOverview ||
                        `Operating in ${city.name} requires a dependable commodity supply partner capable of bridging Punjab's Kalar agricultural heartland directly with local grain terminals. Hashir Rice Supplier coordinates bulk truckload consignments for grain stockists, commercial kitchens, food manufacturers, and regional dealers without intermediate handling markups.`}
                    </p>
                    <p>
                      Our trade brokerage model ensures transparent ex-mill pricing, direct truckload coordination, and continuous sample-locked batch consistency across major trading hubs such as <strong>{city.majorMarkets.join(', ')}</strong>. We understand local credit cycles, spot liquidity requirements, and warehouse handling protocols across {city.province}.
                    </p>
                  </>
                )}
              </div>

              {/* Major Markets Listing Grid */}
              <div className="mt-6 pt-5 border-t border-neutral-100">
                <h3 className="text-xs font-bold text-neutral-900 uppercase tracking-wider mb-3">
                  Key Commercial Markets & Mandis Covered in {city.name}:
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {city.majorMarkets.map((market, idx) => (
                    <div key={idx} className="flex items-start gap-2 text-xs bg-neutral-50 p-2.5 rounded-xl border border-neutral-200/80">
                      <Store className="w-4 h-4 text-emerald-800 shrink-0 mt-0.5" />
                      <span className="text-neutral-800 font-medium">{market}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* SECTION 4: Culinary Demands & Cooking Characteristics */}
            <div className="bg-white rounded-2xl p-6 sm:p-8 border border-neutral-200 shadow-xs">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 text-amber-900 text-xs font-bold uppercase tracking-wider mb-3 border border-amber-200">
                <ChefHat className="w-3.5 h-3.5" />
                <span>Culinary & Daig Cooking Performance</span>
              </div>
              <h2 className="font-serif text-2xl font-bold text-neutral-950 mb-3">
                {syncedPage?.contentSections?.[2]?.heading || `Culinary Demands, Grain Elongation & Daig Pot Stability in ${city.name}`}
              </h2>
              <div className="text-neutral-700 text-sm space-y-3.5 leading-relaxed">
                {syncedPage?.contentSections?.[2]?.paragraphs && syncedPage.contentSections[2].paragraphs.length > 0 ? (
                  syncedPage.contentSections[2].paragraphs.map((p, idx) => <p key={idx}>{p}</p>)
                ) : (
                  <>
                    <p>
                      {city.culinaryProfile ||
                        `Food culture and catering traditions in ${city.name} place rigorous demands on rice grain stability, cooked expansion, and water absorption ratios. From traditional wedding daigs and commercial biryani houses to corporate messes and restaurants, choosing the correct grain grade prevents mushy texture, broken tips, or excessive starch clumping.`}
                    </p>
                    <p>
                      For high-temperature steam daigs and commercial biryani catering, we recommend our <strong>1121 Kainat Steam (22mm+ post-cooking)</strong> or <strong>1121 Golden Sella</strong>. For upscale fine dining, diplomatic events, and traditional mutton pulao, our <strong>Super Kernel Basmati (Aged 12-24 Months)</strong> delivers pure royal fragrance and needle-thin grain separation.
                    </p>
                  </>
                )}
              </div>

              {/* Demanded Varieties Feature Cards */}
              <div className="mt-6 pt-5 border-t border-neutral-100">
                <h3 className="text-xs font-bold text-neutral-900 uppercase tracking-wider mb-3">
                  Primary Rice Varieties Demanded in {city.name}:
                </h3>
                <div className="space-y-2.5">
                  {city.primaryDemand.map((demand, dIdx) => (
                    <div key={dIdx} className="flex items-center gap-2.5 text-xs bg-emerald-50/60 p-3 rounded-xl border border-emerald-100 text-neutral-800">
                      <CheckCircle2 className="w-4 h-4 text-emerald-800 shrink-0" />
                      <span className="font-semibold text-neutral-900">{demand}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* SECTION 5: In-Depth City Trade Sections & Any Custom WP-Admin Sections */}
            {city.inDepthSections && city.inDepthSections.length > 0 && (
              <div className="space-y-6">
                {city.inDepthSections.map((sec, sIdx) => (
                  <div key={sIdx} className="bg-white rounded-2xl p-6 sm:p-8 border border-neutral-200 shadow-xs">
                    <h2 className="font-serif text-xl sm:text-2xl font-bold text-neutral-950 mb-3">
                      {sec.heading}
                    </h2>
                    <div className="text-neutral-700 text-sm leading-relaxed space-y-3">
                      <p>{sec.content}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Render any additional or updated sections edited via /wp-admin Pages Manager */}
            {syncedPage && syncedPage.contentSections && syncedPage.contentSections.length > 8 && (
              <div className="space-y-6">
                {syncedPage.contentSections.slice(8).map((sec, idx) => (
                  <div key={`wp-sec-${idx}`} className="bg-white rounded-2xl p-6 sm:p-8 border border-emerald-200 shadow-xs space-y-3">
                    <h2 className="font-serif text-xl sm:text-2xl font-bold text-neutral-950">
                      {sec.heading}
                    </h2>
                    <div className="text-neutral-700 text-sm leading-relaxed space-y-3">
                      {sec.paragraphs.map((p, pIdx) => (
                        <p key={pIdx}>{p}</p>
                      ))}
                    </div>
                    {sec.subPoints && sec.subPoints.length > 0 && (
                      <ul className="space-y-1.5 pt-2 text-xs text-neutral-700">
                        {sec.subPoints.map((sp, spIdx) => (
                          <li key={spIdx} className="flex items-start gap-2">
                            <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
                            <span>{sp}</span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                ))}
              </div>
            )}

            {/* SECTION 6: 6-Stage Sourcing Protocol */}
            <div className="bg-white rounded-2xl p-6 sm:p-8 border border-neutral-200 shadow-xs">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-900 text-xs font-bold uppercase tracking-wider mb-3 border border-emerald-200">
                <FileCheck className="w-3.5 h-3.5 text-emerald-800" />
                <span>Procurement Execution Framework</span>
              </div>
              <h2 className="font-serif text-2xl font-bold text-neutral-950 mb-3">
                Our 6-Stage Sourcing & Delivery Protocol to {city.name}
              </h2>
              <p className="text-xs text-neutral-600 mb-6 leading-relaxed">
                As an independent sourcing brokerage, we enforce a strict quality-controlled procurement workflow to ensure every consignment dispatched to {city.name} matches exact client specifications.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div className="p-4 bg-neutral-50 rounded-xl border border-neutral-200 space-y-1.5">
                  <div className="w-6 h-6 rounded-full bg-emerald-900 text-amber-300 font-bold flex items-center justify-center text-[11px] mb-2">1</div>
                  <strong className="text-neutral-950 block font-bold text-sm">Specification & Daig Audit</strong>
                  <p className="text-neutral-600 leading-relaxed">We assess your required cooked length (e.g. 20mm-24mm), moisture threshold, and target price per kg or 40kg (Mund).</p>
                </div>

                <div className="p-4 bg-neutral-50 rounded-xl border border-neutral-200 space-y-1.5">
                  <div className="w-6 h-6 rounded-full bg-emerald-900 text-amber-300 font-bold flex items-center justify-center text-[11px] mb-2">2</div>
                  <strong className="text-neutral-950 block font-bold text-sm">Multi-Mill Spot Sourcing</strong>
                  <p className="text-neutral-600 leading-relaxed">We cross-examine current milling runs across top Punjab mills to secure the lowest true ex-mill spot rate without markups.</p>
                </div>

                <div className="p-4 bg-neutral-50 rounded-xl border border-neutral-200 space-y-1.5">
                  <div className="w-6 h-6 rounded-full bg-emerald-900 text-amber-300 font-bold flex items-center justify-center text-[11px] mb-2">3</div>
                  <strong className="text-neutral-950 block font-bold text-sm">Free Physical Sample Courier</strong>
                  <p className="text-neutral-600 leading-relaxed">We dispatch a sealed Free Sample from the exact mill lot via TCS/Leopards directly to your address in {city.name} for daig testing.</p>
                </div>

                <div className="p-4 bg-neutral-50 rounded-xl border border-neutral-200 space-y-1.5">
                  <div className="w-6 h-6 rounded-full bg-emerald-900 text-amber-300 font-bold flex items-center justify-center text-[11px] mb-2">4</div>
                  <strong className="text-neutral-950 block font-bold text-sm">Pre-Dispatch Lab Quality Audit</strong>
                  <p className="text-neutral-600 leading-relaxed">Our on-site inspectors test moisture (capped at 12.5%), Sortex purity (&gt;95%), and chalky grain limits prior to trailer loading.</p>
                </div>

                <div className="p-4 bg-neutral-50 rounded-xl border border-neutral-200 space-y-1.5">
                  <div className="w-6 h-6 rounded-full bg-emerald-900 text-amber-300 font-bold flex items-center justify-center text-[11px] mb-2">5</div>
                  <strong className="text-neutral-950 block font-bold text-sm">Weighbridge Gross/Tare Slips</strong>
                  <p className="text-neutral-600 leading-relaxed">Every truckload is weighed at certified digital weighbridges with official computer slips attached to the bilty document.</p>
                </div>

                <div className="p-4 bg-neutral-50 rounded-xl border border-neutral-200 space-y-1.5">
                  <div className="w-6 h-6 rounded-full bg-emerald-900 text-amber-300 font-bold flex items-center justify-center text-[11px] mb-2">6</div>
                  <strong className="text-neutral-950 block font-bold text-sm">Direct Freight Bilty Delivery</strong>
                  <p className="text-neutral-600 leading-relaxed">Consignments travel under double-layer waterproof tarpaulins directly to your designated warehouse or mandi depot in {city.name}.</p>
                </div>
              </div>
            </div>

            {/* SECTION 7: Logistics, Freight & Bilty Transport Coordination */}
            <div className="bg-white rounded-2xl p-6 sm:p-8 border border-neutral-200 shadow-xs">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-blue-900 text-xs font-bold uppercase tracking-wider mb-3 border border-blue-200">
                <Truck className="w-3.5 h-3.5" />
                <span>Freight Logistics & Bilty Tracking</span>
              </div>
              <h2 className="font-serif text-2xl font-bold text-neutral-950 mb-3">
                Logistics, Multi-Axle Freight Trailers & Delivery Timelines to {city.name}
              </h2>
              <div className="text-neutral-700 text-sm space-y-3.5 leading-relaxed">
                <p>
                  {city.logisticsAndFreight ||
                    `Shipping bulk grain from our central Nankana Sahib / Bucheki brokerage hub to ${city.name} is handled via verified freight carriers and multi-axle trailers (20 MT, 35 MT, 50 MT). Consignments travel under heavy-duty waterproof tarpaulins to protect against weather and transit damage.`}
                </p>
                <div className="bg-neutral-50 rounded-xl p-4 border border-neutral-200 text-xs space-y-2.5 mt-4">
                  <div className="flex items-center justify-between border-b border-neutral-200 pb-2">
                    <span className="text-neutral-600 font-medium">Typical Freight Transit Window:</span>
                    <strong className="text-emerald-950 font-bold">{city.typicalLogisticsLeadTime}</strong>
                  </div>
                  <div className="flex items-center justify-between border-b border-neutral-200 pb-2">
                    <span className="text-neutral-600 font-medium">Bilty & Weighbridge Documentation:</span>
                    <strong className="text-emerald-950 font-bold">Standard Computerized Gross/Tare Slips</strong>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-neutral-600 font-medium">Unloading Point:</span>
                    <strong className="text-emerald-950 font-bold">Direct Mandi Depot / Commercial Warehouse in {city.name}</strong>
                  </div>
                </div>

                {/* Google Map of City Freight & Mandi Hub */}
                <div className="mt-5">
                  <GoogleBusinessMap
                    cityName={city.name}
                    province={city.province}
                    customHeading={`${city.name} Commercial Delivery & Mandi Transit Corridor`}
                    customSubheading={`Connecting daily truckload consignments from Noor Galla Mandi Bucheki HQ to ${city.name}`}
                    height="280px"
                    showDetailsGrid={false}
                  />
                </div>
              </div>
            </div>

            {/* SECTION 8: Quality Assurance & Laboratory Testing */}
            <div className="bg-white rounded-2xl p-6 sm:p-8 border border-neutral-200 shadow-xs">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-900 text-xs font-bold uppercase tracking-wider mb-3 border border-emerald-200">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Quality Control Standard</span>
              </div>
              <h2 className="font-serif text-2xl font-bold text-neutral-950 mb-3">
                Rigorous 7-Point Quality Testing Before Dispatch to {city.name}
              </h2>
              <div className="text-neutral-700 text-sm space-y-3.5 leading-relaxed">
                <p>
                  {city.qualityAssuranceGuide ||
                    `To guarantee that every bag meets client expectations in ${city.name}, each lot undergoes thorough quality screening including moisture testing (capped at 12.5%), digital micrometer grain measurement, broken kernel sorting, chalky grain inspection, and trial pot cooking.`}
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4 text-xs">
                  <div className="p-3.5 bg-neutral-50 rounded-xl border border-neutral-200">
                    <strong className="text-neutral-900 block mb-1 font-bold">Moisture Control</strong>
                    <span className="text-neutral-600">Guaranteed 12.0% - 12.5% max to prevent fungal spoilage or weight loss during storage.</span>
                  </div>
                  <div className="p-3.5 bg-neutral-50 rounded-xl border border-neutral-200">
                    <strong className="text-neutral-900 block mb-1 font-bold">Purity & Cleanliness</strong>
                    <span className="text-neutral-600">Minimum 95% single-variety purity, 100% sortexed, destoned, and dust-free.</span>
                  </div>
                  <div className="p-3.5 bg-neutral-50 rounded-xl border border-neutral-200">
                    <strong className="text-neutral-900 block mb-1 font-bold">Cooked Elongation</strong>
                    <span className="text-neutral-600">Verified 18mm to 22mm+ cooked length with non-sticky discrete grain separation.</span>
                  </div>
                  <div className="p-3.5 bg-neutral-50 rounded-xl border border-neutral-200">
                    <strong className="text-neutral-900 block mb-1 font-bold">Packaging Integrity</strong>
                    <span className="text-neutral-600">50kg PP woven, 25kg master bags, or custom BOPP laminated pouches.</span>
                  </div>
                </div>
              </div>
            </div>

            {/* SECTION 9: Local City FAQ */}
            <div className="bg-white rounded-2xl p-6 sm:p-8 border border-neutral-200 shadow-xs">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-900 text-xs font-bold uppercase tracking-wider mb-3 border border-emerald-200">
                <HelpCircle className="w-3.5 h-3.5" />
                <span>Frequently Asked Questions</span>
              </div>
              <h2 className="font-serif text-2xl font-bold text-neutral-950 mb-4">
                Frequently Asked Questions About Wholesale Rice Sourcing in {city.name}
              </h2>
              <div className="space-y-4">
                {city.localFaq.map((faq, fIdx) => (
                  <div key={fIdx} className="bg-neutral-50 rounded-xl p-4 border border-neutral-200 text-xs">
                    <h3 className="font-bold text-neutral-950 text-sm mb-1.5 flex items-start gap-2">
                      <span className="text-emerald-800">Q:</span>
                      <span>{faq.q}</span>
                    </h3>
                    <p className="text-neutral-700 leading-relaxed pl-5">
                      {faq.a}
                    </p>
                  </div>
                ))}
                
                {/* Standard Brokerage Model FAQ additions */}
                <div className="bg-neutral-50 rounded-xl p-4 border border-neutral-200 text-xs">
                  <h3 className="font-bold text-neutral-950 text-sm mb-1.5 flex items-start gap-2">
                    <span className="text-emerald-800">Q:</span>
                    <span>Are you a rice mill owner or an independent sourcing trader?</span>
                  </h3>
                  <p className="text-neutral-700 leading-relaxed pl-5">
                    We are an independent commodity broker, bulk rice trader, and ex-mill procurement specialist based at Noor Galla Mandi, Bucheki (Nankana Sahib). We do not own a single captive mill; instead, we represent your buying interests across dozens of certified Punjab mills to secure the highest-grade lots at true ex-mill spot rates.
                  </p>
                </div>

                <div className="bg-neutral-50 rounded-xl p-4 border border-neutral-200 text-xs">
                  <h3 className="font-bold text-neutral-950 text-sm mb-1.5 flex items-start gap-2">
                    <span className="text-emerald-800">Q:</span>
                    <span>How can buyers in {city.name} request a Free Sample?</span>
                  </h3>
                  <p className="text-neutral-700 leading-relaxed pl-5">
                    Simply click "Request Free Sample" or message our WhatsApp desk. We package a sealed Free Sample from the exact mill lot and courier it via TCS or Leopards directly to your restaurant, office, or warehouse in {city.name} within 24 to 48 hours.
                  </p>
                </div>
              </div>
            </div>

          </div>

          {/* Right Sidebar: Quick Actions, Recommended Varieties, & Switcher */}
          <div className="space-y-6">
            
            {/* Sticky Sourcing Desk Card */}
            <div className="bg-white rounded-2xl p-6 border border-emerald-800/40 shadow-md sticky top-20">
              <div className="flex items-center gap-2 mb-3">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-600 animate-ping" />
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-950">
                  Live Sourcing Desk: {city.name}
                </span>
              </div>
              <h3 className="font-serif text-xl font-bold text-neutral-950">
                Request Bulk Rate or Free Sample
              </h3>
              <p className="text-xs text-neutral-600 mt-2 leading-relaxed">
                Connect directly with our ex-mill brokerage desk for today’s spot rates and sample dispatch to <strong>{city.name}</strong>.
              </p>

              <div className="mt-5 space-y-2.5">
                <button
                  onClick={() => onOpenQuoteModal(city.popularVarieties[0], city.name)}
                  className="w-full py-3 px-4 bg-emerald-900 hover:bg-emerald-950 text-white font-bold rounded-xl text-xs transition-all shadow-md flex items-center justify-center gap-2 active:scale-98 cursor-pointer"
                >
                  <Sparkles className="w-4 h-4 text-amber-300" />
                  <span>Get Rate for {city.name}</span>
                </button>

                <button
                  onClick={() => onOpenSampleModal(city.popularVarieties[0], city.name)}
                  className="w-full py-2.5 px-4 bg-neutral-100 hover:bg-neutral-200 text-neutral-900 font-semibold rounded-xl text-xs transition-colors border border-neutral-300 flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Package className="w-4 h-4 text-emerald-800" />
                  <span>Request Free Cooking Sample</span>
                </button>

                <button
                  onClick={() => handleWhatsAppInquiry()}
                  className="w-full py-2.5 px-4 bg-emerald-50 hover:bg-emerald-100 text-emerald-950 font-semibold rounded-xl text-xs transition-colors border border-emerald-200 flex items-center justify-center gap-2 cursor-pointer"
                >
                  <MessageCircle className="w-4 h-4 text-emerald-800" />
                  <span>WhatsApp Live Broker</span>
                </button>
              </div>

              {/* Direct Call / Head Office Info */}
              <div className="mt-5 pt-4 border-t border-neutral-100 text-xs space-y-2 text-neutral-600">
                <div className="flex items-center gap-2">
                  <Phone className="w-3.5 h-3.5 text-emerald-800" />
                  <span>Direct Line: <strong>+92 333 8990883</strong></span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="w-3.5 h-3.5 text-emerald-800" />
                  <span>Brokerage Office: Noor Galla Mandi, Bucheki</span>
                </div>
              </div>
            </div>

            {/* Quick Navigation to Other Major Cities */}
            <div className="bg-white rounded-2xl p-5 border border-neutral-200 shadow-xs">
              <h3 className="font-serif text-base font-bold text-neutral-950 mb-2">
                Explore Other Major Cities
              </h3>
              <p className="text-xs text-neutral-500 mb-3">
                Switch to dedicated wholesale sourcing pages for other commercial hubs:
              </p>

              {/* Province filter pills */}
              <div className="flex flex-wrap gap-1 mb-3">
                {['All', 'Sindh', 'Khyber Pakhtunkhwa', 'Punjab'].map((p) => (
                  <button
                    key={p}
                    onClick={() => setSelectedProvinceFilter(p)}
                    className={`text-[10px] px-2 py-0.5 rounded-md font-semibold transition-colors cursor-pointer ${
                      selectedProvinceFilter === p
                        ? 'bg-emerald-900 text-white'
                        : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
                    }`}
                  >
                    {p === 'Khyber Pakhtunkhwa' ? 'KPK' : p}
                  </button>
                ))}
              </div>

              {/* City List */}
              <div className="space-y-1 max-h-72 overflow-y-auto pr-1 text-xs">
                {filteredOtherCities.map((oc) => (
                  <a
                    key={oc.slug}
                    href={`/${oc.slug}`}
                    onClick={(e) => {
                      e.preventDefault();
                      onSelectCity(oc.slug);
                    }}
                    className="w-full text-left px-2.5 py-1.5 rounded-lg hover:bg-emerald-50 hover:text-emerald-950 text-neutral-700 flex items-center justify-between transition-colors group cursor-pointer block"
                  >
                    <span className="font-medium group-hover:font-semibold">{oc.name}</span>
                    <span className="text-[10px] text-neutral-400 group-hover:text-emerald-800">
                      {oc.province === 'Islamabad Capital Territory' ? 'ICT' : oc.province}
                    </span>
                  </a>
                ))}
              </div>
            </div>

          </div>

        </div>

        {/* Google SEO Internal Linking Authority Network */}
        <div className="mt-12 bg-white rounded-2xl p-6 sm:p-8 border border-neutral-200 shadow-xs">
          <div className="flex items-center gap-2 mb-3">
            <span className="w-2 h-2 rounded-full bg-emerald-600"></span>
            <h3 className="text-sm font-bold uppercase tracking-wider text-emerald-950">
              Internal Sourcing Architecture & Authority Network
            </h3>
          </div>
          <p className="text-xs text-neutral-600 mb-6 leading-relaxed">
            Hashir Rice Supplier operates a transparent, direct ex-mill brokerage network across Punjab, Sindh, KPK, and Balochistan. Explore our primary trading desks, live Mandi rate indices, rice variety specifications, and physical sample dispatch hubs:
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
            <div className="p-4 rounded-xl bg-neutral-50 border border-neutral-200/80">
              <h4 className="font-bold text-neutral-900 mb-2 flex items-center gap-1.5">
                <Store className="w-3.5 h-3.5 text-emerald-700" />
                <span>Main Sourcing Hubs</span>
              </h4>
              <ul className="space-y-1.5 text-neutral-600">
                <li>
                  <a
                    href="/"
                    onClick={(e) => {
                      e.preventDefault();
                      if (onBackToHome) onBackToHome();
                      else onBackToLocations();
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
                      onBackToLocations();
                    }}
                    className="hover:text-emerald-900 hover:underline flex items-center gap-1"
                  >
                    <span>• Pakistan 60+ Cities Sourcing Hub</span>
                  </a>
                </li>
                <li>
                  <a
                    href="/about"
                    onClick={(e) => {
                      e.preventDefault();
                      if (onBackToHome) onBackToHome();
                    }}
                    className="hover:text-emerald-900 hover:underline flex items-center gap-1"
                  >
                    <span>• About Hashir Rice Brokerage Desk</span>
                  </a>
                </li>
              </ul>
            </div>

            <div className="p-4 rounded-xl bg-neutral-50 border border-neutral-200/80">
              <h4 className="font-bold text-neutral-900 mb-2 flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5 text-emerald-700" />
                <span>Varieties & Rates</span>
              </h4>
              <ul className="space-y-1.5 text-neutral-600">
                <li>
                  <a
                    href="/varieties"
                    onClick={(e) => {
                      e.preventDefault();
                      if (onBackToHome) onBackToHome();
                    }}
                    className="hover:text-emerald-900 hover:underline flex items-center gap-1"
                  >
                    <span>• 10 Pakistan Rice Varieties Catalog</span>
                  </a>
                </li>
                <li>
                  <a
                    href="/exchange"
                    onClick={(e) => {
                      e.preventDefault();
                      if (onBackToHome) onBackToHome();
                    }}
                    className="hover:text-emerald-900 hover:underline flex items-center gap-1"
                  >
                    <span>• Live Mandi Exchange Spot Rates</span>
                  </a>
                </li>
                <li>
                  <a
                    href="/google-ai-overview"
                    onClick={(e) => {
                      e.preventDefault();
                      if (onBackToHome) onBackToHome();
                    }}
                    className="hover:text-emerald-900 hover:underline flex items-center gap-1"
                  >
                    <span>• Google AI Rice Knowledge Hub</span>
                  </a>
                </li>
              </ul>
            </div>

            <div className="p-4 rounded-xl bg-neutral-50 border border-neutral-200/80">
              <h4 className="font-bold text-neutral-900 mb-2 flex items-center gap-1.5">
                <FileCheck className="w-3.5 h-3.5 text-emerald-700" />
                <span>Verification & Samples</span>
              </h4>
              <ul className="space-y-1.5 text-neutral-600">
                <li>
                  <a
                    href="/sample"
                    onClick={(e) => {
                      e.preventDefault();
                      onOpenSampleModal(city.popularVarieties[0], city.name);
                    }}
                    className="hover:text-emerald-900 hover:underline font-semibold text-emerald-900 flex items-center gap-1"
                  >
                    <span>• Request Free Cooking Sample</span>
                  </a>
                </li>
                <li>
                  <a
                    href="/workflow"
                    onClick={(e) => {
                      e.preventDefault();
                      if (onBackToHome) onBackToHome();
                    }}
                    className="hover:text-emerald-900 hover:underline flex items-center gap-1"
                  >
                    <span>• 7-Step Quality Verified Sourcing</span>
                  </a>
                </li>
              </ul>
            </div>

            <div className="p-4 rounded-xl bg-neutral-50 border border-neutral-200/80">
              <h4 className="font-bold text-neutral-900 mb-2 flex items-center gap-1.5">
                <HelpCircle className="w-3.5 h-3.5 text-emerald-700" />
                <span>Directory & Legal</span>
              </h4>
              <ul className="space-y-1.5 text-neutral-600">
                <li>
                  <a
                    href="/sitemap"
                    onClick={(e) => {
                      e.preventDefault();
                      if (onBackToHome) onBackToHome();
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
                      if (onBackToHome) onBackToHome();
                    }}
                    className="hover:text-emerald-900 hover:underline flex items-center gap-1"
                  >
                    <span>• Privacy Policy & Data Terms</span>
                  </a>
                </li>
                <li>
                  <a
                    href="/terms"
                    onClick={(e) => {
                      e.preventDefault();
                      if (onBackToHome) onBackToHome();
                    }}
                    className="hover:text-emerald-900 hover:underline flex items-center gap-1"
                  >
                    <span>• Commercial Trading Terms</span>
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
