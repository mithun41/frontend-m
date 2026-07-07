import Link from "next/link";

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-neutral-50 dark:bg-neutral-950 px-6">
      <div className="w-full max-w-md bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-3xl p-8 shadow-xl">
        <div className="flex flex-col items-center mb-8 text-center">
          <span className="text-3xl font-black tracking-tight text-neutral-900 dark:text-neutral-50">
            M-Commerce
          </span>
          <h2 className="text-2xl font-bold mt-4 tracking-tight">Welcome Back</h2>
          <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-2">
            Enter your credentials to access your account
          </p>
        </div>

        <form className="flex flex-col gap-5">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-neutral-600 dark:text-neutral-400 uppercase tracking-wider">
              Email Address
            </label>
            <input
              type="email"
              placeholder="name@example.com"
              className="px-4 py-3 rounded-xl bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 text-sm focus:outline-none focus:border-neutral-900 dark:focus:border-white transition-colors"
              required
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <div className="flex justify-between items-center">
              <label className="text-xs font-semibold text-neutral-600 dark:text-neutral-400 uppercase tracking-wider">
                Password
              </label>
              <Link
                href="/forgot-password"
                className="text-xs font-semibold hover:underline text-amber-500"
              >
                Forgot Password?
              </Link>
            </div>
            <input
              type="password"
              placeholder="••••••••"
              className="px-4 py-3 rounded-xl bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 text-sm focus:outline-none focus:border-neutral-900 dark:focus:border-white transition-colors"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-neutral-900 dark:bg-white text-white dark:text-black font-semibold rounded-xl hover:bg-neutral-800 dark:hover:bg-neutral-100 transition-colors shadow-md mt-2"
          >
            Sign In
          </button>
        </form>

        <div className="text-center mt-6">
          <p className="text-sm text-neutral-500 dark:text-neutral-400">
            Don't have an account?{" "}
            <Link href="/register" className="font-bold hover:underline text-amber-500">
              Create an account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
