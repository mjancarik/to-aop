import createCallTrap from './trap/createCallTrap';
import createGetTrap from './trap/createGetTrap';
import { setTrap } from './trap';
import { AOP_HOOKS, AOP_STATIC_ALLOW } from './symbol';

function isConstructable(func) {
  return !!(func && func.prototype && func.prototype.constructor);
}

export default function aopForStatic(target, pattern) {
  let original = {};
  if (!Object.prototype.hasOwnProperty.call(target, AOP_STATIC_ALLOW)) {
    Reflect.defineProperty(target, AOP_STATIC_ALLOW, {
      value: false,
      enumerable: false,
      writable: true
    });
  }
  let originalTarget = target;

  while (target && target !== Function.prototype) {
    Object.entries(Object.getOwnPropertyDescriptors(target)).forEach(
      ([property, descriptor]) => {
        if (
          typeof descriptor.get === 'function' ||
          typeof descriptor.set === 'function'
        ) {
          if (!Object.prototype.hasOwnProperty.call(original, property)) {
            original[property] = target[property];
          }
          Reflect.defineProperty(
            target,
            property,
            Object.assign({}, descriptor, {
              get: (...rest) => {
                if (originalTarget[AOP_STATIC_ALLOW]) {
                  let aopHooks = descriptor.get[AOP_HOOKS];
                  if (aopHooks) {
                    const { object } = aopHooks[aopHooks.length - 1];

                    aopHooks.push({
                      target,
                      object,
                      property,
                      pattern
                    });

                    return descriptor.get(...rest);
                  }

                  return createGetTrap({
                    target,
                    object: original,
                    property,
                    pattern
                  })(...rest);
                }
              },
              set: payload => {
                if (originalTarget[AOP_STATIC_ALLOW]) {
                  return setTrap({
                    target,
                    object: original,
                    property,
                    payload,
                    pattern
                  });
                }
              }
            })
          );
        }

        if (
          typeof target[property] === 'function' &&
          (!isConstructable(target[property]) || target[property][AOP_HOOKS])
        ) {
          original[property] = target[property];

          let aopHooks = original[property][AOP_HOOKS];
          if (aopHooks) {
            const { object } = aopHooks[aopHooks.length - 1];
            aopHooks.push({
              target,
              object: object,
              property,
              pattern
            });
            return;
          }

          target[property] = createCallTrap({
            target,
            object: original,
            property,
            pattern
          });
        }
      }
    );
    target = Reflect.getPrototypeOf(target);
  }
  originalTarget[AOP_STATIC_ALLOW] = true;
}
