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
