import { useState, useEffect } from 'react';
import Background from './components/Background';
import Navbar from './components/Navbar';
import NightOliveHero from './components/NightOliveHero';
import Menu from './components/Menu';
import Footer from './components/Footer';
import IntroAnimation from './components/IntroAnimation';
import CatchABreak from './components/CatchABreak';
import EditorialGallery from './components/EditorialGallery';
import HeroToGalleryTransition from './components/HeroToGalleryTransition';
import ViewMenuCTA from './components/ViewMenuCTA';
import ContactSection from './components/ContactSection';
import SiteFooter from './components/SiteFooter';
import WhatsAppButton from './components/WhatsAppButton';
import ColdDrinksPage from './components/ColdDrinksPage';
import DessertsPage from './components/DessertsPage';
import HotDrinksPage from './components/HotDrinksPage';
import ShishaPage from './components/ShishaPage';
import CategoryListPage, { type CategoryTheme, type CategoryProduct } from './components/CategoryListPage';
import { coldDrinks } from './data/coldDrinks';
import { hotDrinks } from './data/hotDrinks';
import { desserts } from './data/desserts';
import { shishaItems } from './data/shisha';

type Category = 'cold-drinks' | 'hot-drinks' | 'desserts' | 'shisha';

type ParsedRoute =
  | { name: 'home' }
  | { name: 'menu' }
  | { name: 'list'; category: Category }
  | { name: 'detail'; category: Category; slug: string };

function parseRoute(): ParsedRoute {
  const hash = window.location.hash.replace(/^#/, '');
  const listMatch = hash.match(/^\/menu\/(cold-drinks|hot-drinks|desserts|shisha)$/);
  if (listMatch) return { name: 'list', category: listMatch[1] as Category };
  const detailMatch = hash.match(/^\/menu\/(cold-drinks|hot-drinks|desserts|shisha)\/(.+)$/);
  if (detailMatch) return { name: 'detail', category: detailMatch[1] as Category, slug: detailMatch[2] };
  if (hash === '/menu') return { name: 'menu' };
  return { name: 'home' };
}

const COLD_THEME: CategoryTheme = {
  bgGradient: 'linear-gradient(160deg,#0a1929,#0e2a4a 55%,#06203a)',
  cardBg: 'rgba(255,255,255,0.06)',
  cardBorder: 'rgba(125,211,252,0.22)',
  text: '#f1f5f9',
  subtext: '#94a3b8',
  price: '#7dd3fc',
  accent: '#38bdf8',
};

const HOT_THEME: CategoryTheme = {
  bgGradient: 'linear-gradient(160deg,#1a0e08,#2e1a0c 55%,#1c0f06)',
  cardBg: 'rgba(255,255,255,0.05)',
  cardBorder: 'rgba(252,211,170,0.22)',
  text: '#fdf6e3',
  subtext: '#c9a57b',
  price: '#fbbf24',
  accent: '#f59e0b',
};

const DESSERT_THEME: CategoryTheme = {
  bgGradient: 'linear-gradient(160deg,#2a1a1f,#3d2438 55%,#241420)',
  cardBg: 'rgba(255,255,255,0.06)',
  cardBorder: 'rgba(251,207,232,0.24)',
  text: '#fdf2f8',
  subtext: '#d4a5b8',
  price: '#f9a8d4',
  accent: '#ec4899',
};

const SHISHA_THEME: CategoryTheme = {
  bgGradient: 'linear-gradient(160deg,#0a0a0a,#1a1410 55%,#080606)',
  cardBg: 'rgba(255,255,255,0.04)',
  cardBorder: 'rgba(168,140,100,0.22)',
  text: '#f5f5f4',
  subtext: '#a8a29e',
  price: '#d4a017',
  accent: '#a16207',
};

function toListProducts(items: { name: string; description: string; price: string; image: string | null; themeColor: string; id?: string }[]): CategoryProduct[] {
  return items.map(p => ({ id: p.id || p.name, name: p.name, description: p.description, price: p.price, image: p.image, themeColor: p.themeColor }));
}

const CATEGORY_DATA: Record<Category, { title: string; subtitle: string; theme: CategoryTheme; products: CategoryProduct[]; listHash: string }> = {
  'cold-drinks': { title: 'Cold Drinks', subtitle: 'Chilled & Refreshing', theme: COLD_THEME, products: toListProducts(coldDrinks), listHash: '/menu/cold-drinks' },
  'hot-drinks': { title: 'Hot Drinks', subtitle: 'Warm & Aromatic', theme: HOT_THEME, products: toListProducts(hotDrinks), listHash: '/menu/hot-drinks' },
  'desserts': { title: 'Desserts', subtitle: 'Sweet Indulgence', theme: DESSERT_THEME, products: toListProducts(desserts), listHash: '/menu/desserts' },
  'shisha': { title: '2aragile', subtitle: 'Premium Flavors', theme: SHISHA_THEME, products: toListProducts(shishaItems), listHash: '/menu/shisha' },
};

export default function App() {
  const [showIntro, setShowIntro] = useState(true);
  const [route, setRoute] = useState<ParsedRoute>(parseRoute);

  useEffect(() => {
    const onHashChange = () => {
      setRoute(parseRoute());
      window.scrollTo({ top: 0 });
    };
    window.addEventListener('hashchange', onHashChange);
    return () => window.removeEventListener('hashchange', onHashChange);
  }, []);

  // Show/hide the gallery logo based on scroll position
  useEffect(() => {
    const onScroll = () => {
      const transition = document.querySelector('.noh-transition') as HTMLElement | null;
      const galleryLogo = document.querySelector('.noh-gallery-logo') as HTMLElement | null;
      if (!transition || !galleryLogo) return;
      const rect = transition.getBoundingClientRect();
      const total = rect.height - window.innerHeight;
      const scrolled = -rect.top;
      const progress = total > 0 ? Math.min(Math.max(scrolled / total, 0), 1) : 0;
      // Show when transition is ~90% complete, hide when gallery section is scrolled past
      const gallery = document.getElementById('gallery');
      const galleryRect = gallery?.getBoundingClientRect();
      const galleryVisible = galleryRect ? galleryRect.bottom > 100 : false;
      if (progress > 0.9 && galleryVisible) {
        galleryLogo.classList.add('visible');
      } else {
        galleryLogo.classList.remove('visible');
      }
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const navigateHome = () => { window.location.hash = '/'; };
  const navigateMenu = () => { window.location.hash = '/menu'; };
  const navigateList = (cat: Category) => { window.location.hash = CATEGORY_DATA[cat].listHash; };
  const navigateDetail = (cat: Category, slug: string) => { window.location.hash = `/menu/${cat}/${slug}`; };

  const scrollToBooking = () => {
    const el = document.getElementById('booking');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
    else document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
  };

  // Dedicated menu page
  if (route.name === 'menu') {
    return (
      <>
        <div className="relative min-h-screen bg-stone-100">
          <Background />
          <Navbar navigate={navigateMenu} route={'menu'} />
          <main className="relative z-10">
            <Menu
              onBack={navigateHome}
              onHotDrinks={() => navigateList('hot-drinks')}
              onColdDrinks={() => navigateList('cold-drinks')}
              onDesserts={() => navigateList('desserts')}
              onShisha={() => navigateList('shisha')}
            />
          </main>
          <SiteFooter navigate={navigateMenu} onBook={scrollToBooking} />
          <WhatsAppButton />
        </div>
      </>
    );
  }

  // Category list page
  if (route.name === 'list') {
    const data = CATEGORY_DATA[route.category];
    return (
      <>
        <CategoryListPage
          title={data.title}
          subtitle={data.subtitle}
          theme={data.theme}
          products={data.products}
          navigate={() => navigateHome()}
          onBack={navigateMenu}
          onProduct={(slug) => navigateDetail(route.category, slug)}
        />
        <WhatsAppButton />
      </>
    );
  }

  // Product detail routes — render existing detail page with initialSlug + Back button
  if (route.name === 'detail') {
    const back = () => navigateList(route.category);
    if (route.category === 'cold-drinks') {
      return (<><ColdDrinksPage navigate={navigateMenu} onBack={back} initialSlug={route.slug} /><WhatsAppButton /></>);
    }
    if (route.category === 'hot-drinks') {
      return (<><HotDrinksPage navigate={navigateMenu} onBack={back} initialSlug={route.slug} /><WhatsAppButton /></>);
    }
    if (route.category === 'desserts') {
      return (<><DessertsPage navigate={navigateMenu} onBack={back} initialSlug={route.slug} /><WhatsAppButton /></>);
    }
    if (route.category === 'shisha') {
      return (<><ShishaPage navigate={navigateMenu} onBack={back} /><WhatsAppButton /></>);
    }
  }

  return (
    <>
      {showIntro && <IntroAnimation onComplete={() => setShowIntro(false)} />}
      <div className="relative min-h-screen bg-stone-100">
        <Background />
        <Navbar navigate={navigateMenu} route={'home'} />
        <main className="relative z-10">
          <HeroToGalleryTransition
            hero={<NightOliveHero onViewMenu={navigateMenu} onBook={scrollToBooking} introDone={!showIntro} />}
          />
          {/* Logo stays visible at center-top after transition */}
          <div className="noh-gallery-logo" aria-hidden>
            <img src="/oliva-logo.jpg" alt="" className="w-full h-full object-cover" draggable={false} />
          </div>
          <EditorialGallery />
          <CatchABreak onBook={scrollToBooking} />
          <ViewMenuCTA onViewMenu={navigateMenu} />
          <ContactSection />
        </main>
        <SiteFooter navigate={navigateMenu} onBook={scrollToBooking} />
        <WhatsAppButton />
      </div>
    </>
  );
}
