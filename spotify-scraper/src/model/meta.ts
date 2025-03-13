import { z } from 'zod';

export const metaSchema = z
  .object({
    createdAt: z.string(),
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
