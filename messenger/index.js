var Directive = require('..'),
    Promise = require('@timelaps/promise'),
    intendedApi = require('@timelaps/fn/intended/api'),
    isThennable = require('@timelaps/is/thennable'),
    toFunction = require('@timelaps/to/function'),
    bindTo = require('@timelaps/fn/bind/to');
module.exports = Directive.factory('Messenger', function (supr, arg) {
    supr(arg);
    var messenger = this,
        responders = {},
        callers = {};
    messenger.call = function (key, arg) {
        return callers && callers[key] && callers[key](arg);
    };
    messenger.request = function (key, arg) {
        return (responders && responders[key]) ? responders[key](arg) : Promise.reject();
    };
    messenger.answer = intendedApi(function (key, handler) {
        if (!callers) {
            return;
        }
        callers[key] = bindTo(toFunction(handler), null);
    });
    messenger.respond = intendedApi(function (key, handler) {
        return responders && (responders[key] = function (arg) {
            var result;
            return isThennable(result = handler()) ? result : Promise.resolve(result);
        });
    });
    messenger.destroy = function () {
        Messenger.fn.destroy.apply(this, arguments);
        responders = callers = null;
    };
});