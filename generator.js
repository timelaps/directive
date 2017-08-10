var toFunction = require('@timelaps/to/function');
var isString = require('@timelaps/is/string');
var throws = require('@timelaps/fn/throws');
var isFunction = require('@timelaps/is/function');
module.exports = function () {
    var base = {
        creation: {},
        destruction: {}
    };
    return {
        define: define,
        extend: extend,
        get: get
    };

    function get(name, base_) {
        var b = base_ || base;
        return b.creation[name];
    }

    function define(name, creation, destruction_, directives_) {
        var alreadyCreated, directives = directives_ || base,
            err = (!isString(name) && throws('directives must be registered with a string for a name')) || (!isFunction(creation)) && throws('directives must be registered with at least a create function'),
            newcreated = directives.creation[name] = (alreadyCreated = directives.creation[name]) || creation;
        directives.destruction[name] = directives.destruction[name] || destruction_;
        // returns whether or not that directive is new or not
        return newcreated === creation;
    }

    function extend(oldName, newName, handler_, destruction_, directives_) {
        var directives = directives_ || base,
            Destruction = destruction_ || returnsThird,
            Handler = handler_ || returnsThird,
            oldDirective = get(oldName, directives) || throws('directives must exist before they can be extended');
        return define(newName, function (instance, name, third) {
            return new Handler(instance, name, new directives.creation[oldName](instance, name, third));
        }, function (instance, name, third) {
            return Destruction(instance, name, directives.destruction[oldName](instance, name, third));
        });
    }
};