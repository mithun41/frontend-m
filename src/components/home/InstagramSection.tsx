import Image from "next/image";
import Link from "next/link";
import { instagramService, InstagramImage } from "@/lib/api/instagramService";
import { getImageUrl } from "@/lib/utils";

const InstagramIcon = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
  </svg>
);

export async function InstagramSection() {
  let images: InstagramImage[] = [];
  try {
    images = await instagramService.getAll();
  } catch (error) {
    console.error("Failed to fetch Instagram images:", error);
  }

  if (!images || images.length === 0) {
    return null;
  }

  return (
    <section className="bg-black py-16 w-full">
      <div className="flex flex-col items-center mb-10 text-white">
        <InstagramIcon className="w-12 h-12 mb-4" />
        <h2 className="text-xl sm:text-2xl font-bold tracking-[0.1em] uppercase">
          On Instagram
        </h2>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-5 gap-1 w-full max-w-[1920px] mx-auto px-1">
        {images.map((post) => (
          <Link
            key={post.id}
            href="https://www.instagram.com"
            target="_blank"
            rel="noopener noreferrer"
            className="relative aspect-square w-full overflow-hidden group block"
          >
            <Image
              src={getImageUrl(post.image)}
              alt="Instagram Post"
              fill
              unoptimized
              sizes="(max-width: 768px) 50vw, 20vw"
              className="object-cover transition-transform duration-700 ease-out group-hover:scale-110"
            />
            
            {/* Hover overlay with Instagram icon */}
            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
              <InstagramIcon className="w-10 h-10 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100" />
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
