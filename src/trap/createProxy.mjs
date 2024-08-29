import createCallTrap from './createCallTrap.mjs';
import createGetTrap from './createGetTrap.mjs';
import createSetTrap from './createSetTrap.mjs';
import { AOP_PATTERN } from '../symbol.mjs';

export default function createProxy(target, pattern, context) {
  pattern = pattern || target[AOP_PATTERN] || {};

  const proxy = new Proxy(target, {
    get(object, property) {
      let original = object[property];
      let value = createGetTrap({ target, object, property, pattern })();

      if (value === undefined || original === undefined) {
        return;
      }

      if (typeof original !== 'object' && typeof original !== 'function') {
        return value;
      }

      return createProxy(original, pattern, object);
    },
    set(object, property, payload) {
      return createSetTrap({ target, object, property, pattern })(payload);
    },
    apply(method, object, args) {
      return createCallTrap({
        target,
        object: context || object,
        property: method.name,
        pattern,
        context: context || object,
        method,
      })(...args);
    },
  });

  return proxy;
}
