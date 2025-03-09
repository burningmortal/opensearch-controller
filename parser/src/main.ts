import { randomUUID } from 'crypto';
import { AtomParser } from './core/parser';
import * as fs from 'fs';
import * as path from 'path';

const main = async () => {
  const SOURCE_DIR = './source';
  const DEST_DIR = './dest';
  const atomFileNames = fs.readdirSync(path.join('.', SOURCE_DIR)).filter((file) => file.endsWith('.atom'));
  const atomFiles = atomFileNames.map((fileName) => fs.readFileSync(path.join('.', SOURCE_DIR, fileName), 'utf-8'));
  await Promise.all(
    atomFiles.map(async (file) => {
      const atomParser = new AtomParser(file);
      const result = await atomParser.parse();
      if (!result) {
        return;
      }
      const rows = result.map((res) =>
        [
          `"${res.id.replace(/"/, '\\"').replace(/\n/g, ' ')}"`,
          `"${res.title.replace(/"/, '\\"').replace(/\n/g, ' ')}"`,
          `"${res.summary.replace(/"/, '\\"').replace(/\n/g, ' ')}"`,
          `"${res.link.replace(/"/, '\\"').replace(/\n/g, ' ')}"`,
          `"${res.author.replace(/"/, '\\"').replace(/\n/g, ' ')}"`,
        ].join(','),
      );
      const csv = rows.join('\n');

      fs.existsSync(path.join('.', DEST_DIR)) || fs.mkdirSync(path.join('.', DEST_DIR));
      fs.writeFileSync(path.join('.', DEST_DIR, `result_${randomUUID()}.csv`), csv);
    }),
  );
};

void main();
