import { existsSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";

const VIDEO_DIR = join(process.cwd(), "public", "videos");
const VIDEO_EXT = /\.(mp4|mov|webm)$/i;

/** Smallest files first — fastest to download and start playback */
export const HERO_VIDEO_INITIAL_COUNT = 6;

function videoSortRank(filename: string): number {
  const lower = filename.toLowerCase();
  if (lower.endsWith(".mp4")) return 0;
  if (lower.endsWith(".webm")) return 1;
  return 2;
}

function loadHeroVideosBySize() {
  if (!existsSync(VIDEO_DIR)) {
    return { all: [] as string[], initial: [] as string[], deferred: [] as string[] };
  }

  const entries = readdirSync(VIDEO_DIR)
    .filter((file) => VIDEO_EXT.test(file))
    .map((file) => {
      const path = join(VIDEO_DIR, file);
      const size = statSync(path).size;
      return { file, size, path: `/videos/${file}` };
    })
    .sort((a, b) => {
      if (a.size !== b.size) return a.size - b.size;
      const rankDiff = videoSortRank(a.file) - videoSortRank(b.file);
      return rankDiff !== 0 ? rankDiff : a.file.localeCompare(b.file);
    });

  const all = entries.map((e) => e.path);
  const initial = all.slice(0, HERO_VIDEO_INITIAL_COUNT);
  const deferred = all.slice(HERO_VIDEO_INITIAL_COUNT);

  return { all, initial, deferred };
}

const { all, initial, deferred } = loadHeroVideosBySize();

/** Every hero video path, smallest → largest */
export const HERO_VIDEO_PATHS = all;

/** First paint: six smallest files for fast LCP */
export const HERO_VIDEO_PATHS_INITIAL = initial;

/** Loaded after idle — remaining videos */
export const HERO_VIDEO_PATHS_DEFERRED = deferred;

export const HERO_VIDEOS_INITIAL = initial.join(",");
export const HERO_VIDEOS_DEFERRED = deferred.join(",");

/** @deprecated Prefer HERO_VIDEOS_INITIAL + deferred loading */
export const HERO_VIDEOS = HERO_VIDEOS_INITIAL;
