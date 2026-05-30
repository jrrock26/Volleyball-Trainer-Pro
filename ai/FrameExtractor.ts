import * as VideoThumbnails from "expo-video-thumbnails";

export async function extractFrames(videoUri: string, fps = 10) {
  const frames: string[] = [];
  const stepMs = 1000 / fps;

  for (let i = 0; i < fps * 2; i++) {
    try {
      const { uri } = await VideoThumbnails.getThumbnailAsync(videoUri, {
        time: i * stepMs,
      });
      frames.push(uri);
    } catch {}
  }

  return frames;
}
