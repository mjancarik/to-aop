import { createAspect, aop } from './toAop';
import { createHook, hookFor, hookName } from './hook';
//import { createCallTrap, getTrap, setTrap, createProxy } from './trap';
import createCallTrap from './trap/createCallTrap';
import createGetTrap from './trap/createGetTrap';
import createProxy from './trap/createProxy';
import createSetTrap from './trap/createSetTrap';

export {
  createAspect,
  aop,
  createHook,
  hookFor,
  hookName,
  createCallTrap,
  //getTrap,
  //setTrap,
  createProxy
};
