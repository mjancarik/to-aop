'use strict';

import { AOP_PATTERN } from './symbol';
import aopForMethods from './aopForMethods';
import aopForStatic from './aopForStatic';
import createProxy from './trap/createProxy';
import createCallTrap from './trap/createCallTrap';

export function createAspect(pattern) {
  return function applyAop(target) {
    return aop(target, pattern);
  };
}

export function aop(target, pattern, settings = { constructor: false }) {
  if (settings && settings.constructor && typeof target === 'function') {
    return aopWithConstructor(target, pattern);
  }

  return applyAop(target, pattern);
}

function aopWithConstructor(target, pattern) {
  let prototype = target.prototype;

  function AOPConstructor(...rest) {
    return createCallTrap({
      target,
      object: target,
      property: 'constructor',
      pattern,
      context: this,
    })(...rest);
  }

  AOPConstructor.prototype = prototype;

  applyAop(AOPConstructor, pattern);

  return AOPConstructor;
}

export function unAop(target) {
  if (target[AOP_PATTERN]) {
    target[AOP_PATTERN] = Object.keys(target[AOP_PATTERN]).reduce(
      (pattern, hookName) => {
        pattern[hookName] = undefined;

        return pattern;
      },
      target[AOP_PATTERN]
    );
  }
}

function applyAop(target, pattern) {
  if (target[AOP_PATTERN]) {
    if (typeof target === 'function') {
      aopForStatic(target, pattern);
      aopForMethods(target, pattern);

      return;
    }

    mergePattern(target, pattern);

    return;
  }

  Reflect.defineProperty(target, AOP_PATTERN, {
    value: Object.assign({}, pattern),
    enumerable: false,
    writable: true,
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

  aopForStatic(target, pattern);
  aopForMethods(target, pattern);
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
