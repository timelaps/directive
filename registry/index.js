var REGISTRY = 'Registry',
    Directive = require('..'),
    map = require('@timelaps/n/map'),
    toArray = require('@timelaps/to/array'),
    bindTo = require('@timelaps/fn/bind/to'),
    get = require('@timelaps/n/get/shallow'),
    set = require('@timelaps/n/set/shallow'),
    remove = require('@timelaps/array/remove'),
    isUndefined = require('@timelaps/is/undefined'),
    mapValues = require('@timelaps/n/map/values'),
    Registry = module.exports = Directive.extend(REGISTRY, {
        lifecycle: {
            created: function (supr, arg) {
                supr(arg);
                this.reset();
            }
        },
        methods: {
            get: function (category, id, method) {
                var registry = this,
                    cat = registry.register[category],
                    item = get(cat, id);
                if (isUndefined(item) && method) {
                    item = method(registry, category, id);
                    registry.keep(category, id, item);
                }
                return item;
            },
            keep: function (category, id, value) {
                var register = this.register,
                    cat = register[category] = register[category] || {};
                if (isUndefined(value)) {
                    remove(cat, id);
                } else {
                    set(cat, id, value);
                }
                return this;
            },
            dropGroup: function (category) {
                return this.group(category, {});
            },
            dropGroups: function (categories) {
                return mapValues(toArray(categories), bindTo(this.dropGroup, this));
            },
            group: function (category, setter) {
                var register = this.register,
                    previous = register[category];
                register[category] = setter || previous || {};
                return previous;
            },
            swap: function (category, id, value) {
                var cached = this.get(category, id);
                this.keep(category, id, value);
                return cached;
            },
            drop: function (category, id) {
                return this.swap(category, id);
            },
            reset: function (registry) {
                var cached = this.register;
                this.register = registry || {};
                return cached;
            }
        }
    });
Registry.autoCreate = require('Registry/auto-create');