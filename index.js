var DIRECTIVE = 'Directive',
    STATUS = 'Status',
    Classy = require('@timelaps/classy'),
    toFunction = require('@timelaps/to/function'),
    throws = require('@timelaps/fn/throws'),
    isNil = require('@timelaps/is/nil'),
    returnsObject = require('@timelaps/returns/object'),
    scope = require('./global'),
    create = require('@timelaps/object/create'),
    assign = require('@timelaps/object/assign'),
    /**
     * Directives are a powerful way to organize your code, logic, and state of the objects you create during an app's lifespan. Directives allow for the ability to replace large chunks of internal code of classes and completely change an object's behavior. Directives are one of the more basic objects Odette provides
     * @class Directive
     */
    Directive = module.exports = Classy.extend('Directive', {
        lifecycle: {
            created: function (supr, origin, name) {
                var directive = this;
                if (origin) {
                    directive.target = origin;
                    origin.directiveInstances[name] = directive;
                    directive.targetKey = name;
                }
                supr(origin);
            },
            destroyed: function (supr, arg) {
                var origin = this.target;
                supr(arg);
                if (origin) {
                    delete this.target;
                    delete origin.directiveInstances[this.targetKey];
                    delete this.targetKey;
                }
            }
        },
        /**
         * @lends Directive.prototype
         */
        methods: {
            getDirectiveClass: basicSingleArgumentPassthrough(getDirectiveClass),
            getDirective: basicSingleArgumentPassthrough(getDirective),
            directive: basicSingleArgumentPassthrough(createDirective),
            createDirective: function (name) {
                var origin = this,
                    Class = origin.getDirectiveClass(name);
                return new Class([origin, name]);
            }
        }
    });
reextend(Directive);
Directive.fn.directives = create({
    Directive: Directive.constructor
});

function reextend(Directive) {
    var extend = Directive.extend;
    Directive.extend = Directive.constructor.extend = nuExtend;
    return Directive;

    function nuExtend(name) {
        var result = reextend(extend.apply(this, arguments));
        result.fn.directives = assign(create(this.fn.directives), result.extensionOptions.directives || {});
        return result;
    }
}
Directive.access = access;
Directive.parody = parody;
Directive.checkParody = checkParody;
Directive.create = createDirective;
Directive.get = getDirective;
Directive.getClass = getDirectiveClass;

function access(key) {
    return function () {
        return this.directive(key);
    };
}

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
    var instances = origin.directiveInstances;
    if (!instances) {
        instances = origin.directiveInstances = {};
    }
    return instances;
}

function getDirective(origin, name) {
    var hash = getAssociatedHash(origin);
    return hash && hash[name];
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

function destroyDirective(origin, name, opts) {
    var directive, result = null;
    if ((directive = getDirective(origin, name))) {
        result = directive.destroy(opts);
        delete origin[name];
    }
    return result;
}

function createDirective(origin, name) {
    var Class, instance, directive;
    if ((directive = getDirective(origin, name))) {
        return directive;
    }
    instance = origin.directiveInstances[name] = origin.createDirective(name);
    return instance;
}

function getDirectiveClass(origin, name) {
    return origin.directives[name];
}