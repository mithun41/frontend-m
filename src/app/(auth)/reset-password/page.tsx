"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import { authService } from "@/lib/api/authService";
import { Eye, EyeOff } from "lucide-react";

function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  useEffect(() => {
    const emailParam = searchParams.get("email");
    if (emailParam) {
      setEmail(emailParam);
    }
  }, [searchParams]);

  const resetMutation = useMutation({
    mutationFn: authService.resetPassword,
    onSuccess: (data) => {
      setSuccessMsg(data?.message || "Password reset successfully! Redirecting to login...");
      setTimeout(() => {
        router.push("/login");
      }, 2000);
    },
    onError: (error: any) => {
      const errorData = error?.response?.data;
      if (errorData) {
        if (typeof errorData === "string") {
          setErrorMsg(errorData);
        } else if (errorData.detail) {
          setErrorMsg(errorData.detail);
        } else {
          const messages = Object.entries(errorData)
            .map(([field, errs]) => {
              const fieldName = field.charAt(0).toUpperCase() + field.slice(1).replace("_", " ");
              const fieldErrors = Array.isArray(errs) ? errs.join(", ") : String(errs);
              return `${fieldName}: ${fieldErrors}`;
            })
            .join(" | ");
          setErrorMsg(messages || "Failed to reset password.");
        }
      } else {
        setErrorMsg(error?.message || "Failed to reset password.");
      }
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");

    if (newPassword !== confirmPassword) {
      setErrorMsg("Passwords do not match.");
      return;
    }

    resetMutation.mutate({
      email,
      otp,
      new_password: newPassword
    });
  };

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
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-primary-500/20 rounded-full blur-[80px] pointer-events-none"></div>
          
          <div className="w-20 h-20 rounded-2xl overflow-hidden bg-white/10 p-2 mb-6 shadow-xl border border-white/20 relative z-10 flex items-center justify-center">
            <img src="/logo.jpg" alt="DRAVON Logo" className="w-full h-full object-contain rounded-xl" />
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white mb-4 tracking-wider uppercase relative z-10">
            DRAVON
          </h2>
          <p className="text-white/80 text-lg max-w-[250px] leading-relaxed relative z-10">
            Push your limits, achieve greatness, and gear up with the best.
          </p>
        </div>

        {/* Right Column: Reset Password Form */}
        <div className="flex-[1.2] p-8 md:p-12 bg-white/5">
          <div className="w-full max-w-sm mx-auto">
            <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">Reset Password</h1>
            <p className="text-white/60 text-sm mb-8">Enter your verification details and choose a new password.</p>

            {errorMsg && (
              <div className="mb-4 p-3 bg-red-500/20 border border-red-500/50 rounded-lg text-red-200 text-sm">
                {errorMsg}
              </div>
            )}

            {successMsg && (
              <div className="mb-4 p-3 bg-green-500/20 border border-green-500/50 rounded-lg text-green-200 text-sm">
                {successMsg}
              </div>
            )}

            <form onSubmit={handleSubmit} className="flex flex-col gap-5">
              {/* Email Address */}
              <div className="flex flex-col gap-2">
                <label className="text-xs font-bold uppercase tracking-wider text-white/80">Email Address</label>
                <input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3.5 text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:bg-white/20 transition-all backdrop-blur-md"
                  required
                />
              </div>

              {/* OTP Code */}
              <div className="flex flex-col gap-2">
                <label className="text-xs font-bold uppercase tracking-wider text-white/80">6-Digit OTP</label>
                <input 
                  type="text" 
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  placeholder="123456"
                  maxLength={6}
                  className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3.5 text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:bg-white/20 transition-all backdrop-blur-md tracking-[0.25em] text-center font-bold"
                  required
                />
              </div>

              {/* New Password */}
              <div className="flex flex-col gap-2">
                <label className="text-xs font-bold uppercase tracking-wider text-white/80">New Password</label>
                <div className="relative">
                  <input 
                    type={showPassword ? "text" : "password"} 
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full bg-white/10 border border-white/20 rounded-xl pl-4 pr-10 py-3.5 text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:bg-white/20 transition-all backdrop-blur-md"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-white/60 hover:text-white"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Confirm Password */}
              <div className="flex flex-col gap-2">
                <label className="text-xs font-bold uppercase tracking-wider text-white/80">Confirm Password</label>
                <div className="relative">
                  <input 
                    type={showConfirmPassword ? "text" : "password"} 
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full bg-white/10 border border-white/20 rounded-xl pl-4 pr-10 py-3.5 text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:bg-white/20 transition-all backdrop-blur-md"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-white/60 hover:text-white"
                  >
                    {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <button 
                type="submit"
                disabled={resetMutation.isPending}
                className="mt-4 w-full bg-primary-600 text-white py-4 rounded-xl font-bold tracking-widest uppercase text-sm hover:bg-primary-500 transition-colors duration-300 shadow-lg shadow-primary-500/30 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {resetMutation.isPending ? (
                  <>
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                    RESETTING PASSWORD...
                  </>
                ) : (
                  "RESET PASSWORD"
                )}
              </button>
            </form>

            <div className="mt-8 text-center text-sm text-white/60">
              Remembered your password?{" "}
              <Link href="/login" className="text-primary-400 hover:text-primary-300 font-bold ml-1 transition-colors">
                Login here
              </Link>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-neutral-950 text-white">
        <span className="w-8 h-8 border-4 border-white/30 border-t-white rounded-full animate-spin"></span>
      </div>
    }>
      <ResetPasswordForm />
    </Suspense>
  );
}
