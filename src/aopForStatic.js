import createGetTrap from './trap/createGetTrap';
import createSetTrap from './trap/createSetTrap';
import overOwnProperty from './overOwnProperty';
import { AOP_STATIC_ALLOW, AOP_HOOKS } from './symbol';

export default function aopForStatic(target, pattern) {
  let original = {};
  if (!Object.prototype.hasOwnProperty.call(target, AOP_STATIC_ALLOW)) {
    Reflect.defineProperty(target, AOP_STATIC_ALLOW, {
      value: false,
      enumerable: false,
      writable: true
    });
  } else {
    target[AOP_STATIC_ALLOW] = false;
  }
  let originalTarget = target;

  while (target && target !== Function.prototype) {
    // TODO improve
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
                  return createSetTrap({
                    target,
                    object: original,
                    property,
                    pattern
                  })(payload);
                }
              }
            })
          );
        }

        // if (
        //   typeof target[property] === 'function' &&
        //   (!isConstructable(target[property]) || target[property][AOP_HOOKS])
        // ) {
        //   original[property] = target[property];
        //
        //   let aopHooks = original[property][AOP_HOOKS];
        //   if (aopHooks) {
        //     const { object } = aopHooks[aopHooks.length - 1];
        //     aopHooks.push({
        //       target,
        //       object,
        //       property,
        //       pattern
        //     });
        //     return;
        //   }
        //
        //   target[property] = createCallTrap({
        //     target,
        //     object: original,
        //     property,
        //     pattern
        //   });
        // }
      }
    );

    overOwnProperty({ target, pattern, original, object: target });
    target = Reflect.getPrototypeOf(target);
  }
  originalTarget[AOP_STATIC_ALLOW] = true;
}
