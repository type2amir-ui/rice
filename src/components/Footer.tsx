import React, { useState, useEffect } from 'react';
import { MapPin, Phone, MessageCircle, Mail, ExternalLink, ShieldCheck, CheckCircle2, ArrowRight, Facebook, Instagram, Linkedin, Sparkles, Store, Plus } from 'lucide-react';
import { BrandLogo } from './BrandLogo';
import { DEFAULT_FOOTER_CONFIG, WpFooterConfig } from './admin/AdminHeaderFooterCustomizer';
import { RICE_VARIETIES } from '../data/riceData';
import { CITIES_DATA } from '../data/citiesData';
import { COMMERCIAL_LAHORE_PAGES } from '../data/commercialLahorePagesData';
import { COMMERCIAL_KARACHI_PAGES } from '../data/commercialKarachiPagesData';
import { COMMERCIAL_PESHAWAR_PAGES } from '../data/commercialPeshawarPagesData';
import { COMMERCIAL_QUETTA_PAGES } from '../data/commercialQuettaPagesData';
import { COMMERCIAL_HYDERABAD_PAGES } from '../data/commercialHyderabadPagesData';
import { COMMERCIAL_FAISALABAD_PAGES } from '../data/commercialFaisalabadPagesData';

interface FooterProps {
  setCurrentView: (view: string) => void;
  onOpenQuoteModal: (varietyName?: string, cityName?: string) => void;
  onSelectCity?: (citySlug: string) => void;
  onSelectLahorePage?: (slug: string) => void;
  onSelectKarachiPage?: (slug: string) => void;
  onSelectPeshawarPage?: (slug: string) => void;
  onSelectQuettaPage?: (slug: string) => void;
  onSelectHyderabadPage?: (slug: string) => void;
  onSelectFaisalabadPage?: (slug: string) => void;
}

export const Footer: React.FC<FooterProps> = ({
  setCurrentView,
  onOpenQuoteModal,
  onSelectCity,
  onSelectLahorePage,
  onSelectKarachiPage,
  onSelectPeshawarPage,
  onSelectQuettaPage,
  onSelectHyderabadPage,
  onSelectFaisalabadPage,
}) => {
  const [footerConfig, setFooterConfig] = useState<WpFooterConfig>(() => {
    try {
      const saved = localStorage.getItem('hashir_wp_footer_config');
      return saved ? { ...DEFAULT_FOOTER_CONFIG, ...JSON.parse(saved) } : DEFAULT_FOOTER_CONFIG;
    } catch {
      return DEFAULT_FOOTER_CONFIG;
    }
  });

  useEffect(() => {
    const handleConfigUpdate = () => {
      try {
        const saved = localStorage.getItem('hashir_wp_footer_config');
        if (saved) setFooterConfig({ ...DEFAULT_FOOTER_CONFIG, ...JSON.parse(saved) });
      } catch {}
    };
    window.addEventListener('hashir_theme_config_updated', handleConfigUpdate);
    window.addEventListener('storage', handleConfigUpdate);
    return () => {
      window.removeEventListener('hashir_theme_config_updated', handleConfigUpdate);
      window.removeEventListener('storage', handleConfigUpdate);
    };
  }, []);

  const topCities = CITIES_DATA;

  const handleCityClick = (citySlug: string, cityName: string) => {
    if (onSelectCity) {
      onSelectCity(citySlug);
    } else {
      onOpenQuoteModal(undefined, cityName);
    }
  };

  const handleNavClick = (view: string) => {
    setCurrentView(view);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-white text-neutral-800 pt-14 pb-12 border-t border-neutral-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Sourcing Callout Banner */}
        <div className="bg-emerald-50 rounded-2xl p-6 sm:p-8 mb-14 border border-emerald-200 shadow-sm flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 text-emerald-900 text-xs font-bold uppercase tracking-wider mb-2 border border-emerald-200">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-700" />
              {footerConfig.calloutBadge}
            </div>
            <h3 className="text-xl sm:text-2xl font-serif font-bold text-neutral-950 tracking-tight">
              {footerConfig.calloutTitle}
            </h3>
            <p className="text-neutral-600 text-sm mt-1 max-w-xl">
              {footerConfig.calloutSubtitle}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
            <a
              id="footer-btn-add-rice-sample"
              href="https://trade.hashirricesupplier.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto px-5 py-3 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-sm shadow-sm transition-all active:scale-95 flex items-center justify-center gap-2 cursor-pointer"
            >
              <Plus className="w-4 h-4 shrink-0" />
              <span>Add your rice sample</span>
              <ExternalLink className="w-3.5 h-3.5 opacity-80 shrink-0" />
            </a>

            <button
              onClick={onOpenQuoteModal}
              className="w-full sm:w-auto px-5 py-3 rounded-xl bg-emerald-900 hover:bg-emerald-950 text-white font-bold text-sm shadow-sm transition-all active:scale-95"
            >
              Request Bulk Rate
            </button>
            <a
              href="https://wa.me/923338990883?text=Hello%20Hashir%20Rice%20Supplier,%20I%20am%20looking%20for%20bulk%20rice%20quotation."
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto px-5 py-3 rounded-xl bg-white hover:bg-neutral-100 text-neutral-900 font-semibold text-sm flex items-center justify-center gap-2 border border-neutral-300 transition-all shadow-2xs"
            >
              <MessageCircle className="w-4 h-4 text-emerald-700" />
              <span>WhatsApp Direct</span>
            </a>
          </div>
        </div>

        {/* Multi-Column Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-neutral-200">
          {/* Column 1: Company Profile & Transparency Statement */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <BrandLogo size="lg" variant="image" className="shrink-0" />
              <div>
                <div className="flex items-center gap-1.5 leading-none">
                  <span className="font-sans text-xl font-black tracking-tight text-neutral-950">HASHIR</span>
                  <span className="font-sans text-xl font-black tracking-tight text-amber-600">RICE</span>
                  <span className="text-[10px] font-extrabold uppercase px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-900 tracking-wider">SUPPLIER</span>
                </div>
                <p className="text-xs text-emerald-900 font-semibold mt-1">Quality • Trust • Commitment | Wholesale Rice Supplier Pakistan</p>
              </div>
            </div>

            <p className="text-xs text-neutral-600 leading-relaxed">
              <strong>Hashir Rice Supplier</strong> is a leading <strong>Wholesale Rice Supplier Pakistan</strong> and <strong>Wholesale Rice Trader Pakistan</strong>. We connect grain merchants, restaurant chains, and bulk buyers with certified Punjab and Sindh rice mills for 1121 Basmati, Super Kernel, PK-386, and IRRI varieties on transparent brokerage terms.
            </p>

            {/* Our Retail Store Callout */}
            <div className="bg-amber-50/70 rounded-xl p-3 border border-amber-200/80 text-xs flex items-start gap-2.5">
              <Store className="w-4 h-4 text-amber-800 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-neutral-900 block">
                  Our Retail Store: <span className="text-amber-950 font-extrabold">Royal Basmati Rice</span>
                </span>
                <p className="text-neutral-600 text-[11px] leading-normal mt-0.5">
                  Looking for retail consumer packs or family dining quantities? Visit our dedicated retail store <strong>Royal Basmati Rice</strong> for authentic premium aged Basmati.
                </p>
              </div>
            </div>

            <div className="bg-emerald-50 rounded-xl p-3.5 border border-emerald-200 text-xs space-y-1.5">
              <div className="flex items-center gap-2 text-emerald-900 font-bold">
                <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-700" />
                <span>Transparent Sourcing Disclosure</span>
              </div>
              <p className="text-neutral-600 text-[11px] leading-normal">
                We do not claim ownership of a single mill. Operating independently as your dedicated sourcing partner guarantees unbiased quality validation and competitive multi-mill wholesale pricing.
              </p>
            </div>

            {/* Social Media Channels */}
            <div className="pt-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-800 block mb-2">
                Connect on Social Media
              </span>
              <div className="flex items-center gap-2.5">
                <a
                  id="footer-social-facebook"
                  href="https://www.facebook.com/hashirricesupplier"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Hashir Rice Supplier on Facebook"
                  title="Facebook"
                  className="w-9 h-9 rounded-lg bg-neutral-50 hover:bg-emerald-900 hover:text-white text-neutral-700 border border-neutral-200 hover:border-emerald-900 flex items-center justify-center transition-all duration-200 shadow-2xs group"
                >
                  <Facebook className="w-4 h-4 transition-transform group-hover:scale-110" />
                </a>
                <a
                  id="footer-social-instagram"
                  href="https://www.instagram.com/hashirricesuppliers/"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Hashir Rice Supplier on Instagram"
                  title="Instagram"
                  className="w-9 h-9 rounded-lg bg-neutral-50 hover:bg-emerald-900 hover:text-white text-neutral-700 border border-neutral-200 hover:border-emerald-900 flex items-center justify-center transition-all duration-200 shadow-2xs group"
                >
                  <Instagram className="w-4 h-4 transition-transform group-hover:scale-110" />
                </a>
                <a
                  id="footer-social-tiktok"
                  href="https://www.tiktok.com/@hashirricesuppliers"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Hashir Rice Supplier on TikTok"
                  title="TikTok"
                  className="w-9 h-9 rounded-lg bg-neutral-50 hover:bg-emerald-900 hover:text-white text-neutral-700 border border-neutral-200 hover:border-emerald-900 flex items-center justify-center transition-all duration-200 shadow-2xs group"
                >
                  <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 transition-transform group-hover:scale-110">
                    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64c.298-.002.595.042.88.13V9.4a6.33 6.33 0 0 0-1-.08A6.34 6.34 0 0 0 3 15.66a6.34 6.34 0 0 0 10.86 4.46V10.4a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-.04-1.83z" />
                  </svg>
                </a>
                <a
                  id="footer-social-linkedin"
                  href="https://www.linkedin.com/company/hashir-rice-supplier/"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Hashir Rice Supplier on LinkedIn"
                  title="LinkedIn"
                  className="w-9 h-9 rounded-lg bg-neutral-50 hover:bg-emerald-900 hover:text-white text-neutral-700 border border-neutral-200 hover:border-emerald-900 flex items-center justify-center transition-all duration-200 shadow-2xs group"
                >
                  <Linkedin className="w-4 h-4 transition-transform group-hover:scale-110" />
                </a>
              </div>
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-950 mb-4">Quick Navigation</h4>
            <ul className="space-y-2.5 text-xs">
              <li>
                <a
                  href="/"
                  onClick={(e) => { e.preventDefault(); handleNavClick('home'); }}
                  className="text-neutral-600 hover:text-emerald-900 transition-colors font-medium inline-block"
                >
                  Wholesale Rice Supplier Pakistan Home
                </a>
              </li>
              <li>
                <a
                  href="/about-us"
                  onClick={(e) => { e.preventDefault(); handleNavClick('about'); }}
                  className="text-neutral-600 hover:text-emerald-900 transition-colors font-medium inline-block"
                >
                  About Us (Company Profile)
                </a>
              </li>
              <li>
                <a
                  id="footer-link-add-rice-sample"
                  href="https://trade.hashirricesupplier.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-white bg-red-600 hover:bg-red-700 transition-colors font-bold flex items-center gap-1.5 px-3 py-1.5 rounded-lg shadow-2xs text-xs w-fit cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5 text-white shrink-0" />
                  <span>Add your rice sample</span>
                  <ExternalLink className="w-3 h-3 text-white/90 opacity-90 shrink-0" />
                </a>
              </li>
              <li>
                {/* Retail Store entry - ready for backlink */}
                <div className="text-amber-950 font-semibold flex items-center gap-1.5 bg-amber-50/80 px-2 py-1 rounded-md border border-amber-200/80 text-xs">
                  <Store className="w-3.5 h-3.5 text-amber-700 shrink-0" />
                  <span>Our Retail Store: <strong>Royal Basmati Rice</strong></span>
                </div>
              </li>
              <li>
                <a
                  href="/blog"
                  onClick={(e) => { e.preventDefault(); handleNavClick('blog'); }}
                  className="text-neutral-600 hover:text-emerald-900 transition-colors font-medium flex items-center gap-1.5"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-600"></span>
                  <span>Latest Published Blog Posts</span>
                </a>
              </li>
              <li>
                <a
                  href="/exchange"
                  onClick={(e) => { e.preventDefault(); handleNavClick('exchange'); }}
                  className="text-neutral-600 hover:text-emerald-900 transition-colors font-medium flex items-center gap-1.5"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
                  <span>Live Mandi Rice Rates Index</span>
                </a>
              </li>
              <li>
                <a
                  href="/exchange"
                  onClick={(e) => { e.preventDefault(); handleNavClick('exchange'); }}
                  className="text-neutral-600 hover:text-emerald-900 transition-colors font-medium inline-block"
                >
                  International Rice Exchange Index
                </a>
              </li>
              <li>
                <a
                  href="/varieties"
                  onClick={(e) => { e.preventDefault(); handleNavClick('varieties'); }}
                  className="text-neutral-600 hover:text-emerald-900 transition-colors font-medium inline-block"
                >
                  Rice Varieties Catalog
                </a>
              </li>
              <li>
                <a
                  href="/google-ai-overview"
                  onClick={(e) => { e.preventDefault(); handleNavClick('google-ai-overview'); }}
                  className="text-indigo-900 hover:text-indigo-700 transition-colors font-semibold flex items-center gap-1.5 bg-indigo-50/70 px-2 py-0.5 rounded border border-indigo-200"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-indigo-600"></span>
                  <span>Google AI Overview & Knowledge Hub</span>
                </a>
              </li>
              <li>
                <a
                  href="/reviews"
                  onClick={(e) => { e.preventDefault(); handleNavClick('reviews'); }}
                  className="text-neutral-600 hover:text-emerald-900 transition-colors font-medium inline-block"
                >
                  Google Reviews & Customer Ratings
                </a>
              </li>
              <li>
                <a
                  href="/locations"
                  onClick={(e) => { e.preventDefault(); handleNavClick('locations'); }}
                  className="text-neutral-600 hover:text-emerald-900 transition-colors font-medium inline-block"
                >
                  Pakistan Sourcing Hub (60+ Cities)
                </a>
              </li>
              <li>
                <a
                  href="/workflow"
                  onClick={(e) => { e.preventDefault(); handleNavClick('workflow'); }}
                  className="text-neutral-600 hover:text-emerald-900 transition-colors font-medium inline-block"
                >
                  7-Step Sourcing Workflow
                </a>
              </li>
              <li>
                <a
                  href="/sample-request"
                  onClick={(e) => { e.preventDefault(); handleNavClick('sample'); }}
                  className="text-neutral-600 hover:text-emerald-900 transition-colors font-medium inline-block"
                >
                  Request Physical Rice Sample
                </a>
              </li>
              <li>
                <a
                  href="/seller-portal"
                  onClick={(e) => { e.preventDefault(); handleNavClick('seller'); }}
                  className="text-neutral-600 hover:text-emerald-900 transition-colors font-medium inline-block"
                >
                  Rice Mills & Sellers B2B Portal
                </a>
              </li>
              <li>
                <a
                  href="/blog"
                  onClick={(e) => { e.preventDefault(); handleNavClick('blog'); }}
                  className="text-neutral-600 hover:text-emerald-900 transition-colors font-medium inline-block"
                >
                  Wholesale Rice Knowledge Blog
                </a>
              </li>
              <li>
                <a
                  href="/news"
                  onClick={(e) => { e.preventDefault(); handleNavClick('news'); }}
                  className="text-neutral-600 hover:text-emerald-900 transition-colors font-medium inline-block"
                >
                  International Rice Market News
                </a>
              </li>
              <li>
                <a
                  href="/sitemap"
                  onClick={(e) => { e.preventDefault(); handleNavClick('sitemap'); }}
                  className="text-neutral-600 hover:text-emerald-900 transition-colors font-medium inline-block"
                >
                  HTML Sitemap & Directory
                </a>
              </li>
              <li>
                <a
                  href="/privacy-policy"
                  onClick={(e) => { e.preventDefault(); handleNavClick('privacy'); }}
                  className="text-neutral-600 hover:text-emerald-900 transition-colors font-medium inline-block"
                >
                  Privacy Policy
                </a>
              </li>
              <li>
                <a
                  href="/terms-and-conditions"
                  onClick={(e) => { e.preventDefault(); handleNavClick('terms'); }}
                  className="text-neutral-600 hover:text-emerald-900 transition-colors font-medium inline-block"
                >
                  Terms & Conditions
                </a>
              </li>
              <li>
                <a
                  href="/contact"
                  onClick={(e) => { e.preventDefault(); handleNavClick('contact'); }}
                  className="text-neutral-600 hover:text-emerald-900 transition-colors font-medium inline-block"
                >
                  Contact Office & Google Map
                </a>
              </li>
            </ul>
          </div>

          {/* Column 3: Rice Varieties */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-950 mb-4">Rice Varieties</h4>
            <ul className="space-y-2 text-xs">
              {RICE_VARIETIES.slice(0, 7).map((item) => (
                <li key={item.id}>
                  <a
                    href="/varieties"
                    onClick={(e) => { e.preventDefault(); handleNavClick('varieties'); }}
                    className="text-neutral-600 hover:text-emerald-900 transition-colors text-left truncate block max-w-[180px] font-medium"
                  >
                    {item.name}
                  </a>
                </li>
              ))}
              <li>
                <a
                  href="/varieties"
                  onClick={(e) => { e.preventDefault(); handleNavClick('varieties'); }}
                  className="text-emerald-900 hover:underline inline-flex items-center gap-1 font-bold pt-1"
                >
                  <span>View All 10 Varieties</span>
                  <ArrowRight className="w-3 h-3" />
                </a>
              </li>
            </ul>
          </div>

          {/* Column 4: Head Office & Official Google Profile */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-950 mb-4">Head Office & Contact</h4>
            <div className="space-y-3 text-xs text-neutral-600">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-neutral-900 block font-semibold">Head Office:</strong>
                  <span>Noor Galla Mandi, Bucheki, District Nankana Sahib, Punjab, Pakistan</span>
                </div>
              </div>

              {/* Our Retail Store: Royal Basmati Rice */}
              <div className="flex items-start gap-2.5 p-2.5 rounded-xl bg-amber-50/90 border border-amber-200/90 text-xs shadow-2xs">
                <Store className="w-4 h-4 text-amber-800 shrink-0 mt-0.5" />
                <div>
                  <div className="flex items-center gap-1.5">
                    <strong className="text-neutral-950 font-bold">Our Retail Store:</strong>
                    <span className="text-[9px] font-bold uppercase tracking-wider bg-amber-200/80 text-amber-900 px-1.5 py-0.5 rounded">
                      Retail Outlet
                    </span>
                  </div>
                  <span className="text-amber-950 font-extrabold text-xs block mt-0.5">
                    Royal Basmati Rice
                  </span>
                  <span className="text-[11px] text-neutral-600 block mt-0.5 leading-tight">
                    Direct counter for authentic aged Basmati & consumer family packs
                  </span>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <MessageCircle className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-neutral-900 block font-semibold">WhatsApp / Inquiries:</strong>
                  <div className="flex flex-col gap-0.5 mt-0.5">
                    <a href="https://wa.me/923338990883" target="_blank" rel="noopener noreferrer" className="text-emerald-900 hover:underline font-bold text-xs">
                      +92 333 8990883 <span className="text-[10px] text-neutral-500 font-normal">(Desk 1)</span>
                    </a>
                    <a href="https://wa.me/923002861297" target="_blank" rel="noopener noreferrer" className="text-emerald-900 hover:underline font-bold text-xs">
                      +92 300 2861297 <span className="text-[10px] text-neutral-500 font-normal">(Desk 2)</span>
                    </a>
                  </div>
                </div>
              </div>

              <div className="pt-2">
                <a
                  href="https://share.google/Xog0BKr0oU1NiGIUL"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-950 text-xs font-bold border border-emerald-200 transition-colors w-full justify-center shadow-2xs"
                >
                  <span>Google Business Profile</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Major Cities Hub Banner (Replaced raw 100+ city links to comply with SEO audit & user request) */}
        <div className="py-6 border-b border-neutral-200">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 rounded-xl bg-stone-100/80 border border-stone-200">
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-900 mb-1">
                Pakistan Major Cities Wholesale Supply Corridors
              </h4>
              <p className="text-xs text-neutral-600">
                Direct mandi freight &amp; bilty delivery dispatches to major business hubs across Punjab, Sindh, KPK &amp; Balochistan.
              </p>
            </div>
            <a
              href="/locations"
              onClick={(e) => { e.preventDefault(); handleNavClick('locations'); }}
              className="px-4 py-2 rounded-lg bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-xs inline-flex items-center gap-1.5 transition-colors shrink-0 shadow-xs"
            >
              <span>Explore Major Cities Hub</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>

        {/* Embedded Interactive Map & Copyright */}
        <div className="pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-neutral-500">
          <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-4 text-center sm:text-left">
            <span>{footerConfig.copyrightText}</span>
            <span className="hidden sm:inline">•</span>
            <span>Registered B2B Rice Trading Brokerage in Pakistan</span>
            <span className="hidden sm:inline">•</span>
            <span>Our Retail Store: <strong className="text-neutral-800 font-semibold">{footerConfig.retailStoreName}</strong></span>
          </div>

          <div className="flex flex-wrap items-center justify-center md:justify-end gap-3 sm:gap-4">
            <a
              href="/"
              onClick={(e) => { e.preventDefault(); handleNavClick('home'); }}
              className="hover:text-emerald-900 transition-colors font-medium cursor-pointer"
            >
              Home
            </a>
            <span>•</span>
            <a
              id="footer-bottom-link-add-rice-sample"
              href="https://trade.hashirricesupplier.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-red-600 hover:text-red-700 font-bold transition-colors inline-flex items-center gap-1"
            >
              <span>Add your rice sample</span>
              <ExternalLink className="w-2.5 h-2.5 opacity-85" />
            </a>
            <span>•</span>
            <a
              href="/about-us"
              onClick={(e) => { e.preventDefault(); handleNavClick('about'); }}
              className="hover:text-emerald-900 transition-colors font-medium cursor-pointer"
            >
              About Us
            </a>
            <span>•</span>
            <a
              href="/#blog"
              onClick={(e) => { e.preventDefault(); handleNavClick('blog'); }}
              className="hover:text-emerald-900 transition-colors font-medium text-emerald-800 font-semibold cursor-pointer"
            >
              Rice Trading Guides
            </a>
            <span>•</span>
            <a
              href="/sample-request"
              onClick={(e) => { e.preventDefault(); handleNavClick('sample'); }}
              className="hover:text-emerald-900 transition-colors font-medium text-emerald-800 font-semibold cursor-pointer"
            >
              Request Free Sample
            </a>
            <span>•</span>
            <a
              href="/sitemap"
              onClick={(e) => { e.preventDefault(); handleNavClick('sitemap'); }}
              className="hover:text-emerald-900 transition-colors font-medium text-emerald-800 font-semibold cursor-pointer"
            >
              Sitemap & Directory
            </a>
            <span>•</span>
            <a
              href="/privacy-policy"
              onClick={(e) => { e.preventDefault(); handleNavClick('privacy'); }}
              className="hover:text-emerald-900 transition-colors font-medium cursor-pointer"
            >
              Privacy Policy
            </a>
            <span>•</span>
            <a
              href="/terms-and-conditions"
              onClick={(e) => { e.preventDefault(); handleNavClick('terms'); }}
              className="hover:text-emerald-900 transition-colors font-medium cursor-pointer"
            >
              Terms & Conditions
            </a>
            <span>•</span>
            <a
              href="/faqs"
              onClick={(e) => { e.preventDefault(); handleNavClick('faqs'); }}
              className="hover:text-emerald-900 transition-colors font-medium cursor-pointer"
            >
              FAQs
            </a>
            <span>•</span>
            <a
              href="https://share.google/Xog0BKr0oU1NiGIUL"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-emerald-900 transition-colors inline-flex items-center gap-1 font-medium"
            >
              <span>Google Profile</span>
              <ExternalLink className="w-2.5 h-2.5" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};
