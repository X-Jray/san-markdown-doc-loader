'use strict';

/**
 * @file parser
 * @author leon <ludafa@outlook.com>
 */

/* eslint-disable fecs-no-require, fecs-prefer-destructure */

var _require = require('htmlparser2'),
    Parser = _require.Parser,
    DomHandler = _require.DomHandler;

function parse(code) {
    return new Promise(function (resolve, reject) {

        var parseHandler = new DomHandler(function (error, dom) {

            if (error) {
                reject(error);
                return;
            }

            resolve(dom);
        }, {
            normalizeWhitespace: false
        });

        var parser = new Parser(parseHandler, {
            // 保留属性名的大小写
            lowerCaseAttributeNames: false,
            // 打开自定义标签的自闭合
            recognizeSelfClosing: true
        });

        parser.write(code);
        parser.end();
    });
}

module.exports = {
    parse: parse
};
//# sourceMappingURL=parser.js.map
