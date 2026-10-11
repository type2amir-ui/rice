export interface RiceVariety {
  id: string;
  name: string;
  slug: string;
  category: 'basmati' | 'long-grain' | 'broken' | 'specialty';
  tagline: string;
  description: string;
  imageUrl: string;
  specs: {
    averageGrainLength: string; // e.g. "8.35 mm - 8.40 mm"
    postCookingLength: string; // e.g. "18 mm - 22 mm"
    moistureMax: string; // e.g. "12.0% - 13.0%"
    brokenMax: string; // e.g. "1.0% - 2.0%"
    chalkyGrains: string; // e.g. "2.0% max"
    purity: string; // e.g. "95% minimum"
    aroma: string; // e.g. "High", "Medium", "Mild", "Natural"
    cropYear: string;
    polish: 'Double Silky Polished' | 'White Polished' | 'Natural' | 'Sella/Parboiled' | 'White Polished / Parboiled' | 'Well Cleaned / Destoned' | string;
  };
  suitableFor: string[];
  packagingOptions: string[];
  popularRegions: string[];
  minOrderQuantity: string;
  sampleAvailable: boolean;
}

export interface CityData {
  name: string;
  slug: string;
  province: 'Punjab' | 'Sindh' | 'Khyber Pakhtunkhwa' | 'Balochistan' | 'Islamabad Capital Territory';
  majorMarkets: string[];
  primaryDemand: string[];
  typicalLogisticsLeadTime: string;
  description: string;
  buyerHighlights: string;
  popularVarieties: string[];
  seoTitle?: string;
  metaDescription?: string;
  targetKeywords?: {
    primary: string[];
    secondary: string[];
  };
  inDepthSections?: {
    heading: string;
    content: string;
  }[];
  culinaryProfile?: string;
  wholesaleMarketOverview?: string;
  logisticsAndFreight?: string;
  qualityAssuranceGuide?: string;
  localFaq: {
    q: string;
    a: string;
  }[];
}

export interface FaqItem {
  id: string;
  category: 'business-model' | 'varieties' | 'samples' | 'logistics' | 'pricing';
  question: string;
  answer: string;
}

export interface QuoteRequest {
  fullName: string;
  companyName: string;
  phoneOrWhatsApp: string;
  email: string;
  city: string;
  variety: string;
  quantity: string;
  unit: 'Tons' | 'Bags (50kg)' | 'Bags (25kg)' | 'Bags (10kg)';
  packagingType: string;
  deliveryAddress: string;
  targetPricePerKgOrMund?: string;
  additionalNotes?: string;
}

export interface SampleRequest {
  fullName: string;
  companyName: string;
  businessType: string;
  phoneOrWhatsApp: string;
  email: string;
  deliveryCity: string;
  completeAddress: string;
  varietyRequired: string;
  targetVolume: string;
  specificSpecsNotes: string;
}

export interface RiceExchangeRate {
  id: string;
  symbol: string;
  name: string;
  variety: string;
  origin: string;
  priceUsdPerMt: number;
  pricePkrPer50kg: number;
  pricePkrPerMaund: number;
  change24h: number;
  high24hUsd: number;
  low24hUsd: number;
  trend: 'up' | 'down' | 'neutral';
  sparkline: number[];
  category: 'pakistan-export' | 'domestic-mandi' | 'international';
  marketStatus: 'Active' | 'Firm' | 'Softening' | 'Bullish';
  benchmark: string;
}

export interface CustomerReview {
  id: string;
  authorName: string;
  businessName: string;
  buyerType: 'Grain Wholesaler' | 'Restaurant / Hotelier' | 'Catering Contractor' | 'Rice Exporter' | 'Supermarket / Retailer';
  city: string;
  rating: number;
  cookingRating?: number;
  varietyPurchased: string;
  reviewTitle: string;
  comment: string;
  date: string;
  verified: boolean;
  source: 'google' | 'direct';
  avatarInitials: string;
  googleProfileUrl?: string;
}

export interface InternationalNewsArticle {
  id: string;
  title: string;
  slug: string;
  summary: string;
  content: string[];
  category: 'global-trade' | 'export-policy' | 'freight-logistics' | 'market-prices' | 'regulatory';
  publishedDate: string;
  source: string;
  readTime: string;
  region: 'Middle East & GCC' | 'European Union' | 'East & West Africa' | 'South East Asia' | 'Global Markets';
  impactLevel: 'Bullish' | 'Bearish' | 'High Impact' | 'Market Neutral';
  imageUrl: string;
  tags: string[];
  keyHighlights: string[];
}

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  category: 'Sourcing Guide' | 'Market Analysis' | 'Culinary Science' | 'Storage & Logistics' | 'Commodity Economics' | string;
  author: {
    name: string;
    role: string;
    avatar: string;
  };
  publishedDate: string;
  readTime: string;
  imageUrl: string;
  featuredImageCaption?: string;
  tags: string[];
  keyTakeaways: string[];
  contentSections: {
    heading: string;
    paragraphs: string[];
    subPoints?: string[];
    imageUrl?: string;
    imageCaption?: string;
  }[];
  bodyHtml?: string;
  rawContent?: string;
  status?: 'publish' | 'draft';
  seoTitle?: string;
  metaDescription?: string;
  focusKeyword?: string;
  canonicalUrl?: string;
  schemaType?: string;
  ogTitle?: string;
  ogDescription?: string;
}

export interface WordPressPage {
  id: string;
  title: string;
  slug: string;
  type: 'standard' | 'city-hub' | 'commercial' | 'custom';
  province?: string;
  status: 'Published' | 'Draft' | 'Trash';
  lastModified: string;
  seoTitle?: string;
  metaDescription?: string;
  focusKeyword?: string;
  canonicalUrl?: string;
  schemaType?: string;
  ogTitle?: string;
  ogDescription?: string;
  template?: 'default' | 'full-width' | 'landing';
  imageUrl?: string;
  featuredImageCaption?: string;
  excerpt?: string;
  keyTakeaways?: string[];
  contentSections: {
    heading: string;
    paragraphs: string[];
    subPoints?: string[];
    imageUrl?: string;
    imageCaption?: string;
  }[];
  rawContent?: string;
  author?: {
    name: string;
    role: string;
    avatar?: string;
  };
}

export type PageItem = WordPressPage;
export type WordPressPost = BlogPost;

export interface CommercialPageData {
  id: string;
  slug: string;
  cityName?: 'Lahore' | 'Karachi' | 'Peshawar' | 'Quetta' | 'Hyderabad' | 'Faisalabad';
  title: string;
  h1Heading: string;
  metaTitle: string;
  metaDescription: string;
  varietyType: '1121 Sella Basmati' | '1121 Steam Basmati' | '1121 White Rice';
  processingType: 'Sella / Parboiled' | 'Steam Polished' | 'Double Silky Polished Raw';
  targetSegment: 'Restaurants' | 'Catering' | 'Hotels' | 'Mess & Hostels';
  tagline: string;
  summaryBadge: string;
  heroExcerpt: string;
  grainLengthRaw: string;
  grainLengthCooked: string;
  yieldRatio: string;
  moisturePercentage: string;
  brokenPercentage: string;
  agingDuration: string;
  cookingMethod: string;
  holdingTime: string;
  recommendedDishes: string[];
  targetHubsInCity?: string[];
  targetHubsInLahore?: string[];
  targetHubsInKarachi?: string[];
  targetHubsInPeshawar?: string[];
  targetHubsInQuetta?: string[];
  targetHubsInHyderabad?: string[];
  targetHubsInFaisalabad?: string[];
  keyHighlights: string[];
  inDepthSections: {
    heading: string;
    paragraphs: string[];
    bulletPoints?: string[];
  }[];
  specifications: {
    label: string;
    value: string;
  }[];
  culinaryPhysics: {
    title: string;
    content: string;
  };
  logisticsOverview: string;
  faqs: {
    question: string;
    answer: string;
  }[];
}

export type CommercialLahorePageData = CommercialPageData;
export type CommercialKarachiPageData = CommercialPageData;
export type CommercialPeshawarPageData = CommercialPageData;
export type CommercialQuettaPageData = CommercialPageData;
export type CommercialHyderabadPageData = CommercialPageData;
export type CommercialFaisalabadPageData = CommercialPageData;

export interface SellerUser {
  id: string;
  fullName: string;
  email: string;
  avatarUrl?: string;
  companyName: string;
  mandiLocation: string;
  city: string;
  whatsappNumber: string;
  isVerified: boolean;
  role: 'miller' | 'commission-agent' | 'broker' | 'exporter';
  joinedDate: string;
}

export type RiceVarietyCategory =
  | '1121-kainat'
  | 'super-kernel'
  | '1509-basmati'
  | 'sella-parboiled'
  | 'pk-386'
  | 'irri-6'
  | 'irri-9'
  | 'c9-d98'
  | 'basmati-515'
  | 'broken-tota'
  | 'brown-specialty'
  | 'basmati'
  | 'long-grain'
  | 'broken'
  | 'specialty'
  | 'sella';

export interface SellerSample {
  id: string;
  sellerId: string;
  sellerName: string;
  sellerCompany: string;
  sellerMandiLocation: string;
  sellerCity: string;
  sellerWhatsApp: string;
  sellerEmail: string;
  sellerAvatar?: string;
  isVerifiedSeller: boolean;
  
  varietyName: string;
  varietyCategory: RiceVarietyCategory | string;
  processingGrade: string;
  
  sampleImageUrl: string;
  sampleImages?: string[];
  
  // Stock Information
  totalLotSize: string;
  remainingStock: string;
  remainingStockNumber: number;
  stockUnit: 'Tons' | 'Bags (50kg)' | 'Bags (25kg)' | 'Maunds (40kg)';
  stockStatus: 'available' | 'low-stock' | 'sold-out';
  
  // Grain Specs
  averageGrainLength: string;
  cookedLength: string;
  moisturePercent: string;
  brokenPercent: string;
  cropYear: string;
  
  // Pricing & Terms
  askingRatePkr: string;
  priceType: 'Ex-Mill' | 'FOR Dispatch' | 'Mandi Spot';
  minimumOrder: string;
  
  sampleCourierAvailable: boolean;
  labReportAvailable: boolean;
  description: string;
  createdDate: string;
  viewsCount?: number;
  inquiryCount?: number;
}

export interface PakistanRiceBroker {
  id: string;
  name: string;
  firmName: string;
  city: string;
  mandi: string;
  province: string;
  phone: string;
  whatsapp: string; // format: +923001234567
  role: 'Commission Agent (Arhti)' | 'Independent Rice Broker' | 'Ex-Mill Sheller Broker' | 'Export Procurement Agent' | 'Paddy Commission Broker' | 'Wholesale Mandi Dealer';
  specialties: string[];
  experienceYears: number;
  dailyCapacityTons: number;
  isVerified: boolean;
  isEnrolledInBroadcastGroup: boolean;
  status: 'Active' | 'VIP Broker' | 'Sheller Partner';
  notes?: string;
}

export interface WhatsAppBroadcastMessage {
  id: string;
  senderName: string;
  senderPhone: string; // "+92 333 8990883"
  timestamp: string;
  text: string;
  messageType: 'text' | 'photo' | 'voice_note' | 'document';
  photoUrl?: string;
  photoCaption?: string;
  voiceNoteUrl?: string;
  voiceNoteDuration?: string;
  targetAudience: string;
  recipientCount: number;
  replyToPhone: string; // "+92 333 8990883"
}


