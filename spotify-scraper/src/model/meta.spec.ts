import { ParseBoolResult, ParseSatisfy, searchKeyByValue } from '../test/core/parse-result';
import { Meta, parseMeta } from './meta';

describe('parseMeta', () => {
  const base = {
    createdAt: '2025-01-01T09:00:00Z',
    updatedAt: '2025-01-01T09:00:00Z',
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
      const value: Meta = { createdAt: base.createdAt, updatedAt: base.updatedAt, owner: base.owner };
      if (valid === searchKeyByValue(ParseSatisfy.満たさない, ParseBoolResult)) {
        switch (key) {
          case 'createdAt':
            value.createdAt = '';
            break;
          case 'updatedAt':
            value.updatedAt = '';
            break;
          default:
            throw new Error(`unknown key (key)=${key}`);
        }
      }
      // Act
      const parseResult = parseMeta(value);
      // Assert
      result === searchKeyByValue(ParseBoolResult.成功, ParseBoolResult)
        ? expect(parseResult).toEqual(base)
        : expect(parseResult).toBeUndefined();
    },
  );

  it.todo('ownerに1000文字以内の文字列が入るとバリデーションに成功すること');
  it.todo('ownerに1001文字の文字列が入るとバリデーションに失敗すること');
  it.todo('ownerに空文字が入るとバリデーションに失敗すること');
});
