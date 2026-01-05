// ==UserScript==
// @name        Tategaki Novel
// @namespace   http://userscripts.org/users/121129
// @description 小説投稿サイトに縦書き表示機能を追加
// @match       *://ncode.syosetu.com/n*
// @match       *://novel18.syosetu.com/n*
// @match       *://www.mai-net.net/bbs/sst/sst.php?*
// @match       *://syosetu.org/*
// @match       *://www.pixiv.net/novel/show.php?*
// @match       *://www.akatsuki-novels.com/stories/view/*
// @version     28
// @license     MIT
// @grant       GM_getValue
// @grant       GM_setValue
// @grant       GM_deleteValue
// @grant       GM.getValue
// @grant       GM.setValue
// @grant       GM.deleteValue
// @noframes
// @downloadURL https://update.greasyfork.org/scripts/882/Tategaki%20Novel.user.js
// @updateURL https://update.greasyfork.org/scripts/882/Tategaki%20Novel.meta.js
// ==/UserScript==


;(function() {
  'use strict'

  var onIFrame = window.top !== window.self
  if (onIFrame) return

  var Default = { LINE_NUM: 22
                , LINE_CHAR_NUM: 28
                , FONT_TYPE: 'gothic'
                , GOTHIC_FONT_FAMILY: [ '"メイリオ"'
                                      , '"IPAexゴシック"'
                                      , '"IPAゴシック"'
                                      , '"ＭＳ ゴシック"'
                                      , '"SimSun"'
                                      , 'monospace'
                                      ].join(', ')
                , MINCHO_FONT_FAMILY: [ '"IPAex明朝"'
                                      , '"IPA明朝"'
                                      , '"ＭＳ 明朝"'
                                      , '"SimSun"'
                                      , 'serif'
                                      ].join(', ')
                , FONT_SIZE: '20px'
                , FONT_WEIGHT: 'normal'
                , CHAR_HEIGHT: '1.1em'
                , MARGIN_TOP: '50px'
                , SPACE_BETWEEN_LINES: '1em'
                , COLOR: '#2F4F4F'
                , BACKGROUND_COLOR: '#D3D3D3'
                , TOOLBAR_VISIBLE: true
                , AUTO_VERTICAL_WRITING: true
                }

  const {_getValue, _syncValue, _setValue, _deleteValue} = (function() {
    function gm() {
      return typeof GM_deleteValue === 'undefined'
           ? [GM.getValue, GM.setValue, GM.deleteValue]
           : [GM_getValue, GM_setValue, GM_deleteValue]
    }
    const [gmGetValue, gmSetValue, gmDeleteValue] = gm()
    const data = new Map()
    return {
      _getValue(key, defaultValue) {
        return data.has(key) ? data.get(key) : defaultValue
      },
      async _syncValue(key) {
        const v = await gmGetValue(key)
        if (v !== undefined) data.set(key, v)
      },
      _setValue(key, value) {
        data.set(key, value)
        gmSetValue(key, value)
      },
      _deleteValue(key) {
        data.delete(key)
        gmDeleteValue(key)
      },
    }
  })()

  function GM_getLineNum() { return _getValue('lineNum', Default.LINE_NUM) }
  function GM_getLineCharNum() {
    return _getValue('lineCharNum', Default.LINE_CHAR_NUM)
  }
  function GM_getFontType() { return _getValue('fontType', Default.FONT_TYPE) }
  function GM_getGothicFontFamily() {
    return _getValue('gothicFontFamily', Default.GOTHIC_FONT_FAMILY)
  }
  function GM_getMinchoFontFamily() {
    return _getValue('minchoFontFamily', Default.MINCHO_FONT_FAMILY)
  }
  function GM_getFontFamily(fontType) {
    switch (fontType || GM_getFontType()) {
      case 'gothic': return GM_getGothicFontFamily()
      case 'mincho': return GM_getMinchoFontFamily()
      default: throw new Error(fontType || GM_getFontType())
    }
  }
  function GM_getColor() {
    return _getValue('color', Default.COLOR)
  }
  function GM_getBackgroundColor() {
    return _getValue('backgroundColor', Default.BACKGROUND_COLOR)
  }
  function GM_isToolbarVisible() {
    return _getValue('toolbarVisible', Default.TOOLBAR_VISIBLE)
  }
  function GM_isAutoVerticalWriting() {
    return _getValue('autoVerticalWriting', Default.AUTO_VERTICAL_WRITING)
  }
  function GM_getFontSize() {
    return _getValue('fontSize', Default.FONT_SIZE)
  }
  function GM_getCharHeight() {
    return _getValue('charHeight', Default.CHAR_HEIGHT)
  }
  function GM_getMarginTop() {
    return _getValue('marginTop', Default.MARGIN_TOP)
  }
  function GM_getSpaceBetweenLines() {
    return _getValue('spaceBetweenLines', Default.SPACE_BETWEEN_LINES)
  }
  function GM_getFontWeight() {
    return _getValue('fontWeight', Default.FONT_WEIGHT)
  }
  function GM_keys() {
    return [
      'lineNum',
      'lineCharNum',
      'fontType',
      'gothicFontFamily',
      'minchoFontFamily',
      'color',
      'backgroundColor',
      'toolbarVisible',
      'fontSize',
      'charHeight',
      'marginTop',
      'spaceBetweenLines',
      'auto',
      'autoVerticalWriting',
      'fontWeight',
    ]
  }
  function GM_clear() {
    for (const key of GM_keys()) _deleteValue(key)
  }
  function GM_sync() {
    return Promise.all(GM_keys().map(key => _syncValue(key)))
  }


  function hasParam(location, name, val) {
    return location.search.substring(1).split('&').some(function(param) {
      var i = param.indexOf('=')
      if (name !== param.substring(0, i)) return false
      var v = param.substring(i + 1)
      return val instanceof RegExp ? val.test(v) : val === v
    })
  }
  function getHRef(selector, textContent) {
    var anchors = document.querySelectorAll(selector)
    for (var i = 0; i < anchors.length; i++) {
      var a = anchors[i]
      if (!textContent || a.textContent === textContent) return a.href
    }
    return ''
  }
  function insertCell(row, child) {
    var result = row.insertCell(-1)
    result.style.border = '1px solid'
    result.style.padding = '5px'
    result.style.fontSize = '18px'
    if (child) {
      if (child.nodeType) result.appendChild(child)
      else result.textContent = child
    }
    return result
  }
  var newTextNode = document.createTextNode.bind(document)
  function getLine(selector) {
    var n = document.querySelector(selector)
    return n ? Line.parse(n.childNodes) : null
  }
  function getLines(selector) {
    var n = document.querySelector(selector)
    return n ? Lines.parse(n.childNodes) : []
  }
  function newRotatedElem(text, doc) {
    var result = (doc || document).createElement('span')
    result.textContent = text
    result.style.display = 'inline-block'
    result.style.transform = 'rotate(90deg)'
    result.style.webkitTransform = 'rotate(90deg)'
    return result
  }


  var pixelCharSize = (function() {
    var doc = document
    var height = 0
    var char2width = Object.create(null)
    function calcHeight() {
      var e = doc.createElement('div')
      e.style.position = 'absolute'
      e.style.fontSize = GM_getFontSize()
      e.style.lineHeight = GM_getCharHeight()
      doc.body.appendChild(e)
      try {
        var s = doc.defaultView.getComputedStyle(e)
        var h = s.lineHeight === 'normal' ? s.fontSize : s.lineHeight
        return parseFloat(h)
      } finally {
        doc.body.removeChild(e)
      }
    }
    function calcWidth(ch) {
      var e = doc.createElement('pre')
      e.style.position = 'absolute'
      e.appendChild(doc.createTextNode(ch))
      e.style.fontFamily = GM_getFontFamily()
      e.style.fontSize = GM_getFontSize()
      e.style.fontWeight = GM_getFontWeight()
      doc.body.appendChild(e)
      try {
        return parseFloat(doc.defaultView.getComputedStyle(e).width)
      } finally {
        doc.body.removeChild(e)
      }
    }
    return {
      get doc() { return doc }
    , set doc(v) { doc = v || document }
    , height: function() { return height || (height = calcHeight()) }
    , width: function(ch) {
        return char2width[ch] || (char2width[ch] = calcWidth(ch))
      }
    , clearCache: function() {
        height = 0
        char2width = Object.create(null)
      }
    }
  })()

  function Block() {}
  Block.prototype.startsWithBadChar = function() { return false }
  Block.prototype.endsWithBadChar = function() { return false }
  Block.prototype.setLine = function() { return this }
  Block.prototype.trimHead = function() { return this }
  Block.prototype.isEmpty = function() { return false }

  const CombinationChar = (() => {
    const map = new Map([
      ['\u309b', '\u309b'],
      ['\u3099', '\u309b'],
      ['\u309c', '\u309c'],
      ['\u309a', '\u309c'],
    ])
    const regexp = (() => {
      let s = ''
      for (const [k] of map) s += k
      return new RegExp(`[^${s}][${s}]`, 'g')
    })()
    return class CombinationChar extends Block {
      constructor(base, combination) {
        super()
        this.base = base
        this.combination = map.get(combination)
      }
      isEmpty() { return false }
      getLength() { return 1 }
      canCut() { return false }
      newNode(doc) {
        const result = doc.createElement('div')
        result.style.display = 'inline-block'
        result.style.position = 'relative'
        result.style.width = '2em'
        result.textContent = this.base + this.combination
        return result
      }
      static get regexp() { return regexp }
    }
  })()

  var Text = (function() {
    var replaceByVerticalChars = (function() {
      var map = { '「':'﹁', '」':'﹂', '｢':'﹁', '｣':'﹂'
                , '『':'﹃', '』':'﹄', '（':'︵', '）':'︶'
                , '｛':'︷', '｝':'︸', '〈':'︿', '〉':'﹀'
                , '＜':'︿', '＞':'﹀', '《':'︽', '》':'︾'
                , '≪':'︽', '≫':'︾', '〔':'︹', '〕':'︺'
                , '【':'︻', '】':'︼', '－':'︱', '―':'︱'
                , '─':'︱', '—':'︱', 'ー':'丨', '−':'︱'
                , '…':'︙', '‥':'︰'
                , '、':'︑', '。':'︒', '，':'︐'
                , '\u3016': '\ufe17'
                , '\u3017': '\ufe18'
                }
        , regExp = new RegExp(Object.keys(map).join('|'), 'g')
      return function(str) {
        return str.replace(regExp, function(match) { return map[match] })
      }
    })()
    var replaceIsolatedAsciiByZenkaku = (function() {
      var regExp = /(^|[^\x20-\x7e])([\x21-\x7e])(?=$|[^\x20-\x7e])/g
        , diff = '！'.charCodeAt(0) - '!'.charCodeAt(0)
      return function(str) {
        return str.replace(regExp, function(match, p1, p2) {
          return p1 + String.fromCharCode(p2.charCodeAt(0) + diff)
        })
      }
    })()
    function removeAllWhiteSpace(str) {
      return str.replace(/[ \t\r\n\u00A0]/g, '')
    }
    var replaceTwoExclamationOrQuestion = (function() {
      var map = { '！！': '‼', '？？': '⁇', '？！': '⁈', '！？': '⁉' }
        , regExp = /(^|[^！？])([！？]{2})(?=$|[^！？])/g
      return function(str) {
        return str.replace(regExp, function(match, p1, p2) {
          return p1 + map[p2]
        })
      }
    })()
    var reverseQuotationMark = (function() {
      var map = { '“':'”', '”':'“', '‘':'’', '’':'‘'
                , '〝':'”', '〟':'“', '〞':'“'
                }
        , regExp = new RegExp(Object.keys(map).join('|'), 'g')
      return function(str) {
        return str.replace(regExp, function(match) { return map[match] })
      }
    })()
    var replaceHalfwidthKatakanaByFullwidth = (function() {
      var fullwidth = '。「」、・ヲァィゥェォャュョッー'
                    + 'アイウエオカキクケコサシスセソタチツテト'
                    + 'ナニヌネノハヒフヘホマミムメモヤユヨラリルレロ'
                    + 'ワン゛゜'
        , halfwidth = /([｡-ﾟ])([ﾞﾟ]?)/g
        , dakuten_able = /[カ-チツ-トハ-ホ]/
        , handakuten_able = /[ハ-ホ]/
        , halfwidthBase = '｡'.charCodeAt(0)
      function plusCharCode(ch, n) {
        return String.fromCharCode(ch.charCodeAt(0) + n)
      }
      return function(str) {
        return str.replace(halfwidth, function(match, p1, p2) {
          var c = fullwidth.charAt(p1.charCodeAt(0) - halfwidthBase)
          if (!p2) return c
          if (p2 === 'ﾞ') {
            if (dakuten_able.test(c)) return plusCharCode(c, 1)
            switch (c) {
              case 'ウ': return 'ヴ'
              case 'ワ': return 'ヷ'
              case 'ヲ': return 'ヺ'
              default: return c + '゛'
            }
          }
          if (handakuten_able.test(c)) return plusCharCode(c, 2)
          return c + '゜'
        })
      }
    })()
    var rotateArrows = (function() {
      var map = { '↑': '→', '↓': '←', '→': '↓', '←': '↑' }
        , regExp = new RegExp(Object.keys(map).join('|'), 'g')
      return function(str) {
        return str.replace(regExp, function(match) { return map[match] })
      }
    })()
    var insertFullwidthSpaceAfterExclamationOrQuestion = (function() {
      var re = /[！？‼⁇⁈⁉](?![！？‼⁇⁈⁉」』）｝〉＞》≫〕】”’〟〞\u3000]|$)/g
      return function(str) {
        return str.replace(re, function(match) { return match + '　' })
      }
    })()
    function replace(text) {
      var str = removeAllWhiteSpace(text)
      str = replaceIsolatedAsciiByZenkaku(str)
      str = replaceHalfwidthKatakanaByFullwidth(str)
      str = insertFullwidthSpaceAfterExclamationOrQuestion(str)
      str = replaceByVerticalChars(str)
      str = replaceTwoExclamationOrQuestion(str)
      str = reverseQuotationMark(str)
      str = rotateArrows(str)
      return str
    }

    function Text(text, replaced) {
      this.val = replaced ? text : replace(text)
      Object.freeze(this)
    }
    Text.prototype = Object.create(Block.prototype)
    Text.prototype.isEmpty = function() { return !this.val }
    Text.prototype.getLength = function() { return this.val.length }
    Text.prototype.canCut = function(index) {
      return 0 < index && index < this.getLength()
    }
    Text.prototype.cut = function(index) {
      return { before: new Text(this.val.substring(0, index), true)
             , after: new Text(this.val.substring(index), true)
             }
    }
    Text.prototype.startsWithBadChar = (function() {
      var regExp = new RegExp('[﹂﹄︶︸﹀︾︺︼︑︒︐］“‘！？‼⁇⁈⁉丨'
                            + 'ぁぃぅぇぉっゃゅょゎァィゥェォッャュョヮヵヶ'
                            + '〜～]')
      return function() { return regExp.test(this.val[0]) }
    })()
    Text.prototype.endsWithBadChar = function() {
      return /[﹁﹃︵︷︿︽︹︻［”’]/.test(this.val[this.val.length - 1])
    }
    Text.prototype.trimHead = function() {
      return /^\u3000+/.test(this.val) ? new Text(this.val.trimLeft(), true)
                                       : this
    }
    Text.prototype.newNode = (function() {
      function replaceMatchedTextByCreatedElem(textNode
                                             , regExp
                                             , createElem
                                             , doc) {
        var result = doc.createDocumentFragment()
          , begin = 0
          , text = textNode.nodeValue
        for (var r; r = regExp.exec(text);) {
          result.appendChild(doc.createTextNode(text.substring(begin
                                                             , r.index)))
          result.appendChild(createElem(r[0], doc))
          begin = regExp.lastIndex
        }
        result.appendChild(doc.createTextNode(text.substring(begin)))
        result.normalize()
        return result
      }
      function replaceTextNodeIfMatched(node, regExp, createElem, doc) {
        Array.prototype.filter.call(node.childNodes, function(child) {
          return child.nodeType === Node.TEXT_NODE
        }).forEach(function(textNode) {
          node.replaceChild(replaceMatchedTextByCreatedElem(textNode
                                                          , regExp
                                                          , createElem
                                                          , doc)
                          , textNode)
        })
        return node
      }
      function rotateNoVerticalChars(node, doc) {
        return replaceTextNodeIfMatched(node
                                      , /[［］＝：；〜～]/g
                                      , newRotatedElem
                                      , doc)
      }
      var translateSutegana = (function() {
        var regExp = /[ぁぃぅぇぉっゃゅょゎァィゥェォッャュョヮヵヶ]/g
        function newSuteganaElem(text, doc) {
          var result = doc.createElement('span')
          result.textContent = text
          result.style.position = 'relative'
          result.style.left = '0.1em'
          result.style.top = '-0.1em'
          return result
        }
        return function(node, doc) {
          return replaceTextNodeIfMatched(node, regExp, newSuteganaElem, doc)
        }
      })()
      var translateQuotationMark = (function() {
        var regExp = /[”“’‘]/g
        function newQuotationMarkElem(text, doc) {
          var result = doc.createElement('span')
          result.textContent = text
          result.style.position = 'relative'
          if (text === '”' || text === '’') {
            result.style.top = '0.5em'
            if (text === '”') result.style.left = '0.5em'
            else result.style.left = '0.7em'
          } else {
            result.style.top = '0.2em'
            if (text === '“') result.style.right = '0.5em'
            else result.style.right = '0.7em'
          }
          return result
        }
        return function(node, doc) {
          return replaceTextNodeIfMatched(node
                                        , regExp
                                        , newQuotationMarkElem
                                        , doc)
        }
      })()
      return function(doc) {
        doc = doc || document
        var df = doc.createDocumentFragment()
        df.appendChild(doc.createTextNode(this.val))
        df = rotateNoVerticalChars(df, doc)
        df = translateSutegana(df, doc)
        df = translateQuotationMark(df, doc)
        return df
      }
    })()
    return Text
  })()

  var Ascii = (function() {
    function toIntEmLength(pxLength) {
      return Math.ceil(pxLength / pixelCharSize.height())
    }
    function getTextPxWidth(str) {
      return Array.prototype.reduce.call(str, function(pre, ch) {
        return pre + pixelCharSize.width(ch)
      }, 0)
    }
    function getIntEmLength(str) { return toIntEmLength(getTextPxWidth(str)) }
    function compressWhiteSpaces(str) {
      return str.replace(/[ \t\r\n]+/g, ' ')
    }

    function Ascii(asciiText) {
      this.val = compressWhiteSpaces(asciiText)
      Object.freeze(this)
    }
    Ascii.prototype = Object.create(Block.prototype)
    Ascii.prototype.getLength = function() { return getIntEmLength(this.val) }
    Ascii.prototype.canCut = function(index) {
      var v = this.val, i = v.indexOf(' ')
      if (i === -1) return false
      return getIntEmLength(v.substring(0, i)) <= index
    }
    Ascii.prototype.cut = function(index) {
      var sub = this.val.split(' ')
      for (var i = 2, n = sub.length; i <= n; i++) {
        var pxLen = getTextPxWidth(sub.slice(0, i).join(' '))
        if (toIntEmLength(pxLen) >= index) break
      }
      return { before: new Ascii(sub.slice(0, i - 1).join(' '))
             , after: new Ascii(sub.slice(i - 1).join(' ')) }
    }
    Ascii.prototype.newNode = function(doc) {
      var result = newRotatedElem(this.val, doc)
      result.style.transformOrigin = '0.5em 0.5em 0px'
      result.style.webkitTransformOriginX = '0.5em'
      result.style.webkitTransformOriginY = '0.5em'
      result.style.textAlign = 'center'
      result.style.lineHeight = '1'
      var len = this.getLength()
      var h = pixelCharSize.height()
      result.style.width = len * h + 'px'
      result.style.marginBottom = (len - 1) * h + 'px'
      return result
    }
    return Ascii
  })()

  var Ruby = (function() {
    function rubyCharPxHeight() {
      return pixelCharSize.height() / 2
    }

    function Ruby(base, val, line) {
      this.base = base
      this.val = val
      this.line = line
      Object.freeze(this)
    }
    Ruby.parse = (function() {
      var map = { 'ぁ': 'あ', 'ぃ': 'い', 'ぅ': 'う', 'ぇ': 'え', 'ぉ': 'お'
                , 'っ': 'つ', 'ゃ': 'や', 'ゅ': 'ゆ', 'ょ': 'よ', 'ゎ': 'わ'
                , 'ァ': 'ア', 'ィ': 'イ', 'ゥ': 'ウ', 'ェ': 'エ', 'ォ': 'オ'
                , 'ッ': 'ツ', 'ャ': 'ヤ', 'ュ': 'ユ', 'ョ': 'ヨ', 'ヮ': 'ワ'
                , 'ヵ': 'カ', 'ヶ': 'ケ'
                }
      var re = new RegExp(Object.keys(map).join('|'), 'g')
      function replaceSuteganaByBigChar(str) {
        return str.replace(re, function(match) { return map[match] })
      }
      return function(rubyElem) {
        var rb = '', rt = ''
        Array.prototype.forEach.call(rubyElem.childNodes, function(n) {
          if (n.tagName === 'RB') rb += n.textContent
          else if (n.tagName === 'RT') rt += n.textContent
          else if (n.nodeType === Node.TEXT_NODE) rb += n.nodeValue
        })
        rb = rb.trim()
        rt = replaceSuteganaByBigChar(rt.trim())
        return rb && rt ? new Ruby(Line.newByStr(rb), Line.newByStr(rt)) : null
      }
    })()
    Ruby.prototype = Object.create(Block.prototype)
    Ruby.prototype.hasRubyNeighbor = function() {
      if (!this.line) return false
      var blocks = this.line.blocks, i = blocks.indexOf(this)
      if (i === -1) return false
      return (blocks[i - 1] && blocks[i - 1] instanceof Ruby)
          || (blocks[i + 1] && blocks[i + 1] instanceof Ruby)
    }
    Ruby.prototype.getLength = function() {
      var rubyLen = this.val.getLength()
      var baseLen = this.base.getLength()
      var rubyLenCapacity = this.base.getLength() * 2
                            + (this.hasRubyNeighbor() ? 0 : 2)
      if (rubyLen <= rubyLenCapacity) return baseLen
      return baseLen + Math.ceil((rubyLen - rubyLenCapacity) / 2)
    }
    Ruby.prototype.canCut = function() { return false }
    Ruby.prototype.getRubyNodeTop = function() {
      var h = rubyCharPxHeight()
      var diff = this.base.getLength() * 2 - this.val.getLength()
      if (diff >= 0) return diff * h / 2 + 'px'
      var top = diff % 2 ? -h / 2 : -h
      return (this.hasRubyNeighbor() ? top + h : top) + 'px'
    }
    Ruby.prototype.newRubyNode = function(doc) {
      var result = doc.createElement('div')
      result.style.position = 'absolute'
      result.style.width = '1em'
      result.style.lineHeight = rubyCharPxHeight() + 'px'
      result.style.fontSize = '0.5em'
      result.style.top = this.getRubyNodeTop()
      result.style.left = '2em'
      ;[].slice.call(this.val.newNode(doc).childNodes).forEach(function(n) {
        result.appendChild(n)
      })
      return result
    }
    Ruby.prototype.newBaseNode = function(doc) {
      var result = doc.createDocumentFragment()
      ;[].slice.call(this.base.newNode(doc).childNodes).forEach(function(n) {
        result.appendChild(n)
      })
      return result
    }
    Ruby.prototype.getNodePadding = function() {
      var h = pixelCharSize.height()
      var p = (this.getLength() - this.base.getLength()) * h / 2
      return p + 'px 0'
    }
    Ruby.prototype.newNode = function(doc) {
      doc = doc || document
      var result = doc.createElement('span')
      result.style.display = 'inline-block'
      result.style.position = 'relative'
      result.style.width = '1em'
      result.style.padding = this.getNodePadding()
      result.appendChild(this.newBaseNode(doc))
      result.appendChild(this.newRubyNode(doc))
      return result
    }
    Ruby.prototype.setLine = function(line) {
      return new Ruby(this.base, this.val, line)
    }
    Ruby.prototype.isEmphasized = function() {
      var bbs = this.base.blocks, rbs = this.val.blocks
      if (!(bbs.length === 1 && rbs.length === 1)) return false
      var bb = bbs[0], rb = rbs[0]
      if (!(bb instanceof Text && rb instanceof Text)) return false
      var bv = bb.val, rv = rb.val
      return bv.length === rv.length && /^([・﹅])\1*$/.test(rv)
    }
    Ruby.prototype.splitIntoEmphasisDots = function() {
      var bv = this.base.blocks[0].val
      return Array.prototype.map.call(bv, function(c) {
        return new Ruby(Line.newByStr(c), Line.newByStr('﹅'), this.line)
      }, this)
    }
    return Ruby
  })()

  var Link = (function() {
    function Link(href, text, clickHandler) {
      this.href = href
      this.text = text || '︻挿絵表示︼'
      this.clickHandler = clickHandler
      Object.freeze(this)
    }
    Link.prototype = Object.create(Block.prototype)
    Link.prototype.getLength = function() { return this.text.length }
    Link.prototype.canCut = function() { return false }
    Link.prototype.newNode = function(doc) {
      doc = doc || document
      var a = doc.createElement('a')
      a.href = this.href
      a.textContent = this.text
      if (this.clickHandler) {
        a.addEventListener('click', this.clickHandler)
      } else {
        a.target = '_blank'
      }
      var s = a.style
      s.display = 'inline-block'
      s.textDecoration = 'none'
      s.borderLeftWidth = 'thin'
      s.borderLeftStyle = 'solid'
      s.width = '1em'
      s.color = GM_getColor()
      var df = doc.createDocumentFragment()
      df.appendChild(a)
      return df
    }
    return Link
  })()

  var Line = (function() {
    function addTextIfNotEmpty(blocks, str) {
      if (!str) return
      var t = new Text(str)
      if (!t.isEmpty()) blocks.push(t)
    }
    function addCombinationCharIfNotEmpty(blocks, str) {
      if (!str) return
      let begin = 0
      for (let r; r = CombinationChar.regexp.exec(str);) {
        addTextIfNotEmpty(blocks, str.substring(begin, r.index))
        const base = r[0].charAt(0)
        const combination = r[0].charAt(1)
        blocks.push(new CombinationChar(base, combination))
        begin = CombinationChar.regexp.lastIndex
      }
      addTextIfNotEmpty(blocks, str.substring(begin))
    }
    function parseText(blocks, text) {
      var re = /[\x21-\x7e][\x20-\x7e\n\t\r]*[\x21-\x7e]/g, begin = 0
      for (var r; r = re.exec(text);) {
        addCombinationCharIfNotEmpty(blocks, text.substring(begin, r.index))
        blocks.push(new Ascii(r[0]))
        begin = re.lastIndex
      }
      addCombinationCharIfNotEmpty(blocks, text.substring(begin))
    }
    function pushImgLinkInImageContainer(n, blocks) {
      var img = n.querySelector('a img')
      if (img) {
        var r = /^illust_list_(\d+)(\-\d+)?$/.exec(img.id)
        var href = '/member_illust.php?mode='
          + (r[2] ? 'manga_big' : 'medium')
          + '&illust_id=' + r[1]
          + (r[2] ? '&page=' + (Math.floor(r[2].slice(1)) - 1) : '')
        blocks.push(new Link(href))
      }
    }
    function pushImgLinkInNovelImage(n, blocks) {
      var r = /novelimage-(\d+)(\-\d+)?/.exec(n.className)
      var href = '/member_illust.php?mode='
        + (r[2] ? 'manga_big' : 'medium')
        + '&illust_id=' + r[1]
        + (r[2] ? '&page=' + (Math.floor(r[2].slice(1)) - 1) : '')
      blocks.push(new Link(href))
    }
    function pushRuby(blocks, ruby) {
      Array.prototype.push.apply(blocks, ruby.isEmphasized()
                                         ? ruby.splitIntoEmphasisDots()
                                         : [ruby])
    }

    function Line(blocks) {
      this.blocks = Object.freeze((blocks || []).map(function(b) {
        return b.setLine(this)
      }, this))
      Object.freeze(this)
    }
    Line.EMPTY = new Line()
    Line.parse = function(childNodes) {
      var blocks = [], text = ''
      Array.prototype.forEach.call(childNodes, function(n) {
        if (n.tagName === 'RUBY') {
          var ruby = Ruby.parse(n)
          if (ruby) {
            parseText(blocks, text)
            text = ''
            pushRuby(blocks, ruby)
          } else {
            text += n.textContent
          }
        } else if (n.tagName === 'SPAN' && n.classList.contains('.sesame')) {
          var rubys = n.getElementsByTagName('ruby')
          Array.prototype.forEach.call(rubys, function(n) {
            var ruby = Ruby.parse(n)
            if (ruby) {
              parseText(blocks, text)
              text = ''
              pushRuby(blocks, ruby)
            } else {
              text += n.textContent
            }
          })
        } else if (n.tagName === 'A') {
          parseText(blocks, text)
          text = ''
          blocks.push(new Link(n.getAttribute('href')))
        } else if (n.tagName === 'IMG') {
          parseText(blocks, text)
          text = ''
          blocks.push(new Link(n.getAttribute('src')))
        } else if (n.tagName === 'DIV'
                && n.classList.contains('image_container')) {
          parseText(blocks, text)
          text = ''
          pushImgLinkInImageContainer(n, blocks)
        } else if (n.tagName === 'DIV'
                && n.classList.contains('caption')) {
          // do nothing
        } else if (n.tagName === 'SPAN'
                && n.classList.contains('novelimage')) {
          parseText(blocks, text)
          text = ''
          pushImgLinkInNovelImage(n, blocks)
        } else {
          text += n.textContent
        }
      })
      parseText(blocks, text)
      return blocks.length ? new Line(blocks) : Line.EMPTY
    }
    Line.newByStr = function(str) { return Line.parse([newTextNode(str)]) }
    Line.prototype.getLength = function() {
      return this.blocks.reduce(function(pre, block) {
        return pre + block.getLength()
      }, 0)
    }
    Line.prototype.cut = (function() {
      function cut(block, index, before, after) {
        var o = block.cut(index)
        before.push(o.before)
        after.unshift(o.after)
      }
      function endsWithBadChar(blocks) {
        if (!blocks.length) return false
        var last = blocks[blocks.length - 1]
        return last.endsWithBadChar()
            && !(last.getLength() === 1 && blocks.length === 1)
      }
      function startsWithBadChar(after) {
        return after.length && after[0].startsWithBadChar()
      }
      function pollLastChar(before, after) {
        var b = before.pop()
        if (b.getLength() === 1) after.unshift(b)
        else cut(b, b.getLength() - 1, before, after)
      }
      function pollTopChar(after, before) {
        var b = after.shift()
        if (b.getLength() === 1) before.push(b)
        else cut(b, 1, before, after)
      }
      function trimHead(after) {
        if (!after.length) return
        var b = after.shift().trimHead()
        if (!b.isEmpty()) after.unshift(b)
      }
      var MAX_POLL_NUM = 3
      return function(index) {
        var after = this.blocks.slice(), before = []
        for (var b, begin = 0; b = after.shift(); begin += b.getLength()) {
          var end = begin + b.getLength()
          if (end === index) {
            before.push(b)
            break
          }
          if (begin <= index && index < end) {
            if (b.canCut(index - begin)) cut(b, index - begin, before, after)
            else if (begin === 0) before.push(b)
            else after.unshift(b)
            break
          }
          before.push(b)
        }
        for (var i = 0; i < MAX_POLL_NUM && endsWithBadChar(before); i++) {
          pollLastChar(before, after)
        }
        for (i = 0; i < MAX_POLL_NUM && startsWithBadChar(after); i++) {
          pollTopChar(after, before)
        }
        trimHead(after)
        return after.length
             ? { before: new Line(before), after: new Line(after) }
             : { before: this, after: null }
      }
    })()
    Line.prototype.split = function(lineCharNum) {
      var result = [], line = this
      do {
        var o = line.cut(lineCharNum)
        result.push(o.before)
      } while (line = o.after)
      return result
    }
    Line.prototype.isEmpty = function() { return !this.blocks.length }
    Line.prototype.newNode = function(doc) {
      doc = doc || document
      var result = doc.createElement('div')
      result.style.cssFloat = 'right'
      result.style.width = '1em'
      result.style.wordWrap = 'break-word'
      if (this.isEmpty()) {
        result.appendChild(doc.createTextNode('\u3000'))
      } else {
        this.blocks.forEach(function(b) { result.appendChild(b.newNode(doc)) })
      }
      return result
    }
    return Line
  })()

  var Lines =
    { trim: function(lines) {
        var begin = 0, end = lines.length
        while (lines[begin] && lines[begin].isEmpty()) begin++
        while (lines[end - 1] && lines[end - 1].isEmpty()) end--
        return lines.slice(begin, end)
      }
    , parse: (function() {
        var pushIfNotEmpty = function(sub, result) {
          var l = Line.parse(sub)
          if (!l.isEmpty()) result.push(l)
        }
        var paragraphParser =
        { parseSub: pushIfNotEmpty
        , parseNode: function(p, result) {
            result.push(Line.parse(p.childNodes))
          }
        }
        var parser =
        { 'BR':
          { parseSub: function(sub, result) { result.push(Line.parse(sub)) }
          , parseNode: function() {}
          }
        , 'P': paragraphParser
        , 'CENTER': paragraphParser
        , 'H4':
          { parseSub: pushIfNotEmpty
          , parseNode: function(h4, result) {
              if (result.length && !result[result.length - 1].isEmpty()) {
                result.push(Line.EMPTY)
              }
              result.push(Line.parse(h4.childNodes))
              result.push(Line.EMPTY)
            }
          }
        }
        return function(childNodes) {
          var result = [], sub = []
          ;[].forEach.call(childNodes, function(n) {
            if (Object.keys(parser).indexOf(n.tagName) >= 0) {
              var p = parser[n.tagName]
              p.parseSub(sub, result)
              p.parseNode(n, result)
              sub = []
            } else {
              sub.push(n)
            }
          })
          result.push(Line.parse(sub))
          return Lines.trim(result)
        }
      })()
    , split: function(lines, lineCharNum) {
        var result = []
        lines.forEach(function(line) {
          Array.prototype.push.apply(result, line.split(lineCharNum))
        })
        return result
      }
    }

  function Episode(obj) {
    this.novelTitle = obj.novelTitle || null
    this.chapterTitle = obj.chapterTitle || null
    this.author = obj.author || null
    this.title = obj.title || null
    this.text = Object.freeze((obj.text || []).slice())
    this.preface = Object.freeze((obj.preface || []).slice())
    this.postscript = Object.freeze((obj.postscript || []).slice())
    this.nextURL = obj.nextURL || ''
    this.prevURL = obj.prevURL || ''
    this.coverLinkClickHandler = obj.coverLinkClickHandler || ''
    this.position = obj.position || null
    Object.freeze(this)
  }

  function Site() {
    this.bookViewShown = false
  }
  Site.prototype.newButton = function() {
    var result = document.createElement('button')
    result.textContent = '縦書き'
    result.style.padding = '0px 6px'
    result.addEventListener('click'
                          , this.showBookView.bind(this, function() {}))
    result.addEventListener('click', function() { result.blur() })
    return result
  }
  Site.prototype.showBookView = function(done) {
    var iframe = document.createElement('iframe')
    iframe.style.position = 'fixed'
    iframe.style.top = '0px'
    iframe.style.left = '0px'
    iframe.style.width = '100%'
    iframe.style.height = '100%'
    iframe.style.zIndex = String(Math.pow(2, 31) - 1)
    iframe.style.borderWidth = '0px'
    iframe.addEventListener('load', function() {
      pixelCharSize.doc = iframe.contentDocument
      var book = new Book(this.parse())
      var view = new BookView(book, iframe.contentDocument)
      book.setView(view)
      document.documentElement.style.overflowY = 'hidden'
      view.onhide = function() {
        document.documentElement.style.overflowY = ''
        iframe.parentNode.removeChild(iframe)
        this.bookViewShown = false
        document.documentElement.focus()
      }.bind(this)
      view.show()
      setTimeout(iframe.focus.bind(iframe), 0)
      if (done) done(iframe)
    }.bind(this))
    this.bookViewShown = true
    document.body.appendChild(iframe)
  }

  var Narou = (function() {
    function isShortNovel() {
      return Boolean(document.querySelector('.p-novel .p-novel__author'))
    }
    function getParser() {
      return isShortNovel() ? new ShortParser() : new Parser()
    }
    const textSelector = '.p-novel__text:not(.p-novel__text--preface, .p-novel__text--afterword)'

    function Parser() {}
    Parser.prototype.novelTitleSelector = '.c-announce:not(.c-announce--note) a[href^="/n"]'
    Parser.prototype.titleSelector = '.p-novel__title.p-novel__title--rensai'
    Parser.prototype.getTitle = function() {
      var n = document.querySelector(this.titleSelector)
      return n && n.firstChild ? Line.parse([n.firstChild]) : null
    }
    Parser.prototype.getChapterTitle = function() {
      return getLine('.c-announce:not(.c-announce--note) span')
    }
    Parser.prototype.getAuthor = function() {
      var e = document.querySelector('.c-announce:not(.c-announce--note) a[href^="https://mypage.syosetu.com/"]')
      return e
           ? Line.newByStr(e.textContent)
           : null
    }
    Parser.prototype.parse = function() {
      return new Episode({
        novelTitle: getLine(this.novelTitleSelector)
      , chapterTitle: this.getChapterTitle()
      , author: this.getAuthor()
      , title: this.getTitle()
      , text: getLines(textSelector)
      , preface: getLines('.p-novel__text--preface')
      , postscript: getLines('.p-novel__text--afterword')
      , nextURL: getHRef('.c-pager__item--next')
      , prevURL: getHRef('.c-pager__item--before')
      , position: getLine('.p-novel__number')
      })
    }

    function ShortParser() {}
    ShortParser.prototype = Object.create(Parser.prototype)
    ShortParser.prototype.novelTitleSelector = '.p-novel__series-link'
    ShortParser.prototype.titleSelector = '.p-novel__title'
    ShortParser.prototype.getChapterTitle = function() { return null }
    ShortParser.prototype.getAuthor = function() {
      return getLine('.p-novel__author a')
    }

    function Narou() {}
    Narou.prototype = Object.create(Site.prototype)
    Narou.prototype.is = function(location) {
      var h = location.hostname
      return (h === 'ncode.syosetu.com' || h === 'novel18.syosetu.com')
          && /^\/n\d+[a-z]+/.test(location.pathname)
          && Boolean(document.querySelector(textSelector))
    }
    Narou.prototype.parse = function() { return getParser().parse() }
    Narou.prototype.addButton = function() {
      document.querySelector('.p-novel__title')?.after(this.newButton())
    }
    return Narou
  })()

  var Arcadia = (function() {
    function getAuthor() {
      var n = document.querySelector('.bgc > table td:first-child tt')
      var s = /^Name: ([^◆]+)/.exec(n.textContent)[1]
      return Line.parse([newTextNode(s)])
    }
    function getTitleFontElem() { return document.querySelector('.bgb font') }

    function Arcadia() {}
    Arcadia.prototype = Object.create(Site.prototype)
    Arcadia.prototype.is = function(location) {
      return location.hostname === 'www.mai-net.net'
          && location.pathname === '/bbs/sst/sst.php'
          && hasParam(location, 'act', 'dump')
          && hasParam(location, 'all', /[0-9]+/)
    }
    Arcadia.prototype.parse = function() {
      var navSelector = '.bgc > table td[align="right"] a'
      return new Episode({ author: getAuthor()
                         , title: Line.parse(getTitleFontElem().childNodes)
                         , text: getLines('.bgc blockquote div')
                         , nextURL: getHRef(navSelector, '次を表示する')
                         , prevURL: getHRef(navSelector, '前を表示する')
                         })
    }
    Arcadia.prototype.addButton = function() {
      getTitleFontElem().parentNode.appendChild(this.newButton())
    }
    return Arcadia
  })()

  var Hameln = (function() {
    function isEpisodeListPage() {
      return Boolean(document.querySelector('#maind > .ss > table'))
    }
    var titleSelector = '#maind .ss > span[style="font-size:120%"]'
    function getAuthor() {
      var e = document.querySelector('#maind .ss > p')
      if (!e) return null
      for (var n = e.firstChild; n; n = n.nextSibling) {
        if (n.nodeType === Node.TEXT_NODE && n.nodeValue.indexOf('作：') >= 0) {
          break
        }
      }
      if (!n) return null
      if (n.nextSibling && n.nextSibling.tagName === 'A') {
        return Line.newByStr(n.nextSibling.textContent)
      }
      var r = /作：(.+)/.exec(n.nodeValue)
      return Line.newByStr(r ? r[1] : '')
    }
    var novelTitleAnchorSelector = '#maind .ss > p > span > a'

    function Hameln() {}
    Hameln.prototype = Object.create(Site.prototype)
    Hameln.prototype.is = function(location) {
      return location.hostname === 'syosetu.org'
          && /^\/novel\/\d+\/(\d+\.html)?/.test(location.pathname)
          && !isEpisodeListPage()
    }
    Hameln.prototype.parse = function() {
      var navSelector = '#nextpage a'
      return new Episode({ novelTitle: getLine(novelTitleAnchorSelector)
                         , author: getAuthor()
                         , title: getLine(titleSelector)
                         , text: getLines('#honbun')
                         , preface: getLines('#maegaki')
                         , postscript: getLines('#atogaki')
                         , nextURL: getHRef(navSelector, '次の話 >>')
                         , prevURL: getHRef(navSelector, '<< 前の話')
                         , position: getLine('#maind div[style="text-align:right;font-size:80%"]')
                         })
    }
    Hameln.prototype.addButton = function() {
      var a = document.querySelector(novelTitleAnchorSelector)
      var e = a.parentNode
      e.parentNode.insertBefore(this.newButton(), e.nextSibling)
    }
    return Hameln
  })()

  var Pixiv = (function() {
    var titleSelector = '.work-info .title'
    function getTitle() {
      var e = document.querySelector(titleSelector)
      return e && e.firstChild ? Line.parse([e.firstChild]) : null
    }
    function newBR() { return document.createElement('br') }
    function isNovelTextParsed() {
      return !Boolean(document.querySelector('#novel_text'))
    }
    function getTextLinesByNovelArticles() {
      var nodes = document.querySelectorAll('.novel-page')
      var children = []
      Array.prototype.forEach.call(nodes, function(node) {
        Array.prototype.push.apply(children, node.childNodes)
        children.push(newBR(), newBR())
      })
      return Lines.parse(children)
    }
    function getTextLinesByPlainText() {
      var text = document.querySelector('#novel_text')
        , lines = []
      text.value.split('\n').forEach(function(line) {
        var r = null
        if (/^\s*\[newpage\]\s*$/.test(line)) {
          lines.push(Line.EMPTY)
        } else if (r = /^\s*\[chapter:(.+?)\]\s*$/.exec(line)) {
          lines.push(Line.EMPTY)
          lines.push(Line.newByStr(r[1]))
          lines.push(Line.EMPTY)
        } else if (r = /^\s*\[pixivimage:(\d+)(\-\d+)?\]\s*$/.exec(line)) {
          var a = document.createElement('a')
          if (r[2]) {
            a.href = '/member_illust.php?mode=manga_big&illust_id=' + r[1]
              + '&page=' + (Math.floor(r[2].slice(1)) - 1)
          } else {
            a.href = '/member_illust.php?mode=medium&illust_id=' + r[1]
          }
          lines.push(Line.parse([a]))
        } else {
          lines.push(Line.newByStr(line))
        }
      })
      return Lines.trim(lines)
    }
    function getTextLines() {
      if (isNovelTextParsed()) return getTextLinesByNovelArticles()
      return getTextLinesByPlainText()
    }
    function getCoverLinkClickHandler() {
      var a = document.querySelector('.area_inside > a')
      if (!a) return null
      var img = a.querySelector('img')
      if (!(img && img.src)) return ''
      return /^https?:\/\/source\.pixiv\.net/.test(img.src)
           ? null
           : a.click.bind(a)
    }

    function Pixiv() {}
    Pixiv.prototype = Object.create(Site.prototype)
    Pixiv.prototype.is = function(location) {
      return location.hostname === 'www.pixiv.net'
          && location.pathname === '/novel/show.php'
          && hasParam(location, 'id', /\d+/)
    }
    Pixiv.prototype.parse = function() {
      return new Episode({ title: getTitle()
                         , author: getLine('.user-name')
                         , text: getTextLines()
                         , nextURL: getHRef('.before a')
                         , prevURL: getHRef('.after a')
                         , preface: getLines('.work-info .caption')
                         , coverLinkClickHandler: getCoverLinkClickHandler()
                         })
    }
    Pixiv.prototype.addButton = function() {
      document.querySelector(titleSelector).appendChild(this.newButton())
    }
    return Pixiv
  })()

  var Akatsuki = (function() {
    function selector(suffix) {
      return '#contents-inner2 > div.box.story > div.box.story ' + suffix
    }
    function getH2() {
      var h2 = document.querySelector(selector('h2'))
      var s = ''
      for (var n = h2.firstChild; n !== h2.lastChild; n = n.nextSibling) {
        if (n.tagName === 'BR') s += '　'
        else s += n.textContent
      }
      return { title: Line.parse([h2.lastChild])
             , chapterTitle: s ? Line.newByStr(s.trim()) : null
             }
    }
    function href(selector) {
      var a = document.querySelector(selector)
      return a ? a.href : ''
    }
    function getNovelTitle() {
      var h1 = document.querySelector(selector('h1'))
      return Line.newByStr(h1.firstChild.textContent)
    }
    function getUnbalancedContent(nodeList) {
      if (nodeList[0].previousSibling.textContent === '前書き') {
        return { preface: Lines.parse(nodeList[0].childNodes)
               , text: Lines.parse(nodeList[1].childNodes)
               , postscript: null
               }
      }
      return { preface: null
             , text: Lines.parse(nodeList[0].childNodes)
             , postscript: Lines.parse(nodeList[1].childNodes)
             }
    }
    function getContent() {
      var nl = document.querySelectorAll(selector('.body-novel'))
      switch (nl.length) {
        case 1: return { text: Lines.parse(nl[0].childNodes)
                       , preface: null
                       , postscript: null }
        case 2: return getUnbalancedContent(nl)
        case 3: return { text: Lines.parse(nl[1].childNodes)
                       , preface: Lines.parse(nl[0].childNodes)
                       , postscript: Lines.parse(nl[2].childNodes)
                       }
        default: throw new Error(nl.length)
      }
    }

    function Akatsuki() {}
    Akatsuki.prototype = Object.create(Site.prototype)
    Akatsuki.prototype.is = function(location) {
      return location.hostname === 'www.akatsuki-novels.com'
          && /\/stories\/view\/\d+\/novel_id~\d+/.test(location.pathname)
    }
    Akatsuki.prototype.parse = function() {
      var h2 = getH2(), c = getContent()
      return new Episode({ novelTitle: getNovelTitle()
                         , chapterTitle: h2.chapterTitle
                         , title: h2.title
                         , author: getLine(selector('a[href^="/users/view/"]'))
                         , text: c.text
                         , preface: c.preface
                         , postscript: c.postscript
                         , nextURL: href(selector('.paging_for_view .next a'))
                         , prevURL: href(selector('.paging_for_view .prev a'))
                         , position: getLine(selector('div[style="width:100%;text-align:right;"]'))
                         })
    }
    Akatsuki.prototype.addButton = function() {
      document.querySelector(selector('h1')).appendChild(this.newButton())
    }
    return Akatsuki
  })()

  var Book = (function() {
    function newPageLines(lines, lineNum) {
      var result = []
      for (var i = 0, n = lines.length; i < n; i += lineNum) {
        result.push(lines.slice(i, i + lineNum))
      }
      return result
    }
    function newCoverLine(clickHandler) {
      if (clickHandler) {
        return new Line([new Link('javascript:void(0)', '︻表紙︼', clickHandler)])
      }
      return null
    }
    function joinTopPageItems(episode) {
      return [ episode.novelTitle
             , episode.chapterTitle
             , episode.title
             , episode.author
             , episode.position
             , newCoverLine(episode.coverLinkClickHandler)
             ].filter(function(line) { return line !== null })
    }

    function RangedLine(begin, pageLines) {
      this.begin = begin
      this.end = begin + pageLines.length
      this.pageLines = Object.freeze(pageLines.slice())
      Object.freeze(this)
    }
    RangedLine.prototype.contain = function(pageIndex) {
      return this.begin <= pageIndex && pageIndex < this.end
    }
    RangedLine.prototype.getLines = function(pageIndex) {
      return this.pageLines[pageIndex - this.begin]
    }

    function Book(episode) {
      this.episode = episode
      this.topLines = joinTopPageItems(episode)
      this.prefaceLines = episode.preface.length
                          ? [ Line.newByStr('まえがき')
                            , Line.EMPTY
                            ].concat(episode.preface)
                          : []
      this.textLines = episode.postscript.length === 0 && episode.nextURL
                       ? episode.text.concat([
                           Line.EMPTY,
                           new Line([this.createNextLink()]),
                         ])
                       : episode.text
      this.postscriptLines = this.createPostscriptLines()
      this.lineCharNum = GM_getLineCharNum()
      this.lineNum = GM_getLineNum()
      this.rangedLines = this.newRangedLines()
      this.pageNum = this.rangedLines[this.rangedLines.length - 1].end
      this.pageIndex = 0
      this.view = null
      Object.seal(this)
    }
    Book.prototype.createNextLink = function() {
      const clickHandler = e => {
        if (e.altKey || e.ctrlKey || e.metaKey || e.shiftKey)
          return
        e.preventDefault()
        this.loadNextEpisode()
      }
      return new Link(this.episode.nextURL, '次の話', clickHandler)
    }
    Book.prototype.createPostscriptLines = function() {
      if (this.episode.postscript.length === 0)
        return []
      const lines = [
        Line.newByStr('あとがき'),
        Line.EMPTY,
      ].concat(this.episode.postscript)
      return this.episode.nextURL
           ? lines.concat([
               Line.EMPTY,
               new Line([this.createNextLink()]),
             ])
           : lines
    }
    Book.prototype.setView = function(view) {
      this.view = view
      view.update()
    }
    Book.prototype.newRangedLine = function(begin, lines) {
      return new RangedLine(begin
                          , newPageLines(Lines.split(lines, this.lineCharNum)
                                       , this.lineNum))
    }
    Book.prototype.newRangedLines = function() {
      var top = this.newRangedLine(0, this.topLines)
      var preface = this.newRangedLine(top.end, this.prefaceLines)
      var text = this.newRangedLine(preface.end, this.textLines)
      var postscript = this.newRangedLine(text.end, this.postscriptLines)
      return [top, preface, text, postscript]
    }
    Book.prototype.update = function() {
      this.rangedLines = this.newRangedLines()
      this.pageNum = this.rangedLines[this.rangedLines.length - 1].end
      this.pageIndex = Math.min(this.pageIndex, this.pageNum - 1)
      this.view.update()
    }
    Book.prototype.setLineCharNum = function(lineCharNum) {
      var n = Math.max(lineCharNum, 1)
      if (this.lineCharNum === n) return
      this.lineCharNum = n
      this.update()
    }
    Book.prototype.setLineNum = function(lineNum) {
      var n = Math.max(lineNum, 1)
      if (this.lineNum === n) return
      this.lineNum = n
      this.update()
    }
    Book.prototype.getRangedLine = function() {
      var rls = this.rangedLines
      for (var i = 0, n = rls.length; i < n; i++) {
        var rl = rls[i]
        if (rl.contain(this.pageIndex)) return rl
      }
      throw new Error(this.pageIndex)
    }
    Book.prototype.setPageIndex = function(pageIndex) {
      var i = Math.min(Math.max(pageIndex, 0), this.pageNum - 1)
      if (this.pageIndex === i) return
      this.pageIndex = i
      this.view.update()
    }
    Book.prototype.turnPage = function() {
      this.setPageIndex(this.pageIndex + 1)
    }
    Book.prototype.returnPage = function() {
      this.setPageIndex(this.pageIndex - 1)
    }
    Book.prototype.begin = function() { this.setPageIndex(0) }
    Book.prototype.end = function() { this.setPageIndex(this.pageNum - 1) }
    Book.prototype.loadNextEpisode = function() {
      var u = this.episode.nextURL
      if (!u) return
      _setValue('auto', true)
      window.location.assign(u)
    }
    Book.prototype.loadPrevEpisode = function() {
      var u = this.episode.prevURL
      if (!u) return
      _setValue('auto', true)
      window.location.assign(u)
    }
    Book.prototype.isTop = function() { return this.pageIndex === 0 }
    Book.prototype.isLast = function() {
      return this.pageIndex === this.pageNum - 1
    }
    Book.prototype.getLines = function() {
      return this.getRangedLine().getLines(this.pageIndex)
    }
    return Book
  })()

  var Key = { ESCAPE: 27
            , SPACE: 32
            , END: 35
            , HOME: 36
            , LEFT: 37
            , UP: 38
            , RIGHT: 39
            , DOWN: 40
            , E: 69
            , H: 72
            , N: 78
            , P: 80
            , V: 86
            , SLASH: 191
            }

  function KeyMap() {
    this.entries = []
    this.keyDownListener = this.keyDowned.bind(this)
    Object.freeze(this)
  }
  KeyMap.prototype.add = function(key, action) {
    var entry = { action: action }
    if (typeof key === 'object') {
      entry.keyCode = key.keyCode
      entry.shift = key.shift
    } else {
      entry.keyCode = key
      entry.shift = false
    }
    this.entries.push(entry)
  }
  KeyMap.prototype.keyDowned = function(keyEvent) {
    if (['SELECT', 'INPUT', 'TEXTAREA'].indexOf(keyEvent.target.tagName) >= 0) return
    this.entries.filter(function(entry) {
      return !keyEvent.altKey
          && !keyEvent.ctrlKey
          && !keyEvent.metaKey
          && keyEvent.shiftKey === entry.shift
          && keyEvent.keyCode === entry.keyCode
    }).forEach(function(entry) {
      keyEvent.stopImmediatePropagation()
      entry.action()
    })
  }

  var BookView = (function() {
    function newMessageBox(doc) {
      const text = doc.createElement('div')
      text.style.padding = '8px'
      text.style.border = 'solid black thin'
      text.style.color = 'black'
      text.style.backgroundColor = 'white'
      text.textContent = '最後のページです'
      const result = doc.createElement('div')
      result.style.position = 'absolute'
      result.style.left = '0px'
      result.style.top = '0px'
      result.style.width = '100%'
      result.style.backgroundColor = GM_getBackgroundColor()
      result.style.display = 'none'
      result.style.justifyContent = 'center'
      result.appendChild(text)
      return result
    }
    function newLineBox(doc) {
      var result = (doc || document).createElement('div')
      result.style.marginTop = GM_getMarginTop()
      result.style.lineHeight = GM_getCharHeight()
      result.style.fontSize = GM_getFontSize()
      result.style.fontWeight = GM_getFontWeight()
      result.style.display = 'inline-block'
      result.style.fontFamily = GM_getFontFamily()
      return result
    }
    function newRoot(lineBox, messageBox) {
      var result = lineBox.ownerDocument.createElement('div')
      result.style.position = 'fixed'
      result.style.top = '0px'
      result.style.left = '0px'
      result.style.width = '100%'
      result.style.height = '100%'
      result.style.backgroundColor = GM_getBackgroundColor()
      result.style.color = GM_getColor()
      result.style.textAlign = 'center'
      result.appendChild(lineBox)
      result.appendChild(messageBox)
      return result
    }
    function newNumElem(doc) {
      var result = (doc || document).createElement('span')
      result.textContent = '0'
      result.style.display = 'inline-block'
      result.style.width = '3em'
      return result
    }
    function newPageIndexElem(doc) {
      var result = newNumElem(doc)
      result.style.textAlign = 'right'
      return result
    }
    function newPageNumElem(doc) {
      var result = newNumElem(doc)
      result.style.textAlign = 'left'
      return result
    }
    var newButton = (function() {
      var preventFocus = function(e) { e.target.blur() }
      return function(textContent, clickListener, title, doc) {
        var result = (doc || document).createElement('button')
        result.textContent = textContent
        result.addEventListener('click', clickListener, false)
        result.addEventListener('focus', preventFocus, false)
        if (title) result.title = title
        result.style.width = '3em'
        result.style.padding = '0px'
        return result
      }
    })()
    function setSpaceBetweenLines(lineBox, spaceBetweenLines) {
      var sp = spaceBetweenLines || GM_getSpaceBetweenLines()
      var cn = lineBox.childNodes
      for (var i = 0, n = cn.length - 1; i < n; i++) {
        cn[i].style.marginLeft = sp
      }
    }

    function BookView(book, doc) {
      this.book = book
      this.doc = doc || document

      this.lineBox = newLineBox(this.doc)
      this.messageBox = newMessageBox(this.doc)
      this.root = newRoot(this.lineBox, this.messageBox)
      this.pageIndexElem = newPageIndexElem(this.doc)
      this.pageNumElem = newPageNumElem(this.doc)
      this.turnPageButton = newButton('<'
                                    , book.turnPage.bind(book)
                                    , '次のページ'
                                    , this.doc)
      this.returnPageButton = newButton('>'
                                      , book.returnPage.bind(book)
                                      , '前のページ'
                                      , this.doc)
      this.endButton = newButton('|<'
                               , book.end.bind(book)
                               , '最後のページ'
                               , this.doc)
      this.beginButton = newButton('>|'
                                 , book.begin.bind(book)
                                 , '最初のページ'
                                 , this.doc)
      this.loadNextEpisodeButton = newButton('<<'
                                           , book.loadNextEpisode.bind(book)
                                           , '次の話'
                                           , this.doc)
      this.loadPrevEpisodeButton = newButton('>>'
                                           , book.loadPrevEpisode.bind(book)
                                           , '前の話'
                                           , this.doc)
      this.listShortcutKeysButton = newButton('?'
                                            , this.listShortcutKeys.bind(this)
                                            , 'ショートカットキー一覧'
                                            , this.doc)
      this.showConfigDialogButton = newButton('設定'
                                            , this.showConfigDialog.bind(this)
                                            , this.doc)
      this.toolbar = this.newToolbar()
      this.keyDownListener = this.newKeyDownListener()
      this.wheelListener = this.wheeled.bind(this)
      this.mouseMoveListener = this.mouseMoved.bind(this)
      this.shortcutKeyList = null
      this.configDialog = null
      this.onhide = null
      this.timeoutId = null
      Object.seal(this)
    }
    BookView.prototype.newNavigator = function() {
      var result = this.doc.createElement('span')
      result.appendChild(this.loadNextEpisodeButton)
      result.appendChild(this.endButton)
      result.appendChild(this.turnPageButton)
      result.appendChild(this.pageIndexElem)
      result.appendChild(this.doc.createTextNode('/'))
      result.appendChild(this.pageNumElem)
      result.appendChild(this.returnPageButton)
      result.appendChild(this.beginButton)
      result.appendChild(this.loadPrevEpisodeButton)
      return result
    }
    BookView.prototype.newRightBottomBox = function() {
      var result = this.doc.createElement('div')
      result.style.position = 'absolute'
      result.style.right = '0px'
      result.style.bottom = '0px'
      result.appendChild(this.listShortcutKeysButton)
      result.appendChild(this.showConfigDialogButton)
      result.appendChild(newButton('X'
                                 , this.hide.bind(this)
                                 , '閉じる'
                                 , this.doc))
      return result
    }
    BookView.prototype.newToolbar = function() {
      var result = this.doc.createElement('div')
      result.style.position = 'absolute'
      result.style.left = '0px'
      result.style.bottom = '0px'
      result.style.width = '100%'
      result.style.fontFamily = Default.GOTHIC_FONT_FAMILY
      result.style.fontSize = '16px'
      result.style.backgroundColor = GM_getBackgroundColor()
      result.style.display = GM_isToolbarVisible() ? '' : 'none'
      result.appendChild(this.newNavigator())
      result.appendChild(this.newRightBottomBox())
      this.root.appendChild(result)
      return result
    }
    BookView.prototype.escKeyDowned = function() {
      if (this.shortcutKeyList) this.shortcutKeyList.hide()
      else if (this.configDialog) this.configDialog.hide()
      else this.hide()
    }
    BookView.prototype.turnPage = function() {
      if (this.book.isLast()) {
        if (this.timeoutId)
          return
        this.messageBox.style.display = 'flex'
        this.timeoutId = setTimeout(() => {
          this.messageBox.style.display = 'none'
          this.timeoutId = null
        }, 2000)
      } else {
        this.book.turnPage()
      }
    }
    BookView.prototype.newKeyDownListener = function() {
      var b = this.book
      var km = new KeyMap()
      km.add(Key.SPACE, this.turnPage.bind(this))
      km.add(Key.LEFT, this.turnPage.bind(this))
      km.add(Key.RIGHT, b.returnPage.bind(b))
      km.add({ keyCode: Key.SPACE, shift: true }, b.returnPage.bind(b))
      km.add(Key.H, b.begin.bind(b))
      km.add(Key.HOME, b.begin.bind(b))
      km.add(Key.E, b.end.bind(b))
      km.add(Key.END, b.end.bind(b))
      km.add(Key.N, b.loadNextEpisode.bind(b))
      km.add(Key.DOWN, b.loadNextEpisode.bind(b))
      km.add(Key.P, b.loadPrevEpisode.bind(b))
      km.add(Key.UP, b.loadPrevEpisode.bind(b))
      km.add(Key.ESCAPE, this.escKeyDowned.bind(this))
      km.add(Key.V, this.escKeyDowned.bind(this))
      km.add({ keyCode: Key.SLASH, shift: true }
           , this.listShortcutKeys.bind(this))
      return km.keyDownListener
    }
    BookView.prototype.addListeners = function() {
      this.doc.addEventListener('keydown', this.keyDownListener, true)
      this.doc.addEventListener('mousemove', this.mouseMoveListener, false)
      this.doc.addEventListener('wheel', this.wheelListener, false)
    }
    BookView.prototype.removeListeners = function() {
      this.doc.removeEventListener('keydown', this.keyDownListener, true)
      this.doc.removeEventListener('mousemove', this.mouseMoveListener, false)
      this.doc.removeEventListener('wheel', this.wheelListener, false)
    }
    BookView.prototype.show = function() {
      this.doc.body.appendChild(this.root)
      this.addListeners()
    }
    BookView.prototype.hide = function() {
      this.removeListeners()
      this.root.parentNode.removeChild(this.root)
      if (this.onhide) this.onhide()
    }
    BookView.prototype.clear = function() {
      var b = this.lineBox
      while (b.hasChildNodes()) b.removeChild(b.firstChild)
    }
    BookView.prototype.padLines = function() {
      var paddingLineNum = this.book.lineNum - this.book.getLines().length
      for (var i = 0; i < paddingLineNum; i++) {
        this.lineBox.appendChild(Line.EMPTY.newNode(this.doc))
      }
    }
    BookView.prototype.writeLines = function() {
      this.book.getLines().forEach(function(line) {
        this.lineBox.appendChild(line.newNode(this.doc))
      }, this)
    }
    BookView.prototype.updateButtonDisabled = function() {
      var b = this.book
      this.loadNextEpisodeButton.disabled = !b.episode.nextURL
      this.loadPrevEpisodeButton.disabled = !b.episode.prevURL
      this.turnPageButton.disabled = b.isLast()
      this.endButton.disabled = b.isLast()
      this.returnPageButton.disabled = b.isTop()
      this.beginButton.disabled = b.isTop()
    }
    BookView.prototype.updatePageIndexAndPageNum = function() {
      this.pageIndexElem.textContent = this.book.pageIndex + 1
      this.pageNumElem.textContent = this.book.pageNum
    }
    BookView.prototype.update = function() {
      this.clear()
      this.writeLines()
      if (!this.book.isTop()) this.padLines()
      setSpaceBetweenLines(this.lineBox)
      this.updateButtonDisabled()
      this.updatePageIndexAndPageNum()
    }
    BookView.prototype.wheeled = (function() {
      function convert(e) {
        if (e.deltaY) return { down: e.deltaY > 0, up: e.deltaY < 0 }
        return e.wheelDelta
             ? { down: e.wheelDelta < 0, up: e.wheelDelta > 0 }
             : null
      }
      return function(e) {
        var wheel = convert(e)
        if (!wheel) return
        if (wheel.down) this.turnPage()
        else if (wheel.up) this.book.returnPage()
      }
    })()
    BookView.prototype.showConfigDialog = function() {
      if (this.configDialog) return
      this.showConfigDialogButton.disabled = true
      this.configDialog = new ConfigDialog(this.book, this, this.doc)
      this.configDialog.onhide = function() {
        this.configDialog = null
        this.showConfigDialogButton.disabled = false
      }.bind(this)
      this.configDialog.show(this.root)
    }
    BookView.prototype.listShortcutKeys = function() {
      if (this.shortcutKeyList) return
      this.listShortcutKeysButton.disabled = true
      this.shortcutKeyList = new ShortcutKeyList(this.doc)
      this.shortcutKeyList.onhide = function() {
        this.shortcutKeyList = null
        this.listShortcutKeysButton.disabled = false
      }.bind(this)
      this.shortcutKeyList.show(this.root)
    }
    BookView.prototype.setFontType = function(fontType) {
      this.lineBox.style.fontFamily = GM_getFontFamily(fontType)
    }
    BookView.prototype.setFontFamily = function(fontFamily) {
      this.lineBox.style.fontFamily = fontFamily
    }
    BookView.prototype.setFontSize = function(fontSize) {
      this.lineBox.style.fontSize = fontSize
    }
    BookView.prototype.setCharHeight = function(charHeight) {
      this.lineBox.style.lineHeight = charHeight
    }
    BookView.prototype.setMarginTop = function(marginTop) {
      this.lineBox.style.marginTop = marginTop
    }
    BookView.prototype.setSpaceBetweenLines = function(spaceBetweenLines) {
      setSpaceBetweenLines(this.lineBox, spaceBetweenLines)
    }
    BookView.prototype.setColor = function(color) {
      this.root.style.color = color
    }
    BookView.prototype.setBackgroundColor = function(backgroundColor) {
      this.root.style.backgroundColor = backgroundColor
      this.toolbar.style.backgroundColor = backgroundColor
    }
    BookView.prototype.setToolbarVisible = function(visible) {
      this.toolbar.style.display = visible ? '' : 'none'
    }
    BookView.prototype.setFontWeight = function(fontWeight) {
      this.lineBox.style.fontWeight = fontWeight
    }
    BookView.prototype.mouseMoved = (function() {
      var toolbarVisibleToggleHeight = 50
      function onToolbarVisibleArea(clientY) {
        return clientY >= window.innerHeight - toolbarVisibleToggleHeight
      }
      return function(mouseEvent) {
        if (GM_isToolbarVisible()) return
        this.toolbar.style.display = onToolbarVisibleArea(mouseEvent.clientY)
                                     ? ''
                                     : 'none'
      }
    })()
    return BookView
  })()

  function Dialog(doc) {
    this.doc = doc || document
    this.root = this.newRoot()
    this.onhide = null
  }
  Dialog.prototype.newRoot = function() {
    var result = this.doc.createElement('div')
    result.style.position = 'absolute'
    result.style.fontFamily = Default.GOTHIC_FONT_FAMILY
    result.style.fontSize = '16px'
    result.style.backgroundColor = 'white'
    result.style.color = 'black'
    result.style.padding = '0px 5px 5px'
    result.appendChild(this.newTopBar())
    return result
  }
  Dialog.prototype.newTopBar = function() {
    var result = this.doc.createElement('div')
    result.style.textAlign = 'right'
    result.appendChild(this.newCloseButton())
    return result
  }
  Dialog.prototype.newCloseButton = function() {
    var result = this.doc.createElement('button')
    result.textContent = 'X'
    result.style.width = '3em'
    result.addEventListener('click', this.hide.bind(this), false)
    return result
  }
  Dialog.prototype.center = function() {
    var v = this.doc.defaultView || document.defaultView
    var cs = v.getComputedStyle(this.root)
    var h = parseInt(cs.height, 10)
    var w = parseInt(cs.width, 10)
    this.root.style.top = (v.innerHeight - h) / 2 + 'px'
    this.root.style.left = (v.innerWidth - w) / 2 + 'px'
  }
  Dialog.prototype.show = function(owner) {
    owner.appendChild(this.root)
    this.center()
  }
  Dialog.prototype.hide = function() {
    this.root.parentNode.removeChild(this.root)
    if (this.onhide) this.onhide()
  }

  var ShortcutKeyList = (function() {
    function newList(doc) {
      var result = (doc || document).createElement('table')
      result.style.textAlign = 'left'
      result.style.borderCollapse = 'collapse'
      result.style.color = 'black'
     ;[ ['←, スペース', '次のページ']
      , ['→, Shift+スペース', '前のページ']
      , ['End, e', '最後のページ']
      , ['Home, h', '最初のページ']
      , ['↓, n', '次の話']
      , ['↑, p', '前の話']
      , ['?', 'ショートカットキー一覧']
      , ['v, Esc', '閉じる']
      , ['v', '縦書き表示']
      ].forEach(function(e) {
        var row = result.insertRow(-1)
        insertCell(row, e[0])
        insertCell(row, e[1])
      })
      return result
    }

    function ShortcutKeyList(doc) {
      Dialog.call(this, doc)
      this.root.appendChild(newList(doc))
      Object.seal(this)
    }
    ShortcutKeyList.prototype = Object.create(Dialog.prototype)
    return ShortcutKeyList
  })()

  var ConfigDialog = (function() {
    function newColorCellChild(doc) {
      var colorBox = (doc || document).createElement('span')
      colorBox.innerHTML = '&nbsp;'
      colorBox.style.display = 'inline-block'
      colorBox.style.width = '1em'
      colorBox.style.height = '100%'
      colorBox.style.marginRight = '8px'
      colorBox.style.border = '1px solid'
      var result = (doc || document).createDocumentFragment()
      result.appendChild(colorBox)
      result.appendChild(newTextNode(''))
      return result
    }
    function setColorCell(cell, color) {
      cell.firstChild.style.backgroundColor = color
      cell.lastChild.nodeValue = color
    }
    function newRadio(value, clickListener, doc) {
      var result = (doc || document).createElement('input')
      result.type = 'radio'
      result.name = 'font-type'
      result.value = value
      result.addEventListener('click', clickListener, false)
      return result
    }
    function newLabel(inputElem, text, doc) {
      var result = (doc || document).createElement('label')
      result.appendChild(inputElem)
      result.appendChild(newTextNode(text))
      return result
    }
    function newButton(clickListener, textContent, doc) {
      var result = (doc || document).createElement('button')
      result.textContent = textContent || '変更'
      result.style.padding = '0px 6px'
      result.addEventListener('click', clickListener, false)
      return result
    }
    function newCheckbox(clickListener, doc) {
      var result = (doc || document).createElement('input')
      result.type = 'checkbox'
      result.addEventListener('click', clickListener, false)
      return result
    }
    var promptUntilValid = (function() {
      function isValidCssPropertyValue(propertyName, propertyValue) {
        var e = document.createElement('span')
        e.style.setProperty(propertyName, propertyValue, null)
        return Boolean(e.style.getPropertyValue(propertyName))
      }
      function errorMessage(propertyName) {
        return 'CSS '
             + propertyName
             + ' プロパティに有効な値を入力して下さい\n'
      }
      return function(propertyName, message, initValue) {
        var r = null
        do {
          r = window.prompt((r ? errorMessage(propertyName) : '') + message
                          , r ? r : initValue)
          if (!r) return ''
        } while (!isValidCssPropertyValue(propertyName, r))
        return r
      }
    })()
    function promptInteger(message, initValue) {
      var r = parseInt(window.prompt(message, initValue), 10)
      return isNaN(r) ? null : r
    }
    function newDiv(doc) {
      var result = (doc || document).createElement('div')
      result.style.textAlign = 'left'
      result.style.marginTop = '5px'
      return result
    }
    function newOption(text, doc) {
      var result = (doc || document).createElement('option')
      result.text = text
      return result
    }

    function ConfigDialog(book, bookView, doc) {
      Dialog.call(this, doc)
      this.book = book
      this.bookView = bookView
      this.gothicRadio = newRadio('gothic'
                                , this.fontTypeRadioClicked.bind(this)
                                , this.doc)
      this.minchoRadio = newRadio('mincho'
                                , this.fontTypeRadioClicked.bind(this)
                                , this.doc)
      this.fontWeightSelect = this.newFontWeightSelect()
      this.toolbarVisibleCheckbox = this.newToolbarVisibleCheckbox()
      this.autoVerticalWritingCheckbox = this.newAutoVerticalWritingCheckbox()
      this.root.appendChild(this.newConfigTable())
      this.root.appendChild(this.newToolbarVisibleDiv())
      this.root.appendChild(this.newAutoVerticalWritingDiv())
      this.root.appendChild(this.newConfigClearDiv())
      this.setConfigValues()
      Object.seal(this)
    }
    ConfigDialog.prototype = Object.create(Dialog.prototype)
    ConfigDialog.prototype.newToolbarVisibleCheckbox = function() {
      var clickListener = function(e) {
        this.bookView.setToolbarVisible(e.target.checked)
        _setValue('toolbarVisible', e.target.checked)
      }.bind(this)
      return newCheckbox(clickListener, this.doc)
    }
    ConfigDialog.prototype.newAutoVerticalWritingCheckbox = function() {
      var clickListener = function(e) {
        _setValue('autoVerticalWriting', e.target.checked)
      }
      return newCheckbox(clickListener, this.doc)
    }
    ConfigDialog.prototype.newToolbarVisibleDiv = function() {
      var result = newDiv()
      result.appendChild(newLabel(this.toolbarVisibleCheckbox
                                , 'ツールバーを常に表示する'
                                , this.doc))
      return result
    }
    ConfigDialog.prototype.newAutoVerticalWritingDiv = function() {
      var result = newDiv()
      result.appendChild(newLabel(this.autoVerticalWritingCheckbox
                                , '自動で縦書き表示にする'
                                , this.doc))
      return result
    }
    ConfigDialog.prototype.newFontWeightSelect = function() {
      var result = this.doc.createElement('select')
      result.appendChild(newOption('normal', this.doc))
      result.appendChild(newOption('bold', this.doc))
      for (var i = 1; i <= 9; i++) {
        result.appendChild(newOption(i + '00', this.doc))
      }
      result.value = GM_getFontWeight()
      result.addEventListener('change'
                            , this.fontWeightSelectChanged.bind(this))
      return result
    }
    ConfigDialog.prototype.fontWeightSelectChanged = function() {
      var v = this.fontWeightSelect.value
      _setValue('fontWeight', v)
      this.bookView.setFontWeight(v)
      pixelCharSize.clearCache()
      this.book.update()
    }
    ConfigDialog.prototype.insertFontRows = function(table) {
      var gothicRow = table.insertRow(-1)
      insertCell(gothicRow, 'フォント').rowSpan = 2
      insertCell(gothicRow, newLabel(this.gothicRadio, 'ゴシック', this.doc))
      insertCell(gothicRow
               , newButton(this.gothicFontEditButtonClicked.bind(this)
                         , null
                         , this.doc))
      var minchoRow = table.insertRow(-1)
      insertCell(minchoRow, newLabel(this.minchoRadio, '明朝', this.doc))
      insertCell(minchoRow
               , newButton(this.minchoFontEditButtonClicked.bind(this)
                         , null
                         , this.doc))
    }
    ConfigDialog.prototype.insertRow = function(table
                                              , configName
                                              , configValueCellName
                                              , clickListener
                                              , valueCellChild) {
      var row = table.insertRow(-1)
      insertCell(row, configName)
      this[configValueCellName] = insertCell(row, valueCellChild)
      insertCell(row, newButton(clickListener, null, this.doc))
    }
    ConfigDialog.prototype.insertFontWeightRow = function(table) {
      var row = table.insertRow(-1)
      insertCell(row, '文字の太さ')
      var c = insertCell(row, this.fontWeightSelect)
      c.colSpan = 2
    }
    ConfigDialog.prototype.newConfigTable = function() {
      var result = this.doc.createElement('table')
      result.style.textAlign = 'left'
      result.style.borderCollapse = 'collapse'
      result.style.color = 'black'
      this.insertFontRows(result)
      this.insertRow(result
                   , 'フォントサイズ'
                   , 'fontSizeCell'
                   , this.fontSizeEditButtonClicked.bind(this))
      this.insertRow(result
                   , '文字の高さ'
                   , 'charHeightCell'
                   , this.charHeightEditButtonClicked.bind(this))
      this.insertFontWeightRow(result)
      this.insertRow(result
                   , '行数'
                   , 'lineNumCell'
                   , this.lineNumEditButtonClicked.bind(this))
      this.insertRow(result
                   , '一行の文字数'
                   , 'lineCharNumCell'
                   , this.lineCharNumEditButtonClicked.bind(this))
      this.insertRow(result
                   , '上余白'
                   , 'marginTopCell'
                   , this.marginTopEditButtonClicked.bind(this))
      this.insertRow(result
                   , '行間'
                   , 'spaceBetweenLinesCell'
                   , this.spaceBetweenLinesEditButtonClicked.bind(this))
      this.insertRow(result
                   , '文字色'
                   , 'colorCell'
                   , this.colorEditButtonClicked.bind(this)
                   , newColorCellChild())
      this.insertRow(result
                   , '背景色'
                   , 'backgroundColorCell'
                   , this.backgroundColorEditButtonClicked.bind(this)
                   , newColorCellChild())
      return result
    }
    ConfigDialog.prototype.newConfigClearDiv = function() {
      var result = newDiv()
      result.appendChild(newButton(this.clearConfigButtonClicked.bind(this)
                                 , '初期設定に戻す'
                                 , this.doc))
      return result
    }
    ConfigDialog.prototype.setConfigValues = function() {
      this.gothicRadio.checked = GM_getFontType() === 'gothic'
      this.minchoRadio.checked = GM_getFontType() === 'mincho'
      this.fontSizeCell.textContent = GM_getFontSize()
      this.charHeightCell.textContent = GM_getCharHeight()
      this.lineNumCell.textContent = GM_getLineNum()
      this.lineCharNumCell.textContent = GM_getLineCharNum()
      this.marginTopCell.textContent = GM_getMarginTop()
      this.spaceBetweenLinesCell.textContent = GM_getSpaceBetweenLines()
      setColorCell(this.colorCell, GM_getColor())
      setColorCell(this.backgroundColorCell, GM_getBackgroundColor())
      this.toolbarVisibleCheckbox.checked = GM_isToolbarVisible()
      this.autoVerticalWritingCheckbox.checked = GM_isAutoVerticalWriting()
      this.fontWeightSelect.value = GM_getFontWeight()
    }
    ConfigDialog.prototype.notifyConfigCleared = function() {
      this.book.setLineNum(GM_getLineNum())
      this.book.setLineCharNum(GM_getLineCharNum())
      this.bookView.setFontType(GM_getFontType())
      this.bookView.setFontSize(GM_getFontSize())
      this.bookView.setCharHeight(GM_getCharHeight())
      this.bookView.setMarginTop(GM_getMarginTop())
      this.bookView.setSpaceBetweenLines(GM_getSpaceBetweenLines())
      this.bookView.setColor(GM_getColor())
      this.bookView.setBackgroundColor(GM_getBackgroundColor())
      this.bookView.setToolbarVisible(GM_isToolbarVisible())
      this.bookView.setFontWeight(GM_getFontWeight())
    }
    ConfigDialog.prototype.clearConfigButtonClicked = function() {
      GM_clear()
      this.setConfigValues()
      this.notifyConfigCleared()
      pixelCharSize.clearCache()
      this.book.update()
    }
    ConfigDialog.prototype.fontTypeRadioClicked = function() {
     ;[this.gothicRadio, this.minchoRadio].forEach(function(e) {
        if (!e.checked) return
        this.bookView.setFontType(e.value)
        _setValue('fontType', e.value)
        pixelCharSize.clearCache()
        this.book.update()
      }, this)
    }
    ConfigDialog.prototype.gothicFontEditButtonClicked = function() {
      var r = promptUntilValid('font-family'
                             , 'ゴシックフォント'
                             , GM_getGothicFontFamily())
      if (!r) return
      _setValue('gothicFontFamily', r)
      if (GM_getFontType() !== 'gothic') return
      this.bookView.setFontFamily(r)
      pixelCharSize.clearCache()
      this.book.update()
    }
    ConfigDialog.prototype.minchoFontEditButtonClicked = function() {
      var r = promptUntilValid('font-family'
                             , '明朝フォント'
                             , GM_getMinchoFontFamily())
      if (!r) return
      _setValue('minchoFontFamily', r)
      if (GM_getFontType() !== 'mincho') return
      this.bookView.setFontFamily(r)
      pixelCharSize.clearCache()
      this.book.update()
    }
    ConfigDialog.prototype.fontSizeEditButtonClicked = function() {
      var r = promptUntilValid('font-size', 'フォントサイズ', GM_getFontSize())
      if (!r) return
      this.bookView.setFontSize(r)
      this.fontSizeCell.textContent = r
      _setValue('fontSize', r)
      pixelCharSize.clearCache()
      this.book.update()
    }
    ConfigDialog.prototype.charHeightEditButtonClicked = function() {
      var r = promptUntilValid('line-height', '文字の高さ', GM_getCharHeight())
      if (!r) return
      this.bookView.setCharHeight(r)
      this.charHeightCell.textContent = r
      _setValue('charHeight', r)
      pixelCharSize.clearCache()
      this.book.update()
    }
    ConfigDialog.prototype.lineNumEditButtonClicked = function() {
      var r = promptInteger('行数', GM_getLineNum())
      if (r === null) return
      this.book.setLineNum(r)
      this.lineNumCell.textContent = this.book.lineNum
      _setValue('lineNum', this.book.lineNum)
    }
    ConfigDialog.prototype.lineCharNumEditButtonClicked = function() {
      var r = promptInteger('一行の文字数', GM_getLineCharNum())
      if (r === null) return
      this.book.setLineCharNum(r)
      this.lineCharNumCell.textContent = this.book.lineCharNum
      _setValue('lineCharNum', this.book.lineCharNum)
    }
    ConfigDialog.prototype.marginTopEditButtonClicked = function() {
      var r = promptUntilValid('margin-top', '上余白', GM_getMarginTop())
      if (!r) return
      this.bookView.setMarginTop(r)
      this.marginTopCell.textContent = r
      _setValue('marginTop', r)
    }
    ConfigDialog.prototype.spaceBetweenLinesEditButtonClicked = function() {
      var r = promptUntilValid('margin-left'
                             , '行間'
                             , GM_getSpaceBetweenLines())
      if (!r) return
      this.bookView.setSpaceBetweenLines(r)
      this.spaceBetweenLinesCell.textContent = r
      _setValue('spaceBetweenLines', r)
    }
    ConfigDialog.prototype.colorEditButtonClicked = function() {
      var r = promptUntilValid('color', '文字色', GM_getColor())
      if (!r) return
      this.bookView.setColor(r)
      setColorCell(this.colorCell, r)
      _setValue('color', r)
    }
    ConfigDialog.prototype.backgroundColorEditButtonClicked = function() {
      var r = promptUntilValid('background-color'
                             , '背景色'
                             , GM_getBackgroundColor())
      if (!r) return
      this.bookView.setBackgroundColor(r)
      setColorCell(this.backgroundColorCell, r)
      _setValue('backgroundColor', r)
    }
    return ConfigDialog
  })()

  function createWindowKeydownListener(site) {
    var result = new KeyMap()
    result.add(Key.V, function() {
      if (!site.bookViewShown) site.showBookView()
    })
    return result.keyDowned.bind(result)
  }
  async function main() {
    await GM_sync()
   ;[ new Narou()
    , new Arcadia()
    , new Hameln()
    , new Pixiv()
    , new Akatsuki()
    ].forEach(function(site) {
      if (!site.is(window.location)) return
      site.addButton()
      window.addEventListener('keydown', createWindowKeydownListener(site), true)
      if (!(GM_isAutoVerticalWriting() || _getValue('auto', false))) return
      _setValue('auto', false)
      site.showBookView()
    })
  }

  main()
})()