'use strict';

/**
 * @file cache
 * @author leon <ludafa@outlook.com>
 */

/* eslint-disable fecs-no-require */

var path = require('path');
var mkdirp = require('mkdirp');
var fs = require('fs');

var root = path.join(__dirname, '../.cache');

function createCacheRootDir() {
    mkdirp.sync(root);
}

exports.getCacheFilePath = function (resourcePath) {
    var basename = path.basename(resourcePath);
    var cacheFilePath = path.join(root, basename + '.san');
    return cacheFilePath;
};

exports.save = function (filePath, content) {
    createCacheRootDir();
    fs.writeFileSync(filePath, content, 'utf8');
};
//# sourceMappingURL=cache.js.map
