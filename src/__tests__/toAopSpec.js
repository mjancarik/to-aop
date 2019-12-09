import { createAspect } from '../toAop';
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
        [hookName.afterMethod]: afterMethod
      });

      withAspect = createAspect(pattern);
    });

    it('should call pattern.beforeMethod and pattern.afterMethod', () => {
      let { A } = createClasses();
      let instance = withAspect(new A());
      let result = instance.method({}, 1);

      expect(beforeMethod.mock.calls.length).toEqual(1);
      expect(beforeMethod.mock.calls[0]).toMatchSnapshot();
      expect(afterMethod.mock.calls.length).toEqual(1);
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
  });

  describe('for object', () => {
    let beforeMethod = null;
    let afterMethod = null;

    beforeEach(() => {
      beforeMethod = jest.fn();
      afterMethod = jest.fn();

      pattern = createPattern(undefined, {
        [hookName.beforeMethod]: beforeMethod,
        [hookName.afterMethod]: afterMethod
      });

      withAspect = createAspect(pattern);
    });

    it('should call pattern.beforeMethod and pattern.afterMethod for dummy object', () => {
      let dummy = {
        method() {}
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
        }
      };

      const xobject = withAspect(object);

      xobject.method();

      expect(xobject.value).toEqual(2);
      expect(beforeMethod.mock.calls.length).toEqual(1);
      expect(afterMethod.mock.calls.length).toEqual(1);
    });
  });
});
