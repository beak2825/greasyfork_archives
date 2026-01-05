// ==UserScript==
// @name        Focus Navigator
// @namespace   https://greasyfork.org/users/1009-kengo321
// @description タブキーによるフォーカス移動の対象と順番をCSSセレクタで設定できるようにする
// @match       *://*/*
// @version     5
// @grant       GM_getValue
// @grant       GM_setValue
// @grant       GM_registerMenuCommand
// @grant       GM_setClipboard
// @grant       GM.getValue
// @grant       GM.setValue
// @grant       GM.setClipboard
// @license     MIT License
// @noframes
// @run-at      document-start
// @downloadURL https://update.greasyfork.org/scripts/8736/Focus%20Navigator.user.js
// @updateURL https://update.greasyfork.org/scripts/8736/Focus%20Navigator.meta.js
// ==/UserScript==

;(function() {
  'use strict'

  const [gmGetValue, gmSetValue, gmSetClipboard] =
    typeof GM_getValue === 'undefined'
    ? [GM.getValue, GM.setValue, GM.setClipboard]
    : [GM_getValue, GM_setValue, GM_setClipboard]

  var Config = (function() {

    var byId = function(id) {
      return function() { return this._doc.getElementById(id) }
    }
    var addOption = function(selectElem) {
      return function(optionText) {
        var o = selectElem.ownerDocument.createElement('option')
        o.textContent = optionText
        selectElem.appendChild(o)
      }
    }
    var isValidSelector = function(selector) {
      try {
        document.querySelector(selector)
        return true
      } catch (e) {
        return false
      }
    }
    var matchForward = function(s1, s2) {
      return s1.indexOf(s2) === 0
    }
    var comparator = function(url) {
      return function(o1, o2) {
        var matched1 = matchForward(url, o1.url)
        var matched2 = matchForward(url, o2.url)
        if (matched1 && !matched2) return -1
        if (!matched1 && matched2) return 1
        if (o1.url < o2.url) return -1
        if (o1.url > o2.url) return 1
        return 0
      }
    }
    var maxZIndex = function() {
      return '2147483647'
    }
    var maxFrameWidth = function() {
      return 600
    }
    var selectedIndices = function(selectElem) {
      return [].map.call(selectElem.selectedOptions, function(o) {
        return o.index
      })
    }
    var removeAt = function(array, indices) {
      return array.filter(function(e, i) { return indices.indexOf(i) === -1 })
    }
    var removeSelectedOptions = function(selectElem) {
      ;[].slice.call(selectElem.selectedOptions).forEach(function(o) {
        o.parentNode.removeChild(o)
      })
    }
    var moveSelectedSelector = function(op) {
      return function() {
        var l = this._selectorList()
        var i = l.selectedIndex
        var t = l.options[i].textContent
        l.options[i].textContent = l.options[op(i)].textContent
        l.options[op(i)].textContent = t
        l.selectedIndex = op(i)
        var d = this._data[this._urlList().selectedIndex]
        var s = d.selectors[i]
        d.selectors[i] = d.selectors[op(i)]
        d.selectors[op(i)] = s
      }
    }

    var Config = function(doc) {
      this._doc = doc
      this._data = Config.focusSelectors().sort(comparator(this._topUrl()))
      this._updateUrlList()
      this._styleMatchedUrl()
      this._addAllCallbacks()
      this._urlList().focus()
    }
    Config.prototype._urlList = byId('url-list')
    Config.prototype._urlEditButton = byId('url-edit-button')
    Config.prototype._urlRemoveButton = byId('url-remove-button')
    Config.prototype._selectorList = byId('selector-list')
    Config.prototype._selectorAddButton = byId('selector-add-button')
    Config.prototype._selectorEditButton = byId('selector-edit-button')
    Config.prototype._selectorRemoveButton = byId('selector-remove-button')
    Config.prototype._selectorUpButton = byId('selector-up-button')
    Config.prototype._selectorDownButton = byId('selector-down-button')
    Config.prototype._scrollPositionFieldSet = byId('scroll-position-fieldset')
    Config.prototype._coordinateCheckbox = byId('coordinate-checkbox')
    Config.prototype._lowerSpaceInput = byId('lower-space-input')
    Config.prototype._upperSpaceInput = byId('upper-space-input')
    Config.prototype._customCssTextArea = byId('custom-css-textarea')
    Config.prototype._frame = function() {
      return this._doc.defaultView.frameElement
    }
    Config.prototype._topUrl = function() {
      return this._frame().ownerDocument.location.href
    }
    Config.prototype._updateUrlList = function() {
      this._urlList().length = 0
      this._data.map(function(s) { return s.url })
        .forEach(addOption(this._urlList()))
    }
    Config.prototype._styleMatchedUrl = function() {
      var url = this._topUrl()
      this._data.map(function(d) {
        return matchForward(url, d.url)
      }).forEach(function(matched, i) {
        this._urlList().options[i]
          .classList[matched ? 'add' : 'remove']('matched')
      }, this)
    }
    Config.prototype._setComputedHeight = function(elem) {
      elem.style.height = this._doc.defaultView.getComputedStyle(elem).height
    }
    Config.prototype._addCallbacks = function(id, type, callbacks) {
      var target = this._doc.getElementById(id)
      callbacks.forEach(function(callback) {
        target.addEventListener(type, callback)
      })
    }
    Config.prototype._addAllCallbacks = function() {
      ;[['url-list', 'change', [
          this.updateValueBySelectedUrl.bind(this),
          this.updateDisabled.bind(this)
        ]],
        ['selector-list', 'change', [this.updateDisabled.bind(this)]],
        ['url-add-button', 'click', [
          this.addUrl.bind(this),
          this.updateValueBySelectedUrl.bind(this),
          this.updateDisabled.bind(this),
        ]],
        ['url-edit-button', 'click', [this.editUrl.bind(this)]],
        ['url-remove-button', 'click', [
          this.removeSelectedUrls.bind(this),
          this.updateValueBySelectedUrl.bind(this),
          this.updateDisabled.bind(this),
        ]],
        ['selector-add-button', 'click', [
          this.addSelector.bind(this),
          this.updateDisabled.bind(this),
        ]],
        ['selector-edit-button', 'click', [
          this.editSelector.bind(this),
        ]],
        ['selector-remove-button', 'click', [
          this.removeSelectedSelectors.bind(this),
          this.updateDisabled.bind(this),
        ]],
        ['selector-up-button', 'click', [
          this.upSelectedSelector.bind(this),
          this.updateDisabled.bind(this),
        ]],
        ['selector-down-button', 'click', [
          this.downSelectedSelector.bind(this),
          this.updateDisabled.bind(this),
        ]],
        ['coordinate-checkbox', 'change', [
          this.coordinateCheckboxChanged.bind(this),
        ]],
        ['lower-space-input', 'input', [
          this.lowerSpaceInputChanged.bind(this),
        ]],
        ['upper-space-input', 'input', [
          this.upperSpaceInputChanged.bind(this),
        ]],
        ['custom-css-textarea', 'input', [
          this.cssTextAreaChanged.bind(this),
        ]],
        ['import-export-checkbox', 'change', [
          this.impExpCheckboxChanged.bind(this),
        ]],
        ['export-button', 'click', [this.export.bind(this)]],
        ['import-button', 'click', [
          this.import.bind(this),
          this.updateValueBySelectedUrl.bind(this),
          this.updateDisabled.bind(this),
        ]],
        ['ok-button', 'click', [
          this.save.bind(this),
          FocusSelector.update.bind(null, this._frame().ownerDocument),
          this.removeFrameFromParent.bind(this),
        ]],
        ['cancel-button', 'click', [this.removeFrameFromParent.bind(this)]],
      ].forEach(this._addCallbacks.apply.bind(this._addCallbacks, this))
    }
    Config.prototype._updateSelectorList = function() {
      this._selectorList().length = 0
      if (this._urlList().selectedOptions.length !== 1) return
      var i = this._urlList().selectedIndex
      ;(this._data[i].selectors || []).forEach(addOption(this._selectorList()))
    }
    Config.prototype._updateScrollPositionElements = function() {
      if (this._urlList().selectedOptions.length === 1) {
        var d = this._data[this._urlList().selectedIndex]
        this._coordinateCheckbox().checked = d.coordinated
        this._lowerSpaceInput().value = d.lowerSpace || 0
        this._upperSpaceInput().value = d.upperSpace || 0
      } else {
        this._coordinateCheckbox().checked = false
        this._lowerSpaceInput().value = 0
        this._upperSpaceInput().value = 0
      }
    }
    Config.prototype._updateCustomCssTextArea = function() {
      if (this._urlList().selectedOptions.length === 1) {
        var d = this._data[this._urlList().selectedIndex]
        this._customCssTextArea().value = d.cssText || ''
      } else {
        this._customCssTextArea().value = ''
      }
    }
    Config.prototype.updateValueBySelectedUrl = function() {
      this._updateSelectorList()
      this._updateScrollPositionElements()
      this._updateCustomCssTextArea()
    }
    Config.prototype._updateDisabledBySelectedUrl = function() {
      var len = this._urlList().selectedOptions.length
      this._urlEditButton().disabled = len !== 1
      this._urlRemoveButton().disabled = len === 0
      this._selectorList().disabled = len !== 1
      this._selectorAddButton().disabled = len !== 1
      this._coordinateCheckbox().disabled = len !== 1
      this._scrollPositionFieldSet().disabled =
        !(len === 1 && this._coordinateCheckbox().checked)
      this._customCssTextArea().disabled = len !== 1
    }
    Config.prototype._updateDisabledBySelectedSelector = function() {
      var list = this._selectorList()
      var len = list.selectedOptions.length
      this._selectorEditButton().disabled = len !== 1
      this._selectorRemoveButton().disabled = len === 0
      var top = list.selectedIndex === 0
      this._selectorUpButton().disabled = len !== 1 || top
      var last = list.selectedIndex === list.length - 1
      this._selectorDownButton().disabled = len !== 1 || last
    }
    Config.prototype.updateDisabled = function() {
      this._updateDisabledBySelectedUrl()
      this._updateDisabledBySelectedSelector()
    }
    Config.prototype.addUrl = function() {
      var url = ''
      do {
        url = prompt(url ? '"' + url + '"は登録済みです。' : ''
                   , url || this._topUrl())
        if (url === null) return
      } while (this._data.some(function(d) { return d.url === url}))
      this._data.push({url: url})
      addOption(this._urlList())(url)
      this._urlList().selectedIndex = this._urlList().length - 1
      this._styleMatchedUrl()
    }
    Config.prototype.editUrl = function() {
      var i = this._urlList().selectedIndex
      var data  = this._data[i]
      var url = ''
      do {
        url = prompt(url ? '"' + url + '"は登録済みです。' : ''
                   , url || data.url)
        if (url === null) return
      } while (this._data.some(function(d) { return d.url === url}))
      data.url = url
      this._urlList().options[i].textContent = url
      this._styleMatchedUrl()
    }
    Config.prototype.save = function() {
      gmSetValue('focusSelectors', JSON.stringify(this._data))
      Config.focusSelectors.set(this._data)
    }
    Config.prototype.removeSelectedUrls = function() {
      this._data = removeAt(this._data, selectedIndices(this._urlList()))
      removeSelectedOptions(this._urlList())
    }
    Config.prototype.addSelector = function() {
      var selector = ''
      do {
        selector = prompt(selector ? '構文エラー' : '', selector)
        if (selector === null) return
      } while (!isValidSelector(selector))
      addOption(this._selectorList())(selector)
      var d = this._data[this._urlList().selectedIndex]
      d.selectors = (d.selectors || []).concat(selector)
      this._selectorList().selectedIndex = this._selectorList().length - 1
    }
    Config.prototype.editSelector = function() {
      var d = this._data[this._urlList().selectedIndex]
      var i = this._selectorList().selectedIndex
      var current = d.selectors[i]
      var selector = ''
      do {
        selector = prompt(selector ? '構文エラー' : '', selector || current)
        if (selector === null) return
      } while (!isValidSelector(selector))
      d.selectors[i] = selector
      this._selectorList().options[i].textContent = selector
    }
    Config.prototype.removeSelectedSelectors = function() {
      var d = this._data[this._urlList().selectedIndex]
      d.selectors = removeAt(d.selectors
                           , selectedIndices(this._selectorList()))
      removeSelectedOptions(this._selectorList())
    }
    Config.prototype.upSelectedSelector =
      moveSelectedSelector(function(v) { return v - 1 })
    Config.prototype.downSelectedSelector =
      moveSelectedSelector(function(v) { return v + 1 })
    Config.prototype.coordinateCheckboxChanged = function() {
      var checked = this._coordinateCheckbox().checked
      this._data[this._urlList().selectedIndex].coordinated = checked
      this._scrollPositionFieldSet().disabled = !checked
    }
    Config.prototype.lowerSpaceInputChanged = function() {
      if (this._lowerSpaceInput().validity.valid) {
        this._data[this._urlList().selectedIndex].lowerSpace =
          this._lowerSpaceInput().valueAsNumber
      }
    }
    Config.prototype.upperSpaceInputChanged = function() {
      if (this._upperSpaceInput().validity.valid) {
        this._data[this._urlList().selectedIndex].upperSpace =
          this._upperSpaceInput().valueAsNumber
      }
    }
    Config.prototype.cssTextAreaChanged = function() {
      this._data[this._urlList().selectedIndex].cssText =
        this._customCssTextArea().value.trim()
    }
    Config.prototype.removeFrameFromParent = function() {
      this._frame().parentNode.removeChild(this._frame())
      var b = this.background
      if (b && b.parentNode) b.parentNode.removeChild(b)
    }
    Config.prototype.impExpCheckboxChanged = function() {
      var checkbox = this._doc.getElementById('import-export-checkbox')
      var container = this._doc.getElementById('import-export-container')
      container.classList[checkbox.checked ? 'add' : 'remove']('show')
    }
    Config.prototype.export = function() {
      gmSetClipboard(JSON.stringify(this._data))
    }
    Config.prototype.import = function() {
      try {
        var ta = this._doc.getElementById('import-textarea')
        this._data = JSON.parse(ta.value)
        this._updateUrlList()
        this._styleMatchedUrl()
        ta.setCustomValidity('')
      } catch (e) {
        ta.setCustomValidity(e.toString())
      }
    }
    Config.focusSelectors = function() {
      return Config._focusSelectors
    }
    Config.focusSelectors.set = function(focusSelectors) {
      Config._focusSelectors = focusSelectors
    }
    Config.show = function(doc) {
      var background = doc.createElement('div')
      background.style.backgroundColor = 'black'
      background.style.opacity = '0.5'
      background.style.zIndex = maxZIndex() - 1
      background.style.position = 'fixed'
      background.style.top = '0'
      background.style.left = '0'
      background.style.width = '100%'
      background.style.height = '100%'
      doc.body.appendChild(background)
      var f = doc.createElement('iframe')
      f.style.position = 'fixed'
      f.style.top = '0'
      f.style.left = '0'
      f.style.width = '100%'
      f.style.height = '100%'
      f.style.zIndex = maxZIndex()
      f.srcdoc = Config.srcdoc
      f.addEventListener('load', async function() {
        Config.focusSelectors.set(JSON.parse(await gmGetValue('focusSelectors', '[]')))
        var config = new Config(f.contentDocument)
        config.background = background
      })
      doc.body.appendChild(f)
    }
    Config.srcdoc = [
      '<!doctype html><html><head><style>',
      '  html {',
      '    margin: 0 auto;',
      '    max-width: 50em;',
      '    height: 100%;',
      '    line-height: 1.5em;',
      '  }',
      '  body {',
      '    height: 100%;',
      '    margin: 0;',
      '    display: flex;',
      '    flex-direction: column;',
      '    justify-content: center;',
      '  }',
      '  #dialog {',
      '    overflow: auto;',
      '    padding: 8px;',
      '    background-color: white;',
      '  }',
      '  p { margin: 0; }',
      '  select { width: 100%; }',
      '  textarea { width: 100%; }',
      '  .label-p, #scroll-position-fieldset, #ok-cancel-p {',
      '    margin-top: 10px;',
      '  }',
      '  #custom-css-desc { line-height: 1.1em; }',
      '  #ok-cancel-p { text-align: right; }',
      '  #url-list .matched { text-decoration: underline; }',
      '  #import-export-container { display: none; }',
      '  #import-export-container.show { display: block; }',
      '</style></head><body><div id=dialog>',
      '<p><label for=url-list>対象ページのURL一覧(前方一致):</label></p>',
      '<p><select id=url-list size=10 multiple></select></p>',
      '<p>',
      '  <input id=url-add-button type=button value=追加>',
      '  <input id=url-edit-button type=button value=編集 disabled>',
      '  <input id=url-remove-button type=button value=削除 disabled>',
      '</p>',
      '<p><small>',
      '  複数一致するときは、一番長いURLの設定を使用します。',
      '</small></p>',
      '<p class=label-p><label for=selector-list>',
      '  フォーカス対象と移動順のCSSセレクタ一覧:',
      '</label></p>',
      '<p><select id=selector-list size=5 multiple disabled></select></p>',
      '<p>',
      '  <input id=selector-add-button type=button value=追加 disabled>',
      '  <input id=selector-edit-button type=button value=編集 disabled>',
      '  <input id=selector-remove-button type=button value=削除 disabled>',
      '  <input id=selector-up-button type=button value=上へ disabled>',
      '  <input id=selector-down-button type=button value=下へ disabled>',
      '</p>',
      '<fieldset id=scroll-position-fieldset disabled>',
      '  <legend><label>',
      '    <input id=coordinate-checkbox type=checkbox disabled>',
      '    スクロールの位置を調整する',
      '  </label></legend>',
      '  <p><label>',
      '    表示領域の上とフォーカスとの最小間隔:',
      '    <input id=upper-space-input type=number value=0 required>',
      '  </label></p>',
      '  <p><label>',
      '    表示領域の下とフォーカスとの最小間隔:',
      '    <input id=lower-space-input type=number value=0 required>',
      '  </label></p>',
      '</fieldset>',
      '<p class=label-p>',
      '  <label for=custom-css-textarea>カスタムCSS:</label>',
      '</p>',
      '<p><textarea id=custom-css-textarea rows=3 disabled></textarea></p>',
      '<p id=custom-css-desc><small>',
      '  この入力欄の内容を持つstyle要素をhead要素の末尾に追加します。何も入力していないときは追加しません。フォーカスのアウトラインが非表示のときに利用してください。',
      '</small></p>',
      '<p class=label-p>',
      '  インポート・エクスポート:',
      '  <small>',
      '    <label><input id=import-export-checkbox type=checkbox>表示</label>',
      '  </small>',
      '</p>',
      '<div id=import-export-container>',
      '  <p><textarea id=import-textarea rows=2></textarea></p>',
      '  <p><input id=import-button type=button value=インポート></p>',
      '  <p><input id=export-button type=button',
      '    value=クリップボードへエクスポート></p>',
      '</div>',
      '<p id=ok-cancel-p>',
      '  <input id=ok-button type=button value=OK>',
      '  <input id=cancel-button type=button value=キャンセル>',
      '</p>',
      '</div></body></html>',
    ].join('\n')
    return Config
  })()

  var FocusSelector = (function() {

    var tabKeyCode = 9
    var isTabKey = function(e) {
      return e.which === tabKeyCode && !(e.ctrlKey || e.metaKey || e.altKey)
    }
    var ring = function(array, start, reverse) {
      var a = array.slice(start).concat(array.slice(0, start))
      return reverse ? a.reverse() : a
    }
    var matchedFocusSelectors = function(doc) {
      return Config.focusSelectors()
        .map(FocusSelector.new)
        .filter(function(focusSelector) {
          return focusSelector._matchUrlForward(doc.location.href)
        })
    }
    var longestUrlFocusSelector = function(doc) {
      var s = matchedFocusSelectors(doc)
      if (!s.length) return
      return s.reduce(function(previous, current) {
        return previous._hasLongerUrl(current) ? previous : current
      })
    }
    var focusNext = function(requestFocus) {
      return function(keyDownEvent) {
        if (!isTabKey(keyDownEvent)) return

        var d = keyDownEvent.target.ownerDocument
        var focusSelector = longestUrlFocusSelector(d)
        if (!focusSelector) return
        var selected = focusSelector._querySelectors(d)
        if (!selected.length) return

        var i = selected.indexOf(d.activeElement)
        var start = keyDownEvent.shiftKey ? Math.max(i, 0)
                                          : (i + 1) % selected.length
        var r = ring(selected, start, keyDownEvent.shiftKey)
        requestFocus(keyDownEvent
                   , r.some.bind(r, focusSelector._focus.bind(focusSelector)))
      }
    }

    var FocusSelector = function(o) {
      this._url = o.url
      this._selectors = o.selectors || []
      this._coordinated = Boolean(o.coordinated)
      this._lowerSpace = o.lowerSpace || 0
      this._upperSpace = o.upperSpace || 0
      this._cssText = o.cssText
    }
    FocusSelector.prototype._matchUrlForward = function(url) {
      return url.indexOf(this._url) === 0
    }
    FocusSelector.prototype._hasLongerUrl = function(other) {
      return this._url.length >= other._url.length
    }
    FocusSelector.prototype._querySelectors = function(doc) {
      return this._selectors.reduce(function(selected, selector) {
        return selected.concat.apply(selected, doc.querySelectorAll(selector))
      }, [])
    }
    FocusSelector.prototype._focus = function(elem) {
      var preFocus = elem.getBoundingClientRect()
      elem.focus()
      var result = elem.ownerDocument.activeElement === elem
      if (result && this._coordinated) {
        this._coordinateScroll(elem, preFocus)
      }
      return result
    }
    FocusSelector.prototype._coordinateScroll = function(elem, preFocus) {
      var win = elem.ownerDocument.defaultView
      var postFocus = elem.getBoundingClientRect()
      if (preFocus.bottom > win.innerHeight - this._lowerSpace) {
        var y = win.innerHeight - postFocus.bottom - this._lowerSpace
        win.scrollBy(0, -y)
      } else if (preFocus.top < this._upperSpace) {
        win.scrollBy(0, postFocus.top - this._upperSpace)
      }
    }
    FocusSelector.prototype._hasCssText = function() {
      return Boolean(this._cssText)
    }
    FocusSelector.prototype._createStyleElem = function(doc) {
      var result = doc.createElement('style')
      result.id = 'focus-navigator-style'
      result.textContent = this._cssText
      return result
    }
    FocusSelector.new = function(o) {
      return new FocusSelector(o)
    }
    FocusSelector.addCallbackIfRequired = function(doc) {
      if (matchedFocusSelectors(doc).length) {
        doc.addEventListener('keydown', FocusSelector.firstCallback)
      }
    }
    // Firefox36.0 + Greasemonkey2.3
    // タブキーの keydown イベントをすべてキャンセルして
    // デフォルトの処理を一度も実行させなかった場合、
    // フォーカスされた要素のアウトラインが表示されない。
    // これの対策として、フォーカス処理をあとのイベントループで実行させて、
    // 最初のイベントだけキャンセルせずにデフォルトの処理をさせることで、
    // アウトラインを表示。
    FocusSelector.firstCallback = focusNext(function(event, focus) {
      setTimeout(focus, 0)
      var d = event.target.ownerDocument
      d.removeEventListener('keydown', FocusSelector.firstCallback)
      d.addEventListener('keydown', FocusSelector.callback)
    })
    FocusSelector.callback = focusNext(function(event, focus) {
      if (focus()) event.preventDefault()
    })
    FocusSelector.addStyleElemIfRequired = function(doc) {
      var s = longestUrlFocusSelector(doc)
      if (s && s._hasCssText()) {
        if (doc.head) {
          doc.head.appendChild(s._createStyleElem(doc))
        } else {
          doc.addEventListener('DOMContentLoaded', () => {
            doc.head.appendChild(s._createStyleElem(doc))
          })
        }
      }
    }
    FocusSelector.update = function(doc) {
      doc.removeEventListener('keydown', FocusSelector.firstCallback)
      doc.removeEventListener('keydown', FocusSelector.callback)
      var style = doc.getElementById('focus-navigator-style')
      if (style) style.parentNode.removeChild(style)
      FocusSelector.addCallbackIfRequired(doc)
      FocusSelector.addStyleElemIfRequired(doc)
    }
    return FocusSelector
  })()

  function addConfigButtonIfScriptPage() {
    if (!location.href.startsWith('https://greasyfork.org/ja/scripts/8736-focus-navigator'))
      return
    const add = () => {
      const e = document.createElement('button')
      e.type = 'button'
      e.textContent = '設定'
      e.addEventListener('click', Config.show.bind(Config, document))
      document.querySelector('#script-info > header > h2').appendChild(e)
    }
    if (['interactive', 'complete'].includes(document.readyState))
      add()
    else
      document.addEventListener('DOMContentLoaded', add)
  }

  async function main() {
    Config.focusSelectors.set(JSON.parse(await gmGetValue('focusSelectors', '[]')))
    FocusSelector.addCallbackIfRequired(document)
    FocusSelector.addStyleElemIfRequired(document)
    if (typeof GM_registerMenuCommand !== 'undefined') {
      GM_registerMenuCommand('Focus Navigator 設定'
                           , Config.show.bind(Config, document))
    }
    addConfigButtonIfScriptPage()
  }

  main()
})()
