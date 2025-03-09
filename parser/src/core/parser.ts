import Parser from 'rss-parser';
import { AtomItem } from '../model/atom-item';
import { validate } from 'class-validator';

export class AtomParser {
  private parser: Parser;

  private xml: string;

  constructor(xml: string) {
    this.parser = new Parser();
    this.xml = xml;
  }

  async parse(): Promise<AtomItem[] | false> {
    const res = await this.parser.parseString(this.xml);
    const items = res.items as unknown as AtomItem[];
    const instances = items.map((item) => new AtomItem(item));
    instances.forEach(async (instance) => {
      const validateResult = await validate(instance);
      if (validateResult.length !== 0) {
        return false;
      }
    });
    return instances;
  }
}
