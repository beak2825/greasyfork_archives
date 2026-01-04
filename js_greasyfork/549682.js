// ==UserScript==
// @name               BBCode Parser
// @namespace          https://greasyfork.org/users/667968-pyudng
// @version            0.2.3
// @description        Parse BBCode into AST and convert into HTML
// @author             PY-DNG
// @license            GPL-3.0-or-later
// ==/UserScript==

/* eslint-disable no-multi-spaces */
/* eslint-disable no-return-assign */
/* eslint-disable no-fallthrough */

var BBCodeParser = (function __MAIN__() {
    'use strict';

    class ASTToken {
        /** @type {string} Token类型 */
        type;
        /** @type {number} 第一个字符的index */
        start;
        /** @type {number} 最后一个字符的index+1 */
        end;
        /** @type {string} 源代码 */
        code;

        /**
         * @param {Pick<ASTToken, keyof typeof ASTToken.prototype>} details
         */
        constructor(details = {}) {
            Object.assign(this, details);
        }
    }

    class BBCodeToken extends ASTToken {
        /** @type {'bbcode'} */
        type = 'bbcode';
        /** @type {'open' | 'close'} */
        sub_type;
        /** @type {string} */
        tag_name;
        /** @type {string | null} */
        attribute;

        /**
         * @param {Pick<BBCodeToken, keyof typeof BBCodeToken.prototype>} details
         */
        constructor(details = {}) {
            super();
            Object.assign(this, details);
        }
    }

    class TextToken extends ASTToken {
        /** @type {'text'} */
        type = 'text';

        /**
         * @param {Pick<TextToken, keyof typeof TextToken.prototype>} details
         */
        constructor(details = {}) {
            super();
            Object.assign(this, details);
        }
    }

    class HTMLToken extends ASTToken {
        /** @type {'html'} */
        type = 'html';
        /** @type {'open' | 'close'} */
        sub_type;

        /**
         * @param {Pick<HTMLToken, keyof typeof HTMLToken.prototype>} details
         */
        constructor(details = {}) {
            super();
            Object.assign(this, details);
        }
    }

    class ASTNode {
        /** @type {'bbcode' | '#string'} 节点类型 */
        type;
        /** @type {number} 第一个字符的token index */
        token_start;
        /** @type {number} 最后一个字符的token index + 1 */
        token_end;
        /** @type {number} 第一个字符的code index */
        start;
        /** @type {number} 最后一个字符的code index + 1 */
        end;
        /** @type {string} 源代码 */
        code;
        /** @type {ASTToken[]} 包含的全部Token */
        tokens;
        /** @type {ASTNode[]} 子节点 */
        children;
        /** @type {string} 子节点全部代码 */
        content;

        /**
         * @param {Pick<ASTNode, keyof typeof ASTNode.prototype>} details
         */
        constructor(details = {}) {
            Object.assign(this, details);
        }
    }

    class BBCodeNode extends ASTNode {
        /** @type {'bbcode'} 节点类型 */
        type = 'bbcode';
        /** @type {string | null} bbcode节点属性值 */
        attribute;
        /** @type {string} 节点名称 */
        tag_name;

        /**
         * @param {Pick<BBCodeNode, keyof typeof BBCodeNode.prototype>} details
         */
        constructor(details = {}) {
            super();
            Object.assign(this, details);
        }
    }

    class TextNode extends ASTNode {
        /** @type {'#text'} 节点类型 */
        type = '#text';

        /**
         * @param {Pick<TextNode, keyof typeof TextNode.prototype>} details
         */
        constructor(details = {}) {
            super();
            Object.assign(this, details);
        }
    }

    class HTMLNode extends ASTNode {
        /** @type {'html'} 节点类型 */
        type = 'html';

        /**
         * @param {Pick<HTMLNode, keyof typeof HTMLNode.prototype>} details
         */
        constructor(details = {}) {
            super();
            Object.assign(this, details);
        }
    }

    class BBCodeSyntaxError extends Error {
        /** @typedef {typeof BBCodeSyntaxError.ErrorTypes[keyof typeof BBCodeSyntaxError.ErrorTypes]} ErrorType */
        static ErrorTypes = {
            TagMismatch: 1,
            UnclosedTag: 2,
            NoOpentag:   3,
        };
        /** @type {ErrorType} 错误类型 */
        type;
        /** @type {any} 任何附加的错误信息，可以省略 */
        info = null;

        /**
         * @param {string} message
         * @param {ErrorType} type - 错误类型
         * @param {any} [info=null] - 任何附加的错误信息，可以省略
         */
        constructor(message, type, info) {
            super(message);
            this.name = "BBCodeSyntaxError";
            this.type = type;
            this.info = info;

            // 保持正确的堆栈跟踪
            if (Error.captureStackTrace) {
                Error.captureStackTrace(this, BBCodeSyntaxError);
            }
        }
    }

    /**
     * BBCode解析器
     */
    class BBCodeParser {
        static Reg = {
            StartToken: /\[[a-z0-9\-_]+\]/i,
            EndToken: /\[\/[a-z0-9\-_]+\]/i,
        };

        /** @typedef {(attribute: string | null, content: string | null) => string} TagTransformer */
        /**
         * BBCode转html规则
         * @typedef {Object} TagDefination
         * @property {TagTransformer} openTag - 将开标签从bbcode转换成html的实现函数
         * @property {TagTransformer | null} closeTag - 将闭标签从bbcode转换成html的实现函数；不存在时，代表该规则仅有开标签（如`[hr]`）
         */
        /** @type {Record<string, TagDefination>} */
        tags = {};

        constructor() {}

        /**
         * 将bbcode代码解析为Token流
         * @param {string} bbcode 
         * @param {BBCodeSyntaxError[]} [errors=[]] - 错误数组，如在解析过程中发现/出现错误就添加到这个数组中，可省略
         * @return {ASTToken[]}
         */
        parseTokens(bbcode, errors = []) {
            /** @type {ASTToken[]} */
            const tokens = [];

            // 分词
            for (let i = 0; i < bbcode.length; i++) {
                const char = bbcode.charAt(i);

                switch (char) {
                    case '[': {
                        // [ 开头，可能是BBCode标签
                        const token = findBBCodeToken(i);
                        if (token) {
                            // 确实是BBCode标签
                            tokens.push(token);
                            i = token.end - 1;
                            break;
                        } else {
                            // 不是BBCode标签，不break，进入default case当作普通文字处理
                        }
                    }
                    default: {
                        // 普通文字
                        const token = findPlainTextToken(i);
                        tokens.push(token);
                        i = token.end - 1;
                    }
                }
            }

            return tokens;

            /**
             * 从给定位置向后扫描，寻找BBCode起始/结束标签Token
             * @param {number} i 
             * @returns {null | ASTToken}
             */
            function findBBCodeToken(i) {
                let j = i + 1;
                bbcode.charAt(j) === '/' && j++;
                for (; j < bbcode.length; j++) {
                    const char = bbcode.charAt(j);

                    if (char === ']') {
                        const token = new BBCodeToken({
                            sub_type: bbcode.charAt(i+1) === '/' ? 'close' : 'open',
                            code: bbcode.substring(i, j+1),
                            start: i,
                            end: j + 1,
                        });
                        const content = token.code.substring(
                            token.sub_type === 'open' ? 1 : 2,
                            token.code.length - 1,
                        );
                        if (content.includes('=')) {
                            const index = content.indexOf('=');
                            [token.tag_name, token.attribute] = [
                                content.substring(0, index),
                                content.substring(index + 1)
                            ];
                        } else {
                            token.tag_name = content;
                            token.attribute = null;
                        }
                        return token;
                    }
                    if ('\r\n'.includes(char)) return null;
                }
                return null;
            }

            /**
             * 从给定位置向后扫描，寻找纯文本Token
             * @param {number} i 
             * @returns {ASTToken}
             */
            function findPlainTextToken(i) {
                // 根据后续换行符、[、]的位置判断后续是否有bbcode token
                const following_code = bbcode.slice(i);
                const next_newline = Math.min(following_code.indexOf('\r'), following_code.indexOf('\r'));
                const next_left_bracket = following_code.indexOf('[');
                const next_right_bracket = following_code.indexOf(']');
                const has_bbcode_token =
                    next_left_bracket > -1 &&
                    next_left_bracket < next_right_bracket &&
                    (next_left_bracket - next_newline) * (next_right_bracket - next_newline) > 0;
                
                // 计算当前纯文本token截止位置
                const end = has_bbcode_token ? 
                    // 后续如果有bbcode token，则纯文本token截止到bbcode token之前
                    next_left_bracket:
                    // 后续如果没有bbcode token，则纯文本token截止到bbcode代码末尾
                    following_code.length;
                return new TextToken({
                    code: following_code.slice(0, end),
                    start: i,
                    end: end + i,
                });
            }
        }

        /**
         * 将Token流解析为AST
         * @param {ASTToken[]} tokens 
         * @param {BBCodeSyntaxError[]} [errors=[]] - 错误数组，如在解析过程中发现/出现错误就添加到这个数组中，可省略
         * @returns {ASTNode[]}
         */
        parseAST(tokens, errors = []) {
            /** @type {number[]} 存放可以拥有子节点的节点的首Token的index */
            const open_indexes = [];
            /** @type {ASTNode[]} 存放结果节点 */
            const nodes = [];

            for (let i = 0; i < tokens.length; i++) {
                const token = tokens[i];

                const accept_children = token.type === 'bbcode' && this.tags[token.tag_name]?.closeTag;
                const is_open_token = token.sub_type === 'open';

                if (accept_children) {
                    // 可以拥有子节点的节点的开标签token入栈
                    is_open_token && open_indexes.push(i);

                    // 闭标签出栈，转换为AST节点存储
                    if (!is_open_token) {
                        /** @type {number} */
                        const open_index = open_indexes.pop();
                        const open_token = tokens[open_index];
                        if (open_index !== undefined && open_token.tag_name === token.tag_name) {
                            // 创建节点
                            const node_tokens = tokens.slice(open_index, i + 1);
                            const node = new BBCodeNode({
                                type: 'bbcode',
                                tag_name: token.tag_name,
                                tokens: node_tokens,
                                attribute: open_token.attribute,
                                code: node_tokens.reduce((code, token) => code + token.code, ''),
                                children: [],
                                content: '',
                                token_start: open_index,
                                token_end: i + 1,
                                start: open_token.start,
                                end: token.end,
                            });
                            // 将节点范围内的已有节点添加为子节点
                            nodes
                                .filter(n => n.token_start > node.token_start)
                                .forEach(n => node.children.push(nodes.splice(nodes.indexOf(n), 1)[0]));
                            // 计算content
                            node.content = accept_children ?
                                node.children.reduce((content, child) => content + child.code, '') :
                                null;
                            nodes.push(node);
                        } else if (open_index === undefined) {
                            // 没有开标签，产生错误
                            const err = new BBCodeSyntaxError(
                                `No open tag for close tag: ${ token.tag_name }`,
                                BBCodeSyntaxError.ErrorTypes.NoOpentag,
                                { close_token: token },
                            );
                            errors.push(err);

                            // 按照源代码将闭标签创建为文本节点
                            const close_node = new TextNode({
                                children: [],
                                code: token.code,
                                content: '',
                                tokens: [token],
                                token_start: i,
                                token_end: i + 1,
                                start: token.start,
                                end: token.end,
                            });
                            nodes.push(close_node);
                        } else {
                            // 闭标签和开标签不匹配，产生错误
                            const err = new BBCodeSyntaxError(
                                `Tags mismatch: ${ open_token.tag_name }, ${ token.tag_name }`,
                                BBCodeSyntaxError.ErrorTypes.TagMismatch,
                                { open_token, close_token: token },
                            );
                            errors.push(err);

                            // 按照源代码分别将开标签和闭标签创建为文本节点
                            const open_node = new TextNode({
                                children: [],
                                code: open_token.code,
                                content: '',
                                tokens: [open_token],
                                token_start: open_index,
                                token_end: open_index + 1,
                                start: open_token.start,
                                end: open_token.end,
                            });
                            const close_node = new TextNode({
                                children: [],
                                code: token.code,
                                content: '',
                                tokens: [token],
                                token_start: i,
                                token_end: i + 1,
                                start: token.start,
                                end: token.end,
                            });
                            // 插入到节点列表
                            nodes.splice(nodes.findIndex(node => node.start >= open_token.start), 0, open_node);
                            nodes.push(close_node);
                        }
                    }
                } else {
                    // 封装后不能拥有子节点的Token，直接封装为节点
                    const node_details = {
                        children: [],
                        content: '',
                        tokens: [token],
                        code: token.code,
                        token_start: i,
                        token_end: i + 1,
                        start: token.start,
                        end: token.end,
                    };
                    switch (token.type) {
                        case 'bbcode': {
                            node_details.attribute = token.attribute;
                            nodes.push(new BBCodeNode(node_details));
                            break;
                        }
                        case 'text': {
                            nodes.push(new TextNode(node_details));
                            break;
                        }
                    }
                }
            }

            // token遍历完毕仍有未闭合标签，产生错误
            if (open_indexes.length) {
                const err = new BBCodeSyntaxError(
                    `Unclosed tag: ${ open_indexes.map(i => tokens[i].tag_name).join(', ') }`,
                    BBCodeSyntaxError.ErrorTypes.UnclosedTag,
                    { tokens: open_indexes.map(i => tokens[i]) },
                );
                errors.push(err);
            }

            return nodes;
        }

        /**
         * 将BBCode AST转化为HTML（旧版方法）
         * @deprecated
         * @param {ASTNode[]} nodes 
         * @returns {string}
         */
        toHTML_legacy(nodes) {
            return nodes.reduce((html, node) => {
                switch (node.type) {
                    case 'bbcode': {
                        if (!Object.hasOwn(this.tags, node.tag_name)) {
                            // 节点类型未定义，当作纯文本节点处理，不break
                        } else {
                            // 将开闭标签转化为html，子节点调用toHTML递归处理
                            const tag = this.tags[node.tag_name];
                            html +=
                                tag.openTag(node.attribute, node.content) +
                                this.toHTML(node.children) +
                                tag.closeTag?.(node.attribute, node.content) ?? '';
                            break;
                        }
                    }
                    case '#text': {
                        // 纯文本节点转化成html无需任何处理
                        html += node.code;
                        break;
                    }
                }
                return html;
            }, '');
        }

        /**
         * 将BBCode AST转化为HTML AST
         * @param {ASTNode[]} bbcode_nodes
         * @param {BBCodeSyntaxError[]} [errors=[]] - 错误数组，如在解析过程中发现/出现错误就添加到这个数组中，可省略
         * @returns {ASTNode[]}
         */
        toHTMLAST(bbcode_nodes, error = []) {
            // 转换bbcode node为html node
            const html_nodes = bbcode_nodes.map(node => {
                switch (node.type) {
                    case 'bbcode': {
                        if (!Object.hasOwn(this.tags, node.tag_name)) {
                            // 节点类型未定义，当作纯文本节点处理，不break
                        } else {
                            // 将开闭标签转化为html，子节点调用toHTMLAST递归处理
                            const tag = this.tags[node.tag_name];

                            // 开标签
                            const open_token = new HTMLToken({
                                sub_type: 'open',
                                code: tag.openTag(node.attribute, node.content),
                                start: -1,
                                end: -1,
                            });

                            // 子节点
                            const content_nodes = tag.closeTag ? this.toHTMLAST(node.children) : [];
                            const content = content_nodes.reduce((code, n) => code + n.code, '');
                            const content_tokens = content_nodes.reduce((tokens, n) => ((tokens.push(...n.tokens), tokens)), []);

                            // 闭标签
                            const close_token = new HTMLToken({
                                sub_type: 'close',
                                code: tag.closeTag?.(node.attribute, node.content) ?? '',
                                start: -1,
                                end: -1,
                            });

                            // 创建HTML节点
                            const html_node = new HTMLNode({
                                code: open_token.code +
                                    content +
                                    close_token.code,
                                children: content_nodes,
                                content: content,
                                tokens: [open_token, ...(tag.closeTag ? [...content_tokens, close_token] : [])],
                                start: open_token.start,
                                end: close_token.end,
                                token_start: -1,
                                token_end: -1,
                            });
                            
                            return html_node;
                        }
                    }
                    case '#text': {
                        // 纯文本节点转化成html，仍然是text node
                        const tokens = node.tokens.map(token => new TextToken({
                            code: token.code,
                            start: -1,
                            end: -1,
                        }));
                        const text_node = new TextNode({
                            children: node.children,
                            code: node.code,
                            content: node.content,
                            tokens: tokens,
                            start: -1,
                            end: -1,
                            token_start: -1,
                            token_end: -1,
                        });

                        return text_node;
                    }
                }
            });

            // 为html node计算start / end / token_start / token_end
            calcIndex(html_nodes);

            /**
             * 递归地为节点计算start / end / token_start / token_end
             * @param {ASTNode[]} nodes - 需要计算的全部节点
             * @param {number} [code_i=0] - 起始基准字符index
             * @param {number} [token_i=0] - 起始基准token index
             */
            function calcIndex(nodes, code_i = 0, token_i = 0) {
                nodes.forEach(node => {
                    // 递归计算子节点
                    calcIndex(
                        node.children,
                        code_i + node.tokens[0].code.length,
                        token_i + 1,
                    );

                    // 计算本节点的所有token的start / end
                    let token_code_i = code_i;
                    node.tokens.forEach(token => {
                        token.start = token_code_i;
                        token_code_i += token.code.length;
                        token.end = token_code_i;
                    });

                    // 计算本节点的start / end / token_start / token_end
                    node.start = code_i;
                    code_i += node.code.length;
                    node.end = code_i;
                    node.token_start = token_i;
                    token_i += node.tokens.length;
                    node.token_end = token_i;
                });
            }

            return html_nodes;
        }

        /**
         * 将HTML AST转化为HTML
         * @param {ASTNode[]} html_ast 
         * @returns {string}
         */
        toHTML(html_ast) {
            return html_ast.map(node => node.code).join('');
        }

        /**
         * 解析bbcode，输出对象格式结果
         * @param {string} bbcode 
         */
        parse(bbcode) {
            /** @type {BBCodeSyntaxError[]} */
            const errors = [];
            const tokens = this.parseTokens(bbcode, errors);
            const ast = this.parseAST(tokens, errors);
            const html_ast = this.toHTMLAST(ast, errors);
            const html = this.toHTML(html_ast);

            return {
                tokens,
                ast,
                html_ast,
                html,
                errors,
                locate,
            };

            /**
             * @typedef {Object} LocationRange
             * @property {number} start - 区域起始index，区域内首元素的index
             * @property {number} end - 区域结束index，区域内尾元素的index + 1
             */
            /**
             * @overload
             * @param {number} start - html字符区间第一个字符index
             * @param {number} end - html字符区间最后一格字符index + 1
             * @returns {LocationRange} bbcode代码字符位置范围
             */
            function locate() {
                if (arguments.length === 2) {
                    return locateRange(...arguments);
                }

                /**
                 * 根据给定html区间定位bbcode的代码区间  
                 * 注意：bbcode转换为html后，精准度最高只能到节点与节点对应
                 * @param {number} start - html字符区间第一个字符index
                 * @param {number} end - html字符区间最后一格字符index + 1
                 * @returns {LocationRange} bbcode字符区间
                 */
                function locateRange(start, end) {
                    const html_tokens = html_ast.reduce(/** @param {ASTToken[]} tokens */(tokens, node) => ((tokens.push(...node.tokens), tokens)), []);
                    const start_token_i = html_tokens.findLastIndex(token => token.start <= start);
                    const end_token_i = html_tokens.findIndex(token => token.end >= end);

                    return {
                        start: tokens[start_token_i].start,
                        end: tokens[end_token_i].end,
                    };
                }
            }
        }

        /**
         * 注册bbcode标签实现
         * @param {Record<string, TagDefination>} tags 
         */
        register(tags) {
            Object.assign(this.tags, tags);
        }
    }

    return {
        ASTToken, BBCodeToken, TextToken, HTMLToken,
        ASTNode, BBCodeNode, TextNode, HTMLNode,
        BBCodeSyntaxError,
        BBCodeParser,
    };
}) ();
