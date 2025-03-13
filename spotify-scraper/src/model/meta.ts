import { z } from 'zod';
import { DATETIME_REGEX } from '../core/regex/datetime';

export const metaSchema = z
  .object({
    createdAt: z.string().regex(DATETIME_REGEX, 'ISO8601形式のUTCで入力してください (ex. `yyyy-MM-ddTHH:MM:ss.SSSZ`)'),
    updatedAt: z.string().regex(DATETIME_REGEX, 'ISO8601形式のUTCで入力してください (ex. `yyyy-MM-ddTHH:MM:ss.SSSZ`)'),
    owner: z.string().min(1, '入力必須です').max(1000, '1000文字以内で入力してください'),
  })
  .strict();

export type Meta = z.infer<typeof metaSchema>;

export const parseMeta = (value: Partial<Meta>): Meta | undefined => {
  const parsed = metaSchema.safeParse(value);
  if (!parsed.success) {
    console.error(JSON.stringify(parsed.error.issues));
    return undefined;
  }
  return parsed.data;
};
