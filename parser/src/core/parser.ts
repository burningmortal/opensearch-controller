import Parser from 'rss-parser';

export class AtomParser {
  private parser: Parser;

  private xml: string;

  constructor(xml: string) {
    this.parser = new Parser();
    this.xml = xml;
  }

  async parse() {
    const res = await this.parser.parseString(this.xml);
    console.log(15, res);
  }
}
