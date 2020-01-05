<a name="0.3.2"></a>
## [0.3.2](https://github.com/mjancarik/to-aop/compare/0.3.1...0.3.2) (2020-01-05)


### Bug Fixes

* static methods, getters and setters not throw error during hooking ([911216d](https://github.com/mjancarik/to-aop/commit/911216d))



<a name="0.3.1"></a>
## [0.3.1](https://github.com/mjancarik/to-aop/compare/0.3.0...0.3.1) (2019-12-16)


### Bug Fixes

* returning value from static getter ([2189021](https://github.com/mjancarik/to-aop/commit/2189021))



<a name="0.3.0"></a>
# [0.3.0](https://github.com/mjancarik/to-aop/compare/0.2.1...0.3.0) (2019-12-09)


### Features

* **static:** added support for static getter, setter and method ([d94583a](https://github.com/mjancarik/to-aop/commit/d94583a))



<a name="0.2.1"></a>
## [0.2.1](https://github.com/mjancarik/to-aop/compare/0.2.0...0.2.1) (2019-08-29)


### Bug Fixes

* **trap:** must keep context of called method ([f88f26f](https://github.com/mjancarik/to-aop/commit/f88f26f))



<a name="0.2.0"></a>
# [0.2.0](https://github.com/mjancarik/to-aop/compare/0.1.3...0.2.0) (2019-08-11)


### Bug Fixes

* **trap:** createCallTrap works for global object console ([78d7de8](https://github.com/mjancarik/to-aop/commit/78d7de8))



<a name="0.1.3"></a>
## [0.1.3](https://github.com/mjancarik/to-aop/compare/0.1.2...0.1.3) (2019-07-12)


### Bug Fixes

* **aop:** builtin Object hasOwnProperty call ([fd2b69a](https://github.com/mjancarik/to-aop/commit/fd2b69a))



<a name="0.1.2"></a>
## [0.1.2](https://github.com/mjancarik/to-aop/compare/0.1.1...0.1.2) (2019-05-19)



<a name="0.1.1"></a>
## [0.1.1](https://github.com/mjancarik/to-aop/compare/0.1.0...0.1.1) (2019-04-26)



<a name="0.1.0"></a>
# [0.1.0](https://github.com/mjancarik/to-aop/compare/0.0.11...0.1.0) (2019-04-23)



<a name="0.0.11"></a>
## [0.0.11](https://github.com/mjancarik/to-aop/compare/0.0.10...0.0.11) (2019-04-18)


### Bug Fixes

* **constructable:** fixed detection of constructable function ([d68389c](https://github.com/mjancarik/to-aop/commit/d68389c))



<a name="0.0.10"></a>
## [0.0.10](https://github.com/mjancarik/to-aop/compare/0.0.9...0.0.10) (2019-04-18)


### Bug Fixes

* **aop:** cunstructable function is not hook for static getter ([c40c7b0](https://github.com/mjancarik/to-aop/commit/c40c7b0))



<a name="0.0.9"></a>
## [0.0.9](https://github.com/mjancarik/to-aop/compare/0.0.8...0.0.9) (2019-04-09)


### Bug Fixes

* **hook:** added missing hooks name for setter ([2a652f6](https://github.com/mjancarik/to-aop/commit/2a652f6))


### Features

* **class:** added aop to class static method ([937873d](https://github.com/mjancarik/to-aop/commit/937873d))



<a name="0.0.8"></a>
## [0.0.8](https://github.com/mjancarik/to-aop/compare/0.0.7...0.0.8) (2018-12-14)


### Features

* **main:** to-aop exports hookName and all traps ([195fcf5](https://github.com/mjancarik/to-aop/commit/195fcf5))



<a name="0.0.7"></a>
## [0.0.7](https://github.com/mjancarik/to-aop/compare/0.0.6...0.0.7) (2018-12-08)


### Bug Fixes

* **instance:** fixing aop for instance which use proxy ([c28aeb7](https://github.com/mjancarik/to-aop/commit/c28aeb7))



<a name="0.0.6"></a>
## [0.0.6](https://github.com/mjancarik/to-aop/compare/0.0.5...0.0.6) (2018-10-12)


### Features

* **aop:** the method may be called more times for class ([5922d14](https://github.com/mjancarik/to-aop/commit/5922d14))



<a name="0.0.5"></a>
## [0.0.5](https://github.com/mjancarik/to-aop/compare/0.0.4...0.0.5) (2018-08-30)


### Features

* **class:** allow hook traspiled ES6 class to es5 ([9d5774e](https://github.com/mjancarik/to-aop/commit/9d5774e))



<a name="0.0.4"></a>
## [0.0.4](https://github.com/mjancarik/to-aop/compare/0.0.3...0.0.4) (2018-08-02)


### Bug Fixes

* **file:** fix case sensitive for file structure ([8662df2](https://github.com/mjancarik/to-aop/commit/8662df2))



<a name="0.0.3"></a>
## [0.0.3](https://github.com/mjancarik/to-aop/compare/0.0.2...0.0.3) (2018-08-02)


### Features

* **hook:** added new exported method createHook and hookFor ([5bc390c](https://github.com/mjancarik/to-aop/commit/5bc390c))


### BREAKING CHANGES

* **hook:** Method createPattern was renamed to createAspect. The arguments order was changed
in aop method.



<a name="0.0.2"></a>
## 0.0.2 (2018-07-27)


### Features

* **aop:** init commit ([930738a](https://github.com/mjancarik/to-aop/commit/930738a))




