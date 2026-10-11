import React, { useState } from 'react';
import {
  Layers,
  Plus,
  Trash2,
  Edit,
  Eye,
  EyeOff,
  ArrowUp,
  ArrowDown,
  Sparkles,
  Sliders,
  CheckCircle2,
  Palette,
  LayoutTemplate
} from 'lucide-react';

export interface SiteSection {
  id: string;
  name: string;
  key: string;
  heading: string;
  subheading: string;
  enabled: boolean;
  order: number;
  badge?: string;
  theme?: 'light' | 'emerald' | 'dark' | 'warm';
  customHtml?: string;
}

const DEFAULT_SECTIONS: SiteSection[] = [
  { id: 'sec-hero', name: 'Hero Banner & Direct Mandi Intro', key: 'hero', heading: 'Pakistan Direct Mandi Rice Sourcing Hub', subheading: 'Shop #4, Noor Galla Mandi, Bucheki | Connecting 100+ Rice Mills to Foodservice & Wholesale Buyers Nationwide', enabled: true, order: 1, badge: 'Core' },
  { id: 'sec-ticker', name: 'Mandi Exchange Spot Rates Ticker', key: 'ticker', heading: 'Live Galla Mandi Spot Rates & Commodity Matrix', subheading: 'Daily live pricing per 40kg maund and 50kg bag verified at Noor Galla Mandi trading floor.', enabled: true, order: 2, badge: 'Live Data' },
  { id: 'sec-varieties', name: 'Rice Varieties Catalog & Specs', key: 'varieties', heading: 'Premium Rice Varieties & Grain Elongation Ratios', subheading: '1121 Kainat, Super Kernel Basmati, 1509 Golden Sella, and IRRI-6 with complete cooking metrics.', enabled: true, order: 3, badge: 'Catalog' },
  { id: 'sec-workflow', name: 'Mandi Sourcing & Quality Workflow', key: 'workflow', heading: 'The Bucheki Mandi Sourcing Protocol', subheading: 'From paddy inspection to double silky polishing, destoning, and weighbridge bilty dispatch.', enabled: true, order: 4 },
  { id: 'sec-whoweserve', name: 'Who We Serve (Caterers, Biryani, Mills)', key: 'whoweserve', heading: 'Foodservice, Caterers & Wholesale Buyers We Power', subheading: 'Supplying bulk truckloads and verified Free Samples across Pakistan.', enabled: true, order: 5 },
  { id: 'sec-calculator', name: 'Interactive Bag & Maund Calculator', key: 'calculator', heading: 'B2B Rice Volume & Freight Estimator', subheading: 'Calculate exact 40kg maunds, 50kg bags, and trailer freight rates to your city.', enabled: true, order: 6, badge: 'Tool' },
  { id: 'sec-reviews', name: 'Verified Customer & Chef Reviews', key: 'reviews', heading: 'What Leading Chefs & Grain Wholesalers Say', subheading: 'Real feedback from catering contractors and biryani masters nationwide.', enabled: true, order: 7 },
  { id: 'sec-locations', name: 'Pakistan 60+ City Freight Corridors', key: 'locations', heading: 'Direct Dispatches to 60+ Pakistan Cities', subheading: 'Daily bilty dispatches connecting Bucheki Mandi with Karachi, Lahore, Rawalpindi, and Peshawar.', enabled: true, order: 8 },
  { id: 'sec-blog', name: 'Rice Knowledge Base & Cooking Guides', key: 'blog', heading: 'Mandi Market Reports & Rice Science', subheading: 'Grain physics, sella vs steam comparisons, and wholesale pricing forecasts.', enabled: true, order: 9 },
  { id: 'sec-news', name: 'International Commodity News & Policy', key: 'news', heading: 'Global Rice Trade & Export Intelligence', subheading: 'Freight routes, Middle East demand, and REAP export quotas.', enabled: true, order: 10 },
  { id: 'sec-faqs', name: 'Frequently Asked Mandi Questions', key: 'faqs', heading: 'Frequently Asked Sourcing Questions', subheading: 'Sample delivery, minimum orders, payment terms, and moisture testing.', enabled: true, order: 11 },
  { id: 'sec-contact', name: 'Mandi HQ Location & Direct WhatsApp', key: 'contact', heading: 'Visit Us at Noor Galla Mandi, Bucheki', subheading: 'Shop #4, Noor Galla Mandi, Bucheki, Nankana Sahib, Punjab. Call or WhatsApp Hashir Rice Supplier.', enabled: true, order: 12, badge: 'Map & Contact' },
];

interface AdminSectionsManagerProps {
  onSuccessToast?: (msg: string) => void;
}

export const AdminSectionsManager: React.FC<AdminSectionsManagerProps> = ({ onSuccessToast }) => {
  const [sections, setSections] = useState<SiteSection[]>(() => {
    const saved = localStorage.getItem('hashir_rice_admin_sections');
    return saved ? JSON.parse(saved) : DEFAULT_SECTIONS;
  });

  const [editingSection, setEditingSection] = useState<SiteSection | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);

  const [sectionForm, setSectionForm] = useState<Partial<SiteSection>>({
    name: '',
    heading: '',
    subheading: '',
    enabled: true,
    theme: 'light',
    customHtml: ''
  });

  const saveSections = (updated: SiteSection[]) => {
    setSections(updated);
    localStorage.setItem('hashir_rice_admin_sections', JSON.stringify(updated));
  };

  const handleToggleEnabled = (id: string) => {
    const updated = sections.map((s) => (s.id === id ? { ...s, enabled: !s.enabled } : s));
    saveSections(updated);
    if (onSuccessToast) onSuccessToast(`Section visibility toggled.`);
  };

  const handleMove = (index: number, direction: 'up' | 'down') => {
    if (direction === 'up' && index === 0) return;
    if (direction === 'down' && index === sections.length - 1) return;

    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    const reordered = [...sections];
    const temp = reordered[index];
    reordered[index] = reordered[targetIndex];
    reordered[targetIndex] = temp;

    // Update order numbers
    const final = reordered.map((sec, idx) => ({ ...sec, order: idx + 1 }));
    saveSections(final);
    if (onSuccessToast) onSuccessToast(`Section order updated.`);
  };

  const handleDeleteSection = (id: string, name: string) => {
    if (window.confirm(`Are you sure you want to remove section "${name}"?`)) {
      const updated = sections.filter((s) => s.id !== id);
      saveSections(updated);
      if (onSuccessToast) onSuccessToast(`Section "${name}" deleted.`);
    }
  };

  const handleSaveSection = (e: React.FormEvent) => {
    e.preventDefault();
    if (!sectionForm.name || !sectionForm.heading) return;

    if (editingSection) {
      const updated = sections.map((s) => (s.id === editingSection.id ? { ...s, ...sectionForm } as SiteSection : s));
      saveSections(updated);
      if (onSuccessToast) onSuccessToast(`Section "${sectionForm.name}" updated.`);
    } else {
      const newSec: SiteSection = {
        id: `sec-custom-${Date.now()}`,
        key: `custom-${Date.now()}`,
        name: sectionForm.name,
        heading: sectionForm.heading,
        subheading: sectionForm.subheading || '',
        enabled: sectionForm.enabled ?? true,
        order: sections.length + 1,
        badge: 'Custom Widget',
        theme: sectionForm.theme || 'light',
        customHtml: sectionForm.customHtml || ''
      };
      saveSections([...sections, newSec]);
      if (onSuccessToast) onSuccessToast(`Custom Section "${newSec.name}" added to homepage.`);
    }
    setShowAddModal(false);
    setEditingSection(null);
  };

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="bg-white border border-[#c3c4c7] rounded-lg p-5 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded text-[10px] font-extrabold uppercase bg-amber-100 text-amber-900 border border-amber-300">
              Visual Page & Section Builder
            </span>
            <span className="text-xs text-[#646970]">{sections.filter((s) => s.enabled).length} Active Sections</span>
          </div>
          <h2 className="text-xl font-bold text-[#1d2327] mt-1 flex items-center gap-2 font-serif">
            <Layers className="w-5 h-5 text-amber-600" />
            Homepage & Site Sections Controller
          </h2>
        </div>

        <button
          onClick={() => {
            setEditingSection(null);
            setSectionForm({
              name: '',
              heading: '',
              subheading: '',
              enabled: true,
              theme: 'light',
              customHtml: ''
            });
            setShowAddModal(true);
          }}
          className="px-3.5 py-2 bg-[#2271b1] hover:bg-[#135e96] text-white rounded text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-xs"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Add Custom Section</span>
        </button>
      </div>

      {/* SECTIONS LIST WITH REORDER & TOGGLES */}
      <div className="bg-white border border-[#c3c4c7] rounded-lg shadow-xs p-5 space-y-3">
        <div className="flex items-center justify-between text-xs text-[#646970] pb-2 border-b border-[#dcdcde] font-bold">
          <span>Reorder & Configure Sections</span>
          <span>Visibility Status</span>
        </div>

        <div className="divide-y divide-[#dcdcde] text-xs">
          {sections.map((sec, idx) => (
            <div key={sec.id} className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-[#f6f7f7] px-2 rounded">
              <div className="flex items-center gap-3">
                {/* Reorder Buttons */}
                <div className="flex flex-col gap-1 shrink-0">
                  <button
                    disabled={idx === 0}
                    onClick={() => handleMove(idx, 'up')}
                    className="p-1 text-[#8c8f94] hover:text-[#1d2327] disabled:opacity-30 cursor-pointer"
                    title="Move Up"
                  >
                    <ArrowUp className="w-3.5 h-3.5" />
                  </button>
                  <button
                    disabled={idx === sections.length - 1}
                    onClick={() => handleMove(idx, 'down')}
                    className="p-1 text-[#8c8f94] hover:text-[#1d2327] disabled:opacity-30 cursor-pointer"
                    title="Move Down"
                  >
                    <ArrowDown className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-[#1d2327] text-sm">{idx + 1}. {sec.name}</span>
                    {sec.badge && (
                      <span className="px-2 py-0.2 rounded text-[10px] font-bold bg-neutral-100 text-neutral-800 border border-neutral-300">
                        {sec.badge}
                      </span>
                    )}
                  </div>
                  <p className="text-[#50575e] text-xs line-clamp-1">{sec.heading}</p>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0 self-end sm:self-auto">
                <button
                  onClick={() => handleToggleEnabled(sec.id)}
                  className={`px-2.5 py-1 rounded text-[11px] font-bold flex items-center gap-1.5 transition-colors cursor-pointer border ${
                    sec.enabled
                      ? 'bg-emerald-100 text-emerald-900 border-emerald-300 hover:bg-emerald-200'
                      : 'bg-neutral-100 text-neutral-600 border-neutral-300 hover:bg-neutral-200'
                  }`}
                >
                  {sec.enabled ? <Eye className="w-3.5 h-3.5 text-emerald-700" /> : <EyeOff className="w-3.5 h-3.5 text-neutral-500" />}
                  <span>{sec.enabled ? 'Enabled' : 'Hidden'}</span>
                </button>

                <button
                  onClick={() => {
                    setEditingSection(sec);
                    setSectionForm(sec);
                    setShowAddModal(true);
                  }}
                  className="px-2.5 py-1 bg-white hover:bg-neutral-100 text-[#2271b1] border border-[#8c8f94] rounded text-xs font-semibold"
                >
                  <Edit className="w-3 h-3 inline mr-1" />
                  Edit
                </button>

                {sec.id.startsWith('sec-custom') && (
                  <button
                    onClick={() => handleDeleteSection(sec.id, sec.name)}
                    className="px-2 py-1 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-300 rounded text-xs font-semibold"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* MODAL: ADD / EDIT SECTION */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-xs">
          <div className="bg-white rounded-xl shadow-2xl max-w-lg w-full p-6 space-y-4 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-[#dcdcde] pb-3">
              <h3 className="font-bold text-base text-[#1d2327] flex items-center gap-2">
                <Layers className="w-5 h-5 text-amber-600" />
                <span>{editingSection ? 'Edit Website Section' : 'Create Custom Section'}</span>
              </h3>
              <button onClick={() => setShowAddModal(false)} className="text-[#646970] hover:text-[#1d2327] text-lg font-bold">×</button>
            </div>

            <form onSubmit={handleSaveSection} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-[#1d2327] mb-1">Section Internal Name</label>
                <input
                  type="text"
                  required
                  value={sectionForm.name}
                  onChange={(e) => setSectionForm({ ...sectionForm, name: e.target.value })}
                  placeholder="e.g. Export Shipping Ports & Container Booking"
                  className="w-full px-3 py-1.5 border border-[#8c8f94] rounded focus:border-[#2271b1] outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-[#1d2327] mb-1">Public Section Heading</label>
                <input
                  type="text"
                  required
                  value={sectionForm.heading}
                  onChange={(e) => setSectionForm({ ...sectionForm, heading: e.target.value })}
                  placeholder="e.g. Containerized Rice Export from Port Qasim"
                  className="w-full px-3 py-1.5 border border-[#8c8f94] rounded focus:border-[#2271b1] outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-[#1d2327] mb-1">Subheading / Description</label>
                <textarea
                  rows={2}
                  value={sectionForm.subheading}
                  onChange={(e) => setSectionForm({ ...sectionForm, subheading: e.target.value })}
                  placeholder="Supporting text..."
                  className="w-full px-3 py-1.5 border border-[#8c8f94] rounded focus:border-[#2271b1] outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-[#1d2327] mb-1">Color Theme</label>
                  <select
                    value={sectionForm.theme}
                    onChange={(e) => setSectionForm({ ...sectionForm, theme: e.target.value as any })}
                    className="w-full px-3 py-1.5 border border-[#8c8f94] rounded focus:border-[#2271b1] outline-none bg-white"
                  >
                    <option value="light">Crisp Light Neutral</option>
                    <option value="emerald">Emerald Mandi Accent</option>
                    <option value="warm">Warm Harvest Amber</option>
                    <option value="dark">Executive Deep Slate</option>
                  </select>
                </div>

                <div className="flex items-center gap-2 pt-5">
                  <input
                    type="checkbox"
                    id="sectionEnabledCheckbox"
                    checked={sectionForm.enabled}
                    onChange={(e) => setSectionForm({ ...sectionForm, enabled: e.target.checked })}
                    className="rounded text-[#2271b1]"
                  />
                  <label htmlFor="sectionEnabledCheckbox" className="font-semibold text-[#1d2327]">
                    Render on Live Site
                  </label>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-[#dcdcde]">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-3 py-1.5 border border-[#8c8f94] text-[#2c3338] rounded font-semibold hover:bg-[#f0f0f1]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-[#2271b1] hover:bg-[#135e96] text-white rounded font-bold"
                >
                  {editingSection ? 'Save Section' : 'Create Section'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
