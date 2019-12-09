import { createHook, hookFor, hookName } from '../hook';
import { AOP_FILTER_FUNCTION } from '../symbol';

describe('hook', () => {
  describe('method createHook', () => {
    it('should return specific hook structure', () => {
      const hook = createHook(hookName.beforeMethod, 'setMethod', () => {});

      expect(hook).toMatchSnapshot();
    });

    it('should return true if method match with defined regular', () => {
      const hook = createHook(hookName.beforeMethod, 'setMethod', () => {});

      expect(
        hook[hookName.beforeMethod][AOP_FILTER_FUNCTION]({
          property: 'setMethod'
        })
      ).toEqual(true);
    });

    it('should return false if method not match with defined regular', () => {
      const hook = createHook(hookName.beforeMethod, 'setMethod', () => {});

      expect(
        hook[hookName.beforeMethod][AOP_FILTER_FUNCTION]({
          property: 'getMethod'
        })
      ).toEqual(false);
    });
  });

  describe('method hookFor', () => {
    let metaTruthy = null;
    let metaFalsy = null;
    let fn = null;

    beforeEach(() => {
      metaTruthy = {
        property: 'setState'
      };
      metaFalsy = {
        property: 'getState'
      };
      fn = jest.fn();
    });

    it('should call action for filtering rule as string', () => {
      hookFor(metaTruthy, 'setState', fn);

      expect(fn).toHaveBeenCalledWith(metaTruthy);
    });

    it('should call action for filtering rule as regexp', () => {
      hookFor(metaTruthy, /setState/gi, fn);

      expect(fn).toHaveBeenCalledWith(metaTruthy);
    });

    it('should call action for filtering rule as function', () => {
      hookFor(metaTruthy, () => true, fn);

      expect(fn).toHaveBeenCalledWith(metaTruthy);
    });

    it('should call action hook for filtering rule as list', () => {
      hookFor(metaTruthy, [{ rule: 'setState', action: fn }]);

      expect(fn).toHaveBeenCalledWith(metaTruthy);
    });

    it('should throw error for bad structure at filtering rule', () => {
      expect(() => hookFor(metaTruthy, {}, fn)).toThrow();
    });

    it('should not call action', () => {
      hookFor(metaFalsy, () => false, fn);

      expect(fn).not.toHaveBeenCalled();
    });
  });
});
