import { z } from 'zod';

const schema = z.object({
  id: z.string(),
  title: z.string(),
  summary: z.string(),
  link: z.string(),
  author: z.string(),
  issued: z.string(),
});
