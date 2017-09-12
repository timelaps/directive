module.exports = function autoCreate(category, item, method) {
    return function autoCreator() {
        return this.directive('Registry').get(category, item, method);
    };
};