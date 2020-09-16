# to-aop

[![Build Status](https://travis-ci.org/mjancarik/to-aop.svg?branch=master)](https://travis-ci.org/mjancarik/to-aop)
[![Coverage Status](https://coveralls.io/repos/github/mjancarik/to-aop/badge.svg?branch=master)](https://coveralls.io/github/mjancarik/to-aop?branch=master)
[![NPM package version](https://img.shields.io/npm/v/to-aop/latest.svg)](https://www.npmjs.com/package/to-aop)
[![code style: prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat-square)](https://github.com/prettier/prettier)

The to-aop module help you with applying [Aspect Oriented Programming](https://www.cs.ubc.ca/~gregor/papers/kiczales-ECOOP1997-AOP.pdf) to JavaScript. It use under the hood [ES Proxy](https://ponyfoo.com/articles/es6-proxies-in-depth) for object same as other similar modules. It allow you hook class without creating new instance as well. It use javascript prototype for that.

For example I am using it for adding hooks to production code where all debug code is missing. I don't have got access to instance but I have only class constructor. But usage is unlimited.

More articles about AOP:
1. https://blog.mgechev.com/2015/07/29/aspect-oriented-programming-javascript-aop-js/
2. https://hackernoon.com/aspect-oriented-programming-in-javascript-es5-typescript-d751dda576d0

Examples:
1. https://github.com/mjancarik/shallow-with-context/blob/master/src/shallowWithContext.js
2. https://github.com/seznam/ima/blob/master/packages/devtools/src/services/defaultSettings.json

## Installation

```bash
npm i to-aop --save
```

## Usage

You have some common class. For example:

``` javascript
// a.js
export default class A {
  constructor(variable) {
    this.variable = variable;
  }

  method() {
    return this.variable;
  }

  notHookedMethod() {
    return 'not hook';
  }    
}
```

#### Applying AOP to class

You can use it for creating hook to your favorite framework or your own application without modification source code.

``` javascript
import { aop, hookName, createHook } from 'to-aop';
import A from './a';

const classHookBefore = createHook(
  hookName.beforeMethod,
  /^(method)$/,
  ({ target, object, property, context, args }) => {
    //call your own hook
    console.log(
      `Instance of ${target.name} call "${property}"
with arguments ${args && args.length ? args : '[]'}.`
    );
  }
);

const classHookAfter = createHook(
  hookName.afterMethod,
  /^(method)$/,
  ({ target, object, property, context, args, payload }) => {
    //call your own hook
    console.log(
      `Instance of ${target.name} call "${property}"
with arguments ${args && args.length ? args : '[]'}
and return value is "${payload}".`
    );
  }
);

const hooks = Object.assign({}, classHookBefore, classHookAfter);

aop(
  A,
  hooks
); // bind hook to class
const a = new A('my hook');

a.method(); // Instance of A call "method" with arguments [] and return value is "my hook".
a.notHookedClassMethod(); // not hook

```

#### Applying AOP to instance or object

```javascript
import { aop, hookName, createHook } from 'to-aop';
import A from './a';

const instanceHook = createHook(
  hookName.afterMethod,
  /^(method)$/,
  ({ target, object, property, context, args, payload }) => {
    console.log(
      `Instance of ${object.constructor.name} call "${property}"
with arguments ${args && args.length ? args : '[]'}
and return value is "${payload}".`
    );
  }
);

const a = new A('my hook');
const hookedInstance = aop(a, instanceHook); // bind hook to instance

hookedInstance.method(); // "Instance of A call "method" with arguments [] and return value is "my hook".
hookedInstance.notHookedClassMethod(); // not hook
```

## Documentation

### createHook(hookName, regular, callbackHook)

  - (string) hookName - set of hooks
  - (string, regexp, Array, function) regular - condition for filtering
  - (function) callbackHook - your defined action

### aop(target, pattern)

  - (class, object) - target for hooks
  - (Object<string, Array<function>>) - pattern of hooks

## Hooks API

We implemented base set of hooks which you can use for AOP.

1. beforeMethod
2. afterMethod
3. aroundMethod
4. beforeGetter
5. afterGetter
6. aroundGetter
7. beforeSetter
8. afterSetter
9. aroundSetter

```javascript
import { hookName } from 'to-aop';

// hookName.(beforeMethod|afterMethod|...)

```
