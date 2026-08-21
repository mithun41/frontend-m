"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { Play } from "lucide-react";

interface VideoPlayerProps {
  videoId: string;
}

export function VideoPlayer({ videoId }: VideoPlayerProps) {
  const [isInView, setIsInView] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Lazy load the video player only when the user scrolls near the section
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
        } else {
          // If scrolled out of view, we can pause or keep minimal
          setIsInView(false);
        }
      },
      { rootMargin: "150px" } // trigger 150px before entering viewport
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => {
      observer.disconnect();
    };
  }, []);

  const thumbnailUrl = `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
  const fallbackThumbnailUrl = `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;

  return (
    <div ref={containerRef} className="relative w-full h-full bg-black overflow-hidden group">
      {isInView || isPlaying ? (
        <iframe
          className="absolute left-0 w-full h-full z-0"
          style={{
            top: "-60px",
            height: "calc(100% + 120px)",
          }}
          src={`https://www.youtube.com/embed/${videoId}?autoplay=1&mute=1&loop=1&controls=1&rel=0&playlist=${videoId}&modestbranding=1&playsinline=1`}
          title="YouTube video player"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share; fullscreen"
          allowFullScreen
          loading="lazy"
        />
      ) : (
        /* Sleek poster placeholder when not in viewport to save bandwidth and prevent idle calls */
        <div className="absolute inset-0 flex items-center justify-center cursor-pointer">
          <Image
            src={thumbnailUrl}
            alt="Video Thumbnail"
            fill
            className="object-cover opacity-80 group-hover:scale-105 transition-transform duration-700"
            unoptimized
            onError={(e: any) => {
              e.currentTarget.src = fallbackThumbnailUrl;
            }}
          />
          <div className="absolute inset-0 bg-black/30 backdrop-blur-[2px]" />
          <div className="relative z-10 w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/40 shadow-xl group-hover:scale-110 transition-transform">
            <Play className="w-8 h-8 sm:w-10 sm:h-10 text-white fill-white translate-x-0.5" />
          </div>
        </div>
      )}
    </div>
  );
}
