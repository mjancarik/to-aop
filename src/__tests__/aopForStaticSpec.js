import aopForStatic from '../aopForStatic';

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

    method2() {
      return this.map;
    }
  }

  return { A, B, C };
}

describe('aopForStatic method', () => {
  let pattern = null;
  let pattern2 = null;

  beforeEach(() => {
    pattern = {
      beforeMethod: () => {},
      afterMethod: () => {},
      beforeGetter: () => {},
      beforeSetter: () => {},
      afterGetter: () => {},
      afterSetter: () => {}
    };
    pattern2 = Object.assign({}, pattern);
  });

  describe('parent classs with static method', () => {
    let result = null;

    beforeEach(() => {
      spyOn(pattern, 'beforeMethod');
      spyOn(pattern2, 'beforeMethod');
      spyOn(pattern, 'afterMethod');
      spyOn(pattern2, 'afterMethod');

      const { A } = createClasses();

      aopForStatic(A, pattern);
      aopForStatic(A, pattern2);

      result = A.staticMethod();
    });

    it('should call pattern.beforeMethod and pattern.afterMethod', () => {
      expect(pattern.beforeMethod.calls.count()).toEqual(1);
      expect(pattern.beforeMethod.calls.argsFor(0)).toMatchSnapshot();
      expect(pattern.afterMethod.calls.count()).toEqual(1);
      expect(pattern.afterMethod.calls.argsFor(0)).toMatchSnapshot();
      expect(result).toEqual('static method');
    });

    it('should call pattern2.beforeMethod and pattern2.afterMethod', () => {
      expect(pattern2.beforeMethod.calls.count()).toEqual(1);
      expect(pattern2.beforeMethod.calls.argsFor(0)).toMatchSnapshot();
      expect(pattern2.afterMethod.calls.count()).toEqual(1);
      expect(pattern2.afterMethod.calls.argsFor(0)).toMatchSnapshot();
      expect(result).toEqual('static method');
    });
  });

  describe('parent classs with static getter', () => {
    let result = null;

    beforeEach(() => {
      const { A } = createClasses();

      aopForStatic(A, pattern);
      aopForStatic(A, pattern2);

      spyOn(pattern, 'beforeGetter');
      spyOn(pattern2, 'beforeGetter');
      spyOn(pattern, 'afterGetter');
      spyOn(pattern2, 'afterGetter');

      result = A.staticGetter;
    });

    it('should call pattern.beforeGetter and pattern.afterGetter', () => {
      expect(pattern.beforeGetter.calls.count()).toEqual(1);
      expect(pattern.beforeGetter.calls.argsFor(0)).toMatchSnapshot();
      expect(pattern.afterGetter.calls.count()).toEqual(1);
      expect(pattern.afterGetter.calls.argsFor(0)).toMatchSnapshot();
      expect(result).toEqual('static getter');
    });

    it('should call pattern2.beforeGetter and pattern2.afterGetter', () => {
      expect(pattern2.beforeGetter.calls.count()).toEqual(1);
      expect(pattern2.beforeGetter.calls.argsFor(0)).toMatchSnapshot();
      expect(pattern2.afterGetter.calls.count()).toEqual(1);
      expect(pattern2.afterGetter.calls.argsFor(0)).toMatchSnapshot();
      expect(result).toEqual('static getter');
    });
  });
});
