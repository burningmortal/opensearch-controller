import { env } from './core/config/schema';
import { OpenSearchClient } from './core/opensearch-client/client';
import * as fs from 'fs';
import csv from 'csv';

const main = async () => {
  const file = fs.readFileSync('./source.csv', 'utf8');
  const records = csv.parse(file, { escape: '\\' }).pipe(
    csv.transform((record) => {
      console.log(record);
      return record;
    }),
  );

  const node = `${env.opensearchProtocol}://${env.opensearchUsername}:${env.opensearchPassword}@${env.opensearchHostname}:${env.opensearchPort}`;
  const client = new OpenSearchClient(node, { ssl: { rejectUnauthorized: env.opensearchRejectAuthorized } });
  const health = await client.health();
  await client.bulkInsert('articles', { '1': { title: 'a', summary: 'b', path: 'ts' } });
};

void main();
