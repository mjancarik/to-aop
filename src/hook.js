export function createHook(name, regular, callback) {
  return {
    [name]: function hook(meta) {
      return hookFor(meta, regular, callback);
    }
  };
}

export function hookFor(meta, filterRule, callback) {
  if (typeof filterRule === 'string') {
    if (meta.property.includes(filterRule)) {
      return callback(meta);
    }

    return null;
  }
  if (filterRule instanceof RegExp) {
    if (filterRule.test(meta.property)) {
      return callback(meta);
    }

    return null;
  }

  if (typeof filterRule === 'function') {
    if (filterRule(meta)) {
      return callback(meta);
    }

    return null;
  }

  if (Array.isArray(filterRule)) {
    return filterRule.map(({ rule, action }) => {
      return hookFor(meta, rule, action || callback);
    });
  }

  throw new TypeError(
    `Invalid rule type ${typeof filterRule}. Method accept string, regexp, function and array.`
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
