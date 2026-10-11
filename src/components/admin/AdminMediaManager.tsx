import React, { useState } from 'react';
import {
  Image,
  Upload,
  Trash2,
  Plus,
  Search,
  Eye,
  FileText,
  CheckCircle2,
  ExternalLink,
  Filter
} from 'lucide-react';

export interface MediaItem {
  id: string;
  title: string;
  url: string;
  type: 'image' | 'pdf' | 'report';
  size: string;
  date: string;
  dimensions?: string;
}

const INITIAL_MEDIA: MediaItem[] = [
  { id: 'm0', title: 'hashir-rice-suppliers-official-master-logo.jpg', url: '/brand-assets/hashir-rice-master-logo.jpg', type: 'image', size: '1.4 MB', date: '2026-09-01', dimensions: '2048x2048' },
  { id: 'm1', title: '1121-kainat-steam-grain-close-up.jpg', url: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&q=80&w=800', type: 'image', size: '1.2 MB', date: '2026-08-30', dimensions: '1920x1080' },
  { id: 'm2', title: 'super-kernel-basmati-bag-stack.jpg', url: 'https://images.unsplash.com/photo-1536304993881-ff6e9eefa2a6?auto=format&fit=crop&q=80&w=800', type: 'image', size: '850 KB', date: '2026-08-29', dimensions: '1600x900' },
  { id: 'm3', title: 'bucheki-galla-mandi-shop-4-hero.jpg', url: 'https://images.unsplash.com/photo-1509358271058-acd22cc93898?auto=format&fit=crop&q=80&w=800', type: 'image', size: '2.1 MB', date: '2026-08-28', dimensions: '2400x1600' },
  { id: 'm4', title: 'haji-muhammad-hashir-broker-portrait.jpg', url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=400', type: 'image', size: '420 KB', date: '2026-08-27', dimensions: '800x800' },
  { id: 'm5', title: 'sgs-lab-moisture-certificate-august-2026.pdf', url: '#', type: 'pdf', size: '340 KB', date: '2026-08-30' },
  { id: 'm6', title: 'nankana-weighbridge-bilty-sample.pdf', url: '#', type: 'pdf', size: '510 KB', date: '2026-08-29' }
];

interface AdminMediaManagerProps {
  onSuccessToast?: (msg: string) => void;
}

export const AdminMediaManager: React.FC<AdminMediaManagerProps> = ({ onSuccessToast }) => {
  const [mediaList, setMediaList] = useState<MediaItem[]>(() => {
    const saved = localStorage.getItem('hashir_rice_admin_media');
    return saved ? JSON.parse(saved) : INITIAL_MEDIA;
  });

  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'image' | 'pdf'>('all');
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newUrl, setNewUrl] = useState('');

  const saveMedia = (updated: MediaItem[]) => {
    setMediaList(updated);
    localStorage.setItem('hashir_rice_admin_media', JSON.stringify(updated));
  };

  const handleDelete = (id: string, title: string) => {
    if (window.confirm(`Permanently delete media file "${title}"?`)) {
      const updated = mediaList.filter((m) => m.id !== id);
      saveMedia(updated);
      if (onSuccessToast) onSuccessToast(`Media file "${title}" removed.`);
    }
  };

  const handleUpload = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle || !newUrl) return;

    const isPdf = newUrl.endsWith('.pdf') || newTitle.endsWith('.pdf');
    const newMedia: MediaItem = {
      id: `m-${Date.now()}`,
      title: newTitle,
      url: newUrl,
      type: isPdf ? 'pdf' : 'image',
      size: '1.4 MB',
      date: new Date().toISOString().split('T')[0],
      dimensions: isPdf ? undefined : '1920x1080'
    };

    saveMedia([newMedia, ...mediaList]);
    setNewTitle('');
    setNewUrl('');
    setShowUploadModal(false);
    if (onSuccessToast) onSuccessToast(`Media file "${newMedia.title}" uploaded to library.`);
  };

  const filtered = mediaList.filter((m) => {
    const matchSearch = m.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchType = filterType === 'all' || m.type === filterType;
    return matchSearch && matchType;
  });

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="bg-white border border-[#c3c4c7] rounded-lg p-5 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded text-[10px] font-extrabold uppercase bg-sky-100 text-sky-900 border border-sky-300">
              WordPress Media Library
            </span>
            <span className="text-xs text-[#646970]">{mediaList.length} Total Uploads</span>
          </div>
          <h2 className="text-xl font-bold text-[#1d2327] mt-1 flex items-center gap-2 font-serif">
            <Image className="w-5 h-5 text-sky-600" />
            Media Library (Grain Samples, Certificates & Biltys)
          </h2>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <a
            href="https://wordpress.org/plugins/tags/image-optimizer/"
            target="_blank"
            rel="noopener noreferrer"
            className="px-3.5 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-xs transition-colors"
            title="Browse free image compression plugins on WordPress.org (Smush, EWWW, ShortPixel)"
          >
            <span>Free Image Plugins (WordPress.org)</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>

          <button
            onClick={() => setShowUploadModal(true)}
            className="px-3.5 py-2 bg-[#2271b1] hover:bg-[#135e96] text-white rounded text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-xs"
          >
            <Upload className="w-3.5 h-3.5" />
            <span>Upload Media / Image</span>
          </button>
        </div>
      </div>

      {/* FILTER & GRID */}
      <div className="bg-white border border-[#c3c4c7] rounded-lg shadow-xs p-5 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="relative flex-1 max-w-sm">
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-[#8c8f94]" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search files by title..."
              className="w-full pl-9 pr-3 py-1.5 text-xs border border-[#8c8f94] rounded bg-white focus:border-[#2271b1] outline-none"
            />
          </div>

          <div className="flex items-center gap-2">
            {(['all', 'image', 'pdf'] as const).map((type) => (
              <button
                key={type}
                onClick={() => setFilterType(type)}
                className={`px-3 py-1 text-xs font-bold rounded capitalize cursor-pointer transition-colors ${
                  filterType === type ? 'bg-[#2271b1] text-white' : 'bg-[#f0f0f1] text-[#50575e] hover:bg-[#dcdcde]'
                }`}
              >
                {type === 'all' ? 'All Media' : type === 'image' ? 'Images' : 'PDF Documents'}
              </button>
            ))}
          </div>
        </div>

        {/* MEDIA GRID */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {filtered.map((item) => (
            <div key={item.id} className="border border-[#dcdcde] rounded-lg overflow-hidden bg-[#f6f7f7] group flex flex-col justify-between">
              <div className="aspect-video bg-neutral-200 relative overflow-hidden flex items-center justify-center">
                {item.type === 'image' ? (
                  <img
                    src={item.url}
                    alt={item.title}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                  />
                ) : (
                  <div className="flex flex-col items-center justify-center p-4 text-[#2271b1]">
                    <FileText className="w-8 h-8" />
                    <span className="text-[10px] font-bold mt-1 uppercase">PDF Doc</span>
                  </div>
                )}
              </div>

              <div className="p-3 text-xs space-y-1">
                <div className="font-semibold text-[#1d2327] truncate" title={item.title}>
                  {item.title}
                </div>
                <div className="flex items-center justify-between text-[10px] text-[#646970]">
                  <span>{item.size}</span>
                  <span>{item.date}</span>
                </div>
                <div className="pt-2 flex justify-end">
                  <button
                    onClick={() => handleDelete(item.id, item.title)}
                    className="text-rose-600 hover:text-rose-800 p-1 cursor-pointer"
                    title="Delete Media"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* MODAL: UPLOAD MEDIA */}
      {showUploadModal && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-xs">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6 space-y-4 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-[#dcdcde] pb-3">
              <h3 className="font-bold text-base text-[#1d2327] flex items-center gap-2">
                <Upload className="w-5 h-5 text-sky-600" />
                <span>Upload to Media Library</span>
              </h3>
              <button onClick={() => setShowUploadModal(false)} className="text-[#646970] hover:text-[#1d2327] text-lg font-bold">×</button>
            </div>

            <form onSubmit={handleUpload} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-[#1d2327] mb-1">File Title</label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g. 1509-golden-sella-lot-50ton.jpg"
                  className="w-full px-3 py-1.5 border border-[#8c8f94] rounded focus:border-[#2271b1] outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-[#1d2327] mb-1">Image / Asset URL</label>
                <input
                  type="url"
                  required
                  value={newUrl}
                  onChange={(e) => setNewUrl(e.target.value)}
                  placeholder="https://..."
                  className="w-full px-3 py-1.5 border border-[#8c8f94] rounded focus:border-[#2271b1] outline-none"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-[#dcdcde]">
                <button
                  type="button"
                  onClick={() => setShowUploadModal(false)}
                  className="px-3 py-1.5 border border-[#8c8f94] text-[#2c3338] rounded font-semibold hover:bg-[#f0f0f1]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-[#2271b1] hover:bg-[#135e96] text-white rounded font-bold"
                >
                  Add Media
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
