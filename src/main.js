import { createAspect, aop, unAop } from './toAop';
import { createHook, hookFor, hookName } from './hook';
import createCallTrap from './trap/createCallTrap';
import createSetTrap from './trap/createSetTrap';
import createGetTrap from './trap/createGetTrap';
import createProxy from './trap/createProxy';

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
