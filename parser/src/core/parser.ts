import Parser from 'rss-parser';

export type AtomItem = {
  author: string;
  id: string;
  link: string;
  summary: string;
  title: string;
};

export class AtomParser {
  private parser: Parser;

  private xml: string;

  constructor(xml: string) {
    this.parser = new Parser();
    this.xml = xml;
  }

  async parse(): Promise<AtomItem[]> {
    const res = await this.parser.parseString(this.xml);
    return res.items as unknown as AtomItem[];
  }
}
