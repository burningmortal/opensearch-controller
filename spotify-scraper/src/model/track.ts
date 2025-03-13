import { z } from 'zod';
import { DATE_REGEX, YEAR_REGEX } from '../core/regex/datetime';

const albumSchema = z
  .object({
    name: z.string().min(1, '入力必須です').max(1000, ' 1000文字以内で入力してください'),
    releaseDate: z
      .string()
      .regex(DATE_REGEX, '`yyyy-MM-dd`または`yyyy`形式で入力してください')
      .or(z.string().regex(YEAR_REGEX, '`yyyy-MM-dd`または`yyyy`形式で入力してください')),
  })
  .strict();

const artistSchema = z
  .object({
    name: z.string().min(1, '入力必須です').max(1000, ' 1000文字以内で入力してください'),
    kana: z.string().min(1, '入力必須です').max(1000, ' 1000文字以内で入力してください'),
  })
  .strict();

export const trackSchema = z
  .object({
    title: z.string().min(1, '入力必須です').max(1000, ' 1000文字以内で入力してください'),
    album: albumSchema,
    artist: z.array(artistSchema).nonempty(),
    duration: z
      .number()
      .int('整数で入力してください')
      .positive('1以上の値を入力してください')
      .max(1000 * 60 * 60 * 24, `${1000 * 60 * 60 * 24}以内の値を入力してください`)
      .optional(),
    artwork: z.string().url(),
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
