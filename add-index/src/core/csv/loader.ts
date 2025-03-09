import * as fs from 'fs';
import * as csv from 'csv/sync';
import { SearchDocument, validateDocument } from '../../model/document';

export const load = (filePath: string): SearchDocument[] | false => {
  const file = fs.readFileSync(filePath, 'utf8');
  const records = csv.parse(file, { escape: '\\' });
  const COLUMNS = { ID: 0, TITLE: 1, SUMMARY: 2, LINK: 3, AUTHOR: 4 } as const;
  if (!Array.isArray(records)) {
    return false;
  }
  if (!Array.isArray(records)) {
    return false;
  }
  const isRecordLengthValid = records.every((record) => {
    if (!Array.isArray(record)) {
      return false;
    }
    if (record.length !== Object.entries(COLUMNS).length) {
      return false;
    }
    return true;
  });
  if (!isRecordLengthValid) {
    return false;
  }
  const rows = records.map((record) => {
    const value = {
      id: record[COLUMNS.ID],
      title: record[COLUMNS.TITLE],
      summary: record[COLUMNS.SUMMARY],
      link: record[COLUMNS.LINK],
      author: record[COLUMNS.AUTHOR],
    };
    return value;
  });
  const validateResults = rows.map((row) => validateDocument(row));
  const isValid = validateResults.every((result) => result.isOk);
  if (!isValid) {
    return false;
  }
  const bookmarks = validateResults.map((result) => result.value);
  return bookmarks;
};
