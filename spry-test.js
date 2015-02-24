var spry = require("./spry.js");
var spry1 = require("./spry.js");

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

try {
    spry.resolve(["InvalidDependency", function shouldThrow() {

    }]);
} catch (e) {
    console.log(e);
}

try {
    spry.register.singleton("ThisIsNotAFunction", [{}]);

    spry.resolve(["ThisIsNotAFunction", function shouldThrow() {

    }])
} catch (e) {
    console.log(e);
}
