'use strict';

/**
 * @file 小工具
 * @author leon <ludafa@outlook.com>
 */

/* eslint-disable fecs-no-require */

var relative = require('require-path-relative');
var path = require('path');

var _require = require('./stringify'),
    getInnerHTML = _require.getInnerHTML,
    getOuterHTML = _require.getOuterHTML,
    getText = _require.getText;

function translateModulePath(currentModulePath, originPath, targetPath) {

    var exclamationIndex = currentModulePath.lastIndexOf('!');
    var loaderString = currentModulePath.slice(0, exclamationIndex + 1);
    var modulePath = currentModulePath.slice(exclamationIndex + 1);
    var absolutePath = path.resolve(path.dirname(originPath), modulePath);
    var newModulePath = relative(path.dirname(targetPath), absolutePath);

    return '' + loaderString + newModulePath;
}

function isRelativeModulePath(modulePath) {
    var exclamationIndex = modulePath.lastIndexOf('!');
    var result = modulePath.charAt(exclamationIndex + 1) === '.';
    return result;
}

module.exports = {
    translateModulePath: translateModulePath,
    isRelativeModulePath: isRelativeModulePath,
    getInnerHTML: getInnerHTML,
    getOuterHTML: getOuterHTML,
    getText: getText
};
//# sourceMappingURL=index.js.map
