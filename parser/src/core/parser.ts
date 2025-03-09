import Parser from 'rss-parser';

export class AtomParser {
  private parser: Parser;

  private xml: string;

  constructor(xml: string) {
    this.parser = new Parser();
    this.xml = xml;
  }

  parse() {
    this.parser.parseString(this.xml);
  }
}
