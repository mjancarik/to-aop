import { createAspect } from '../toAop';

describe('createAspect method', () => {
  let withAspect = null;
  let withAspect2 = null;
  let pattern = null;

  function createClasses() {
    class A {
      static staticMethod() {
        return 'static method';
      }

      constructor(variable) {
        this.variable = variable;
      }

      method() {
        return this.variable;
      }
    }

    class B extends A {
      constructor(variable) {
        super(variable);
      }

      method(...rest) {
        return 'B ' + super.method(...rest);
      }
    }

    class C extends A {
      constructor(variable) {
        super(variable);

        this.map = new Map();
      }
    }

    return { A, B, C };
  }

  beforeEach(() => {
    pattern = {
      beforeMethod: () => {},
      afterMethod: () => {},
      beforeGetter: () => {},
      afterGetter: () => {}
    };

    withAspect = createAspect(pattern);
    withAspect2 = createAspect(pattern);
  });

  afterEach(() => {});

  describe('for instance', () => {
    it('should call pattern.beforeMethod and pattern.afterMethod', () => {
      spyOn(pattern, 'beforeMethod');
      spyOn(pattern, 'afterMethod');

      let { A } = createClasses();
      let instance = withAspect(new A());
      let result = instance.method({}, 1);

      expect(pattern.beforeMethod.calls.count()).toEqual(1);
      expect(pattern.beforeMethod.calls.argsFor(0)).toMatchSnapshot();
      expect(pattern.afterMethod.calls.count()).toEqual(1);
      expect(pattern.afterMethod.calls.argsFor(0)).toMatchSnapshot();
      expect(result).toEqual(undefined);
    });

    it('should call pattern.beforeGetter and pattern.beforeMethod', () => {
      spyOn(pattern, 'beforeGetter');
      spyOn(pattern, 'beforeMethod');

      let { C } = createClasses();
      let instance = withAspect(new C());
      let entries = instance.map.entries();

      expect(pattern.beforeGetter.calls.count()).toEqual(2);
      expect(pattern.beforeMethod.calls.count()).toEqual(1);
      expect(entries.next().done).toEqual(true);
    });
  });

  describe('for class', () => {
    it('should call pattern.beforeMethod and pattern.afterMethod', () => {
      let { A } = createClasses();
      spyOn(pattern, 'beforeMethod');
      spyOn(pattern, 'afterMethod');

      withAspect(A);
      new A('method').method({}, 1);

      expect(pattern.beforeMethod.calls.count()).toEqual(1);
      expect(pattern.beforeMethod.calls.argsFor(0)).toMatchSnapshot();
      expect(pattern.afterMethod.calls.count()).toEqual(1);
      expect(pattern.afterMethod.calls.argsFor(0)).toMatchSnapshot();
    });

    it('should call pattern.beforeMethod and pattern.afterMethod for extended class', () => {
      let { B } = createClasses();
      spyOn(pattern, 'beforeMethod');
      spyOn(pattern, 'afterMethod');

      withAspect(B);
      new B('method').method({}, 1);

      expect(pattern.beforeMethod.calls.count()).toEqual(1);
      expect(pattern.beforeMethod.calls.argsFor(0)).toMatchSnapshot();
      expect(pattern.afterMethod.calls.count()).toEqual(1);
      expect(pattern.afterMethod.calls.argsFor(0)).toMatchSnapshot();
    });

    it('should call pattern.beforeMethod and pattern.afterMethod after class is instanced', () => {
      let { B } = createClasses();
      spyOn(pattern, 'beforeMethod');
      spyOn(pattern, 'afterMethod');

      const b = new B('method');
      withAspect(B);
      b.method({}, 1);

      expect(pattern.beforeMethod.calls.count()).toEqual(1);
      expect(pattern.beforeMethod.calls.argsFor(0)).toMatchSnapshot();
      expect(pattern.afterMethod.calls.count()).toEqual(1);
      expect(pattern.afterMethod.calls.argsFor(0)).toMatchSnapshot();
    });

    it('should call pattern.beforeMethod and pattern.afterMethod for extended classes with same ancestor', () => {
      let { B, C, A } = createClasses();
      spyOn(pattern, 'beforeMethod');
      spyOn(pattern, 'afterMethod');

      const b = new B('method');
      withAspect(A);
      withAspect2(A);
      withAspect(C);
      withAspect2(C);
      withAspect(B);
      withAspect2(B);
      expect(b.method({}, 1)).toEqual('B method');

      expect(pattern.beforeMethod.calls.count()).toEqual(6);
      expect(pattern.beforeMethod.calls.argsFor(0)).toMatchSnapshot();
      expect(pattern.afterMethod.calls.count()).toEqual(6);
      expect(pattern.afterMethod.calls.argsFor(0)).toMatchSnapshot();
    });
  });

  describe('es5', () => {
    it('should be same istance', () => {
      let { B, A } = createClasses();
      spyOn(pattern, 'beforeMethod');
      spyOn(pattern, 'afterMethod');

      const b = new B('method');
      withAspect(B);
      b.method({}, 1);

      expect(pattern.beforeMethod.calls.count()).toEqual(1);
      expect(pattern.afterMethod.calls.count()).toEqual(1);
      expect(b instanceof A).toBeTruthy();
      expect(b instanceof B).toBeTruthy();
    });
  });
});
