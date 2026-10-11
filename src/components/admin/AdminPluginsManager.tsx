import React, { useState } from 'react';
import {
  Puzzle,
  Plus,
  Trash2,
  Settings,
  CheckCircle2,
  XCircle,
  Upload,
  Search,
  ExternalLink,
  ShieldCheck,
  Zap,
  RefreshCw,
  Power,
  Globe,
  ImageIcon,
  Sparkles,
  Download
} from 'lucide-react';
import {
  buildWordPressSeoPluginZip,
  buildWordPressSeoThemeZip,
  triggerBlobDownload
} from '../../utils/wordpressPackageBuilder';

export interface PluginItem {
  id: string;
  name: string;
  version: string;
  author: string;
  status: 'Active' | 'Inactive';
  description: string;
  badgeColor: string;
  wpOrgUrl?: string;
  isCustom?: boolean;
}

const INITIAL_PLUGINS: PluginItem[] = [
  {
    id: 'hashir-real-text-seo-plugin',
    name: 'Hashir Rice Supplier: All 114+ Pages Real Text & SEO Sitemap Pro',
    version: '6.0.0',
    author: 'Hashir Rice Supplier (Owner: Muhammad Amir Shahzad): Noor Galla Mandi, Bucheki',
    status: 'Active',
    description: 'Official WordPress Plugin for Hashir Rice Supplier. Automatically populates all 114+ Wholesale City & Commercial Pages with 100% Real Text and HTML inside the WordPress Editor, adds "Hashir Rice SEO" to your WordPress sidebar, and serves the complete 120+ URL XML Sitemap while keeping your website responsive across all devices.',
    badgeColor: 'bg-amber-100 text-amber-900 border-amber-400',
    isCustom: true
  },
  {
    id: 'rank-math',
    name: 'Rank Math SEO PRO (Mandi Schema Edition)',
    version: '3.0.72',
    author: 'Rank Math',
    status: 'Active',
    description: 'Generates Google SERP snippet previews, custom meta titles, meta descriptions, and rich Schema.org across all city hubs and mandi pages.',
    badgeColor: 'bg-emerald-100 text-emerald-800 border-emerald-300',
    wpOrgUrl: 'https://wordpress.org/plugins/seo-by-rank-math/'
  },
  {
    id: 'yoast-seo',
    name: 'Yoast SEO (Meta Tags & XML Sitemaps)',
    version: '23.4',
    author: 'Team Yoast',
    status: 'Active',
    description: 'Complete on-page SEO meta tag controls, focus keyword analysis, breadcrumb customization, and Google search indexing synchronization.',
    badgeColor: 'bg-purple-100 text-purple-800 border-purple-300',
    wpOrgUrl: 'https://wordpress.org/plugins/wordpress-seo/'
  },
  {
    id: 'smush-images',
    name: 'Smush Image Optimization & WebP Compression',
    version: '3.16.6',
    author: 'WPMU DEV',
    status: 'Active',
    description: 'Compresses all rice bag, paddy harvest, sortex mill, and grain photography automatically for ultra-fast mobile loading.',
    badgeColor: 'bg-sky-100 text-sky-800 border-sky-300',
    wpOrgUrl: 'https://wordpress.org/plugins/wp-smushit/'
  },
  {
    id: 'site-kit',
    name: 'Site Kit by Google (Analytics & Search Console)',
    version: '1.142.0',
    author: 'Google',
    status: 'Active',
    description: 'Official Google plugin for Insights on Search Console, Analytics, AdSense, PageSpeed & Tag Manager.',
    badgeColor: 'bg-blue-100 text-blue-800 border-blue-300',
    wpOrgUrl: 'https://wordpress.org/plugins/google-site-kit/'
  },
  {
    id: 'google-adsense',
    name: 'Google AdSense Official Integration',
    version: '2.4.1',
    author: 'Google AdSense Team',
    status: 'Active',
    description: 'Automatic ad placement, AMP ads, Auto-Ads & revenue optimization across high-intent mandi keywords.',
    badgeColor: 'bg-amber-100 text-amber-800 border-amber-300',
    wpOrgUrl: 'https://wordpress.org/plugins/tags/adsense/'
  },
  {
    id: 'woocommerce-mandi',
    name: 'WooCommerce Mandi B2B Edition',
    version: '9.3.2',
    author: 'Automattic',
    status: 'Active',
    description: 'Direct wholesale bulk ordering per 40kg maund, minimum order rules, and credit ledger management.',
    badgeColor: 'bg-indigo-100 text-indigo-800 border-indigo-300',
    wpOrgUrl: 'https://wordpress.org/plugins/woocommerce/'
  },
  {
    id: 'whatsapp-gateway',
    name: 'WhatsApp Business Trade Gateway',
    version: '2.1.0',
    author: 'Hashir Rice Tech',
    status: 'Active',
    description: 'Direct instant quotation and sample forwarding to +92 333 8990883 with automatic variety & volume prefilling.',
    badgeColor: 'bg-emerald-100 text-emerald-800 border-emerald-300',
    wpOrgUrl: 'https://wordpress.org/plugins/tags/whatsapp/'
  },
  {
    id: 'wordfence',
    name: 'Wordfence Security & Mandi Firewall',
    version: '7.11.7',
    author: 'Wordfence',
    status: 'Active',
    description: 'Live endpoint firewall, malware scanner, brute force protection, and rate limiting for trade API.',
    badgeColor: 'bg-cyan-100 text-cyan-800 border-cyan-300',
    wpOrgUrl: 'https://wordpress.org/plugins/wordfence/'
  }
];

const RECOMMENDED_DIRECTORY = [
  {
    id: 'rank-math-free',
    name: 'Rank Math SEO - Best WordPress SEO Plugin',
    version: '1.0.224',
    author: 'Rank Math',
    description: 'Manage Meta Titles, Meta Descriptions, Focus Keywords, Google SERP Snippets, and Schema on every single page.',
    wpOrgUrl: 'https://wordpress.org/plugins/seo-by-rank-math/',
    category: 'SEO'
  },
  {
    id: 'yoast-seo-free',
    name: 'Yoast SEO - #1 WordPress SEO Plugin',
    version: '23.4',
    author: 'Team Yoast',
    description: 'Optimize page SEO titles, meta descriptions, XML sitemaps, readability analysis, and Google preview.',
    wpOrgUrl: 'https://wordpress.org/plugins/wordpress-seo/',
    category: 'SEO'
  },
  {
    id: 'smush-free',
    name: 'Smush – Lazy Load Images, Optimize & Compress Images',
    version: '3.16.6',
    author: 'WPMU DEV',
    description: 'Optimize images used on website, convert to Next-Gen WebP, resize and compress without losing grain clarity.',
    wpOrgUrl: 'https://wordpress.org/plugins/wp-smushit/',
    category: 'Images'
  },
  {
    id: 'ewww-optimizer',
    name: 'EWWW Image Optimizer',
    version: '7.8.0',
    author: 'Exactly WWW',
    description: 'Compress high-resolution rice photos, mill machinery images, and sample photos with lossy/lossless modes.',
    wpOrgUrl: 'https://wordpress.org/plugins/ewww-image-optimizer/',
    category: 'Images'
  },
  {
    id: 'classic-editor',
    name: 'Classic Editor & TinyMCE Rich Content',
    version: '1.6.4',
    author: 'WordPress Contributors',
    description: 'Official WordPress classic post and page editor with unlimited text formatting, hyperlinks, and images.',
    wpOrgUrl: 'https://wordpress.org/plugins/classic-editor/',
    category: 'Content'
  },
  {
    id: 'wp-super-cache',
    name: 'WP Super Cache',
    version: '1.12.4',
    author: 'Automattic',
    description: 'High-speed static HTML file generation for rapid mobile rendering across 3G/4G in Pakistan.',
    wpOrgUrl: 'https://wordpress.org/plugins/wp-super-cache/',
    category: 'Performance'
  },
  {
    id: 'contact-form-7',
    name: 'Contact Form 7 & WhatsApp Lead Collector',
    version: '5.9.8',
    author: 'Takayuki Miyoshi',
    description: 'Manage multiple sample request forms and inquiry funnels with custom field validation.',
    wpOrgUrl: 'https://wordpress.org/plugins/contact-form-7/',
    category: 'Forms'
  },
  {
    id: 'all-in-one-seo',
    name: 'All in One SEO (AIOSEO)',
    version: '4.6.8',
    author: 'All in One SEO Team',
    description: 'Complete SEO toolkit with rich snippets, local SEO schema, and search engine submission.',
    wpOrgUrl: 'https://wordpress.org/plugins/all-in-one-seo-pack/',
    category: 'SEO'
  }
];

interface AdminPluginsManagerProps {
  onSuccessToast?: (msg: string) => void;
}

export const AdminPluginsManager: React.FC<AdminPluginsManagerProps> = ({ onSuccessToast }) => {
  const [plugins, setPlugins] = useState<PluginItem[]>(() => {
    try {
      const saved = localStorage.getItem('hashir_rice_admin_plugins');
      if (saved) {
        const parsed: PluginItem[] = JSON.parse(saved);
        if (!parsed.some((p) => p.id === 'hashir-real-text-seo-plugin')) {
          return [INITIAL_PLUGINS[0], ...parsed];
        }
        return parsed;
      }
    } catch (e) {
      // ignore
    }
    return INITIAL_PLUGINS;
  });

  const handleDownloadRealWordPressPluginZip = () => {
    const blob = buildWordPressSeoPluginZip('https://hashirricesupplier.com');
    triggerBlobDownload(blob, 'hashir-rice-real-text-seo-plugin.zip');
    if (onSuccessToast) {
      onSuccessToast('Downloaded hashir-rice-real-text-seo-plugin.zip! Upload in WordPress → Plugins → Add New → Upload Plugin.');
    }
  };

  const handleDownloadRestoredThemeZip = async () => {
    const blob = await buildWordPressSeoThemeZip('https://hashirricesupplier.com');
    triggerBlobDownload(blob, 'hashir-rice-seo-wordpress-theme.zip');
    if (onSuccessToast) {
      onSuccessToast('Downloaded hashir-rice-seo-wordpress-theme.zip (100% Original Responsive Design Restored)!');
    }
  };

  const [showAddModal, setShowAddModal] = useState(false);
  const [editingPlugin, setEditingPlugin] = useState<PluginItem | null>(null);
  const [editPluginName, setEditPluginName] = useState('');
  const [editPluginVersion, setEditPluginVersion] = useState('');
  const [editPluginDesc, setEditPluginDesc] = useState('');
  const [editAutoUpdate, setEditAutoUpdate] = useState(true);
  const [editCustomEndpoint, setEditCustomEndpoint] = useState('https://hasricesupplier.com/sitemap.xml');
  const [searchTerm, setSearchTerm] = useState('');
  const [wpOrgSearchQuery, setWpOrgSearchQuery] = useState('');
  const [newPluginName, setNewPluginName] = useState('');
  const [newPluginDesc, setNewPluginDesc] = useState('');
  const [newPluginAuthor, setNewPluginAuthor] = useState('');

  const handleOpenSettingsModal = (plugin: PluginItem) => {
    setEditingPlugin(plugin);
    setEditPluginName(plugin.name);
    setEditPluginVersion(plugin.version);
    setEditPluginDesc(plugin.description);
    setEditAutoUpdate(true);
  };

  const handleSavePluginSettings = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingPlugin) return;
    const updated = plugins.map((p) =>
      p.id === editingPlugin.id
        ? { ...p, name: editPluginName, version: editPluginVersion, description: editPluginDesc }
        : p
    );
    savePlugins(updated);
    setEditingPlugin(null);
    if (onSuccessToast) onSuccessToast(`Settings & configuration saved for "${editPluginName}".`);
  };

  const savePlugins = (updated: PluginItem[]) => {
    setPlugins(updated);
    localStorage.setItem('hashir_rice_admin_plugins', JSON.stringify(updated));
  };

  const handleToggleActive = (id: string) => {
    const updated = plugins.map((p) =>
      p.id === id ? { ...p, status: p.status === 'Active' ? ('Inactive' as const) : ('Active' as const) } : p
    );
    savePlugins(updated);
    if (onSuccessToast) onSuccessToast(`Plugin status updated.`);
  };

  const handleDeletePlugin = (id: string, name: string) => {
    if (window.confirm(`Are you sure you want to delete plugin "${name}"?`)) {
      const updated = plugins.filter((p) => p.id !== id);
      savePlugins(updated);
      if (onSuccessToast) onSuccessToast(`Plugin "${name}" deleted from WordPress.`);
    }
  };

  const handleInstallFromCatalog = (rec: typeof RECOMMENDED_DIRECTORY[0]) => {
    if (plugins.some((p) => p.id === rec.id)) {
      if (onSuccessToast) onSuccessToast(`Plugin ${rec.name} is already installed.`);
      return;
    }
    const newPlug: PluginItem = {
      id: rec.id,
      name: rec.name,
      version: rec.version,
      author: rec.author,
      status: 'Active',
      description: rec.description,
      badgeColor: 'bg-purple-100 text-purple-800 border-purple-300',
      wpOrgUrl: rec.wpOrgUrl
    };
    savePlugins([...plugins, newPlug]);
    setShowAddModal(false);
    if (onSuccessToast) onSuccessToast(`Plugin "${rec.name}" installed and activated.`);
  };

  const handleCreateCustomPlugin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPluginName) return;
    const custom: PluginItem = {
      id: `custom-plug-${Date.now()}`,
      name: newPluginName,
      version: '1.0.0',
      author: newPluginAuthor || 'Super Admin',
      status: 'Active',
      description: newPluginDesc || 'Custom WordPress mandi extension.',
      badgeColor: 'bg-emerald-100 text-emerald-800 border-emerald-300',
      isCustom: true
    };
    savePlugins([...plugins, custom]);
    setNewPluginName('');
    setNewPluginDesc('');
    setNewPluginAuthor('');
    setShowAddModal(false);
    if (onSuccessToast) onSuccessToast(`Custom plugin "${custom.name}" created and loaded.`);
  };

  const handleOpenWpOrgDirectory = (url: string = 'https://wordpress.org/plugins/') => {
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const handleSearchWpOrg = (e: React.FormEvent) => {
    e.preventDefault();
    if (!wpOrgSearchQuery.trim()) {
      window.open('https://wordpress.org/plugins/', '_blank', 'noopener,noreferrer');
      return;
    }
    const url = `https://wordpress.org/plugins/search/${encodeURIComponent(wpOrgSearchQuery.trim())}/`;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const activeCount = plugins.filter((p) => p.status === 'Active').length;

  return (
    <div className="space-y-6">
      {/* TOP HEADER */}
      <div className="bg-white border border-[#c3c4c7] rounded-lg p-5 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <span className="px-2.5 py-0.5 rounded text-[10px] font-extrabold uppercase bg-purple-100 text-purple-900 border border-purple-300">
              WordPress Plugin Architecture
            </span>
            <span className="text-xs text-[#646970]">{activeCount} of {plugins.length} Plugins Active</span>
          </div>
          <h2 className="text-xl font-bold text-[#1d2327] mt-1 flex items-center gap-2 font-serif">
            <Puzzle className="w-5 h-5 text-purple-600" />
            Installed Plugins & Extensions Manager
          </h2>
          <p className="text-xs text-[#50575e] mt-0.5">
            Manage SEO (Rank Math / Yoast), Image Compression (Smush), Google Site Kit, and Mandi trading extensions.
          </p>
        </div>

        {/* Top Buttons: Download Real WP Plugin ZIP, Add Plugin & WordPress.org Directory */}
        <div className="flex items-center gap-2 flex-wrap">
          <a
            href="/hashir-rice-real-text-seo-plugin.zip"
            download="hashir-rice-real-text-seo-plugin.zip"
            onClick={() => {
              if (onSuccessToast) {
                onSuccessToast('Downloading hashir-rice-real-text-seo-plugin.zip! Upload in WordPress → Plugins → Add New → Upload Plugin.');
              }
            }}
            className="px-3.5 py-2 bg-amber-400 hover:bg-amber-300 text-neutral-950 rounded text-xs font-extrabold flex items-center gap-1.5 cursor-pointer shadow-xs transition-colors no-underline"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download WordPress Plugin (.ZIP)</span>
          </a>

          <a
            href="/hashir-rice-seo-wordpress-theme.zip"
            download="hashir-rice-seo-wordpress-theme.zip"
            onClick={() => {
              if (onSuccessToast) {
                onSuccessToast('Downloading hashir-rice-seo-wordpress-theme.zip (100% Original Responsive Design Restored)!');
              }
            }}
            className="px-3.5 py-2 bg-emerald-900 hover:bg-emerald-950 text-amber-300 rounded text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-xs transition-colors no-underline"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download WordPress Theme (.ZIP)</span>
          </a>

          <button
            type="button"
            onClick={() => setShowAddModal(true)}
            className="px-3.5 py-2 bg-[#2271b1] hover:bg-[#135e96] text-white rounded text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-xs transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add New Plugin</span>
          </button>

          <button
            type="button"
            onClick={() => handleOpenWpOrgDirectory('https://wordpress.org/plugins/')}
            className="px-3.5 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-xs transition-colors"
            title="Open official WordPress.org free plugin directory in new tab"
          >
            <Globe className="w-3.5 h-3.5" />
            <span>WordPress.org Free Plugins (سرکاری ویب سائٹ)</span>
            <ExternalLink className="w-3 h-3 ml-0.5 opacity-80" />
          </button>
        </div>
      </div>

      {/* WordPress.org Featured Free Directory Promo Banner */}
      <div className="bg-gradient-to-r from-[#1d2327] via-[#2c3338] to-[#1d2327] text-white rounded-xl p-5 shadow-sm border border-[#3c434a] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span className="text-[11px] font-bold text-emerald-400 uppercase tracking-wide">
              Official Open-Source WordPress.org Free Plugin Directory
            </span>
          </div>
          <h3 className="text-sm sm:text-base font-bold text-white">
            Need Free Plugins for SEO, Image Optimization, or Speed?
          </h3>
          <p className="text-xs text-neutral-300 max-w-xl leading-relaxed">
            Access 60,000+ verified free plugins on WordPress.org including Rank Math SEO, Yoast SEO, Smush (image optimizer), EWWW, and Classic Editor.
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap shrink-0">
          <button
            type="button"
            onClick={() => handleOpenWpOrgDirectory('https://wordpress.org/plugins/tags/seo/')}
            className="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white border border-white/20 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <span>Free SEO Plugins</span>
            <ExternalLink className="w-3 h-3" />
          </button>

          <button
            type="button"
            onClick={() => handleOpenWpOrgDirectory('https://wordpress.org/plugins/tags/image-optimizer/')}
            className="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white border border-white/20 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <ImageIcon className="w-3.5 h-3.5 text-amber-300" />
            <span>Image Plugins (Smush)</span>
            <ExternalLink className="w-3 h-3" />
          </button>

          <button
            type="button"
            onClick={() => handleOpenWpOrgDirectory('https://wordpress.org/plugins/')}
            className="px-3.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs"
          >
            <span>Open WordPress.org</span>
            <ExternalLink className="w-3 h-3" />
          </button>
        </div>
      </div>

      {/* PLUGINS LIST */}
      <div className="bg-white border border-[#c3c4c7] rounded-lg shadow-xs p-5 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-[#dcdcde]">
          <h3 className="font-bold text-sm text-[#1d2327]">Active WordPress Plugins</h3>
          <span className="text-xs text-[#646970]">Total: {plugins.length} installed</span>
        </div>

        <div className="divide-y divide-[#dcdcde] text-xs">
          {plugins.map((plugin) => (
            <div key={plugin.id} className="py-4 flex flex-col sm:flex-row sm:items-start justify-between gap-4">
              <div className="space-y-1.5 max-w-2xl">
                <div className="flex items-center gap-2 flex-wrap">
                  <strong className="text-sm text-[#1d2327] font-bold">{plugin.name}</strong>
                  <span className="text-[#646970] font-mono text-[11px]">v{plugin.version}</span>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${plugin.status === 'Active' ? plugin.badgeColor : 'bg-neutral-100 text-neutral-600 border-neutral-300'}`}>
                    {plugin.status}
                  </span>
                  {plugin.isCustom && (
                    <span className="px-1.5 py-0.2 bg-blue-50 text-blue-800 border border-blue-200 rounded text-[9px] font-bold">Custom</span>
                  )}
                </div>
                <p className="text-[#50575e] leading-relaxed">{plugin.description}</p>
                <div className="flex items-center gap-3 text-[11px] text-[#646970] flex-wrap">
                  <span>By <strong className="text-[#1d2327]">{plugin.author}</strong></span>
                  <span>• Automatic updates enabled</span>
                  {plugin.wpOrgUrl && (
                    <a
                      href={plugin.wpOrgUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[#2271b1] hover:underline font-semibold flex items-center gap-1"
                    >
                      <span>View on WordPress.org</span>
                      <ExternalLink className="w-2.5 h-2.5" />
                    </a>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button
                  type="button"
                  onClick={() => handleOpenSettingsModal(plugin)}
                  className="px-3 py-1 rounded text-xs font-bold border bg-[#f0f6fc] hover:bg-[#e0effc] text-[#2271b1] border-[#2271b1]/40 transition-colors cursor-pointer flex items-center gap-1"
                >
                  <Settings className="w-3 h-3" />
                  <span>Settings & Edit</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleToggleActive(plugin.id)}
                  className={`px-3 py-1 rounded text-xs font-bold border transition-colors cursor-pointer flex items-center gap-1 ${
                    plugin.status === 'Active'
                      ? 'bg-white hover:bg-neutral-100 text-[#50575e] border-[#8c8f94]'
                      : 'bg-emerald-50 hover:bg-emerald-100 text-emerald-900 border-emerald-300'
                  }`}
                >
                  <Power className="w-3 h-3" />
                  <span>{plugin.status === 'Active' ? 'Deactivate' : 'Activate'}</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleDeletePlugin(plugin.id, plugin.name)}
                  className="px-2.5 py-1 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-300 rounded text-xs font-semibold cursor-pointer"
                  title="Remove Plugin"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* MODAL: PLUGIN SETTINGS & COMPLETE EDIT OPTIONS */}
      {editingPlugin && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-xs">
          <div className="bg-white rounded-xl shadow-2xl max-w-lg w-full p-6 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-[#dcdcde] pb-3">
              <h3 className="font-bold text-base text-[#1d2327] flex items-center gap-2">
                <Settings className="w-5 h-5 text-[#2271b1]" />
                <span>Configure Plugin: {editingPlugin.name}</span>
              </h3>
              <button
                type="button"
                onClick={() => setEditingPlugin(null)}
                className="text-[#646970] hover:text-[#1d2327] text-lg font-bold cursor-pointer"
              >
                ×
              </button>
            </div>

            <form onSubmit={handleSavePluginSettings} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-[#1d2327] mb-1">Plugin Title</label>
                <input
                  type="text"
                  required
                  value={editPluginName}
                  onChange={(e) => setEditPluginName(e.target.value)}
                  className="w-full px-3 py-2 border border-[#8c8f94] rounded focus:border-[#2271b1] outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-[#1d2327] mb-1">Version</label>
                  <input
                    type="text"
                    value={editPluginVersion}
                    onChange={(e) => setEditPluginVersion(e.target.value)}
                    className="w-full px-3 py-2 border border-[#8c8f94] rounded focus:border-[#2271b1] outline-none font-mono"
                  />
                </div>
                <div>
                  <label className="block font-bold text-[#1d2327] mb-1">License Tier</label>
                  <input
                    type="text"
                    readOnly
                    value="100% Free & Unlimited"
                    className="w-full px-3 py-2 bg-emerald-50 text-emerald-900 font-bold border border-emerald-300 rounded outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-[#1d2327] mb-1">Plugin Description & Capabilities</label>
                <textarea
                  rows={3}
                  value={editPluginDesc}
                  onChange={(e) => setEditPluginDesc(e.target.value)}
                  className="w-full px-3 py-2 border border-[#8c8f94] rounded focus:border-[#2271b1] outline-none resize-none"
                />
              </div>

              <div>
                <label className="block font-bold text-[#1d2327] mb-1">Primary Domain & Sitemap Endpoint</label>
                <input
                  type="text"
                  value={editCustomEndpoint}
                  onChange={(e) => setEditCustomEndpoint(e.target.value)}
                  className="w-full px-3 py-2 border border-[#8c8f94] rounded focus:border-[#2271b1] outline-none font-mono"
                />
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="autoUpdatePlugin"
                  checked={editAutoUpdate}
                  onChange={(e) => setEditAutoUpdate(e.target.checked)}
                  className="w-4 h-4 text-[#2271b1] rounded"
                />
                <label htmlFor="autoUpdatePlugin" className="font-semibold text-[#1d2327] cursor-pointer">
                  Enable automatic free WordPress.org updates & open search indexing
                </label>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-[#dcdcde]">
                <button
                  type="button"
                  onClick={() => setEditingPlugin(null)}
                  className="px-3.5 py-2 border border-[#8c8f94] rounded font-semibold hover:bg-[#f0f0f1] cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#2271b1] hover:bg-[#135e96] text-white rounded font-bold cursor-pointer"
                >
                  Save Plugin Configuration
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: ADD NEW PLUGIN WITH WORDPRESS.ORG LINK */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-xs">
          <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full p-6 space-y-5 animate-in fade-in zoom-in-95 duration-150 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-[#dcdcde] pb-3">
              <h3 className="font-bold text-base text-[#1d2327] flex items-center gap-2">
                <Puzzle className="w-5 h-5 text-purple-600" />
                <span>Add / Install WordPress Plugins</span>
              </h3>
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="text-[#646970] hover:text-[#1d2327] text-lg font-bold cursor-pointer"
              >
                ×
              </button>
            </div>

            {/* DIRECT SEARCH WORDPRESS.ORG REPOSITORY */}
            <div className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Globe className="w-4 h-4 text-[#2271b1]" />
                  <span className="font-bold text-xs text-[#1d2327]">Search Official WordPress.org Plugin Directory</span>
                </div>
                <a
                  href="https://wordpress.org/plugins/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[11px] font-bold text-[#2271b1] hover:underline flex items-center gap-1"
                >
                  <span>Open wordpress.org/plugins</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>

              <form onSubmit={handleSearchWpOrg} className="flex items-center gap-2">
                <div className="relative flex-1">
                  <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-neutral-400" />
                  <input
                    type="text"
                    value={wpOrgSearchQuery}
                    onChange={(e) => setWpOrgSearchQuery(e.target.value)}
                    placeholder="Search 60,000+ free plugins (e.g. Rank Math, Smush, Yoast, Cache)..."
                    className="w-full pl-9 pr-3 py-2 bg-white border border-[#8c8f94] rounded text-xs focus:border-[#2271b1] outline-none"
                  />
                </div>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#2271b1] hover:bg-[#135e96] text-white rounded text-xs font-bold transition-colors cursor-pointer shrink-0 flex items-center gap-1"
                >
                  <span>Search on WP.org</span>
                  <ExternalLink className="w-3 h-3" />
                </button>
              </form>
            </div>

            {/* POPULAR RECOMMENDED DIRECTORY */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-xs font-bold text-[#1d2327] uppercase tracking-wider">
                  Featured Free Plugins for SEO & Images
                </h4>
                <span className="text-[11px] text-[#646970]">Free on WordPress.org</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-72 overflow-y-auto p-1">
                {RECOMMENDED_DIRECTORY.map((rec) => (
                  <div key={rec.id} className="p-3 border border-[#dcdcde] rounded-lg bg-[#f6f7f7] flex flex-col justify-between space-y-2">
                    <div>
                      <div className="flex items-center justify-between">
                        <span className="px-1.5 py-0.2 rounded text-[9px] font-bold bg-neutral-200 text-neutral-800">
                          {rec.category}
                        </span>
                        <span className="text-[10px] text-[#646970]">v{rec.version}</span>
                      </div>
                      <div className="font-bold text-xs text-[#1d2327] mt-1">{rec.name}</div>
                      <div className="text-[10px] text-[#646970]">by {rec.author}</div>
                      <p className="text-[11px] text-[#50575e] mt-1 leading-relaxed line-clamp-2">{rec.description}</p>
                    </div>

                    <div className="flex items-center gap-2 pt-1">
                      <button
                        type="button"
                        onClick={() => handleInstallFromCatalog(rec)}
                        className="flex-1 py-1.5 bg-[#2271b1] hover:bg-[#135e96] text-white rounded text-xs font-bold transition-colors cursor-pointer shadow-2xs"
                      >
                        Install & Activate
                      </button>

                      <a
                        href={rec.wpOrgUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-2 py-1.5 bg-white hover:bg-neutral-100 text-[#2c3338] border border-[#8c8f94] rounded text-xs font-semibold flex items-center justify-center"
                        title="View Official Page on WordPress.org"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* CUSTOM PLUGIN CREATOR / UPLOADER */}
            <div className="border-t border-[#dcdcde] pt-4 space-y-3">
              <h4 className="text-xs font-bold text-[#1d2327] uppercase tracking-wider">Create Custom WordPress Plugin</h4>
              <form onSubmit={handleCreateCustomPlugin} className="space-y-3 text-xs">
                <div>
                  <label className="block font-semibold text-[#1d2327] mb-1">Plugin Name</label>
                  <input
                    type="text"
                    required
                    value={newPluginName}
                    onChange={(e) => setNewPluginName(e.target.value)}
                    placeholder="e.g. Custom Rice Invoice PDF Generator"
                    className="w-full px-3 py-1.5 border border-[#8c8f94] rounded focus:border-[#2271b1] outline-none"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-[#1d2327] mb-1">Description</label>
                  <textarea
                    rows={2}
                    value={newPluginDesc}
                    onChange={(e) => setNewPluginDesc(e.target.value)}
                    placeholder="Functionality provided by this plugin..."
                    className="w-full px-3 py-1.5 border border-[#8c8f94] rounded focus:border-[#2271b1] outline-none resize-none"
                  />
                </div>
                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowAddModal(false)}
                    className="px-3 py-1.5 border border-[#8c8f94] text-[#2c3338] rounded font-semibold hover:bg-[#f0f0f1] cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-1.5 bg-[#2271b1] hover:bg-[#135e96] text-white rounded font-bold cursor-pointer"
                  >
                    Activate Custom Plugin
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
