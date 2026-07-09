import Image from "next/image";
import Link from "next/link";

export const metadata = {
  title: "Login - BrandName",
  description: "Sign in to your account.",
};

export default function LoginPage() {
  return (
    <div className="relative min-h-screen flex items-center justify-center p-4 sm:p-8">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <Image
          src="https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=1920&auto=format&fit=crop"
          alt="Gym Background"
          fill
          priority
          className="object-cover"
        />
        <div className="absolute inset-0 bg-neutral-950/70 backdrop-blur-[2px]"></div>
      </div>

      {/* Glassmorphism Card */}
      <div className="relative z-10 w-full max-w-[900px] backdrop-blur-2xl bg-white/10 border border-white/20 shadow-[0_8px_32px_0_rgba(0,0,0,0.37)] rounded-[2rem] overflow-hidden flex flex-col md:flex-row">
        
        {/* Left Column: Logo & Branding */}
        <div className="flex-1 p-8 md:p-12 flex flex-col justify-center items-center text-center bg-black/20 border-b md:border-b-0 md:border-r border-white/10 relative overflow-hidden">
          {/* Subtle glow effect */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-primary-500/20 rounded-full blur-[80px] pointer-events-none"></div>
          
          <div className="w-20 h-20 rounded-full bg-primary-500 flex items-center justify-center mb-6 shadow-xl shadow-primary-500/40 relative z-10">
            <span className="text-white font-black text-4xl">BN</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white mb-4 tracking-tight relative z-10">
            Brand<span className="text-primary-500">Name</span>
          </h2>
          <p className="text-white/80 text-lg max-w-[250px] leading-relaxed relative z-10">
            Push your limits, achieve greatness, and gear up with the best.
          </p>
        </div>

        {/* Right Column: Login Form */}
        <div className="flex-[1.2] p-8 md:p-12 bg-white/5">
          <div className="w-full max-w-sm mx-auto">
            <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">Welcome Back</h1>
            <p className="text-white/60 text-sm mb-8">Sign in to your account to continue.</p>

            <form className="flex flex-col gap-5">
              <div className="flex flex-col gap-2">
                <label className="text-xs font-bold uppercase tracking-wider text-white/80">Email Address</label>
                <input 
                  type="email" 
                  placeholder="name@example.com"
                  className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3.5 text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:bg-white/20 transition-all backdrop-blur-md"
                  required
                />
              </div>

              <div className="flex flex-col gap-2">
                <div className="flex justify-between items-center">
                  <label className="text-xs font-bold uppercase tracking-wider text-white/80">Password</label>
                  <Link href="#" className="text-xs text-primary-400 hover:text-primary-300 transition-colors">Forgot?</Link>
                </div>
                <input 
                  type="password" 
                  placeholder="••••••••"
                  className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3.5 text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:bg-white/20 transition-all backdrop-blur-md"
                  required
                />
              </div>

              <div className="flex items-center gap-2 mt-2">
                <input type="checkbox" id="remember" className="w-4 h-4 rounded border-white/20 bg-white/10 text-primary-500 focus:ring-primary-500" />
                <label htmlFor="remember" className="text-sm text-white/70">Remember me</label>
              </div>

              <button 
                type="submit"
                className="mt-6 w-full bg-primary-600 text-white py-4 rounded-xl font-bold tracking-widest uppercase text-sm hover:bg-primary-500 transition-colors duration-300 shadow-lg shadow-primary-500/30"
              >
                Sign In
              </button>
            </form>

            <div className="mt-8 text-center text-sm text-white/60">
              Don't have an account?{" "}
              <Link href="/register" className="text-primary-400 hover:text-primary-300 font-bold ml-1 transition-colors">
                Create one now
              </Link>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
