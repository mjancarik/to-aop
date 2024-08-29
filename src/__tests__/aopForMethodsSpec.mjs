import { expect, jest, describe, beforeEach, it } from '@jest/globals';

import aopForMethods from '../aopForMethods.mjs';
import { hookName, createHook } from '../hook.mjs';
import createClasses from './createClasses.mjs';
import createPattern from './createPattern.mjs';

describe('aopForMethods', () => {
  let pattern = null;
  let pattern2 = null;
  let aroundPattern = null;

  describe('class method', () => {
    let beforeMethod = null;
    let afterMethod = null;
    let aroundMethod = null;

    beforeEach(() => {
      beforeMethod = jest.fn();
      afterMethod = jest.fn();
      aroundMethod = jest.fn();

      pattern = createPattern(undefined, {
        [hookName.beforeMethod]: beforeMethod,
        [hookName.afterMethod]: afterMethod,
      });
      pattern2 = createPattern(undefined, {
        [hookName.beforeMethod]: beforeMethod,
        [hookName.afterMethod]: afterMethod,
      });
      aroundPattern = createHook(hookName.aroundMethod, /.*/, aroundMethod);
    });

    it('should call pattern.aroundMethod', () => {
      let { A } = createClasses();

      aopForMethods(A, aroundPattern);
      new A('method').method({}, 1);

      expect(aroundMethod.mock.calls.length).toEqual(1);
      expect(aroundMethod.mock.calls[0][0].original).not.toEqual(aroundMethod);
      expect(aroundMethod.mock.calls[0]).toMatchSnapshot();
    });

    it('should call pattern.aroundMethod three times and modify payload', () => {
      aroundMethod = jest.fn(({ args }) => (args[1] ? args[1] + 1 : args[1]));
      aroundPattern = createHook(hookName.aroundMethod, /.*/, aroundMethod);

      let { A } = createClasses();

      aopForMethods(A, aroundPattern);
      aopForMethods(A, aroundPattern);
      aopForMethods(A, aroundPattern);
      const result = new A('method').method({}, 1);

      expect(result).toEqual(2);
      expect(aroundMethod.mock.calls.length).toEqual(1);
      expect(aroundMethod.mock.calls[0][0].original).not.toEqual(aroundMethod);
      expect(aroundMethod.mock.calls[0]).toMatchSnapshot();
    });

    it('should call pattern.beforeMethod and pattern.afterMethod', () => {
      let { A } = createClasses();

      aopForMethods(A, pattern);
      new A('method').method({}, 1);

      expect(beforeMethod.mock.calls.length).toEqual(1);
      expect(beforeMethod.mock.calls[0]).toMatchSnapshot();
      expect(afterMethod.mock.calls.length).toEqual(1);
      expect(afterMethod.mock.calls[0]).toMatchSnapshot();
    });

    it('should create meta information from pattern.beforeMethod and pass to pattern.afterMethod', () => {
      const value = 'value';
      beforeMethod = ({ meta }) => (meta.information = 'value');
      afterMethod = ({ meta }) => expect(meta.information).toEqual(value);
      pattern = createPattern(undefined, {
        [hookName.beforeMethod]: beforeMethod,
        [hookName.afterMethod]: afterMethod,
      });

      let { A } = createClasses();

      aopForMethods(A, pattern);
      new A('method').method({}, 1);
    });

    it('should call pattern.beforeMethod and pattern.afterMethod for extended class with multiple aspect', () => {
      let { A, C } = createClasses();

      aopForMethods(A, pattern);
      aopForMethods(C, pattern);

      new C('method').method2({}, 1);

      expect(beforeMethod.mock.calls.length).toEqual(1);
      expect(beforeMethod.mock.calls[0]).toMatchSnapshot();
      expect(afterMethod.mock.calls.length).toEqual(1);
      expect(afterMethod.mock.calls[0]).toMatchSnapshot();
    });

    it('should call pattern.arroundMethod for extended class with multiple aspect', () => {
      let { A, C } = createClasses();

      aopForMethods(A, aroundPattern);
      aopForMethods(C, aroundPattern);
      new C('method').method2({}, 1);

      expect(aroundMethod.mock.calls.length).toEqual(1);
      expect(aroundMethod.mock.calls[0][0].original).not.toEqual(aroundMethod);
      expect(aroundMethod.mock.calls[0]).toMatchSnapshot();
    });

    it('should call pattern.beforeMethod and pattern.afterMethod for extended class', () => {
      let { B } = createClasses();

      aopForMethods(B, pattern);
      new B('method').method({}, 1);

      expect(beforeMethod.mock.calls.length).toEqual(1);
      expect(beforeMethod.mock.calls[0]).toMatchSnapshot();
      expect(afterMethod.mock.calls.length).toEqual(1);
      expect(afterMethod.mock.calls[0]).toMatchSnapshot();
    });

    it('should call pattern.beforeMethod and pattern.afterMethod after class is instanced', () => {
      let { B } = createClasses();

      const b = new B('method');
      aopForMethods(B, pattern);
      b.method({}, 1);

      expect(beforeMethod.mock.calls.length).toEqual(1);
      expect(beforeMethod.mock.calls[0]).toMatchSnapshot();
      expect(afterMethod.mock.calls.length).toEqual(1);
      expect(afterMethod.mock.calls[0]).toMatchSnapshot();
    });

    it('should create meta information from pattern.beforeMethod and pass to pattern.afterMethod after class is instanced', () => {
      const value = 'value';
      beforeMethod = ({ meta }) => (meta.information = 'value');
      afterMethod = ({ meta }) => expect(meta.information).toEqual(value);
      pattern = createPattern(undefined, {
        [hookName.beforeMethod]: beforeMethod,
        [hookName.afterMethod]: afterMethod,
      });

      let { B } = createClasses();
      const b = new B('method');

      aopForMethods(B, pattern);
      b.method({}, 1);
    });

    it('should call pattern.beforeMethod and pattern.afterMethod for extended classes with same ancestor', () => {
      let { B, C, A } = createClasses();

      const b = new B('method');
      aopForMethods(A, pattern);
      aopForMethods(A, pattern2);
      aopForMethods(C, pattern);
      aopForMethods(C, pattern2);
      aopForMethods(B, pattern);
      aopForMethods(B, pattern2);

      expect(b.method({}, 1)).toEqual('B method');

      expect(beforeMethod.mock.calls.length).toEqual(6);
      expect(beforeMethod.mock.calls[0]).toMatchSnapshot();
      expect(afterMethod.mock.calls.length).toEqual(6);
      expect(afterMethod.mock.calls[0]).toMatchSnapshot();
    });

    it('should call pattern.beforeMethod and pattern.afterMethod for super.superMethod', () => {
      let { C } = createClasses();
      pattern = createPattern(
        {
          [hookName.beforeMethod]: 'superMethod',
          [hookName.afterMethod]: 'superMethod',
        },
        {
          [hookName.beforeMethod]: beforeMethod,
          [hookName.afterMethod]: afterMethod,
        },
      );

      aopForMethods(C, pattern);
      const c = new C('super method');

      expect(c.superMethod()).toEqual('super method');

      expect(beforeMethod.mock.calls.length).toEqual(1);
      expect(beforeMethod.mock.calls[0]).toMatchSnapshot();
      expect(afterMethod.mock.calls.length).toEqual(1);
      expect(afterMethod.mock.calls[0]).toMatchSnapshot();
    });

    it('should call pattern.aroundMethod for super.superMethod', () => {
      let { C } = createClasses();

      aopForMethods(C, aroundPattern);
      const c = new C('super method');

      expect(c.superMethod()).toEqual(undefined);

      expect(aroundMethod.mock.calls.length).toEqual(1);
      expect(aroundMethod.mock.calls[0][0].original).not.toEqual(aroundMethod);
      expect(aroundMethod.mock.calls[0]).toMatchSnapshot();
    });
  });

  describe('es5 problems', () => {
    let beforeMethod = null;
    let afterMethod = null;

    beforeEach(() => {
      beforeMethod = jest.fn();
      afterMethod = jest.fn();

      pattern = createPattern(undefined, {
        [hookName.beforeMethod]: beforeMethod,
        [hookName.afterMethod]: afterMethod,
      });
    });

    it('should be same instance', () => {
      let { B, A } = createClasses();

      const b = new B('method');
      aopForMethods(B, pattern);
      b.method({}, 1);

      expect(beforeMethod.mock.calls.length).toEqual(1);
      expect(afterMethod.mock.calls.length).toEqual(1);
      expect(b instanceof A).toBeTruthy();
      expect(b instanceof B).toBeTruthy();
    });
  });
});
