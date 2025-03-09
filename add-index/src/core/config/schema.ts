import { z } from 'zod';

const schema = z.object({
  opensearchProtocol: z.string(),
  opensearchUsername: z.string(),
  opensearchPassword: z.string(),
  opensearchHostname: z.string(),
  opensearchRejectAuthorized: z.boolean(),
  opensearchPort: z.number(),
});

const parsedEnv = schema.safeParse({
  opensearchProtocol: process.env.OPENSEARCH_PROTOCOL,
  opensearchUsername: process.env.OPENSEARCH_USERNAME,
  opensearchPassword: process.env.OPENSEARCH_PASSWORD,
  opensearchHostname: process.env.OPENSEARCH_HOSTNAME,
  opensearchRejectAuthorized: z.coerce.boolean().parse(process.env.OPENSEARCH_REJECT_AUTHORIZED),
  opensearchPort: z.coerce.number().parse(process.env.OPENSEARCH_PORT),
});

if (!parsedEnv.success) {
  throw new Error('Invalid environment variables');
}

export const env = parsedEnv.data;
