import createCallTrap from './trap/createCallTrap';
import { AOP_HOOKS, AOP_FILTER_FUNCTION } from './symbol';
import { hookName } from './hook';

function hasToRegisterHook(pattern, props) {
  return [
    hookName.beforeMethod,
    hookName.afterMethod,
    hookName.aroundMethod
  ].reduce((result, hook) => {
    return (
      result ||
      (pattern[hook] &&
        typeof pattern[hook][AOP_FILTER_FUNCTION] === 'function' &&
        pattern[hook][AOP_FILTER_FUNCTION](props))
    );
  }, false);
}

function isConstructable(func) {
  return !!(func && func.prototype && func.prototype.constructor);
}

export default function overOwnProperty({ target, pattern, original, object }) {
  Object.entries(Object.getOwnPropertyDescriptors(object)).forEach(function([
    property
  ]) {
    try {
      if (!hasToRegisterHook(pattern, { property, target, object })) {
        original[property] = object[property];
        return;
      }

      if (property in original) {
        return;
      }

      if (!object[property]) {
        return;
      }

      let aopHooks = object[property][AOP_HOOKS];
      if (aopHooks) {
        const { object: lastObject } = aopHooks[aopHooks.length - 1];
        aopHooks.push({
          target,
          object: lastObject,
          property,
          pattern
        });

        if (!(property in original)) {
          original[property] = () => {};
        }

        return;
      }

      if (
        typeof object[property] === 'function' &&
        !isConstructable(object[property])
      ) {
        original[property] = object[property];
        object[property] = createCallTrap({
          target,
          object: original,
          property,
          pattern
        });
      }
    } catch (_) {
      console.error(_);
    } // eslint-disable-line no-empty
  });
}
