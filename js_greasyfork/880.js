// ==UserScript==
// @name         Nico Nico Ranking NG
// @namespace    http://userscripts.org/users/121129
// @description  ニコニコ動画のランキングとキーワード・タグ検索結果に NG 機能を追加
// @match        *://www.nicovideo.jp/ranking*
// @match        *://www.nicovideo.jp/search/*
// @match        *://www.nicovideo.jp/tag/*
// @version      65
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_xmlhttpRequest
// @grant        GM_openInTab
// @grant        GM.getValue
// @grant        GM.setValue
// @grant        GM.xmlHttpRequest
// @grant        GM.openInTab
// @license      MIT License
// @noframes
// @run-at       document-start
// @connect      ext.nicovideo.jp
// @downloadURL https://update.greasyfork.org/scripts/880/Nico%20Nico%20Ranking%20NG.user.js
// @updateURL https://update.greasyfork.org/scripts/880/Nico%20Nico%20Ranking%20NG.meta.js
// ==/UserScript==


// https://d3js.org/d3-dsv/ Version 1.0.0. Copyright 2016 Mike Bostock.
;(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
  typeof define === 'function' && define.amd ? define(['exports'], factory) :
  (factory((global.d3 = global.d3 || {})));
}(this, function (exports) { 'use strict';

  function objectConverter(columns) {
    return new Function("d", "return {" + columns.map(function(name, i) {
      return JSON.stringify(name) + ": d[" + i + "]";
    }).join(",") + "}");
  }

  function customConverter(columns, f) {
    var object = objectConverter(columns);
    return function(row, i) {
      return f(object(row), i, columns);
    };
  }

  // Compute unique columns in order of discovery.
  function inferColumns(rows) {
    var columnSet = Object.create(null),
        columns = [];

    rows.forEach(function(row) {
      for (var column in row) {
        if (!(column in columnSet)) {
          columns.push(columnSet[column] = column);
        }
      }
    });

    return columns;
  }

  function dsv(delimiter) {
    var reFormat = new RegExp("[\"" + delimiter + "\n]"),
        delimiterCode = delimiter.charCodeAt(0);

    function parse(text, f) {
      var convert, columns, rows = parseRows(text, function(row, i) {
        if (convert) return convert(row, i - 1);
        columns = row, convert = f ? customConverter(row, f) : objectConverter(row);
      });
      rows.columns = columns;
      return rows;
    }

    function parseRows(text, f) {
      var EOL = {}, // sentinel value for end-of-line
          EOF = {}, // sentinel value for end-of-file
          rows = [], // output rows
          N = text.length,
          I = 0, // current character index
          n = 0, // the current line number
          t, // the current token
          eol; // is the current token followed by EOL?

      function token() {
        if (I >= N) return EOF; // special case: end of file
        if (eol) return eol = false, EOL; // special case: end of line

        // special case: quotes
        var j = I, c;
        if (text.charCodeAt(j) === 34) {
          var i = j;
          while (i++ < N) {
            if (text.charCodeAt(i) === 34) {
              if (text.charCodeAt(i + 1) !== 34) break;
              ++i;
            }
          }
          I = i + 2;
          c = text.charCodeAt(i + 1);
          if (c === 13) {
            eol = true;
            if (text.charCodeAt(i + 2) === 10) ++I;
          } else if (c === 10) {
            eol = true;
          }
          return text.slice(j + 1, i).replace(/""/g, "\"");
        }

        // common case: find next delimiter or newline
        while (I < N) {
          var k = 1;
          c = text.charCodeAt(I++);
          if (c === 10) eol = true; // \n
          else if (c === 13) { eol = true; if (text.charCodeAt(I) === 10) ++I, ++k; } // \r|\r\n
          else if (c !== delimiterCode) continue;
          return text.slice(j, I - k);
        }

        // special case: last token before EOF
        return text.slice(j);
      }

      while ((t = token()) !== EOF) {
        var a = [];
        while (t !== EOL && t !== EOF) {
          a.push(t);
          t = token();
        }
        if (f && (a = f(a, n++)) == null) continue;
        rows.push(a);
      }

      return rows;
    }

    function format(rows, columns) {
      if (columns == null) columns = inferColumns(rows);
      return [columns.map(formatValue).join(delimiter)].concat(rows.map(function(row) {
        return columns.map(function(column) {
          return formatValue(row[column]);
        }).join(delimiter);
      })).join("\n");
    }

    function formatRows(rows) {
      return rows.map(formatRow).join("\n");
    }

    function formatRow(row) {
      return row.map(formatValue).join(delimiter);
    }

    function formatValue(text) {
      return text == null ? ""
          : reFormat.test(text += "") ? "\"" + text.replace(/"/g, "\"\"") + "\""
          : text;
    }

    return {
      parse: parse,
      parseRows: parseRows,
      format: format,
      formatRows: formatRows
    };
  }

  var csv = dsv(",");

  var csvParse = csv.parse;
  var csvParseRows = csv.parseRows;
  var csvFormat = csv.format;
  var csvFormatRows = csv.formatRows;

  var tsv = dsv("\t");

  var tsvParse = tsv.parse;
  var tsvParseRows = tsv.parseRows;
  var tsvFormat = tsv.format;
  var tsvFormatRows = tsv.formatRows;

  exports.dsvFormat = dsv;
  exports.csvParse = csvParse;
  exports.csvParseRows = csvParseRows;
  exports.csvFormat = csvFormat;
  exports.csvFormatRows = csvFormatRows;
  exports.tsvParse = tsvParse;
  exports.tsvParseRows = tsvParseRows;
  exports.tsvFormat = tsvFormat;
  exports.tsvFormatRows = tsvFormatRows;

  Object.defineProperty(exports, '__esModule', { value: true });

}));

;(function() {
  'use strict'

  var createObject = function(prototype, properties) {
    var descriptors = function() {
      return Object.keys(properties).reduce(function(descriptors, key) {
        descriptors[key] = Object.getOwnPropertyDescriptor(properties, key)
        return descriptors
      }, {})
    }
    return Object.defineProperties(Object.create(prototype), descriptors())
  }
  var set = function(target, propertyName) {
    return function(value) { target[propertyName] = value }
  }
  var movieIdOf = function(absoluteMovieURL) {
    return new URL(absoluteMovieURL).pathname.slice('/watch/'.length)
  }
  const ancestor = (child, selector) => {
    for (let n = child.parentNode; n; n = n.parentNode)
      if (n.matches(selector))
        return n
    return null
  }

  var EventEmitter = (function() {
    var EventEmitter = function() {
      this._eventNameToListeners = new Map()
    }
    EventEmitter.prototype = {
      on(eventName, listener) {
        var m = this._eventNameToListeners
        var v = m.get(eventName)
        if (v) {
          v.add(listener)
        } else {
          m.set(eventName, new Set([listener]))
        }
        return this
      },
      emit(eventName) {
        var m = this._eventNameToListeners
        var args = Array.from(arguments).slice(1)
        for (var l of m.get(eventName) || []) l(...args)
      },
      off(eventName, listener) {
        var v = this._eventNameToListeners.get(eventName)
        if (v) v.delete(listener)
      },
    }
    return EventEmitter
  })()

  var Listeners = (function() {
    var Listeners = function(eventNameToListener) {
      this.eventNameToListener = eventNameToListener
      this.eventEmitter = null
    }
    Listeners.prototype = {
      bind(eventEmitter) {
        this.eventEmitter = eventEmitter
        Object.keys(this.eventNameToListener).forEach(function(k) {
          eventEmitter.on(k, this.eventNameToListener[k])
        }, this)
      },
      unbind() {
        if (!this.eventEmitter) return
        Object.keys(this.eventNameToListener).forEach(function(k) {
          this.eventEmitter.off(k, this.eventNameToListener[k])
        }, this)
      },
    }
    return Listeners
  })()

  var ArrayStore = (function(_super) {
    var isObject = function(v) {
      return v === Object(v)
    }
    var valueIfObj = function(v) {
      return isObject(v) ? v.value : v
    }
    var toUpperCase = function(s) {
      return s.toUpperCase()
    }
    var ArrayStore = function(getValue, setValue, key, caseInsensitive) {
      _super.call(this)
      this.getValue = getValue
      this.setValue = setValue
      this.key = key
      this.caseInsensitive = Boolean(caseInsensitive)
      this._arrayWithText = []
    }
    ArrayStore.prototype = createObject(_super.prototype, {
      get array() {
        return this.arrayWithText.map(valueIfObj)
      },
      get arrayWithText() {
        return this._arrayWithText
      },
      _setOf(values) {
        return new Set(this.caseInsensitive ? values.map(toUpperCase) : values)
      },
      get set() {
        return this._setOf(this.array)
      },
      _toUpperCaseIfRequired(value) {
        return this.caseInsensitive ? value.toUpperCase() : value
      },
      _concat(value, text) {
        return this.arrayWithText.concat(text ? {value, text} : value)
      },
      add(value, text) {
        if (this.set.has(this._toUpperCaseIfRequired(value))) return false
        this.arrayWithText.push(text ? {value, text} : value)
        this.setValue(this.key, JSON.stringify(this.arrayWithText))
        this.emit('changed', this.set)
        return true
      },
      async addAsync(value, text) {
        await this.sync()
        return this.add(value, text)
      },
      addAll(values) {
        if (values.length === 0) return
        var oldVals = this.arrayWithText
        var set = this._setOf(oldVals.map(valueIfObj))
        var filtered = values.filter(function(v) {
          return !set.has(this._toUpperCaseIfRequired(valueIfObj(v)))
        }, this)
        if (filtered.length === 0) return
        this.arrayWithText.push(...filtered)
        this.setValue(this.key, JSON.stringify(this.arrayWithText))
        this.emit('changed', this.set)
      },
      _reject(values) {
        var valueSet = this._setOf(values)
        return this.arrayWithText.filter(function(v) {
          return !valueSet.has(this._toUpperCaseIfRequired(valueIfObj(v)))
        }, this)
      },
      remove(values) {
        const oldVals = this.arrayWithText
        const newVals = this._reject(values)
        if (oldVals.length === newVals.length) return
        this._arrayWithText = newVals
        this.setValue(this.key, JSON.stringify(newVals))
        this.emit('changed', this.set)
      },
      async removeAsync(values) {
        await this.sync()
        this.remove(values)
      },
      clear() {
        if (!this.arrayWithText.length) return
        this._arrayWithText = []
        this.setValue(this.key, '[]')
        this.emit('changed', new Set())
      },
      async sync() {
        this._arrayWithText = JSON.parse(await this.getValue(this.key, '[]'))
      },
    })
    return ArrayStore
  })(EventEmitter)

  var Store = (function(_super) {
    var Store = function(getValue, setValue, key, defaultValue) {
      _super.call(this)
      this.getValue = getValue
      this.setValue = setValue
      this.key = key
      this._value = this.defaultValue = defaultValue
    }
    Store.prototype = createObject(_super.prototype, {
      get value() {
        return this._value
      },
      set value(value) {
        if (this._value === value) return
        this._value = value
        this.setValue(this.key, value)
        this.emit('changed', value)
      },
      async sync() {
        this._value = await this.getValue(this.key, this.defaultValue)
      }
    })
    return Store
  })(EventEmitter)

  var Config = (function() {
    var ngMovieVisibleStore = function() {
      var value
      var getValue = function(_, defval) {
        return value === undefined ? defval : value
      }
      var setValue = function(_, v) { value = v }
      return new Store(getValue, setValue, 'ngMovieVisible', false)
    }
    var csv = (function() {
      var RECORD_LENGTH = 3
      var TYPE = 0
      var VALUE = 1
      var TEXT = 2
      var isObject = function(v) {
        return v === Object(v)
      }
      var csvToArray = function(csv) {
        /*
          パース対象の文字列最後の文字がカンマのとき、
          そのカンマが空のフィールドとしてパースされない。
          \n を追加して対処する。
        */
        return d3.csvParseRows(csv + '\n')
      }
      var createRecord = function(type, value, text) {
        var result = []
        result[TYPE] = type
        result[VALUE] = value
        result[TEXT] = text
        return result
      }
      var trimFields = function(record) {
        var r = record
        return createRecord(r[TYPE].trim(), r[VALUE].trim(), r[TEXT].trim())
      }
      var isIntValueType = function(type) {
        return ['ngUserId', 'ngChannelId'].indexOf(type) >= 0
      }
      var hasValidValue = function(record) {
        var v = record[VALUE]
        return v.length !== 0
            && !(isIntValueType(record[TYPE]) && Number.isNaN(Math.trunc(v)))
      }
      var valueToIntIfIntValueType = function(record) {
        var r = record
        return isIntValueType(r[TYPE])
             ? createRecord(r[TYPE], Math.trunc(r[VALUE]), r[TEXT])
             : r
      }
      var records = function(csv) {
        return csvToArray(csv)
          .filter(function(record) { return record.length === RECORD_LENGTH })
          .map(trimFields)
          .filter(hasValidValue)
          .map(valueToIntIfIntValueType)
      }
      var isValueOnlyType = function(type) {
        return ['ngTitle', 'ngTag', 'ngUserName'].indexOf(type) >= 0
      }
      var getValue = function(record) {
        var value = record[VALUE]
        if (isValueOnlyType(record[TYPE])) return value
        var text = record[TEXT]
        return text ? {value, text} : value
      }
      var createTypeToValuesMap = function() {
        return new Map([
          ['ngMovieId', []],
          ['ngTitle', []],
          ['ngTag', []],
          ['ngUserId', []],
          ['ngUserName', []],
          ['ngChannelId', []],
          ['visitedMovieId', []],
        ])
      }
      return {
        create(arrayStore, type) {
          return d3.csvFormatRows(arrayStore.arrayWithText.map(function(value) {
            return isObject(value)
                 ? createRecord(type, value.value, value.text)
                 : createRecord(type, value, '')
          }))
        },
        parse(csv) {
          var result = createTypeToValuesMap()
          for (var r of records(csv)) {
            var values = result.get(r[TYPE])
            if (values) values.push(getValue(r))
          }
          return result
        },
      }
    })()

    var Config = function(getValue, setValue) {
      var store = function(key, defaultValue) {
        return new Store(getValue, setValue, key, defaultValue)
      }
      var arrayStore = function(key, caseInsensitive) {
        return new ArrayStore(getValue, setValue, key, caseInsensitive)
      }
      this.visitedMovieViewMode = store('visitedMovieViewMode', 'reduce')
      this.visibleContributorType = store('visibleContributorType', 'all')
      this.openNewWindow = store('openNewWindow', true)
      this.useGetThumbInfo = store('useGetThumbInfo', true)
      this.movieInfoTogglable = store('movieInfoTogglable', true)
      this.descriptionTogglable = store('descriptionTogglable', true)
      this.visitedMovies = arrayStore('visitedMovies')
      this.ngMovies = arrayStore('ngMovies')
      this.ngTitles = arrayStore('ngTitles', true)
      this.ngTags = arrayStore('ngTags', true)
      this.ngLockedTags = arrayStore('ngLockedTags', true)
      this.ngUserIds = arrayStore('ngUserIds')
      this.ngUserNames = arrayStore('ngUserNames', true)
      this.ngChannelIds = arrayStore('ngChannelIds')
      this.ngMovieVisible = ngMovieVisibleStore()
      this.addToNgLockedTags = store('addToNgLockedTags', false);
    }
    Config.prototype.sync = function() {
      return Promise.all([
        this.visitedMovieViewMode.sync(),
        this.visibleContributorType.sync(),
        this.openNewWindow.sync(),
        this.useGetThumbInfo.sync(),
        this.movieInfoTogglable.sync(),
        this.descriptionTogglable.sync(),
        this.visitedMovies.sync(),
        this.ngMovies.sync(),
        this.ngTitles.sync(),
        this.ngTags.sync(),
        this.ngLockedTags.sync(),
        this.ngUserIds.sync(),
        this.ngUserNames.sync(),
        this.ngChannelIds.sync(),
        this.addToNgLockedTags.sync(),
      ])
    }
    Config.prototype.toCSV = async function(targetTypes) {
      await this.sync()
      var csvTexts = []
      if (targetTypes['ngMovieId']) {
        csvTexts.push(csv.create(this.ngMovies, 'ngMovieId'))
      }
      if (targetTypes['ngTitle']) {
        csvTexts.push(csv.create(this.ngTitles, 'ngTitle'))
      }
      if (targetTypes['ngTag']) {
        csvTexts.push(csv.create(this.ngTags, 'ngTag'))
      }
      if (targetTypes['ngUserId']) {
        csvTexts.push(csv.create(this.ngUserIds, 'ngUserId'))
      }
      if (targetTypes['ngUserName']) {
        csvTexts.push(csv.create(this.ngUserNames, 'ngUserName'))
      }
      if (targetTypes['ngChannelId']) {
        csvTexts.push(csv.create(this.ngChannelIds, 'ngChannelId'))
      }
      if (targetTypes['visitedMovieId']) {
        csvTexts.push(csv.create(this.visitedMovies, 'visitedMovieId'))
      }
      return csvTexts.filter(Boolean).join('\n')
    }
    Config.prototype.addFromCSV = async function(csvText) {
      await this.sync()
      var map = csv.parse(csvText)
      this.ngMovies.addAll(map.get('ngMovieId'))
      this.ngTitles.addAll(map.get('ngTitle'))
      this.ngTags.addAll(map.get('ngTag'))
      this.ngUserIds.addAll(map.get('ngUserId'))
      this.ngUserNames.addAll(map.get('ngUserName'))
      this.ngChannelIds.addAll(map.get('ngChannelId'))
      this.visitedMovies.addAll(map.get('visitedMovieId'))
    }
    return Config
  })()

  var ThumbInfo = (function(_super) {
    const parseTags = tags => {
      return Array.from(tags, tag => {
        return {
          name: tag.textContent,
          lock: tag.getAttribute('lock') === '1',
        };
      });
    };
    var contributor = function(rootElem, type, id, name) {
      return {
        type: type,
        id: parseInt(rootElem.querySelector(id).textContent),
        name: rootElem.querySelector(name)?.textContent ?? '',
      }
    }
    var user = function(rootElem) {
      return contributor(rootElem
                       , 'user'
                       , 'thumb > user_id'
                       , 'thumb > user_nickname')
    }
    var channel = function(rootElem) {
      return contributor(rootElem
                       , 'channel'
                       , 'thumb > ch_id'
                       , 'thumb > ch_name')
    }
    var parseContributor = function(rootElem) {
      const userId = rootElem.querySelector('thumb > user_id');
      if (userId) return user(rootElem);
      const chId = rootElem.querySelector('thumb > ch_id');
      if (chId) return channel(rootElem);
      return {type: 'unknown', id: -1, name: ''};
    }
    var parseThumbInfo = function(rootElem) {
      return {
        description: rootElem.querySelector('thumb > description').textContent,
        tags: parseTags(rootElem.querySelectorAll('thumb > tags > tag')),
        contributor: parseContributor(rootElem),
        title: rootElem.querySelector('thumb > title').textContent,
        error: {type: 'NO_ERROR', message: 'no error'},
      }
    }
    var error = function(type, message, id) {
      var result = {error: {type, message}}
      if (id) result.id = id
      return result
    }
    var parseError = function(rootElem) {
      var type = rootElem.querySelector('error > code').textContent
      switch (type) {
        case 'DELETED': return error(type, '削除された動画')
        case 'NOT_FOUND': return error(type, '見つからない、または無効な動画')
        case 'COMMUNITY': return error(type, 'コミュニティ限定動画')
        default: return error(type, 'エラーコード: ' + type)
      }
    }
    var parseResText = function(resText) {
      try {
        var d = new DOMParser().parseFromString(resText, 'application/xml')
        var r = d.documentElement
        var status = r.getAttribute('status')
        switch (status) {
          case 'ok': return parseThumbInfo(r)
          case 'fail': return parseError(r)
          default: return error(status, 'ステータス: ' + status)
        }
      } catch (e) {
        return error('PARSING', 'パースエラー')
      }
    }
    var statusMessage = function(res) {
      return res.status + ' ' + res.statusText
    }

    var ThumbInfo = function(httpRequest, concurrent) {
      _super.call(this)
      this.httpRequest = httpRequest
      this.concurrent = concurrent || 5
      this._requestCount = 0
      this._pendingIds = []
      this._requestedIds = new Set()
    }
    ThumbInfo.prototype = createObject(_super.prototype, {
      _onerror(id) {
        this._requestCount--
        this._requestNextMovie()
        this.emit('errorOccurred', error('ERROR', 'エラー', id))
      },
      _ontimeout(id, retried) {
        if (retried) {
          this._requestCount--
          this._requestNextMovie()
          this.emit('errorOccurred', error('TIMEOUT', 'タイムアウト', id))
        } else {
          this._requestMovie(id, true)
        }
      },
      _onload(id, res) {
        this._requestCount--
        this._requestNextMovie()
        if (res.status === 200) {
          var thumbInfo = parseResText(res.responseText)
          thumbInfo.id = id
          if (thumbInfo.error.type === 'NO_ERROR') {
            this.emit('completed', thumbInfo)
          } else {
            this.emit('errorOccurred', thumbInfo)
          }
        } else {
          this.emit('errorOccurred'
                  , error('HTTP_STATUS', statusMessage(res), id))
        }
      },
      _requestMovie(id, retry) {
        this.httpRequest({
          method: 'GET',
          url: 'https://ext.nicovideo.jp/api/getthumbinfo/' + id,
          timeout: 5000,
          onload: this._onload.bind(this, id),
          onerror: this._onerror.bind(this, id),
          ontimeout: this._ontimeout.bind(this, id, retry),
        })
      },
      _requestNextMovie() {
        var id = this._pendingIds.shift()
        if (!id) return
        this._requestMovie(id)
        this._requestCount++
      },
      _getNewIds(ids) {
        ids = ids || []
        var m = this._requestedIds
        return [...new Set(ids)].filter(function(id) { return !m.has(id) })
      },
      _requestAsPossible() {
        var space = this.concurrent - this._requestCount
        var c = Math.min(this._pendingIds.length, space)
        for (var i = 0; i < c; i++) this._requestNextMovie()
      },
      request(ids, prefer) {
        const newIds = this._getNewIds(ids)
        for (const id of newIds) this._requestedIds.add(id)
        if (prefer) {
          this._pendingIds.unshift(...newIds);
        } else {
          this._pendingIds.push(...newIds);
        }
        this._requestAsPossible()
        return this
      },
    })
    return ThumbInfo
  })(EventEmitter)

  var Tag = (function(_super) {
    var Tag = function(thumbInfoTabObj) {
      _super.call(this);
      this.name = thumbInfoTabObj.name;
      this.lock = thumbInfoTabObj.lock;
      this.ngByNormal = false;
      this.ngByLock = false;
    }
    Tag.prototype = createObject(_super.prototype, {
      get ng() {
        return this.ngByNormal || this.ngByLock;
      },
      updateNg(upperCaseNgTagNameSet) {
        var pre = this.ng
        this.ngByNormal = upperCaseNgTagNameSet.has(this.name.toUpperCase())
        if (pre !== this.ng) this.emit('ngChanged', this.ng)
      },
      updateNgIfLocked(upperCaseNgTagNameSet) {
        if (!this.lock) return;
        const pre = this.ng;
        this.ngByLock = upperCaseNgTagNameSet.has(this.name.toUpperCase());
        if (pre !== this.ng) this.emit('ngChanged', this.ng);
      },
    })
    return Tag
  })(EventEmitter)

  var Contributor = (function(_super) {
    var Contributor = function(type, id, name) {
      _super.call(this)
      this.type = type
      this.id = id
      this.name = name
      this.ng = false
      this.ngId = false
      this.ngName = ''
    }
    Contributor.prototype = createObject(_super.prototype, {
      _updateNg() {
        var pre = this.ng
        this.ng = this.ngId || Boolean(this.ngName)
        if (pre !== this.ng) this.emit('ngChanged', this.ng)
      },
      updateNgId(ngIdSet) {
        var pre = this.ngId
        this.ngId = ngIdSet.has(this.id)
        if (pre !== this.ngId) this.emit('ngIdChanged', this.ngId)
        this._updateNg()
      },
      _getNewNgName(upperCaseNgNameSet) {
        var n = this.name.toUpperCase()
        for (var ngName of upperCaseNgNameSet)
          if (n.includes(ngName)) return ngName
        return ''
      },
      updateNgName(upperCaseNgNameSet) {
        var pre = this.ngName
        this.ngName = this._getNewNgName(upperCaseNgNameSet)
        if (pre !== this.ngName) this.emit('ngNameChanged', this.ngName)
        this._updateNg()
      },
      get url() {
        throw new Error('must be implemented')
      },
      bindToConfig(config) {
        this.updateNgId(config[this.ngIdStoreName].set)
        config[this.ngIdStoreName].on('changed', this.updateNgId.bind(this))
      },
    })

    var User = function(id, name) {
      Contributor.call(this, 'user', id, name)
    }
    User.prototype = createObject(Contributor.prototype, {
      get ngIdStoreName() { return 'ngUserIds' },
      get url() {
        return 'https://www.nicovideo.jp/user/' + this.id
      },
      bindToConfig(config) {
        Contributor.prototype.bindToConfig.call(this, config)
        this.updateNgName(config.ngUserNames.set)
        config.ngUserNames.on('changed', this.updateNgName.bind(this))
      },
    })

    var Channel = function(id, name) {
      Contributor.call(this, 'channel', id, name)
    }
    Channel.prototype = createObject(Contributor.prototype, {
      get ngIdStoreName() { return 'ngChannelIds' },
      get url() {
        return 'https://ch.nicovideo.jp/channel/ch' + this.id
      },
    })

    Object.assign(Contributor, {
      NULL: new Contributor('unknown', -1, ''),
      TYPES: ['user', 'channel'],
      new(type, id, name) {
        switch (type) {
          case 'user': return new User(id, name)
          case 'channel': return new Channel(id, name)
          case 'unknown': return Contributor.NULL
          default: throw new Error(type)
        }
      },
    })
    return Contributor
  })(EventEmitter)

  var Movie = (function(_super) {
    var Movie = function(id, title) {
      _super.call(this)
      this.id = id
      this.title = title
      this.ngTitle = ''
      this.ngId = false
      this.visited = false
      this._tags = []
      this._contributor = Contributor.NULL
      this._description = ''
      this._error = Movie.NO_ERROR
      this._thumbInfoDone = false
      this._ng = false
    }
    Movie.NO_ERROR = {type: 'NO_ERROR', message: 'no error'}
    Movie.prototype = createObject(_super.prototype, {
      _matchedNgTitle(upperCaseNgTitleSet) {
        var t = this.title.toUpperCase()
        for (var ng of upperCaseNgTitleSet) {
          if (t.includes(ng)) return ng
        }
        return ''
      },
      updateNgTitle(upperCaseNgTitleSet) {
        var pre = this.ngTitle
        this.ngTitle = this._matchedNgTitle(upperCaseNgTitleSet)
        if (pre === this.ngTitle) return
        this.emit('ngTitleChanged', this.ngTitle)
        this._updateNg()
      },
      updateNgId(ngIdSet) {
        var pre = this.ngId
        this.ngId = ngIdSet.has(this.id)
        if (pre === this.ngId) return
        this.emit('ngIdChanged', this.ngId)
        this._updateNg()
      },
      updateVisited(visitedIdSet) {
        var pre = this.visited
        this.visited = visitedIdSet.has(this.id)
        if (pre !== this.visited) this.emit('visitedChanged', this.visited)
      },
      get description() { return this._description },
      set description(description) {
        this._description = description
        this.emit('descriptionChanged', this._description)
      },
      get tags() { return this._tags },
      set tags(tags) {
        this._tags = tags
        this.emit('tagsChanged', this._tags)
        this._updateNg()
        var update = this._updateNg.bind(this)
        for (var t of this._tags) t.on('ngChanged', update)
      },
      get contributor() { return this._contributor },
      set contributor(contributor) {
        this._contributor = contributor
        this.emit('contributorChanged', this._contributor)
        this._updateNg()
        this._contributor.on('ngChanged', this._updateNg.bind(this))
      },
      get error() { return this._error },
      set error(error) {
        this._error = error
        this.emit('errorChanged', this._error)
      },
      get thumbInfoDone() { return this._thumbInfoDone },
      setThumbInfoDone() {
        this._thumbInfoDone = true
        this.emit('thumbInfoDone')
      },
      get ng() { return this._ng },
      _updateNg() {
        var pre = this._ng
        this._ng = this.ngId
          || Boolean(this.ngTitle)
          || this.contributor.ng
          || this.tags.some(function(t) { return t.ng })
        if (pre !== this._ng) this.emit('ngChanged', this._ng)
      },
      addListenerToConfig(config) {
        config.ngMovies.on('changed', this.updateNgId.bind(this))
        config.ngTitles.on('changed', this.updateNgTitle.bind(this))
        config.visitedMovies.on('changed', this.updateVisited.bind(this))
      },
    })
    return Movie
  })(EventEmitter)

  var Movies = (function() {
    var Movies = function(config) {
      this.config = config
      this._idToMovie = new Map()
    }
    Movies.prototype = {
      setIfAbsent(movies) {
        var ngIds = this.config.ngMovies.set
        var ngTitles = this.config.ngTitles.set
        var visitedIds = this.config.visitedMovies.set
        var map = this._idToMovie
        for (var m of movies) {
          if (map.has(m.id)) continue
          map.set(m.id, m)
          m.updateNgId(ngIds)
          m.updateNgTitle(ngTitles)
          m.updateVisited(visitedIds)
          m.addListenerToConfig(this.config)
        }
      },
      get(movieId) {
        return this._idToMovie.get(movieId)
      },
    }
    return Movies
  })()

  var ThumbInfoListener = (function() {
    var createTagBuilder = function(config) {
      var map = new Map()
      return thumbInfoTag => {
        let a;
        const i = thumbInfoTag.lock ? 1 : 0;
        if (map.has(thumbInfoTag.name)) {
          a = map.get(thumbInfoTag.name);
          if (a[i]) return a[i];
        } else {
          a = [null, null];
        }
        const tag = new Tag(thumbInfoTag);
        a[i] = tag;
        map.set(thumbInfoTag.name, a);
        config.ngTags.on('changed', tagNameSet => tag.updateNg(tagNameSet));
        config.ngLockedTags.on('changed', tagNameSet => tag.updateNgIfLocked(tagNameSet));
        return tag;
      };
    }
    var createTagsBuilder = function(config) {
      var getTagBy = createTagBuilder(config)
      return thumbInfoTags => {
        const tags = thumbInfoTags.map(getTagBy);
        const ngTagSet = config.ngTags.set;
        const ngLockedTagSet = config.ngLockedTags.set;
        for (const t of tags) {
          t.updateNg(ngTagSet);
          t.updateNgIfLocked(ngLockedTagSet);
        }
        return tags;
      };
    }
    var createContributorBuilder = function(config) {
      var typeToMap = Contributor.TYPES.reduce(function(map, type) {
        return map.set(type, new Map())
      }, new Map())
      return function(o) {
        if (o.type === 'unknown') return Contributor.NULL;
        var map = typeToMap.get(o.type)
        if (map.has(o.id)) return map.get(o.id)
        var contributor = Contributor.new(o.type, o.id, o.name)
        map.set(o.id, contributor)
        contributor.bindToConfig(config)
        return contributor
      }
    }
    return {
      forCompleted(movies) {
        var getTagsBy = createTagsBuilder(movies.config)
        var getContributorBy = createContributorBuilder(movies.config)
        return function(thumbInfo) {
          var m = movies.get(thumbInfo.id)
          m.description = thumbInfo.description
          m.tags = getTagsBy(thumbInfo.tags)
          m.contributor = getContributorBy(thumbInfo.contributor)
          m.setThumbInfoDone()
        }
      },
      forErrorOccurred(movies) {
        return function(thumbInfo) {
          var m = movies.get(thumbInfo.id)
          m.error = thumbInfo.error
          m.setThumbInfoDone()
        }
      },
    }
  })()

  var MovieViewMode = (function(_super) {
    var MovieViewMode = function(movie, config) {
      _super.call(this)
      this.movie = movie
      this.config = config
      this.value = this._newViewMode()
    }
    MovieViewMode.prototype = createObject(_super.prototype, {
      _isHiddenByNg() {
        return !this.config.ngMovieVisible.value && this.movie.ng
      },
      _isHiddenByContributorType() {
        var c = this.movie.contributor
        if (c === Contributor.NULL) return false
        var t = this.config.visibleContributorType.value
        return !(t === 'all' || t === c.type)
      },
      _isHiddenByVisitedMovieViewMode() {
        return this.movie.visited
            && this.config.visitedMovieViewMode.value === 'hide'
      },
      _isHidden() {
        return this.movie.error.type === 'DELETED'
            || this._isHiddenByContributorType()
            || this._isHiddenByNg()
            || this._isHiddenByVisitedMovieViewMode()
      },
      _isReduced() {
        return this.movie.visited
            && this.config.visitedMovieViewMode.value === 'reduce'
      },
      _newViewMode() {
        if (this._isHidden()) return 'hide'
        if (this._isReduced()) return 'reduce'
        return 'doNothing'
      },
      update() {
        var pre = this.value
        this.value = this._newViewMode()
        if (pre !== this.value) this.emit('changed', this.value)
      },
      addListener() {
        var l = this.update.bind(this)
        this.movie
          .on('errorChanged', l)
          .on('ngChanged', l)
          .on('visitedChanged', l)
          .on('contributorChanged', l)
        ;['ngMovieVisible',
          'visibleContributorType',
          'visitedMovieViewMode',
        ].forEach(function(n) {
          this.config[n].on('changed', l)
        }, this)
        return this
      },
    })
    return MovieViewMode
  })(EventEmitter)

  var MovieViewModes = (function(_super) {
    var MovieViewModes = function(config) {
      _super.call(this)
      this.config = config
      this._movieToViewMode = new Map()
      this._emitViewModeChanged = this.emit.bind(this, 'movieViewModeChanged')
    }
    MovieViewModes.prototype = createObject(_super.prototype, {
      get(movie) {
        var m = this._movieToViewMode
        if (m.has(movie)) return m.get(movie)
        var viewMode = new MovieViewMode(movie, this.config)
        m.set(movie, viewMode)
        return viewMode.on('changed', this._emitViewModeChanged).addListener()
      },
      sort() {
        return [...this._movieToViewMode.values()].map(function(m, i) {
          return {i, m}
        }).sort(function(a, b) {
          if (a.m.value === 'hide' && b.m.value !== 'hide') return 1
          if (a.m.value !== 'hide' && b.m.value === 'hide') return -1
          return a.i - b.i
        }).map(function(o) {
          return o.m
        })
      },
    })
    return MovieViewModes
  })(EventEmitter)

  var ConfigDialog = (function(_super) {
    var isValidStr = function(s) {
      return typeof s === 'string' && Boolean(s.trim().length)
    }
    var isPositiveInt = function(n) {
      return Number.isSafeInteger(n) && n > 0
    }
    var initCheckbox = function(config, doc, name) {
      var b = doc.getElementById(name)
      b.checked = config[name].value
      b.addEventListener('change', function() {
        config[name].value = b.checked
      })
    }
    var optionOf = function(v) {
      return typeof v === 'object'
           ? new Option(v.value + ',' + v.text, v.value)
           : new Option(v, v)
    }
    var diffBy = function(target) {
      var SOMETHING_INPUT_TEXT = '何か入力して下さい。'
      var POSITIVE_INT_INPUT_TEXT = '1以上の整数を入力して下さい。'
      var movieUrlOf = function(movieId) {
        return 'https://www.nicovideo.jp/watch/' + movieId
      }
      return {
        'ng-movie-id': {
          targetText: 'NG動画ID',
          storeName: 'ngMovies',
          convert(v) { return v },
          isValid: isValidStr,
          inputRequestText: SOMETHING_INPUT_TEXT,
          urlOf: movieUrlOf,
        },
        'ng-title': {
          targetText: 'NGタイトル',
          storeName: 'ngTitles',
          convert(v) { return v },
          isValid: isValidStr,
          inputRequestText: SOMETHING_INPUT_TEXT,
          urlOf(title) { return 'https://www.nicovideo.jp/search/' + title },
        },
        'ng-tag': {
          targetText: 'NGタグ',
          storeName: 'ngTags',
          convert(v) { return v },
          isValid: isValidStr,
          inputRequestText: SOMETHING_INPUT_TEXT,
          urlOf(tag) { return 'https://www.nicovideo.jp/tag/' + tag },
        },
        'ng-locked-tag': {
          targetText: 'NGタグ(ロック)',
          storeName: 'ngLockedTags',
          convert(v) { return v },
          isValid: isValidStr,
          inputRequestText: SOMETHING_INPUT_TEXT,
          urlOf(tag) { return 'https://www.nicovideo.jp/tag/' + tag },
        },
        'ng-user-id': {
          targetText: 'NGユーザーID',
          storeName: 'ngUserIds',
          convert: Math.trunc,
          isValid(v) { return isPositiveInt(Math.trunc(v)) },
          inputRequestText: POSITIVE_INT_INPUT_TEXT,
          urlOf(userId) { return 'https://www.nicovideo.jp/user/' + userId },
        },
        'ng-user-name': {
          targetText: 'NGユーザー名',
          storeName: 'ngUserNames',
          convert(v) { return v },
          isValid: isValidStr,
          inputRequestText: SOMETHING_INPUT_TEXT,
          urlOf(userName) { return 'https://www.nicovideo.jp/search/' + userName },
        },
        'ng-channel-id': {
          targetText: 'NGチャンネルID',
          storeName: 'ngChannelIds',
          convert: Math.trunc,
          isValid(v) { return isPositiveInt(Math.trunc(v)) },
          inputRequestText: POSITIVE_INT_INPUT_TEXT,
          urlOf(channelId) { return 'https://ch.nicovideo.jp/ch' + channelId },
        },
        'visited-movie-id': {
          targetText: '閲覧済み動画ID',
          storeName: 'visitedMovies',
          convert(v) { return v },
          isValid: isValidStr,
          inputRequestText: SOMETHING_INPUT_TEXT,
          urlOf: movieUrlOf,
        },
      }[target]
    }
    var promptFor = async function(target, config, defaultValue) {
      var d = diffBy(target)
      var r = ''
      do {
        var msg = r ? `"${r}"は登録済みです。\n` : ''
        r = window.prompt(msg + d.targetText, r || defaultValue || '')
        if (r === null) return ''
        while (!d.isValid(r)) {
          r = window.prompt(d.inputRequestText + '\n' + d.targetText)
          if (r === null) return ''
        }
      } while (!(await config[d.storeName].addAsync(d.convert(r))))
      return r
    }

    var ConfigDialog = function(config, doc, openInTab) {
      _super.call(this)
      this.config = config
      this.doc = doc
      this.openInTab = openInTab
      for (var v of config.ngTitles.array) {
        this._e('list').add(new Option(v, v))
      }
      this._e('removeAllButton').disabled = !config.ngTitles.array.length
      initCheckbox(config, doc, 'openNewWindow')
      initCheckbox(config, doc, 'useGetThumbInfo')
      initCheckbox(config, doc, 'movieInfoTogglable')
      initCheckbox(config, doc, 'descriptionTogglable')
      initCheckbox(config, doc, 'addToNgLockedTags')
      this._on('target', 'change', this._targetChanged.bind(this))
      this._on('addButton', 'click', this._addButtonClicked.bind(this))
      this._on('removeButton', 'click', this._removeButtonClicked.bind(this))
      this._on('removeAllButton', 'click', this._removeAllButtonClicked.bind(this))
      this._on('openButton', 'click', this._openButtonClicked.bind(this))
      this._on('closeButton', 'click', this.emit.bind(this, 'closed'))
      this._on('exportVisibleCheckbox', 'change', this._exportVisibleCheckboxChanged.bind(this))
      this._on('importVisibleCheckbox', 'change', this._importVisibleCheckboxChanged.bind(this))
      this._on('exportButton', 'click', this._exportButtonClicked.bind(this))
      this._on('importButton', 'click', this._importButtonClicked.bind(this))
      var updateButtonsDisabled = this._updateButtonsDisabled.bind(this)
      this._on('target', 'change', updateButtonsDisabled)
      this._on('list', 'change', updateButtonsDisabled)
      this._on('addButton', 'click', updateButtonsDisabled)
      this._on('removeButton', 'click', updateButtonsDisabled)
      this._on('removeAllButton', 'click', updateButtonsDisabled)
    }
    ConfigDialog.prototype = createObject(_super.prototype, {
      _e(id) { return this.doc.getElementById(id) },
      _on(id, eventName, listener) {
        this._e(id).addEventListener(eventName, listener)
      },
      _diffBySelectedTarget() {
        return diffBy(this._e('target').value)
      },
      _updateList() {
        for (var o of Array.from(this._e('list').options)) o.remove()
        var d = this._diffBySelectedTarget()
        for (var val of this.config[d.storeName].arrayWithText) {
          this._e('list').add(optionOf(val))
        }
      },
      _targetChanged() {
        this._updateList()
      },
      _updateButtonsDisabled() {
        var l = this._e('list')
        var d = l.selectedIndex === -1
        this._e('removeButton').disabled = d
        this._e('openButton').disabled = d
        this._e('removeAllButton').disabled = !l.length
      },
      async _addButtonClicked() {
        var r = await promptFor(this._e('target').value, this.config)
        if (r) this._e('list').add(new Option(r, r))
      },
      async _removeButtonClicked() {
        var opts = Array.from(this._e('list').selectedOptions)
        var d = this._diffBySelectedTarget()
        await this.config[d.storeName]
          .removeAsync(opts.map(function(o) { return d.convert(o.value) }))
        for (var o of opts) o.remove()
      },
      _removeAllButtonClicked() {
        var d = this._diffBySelectedTarget()
        if (!window.confirm(`すべての"${d.targetText}"を削除しますか？`)) return
        this.config[d.storeName].clear()
        for (var o of Array.from(this._e('list').options)) o.remove()
      },
      _openButtonClicked() {
        var opts = Array.from(this._e('list').selectedOptions)
        var d = this._diffBySelectedTarget()
        for (var v of opts.map(function(o) { return o.value })) {
          this.openInTab(d.urlOf(v))
        }
      },
      _exportVisibleCheckboxChanged() {
        var n = this._e('exportVisibleCheckbox').checked ? 'remove' : 'add'
        this._e('exportContainer').classList[n]('isHidden')
      },
      _importVisibleCheckboxChanged() {
        var n = this._e('importVisibleCheckbox').checked ? 'remove' : 'add'
        this._e('importContainer').classList[n]('isHidden')
      },
      async _exportButtonClicked() {
        var textarea = this._e('exportTextarea')
        textarea.value = await this.config.toCSV({
          ngMovieId: this._e('exportNgMovieIdCheckbox').checked,
          ngTitle: this._e('exportNgTitleCheckbox').checked,
          ngTag: this._e('exportNgTagCheckbox').checked,
          ngUserId: this._e('exportNgUserIdCheckbox').checked,
          ngUserName: this._e('exportNgUserNameCheckbox').checked,
          ngChannelId: this._e('exportNgChannelIdCheckbox').checked,
          visitedMovieId: this._e('exportVisitedMovieIdCheckbox').checked,
        })
        textarea.focus()
        textarea.select()
      },
      async _importButtonClicked() {
        await this.config.addFromCSV(this._e('importTextarea').value)
        this._updateList()
        this._e('importTextarea').value = ''
      },
    })
    ConfigDialog.promptNgTitle = function(config, defaultValue) {
      promptFor('ng-title', config, defaultValue)
    }
    ConfigDialog.promptNgUserName = function(config, defaultValue) {
      promptFor('ng-user-name', config, defaultValue)
    }
    ConfigDialog.SRCDOC = `<!doctype html>
<html><head><style>
  html {
    margin: 0 auto;
    max-width: 30em;
    height: 100%;
    line-height: 1.5em;
  }
  body {
    height: 100%;
    margin: 0;
    display: flex;
    flex-direction: column;
    justify-content: center;
  }
  .dialog {
    overflow: auto;
    padding: 8px;
    background-color: white;
  }
  p {
    margin: 0;
  }
  .listButtonsWrap {
    display: flex;
  }
  .listButtonsWrap .list {
    flex: auto;
  }
  .listButtonsWrap .list select {
    width: 100%;
  }
  .listButtonsWrap .buttons {
    flex: none;
    display: flex;
    flex-direction: column;
  }
  .listButtonsWrap .buttons input {
    margin-bottom: 5px;
  }
  .sideComment {
    margin-left: 2em;
  }
  .dialogBottom {
    text-align: center;
  }
  .scriptInfo {
    text-align: right;
  }
  .isHidden {
    display: none;
  }
  textarea {
    width: 100%;
  }
  p:has(#addToNgLockedTags) {
    display: flex;
  }
</style></head><body>
  <div class=dialog>
    <p><select id=target>
      <option value=ng-movie-id>NG動画ID</option>
      <option value=ng-title selected>NGタイトル</option>
      <option value=ng-tag>NGタグ</option>
      <option value=ng-locked-tag>NGタグ(ロック)</option>
      <option value=ng-user-id>NGユーザーID</option>
      <option value=ng-user-name>NGユーザー名</option>
      <option value=ng-channel-id>NGチャンネルID</option>
      <option value=visited-movie-id>閲覧済み動画ID</option>
    </select></p>
    <div class=listButtonsWrap>
      <p class=list><select multiple size=10 id=list></select></p>
      <p class=buttons>
        <input type=button value=追加 id=addButton>
        <input type=button value=削除 disabled id=removeButton>
        <input type=button value=全削除 disabled id=removeAllButton>
        <input type=button value=開く disabled id=openButton>
      </p>
    </div>
    <p><input type=checkbox id=addToNgLockedTags><label for=addToNgLockedTags>ロックされたタグを[+]ボタンでNG登録するとき、「NGタグ(ロック)」に追加する</label></p>
    <p><label><input type=checkbox id=openNewWindow>動画を別窓で開く</label></p>
    <p><label><input type=checkbox id=useGetThumbInfo>動画情報を取得する</label></p>
    <fieldset id=togglable>
      <legend>表示・非表示の切り替えボタン</legend>
      <p><label><input type=checkbox id=movieInfoTogglable>タグ、ユーザー、チャンネル</label></p>
      <p><label><input type=checkbox id=descriptionTogglable>動画説明</label></p>
    </fieldset>
    <p>エクスポート<small><label><input id=exportVisibleCheckbox type=checkbox>表示</label></small></p>
    <div id=exportContainer class=isHidden>
      <p><label><input id=exportNgMovieIdCheckbox type=checkbox checked>NG動画ID</label></p>
      <p><label><input id=exportNgTitleCheckbox type=checkbox checked>NGタイトル</label></p>
      <p><label><input id=exportNgTagCheckbox type=checkbox checked>NGタグ</label></p>
      <p><label><input id=exportNgUserIdCheckbox type=checkbox checked>NGユーザーID</label></p>
      <p><label><input id=exportNgUserNameCheckbox type=checkbox checked>NGユーザー名</label></p>
      <p><label><input id=exportNgChannelIdCheckbox type=checkbox checked>NGチャンネルID</label></p>
      <p><label><input id=exportVisitedMovieIdCheckbox type=checkbox checked>閲覧済み動画ID</label></p>
      <p><input id=exportButton type=button value=エクスポート></p>
      <p><textarea id=exportTextarea rows=3></textarea></p>
    </div>
    <p>インポート<small><label><input id=importVisibleCheckbox type=checkbox>表示</label></small></p>
    <div id=importContainer class=isHidden>
      <p><textarea id=importTextarea rows=3></textarea></p>
      <p><input id=importButton type=button value=インポート></p>
    </div>
    <p class=dialogBottom><input type=button value=閉じる id=closeButton></p>
    <p class=scriptInfo><small><a href=https://greasyfork.org/ja/scripts/880-nico-nico-ranking-ng target=_blank>Nico Nico Ranking NG</a></small></p>
  </div>
</body></html>`
    return ConfigDialog
  })(EventEmitter)

  var NicoPage = (function() {
    var TOGGLE_OPEN_TEXT = '▼'
    var TOGGLE_CLOSE_TEXT = '▲'
    var emphasizeMatchedText = function(e, text, createMatchedElem) {
      var t = e.textContent
      if (!text) {
        e.textContent = t
        return
      }
      var i = t.toUpperCase().indexOf(text)
      if (i === -1) {
        e.textContent = t
        return
      }
      while (e.hasChildNodes()) e.removeChild(e.firstChild)
      var d = e.ownerDocument
      if (i !== 0) e.appendChild(d.createTextNode(t.slice(0, i)))
      e.appendChild(createMatchedElem(t.slice(i, i + text.length)))
      if (i + text.length !== t.length) {
        e.appendChild(d.createTextNode(t.slice(i + text.length)))
      }
    }

    var MovieTitle = (function() {
      var MovieTitle = function(elem) {
        this.elem = elem
        this._ngTitle = ''
        this._listeners = new Listeners({
          ngIdChanged: set(this, 'ngId'),
          ngTitleChanged: set(this, 'ngTitle'),
        })
      }
      MovieTitle.prototype = {
        get ngId() {
          return this.elem.classList.contains('nrn-ng-movie-title')
        },
        set ngId(ngId) {
          var n = ngId ? 'add' : 'remove'
          this.elem.classList[n]('nrn-ng-movie-title')
        },
        _createNgTitleElem(textContent) {
          var result = this.elem.ownerDocument.createElement('span')
          result.className = 'nrn-matched-ng-title'
          result.textContent = textContent
          return result
        },
        get ngTitle() { return this._ngTitle },
        set ngTitle(ngTitle) {
          this._ngTitle = ngTitle
          emphasizeMatchedText(this.elem, ngTitle, this._createNgTitleElem.bind(this))
        },
        bindToMovie(movie) {
          this.ngId = movie.ngId
          this.ngTitle = movie.ngTitle
          this._listeners.bind(movie)
          return this
        },
        unbind() {
          this._listeners.unbind()
        },
      }
      return MovieTitle
    })()

    var ActionPane = (function() {
      var createVisitButton = function(doc, movie) {
        var result = doc.createElement('span')
        result.className = 'nrn-visit-button'
        result.textContent = '閲覧済み'
        result.dataset.movieId = movie.id
        result.dataset.type = 'add'
        result.dataset.movieTitle = movie.title
        return result
      }
      var createMovieNgButton = function(doc, movie) {
        var result = doc.createElement('span')
        result.className = 'nrn-movie-ng-button'
        result.textContent = 'NG動画'
        result.dataset.movieId = movie.id
        result.dataset.type = 'add'
        result.dataset.movieTitle = movie.title
        return result
      }
      var createTitleNgButton = function(doc, movie) {
        var result = doc.createElement('span')
        result.className = 'nrn-title-ng-button'
        result.textContent = 'NGタイトル追加'
        result.dataset.movieTitle = movie.title
        result.dataset.ngTitle = ''
        return result
      }
      var createPane = function(doc) {
        var result = doc.createElement('div')
        result.className = 'nrn-action-pane'
        for (var c of Array.from(arguments).slice(1)) result.appendChild(c)
        return result
      }
      var ActionPane = function(doc, movie) {
        this.elem = createPane(doc
                             , createVisitButton(doc, movie)
                             , createMovieNgButton(doc, movie)
                             , createTitleNgButton(doc, movie))
        this._listeners = new Listeners({
          ngIdChanged: set(this, 'ngId'),
          ngTitleChanged: set(this, 'ngTitle'),
          visitedChanged: set(this, 'visited'),
        })
      }
      ActionPane.prototype = {
        get _visitButton() {
          return this.elem.querySelector('.nrn-visit-button')
        },
        get visited() {
          return this._visitButton.dataset.type === 'remove'
        },
        set visited(visited) {
          var b = this._visitButton
          b.textContent = visited ? '未閲覧' : '閲覧済み'
          b.dataset.type = visited ? 'remove' : 'add'
        },
        get _movieNgButton() {
          return this.elem.querySelector('.nrn-movie-ng-button')
        },
        get ngId() {
          return this._movieNgButton.dataset.type === 'remove'
        },
        set ngId(ngId) {
          var b = this._movieNgButton
          b.textContent = ngId ? 'NG解除' : 'NG登録'
          b.dataset.type = ngId ? 'remove' : 'add'
        },
        get _titleNgButton() {
          return this.elem.querySelector('.nrn-title-ng-button')
        },
        get ngTitle() {
          return this._titleNgButton.dataset.ngTitle
        },
        set ngTitle(ngTitle) {
          var b = this._titleNgButton
          b.textContent = ngTitle ? 'NGタイトル削除' : 'NGタイトル追加'
          b.dataset.type = ngTitle ? 'remove' : 'add'
          b.dataset.ngTitle = ngTitle
        },
        bindToMovie(movie) {
          this.ngId = movie.ngId
          this.ngTitle = movie.ngTitle
          this.visited = movie.visited
          this._listeners.bind(movie)
          return this
        },
        unbind() {
          this._listeners.unbind()
        },
      }
      return ActionPane
    })()

    var TagView = (function() {
      var createElem = function(doc, tag) {
        var a = doc.createElement('a')
        a.className = 'nrn-movie-tag-link'
        a.target = '_blank'
        a.textContent = tag.name
        a.href = 'https://www.nicovideo.jp/tag/' + tag.name
        const key = doc.createElement('span');
        key.textContent = tag.lock ? '🔒' : '';
        var b = doc.createElement('span')
        b.className = 'nrn-tag-ng-button'
        b.textContent = '[+]'
        b.dataset.type = 'add'
        b.dataset.tagName = tag.name
        if (tag.lock) b.dataset.lock = 'true';
        var result = doc.createElement('span')
        result.className = 'nrn-movie-tag'
        result.appendChild(a)
        result.appendChild(key);
        result.appendChild(b)
        return result
      }
      var TagView = function(doc, tag) {
        this.tagName = tag.name;
        this.elem = createElem(doc, tag);
        this._listeners = new Listeners({ngChanged: set(this, 'ng')})
      }
      TagView.prototype = {
        get _link() {
          return this.elem.querySelector('.nrn-movie-tag-link')
        },
        get ng() {
          return this._link.classList.contains('nrn-movie-ng-tag-link')
        },
        set ng(ng) {
          this._link.classList[ng ? 'add' : 'remove']('nrn-movie-ng-tag-link')
          var b = this.elem.querySelector('.nrn-tag-ng-button')
          b.textContent = ng ? '[x]' : '[+]'
          b.dataset.type = ng ? 'remove' : 'add'
        },
        bindToTag(tag) {
          this.ng = tag.ng
          this._listeners.bind(tag)
          return this
        },
        unbind() {
          this._listeners.unbind()
        },
      }
      return TagView
    })()

    var ContributorView = (function() {
      var ContributorView = function(doc, contributor) {
        this.contributor = contributor
        this.elem = this._createElem(doc)
      }
      ContributorView.prototype = {
        _createElem(doc) {
          var a = doc.createElement('a')
          a.className = 'nrn-contributor-link'
          a.target = '_blank'
          a.href = this.contributor.url
          a.textContent = this.contributor.name || '(名前不明)'
          var b = doc.createElement('span')
          this._setNgButton(b)
          var result = doc.createElement('span')
          result.className = 'nrn-contributor'
          result.appendChild(doc.createTextNode(this._label))
          result.appendChild(a)
          result.appendChild(b)
          return result
        },
        _initContributorDataset(dataset) {
          dataset.contributorType = this.contributor.type
          dataset.id = this.contributor.id
          dataset.name = this.contributor.name
          dataset.type = 'add'
        },
        get _label() {
          throw new Error('must be implemented')
        },
        _setNgButton() {
          throw new Error('must be implemented')
        },
        _bindToContributor() {
          throw new Error('must be implemented')
        },
      }

      var UserView = function UserView(doc, contributor) {
        ContributorView.call(this, doc, contributor)
        this._listeners = new Listeners({
          ngIdChanged: set(this, 'ngId'),
          ngNameChanged: set(this, 'ngName'),
        })
        this._bindToContributor()
      }
      UserView.prototype = createObject(ContributorView.prototype, {
        get _label() {
          return 'ユーザー: '
        },
        _setNgButton(b) {
          var d = b.ownerDocument
          var ngIdButton = d.createElement('span')
          ngIdButton.className = 'nrn-contributor-ng-id-button'
          ngIdButton.textContent = '+ID'
          this._initContributorDataset(ngIdButton.dataset)
          var ngNameButton = d.createElement('span')
          ngNameButton.className = 'nrn-contributor-ng-name-button'
          ngNameButton.textContent = '+名'
          this._initContributorDataset(ngNameButton.dataset)
          b.className = 'nrn-user-ng-button'
          b.appendChild(d.createTextNode('['))
          b.appendChild(ngIdButton)
          if (this.contributor.name) {
            b.appendChild(d.createTextNode('/'))
          } else {
            ngNameButton.style.display = 'none'
          }
          b.appendChild(ngNameButton)
          b.appendChild(d.createTextNode(']'))
        },
        get ngId() {
          return this.elem.querySelector('.nrn-contributor-link')
            .classList.contains('nrn-ng-id-contributor-link')
        },
        set ngId(ngId) {
          var a = this.elem.querySelector('.nrn-contributor-link')
          a.classList[ngId ? 'add' : 'remove']('nrn-ng-id-contributor-link')
          var b = this.elem.querySelector('.nrn-contributor-ng-id-button')
          b.textContent = ngId ? 'xID' : '+ID'
          b.dataset.type = ngId ? 'remove' : 'add'
        },
        get ngName() {
          var e = this.elem.querySelector('.nrn-matched-ng-contributor-name')
          return e ? e.textContent : ''
        },
        set ngName(ngName) {
          var b = this.elem.querySelector('.nrn-contributor-ng-name-button')
          b.textContent = ngName ? 'x名' : '+名'
          b.dataset.type = ngName ? 'remove' : 'add'
          b.dataset.matched = ngName
          emphasizeMatchedText(
            this.elem.querySelector('.nrn-contributor-link'),
            ngName,
            function(text) {
              var result = this.elem.ownerDocument.createElement('span')
              result.className = 'nrn-matched-ng-contributor-name'
              result.textContent = text
              return result
            }.bind(this))
        },
        _bindToContributor() {
          this.ngId = this.contributor.ngId
          this.ngName = this.contributor.ngName
          this._listeners.bind(this.contributor)
          return this
        },
        unbind() {
          this._listeners.unbind()
        },
      })

      var ChannelView = function ChannelView(doc, contributor) {
        ContributorView.call(this, doc, contributor)
        this._listeners = new Listeners({ngChanged: set(this, 'ng')})
        this._bindToContributor()
      }
      ChannelView.prototype = createObject(ContributorView.prototype, {
        get _label() {
          return 'チャンネル: '
        },
        _setNgButton(e) {
          e.className = 'nrn-contributor-ng-button'
          e.textContent = '[+]'
          this._initContributorDataset(e.dataset)
        },
        get ng() {
          return this.elem.querySelector('.nrn-contributor-link')
            .classList.contains('nrn-ng-contributor-link')
        },
        set ng(ng) {
          var a = this.elem.querySelector('.nrn-contributor-link')
          a.classList[ng ? 'add' : 'remove']('nrn-ng-contributor-link')
          var b = this.elem.querySelector('.nrn-contributor-ng-button')
          b.textContent = ng ? '[x]' : '[+]'
          b.dataset.type = ng ? 'remove' : 'add'
        },
        _bindToContributor() {
          this.ng = this.contributor.ng
          this._listeners.bind(this.contributor)
          return this
        },
        unbind() {
          this._listeners.unbind()
        },
      })

      ContributorView.new = function(doc, contributor) {
        switch (contributor.type) {
          case 'user': return new UserView(doc, contributor)
          case 'channel': return new ChannelView(doc, contributor)
          default: throw new Error(contributor.type)
        }
      }
      return ContributorView
    })()

    var MovieInfo = (function() {
      var createElem = function(doc) {
        var e = doc.createElement('P')
        e.className = 'nrn-error'
        var t = doc.createElement('p')
        t.className = 'nrn-tag-container'
        var c = doc.createElement('p')
        c.className = 'nrn-contributor-container'
        var result = doc.createElement('div')
        result.className = 'nrn-movie-info-container'
        result.appendChild(e)
        result.appendChild(t)
        result.appendChild(c)
        return result
      }
      var createToggle = function(doc) {
        var result = doc.createElement('span')
        result.className = 'nrn-movie-info-toggle'
        result.textContent = TOGGLE_OPEN_TEXT
        return result
      }
      var MovieInfo = function(doc) {
        this.elem = createElem(doc)
        this.toggle = createToggle(doc)
        this.togglable = true
        this._tagViews = []
        this._contributorView = null
        this._error = Movie.NO_ERROR
        this._actionPane = null
        this._listeners = new Listeners({
          tagsChanged: this._createAndSetTagViews.bind(this),
          contributorChanged: this._createAndSetContributorView.bind(this),
          errorChanged: set(this, 'error'),
        })
      }
      MovieInfo.prototype = {
        set actionPane(actionPane) {
          this._actionPane = actionPane
          this.elem.insertBefore(actionPane.elem, this.elem.firstChild)
        },
        get tagViews() { return this._tagViews },
        set tagViews(tagViews) {
          this._tagViews = tagViews
          var e = this.elem.querySelector('.nrn-tag-container')
          for (var v of tagViews) e.appendChild(v.elem)
        },
        get contributorView() { return this._contributorView },
        set contributorView(contributorView) {
          this._contributorView = contributorView
          this.elem.querySelector('.nrn-contributor-container')
            .appendChild(contributorView.elem)
        },
        get error() { return this._error },
        set error(error) {
          if (this._error === error) return
          this._error = error
          this.elem.querySelector('.nrn-error').textContent = error.message
        },
        hasAny() {
          return Boolean(this.elem.querySelector('.nrn-action-pane')
                      || this.elem.querySelector('.nrn-movie-tag')
                      || this.elem.querySelector('.nrn-contributor')
                      || this.error !== Movie.NO_ERROR)
        },
        _createAndSetTagViews(tags) {
          var d = this.elem.ownerDocument
          this.tagViews = tags.map(function(tag) {
            return new TagView(d, tag).bindToTag(tag)
          })
        },
        _createAndSetContributorView(contributor) {
          if (contributor === Contributor.NULL) return
          var d = this.elem.ownerDocument
          this.contributorView = ContributorView.new(d, contributor)
        },
        bindToMovie(movie) {
          this._createAndSetTagViews(movie.tags)
          this._createAndSetContributorView(movie.contributor)
          this.error = movie.error
          if (!movie.thumbInfoDone) this._listeners.bind(movie)
        },
        unbind() {
          this._listeners.unbind()
          this.tagViews.forEach(function(v) { v.unbind() })
          if (this.contributorView) this.contributorView.unbind()
          if (this._actionPane) this._actionPane.unbind()
        },
      }
      return MovieInfo
    })()

    var Description = (function() {
      var re = /(sm|so|nm|co|ar|im|lv|mylist\/|watch\/|user\/)(?:\d+)/g
      var typeToHRef = {
        sm: 'https://www.nicovideo.jp/watch/',
        so: 'https://www.nicovideo.jp/watch/',
        nm: 'https://www.nicovideo.jp/watch/',
        co: 'https://com.nicovideo.jp/community/',
        ar: 'https://ch.nicovideo.jp/article/',
        im: 'https://seiga.nicovideo.jp/seiga/',
        lv: 'http://live.nicovideo.jp/watch/',
        'mylist/': 'https://www.nicovideo.jp/',
        'watch/': 'https://www.nicovideo.jp/',
        'user/': 'https://www.nicovideo.jp/',
      }
      var createAnchor = function(doc, href, text) {
        var a = doc.createElement('a')
        a.target = '_blank'
        a.href = href
        a.textContent = text
        return a
      }
      var createCloseButton = function(doc) {
        var result = doc.createElement('span')
        result.className = 'nrn-description-close-button'
        result.textContent = TOGGLE_CLOSE_TEXT
        return result
      }
      var createElem = function(doc, closeButton) {
        var text = doc.createElement('span')
        text.className = 'nrn-description-text'
        var result = doc.createElement('p')
        result.className = 'itemDescription ranking nrn-description'
        result.appendChild(text)
        result.appendChild(closeButton)
        return result
      }
      var createOpenButton = function(doc) {
        var result = doc.createElement('span')
        result.className = 'nrn-description-open-button'
        result.textContent = TOGGLE_OPEN_TEXT
        return result
      }
      var Description = function(doc) {
        this.closeButton = createCloseButton(doc)
        this.elem = createElem(doc, this.closeButton)
        this.openButton = createOpenButton(doc)
        this.original = null
        this.text = ''
        this.linkified = false
        this.togglable = true
        this._listeners = new Listeners({
          'descriptionChanged': set(this, 'text'),
        })
      }
      Description.prototype = {
        linkify() {
          if (this.linkified) return
          this.linkified = true
          var t = this.text
          var d = this.elem.ownerDocument
          var f = d.createDocumentFragment()
          var lastIndex = 0
          for (var r; r = re.exec(t);) {
            f.appendChild(d.createTextNode(t.slice(lastIndex, r.index)))
            f.appendChild(createAnchor(d, typeToHRef[r[1]] + r[0], r[0]))
            lastIndex = re.lastIndex
          }
          f.appendChild(d.createTextNode(t.slice(lastIndex)))
          f.normalize()
          this.elem.firstChild.appendChild(f)
        },
        bindToMovie(movie) {
          this.text = movie.description
          this._listeners.bind(movie)
        },
        unbind() {
          this._listeners.unbind()
        },
      }
      return Description
    })()

    var MovieRoot = (function() {
      var MovieRoot = function(elem) {
        this.elem = elem
        var d = elem.ownerDocument
        this.movieInfo = new MovieInfo(d)
        this.description = new Description(d)
        this._openNewWindow = false
        this.movieTitle = null
        this._movieListeners = new Listeners({
          thumbInfoDone: this.setThumbInfoDone.bind(this),
        })
        this._movieViewModeListeners = new Listeners({
          changed: set(this, 'viewMode'),
        })
        this._configOpenNewWindowListeners = new Listeners({
          changed: set(this, 'openNewWindow'),
        })
      }
      MovieRoot.prototype = {
        markMovieAnchor() {
          for (var a of this._movieAnchors) a.dataset.nrnMovieAnchor = 'true'
        },
        set id(id) {
          for (var a of this._movieAnchors) a.dataset.nrnMovieId = id
        },
        get titleElem() {
          throw new Error('must be implemented')
        },
        set title(title) {
          this.titleElem.textContent = title
          for (var a of this._movieAnchors) a.dataset.nrnMovieTitle = title
        },
        get _reduced() {
          return this.elem.classList.contains('nrn-reduce')
        },
        _halfThumb() {},
        _restoreThumb() {},
        _reduce() {
          this.elem.classList.add('nrn-reduce')
          this._halfThumb()
        },
        _unreduce() {
          this.elem.classList.remove('nrn-reduce')
          this._restoreThumb()
        },
        get _hidden() {
          return this.elem.classList.contains('nrn-hide')
        },
        _hide() {
          this.elem.classList.add('nrn-hide')
        },
        _show() {
          this.elem.classList.remove('nrn-hide')
        },
        get viewMode() {
          if (this.elem.classList.contains('nrn-reduce')) return 'reduce'
          if (this.elem.classList.contains('nrn-hide')) return 'hide'
          return 'doNothing'
        },
        set viewMode(viewMode) {
          if (this._reduced) this._unreduce()
          else if (this._hidden) this._show()
          switch (viewMode) {
            case 'reduce': this._reduce(); break
            case 'hide': this._hide(); break
            case 'doNothing': break
            default: throw new Error(viewMode)
          }
        },
        get _movieAnchorSelectors() {
          throw new Error('must be implemented')
        },
        get _movieAnchors() {
          var result = []
          for (var s of this._movieAnchorSelectors) {
            var a = this.elem.querySelector(s)
            if (a) result.push(a)
          }
          return result
        },
        get openNewWindow() { return this._openNewWindow },
        set openNewWindow(openNewWindow) {
          this._openNewWindow = openNewWindow
          var t = openNewWindow ? '_blank' : ''
          for (var a of this._movieAnchors) a.target = t
        },
        get _movieInfoVisible() {
          return Boolean(this.movieInfo.elem.parentNode)
        },
        set _movieInfoVisible(visible) {
          if (visible) {
            this._addMovieInfo()
            this.movieInfo.toggle.textContent = TOGGLE_CLOSE_TEXT
          } else {
            this.movieInfo.elem.remove()
            this.movieInfo.toggle.textContent = TOGGLE_OPEN_TEXT
          }
        },
        toggleMovieInfo() {
          this._movieInfoVisible = !this._movieInfoVisible
        },
        set actionPane(actionPane) {
          this.movieInfo.actionPane = actionPane
        },
        _addMovieInfo() {
          throw new Error('must be implemented')
        },
        _addMovieInfoToggle() {
          this.elem.querySelector('.itemData')
            .appendChild(this.movieInfo.toggle)
        },
        setMovieInfoToggleIfRequired() {},
        _updateByMovieInfoTogglable() {
          if (!this.movieInfo.hasAny()) return
          if (this.movieInfo.togglable) {
            this._addMovieInfoToggle()
          } else {
            this.movieInfo.toggle.remove()
          }
          this._movieInfoVisible = !this.movieInfo.togglable
        },
        get movieInfoTogglable() {
          return this.movieInfo.togglable
        },
        set movieInfoTogglable(movieInfoTogglable) {
          this.movieInfo.togglable = movieInfoTogglable
          this._updateByMovieInfoTogglable()
        },
        _queryOriginalDescriptionElem() {
          return this.elem.querySelector('.itemDescription')
        },
        get _originalDescriptionElem() {
          var result = this.description.original
          if (!result) {
            result
              = this.description.original
              = this._queryOriginalDescriptionElem()
          }
          return result
        },
        get _descriptionExpanded() {
          return Boolean(this.description.elem.parentNode)
        },
        set _descriptionExpanded(expanded) {
          var o = this._originalDescriptionElem
          var d = this.description
          if (expanded && o.parentNode) {
            d.linkify()
            o.parentNode.replaceChild(d.elem, o)
          } else if (!expanded && d.elem.parentNode) {
            d.elem.parentNode.replaceChild(o, d.elem)
          }
        },
        _updateByDescriptionTogglable() {
          if (!this.description.text) return
          if (this.description.togglable) {
            this._originalDescriptionElem?.appendChild(this.description.openButton)
            this.description.elem.appendChild(this.description.closeButton)
          } else {
            this.description.closeButton.remove()
          }
          this._descriptionExpanded = !this.description.togglable
        },
        toggleDescription() {
          this._descriptionExpanded = !this._descriptionExpanded
        },
        get descriptionTogglable() {
          return this.description.togglable
        },
        set descriptionTogglable(descriptionTogglable) {
          this.description.togglable = descriptionTogglable
          this._updateByDescriptionTogglable()
        },
        setThumbInfoDone() {
          this.elem.classList.add('nrn-thumb-info-done')
        },
        get thumbInfoDone() {
          return this.elem.classList.contains('nrn-thumb-info-done')
        },
        bindToMovie(movie) {
          this.movieInfo.bindToMovie(movie)
          this.description.bindToMovie(movie)
          if (movie.thumbInfoDone) this.setThumbInfoDone()
          else this._movieListeners.bind(movie)
        },
        bindToMovieViewMode(movieViewMode) {
          this.viewMode = movieViewMode.value
          this._movieViewModeListeners.bind(movieViewMode)
        },
        bindToConfig(config) {
          this.openNewWindow = config.openNewWindow.value
          this._configOpenNewWindowListeners.bind(config.openNewWindow)
        },
        unbind() {
          this.movieInfo.unbind()
          this.description.unbind()
          this._movieListeners.unbind()
          this._movieViewModeListeners.unbind()
          this._configOpenNewWindowListeners.unbind()
          if (this.movieTitle) this.movieTitle.unbind()
        },
        preventPageTransition(config) {},
      }
      return MovieRoot
    })()

    var ConfigBar = (function() {
      var createConfigBar = function(doc) {
        var html = `<div id=nrn-config-bar>
    <label>
      閲覧済みの動画を
      <select id=nrn-visited-movie-view-mode-select>
        <option value=reduce>縮小</option>
        <option value=hide>非表示</option>
        <option value=doNothing>通常表示</option>
      </select>
    </label>
    |
    <label>
      投稿者
      <select id=nrn-visible-contributor-type-select>
        <option value=all>全部</option>
        <option value=user>ユーザー</option>
        <option value=channel>チャンネル</option>
      </select>
    </label>
    |
    <label><input type=checkbox id=nrn-ng-movie-visible-checkbox> NG動画を表示</label>
    |
    <span id=nrn-config-button>設定</span>
  </div>`
        var e = doc.createElement('div')
        e.innerHTML = html
        var result = e.firstChild
        result.remove()
        return result
      }
      var ConfigBar = function(doc) {
        this.elem = createConfigBar(doc)
      }
      ConfigBar.prototype = {
        get _viewModeSelect() {
          return this.elem.querySelector('#nrn-visited-movie-view-mode-select')
        },
        get visitedMovieViewMode() {
          return this._viewModeSelect.value
        },
        set visitedMovieViewMode(viewMode) {
          this._viewModeSelect.value = viewMode
        },
        get _visibleContributorTypeSelect() {
          return this.elem.querySelector('#nrn-visible-contributor-type-select')
        },
        get visibleContributorType() {
          return this._visibleContributorTypeSelect.value
        },
        set visibleContributorType(type) {
          this._visibleContributorTypeSelect.value = type
        },
        bindToConfig(config) {
          this.visitedMovieViewMode = config.visitedMovieViewMode.value
          this.visibleContributorType = config.visibleContributorType.value
          config.visitedMovieViewMode.on('changed', set(this, 'visitedMovieViewMode'))
          config.visibleContributorType.on('changed', set(this, 'visibleContributorType'))
          return this
        },
      }
      return ConfigBar
    })()

    var NicoPage = function(doc) {
      this.doc = doc
      this._toggleToMovieRoot = new Map()
    }
    NicoPage.prototype = {
      createConfigBar() {
        return new ConfigBar(this.doc)
      },
      createTables() { return [] },
      createMovieRoot() {
        throw new Error('must be implemented')
      },
      get _configBarContainer() {
        throw new Error('must be implemented')
      },
      addConfigBar(bar) {
        var target = this._configBarContainer
        if (target) {
          target.insertBefore(bar.elem, target.firstChild);
        }
      },
      parse() {
        throw new Error('must be implemented')
      },
      mapToggleTo(movieRoot) {
        var m = this._toggleToMovieRoot
        m.set(movieRoot.movieInfo.toggle, movieRoot)
        m.set(movieRoot.description.openButton, movieRoot)
        m.set(movieRoot.description.closeButton, movieRoot)
      },
      unmapToggleFrom(movieRoot) {
        var m = this._toggleToMovieRoot
        m.delete(movieRoot.movieInfo.toggle)
        m.delete(movieRoot.description.openButton)
        m.delete(movieRoot.description.closeButton)
      },
      getMovieRootBy(toggle) {
        return this._toggleToMovieRoot.get(toggle)
      },
      _configDialogLoaded() {},
      showConfigDialog(config) {
        var back = this.doc.createElement('div')
        back.style.backgroundColor = 'black'
        back.style.opacity = '0.5'
        back.style.zIndex = '10000'
        back.style.position = 'fixed'
        back.style.top = '0'
        back.style.left = '0'
        back.style.width = '100%'
        back.style.height = '100%'
        this.doc.body.appendChild(back)

        var f = this.doc.createElement('iframe')
        f.style.position = 'fixed'
        f.style.top = '0'
        f.style.left = '0'
        f.style.width = '100%'
        f.style.height = '100%'
        f.style.zIndex = '10001'
        f.srcdoc = ConfigDialog.SRCDOC
        f.addEventListener('load', function loaded() {
          this._configDialogLoaded(f.contentDocument)
          const openInTab = typeof GM_openInTab === 'undefined'
                            ? GM.openInTab : GM_openInTab
          new ConfigDialog(config, f.contentDocument, openInTab)
            .on('closed', function() {
              f.remove()
              back.remove()
            })
        }.bind(this))
        this.doc.body.appendChild(f)
      },
      bindToConfig() {},
      get css() {
        throw new Error('must be implemented')
      },
      observeMutation() {},
    }
    Object.assign(NicoPage, {
      MovieTitle,
      ActionPane,
      TagView,
      ContributorView,
      MovieInfo,
      Description,
      MovieRoot,
      ConfigBar,
    })
    return NicoPage
  })()

  var ListPage = (function(_super) {

    const wrapTitleTextNodeInElement = parentOfTitleTextNode => {
      const e = document.createElement('span');
      e.classList.add('nrn-movie-title');
      if (!parentOfTitleTextNode) return e;
      const s = parentOfTitleTextNode.querySelector('span');
      if (s) {
        // 有料動画、プレミアム限定動画のタイトルの先頭にタグがつくので、それに対する場合分け
        e.textContent = parentOfTitleTextNode.lastChild?.textContent ?? '';
        parentOfTitleTextNode.replaceChildren(s, e);
      } else {
        e.textContent = parentOfTitleTextNode.textContent;
        parentOfTitleTextNode.replaceChildren(e);
      }
      return e;
    };

    var MovieRoot = (function(_super) {
      var MovieRoot = function(elem) {
        _super.call(this, elem)
        elem.classList.add('nrn-parsed');
      }
      MovieRoot.prototype = createObject(_super.prototype, {
        get titleElem() {
          let e = this.elem.querySelector('.nrn-movie-title');
          if (!e) {
            const a = this.elem.querySelector('div:not(.pos_relative) > a[data-anchor-area][href^="/watch/"]');
            e = wrapTitleTextNodeInElement(a);
          }
          return e;
        },
        get _movieAnchorSelectors() {
          return ['a'];
        },
        set actionPane(actionPane) {
          this._actionPane = actionPane;
          this.elem.appendChild(actionPane.elem);
        },
        _addMovieInfo() {
          this.elem.appendChild(this.movieInfo.elem)
        },
        setThumbInfoDone() {
          _super.prototype.setThumbInfoDone.call(this);
          if (!this.movieInfo.toggle.parentNode) {
            this.elem.appendChild(this.movieInfo.toggle);
          }
        },
        preventPageTransition(controller) {
          const f = e => {
            e.preventDefault();
            e.stopPropagation();
            if (e.target.classList.contains('nrn-movie-tag-link') || e.target.classList.contains('nrn-contributor-link')) {
              GM.openInTab(e.target.href);
            } else {
              controller._clicked(e);
            }
          };
          this.movieInfo.elem.addEventListener('click', f);
          this.movieInfo.toggle.addEventListener('click', f);
          this?._actionPane.elem.addEventListener('click', f);
        },
      })
      return MovieRoot
    })(_super.MovieRoot)

    const AdsRoot = (function(_super) {
      const AdsRoot = function(elem) {
        _super.call(this, elem)
      }
      AdsRoot.prototype = createObject(_super.prototype, {
        get titleElem() {
          let e = this.elem.querySelector('.nrn-movie-title');
          if (!e) {
            const a = this.elem.querySelector('a[data-anchor-area][href^="/watch/"] > div > p');
            e = wrapTitleTextNodeInElement(a);
          }
          return e;
        },
      })
      return AdsRoot
    })(MovieRoot);

    const isTargetPage = () => {
      return ListPage.is(location) || SearchPage.is(location);
    };
    var parent = function(className, child) {
      for (var e = child; e; e = e.parentNode) {
        if (e.classList.contains(className)) return e
      }
      return null
    }
    var ListPage = function(doc) {
      _super.call(this, doc)
      this.movieRoots = [];
    }
    ListPage.prototype = createObject(_super.prototype, {
      createTables() { return [] },
      _createMovieRoot(resultOfParsing) {
        switch (resultOfParsing.type) {
          case 'main': return new MovieRoot(resultOfParsing.rootElem)
          case 'ads': return new AdsRoot(resultOfParsing.rootElem)
          default: throw new Error(resultOfParsing.type)
        }
      },
      createMovieRoot(resultOfParsing) {
        const res = this._createMovieRoot(resultOfParsing);
        this.movieRoots.push(res);
        return res;
      },
      unbindUnconnectedMovieRoots() {
        const a = [];
        for (const r of this.movieRoots) {
          if (r.elem.isConnected) {
            a.push(r);
          } else {
            this.unmapToggleFrom(r);
            r.unbind();
          }
        }
        this.movieRoots = a;
      },
      addConfigBar(bar) {
        if (bar) {
          this.configBar = bar;
        } else if (this.configBar) {
          bar = this.configBar;
        } else {
          return;
        }
        if (bar.elem.isConnected) {
          return;
        }
        const e = this.doc.querySelector('[aria-label="nicovideo-content"] section > div:first-of-type');
        if (e) {
          e.after(bar.elem);
          return;
        }
        this.doc.querySelector('[aria-label="nicovideo-content"] .grid-area_header')?.append(bar.elem);
      },
      parse(target) {
        if (!isTargetPage()) return [];
        target = target || this.doc
        return this._parseMain(target).concat(this._parseAds(target));
      },
      _parseMain(target) {
        return Array.from(target.querySelectorAll('div[data-anchor] > div:not(.pos_relative) > a[data-anchor-area][href^="/watch/"]'))
          .map(function(item) {
            return {
              type: 'main',
              movie: {
                id: movieIdOf(item.href),
                title: item.lastChild?.textContent,
              },
              rootElem: SearchPage.is(location)
                      ? item.parentNode.parentNode
                      : item.parentNode.parentNode.parentNode.parentNode,
            }
          }).filter(e => e.movie.id && e.movie.title && !e.rootElem.classList.contains('nrn-parsed'));
      },
      _parseAds(target) {
        return Array.from(target.querySelectorAll('a[data-anchor-area][href^="/watch/"]:has(> div > p)'))
          .map(function(item) {
            return {
              type: 'ads',
              movie: {
                id: movieIdOf(item.href),
                title: item.querySelector(':scope > div > p')?.lastChild?.textContent,
              },
              rootElem: SearchPage.is(location)
                      ? item
                      : item.parentNode.parentNode,
            }
          }).filter(e => e.movie.id && e.movie.title && !e.rootElem.classList.contains('nrn-parsed'));
      },
      _configDialogLoaded(doc) {
        doc.getElementById('togglable').hidden = true
      },
      observeMutation(callback) {
        new MutationObserver((records, observer) => {
          if (!isTargetPage()) return;
          const parsed = this.parse();
          if (parsed.length > 0) {
            callback(parsed, true);
            this.unbindUnconnectedMovieRoots();
          }
          this.addConfigBar();
        }).observe(this.doc.body, {childList: true, subtree: true});
      },
      get css() {
        return `#nrn-config-button,
.nrn-visit-button:hover,
.nrn-movie-ng-button:hover,
.nrn-title-ng-button:hover,
.nrn-tag-ng-button:hover,
.nrn-contributor-ng-button:hover,
.nrn-contributor-ng-id-button:hover,
.nrn-contributor-ng-name-button:hover,
.nrn-movie-info-toggle:hover {
  text-decoration: underline;
  cursor: pointer;
}
.nrn-movie-tag {
  display: inline-block;
  margin-right: 1em;
}
.nrn-movie-tag-link,
.nrn-contributor-link {
  color: #333333;
}
.nrn-movie-tag-link.nrn-movie-ng-tag-link,
.nrn-contributor-link.nrn-ng-contributor-link,
.nrn-matched-ng-contributor-name,
.nrn-matched-ng-title {
  color: white;
  background-color: fuchsia;
}
.nrn-movie-info-container {
  position: absolute;
  top: calc(100%);
  z-index: 1;
  background: white;
  padding: 8px;
  width: 100%;
  color: black;
  & .nrn-tag-container, & .nrn-contributor-container {
    line-height: 1.5em;
    margin-top: 4px;
  }
}
.nrn-hide {
  display: none;
}
.nrn-user-ng-button {
  display: inline-block;
}
.nrn-ng-movie-title,
.nrn-contributor-link.nrn-ng-id-contributor-link {
  text-decoration: line-through;
}
.nrn-parsed {
  position: relative;
}
.nrn-action-pane {
  display: none;
  position: absolute;
  top: 0px;
  right: 0px;
  padding: 3px;
  color: #999;
  background-color: rgb(105, 105, 105);
  z-index: 11;

  .d_grid > [data-anchor] > & { /* 新検索ページ タイル表示 */
    top: -1.8em;
    white-space: nowrap;
  }
}
.nrn-parsed {
  & .nrn-movie-info-container {
    display: none;
  }
  &:hover {
    & .nrn-action-pane, & .nrn-movie-info-container {
      display: block;
    }
  }
}
.nrn-visit-button, .nrn-movie-ng-button, .nrn-title-ng-button {
  color: white;
}
.nrn-movie-ng-button, .nrn-title-ng-button {
  margin-left: 5px;
  border-left: solid thin;
  padding-left: 5px;
}
.nrn-movie-info-toggle {
  position: absolute;
  display: block;
  inset: auto 0 0 auto;
  width: 100%;
  color: #999;
  text-align: right;
}
.nrn-error {
  color: red;
}
.nrn-reduce {
  & img[src^="https://nicovideo.cdn.nimg.jp/thumbnails/"] {
    div:has(> &) {
      height: 63px;
    }
  }
  & div:not(.pos_relative) > a[href^="/watch/"] ~ * {
    display: none;
  }
}
`
      },
    })
    Object.assign(ListPage, {
      MovieRoot,
      is(location) {
        return location.pathname.startsWith('/ranking/genre');
      },
      pendingMoviesInvisibleCss() {
        return `div:has(> :not(.pos_relative) > [data-anchor-page="ranking_genre"] > :not(.pos_relative) > [data-anchor-page="ranking_genre"][href^="/watch/"]),
div:has(> div > a[data-anchor-page="ranking_genre"][href^="/watch/"] > div > p),
[data-anchor-page="tag"]:has(> :not(.pos_relative) > [data-anchor-page="tag"][href^="/watch/"]),
[data-anchor-page="search"]:has(> :not(.pos_relative) > [data-anchor-page="search"][href^="/watch/"]) {
  visibility: hidden;
  &.nrn-thumb-info-done {
    visibility: inherit;
  }
}
`;
      },
    })
    return ListPage
  })(NicoPage)

  var SearchPage = (function(_super) {

    var AbstractMovieRoot = (function(_super) {
      var AbstractMovieRoot = function(elem) {
        _super.call(this, elem)
      }
      AbstractMovieRoot.prototype = createObject(_super.prototype, {
        get titleElem() {
          return this.elem.querySelector('.itemTitle a')
        },
        get _movieAnchorSelectors() {
          return ['.itemTitle a', '.itemThumbWrap']
        },
      })
      return AbstractMovieRoot
    })(_super.MovieRoot)

    var FixedThumbMovieRoot = (function(_super) {
      var FixedThumbMovieRoot = function(elem) {
        _super.call(this, elem)
      }
      FixedThumbMovieRoot.prototype = createObject(_super.prototype, {
        _getThumbElement() {
          const e = this.elem.querySelector('.thumb')
          return e ? e : this.elem.querySelector('.backgroundThumbnail')
        },
        _halfThumb() {
          var e = this._getThumbElement()
          if (!e) return
          var s = e.style
          if (!s.marginTop) return
          s.marginTop = '-9px'
          s.width = '80px'
          s.height = '63px'
        },
        _restoreThumb() {
          var e = this._getThumbElement()
          if (!e) return
          var s = e.style
          if (!s.marginTop) return
          s.marginTop = '-15px'
          s.width = '160px'
          s.height = ''
        },
      })
      return FixedThumbMovieRoot
    })(AbstractMovieRoot)

    var TwoColumnMovieRoot = (function(_super) {
      var TwoColumnMovieRoot = function(elem) {
        _super.call(this, elem)
      }
      TwoColumnMovieRoot.prototype = createObject(_super.prototype, {
        set actionPane(actionPane) {
          this.elem.appendChild(actionPane.elem)
        },
        _addMovieInfo() {
          this.elem.appendChild(this.movieInfo.elem)
        },
        setThumbInfoDone() {
          _super.prototype.setThumbInfoDone.call(this)
          this._updateByMovieInfoTogglable()
          this._updateByDescriptionTogglable()
        },
      })
      return TwoColumnMovieRoot
    })(FixedThumbMovieRoot)

    var FourColumnMovieRoot = (function(_super) {
      var FourColumnMovieRoot = function(elem) {
        _super.call(this, elem)
        elem.classList.add('nrn-4-column-item')
      }
      FourColumnMovieRoot.prototype = createObject(_super.prototype, {
        set actionPane(actionPane) {
          this.movieInfo.actionPane = actionPane
        },
        _addMovieInfo() {
          this.elem.appendChild(this.movieInfo.elem)
        },
        setMovieInfoToggleIfRequired() {
          if (!this.movieInfo.toggle.parentNode) {
            this.elem.appendChild(this.movieInfo.toggle)
          }
        },
      })
      return FourColumnMovieRoot
    })(FixedThumbMovieRoot)

    var MovieRoot = (function(_super) {
      var MovieRoot = function(elem) {
        _super.call(this, elem)
      }
      MovieRoot.prototype = createObject(_super.prototype, {
        set actionPane(actionPane) {
          this.elem.appendChild(actionPane.elem)
        },
        _addMovieInfo() {
          this.elem.querySelector('.itemContent')
            .appendChild(this.movieInfo.elem)
        },
        setThumbInfoDone() {
          _super.prototype.setThumbInfoDone.call(this)
          this._updateByMovieInfoTogglable()
          this._updateByDescriptionTogglable()
        },
        bindToConfig(config) {
          _super.prototype.bindToConfig.call(this, config)
          this.movieInfoTogglable = config.movieInfoTogglable.value
          config.movieInfoTogglable.on('changed', set(this, 'movieInfoTogglable'))
          this.descriptionTogglable = config.descriptionTogglable.value
          config.descriptionTogglable.on('changed', set(this, 'descriptionTogglable'))
        },
      })
      return MovieRoot
    })(FixedThumbMovieRoot)

    var SubMovieRoot = (function(_super) {
      var SubMovieRoot = function(elem) {
        _super.call(this, elem)
        elem.classList.add('nrn-sub-movie-root')
      }
      SubMovieRoot.prototype = createObject(_super.prototype, {
        set actionPane(actionPane) {
          this.movieInfo.actionPane = actionPane
        },
        _addMovieInfo() {
          this.elem.appendChild(this.movieInfo.elem)
        },
        setMovieInfoToggleIfRequired() {
          if (!this.movieInfo.toggle.parentNode) {
            this.elem.appendChild(this.movieInfo.toggle)
          }
        },
      })
      return SubMovieRoot
    })(AbstractMovieRoot)

    var createMainMovieRoot = function(rootElem) {
      var singleColumnView = Boolean(rootElem.getElementsByClassName('videoList01Wrap').length)
      if (singleColumnView) return new MovieRoot(rootElem)
      var twoColumnView = Boolean(rootElem.getElementsByClassName('videoList02Wrap').length)
      if (twoColumnView) return new TwoColumnMovieRoot(rootElem)
      return new FourColumnMovieRoot(rootElem)
    }
    var SearchPage = function(doc) {
      _super.call(this, doc)
    }
    SearchPage.prototype = createObject(_super.prototype, {
      removeEmbeddedStyle() {
        const nodeList = document.querySelectorAll('.itemContent[style="visibility: visible;"]');
        for (const node of Array.from(nodeList)) {
          node.style.visibility = '';
        }
      },
      parse(target) {
        target = target || this.doc
        return this._parseMain(target).concat(this._parseSub(target))
      },
      _parseItem(item) {
        return {
          type: 'main',
          movie: {
            id: item.dataset.videoId,
            title: item.querySelector('.itemTitle a').title,
          },
          rootElem: item,
        }
      },
      parseAutoPagerizedNodes(target) {
        return [this._parseItem(target)]
      },
      _parseMain(target) {
        return Array.from(target.querySelectorAll('.contentBody.video.uad .item[data-video-item]'))
          .map(item => this._parseItem(item))
      },
      _parseSub(target) {
        return Array.from(target.querySelectorAll('#tsukuaso .item'))
          .map(function(item) {
            return {
              type: 'sub',
              movie: {
                id: item.querySelector('.itemThumb').dataset.id,
                title: item.querySelector('.itemTitle a').textContent,
              },
              rootElem: item,
            }
          })
      },
      get _configBarContainer() {
        return this.doc.querySelector('.column.main')
      },
      createMovieRoot(resultOfParsing) {
        switch (resultOfParsing.type) {
          case 'main':
          case 'ad':
            return createMainMovieRoot(resultOfParsing.rootElem)
          case 'sub':
            return new SubMovieRoot(resultOfParsing.rootElem)
          default:
            throw new Error(resultOfParsing.type)
        }
      },
      observeMutation(callback) {
        const nodeList = document.querySelectorAll('.contentBody.video.uad .item.nicoadVideoItem .itemContent')
        for (const node of Array.from(nodeList)) {
          new MutationObserver((records, observer) => {
            for (const r of records) {
              if (SearchPage._isGettingAdDone(r)) {
                observer.disconnect()
                r.target.style.visibility = ''
                const item = ancestor(r.target, '.item.nicoadVideoItem')
                callback([SearchPage._parseAdItem(item)])
                return
              }
            }
          }).observe(node, {
            attributes: true,
            attributeOldValue: true,
            attributeFilter: ['style'],
          })
        }
      },
      get css() {
        return `#nrn-config-bar {
  margin: 10px 0;
}
#nrn-config-button,
.nrn-visit-button:hover,
.nrn-movie-ng-button:hover,
.nrn-title-ng-button:hover,
.nrn-tag-ng-button:hover,
.nrn-contributor-ng-button:hover,
.nrn-contributor-ng-id-button:hover,
.nrn-contributor-ng-name-button:hover,
.nrn-movie-info-toggle:hover,
.nrn-description-open-button:hover,
.nrn-description-close-button:hover {
  text-decoration: underline;
  cursor: pointer;
}
.nrn-description-open-button {
  position: absolute;
  bottom: 0;
  right: 0;
  background-color: white;
}
.nrn-description-text,
.nrn-description-close-button {
  display: block;
}
.nrn-description-close-button {
  text-align: right;
}
.itemData,
.itemDescription,
.nicoadVideoItemWrapper {
  position: relative;
}
.nrn-movie-tag {
  display: inline-block;
  margin-right: 1em;
}
.nrn-description-open-button,
.nrn-description-close-button,
.nrn-movie-tag-link,
.nrn-contributor-link {
  color: #333333;
}
.nrn-movie-tag-link.nrn-movie-ng-tag-link,
.nrn-contributor-link.nrn-ng-contributor-link,
.nrn-matched-ng-contributor-name,
.nrn-matched-ng-title {
  color: white;
  background-color: fuchsia;
}
.nrn-movie-info-container .nrn-action-pane {
  line-height: 1.3em;
  padding-top: 4px;
}
.nrn-movie-info-container .nrn-tag-container,
.nrn-movie-info-container .nrn-contributor-container {
  line-height: 1.5em;
  padding-top: 4px;
}
.videoList01 .itemContent .itemDescription.ranking.nrn-description {
  height: auto;
  width: auto;
}
.nrn-movie-info-toggle {
  color: #333333;
  font-size: 85%;
}
.videoList01 .nrn-movie-info-toggle {
  position: absolute;
  right: 0;
  top: 0;
}
.videoList02 .nrn-movie-info-toggle,
.nrn-4-column-item .nrn-movie-info-toggle {
  display: block;
  text-align: right;
}
.videoList02 .nrn-movie-info-container {
  clear: both;
}
.nrn-hide,
.videoList02 .item.nrn-hide,
.video .item.nrn-4-column-item.nrn-hide,
.uad .nicoadVideoItemWrapper .nicoadVideoItem.nrn-hide,
.item[data-video-item-muted] {
  display: none;
}
.item.nrn-reduce .videoList01Wrap,
.item.nrn-reduce .videoList02Wrap {
  width: 80px;
}
.item.nrn-reduce .itemThumbBox,
.item.nrn-reduce .itemThumbBox .itemThumb,
.item.nrn-reduce .itemThumbBox .itemThumb .itemThumbWrap,
.item.nrn-reduce .itemThumbBox .itemThumb .itemThumbWrap img,
.nicoadVideoItemWrapper.nrn-reduce .item .itemThumbBox,
.nicoadVideoItemWrapper.nrn-reduce .item .itemThumbBox .itemThumb,
.nicoadVideoItemWrapper.nrn-reduce .item .itemThumbBox .itemThumb .itemThumbWrap,
.nicoadVideoItemWrapper.nrn-reduce .item .itemThumbBox .itemThumb .itemThumbWrap img {
  width: 80px;
  height: 45px;
}
.videoList01 .nrn-action-pane,
.videoList02 .nrn-action-pane {
  display: none;
  position: absolute;
  top: 0px;
  right: 0px;
  padding: 3px;
  color: #999;
  background-color: rgb(105, 105, 105);
  z-index: 11;
}
.videoList02 .nrn-action-pane {
  font-size: 85%;
}
.videoList01 .item:hover .nrn-action-pane,
.videoList02 .item:hover .nrn-action-pane,
.videoList01 .nicoadVideoItemWrapper:hover .nrn-action-pane,
.videoList02 .nicoadVideoItemWrapper:hover .nrn-action-pane {
  display: block;
}
.videoList01 .item:hover .nrn-action-pane .nrn-visit-button,
.videoList01 .item:hover .nrn-action-pane .nrn-movie-ng-button,
.videoList01 .item:hover .nrn-action-pane .nrn-title-ng-button,
.videoList02 .item:hover .nrn-action-pane .nrn-visit-button,
.videoList02 .item:hover .nrn-action-pane .nrn-movie-ng-button,
.videoList02 .item:hover .nrn-action-pane .nrn-title-ng-button,
.videoList01 .nicoadVideoItemWrapper:hover .nrn-action-pane .nrn-visit-button,
.videoList01 .nicoadVideoItemWrapper:hover .nrn-action-pane .nrn-movie-ng-button,
.videoList01 .nicoadVideoItemWrapper:hover .nrn-action-pane .nrn-title-ng-button,
.videoList02 .nicoadVideoItemWrapper:hover .nrn-action-pane .nrn-visit-button,
.videoList02 .nicoadVideoItemWrapper:hover .nrn-action-pane .nrn-movie-ng-button,
.videoList02 .nicoadVideoItemWrapper:hover .nrn-action-pane .nrn-title-ng-button {
  color: white;
}
.videoList01 .item:hover .nrn-action-pane .nrn-movie-ng-button,
.videoList01 .item:hover .nrn-action-pane .nrn-title-ng-button,
.videoList02 .item:hover .nrn-action-pane .nrn-movie-ng-button,
.videoList02 .item:hover .nrn-action-pane .nrn-title-ng-button,
.videoList01 .nicoadVideoItemWrapper:hover .nrn-action-pane .nrn-movie-ng-button,
.videoList01 .nicoadVideoItemWrapper:hover .nrn-action-pane .nrn-title-ng-button,
.videoList02 .nicoadVideoItemWrapper:hover .nrn-action-pane .nrn-movie-ng-button,
.videoList02 .nicoadVideoItemWrapper:hover .nrn-action-pane .nrn-title-ng-button {
  margin-left: 5px;
  border-left: solid thin;
  padding-left: 5px;
}
.nrn-user-ng-button,
.nrn-tag-ng-button {
  display: inline-block;
}
.nrn-ng-movie-title,
.nrn-contributor-link.nrn-ng-id-contributor-link {
  text-decoration: line-through;
}
.nrn-sub-movie-root {
  position: relative;
}
.nrn-sub-movie-root .nrn-movie-info-toggle {
  display: block;
  text-align: right;
  background-color: white;
}
.nrn-sub-movie-root .nrn-movie-info-container {
  clear: left;
  padding: 10px 0 15px 0;
}
.nrn-sub-movie-root .nrn-action-pane .nrn-visit-button,
.nrn-sub-movie-root .nrn-action-pane .nrn-movie-ng-button,
.nrn-sub-movie-root .nrn-action-pane .nrn-title-ng-button,
.nrn-4-column-item .nrn-action-pane .nrn-visit-button,
.nrn-4-column-item .nrn-action-pane .nrn-movie-ng-button,
.nrn-4-column-item .nrn-action-pane .nrn-title-ng-button {
  display: inline-block;
  color: #333333;
}
.nrn-sub-movie-root .nrn-action-pane .nrn-visit-button,
.nrn-sub-movie-root .nrn-action-pane .nrn-movie-ng-button,
.nrn-4-column-item .nrn-action-pane .nrn-visit-button,
.nrn-4-column-item .nrn-action-pane .nrn-movie-ng-button {
  margin-right: 0.5em;
}
.nrn-error {
  color: red;
}
.videoList02 .item,
.video .item.nrn-4-column-item {
  float: none;
  display: inline-block;
  vertical-align: top;
}
.video .item.nrn-4-column-item:nth-child(4n+1) {
  clear: none;
}
.nrn-4-column-item .nrn-movie-tag {
  display: block;
}
`
      },
    })
    Object.assign(SearchPage, {
      TwoColumnMovieRoot,
      FourColumnMovieRoot,
      is(location) {
        var p = location.pathname
        return p.startsWith('/search/') || p.startsWith('/tag/')
      },
      _isGettingAdDone(mutationRecord) {
        const r = mutationRecord
        return r.attributeName === 'style'
            && r.oldValue.includes('visibility: hidden;')
            && r.target.getAttribute('style').includes('visibility: visible;')
      },
      _parseAdItem(item) {
        const p = item.querySelector('.count.ads .value a').pathname
        return {
          type: 'ad',
          movie: {
            id: p.slice(p.lastIndexOf('/') + 1),
            title: item.querySelector('.itemTitle a').textContent,
          },
          rootElem: ancestor(item, '.nicoadVideoItemWrapper'),
        }
      },
      pendingMoviesInvisibleCss() {
        return `.contentBody.video.uad .item,
#tsukuaso .item,
.contentBody.video.uad .nicoadVideoItemWrapper {
  visibility: hidden;
}
.contentBody.video.uad .item[data-video-item-muted],
.contentBody.video.uad .item[data-video-item-sensitive],
.contentBody.video.uad .item.nrn-thumb-info-done,
#tsukuaso .item.nrn-thumb-info-done,
.contentBody.video.uad.searchUad .item,
.contentBody.video.uad .nicoadVideoItemWrapper.nrn-thumb-info-done,
.contentBody.video.uad .nicoadVideoItemWrapper.nrn-thumb-info-done .item {
  visibility: inherit;
}
`
      },
    })
    return SearchPage
  })(NicoPage)

  var Controller = (function() {
    var isMovieAnchor = function(e) {
      return e.dataset.nrnMovieAnchor === 'true'
    }
    var movieAnchor = function(child) {
      for (var n = child; n; n = n.parentNode) {
        if (n.nodeType !== Node.ELEMENT_NODE) return null
        if (n.tagName === 'BUTTON') return null
        if (isMovieAnchor(n)) return n
      }
    }
    var dataOfMovieAnchor = function(e) {
      return {
        id: e.dataset.nrnMovieId,
        title: e.dataset.nrnMovieTitle,
      }
    }
    var Controller = function(config, page) {
      this.config = config
      this.page = page
    }
    Controller.prototype = {
      addListenersTo(eventTarget) {
        eventTarget.addEventListener('change', this._changed.bind(this))
        eventTarget.addEventListener('click', this._clicked.bind(this))
      },
      _changed(event) {
        switch (event.target.id) {
          case 'nrn-visited-movie-view-mode-select':
            this.config.visitedMovieViewMode.value = event.target.value; break
          case 'nrn-visible-contributor-type-select':
            this.config.visibleContributorType.value = event.target.value; break
          case 'nrn-ng-movie-visible-checkbox':
            this.config.ngMovieVisible.value = event.target.checked; break
        }
      },
      _addVisitedMovie(target) {
        var d = dataOfMovieAnchor(movieAnchor(target))
        this.config.visitedMovies.addAsync(d.id, d.title)
      },
      _toggleData(target, add, remove) {
        var ds = target.dataset
        switch (ds.type) {
          case 'add': add.call(this, ds); break
          case 'remove': remove.call(this, ds); break
          default: throw new Error(ds.type)
        }
      },
      _toggleVisitedMovie(target) {
        this._toggleData(target, function(ds) {
          this.config.visitedMovies.addAsync(ds.movieId, ds.movieTitle)
        }, function(ds) {
          this.config.visitedMovies.removeAsync([ds.movieId])
        })
      },
      _toggleNgMovie(target) {
        this._toggleData(target, function(ds) {
          this.config.ngMovies.addAsync(ds.movieId, ds.movieTitle)
        }, function(ds) {
          this.config.ngMovies.removeAsync([ds.movieId])
        })
      },
      _toggleNgTitle(target) {
        this._toggleData(target, function(ds) {
          ConfigDialog.promptNgTitle(this.config, ds.movieTitle)
        }, function(ds) {
          this.config.ngTitles.removeAsync([ds.ngTitle])
        })
      },
      _toggleNgTag(target) {
        this._toggleData(target, function(ds) {
          if (this.config.addToNgLockedTags.value && ds.lock) {
            this.config.ngLockedTags.addAsync(ds.tagName);
          } else {
            this.config.ngTags.addAsync(ds.tagName);
          }
        }, function(ds) {
          this.config.ngTags.removeAsync([ds.tagName])
          this.config.ngLockedTags.removeAsync([ds.tagName])
        })
      },
      _toggleContributorNgId(target) {
        var name = function(ds) {
          return Contributor.new(ds.contributorType, ds.id, ds.name).ngIdStoreName
        }
        this._toggleData(target, function(ds) {
          this.config[name(ds)].addAsync(parseInt(ds.id), ds.name)
        }, function(ds) {
          this.config[name(ds)].removeAsync([parseInt(ds.id)])
        })
      },
      _toggleNgUserName(target) {
        this._toggleData(target, function(ds) {
          ConfigDialog.promptNgUserName(this.config, ds.name)
        }, function(ds) {
          this.config.ngUserNames.removeAsync([ds.matched])
        })
      },
      _clicked(event) {
        var e = event.target
        if (e.id === 'nrn-config-button') {
          this.page.showConfigDialog(this.config)
        } else if (movieAnchor(e)) {
          this._addVisitedMovie(e)
        } else if (e.classList.contains('nrn-visit-button')) {
          this._toggleVisitedMovie(e)
        } else if (e.classList.contains('nrn-movie-ng-button')) {
          this._toggleNgMovie(e)
        } else if (e.classList.contains('nrn-title-ng-button')) {
          this._toggleNgTitle(e)
        } else if (e.classList.contains('nrn-movie-info-toggle')) {
          this.page.getMovieRootBy(e).toggleMovieInfo()
        } else if (e.classList.contains('nrn-description-open-button')
                || e.classList.contains('nrn-description-close-button')) {
          this.page.getMovieRootBy(e).toggleDescription()
        } else if (e.classList.contains('nrn-tag-ng-button')) {
          this._toggleNgTag(e)
        } else if (e.classList.contains('nrn-contributor-ng-button')) {
          this._toggleContributorNgId(e)
        } else if (e.classList.contains('nrn-contributor-ng-id-button')) {
          this._toggleContributorNgId(e)
        } else if (e.classList.contains('nrn-contributor-ng-name-button')) {
          this._toggleNgUserName(e)
        }
      },
    }
    return Controller
  })()

  var Main = (function() {
    var createMovieRoot = function(resultOfParsing, page, movieViewMode) {
      var movie = movieViewMode.movie
      var result = page.createMovieRoot(resultOfParsing)
      result.actionPane
        = new NicoPage.ActionPane(page.doc, movie).bindToMovie(movie)
      result.setMovieInfoToggleIfRequired()
      result.markMovieAnchor()
      result.id = movie.id
      result.title = movie.title
      result.bindToMovieViewMode(movieViewMode)
      result.bindToConfig(movieViewMode.config)
      result.bindToMovie(movie)
      return result
    }
    var createMovieRoots = function(resultsOfParsing, model, page, controller) {
      for (var r of resultsOfParsing) {
        var movie = model.movies.get(r.movie.id)
        var movieViewMode = model.movieViewModes.get(movie)
        var root = createMovieRoot(r, page, movieViewMode)
        root.movieTitle = new NicoPage.MovieTitle(root.titleElem).bindToMovie(movie)
        page.mapToggleTo(root)
        root.preventPageTransition(controller);
      }
    }
    var setup = function(resultsOfParsing, model, page, controller) {
      model.createMovies(resultsOfParsing)
      createMovieRoots(resultsOfParsing, model, page, controller)
    }
    var createMessageElem = function(doc, message) {
      var result = doc.createElement('p')
      result.textContent = message
      return result
    }
    function gmXmlHttpRequest() {
      if (typeof GM_xmlhttpRequest === 'undefined')
        return GM.xmlHttpRequest
      return GM_xmlhttpRequest
    }
    var createThumbInfoRequester = function(movies, movieViewModes) {
      var thumbInfo = new ThumbInfo(gmXmlHttpRequest())
        .on('completed', ThumbInfoListener.forCompleted(movies))
        .on('errorOccurred', ThumbInfoListener.forErrorOccurred(movies))
      return function(prefer) {
        thumbInfo.request(
          movieViewModes.sort().map(function(m) { return m.movie.id }), prefer)
      }
    }
    var getThumbInfoRequester = function(movies, movieViewModes) {
      return movies.config.useGetThumbInfo.value
           ? createThumbInfoRequester(movies, movieViewModes)
           : function() {}
    }
    var createModel = function(config) {
      var movies = new Movies(config)
      var movieViewModes = new MovieViewModes(config)
      var requestThumbInfo = getThumbInfoRequester(movies, movieViewModes)
      return {
        config,
        movies,
        movieViewModes,
        requestThumbInfo,
        createMovies(resultsOfParsing) {
          movies.setIfAbsent(resultsOfParsing.map(function(r) {
            return new Movie(r.movie.id, r.movie.title)
          }))
        },
      }
    }
    var createView = function(page, controller) {
      var configBar = page.createConfigBar()
      return {
        page,
        addConfigBar() {
          page.addConfigBar(configBar)
        },
        _bindToConfig(config) {
          page.bindToConfig(config)
          configBar.bindToConfig(config)
        },
        bindToModel(model) {
          this._bindToConfig(model.config)
        },
        bindToWindow() {
        },
        setup(model, targetElem) {
          setup(page.parse(targetElem), model, page, controller)
        },
        setupAndRequestThumbInfo(model, targetElem) {
          this.setup(model, targetElem)
          model.requestThumbInfo()
        },
        observeMutation(model) {
          page.observeMutation(function(resultOfParsing, prefer) {
            setup(resultOfParsing, model, page, controller)
            model.requestThumbInfo(prefer)
          })
        },
      }
    }
    function addStyle(style) {
      const e = document.createElement('style');
      e.textContent = style;
      document.head.appendChild(e);
    }
    function gmGetValue() {
      if (typeof GM_getValue === 'undefined')
        return GM.getValue
      return GM_getValue
    }
    function gmSetValue() {
      if (typeof GM_setValue === 'undefined')
        return GM.setValue
      return GM_setValue
    }
    var domContentLoaded = async function() {
      try {
        const page = getPage();
        addStyle(page.css)
        const config = new Config(gmGetValue(), gmSetValue())
        await config.sync()
        var model = createModel(config)
        const ctrl = new Controller(model.config, page);
        ctrl.addListenersTo(page.doc.body)
        var view = createView(page, ctrl)
        view.addConfigBar()
        view.bindToModel(model)
        view.bindToWindow()
        view.setupAndRequestThumbInfo(model)
        view.observeMutation(model)
        if (!model.config.useGetThumbInfo.value) {
          removePendingMovieInvisibleStyle();
        }
      } catch (e) {
        console.error(e)
        removePendingMovieInvisibleStyle();
      }
    }
    var getPage = function() {
      if (SearchPage.is(document.location) && document.querySelector('.BaseLayout')) {
        return new SearchPage(document);
      }
      return new ListPage(document);
    }
    const createPendingMoviesInvisibleStyle = css => {
      const result = document.createElement('style');
      result.id = 'nrn-pending-movies-hide-style';
      result.textContent = css;
      return result;
    };
    const addPendingMoviesInvisibleStyle = css => {
      if (!document.head) {
        new MutationObserver((recs, observer) => {
          if (!document.head) return;
          document.head.appendChild(createPendingMoviesInvisibleStyle(css));
          observer.disconnect();
        }).observe(document, {childList: true, subtree: true});
      } else {
        document.head.appendChild(createPendingMoviesInvisibleStyle(css));
      }
    };
    const removePendingMovieInvisibleStyle = () => {
      document.getElementById('nrn-pending-movies-hide-style')?.remove();
    };
    const setPendingMoviesInvisible = () => {
      let css = ListPage.pendingMoviesInvisibleCss();
      if (SearchPage.is(location)) css += SearchPage.pendingMoviesInvisibleCss();
      addPendingMoviesInvisibleStyle(css);
    };
    var main = function() {
      setPendingMoviesInvisible();
      if (['interactive', 'complete'].includes(document.readyState)) {
        domContentLoaded();
      } else {
        document.addEventListener('DOMContentLoaded', domContentLoaded);
      }
    }
    return {main}
  })()

  Main.main()
})()
