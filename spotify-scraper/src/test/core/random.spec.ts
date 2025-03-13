import { generateRandomString } from './random';

describe('generateRandomString', () => {
  it('指定した文字数の文字列が返されること', () => {
    // Arrange
    const array = [...new Array(1000)].map((_, i) => i);
    // Act
    for (const num of array) {
      const str = generateRandomString(num);
      // Assert
      expect(str.length).toBe(num);
    }
  });
});
