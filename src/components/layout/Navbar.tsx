"use client";

import Link from 'next/link';
import { usePathname, useSearchParams, useRouter } from 'next/navigation';
import { ShoppingCart, User, ChevronDown, LogOut, Search } from 'lucide-react';
import { useState, useEffect, Suspense } from 'react';
import { useAuthStore } from "@/store/useAuthStore";
import { useCartStore } from "@/store/useCartStore";
import { useQuery } from "@tanstack/react-query";
import { categoryService, Category } from "@/lib/api/categoryService";
import { productService } from "@/lib/api/productService";
import { getImageUrl } from "@/utils/getImageUrl";

const megaMenuData = {
  categories: [
    {
      title: 'Tops',
      items: ['T-Shirts', 'Jackets', 'Tank Tops', 'Polo Shirts', 'Cycling Tops', 'Muscle Tank Tops', 'Compression T-Shirts', 'Hoodies & Sweatshirts'],
    },
    {
      title: 'Bottoms',
      items: ['Pants', 'Shorts', 'Joggers', '2 in 1 Shorts', 'Swim Shorts', 'Cycling Shorts', 'Compression Shorts', 'Compression Leggings'],
    },
    {
      title: 'Activity',
      items: ['Run', 'Train', 'Move', 'Golf'],
    },
    {
      title: 'Trending',
      items: ['Athleisure', 'Best Sellers', 'New Arrivals', 'Matching Sets', 'Breeze Edition', 'Everyday Essentials'],
    }
  ],
  images: [
    { src: 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?q=80&w=400&auto=format&fit=crop', alt: 'Model 1' },
    { src: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?q=80&w=400&auto=format&fit=crop', alt: 'Model 2' },
    { src: 'https://images.unsplash.com/photo-1556817411-31ae72fa3ea0?q=80&w=400&auto=format&fit=crop', alt: 'Model 3' },
  ]
};

export function Navbar() {
  return (
    <Suspense fallback={<div className="h-20 bg-white w-full fixed top-0 z-50"></div>}>
      <NavbarContent />
    </Suspense>
  );
}

function NavbarContent() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenusOpen, setMobileMenusOpen] = useState<{ [key: string]: boolean }>({});
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedQuery(searchQuery), 300);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  const { data: searchResults } = useQuery({
    queryKey: ['searchProducts', debouncedQuery],
    queryFn: async () => {
      if (!debouncedQuery.trim()) return [];
      const res = await productService.getProducts(1, { search: debouncedQuery });
      const products = res.results || [];
      const lowerQuery = debouncedQuery.toLowerCase();
      return products.filter(p => p.name.toLowerCase().includes(lowerQuery)).slice(0, 5);
    },
    enabled: debouncedQuery.trim().length > 0,
  });

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/shop?search=${encodeURIComponent(searchQuery.trim())}`);
      setIsSearchOpen(false);
      setSearchQuery('');
    }
  };

  const user = useAuthStore(state => state.user);
  const logout = useAuthStore(state => state.logout);
  const [isMounted, setIsMounted] = useState(false);

  const cartItemsCount = useCartStore(state => state.cart.items.reduce((acc, item) => acc + item.quantity, 0));

  const { data: rawCategories } = useQuery({
    queryKey: ["categories"],
    queryFn: categoryService.getAll,
  });

  const navLinks = [
    { name: 'Shop', href: '/shop' },
    { name: 'Men', href: '/men', hasMegaMenu: true },
    { name: 'Women', href: '/women', hasMegaMenu: true },
    { name: 'Gym Accessories', href: '/gym-accessories', hasMegaMenu: true },
    { name: 'Gym Bag', href: '/gym-bag' },
    { name: 'Track Order', href: '/track-order' },
  ];

  // Handle scroll effect & hydration
  useEffect(() => {
    setIsMounted(true);
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleMobileMenu = (name: string, e: React.MouseEvent) => {
    e.preventDefault();
    setMobileMenusOpen(prev => ({ ...prev, [name]: !prev[name] }));
  };

  return (
    <nav
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${scrolled
          ? 'bg-white/90 backdrop-blur-lg shadow-sm border-b border-gray-100 py-3'
          : 'bg-white py-5 shadow-sm'
        }`}
    >
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-12">
        <div className="flex justify-between items-center transition-all duration-300">

          {/* Left: Logo */}
          <div className="flex-1 flex items-center justify-start cursor-pointer group">
            <Link href="/" className="flex items-center gap-3">
              <img src="/logo.jpg" alt="Logo" className="h-10 w-auto object-contain rounded-md" />
              <span className="text-2xl lg:text-3xl font-extrabold tracking-wide text-gray-900 group-hover:text-primary-600 transition-colors duration-300">
                DRAVON
              </span>
            </Link>
          </div>

          {/* Middle: Desktop Menu */}
          <div className="hidden lg:flex flex-1 justify-center items-center space-x-4 xl:space-x-8">
            {navLinks.map((link, index) => {
              const normalizedLinkName = link.name.toLowerCase().replace(/\s+/g, ' ');
              const linkCategory = rawCategories?.find(c => c.name.toLowerCase().replace(/\s+/g, ' ') === normalizedLinkName);
              const isCategoryLink = ['Men', 'Women', 'Gym Accessories', 'Gym Bag'].includes(link.name);
              const dynamicHref = (isCategoryLink && linkCategory) ? `/shop?category=${encodeURIComponent(linkCategory.name)}` : link.href;
              const isActive = pathname === dynamicHref || (dynamicHref !== '/' && pathname.startsWith(dynamicHref.split('?')[0]) && searchParams.get('category') === linkCategory?.name);

              return (
                <div key={index} className="group relative">
                  <Link
                    href={dynamicHref}
                    className={`relative flex items-center gap-1 py-2 text-[13px] whitespace-nowrap font-semibold tracking-wide uppercase transition-colors duration-300 ${isActive ? 'text-primary-600' : 'text-gray-600 group-hover:text-primary-600'
                      }`}
                  >
                    {link.name}
                    {link.hasMegaMenu && (
                      <ChevronDown className="w-4 h-4 transition-transform group-hover:rotate-180" />
                    )}
                    <span
                      className={`absolute bottom-0 left-0 h-[2px] bg-primary-600 transition-all duration-300 ease-out ${isActive ? 'w-full' : 'w-0 group-hover:w-full'
                        }`}
                    ></span>
                  </Link>

                  {/* Mega Menu Dropdown */}
                  {link.hasMegaMenu && (
                    <div className="absolute top-full left-1/2 -translate-x-1/2 pt-6 w-[800px] xl:w-[900px] opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 ease-in-out z-50">
                      <div className="bg-white shadow-2xl border border-gray-100 p-8 rounded-xl cursor-default">
                        {/* Top categories */}
                        <div className="grid grid-cols-4 gap-8">
                          {(() => {
                            let displayCategories: { title: string; items: string[] }[] = [];

                            if (linkCategory && linkCategory.subcategories && linkCategory.subcategories.length > 0) {
                              const hasDeepSubcategories = linkCategory.subcategories.some(sub => sub.subcategories && sub.subcategories.length > 0);

                              if (hasDeepSubcategories) {
                                displayCategories = linkCategory.subcategories.map(sub => ({
                                  title: sub.name,
                                  items: sub.subcategories?.map(ss => ss.name) || []
                                }));
                              } else {
                                displayCategories = [{
                                  title: 'All Products',
                                  items: linkCategory.subcategories.map(sub => sub.name)
                                }];
                              }
                            }

                            return displayCategories.map((category, catIdx) => (
                              <div key={catIdx}>
                                <h3 className="text-sm font-bold text-gray-900 mb-4 border-b border-gray-100 pb-2">{category.title}</h3>
                                <ul className="space-y-3">
                                  {category.items.map((item, itemIdx) => (
                                    <li key={itemIdx}>
                                      <Link href={`/shop?category=${encodeURIComponent(item)}`} className="text-sm text-gray-500 hover:text-primary-600 transition-colors block">
                                        {item}
                                      </Link>
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            ));
                          })()}
                        </div>
                        {/* Bottom images */}
                        <div className="grid grid-cols-3 gap-6 mt-8 pt-8 border-t border-gray-100">
                          {megaMenuData.images.map((image, imgIdx) => (
                            <div key={imgIdx} className="group/img relative overflow-hidden bg-gray-100 rounded-lg aspect-[4/3]">
                              <img
                                src={image.src}
                                alt={image.alt}
                                className="w-full h-full object-cover transform transition-transform duration-700 group-hover/img:scale-105"
                              />
                              <div className="absolute inset-0 bg-black/5 group-hover/img:bg-black/10 transition-colors duration-300" />
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Right: Search, Cart, Login & Mobile Toggle */}
          <div className="flex-1 flex items-center justify-end gap-4 sm:gap-5">
            {/* Search */}
            <div className="relative flex items-center z-[60]">
              {isSearchOpen ? (
                <div className="absolute right-0 top-1/2 -translate-y-1/2 w-[220px] sm:w-[280px]">
                  <form onSubmit={handleSearchSubmit} className="flex items-center bg-white border border-gray-200 rounded-full px-3 py-1.5 shadow-md w-full transition-all">
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search products..."
                      className="w-full text-sm outline-none bg-transparent"
                      autoFocus
                    />
                    <button type="button" onClick={() => { setIsSearchOpen(false); setSearchQuery(''); }} className="text-gray-400 hover:text-gray-600 ml-2 font-bold text-lg leading-none">
                      &times;
                    </button>
                  </form>
                  
                  {/* Suggestions Dropdown */}
                  {debouncedQuery.trim().length > 0 && searchResults && searchResults.length > 0 && (
                    <div className="absolute top-full right-0 mt-2 w-full bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden">
                      <ul className="max-h-[60vh] overflow-y-auto py-2">
                        {searchResults.map(product => (
                          <li key={product.id}>
                            <Link 
                              href={`/shop/${product.id}`}
                              onClick={() => { setIsSearchOpen(false); setSearchQuery(''); }}
                              className="flex items-center gap-3 px-4 py-2 hover:bg-gray-50 transition-colors"
                            >
                              <img 
                                src={product.image_1 || "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=50&q=80"} 
                                alt={product.name} 
                                className="w-10 h-10 object-cover rounded-md"
                              />
                              <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-gray-900 truncate">{product.name}</p>
                                <p className="text-xs text-primary-600 font-bold">৳{parseFloat(product.selling_price || product.price || "0").toFixed(2)}</p>
                              </div>
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  {debouncedQuery.trim().length > 0 && searchResults && searchResults.length === 0 && (
                    <div className="absolute top-full right-0 mt-2 w-full bg-white rounded-xl shadow-xl border border-gray-100 p-4 text-center">
                      <p className="text-sm text-gray-500">No products found.</p>
                    </div>
                  )}
                </div>
              ) : (
                <button onClick={() => setIsSearchOpen(true)} className="text-gray-600 hover:text-primary-600 transition-colors duration-300 flex items-center group p-1">
                  <Search className="h-5 w-5 transition-transform group-hover:scale-110" />
                </button>
              )}
            </div>

            {/* Cart (Always visible) */}
            <Link href="/cart" className="relative text-gray-600 hover:text-primary-600 transition-colors duration-300 flex items-center group">
              <ShoppingCart className="h-5 w-5 transition-transform group-hover:scale-110" />
              {isMounted && cartItemsCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-primary-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full min-w-[18px] text-center">
                  {cartItemsCount}
                </span>
              )}
            </Link>

            <div className="hidden sm:block h-5 w-px bg-gray-300"></div>

            {/* Desktop Login (Hidden on mobile) */}
            <div className="hidden sm:flex items-center">
              {isMounted && user ? (
                <div className="relative group cursor-pointer">
                  <div className="flex items-center gap-2">
                    <div className="w-9 h-9 rounded-full overflow-hidden bg-gray-50 border-2 border-transparent group-hover:border-primary-500 transition-all duration-300 shadow-sm flex items-center justify-center">
                      {user.profile_pic ? (
                        <img src={getImageUrl(user.profile_pic) as string} alt={user.name} className="w-full h-full object-cover" />
                      ) : (
                        <User className="w-5 h-5 text-gray-400" />
                      )}
                    </div>
                  </div>
                  {/* Dropdown Menu */}
                  <div className="absolute right-0 top-full pt-4 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                    <div className="bg-white rounded-xl shadow-xl border border-gray-100 py-2 w-56 overflow-hidden transform origin-top-right scale-95 group-hover:scale-100 transition-transform">
                      <div className="px-4 py-3 border-b border-gray-50 bg-gray-50/50 mb-1">
                        <p className="text-sm font-bold text-gray-900 truncate">{user.name}</p>
                        <p className="text-xs text-gray-500 truncate mt-0.5">{user.email}</p>
                      </div>
                      <Link href="/dashboard" className="flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-gray-600 hover:text-primary-600 hover:bg-primary-50 transition-colors">
                        <User className="w-4 h-4" />
                        Dashboard
                      </Link>
                      <button onClick={logout} className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-gray-600 hover:text-red-600 hover:bg-red-50 transition-colors text-left">
                        <LogOut className="w-4 h-4" />
                        Logout
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <Link href="/login" className="text-gray-600 hover:text-primary-600 transition-colors duration-300 flex items-center gap-2 group" title="Login">
                  <User className="h-5 w-5 transition-transform group-hover:scale-110" />
                </Link>
              )}
            </div>

            {/* Mobile Menu Button (Hamburger) */}
            <div className="lg:hidden flex items-center ml-1">
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="text-gray-800 hover:text-primary-600 focus:outline-none p-2"
              >
                <div className="w-6 flex flex-col items-end justify-center gap-1.5">
                  <span className={`bg-current block transition-all duration-300 ease-out h-0.5 w-6 rounded-sm ${isOpen ? 'rotate-45 translate-y-2' : ''}`}></span>
                  <span className={`bg-current block transition-all duration-300 ease-out h-0.5 rounded-sm ${isOpen ? 'opacity-0' : 'w-5'}`}></span>
                  <span className={`bg-current block transition-all duration-300 ease-out h-0.5 w-6 rounded-sm ${isOpen ? '-rotate-45 -translate-y-2' : ''}`}></span>
                </div>
              </button>
            </div>
          </div>

        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      <div
        className={`lg:hidden absolute w-full max-h-[85vh] overflow-y-auto bg-white border-t border-gray-100 shadow-xl transition-all duration-300 ease-in-out origin-top ${isOpen ? 'opacity-100 scale-y-100' : 'opacity-0 scale-y-0 pointer-events-none'
          }`}
      >
        <div className="px-4 pt-4 pb-8 space-y-2">
          {navLinks.map((link, index) => {
            const normalizedLinkName = link.name.toLowerCase().replace(/\s+/g, ' ');
            const linkCategory = rawCategories?.find(c => c.name.toLowerCase().replace(/\s+/g, ' ') === normalizedLinkName);
            const isCategoryLink = ['Men', 'Women', 'Gym Accessories', 'Gym Bag'].includes(link.name);
            const dynamicHref = (isCategoryLink && linkCategory) ? `/shop?category=${encodeURIComponent(linkCategory.name)}` : link.href;
            const isActive = pathname === dynamicHref || (dynamicHref !== '/' && pathname.startsWith(dynamicHref.split('?')[0]) && searchParams.get('category') === linkCategory?.name);
            const isSubMenuOpen = mobileMenusOpen[link.name];

            return (
              <div key={index}>
                <div className="flex items-center">
                  <Link
                    href={dynamicHref}
                    onClick={() => { if (!link.hasMegaMenu) setIsOpen(false); }}
                    className={`flex-1 block px-4 py-3 text-sm font-semibold uppercase tracking-wider rounded-lg transition-all duration-200 ${isActive
                        ? 'bg-primary-50 text-primary-700 border-l-4 border-primary-600'
                        : 'text-gray-600 hover:bg-gray-50 hover:text-primary-600 hover:border-l-4 hover:border-primary-300'
                      }`}
                  >
                    {link.name}
                  </Link>
                  {link.hasMegaMenu && (
                    <button
                      onClick={(e) => toggleMobileMenu(link.name, e)}
                      className="p-3 text-gray-500 hover:text-primary-600 transition-colors"
                    >
                      <ChevronDown className={`w-5 h-5 transition-transform ${isSubMenuOpen ? 'rotate-180' : ''}`} />
                    </button>
                  )}
                </div>

                {/* Mobile Submenu */}
                {link.hasMegaMenu && isSubMenuOpen && (
                  <div className="pl-8 pr-4 py-2 space-y-4 bg-gray-50 rounded-lg mt-1 border border-gray-100">
                    {(() => {
                      let displayCategories: { title: string; items: string[] }[] = [];

                      if (linkCategory && linkCategory.subcategories && linkCategory.subcategories.length > 0) {
                        const hasDeepSubcategories = linkCategory.subcategories.some(sub => sub.subcategories && sub.subcategories.length > 0);

                        if (hasDeepSubcategories) {
                          displayCategories = linkCategory.subcategories.map(sub => ({
                            title: sub.name,
                            items: sub.subcategories?.map(ss => ss.name) || []
                          }));
                        } else {
                          displayCategories = [{
                            title: 'All Products',
                            items: linkCategory.subcategories.map(sub => sub.name)
                          }];
                        }
                      }

                      return displayCategories.map((category, catIdx) => (
                        <div key={catIdx}>
                          <h4 className="text-xs font-bold text-gray-900 mb-2 uppercase">{category.title}</h4>
                          <ul className="space-y-2">
                            {category.items.map((item, itemIdx) => (
                              <li key={itemIdx}>
                                <Link
                                  href={`/shop?category=${encodeURIComponent(item)}`}
                                  onClick={() => setIsOpen(false)}
                                  className="text-sm text-gray-500 hover:text-primary-600 block py-1"
                                >
                                  {item}
                                </Link>
                              </li>
                            ))}
                          </ul>
                        </div>
                      ));
                    })()}
                  </div>
                )}
              </div>
            );
          })}

          {/* Mobile Login & Dashboard */}
          <div className="pt-4 mt-4 border-t border-gray-100 sm:hidden flex flex-col gap-2">
            {isMounted && user ? (
              <>
                <Link
                  href="/dashboard"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center gap-3 px-4 py-3 text-sm font-semibold uppercase tracking-wider text-gray-600 hover:bg-gray-50 hover:text-primary-600 rounded-lg transition-all"
                >
                  <User className="h-5 w-5" />
                  Dashboard
                </Link>
                <button
                  onClick={() => {
                    logout();
                    setIsOpen(false);
                  }}
                  className="flex items-center gap-3 px-4 py-3 text-sm font-semibold uppercase tracking-wider text-gray-600 hover:bg-gray-50 hover:text-red-600 rounded-lg transition-all text-left w-full"
                >
                  <LogOut className="h-5 w-5" />
                  Logout
                </button>
              </>
            ) : (
              <Link
                href="/login"
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-3 px-4 py-3 text-sm font-semibold uppercase tracking-wider text-gray-600 hover:bg-gray-50 hover:text-primary-600 rounded-lg transition-all"
              >
                <User className="h-5 w-5" />
                Login
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
