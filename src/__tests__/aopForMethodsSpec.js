import aopForMethods from '../aopForMethods';
import { hookName, createHook } from '../hook';
import createClasses from './createClasses';
import createPattern from './createPattern';

describe('for class', () => {
  let pattern = null;
  let pattern2 = null;
  let arroundPattern = null;

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
      arroundPattern = createHook(hookName.aroundMethod, /.*/, aroundMethod);
    });

    it('should call pattern.aroundMethod', () => {
      let { A } = createClasses();

      aopForMethods(A, arroundPattern);
      new A('method').method({}, 1);

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

      aopForMethods(A, arroundPattern);
      aopForMethods(C, arroundPattern);
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
        }
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

      aopForMethods(C, arroundPattern);
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
