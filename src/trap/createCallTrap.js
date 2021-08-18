import invokePattern from './invokePattern';
import { AOP_HOOKS } from '../symbol';
import { isConstructable } from '../util';

export default function createCallTrap({
  target,
  object,
  property,
  pattern,
  context,
  method,
}) {
  function callTrap(...rest) {
    const self = this;
    let payload = undefined;
    let meta = {};

    callTrap[AOP_HOOKS].forEach(
      ({ target, object, property, pattern, context }) => {
        invokePattern(pattern.beforeMethod, {
          target,
          object,
          property,
          context: context || self,
          args: rest,
          meta,
        });
      }
    );

    {
      const { target, object, property, pattern, context } =
        callTrap[AOP_HOOKS][callTrap[AOP_HOOKS].length - 1];
      const aroundPattern = Array.isArray(pattern.aroundMethod)
        ? pattern.aroundMethod[pattern.aroundMethod.length - 1]
        : pattern.aroundMethod;

      if (aroundPattern) {
        payload = invokePattern(aroundPattern, {
          target,
          object,
          property,
          context: context || self,
          args: rest,
          original:
            typeof object[property] === 'function' ? object[property] : method,
          meta,
        });
      } else {
        const { object, property, context } =
          callTrap[AOP_HOOKS][callTrap[AOP_HOOKS].length - 1];

        if (typeof object[property] === 'function') {
          if (property === 'constructor' && isConstructable(object)) {
            payload = Reflect.construct(object, rest);
          } else {
            payload = Reflect.apply(object[property], context || self, rest);
          }
        } else {
          payload = Reflect.apply(method, context || self, rest);
        }
      }
    }

    callTrap[AOP_HOOKS].forEach(
      ({ target, object, property, pattern, context }) => {
        invokePattern(pattern.afterMethod, {
          target,
          object,
          property,
          context: context || self,
          args: rest,
          payload,
          meta,
        });
      }
    );

    return payload;
  }

  callTrap[AOP_HOOKS] = [{ target, object, property, pattern, context }];

  return callTrap;
}
