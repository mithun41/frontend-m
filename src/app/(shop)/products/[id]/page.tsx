import Link from "next/link";
import Image from "next/image";

interface Props {
  params: Promise<{
    id: string;
  }>;
}

export default async function ProductDetailPage({ params }: Props) {
  const resolvedParams = await params;
  const { id } = resolvedParams;

  // Mock fetching logic based on id
  const product = {
    id: id,
    name: id === "prod_2" ? "Premium Noise-Cancelling Headphones" : "Minimalist Leather Watch",
    price: id === "prod_2" ? "$299.00" : "$189.00",
    description: "Experience premium sound and high-fidelity acoustics. Made with ultra-soft earcups, a durable aluminum headband, and active noise cancellation technology that adapts to your environment.",
    category: id === "prod_2" ? "Electronics" : "Accessories",
    rating: 4.9,
    image: id === "prod_2" 
      ? "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&q=80" 
      : "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&q=80",
    features: [
      "High Fidelity Active Noise Cancelling",
      "Up to 30 Hours of continuous playback",
      "USB-C Quick Charging support",
      "Soft memory-foam cushion fit",
    ],
  };

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-950 text-neutral-900 dark:text-neutral-50 py-16 px-6 sm:px-12 lg:px-24">
      <div className="max-w-6xl mx-auto bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-3xl p-8 sm:p-12 shadow-sm">
        <Link href="/products" className="text-sm font-semibold hover:underline text-neutral-500 mb-8 inline-block">
          &larr; Back to all products
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mt-4">
          {/* Image */}
          <div className="relative aspect-square w-full rounded-2xl overflow-hidden bg-neutral-100 dark:bg-neutral-800 shadow-inner">
            <Image
              src={product.image}
              alt={product.name}
              fill
              priority
              className="object-cover"
            />
          </div>

          {/* Details */}
          <div className="flex flex-col justify-center">
            <span className="text-xs uppercase tracking-widest text-amber-500 font-bold mb-2">
              {product.category}
            </span>
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-4 leading-tight">
              {product.name}
            </h1>

            <div className="flex items-center gap-4 mb-6">
              <span className="text-2xl font-black">{product.price}</span>
              <span className="text-sm text-neutral-500 dark:text-neutral-400">
                ⭐ {product.rating} (42 reviews)
              </span>
            </div>

            <p className="text-neutral-600 dark:text-neutral-400 mb-8 leading-relaxed">
              {product.description}
            </p>

            <div className="mb-8">
              <h3 className="font-bold text-xs uppercase tracking-wider text-neutral-400 mb-3">Key Specs</h3>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
                {product.features.map((feat, idx) => (
                  <li key={idx} className="flex items-center gap-2">
                    <span className="text-amber-500">✓</span> {feat}
                  </li>
                ))}
              </ul>
            </div>

            <div className="flex gap-4">
              <Link
                href="/cart"
                className="flex-grow py-4 bg-neutral-900 dark:bg-white text-white dark:text-black font-semibold rounded-xl hover:bg-neutral-800 dark:hover:bg-neutral-100 transition-colors shadow-md text-center"
              >
                Add to Cart
              </Link>
              <button className="px-6 py-4 bg-neutral-100 dark:bg-neutral-800 rounded-xl hover:bg-neutral-200 dark:hover:bg-neutral-700 transition-colors">
                ♥
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
