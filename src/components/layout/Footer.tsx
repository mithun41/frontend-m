import Link from "next/link";

const Instagram = ({ className }: { className?: string }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24">
    <path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clipRule="evenodd" />
  </svg>
);

const Facebook = ({ className }: { className?: string }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24">
    <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"/>
  </svg>
);

const Youtube = ({ className }: { className?: string }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24">
    <path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
  </svg>
);

const TikTok = ({ className }: { className?: string }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24">
    <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 11-5.2-1.74 2.89 2.89 0 012.31-4.64 2.93 2.93 0 01.88.13V5.8a6.84 6.84 0 00-1-.05A6.33 6.33 0 003 12a6.34 6.34 0 0010.86 4.43v-7a8.16 8.16 0 004.77 1.52v-3.4a4.85 4.85 0 01-3.04-.86z"/>
  </svg>
);

const WhatsApp = ({ className }: { className?: string }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24">
    <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/>
  </svg>
);

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
          <div className="flex items-center gap-3 mt-4 flex-wrap">
            <Link
              href="https://wa.me/8801815185843"
              target="_blank"
              rel="noopener noreferrer"
              className="w-10 h-10 rounded-full bg-[#25D366] flex items-center justify-center text-white hover:scale-110 hover:shadow-lg hover:shadow-green-500/25 transition-all duration-300"
              aria-label="WhatsApp"
              title="Chat on WhatsApp"
            >
              <WhatsApp className="w-5 h-5" />
            </Link>
            <Link
              href="https://www.instagram.com/dravonofficial.bd?igsh=bG83dm9wOTA4ZDh2"
              target="_blank"
              rel="noopener noreferrer"
              className="w-10 h-10 rounded-full bg-gradient-to-tr from-[#f09433] via-[#dc2743] to-[#bc1888] flex items-center justify-center text-white hover:scale-110 hover:shadow-lg hover:shadow-pink-500/25 transition-all duration-300"
              aria-label="Instagram"
            >
              <Instagram className="w-5 h-5" />
            </Link>
            <Link
              href="https://www.facebook.com/share/1EXhBaYEos/"
              target="_blank"
              rel="noopener noreferrer"
              className="w-10 h-10 rounded-full bg-[#1877F2] flex items-center justify-center text-white hover:scale-110 hover:shadow-lg hover:shadow-blue-500/25 transition-all duration-300"
              aria-label="Facebook"
            >
              <Facebook className="w-5 h-5" />
            </Link>
            <Link
              href="https://youtube.com/@dravonfit?si=4jXg-XeFvBCrJjXI"
              target="_blank"
              rel="noopener noreferrer"
              className="w-10 h-10 rounded-full bg-[#FF0000] flex items-center justify-center text-white hover:scale-110 hover:shadow-lg hover:shadow-red-500/25 transition-all duration-300"
              aria-label="YouTube"
            >
              <Youtube className="w-5 h-5" />
            </Link>
            <Link
              href="https://tiktok.com/@dravon.fit"
              target="_blank"
              rel="noopener noreferrer"
              className="w-10 h-10 rounded-full bg-black border border-neutral-800 flex items-center justify-center text-white hover:scale-110 hover:border-cyan-400 hover:shadow-lg hover:shadow-cyan-500/25 transition-all duration-300 group"
              aria-label="TikTok"
            >
              <TikTok className="w-5 h-5 group-hover:text-[#00F2FE] transition-colors" />
            </Link>
          </div>
        </div>

        {/* Quick Links */}
        <div className="flex flex-col gap-4">
          <h4 className="text-white font-bold uppercase tracking-wider text-sm mb-2">Shop</h4>
          <Link href="/shop?category=Men" prefetch={false} className="text-sm hover:text-primary-500 transition-colors">Men's Apparel</Link>
          <Link href="/shop?category=Women" prefetch={false} className="text-sm hover:text-primary-500 transition-colors">Women's Apparel</Link>
          <Link href="/shop?category=Gym+Accessories" prefetch={false} className="text-sm hover:text-primary-500 transition-colors">Gym Accessories</Link>
          <Link href="/shop?category=Gym+Bag" prefetch={false} className="text-sm hover:text-primary-500 transition-colors">Gym Bags</Link>
          <Link href="/shop" prefetch={false} className="text-sm hover:text-primary-500 transition-colors mt-1 font-semibold text-white">All Products</Link>
        </div>

        {/* Company Links */}
        <div className="flex flex-col gap-4">
          <h4 className="text-white font-bold uppercase tracking-wider text-sm mb-2">Company</h4>
          <Link href="/about" prefetch={false} className="text-sm hover:text-primary-500 transition-colors font-medium text-white">About Us</Link>
          <Link href="/contact" prefetch={false} className="text-sm hover:text-primary-500 transition-colors font-medium text-white">Contact</Link>
          <Link href="/track-order" prefetch={false} className="text-sm hover:text-primary-500 transition-colors">Track Order</Link>
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
            <Link
              href="https://wa.me/8801815185843"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-neutral-300 hover:text-[#25D366] transition-colors"
            >
              <WhatsApp className="w-4 h-4 text-[#25D366] shrink-0" />
              <span><strong className="text-white">WhatsApp:</strong> 01815185843</span>
            </Link>
          </p>
          <p className="text-sm">
            <a href="tel:01815185843" className="hover:text-white transition-colors">
              <span className="font-semibold text-white">Phone:</span> 01815185843
            </a>
          </p>
          <p className="text-sm">
            <a href="mailto:dravonofficial.bd@gmail.com" className="hover:text-white transition-colors">
              <span className="font-semibold text-white">Email:</span> dravonofficial.bd@gmail.com
            </a>
          </p>
        </div>

      </div>
      
      <div className="max-w-7xl mx-auto px-6 mt-16 pt-8 border-t border-neutral-900 flex flex-col items-center gap-6">
        <div className="w-full max-w-5xl mx-auto">
          <img src="/footer.png" alt="Secure Payment Methods" className="w-full h-auto object-contain" />
        </div>
        
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-xs w-full">
          <p>© 2026 DRAVON. All rights reserved.</p>
          <div className="flex gap-4">
            <span>Secure Checkout</span>
            <span>Fast Shipping</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
