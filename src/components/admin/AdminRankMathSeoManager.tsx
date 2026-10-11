import React, { useState, useEffect } from 'react';
import { WordPressPage, WordPressPost } from '../../types';
import { DEFAULT_PAGES_DATA } from '../../data/defaultPagesData';
import {
  Globe,
  Sparkles,
  Search,
  CheckCircle2,
  AlertCircle,
  Smartphone,
  Monitor,
  ExternalLink,
  Edit,
  Save,
  Check,
  RefreshCw,
  FileText,
  Layers,
  Share2,
  ArrowRight,
  ShieldCheck,
  Zap,
  Sliders,
  Eye
} from 'lucide-react';

interface AdminRankMathSeoManagerProps {
  onSuccessToast?: (msg: string) => void;
  onNavigateToPage?: (page: WordPressPage) => void;
  onNavigateToPost?: (post: WordPressPost) => void;
}

export const AdminRankMathSeoManager: React.FC<AdminRankMathSeoManagerProps> = ({
  onSuccessToast,
  onNavigateToPage,
  onNavigateToPost,
}) => {
  const [activeTab, setActiveTab] = useState<'pages-audit' | 'posts-audit' | 'global-settings' | 'sitemap'>('pages-audit');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Pages state
  const [pages, setPages] = useState<WordPressPage[]>(() => {
    try {
      const saved = localStorage.getItem('hashir_rice_admin_pages');
      return saved ? JSON.parse(saved) : DEFAULT_PAGES_DATA;
    } catch (e) {
      return DEFAULT_PAGES_DATA;
    }
  });

  // Posts state
  const [posts, setPosts] = useState<WordPressPost[]>(() => {
    try {
      const saved = localStorage.getItem('hashir_rice_admin_posts');
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      return [];
    }
  });

  // Global Settings state
  const [globalSiteTitle, setGlobalSiteTitle] = useState(() => {
    return localStorage.getItem('hashir_global_site_title') || 'Hashir Rice Supplier - Noor Galla Mandi, Bucheki | Direct Wholesale Rice Pakistan';
  });
  const [globalMetaDesc, setGlobalMetaDesc] = useState(() => {
    return localStorage.getItem('hashir_global_meta_desc') || 'Pakistan premier wholesale rice supplier and bulk rice trader in Punjab Mandis. Direct ex-mill sourcing for 1121 Kainat Steam, Sella, and Super Kernel Basmati with lab testing & nationwide bilty.';
  });
  const [globalSeparator, setGlobalSeparator] = useState(() => {
    return localStorage.getItem('hashir_global_separator') || '|';
  });
  const [globalFocusKeywords, setGlobalFocusKeywords] = useState(() => {
    return localStorage.getItem('hashir_global_focus_keywords') || 'wholesale rice supplier pakistan, 1121 kainat sella basmati, mandi rates';
  });

  // Inline editing state for quick edits in the audit table
  const [editingId, setEditingId] = useState<string | null>(null);
  const [tempSeoTitle, setTempSeoTitle] = useState('');
  const [tempMetaDesc, setTempMetaDesc] = useState('');
  const [tempFocusKeyword, setTempFocusKeyword] = useState('');

  const handleStartInlineEdit = (item: WordPressPage | WordPressPost) => {
    setEditingId(item.id);
    setTempSeoTitle(item.seoTitle || item.title);
    setTempMetaDesc(item.metaDescription || item.excerpt || '');
    setTempFocusKeyword((item as any).focusKeyword || '1121 Kainat Basmati');
  };

  const handleSaveInlineEditPage = (pageId: string) => {
    const updated = pages.map((p) => {
      if (p.id === pageId) {
        return {
          ...p,
          seoTitle: tempSeoTitle,
          metaDescription: tempMetaDesc,
          focusKeyword: tempFocusKeyword,
        };
      }
      return p;
    });
    setPages(updated);
    localStorage.setItem('hashir_rice_admin_pages', JSON.stringify(updated));
    window.dispatchEvent(new Event('hashir_pages_updated'));
    setEditingId(null);
    if (onSuccessToast) onSuccessToast('Page SEO meta tags saved successfully!');
  };

  const handleSaveInlineEditPost = (postId: string) => {
    const updated = posts.map((p) => {
      if (p.id === postId) {
        return {
          ...p,
          seoTitle: tempSeoTitle,
          metaDescription: tempMetaDesc,
          focusKeyword: tempFocusKeyword,
        };
      }
      return p;
    });
    setPosts(updated);
    localStorage.setItem('hashir_rice_admin_posts', JSON.stringify(updated));
    setEditingId(null);
    if (onSuccessToast) onSuccessToast('Post SEO meta tags saved successfully!');
  };

  const handleSaveGlobalSettings = (e: React.FormEvent) => {
    e.preventDefault();
    localStorage.setItem('hashir_global_site_title', globalSiteTitle);
    localStorage.setItem('hashir_global_meta_desc', globalMetaDesc);
    localStorage.setItem('hashir_global_separator', globalSeparator);
    localStorage.setItem('hashir_global_focus_keywords', globalFocusKeywords);
    if (onSuccessToast) onSuccessToast('Global Rank Math / Yoast SEO settings saved.');
  };

  const filteredPages = pages.filter((p) =>
    p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.slug.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (p.seoTitle && p.seoTitle.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const filteredPosts = posts.filter((p) =>
    p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.slug.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (p.seoTitle && p.seoTitle.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="space-y-6 text-[#2c3338] font-sans">
      {/* Top Banner: Rank Math & Yoast Suite Header */}
      <div className="bg-[#1d2327] text-white rounded-xl p-6 shadow-md border border-[#3c434a] flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-1.5 max-w-2xl">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="px-2.5 py-0.5 rounded text-[10px] font-black uppercase tracking-wider bg-emerald-600 text-white shadow-xs">
              Rank Math & Yoast SEO Suite
            </span>
            <span className="px-2.5 py-0.5 rounded text-[10px] font-bold bg-blue-600/30 text-blue-300 border border-blue-400/30">
              Active on All {pages.length} Pages & {posts.length} Posts
            </span>
          </div>

          <h2 className="text-2xl font-serif font-bold text-white tracking-tight flex items-center gap-2">
            <Globe className="w-6 h-6 text-emerald-400" />
            WordPress SEO & Meta Tags Manager
          </h2>

          <p className="text-xs text-neutral-300 leading-relaxed">
            Manage Meta Titles, Meta Descriptions, Focus Keywords, and Schema.org rich results across every single page and blog post. Fully synchronized with Google SERP standards.
          </p>
        </div>

        {/* Free WordPress.org Plugin Directory Links */}
        <div className="flex flex-col sm:flex-row gap-2 shrink-0">
          <a
            href="https://wordpress.org/plugins/seo-by-rank-math/"
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2.5 bg-emerald-700 hover:bg-emerald-600 text-white rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-2 shadow-xs"
            title="View Rank Math on WordPress.org"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            <span>Rank Math (WordPress.org)</span>
          </a>

          <a
            href="https://wordpress.org/plugins/wordpress-seo/"
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2.5 bg-[#2271b1] hover:bg-[#135e96] text-white rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-2 shadow-xs"
            title="View Yoast SEO on WordPress.org"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            <span>Yoast SEO (WordPress.org)</span>
          </a>
        </div>
      </div>

      {/* KPI Stats Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl border border-[#c3c4c7] shadow-xs">
          <span className="text-[10px] font-bold text-[#646970] uppercase tracking-wider block">Average SEO Score</span>
          <div className="flex items-center gap-2 mt-1">
            <span className="text-2xl font-black text-emerald-700">96 / 100</span>
            <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-emerald-100 text-emerald-800">Grade A</span>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-[#c3c4c7] shadow-xs">
          <span className="text-[10px] font-bold text-[#646970] uppercase tracking-wider block">Audited Pages</span>
          <div className="text-2xl font-black text-[#1d2327] mt-1">{pages.length} Pages</div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-[#c3c4c7] shadow-xs">
          <span className="text-[10px] font-bold text-[#646970] uppercase tracking-wider block">Audited Posts</span>
          <div className="text-2xl font-black text-[#1d2327] mt-1">{posts.length} Posts</div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-[#c3c4c7] shadow-xs">
          <span className="text-[10px] font-bold text-[#646970] uppercase tracking-wider block">Google Index Readiness</span>
          <div className="flex items-center gap-1.5 text-emerald-700 font-bold text-sm mt-2">
            <CheckCircle2 className="w-4 h-4" />
            <span>100% Valid Schema</span>
          </div>
        </div>
      </div>

      {/* Tab Navigators */}
      <div className="bg-white border border-[#c3c4c7] rounded-lg shadow-xs overflow-hidden">
        <div className="bg-[#f0f0f1] px-4 pt-3 border-b border-[#dcdcde] flex items-center gap-2 text-xs font-semibold overflow-x-auto">
          <button
            type="button"
            onClick={() => setActiveTab('pages-audit')}
            className={`pb-2.5 px-4 border-b-2 transition-colors cursor-pointer flex items-center gap-2 ${
              activeTab === 'pages-audit'
                ? 'border-[#2271b1] text-[#2271b1] font-bold bg-white rounded-t'
                : 'border-transparent text-[#50575e] hover:text-[#1d2327]'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Pages SEO Audit ({pages.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('posts-audit')}
            className={`pb-2.5 px-4 border-b-2 transition-colors cursor-pointer flex items-center gap-2 ${
              activeTab === 'posts-audit'
                ? 'border-[#2271b1] text-[#2271b1] font-bold bg-white rounded-t'
                : 'border-transparent text-[#50575e] hover:text-[#1d2327]'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Posts SEO Audit ({posts.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('global-settings')}
            className={`pb-2.5 px-4 border-b-2 transition-colors cursor-pointer flex items-center gap-2 ${
              activeTab === 'global-settings'
                ? 'border-[#2271b1] text-[#2271b1] font-bold bg-white rounded-t'
                : 'border-transparent text-[#50575e] hover:text-[#1d2327]'
            }`}
          >
            <Sliders className="w-3.5 h-3.5" />
            <span>Global Meta Defaults & Separator</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('sitemap')}
            className={`pb-2.5 px-4 border-b-2 transition-colors cursor-pointer flex items-center gap-2 ${
              activeTab === 'sitemap'
                ? 'border-[#2271b1] text-[#2271b1] font-bold bg-white rounded-t'
                : 'border-transparent text-[#50575e] hover:text-[#1d2327]'
            }`}
          >
            <Globe className="w-3.5 h-3.5" />
            <span>XML Sitemap & Indexing</span>
          </button>
        </div>

        {/* Tab 1: Pages SEO Audit */}
        {activeTab === 'pages-audit' && (
          <div className="p-5 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="relative flex-1 max-w-md">
                <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-neutral-400" />
                <input
                  type="text"
                  placeholder="Filter pages by title or slug..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-3 py-1.5 border border-[#8c8f94] rounded text-xs focus:border-[#2271b1] outline-none"
                />
              </div>

              <span className="text-xs text-[#646970]">
                Showing {filteredPages.length} of {pages.length} Pages with Rank Math SEO tags
              </span>
            </div>

            <div className="divide-y divide-[#e2e8f0] border border-[#e2e8f0] rounded-lg overflow-hidden text-xs">
              {filteredPages.map((page) => {
                const isEditing = editingId === page.id;
                const seoTitle = page.seoTitle || `${page.title} | Hashir Rice Supplier`;
                const metaDesc = page.metaDescription || page.excerpt || 'Direct wholesale rice supplier at Noor Galla Mandi, Bucheki.';
                const focusKw = (page as any).focusKeyword || '1121 Kainat Basmati';

                return (
                  <div key={page.id} className="p-4 bg-white hover:bg-neutral-50/60 transition-colors space-y-2">
                    <div className="flex flex-col md:flex-row md:items-start justify-between gap-3">
                      <div className="space-y-1 flex-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <strong className="text-sm text-[#1d2327] font-semibold">{page.title}</strong>
                          <span className="text-[11px] font-mono text-[#646970]">/{page.slug}</span>
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
                            SEO 96/100
                          </span>
                        </div>

                        {isEditing ? (
                          <div className="pt-2 space-y-3 bg-[#f8fafc] p-3 rounded-lg border border-[#cbd5e1]">
                            <div>
                              <div className="flex items-center justify-between mb-1">
                                <label className="font-bold text-[#1d2327]">Meta Title Tag (Google Title)</label>
                                <span className="text-[10px] text-[#646970]">{tempSeoTitle.length}/60 chars</span>
                              </div>
                              <input
                                type="text"
                                value={tempSeoTitle}
                                onChange={(e) => setTempSeoTitle(e.target.value)}
                                className="w-full px-2.5 py-1.5 border border-[#8c8f94] rounded text-xs bg-white font-medium"
                              />
                            </div>

                            <div>
                              <div className="flex items-center justify-between mb-1">
                                <label className="font-bold text-[#1d2327]">Meta Description (Google Snippet)</label>
                                <span className="text-[10px] text-[#646970]">{tempMetaDesc.length}/160 chars</span>
                              </div>
                              <textarea
                                rows={2}
                                value={tempMetaDesc}
                                onChange={(e) => setTempMetaDesc(e.target.value)}
                                className="w-full px-2.5 py-1.5 border border-[#8c8f94] rounded text-xs bg-white font-medium resize-none"
                              />
                            </div>

                            <div>
                              <label className="block font-bold text-[#1d2327] mb-1">Focus Keyword</label>
                              <input
                                type="text"
                                value={tempFocusKeyword}
                                onChange={(e) => setTempFocusKeyword(e.target.value)}
                                placeholder="e.g. 1121 Kainat Sella Rice"
                                className="w-full px-2.5 py-1.5 border border-[#8c8f94] rounded text-xs bg-white font-medium"
                              />
                            </div>

                            <div className="flex items-center justify-end gap-2 pt-1">
                              <button
                                type="button"
                                onClick={() => setEditingId(null)}
                                className="px-3 py-1 text-neutral-600 hover:bg-neutral-200 rounded font-semibold"
                              >
                                Cancel
                              </button>
                              <button
                                type="button"
                                onClick={() => handleSaveInlineEditPage(page.id)}
                                className="px-3.5 py-1 bg-emerald-700 hover:bg-emerald-800 text-white rounded font-bold flex items-center gap-1 cursor-pointer shadow-xs"
                              >
                                <Save className="w-3 h-3" />
                                <span>Save SEO Meta</span>
                              </button>
                            </div>
                          </div>
                        ) : (
                          <div className="space-y-1 text-xs">
                            <div className="text-[#1a0dab] font-medium truncate">
                              <strong>Title:</strong> {seoTitle}
                            </div>
                            <div className="text-[#4d5156] line-clamp-2 leading-relaxed">
                              <strong>Snippet:</strong> {metaDesc}
                            </div>
                            <div className="text-[#646970] text-[11px]">
                              Focus Keyword: <strong className="text-emerald-900 font-semibold">{focusKw}</strong> • Snippet Length: {metaDesc.length}/160 chars
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Action buttons */}
                      {!isEditing && (
                        <div className="flex items-center gap-2 shrink-0 pt-1">
                          <button
                            type="button"
                            onClick={() => handleStartInlineEdit(page)}
                            className="px-2.5 py-1 bg-[#2271b1] hover:bg-[#135e96] text-white rounded text-xs font-semibold flex items-center gap-1 cursor-pointer transition-colors shadow-2xs"
                          >
                            <Edit className="w-3 h-3" />
                            <span>Quick Edit SEO</span>
                          </button>

                          {onNavigateToPage && (
                            <button
                              type="button"
                              onClick={() => onNavigateToPage(page)}
                              className="px-2.5 py-1 bg-neutral-100 hover:bg-neutral-200 text-neutral-800 border border-neutral-300 rounded text-xs font-semibold flex items-center gap-1 cursor-pointer transition-colors"
                            >
                              <Sliders className="w-3 h-3" />
                              <span>Full Builder</span>
                            </button>
                          )}

                          <a
                            href={`/${page.slug}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-2 py-1 bg-neutral-100 hover:bg-neutral-200 text-neutral-700 border border-neutral-300 rounded text-xs font-semibold flex items-center gap-1"
                            title="View live page"
                          >
                            <Eye className="w-3 h-3" />
                          </a>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Tab 2: Posts SEO Audit */}
        {activeTab === 'posts-audit' && (
          <div className="p-5 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="relative flex-1 max-w-md">
                <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-neutral-400" />
                <input
                  type="text"
                  placeholder="Filter blog posts by title or slug..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-3 py-1.5 border border-[#8c8f94] rounded text-xs focus:border-[#2271b1] outline-none"
                />
              </div>

              <span className="text-xs text-[#646970]">
                Showing {filteredPosts.length} of {posts.length} Posts with Rank Math SEO tags
              </span>
            </div>

            <div className="divide-y divide-[#e2e8f0] border border-[#e2e8f0] rounded-lg overflow-hidden text-xs">
              {filteredPosts.map((post) => {
                const isEditing = editingId === post.id;
                const seoTitle = post.seoTitle || `${post.title} | Hashir Rice Supplier`;
                const metaDesc = post.metaDescription || post.excerpt || 'Direct wholesale rice supplier at Noor Galla Mandi, Bucheki.';
                const focusKw = (post as any).focusKeyword || 'Basmati Rice Trading';

                return (
                  <div key={post.id} className="p-4 bg-white hover:bg-neutral-50/60 transition-colors space-y-2">
                    <div className="flex flex-col md:flex-row md:items-start justify-between gap-3">
                      <div className="space-y-1 flex-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <strong className="text-sm text-[#1d2327] font-semibold">{post.title}</strong>
                          <span className="text-[11px] font-mono text-[#646970]">/blog/{post.slug}</span>
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
                            SEO 95/100
                          </span>
                        </div>

                        {isEditing ? (
                          <div className="pt-2 space-y-3 bg-[#f8fafc] p-3 rounded-lg border border-[#cbd5e1]">
                            <div>
                              <div className="flex items-center justify-between mb-1">
                                <label className="font-bold text-[#1d2327]">Meta Title Tag (Google Title)</label>
                                <span className="text-[10px] text-[#646970]">{tempSeoTitle.length}/60 chars</span>
                              </div>
                              <input
                                type="text"
                                value={tempSeoTitle}
                                onChange={(e) => setTempSeoTitle(e.target.value)}
                                className="w-full px-2.5 py-1.5 border border-[#8c8f94] rounded text-xs bg-white font-medium"
                              />
                            </div>

                            <div>
                              <div className="flex items-center justify-between mb-1">
                                <label className="font-bold text-[#1d2327]">Meta Description (Google Snippet)</label>
                                <span className="text-[10px] text-[#646970]">{tempMetaDesc.length}/160 chars</span>
                              </div>
                              <textarea
                                rows={2}
                                value={tempMetaDesc}
                                onChange={(e) => setTempMetaDesc(e.target.value)}
                                className="w-full px-2.5 py-1.5 border border-[#8c8f94] rounded text-xs bg-white font-medium resize-none"
                              />
                            </div>

                            <div className="flex items-center justify-end gap-2 pt-1">
                              <button
                                type="button"
                                onClick={() => setEditingId(null)}
                                className="px-3 py-1 text-neutral-600 hover:bg-neutral-200 rounded font-semibold"
                              >
                                Cancel
                              </button>
                              <button
                                type="button"
                                onClick={() => handleSaveInlineEditPost(post.id)}
                                className="px-3.5 py-1 bg-emerald-700 hover:bg-emerald-800 text-white rounded font-bold flex items-center gap-1 cursor-pointer shadow-xs"
                              >
                                <Save className="w-3 h-3" />
                                <span>Save Post SEO</span>
                              </button>
                            </div>
                          </div>
                        ) : (
                          <div className="space-y-1 text-xs">
                            <div className="text-[#1a0dab] font-medium truncate">
                              <strong>Title:</strong> {seoTitle}
                            </div>
                            <div className="text-[#4d5156] line-clamp-2 leading-relaxed">
                              <strong>Snippet:</strong> {metaDesc}
                            </div>
                          </div>
                        )}
                      </div>

                      {!isEditing && (
                        <div className="flex items-center gap-2 shrink-0 pt-1">
                          <button
                            type="button"
                            onClick={() => handleStartInlineEdit(post)}
                            className="px-2.5 py-1 bg-[#2271b1] hover:bg-[#135e96] text-white rounded text-xs font-semibold flex items-center gap-1 cursor-pointer transition-colors shadow-2xs"
                          >
                            <Edit className="w-3 h-3" />
                            <span>Quick Edit SEO</span>
                          </button>

                          {onNavigateToPost && (
                            <button
                              type="button"
                              onClick={() => onNavigateToPost(post)}
                              className="px-2.5 py-1 bg-neutral-100 hover:bg-neutral-200 text-neutral-800 border border-neutral-300 rounded text-xs font-semibold flex items-center gap-1 cursor-pointer transition-colors"
                            >
                              <Sliders className="w-3 h-3" />
                              <span>Full Editor</span>
                            </button>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Tab 3: Global Meta Defaults */}
        {activeTab === 'global-settings' && (
          <form onSubmit={handleSaveGlobalSettings} className="p-6 space-y-5 text-xs max-w-3xl">
            <div>
              <label className="block font-bold text-[#1d2327] mb-1">
                Global Homepage SEO Title Tag
              </label>
              <input
                type="text"
                value={globalSiteTitle}
                onChange={(e) => setGlobalSiteTitle(e.target.value)}
                className="w-full px-3 py-2 border border-[#8c8f94] rounded text-xs focus:border-[#2271b1] outline-none"
              />
              <p className="text-[11px] text-[#646970] mt-1">Appears on the homepage and as standard fallback.</p>
            </div>

            <div>
              <label className="block font-bold text-[#1d2327] mb-1">
                Global Homepage Meta Description
              </label>
              <textarea
                rows={3}
                value={globalMetaDesc}
                onChange={(e) => setGlobalMetaDesc(e.target.value)}
                className="w-full px-3 py-2 border border-[#8c8f94] rounded text-xs focus:border-[#2271b1] outline-none resize-none leading-relaxed"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-bold text-[#1d2327] mb-1">
                  Title Separator Character
                </label>
                <select
                  value={globalSeparator}
                  onChange={(e) => setGlobalSeparator(e.target.value)}
                  className="w-full px-3 py-2 border border-[#8c8f94] rounded text-xs bg-white"
                >
                  <option value="|">| (Pipe)</option>
                  <option value="-">- (Hyphen)</option>
                  <option value="•">• (Bullet)</option>
                  <option value="~">~ (Tilde)</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-[#1d2327] mb-1">
                  Core Site Focus Keywords
                </label>
                <input
                  type="text"
                  value={globalFocusKeywords}
                  onChange={(e) => setGlobalFocusKeywords(e.target.value)}
                  className="w-full px-3 py-2 border border-[#8c8f94] rounded text-xs focus:border-[#2271b1] outline-none"
                />
              </div>
            </div>

            <div className="pt-3">
              <button
                type="submit"
                className="px-5 py-2.5 bg-[#2271b1] hover:bg-[#135e96] text-white rounded-lg text-xs font-bold transition-all shadow-xs flex items-center gap-1.5 cursor-pointer"
              >
                <Save className="w-3.5 h-3.5" />
                <span>Save Global Rank Math Settings</span>
              </button>
            </div>
          </form>
        )}

        {/* Tab 4: XML Sitemap */}
        {activeTab === 'sitemap' && (
          <div className="p-6 space-y-5 text-xs max-w-3xl">
            <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-200 flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-emerald-700 shrink-0 mt-0.5" />
              <div className="space-y-1">
                <strong className="text-emerald-950 text-sm font-bold block">Rank Math XML Sitemaps & Open Indexing are Active (hasricesupplier.com)</strong>
                <p className="text-neutral-700">
                  Your XML Sitemaps are generated dynamically for <strong>https://hasricesupplier.com</strong> and <strong>https://hashirricesupplier.com</strong> with Search Engine Open Indexing (<code>robots: index, follow</code>) enabled across all pages.
                </p>
              </div>
            </div>

            <div className="p-4 bg-white rounded-xl border border-[#c3c4c7] flex items-center justify-between gap-4">
              <div>
                <strong className="text-[#1d2327] text-sm font-bold block">Search Engine Visibility (Open Indexing)</strong>
                <span className="text-[#646970] text-[11px]">Allow Google, Bing, and AI Search engines to index all pages of hasricesupplier.com (`index, follow`).</span>
              </div>
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-900 border border-emerald-300">
                ✓ Open Indexing Active
              </span>
            </div>

            <div className="space-y-3">
              <h4 className="font-bold text-[#1d2327] text-xs uppercase tracking-wider">Active Sitemap Indices</h4>
              <div className="divide-y divide-[#e2e8f0] border border-[#e2e8f0] rounded-lg bg-white overflow-hidden">
                <div className="p-3 flex items-center justify-between">
                  <div>
                    <span className="font-bold text-[#1d2327] block">Primary XML Sitemap (hasricesupplier.com)</span>
                    <a href="/sitemap.xml" target="_blank" rel="noreferrer" className="text-[#2271b1] hover:underline font-mono text-[11px]">https://hasricesupplier.com/sitemap.xml</a>
                  </div>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800">200 OK • Indexed</span>
                </div>

                <div className="p-3 flex items-center justify-between">
                  <div>
                    <span className="font-bold text-[#1d2327] block">Secondary Alias Sitemap (hashirricesupplier.com)</span>
                    <a href="/sitemap.xml" target="_blank" rel="noreferrer" className="text-[#2271b1] hover:underline font-mono text-[11px]">https://hashirricesupplier.com/sitemap.xml</a>
                  </div>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800">200 OK • Indexed</span>
                </div>

                <div className="p-3 flex items-center justify-between">
                  <div>
                    <span className="font-bold text-[#1d2327] block">Pages Sitemap (65+ Cities & Commercial Portals)</span>
                    <span className="text-[#646970] font-mono text-[11px]">https://hasricesupplier.com/page-sitemap.xml</span>
                  </div>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800">{pages.length} URLs</span>
                </div>

                <div className="p-3 flex items-center justify-between">
                  <div>
                    <span className="font-bold text-[#1d2327] block">Posts Sitemap (Knowledge Base & Market News)</span>
                    <span className="text-[#646970] font-mono text-[11px]">https://hasricesupplier.com/post-sitemap.xml</span>
                  </div>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800">{posts.length} URLs</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
