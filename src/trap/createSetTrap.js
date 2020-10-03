import invokePattern from './invokePattern';
import { AOP_HOOKS } from '../symbol';

export default function createSetTrap({
  target,
  object,
  property,
  pattern,
  context,
}) {
  function setTrap(payload) {
    let meta = {};

    setTrap[AOP_HOOKS].forEach(
      ({ target, object, property, context, pattern }) => {
        invokePattern(pattern.beforeSetter, {
          target,
          object,
          property,
          payload,
          context,
          meta,
        });
      }
    );

    const { target, object, property, pattern, context } = setTrap[AOP_HOOKS][
      setTrap[AOP_HOOKS].length - 1
    ];
    const aroundSetter = Array.isArray(pattern.aroundSetter)
      ? pattern.aroundSetter[pattern.aroundSetter.length - 1]
      : pattern.aroundSetter;

    let result = aroundSetter
      ? invokePattern(aroundSetter, {
          target,
          object,
          property,
          payload,
          context,
          meta,
        })
      : Reflect.set(object, property, payload);

    setTrap[AOP_HOOKS].forEach(
      ({ target, object, property, context, pattern }) => {
        invokePattern(pattern.afterSetter, {
          target,
          object,
          property,
          payload,
          context,
          meta,
        });
      }
    );

    return result;
  }

  setTrap[AOP_HOOKS] = [{ target, object, property, pattern, context }];

  return setTrap;
}
