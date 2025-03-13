import { parseMeta } from './meta';

test('test', () => {
  const c = new Date().toISOString();
  const u = new Date().toString();
  expect(
    parseMeta({
      createdAt: c,
      updatedAt: u,
      owner: '',
    }),
  ).toEqual({
    createdAt: c,
    updatedAt: u,
    owner: '',
  });
});

const ParseBoolResult = {
  成功: true,
  失敗: false,
} as const;

const searchKeyByValue = <T, U extends object>(value: T, def: U) => {
  const target = Object.entries(def).find(([k, v]) => v === value);
  if (!target) {
    return undefined;
  }
  return target[0];
};

describe('parseMeta', () => {
  it.todo('createdAtに`yyyy-MM-ddTHH:mm:ss.SSSZ`の書式を満たす文字列を与えるとバリデーションに成功すること');
  it.each`
    key            | valid                                                      | result
    ${'createdAt'} | ${searchKeyByValue(ParseBoolResult.成功, ParseBoolResult)} | ${searchKeyByValue(ParseBoolResult.成功, ParseBoolResult)}
    ${'createdAt'} | ${searchKeyByValue(ParseBoolResult.失敗, ParseBoolResult)} | ${searchKeyByValue(ParseBoolResult.失敗, ParseBoolResult)}
    ${'updatedAt'} | ${searchKeyByValue(ParseBoolResult.成功, ParseBoolResult)} | ${searchKeyByValue(ParseBoolResult.成功, ParseBoolResult)}
    ${'updatedAt'} | ${searchKeyByValue(ParseBoolResult.失敗, ParseBoolResult)} | ${searchKeyByValue(ParseBoolResult.失敗, ParseBoolResult)}
  `('{$key}に`yyyy-MM-ddTHH:mm:ss.SSSZ`の書式を{$valid}文字列を与えるとバリデーションに{$result}すること', () => {
    return;
  });

  it.todo('ownerに1000文字以内の文字列が入るとバリデーションに成功すること');
  it.todo('ownerに1001文字の文字列が入るとバリデーションに失敗すること');
  it.todo('ownerに空文字が入るとバリデーションに失敗すること');
});
