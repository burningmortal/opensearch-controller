import { Client, errors } from '@opensearch-project/opensearch';

export type Options = { ssl: { rejectUnauthorized: boolean } };

export class OpenSearchClient {
  private client: Client;

  constructor(node: string, options: Options) {
    this.client = new Client({ node, ...options });
  }

  health() {
    try {
      return this.client.cluster.health();
    } catch (e) {
      if (e instanceof errors.ConnectionError) {
        return false;
      }
    }
  }
}
