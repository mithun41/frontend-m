export const dynamic = "force-dynamic";

import Link from "next/link";
import Image from "next/image";
import { HeroSlider } from "@/components/home/HeroSlider";
import { VideoSection } from "@/components/home/VideoSection";
import { InstagramSection } from "@/components/home/InstagramSection";
import { AddToCartIcon } from "@/components/shop/AddToCartIcon";
import { OrderNowButton } from "@/components/shop/OrderNowButton";

import { productService, Product } from "@/lib/api/productService";

import { bannerService, Banner } from "@/lib/api/bannerService";

export default async function HomePage() {
  const categories = [
    { name: "MEN", image: "https://images.unsplash.com/photo-1516826957135-700ede19c6e4?w=800&q=80" },
    { name: "WOMEN", image: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=800&q=80" },
    { name: "UNISEX", image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&q=80" },
  ];

  // Fetch banners
  let banners: Banner[] = [];
  try {
    banners = await bannerService.getAll();
    banners = banners.filter(b => b.is_active);
  } catch (error) {
    console.error("Error fetching banners:", error);
  }

  // Fetch new arrivals (latest 4 products)
  let newArrivals: Product[] = [];
  try {
    const newArrivalsResponse = await productService.getProducts(1, { ordering: '-created_at' });
    newArrivals = newArrivalsResponse.results.slice(0, 4);
  } catch (error) {
    console.error("Error fetching new arrivals:", error);
  }

  // Fetch best selling (top 4 sold products)
  let bestSelling: Product[] = [];
  try {
    const bestSellingResponse = await productService.getProducts(1, { ordering: '-sold_quantity' });
    bestSelling = bestSellingResponse.results.slice(0, 4);
  } catch (error) {
    console.error("Error fetching best selling:", error);
  }

  return (
    <div className="flex flex-col min-h-screen bg-white text-black">
      {/* Hero Banner */}
          <HeroSlider initialBanners={banners} />
     
          {/* LIVE LIMITLESS (Categories) */}
          <section className="py-12 px-4 sm:px-8 lg:px-16 max-w-[1600px] mx-auto w-full">
            <div className="relative w-full flex flex-col md:flex-row gap-4 h-[500px] sm:h-[600px]">
              {/* Left Image */}
              <div className="relative flex-1 h-full overflow-hidden">
                <Image
                  src="https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=800&q=80"
                  alt="Men's Collection"
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-cover hover:scale-105 transition-transform duration-700 ease-out"
                />
              </div>
              {/* Right Image */}
              <div className="relative flex-1 h-full overflow-hidden">
                <Image
                  src="https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=800&q=80"
                  alt="Women's Collection"
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
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
                  <Link href="shop?category=Men" className="text-sm font-semibold tracking-wider text-black border-b border-gray-400 pb-1 hover:border-black transition-colors">
                    Men's Collection
                  </Link>
                  <Link href="shop?category=Women" className="text-sm font-semibold tracking-wider text-black border-b border-gray-400 pb-1 hover:border-black transition-colors">
                    Women's Collection
                  </Link>
                </div>
              </div>
            </div>
          </section>
           <section className="relative w-full h-[300px] sm:h-[400px] md:h-[500px] lg:h-[600px] xl:h-[700px] my-8 sm:my-12">
            <Link href="/shop" className="relative block w-full h-full">
              <Image
                src="/promo.jpg"
                alt="Promo Banner"
                fill
                sizes="100vw"
                className="object-cover"
              />
            </Link>
          </section>

          {/* NEW ARRIVALS (Product Grid) */}
          <section className="py-16 px-4 sm:px-8 lg:px-16 max-w-[1600px] mx-auto w-full">
            <h2 className="text-2xl sm:text-3xl font-bold tracking-[0.2em] uppercase text-center mb-10">
              New Arrivals
            </h2>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
              {newArrivals.map((product) => (
                <div key={product.id} className="group flex flex-col">
                  <div className="relative aspect-square w-full overflow-hidden bg-gray-100 mb-4">
                    <Link href={`/shop/${product.id}`} className="absolute inset-0 z-0">
                      <Image
                        src={product.image_1 || "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500&q=80"}
                        alt={product.name}
                        fill
                        sizes="(max-width: 768px) 50vw, 25vw"
                        className="object-cover"
                        unoptimized
                      />
                      {/* Hover Overlay */}
                      <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    </Link>
                    
                    {/* Add to Cart Icon Overlay */}
                    <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0 z-10">
                      <AddToCartIcon product={product} />
                    </div>
                  </div>
                  <div className="flex flex-col gap-1 px-1">
                    <Link href={`/shop/${product.id}`}>
                      <h3 className="text-sm font-medium text-gray-900 line-clamp-1 hover:underline">
                        {product.name}
                      </h3>
                    </Link>
                    <div className="flex items-center gap-1.5 text-sm font-semibold">
                      <div className="flex items-center gap-1.5">
                        <span className="text-black">
                          ৳{parseFloat(product.price || product.selling_price || "0").toFixed(2)}
                        </span>
                        {product.offer_price && parseFloat(product.offer_price) > 0 && (
                          <span className="text-xs text-gray-500 line-through">
                            ৳{parseFloat(product.selling_price || "0").toFixed(2)}
                          </span>
                        )}
                      </div>
                      <span className="text-[10px] text-gray-500 font-normal ml-1">+ VAT</span>
                    </div>
                    <div className="mt-1">
                      <OrderNowButton product={product} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
          
           <VideoSection />

          {/* BEST SELLING */}
          <section className="py-16 px-4 sm:px-8 lg:px-16 max-w-[1600px] mx-auto w-full">
            <h2 className="text-2xl sm:text-3xl font-bold tracking-[0.2em] uppercase text-center mb-10">
              Best Selling
            </h2>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
              {bestSelling.map((product) => (
                <div key={product.id} className="group flex flex-col">
                  <div className="relative aspect-square w-full overflow-hidden bg-gray-100 mb-4">
                    <Link href={`/shop/${product.id}`} className="absolute inset-0 z-0">
                      <Image
                        src={product.image_1 || "https://images.unsplash.com/photo-1506629082955-511b1aa562c8?w=500&q=80"}
                        alt={product.name}
                        fill
                        sizes="(max-width: 768px) 50vw, 25vw"
                        className="object-cover"
                        unoptimized
                      />
                      <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    </Link>
                    
                    <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0 z-10">
                      <AddToCartIcon product={product} />
                    </div>
                  </div>
                  <div className="flex flex-col gap-1 px-1">
                    <Link href={`/shop/${product.id}`}>
                      <h3 className="text-sm font-medium text-gray-900 line-clamp-1 hover:underline">
                        {product.name}
                      </h3>
                    </Link>
                    <div className="flex items-center gap-1.5 text-sm font-semibold">
                      <div className="flex items-center gap-1.5">
                        <span className="text-black">
                          ৳{parseFloat(product.price || product.selling_price || "0").toFixed(2)}
                        </span>
                        {product.offer_price && parseFloat(product.offer_price) > 0 && (
                          <span className="text-xs text-gray-500 line-through">
                            ৳{parseFloat(product.selling_price || "0").toFixed(2)}
                          </span>
                        )}
                      </div>
                      <span className="text-[10px] text-gray-500 font-normal ml-1">+ VAT</span>
                    </div>
                    <div className="mt-1">
                      <OrderNowButton product={product} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
          {/* VIDEO SECTION */}
          <VideoSection />
          
          {/* INSTAGRAM SECTION */}
          <InstagramSection />
          
        </div>
  );
}
