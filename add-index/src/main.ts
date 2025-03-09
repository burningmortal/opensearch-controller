import { Client } from '@opensearch-project/opensearch';

const main = async () => {
  const client = new Client({
    node: `https://admin:F50UjL0vRYRR8o&*@localhost:9200`,
    ssl: { rejectUnauthorized: false },
  });
  const health = await client.cluster.health();
  console.log(health);
};

void main();
