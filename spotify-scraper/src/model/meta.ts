import { z } from 'zod';

export const metaSchema = z
  .object({
    createdAt: z
      .string()
      .regex(
        /^[0-9]{4}-(0[1-9]|1[0-2])-(0[1-9]|[12][0-9]|3[01])T(0[0-9]|1[0-9]|2[0-3]):([0-5][0-9]):([0-5][0-9])\.[0-9]{3}Z$/,
        'ISO8601形式のUTCで入力してください (ex. `yyyy-MM-ddTHH:MM:ss.SSSZ`)',
      ),
    updatedAt: z.string(),
    owner: z.string(),
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
