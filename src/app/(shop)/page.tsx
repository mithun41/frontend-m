import Link from "next/link";
import Image from "next/image";
import { HeroSlider } from "@/components/home/HeroSlider";

export default function HomePage() {
  // Mock data for premium look
  const categories = [
    { name: "New Arrivals", count: "120+ Items", image: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=500&q=80" },
    { name: "Summer Sale", count: "80+ Items", image: "https://images.unsplash.com/photo-1472851294608-062f824d29cc?w=500&q=80" },
    { name: "Accessories", count: "45+ Items", image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&q=80" },
  ];

  const featuredProducts = [
    {
      id: "prod_1",
      name: "Minimalist Leather Watch",
      price: "$189.00",
      rating: 4.8,
      image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&q=80",
    },
    {
      id: "prod_2",
      name: "Premium Noise-Cancelling Headphones",
      price: "$299.00",
      rating: 4.9,
      image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&q=80",
    },
    {
      id: "prod_3",
      name: "Ergonomic Office Chair",
      price: "$349.00",
      rating: 4.7,
      image: "https://images.unsplash.com/photo-1505797149-43b0069ec26b?w=500&q=80",
    },
    {
      id: "prod_4",
      name: "Smart Water Bottle",
      price: "$49.00",
      rating: 4.5,
      image: "https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=500&q=80",
    },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-neutral-50 dark:bg-neutral-950 text-neutral-900 dark:text-neutral-50">
      {/* Hero Banner */}
      <HeroSlider />

      {/* Featured Categories */}
      <section className="py-20 px-6 sm:px-12 lg:px-24 max-w-7xl mx-auto w-full">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-12">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">Shop by Category</h2>
            <p className="text-neutral-500 dark:text-neutral-400 mt-2">Find the perfect products handpicked for you.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {categories.map((cat, idx) => (
            <div
              key={idx}
              className="group relative h-80 rounded-2xl overflow-hidden cursor-pointer shadow-md hover:shadow-xl transition-all"
            >
              <Image
                src={cat.image}
                alt={cat.name}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
              <div className="absolute bottom-6 left-6 text-white z-10">
                <p className="text-xs uppercase tracking-widest text-amber-400 mb-1">{cat.count}</p>
                <h3 className="text-xl font-bold">{cat.name}</h3>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-20 px-6 sm:px-12 lg:px-24 bg-white dark:bg-neutral-900 w-full">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-end mb-12">
            <div>
              <h2 className="text-3xl font-bold tracking-tight">Featured Products</h2>
              <p className="text-neutral-500 dark:text-neutral-400 mt-2">Explore this week's highest rated essentials.</p>
            </div>
            <Link href="/products" className="text-sm font-semibold hover:underline flex items-center gap-1">
              View All Products &rarr;
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {featuredProducts.map((product) => (
              <Link href={`/products/${product.id}`} key={product.id} className="group flex flex-col gap-4">
                <div className="relative aspect-square w-full rounded-2xl overflow-hidden bg-neutral-100 dark:bg-neutral-800 shadow-sm group-hover:shadow-md transition-shadow">
                  <Image
                    src={product.image}
                    alt={product.name}
                    fill
                    className="object-cover group-hover:scale-103 transition-transform duration-300"
                  />
                </div>
                <div className="flex flex-col gap-1">
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
        </div>
      </section>

      {/* Newsletter */}
      <section className="py-20 px-6 sm:px-12 lg:px-24 bg-neutral-950 text-white text-center w-full flex flex-col items-center">
        <div className="max-w-xl flex flex-col items-center gap-6">
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">Stay updated with our newsletter</h2>
          <p className="text-neutral-400">
            Sign up to receive early access to new releases, custom designs, and exclusive discounts.
          </p>
          <div className="flex w-full max-w-md gap-3 mt-2 flex-col sm:flex-row">
            <input
              type="email"
              placeholder="Enter your email"
              className="px-5 py-3 rounded-full bg-neutral-800 border border-neutral-700 text-white focus:outline-none focus:border-amber-400 flex-grow"
              required
            />
            <button className="px-8 py-3 bg-amber-400 text-black font-semibold rounded-full hover:bg-amber-300 transition-colors whitespace-nowrap">
              Subscribe
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
