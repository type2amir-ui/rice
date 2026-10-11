import React, { useState } from 'react';
import {
  Palette,
  Layout,
  Save,
  RefreshCw,
  CheckCircle2,
  Globe,
  Phone,
  MapPin,
  Sparkles,
  ExternalLink,
  Sliders,
  Plus,
  Trash2,
  Type,
  Layers,
  Code,
  Copy,
  Check
} from 'lucide-react';

export interface WpHeaderConfig {
  topBarAnnouncement: string;
  topBarOfficeLocation: string;
  brandFirstWord: string;
  brandSecondWord: string;
  brandBadge: string;
  brandSubtitle: string;
  whatsappDesk1: string;
  whatsappDesk2: string;
  googleProfileUrl: string;
  facebookUrl: string;
  instagramUrl: string;
  tiktokUrl: string;
  linkedinUrl: string;
  primaryCtaText: string;
  sampleBtnText: string;
  sampleBtnUrl: string;
  navItems: Array<{ label: string; view: string }>;
}

export interface WpFooterConfig {
  calloutBadge: string;
  calloutTitle: string;
  calloutSubtitle: string;
  companyDescription: string;
  retailStoreName: string;
  retailStoreDescription: string;
  officeAddress: string;
  copyrightText: string;
}

export const DEFAULT_HEADER_CONFIG: WpHeaderConfig = {
  topBarAnnouncement: 'Pakistan-Wide B2B Rice Sourcing Network',
  topBarOfficeLocation: 'Head Office: Noor Galla Mandi, Bucheki, Nankana Sahib',
  brandFirstWord: 'HASHIR',
  brandSecondWord: 'RICE',
  brandBadge: 'SUPPLIER',
  brandSubtitle: "Pakistan's B2B Rice Exchange",
  whatsappDesk1: '+92 333 8990883',
  whatsappDesk2: '+92 300 2861297',
  googleProfileUrl: 'https://share.google/Xog0BKr0oU1NiGIUL',
  facebookUrl: 'https://www.facebook.com/hashirricesupplier',
  instagramUrl: 'https://www.instagram.com/hashirricesuppliers/',
  tiktokUrl: 'https://www.tiktok.com/@hashirricesuppliers',
  linkedinUrl: 'https://www.linkedin.com/company/hashir-rice-supplier/',
  primaryCtaText: 'Get Wholesale Quote',
  sampleBtnText: 'Add your rice sample',
  sampleBtnUrl: 'https://trade.hashirricesupplier.com/',
  navItems: [
    { label: 'About Us', view: 'about' },
    { label: 'Rice Catalog', view: 'varieties' },
    { label: 'Major Cities', view: 'locations' },
    { label: 'Market Index', view: 'exchange' },
    { label: 'Contact', view: 'contact' },
  ],
};

export const DEFAULT_FOOTER_CONFIG: WpFooterConfig = {
  calloutBadge: 'Verified Sourcing Intermediary',
  calloutTitle: 'Ready to Source High-Grade Pakistani Rice in Bulk?',
  calloutSubtitle: 'Get direct mill-matched samples, transparent broker rates, and reliable truck delivery across 60+ cities in Pakistan.',
  companyDescription: 'Hashir Rice Supplier is a leading Wholesale Rice Supplier Pakistan and Wholesale Rice Trader Pakistan. We connect grain merchants, restaurant chains, and bulk buyers with certified Punjab and Sindh rice mills for 1121 Basmati, Super Kernel, PK-386, and IRRI varieties on transparent brokerage terms.',
  retailStoreName: 'Royal Basmati Rice',
  retailStoreDescription: 'Looking for retail consumer packs or family dining quantities? Visit our dedicated retail store Royal Basmati Rice for authentic premium aged Basmati.',
  officeAddress: 'Noor Galla Mandi, Bucheki, District Nankana Sahib, Punjab, Pakistan',
  copyrightText: `© ${new Date().getFullYear()} Hashir Rice Supplier (hashirricesupplier.com). All Rights Reserved.`,
};

const FREE_WORDPRESS_THEMES = [
  {
    id: 'astra-free-b2b',
    name: 'Astra Free (Mandi B2B Wholesale Child Theme)',
    version: '4.8.3',
    author: 'Brainstorm Force (100% Free & Unlimited)',
    description: 'Ultra-fast, lightweight free WordPress theme customized with Emerald & Harvest Amber palette and Playfair Display + Inter typography.',
    wpOrgUrl: 'https://wordpress.org/themes/astra/',
    isActive: true,
  },
  {
    id: 'generatepress-free',
    name: 'GeneratePress Free Edition',
    version: '3.5.1',
    author: 'Tom Usborne (Free)',
    description: 'Accessibility-ready, schema-integrated free WordPress theme with zero bloat and 100% PageSpeed score.',
    wpOrgUrl: 'https://wordpress.org/themes/generatepress/',
    isActive: false,
  },
  {
    id: 'kadence-free',
    name: 'Kadence WP Free Theme',
    version: '1.2.9',
    author: 'Kadence WP (Free)',
    description: 'Modern drag-and-drop header and footer builder with full Gutenberg block compatibility.',
    wpOrgUrl: 'https://wordpress.org/themes/kadence/',
    isActive: false,
  },
  {
    id: 'twentytwentyfour',
    name: 'Twenty Twenty-Four (Default WordPress Core)',
    version: '1.2',
    author: 'the WordPress team (Free)',
    description: 'Official default WordPress block theme designed for business portals and content directories.',
    wpOrgUrl: 'https://wordpress.org/themes/twentytwentyfour/',
    isActive: false,
  },
];

interface AdminHeaderFooterCustomizerProps {
  onSuccessToast?: (msg: string) => void;
}

export const AdminHeaderFooterCustomizer: React.FC<AdminHeaderFooterCustomizerProps> = ({ onSuccessToast }) => {
  const [activeSubTab, setActiveSubTab] = useState<'theme' | 'header' | 'footer' | 'code'>('theme');
  const [copiedSnippet, setCopiedSnippet] = useState<string | null>(null);
  const [selectedThemeId, setSelectedThemeId] = useState<string>(() => {
    return localStorage.getItem('hashir_wp_active_theme') || 'astra-free-b2b';
  });

  const [headerConfig, setHeaderConfig] = useState<WpHeaderConfig>(() => {
    try {
      const saved = localStorage.getItem('hashir_wp_header_config');
      return saved ? { ...DEFAULT_HEADER_CONFIG, ...JSON.parse(saved) } : DEFAULT_HEADER_CONFIG;
    } catch {
      return DEFAULT_HEADER_CONFIG;
    }
  });

  const [footerConfig, setFooterConfig] = useState<WpFooterConfig>(() => {
    try {
      const saved = localStorage.getItem('hashir_wp_footer_config');
      return saved ? { ...DEFAULT_FOOTER_CONFIG, ...JSON.parse(saved) } : DEFAULT_FOOTER_CONFIG;
    } catch {
      return DEFAULT_FOOTER_CONFIG;
    }
  });

  const handleSaveHeader = (e: React.FormEvent) => {
    e.preventDefault();
    localStorage.setItem('hashir_wp_header_config', JSON.stringify(headerConfig));
    window.dispatchEvent(new Event('hashir_theme_config_updated'));
    if (onSuccessToast) onSuccessToast('WordPress Header & Navigation Menu settings saved and published live!');
  };

  const handleSaveFooter = (e: React.FormEvent) => {
    e.preventDefault();
    localStorage.setItem('hashir_wp_footer_config', JSON.stringify(footerConfig));
    window.dispatchEvent(new Event('hashir_theme_config_updated'));
    if (onSuccessToast) onSuccessToast('WordPress Footer & Widgets settings saved and published live!');
  };

  const handleResetDefaults = () => {
    setHeaderConfig(DEFAULT_HEADER_CONFIG);
    setFooterConfig(DEFAULT_FOOTER_CONFIG);
    localStorage.setItem('hashir_wp_header_config', JSON.stringify(DEFAULT_HEADER_CONFIG));
    localStorage.setItem('hashir_wp_footer_config', JSON.stringify(DEFAULT_FOOTER_CONFIG));
    window.dispatchEvent(new Event('hashir_theme_config_updated'));
    if (onSuccessToast) onSuccessToast('Header & Footer restored to default Mandi Theme settings.');
  };

  const handleActivateTheme = (themeId: string, themeName: string) => {
    setSelectedThemeId(themeId);
    localStorage.setItem('hashir_wp_active_theme', themeId);
    if (onSuccessToast) onSuccessToast(`Free WordPress Theme "${themeName}" activated! Color scheme & calligraphy preserved.`);
  };

  const handleAddNavItem = () => {
    setHeaderConfig({
      ...headerConfig,
      navItems: [...headerConfig.navItems, { label: 'New Menu Link', view: 'varieties' }],
    });
  };

  const handleRemoveNavItem = (idx: number) => {
    setHeaderConfig({
      ...headerConfig,
      navItems: headerConfig.navItems.filter((_, i) => i !== idx),
    });
  };

  return (
    <div className="space-y-6 text-[#2c3338] font-sans">
      {/* Top Banner */}
      <div className="bg-white border border-[#c3c4c7] rounded-lg p-5 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <span className="px-2.5 py-0.5 rounded text-[10px] font-extrabold uppercase bg-emerald-100 text-emerald-900 border border-emerald-300">
              WordPress Appearance & Customizer
            </span>
            <span className="px-2.5 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-900 border border-amber-300">
              100% Free & Unlimited Theme Engine
            </span>
          </div>
          <h2 className="text-xl font-bold text-[#1d2327] mt-1 flex items-center gap-2 font-serif">
            <Palette className="w-5 h-5 text-[#2271b1]" />
            Free WordPress Theme, Header & Footer Customizer
          </h2>
          <p className="text-xs text-[#50575e] mt-0.5">
            Manage your active free WordPress theme, customize top bar, navigation menu, CTA buttons, and footer widgets while preserving your signature Emerald & Harvest Gold color scheme and calligraphy.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={handleResetDefaults}
            className="px-3 py-2 bg-[#f0f0f1] hover:bg-[#dcdcde] text-[#2c3338] border border-[#8c8f94] rounded text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Restore Default Values</span>
          </button>
        </div>
      </div>

      {/* Sub-navigation Tabs */}
      <div className="bg-white border border-[#c3c4c7] rounded-lg shadow-2xs overflow-hidden">
        <div className="bg-[#f0f0f1] px-4 pt-3 border-b border-[#dcdcde] flex items-center gap-2 text-xs font-semibold overflow-x-auto">
          <button
            type="button"
            onClick={() => setActiveSubTab('theme')}
            className={`pb-2.5 px-4 border-b-2 transition-colors cursor-pointer flex items-center gap-2 ${
              activeSubTab === 'theme'
                ? 'border-[#2271b1] text-[#2271b1] font-bold bg-white rounded-t'
                : 'border-transparent text-[#50575e] hover:text-[#1d2327]'
            }`}
          >
            <Palette className="w-3.5 h-3.5" />
            <span>Free WordPress Themes & Calligraphy</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveSubTab('header')}
            className={`pb-2.5 px-4 border-b-2 transition-colors cursor-pointer flex items-center gap-2 ${
              activeSubTab === 'header'
                ? 'border-[#2271b1] text-[#2271b1] font-bold bg-white rounded-t'
                : 'border-transparent text-[#50575e] hover:text-[#1d2327]'
            }`}
          >
            <Layout className="w-3.5 h-3.5" />
            <span>Header & Navigation Menu Builder</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveSubTab('footer')}
            className={`pb-2.5 px-4 border-b-2 transition-colors cursor-pointer flex items-center gap-2 ${
              activeSubTab === 'footer'
                ? 'border-[#2271b1] text-[#2271b1] font-bold bg-white rounded-t'
                : 'border-transparent text-[#50575e] hover:text-[#1d2327]'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Footer, Retail Store & Copyright Editor</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveSubTab('code')}
            className={`pb-2.5 px-4 border-b-2 transition-colors cursor-pointer flex items-center gap-2 ${
              activeSubTab === 'code'
                ? 'border-[#2271b1] text-[#2271b1] font-bold bg-white rounded-t'
                : 'border-transparent text-[#50575e] hover:text-[#1d2327]'
            }`}
          >
            <Code className="w-3.5 h-3.5" />
            <span>Code to Inject in Theme (Backlink)</span>
          </button>
        </div>

        {/* TAB 1: FREE WORDPRESS THEME & CALLIGRAPHY */}
        {activeSubTab === 'theme' && (
          <div className="p-6 space-y-6 text-xs">
            <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-700" />
                  <strong className="text-sm font-bold text-emerald-950">
                    Locked Color Scheme & Text Calligraphy (As Requested)
                  </strong>
                </div>
                <p className="text-neutral-700">
                  Your signature <strong>Emerald Green (#064e3b), Harvest Gold (#f59e0b), and Playfair Display Serif + Inter Sans Calligraphy</strong> are locked and protected across all theme updates.
                </p>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <div className="w-7 h-7 rounded-full bg-emerald-900 border-2 border-white shadow" title="Emerald #064e3b" />
                <div className="w-7 h-7 rounded-full bg-amber-400 border-2 border-white shadow" title="Harvest Gold #fbbf24" />
                <div className="w-7 h-7 rounded-full bg-neutral-950 border-2 border-white shadow" title="Obsidian #0a0a0a" />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {FREE_WORDPRESS_THEMES.map((theme) => {
                const isCurrent = selectedThemeId === theme.id;
                return (
                  <div
                    key={theme.id}
                    className={`p-5 rounded-xl border-2 transition-all flex flex-col justify-between space-y-4 ${
                      isCurrent ? 'border-[#2271b1] bg-blue-50/20' : 'border-[#dcdcde] bg-white'
                    }`}
                  >
                    <div className="space-y-2">
                      <div className="flex items-center justify-between gap-2">
                        <span className="font-bold text-sm text-[#1d2327]">{theme.name}</span>
                        {isCurrent && (
                          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-900 border border-emerald-300">
                            Active Theme
                          </span>
                        )}
                      </div>
                      <div className="text-[11px] text-[#646970]">
                        Version {theme.version} • By <strong>{theme.author}</strong>
                      </div>
                      <p className="text-xs text-[#50575e] leading-relaxed">{theme.description}</p>
                    </div>

                    <div className="flex items-center justify-between pt-3 border-t border-[#dcdcde]">
                      <a
                        href={theme.wpOrgUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[#2271b1] hover:underline font-semibold flex items-center gap-1"
                      >
                        <span>View on WordPress.org</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>

                      {isCurrent ? (
                        <button
                          type="button"
                          onClick={() => setActiveSubTab('header')}
                          className="px-3.5 py-1.5 bg-[#2271b1] text-white rounded font-bold cursor-pointer"
                        >
                          Customize Theme
                        </button>
                      ) : (
                        <button
                          type="button"
                          onClick={() => handleActivateTheme(theme.id, theme.name)}
                          className="px-3.5 py-1.5 bg-white hover:bg-neutral-100 text-[#2271b1] border border-[#2271b1] rounded font-bold cursor-pointer"
                        >
                          Activate Free Theme
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* TAB 2: HEADER & MENU CUSTOMIZER */}
        {activeSubTab === 'header' && (
          <form onSubmit={handleSaveHeader} className="p-6 space-y-6 text-xs">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block font-bold text-[#1d2327] mb-1">Top Bar Announcement Text</label>
                <input
                  type="text"
                  value={headerConfig.topBarAnnouncement}
                  onChange={(e) => setHeaderConfig({ ...headerConfig, topBarAnnouncement: e.target.value })}
                  className="w-full px-3 py-2 border border-[#8c8f94] rounded focus:border-[#2271b1] outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-[#1d2327] mb-1">Top Bar Head Office Location</label>
                <input
                  type="text"
                  value={headerConfig.topBarOfficeLocation}
                  onChange={(e) => setHeaderConfig({ ...headerConfig, topBarOfficeLocation: e.target.value })}
                  className="w-full px-3 py-2 border border-[#8c8f94] rounded focus:border-[#2271b1] outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-[#1d2327] mb-1">Brand Title (Primary Word)</label>
                <input
                  type="text"
                  value={headerConfig.brandFirstWord}
                  onChange={(e) => setHeaderConfig({ ...headerConfig, brandFirstWord: e.target.value })}
                  className="w-full px-3 py-2 border border-[#8c8f94] rounded focus:border-[#2271b1] outline-none font-bold"
                />
              </div>

              <div>
                <label className="block font-bold text-[#1d2327] mb-1">Brand Title (Accent Word)</label>
                <input
                  type="text"
                  value={headerConfig.brandSecondWord}
                  onChange={(e) => setHeaderConfig({ ...headerConfig, brandSecondWord: e.target.value })}
                  className="w-full px-3 py-2 border border-[#8c8f94] rounded focus:border-[#2271b1] outline-none font-bold"
                />
              </div>

              <div>
                <label className="block font-bold text-[#1d2327] mb-1">Brand Tagline / Subtitle</label>
                <input
                  type="text"
                  value={headerConfig.brandSubtitle}
                  onChange={(e) => setHeaderConfig({ ...headerConfig, brandSubtitle: e.target.value })}
                  className="w-full px-3 py-2 border border-[#8c8f94] rounded focus:border-[#2271b1] outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-[#1d2327] mb-1">Primary Quote Button Text</label>
                <input
                  type="text"
                  value={headerConfig.primaryCtaText}
                  onChange={(e) => setHeaderConfig({ ...headerConfig, primaryCtaText: e.target.value })}
                  className="w-full px-3 py-2 border border-[#8c8f94] rounded focus:border-[#2271b1] outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-[#1d2327] mb-1">Red Sample Button Text</label>
                <input
                  type="text"
                  value={headerConfig.sampleBtnText}
                  onChange={(e) => setHeaderConfig({ ...headerConfig, sampleBtnText: e.target.value })}
                  className="w-full px-3 py-2 border border-[#8c8f94] rounded focus:border-[#2271b1] outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-[#1d2327] mb-1">Red Sample Button External/Internal URL</label>
                <input
                  type="text"
                  value={headerConfig.sampleBtnUrl}
                  onChange={(e) => setHeaderConfig({ ...headerConfig, sampleBtnUrl: e.target.value })}
                  className="w-full px-3 py-2 border border-[#8c8f94] rounded focus:border-[#2271b1] outline-none font-mono"
                />
              </div>

              <div>
                <label className="block font-bold text-[#1d2327] mb-1">WhatsApp Desk 1 Number</label>
                <input
                  type="text"
                  value={headerConfig.whatsappDesk1}
                  onChange={(e) => setHeaderConfig({ ...headerConfig, whatsappDesk1: e.target.value })}
                  className="w-full px-3 py-2 border border-[#8c8f94] rounded focus:border-[#2271b1] outline-none font-mono"
                />
              </div>

              <div>
                <label className="block font-bold text-[#1d2327] mb-1">WhatsApp Desk 2 Number</label>
                <input
                  type="text"
                  value={headerConfig.whatsappDesk2}
                  onChange={(e) => setHeaderConfig({ ...headerConfig, whatsappDesk2: e.target.value })}
                  className="w-full px-3 py-2 border border-[#8c8f94] rounded focus:border-[#2271b1] outline-none font-mono"
                />
              </div>
            </div>

            {/* Menu Items Editor */}
            <div className="pt-4 border-t border-[#dcdcde] space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="font-bold text-sm text-[#1d2327]">Header Navigation Menu Links</h4>
                <button
                  type="button"
                  onClick={handleAddNavItem}
                  className="px-3 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded text-xs font-bold flex items-center gap-1 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Menu Item</span>
                </button>
              </div>

              <div className="space-y-2">
                {headerConfig.navItems.map((item, idx) => (
                  <div key={idx} className="flex items-center gap-2 bg-[#f6f7f7] p-2.5 rounded border border-[#dcdcde]">
                    <input
                      type="text"
                      value={item.label}
                      onChange={(e) => {
                        const updated = [...headerConfig.navItems];
                        updated[idx] = { ...updated[idx], label: e.target.value };
                        setHeaderConfig({ ...headerConfig, navItems: updated });
                      }}
                      placeholder="Menu Label"
                      className="flex-1 px-2.5 py-1.5 bg-white border border-[#8c8f94] rounded text-xs font-semibold"
                    />
                    <input
                      type="text"
                      value={item.view}
                      onChange={(e) => {
                        const updated = [...headerConfig.navItems];
                        updated[idx] = { ...updated[idx], view: e.target.value };
                        setHeaderConfig({ ...headerConfig, navItems: updated });
                      }}
                      placeholder="Target slug/view (e.g. about, varieties, blog)"
                      className="flex-1 px-2.5 py-1.5 bg-white border border-[#8c8f94] rounded text-xs font-mono"
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveNavItem(idx)}
                      className="p-1.5 text-rose-600 hover:bg-rose-50 rounded cursor-pointer"
                      title="Remove Menu Link"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                className="px-5 py-2.5 bg-[#2271b1] hover:bg-[#135e96] text-white rounded-lg font-bold text-xs flex items-center gap-2 cursor-pointer shadow-xs"
              >
                <Save className="w-4 h-4" />
                <span>Save & Publish Header Changes</span>
              </button>
            </div>
          </form>
        )}

        {/* TAB 3: FOOTER CUSTOMIZER */}
        {activeSubTab === 'footer' && (
          <form onSubmit={handleSaveFooter} className="p-6 space-y-5 text-xs">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block font-bold text-[#1d2327] mb-1">Footer Top Callout Badge</label>
                <input
                  type="text"
                  value={footerConfig.calloutBadge}
                  onChange={(e) => setFooterConfig({ ...footerConfig, calloutBadge: e.target.value })}
                  className="w-full px-3 py-2 border border-[#8c8f94] rounded focus:border-[#2271b1] outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-[#1d2327] mb-1">Footer Top Callout Heading</label>
                <input
                  type="text"
                  value={footerConfig.calloutTitle}
                  onChange={(e) => setFooterConfig({ ...footerConfig, calloutTitle: e.target.value })}
                  className="w-full px-3 py-2 border border-[#8c8f94] rounded focus:border-[#2271b1] outline-none font-bold"
                />
              </div>
            </div>

            <div>
              <label className="block font-bold text-[#1d2327] mb-1">Footer Callout Subtitle</label>
              <input
                type="text"
                value={footerConfig.calloutSubtitle}
                onChange={(e) => setFooterConfig({ ...footerConfig, calloutSubtitle: e.target.value })}
                className="w-full px-3 py-2 border border-[#8c8f94] rounded focus:border-[#2271b1] outline-none"
              />
            </div>

            <div>
              <label className="block font-bold text-[#1d2327] mb-1">Company Profile Description (Footer Column 1)</label>
              <textarea
                rows={3}
                value={footerConfig.companyDescription}
                onChange={(e) => setFooterConfig({ ...footerConfig, companyDescription: e.target.value })}
                className="w-full px-3 py-2 border border-[#8c8f94] rounded focus:border-[#2271b1] outline-none resize-none leading-relaxed"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block font-bold text-[#1d2327] mb-1">Retail Store Name</label>
                <input
                  type="text"
                  value={footerConfig.retailStoreName}
                  onChange={(e) => setFooterConfig({ ...footerConfig, retailStoreName: e.target.value })}
                  className="w-full px-3 py-2 border border-[#8c8f94] rounded focus:border-[#2271b1] outline-none font-bold"
                />
              </div>

              <div>
                <label className="block font-bold text-[#1d2327] mb-1">Head Office Address</label>
                <input
                  type="text"
                  value={footerConfig.officeAddress}
                  onChange={(e) => setFooterConfig({ ...footerConfig, officeAddress: e.target.value })}
                  className="w-full px-3 py-2 border border-[#8c8f94] rounded focus:border-[#2271b1] outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block font-bold text-[#1d2327] mb-1">Bottom Copyright Notice</label>
              <input
                type="text"
                value={footerConfig.copyrightText}
                onChange={(e) => setFooterConfig({ ...footerConfig, copyrightText: e.target.value })}
                className="w-full px-3 py-2 border border-[#8c8f94] rounded focus:border-[#2271b1] outline-none"
              />
            </div>

            <div className="pt-2">
              <button
                type="submit"
                className="px-5 py-2.5 bg-[#2271b1] hover:bg-[#135e96] text-white rounded-lg font-bold text-xs flex items-center gap-2 cursor-pointer shadow-xs"
              >
                <Save className="w-4 h-4" />
                <span>Save & Publish Footer Changes</span>
              </button>
            </div>
          </form>
        )}

        {/* TAB 4: WORDPRESS THEME CODE SNIPPETS (BACKLINK INTEGRATION) */}
        {activeSubTab === 'code' && (
          <div className="p-6 space-y-6 text-xs">
            <div className="p-4 bg-emerald-50 border border-emerald-300 rounded-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="space-y-1">
                <span className="px-2 py-0.5 rounded text-[10px] font-extrabold uppercase bg-red-600 text-white tracking-wider">
                  Live Backlink Integration
                </span>
                <h3 className="text-sm font-bold text-neutral-900 flex items-center gap-1.5">
                  <ExternalLink className="w-4 h-4 text-emerald-700" />
                  Target URL: <code className="text-emerald-900 bg-white px-2 py-0.5 rounded border border-emerald-300 font-mono">https://trade.hashirricesupplier.com/</code>
                </h3>
                <p className="text-neutral-600 text-xs">
                  Anchor Text: <strong>"Add your rice sample"</strong>. Copy and paste any of the code snippets below directly into your active WordPress theme (header.php, footer.php, functions.php, or HTML Widget).
                </p>
              </div>

              <a
                href="https://trade.hashirricesupplier.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-bold text-xs rounded-lg inline-flex items-center gap-1.5 shrink-0 transition-colors shadow-xs"
              >
                <span>Visit Live Trade Portal</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>

            {/* Snippet 1: Header CTA Button (header.php) */}
            <div className="bg-white border border-[#c3c4c7] rounded-lg p-4 space-y-2">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <div>
                  <h4 className="font-bold text-[#1d2327] text-xs flex items-center gap-1.5">
                    <span className="w-5 h-5 rounded-full bg-emerald-800 text-white flex items-center justify-center font-bold text-[10px]">1</span>
                    Header CTA Button Code (Paste inside <code>header.php</code> or navigation bar)
                  </h4>
                  <p className="text-[11px] text-[#646970]">
                    Renders the red "Add your rice sample" button matching this website.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    const code = `<a href="https://trade.hashirricesupplier.com/" target="_blank" rel="noopener noreferrer" class="hashir-header-btn-sample" style="display:inline-flex;align-items:center;gap:6px;background-color:#dc2626;color:#ffffff;font-size:13px;font-weight:700;padding:8px 16px;border-radius:8px;text-decoration:none;box-shadow:0 1px 3px rgba(0,0,0,0.15);transition:background-color 0.2s ease;">
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="vertical-align:middle;"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
  <span>Add your rice sample</span>
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="opacity:0.85;"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path><polyline points="15 3 21 3 21 9"></polyline><line x1="10" y1="14" x2="21" y2="3"></line></svg>
</a>`;
                    navigator.clipboard.writeText(code);
                    setCopiedSnippet('header');
                    setTimeout(() => setCopiedSnippet(null), 3000);
                  }}
                  className="px-3 py-1.5 bg-[#f0f0f1] hover:bg-[#e0e0e1] text-[#2c3338] border border-[#8c8f94] rounded text-xs font-semibold flex items-center gap-1 cursor-pointer"
                >
                  {copiedSnippet === 'header' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedSnippet === 'header' ? 'Copied Header Code!' : 'Copy Header Snippet'}</span>
                </button>
              </div>
              <pre className="p-3 bg-[#f6f7f7] border border-[#dcdcde] rounded text-[11px] font-mono text-[#1d2327] overflow-x-auto whitespace-pre-wrap">
{`<a href="https://trade.hashirricesupplier.com/" target="_blank" rel="noopener noreferrer" class="hashir-header-btn-sample" style="display:inline-flex;align-items:center;gap:6px;background-color:#dc2626;color:#ffffff;font-size:13px;font-weight:700;padding:8px 16px;border-radius:8px;text-decoration:none;box-shadow:0 1px 3px rgba(0,0,0,0.15);transition:background-color 0.2s ease;">
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="vertical-align:middle;"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
  <span>Add your rice sample</span>
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="opacity:0.85;"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path><polyline points="15 3 21 3 21 9"></polyline><line x1="10" y1="14" x2="21" y2="3"></line></svg>
</a>`}
              </pre>
            </div>

            {/* Snippet 2: Footer Backlink (footer.php) */}
            <div className="bg-white border border-[#c3c4c7] rounded-lg p-4 space-y-2">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <div>
                  <h4 className="font-bold text-[#1d2327] text-xs flex items-center gap-1.5">
                    <span className="w-5 h-5 rounded-full bg-emerald-800 text-white flex items-center justify-center font-bold text-[10px]">2</span>
                    Footer Backlink Section (Paste inside <code>footer.php</code> before <code>&lt;/footer&gt;</code>)
                  </h4>
                  <p className="text-[11px] text-[#646970]">
                    Clean semantic backlink with anchor text "Add your rice sample".
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    const code = `<div class="hashir-footer-sample-backlink" style="text-align:center;padding:12px 0;margin-top:16px;border-top:1px solid rgba(0,0,0,0.08);font-size:13px;">
  <span style="color:#525252;">Are you a Rice Miller or Trader?</span> 
  <a href="https://trade.hashirricesupplier.com/" target="_blank" rel="noopener noreferrer" title="Add your rice sample on Hashir Rice Supplier Trade Exchange" style="color:#dc2626;font-weight:700;text-decoration:none;margin-left:6px;display:inline-flex;align-items:center;gap:4px;">
    <span>Add your rice sample</span>
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path><polyline points="15 3 21 3 21 9"></polyline><line x1="10" y1="14" x2="21" y2="3"></line></svg>
  </a>
</div>`;
                    navigator.clipboard.writeText(code);
                    setCopiedSnippet('footer');
                    setTimeout(() => setCopiedSnippet(null), 3000);
                  }}
                  className="px-3 py-1.5 bg-[#f0f0f1] hover:bg-[#e0e0e1] text-[#2c3338] border border-[#8c8f94] rounded text-xs font-semibold flex items-center gap-1 cursor-pointer"
                >
                  {copiedSnippet === 'footer' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedSnippet === 'footer' ? 'Copied Footer Code!' : 'Copy Footer Snippet'}</span>
                </button>
              </div>
              <pre className="p-3 bg-[#f6f7f7] border border-[#dcdcde] rounded text-[11px] font-mono text-[#1d2327] overflow-x-auto whitespace-pre-wrap">
{`<div class="hashir-footer-sample-backlink" style="text-align:center;padding:12px 0;margin-top:16px;border-top:1px solid rgba(0,0,0,0.08);font-size:13px;">
  <span style="color:#525252;">Are you a Rice Miller or Trader?</span> 
  <a href="https://trade.hashirricesupplier.com/" target="_blank" rel="noopener noreferrer" title="Add your rice sample on Hashir Rice Supplier Trade Exchange" style="color:#dc2626;font-weight:700;text-decoration:none;margin-left:6px;display:inline-flex;align-items:center;gap:4px;">
    <span>Add your rice sample</span>
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path><polyline points="15 3 21 3 21 9"></polyline><line x1="10" y1="14" x2="21" y2="3"></line></svg>
  </a>
</div>`}
              </pre>
            </div>

            {/* Snippet 3: PHP Shortcode & Floating Hook (functions.php) */}
            <div className="bg-white border border-[#c3c4c7] rounded-lg p-4 space-y-2">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <div>
                  <h4 className="font-bold text-[#1d2327] text-xs flex items-center gap-1.5">
                    <span className="w-5 h-5 rounded-full bg-emerald-800 text-white flex items-center justify-center font-bold text-[10px]">3</span>
                    WordPress Shortcode & Hook Code (Paste at bottom of <code>functions.php</code>)
                  </h4>
                  <p className="text-[11px] text-[#646970]">
                    Creates <code>[add_rice_sample_button]</code> shortcode and automatic bottom floating button.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    const code = `// Hashir Rice Supplier: "Add your rice sample" shortcode & floating button
function hashir_add_rice_sample_shortcode($atts) {
    $a = shortcode_atts(array(
        'text' => 'Add your rice sample',
        'class' => 'hashir-theme-sample-btn',
    ), $atts);
    
    return '<a href="https://trade.hashirricesupplier.com/" target="_blank" rel="noopener noreferrer" class="' . esc_attr($a['class']) . '" style="display:inline-flex;align-items:center;gap:6px;background:#dc2626;color:#ffffff;font-size:13px;font-weight:bold;padding:8px 16px;border-radius:8px;text-decoration:none;box-shadow:0 1px 3px rgba(0,0,0,0.15);">'
         . '<span style="font-size:15px;line-height:1;">+</span> '
         . esc_html($a['text'])
         . ' <span style="font-size:11px;opacity:0.85;">↗</span>'
         . '</a>';
}
add_shortcode('add_rice_sample_button', 'hashir_add_rice_sample_shortcode');

function hashir_add_rice_sample_floating_button() {
    echo '<div id="hashir-floating-sample-btn" style="position:fixed;bottom:20px;left:20px;z-index:99999;font-family:sans-serif;">'
       . '<a href="https://trade.hashirricesupplier.com/" target="_blank" rel="noopener noreferrer" style="display:inline-flex;align-items:center;gap:6px;background:#dc2626;color:#ffffff;font-weight:700;font-size:12px;padding:8px 14px;border-radius:9999px;box-shadow:0 4px 14px rgba(220,38,38,0.4);text-decoration:none;border:1px solid #b91c1c;">'
       . '<span style="font-size:14px;font-weight:900;line-height:1;">+</span> '
       . '<span>Add your rice sample</span>'
       . ' <span style="font-size:10px;opacity:0.85;">↗</span>'
       . '</a></div>';
}
add_action('wp_footer', 'hashir_add_rice_sample_floating_button');`;
                    navigator.clipboard.writeText(code);
                    setCopiedSnippet('php');
                    setTimeout(() => setCopiedSnippet(null), 3000);
                  }}
                  className="px-3 py-1.5 bg-[#f0f0f1] hover:bg-[#e0e0e1] text-[#2c3338] border border-[#8c8f94] rounded text-xs font-semibold flex items-center gap-1 cursor-pointer"
                >
                  {copiedSnippet === 'php' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedSnippet === 'php' ? 'Copied PHP Code!' : 'Copy functions.php Code'}</span>
                </button>
              </div>
              <pre className="p-3 bg-[#f6f7f7] border border-[#dcdcde] rounded text-[11px] font-mono text-[#1d2327] overflow-x-auto whitespace-pre-wrap">
{`// Hashir Rice Supplier: "Add your rice sample" shortcode & floating button
function hashir_add_rice_sample_shortcode($atts) {
    $a = shortcode_atts(array(
        'text' => 'Add your rice sample',
        'class' => 'hashir-theme-sample-btn',
    ), $atts);
    
    return '<a href="https://trade.hashirricesupplier.com/" target="_blank" rel="noopener noreferrer" class="' . esc_attr($a['class']) . '" style="display:inline-flex;align-items:center;gap:6px;background:#dc2626;color:#ffffff;font-size:13px;font-weight:bold;padding:8px 16px;border-radius:8px;text-decoration:none;box-shadow:0 1px 3px rgba(0,0,0,0.15);">'
         . '<span style="font-size:15px;line-height:1;">+</span> '
         . esc_html($a['text'])
         . ' <span style="font-size:11px;opacity:0.85;">↗</span>'
         . '</a>';
}
add_shortcode('add_rice_sample_button', 'hashir_add_rice_sample_shortcode');

function hashir_add_rice_sample_floating_button() {
    echo '<div id="hashir-floating-sample-btn" style="position:fixed;bottom:20px;left:20px;z-index:99999;font-family:sans-serif;">'
       . '<a href="https://trade.hashirricesupplier.com/" target="_blank" rel="noopener noreferrer" style="display:inline-flex;align-items:center;gap:6px;background:#dc2626;color:#ffffff;font-weight:700;font-size:12px;padding:8px 14px;border-radius:9999px;box-shadow:0 4px 14px rgba(220,38,38,0.4);text-decoration:none;border:1px solid #b91c1c;">'
       . '<span style="font-size:14px;font-weight:900;line-height:1;">+</span> '
       . '<span>Add your rice sample</span>'
       . ' <span style="font-size:10px;opacity:0.85;">↗</span>'
       . '</a></div>';
}
add_action('wp_footer', 'hashir_add_rice_sample_floating_button');`}
              </pre>
            </div>

            {/* Snippet 4: WordPress Menu Setup */}
            <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg space-y-2">
              <h4 className="font-bold text-amber-950 text-xs flex items-center gap-1.5">
                <span className="w-5 h-5 rounded-full bg-amber-600 text-white flex items-center justify-center font-bold text-[10px]">4</span>
                How to Add in WordPress Menu (No Code Required)
              </h4>
              <ol className="list-decimal list-inside space-y-1 text-[11px] text-amber-900 leading-relaxed">
                <li>Go to <strong>Appearance → Menus</strong> in your WordPress Dashboard.</li>
                <li>Under <strong>Add menu items</strong> on the left, click <strong>Custom Links</strong>.</li>
                <li>In <strong>URL</strong>, paste: <code className="bg-white px-1.5 py-0.5 rounded border border-amber-300 font-bold">https://trade.hashirricesupplier.com/</code></li>
                <li>In <strong>Link Text</strong>, type: <code className="bg-white px-1.5 py-0.5 rounded border border-amber-300 font-bold">Add your rice sample</code></li>
                <li>Click <strong>Add to Menu</strong>, drag to your desired header or footer menu position, and click <strong>Save Menu</strong>.</li>
              </ol>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
