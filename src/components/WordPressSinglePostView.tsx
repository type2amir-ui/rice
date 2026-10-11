import React from 'react';
import { BlogPost } from '../types';
import { RichContentText } from '../utils/contentRenderer';
import {
  Calendar,
  Clock,
  User,
  Tag,
  ArrowLeft,
  Share2,
  MessageCircle,
  Package,
  FileText,
  CheckCircle2,
  ChevronRight,
  ShieldCheck,
  Edit,
  ExternalLink,
  BookOpen
} from 'lucide-react';

interface WordPressSinglePostViewProps {
  post: BlogPost;
  onBack?: () => void;
  onEdit?: (post: BlogPost) => void;
  onOpenSampleModal?: (varietyName?: string) => void;
  onOpenQuoteModal?: (varietyName?: string) => void;
  onInternalNavigate?: (path: string) => void;
  isAdminPreview?: boolean;
}

export const WordPressSinglePostView: React.FC<WordPressSinglePostViewProps> = ({
  post,
  onBack,
  onEdit,
  onOpenSampleModal,
  onOpenQuoteModal,
  onInternalNavigate,
  isAdminPreview = false,
}) => {
  const handleShareWhatsApp = () => {
    const text = encodeURIComponent(
      `*${post.title}*\n\n` +
      `Category: ${post.category}\n` +
      `Author: ${post.author?.name || 'Hashir Rice Supplier'}\n\n` +
      `"${post.excerpt}"\n\n` +
      `Read full report: https://hasricesupplier.com/news/${post.slug}`
    );
    window.open(`https://wa.me/?text=${text}`, '_blank');
  };

  const handleInternalLinkClick = (url: string) => {
    if (onInternalNavigate) {
      onInternalNavigate(url);
    } else {
      // Fallback hash routing
      const cleanPath = url.replace(/^\//, '');
      window.location.hash = `#${cleanPath}`;
    }
  };

  return (
    <article className="min-h-screen bg-[#fcfcfc] text-[#2c3338] font-sans antialiased pb-20 selection:bg-emerald-900 selection:text-amber-300">
      {/* WordPress Admin Preview Banner if opened from Admin */}
      {isAdminPreview && (
        <div className="bg-[#1d2327] text-white px-4 py-2.5 flex items-center justify-between text-xs sticky top-0 z-40 shadow-md border-b border-[#3c434a]">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span className="font-mono text-[#72aee6]">Previewing WordPress Single Post</span>
            <span className="text-[#a7aaad]">• Status: <strong className="text-white uppercase font-bold">{post.status || 'Published'}</strong></span>
          </div>
          <div className="flex items-center gap-2">
            {onEdit && (
              <button
                onClick={() => onEdit(post)}
                className="px-2.5 py-1 bg-[#2271b1] hover:bg-[#135e96] text-white rounded font-bold flex items-center gap-1 cursor-pointer transition-colors"
              >
                <Edit className="w-3 h-3" />
                <span>Edit Post</span>
              </button>
            )}
            {onBack && (
              <button
                onClick={onBack}
                className="px-2.5 py-1 bg-neutral-700 hover:bg-neutral-600 text-white rounded font-semibold flex items-center gap-1 cursor-pointer transition-colors"
              >
                <ArrowLeft className="w-3 h-3" />
                <span>Back to Admin</span>
              </button>
            )}
          </div>
        </div>
      )}

      {/* Top Breadcrumbs & Back Navigation */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 pt-8 pb-4">
        <div className="flex items-center justify-between text-xs text-[#646970] mb-4">
          <nav className="flex items-center gap-1.5 flex-wrap">
            <button
              onClick={() => handleInternalLinkClick('/')}
              className="hover:text-emerald-900 font-medium cursor-pointer"
            >
              Home
            </button>
            <span>/</span>
            <button
              onClick={() => {
                if (onBack) onBack();
                else handleInternalLinkClick('/news');
              }}
              className="hover:text-emerald-900 font-medium cursor-pointer"
            >
              News & Knowledge Base
            </button>
            <span>/</span>
            <span className="text-emerald-900 font-bold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200/60">
              {post.category}
            </span>
          </nav>

          {onBack && !isAdminPreview && (
            <button
              onClick={onBack}
              className="inline-flex items-center gap-1 text-xs font-bold text-neutral-600 hover:text-neutral-950 bg-white border border-neutral-300 px-3 py-1.5 rounded-lg shadow-2xs hover:bg-neutral-50 transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Articles</span>
            </button>
          )}
        </div>
      </div>

      {/* Main Single Post Container */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 bg-white border border-[#dcdcde] rounded-2xl shadow-sm p-6 sm:p-12 space-y-8">
        
        {/* Post Header */}
        <header className="space-y-4 border-b border-[#e2e4e7] pb-8">
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-md bg-[#f0f6fc] text-[#1d4ed8] border border-[#bfdbfe] text-xs font-bold uppercase tracking-wider">
              {post.category}
            </span>
            <span className="text-xs text-[#8c8f94]">•</span>
            <span className="text-xs font-mono text-[#8c8f94]">/{post.slug}</span>
          </div>

          <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#1d2327] leading-[1.2] tracking-tight">
            {post.title}
          </h1>

          <div className="flex flex-wrap items-center justify-between gap-4 pt-2 text-xs text-[#50575e]">
            <div className="flex items-center gap-3">
              <img
                src={post.author?.avatar || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200'}
                alt={post.author?.name || 'Hashir Rice Supplier'}
                className="w-10 h-10 rounded-full object-cover border-2 border-emerald-700/20"
                referrerPolicy="no-referrer"
              />
              <div>
                <strong className="block text-sm font-bold text-[#1d2327]">
                  {post.author?.name || 'Hashir Rice Supplier'}
                </strong>
                <span className="text-[#646970]">
                  {post.author?.role || 'Direct Rice Sourcing Desk (Owner: Muhammad Amir Shahzad)'} • Noor Galla Mandi, Bucheki
                </span>
              </div>
            </div>

            <div className="flex items-center gap-3 text-[11px] sm:text-xs">
              <span className="flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-[#8c8f94]" />
                {post.publishedDate}
              </span>
              <span>•</span>
              <span className="flex items-center gap-1 text-emerald-800 font-bold">
                <Clock className="w-3.5 h-3.5 text-emerald-700" />
                {post.readTime}
              </span>
              <span>•</span>
              <button
                onClick={handleShareWhatsApp}
                className="inline-flex items-center gap-1 text-emerald-700 hover:text-emerald-900 font-bold hover:underline cursor-pointer"
                title="Share on WhatsApp"
              >
                <Share2 className="w-3.5 h-3.5" />
                <span>Share</span>
              </button>
            </div>
          </div>
        </header>

        {/* Featured Image */}
        {post.imageUrl && (
          <figure className="space-y-2">
            <div className="rounded-xl overflow-hidden border border-[#dcdcde] bg-neutral-100 shadow-xs max-h-[500px]">
              <img
                src={post.imageUrl}
                alt={post.title}
                className="w-full h-full object-cover max-h-[480px]"
                referrerPolicy="no-referrer"
              />
            </div>
            {post.featuredImageCaption && (
              <figcaption className="text-xs text-neutral-500 italic text-center">
                {post.featuredImageCaption}
              </figcaption>
            )}
          </figure>
        )}

        {/* Key Takeaways / Executive Summary */}
        {post.keyTakeaways && post.keyTakeaways.length > 0 && (
          <div className="rounded-xl p-5 sm:p-6 bg-[#f8fafc] border-l-4 border-l-[#2271b1] border border-[#e2e8f0] space-y-3 shadow-2xs">
            <h2 className="text-xs font-extrabold uppercase tracking-wider text-[#1e3a8a] flex items-center gap-2 font-sans">
              <ShieldCheck className="w-4 h-4 text-[#2271b1]" />
              <span>Key Takeaways & Sourcing Summary</span>
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {post.keyTakeaways.map((takeaway, idx) => (
                <div key={idx} className="flex items-start gap-2 text-xs sm:text-sm text-[#334155] leading-relaxed">
                  <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
                  <span>
                    <RichContentText text={takeaway} onInternalNavigate={handleInternalLinkClick} />
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Lead Excerpt */}
        {post.excerpt && (
          <p className="text-base sm:text-lg text-neutral-700 font-serif italic leading-relaxed border-b border-neutral-100 pb-4">
            "{post.excerpt}"
          </p>
        )}

        {/* Unlimited Body of Content */}
        <div className="entry-content space-y-10 text-[15px] sm:text-base text-[#2c3338] leading-relaxed">
          {post.contentSections && post.contentSections.map((section, sIdx) => (
            <section key={sIdx} className="space-y-4">
              {section.heading && (
                <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#1d2327] tracking-tight border-b border-[#e2e4e7] pb-2 mt-6">
                  {section.heading}
                </h2>
              )}

              {/* Inline Section Image if present */}
              {section.imageUrl && (
                <figure className="my-5 rounded-lg overflow-hidden border border-[#dcdcde] bg-neutral-50">
                  <img
                    src={section.imageUrl}
                    alt={section.imageCaption || section.heading}
                    className="w-full h-auto max-h-[420px] object-cover"
                    referrerPolicy="no-referrer"
                  />
                  {section.imageCaption && (
                    <figcaption className="p-2 text-xs text-neutral-600 bg-neutral-100/90 text-center italic">
                      {section.imageCaption}
                    </figcaption>
                  )}
                </figure>
              )}

              {/* Paragraphs with automatic rich link parsing */}
              <div className="space-y-4">
                {section.paragraphs.map((para, pIdx) => (
                  <p key={pIdx} className="text-[#3c434a] leading-[1.75]">
                    <RichContentText text={para} onInternalNavigate={handleInternalLinkClick} />
                  </p>
                ))}
              </div>

              {/* Subpoints / Checklist */}
              {section.subPoints && section.subPoints.length > 0 && (
                <div className="p-4 sm:p-5 rounded-xl bg-neutral-50 border border-neutral-200 space-y-2.5 my-4">
                  {section.subPoints.map((sp, spIdx) => (
                    <div key={spIdx} className="flex items-start gap-2.5 text-xs sm:text-sm text-neutral-800">
                      <ChevronRight className="w-4 h-4 text-emerald-800 shrink-0 mt-0.5" />
                      <span>
                        <RichContentText text={sp} onInternalNavigate={handleInternalLinkClick} />
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </section>
          ))}

          {/* Raw / Freeform content fallback if present */}
          {post.rawContent && (!post.contentSections || post.contentSections.length === 0) && (
            /<[a-z][\s\S]*>/i.test(post.rawContent) ? (
              <div
                className="prose prose-emerald max-w-none space-y-4 text-[#3c434a] leading-[1.8] [&_h2]:font-serif [&_h2]:text-2xl [&_h2]:font-bold [&_h2]:text-[#1d2327] [&_h2]:mt-6 [&_h2]:mb-3 [&_h3]:font-serif [&_h3]:text-xl [&_h3]:font-bold [&_h3]:text-[#1d2327] [&_h3]:mt-5 [&_h3]:mb-2 [&_p]:mb-4 [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:mb-4 [&_ol]:list-decimal [&_ol]:pl-6 [&_ol]:mb-4 [&_img]:rounded-xl [&_img]:my-4 [&_a]:text-emerald-800 [&_a]:underline [&_a]:font-semibold"
                dangerouslySetInnerHTML={{ __html: post.rawContent }}
              />
            ) : (
              <div className="space-y-4 whitespace-pre-line text-[#3c434a] leading-[1.75]">
                <RichContentText text={post.rawContent} onInternalNavigate={handleInternalLinkClick} />
              </div>
            )
          )}
        </div>

        {/* Post Tags */}
        {post.tags && post.tags.length > 0 && (
          <div className="pt-6 border-t border-[#dcdcde] flex items-center gap-2 flex-wrap">
            <span className="text-xs font-bold text-[#646970] flex items-center gap-1 mr-1">
              <Tag className="w-3.5 h-3.5" />
              <span>Tags:</span>
            </span>
            {post.tags.map((tag, tIdx) => (
              <span
                key={tIdx}
                className="text-xs px-2.5 py-1 rounded-md bg-[#f0f0f1] text-[#2c3338] border border-[#dcdcde] font-medium hover:bg-neutral-200 transition-colors"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}

        {/* Author Bio Box */}
        <div className="rounded-xl p-6 bg-[#f6f7f7] border border-[#dcdcde] flex flex-col sm:flex-row items-start sm:items-center gap-5">
          <img
            src={post.author?.avatar || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200'}
            alt={post.author?.name || 'Hashir Rice Supplier'}
            className="w-16 h-16 rounded-full object-cover border-2 border-white shadow-xs shrink-0"
            referrerPolicy="no-referrer"
          />
          <div className="space-y-1.5 flex-1">
            <h3 className="font-bold text-base text-[#1d2327]">
              About {post.author?.name || 'Hashir Rice Supplier'}
            </h3>
            <p className="text-xs text-[#50575e] leading-relaxed">
              Official Rice Supplier & Sourcing Desk (Owner: Muhammad Amir Shahzad). Operating on-ground from Noor Galla Mandi, Bucheki (Nankana Sahib), providing impartial grain testing, Sortex verification, and direct-from-mill truckload dispatches across Pakistan.
            </p>
            <div className="pt-2 flex items-center gap-3">
              <a
                href="https://wa.me/923338990883?text=Hello%20Hashir%20Rice%20Supplier,%20I%20read%20your%20article%20and%20wanted%20to%20consult%20about%20bulk%20sourcing."
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-800 bg-emerald-100 hover:bg-emerald-200 px-3 py-1 rounded-md transition-colors"
              >
                <MessageCircle className="w-3.5 h-3.5" />
                <span>Consult Author on WhatsApp</span>
              </a>
            </div>
          </div>
        </div>

        {/* Action Next Steps */}
        <div className="p-6 rounded-xl bg-emerald-950 text-white flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="space-y-1 text-center sm:text-left">
            <strong className="block text-sm font-bold text-amber-300 uppercase tracking-wider">
              Need Verification On Your Current Rice Consignment?
            </strong>
            <p className="text-xs text-neutral-300">
              Request a free physical sample or get today's live ex-mill spot quotation for 1121 Kainat, Super Kernel, or 1509 Basmati.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            {onOpenSampleModal && (
              <button
                onClick={() => onOpenSampleModal(post.tags?.[0] || '1121 Kainat Steam')}
                className="px-4 py-2 bg-amber-400 hover:bg-amber-300 text-neutral-950 rounded-lg text-xs font-bold transition-all shadow-xs cursor-pointer flex items-center gap-1.5"
              >
                <Package className="w-3.5 h-3.5" />
                <span>Order Free Sample</span>
              </button>
            )}
            {onOpenQuoteModal && (
              <button
                onClick={() => onOpenQuoteModal()}
                className="px-4 py-2 bg-emerald-800 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold transition-all border border-emerald-600 cursor-pointer"
              >
                Get Mandi Quote
              </button>
            )}
          </div>
        </div>

      </main>
    </article>
  );
};
