import Link from "next/link";
import Image from "next/image";

export default function CartPage() {
  const cartItems = [
    {
      id: "prod_2",
      name: "Premium Noise-Cancelling Headphones",
      price: "$299.00",
      quantity: 1,
      image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&q=80",
    },
    {
      id: "prod_1",
      name: "Minimalist Leather Watch",
      price: "$189.00",
      quantity: 2,
      image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&q=80",
    },
  ];

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-950 text-neutral-900 dark:text-neutral-50 py-16 px-6 sm:px-12 lg:px-24">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-extrabold tracking-tight mb-8">Shopping Cart</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* List items */}
          <main className="lg:col-span-2 flex flex-col gap-6">
            {cartItems.map((item) => (
              <div
                key={item.id}
                className="flex items-center gap-6 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-3xl p-5 shadow-sm"
              >
                <div className="relative aspect-square w-24 rounded-2xl overflow-hidden bg-neutral-100 shrink-0">
                  <Image src={item.image} alt={item.name} fill sizes="96px" className="object-cover" />
                </div>
                <div className="flex-grow flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <h3 className="font-semibold text-neutral-800 dark:text-neutral-200 hover:underline">
                      <Link href={`/shop/${item.id}`}>{item.name}</Link>
                    </h3>
                    <p className="text-sm font-bold mt-1 text-neutral-950 dark:text-white">
                      {item.price}
                    </p>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-sm font-medium text-neutral-500">Qty: {item.quantity}</span>
                    <button className="text-sm font-bold text-rose-500 hover:underline">
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </main>

          {/* Checkout summary */}
          <aside className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-3xl p-6 shadow-sm h-fit">
            <h2 className="font-bold text-lg mb-6">Order Summary</h2>
            <div className="flex flex-col gap-4 text-sm mb-6">
              <div className="flex justify-between text-neutral-500">
                <span>Subtotal</span>
                <span>$677.00</span>
              </div>
              <div className="flex justify-between text-neutral-500">
                <span>Shipping</span>
                <span>Calculated at checkout</span>
              </div>
              <hr className="border-neutral-200 dark:border-neutral-800" />
              <div className="flex justify-between font-bold text-base text-neutral-900 dark:text-white">
                <span>Total</span>
                <span>$677.00</span>
              </div>
            </div>

            <button className="w-full py-4 bg-neutral-900 dark:bg-white text-white dark:text-black font-semibold rounded-xl hover:bg-neutral-800 dark:hover:bg-neutral-100 transition-colors shadow-md">
              Proceed to Checkout
            </button>
          </aside>
        </div>
      </div>
    </div>
  );
}
