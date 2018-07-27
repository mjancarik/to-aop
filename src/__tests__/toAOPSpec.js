import { createPattern } from '../toAOP';

describe('createPattern method', () => {
  let withPattern = null;
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

    withPattern = createPattern(pattern);
  });

  afterEach(() => {});

  describe('for instance', () => {
    it('should call pattern.beforeMethod and pattern.afterMethod', () => {
      spyOn(pattern, 'beforeMethod');
      spyOn(pattern, 'afterMethod');

      let { A } = createClasses();
      let instance = withPattern(new A());
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

      withPattern(A);
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

      withPattern(B);
      new B('method').method({}, 1);

      expect(pattern.beforeMethod.calls.count()).toEqual(1);
      expect(pattern.beforeMethod.calls.argsFor(0)).toMatchSnapshot();
      expect(pattern.afterMethod.calls.count()).toEqual(1);
      expect(pattern.afterMethod.calls.argsFor(0)).toMatchSnapshot();
    });

    it('should call pattern.beforeMethod and pattern.afterMethod after class is instanced', () => {
      let { B, C } = createClasses();
      spyOn(pattern, 'beforeMethod');
      spyOn(pattern, 'afterMethod');

      const b = new B('method');
      withPattern(B);
      withPattern(C);
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
      withPattern(B);
      withPattern(C);
      b.method({}, 1);

      expect(pattern.beforeMethod.calls.count()).toEqual(1);
      expect(pattern.beforeMethod.calls.argsFor(0)).toMatchSnapshot();
      expect(pattern.afterMethod.calls.count()).toEqual(1);
      expect(pattern.afterMethod.calls.argsFor(0)).toMatchSnapshot();
    });
  });
});
