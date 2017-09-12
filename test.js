var b = require('@timelaps/batterie');
b.capture(function () {
    var Directive = require('.');
    var stringify = require('@timelaps/json/stringify');
    b.addValidator('toBeDirective', Directive.isInstance, function (expectation) {
        return 'expected ' + b.stringify(expectation.a()) + ' to be instance of Directive';
    }, function (expectation) {
        return 'expected ' + b.stringify(expectation.a()) + ' not to be instance of Directive';
    });
    require('./tests');
});
b.finish().then(b.logger());