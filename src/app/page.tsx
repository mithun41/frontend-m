import Link from "next/link";
import Image from "next/image";
import { HeroSlider } from "@/components/home/HeroSlider";
import { Navbar } from "@/components/layouts/Navbar";
import { Footer } from "@/components/layouts/Footer";

export default function HomePage() {
  const categories = [
    { name: "MEN", image: "https://images.unsplash.com/photo-1516826957135-700ede19c6e4?w=800&q=80" },
    { name: "WOMEN", image: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=800&q=80" },
    { name: "UNISEX", image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&q=80" },
  ];

  const newArrivals = [
    {
      id: "na_1",
      name: "Premium Active Fit Tee",
      price: "1,250 BDT",
      image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500&q=80",
    },
    {
      id: "na_2",
      name: "Performance Shorts",
      price: "1,850 BDT",
      image: "https://images.unsplash.com/photo-1591561954557-26941169b49e?w=500&q=80",
    },
    {
      id: "na_3",
      name: "Seamless Sports Bra",
      price: "1,450 BDT",
      image: "https://images.unsplash.com/photo-1620799140188-3b2a02fd9a77?w=500&q=80",
    },
    {
      id: "na_4",
      name: "Lightweight Run Jacket",
      price: "3,200 BDT",
      image: "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=500&q=80",
    },
  ];

  const bestSelling = [
    {
      id: "bs_1",
      name: "Everyday Yoga Leggings",
      price: "2,100 BDT",
      image: "https://images.unsplash.com/photo-1506629082955-511b1aa562c8?w=500&q=80",
    },
    {
      id: "bs_2",
      name: "Core Tech Hoodie",
      price: "2,800 BDT",
      image: "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=500&q=80",
    },
    {
      id: "bs_3",
      name: "Pro Grip Training Gloves",
      price: "850 BDT",
      image: "https://images.unsplash.com/photo-1583416750470-965b2707b355?w=500&q=80",
    },
    {
      id: "bs_4",
      name: "Studio Duffel Bag",
      price: "3,500 BDT",
      image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500&q=80",
    },
  ];

  return (
    <>
      <Navbar />
      <main className="flex-1 flex flex-col pt-20">
        <div className="flex flex-col min-h-screen bg-white text-black">
          {/* Hero Banner */}
          <HeroSlider />

          {/* LIVE LIMITLESS (Categories) */}
          <section className="py-12 px-4 sm:px-8 lg:px-16 max-w-[1600px] mx-auto w-full">
            <div className="relative w-full flex flex-col md:flex-row gap-4 h-[500px] sm:h-[600px]">
              {/* Left Image */}
              <div className="relative flex-1 h-full overflow-hidden">
                <Image
                  src="https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=800&q=80"
                  alt="Men's Collection"
                  fill
                  className="object-cover hover:scale-105 transition-transform duration-700 ease-out"
                />
              </div>
              {/* Right Image */}
              <div className="relative flex-1 h-full overflow-hidden">
                <Image
                  src="https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=800&q=80"
                  alt="Women's Collection"
                  fill
                  className="object-cover hover:scale-105 transition-transform duration-700 ease-out"
                />
              </div>
              
              {/* Center Overlay */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white/90 backdrop-blur-sm w-[85%] md:w-[650px] p-8 sm:p-14 flex flex-col items-center text-center shadow-lg">
                <h2 className="text-2xl sm:text-4xl font-bold tracking-widest uppercase mb-4 text-black">
                  Live Limitless
                </h2>
                <p className="text-[10px] sm:text-xs tracking-[0.3em] uppercase text-gray-700 mb-10">
                  Checkout Our Collection
                </p>
                <div className="flex flex-col sm:flex-row gap-6 sm:gap-16 w-full justify-center">
                  <Link href="/categories/men" className="text-sm font-semibold tracking-wider text-black border-b border-gray-400 pb-1 hover:border-black transition-colors">
                    Men's Collection
                  </Link>
                  <Link href="/categories/women" className="text-sm font-semibold tracking-wider text-black border-b border-gray-400 pb-1 hover:border-black transition-colors">
                    Women's Collection
                  </Link>
                </div>
              </div>
            </div>
          </section>

          {/* NEW ARRIVALS (Product Grid) */}
          <section className="py-16 px-4 sm:px-8 lg:px-16 max-w-[1600px] mx-auto w-full">
            <h2 className="text-2xl sm:text-3xl font-bold tracking-[0.2em] uppercase text-center mb-10">
              New Arrivals
            </h2>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
              {newArrivals.map((product) => (
                <Link href={`/products/${product.id}`} key={product.id} className="group flex flex-col">
                  <div className="relative aspect-square w-full overflow-hidden bg-gray-100 mb-4">
                    <Image
                      src={product.image}
                      alt={product.name}
                      fill
                      className="object-cover"
                    />
                    {/* Hover Overlay */}
                    <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </div>
                  <div className="flex flex-col gap-1 px-1">
                    <h3 className="text-sm font-medium text-gray-900 line-clamp-1">
                      {product.name}
                    </h3>
                    <div className="flex items-center gap-1 text-sm font-semibold">
                      {product.price}
                      <span className="text-[10px] text-gray-500 font-normal ml-1">+ VAT</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </section>

          {/* PROMO BANNER */}
          <section className="relative w-full h-[700px] my-12">
            <Link href="/products">
            <Image
              src="/promo.jpg"
              alt="Promo Banner"
              fill
              className="object-cover"
            /></Link>
          </section>

          {/* BEST SELLING */}
          <section className="py-16 px-4 sm:px-8 lg:px-16 max-w-[1600px] mx-auto w-full">
            <h2 className="text-2xl sm:text-3xl font-bold tracking-[0.2em] uppercase text-center mb-10">
              Best Selling
            </h2>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
              {bestSelling.map((product) => (
                <Link href={`/products/${product.id}`} key={product.id} className="group flex flex-col">
                  <div className="relative aspect-square w-full overflow-hidden bg-gray-100 mb-4">
                    <Image
                      src={product.image}
                      alt={product.name}
                      fill
                      className="object-cover"
                    />
                    <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </div>
                  <div className="flex flex-col gap-1 px-1">
                    <h3 className="text-sm font-medium text-gray-900 line-clamp-1">
                      {product.name}
                    </h3>
                    <div className="flex items-center gap-1 text-sm font-semibold">
                      {product.price}
                      <span className="text-[10px] text-gray-500 font-normal ml-1">+ VAT</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </section>

          {/* NEWSLETTER */}
          <section className="py-24 px-6 sm:px-12 lg:px-24 bg-black text-white text-center w-full flex flex-col items-center">
            <div className="max-w-xl flex flex-col items-center gap-6 w-full">
              <h2 className="text-2xl sm:text-3xl font-bold tracking-[0.1em] uppercase">
                Join Our Community
              </h2>
              <p className="text-gray-400 text-sm">
                Sign up to receive early access to new releases, exclusive events, and athletic inspiration.
              </p>
              <div className="flex w-full max-w-md mt-4 border-b border-gray-600 pb-2 focus-within:border-white transition-colors">
                <input
                  type="email"
                  placeholder="Enter your email address"
                  className="bg-transparent text-white placeholder-gray-500 focus:outline-none flex-grow px-2 text-sm"
                  required
                />
                <button className="text-sm font-bold uppercase tracking-wider hover:text-gray-300 transition-colors pl-4 border-l border-gray-600 ml-2 py-1">
                  Subscribe
                </button>
              </div>
            </div>
          </section>
        </div>
      </main>
      <Footer />
    </>
  );
}
