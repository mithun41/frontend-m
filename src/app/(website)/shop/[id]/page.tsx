import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

// Mock data (same as shop/page.tsx)
const allProducts = [
  { id: "prod_1", name: "Premium Smart Watch", price: "4,590 BDT", priceValue: 4590, category: "Accessories", subcategory: "Watches", rating: 4.8, image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&q=80", description: "Stay connected in style. This premium smart watch features a high-definition AMOLED display, continuous heart-rate tracking, and a sleek aerospace-grade aluminum body. Built for athletes and professionals alike." },
  { id: "prod_2", name: "Noise Cancelling Headphones", price: "8,990 BDT", priceValue: 8990, category: "Electronics", subcategory: "Headphones", rating: 4.9, image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&q=80", description: "Immerse yourself in pure audio. Featuring industry-leading active noise cancellation, 40 hours of battery life, and plush memory foam earcups for all-day comfort." },
  { id: "prod_3", name: "Ergonomic Office Chair", price: "9,500 BDT", priceValue: 9500, category: "Furniture", subcategory: "Chairs", rating: 4.7, image: "https://images.unsplash.com/photo-1505797149-43b0069ec26b?w=800&q=80", description: "Work pain-free. Our ergonomic chair features dynamic lumbar support, highly breathable mesh, and fully adjustable 4D armrests designed to perfect your posture." },
  { id: "prod_4", name: "Gym Duffle Bag", price: "2,200 BDT", priceValue: 2200, category: "Accessories", subcategory: "Bags", rating: 4.5, image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&q=80", description: "The ultimate training companion. Water-resistant, tear-proof, and designed with a dedicated ventilated shoe compartment. Pack everything you need for the gym and beyond." },
  { id: "prod_5", name: "Fast Wireless Charger", price: "1,850 BDT", priceValue: 1850, category: "Electronics", subcategory: "Chargers", rating: 4.6, image: "https://images.unsplash.com/photo-1622445262465-2481c4574875?w=800&q=80", description: "Charge smarter. This 15W fast wireless charger features a sleek glass finish and intelligent temperature control to safely power your devices without overheating." },
  { id: "prod_6", name: "Standing Desk", price: "10,000 BDT", priceValue: 10000, category: "Furniture", subcategory: "Desks", rating: 4.4, image: "https://images.unsplash.com/photo-1593062096033-9a26b09da705?w=800&q=80", description: "Elevate your workflow. A quiet, dual-motor electric standing desk with memory presets and a heavy-duty steel frame supporting up to 200 lbs." },
  { id: "prod_7", name: "Leather Messenger Bag", price: "3,500 BDT", priceValue: 3500, category: "Accessories", subcategory: "Bags", rating: 4.8, image: "https://images.unsplash.com/photo-1547949007-5350b6910606?w=800&q=80", description: "Classic style meets modern utility. Handcrafted from full-grain leather with padded compartments for a 15-inch laptop and your daily essentials." },
  { id: "prod_8", name: "Sports Earbuds", price: "3,100 BDT", priceValue: 3100, category: "Electronics", subcategory: "Headphones", rating: 4.7, image: "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=800&q=80", description: "Never fall out. Secure-fit ear hooks and IPX7 sweat resistance make these the perfect earbuds for high-intensity interval training or long runs." },
];

export default async function ProductDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const product = allProducts.find((p) => p.id === resolvedParams.id);

  if (!product) {
    notFound();
  }

  // Get related products (same category, exclude current)
  const relatedProducts = allProducts
    .filter((p) => p.category === product.category && p.id !== product.id)
    .slice(0, 4);

  return (
    <div className="bg-neutral-50 dark:bg-neutral-950 text-neutral-900 dark:text-neutral-50 min-h-screen">
      {/* Breadcrumbs */}
      <div className="max-w-[1600px] mx-auto px-6 sm:px-12 lg:px-24 py-6">
        <nav className="text-sm font-medium text-neutral-500 uppercase tracking-wider">
          <Link href="/" className="hover:text-primary-500 transition-colors">Home</Link>
          <span className="mx-2">/</span>
          <Link href="/shop" className="hover:text-primary-500 transition-colors">Shop</Link>
          <span className="mx-2">/</span>
          <span className="text-neutral-800 dark:text-neutral-200">{product.name}</span>
        </nav>
      </div>

      <div className="max-w-[1600px] mx-auto px-6 sm:px-12 lg:px-24 pb-20">
        {/* Main Product Area */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
          
          {/* Left: Image Gallery */}
          <div className="flex flex-col gap-4">
            <div className="relative aspect-[4/5] w-full rounded-3xl overflow-hidden bg-neutral-100 dark:bg-neutral-900 shadow-sm border border-neutral-200 dark:border-neutral-800">
              <Image
                src={product.image}
                alt={product.name}
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
              />
            </div>
            {/* Thumbnails (Mocked) */}
            <div className="grid grid-cols-4 gap-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="relative aspect-square rounded-xl overflow-hidden bg-neutral-100 dark:bg-neutral-900 border-2 border-transparent hover:border-primary-500 cursor-pointer transition-colors">
                  <Image
                    src={product.image}
                    alt={`${product.name} view ${i}`}
                    fill
                    sizes="15vw"
                    className="object-cover opacity-80 hover:opacity-100 transition-opacity"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Right: Product Info */}
          <div className="flex flex-col py-4 lg:py-10">
            <div className="mb-2">
              <span className="text-xs uppercase tracking-widest text-primary-600 dark:text-primary-500 font-bold bg-primary-100 dark:bg-primary-950/30 px-3 py-1 rounded-full">
                {product.category} • {product.subcategory}
              </span>
            </div>
            
            <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight mt-4 mb-4 text-black dark:text-white">
              {product.name}
            </h1>
            
            <div className="flex items-center gap-4 mb-8 border-b border-neutral-200 dark:border-neutral-800 pb-8">
              <span className="text-3xl font-extrabold text-black dark:text-white">{product.price}</span>
              <div className="h-6 w-px bg-neutral-300 dark:bg-neutral-700"></div>
              <div className="flex items-center gap-1.5 text-sm font-semibold">
                <span className="text-primary-500 text-lg">★</span>
                <span>{product.rating}</span>
                <span className="text-neutral-500 font-normal underline ml-1 cursor-pointer hover:text-black dark:hover:text-white">
                  (124 reviews)
                </span>
              </div>
            </div>

            <p className="text-neutral-600 dark:text-neutral-400 text-lg leading-relaxed mb-10">
              {product.description || "Premium quality guaranteed. Engineered to perfection."}
            </p>

            {/* Action Area */}
            <div className="flex flex-col gap-5">
              <div className="flex items-center gap-4">
                {/* Quantity */}
                <div className="flex items-center border border-neutral-300 dark:border-neutral-700 rounded-full h-14 overflow-hidden bg-white dark:bg-neutral-900 shadow-sm w-36">
                  <button className="flex-1 flex items-center justify-center text-xl font-medium text-neutral-500 hover:text-black dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors h-full">
                    -
                  </button>
                  <span className="flex-1 text-center font-bold text-lg">1</span>
                  <button className="flex-1 flex items-center justify-center text-xl font-medium text-neutral-500 hover:text-black dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors h-full">
                    +
                  </button>
                </div>
                
                {/* Add to Cart */}
                <button className="flex-grow bg-black dark:bg-white text-white dark:text-black h-14 rounded-full font-bold uppercase tracking-wider text-sm hover:bg-primary-500 dark:hover:bg-primary-500 hover:text-white transition-all duration-300 shadow-[0_0_20px_rgba(0,0,0,0.1)] hover:shadow-[0_0_20px_rgba(245,158,11,0.4)]">
                  Add to Cart
                </button>
              </div>

              {/* Buy Now */}
              <button className="w-full bg-primary-500 text-white h-14 rounded-full font-bold uppercase tracking-wider text-sm hover:bg-primary-600 transition-colors shadow-lg shadow-primary-500/20">
                Buy it Now
              </button>
            </div>

            {/* Details Accordion (Mocked styling) */}
            <div className="mt-12 flex flex-col gap-4 border-t border-neutral-200 dark:border-neutral-800 pt-8">
              {['Product Features', 'Shipping & Returns', 'Care Instructions'].map((tab, idx) => (
                <div key={idx} className="border-b border-neutral-200 dark:border-neutral-800 pb-4 cursor-pointer group">
                  <div className="flex justify-between items-center text-neutral-800 dark:text-neutral-200 font-bold uppercase tracking-wider text-sm group-hover:text-primary-500 transition-colors">
                    {tab}
                    <span className="text-xl font-light">+</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Related Products Section */}
        {relatedProducts.length > 0 && (
          <div className="mt-32 pt-16 border-t border-neutral-200 dark:border-neutral-800">
            <h2 className="text-2xl sm:text-3xl font-extrabold uppercase tracking-tight mb-10">
              You Might Also Like
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map((prod) => (
                <Link href={`/shop/${prod.id}`} key={prod.id} className="group flex flex-col gap-4 bg-white dark:bg-neutral-900 p-4 rounded-3xl border border-neutral-100 dark:border-neutral-800 hover:border-primary-200 transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
                  <div className="relative aspect-square w-full rounded-2xl overflow-hidden bg-neutral-100 dark:bg-neutral-800">
                    <Image
                      src={prod.image}
                      alt={prod.name}
                      fill
                      sizes="(max-width: 640px) 100vw, 25vw"
                      className="object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                    />
                  </div>
                  <div className="flex flex-col gap-1 px-2 pb-1">
                    <h3 className="font-bold text-neutral-800 dark:text-neutral-200 group-hover:text-primary-600 transition-colors line-clamp-1">
                      {prod.name}
                    </h3>
                    <span className="font-extrabold text-sm text-black dark:text-white">{prod.price}</span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
