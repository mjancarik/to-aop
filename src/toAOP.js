'use strict';

import { createProxy, createCallTrap } from './trap';
import { AOP_PATTERN, AOP_HOOKS } from './symbol';

export function createAspect(pattern) {
  return function applyAOP(target) {
    return aop(target, pattern);
  };
}

export function aop(target, pattern) {
  if (target[AOP_PATTERN]) {
    mergePattern(target, pattern);

    return;
  }

  Reflect.defineProperty(target, AOP_PATTERN, {
    value: pattern,
    enumerable: false
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
  return createProxy(instance, instance);
}

function applyAopToClass(target) {
  let original = {};
  let prototype = target.prototype;
  let pattern = target[AOP_PATTERN];

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
            prototype[property] = createCallTrap(
              target,
              original,
              property,
              pattern
            );
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
    },
    Object.assign({}, currentTargetPattern)
  );
}
