import { createAspect } from '../toAop';

describe('createAspect method', () => {
  let withAspect = null;
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
  });

  afterEach(() => {});

  describe('for instance', () => {
    it('should call pattern.beforeMethod and pattern.afterMethod', () => {
      spyOn(pattern, 'beforeMethod');
      spyOn(pattern, 'afterMethod');

      let { A } = createClasses();
      let instance = withAspect(new A());
      instance.method({}, 1);

      expect(pattern.beforeMethod.calls.count()).toEqual(1);
      expect(pattern.beforeMethod.calls.argsFor(0)).toMatchSnapshot();
      expect(pattern.afterMethod.calls.count()).toEqual(1);
      expect(pattern.afterMethod.calls.argsFor(0)).toMatchSnapshot();
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
      let { B, C } = createClasses();
      spyOn(pattern, 'beforeMethod');
      spyOn(pattern, 'afterMethod');

      const b = new B('method');
      withAspect(B);
      withAspect(C);
      b.method({}, 1);

      expect(pattern.beforeMethod.calls.count()).toEqual(2);
      expect(pattern.beforeMethod.calls.argsFor(0)).toMatchSnapshot();
      expect(pattern.afterMethod.calls.count()).toEqual(2);
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
