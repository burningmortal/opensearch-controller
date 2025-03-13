import { z } from 'zod';

const albumSchema = z
  .object({
    name: z.string(),
    releaseDate: z.string(),
  })
  .strict();

const artistSchema = z.array(
  z
    .object({
      name: z.string(),
      kana: z.string(),
    })
    .strict(),
);

export const trackSchema = z
  .object({
    title: z.string(),
    album: albumSchema,
    artist: artistSchema,
    duration: z.number(),
    artwork: z.string(),
  })
  .strict();

export type Album = z.infer<typeof albumSchema>;

export type Artist = z.infer<typeof artistSchema>;

export type Track = z.infer<typeof trackSchema>;

export const parseTrack = (value: Partial<Track>): Track | undefined => {
  const parsed = trackSchema.safeParse(value);
  if (!parsed.success) {
    console.error(JSON.stringify(parsed.error.issues));
    return undefined;
  }
  return parsed.data;
};
