import Link from 'next/link';

export function Footer() {
  return (
    <footer className="mt-auto border-t bg-slate-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <span className="text-lg font-bold text-slate-900">BrandName</span>
            <p className="text-sm text-slate-500 leading-relaxed">
              Your one stop shop for everything amazing. Best quality, fast delivery, and awesome customer support.
            </p>
          </div>
          <div>
            <h3 className="font-semibold text-slate-900 mb-4">Shop</h3>
            <ul className="space-y-3 text-sm text-slate-500">
              <li><Link href="/shop" className="hover:text-slate-900 transition-colors">All Products</Link></li>
              <li><Link href="#" className="hover:text-slate-900 transition-colors">Categories</Link></li>
              <li><Link href="#" className="hover:text-slate-900 transition-colors">New Arrivals</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold text-slate-900 mb-4">Company</h3>
            <ul className="space-y-3 text-sm text-slate-500">
              <li><Link href="#" className="hover:text-slate-900 transition-colors">About Us</Link></li>
              <li><Link href="#" className="hover:text-slate-900 transition-colors">Contact</Link></li>
              <li><Link href="#" className="hover:text-slate-900 transition-colors">FAQ</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold text-slate-900 mb-4">Legal</h3>
            <ul className="space-y-3 text-sm text-slate-500">
              <li><Link href="#" className="hover:text-slate-900 transition-colors">Privacy Policy</Link></li>
              <li><Link href="#" className="hover:text-slate-900 transition-colors">Terms of Service</Link></li>
              <li><Link href="#" className="hover:text-slate-900 transition-colors">Returns Policy</Link></li>
            </ul>
          </div>
        </div>
        <div className="mt-12 pt-8 border-t border-slate-200 text-center text-sm text-slate-500">
          <p>&copy; {new Date().getFullYear()} BrandName. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
