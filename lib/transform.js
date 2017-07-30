'use strict';

/**
 * @file transform
 * @author leon<ludafa@outlook.com>
 */

/* eslint-disable fecs-no-require */

var babylon = require('babylon');
var traverse = require('babel-traverse').default;
var gen = require('babel-generator').default;
var util = require('./util');

function normalizeDependences(options) {
    var code = options.code,
        targetPath = options.targetPath,
        originPath = options.originPath;


    var ast = babylon.parse(code, {
        sourceType: 'module'
    });

    traverse(ast, {
        ImportDeclaration: {
            enter: function enter(_ref) {
                var node = _ref.node;

                // 将 cache 文件中的依赖路径调整正确
                var source = node.source;
                if (util.isRelativeModulePath(source.value)) {
                    source.value = util.translateModulePath(source.value, originPath, targetPath);
                }
            }
        }
    });

    var result = gen(ast, {
        retainLines: false,
        compact: 'auto',
        concise: false,
        quotes: 'single'
    }, code);

    return result.code;
}

module.exports = {
    normalizeDependences: normalizeDependences
};
//# sourceMappingURL=transform.js.map
