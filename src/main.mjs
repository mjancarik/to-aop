import { createAspect, aop, unAop } from './toAop.mjs';
import { createHook, hookFor, hookName } from './hook.mjs';
import createCallTrap from './trap/createCallTrap.mjs';
import createSetTrap from './trap/createSetTrap.mjs';
import createGetTrap from './trap/createGetTrap.mjs';
import createProxy from './trap/createProxy.mjs';

export {
  createAspect,
  aop,
  unAop,
  createHook,
  hookFor,
  hookName,
  createCallTrap,
  createSetTrap,
  createGetTrap,
  createProxy,
};
