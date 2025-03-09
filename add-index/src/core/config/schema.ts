import { z } from 'zod';

const schema = z.object({
  opensearchProtocol: z.string(),
});

const parsedEnv = schema.safeParse({
  opensearchProtocol: process.env.OPENSEARCH_PROTOCOL,
});

if (!parsedEnv.success) {
  throw new Error('Invalid environment variables');
}

export const env = parsedEnv.data;
