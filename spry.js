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

    if (previous_spry !== undefined) {
        throw new Error("Multiple includes of spry, don't do that :-)");
    }

    var _dependencies = {},
    resolver = function resolver(dependencies) {
        var resolved = [];

        dependencies.forEach(function dependencyIterator(d) {
            if (typeof(d) === 'object') {
                resolved.push(d);
            } else {
                if (_dependencies[d] === undefined) {
                    throw new Error("Dependency '" + d + "' is undefined.");
                }

                //if (typeof(_dependencies[d].fn) !== "function") throw new Error("Dependency '" + d + "' is not a function.");

                resolved.push(_dependencies[d].fn());
            }
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
                },
                rawFn: fn
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
                },
                rawFn: fn
            };
        }
    };

    spry.resolve = function resolve(dependencies) {
        var fn = dependencies.pop(), resolvedDependencies = resolver(dependencies);

        fn.apply({}, resolvedDependencies);
    };

    spry.resolveSingleWith = function resolveSingleWith(dependency, substitutes) {
        var newList = _dependencies[dependency].dependencies.slice(0);

        for (var key in substitutes) {
            newList.forEach(function (e, i) {
                if (e == key) {
                    newList[i] = substitutes[key];
                }
            });
        }

        var resolved = resolver(newList);

        return _dependencies[dependency].rawFn.apply({}, resolved);
    };

    spry.resolveWith = function resolveWith(substitutes, dependencies) {
        var fn = dependencies.pop();

        for (var key in substitutes) {
            dependencies.forEach(function (e, i) {
                if (e == key) {
                    dependencies[i] = substitutes[key];
                }
            });
        }

        var resolved = resolver(dependencies);

        return fn.apply({}, resolved);
    };

    spry.getDependencyGraph = function () {
        return _dependencies;
    };
}).call(this);
