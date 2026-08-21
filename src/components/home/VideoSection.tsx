import { settingService } from "@/lib/api/settingService";
import { VideoPlayer } from "./VideoPlayer";

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
      <VideoPlayer videoId={videoId} />
    </section>
  );
}