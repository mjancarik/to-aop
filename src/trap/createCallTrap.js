import invokePattern from './invokePattern';
import { AOP_HOOKS } from '../symbol';

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
      const aroundPatterns = callTrap[AOP_HOOKS].filter(
        ({ pattern }) => pattern.aroundMethod
      );
      if (aroundPatterns.length > 0) {
        payload = aroundPatterns.reduce(
          (payload, { target, object, property, pattern, context }) => {
            return invokePattern(pattern.aroundMethod, {
              target,
              object,
              property,
              context: context || self,
              args: rest,
              payload,
              original:
                typeof object[property] === 'function'
                  ? object[property]
                  : method,
              meta,
            });
          },
          undefined
        );
      } else {
        const { object, property, context } = callTrap[AOP_HOOKS][
          callTrap[AOP_HOOKS].length - 1
        ];

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
