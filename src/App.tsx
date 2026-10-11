import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { HeroSection } from './components/HeroSection';
import { BusinessModelSection } from './components/BusinessModelSection';
import { ProductsSection } from './components/ProductsSection';
import { ProductDetailModal } from './components/ProductDetailModal';
import { SourcingWorkflowSection } from './components/SourcingWorkflowSection';
import { WhoWeServeSection } from './components/WhoWeServeSection';
import { QuoteEstimator } from './components/QuoteEstimator';
import { PakistanLocationsSection } from './components/PakistanLocationsSection';
import { CityDedicatedPage } from './components/CityDedicatedPage';
import { AboutUsSection } from './components/AboutUsSection';
import { AboutUsPage } from './components/AboutUsPage';
import { PrivacyPolicyPage } from './components/PrivacyPolicyPage';
import { TermsAndConditionsPage } from './components/TermsAndConditionsPage';
import { FaqSection } from './components/FaqSection';
import { ContactSection } from './components/ContactSection';
import { FloatingWhatsApp } from './components/FloatingWhatsApp';
import { QuoteModal } from './components/QuoteModal';
import { SampleRequestModal } from './components/SampleRequestModal';
import { SeoSchema } from './components/SeoSchema';
import { RiceExchangeTicker } from './components/RiceExchangeTicker';
import { GoogleAiOverviewPage } from './components/GoogleAiOverviewPage';
import { ReviewsAndRatingsSection } from './components/ReviewsAndRatingsSection';
import { RiceTradingGuideSection } from './components/RiceTradingGuideSection';
import { InternationalNewsSection } from './components/InternationalNewsSection';
import { BlogSection, convertWpRestPostToBlogPost } from './components/BlogSection';
import { WordPressSinglePostView } from './components/WordPressSinglePostView';
import { BLOG_POSTS_DATA } from './data/blogPostsData';
import { CommercialLahorePage } from './components/CommercialLahorePage';
import { CommercialKarachiPage } from './components/CommercialKarachiPage';
import { CommercialCityPage } from './components/CommercialCityPage';
import { SampleRequestPage } from './components/SampleRequestPage';
import { SitemapPage } from './components/SitemapPage';
import { CITIES_DATA } from './data/citiesData';
import { COMMERCIAL_LAHORE_PAGES, getCommercialLahorePageBySlug } from './data/commercialLahorePagesData';
import { COMMERCIAL_KARACHI_PAGES, getCommercialKarachiPageBySlug } from './data/commercialKarachiPagesData';
import { COMMERCIAL_PESHAWAR_PAGES, getCommercialPeshawarPageBySlug } from './data/commercialPeshawarPagesData';
import { COMMERCIAL_QUETTA_PAGES, getCommercialQuettaPageBySlug } from './data/commercialQuettaPagesData';
import { COMMERCIAL_HYDERABAD_PAGES, getCommercialHyderabadPageBySlug } from './data/commercialHyderabadPagesData';
import { CommercialHyderabadPage } from './components/CommercialHyderabadPage';
import { COMMERCIAL_FAISALABAD_PAGES, getCommercialFaisalabadPageBySlug } from './data/commercialFaisalabadPagesData';
import { CommercialFaisalabadPage } from './components/CommercialFaisalabadPage';
import { WordPressAdminDashboard } from './components/WordPressAdminDashboard';
import { WordPressSinglePageView } from './components/WordPressSinglePageView';
import { HomeSellerSamplesSection } from './components/HomeSellerSamplesSection';
import { SellerPortalPage } from './components/SellerPortalPage';
import { SecretBrokersPortalPage } from './components/SecretBrokersPortalPage';
import { DownloadThemeHub } from './components/DownloadThemeHub';
import { RiceVariety, WordPressPage, BlogPost } from './types';
import { DEFAULT_PAGES_DATA, getSyncedWordPressPages } from './data/defaultPagesData';
import { CheckCircle2 } from 'lucide-react';

// Helper to parse clean HTML5 pathname route (with legacy hash cleanup)
function parseRouteInfo() {
  if (typeof window === 'undefined') {
    return {
      view: 'home',
      citySlug: 'rice-supplier-karachi',
      lahoreSlug: '1121-sella-basmati-rice-supplier-restaurants-lahore',
      karachiSlug: '1121-sella-basmati-rice-supplier-restaurants-karachi',
      peshawarSlug: '1121-sella-basmati-rice-supplier-restaurants-peshawar',
      quettaSlug: '1121-sella-basmati-rice-supplier-restaurants-quetta',
      hyderabadSlug: '1121-sella-basmati-rice-supplier-restaurants-hyderabad',
      faisalabadSlug: '1121-sella-basmati-rice-supplier-restaurants-faisalabad',
      customPageSlug: '',
    };
  }

  let clean = window.location.pathname.toLowerCase().replace(/^\/+|\/+$/g, '').replace(/__trashed$/i, '').replace(/-(2|3|4|5|6|7|8|9|copy|duplicate)$/i, '');
  if (!clean && window.location.hash) {
    clean = window.location.hash.toLowerCase().replace(/^#\/?/, '').replace(/\/+$/, '').replace(/__trashed$/i, '').replace(/-(2|3|4|5|6|7|8|9|copy|duplicate)$/i, '');
  }

  // Set default view to 'home' for standard visitors
  let view = 'home';
  let citySlug = 'rice-supplier-karachi';
  let lahoreSlug = '1121-sella-basmati-rice-supplier-restaurants-lahore';
  let karachiSlug = '1121-sella-basmati-rice-supplier-restaurants-karachi';
  let peshawarSlug = '1121-sella-basmati-rice-supplier-restaurants-peshawar';
  let quettaSlug = '1121-sella-basmati-rice-supplier-restaurants-quetta';
  let hyderabadSlug = '1121-sella-basmati-rice-supplier-restaurants-hyderabad';
  let faisalabadSlug = '1121-sella-basmati-rice-supplier-restaurants-faisalabad';
  let customPageSlug = '';

  if (!clean || clean === 'home') {
    view = 'home';
  } else if (clean === 'admin' || clean === 'wp-admin' || clean === 'wp-login.php' || clean === 'wp-login' || clean.startsWith('wp-admin/')) {
    view = 'wp-admin';
  } else if (clean === 'exchange' || clean === 'rates' || clean === 'rice-supplier-rates' || clean === 'rice-supplier-exchange') {
    view = 'exchange';
  } else if (clean === 'blog' || clean === 'rice-supplier-blog') {
    view = 'blog';
  } else if (clean === 'news' || clean === 'rice-supplier-news') {
    view = 'news';
  } else if (clean === 'varieties' || clean === 'rice-supplier-varieties') {
    view = 'varieties';
  } else if (clean === 'locations' || clean === 'cities' || clean === 'rice-supplier-locations') {
    view = 'locations';
  } else if (clean === 'reviews' || clean === 'rice-supplier-reviews') {
    view = 'reviews';
  } else if (clean === 'about' || clean === 'about-us' || clean === 'rice-supplier-about') {
    view = 'about';
  } else if (clean === 'contact' || clean === 'contact-us' || clean === 'rice-supplier-contact') {
    view = 'contact';
  } else if (clean === 'sample' || clean === 'samples' || clean === 'sample-request' || clean === 'rice-supplier-sample') {
    view = 'sample';
  } else if (clean === 'sitemap' || clean === 'rice-supplier-sitemap') {
    view = 'sitemap';
  } else if (clean === 'seller' || clean === 'seller-portal' || clean === 'seller-exchange' || clean === 'seller-samples' || clean === 'rice-supplier-seller') {
    view = 'seller';
  } else if (clean === 'privacy' || clean === 'privacy-policy' || clean === 'rice-supplier-privacy') {
    view = 'privacy';
  } else if (clean === 'terms' || clean === 'terms-and-conditions' || clean === 'rice-supplier-terms') {
    view = 'terms';
  } else if (clean === 'faqs' || clean === 'faq' || clean === 'rice-supplier-faqs') {
    view = 'faqs';
  } else if (clean === 'google-ai-overview' || clean === 'ai-overview' || clean === 'rice-supplier-ai-overview') {
    view = 'google-ai-overview';
  } else if (clean === 'workflow' || clean === 'sourcing-workflow' || clean === 'rice-supplier-guide') {
    view = 'workflow';
  } else if (
    clean === 'secret-brokers' ||
    clean === 'secret-brokers-portal' ||
    clean === 'admin-rice-network' ||
    clean === 'rice-brokers-network' ||
    clean === 'pakistan-rice-traders-network' ||
    clean === 'secret-rice-network'
  ) {
    view = 'secret-brokers';
  } else if (
    clean === 'download' ||
    clean === 'download-theme' ||
    clean === 'download-files' ||
    clean === 'wordpress-download-files' ||
    clean === 'download-wordpress-files'
  ) {
    const isHidden = typeof localStorage !== 'undefined' && localStorage.getItem('hashir_hide_download_page') === 'true';
    view = isHidden ? 'home' : 'download-hub';
  } else if (
    clean === 'brand-assets' ||
    clean === 'media-kit' ||
    clean === 'logos' ||
    clean === 'download-logo'
  ) {
    view = 'home';
  } else {
    const city = CITIES_DATA.find((c) => c.slug === clean);
    if (city) {
      view = 'city';
      citySlug = city.slug;
    } else {
      const lahore = COMMERCIAL_LAHORE_PAGES.find((p) => p.slug === clean);
      if (lahore) {
        view = 'commercial-lahore';
        lahoreSlug = lahore.slug;
      } else {
        const karachi = COMMERCIAL_KARACHI_PAGES.find((p) => p.slug === clean);
        if (karachi) {
          view = 'commercial-karachi';
          karachiSlug = karachi.slug;
        } else {
          const peshawar = COMMERCIAL_PESHAWAR_PAGES.find((p) => p.slug === clean);
          if (peshawar) {
            view = 'commercial-peshawar';
            peshawarSlug = peshawar.slug;
          } else {
            const quetta = COMMERCIAL_QUETTA_PAGES.find((p) => p.slug === clean);
            if (quetta) {
              view = 'commercial-quetta';
              quettaSlug = quetta.slug;
            } else {
              const hyderabad = COMMERCIAL_HYDERABAD_PAGES.find((p) => p.slug === clean);
              if (hyderabad) {
                view = 'commercial-hyderabad';
                hyderabadSlug = hyderabad.slug;
              } else {
                const faisalabad = COMMERCIAL_FAISALABAD_PAGES.find((p) => p.slug === clean);
                if (faisalabad) {
                  view = 'commercial-faisalabad';
                  faisalabadSlug = faisalabad.slug;
                } else {
                  // Check if matching custom WordPress page or blog post
                  try {
                    const allPages: WordPressPage[] = getSyncedWordPressPages().filter((p) => p.status !== 'Trash');
                    const cleanSlug = clean.replace(/^(page|pages|blog|news|post|posts)\//, '');
                    const matchedPage = allPages.find(
                      (p) => p.slug === clean || p.slug === cleanSlug || p.id === clean
                    );
                    if (matchedPage) {
                      view = 'custom-page';
                      customPageSlug = matchedPage.slug;
                    } else {
                      const savedPostsRaw = localStorage.getItem('hashir_rice_admin_posts');
                      const localPosts: BlogPost[] = savedPostsRaw ? JSON.parse(savedPostsRaw) : BLOG_POSTS_DATA;
                      const matchedPost = localPosts.find(
                        (bp) => bp.slug === clean || bp.slug === cleanSlug || bp.id === clean
                      );
                      if (matchedPost) {
                        view = 'single-post';
                        customPageSlug = matchedPost.slug;
                      } else if (cleanSlug && !cleanSlug.includes('.')) {
                        // Treat any unknown clean slug as a potential WordPress blog post so it NEVER redirects to '/'
                        view = 'single-post';
                        customPageSlug = cleanSlug;
                      }
                    }
                  } catch (e) {
                    // ignore
                  }
                }
              }
            }
          }
        }
      }
    }
  }

  return {
    view,
    citySlug,
    lahoreSlug,
    karachiSlug,
    peshawarSlug,
    quettaSlug,
    hyderabadSlug,
    faisalabadSlug,
    customPageSlug,
  };
}

export default function App() {
  const initialRoute = parseRouteInfo();
  const [currentView, setCurrentView] = useState<string>(initialRoute.view);
  const [selectedCitySlug, setSelectedCitySlug] = useState<string>(initialRoute.citySlug);
  const [selectedLahorePageSlug, setSelectedLahorePageSlug] = useState<string>(initialRoute.lahoreSlug);
  const [selectedKarachiPageSlug, setSelectedKarachiPageSlug] = useState<string>(initialRoute.karachiSlug);
  const [selectedPeshawarPageSlug, setSelectedPeshawarPageSlug] = useState<string>(initialRoute.peshawarSlug);
  const [selectedQuettaPageSlug, setSelectedQuettaPageSlug] = useState<string>(initialRoute.quettaSlug);
  const [selectedHyderabadPageSlug, setSelectedHyderabadPageSlug] = useState<string>(initialRoute.hyderabadSlug);
  const [selectedFaisalabadPageSlug, setSelectedFaisalabadPageSlug] = useState<string>(initialRoute.faisalabadSlug);
  const [selectedCustomPageSlug, setSelectedCustomPageSlug] = useState<string>(initialRoute.customPageSlug || '');
  const [selectedCustomPage, setSelectedCustomPage] = useState<WordPressPage | null>(null);
  const [selectedBlogPost, setSelectedBlogPost] = useState<BlogPost | null>(() => {
    if (typeof window !== 'undefined' && (window as any).__WP_CURRENT_POST__) {
      return convertWpRestPostToBlogPost((window as any).__WP_CURRENT_POST__);
    }
    return null;
  });

  const [selectedVarietyDetail, setSelectedVarietyDetail] = useState<RiceVariety | null>(null);
  const [quoteModalOpen, setQuoteModalOpen] = useState<boolean>(false);
  const [sampleModalOpen, setSampleModalOpen] = useState<boolean>(false);
  const [modalVarietyTarget, setModalVarietyTarget] = useState<string | undefined>(undefined);
  const [modalCityTarget, setModalCityTarget] = useState<string | undefined>(undefined);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  const handleOpenQuoteModal = (varietyName?: string, cityName?: string) => {
    setModalVarietyTarget(varietyName);
    setModalCityTarget(cityName);
    setQuoteModalOpen(true);
  };

  const handleOpenSampleModal = (varietyName?: string, cityName?: string) => {
    setModalVarietyTarget(varietyName);
    setModalCityTarget(cityName);
    setSampleModalOpen(true);
  };

  const handleSelectCity = (citySlug: string) => {
    setSelectedCitySlug(citySlug);
    setCurrentView('city');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectLahorePage = (slug: string) => {
    setSelectedLahorePageSlug(slug);
    setCurrentView('commercial-lahore');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectKarachiPage = (slug: string) => {
    setSelectedKarachiPageSlug(slug);
    setCurrentView('commercial-karachi');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectPeshawarPage = (slug: string) => {
    setSelectedPeshawarPageSlug(slug);
    setCurrentView('commercial-peshawar');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectQuettaPage = (slug: string) => {
    setSelectedQuettaPageSlug(slug);
    setCurrentView('commercial-quetta');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectHyderabadPage = (slug: string) => {
    setSelectedHyderabadPageSlug(slug);
    setCurrentView('commercial-hyderabad');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectFaisalabadPage = (slug: string) => {
    setSelectedFaisalabadPageSlug(slug);
    setCurrentView('commercial-faisalabad');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectCommercialPage = (slug: string) => {
    if (COMMERCIAL_LAHORE_PAGES.some((p) => p.slug === slug)) {
      setSelectedLahorePageSlug(slug);
      setCurrentView('commercial-lahore');
    } else if (COMMERCIAL_KARACHI_PAGES.some((p) => p.slug === slug)) {
      setSelectedKarachiPageSlug(slug);
      setCurrentView('commercial-karachi');
    } else if (COMMERCIAL_PESHAWAR_PAGES.some((p) => p.slug === slug)) {
      setSelectedPeshawarPageSlug(slug);
      setCurrentView('commercial-peshawar');
    } else if (COMMERCIAL_QUETTA_PAGES.some((p) => p.slug === slug)) {
      setSelectedQuettaPageSlug(slug);
      setCurrentView('commercial-quetta');
    } else if (COMMERCIAL_HYDERABAD_PAGES.some((p) => p.slug === slug)) {
      setSelectedHyderabadPageSlug(slug);
      setCurrentView('commercial-hyderabad');
    } else if (COMMERCIAL_FAISALABAD_PAGES.some((p) => p.slug === slug)) {
      setSelectedFaisalabadPageSlug(slug);
      setCurrentView('commercial-faisalabad');
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleScrollToLocations = () => {
    if (currentView !== 'home') {
      setCurrentView('home');
      setTimeout(() => {
        const el = document.getElementById('pakistan-locations');
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } else {
      const el = document.getElementById('pakistan-locations');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Find currently selected city object for CityDedicatedPage
  const currentCityData = CITIES_DATA.find((c) => c.slug === selectedCitySlug) || CITIES_DATA[0];
  const currentLahorePageData = getCommercialLahorePageBySlug(selectedLahorePageSlug) || COMMERCIAL_LAHORE_PAGES[0];
  const currentKarachiPageData = getCommercialKarachiPageBySlug(selectedKarachiPageSlug) || COMMERCIAL_KARACHI_PAGES[0];
  const currentPeshawarPageData = getCommercialPeshawarPageBySlug(selectedPeshawarPageSlug) || COMMERCIAL_PESHAWAR_PAGES[0];
  const currentQuettaPageData = getCommercialQuettaPageBySlug(selectedQuettaPageSlug) || COMMERCIAL_QUETTA_PAGES[0];
  const currentHyderabadPageData = getCommercialHyderabadPageBySlug(selectedHyderabadPageSlug) || COMMERCIAL_HYDERABAD_PAGES[0];
  const currentFaisalabadPageData = getCommercialFaisalabadPageBySlug(selectedFaisalabadPageSlug) || COMMERCIAL_FAISALABAD_PAGES[0];

  // Listen for browser back/forward popstate navigation
  useEffect(() => {
    const handlePopState = () => {
      const route = parseRouteInfo();
      setSelectedCitySlug(route.citySlug);
      setSelectedLahorePageSlug(route.lahoreSlug);
      setSelectedKarachiPageSlug(route.karachiSlug);
      setSelectedPeshawarPageSlug(route.peshawarSlug);
      setSelectedQuettaPageSlug(route.quettaSlug);
      setSelectedHyderabadPageSlug(route.hyderabadSlug);
      setSelectedFaisalabadPageSlug(route.faisalabadSlug);
      if (route.customPageSlug) {
        setSelectedCustomPageSlug(route.customPageSlug);
      }
      setCurrentView(route.view);
    };

    window.addEventListener('popstate', handlePopState);
    window.addEventListener('hashchange', handlePopState);
    return () => {
      window.removeEventListener('popstate', handlePopState);
      window.removeEventListener('hashchange', handlePopState);
    };
  }, []);

  // Load custom page or WordPress blog post when viewing a custom slug
  useEffect(() => {
    if (currentView === 'custom-page' && selectedCustomPageSlug) {
      const loadPage = () => {
        try {
          const allPages: WordPressPage[] = getSyncedWordPressPages();
          const matched = allPages.find((p) => p.slug === selectedCustomPageSlug || p.id === selectedCustomPageSlug);
          if (matched) {
            setSelectedCustomPage(matched);
          }
        } catch (e) {
          // ignore
        }
      };
      loadPage();
    } else if (currentView === 'single-post' && selectedCustomPageSlug) {
      const savedPostsRaw = localStorage.getItem('hashir_rice_admin_posts');
      const localPosts: BlogPost[] = savedPostsRaw ? JSON.parse(savedPostsRaw) : BLOG_POSTS_DATA;
      const matchedLocal = localPosts.find(
        (bp) => bp.slug === selectedCustomPageSlug || bp.id === selectedCustomPageSlug
      );
      if (matchedLocal) {
        setSelectedBlogPost(matchedLocal);
        return;
      }
      if (typeof window !== 'undefined' && (window as any).__WP_CURRENT_POST__) {
        const wpCurr = (window as any).__WP_CURRENT_POST__;
        if (!wpCurr.slug || wpCurr.slug === selectedCustomPageSlug) {
          setSelectedBlogPost(convertWpRestPostToBlogPost(wpCurr));
          return;
        }
      }
      // Fetch live WordPress post by slug via WP REST API
      fetch(`/wp-json/wp/v2/posts?slug=${encodeURIComponent(selectedCustomPageSlug)}&_embed`)
        .then((res) => (res.ok ? res.json() : []))
        .then((arr) => {
          if (Array.isArray(arr) && arr.length > 0) {
            setSelectedBlogPost(convertWpRestPostToBlogPost(arr[0]));
          } else {
            // Also check if it is a new WordPress Page created in wp-admin
            return fetch(`/wp-json/wp/v2/pages?slug=${encodeURIComponent(selectedCustomPageSlug)}&_embed`)
              .then((r) => (r.ok ? r.json() : []))
              .then((pArr) => {
                if (Array.isArray(pArr) && pArr.length > 0) {
                  setSelectedBlogPost(convertWpRestPostToBlogPost(pArr[0]));
                }
              });
          }
        })
        .catch(() => {});
    }
  }, [currentView, selectedCustomPageSlug]);

  useEffect(() => {
    const handlePagesUpdated = () => {
      if (selectedCustomPageSlug) {
        try {
          const allPages: WordPressPage[] = getSyncedWordPressPages();
          const matched = allPages.find((p) => p.slug === selectedCustomPageSlug || p.id === selectedCustomPageSlug);
          if (matched) setSelectedCustomPage(matched);
        } catch (e) {}
      }
    };
    window.addEventListener('hashir_pages_updated', handlePagesUpdated);
    window.addEventListener('storage', handlePagesUpdated);
    return () => {
      window.removeEventListener('hashir_pages_updated', handlePagesUpdated);
      window.removeEventListener('storage', handlePagesUpdated);
    };
  }, [selectedCustomPageSlug]);

  // Synchronize browser URL pathname with current view & slugs (clean URLs without trailing /)
  useEffect(() => {
    let targetPath = '/';
    if (currentView === 'home') {
      targetPath = '/';
    } else if (currentView === 'varieties') {
      targetPath = '/varieties';
    } else if (currentView === 'exchange') {
      targetPath = '/exchange';
    } else if (currentView === 'locations') {
      targetPath = '/locations';
    } else if (currentView === 'workflow') {
      targetPath = '/workflow';
    } else if (currentView === 'reviews') {
      targetPath = '/reviews';
    } else if (currentView === 'sample') {
      targetPath = '/sample-request';
    } else if (currentView === 'blog') {
      targetPath = '/blog';
    } else if (currentView === 'news') {
      targetPath = '/news';
    } else if (currentView === 'about') {
      targetPath = '/about-us';
    } else if (currentView === 'contact') {
      targetPath = '/contact';
    } else if (currentView === 'privacy') {
      targetPath = '/privacy-policy';
    } else if (currentView === 'terms') {
      targetPath = '/terms-and-conditions';
    } else if (currentView === 'faqs') {
      targetPath = '/faqs';
    } else if (currentView === 'sitemap') {
      targetPath = '/sitemap';
    } else if (currentView === 'google-ai-overview') {
      targetPath = '/google-ai-overview';
    } else if (currentView === 'seller') {
      targetPath = '/seller-portal';
    } else if (currentView === 'admin' || currentView === 'wp-admin') {
      targetPath = '/wp-admin';
    } else if (currentView === 'city') {
      targetPath = `/${currentCityData.slug}`;
    } else if (currentView === 'commercial-lahore') {
      targetPath = `/${currentLahorePageData.slug}`;
    } else if (currentView === 'commercial-karachi') {
      targetPath = `/${currentKarachiPageData.slug}`;
    } else if (currentView === 'commercial-peshawar') {
      targetPath = `/${currentPeshawarPageData.slug}`;
    } else if (currentView === 'commercial-quetta') {
      targetPath = `/${currentQuettaPageData.slug}`;
    } else if (currentView === 'commercial-hyderabad') {
      targetPath = `/${currentHyderabadPageData.slug}`;
    } else if (currentView === 'commercial-faisalabad') {
      targetPath = `/${currentFaisalabadPageData.slug}`;
    } else if (currentView === 'custom-page' && selectedCustomPageSlug) {
      targetPath = `/${selectedCustomPageSlug}`;
    } else if (currentView === 'single-post' && selectedCustomPageSlug) {
      targetPath = `/${selectedCustomPageSlug}`;
    }

    if (typeof window !== 'undefined') {
      const currentPath = window.location.pathname;
      const hasHash = Boolean(window.location.hash);
      if (currentPath !== targetPath || hasHash) {
        window.history.pushState(null, '', targetPath);
      }
    }
  }, [
    currentView,
    currentCityData.slug,
    currentLahorePageData.slug,
    currentKarachiPageData.slug,
    currentPeshawarPageData.slug,
    currentQuettaPageData.slug,
    currentHyderabadPageData.slug,
    currentFaisalabadPageData.slug,
    selectedCustomPageSlug,
  ]);

  // Dynamic Google On-Page SEO Titles, Meta Descriptions, Open Indexing & Canonicals (https://hashirricesupplier.com)
  useEffect(() => {
    let pageTitle = 'Wholesale Rice Supplier Pakistan | Direct Mandi Trader';
    let metaDesc = 'Direct ex-mill wholesale rice supplier at Noor Galla Mandi Bucheki. Bulk 1121 Kainat Steam, Sella & Super Kernel Basmati across 60+ cities.';
    let canonicalUrl = 'https://hashirricesupplier.com/';

    if (currentView === 'custom-page' && selectedCustomPage) {
      pageTitle = selectedCustomPage.seoTitle || `${selectedCustomPage.title} | Hashir Rice`;
      metaDesc = selectedCustomPage.metaDescription || selectedCustomPage.excerpt || metaDesc;
      canonicalUrl = selectedCustomPage.slug === 'home' ? 'https://hashirricesupplier.com/' : `https://hashirricesupplier.com/${selectedCustomPage.slug}`;
    } else if (currentView === 'commercial-lahore') {
      pageTitle = `${currentLahorePageData.varietyType} for ${currentLahorePageData.targetSegment} in Lahore | Mandi`;
      metaDesc = `Direct ex-mill ${currentLahorePageData.varietyType} supplier for ${currentLahorePageData.targetSegment.toLowerCase()} in Lahore. 22mm+ elongation, <12% moisture & fast bilty from Bucheki.`;
      canonicalUrl = `https://hashirricesupplier.com/${currentLahorePageData.slug}`;
    } else if (currentView === 'commercial-karachi') {
      pageTitle = `${currentKarachiPageData.varietyType} for ${currentKarachiPageData.targetSegment} in Karachi | Mandi`;
      metaDesc = `Direct ex-mill ${currentKarachiPageData.varietyType} supplier for ${currentKarachiPageData.targetSegment.toLowerCase()} in Karachi. 22mm+ elongation, <12% moisture & fast bilty from Bucheki.`;
      canonicalUrl = `https://hashirricesupplier.com/${currentKarachiPageData.slug}`;
    } else if (currentView === 'commercial-peshawar') {
      pageTitle = `${currentPeshawarPageData.varietyType} for ${currentPeshawarPageData.targetSegment} in Peshawar | Mandi`;
      metaDesc = `Direct ex-mill ${currentPeshawarPageData.varietyType} supplier for ${currentPeshawarPageData.targetSegment.toLowerCase()} in Peshawar. 22mm+ elongation, <12% moisture & fast bilty from Bucheki.`;
      canonicalUrl = `https://hashirricesupplier.com/${currentPeshawarPageData.slug}`;
    } else if (currentView === 'commercial-quetta') {
      pageTitle = `${currentQuettaPageData.varietyType} for ${currentQuettaPageData.targetSegment} in Quetta | Mandi`;
      metaDesc = `Direct ex-mill ${currentQuettaPageData.varietyType} supplier for ${currentQuettaPageData.targetSegment.toLowerCase()} in Quetta. 22mm+ elongation, <12% moisture & fast bilty from Bucheki.`;
      canonicalUrl = `https://hashirricesupplier.com/${currentQuettaPageData.slug}`;
    } else if (currentView === 'commercial-hyderabad') {
      pageTitle = `${currentHyderabadPageData.varietyType} for ${currentHyderabadPageData.targetSegment} in Hyderabad | Mandi`;
      metaDesc = `Direct ex-mill ${currentHyderabadPageData.varietyType} supplier for ${currentHyderabadPageData.targetSegment.toLowerCase()} in Hyderabad. 22mm+ elongation, <12% moisture & fast bilty from Bucheki.`;
      canonicalUrl = `https://hashirricesupplier.com/${currentHyderabadPageData.slug}`;
    } else if (currentView === 'commercial-faisalabad') {
      pageTitle = `${currentFaisalabadPageData.varietyType} for ${currentFaisalabadPageData.targetSegment} in Faisalabad | Mandi`;
      metaDesc = `Direct ex-mill ${currentFaisalabadPageData.varietyType} supplier for ${currentFaisalabadPageData.targetSegment.toLowerCase()} in Faisalabad. 22mm+ elongation, <12% moisture & fast bilty from Bucheki.`;
      canonicalUrl = `https://hashirricesupplier.com/${currentFaisalabadPageData.slug}`;
    } else if (currentView === 'city') {
      const cleanC = currentCityData.name.replace(' (Mingora)', '').replace(' (Shaheed Benazirabad)', '').replace(' & Bucheki', '');
      pageTitle = `Rice Supplier in ${cleanC} | Bulk Basmati Rice Trader`;
      metaDesc = `Direct ex-mill wholesale rice supplier in ${cleanC}. Bulk 1121 Kainat Steam, Sella, Super Kernel Basmati & IRRI-6 bilty from Bucheki Mandi.`;
      canonicalUrl = `https://hashirricesupplier.com/${currentCityData.slug}`;
    } else if (currentView === 'blog') {
      pageTitle = 'Wholesale Rice Blog & Punjab Mandi Guides | Hashir Rice';
      metaDesc = 'Expert guides on bulk rice sourcing from Punjab Mandis, 1121 Kainat Steam vs Super Kernel Basmati elongation, and warehouse moisture checks.';
      canonicalUrl = 'https://hashirricesupplier.com/blog';
    } else if (currentView === 'news') {
      pageTitle = 'Pakistan Rice Export & Market Intelligence | Hashir Rice';
      metaDesc = 'Live commodity reports on Pakistani rice exports, FAO benchmarks, EU MRL standards, and Arabian Gulf container freight rates.';
      canonicalUrl = 'https://hashirricesupplier.com/news';
    } else if (currentView === 'varieties') {
      pageTitle = 'Wholesale Rice Varieties Pakistan | 1121 & Basmati';
      metaDesc = 'Explore 10 wholesale rice grades at Noor Galla Mandi Bucheki: 1121 Kainat Steam, Golden Sella, Super Kernel Basmati, PK-386 & IRRI-6 in bulk.';
      canonicalUrl = 'https://hashirricesupplier.com/varieties';
    } else if (currentView === 'exchange') {
      pageTitle = 'Today Rice Rate in Pakistan | Live Mandi Rice Exchange';
      metaDesc = 'Check today live wholesale rice rates per 40kg maund & ton from Noor Galla Mandi Bucheki for 1121 Kainat Steam, Sella, Basmati & IRRI-6.';
      canonicalUrl = 'https://hashirricesupplier.com/exchange';
    } else if (currentView === 'reviews') {
      pageTitle = 'Verified Buyer Reviews | Hashir Rice Supplier Pakistan';
      metaDesc = 'Read verified reviews from Akbari Mandi Lahore dealers, Jodia Bazaar Karachi traders, restaurant chefs & caterers buying from Hashir Rice.';
      canonicalUrl = 'https://hashirricesupplier.com/reviews';
    } else if (currentView === 'about') {
      pageTitle = 'About Hashir Rice Supplier | Bucheki Mandi Rice Trader';
      metaDesc = 'Learn about Hashir Rice Supplier (Owner: Muhammad Amir Shahzad) at Noor Galla Mandi Bucheki. Direct ex-mill Basmati rice sourcing across Pakistan.';
      canonicalUrl = 'https://hashirricesupplier.com/about-us';
    } else if (currentView === 'privacy') {
      pageTitle = 'Privacy Policy & B2B Trade Confidentiality | Hashir Rice';
      metaDesc = 'Read the commercial data privacy policy and B2B buyer confidentiality standards of Hashir Rice Supplier at Noor Galla Mandi, Bucheki.';
      canonicalUrl = 'https://hashirricesupplier.com/privacy-policy';
    } else if (currentView === 'terms') {
      pageTitle = 'Terms & Conditions of Wholesale Trade | Hashir Rice';
      metaDesc = 'Standard wholesale rice trade terms, weighbridge verification, 12% moisture tolerance, and mandi bilty policies at Hashir Rice Supplier.';
      canonicalUrl = 'https://hashirricesupplier.com/terms-and-conditions';
    } else if (currentView === 'contact') {
      pageTitle = 'Contact Hashir Rice Supplier | Bucheki Mandi Office';
      metaDesc = 'Contact Hashir Rice Supplier (Owner: Muhammad Amir Shahzad) at Noor Galla Mandi, Bucheki (Nankana Sahib). Call or WhatsApp +92 333 8990883 for live ex-mill rice rates.';
      canonicalUrl = 'https://hashirricesupplier.com/contact';
    } else if (currentView === 'sample') {
      pageTitle = 'Request Free Physical Rice Sample | Commercial Testing';
      metaDesc = 'Order a free physical sample of 1121 Kainat Steam, Golden Sella, or Super Kernel Basmati. Test 22mm+ elongation before booking bulk bilties.';
      canonicalUrl = 'https://hashirricesupplier.com/sample-request';
    } else if (currentView === 'seller') {
      pageTitle = 'Rice Mills & Shellers B2B Portal | Bucheki Mandi Desk';
      metaDesc = 'Partner with Hashir Rice Supplier at Noor Galla Mandi Bucheki. List your sortex 1121 Steam, Sella & Basmati mill lots for verified B2B buyers.';
      canonicalUrl = 'https://hashirricesupplier.com/seller-portal';
    } else if (currentView === 'sitemap') {
      pageTitle = 'Complete Website Sitemap Directory | Hashir Rice Supplier';
      metaDesc = 'Explore the complete directory of 116+ wholesale rice pages including 31 Pakistan city hubs, 72 restaurant & catering portals, and XML sitemap.';
      canonicalUrl = 'https://hashirricesupplier.com/sitemap';
    } else if (currentView === 'google-ai-overview') {
      pageTitle = 'Google AI Overview & Basmati Trade Data | Hashir Rice';
      metaDesc = 'Technical ground truth and entity schema for Google AI Search regarding Pakistani 1121 Kainat Basmati, IRRI-6, and Bucheki Mandi trade.';
      canonicalUrl = 'https://hashirricesupplier.com/google-ai-overview';
    } else if (currentView === 'workflow') {
      pageTitle = 'Wholesale Rice Sourcing Workflow & 7-Point Quality Lab';
      metaDesc = 'Explore our 7-stage rice sourcing workflow at Noor Galla Mandi Bucheki: multi-mill lot audit, 12% moisture check, Buhler sortex & bilty.';
      canonicalUrl = 'https://hashirricesupplier.com/workflow';
    } else if (currentView === 'single-post' && selectedBlogPost) {
      pageTitle = (selectedBlogPost.seoTitle || selectedBlogPost.title || 'Mandi Article').slice(0, 58);
      metaDesc = (selectedBlogPost.metaDescription || selectedBlogPost.excerpt || metaDesc).slice(0, 146);
      canonicalUrl = `https://hashirricesupplier.com/${selectedBlogPost.slug}`;
    }

    if (pageTitle.length > 58) {
      pageTitle = pageTitle.slice(0, 58).replace(/\s+\S*$/, '').trim();
    }
    if (metaDesc.length > 146) {
      metaDesc = metaDesc.slice(0, 145).replace(/\s+\S*$/, '').trim() + '.';
    }

    document.title = pageTitle;

    // Enforce Open Indexing on all public pages, noindex on hidden /wp-admin
    const robotsMeta = document.querySelector('meta[name="robots"]');
    if (robotsMeta) {
      if (currentView === 'admin' || currentView === 'wp-admin') {
        robotsMeta.setAttribute('content', 'noindex, nofollow');
      } else {
        robotsMeta.setAttribute('content', 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1');
      }
    }

    // Deduplicate and update meta description (ensure strictly 1 <meta name="description">)
    const allDescMetas = document.querySelectorAll('meta[name="description"]');
    if (allDescMetas.length > 1) {
      allDescMetas.forEach((el, idx) => {
        if (idx > 0) el.parentNode?.removeChild(el);
      });
    }
    const descMeta = document.querySelector('meta[name="description"]');
    if (descMeta) descMeta.setAttribute('content', metaDesc);

    // Ensure complete Open Graph & X (Twitter) Card tags (Fixes Ahrefs Open Graph incomplete & Twitter card missing)
    const defaultSocialImage = 'https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=1200&h=630&q=80';
    const ensureMeta = (attrName: 'property' | 'name', attrVal: string, contentVal: string) => {
      let el = document.querySelector(`meta[${attrName}="${attrVal}"]`);
      if (!el) {
        el = document.createElement('meta');
        el.setAttribute(attrName, attrVal);
        document.head.appendChild(el);
      }
      el.setAttribute('content', contentVal);
    };

    ensureMeta('property', 'og:type', 'website');
    ensureMeta('property', 'og:site_name', 'Hashir Rice Supplier');
    ensureMeta('property', 'og:title', pageTitle);
    ensureMeta('property', 'og:description', metaDesc);
    ensureMeta('property', 'og:url', canonicalUrl);
    ensureMeta('property', 'og:image', defaultSocialImage);

    ensureMeta('name', 'twitter:card', 'summary_large_image');
    ensureMeta('name', 'twitter:title', pageTitle);
    ensureMeta('name', 'twitter:description', metaDesc);
    ensureMeta('name', 'twitter:image', defaultSocialImage);

    // Deduplicate and update Canonical Tag (ensure strictly 1 <link rel="canonical">)
    const allCanonicals = document.querySelectorAll('link[rel="canonical"]');
    if (allCanonicals.length > 1) {
      allCanonicals.forEach((el, idx) => {
        if (idx > 0) el.parentNode?.removeChild(el);
      });
    }
    const canonical = document.querySelector('link[rel="canonical"]');
    if (canonical) {
      canonical.setAttribute('href', canonicalUrl);
    }
  }, [
    currentView,
    currentCityData,
    currentLahorePageData,
    currentKarachiPageData,
    currentPeshawarPageData,
    currentQuettaPageData,
    currentHyderabadPageData,
    currentFaisalabadPageData,
    selectedCustomPage,
  ]);

  const [gmpQuotaExceeded, setGmpQuotaExceeded] = useState<boolean>(false);
  useEffect(() => {
    const handleQuotaExceeded = () => setGmpQuotaExceeded(true);
    window.addEventListener('gmp-quota-exceeded', handleQuotaExceeded);
    return () => window.removeEventListener('gmp-quota-exceeded', handleQuotaExceeded);
  }, []);

  // Check if WordPress Admin Dashboard is active
  if (currentView === 'admin' || currentView === 'wp-admin') {
    return (
      <div className="min-h-screen bg-[#f0f0f1]">
        <WordPressAdminDashboard
          onExitToFrontend={() => {
            setCurrentView('home');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          onSuccessToast={showToast}
        />
        {toastMessage && (
          <div className="fixed top-12 right-5 z-50 bg-[#1d2327] text-white px-4 py-3 rounded shadow-2xl border border-[#2271b1] flex items-center gap-3 text-xs">
            <CheckCircle2 className="w-4 h-4 text-[#72aee6] shrink-0" />
            <span>{toastMessage}</span>
          </div>
        )}
      </div>
    );
  }

  // Check if Download Theme Hub is active
  if (currentView === 'download-hub') {
    return (
      <div className="min-h-screen bg-neutral-50">
        <DownloadThemeHub
          onBackToHome={() => {
            setCurrentView('home');
            window.history.pushState(null, '', '/');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          onSuccessToast={showToast}
        />
        {toastMessage && (
          <div className="fixed top-12 right-5 z-50 bg-[#1d2327] text-white px-4 py-3 rounded-xl shadow-2xl border border-emerald-500 flex items-center gap-3 text-xs">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{toastMessage}</span>
          </div>
        )}
      </div>
    );
  }

  // Check if Secret Pakistan Rice Brokers & WhatsApp Portal is active (Confidential - Hidden from public)
  if (currentView === 'secret-brokers') {
    return (
      <div className="min-h-screen bg-neutral-950">
        <SecretBrokersPortalPage
          onNavigateHome={() => {
            setCurrentView('home');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          onSuccessToast={showToast}
        />
        {toastMessage && (
          <div className="fixed top-12 right-5 z-50 bg-[#1d2327] text-white px-4 py-3 rounded-xl shadow-2xl border border-emerald-500 flex items-center gap-3 text-xs">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{toastMessage}</span>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full overflow-x-hidden bg-white text-neutral-900 font-sans flex flex-col selection:bg-emerald-900 selection:text-amber-300">
      {gmpQuotaExceeded && (
        <div className="bg-amber-50 border-b border-amber-200 text-amber-900 px-4 py-2.5 text-xs md:text-sm text-center sticky top-0 z-50 shadow-sm">
          <span>
            Google Maps Platform quota reached. If you are the app owner, visit{' '}
            <a
              href="https://developers.google.com/maps/ai/ai-studio?utm_campaign=gmp_mcp_codeassist_v1_aistudio#quota_exceeded_errors"
              target="_blank"
              rel="noopener noreferrer"
              className="underline font-semibold text-amber-950 hover:text-amber-800"
            >
              maps developer site
            </a>{' '}
            for instructions to update your account.
          </span>
        </div>
      )}
      {/* SEO Structured JSON-LD Schemas */}
      <SeoSchema />

      {/* Main Responsive Header */}
      <Navbar
        currentView={currentView}
        setCurrentView={setCurrentView}
        onOpenQuoteModal={handleOpenQuoteModal}
        onOpenSampleModal={handleOpenSampleModal}
        onScrollToLocations={handleScrollToLocations}
      />

      {/* Main Content Router / View Controller */}
      <main className="flex-1">
        {/* HOME VIEW: Full comprehensive narrative */}
        {currentView === 'home' && (
          <>
            <HeroSection
              onOpenQuoteModal={handleOpenQuoteModal}
              onOpenSampleModal={handleOpenSampleModal}
              setCurrentView={setCurrentView}
            />

            {/* International Exchange Rates / Stock Exchange Index */}
            <RiceExchangeTicker onOpenQuoteModal={handleOpenQuoteModal} />

            <BusinessModelSection
              onOpenQuoteModal={() => handleOpenQuoteModal()}
              onOpenSampleModal={() => handleOpenSampleModal()}
            />

            <ProductsSection
              onOpenQuoteModal={handleOpenQuoteModal}
              onOpenSampleModal={handleOpenSampleModal}
              onSelectVarietyDetail={(v) => setSelectedVarietyDetail(v)}
            />

            {/* Featured 4 Sellers Rice Samples & Add Your Rice Sample on Home Page */}
            <HomeSellerSamplesSection
              onOpenSampleModal={handleOpenSampleModal}
              onOpenQuoteModal={handleOpenQuoteModal}
              setCurrentView={setCurrentView}
              onSuccessToast={showToast}
            />

            {/* Google Reviews & Customer Review Submission Section */}
            <ReviewsAndRatingsSection
              onOpenQuoteModal={handleOpenQuoteModal}
              onSuccessToast={showToast}
            />

            <SourcingWorkflowSection
              onOpenQuoteModal={() => handleOpenQuoteModal()}
              onOpenSampleModal={() => handleOpenSampleModal()}
            />

            <WhoWeServeSection onOpenQuoteModal={handleOpenQuoteModal} />

            <QuoteEstimator onSuccessToast={showToast} />

            {/* Pakistan Major Cities Wholesale Rice Supply Hub (Focused on Major Big Cities) */}
            <PakistanLocationsSection
              onOpenQuoteModal={handleOpenQuoteModal}
              onOpenSampleModal={handleOpenSampleModal}
              onSelectCity={handleSelectCity}
            />

            {/* Google Search-Engine SEO & Wholesale Rice Authority Sourcing Guide */}
            <RiceTradingGuideSection
              onOpenQuoteModal={handleOpenQuoteModal}
              onOpenSampleModal={handleOpenSampleModal}
            />

            <AboutUsSection
              onOpenQuoteModal={() => handleOpenQuoteModal()}
              onOpenSampleModal={() => handleOpenSampleModal()}
            />

            <FaqSection />

            <ContactSection onSuccessToast={showToast} />
          </>
        )}

        {/* DEDICATED CITY SOURCING PAGE (600+ WORDS SEO OPTIMIZED) */}
        {currentView === 'city' && (
          <div className="animate-fadeIn">
            <CityDedicatedPage
              city={currentCityData}
              onBackToHome={() => {
                setCurrentView('home');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              onBackToLocations={() => {
                setCurrentView('locations');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              onSelectCity={handleSelectCity}
              onOpenQuoteModal={handleOpenQuoteModal}
              onOpenSampleModal={handleOpenSampleModal}
              onSelectLahoreCommercialPage={handleSelectLahorePage}
              onSelectKarachiCommercialPage={handleSelectKarachiPage}
              onSelectPeshawarCommercialPage={handleSelectPeshawarPage}
              onSelectQuettaCommercialPage={handleSelectQuettaPage}
              onSelectHyderabadCommercialPage={handleSelectHyderabadPage}
              onSelectFaisalabadCommercialPage={handleSelectFaisalabadPage}
            />
            <QuoteEstimator onSuccessToast={showToast} />
          </div>
        )}

        {/* DEDICATED LAHORE COMMERCIAL FOODSERVICE PORTALS (12 SPECIALIZED PAGES, 600+ WORDS EACH) */}
        {currentView === 'commercial-lahore' && (
          <div className="animate-fadeIn">
            <CommercialLahorePage
              pageData={currentLahorePageData}
              onSelectLahorePage={handleSelectLahorePage}
              onBackToHome={() => {
                setCurrentView('home');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              onBackToLahoreCity={() => {
                setSelectedCitySlug('rice-supplier-lahore');
                setCurrentView('city');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              onOpenQuoteModal={handleOpenQuoteModal}
              onOpenSampleModal={handleOpenSampleModal}
            />
            <QuoteEstimator onSuccessToast={showToast} />
          </div>
        )}

        {/* DEDICATED KARACHI COMMERCIAL FOODSERVICE PORTALS (12 SPECIALIZED PAGES, 600+ WORDS EACH) */}
        {currentView === 'commercial-karachi' && (
          <div className="animate-fadeIn">
            <CommercialKarachiPage
              pageData={currentKarachiPageData}
              onSelectKarachiPage={handleSelectKarachiPage}
              onBackToHome={() => {
                setCurrentView('home');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              onBackToKarachiCity={() => {
                setSelectedCitySlug('rice-supplier-karachi');
                setCurrentView('city');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              onOpenQuoteModal={handleOpenQuoteModal}
              onOpenSampleModal={handleOpenSampleModal}
            />
            <QuoteEstimator onSuccessToast={showToast} />
          </div>
        )}

        {/* DEDICATED PESHAWAR COMMERCIAL FOODSERVICE PORTALS (12 SPECIALIZED PAGES, 600+ WORDS EACH) */}
        {currentView === 'commercial-peshawar' && (
          <div className="animate-fadeIn">
            <CommercialCityPage
              pageData={currentPeshawarPageData}
              cityName="Peshawar"
              onSelectPage={handleSelectPeshawarPage}
              onBackToHome={() => {
                setCurrentView('home');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              onBackToCity={() => {
                setSelectedCitySlug('rice-supplier-peshawar');
                setCurrentView('city');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              onOpenQuoteModal={handleOpenQuoteModal}
              onOpenSampleModal={handleOpenSampleModal}
            />
            <QuoteEstimator onSuccessToast={showToast} />
          </div>
        )}

        {/* DEDICATED QUETTA COMMERCIAL FOODSERVICE PORTALS (12 SPECIALIZED PAGES, 600+ WORDS EACH) */}
        {currentView === 'commercial-quetta' && (
          <div className="animate-fadeIn">
            <CommercialCityPage
              pageData={currentQuettaPageData}
              cityName="Quetta"
              onSelectPage={handleSelectQuettaPage}
              onBackToHome={() => {
                setCurrentView('home');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              onBackToCity={() => {
                setSelectedCitySlug('rice-supplier-quetta');
                setCurrentView('city');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              onOpenQuoteModal={handleOpenQuoteModal}
              onOpenSampleModal={handleOpenSampleModal}
            />
            <QuoteEstimator onSuccessToast={showToast} />
          </div>
        )}

        {/* DEDICATED HYDERABAD COMMERCIAL FOODSERVICE PORTALS (12 SPECIALIZED PAGES, 600+ WORDS EACH) */}
        {currentView === 'commercial-hyderabad' && (
          <div className="animate-fadeIn">
            <CommercialHyderabadPage
              pageData={currentHyderabadPageData}
              onSelectHyderabadPage={handleSelectHyderabadPage}
              onBackToHome={() => {
                setCurrentView('home');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              onBackToHyderabadCity={() => {
                setSelectedCitySlug('rice-supplier-hyderabad');
                setCurrentView('city');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              onOpenQuoteModal={handleOpenQuoteModal}
              onOpenSampleModal={handleOpenSampleModal}
            />
            <QuoteEstimator onSuccessToast={showToast} />
          </div>
        )}

        {/* DEDICATED FAISALABAD COMMERCIAL FOODSERVICE PORTALS (12 SPECIALIZED PAGES, 600+ WORDS EACH) */}
        {currentView === 'commercial-faisalabad' && (
          <div className="animate-fadeIn">
            <CommercialFaisalabadPage
              pageData={currentFaisalabadPageData}
              onSelectFaisalabadPage={handleSelectFaisalabadPage}
              onBackToHome={() => {
                setCurrentView('home');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              onBackToFaisalabadCity={() => {
                setSelectedCitySlug('rice-supplier-faisalabad');
                setCurrentView('city');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              onOpenQuoteModal={handleOpenQuoteModal}
              onOpenSampleModal={handleOpenSampleModal}
            />
            <QuoteEstimator onSuccessToast={showToast} />
          </div>
        )}

        {/* EXCHANGE / COMMODITY MARKET VIEW */}
        {currentView === 'exchange' && (
          <div className="py-8 animate-fadeIn">
            <RiceExchangeTicker onOpenQuoteModal={handleOpenQuoteModal} />
            <QuoteEstimator onSuccessToast={showToast} />
            <ContactSection onSuccessToast={showToast} />
          </div>
        )}

        {/* REVIEWS VIEW */}
        {currentView === 'reviews' && (
          <div className="py-8 animate-fadeIn">
            <ReviewsAndRatingsSection
              onOpenQuoteModal={handleOpenQuoteModal}
              onSuccessToast={showToast}
            />
            <QuoteEstimator onSuccessToast={showToast} />
            <ContactSection onSuccessToast={showToast} />
          </div>
        )}

        {/* ABOUT US VIEW */}
        {currentView === 'about' && (
          <div className="animate-fadeIn">
            <AboutUsPage
              onOpenQuoteModal={handleOpenQuoteModal}
              onOpenSampleModal={handleOpenSampleModal}
              onSelectCity={handleSelectCity}
              setCurrentView={setCurrentView}
            />
            <QuoteEstimator onSuccessToast={showToast} />
          </div>
        )}

        {/* PRIVACY POLICY VIEW */}
        {currentView === 'privacy' && (
          <div className="animate-fadeIn">
            <PrivacyPolicyPage
              setCurrentView={setCurrentView}
              onOpenQuoteModal={handleOpenQuoteModal}
            />
          </div>
        )}

        {/* TERMS AND CONDITIONS VIEW */}
        {currentView === 'terms' && (
          <div className="animate-fadeIn">
            <TermsAndConditionsPage
              setCurrentView={setCurrentView}
              onOpenQuoteModal={handleOpenQuoteModal}
            />
          </div>
        )}

        {/* RICE VARIETIES VIEW */}
        {currentView === 'varieties' && (
          <div className="py-8 animate-fadeIn">
            <ProductsSection
              onOpenQuoteModal={handleOpenQuoteModal}
              onOpenSampleModal={handleOpenSampleModal}
              onSelectVarietyDetail={(v) => setSelectedVarietyDetail(v)}
            />
            <QuoteEstimator onSuccessToast={showToast} />
            <ContactSection onSuccessToast={showToast} />
          </div>
        )}

        {/* HOW IT WORKS / WORKFLOW VIEW */}
        {currentView === 'workflow' && (
          <div className="py-8 animate-fadeIn">
            <SourcingWorkflowSection
              onOpenQuoteModal={() => handleOpenQuoteModal()}
              onOpenSampleModal={() => handleOpenSampleModal()}
            />
            <BusinessModelSection
              onOpenQuoteModal={() => handleOpenQuoteModal()}
              onOpenSampleModal={() => handleOpenSampleModal()}
            />
            <QuoteEstimator onSuccessToast={showToast} />
            <ContactSection onSuccessToast={showToast} />
          </div>
        )}

        {/* PAKISTAN LOCATIONS VIEW */}
        {currentView === 'locations' && (
          <div className="py-8 animate-fadeIn">
            <PakistanLocationsSection
              onOpenQuoteModal={handleOpenQuoteModal}
              onOpenSampleModal={handleOpenSampleModal}
              onSelectCity={handleSelectCity}
            />
            <QuoteEstimator onSuccessToast={showToast} />
            <ContactSection onSuccessToast={showToast} />
          </div>
        )}

        {/* KNOWLEDGE BLOG VIEW */}
        {currentView === 'blog' && (
          <div className="py-4 animate-fadeIn">
            <BlogSection
              onOpenQuoteModal={handleOpenQuoteModal}
              onOpenSampleModal={handleOpenSampleModal}
              onSelectPost={(post) => {
                setSelectedBlogPost(post);
                setSelectedCustomPageSlug(post.slug);
                setCurrentView('single-post');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              isFullPageView={true}
            />
            <QuoteEstimator onSuccessToast={showToast} />
            <ContactSection onSuccessToast={showToast} />
          </div>
        )}

        {/* SINGLE BLOG POST VIEW (Opens Separately at /post-slug without redirecting to Home) */}
        {currentView === 'single-post' && (
          <div className="py-4 animate-fadeIn">
            <WordPressSinglePostView
              post={
                selectedBlogPost || {
                  id: selectedCustomPageSlug,
                  slug: selectedCustomPageSlug,
                  title: selectedCustomPageSlug
                    .split('-')
                    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
                    .join(' '),
                  category: 'Mandi Updates & Blog',
                  publishedDate: 'Recent',
                  readTime: '5 Min Read',
                  author: {
                    name: 'Hashir Rice Supplier',
                    role: 'Founder (Owner: Muhammad Amir Shahzad): Noor Galla Mandi, Bucheki',
                    avatar:
                      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200',
                  },
                  imageUrl:
                    'https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&q=80&w=1200',
                  excerpt:
                    'Direct wholesale rice market analysis from Hashir Rice Supplier at Noor Galla Mandi, Bucheki.',
                  keyTakeaways: [
                    'Direct Ex-Mill Wholesale Rice Sourcing from Noor Galla Mandi, Bucheki',
                    '100% Buhler Sortex Clean & 12.0% Max Moisture Certified Consignments',
                  ],
                  contentSections: [],
                  rawContent: '',
                  tags: ['Wholesale Rice', 'Bucheki Mandi'],
                  status: 'Published',
                }
              }
              onBack={() => {
                setCurrentView('blog');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              onOpenSampleModal={handleOpenSampleModal}
              onOpenQuoteModal={handleOpenQuoteModal}
              onInternalNavigate={(url) => {
                const clean = url.replace(/^\//, '');
                if (!clean) {
                  setCurrentView('home');
                } else {
                  window.location.href = `/${clean}`;
                }
              }}
            />
          </div>
        )}

        {/* LATEST PUBLISHED BLOG POSTS VIEW */}
        {currentView === 'news' && (
          <div className="py-4 animate-fadeIn">
            <BlogSection
              onOpenQuoteModal={handleOpenQuoteModal}
              onOpenSampleModal={handleOpenSampleModal}
              isFullPageView={true}
              onSelectPost={(post) => {
                setSelectedBlogPost(post);
                setSelectedCustomPageSlug(post.slug);
                setCurrentView('single-post');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
            />
            <QuoteEstimator onSuccessToast={showToast} />
            <ContactSection onSuccessToast={showToast} />
          </div>
        )}

        {/* SAMPLE REQUEST FULL PAGE VIEW */}
        {currentView === 'sample' && (
          <div className="animate-fadeIn">
            <SampleRequestPage
              onOpenQuoteModal={handleOpenQuoteModal}
              onOpenSampleModal={handleOpenSampleModal}
              setCurrentView={setCurrentView}
              onSuccessToast={showToast}
            />
          </div>
        )}

        {/* SELLER RICE SAMPLE MARKETPLACE VIEW */}
        {currentView === 'seller' && (
          <div className="animate-fadeIn">
            <SellerPortalPage
              onOpenSampleModal={handleOpenSampleModal}
              onOpenQuoteModal={handleOpenQuoteModal}
              setCurrentView={setCurrentView}
              onSuccessToast={showToast}
            />
          </div>
        )}

        {/* SITEMAP DIRECTORY & XML ENGINE VIEW */}
        {currentView === 'sitemap' && (
          <div className="animate-fadeIn">
            <SitemapPage
              setCurrentView={setCurrentView}
              onSelectCity={handleSelectCity}
              onSelectCommercialPage={handleSelectCommercialPage}
              onOpenQuoteModal={() => handleOpenQuoteModal()}
              onOpenSampleModal={() => handleOpenSampleModal()}
            />
          </div>
        )}

        {/* GOOGLE AI OVERVIEW & GENERATIVE SEARCH KNOWLEDGE HUB */}
        {(currentView === 'google-ai-overview' || currentView === 'ai-overview' || currentView === 'google-ai') && (
          <div className="animate-fadeIn">
            <GoogleAiOverviewPage
              onOpenQuoteModal={handleOpenQuoteModal}
              onOpenSampleModal={handleOpenSampleModal}
              setCurrentView={setCurrentView}
            />
          </div>
        )}

        {/* FAQS VIEW */}
        {currentView === 'faqs' && (
          <div className="py-8 animate-fadeIn">
            <FaqSection />
            <ContactSection onSuccessToast={showToast} />
          </div>
        )}

        {/* CONTACT VIEW */}
        {currentView === 'contact' && (
          <div className="py-8 animate-fadeIn">
            <ContactSection onSuccessToast={showToast} />
          </div>
        )}

        {/* CUSTOM WORDPRESS PAGE VIEW (page.php) */}
        {currentView === 'custom-page' && (
          <div className="py-2 animate-fadeIn">
            <WordPressSinglePageView
              page={
                selectedCustomPage ||
                (() => {
                  try {
                    const saved = localStorage.getItem('hashir_rice_admin_pages');
                    const all: WordPressPage[] = saved ? JSON.parse(saved) : DEFAULT_PAGES_DATA;
                    return all.find((p) => p.slug === selectedCustomPageSlug || p.id === selectedCustomPageSlug) || all[0];
                  } catch (e) {
                    return DEFAULT_PAGES_DATA[0];
                  }
                })()
              }
              onBack={() => {
                setCurrentView('home');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              onOpenSampleModal={handleOpenSampleModal}
              onOpenQuoteModal={handleOpenQuoteModal}
              onInternalNavigate={(url) => {
                const clean = url.replace(/^\/+|\/+$/g, '');
                if (!clean) {
                  setCurrentView('home');
                } else {
                  window.location.href = `/${clean}`;
                }
              }}
            />
          </div>
        )}
      </main>

      {/* Global Interactive Modals */}
      <ProductDetailModal
        variety={selectedVarietyDetail}
        onClose={() => setSelectedVarietyDetail(null)}
        onOpenQuoteModal={handleOpenQuoteModal}
        onOpenSampleModal={handleOpenSampleModal}
      />

      <QuoteModal
        isOpen={quoteModalOpen}
        onClose={() => {
          setQuoteModalOpen(false);
          setModalCityTarget(undefined);
        }}
        initialVariety={modalVarietyTarget}
        initialCity={modalCityTarget}
        onSuccessToast={showToast}
      />

      <SampleRequestModal
        isOpen={sampleModalOpen}
        onClose={() => {
          setSampleModalOpen(false);
          setModalCityTarget(undefined);
        }}
        initialVariety={modalVarietyTarget}
        initialCity={modalCityTarget}
        onSuccessToast={showToast}
      />

      {/* Floating WhatsApp Quick Action Button */}
      <FloatingWhatsApp />

      {/* Footer with Google Profile, Maps, and Comprehensive Links */}
      <Footer
        setCurrentView={setCurrentView}
        onOpenQuoteModal={handleOpenQuoteModal}
        onSelectCity={handleSelectCity}
        onSelectLahorePage={handleSelectLahorePage}
        onSelectKarachiPage={handleSelectKarachiPage}
        onSelectPeshawarPage={handleSelectPeshawarPage}
        onSelectQuettaPage={handleSelectQuettaPage}
        onSelectHyderabadPage={handleSelectHyderabadPage}
        onSelectFaisalabadPage={handleSelectFaisalabadPage}
      />

      {/* Floating Toast Notification */}
      {toastMessage && (
        <div className="fixed top-20 right-5 z-50 bg-emerald-950 text-white px-4 py-3 rounded-xl shadow-2xl border border-emerald-700 flex items-center gap-3 text-xs animate-bounce">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
}
