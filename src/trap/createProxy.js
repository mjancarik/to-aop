import createCallTrap from './createCallTrap';
import createGetTrap from './createGetTrap';
import createSetTrap from './createSetTrap';
import { AOP_PATTERN } from '../symbol';

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
