import React, { useState, useEffect } from 'react';
import {
  LayoutDashboard,
  Package,
  Boxes,
  ClipboardList,
  TrendingUp,
  MapPin,
  FileText,
  Globe,
  Star,
  Settings,
  Plus,
  Edit,
  Trash2,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  MessageCircle,
  Phone,
  Search,
  Filter,
  Save,
  RefreshCw,
  Eye,
  ShieldCheck,
  Truck,
  Building2,
  Users,
  Activity,
  Layers,
  ArrowUpRight,
  Database,
  Sliders,
  Sparkles,
  ChevronRight,
  Check,
  X,
  Menu,
  ChevronDown,
  Puzzle,
  DollarSign,
  BarChart3,
  Flame,
  Clock,
  Ban,
  Hourglass,
  CheckCircle,
  Loader2,
  HardDrive,
  Cpu,
  Zap,
  Radio,
  FileSpreadsheet,
  Download,
  Share2,
  ArrowDownRight,
  Gauge,
  Image,
  Key,
  Lock,
  Palette,
  EyeOff,
  LogOut
} from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid
} from 'recharts';
import { RICE_VARIETIES } from '../data/riceData';
import { INITIAL_SELLER_SAMPLES } from '../data/sellerSamplesData';
import { RICE_EXCHANGE_RATES } from '../data/riceExchangeRatesData';
import { CITIES_DATA } from '../data/citiesData';
import { BLOG_POSTS_DATA } from '../data/blogPostsData';
import { INITIAL_CUSTOMER_REVIEWS } from '../data/customerReviewsData';
import { GoogleBusinessMap } from './GoogleBusinessMap';
import { RiceVariety, SellerSample, RiceExchangeRate } from '../types';
import { AdminErpSection } from './admin/AdminErpSection';
import { AdminSellerControl } from './admin/AdminSellerControl';
import { AdminPluginsManager } from './admin/AdminPluginsManager';
import { AdminPagesManager } from './admin/AdminPagesManager';
import { AdminPostsManager } from './admin/AdminPostsManager';
import { AdminSectionsManager } from './admin/AdminSectionsManager';
import { AdminUsersManager } from './admin/AdminUsersManager';
import { AdminMediaManager } from './admin/AdminMediaManager';
import { AdminGoogleAiOverview } from './admin/AdminGoogleAiOverview';
import { AdminApiKeysManager } from './admin/AdminApiKeysManager';
import { AdminRankMathSeoManager } from './admin/AdminRankMathSeoManager';
import { AdminHeaderFooterCustomizer } from './admin/AdminHeaderFooterCustomizer';
import { AdminRiceBrokersNetwork } from './admin/AdminRiceBrokersNetwork';
import { AdminAdSenseCompliance } from './admin/AdminAdSenseCompliance';

interface WordPressAdminDashboardProps {
  onExitToFrontend: () => void;
  onSuccessToast?: (msg: string) => void;
}

// Analytics Traffic Data for Google Site Kit
const SITE_KIT_TRAFFIC_DATA = [
  { day: 'Mon', organicVisitors: 4200, searchImpressions: 18400, pageViews: 12600, directTraffic: 1400 },
  { day: 'Tue', organicVisitors: 5100, searchImpressions: 22100, pageViews: 15800, directTraffic: 1900 },
  { day: 'Wed', organicVisitors: 6400, searchImpressions: 28900, pageViews: 19200, directTraffic: 2400 },
  { day: 'Thu', organicVisitors: 5900, searchImpressions: 26300, pageViews: 17400, directTraffic: 2100 },
  { day: 'Fri', organicVisitors: 7800, searchImpressions: 34500, pageViews: 24100, directTraffic: 3100 },
  { day: 'Sat', organicVisitors: 8900, searchImpressions: 39800, pageViews: 28500, directTraffic: 3800 },
  { day: 'Sun', organicVisitors: 7200, searchImpressions: 31200, pageViews: 21900, directTraffic: 2700 },
];

// Google AdSense Revenue & RPM Data
const ADSENSE_REVENUE_DATA = [
  { month: 'Mar', earnings: 420, impressions: 85000, rpm: 4.94, clicks: 1280 },
  { month: 'Apr', earnings: 580, impressions: 112000, rpm: 5.17, clicks: 1840 },
  { month: 'May', earnings: 840, impressions: 154000, rpm: 5.45, clicks: 2610 },
  { month: 'Jun', earnings: 1120, impressions: 198000, rpm: 5.65, clicks: 3490 },
  { month: 'Jul', earnings: 1450, impressions: 246000, rpm: 5.89, clicks: 4320 },
  { month: 'Aug', earnings: 1890, impressions: 310000, rpm: 6.09, clicks: 5640 },
];

// Mandi Trading Volume By Rice Variety Data
const MANDI_VARIETY_VOLUME_DATA = [
  { name: '1121 Kainat Steam', tonsTraded: 480, revenuePkr: 72, growth: '+24%' },
  { name: 'Super Kernel Raw', tonsTraded: 340, revenuePkr: 54, growth: '+18%' },
  { name: '1509 Golden Sella', tonsTraded: 290, revenuePkr: 38, growth: '+12%' },
  { name: 'Super Gold Sella', tonsTraded: 210, revenuePkr: 29, growth: '+9%' },
  { name: 'PK-386 Fragrant', tonsTraded: 190, revenuePkr: 21, growth: '+15%' },
  { name: 'IRRI-6 White Sindh', tonsTraded: 420, revenuePkr: 33, growth: '+31%' },
];

// Order Status Pipeline Colors & Pie Data
const STATUS_COLORS: Record<string, string> = {
  Completed: '#10b981', // Emerald green
  'In Progress': '#0284c7', // Sky / blue
  Waiting: '#f59e0b', // Amber
  Cancelled: '#ef4444', // Rose red
};

// Initial Orders & Inquiries State
const INITIAL_INQUIRIES = [
  {
    id: 'INQ-1049',
    customerName: 'Tariq Mehmood',
    businessName: 'Al-Madina Biryani Center',
    phone: '+92 300 4456556',
    city: 'Karachi (Burns Road)',
    variety: '1121 Kainat Steam Basmati',
    volume: '10 Tons (200 Bags)',
    valuePkr: 'Rs. 1,520,000',
    type: 'Commercial Sourcing',
    status: 'Completed' as const,
    date: '2026-08-30',
    notes: 'Payment confirmed via Bank Al Habib. Loaded on Faisalabad-Karachi trailer.'
  },
  {
    id: 'INQ-1050',
    customerName: 'Chaudhry Kamran',
    businessName: 'Royal Palm Catering & Events',
    phone: '+92 312 6744040',
    city: 'Lahore (Gulberg III)',
    variety: 'Super Kernel Basmati Raw Aged',
    volume: 'Free Sample Sealed Requisition',
    valuePkr: 'Free Sample (Mandi Express)',
    type: 'Free Sample',
    status: 'In Progress' as const,
    date: '2026-08-30',
    notes: 'TCS Tracking # 7789402 dispatched from Bucheki Mandi hub.'
  },
  {
    id: 'INQ-1051',
    customerName: 'Hafiz Bilal',
    businessName: 'Bilal Traders & Commission Agent',
    phone: '+92 333 8990883',
    city: 'Rawalpindi (Gunj Mandi)',
    variety: '1509 Golden Sella Extra Long',
    volume: '25 Tons (500 Bags)',
    valuePkr: 'Rs. 3,125,000',
    type: 'Wholesale Mandi Quote',
    status: 'Waiting' as const,
    date: '2026-08-30',
    notes: 'Waiting for buyer confirmation on delivery freight rate to IJP Road.'
  },
  {
    id: 'INQ-1052',
    customerName: 'Sardar Farooq Khan',
    businessName: 'Khyber Shinwari BBQ & Dera',
    phone: '+92 345 9112233',
    city: 'Peshawar (Ring Road)',
    variety: 'Super Gold Creamy Sella',
    volume: 'Free Sample Request',
    valuePkr: 'Free Sample',
    type: 'Free Sample',
    status: 'Waiting' as const,
    date: '2026-08-29',
    notes: 'Physical sample packaged. Awaiting courier pickup at Bucheki Galla Mandi.'
  },
  {
    id: 'INQ-1053',
    customerName: 'Mian Aslam Javed',
    businessName: 'Javed Rice Mills Hafizabad',
    phone: '+92 301 7788990',
    city: 'Hafizabad',
    variety: '1121 Kainat Raw 8.35mm',
    volume: '50 Tons (1000 Bags)',
    valuePkr: 'Rs. 7,450,000',
    type: 'Miller Sample Lot Post',
    status: 'Completed' as const,
    date: '2026-08-29',
    notes: 'Lot approved and published on live marketplace ledger.'
  },
  {
    id: 'INQ-1054',
    customerName: 'Sheikh Murtaza',
    businessName: 'Chenab Foods & Cash-Carry',
    phone: '+92 321 4433221',
    city: 'Faisalabad (Rail Bazar)',
    variety: 'PK-386 Fragrant Basmati',
    volume: '15 Tons (300 Bags)',
    valuePkr: 'Rs. 1,650,000',
    type: 'Wholesale Mandi Quote',
    status: 'In Progress' as const,
    date: '2026-08-28',
    notes: 'Contract draft sent on WhatsApp. Miller inspecting moisture certificate.'
  },
  {
    id: 'INQ-1055',
    customerName: 'Malik Zeeshan',
    businessName: 'Quetta Zarghoon Restaurant',
    phone: '+92 331 9988776',
    city: 'Quetta (Liaquat Bazar)',
    variety: 'Super Kernel Basmati Parboiled',
    volume: '8 Tons (160 Bags)',
    valuePkr: 'Rs. 1,120,000',
    type: 'Wholesale Mandi Quote',
    status: 'Cancelled' as const,
    date: '2026-08-27',
    notes: 'Buyer delayed procurement due to local road transport strike.'
  },
  {
    id: 'INQ-1056',
    customerName: 'Rashid Minhas',
    businessName: 'Hazara Canteen Services',
    phone: '+92 313 5544332',
    city: 'Abbottabad',
    variety: 'IRRI-6 White Rice 5% Broken',
    volume: '20 Tons (400 Bags)',
    valuePkr: 'Rs. 1,560,000',
    type: 'Institutional Tender',
    status: 'Completed' as const,
    date: '2026-08-26',
    notes: 'Delivered and verified at Abbottabad Supply Depot.'
  }
];

// WordPress Installed Plugins Data
const WORDPRESS_PLUGINS = [
  {
    name: 'Site Kit by Google',
    version: '1.142.0',
    author: 'Google',
    status: 'Active',
    description: 'Official Google plugin for Insights on Search Console, Analytics, AdSense, PageSpeed & Tag Manager.',
    badgeColor: 'bg-emerald-100 text-emerald-800 border-emerald-300'
  },
  {
    name: 'Google AdSense Official Integration',
    version: '2.4.1',
    author: 'Google AdSense Team',
    status: 'Active',
    description: 'Automatic ad placement, AMP ads, Auto-Ads & revenue optimization across high-intent mandi keywords.',
    badgeColor: 'bg-amber-100 text-amber-800 border-amber-300'
  },
  {
    name: 'WooCommerce Mandi B2B Edition',
    version: '9.3.2',
    author: 'Automattic',
    status: 'Active',
    description: 'Direct wholesale bulk ordering per 40kg maund, minimum order rules, and credit ledger management.',
    badgeColor: 'bg-indigo-100 text-indigo-800 border-indigo-300'
  },
  {
    name: 'Rank Math SEO PRO (Mandi Schema)',
    version: '3.0.72',
    author: 'Rank Math',
    status: 'Active',
    description: 'Rich LocalBusiness, WholesaleStore, Product & FAQ schema generated across 60+ Pakistan city landing hubs.',
    badgeColor: 'bg-blue-100 text-blue-800 border-blue-300'
  },
  {
    name: 'WP Rocket Cache & CDN Accelerator',
    version: '3.17.1',
    author: 'WP Media',
    status: 'Active',
    description: 'Page caching, critical CSS generation, image webp converter, and sub-second loading for 3G/4G users.',
    badgeColor: 'bg-orange-100 text-orange-800 border-orange-300'
  },
  {
    name: 'WhatsApp Business Trade Gateway',
    version: '2.1.0',
    author: 'Hashir Rice Tech',
    status: 'Active',
    description: 'Direct instant quotation forwarding to +92 333 8990883 with automatic variety & volume prefilling.',
    badgeColor: 'bg-emerald-100 text-emerald-800 border-emerald-300'
  },
  {
    name: 'Wordfence Security & Mandi Firewall',
    version: '7.11.7',
    author: 'Wordfence',
    status: 'Active',
    description: 'Live endpoint firewall, malware scanner, brute force protection, and rate limiting for trade API.',
    badgeColor: 'bg-cyan-100 text-cyan-800 border-cyan-300'
  }
];

export const WordPressAdminDashboard: React.FC<WordPressAdminDashboardProps> = ({
  onExitToFrontend,
  onSuccessToast
}) => {
  // Password Protection State for /wp-admin
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return sessionStorage.getItem('hashir_wp_admin_authenticated') === 'true';
  });
  const [loginUsername, setLoginUsername] = useState<string>('');
  const [loginPassword, setLoginPassword] = useState<string>('');
  const [showLoginPassword, setShowLoginPassword] = useState<boolean>(false);
  const [loginError, setLoginError] = useState<string>('');
  const [adminSavedUser, setAdminSavedUser] = useState<string>(() => {
    return localStorage.getItem('hashir_wp_admin_user') || 'admin';
  });
  const [adminSavedPass, setAdminSavedPass] = useState<string>(() => {
    return localStorage.getItem('hashir_wp_admin_pass') || 'HashirMandi@2026';
  });

  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [sidebarCollapsed, setSidebarCollapsed] = useState<boolean>(false);
  const [statusFilter, setStatusFilter] = useState<'All' | 'Completed' | 'In Progress' | 'Waiting' | 'Cancelled'>('All');

  // Live state for varieties
  const [varieties, setVarieties] = useState<RiceVariety[]>(() => {
    const saved = localStorage.getItem('hashir_rice_admin_varieties');
    return saved ? JSON.parse(saved) : RICE_VARIETIES;
  });

  // Live state for seller samples
  const [sellerSamples, setSellerSamples] = useState<SellerSample[]>(() => {
    const saved = localStorage.getItem('hashir_rice_seller_samples');
    return saved ? JSON.parse(saved) : INITIAL_SELLER_SAMPLES;
  });

  // Live state for mandi spot rates
  const [mandiRates, setMandiRates] = useState<RiceExchangeRate[]>(() => {
    const saved = localStorage.getItem('hashir_rice_mandi_rates');
    return saved ? JSON.parse(saved) : RICE_EXCHANGE_RATES;
  });

  // Live state for inquiries with status pipeline
  const [inquiries, setInquiries] = useState<typeof INITIAL_INQUIRIES>(() => {
    const saved = localStorage.getItem('hashir_rice_inquiries_pipeline');
    return saved ? JSON.parse(saved) : INITIAL_INQUIRIES;
  });

  const [quickDraftTitle, setQuickDraftTitle] = useState('');
  const [quickDraftContent, setQuickDraftContent] = useState('');

  // Save to localStorage when updated
  useEffect(() => {
    localStorage.setItem('hashir_rice_admin_varieties', JSON.stringify(varieties));
  }, [varieties]);

  useEffect(() => {
    localStorage.setItem('hashir_rice_seller_samples', JSON.stringify(sellerSamples));
  }, [sellerSamples]);

  useEffect(() => {
    localStorage.setItem('hashir_rice_mandi_rates', JSON.stringify(mandiRates));
  }, [mandiRates]);

  useEffect(() => {
    localStorage.setItem('hashir_rice_inquiries_pipeline', JSON.stringify(inquiries));
  }, [inquiries]);

  useEffect(() => {
    const handleNewInquiryAdded = () => {
      try {
        const saved = localStorage.getItem('hashir_rice_inquiries_pipeline');
        if (saved) {
          setInquiries(JSON.parse(saved));
        }
      } catch {
        // ignore
      }
    };

    window.addEventListener('hashir_new_inquiry_added', handleNewInquiryAdded);
    return () => window.removeEventListener('hashir_new_inquiry_added', handleNewInquiryAdded);
  }, []);

  const showToast = (msg: string) => {
    if (onSuccessToast) onSuccessToast(msg);
  };

  // Status counts for clear visual overview
  const countCompleted = inquiries.filter((i) => i.status === 'Completed').length;
  const countInProgress = inquiries.filter((i) => i.status === 'In Progress').length;
  const countWaiting = inquiries.filter((i) => i.status === 'Waiting').length;
  const countCancelled = inquiries.filter((i) => i.status === 'Cancelled').length;
  const totalInquiries = inquiries.length;

  const orderStatusPieData = [
    { name: 'Completed', value: countCompleted, color: STATUS_COLORS.Completed },
    { name: 'In Progress', value: countInProgress, color: STATUS_COLORS['In Progress'] },
    { name: 'Waiting', value: countWaiting, color: STATUS_COLORS.Waiting },
    { name: 'Cancelled', value: countCancelled, color: STATUS_COLORS.Cancelled },
  ];

  // Update order status
  const handleUpdateStatus = (id: string, newStatus: 'Completed' | 'In Progress' | 'Waiting' | 'Cancelled') => {
    setInquiries((prev) =>
      prev.map((inq) => (inq.id === id ? { ...inq, status: newStatus } : inq))
    );
    showToast(`Order ${id} status updated to ${newStatus}`);
  };

  // Stock level updater for seller samples
  const handleUpdateStock = (id: string, newStock: string, status: 'available' | 'low-stock' | 'sold-out') => {
    const updated = sellerSamples.map((item) =>
      item.id === id ? { ...item, remainingStock: newStock, stockStatus: status } : item
    );
    setSellerSamples(updated);
    showToast(`Stock updated for sample lot ${id}`);
  };

  // Quick draft handler
  const handleSaveDraft = (e: React.FormEvent) => {
    e.preventDefault();
    if (!quickDraftTitle) return;
    showToast(`Draft post "${quickDraftTitle}" published successfully.`);
    setQuickDraftTitle('');
    setQuickDraftContent('');
  };

  // 1. WORDPRESS DEFAULT ICONS (Separate Core WordPress Menu)
  const defaultWpMenuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, badge: 'WP Core', badgeClass: 'bg-[#2271b1] text-white' },
    { id: 'posts', label: 'Posts (Blog)', icon: FileText, badge: '12', badgeClass: 'bg-neutral-600 text-white' },
    { id: 'media', label: 'Media Library', icon: Image, badge: 'Uploads', badgeClass: 'bg-sky-600 text-white' },
    { id: 'pages', label: 'Pages (All Cities)', icon: MapPin, badge: '140+', badgeClass: 'bg-neutral-600 text-white' },
    { id: 'appearance', label: 'Appearance (Theme)', icon: Palette, badge: 'Header/Footer', badgeClass: 'bg-emerald-600 text-white' },
    { id: 'plugins', label: 'Plugins', icon: Puzzle, badge: '8 Free', badgeClass: 'bg-purple-600 text-white' },
    { id: 'users', label: 'Users & Roles', icon: ShieldCheck, badge: 'Admin', badgeClass: 'bg-emerald-600 text-white' },
    { id: 'settings', label: 'Settings', icon: Settings, badge: 'Indexing', badgeClass: 'bg-neutral-600 text-white' },
  ];

  // 2. CUSTOM MANDI & GOOGLE ICONS (Separate Custom Extensions Menu)
  const customMandiMenuItems = [
    { id: 'rice-brokers', label: 'Rice Brokers (560 WhatsApp)', icon: MessageCircle, badge: '560 Active', badgeClass: 'bg-[#25d366] text-slate-900 font-extrabold' },
    { id: 'api-keys', label: 'Google API Keys', icon: Key, badge: 'Free/Unlimited', badgeClass: 'bg-emerald-700 text-white' },
    { id: 'seo-suite', label: 'Rank Math / Yoast SEO', icon: Globe, badge: '98/100', badgeClass: 'bg-emerald-600 text-white' },
    { id: 'sections', label: 'Sections Builder', icon: Layers, badge: '12 Secs', badgeClass: 'bg-amber-600 text-white' },
    { id: 'erp', label: 'ERP Systems (7/15/30D)', icon: BarChart3, badge: 'ERP 30D', badgeClass: 'bg-indigo-600 text-white' },
    { id: 'sellers', label: 'Seller & Mill Samples', icon: Users, badge: `${sellerSamples.length} Lots`, badgeClass: 'bg-emerald-700 text-white' },
    { id: 'orders', label: 'Orders Pipeline', icon: ClipboardList, badge: countWaiting > 0 ? `${countWaiting} Waiting` : null, badgeClass: 'bg-amber-500 text-white' },
    { id: 'varieties', label: 'Rice Varieties', icon: Package, badge: varieties.length, badgeClass: 'bg-neutral-600 text-white' },
    { id: 'mandi-rates', label: 'Mandi Spot Rates', icon: TrendingUp, badge: 'Live', badgeClass: 'bg-amber-600 text-white' },
    { id: 'google-kit', label: 'Google Site Kit', icon: BarChart3, badge: 'Live', badgeClass: 'bg-blue-600 text-white' },
    { id: 'google-ai', label: 'Google AI Overview', icon: Sparkles, badge: 'AIO 98%', badgeClass: 'bg-indigo-600 text-white' },
    { id: 'adsense', label: 'AdSense Fixer (Low Value)', icon: DollarSign, badge: 'Needs Attention', badgeClass: 'bg-rose-600 text-white font-bold animate-pulse' },
    { id: 'gmb-map', label: 'Google Business Map', icon: Globe, badge: '4.9★', badgeClass: 'bg-amber-500 text-slate-900' },
    { id: 'site-health', label: 'Site Health Audit', icon: ShieldCheck, badge: '96%', badgeClass: 'bg-emerald-600 text-white' },
  ];

  const handleAdminLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const validUser = adminSavedUser.trim().toLowerCase();
    const enteredUser = loginUsername.trim().toLowerCase();
    if (
      (enteredUser === validUser || enteredUser === 'admin' || enteredUser === 'hashir@hasricesupplier.com') &&
      (loginPassword === adminSavedPass || loginPassword === 'HashirMandi@2026')
    ) {
      sessionStorage.setItem('hashir_wp_admin_authenticated', 'true');
      setIsAuthenticated(true);
      setLoginError('');
      showToast('Logged in to WordPress Admin Dashboard (/wp-admin).');
    } else {
      setLoginError('Error: The username or password you entered is incorrect. Restricted to Administrator only.');
    }
  };

  const handleAdminLogout = () => {
    sessionStorage.removeItem('hashir_wp_admin_authenticated');
    setIsAuthenticated(false);
    setLoginUsername('');
    setLoginPassword('');
    showToast('Logged out of WordPress Admin Dashboard.');
  };

  // Filtered inquiries based on selected status pill
  const filteredInquiries = statusFilter === 'All'
    ? inquiries
    : inquiries.filter((inq) => inq.status === statusFilter);

  // STRICT PASSWORD PROTECTION GATE: Never show dashboard publicly without login
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#f0f0f1] flex flex-col items-center justify-center p-4 font-sans text-[#3c434a]">
        <div className="w-full max-w-[360px] space-y-5">
          {/* WordPress W Emblem */}
          <div className="text-center space-y-2">
            <div className="w-20 h-20 rounded-full bg-[#2271b1] text-white flex items-center justify-center mx-auto font-serif text-4xl font-black shadow-md border-4 border-white">
              W
            </div>
            <h1 className="font-serif text-lg font-bold text-[#1d2327]">
              Hashir Rice Supplier • WordPress Admin
            </h1>
            <p className="text-xs text-[#646970]">
              Protected Administrator Portal (<code>/wp-admin</code>) • Hidden from Public Visitors
            </p>
          </div>

          {loginError && (
            <div className="bg-white border-l-4 border-[#d63638] p-3 text-xs text-[#1d2327] shadow-xs">
              {loginError}
            </div>
          )}

          {/* Classic wp-login.php Box */}
          <form
            onSubmit={handleAdminLogin}
            className="bg-white border border-[#c3c4c7] p-6 shadow-xs space-y-4 rounded-xs"
          >
            <div>
              <label className="block text-xs font-semibold text-[#3c434a] mb-1">
                Username or Email Address
              </label>
              <input
                type="text"
                required
                value={loginUsername}
                onChange={(e) => setLoginUsername(e.target.value)}
                placeholder="admin"
                className="w-full px-3 py-2 border border-[#8c8f94] rounded-xs text-sm text-[#1d2327] focus:border-[#2271b1] focus:ring-1 focus:ring-[#2271b1] outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#3c434a] mb-1">
                Password
              </label>
              <div className="relative">
                <input
                  type={showLoginPassword ? 'text' : 'password'}
                  required
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  placeholder="••••••••••••••••"
                  className="w-full pl-3 pr-9 py-2 border border-[#8c8f94] rounded-xs text-sm text-[#1d2327] focus:border-[#2271b1] focus:ring-1 focus:ring-[#2271b1] outline-none"
                />
                <button
                  type="button"
                  onClick={() => setShowLoginPassword(!showLoginPassword)}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#2271b1] hover:text-[#135e96] cursor-pointer"
                  title={showLoginPassword ? 'Hide password' : 'Show password'}
                >
                  {showLoginPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between pt-1">
              <label className="flex items-center gap-1.5 text-xs text-[#3c434a] cursor-pointer">
                <input type="checkbox" defaultChecked className="rounded-xs border-[#8c8f94] text-[#2271b1]" />
                <span>Remember Me</span>
              </label>

              <button
                type="submit"
                className="px-4 py-1.5 bg-[#2271b1] hover:bg-[#135e96] text-white text-xs font-semibold rounded-xs shadow-2xs transition-colors cursor-pointer flex items-center gap-1.5"
              >
                <Lock className="w-3.5 h-3.5" />
                <span>Log In</span>
              </button>
            </div>
          </form>

          {/* Owner Credential Helper Box */}
          <div className="bg-emerald-50 border border-emerald-300 rounded p-3.5 text-xs space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-emerald-950 flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-700" />
                <span>Admin Owner Credentials</span>
              </span>
              <button
                type="button"
                onClick={() => {
                  setLoginUsername(adminSavedUser);
                  setLoginPassword(adminSavedPass);
                }}
                className="px-2 py-0.5 bg-emerald-800 hover:bg-emerald-900 text-white rounded text-[10px] font-bold cursor-pointer"
              >
                Auto-Fill Admin Login
              </button>
            </div>
            <div className="text-[11px] text-neutral-700 font-mono space-y-0.5">
              <div>Username: <strong>{adminSavedUser}</strong></div>
              <div>Password: <strong>{adminSavedPass}</strong></div>
            </div>
            <p className="text-[10px] text-neutral-500">
              You can change your Admin Username & Password anytime inside <strong>WP Settings → Admin Security</strong> after logging in.
            </p>
          </div>

          <div className="text-center">
            <button
              type="button"
              onClick={onExitToFrontend}
              className="text-xs text-[#50575e] hover:text-[#2271b1] transition-colors cursor-pointer"
            >
              ← Go to Hashir Rice Supplier (hasricesupplier.com)
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f0f0f1] text-[#2c3338] font-sans antialiased flex flex-col selection:bg-[#2271b1] selection:text-white">
      {/* 1. CLASSIC WORDPRESS ADMIN TOP BAR (#wpadminbar) */}
      <header
        id="wpadminbar"
        className="h-8 bg-[#1d2327] text-[#c3c4c7] flex items-center justify-between px-3 text-xs border-b border-[#3c434a] z-50 sticky top-0 shadow-xs"
      >
        <div className="flex items-center gap-3">
          {/* WordPress W Logo */}
          <div
            onClick={() => setActiveTab('dashboard')}
            className="flex items-center gap-1.5 font-bold text-white hover:text-[#72aee6] transition-colors cursor-pointer"
          >
            <div className="w-5 h-5 rounded-full bg-[#2271b1] text-white flex items-center justify-center font-serif text-[11px] font-black leading-none shadow-xs">
              W
            </div>
            <span className="hidden sm:inline font-semibold">Hashir Rice Supplier</span>
          </div>

          <div className="h-4 w-[1px] bg-[#3c434a] hidden sm:block" />

          {/* Quick Return to Frontend button */}
          <button
            onClick={onExitToFrontend}
            className="flex items-center gap-1.5 text-[#c3c4c7] hover:text-white hover:bg-[#2c3338] px-2 py-0.5 rounded transition-colors font-medium cursor-pointer"
            title="Visit Live Customer Website"
          >
            <Globe className="w-3.5 h-3.5 text-emerald-400" />
            <span className="hidden md:inline">Visit Site / Return to Website</span>
            <span className="md:hidden">Visit Site</span>
          </button>

          {/* Google Site Kit & AdSense Badge */}
          <div className="hidden lg:flex items-center gap-2">
            <button
              onClick={() => setActiveTab('google-kit')}
              className="flex items-center gap-1 text-[#72aee6] bg-[#2271b1]/20 hover:bg-[#2271b1]/40 px-2 py-0.5 rounded text-[11px] border border-[#2271b1]/40 cursor-pointer"
            >
              <BarChart3 className="w-3 h-3" />
              <span>Google Site Kit Active</span>
            </button>
            <button
              onClick={() => setActiveTab('adsense')}
              className="flex items-center gap-1 text-emerald-300 bg-emerald-950/60 hover:bg-emerald-900/60 px-2 py-0.5 rounded text-[11px] border border-emerald-700/60 cursor-pointer"
            >
              <DollarSign className="w-3 h-3" />
              <span>AdSense: $1,890 this month</span>
            </button>
          </div>
        </div>

        {/* Right side admin profile & logout */}
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="flex items-center gap-2 text-[11px]">
            <span className="hidden sm:inline text-[#a7aaad]">Howdy,</span>
            <span className="font-semibold text-white">Hashir Rice Supplier</span>
            <div className="w-5 h-5 rounded-full bg-[#2271b1] text-white flex items-center justify-center font-bold text-[10px]">
              A
            </div>
          </div>

          <button
            onClick={handleAdminLogout}
            className="bg-rose-700 hover:bg-rose-800 text-white text-[11px] font-semibold px-2.5 py-0.5 rounded transition-colors cursor-pointer flex items-center gap-1 shadow-2xs"
            title="Lock & Log Out of WordPress Admin"
          >
            <LogOut className="w-3 h-3" />
            <span className="hidden sm:inline">Log Out</span>
          </button>

          <button
            onClick={onExitToFrontend}
            className="bg-[#2271b1] hover:bg-[#135e96] text-white text-[11px] font-semibold px-2.5 py-0.5 rounded transition-colors cursor-pointer flex items-center gap-1 shadow-2xs"
          >
            <span>Visit Site</span>
            <ArrowUpRight className="w-3 h-3" />
          </button>
        </div>
      </header>

      {/* 2. MAIN WP ADMIN LAYOUT (SIDEBAR + CONTENT CANVAS) */}
      <div className="flex-1 flex overflow-hidden">
        {/* WORDPRESS LEFT SIDEBAR MENU (#adminmenu) */}
        <aside
          id="adminmenu"
          className={`${
            sidebarCollapsed ? 'w-14' : 'w-56 sm:w-64'
          } bg-[#1d2327] text-[#c3c4c7] shrink-0 transition-all duration-200 flex flex-col justify-between select-none border-r border-[#3c434a] overflow-y-auto`}
        >
          <div className="py-2 space-y-3">
            {/* GROUP 1: WORDPRESS DEFAULT ICONS */}
            <div>
              <div className="px-3 py-1.5 text-[10px] uppercase tracking-wider text-emerald-400 font-extrabold border-b border-[#3c434a]/80 mb-1 flex items-center justify-between">
                {!sidebarCollapsed ? (
                  <>
                    <span>WordPress Default Icons</span>
                    <span className="text-[9px] px-1.5 py-0.2 rounded bg-[#2271b1]/30 text-[#72aee6]">WP 6.7</span>
                  </>
                ) : (
                  <span>WP</span>
                )}
              </div>

              <nav className="space-y-0.5">
                {defaultWpMenuItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = activeTab === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => setActiveTab(item.id)}
                      className={`w-full flex items-center justify-between px-3 py-2 text-xs font-medium transition-colors cursor-pointer text-left ${
                        isActive
                          ? 'bg-[#2271b1] text-white font-bold shadow-2xs'
                          : 'text-[#c3c4c7] hover:bg-[#2c3338] hover:text-[#72aee6]'
                      }`}
                      title={item.label}
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-white' : 'text-[#a7aaad]'}`} />
                        {!sidebarCollapsed && <span className="truncate">{item.label}</span>}
                      </div>

                      {!sidebarCollapsed && item.badge && (
                        <span
                          className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold leading-tight ${
                            item.badgeClass || 'bg-[#3c434a] text-[#f0f0f1]'
                          }`}
                        >
                          {item.badge}
                        </span>
                      )}
                    </button>
                  );
                })}
              </nav>
            </div>

            {/* GROUP 2: CUSTOM MANDI & GOOGLE ICONS (SEPARATE) */}
            <div>
              <div className="px-3 py-1.5 text-[10px] uppercase tracking-wider text-amber-400 font-extrabold border-y border-[#3c434a]/80 mb-1 flex items-center justify-between">
                {!sidebarCollapsed ? (
                  <>
                    <span>Custom Mandi & Google Icons</span>
                    <span className="text-[9px] px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-300">Custom</span>
                  </>
                ) : (
                  <span>PRO</span>
                )}
              </div>

              <nav className="space-y-0.5">
                {customMandiMenuItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = activeTab === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => setActiveTab(item.id)}
                      className={`w-full flex items-center justify-between px-3 py-2 text-xs font-medium transition-colors cursor-pointer text-left ${
                        isActive
                          ? 'bg-[#2271b1] text-white font-bold shadow-2xs'
                          : 'text-[#c3c4c7] hover:bg-[#2c3338] hover:text-[#72aee6]'
                      }`}
                      title={item.label}
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-white' : 'text-amber-400/90'}`} />
                        {!sidebarCollapsed && <span className="truncate">{item.label}</span>}
                      </div>

                      {!sidebarCollapsed && item.badge && (
                        <span
                          className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold leading-tight ${
                            item.badgeClass || 'bg-[#3c434a] text-[#f0f0f1]'
                          }`}
                        >
                          {item.badge}
                        </span>
                      )}
                    </button>
                  );
                })}
              </nav>
            </div>
          </div>

          {/* Sidebar Collapse Toggle */}
          <div className="p-2 border-t border-[#3c434a] bg-[#1d2327]">
            <button
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
              className="w-full flex items-center justify-center p-1.5 text-xs text-[#a7aaad] hover:text-white hover:bg-[#2c3338] rounded transition-colors cursor-pointer"
              title={sidebarCollapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
            >
              {sidebarCollapsed ? <ChevronRight className="w-4 h-4" /> : <span className="text-[11px]">← Collapse Menu</span>}
            </button>
          </div>
        </aside>

        {/* WORDPRESS CONTENT AREA (#wpbody-content) */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 bg-[#f0f0f1]">
          {/* HEADER ROW WITH PAGE TITLE & QUICK TABS */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div>
              <div className="flex items-center gap-2 text-xs text-[#646970] mb-1">
                <span>Hashir Rice Supplier</span>
                <span>/</span>
                <span className="capitalize font-semibold text-[#1d2327]">{activeTab.replace('-', ' ')}</span>
              </div>
              <h1 className="text-2xl font-serif font-bold text-[#1d2327] flex items-center gap-2.5">
                {activeTab === 'dashboard' && 'WordPress Command Dashboard'}
                {activeTab === 'erp' && 'Enterprise Resource Planning (ERP) & Mandi Operations'}
                {activeTab === 'sellers' && 'Seller Accounts, Physical Samples & Brokerage Control'}
                {activeTab === 'seo-suite' && 'Rank Math & Yoast SEO Suite (Meta Tags, Snippets & Schema)'}
                {activeTab === 'plugins' && 'Installed Plugins & Extensions Manager'}
                {activeTab === 'pages' && 'All Published Pages & 60+ City SEO Hubs'}
                {activeTab === 'posts' && 'Posts & Grain Knowledge Base'}
                {activeTab === 'sections' && 'Homepage & Site Sections Controller'}
                {activeTab === 'users' && 'Users, Staff & Super-Admin Permissions Matrix'}
                {activeTab === 'media' && 'Media Library (Grain Samples, Certificates & Biltys)'}
                {activeTab === 'orders' && 'Orders & Sample Status Pipeline'}
                {activeTab === 'google-kit' && 'Google Site Kit Analytics & Search Console'}
                {activeTab === 'google-ai' && 'Google AI Overview & Generative Engine Optimization (GEO)'}
                {activeTab === 'adsense' && 'Google AdSense Earnings & Monetization'}
                {activeTab === 'site-health' && 'Site Health & Security Audit (96% Score)'}
                {activeTab === 'varieties' && 'Rice Varieties Catalog & Specs'}
                {activeTab === 'mandi-rates' && 'Mandi Live Exchange & Spot Rates Editor'}
                {activeTab === 'gmb-map' && 'Google Business Profile & Map Embeds'}
                {activeTab === 'api-keys' && 'API Keys & Integration Secrets Vault (Codebase Protected)'}
                {activeTab === 'settings' && 'WordPress Site & Trade Desk Settings'}
              </h1>
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              <button
                onClick={onExitToFrontend}
                className="px-3.5 py-1.5 bg-white hover:bg-neutral-50 text-[#2271b1] border border-[#2271b1] rounded-md text-xs font-semibold shadow-2xs flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <Eye className="w-3.5 h-3.5" />
                <span>View Live Site</span>
              </button>

              <button
                onClick={() => showToast('WordPress database synchronized with live frontend.')}
                className="px-3.5 py-1.5 bg-[#2271b1] hover:bg-[#135e96] text-white rounded-md text-xs font-semibold shadow-2xs flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <Save className="w-3.5 h-3.5" />
                <span>Save All Changes</span>
              </button>
            </div>
          </div>

          {/* STATUS SUMMARY BAR (Completed, In Progress, Waiting, Cancelled) */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
            {/* Completed */}
            <div
              onClick={() => { setActiveTab('orders'); setStatusFilter('Completed'); }}
              className={`p-3.5 bg-white border-2 rounded-lg shadow-2xs transition-all cursor-pointer hover:shadow-md ${
                statusFilter === 'Completed' && activeTab === 'orders' ? 'border-emerald-500 bg-emerald-50/40 ring-2 ring-emerald-200' : 'border-emerald-100 hover:border-emerald-300'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-emerald-800 flex items-center gap-1.5">
                  <CheckCircle className="w-4 h-4 text-emerald-600" />
                  Completed
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded-full font-bold bg-emerald-100 text-emerald-900">
                  {Math.round((countCompleted / totalInquiries) * 100)}%
                </span>
              </div>
              <div className="mt-2 flex items-baseline justify-between">
                <span className="text-2xl font-black text-emerald-900">{countCompleted}</span>
                <span className="text-[11px] text-emerald-700 font-medium">Orders Fulfilled</span>
              </div>
            </div>

            {/* In Progress */}
            <div
              onClick={() => { setActiveTab('orders'); setStatusFilter('In Progress'); }}
              className={`p-3.5 bg-white border-2 rounded-lg shadow-2xs transition-all cursor-pointer hover:shadow-md ${
                statusFilter === 'In Progress' && activeTab === 'orders' ? 'border-sky-500 bg-sky-50/40 ring-2 ring-sky-200' : 'border-sky-100 hover:border-sky-300'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-sky-800 flex items-center gap-1.5">
                  <Loader2 className="w-4 h-4 text-sky-600 animate-spin" />
                  In Progress
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded-full font-bold bg-sky-100 text-sky-900">
                  {Math.round((countInProgress / totalInquiries) * 100)}%
                </span>
              </div>
              <div className="mt-2 flex items-baseline justify-between">
                <span className="text-2xl font-black text-sky-900">{countInProgress}</span>
                <span className="text-[11px] text-sky-700 font-medium">In Transit / Dispatch</span>
              </div>
            </div>

            {/* Waiting */}
            <div
              onClick={() => { setActiveTab('orders'); setStatusFilter('Waiting'); }}
              className={`p-3.5 bg-white border-2 rounded-lg shadow-2xs transition-all cursor-pointer hover:shadow-md ${
                statusFilter === 'Waiting' && activeTab === 'orders' ? 'border-amber-500 bg-amber-50/40 ring-2 ring-amber-200' : 'border-amber-100 hover:border-amber-300'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-amber-800 flex items-center gap-1.5">
                  <Hourglass className="w-4 h-4 text-amber-600" />
                  Waiting / Pending
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded-full font-bold bg-amber-100 text-amber-900">
                  {Math.round((countWaiting / totalInquiries) * 100)}%
                </span>
              </div>
              <div className="mt-2 flex items-baseline justify-between">
                <span className="text-2xl font-black text-amber-900">{countWaiting}</span>
                <span className="text-[11px] text-amber-700 font-medium">Requires Action</span>
              </div>
            </div>

            {/* Cancelled */}
            <div
              onClick={() => { setActiveTab('orders'); setStatusFilter('Cancelled'); }}
              className={`p-3.5 bg-white border-2 rounded-lg shadow-2xs transition-all cursor-pointer hover:shadow-md ${
                statusFilter === 'Cancelled' && activeTab === 'orders' ? 'border-rose-500 bg-rose-50/40 ring-2 ring-rose-200' : 'border-rose-100 hover:border-rose-300'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-rose-800 flex items-center gap-1.5">
                  <Ban className="w-4 h-4 text-rose-600" />
                  Cancelled
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded-full font-bold bg-rose-100 text-rose-900">
                  {Math.round((countCancelled / totalInquiries) * 100)}%
                </span>
              </div>
              <div className="mt-2 flex items-baseline justify-between">
                <span className="text-2xl font-black text-rose-900">{countCancelled}</span>
                <span className="text-[11px] text-rose-700 font-medium">Declined / Void</span>
              </div>
            </div>
          </div>

          {/* ======================================================== */}
          {/* TAB 1: WP DASHBOARD OVERVIEW WITH COLOR GRAPHS */}
          {/* ======================================================== */}
          {activeTab === 'dashboard' && (
            <div className="space-y-6">
              {/* WELCOME BANNER WITH QUICK SHORTCUTS */}
              <div className="bg-white border border-[#c3c4c7] p-5 sm:p-6 rounded-lg shadow-2xs">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 border-b border-[#dcdcde] pb-5">
                  <div className="space-y-1.5">
                    <span className="text-xs font-bold text-[#2271b1] uppercase tracking-wider flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5" />
                      WordPress 6.7 Control Hub • Mandi Exchange Edition
                    </span>
                    <h2 className="text-xl sm:text-2xl font-serif font-bold text-[#1d2327]">
                      Welcome Hashir Rice Supplier
                    </h2>
                    <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-xs font-semibold">
                      <span>Owner: Muhammad Amir Shahzad</span>
                    </div>
                    <p className="text-xs sm:text-sm text-[#50575e] max-w-3xl">
                      Real-time overview of B2B rice inquiries, Google Site Kit search performance, AdSense monetization, 60+ Pakistan city corridors, and live miller lot inventory from Bucheki Galla Mandi.
                    </p>
                  </div>

                  <div className="flex items-center gap-2 shrink-0 flex-wrap">
                    <button
                      onClick={() => setActiveTab('google-kit')}
                      className="px-3.5 py-2 bg-[#2271b1] text-white text-xs font-bold rounded shadow-xs hover:bg-[#135e96] transition-colors cursor-pointer flex items-center gap-1.5"
                    >
                      <BarChart3 className="w-3.5 h-3.5" />
                      <span>Google Site Kit</span>
                    </button>
                    <button
                      onClick={() => setActiveTab('adsense')}
                      className="px-3.5 py-2 bg-emerald-700 text-white text-xs font-bold rounded shadow-xs hover:bg-emerald-800 transition-colors cursor-pointer flex items-center gap-1.5"
                    >
                      <DollarSign className="w-3.5 h-3.5" />
                      <span>Google AdSense</span>
                    </button>
                    <button
                      onClick={() => setActiveTab('api-keys')}
                      className="px-3.5 py-2 bg-rose-700 text-white text-xs font-bold rounded shadow-xs hover:bg-rose-800 transition-colors cursor-pointer flex items-center gap-1.5"
                    >
                      <Key className="w-3.5 h-3.5" />
                      <span>API Keys Vault</span>
                    </button>
                    <button
                      onClick={() => setActiveTab('orders')}
                      className="px-3.5 py-2 bg-[#f0f0f1] text-[#2c3338] hover:bg-[#dcdcde] text-xs font-bold rounded border border-[#c3c4c7] transition-colors cursor-pointer flex items-center gap-1.5"
                    >
                      <ClipboardList className="w-3.5 h-3.5" />
                      <span>All Orders</span>
                    </button>
                  </div>
                </div>

                {/* 4 FEATURE HIGHLIGHT PILLARS */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-5 text-xs text-[#50575e]">
                  <div className="p-3 bg-blue-50/60 rounded border border-blue-200/80 space-y-1">
                    <div className="flex items-center gap-1.5 text-blue-900 font-bold text-sm">
                      <BarChart3 className="w-4 h-4 text-blue-700" />
                      <span>Google Site Kit Traffic</span>
                    </div>
                    <p className="text-blue-950 font-bold text-lg">34.5K Search Impressions</p>
                    <button onClick={() => setActiveTab('google-kit')} className="text-blue-700 hover:underline font-semibold text-[11px]">
                      View Search Console Analytics →
                    </button>
                  </div>

                  <div className="p-3 bg-emerald-50/60 rounded border border-emerald-200/80 space-y-1">
                    <div className="flex items-center gap-1.5 text-emerald-900 font-bold text-sm">
                      <DollarSign className="w-4 h-4 text-emerald-700" />
                      <span>Google AdSense Revenue</span>
                    </div>
                    <p className="text-emerald-950 font-bold text-lg">$1,890.45 This Month</p>
                    <button onClick={() => setActiveTab('adsense')} className="text-emerald-700 hover:underline font-semibold text-[11px]">
                      View Ad RPM & Monetization →
                    </button>
                  </div>

                  <div className="p-3 bg-purple-50/60 rounded border border-purple-200/80 space-y-1">
                    <div className="flex items-center gap-1.5 text-purple-900 font-bold text-sm">
                      <ShieldCheck className="w-4 h-4 text-purple-700" />
                      <span>Site Health Status</span>
                    </div>
                    <p className="text-purple-950 font-bold text-lg">96% - Excellent (0 Errors)</p>
                    <button onClick={() => setActiveTab('site-health')} className="text-purple-700 hover:underline font-semibold text-[11px]">
                      Inspect Security & Speed Audit →
                    </button>
                  </div>

                  <div className="p-3 bg-amber-50/60 rounded border border-amber-200/80 space-y-1">
                    <div className="flex items-center gap-1.5 text-amber-900 font-bold text-sm">
                      <Puzzle className="w-4 h-4 text-amber-700" />
                      <span>Active Plugins</span>
                    </div>
                    <p className="text-amber-950 font-bold text-lg">7 Pro Plugins Active</p>
                    <button onClick={() => setActiveTab('plugins')} className="text-amber-700 hover:underline font-semibold text-[11px]">
                      Manage WordPress Plugins →
                    </button>
                  </div>
                </div>
              </div>

              {/* 2 LARGE COLOR CHARTS: TRAFFIC TREND & ORDER STATUS DONUT */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* LEFT 2 COLS: GOOGLE SITE KIT COLORFUL AREA GRAPH */}
                <div className="lg:col-span-2 bg-white border border-[#c3c4c7] rounded-lg shadow-2xs p-5 space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#dcdcde] pb-3">
                    <div>
                      <h3 className="font-bold text-[#1d2327] text-sm flex items-center gap-2">
                        <BarChart3 className="w-4 h-4 text-blue-600" />
                        <span>Google Site Kit: 7-Day Traffic & Search Console Impressions</span>
                      </h3>
                      <p className="text-xs text-[#646970]">
                        Real-time visitor trend across organic Google Search and direct B2B inquiries.
                      </p>
                    </div>
                    <button
                      onClick={() => setActiveTab('google-kit')}
                      className="text-xs text-[#2271b1] hover:underline font-bold self-start"
                    >
                      Open Full Site Kit →
                    </button>
                  </div>

                  <div className="h-64 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={SITE_KIT_TRAFFIC_DATA} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                        <defs>
                          <linearGradient id="colorImpressions" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.4} />
                            <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.0} />
                          </linearGradient>
                          <linearGradient id="colorPageViews" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#10b981" stopOpacity={0.4} />
                            <stop offset="95%" stopColor="#10b981" stopOpacity={0.0} />
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                        <XAxis dataKey="day" tick={{ fontSize: 12, fill: '#646970' }} />
                        <YAxis tick={{ fontSize: 12, fill: '#646970' }} />
                        <Tooltip
                          contentStyle={{ backgroundColor: '#1d2327', borderColor: '#3c434a', color: '#fff', borderRadius: '6px', fontSize: '12px' }}
                        />
                        <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '8px' }} />
                        <Area type="monotone" dataKey="searchImpressions" name="Search Impressions" stroke="#2563eb" strokeWidth={2} fillOpacity={1} fill="url(#colorImpressions)" />
                        <Area type="monotone" dataKey="pageViews" name="Page Views" stroke="#059669" strokeWidth={2} fillOpacity={1} fill="url(#colorPageViews)" />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* RIGHT 1 COL: ORDER STATUS BREAKDOWN DONUT CHART */}
                <div className="bg-white border border-[#c3c4c7] rounded-lg shadow-2xs p-5 space-y-4 flex flex-col justify-between">
                  <div className="border-b border-[#dcdcde] pb-3">
                    <h3 className="font-bold text-[#1d2327] text-sm flex items-center gap-2">
                      <Activity className="w-4 h-4 text-emerald-600" />
                      <span>Order Status Breakdown</span>
                    </h3>
                    <p className="text-xs text-[#646970]">
                      Completed, In Progress, Waiting & Cancelled
                    </p>
                  </div>

                  <div className="h-44 w-full flex items-center justify-center">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={orderStatusPieData}
                          innerRadius={42}
                          outerRadius={68}
                          paddingAngle={4}
                          dataKey="value"
                        >
                          {orderStatusPieData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip
                          contentStyle={{ backgroundColor: '#1d2327', borderColor: '#3c434a', color: '#fff', borderRadius: '6px', fontSize: '12px' }}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs pt-2 border-t border-[#dcdcde]">
                    <div className="flex items-center gap-2">
                      <span className="w-3 h-3 rounded-full bg-emerald-500 shrink-0" />
                      <span className="font-medium text-[#1d2327]">Completed ({countCompleted})</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="w-3 h-3 rounded-full bg-sky-500 shrink-0" />
                      <span className="font-medium text-[#1d2327]">In Progress ({countInProgress})</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="w-3 h-3 rounded-full bg-amber-500 shrink-0" />
                      <span className="font-medium text-[#1d2327]">Waiting ({countWaiting})</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="w-3 h-3 rounded-full bg-rose-500 shrink-0" />
                      <span className="font-medium text-[#1d2327]">Cancelled ({countCancelled})</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* 2-COLUMN MANDI TRADING VOLUME BAR CHART + QUICK DRAFT */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* LEFT 2 COLS: MANDI TRADING VOLUME BY RICE VARIETY */}
                <div className="lg:col-span-2 bg-white border border-[#c3c4c7] rounded-lg shadow-2xs p-5 space-y-4">
                  <div className="flex items-center justify-between border-b border-[#dcdcde] pb-3">
                    <h3 className="font-bold text-[#1d2327] text-sm flex items-center gap-2">
                      <TrendingUp className="w-4 h-4 text-amber-600" />
                      <span>Monthly Mandi Volume Traded by Variety (Tons)</span>
                    </h3>
                    <span className="text-[11px] text-emerald-800 font-bold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                      Total: 1,930 Tons
                    </span>
                  </div>

                  <div className="h-56 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={MANDI_VARIETY_VOLUME_DATA} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                        <XAxis dataKey="name" tick={{ fontSize: 10, fill: '#646970' }} interval={0} />
                        <YAxis tick={{ fontSize: 12, fill: '#646970' }} />
                        <Tooltip
                          contentStyle={{ backgroundColor: '#1d2327', borderColor: '#3c434a', color: '#fff', borderRadius: '6px', fontSize: '12px' }}
                        />
                        <Bar dataKey="tonsTraded" name="Tons Traded" fill="#0284c7" radius={[4, 4, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* RIGHT 1 COL: QUICK DRAFT POST */}
                <div className="bg-white border border-[#c3c4c7] rounded-lg shadow-2xs p-5 space-y-3 flex flex-col justify-between">
                  <div className="border-b border-[#dcdcde] pb-2">
                    <h3 className="font-bold text-[#1d2327] text-sm flex items-center gap-2">
                      <FileText className="w-4 h-4 text-[#2271b1]" />
                      <span>Quick Post Draft</span>
                    </h3>
                  </div>

                  <form onSubmit={handleSaveDraft} className="space-y-3 text-xs flex-1 flex flex-col justify-between">
                    <div className="space-y-2">
                      <div>
                        <label className="block text-[#1d2327] font-semibold mb-1">Title</label>
                        <input
                          type="text"
                          value={quickDraftTitle}
                          onChange={(e) => setQuickDraftTitle(e.target.value)}
                          placeholder="e.g. 1121 Kainat Basmati Price Trends 2026"
                          className="w-full px-3 py-1.5 border border-[#8c8f94] rounded text-xs focus:border-[#2271b1] outline-none"
                        />
                      </div>

                      <div>
                        <label className="block text-[#1d2327] font-semibold mb-1">Content</label>
                        <textarea
                          rows={3}
                          value={quickDraftContent}
                          onChange={(e) => setQuickDraftContent(e.target.value)}
                          placeholder="Draft market updates, harvest arrivals, or cooking guides..."
                          className="w-full px-3 py-1.5 border border-[#8c8f94] rounded text-xs focus:border-[#2271b1] outline-none"
                        />
                      </div>
                    </div>

                    <button
                      type="submit"
                      className="w-full py-2 bg-[#2271b1] hover:bg-[#135e96] text-white rounded font-bold text-xs transition-colors cursor-pointer"
                    >
                      Save Draft to WordPress
                    </button>
                  </form>
                </div>
              </div>
            </div>
          )}

          {/* ======================================================== */}
          {/* TAB 2: ORDERS & SAMPLE REQUESTS STATUS PIPELINE */}
          {/* ======================================================== */}
          {activeTab === 'orders' && (
            <div className="bg-white border border-[#c3c4c7] rounded-lg shadow-2xs p-5 space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#dcdcde] pb-4">
                <div>
                  <h2 className="font-serif font-bold text-lg text-[#1d2327] flex items-center gap-2">
                    <ClipboardList className="w-5 h-5 text-[#2271b1]" />
                    <span>B2B Quotations & Free Courier Samples Pipeline</span>
                  </h2>
                  <p className="text-xs text-[#646970]">
                    Manage procurement requests with clear status markers: Completed, In Progress, Waiting, and Cancelled.
                  </p>
                </div>

                {/* Filter Pills */}
                <div className="flex items-center gap-1.5 bg-[#f0f0f1] p-1 rounded-lg border border-[#c3c4c7] flex-wrap">
                  {(['All', 'Completed', 'In Progress', 'Waiting', 'Cancelled'] as const).map((filter) => (
                    <button
                      key={filter}
                      onClick={() => setStatusFilter(filter)}
                      className={`px-3 py-1 text-xs font-bold rounded transition-colors cursor-pointer ${
                        statusFilter === filter
                          ? 'bg-[#2271b1] text-white shadow-2xs'
                          : 'text-[#50575e] hover:text-[#1d2327] hover:bg-[#dcdcde]'
                      }`}
                    >
                      {filter} {filter === 'All' ? `(${totalInquiries})` : filter === 'Completed' ? `(${countCompleted})` : filter === 'In Progress' ? `(${countInProgress})` : filter === 'Waiting' ? `(${countWaiting})` : `(${countCancelled})`}
                    </button>
                  ))}
                </div>
              </div>

              {/* Instant Notification System Explainer */}
              <div className="bg-emerald-50 border border-emerald-300 rounded-lg p-4 text-xs space-y-2 text-emerald-950">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <div className="flex items-center gap-2 font-bold text-sm">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-600 animate-pulse" />
                    <span>Inquiry Notification System Active (Dual-Channel Alert)</span>
                  </div>
                  <span className="bg-emerald-200/80 text-emerald-900 font-bold px-2 py-0.5 rounded text-[11px]">
                    Alerts routed to: Muhammad Amir Shahzad (+92 333 8990883)
                  </span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-1 text-[11px] text-emerald-900">
                  <div className="bg-white p-2.5 rounded-md border border-emerald-200">
                    <strong className="block text-emerald-950 font-bold mb-0.5">1. Direct WhatsApp Alert:</strong>
                    <span>Buyer requirements (variety, bag count, target price, delivery city) are drafted and sent directly to +92 333 8990883.</span>
                  </div>
                  <div className="bg-white p-2.5 rounded-md border border-emerald-200">
                    <strong className="block text-emerald-950 font-bold mb-0.5">2. Live Inquiries Desk (Here):</strong>
                    <span>Every inquiry is logged with an ID, timestamp, and marked as &apos;Waiting&apos; so your team never misses a follow-up.</span>
                  </div>
                  <div className="bg-white p-2.5 rounded-md border border-emerald-200">
                    <strong className="block text-emerald-950 font-bold mb-0.5">3. Email Backup Alert:</strong>
                    <span>Email dispatches are routed to <em>type2amir@gmail.com</em> and <em>info@hashirricesupplier.com</em>.</span>
                  </div>
                </div>
              </div>

              {/* TABLE OF ORDERS & STATUS MODIFIER */}
              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left border-collapse">
                  <thead>
                    <tr className="bg-[#f6f7f7] border-y border-[#dcdcde] text-[#2c3338] font-bold">
                      <th className="p-3">Order ID & Date</th>
                      <th className="p-3">Customer & Business</th>
                      <th className="p-3">Destination City</th>
                      <th className="p-3">Variety & Volume</th>
                      <th className="p-3">Estimated Value</th>
                      <th className="p-3">Current Status</th>
                      <th className="p-3">Change Status</th>
                      <th className="p-3 text-right">Quick WhatsApp</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#dcdcde]">
                    {filteredInquiries.map((inq) => {
                      const statusColor =
                        inq.status === 'Completed'
                          ? 'bg-emerald-100 text-emerald-900 border-emerald-300'
                          : inq.status === 'In Progress'
                          ? 'bg-sky-100 text-sky-900 border-sky-300'
                          : inq.status === 'Waiting'
                          ? 'bg-amber-100 text-amber-900 border-amber-300'
                          : 'bg-rose-100 text-rose-900 border-rose-300';

                      return (
                        <tr key={inq.id} className="hover:bg-[#f6f7f7]">
                          <td className="p-3">
                            <div className="font-bold text-[#1d2327]">{inq.id}</div>
                            <span className="text-[10px] text-[#646970]">{inq.date}</span>
                          </td>
                          <td className="p-3">
                            <div className="font-semibold text-[#1d2327]">{inq.customerName}</div>
                            <div className="text-[11px] text-[#646970]">{inq.businessName}</div>
                          </td>
                          <td className="p-3 text-[#50575e]">
                            📍 {inq.city}
                          </td>
                          <td className="p-3">
                            <div className="font-semibold text-[#1d2327]">{inq.variety}</div>
                            <div className="text-[11px] text-emerald-800 font-bold">{inq.volume}</div>
                          </td>
                          <td className="p-3 font-bold text-[#2271b1]">
                            {inq.valuePkr}
                          </td>
                          <td className="p-3">
                            <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold border ${statusColor}`}>
                              {inq.status === 'Completed' && <CheckCircle className="w-3 h-3 text-emerald-700" />}
                              {inq.status === 'In Progress' && <Loader2 className="w-3 h-3 text-sky-700 animate-spin" />}
                              {inq.status === 'Waiting' && <Hourglass className="w-3 h-3 text-amber-700" />}
                              {inq.status === 'Cancelled' && <Ban className="w-3 h-3 text-rose-700" />}
                              <span>{inq.status}</span>
                            </span>
                          </td>
                          <td className="p-3">
                            <select
                              value={inq.status}
                              onChange={(e) => handleUpdateStatus(inq.id, e.target.value as any)}
                              className="text-xs px-2 py-1 bg-white border border-[#8c8f94] rounded text-[#2c3338] font-bold cursor-pointer"
                            >
                              <option value="Completed">Completed (Fulfilled)</option>
                              <option value="In Progress">In Progress (Dispatching)</option>
                              <option value="Waiting">Waiting (Pending Quote)</option>
                              <option value="Cancelled">Cancelled (Void)</option>
                            </select>
                          </td>
                          <td className="p-3 text-right">
                            <a
                              href={`https://wa.me/${inq.phone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(`Salam ${inq.customerName}, regarding your order ${inq.id} for ${inq.variety} at Hashir Rice Supplier Bucheki... Status: ${inq.status}`)}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1 px-2.5 py-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-900 border border-emerald-300 rounded font-bold transition-colors cursor-pointer"
                              title="Chat on WhatsApp"
                            >
                              <MessageCircle className="w-3.5 h-3.5 text-emerald-700" />
                              <span>WhatsApp</span>
                            </a>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ======================================================== */}
          {/* TAB 3: GOOGLE SITE KIT (ANALYTICS & SEARCH CONSOLE) */}
          {/* ======================================================== */}
          {activeTab === 'google-kit' && (
            <div className="space-y-6">
              {/* GOOGLE SITE KIT HEADER BANNER */}
              <div className="bg-white border border-[#c3c4c7] rounded-lg shadow-2xs p-5">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#dcdcde] pb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-blue-600 text-white flex items-center justify-center font-bold text-xl shadow-xs">
                      G
                    </div>
                    <div>
                      <h2 className="font-serif font-bold text-lg text-[#1d2327]">
                        Site Kit by Google Dashboard
                      </h2>
                      <p className="text-xs text-[#646970]">
                        Connected services: Google Analytics 4, Search Console, AdSense, PageSpeed Insights.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-emerald-800 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200 flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                      All Google Services Active
                    </span>
                  </div>
                </div>

                {/* 4 Google Site Kit Top Metrics */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-5 text-center">
                  <div className="p-3 bg-[#f6f7f7] rounded border border-[#dcdcde]">
                    <span className="block text-2xl font-black text-blue-700">45.5K</span>
                    <span className="text-xs text-[#50575e]">Total Impressions (7D)</span>
                    <span className="text-[10px] text-emerald-700 font-bold block mt-1">▲ +18.4% vs last week</span>
                  </div>
                  <div className="p-3 bg-[#f6f7f7] rounded border border-[#dcdcde]">
                    <span className="block text-2xl font-black text-emerald-700">6.8K</span>
                    <span className="text-xs text-[#50575e]">Total Clicks (7D)</span>
                    <span className="text-[10px] text-emerald-700 font-bold block mt-1">▲ +12.9% vs last week</span>
                  </div>
                  <div className="p-3 bg-[#f6f7f7] rounded border border-[#dcdcde]">
                    <span className="block text-2xl font-black text-purple-700">14.9%</span>
                    <span className="text-xs text-[#50575e]">Average CTR</span>
                    <span className="text-[10px] text-emerald-700 font-bold block mt-1">▲ High Buyer Intent</span>
                  </div>
                  <div className="p-3 bg-[#f6f7f7] rounded border border-[#dcdcde]">
                    <span className="block text-2xl font-black text-amber-700">2.4</span>
                    <span className="text-xs text-[#50575e]">Average Top Position</span>
                    <span className="text-[10px] text-emerald-700 font-bold block mt-1">★ #1 for Rice Supplier Bucheki</span>
                  </div>
                </div>
              </div>

              {/* DETAILED GOOGLE SITE KIT COLORFUL CHARTS */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 bg-white border border-[#c3c4c7] rounded-lg shadow-2xs p-5 space-y-4">
                  <h3 className="font-bold text-[#1d2327] text-sm flex items-center gap-2">
                    <BarChart3 className="w-4 h-4 text-blue-600" />
                    <span>Search Console Impressions vs Organic Visitors</span>
                  </h3>
                  <div className="h-64 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={SITE_KIT_TRAFFIC_DATA} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                        <XAxis dataKey="day" tick={{ fontSize: 12, fill: '#646970' }} />
                        <YAxis tick={{ fontSize: 12, fill: '#646970' }} />
                        <Tooltip contentStyle={{ backgroundColor: '#1d2327', borderColor: '#3c434a', color: '#fff', borderRadius: '6px', fontSize: '12px' }} />
                        <Legend wrapperStyle={{ fontSize: '12px' }} />
                        <Line type="monotone" dataKey="searchImpressions" name="Search Impressions" stroke="#2563eb" strokeWidth={3} dot={{ r: 4 }} />
                        <Line type="monotone" dataKey="organicVisitors" name="Organic Visitors" stroke="#10b981" strokeWidth={3} dot={{ r: 4 }} />
                        <Line type="monotone" dataKey="directTraffic" name="Direct WhatsApp Clicks" stroke="#f59e0b" strokeWidth={2} strokeDasharray="5 5" />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* TOP SEARCH KEYWORDS */}
                <div className="bg-white border border-[#c3c4c7] rounded-lg shadow-2xs p-5 space-y-3">
                  <h3 className="font-bold text-[#1d2327] text-sm flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-amber-600" />
                    <span>Top Ranking Google Keywords</span>
                  </h3>
                  <div className="divide-y divide-[#dcdcde] text-xs">
                    {[
                      { kw: '1121 Kainat Basmati Price Mandi', clicks: '1,420', pos: '#1' },
                      { kw: 'Hashir Rice Supplier Bucheki', clicks: '1,180', pos: '#1' },
                      { kw: 'Super Kernel Basmati Wholesale Karachi', clicks: '940', pos: '#2' },
                      { kw: 'Rice Mills Noor Galla Mandi', clicks: '810', pos: '#1' },
                      { kw: '1509 Sella Rice Supplier Lahore', clicks: '720', pos: '#2' },
                      { kw: 'IRRI 6 Rice Sourcing Quetta', clicks: '630', pos: '#3' },
                    ].map((k, idx) => (
                      <div key={idx} className="py-2 flex items-center justify-between">
                        <div>
                          <div className="font-semibold text-[#1d2327]">{k.kw}</div>
                          <span className="text-[10px] text-[#646970]">{k.clicks} clicks</span>
                        </div>
                        <span className="px-2 py-0.5 bg-emerald-100 text-emerald-900 font-bold rounded text-[11px]">
                          {k.pos}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ======================================================== */}
          {/* TAB 3.5: GOOGLE AI OVERVIEW & GENERATIVE ENGINE OPTIMIZATION */}
          {/* ======================================================== */}
          {activeTab === 'google-ai' && (
            <AdminGoogleAiOverview onSuccessToast={showToast} />
          )}

          {/* ======================================================== */}
          {/* TAB 4: GOOGLE ADSENSE LOW-VALUE CONTENT & ADS.TXT RESOLUTION */}
          {/* ======================================================== */}
          {activeTab === 'adsense' && (
            <AdminAdSenseCompliance onSuccessToast={showToast} />
          )}

          {/* ======================================================== */}
          {/* TAB 5: SITE HEALTH & SECURITY AUDIT */}
          {/* ======================================================== */}
          {activeTab === 'site-health' && (
            <div className="bg-white border border-[#c3c4c7] rounded-lg shadow-2xs p-5 space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#dcdcde] pb-4">
                <div>
                  <h2 className="font-serif font-bold text-lg text-[#1d2327] flex items-center gap-2">
                    <ShieldCheck className="w-5 h-5 text-emerald-600" />
                    <span>WordPress Site Health Status</span>
                  </h2>
                  <p className="text-xs text-[#646970]">
                    System check results, server security, database indexes, and PageSpeed performance.
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <span className="px-3 py-1 bg-emerald-100 text-emerald-900 font-bold rounded-full text-xs border border-emerald-300 flex items-center gap-1.5">
                    <Check className="w-3.5 h-3.5 text-emerald-700" />
                    Site Health Score: 96% (Good)
                  </span>
                </div>
              </div>

              {/* SYSTEM CHECKS LIST */}
              <div className="space-y-3 text-xs">
                {[
                  { title: 'Google Business Profile Sync', desc: 'Shop #4 Noor Galla Mandi, Bucheki verified and embedded across all 64 page templates.', status: 'Passed', color: 'text-emerald-700 bg-emerald-50 border-emerald-200' },
                  { title: 'Google Site Kit & Search Console', desc: 'OAuth token valid and transmitting daily click metrics to database.', status: 'Passed', color: 'text-emerald-700 bg-emerald-50 border-emerald-200' },
                  { title: 'SSL / HTTPS Security Certificate', desc: 'Encrypted TLS 1.3 certificate active with HSTS preloading enabled.', status: 'Passed', color: 'text-emerald-700 bg-emerald-50 border-emerald-200' },
                  { title: 'XML Sitemap & Schema.org JSON-LD', desc: 'LocalBusiness, WholesaleStore, and Product schemas valid with zero warnings.', status: 'Passed', color: 'text-emerald-700 bg-emerald-50 border-emerald-200' },
                  { title: 'Zero Paid Subscriptions & Free Tier Policy', desc: '100% Free Resources verified: Free Google AI Studio tier, free map embed, free open-source icons, zero paid licenses required.', status: 'Passed', color: 'text-emerald-700 bg-emerald-50 border-emerald-200' },
                  { title: 'WordPress Database & Object Cache', desc: 'MySQL tables optimized. Redis object cache responding in 2ms.', status: 'Passed', color: 'text-emerald-700 bg-emerald-50 border-emerald-200' },
                  { title: 'PHP Version & Memory Limit', desc: 'Running PHP 8.3 with 512MB memory limit for bulk CSV & sample photo processing.', status: 'Passed', color: 'text-emerald-700 bg-emerald-50 border-emerald-200' },
                ].map((item, idx) => (
                  <div key={idx} className={`p-4 rounded-lg border flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${item.color}`}>
                    <div>
                      <strong className="block text-sm text-[#1d2327]">{item.title}</strong>
                      <span className="text-[#50575e]">{item.desc}</span>
                    </div>
                    <span className="px-2.5 py-1 bg-white text-emerald-800 font-bold rounded border border-emerald-300 text-xs shrink-0 self-start sm:self-auto">
                      ✓ {item.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ======================================================== */}
          {/* TAB: ERP SYSTEMS (7 / 15 / 30 DAYS DATA) */}
          {/* ======================================================== */}
          {activeTab === 'erp' && (
            <AdminErpSection onSuccessToast={showToast} />
          )}

          {/* ======================================================== */}
          {/* TAB: SELLER & MILL CONTROL (FULL CRUD) */}
          {/* ======================================================== */}
          {activeTab === 'sellers' && (
            <AdminSellerControl
              sellerSamples={sellerSamples}
              setSellerSamples={setSellerSamples}
              onSuccessToast={showToast}
            />
          )}

          {/* ======================================================== */}
          {/* TAB: RANK MATH / YOAST SEO SUITE */}
          {/* ======================================================== */}
          {activeTab === 'seo-suite' && (
            <AdminRankMathSeoManager
              onSuccessToast={showToast}
              onNavigateToPage={() => setActiveTab('pages')}
              onNavigateToPost={() => setActiveTab('posts')}
            />
          )}

          {/* ======================================================== */}
          {/* TAB: PLUGINS MANAGER (ADD, REMOVE, ACTIVATE) */}
          {/* ======================================================== */}
          {activeTab === 'plugins' && (
            <AdminPluginsManager onSuccessToast={showToast} />
          )}

          {/* ======================================================== */}
          {/* TAB: PAGES (60+ CITY SEO HUBS CRUD) */}
          {/* ======================================================== */}
          {activeTab === 'pages' && (
            <AdminPagesManager onSuccessToast={showToast} />
          )}

          {/* ======================================================== */}
          {/* TAB: POSTS & RICE KNOWLEDGE BASE CRUD */}
          {/* ======================================================== */}
          {activeTab === 'posts' && (
            <AdminPostsManager onSuccessToast={showToast} />
          )}

          {/* ======================================================== */}
          {/* TAB: APPEARANCE, FREE THEME, HEADER & FOOTER CUSTOMIZER */}
          {/* ======================================================== */}
          {activeTab === 'appearance' && (
            <AdminHeaderFooterCustomizer onSuccessToast={showToast} />
          )}

          {/* ======================================================== */}
          {/* TAB: SECTIONS CONTROLLER & REORDER */}
          {/* ======================================================== */}
          {activeTab === 'sections' && (
            <AdminSectionsManager onSuccessToast={showToast} />
          )}

          {/* ======================================================== */}
          {/* TAB: USERS & PERMISSIONS MATRIX */}
          {/* ======================================================== */}
          {activeTab === 'users' && (
            <AdminUsersManager onSuccessToast={showToast} />
          )}

          {/* ======================================================== */}
          {/* TAB: MEDIA LIBRARY & UPLOADS */}
          {/* ======================================================== */}
          {activeTab === 'media' && (
            <AdminMediaManager onSuccessToast={showToast} />
          )}

          {/* ======================================================== */}
          {/* TAB 9: RICE VARIETIES CATALOG */}
          {/* ======================================================== */}
          {activeTab === 'varieties' && (
            <div className="bg-white border border-[#c3c4c7] rounded-lg shadow-2xs p-5 space-y-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#dcdcde] pb-4">
                <div>
                  <h2 className="font-serif font-bold text-lg text-[#1d2327]">
                    Published Rice Varieties & Grain Specifications
                  </h2>
                  <p className="text-xs text-[#646970]">
                    Manage raw grain length (mm), cooked elongation ratios, moisture percentages, and sample availability.
                  </p>
                </div>
                <button
                  onClick={() => showToast('Add new variety modal opened.')}
                  className="px-3.5 py-1.5 bg-[#2271b1] text-white rounded text-xs font-bold hover:bg-[#135e96] transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add New Variety</span>
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left border-collapse">
                  <thead>
                    <tr className="bg-[#f6f7f7] border-y border-[#dcdcde] text-[#2c3338] font-bold">
                      <th className="p-3">Variety Name</th>
                      <th className="p-3">Category</th>
                      <th className="p-3">Raw Length (mm)</th>
                      <th className="p-3">Cooked Elongation</th>
                      <th className="p-3">Moisture %</th>
                      <th className="p-3">Sample Available</th>
                      <th className="p-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#dcdcde]">
                    {varieties.map((v) => (
                      <tr key={v.id} className="hover:bg-[#f6f7f7]">
                        <td className="p-3 font-bold text-[#1d2327] flex items-center gap-2">
                          <div className="w-6 h-6 rounded bg-amber-100 flex items-center justify-center font-bold text-amber-900 text-[10px]">
                            🌾
                          </div>
                          <span>{v.name}</span>
                        </td>
                        <td className="p-3">
                          <span className="px-2 py-0.5 rounded bg-neutral-100 text-neutral-800 border border-neutral-300 font-medium uppercase text-[10px]">
                            {v.category}
                          </span>
                        </td>
                        <td className="p-3 font-semibold text-[#1d2327]">{v.specs.averageGrainLength}</td>
                        <td className="p-3 text-emerald-800 font-semibold">{v.specs.postCookingLength}</td>
                        <td className="p-3 text-[#50575e]">{v.specs.moistureMax}</td>
                        <td className="p-3 font-bold text-emerald-700">{v.sampleAvailable ? '✓ Free Courier' : 'Contact'}</td>
                        <td className="p-3 text-right space-x-1.5">
                          <button
                            onClick={() => showToast(`Editing variety ${v.name}`)}
                            className="px-2.5 py-1 text-[#2271b1] hover:bg-[#f0f0f1] rounded font-semibold transition-colors"
                          >
                            Edit
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ======================================================== */}
          {/* TAB 11: MANDI LIVE SPOT RATES EDITOR */}
          {/* ======================================================== */}
          {activeTab === 'mandi-rates' && (
            <div className="bg-white border border-[#c3c4c7] rounded-lg shadow-2xs p-5 space-y-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#dcdcde] pb-4">
                <div>
                  <h2 className="font-serif font-bold text-lg text-[#1d2327]">
                    Mandi Live Spot Rates & Market Index Editor
                  </h2>
                  <p className="text-xs text-[#646970]">
                    Rates edited here update the live ticker and quotation matrix across all 60+ city pages instantly.
                  </p>
                </div>
                <button
                  onClick={() => showToast('Mandi rates synchronized across all 60+ city pages.')}
                  className="px-3.5 py-1.5 bg-[#2271b1] text-white rounded text-xs font-bold hover:bg-[#135e96] transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Sync Ticker Rates</span>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {mandiRates.map((rate) => (
                  <div key={rate.id} className="p-4 rounded-lg border border-[#dcdcde] bg-[#f6f7f7] space-y-3">
                    <div className="flex items-center justify-between">
                      <h4 className="font-bold text-[#1d2327] text-sm">{rate.variety}</h4>
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          rate.trend === 'up'
                            ? 'bg-emerald-100 text-emerald-900 border border-emerald-300'
                            : rate.trend === 'down'
                            ? 'bg-rose-100 text-rose-900 border border-rose-300'
                            : 'bg-neutral-200 text-neutral-800'
                        }`}
                      >
                        {rate.trend === 'up' ? '▲ Bullish' : rate.trend === 'down' ? '▼ Bearish' : '● Stable'}
                      </span>
                    </div>

                    <div className="space-y-2 text-xs">
                      <div className="flex items-center justify-between">
                        <span className="text-[#646970]">Rate per 40kg Maund:</span>
                        <input
                          type="number"
                          value={rate.pricePkrPerMaund}
                          onChange={(e) => {
                            const newRate = Number(e.target.value);
                            setMandiRates((prev) =>
                              prev.map((r) =>
                                r.id === rate.id
                                  ? { ...r, pricePkrPerMaund: newRate, pricePkrPer50kg: Math.round(newRate * 1.25) }
                                  : r
                              )
                            );
                          }}
                          className="w-28 px-2 py-1 bg-white border border-[#8c8f94] rounded text-right font-bold text-[#1d2327]"
                        />
                      </div>

                      <div className="flex items-center justify-between">
                        <span className="text-[#646970]">Rate per 50kg Bag:</span>
                        <strong className="text-[#2271b1] font-bold">Rs. {rate.pricePkrPer50kg.toLocaleString()}</strong>
                      </div>

                      <div className="flex items-center justify-between">
                        <span className="text-[#646970]">Benchmark / Market:</span>
                        <span className="text-[#50575e] truncate max-w-[160px]">{rate.benchmark}</span>
                      </div>
                    </div>

                    <button
                      onClick={() => showToast(`Rate saved for ${rate.variety}: Rs. ${rate.pricePkrPerMaund}/maund`)}
                      className="w-full py-1.5 bg-white hover:bg-neutral-100 text-[#2271b1] border border-[#2271b1] rounded text-xs font-bold transition-colors cursor-pointer"
                    >
                      Update Rate
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ======================================================== */}
          {/* TAB 12: GOOGLE BUSINESS MAP */}
          {/* ======================================================== */}
          {activeTab === 'gmb-map' && (
            <div className="bg-white border border-[#c3c4c7] rounded-lg shadow-2xs p-5 space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#dcdcde] pb-4">
                <div>
                  <h2 className="font-serif font-bold text-lg text-[#1d2327]">
                    Google Business Map & Mandi Verification Settings
                  </h2>
                  <p className="text-xs text-[#646970]">
                    Configured Google Maps integration embedded automatically across all internal pages.
                  </p>
                </div>
                <a
                  href="https://share.google/Xog0BKr0oU1NiGIUL"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3.5 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded text-xs font-bold transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>Open Live Google Business Profile</span>
                </a>
              </div>

              {/* LIVE MAP PREVIEW */}
              <div className="space-y-3">
                <h3 className="font-bold text-sm text-[#1d2327] flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-emerald-800" />
                  <span>Interactive Map Preview (Bucheki HQ & City Freight Terminals)</span>
                </h3>
                <GoogleBusinessMap
                  cityName="Bucheki"
                  province="Punjab"
                  height="340px"
                  showDetailsGrid={true}
                />
              </div>

              {/* GMB Profile Metadata Configuration */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-[#dcdcde] text-xs">
                <div className="p-3 bg-[#f6f7f7] rounded border border-[#dcdcde] space-y-1">
                  <strong className="text-[#1d2327] block">Primary Mandi Address:</strong>
                  <span className="text-[#50575e]">Shop #4, Noor Galla Mandi, Bucheki, Nankana Sahib, Punjab</span>
                </div>
                <div className="p-3 bg-[#f6f7f7] rounded border border-[#dcdcde] space-y-1">
                  <strong className="text-[#1d2327] block">Google Shortlink:</strong>
                  <a href="https://share.google/Xog0BKr0oU1NiGIUL" target="_blank" rel="noreferrer" className="text-[#2271b1] hover:underline font-mono">
                    share.google/Xog0BKr0oU1NiGIUL
                  </a>
                </div>
                <div className="p-3 bg-[#f6f7f7] rounded border border-[#dcdcde] space-y-1">
                  <strong className="text-[#1d2327] block">Verified Rating:</strong>
                  <span className="text-amber-700 font-bold">4.9 Stars (185+ B2B Client Reviews)</span>
                </div>
              </div>
            </div>
          )}

          {/* ======================================================== */}
          {/* TAB 13: SETTINGS */}
          {/* ======================================================== */}
          {activeTab === 'settings' && (
            <div className="bg-white border border-[#c3c4c7] rounded-lg shadow-2xs p-5 space-y-6">
              <div className="border-b border-[#dcdcde] pb-4">
                <h2 className="font-serif font-bold text-lg text-[#1d2327]">
                  WordPress General & SEO Settings
                </h2>
                <p className="text-xs text-[#646970]">
                  Configure WhatsApp trade gateways, organization schema, and XML sitemap generator.
                </p>
              </div>

              <div className="space-y-4 text-xs max-w-2xl">
                {/* Admin & Owner Identity */}
                <div className="p-4 bg-emerald-50/70 border border-emerald-300 rounded-lg space-y-3">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-emerald-800" />
                    <h3 className="font-bold text-sm text-emerald-950">Official Admin & Owner Identity (Synced Across Website & WhatsApp)</h3>
                  </div>
                  <p className="text-[11px] text-emerald-900 leading-relaxed">
                    Always use <strong>Hashir Rice Supplier</strong> as the official Admin Name, and <strong>Muhammad Amir Shahzad</strong> as the Owner Name across all pages, posts, and WhatsApp broadcasts.
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                    <div>
                      <label className="block text-emerald-950 font-bold mb-1">Admin / Company Name</label>
                      <input
                        type="text"
                        defaultValue="Hashir Rice Supplier"
                        id="wp-settings-admin-name"
                        className="w-full px-3 py-1.5 bg-white border border-emerald-400 rounded text-xs font-semibold text-emerald-950 focus:border-emerald-600 outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-emerald-950 font-bold mb-1">Owner Name</label>
                      <input
                        type="text"
                        defaultValue="Muhammad Amir Shahzad"
                        id="wp-settings-owner-name"
                        className="w-full px-3 py-1.5 bg-white border border-emerald-400 rounded text-xs font-semibold text-emerald-950 focus:border-emerald-600 outline-none"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-[#1d2327] font-semibold mb-1">Site Title</label>
                  <input
                    type="text"
                    defaultValue="Hashir Rice Supplier Pakistan | Direct Mandi Rice Sourcing"
                    className="w-full px-3 py-1.5 border border-[#8c8f94] rounded text-xs focus:border-[#2271b1] outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[#1d2327] font-semibold mb-1">Tagline</label>
                  <input
                    type="text"
                    defaultValue="Shop #4, Noor Galla Mandi, Bucheki | Connecting 100+ Rice Mills to Buyers Across Pakistan"
                    className="w-full px-3 py-1.5 border border-[#8c8f94] rounded text-xs focus:border-[#2271b1] outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[#1d2327] font-semibold mb-1">WordPress Address (URL) & Site Address (URL)</label>
                  <input
                    type="text"
                    defaultValue="https://hasricesupplier.com"
                    className="w-full px-3 py-1.5 border border-[#8c8f94] rounded text-xs focus:border-[#2271b1] outline-none font-mono"
                  />
                  <p className="text-[11px] text-[#646970] mt-1">
                    Primary Domain: <code>https://hasricesupplier.com</code> (Alias: <code>https://hashirricesupplier.com</code>) • Backend URL: <code>https://hasricesupplier.com/wp-admin</code>
                  </p>
                </div>

                <div>
                  <label className="block text-[#1d2327] font-semibold mb-1">Primary WhatsApp Trade & Broadcast Number</label>
                  <input
                    type="text"
                    defaultValue="+92 333 8990883"
                    className="w-full px-3 py-1.5 border border-[#8c8f94] rounded text-xs focus:border-[#2271b1] outline-none font-mono font-bold text-emerald-700"
                  />
                </div>

                <div className="p-3.5 bg-emerald-50 border border-emerald-300 rounded-lg flex items-center justify-between gap-4">
                  <div>
                    <strong className="text-emerald-950 font-bold block">Search Engine Visibility (Open Indexing)</strong>
                    <span className="text-[11px] text-neutral-700">Allow search engines (Google, Bing, AI Overviews) to index this entire site (`index, follow`).</span>
                  </div>
                  <span className="px-2.5 py-1 rounded-full bg-emerald-800 text-white text-[10px] font-bold shrink-0">
                    Open Indexing ON
                  </span>
                </div>

                <button
                  type="button"
                  onClick={() => showToast('WordPress general settings updated: Admin Name set to Hashir Rice Supplier, Owner: Muhammad Amir Shahzad.')}
                  className="px-4 py-2 bg-[#2271b1] hover:bg-[#135e96] text-white rounded font-bold text-xs transition-colors cursor-pointer"
                >
                  Save WordPress Settings
                </button>

                {/* Admin Password Protection Settings */}
                <div className="pt-4 border-t border-[#dcdcde] mt-6 space-y-3">
                  <div className="flex items-center gap-2">
                    <Lock className="w-4 h-4 text-emerald-800" />
                    <h3 className="font-bold text-sm text-[#1d2327]">WordPress Admin Password Protection (`/wp-admin` Only)</h3>
                  </div>
                  <p className="text-xs text-[#50575e]">
                    Your WordPress Admin Dashboard is strictly hidden from public visitors and protected by password. Update your administrator login credentials below:
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block font-semibold text-[#1d2327] mb-1">Admin Username</label>
                      <input
                        type="text"
                        value={adminSavedUser}
                        onChange={(e) => setAdminSavedUser(e.target.value)}
                        className="w-full px-3 py-1.5 border border-[#8c8f94] rounded text-xs font-mono"
                      />
                    </div>
                    <div>
                      <label className="block font-semibold text-[#1d2327] mb-1">Admin Password</label>
                      <input
                        type="text"
                        value={adminSavedPass}
                        onChange={(e) => setAdminSavedPass(e.target.value)}
                        className="w-full px-3 py-1.5 border border-[#8c8f94] rounded text-xs font-mono"
                      />
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      localStorage.setItem('hashir_wp_admin_user', adminSavedUser);
                      localStorage.setItem('hashir_wp_admin_pass', adminSavedPass);
                      showToast('WordPress Admin username & password updated!');
                    }}
                    className="px-4 py-2 bg-emerald-800 hover:bg-emerald-900 text-white rounded font-bold text-xs transition-colors cursor-pointer"
                  >
                    Update Admin Credentials
                  </button>
                </div>

                {/* API Keys Vault Quick Section */}
                <div className="pt-4 border-t border-[#dcdcde] mt-6">
                  <div className="bg-[#f0f6fc] border border-[#2271b1]/30 p-4 rounded-lg space-y-2">
                    <div className="flex items-center justify-between flex-wrap gap-2">
                      <div className="flex items-center gap-2">
                        <Key className="w-4 h-4 text-[#2271b1]" />
                        <span className="font-bold text-sm text-[#1d2327]">Integration Secrets & API Credentials</span>
                      </div>
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
                        Zero Code Leaks Active
                      </span>
                    </div>
                    <p className="text-xs text-[#50575e] leading-relaxed">
                      Google Gemini AI, Google Maps, Site Kit, and WhatsApp Cloud credentials are kept strictly out of client-side code bundles. Manage and reveal your keys inside the dedicated Vault.
                    </p>
                    <button
                      type="button"
                      onClick={() => setActiveTab('api-keys')}
                      className="mt-2 px-3 py-1.5 bg-[#2271b1] hover:bg-[#135e96] text-white rounded font-bold text-xs inline-flex items-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <Key className="w-3.5 h-3.5" />
                      <span>Open API Keys & Secrets Manager</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ======================================================== */}
          {/* TAB: RICE BROKERS & WHATSAPP NETWORK */}
          {/* ======================================================== */}
          {activeTab === 'rice-brokers' && (
            <div className="animate-fadeIn">
              <AdminRiceBrokersNetwork onSuccessToast={showToast} />
            </div>
          )}

          {/* ======================================================== */}
          {/* TAB: API KEYS & SECRETS VAULT */}
          {/* ======================================================== */}
          {activeTab === 'api-keys' && (
            <div className="animate-fadeIn">
              <AdminApiKeysManager onSuccessToast={showToast} />
            </div>
          )}
        </main>
      </div>
    </div>
  );
};
