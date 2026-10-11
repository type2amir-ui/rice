import React from 'react';
import { WordPressPage } from '../types';
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
  Globe,
  Sparkles,
  MapPin,
  Check
} from 'lucide-react';

interface WordPressSinglePageViewProps {
  page: WordPressPage;
  onBack?: () => void;
  onEdit?: (page: WordPressPage) => void;
  onOpenSampleModal?: (varietyName?: string) => void;
  onOpenQuoteModal?: (varietyName?: string) => void;
  onInternalNavigate?: (path: string) => void;
  isAdminPreview?: boolean;
}

export const WordPressSinglePageView: React.FC<WordPressSinglePageViewProps> = ({
  page,
  onBack,
  onEdit,
  onOpenSampleModal,
  onOpenQuoteModal,
  onInternalNavigate,
  isAdminPreview = false,
}) => {
  const [copiedLink, setCopiedLink] = React.useState(false);

  const handleShareWhatsApp = () => {
    const text = encodeURIComponent(
      `*${page.title}*\n\n` +
      `URL: https://hasricesupplier.com/${page.slug}\n\n` +
      `"${page.excerpt || page.metaDescription || 'Direct Rice Sourcing & Procurement Desk, Bucheki (Nankana Sahib).'}"\n\n` +
      `Hashir Rice Supplier - Noor Galla Mandi, Bucheki, Pakistan.`
    );
    window.open(`https://wa.me/?text=${text}`, '_blank');
  };

  const handleCopyLink = () => {
    const fullUrl = `https://hasricesupplier.com/${page.slug}`;
    navigator.clipboard.writeText(fullUrl);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  const handleInternalLinkClick = (url: string) => {
    if (onInternalNavigate) {
      onInternalNavigate(url);
    } else {
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
            <span className="w-2 h-2 rounded-full bg-blue-400 animate-pulse"></span>
            <span className="font-mono text-[#72aee6]">Previewing WordPress Single Page (page.php)</span>
            <span className="text-[#a7aaad]">• Status: <strong className="text-white uppercase font-bold">{page.status || 'Published'}</strong></span>
            <span className="text-[#a7aaad] hidden sm:inline">• Type: <span className="text-amber-300 font-bold uppercase">{page.type}</span></span>
          </div>
          <div className="flex items-center gap-2">
            {onEdit && (
              <button
                onClick={() => onEdit(page)}
                className="px-2.5 py-1 bg-[#2271b1] hover:bg-[#135e96] text-white rounded font-bold flex items-center gap-1 cursor-pointer transition-colors"
              >
                <Edit className="w-3 h-3" />
                <span>Edit Page</span>
              </button>
            )}
            {onBack && (
              <button
                onClick={onBack}
                className="px-2.5 py-1 bg-neutral-700 hover:bg-neutral-600 text-white rounded font-semibold flex items-center gap-1 cursor-pointer transition-colors"
              >
                <ArrowLeft className="w-3 h-3" />
                <span>Back to Admin Pages</span>
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
            <span className="text-[#646970] capitalize">
              {page.type === 'city-hub' ? 'City Hubs' : page.type === 'commercial' ? 'Commercial Foodservice' : 'Pages'}
            </span>
            <span>/</span>
            <span className="text-emerald-950 font-bold bg-neutral-100 px-2 py-0.5 rounded border border-neutral-200 truncate max-w-xs">
              {page.title}
            </span>
          </nav>

          {onBack && !isAdminPreview && (
            <button
              onClick={onBack}
              className="inline-flex items-center gap-1 text-xs font-bold text-neutral-600 hover:text-neutral-950 bg-white border border-neutral-300 px-3 py-1.5 rounded-lg shadow-2xs hover:bg-neutral-50 transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Pages</span>
            </button>
          )}
        </div>
      </div>

      {/* Main Single Page Container (WordPress default page.php style) */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 bg-white border border-[#dcdcde] rounded-2xl shadow-sm p-6 sm:p-12 space-y-8">
        
        {/* Page Header */}
        <header className="space-y-4 border-b border-[#e2e4e7] pb-8">
          <div className="flex flex-wrap items-center gap-2">
            <span className="px-2.5 py-0.5 rounded text-[11px] font-bold uppercase tracking-wider bg-blue-50 text-blue-800 border border-blue-200">
              {page.type === 'city-hub' ? 'City SEO Hub' : page.type === 'commercial' ? 'Commercial Foodservice' : 'WordPress Page'}
            </span>
            {page.province && (
              <span className="px-2.5 py-0.5 rounded text-[11px] font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200">
                {page.province}
              </span>
            )}
            <span className="text-xs text-[#646970]">
              Last updated: <strong>{page.lastModified}</strong>
            </span>
          </div>

          <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-[#1d2327] tracking-tight leading-tight">
            {page.title}
          </h1>

          {/* Permalink and share bar */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-2 text-xs text-[#50575e]">
            <div className="flex items-center gap-2 font-mono text-xs bg-[#f6f7f7] border border-[#dcdcde] px-3 py-1.5 rounded-lg max-w-full overflow-hidden">
              <Globe className="w-3.5 h-3.5 text-[#2271b1] shrink-0" />
              <span className="truncate text-[#2271b1] font-semibold">https://hasricesupplier.com/{page.slug}</span>
              <button
                onClick={handleCopyLink}
                className="ml-2 text-neutral-500 hover:text-neutral-900 font-sans text-[11px] font-bold underline cursor-pointer shrink-0"
              >
                {copiedLink ? <span className="text-emerald-700 flex items-center gap-0.5"><Check className="w-3 h-3" /> Copied!</span> : 'Copy Link'}
              </button>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleShareWhatsApp}
                className="px-3 py-1.5 bg-[#25d366]/10 hover:bg-[#25d366]/20 text-[#128c7e] border border-[#25d366]/40 rounded-lg font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Share Page</span>
              </button>
            </div>
          </div>

          {/* Author / Mandi Sourcing Desk Info */}
          <div className="flex items-center gap-3 pt-4 text-xs text-[#646970] border-t border-[#f0f0f1]">
            <div className="w-9 h-9 rounded-full bg-[#1d2327] text-amber-300 font-bold flex items-center justify-center text-xs shrink-0 shadow-xs">
              HR
            </div>
            <div>
              <span className="font-bold text-[#1d2327] text-sm block">
                {page.author?.name || 'Hashir Rice Supplier'}
              </span>
              <span>
                {page.author?.role || 'Direct Rice Sourcing & Procurement Desk (Owner: Muhammad Amir Shahzad)'} • Noor Galla Mandi, Bucheki
              </span>
            </div>
          </div>
        </header>

        {/* Featured Image (if available) */}
        {page.imageUrl && (
          <figure className="space-y-2 rounded-2xl overflow-hidden border border-[#dcdcde] bg-[#f6f7f7]">
            <img
              src={page.imageUrl}
              alt={page.title}
              className="w-full h-[280px] sm:h-[420px] object-cover"
              referrerPolicy="no-referrer"
            />
            {page.featuredImageCaption && (
              <figcaption className="px-4 py-2 text-xs text-center text-[#646970] italic bg-neutral-50 border-t border-neutral-200">
                {page.featuredImageCaption}
              </figcaption>
            )}
          </figure>
        )}

        {/* Excerpt / Lead Intro */}
        {page.excerpt && (
          <div className="text-base sm:text-lg text-[#1d2327] font-medium leading-relaxed bg-[#f8fafc] p-6 rounded-xl border-l-4 border-[#2271b1]">
            {page.excerpt}
          </div>
        )}

        {/* Executive Highlights / Key Takeaways */}
        {page.keyTakeaways && page.keyTakeaways.length > 0 && (
          <div className="bg-amber-50/70 border border-amber-200/80 rounded-xl p-5 sm:p-6 space-y-3">
            <div className="flex items-center gap-2 text-amber-950 font-bold text-xs uppercase tracking-wider">
              <Sparkles className="w-4 h-4 text-amber-700" />
              <span>Page Highlights & Key Takeaways</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {page.keyTakeaways.map((item, idx) => (
                <div key={idx} className="flex items-start gap-2 text-xs sm:text-sm text-neutral-800">
                  <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Content Sections (Visual Sections Builder Output) */}
        {page.contentSections && page.contentSections.length > 0 ? (
          <div className="space-y-10 text-neutral-800 leading-relaxed pt-2">
            {page.contentSections.map((section, sIdx) => (
              <section key={sIdx} className="space-y-4">
                {section.heading && (
                  <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#1d2327] border-b border-[#e2e4e7] pb-2.5">
                    {section.heading}
                  </h2>
                )}

                {/* Section Image (if added to this section) */}
                {section.imageUrl && (
                  <div className="my-4 rounded-xl overflow-hidden border border-[#dcdcde] shadow-xs">
                    <img
                      src={section.imageUrl}
                      alt={section.heading || 'Page section image'}
                      className="w-full h-64 sm:h-80 object-cover"
                      referrerPolicy="no-referrer"
                    />
                    {section.imageCaption && (
                      <p className="px-3 py-1.5 text-xs text-[#646970] italic bg-[#f6f7f7] border-t border-[#dcdcde]">
                        {section.imageCaption}
                      </p>
                    )}
                  </div>
                )}

                {/* Section Paragraphs with rich internal and external link rendering */}
                <div className="space-y-4 text-sm sm:text-base leading-relaxed text-[#3c434a]">
                  {section.paragraphs.map((p, pIdx) => (
                    <p key={pIdx}>
                      <RichContentText
                        text={p}
                        onInternalNavigate={handleInternalLinkClick}
                      />
                    </p>
                  ))}
                </div>

                {/* Section Sub-points / Checklist */}
                {section.subPoints && section.subPoints.length > 0 && (
                  <div className="bg-[#f6f7f7] border border-[#dcdcde] rounded-xl p-4 sm:p-5 space-y-2.5 mt-4">
                    <strong className="text-xs uppercase font-extrabold tracking-wider text-[#1d2327] block">
                      Key Specifications & Protocols:
                    </strong>
                    <ul className="space-y-2">
                      {section.subPoints.map((point, ptIdx) => (
                        <li key={ptIdx} className="flex items-start gap-2.5 text-xs sm:text-sm text-[#2c3338]">
                          <ChevronRight className="w-4 h-4 text-emerald-800 shrink-0 mt-0.5" />
                          <span>
                            <RichContentText
                              text={point}
                              onInternalNavigate={handleInternalLinkClick}
                            />
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </section>
            ))}
          </div>
        ) : null}

        {/* Fallback to rawContent if sections aren't populated */}
        {(!page.contentSections || page.contentSections.length === 0) && page.rawContent && (
          <div className="prose max-w-none text-[#2c3338] text-sm sm:text-base leading-relaxed space-y-4 pt-4">
            {page.rawContent.split('\n\n').map((block, bIdx) => (
              <p key={bIdx}>
                <RichContentText
                  text={block}
                  onInternalNavigate={handleInternalLinkClick}
                />
              </p>
            ))}
          </div>
        )}

        {/* Action Callout Box (WordPress Page Standard CTA) */}
        <div className="mt-12 pt-8 border-t border-[#dcdcde] bg-gradient-to-br from-emerald-900 to-neutral-900 rounded-2xl p-6 sm:p-8 text-white space-y-5 shadow-lg">
          <div className="space-y-2">
            <span className="px-3 py-1 rounded-full bg-amber-400 text-neutral-950 font-bold text-xs uppercase tracking-wider inline-flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-900" />
              Verified Mandi Supply Guarantee
            </span>
            <h3 className="font-serif text-xl sm:text-2xl font-bold text-amber-300">
              Need Commercial Rice Procurement for Your Operation?
            </h3>
            <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed max-w-2xl">
              Hashir Rice Supplier provides verified 1121 Kainat, Super Kernel, and 1509 Sella basmati rice directly from shellers at Noor Galla Mandi, Bucheki. Test our grain before booking bulk orders.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            {onOpenSampleModal && (
              <button
                onClick={() => onOpenSampleModal('1121 Kainat Sella')}
                className="px-4 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-neutral-950 font-bold text-xs transition-all shadow-md flex items-center gap-2 cursor-pointer"
              >
                <Package className="w-4 h-4 text-neutral-950" />
                <span>Request Free Sample</span>
              </button>
            )}

            {onOpenQuoteModal && (
              <button
                onClick={() => onOpenQuoteModal('1121 Kainat Sella')}
                className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white border border-white/20 font-bold text-xs transition-all flex items-center gap-2 cursor-pointer"
              >
                <FileText className="w-4 h-4 text-amber-300" />
                <span>Get Instant Mandi Quote</span>
              </button>
            )}

            <button
              onClick={() => {
                const text = encodeURIComponent(
                  `Assalam-o-Alaikum Hashir Rice Supplier! I am viewing the page "${page.title}" on Hashir Rice Supplier. I would like to inquire about commercial procurement.`
                );
                window.open(`https://wa.me/923338990883?text=${text}`, '_blank');
              }}
              className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition-all flex items-center gap-2 cursor-pointer"
            >
              <MessageCircle className="w-4 h-4" />
              <span>WhatsApp Mandi Desk</span>
            </button>
          </div>
        </div>

        {/* Admin SEO diagnostic footer when previewing */}
        {isAdminPreview && (
          <div className="mt-8 p-4 bg-[#f0f0f1] border border-[#c3c4c7] rounded-xl text-xs space-y-2 text-[#50575e]">
            <strong className="text-[#1d2327] block font-mono">
              Yoast / Rank Math SEO Diagnostic Preview:
            </strong>
            <div>
              <span className="font-semibold text-neutral-700">SEO Title Tag:</span>{' '}
              <span className="text-[#2271b1] font-semibold">{page.seoTitle || page.title}</span>
            </div>
            <div>
              <span className="font-semibold text-neutral-700">Meta Description:</span>{' '}
              <span>{page.metaDescription || page.excerpt || 'Direct wholesale rice sourcing desk Pakistan.'}</span>
            </div>
          </div>
        )}

      </main>
    </article>
  );
};
