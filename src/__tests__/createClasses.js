export default function createClasses() {
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

    superMethod() {
      return this._privateMethod();
    }

    _privateMethod() {
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

    superMethod() {
      return super.superMethod();
    }
  }

  class D {
    static staticMethod() {
      throw new Error('Static method');
    }

    static get staticGetter() {
      throw new Error('Static getter');
    }

    static set staticSetter(value) {
      throw new Error('Static setter');
    }

    static get staticSetter() {
      throw new Error('Static setter');
    }
  }

  return { A, B, C, D };
}
