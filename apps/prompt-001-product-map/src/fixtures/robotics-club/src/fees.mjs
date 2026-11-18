export function membershipFee({ siblings = 0 } = {}) {
  if (!Number.isInteger(siblings) || siblings < 0) {
    throw new Error("siblings must be a nonnegative integer.");
  }
  return Math.max(20, 40 - siblings * 5);
}
