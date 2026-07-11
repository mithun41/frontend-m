import Link from "next/link";
import Image from "next/image";
import { ShoppingCart } from "lucide-react";
import { Suspense } from "react";
import { FilterSidebar } from "@/components/shop/FilterSidebar";
import { productService, Product } from "@/lib/api/productService";
import { AddToCartIcon } from "@/components/shop/AddToCartIcon";
import { OrderNowButton } from "@/components/shop/OrderNowButton";

export default async function ProductsPage({ searchParams }: { searchParams: Promise<{ [key: string]: string | string[] | undefined }> }) {
  const resolvedParams = await searchParams;
  const categoryFilter = resolvedParams.category as string | undefined;
  const minPrice = parseInt(resolvedParams.minPrice as string) || 0;
  const maxPrice = parseInt(resolvedParams.maxPrice as string) || 100000;
  const page = parseInt(resolvedParams.page as string) || 1;

  let allProducts: Product[] = [];
  try {
    const response = await productService.getProducts(page);
    allProducts = response.results || [];
  } catch (error) {
    console.error("Error fetching products:", error);
  }

  let products = allProducts;
  console.log(products)

  if (categoryFilter) {
    products = products.filter(p => p.category?.name === categoryFilter);
  }

  // Filter by dynamic price range from the slider
  products = products.filter(p => {
    const price = parseFloat(p.price || p.selling_price || "0");
    return price >= minPrice && price <= maxPrice;
  });

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
          <Suspense fallback={<div className="w-full lg:w-64 shrink-0 flex flex-col gap-8 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-3xl p-6 h-fit shadow-sm"><div className="animate-pulse bg-gray-200 h-64 rounded-xl"></div></div>}>
            <FilterSidebar />
          </Suspense>

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
                  <div key={product.id} className="group flex flex-col bg-white dark:bg-neutral-900 rounded-3xl border border-neutral-100 dark:border-neutral-800 hover:border-primary-200 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 overflow-hidden">
                    <div className="relative aspect-square w-full bg-neutral-100 dark:bg-neutral-800 overflow-hidden">
                      <Link href={`/shop/${product.id}`} className="absolute inset-0 z-0">
                        <Image
                          src={product.image_1 || "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&q=80"}
                          alt={product.name}
                          fill
                          unoptimized
                          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                          className="object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                        />
                        {/* Hover Overlay */}
                        <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
                      </Link>
                      
                      <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-300 z-10">
                        <AddToCartIcon productId={product.id} />
                      </div>
                    </div>
                    <div className="flex flex-col gap-1.5 p-4 flex-grow">
                      <span className="text-[10px] uppercase tracking-widest text-neutral-400 font-bold">
                        {product.category?.name || "Uncategorized"}
                      </span>
                      <Link href={`/shop/${product.id}`}>
                        <h3 className="font-bold text-neutral-800 dark:text-neutral-200 group-hover:text-primary-600 transition-colors line-clamp-1 hover:underline">
                          {product.name}
                        </h3>
                      </Link>
                      <div className="flex justify-between items-center mt-1">
                        <span className="font-extrabold text-lg text-black dark:text-white">{product.price || product.selling_price} BDT</span>
                        <span className="text-xs text-neutral-500 dark:text-neutral-400 font-medium bg-neutral-100 dark:bg-neutral-800 px-2 py-1 rounded-md">
                          ★ {product.average_rating || 0}
                        </span>
                      </div>
                      
                      <div className="mt-auto pt-4 w-full">
                        <OrderNowButton productId={product.id} />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
