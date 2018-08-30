import { AOP_PATTERN, AOP_HOOKS } from './symbol';

export function createProxy(instance, target) {
  const pattern = target[AOP_PATTERN];
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

export function createCallTrap(target, object, property, pattern, context) {
  function callTrap(...rest) {
    const self = this;
    let payload = undefined;

    //console.log(callTrap[AOP_HOOKS]);

    callTrap[AOP_HOOKS].forEach(
      ({ target, object, property, pattern, context }) => {
        invokePattern(pattern.beforeMethod, {
          target,
          object,
          property,
          context: context || self,
          args: rest
        });
      }
    );

    {
      const { target, object, property, pattern, context } = callTrap[
        AOP_HOOKS
      ][callTrap[AOP_HOOKS].length - 1];
      const arrondPattern = Array.isArray(pattern.aroundMethod)
        ? pattern.aroundMethod[pattern.aroundMethod.length - 1]
        : pattern.aroundMethod;

      payload = arrondPattern
        ? invokePattern(arrondPattern, {
            target,
            object,
            property,
            context: context || self,
            args: rest
          })
        : Reflect.apply(object[property], context || self, rest);
    }

    callTrap[AOP_HOOKS].forEach(
      ({ target, object, property, pattern, context }) => {
        invokePattern(pattern.afterMethod, {
          target,
          object,
          property,
          context: context || self,
          args: rest,
          payload
        });
      }
    );

    return payload;
  }

  //todo merge and use static property like AOP_PATTERN
  if (callTrap[AOP_HOOKS]) {
    callTrap[AOP_HOOKS].push({ target, object, property, pattern, context });
  } else {
    callTrap[AOP_HOOKS] = [{ target, object, property, pattern, context }];
  }

  return callTrap;
}

export function getTrap(target, object, property, pattern, context) {
  if (!Reflect.has(object, property)) {
    return;
  }

  invokePattern(pattern.beforeGetter, {
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
    value = createCallTrap(target, object, property, pattern, context);
  }

  return value;
}

export function invokePattern(pattern, meta) {
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
