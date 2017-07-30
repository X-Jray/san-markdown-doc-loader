'use strict';

/**
 * @file markdown
 * @author leon <ludafa@outlook.com>
 */

/* eslint-disable fecs-camelcase, prefer-rest-params, fecs-prefer-destructure, fecs-no-require */

var markdown = require('markdown-it');
var hljs = require('highlight.js');
var MarkdownItSanCodeBlock = require('./markdown-it-plugin/SanCodeBlock');

/**
 * 转码 {{}}
 *
 * `{{ }}` => `<span>{{</span> <span>}}</span>`
 *
 * @param  {string} str 源码
 * @return {string}
 */
function replaceDelimiters(str) {
    return str.replace(/({{|}})/g, '<span>$1</span>');
}

function renderHighlight(str, lang) {

    if (!(lang && hljs.getLanguage(lang))) {
        return '';
    }

    try {
        return replaceDelimiters(hljs.highlight(lang, str, true).value);
    } catch (err) {}
}

module.exports = function (options) {

    options = Object.assign({
        preset: 'default',
        html: true,
        highlight: renderHighlight
    }, options);

    var preset = options.preset;
    var plugins = options.use;

    delete options.preset;
    delete options.use;

    var md = markdown(preset, options);

    if (plugins && plugins.length) {
        plugins.forEach(function (plugin) {
            if (Array.isArray(plugin)) {
                md.use.apply(md, plugin);
            } else {
                md.use(plugin);
            }
        });
    }

    md.use(MarkdownItSanCodeBlock);

    var codeInlineRender = md.renderer.rules.code_inline;
    md.renderer.rules.code_inline = function () {
        return replaceDelimiters(codeInlineRender.apply(this, arguments));
    };
    return md;
};
//# sourceMappingURL=markdown.js.map
