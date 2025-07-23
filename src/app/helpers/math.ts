export const Clamp = (value: number, min = -Infinity, max = Infinity): number => Math.max(min, Math.min(max, value));
