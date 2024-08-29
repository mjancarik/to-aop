export function isConstructable(func) {
  return !!(func && func.prototype && func.prototype.constructor);
}
