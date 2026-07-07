import Link from "next/link";
import Image from "next/image";

export default function ProductsPage() {
  const products = [
    { id: "prod_1", name: "Minimalist Leather Watch", price: "$189.00", category: "Accessories", rating: 4.8, image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&q=80" },
    { id: "prod_2", name: "Premium Noise Headphones", price: "$299.00", category: "Electronics", rating: 4.9, image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&q=80" },
    { id: "prod_3", name: "Ergonomic Office Chair", price: "$349.00", category: "Furniture", rating: 4.7, image: "https://images.unsplash.com/photo-1505797149-43b0069ec26b?w=500&q=80" },
    { id: "prod_4", name: "Smart Water Bottle", price: "$49.00", category: "Accessories", rating: 4.5, image: "https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=500&q=80" },
    { id: "prod_5", name: "Wireless Charging Pad", price: "$39.00", category: "Electronics", rating: 4.6, image: "https://images.unsplash.com/photo-1622445262465-2481c4574875?w=500&q=80" },
    { id: "prod_6", name: "Felt Desk Mat", price: "$29.00", category: "Furniture", rating: 4.4, image: "https://images.unsplash.com/photo-1585776245991-cf89dd7fc73a?w=500&q=80" },
  ];

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-950 text-neutral-900 dark:text-neutral-50 py-12 px-6 sm:px-12 lg:px-24">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-extrabold tracking-tight mb-4">All Products</h1>
        <p className="text-neutral-500 dark:text-neutral-400 mb-10">
          Browse our high-quality premium collection.
        </p>

        <div className="flex flex-col lg:flex-row gap-10">
          {/* Filter Sidebar (Mock) */}
          <aside className="w-full lg:w-64 shrink-0 flex flex-col gap-8 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-3xl p-6 h-fit shadow-sm">
            <div>
              <h3 className="font-bold mb-4 uppercase tracking-wider text-xs text-neutral-500">Categories</h3>
              <div className="flex flex-col gap-2.5 text-sm font-medium">
                <span className="text-amber-500 cursor-pointer">All Categories</span>
                <span className="hover:text-amber-500 cursor-pointer transition-colors">Accessories</span>
                <span className="hover:text-amber-500 cursor-pointer transition-colors">Electronics</span>
                <span className="hover:text-amber-500 cursor-pointer transition-colors">Furniture</span>
              </div>
            </div>

            <hr className="border-neutral-200 dark:border-neutral-800" />

            <div>
              <h3 className="font-bold mb-4 uppercase tracking-wider text-xs text-neutral-500">Price Range</h3>
              <div className="flex flex-col gap-2.5 text-sm font-medium">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" className="accent-amber-500" /> Under $50
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" className="accent-amber-500" /> $50 to $150
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" className="accent-amber-500" /> Over $150
                </label>
              </div>
            </div>
          </aside>

          {/* Product Grid */}
          <main className="flex-grow">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {products.map((product) => (
                <Link href={`/products/${product.id}`} key={product.id} className="group flex flex-col gap-4">
                  <div className="relative aspect-square w-full rounded-2xl overflow-hidden bg-neutral-100 dark:bg-neutral-800 shadow-sm group-hover:shadow-md transition-all duration-300">
                    <Image
                      src={product.image}
                      alt={product.name}
                      fill
                      className="object-cover group-hover:scale-103 transition-transform duration-300"
                    />
                  </div>
                  <div className="flex flex-col gap-1">
                    <span className="text-xs uppercase tracking-wider text-neutral-400 font-semibold">
                      {product.category}
                    </span>
                    <h3 className="font-semibold text-neutral-800 dark:text-neutral-200 group-hover:text-black dark:group-hover:text-white transition-colors">
                      {product.name}
                    </h3>
                    <div className="flex justify-between items-center mt-1">
                      <span className="font-bold text-lg">{product.price}</span>
                      <span className="text-xs text-neutral-500 dark:text-neutral-400 flex items-center gap-1">
                        ⭐ {product.rating}
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
