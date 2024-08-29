import createCallTrap from './trap/createCallTrap.mjs';
import { AOP_HOOKS } from './symbol.mjs';
import { hookName, hasToRegisterHook } from './hook.mjs';
import { isConstructable } from './util.mjs';

const hasToRegisterMethodHook = hasToRegisterHook([
  hookName.beforeMethod,
  hookName.afterMethod,
  hookName.aroundMethod,
]);

export default function overOwnProperty({ target, pattern, original, object }) {
  Object.entries(Object.getOwnPropertyDescriptors(object)).forEach(function ([
    property,
  ]) {
    try {
      if (!hasToRegisterMethodHook(pattern, { property, target, object })) {
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
          pattern,
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
          pattern,
        });
      }
    } catch (_) {
      //console.warn(`The '${property}' property is not hooked.`, _);
    } // eslint-disable-line no-empty
  });
}
