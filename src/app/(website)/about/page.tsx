import Image from "next/image";
import Link from "next/link";
import { Dumbbell, ShieldCheck, Activity, Users } from "lucide-react";

export const metadata = {
  title: "About Us | Premium Gym Accessories",
  description: "Learn more about our mission to provide the highest quality gym gear and accessories to fuel your fitness journey.",
};

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-950 text-neutral-900 dark:text-neutral-50 selection:bg-primary-500 selection:text-white">
      
      {/* 1. Hero Section */}
      <section className="relative w-full h-[60vh] md:h-[70vh] flex items-center justify-center overflow-hidden">
        {/* Background Image with Overlay */}
        <div className="absolute inset-0 z-0">
          <Image
            src="https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=1600&q=80"
            alt="Gym environment"
            fill
            priority
            sizes="100vw"
            className="object-cover object-center"
          />
          <div className="absolute inset-0 bg-neutral-950/70" />
        </div>

        {/* Hero Content */}
        <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tighter text-white mb-6 uppercase">
            Fueling Your <span className="text-primary-500">Fitness</span> Journey
          </h1>
          <p className="text-lg md:text-2xl text-neutral-300 max-w-2xl mx-auto font-medium leading-relaxed">
            We engineer premium gym accessories designed to push your limits, enhance your performance, and protect your body during the heaviest lifts.
          </p>
        </div>
      </section>

      {/* 2. Our Story Section */}
      <section className="py-24 px-6 sm:px-12 lg:px-24 max-w-7xl mx-auto">
        <div className="flex flex-col lg:flex-row gap-16 items-center">
          
          {/* Story Text */}
          <div className="lg:w-1/2 flex flex-col gap-6">
            <h2 className="text-sm font-bold tracking-widest text-primary-500 uppercase">Our Origin</h2>
            <h3 className="text-4xl md:text-5xl font-extrabold tracking-tight">Built By Athletes,<br/>For Athletes.</h3>
            <p className="text-lg text-neutral-600 dark:text-neutral-400 leading-relaxed mt-2">
              It started with a simple frustration: gym gear that couldn't keep up with our intensity. Frayed lifting straps, uncomfortable belts, and grips that slipped mid-deadlift. We knew there had to be a better standard.
            </p>
            <p className="text-lg text-neutral-600 dark:text-neutral-400 leading-relaxed">
              That’s why we founded this brand. We source only the highest-grade materials—military-grade nylon, premium leather, and heavy-duty steel—to create accessories that outlast your toughest workouts. Our mission is to equip you with gear you never have to second-guess.
            </p>
          </div>

          {/* Story Image */}
          <div className="lg:w-1/2 w-full relative aspect-[4/3] rounded-3xl overflow-hidden shadow-2xl">
            <Image
              src="https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800&q=80"
              alt="Dumbbells on gym floor"
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover"
            />
            {/* Aesthetic inset border */}
            <div className="absolute inset-4 border border-white/20 rounded-2xl pointer-events-none" />
          </div>

        </div>
      </section>

      {/* 3. Core Values / Why Choose Us */}
      <section className="py-24 bg-neutral-900 text-white px-6 sm:px-12 lg:px-24">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-sm font-bold tracking-widest text-primary-500 uppercase mb-4">Why Choose Us</h2>
            <h3 className="text-4xl font-extrabold tracking-tight">Uncompromising Quality</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
            
            {/* Value 1 */}
            <div className="flex flex-col items-center text-center p-8 bg-neutral-800 rounded-2xl hover:bg-neutral-800/80 transition-colors border border-neutral-700">
              <div className="w-16 h-16 bg-primary-500/10 rounded-full flex items-center justify-center mb-6">
                <ShieldCheck className="w-8 h-8 text-primary-500" />
              </div>
              <h4 className="text-xl font-bold mb-3">Extreme Durability</h4>
              <p className="text-neutral-400 leading-relaxed">
                Tested in real-world hardcore gym environments to ensure they never tear, snap, or fail.
              </p>
            </div>

            {/* Value 2 */}
            <div className="flex flex-col items-center text-center p-8 bg-neutral-800 rounded-2xl hover:bg-neutral-800/80 transition-colors border border-neutral-700">
              <div className="w-16 h-16 bg-primary-500/10 rounded-full flex items-center justify-center mb-6">
                <Activity className="w-8 h-8 text-primary-500" />
              </div>
              <h4 className="text-xl font-bold mb-3">Peak Performance</h4>
              <p className="text-neutral-400 leading-relaxed">
                Ergonomically designed to biomechanically support your joints and improve your lifting efficiency.
              </p>
            </div>

            {/* Value 3 */}
            <div className="flex flex-col items-center text-center p-8 bg-neutral-800 rounded-2xl hover:bg-neutral-800/80 transition-colors border border-neutral-700">
              <div className="w-16 h-16 bg-primary-500/10 rounded-full flex items-center justify-center mb-6">
                <Dumbbell className="w-8 h-8 text-primary-500" />
              </div>
              <h4 className="text-xl font-bold mb-3">Pro-Grade Gear</h4>
              <p className="text-neutral-400 leading-relaxed">
                From powerlifters to bodybuilders, our accessories are trusted by professionals on the platform.
              </p>
            </div>

            {/* Value 4 */}
            <div className="flex flex-col items-center text-center p-8 bg-neutral-800 rounded-2xl hover:bg-neutral-800/80 transition-colors border border-neutral-700">
              <div className="w-16 h-16 bg-primary-500/10 rounded-full flex items-center justify-center mb-6">
                <Users className="w-8 h-8 text-primary-500" />
              </div>
              <h4 className="text-xl font-bold mb-3">Athlete Community</h4>
              <p className="text-neutral-400 leading-relaxed">
                We aren't just a brand; we're a community of lifters pushing each other to achieve greatness.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* 4. Call to Action */}
      <section className="py-32 px-6 text-center relative overflow-hidden">
        {/* Abstract Background Element */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary-500/5 blur-[120px] rounded-full pointer-events-none" />
        
        <div className="relative z-10 max-w-3xl mx-auto">
          <h2 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-8">
            Ready to Upgrade Your Arsenal?
          </h2>
          <p className="text-xl text-neutral-600 dark:text-neutral-400 mb-12">
            Don't let subpar equipment hold you back. Equip yourself with the best tools and conquer your next PR.
          </p>
          <Link 
            href="/shop" 
            className="inline-flex items-center justify-center px-8 py-4 text-lg font-bold text-neutral-950 bg-primary-500 rounded-full hover:bg-primary-400 transition-colors shadow-[0_0_40px_-10px_rgba(245,158,11,0.5)] hover:shadow-[0_0_60px_-15px_rgba(245,158,11,0.6)] transform hover:-translate-y-1"
          >
            Shop Gym Accessories
          </Link>
        </div>
      </section>

    </div>
  );
}
