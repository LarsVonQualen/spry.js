# spry.js
Tiny Javascript dependency injection framework, that uses the same syntax as AngularJS.

## It's very simple to use....
The api consists of three different methods.

```javascript
{
    register: {
        singleton: function(name, dependencies) {},
        factory: function (name, dependencies) {}
    },
    resolve: function (dependencies) {}
}
```

### Singleton
If a singleton is injected it will always be the same instance.

### Factory
Here you register a factory method, that essentially will be resolved every time it is injected.

### Resolve
Similiar to a AngularJS controller except that it doesn't take a name.


## Complete Usage Example
Here is a complete example. Notice that the singleton is dependent on the factory, but it is declared before the factory, AND IT WORKS :-D

```javascript
var di = require("./di.js");

di.register.singleton("MySingleton", ["MyFactory", function MySingleton(myFactory) {
    return myFactory;
}]);

di.register.factory("MyFactory", [function MyFactory() {
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

di.resolve(["MyFactory", "MySingleton", function Test1(myFactory, mySingleton) {
    console.log("#1 factory test: ", myFactory.getState());
    myFactory.setState("state2");

    console.log("#1 singleton test: ", mySingleton.getState());
    mySingleton.setState("state2");
}]);

di.resolve(["MyFactory", "MySingleton", function Test2(myFactory, mySingleton) {
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

# Enjoy! :-D
