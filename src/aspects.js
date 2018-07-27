export function createProxy(instance, target, pattern = {}) {
  const proxy = new Proxy(instance, {
    get(object, property) {
      return getAspect(target, object, property, pattern);
    },
    set(object, property, payload) {
      return setAspect(target, object, property, payload, pattern);
    }
  });

  return proxy;
}

export function setAspect(target, object, property, payload, pattern) {
  invokePattern(pattern.beforSetter, {
    target,
    object,
    property,
    payload
  });

  let result = pattern.aroundSetter
    ? invokePattern(pattern.aroundSetter, {
        target,
        object,
        property,
        payload
      })
    : Reflect.set(object, property, payload);

  invokePattern(pattern.afterSetter, {
    target,
    object,
    property,
    payload
  });

  return result;
}

export function getAspect(target, object, property, pattern) {
  if (!Reflect.has(object, property)) {
    return;
  }

  invokePattern(pattern.beforGetter, {
    target,
    object,
    property
  });

  let value = pattern.aroundGetter
    ? invokePattern(pattern.aroundGetter, {
        target,
        object,
        property
      })
    : Reflect.get(object, property);

  invokePattern(pattern.afterGetter, {
    target,
    object,
    property,
    payload: value
  });

  if (typeof value === 'function') {
    value = function(...rest) {
      invokePattern(pattern.beforeMethod, {
        target,
        object,
        property,
        args: rest
      });

      const payload = pattern.aroundMethod
        ? invokePattern(pattern.aroundMethod, {
            target,
            object,
            property,
            args: rest
          })
        : Reflect.apply(object[property], object, rest);

      invokePattern(pattern.afterMethod, {
        target,
        object,
        property,
        args: rest,
        payload
      });

      return payload;
    }.bind(object);
  }

  return value;
}

function invokePattern(pattern, meta) {
  if (!pattern) {
    return;
  }

  if (Array.isArray(pattern)) {
    return pattern.map(rule => {
      const method = typeof pattern === 'function' ? pattern : pattern.method;
      Reflect.apply(method, rule.context, [meta]);
    });
  } else {
    const method = typeof pattern === 'function' ? pattern : pattern.method;
    return Reflect.apply(method, pattern.context, [meta]);
  }
}
