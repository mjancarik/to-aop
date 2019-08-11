'use strict';

import { createProxy, createCallTrap, getTrap, setTrap } from './trap';
import { AOP_PATTERN, AOP_HOOKS, AOP_STATIC_ALLOW } from './symbol';

export function createAspect(pattern) {
  return function applyAop(target) {
    return aop(target, pattern);
  };
}

export function aop(target, pattern) {
  if (target[AOP_PATTERN]) {
    mergePattern(target, pattern);

    return;
  }

  Reflect.defineProperty(target, AOP_PATTERN, {
    value: Object.assign({}, pattern),
    enumerable: false,
    writable: true
  });

  if (typeof target === 'function') {
    return applyAopToClass(target);
  }

  if (typeof target === 'object') {
    return applyAopToInstance(target);
  }

  throw new TypeError(
    `aop accept only object and class. You gave type of ${typeof target}.`
  );
}

function applyAopToInstance(instance) {
  return createProxy(instance);
}

function applyAopToClass(target) {
  let pattern = target[AOP_PATTERN];

  applyAopToStatic(target, pattern);
  applyAopToMethods(target, pattern);
}

function applyAopToStatic(target, pattern) {
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
              get: () => {
                if (originalTarget[AOP_STATIC_ALLOW]) {
                  return getTrap({
                    target,
                    object: original,
                    property,
                    pattern
                  });
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
          !isConstructable(target[property])
        ) {
          original[property] = target[property];

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

function applyAopToMethods(target, pattern) {
  let original = {};
  let prototype = target.prototype;
  while (prototype) {
    Object.entries(Object.getOwnPropertyDescriptors(prototype)).forEach(
      function([property]) {
        try {
          if (property in original) {
            return;
          }
          original[property] = prototype[property];
          let aopHooks = original[property][AOP_HOOKS];
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

          if (typeof original[property] === 'function') {
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

function mergePattern(target, pattern) {
  let currentTargetPattern = target[AOP_PATTERN];

  target[AOP_PATTERN] = Object.entries(pattern).reduce(
    (resultPattern, [hookName, hookValue]) => {
      if (!resultPattern[hookName]) {
        resultPattern = hookName;
      }

      if (resultPattern[hookName]) {
        if (!Array.isArray(resultPattern[hookName])) {
          resultPattern[hookName] = [resultPattern[hookName]];
        }
        if (!Array.isArray(hookValue)) {
          hookValue = [hookValue];
        }

        resultPattern[hookName] = resultPattern[hookName].concat(hookValue);
      }

      return resultPattern;
    },
    currentTargetPattern
  );
}

function isConstructable(func) {
  return !!(func && func.prototype && func.prototype.constructor);
}
