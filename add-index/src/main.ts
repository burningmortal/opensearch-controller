import { env } from './core/config/schema';
import { OpenSearchClient } from './core/opensearch-client/client';

const main = async () => {
  const client = new OpenSearchClient(
    `${env.opensearchProtocol}://${env.opensearchUsername}:${env.opensearchPassword}@${env.opensearchHostname}:${env.opensearchPort}`,
    { ssl: { rejectUnauthorized: env.opensearchRejectAuthorized } },
  );

  const health = await client.health();
  console.log(health);
};

void main();
