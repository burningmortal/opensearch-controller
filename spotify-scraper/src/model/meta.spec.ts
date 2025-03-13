import { ParseBoolResult, ParseSatisfy, searchKeyByValue } from '../test/core/parse-result';
import { generateRandomString } from '../test/core/random';
import { Meta, parseMeta } from './meta';

describe('parseMeta', () => {
  const base = {
    createdAt: '2025-01-01T09:00:00.000Z',
    updatedAt: '2025-01-01T09:00:00.000Z',
    owner: 'magicalecriture@ututu.me',
  } as const;

  it.each`
    key            | valid                                                      | result
    ${'createdAt'} | ${searchKeyByValue(ParseSatisfy.満たす, ParseSatisfy)}     | ${searchKeyByValue(ParseBoolResult.成功, ParseBoolResult)}
    ${'createdAt'} | ${searchKeyByValue(ParseSatisfy.満たさない, ParseSatisfy)} | ${searchKeyByValue(ParseBoolResult.失敗, ParseBoolResult)}
    ${'updatedAt'} | ${searchKeyByValue(ParseSatisfy.満たす, ParseSatisfy)}     | ${searchKeyByValue(ParseBoolResult.成功, ParseBoolResult)}
    ${'updatedAt'} | ${searchKeyByValue(ParseSatisfy.満たさない, ParseSatisfy)} | ${searchKeyByValue(ParseBoolResult.失敗, ParseBoolResult)}
  `(
    '{$key}に`yyyy-MM-ddTHH:mm:ss.SSSZ`の書式を{$valid}文字列を与えるとバリデーションに{$result}すること',
    ({ key, valid, result }) => {
      // Arrange
      const original: Meta = { createdAt: base.createdAt, updatedAt: base.updatedAt, owner: base.owner };
      if (valid === searchKeyByValue(ParseSatisfy.満たさない, ParseSatisfy)) {
        switch (key) {
          case 'createdAt':
            original.createdAt = '';
            break;
          case 'updatedAt':
            original.updatedAt = '';
            break;
          default:
            throw new Error(`unknown key (key)=${key}`);
        }
      }
      // Act
      const parseResult = parseMeta(original);
      // Assert
      result === searchKeyByValue(ParseBoolResult.成功, ParseBoolResult)
        ? expect(parseResult).toEqual(base)
        : expect(parseResult).toBeUndefined();
    },
  );

  it.each`
    value             | result
    ${'1000文字以内'} | ${searchKeyByValue(ParseBoolResult.成功, ParseBoolResult)}
    ${'1001文字'}     | ${searchKeyByValue(ParseBoolResult.失敗, ParseBoolResult)}
    ${'空文字'}       | ${searchKeyByValue(ParseBoolResult.失敗, ParseBoolResult)}
  `('ownerに{$value}の文字列が入るとバリデーションに{$result}すること', ({ value, result }) => {
    // Arrange
    const original: Meta = { createdAt: base.createdAt, updatedAt: base.updatedAt, owner: base.owner };

    switch (value) {
      case '1000文字以内':
        break;
      case '1001文字':
        original.owner = generateRandomString(1001);
        break;
      case '空文字':
        original.owner = '';
        break;
      default:
        throw new Error(`unknown value (value)=${value}`);
    }
    // Act
    const parseResult = parseMeta(original);
    // Assert
    result === searchKeyByValue(ParseBoolResult.成功, ParseBoolResult)
      ? expect(parseResult).toEqual(base)
      : expect(parseResult).toBeUndefined();
  });
});
