'use strict';

/**
 * @file san-markdown-loader
 * @author leon <ludafa@outlook.com>
 */

/* eslint-disable fecs-camelcase, prefer-rest-params, fecs-prefer-destructure, fecs-no-require */

var loaderUtils = require('loader-utils');
var generator = require('./generator');
var markdown = require('./markdown');
var path = require('path');
var parser = require('./parser');

module.exports = function (source) {
    var _this = this;

    var callback = this.async();

    var options = Object.assign(loaderUtils.getOptions(this) || {}, this.sanMarkdown, this.options.sanMarkdown);

    var code = markdown(options).render(source);

    parser.parse(code).then(function (ast) {
        var _generator$generate = generator.generate({
            source: source,
            code: code,
            ast: ast,
            filePath: _this.resourcePath,
            cacheDir: path.join(__dirname, '../.cache')
        }),
            filePath = _generator$generate.filePath;

        var moduleName = loaderUtils.stringifyRequest(_this, filePath).slice(1, -1);

        callback(null, 'module.exports = require(\'!!san-loader!' + moduleName + '\');');
    }, callback);
};
//# sourceMappingURL=index.js.map
