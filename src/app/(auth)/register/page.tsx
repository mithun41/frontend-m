"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { authService } from "@/lib/api/authService";
import { useAuthStore } from "@/store/useAuthStore";
import Swal from "sweetalert2";

export default function RegisterPage() {
  const router = useRouter();
  const setAuth = useAuthStore((state) => state.setAuth);
  
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone_number: "",
    password: "",
  });
  
  const [errors, setErrors] = useState<Record<string, string[]>>({});
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (errors[e.target.name]) {
      setErrors({ ...errors, [e.target.name]: [] });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    setIsLoading(true);

    try {
      await authService.register(formData);
      
      Swal.fire({
        title: "Registration Successful!",
        text: "Logging you into your new account...",
        icon: "success",
        timer: 2000,
        showConfirmButton: false,
        background: "#1f2937",
        color: "#fff",
      });
      
      try {
        const loginData = await authService.login({ email: formData.email, password: formData.password });
        setAuth(loginData.user, loginData.access, loginData.refresh);
        router.push("/");
      } catch (loginErr) {
        router.push("/login");
      }

    } catch (error: any) {
      const data = error?.response?.data;
      if (data && typeof data === 'object') {
        if (data.detail) {
          setErrors({ general: [data.detail] });
        } else {
          setErrors(data);
        }
      } else {
        setErrors({ general: ["Registration failed. Please try again."] });
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center p-4 sm:p-8">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <Image
          src="https://images.unsplash.com/photo-1517836357463-d25dfeac3438?q=80&w=1920&auto=format&fit=crop"
          alt="Gym Equipment Background"
          fill
          priority
          className="object-cover"
        />
        <div className="absolute inset-0 bg-neutral-950/70 backdrop-blur-[2px]"></div>
      </div>

      {/* Glassmorphism Card */}
      <div className="relative z-10 w-full max-w-[900px] backdrop-blur-2xl bg-white/10 border border-white/20 shadow-[0_8px_32px_0_rgba(0,0,0,0.37)] rounded-[2rem] overflow-hidden flex flex-col md:flex-row">
        
        {/* Left Column (Visual): Logo & Branding */}
        <div className="flex-1 p-8 md:p-12 flex flex-col justify-center items-center text-center bg-black/20 border-b md:border-b-0 md:border-r border-white/10 relative overflow-hidden">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-primary-500/20 rounded-full blur-[80px] pointer-events-none"></div>
          
          <div className="w-20 h-20 rounded-full bg-primary-500 flex items-center justify-center mb-6 shadow-xl shadow-primary-500/40 relative z-10">
            <span className="text-white font-black text-4xl">BN</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white mb-4 tracking-tight relative z-10">
            Join the <span className="text-primary-500">Elite</span>
          </h2>
          <p className="text-white/80 text-lg max-w-[250px] leading-relaxed relative z-10">
            Unlock exclusive discounts, track your orders, and join a community of champions.
          </p>
        </div>

        {/* Right Column: Register Form */}
        <div className="flex-[1.2] p-8 md:p-12 bg-white/5">
          <div className="w-full max-w-sm mx-auto">
            <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">Create Account</h1>
            <p className="text-white/60 text-sm mb-8">Sign up to get started with BrandName.</p>

            <form onSubmit={handleSubmit} className="flex flex-col gap-5">
              
              {errors.general && (
                <div className="p-3 bg-red-500/20 border border-red-500/50 rounded-xl text-red-200 text-sm">
                  {errors.general[0]}
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-white/80">Full Name</label>
                  <input 
                    type="text" 
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="John Doe"
                    className={`w-full bg-white/10 border rounded-xl px-4 py-3.5 text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:bg-white/20 transition-all backdrop-blur-md ${errors.name ? 'border-red-500 focus:ring-red-500' : 'border-white/20 focus:ring-primary-500'}`}
                    required
                  />
                  {errors.name && <p className="text-xs text-red-400 mt-1">{errors.name[0]}</p>}
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-white/80">Phone Number</label>
                  <input 
                    type="text" 
                    name="phone_number"
                    value={formData.phone_number}
                    onChange={handleChange}
                    placeholder="+880..."
                    className={`w-full bg-white/10 border rounded-xl px-4 py-3.5 text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:bg-white/20 transition-all backdrop-blur-md ${errors.phone_number ? 'border-red-500 focus:ring-red-500' : 'border-white/20 focus:ring-primary-500'}`}
                  />
                  {errors.phone_number && <p className="text-xs text-red-400 mt-1">{errors.phone_number[0]}</p>}
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-xs font-bold uppercase tracking-wider text-white/80">Email Address</label>
                <input 
                  type="email" 
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="name@example.com"
                  className={`w-full bg-white/10 border rounded-xl px-4 py-3.5 text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:bg-white/20 transition-all backdrop-blur-md ${errors.email ? 'border-red-500 focus:ring-red-500' : 'border-white/20 focus:ring-primary-500'}`}
                  required
                />
                {errors.email && <p className="text-xs text-red-400 mt-1">{errors.email[0]}</p>}
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-xs font-bold uppercase tracking-wider text-white/80">Password</label>
                <input 
                  type="password" 
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className={`w-full bg-white/10 border rounded-xl px-4 py-3.5 text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:bg-white/20 transition-all backdrop-blur-md ${errors.password ? 'border-red-500 focus:ring-red-500' : 'border-white/20 focus:ring-primary-500'}`}
                  required
                />
                {errors.password ? (
                  <p className="text-xs text-red-400 mt-1">{errors.password[0]}</p>
                ) : (
                  <p className="text-[10px] text-white/50 mt-1 leading-tight">Must be at least 8 characters long, and shouldn't be a commonly used password.</p>
                )}
              </div>

              <button 
                type="submit"
                disabled={isLoading}
                className="mt-6 w-full bg-primary-600 text-white py-4 rounded-xl font-bold tracking-widest uppercase text-sm hover:bg-primary-500 transition-colors duration-300 shadow-lg shadow-primary-500/30 disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {isLoading && (
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                )}
                Create Account
              </button>
            </form>

            <div className="mt-8 text-center text-sm text-white/60">
              Already have an account?{" "}
              <Link href="/login" className="text-primary-400 hover:text-primary-300 font-bold ml-1 transition-colors">
                Sign in instead
              </Link>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
