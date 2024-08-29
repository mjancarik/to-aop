import createGetTrap from './trap/createGetTrap.mjs';
import createSetTrap from './trap/createSetTrap.mjs';
import overOwnProperty from './overOwnProperty.mjs';
import { AOP_STATIC_ALLOW, AOP_HOOKS } from './symbol.mjs';
import { hookName, hasToRegisterHook } from './hook.mjs';

const hasToRegisterGetterSetterHook = hasToRegisterHook([
  hookName.beforeGetter,
  hookName.afterGetter,
  hookName.aroundGetter,
  hookName.beforeSetter,
  hookName.afterSetter,
  hookName.aroundSetter,
]);

export default function aopForStatic(target, pattern) {
  let original = {};
  let originalTarget = target;

  if (!Object.prototype.hasOwnProperty.call(originalTarget, AOP_STATIC_ALLOW)) {
    Reflect.defineProperty(originalTarget, AOP_STATIC_ALLOW, {
      value: false,
      enumerable: false,
      writable: true,
    });
  } else {
    originalTarget[AOP_STATIC_ALLOW] = false;
  }

  while (target && target !== Function.prototype) {
    // TODO improve
    Object.entries(Object.getOwnPropertyDescriptors(target)).forEach(
      ([property, descriptor]) => {
        if (
          typeof descriptor.get === 'function' ||
          typeof descriptor.set === 'function'
        ) {
          if (Object.prototype.hasOwnProperty.call(original, property)) {
            return;
          }

          Reflect.defineProperty(original, property, descriptor);
          if (
            !hasToRegisterGetterSetterHook(pattern, {
              target,
              property,
              object: original,
            })
          ) {
            return;
          }

          Reflect.defineProperty(
            target,
            property,
            Object.assign({}, descriptor, {
              get: (...rest) => {
                if (originalTarget[AOP_STATIC_ALLOW] === true) {
                  let aopHooks = descriptor.get[AOP_HOOKS];
                  if (aopHooks) {
                    const { object } = aopHooks[aopHooks.length - 1];

                    aopHooks.push({
                      target,
                      object,
                      property,
                      pattern,
                    });

                    return typeof descriptor.get === 'function'
                      ? descriptor.get(...rest)
                      : undefined;
                  }

                  return createGetTrap({
                    target,
                    object: original,
                    property,
                    pattern,
                  })(...rest);
                } else {
                  return typeof descriptor.get === 'function'
                    ? descriptor.get(...rest)
                    : undefined;
                }
              },
              set: (payload) => {
                if (originalTarget[AOP_STATIC_ALLOW] === true) {
                  return createSetTrap({
                    target,
                    object: original,
                    property,
                    pattern,
                  })(payload);
                }
              },
            }),
          );
        }
      },
    );

    overOwnProperty({ target, pattern, original, object: target });
    target = Reflect.getPrototypeOf(target);
  }

  originalTarget[AOP_STATIC_ALLOW] = true;
}
