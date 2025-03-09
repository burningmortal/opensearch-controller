import { env } from './core/config/schema';
import { OpenSearchClient } from './core/opensearch-client/client';
import { load } from './core/csv/loader';
import { SearchDocument, SearchDocumentBody } from './model/document';

const main = async () => {
  const records = load('./source.csv');
  if (!records) {
    console.error('Invalid CSV');
    return;
  }

  const documents: { [key: string]: SearchDocumentBody } = {};
  records.forEach((record, i) => {
    const prefix = 'BK-';
    const id = `${prefix}${i}`;
    documents[id] = {
      title: record.title,
      summary: record.summary,
      link: record.link,
      author: record.author,
    };
  });

  const node = `${env.opensearchProtocol}://${env.opensearchUsername}:${env.opensearchPassword}@${env.opensearchHostname}:${env.opensearchPort}`;
  const client = new OpenSearchClient(node, { ssl: { rejectUnauthorized: env.opensearchRejectAuthorized } });
  const health = await client.health();
  await client.bulkInsert('articles', documents);
};

void main();
