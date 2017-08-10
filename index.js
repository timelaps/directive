var DIRECTIVE = 'Directive',
    STATUS = 'Status',
    Classy = require('@timelaps/classy'),
    toFunction = require('@timelaps/to/function'),
    throws = require('@timelaps/fn/throws'),
    isNil = require('@timelaps/is/nil'),
    returnsObject = require('@timelaps/returns/object'),
    scope = require('./global'),
    /**
     * Directives are a powerful way to organize your code, logic, and state of the objects you create during an app's lifespan. Directives allow for the ability to replace large chunks of internal code of classes and completely change an object's behavior. Directives are one of the more basic objects Odette provides
     * @class Directive
     */
    Directive = Classy.extend('Directive',
        /**
         * @lends Directive.prototype
         */
        {
            lifecycle: {
                created: function (supr, arg) {
                    if (!isNil(arg)) {
                        this.target = arg;
                    }
                    supr(arg);
                }
            },
            methods: {
                getDirective: basicSingleArgumentPassthrough(getDirective),
                directive: basicSingleArgumentPassthrough(createDirective),
                destroyDirective: basicSingleArgumentPassthrough(destroyDirective),
                getDirectiveClass: basicSingleArgumentPassthrough(getDirectiveClass)
            }
        });
Directive.parody = parody;
Directive.checkParody = checkParody;
Directive.create = createDirective;
Directive.destroy = destroyDirective;
Directive.get = getDirective;
Directive.getClass = getDirectiveClass;

function basicSingleArgumentPassthrough(method) {
    return function (key) {
        return method(this, key);
    };
}

function parody(directive, method) {
    return function (one, two, three) {
        return this.directive(directive)[method](one, two, three);
    };
}

function getAssociatedHash(origin) {
    return origin.directiveInstances;
}

function getDirective(origin, name) {
    return getAssociatedHash(origin)[name];
}

function checkParody(name, method, defaultValue) {
    var defaultFunction = toFunction(defaultValue);
    return function (one, two, three, four, five, six) {
        var direct, item = this;
        return (direct = getDirective(item, name)) ? direct[method](one, two, three, four, five, six) : defaultFunction(item, method);
    };
}

function returnsThird(one, two, three) {
    return three;
}

function destroyDirective(origin, name) {
    var directive, result = null;
    if ((directive = getDirective(origin, name)) && directive.mark('destroying')) {
        result = (globalDirectives.destruction[name] || returnsNull)(getDirective(origin, name), origin, name);
        delete origin[name];
    }
    return result;
}

function createDirective(origin, name) {
    var Class, handler, directive,
        directiveInstances = origin.directiveInstances;
    if (!directiveInstances) {
        directiveInstances = origin.directiveInstances = {};
    }
    if ((directive = directiveInstances[name])) {
        return directive;
    }
    Class = origin.getDirectiveClass(name);
    handler = directiveInstances[name] = new Class(origin, name);
    return handler;
}

function directiveAccessError() {
    throws({
        message: 'Directive must be defined before it can be created.'
    });
}

function getDirectiveClass(origin, name) {
    return origin['directive.' + name] || scope.get(name) || directiveAccessError();
}