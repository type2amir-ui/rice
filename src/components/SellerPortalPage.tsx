import React, { useState, useEffect, useRef } from 'react';
import {
  Store,
  Plus,
  Search,
  Filter,
  CheckCircle2,
  Phone,
  MessageCircle,
  Sparkles,
  Package,
  Layers,
  MapPin,
  TrendingDown,
  Clock,
  ShieldCheck,
  ExternalLink,
  ChevronRight,
  Trash2,
  Edit3,
  Eye,
  Camera,
  UploadCloud,
  X,
  Building,
  User,
  Mail,
  Info,
  Check,
  ArrowRight,
  Lock,
  LogOut,
  Star,
  RefreshCw,
  Scale
} from 'lucide-react';
import { SellerSample, SellerUser, RiceVarietyCategory } from '../types';
import { INITIAL_SELLER_SAMPLES, INITIAL_SELLER_USERS, PRESET_SAMPLE_PHOTOS, RICE_VARIETY_CATEGORIES, RiceCategoryDef } from '../data/sellerSamplesData';
import { GoogleBusinessMap } from './GoogleBusinessMap';

interface SellerPortalPageProps {
  onOpenSampleModal?: (varietyName?: string) => void;
  onOpenQuoteModal?: (varietyName?: string) => void;
  setCurrentView: (view: string) => void;
  onSuccessToast?: (msg: string) => void;
}

const STORAGE_KEY_SAMPLES = 'hashir_rice_seller_samples_v1';
const STORAGE_KEY_USER = 'hashir_rice_active_seller_v1';

export const SellerPortalPage: React.FC<SellerPortalPageProps> = ({
  onOpenSampleModal,
  onOpenQuoteModal,
  setCurrentView,
  onSuccessToast
}) => {
  // Authentication State
  const [activeUser, setActiveUser] = useState<SellerUser | null>(null);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authEmail, setAuthEmail] = useState('trade@hashirricesupplier.com');
  const [authName, setAuthName] = useState('Hashir Rice Supplier');
  const [authCompany, setAuthCompany] = useState('Hashir Rice Supplier (Owner: Muhammad Amir Shahzad)');
  const [authMandi, setAuthMandi] = useState('Noor Galla Mandi, Bucheki');
  const [authCity, setAuthCity] = useState('Bucheki (Nankana Sahib)');
  const [authWhatsApp, setAuthWhatsApp] = useState('+92 333 8990883');
  const [authRole, setAuthRole] = useState<'miller' | 'commission-agent' | 'broker' | 'exporter'>('miller');

  // Samples State
  const [samples, setSamples] = useState<SellerSample[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedStockFilter, setSelectedStockFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'newest' | 'stock' | 'length'>('newest');

  // Modal for Adding / Editing Sample
  const [showAddSampleModal, setShowAddSampleModal] = useState(false);
  const [editingSampleId, setEditingSampleId] = useState<string | null>(null);
  const [zoomImage, setZoomImage] = useState<string | null>(null);
  const [viewTab, setViewTab] = useState<'all-samples' | 'my-lots' | 'guidelines'>('all-samples');

  // Form Fields for Add/Edit Sample
  const [formVarietyName, setFormVarietyName] = useState('1121 Kainat Basmati Steam (XXL Grain)');
  const [formCategory, setFormCategory] = useState<RiceVarietyCategory | string>('1121-kainat');
  const [formProcessing, setFormProcessing] = useState('Steam (Double Polished & Sortexed)');
  const [formImageUrl, setFormImageUrl] = useState(PRESET_SAMPLE_PHOTOS[0].url);
  const [formTotalLotSize, setFormTotalLotSize] = useState('100 Metric Tons (2,000 Bags)');
  const [formRemainingStock, setFormRemainingStock] = useState('60 Tons (1,200 Bags)');
  const [formRemainingNumber, setFormRemainingNumber] = useState(60);
  const [formStockUnit, setFormStockUnit] = useState<'Tons' | 'Bags (50kg)' | 'Bags (25kg)' | 'Maunds (40kg)'>('Tons');
  const [formStockStatus, setFormStockStatus] = useState<'available' | 'low-stock' | 'sold-out'>('available');
  const [formGrainLength, setFormGrainLength] = useState('8.40 mm');
  const [formCookedLength, setFormCookedLength] = useState('19.5 mm - 21.0 mm');
  const [formMoisture, setFormMoisture] = useState('11.5%');
  const [formBroken, setFormBroken] = useState('1.5% max');
  const [formCropYear, setFormCropYear] = useState('2025/2026 Fresh Harvest');
  const [formAskingRate, setFormAskingRate] = useState('Rs. 13,200 / 40kg Ex-Mill');
  const [formPriceType, setFormPriceType] = useState<'Ex-Mill' | 'FOR Dispatch' | 'Mandi Spot'>('Ex-Mill');
  const [formMinOrder, setFormMinOrder] = useState('1 Truck (25 Tons / 500 Bags)');
  const [formCourierAvailable, setFormCourierAvailable] = useState(true);
  const [formLabReport, setFormLabReport] = useState(true);
  const [formDescription, setFormDescription] = useState('Export grade lot with zero chalkiness, silky finish, and massive elongation. Ready for instant mandi dispatch.');
  const [formSellerWhatsApp, setFormSellerWhatsApp] = useState('+92 333 8990883');

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Initialize storage
  useEffect(() => {
    try {
      const storedUser = localStorage.getItem(STORAGE_KEY_USER);
      if (storedUser) {
        setActiveUser(JSON.parse(storedUser));
      } else {
        // Default demo logged-in user: Hashir Rice Supplier (Owner: Muhammad Amir Shahzad)
        const defaultUser = INITIAL_SELLER_USERS[0];
        setActiveUser(defaultUser);
        localStorage.setItem(STORAGE_KEY_USER, JSON.stringify(defaultUser));
      }

      const storedSamples = localStorage.getItem(STORAGE_KEY_SAMPLES);
      if (storedSamples) {
        const parsed = JSON.parse(storedSamples);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setSamples(parsed);
        } else {
          setSamples(INITIAL_SELLER_SAMPLES);
          localStorage.setItem(STORAGE_KEY_SAMPLES, JSON.stringify(INITIAL_SELLER_SAMPLES));
        }
      } else {
        setSamples(INITIAL_SELLER_SAMPLES);
        localStorage.setItem(STORAGE_KEY_SAMPLES, JSON.stringify(INITIAL_SELLER_SAMPLES));
      }
    } catch {
      setSamples(INITIAL_SELLER_SAMPLES);
      setActiveUser(INITIAL_SELLER_USERS[0]);
    }
  }, []);

  // Save samples to localStorage whenever state changes
  const persistSamples = (newSamples: SellerSample[]) => {
    setSamples(newSamples);
    try {
      localStorage.setItem(STORAGE_KEY_SAMPLES, JSON.stringify(newSamples));
    } catch {
      // ignore
    }
  };

  // Handle Google Sign-in Simulation
  const handleGoogleSignIn = (customEmail?: string) => {
    const emailToUse = customEmail || authEmail;
    const newUser: SellerUser = {
      id: `seller-${Date.now()}`,
      fullName: authName || 'Chaudhry Rice Miller',
      email: emailToUse,
      avatarUrl: `https://ui-avatars.com/api/?name=${encodeURIComponent(authName || 'Rice Seller')}&background=047857&color=ffffff&bold=true`,
      companyName: authCompany || 'Punjab Agro Mills',
      mandiLocation: authMandi || 'Noor Galla Mandi, Bucheki',
      city: authCity || 'Nankana Sahib',
      whatsappNumber: authWhatsApp || '+92 333 8990883',
      isVerified: true,
      role: authRole,
      joinedDate: new Date().toISOString().split('T')[0]
    };

    setActiveUser(newUser);
    try {
      localStorage.setItem(STORAGE_KEY_USER, JSON.stringify(newUser));
    } catch {
      // ignore
    }
    setShowAuthModal(false);
    if (onSuccessToast) {
      onSuccessToast(`Signed in successfully with Google (${newUser.email})`);
    }
  };

  const handleSignOut = () => {
    setActiveUser(null);
    try {
      localStorage.removeItem(STORAGE_KEY_USER);
    } catch {
      // ignore
    }
    if (onSuccessToast) {
      onSuccessToast('Signed out of seller portal.');
    }
  };

  // Image Upload handler
  const handleImageFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          setFormImageUrl(reader.result);
          if (onSuccessToast) {
            onSuccessToast('Sample photo uploaded successfully!');
          }
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // Submit Add / Edit Sample Form
  const handleSaveSample = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeUser) {
      setShowAuthModal(true);
      return;
    }

    const sellerPhone = formSellerWhatsApp.trim() || activeUser.whatsappNumber;

    if (editingSampleId) {
      // Update existing sample
      const updated = samples.map((s) => {
        if (s.id === editingSampleId) {
          return {
            ...s,
            varietyName: formVarietyName,
            varietyCategory: formCategory,
            processingGrade: formProcessing,
            sampleImageUrl: formImageUrl,
            totalLotSize: formTotalLotSize,
            remainingStock: formRemainingStock,
            remainingStockNumber: formRemainingNumber,
            stockUnit: formStockUnit,
            stockStatus: formStockStatus,
            averageGrainLength: formGrainLength,
            cookedLength: formCookedLength,
            moisturePercent: formMoisture,
            brokenPercent: formBroken,
            cropYear: formCropYear,
            askingRatePkr: formAskingRate,
            priceType: formPriceType,
            minimumOrder: formMinOrder,
            sampleCourierAvailable: formCourierAvailable,
            labReportAvailable: formLabReport,
            description: formDescription,
            sellerWhatsApp: sellerPhone
          };
        }
        return s;
      });
      persistSamples(updated);
      if (onSuccessToast) {
        onSuccessToast(`Sample "${formVarietyName}" updated with current stock: ${formRemainingStock}!`);
      }
    } else {
      // Create new sample
      const newSample: SellerSample = {
        id: `sample-${Date.now()}`,
        sellerId: activeUser.id,
        sellerName: activeUser.fullName,
        sellerCompany: activeUser.companyName,
        sellerMandiLocation: activeUser.mandiLocation,
        sellerCity: activeUser.city,
        sellerWhatsApp: sellerPhone,
        sellerEmail: activeUser.email,
        sellerAvatar: activeUser.avatarUrl,
        isVerifiedSeller: true,
        varietyName: formVarietyName,
        varietyCategory: formCategory,
        processingGrade: formProcessing,
        sampleImageUrl: formImageUrl,
        sampleImages: [formImageUrl],
        totalLotSize: formTotalLotSize,
        remainingStock: formRemainingStock,
        remainingStockNumber: formRemainingNumber,
        stockUnit: formStockUnit,
        stockStatus: formStockStatus,
        averageGrainLength: formGrainLength,
        cookedLength: formCookedLength,
        moisturePercent: formMoisture,
        brokenPercent: formBroken,
        cropYear: formCropYear,
        askingRatePkr: formAskingRate,
        priceType: formPriceType,
        minimumOrder: formMinOrder,
        sampleCourierAvailable: formCourierAvailable,
        labReportAvailable: formLabReport,
        description: formDescription,
        createdDate: new Date().toISOString().split('T')[0],
        viewsCount: 1,
        inquiryCount: 0
      };

      persistSamples([newSample, ...samples]);
      if (onSuccessToast) {
        onSuccessToast(`New Rice Sample "${formVarietyName}" posted with ${formRemainingStock} remaining stock!`);
      }
    }

    setShowAddSampleModal(false);
    setEditingSampleId(null);
  };

  // Open Edit Modal with sample data
  const handleEditSample = (sample: SellerSample) => {
    setEditingSampleId(sample.id);
    setFormVarietyName(sample.varietyName);
    setFormCategory(sample.varietyCategory);
    setFormProcessing(sample.processingGrade);
    setFormImageUrl(sample.sampleImageUrl);
    setFormTotalLotSize(sample.totalLotSize);
    setFormRemainingStock(sample.remainingStock);
    setFormRemainingNumber(sample.remainingStockNumber);
    setFormStockUnit(sample.stockUnit);
    setFormStockStatus(sample.stockStatus);
    setFormGrainLength(sample.averageGrainLength);
    setFormCookedLength(sample.cookedLength);
    setFormMoisture(sample.moisturePercent);
    setFormBroken(sample.brokenPercent);
    setFormCropYear(sample.cropYear);
    setFormAskingRate(sample.askingRatePkr);
    setFormPriceType(sample.priceType);
    setFormMinOrder(sample.minimumOrder);
    setFormCourierAvailable(sample.sampleCourierAvailable);
    setFormLabReport(sample.labReportAvailable);
    setFormDescription(sample.description);
    setFormSellerWhatsApp(sample.sellerWhatsApp);
    setShowAddSampleModal(true);
  };

  // Delete a sample
  const handleDeleteSample = (id: string) => {
    if (window.confirm('Are you sure you want to remove this rice sample lot?')) {
      const filtered = samples.filter((s) => s.id !== id);
      persistSamples(filtered);
      if (onSuccessToast) {
        onSuccessToast('Sample removed from active marketplace.');
      }
    }
  };

  // Update stock level quickly
  const handleQuickUpdateStock = (sampleId: string, newStockText: string, newStatus: 'available' | 'low-stock' | 'sold-out') => {
    const updated = samples.map((s) => {
      if (s.id === sampleId) {
        return {
          ...s,
          remainingStock: newStockText,
          stockStatus: newStatus
        };
      }
      return s;
    });
    persistSamples(updated);
    if (onSuccessToast) {
      onSuccessToast(`Stock updated to: ${newStockText}`);
    }
  };

  // Generate WhatsApp Message URL for a sample
  const getWhatsAppSampleUrl = (sample: SellerSample) => {
    const cleanPhone = sample.sellerWhatsApp.replace(/[^0-9]/g, '');
    const phone = cleanPhone.startsWith('92') ? cleanPhone : `92${cleanPhone.replace(/^0/, '')}`;
    const text = encodeURIComponent(
      `Hello ${sample.sellerName} (${sample.sellerCompany}),\n\nI am interested in your active rice sample on Hashir Rice Supplier Exchange:\n\n🌾 Variety: ${sample.varietyName}\n📦 Lot ID: #${sample.id.slice(-6).toUpperCase()}\n📊 Remaining Stock: ${sample.remainingStock}\n💰 Asking Rate: ${sample.askingRatePkr}\n📍 Mill Location: ${sample.sellerMandiLocation}, ${sample.sellerCity}\n\nPlease share latest ex-mill terms, test cooking video, and dispatch schedule.`
    );
    return `https://wa.me/${phone}?text=${text}`;
  };

  // Handle Category Change with auto-fill defaults for new lots
  const handleCategoryChange = (categoryId: string) => {
    setFormCategory(categoryId);
    const catDef = RICE_VARIETY_CATEGORIES.find((c) => c.id === categoryId);
    if (catDef && !editingSampleId) {
      setFormGrainLength(catDef.defaultGrainLength);
      setFormCookedLength(catDef.defaultCookedLength);
      setFormMoisture(catDef.defaultMoisture);
      setFormBroken(catDef.defaultBroken);
      setFormProcessing(catDef.defaultProcessing);
      setFormDescription(catDef.defaultDescription);
      setFormImageUrl(catDef.defaultPhotoUrl);
    }
  };

  // Select Quick Variety Preset
  const handleSelectQuickVariety = (catDef: RiceCategoryDef) => {
    setFormCategory(catDef.id);
    setFormVarietyName(catDef.label.split('(')[0].trim());
    setFormGrainLength(catDef.defaultGrainLength);
    setFormCookedLength(catDef.defaultCookedLength);
    setFormMoisture(catDef.defaultMoisture);
    setFormBroken(catDef.defaultBroken);
    setFormProcessing(catDef.defaultProcessing);
    setFormDescription(catDef.defaultDescription);
    setFormImageUrl(catDef.defaultPhotoUrl);
  };

  // Helper to match category across specific and legacy tags
  const matchSampleCategory = (sample: SellerSample, filter: string) => {
    if (filter === 'all') return true;
    const cat = (sample.varietyCategory || '').toLowerCase();
    const name = (sample.varietyName || '').toLowerCase();

    if (filter === '1121-kainat') {
      return cat === '1121-kainat' || (cat === 'basmati' && (name.includes('1121') || name.includes('kainat'))) || name.includes('1121');
    }
    if (filter === 'super-kernel') {
      return cat === 'super-kernel' || (cat === 'basmati' && (name.includes('super') || name.includes('kernel'))) || name.includes('super kernel');
    }
    if (filter === '1509-basmati') {
      return cat === '1509-basmati' || cat === '1509' || name.includes('1509');
    }
    if (filter === 'sella-parboiled') {
      return cat === 'sella-parboiled' || (cat === 'sella' && !name.includes('1121') && !name.includes('1509')) || name.includes('sella') || name.includes('parboiled');
    }
    if (filter === 'pk-386') {
      return cat === 'pk-386' || (cat === 'long-grain' && name.includes('386')) || name.includes('386') || name.includes('ksk');
    }
    if (filter === 'irri-6') {
      return cat === 'irri-6' || (cat === 'long-grain' && name.includes('irri-6')) || name.includes('irri-6') || name.includes('irri 6');
    }
    if (filter === 'irri-9') {
      return cat === 'irri-9' || (cat === 'long-grain' && name.includes('irri-9')) || name.includes('irri-9') || name.includes('irri 9');
    }
    if (filter === 'c9-d98') {
      return cat === 'c9-d98' || cat === 'c9' || cat === 'd98' || name.includes('c9') || name.includes('d-98') || name.includes('sindh');
    }
    if (filter === 'basmati-515') {
      return cat === 'basmati-515' || name.includes('515') || name.includes('kisan');
    }
    if (filter === 'broken-tota') {
      return cat === 'broken-tota' || cat === 'broken' || name.includes('broken') || name.includes('tota') || name.includes('kani');
    }
    if (filter === 'brown-specialty') {
      return cat === 'brown-specialty' || cat === 'specialty' || name.includes('brown') || name.includes('diet') || name.includes('organic');
    }
    return cat === filter;
  };

  // Helper for category badge title
  const getCategoryBadgeLabel = (category: string, varietyName?: string): string => {
    const c = (category || '').toLowerCase();
    const n = (varietyName || '').toLowerCase();
    if (c === '1121-kainat' || n.includes('1121')) return '1121 Kainat Basmati';
    if (c === 'super-kernel' || n.includes('super kernel')) return 'Super Kernel Basmati';
    if (c === '1509-basmati' || n.includes('1509')) return '1509 Basmati';
    if (c === 'sella-parboiled' || (c === 'sella' && !n.includes('1121') && !n.includes('1509'))) return 'Golden / Creamy Sella';
    if (c === 'pk-386' || n.includes('386')) return 'PK 386 Long Grain';
    if (c === 'irri-6' || n.includes('irri-6') || n.includes('irri 6')) return 'IRRI-6 Long Grain';
    if (c === 'irri-9' || n.includes('irri-9') || n.includes('irri 9')) return 'IRRI-9 Long Grain';
    if (c === 'c9-d98' || n.includes('c9') || n.includes('d-98')) return 'C9 / D-98 Sindh';
    if (c === 'basmati-515' || n.includes('515')) return 'Basmati 515 / Kisan';
    if (c === 'broken-tota' || c === 'broken' || n.includes('broken') || n.includes('tota')) return 'Broken Tota / Kani';
    if (c === 'brown-specialty' || c === 'specialty' || n.includes('brown')) return 'Brown & Specialty';
    if (c === 'basmati') return 'Basmati';
    if (c === 'long-grain') return 'Long Grain';
    return category || 'Rice Lot';
  };

  // Filtered samples
  const filteredSamples = samples
    .filter((s) => {
      if (viewTab === 'my-lots') {
        if (!activeUser) return false;
        return s.sellerId === activeUser.id || s.sellerEmail === activeUser.email;
      }
      return true;
    })
    .filter((s) => {
      return matchSampleCategory(s, selectedCategory);
    })
    .filter((s) => {
      if (selectedStockFilter === 'all') return true;
      if (selectedStockFilter === 'available') return s.stockStatus === 'available';
      if (selectedStockFilter === 'low-stock') return s.stockStatus === 'low-stock';
      if (selectedStockFilter === 'sold-out') return s.stockStatus === 'sold-out';
      return true;
    })
    .filter((s) => {
      if (!searchQuery.trim()) return true;
      const q = searchQuery.toLowerCase();
      return (
        s.varietyName.toLowerCase().includes(q) ||
        s.sellerCompany.toLowerCase().includes(q) ||
        s.sellerCity.toLowerCase().includes(q) ||
        s.sellerMandiLocation.toLowerCase().includes(q) ||
        s.processingGrade.toLowerCase().includes(q)
      );
    })
    .sort((a, b) => {
      if (sortBy === 'stock') {
        return b.remainingStockNumber - a.remainingStockNumber;
      }
      if (sortBy === 'length') {
        return parseFloat(b.averageGrainLength) - parseFloat(a.averageGrainLength);
      }
      return new Date(b.createdDate).getTime() - new Date(a.createdDate).getTime();
    });

  const myLotsCount = activeUser
    ? samples.filter((s) => s.sellerId === activeUser.id || s.sellerEmail === activeUser.email).length
    : 0;

  return (
    <div className="min-h-screen bg-neutral-900 text-neutral-100 font-sans pb-20">
      {/* Top Banner Header */}
      <section className="bg-neutral-950 border-b border-neutral-800 relative overflow-hidden py-10 sm:py-14">
        <div className="absolute inset-0 opacity-10 pointer-events-none bg-[radial-gradient(#10b981_1px,transparent_1px)] [background-size:16px_16px]" />

        <div className="w-full max-w-7xl 2xl:max-w-[1536px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div className="space-y-3 max-w-3xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-950/80 border border-emerald-500/30 text-emerald-300 text-xs font-bold uppercase tracking-wider">
                <Store className="w-3.5 h-3.5 text-emerald-400" />
                <span>Punjab & Sindh Rice Miller Exchange</span>
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              </div>

              <h1 className="font-serif text-2xl sm:text-4xl lg:text-5xl font-bold text-white tracking-tight leading-tight">
                Seller Sample Desk & <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-emerald-300 to-emerald-100">
                  Live Stock Exchange
                </span>
              </h1>

              <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed">
                Registered rice millers, commission agents, and grain traders post physical cooking samples, grain photos, technical lab specs, and live remaining stock. Buyers connect directly via verified seller WhatsApp.
              </p>
            </div>

            {/* Seller Account & Fast Action Card */}
            <div className="bg-neutral-900/90 border border-neutral-800 rounded-2xl p-4 sm:p-5 flex flex-col gap-3 min-w-[280px] sm:min-w-[320px] shadow-xl">
              {activeUser ? (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1">
                      <ShieldCheck className="w-3.5 h-3.5" />
                      Verified Seller Account
                    </span>
                    <button
                      onClick={handleSignOut}
                      className="text-[11px] text-neutral-400 hover:text-red-400 flex items-center gap-1 transition-colors cursor-pointer"
                      title="Sign Out"
                    >
                      <LogOut className="w-3 h-3" />
                      <span>Sign Out</span>
                    </button>
                  </div>

                  <div className="flex items-center gap-3 bg-neutral-950 p-2.5 rounded-xl border border-neutral-800">
                    <img
                      src={activeUser.avatarUrl || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=200'}
                      alt={activeUser.fullName}
                      className="w-10 h-10 rounded-full border border-emerald-500/40 object-cover"
                    />
                    <div className="overflow-hidden">
                      <strong className="block text-xs font-bold text-white truncate">{activeUser.fullName}</strong>
                      <span className="text-[11px] text-neutral-400 truncate block">{activeUser.companyName}</span>
                      <span className="text-[10px] text-emerald-400 flex items-center gap-1 font-mono">
                        <Mail className="w-3 h-3" /> {activeUser.email}
                      </span>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <a
                      id="btn-post-new-sample-header"
                      href="https://trade.hashirricesupplier.com/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 py-2.5 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-md transition-all cursor-pointer"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Add your rice sample</span>
                      <ExternalLink className="w-3.5 h-3.5 opacity-80" />
                    </a>

                    <button
                      onClick={() => setViewTab('my-lots')}
                      className={`px-3 py-2.5 rounded-xl text-xs font-bold border transition-colors cursor-pointer ${
                        viewTab === 'my-lots'
                          ? 'bg-amber-400 text-neutral-950 border-amber-400'
                          : 'bg-neutral-800 text-neutral-200 border-neutral-700 hover:bg-neutral-700'
                      }`}
                    >
                      My Lots ({myLotsCount})
                    </button>
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="flex items-center gap-1.5 text-xs text-amber-300 font-bold">
                    <Store className="w-3.5 h-3.5 text-amber-300" />
                    <span>Miller & Seller Rice Sample Directory</span>
                  </div>
                  <p className="text-[11px] text-neutral-400">
                    Add and view live verified rice samples, technical specs, and mandi lots in our centralized directory.
                  </p>
                  <a
                    id="btn-add-rice-sample-header"
                    href="https://trade.hashirricesupplier.com/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-2.5 px-4 rounded-xl bg-amber-400 hover:bg-amber-300 text-neutral-950 font-bold text-xs flex items-center justify-center gap-2 shadow-md transition-all cursor-pointer"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Add your rice sample</span>
                    <ExternalLink className="w-3.5 h-3.5 opacity-80" />
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Main Content Area */}
      <div className="w-full max-w-7xl 2xl:max-w-[1536px] mx-auto px-4 sm:px-6 lg:px-8 pt-8 space-y-8">
        {/* Navigation Tabs & Metrics Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-neutral-800 pb-4">
          <div className="flex items-center gap-2 overflow-x-auto pb-2 sm:pb-0 scrollbar-none">
            <button
              onClick={() => setViewTab('all-samples')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                viewTab === 'all-samples'
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'bg-neutral-800 text-neutral-300 hover:bg-neutral-700 hover:text-white'
              }`}
            >
              <span className="flex items-center gap-1.5">
                <Store className="w-3.5 h-3.5" />
                <span>All Live Market Samples ({samples.length})</span>
              </span>
            </button>

            <button
              onClick={() => {
                if (!activeUser) {
                  setShowAuthModal(true);
                } else {
                  setViewTab('my-lots');
                }
              }}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                viewTab === 'my-lots'
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'bg-neutral-800 text-neutral-300 hover:bg-neutral-700 hover:text-white'
              }`}
            >
              <span className="flex items-center gap-1.5">
                <Package className="w-3.5 h-3.5" />
                <span>My Listed Lots ({myLotsCount})</span>
              </span>
            </button>

            <button
              onClick={() => setViewTab('guidelines')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                viewTab === 'guidelines'
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'bg-neutral-800 text-neutral-300 hover:bg-neutral-700 hover:text-white'
              }`}
            >
              <span className="flex items-center gap-1.5">
                <Info className="w-3.5 h-3.5" />
                <span>Sourcing & Sample Rules</span>
              </span>
            </button>
          </div>

          <div className="flex items-center gap-3">
            <a
              id="btn-add-rice-sample"
              href="https://trade.hashirricesupplier.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto px-4 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-neutral-950 font-bold text-xs flex items-center justify-center gap-1.5 shadow-sm transition-all cursor-pointer shrink-0"
            >
              <Plus className="w-4 h-4" />
              <span>Add your rice sample</span>
              <ExternalLink className="w-3.5 h-3.5 ml-0.5 opacity-80" />
            </a>
          </div>
        </div>

        {/* GUIDELINES VIEW */}
        {viewTab === 'guidelines' && (
          <div className="bg-neutral-950 rounded-2xl p-6 sm:p-8 border border-neutral-800 space-y-6">
            <div className="space-y-2">
              <h2 className="font-serif text-xl sm:text-2xl font-bold text-white">
                Seller Sample & Mandi Listing Protocol
              </h2>
              <p className="text-xs sm:text-sm text-neutral-400">
                To maintain standard trade transparency across Punjab and Sindh mandi networks, all listed samples adhere to the following inspection parameters:
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-neutral-900 p-4 rounded-xl border border-neutral-800 space-y-2">
                <div className="w-8 h-8 rounded-lg bg-emerald-900/50 text-emerald-400 flex items-center justify-center font-bold text-sm">1</div>
                <h3 className="font-bold text-sm text-white">Real Physical Lot Stock</h3>
                <p className="text-xs text-neutral-400">
                  Every listed sample must represent an active lot resting in your warehouse, mill silo, or mandi commission shop with verified remaining stock.
                </p>
              </div>

              <div className="bg-neutral-900 p-4 rounded-xl border border-neutral-800 space-y-2">
                <div className="w-8 h-8 rounded-lg bg-emerald-900/50 text-emerald-400 flex items-center justify-center font-bold text-sm">2</div>
                <h3 className="font-bold text-sm text-white">Grain Length & Moisture Veracity</h3>
                <p className="text-xs text-neutral-400">
                  Sample photos must show raw grain over a caliper or contrast sheet. Moisture must be calibrated according to standard digital moisture meters (max 12-13%).
                </p>
              </div>

              <div className="bg-neutral-900 p-4 rounded-xl border border-neutral-800 space-y-2">
                <div className="w-8 h-8 rounded-lg bg-emerald-900/50 text-emerald-400 flex items-center justify-center font-bold text-sm">3</div>
                <h3 className="font-bold text-sm text-white">Instant WhatsApp Response</h3>
                <p className="text-xs text-neutral-400">
                  Keep your listed WhatsApp active for wholesale buyers to verify spot dispatch, negotiate truckload freight, and request courier samples.
                </p>
              </div>
            </div>

            <div className="p-4 bg-emerald-950/40 border border-emerald-500/20 rounded-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <span className="text-xs text-emerald-200">
                Ready to list your mill stock? Add your rice samples and technical lot specs in the directory.
              </span>
              <a
                href="https://trade.hashirricesupplier.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-colors shrink-0 cursor-pointer"
              >
                <span>Add your rice sample</span>
                <ExternalLink className="w-3.5 h-3.5 opacity-80" />
              </a>
            </div>
          </div>
        )}

        {/* SEARCH, CATEGORY FILTER & CONTROLS */}
        {viewTab !== 'guidelines' && (
          <div className="space-y-4">
            <div className="bg-neutral-950 p-4 rounded-2xl border border-neutral-800 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
                {/* Search Bar */}
                <div className="md:col-span-6 relative">
                  <Search className="w-4 h-4 text-neutral-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Search by variety (1121, Super, Sella), mill name, city (Bucheki, Hafizabad)..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 bg-neutral-900 border border-neutral-800 rounded-xl text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-emerald-500"
                  />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery('')}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-500 hover:text-white"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>

                {/* Stock Status Filter */}
                <div className="md:col-span-3">
                  <select
                    value={selectedStockFilter}
                    onChange={(e) => setSelectedStockFilter(e.target.value)}
                    className="w-full px-3 py-2.5 bg-neutral-900 border border-neutral-800 rounded-xl text-xs text-white focus:outline-none focus:border-emerald-500"
                  >
                    <option value="all">All Stock Statuses</option>
                    <option value="available">Available in Stock</option>
                    <option value="low-stock">Low Stock Lots (&lt; 30 Tons)</option>
                    <option value="sold-out">Sold Out Lots</option>
                  </select>
                </div>

                {/* Sort dropdown */}
                <div className="md:col-span-3">
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as any)}
                    className="w-full px-3 py-2.5 bg-neutral-900 border border-neutral-800 rounded-xl text-xs text-white focus:outline-none focus:border-emerald-500"
                  >
                    <option value="newest">Sort: Newly Listed Lots</option>
                    <option value="stock">Sort: Largest Remaining Stock</option>
                    <option value="length">Sort: Longest Grain Length (mm)</option>
                  </select>
                </div>
              </div>

              {/* Variety Category Pills */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none text-xs">
                {[
                  { id: 'all', label: 'All Varieties' },
                  { id: '1121-kainat', label: '1121 Kainat Basmati' },
                  { id: 'super-kernel', label: 'Super Kernel Basmati' },
                  { id: '1509-basmati', label: '1509 Basmati' },
                  { id: 'sella-parboiled', label: 'Golden & Creamy Sella' },
                  { id: 'pk-386', label: 'PK 386 Long Grain' },
                  { id: 'irri-6', label: 'IRRI-6 Long Grain' },
                  { id: 'irri-9', label: 'IRRI-9 Long Grain' },
                  { id: 'c9-d98', label: 'C9 / D-98 Sindh' },
                  { id: 'basmati-515', label: 'Basmati 515 / Kisan' },
                  { id: 'broken-tota', label: 'Broken Tota / Kani' },
                  { id: 'brown-specialty', label: 'Brown & Specialty' }
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setSelectedCategory(tab.id)}
                    className={`px-3 py-1.5 rounded-lg font-semibold transition-colors shrink-0 cursor-pointer ${
                      selectedCategory === tab.id
                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shadow-xs'
                        : 'bg-neutral-900 text-neutral-400 hover:text-white border border-neutral-800'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>

            {/* SAMPLES GRID */}
            {filteredSamples.length === 0 ? (
              <div className="bg-neutral-950 rounded-2xl p-12 text-center border border-neutral-800 space-y-3">
                <Package className="w-12 h-12 text-neutral-600 mx-auto" />
                <h3 className="font-serif text-lg font-bold text-white">No Rice Samples Found</h3>
                <p className="text-xs text-neutral-400 max-w-md mx-auto">
                  {viewTab === 'my-lots'
                    ? 'You have not listed any rice samples yet. Click "Add Rice Sample" to add your lot in the directory.'
                    : 'No rice lots match your search filters. Try resetting the search query or category filter.'}
                </p>
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setSelectedCategory('all');
                    setSelectedStockFilter('all');
                  }}
                  className="px-4 py-2 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-white font-bold text-xs transition-colors"
                >
                  Reset Filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {filteredSamples.map((sample) => {
                  const isOwner = activeUser && (sample.sellerId === activeUser.id || sample.sellerEmail === activeUser.email);
                  const isLowStock = sample.stockStatus === 'low-stock';
                  const isSoldOut = sample.stockStatus === 'sold-out';

                  return (
                    <div
                      key={sample.id}
                      className={`bg-neutral-950 rounded-2xl border transition-all overflow-hidden flex flex-col justify-between group ${
                        isSoldOut
                          ? 'border-neutral-800 opacity-70'
                          : 'border-neutral-800 hover:border-emerald-500/50 shadow-md'
                      }`}
                    >
                      <div>
                        {/* Sample Photo Container */}
                        <div className="relative h-48 w-full overflow-hidden bg-neutral-900">
                          <img
                            src={sample.sampleImageUrl}
                            alt={sample.varietyName}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                            loading="lazy"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-transparent to-black/40" />

                          {/* Quick Enlarge Button */}
                          <button
                            onClick={() => setZoomImage(sample.sampleImageUrl)}
                            className="absolute top-2.5 right-2.5 p-1.5 rounded-lg bg-black/60 hover:bg-black/90 text-white backdrop-blur-xs transition-all cursor-pointer"
                            title="Enlarge Sample Photo"
                          >
                            <Camera className="w-3.5 h-3.5" />
                          </button>

                          {/* Category Tag */}
                          <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5">
                            <span className="px-2.5 py-0.5 rounded-md bg-emerald-950/90 border border-emerald-500/40 text-emerald-300 text-[10px] font-bold uppercase tracking-wider">
                              {getCategoryBadgeLabel(sample.varietyCategory, sample.varietyName)}
                            </span>
                            <span className="px-2 py-0.5 rounded-md bg-black/70 text-neutral-300 text-[10px] font-mono">
                              #{sample.id.slice(-5).toUpperCase()}
                            </span>
                          </div>

                          {/* REMAINING STOCK BADGE */}
                          <div className="absolute bottom-2.5 left-2.5 right-2.5 flex items-center justify-between">
                            <div
                              className={`px-3 py-1 rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-lg backdrop-blur-md ${
                                isSoldOut
                                  ? 'bg-red-950/90 text-red-300 border border-red-800'
                                  : isLowStock
                                  ? 'bg-amber-950/90 text-amber-300 border border-amber-500/40'
                                  : 'bg-emerald-900/90 text-emerald-200 border border-emerald-500/40'
                              }`}
                            >
                              <Package className="w-3.5 h-3.5" />
                              <span>Remaining Stock: {sample.remainingStock}</span>
                            </div>

                            {sample.cropYear && (
                              <span className="text-[10px] text-neutral-300 bg-black/60 px-2 py-0.5 rounded-md backdrop-blur-xs">
                                {sample.cropYear}
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Card Body */}
                        <div className="p-4 sm:p-5 space-y-3.5">
                          {/* Variety Name & Processing */}
                          <div>
                            <h3 className="font-serif text-base sm:text-lg font-bold text-white group-hover:text-emerald-300 transition-colors leading-snug">
                              {sample.varietyName}
                            </h3>
                            <p className="text-xs text-neutral-400 font-medium mt-0.5">
                              {sample.processingGrade}
                            </p>
                          </div>

                          {/* Technical Specifications Grid */}
                          <div className="grid grid-cols-3 gap-1.5 p-2.5 rounded-xl bg-neutral-900 border border-neutral-800 text-[11px]">
                            <div className="text-center">
                              <span className="text-neutral-500 block text-[10px]">Avg Length</span>
                              <strong className="text-amber-300 font-mono font-bold">{sample.averageGrainLength}</strong>
                            </div>
                            <div className="text-center border-x border-neutral-800">
                              <span className="text-neutral-500 block text-[10px]">Moisture</span>
                              <strong className="text-emerald-300 font-mono font-bold">{sample.moisturePercent}</strong>
                            </div>
                            <div className="text-center">
                              <span className="text-neutral-500 block text-[10px]">Broken %</span>
                              <strong className="text-neutral-300 font-mono font-bold">{sample.brokenPercent}</strong>
                            </div>
                          </div>

                          {/* Asking Price & Min Order */}
                          <div className="flex items-center justify-between text-xs pt-1 border-t border-neutral-900">
                            <div>
                              <span className="text-neutral-500 text-[10px] block">Asking Rate ({sample.priceType})</span>
                              <strong className="text-white font-bold text-sm">{sample.askingRatePkr}</strong>
                            </div>
                            <div className="text-right">
                              <span className="text-neutral-500 text-[10px] block">Minimum Order</span>
                              <span className="text-neutral-300 font-medium text-[11px]">{sample.minimumOrder}</span>
                            </div>
                          </div>

                          {/* Description excerpt */}
                          <p className="text-xs text-neutral-400 line-clamp-2 leading-relaxed">
                            {sample.description}
                          </p>

                          {/* Seller & Mandi Location Card */}
                          <div className="p-2.5 rounded-xl bg-neutral-900/70 border border-neutral-800/80 flex items-center justify-between gap-2">
                            <div className="flex items-center gap-2 overflow-hidden">
                              <img
                                src={sample.sellerAvatar || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=200'}
                                alt={sample.sellerName}
                                className="w-8 h-8 rounded-full border border-neutral-700 object-cover shrink-0"
                              />
                              <div className="overflow-hidden">
                                <div className="flex items-center gap-1">
                                  <strong className="text-xs text-white truncate block">{sample.sellerName}</strong>
                                  {sample.isVerifiedSeller && (
                                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" title="Verified Miller" />
                                  )}
                                </div>
                                <span className="text-[10px] text-neutral-400 truncate block">
                                  {sample.sellerMandiLocation}, {sample.sellerCity}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Card Footer: ACTION BUTTONS WITH SELLER WHATSAPP */}
                      <div className="p-4 pt-0 space-y-2 border-t border-neutral-900 mt-2">
                        {/* DIRECT SELLER WHATSAPP BUTTON (HIGHLIGHTED) */}
                        <a
                          id={`btn-whatsapp-sample-${sample.id}`}
                          href={getWhatsAppSampleUrl(sample)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-full py-2.5 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md transition-all cursor-pointer"
                        >
                          <MessageCircle className="w-4 h-4 fill-white" />
                          <span>WhatsApp Seller: {sample.sellerWhatsApp}</span>
                        </a>

                        <div className="grid grid-cols-2 gap-2">
                          <button
                            onClick={() => {
                              if (onOpenSampleModal) {
                                onOpenSampleModal(sample.varietyName);
                              } else {
                                setCurrentView('sample');
                              }
                            }}
                            className="py-2 px-2.5 rounded-lg bg-neutral-900 hover:bg-neutral-800 text-neutral-200 font-semibold text-[11px] border border-neutral-800 transition-colors cursor-pointer flex items-center justify-center gap-1"
                          >
                            <Sparkles className="w-3 h-3 text-amber-300" />
                            <span>Free Sample</span>
                          </button>

                          <button
                            onClick={() => {
                              if (onOpenQuoteModal) {
                                onOpenQuoteModal(sample.varietyName);
                              }
                            }}
                            className="py-2 px-2.5 rounded-lg bg-neutral-900 hover:bg-neutral-800 text-neutral-200 font-semibold text-[11px] border border-neutral-800 transition-colors cursor-pointer flex items-center justify-center gap-1"
                          >
                            <Scale className="w-3 h-3 text-emerald-400" />
                            <span>Bulk Quote</span>
                          </button>
                        </div>

                        {/* Owner Controls if logged in */}
                        {isOwner && (
                          <div className="pt-2 border-t border-neutral-900 flex items-center justify-between text-[11px]">
                            <span className="text-emerald-400 font-semibold">Your Active Listing</span>
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => handleEditSample(sample)}
                                className="text-amber-400 hover:text-amber-300 flex items-center gap-1 transition-colors cursor-pointer"
                              >
                                <Edit3 className="w-3 h-3" />
                                <span>Edit Stock</span>
                              </button>
                              <span>•</span>
                              <button
                                onClick={() => handleDeleteSample(sample.id)}
                                className="text-red-400 hover:text-red-300 flex items-center gap-1 transition-colors cursor-pointer"
                              >
                                <Trash2 className="w-3 h-3" />
                                <span>Delete</span>
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* SECTION: EMBEDDED GOOGLE BUSINESS MAP FOR SOURCING HUBS */}
        <div className="space-y-4 pt-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h2 className="font-serif text-xl sm:text-2xl font-bold text-white">
                Physical Mandi Sourcing Network & Head Office
              </h2>
              <p className="text-xs text-neutral-400">
                Verified Google Business Location at Noor Galla Mandi, Bucheki (Nankana Sahib) with direct supply corridors across Pakistan.
              </p>
            </div>
          </div>

          <GoogleBusinessMap
            cityName="Bucheki"
            province="Punjab"
            customHeading="Hashir Rice Supplier – Noor Galla Mandi Bucheki Headquarters"
            customSubheading="Official Verified Google Business Profile & Daily Mandi Commission Desk"
            height="380px"
          />
        </div>
      </div>

      {/* MODAL 1: ADD / EDIT RICE SAMPLE (WIDE RESPONSIVE 2-COLUMN DESK) */}
      {showAddSampleModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 md:p-6 bg-black/85 backdrop-blur-md overflow-y-auto">
          <div className="bg-neutral-950 border border-neutral-800 rounded-2xl sm:rounded-3xl w-full max-w-5xl xl:max-w-6xl max-h-[92vh] overflow-hidden flex flex-col my-auto text-neutral-100 shadow-2xl">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-neutral-800 px-6 py-4 sm:px-8 bg-neutral-900/80 shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                  <Store className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-bold text-emerald-400 uppercase tracking-wider">
                      {editingSampleId ? 'Update Stock & Specifications' : 'Post Active Mandi Lot'}
                    </span>
                    <span className="text-[10px] bg-neutral-800 text-neutral-300 px-2 py-0.5 rounded font-mono">
                      Pakistan Rice Exchange
                    </span>
                  </div>
                  <h3 className="font-serif text-lg sm:text-xl font-bold text-white">
                    {editingSampleId ? 'Edit Rice Sample Listing' : 'Add New Rice Sample & Available Stock'}
                  </h3>
                </div>
              </div>
              <button
                onClick={() => {
                  setShowAddSampleModal(false);
                  setEditingSampleId(null);
                }}
                className="p-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-300 hover:text-white transition-colors cursor-pointer"
                title="Close"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Form Scrollable Area */}
            <form onSubmit={handleSaveSample} className="flex-1 overflow-y-auto p-5 sm:p-7 space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                {/* LEFT / CENTER MAIN COLUMN: FORM CONTROLS (7 Cols) */}
                <div className="lg:col-span-7 space-y-5">
                  {/* 1-Click Variety Spec Preset Chips */}
                  <div className="space-y-2 bg-neutral-900/90 p-3.5 rounded-2xl border border-neutral-800">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-bold text-amber-300 flex items-center gap-1.5">
                        <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                        1-Click Variety Presets (Auto-fills mandi specs)
                      </span>
                      <span className="text-[10px] text-neutral-400">Select any variety</span>
                    </div>
                    <div className="flex flex-wrap gap-1.5 max-h-24 overflow-y-auto pr-1">
                      {RICE_VARIETY_CATEGORIES.map((cat) => (
                        <button
                          key={cat.id}
                          type="button"
                          onClick={() => handleSelectQuickVariety(cat)}
                          className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-all cursor-pointer ${
                            formCategory === cat.id
                              ? 'bg-emerald-600 text-white shadow-xs font-bold'
                              : 'bg-neutral-950 text-neutral-300 hover:text-white hover:bg-neutral-800 border border-neutral-800'
                          }`}
                        >
                          {cat.label.split('(')[0].trim()}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Variety Title & Category Dropdown */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 text-xs">
                    <div>
                      <label className="block font-semibold text-neutral-200 mb-1">
                        Rice Variety Name *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. 1121 Kainat Basmati Steam"
                        value={formVarietyName}
                        onChange={(e) => setFormVarietyName(e.target.value)}
                        className="w-full px-3.5 py-2.5 bg-neutral-900 border border-neutral-800 rounded-xl text-white focus:outline-none focus:border-emerald-500 font-medium"
                      />
                    </div>

                    <div>
                      <label className="block font-semibold text-neutral-200 mb-1">
                        Variety Category *
                      </label>
                      <select
                        id="seller-variety-category-select"
                        value={formCategory}
                        onChange={(e) => handleCategoryChange(e.target.value)}
                        className="w-full px-3.5 py-2.5 bg-neutral-900 border border-neutral-800 rounded-xl text-white focus:outline-none focus:border-emerald-500 font-medium"
                      >
                        {RICE_VARIETY_CATEGORIES.map((cat) => (
                          <option key={cat.id} value={cat.id}>
                            {cat.label}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Processing Grade & Crop Harvest */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 text-xs">
                    <div>
                      <label className="block font-semibold text-neutral-200 mb-1">
                        Processing / Polish Grade *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Steam (Double Polished & Sortexed)"
                        value={formProcessing}
                        onChange={(e) => setFormProcessing(e.target.value)}
                        className="w-full px-3.5 py-2.5 bg-neutral-900 border border-neutral-800 rounded-xl text-white focus:outline-none focus:border-emerald-500"
                      />
                    </div>

                    <div>
                      <label className="block font-semibold text-neutral-200 mb-1">
                        Crop Season / Harvest Year
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. 2025/2026 Fresh Harvest or 2024 Aged"
                        value={formCropYear}
                        onChange={(e) => setFormCropYear(e.target.value)}
                        className="w-full px-3.5 py-2.5 bg-neutral-900 border border-neutral-800 rounded-xl text-white focus:outline-none focus:border-emerald-500"
                      />
                    </div>
                  </div>

                  {/* Stock Inventory & Availability Section */}
                  <div className="p-4 bg-emerald-950/30 border border-emerald-500/30 rounded-2xl space-y-3 text-xs">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Package className="w-4 h-4 text-emerald-400" />
                        <strong className="text-sm font-bold text-white">Stock Availability & Inventory Tracker</strong>
                      </div>
                      <span className="text-[10px] text-emerald-300 font-mono">Live Mandi Balance</span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div>
                        <label className="block text-neutral-300 font-semibold mb-1">
                          Total Lot Size
                        </label>
                        <input
                          type="text"
                          placeholder="e.g. 100 Tons"
                          value={formTotalLotSize}
                          onChange={(e) => setFormTotalLotSize(e.target.value)}
                          className="w-full px-3 py-2 bg-neutral-900 border border-neutral-800 rounded-lg text-white focus:outline-none focus:border-emerald-500"
                        />
                      </div>

                      <div>
                        <label className="block text-neutral-300 font-semibold mb-1">
                          Remaining Stock Display *
                        </label>
                        <input
                          type="text"
                          required
                          placeholder="e.g. 60 Tons (1,200 Bags)"
                          value={formRemainingStock}
                          onChange={(e) => setFormRemainingStock(e.target.value)}
                          className="w-full px-3 py-2 bg-neutral-900 border border-neutral-800 rounded-lg text-white focus:outline-none focus:border-emerald-500 font-bold text-emerald-300"
                        />
                      </div>

                      <div>
                        <label className="block text-neutral-300 font-semibold mb-1">
                          Stock Status *
                        </label>
                        <select
                          value={formStockStatus}
                          onChange={(e) => setFormStockStatus(e.target.value as any)}
                          className="w-full px-3 py-2 bg-neutral-900 border border-neutral-800 rounded-lg text-white focus:outline-none focus:border-emerald-500 font-medium"
                        >
                          <option value="available">Available in Stock</option>
                          <option value="low-stock">Low Stock (&lt; 30 Tons)</option>
                          <option value="sold-out">Sold Out</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* Physical Grain Technical Specifications (4 Columns) */}
                  <div className="space-y-2">
                    <label className="block font-semibold text-neutral-200 text-xs">
                      Physical Grain Lab Parameters *
                    </label>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-xs">
                      <div className="bg-neutral-900 p-2.5 rounded-xl border border-neutral-800">
                        <label className="block text-neutral-400 text-[10px] font-semibold mb-1">
                          Raw Length (mm)
                        </label>
                        <input
                          type="text"
                          required
                          placeholder="8.40 mm"
                          value={formGrainLength}
                          onChange={(e) => setFormGrainLength(e.target.value)}
                          className="w-full px-2.5 py-1.5 bg-neutral-950 border border-neutral-800 rounded-lg text-amber-300 font-bold font-mono focus:outline-none focus:border-emerald-500 text-xs"
                        />
                      </div>

                      <div className="bg-neutral-900 p-2.5 rounded-xl border border-neutral-800">
                        <label className="block text-neutral-400 text-[10px] font-semibold mb-1">
                          Cooked Elongation
                        </label>
                        <input
                          type="text"
                          placeholder="19.5 mm"
                          value={formCookedLength}
                          onChange={(e) => setFormCookedLength(e.target.value)}
                          className="w-full px-2.5 py-1.5 bg-neutral-950 border border-neutral-800 rounded-lg text-white font-mono focus:outline-none focus:border-emerald-500 text-xs"
                        />
                      </div>

                      <div className="bg-neutral-900 p-2.5 rounded-xl border border-neutral-800">
                        <label className="block text-neutral-400 text-[10px] font-semibold mb-1">
                          Moisture %
                        </label>
                        <input
                          type="text"
                          required
                          placeholder="11.8%"
                          value={formMoisture}
                          onChange={(e) => setFormMoisture(e.target.value)}
                          className="w-full px-2.5 py-1.5 bg-neutral-950 border border-neutral-800 rounded-lg text-emerald-300 font-bold font-mono focus:outline-none focus:border-emerald-500 text-xs"
                        />
                      </div>

                      <div className="bg-neutral-900 p-2.5 rounded-xl border border-neutral-800">
                        <label className="block text-neutral-400 text-[10px] font-semibold mb-1">
                          Broken %
                        </label>
                        <input
                          type="text"
                          required
                          placeholder="1.5% max"
                          value={formBroken}
                          onChange={(e) => setFormBroken(e.target.value)}
                          className="w-full px-2.5 py-1.5 bg-neutral-950 border border-neutral-800 rounded-lg text-neutral-200 font-mono focus:outline-none focus:border-emerald-500 text-xs"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Commercial Terms & Pricing */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                    <div>
                      <label className="block font-semibold text-neutral-200 mb-1">
                        Asking Rate (PKR) *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Rs. 13,200 / 40kg Ex-Mill"
                        value={formAskingRate}
                        onChange={(e) => setFormAskingRate(e.target.value)}
                        className="w-full px-3 py-2 bg-neutral-900 border border-neutral-800 rounded-xl text-white focus:outline-none focus:border-emerald-500 font-bold"
                      />
                    </div>

                    <div>
                      <label className="block font-semibold text-neutral-200 mb-1">
                        Price Terms
                      </label>
                      <select
                        value={formPriceType}
                        onChange={(e) => setFormPriceType(e.target.value as any)}
                        className="w-full px-3 py-2 bg-neutral-900 border border-neutral-800 rounded-xl text-white focus:outline-none focus:border-emerald-500 font-medium"
                      >
                        <option value="Ex-Mill">Ex-Mill (Mandi Gate)</option>
                        <option value="FOR Dispatch">FOR Dispatch (Freight on Board)</option>
                        <option value="Mandi Spot">Mandi Spot Cash</option>
                      </select>
                    </div>

                    <div>
                      <label className="block font-semibold text-neutral-200 mb-1">
                        Minimum Order Quantity
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. 1 Truck (25 Tons)"
                        value={formMinOrder}
                        onChange={(e) => setFormMinOrder(e.target.value)}
                        className="w-full px-3 py-2 bg-neutral-900 border border-neutral-800 rounded-xl text-white focus:outline-none focus:border-emerald-500"
                      />
                    </div>
                  </div>

                  {/* SELLER WHATSAPP NUMBER */}
                  <div className="p-3.5 bg-neutral-900 rounded-2xl border border-neutral-800 space-y-2 text-xs">
                    <label className="block font-semibold text-emerald-300">
                      Seller WhatsApp Contact (Visible to verified bulk buyers) *
                    </label>
                    <div className="flex items-center gap-2">
                      <MessageCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                      <input
                        type="text"
                        required
                        placeholder="+92 333 8990883"
                        value={formSellerWhatsApp}
                        onChange={(e) => setFormSellerWhatsApp(e.target.value)}
                        className="flex-1 px-3 py-2 bg-neutral-950 border border-neutral-800 rounded-lg text-white font-mono font-bold focus:outline-none focus:border-emerald-500"
                      />
                    </div>
                    <span className="text-[10px] text-neutral-400 block">
                      Wholesale buyers will click the direct green WhatsApp button on your lot card to chat with you regarding spot dispatch.
                    </span>
                  </div>

                  {/* Cooking & Daig Description */}
                  <div className="text-xs">
                    <label className="block font-semibold text-neutral-200 mb-1">
                      Cooking Notes & Lot Description
                    </label>
                    <textarea
                      rows={2}
                      placeholder="Describe aroma, separate non-sticky grains, daig capacity, packaging type..."
                      value={formDescription}
                      onChange={(e) => setFormDescription(e.target.value)}
                      className="w-full px-3 py-2 bg-neutral-900 border border-neutral-800 rounded-xl text-white focus:outline-none focus:border-emerald-500 resize-none text-xs"
                    />
                  </div>
                </div>

                {/* RIGHT SIDEBAR COLUMN: IMAGE UPLOAD + LIVE INTERACTIVE CARD PREVIEW (5 Cols) */}
                <div className="lg:col-span-5 space-y-5">
                  {/* Photo Upload & Presets Selector */}
                  <div className="bg-neutral-900/90 p-4 rounded-2xl border border-neutral-800 space-y-3 text-xs">
                    <div className="flex items-center justify-between">
                      <label className="font-semibold text-neutral-200 flex items-center gap-1.5">
                        <Camera className="w-3.5 h-3.5 text-emerald-400" />
                        Grain Photo (Upload or Preset) *
                      </label>
                      <span className="text-[10px] text-neutral-400">High Res</span>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="w-20 h-20 rounded-xl bg-neutral-950 border border-neutral-700 overflow-hidden relative shrink-0 shadow-inner">
                        <img
                          src={formImageUrl}
                          alt="Grain sample"
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1 space-y-2">
                        <input
                          type="file"
                          ref={fileInputRef}
                          accept="image/*"
                          onChange={handleImageFileUpload}
                          className="hidden"
                        />
                        <button
                          type="button"
                          onClick={() => fileInputRef.current?.click()}
                          className="w-full py-2 px-3 rounded-lg bg-emerald-700 hover:bg-emerald-600 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                        >
                          <UploadCloud className="w-3.5 h-3.5" />
                          <span>Upload From Device</span>
                        </button>
                        <input
                          type="url"
                          placeholder="Or paste image URL"
                          value={formImageUrl}
                          onChange={(e) => setFormImageUrl(e.target.value)}
                          className="w-full px-2.5 py-1.5 bg-neutral-950 border border-neutral-800 rounded-lg text-neutral-300 text-[11px] focus:outline-none focus:border-emerald-500"
                        />
                      </div>
                    </div>

                    {/* Quick photo preset buttons */}
                    <div className="pt-2 border-t border-neutral-800">
                      <span className="text-[10px] text-neutral-400 block mb-1.5">Quick photo presets:</span>
                      <div className="flex flex-wrap gap-1">
                        {PRESET_SAMPLE_PHOTOS.map((preset, idx) => (
                          <button
                            key={idx}
                            type="button"
                            onClick={() => setFormImageUrl(preset.url)}
                            className={`px-2 py-0.5 rounded text-[10px] transition-colors cursor-pointer ${
                              formImageUrl === preset.url
                                ? 'bg-emerald-600 text-white font-bold'
                                : 'bg-neutral-950 text-neutral-400 hover:text-white border border-neutral-800'
                            }`}
                          >
                            {preset.name}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* LIVE REAL-TIME CARD PREVIEW */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-bold text-amber-300 uppercase tracking-wider flex items-center gap-1">
                        <Sparkles className="w-3 h-3 text-amber-400" />
                        Live Marketplace Card Preview
                      </span>
                      <span className="text-[10px] text-neutral-500">As seen by buyers</span>
                    </div>

                    {/* Miniature Card Rendering */}
                    <div className="bg-neutral-950 rounded-2xl border border-neutral-800 overflow-hidden shadow-lg">
                      <div className="relative h-40 w-full overflow-hidden bg-neutral-900">
                        <img
                          src={formImageUrl}
                          alt="Live Preview"
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-transparent to-black/40" />

                        {/* Category tag */}
                        <div className="absolute top-2 left-2 flex items-center gap-1">
                          <span className="px-2 py-0.5 rounded bg-emerald-950/90 border border-emerald-500/40 text-emerald-300 text-[10px] font-bold uppercase">
                            {getCategoryBadgeLabel(formCategory, formVarietyName)}
                          </span>
                        </div>

                        {/* Stock badge */}
                        <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between">
                          <div
                            className={`px-2.5 py-0.5 rounded-lg text-[10px] font-bold flex items-center gap-1 backdrop-blur-md ${
                              formStockStatus === 'sold-out'
                                ? 'bg-red-950/90 text-red-300 border border-red-800'
                                : formStockStatus === 'low-stock'
                                ? 'bg-amber-950/90 text-amber-300 border border-amber-500/40'
                                : 'bg-emerald-900/90 text-emerald-200 border border-emerald-500/40'
                            }`}
                          >
                            <Package className="w-3 h-3" />
                            <span>Remaining: {formRemainingStock || '60 Tons'}</span>
                          </div>
                          {formCropYear && (
                            <span className="text-[10px] text-neutral-300 bg-black/60 px-1.5 py-0.5 rounded">
                              {formCropYear}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Preview Card Body */}
                      <div className="p-3.5 space-y-2.5 text-xs">
                        <div>
                          <strong className="block font-serif text-sm font-bold text-white truncate">
                            {formVarietyName || '1121 Kainat Basmati Steam'}
                          </strong>
                          <span className="text-[11px] text-neutral-400 block truncate">
                            {formProcessing || 'Steam (Double Polished & Sortexed)'}
                          </span>
                        </div>

                        {/* Specs grid */}
                        <div className="grid grid-cols-3 gap-1 p-2 rounded-lg bg-neutral-900 border border-neutral-800 text-[10px] text-center">
                          <div>
                            <span className="text-neutral-500 block">Length</span>
                            <strong className="text-amber-300 font-mono">{formGrainLength || '8.40 mm'}</strong>
                          </div>
                          <div className="border-x border-neutral-800">
                            <span className="text-neutral-500 block">Moisture</span>
                            <strong className="text-emerald-300 font-mono">{formMoisture || '11.8%'}</strong>
                          </div>
                          <div>
                            <span className="text-neutral-500 block">Broken</span>
                            <strong className="text-neutral-300 font-mono">{formBroken || '1.5%'}</strong>
                          </div>
                        </div>

                        {/* Rate & Min Order */}
                        <div className="flex items-center justify-between text-xs pt-1 border-t border-neutral-900">
                          <div>
                            <span className="text-neutral-500 text-[9px] block">Asking Rate ({formPriceType})</span>
                            <strong className="text-white font-bold text-xs">{formAskingRate || 'Rs. 13,200 / 40kg'}</strong>
                          </div>
                          <div className="text-right">
                            <span className="text-neutral-500 text-[9px] block">Min Order</span>
                            <span className="text-neutral-300 text-[10px]">{formMinOrder || '1 Truck'}</span>
                          </div>
                        </div>

                        {/* WhatsApp preview button */}
                        <div className="w-full py-2 px-3 rounded-lg bg-emerald-600 text-white font-bold text-[11px] flex items-center justify-center gap-1.5 shadow-xs">
                          <MessageCircle className="w-3.5 h-3.5 fill-white" />
                          <span>WhatsApp Seller: {formSellerWhatsApp || '+92 333 8990883'}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Form Bottom Action Footer */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-neutral-800">
                <button
                  type="button"
                  onClick={() => {
                    setShowAddSampleModal(false);
                    setEditingSampleId(null);
                  }}
                  className="px-5 py-2.5 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-neutral-300 font-semibold transition-colors cursor-pointer text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-7 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold transition-all shadow-md cursor-pointer flex items-center gap-2 text-xs"
                >
                  <Check className="w-4 h-4" />
                  <span>{editingSampleId ? 'Save Changes' : 'Publish Sample to Marketplace'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: GOOGLE SIGN-IN MODAL */}
      {showAuthModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-neutral-950 border border-neutral-800 rounded-2xl w-full max-w-md p-6 sm:p-8 space-y-6 text-neutral-100 shadow-2xl relative">
            <button
              onClick={() => setShowAuthModal(false)}
              className="absolute top-4 right-4 p-1.5 rounded-lg bg-neutral-900 text-neutral-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="text-center space-y-2">
              <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center mx-auto mb-2 border border-white/20">
                <Store className="w-6 h-6 text-emerald-400" />
              </div>
              <h3 className="font-serif text-2xl font-bold text-white">
                Seller & Miller Sign In
              </h3>
              <p className="text-xs text-neutral-400">
                Connect your Google Email to list active rice lots and showcase your samples to bulk buyers across Pakistan.
              </p>
            </div>

            {/* 1-Click Fast Google Sign-in Buttons */}
            <div className="space-y-2">
              <button
                onClick={() => handleGoogleSignIn('trade@hashirricesupplier.com')}
                className="w-full py-3 px-4 rounded-xl bg-white hover:bg-neutral-100 text-neutral-900 font-bold text-xs flex items-center justify-center gap-2.5 shadow-md transition-all cursor-pointer"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.17z" />
                  <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.35 24 12 24z" />
                  <path fill="#FBBC05" d="M5.28 14.27A7.17 7.17 0 0 1 4.9 12c0-.79.14-1.57.38-2.27V6.58H1.25A11.96 11.96 0 0 0 0 12c0 1.92.45 3.74 1.25 5.42l4.03-3.15z" />
                  <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.35 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z" />
                </svg>
                <span>Continue as trade@hashirricesupplier.com</span>
              </button>
            </div>

            <div className="relative flex items-center justify-center">
              <div className="border-t border-neutral-800 w-full" />
              <span className="bg-neutral-950 px-3 text-[11px] text-neutral-500 uppercase tracking-wider absolute">
                Or custom profile
              </span>
            </div>

            {/* Custom details form */}
            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-neutral-300 font-semibold mb-1">Your Google / Business Email</label>
                <input
                  type="email"
                  value={authEmail}
                  onChange={(e) => setAuthEmail(e.target.value)}
                  placeholder="seller@gmail.com"
                  className="w-full px-3 py-2 bg-neutral-900 border border-neutral-800 rounded-lg text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-neutral-300 font-semibold mb-1">Miller / Seller Name</label>
                <input
                  type="text"
                  value={authName}
                  onChange={(e) => setAuthName(e.target.value)}
                  placeholder="Hashir Rice Supplier"
                  className="w-full px-3 py-2 bg-neutral-900 border border-neutral-800 rounded-lg text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-neutral-300 font-semibold mb-1">Company / Mill Name</label>
                <input
                  type="text"
                  value={authCompany}
                  onChange={(e) => setAuthCompany(e.target.value)}
                  placeholder="Hashir Rice Supplier & Brokerage Desk"
                  className="w-full px-3 py-2 bg-neutral-900 border border-neutral-800 rounded-lg text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-neutral-300 font-semibold mb-1">Seller WhatsApp Number *</label>
                <input
                  type="text"
                  value={authWhatsApp}
                  onChange={(e) => setAuthWhatsApp(e.target.value)}
                  placeholder="+92 333 8990883"
                  className="w-full px-3 py-2 bg-neutral-900 border border-neutral-800 rounded-lg text-white font-mono focus:outline-none focus:border-emerald-500"
                />
              </div>

              <button
                onClick={() => handleGoogleSignIn()}
                className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition-all shadow-md cursor-pointer mt-2"
              >
                Sign In & Open Seller Desk
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 3: ZOOM SAMPLE IMAGE */}
      {zoomImage && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md"
          onClick={() => setZoomImage(null)}
        >
          <div className="relative max-w-3xl max-h-[85vh] overflow-hidden rounded-2xl border border-neutral-700">
            <img
              src={zoomImage}
              alt="Zoomed rice grain sample"
              className="w-full h-full object-contain"
            />
            <button
              onClick={() => setZoomImage(null)}
              className="absolute top-3 right-3 p-2 rounded-full bg-black/70 hover:bg-black text-white"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
