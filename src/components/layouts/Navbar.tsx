"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ShoppingCart, User } from 'lucide-react';
import { useState, useEffect } from 'react';

export function Navbar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const navLinks = [
    { name: 'Home', href: '/' },
    { name: 'Shop', href: '/shop' },
    { name: 'Categories', href: '/categories' },
    { name: 'About', href: '/about' },
  ];

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-white/90 backdrop-blur-lg shadow-sm border-b border-gray-100 py-3'
          : 'bg-white py-5 shadow-sm'
      }`}
    >
      <div className="max-w-11/12 mx-auto px-4 sm:px-6 lg:px-8">
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
              const isActive = pathname === link.href || (link.href !== '/' && pathname.startsWith(link.href));
              return (
                <Link
                  key={index}
                  href={link.href}
                  className={`relative group px-1 py-2 text-[14px] font-semibold tracking-wide uppercase transition-colors duration-300 ${
                    isActive ? 'text-primary-600' : 'text-gray-600 hover:text-primary-600'
                  }`}
                >
                  {link.name}
                  <span
                    className={`absolute bottom-0 left-0 h-[2px] bg-primary-600 transition-all duration-300 ease-out ${
                      isActive ? 'w-full' : 'w-0 group-hover:w-full'
                    }`}
                  ></span>
                </Link>
              );
            })}
          </div>

          {/* Right: Cart, Login & Mobile Toggle */}
          <div className="flex items-center gap-4">
            {/* Desktop Cart & Login */}
            <div className="hidden sm:flex items-center gap-5">
              <button className="text-gray-600 hover:text-primary-600 transition-colors duration-300 flex items-center gap-2 group">
                <ShoppingCart className="h-5 w-5 transition-transform group-hover:scale-110" />
                
              </button>
              
              <div className="h-5 w-px bg-gray-300"></div>
              
              <Link href="/login" className="text-gray-600 hover:text-primary-600 transition-colors duration-300 flex items-center gap-2 group">
                <User className="h-5 w-5 transition-transform group-hover:scale-110" />
              </Link>
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
        className={`lg:hidden absolute w-full bg-white border-t border-gray-100 shadow-xl transition-all duration-300 ease-in-out origin-top ${
          isOpen ? 'opacity-100 scale-y-100' : 'opacity-0 scale-y-0 pointer-events-none'
        }`}
      >
        <div className="px-4 pt-4 pb-8 space-y-2">
          {navLinks.map((link, index) => {
            const isActive = pathname === link.href || (link.href !== '/' && pathname.startsWith(link.href));
            return (
              <Link
                key={index}
                href={link.href}
                onClick={() => setIsOpen(false)}
                className={`block px-4 py-3 text-sm font-semibold uppercase tracking-wider rounded-lg transition-all duration-200 ${
                  isActive
                    ? 'bg-primary-50 text-primary-700 border-l-4 border-primary-600'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-primary-600 hover:border-l-4 hover:border-primary-300'
                }`}
              >
                {link.name}
              </Link>
            );
          })}
          
          {/* Mobile Cart & Login */}
          <div className="pt-4 mt-4 border-t border-gray-100 sm:hidden flex flex-col gap-2">
            <button className="flex items-center gap-3 px-4 py-3 text-sm font-semibold uppercase tracking-wider text-gray-600 hover:bg-gray-50 hover:text-primary-600 rounded-lg transition-all">
              <ShoppingCart className="h-5 w-5" />
              Cart
            </button>
            <Link 
              href="/login" 
              onClick={() => setIsOpen(false)} 
              className="flex items-center gap-3 px-4 py-3 text-sm font-semibold uppercase tracking-wider text-gray-600 hover:bg-gray-50 hover:text-primary-600 rounded-lg transition-all"
            >
              <User className="h-5 w-5" />
              Login
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
