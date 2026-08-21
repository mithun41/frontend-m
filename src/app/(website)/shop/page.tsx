import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { ShoppingCart } from "lucide-react";
import { Suspense } from "react";
import { FilterSidebar } from "@/components/shop/FilterSidebar";
import { productService, Product } from "@/lib/api/productService";
import { AddToCartIcon } from "@/components/shop/AddToCartIcon";
import { OrderNowButton } from "@/components/shop/OrderNowButton";
import { DiscountBadge } from "@/components/shop/DiscountBadge";

import { categoryService, Category } from "@/lib/api/categoryService";

export async function generateMetadata({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}): Promise<Metadata> {
  const resolvedParams = await searchParams;
  const category = resolvedParams.category as string | undefined;
  const search = resolvedParams.search as string | undefined;

  let title = "Shop All Products | DRAVON FIT";
  let description =
    "Browse our full collection of premium gym accessories, workout gear, and athletic wear at DRAVON FIT.";

  if (category) {
    const formattedCat = category.replace(/-/g, " ").replace(/\b\w/g, (l) => l.toUpperCase());
    title = `${formattedCat} - Shop Gym Gear | DRAVON FIT`;
    description = `Explore high-quality ${formattedCat} at DRAVON FIT. Built for maximum performance and durability.`;
  } else if (search) {
    title = `Search results for "${search}" | DRAVON FIT`;
    description = `Find gym gear and accessories matching "${search}" at DRAVON FIT.`;
  }

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: "https://dravonfit.com/shop",
      siteName: "DRAVON FIT",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };
}

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function ProductsPage({ searchParams }: { searchParams: Promise<{ [key: string]: string | string[] | undefined }> }) {
  const resolvedParams = await searchParams;
  const categoryFilter = resolvedParams.category as string | undefined;
  const searchQuery = resolvedParams.search as string | undefined;
  const minPrice = parseInt(resolvedParams.minPrice as string) || 0;
  const maxPrice = parseInt(resolvedParams.maxPrice as string) || 100000;
  const page = parseInt(resolvedParams.page as string) || 1;

  let allProducts: Product[] = [];
  let categoriesList: Category[] = [];

  try {
    const [productsRes, categoriesRes] = await Promise.all([
      productService.getProducts(page, { page_size: 1000 }),
      categoryService.getAll()
    ]);
    allProducts = productsRes.results || [];
    categoriesList = categoriesRes || [];
  } catch (error) {
    console.error("Error fetching products or categories:", error);
  }

  let products = allProducts;

  if (categoryFilter) {
    const lowerFilter = categoryFilter.toLowerCase();

    // Recursively find matching category by exact slug (or exact name if no slug) and collect all descendant category IDs
    const findCategoryAndChildIds = (cats: Category[], target: string): number[] => {
      let matchedIds: number[] = [];
      for (const cat of cats) {
        const isMatch = cat.slug
          ? cat.slug.toLowerCase() === target
          : cat.name.toLowerCase() === target;

        if (isMatch) {
          const collectIds = (c: Category) => {
            matchedIds.push(c.id);
            c.subcategories?.forEach(collectIds);
          };
          collectIds(cat);
        } else if (cat.subcategories && cat.subcategories.length > 0) {
          matchedIds = matchedIds.concat(findCategoryAndChildIds(cat.subcategories, target));
        }
      }
      return matchedIds;
    };

    const matchedCategoryIds = findCategoryAndChildIds(categoriesList, lowerFilter);

    if (matchedCategoryIds.length > 0) {
      products = products.filter(p => {
        if (!p.category) return false;
        const catId = p.category.id;
        const parentId = p.category.parent;
        return (
          matchedCategoryIds.includes(catId) ||
          (parentId !== null && parentId !== undefined && matchedCategoryIds.includes(parentId))
        );
      });
    } else {
      products = products.filter(p => {
        if (!p.category) return false;
        return (
          (p.category.slug && p.category.slug.toLowerCase() === lowerFilter) ||
          (p.category.name && p.category.name.toLowerCase() === lowerFilter)
        );
      });
    }
  }

  if (searchQuery) {
    const lowerQuery = searchQuery.toLowerCase();
    products = products.filter(p => p.name?.toLowerCase().includes(lowerQuery));
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
                      
                      {/* Discount Badge Overlay */}
                      <div className="absolute bottom-2.5 left-2.5 z-10">
                        <DiscountBadge
                          sellingPrice={product.selling_price}
                          offerPrice={product.offer_price}
                          price={product.price}
                        />
                      </div>
                      
                      <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-300 z-10">
                        <AddToCartIcon product={product} />
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
                        <div className="flex justify-between items-center mt-1 gap-1">
                        <div className="flex items-baseline gap-1.5 flex-wrap">
                          <span className="font-extrabold text-base sm:text-lg text-black dark:text-white whitespace-nowrap">
                            Tk {parseFloat(product.price || product.selling_price || "0").toFixed(2)}
                          </span>
                          {product.offer_price && parseFloat(product.offer_price) > 0 && (
                            <span className="text-xs text-neutral-500 line-through whitespace-nowrap">
                              Tk {parseFloat(product.selling_price || "0").toFixed(2)}
                            </span>
                          )}
                        </div>
                        <span className="text-xs text-neutral-500 dark:text-neutral-400 font-medium bg-neutral-100 dark:bg-neutral-800 px-2 py-0.5 rounded-md shrink-0 whitespace-nowrap">
                          ★ {product.average_rating || 0}
                        </span>
                      </div>
                      
                      <div className="mt-auto pt-4 w-full">
                        <OrderNowButton product={product} />
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
