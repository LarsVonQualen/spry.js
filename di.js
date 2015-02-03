'use strict';

(function () {
    var root = this,
        previous_di = root.di,
        di = {};


    di.noConflict = function() {
        root.di = previous_di;
        return di;
    };

    if( typeof exports !== 'undefined' ) {
        if( typeof module !== 'undefined' && module.exports ) {
            exports = module.exports = di;
        }

        exports.di = di;
    } else {
        root.di = di;
    }

    var _dependencies = {},
    resolver = function resolver(dependencies) {
        var resolved = [];

        dependencies.forEach(function dependencyIterator(d) {
            resolved.push(_dependencies[d]());
        });

        return resolved;
    };

    di.register = {
        singleton: function singleton(name, dependencies) {
            var instance = undefined, fn = dependencies.pop();

            _dependencies[name] = function singleton() {
                if (instance === undefined) {
                    var resolvedDependencies = resolver(dependencies);

                    instance = fn.apply(null, resolvedDependencies);
                }

                return instance;
            };
        },
        factory: function factory(name, dependencies) {
            var fn = dependencies.pop();

            _dependencies[name] = function factory() {
                var resolvedDependencies = resolver(dependencies);

                return fn.apply(null, resolvedDependencies);
            }
        }
    };

    di.resolve = function resolve(dependencies) {
        var fn = dependencies.pop(), resolvedDependencies = resolver(dependencies);

        fn.apply(null, resolvedDependencies);
    };

    if (typeof define === "function") {
        define([], function () {
            return di;
        });
    }
}).call(this);
