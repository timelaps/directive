var b = require('@timelaps/batterie');
var Messenger = require('.');
var Promise = require('@timelaps/promise/sync');
b.describe('Messenger', function () {
    b.expect(Messenger).toBeFunction();
    b.describe('methods', function () {
        b.describe('call and answer', function () {
            b.it('calls the function that was set at the corresponding key', function (t) {
                var m = Messenger();
                m.answer({
                    adds1: function (number) {
                        return number + 1;
                    }
                });
                t.expect(m.call('adds1', 5)).toBe(6);
            });
            b.it('will return the item if anything but a function is passed', function (t) {
                var m = Messenger();
                m.answer({
                    constantvalue: 5
                });
                t.expect(m.call('constantvalue')).toBe(5);
            });
        });
        b.describe('request and respond', function () {
            b.it('returns the result wrapped in a promise', function (t) {
                var m = Messenger();
                m.respond({
                    constantvalue: 5
                });
                var p = m.request('constantvalue');
                t.expect(p).toBeThennable();
                p.then(function (constantvalue) {
                    t.expect(constantvalue).toBe(5);
                });
            }, 2);
            b.resolve('can also execute functions', function (t) {
                var m = Messenger();
                m.respond({
                    constantlater: function () {
                        return Promise(function (success) {
                            setTimeout(function () {
                                success(6);
                            });
                        });
                    }
                });
                var p = m.request('constantlater');
                t.expect(p).toBeThennable();
                return p.then(function (secret) {
                    t.expect(secret).toBe(6);
                });
            }, 2);
        });
        b.describe('reset', function () {
            b.expect(Messenger.fn.reset).toBeUndefined();
            b.it('disallows any function from being called', function (t) {
                var m = Messenger();
                m.answer('constant', 6);
                t.expect(m.call('constant')).toBe(6);
                m.reset();
                t.expect(m.call('constant')).toBeUndefined();
            }, 2);
        });
    });
});