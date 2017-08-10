var UNDEFINED, Directive = require('Directive'),
    _ = require('debit'),
    isUndefined = _.is.undefined,
    isObject = _.is.object,
    forEach = _.forEach,
    toArray = _.to.array,
    CHANGE_COUNTER = 'counter',
    CHANGE_TO = 'changeTo',
    CURRENT = 'current',
    PERIOD = '.',
    JSON = _.JSON,
    IMMUTABLES = 'immutables',
    BOOLEAN_FALSE = false,
    BOOLEAN_TRUE = true;
module.exports = Directive.extend('data', {
    constructor: function () {
        this.reset();
        return this;
    },
    set: function (key, value) {
        return (!this.is('frozen') && this.mutable(key)) ? this.overwrite(key, value) : BOOLEAN_FALSE;
    },
    immutable: function (key) {
        return !this.mutable(key);
    },
    mutable: function (key) {
        return !this[IMMUTABLES][key];
    },
    overwrite: function (key, value) {
        var data = this,
            current = data[CURRENT],
            currentValue = current[key];
        if (!isEqual(currentValue, value)) {
            if (isUndefined(value)) {
                return data.unset(key);
            } else {
                data.previous[key] = currentValue;
                data[CURRENT][key] = data.changes()[key] = value;
            }
            return BOOLEAN_TRUE;
        }
        return BOOLEAN_FALSE;
    },
    get: function (key) {
        var value = this[CURRENT][key];
        return isObject(value) ? JSON.clone(value) : value;
    },
    clone: function () {
        return clone(this[CURRENT]);
    },
    changes: function () {
        return this[CHANGE_TO];
    },
    changing: function (key) {
        return has(this.changes(), key);
    },
    unset: function (key) {
        var current = this[CURRENT],
            previous = current[key];
        this.previous[key] = previous;
        this.changes()[key] = UNDEFINED;
        return (delete current[key]) && previous !== UNDEFINED;
    },
    reset: function (hash) {
        this[CURRENT] = hash || {};
        this[IMMUTABLES] = {};
        return this.finish();
    },
    finish: function () {
        var data = this,
            changeto = data.changes();
        data[PREVIOUS] = {};
        data[CHANGE_TO] = {};
        data[CHANGE_COUNTER] = 0;
        return changeto;
    },
    increment: function () {
        ++this[CHANGE_COUNTER];
        return this;
    },
    decrement: function () {
        --this[CHANGE_COUNTER];
        return this;
    },
    static: function () {
        return !this[CHANGE_COUNTER];
    },
    reach: function (key) {
        var lastkey, previous, data = this,
            current = data[CURRENT];
        return forEach(toArray(key, PERIOD), function (key, index, path) {
            var no_more = index === path.length;
            lastkey = key;
            if (!no_more) {
                current = isObject(current[key]) ? current[key] : {};
            }
        }) && (isString(lastkey) ? UNDEFINED : current[lastkey]);
    },
    has: function (key) {
        return !isUndefined(this[CURRENT][key]);
    },
    forOwn: function (fn) {
        return forOwn(this[CURRENT], fn, this);
    }
});