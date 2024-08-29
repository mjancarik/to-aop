import invokePattern from './invokePattern.mjs';
import createCallTrap from './createCallTrap.mjs';
import { AOP_HOOKS } from '../symbol.mjs';

export default function createGetTrap({
  target,
  object,
  property,
  pattern,
  context,
  method,
}) {
  function getTrap() {
    const hasProperty = getTrap[AOP_HOOKS].reduce(
      (result, { object, property }) => {
        return result && Reflect.has(object, property);
      },
      true,
    );

    if (!hasProperty) {
      return;
    }

    let payload = undefined;
    let meta = {};

    getTrap[AOP_HOOKS].forEach(
      ({ target, object, property, pattern, context }) => {
        invokePattern(pattern.beforeGetter, {
          target,
          object,
          property,
          context,
          meta,
        });
      },
    );

    const { target, object, property, pattern, context } =
      getTrap[AOP_HOOKS][getTrap[AOP_HOOKS].length - 1];
    const aroundGetter = Array.isArray(pattern.aroundGetter)
      ? pattern.aroundGetter[pattern.aroundGetter.length - 1]
      : pattern.aroundGetter;

    payload = aroundGetter
      ? invokePattern(aroundGetter, {
          target,
          object,
          property,
          context,
          meta,
        })
      : Reflect.get(object, property);

    getTrap[AOP_HOOKS].forEach(
      ({ target, object, property, pattern, context }) => {
        invokePattern(pattern.afterGetter, {
          target,
          object,
          property,
          context,
          payload,
          meta,
        });
      },
    );

    if (typeof payload === 'function') {
      payload = createCallTrap({
        target,
        object,
        property,
        pattern,
        context,
        method,
      });
    }

    return payload;
  }

  getTrap[AOP_HOOKS] = [{ target, object, property, pattern, context }];

  return getTrap;
}
