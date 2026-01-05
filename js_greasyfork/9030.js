// ==UserScript==
// @name           Feedly NG Filter
// @namespace      https://github.com/matzkoh
// @version        1.1.0
// @description    ルールにマッチするアイテムを既読にして取り除きます。ルールは正規表現で記述でき、複数のルールをツリー状に組み合わせることができます。
// @author         matzkoh
// @include        https://feedly.com/*
// @icon           https://raw.githubusercontent.com/matzkoh/userscripts/master/packages/feedly-ng-filter/images/icon.png
// @screenshot     https://raw.githubusercontent.com/matzkoh/userscripts/master/packages/feedly-ng-filter/images/screenshot.png
// @run-at         document-start
// @grant          GM_getValue
// @grant          GM_setValue
// @grant          GM_addStyle
// @grant          GM_xmlhttpRequest
// @grant          GM_registerMenuCommand
// @grant          GM_unregisterMenuCommand
// @grant          GM_log
// @downloadURL https://update.greasyfork.org/scripts/9030/Feedly%20NG%20Filter.user.js
// @updateURL https://update.greasyfork.org/scripts/9030/Feedly%20NG%20Filter.meta.js
// ==/UserScript==

var $parcel$global =
  typeof globalThis !== 'undefined'
    ? globalThis
    : typeof self !== 'undefined'
    ? self
    : typeof window !== 'undefined'
    ? window
    : typeof global !== 'undefined'
    ? global
    : {}
var $parcel$modules = {}
var $parcel$inits = {}

var parcelRequire = $parcel$global['parcelRequire7c40']
if (parcelRequire == null) {
  parcelRequire = function (id) {
    if (id in $parcel$modules) {
      return $parcel$modules[id].exports
    }
    if (id in $parcel$inits) {
      var init = $parcel$inits[id]
      delete $parcel$inits[id]
      var module = { id: id, exports: {} }
      $parcel$modules[id] = module
      init.call(module.exports, module, module.exports)
      return module.exports
    }
    var err = new Error("Cannot find module '" + id + "'")
    err.code = 'MODULE_NOT_FOUND'
    throw err
  }

  parcelRequire.register = function register(id, init) {
    $parcel$inits[id] = init
  }

  $parcel$global['parcelRequire7c40'] = parcelRequire
}
parcelRequire.register('cG8Vr', function (module, exports) {
  const notificationDefaults = {
    title: 'Feedly NG Filter',
    icon: GM_info.script.icon,
    tag: 'feedly-ng-filter',
    autoClose: 5000,
  }
  const CSS_STYLE_TEXT =
    ".fngf-row {\n  display: flex;\n  flex-direction: row;\n}\n\n.fngf-column {\n  display: flex;\n  flex-direction: column;\n}\n\n.fngf-align-center {\n  align-items: center;\n}\n\n.fngf-grow {\n  flex-grow: 1;\n}\n\n.fngf-badge {\n  padding: 0 0.5em;\n  margin: 0 0.5em;\n  color: #fff;\n  background-color: #999;\n  border-radius: 50%;\n}\n\n.fngf-btn {\n  padding: 5px 10px;\n  font: inherit;\n  font-weight: bold;\n  color: #333;\n  background-color: #eee;\n  border: none;\n  outline: none;\n}\n\n.fngf-menu-btn > .fngf-btn:not(:last-child) {\n  margin-right: -1px;\n}\n\n.fngf-btn[disabled] {\n  color: #ccc;\n  background-color: transparent;\n  box-shadow: 0 0 0 1px #eee inset;\n}\n\n.fngf-btn:not([disabled]):active,\n.fngf-btn:not([disabled]).active,\n.fngf-checkbox > :checked + .fngf-btn {\n  background-color: #ccc;\n}\n\n.fngf-btn:not([disabled]):hover,\n.fngf-menu-btn:hover > .fngf-btn:not([disabled]) {\n  box-shadow: 0 0 0 1px #ccc inset;\n}\n\n.fngf-dropdown {\n  position: relative;\n  display: flex;\n  align-items: center;\n  padding-right: 5px;\n  padding-left: 5px;\n\n  &::before {\n    display: block;\n    content: '';\n    border-top: 5px solid #333;\n    border-right: 3px solid transparent;\n    border-left: 3px solid transparent;\n  }\n}\n\n.fngf-dropdown-menu {\n  position: absolute;\n  top: 100%;\n  right: 0;\n  z-index: 1;\n  min-width: 100px;\n  background-color: #fff;\n  box-shadow: 1px 2px 5px #0008;\n}\n\n.fngf-dropdown:not(.active) {\n  > .fngf-dropdown-menu {\n    display: none;\n  }\n}\n\n.fngf-dropdown-menu-item {\n  padding: 10px;\n\n  &:hover {\n    background-color: #eee;\n  }\n}\n\n.fngf-checkbox > input[type='checkbox'] {\n  display: none;\n}\n\n.fngf-only:not(:only-child) {\n  display: none;\n}\n" +
    "@keyframes error {\n  from {\n    background-color: #ff0;\n    border-color: #f00;\n  }\n}\n\n.fngf-panel {\n  position: fixed;\n  z-index: 2147483646;\n  display: grid;\n  grid-gap: 10px;\n  min-width: 320px;\n  padding: 10px;\n  font-size: 12px;\n  color: #333;\n  cursor: default;\n  user-select: none;\n  background-color: #fffe;\n  box-shadow: 1px 2px 5px #0008;\n}\n\n.fngf-panel-body {\n  display: grid;\n  grid-gap: 10px;\n}\n\n.fngf-panel input[type='text'] {\n  padding: 4px;\n  font: inherit;\n  border: 1px solid #999;\n\n  &:focus {\n    box-shadow: 0 0 0 1px #999 inset;\n  }\n}\n\n.fngf-panel-terms {\n  display: grid;\n  grid-template-columns: auto 1fr auto;\n  grid-gap: 5px;\n  align-items: center;\n  width: 400px;\n  padding: 10px;\n  white-space: nowrap;\n  border: 1px solid #999;\n}\n\n.fngf-panel.root .fngf-panel-name,\n.fngf-panel.root .fngf-panel-terms {\n  display: none;\n}\n\n.fngf-panel-terms-textbox.error {\n  animation: error 1s;\n}\n\n.fngf-panel-rules {\n  padding: 10px;\n  border: 1px solid #999;\n}\n\n.fngf-panel fieldset {\n  padding: 10px;\n  margin: 0;\n}\n\n.fngf-panel-rule-name {\n  flex-grow: 1;\n}\n\n.fngf-panel-buttons {\n  justify-content: space-between;\n\n  > .fngf-btn-group:not(:first-child) {\n    margin-left: 10px;\n  }\n}\n"
  function __(strings1, ...values1) {
    let key1 = values1.map((v1, i1) => `${strings1[i1]}{${i1}}`).join('') + strings1[strings1.length - 1]
    if (!(key1 in __.data)) throw new Error(`localized string not found: ${key1}`)
    return __.data[key1].replace(/\{(\d+)\}/g, (_1, cap1) => values1[cap1])
  }
  Object.defineProperties(__, {
    config: {
      configurable: true,
      writable: true,
      value: {
        defaultLocale: 'en-US',
      },
    },
    locales: {
      configurable: true,
      writable: true,
      value: {},
    },
    data: {
      configurable: true,
      get() {
        return this.locales[this.config.locale]
      },
    },
    languages: {
      configurable: true,
      get() {
        return Object.keys(this.locales)
      },
    },
    add: {
      configurable: true,
      writable: true,
      value: function add1({ locale: locale1, data: data1 }) {
        if (locale1 in this.locales) throw new Error(`failed to add existing locale: ${locale1}`)
        this.locales[locale1] = data1
      },
    },
    use: {
      configurable: true,
      writable: true,
      value: function use1(locale1) {
        if (locale1 in this.locales) this.config.locale = locale1
        else if (this.config.defaultLocale) this.config.locale = this.config.defaultLocale
        else throw new Error(`unknown locale: ${locale1}`)
      },
    },
  })
  __.add({
    locale: 'en-US',
    data: {
      'Feedly NG Filter': 'Feedly NG Filter',
      OK: 'OK',
      Cancel: 'Cancel',
      Add: 'Add',
      Copy: 'Copy',
      Paste: 'Paste',
      'New Filter': 'New Filter',
      'Rule Name': 'Rule Name',
      'No Rules': 'No Rules',
      Title: 'Title',
      URL: 'URL',
      'Feed Title': 'Feed Title',
      'Feed URL': 'Feed URL',
      Author: 'Author',
      Keywords: 'Keywords',
      Contents: 'Contents',
      'Ignore Case': 'Ignore Case',
      Edit: 'Edit',
      Delete: 'Delete',
      'Hit Count:	{0}': 'Hit Count:	{0}',
      'Last Hit:	{0}': 'Last Hit:	{0}',
      'NG Setting': 'NG Setting',
      Setting: 'Setting',
      'Import Configuration': 'Import Configuration',
      'Preferences were successfully imported.': 'Preferences were successfully imported.',
      'Export Configuration': 'Export Configuration',
      Language: 'Language',
      'NG Settings were modified.\nNew filters take effect after next refresh.':
        'NG Settings were modified.\nNew filters take effect after next refresh.',
    },
  })
  __.add({
    locale: 'ja',
    data: {
      'Feedly NG Filter': 'Feedly NG Filter',
      OK: 'OK',
      Cancel: 'キャンセル',
      Add: '追加',
      Copy: 'コピー',
      Paste: '貼り付け',
      'New Filter': '新しいフィルタ',
      'Rule Name': 'ルール名',
      'No Rules': 'ルールはありません',
      Title: 'タイトル',
      URL: 'URL',
      'Feed Title': 'フィードのタイトル',
      'Feed URL': 'フィードの URL',
      Author: '著者',
      Keywords: 'キーワード',
      Contents: '本文',
      'Ignore Case': '大/小文字を区別しない',
      Edit: '編集',
      Delete: '削除',
      'Hit Count:	{0}': 'ヒット数:	{0}',
      'Last Hit:	{0}': '最終ヒット:	{0}',
      'NG Setting': 'NG 設定',
      Setting: '設定',
      'Import Configuration': '設定をインポート',
      'Preferences were successfully imported.': '設定をインポートしました',
      'Export Configuration': '設定をエクスポート',
      Language: '言語',
      'NG Settings were modified.\nNew filters take effect after next refresh.':
        'NG 設定を更新しました。\n新しいフィルタは次回読み込み時から有効になります。',
    },
  })
  __.use(navigator.language)
  class Serializer {
    static stringify(value1, space1) {
      return JSON.stringify(
        value1,
        (key1, value1) => {
          if (value1 instanceof RegExp)
            return {
              __serialized__: true,
              class: 'RegExp',
              args: [value1.source, value1.flags],
            }
          return value1
        },
        space1,
      )
    }
    static parse(text1) {
      return JSON.parse(text1, (key1, value1) => {
        if (value1?.__serialized__)
          switch (value1.class) {
            case 'RegExp':
              return new RegExp(...value1.args)
          }
        return value1
      })
    }
  }
  class EventEmitter {
    constructor() {
      this.listeners = {}
    }
    on(type1, listener1) {
      if (type1.trim().includes(' ')) {
        type1.match(/\S+/g).forEach(t1 => this.on(t1, listener1))
        return
      }
      if (!(type1 in this.listeners)) this.listeners[type1] = new Set()
      const set1 = this.listeners[type1]
      for (const fn1 of set1.values()) {
        if (EventEmitter.compareListener(fn1, listener1)) return
      }
      set1.add(listener1)
    }
    async once(type1, listener1) {
      return new Promise((resolve1, reject1) => {
        function wrapper1(event1) {
          this.off(wrapper1)
          try {
            EventEmitter.applyListener(this, listener1, event1)
            resolve1(event1)
          } catch (e1) {
            reject1(e1)
          }
        }
        wrapper1[EventEmitter.original] = listener1
        this.on(type1, wrapper1)
      })
    }
    off(type1, listener1) {
      if (!listener1 || !(type1 in this.listeners)) return
      const set1 = this.listeners[type1]
      for (const fn1 of set1.values()) if (EventEmitter.compareListener(fn1, listener1)) set1.delete(fn1)
    }
    removeAllListeners(type1) {
      delete this.listeners[type1]
    }
    dispatchEvent(event1) {
      event1.timestamp = Date.now()
      if (event1.type in this.listeners)
        this.listeners[event1.type].forEach(listener1 => {
          try {
            EventEmitter.applyListener(this, listener1, event1)
          } catch (e1) {
            setTimeout(() => {
              throw e1
            }, 0)
          }
        })
      return !event1.canceled
    }
    emit(type1, data1) {
      const event1 = this.createEvent(type1)
      Object.assign(event1, data1)
      return this.dispatchEvent(event1)
    }
    createEvent(type1) {
      return new Event(type1, this)
    }
    static compareListener(a1, b1) {
      return a1 === b1 || a1 === b1[EventEmitter.original] || a1[EventEmitter.original] === b1
    }
    static applyListener(target1, listener1, ...args1) {
      if (typeof listener1 === 'function') listener1.apply(target1, args1)
      else listener1.handleEvent(...args1)
    }
  }
  EventEmitter.original = Symbol('fngf.original')
  class Event {
    constructor(type1, target1) {
      this.type = type1
      this.target = target1
      this.canceled = false
      this.timestamp = 0
    }
    preventDefault() {
      this.canceled = true
    }
  }
  class DataTransfer extends EventEmitter {
    set(type1, data1) {
      this.purge()
      this.type = type1
      this.data = data1
      this.emit(type1, {
        data: data1,
      })
    }
    purge() {
      this.emit('purge', {
        data: this.data,
      })
      delete this.data
    }
    cut(data1) {
      this.set('cut', data1)
    }
    copy(data1) {
      this.set('copy', data1)
    }
    receive() {
      const data1 = this.data
      if (this.type === 'cut') this.purge()
      return data1
    }
  }
  class MenuCommand {
    constructor(label1, oncommand1) {
      this.label = label1
      this.oncommand = oncommand1
    }
    register() {
      if (typeof GM_registerMenuCommand === 'function')
        this.uuid = GM_registerMenuCommand(`${__`Feedly NG Filter`} - ${this.label}`, this.oncommand)
      if (MenuCommand.contextmenu) {
        this.menuitem = $el`<menuitem label="${this.label}" @click="${this.oncommand}">`.first
        MenuCommand.contextmenu.appendChild(this.menuitem)
      }
    }
    unregister() {
      if (typeof GM_unregisterMenuCommand === 'function') GM_unregisterMenuCommand(this.uuid)
      delete this.uuid
      document.adoptNode(this.menuitem)
    }
    static register(...args1) {
      const c1 = new MenuCommand(...args1)
      c1.register()
      return c1
    }
  }
  MenuCommand.contextmenu = null
  class Preference extends EventEmitter {
    constructor() {
      super()
      if (Preference._instance) return Preference._instance
      Preference._instance = this
      this.dict = {}
    }
    has(key1) {
      return key1 in this.dict
    }
    get(key1, def1) {
      return this.has(key1) ? this.dict[key1] : def1
    }
    set(key1, newValue1) {
      const prevValue1 = this.dict[key1]
      if (newValue1 !== prevValue1) {
        this.dict[key1] = newValue1
        this.emit('change', {
          key: key1,
          prevValue: prevValue1,
          newValue: newValue1,
        })
      }
      return newValue1
    }
    del(key1) {
      if (!this.has(key1)) return
      const prevValue1 = this.dict[key1]
      delete this.dict[key1]
      this.emit('delete', {
        key: key1,
        prevValue: prevValue1,
      })
    }
    load(str) {
      str ||= GM_getValue(Preference.prefName, Preference.defaultPref || '({})')
      let obj
      try {
        obj = Serializer.parse(str)
      } catch (e) {
        if (e instanceof SyntaxError) obj = eval(`(${str})`)
      }
      if (!obj || typeof obj !== 'object') return
      this.dict = {}
      for (const key in obj) this.set(key, obj[key])
      this.emit('load')
    }
    write() {
      this.dict.__version__ = GM_info.script.version
      GM_setValue(Preference.prefName, Serializer.stringify(this.dict))
    }
    autosave() {
      if (this.autosaveReserved) return
      window.addEventListener('unload', () => this.write(), false)
      this.autosaveReserved = true
    }
    exportToFile() {
      const blob1 = new Blob([this.serialize()], {
        type: 'application/octet-stream',
      })
      const url1 = URL.createObjectURL(blob1)
      location.assign(url1)
      URL.revokeObjectURL(url1)
    }
    importFromString(str1) {
      try {
        this.load(str1)
      } catch (e1) {
        if (!(e1 instanceof SyntaxError)) throw e1
        notify(e1)
        return false
      }
      notify(__`Preferences were successfully imported.`)
      return true
    }
    importFromFile() {
      openFilePicker().then(([file1]) => {
        const reader1 = new FileReader()
        reader1.addEventListener('load', () => this.importFromString(reader1.result), false)
        reader1.readAsText(file1)
      })
    }
    toString() {
      return '[object Preference]'
    }
    serialize() {
      return Serializer.stringify(this.dict)
    }
  }
  Preference.prefName = 'settings'
  class Draggable {
    constructor(element1, ignore1 = 'select, button, input, textarea, [tabindex]') {
      this.element = element1
      this.ignore = ignore1
      this.attach()
    }
    isDraggableTarget(target1) {
      if (!target1) return false
      if (target1 === this.element) return true
      return !target1.matches(`${this.ignore}, :-webkit-any(${this.ignore}) *`)
    }
    attach() {
      this.element.addEventListener('mousedown', this, false, false)
    }
    detach() {
      this.element.removeEventListener('mousedown', this, false)
    }
    handleEvent(event1) {
      const name1 = `on${event1.type}`
      if (name1 in this) this[name1](event1)
    }
    onmousedown(event1) {
      if (event1.button !== 0) return
      if (!this.isDraggableTarget(event1.target)) return
      event1.preventDefault()
      this.element.querySelector(':focus')?.blur()
      this.offsetX = event1.pageX - this.element.offsetLeft
      this.offsetY = event1.pageY - this.element.offsetTop
      document.addEventListener('mousemove', this, true, false)
      document.addEventListener('mouseup', this, true, false)
    }
    onmousemove(event1) {
      event1.preventDefault()
      this.element.style.left = `${event1.pageX - this.offsetX}px`
      this.element.style.top = `${event1.pageY - this.offsetY}px`
    }
    onmouseup(event1) {
      if (event1.button === 0) {
        event1.preventDefault()
        document.removeEventListener('mousemove', this, true)
        document.removeEventListener('mouseup', this, true)
      }
    }
  }
  class Filter {
    constructor(filter1 = {}) {
      this.name = filter1.name || ''
      this.regexp = {
        ...filter1.regexp,
      }
      this.children = filter1.children?.map(f1 => new Filter(f1)) || []
      this.hitcount = filter1.hitcount || 0
      this.lasthit = filter1.lasthit || 0
    }
    test(entry1) {
      let name1
      for (name1 in this.regexp) {
        if (!this.regexp[name1].test(entry1[name1] || '')) return false
      }
      const hit1 = this.children.length ? this.children.some(filter1 => filter1.test(entry1)) : !!name1
      if (hit1 && entry1.unread) {
        this.hitcount++
        this.lasthit = Date.now()
      }
      return hit1
    }
    appendChild(filter1) {
      if (!(filter1 instanceof Filter)) return null
      this.removeChild(filter1)
      this.children.push(filter1)
      this.sortChildren()
      return filter1
    }
    removeChild(filter1) {
      if (!(filter1 instanceof Filter)) return null
      const index1 = this.children.indexOf(filter1)
      if (index1 !== -1) this.children.splice(index1, 1)
      return filter1
    }
    sortChildren() {
      return this.children.sort((a1, b1) => b1.name < a1.name)
    }
  }
  class Entry {
    constructor(data1) {
      this.data = data1
    }
    get title() {
      const value1 = $el`<div>${this.data.title || ''}`.first.textContent
      Object.defineProperty(this, 'title', {
        configurable: true,
        value: value1,
      })
      return value1
    }
    get id() {
      return this.data.id
    }
    get url() {
      return this.data.alternate?.[0]?.href
    }
    get sourceTitle() {
      return this.data.origin.title
    }
    get sourceURL() {
      return this.data.origin.streamId.replace(/^[^/]+\//, '')
    }
    get body() {
      return (this.data.content || this.data.summary)?.content
    }
    get author() {
      return this.data.author
    }
    get recrawled() {
      return this.data.recrawled
    }
    get published() {
      return this.data.published
    }
    get updated() {
      return this.data.updated
    }
    get keywords() {
      return this.data.keywords?.join(',') || ''
    }
    get unread() {
      return this.data.unread
    }
    get tags() {
      return this.data.tags.map(tag1 => tag1.label)
    }
  }
  class Panel extends EventEmitter {
    constructor() {
      super()
      this.opened = false
      const onSubmit1 = event1 => {
        event1.preventDefault()
        event1.stopPropagation()
        this.apply()
      }
      const onKeyPress1 = event1 => {
        if (event1.keyCode === KeyboardEvent.DOM_VK_ESCAPE) this.emit('escape')
      }
      const {
        element: element1,
        body: body1,
        buttons: buttons1,
      } = $el`
      <form class="fngf-panel" @submit="${onSubmit1}" @keydown="${onKeyPress1}" ref="element">
        <input type="submit" style="display: none;">
        <div class="fngf-panel-body fngf-column" ref="body"></div>
        <div class="fngf-panel-buttons fngf-row" ref="buttons">
          <div class="fngf-btn-group fngf-row">
            <button type="button" class="fngf-btn" @click="${() => this.apply()}">${__`OK`}</button>
            <button type="button" class="fngf-btn" @click="${() => this.close()}">${__`Cancel`}</button>
          </div>
        </div>
      </form>
    `
      new Draggable(element1)
      this.dom = {
        element: element1,
        body: body1,
        buttons: buttons1,
      }
    }
    open(anchorElement1) {
      if (this.opened) return
      if (!this.emit('showing')) return
      if (anchorElement1?.nodeType !== 1) anchorElement1 = null
      document.body.appendChild(this.dom.element)
      this.opened = true
      this.snapTo(anchorElement1)
      if (anchorElement1) {
        const onWindowResize1 = () => this.snapTo(anchorElement1)
        window.addEventListener('resize', onWindowResize1, false)
        this.on('hidden', () => window.removeEventListener('resize', onWindowResize1, false))
      }
      document.querySelector(':focus')?.blur()
      const selector1 = ':not(.feedlyng-panel) > :-webkit-any(button, input, select, textarea, [tabindex])'
      const ctrl1 = Array.from(this.dom.element.querySelectorAll(selector1)).sort(
        (a1, b1) => (b1.tabIndex || 0) < (a1.tabIndex || 0),
      )[0]
      if (ctrl1) {
        ctrl1.focus()
        if (ctrl1.select) ctrl1.select()
      }
      this.emit('shown')
    }
    apply() {
      if (this.emit('apply')) this.close()
    }
    close() {
      if (!this.opened) return
      if (!this.emit('hiding')) return
      document.adoptNode(this.dom.element)
      this.opened = false
      this.emit('hidden')
    }
    toggle(anchorElement1) {
      if (this.opened) this.close()
      else this.open(anchorElement1)
    }
    moveTo(x1, y1) {
      this.dom.element.style.left = `${x1}px`
      this.dom.element.style.top = `${y1}px`
    }
    snapTo(anchorElement1) {
      const pad1 = 5
      let x1 = pad1
      let y1 = pad1
      if (anchorElement1) {
        let { left: left1, bottom: top1 } = anchorElement1.getBoundingClientRect()
        left1 += pad1
        top1 += pad1
        const { width: width1, height: height1 } = this.dom.element.getBoundingClientRect()
        const right1 = left1 + width1 + pad1
        const bottom1 = top1 + height1 + pad1
        const { innerWidth: innerWidth1, innerHeight: innerHeight1 } = window
        if (innerWidth1 < right1) left1 -= right1 - innerWidth1
        if (innerHeight1 < bottom1) top1 -= bottom1 - innerHeight1
        x1 = Math.max(x1, left1)
        y1 = Math.max(y1, top1)
      }
      this.moveTo(x1, y1)
    }
    getFormData(asElement1) {
      const data1 = {}
      const elements1 = this.dom.body.querySelectorAll('[name]')
      function getValue1(el1) {
        if (el1.localName === 'input' && (el1.type === 'checkbox' || el1.type === 'radio')) return el1.checked
        return 'value' in el1 ? el1.value : el1.getAttribute('value')
      }
      for (const el1 of elements1) {
        const value1 = asElement1 ? el1 : getValue1(el1)
        const path1 = el1.name.split('.')
        let leaf1 = path1.pop()
        const cd1 = path1.reduce((parent1, key1) => {
          if (!(key1 in parent1)) parent1[key1] = {}
          return parent1[key1]
        }, data1)
        if (leaf1.endsWith('[]')) {
          leaf1 = leaf1.slice(0, -2)
          if (!(leaf1 in cd1)) cd1[leaf1] = []
          cd1[leaf1].push(value1)
        } else cd1[leaf1] = value1
      }
      return data1
    }
    appendContent(element1) {
      if (element1 instanceof Array) return element1.map(el1 => this.appendContent(el1))
      return this.dom.body.appendChild(element1)
    }
    removeContents() {
      this.dom.body.innerHTML = ''
    }
  }
  class FilterListPanel extends Panel {
    constructor(filter1, isRoot1) {
      super()
      this.filter = filter1
      if (isRoot1) this.dom.element.classList.add('root')
      const onAdd1 = () => {
        const filter1 = new Filter()
        filter1.name = __`New Filter`
        this.on('apply', () => this.filter.appendChild(filter1))
        this.appendFilter(filter1)
      }
      const onPaste1 = () => {
        if (!clipboard.data) return
        const filter1 = new Filter(clipboard.receive())
        this.on('apply', () => this.filter.appendChild(filter1))
        this.appendFilter(filter1)
      }
      const { buttons: buttons1, paste: paste1 } = $el`
      <div class="fngf-btn-group fngf-row" ref="buttons">
        <button type="button" class="fngf-btn" @click="${onAdd1}">${__`Add`}</button>
        <button type="button" class="fngf-btn" @click="${onPaste1}" ref="paste" disabled>${__`Paste`}</button>
      </div>
    `
      function pasteState1() {
        paste1.disabled = !clipboard.data
      }
      clipboard.on('copy', pasteState1)
      clipboard.on('purge', pasteState1)
      pasteState1()
      this.dom.buttons.insertBefore(buttons1, this.dom.buttons.firstChild)
      this.on('escape', () => this.close())
      this.on('showing', this.initContents)
      this.on('apply', this)
      this.on('hidden', () => {
        clipboard.off('copy', pasteState1)
        clipboard.off('purge', pasteState1)
      })
    }
    initContents() {
      const filter1 = this.filter
      const {
        name: name1,
        terms: terms1,
        rules: rules1,
      } = $el`
      <div class="fngf-panel-name fngf-row fngf-align-center" ref="name">
        ${__`Rule Name`}&nbsp;
        <input type="text" value="${filter1.name}" autocomplete="off" name="name" class="fngf-grow">
      </div>
      <div class="fngf-panel-terms" ref="terms"></div>
      <div class="fngf-panel-rules fngf-column" ref="rules">
        <div class="fngf-panel-rule fngf-row fngf-align-center fngf-only">${__`No Rules`}</div>
      </div>
    `
      const labels1 = [
        ['title', __`Title`],
        ['url', __`URL`],
        ['sourceTitle', __`Feed Title`],
        ['sourceURL', __`Feed URL`],
        ['author', __`Author`],
        ['keywords', __`Keywords`],
        ['body', __`Contents`],
      ]
      for (const [type1, labelText1] of labels1) {
        const randomId1 = `id-${Math.random().toFixed(8)}`
        const reg1 = filter1.regexp[type1]
        const sourceValue1 = reg1 ? reg1.source.replace(/((?:^|[^\\])(?:\\\\)*)\\(?=\/)/g, '$1') : ''
        terms1.appendChild($el`
        <label for="${randomId1}">${labelText1}</label>
        <input type="text" class="fngf-panel-terms-textbox" id="${randomId1}" autocomplete="off" name="regexp.${type1}.source" value="${sourceValue1}">
        <label class="fngf-checkbox fngf-row" title="${__`Ignore Case`}">
          <input type="checkbox" name="regexp.${type1}.ignoreCase" bool:checked="${reg1?.ignoreCase}">
          <span class="fngf-btn" tabindex="0">i</span>
        </label>
      `)
      }
      this.appendContent([name1, terms1, rules1])
      this.dom.rules = rules1
      filter1.children.forEach(this.appendFilter, this)
    }
    appendFilter(filter1) {
      let panel1
      const updateRow1 = () => {
        let title1 = __`Hit Count:\t${filter1.hitcount}`
        if (filter1.lasthit) {
          title1 += '\n'
          title1 += __`Last Hit:\t${new Date(filter1.lasthit).toLocaleString()}`
        }
        rule1.title = title1
        name1.textContent = filter1.name
        count1.textContent = filter1.children.length || ''
      }
      const onEdit1 = () => {
        if (panel1) {
          panel1.close()
          return
        }
        panel1 = new FilterListPanel(filter1)
        panel1.on('shown', () => btnEdit1.classList.add('active'))
        panel1.on('hidden', () => {
          btnEdit1.classList.remove('active')
          panel1 = null
        })
        panel1.on('apply', () => setTimeout(updateRow1, 0))
        panel1.open(btnEdit1)
      }
      const onCopy1 = () => clipboard.copy(filter1)
      const onDelete1 = () => {
        document.adoptNode(rule1)
        this.on('apply', () => this.filter.removeChild(filter1))
      }
      const {
        rule: rule1,
        name: name1,
        count: count1,
        btnEdit: btnEdit1,
      } = $el`
      <div class="fngf-panel-rule fngf-row fngf-align-center" ref="rule">
        <div class="fngf-panel-rule-name" @dblclick="${onEdit1}" ref="name"></div>
        <div class="fngf-panel-rule-count fngf-badge" ref="count"></div>
        <div class="fngf-panel-rule-actions fngf-btn-group fngf-menu-btn fngf-row" ref="buttons">
          <button type="button" class="fngf-btn" @click="${onEdit1}" ref="btnEdit">${__`Edit`}</button>
          <div class="fngf-dropdown fngf-btn" tabindex="0">
            <div class="fngf-dropdown-menu fngf-column">
              <div class="fngf-dropdown-menu-item" @click="${onCopy1}">${__`Copy`}</div>
              <div class="fngf-dropdown-menu-item" @click="${onDelete1}">${__`Delete`}</div>
            </div>
          </div>
        </div>
      </div>
    `
      updateRow1()
      this.dom.rules.appendChild(rule1)
    }
    handleEvent(event1) {
      if (event1.type !== 'apply') return
      const data1 = this.getFormData(true)
      const filter1 = this.filter
      const regexp1 = {}
      let hasError1 = false
      for (const type1 in data1.regexp) {
        const { source: source1, ignoreCase: ignoreCase1 } = data1.regexp[type1]
        if (!source1.value) continue
        try {
          regexp1[type1] = new RegExp(source1.value, ignoreCase1.checked ? 'i' : '')
        } catch (e1) {
          if (!(e1 instanceof SyntaxError)) throw e1
          hasError1 = true
          event1.preventDefault()
          source1.classList.remove('error')
          source1.offsetWidth.valueOf()
          source1.classList.add('error')
        }
      }
      if (hasError1) return
      const prevSource1 = Serializer.stringify(filter1)
      filter1.name = data1.name.value
      filter1.regexp = regexp1
      if (Serializer.stringify(filter1) !== prevSource1) {
        filter1.hitcount = 0
        filter1.lasthit = 0
      }
      filter1.sortChildren()
    }
  }
  Preference.defaultPref = Serializer.stringify({
    filter: {
      name: '',
      regexp: {},
      children: [
        {
          name: 'AD',
          regexp: {
            title: /^\W?(?:ADV?|PR)\b/,
          },
          children: [],
        },
      ],
    },
  })
  evalInContent(() => {
    let uniqueId1 = 0
    const _fetch1 = window.fetch
    window.fetch = async function fetch1(url1, init1) {
      const res1 = await _fetch1.call(this, url1, init1)
      if (!/^(?:https?:)?\/\/(?:(?:api|cloud)\.)?feedly\.com\/v3\/streams\/contents\b/.test(url1)) return res1
      const auth1 = init1.headers.Authorization
      const _text1 = res1.text
      res1.text = async function text1() {
        const text1 = await _text1.call(this)
        const pongEventType1 = 'streamcontentloaded_callback' + uniqueId1++
        const data1 = JSON.stringify({
          type: pongEventType1,
          auth: auth1,
          text: text1,
        })
        const event1 = new MessageEvent('streamcontentloaded', {
          bubbles: true,
          cancelable: false,
          data: data1,
          origin: location.href,
          source: null,
        })
        let result1
        const onPong1 = ({ data: data1 }) => {
          result1 = data1
        }
        document.addEventListener(pongEventType1, onPong1, false)
        document.dispatchEvent(event1)
        document.removeEventListener(pongEventType1, onPong1, false)
        return result1 ?? text1
      }
      return res1
    }
  })
  const clipboard = new DataTransfer()
  const pref = new Preference()
  let rootFilterPanel
  let { contextmenu } = $el`
  <menu type="context" id="feedlyng-contextmenu">
    <menu type="context" label="${__`Feedly NG Filter`}" ref="contextmenu"></menu>
  </menu>
`
  MenuCommand.contextmenu = contextmenu
  pref.on('change', function ({ key: key1, newValue: newValue1 }) {
    switch (key1) {
      case 'filter':
        if (!(newValue1 instanceof Filter)) this.set('filter', new Filter(newValue1))
        break
      case 'language':
        __.use(newValue1)
        break
    }
  })
  document.addEventListener(
    'streamcontentloaded',
    event1 => {
      const logging1 = pref.get('logging', true)
      const filter1 = pref.get('filter')
      const filteredEntryIds1 = []
      const { type: pongEventType1, auth: auth1, text: text1 } = JSON.parse(event1.data)
      const data1 = JSON.parse(text1)
      let hasUnread1 = false
      data1.items = data1.items.filter(item1 => {
        const entry1 = new Entry(item1)
        if (!filter1.test(entry1)) return true
        if (logging1) GM_log(`filtered: "${entry1.title || ''}" ${entry1.url}`)
        filteredEntryIds1.push(entry1.id)
        if (entry1.unread) hasUnread1 = true
        return false
      })
      if (!filteredEntryIds1.length) return
      let ev1 = new MessageEvent(pongEventType1, {
        bubbles: true,
        cancelable: false,
        data: JSON.stringify(data1),
        origin: location.href,
        source: unsafeWindow,
      })
      document.dispatchEvent(ev1)
      if (!hasUnread1) return
      sendJSON({
        url: '/v3/markers',
        headers: {
          Authorization: auth1,
        },
        data: {
          action: 'markAsRead',
          entryIds: filteredEntryIds1,
          type: 'entries',
        },
      })
    },
    false,
  )
  document.addEventListener(
    'DOMContentLoaded',
    () => {
      GM_addStyle(CSS_STYLE_TEXT)
      pref.load()
      pref.autosave()
      registerMenuCommands()
      addSettingsMenuItem()
    },
    false,
  )
  document.addEventListener(
    'mousedown',
    ({ target: target1 }) => {
      if (target1.matches('.fngf-dropdown')) target1.classList.toggle('active')
      if (!target1.closest('.fngf-dropdown'))
        document.querySelector('.fngf-dropdown.active')?.classList.remove('active')
    },
    true,
  )
  document.addEventListener(
    'click',
    ({ target: target1 }) => {
      if (target1.closest('.fngf-dropdown-menu-item')) target1.closest('.fngf-dropdown')?.classList.remove('active')
    },
    true,
  )
  function $el(strings1, ...values1) {
    let html1 = ''
    if (typeof strings1 === 'string') html1 = strings1
    else {
      values1.forEach((v1, i1) => {
        html1 += strings1[i1]
        if (v1 === null || v1 === undefined) return
        if (v1 instanceof Node || v1 instanceof NodeList || v1 instanceof HTMLCollection || v1 instanceof Array) {
          html1 += `<!--${$el.dataPrefix}${i1}-->`
          if (v1 instanceof Node) return
          values1[i1] = document.createDocumentFragment()
          for (const item1 of v1) values1[i1].appendChild(item1)
          return
        }
        html1 += v1 instanceof Object ? i1 : v1
      })
      html1 += strings1[strings1.length - 1]
    }
    const renderer1 = document.createElement('template')
    const container1 = document.createElement('body')
    const refs1 = document.createDocumentFragment()
    renderer1.innerHTML = html1
    container1.appendChild(renderer1.content)
    refs1.first = container1.firstElementChild
    refs1.last = container1.lastElementChild
    const exp1 = `
    .//*[@ref or @*[starts-with(name(), "@") or contains(name(), ":")]] |
    .//comment()[starts-with(., "${$el.dataPrefix}")]
  `
    const xpath1 = document.evaluate(exp1, container1, null, 7, null)
    for (let i1 = 0; i1 < xpath1.snapshotLength; i1++) {
      const el1 = xpath1.snapshotItem(i1)
      if (el1.nodeType === document.COMMENT_NODE) {
        const index1 = el1.data.substring($el.dataPrefix.length)
        el1.parentNode.replaceChild(values1[index1], el1)
        continue
      }
      for (const { name: name1, value: value1 } of Array.from(el1.attributes)) {
        const data1 = values1[value1]
        if (name1 === 'ref') refs1[value1] = el1
        else if (name1.startsWith('@')) $el.func(el1, name1.substring(1), data1)
        else if (name1 === ':class') for (const k1 of Object.keys(data1)) el1.classList.toggle(k1, data1[k1])
        else if (name1.startsWith('bool:')) el1[name1.substring(5)] = data1
        else continue
        el1.removeAttribute(name1)
      }
    }
    Array.from(container1.childNodes).forEach(node1 => refs1.appendChild(node1))
    return refs1
  }
  $el.dataPrefix = '$el.data:'
  $el.func = (el1, type1, fn1) => {
    if (type1) el1.addEventListener(type1, fn1, false)
    else
      try {
        fn1.call(el1, el1)
      } catch (e1) {
        console.error(e1)
      }
  }
  function xhr(details1) {
    const opt1 = {
      ...details1,
    }
    const { data: data1 } = opt1
    opt1.method ||= data1 ? 'POST' : 'GET'
    if (data1 instanceof Object) {
      opt1.headers ||= {}
      opt1.headers['Content-Type'] = 'application/x-www-form-urlencoded; charset=utf-8'
      opt1.data = Object.entries(data1)
        .map(kv1 => kv1.map(encodeURIComponent).join('='))
        .join('&')
    }
    setTimeout(() => GM_xmlhttpRequest(opt1), 0)
  }
  function registerMenuCommands() {
    MenuCommand.register(`${__`Setting`}...`, togglePrefPanel)
    MenuCommand.register(`${__`Language`}...`, () => {
      const { langField: langField1, select: select1 } = $el(`
      <fieldset ref="langField">
        <legend>${__`Language`}</legend>
        <select ref="select"></select>
      </fieldset>
    `)
      __.languages.forEach(lang1 => {
        const option1 = $el(`<option value="${lang1}">${lang1}</option>`).first
        if (lang1 === __.config.locale) option1.selected = true
        select1.appendChild(option1)
      })
      const panel1 = new Panel()
      panel1.appendContent(langField1)
      panel1.on('apply', () => pref.set('language', select1.value))
      panel1.open()
    })
    MenuCommand.register(`${__`Import Configuration`}...`, () => pref.importFromFile())
    MenuCommand.register(__`Export Configuration`, () => pref.exportToFile())
  }
  function sendJSON(details1) {
    const opt1 = {
      ...details1,
    }
    const { data: data1 } = opt1
    opt1.headers ||= {}
    opt1.method = 'POST'
    opt1.headers['Content-Type'] = 'application/json; charset=utf-8'
    opt1.data = JSON.stringify(data1)
    return xhr(opt1)
  }
  function evalInContent(code1) {
    const script1 = document.createElement('script')
    script1.textContent = typeof code1 === 'function' ? `(${code1})()` : code1
    document.documentElement.appendChild(script1)
    document.adoptNode(script1)
  }
  function togglePrefPanel(anchorElement1) {
    if (rootFilterPanel) {
      rootFilterPanel.close()
      return
    }
    rootFilterPanel = new FilterListPanel(pref.get('filter'), true)
    rootFilterPanel.on('apply', () =>
      notify(__`NG Settings were modified.\nNew filters take effect after next refresh.`),
    )
    rootFilterPanel.on('hidden', () => {
      clipboard.purge()
      rootFilterPanel = null
    })
    rootFilterPanel.open(anchorElement1)
  }
  function onNGSettingCommand({ target: target1 }) {
    togglePrefPanel(target1)
  }
  function addSettingsMenuItem() {
    if (!document.getElementById('filtertab')) {
      setTimeout(addSettingsMenuItem, 100)
      return
    }
    let prefListener1
    function onMutation1() {
      if (document.getElementById('feedly-ng-filter-setting')) return
      const nativeFilterItem1 = document.getElementById('filtertab')
      if (!nativeFilterItem1) return
      if (prefListener1) pref.off('change', prefListener1)
      const { tab: tab1, label: label1 } = $el`
      <div class="tab" contextmenu="${MenuCommand.contextmenu.parentNode.id}" @click="${onNGSettingCommand}" ref="tab">
        <div class="header target">
          <img class="icon" src="${GM_info.script.icon}" style="cursor: pointer;">
          <div class="label nonEmpty" id="feedly-ng-filter-setting" ref="label"></div>
        </div>
      </div>
    `
      label1.textContent = __`NG Setting`
      nativeFilterItem1.parentNode.insertBefore(tab1, nativeFilterItem1.nextSibling)
      document.body.appendChild(contextmenu.parentNode)
      prefListener1 = ({ key: key1 }) => {
        if (key1 === 'language') label1.textContent = __`NG Setting`
      }
      pref.on('change', prefListener1)
    }
    new MutationObserver(onMutation1).observe(document.getElementById('feedlyTabs'), {
      childList: true,
      subtree: true,
    })
    onMutation1()
  }
  async function openFilePicker(multiple1) {
    return new Promise(resolve1 => {
      const input1 = $el`<input type="file" @change="${() => resolve1(Array.from(input1.files))}">`.first
      input1.multiple = multiple1
      input1.click()
    })
  }
  async function notify(body1, options1) {
    options1 = {
      body: body1,
      ...notificationDefaults,
      ...options1,
    }
    return new Promise((resolve1, reject1) => {
      Notification.requestPermission(status1 => {
        if (status1 !== 'granted') {
          reject1(status1)
          return
        }
        const n1 = new Notification(options1.title, options1)
        if (options1.autoClose) setTimeout(() => n1.close(), options1.autoClose)
        resolve1(n1)
      })
    })
  }
})

parcelRequire('cG8Vr')
