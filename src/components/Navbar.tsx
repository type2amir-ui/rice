import React, { useState, useEffect } from 'react';
import { Phone, MessageCircle, Menu, X, MapPin, ChevronDown, Sparkles, Building2, Facebook, Instagram, Linkedin, Plus, ExternalLink } from 'lucide-react';
import { BrandLogo } from './BrandLogo';
import { DEFAULT_HEADER_CONFIG, WpHeaderConfig } from './admin/AdminHeaderFooterCustomizer';

interface NavbarProps {
  currentView: string;
  setCurrentView: (view: string) => void;
  onOpenQuoteModal: (varietyName?: string) => void;
  onOpenSampleModal: (varietyName?: string) => void;
  onScrollToLocations?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentView,
  setCurrentView,
  onOpenQuoteModal,
  onOpenSampleModal,
  onScrollToLocations,
}) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [varietiesDropdownOpen, setVarietiesDropdownOpen] = useState(false);
  const [headerConfig, setHeaderConfig] = useState<WpHeaderConfig>(() => {
    try {
      const saved = localStorage.getItem('hashir_wp_header_config');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (!parsed.sampleBtnUrl || parsed.sampleBtnUrl.includes('hashir-rice-directory')) {
          parsed.sampleBtnUrl = 'https://trade.hashirricesupplier.com/';
        }
        return { ...DEFAULT_HEADER_CONFIG, ...parsed };
      }
      return DEFAULT_HEADER_CONFIG;
    } catch {
      return DEFAULT_HEADER_CONFIG;
    }
  });

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    const handleConfigUpdate = () => {
      try {
        const saved = localStorage.getItem('hashir_wp_header_config');
        if (saved) setHeaderConfig({ ...DEFAULT_HEADER_CONFIG, ...JSON.parse(saved) });
      } catch {}
    };
    window.addEventListener('scroll', handleScroll);
    window.addEventListener('hashir_theme_config_updated', handleConfigUpdate);
    window.addEventListener('storage', handleConfigUpdate);
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('hashir_theme_config_updated', handleConfigUpdate);
      window.removeEventListener('storage', handleConfigUpdate);
    };
  }, []);

  const desktopNavLinks: Array<{ label: string; view: string; isHighlight?: boolean }> =
    headerConfig.navItems && headerConfig.navItems.length > 0
      ? headerConfig.navItems
      : [
          { label: 'About Us', view: 'about' },
          { label: 'Rice Catalog', view: 'varieties' },
          { label: 'Major Cities', view: 'locations' },
          { label: 'Market Index', view: 'exchange' },
          { label: 'Contact', view: 'contact' },
        ];

  const mobileNavLinks = [
    { label: 'Home', view: 'home' },
    { label: 'About Us', view: 'about' },
    { label: 'Rice Catalog', view: 'varieties' },
    { label: 'Major Cities', view: 'locations' },
    { label: 'Market Index', view: 'exchange' },
    { label: 'Client Reviews', view: 'reviews' },
    { label: 'Latest Published Blog Posts', view: 'blog' },
    { label: 'How It Works', view: 'workflow' },
    { label: 'Contact Us', view: 'contact' },
  ];

  const getCanonicalHref = (view: string) => {
    if (view === 'home') return '/';
    if (view === 'about') return '/about-us';
    if (view === 'sample') return '/sample-request';
    if (view === 'privacy') return '/privacy-policy';
    if (view === 'terms') return '/terms-and-conditions';
    if (view === 'seller') return '/seller-portal';
    return `/${view}`;
  };

  const handleNavClick = (view: string) => {
    if (view === 'locations' && onScrollToLocations) {
      onScrollToLocations();
      setMobileMenuOpen(false);
      return;
    }
    setCurrentView(view);
    setMobileMenuOpen(false);
    setVarietiesDropdownOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <header className="sticky top-0 z-50 w-full transition-all duration-300">
      {/* Top Notification / Trust Bar */}
      <div className="bg-neutral-50 text-neutral-700 text-xs py-1.5 sm:py-2 px-3 sm:px-4 border-b border-neutral-200">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-1.5 sm:gap-2">
          <div className="flex items-center justify-center md:justify-start gap-2 text-xs tracking-wide text-center">
            <span className="inline-flex items-center gap-1.5 font-semibold text-emerald-900">
              <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse"></span>
              {headerConfig.topBarAnnouncement}
            </span>
            <span className="hidden lg:inline text-neutral-300">•</span>
            <span className="hidden lg:inline text-neutral-600">
              {headerConfig.topBarOfficeLocation}
            </span>
          </div>

          <div className="flex flex-wrap items-center justify-center md:justify-end gap-1.5 sm:gap-2 text-xs font-medium">
            {/* Social Media Quick Links */}
            <div className="hidden sm:flex items-center gap-1.5 pr-2 border-r border-neutral-300">
              <a
                id="nav-social-facebook"
                href="https://www.facebook.com/hashirricesupplier"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook"
                title="Facebook"
                className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-white hover:bg-emerald-900 hover:text-white text-neutral-600 border border-neutral-200 hover:border-emerald-900 flex items-center justify-center transition-colors"
              >
                <Facebook className="w-3 h-3" />
              </a>
              <a
                id="nav-social-instagram"
                href="https://www.instagram.com/hashirricesuppliers/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                title="Instagram"
                className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-white hover:bg-emerald-900 hover:text-white text-neutral-600 border border-neutral-200 hover:border-emerald-900 flex items-center justify-center transition-colors"
              >
                <Instagram className="w-3 h-3" />
              </a>
              <a
                id="nav-social-tiktok"
                href="https://www.tiktok.com/@hashirricesuppliers"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="TikTok"
                title="TikTok"
                className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-white hover:bg-emerald-900 hover:text-white text-neutral-600 border border-neutral-200 hover:border-emerald-900 flex items-center justify-center transition-colors"
              >
                <svg viewBox="0 0 24 24" fill="currentColor" className="w-3 h-3">
                  <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64c.298-.002.595.042.88.13V9.4a6.33 6.33 0 0 0-1-.08A6.34 6.34 0 0 0 3 15.66a6.34 6.34 0 0 0 10.86 4.46V10.4a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-.04-1.83z" />
                </svg>
              </a>
              <a
                id="nav-social-linkedin"
                href="https://www.linkedin.com/company/hashir-rice-supplier/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn"
                title="LinkedIn"
                className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-white hover:bg-emerald-900 hover:text-white text-neutral-600 border border-neutral-200 hover:border-emerald-900 flex items-center justify-center transition-colors"
              >
                <Linkedin className="w-3 h-3" />
              </a>
            </div>

            <a
              href="https://share.google/Xog0BKr0oU1NiGIUL"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-emerald-800 hover:text-emerald-950 transition-colors font-medium whitespace-nowrap px-1.5 py-0.5 rounded hover:bg-emerald-50"
            >
              <MapPin className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
              <span className="hidden sm:inline">Google Business Profile</span>
              <span className="sm:hidden">Google Profile</span>
            </a>
            <span className="text-neutral-300 hidden sm:inline">|</span>
            <div className="flex items-center gap-1 sm:gap-1.5 flex-wrap justify-center">
              <a
                href="https://wa.me/923338990883?text=Hello%20Hashir%20Rice%20Supplier,%20I%20am%20interested%20in%20bulk%20rice%20sourcing."
                target="_blank"
                rel="noopener noreferrer"
                title="WhatsApp Desk 1"
                className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-100/70 hover:bg-emerald-200/80 text-emerald-950 font-bold transition-colors whitespace-nowrap border border-emerald-300/60 text-[11px] sm:text-xs"
              >
                <svg viewBox="0 0 24 24" fill="currentColor" className="w-3.5 h-3.5 text-emerald-700 shrink-0">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.888 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                </svg>
                <span>+92 333 8990883</span>
              </a>
              <a
                href="https://wa.me/923002861297?text=Hello%20Hashir%20Rice%20Supplier,%20I%20am%20interested%20in%20bulk%20rice%20sourcing."
                target="_blank"
                rel="noopener noreferrer"
                title="WhatsApp Desk 2"
                className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-100/70 hover:bg-emerald-200/80 text-emerald-950 font-bold transition-colors whitespace-nowrap border border-emerald-300/60 text-[11px] sm:text-xs"
              >
                <svg viewBox="0 0 24 24" fill="currentColor" className="w-3.5 h-3.5 text-emerald-700 shrink-0">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.888 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                </svg>
                <span>+92 300 2861297</span>
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <nav
        className={`w-full bg-white/95 backdrop-blur-md transition-all duration-200 border-b ${
          isScrolled ? 'shadow-md border-emerald-950/10 py-3' : 'border-neutral-200/80 py-4'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-3">
          {/* Logo / Brand Name */}
          <a
            href="/"
            onClick={(e) => {
              e.preventDefault();
              handleNavClick('home');
            }}
            className="flex items-center gap-2.5 text-left group focus:outline-none shrink-0"
          >
            <BrandLogo size="md" variant="image" className="shrink-0" />
            <div className="shrink-0">
              <div className="flex items-center gap-1.5 leading-none">
                <span className="font-sans text-base sm:text-lg font-black tracking-tight text-neutral-950 group-hover:text-emerald-900 transition-colors whitespace-nowrap">
                  {headerConfig.brandFirstWord}
                </span>
                <span className="font-sans text-base sm:text-lg font-black tracking-tight text-amber-600 group-hover:text-amber-700 transition-colors whitespace-nowrap">
                  {headerConfig.brandSecondWord}
                </span>
                <span className="hidden sm:inline-block text-[9px] font-extrabold uppercase px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-900 tracking-wider">
                  {headerConfig.brandBadge}
                </span>
              </div>
              <p className="text-[9.5px] font-bold tracking-wider uppercase text-emerald-800 mt-1 whitespace-nowrap">
                {headerConfig.brandSubtitle}
              </p>
            </div>
          </a>

          {/* Desktop Nav Links */}
          <div className="hidden lg:flex items-center gap-1 xl:gap-2">
            {desktopNavLinks.map((link) => {
              const isActive = currentView === link.view;
              const href = getCanonicalHref(link.view);
              return (
                <a
                  key={link.view}
                  href={href}
                  onClick={(e) => {
                    e.preventDefault();
                    handleNavClick(link.view);
                  }}
                  className={`px-2.5 xl:px-3 py-1.5 text-xs xl:text-sm font-medium rounded-md transition-all whitespace-nowrap inline-flex items-center gap-1.5 cursor-pointer ${
                    isActive
                      ? 'text-emerald-950 bg-emerald-100/80 font-bold border border-emerald-300'
                      : link.isHighlight
                      ? 'text-emerald-900 font-bold bg-emerald-50 hover:bg-emerald-100 border border-emerald-200'
                      : 'text-neutral-700 hover:text-emerald-950 hover:bg-neutral-100'
                  }`}
                >
                  {link.isHighlight && <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse" />}
                  <span>{link.label}</span>
                </a>
              );
            })}
          </div>

          {/* Action CTAs */}
          <div className="hidden lg:flex items-center gap-2 shrink-0">
            <a
              id="header-btn-add-rice-sample"
              href={headerConfig.sampleBtnUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-2 text-xs xl:text-sm font-bold rounded-lg bg-red-600 hover:bg-red-700 text-white shadow-xs hover:shadow transition-all active:scale-[0.98] whitespace-nowrap cursor-pointer shrink-0"
            >
              <Plus className="w-3.5 h-3.5 shrink-0" />
              <span>{headerConfig.sampleBtnText}</span>
              <ExternalLink className="w-3 h-3 opacity-80 shrink-0" />
            </a>

            <button
              onClick={() => onOpenQuoteModal()}
              className="inline-flex items-center gap-1.5 px-3 py-2 text-xs xl:text-sm font-bold rounded-lg bg-emerald-900 hover:bg-emerald-950 text-white shadow-xs hover:shadow transition-all active:scale-[0.98] whitespace-nowrap cursor-pointer shrink-0"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-300 shrink-0" />
              <span>{headerConfig.primaryCtaText}</span>
            </button>

            <a
              href="https://wa.me/923338990883?text=Hello%20Hashir%20Rice%20Supplier,%20I%20want%20to%20inquire%20about%20wholesale%20rice%20rates%20and%20samples."
              target="_blank"
              rel="noopener noreferrer"
              title="Chat on WhatsApp"
              className="inline-flex items-center gap-1.5 px-3 py-2 text-xs xl:text-sm font-semibold rounded-lg bg-emerald-50 text-emerald-950 hover:bg-emerald-100 border border-emerald-300/80 transition-colors whitespace-nowrap cursor-pointer shrink-0"
            >
              <svg viewBox="0 0 24 24" fill="currentColor" className="w-3.5 h-3.5 text-emerald-700 shrink-0">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.888 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
              </svg>
              <span>WhatsApp</span>
            </a>
          </div>

          {/* Mobile Menu Trigger & Red Button */}
          <div className="lg:hidden flex items-center gap-2">
            <a
              id="mobile-header-btn-add-rice-sample"
              href="https://trade.hashirricesupplier.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="px-2.5 py-1.5 text-xs font-bold rounded-lg bg-red-600 hover:bg-red-700 text-white shadow-xs flex items-center gap-1 shrink-0 transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Add your rice sample</span>
              <span className="sm:hidden">Add Sample</span>
            </a>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2.5 min-w-[44px] min-h-[44px] rounded-lg text-neutral-700 hover:text-neutral-950 hover:bg-neutral-100 flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-emerald-800"
              aria-label="Toggle menu"
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="lg:hidden bg-white border-b border-neutral-200 px-4 pt-3 pb-8 space-y-3 animate-fadeIn shadow-xl max-h-[calc(100vh-65px)] overflow-y-auto overscroll-contain">
            <div className="flex items-center gap-3 pb-3 border-b border-neutral-100">
              <BrandLogo size="md" variant="image" className="shrink-0" />
              <div>
                <div className="flex items-center gap-1.5 leading-none">
                  <span className="font-sans text-base font-black tracking-tight text-neutral-950">HASHIR</span>
                  <span className="font-sans text-base font-black tracking-tight text-amber-600">RICE</span>
                  <span className="text-[9px] font-extrabold uppercase px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-900 tracking-wider">SUPPLIER</span>
                </div>
                <span className="text-[9.5px] font-bold text-emerald-800 uppercase tracking-wider block mt-1">Quality • Trust • Commitment</span>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-1 border-b border-neutral-100 pb-3">
              {mobileNavLinks.map((link) => {
                const isActive = currentView === link.view;
                const href = getCanonicalHref(link.view);
                return (
                  <a
                    key={link.view}
                    href={href}
                    onClick={(e) => {
                      e.preventDefault();
                      handleNavClick(link.view);
                    }}
                    className={`text-left px-3 py-2.5 min-h-[44px] rounded-lg text-sm font-medium transition-colors flex items-center justify-between ${
                      isActive
                        ? 'bg-emerald-50 text-emerald-950 font-bold border-l-4 border-emerald-800'
                        : 'text-neutral-700 hover:bg-neutral-50 active:bg-emerald-50/50'
                    }`}
                  >
                    <span>{link.label}</span>
                    {isActive && <span className="w-2 h-2 rounded-full bg-emerald-700"></span>}
                  </a>
                );
              })}
            </div>

            <div className="pt-2 flex flex-col gap-2.5">
              <a
                id="mobile-drawer-btn-add-rice-sample"
                href="https://trade.hashirricesupplier.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3 min-h-[44px] text-center text-sm font-bold rounded-lg bg-red-600 hover:bg-red-700 active:bg-red-800 text-white shadow flex items-center justify-center gap-2 transition-colors cursor-pointer"
              >
                <Plus className="w-4 h-4 shrink-0" />
                <span>Add your rice sample</span>
                <ExternalLink className="w-3.5 h-3.5 opacity-80 shrink-0" />
              </a>

              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenQuoteModal();
                }}
                className="w-full py-3 min-h-[44px] text-center text-sm font-bold rounded-lg bg-emerald-900 active:bg-emerald-950 text-white shadow flex items-center justify-center gap-2"
              >
                <Sparkles className="w-4 h-4 text-amber-300" />
                <span>Request Bulk Rice Quote</span>
              </button>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <a
                  href="https://wa.me/923338990883?text=Hello%20Hashir%20Rice%20Supplier,%20I%20want%20to%20inquire%20about%20wholesale%20rice%20rates%20and%20samples."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="py-2.5 px-3 min-h-[44px] text-xs font-semibold rounded-lg bg-emerald-100/90 hover:bg-emerald-200 text-emerald-950 flex items-center justify-center gap-1.5 border border-emerald-300 transition-colors"
                >
                  <MessageCircle className="w-4 h-4 text-emerald-700 shrink-0" />
                  <span>WhatsApp 1 (+92 333 8990883)</span>
                </a>
                <a
                  href="https://wa.me/923002861297?text=Hello%20Hashir%20Rice%20Supplier,%20I%20want%20to%20inquire%20about%20wholesale%20rice%20rates%20and%20samples."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="py-2.5 px-3 min-h-[44px] text-xs font-semibold rounded-lg bg-emerald-100/90 hover:bg-emerald-200 text-emerald-950 flex items-center justify-center gap-1.5 border border-emerald-300 transition-colors"
                >
                  <MessageCircle className="w-4 h-4 text-emerald-700 shrink-0" />
                  <span>WhatsApp 2 (+92 300 2861297)</span>
                </a>
              </div>

              {/* Mobile Drawer Legal & Policies */}
              <div className="pt-2 border-t border-neutral-100 flex flex-wrap items-center justify-center gap-2.5 text-xs text-neutral-500">
                <a
                  href="/sample-request"
                  onClick={(e) => { e.preventDefault(); handleNavClick('sample'); }}
                  className="hover:text-emerald-900 font-semibold text-emerald-800 transition-colors"
                >
                  Request Free Sample
                </a>
                <span>•</span>
                <a
                  href="/sitemap"
                  onClick={(e) => { e.preventDefault(); handleNavClick('sitemap'); }}
                  className="hover:text-emerald-900 font-semibold text-emerald-800 transition-colors"
                >
                  Sitemap
                </a>
                <span>•</span>
                <a
                  href="/privacy-policy"
                  onClick={(e) => { e.preventDefault(); handleNavClick('privacy'); }}
                  className="hover:text-emerald-900 transition-colors underline"
                >
                  Privacy
                </a>
                <span>•</span>
                <a
                  href="/terms-and-conditions"
                  onClick={(e) => { e.preventDefault(); handleNavClick('terms'); }}
                  className="hover:text-emerald-900 transition-colors underline"
                >
                  Terms
                </a>
                <span>•</span>
                <a
                  href="/faqs"
                  onClick={(e) => { e.preventDefault(); handleNavClick('faqs'); }}
                  className="hover:text-emerald-900 transition-colors underline"
                >
                  FAQs
                </a>
              </div>

              {/* Mobile Drawer Social Links */}
              <div className="pt-1 flex items-center justify-center gap-3">
                <span className="text-xs text-neutral-500 font-medium">Follow us:</span>
                <div className="flex items-center gap-2">
                  <a
                    id="mobile-nav-social-facebook"
                    href="https://www.facebook.com/hashirricesupplier"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Facebook"
                    title="Facebook"
                    className="w-8 h-8 rounded-full bg-neutral-100 text-neutral-700 hover:bg-emerald-900 hover:text-white flex items-center justify-center transition-colors"
                  >
                    <Facebook className="w-3.5 h-3.5" />
                  </a>
                  <a
                    id="mobile-nav-social-instagram"
                    href="https://www.instagram.com/hashirricesuppliers/"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Instagram"
                    title="Instagram"
                    className="w-8 h-8 rounded-full bg-neutral-100 text-neutral-700 hover:bg-emerald-900 hover:text-white flex items-center justify-center transition-colors"
                  >
                    <Instagram className="w-3.5 h-3.5" />
                  </a>
                  <a
                    id="mobile-nav-social-tiktok"
                    href="https://www.tiktok.com/@hashirricesuppliers"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="TikTok"
                    title="TikTok"
                    className="w-8 h-8 rounded-full bg-neutral-100 text-neutral-700 hover:bg-emerald-900 hover:text-white flex items-center justify-center transition-colors"
                  >
                    <svg viewBox="0 0 24 24" fill="currentColor" className="w-3.5 h-3.5">
                      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64c.298-.002.595.042.88.13V9.4a6.33 6.33 0 0 0-1-.08A6.34 6.34 0 0 0 3 15.66a6.34 6.34 0 0 0 10.86 4.46V10.4a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-.04-1.83z" />
                    </svg>
                  </a>
                  <a
                    id="mobile-nav-social-linkedin"
                    href="https://www.linkedin.com/company/hashir-rice-supplier/"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="LinkedIn"
                    title="LinkedIn"
                    className="w-8 h-8 rounded-full bg-neutral-100 text-neutral-700 hover:bg-emerald-900 hover:text-white flex items-center justify-center transition-colors"
                  >
                    <Linkedin className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
};
