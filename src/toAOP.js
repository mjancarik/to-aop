'use strict';

import { createProxy, getTrap, setTrap } from './trap';

const AOP_ORIGINAL_TARGET = Symbol('AopOriginalTarget');

export function createAspect(pattern) {
  return function applyAOP(target) {
    return aop(target, pattern);
  };
}

export function aop(target, pattern) {
  if (target[AOP_ORIGINAL_TARGET]) {
    return;
  }

  Reflect.defineProperty(target, AOP_ORIGINAL_TARGET, {
    value: true,
    enumerable: false
  });

  if (typeof target === 'function') {
    return applyAopToClass(target, pattern);
  }

  if (typeof target === 'object') {
    return applyAopToInstance(target, pattern);
  }

  throw new TypeError(
    `aop accept only object and class. You gave type of ${typeof target}.`
  );
}

function applyAopToInstance(instance, pattern) {
  return createProxy(instance, instance, pattern);
}

function applyAopToClass(target, pattern) {
  const self = Reflect.getPrototypeOf(target.prototype || target);
  const proxy = createProxy(self, target, pattern);

  let original = {};
  Object.entries(Object.getOwnPropertyDescriptors(target.prototype)).forEach(
    function([property]) {
      try {
        original[property] = target.prototype[property];

        Reflect.defineProperty(
          target.prototype,
          property,
          Object.assign(
            {},
            {
              get: function() {
                return getTrap(target, original, property, pattern, this);
              },
              set: function(payload) {
                return setTrap(
                  target,
                  original,
                  property,
                  payload,
                  pattern,
                  this
                );
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
