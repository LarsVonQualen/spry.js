/**
 * spry.js
 *
 * MIT License
 *
 * Author: Lars von Qualen <larsvonqualen@gmail.com>
 */
(function () {
    'use strict';

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
            if (_dependencies[d] === undefined) {
                throw new Error("Dependency '" + d + "' is undefined.");
            }

            //if (typeof(_dependencies[d].fn) !== "function") throw new Error("Dependency '" + d + "' is not a function.");

            resolved.push(_dependencies[d].fn());
        });

        return resolved;
    };

    spry.register = {
        singleton: function singleton(name, dependencies) {
            if (!(dependencies instanceof Array)) throw new Error("Dependencies must be defined in an array.");

            var instance = undefined, fn = dependencies.pop();

            if (typeof(fn) !== "function") throw new Error("Dependency '" + name + "' is not a function.");

            _dependencies[name] = {
                name: name,
                dependencies: dependencies,
                fn: function singleton() {
                    if (instance === undefined) {
                        var resolvedDependencies = resolver(dependencies);

                        instance = fn.apply({}, resolvedDependencies);
                    }

                    return instance;
                }
            };
        },
        factory: function factory(name, dependencies) {
            if (!(dependencies instanceof Array)) throw new Error("Dependencies must be defined in an array.");

            var fn = dependencies.pop();

            if (typeof(fn) !== "function") throw new Error("Dependency '" + name + "' is not a function.");

            _dependencies[name] = {
                name: name,
                dependencies: dependencies,
                fn: function factory() {
                    var resolvedDependencies = resolver(dependencies);

                    return fn.apply({}, resolvedDependencies);
                }
            };
        }
    };

    spry.resolve = function resolve(dependencies) {
        var fn = dependencies.pop(), resolvedDependencies = resolver(dependencies);

        fn.apply({}, resolvedDependencies);
    };

    spry.getDependencyGraph = function () {
        return _dependencies;
    };

    if (typeof define === "function") {
        define([], function () {
            return spry;
        });
    }
}).call(this);
