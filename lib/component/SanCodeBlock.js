/**
 * @file SanCodeBlock
 * @author leon <ludafa@outlook.com>
 */

'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _san = require('san');

var _san2 = _interopRequireDefault(_san);

var _highlight = require('highlight.js');

var _highlight2 = _interopRequireDefault(_highlight);

require('highlight.js/styles/github.css');

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

require('./SanCodeBlock.css');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var SanCodeBlock = function (_san$Component) {
    _inherits(SanCodeBlock, _san$Component);

    function SanCodeBlock() {
        _classCallCheck(this, SanCodeBlock);

        return _possibleConstructorReturn(this, (SanCodeBlock.__proto__ || Object.getPrototypeOf(SanCodeBlock)).apply(this, arguments));
    }

    _createClass(SanCodeBlock, [{
        key: 'initData',


        /* eslint-disable max-len */
        value: function initData() {
            return {
                expanded: false
            };
        }
        /* eslint-enable max-len */

    }, {
        key: 'attached',
        value: function attached() {

            var codeElement = this.el.querySelector('pre');

            if (!codeElement) {
                return;
            }

            try {
                _highlight2.default.highlightBlock(codeElement);
            } catch (e) {
                console.log(e);
            }
        }
    }, {
        key: 'toggleSource',
        value: function toggleSource() {
            var expanded = this.data.get('expanded');
            this.data.set('expanded', !expanded);
        }
    }]);

    return SanCodeBlock;
}(_san2.default.Component);

SanCodeBlock.template = '\n        <section class="san-markdown-loader-code-block">\n            <h4\n                class="san-markdown-loader-code-block-title"\n                on-click="toggleSource">\n                <label>{{title}}</label>\n                <svg viewBox="0 0 24 24" style="display: inline-block; color: rgba(0, 0, 0, 0.87); fill: currentcolor; height: 24px; width: 24px; user-select: none; transition: all 450ms cubic-bezier(0.23, 1, 0.32, 1) 0ms;"><path d="M9.4 16.6L4.8 12l4.6-4.6L8 6l-6 6 6 6 1.4-1.4zm5.2 0l4.6-4.6-4.6-4.6L16 6l6 6-6 6-1.4-1.4z"></path></svg>\n            </h4>\n            <p\n                san-if="!!description"\n                class="san-markdown-loader-code-block-description">\n                {{description}}\n            </p>\n            <div class="san-markdown-loader-code-block-source" style="{{sourceStyle}}">\n                <pre><code class="html">{{_content}}</code></pre>\n            </div>\n            <div class="san-markdown-loader-code-block-box">\n                <slot />\n            </div>\n        </section>\n    ';
SanCodeBlock.computed = {
    sourceStyle: function sourceStyle() {
        var expanded = this.data.get('expanded');
        return {
            'max-height': expanded ? 'auto' : '0',
            'overflow': 'hidden'
        };
    },

    /* eslint-disable fecs-camelcase */
    _content: function _content() {
        return _lodash2.default.unescape(this.data.get('content')).replace(/&#x7B;/g, '{').replace(/&#x7D;/g, '}');
    }
    /* eslint-enable fecs-camelcase */

};
exports.default = SanCodeBlock;
//# sourceMappingURL=SanCodeBlock.js.map
