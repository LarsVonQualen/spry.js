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
