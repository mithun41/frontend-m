"use client";

import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';
import { ShoppingCart, User, ChevronDown, LogOut } from 'lucide-react';
import { useState, useEffect, Suspense } from 'react';
import { useAuthStore } from "@/store/useAuthStore";
import { useQuery } from "@tanstack/react-query";
import { cartService } from "@/lib/api/cartService";
import { categoryService, Category } from "@/lib/api/categoryService";

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
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenusOpen, setMobileMenusOpen] = useState<{[key: string]: boolean}>({});

  const user = useAuthStore(state => state.user);
  const logout = useAuthStore(state => state.logout);
  const [isMounted, setIsMounted] = useState(false);

  const { data: cart } = useQuery({
    queryKey: ["cart"],
    queryFn: cartService.getCart,
    enabled: !!user,
  });

  const { data: rawCategories } = useQuery({
    queryKey: ["categories"],
    queryFn: categoryService.getAll,
  });

  const cartItemsCount = cart?.items?.reduce((acc, item) => acc + item.quantity, 0) || 0;

  const navLinks = [
    { name: 'Home', href: '/' },
    { name: 'Shop', href: '/shop' },
    { name: 'Men', href: '/men', hasMegaMenu: true },
    { name: 'Women', href: '/women', hasMegaMenu: true },
    { name: 'Gym Accessories', href: '/gym-accessories', hasMegaMenu: true },
    { name: 'Gym Bag', href: '/gym-bag' },
    { name: 'About', href: '/about' },
    { name: 'Contact', href: '/contact' },
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
    setMobileMenusOpen(prev => ({...prev, [name]: !prev[name]}));
  };

  return (
    <nav
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-white/90 backdrop-blur-lg shadow-sm border-b border-gray-100 py-3'
          : 'bg-white py-5 shadow-sm'
      }`}
    >
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center transition-all duration-300">
          
          {/* Left: Logo */}
          <div className="flex-shrink-0 flex items-center cursor-pointer group">
            <Link href="/" className="flex items-center">
              <div className="w-10 h-10 rounded-full bg-primary-500 flex items-center justify-center mr-3 shadow-md group-hover:bg-primary-600 transition-colors duration-300">
                 <span className="text-white font-bold text-xl">BN</span>
              </div>
              <span className="text-2xl lg:text-3xl font-bold tracking-wide text-gray-900 group-hover:text-primary-600 transition-colors duration-300">
                Brand<span className="text-primary-500">Name</span>
              </span>
            </Link>
          </div>

          {/* Middle: Desktop Menu */}
          <div className="hidden lg:flex items-center space-x-8">
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
                    className={`relative flex items-center gap-1 py-2 text-[14px] font-semibold tracking-wide uppercase transition-colors duration-300 ${
                      isActive ? 'text-primary-600' : 'text-gray-600 group-hover:text-primary-600'
                    }`}
                  >
                    {link.name}
                    {link.hasMegaMenu && (
                      <ChevronDown className="w-4 h-4 transition-transform group-hover:rotate-180" />
                    )}
                    <span
                      className={`absolute bottom-0 left-0 h-[2px] bg-primary-600 transition-all duration-300 ease-out ${
                        isActive ? 'w-full' : 'w-0 group-hover:w-full'
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

          {/* Right: Cart, Login & Mobile Toggle */}
          <div className="flex items-center gap-4">
            {/* Desktop Cart & Login */}
            <div className="hidden sm:flex items-center gap-5">
              <Link href="/cart" className="relative text-gray-600 hover:text-primary-600 transition-colors duration-300 flex items-center gap-2 group">
                <ShoppingCart className="h-5 w-5 transition-transform group-hover:scale-110" />
                {isMounted && cartItemsCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-primary-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full min-w-[18px] text-center">
                    {cartItemsCount}
                  </span>
                )}
              </Link>
              
              <div className="h-5 w-px bg-gray-300"></div>
              
              {isMounted && user ? (
                <>
                  <Link href="/dashboard" className="text-gray-600 hover:text-primary-600 transition-colors duration-300 flex items-center gap-2 group" title="Dashboard">
                    <User className="h-5 w-5 transition-transform group-hover:scale-110" />
                  </Link>
                  <button onClick={logout} className="text-gray-600 hover:text-red-600 transition-colors duration-300 flex items-center gap-2 group" title="Logout">
                    <LogOut className="h-5 w-5 transition-transform group-hover:scale-110" />
                  </button>
                </>
              ) : (
                <Link href="/login" className="text-gray-600 hover:text-primary-600 transition-colors duration-300 flex items-center gap-2 group" title="Login">
                  <User className="h-5 w-5 transition-transform group-hover:scale-110" />
                </Link>
              )}
            </div>

            {/* Mobile Menu Button (Hamburger) */}
            <div className="lg:hidden flex items-center ml-2">
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
        className={`lg:hidden absolute w-full max-h-[85vh] overflow-y-auto bg-white border-t border-gray-100 shadow-xl transition-all duration-300 ease-in-out origin-top ${
          isOpen ? 'opacity-100 scale-y-100' : 'opacity-0 scale-y-0 pointer-events-none'
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
                    onClick={() => { if(!link.hasMegaMenu) setIsOpen(false); }}
                    className={`flex-1 block px-4 py-3 text-sm font-semibold uppercase tracking-wider rounded-lg transition-all duration-200 ${
                      isActive
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
          
          {/* Mobile Cart & Login */}
          <div className="pt-4 mt-4 border-t border-gray-100 sm:hidden flex flex-col gap-2">
            <Link href="/cart" onClick={() => setIsOpen(false)} className="flex items-center gap-3 px-4 py-3 text-sm font-semibold uppercase tracking-wider text-gray-600 hover:bg-gray-50 hover:text-primary-600 rounded-lg transition-all">
              <div className="relative">
                <ShoppingCart className="h-5 w-5" />
                {isMounted && cartItemsCount > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 bg-primary-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full min-w-[18px] text-center">
                    {cartItemsCount}
                  </span>
                )}
              </div>
              Cart
            </Link>
            
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
