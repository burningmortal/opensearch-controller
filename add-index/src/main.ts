import { Client } from '@opensearch-project/opensearch';
import { env } from './core/config/schema';

const main = async () => {
  const client = new Client({
    node: `${env.opensearchProtocol}://${env.opensearchUsername}:${env.opensearchPassword}@${env.opensearchHostname}:${env.opensearchPort}`,
    ssl: { rejectUnauthorized: env.opensearchRejectAuthorized },
  });
  const health = await client.cluster.health();
  console.log(health);
};

void main();
