import { createHook, hookName } from '../hook';

export default function createPattern(pattern = {}, callback = {}) {
  return Object.assign(
    {},
    createHook(
      hookName.beforeMethod,
      pattern[hookName.beforeMethod] || /.*/,
      callback[hookName.beforeMethod] || (() => {}),
    ),
    createHook(
      hookName.afterMethod,
      pattern[hookName.afterMethod] || /.*/,
      callback[hookName.afterMethod] || (() => {}),
    ),
    createHook(
      hookName.beforeGetter,
      pattern[hookName.beforeGetter] || /.*/,
      callback[hookName.beforeGetter] || (() => {}),
    ),
    createHook(
      hookName.afterGetter,
      pattern[hookName.afterGetter] || /.*/,
      callback[hookName.afterGetter] || (() => {}),
    ),
    createHook(
      hookName.beforeSetter,
      pattern[hookName.beforeSetter] || /.*/,
      callback[hookName.beforeSetter] || (() => {}),
    ),
    createHook(
      hookName.afterSetter,
      pattern[hookName.afterSetter] || /.*/,
      callback[hookName.afterSetter] || (() => {}),
    ),
  );
}
