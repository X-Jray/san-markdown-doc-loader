/**
 * @file san-markdown-loader
 * @author leon <ludafa@outlook.com>
 */

/* eslint-disable fecs-camelcase, prefer-rest-params, fecs-prefer-destructure, fecs-no-require */

const loaderUtils = require('loader-utils');
const generator = require('./generator');
const markdown = require('./markdown');
const path = require('path');
const parser = require('./parser');

module.exports = function (source) {

    let callback = this.async();

    let options = Object.assign(
        loaderUtils.getOptions(this) || {},
        this.sanMarkdown,
        this.options.sanMarkdown
    );

    let md = markdown(options);

    let renderer = md.renderer;
    let renderAttrs = renderer.renderAttrs;

    md.renderer.renderAttrs = function (token) {

        if (token.nesting === -1) {
            return '';
        }

        let attrs = token.attrs;

        if (!attrs) {
            attrs = token.attrs = [];
        }

        let hasClassName = false;
        for (let i = 0, len = attrs.length; i < len; i++) {
            if (attrs[i][0] === 'class') {
                attrs[i][1] += ' md';
                hasClassName = true;
                break;
            }
        }


        if (!hasClassName) {
            attrs.push(['class', 'md']);
        }

        return renderAttrs.call(renderer, token);

    };

    let code = md.render(source);


    parser.parse(code).then(
        ast => {

            let {filePath} = generator.generate({
                source,
                code,
                ast,
                filePath: this.resourcePath,
                cacheDir: path.join(__dirname, '../.cache')
            });

            let moduleName = loaderUtils.stringifyRequest(this, filePath).slice(1, -1);

            callback(null, `module.exports = require('!!san-loader!${moduleName}');`);

        },
        callback
    );

};
