import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { productService, Product } from "@/lib/api/productService";
import { ProductGallery } from "@/components/shop/ProductGallery";
import { ProductReviews } from "@/components/shop/ProductReviews";
import { AddToCartSection } from "@/components/shop/AddToCartSection";
import { AddToCartIcon } from "@/components/shop/AddToCartIcon";
import { OrderNowButton } from "@/components/shop/OrderNowButton";

export default async function ProductDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  let product: Product | null = null;
  let relatedProducts: Product[] = [];
  
  try {
    product = await productService.getProductDetails(resolvedParams.id);
    
    // Fetch related products (e.g. from the same category)
    const allProductsResponse = await productService.getProducts(1);
    if (allProductsResponse && allProductsResponse.results) {
        relatedProducts = allProductsResponse.results
            .filter((p) => p.category?.id === product?.category?.id && p.id !== product?.id)
            .slice(0, 4);
    }
  } catch (error) {
    console.error("Error fetching product details:", error);
  }

  if (!product) {
    notFound();
  }

  return (
    <div className="bg-neutral-50 dark:bg-neutral-950 text-neutral-900 dark:text-neutral-50 min-h-screen">
      {/* Breadcrumbs */}
      <div className="max-w-[1600px] mx-auto px-6 sm:px-12 lg:px-24 py-8">
        <nav className="text-xs font-medium text-neutral-400 uppercase tracking-widest flex items-center gap-2">
          <Link href="/" className="hover:text-primary-500 transition-colors">Home</Link>
          <span>/</span>
          <Link href="/shop" className="hover:text-primary-500 transition-colors">Shop</Link>
          <span>/</span>
          <span className="text-neutral-900 dark:text-neutral-100">{product.name}</span>
        </nav>
      </div>

      <div className="max-w-[1600px] mx-auto px-6 sm:px-12 lg:px-24 pb-20">
        {/* Main Product Area */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
          
          {/* Left: Image Gallery */}
          <div className="w-full lg:w-full">
            <ProductGallery 
              images={[
                product.image_1, 
                product.image_2, 
                product.image_3
              ].filter(Boolean) as string[]} 
            />
          </div>

          {/* Right: Product Info */}
          <div className="flex flex-col py-2 lg:py-6 pl-0 lg:pl-10">
            <div className="mb-4">
              <span className="text-[10px] uppercase tracking-widest text-primary-600 dark:text-primary-400 font-semibold bg-primary-50 dark:bg-primary-950/20 px-3 py-1 rounded-full border border-primary-100 dark:border-primary-900/30">
                {product.category?.name || "Uncategorized"}
              </span>
            </div>
            
            <h1 className="text-2xl sm:text-3xl font-semibold tracking-wide mt-2 mb-4 text-neutral-900 dark:text-white leading-tight">
              {product.name}
            </h1>
            
            <div className="flex items-center gap-4 mb-6 pb-6 border-b border-neutral-100 dark:border-neutral-800/60">
              <span className="text-xl font-medium text-neutral-900 dark:text-white">{parseFloat(product.price || product.selling_price || "0").toFixed(2)} BDT</span>
              <div className="h-4 w-px bg-neutral-200 dark:bg-neutral-800"></div>
              <div className="flex items-center gap-1.5 text-xs">
                <span className="text-primary-500 text-sm">★</span>
                <span className="font-medium text-neutral-700 dark:text-neutral-300">{product.average_rating || 0}</span>
                <span className="text-neutral-400 underline ml-1 cursor-pointer hover:text-neutral-800 dark:hover:text-neutral-200">
                  ({product.reviews?.length || 0} reviews)
                </span>
              </div>
            </div>

            <p className="text-sm text-neutral-500 dark:text-neutral-400 leading-loose font-light mb-8 max-w-xl">
              {product.description || "Premium quality guaranteed. Engineered to perfection with attention to detail and long-lasting durability."}
            </p>

            {/* Action Area */}
            <AddToCartSection productId={product.id} />

            {/* Details Accordion */}
            <div className="mt-12 flex flex-col gap-0 border-t border-neutral-100 dark:border-neutral-800/60 pt-4">
              {['Product Details', 'Shipping Information', 'Care Instructions'].map((tab, idx) => (
                <div key={idx} className="border-b border-neutral-100 dark:border-neutral-800/60 py-4 cursor-pointer group">
                  <div className="flex justify-between items-center text-neutral-700 dark:text-neutral-300 font-medium uppercase tracking-widest text-[11px] group-hover:text-primary-500 transition-colors">
                    {tab}
                    <span className="text-lg font-light text-neutral-400 group-hover:text-primary-500 transition-colors">+</span>
                  </div>
                </div>
              ))}
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
                        src={prod.image_1 || "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&q=80"}
                        alt={prod.name}
                        fill
                        unoptimized
                        sizes="(max-width: 640px) 50vw, 25vw"
                        className="object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                      />
                    </Link>
                    <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-300 z-10">
                      <AddToCartIcon productId={prod.id} />
                    </div>
                  </div>
                  <div className="flex flex-col gap-1 px-1 pb-1 text-center sm:text-left flex-grow">
                    <Link href={`/shop/${prod.id}`}>
                      <h3 className="font-medium text-sm text-neutral-800 dark:text-neutral-200 group-hover:text-primary-600 transition-colors line-clamp-1 hover:underline">
                        {prod.name}
                      </h3>
                    </Link>
                    <span className="font-semibold text-[13px] text-neutral-900 dark:text-white">{parseFloat(prod.price || prod.selling_price || "0").toFixed(2)} BDT</span>
                    <div className="mt-auto pt-2">
                      <OrderNowButton productId={prod.id} />
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
