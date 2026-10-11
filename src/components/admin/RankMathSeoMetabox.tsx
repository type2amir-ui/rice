import React, { useState } from 'react';
import {
  Globe,
  Sparkles,
  Search,
  CheckCircle2,
  AlertCircle,
  Smartphone,
  Monitor,
  Share2,
  Code2,
  Check,
  HelpCircle,
  ExternalLink,
  Layers
} from 'lucide-react';

export interface SeoData {
  seoTitle?: string;
  metaDescription?: string;
  focusKeyword?: string;
  canonicalUrl?: string;
  schemaType?: 'WebPage' | 'Article' | 'Product' | 'LocalBusiness' | 'FAQPage';
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
  robotsIndex?: boolean;
}

interface RankMathSeoMetaboxProps {
  seoData: SeoData;
  onChange: (updated: SeoData) => void;
  pageTitle: string;
  pageSlug: string;
  pageContent?: string;
  siteName?: string;
}

export const RankMathSeoMetabox: React.FC<RankMathSeoMetaboxProps> = ({
  seoData,
  onChange,
  pageTitle,
  pageSlug,
  pageContent = '',
  siteName = 'Hashir Rice Supplier Pakistan',
}) => {
  const [activeTab, setActiveTab] = useState<'general' | 'social' | 'schema' | 'advanced'>('general');
  const [previewDevice, setPreviewDevice] = useState<'mobile' | 'desktop'>('desktop');
  const [copiedLink, setCopiedLink] = useState(false);

  const focusKeyword = (seoData.focusKeyword || '').trim().toLowerCase();
  const effectiveTitle = seoData.seoTitle || (pageTitle ? `${pageTitle} | ${siteName}` : `Wholesale Rice Supplier | ${siteName}`);
  const effectiveDesc = seoData.metaDescription || 'Direct ex-mill wholesale rice supplier in Punjab Mandis (Bucheki, Hafizabad). 1121 Kainat Steam, Sella, and Super Kernel Basmati with lab testing & nationwide bilty.';
  const effectiveSlug = pageSlug || 'page-slug';
  const effectiveUrl = `https://hasricesupplier.com/${effectiveSlug.replace(/^\//, '')}`;

  // Title & Desc character counters & statuses
  const titleLen = effectiveTitle.length;
  const descLen = effectiveDesc.length;

  const isTitleGood = titleLen >= 40 && titleLen <= 65;
  const isDescGood = descLen >= 120 && descLen <= 160;

  // Real-time Rank Math SEO Score Calculation
  const calculateScore = () => {
    let score = 50; // base score

    if (!focusKeyword) {
      if (titleLen > 30) score += 10;
      if (descLen > 80) score += 10;
      return Math.min(score, 70);
    }

    const kw = focusKeyword.toLowerCase();
    const titleLower = effectiveTitle.toLowerCase();
    const descLower = effectiveDesc.toLowerCase();
    const slugLower = effectiveSlug.toLowerCase();
    const contentLower = pageContent.toLowerCase();

    // 1. Keyword in SEO Title (+15)
    if (titleLower.includes(kw)) score += 15;

    // 2. Keyword near beginning of title (+5)
    if (titleLower.indexOf(kw) < 25 && titleLower.includes(kw)) score += 5;

    // 3. Keyword in Meta Description (+15)
    if (descLower.includes(kw)) score += 15;

    // 4. Keyword in URL permalink (+10)
    if (slugLower.includes(kw.replace(/\s+/g, '-')) || slugLower.includes(kw.replace(/\s+/g, ''))) score += 10;

    // 5. Keyword in content (+10)
    if (contentLower.includes(kw)) score += 10;

    // 6. Good title length (+5)
    if (isTitleGood) score += 5;

    // 7. Good description length (+5)
    if (isDescGood) score += 5;

    return Math.min(score, 100);
  };

  const seoScore = calculateScore();
  const getScoreBadgeColor = (s: number) => {
    if (s >= 80) return 'bg-emerald-100 text-emerald-800 border-emerald-300';
    if (s >= 60) return 'bg-amber-100 text-amber-800 border-amber-300';
    return 'bg-rose-100 text-rose-800 border-rose-300';
  };

  const kw = focusKeyword;
  const hasKwInTitle = kw ? effectiveTitle.toLowerCase().includes(kw) : false;
  const hasKwInDesc = kw ? effectiveDesc.toLowerCase().includes(kw) : false;
  const hasKwInUrl = kw ? effectiveSlug.toLowerCase().includes(kw.replace(/\s+/g, '-')) : false;

  return (
    <div className="bg-white border border-[#c3c4c7] rounded-lg shadow-xs overflow-hidden">
      {/* Rank Math Header Bar */}
      <div className="bg-[#1d2327] text-white px-4 py-3 flex flex-wrap items-center justify-between gap-3 border-b border-[#3c434a]">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded bg-gradient-to-tr from-emerald-600 to-teal-500 text-white flex items-center justify-center font-black text-xs shadow-xs">
            RM
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-sm text-white font-serif">Rank Math & Yoast SEO Suite</span>
              <span className="text-[10px] uppercase font-mono px-1.5 py-0.2 rounded bg-emerald-950 text-emerald-300 border border-emerald-800">
                PRO Mandi Edition
              </span>
            </div>
            <p className="text-[10px] text-neutral-400">On-Page Meta Tags, Google SERP Snippet & Schema Markup</p>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <div className="text-right hidden sm:block">
            <span className="text-[10px] text-neutral-400 block uppercase tracking-wider font-bold">SEO Score</span>
          </div>
          <div className={`px-3 py-1 rounded-full text-xs font-black border flex items-center gap-1.5 shadow-xs ${getScoreBadgeColor(seoScore)}`}>
            <Sparkles className="w-3.5 h-3.5" />
            <span>{seoScore} / 100</span>
          </div>
        </div>
      </div>

      {/* Navigation Subtabs */}
      <div className="bg-[#f0f0f1] px-4 pt-2 border-b border-[#dcdcde] flex items-center gap-2 text-xs font-semibold overflow-x-auto">
        <button
          type="button"
          onClick={() => setActiveTab('general')}
          className={`pb-2 px-3 border-b-2 transition-colors cursor-pointer flex items-center gap-1.5 ${
            activeTab === 'general' ? 'border-[#2271b1] text-[#2271b1] font-bold bg-white rounded-t' : 'border-transparent text-[#50575e] hover:text-[#1d2327]'
          }`}
        >
          <Search className="w-3.5 h-3.5" />
          <span>General & Meta</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('social')}
          className={`pb-2 px-3 border-b-2 transition-colors cursor-pointer flex items-center gap-1.5 ${
            activeTab === 'social' ? 'border-[#2271b1] text-[#2271b1] font-bold bg-white rounded-t' : 'border-transparent text-[#50575e] hover:text-[#1d2327]'
          }`}
        >
          <Share2 className="w-3.5 h-3.5" />
          <span>Social (Facebook / Twitter)</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('schema')}
          className={`pb-2 px-3 border-b-2 transition-colors cursor-pointer flex items-center gap-1.5 ${
            activeTab === 'schema' ? 'border-[#2271b1] text-[#2271b1] font-bold bg-white rounded-t' : 'border-transparent text-[#50575e] hover:text-[#1d2327]'
          }`}
        >
          <Code2 className="w-3.5 h-3.5" />
          <span>Schema & Rich Snippets</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('advanced')}
          className={`pb-2 px-3 border-b-2 transition-colors cursor-pointer flex items-center gap-1.5 ${
            activeTab === 'advanced' ? 'border-[#2271b1] text-[#2271b1] font-bold bg-white rounded-t' : 'border-transparent text-[#50575e] hover:text-[#1d2327]'
          }`}
        >
          <Layers className="w-3.5 h-3.5" />
          <span>Advanced / Robots</span>
        </button>
      </div>

      {/* Tab Body */}
      <div className="p-5 space-y-5 text-xs">
        {activeTab === 'general' && (
          <div className="space-y-4">
            {/* Focus Keyword */}
            <div className="p-3 bg-neutral-50 rounded-lg border border-neutral-200">
              <div className="flex items-center justify-between mb-1">
                <label className="font-bold text-[#1d2327] flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-emerald-700" />
                  <span>Focus Keyword / کلیدی لفظ</span>
                </label>
                <span className="text-[10px] text-[#646970]">e.g. 1121 Kainat, Rice Supplier, Basmati Mandi</span>
              </div>
              <input
                type="text"
                value={seoData.focusKeyword || ''}
                onChange={(e) => onChange({ ...seoData, focusKeyword: e.target.value })}
                placeholder="Enter primary target keyword (e.g. 1121 Kainat Sella Rice Supplier)"
                className="w-full px-3 py-2 bg-white border border-[#8c8f94] rounded text-xs focus:border-[#2271b1] outline-none font-medium text-neutral-900"
              />
              <p className="text-[11px] text-[#646970] mt-1">
                Rank Math evaluates this keyword inside your SEO title, meta description, URL slug, and body text.
              </p>
            </div>

            {/* Google SERP Snippet Preview Box */}
            <div className="bg-[#f8fafc] border border-[#e2e8f0] rounded-xl p-4 space-y-3">
              <div className="flex items-center justify-between border-b border-[#e2e8f0] pb-2">
                <div className="flex items-center gap-1.5 text-[11px] font-bold text-[#475569] uppercase tracking-wide">
                  <Globe className="w-3.5 h-3.5 text-emerald-700" />
                  <span>Google Search SERP Preview Simulator</span>
                </div>
                <div className="flex items-center gap-1 bg-white border border-[#cbd5e1] rounded p-0.5">
                  <button
                    type="button"
                    onClick={() => setPreviewDevice('desktop')}
                    className={`px-2 py-0.5 rounded text-[10px] font-semibold flex items-center gap-1 transition-colors ${
                      previewDevice === 'desktop' ? 'bg-[#2271b1] text-white' : 'text-[#64748b] hover:text-[#1e293b]'
                    }`}
                  >
                    <Monitor className="w-3 h-3" />
                    <span>Desktop</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setPreviewDevice('mobile')}
                    className={`px-2 py-0.5 rounded text-[10px] font-semibold flex items-center gap-1 transition-colors ${
                      previewDevice === 'mobile' ? 'bg-[#2271b1] text-white' : 'text-[#64748b] hover:text-[#1e293b]'
                    }`}
                  >
                    <Smartphone className="w-3 h-3" />
                    <span>Mobile</span>
                  </button>
                </div>
              </div>

              {/* SERP Rendering */}
              <div className={`p-4 bg-white rounded-lg border border-[#e2e8f0] shadow-2xs font-sans ${previewDevice === 'mobile' ? 'max-w-md mx-auto' : 'w-full'}`}>
                <div className="flex items-center gap-2 mb-1">
                  <div className="w-4 h-4 rounded-full bg-emerald-800 text-white flex items-center justify-center text-[9px] font-bold">
                    🌾
                  </div>
                  <div className="leading-none">
                    <span className="text-[11px] text-[#202124] block font-medium">Hashir Rice Supplier Pakistan</span>
                    <span className="text-[10px] text-[#4d5156] block truncate font-mono">{effectiveUrl}</span>
                  </div>
                </div>

                <h4 className="text-base text-[#1a0dab] font-medium leading-snug hover:underline cursor-pointer line-clamp-2 mt-1">
                  {effectiveTitle}
                </h4>

                <p className="text-xs text-[#4d5156] mt-1 leading-relaxed line-clamp-2">
                  {effectiveDesc}
                </p>
              </div>
            </div>

            {/* SEO Title Input */}
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <label className="font-bold text-[#1d2327]">
                  Meta Title Tag (Google Title) *
                </label>
                <div className="flex items-center gap-2">
                  <span className={`text-[11px] font-bold ${titleLen > 65 ? 'text-amber-600' : titleLen >= 40 ? 'text-emerald-700' : 'text-neutral-500'}`}>
                    {titleLen} / 60 characters
                  </span>
                  <span className={`w-2 h-2 rounded-full ${isTitleGood ? 'bg-emerald-500' : 'bg-amber-400'}`}></span>
                </div>
              </div>
              <input
                type="text"
                value={seoData.seoTitle || ''}
                onChange={(e) => onChange({ ...seoData, seoTitle: e.target.value })}
                placeholder={pageTitle ? `${pageTitle} | ${siteName}` : 'e.g. 1121 Kainat Steam Rice Supplier Pakistan | Ex-Mill Bucheki'}
                className="w-full px-3 py-2 bg-white border border-[#8c8f94] rounded text-xs focus:border-[#2271b1] outline-none font-medium"
              />
              <div className="w-full bg-neutral-200 h-1.5 rounded-full overflow-hidden mt-1">
                <div
                  className={`h-full transition-all ${
                    titleLen > 65 ? 'bg-amber-500' : titleLen >= 40 ? 'bg-emerald-600' : 'bg-blue-500'
                  }`}
                  style={{ width: `${Math.min((titleLen / 60) * 100, 100)}%` }}
                ></div>
              </div>
              <p className="text-[11px] text-[#646970]">
                Recommended length: 50-60 characters. Keep high-intent keywords like &quot;Wholesale&quot;, &quot;Rice Supplier&quot;, and &quot;Pakistan&quot; near the start.
              </p>
            </div>

            {/* Meta Description Input */}
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <label className="font-bold text-[#1d2327]">
                  Meta Description (Google Snippet) *
                </label>
                <div className="flex items-center gap-2">
                  <span className={`text-[11px] font-bold ${descLen > 160 ? 'text-amber-600' : descLen >= 120 ? 'text-emerald-700' : 'text-neutral-500'}`}>
                    {descLen} / 160 characters
                  </span>
                  <span className={`w-2 h-2 rounded-full ${isDescGood ? 'bg-emerald-500' : 'bg-amber-400'}`}></span>
                </div>
              </div>
              <textarea
                rows={3}
                value={seoData.metaDescription || ''}
                onChange={(e) => onChange({ ...seoData, metaDescription: e.target.value })}
                placeholder="Direct wholesale rice supplier at Noor Galla Mandi, Bucheki. Premium 1121 Kainat, Sella & Super Kernel Basmati. Request Free Sample & live ex-mill bilty rates."
                className="w-full px-3 py-2 bg-white border border-[#8c8f94] rounded text-xs focus:border-[#2271b1] outline-none font-medium resize-none leading-relaxed"
              />
              <div className="w-full bg-neutral-200 h-1.5 rounded-full overflow-hidden mt-1">
                <div
                  className={`h-full transition-all ${
                    descLen > 160 ? 'bg-amber-500' : descLen >= 120 ? 'bg-emerald-600' : 'bg-blue-500'
                  }`}
                  style={{ width: `${Math.min((descLen / 160) * 100, 100)}%` }}
                ></div>
              </div>
              <p className="text-[11px] text-[#646970]">
                Recommended length: 130-160 characters. Summarize the page content and encourage buyers to click.
              </p>
            </div>

            {/* Live SEO Checklist */}
            <div className="bg-[#f0f9ff] border border-[#bae6fd] rounded-lg p-3.5 space-y-2">
              <span className="font-bold text-[#0369a1] text-xs uppercase tracking-wide block">
                Rank Math SEO Audit Checklist
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px]">
                <div className="flex items-center gap-1.5">
                  {hasKwInTitle ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" /> : <AlertCircle className="w-3.5 h-3.5 text-amber-500 shrink-0" />}
                  <span className={hasKwInTitle ? 'text-emerald-900 font-semibold' : 'text-neutral-600'}>
                    Focus Keyword in SEO Title
                  </span>
                </div>

                <div className="flex items-center gap-1.5">
                  {hasKwInDesc ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" /> : <AlertCircle className="w-3.5 h-3.5 text-amber-500 shrink-0" />}
                  <span className={hasKwInDesc ? 'text-emerald-900 font-semibold' : 'text-neutral-600'}>
                    Focus Keyword in Meta Description
                  </span>
                </div>

                <div className="flex items-center gap-1.5">
                  {hasKwInUrl ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" /> : <AlertCircle className="w-3.5 h-3.5 text-amber-500 shrink-0" />}
                  <span className={hasKwInUrl ? 'text-emerald-900 font-semibold' : 'text-neutral-600'}>
                    Focus Keyword in URL Permastructure
                  </span>
                </div>

                <div className="flex items-center gap-1.5">
                  {isTitleGood ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" /> : <AlertCircle className="w-3.5 h-3.5 text-amber-500 shrink-0" />}
                  <span className={isTitleGood ? 'text-emerald-900 font-semibold' : 'text-neutral-600'}>
                    Title length between 40-65 chars
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'social' && (
          <div className="space-y-4">
            <p className="text-[#646970] text-[11px]">
              Customize how this page looks when shared on WhatsApp, Facebook, LinkedIn, and Twitter.
            </p>

            <div>
              <label className="block font-semibold text-[#1d2327] mb-1">OpenGraph / Social Title</label>
              <input
                type="text"
                value={seoData.ogTitle || ''}
                onChange={(e) => onChange({ ...seoData, ogTitle: e.target.value })}
                placeholder={effectiveTitle}
                className="w-full px-3 py-2 bg-white border border-[#8c8f94] rounded text-xs focus:border-[#2271b1] outline-none"
              />
            </div>

            <div>
              <label className="block font-semibold text-[#1d2327] mb-1">Social Description</label>
              <textarea
                rows={2}
                value={seoData.ogDescription || ''}
                onChange={(e) => onChange({ ...seoData, ogDescription: e.target.value })}
                placeholder={effectiveDesc}
                className="w-full px-3 py-2 bg-white border border-[#8c8f94] rounded text-xs focus:border-[#2271b1] outline-none resize-none"
              />
            </div>

            <div>
              <label className="block font-semibold text-[#1d2327] mb-1">Social Share Image URL (1200x630)</label>
              <input
                type="url"
                value={seoData.ogImage || ''}
                onChange={(e) => onChange({ ...seoData, ogImage: e.target.value })}
                placeholder="https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&q=80&w=1200"
                className="w-full px-3 py-2 bg-white border border-[#8c8f94] rounded text-xs focus:border-[#2271b1] outline-none"
              />
            </div>
          </div>
        )}

        {activeTab === 'schema' && (
          <div className="space-y-4">
            <div>
              <label className="block font-semibold text-[#1d2327] mb-1">Schema Type for Google Rich Results</label>
              <select
                value={seoData.schemaType || 'WebPage'}
                onChange={(e) => onChange({ ...seoData, schemaType: e.target.value as any })}
                className="w-full px-3 py-2 bg-white border border-[#8c8f94] rounded text-xs focus:border-[#2271b1] outline-none"
              >
                <option value="WebPage">WebPage (General Commercial Page)</option>
                <option value="Article">Article / News / Blog Post</option>
                <option value="Product">Product / Wholesale Rice Consignment</option>
                <option value="LocalBusiness">LocalBusiness (Mandi Wholesale Store)</option>
                <option value="FAQPage">FAQPage (Frequently Asked Questions)</option>
              </select>
              <p className="text-[11px] text-[#646970] mt-1">
                Generates valid Schema.org JSON-LD microdata for Google Search Knowledge Panels & AI Overviews.
              </p>
            </div>

            <div className="p-3 bg-neutral-900 text-emerald-400 font-mono text-[11px] rounded-lg overflow-x-auto">
              <span className="text-neutral-400 block mb-1">// Generated JSON-LD Preview</span>
              <pre>{`{
  "@context": "https://schema.org",
  "@type": "${seoData.schemaType || 'WebPage'}",
  "name": "${effectiveTitle.replace(/"/g, '\\"')}",
  "description": "${effectiveDesc.replace(/"/g, '\\"')}",
  "url": "${effectiveUrl}"
}`}</pre>
            </div>
          </div>
        )}

        {activeTab === 'advanced' && (
          <div className="space-y-4">
            <div>
              <label className="block font-semibold text-[#1d2327] mb-1">Canonical URL</label>
              <input
                type="url"
                value={seoData.canonicalUrl || ''}
                onChange={(e) => onChange({ ...seoData, canonicalUrl: e.target.value })}
                placeholder={effectiveUrl}
                className="w-full px-3 py-2 bg-white border border-[#8c8f94] rounded text-xs focus:border-[#2271b1] outline-none"
              />
              <p className="text-[11px] text-[#646970] mt-1">
                Specify canonical URL to prevent duplicate content penalties on Google.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="robotsIndex"
                checked={seoData.robotsIndex !== false}
                onChange={(e) => onChange({ ...seoData, robotsIndex: e.target.checked })}
                className="w-4 h-4 text-[#2271b1] rounded border-neutral-300 focus:ring-0 cursor-pointer"
              />
              <label htmlFor="robotsIndex" className="font-semibold text-[#1d2327] cursor-pointer">
                Index this page in Google Search (robots: index, follow)
              </label>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
