import { AtomParser } from './core/parser';
import * as fs from 'fs';
import * as path from 'path';

const main = () => {
  const SOURCE_DIR = './source';
  const atomFileNames = fs.readdirSync(path.join('.', SOURCE_DIR)).filter((file) => file.endsWith('.atom'));
  const atomFiles = atomFileNames.map((fileName) => fs.readFileSync(path.join('.', SOURCE_DIR, fileName), 'utf-8'));
  const atomParser = new AtomParser('');
};

main();
