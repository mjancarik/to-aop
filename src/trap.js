import invokePattern from './trap/invokePattern';

export function setTrap({
  target,
  object,
  property,
  payload,
  pattern,
  context
}) {
  invokePattern(pattern.beforeSetter, {
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
