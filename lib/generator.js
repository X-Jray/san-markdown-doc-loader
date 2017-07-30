'use strict';

/**
 * @file generator
 * @author leon <ludafa@outlook.com>
 */

/* eslint-disable fecs-no-require */

var fs = require('fs');
var path = require('path');
var hash = require('shorthash');
var transform = require('./transform');

var _require = require('./constants'),
    CODE_BLOCK_NAME = _require.CODE_BLOCK_NAME;

var _ = require('lodash');
var relative = require('require-path-relative');

var _require2 = require('domutils'),
    findAll = _require2.findAll,
    appendChild = _require2.appendChild;

var _require3 = require('./util'),
    getInnerHTML = _require3.getInnerHTML,
    getOuterHTML = _require3.getOuterHTML;

function generateCodeBlock(options) {
    var node = options.node,
        originPath = options.originPath,
        targetPath = options.targetPath,
        index = options.index;


    var source = getInnerHTML(node);

    // 对顶级的 script 标签内部做路径调整
    node.children.filter(function (child) {
        return child.type === 'script' && child.name === 'script' && !(child.attribs && child.attribs.src);
    }).forEach(function (script) {

        var textNode = script.children[0];

        textNode.data = transform.normalizeDependences({
            code: textNode.data,
            targetPath: targetPath,
            originPath: originPath,
            components: []
        });
    });

    var content = getInnerHTML(node);

    var snippetFileName = path.basename(originPath) + '.snippet-' + hash.unique(source);
    var snippetFilePath = path.join(path.dirname(targetPath), snippetFileName + '.san');

    fs.writeFileSync(snippetFilePath, content, 'utf8');

    var componentName = _.camelCase(snippetFileName).toLowerCase();

    // 用 snippet 替换掉 code block 的原有内容
    node.children = [];
    appendChild(node, {
        name: componentName,
        type: 'tag',
        attribs: {},
        children: []
    });

    return {
        componentName: componentName,
        source: './' + snippetFileName + '.san',
        local: _.capitalize(_.camelCase(snippetFileName)),
        filePath: snippetFilePath,
        mainFilePath: targetPath,
        originPath: originPath,
        index: index
    };
}

function resolveComponents(root) {

    return findAll(function (node) {
        return node.type === 'tag' && node.name === CODE_BLOCK_NAME;
    }, root.children);
}

function generateScriptByComponents(options) {
    var components = options.components,
        targetPath = options.targetPath;


    if (!components || !components.length) {
        return '';
    }

    var importContent = components.map(function (component) {
        var source = component.source,
            local = component.local;


        return 'import ' + local + ' from \'' + source + '\';';
    }).join('\n');

    var componentContent = components.map(function (component) {
        var local = component.local,
            componentName = component.componentName;


        return '\'' + componentName + '\': ' + local;
    }).join(',\n');

    var relativeSanCodeBlockPath = relative(path.dirname(targetPath), path.join(__dirname, './component/SanCodeBlock.js'));

    return importContent + '\nimport SanCodeBlock from \'' + relativeSanCodeBlockPath + '\';\nexport default {\n    components: {\n        \'san-code-block\': SanCodeBlock,\n        ' + componentContent + '\n    }\n};';
}

function wrapRoot(ast) {

    var section = {
        type: 'tag',
        name: 'section',
        attribs: {
            'class': 'san-markdown-loader-wrapper'
        },
        children: []
    };

    ast.forEach(function (node) {
        return appendChild(section, node);
    });

    var template = {
        type: 'tag',
        name: 'template',
        children: []
    };

    appendChild(template, section);

    return template;
}

function generate(options) {
    var source = options.source,
        ast = options.ast,
        filePath = options.filePath,
        cacheDir = options.cacheDir;


    var filename = path.basename(filePath) + '.' + hash.unique(source) + '.san';
    var targetFilePath = path.join(cacheDir, filename);
    var template = wrapRoot(ast);
    var components = resolveComponents(template);
    var script = void 0;

    if (components && components.length) {
        components = components.map(function (component, index) {
            return generateCodeBlock({
                node: component,
                originPath: filePath,
                targetPath: targetFilePath,
                index: index
            });
        });
        script = generateScriptByComponents({
            components: components,
            targetPath: targetFilePath,
            originPath: filePath
        });
    }

    var content = getOuterHTML(template) + '\n<script>\n    ' + script + '\n</script>';

    fs.writeFileSync(targetFilePath, content.trim(), 'utf8');

    return {
        content: content,
        filePath: targetFilePath
    };
}

module.exports = {
    generate: generate
};
//# sourceMappingURL=generator.js.map
