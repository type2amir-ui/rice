import React, { useState, useMemo } from 'react';
import { GoogleBusinessMap } from './GoogleBusinessMap';
import {
  FileText,
  Search,
  MapPin,
  Building2,
  BookOpen,
  Globe,
  Download,
  Copy,
  CheckCircle2,
  ExternalLink,
  ShieldCheck,
  Zap,
  TrendingUp,
  Layers,
  HelpCircle,
  Wheat,
  Share2,
  Code
} from 'lucide-react';
import { CITIES_DATA } from '../data/citiesData';
import { RICE_VARIETIES } from '../data/riceData';
import { BLOG_POSTS_DATA } from '../data/blogPostsData';
import { INTERNATIONAL_NEWS_ARTICLES } from '../data/internationalNewsData';
import { COMMERCIAL_LAHORE_PAGES } from '../data/commercialLahorePagesData';
import { COMMERCIAL_KARACHI_PAGES } from '../data/commercialKarachiPagesData';
import { COMMERCIAL_PESHAWAR_PAGES } from '../data/commercialPeshawarPagesData';
import { COMMERCIAL_QUETTA_PAGES } from '../data/commercialQuettaPagesData';
import { COMMERCIAL_HYDERABAD_PAGES } from '../data/commercialHyderabadPagesData';
import { COMMERCIAL_FAISALABAD_PAGES } from '../data/commercialFaisalabadPagesData';

interface SitemapPageProps {
  setCurrentView: (view: string) => void;
  onSelectCity?: (citySlug: string) => void;
  onSelectCommercialPage?: (slug: string) => void;
  onSelectBlog?: (id: number) => void;
  onSelectNews?: (id: number) => void;
  onOpenQuoteModal: () => void;
  onOpenSampleModal: () => void;
}

export const SitemapPage: React.FC<SitemapPageProps> = ({
  setCurrentView,
  onSelectCity,
  onSelectCommercialPage,
  onSelectBlog,
  onSelectNews,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedProvince, setSelectedProvince] = useState<string>('All');
  const [activeTab, setActiveTab] = useState<'directory' | 'xml' | 'seoGuide'>('directory');
  const [copied, setCopied] = useState(false);
  const [selectedDomain, setSelectedDomain] = useState<'https://hasricesupplier.com' | 'https://hashirricesupplier.com'>('https://hashirricesupplier.com');

  // Provinces list
  const provinces = ['All', 'Punjab', 'Sindh', 'Khyber Pakhtunkhwa', 'Balochistan', 'Federal / AJK / GB'];

  // Filtered Cities
  const filteredCities = useMemo(() => {
    return CITIES_DATA.filter((city) => {
      const matchesSearch =
        city.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        city.province.toLowerCase().includes(searchTerm.toLowerCase()) ||
        city.slug.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesProvince =
        selectedProvince === 'All'
          ? true
          : selectedProvince === 'Federal / AJK / GB'
          ? ['Federal', 'Islamabad Capital Territory', 'Azad Jammu and Kashmir', 'AJK', 'Gilgit-Baltistan'].includes(city.province)
          : city.province.toLowerCase().includes(selectedProvince.toLowerCase());

      return matchesSearch && matchesProvince;
    });
  }, [searchTerm, selectedProvince]);

  // Combined Commercial Pages
  const allCommercialPages = useMemo(() => {
    return [
      ...COMMERCIAL_LAHORE_PAGES,
      ...COMMERCIAL_KARACHI_PAGES,
      ...COMMERCIAL_PESHAWAR_PAGES,
      ...COMMERCIAL_QUETTA_PAGES,
      ...COMMERCIAL_HYDERABAD_PAGES,
      ...COMMERCIAL_FAISALABAD_PAGES,
    ];
  }, []);

  const filteredCommercial = useMemo(() => {
    if (!searchTerm) return allCommercialPages;
    return allCommercialPages.filter(
      (p) =>
        p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.targetSegment.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.slug.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.varietyType.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [allCommercialPages, searchTerm]);

  // Core Site Links (100% Canonical URLs: Zero Duplicate Alias Slugs)
  const coreLinks = [
    { name: 'Home (Main Wholesale Portal)', view: 'home', slug: '', priority: '1.0', changefreq: 'Daily' },
    { name: 'About Us (Trade Desk Profile)', view: 'about', slug: 'about-us', priority: '0.9', changefreq: 'Weekly' },
    { name: 'Rice Varieties Catalog (Specs & Pricing)', view: 'varieties', slug: 'varieties', priority: '0.95', changefreq: 'Weekly' },
    { name: 'Pakistan Sourcing Hub (60+ Cities Directory)', view: 'locations', slug: 'locations', priority: '0.95', changefreq: 'Daily' },
    { name: 'International Rice Exchange Rate Index', view: 'exchange', slug: 'exchange', priority: '0.9', changefreq: 'Daily' },
    { name: 'Verified Google Customer Reviews & Ratings', view: 'reviews', slug: 'reviews', priority: '0.85', changefreq: 'Weekly' },
    { name: '7-Step B2B Rice Sourcing Workflow', view: 'workflow', slug: 'workflow', priority: '0.85', changefreq: 'Monthly' },
    { name: 'Request Free Physical Rice Cooking Sample', view: 'sample', slug: 'sample-request', priority: '0.95', changefreq: 'Weekly' },
    { name: 'Rice Mills & Sellers B2B Portal', view: 'seller', slug: 'seller-portal', priority: '0.85', changefreq: 'Weekly' },
    { name: 'Google AI Overview & Generative Search Knowledge Hub', view: 'google-ai-overview', slug: 'google-ai-overview', priority: '0.90', changefreq: 'Weekly' },
    { name: 'Rice Knowledge Base & Cooking Guides (Blog)', view: 'blog', slug: 'blog', priority: '0.85', changefreq: 'Weekly' },
    { name: 'International Grain Trade News & Export Trends', view: 'news', slug: 'news', priority: '0.85', changefreq: 'Daily' },
    { name: 'Frequently Asked Questions (FAQs)', view: 'faqs', slug: 'faqs', priority: '0.85', changefreq: 'Weekly' },
    { name: 'Contact Mandi Office & Google Maps', view: 'contact', slug: 'contact', priority: '0.9', changefreq: 'Weekly' },
    { name: 'Privacy Policy', view: 'privacy', slug: 'privacy-policy', priority: '0.5', changefreq: 'Yearly' },
    { name: 'Terms of Service & Brokerage Agreement', view: 'terms', slug: 'terms-and-conditions', priority: '0.5', changefreq: 'Yearly' },
    { name: 'Complete Website Sitemap & URL Directory', view: 'sitemap', slug: 'sitemap', priority: '0.85', changefreq: 'Weekly' },
  ];

  // Load verified published blog posts (canonical 4 blogs + any user-created posts)
  const publishedBlogPosts = useMemo(() => {
    try {
      const saved = localStorage.getItem('hashir_rice_admin_posts');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          const published = parsed.filter((p: any) => p.status === 'publish' || !p.status);
          if (published.length > 0) return published;
        }
      }
    } catch {
      // ignore
    }
    return BLOG_POSTS_DATA;
  }, []);

  const generateFullXml = () => {
    const today = new Date().toISOString().split('T')[0];
    return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url><loc>${selectedDomain}/</loc><lastmod>${today}</lastmod><priority>1.00</priority><changefreq>daily</changefreq></url>
  <url><loc>${selectedDomain}/about-us</loc><lastmod>${today}</lastmod><priority>0.90</priority><changefreq>weekly</changefreq></url>
  <url><loc>${selectedDomain}/varieties</loc><lastmod>${today}</lastmod><priority>0.95</priority><changefreq>weekly</changefreq></url>
  <url><loc>${selectedDomain}/locations</loc><lastmod>${today}</lastmod><priority>0.95</priority><changefreq>daily</changefreq></url>
  <url><loc>${selectedDomain}/exchange</loc><lastmod>${today}</lastmod><priority>0.90</priority><changefreq>daily</changefreq></url>
  <url><loc>${selectedDomain}/reviews</loc><lastmod>${today}</lastmod><priority>0.85</priority><changefreq>weekly</changefreq></url>
  <url><loc>${selectedDomain}/workflow</loc><lastmod>${today}</lastmod><priority>0.85</priority><changefreq>monthly</changefreq></url>
  <url><loc>${selectedDomain}/sample-request</loc><lastmod>${today}</lastmod><priority>0.95</priority><changefreq>weekly</changefreq></url>
  <url><loc>${selectedDomain}/seller-portal</loc><lastmod>${today}</lastmod><priority>0.85</priority><changefreq>weekly</changefreq></url>
  <url><loc>${selectedDomain}/faqs</loc><lastmod>${today}</lastmod><priority>0.85</priority><changefreq>weekly</changefreq></url>
  <url><loc>${selectedDomain}/blog</loc><lastmod>${today}</lastmod><priority>0.85</priority><changefreq>weekly</changefreq></url>
  <!-- Verified Published Blog Posts (100% Synced) -->
  ${publishedBlogPosts.map((b) => `<url><loc>${selectedDomain}/${b.slug}</loc><lastmod>${today}</lastmod><priority>0.90</priority><changefreq>weekly</changefreq></url>`).join('\n  ')}
  <url><loc>${selectedDomain}/news</loc><lastmod>${today}</lastmod><priority>0.85</priority><changefreq>daily</changefreq></url>
  <url><loc>${selectedDomain}/contact</loc><lastmod>${today}</lastmod><priority>0.90</priority><changefreq>weekly</changefreq></url>
  <url><loc>${selectedDomain}/privacy-policy</loc><lastmod>${today}</lastmod><priority>0.50</priority><changefreq>yearly</changefreq></url>
  <url><loc>${selectedDomain}/terms-and-conditions</loc><lastmod>${today}</lastmod><priority>0.50</priority><changefreq>yearly</changefreq></url>
  <url><loc>${selectedDomain}/google-ai-overview</loc><lastmod>${today}</lastmod><priority>0.85</priority><changefreq>weekly</changefreq></url>
  <url><loc>${selectedDomain}/sitemap</loc><lastmod>${today}</lastmod><priority>0.80</priority><changefreq>weekly</changefreq></url>
  <!-- 31 Major Cities Hubs -->
  ${CITIES_DATA.map((c) => `<url><loc>${selectedDomain}/${c.slug}</loc><lastmod>${today}</lastmod><priority>0.95</priority><changefreq>weekly</changefreq></url>`).join('\n  ')}
  <!-- Commercial Portals -->
  ${allCommercialPages.map((p) => `<url><loc>${selectedDomain}/${p.slug}</loc><lastmod>${today}</lastmod><priority>0.90</priority><changefreq>weekly</changefreq></url>`).join('\n  ')}
</urlset>`;
  };

  const handleCopyXml = () => {
    const rawXml = generateFullXml();
    navigator.clipboard.writeText(rawXml);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleDownloadXml = () => {
    const rawXml = generateFullXml();
    const blob = new Blob([rawXml], { type: 'application/xml;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'sitemap.xml';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="bg-white min-h-screen">
      {/* Top Header Banner */}
      <section className="bg-gradient-to-b from-neutral-900 via-emerald-950 to-neutral-900 text-white py-14 sm:py-18 relative overflow-hidden border-b border-emerald-800/40">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#10b981_1px,transparent_1px)] [background-size:16px_16px]"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-900/80 text-emerald-300 text-xs font-bold uppercase tracking-wider border border-emerald-700/50">
            <Layers className="w-4 h-4 text-amber-400" />
            <span>Complete Website Directory & XML Sitemap</span>
          </div>

          <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-white max-w-3xl mx-auto">
            Website Sitemap & URL Directory
          </h1>

          <p className="max-w-2xl mx-auto text-neutral-300 text-sm sm:text-base leading-relaxed">
            Browse all 120 unique indexable pages across our 17 core trading desks, 31 Pakistani wholesale city hubs, and 72 commercial restaurant &amp; catering sourcing portals: 100% duplicate-free.
          </p>

          {/* Navigation Mode Tabs */}
          <div className="flex flex-wrap items-center justify-center gap-2 pt-4">
            <button
              onClick={() => setActiveTab('directory')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'directory'
                  ? 'bg-amber-400 text-neutral-950 shadow-md'
                  : 'bg-neutral-800/80 text-neutral-300 hover:bg-neutral-700'
              }`}
            >
              Interactive HTML Directory
            </button>
            <button
              onClick={() => setActiveTab('xml')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'xml'
                  ? 'bg-amber-400 text-neutral-950 shadow-md'
                  : 'bg-neutral-800/80 text-neutral-300 hover:bg-neutral-700'
              }`}
            >
              <Code className="w-3.5 h-3.5" />
              <span>XML Sitemap for Google (sitemap.xml)</span>
            </button>
            <button
              onClick={() => setActiveTab('seoGuide')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'seoGuide'
                  ? 'bg-amber-400 text-neutral-950 shadow-md'
                  : 'bg-neutral-800/80 text-neutral-300 hover:bg-neutral-700'
              }`}
            >
              <Zap className="w-3.5 h-3.5 text-amber-400" />
              <span>Recommended Free SEO Plugins & Schema Guide</span>
            </button>
          </div>
        </div>
      </section>

      {/* TAB 1: INTERACTIVE HTML DIRECTORY */}
      {activeTab === 'directory' && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 space-y-12">
          
          {/* Quick Search & Filter Bar */}
          <div className="bg-neutral-50 p-4 sm:p-6 rounded-2xl border border-neutral-200 shadow-2xs space-y-4">
            <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
              <div className="relative w-full sm:w-80">
                <Search className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search city, variety, or page..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-white border border-neutral-300 rounded-xl text-xs text-neutral-900 focus:outline-none focus:border-emerald-800"
                />
              </div>

              <div className="flex flex-wrap items-center gap-1.5 w-full sm:w-auto">
                <span className="text-xs text-neutral-500 font-semibold mr-1">Province:</span>
                {provinces.map((prov) => (
                  <button
                    key={prov}
                    onClick={() => setSelectedProvince(prov)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                      selectedProvince === prov
                        ? 'bg-emerald-900 text-white font-bold'
                        : 'bg-white border border-neutral-200 text-neutral-700 hover:bg-neutral-100'
                    }`}
                  >
                    {prov}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Section 1: Core Portal Hubs */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 border-b border-neutral-200 pb-3">
              <Globe className="w-5 h-5 text-emerald-800" />
              <h2 className="font-serif text-xl font-bold text-neutral-950">
                Core Website Views & Transactional Hubs
              </h2>
              <span className="text-xs bg-emerald-100 text-emerald-900 font-bold px-2 py-0.5 rounded-full ml-auto">
                {coreLinks.length} Pages
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {coreLinks.map((link) => (
                <a
                  key={link.view}
                  href={`/${link.slug}`}
                  onClick={(e) => {
                    e.preventDefault();
                    setCurrentView(link.view);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="text-left p-3.5 rounded-xl border border-neutral-200 hover:border-emerald-800 hover:bg-emerald-50/50 transition-all flex items-center justify-between group cursor-pointer block"
                >
                  <div className="space-y-0.5">
                    <span className="text-xs font-bold text-neutral-900 group-hover:text-emerald-950 block">
                      {link.name}
                    </span>
                    <span className="text-[11px] text-neutral-500 font-mono">
                      {selectedDomain}/{link.slug}
                    </span>
                  </div>
                  <span className="text-[10px] font-bold text-emerald-900 bg-emerald-100 px-2 py-0.5 rounded shrink-0">
                    {link.priority}
                  </span>
                </a>
              ))}
              <a
                href="https://trade.hashirricesupplier.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-left p-3.5 rounded-xl border border-red-300 bg-red-50/70 hover:border-red-600 hover:bg-red-50 transition-all flex items-center justify-between group cursor-pointer block"
              >
                <div className="space-y-0.5">
                  <span className="text-xs font-bold text-red-700 group-hover:text-red-900 flex items-center gap-1.5">
                    <span>Add your rice sample (B2B Trade Portal)</span>
                    <ExternalLink className="w-3 h-3 text-red-600" />
                  </span>
                  <span className="text-[11px] text-red-600/90 font-mono">
                    https://trade.hashirricesupplier.com/
                  </span>
                </div>
                <span className="text-[10px] font-bold text-white bg-red-600 px-2 py-0.5 rounded shrink-0">
                  Trade Desk
                </span>
              </a>
            </div>
          </div>

          {/* Section 2: Pakistan 65+ Sourcing Cities */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 border-b border-neutral-200 pb-3">
              <MapPin className="w-5 h-5 text-emerald-800" />
              <h2 className="font-serif text-xl font-bold text-neutral-950">
                Pakistan Wholesale City Supply Portals ({filteredCities.length} Cities)
              </h2>
              <span className="text-xs bg-emerald-100 text-emerald-900 font-bold px-2 py-0.5 rounded-full ml-auto">
                {CITIES_DATA.length} Total Cities
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-2.5">
              {filteredCities.map((city) => (
                <a
                  key={city.slug}
                  href={`/${city.slug}`}
                  onClick={(e) => {
                    e.preventDefault();
                    if (onSelectCity) onSelectCity(city.slug);
                    else setCurrentView(city.slug);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="text-left p-2.5 rounded-lg border border-neutral-200 hover:border-emerald-800 hover:bg-neutral-50 transition-all cursor-pointer group block"
                >
                  <span className="text-xs font-bold text-neutral-900 group-hover:text-emerald-950 block truncate">
                    {city.name}
                  </span>
                  <span className="text-[10px] text-neutral-500 block truncate">
                    {city.province}
                  </span>
                </a>
              ))}
            </div>
          </div>

          {/* Section 3: Commercial Foodservice Hubs (60 Portals) */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 border-b border-neutral-200 pb-3">
              <Building2 className="w-5 h-5 text-emerald-800" />
              <h2 className="font-serif text-xl font-bold text-neutral-950">
                Commercial Foodservice &amp; Buyer Portals ({allCommercialPages.length} Pages)
              </h2>
              <span className="text-xs bg-amber-100 text-amber-900 font-bold px-2 py-0.5 rounded-full ml-auto">
                Lahore, Karachi, Peshawar, Quetta, Hyderabad, Faisalabad
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
              {filteredCommercial.map((page) => (
                <a
                  key={page.id}
                  href={`/${page.slug}`}
                  onClick={(e) => {
                    e.preventDefault();
                    if (onSelectCommercialPage) onSelectCommercialPage(page.slug);
                    else setCurrentView(page.slug);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="text-left p-3 rounded-xl border border-neutral-200 hover:border-amber-500 hover:bg-amber-50/40 transition-all cursor-pointer space-y-1 group block"
                >
                  <div className="flex items-center justify-between text-[10px] text-neutral-500">
                    <span className="font-bold uppercase tracking-wider text-amber-900 bg-amber-100 px-1.5 py-0.5 rounded">
                      {page.targetSegment}
                    </span>
                    <span className="font-mono">{page.grainLengthRaw}</span>
                  </div>
                  <h3 className="text-xs font-bold text-neutral-900 group-hover:text-amber-950 leading-snug line-clamp-2">
                    {page.title}
                  </h3>
                </a>
              ))}
            </div>
          </div>

          {/* Section 4: Published Rice Trade & Sourcing Articles */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 border-b border-neutral-200 pb-3">
              <BookOpen className="w-5 h-5 text-emerald-800" />
              <h2 className="font-serif text-xl font-bold text-neutral-950">
                Published Rice Trade &amp; Sourcing Articles ({publishedBlogPosts.length} Articles)
              </h2>
              <span className="text-xs bg-emerald-100 text-emerald-900 font-bold px-2.5 py-0.5 rounded-full ml-auto">
                Verified Published in Sitemap
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-3.5">
              {publishedBlogPosts.map((post) => (
                <a
                  key={post.id || post.slug}
                  href={`/${post.slug}`}
                  onClick={(e) => {
                    e.preventDefault();
                    setCurrentView('blog');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="text-left p-3.5 rounded-xl border border-neutral-200 hover:border-emerald-700 hover:bg-emerald-50/40 transition-all cursor-pointer space-y-1.5 group block bg-white"
                >
                  <div className="flex items-center justify-between text-[11px] text-neutral-500">
                    <span className="font-bold text-emerald-900 bg-emerald-100 px-2 py-0.5 rounded text-[10px]">
                      {post.category}
                    </span>
                    <span className="text-neutral-500 font-mono text-[10px]">{post.publishedDate}</span>
                  </div>
                  <h3 className="text-xs font-bold text-neutral-900 group-hover:text-emerald-950 leading-snug line-clamp-2">
                    {post.title}
                  </h3>
                  <p className="text-[11px] text-neutral-600 line-clamp-1">{post.excerpt}</p>
                  <div className="text-[10px] text-emerald-800 font-mono flex items-center gap-1 pt-1 border-t border-neutral-100">
                    <ExternalLink className="w-3 h-3 text-emerald-600" />
                    <span className="truncate">https://hashirricesupplier.com/{post.slug}</span>
                  </div>
                </a>
              ))}
            </div>
          </div>

          {/* Section 5: Rice Varieties */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 border-b border-neutral-200 pb-3">
              <Wheat className="w-5 h-5 text-emerald-800" />
              <h2 className="font-serif text-xl font-bold text-neutral-950">
                Rice Variety Specs & Laboratory Parameters
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {RICE_VARIETIES.map((v) => (
                <div
                  key={v.id}
                  className="p-3.5 rounded-xl border border-neutral-200 bg-neutral-50/60 space-y-1.5"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-neutral-950">{v.name}</span>
                    <span className="text-[10px] font-bold text-emerald-900 bg-emerald-100 px-2 py-0.5 rounded capitalize">
                      {v.category}
                    </span>
                  </div>
                  <p className="text-[11px] text-neutral-600 line-clamp-2">{v.description}</p>
                  <div className="text-[10px] text-neutral-500 font-mono flex justify-between pt-1 border-t border-neutral-200">
                    <span>Raw: {v.specs.averageGrainLength}</span>
                    <span>Cooked: {v.specs.postCookingLength}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      )}

      {/* TAB 2: RAW XML SITEMAP VIEWER */}
      {activeTab === 'xml' && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-neutral-50 p-4 sm:p-6 rounded-2xl border border-neutral-200">
            <div className="space-y-2">
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="font-serif text-xl font-bold text-neutral-950">
                  Official XML Sitemap File (`sitemap.xml`)
                </h2>
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-900 border border-emerald-300 text-[10px] font-bold uppercase">
                  Open Indexing Enabled (index, follow)
                </span>
              </div>
              <p className="text-xs text-neutral-600">
                Located at: <strong className="font-mono text-emerald-900">{selectedDomain}/sitemap.xml</strong>. Contains all 120 unique canonical URLs (zero <code className="font-mono">-2</code> duplicates and zero trailing slashes on subpages).
              </p>
              <div className="flex items-center gap-2 pt-1 flex-wrap">
                <span className="text-[11px] font-bold text-neutral-700">Canonical Sitemap Domain:</span>
                <button
                  type="button"
                  onClick={() => setSelectedDomain('https://hashirricesupplier.com')}
                  className="px-2.5 py-1 rounded text-xs font-mono font-bold cursor-pointer bg-emerald-900 text-white"
                >
                  https://hashirricesupplier.com
                </button>
              </div>
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              <button
                onClick={handleCopyXml}
                className="px-4 py-2.5 rounded-xl bg-emerald-900 hover:bg-emerald-950 text-white font-bold text-xs flex items-center gap-1.5 cursor-pointer shadow-sm transition-all"
              >
                {copied ? <CheckCircle2 className="w-4 h-4 text-amber-300" /> : <Copy className="w-4 h-4" />}
                <span>{copied ? 'Copied Full XML!' : 'Copy Full XML'}</span>
              </button>

              <button
                onClick={handleDownloadXml}
                className="px-4 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-neutral-950 font-bold text-xs flex items-center gap-1.5 cursor-pointer shadow-sm transition-all"
              >
                <Download className="w-4 h-4" />
                <span>Download sitemap.xml</span>
              </button>

              <a
                href="/sitemap.xml"
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2.5 rounded-xl bg-neutral-200 hover:bg-neutral-300 text-neutral-800 font-bold text-xs flex items-center gap-1.5 transition-all"
              >
                <ExternalLink className="w-4 h-4" />
                <span>Open /sitemap.xml</span>
              </a>
            </div>
          </div>

          {/* XML Code Block */}
          <div className="bg-neutral-950 text-neutral-200 p-5 rounded-2xl font-mono text-xs overflow-x-auto border border-neutral-800 leading-relaxed max-h-[500px]">
            <pre className="text-emerald-400">
{generateFullXml()}
            </pre>
          </div>
        </div>
      )}

      {/* TAB 3: RECOMMENDED FREE SEO PLUGINS & ON-PAGE SEO GUIDE */}
      {activeTab === 'seoGuide' && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 space-y-10">
          
          <div className="bg-emerald-50 rounded-2xl p-6 border border-emerald-300 space-y-2">
            <h2 className="font-serif text-xl font-bold text-emerald-950 flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-emerald-800" />
              <span>Recommended 100% Free SEO Plugins & Indexing Tools</span>
            </h2>
            <p className="text-xs text-neutral-700 leading-relaxed">
              If you are integrating an external SEO plugin or converting pages into WordPress / Next.js / Headless CMS, here are the top-rated free plugins and their optimal setup for ranking in Pakistan.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            
            {/* Tool 1 */}
            <div className="bg-neutral-50 rounded-2xl p-5 border border-neutral-200 space-y-3 shadow-2xs">
              <div className="w-10 h-10 rounded-xl bg-emerald-900 text-amber-300 flex items-center justify-center font-bold text-sm">
                1
              </div>
              <h3 className="font-serif text-base font-bold text-neutral-950">
                Rank Math SEO (Free Edition)
              </h3>
              <p className="text-xs text-neutral-600 leading-relaxed">
                The most feature-rich free SEO plugin. Automatically handles XML sitemaps, OpenGraph cards, custom Schema markup (WholesaleStore, FAQPage, Product), and on-page keyword scoring.
              </p>
              <div className="text-[11px] text-emerald-900 font-bold bg-emerald-100 p-2 rounded-lg">
                Recommended for: Dynamic Meta Tags & Schema Generator
              </div>
            </div>

            {/* Tool 2 */}
            <div className="bg-neutral-50 rounded-2xl p-5 border border-neutral-200 space-y-3 shadow-2xs">
              <div className="w-10 h-10 rounded-xl bg-emerald-900 text-amber-300 flex items-center justify-center font-bold text-sm">
                2
              </div>
              <h3 className="font-serif text-base font-bold text-neutral-950">
                Instant Indexing for Google (Rank Math)
              </h3>
              <p className="text-xs text-neutral-600 leading-relaxed">
                Uses Google Indexing API and IndexNow (Bing/Yandex) to submit new city pages and commercial URLs for crawl and indexing within minutes instead of waiting weeks.
              </p>
              <div className="text-[11px] text-emerald-900 font-bold bg-emerald-100 p-2 rounded-lg">
                Recommended for: 24-Hour Instant Google Crawling
              </div>
            </div>

            {/* Tool 3 */}
            <div className="bg-neutral-50 rounded-2xl p-5 border border-neutral-200 space-y-3 shadow-2xs">
              <div className="w-10 h-10 rounded-xl bg-emerald-900 text-amber-300 flex items-center justify-center font-bold text-sm">
                3
              </div>
              <h3 className="font-serif text-base font-bold text-neutral-950">
                LiteSpeed Cache or WP Super Cache
              </h3>
              <p className="text-xs text-neutral-600 leading-relaxed">
                Free caching, CSS/JS minification, and WebP image generation to achieve a 95+ Core Web Vitals score on mobile and desktop devices.
              </p>
              <div className="text-[11px] text-emerald-900 font-bold bg-emerald-100 p-2 rounded-lg">
                Recommended for: PageSpeed & Mobile Performance
              </div>
            </div>

            {/* Tool 4 */}
            <div className="bg-neutral-50 rounded-2xl p-5 border border-neutral-200 space-y-3 shadow-2xs">
              <div className="w-10 h-10 rounded-xl bg-emerald-900 text-amber-300 flex items-center justify-center font-bold text-sm">
                4
              </div>
              <h3 className="font-serif text-base font-bold text-neutral-950">
                Schema & Structured Data for WP
              </h3>
              <p className="text-xs text-neutral-600 leading-relaxed">
                Adds rich snippets including Star Ratings (`AggregateRating`), Review count, GeoCoordinates (Bucheki Galla Mandi), and local business phone numbers in Google SERP results.
              </p>
              <div className="text-[11px] text-emerald-900 font-bold bg-emerald-100 p-2 rounded-lg">
                Recommended for: Rich SERP Snippets & Stars
              </div>
            </div>

            {/* Tool 5 */}
            <div className="bg-neutral-50 rounded-2xl p-5 border border-neutral-200 space-y-3 shadow-2xs">
              <div className="w-10 h-10 rounded-xl bg-emerald-900 text-amber-300 flex items-center justify-center font-bold text-sm">
                5
              </div>
              <h3 className="font-serif text-base font-bold text-neutral-950">
                Redirection (by John Godley)
              </h3>
              <p className="text-xs text-neutral-600 leading-relaxed">
                Tracks 404 errors, handles 301 redirects when city slugs change, and prevents broken links from hurting your domain authority.
              </p>
              <div className="text-[11px] text-emerald-900 font-bold bg-emerald-100 p-2 rounded-lg">
                Recommended for: 301 Redirects & 404 Prevention
              </div>
            </div>

            {/* Tool 6 */}
            <div className="bg-neutral-50 rounded-2xl p-5 border border-neutral-200 space-y-3 shadow-2xs">
              <div className="w-10 h-10 rounded-xl bg-emerald-900 text-amber-300 flex items-center justify-center font-bold text-sm">
                6
              </div>
              <h3 className="font-serif text-base font-bold text-neutral-950">
                Google Site Kit
              </h3>
              <p className="text-xs text-neutral-600 leading-relaxed">
                Official Google plugin connecting Google Search Console, Google Analytics 4, and PageSpeed Insights directly inside your control dashboard.
              </p>
              <div className="text-[11px] text-emerald-900 font-bold bg-emerald-100 p-2 rounded-lg">
                Recommended for: Official Search Console Telemetry
              </div>
            </div>

          </div>

          {/* On-Page SEO Checklist Active in this Codebase */}
          <div className="bg-neutral-900 text-white rounded-2xl p-6 sm:p-8 space-y-6">
            <h3 className="font-serif text-xl font-bold text-white flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-400" />
              <span>Built-in On-Page SEO Architecture Already Configured</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-xs text-neutral-300">
              <div className="p-3 bg-neutral-800 rounded-xl space-y-1">
                <strong className="text-amber-300 block font-semibold">1. Dynamic Canonical URLs:</strong>
                <span>Every city and commercial page sets {`<link rel="canonical">`} automatically to prevent duplicate content penalties.</span>
              </div>

              <div className="p-3 bg-neutral-800 rounded-xl space-y-1">
                <strong className="text-amber-300 block font-semibold">2. JSON-LD Structured Data:</strong>
                <span>Embedded WholesaleStore, FAQPage, BreadcrumbList, and Product schemas validate cleanly in Google Rich Results Test.</span>
              </div>

              <div className="p-3 bg-neutral-800 rounded-xl space-y-1">
                <strong className="text-amber-300 block font-semibold">3. Geo-Targeting & Local SEO:</strong>
                <span>Nankana Sahib & Bucheki coordinates (31.3117° N, 73.6936° E) embedded in meta tags and schema.</span>
              </div>

              <div className="p-3 bg-neutral-800 rounded-xl space-y-1">
                <strong className="text-amber-300 block font-semibold">4. OpenGraph & Social Cards:</strong>
                <span>High-resolution 1200x630px OG images and Twitter summary cards set for WhatsApp and Facebook link sharing.</span>
              </div>

              <div className="p-3 bg-neutral-800 rounded-xl space-y-1">
                <strong className="text-amber-300 block font-semibold">5. Valid XML Sitemap:</strong>
                <span>Clean {`<urlset>`} schema with lastmod dates and priorities ready for Google Search Console submission.</span>
              </div>

              <div className="p-3 bg-neutral-800 rounded-xl space-y-1">
                <strong className="text-amber-300 block font-semibold">6. High-Contrast Accessible UI:</strong>
                <span>100% Mobile responsive viewport, WCAG AA color contrast, and fast layout rendering.</span>
              </div>
            </div>
          </div>

        </div>
      )}

      {/* Global Google Business Map for Sitemap Page */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-14 pt-6">
        <GoogleBusinessMap
          cityName="Bucheki"
          province="Punjab"
          customHeading="Sitemap Verified Geo-Coordinates: Noor Galla Mandi Bucheki"
          customSubheading="Physical trading headquarters indexing all 60+ Pakistan city freight corridors"
          height="300px"
          showDetailsGrid={true}
        />
      </div>

    </div>
  );
};
