import { z } from 'zod';

const playlistSchema = z
  .object({
    title: z.string(),
    descrition: z.string(),
    tracks: z.object({}),
    meta: z.object({}),
  })
  .strict();

export type Playlist = z.infer<typeof playlistSchema>;

export const parsePlaylist = (value: Partial<Playlist>): Playlist | undefined => {
  const parsed = playlistSchema.safeParse(value);
  if (!parsed.success) {
    console.error(JSON.stringify(parsed.error.issues));
    return undefined;
  }
  return parsed.data;
};
