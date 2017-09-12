// var b = require('@timelaps/batterie');
// var Logic = require('.');
// var isObject = require('@timelaps/is/object');
// b.describe('logic', function () {
//     var model, counter;
//     b.it('will apply handlers when all of the conditions are met', function (t) {
//         var logic = Logic();
//         var counter = 0;
//         logic.when('awe').isGreaterThan(1) //
//             .and('awe').isLessThan(Infinity) //
//             .then(function (e) {
//                 t.expect(isObject(e)).toBe(true);
//                 counter--;
//             }) //
//             .otherwise(function (e) {
//                 t.expect(isObject(e)).toBe(true);
//                 counter++;
//             });
//         logic.apply({
//             awe: Infinity
//         });
//         t.expect(counter).toBe(1);
//         logic.apply({
//             awe: 4
//         });
//         t.expect(counter).toBe(0);
//     }, 4);
//     b.it('will not apply handlers until it is told to or an event automatically triggers it', function (t) {
//         var logic = Logic();
//         var counter = 0;
//         logic.when('this').is(true) //
//             .and('that').is(false) //
//             .then(function (e) {
//                 t.expect(isObject(e)).toBeTrue();
//                 counter++;
//             }).otherwise(function (e) {
//                 t.expect(isObject(e)).toBeTrue();
//                 counter++;
//             });
//         t.expect(counter).toBe(0);
//         logic.apply({
//             this: true
//         });
//         t.expect(counter).toBe(1);
//         logic.apply({
//             this: true
//         });
//         t.expect(counter).toBe(1);
//         logic.apply({
//             this: true,
//             that: false
//         });
//         t.expect(counter).toBe(2);
//     }, 6);
// });