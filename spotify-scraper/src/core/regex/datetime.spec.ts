import { ParseBoolResult, searchKeyByValue } from '../../test/core/parse-result';
import { DATETIME_REGEX } from './datetime';

describe('DATETIME_REGEX', () => {
  it.each`
    value                         | result
    ${'2025-01-01T00:00:00.001Z'} | ${searchKeyByValue(ParseBoolResult.成功, ParseBoolResult)}
    ${'2026-01-01T00:00:00.010Z'} | ${searchKeyByValue(ParseBoolResult.成功, ParseBoolResult)}
    ${'2027-01-01T00:00:00.100Z'} | ${searchKeyByValue(ParseBoolResult.成功, ParseBoolResult)}
    ${'2030-01-01T00:00:01.000Z'} | ${searchKeyByValue(ParseBoolResult.成功, ParseBoolResult)}
    ${'2020-01-01T00:00:10.000Z'} | ${searchKeyByValue(ParseBoolResult.成功, ParseBoolResult)}
    ${'2010-01-01T00:01:00.000Z'} | ${searchKeyByValue(ParseBoolResult.成功, ParseBoolResult)}
    ${'2000-01-01T00:10:00.000Z'} | ${searchKeyByValue(ParseBoolResult.成功, ParseBoolResult)}
    ${'1990-01-01T01:00:00.000Z'} | ${searchKeyByValue(ParseBoolResult.成功, ParseBoolResult)}
    ${'1980-01-01T10:00:00.000Z'} | ${searchKeyByValue(ParseBoolResult.成功, ParseBoolResult)}
    ${'2100-01-09T00:00:00.000Z'} | ${searchKeyByValue(ParseBoolResult.成功, ParseBoolResult)}
    ${'2200-01-10T00:00:00.000Z'} | ${searchKeyByValue(ParseBoolResult.成功, ParseBoolResult)}
    ${'0010-09-01T00:00:00.000Z'} | ${searchKeyByValue(ParseBoolResult.成功, ParseBoolResult)}
    ${'1000-10-01T00:00:00.000Z'} | ${searchKeyByValue(ParseBoolResult.成功, ParseBoolResult)}
    ${'2025-01-01T09:00:00.000'}  | ${searchKeyByValue(ParseBoolResult.失敗, ParseBoolResult)}
    ${'2025-01-01T09:00:00.00Z'}  | ${searchKeyByValue(ParseBoolResult.失敗, ParseBoolResult)}
    ${'2025-01-01T09:00:00Z'}     | ${searchKeyByValue(ParseBoolResult.失敗, ParseBoolResult)}
    ${'2025-01-01T09:00:0.000Z'}  | ${searchKeyByValue(ParseBoolResult.失敗, ParseBoolResult)}
    ${'2025-01-01T09:00.000Z'}    | ${searchKeyByValue(ParseBoolResult.失敗, ParseBoolResult)}
    ${'2025-01-01T09:0:00.000Z'}  | ${searchKeyByValue(ParseBoolResult.失敗, ParseBoolResult)}
    ${'2025-01-01T09:00:60.000Z'} | ${searchKeyByValue(ParseBoolResult.失敗, ParseBoolResult)}
    ${'2025-01-01T9:00:00.000Z'}  | ${searchKeyByValue(ParseBoolResult.失敗, ParseBoolResult)}
    ${'2025-01-01T60:00:00.000Z'} | ${searchKeyByValue(ParseBoolResult.失敗, ParseBoolResult)}
    ${'2025-01-01 00:00:00.000Z'} | ${searchKeyByValue(ParseBoolResult.失敗, ParseBoolResult)}
    ${'2025-01-1 00:00:00.000Z'}  | ${searchKeyByValue(ParseBoolResult.失敗, ParseBoolResult)}
    ${'2025-01-13 00:00:00.000Z'} | ${searchKeyByValue(ParseBoolResult.失敗, ParseBoolResult)}
    ${'2025-1-01 00:00:00.000Z'}  | ${searchKeyByValue(ParseBoolResult.失敗, ParseBoolResult)}
    ${'2025-13-01 00:00:00.000Z'} | ${searchKeyByValue(ParseBoolResult.失敗, ParseBoolResult)}
    ${'999-13-01 00:00:00.000Z'}  | ${searchKeyByValue(ParseBoolResult.失敗, ParseBoolResult)}
  `('{$value}が正規表現チェックに{$result}すること', ({ value, result }) => {
    // Arrange
    if (typeof value !== 'string') {
      throw new Error('value type is not string');
    }
    // Actnpm
    const testResult = DATETIME_REGEX.test(value);
    // Asset
    result === searchKeyByValue(ParseBoolResult.成功, ParseBoolResult)
      ? expect(testResult).toBe(true)
      : expect(testResult).toBe(false);
  });
});
