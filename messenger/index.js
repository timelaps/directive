var Directive = require('..'),
    Promise = require('@timelaps/promise/sync'),
    intendedApi = require('@timelaps/fn/intended/api'),
    isThennable = require('@timelaps/is/thennable'),
    toFunction = require('@timelaps/to/function'),
    bindTo = require('@timelaps/fn/bind/to'),
    Messenger = module.exports = Directive.extend('Messenger', {
        lifecycle: {
            created: function (supr) {
                supr();
                var messenger = this,
                    responders = {},
                    callers = {};
                messenger.call = function (key, arg) {
                    var method;
                    if (callers) {
                        return (method = callers[key]) && method(arg);
                    }
                };
                messenger.request = function (key, arg) {
                    var method;
                    if (responders) {
                        return ((method = responders[key])) ? method(arg) : Promise.reject();
                    }
                };
                messenger.answer = intendedApi(function (key, handler) {
                    if (callers) {
                        callers[key] = toFunction(handler);
                    }
                });
                messenger.respond = intendedApi(function (key, handler_) {
                    var handler = toFunction(handler_);
                    return responders && (responders[key] = function () {
                        var result;
                        return isThennable(result = handler.apply(this, arguments)) ? result : Promise.resolve(result);
                    });
                });
                messenger.reset = function () {
                    responders = callers = null;
                };
            },
            destroyed: function (supr) {
                supr();
                this.reset();
            }
        }
    });