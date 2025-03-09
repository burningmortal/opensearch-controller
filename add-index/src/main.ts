import { env } from './core/config/schema';
import { OpenSearchClient } from './core/opensearch-client/client';
import { load } from './core/csv/loader';

const main = async () => {
  const records = load('./source.csv');

  const node = `${env.opensearchProtocol}://${env.opensearchUsername}:${env.opensearchPassword}@${env.opensearchHostname}:${env.opensearchPort}`;
  const client = new OpenSearchClient(node, { ssl: { rejectUnauthorized: env.opensearchRejectAuthorized } });
  const health = await client.health();
  await client.bulkInsert('articles', { '1': { title: 'a', summary: 'b', path: 'ts' } });
};

void main();
