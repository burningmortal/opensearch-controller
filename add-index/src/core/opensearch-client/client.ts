import { Client, errors } from '@opensearch-project/opensearch';
import { Cluster_Health_Response } from '@opensearch-project/opensearch/api';

export type Options = { ssl: { rejectUnauthorized: boolean } };

export type RequestResult<T> =
  | { isOk: true; value: T }
  | {
      isOk: false;
      error: { type: 'ConnectionError'; name: string; message: string } | { type: 'Unknown' };
    };

export class OpenSearchClient {
  private client: Client;

  constructor(node: string, options: Options) {
    this.client = new Client({ node, ...options });
  }

  async health(): Promise<RequestResult<Cluster_Health_Response>> {
    try {
      const res = await this.client.cluster.health();
      return { isOk: true, value: res };
    } catch (e) {
      if (e instanceof errors.ConnectionError) {
        return { isOk: false, error: { type: 'ConnectionError', name: e.name, message: e.message } };
      }
      throw { isOk: false, error: { type: 'Unknown' } };
    }
  }
}
