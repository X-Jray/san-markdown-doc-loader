'use strict';

/**
 * @file SanComponentCodeBlock
 * @author leon <ludafa@outlook.com>
 */

/* eslint-disable fecs-no-require */

var markdownitfence = require('./fence');
var _ = require('lodash');

var COMPONENT_NAME = 'san-code-block';

function resolveFenceData(fence) {

    fence = fence.trim();

    var prefix = fence.slice(0, 3);
    var title = fence.slice(4);

    return {
        prefix: prefix,
        title: title
    };
}

module.exports = function (md) {

    return markdownitfence(md, COMPONENT_NAME, {
        validate: function validate(params) {
            var _resolveFenceData = resolveFenceData(params),
                prefix = _resolveFenceData.prefix,
                title = _resolveFenceData.title;

            return prefix === 'san' && title;
        },
        render: function render(tokens, index, options, env, self) {
            var _tokens$index = tokens[index],
                info = _tokens$index.info,
                content = _tokens$index.content;

            var _resolveFenceData2 = resolveFenceData(info),
                title = _resolveFenceData2.title;

            var escapedContent = _.escape(content).replace(/{{/g, '&#x7B;&#x7B;').replace(/}}/g, '&#x7D;&#x7D;');

            return '\n<san-code-block title="' + title + '" content="' + escapedContent + '">\n    ' + content + '\n</san-code-block>\n';
        }
    });
};
//# sourceMappingURL=SanCodeBlock.js.map
