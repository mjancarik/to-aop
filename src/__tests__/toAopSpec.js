import { createAspect } from '../toAop';

describe('createAspect method', () => {
  let withAspect = null;
  let withAspect2 = null;
  let pattern = null;

  function createClasses() {
    let staticSetter = null;

    class A {
      static staticMethod() {
        return 'static method';
      }

      static get staticGetter() {
        return 'static getter';
      }

      static set staticSetter(value) {
        staticSetter = value;
      }

      static get staticSetter() {
        return staticSetter;
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
      static staticMethod2() {
        return 'static method 2';
      }

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
      beforeSetter: () => {},
      afterGetter: () => {},
      afterSetter: () => {}
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
    it('should call pattern.beforeMethod and pattern.afterMethod for static method', () => {
      let { C } = createClasses();
      spyOn(pattern, 'beforeMethod');
      spyOn(pattern, 'afterMethod');

      withAspect(C);
      withAspect2(C);
      const staticResult1 = C.staticMethod();
      const staticResult2 = C.staticMethod2();

      expect(pattern.beforeMethod.calls.count()).toEqual(4);
      expect(pattern.beforeMethod.calls.argsFor(0)).toMatchSnapshot();
      expect(pattern.afterMethod.calls.count()).toEqual(4);
      expect(pattern.afterMethod.calls.argsFor(0)).toMatchSnapshot();

      expect(staticResult1).toMatchInlineSnapshot(`"static method"`);
      expect(staticResult2).toMatchInlineSnapshot(`"static method 2"`);
    });

    it('should call pattern.beforeGetter and pattern.afterGetter for static getter', () => {
      let { C } = createClasses();
      spyOn(pattern, 'beforeGetter');
      spyOn(pattern, 'afterGetter');

      withAspect(C);
      withAspect2(C);
      const staticResult1 = C.staticGetter;

      expect(staticResult1).toMatchInlineSnapshot(`"static getter"`);

      expect(pattern.beforeGetter.calls.count()).toEqual(2);
      expect(pattern.beforeGetter.calls.argsFor(0)).toMatchSnapshot();
      expect(pattern.afterGetter.calls.count()).toEqual(2);
      expect(pattern.afterGetter.calls.argsFor(0)).toMatchSnapshot();
    });

    it('should call pattern.beforeSetter and pattern.afterSetter for static setter', () => {
      let { C } = createClasses();
      spyOn(pattern, 'beforeSetter');
      spyOn(pattern, 'afterSetter');

      withAspect(C);
      withAspect2(C);
      C.staticSetter = 'static setter';

      expect(C.staticSetter).toMatchInlineSnapshot(`"static setter"`);

      expect(pattern.beforeSetter.calls.count()).toEqual(2);
      expect(pattern.beforeSetter.calls.argsFor(0)).toMatchSnapshot();
      expect(pattern.afterSetter.calls.count()).toEqual(2);
      expect(pattern.afterSetter.calls.argsFor(0)).toMatchSnapshot();
    });

    it('should not call pattern.afterMethod for static getter which return constructable function', () => {
      let { C, A } = createClasses();
      spyOn(pattern, 'afterMethod');

      C.A = A;

      withAspect(C);

      const a = Reflect.construct(C.A, []);

      expect(a instanceof A).toBeTruthy();

      expect(pattern.afterMethod.calls.count()).toEqual(0);
      expect(pattern.afterMethod.calls.argsFor(0)).toMatchSnapshot();
    });

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

  describe('es5 problems', () => {
    it('should be same instance', () => {
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

  describe('for object', () => {
    it('should call pattern.beforeMethod and pattern.afterMethod for dummy object', () => {
      spyOn(pattern, 'beforeMethod');
      spyOn(pattern, 'afterMethod');

      let dummy = {
        method() {}
      };

      let xdummy = withAspect(dummy);
      xdummy.method('works');

      expect(pattern.beforeMethod.calls.count()).toEqual(1);
      expect(pattern.afterMethod.calls.count()).toEqual(1);
    });

    it('should call pattern.beforeMethod and pattern.afterMethod for global console', () => {
      spyOn(pattern, 'beforeMethod');
      spyOn(pattern, 'afterMethod');
      spyOn(console, 'log');

      let xconsole = withAspect(console);
      xconsole.log('works');

      expect(pattern.beforeMethod.calls.count()).toEqual(1);
      expect(pattern.afterMethod.calls.count()).toEqual(1);
    });

    it('should call pattern.beforeMethod and pattern.afterMethod for object with context', () => {
      spyOn(pattern, 'beforeMethod');
      spyOn(pattern, 'afterMethod');

      const object = {
        value: 1,
        method: function increase() {
          this.value++;
        }
      };

      const xobject = withAspect(object);

      xobject.method();

      expect(xobject.value).toEqual(2);
      expect(pattern.beforeMethod.calls.count()).toEqual(1);
      expect(pattern.afterMethod.calls.count()).toEqual(1);
    });
  });
});
