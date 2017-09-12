var b = require('@timelaps/batterie');
var Directive = require('.');
var isInstance = require('@timelaps/is/instance');
b.describe('directive', function () {
    b.expect(Directive).toBeFunction();
    b.it('is a class', function (t) {
        t.expect(Directive()).toBeInstance(Directive.constructor);
    });
    b.describe('methods', function () {
        b.describe('directive', function () {
            b.it('will err if accessing a directive that does not exist', function (t) {
                var d = Directive();
                t.expect(function () {
                    d.directive('Namespace');
                }).toThrow();
            });
            b.it('it can create subclasses below it', function (t) {
                var d = Directive();
                d.directives.Namespace = function Namespace() {
                    // calls the set function with new
                    if (!isInstance(this, Namespace)) {
                        throw true;
                    }
                };
                t.expect(d.directive('Namespace')).toBeObject();
            });
            b.it('can destroy directives too', function (t) {
                var d = Directive();
                var directive = d.directive('Directive');
                t.expect(directive.target).toBe(d);
                directive.destroy();
                t.expect(directive.target).toBeUndefined();
                t.expect(directive.targetKey).toBeUndefined();
            }, 3);
        });
        b.describe('getDirectiveClass', function () {
            b.it('can get the class that would be used to create the directive', function (t) {
                var d = Directive();
                t.expect(d.getDirectiveClass('Directive')).toBe(Directive.constructor);
                d.directives.Directive = Classy;
                t.expect(d.getDirectiveClass('Directive')).toBe(Classy);
                delete d.directives.Directive;
                t.expect(d.getDirectiveClass('Directive')).toBe(Directive.constructor);

                function Classy() {}
            }, 3);
        });
        b.describe('getDirective', function () {
            b.it('simply accesses any directive instances instead of creating one', function (t) {
                var d = Directive();
                var directive = d.getDirective('Directive');
                t.expect(directive).toBeUndefined();
                // later
                directive = d.directive('Directive');
                t.expect(directive).notToBeUndefined();
            }, 2);
        });
    });
});