import { env } from './core/config/schema';
import { OpenSearchClient } from './core/opensearch-client/client';

const main = async () => {
  const node = `${env.opensearchProtocol}://${env.opensearchUsername}:${env.opensearchPassword}@${env.opensearchHostname}:${env.opensearchPort}`;
  const client = new OpenSearchClient(node, { ssl: { rejectUnauthorized: env.opensearchRejectAuthorized } });
  const health = await client.health();

  const res = await client.searchAll('articles');
  console.log(res);
};

void main();
