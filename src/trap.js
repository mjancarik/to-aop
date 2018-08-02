export function createProxy(instance, target, pattern = {}) {
  const proxy = new Proxy(instance, {
    get(object, property) {
      return getTrap(target, object, property, pattern);
    },
    set(object, property, payload) {
      return setTrap(target, object, property, payload, pattern);
    }
  });

  return proxy;
}

export function setTrap(target, object, property, payload, pattern, context) {
  invokePattern(pattern.beforSetter, {
    target,
    object,
    property,
    payload,
    context
  });

  let result = pattern.aroundSetter
    ? invokePattern(pattern.aroundSetter, {
        target,
        object,
        property,
        payload,
        context
      })
    : Reflect.set(object, property, payload);

  invokePattern(pattern.afterSetter, {
    target,
    object,
    property,
    payload,
    context
  });

  return result;
}

export function getTrap(target, object, property, pattern, context) {
  if (!Reflect.has(object, property)) {
    return;
  }

  invokePattern(pattern.beforGetter, {
    target,
    object,
    property,
    context
  });

  let value = pattern.aroundGetter
    ? invokePattern(pattern.aroundGetter, {
        target,
        object,
        property,
        context
      })
    : Reflect.get(object, property);

  invokePattern(pattern.afterGetter, {
    target,
    object,
    property,
    context,
    payload: value
  });

  if (typeof value === 'function') {
    value = function(...rest) {
      invokePattern(pattern.beforeMethod, {
        target,
        object,
        property,
        context,
        args: rest
      });

      const payload = pattern.aroundMethod
        ? invokePattern(pattern.aroundMethod, {
            target,
            object,
            property,
            context,
            args: rest
          })
        : Reflect.apply(object[property], context || object, rest);

      invokePattern(pattern.afterMethod, {
        target,
        object,
        property,
        context,
        args: rest,
        payload
      });

      return payload;
    }.bind(context || object);
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
