import Link from "next/link";

export function Footer() {
  return (
    <footer className="bg-neutral-950 text-neutral-400 py-16 border-t border-neutral-900">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
        
        {/* Brand Info */}
        <div className="flex flex-col gap-4">
          <Link href="/" className="flex items-center gap-2 text-white">
            <img src="/logo.jpg" alt="Logo" className="h-12 w-auto object-contain rounded-md" />
          </Link>
          <p className="text-sm leading-relaxed max-w-xs mt-2">
            Premium fitness gear built for athletes. We engineer apparel and accessories that survive your toughest workouts.
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
          <Link href="/shop?category=Men" className="text-sm hover:text-primary-500 transition-colors">Men's Apparel</Link>
          <Link href="/shop?category=Women" className="text-sm hover:text-primary-500 transition-colors">Women's Apparel</Link>
          <Link href="/shop?category=Gym+Accessories" className="text-sm hover:text-primary-500 transition-colors">Gym Accessories</Link>
          <Link href="/shop?category=Gym+Bag" className="text-sm hover:text-primary-500 transition-colors">Gym Bags</Link>
          <Link href="/shop" className="text-sm hover:text-primary-500 transition-colors mt-1 font-semibold text-white">All Products</Link>
        </div>

        {/* Company Links */}
        <div className="flex flex-col gap-4">
          <h4 className="text-white font-bold uppercase tracking-wider text-sm mb-2">Company</h4>
          <Link href="/about" className="text-sm hover:text-primary-500 transition-colors font-medium text-white">About Us</Link>
          <Link href="/contact" className="text-sm hover:text-primary-500 transition-colors font-medium text-white">Contact</Link>
          <Link href="/track-order" className="text-sm hover:text-primary-500 transition-colors">Track Order</Link>
          <Link href="#" className="text-sm hover:text-primary-500 transition-colors">Privacy Policy</Link>
          <Link href="#" className="text-sm hover:text-primary-500 transition-colors">Terms of Service</Link>
        </div>

        {/* Contact Us */}
        <div className="flex flex-col gap-4">
          <h4 className="text-white font-bold uppercase tracking-wider text-sm mb-2">Contact Us</h4>
          <p className="text-sm leading-relaxed">
            Mollik Tower (Lift-3), Holding No: 13-14,<br/>
            Zoo Road Mirpur-1, Dhaka-1216.
          </p>
          <p className="text-sm">
            <span className="font-semibold text-white">Phone:</span> 01815185843
          </p>
          <p className="text-sm">
            <span className="font-semibold text-white">Email:</span> dravonofficial.bd@gmail.com
          </p>
        </div>

      </div>
      
      <div className="max-w-7xl mx-auto px-6 mt-16 pt-8 border-t border-neutral-900 flex flex-col md:flex-row items-center justify-between gap-4 text-xs">
        <p>© 2026 BrandName. All rights reserved.</p>
        <div className="flex gap-4">
          <span>Secure Checkout</span>
          <span>Fast Shipping</span>
        </div>
      </div>
    </footer>
  );
}
