// var b = require('@timelaps/batterie');
// var Refs = require('.');
// b.describe('Refs', function () {
//     b.expect(Refs()).toBeDirective();
//     b.describe('methods', function () {
//         var refs;
//         b.beforeSync(function () {
//             refs = Refs();
//         });
//         b.describe('get', function () {
//             b.it('accesses internal values', function (t) {
//                 t.expect(refs.get('instances', 'custom')).toBeUndefined();
//             });
//             b.it('will run functions as reverse accessors', function (t) {
//                 var value = refs.get('instances', 'custom', function () {
//                     // didn't exist
//                     return 5;
//                 });
//                 t.expect(value).toBe(5);
//             });
//         });
//         b.describe('set', function () {
//             b.it('sets internal values', function (t) {
//                 t.expect(refs.get('instances', 'custom')).toBeUndefined();
//                 refs.set('instances', 'custom', true);
//                 t.expect(refs.get('instances', 'custom')).toBeTrue();
//             }, 2);
//         });
//         b.describe('swap', function () {
//             b.it('swaps internal values', function (t) {
//                 var p1 = {};
//                 var p2 = {};
//                 refs.set('instances', 'custom', p1);
//                 t.expect(refs.get('instances', 'custom')).toBe(p1);
//                 var result = refs.swap('instances', 'custom', p2);
//                 t.expect(result).toBe(p1);
//                 t.expect(refs.get('instances', 'custom')).toBe(p2);
//             }, 3);
//         });
//         b.describe('group', function () {
//             // b.it('')
//         });
//         b.describe('dropGroup', function () {
//             //
//         });
//         b.describe('dropGroups', function () {
//             //
//         });
//         b.describe('drop', function () {
//             //
//         });
//         b.describe('reset', function () {
//             //
//         });
//     });
//     b.describe('Refs.Group', function () {
//         b.describe('methods', function () {
//             b.describe('pointer', function () {
//                 b.it('curries the group and id for longstanding use', function (t) {
//                     var pointer = refs.group('instance').pointer('custom');
//                     var p1 = {};
//                     var p2 = {};
//                     t.expect(pointer).toBeObject();
//                     t.expect(pointer.get()).toBeUndefined();
//                     refs.set('instance', 'custom', p1);
//                     t.expect(pointer.get()).toBe(p1);
//                     pointer.set(p2);
//                     t.expect(pointer.get()).toBe(p2);
//                     t.expect(refs.get('instance', 'custom')).toBe(p2);
//                 }, 5);
//             });
//         });
//     });
// });