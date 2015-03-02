# spry.js
Tiny Javascript dependency injection framework, that uses the same syntax as AngularJS.

[![NPM](https://nodei.co/npm/spry.js.png?downloads=true&downloadRank=true&stars=true)](https://nodei.co/npm/spry.js.png?downloads=true&downloadRank=true&stars=true)

## It's very simple to use....
The api consists of three different methods.

```javascript
{
    noConflict: function () {},
    register: {
        singleton: function(name, dependencies) {},
        factory: function (name, dependencies) {}
    },
    resolve: function (dependencies) {},
    resolveSingleWith: function(dependency, substitutes),
    resolveWith: function(substitutes, dependencies)
}
```

### Singleton
If a singleton is injected it will always be the same instance.

### Factory
Here you register a factory method, that essentially will be resolved every time it is injected.

### Resolve
Similiar to a AngularJS controller except that it doesn't take a name.

## In a test scenario
```javascript
try {
    var singletonUnderTest = spry.resolveSingleDependencyWith("MySingleton", {
        "MyFactory": {
            setState: function () {
                console.log("im setstate");
            },
            getState: function () {
                console.log("im getState");
            }
        }
    });

    singletonUnderTest.setState("blag");
    singletonUnderTest.getState();
} catch (e) {
    console.log(e);
}

try {
    spry.resolveWith({
        "MyFactory": {
            setState: function () {
                console.log("im setstate");
            },
            getState: function () {
                console.log("im getState");
            }
        }
    }, ["MyFactory", "MySingleton", function Test2(myFactory, mySingleton) {
        console.log("#3 factory test:");
        myFactory.getState();
        console.log("#3 singleton test: ", mySingleton.getState());

    }]);
} catch (e) {
    console.log(e);
}
```

## Complete Node Usage Example
Here is a complete example. Notice that the singleton is dependent on the factory, but it is declared before the factory, AND IT WORKS :-D

```javascript
var spry = require("./spry.js");

spry.register.singleton("MySingleton", ["MyFactory", function MySingleton(myFactory) {
    return myFactory;
}]);

spry.register.factory("MyFactory", [function MyFactory() {
    var someStateVar = "state1";

    return {
        setState: function setState(state) {
            someStateVar = state;
        },
        getState: function getState() {
            return someStateVar;
        }
    };
}]);

spry.resolve(["MyFactory", "MySingleton", function Test1(myFactory, mySingleton) {
    console.log("#1 factory test: ", myFactory.getState());
    myFactory.setState("state2");

    console.log("#1 singleton test: ", mySingleton.getState());
    mySingleton.setState("state2");
}]);

spry.resolve(["MyFactory", "MySingleton", function Test2(myFactory, mySingleton) {
    console.log("#2 factory test: ", myFactory.getState());
    console.log("#2 singleton test: ", mySingleton.getState());
}]);

/**
 Outputs:
 #1 factory test:  state1
 #1 singleton test:  state1
 #2 factory test:  state1
 #2 singleton test:  state2
 */
```

## Non-node usage
In the browser just add the module and it will expose it self globally on the window object. If there is a conflict use the `.noConflict()` method, works like jQuery.

The module should work with AMD loaders too, but this needs to be tested.

# Enjoy! :-D
