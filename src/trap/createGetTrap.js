import invokePattern from './invokePattern';
import createCallTrap from './createCallTrap';
import { AOP_HOOKS } from '../symbol';

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
      true
    );

    if (!hasProperty) {
      return;
    }

    getTrap[AOP_HOOKS].forEach(
      ({ target, object, property, pattern, context }) => {
        invokePattern(pattern.beforeGetter, {
          target,
          object,
          property,
          context,
        });
      }
    );

    const { target, object, property, pattern, context } = getTrap[AOP_HOOKS][
      getTrap[AOP_HOOKS].length - 1
    ];
    const aroundGetter = Array.isArray(pattern.aroundGetter)
      ? pattern.aroundGetter[pattern.aroundGetter.length - 1]
      : pattern.aroundGetter;

    let value = aroundGetter
      ? invokePattern(aroundGetter, {
          target,
          object,
          property,
          context,
        })
      : Reflect.get(object, property);

    getTrap[AOP_HOOKS].forEach(
      ({ target, object, property, pattern, context }) => {
        invokePattern(pattern.afterGetter, {
          target,
          object,
          property,
          context,
          payload: value,
        });
      }
    );

    if (typeof value === 'function') {
      value = createCallTrap({
        target,
        object,
        property,
        pattern,
        context,
        method,
      });
    }

    return value;
  }

  getTrap[AOP_HOOKS] = [{ target, object, property, pattern, context }];

  return getTrap;
}
