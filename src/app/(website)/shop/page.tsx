import Link from "next/link";
import Image from "next/image";
import { FilterSidebar } from "@/components/shop/FilterSidebar";

export default async function ProductsPage({ searchParams }: { searchParams: Promise<{ [key: string]: string | string[] | undefined }> }) {
  const resolvedParams = await searchParams;
  const categoryFilter = resolvedParams.category as string | undefined;
  const minPrice = parseInt(resolvedParams.minPrice as string) || 0;
  const maxPrice = parseInt(resolvedParams.maxPrice as string) || 10000;

  const allProducts = [
    { id: "prod_1", name: "Premium Smart Watch", price: "4,590 BDT", priceValue: 4590, category: "Accessories", subcategory: "Watches", rating: 4.8, image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&q=80" },
    { id: "prod_2", name: "Noise Cancelling Headphones", price: "8,990 BDT", priceValue: 8990, category: "Electronics", subcategory: "Headphones", rating: 4.9, image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&q=80" },
    { id: "prod_3", name: "Ergonomic Office Chair", price: "9,500 BDT", priceValue: 9500, category: "Furniture", subcategory: "Chairs", rating: 4.7, image: "https://images.unsplash.com/photo-1505797149-43b0069ec26b?w=500&q=80" },
    { id: "prod_4", name: "Gym Duffle Bag", price: "2,200 BDT", priceValue: 2200, category: "Accessories", subcategory: "Bags", rating: 4.5, image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500&q=80" },
    { id: "prod_5", name: "Fast Wireless Charger", price: "1,850 BDT", priceValue: 1850, category: "Electronics", subcategory: "Chargers", rating: 4.6, image: "https://images.unsplash.com/photo-1622445262465-2481c4574875?w=500&q=80" },
    { id: "prod_6", name: "Standing Desk", price: "10,000 BDT", priceValue: 10000, category: "Furniture", subcategory: "Desks", rating: 4.4, image: "https://images.unsplash.com/photo-1593062096033-9a26b09da705?w=500&q=80" },
    { id: "prod_7", name: "Leather Messenger Bag", price: "3,500 BDT", priceValue: 3500, category: "Accessories", subcategory: "Bags", rating: 4.8, image: "https://images.unsplash.com/photo-1547949007-5350b6910606?w=500&q=80" },
    { id: "prod_8", name: "Sports Earbuds", price: "3,100 BDT", priceValue: 3100, category: "Electronics", subcategory: "Headphones", rating: 4.7, image: "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=500&q=80" },
  ];

  let products = allProducts;

  if (categoryFilter) {
    products = products.filter(p => p.category === categoryFilter || p.subcategory === categoryFilter);
  }

  // Filter by dynamic price range from the slider
  products = products.filter(p => p.priceValue >= minPrice && p.priceValue <= maxPrice);

  return (
    <div className="bg-neutral-50 dark:bg-neutral-950 text-neutral-900 dark:text-neutral-50 py-12 px-6 sm:px-12 lg:px-24">
      <div className="max-w-[1600px] mx-auto">
        <div className="mb-10 text-center lg:text-left">
          <h1 className="text-4xl lg:text-5xl font-extrabold tracking-tight uppercase mb-4">Shop Collection</h1>
          <p className="text-neutral-500 dark:text-neutral-400 max-w-2xl">
            Browse our high-quality premium collection with our advanced filtering system.
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-10 items-start">
          <FilterSidebar />

          {/* Product Grid */}
          <div className="flex-grow w-full">
            {products.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 bg-white dark:bg-neutral-900 rounded-3xl border border-neutral-200 dark:border-neutral-800 text-neutral-500 shadow-sm">
                <p className="text-lg font-medium">No products found matching your filters.</p>
                <Link href="/shop" className="mt-4 text-primary-500 hover:text-primary-600 font-bold tracking-wider uppercase text-sm border-b-2 border-primary-500 pb-1 transition-colors">
                  Clear Filters
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {products.map((product) => (
                  <Link href={`/shop/${product.id}`} key={product.id} className="group flex flex-col gap-4 bg-white dark:bg-neutral-900 p-4 rounded-3xl border border-neutral-100 dark:border-neutral-800 hover:border-primary-200 transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
                    <div className="relative aspect-square w-full rounded-2xl overflow-hidden bg-neutral-100 dark:bg-neutral-800">
                      <Image
                        src={product.image}
                        alt={product.name}
                        fill
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        className="object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                      />
                    </div>
                    <div className="flex flex-col gap-1.5 px-2 pb-2">
                      <span className="text-[10px] uppercase tracking-widest text-neutral-400 font-bold">
                        {product.category} • {product.subcategory}
                      </span>
                      <h3 className="font-bold text-neutral-800 dark:text-neutral-200 group-hover:text-primary-600 transition-colors line-clamp-1">
                        {product.name}
                      </h3>
                      <div className="flex justify-between items-center mt-2">
                        <span className="font-extrabold text-lg text-black dark:text-white">{product.price}</span>
                        <span className="text-xs text-neutral-500 dark:text-neutral-400 font-medium bg-neutral-100 dark:bg-neutral-800 px-2 py-1 rounded-md">
                          ★ {product.rating}
                        </span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
