import { aop, createAspect, unAop } from '../toAop';
import { hookName } from '../hook';
import createClasses from './createClasses';
import createPattern from './createPattern';

describe('createAspect method', () => {
  let withAspect = null;
  let pattern = null;

  beforeEach(() => {
    pattern = createPattern();

    withAspect = createAspect(pattern);
  });

  describe('for class', () => {
    let beforeMethod = null;
    let afterMethod = null;

    beforeEach(() => {
      beforeMethod = jest.fn();
      afterMethod = jest.fn();

      pattern = createPattern(undefined, {
        [hookName.beforeMethod]: beforeMethod,
        [hookName.afterMethod]: afterMethod,
      });

      withAspect = createAspect(pattern);
    });

    it('should call pattern.beforeMethod and pattern.afterMethod', () => {
      const variableValue = 'variableValue';
      let { A } = createClasses();
      withAspect(A);

      let instance = new A(variableValue);
      let result = instance.method({}, 1);

      expect(beforeMethod.mock.calls.length).toEqual(1);
      expect(beforeMethod.mock.calls[0]).toMatchSnapshot();
      expect(afterMethod.mock.calls.length).toEqual(1);
      expect(afterMethod.mock.calls[0]).toMatchSnapshot();

      expect(result).toEqual(variableValue);
    });

    it('should not call pattern.beforeMethod and pattern.afterMethod after unAop method is called', () => {
      let { A } = createClasses();
      withAspect(A);
      unAop(A);

      let instance = new A();
      let result = instance.method({}, 1);

      expect(beforeMethod.mock.calls.length).toEqual(0);
      expect(beforeMethod.mock.calls[0]).toMatchSnapshot();
      expect(afterMethod.mock.calls.length).toEqual(0);
      expect(afterMethod.mock.calls[0]).toMatchSnapshot();

      expect(result).toEqual(undefined);
    });

    it('should call pattern.beforeMethod and pattern.afterMethod after aop hooks are added, removed and added again to the same class', () => {
      const variableValue = 'variableValue';
      let { A } = createClasses();
      withAspect(A);
      unAop(A);
      withAspect(A);

      let instance = new A(variableValue);
      let result = instance.method({}, 1);

      expect(beforeMethod.mock.calls.length).toEqual(1);
      expect(beforeMethod.mock.calls[0]).toMatchSnapshot();
      expect(afterMethod.mock.calls.length).toEqual(1);
      expect(afterMethod.mock.calls[0]).toMatchSnapshot();

      expect(result).toEqual(variableValue);
    });

    it('should not call pattern.beforeMethod and pattern.afterMethod after aop hooks are added, removed, added and removed again from the same class', () => {
      let { A } = createClasses();
      withAspect(A);
      unAop(A);
      withAspect(A);
      unAop(A);

      let instance = new A();
      let result = instance.method({}, 1);

      expect(beforeMethod.mock.calls.length).toEqual(0);
      expect(beforeMethod.mock.calls[0]).toMatchSnapshot();
      expect(afterMethod.mock.calls.length).toEqual(0);
      expect(afterMethod.mock.calls[0]).toMatchSnapshot();

      expect(result).toEqual(undefined);
    });

    it('call pattern.beforeMethod and pattern.afterMethod with multiple aspect', () => {
      let { E, F } = createClasses();

      withAspect(E);
      withAspect(E);
      withAspect(E);
      withAspect(F);

      const value = {
        x: () => {},
      };
      const instance = new F(value);
      const result = instance.getValue();

      expect(() => result.x()).not.toThrow();
      expect(result).toEqual(value);
      expect(beforeMethod.mock.calls.length).toEqual(1);
      expect(beforeMethod.mock.calls[0]).toMatchSnapshot();
      expect(afterMethod.mock.calls.length).toEqual(1);
      expect(afterMethod.mock.calls[0]).toMatchSnapshot();
    });

    it('should not modified returnig value for static getter in parent class', () => {
      let { E, F } = createClasses();

      withAspect(E);
      withAspect(F);

      expect(E.$dependencies).toEqual(['E']);
      expect(F.$dependencies).toEqual(['F']);
    });

    it('should not modified returnig value for static getter in child class', () => {
      let { E, F } = createClasses();

      withAspect(F);
      withAspect(E);

      expect(E.$dependencies).toEqual(['E']);
      expect(F.$dependencies).toEqual(['F']);
    });

    it('should call pattern.beforeMethod and pattern.afterMethod for settings constructor: true', () => {
      let { A } = createClasses();
      let AA = aop(A, pattern, { constructor: true });
      let instance = new AA(1);
      let result = instance.method({}, 1);

      expect(beforeMethod.mock.calls.length).toEqual(2);
      expect(beforeMethod.mock.calls[0]).toMatchSnapshot();
      expect(afterMethod.mock.calls.length).toEqual(2);
      expect(afterMethod.mock.calls[0]).toMatchSnapshot();
      expect(result).toEqual(1);
    });

    it('should call pattern.beforeMethod and pattern.afterMethod for settings constructor: true and extended class', () => {
      let { B } = createClasses();
      let BB = aop(B, pattern, { constructor: true });
      let instance = new BB(1);
      let result = instance.method({}, 1);

      expect(beforeMethod.mock.calls.length).toEqual(2);
      expect(beforeMethod.mock.calls[0]).toMatchSnapshot();
      expect(afterMethod.mock.calls.length).toEqual(2);
      expect(afterMethod.mock.calls[0]).toMatchSnapshot();
      expect(result).toEqual('B 1');
    });
  });

  describe('for instance', () => {
    let beforeMethod = null;
    let beforeGetter = null;
    let afterMethod = null;

    beforeEach(() => {
      beforeMethod = jest.fn();
      beforeGetter = jest.fn();
      afterMethod = jest.fn();

      pattern = createPattern(undefined, {
        [hookName.beforeMethod]: beforeMethod,
        [hookName.beforeGetter]: beforeGetter,
        [hookName.afterMethod]: afterMethod,
      });

      withAspect = createAspect(pattern);
    });

    it('should call pattern.beforeMethod and pattern.afterMethod', () => {
      const variableValue = 'variableValue';
      let { A } = createClasses();
      let instance = withAspect(new A(variableValue));
      let result = instance.method({}, 1);

      expect(beforeMethod.mock.calls.length).toEqual(1);
      expect(beforeMethod.mock.calls[0]).toMatchSnapshot();
      expect(afterMethod.mock.calls.length).toEqual(1);
      expect(afterMethod.mock.calls[0]).toMatchSnapshot();

      expect(result).toEqual(variableValue);
    });

    it('should not call pattern.beforeMethod and pattern.afterMethod after unAop method is called', () => {
      let { A } = createClasses();
      let a = new A();
      let instance = withAspect(a);
      unAop(a);
      let result = instance.method({}, 1);

      expect(beforeMethod.mock.calls.length).toEqual(0);
      expect(beforeMethod.mock.calls[0]).toMatchSnapshot();
      expect(afterMethod.mock.calls.length).toEqual(0);
      expect(afterMethod.mock.calls[0]).toMatchSnapshot();

      expect(result).toEqual(undefined);
    });

    it('should call pattern.beforeMethod and pattern.afterMethod after aop hooks are added, removed and added again to the same method', () => {
      const variableValue = 'variableValue';
      let { A } = createClasses();
      let a = new A(variableValue);
      withAspect(a);
      unAop(a);
      let instance = withAspect(a);
      let result = instance.method({}, 1);

      expect(beforeMethod.mock.calls.length).toEqual(1);
      expect(beforeMethod.mock.calls[0]).toMatchSnapshot();
      expect(afterMethod.mock.calls.length).toEqual(1);
      expect(afterMethod.mock.calls[0]).toMatchSnapshot();

      expect(result).toEqual(variableValue);
    });

    it('should not call pattern.beforeMethod and pattern.afterMethod after aop hooks are added, removed, added and removed again from the same method', () => {
      let { A } = createClasses();
      let a = new A();
      withAspect(a);
      unAop(a);
      let instance = withAspect(a);
      unAop(a);
      let result = instance.method({}, 1);

      expect(beforeMethod.mock.calls.length).toEqual(0);
      expect(beforeMethod.mock.calls[0]).toMatchSnapshot();
      expect(afterMethod.mock.calls.length).toEqual(0);
      expect(afterMethod.mock.calls[0]).toMatchSnapshot();

      expect(result).toEqual(undefined);
    });

    it('should call pattern.beforeGetter and pattern.beforeMethod', () => {
      let { C } = createClasses();
      let instance = withAspect(new C());
      let entries = instance.map.entries();

      expect(beforeGetter.mock.calls.length).toEqual(2);
      expect(beforeMethod.mock.calls.length).toEqual(1);
      expect(entries.next().done).toEqual(true);
    });

    it('should return value from instance getter', () => {
      let { F } = createClasses();

      const value = 1;
      let instance = withAspect(new F(value));

      expect(instance.value).toEqual(value);
      expect(beforeGetter.mock.calls.length).toEqual(1);
    });
  });

  describe('for object', () => {
    let beforeMethod = null;
    let afterMethod = null;

    beforeEach(() => {
      beforeMethod = jest.fn();
      afterMethod = jest.fn();

      pattern = createPattern(undefined, {
        [hookName.beforeMethod]: beforeMethod,
        [hookName.afterMethod]: afterMethod,
      });

      withAspect = createAspect(pattern);
    });

    it('should call pattern.beforeMethod and pattern.afterMethod for dummy object', () => {
      let dummy = {
        method() {},
      };

      let xdummy = withAspect(dummy);
      xdummy.method('works');

      expect(beforeMethod.mock.calls.length).toEqual(1);
      expect(afterMethod.mock.calls.length).toEqual(1);
    });

    it('should call pattern.beforeMethod and pattern.afterMethod for global console', () => {
      spyOn(console, 'log');

      let xconsole = withAspect(console);
      xconsole.log('works');

      expect(beforeMethod.mock.calls.length).toEqual(1);
      expect(afterMethod.mock.calls.length).toEqual(1);
    });

    it('should call pattern.beforeMethod and pattern.afterMethod for object with context', () => {
      const object = {
        value: 1,
        method: function increase() {
          this.value++;
        },
      };

      const xobject = withAspect(object);

      xobject.method();

      expect(xobject.value).toEqual(2);
      expect(beforeMethod.mock.calls.length).toEqual(1);
      expect(afterMethod.mock.calls.length).toEqual(1);
    });
  });
});
