import { settingService } from "@/lib/api/settingService";

export async function VideoSection() {
  let videoId = "7wtfhZwyrcc";
  
  try {
    const settings = await settingService.getSettings();
    if (settings.youtube_video_id) {
      videoId = settings.youtube_video_id;
    }
  } catch (error) {
    console.error("Failed to fetch settings for video section:", error);
  }

  if (!videoId) return null;

  return (
    <section className="relative w-full h-[300px] sm:h-[400px] md:h-[500px] lg:h-[600px] xl:h-[800px] overflow-hidden bg-black">
      {/* Fullscreen YouTube video, title bar hidden by shifting iframe up */}
      <iframe
        className="absolute left-0 w-full z-0"
        style={{
          top: "-60px",
          height: "calc(100% + 120px)", // extra top for title-hide + extra bottom so controls area isn't clipped
        }}
        src={`https://www.youtube.com/embed/${videoId}?autoplay=1&mute=1&loop=1&controls=1&rel=0&playlist=${videoId}&modestbranding=1&playsinline=1`}
        title="YouTube video player"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share; fullscreen"
        allowFullScreen
      ></iframe>
    </section>
  );
}