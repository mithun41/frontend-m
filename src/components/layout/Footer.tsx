import Link from "next/link";

export function Footer() {
  return (
    <footer className="bg-neutral-950 text-neutral-400 py-16 border-t border-neutral-900">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
        
        {/* Brand Info */}
        <div className="flex flex-col gap-4">
          <Link href="/" className="flex items-center gap-2 text-white">
            <span className="text-2xl font-extrabold tracking-tighter uppercase">
              IRON<span className="text-primary-500">.</span>
            </span>
          </Link>
          <p className="text-sm leading-relaxed max-w-xs mt-2">
            Premium gym accessories built for athletes. We engineer gear that survives your toughest workouts so you can focus on lifting heavier.
          </p>
          <div className="flex items-center gap-5 mt-4 font-bold text-xs tracking-widest text-neutral-500">
            <Link href="#" className="hover:text-primary-500 transition-colors">INSTA</Link>
            <Link href="#" className="hover:text-primary-500 transition-colors">FB</Link>
            <Link href="#" className="hover:text-primary-500 transition-colors">X</Link>
            <Link href="#" className="hover:text-primary-500 transition-colors">YT</Link>
          </div>
        </div>

        {/* Quick Links */}
        <div className="flex flex-col gap-4">
          <h4 className="text-white font-bold uppercase tracking-wider text-sm mb-2">Shop</h4>
          <Link href="/shop?category=Accessories" className="text-sm hover:text-primary-500 transition-colors">Lifting Belts</Link>
          <Link href="/shop?category=Accessories" className="text-sm hover:text-primary-500 transition-colors">Wrist Wraps</Link>
          <Link href="/shop?category=Accessories" className="text-sm hover:text-primary-500 transition-colors">Knee Sleeves</Link>
          <Link href="/shop" className="text-sm hover:text-primary-500 transition-colors">All Products</Link>
        </div>

        {/* Company Links */}
        <div className="flex flex-col gap-4">
          <h4 className="text-white font-bold uppercase tracking-wider text-sm mb-2">Company</h4>
          <Link href="/about" className="text-sm hover:text-primary-500 transition-colors">About Us</Link>
          <Link href="#" className="text-sm hover:text-primary-500 transition-colors">Contact</Link>
          <Link href="#" className="text-sm hover:text-primary-500 transition-colors">Privacy Policy</Link>
          <Link href="#" className="text-sm hover:text-primary-500 transition-colors">Terms of Service</Link>
        </div>

        {/* Newsletter */}
        <div className="flex flex-col gap-4">
          <h4 className="text-white font-bold uppercase tracking-wider text-sm mb-2">Stay Updated</h4>
          <p className="text-sm leading-relaxed">
            Subscribe to get special offers, free giveaways, and once-in-a-lifetime deals.
          </p>
          <div className="flex mt-2">
            <input 
              type="email" 
              placeholder="Enter your email" 
              className="bg-neutral-900 border border-neutral-800 text-white text-sm rounded-l-lg px-4 py-2.5 outline-none w-full focus:border-neutral-600 transition-colors"
            />
            <button className="bg-primary-500 text-neutral-950 font-bold text-sm px-5 py-2.5 rounded-r-lg hover:bg-primary-400 transition-colors">
              Subscribe
            </button>
          </div>
        </div>

      </div>
      
      <div className="max-w-7xl mx-auto px-6 mt-16 pt-8 border-t border-neutral-900 flex flex-col md:flex-row items-center justify-between gap-4 text-xs">
        <p>© 2026 IRON Gym Gear. All rights reserved.</p>
        <div className="flex gap-4">
          <span>Secure Checkout</span>
          <span>Fast Shipping</span>
        </div>
      </div>
    </footer>
  );
}
