var b = require('@timelaps/batterie');
var Events = require('.');
b.describe('Events', function () {
    b.expect(Events).toBeFunction();
    b.expect(Events()).toBeInstance(Events.constructor);
    b.describe('methods', function () {
        b.describe('subset', function () {
            var events = Events();
            b.expect(events.subset).toBeFunction();
            b.expect(events.subset('', [])).toBeArray();
            b.expect(events.subset('', [])[0]).toBeEmptyArray();
            b.it('creates a copy of the list to be executed', function (t) {
                var array = [1];
                var subset = events.subset('', array);
                t.expect(subset).toEqual([array]);
                t.expect(subset[0]).notToBe(array);
            }, 2);
        });
        b.describe('attach', function () {
            b.it('adds event listeners', function (t) {
                var events = Events();
                var that = this;
                events.attach('eventname', {
                    context: this,
                    fn: function () {
                        t.expect(this).toBe(that);
                    }
                });
                events.dispatch('eventname');
            });
            b.it('can set the called context', function (t) {
                var events = Events();
                events.attach('eventname', {
                    context: events,
                    fn: function () {
                        t.expect(this).toBe(events);
                    }
                });
                events.dispatch('eventname');
            });
            b.it('can pass along an event object', function (t) {
                var events = Events();
                var a = {};
                events.attach('eventname', {
                    context: events,
                    fn: function (e) {
                        t.expect(e).toBe(a);
                    }
                });
                events.dispatch('eventname', a);
            });
            b.it('will still pass along an event object', function (t) {
                var events = Events();
                events.attach('eventname', {
                    context: events,
                    fn: function (e) {
                        t.expect(e).toBeObject();
                    }
                });
                events.dispatch('eventname');
            });
            b.it('can fire off many of these susequently', function (t) {
                var events = Events();
                var counter = 0;
                events.attach('eventname', {
                    fn: function (e) {
                        counter += 1;
                    }
                });
                events.attach('eventname', {
                    fn: function (e) {
                        counter += 1;
                    }
                });
                events.dispatch('eventname');
                t.expect(counter).toBe(2);
            });
            b.describe('will automatically attach a few functions', function (t) {
                b.it('stopPropagationImmediately', function (t) {
                    var events = Events();
                    var counter = 0;
                    events.attach('eventname', {
                        fn: function (e) {
                            counter += 1;
                            e.stopPropagationImmediately();
                        }
                    });
                    events.attach('eventname', {
                        fn: function (e) {
                            counter += 1;
                        }
                    });
                    events.dispatch('eventname');
                    t.expect(counter).toBe(1);
                });
                b.it('stopPropagation', function (t) {
                    var events = Events();
                    var counter = 0;
                    events.subset = function (name, list) {
                        var chunk = list.slice(0, 2);
                        var second = list.slice(2);
                        return [chunk, second];
                    };
                    events.attach('eventname', {
                        fn: function (e) {
                            counter += 1;
                            e.stopPropagation();
                        }
                    });
                    events.attach('eventname', {
                        fn: function (e) {
                            counter += 1;
                        }
                    });
                    events.attach('eventname', {
                        fn: function (e) {
                            counter += 1;
                        }
                    });
                    events.dispatch('eventname');
                    t.expect(counter).toBe(2);
                });
            });
        });
        b.describe('detach', function () {
            b.it('can have event listeners removed', function (t) {
                var events = Events();
                events.attach('eventname', {
                    fn: fn
                });
                // we need the same pointer
                events.detach(events.handlers.eventname.items[0]);
                events.dispatch('eventname');
                t.expect(events).toBeObject();

                function fn() {
                    t.expect(true).toBeFalse();
                }
            });
        });
    });
});