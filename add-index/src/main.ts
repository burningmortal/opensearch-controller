import { env } from './core/config/schema';
import { OpenSearchClient } from './core/opensearch-client/client';

const main = async () => {
  const node = `${env.opensearchProtocol}://${env.opensearchUsername}:${env.opensearchPassword}@${env.opensearchHostname}:${env.opensearchPort}`;
  const client = new OpenSearchClient(node, { ssl: { rejectUnauthorized: env.opensearchRejectAuthorized } });
  const health = await client.health();
  await client.bulkInsert('articles', [{ title: 'a', summary: 'b', path: 'ts' }]);
};

void main();
