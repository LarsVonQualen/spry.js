'use strict';

(function () {
    var root = this,
        previous_spry = root.spry,
        spry = {};


    spry.noConflict = function() {
        root.spry = previous_spry;
        return spry;
    };

    if( typeof exports !== 'undefined' ) {
        if( typeof module !== 'undefined' && module.exports ) {
            exports = module.exports = spry;
        }

        exports.spry = spry;
    } else {
        root.spry = spry;
    }

    var _dependencies = {},
    resolver = function resolver(dependencies) {
        var resolved = [];

        dependencies.forEach(function dependencyIterator(d) {
            resolved.push(_dependencies[d]());
        });

        return resolved;
    };

    spry.register = {
        singleton: function singleton(name, dependencies) {
            var instance = undefined, fn = dependencies.pop();

            _dependencies[name] = function singleton() {
                if (instance === undefined) {
                    var resolvedDependencies = resolver(dependencies);

                    instance = fn.apply(root, resolvedDependencies);
                }

                return instance;
            };
        },
        factory: function factory(name, dependencies) {
            var fn = dependencies.pop();

            _dependencies[name] = function factory() {
                var resolvedDependencies = resolver(dependencies);

                return fn.apply(root, resolvedDependencies);
            }
        }
    };

    spry.resolve = function resolve(dependencies) {
        var fn = dependencies.pop(), resolvedDependencies = resolver(dependencies);

        fn.apply(root, resolvedDependencies);
    };

    if (typeof define === "function") {
        define([], function () {
            return spry;
        });
    }
}).call(this);
