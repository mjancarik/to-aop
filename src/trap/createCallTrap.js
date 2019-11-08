import invokePattern from './invokePattern';
import { AOP_HOOKS } from '../symbol';

export default function createCallTrap({
  target,
  object,
  property,
  pattern,
  context,
  method
}) {
  function callTrap(...rest) {
    const self = this;
    let payload = undefined;

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

      if (arrondPattern) {
        payload = invokePattern(arrondPattern, {
          target,
          object,
          property,
          context: context || self,
          args: rest
        });
      } else {
        if (typeof object[property] === 'function') {
          payload = Reflect.apply(object[property], context || self, rest);
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
          payload
        });
      }
    );

    return payload;
  }

  callTrap[AOP_HOOKS] = [{ target, object, property, pattern, context }];

  return callTrap;
}
