import { Client, errors } from '@opensearch-project/opensearch';
import {
  Bulk_RequestBody,
  Bulk_Response,
  Cluster_Health_Response,
  Indices_Delete_Response,
} from '@opensearch-project/opensearch/api';
import { Hit } from '@opensearch-project/opensearch/api/_types/_core.search';

export type Options = { ssl: { rejectUnauthorized: boolean } };

type ResultBase<T, U> =
  | { isOk: true; value: T }
  | { isOk: false; error: { type: U; name: string; message: string } | { type: 'Unknown' } };

export type HealthRequestResult = ResultBase<Cluster_Health_Response, 'ConnectionError'>;

export type SearchRequestResult = ResultBase<{ hits: Hit[]; maxScore: number }, 'ConnectionError' | 'IndexNotFound'>;

export type BulkInsertRequestResult = ResultBase<Bulk_Response, 'ConnectionError' | 'IndexNotFound'>;

export type DeleteIndexRequestResult = ResultBase<Indices_Delete_Response, 'ConnectionError' | 'IndexNotFound'>;

export class OpenSearchClient {
  private client: Client;

  constructor(node: string, options: Options) {
    this.client = new Client({ node, ...options });
  }

  async health(): Promise<HealthRequestResult> {
    try {
      const res = await this.client.cluster.health();
      return { isOk: true, value: res };
    } catch (e) {
      if (e instanceof errors.ConnectionError) {
        return { isOk: false, error: { type: 'ConnectionError', name: e.name, message: e.message } };
      }
      return { isOk: false, error: { type: 'Unknown' } };
    }
  }

  async searchAll(index: string): Promise<SearchRequestResult> {
    try {
      const res = await this.client.search({ index, body: { query: { match_all: {} } }, size: 10000 });
      const body = res.body;
      const hitsMeta = body.hits;
      const maxScore = hitsMeta.max_score;
      if (typeof maxScore !== 'number') {
        return { isOk: false, error: { type: 'Unknown' } };
      }
      return { isOk: true, value: { hits: hitsMeta.hits, maxScore } };
    } catch (e) {
      if (e instanceof errors.ResponseError) {
        if (e.message.startsWith('index_not_found_exception')) {
          return { isOk: false, error: { type: 'IndexNotFound', name: e.name, message: e.message } };
        }
        return { isOk: false, error: { type: 'Unknown' } };
      }
      if (e instanceof errors.ConnectionError) {
        return { isOk: false, error: { type: 'ConnectionError', name: e.name, message: e.message } };
      }
      return { isOk: false, error: { type: 'Unknown' } };
    }
  }

  async search(index: string) {
    const res = await this.client.search({
      index,
      body: { query: { match: { summary: 'sample' } } },
      size: 10000,
    });
    return res;
  }

  async bulkInsert<T extends Record<string, any>>(
    index: string,
    documents: { [key: string]: T },
  ): Promise<BulkInsertRequestResult> {
    try {
      const body: Bulk_RequestBody = [];
      Object.entries(documents).forEach(([id, doc]) => {
        body.push({ create: { _id: id } });
        body.push(doc);
      });
      const res = await this.client.bulk({ index, body });
      return { isOk: true, value: res };
    } catch (e) {
      if (e instanceof errors.ResponseError) {
        if (e.message.startsWith('index_not_found_exception')) {
          return { isOk: false, error: { type: 'IndexNotFound', name: e.name, message: e.message } };
        }
        return { isOk: false, error: { type: 'Unknown' } };
      }
      if (e instanceof errors.ConnectionError) {
        return { isOk: false, error: { type: 'ConnectionError', name: e.name, message: e.message } };
      }
      return { isOk: false, error: { type: 'Unknown' } };
    }
  }

  async deleteIndex(index: string): Promise<DeleteIndexRequestResult> {
    try {
      const res = await this.client.indices.delete({ index });
      return { isOk: true, value: res };
    } catch (e) {
      if (e instanceof errors.ResponseError) {
        if (e.message.startsWith('index_not_found_exception')) {
          return { isOk: false, error: { type: 'IndexNotFound', name: e.name, message: e.message } };
        }
        return { isOk: false, error: { type: 'Unknown' } };
      }
      if (e instanceof errors.ConnectionError) {
        return { isOk: false, error: { type: 'ConnectionError', name: e.name, message: e.message } };
      }
      return { isOk: false, error: { type: 'Unknown' } };
    }
  }
}
