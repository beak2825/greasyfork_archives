// ==UserScript==
// @name         Open In New Tab
// @namespace    https://greasyfork.org/users/1009-kengo321
// @version      8
// @description  新しいタブで開くリンクをCSSセレクタで選べるようにする
// @grant        GM_registerMenuCommand
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_openInTab
// @grant        GM_setClipboard
// @grant        GM_info
// @grant        GM.getValue
// @grant        GM.setValue
// @grant        GM.openInTab
// @grant        GM.setClipboard
// @grant        GM.info
// @match        *://*/*
// @license      MIT
// @noframes
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/5591/Open%20In%20New%20Tab.user.js
// @updateURL https://update.greasyfork.org/scripts/5591/Open%20In%20New%20Tab.meta.js
// ==/UserScript==

;(function() {
  'use strict'

  if (window.self !== window.top) return

  function getter(propName) {
    return function(o) { return o[propName] }
  }
  function not(func) {
    return function() { return !func.apply(null, arguments) }
  }
  const [gmGetValue, gmSetValue, gmOpenInTab, gmSetClipboard, gmInfo] =
    typeof GM_getValue === 'undefined'
    ? [GM.getValue, GM.setValue, GM.openInTab, GM.setClipboard, GM.info]
    : [GM_getValue, GM_setValue, GM_openInTab, GM_setClipboard, GM_info]
  async function gmGetLinkSelectors() {
    return JSON.parse(await gmGetValue('linkSelectors', '[]')).map(o => new LinkSelector(o))
  }

  var Config = (function() {

    function compareLinkSelector(o1, o2) {
      var m1 = o1.matchUrlForward(), m2 = o2.matchUrlForward()
      if (m1 && !m2) return -1
      if (!m1 && m2) return 1
      if (o1.url < o2.url) return -1
      if (o1.url > o2.url) return 1
      return 0
    }
    function setComputedHeight(win, elem) {
      elem.style.height = win.getComputedStyle(elem).height
    }
    function updateUrlOptionClass(option, linkSelector) {
      var p = linkSelector.matchUrlForward() ? 'add' : 'remove'
      option.classList[p]('matched')
      return option
    }
    function addAndSelectOption(selectElem, option) {
      selectElem.add(option)
      selectElem.selectedIndex = option.index
    }
    function getSelectedIndices(selectElem) {
      return [].map.call(selectElem.selectedOptions, getter('index'))
    }
    function removeSelectedOptions(selectElem) {
      ;[].slice.call(selectElem.selectedOptions).forEach(function(o) {
        o.parentNode.removeChild(o)
      })
    }
    function filterIndices(array, indices) {
      return array.filter(function(e, i) { return indices.indexOf(i) === -1 })
    }
    function optionAdder(selectElem, newOption) {
      return function(e) { selectElem.add(newOption(e)) }
    }
    function maxZIndex() {
      return '2147483647'
    }

    function Config(doc) {
      this.doc = doc
      this.doc.getElementById('insert-p').hidden = (gmInfo.scriptHandler === 'Greasemonkey')
      this.addCallbacks()
    }
    Config.srcdoc = [
      '<!DOCTYPE html>',
      '<html><head><style>',
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
      '  textarea { width: 100%; }',
      '  #url-list { width: 100%; }',
      '  #url-list option.matched { text-decoration: underline; }',
      '  #selector-list { width: 100%; }',
      '  #confirm-p { text-align: right; }',
      '  p.description { font-size: smaller; }',
      '  #import-export-container { display: none; }',
      '  #import-export-container.show { display: block; }',
      '</style></head><body><div id=dialog>',
      '<fieldset>',
      '  <legend>対象ページのURL(前方一致)</legend>',
      '  <p><select id=url-list multiple size=10></select></p>',
      '  <p>',
      '    <button id=url-add-button type=button>追加</button>',
      '    <button id=url-edit-button type=button disabled>編集</button>',
      '    <button id=url-remove-button type=button disabled>削除</button>',
      '  </p>',
      '</fieldset>',
      '<fieldset id=selector-fieldset disabled>',
      '  <legend>新しいタブで開くリンクのCSSセレクタ</legend>',
      '  <p class=description>',
      '    何も登録していないときは、すべてのリンクが対象になります',
      '  </p>',
      '  <p><select id=selector-list multiple size=5></select></p>',
      '  <p>',
      '    <button id=selector-add-button type=button>追加</button>',
      '    <button id=selector-edit-button type=button>編集</button>',
      '    <button id=selector-remove-button type=button>削除</button>',
      '  </p>',
      '  <p>',
      '    <label>',
      '      <input type=checkbox id=capture-checkbox>',
      '      キャプチャフェーズを使用して、イベント伝播を中断する',
      '    </label>',
      '  </p>',
      '  <p class=description>',
      '    正しく動作しないときは、これを有効にして試してください',
      '  </p>',
      '</fieldset>',
      '<p id=active-p><label>',
      '  <input id=active-checkbox type=checkbox>',
      '  新しいタブを開いたとき、すぐにそのタブに切り替える',
      '</label></p>',
      '<p id=insert-p><label>',
      '  <input id=insert-checkbox type=checkbox>',
      '  現在のタブの後ろに新しいタブを挿入する',
      '</label></p>',
      '<p>',
      '  インポート・エクスポート:',
      '  <small>',
      '    <label><input id=import-export-checkbox type=checkbox>表示</label>',
      '  </small>',
      '</p>',
      '<div id=import-export-container>',
      '  <p><textarea id=import-export-textarea rows=2></textarea></p>',
      '  <p>',
      '    <input id=import-button type=button value=インポート>',
      '    <input id=export-button type=button value=エクスポート>',
      '  </p>',
      '  <p><input id=export-to-clipboard-button type=button',
      '    value=クリップボードへエクスポート></p>',
      '</div>',
      '<p id=confirm-p>',
      '  <button id=ok-button type=button>OK</button>',
      '  <button id=cancel-button type=button>キャンセル</button>',
      '</p>',
      '</div></body></html>',
    ].join('\n')
    Config.show = function(done) {
      var background = document.createElement('div')
      background.style.backgroundColor = 'black'
      background.style.opacity = '0.5'
      background.style.zIndex = maxZIndex() - 1
      background.style.position = 'fixed'
      background.style.top = '0'
      background.style.left = '0'
      background.style.width = '100%'
      background.style.height = '100%'
      document.body.appendChild(background)
      var f = document.createElement('iframe')
      f.style.position = 'fixed'
      f.style.top = '0'
      f.style.left = '0'
      f.style.width = '100%'
      f.style.height = '100%'
      f.style.zIndex = maxZIndex()
      f.srcdoc = Config.srcdoc
      f.addEventListener('load', async function() {
        const linkSelectors = await gmGetLinkSelectors()
        Config.setLinkSelectors(linkSelectors)
        var config = new Config(f.contentDocument)
        config.linkSelectors = linkSelectors.sort(compareLinkSelector)
        config.updateUrlList()
        config.getActiveCheckbox().checked = await Config.isNewTabActivation()
        config.getInsertCheckbox().checked = await Config.isNewTabInsertion()
        config.setIFrame(f)
        config.background = background
        if (typeof(done) === 'function') done(config)
      })
      document.body.appendChild(f)
    }
    Config.getLinkSelectors = function() {
      return Config._linkSelectors
    }
    Config.setLinkSelectors = function(linkSelectors) {
      Config._linkSelectors = linkSelectors
    }
    Config.isNewTabActivation = function() {
      return gmGetValue('active', true)
    }
    Config.isNewTabInsertion = function() {
      return gmGetValue('insert', false)
    }
    Config.prototype.addCallbacks = function() {
      var doc = this.doc
      ;[['url-list', 'change', [
          this.updateSelectorList.bind(this),
          this.updateCaptureCheckbox.bind(this),
          this.updateDisabled.bind(this),
        ]],
        ['selector-list', 'change', this.updateDisabled.bind(this)],
        ['url-add-button', 'click', [
          this.addUrl.bind(this),
          this.updateDisabled.bind(this),
          this.updateSelectorList.bind(this),
          this.updateCaptureCheckbox.bind(this),
        ]],
        ['url-edit-button', 'click', this.editUrl.bind(this)],
        ['url-remove-button', 'click', [
          this.removeUrl.bind(this),
          this.updateDisabled.bind(this),
          this.updateSelectorList.bind(this),
          this.updateCaptureCheckbox.bind(this),
        ]],
        ['selector-add-button', 'click', [
          this.addSelector.bind(this),
          this.updateDisabled.bind(this),
        ]],
        ['selector-edit-button', 'click', this.editSelector.bind(this)],
        ['selector-remove-button', 'click', [
          this.removeSelector.bind(this),
          this.updateDisabled.bind(this),
        ]],
        ['capture-checkbox', 'change', this.updateCapture.bind(this)],
        ['ok-button', 'click', [
          this.save.bind(this),
          LinkSelector.updateCallback,
          this.removeIFrame.bind(this),
        ]],
        ['cancel-button', 'click', this.removeIFrame.bind(this)],
        [ 'import-export-checkbox',
          'change',
          this.importExportCheckboxChanged.bind(this),
        ],
        [ 'export-to-clipboard-button',
          'click',
          this.exportToClipboard.bind(this),
        ],
        ['import-button', 'click', [
          this.import.bind(this),
          this.updateSelectorList.bind(this),
          this.updateCaptureCheckbox.bind(this),
          this.updateDisabled.bind(this),
        ]],
        ['export-button', 'click', this.export.bind(this)],
      ].forEach(function(e) {
        ;[].concat(e[2]).forEach(function(callback) {
          doc.getElementById(e[0]).addEventListener(e[1], callback)
        })
      })
    }
    Config.prototype.getUrlList = function() {
      return this.doc.getElementById('url-list')
    }
    Config.prototype.getSelectorList = function() {
      return this.doc.getElementById('selector-list')
    }
    Config.prototype.getCaptureCheckbox = function() {
      return this.doc.getElementById('capture-checkbox')
    }
    Config.prototype.getActiveCheckbox = function() {
      return this.doc.getElementById('active-checkbox')
    }
    Config.prototype.getInsertCheckbox = function() {
      return this.doc.getElementById('insert-checkbox')
    }
    Config.prototype.getImpExpTextarea = function() {
      return this.doc.getElementById('import-export-textarea')
    }
    Config.prototype.newOption = function(text) {
      var result = this.doc.createElement('option')
      result.textContent = text
      return result
    }
    Config.prototype.newUrlOption = function(linkSelector) {
      return updateUrlOptionClass(this.newOption(linkSelector.url)
                                , linkSelector)
    }
    Config.prototype.updateUrlList = function() {
      this.getUrlList().length = 0
      this.linkSelectors.forEach(optionAdder(this.getUrlList()
                                           , this.newUrlOption.bind(this)))
    }
    Config.prototype.getSelectedLinkSelector = function() {
      return this.linkSelectors[this.getUrlList().selectedIndex]
    }
    Config.prototype.updateSelectorList = function() {
      this.clearSelectorList()
      if (this.getUrlList().selectedOptions.length !== 1) return
      this.getSelectedLinkSelector()
        .selectors
        .forEach(optionAdder(this.getSelectorList()
                           , this.newOption.bind(this)))
    }
    Config.prototype.clearSelectorList = function() {
      var s = this.getSelectorList()
      while (s.hasChildNodes()) s.removeChild(s.firstChild)
    }
    Config.prototype.addUrl = function() {
      var r = prompt('', document.location.href)
      if (!r) return
      var s = new LinkSelector({url: r})
      this.linkSelectors.push(s)
      addAndSelectOption(this.getUrlList(), this.newUrlOption(s))
    }
    Config.prototype.editUrl = function() {
      if (this.getUrlList().selectedOptions.length !== 1) return
      var r = prompt('', this.getSelectedLinkSelector().url)
      if (!r) return
      this.getUrlList().selectedOptions[0].textContent = r
      this.getSelectedLinkSelector().url = r
      updateUrlOptionClass(this.getUrlList().selectedOptions[0]
                         , this.getSelectedLinkSelector())
    }
    Config.prototype.removeUrl = function() {
      this.linkSelectors = filterIndices(this.linkSelectors
                                       , getSelectedIndices(this.getUrlList()))
      removeSelectedOptions(this.getUrlList())
    }
    Config.prototype.getErrorIfInvalidSelector = function(selector) {
      try {
        this.doc.querySelector(selector)
        return null
      } catch (e) {
        return e
      }
    }
    Config.prototype.promptUntilValidSelector = function(defaultValue) {
      var selector = defaultValue || ''
      var error = null
      do {
        selector = prompt((error || '').toString(), selector)
        if (!selector) return null
      } while (error = this.getErrorIfInvalidSelector(selector))
      return selector
    }
    Config.prototype.addSelector = function() {
      if (this.getUrlList().selectedOptions.length !== 1) return
      var r = this.promptUntilValidSelector()
      if (!r) return
      this.getSelectedLinkSelector().selectors.push(r)
      addAndSelectOption(this.getSelectorList(), this.newOption(r))
    }
    Config.prototype.getSelectedSelector = function() {
      return this.getSelectorList().selectedOptions[0].textContent
    }
    Config.prototype.setSelectedSelector = function(selector) {
      var o = this.getSelectorList().selectedOptions[0]
      o.textContent = selector
      this.getSelectedLinkSelector().selectors[o.index] = selector
    }
    Config.prototype.editSelector = function() {
      if (this.getSelectorList().selectedOptions.length !== 1) return
      var r = this.promptUntilValidSelector(this.getSelectedSelector())
      if (!r) return
      this.setSelectedSelector(r)
    }
    Config.prototype.removeSelector = function() {
      var s = this.getSelectedLinkSelector()
      s.selectors = filterIndices(s.selectors
                                , getSelectedIndices(this.getSelectorList()))
      removeSelectedOptions(this.getSelectorList())
    }
    Config.prototype.updateCaptureCheckbox = function() {
      var s = this.getSelectedLinkSelector()
      this.getCaptureCheckbox().checked = (s ? s.capture : false)
    }
    Config.prototype.updateCapture = function() {
      var s = this.getSelectedLinkSelector()
      if (s) s.capture = this.getCaptureCheckbox().checked
    }
    Config.prototype.updateDisabled = function() {
      var selectedUrlNum = this.getUrlList().selectedOptions.length
      var selectedSelectorNum = this.getSelectorList().selectedOptions.length
      ;[['url-edit-button', selectedUrlNum !== 1],
        ['url-remove-button', selectedUrlNum === 0],
        ['selector-fieldset', selectedUrlNum !== 1],
        ['selector-edit-button', selectedSelectorNum !== 1],
        ['selector-remove-button', selectedSelectorNum === 0],
      ].forEach(function(e) {
        this.doc.getElementById(e[0]).disabled = e[1]
      }, this)
    }
    Config.prototype.setIFrame = function(iframe) {
      this.iframe = iframe
      this.getUrlList().focus()
    }
    Config.prototype.removeIFrame = function() {
      var rm = function(e) {
        if (e && e.parentNode) e.parentNode.removeChild(e)
      }
      rm(this.iframe)
      rm(this.background)
    }
    Config.prototype.save = function() {
      gmSetValue('linkSelectors', JSON.stringify(this.linkSelectors))
      Config.setLinkSelectors(this.linkSelectors)
      gmSetValue('active', this.getActiveCheckbox().checked)
      gmSetValue('insert', this.getInsertCheckbox().checked)
    }
    Config.prototype.importExportCheckboxChanged = function() {
      var checkbox = this.doc.getElementById('import-export-checkbox')
      var container = this.doc.getElementById('import-export-container')
      container.classList[checkbox.checked ? 'add' : 'remove']('show')
      this.iframe.height = this.doc.documentElement.offsetHeight
    }
    Config.prototype.exportToClipboard = function() {
      gmSetClipboard(JSON.stringify(this.linkSelectors))
    }
    Config.prototype.import = function() {
      try {
        var ta = this.getImpExpTextarea()
        this.linkSelectors = JSON.parse(ta.value).map(function(o) {
          return new LinkSelector(o)
        })
        this.updateUrlList()
        ta.setCustomValidity('')
      } catch (e) {
        ta.setCustomValidity(e.toString())
      }
    }
    Config.prototype.export = function() {
      this.getImpExpTextarea().value = JSON.stringify(this.linkSelectors)
    }
    return Config
  })()

  var LinkSelector = (function() {

    function isLeftMouseButtonWithoutModifierKeys(mouseEvent) {
      var e = mouseEvent
      return !(e.button || e.altKey || e.shiftKey || e.ctrlKey || e.metaKey)
    }
    function isOpenableLink(elem) {
      return ['A', 'AREA'].indexOf(elem.tagName) >= 0
          && elem.href
          && elem.protocol !== 'javascript:'
    }
    function getAncestorOpenableLink(descendant) {
      for (var p = descendant.parentNode; p; p = p.parentNode) {
        if (isOpenableLink(p)) return p
      }
      return null
    }
    async function openInTab(url) {
      if (gmInfo.scriptHandler === 'Greasemonkey') {
        gmOpenInTab(url, !(await Config.isNewTabActivation()))
      } else {
        gmOpenInTab(url, {
          active: await Config.isNewTabActivation(),
          insert: await Config.isNewTabInsertion(),
        })
      }
    }

    function LinkSelector(o) {
      o = o || {}
      this.url = o.url || ''
      this.selectors = o.selectors || []
      this.capture = !!o.capture
    }
    LinkSelector.getLocatedInstances = function() {
      return Config.getLinkSelectors().filter(s => s.matchUrlForward())
    }
    LinkSelector.addCallbackIfRequired = function() {
      var i = LinkSelector.getLocatedInstances()
      if (i.some(not(getter('capture')))) {
        document.addEventListener('click', LinkSelector.callback, false)
      }
      if (i.some(getter('capture'))) {
        document.addEventListener('click', LinkSelector.callback, true)
      }
    }
    LinkSelector.updateCallback = function() {
      document.removeEventListener('click', LinkSelector.callback, false)
      document.removeEventListener('click', LinkSelector.callback, true)
      LinkSelector.addCallbackIfRequired()
    }
    LinkSelector.callback = function(mouseEvent) {
      var e = mouseEvent
      if (!isLeftMouseButtonWithoutModifierKeys(e)) return

      var link = isOpenableLink(e.target) ? e.target
                                          : getAncestorOpenableLink(e.target)
      if (!link) return

      var opened = LinkSelector.getLocatedInstances()
        .some(s => s.openInTabIfMatch(link, e.eventPhase))
      if (!opened) return

      e.preventDefault()
      if (e.eventPhase === Event.CAPTURING_PHASE) e.stopPropagation()
    }
    LinkSelector.prototype.matchUrlForward = function() {
      return document.location.href.indexOf(this.url) === 0
    }
    LinkSelector.prototype.matchEventPhase = function(eventPhase) {
      return this.capture ? eventPhase === Event.CAPTURING_PHASE
                          : eventPhase === Event.BUBBLING_PHASE
    }
    LinkSelector.prototype.matchLink = function(link) {
      return !this.selectors.length
          || this.selectors.some(link.matches.bind(link))
    }
    LinkSelector.prototype.openInTabIfMatch = function(link, eventPhase) {
      if (this.matchEventPhase(eventPhase) && this.matchLink(link)) {
        openInTab(link.href)
        return true
      }
      return false
    }
    return LinkSelector
  })()

  function addConfigButtonIfScriptPage() {
    if (!location.href.startsWith('https://greasyfork.org/ja/scripts/5591-open-in-new-tab'))
      return
    const add = () => {
      const e = document.createElement('button')
      e.type = 'button'
      e.textContent = '設定'
      e.addEventListener('click', Config.show)
      document.querySelector('#script-info > header > h2').appendChild(e)
    }
    if (['interactive', 'complete'].includes(document.readyState))
      add()
    else
      document.addEventListener('DOMContentLoaded', add)
  }
  async function main() {
    Config.setLinkSelectors(await gmGetLinkSelectors())
    LinkSelector.addCallbackIfRequired()
    if (typeof GM_registerMenuCommand !== 'undefined')
      GM_registerMenuCommand('Open In New Tab 設定', Config.show)
    addConfigButtonIfScriptPage()
  }

  main()
})()
