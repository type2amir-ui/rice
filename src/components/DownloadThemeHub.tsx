import React, { useState } from 'react';
import { Download, ShieldCheck, FileCode, CheckCircle2, Copy, Trash2, ArrowLeft, RefreshCw, AlertTriangle } from 'lucide-react';
import { buildWordPressSeoThemeZip, buildWordPressSeoPluginZip, generateWordPressFullWxrXml, generateCompleteSitemapXml, triggerBlobDownload } from '../utils/wordpressPackageBuilder';

interface DownloadThemeHubProps {
  onBackToHome: () => void;
  onSuccessToast?: (msg: string) => void;
}

export const DownloadThemeHub: React.FC<DownloadThemeHubProps> = ({ onBackToHome, onSuccessToast }) => {
  const [downloadingTheme, setDownloadingTheme] = useState(false);
  const [downloadingPlugin, setDownloadingPlugin] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);
  const [pageRemoved, setPageRemoved] = useState(false);

  // 1. Download Theme ZIP
  const handleDownloadThemeZip = async () => {
    try {
      setDownloadingTheme(true);
      const zipBlob = await buildWordPressSeoThemeZip('https://hashirricesupplier.com');
      triggerBlobDownload(zipBlob, 'hashir-rice-seo-wordpress-theme.zip');
      if (onSuccessToast) {
        onSuccessToast('Theme ZIP (v6.0) downloaded! You can upload it via WordPress → Appearance → Themes.');
      }
    } catch (err) {
      console.error(err);
    } finally {
      setDownloadingTheme(false);
    }
  };

  // 2. Download Plugin ZIP
  const handleDownloadPluginZip = () => {
    try {
      setDownloadingPlugin(true);
      const zipBlob = buildWordPressSeoPluginZip('https://hashirricesupplier.com');
      triggerBlobDownload(zipBlob, 'hashir-rice-real-text-seo-plugin.zip');
      if (onSuccessToast) {
        onSuccessToast('Plugin ZIP downloaded! Upload via WordPress → Plugins → Add New.');
      }
    } catch (err) {
      console.error(err);
    } finally {
      setDownloadingPlugin(false);
    }
  };

  // 3. Download Full XML
  const handleDownloadXml = () => {
    const xml = generateWordPressFullWxrXml('https://hashirricesupplier.com');
    const blob = new Blob([xml], { type: 'application/xml;charset=utf-8' });
    triggerBlobDownload(blob, 'hashir-rice-all-pages-content.xml');
    if (onSuccessToast) {
      onSuccessToast('Exported all pages XML for Tools → Import → WordPress.');
    }
  };

  // 4. Download clean sitemap.xml
  const handleDownloadSitemap = () => {
    const xml = generateCompleteSitemapXml('https://hashirricesupplier.com');
    const blob = new Blob([xml], { type: 'application/xml;charset=utf-8' });
    triggerBlobDownload(blob, 'sitemap.xml');
    if (onSuccessToast) {
      onSuccessToast('Downloaded sitemap.xml for Hostinger public_html!');
    }
  };

  // Remove this download page
  const handleRemoveThisDownloadPage = () => {
    if (window.confirm('Do you want to permanently disable and remove this download page from your website? You will be returned to the homepage.')) {
      localStorage.setItem('hashir_hide_download_page', 'true');
      setPageRemoved(true);
      if (onSuccessToast) {
        onSuccessToast('Download page removed and hidden! Returning to Home.');
      }
      setTimeout(() => {
        onBackToHome();
      }, 1200);
    }
  };

  if (pageRemoved) {
    return (
      <div className="max-w-2xl mx-auto py-20 px-4 text-center">
        <div className="w-16 h-16 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center mx-auto mb-4">
          <CheckCircle2 className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-bold text-neutral-900 mb-2">Download Page Successfully Removed</h2>
        <p className="text-neutral-600 text-sm mb-6">This download portal has been disabled. Returning you to the home page...</p>
        <button
          onClick={onBackToHome}
          className="px-5 py-2.5 bg-emerald-700 text-white rounded-lg text-sm font-semibold hover:bg-emerald-800"
        >
          Return to Homepage Now
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-50 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-8">
        
        {/* Navigation & Removal Header */}
        <div className="flex items-center justify-between flex-wrap gap-4 bg-white p-4 rounded-xl border border-neutral-200 shadow-xs">
          <button
            onClick={onBackToHome}
            className="flex items-center gap-2 text-sm font-semibold text-neutral-700 hover:text-emerald-700 cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Hashir Rice Website</span>
          </button>

          <button
            onClick={handleRemoveThisDownloadPage}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-rose-50 text-rose-700 border border-rose-200 hover:bg-rose-100 rounded-lg cursor-pointer transition-colors"
            title="Remove and permanently hide this download page after you finish downloading"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Remove &amp; Hide This Download Page</span>
          </button>
        </div>

        {/* Main Banner */}
        <div className="bg-gradient-to-br from-emerald-900 via-emerald-800 to-neutral-900 text-white rounded-2xl p-6 sm:p-8 shadow-xl">
          <div className="flex items-center gap-2 text-amber-400 text-xs font-bold uppercase tracking-wider mb-2">
            <ShieldCheck className="w-4 h-4" />
            <span>One-Click WordPress Deployment Center</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-white mb-3">
            Download Fixed WordPress Theme &amp; Plugin (.ZIP)
          </h1>
          <p className="text-neutral-200 text-sm max-w-2xl leading-relaxed">
            All errors resolved: the undefined function bug is fixed, the line 2310 syntax error is fixed, “Amir” is removed from FAQs, and the <strong>🌾 Mandi Rates Desk</strong> is included with daily editable rates and broken rice varieties (B1, B2, B3).
          </p>
        </div>

        {/* Primary Download Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Card 1: Theme ZIP */}
          <div className="bg-white rounded-xl border border-neutral-200 p-6 shadow-xs flex flex-col justify-between hover:border-emerald-500 transition-colors">
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="px-2.5 py-1 bg-emerald-100 text-emerald-800 font-bold text-xs rounded-full">
                  Recommended Method
                </span>
                <span className="text-xs text-neutral-500">v6.0 Complete Theme</span>
              </div>
              <h3 className="text-lg font-bold text-neutral-900 mb-2 flex items-center gap-2">
                <FileCode className="w-5 h-5 text-emerald-600" />
                WordPress Theme (.ZIP)
              </h3>
              <p className="text-xs text-neutral-600 mb-4 leading-relaxed">
                Contains complete <code>functions.php</code>, <code>index.php</code>, <code>style.css</code>, and real text files. Upload via <strong>WordPress Admin → Appearance → Themes → Add New → Upload Theme</strong>.
              </p>
              <ul className="text-xs text-neutral-700 space-y-1.5 mb-6">
                <li className="flex items-center gap-2 text-emerald-700">
                  <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                  <span>Fixes <code>hashir_find_seed_page_by_slug()</code> completely</span>
                </li>
                <li className="flex items-center gap-2 text-emerald-700">
                  <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                  <span>Includes daily editable Mandi Rates desk &amp; B1/B2/B3</span>
                </li>
                <li className="flex items-center gap-2 text-emerald-700">
                  <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                  <span>Clean XML sitemap without trailing slash duplicates</span>
                </li>
              </ul>
            </div>

            <button
              onClick={handleDownloadThemeZip}
              disabled={downloadingTheme}
              className="w-full py-3 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg font-bold text-sm flex items-center justify-center gap-2 shadow-sm transition-colors cursor-pointer"
            >
              {downloadingTheme ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
              <span>{downloadingTheme ? 'Generating Theme ZIP...' : 'Download Theme (.ZIP)'}</span>
            </button>
            <a
              href="/hashir-rice-seo-wordpress-theme.zip"
              download="hashir-rice-seo-wordpress-theme.zip"
              className="mt-2 text-center text-xs text-neutral-500 hover:text-emerald-700 hover:underline block font-medium"
            >
              Direct Download Link (hashir-rice-seo-wordpress-theme.zip)
            </a>
          </div>

          {/* Card 2: Plugin ZIP */}
          <div className="bg-white rounded-xl border border-neutral-200 p-6 shadow-xs flex flex-col justify-between hover:border-amber-500 transition-colors">
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="px-2.5 py-1 bg-amber-100 text-amber-800 font-bold text-xs rounded-full">
                  Alternative Method
                </span>
                <span className="text-xs text-neutral-500">Standalone Plugin</span>
              </div>
              <h3 className="text-lg font-bold text-neutral-900 mb-2 flex items-center gap-2">
                <FileCode className="w-5 h-5 text-amber-600" />
                SEO &amp; Rates Plugin (.ZIP)
              </h3>
              <p className="text-xs text-neutral-600 mb-4 leading-relaxed">
                If you already have a theme and just want the auto-sitemap, real text generator, and Mandi desk without touching your theme files. Upload via <strong>Plugins → Add New → Upload Plugin</strong>.
              </p>
              <ul className="text-xs text-neutral-700 space-y-1.5 mb-6">
                <li className="flex items-center gap-2 text-neutral-700">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>Works independently of any active theme</span>
                </li>
                <li className="flex items-center gap-2 text-neutral-700">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>Adds 🌾 Mandi Rates Desk menu to WordPress</span>
                </li>
                <li className="flex items-center gap-2 text-neutral-700">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>Dynamic /sitemap.xml handler</span>
                </li>
              </ul>
            </div>

            <button
              onClick={handleDownloadPluginZip}
              disabled={downloadingPlugin}
              className="w-full py-3 bg-amber-500 hover:bg-amber-600 text-neutral-950 rounded-lg font-bold text-sm flex items-center justify-center gap-2 shadow-sm transition-colors cursor-pointer"
            >
              {downloadingPlugin ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
              <span>{downloadingPlugin ? 'Generating Plugin ZIP...' : 'Download Plugin (.ZIP)'}</span>
            </button>
          </div>

        </div>

        {/* Secondary Downloads: XML Data */}
        <div className="bg-white rounded-xl border border-neutral-200 p-6 shadow-xs">
          <h3 className="text-sm font-bold text-neutral-900 mb-3">Additional Files:</h3>
          <div className="flex flex-wrap gap-3">
            <button
              onClick={handleDownloadXml}
              className="px-4 py-2 bg-neutral-100 hover:bg-neutral-200 text-neutral-800 rounded-lg text-xs font-semibold flex items-center gap-2 cursor-pointer transition-colors"
            >
              <Download className="w-3.5 h-3.5 text-neutral-600" />
              <span>Download Real-Text WXR XML (Tools → Import)</span>
            </button>

            <button
              onClick={handleDownloadSitemap}
              className="px-4 py-2 bg-neutral-100 hover:bg-neutral-200 text-neutral-800 rounded-lg text-xs font-semibold flex items-center gap-2 cursor-pointer transition-colors"
            >
              <Download className="w-3.5 h-3.5 text-neutral-600" />
              <span>Download Static sitemap.xml</span>
            </button>
          </div>
        </div>

        {/* How to Remove This Page Notice */}
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-5 flex items-start gap-3 text-xs text-amber-900">
          <AlertTriangle className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <p className="font-bold">How to remove this download page after you are done:</p>
            <p>
              Once you have downloaded the <strong>Theme ZIP</strong> or <strong>Plugin ZIP</strong>, simply click the red <strong>“Remove &amp; Hide This Download Page”</strong> button at the top right of this page. It will immediately vanish from your website and route all visitors back to your homepage.
            </p>
          </div>
        </div>

      </div>
    </div>
  );
};
