import { Client } from '@opensearch-project/opensearch';
import { env } from './core/config/schema';

const main = async () => {
  const client = new Client({
    node: `${env.opensearchProtocol}://${process.env['OPENSEARCH_USERNAME']}:${process.env['OPENSEARCH_PASSWORD']}@${process.env['OPENSEARCH_HOSTNAME']}:${process.env['OPENSEARCH_PORT']}`,
    ssl: { rejectUnauthorized: process.env['OPENSEARCH_REJECT_AUTHORIZED'] === 'true' },
  });
  const health = await client.cluster.health();
  console.log(health);
};

void main();
