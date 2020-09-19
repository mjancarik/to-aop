## [0.4.1](https://github.com/mjancarik/to-aop/compare/v0.4.0...v0.4.1) (2020-09-19)


### Bug Fixes

* added js file extension to dist ([799f63c](https://github.com/mjancarik/to-aop/commit/799f63cd7eec1e8a6d2ac91c87679644a8674e28))



# [0.4.0](https://github.com/mjancarik/to-aop/compare/0.3.6...0.4.0) (2020-09-16)


### Features

* **aroundmethod:** call all defined aroundMethod hooks ([5d5f4c8](https://github.com/mjancarik/to-aop/commit/5d5f4c8c16d90c43372f9c3fa2f94ca158a9c778))



## [0.3.6](https://github.com/mjancarik/to-aop/compare/0.3.5...0.3.6) (2020-07-29)


### Features

* **static:** static methods, getters and setters are hooked only for defined names ([a6881fb](https://github.com/mjancarik/to-aop/commit/a6881fbba925cfdd58911aa42f6a4077c09c68b1))



## [0.3.5](https://github.com/mjancarik/to-aop/compare/0.3.4...0.3.5) (2020-07-23)


### Features

* **aroundmethod:** added original method to meta for arround hook ([f83eae1](https://github.com/mjancarik/to-aop/commit/f83eae1a6c7796eca35143430d7802dd1811a695))



<a name="0.3.4"></a>
## [0.3.4](https://github.com/mjancarik/to-aop/compare/0.3.3...0.3.4) (2020-03-18)



<a name="0.3.3"></a>
## [0.3.3](https://github.com/mjancarik/to-aop/compare/0.3.2...0.3.3) (2020-02-28)


### Bug Fixes

* **class:** returnig value from static getter is not modified ([100295d](https://github.com/mjancarik/to-aop/commit/100295d))



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




