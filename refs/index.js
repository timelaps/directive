var REFS = 'Refs',
    Directive = require('..'),
    map = require('@timelaps/n/map'),
    toArray = require('@timelaps/to/array'),
    bindTo = require('@timelaps/fn/bind/to'),
    bindWith = require('@timelaps/fn/bind/with'),
    get = require('@timelaps/n/get/shallow'),
    set = require('@timelaps/n/set/shallow'),
    del = require('@timelaps/n/del/shallow'),
    remove = require('@timelaps/array/remove'),
    isUndefined = require('@timelaps/is/undefined'),
    forOwn = require('@timelaps/n/for/own'),
    first = require('@timelaps/fn/first'),
    Refs = module.exports = Directive.extend(REFS, {
        lifecycle: {
            created: function (supr) {
                supr();
                this.reset();
            }
        },
        methods: {
            drop: function (categories) {
                var refs = this,
                    register = refs.register;
                return forOwn(toArray(categories, ','), function (groupname) {
                    var group = register[groupname];
                    delete register[groupname];
                    if (group) {
                        group.reset();
                    }
                });
            },
            group: function (category, setter) {
                var current, refs = this,
                    register = refs.register,
                    previous = register[category];
                if (setter) {
                    current = register[category] = setter;
                } else if (!(current = register[category])) {
                    current = register[category] = refs.Pointer([]);
                }
                return current;
            },
            reset: function (registry) {
                var cached = this.register;
                this.register = registry || {};
                return cached;
            }
        }
    });
Refs.autoCreate = require('./auto-create');