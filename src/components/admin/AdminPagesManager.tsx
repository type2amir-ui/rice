import React, { useState, useEffect } from 'react';
import {
  FileText,
  Plus,
  Trash2,
  Edit,
  Eye,
  Search,
  CheckCircle2,
  Calendar,
  User,
  Tag,
  Clock,
  Sparkles,
  Image as ImageIcon,
  Link as LinkIcon,
  ExternalLink,
  ArrowLeft,
  ChevronDown,
  ChevronUp,
  Save,
  Check,
  Layers,
  Heading,
  AlignLeft,
  List,
  Quote,
  Minus,
  X,
  UploadCloud,
  HelpCircle,
  Globe,
  Sliders,
  Filter
} from 'lucide-react';
import { CITIES_DATA } from '../../data/citiesData';
import {
  DEFAULT_PAGES_DATA,
  getSyncedWordPressPages,
  buildAllWordPressPagesWithRealText,
  buildPageRealHtmlContent,
  autoTrashDuplicatePagesList,
  ADMIN_PAGES_STORAGE_KEY
} from '../../data/defaultPagesData';
import { WordPressPage } from '../../types';
import { WordPressSinglePageView } from '../WordPressSinglePageView';
import { RankMathSeoMetabox } from './RankMathSeoMetabox';
import {
  buildWordPressSeoThemeZip,
  generateWordPressFullWxrXml,
  generateCompleteSitemapXml,
  triggerBlobDownload
} from '../../utils/wordpressPackageBuilder';

interface AdminPagesManagerProps {
  onSuccessToast?: (msg: string) => void;
}

// Preset verified rice industry imagery for Page featured and section images
const RICE_IMAGE_PRESETS = [
  {
    label: 'Basmati Paddy Harvest & Farming',
    url: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&q=80&w=1200',
    caption: 'Basmati paddy arriving from Punjab agricultural tracts.'
  },
  {
    label: 'Optical Sortex Machine Grading',
    url: 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?auto=format&fit=crop&q=80&w=1200',
    caption: 'Buhler multi-pass optical sorter ejecting chalky and discolored grains.'
  },
  {
    label: 'Noor Galla Mandi Dispatch Hub',
    url: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&q=80&w=1200',
    caption: 'Freight trailers loading 50kg export polypropylene bags at Bucheki hub.'
  },
  {
    label: 'Cooked Biryani Grain Elongation Test',
    url: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&q=80&w=1200',
    caption: '1121 Kainat Basmati achieving 22mm+ post-cooking elongation for restaurant daig.'
  },
  {
    label: 'Grain Moisture & Laboratory Testing',
    url: 'https://images.unsplash.com/photo-1628352081506-83c43123ed6d?auto=format&fit=crop&q=80&w=1200',
    caption: 'Digital moisture meter verification (calibrated to 12.0% safe threshold).'
  },
  {
    label: 'Wholesale Warehousing & Storage',
    url: 'https://images.unsplash.com/photo-1589923188900-85dae523342b?auto=format&fit=crop&q=80&w=1200',
    caption: 'Climate-monitored warehouse storage preventing pest and damp infestation.'
  }
];

// Preset internal links for quick 1-click insertion into page content (100% Canonical No-Slash URLs)
const INTERNAL_LINK_PRESETS = [
  { label: 'Rice Catalog & Varieties (/varieties)', url: '/varieties' },
  { label: 'Mandi Live Exchange & Spot Rates (/exchange)', url: '/exchange' },
  { label: 'Major Sourcing Cities Directory (/locations)', url: '/locations' },
  { label: 'Karachi Port Wholesale Hub (/rice-supplier-karachi)', url: '/rice-supplier-karachi' },
  { label: 'Lahore Restaurant Supply (/rice-supplier-lahore)', url: '/rice-supplier-lahore' },
  { label: 'Rawalpindi / Islamabad Supply (/rice-supplier-rawalpindi)', url: '/rice-supplier-rawalpindi' },
  { label: 'Peshawar Mandi Corridor (/rice-supplier-peshawar)', url: '/rice-supplier-peshawar' },
  { label: 'Order Free Grain Sample (/sample-request)', url: '/sample-request' },
  { label: 'Rice Mills & Sellers B2B Portal (/seller-portal)', url: '/seller-portal' },
  { label: 'Mandi Sourcing Workflow & Quality Guide (/workflow)', url: '/workflow' },
  { label: 'Mandi Trading FAQs (/faqs)', url: '/faqs' },
  { label: 'About Us & Galla Mandi Heritage (/about-us)', url: '/about-us' }
];

// Preset external authority references
const EXTERNAL_LINK_PRESETS = [
  { label: 'REAP (Rice Exporters Association of Pakistan)', url: 'https://reap.org.pk' },
  { label: 'TDAP (Trade Development Authority of Pakistan)', url: 'https://tdap.gov.pk' },
  { label: 'USDA Grain Economics & World Rice Outlook', url: 'https://usda.gov' }
];

export const AdminPagesManager: React.FC<AdminPagesManagerProps> = ({ onSuccessToast }) => {
  // Load all pages with 100% real text from synced storage
  const [pages, setPages] = useState<WordPressPage[]>(() => getSyncedWordPressPages());

  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState<'All' | 'city-hub' | 'standard' | 'commercial' | 'custom' | 'Trash'>('All');
  
  // View states: 'list' | 'editor' | 'preview'
  const [viewMode, setViewMode] = useState<'list' | 'editor' | 'preview'>('list');
  const [currentPage, setCurrentPage] = useState<WordPressPage | null>(null);
  const [isEditingExisting, setIsEditingExisting] = useState(false);

  // Editor mode tab: 'sections' | 'raw'
  const [editorTab, setEditorTab] = useState<'sections' | 'raw'>('sections');

  // Modals for adding media and links into page
  const [showMediaModal, setShowMediaModal] = useState(false);
  const [showLinkModal, setShowLinkModal] = useState(false);
  const [activeSectionIndexForMedia, setActiveSectionIndexForMedia] = useState<number | null>(null);

  // Form states for adding link modal
  const [linkModalData, setLinkModalData] = useState({
    url: '/varieties',
    text: 'Explore Wholesale Rice Varieties',
    targetBlank: false
  });

  // Form states for adding media modal
  const [mediaModalData, setMediaModalData] = useState({
    url: RICE_IMAGE_PRESETS[0].url,
    caption: RICE_IMAGE_PRESETS[0].caption,
    alt: 'Pakistan wholesale basmati rice',
    target: 'section' // 'section' or 'featured'
  });

  // Function to persist pages in localStorage and sync with frontend
  const savePages = (updated: WordPressPage[]) => {
    setPages(updated);
    localStorage.setItem(ADMIN_PAGES_STORAGE_KEY, JSON.stringify(updated));
    localStorage.setItem('hashir_rice_admin_pages', JSON.stringify(updated));
    window.dispatchEvent(new Event('hashir_pages_updated'));
  };

  // Export all pages with 100% real HTML text as a WordPress WXR XML file
  const handleDownloadWordPressRealTextXml = () => {
    const fullXml = generateWordPressFullWxrXml('https://hashirricesupplier.com');
    const blob = new Blob([fullXml], { type: 'application/xml;charset=utf-8' });
    triggerBlobDownload(blob, 'hashir-rice-all-114-pages-wordpress-import.xml');
    if (onSuccessToast) {
      onSuccessToast(`Exported all ${pages.length} pages with 100% Real Text & HTML for WordPress Import!`);
    }
  };

  // Export complete WordPress Theme ZIP (v5.0 with Original Design + Auto-Page Seeder & Full Sitemap Links)
  const handleDownloadWordPressThemeZip = async () => {
    const zipBlob = await buildWordPressSeoThemeZip('https://hashirricesupplier.com');
    triggerBlobDownload(zipBlob, 'hashir-rice-seo-wordpress-theme.zip');
    if (onSuccessToast) {
      onSuccessToast('Downloaded hashir-rice-seo-wordpress-theme.zip (v5.0 Original Design + Real Editor Text)!');
    }
  };

  // Export complete Google Search Console sitemap.xml
  const handleDownloadSitemapXml = () => {
    const sitemapXml = generateCompleteSitemapXml('https://hashirricesupplier.com');
    const blob = new Blob([sitemapXml], { type: 'application/xml;charset=utf-8' });
    triggerBlobDownload(blob, 'sitemap.xml');
    if (onSuccessToast) {
      onSuccessToast('Downloaded complete sitemap.xml (120+ URLs) for Hostinger public_html!');
    }
  };

  // Sync/Restore all pages with 100% full real text
  const handleRestoreAllRealText = () => {
    const fresh = buildAllWordPressPagesWithRealText();
    savePages(fresh);
    if (onSuccessToast) {
      onSuccessToast(`All ${fresh.length} pages populated with 100% Real Text & HTML!`);
    }
  };

  // Helper to generate slug
  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '');
  };

  // Initialize a clean new page
  const handleAddNewPage = () => {
    const newPage: WordPressPage = {
      id: `page-${Date.now()}`,
      title: '',
      slug: '',
      type: 'custom',
      status: 'Published',
      lastModified: new Date().toISOString().split('T')[0],
      template: 'default',
      imageUrl: RICE_IMAGE_PRESETS[2].url,
      featuredImageCaption: 'Commercial rice supply desk at Noor Galla Mandi, Bucheki.',
      excerpt: '',
      keyTakeaways: [
        'Direct procurement from Noor Galla Mandi, Bucheki.',
        'Optical sortex machine graded with certified moisture compliance.',
        'Wholesale Bilty dispatch with weighbridge certification.'
      ],
      contentSections: [
        {
          heading: 'Overview & Sourcing Specifications',
          paragraphs: [
            'Hashir Rice Supplier provides verified wholesale basmati rice procurement directly from shellers at Noor Galla Mandi, Bucheki. We eliminate speculative wholesale intermediaries to deliver genuine milling authenticity.',
            'You can browse our [Rice Catalog & Varieties](/varieties) or view live spot rates on our [Mandi Live Exchange](/exchange).'
          ],
          subPoints: [
            'Tested for raw grain length, cooking elongation, and aroma purity.',
            'Moisture calibrated to 12.0% safe storage threshold.',
            'Dispatched via verified freight trucks across Pakistan.'
          ],
          imageUrl: RICE_IMAGE_PRESETS[0].url,
          imageCaption: 'Paddy intake and quality grading inspection.'
        }
      ],
      seoTitle: '',
      metaDescription: '',
      author: {
        name: 'Hashir Rice Supplier',
        role: 'Direct Mandi Sourcing Desk (Owner: Muhammad Amir Shahzad)',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200'
      }
    };
    setCurrentPage(newPage);
    setIsEditingExisting(false);
    setViewMode('editor');
    setEditorTab('sections');
  };

  // Open existing page for editing
  const handleEditPage = (page: WordPressPage) => {
    // Ensure contentSections exists
    const safePage: WordPressPage = {
      ...page,
      template: page.template || 'default',
      imageUrl: page.imageUrl || RICE_IMAGE_PRESETS[0].url,
      featuredImageCaption: page.featuredImageCaption || '',
      keyTakeaways: page.keyTakeaways && page.keyTakeaways.length > 0 ? page.keyTakeaways : [
        'Direct procurement from Noor Galla Mandi, Bucheki.',
        'Certified moisture tolerance and weighbridge verification.'
      ],
      contentSections: page.contentSections && page.contentSections.length > 0 ? page.contentSections : [
        {
          heading: 'Page Content & Overview',
          paragraphs: [page.metaDescription || 'Direct rice sourcing and procurement operations in Pakistan.'],
          subPoints: []
        }
      ],
      author: page.author || {
        name: 'Hashir Rice Supplier',
        role: 'Direct Mandi Sourcing Desk (Owner: Muhammad Amir Shahzad)',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200'
      }
    };
    setCurrentPage(safePage);
    setIsEditingExisting(true);
    setViewMode('editor');
    setEditorTab('sections');
  };

  // Preview page in authentic WordPress page view
  const handlePreviewPage = (page: WordPressPage) => {
    setCurrentPage(page);
    setViewMode('preview');
  };

  // Move page to Trash or Delete permanently if already in Trash
  const handleDeletePage = (id: string, title: string) => {
    const target = pages.find((p) => p.id === id);
    if (!target) return;
    if (target.status === 'Trash') {
      const updated = pages.filter((p) => p.id !== id);
      savePages(updated);
      if (onSuccessToast) onSuccessToast(`Page "${title}" permanently deleted from Trash & Sitemap.`);
    } else {
      const updated = pages.map((p) => (p.id === id ? { ...p, status: 'Trash' as const } : p));
      savePages(updated);
      if (onSuccessToast) onSuccessToast(`Moved "${title}" to Trash Box and removed from Sitemap.xml!`);
    }
  };

  // Restore page from Trash Box
  const handleRestoreFromTrash = (id: string, title: string) => {
    const updated = pages.map((p) => (p.id === id ? { ...p, status: 'Published' as const } : p));
    savePages(updated);
    if (onSuccessToast) onSuccessToast(`Restored "${title}" from Trash Box.`);
  };

  // 1-Click Scan & Send All Duplicate Pages to Trash Box + Remove from Sitemap
  const handleScanAndTrashDuplicatePages = () => {
    const { cleaned, trashedCount } = autoTrashDuplicatePagesList(pages);
    savePages(cleaned);
    if (onSuccessToast) {
      if (trashedCount > 0) {
        onSuccessToast(`Scanned website: Sent ${trashedCount} duplicate page(s) to Trash Box and removed from sitemap.xml!`);
      } else {
        onSuccessToast('Duplicate Scan Complete: 0 duplicate pages found! All active pages are 100% unique and Trashed pages are excluded from sitemap.xml.');
      }
    }
  };

  // Save / Publish page
  const handleSavePage = (statusToSet?: 'Published' | 'Draft') => {
    if (!currentPage) return;
    if (!currentPage.title.trim()) {
      alert('Please enter a Page Title before saving.');
      return;
    }

    const finalSlug = currentPage.slug ? generateSlug(currentPage.slug) : generateSlug(currentPage.title);
    const updatedStatus = statusToSet || currentPage.status || 'Published';
    const syncedRawHtml =
      editorTab === 'raw' && currentPage.rawContent
        ? currentPage.rawContent
        : buildPageRealHtmlContent(
            currentPage.title,
            currentPage.excerpt,
            currentPage.keyTakeaways,
            currentPage.contentSections
          );

    const finalPage: WordPressPage = {
      ...currentPage,
      slug: finalSlug,
      status: updatedStatus,
      rawContent: syncedRawHtml,
      lastModified: new Date().toISOString().split('T')[0],
      seoTitle: currentPage.seoTitle || `${currentPage.title} | Hashir Rice Supplier Pakistan`,
      metaDescription: currentPage.metaDescription || currentPage.excerpt || `${currentPage.title} - Direct wholesale rice sourcing and bilty procurement from Noor Galla Mandi Bucheki.`
    };

    let updatedList: WordPressPage[];
    if (isEditingExisting) {
      updatedList = pages.map((p) => (p.id === finalPage.id ? finalPage : p));
      if (onSuccessToast) onSuccessToast(`Page "${finalPage.title}" updated successfully.`);
    } else {
      updatedList = [finalPage, ...pages];
      if (onSuccessToast) onSuccessToast(`Page "${finalPage.title}" created and published.`);
    }

    savePages(updatedList);
    setCurrentPage(finalPage);
    setIsEditingExisting(true);
  };

  // Section manipulation helpers
  const handleAddSection = () => {
    if (!currentPage) return;
    const newSection = {
      heading: 'New Section Heading',
      paragraphs: ['Write your paragraph text here. You can add internal links like [Rice Catalog](/varieties) or external references.'],
      subPoints: ['Key specification bullet point or trading standard.']
    };
    setCurrentPage({
      ...currentPage,
      contentSections: [...currentPage.contentSections, newSection]
    });
  };

  const handleRemoveSection = (index: number) => {
    if (!currentPage) return;
    if (currentPage.contentSections.length <= 1) {
      alert('A page should have at least one content section.');
      return;
    }
    const updated = currentPage.contentSections.filter((_, idx) => idx !== index);
    setCurrentPage({ ...currentPage, contentSections: updated });
  };

  const handleMoveSection = (index: number, direction: 'up' | 'down') => {
    if (!currentPage) return;
    const newSections = [...currentPage.contentSections];
    const targetIdx = direction === 'up' ? index - 1 : index + 1;
    if (targetIdx < 0 || targetIdx >= newSections.length) return;
    const temp = newSections[index];
    newSections[index] = newSections[targetIdx];
    newSections[targetIdx] = temp;
    setCurrentPage({ ...currentPage, contentSections: newSections });
  };

  const handleAddParagraph = (sectionIdx: number) => {
    if (!currentPage) return;
    const newSections = [...currentPage.contentSections];
    newSections[sectionIdx].paragraphs.push('New paragraph text. Add specifications, cooking instructions, or commercial trade details.');
    setCurrentPage({ ...currentPage, contentSections: newSections });
  };

  const handleRemoveParagraph = (sectionIdx: number, pIdx: number) => {
    if (!currentPage) return;
    const newSections = [...currentPage.contentSections];
    if (newSections[sectionIdx].paragraphs.length <= 1) {
      alert('Each section must have at least one paragraph.');
      return;
    }
    newSections[sectionIdx].paragraphs = newSections[sectionIdx].paragraphs.filter((_, idx) => idx !== pIdx);
    setCurrentPage({ ...currentPage, contentSections: newSections });
  };

  const handleAddSubpoint = (sectionIdx: number) => {
    if (!currentPage) return;
    const newSections = [...currentPage.contentSections];
    if (!newSections[sectionIdx].subPoints) {
      newSections[sectionIdx].subPoints = [];
    }
    newSections[sectionIdx].subPoints!.push('Specific protocol or grain benchmark.');
    setCurrentPage({ ...currentPage, contentSections: newSections });
  };

  const handleRemoveSubpoint = (sectionIdx: number, spIdx: number) => {
    if (!currentPage) return;
    const newSections = [...currentPage.contentSections];
    if (!newSections[sectionIdx].subPoints) return;
    newSections[sectionIdx].subPoints = newSections[sectionIdx].subPoints!.filter((_, idx) => idx !== spIdx);
    setCurrentPage({ ...currentPage, contentSections: newSections });
  };

  // Key takeaways manipulation
  const handleAddTakeaway = () => {
    if (!currentPage) return;
    setCurrentPage({
      ...currentPage,
      keyTakeaways: [...(currentPage.keyTakeaways || []), 'New key takeaway or commercial highlight.']
    });
  };

  const handleRemoveTakeaway = (index: number) => {
    if (!currentPage) return;
    const updated = (currentPage.keyTakeaways || []).filter((_, idx) => idx !== index);
    setCurrentPage({ ...currentPage, keyTakeaways: updated });
  };

  // Media Insertion
  const handleInsertMedia = () => {
    if (!currentPage) return;
    if (mediaModalData.target === 'featured') {
      setCurrentPage({
        ...currentPage,
        imageUrl: mediaModalData.url,
        featuredImageCaption: mediaModalData.caption
      });
      if (onSuccessToast) onSuccessToast('Featured Image updated.');
    } else if (mediaModalData.target === 'section' && activeSectionIndexForMedia !== null) {
      const newSections = [...currentPage.contentSections];
      newSections[activeSectionIndexForMedia].imageUrl = mediaModalData.url;
      newSections[activeSectionIndexForMedia].imageCaption = mediaModalData.caption;
      setCurrentPage({
        ...currentPage,
        contentSections: newSections
      });
      if (onSuccessToast) onSuccessToast(`Image inserted into Section ${activeSectionIndexForMedia + 1}.`);
    }
    setShowMediaModal(false);
  };

  // Link Insertion
  const handleInsertLink = () => {
    if (!currentPage) return;
    const linkMarkdown = `[${linkModalData.text}](${linkModalData.url})`;

    if (activeSectionIndexForMedia !== null && currentPage.contentSections[activeSectionIndexForMedia]) {
      const newSections = [...currentPage.contentSections];
      const pCount = newSections[activeSectionIndexForMedia].paragraphs.length;
      if (pCount > 0) {
        newSections[activeSectionIndexForMedia].paragraphs[pCount - 1] += ` ${linkMarkdown}`;
      } else {
        newSections[activeSectionIndexForMedia].paragraphs.push(linkMarkdown);
      }
      setCurrentPage({
        ...currentPage,
        contentSections: newSections
      });
      if (onSuccessToast) onSuccessToast(`Link inserted into Section ${activeSectionIndexForMedia + 1}.`);
    } else {
      if (currentPage.contentSections.length > 0) {
        const newSections = [...currentPage.contentSections];
        newSections[0].paragraphs[0] += ` ${linkMarkdown}`;
        setCurrentPage({ ...currentPage, contentSections: newSections });
        if (onSuccessToast) onSuccessToast('Link inserted into Section 1.');
      }
    }
    setShowLinkModal(false);
  };

  // Filtered pages for table (Trash tab shows only Trashed pages; other tabs exclude Trashed pages)
  const trashedPagesCount = pages.filter((p) => p.status === 'Trash').length;
  const activePublishedCount = pages.filter((p) => p.status !== 'Trash').length;
  const filteredPages = pages.filter((p) => {
    const matchesSearch =
      p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.slug.toLowerCase().includes(searchTerm.toLowerCase());
    if (typeFilter === 'Trash') {
      return p.status === 'Trash' && matchesSearch;
    }
    if (p.status === 'Trash') return false;
    const matchesType = typeFilter === 'All' || p.type === typeFilter;
    return matchesSearch && matchesType;
  });

  // RENDER 1: AUTHENTIC WORDPRESS SINGLE PAGE PREVIEW
  if (viewMode === 'preview' && currentPage) {
    return (
      <WordPressSinglePageView
        page={currentPage}
        isAdminPreview={true}
        onBack={() => setViewMode('editor')}
        onEdit={(p) => {
          setCurrentPage(p);
          setViewMode('editor');
        }}
        onInternalNavigate={(url) => {
          // Open route in new tab or notify
          const clean = url.replace(/^\//, '');
          window.location.hash = `#${clean}`;
        }}
      />
    );
  }

  // RENDER 2: WORDPRESS PAGE EDITOR (page-new.php / page.php style)
  if (viewMode === 'editor' && currentPage) {
    return (
      <div className="space-y-4 pb-20 animate-in fade-in duration-200">
        {/* Top WordPress Action Bar */}
        <div className="bg-white border border-[#c3c4c7] rounded-lg p-4 shadow-xs flex flex-wrap items-center justify-between gap-3 sticky top-2 z-30">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setViewMode('list')}
              className="p-1.5 hover:bg-neutral-100 rounded-md text-[#50575e] hover:text-[#1d2327] transition-colors cursor-pointer flex items-center gap-1.5 text-xs font-semibold"
              title="Return to Pages list"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>All Pages</span>
            </button>
            <div className="h-4 w-px bg-neutral-300"></div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-sm text-[#1d2327] font-serif">
                {isEditingExisting ? 'Edit Page' : 'Add New Page'}
              </span>
              <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                currentPage.status === 'Published'
                  ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                  : 'bg-amber-100 text-amber-900 border border-amber-300'
              }`}>
                {currentPage.status || 'Published'}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => handlePreviewPage(currentPage)}
              className="px-3.5 py-1.5 border border-[#2271b1] text-[#2271b1] hover:bg-blue-50 rounded-md text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Eye className="w-3.5 h-3.5" />
              <span>Preview Page</span>
            </button>

            <button
              onClick={() => handleSavePage('Draft')}
              className="px-3.5 py-1.5 bg-neutral-100 hover:bg-neutral-200 text-[#2c3338] border border-[#8c8f94] rounded-md text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Save className="w-3.5 h-3.5" />
              <span>Save Draft</span>
            </button>

            <button
              onClick={() => handleSavePage('Published')}
              className="px-4 py-1.5 bg-[#2271b1] hover:bg-[#135e96] text-white rounded-md text-xs font-bold flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer"
            >
              <Check className="w-3.5 h-3.5" />
              <span>{isEditingExisting ? 'Update Page' : 'Publish Page'}</span>
            </button>
          </div>
        </div>

        {/* Main 2-Column WordPress Layout: Content Canvas (left) + Document Settings Sidebar (right) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* LEFT 8 COLS: Title, Permalink, Content Sections, Media & Links */}
          <div className="lg:col-span-8 space-y-5">
            
            {/* 1. Page Title & Permalink Box */}
            <div className="bg-white border border-[#c3c4c7] rounded-lg p-5 shadow-xs space-y-3">
              <label className="block text-xs font-bold text-[#50575e] uppercase tracking-wider">
                Page Title
              </label>
              <input
                type="text"
                value={currentPage.title}
                onChange={(e) => {
                  const newTitle = e.target.value;
                  setCurrentPage({
                    ...currentPage,
                    title: newTitle,
                    slug: currentPage.slug || generateSlug(newTitle)
                  });
                }}
                placeholder="Add page title (e.g., Rawalpindi Rice Sourcing Hub)"
                className="w-full text-2xl sm:text-3xl font-serif font-bold text-[#1d2327] placeholder:text-neutral-300 border-b border-[#c3c4c7] pb-2 focus:border-[#2271b1] outline-none transition-colors"
              />

              {/* WordPress Permalink Bar */}
              <div className="flex flex-wrap items-center gap-1.5 text-xs text-[#50575e] pt-1 font-mono">
                <span className="font-sans font-semibold text-[#1d2327]">Permalink:</span>
                <span className="text-[#2271b1]">https://hashirricesupplier.com/</span>
                <input
                  type="text"
                  value={currentPage.slug}
                  onChange={(e) => setCurrentPage({ ...currentPage, slug: generateSlug(e.target.value) })}
                  placeholder="page-slug"
                  className="px-2 py-0.5 border border-[#8c8f94] rounded text-xs text-[#2271b1] font-mono font-bold bg-[#f6f7f7] focus:bg-white focus:border-[#2271b1] outline-none"
                />
                <button
                  type="button"
                  onClick={() => {
                    const freshSlug = generateSlug(currentPage.title);
                    setCurrentPage({ ...currentPage, slug: freshSlug });
                    if (onSuccessToast) onSuccessToast(`Slug regenerated: /${freshSlug}`);
                  }}
                  className="px-2 py-0.5 text-[11px] font-sans font-semibold text-[#50575e] hover:text-[#1d2327] underline cursor-pointer"
                >
                  Generate Slug
                </button>
              </div>
            </div>

            {/* 2. Content Tools Bar (Add Media, Add Link, Copy Real Text for WordPress) */}
            <div className="bg-white border border-[#c3c4c7] rounded-lg p-3 shadow-xs flex flex-wrap items-center justify-between gap-3">
              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setActiveSectionIndexForMedia(0);
                    setMediaModalData({
                      ...mediaModalData,
                      target: 'section'
                    });
                    setShowMediaModal(true);
                  }}
                  className="px-3 py-1.5 bg-[#f0f0f1] hover:bg-[#dcdcde] text-[#2c3338] rounded border border-[#8c8f94] text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-2xs"
                >
                  <ImageIcon className="w-3.5 h-3.5 text-[#2271b1]" />
                  <span>Add Media / Image</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setActiveSectionIndexForMedia(0);
                    setShowLinkModal(true);
                  }}
                  className="px-3 py-1.5 bg-[#f0f0f1] hover:bg-[#dcdcde] text-[#2c3338] rounded border border-[#8c8f94] text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-2xs"
                >
                  <LinkIcon className="w-3.5 h-3.5 text-emerald-700" />
                  <span>Insert Link (Internal / External)</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    const htmlText =
                      currentPage.rawContent ||
                      buildPageRealHtmlContent(
                        currentPage.title,
                        currentPage.excerpt,
                        currentPage.keyTakeaways,
                        currentPage.contentSections
                      );
                    navigator.clipboard.writeText(htmlText);
                    if (onSuccessToast) {
                      onSuccessToast(`Copied full real HTML text of "${currentPage.title}" to clipboard!`);
                    }
                  }}
                  className="px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-900 rounded border border-emerald-300 text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-2xs"
                >
                  <FileText className="w-3.5 h-3.5 text-emerald-700" />
                  <span>Copy Full Real Text / HTML</span>
                </button>
              </div>

              {/* Tab Selector: Visual Builder vs Raw Markdown */}
              <div className="flex items-center rounded-lg border border-[#c3c4c7] p-0.5 bg-[#f6f7f7]">
                <button
                  type="button"
                  onClick={() => setEditorTab('sections')}
                  className={`px-3 py-1 text-xs font-bold rounded transition-colors cursor-pointer ${
                    editorTab === 'sections'
                      ? 'bg-white text-[#2271b1] shadow-2xs'
                      : 'text-[#646970] hover:text-[#1d2327]'
                  }`}
                >
                  Visual Sections Builder
                </button>
                <button
                  type="button"
                  onClick={() => setEditorTab('raw')}
                  className={`px-3 py-1 text-xs font-bold rounded transition-colors cursor-pointer ${
                    editorTab === 'raw'
                      ? 'bg-white text-[#2271b1] shadow-2xs'
                      : 'text-[#646970] hover:text-[#1d2327]'
                  }`}
                >
                  Markdown / Code
                </button>
              </div>
            </div>

            {/* 3. VISUAL SECTIONS BUILDER (Unlimited Body of Content) */}
            {editorTab === 'sections' ? (
              <div className="space-y-4">
                {currentPage.contentSections.map((section, sIdx) => (
                  <div
                    key={sIdx}
                    className="bg-white border border-[#c3c4c7] rounded-lg shadow-xs p-5 space-y-4 transition-all hover:border-[#8c8f94]"
                  >
                    {/* Section Header with controls */}
                    <div className="flex items-center justify-between border-b border-[#f0f0f1] pb-3">
                      <div className="flex items-center gap-2">
                        <span className="w-6 h-6 rounded-full bg-[#f0f0f1] text-[#2c3338] text-xs font-bold flex items-center justify-center font-mono">
                          {sIdx + 1}
                        </span>
                        <span className="text-xs font-bold text-[#50575e] uppercase tracking-wider">
                          Content Section
                        </span>
                      </div>

                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          onClick={() => handleMoveSection(sIdx, 'up')}
                          disabled={sIdx === 0}
                          title="Move section up"
                          className="p-1 text-[#50575e] hover:text-[#1d2327] disabled:opacity-30 cursor-pointer"
                        >
                          <ChevronUp className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleMoveSection(sIdx, 'down')}
                          disabled={sIdx === currentPage.contentSections.length - 1}
                          title="Move section down"
                          className="p-1 text-[#50575e] hover:text-[#1d2327] disabled:opacity-30 cursor-pointer"
                        >
                          <ChevronDown className="w-4 h-4" />
                        </button>
                        <div className="h-3 w-px bg-neutral-200 mx-1"></div>
                        <button
                          type="button"
                          onClick={() => handleRemoveSection(sIdx)}
                          title="Delete section"
                          className="p-1 text-rose-600 hover:text-rose-800 cursor-pointer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    {/* Section Heading (H2/H3) */}
                    <div>
                      <label className="block text-xs font-semibold text-[#1d2327] mb-1 flex items-center gap-1.5">
                        <Heading className="w-3.5 h-3.5 text-[#2271b1]" />
                        <span>Section Heading (H2)</span>
                      </label>
                      <input
                        type="text"
                        value={section.heading}
                        onChange={(e) => {
                          const newSections = [...currentPage.contentSections];
                          newSections[sIdx].heading = e.target.value;
                          setCurrentPage({ ...currentPage, contentSections: newSections });
                        }}
                        placeholder="e.g. Sourcing Standards & Optical Sortex Quality"
                        className="w-full px-3 py-2 text-sm font-bold text-[#1d2327] border border-[#8c8f94] rounded focus:border-[#2271b1] outline-none"
                      />
                    </div>

                    {/* Inline Section Image (if attached) */}
                    {section.imageUrl ? (
                      <div className="p-3 bg-[#f6f7f7] border border-[#dcdcde] rounded-lg space-y-2">
                        <div className="flex items-center justify-between text-xs">
                          <span className="font-bold text-[#1d2327] flex items-center gap-1.5">
                            <ImageIcon className="w-3.5 h-3.5 text-emerald-700" />
                            <span>Section Image Attached</span>
                          </span>
                          <button
                            type="button"
                            onClick={() => {
                              const newSections = [...currentPage.contentSections];
                              newSections[sIdx].imageUrl = undefined;
                              newSections[sIdx].imageCaption = undefined;
                              setCurrentPage({ ...currentPage, contentSections: newSections });
                            }}
                            className="text-rose-600 hover:text-rose-800 text-xs font-semibold cursor-pointer"
                          >
                            Remove Image
                          </button>
                        </div>
                        <div className="flex items-center gap-3">
                          <img
                            src={section.imageUrl}
                            alt="Section illustration"
                            className="w-24 h-16 object-cover rounded border border-[#c3c4c7]"
                          />
                          <div className="flex-1">
                            <input
                              type="text"
                              value={section.imageCaption || ''}
                              onChange={(e) => {
                                const newSections = [...currentPage.contentSections];
                                newSections[sIdx].imageCaption = e.target.value;
                                setCurrentPage({ ...currentPage, contentSections: newSections });
                              }}
                              placeholder="Image caption / specification..."
                              className="w-full px-2 py-1 text-xs border border-[#8c8f94] rounded bg-white"
                            />
                          </div>
                        </div>
                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={() => {
                          setActiveSectionIndexForMedia(sIdx);
                          setMediaModalData({
                            ...mediaModalData,
                            target: 'section'
                          });
                          setShowMediaModal(true);
                        }}
                        className="text-xs text-[#2271b1] hover:text-[#135e96] font-semibold flex items-center gap-1 cursor-pointer"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Insert Image into this Section</span>
                      </button>
                    )}

                    {/* Section Paragraphs (unlimited) */}
                    <div className="space-y-3 pt-2">
                      <div className="flex items-center justify-between">
                        <label className="text-xs font-semibold text-[#1d2327] flex items-center gap-1.5">
                          <AlignLeft className="w-3.5 h-3.5 text-[#50575e]" />
                          <span>Body Paragraphs ({section.paragraphs.length})</span>
                        </label>
                        <button
                          type="button"
                          onClick={() => handleAddParagraph(sIdx)}
                          className="text-xs text-[#2271b1] hover:text-[#135e96] font-semibold flex items-center gap-1 cursor-pointer"
                        >
                          <Plus className="w-3 h-3" />
                          <span>Add Paragraph</span>
                        </button>
                      </div>

                      {section.paragraphs.map((p, pIdx) => (
                        <div key={pIdx} className="relative group">
                          <textarea
                            rows={3}
                            value={p}
                            onChange={(e) => {
                              const newSections = [...currentPage.contentSections];
                              newSections[sIdx].paragraphs[pIdx] = e.target.value;
                              setCurrentPage({ ...currentPage, contentSections: newSections });
                            }}
                            placeholder="Enter paragraph text. Supports Markdown links like [My Link](/url)..."
                            className="w-full px-3 py-2 text-xs sm:text-sm text-[#2c3338] border border-[#8c8f94] rounded focus:border-[#2271b1] outline-none leading-relaxed"
                          />
                          {section.paragraphs.length > 1 && (
                            <button
                              type="button"
                              onClick={() => handleRemoveParagraph(sIdx, pIdx)}
                              title="Delete paragraph"
                              className="absolute top-2 right-2 p-1 bg-white/90 hover:bg-rose-50 text-neutral-400 hover:text-rose-600 rounded border border-neutral-200 shadow-2xs opacity-70 group-hover:opacity-100 transition-opacity cursor-pointer"
                            >
                              <Minus className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      ))}
                    </div>

                    {/* Section Subpoints / Bulleted Checklist */}
                    <div className="pt-2 border-t border-[#f0f0f1] space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-semibold text-[#50575e] flex items-center gap-1.5">
                          <List className="w-3.5 h-3.5 text-emerald-700" />
                          <span>Key Protocols & Bulleted Checklist</span>
                        </span>
                        <button
                          type="button"
                          onClick={() => handleAddSubpoint(sIdx)}
                          className="text-xs text-[#2271b1] hover:text-[#135e96] font-semibold flex items-center gap-1 cursor-pointer"
                        >
                          <Plus className="w-3 h-3" />
                          <span>Add Bullet</span>
                        </button>
                      </div>

                      {(section.subPoints || []).map((sp, spIdx) => (
                        <div key={spIdx} className="flex items-center gap-2">
                          <span className="text-xs text-emerald-700 font-bold">•</span>
                          <input
                            type="text"
                            value={sp}
                            onChange={(e) => {
                              const newSections = [...currentPage.contentSections];
                              newSections[sIdx].subPoints![spIdx] = e.target.value;
                              setCurrentPage({ ...currentPage, contentSections: newSections });
                            }}
                            placeholder="Specification or checklist bullet..."
                            className="flex-1 px-2.5 py-1 text-xs border border-[#8c8f94] rounded focus:border-[#2271b1] outline-none bg-[#fdfdfd]"
                          />
                          <button
                            type="button"
                            onClick={() => handleRemoveSubpoint(sIdx, spIdx)}
                            className="p-1 text-neutral-400 hover:text-rose-600 cursor-pointer"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ))}
                    </div>

                  </div>
                ))}

                {/* Button to add another content section */}
                <button
                  type="button"
                  onClick={handleAddSection}
                  className="w-full py-3.5 border-2 border-dashed border-[#2271b1]/50 hover:border-[#2271b1] bg-blue-50/40 hover:bg-blue-50 text-[#2271b1] rounded-lg font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add New Content Section (H2 + Paragraphs + Specifications)</span>
                </button>
              </div>
            ) : (
              /* RAW MARKDOWN / HTML TAB */
              <div className="bg-white border border-[#c3c4c7] rounded-lg p-5 shadow-xs space-y-3">
                <div className="flex items-center justify-between text-xs text-[#50575e]">
                  <span className="font-bold uppercase tracking-wider text-[#1d2327]">
                    Raw Content & HTML Code Editor
                  </span>
                  <span>Supports headings, lists, markdown links, and standard HTML</span>
                </div>
                <textarea
                  rows={16}
                  value={currentPage.rawContent || currentPage.contentSections.map(s => `## ${s.heading}\n\n${s.paragraphs.join('\n\n')}\n\n${(s.subPoints || []).map(b => `* ${b}`).join('\n')}`).join('\n\n')}
                  onChange={(e) => setCurrentPage({ ...currentPage, rawContent: e.target.value })}
                  placeholder="Paste or write your full markdown / HTML content here..."
                  className="w-full p-4 font-mono text-xs text-[#1d2327] border border-[#8c8f94] rounded focus:border-[#2271b1] outline-none leading-relaxed bg-[#fbfbfb]"
                />
              </div>
            )}

            {/* 4. Page Key Highlights / Executive Summary Box */}
            <div className="bg-white border border-[#c3c4c7] rounded-lg p-5 shadow-xs space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-[#1d2327] flex items-center gap-1.5 uppercase tracking-wider">
                  <Sparkles className="w-4 h-4 text-amber-600" />
                  <span>Page Highlights & Executive Summary Box</span>
                </label>
                <button
                  type="button"
                  onClick={handleAddTakeaway}
                  className="text-xs text-[#2271b1] hover:text-[#135e96] font-semibold flex items-center gap-1 cursor-pointer"
                >
                  <Plus className="w-3 h-3" />
                  <span>Add Highlight</span>
                </button>
              </div>
              <p className="text-xs text-[#646970]">
                These highlighted takeaways appear prominently in a callout container at the top of the page.
              </p>
              <div className="space-y-2">
                {(currentPage.keyTakeaways || []).map((point, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
                    <input
                      type="text"
                      value={point}
                      onChange={(e) => {
                        const updated = [...(currentPage.keyTakeaways || [])];
                        updated[idx] = e.target.value;
                        setCurrentPage({ ...currentPage, keyTakeaways: updated });
                      }}
                      className="flex-1 px-3 py-1.5 text-xs border border-[#8c8f94] rounded focus:border-[#2271b1] outline-none"
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveTakeaway(idx)}
                      className="p-1 text-neutral-400 hover:text-rose-600 cursor-pointer"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* RIGHT 4 COLS: Document Settings, Publish Status, Featured Image, SEO */}
          <div className="lg:col-span-4 space-y-5">
            
            {/* Box 1: Publish Settings */}
            <div className="bg-white border border-[#c3c4c7] rounded-lg p-5 shadow-xs space-y-4">
              <h3 className="font-bold text-xs uppercase tracking-wider text-[#1d2327] border-b border-[#f0f0f1] pb-2">
                Document Settings
              </h3>

              <div className="space-y-3 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-[#646970]">Status:</span>
                  <select
                    value={currentPage.status}
                    onChange={(e) => setCurrentPage({ ...currentPage, status: e.target.value as any })}
                    className="px-2 py-1 border border-[#8c8f94] rounded font-bold bg-white"
                  >
                    <option value="Published">Published</option>
                    <option value="Draft">Draft</option>
                  </select>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-[#646970]">Page Type:</span>
                  <select
                    value={currentPage.type}
                    onChange={(e) => setCurrentPage({ ...currentPage, type: e.target.value as any })}
                    className="px-2 py-1 border border-[#8c8f94] rounded font-semibold bg-white text-[#2271b1]"
                  >
                    <option value="standard">Standard Page</option>
                    <option value="city-hub">City SEO Hub (60+)</option>
                    <option value="commercial">Commercial Foodservice</option>
                    <option value="custom">Custom Landing Page</option>
                  </select>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-[#646970]">Page Template:</span>
                  <select
                    value={currentPage.template || 'default'}
                    onChange={(e) => setCurrentPage({ ...currentPage, template: e.target.value as any })}
                    className="px-2 py-1 border border-[#8c8f94] rounded font-semibold bg-white"
                  >
                    <option value="default">Default Page (page.php)</option>
                    <option value="full-width">Full Width Canvas</option>
                    <option value="landing">Commercial Landing Page</option>
                  </select>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-[#646970]">Last Modified:</span>
                  <span className="font-mono text-[#1d2327] font-semibold">{currentPage.lastModified}</span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-[#646970]">Author:</span>
                  <span className="font-semibold text-[#1d2327]">{currentPage.author?.name || 'Hashir Rice Supplier'}</span>
                </div>
              </div>

              <div className="pt-3 border-t border-[#f0f0f1] flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => handlePreviewPage(currentPage)}
                  className="text-xs text-[#2271b1] hover:underline font-bold flex items-center gap-1 cursor-pointer"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>Preview</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleSavePage()}
                  className="px-3.5 py-1.5 bg-[#2271b1] hover:bg-[#135e96] text-white font-bold rounded text-xs cursor-pointer shadow-xs"
                >
                  {isEditingExisting ? 'Update' : 'Publish'}
                </button>
              </div>
            </div>

            {/* Box 2: Featured Image */}
            <div className="bg-white border border-[#c3c4c7] rounded-lg p-5 shadow-xs space-y-3">
              <div className="flex items-center justify-between border-b border-[#f0f0f1] pb-2">
                <h3 className="font-bold text-xs uppercase tracking-wider text-[#1d2327]">
                  Featured Image
                </h3>
                <button
                  type="button"
                  onClick={() => {
                    setMediaModalData({
                      ...mediaModalData,
                      target: 'featured'
                    });
                    setShowMediaModal(true);
                  }}
                  className="text-xs text-[#2271b1] hover:text-[#135e96] font-bold cursor-pointer"
                >
                  Change Image
                </button>
              </div>

              {currentPage.imageUrl ? (
                <div className="space-y-2">
                  <div className="rounded-lg overflow-hidden border border-[#dcdcde] relative group">
                    <img
                      src={currentPage.imageUrl}
                      alt={currentPage.title || 'Page featured visual'}
                      className="w-full h-36 object-cover"
                    />
                  </div>
                  <input
                    type="text"
                    value={currentPage.featuredImageCaption || ''}
                    onChange={(e) => setCurrentPage({ ...currentPage, featuredImageCaption: e.target.value })}
                    placeholder="Featured image caption..."
                    className="w-full px-2.5 py-1 text-xs border border-[#8c8f94] rounded"
                  />
                  <button
                    type="button"
                    onClick={() => setCurrentPage({ ...currentPage, imageUrl: undefined, featuredImageCaption: undefined })}
                    className="text-xs text-rose-600 hover:text-rose-800 underline cursor-pointer"
                  >
                    Remove featured image
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => {
                    setMediaModalData({
                      ...mediaModalData,
                      target: 'featured'
                    });
                    setShowMediaModal(true);
                  }}
                  className="w-full py-8 border-2 border-dashed border-[#c3c4c7] hover:border-[#2271b1] rounded-lg flex flex-col items-center justify-center text-xs text-[#646970] gap-2 cursor-pointer bg-[#f6f7f7]"
                >
                  <UploadCloud className="w-6 h-6 text-[#2271b1]" />
                  <span>Set featured image</span>
                </button>
              )}
            </div>

            {/* Box 3: Lead Excerpt / Intro Summary */}
            <div className="bg-white border border-[#c3c4c7] rounded-lg p-5 shadow-xs space-y-3">
              <h3 className="font-bold text-xs uppercase tracking-wider text-[#1d2327] border-b border-[#f0f0f1] pb-2">
                Page Excerpt / Lead
              </h3>
              <textarea
                rows={3}
                value={currentPage.excerpt || ''}
                onChange={(e) => setCurrentPage({ ...currentPage, excerpt: e.target.value })}
                placeholder="Write an optional lead paragraph or excerpt summarizing this page..."
                className="w-full px-3 py-2 text-xs border border-[#8c8f94] rounded focus:border-[#2271b1] outline-none"
              />
            </div>

            {/* Box 4: Rank Math / Yoast SEO Panel */}
            <RankMathSeoMetabox
              seoData={{
                seoTitle: currentPage.seoTitle,
                metaDescription: currentPage.metaDescription,
                focusKeyword: (currentPage as any).focusKeyword,
                canonicalUrl: (currentPage as any).canonicalUrl,
                schemaType: (currentPage as any).schemaType || 'WebPage',
                ogTitle: (currentPage as any).ogTitle,
                ogDescription: (currentPage as any).ogDescription,
                ogImage: currentPage.imageUrl,
              }}
              onChange={(updated) => {
                setCurrentPage({
                  ...currentPage,
                  seoTitle: updated.seoTitle,
                  metaDescription: updated.metaDescription,
                  ...(updated as any),
                });
              }}
              pageTitle={currentPage.title}
              pageSlug={currentPage.slug}
              pageContent={(currentPage.excerpt || '') + ' ' + (currentPage.contentSections?.map(s => s.paragraphs.join(' ')).join(' ') || '')}
              siteName="Hashir Rice Supplier Pakistan"
            />

          </div>
        </div>

        {/* MODAL 1: ADD / INSERT MEDIA */}
        {showMediaModal && (
          <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4 backdrop-blur-xs">
            <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full p-6 space-y-5 animate-in fade-in zoom-in-95 duration-150">
              <div className="flex items-center justify-between border-b border-[#dcdcde] pb-3">
                <h3 className="font-bold text-sm text-[#1d2327] flex items-center gap-2">
                  <ImageIcon className="w-4 h-4 text-[#2271b1]" />
                  <span>
                    {mediaModalData.target === 'featured' ? 'Set Featured Image' : `Insert Image into Section ${(activeSectionIndexForMedia || 0) + 1}`}
                  </span>
                </h3>
                <button onClick={() => setShowMediaModal(false)} className="text-[#646970] hover:text-[#1d2327] text-lg font-bold">×</button>
              </div>

              <div className="space-y-3">
                <label className="block text-xs font-bold text-[#1d2327]">
                  Choose from Verified Rice Industry Presets
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 max-h-56 overflow-y-auto p-1">
                  {RICE_IMAGE_PRESETS.map((preset, idx) => (
                    <div
                      key={idx}
                      onClick={() => setMediaModalData({ ...mediaModalData, url: preset.url, caption: preset.caption })}
                      className={`cursor-pointer rounded-lg border p-1.5 text-left transition-all ${
                        mediaModalData.url === preset.url
                          ? 'border-[#2271b1] bg-blue-50 ring-2 ring-[#2271b1]/40'
                          : 'border-neutral-200 hover:border-neutral-400 bg-white'
                      }`}
                    >
                      <img src={preset.url} alt={preset.label} className="w-full h-16 object-cover rounded mb-1" />
                      <span className="text-[11px] font-bold text-[#1d2327] line-clamp-1 block">{preset.label}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-3 pt-2 border-t border-[#f0f0f1] text-xs">
                <div>
                  <label className="block font-semibold text-[#1d2327] mb-1">Or Custom Image URL</label>
                  <input
                    type="url"
                    value={mediaModalData.url}
                    onChange={(e) => setMediaModalData({ ...mediaModalData, url: e.target.value })}
                    placeholder="https://..."
                    className="w-full px-3 py-1.5 border border-[#8c8f94] rounded text-xs focus:border-[#2271b1] outline-none"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-[#1d2327] mb-1">Image Caption</label>
                  <input
                    type="text"
                    value={mediaModalData.caption}
                    onChange={(e) => setMediaModalData({ ...mediaModalData, caption: e.target.value })}
                    placeholder="Specification caption or explanation..."
                    className="w-full px-3 py-1.5 border border-[#8c8f94] rounded text-xs focus:border-[#2271b1] outline-none"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-[#dcdcde]">
                <button
                  type="button"
                  onClick={() => setShowMediaModal(false)}
                  className="px-3 py-1.5 border border-[#8c8f94] text-[#2c3338] rounded text-xs font-semibold hover:bg-[#f0f0f1]"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleInsertMedia}
                  className="px-4 py-1.5 bg-[#2271b1] hover:bg-[#135e96] text-white rounded text-xs font-bold"
                >
                  Insert Media
                </button>
              </div>
            </div>
          </div>
        )}

        {/* MODAL 2: INSERT LINK (INTERNAL & EXTERNAL) */}
        {showLinkModal && (
          <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4 backdrop-blur-xs">
            <div className="bg-white rounded-xl shadow-2xl max-w-lg w-full p-6 space-y-4 animate-in fade-in zoom-in-95 duration-150">
              <div className="flex items-center justify-between border-b border-[#dcdcde] pb-3">
                <h3 className="font-bold text-sm text-[#1d2327] flex items-center gap-2">
                  <LinkIcon className="w-4 h-4 text-[#2271b1]" />
                  <span>Insert Link into Content</span>
                </h3>
                <button onClick={() => setShowLinkModal(false)} className="text-[#646970] hover:text-[#1d2327] text-lg font-bold">×</button>
              </div>

              <div className="space-y-3 text-xs">
                <div>
                  <label className="block font-semibold text-[#1d2327] mb-1">Link Text</label>
                  <input
                    type="text"
                    value={linkModalData.text}
                    onChange={(e) => setLinkModalData({ ...linkModalData, text: e.target.value })}
                    placeholder="e.g. Explore Wholesale Rice Varieties"
                    className="w-full px-3 py-1.5 border border-[#8c8f94] rounded text-xs focus:border-[#2271b1] outline-none font-medium"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-[#1d2327] mb-1">Destination URL</label>
                  <input
                    type="text"
                    value={linkModalData.url}
                    onChange={(e) => setLinkModalData({ ...linkModalData, url: e.target.value })}
                    placeholder="/varieties or https://..."
                    className="w-full px-3 py-1.5 border border-[#8c8f94] rounded text-xs focus:border-[#2271b1] outline-none font-mono"
                  />
                </div>

                {/* Quick Internal Presets */}
                <div className="space-y-1.5 pt-1">
                  <span className="font-semibold text-[#50575e] block">Or Select Internal Destination:</span>
                  <div className="flex flex-wrap gap-1.5 max-h-28 overflow-y-auto p-1 bg-[#f6f7f7] rounded border border-[#dcdcde]">
                    {INTERNAL_LINK_PRESETS.map((p, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setLinkModalData({ url: p.url, text: p.label.split(' (')[0], targetBlank: false })}
                        className="px-2 py-0.5 bg-white hover:bg-blue-50 border border-neutral-300 rounded text-[11px] text-[#2271b1] font-semibold cursor-pointer"
                      >
                        {p.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Quick External Presets */}
                <div className="space-y-1.5 pt-1">
                  <span className="font-semibold text-[#50575e] block">Or Select External Authority:</span>
                  <div className="flex flex-wrap gap-1.5">
                    {EXTERNAL_LINK_PRESETS.map((p, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setLinkModalData({ url: p.url, text: p.label, targetBlank: true })}
                        className="px-2 py-0.5 bg-white hover:bg-emerald-50 border border-neutral-300 rounded text-[11px] text-emerald-800 font-semibold cursor-pointer flex items-center gap-1"
                      >
                        <ExternalLink className="w-3 h-3" />
                        <span>{p.label}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-[#dcdcde]">
                <button
                  type="button"
                  onClick={() => setShowLinkModal(false)}
                  className="px-3 py-1.5 border border-[#8c8f94] text-[#2c3338] rounded text-xs font-semibold hover:bg-[#f0f0f1]"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleInsertLink}
                  className="px-4 py-1.5 bg-[#2271b1] hover:bg-[#135e96] text-white rounded text-xs font-bold"
                >
                  Insert Link
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    );
  }

  // RENDER 3: ALL PAGES LIST TABLE
  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="bg-white border border-[#c3c4c7] rounded-lg p-5 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <span className="px-2.5 py-0.5 rounded text-[10px] font-extrabold uppercase bg-blue-100 text-blue-900 border border-blue-300">
              WordPress Pages Manager (100% Real Text Active)
            </span>
            <span className="text-xs text-[#646970] font-semibold">
              {pages.length} Total Published Pages with Full Real Text &amp; HTML
            </span>
          </div>
          <h2 className="text-xl font-bold text-[#1d2327] mt-1 flex items-center gap-2 font-serif">
            <FileText className="w-5 h-5 text-[#2271b1]" />
            All Website Pages, 31 City SEO Hubs &amp; 72 Commercial Portals
          </h2>
          <p className="text-xs text-[#50575e] mt-1">
            Every page below (including <strong className="text-[#2271b1]">/rice-supplier-lahore</strong>) contains its complete real text, headings, specifications, and FAQs in the editor. You can edit any page directly or export the full-text XML for WordPress (<code className="bg-neutral-100 px-1 rounded">Tools → Import → WordPress</code>).
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <a
            href="/hashir-rice-seo-wordpress-theme.zip"
            download="hashir-rice-seo-wordpress-theme.zip"
            onClick={() => {
              if (onSuccessToast) {
                onSuccessToast('Downloading hashir-rice-seo-wordpress-theme.zip (v6.0 to 100% Original Design Restored + Real Editor Text)!');
              }
            }}
            className="px-3.5 py-2 bg-emerald-900 hover:bg-emerald-950 text-amber-300 rounded text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-xs transition-colors no-underline"
            title="Download Complete WordPress Theme ZIP (v6.0 with 100% Original Design Restored + Auto-Page Real-Text Seeder)"
          >
            <UploadCloud className="w-4 h-4" />
            <span>Download WordPress Theme (.ZIP)</span>
          </a>

          <button
            onClick={handleDownloadWordPressRealTextXml}
            className="px-3.5 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-xs transition-colors"
            title="Download WordPress WXR XML containing all 114+ pages with full real HTML text inside the WordPress editor"
          >
            <UploadCloud className="w-4 h-4" />
            <span>Export Real-Text XML ({pages.length} Pages)</span>
          </button>

          <button
            onClick={handleDownloadSitemapXml}
            className="px-3 py-2 bg-neutral-900 hover:bg-neutral-800 text-white rounded text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-xs transition-colors"
            title="Download complete sitemap.xml for Hostinger public_html"
          >
            <Globe className="w-3.5 h-3.5 text-amber-400" />
            <span>Download sitemap.xml</span>
          </button>

          <button
            onClick={handleRestoreAllRealText}
            className="px-3 py-2 bg-[#f0f0f1] hover:bg-[#dcdcde] text-[#1d2327] border border-[#8c8f94] rounded text-xs font-bold flex items-center gap-1.5 cursor-pointer transition-colors"
            title="Ensure all built-in pages have 100% complete real text"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-600" />
            <span>Sync All Real Text</span>
          </button>

          <button
            onClick={handleScanAndTrashDuplicatePages}
            className="px-3.5 py-2 bg-rose-700 hover:bg-rose-800 text-white rounded text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-xs transition-colors"
            title="Scan whole website for duplicate slugs/titles, move duplicates to Trash Box, and remove from sitemap.xml"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Scan &amp; Trash Duplicates ({trashedPagesCount} in Trash)</span>
          </button>

          <button
            onClick={handleAddNewPage}
            className="px-4 py-2 bg-[#2271b1] hover:bg-[#135e96] text-white rounded text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-xs transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Add New Page</span>
          </button>
        </div>
      </div>

      {/* FILTER & SEARCH */}
      <div className="bg-white border border-[#c3c4c7] rounded-lg shadow-xs p-5 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="relative flex-1 max-w-sm">
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-[#8c8f94]" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search pages by title or slug..."
              className="w-full pl-9 pr-3 py-1.5 text-xs border border-[#8c8f94] rounded bg-white focus:border-[#2271b1] outline-none"
            />
          </div>

          <div className="flex items-center gap-1.5 flex-wrap">
            {(['All', 'standard', 'city-hub', 'commercial', 'custom', 'Trash'] as const).map((type) => (
              <button
                key={type}
                onClick={() => setTypeFilter(type)}
                className={`px-2.5 py-1 text-xs font-bold rounded transition-colors cursor-pointer capitalize ${
                  typeFilter === type
                    ? type === 'Trash'
                      ? 'bg-rose-700 text-white'
                      : 'bg-[#2271b1] text-white'
                    : type === 'Trash'
                    ? 'text-rose-800 bg-rose-50 hover:bg-rose-100 border border-rose-200'
                    : 'text-[#50575e] bg-[#f0f0f1] hover:bg-[#dcdcde]'
                }`}
              >
                {type === 'city-hub'
                  ? 'City Hubs (31)'
                  : type === 'standard'
                  ? 'Standard Pages'
                  : type === 'Trash'
                  ? `Trash Box (${trashedPagesCount})`
                  : type === 'All'
                  ? `All Published (${activePublishedCount})`
                  : type}
              </button>
            ))}
          </div>
        </div>

        {/* PAGES TABLE */}
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left border-collapse">
            <thead>
              <tr className="bg-[#f6f7f7] border-y border-[#dcdcde] text-[#2c3338] font-bold">
                <th className="p-3">Page Title</th>
                <th className="p-3">URL Slug / Permalink</th>
                <th className="p-3">Type</th>
                <th className="p-3">Template</th>
                <th className="p-3">Status</th>
                <th className="p-3">Last Modified</th>
                <th className="p-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#dcdcde]">
              {filteredPages.map((page) => {
                const sectionCount = page.contentSections?.length || 0;
                const wordCount = (
                  (page.excerpt || '') +
                  ' ' +
                  (page.contentSections?.map((s) => `${s.heading} ${s.paragraphs.join(' ')} ${(s.subPoints || []).join(' ')}`).join(' ') || '')
                )
                  .trim()
                  .split(/\s+/).length;
                return (
                <tr key={page.id} className="hover:bg-[#f6f7f7] transition-colors">
                  <td className="p-3">
                    <strong className="text-[#1d2327] block text-sm font-serif">{page.title}</strong>
                    {page.seoTitle && (
                      <span className="text-[10px] text-[#646970] truncate max-w-sm block">
                        SEO: {page.seoTitle}
                      </span>
                    )}
                    <span className="inline-flex items-center gap-1 text-[10px] text-emerald-800 bg-emerald-50 border border-emerald-200 px-1.5 py-0.5 rounded mt-1 font-semibold">
                      <CheckCircle2 className="w-2.5 h-2.5 text-emerald-600" />
                      {sectionCount} Real Sections • {wordCount.toLocaleString()} Words Real Text
                    </span>
                  </td>
                  <td className="p-3 font-mono text-[#2271b1] font-semibold">
                    /{page.slug}
                  </td>
                  <td className="p-3">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-neutral-100 text-neutral-800 border border-neutral-300">
                      {page.type}
                    </span>
                  </td>
                  <td className="p-3 text-[#50575e]">
                    {page.template || 'default'}
                  </td>
                  <td className="p-3">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      page.status === 'Published'
                        ? 'bg-emerald-100 text-emerald-900 border border-emerald-300'
                        : page.status === 'Trash'
                        ? 'bg-rose-100 text-rose-900 border border-rose-300'
                        : 'bg-amber-100 text-amber-900 border border-amber-300'
                    }`}>
                      {page.status === 'Trash' ? 'In Trash (Excluded from Sitemap)' : page.status}
                    </span>
                  </td>
                  <td className="p-3 text-[#50575e]">{page.lastModified}</td>
                  <td className="p-3 text-right space-x-1.5 whitespace-nowrap">
                    {page.status === 'Trash' ? (
                      <>
                        <button
                          onClick={() => handleRestoreFromTrash(page.id, page.title)}
                          className="px-2.5 py-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-300 rounded text-xs font-bold transition-colors cursor-pointer"
                        >
                          Restore
                        </button>
                        <button
                          onClick={() => handleDeletePage(page.id, page.title)}
                          className="px-2.5 py-1 bg-rose-600 hover:bg-rose-700 text-white rounded text-xs font-bold transition-colors cursor-pointer"
                        >
                          <Trash2 className="w-3 h-3 inline mr-1" />
                          Delete Permanently
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          onClick={() => handlePreviewPage(page)}
                          className="px-2 py-1 bg-white hover:bg-neutral-100 text-[#50575e] border border-[#8c8f94] rounded text-xs font-semibold transition-colors cursor-pointer"
                          title="View WordPress Single Page"
                        >
                          <Eye className="w-3 h-3 inline mr-1 text-[#2271b1]" />
                          View
                        </button>
                        <button
                          onClick={() => handleEditPage(page)}
                          className="px-2.5 py-1 bg-white hover:bg-neutral-100 text-[#2271b1] border border-[#8c8f94] rounded text-xs font-bold transition-colors cursor-pointer"
                        >
                          <Edit className="w-3 h-3 inline mr-1" />
                          Edit Real Text
                        </button>
                        {page.id !== 'page-home' && (
                          <button
                            onClick={() => handleDeletePage(page.id, page.title)}
                            className="px-2 py-1 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-300 rounded text-xs font-semibold transition-colors cursor-pointer"
                            title="Move Page to WordPress Trash Box and Remove from Sitemap"
                          >
                            <Trash2 className="w-3 h-3 inline mr-1" />
                            Trash
                          </button>
                        )}
                      </>
                    )}
                  </td>
                </tr>
              );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
