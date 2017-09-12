var PROPAGATION = 'propagation',
    UPCASED_STOPPED = 'Stopped',
    PASSED_DATA = 'passedData',
    PARENT = 'parent',
    DEFAULT_PREVENTED = 'defaultPrevented',
    PROPAGATION_HALTED = PROPAGATION + 'Halted',
    PROPAGATION_STOPPED = PROPAGATION + UPCASED_STOPPED,
    event_incrementer = 0,
    listeningCounter = 0,
    HANDLERS = 'handlers',
    COLON = ':',
    Directive = require('..'),
    throws = require('@timelaps/fn/throws'),
    noop = require('@timelaps/fn/noop'),
    returnsTrue = require('@timelaps/returns/true'),
    toFunction = require('@timelaps/to/function'),
    bindTo = require('@timelaps/fn/bind/to'),
    forOwn = require('@timelaps/n/for/own'),
    result = require('@timelaps/fn/result'),
    removeAt = require('@timelaps/array/remove/at'),
    last = require('@timelaps/n/last'),
    forEach = require('@timelaps/hacks/for/each'),
    returnsFirst = require('@timelaps/returns/first'),
    del = require('@timelaps/n/del/shallow'),
    toBoolean = require('@timelaps/hacks/to-boolean'),
    wraptry = require('@timelaps/fn/wrap-try'),
    forEachEnd = require('@timelaps/n/for/each/end');
module.exports = Directive.extend('Events', {
    lifecycle: {
        created: function (supr, target) {
            var directive = this;
            supr();
            directive.target = target;
            listeningCounter += 1;
            directive.listenId = 'l' + listeningCounter;
            directive.handlers = {};
            directive.listeningTo = {};
            directive.running = {};
            directive.queued = {};
            directive.stack = [];
            directive.removeQueue = [];
            return directive;
        }
    },
    methods: {
        create: returnsFirst,
        attach: function (name, eventObject, modifier) {
            var list, eventsDirective = this,
                handlers = eventsDirective[HANDLERS];
            event_incrementer += 1;
            eventObject.id = event_incrementer;
            eventObject.valueOf = returnsId;
            eventObject.context = eventObject.context || eventObject.origin;
            toFunction(modifier)(eventsDirective, eventObject);
            eventObject.fn = bindTo(eventObject.fn || eventObject.handler, eventObject.context);
            // attach the id to the bound function
            // because that instance is private
            list = handlers[name] = eventsDirective.handlerQueue(name);
            // attaching name so list can remove itself from hash
            // attached so event can remove itself
            eventObject.list = list;
            eventsDirective.add(list, eventObject);
        },
        make: function (name, handler, origin) {
            return {
                disabled: false,
                namespace: name.split(COLON),
                name: name,
                handler: handler,
                origin: origin
            };
        },
        seekAndDestroy: function (list, handler, context) {
            var obj, events = this,
                array = list.items,
                i = array.length - 1;
            for (; i >= 0; i--) {
                obj = array[i];
                if (!obj.disabled && (!handler || obj.handler === handler) && (!context || obj.context === context)) {
                    events.detach(obj, i);
                }
            }
        },
        nextBubble: function (start) {
            return result(start, PARENT);
        },
        bubble: function (evnt, data, options) {
            var previous, events = this,
                start = events.target,
                list = [start],
                next = start;
            while (next) {
                previous = next;
                next = events.nextBubble(previous, list);
                if (next) {
                    list.push(next);
                }
                if (previous === next) {
                    throws('bubbling discerners must return a different object each time it is run');
                }
            }
            forEach(list, function (target) {
                target[DISPATCH_EVENT](evnt, data, options);
            });
            return start;
        },
        add: function (list, evnt) {
            list.items.push(evnt);
        },
        remove: function (list, evnt, index) {
            removeAt(list.items, evnt, index);
        },
        detachCurrent: function () {
            return this.detach(last(this[STACK]));
        },
        detach: function (evnt, index) {
            var listeningTo, events = this,
                listening = evnt.listening,
                list = evnt.list,
                disabled = evnt.disabled = true;
            if (evnt.removed) {
                return true;
            }
            evnt.removed = true;
            events.remove(list, evnt, index);
            // disconnect it from the list above it
            // we don't care about deleting here
            // because no one should have access to it.
            del(evnt, 'list');
            events.wipe(list);
            // check to see if it was a listening type
            if (listening) {
                // if it was then decrement it
                listening.count--;
                // if that is the extent of the listening events, then detach it completely
                if (!listening.count) {
                    del(listening.listeningTo, listening[TALKER_ID]);
                }
            }
            return true;
        },
        wipe: function (list) {
            if (list.items.length) {
                return false;
            }
            this.scrub(list);
            return true;
        },
        scrub: function (list) {
            list.scrubbed = true;
            del(this[HANDLERS], list.name);
        },
        reset: function () {
            return forOwn(this[HANDLERS], bindTo(this.scrub, this));
        },
        queue: function (handler, evnt) {
            return this.stack.push(handler);
        },
        unQueue: function (handler, evnt) {
            return this.stack.pop();
        },
        has: function (key) {
            var q = this.handlerQueue(key);
            return !!q.length;
        },
        handlerQueue: function (name) {
            return this[HANDLERS][name] || {
                name: name,
                items: []
            };
        },
        dispatch: function (name, evnt, options) {
            var subset, stopped, stack_length, items, events = this,
                list = events.handlerQueue(name),
                running = events.running;
            // make sure setup is proper
            if (running[name]) {
                throws('cannot stack events coming from the same object');
            } else {
                items = list.items;
                if (!items.length) {
                    return;
                }
                subset = events.subset(name, items, options);
                if (!subset.length) {
                    return;
                }
                running[name] = true;
                events.execute(name, evnt, subset);
                // can't double up, so lets just use false
                running[name] = false;
                events.finished(evnt);
            }
        },
        // hook
        finished: noop,
        subset: function (name, list) {
            return [list.slice(0)];
        },
        execute: function (name, evnt_, subset) {
            var isPropagationStopped, isPropagationStoppedImmediately,
                events = this,
                evnt = evnt_ || {};
            evnt.stopPropagation = stopPropagation;
            evnt.stopPropagationImmediately = stopPropagationImmediately;
            forEachEnd(subset, function (block) {
                forEachEnd(block, function (item) {
                    item.count += 1;
                    if (item.limit <= item.count) {
                        removeEvent(events, key, item);
                    }
                    if (item.disabled || !events.queue(item, evnt)) {
                        return;
                    }
                    wraptry(item.fn.bind(item.context, evnt));
                    events.unQueue(item, evnt);
                    return isPropagationStoppedImmediately;
                });
                return isPropagationStopped;
            });

            function stopPropagation() {
                isPropagationStopped = evnt.isPropagationStopped = true;
            }

            function stopPropagationImmediately() {
                isPropagationStoppedImmediately = evnt.isPropagationStoppedImmediately = true;
                evnt.stopPropagation();
            }
        }
    }
});

function returnsId() {
    return this.id;
}