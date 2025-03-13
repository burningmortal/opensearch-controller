const getMaster = (origin: string, length: number): string[] => {
  return [...new Array(length)].map((_, i) => {
    const originCode = origin.charCodeAt(0);
    const c = String.fromCharCode(originCode + i);
    return c;
  });
};

export const generateRandomString = (length: number): string => {
  const master = {
    lowerAlphabet: getMaster('a', 26),
    upperAlphabet: getMaster('A', 26),
    numbers: getMaster('0', 10),
  };
  const chars: string[] = [];
  while (chars.length < length) {
    const source = Math.floor(Math.random() * Object.keys(master).length);
    const target = Object.values(master)[source];
    const index = Math.floor(Math.random() * (target.length - 1));
    chars.push(target[index]);
  }
  return chars.join('');
};
