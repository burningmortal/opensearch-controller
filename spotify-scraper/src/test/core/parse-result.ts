export const ParseBoolResult = {
  成功: true,
  失敗: false,
} as const;

export const searchKeyByValue = <T, U extends object>(value: T, def: U) => {
  const target = Object.entries(def).find(([k, v]) => v === value);
  if (!target) {
    return undefined;
  }
  return target[0];
};
