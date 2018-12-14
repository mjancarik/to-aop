import { createAspect, aop, hookName } from './toAop';
import { createHook, hookFor } from './hook';
import { createCallTrap, getTrap, setTrap, createProxy } from './trap';

export {
  createAspect,
  aop,
  createHook,
  hookFor,
  hookName,
  createCallTrap,
  getTrap,
  setTrap,
  createProxy
};
