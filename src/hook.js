import { AOP_FILTER_FUNCTION } from './symbol';

export function createHook(name, regular, callback) {
  function hook(meta) {
    return hookFor(meta, regular, callback);
  }

  hook[AOP_FILTER_FUNCTION] = function({ property, target, prototype }) {
    return (
      (typeof regular === 'string' && property.includes(regular)) ||
      (regular instanceof RegExp && regular.test(property)) ||
      (typeof regular === 'function' &&
        regular({ property, target, name, prototype }))
    );
  };

  return {
    [name]: hook
  };
}

export function hookFor(meta, regular, callback) {
  if (typeof regular === 'string') {
    if (meta.property.includes(regular)) {
      return callback(meta);
    }

    return null;
  }
  if (regular instanceof RegExp) {
    if (regular.test(meta.property)) {
      return callback(meta);
    }

    return null;
  }

  if (typeof regular === 'function') {
    if (regular(meta)) {
      return callback(meta);
    }

    return null;
  }

  if (Array.isArray(regular)) {
    return regular.map(({ rule, action }) => {
      return hookFor(meta, rule, action || callback);
    });
  }

  throw new TypeError(
    `Invalid rule type ${typeof regular}. Method accept string, regexp, function and array.`
  );
}

export const hookName = Object.freeze({
  beforeMethod: 'beforeMethod',
  afterMethod: 'afterMethod',
  aroundMethod: 'aroundMethod',
  beforeGetter: 'beforeGetter',
  afterGetter: 'afterGetter',
  aroundGetter: 'aroundGetter',
  beforeSetter: 'beforeSetter',
  afterSetter: 'afterSetter',
  aroundSetter: 'aroundSetter'
});
