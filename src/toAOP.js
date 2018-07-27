'use strict';

import { createProxy, getAspect, setAspect } from './aspects';

const WOVE_ORIGINAL_TARGET = Symbol('WoveOriginalTarget');

export function createPattern(pattern) {
  return function applyAOP(target) {
    return aop(pattern, target);
  };
}

export function aop(pattern, target) {
  if (target[WOVE_ORIGINAL_TARGET]) {
    return;
  }

  Reflect.defineProperty(target, WOVE_ORIGINAL_TARGET, {
    value: true,
    enumerable: false
  });

  if (typeof target === 'function') {
    return applyPatternToClass(pattern, target);
  }

  if (typeof target === 'object') {
    return applyPatternToInstance(pattern, target);
  }

  throw new TypeError(
    `aop factoru accept only object and function. You gave type of ${typeof target}.`
  );
}

function applyPatternToInstance(pattern, instance) {
  return createProxy(instance, instance, pattern);
}

function applyPatternToClass(pattern, target) {
  const self = Reflect.getPrototypeOf(target.prototype || target);
  const proxy = createProxy(self, target, pattern);

  let original = {};
  Object.entries(Object.getOwnPropertyDescriptors(target.prototype)).forEach(
    ([property]) => {
      try {
        original[property] = target.prototype[property];

        Reflect.defineProperty(
          target.prototype,
          property,
          Object.assign(
            {},
            {
              get: () => {
                return getAspect(target, original, property, pattern);
              },
              set: payload => {
                return setAspect(target, original, property, payload, pattern);
              }
            }
          )
        );
      } catch (_) {
        console.error(_);
      } // eslint-disable-line no-empty
    }
  );

  Reflect.setPrototypeOf(target.prototype || target, proxy);
}
