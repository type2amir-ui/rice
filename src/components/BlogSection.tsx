import React, { useState, useEffect, useMemo } from 'react';
import { BLOG_POSTS_DATA } from '../data/blogPostsData';
import { BlogPost } from '../types';
import { WordPressSinglePostView } from './WordPressSinglePostView';
import {
  BookOpen,
  Calendar,
  Clock,
  User,
  Tag,
  ArrowRight,
  Sparkles,
  MessageCircle,
  X,
  Search,
  CheckCircle2,
  Share2,
  ChevronRight,
  ShieldCheck,
  Building2,
  Package,
  Layers,
  ArrowUpRight,
  Flame,
  FileText
} from 'lucide-react';

interface BlogSectionProps {
  onOpenQuoteModal: (varietyName?: string) => void;
  onOpenSampleModal: (varietyName?: string) => void;
  onSelectPost?: (post: BlogPost) => void;
  isFullPageView?: boolean;
}

export function convertWpRestPostToBlogPost(wpPost: any): BlogPost {
  const titleHtml = wpPost?.title?.rendered || wpPost?.title || 'Untitled Blog Post';
  const cleanTitle = titleHtml.replace(/<[^>]+>/g, '');
  const rawExcerpt = wpPost?.excerpt?.rendered || wpPost?.excerpt || '';
  const cleanExcerpt = rawExcerpt.replace(/<[^>]+>/g, '').trim();
  const contentHtml = wpPost?.content?.rendered || wpPost?.content || '';
  const featuredMedia =
    wpPost?.featured_image ||
    wpPost?._embedded?.['wp:featuredmedia']?.[0]?.source_url ||
    'https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&q=80&w=1200';
  const categoryName =
    wpPost?.category_name ||
    wpPost?._embedded?.['wp:term']?.[0]?.[0]?.name ||
    'Sourcing Guide';
  const authorName =
    wpPost?.author_name ||
    wpPost?._embedded?.author?.[0]?.name ||
    'Hashir Rice Sourcing Desk';
  const dateStr = wpPost?.date
    ? new Date(wpPost.date).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      })
    : wpPost?.publishedDate || 'Recent';

  return {
    id: `wp-post-${wpPost.id || wpPost.slug}`,
    slug: wpPost.slug || `post-${wpPost.id}`,
    title: cleanTitle,
    category: categoryName,
    publishedDate: dateStr,
    readTime: '6 Min Read',
    author: {
      name: authorName,
      role: 'Noor Galla Mandi, Bucheki',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200',
    },
    imageUrl: featuredMedia,
    excerpt: cleanExcerpt || cleanTitle,
    keyTakeaways: [
      'Direct Ex-Mill Wholesale Rice Sourcing from Noor Galla Mandi, Bucheki',
      '100% Buhler Sortex Clean & 12.0% Max Moisture Certified Lots',
    ],
    contentSections: [],
    rawContent: contentHtml,
    tags: ['Wholesale Rice', 'Bucheki Mandi', categoryName],
    status: 'publish',
  };
}

export const BlogSection: React.FC<BlogSectionProps> = ({
  onOpenQuoteModal,
  onOpenSampleModal,
  onSelectPost,
  isFullPageView = false,
}) => {
  // Display only the verified published blog posts (4 canonical published articles or user manually published posts)
  const [posts, setPosts] = useState<BlogPost[]>(() => {
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
  });

  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeArticle, setActiveArticle] = useState<BlogPost | null>(null);
  const [visibleCount, setVisibleCount] = useState<number>(isFullPageView ? 12 : 6);

  // Synchronize when posts are added or edited manually
  useEffect(() => {
    const syncPosts = () => {
      try {
        const saved = localStorage.getItem('hashir_rice_admin_posts');
        if (saved) {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed) && parsed.length > 0) {
            const published = parsed.filter((p: any) => p.status === 'publish' || !p.status);
            if (published.length > 0) {
              setPosts(published);
              return;
            }
          }
        }
      } catch {
        // ignore
      }
      setPosts(BLOG_POSTS_DATA);
    };

    window.addEventListener('hashir_posts_updated', syncPosts);
    window.addEventListener('storage', syncPosts);

    return () => {
      window.removeEventListener('hashir_posts_updated', syncPosts);
      window.removeEventListener('storage', syncPosts);
    };
  }, []);

  const handleOpenPost = (post: BlogPost) => {
    if (onSelectPost) {
      onSelectPost(post);
    } else {
      setActiveArticle(post);
      if (typeof window !== 'undefined' && post.slug) {
        window.history.pushState(null, '', `/${post.slug}`);
      }
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // Simplified and intuitive category list for standard blog readers
  const categories = useMemo(() => {
    const set = new Set<string>();
    posts.forEach((p) => {
      if (p.category) set.add(p.category);
    });
    return [
      { id: 'all', label: `All Posts (${posts.length})` },
      ...Array.from(set).map((cat) => ({ id: cat, label: cat }))
    ];
  }, [posts]);

  // Filtered posts based on category and search query
  const filteredPosts = useMemo(() => {
    return posts.filter((post) => {
      const matchesCategory = selectedCategory === 'all' || post.category === selectedCategory;
      const q = searchQuery.trim().toLowerCase();
      const matchesSearch =
        q === '' ||
        post.title.toLowerCase().includes(q) ||
        post.excerpt.toLowerCase().includes(q) ||
        (post.tags && post.tags.some((t) => t.toLowerCase().includes(q)));

      return matchesCategory && matchesSearch;
    });
  }, [posts, selectedCategory, searchQuery]);

  const handleShareWhatsApp = (post: BlogPost) => {
    const text = encodeURIComponent(
      `*Read this Rice Industry Article on Hashir Rice Supplier:*\n\n` +
      `📖 *${post.title}*\n` +
      `Category: ${post.category} | Author: ${post.author?.name || 'Hashir Rice Supplier'}\n\n` +
      `"${post.excerpt}"\n\n` +
      `_Published by Hashir Rice Supplier - Noor Galla Mandi, Bucheki (District Nankana Sahib, Punjab)._`
    );
    window.open(`https://wa.me/?text=${text}`, '_blank');
  };

  // If viewing a single post
  if (activeArticle) {
    return (
      <div className="bg-[#fcfcfc] py-6 sm:py-10 animate-fadeIn">
        <WordPressSinglePostView
          post={activeArticle}
          onBack={() => {
            setActiveArticle(null);
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          onOpenSampleModal={onOpenSampleModal}
          onOpenQuoteModal={onOpenQuoteModal}
          onInternalNavigate={(url) => {
            setActiveArticle(null);
            const clean = url.replace(/^\//, '');
            window.location.hash = '#' + clean;
          }}
        />
      </div>
    );
  }

  // Top featured post for the hero spot
  const featuredPost = filteredPosts[0];
  const gridPosts = selectedCategory === 'all' && !searchQuery
    ? filteredPosts.slice(1, visibleCount)
    : filteredPosts.slice(0, visibleCount);

  return (
    <section className={`bg-neutral-50 text-neutral-900 border-b border-neutral-200 ${isFullPageView ? 'py-12 sm:py-16' : 'py-14 sm:py-20'}`} id="blog-section">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        
        {/* Section: Latest Published Blog Posts */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-emerald-100 text-emerald-900 text-xs font-bold uppercase tracking-wider border border-emerald-300">
            <BookOpen className="w-3.5 h-3.5 text-emerald-800" />
            <span>Latest Published Blog Posts</span>
          </div>

          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-neutral-950 leading-tight">
            Latest Published Blog Posts
          </h2>

          <p className="text-sm sm:text-base text-neutral-600 leading-relaxed max-w-2xl mx-auto">
            Explore our authentic published wholesale rice sourcing handbooks, cooked elongation comparisons, warehouse storage standards, and transparent mandi price breakdowns.
          </p>
        </div>

        {/* Category Pills & Search Filter Bar */}
        <div className="bg-white p-3.5 sm:p-4 rounded-2xl border border-neutral-200/90 shadow-2xs flex flex-col md:flex-row items-center justify-between gap-3">
          {/* Category Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-2 md:pb-0 scrollbar-none">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`text-xs px-3.5 py-2 rounded-xl font-bold transition-all whitespace-nowrap cursor-pointer ${
                  selectedCategory === cat.id
                    ? 'bg-emerald-900 text-white shadow-xs'
                    : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200 hover:text-neutral-950'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Search Box */}
          <div className="relative w-full md:w-72 shrink-0">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search blog articles..."
              className="w-full pl-10 pr-4 py-2 bg-neutral-50 border border-neutral-300 rounded-xl text-xs text-neutral-900 placeholder-neutral-500 focus:outline-none focus:border-emerald-700 transition-colors"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-900 text-xs cursor-pointer"
              >
                Clear
              </button>
            )}
          </div>
        </div>

        {/* FEATURED LEAD POST (When in All Articles & no search) */}
        {featuredPost && selectedCategory === 'all' && !searchQuery && (
          <div className="bg-white rounded-3xl border border-neutral-200 overflow-hidden shadow-xs hover:shadow-md transition-shadow">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-0">
              <div className="lg:col-span-6 relative h-64 sm:h-80 lg:h-full min-h-[280px] bg-neutral-100 overflow-hidden">
                <img
                  src={featuredPost.imageUrl}
                  alt={featuredPost.title}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-700 cursor-pointer"
                  onClick={() => handleOpenPost(featuredPost)}
                  referrerPolicy="no-referrer"
                />
                <div className="absolute top-4 left-4 flex items-center gap-2">
                  <span className="px-3 py-1 rounded-lg bg-emerald-900 text-amber-300 font-bold text-xs uppercase tracking-wider shadow-sm flex items-center gap-1.5">
                    <Flame className="w-3.5 h-3.5 fill-amber-300" />
                    Featured Article
                  </span>
                </div>
              </div>

              <div className="lg:col-span-6 p-6 sm:p-8 lg:p-10 flex flex-col justify-between space-y-5">
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-xs text-neutral-500 font-medium">
                    <span className="px-2.5 py-0.5 rounded-md bg-emerald-50 text-emerald-900 font-bold border border-emerald-200">
                      {featuredPost.category}
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-neutral-400" />
                      {featuredPost.publishedDate}
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1 text-emerald-800 font-semibold">
                      <Clock className="w-3.5 h-3.5" />
                      {featuredPost.readTime}
                    </span>
                  </div>

                  <h3
                    onClick={() => handleOpenPost(featuredPost)}
                    className="font-serif text-2xl sm:text-3xl font-bold text-neutral-950 leading-snug hover:text-emerald-900 transition-colors cursor-pointer"
                  >
                    {featuredPost.title}
                  </h3>

                  <p className="text-xs sm:text-sm text-neutral-600 line-clamp-3 leading-relaxed">
                    {featuredPost.excerpt}
                  </p>

                  {/* Highlights */}
                  {featuredPost.keyTakeaways && featuredPost.keyTakeaways.length > 0 && (
                    <div className="p-3.5 rounded-xl bg-emerald-50/70 border border-emerald-200/80 space-y-1.5">
                      <strong className="text-[11px] font-bold uppercase tracking-wider text-emerald-950 block">
                        Core Takeaways:
                      </strong>
                      {featuredPost.keyTakeaways.slice(0, 2).map((item, idx) => (
                        <div key={idx} className="flex items-start gap-2 text-xs text-neutral-700">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700 shrink-0 mt-0.5" />
                          <span className="line-clamp-1">{item}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="pt-4 border-t border-neutral-100 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-full bg-emerald-900 text-amber-300 font-bold flex items-center justify-center text-xs">
                      HR
                    </div>
                    <div>
                      <strong className="text-xs text-neutral-900 block font-bold">
                        {featuredPost.author.name}
                      </strong>
                      <span className="text-[10px] text-neutral-500">
                        Noor Galla Mandi, Bucheki
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleShareWhatsApp(featuredPost)}
                      className="p-2 rounded-xl bg-neutral-100 hover:bg-emerald-50 text-neutral-600 hover:text-emerald-800 transition-colors cursor-pointer"
                      title="Share on WhatsApp"
                    >
                      <MessageCircle className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleOpenPost(featuredPost)}
                      className="px-4 py-2 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs"
                    >
                      <span>Read Full Article</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* BLOG POSTS GRID: Show All Blog Posts clearly */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-serif text-xl font-bold text-neutral-950 flex items-center gap-2">
              <FileText className="w-4 h-4 text-emerald-700" />
              <span>Published Blog Articles ({filteredPosts.length})</span>
            </h3>
            <span className="text-xs text-neutral-500">
              Showing {gridPosts.length + (selectedCategory === 'all' && !searchQuery ? 1 : 0)} of {filteredPosts.length} articles
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {gridPosts.map((post) => (
              <article
                key={post.id}
                className="bg-white rounded-2xl border border-neutral-200 overflow-hidden shadow-2xs hover:shadow-md transition-all hover:-translate-y-1 flex flex-col justify-between group"
              >
                <div>
                  {/* Image Card */}
                  <div
                    onClick={() => handleOpenPost(post)}
                    className="relative h-48 w-full overflow-hidden bg-neutral-100 cursor-pointer"
                  >
                    <img
                      src={post.imageUrl}
                      alt={post.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute top-3 left-3">
                      <span className="px-2.5 py-1 rounded-md bg-white/95 text-emerald-950 font-bold text-[11px] uppercase tracking-wider backdrop-blur-xs border border-neutral-200 shadow-2xs">
                        {post.category}
                      </span>
                    </div>
                  </div>

                  {/* Body Content */}
                  <div className="p-5 sm:p-6 space-y-3">
                    <div className="flex items-center gap-2 text-[11px] text-neutral-500 font-medium">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3 text-neutral-400" />
                        {post.publishedDate}
                      </span>
                      <span>•</span>
                      <span className="text-emerald-800 font-semibold flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {post.readTime}
                      </span>
                    </div>

                    <h4
                      onClick={() => handleOpenPost(post)}
                      className="font-serif text-lg font-bold text-neutral-950 leading-snug group-hover:text-emerald-800 transition-colors cursor-pointer line-clamp-2"
                    >
                      {post.title}
                    </h4>

                    <p className="text-xs text-neutral-600 line-clamp-3 leading-relaxed">
                      {post.excerpt}
                    </p>

                    {/* Tags */}
                    {post.tags && post.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 pt-1">
                        {post.tags.slice(0, 3).map((tag, tIdx) => (
                          <span
                            key={tIdx}
                            className="text-[10px] px-2 py-0.5 rounded bg-neutral-100 text-neutral-600 font-medium"
                          >
                            #{tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Footer with Read Article Button */}
                <div className="px-5 sm:px-6 pb-5 pt-3 border-t border-neutral-100 flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2 truncate">
                    <div className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-900 font-bold flex items-center justify-center text-[10px] shrink-0">
                      {post.author.name.charAt(0)}
                    </div>
                    <span className="text-[11px] text-neutral-600 font-medium truncate max-w-[110px]">
                      {post.author.name}
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0">
                    <button
                      onClick={() => handleShareWhatsApp(post)}
                      className="p-1.5 rounded-lg text-neutral-400 hover:text-emerald-700 hover:bg-emerald-50 transition-colors cursor-pointer"
                      title="Share on WhatsApp"
                    >
                      <MessageCircle className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleOpenPost(post)}
                      className="px-3 py-1.5 rounded-lg bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-bold flex items-center gap-1 transition-colors cursor-pointer shadow-2xs"
                    >
                      <span>Read Post</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>

          {/* Show More Button if there are more than visibleCount */}
          {gridPosts.length + (selectedCategory === 'all' && !searchQuery ? 1 : 0) < filteredPosts.length && (
            <div className="text-center pt-6">
              <button
                onClick={() => setVisibleCount((prev) => prev + 6)}
                className="px-6 py-3 rounded-xl bg-white hover:bg-neutral-100 text-neutral-900 font-bold text-xs border border-neutral-300 shadow-2xs transition-all cursor-pointer inline-flex items-center gap-2"
              >
                <span>View More Blog Articles</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* No Articles Found Fallback */}
          {filteredPosts.length === 0 && (
            <div className="text-center py-14 bg-white rounded-2xl border border-neutral-200">
              <BookOpen className="w-10 h-10 text-neutral-300 mx-auto mb-2.5" />
              <h4 className="font-serif text-lg font-bold text-neutral-800">No Blog Articles Found</h4>
              <p className="text-xs text-neutral-500 mt-1 max-w-sm mx-auto">
                No articles matched &quot;{searchQuery}&quot;. Clear your search or reset filters to browse all 15 rice sourcing guides.
              </p>
              <button
                onClick={() => {
                  setSelectedCategory('all');
                  setSearchQuery('');
                }}
                className="mt-4 px-4 py-2 rounded-xl bg-emerald-800 text-white text-xs font-bold cursor-pointer"
              >
                Reset Filters
              </button>
            </div>
          )}
        </div>

        {/* Need Specific Mandi Quote or Sample CTA */}
        <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-emerald-950 via-emerald-900 to-neutral-950 text-white border border-emerald-800 shadow-md flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-1.5 text-center md:text-left max-w-xl">
            <h4 className="font-serif text-xl sm:text-2xl font-bold text-white">
              Need Today&apos;s Mandi Rates or Free Cooking Samples?
            </h4>
            <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed">
              Connect directly with our Noor Galla Mandi, Bucheki trading desk for verified ex-mill lots of 1121 Kainat, Super Kernel Basmati, PK-386, and IRRI-6.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <button
              onClick={() => onOpenSampleModal('1121 Kainat Steam')}
              className="px-5 py-2.5 bg-amber-400 hover:bg-amber-300 text-neutral-950 font-bold rounded-xl text-xs transition-all shadow-md cursor-pointer flex items-center gap-1.5"
            >
              <Package className="w-4 h-4" />
              <span>Free Cooking Sample</span>
            </button>
            <button
              onClick={() => onOpenQuoteModal()}
              className="px-5 py-2.5 bg-emerald-800 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs transition-colors cursor-pointer border border-emerald-600"
            >
              Get Mandi Rates
            </button>
          </div>
        </div>

      </div>
    </section>
  );
};
