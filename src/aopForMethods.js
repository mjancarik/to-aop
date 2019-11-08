import createCallTrap from './trap/createCallTrap';
import { AOP_HOOKS } from './symbol';

export default function aopForMethods(target, pattern) {
  let original = {};
  let prototype = target.prototype;
  while (prototype) {
    Object.entries(Object.getOwnPropertyDescriptors(prototype)).forEach(
      function([property]) {
        try {
          if (property in original) {
            return;
          }

          let aopHooks = prototype[property][AOP_HOOKS];
          if (aopHooks) {
            const { object } = aopHooks[aopHooks.length - 1];
            aopHooks.push({
              target,
              object,
              property,
              pattern
            });
            return;
          }

          if (typeof prototype[property] === 'function') {
            original[property] = prototype[property];
            prototype[property] = createCallTrap({
              target,
              object: original,
              property,
              pattern
            });
          }
        } catch (_) {
          console.error(_);
        } // eslint-disable-line no-empty
      }
    );

    prototype = Reflect.getPrototypeOf(prototype);
  }
}
