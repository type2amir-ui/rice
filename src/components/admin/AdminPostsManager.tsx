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
  HelpCircle
} from 'lucide-react';
import { BLOG_POSTS_DATA } from '../../data/blogPostsData';
import { BlogPost } from '../../types';
import { WordPressSinglePostView } from '../WordPressSinglePostView';
import { RankMathSeoMetabox } from './RankMathSeoMetabox';

interface AdminPostsManagerProps {
  onSuccessToast?: (msg: string) => void;
}

// Preset verified rice industry imagery
const RICE_IMAGE_PRESETS = [
  {
    label: 'Basmati Paddy Harvest',
    url: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&q=80&w=1200',
    caption: 'Basmati paddy arriving from Punjab agricultural tracts.'
  },
  {
    label: 'Optical Sortex Machine Grading',
    url: 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?auto=format&fit=crop&q=80&w=1200',
    caption: 'Buhler multi-pass optical sorter ejecting chalky and discolored grains.'
  },
  {
    label: 'Noor Galla Mandi Dispatch Trucks',
    url: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&q=80&w=1200',
    caption: 'Freight trailers loading 50kg export polypropylene bags at Bucheki hub.'
  },
  {
    label: 'Cooked Biryani Grain Elongation',
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

// Preset internal links for quick 1-click insertion
const INTERNAL_LINK_PRESETS = [
  { label: 'Rice Catalog & Varieties (/varieties)', url: '/varieties' },
  { label: 'Mandi Live Exchange & Spot Rates (/exchange)', url: '/exchange' },
  { label: 'Major Sourcing Cities Directory (/locations)', url: '/locations' },
  { label: 'Karachi Port Wholesale Hub (/locations/rice-supplier-karachi)', url: '/locations/rice-supplier-karachi' },
  { label: 'Lahore Restaurant Supply (/locations/rice-supplier-lahore)', url: '/locations/rice-supplier-lahore' },
  { label: 'Rawalpindi / Islamabad Supply (/locations/rice-supplier-rawalpindi)', url: '/locations/rice-supplier-rawalpindi' },
  { label: 'Peshawar Mandi Corridor (/locations/rice-supplier-peshawar)', url: '/locations/rice-supplier-peshawar' },
  { label: 'Order Free Grain Sample (/sample)', url: '/sample' },
  { label: 'Request Wholesale Mandi Quote (/quote)', url: '/quote' },
  { label: 'Mandi Trading FAQ (/faq)', url: '/faq' }
];

// Preset external authority references
const EXTERNAL_LINK_PRESETS = [
  { label: 'REAP (Rice Exporters Association of Pakistan)', url: 'https://reap.org.pk' },
  { label: 'TDAP (Trade Development Authority of Pakistan)', url: 'https://tdap.gov.pk' },
  { label: 'USDA Grain Economics & World Rice Outlook', url: 'https://usda.gov' }
];

export const AdminPostsManager: React.FC<AdminPostsManagerProps> = ({ onSuccessToast }) => {
  const [posts, setPosts] = useState<BlogPost[]>(() => {
    const saved = localStorage.getItem('hashir_rice_admin_posts');
    return saved ? JSON.parse(saved) : BLOG_POSTS_DATA;
  });

  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  
  // View states: 'list' | 'editor' | 'preview'
  const [viewMode, setViewMode] = useState<'list' | 'editor' | 'preview'>('list');
  const [currentPost, setCurrentPost] = useState<BlogPost | null>(null);
  const [isEditingExisting, setIsEditingExisting] = useState(false);

  // Editor mode tab: 'sections' | 'raw'
  const [editorTab, setEditorTab] = useState<'sections' | 'raw'>('sections');

  // Modals for adding media and links into post
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

  // New category inline input
  const [newCategoryInput, setNewCategoryInput] = useState('');
  const [availableCategories, setAvailableCategories] = useState<string[]>([
    'Sourcing Guide',
    'Market Analysis',
    'Culinary Science',
    'Storage & Logistics',
    'Commodity Economics',
    'Mandi Breaking News',
    'Export Policy'
  ]);

  // Post form state
  const [postForm, setPostForm] = useState<BlogPost>({
    id: '',
    title: '',
    slug: '',
    excerpt: '',
    category: 'Sourcing Guide',
    author: {
      name: 'Hashir Rice Supplier',
      role: 'Head Broker & Mandi Founder (Owner: Muhammad Amir Shahzad)',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200'
    },
    publishedDate: new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
    readTime: '5 min read',
    imageUrl: RICE_IMAGE_PRESETS[0].url,
    featuredImageCaption: RICE_IMAGE_PRESETS[0].caption,
    tags: ['Rice Trade', '1121 Kainat', 'Mandi Report', 'Punjab Basmati'],
    keyTakeaways: [
      'Direct mandi procurement bypasses single-mill quality fluctuations.',
      'Always test grain elongation and cap moisture at 12.5% max.',
      'Verify digital weighbridge slips before truckload dispatch.'
    ],
    contentSections: [
      {
        heading: '1. Trade Overview & Mandi Background',
        paragraphs: [
          'Wholesale rice sourcing in Pakistan requires accurate on-ground knowledge of daily paddy arrivals, moisture thresholds, and optical Sortex grading across Punjab’s primary mandis like Noor Galla Mandi, Bucheki.',
          'Before signing a commercial procurement contract, institutional buyers and exporters must review [Wholesale Rice Varieties](/varieties) and benchmark current [Live Mandi Exchange Spot Rates](/exchange).'
        ],
        subPoints: [
          'Noor Galla Mandi (Bucheki) is the central dispatch corridor for 1121 Kainat and Super Kernel Basmati.',
          'Consignments must be moisture-tested using calibrated digital meters before loading.'
        ],
        imageUrl: RICE_IMAGE_PRESETS[0].url,
        imageCaption: 'Figure 1: Authentic Basmati paddy arriving from local Punjab growers.'
      },
      {
        heading: '2. Verifying Sortex Purity and Cooking Elongation',
        paragraphs: [
          'A top-grade consignment must maintain broken percentages below 1.5% and chalky grain limits under 2.0%. Commercial caterers should request a physical grain test via our [Free Sample Desk](/sample) before finalizing 100-bag consignments.',
          'For official regulatory trade guidance, refer to the [Rice Exporters Association of Pakistan (REAP)](https://reap.org.pk).'
        ]
      }
    ],
    rawContent: '',
    status: 'publish'
  });

  const savePostsToStorage = (updated: BlogPost[]) => {
    setPosts(updated);
    localStorage.setItem('hashir_rice_admin_posts', JSON.stringify(updated));
    // Dispatch custom event to notify public components (like BlogSection)
    window.dispatchEvent(new Event('hashir_posts_updated'));
  };

  const handleCreateNewPost = () => {
    const today = new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
    setPostForm({
      id: `post-${Date.now()}`,
      title: '',
      slug: '',
      excerpt: '',
      category: 'Sourcing Guide',
      author: {
        name: 'Hashir Rice Supplier',
        role: 'Head Broker & Mandi Founder (Owner: Muhammad Amir Shahzad)',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200'
      },
      publishedDate: today,
      readTime: '5 min read',
      imageUrl: RICE_IMAGE_PRESETS[0].url,
      featuredImageCaption: RICE_IMAGE_PRESETS[0].caption,
      tags: ['Rice Sourcing', 'Basmati', 'Mandi Bucheki'],
      keyTakeaways: [
        'Direct procurement from verified Noor Galla Mandi mills.',
        'Moisture tested under 12.5% with certified digital slips.'
      ],
      contentSections: [
        {
          heading: '1. Executive Mandi Summary',
          paragraphs: [
            'Write your first body paragraph here. You can easily insert internal links like [Rice Catalog](/varieties) or external links like [REAP](https://reap.org.pk).'
          ],
          subPoints: [
            'Key milestone point or technical grain metric.'
          ]
        }
      ],
      rawContent: '',
      status: 'publish'
    });
    setIsEditingExisting(false);
    setViewMode('editor');
  };

  const handleEditPost = (post: BlogPost) => {
    setPostForm(JSON.parse(JSON.stringify(post)));
    setIsEditingExisting(true);
    setViewMode('editor');
  };

  const handlePreviewPost = (post?: BlogPost) => {
    if (post) {
      setCurrentPost(post);
    } else {
      setCurrentPost(postForm);
    }
    setViewMode('preview');
  };

  const handleDeletePost = (id: string, title: string) => {
    if (window.confirm(`Are you sure you want to permanently delete post "${title}"?`)) {
      const updated = posts.filter((p) => p.id !== id);
      savePostsToStorage(updated);
      if (onSuccessToast) onSuccessToast(`Post "${title}" deleted.`);
    }
  };

  const handleSavePost = (statusOverride?: 'publish' | 'draft') => {
    if (!postForm.title.trim()) {
      alert('Please enter a post title before publishing.');
      return;
    }

    const autoSlug = (postForm.slug || postForm.title.toLowerCase().replace(/[^a-z0-9]+/g, '-')).replace(/^-|-$/g, '');
    const finalStatus = statusOverride || postForm.status || 'publish';

    const preparedPost: BlogPost = {
      ...postForm,
      slug: autoSlug,
      status: finalStatus,
      excerpt: postForm.excerpt || (postForm.contentSections[0]?.paragraphs[0]?.slice(0, 160) + '...') || 'Comprehensive rice trading report from Noor Galla Mandi.'
    };

    let updated: BlogPost[];
    if (isEditingExisting) {
      updated = posts.map((p) => (p.id === preparedPost.id ? preparedPost : p));
      if (onSuccessToast) onSuccessToast(`Post "${preparedPost.title}" updated.`);
    } else {
      updated = [preparedPost, ...posts];
      if (onSuccessToast) onSuccessToast(`Post "${preparedPost.title}" published successfully.`);
    }

    savePostsToStorage(updated);
    setViewMode('list');
  };

  // Section manipulation helpers
  const handleAddSection = () => {
    const nextNumber = postForm.contentSections.length + 1;
    const newSection = {
      heading: `${nextNumber}. New Sourcing Analysis Section`,
      paragraphs: ['Write detailed rice analysis, pricing factors, or milling parameters here.'],
      subPoints: []
    };
    setPostForm({
      ...postForm,
      contentSections: [...postForm.contentSections, newSection]
    });
  };

  const handleRemoveSection = (index: number) => {
    if (postForm.contentSections.length <= 1) {
      alert('A post must contain at least one content section.');
      return;
    }
    const updated = postForm.contentSections.filter((_, i) => i !== index);
    setPostForm({ ...postForm, contentSections: updated });
  };

  const handleAddParagraphToSection = (sectionIndex: number) => {
    const updated = [...postForm.contentSections];
    updated[sectionIndex].paragraphs.push('Add another paragraph of body content. Supports links and bold formatting.');
    setPostForm({ ...postForm, contentSections: updated });
  };

  const handleRemoveParagraphFromSection = (sectionIndex: number, pIndex: number) => {
    const updated = [...postForm.contentSections];
    if (updated[sectionIndex].paragraphs.length <= 1) return;
    updated[sectionIndex].paragraphs.splice(pIndex, 1);
    setPostForm({ ...postForm, contentSections: updated });
  };

  const handleAddSubpointToSection = (sectionIndex: number) => {
    const updated = [...postForm.contentSections];
    if (!updated[sectionIndex].subPoints) {
      updated[sectionIndex].subPoints = [];
    }
    updated[sectionIndex].subPoints!.push('Key checklist specification (e.g. Broken under 1.5%).');
    setPostForm({ ...postForm, contentSections: updated });
  };

  const handleInsertLinkToContent = (url: string, text: string) => {
    const markdownLink = `[${text}](${url})`;
    // Append link into the last paragraph of the last section
    const updated = [...postForm.contentSections];
    if (updated.length > 0) {
      const lastSec = updated[updated.length - 1];
      if (lastSec.paragraphs.length > 0) {
        lastSec.paragraphs[lastSec.paragraphs.length - 1] += ` ${markdownLink}`;
      } else {
        lastSec.paragraphs.push(markdownLink);
      }
      setPostForm({ ...postForm, contentSections: updated });
    }
    setShowLinkModal(false);
    if (onSuccessToast) onSuccessToast(`Link inserted: ${text}`);
  };

  const handleInsertMedia = () => {
    if (mediaModalData.target === 'featured') {
      setPostForm({
        ...postForm,
        imageUrl: mediaModalData.url,
        featuredImageCaption: mediaModalData.caption
      });
      if (onSuccessToast) onSuccessToast('Featured Image updated.');
    } else if (activeSectionIndexForMedia !== null && postForm.contentSections[activeSectionIndexForMedia]) {
      const updated = [...postForm.contentSections];
      updated[activeSectionIndexForMedia].imageUrl = mediaModalData.url;
      updated[activeSectionIndexForMedia].imageCaption = mediaModalData.caption;
      setPostForm({ ...postForm, contentSections: updated });
      if (onSuccessToast) onSuccessToast(`Image inserted into Section ${activeSectionIndexForMedia + 1}.`);
    } else {
      // Add as a new section with image
      const newSec = {
        heading: `Visual Field Record: ${mediaModalData.caption.slice(0, 35)}...`,
        paragraphs: ['Image documented during on-ground rice inspection at Noor Galla Mandi.'],
        imageUrl: mediaModalData.url,
        imageCaption: mediaModalData.caption
      };
      setPostForm({
        ...postForm,
        contentSections: [...postForm.contentSections, newSec]
      });
      if (onSuccessToast) onSuccessToast('New image block added to post.');
    }
    setShowMediaModal(false);
  };

  const handleAddCategory = () => {
    if (!newCategoryInput.trim()) return;
    if (!availableCategories.includes(newCategoryInput.trim())) {
      setAvailableCategories([...availableCategories, newCategoryInput.trim()]);
      setPostForm({ ...postForm, category: newCategoryInput.trim() });
      setNewCategoryInput('');
    }
  };

  const handleAddTag = (tagText: string) => {
    const clean = tagText.trim().replace(/^#/, '');
    if (clean && !postForm.tags.includes(clean)) {
      setPostForm({ ...postForm, tags: [...postForm.tags, clean] });
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setPostForm({ ...postForm, tags: postForm.tags.filter((t) => t !== tagToRemove) });
  };

  // Filtered posts for list view
  const filteredPosts = posts.filter((p) => {
    const matchesSearch =
      p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.slug.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCat = filterCategory === 'all' || p.category === filterCategory;
    return matchesSearch && matchesCat;
  });

  // =========================================================================
  // VIEW: AUTHENTIC SINGLE POST PREVIEW
  // =========================================================================
  if (viewMode === 'preview' && currentPost) {
    return (
      <div className="space-y-4">
        <WordPressSinglePostView
          post={currentPost}
          isAdminPreview={true}
          onBack={() => setViewMode(isEditingExisting ? 'editor' : 'list')}
          onEdit={() => {
            setPostForm(JSON.parse(JSON.stringify(currentPost)));
            setIsEditingExisting(true);
            setViewMode('editor');
          }}
        />
      </div>
    );
  }

  // =========================================================================
  // VIEW: FULL WORDPRESS CLASSIC & BLOCK POST EDITOR
  // =========================================================================
  if (viewMode === 'editor') {
    return (
      <div className="space-y-6 animate-in fade-in duration-150">
        
        {/* TOP WORDPRESS EDITOR HEADER BAR */}
        <div className="bg-white border border-[#c3c4c7] rounded-lg p-4 shadow-xs flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setViewMode('list')}
              className="p-1.5 rounded hover:bg-[#f0f0f1] text-[#646970] hover:text-[#1d2327] transition-colors cursor-pointer"
              title="Back to All Posts"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <h2 className="text-lg font-bold text-[#1d2327] flex items-center gap-2">
                <FileText className="w-5 h-5 text-[#2271b1]" />
                <span>{isEditingExisting ? 'Edit Post' : 'Add New Post'}</span>
              </h2>
              <span className="text-xs text-[#646970]">
                Status: <strong className="text-emerald-700 uppercase font-bold">{postForm.status || 'Published'}</strong>
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <button
              type="button"
              onClick={() => handlePreviewPost(postForm)}
              className="px-3.5 py-1.5 bg-white hover:bg-[#f6f7f7] text-[#2271b1] border border-[#2271b1] rounded text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-2xs transition-colors"
            >
              <Eye className="w-3.5 h-3.5" />
              <span>Preview Post</span>
            </button>

            <button
              type="button"
              onClick={() => handleSavePost('draft')}
              className="px-3.5 py-1.5 bg-white hover:bg-[#f6f7f7] text-[#50575e] border border-[#8c8f94] rounded text-xs font-semibold flex items-center gap-1.5 cursor-pointer shadow-2xs transition-colors"
            >
              <Save className="w-3.5 h-3.5" />
              <span>Save Draft</span>
            </button>

            <button
              type="button"
              onClick={() => handleSavePost('publish')}
              className="px-4 py-1.5 bg-[#2271b1] hover:bg-[#135e96] text-white rounded text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-xs transition-colors"
            >
              <Check className="w-3.5 h-3.5" />
              <span>{isEditingExisting ? 'Update Post' : 'Publish Post'}</span>
            </button>
          </div>
        </div>

        {/* TWO-COLUMN WORDPRESS LAYOUT */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* LEFT MAIN CANVAS (70%) */}
          <div className="lg:col-span-8 space-y-6">
            
            {/* TITLE INPUT CARD */}
            <div className="bg-white border border-[#c3c4c7] rounded-lg p-5 shadow-xs space-y-3">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#646970] mb-1">
                  Post Title
                </label>
                <input
                  type="text"
                  required
                  value={postForm.title}
                  onChange={(e) => {
                    const newTitle = e.target.value;
                    setPostForm({
                      ...postForm,
                      title: newTitle,
                      slug: isEditingExisting ? postForm.slug : newTitle.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
                    });
                  }}
                  placeholder="Enter title here (e.g. 1121 Sella Basmati Cooking Elongation & Moisture Guide 2026)"
                  className="w-full text-xl sm:text-2xl font-serif font-bold text-[#1d2327] placeholder:text-[#8c8f94] border-0 border-b border-[#c3c4c7] focus:border-[#2271b1] focus:ring-0 px-1 py-2 outline-none"
                />
              </div>

              {/* PERMALINK BAR */}
              <div className="flex items-center gap-1.5 text-xs text-[#50575e] bg-[#f6f7f7] px-3 py-1.5 rounded border border-[#dcdcde] flex-wrap">
                <span className="font-semibold text-[#1d2327]">Permalink:</span>
                <span className="text-[#646970]">https://hashirrice.com/news/</span>
                <input
                  type="text"
                  value={postForm.slug}
                  onChange={(e) => setPostForm({ ...postForm, slug: e.target.value.toLowerCase().replace(/\s+/g, '-') })}
                  placeholder="post-slug"
                  className="px-2 py-0.5 text-xs font-mono bg-white border border-[#8c8f94] rounded text-[#2271b1] focus:border-[#2271b1] outline-none min-w-[180px]"
                />
              </div>
            </div>

            {/* WORDPRESS TOOLBAR & MEDIA BUTTONS */}
            <div className="bg-white border border-[#c3c4c7] rounded-lg p-3 shadow-xs flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2 flex-wrap">
                <button
                  type="button"
                  onClick={() => {
                    setActiveSectionIndexForMedia(null);
                    setMediaModalData({ ...mediaModalData, target: 'section' });
                    setShowMediaModal(true);
                  }}
                  className="px-3 py-1.5 bg-[#f0f0f1] hover:bg-[#dcdcde] text-[#1d2327] rounded text-xs font-bold flex items-center gap-1.5 cursor-pointer border border-[#c3c4c7] shadow-2xs"
                >
                  <ImageIcon className="w-4 h-4 text-[#2271b1]" />
                  <span>Add Media / Image</span>
                </button>

                <button
                  type="button"
                  onClick={() => setShowLinkModal(true)}
                  className="px-3 py-1.5 bg-[#f0f0f1] hover:bg-[#dcdcde] text-[#1d2327] rounded text-xs font-bold flex items-center gap-1.5 cursor-pointer border border-[#c3c4c7] shadow-2xs"
                >
                  <LinkIcon className="w-4 h-4 text-emerald-700" />
                  <span>Insert / Edit Link</span>
                </button>

                <div className="h-5 w-[1px] bg-[#dcdcde] mx-1 hidden sm:block"></div>

                {/* Quick Style Shortcuts */}
                <button
                  type="button"
                  onClick={handleAddSection}
                  className="px-2.5 py-1 text-xs text-[#2271b1] hover:bg-blue-50 rounded font-semibold border border-blue-200 cursor-pointer"
                  title="Add another H2 section"
                >
                  + Section (H2)
                </button>

                <button
                  type="button"
                  onClick={() => handleAddParagraphToSection(postForm.contentSections.length - 1)}
                  className="px-2.5 py-1 text-xs text-[#3c434a] hover:bg-neutral-100 rounded font-medium border border-[#c3c4c7] cursor-pointer"
                  title="Add paragraph to last section"
                >
                  + Paragraph
                </button>

                <button
                  type="button"
                  onClick={() => handleAddSubpointToSection(postForm.contentSections.length - 1)}
                  className="px-2.5 py-1 text-xs text-emerald-800 hover:bg-emerald-50 rounded font-medium border border-emerald-300 cursor-pointer"
                  title="Add checklist item"
                >
                  + Checklist
                </button>
              </div>

              {/* Mode Tabs */}
              <div className="flex items-center gap-1 bg-[#f0f0f1] p-0.5 rounded border border-[#c3c4c7] text-xs">
                <button
                  type="button"
                  onClick={() => setEditorTab('sections')}
                  className={`px-3 py-1 rounded font-bold transition-all cursor-pointer ${
                    editorTab === 'sections' ? 'bg-white text-[#1d2327] shadow-2xs' : 'text-[#646970] hover:text-[#1d2327]'
                  }`}
                >
                  Visual Builder
                </button>
                <button
                  type="button"
                  onClick={() => setEditorTab('raw')}
                  className={`px-3 py-1 rounded font-bold transition-all cursor-pointer ${
                    editorTab === 'raw' ? 'bg-white text-[#1d2327] shadow-2xs' : 'text-[#646970] hover:text-[#1d2327]'
                  }`}
                >
                  Markdown / HTML
                </button>
              </div>
            </div>

            {/* BODY OF CONTENT: VISUAL SECTIONS BUILDER */}
            {editorTab === 'sections' && (
              <div className="space-y-4">
                {postForm.contentSections.map((section, sIdx) => (
                  <div
                    key={sIdx}
                    className="bg-white border border-[#c3c4c7] rounded-lg p-5 shadow-xs space-y-4 relative group"
                  >
                    {/* Section Controls */}
                    <div className="flex items-center justify-between border-b border-[#f0f0f1] pb-3">
                      <div className="flex items-center gap-2">
                        <span className="w-5 h-5 rounded-full bg-[#2271b1] text-white text-[11px] font-bold flex items-center justify-center">
                          {sIdx + 1}
                        </span>
                        <span className="text-xs font-bold text-[#1d2327]">Content Section</span>
                      </div>

                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          onClick={() => {
                            setActiveSectionIndexForMedia(sIdx);
                            setMediaModalData({ ...mediaModalData, target: 'section' });
                            setShowMediaModal(true);
                          }}
                          className="px-2 py-1 bg-[#f0f0f1] hover:bg-[#dcdcde] text-xs font-medium text-[#2271b1] rounded flex items-center gap-1 cursor-pointer"
                          title="Add inline image to this section"
                        >
                          <ImageIcon className="w-3 h-3" />
                          <span>{section.imageUrl ? 'Change Image' : '+ Section Image'}</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => handleRemoveSection(sIdx)}
                          className="p-1 hover:bg-rose-50 text-[#8c8f94] hover:text-rose-600 rounded transition-colors cursor-pointer"
                          title="Delete this section"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    {/* Section Heading Input */}
                    <div>
                      <label className="block text-[11px] font-semibold text-[#646970] mb-1">
                        Section Subheading (H2 / H3)
                      </label>
                      <input
                        type="text"
                        value={section.heading}
                        onChange={(e) => {
                          const updated = [...postForm.contentSections];
                          updated[sIdx].heading = e.target.value;
                          setPostForm({ ...postForm, contentSections: updated });
                        }}
                        placeholder="e.g. 2. Moisture Content and Safe Warehousing Thresholds"
                        className="w-full px-3 py-1.5 border border-[#8c8f94] rounded text-sm font-bold text-[#1d2327] focus:border-[#2271b1] outline-none"
                      />
                    </div>

                    {/* Section Inline Image preview if set */}
                    {section.imageUrl && (
                      <div className="p-3 bg-[#f6f7f7] border border-[#dcdcde] rounded-lg flex items-center gap-4">
                        <img
                          src={section.imageUrl}
                          alt="Section preview"
                          className="w-20 h-14 object-cover rounded border border-[#c3c4c7]"
                          referrerPolicy="no-referrer"
                        />
                        <div className="flex-1 space-y-1">
                          <span className="text-[11px] font-bold text-[#1d2327] block">Inline Section Image</span>
                          <input
                            type="text"
                            value={section.imageCaption || ''}
                            onChange={(e) => {
                              const updated = [...postForm.contentSections];
                              updated[sIdx].imageCaption = e.target.value;
                              setPostForm({ ...postForm, contentSections: updated });
                            }}
                            placeholder="Image caption (e.g. Figure: Moisture testing slip)..."
                            className="w-full text-xs px-2 py-1 border border-[#8c8f94] rounded bg-white"
                          />
                        </div>
                        <button
                          type="button"
                          onClick={() => {
                            const updated = [...postForm.contentSections];
                            delete updated[sIdx].imageUrl;
                            delete updated[sIdx].imageCaption;
                            setPostForm({ ...postForm, contentSections: updated });
                          }}
                          className="text-xs text-rose-600 hover:text-rose-800 font-semibold cursor-pointer"
                        >
                          Remove
                        </button>
                      </div>
                    )}

                    {/* Unlimited Paragraphs in this section */}
                    <div className="space-y-2">
                      <label className="block text-[11px] font-semibold text-[#646970]">
                        Body Paragraphs (Unlimited): Markdown links [Anchor](/url) or HTML &lt;a&gt; are supported:
                      </label>
                      {section.paragraphs.map((para, pIdx) => (
                        <div key={pIdx} className="space-y-1">
                          <div className="flex items-start gap-2">
                            <span className="text-[10px] text-[#8c8f94] font-mono mt-2">¶{pIdx + 1}</span>
                            <textarea
                              rows={3}
                              value={para}
                              onChange={(e) => {
                                const updated = [...postForm.contentSections];
                                updated[sIdx].paragraphs[pIdx] = e.target.value;
                                setPostForm({ ...postForm, contentSections: updated });
                              }}
                              placeholder="Write paragraph text... Supports internal links like [Rice Catalog](/varieties) and external links like [REAP](https://reap.org.pk)."
                              className="flex-1 p-2.5 text-xs text-[#2c3338] border border-[#8c8f94] rounded focus:border-[#2271b1] outline-none font-sans leading-relaxed"
                            />
                            {section.paragraphs.length > 1 && (
                              <button
                                type="button"
                                onClick={() => handleRemoveParagraphFromSection(sIdx, pIdx)}
                                className="text-[#8c8f94] hover:text-rose-600 p-1 cursor-pointer"
                                title="Delete this paragraph"
                              >
                                <X className="w-3.5 h-3.5" />
                              </button>
                            )}
                          </div>
                        </div>
                      ))}

                      <button
                        type="button"
                        onClick={() => handleAddParagraphToSection(sIdx)}
                        className="text-xs text-[#2271b1] hover:text-[#135e96] font-semibold inline-flex items-center gap-1 cursor-pointer pt-1"
                      >
                        <Plus className="w-3 h-3" />
                        <span>Add another paragraph</span>
                      </button>
                    </div>

                    {/* Subpoints / Checklist Items */}
                    <div className="space-y-2 pt-2 border-t border-[#f0f0f1]">
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] font-semibold text-[#646970]">
                          Checklist Points / Specification Highlights
                        </span>
                        <button
                          type="button"
                          onClick={() => handleAddSubpointToSection(sIdx)}
                          className="text-[11px] text-emerald-700 hover:text-emerald-900 font-bold inline-flex items-center gap-1 cursor-pointer"
                        >
                          <Plus className="w-3 h-3" />
                          <span>Add Checklist Point</span>
                        </button>
                      </div>

                      {section.subPoints && section.subPoints.map((sp, spIdx) => (
                        <div key={spIdx} className="flex items-center gap-2">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
                          <input
                            type="text"
                            value={sp}
                            onChange={(e) => {
                              const updated = [...postForm.contentSections];
                              updated[sIdx].subPoints![spIdx] = e.target.value;
                              setPostForm({ ...postForm, contentSections: updated });
                            }}
                            placeholder="Specification note (e.g. Moisture verified under 12.5% max)..."
                            className="flex-1 px-2.5 py-1 text-xs border border-[#8c8f94] rounded focus:border-[#2271b1] outline-none"
                          />
                          <button
                            type="button"
                            onClick={() => {
                              const updated = [...postForm.contentSections];
                              updated[sIdx].subPoints!.splice(spIdx, 1);
                              setPostForm({ ...postForm, contentSections: updated });
                            }}
                            className="text-[#8c8f94] hover:text-rose-600 p-1 cursor-pointer"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </div>
                      ))}
                    </div>

                  </div>
                ))}

                {/* ADD SECTION BUTTON */}
                <button
                  type="button"
                  onClick={handleAddSection}
                  className="w-full py-3 bg-[#f6f7f7] hover:bg-[#f0f0f1] text-[#2271b1] border-2 border-dashed border-[#c3c4c7] hover:border-[#2271b1] rounded-lg text-xs font-bold flex items-center justify-center gap-2 cursor-pointer transition-colors shadow-2xs"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Next Content Section (Unlimited)</span>
                </button>
              </div>
            )}

            {/* BODY OF CONTENT: RAW MARKDOWN / HTML TEXTAREA */}
            {editorTab === 'raw' && (
              <div className="bg-white border border-[#c3c4c7] rounded-lg p-5 shadow-xs space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <label className="font-bold text-[#1d2327]">
                    Raw Markdown & HTML Content Editor
                  </label>
                  <span className="text-[#646970]">
                    Supports unlimited text, headings (`## Title`), links `[Text](url)`, and images `![Alt](url)`.
                  </span>
                </div>
                <textarea
                  rows={16}
                  value={postForm.rawContent || postForm.contentSections.map(s => `## ${s.heading}\n\n${s.paragraphs.join('\n\n')}\n\n${s.subPoints ? s.subPoints.map(p => `- ${p}`).join('\n') : ''}`).join('\n\n---\n\n')}
                  onChange={(e) => setPostForm({ ...postForm, rawContent: e.target.value })}
                  placeholder="Paste or write your full body article here in Markdown or HTML..."
                  className="w-full p-4 font-mono text-xs text-[#2c3338] border border-[#8c8f94] rounded focus:border-[#2271b1] outline-none leading-relaxed"
                />
              </div>
            )}

            {/* KEY TAKEAWAYS BOX BUILDER */}
            <div className="bg-white border border-[#c3c4c7] rounded-lg p-5 shadow-xs space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold uppercase tracking-wider text-[#1d2327] flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-amber-600" />
                  <span>Key Takeaways & Executive Summary Box</span>
                </label>
                <button
                  type="button"
                  onClick={() => setPostForm({ ...postForm, keyTakeaways: [...postForm.keyTakeaways, 'New executive summary takeaway point.'] })}
                  className="text-xs text-[#2271b1] hover:text-[#135e96] font-bold flex items-center gap-1 cursor-pointer"
                >
                  <Plus className="w-3 h-3" />
                  <span>Add Takeaway</span>
                </button>
              </div>

              <div className="space-y-2">
                {postForm.keyTakeaways.map((takeaway, tIdx) => (
                  <div key={tIdx} className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
                    <input
                      type="text"
                      value={takeaway}
                      onChange={(e) => {
                        const updated = [...postForm.keyTakeaways];
                        updated[tIdx] = e.target.value;
                        setPostForm({ ...postForm, keyTakeaways: updated });
                      }}
                      placeholder="Core takeaway summary point..."
                      className="flex-1 px-3 py-1.5 text-xs border border-[#8c8f94] rounded focus:border-[#2271b1] outline-none"
                    />
                    {postForm.keyTakeaways.length > 1 && (
                      <button
                        type="button"
                        onClick={() => {
                          const updated = postForm.keyTakeaways.filter((_, i) => i !== tIdx);
                          setPostForm({ ...postForm, keyTakeaways: updated });
                        }}
                        className="text-[#8c8f94] hover:text-rose-600 p-1 cursor-pointer"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* RIGHT SETTINGS SIDEBAR (30%) */}
          <div className="lg:col-span-4 space-y-6">
            
            {/* PUBLISH BOX (WORDPRESS CLASSIC) */}
            <div className="bg-white border border-[#c3c4c7] rounded-lg shadow-xs overflow-hidden">
              <div className="bg-[#f0f0f1] px-4 py-2.5 border-b border-[#c3c4c7] flex items-center justify-between">
                <strong className="text-xs font-bold text-[#1d2327]">Publish Settings</strong>
                <span className="text-[10px] font-mono text-[#646970]">ID: {postForm.id}</span>
              </div>
              <div className="p-4 space-y-3 text-xs text-[#50575e]">
                <div className="flex items-center justify-between pb-2 border-b border-[#f0f0f1]">
                  <span>Status:</span>
                  <select
                    value={postForm.status || 'publish'}
                    onChange={(e) => setPostForm({ ...postForm, status: e.target.value as any })}
                    className="px-2 py-0.5 border border-[#8c8f94] rounded bg-white text-[#1d2327] font-semibold"
                  >
                    <option value="publish">Published</option>
                    <option value="draft">Draft</option>
                  </select>
                </div>

                <div className="flex items-center justify-between pb-2 border-b border-[#f0f0f1]">
                  <span>Visibility:</span>
                  <strong className="text-[#1d2327]">Public</strong>
                </div>

                <div className="space-y-1 pb-2 border-b border-[#f0f0f1]">
                  <label className="block text-[#646970]">Published Date:</label>
                  <input
                    type="text"
                    value={postForm.publishedDate}
                    onChange={(e) => setPostForm({ ...postForm, publishedDate: e.target.value })}
                    className="w-full px-2.5 py-1 border border-[#8c8f94] rounded bg-white text-[#1d2327]"
                  />
                </div>

                <div className="space-y-1 pb-2 border-b border-[#f0f0f1]">
                  <label className="block text-[#646970]">Read Time Estimate:</label>
                  <input
                    type="text"
                    value={postForm.readTime}
                    onChange={(e) => setPostForm({ ...postForm, readTime: e.target.value })}
                    placeholder="5 min read"
                    className="w-full px-2.5 py-1 border border-[#8c8f94] rounded bg-white text-[#1d2327]"
                  />
                </div>

                <div className="pt-2 flex items-center justify-between">
                  {isEditingExisting && (
                    <button
                      type="button"
                      onClick={() => handleDeletePost(postForm.id, postForm.title)}
                      className="text-rose-600 hover:text-rose-800 text-xs font-semibold cursor-pointer"
                    >
                      Move to Trash
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => handleSavePost()}
                    className="ml-auto px-4 py-2 bg-[#2271b1] hover:bg-[#135e96] text-white rounded font-bold transition-colors cursor-pointer shadow-xs"
                  >
                    {isEditingExisting ? 'Update Post' : 'Publish'}
                  </button>
                </div>
              </div>
            </div>

            {/* CATEGORIES BOX */}
            <div className="bg-white border border-[#c3c4c7] rounded-lg shadow-xs overflow-hidden">
              <div className="bg-[#f0f0f1] px-4 py-2.5 border-b border-[#c3c4c7]">
                <strong className="text-xs font-bold text-[#1d2327]">Categories</strong>
              </div>
              <div className="p-4 space-y-3 text-xs">
                <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                  {availableCategories.map((cat) => (
                    <label key={cat} className="flex items-center gap-2 text-[#2c3338] cursor-pointer hover:text-[#1d2327]">
                      <input
                        type="radio"
                        name="post_category"
                        checked={postForm.category === cat}
                        onChange={() => setPostForm({ ...postForm, category: cat })}
                        className="text-[#2271b1] focus:ring-[#2271b1]"
                      />
                      <span>{cat}</span>
                    </label>
                  ))}
                </div>

                {/* Add new category inline */}
                <div className="pt-2 border-t border-[#f0f0f1] flex items-center gap-1.5">
                  <input
                    type="text"
                    value={newCategoryInput}
                    onChange={(e) => setNewCategoryInput(e.target.value)}
                    placeholder="+ New category name"
                    className="flex-1 px-2 py-1 text-xs border border-[#8c8f94] rounded"
                  />
                  <button
                    type="button"
                    onClick={handleAddCategory}
                    className="px-2.5 py-1 bg-[#f0f0f1] hover:bg-[#dcdcde] text-[#1d2327] rounded text-xs font-bold border border-[#c3c4c7]"
                  >
                    Add
                  </button>
                </div>
              </div>
            </div>

            {/* FEATURED IMAGE BOX */}
            <div className="bg-white border border-[#c3c4c7] rounded-lg shadow-xs overflow-hidden">
              <div className="bg-[#f0f0f1] px-4 py-2.5 border-b border-[#c3c4c7] flex items-center justify-between">
                <strong className="text-xs font-bold text-[#1d2327]">Featured Image</strong>
              </div>
              <div className="p-4 space-y-3 text-xs">
                {postForm.imageUrl ? (
                  <div className="space-y-2">
                    <div className="rounded-lg overflow-hidden border border-[#dcdcde] bg-neutral-100 max-h-40">
                      <img
                        src={postForm.imageUrl}
                        alt="Featured"
                        className="w-full h-full object-cover"
                        referrerPolicy="no-referrer"
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <button
                        type="button"
                        onClick={() => {
                          setMediaModalData({
                            url: postForm.imageUrl,
                            caption: postForm.featuredImageCaption || '',
                            alt: postForm.title,
                            target: 'featured'
                          });
                          setShowMediaModal(true);
                        }}
                        className="text-[#2271b1] hover:underline font-semibold cursor-pointer"
                      >
                        Replace Image
                      </button>
                      <button
                        type="button"
                        onClick={() => setPostForm({ ...postForm, imageUrl: '' })}
                        className="text-rose-600 hover:underline font-semibold cursor-pointer"
                      >
                        Remove Image
                      </button>
                    </div>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => {
                      setMediaModalData({
                        url: RICE_IMAGE_PRESETS[0].url,
                        caption: RICE_IMAGE_PRESETS[0].caption,
                        alt: 'Featured rice photo',
                        target: 'featured'
                      });
                      setShowMediaModal(true);
                    }}
                    className="w-full py-6 border-2 border-dashed border-[#8c8f94] hover:border-[#2271b1] rounded-lg text-center text-[#2271b1] hover:bg-blue-50/50 font-bold transition-colors cursor-pointer"
                  >
                    + Set Featured Image
                  </button>
                )}
              </div>
            </div>

            {/* TAGS BOX */}
            <div className="bg-white border border-[#c3c4c7] rounded-lg shadow-xs overflow-hidden">
              <div className="bg-[#f0f0f1] px-4 py-2.5 border-b border-[#c3c4c7]">
                <strong className="text-xs font-bold text-[#1d2327]">Tags</strong>
              </div>
              <div className="p-4 space-y-3 text-xs">
                <div className="flex items-center gap-1.5">
                  <input
                    type="text"
                    placeholder="Add new tag..."
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddTag((e.target as HTMLInputElement).value);
                        (e.target as HTMLInputElement).value = '';
                      }
                    }}
                    className="flex-1 px-2 py-1 border border-[#8c8f94] rounded text-xs"
                  />
                  <span className="text-[11px] text-[#646970]">Press Enter</span>
                </div>

                <div className="flex flex-wrap gap-1.5 pt-1">
                  {postForm.tags.map((tag) => (
                    <span
                      key={tag}
                      className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-[#f0f0f1] text-[#2c3338] border border-[#dcdcde] text-[11px]"
                    >
                      <span>#{tag}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveTag(tag)}
                        className="text-[#8c8f94] hover:text-rose-600 cursor-pointer"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* EXCERPT BOX */}
            <div className="bg-white border border-[#c3c4c7] rounded-lg shadow-xs overflow-hidden">
              <div className="bg-[#f0f0f1] px-4 py-2.5 border-b border-[#c3c4c7]">
                <strong className="text-xs font-bold text-[#1d2327]">Excerpt / SEO Meta Description</strong>
              </div>
              <div className="p-4 space-y-2 text-xs">
                <textarea
                  rows={3}
                  value={postForm.excerpt}
                  onChange={(e) => setPostForm({ ...postForm, excerpt: e.target.value })}
                  placeholder="Write a 1-2 sentence summary for Google and archive cards..."
                  className="w-full p-2 border border-[#8c8f94] rounded text-xs text-[#2c3338] focus:border-[#2271b1] outline-none"
                />
              </div>
            </div>

            {/* 1-CLICK INTERNAL LINK CHEAT SHEET */}
            <div className="bg-emerald-50/70 border border-emerald-200 rounded-lg p-4 text-xs space-y-2.5">
              <strong className="block text-emerald-950 font-bold flex items-center gap-1.5">
                <LinkIcon className="w-3.5 h-3.5 text-emerald-800" />
                <span>Internal Links Reference</span>
              </strong>
              <p className="text-[11px] text-emerald-900 leading-relaxed">
                Click any link below to automatically copy its internal route for your post:
              </p>
              <div className="space-y-1">
                {INTERNAL_LINK_PRESETS.slice(0, 5).map((il) => (
                  <button
                    key={il.url}
                    type="button"
                    onClick={() => {
                      handleInsertLinkToContent(il.url, il.label.split(' (')[0]);
                    }}
                    className="w-full text-left p-1.5 rounded bg-white hover:bg-emerald-100/60 border border-emerald-200 text-[11px] text-emerald-950 font-medium transition-colors cursor-pointer flex items-center justify-between"
                  >
                    <span className="truncate">{il.label.split(' (')[0]}</span>
                    <span className="font-mono text-[10px] text-emerald-700 shrink-0 ml-1">{il.url}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Rank Math / Yoast SEO Suite for Post */}
            <RankMathSeoMetabox
              seoData={{
                seoTitle: currentPost.seoTitle,
                metaDescription: currentPost.metaDescription,
                focusKeyword: currentPost.focusKeyword,
                canonicalUrl: currentPost.canonicalUrl,
                schemaType: 'Article',
                ogTitle: currentPost.ogTitle,
                ogDescription: currentPost.ogDescription,
                ogImage: currentPost.imageUrl,
              }}
              onChange={(updated) => {
                setCurrentPost({
                  ...currentPost,
                  seoTitle: updated.seoTitle,
                  metaDescription: updated.metaDescription,
                  focusKeyword: updated.focusKeyword,
                  canonicalUrl: updated.canonicalUrl,
                  ogTitle: updated.ogTitle,
                  ogDescription: updated.ogDescription,
                });
              }}
              pageTitle={currentPost.title}
              pageSlug={`blog/${currentPost.slug}`}
              pageContent={(currentPost.excerpt || '') + ' ' + (currentPost.contentSections?.map(s => s.paragraphs.join(' ')).join(' ') || '')}
              siteName="Hashir Rice Supplier Pakistan"
            />

          </div>

        </div>

        {/* MODAL: INSERT MEDIA / IMAGE */}
        {showMediaModal && (
          <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-xs">
            <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full p-6 space-y-4 max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between border-b border-[#dcdcde] pb-3">
                <h3 className="font-bold text-base text-[#1d2327] flex items-center gap-2">
                  <ImageIcon className="w-5 h-5 text-[#2271b1]" />
                  <span>Insert Image Into Post</span>
                </h3>
                <button
                  type="button"
                  onClick={() => setShowMediaModal(false)}
                  className="text-[#646970] hover:text-[#1d2327] text-lg font-bold"
                >
                  ×
                </button>
              </div>

              <div className="space-y-4 text-xs">
                {/* Image Presets */}
                <div>
                  <label className="block font-bold text-[#1d2327] mb-1.5">
                    Select from Verified Rice Photography Presets:
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {RICE_IMAGE_PRESETS.map((preset, idx) => (
                      <div
                        key={idx}
                        onClick={() => {
                          setMediaModalData({
                            ...mediaModalData,
                            url: preset.url,
                            caption: preset.caption,
                            alt: preset.label
                          });
                        }}
                        className={`p-2 rounded-lg border cursor-pointer transition-all ${
                          mediaModalData.url === preset.url
                            ? 'border-[#2271b1] bg-blue-50/50 ring-2 ring-[#2271b1]/30'
                            : 'border-[#dcdcde] hover:border-[#8c8f94]'
                        }`}
                      >
                        <img
                          src={preset.url}
                          alt={preset.label}
                          className="w-full h-20 object-cover rounded mb-1.5"
                          referrerPolicy="no-referrer"
                        />
                        <strong className="block text-[11px] text-[#1d2327] truncate">{preset.label}</strong>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Custom Image URL */}
                <div>
                  <label className="block font-semibold text-[#1d2327] mb-1">
                    Or Enter Custom Image URL (Unsplash, CDN, or Cloud Storage)
                  </label>
                  <input
                    type="url"
                    value={mediaModalData.url}
                    onChange={(e) => setMediaModalData({ ...mediaModalData, url: e.target.value })}
                    placeholder="https://..."
                    className="w-full px-3 py-1.5 border border-[#8c8f94] rounded focus:border-[#2271b1] outline-none"
                  />
                </div>

                {/* Caption */}
                <div>
                  <label className="block font-semibold text-[#1d2327] mb-1">
                    Image Caption
                  </label>
                  <input
                    type="text"
                    value={mediaModalData.caption}
                    onChange={(e) => setMediaModalData({ ...mediaModalData, caption: e.target.value })}
                    placeholder="e.g. Figure 1: 1121 Kainat cooked length measurement..."
                    className="w-full px-3 py-1.5 border border-[#8c8f94] rounded focus:border-[#2271b1] outline-none"
                  />
                </div>

                <div className="flex items-center justify-end gap-2 pt-3 border-t border-[#dcdcde]">
                  <button
                    type="button"
                    onClick={() => setShowMediaModal(false)}
                    className="px-3 py-1.5 border border-[#8c8f94] text-[#2c3338] rounded font-semibold hover:bg-[#f0f0f1]"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleInsertMedia}
                    className="px-4 py-1.5 bg-[#2271b1] hover:bg-[#135e96] text-white rounded font-bold"
                  >
                    Insert Image
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* MODAL: INSERT / EDIT LINK */}
        {showLinkModal && (
          <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-xs">
            <div className="bg-white rounded-xl shadow-2xl max-w-lg w-full p-6 space-y-4 max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between border-b border-[#dcdcde] pb-3">
                <h3 className="font-bold text-base text-[#1d2327] flex items-center gap-2">
                  <LinkIcon className="w-5 h-5 text-emerald-700" />
                  <span>Insert Internal or External Link</span>
                </h3>
                <button
                  type="button"
                  onClick={() => setShowLinkModal(false)}
                  className="text-[#646970] hover:text-[#1d2327] text-lg font-bold"
                >
                  ×
                </button>
              </div>

              <div className="space-y-4 text-xs">
                {/* Internal Page Presets */}
                <div>
                  <label className="block font-bold text-[#1d2327] mb-1.5">
                    1-Click Internal Links (Within Hashir Rice Supplier):
                  </label>
                  <select
                    onChange={(e) => {
                      if (e.target.value) {
                        const selected = INTERNAL_LINK_PRESETS.find(p => p.url === e.target.value);
                        setLinkModalData({
                          ...linkModalData,
                          url: e.target.value,
                          text: selected ? selected.label.split(' (')[0] : linkModalData.text,
                          targetBlank: false
                        });
                      }
                    }}
                    className="w-full px-3 py-1.5 border border-[#8c8f94] rounded bg-white text-[#1d2327] focus:border-[#2271b1] outline-none"
                  >
                    <option value="">-- Choose internal page --</option>
                    {INTERNAL_LINK_PRESETS.map((p) => (
                      <option key={p.url} value={p.url}>
                        {p.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* External Authority Presets */}
                <div>
                  <label className="block font-bold text-[#1d2327] mb-1.5">
                    Or External Authority References:
                  </label>
                  <select
                    onChange={(e) => {
                      if (e.target.value) {
                        const selected = EXTERNAL_LINK_PRESETS.find(p => p.url === e.target.value);
                        setLinkModalData({
                          ...linkModalData,
                          url: e.target.value,
                          text: selected ? selected.label : linkModalData.text,
                          targetBlank: true
                        });
                      }
                    }}
                    className="w-full px-3 py-1.5 border border-[#8c8f94] rounded bg-white text-[#1d2327] focus:border-[#2271b1] outline-none"
                  >
                    <option value="">-- Choose external reference --</option>
                    {EXTERNAL_LINK_PRESETS.map((p) => (
                      <option key={p.url} value={p.url}>
                        {p.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Target URL */}
                <div>
                  <label className="block font-semibold text-[#1d2327] mb-1">
                    Target URL (Internal path e.g. /varieties or External https://...)
                  </label>
                  <input
                    type="text"
                    required
                    value={linkModalData.url}
                    onChange={(e) => {
                      const val = e.target.value;
                      setLinkModalData({
                        ...linkModalData,
                        url: val,
                        targetBlank: val.startsWith('http://') || val.startsWith('https://')
                      });
                    }}
                    placeholder="/varieties or https://reap.org.pk"
                    className="w-full px-3 py-1.5 border border-[#8c8f94] rounded focus:border-[#2271b1] outline-none font-mono"
                  />
                </div>

                {/* Anchor Text */}
                <div>
                  <label className="block font-semibold text-[#1d2327] mb-1">
                    Link Anchor Text
                  </label>
                  <input
                    type="text"
                    required
                    value={linkModalData.text}
                    onChange={(e) => setLinkModalData({ ...linkModalData, text: e.target.value })}
                    placeholder="e.g. View 1121 Kainat Catalog & Specs"
                    className="w-full px-3 py-1.5 border border-[#8c8f94] rounded focus:border-[#2271b1] outline-none"
                  />
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="link-target-blank"
                    checked={linkModalData.targetBlank}
                    onChange={(e) => setLinkModalData({ ...linkModalData, targetBlank: e.target.checked })}
                    className="text-[#2271b1] focus:ring-[#2271b1]"
                  />
                  <label htmlFor="link-target-blank" className="text-neutral-700 cursor-pointer">
                    Open link in a new tab (recommended for external URLs)
                  </label>
                </div>

                <div className="flex items-center justify-end gap-2 pt-3 border-t border-[#dcdcde]">
                  <button
                    type="button"
                    onClick={() => setShowLinkModal(false)}
                    className="px-3 py-1.5 border border-[#8c8f94] text-[#2c3338] rounded font-semibold hover:bg-[#f0f0f1]"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={() => handleInsertLinkToContent(linkModalData.url, linkModalData.text)}
                    className="px-4 py-1.5 bg-[#2271b1] hover:bg-[#135e96] text-white rounded font-bold"
                  >
                    Insert Link
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

      </div>
    );
  }

  // =========================================================================
  // VIEW: POSTS DIRECTORY & MANAGEMENT TABLE
  // =========================================================================
  return (
    <div className="space-y-6 animate-in fade-in duration-150">
      {/* HEADER */}
      <div className="bg-white border border-[#c3c4c7] rounded-lg p-5 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded text-[10px] font-extrabold uppercase bg-emerald-100 text-emerald-900 border border-emerald-300">
              WordPress Blog & Knowledge Base
            </span>
            <span className="text-xs text-[#646970]">{posts.length} Published Articles</span>
          </div>
          <h2 className="text-xl font-bold text-[#1d2327] mt-1 flex items-center gap-2 font-serif">
            <FileText className="w-5 h-5 text-[#2271b1]" />
            Posts & Grain Knowledge Base
          </h2>
        </div>

        <button
          onClick={handleCreateNewPost}
          className="px-4 py-2 bg-[#2271b1] hover:bg-[#135e96] text-white rounded text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-xs transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Post</span>
        </button>
      </div>

      {/* FILTERS & SEARCH */}
      <div className="bg-white border border-[#c3c4c7] rounded-lg shadow-xs p-5 space-y-4">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="relative w-full sm:max-w-sm">
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-[#8c8f94]" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search articles by title, slug or category..."
              className="w-full pl-9 pr-3 py-1.5 text-xs border border-[#8c8f94] rounded bg-white focus:border-[#2271b1] outline-none"
            />
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <span className="text-xs text-[#646970]">Category:</span>
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="px-3 py-1 text-xs border border-[#8c8f94] rounded bg-white focus:border-[#2271b1] outline-none"
            >
              <option value="all">All Categories</option>
              {availableCategories.map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>
        </div>

        {/* POSTS TABLE */}
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left border-collapse">
            <thead>
              <tr className="bg-[#f6f7f7] border-y border-[#dcdcde] text-[#2c3338] font-bold">
                <th className="p-3">Title & Summary</th>
                <th className="p-3">Category</th>
                <th className="p-3">Author</th>
                <th className="p-3">Date</th>
                <th className="p-3">Sections</th>
                <th className="p-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#dcdcde]">
              {filteredPosts.map((post) => (
                <tr key={post.id} className="hover:bg-[#f6f7f7] transition-colors">
                  <td className="p-3 max-w-md">
                    <strong className="text-[#1d2327] block text-sm font-serif">{post.title}</strong>
                    <p className="text-[#50575e] line-clamp-1 text-[11px] mt-0.5">{post.excerpt}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-[10px] font-mono text-[#2271b1]">/{post.slug}</span>
                      {post.imageUrl && (
                        <span className="text-[10px] bg-neutral-100 text-neutral-600 px-1.5 rounded flex items-center gap-1">
                          <ImageIcon className="w-2.5 h-2.5" />
                          Has Image
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="p-3">
                    <span className="px-2.5 py-0.5 rounded text-[10px] font-bold bg-blue-50 text-blue-800 border border-blue-200">
                      {post.category}
                    </span>
                  </td>
                  <td className="p-3 font-medium text-[#1d2327]">
                    {post.author?.name || 'Hashir Rice Supplier'}
                  </td>
                  <td className="p-3 text-[#50575e]">
                    <span>{post.publishedDate}</span>
                    <span className="block text-[10px] text-[#8c8f94]">{post.readTime}</span>
                  </td>
                  <td className="p-3 text-[#50575e]">
                    <span className="font-semibold">{post.contentSections?.length || 1} sections</span>
                  </td>
                  <td className="p-3 text-right space-x-1.5 whitespace-nowrap">
                    <button
                      onClick={() => handlePreviewPost(post)}
                      className="px-2.5 py-1 bg-white hover:bg-neutral-100 text-neutral-700 border border-[#8c8f94] rounded text-xs font-semibold cursor-pointer shadow-2xs transition-colors"
                      title="Open like WordPress Default Post"
                    >
                      <Eye className="w-3 h-3 inline mr-1 text-[#2271b1]" />
                      View Post
                    </button>
                    <button
                      onClick={() => handleEditPost(post)}
                      className="px-2.5 py-1 bg-white hover:bg-blue-50 text-[#2271b1] border border-[#2271b1] rounded text-xs font-semibold cursor-pointer shadow-2xs transition-colors"
                      title="Edit this post"
                    >
                      <Edit className="w-3 h-3 inline mr-1" />
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeletePost(post.id, post.title)}
                      className="px-2 py-1 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-300 rounded text-xs font-semibold cursor-pointer transition-colors"
                      title="Delete post"
                    >
                      <Trash2 className="w-3 h-3 inline mr-1" />
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
