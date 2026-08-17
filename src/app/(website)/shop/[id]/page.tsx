import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { productService, Product } from "@/lib/api/productService";
import { ProductViewSection } from "@/components/shop/ProductViewSection";
import { ProductReviews } from "@/components/shop/ProductReviews";
import { AddToCartIcon } from "@/components/shop/AddToCartIcon";
import { OrderNowButton } from "@/components/shop/OrderNowButton";
import { DiscountBadge } from "@/components/shop/DiscountBadge";
import { getImageUrl } from "@/utils/getImageUrl";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const resolvedParams = await params;
  try {
    const product = await productService.getProductDetails(resolvedParams.id);
    if (!product) {
      return { title: "Product Not Found | DRAVON FIT" };
    }

    const desc =
      product.short_description ||
      product.description?.replace(/<[^>]*>?/gm, "").substring(0, 160) ||
      `Buy ${product.name} at DRAVON FIT. Premium quality gym gear.`;

    const mainImage = getImageUrl(product.image_1) || "/logo.jpg";

    return {
      title: `${product.name} | DRAVON FIT`,
      description: desc,
      openGraph: {
        title: `${product.name} | DRAVON FIT`,
        description: desc,
        url: `https://dravonfit.com/shop/${product.id}`,
        siteName: "DRAVON FIT",
        images: [{ url: mainImage, alt: product.name }],
      },
    };
  } catch (error) {
    return { title: "Product | DRAVON FIT" };
  }
}

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = await params;
  let product: Product | null = null;
  let relatedProducts: Product[] = [];

  try {
    product = await productService.getProductDetails(resolvedParams.id);
    if (product?.category?.id) {
      const res = await productService.getProducts(1, {
        category: product.category.id,
      });
      relatedProducts = res.results.filter((p) => p.id !== product!.id).slice(0, 4);
    }
  } catch (error) {
    notFound();
  }

  if (!product) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-white dark:bg-neutral-950 pb-20 pt-6 sm:pt-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-xs text-neutral-400 mb-8 overflow-x-auto whitespace-nowrap">
          <Link href="/" className="hover:text-neutral-800 dark:hover:text-neutral-200 transition-colors">
            Home
          </Link>
          <span>/</span>
          <Link href="/shop" className="hover:text-neutral-800 dark:hover:text-neutral-200 transition-colors">
            Shop
          </Link>
          {product.category && (
            <>
              <span>/</span>
              <Link 
                href={`/shop?category=${product.category.slug || product.category.id}`} 
                className="hover:text-neutral-800 dark:hover:text-neutral-200 transition-colors"
              >
                {product.category.name}
              </Link>
            </>
          )}
          <span>/</span>
          <span className="text-neutral-800 dark:text-neutral-200 font-medium truncate max-w-[200px]">
            {product.name}
          </span>
        </nav>

        {/* Product Interactive View Section (Gallery + Info + Colors + Buy) */}
        <ProductViewSection product={product} />

        {/* Product Details Section (Full Width, Under Photo/Grid) */}
        <div className="mt-16 pt-12 border-t border-neutral-200 dark:border-neutral-800">
          <div className="w-full">
            <h2 className="text-lg font-semibold uppercase tracking-widest text-neutral-900 dark:text-neutral-100 mb-6">
              Product Details & Description
            </h2>
            
            <div className="prose prose-neutral dark:prose-invert max-w-none text-neutral-600 dark:text-neutral-300 leading-relaxed space-y-4 whitespace-pre-wrap text-sm sm:text-base mb-10">
              {product.description || "No description available for this product."}
            </div>

            {/* Dynamic specifications/attributes */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 border-t border-b border-neutral-200 dark:border-neutral-800 py-6">
              <div>
                <span className="block text-[10px] uppercase tracking-widest text-neutral-400 mb-1">Category</span>
                <span className="text-sm font-medium text-neutral-800 dark:text-neutral-200">{product.category?.name || "Uncategorized"}</span>
              </div>
              <div>
                <span className="block text-[10px] uppercase tracking-widest text-neutral-400 mb-1">Stock Status</span>
                <span className={`text-sm font-medium ${product.stock > 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'}`}>
                  {product.stock > 0 ? `In Stock (${product.stock} items)` : 'Out of Stock'}
                </span>
              </div>
              {product.sold_quantity > 0 && (
                <div>
                  <span className="block text-[10px] uppercase tracking-widest text-neutral-400 mb-1">Popularity</span>
                  <span className="text-sm font-medium text-neutral-800 dark:text-neutral-200">{product.sold_quantity}+ units sold</span>
                </div>
              )}
              <div>
                <span className="block text-[10px] uppercase tracking-widest text-neutral-400 mb-1">Rating</span>
                <span className="text-sm font-medium text-neutral-800 dark:text-neutral-200">★ {product.average_rating || "No reviews yet"}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Reviews Section */}
        <ProductReviews productId={product.id} reviews={product.reviews || []} />

        {/* Related Products Section */}
        {relatedProducts.length > 0 && (
          <div className="mt-24 pt-12 border-t border-neutral-100 dark:border-neutral-800/60">
            <h2 className="text-lg font-semibold uppercase tracking-widest text-neutral-900 dark:text-neutral-100 mb-8 text-center sm:text-left">
              You Might Also Like
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
              {relatedProducts.map((prod) => (
                <div key={prod.id} className="group flex flex-col gap-3 bg-white dark:bg-neutral-900/50 p-3 rounded-2xl border border-neutral-100 dark:border-neutral-800/60 hover:border-primary-200 dark:hover:border-primary-900/50 transition-all duration-300">
                  <div className="relative aspect-square w-full rounded-xl overflow-hidden bg-neutral-50 dark:bg-neutral-900">
                    <Link href={`/shop/${prod.id}`} className="absolute inset-0 z-0">
                      <Image
                        src={getImageUrl(prod.image_1) || "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&q=80"}
                        alt={prod.name}
                        fill
                        unoptimized
                        sizes="(max-width: 640px) 50vw, 25vw"
                        className="object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                      />
                    </Link>
                    
                    {/* Discount Badge Overlay */}
                    <div className="absolute bottom-2.5 left-2.5 z-10">
                      <DiscountBadge
                        sellingPrice={prod.selling_price}
                        offerPrice={prod.offer_price}
                        price={prod.price}
                      />
                    </div>

                    <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-300 z-10">
                      <AddToCartIcon product={prod} />
                    </div>
                  </div>
                  <div className="flex flex-col gap-1 px-1 pb-1 text-center sm:text-left flex-grow">
                    <Link href={`/shop/${prod.id}`}>
                      <h3 className="font-medium text-sm text-neutral-800 dark:text-neutral-200 group-hover:text-primary-600 transition-colors line-clamp-1 hover:underline">
                        {prod.name}
                      </h3>
                    </Link>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-[13px] text-neutral-900 dark:text-white">
                        ৳{parseFloat(prod.price || prod.selling_price || "0").toFixed(2)}
                      </span>
                      {prod.offer_price && parseFloat(prod.offer_price) > 0 && (
                        <span className="text-[11px] text-neutral-500 line-through">
                          ৳{parseFloat(prod.selling_price || "0").toFixed(2)}
                        </span>
                      )}
                    </div>
                    <div className="mt-auto pt-2">
                      <OrderNowButton product={prod} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
