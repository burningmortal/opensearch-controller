import { z } from 'zod';

const schema = z.object({
  id: z.string(),
  title: z.string(),
  summary: z.string(),
  link: z.string().url(),
  author: z.string(),
});

export type SearchDocument = z.infer<typeof schema>;

export type SearchDocumentBody = Omit<SearchDocument, 'id'>;

export type DocumentValidateResult = { isOk: true; value: SearchDocument } | { isOk: false };

export const validateDocument = (value: any): DocumentValidateResult => {
  const parsed = schema.safeParse({
    id: value?.id,
    title: value?.title,
    summary: value?.summary,
    link: value?.link,
    author: value?.author,
  });
  if (!parsed.success) {
    return { isOk: false };
  }
  const document = parsed.data;
  return { isOk: true, value: document };
};
