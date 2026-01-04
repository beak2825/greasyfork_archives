// ==UserScript==
// @id                 548379
// @namespace          runonstof
// @name               Debugger
// @version            1.0.3
// @description        Debugger tool for CustomNPCs scripts
// @author             Runonstof
// @license            MIT
// @minecraft          1.20.1
// @scripttype         player
// @match              https://customnpcs.com
// @downloadURL https://update.greasyfork.org/scripts/548379/Debugger.user.js
// @updateURL https://update.greasyfork.org/scripts/548379/Debugger.meta.js
// ==/UserScript==

"use strict";

function _construct(Parent, args, Class) { if (_isNativeReflectConstruct()) { _construct = Reflect.construct; } else { _construct = function _construct(Parent, args, Class) { var a = [null]; a.push.apply(a, args); var Constructor = Function.bind.apply(Parent, a); var instance = new Constructor(); if (Class) _setPrototypeOf(instance, Class.prototype); return instance; }; } return _construct.apply(null, arguments); }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Date.prototype.toString.call(Reflect.construct(Date, [], function () {})); return true; } catch (e) { return false; } }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function cancel(e, text) {
  if (text) {
    e.player.message(ccs('' + text));
  }

  if (e.isCancelable()) {
    e.setCanceled(true);
  }

  return false;
}

if (!Object.assign) {
  Object.defineProperty(Object, 'assign', {
    enumerable: false,
    configurable: true,
    writable: true,
    value: function value(target) {
      'use strict';

      if (target === undefined || target === null) {
        throw new TypeError('Cannot convert first argument to object');
      }

      var to = Object(target);

      for (var i = 1; i < arguments.length; i++) {
        var nextSource = arguments[i];

        if (nextSource === undefined || nextSource === null) {
          continue;
        }

        nextSource = Object(nextSource);
        var keysArray = Object.keys(Object(nextSource));

        for (var nextIndex = 0, len = keysArray.length; nextIndex < len; nextIndex++) {
          var nextKey = keysArray[nextIndex];
          var desc = Object.getOwnPropertyDescriptor(nextSource, nextKey);

          if (desc !== undefined && desc.enumerable) {
            to[nextKey] = nextSource[nextKey];
          }
        }
      }

      return to;
    }
  });
}

try {
  String.prototype.truncate = function (length) {
    var endString = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '';
    if (this.length <= length - endString.length) return this;
    return this.substr(0, length - endString.length) + endString;
  };
} catch (exc) {}

;

function str_truncate(str, length) {
  var endString = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : '';
  if (str.length <= length - endString.length) return str;
  return str.substr(0, length - endString.length) + endString;
}

function ccs() {
  var text = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 5;
  return (text + '').replace(/&/g, "\xA7");
}

var REGEX_colorCode = /&([0-9a-fklmnor])/g;

if (!Object.values) {
  Object.defineProperty(Object, 'values', {
    enumerable: false,
    configurable: true,
    writable: true,
    value: function value(target) {
      'use strict';

      return Object.keys(target).map(function (key) {
        return target[key];
      });
    }
  });
}

var _GUI_IDS = {
  counter: 1,
  ids: {},
  lookup: {}
}; // var tempdata = API.getIWorld(0).getTempdata();
// if(tempdata.get('_GUI_IDS')) {
//     _GUI_IDS = tempdata.get('_GUI_IDS');
// } else {
//     tempdata.put('_GUI_IDS', _GUI_IDS);
// }

function id(name) {
  if (Object.prototype.toString.call(name) === '[object Array]') {
    for (var i in name) {
      id(name[i]);
    }

    return true;
  }

  if (!name) {
    name = Math.random().toString(36).substring(7) + Math.random().toString(36).substring(7);
  }

  var _id = _GUI_IDS.ids[name] || (_GUI_IDS.ids[name] = _GUI_IDS.counter++);

  _GUI_IDS.lookup[_id] = name;
  return _id;
}

function idname(_id) {
  return _GUI_IDS.lookup[_id];
}

function removeid(name) {
  var _id = id(name);

  delete _GUI_IDS.lookup[_id];
  delete _GUI_IDS.ids[name];
}

;

function mkPath(path) {
  var expath = path.split("/");
  var curpath = "";

  for (var ex in expath) {
    var expt = expath[ex];
    curpath += (curpath == "" ? "" : "/") + expt;
    var pfile = new File(curpath);

    if (!pfile.exists()) {
      if (expt.match(/[\w]+\.[\w]+/) === null) {
        //is dir?
        pfile.mkdir();
      } else {
        pfile.createNewFile();
      }
    }
  }
}

var File = Java.type("java.io.File");
var Files = Java.type("java.nio.file.Files");
var Paths = Java.type("java.nio.file.Paths");
var Path = Java.type("java.nio.file.Path");
var CHARSET_UTF_8 = Java.type("java.nio.charset.StandardCharsets").UTF_8;
var StandardCopyOption = Java.type('java.nio.file.StandardCopyOption'); //Constants for validatePath

var PATH_VALIDATION = {
  SUCCESS: 1,
  ABOVE_ROOT: 0,
  //If the given path is above allowed root while forceRoot is not given
  NOT_EXISTS: -1
};

function loadGuiOptions(gui, lblId) {
  var options = JSON.parse(gui.getComponent(lblId).getText()); //edit options

  return options;
}

var _IMPORTS = {};
/**
 * Chiffon
 *
 * @description  A small ECMAScript parser, tokenizer and minifier written in JavaScript
 * @fileoverview JavaScript parser, tokenizer and minifier library
 * @version      2.5.4
 * @date         2016-04-17
 * @link         https://github.com/polygonplanet/Chiffon
 * @copyright    Copyright (c) 2015-2016 polygon planet <polygon.planet.aqua@gmail.com>
 * @license      Licensed under the MIT license.
 */

/*jshint bitwise:false, eqnull:true */

(function (name, context, factory) {
  // Supports AMD, Node.js, CommonJS and browser context.
  if (typeof exports !== 'undefined') {
    if (typeof module !== 'undefined' && module.exports) {
      module.exports = factory();
    } else {
      exports[name] = factory();
    }
  } else if (typeof define === 'function' && define.amd) {
    define(factory);
  } else {
    context[name] = factory();
  }
})('Chiffon', _IMPORTS, function () {
  'use strict';

  var Chiffon = {};
  var arrayProto = Array.prototype;
  var push = arrayProto.push;
  var slice = arrayProto.slice;
  var splice = arrayProto.splice;
  var fromCharCode = String.fromCharCode;
  var _Comment = 'Comment',
      _WhiteSpace = 'WhiteSpace',
      _LineTerminator = 'LineTerminator',
      _Template = 'Template',
      _String = 'String',
      _Punctuator = 'Punctuator',
      _RegularExpression = 'RegularExpression',
      _Numeric = 'Numeric',
      _Identifier = 'Identifier',
      _Null = 'Null',
      _Boolean = 'Boolean',
      _Keyword = 'Keyword'; // ECMA-262 11.3 Line Terminators

  var lineTerminator = "\\r\\n\\u2028\\u2029";
  var lineTerminatorSequence = '(?:\\r\\n|[' + lineTerminator + '])';
  var whiteSpace = '(?:(?![' + lineTerminator + '])\\s)+';
  var literalSuffix = '(?=' + '\\s*' + '(?:' + '(?!\\s*[/\\\\<>*%`^"\'\\w$-])' + '[^/\\\\<>*%`^\'"({[\\w$-]' + '|' + '[!=]==?' + '|' + '[|][|]' + '|' + '&&' + '|' + '/[*/]' + '|' + '[,.;:!?)}\\]' + lineTerminator + ']' + '|' + '$' + ')' + ')'; // ECMA-262 11.7 Punctuators

  var punctuators = '(?:' + '>>>=?|[.]{3}|<<=|===|!==|>>=' + '|' + '[+][+](?=[+])|--(?=-)' + '|' + '[=!<>*%+/&|^-]=' + '|' + '&&|[|][|]|[+][+]|--|<<|>>|=>' + '|' + '[-+*/%<>=&|^~!?:;,.()[\\]{}]' + ')';
  var regexpLiteral = '(?:' + '/' + '(?![*/])' + '(?:' + '\\\\[\\s\\S]' + '|' + '\\[' + '(?:' + '\\\\[\\s\\S]' + '|' + '[^\\]' + lineTerminator + '\\\\]' + ')*' + '\\]' + '|' + '[^/' + lineTerminator + '\\\\]' + ')+' + '/' + '(?:[gimuy]+\\b|)' + ')';
  var templateLiteral = '`(?:' + '\\\\[\\s\\S]' + '|' + '[$][{]' + '(?:' + '\\\\[\\s\\S]' + '|' + '[^{}\\\\]' + '|' + '[{](?:[^{}]*(?:[{][^{}]*[}])?)*[}]' + ')*' + '[}]' + '|' + '[^`\\\\]' + ')*`';
  var identToken = '(?:' + "\\\\u(?:[0-9a-fA-F]{4}|[{][0-9a-fA-F]+[}])" + '|' + '[^\\s\\\\+/%*=&|^~<>!?:;,.()[\\]{}\'"`@#-]' + ')+'; // Valid keywords for Regular Expression Literal. e.g. `typeof /a/`

  var regexPreWords = 'typeof|in|void|case|instanceof|yield|throw|delete|' + 'else|return|do'; // Valid keywords when previous token of the regex literal is a paren.
  // e.g. `if (1) /a/`

  var regexParenWords = 'if|while|for|with';
  var keywordsRe = new RegExp('^(?:' + // ECMA-262 11.6.2.1 Keywords
  regexParenWords + '|' + regexPreWords + '|' + 'var|function|this|new|break|catch|finally|try|default|continue|' + 'switch|const|export|import|class|extends|debugger|super|' + // Reserved keywords
  'let|static|' + // ECMA-262 11.6.2.2 Future Reserved Words
  'enum|await|' + 'implements|package|protected|interface|private|public' + ')$');
  var lineTerminatorSequenceRe = new RegExp(lineTerminatorSequence);
  var identRe = new RegExp('^' + identToken + '$');
  var identLeftRe = new RegExp('^' + identToken);
  var identRightRe = new RegExp(identToken + '$');
  var signLeftRe = /^[+-]/;
  var signRightRe = /[+-]$/;
  var notPunctRe = /[^{}()[\]<>=!+*%\/&|^~?:;,.-]/;
  var whiteSpaceRe = new RegExp('^' + whiteSpace);
  var regexPrefixRe = new RegExp('(?:' + '(?:^(?:' + regexPreWords + ')$)' + '|' + '(?:' + '(?![.\\]])' + punctuators + '$)' + ')');
  var regexParenWordsRe = new RegExp('^(?:' + regexParenWords + ')$');
  var tokenizeNotWhiteSpaceRe = getPattern(_WhiteSpace);
  var tokenizeNotTemplateRe = getPattern(_Template);
  var tokenizeNotRegExpRe = getPattern(_RegularExpression);
  var tokenizeRe = getPattern();
  lineTerminator = lineTerminatorSequence = whiteSpace = literalSuffix = punctuators = regexpLiteral = templateLiteral = identToken = regexPreWords = regexParenWords = null;

  function getPattern(ignore) {
    return new RegExp('(' + // MultiLine Comment
    '/[*][\\s\\S]*?[*]/' + // SingleLine Comment
    '|' + '//[^' + lineTerminator + ']*' + '|' + '<!--[^' + lineTerminator + ']*' + // Line Terminators
    '|' + '(?:^|' + lineTerminatorSequence + ')' + '(?:' + whiteSpace + ')?' + // SingleLine Comment
    '-->[^' + lineTerminator + ']*' + ( // Template Literal
    ignore === _Template ? '' : '|' + templateLiteral + literalSuffix) + // String Literal
    '|' + '"(?:' + '\\\\\\r\\n' + '|' + '\\\\[\\s\\S]' + '|' + '[^"' + lineTerminator + '\\\\]' + ')*"' + '|' + "'(?:" + '\\\\\\r\\n' + '|' + '\\\\[\\s\\S]' + '|' + "[^'" + lineTerminator + "\\\\]" + ")*'" + ( // Regular Expression Literal
    ignore === _RegularExpression ? '' : '|' + regexpLiteral + literalSuffix) + // Numeric Literal
    '|' + '0(?:' + '[xX][0-9a-fA-F]+' + '|' + '[oO][0-7]+' + '|' + '[bB][01]+' + ')' + '|' + '(?:\\d+(?:[.]\\d*)?|[.]\\d+)(?:[eE][+-]?\\d+)?' + '|' + '[1-9]\\d*' + '|' + '0[0-7]+' + // Operators
    '|' + punctuators + ( // WhiteSpace
    ignore === _WhiteSpace ? '' : '|' + whiteSpace) + // Line Terminators
    '|' + lineTerminatorSequence + // Identifier
    '|' + (ignore === _Template ? '[\\s\\S]' : identToken) + ')', 'g');
  }

  function fromCodePoint(c) {
    if (c <= 0xFFFF) {
      return fromCharCode(c);
    }

    c -= 0x10000;
    return fromCharCode((c >> 10) + 0xD800, c % 0x400 + 0xDC00);
  }

  function isLineTerminator(c) {
    return c === 0x0A || c === 0x0D || c === 0x2028 || c === 0x2029;
  }

  function isPunctuator(c) {
    return !notPunctRe.test(c);
  }

  function isDigit(c) {
    return c >= 0x30 && c <= 0x39;
  }

  function isOctalDigit(c) {
    var ch = c.charCodeAt(0);
    return ch >= 0x30 && ch <= 0x37;
  }

  function mixin(target) {
    slice.call(arguments, 1).forEach(function (source) {
      var keys = Object.keys(source);

      for (var i = 0, len = keys.length; i < len; i++) {
        var key = keys[i];
        target[key] = source[key];
      }
    });
    return target;
  }

  function Tokenizer(options) {
    this.options = mixin({}, options || {});
    this.line = 1;
    this.index = 0;
    this.prevLineIndex = 0;
  }

  Tokenizer.prototype = {
    parseMatches: function parseMatches(matches, tokens) {
      var token, value, len, index, lines;
      var lineStart, columnStart, columnEnd, hasLineTerminator;
      var type, regex;

      for (var i = 0; i < matches.length; i++) {
        value = matches[i];
        len = value.length;

        if (len === 0) {
          continue;
        }

        lineStart = this.line;
        columnStart = this.index - this.prevLineIndex;
        regex = null;
        type = this.getTokenType(value);

        if (this.options.loc) {
          if (type === _String || type === _Comment && value.charAt(1) === '*') {
            lines = value.split(lineTerminatorSequenceRe);

            if (lines.length > 1) {
              this.line += lines.length - 1;
              this.prevLineIndex = this.index + len - lines.pop().length;
            }
          } else if (type === _LineTerminator) {
            this.line++;
            this.prevLineIndex = this.index + len;
          }
        }

        if (type === _RegularExpression) {
          if (this.fixRegExpTokens(matches, i, tokens, value)) {
            i--;
            continue;
          }

          index = value.lastIndexOf('/');
          regex = {
            pattern: value.substr(1, index - 1),
            flags: value.substring(index + 1)
          };
        } else if (type === _Template) {
          this.parseTemplate(value, tokens, columnStart);
          continue;
        }

        this.index += len;

        if (!type) {
          continue;
        }

        if (this.options.parse && type === _LineTerminator) {
          hasLineTerminator = true;
          continue;
        }

        if (type === _Comment && !this.options.comment || type === _WhiteSpace && !this.options.whiteSpace || type === _LineTerminator && !this.options.lineTerminator) {
          continue;
        }

        token = {
          type: type,
          value: value
        };

        if (hasLineTerminator) {
          token.hasLineTerminator = true;
        }

        hasLineTerminator = false;

        if (regex) {
          token.regex = regex;
        }

        if (this.options.range) {
          token.range = [this.index - len, this.index];
        }

        if (this.options.loc) {
          columnEnd = this.index - this.prevLineIndex;
          this.addLoc(token, lineStart, columnStart, this.line, columnEnd);
        }

        tokens[tokens.length] = token;
      }
    },
    getTokenType: function getTokenType(value) {
      var len = value.length;
      var c = value.charAt(0);
      var ch;

      switch (c) {
        case '"':
        case "'":
          return _String;

        case '/':
          if (len === 1) {
            return _Punctuator;
          }

          c = value.charAt(1);

          if (c === '/' || c === '*') {
            return _Comment;
          }

          if (len === 2 && c === '=') {
            return _Punctuator;
          }

          return _RegularExpression;

        case '.':
          if (len === 1) {
            return _Punctuator;
          }

          c = value.charAt(1);

          if (c === '.') {
            return _Punctuator;
          }

          return _Numeric;

        case '<':
          if (len > 1 && value.charAt(1) === '!') {
            return _Comment;
          }

          return _Punctuator;

        case '-':
          if (len < 3) {
            return _Punctuator;
          }

          return _Comment;

        case '`':
          return _Template;

        case '}':
          if (len === 1) {
            return _Punctuator;
          }

          return _Template;

        default:
          if (value === 'true' || value === 'false') {
            return _Boolean;
          }

          if (value === 'null') {
            return _Null;
          }

          if (whiteSpaceRe.test(c)) {
            return _WhiteSpace;
          }

          if (isPunctuator(c)) {
            return _Punctuator;
          }

          ch = c.charCodeAt(0);

          if (isLineTerminator(ch)) {
            return _LineTerminator;
          }

          if (isDigit(ch)) {
            return _Numeric;
          }

          if (keywordsRe.test(value)) {
            return _Keyword;
          }

          if (identRe.test(value)) {
            return _Identifier;
          }

      }
    },
    addLoc: function addLoc(token, lineStart, columnStart, lineEnd, columnEnd) {
      token.loc = {
        start: {
          line: lineStart,
          column: columnStart
        },
        end: {
          line: lineEnd,
          column: columnEnd
        }
      };
    },
    parseTemplate: function parseTemplate(template, tokens, columnStart) {
      var blocks = this.parseTemplateBlock(template, columnStart);
      var newTokens = this.parseTemplateExpr(blocks);
      push.apply(tokens, newTokens);
    },
    parseTemplateExpr: function parseTemplateExpr(blocks) {
      var results = [];

      for (var i = 0, len = blocks.length; i < len; i++) {
        var block = blocks[i];

        if (block.type === 'tmp-source') {
          var props = mixin({}, block._loc, {
            type: _Template
          });

          var tokens = this._retokenize(block.value, props);

          push.apply(results, tokens);
        } else {
          results[results.length] = block;
        }
      }

      return results;
    },
    parseTemplateBlock: function parseTemplateBlock(template, columnStart) {
      var values = template.match(tokenizeNotTemplateRe);
      var line = this.line;
      var lineStart = line;
      var rangeStart = this.index;
      var newlines = [this.prevLineIndex];
      var tokens = [];
      var escapeCount = 0;
      var value = '';
      var type = _Template;
      var braceLevel = 0;
      var length = 0;
      var lastIndex, prevLineIndex, columnEnd;
      var prev, inExpr, tail, append, token;

      for (var i = 0, len = values.length; i < len; prev = values[i++]) {
        var c = values[i];
        var cLen = c.length;

        if (isLineTerminator(c.charCodeAt(0))) {
          line++;
          newlines[newlines.length] = rangeStart + length + cLen;
        }

        if (inExpr) {
          switch (c) {
            case '{':
              braceLevel++;
              break;

            case '}':
              braceLevel--;
              break;
          }

          if (braceLevel === 0 && i + 1 < len && values[i + 1] === '}') {
            append = true;
            type = 'tmp-source'; // Temporary token type

            inExpr = false;
          }
        } else if (c === '\\') {
          if (prev === '\\') {
            escapeCount++;
          } else {
            escapeCount = 1;
          }
        } else if (c === '$') {
          tail = prev !== '\\' || escapeCount % 2 === 0;
        } else if (c === '{') {
          if (tail && prev === '$') {
            append = true;
            type = _Template;
            inExpr = true;
          }
        }

        value += c;

        if (i === len - 1) {
          append = true;
          type = _Template;
        }

        if (append) {
          token = {
            type: type,
            value: value
          };
          lastIndex = rangeStart + length + cLen;
          prevLineIndex = this.findPrevLineIndex(newlines, lastIndex);
          columnEnd = lastIndex - prevLineIndex;

          if (type === _Template) {
            if (this.options.range) {
              token.range = [lastIndex - value.length, lastIndex];
            }

            if (this.options.loc) {
              this.addLoc(token, lineStart, columnStart, line, columnEnd);
            }

            columnStart = columnEnd + cLen;
          } else {
            lastIndex = rangeStart + length + cLen - value.length;
            prevLineIndex = this.findPrevLineIndex(newlines, lastIndex);
            token._loc = {
              line: lineStart,
              index: lastIndex,
              prevLineIndex: prevLineIndex
            };
            columnStart = columnEnd;
          }

          tokens[tokens.length] = token;
          value = '';
          lineStart = line;
          append = false;
        }

        length += cLen;
      }

      this.line = lineStart;
      this.index = lastIndex;
      this.prevLineIndex = prevLineIndex;
      return tokens;
    },
    findPrevLineIndex: function findPrevLineIndex(newlines, lastIndex) {
      for (var i = newlines.length - 1; i >= 0; --i) {
        var newline = newlines[i];

        if (lastIndex >= newline) {
          return newline;
        }
      }
    },
    // Fix Regular Expression missing matches e.g. `var g=1,a=2/3/g;`
    fixRegExpTokens: function fixRegExpTokens(matches, index, tokens, regexValue) {
      var i = tokens.length;

      while (--i >= 0) {
        var token = tokens[i];
        var type = token.type;

        if (type === _Comment || type === _WhiteSpace || type === _LineTerminator) {
          continue;
        }

        var value = token.value;

        if (type === _Punctuator) {
          if (value === ')') {
            if (this.isValidRegExpPrefix(tokens, i + 1)) {
              break;
            }
          } else if (regexPrefixRe.test(value)) {
            break;
          }
        } else if (type === _Keyword && regexPrefixRe.test(value) || type === _Template && value.slice(-2) === '${') {
          break;
        }

        var parts = regexValue.match(tokenizeNotRegExpRe);
        splice.apply(matches, [index, 1].concat(parts));
        return true;
      }

      return false;
    },
    isValidRegExpPrefix: function isValidRegExpPrefix(tokens, i) {
      var token, value, prev;
      var level = 0;

      while (--i >= 0) {
        token = tokens[i];

        if (token.type !== _Punctuator) {
          continue;
        }

        value = token.value;

        if (value === '(') {
          if (--level === 0) {
            prev = tokens[i - 1];

            if (prev && prev.type === _Keyword && regexParenWordsRe.test(prev.value)) {
              return true;
            }

            return false;
          }
        } else if (value === ')') {
          level++;
        }
      }

      return false;
    },
    _retokenize: function _retokenize(source, props) {
      var tokenizer = new Tokenizer(this.options);
      mixin(tokenizer, props);
      return tokenizer.tokenize(source);
    },
    tokenize: function tokenize(source) {
      if (source == null) {
        return [];
      }

      source = '' + source;
      var re;

      if (this.options.whiteSpace || this.options.range || this.options.loc) {
        re = tokenizeRe;
      } else {
        re = tokenizeNotWhiteSpaceRe;
      }

      var tokens = [];
      var matches = source.match(re);

      if (matches) {
        this.parseMatches(matches, tokens);
      }

      return tokens;
    }
  };
  /**
   * Tokenize a string source.
   *
   * @param {string} source Target source.
   * @param {Object} [options] Tokenize options.
   *   - comment: {boolean} (default=false)
   *         Keep comment tokens.
   *   - lineTerminator: {boolean} (default=false)
   *         Keep line feed tokens.
   *   - range: {boolean} (default=false)
   *         Include an index-based location range (array)
   *   - loc: {boolean} (default=false)
   *         Include line number and column-based location info
   * @return {string} Return an array of the parsed tokens.
   */

  var tokenize = Chiffon.tokenize = function (source, options) {
    return new Tokenizer(options).tokenize(source);
  };

  function Untokenizer(options) {
    this.options = mixin({}, options || {});
  }

  Untokenizer.prototype = {
    untokenize: function untokenize(tokens) {
      var results = [];
      var prev;

      for (var i = 0, len = tokens.length; i < len; prev = tokens[i++]) {
        var token = tokens[i];
        var tokenType = token.type;
        var tokenValue = token.value;

        if (!prev || this.options.unsafe) {
          results[results.length] = tokenValue;
          continue;
        }

        var ws;
        var prevValue = prev.value;

        if (tokenType === _Punctuator) {
          ws = signLeftRe.test(tokenValue) && signRightRe.test(prevValue);
        } else {
          ws = identLeftRe.test(tokenValue) && identRightRe.test(prevValue);
        }

        results[results.length] = (ws ? ' ' : '') + tokenValue;
      }

      return results.join('');
    }
  };
  /**
   * Concatenate to string from the parsed tokens.
   *
   * @param {Array} tokens An array of the parsed tokens.
   * @param {Object} [options] Untokenize options.
   *  - unsafe: {boolean} (default=false)
   *    Untokenizer does not add a space between the identifier and identifier.
   * @return {string} Return a concatenated string.
   */

  var untokenize = Chiffon.untokenize = function (tokens, options) {
    return new Untokenizer(options).untokenize(tokens);
  };

  var TOKEN_END = {};
  var minifyDefaultOptions = {
    maxLineLen: 32000
  };

  function Minifier(options) {
    this.options = mixin({}, options || {}, minifyDefaultOptions);
  }

  Minifier.prototype = {
    init: function init() {
      this.index = 0;
      this.lineLen = 0;
      this.current();
    },
    next: function next() {
      this.index++;
      return this.current();
    },
    current: function current() {
      this.length = this.tokens.length;
      this.prev = this.tokens[this.index - 1] || {};
      this.token = this.tokens[this.index] || TOKEN_END;
      this.value = this.token.value;
      this.type = this.token.type;
      this.lookahead = this.tokens[this.index + 1] || TOKEN_END;
      return this.token;
    },
    remove: function remove(index) {
      if (index == null) {
        index = this.index;
      }

      this.tokens.splice(index, 1);
      this.current();
    },
    insert: function insert(token) {
      this.tokens.splice(this.index + 1, 0, token);
      this.next();
    },
    eat: function eat(type) {
      type = type || _LineTerminator;

      while (this.type === type) {
        this.remove();
      }
    },
    flatten: function flatten() {
      this.init();
      this.eat();

      while (this.index < this.length) {
        if (this.type === _LineTerminator) {
          if (this.prev.type === _Punctuator || this.prev.type === _LineTerminator || this.lookahead.type === _Punctuator) {
            this.eat();
            continue;
          } else if (this.lookahead.type === _LineTerminator) {
            this.next();
            this.eat();
            continue;
          }
        }

        this.next();
      }
    },
    breakLine: function breakLine() {
      this.init();

      while (this.index < this.length) {
        if (this.type === _LineTerminator) {
          this.lineLen = 0;
        } else {
          this.lineLen += this.value.length;

          if (this.lineLen >= this.options.maxLineLen) {
            if (this.type === _Punctuator && !signRightRe.test(this.value)) {
              this.insert({
                type: _LineTerminator,
                value: '\n'
              });
              this.lineLen = 0;
            }
          }
        }

        this.next();
      }
    },
    compress: function compress() {
      this.flatten();
      this.breakLine();
    },
    minify: function minify(source) {
      this.tokens = tokenize(source, {
        lineTerminator: true
      });
      this.init();
      this.compress();
      return untokenize(this.tokens);
    }
  };
  /**
   * Minify JavaScript source.
   *
   * @param {string} source Target source.
   * @param {Object} [options] minify options.
   *   - maxLineLen: {number} (default=32000)
   *     Limit the line length in symbols.
   * @return {string} Return a minified source.
   */

  var minify = Chiffon.minify = function (source, options) {
    return new Minifier(options).minify(source);
  }; // Parser based Esprima. (http://esprima.org/)
  // Abstract syntax tree specified by ESTree. (https://github.com/estree/estree)


  var _AssignmentExpression = 'AssignmentExpression',
      _AssignmentPattern = 'AssignmentPattern',
      _ArrayExpression = 'ArrayExpression',
      _ArrayPattern = 'ArrayPattern',
      _ArrowFunctionExpression = 'ArrowFunctionExpression',
      _ArrowParameters = 'ArrowParameters',
      _BlockStatement = 'BlockStatement',
      _BinaryExpression = 'BinaryExpression',
      _BreakStatement = 'BreakStatement',
      _CallExpression = 'CallExpression',
      _CatchClause = 'CatchClause',
      _ClassBody = 'ClassBody',
      _ClassDeclaration = 'ClassDeclaration',
      _ClassExpression = 'ClassExpression',
      _ConditionalExpression = 'ConditionalExpression',
      _ContinueStatement = 'ContinueStatement',
      _DoWhileStatement = 'DoWhileStatement',
      _DebuggerStatement = 'DebuggerStatement',
      _EmptyStatement = 'EmptyStatement',
      _ExportAllDeclaration = 'ExportAllDeclaration',
      _ExportDefaultDeclaration = 'ExportDefaultDeclaration',
      _ExportNamedDeclaration = 'ExportNamedDeclaration',
      _ExportSpecifier = 'ExportSpecifier',
      _ExpressionStatement = 'ExpressionStatement',
      _ForStatement = 'ForStatement',
      _ForOfStatement = 'ForOfStatement',
      _ForInStatement = 'ForInStatement',
      _FunctionDeclaration = 'FunctionDeclaration',
      _FunctionExpression = 'FunctionExpression',
      _IfStatement = 'IfStatement',
      _ImportDeclaration = 'ImportDeclaration',
      _ImportDefaultSpecifier = 'ImportDefaultSpecifier',
      _ImportNamespaceSpecifier = 'ImportNamespaceSpecifier',
      _ImportSpecifier = 'ImportSpecifier',
      _Literal = 'Literal',
      _LabeledStatement = 'LabeledStatement',
      _LogicalExpression = 'LogicalExpression',
      _MemberExpression = 'MemberExpression',
      _MethodDefinition = 'MethodDefinition',
      _NewExpression = 'NewExpression',
      _ObjectExpression = 'ObjectExpression',
      _ObjectPattern = 'ObjectPattern',
      _Program = 'Program',
      _Property = 'Property',
      _RestElement = 'RestElement',
      _ReturnStatement = 'ReturnStatement',
      _SequenceExpression = 'SequenceExpression',
      _SpreadElement = 'SpreadElement',
      _Super = 'Super',
      _SwitchCase = 'SwitchCase',
      _SwitchStatement = 'SwitchStatement',
      _TaggedTemplateExpression = 'TaggedTemplateExpression',
      _TemplateElement = 'TemplateElement',
      _TemplateLiteral = 'TemplateLiteral',
      _ThisExpression = 'ThisExpression',
      _ThrowStatement = 'ThrowStatement',
      _TryStatement = 'TryStatement',
      _UnaryExpression = 'UnaryExpression',
      _UpdateExpression = 'UpdateExpression',
      _VariableDeclaration = 'VariableDeclaration',
      _VariableDeclarator = 'VariableDeclarator',
      _WhileStatement = 'WhileStatement',
      _WithStatement = 'WithStatement',
      _YieldExpression = 'YieldExpression';
  var assignOpRe = /^(?:[-+*%\/&|]?=|>>>?=|<<=)$/;
  var unaryOpRe = /^(?:[-+!~]|\+\+|--|typeof|void|delete)$/;
  var octalDigitRe = /^0[0-7]+$/;

  function Parser(options) {
    this.options = mixin({}, options || {});
  }

  Parser.prototype = {
    next: function next() {
      if (this.token === TOKEN_END) {
        this.unexpected();
      }

      this.token = this.tokens[++this.index] || TOKEN_END;
      this.value = this.token.value;
      this.type = this.token.type;
    },
    lookahead: function lookahead() {
      return this.tokens[this.index + 1] || TOKEN_END;
    },
    assertValue: function assertValue(value) {
      if (this.value !== value) {
        this.unexpected();
      }
    },
    assertType: function assertType(type) {
      if (this.type !== type) {
        this.unexpected();
      }
    },
    expect: function expect(value) {
      if (this.value !== value) {
        this.unexpected();
      }

      this.next();
    },
    expectType: function expectType(type) {
      if (this.type !== type) {
        this.unexpected();
      }

      this.next();
    },
    expectSemicolon: function expectSemicolon() {
      if (this.value === ';') {
        this.next();
        return true;
      }

      if (this.value === '}' || this.token.hasLineTerminator || this.token === TOKEN_END) {
        return true;
      }

      this.unexpected();
    },
    unexpected: function unexpected() {
      var message = 'Unexpected';

      if (this.token === TOKEN_END) {
        message += ' end of input';
      } else {
        var token = this.value || '';

        if (token.length > 16) {
          token = token.substr(0, 16) + '...';
        }

        message += " token '" + token + "'";
      }

      this.throwError(message);
    },
    throwError: function throwError(message) {
      var loc = this.token.loc;

      if (loc) {
        message += ' at line ' + loc.start.line + ' column ' + loc.start.column;
      }

      throw new Error(message);
    },
    startNode: function startNode(type) {
      var node = {};
      this.startNodeAt(node);
      node.type = type;
      return node;
    },
    finishNode: function finishNode(node) {
      if (this.lastGroup && this.lastGroup.expr === node) {
        // Restore the kept position
        var startNode = this.lastGroup.startNode;
        var endToken = this.lastGroup.endToken;
        this.lastGroup = null;
        this.startNodeAt(node, startNode);
        return this.finishNodeAt(node, endToken);
      }

      return this.finishNodeAt(node);
    },
    startNodeAt: function startNodeAt(node, startNode) {
      startNode = startNode || this.token;

      if (startNode === TOKEN_END) {
        if (this.length === 0) {
          startNode = this.getInitialLocationNode();
        } else {
          this.unexpected();
        }
      }

      if (this.options.range) {
        node.range = node.range || [];
        node.range[0] = startNode.range[0];
      }

      if (this.options.loc) {
        var loc = startNode.loc;
        node.loc = node.loc || {};
        node.loc.start = {
          line: loc.start.line,
          column: loc.start.column
        };
      }

      return node;
    },
    finishNodeAt: function finishNodeAt(node, finishNode) {
      finishNode = finishNode || this.tokens[this.index - 1];

      if (!finishNode) {
        if (this.length === 0) {
          finishNode = this.getInitialLocationNode();
        } else {
          this.unexpected();
        }
      }

      if (this.options.range) {
        node.range[1] = finishNode.range[1];
      }

      if (this.options.loc) {
        node.loc.end = {
          line: finishNode.loc.end.line,
          column: finishNode.loc.end.column
        };
      }

      return node;
    },
    getInitialLocationNode: function getInitialLocationNode() {
      return {
        range: [0, 0],
        loc: {
          start: {
            line: 0,
            column: 0
          },
          end: {
            line: 0,
            column: 0
          }
        }
      };
    },
    // ECMA-262 11.8.3 Numeric Literals
    parseNumeric: function parseNumeric(value) {
      var i = 0;
      var c = value.charAt(i++);
      var n;

      if (c === '0') {
        c = value.charAt(i++);
        n = value.substring(i);

        if (c !== '.') {
          switch (c.toLowerCase()) {
            case 'x':
              return parseInt(n, 16);

            case 'o':
              return parseInt(n, 8);

            case 'b':
              return parseInt(n, 2);
          }

          if (octalDigitRe.test(value)) {
            return parseInt(c + n, 8);
          }
        }
      }

      return parseFloat(value);
    },
    // ECMA-262 11.8.4 String Literals
    parseString: function parseString(value) {
      var s = '';
      var i = 1;
      var len = value.length - 1;
      var c, c2, hex, n, index, length;

      while (i < len) {
        c = value.charAt(i++);

        if (c === '\\') {
          if (i < len) {
            c2 = value.charCodeAt(i);

            if (isLineTerminator(c2)) {
              i++;

              if (c2 === 0x0D && i < len && value.charCodeAt(i) === 0x0A) {
                i++;
              }

              continue;
            }
          }

          c = value.charAt(i++);

          switch (c) {
            case 'b':
              c = '\b';
              break;

            case 't':
              c = '\t';
              break;

            case 'r':
              c = '\r';
              break;

            case 'n':
              c = '\n';
              break;

            case 'v':
              c = '\x0B';
              break;

            case 'f':
              c = '\f';
              break;

            case 'u':
            case 'x':
              if (c === 'u' && i < len && value.charAt(i) === '{') {
                i++;
                index = value.indexOf('}', i);

                if (!~index) {
                  this.unexpected();
                }

                hex = value.substring(i, index);
                i = index + 1;
              } else {
                length = c === 'u' ? 4 : 2;
                hex = value.substr(i, length);
                i += length;
              }

              c = fromCodePoint(parseInt(hex, 16));
              break;

            default:
              if (isOctalDigit(c)) {
                n = c;

                do {
                  c = value.charAt(i);

                  if (!isOctalDigit(c)) {
                    break;
                  }

                  n += c;
                } while (i++ < len && n.length < 3);

                if (n.length > 0 && n.charAt(0) === '0') {
                  n = n.substring(1);
                }

                c = fromCharCode(parseInt(n, 8));
              }

          }
        }

        s += c;
      }

      return s;
    },
    parseLiteral: function parseLiteral() {
      var node = this.startNode(_Literal);
      var raw = this.value;
      var value, regex;

      switch (this.type) {
        case _Numeric:
          value = this.parseNumeric(raw);
          break;

        case _String:
          value = this.parseString(raw);
          break;

        case _RegularExpression:
          regex = this.token.regex;

          try {
            value = new RegExp(regex.pattern, regex.flags);
          } catch (e) {
            value = null;
          }

          break;

        case _Boolean:
          value = raw === 'true';
          break;

        case _Null:
          value = null;
          break;

        default:
          this.unexpected();
      }

      this.next();
      node.value = value;
      node.raw = raw;

      if (regex) {
        node.regex = regex;
      }

      return this.finishNode(node);
    },
    parseIdentifier: function parseIdentifier(allowKeyword) {
      var node = this.startNode(_Identifier);
      var name = this.value;

      if (allowKeyword) {
        this.next();
      } else {
        this.expectType(_Identifier);
      }

      node.name = name;
      return this.finishNode(node);
    },
    parseCommaSeparatedElements: function parseCommaSeparatedElements(start, end, elems, callback, args) {
      this.expect(start);

      while (this.value !== end) {
        elems[elems.length] = callback.apply(this, args);

        if (this.value !== end) {
          this.expect(',');
        }
      }

      this.expect(end);
      return elems;
    },
    // ECMA-262 12.2 Primary Expression
    parsePrimaryExpression: function parsePrimaryExpression() {
      switch (this.type) {
        case _Numeric:
        case _String:
        case _RegularExpression:
        case _Boolean:
        case _Null:
          return this.parseLiteral();

        case _Identifier:
          return this.parseIdentifier();

        case _Keyword:
          return this.parsePrimaryKeywordExpression();

        case _Punctuator:
          return this.parsePrimaryPunctuatorExpression();

        case _Template:
          return this.parseTemplateLiteral();

        default:
          this.unexpected();
      }
    },
    parsePrimaryKeywordExpression: function parsePrimaryKeywordExpression() {
      switch (this.value) {
        case 'function':
          return this.parseFunctionExpression();

        case 'class':
          return this.parseClassExpression();

        case 'this':
          return this.parseThisExpression();
      }

      this.unexpected();
    },
    parseThisExpression: function parseThisExpression() {
      var node = this.startNode(_ThisExpression);
      this.expect('this');
      return this.finishNode(node);
    },
    parsePrimaryPunctuatorExpression: function parsePrimaryPunctuatorExpression() {
      switch (this.value) {
        case '{':
          return this.parseObjectInitializer();

        case '[':
          return this.parseArrayInitializer();

        case '(':
          return this.parseGroupExpression();

        default:
          this.unexpected();
      }
    },
    parseGroupExpression: function parseGroupExpression() {
      var startNode = this.startNode();
      this.expect('(');

      if (this.value === ')') {
        this.next();
        this.assertValue('=>');
        return {
          type: _ArrowParameters,
          params: [],
          startNode: startNode
        };
      }

      var node = this.startNode();
      var expr = this.parseExpression(true); // Keep the current position for expression

      this.lastGroup = {
        expr: expr,
        startNode: node,
        endToken: this.tokens[this.index - 1]
      };
      this.expect(')');

      if (this.value === '=>') {
        var params = [];

        if (expr.type === _SequenceExpression) {
          params = expr.expressions;
        } else if (expr.type === _Identifier) {
          params = [expr];
        } else {
          this.unexpected();
        }

        expr = {
          type: _ArrowParameters,
          params: params,
          startNode: startNode
        };
      }

      return expr;
    },
    // ECMA-262 12.2.6 Object Initializer
    parseObjectInitializer: function parseObjectInitializer() {
      var node = this.startNode(_ObjectExpression);
      node.properties = this.parseCommaSeparatedElements('{', '}', [], this.parseObjectDefinition);
      return this.finishNode(node);
    },
    parseObjectDefinition: function parseObjectDefinition() {
      var node;

      if (this.value === 'get' || this.value === 'set') {
        node = this.parseObjectGetterSetter();
      } else {
        node = this.parseObjectProperty();
      }

      return node;
    },
    parseObjectProperty: function parseObjectProperty() {
      var node = this.startNode(_Property);
      var computed = false;
      var generator;

      if (this.value === '*') {
        generator = true;
        this.next();
      } else if (this.value === '[') {
        computed = true;
      }

      var key = this.parseObjectPropertyName();
      var value;

      if (this.value === ':') {
        this.next();
        value = this.parseAssignmentExpression(true);
      } else if (this.value === '(') {
        value = this.parseFunction({
          expression: true,
          generator: generator
        });
      } else if (key.type === _Identifier) {
        if (this.value === '=') {
          value = this.parseAssignmentPattern(key);
        } else {
          value = key;
        }
      } else {
        this.unexpected();
      }

      node.key = key;
      node.computed = computed;
      node.value = value;
      node.kind = 'init';
      return this.finishNode(node);
    },
    parseObjectGetterSetter: function parseObjectGetterSetter() {
      var node = this.startNode(_Property);
      var lookahead = this.lookahead();
      var computed = false;
      var kind = 'init';
      var key, value;

      if (lookahead.value === ':') {
        key = this.parseObjectPropertyName();
        this.next();
        value = this.parseAssignmentExpression(true);
      } else if (lookahead.value === '(') {
        key = this.parseObjectPropertyName();
        value = this.parseFunction({
          expression: true
        });
      } else {
        kind = this.value;
        this.next();

        if (this.value === '[') {
          computed = true;
        }

        if (computed || this.type === _Identifier || this.type === _Keyword || this.type === _String || this.type === _Numeric) {
          key = this.parseObjectPropertyName();
          value = this.parseFunction({
            getter: kind === 'get',
            setter: kind === 'set',
            expression: true
          });
        } else {
          this.unexpected();
        }
      }

      node.key = key;
      node.computed = computed;
      node.value = value;
      node.kind = kind;
      return this.finishNode(node);
    },
    parseObjectPropertyName: function parseObjectPropertyName() {
      var node;

      switch (this.type) {
        case _String:
        case _Numeric:
          return this.parseLiteral();

        case _Punctuator:
          if (this.value === '[') {
            this.next();
            node = this.parseAssignmentExpression();
            this.expect(']');
            return node;
          }

          break;

        case _Keyword:
        case _Identifier:
        case _Boolean:
        case _Null:
          return this.parseIdentifier(true);
      }

      this.unexpected();
    },
    // ECMA-262 12.2.5 Array Initializer
    parseArrayInitializer: function parseArrayInitializer() {
      var node = this.startNode(_ArrayExpression);
      var elems = [];
      this.expect('[');

      while (this.value !== ']') {
        if (this.value === ',') {
          this.next();
          elems[elems.length] = null;
          continue;
        }

        if (this.value === '...') {
          elems[elems.length] = this.parseSpreadElement();
        } else {
          elems[elems.length] = this.parseAssignmentExpression(true);
        }

        if (this.value !== ']') {
          this.expect(',');
        }
      }

      this.expect(']');
      node.elements = elems;
      return this.finishNode(node);
    },
    parseSpreadElement: function parseSpreadElement() {
      var node = this.parseRestElement();
      node.type = _SpreadElement;
      return node;
    },
    // ECMA-262 A.2 Expressions
    parseExpression: function parseExpression(allowIn) {
      var node = this.startNode(_SequenceExpression);
      var expr = this.parseAssignmentExpression(allowIn);

      if (this.value !== ',') {
        return expr;
      }

      var exprs = [expr];

      do {
        this.next();
        exprs[exprs.length] = this.parseAssignmentExpression(allowIn);
      } while (this.value === ',');

      node.expressions = exprs;
      return this.finishNode(node);
    },
    reinterpretExpression: function reinterpretExpression(expr) {
      var i, len;

      switch (expr.type) {
        case _AssignmentExpression:
          expr.type = _AssignmentPattern;
          this.reinterpretExpression(expr.left);
          break;

        case _ArrayExpression:
          expr.type = _ArrayPattern;

          for (i = 0, len = expr.elements.length; i < len; i++) {
            if (expr.elements[i] !== null) {
              this.reinterpretExpression(expr.elements[i]);
            }
          }

          break;

        case _ObjectExpression:
          expr.type = _ObjectPattern;

          for (i = 0, len = expr.properties.length; i < len; i++) {
            this.reinterpretExpression(expr.properties[i].value);
          }

      }
    },
    parseAssignmentExpression: function parseAssignmentExpression(allowIn) {
      if (this.inGenerator && this.value === 'yield') {
        return this.parseYieldExpression();
      }

      var node = this.startNode(_AssignmentExpression);
      var left = this.parseConditionalExpression(allowIn);

      if (this.value === '=>' || left.type === _ArrowParameters) {
        if (left.type === _Identifier) {
          left.params = [mixin({}, left)];
          left.startNode = node;
        }

        return this.parseArrowFunctionExpression(left);
      }

      if (!assignOpRe.test(this.value)) {
        return left;
      }

      this.reinterpretExpression(left);
      var operator = this.value;
      this.next();
      var right = this.parseAssignmentExpression(allowIn);
      node.operator = operator;
      node.left = left;
      node.right = right;
      return this.finishNode(node);
    },
    parseConditionalExpression: function parseConditionalExpression(allowIn) {
      var node = this.startNode(_ConditionalExpression);
      var expr = this.parseBinaryExpression(allowIn);

      if (this.value !== '?') {
        return expr;
      }

      this.expect('?');
      var consequent = this.parseAssignmentExpression(true);
      this.expect(':');
      var alternate = this.parseAssignmentExpression(allowIn);
      node.test = expr;
      node.consequent = consequent;
      node.alternate = alternate;
      return this.finishNode(node);
    },
    parseArrowFunctionExpression: function parseArrowFunctionExpression(expr) {
      var node = this.startNode(_ArrowFunctionExpression);
      this.startNodeAt(node, expr.startNode);
      this.expect('=>');
      var params = expr.params || [];
      var expression = false;
      var body;

      if (this.value === '{') {
        body = this.parseBlockStatement();
      } else {
        body = this.parseAssignmentExpression(true);
        expression = true;
      }

      node.params = params;
      node.body = body;
      node.expression = expression;
      return this.finishNode(node);
    },
    parseYieldExpression: function parseYieldExpression() {
      var node = this.startNode(_YieldExpression);
      var argument = null;
      var delegate = false;
      this.expect('yield');

      if (!this.token.hasLineTerminator) {
        if (this.value === '*') {
          delegate = true;
          this.next();
          argument = this.parseAssignmentExpression(true);
        } else if (this.value !== ';' && this.value !== '}' && this.token !== TOKEN_END) {
          argument = this.parseAssignmentExpression(true);
        }
      }

      node.argument = argument;
      node.delegate = delegate;
      return this.finishNode(node);
    },
    getBinaryPrecedence: function getBinaryPrecedence(allowIn) {
      switch (this.value) {
        case '*':
        case '/':
        case '%':
          return 1;

        case '+':
        case '-':
          return 2;

        case '<<':
        case '>>':
        case '>>>':
          return 3;

        case '<':
        case '>':
        case '<=':
        case '>=':
        case 'instanceof':
          return 4;

        case 'in':
          return allowIn ? 4 : 0;

        case '==':
        case '!=':
        case '===':
        case '!==':
          return 5;

        case '&':
          return 6;

        case '^':
          return 7;

        case '|':
          return 8;

        case '&&':
          return 9;

        case '||':
          return 10;

        default:
          return 0;
      }
    },
    parseBinaryExpression: function parseBinaryExpression(allowIn, base) {
      if (base == null) {
        base = 10;
      }

      var startNode = this.startNode();
      var left = this.parseUnaryExpression();
      var prec = this.getBinaryPrecedence(allowIn);

      if (!prec) {
        return left;
      }

      var right, operator, node;

      for (var i = 1; i <= 10; i++) {
        while ((prec = this.getBinaryPrecedence(allowIn)) === i) {
          operator = this.value;
          node = this.startNode(i < 9 ? _BinaryExpression : _LogicalExpression);
          this.startNodeAt(node, startNode);
          node.operator = operator;
          node.left = left;
          this.next();

          if (prec === 1) {
            right = this.parseUnaryExpression();
          } else {
            right = this.parseBinaryExpression(allowIn, prec - 1);
          }

          node.right = right;
          left = this.finishNode(node);
        }

        if (base < prec) {
          break;
        }
      }

      this.startNodeAt(left, startNode);
      return this.finishNode(left);
    },
    parseUnaryExpression: function parseUnaryExpression() {
      var value = this.value;

      if (!unaryOpRe.test(value)) {
        return this.parsePostfixExpression();
      }

      var isUpdate = value === '++' || value === '--';
      var node = this.startNode(isUpdate ? _UpdateExpression : _UnaryExpression);
      this.next();
      var argument = this.parseUnaryExpression();
      node.operator = value;
      node.argument = argument;
      node.prefix = true;
      return this.finishNode(node);
    },
    parsePostfixExpression: function parsePostfixExpression() {
      var node = this.startNode(_UpdateExpression);
      var expr = this.parseMemberExpression(true);
      var value = this.value;

      if (value === '++' || value === '--') {
        this.next();
        node.operator = value;
        node.argument = expr;
        node.prefix = false;
        return this.finishNode(node);
      }

      return expr;
    },
    parseMemberExpression: function parseMemberExpression(allowCall) {
      var node = this.startNode();
      var expr;

      if (this.value === 'super') {
        expr = this.parseSuper();
      } else if (this.value === 'new') {
        expr = this.parseNewExpression();
      } else {
        expr = this.parsePrimaryExpression();
      }

      for (;;) {
        if (this.value === '.') {
          expr = this.parseNonComputedMember(expr, node);
        } else if (this.value === '[') {
          expr = this.parseComputedMember(expr, node);
        } else if (allowCall && this.value === '(') {
          expr = this.parseCallExpression(expr, node);
        } else if (this.type === _Template && this.value.charAt(0) === '`') {
          expr = this.parseTaggedTemplateExpression(expr, node);
        } else {
          break;
        }
      }

      return expr;
    },
    parseSuper: function parseSuper() {
      var node = this.startNode(_Super);
      this.expect('super');
      return this.finishNode(node);
    },
    parseNewExpression: function parseNewExpression() {
      var node = this.startNode(_NewExpression);
      this.next();
      var callee = this.parseMemberExpression(false);
      node.callee = callee;
      node.arguments = [];

      if (this.value === '(') {
        this.parseArguments(node);
      }

      return this.finishNode(node);
    },
    parseCallExpression: function parseCallExpression(expr, startNode) {
      var node = this.startNode(_CallExpression);
      this.startNodeAt(node, startNode);
      node.callee = expr;
      node.arguments = [];
      this.parseArguments(node);
      return this.finishNode(node);
    },
    parseComputedMember: function parseComputedMember(expr, startNode) {
      var node = this.startNode(_MemberExpression);
      this.startNodeAt(node, startNode);
      this.next();
      node.computed = true;
      node.object = expr;
      node.property = this.parseExpression(true);
      this.expect(']');
      return this.finishNode(node);
    },
    parseNonComputedMember: function parseNonComputedMember(expr, startNode) {
      var node = this.startNode(_MemberExpression);
      this.startNodeAt(node, startNode);
      this.next();
      node.computed = false;
      node.object = expr;
      node.property = this.parseIdentifier();
      return this.finishNode(node);
    },
    parseArguments: function parseArguments(node) {
      this.parseCommaSeparatedElements('(', ')', node.arguments, this.parseAssignmentExpression, [true]);
      return node;
    },
    parseTemplateLiteral: function parseTemplateLiteral() {
      var node = this.startNode(_TemplateLiteral);
      var quasi = this.parseTemplateElement();
      var quasis = [quasi];
      var exprs = [];

      while (!quasi.tail) {
        exprs[exprs.length] = this.parseExpression();
        quasi = this.parseTemplateElement();
        quasis[quasis.length] = quasi;
      }

      node.quasis = quasis;
      node.expressions = exprs;
      return this.finishNode(node);
    },
    parseTemplateElement: function parseTemplateElement() {
      var node = this.startNode(_TemplateElement);
      var tail = false;
      var raw;
      this.assertType(_Template);

      if (this.value.slice(-1) === '`') {
        tail = true;
      }

      var endPos = tail ? -1 : -2;
      raw = this.value.slice(1, endPos);
      var cooked = this.parseString('`' + raw + '`');
      this.next();
      node.tail = tail;
      node.value = {
        cooked: cooked,
        raw: raw
      };
      return this.finishNode(node);
    },
    parseTaggedTemplateExpression: function parseTaggedTemplateExpression(tag, startNode) {
      var node = this.startNode(_TaggedTemplateExpression);
      this.startNodeAt(node, startNode);
      var quasi = this.parseTemplateLiteral();
      node.tag = tag;
      node.quasi = quasi;
      return this.finishNode(node);
    },
    // ECMA-262 13 ECMAScript Language: Statements and Declarations
    parseStatement: function parseStatement() {
      switch (this.value) {
        case '{':
          return this.parseBlockStatement();

        case 'var':
        case 'let':
        case 'const':
          return this.parseVariableStatement(this.value);

        case ';':
          return this.parseEmptyStatement();

        case 'if':
          return this.parseIfStatement();

        case 'continue':
          return this.parseContinueStatement();

        case 'break':
          return this.parseBreakStatement();

        case 'return':
          return this.parseReturnStatement();

        case 'with':
          return this.parseWithStatement();

        case 'throw':
          return this.parseThrowStatement();

        case 'try':
          return this.parseTryStatement();

        case 'debugger':
          return this.parseDebuggerStatement();

        case 'function':
          return this.parseFunctionDeclaration();

        case 'class':
          return this.parseClassDeclaration();

        case 'switch':
          return this.parseSwitchStatement();

        case 'do':
          return this.parseDoWhileStatement();

        case 'while':
          return this.parseWhileStatement();

        case 'for':
          return this.parseForStatement();

        case 'import':
          return this.parseImportDeclaration();

        case 'export':
          return this.parseExportDeclaration();

        default:
          return this.parseMaybeExpressionStatement();
      }
    },
    parseScriptBody: function parseScriptBody(body, end) {
      while (this.value !== end) {
        body[body.length] = this.parseStatement();
      }
    },
    parseBlockStatement: function parseBlockStatement() {
      var node = this.startNode(_BlockStatement);
      this.expect('{');
      var body = [];
      this.parseScriptBody(body, '}');
      this.expect('}');
      node.body = body;
      return this.finishNode(node);
    },
    // ECMA-262 13.3.2 Variable Statement
    parseVariableStatement: function parseVariableStatement(kind, inFor) {
      var node = this.startNode(_VariableDeclaration);
      var allowIn = !inFor;
      var declarations = this.parseVariableDeclarationList(allowIn);

      if (!inFor) {
        this.expectSemicolon();
      }

      node.declarations = declarations;
      node.kind = kind;
      return this.finishNode(node);
    },
    parseVariableDeclarationList: function parseVariableDeclarationList(allowIn) {
      var list = [];

      do {
        list[list.length] = this.parseVariableDeclaration(allowIn);
      } while (this.value === ',');

      return list;
    },
    parseVariableDeclaration: function parseVariableDeclaration(allowIn) {
      this.next();
      var node = this.startNode(_VariableDeclarator);
      var id = this.parseBindingPattern();
      var init = null;

      if (this.value === '=') {
        this.next();
        init = this.parseAssignmentExpression(allowIn);
      }

      node.id = id;
      node.init = init;
      return this.finishNode(node);
    },
    // ECMA-262 14.1 Function Definitions
    parseFunctionDeclaration: function parseFunctionDeclaration() {
      return this.parseFunctionDefinition();
    },
    parseFunctionExpression: function parseFunctionExpression() {
      return this.parseFunctionDefinition(true);
    },
    parseFunctionDefinition: function parseFunctionDefinition(expression) {
      var node = this.startNode();
      var generator = false;
      this.expect('function');

      if (this.value === '*') {
        generator = true;
        this.next();
      }

      return this.parseFunction({
        node: node,
        generator: generator,
        expression: expression
      });
    },
    parseFunction: function parseFunction(options) {
      options = options || {};
      var node = options.node || this.startNode();
      node.type = options.expression ? _FunctionExpression : _FunctionDeclaration;
      node.id = null;
      node.params = [];
      node.defaults = [];
      node.body = null;
      node.generator = !!options.generator;
      node.expression = false;

      if (options.getter) {
        this.expect('(');
        this.expect(')');
      } else if (options.setter) {
        this.parseParams(node);
      } else {
        if (this.type === _Identifier) {
          node.id = this.parseIdentifier();
        }

        this.parseParams(node);
      }

      var prevInGenerator = this.inGenerator;
      this.inGenerator = node.generator;
      node.body = this.parseBlockStatement();
      this.inGenerator = prevInGenerator;
      return this.finishNode(node);
    },
    parseParams: function parseParams(node) {
      this.expect('(');

      while (this.value !== ')') {
        if (!this.parseParam(node)) {
          break;
        }
      }

      if (!node._hasDefaults) {
        node.defaults.length = 0;
      } else {
        delete node._hasDefaults;
      }

      this.expect(')');
    },
    parseParam: function parseParam(node) {
      var params = node.params;
      var defaults = node.defaults;

      if (this.value === '...') {
        params[params.length] = this.parseRestElement();
        defaults[defaults.length] = null;
        return false;
      }

      var pattern = this.parseBindingElement();

      if (pattern.type === _AssignmentPattern) {
        params[params.length] = pattern.left;
        defaults[defaults.length] = pattern.right;
        node._hasDefaults = true;
      } else {
        params[params.length] = pattern;
        defaults[defaults.length] = null;
      }

      if (this.value !== ')') {
        this.expect(',');
      }

      return true;
    },
    parseRestElement: function parseRestElement() {
      var node = this.startNode(_RestElement);
      this.expect('...');
      var argument = this.parseIdentifier();
      node.argument = argument;
      return this.finishNode(node);
    },
    // ECMA-262 13.3.3 Destructuring Binding Patterns
    parseBindingPattern: function parseBindingPattern() {
      if (this.type === _Identifier) {
        return this.parseIdentifier();
      }

      if (this.value === '{') {
        return this.parseObjectPattern();
      }

      if (this.value === '[') {
        return this.parseArrayPattern();
      }

      this.unexpected();
    },
    parseBindingElement: function parseBindingElement() {
      var pattern = this.parseBindingPattern();

      if (this.value === '=') {
        return this.parseAssignmentPattern(pattern);
      }

      return pattern;
    },
    parseAssignmentPattern: function parseAssignmentPattern(left) {
      this.expect('=');
      var node = this.startNode(_AssignmentPattern);
      this.startNodeAt(node, left);
      var right = this.parseAssignmentExpression(true);
      node.left = left;
      node.right = right;
      return this.finishNode(node);
    },
    parseArrayPattern: function parseArrayPattern() {
      var node = this.startNode(_ArrayPattern);
      var elems = [];
      this.expect('[');

      while (this.value !== ']') {
        if (this.value === ',') {
          elems[elems.length] = null;
        } else {
          if (this.value === '...') {
            elems[elems.length] = this.parseRestElement();
            break;
          }

          elems[elems.length] = this.parseBindingElement();
        }

        if (this.value !== ']') {
          this.expect(',');
        }
      }

      this.expect(']');
      node.elements = elems;
      return this.finishNode(node);
    },
    parseObjectPattern: function parseObjectPattern() {
      var node = this.startNode(_ObjectPattern);
      node.properties = this.parseCommaSeparatedElements('{', '}', [], this.parseObjectPropertyPattern);
      return this.finishNode(node);
    },
    parseObjectPropertyPattern: function parseObjectPropertyPattern() {
      var node = this.startNode(_Property);
      var key, value;

      if (this.type === _Identifier) {
        key = this.parseIdentifier();

        if (this.value === '=') {
          value = this.parseAssignmentPattern(key);
          this.startNodeAt(value, node);
        } else if (this.value !== ':') {
          value = key;
        }
      } else {
        key = this.parseObjectPropertyName();
      }

      if (!value) {
        this.expect(':');
        value = this.parseBindingElement();
      }

      node.key = key;
      node.value = value;
      node.kind = 'init';
      return this.finishNode(node);
    },
    // ECMA-262 13 Statements and Declarations
    parseIfStatement: function parseIfStatement() {
      var node = this.startNode(_IfStatement);
      this.expect('if');
      this.expect('(');
      var expr = this.parseExpression(true);
      this.expect(')');
      var consequent = this.parseStatement();
      var alternate = null;

      if (this.value === 'else') {
        this.next();
        alternate = this.parseStatement();
      }

      node.test = expr;
      node.consequent = consequent;
      node.alternate = alternate;
      return this.finishNode(node);
    },
    parseEmptyStatement: function parseEmptyStatement() {
      var node = this.startNode(_EmptyStatement);
      this.expect(';');
      return this.finishNode(node);
    },
    parseContinueStatement: function parseContinueStatement() {
      var node = this.startNode(_ContinueStatement);
      this.expect('continue');
      var label = null;

      if (this.type === _Identifier && !this.token.hasLineTerminator) {
        label = this.parseIdentifier();
      }

      this.expectSemicolon();
      node.label = label;
      return this.finishNode(node);
    },
    parseBreakStatement: function parseBreakStatement() {
      var node = this.startNode(_BreakStatement);
      this.expect('break');
      var label = null;

      if (this.type === _Identifier && !this.token.hasLineTerminator) {
        label = this.parseIdentifier();
      }

      this.expectSemicolon();
      node.label = label;
      return this.finishNode(node);
    },
    parseReturnStatement: function parseReturnStatement() {
      var node = this.startNode(_ReturnStatement);
      this.expect('return');
      var argument = null;

      if (this.value !== ';' && this.value !== '}' && !this.token.hasLineTerminator && this.token !== TOKEN_END) {
        argument = this.parseExpression(true);
      }

      this.expectSemicolon();
      node.argument = argument;
      return this.finishNode(node);
    },
    parseWithStatement: function parseWithStatement() {
      var node = this.startNode(_WithStatement);
      this.expect('with');
      this.expect('(');
      var expr = this.parseExpression(true);
      this.expect(')');
      node.object = expr;
      node.body = this.parseStatement();
      return this.finishNode(node);
    },
    parseThrowStatement: function parseThrowStatement() {
      var node = this.startNode(_ThrowStatement);
      this.expect('throw');

      if (this.token.hasLineTerminator) {
        this.unexpected();
      }

      var expr = this.parseExpression(true);
      this.expectSemicolon();
      node.argument = expr;
      return this.finishNode(node);
    },
    parseTryStatement: function parseTryStatement() {
      var node = this.startNode(_TryStatement);
      var handler = null;
      var finalizer = null;
      var hasCatch, hasFinally;
      this.expect('try');
      var block = this.parseBlockStatement();

      if (this.value === 'catch') {
        hasCatch = true;
        handler = this.parseCatchClause();
      }

      if (this.value === 'finally') {
        hasFinally = true;
        this.next();
        finalizer = this.parseBlockStatement();
      }

      if (!hasCatch && !hasFinally) {
        this.unexpected();
      }

      node.block = block;
      node.handler = handler;
      node.finalizer = finalizer;
      return this.finishNode(node);
    },
    parseCatchClause: function parseCatchClause() {
      var node = this.startNode(_CatchClause);
      this.expect('catch');
      this.expect('(');
      var param = this.parseBindingPattern();
      this.expect(')');
      var body = this.parseBlockStatement();
      node.param = param;
      node.body = body;
      return this.finishNode(node);
    },
    parseDebuggerStatement: function parseDebuggerStatement() {
      var node = this.startNode(_DebuggerStatement);
      this.expect('debugger');
      this.expectSemicolon();
      return this.finishNode(node);
    },
    parseSwitchStatement: function parseSwitchStatement() {
      var node = this.startNode(_SwitchStatement);
      this.expect('switch');
      this.expect('(');
      var expr = this.parseExpression(true);
      var cases = [];
      this.expect(')');
      this.expect('{');

      while (this.value !== '}') {
        cases[cases.length] = this.parseSwitchCase();
      }

      this.expect('}');
      node.discriminant = expr;
      node.cases = cases;
      return this.finishNode(node);
    },
    parseSwitchCase: function parseSwitchCase() {
      var node = this.startNode(_SwitchCase);
      var test = null;
      var consequent = [];

      if (this.value === 'case') {
        this.next();
        test = this.parseExpression(true);
      } else {
        this.expect('default');
      }

      this.expect(':');

      while (this.value !== '}' && this.value !== 'case' && this.value !== 'default' && this.token !== TOKEN_END) {
        consequent[consequent.length] = this.parseStatement();
      }

      node.test = test;
      node.consequent = consequent;
      return this.finishNode(node);
    },
    parseWhileStatement: function parseWhileStatement() {
      var node = this.startNode(_WhileStatement);
      this.expect('while');
      this.expect('(');
      var expr = this.parseExpression(true);
      this.expect(')');
      node.test = expr;
      node.body = this.parseStatement();
      return this.finishNode(node);
    },
    parseDoWhileStatement: function parseDoWhileStatement() {
      var node = this.startNode(_DoWhileStatement);
      this.expect('do');
      var body = this.parseStatement();
      this.expect('while');
      this.expect('(');
      var expr = this.parseExpression(true);
      this.expect(')');
      this.expectSemicolon();
      node.body = body;
      node.test = expr;
      return this.finishNode(node);
    },
    parseForStatement: function parseForStatement() {
      var node = this.startNode(_ForStatement);
      this.expect('for');
      this.expect('(');
      var init = null;

      if (this.value !== ';') {
        if (this.value === 'var' || this.value === 'let' || this.value === 'const') {
          init = this.parseForVarStatement(node);
        } else {
          init = this.parseForExpressionStatement(node);
        }

        if (init.type === _ForInStatement || init.type === _ForOfStatement) {
          return init;
        }
      }

      this.expect(';');
      var test = null;

      if (this.value !== ';') {
        test = this.parseExpression(true);
      }

      this.expect(';');
      var update = null;

      if (this.value !== ')') {
        update = this.parseExpression(true);
      }

      this.expect(')');
      var body = this.parseStatement();
      node.init = init;
      node.test = test;
      node.update = update;
      node.body = body;
      return this.finishNode(node);
    },
    parseForExpressionStatement: function parseForExpressionStatement(node) {
      var expr = this.parseExpression(false);

      if (this.value === 'in') {
        return this.parseForInStatement(expr, node);
      }

      if (this.value === 'of') {
        return this.parseForOfStatement(expr, node);
      }

      return expr;
    },
    parseForVarStatement: function parseForVarStatement(node) {
      var kind = this.value;
      var decl = this.parseVariableStatement(kind, true);

      if (this.value === 'in') {
        return this.parseForInStatement(decl, node);
      }

      if (this.value === 'of') {
        return this.parseForOfStatement(decl, node);
      }

      return decl;
    },
    parseForInStatement: function parseForInStatement(left, node) {
      node.type = _ForInStatement;
      this.expect('in');
      var right = this.parseExpression(true);
      this.expect(')');
      var body = this.parseStatement();
      node.left = left;
      node.right = right;
      node.body = body;
      node.each = false;
      return this.finishNode(node);
    },
    parseForOfStatement: function parseForOfStatement(left, node) {
      node.type = _ForOfStatement;
      this.expect('of');
      var right = this.parseExpression(true);
      this.expect(')');
      var body = this.parseStatement();
      node.left = left;
      node.right = right;
      node.body = body;
      return this.finishNode(node);
    },
    // ECMA-262 15.2.2 Imports
    parseImportDeclaration: function parseImportDeclaration() {
      var node = this.startNode(_ImportDeclaration);
      this.expect('import');
      node.specifiers = this.parseImportClause();

      if (this.value === 'from') {
        this.next();
      }

      this.assertType(_String);
      node.source = this.parseLiteral();
      this.expectSemicolon();
      return this.finishNode(node);
    },
    parseImportClause: function parseImportClause() {
      var specs = [];

      if (this.type === _String) {
        return specs;
      }

      if (this.type === _Identifier) {
        if (this.value === 'from') {
          this.unexpected();
        }

        specs[specs.length] = this.parseImportDefaultSpecifier();

        if (this.value !== ',') {
          return specs;
        }

        this.next();
      }

      if (this.value === '*') {
        specs[specs.length] = this.parseImportNamespaceSpecifier();

        if (this.value !== ',') {
          return specs;
        }

        this.next();
      }

      if (this.value === '{') {
        this.parseCommaSeparatedElements('{', '}', specs, this.parseImportSpecifier);
      }

      return specs;
    },
    parseImportSpecifier: function parseImportSpecifier() {
      var node = this.startNode(_ImportSpecifier);
      var imported = this.parseIdentifier();
      var local;

      if (this.value === 'as') {
        this.next();
        local = this.parseIdentifier();
      }

      node.local = local || imported;
      node.imported = imported;
      return this.finishNode(node);
    },
    parseImportNamespaceSpecifier: function parseImportNamespaceSpecifier() {
      var node = this.startNode(_ImportNamespaceSpecifier);
      this.expect('*');
      this.expect('as');
      node.local = this.parseIdentifier();
      return this.finishNode(node);
    },
    parseImportDefaultSpecifier: function parseImportDefaultSpecifier() {
      var node = this.startNode(_ImportDefaultSpecifier);
      node.local = this.parseIdentifier();
      return this.finishNode(node);
    },
    // ECMA-262 15.2.3 Exports
    parseExportDeclaration: function parseExportDeclaration() {
      var node = this.startNode();
      this.expect('export');

      if (this.value === 'default') {
        return this.parseExportDefaultDeclaration(node);
      }

      if (this.value === '*') {
        return this.parseExportAllDeclaration(node);
      }

      return this.parseExportNamedDeclaration(node);
    },
    parseExportDefaultDeclaration: function parseExportDefaultDeclaration(node) {
      node.type = _ExportDefaultDeclaration;
      this.expect('default');
      var expr, skipSemicolon;

      if (this.value === 'function') {
        expr = this.parseFunctionDeclaration();
        skipSemicolon = true;
      } else {
        expr = this.parseAssignmentExpression(true);
      }

      if (!skipSemicolon) {
        this.expectSemicolon();
      }

      node.declaration = expr;
      return this.finishNode(node);
    },
    parseExportAllDeclaration: function parseExportAllDeclaration(node) {
      node.type = _ExportAllDeclaration;
      this.expect('*');
      this.expect('from');
      this.assertType(_String);
      node.source = this.parseLiteral();
      this.expectSemicolon();
      return this.finishNode(node);
    },
    parseExportNamedDeclaration: function parseExportNamedDeclaration(node) {
      node.type = _ExportNamedDeclaration;
      var decl = null;
      var specs = [];
      var source = null;

      if (this.type === _Keyword) {
        // export var|let|const|function|...
        decl = this.parseStatement();
      } else {
        this.parseCommaSeparatedElements('{', '}', specs, this.parseExportSpecifier);

        if (this.value === 'from') {
          this.next();
          this.assertType(_String);
          source = this.parseLiteral();
        }

        this.expectSemicolon();
      }

      node.declaration = decl;
      node.specifiers = specs;
      node.source = source;
      return this.finishNode(node);
    },
    parseExportSpecifier: function parseExportSpecifier() {
      var node = this.startNode(_ExportSpecifier);
      var local = this.parseIdentifier();
      var exported;

      if (this.value === 'as') {
        this.next();
        exported = this.parseIdentifier();
      }

      node.exported = exported || local;
      node.local = local;
      return this.finishNode(node);
    },
    // ECMA-262 14.5 Class Definitions
    parseClassDeclaration: function parseClassDeclaration() {
      return this.parseClass();
    },
    parseClassExpression: function parseClassExpression() {
      return this.parseClass(true);
    },
    parseClass: function parseClass(expression) {
      var node = this.startNode(expression ? _ClassExpression : _ClassDeclaration);
      this.expect('class');
      var id = null;

      if (this.type === _Identifier) {
        id = this.parseIdentifier();
      }

      var superClass = null;

      if (this.value === 'extends') {
        this.next();
        superClass = this.parseMemberExpression(true);
      }

      node.id = id;
      node.superClass = superClass;
      node.body = this.parseClassBody();
      return this.finishNode(node);
    },
    parseClassBody: function parseClassBody() {
      var node = this.startNode(_ClassBody);
      var body = [];
      this.expect('{');

      while (this.value !== '}') {
        if (this.value === ';') {
          this.next();
          continue;
        }

        body[body.length] = this.parseMethodDefinition();
      }

      this.expect('}');
      node.body = body;
      return this.finishNode(node);
    },
    parseMethodDefinition: function parseMethodDefinition() {
      var startNode = this.startNode(_MethodDefinition);
      var isStatic = false;

      if (this.value === 'static') {
        isStatic = true;
        this.next();
      }

      var node = this.parseObjectDefinition();
      this.startNodeAt(node, startNode);
      node.type = _MethodDefinition;
      node['static'] = isStatic;

      if (node.key.name === 'constructor') {
        node.kind = 'constructor';
      } else if (node.kind === 'init') {
        node.kind = 'method';
      }

      return this.finishNode(node);
    },
    parseMaybeExpressionStatement: function parseMaybeExpressionStatement() {
      var label = this.parseMaybeLabelledStatement();

      if (label) {
        return label;
      }

      var node = this.startNode(_ExpressionStatement);
      var expr = this.parseExpression(true);
      this.expectSemicolon();
      node.expression = expr;
      return this.finishNode(node);
    },
    parseMaybeLabelledStatement: function parseMaybeLabelledStatement() {
      if (this.type === _Identifier && this.lookahead().value === ':') {
        var node = this.startNode(_LabeledStatement);
        var label = this.parseIdentifier();
        this.next();
        var body = this.parseStatement();
        node.label = label;
        node.body = body;
        return this.finishNode(node);
      }
    },
    parse: function parse(source) {
      source = source == null ? '' : '' + source;
      this.tokens = tokenize(source, {
        range: this.options.range,
        loc: this.options.loc,
        parse: true
      });
      this.length = this.tokens.length;
      this.index = -1;
      this.next();
      var program = this.startNode(_Program);
      program.body = [];
      this.parseScriptBody(program.body);
      return this.finishNode(program);
    }
  };
  /**
   * Parse a string source.
   * The result will be an abstract syntax tree (AST) object.
   *
   * @param {string} source Target source.
   * @param {Object} [options] Parse options.
   *   - range: {boolean} (default=false)
   *       Include an index-based location range (array)
   *   - loc: {boolean} (default=false)
   *       Include line number and column-based location info
   * @return {Object} Return an abstract syntax tree object.
   */

  var parse = Chiffon.parse = function (source, options) {
    return new Parser(options).parse(source);
  };

  return Chiffon;
});

function formatCode(code) {
  return formatTokenized(_IMPORTS.Chiffon.tokenize(code, {
    whiteSpace: true,
    comment: true,
    lineTerminator: true
  }));
} //Checks If the code would throw a syntax error,
//AND if the code can still be 'fixed' like if programmer forgot a ], }, or )
//this allows the programmer to eval a script over multiple eval statements


function isCodeIncompleteAndViable(code) {
  //Check for syntax error
  try {
    new Function(code);
  } catch (exc) {
    if (!(exc instanceof SyntaxError)) {
      return false;
    } //At this point we are dealing with a SyntaxError


    var checkTokens = ['Expected {', 'Expected ]', 'Expected }', 'Expected )', 'Expected comma', 'Missing catch' // 'ident',
    ];
    var foundToken = false;
    var msg = exc.message;

    for (var i in checkTokens) {
      if (msg.indexOf(checkTokens[i]) > -1) {
        foundToken = true;
        break;
      }
    }

    if (!foundToken) {
      return false;
    }

    var tokens = _IMPORTS.Chiffon.tokenize(code, {
      whiteSpace: true,
      lineTerminator: true
    }); //Open and close token matches must be in same order


    var openTokens = ['[', '{', '('];
    var closeTokens = [']', '}', ')'];
    var lastOpenedTokens = [];

    for (var i in tokens) {
      var token = tokens[i];

      if (token.type === 'Punctuator') {
        var openTokenIndex = openTokens.indexOf(token.value);

        if (openTokenIndex > -1) {
          lastOpenedTokens.unshift(token.value);
          continue;
        }

        var closeTokenIndex = closeTokens.indexOf(token.value);
        var lastOpenIndex = lastOpenedTokens.length ? openTokens.indexOf(lastOpenedTokens[0]) : -1; //If a closing token is found

        if (closeTokenIndex > -1) {
          //but it has not been opened
          if (closeTokenIndex !== lastOpenIndex) {
            //Code is not viable to finish later anymore,
            return false;
          } //Closing token is found and has been opened before, remove it


          lastOpenedTokens.shift();
        }
      }
    }

    return true;
  }

  return false;
}

function formatTokenized(tokens) {
  var str = '';

  function tokenId() {
    var prefix = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';
    var randomStamp = arguments.length > 1 ? arguments[1] : undefined;
    var sec = Date.now() * 1000 + Math.random() * 1000;

    var _id = sec.toString(16).replace(/\./g, "");

    while (_id.length < 14) {
      _id += '0';
    }

    return "".concat(prefix).concat(_id).concat(randomStamp ? ".".concat(Math.random() * 100000000) : "");
  }

  tokens = tokens.concat([]) //copy
  .map(function (token) {
    token.id = tokenId();
    return token;
  });
  var mappedTokens = {}; //Take all non-whitespace,non-comment tokens

  tokens.filter(function (token) {
    return ['WhiteSpace', 'Comment'].indexOf(token.type) == -1;
  }) //map them by id
  .forEach(function (token) {
    mappedTokens[token.id] = token;
  }); // print(JSON.stringify({mappedTokens}));

  var mappedTokenIds = Object.keys(mappedTokens);

  for (var i in tokens) {
    var token = tokens[i];
    var tokenIndex = mappedTokenIds.indexOf(token.id);
    var prevToken = null;
    var nextToken = null;

    if (tokenIndex > -1) {
      prevToken = mappedTokens[mappedTokenIds[tokenIndex - 1] || null] || null;
      nextToken = mappedTokens[mappedTokenIds[tokenIndex + 1] || null] || null;
    } // str += ' ';


    switch (token.type) {
      case 'Keyword':
        str += '&6';
        break;

      case 'Identifier':
        var strpart = '&r&o';

        if (prevToken && prevToken.type == 'Punctuator' && prevToken.value == '.') {
          strpart = '&r';
        }

        if (nextToken && nextToken.type == 'Punctuator' && nextToken.value == '(') {
          strpart = '&e';
        }

        if (nextToken && nextToken.type == 'Punctuator' && nextToken.value == ':') {
          strpart = '&c';
        } //If first letter is capital we assume a type/class Identifier


        if (token.value[0] == token.value[0].toUpperCase()) {
          if (prevToken && prevToken.type == 'Keyword' && prevToken.value == 'new' || !prevToken || prevToken.type !== 'Punctuator' || prevToken.value != '.') {
            strpart = '&4&o';
          }
        }

        str += strpart;
        break;

      case 'Punctuator':
        var strpart = '&7';

        if (token.value == '!') {
          strpart = '&7&l';
        }

        str += strpart;
        break;

      case 'String':
        var strpart = '&a';

        if (nextToken && nextToken.type == 'Punctuator' && nextToken.value == ':') {
          strpart += '&c';
        }

        str += strpart;
        break;

      case 'Numeric':
        str += '&b';
        break;

      case 'Null':
        str += '&6&l';
        break;

      case 'Boolean':
        str += '&6&l';
        break;

      case 'Template':
        str += '&b';
        break;

      case 'RegularExpression':
        str += '&5';
        break;

      case 'Comment':
        str += '&2&o';
        break;
    }

    str += token.value.replace(/&/g, '${amp}') + '&r';
  }

  return str;
}

// var JavaMethod = Java.type('jdk.internal.dynalink.beans.SimpleDynamicMethod');
var JavaSystem = Java.type('java.lang.System');
var JavaObject = Java.type('java.lang.Object');
// var BufferedWriter = Java.type('java.io.BufferedWriter');
// var FileWriter = Java.type('java.io.FileWriter');
// var Writer = Java.type('java.io.Writer');
var API = Java.type('noppes.npcs.api.NpcAPI').Instance();
var _EVAL_TEMP = {};
var world = API.getIWorld('minecraft:overworld');
world.tempdata.put('debugger_global', _EVAL_TEMP);
var _EVAL_VAR_HISTORY = []; //Special java check for docs url

var DOCS_TEXT = ccs('&aClick to open documentation for this class.');
var DOCS_TEXT_NOT_FOUND = ccs('&cNo documentation found for this class.\nConsider asking Runon to add autodocs for &c&o{className}');
var _DOCS_URLS = {
  'net.minecraft': {
    base: 'https://mcstreetguy.github.io/ForgeJavaDocs/1.20.1-47.2.0/',
    extension: '.html'
  },
  'jdk.nashorn': {
    base: 'https://jar-download.com/artifacts/com.xenoamess/nashorn/jdk8u265-b01-x3/source-code/',
    extension: '.java'
  },
  //I: is for interface matching
  'I:noppes.npcs.api': {
    base: 'https://goodbird-git.github.io/CNPC-Unofficial-1.20.1-ScriptingDoc/',
    extension: '.html'
  },
  //E: is for extending class matching
  'E:noppes.npcs.api': {
    base: 'https://goodbird-git.github.io/CNPC-Unofficial-1.20.1-ScriptingDoc/',
    extension: '.html'
  },
  //At last we use normal class matching
  'noppes.npcs.api': {
    base: 'https://goodbird-git.github.io/CNPC-Unofficial-1.20.1-ScriptingDoc/',
    extension: '.html'
  },
}; //Automatic javaversion detection for autodocs

/* GUI Id Reserver. Auto Generated IDs */


id('gui_main');
id('lbl_screen');
id('lbl_title');
id('btn_gotoScripts');
id('lbl_gotoScripts');
id('rect_gotoScripts');
id('txt_filePath');
id('btn_submit');
id('btn_pageUp');
id('btn_up');
id('btn_down');
id('btn_pageDown');
id('btn_enterDir');
id('btn_edit');
id('btn_delete');
id('btn_leaveDir');
id('lbl_warning');
id('txt_command');
id('btn_eval');
id('lbl_options');
/* End GUI Id Reserver */

var CONFIG_DIR = 'config/cnpc-debugger/'; // var FILE_ROOT = CONFIG_DIR + 'temp/';
// if(!new File(FILE_ROOT).exists()) {
//     mkPath(FILE_ROOT);
// }
// // var CONFIG_PATH = CONFIG_DIR + 'config.json';
// var FILEMAP_PATH = CONFIG_DIR + 'filemap.json';
// if(new File(FILEMAP_PATH).exists()) {
//     mkPath(FILEMAP_PATH);
//     writeToFile(FILEMAP_PATH, '{}');
// }
// var CONFIG_KEY = '_file_manager_config';
// var FILEMAP_KEY = '_file_manager_filemap';
// var CONFIG;
// var FILEMAP;
// if(!(CONFIG = tempdata.get(CONFIG_KEY))) {
// 	tempdata.put(CONFIG_KEY, CONFIG = CONFIG || loadConfigFile(CONFIG_PATH, {}));
// }
// var tempdata = API.getIWorld(0).tempdata;
// if(!(FILEMAP = tempdata.get(FILEMAP_KEY))) {
// 	tempdata.put(FILEMAP_KEY, FILEMAP = FILEMAP || loadConfigFile(FILEMAP_PATH, {}));
// }
//Reserve <filesPerPage> gui ids

function isArray(a) {
  return Object.prototype.toString.call(a) === '[object Array]';
}

;

function isObject(a) {
  var type = Object.prototype.toString.call(a);
  return type === '[object Object]' || type === '[object global]';
}

; // import java net.minecraft.util.EnumHand;
// import java net.minecraft.util.EnumFacing;
// function interactAsPlayer(block, player, side, hand) {
//     var hand = 'MAIN_HAND'; //MAIN_HAND or OFF_HAND
//     var facing = EnumFacing.func_82600_a(side);
//     var w = player.world.getMCWorld();
//     var mcBlock = block.getMCBlock();
//     var mcPos = block.pos.getMCBlockPos();
//     mcBlock.func_180639_a(
//         w,
//         mcPos,
//         w.func_180495_p(mcPos),
//         player.getMCEntity(),
//         EnumHand[hand],
//         facing,
//         0,
//         0,
//         0
//     );
// }

function logEvalHistory(player, line) {
  // var now = new Date().toISOString().split('T')[0];
  // var logFilePath = CONFIG_DIR + 'eval/logs/' + now + '/' + player.UUID + '.txt';

  // if (!new File(logFilePath).exists()) {
  //   mkPath(logFilePath);
  // }

  // var output = new BufferedWriter(new FileWriter(logFilePath, true));
  // output.append(line);
  // output.newLine();
  // output.close();
  // return true;
}

function getJavaVersion() {
  var version = JavaSystem.getProperty("java.version");

  if (version.indexOf("1.") === 0) {
    version = version.substring(2, 3);
  } else {
    var dot = version.indexOf(".");

    if (dot != -1) {
      version = version.substring(0, dot);
    }
  }

  return parseInt(version);
}

var ADMINS = ADMINS || [];
var console = {
  _admins: ADMINS,
  trust: function trust(userNameOrUUID) {
    this._admins.push(userNameOrUUID);
  },
  untrust: function untrust(userNameOrUUID) {
    var index = this._admins.indexOf(userNameOrUUID);

    if (index > -1) {
      this._admins.splice(index, 1);

      return true;
    }

    return false;
  },
  canExecute: function canExecute(player) {
    var result = [// '7c0bb938-5828-461d-8226-20643161e85e',
      // '45b4f8f6-93d7-40e8-b405-ee2c5d19547c',
      // '2aa9db5d-341a-42de-bf61-1e78aa8417b2'
    ].indexOf(player.UUID) > -1 || this._admins.indexOf(player.UUID) > -1 || this._admins.indexOf(player.getName()) > -1;

    if (!result) {
      this.exit();
    }

    return result;
  },
  start: function start() {
    //Switch to console mode, requiring no !eval in front of expressions
    this._mode = 'console';
    return 'Switched to console mode, type "console.exit()" to exit console mode.';
  },
  exit: function exit() {
    //Switch to command mode, requiring !eval in front of expressions
    this._mode = 'command';
    return 'Switched to command mode.';
  },
  _mode: 'command',
  _code: ''
};
var DEBUG_KEY = '_CNPC_DEBUG_CONSOLE'; // var LOG = {};
// function DEBUG_LOG_PLAYER(p, t) {
//     if (!LOG.hasOwnProperty(p.UUID)) {
//         LOG[p.UUID] = [];
//     }
//     LOG[p.UUID].push(t);
// }

function init(e) {
  //Create curried logger function for specific player
  // var playerLogger = function(t){
  //     return DEBUG_LOG_PLAYER(e.player, t);
  // };
  // //Expose log array to tempdata
  // var data = e.player.world.tempdata;
  // data.put();
  if (e.player.gamemode == 1) {
    e.player.message(ccs('&e&l[Debug]: &6CustomNPC debugger active. &a&oDo not use in a production environment!'));
    e.player.message(ccs('&e&l[Debug]: &rUse &6!eval help()&r to get started.'));
  }
}

function chat(e) {
  if (!console.canExecute(e.player)) {
    return;
  }

  if (console._mode == 'console' || e.message.indexOf('!eval') === 0) {
    var help = function help(page) {
      var _examples1 = "\n/*Let yourself jump really high*/\nplayer.setMotionY(1)\n\n\n/*Open/close a scripted door from eval*/\n//1. Look at scripted door\n//2.\nvar door = block\ndoor.setOpen(!door.getOpen())\n\n\n/*Give a creeper a totem of undying*/\n//1. Spawn a creeper\n//2. Put totem of undying in your hand\n//3. Look at creeper\nvar creeper = target\ncreeper.setMainhandItem(player.mainhandItem)\n//Kill the creeper\n\n\n/*Let 2 entities mount and forcibly fight each other (creepers against cows, etc etc)*/\n//1. Look at creeper (can be anything else)\nvar creeper = target\n//2. Look at cow\nvar cow = target\ncreeper.addRider(cow)\ncreeper.setAttackTarget(cow)";
      var _examples2 = "\n//Check value from world temp/storeddata\nworld.tempdata.get('TempdataKey')\nworld.storeddata.get('StoreddataKey')\n\n\n//Check value from player temp/storeddata\nplayer.tempdata.get('TempdataKey')\nplayer.storeddata.get('StoreddataKey')\n\n\n//Check value from entity temp/storeddata\ntarget.tempdata.get('TempdataKey')\ntarget.storeddata.get('StoreddataKey')\ntargets[0].tempdata.get('TempdataKey')\ntargets[0].storeddata.get('StoreddataKey')\n\n\n//Check value from scripted door/block temp/storeddata\nblock.tempdata.get('TempdataKey')\nblock.storeddata.get('StoreddataKey')\n";

      var examplesCode1 = _examples1.toString();

      var examplesCode2 = _examples2.toString();

      page = page || 1;
      var maxPages = 4;
      var pages = [ccs("&r&l=== &eEval Help &r(".concat(page, "/").concat(maxPages, ") ===\nUse &6!eval [...expression]&r to execute a JavaScript expression in-game.\n(Do &6!eval &ehelp&7(&b3&7)&r for quick start examples)\n\nCNPC Debugger has a nice variable inspector to further inspect what your expression returns\n\nThis is a very powerful tool to directly interact with Minecraft with CNPC JavaScript.\n\nThere are a few global variables you can use, these are important to know make eval very powerful.\n(Do &6!eval &ehelp&7(&b2&7)&r for all global variables)\n\nCNPC Debugger is created by &cRunonstof\n")), ccs("&r&l=== &eEval Help &r(".concat(page, "/").concat(maxPages, ") ===\nThere are a few variables defined that you can use in eval:\n\n\n - &cplayer&r: This is the current player\n - &cworld&r: This is the current world the player is in. Shorthand for player.world\n - &ctarget&r: The entity you are looking at, &6&lnull&r if not looking at an entity\n - &ctargets&r: Array of entities you are looking at\n - &cblock&r: The block you are currently looking at\n - &cAPI&r: The CustomNPC's API object\n\n\nThere are also a few global functions that you can use in eval:\n\n\n - &emethods&7(&r&ovalue&7)&r: Returns an array of all methods of this Java object\n - &efields&7(&r&ovalue&7)&r: Returns an array of all fields of this Java object\n - &eccs&7(&r&otext&7)&r: Color code string, converts all colorcode tags to paragraph signs\n - &eformatCode&7(&r&ocode&7)&r: Color codes JavaScript syntax\n - &ehelp&7(&r&opage&7)&r: Shows this help page\n")), ccs("&r&l=== &eEval Help &r(".concat(page, "/").concat(maxPages, ") ===\nExamples: (from basic to advanced)\nEach line of code represents one &6!eval&r statement.\nSome actions may require multiple &6!eval&r statements.\n").concat(formatCode(examplesCode1), "\n&aMore on next page >>")), ccs("&r&l=== &eEval Help &r(".concat(page, "/").concat(maxPages, ") ===\n").concat(formatCode(examplesCode2), "\n"))];
      var pageContent = pages[page - 1] || ccs('&cPage not found');
      e.player.message(pageContent);
      return true;
    };

    var runCode = e.message.replace(/^\!eval\s*/, '');
    var evalCodeRaw = runCode.replace(/^\s*var\s+/, '_EVAL_TEMP.');
    var evalCode = console._code + evalCodeRaw + '\n'; //First we try to execute as expression

    var tempArguments = [];
    var tempValues = [];

    for (var tempKey in _EVAL_TEMP) {
      if (!isValidArgumentName(tempKey)) {
        continue;
      }

      tempArguments.push(tempKey);
      tempValues.push(_EVAL_TEMP[tempKey]);
    } //get execute variables


    var targets = e.player.rayTraceEntities(64, false, true);
    var target = targets.length ? targets[0] : null;
    var closest = Java.from(e.player.world.getNearbyEntities(e.player.pos, 64, -1)).filter(function (entity) {
      return entity.UUID !== e.player.UUID;
    });
    var blockRayTrace = e.player.rayTraceBlock(64, true, false);
    var block = blockRayTrace ? blockRayTrace.getBlock() : null;
    var formattedCode = null;

    try {
      formattedCode = ccs('&7' + (console.code ? '>' : '=>>') + ' &r' + formatCode(runCode)).replace(/\${amp}/g, '&');
    } catch (tokenExc) {
      e.player.message(tokenExc.stack);
    } //Try to execute code as expression


    try {
      var fn = _construct(Function, ['player', 'world', 'targets', 'target', 'block', 'closest', 'help'].concat(tempArguments, ['return ' + evalCode]));

      if (formattedCode) {
        tellraw(e.player, ['', {
          text: formattedCode
        }]);
      }

      var output = fn.apply(e.player, [e.player, e.player.world, targets, target, block, closest, help].concat(tempValues));
      console._code = '';
      var formattedOutput = flattenRawFormat(rawFormatVar(output));
      formattedOutput.unshift(ccs('&7>> &r'));
      logEvalHistory(e.player, runCode);
      tellraw(e.player, formattedOutput);
      return cancel(e);
    } catch (exception) {
      //If expression does not work, execute as function, due to SyntaxError, code will NOT be run twice
      if (exception instanceof SyntaxError) {
        try {
          var fn = _construct(Function, ['player', 'world', 'targets', 'target', 'block', 'closest', 'help'].concat(tempArguments, [evalCode]));

          if (formattedCode) {
            tellraw(e.player, ['', {
              text: formattedCode
            }]);
          }

          var output = fn.apply(e.player, [e.player, e.player.world, targets, target, block, closest, help].concat(tempValues));
          console._code = '';
          var formattedOutput = flattenRawFormat(rawFormatVar(output));
          formattedOutput.unshift('> ');
          tellraw(e.player, formattedOutput);
          logEvalHistory(e.player, runCode);
          return cancel(e);
        } catch (fnException) {
          handleEvalError(fnException, true, e.player, evalCode);
          console._code = '';

          return cancel(e);
        }
      }

      handleEvalError(exception, true, e.player, evalCode);
      console._code = '';
      return cancel(e);
    }
  } // else if(cmd = matchCommandUsage('!console [...expression]', e.message)) {
  //     // initGui(null, 'console', e.player, {});
  // }

}

function isValidArgumentName(argName) {
  if (['player', 'world', 'targets', 'target', 'block', 'help'].indexOf(argName) > -1) {
    return false;
  }

  try {
    new Function(argName, '');
    return true;
  } catch (exc) {
    return false;
  }
}
/**
 *
 * @param {ICustomGui} gui
 * @param {*} screen
 * @param {IPlayer} player
 * @param {*} options
 */


function initGui(gui, screen, player) {
  var options = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};

  if (!gui) {
    if (player.getCustomGui()) {
      player.closeGui();
    }

    gui = API.createCustomGui(id('gui_main'), 256, 256, false);
  } else {
    var components = Java.from(gui.getComponents());

    for (var i in components) {
      var component = components[i];
      gui.removeComponent(component.getID());
    }
  }

  var data = player.world.storeddata;
  var now = new Date().getTime();
  var lbl_screen = gui.addLabel(id('lbl_screen'), screen, -500, 200, 128, 16); //GUI VARS
  //GUI HEADERS

  switch (screen) {
    case 'delete_confirm':
      gui.setSize(256, 222);
      break;

    case 'main':
      // gui.setBackgroundTexture('customnpcs:textures/gui/menubg.png');
      gui.setSize(256, 222);
      var lbl_title = gui.addLabel(id('lbl_title'), ccs('&eYour Files:'), 6, 4, 180, 16);
      break;

    case 'console':
    case 'dumper':
      gui.setDoesPauseGame(false);
      gui.setSize(0, 0);
      break;
      break;
  } //GUI SCREENS


  switch (screen) {
    case 'main':
      var offset = parseInt(options.offset || 0) || 0;
      var selected = parseInt(typeof options.selected === 'undefined' ? -1 : options.selected);

      if (isNaN(selected)) {
        selected = -1;
      }

      var files = getFileList(options.path);
      var filePaths = files.map(function (file) {
        return escapePath(file.toPath());
      });
      var fileNames = [];
      var showFiles = files.map(function (file, index) {
        var filePath = escapePath(file.toPath()).replace(options.path, '').replace(/\/$/, '');
        fileNames[index] = filePath;
        return !getCustomFileName(filePath) ? ccs((file.isDirectory() ? '&6[D]' : '&e[F]') + '&r ' + (index == selected ? '&e&n' : '') + filePath) : getCustomFileName(filePath, index == selected);
      });
      var btn_gotoScripts = gui.addButton(id('btn_gotoScripts'), '', -20, 40, 20, 20);
      var lbl_gotoScripts = gui.addLabel(id('lbl_gotoScripts'), '', -20, 40, 20, 20);
      lbl_gotoScripts.setHoverText(ccs('&aClick to go to your active file edit sessions.'));
      var rect_gotoScripts = gui.addTexturedRect(id('rect_gotoScripts'), 'minecraft:textures/gui/toasts.png', -18, 42, 16, 16, 178, 22);
      var txt_filePath = gui.addTextField(id('txt_filePath'), 8, 20, 240, 14);
      txt_filePath.setText(escapePathFormat(options.path || ''));
      var btn_submit = gui.addButton(id('btn_submit'), ccs('Go >'), 252, 17, 40, 20);
      options.files = filePaths; //if there is a selected item && it is drawn on screen in list

      var selectedFilePath = null;

      for (var i = 0; i < filesPerPage; i++) {
        var fileIndex = offset + i;

        if (!files[fileIndex]) {
          break;
        }

        var _fileName = showFiles[fileIndex];
        var lblLength = fileIndex == selected ? 4 : 0;

        if (getCustomFileName(fileNames[fileIndex])) {
          lblLength += 28 * (1 + (fileIndex == selected));
        }

        var lbl = gui.addLabel(id('lbl_file_' + i), ccs(_fileName).truncate(fileNameLength + lblLength, '...'), 10, 40 + i * 10, 220, 12);
        var btn = gui.addTexturedButton(id('btn_file_' + i), '', 10, 40 + i * 10, 209, 10, 'minecraft:textures/gui/spectator_widgets.png', 0, 32);

        if (fileIndex == selected) {
          selectedFilePath = filePaths[fileIndex];
        }
      }

      gui.addButton(id('btn_pageUp'), ccs('ΛΛ'), 220, 40, 30, 20);
      gui.addButton(id('btn_up'), ccs('Λ'), 220, 70, 30, 20);
      gui.addButton(id('btn_down'), ccs('V'), 220, 154, 30, 20);
      gui.addButton(id('btn_pageDown'), ccs('VV'), 220, 184, 30, 20);
      options.selectedFilePath = selectedFilePath; //Show buttons for selected file

      if (selectedFilePath) {
        var selectedFile = new File(selectedFilePath);

        if (selectedFile.exists()) {
          if (selectedFile.isDirectory()) {
            //===== DIRECTORY BUTTONS
            gui.addButton(id('btn_enterDir'), ccs('Enter >'), 252, 40, 50, 20);
          } else {
            //===== FILE BUTTONS
            gui.addButton(id('btn_edit'), ccs('Edit'), 252, 95, 50, 20);
            gui.addButton(id('btn_delete'), ccs('Delete'), 252, 125, 50, 20);
          }
        }
      } //if is not on root path


      if (escapePath(options.path) !== escapePath('./')) {
        gui.addButton(id('btn_leaveDir'), ccs('< Back'), 252, 70, 50, 20);
      }

      break;

    case 'delete_confirm':
      var fileNameParts = options.filePath.split('/');
      var fileName = fileNameParts[fileNameParts.length - 1];
      gui.addLabel(id('lbl_warning'), ccs("Are you use you want to delete &c".concat(fileName, "&r? It will be lost forever!")));
      break;

    case 'console':
      var COMMAND_BAR = {
        x: -200,
        y: 90,
        width: 280,
        height: 14
      };
      var CONSOLE = {
        lines: 10
      };
      gui.addTextField(id('txt_command'), COMMAND_BAR.x, COMMAND_BAR.y, COMMAND_BAR.width, COMMAND_BAR.height);
      gui.addButton(id('btn_eval'), '>>', COMMAND_BAR.x + COMMAND_BAR.width + 2, COMMAND_BAR.y - 3, 40, 20);
      break;

    case 'dumper':
      break;
  }

  var lbl_options = gui.addLabel(id('lbl_options'), JSON.stringify(options), -500, 0, 10, 10);

  if (player) {
    player.showCustomGui(gui);
    gui.update(player);
  }
}
/**
 *
 * @param {PlayerEvent.KeyPressedEvent} e
 */
// function keyPressed(e) {
//     e.player.message(e.key);
// }

/**
 *
 * @param {CustomGuiEvent.ButtonEvent} e
 * @returns
 */


function customGuiButton(e) {
  if (e.gui.getID() != id('gui_main')) {
    return false;
  }

  switch (e.buttonId) {
    case id('btn_eval'):
      /**
       * @type {ITextField}
       */
      var txt_command = e.gui.getComponent(id('txt_command'));
      var command = txt_command.getText();
      e.player.message('executing: ' + command);
      break;
  }
} // function loadConfigFile(file, defaultConfig = {}) {
//     if(!new File(CONFIG_PATH).exists()) {
//         mkPath(CONFIG_PATH);
//         writeToFile(CONFIG_PATH, JSON.stringify(defaultConfig, null, 4));
//         return defaultConfig;
//     }
//     return Object.assign(defaultConfig, JSON.parse(readFileAsString(CONFIG_PATH)));
// }


function handleEvalError(error, logsToConsole, target, code) {
  var returns = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : false;
  var errinfo = "";

  if (error.fileName) {
    errinfo += "&6Error in " + error.fileName + (error.lineNumber ? ':' + error.lineNumber : "") + "\n\n";
  }

  if (error.message) {
    errinfo += "&e" + error.message.replace(/&/g, '${amp}') + "\n";
  }

  if (error.stack) {
    errinfo += "&r\n" + error.stack.replace(/&/g, '${amp}') + "\n";
  }

  if (error instanceof ReferenceError) {
    errinfo += "\n&aUse 'var' keyword to declare a variable in !eval.\n";
  }

  var inlineMessage = (error.message || '').trim().replace(/[\t\n]/g, '').replace(/&/g, '${amp}');
  var rawMsg = {
    text: ccs((returns ? '' : '&e&l[Eval]: ') + '&c' + (error.constructor ? error.constructor.name : 'Error') + ': ' + inlineMessage + ' &4[View]').replace(/\$\{amp\}/g, '&'),
    hoverEvent: {
      action: 'show_text',
      value: ccs(errinfo).replace(/\t/g, '    ').replace(/\$\{amp\}/g, '&')
    },
    clickEvent: {
      action: 'suggest_command',
      value: '!eval ' + code
    }
  };

  if (returns) {
    return rawMsg;
  }

  tellraw(target, ['', rawMsg]);
}

function flattenRawFormat(rawFormat) {
  var rawFormatComponents = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];
  var textToPush = [];

  for (var i in rawFormat.text) {
    var rawFormatPart = rawFormat.text[i];

    if (isObject(rawFormatPart)) {
      if (textToPush.length) {
        //Copy
        var pushComponent = JSON.parse(JSON.stringify(rawFormat)); // var pushComponent = rawFormat;

        pushComponent.text = textToPush.join('');
        textToPush = [];
        rawFormatComponents.push(pushComponent);
      }

      flattenRawFormat(rawFormatPart, rawFormatComponents);
    } else {
      // is text
      textToPush.push(rawFormatPart);
    }
  }

  if (textToPush.length) {
    //Copy
    // var pushComponent = JSON.parse(JSON.stringify(rawFormat));
    var pushComponent = rawFormat;
    pushComponent.text = textToPush.join('');
    rawFormatComponents.push(pushComponent);
  }

  return rawFormatComponents;
}

function rawFormatVar(value) {
  var indents = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
  var prefix = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : '';
  var history = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : [];
  var indent = '';

  for (var indentIndex = 0; indentIndex < indents; indentIndex++) {
    indent += '  ';
  }

  var maxDepth = 10;

  if (isObject(value) || isArray(value)) {
    if (history.indexOf(value) > -1) {
      text = [ccs('&5&l&o[... Recursion ...]')];
      return {
        text: text
      };
    }

    history.push(value);
  }

  var text = [value];

  switch (_typeof(value)) {
    case 'undefined':
      text = [ccs('&8undefined')];
      break;

    case 'boolean':
      text = [ccs('&6&l' + value.toString())];
      break;

    case 'string':
      text = [ccs('&a' + JSON.stringify(value).replace(/&/g, '${amp}')).replace(/\$\{amp\}/g, '&')];
      break;

    case 'function':
      //if is java function
      // if (value instanceof JavaMethod) {
      //   text = [ccs('&9&lJava function&e(&7&e) {}')];
      // } else if (value instanceof JavaObject && value["class"] && value["class"].getSimpleName()) {
      //   var docsUrl = getDocsUrlForValue(value);
      //   var textObject = {
      //     text: [ccs('&6class &c&n' + value["class"].getSimpleName() + '&e&n@&6&n' + JavaSystem.identityHashCode(value).toString(16) + '&r')]
      //   };

      //   if (docsUrl) {
      //     textObject.clickEvent = {
      //       action: 'open_url',
      //       value: docsUrl
      //     };
      //     textObject.hoverEvent = {
      //       action: 'show_text',
      //       value: DOCS_TEXT
      //     };
      //   } else {
      //     textObject.hoverEvent = {
      //       action: 'show_text',
      //       value: DOCS_TEXT_NOT_FOUND.replace('{className}', value["class"].getName ? value["class"].getName : value + '')
      //     };
      //   }

      //   text = [textObject];
      // } else {
        //is javascript function
        text = [ccs('&9&lfunction&6' + (value.name ? ' ' + value.name : '') + '&e(&7' + getFunctionArgs(value).join(', ') + '&e) {}')];
      // }

      break;

    case 'number':
      text = [ccs('&b' + value.toString())];
      break;

    case 'object':
      //Is JS array?
      if (isArray(value)) {
        text = [ccs('&7[&r')];

        for (var i = 0; i < value.length; i++) {
          if (i >= maxDepth) {
            text.push({
              text: [ccs('\n' + indent + '  ' + prefix + '&5[...]')],
              hoverEvent: {
                action: 'show_text',
                value: ccs('&dOutput is limited to ' + maxDepth + ' items.\n\nClick \'inspect\' or use methods like &7.&eslice&7()&d to scroll through result.')
              }
            });
            break;
          }

          text.push(ccs('\n' + indent + '  ' + prefix));
          text.push(rawFormatVar(value[i], indents + 1, '', history));
        }

        text.push(ccs((value.length ? '\n' : '') + indent + '&7]&r')); //Is JS Object?
      } else if (isObject(value)) {
        text = [ccs('&7{&r')];
        var counter = 0;

        for (var key in value) {
          if (counter >= maxDepth) {
            text.push(ccs('\n' + indent + '  ' + prefix + '&5[...]'));
            break;
          }

          text.push(ccs('\n' + indent + '  &c' + JSON.stringify(key) + '&7: '));
          text.push(rawFormatVar(value[key], indents + 1, '', history));
          counter++;
        }

        text.push(ccs((Object.keys(value).length ? '\n' : '') + indent + '&7}&r')); //Is null?
      } else if (value === null) {
        text = [ccs('&6&lnull')];
      } else if (value instanceof JavaObject && value["class"]) {
        var valueClassName = value["class"].getSimpleName();

        if (!valueClassName && value["class"].isAnonymousClass()) {
          valueClassName = '<Anonymous>';
        } // var methodsText = '';
        // var valueMethods = value.class.getDeclaredMethods();
        // var counter = 0;
        // for(var i in valueMethods) {
        //     if (counter >= maxDepth) {
        //         methodsText += '  &7...\n';
        //         break;
        //     }
        //     var valueMethod = valueMethods[i];
        //     var parametersText = [];
        //     var valueMethodParameters = valueMethod.getParameters();
        //     for(var j in valueMethodParameters) {
        //         var valueMethodParameter = valueMethodParameters[j];
        //         var valueParameterType = valueMethodParameter.getType().getSimpleName()
        //             .replace(/\[(L)?/g, '&7[$1')
        //             .replace(/\]/g, '&7]')
        //             .replace(/</g, '&7<')
        //             .replace(/>/g, '&7>');
        //         parametersText.push('&6' + valueParameterType + (valueMethodParameter.isNamePresent() ? ' &r' + valueMethodParameter.getName() : ''));
        //     }
        //     parametersText = ccs(parametersText.join(ccs('&7, &r')));
        //     var methodReturnType = valueMethod.getReturnType().getSimpleName()
        //         .replace(/\[(L)?/g, '&7[$1')
        //             .replace(/\]/g, '&7]')
        //             .replace(/</g, '&7<')
        //             .replace(/>/g, '&7>');
        //     methodsText += '  &6' + methodReturnType + ' &r' + valueMethod.getName() + '&7(&r' + parametersText + '&7)\n';
        //     counter++;
        // }


        var packageName = value["class"].getName().split('.');
        packageName.pop();
        packageName = packageName.join('.');
        var extendsText = '';

        if (value["class"].getGenericSuperclass && value["class"].getGenericSuperclass()) {
          extendsText = '\n&6extends &r' + value["class"].getSuperclass().getName();
        }

        var textObject = {
          text: [ccs('&c&n' + valueClassName + '&e&n@&6&n' + JavaSystem.identityHashCode(value).toString(16) + '&r')],
          hoverEvent: {
            action: 'show_text',
            value: ccs('&6package &r' + packageName + '\n&6class &r' + value["class"].getSimpleName() + extendsText + '\n')
          }
        };
        var docsUrl = getDocsUrlForValue(value);

        if (docsUrl) {
          textObject.clickEvent = {
            action: 'open_url',
            value: docsUrl
          };
          textObject.hoverEvent.value += '\n' + DOCS_TEXT;
        } else {
          textObject.hoverEvent.value += '\n' + DOCS_TEXT_NOT_FOUND.replace('{className}', value["class"].getName ? value["class"].getName() : value + '');
        }

        text = [textObject];
      } else if (value instanceof Error) {
        var logValue = handleEvalError(value, false, null, '', true); //Transform text to array for flattenRawFormat function

        logValue.text = [logValue.text];
        text = [logValue];
      } else {
        text = [value];
      }

      break;

    default:
      text = [value];
      break;
  }

  return {
    text: text
  };
} // import java net.minecraft.command.server.CommandMessageRaw;


function tellraw(player, rawText) {
  API.executeCommand(player.world, '/tellraw ' + player.getName() + ' ' + JSON.stringify(rawText));
  return;
  var args = [player.UUID, JSON.stringify(rawText)];
  var cmd = new CommandMessageRaw();
  var w = API.getIWorld(0);
  var mcServer = w.getMCWorld().func_73046_m();
  cmd.func_184881_a(mcServer, player.getMCEntity(), args);
}

function getFunctionArgs(func) {
  // First match everything inside the function argument parens.
  var args = func.toString().match(/function\s*.*?\(([^)]*)\)/)[1]; // Split the arguments string into an array comma delimited.

  return args.split(',').map(function (arg) {
    // Ensure no inline comments are parsed and trim the whitespace.
    return arg.replace(/\/\*.*\*\//, '').trim();
  }).filter(function (arg) {
    // Ensure no undefined values are added.
    return arg;
  });
}

function methods(value) {
  if (!(value instanceof JavaObject) || !value["class"] || !value["class"].getSimpleName || !value["class"].getDeclaredMethods) {
    throw new TypeError(value + ' is not a Java class');
  }

  var returnValueMethods = [];
  var valueClassName = value["class"].getSimpleName();

  if (!valueClassName && value["class"].isAnonymousClass()) {
    valueClassName = '<Anonymous>';
  }

  var methodsText = '';
  var valueMethods = value["class"].getDeclaredMethods();
  var counter = 0;

  for (var i in valueMethods) {
    var valueMethod = valueMethods[i];
    var parametersText = [];
    var returnValueParameters = [];
    var valueMethodParameters = valueMethod.getParameters();

    for (var j in valueMethodParameters) {
      var valueMethodParameter = valueMethodParameters[j];
      var valueParameterType = valueMethodParameter.getType().getSimpleName().replace(/\[(L)?/g, '&7[$1').replace(/\]/g, '&7]').replace(/</g, '&7<').replace(/>/g, '&7>');
      returnValueParameters.push({
        type: valueMethodParameter.getType().getName(),
        name: valueMethodParameter.isNamePresent() ? valueMethodParameter.getName() : null
      });
    }

    returnValueMethods.push({
      returnType: valueMethod.getReturnType().getName(),
      name: valueMethod.getName(),
      parameters: returnValueParameters
    });
  }

  return returnValueMethods;
}

function fields(value) {
  if (!(value instanceof JavaObject) || !value["class"] || !value["class"].getSimpleName || !value["class"].getDeclaredMethods) {
    throw new TypeError(value + ' is not a Java class');
  }

  var returnValueFields = [];
  var valueClassName = value["class"].getSimpleName();

  if (!valueClassName && value["class"].isAnonymousClass()) {
    valueClassName = '<Anonymous>';
  }

  var methodsText = '';
  var valueFields = value["class"].getDeclaredFields();
  var counter = 0;

  for (var i in valueFields) {
    var valueField = valueFields[i];
    returnValueFields.push({
      returnType: valueField.getType().getName(),
      name: valueField.getName()
    });
  }

  return returnValueFields;
}

function getDocsUrlForValue(value) {
  var multiple = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;

  if (!value["class"] || !(value instanceof JavaObject)) {
    return multiple ? [] : '';
  }

  var docsUrls = [];
  var docsPackageKeys = Object.keys(_DOCS_URLS);

  for (var i in docsPackageKeys) {
    var docsPackageKey = docsPackageKeys[i];
    var docsPackageUrl = _DOCS_URLS[docsPackageKey]; //Interface matching

    if (docsPackageKey.indexOf('I:') === 0) {
      var interfaces = value["class"].getInterfaces();

      for (var j in interfaces) {
        if (interfaces[j].getName().indexOf(docsPackageKey.replace(/^I:/, '')) !== 0) {
          continue;
        }

        var url = docsPackageUrl.base + interfaces[j].getName().replace(/\./g, '/') + docsPackageUrl.extension;

        if (multiple) {
          docsUrls.push(url);
          continue;
        } //Single mode


        return url;
      }
    } //Extends matching


    if (docsPackageKey.indexOf('E:') === 0) {
      var superClass = value["class"].getGenericSuperclass(); //try to 'repair' superclass

      if (!superClass.getName) {
        superClass = value["class"].getSuperclass();
      }

      if (superClass.getName) {
        superClass = superClass.getName();

        if (superClass.indexOf(docsPackageKey.replace(/^E:/, '')) === 0) {
          var url = docsPackageUrl.base + superClass.replace(/\./g, '/') + docsPackageUrl.extension;

          if (multiple) {
            docsUrls.push(url);
          } else {
            return url;
          }
        }
      }
    } //regular class matching


    if (value["class"].getName().indexOf(docsPackageKey) !== 0) {
      continue;
    }

    var url = docsPackageUrl.base + value["class"].getName().replace(/\./g, '/') + docsPackageUrl.extension;

    if (multiple) {
      docsUrls.push(url);
    } else {
      return url;
    }
  }

  return multiple ? docsUrls : '';
}
