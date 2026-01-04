// ==UserScript==
// @id                 548277
// @namespace          runonstof
// @name               ScriptManager
// @version            1.0.9
// @description        Download and manage CustomNPCs scripts in-game, without having to access any files!
// @author             Runonstof
// @license            MIT
// @minecraft          1.20.1
// @match              https://customnpcs.com
// @downloadURL https://update.greasyfork.org/scripts/548277/ScriptManager.user.js
// @updateURL https://update.greasyfork.org/scripts/548277/ScriptManager.meta.js
// ==/UserScript==

function _arrayLikeToArray(r, a) {
  (null == a || a > r.length) && (a = r.length);
  for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e];
  return n;
}
function _arrayWithHoles(r) {
  if (Array.isArray(r)) return r;
}
function _assertThisInitialized(e) {
  if (void 0 === e) throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  return e;
}
function _callSuper(t, o, e) {
  return o = _getPrototypeOf(o), _possibleConstructorReturn(t, _isNativeReflectConstruct() ? Reflect.construct(o, e || [], _getPrototypeOf(t).constructor) : o.apply(t, e));
}
function _classCallCheck(a, n) {
  if (!(a instanceof n)) throw new TypeError("Cannot call a class as a function");
}
function _construct(t, e, r) {
  if (_isNativeReflectConstruct()) return Reflect.construct.apply(null, arguments);
  var o = [null];
  o.push.apply(o, e);
  var p = new (t.bind.apply(t, o))();
  return r && _setPrototypeOf(p, r.prototype), p;
}
function _defineProperties(e, r) {
  for (var t = 0; t < r.length; t++) {
    var o = r[t];
    o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, _toPropertyKey(o.key), o);
  }
}
function _createClass(e, r, t) {
  return r && _defineProperties(e.prototype, r), t && _defineProperties(e, t), Object.defineProperty(e, "prototype", {
    writable: !1
  }), e;
}
function _createForOfIteratorHelper(r, e) {
  var t = "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"];
  if (!t) {
    if (Array.isArray(r) || (t = _unsupportedIterableToArray(r)) || e && r && "number" == typeof r.length) {
      t && (r = t);
      var n = 0,
        F = function () {};
      return {
        s: F,
        n: function () {
          return n >= r.length ? {
            done: !0
          } : {
            done: !1,
            value: r[n++]
          };
        },
        e: function (r) {
          throw r;
        },
        f: F
      };
    }
    throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
  }
  var o,
    a = !0,
    u = !1;
  return {
    s: function () {
      t = t.call(r);
    },
    n: function () {
      var r = t.next();
      return a = r.done, r;
    },
    e: function (r) {
      u = !0, o = r;
    },
    f: function () {
      try {
        a || null == t.return || t.return();
      } finally {
        if (u) throw o;
      }
    }
  };
}
function _defineProperty(e, r, t) {
  return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, {
    value: t,
    enumerable: !0,
    configurable: !0,
    writable: !0
  }) : e[r] = t, e;
}
function _getPrototypeOf(t) {
  return _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf.bind() : function (t) {
    return t.__proto__ || Object.getPrototypeOf(t);
  }, _getPrototypeOf(t);
}
function _inherits(t, e) {
  if ("function" != typeof e && null !== e) throw new TypeError("Super expression must either be null or a function");
  t.prototype = Object.create(e && e.prototype, {
    constructor: {
      value: t,
      writable: !0,
      configurable: !0
    }
  }), Object.defineProperty(t, "prototype", {
    writable: !1
  }), e && _setPrototypeOf(t, e);
}
function _isNativeFunction(t) {
  try {
    return -1 !== Function.toString.call(t).indexOf("[native code]");
  } catch (n) {
    return "function" == typeof t;
  }
}
function _isNativeReflectConstruct() {
  try {
    var t = !Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {}));
  } catch (t) {}
  return (_isNativeReflectConstruct = function () {
    return !!t;
  })();
}
function _iterableToArray(r) {
  if ("undefined" != typeof Symbol && null != r[Symbol.iterator] || null != r["@@iterator"]) return Array.from(r);
}
function _iterableToArrayLimit(r, l) {
  var t = null == r ? null : "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"];
  if (null != t) {
    var e,
      n,
      i,
      u,
      a = [],
      f = !0,
      o = !1;
    try {
      if (i = (t = t.call(r)).next, 0 === l) {
        if (Object(t) !== t) return;
        f = !1;
      } else for (; !(f = (e = i.call(t)).done) && (a.push(e.value), a.length !== l); f = !0);
    } catch (r) {
      o = !0, n = r;
    } finally {
      try {
        if (!f && null != t.return && (u = t.return(), Object(u) !== u)) return;
      } finally {
        if (o) throw n;
      }
    }
    return a;
  }
}
function _nonIterableRest() {
  throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
}
function ownKeys(e, r) {
  var t = Object.keys(e);
  if (Object.getOwnPropertySymbols) {
    var o = Object.getOwnPropertySymbols(e);
    r && (o = o.filter(function (r) {
      return Object.getOwnPropertyDescriptor(e, r).enumerable;
    })), t.push.apply(t, o);
  }
  return t;
}
function _objectSpread2(e) {
  for (var r = 1; r < arguments.length; r++) {
    var t = null != arguments[r] ? arguments[r] : {};
    r % 2 ? ownKeys(Object(t), !0).forEach(function (r) {
      _defineProperty(e, r, t[r]);
    }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) {
      Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r));
    });
  }
  return e;
}
function _objectWithoutProperties(e, t) {
  if (null == e) return {};
  var o,
    r,
    i = _objectWithoutPropertiesLoose(e, t);
  if (Object.getOwnPropertySymbols) {
    var n = Object.getOwnPropertySymbols(e);
    for (r = 0; r < n.length; r++) o = n[r], -1 === t.indexOf(o) && {}.propertyIsEnumerable.call(e, o) && (i[o] = e[o]);
  }
  return i;
}
function _objectWithoutPropertiesLoose(r, e) {
  if (null == r) return {};
  var t = {};
  for (var n in r) if ({}.hasOwnProperty.call(r, n)) {
    if (-1 !== e.indexOf(n)) continue;
    t[n] = r[n];
  }
  return t;
}
function _possibleConstructorReturn(t, e) {
  if (e && ("object" == typeof e || "function" == typeof e)) return e;
  if (void 0 !== e) throw new TypeError("Derived constructors may only return object or undefined");
  return _assertThisInitialized(t);
}
function _setPrototypeOf(t, e) {
  return _setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function (t, e) {
    return t.__proto__ = e, t;
  }, _setPrototypeOf(t, e);
}
function _slicedToArray(r, e) {
  return _arrayWithHoles(r) || _iterableToArrayLimit(r, e) || _unsupportedIterableToArray(r, e) || _nonIterableRest();
}
function _toArray(r) {
  return _arrayWithHoles(r) || _iterableToArray(r) || _unsupportedIterableToArray(r) || _nonIterableRest();
}
function _toPrimitive(t, r) {
  if ("object" != typeof t || !t) return t;
  var e = t[Symbol.toPrimitive];
  if (void 0 !== e) {
    var i = e.call(t, r || "default");
    if ("object" != typeof i) return i;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return ("string" === r ? String : Number)(t);
}
function _toPropertyKey(t) {
  var i = _toPrimitive(t, "string");
  return "symbol" == typeof i ? i : i + "";
}
function _typeof(o) {
  "@babel/helpers - typeof";

  return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) {
    return typeof o;
  } : function (o) {
    return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o;
  }, _typeof(o);
}
function _unsupportedIterableToArray(r, a) {
  if (r) {
    if ("string" == typeof r) return _arrayLikeToArray(r, a);
    var t = {}.toString.call(r).slice(8, -1);
    return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0;
  }
}
function _wrapNativeSuper(t) {
  var r = "function" == typeof Map ? new Map() : void 0;
  return _wrapNativeSuper = function (t) {
    if (null === t || !_isNativeFunction(t)) return t;
    if ("function" != typeof t) throw new TypeError("Super expression must either be null or a function");
    if (void 0 !== r) {
      if (r.has(t)) return r.get(t);
      r.set(t, Wrapper);
    }
    function Wrapper() {
      return _construct(t, arguments, _getPrototypeOf(this).constructor);
    }
    return Wrapper.prototype = Object.create(t.prototype, {
      constructor: {
        value: Wrapper,
        enumerable: !1,
        writable: !0,
        configurable: !0
      }
    }), _setPrototypeOf(Wrapper, t);
  }, _wrapNativeSuper(t);
}

if (!Array.from) {
  Object.defineProperty(Array, 'from', {
    enumerable: false,
    configurable: true,
    writable: true,
    value: function value(arrayLike) {
      if (arrayLike == null) {
        throw new TypeError('Array.from requires an array-like object - not null or undefined');
      }

      // Handle array-like objects
      var len = arrayLike.length >>> 0;
      var result = new Array(len);
      for (var i = 0; i < len; i++) {
        result[i] = arrayLike[i];
      }
      return result;
    }
  });
}
if (!Array.prototype.find) {
  Object.defineProperty(Array.prototype, 'find', {
    enumerable: false,
    configurable: true,
    writable: true,
    value: function value(callback) {
      for (var i = 0; i < this.length; i++) {
        if (callback(this[i], i, this)) {
          return this[i];
        }
      }
      return undefined;
    }
  });
}
if (!Array.prototype.flat) {
  Object.defineProperty(Array.prototype, 'flat', {
    value: function value(depth) {

      var array = this;
      var maxDepth = depth === Infinity ? Number.MAX_SAFE_INTEGER : parseInt((depth === null || depth === void 0 ? void 0 : depth.toString()) || '1', 10) || 1;
      var currentDepth = 0;

      // It's not an array or it's an empty array, return the object.
      if (!Array.isArray(array) || !array.length) {
        return array;
      }

      // If the first element is itself an array and we're not at maxDepth,
      // flatten it with a recursive call first.
      // If the first element is not an array, an array with just that element IS the
      // flattened representation.
      // **Edge case**: If the first element is an empty element/an "array hole", skip it.
      // (see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/flat#Examples)
      var firstElemFlattened = Array.isArray(array[0]) && currentDepth < maxDepth ? array[0].flat(maxDepth - 1) : array[0] === undefined ? [] : [array[0]];
      return firstElemFlattened.concat(array.slice(1).flat(maxDepth - 1));
    },
    enumerable: false,
    configurable: true,
    writable: true
  });
}
if (!String.prototype.includes) {
  Object.defineProperty(String.prototype, 'includes', {
    enumerable: false,
    configurable: true,
    writable: true,
    value: function value(search, start) {
      if (typeof start !== 'number') {
        start = 0;
      }
      if (start + search.length > this.length) {
        return false;
      }
      return this.indexOf(search, start) !== -1;
    }
  });
}
if (!Object.assign) {
  Object.defineProperty(Object, 'assign', {
    enumerable: false,
    configurable: true,
    writable: true,
    value: function value(target) {
      if (target === undefined || target === null) {
        throw new TypeError('Cannot convert first argument to object');
      }
      var to = Object(target);
      for (var i = 0; i < (arguments.length <= 1 ? 0 : arguments.length - 1); i++) {
        var nextSource = i + 1 < 1 || arguments.length <= i + 1 ? undefined : arguments[i + 1];
        if (nextSource === undefined || nextSource === null) {
          continue;
        }
        var keysArray = Object.keys(Object(nextSource));
        for (var nextIndex = 0; nextIndex < keysArray.length; nextIndex++) {
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
if (!Object.entries) {
  Object.defineProperty(Object, 'entries', {
    enumerable: false,
    configurable: true,
    writable: true,
    value: function value(obj) {
      var ownProps = Object.keys(obj);
      var i = ownProps.length;
      var resArray = new Array(i);
      while (i--) {
        resArray[i] = [ownProps[i], obj[ownProps[i]]];
      }
      return resArray;
    }
  });
}
if (!Object.fromEntries) {
  Object.defineProperty(Object, 'fromEntries', {
    enumerable: false,
    configurable: true,
    writable: true,
    value: function value(entries) {
      var obj = {};
      var entriesArray = Array.from(entries);
      for (var i = 0; i < entriesArray.length; i++) {
        var _entriesArray$i = _slicedToArray(entriesArray[i], 2),
          key = _entriesArray$i[0],
          value = _entriesArray$i[1];
        obj[key] = value;
      }
      return obj;
    }
  });
}
Java.type('java.util.Base64');
Java.type('java.lang.String');

function Color(hex) {
  this.hex = hex;
  this.alpha = function (alpha) {
    return new Color(this.hex & 0xFFFFFF00 | alpha * 255);
  };
  this.toHex = function () {
    return this.hex;
  };
}
var COLORS = {
  RED: new Color(0xFF0000FF),
  GREEN: new Color(0x00FF00FF),
  BLUE: new Color(0x0000FFFF),
  YELLOW: new Color(0xFFFF00FF),
  PURPLE: new Color(0xFF00FFFF),
  ORANGE: new Color(0xFFA500FF),
  PINK: new Color(0xFFC0CBFF),
  GRAY: new Color(0x808080FF),
  BLACK: new Color(0x000000FF),
  WHITE: new Color(0xFFFFFFFF)
};

var API = Java.type('noppes.npcs.api.NpcAPI').Instance();
var world = API.getIWorld('minecraft:overworld');
function dump() {
  for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
    args[_key] = arguments[_key];
  }
  for (var _i = 0, _args = args; _i < _args.length; _i++) {
    var arg = _args[_i];
    if (!(arg instanceof Error) && _typeof(arg) === 'object') {
      arg = JSON.stringify(arg, null, 2);
    }
    world.broadcast(arg);
  }
}

var _GUI_IDS = {};
var _GUI_EVENT_LISTENERS = {};
function id(name) {
  // generate random name if name is not provided
  if (!name) {
    name = Math.random().toString(36).substring(2, 15);
  }
  return _GUI_IDS[name] = _GUI_IDS[name] || Object.keys(_GUI_IDS).length + 1;
}
function listen(id, callback) {
  if (!_GUI_EVENT_LISTENERS[id]) {
    _GUI_EVENT_LISTENERS[id] = [];
  }
  _GUI_EVENT_LISTENERS[id].push(callback);
}
function unlistenAll(id) {
  if (!_GUI_EVENT_LISTENERS[id]) {
    return;
  }
  _GUI_EVENT_LISTENERS[id] = [];
}
function emit(id, data) {
  if (!_GUI_EVENT_LISTENERS[id]) {
    return;
  }
  _GUI_EVENT_LISTENERS[id].forEach(function (callback) {
    return callback(data);
  });
}
var BaseGui = /*#__PURE__*/function () {
  function BaseGui(id, width, height, player) {
    _classCallCheck(this, BaseGui);
    this.gui = API.createCustomGui(id, width, height, false, player);
    this.state = {};
    this.lastState = null;
    this.player = player;
  }
  return _createClass(BaseGui, [{
    key: "clearGui",
    value: function clearGui() {
      var gui = this.player.getCustomGui();
      if (!gui) {
        return;
      }
      var components = Java.from(gui.getComponents());
      components.forEach(function (component) {
        gui.removeComponent(component.getID());
      });
      var scrollpanel = gui.getScrollingPanel();
      var scrollComponents = Java.from(scrollpanel.getComponents());
      scrollComponents.forEach(function (component) {
        scrollpanel.removeComponent(component.getID());
      });
    }

    /**
     * Sets the current state as the last state
     * Warning: Only shallow copy of the state is made
     */
  }, {
    key: "pushState",
    value: function pushState() {
      this.lastState = {};
      for (var key in this.state) {
        this.lastState[key] = this.state[key];
      }
    }
  }, {
    key: "stateChanged",
    value: function stateChanged(key) {
      if (!this.lastState) {
        return true;
      }
      return this.lastState[key] !== this.state[key];
    }
  }, {
    key: "init",
    value: function init() {
      // Optional override
    }
  }, {
    key: "render",
    value: function render() {
      throw new Error('render method must be implemented');
    }
  }, {
    key: "update",
    value: function update() {
      throw new Error('update method must be implemented');
    }
  }, {
    key: "onClose",
    value: function onClose() {
      // Optional override
    }
  }]);
}();
var gui = {
  id: id,
  listen: listen,
  emit: emit,
  unlistenAll: unlistenAll
};

var URL$1 = Java.type("java.net.URL");
var OutputStreamWriter = Java.type("java.io.OutputStreamWriter");
var BufferedReader = Java.type("java.io.BufferedReader");
var InputStreamReader = Java.type("java.io.InputStreamReader");

// Custom error class
var HttpError = /*#__PURE__*/function (_Error) {
  function HttpError(response, responseCode) {
    var _this;
    _classCallCheck(this, HttpError);
    _this = _callSuper(this, HttpError, ["HttpError: ".concat(responseCode)]);
    _this.response = response;
    return _this;
  }
  _inherits(HttpError, _Error);
  return _createClass(HttpError);
}(/*#__PURE__*/_wrapNativeSuper(Error));
function read(connection) {
  var reader = new BufferedReader(new InputStreamReader(connection.getInputStream()));
  var response = "";
  var line;
  while ((line = reader.readLine()) != null) {
    response += line + '\n';
  }
  reader.close();
  return response;
}
function request(method, url) {
  var requestBody = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;
  var headers = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};
  var connection = buildRequest(method, url, requestBody, headers);
  var responseCode = connection.getResponseCode();
  var response = read(connection);
  if (!(responseCode >= 200 && responseCode < 400)) {
    throw new HttpError(response, responseCode);
  }
  connection.disconnect();
  return response;
}
function buildRequest(method, url) {
  var requestBody = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;
  var headers = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};
  url = new URL$1(url);
  var connection = url.openConnection();
  connection.setRequestMethod(method);
  for (var headerName in headers) {
    connection.setRequestProperty(headerName, headers[headerName]);
  }
  if (method === "POST") {
    connection.setRequestProperty("Content-Type", "application/json");
    connection.setDoOutput(true);
    if (requestBody) {
      var writer = new OutputStreamWriter(connection.getOutputStream(), "UTF-8");
      writer.write(JSON.stringify(requestBody));
      writer.flush();
      writer.close();
    }
  } else {
    connection.setDoOutput(false);
  }
  return connection;
}
function get(url) {
  var headers = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  return request("GET", url, null, headers);
}
function post(url, requestBody) {
  var headers = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
  return request("POST", url, requestBody, headers);
}
function getJson(url) {
  var headers = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  return JSON.parse(get(url, headers));
}
function postJson(url, requestBody) {
  var headers = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
  return JSON.parse(post(url, requestBody, headers));
}
var http = {
  get: get,
  post: post,
  getJson: getJson,
  postJson: postJson,
  request: request,
  buildRequest: buildRequest,
  read: read,
  HttpError: HttpError
};

var File = Java.type("java.io.File");
var Files = Java.type("java.nio.file.Files");
var Paths = Java.type("java.nio.file.Paths");
Java.type("java.nio.file.Path");
var CHARSET_UTF_8 = Java.type("java.nio.charset.StandardCharsets").UTF_8;
Java.type('java.nio.file.StandardCopyOption');
var BasicFileAttributes = Java.type('java.nio.file.attribute.BasicFileAttributes');
Java.type('java.nio.file.FileSystems');
function getFileCreationTime(filePath) {
  var path = Paths.get(filePath);
  var attributes = Files.readAttributes(path, BasicFileAttributes.class);
  return attributes.creationTime().toMillis();
}
function readFileGenerator(filePath, callback) {
  var path = Paths.get(filePath);
  var reader = Files.newBufferedReader(path, CHARSET_UTF_8);
  var lines = [];
  try {
    while (true) {
      var line = reader.readLine();
      if (line === null) break;
      var result = callback(line);
      if (result === false) break;
      lines.push(result);
    }
  } catch (e) {
    // Do nothing
  } finally {
    reader.close();
  }
  return lines;
}
function getUniversalPath(fileOrPath) {
  return fileOrPath.toString().replace(/\\/g, '/');
}
function globFiles(startingPath, pattern) {
  var startingPathObj = Paths.get(startingPath);
  var files = Java.from(Files.find(startingPathObj, 512, function (path, attributes) {
    return true;
  }).toArray()).filter(function (path) {
    return new File(path.toString()).isFile();
  }).map(function (path) {
    return getUniversalPath(path.toString()).replace(getUniversalPath(startingPathObj.toString()) + '/', '');
  });
  if (pattern) {
    files = files.filter(function (path) {
      return pattern.test(path);
    });
  }
  return files;
}
function writeToFile(filePath, text) {
  var offset = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;
  var length = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : null;
  var path = Paths.get(filePath);
  try {
    var writer = Files.newBufferedWriter(path, CHARSET_UTF_8);
    writer.write(text, offset || 0, length || text.length);
    writer.close();
    return true;
  } catch (exc) {
    return false;
  }
}

// The Minecraft version this script is compatible with
// Used to check with downloadable scripts
var MINECRAFT_VERSION = '1.20.1';

// The path to the scripts folder
// This is where the scripts will be downloaded to
var SCRIPTS_PATH = getUniversalPath("".concat(API.getLevelDir().toString(), "/scripts/ecmascript"));

// The GreasyFork Script ID of this script
// for self-updating purposes
var SCRIPT_MANAGER_ID = 548277;

// The GreasyFork Script ID of the author list script
// This script is used to retrieve a list of featured and blacklisted authors
var AUTHOR_LIST_SCRIPT_ID = 549558;

// The base URLs for the GreasyFork API
var REPO_BASE_URL = 'https://greasyfork.org';
var REPO_BASE_CDN_URL = 'https://update.greasyfork.org';
var REPO_BASE_API_URL = 'https://api.greasyfork.org';

var URL = Java.type('java.net.URL');
var ScriptsRepo = /*#__PURE__*/function () {
  function ScriptsRepo() {
    _classCallCheck(this, ScriptsRepo);
    /**
     * @type {ScriptInfo[]}
     */
    this.scripts = [];
  }

  /**
   * Should be called in a thread
   */
  return _createClass(ScriptsRepo, [{
    key: "fetchScripts",
    value: function fetchScripts() {
      var _this = this;
      this.scripts = http.getJson("".concat(REPO_BASE_API_URL, "/scripts/by-site/customnpcs.com.json?filter_locale=0")).map(function (info) {
        return new ScriptInfo(_this, info);
      }).filter(function (script) {
        return script.id !== AUTHOR_LIST_SCRIPT_ID;
      }); // Don't include the author list script, it's not a real script
      // this.scripts = TEST_SCRIPTS
      //   .map(info => new ScriptInfo(this, info, null));
    }
  }, {
    key: "getScriptInfo",
    value: function getScriptInfo(id) {
      var versionId = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
      return new ScriptInfo(this, http.getJson("".concat(REPO_BASE_API_URL, "/scripts/").concat(id, ".json").concat(versionId ? "?version=".concat(versionId) : '')), versionId);
    }
  }, {
    key: "getScriptMetadata",
    value: function getScriptMetadata(id) {
      var versionId = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
      return new ScriptMetadata(this.getScriptMetadataRaw(id, versionId));
    }
  }, {
    key: "getScriptMetadataRaw",
    value: function getScriptMetadataRaw(id) {
      var versionId = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
      return http.get("".concat(REPO_BASE_CDN_URL, "/scripts/").concat(id, "/script.meta.js").concat(versionId ? "?version=".concat(versionId) : ''));
    }
  }, {
    key: "getScriptVersions",
    value: function getScriptVersions(id) {
      return http.getJson("".concat(REPO_BASE_API_URL, "/scripts/").concat(id, "/versions.json")).map(function (version) {
        return new ScriptVersion(version);
      });
    }
  }, {
    key: "getScriptContents",
    value: function getScriptContents(id) {
      var versionId = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
      return http.get("".concat(REPO_BASE_CDN_URL, "/scripts/").concat(id, "/script.user.js").concat(versionId ? "?version=".concat(versionId) : ''));
    }
  }]);
}();
var ScriptMetadata = /*#__PURE__*/function () {
  function ScriptMetadata(raw) {
    _classCallCheck(this, ScriptMetadata);
    this.properties = this._parse(raw);
  }
  return _createClass(ScriptMetadata, [{
    key: "value",
    value: function value(key) {
      var _this$properties$key;
      var defaultValue = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
      return (_this$properties$key = this.properties[key]) !== null && _this$properties$key !== void 0 && _this$properties$key.length ? this.properties[key][0] : defaultValue;
    }
  }, {
    key: "setValue",
    value: function setValue(key, value) {
      if (!this.properties.hasOwnProperty(key)) {
        this.properties[key] = [];
      }
      this.properties[key].push(value);
    }
  }, {
    key: "appendValue",
    value: function appendValue(key, value) {
      this.properties = _objectSpread2(_defineProperty({}, key, [value]), this.properties);
    }
  }, {
    key: "values",
    value: function values(key) {
      return this.properties[key] || [];
    }
  }, {
    key: "isCompatibleMcVersion",
    value: function isCompatibleMcVersion() {
      return this.values('minecraft').indexOf(MINECRAFT_VERSION) !== -1;
    }
  }, {
    key: "_parse",
    value: function _parse(raw) {
      var regex = /^\s*\/\/\s*@([^\s]+)\s+([\s\S]+)$/;
      return raw.split(/[\r\n]+/).reduce(function (acc, line) {
        var match = regex.exec(line);
        if (match) {
          var _match = _slicedToArray(match, 3);
            _match[0];
            var key = _match[1],
            value = _match[2];
          if (!acc.hasOwnProperty(key)) {
            acc[key] = [];
          }
          acc[key].push(value);
        }
        return acc;
      }, {});
    }
  }, {
    key: "toString",
    value: function toString() {
      var result = '// ==UserScript==\n';
      for (var key in this.properties) {
        var _iterator = _createForOfIteratorHelper(this.properties[key]),
          _step;
        try {
          for (_iterator.s(); !(_step = _iterator.n()).done;) {
            var value = _step.value;
            var spaces = ' '.repeat(19 - key.length);
            result += "// @".concat(key).concat(spaces).concat(value, "\n");
          }
        } catch (err) {
          _iterator.e(err);
        } finally {
          _iterator.f();
        }
      }
      result += '// ==/UserScript==\n';
      return result;
    }
  }]);
}();
var ScriptInfo = /*#__PURE__*/function () {
  function ScriptInfo(repo, data) {
    var versionId = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;
    _classCallCheck(this, ScriptInfo);
    /**
     * @type {ScriptsRepo}
     */
    this._repo = repo;
    this._metadata = null;
    this._versions = null;
    this.id = parseInt(data.id);
    this.daily_installs = data.daily_installs;
    this.total_installs = data.total_installs;
    this.fan_score = data.fan_score;
    this.good_ratings = data.good_ratings;
    this.ok_ratings = data.ok_ratings;
    this.bad_ratings = data.bad_ratings;
    this.created_at = data.created_at;
    this.code_updated_at = data.code_updated_at;
    this.namespace = data.namespace;
    this.support_url = data.support_url;
    this.contribution_url = data.contribution_url;
    this.contribution_amount = data.contribution_amount;
    /**
     * @type {ScriptAuthor[]}
     */
    this.users = data.users.map(function (user) {
      return new ScriptAuthor(user);
    });
    this.name = data.name;
    this.description = data.description;
    this.url = data.url;
    this.code_url = data.code_url;
    this.code_size = data.code_size;
    this.license = data.license;
    this.version = data.version;
    this.locale = data.locale;
    this.deleted = data.deleted;
    this.version_id = versionId;
  }
  return _createClass(ScriptInfo, [{
    key: "getMetadata",
    value: function getMetadata() {
      if (!this._metadata) {
        this._metadata = this._repo.getScriptMetadata(this.id, this.version_id);
      }
      return this._metadata;
    }
  }, {
    key: "getVersions",
    value: function getVersions() {
      if (!this._versions) {
        this._versions = this._repo.getScriptVersions(this.id);
      }
      return this._versions;
    }
  }, {
    key: "getContents",
    value: function getContents() {
      return this._repo.getScriptContents(this.id, this.version_id);
    }
  }, {
    key: "getReportUrl",
    value:
    /**
     * Get the url to report the script
     * @return {string}
     */
    function getReportUrl() {
      return "".concat(REPO_BASE_URL, "/reports/new?item_class=script&item_id=").concat(this.id);
    }
  }, {
    key: "getFeedbackUrl",
    value:
    /**
     * Get the url to feedback the script
     * @return {string}
     */
    function getFeedbackUrl() {
      return "".concat(REPO_BASE_URL, "/scripts/").concat(this.id, "/feedback");
    }
  }]);
}();
var ScriptAuthor = /*#__PURE__*/_createClass(function ScriptAuthor(data) {
  _classCallCheck(this, ScriptAuthor);
  this.id = data.id;
  this.name = data.name;
  this.created_at = data.created_at;
  this.url = data.url;
});
var ScriptVersion = /*#__PURE__*/_createClass(function ScriptVersion(data) {
  _classCallCheck(this, ScriptVersion);
  this.version = data.version;
  this.created_at = data.created_at;
  this.url = data.url;
  this.code_url = data.code_url;
  var query = new URL(this.url).getQuery().split('&').reduce(function (acc, keyValue) {
    var _keyValue$split = keyValue.split('='),
      _keyValue$split2 = _slicedToArray(_keyValue$split, 2),
      key = _keyValue$split2[0],
      value = _keyValue$split2[1];
    acc[key] = value;
    return acc;
  }, {});
  if (!query.hasOwnProperty('version')) {
    throw new Error('Version ID not found in Script Version URL');
  }
  this.version_id = parseInt(query.version);
});

var Thread = Java.type('java.lang.Thread');
function handleAsyncError(error) {
  dump('§cError: ' + error.message + ' ' + error.fileName + ':' + error.lineNumber);
  dump('§cStack: ' + (error.stack || error.trace || error.toString()));
}
function doAsync(callback) {
  var errorCallback = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
  var thread = new Thread(function () {
    var result;
    try {
      result = callback();
    } catch (e) {
      if (errorCallback) {
        errorCallback(e, handleAsyncError);
      } else {
        handleAsyncError(e);
      }
    }
    return result;
  });
  thread.start();
  return thread;
}

function chunkate(string, length) {
  return string.split(/[\r\n]+/).reduce(function (acc, line) {
    // split the line into chunks of length using slice
    // for (let i = 0; i < line.length; i += length) {
    //     acc.push(line.slice(i, i + length));
    // }

    var words = line.split(' ');
    var pushLine = '';
    words.forEach(function (word) {
      var pushLineCheckLength = pushLine.replace(/§[a-f0-9]/g, '').length;
      var wordCheckLength = word.replace(/§[a-f0-9]/g, '').length;
      if (pushLineCheckLength + wordCheckLength > length) {
        acc.push(pushLine.trim());
        pushLine = word + ' ';
      } else {
        pushLine += word + ' ';
      }
    });
    if (pushLine) {
      acc.push(pushLine.trim());
    }
    return acc;
  }, []);
}
function slugify(string) {
  return string.toLowerCase().replace(/ /g, '_').replace(/[^a-z0-9_]/g, '');
}

var _excluded = ["children"],
  _excluded2 = ["children"];
function createElement(type, _ref) {
  var _ref$children = _ref.children,
    children = _ref$children === void 0 ? [] : _ref$children,
    props = _objectWithoutProperties(_ref, _excluded);
  if (typeof children === 'function') {
    children = [children];
  }
  // Flatten children array
  children = children.flat(Infinity).filter(function (child) {
    return child !== null && child !== undefined && child !== false;
  });

  // Handle different element types
  if (typeof type === 'string') {
    return createGuiElementCallback(type, _objectSpread2(_objectSpread2({}, props), {}, {
      children: children
    }));
  } else if (typeof type === 'function') {
    // Handle functional components
    return type(_objectSpread2(_objectSpread2({}, props), {}, {
      children: children
    }));
  } else {
    throw new Error("Unknown element type: ".concat(type));
  }
}

// jsx function for single child elements
function jsx(type, props, key) {
  return createElement(type, props);
}

// jsxs function for multiple children elements
function jsxs(type, props, key) {
  return createElement(type, props);
}

// Fragment support
function Fragment(_ref2) {
  var children = _ref2.children,
    _ref2$x = _ref2.x,
    x = _ref2$x === void 0 ? 0 : _ref2$x,
    _ref2$y = _ref2.y,
    y = _ref2$y === void 0 ? 0 : _ref2$y;
  var parentContext = {
    x: x,
    y: y
  };
  return function (gui) {
    var higherParentContext = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    var _higherParentContext$ = higherParentContext.x,
      hpX = _higherParentContext$ === void 0 ? 0 : _higherParentContext$,
      _higherParentContext$2 = higherParentContext.y,
      hpY = _higherParentContext$2 === void 0 ? 0 : _higherParentContext$2;
    var useParentContext = {
      x: hpX + parentContext.x,
      y: hpY + parentContext.y
    };
    children.forEach(function (child) {
      return typeof child === 'function' ? child(gui, useParentContext) : child;
    });
    return {
      children: children
    };
  };
}
function createGuiElementCallback(type, _ref3) {
  var children = _ref3.children,
    props = _objectWithoutProperties(_ref3, _excluded2);
  if (typeof props.id === 'undefined') {
    throw new Error("id property is required for ".concat(type));
  }
  var dynamicProps = ['enabled', 'visible', 'scale', 'centered', 'text', 'label', 'color', 'hoverText', 'thickness', 'hasSearch', 'list'];

  /**
   *
   * @param {ICustomGui} gui
   * @returns {ICustomGuiComponent}
   */
  var findOrCreateComponent = function findOrCreateComponent(gui) {
    var parentContext = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    var component;
    if (type !== 'scrollpanel' && (component = gui.getComponent(id(props.id)))) {
      return component;
    }
    var sumParentContextProperty = function sumParentContextProperty(localProp) {
      var parentProp = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
      var localDefault = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;
      parentProp = parentProp || localProp;
      if (typeof parentContext[parentProp] === 'undefined') {
        return;
      }
      var localValue = props.hasOwnProperty(localProp) ? props[localProp] : localDefault;

      // CHECK: this can have side effects
      props[localProp] = parentContext[parentProp] + localValue;
    };
    sumParentContextProperty('x');
    sumParentContextProperty('y');
    switch (type) {
      case 'button':
        return gui.addButton(id(props.id), props.text, props.x || 0, props.y || 0, props.width || 0, props.height || 0);
      case 'textured-button':
        var button = gui.addTexturedButton(id(props.id), props.text, props.x || 0, props.y || 0, props.width || 0, props.height || 0, props.texture || '');
        return button;
      case 'label':
        return gui.addLabel(id(props.id), props.text, props.x || 0, props.y || 0, props.width || 0, props.height || 0, props.color || 0xFFFFFFFF);
      case 'textfield':
        return gui.addTextField(id(props.id), props.x || 0, props.y || 0, props.width || 0, props.height || 0);
      case 'scroll':
        return gui.addScroll(id(props.id), props.x || 0, props.y || 0, props.width || 0, props.height || 0, props.list || []);
      case 'line':
        sumParentContextProperty('x1', 'x');
        sumParentContextProperty('y1', 'y');
        sumParentContextProperty('x2', 'x');
        sumParentContextProperty('y2', 'y');
        return gui.addColoredLine(id(props.id), props.x1 || 0, props.y1 || 0, props.x2 || 0, props.y2 || 0, props.color || 0xFFFFFFFF, props.thickness || 1);
      case 'scroll-panel':
        var panel = gui.getScrollingPanel();
        if (!props.initialized) {
          panel.init(props.x || 0, props.y || 0, props.width || 0, props.height || 0);
        }
        children.forEach(function (child) {
          return typeof child === 'function' ? child(panel) : child;
        });
        return panel;
    }
    throw new Error("Unknown element type: ".concat(type));
  };
  return function (gui$1) {
    var parentContext = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    var component = findOrCreateComponent(gui$1, parentContext);
    gui.unlistenAll(id(props.id));
    if (props.hasOwnProperty('onClick')) {
      gui.listen(id(props.id), props.onClick);
    }
    if (props.hasOwnProperty('onSelect')) {
      gui.listen(id(props.id), props.onSelect);
    }
    for (var _i = 0, _dynamicProps = dynamicProps; _i < _dynamicProps.length; _i++) {
      var dynamicProp = _dynamicProps[_i];
      if (!props.hasOwnProperty(dynamicProp)) {
        continue;
      }

      // const getterFunction = `get${dynamicProp.charAt(0).toUpperCase() + dynamicProp.slice(1)}`;
      var setterFunction = "set".concat(dynamicProp.charAt(0).toUpperCase() + dynamicProp.slice(1));
      try {
        component[setterFunction](props[dynamicProp]);
      } catch (error) {
        throw new Error("Failed to set ".concat(dynamicProp, " using ").concat(setterFunction, "() on ").concat(type, " with id ").concat(props.id, ": ").concat(error));
      }
    }
    return {
      component: component
    };
  };
}
function renderToGui(gui, element) {
  return element(gui);
}

/**
 * Compares two version strings
 * @param {string} version1
 * @param {string} version2
 * @returns {number} -1 if version1 is less than version2, 1 if version1 is greater than version2, 0 if they are equal
 */
function compareVersions(version1, version2) {
  var v1 = version1.split('.');
  var v2 = version2.split('.');
  for (var i = 0; i < v1.length; i++) {
    var v1Part = parseInt(v1[i] || '0');
    var v2Part = parseInt(v2[i] || '0');
    if (v1Part > v2Part) {
      return 1;
    }
    if (v1Part < v2Part) {
      return -1;
    }
  }
  return 0;
}

var InstalledScriptsRepo = /*#__PURE__*/function () {
  function InstalledScriptsRepo() {
    _classCallCheck(this, InstalledScriptsRepo);
    // this.repoFile = `${API.getLevelDir().toString()}/scripts/ecmascript/scriptmanager_scripts.json`;
    this.scriptsPath = getUniversalPath("".concat(API.getLevelDir().toString(), "/scripts/ecmascript"));
    this.scriptsRepo = new ScriptsRepo();
    this.fileFilter = /\.js$/;

    /**
     * @type {InstalledScript[]}
     */
    this.scripts = [];
    this._index = {
      id: {}
    };
    this.scriptManagerUpdateChecked = false;
    this.scriptManagerUpdateAvailable = false;
    this.scriptManagerUpdateVersion = null;
    this.scriptManagerInstalledVersion = null;
  }
  return _createClass(InstalledScriptsRepo, [{
    key: "init",
    value: function init() {
      this.reloadScripts();
    }
  }, {
    key: "checkForScriptManagerUpdate",
    value: function checkForScriptManagerUpdate() {
      var _this$scripts$find;
      if (this.scriptManagerUpdateChecked) return;
      this.scriptManagerUpdateChecked = true;
      this.scriptManagerUpdateAvailable = false;
      var scriptManager = this.scriptsRepo.getScriptInfo(SCRIPT_MANAGER_ID);
      var scriptManagerVersion = scriptManager.version;
      var installedVersion = ((_this$scripts$find = this.scripts.find(function (script) {
        return script.id === SCRIPT_MANAGER_ID;
      })) === null || _this$scripts$find === void 0 ? void 0 : _this$scripts$find.version) || null;

      // this.scriptManagerUpdateAvailable = true;
      if (installedVersion === null || compareVersions(installedVersion, scriptManagerVersion) < 0) {
        this.scriptManagerUpdateAvailable = true;
        this.scriptManagerUpdateVersion = scriptManagerVersion;
        this.scriptManagerInstalledVersion = installedVersion;
      }
    }
  }, {
    key: "reloadScripts",
    value: function reloadScripts() {
      var _this = this;
      this.scripts = globFiles(this.scriptsPath, this.fileFilter).reduce(function (collection, file) {
        try {
          var script = InstalledScript.fromPath("".concat(_this.scriptsPath, "/").concat(file), file);
          collection.push(script);
        } catch (exc) {
          if (exc instanceof MetadataNotFoundError || exc instanceof IdNotFoundError) {
            return collection;
          }
        }
        return collection;
      }, []);
      this._recalculateIndex();
    }
  }, {
    key: "isScriptInstalled",
    value: function isScriptInstalled(id) {
      return this._index.id.hasOwnProperty(id);
    }
  }, {
    key: "isScriptUpdateAvailable",
    value: function isScriptUpdateAvailable(script) {
      if (!this.isScriptInstalled(script.id)) {
        return false;
      }
      var installedScript = this.getScript(script.id);
      return compareVersions(installedScript.version, script.version) < 0;
    }

    /**
     * @param {number} id
     * @returns {InstalledScript | null}
     */
  }, {
    key: "getScript",
    value: function getScript(id) {
      return this._index.id[id] || null;
    }

    /**
     * @param {InstalledScript} script
     */
  }, {
    key: "push",
    value: function push(script) {
      this.scripts.push(script);
      this._recalculateIndex();
    }
  }, {
    key: "_recalculateIndex",
    value: function _recalculateIndex() {
      this._index.id = this.scripts.reduce(function (index, script) {
        index[script.id] = script;
        return index;
      }, {});
    }
  }, {
    key: "toJson",
    value: function toJson() {
      return {
        scriptManagerUpdateAvailable: this.scriptManagerUpdateAvailable,
        scriptManagerUpdateVersion: this.scriptManagerUpdateVersion,
        scriptManagerInstalledVersion: this.scriptManagerInstalledVersion,
        scriptManagerUpdateChecked: this.scriptManagerUpdateChecked,
        scripts: this.scripts.map(function (script) {
          return script.toJson();
        })
      };
    }
  }, {
    key: "toString",
    value: function toString() {
      return JSON.stringify(this.toJson(), null, 2);
    }
  }]);
}();
var InstalledScript = /*#__PURE__*/function () {
  function InstalledScript(data) {
    _classCallCheck(this, InstalledScript);
    /**
     * The greasyfork script id
     */
    this.id = parseInt(data.id);

    /**
     * The human readable version of the script
     * Used for a lot of identifiers
     */
    this.version = data.version;

    /**
     * The date and time the script was last installed or updated, in timestamp format
     */
    this.installedAt = data.installedAt;

    /**
     * The path relative to ecmascript/ folder that the script is located in
     */
    this.path = data.path;
  }
  return _createClass(InstalledScript, [{
    key: "toJson",
    value: function toJson() {
      return {
        id: this.id,
        version: this.version,
        installedAt: this.installedAt,
        path: this.path
      };
    }
  }], [{
    key: "fromPath",
    value: function fromPath(path) {
      var fileName = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
      var metadataStarted = false;
      var rawMetadata = readFileGenerator(path, function (line) {
        if (line.trim() === '// ==UserScript==') {
          metadataStarted = true;
          return line;
        }
        if (line.trim() === '// ==/UserScript==') {
          metadataStarted = false;
          return line;
        }
        if (metadataStarted) {
          return line;
        }
        return false;
      }).join('\n');
      if (!rawMetadata) {
        throw new MetadataNotFoundError(path);
      }
      var metadata = new ScriptMetadata(rawMetadata);
      var id = metadata.value('id', null);
      if (id === null) {
        throw new IdNotFoundError("ID not found in metadata: ".concat(path, " metadata: ").concat(rawMetadata));
      }
      var pathCreationTime = getFileCreationTime(path);
      var version = metadata.value('version');
      if (!version) {
        throw new Error("Version not found in metadata: ".concat(path));
      }
      return new InstalledScript({
        id: id,
        version: version,
        installedAt: pathCreationTime,
        path: fileName ? fileName : path.replace(this.scriptsPath + '/', '')
      });
    }
  }]);
}();
var MetadataNotFoundError = /*#__PURE__*/function (_Error) {
  /**
   * @param {string} path - The path to the script file
   */
  function MetadataNotFoundError(path) {
    var _this2;
    _classCallCheck(this, MetadataNotFoundError);
    _this2 = _callSuper(this, MetadataNotFoundError, ["Metadata not found in script file: ".concat(path)]);
    _this2.name = 'MetadataNotFoundError';
    _this2.path = path;
    return _this2;
  }
  _inherits(MetadataNotFoundError, _Error);
  return _createClass(MetadataNotFoundError);
}(/*#__PURE__*/_wrapNativeSuper(Error));
var IdNotFoundError = /*#__PURE__*/function (_Error2) {
  /**
   * @param {string} path - The path to the script file
   */
  function IdNotFoundError(path) {
    var _this3;
    _classCallCheck(this, IdNotFoundError);
    _this3 = _callSuper(this, IdNotFoundError, ["ID not found in metadata: ".concat(path)]);
    _this3.name = 'IdNotFoundError';
    _this3.path = path;
    return _this3;
  }
  _inherits(IdNotFoundError, _Error2);
  return _createClass(IdNotFoundError);
}(/*#__PURE__*/_wrapNativeSuper(Error));

var MessageDigest = Java.type("java.security.MessageDigest");
var JavaString = Java.type("java.lang.String");
var ScriptDownloader = /*#__PURE__*/function () {
  function ScriptDownloader(id) {
    var versionId = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
    _classCallCheck(this, ScriptDownloader);
    this.scriptId = id;
    this.versionId = versionId;
    this.authorId = null;
    this.scriptsRepo = new ScriptsRepo();
    this.contents = null;
    this.metadata = null;
    this.path = null;
    this.typeMap = {
      block: 'blocks',
      door: 'doors',
      item: 'items',
      npc: 'npcs',
      forge: 'forge',
      player: 'players'
    };
  }

  /**
   * @async
   */
  return _createClass(ScriptDownloader, [{
    key: "downloadScript",
    value: function downloadScript() {
      var _scriptInfo$users$;
      /**
       * Contents also contain the metadata
       */
      this.contents = this.scriptsRepo.getScriptContents(this.scriptId, this.versionId);

      /**
       * Retrieve the metadata separately as raw string
       */
      this.metadata = this.scriptsRepo.getScriptMetadataRaw(this.scriptId, this.versionId);
      var scriptInfo = this.scriptsRepo.getScriptInfo(this.scriptId, this.versionId);
      var authorId = (_scriptInfo$users$ = scriptInfo.users[0]) === null || _scriptInfo$users$ === void 0 ? void 0 : _scriptInfo$users$.id;
      if (authorId) {
        this.authorId = authorId;
      }
    }
  }, {
    key: "transformContents",
    value: function transformContents() {
      if (!this.contents || !this.metadata) {
        throw new Error('Contents or metadata not set');
      }
      var metadata = new ScriptMetadata(this.metadata);
      if (this.authorId) {
        metadata.appendValue('authorid', this.authorId);
      }
      metadata.appendValue('id', this.scriptId);
      this.contents = this.contents.replace(/^\/\/ ==UserScript==[\s\S]*?\/\/ ==\/UserScript==/, metadata.toString());
    }
  }, {
    key: "getSuggestedPath",
    value: function getSuggestedPath() {
      if (!this.metadata) {
        throw new Error('Metadata not set');
      }
      var metadata = new ScriptMetadata(this.metadata);
      var type = (metadata.value('scripttype') || '').toLowerCase().trim();
      var typePath = this.typeMap[type] || '';
      var name = slugify(metadata.value('name') || '');
      if (!name) {
        name = parseInt(this.scriptId);
      }
      return typePath ? "".concat(typePath, "/").concat(name, ".js") : "".concat(name, ".js");
    }
  }, {
    key: "saveScript",
    value: function saveScript(path) {
      if (!this.contents) {
        throw new Error('Contents not set');
      }
      this.path = path;
      var fullPath = "".concat(SCRIPTS_PATH, "/").concat(path);

      // Create directory if it doesn't exist, using Java classes
      if (path.indexOf('/') !== -1) {
        var directory = new File(fullPath).getParentFile();
        if (!directory.exists()) {
          directory.mkdirs();
        }
      }
      return writeToFile(fullPath, this.contents);
    }

    /**
     * Register the script as installed to Greasyfork
     * WIP
     *
     * @async
     */
  }, {
    key: "registerInstalled",
    value: function registerInstalled() {
      // get a csrf token first
      var connection = http.buildRequest('GET', "".concat(REPO_BASE_URL, "/scripts/").concat(this.scriptId));

      // get the header from the connection
      var sessionToken = this._getSessionCookie(connection);
      if (!sessionToken) {
        throw new Error('CSRF token not found');
      }
      // world.broadcast(`CSRF token: "${sessionToken}"`);
      // sessionToken = sessionToken.split('=')[1];
      connection.disconnect();

      // const html = http.get(`${REPO_BASE_URL}/scripts/${this.scriptId}`, {
      //   'Cookie': `_greasyfork_session=${sessionToken}`
      // });
      var htmlResponse = http.buildRequest('GET', "".concat(REPO_BASE_URL, "/scripts/").concat(this.scriptId), null, {
        'Cookie': "_greasyfork_session=".concat(sessionToken)
      });
      var html = http.read(htmlResponse);
      sessionToken = this._getSessionCookie(htmlResponse);
      htmlResponse.disconnect();
      var pingUrl = html.match(/<a class="install-link" data-install-format="js" data-ping-url="([^"]+)"/)[1];
      // world.broadcast(`Ping URL: ${pingUrl}`);

      var pingKey = html.match(/data-ping-key="([^"]+)"/)[1];
      // world.broadcast(`Ping Key: ${pingKey}`);

      var mo = this._getMoParam();
      var fullUrl = "".concat(REPO_BASE_URL).concat(pingUrl, "&mo=").concat(mo, "&ping_key=").concat(pingKey);
      try {
        var _connection = http.buildRequest('POST', fullUrl, null, {
          'Cookie': "_greasyfork_session=".concat(sessionToken),
          'Referer': "".concat(REPO_BASE_URL, "/en/scripts/").concat(this.scriptId),
          'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36'
        });

        // const code = connection.getResponseCode();
        // world.broadcast(`Response Code: ${code}`);

        _connection.disconnect();
        // world.broadcast(`Ping successful`);
      } catch (error) {
        world.broadcast("Ping failed: ".concat(error));
      }

      // writeToFile(`${SCRIPTS_PATH}/greasyfork_install_html.html`, html);
    }
  }, {
    key: "_getSessionCookie",
    value: function _getSessionCookie(connection) {
      var _connection$getHeader;
      return (_connection$getHeader = connection.getHeaderField('set-cookie')) === null || _connection$getHeader === void 0 || (_connection$getHeader = _connection$getHeader.split(';')[0]) === null || _connection$getHeader === void 0 ? void 0 : _connection$getHeader.split('=')[1];
    }
  }, {
    key: "_getMoParam",
    value: function _getMoParam() {
      var now = new Date();
      var utcYear = now.getUTCFullYear();
      var utcMonth = now.getUTCMonth() + 1; // 0-based
      var utcDay = now.getUTCDate();
      var utcHour = now.getUTCHours();
      var input = "4".concat(utcYear).concat(utcMonth).concat(utcDay).concat(utcHour);
      var messageDigest = MessageDigest.getInstance("SHA-1");
      messageDigest.update(new JavaString(input).getBytes('UTF-8'));
      var digest = messageDigest.digest();
      return this._bytesToHex(digest);
    }
  }, {
    key: "_bytesToHex",
    value: function _bytesToHex(bytes) {
      var hex = "";
      for (var i = 0; i < bytes.length; i++) {
        var b = bytes[i];
        if (b < 0) b += 256; // Java bytes are signed
        var h = b.toString(16);
        if (h.length < 2) h = "0" + h;
        hex += h;
      }
      return hex;
    }
  }]);
}();

var AuthorRepo = /*#__PURE__*/function () {
  function AuthorRepo() {
    _classCallCheck(this, AuthorRepo);
    this.trusted = [];
    this.blacklisted = [];
    this.featured = [];
    this.scriptsRepo = new ScriptsRepo();
    this.cacheLifetime = 1000 * 60 * 60; // 1 hour
  }
  return _createClass(AuthorRepo, [{
    key: "isTrusted",
    value: function isTrusted(id) {
      return this.trusted.indexOf(parseInt(id)) !== -1;
    }
  }, {
    key: "isBlacklisted",
    value: function isBlacklisted(id) {
      return this.blacklisted.indexOf(parseInt(id)) !== -1;
    }
  }, {
    key: "isFeatured",
    value: function isFeatured(id) {
      return this.featured.indexOf(parseInt(id)) !== -1;
    }
  }, {
    key: "isCached",
    value: function isCached() {
      if (!world.storeddata.has('scriptmanager_authors') || !world.storeddata.has('scriptmanager_authors_cached_at')) {
        return false;
      }
      var cachedAt = parseInt(world.storeddata.get('scriptmanager_authors_cached_at'));
      var now = new Date().getTime();
      return now - cachedAt < this.cacheLifetime;
    }
  }, {
    key: "fetchFromCache",
    value: function fetchFromCache() {
      var authorStore = JSON.parse(world.storeddata.get('scriptmanager_authors'));
      this.trusted = authorStore.trusted;
      this.blacklisted = authorStore.blacklisted;
      this.featured = authorStore.featured;
    }
  }, {
    key: "clearCache",
    value: function clearCache() {
      world.storeddata.remove('scriptmanager_authors');
      world.storeddata.remove('scriptmanager_authors_cached_at');
    }

    /**
     * @async
     */
  }, {
    key: "fetchFromApi",
    value: function fetchFromApi() {
      var metadata = this.scriptsRepo.getScriptMetadata(AUTHOR_LIST_SCRIPT_ID);
      this.trusted = metadata.values('trusted').map(function (id) {
        return parseInt("".concat(id).replace(/[^\d]/g, ''));
      });
      this.blacklisted = metadata.values('blacklist').map(function (id) {
        return parseInt("".concat(id).replace(/[^\d]/g, ''));
      });
      this.featured = metadata.values('featured').map(function (id) {
        return parseInt("".concat(id).replace(/[^\d]/g, ''));
      });
      world.storeddata.put('scriptmanager_authors', JSON.stringify({
        trusted: this.trusted,
        blacklisted: this.blacklisted,
        featured: this.featured
      }));
      world.storeddata.put('scriptmanager_authors_cached_at', Date.now());
    }

    /**
     * @async
     */
  }, {
    key: "init",
    value: function init() {
      if (this.isCached()) {
        this.fetchFromCache();
        return;
      }
      this.fetchFromApi();
    }
  }]);
}();

function Rectangle(_ref) {
  var id = _ref.id,
    _ref$x = _ref.x,
    x = _ref$x === void 0 ? 0 : _ref$x,
    _ref$y = _ref.y,
    y = _ref$y === void 0 ? 0 : _ref$y,
    width = _ref.width,
    height = _ref.height;
  return jsxs(Fragment, {
    children: [jsx("line", {
      id: "".concat(id, "_top"),
      x1: x,
      y1: y,
      x2: x + width,
      y2: y,
      color: COLORS.GRAY.toHex(),
      thickness: 2
    }), jsx("line", {
      id: "".concat(id, "_right"),
      x1: x + width,
      y1: y,
      x2: x + width,
      y2: y + height,
      color: COLORS.GRAY.toHex(),
      thickness: 2
    }), jsx("line", {
      id: "".concat(id, "_bottom"),
      x1: x,
      y1: y + height,
      x2: x + width,
      y2: y + height,
      color: COLORS.GRAY.toHex(),
      thickness: 2
    }), jsx("line", {
      id: "".concat(id, "_left"),
      x1: x,
      y1: y,
      x2: x,
      y2: y + height,
      color: COLORS.GRAY.toHex(),
      thickness: 2
    })]
  });
}
function Loader(_ref2) {
  var id = _ref2.id,
    _ref2$x = _ref2.x,
    x = _ref2$x === void 0 ? 0 : _ref2$x,
    _ref2$y = _ref2.y,
    y = _ref2$y === void 0 ? 0 : _ref2$y,
    width = _ref2.width,
    height = _ref2.height,
    _ref2$visible = _ref2.visible,
    visible = _ref2$visible === void 0 ? true : _ref2$visible,
    _ref2$text = _ref2.text,
    text = _ref2$text === void 0 ? '' : _ref2$text;
  return jsxs(Fragment, {
    children: [jsx("line", {
      id: "bg_".concat(id),
      x1: x,
      y1: y + height / 2,
      x2: x + width,
      y2: y + height / 2,
      color: COLORS.BLACK.alpha(visible ? 0.5 : 0).toHex(),
      thickness: height
    }), jsx("label", {
      id: "lbl_".concat(id),
      text: text || 'Loading...',
      x: x,
      y: y + height / 2 - 4,
      width: width,
      height: 16,
      color: COLORS.WHITE.toHex(),
      centered: true,
      visible: visible
    })]
  });
}
var ScriptManager = /*#__PURE__*/function (_BaseGui) {
  function ScriptManager(player) {
    var _this;
    _classCallCheck(this, ScriptManager);
    _this = _callSuper(this, ScriptManager, [id('gui_scriptmanager'), 384, 192, player]);
    _this.state = {
      categories: null,
      initialized: false,
      loading: false,
      message: '',
      /**
       * @type {ScriptInfo|null}
       */
      selectedScript: null,
      page: 'home'
    };
    _this.pushState();
    _this.renderInit = false;
    _this.scriptsRepo = new ScriptsRepo();
    _this.installedRepo = new InstalledScriptsRepo();
    _this.authorRepo = new AuthorRepo();
    _this.maxDescriptionLines = 3;

    // this.render();
    return _this;
  }
  _inherits(ScriptManager, _BaseGui);
  return _createClass(ScriptManager, [{
    key: "init",
    value: function init() {
      var _this2 = this;
      if (this.state.initialized) return;

      // this.authorRepo.clearCache();

      doAsync(function () {
        _this2.state.loading = true;
        _this2.state.message = 'Fetching settings...';
        _this2.update();
        _this2.authorRepo.init();
        _this2.state.message = 'Checking for updates...';
        _this2.update();
        _this2.installedRepo.reloadScripts();
        _this2.installedRepo.checkForScriptManagerUpdate();
        if (_this2.installedRepo.scriptManagerUpdateAvailable) {
          _this2.state.page = 'update';
        }
        _this2.state.message = '';
        _this2.state.initialized = true;
        _this2.state.loading = false;
        _this2.update();
      }, function (e, handle) {
        handle(e);
        _this2.state.loading = false;
        _this2.state.message = '';
        _this2.update();
      });
    }
  }, {
    key: "render",
    value: function render() {
      var renderedGui = jsx(Fragment, {});
      if (this.stateChanged('page')) {
        this.clearGui();
      }
      switch (this.state.page) {
        case 'home':
          renderedGui = this._renderHomeGui();
          break;
        case 'scripts':
          renderedGui = this._renderScriptsGui();
          break;
        case 'update':
          renderedGui = this._renderUpdateGui();
          break;
        case 'download_confirm':
          renderedGui = this._renderDownloadConfirmGui();
          break;
      }
      this.pushState();
      return renderToGui(this.gui, renderedGui);
    }
  }, {
    key: "navigateToPage",
    value: function navigateToPage(page) {
      var _this3 = this;
      if (this.state.loading) return;
      this.state.page = page;
      if (this.stateChanged('page')) {
        this.update();
        if (this.state.page === 'scripts') {
          doAsync(function () {
            _this3.state.selectedScript = null;
            _this3.state.loading = true;
            _this3.state.message = 'Fetching scripts...';
            _this3.update();
            _this3.scriptsRepo.fetchScripts();
            _this3.state.loading = false;
            _this3.state.message = '';
            _this3.update();
          }, function (e, handle) {
            handle(e);
            _this3.state.loading = false;
            _this3.state.message = '';
            _this3.update();
          });
        }
      }
    }
  }, {
    key: "_renderTopBar",
    value: function _renderTopBar(_ref3) {
      var _this4 = this;
      var idPrefix = _ref3.idPrefix,
        _ref3$visible = _ref3.visible,
        visible = _ref3$visible === void 0 ? true : _ref3$visible;
      return jsxs(Fragment, {
        children: [jsx("button", {
          id: "btn_topbar_".concat(idPrefix, "_home"),
          label: "Home",
          width: 72,
          height: 16,
          onClick: function onClick() {
            return _this4.navigateToPage('home');
          },
          visible: visible,
          enabled: this.state.page !== 'home'
        }), jsx("button", {
          id: "btn_topbar_".concat(idPrefix, "_scripts"),
          label: "Scripts",
          width: 72,
          height: 16,
          x: 74,
          onClick: function onClick() {
            return _this4.navigateToPage('scripts');
          },
          visible: visible,
          enabled: this.state.page !== 'scripts'
        }), jsx("button", {
          id: "btn_topbar_".concat(idPrefix, "_installed"),
          label: "Installed",
          width: 72,
          height: 16,
          x: 148,
          onClick: function onClick() {
            return _this4.navigateToPage('installed');
          },
          visible: visible,
          enabled: this.state.page !== 'installed'
        })]
      });
    }
  }, {
    key: "_renderHomeGui",
    value: function _renderHomeGui() {
      var _this5 = this;
      var homeText = chunkate("\n      Welcome, ".concat(this.player.name, "!\n    ").trim(), 84);
      return jsxs(Fragment, {
        children: [jsx("label", {
          id: "lbl_home_title",
          text: "\xA7eScriptManager",
          width: this.gui.getWidth(),
          height: 16,
          color: COLORS.WHITE.toHex(),
          scale: 2,
          centered: false
        }), jsx(Fragment, {
          y: 20,
          children: this._renderTopBar({
            idPrefix: 'home',
            visible: !this.state.loading
          })
        }), jsx(Fragment, {
          x: 4,
          y: 60,
          children: homeText.map(function (line, index) {
            return jsx("label", {
              id: "lbl_home_text_".concat(index),
              text: line,
              visible: !!line && !_this5.state.loading,
              y: index * 10
            });
          })
        }), jsx(Fragment, {
          x: this.gui.getWidth() / 3,
          y: this.gui.getHeight() / 3,
          children: jsx(Loader, {
            id: "loader_home",
            x: 0,
            y: 0,
            width: 128,
            height: 48,
            visible: this.state.loading,
            text: this.state.message
          })
        })]
      });
    }
  }, {
    key: "_renderUpdateGui",
    value: function _renderUpdateGui() {
      var _this6 = this;
      var descriptionLines = chunkate("\n      A new version of \xA7eScriptManager\xA7f is available!\n      The latest version is \xA7ev".concat(this.installedRepo.scriptManagerUpdateVersion, "\xA7f, and you have \xA7ev").concat(this.installedRepo.scriptManagerInstalledVersion, "\xA7f.\n      \n\n      You can update by clicking the \xA7lupdate\xA7f button below.\n      \n\n      It is \xA7nrequired to update\xA7f to the latest version of \xA7eScriptManager\xA7f, due to \xA7nsecurity reasons\xA7f.\n      \n\n      Updates contain important bug fixes and improvements, as well as additions to the author trustlist/blacklist.\n      So it is important to update to the latest version.\n      ").trim(), 84);
      var onCloseButtonClick = function onCloseButtonClick() {
        return _this6.gui.close();
      };
      return jsxs(Fragment, {
        children: [jsx("label", {
          id: "lbl_update_prompt",
          text: "\xA7eUpdate available!",
          width: this.gui.getWidth(),
          height: 16,
          color: COLORS.WHITE.toHex(),
          scale: 2
        }), jsx(Fragment, {
          y: 24,
          children: descriptionLines.map(function (line, index) {
            return jsx("label", {
              id: "lbl_update_prompt_".concat(index),
              text: line,
              visible: !!line,
              y: index * 10,
              width: _this6.gui.getWidth(),
              height: 16,
              color: COLORS.WHITE.toHex()
            });
          })
        }), jsxs(Fragment, {
          y: 40 + descriptionLines.length * 10,
          children: [jsx("button", {
            id: "btn_update_prompt_close",
            label: "Close",
            width: 96,
            height: 24,
            x: 0,
            onClick: onCloseButtonClick,
            enabled: !this.state.loading
          }), jsx("button", {
            id: "btn_update_prompt_update",
            label: "Update",
            width: 96,
            height: 24,
            x: this.gui.getWidth() - 96,
            onClick: function onClick(e) {
              return _this6.onBtnUpdatePromptConfirmClick(e);
            },
            enabled: !this.state.loading
          })]
        }), jsx(Loader, {
          id: "loader_update_prompt",
          x: this.gui.getWidth() / 2 - 64,
          y: this.gui.getHeight() / 2 - 24,
          width: 128,
          height: 48,
          text: this.state.message,
          visible: this.state.loading
        })]
      });
    }
  }, {
    key: "_renderScriptsGui",
    value: function _renderScriptsGui() {
      var _this7 = this;
      var scrollProps = {
        enabled: false,
        visible: false
      };
      if (this.state.initialized) {
        scrollProps.enabled = true;
        scrollProps.visible = true;
      }
      var script = this.state.selectedScript;
      var installedScript = script && this.installedRepo.getScript(script.id);
      /**
       * @type {ScriptAuthor|null}
       */
      var author = (script === null || script === void 0 ? void 0 : script.users[0]) || null;
      var meta = (script === null || script === void 0 ? void 0 : script.getMetadata()) || null;
      var mcVersions = (meta === null || meta === void 0 ? void 0 : meta.values('minecraft')) || [];
      var mcVersionColor = meta !== null && meta !== void 0 && meta.isCompatibleMcVersion() ? '§a' : '§c';
      var mcVersionText = mcVersions.join(', ') + (meta !== null && meta !== void 0 && meta.isCompatibleMcVersion() ? '' : '§c (incompatible)');
      var scriptLines = chunkate((script === null || script === void 0 ? void 0 : script.description) || '', 42);
      var descriptionLines = Array.from({
        length: this.maxDescriptionLines
      }).map(function (_, index) {
        return scriptLines[index] || '';
      });
      var isInstalled = script && this.installedRepo.isScriptInstalled(script.id);
      var isUpdateAvailable = script && this.installedRepo.isScriptUpdateAvailable(script);
      var downloadLabel = 'Download';
      if (isInstalled) {
        downloadLabel = isUpdateAvailable ? 'Update' : 'Installed';
      }
      var downloadEnabled = !isInstalled || isUpdateAvailable;
      var versionText = "\xA76v".concat(script === null || script === void 0 ? void 0 : script.version);
      var downloadTopLabel = '';
      if (isInstalled) {
        versionText = isUpdateAvailable ? "\xA7e\u2191 v".concat(script === null || script === void 0 ? void 0 : script.version) : "\xA7a\u2714 v".concat(script === null || script === void 0 ? void 0 : script.version);
        downloadTopLabel = isUpdateAvailable ? "\xA7eInstalled version v".concat(installedScript === null || installedScript === void 0 ? void 0 : installedScript.version, " \u2191") : "\xA7aInstalled version v".concat(installedScript === null || installedScript === void 0 ? void 0 : installedScript.version, " \u2714");
      }
      var scriptList = this.scriptsRepo.scripts.map(function (script) {
        if (!_this7.installedRepo.isScriptInstalled(script.id)) {
          return script.name;
        }
        return _this7.installedRepo.isScriptUpdateAvailable(script) ? "\xA7e\u2191 ".concat(script.name) : "\xA7a\u2714 ".concat(script.name);
      });
      var authorLabel = '';
      var authorHoverText = '';
      if (author) {
        authorLabel = "\xA7".concat(this.authorRepo.isTrusted(author.id) ? 'a' : '7', "By ").concat(author.name).concat(this.authorRepo.isTrusted(author.id) ? ' ✔' : '');
        authorHoverText = this.authorRepo.isTrusted(author.id) ? '§aThis author is verified by ScriptManager' : '§fThis author is NOT verified by ScriptManager, proceed with caution.';
      }
      var isScriptManager = (script === null || script === void 0 ? void 0 : script.id) === SCRIPT_MANAGER_ID;
      var width = this.gui.getWidth();
      var height = this.gui.getHeight() - 32;
      return jsxs(Fragment, {
        children: [jsx("label", {
          id: "lbl_title",
          text: "\xA7eScriptManager",
          width: width,
          height: 16,
          color: COLORS.WHITE.toHex(),
          scale: 2,
          centered: false
        }), jsx(Fragment, {
          y: 20,
          children: this._renderTopBar({
            idPrefix: 'scripts',
            visible: true
          })
        }), jsxs(Fragment, {
          y: 40,
          children: [jsx("scroll", _objectSpread2({
            id: "scrl_scripts",
            width: 128,
            height: height,
            hasSearch: false,
            list: scriptList,
            onSelect: function onSelect(e) {
              return _this7.onScriptSelect(e);
            }
          }, scrollProps)), jsx(Rectangle, {
            id: "rect_scripts_info",
            width: width,
            height: height
          }), jsxs(Fragment, {
            x: 144,
            children: [jsx("label", {
              id: "lbl_scripts_info",
              y: 4,
              width: 128,
              height: 16,
              text: "\xA73\xA7n".concat(script === null || script === void 0 ? void 0 : script.name),
              visible: !!script,
              scale: 2
            }), jsx("label", {
              id: "lbl_scripts_author",
              y: 24,
              width: 128,
              height: 16,
              text: authorLabel,
              hoverText: authorHoverText,
              visible: !!author
            }), jsx("label", {
              id: "lbl_scripts_version",
              y: 34,
              width: 128,
              height: 16,
              text: versionText,
              visible: !!script
            }), jsx("label", {
              id: "lbl_scripts_mcversion",
              y: 44,
              width: 128,
              height: 16,
              text: "".concat(mcVersionColor, "MC ").concat(mcVersionText),
              visible: !!script
            }), descriptionLines.map(function (line, index) {
              return jsx("label", {
                id: "lbl_scripts_info_description_".concat(index),
                text: line,
                visible: !!line,
                y: 64 + index * 10,
                width: 128,
                height: 16,
                color: COLORS.WHITE.toHex()
              });
            })]
          }), jsxs(Fragment, {
            x: width - 48,
            children: [jsx("label", {
              id: "lbl_scripts_rating_good",
              y: 4,
              width: 48,
              height: 16,
              text: "\xA7a\u2714\xA7f \xD7".concat(script === null || script === void 0 ? void 0 : script.good_ratings),
              hoverText: "\xA7aGood",
              visible: !!script
            }), jsx("label", {
              id: "lbl_scripts_rating_ok",
              y: 14,
              width: 48,
              height: 16,
              text: "\xA7e\xA7lO\xA7f \xD7".concat(script === null || script === void 0 ? void 0 : script.ok_ratings),
              hoverText: "\xA7eOk",
              visible: !!script
            }), jsx("label", {
              id: "lbl_scripts_rating_bad",
              y: 24,
              width: 48,
              height: 16,
              text: "\xA7c\u2716\xA7f \xD7".concat(script === null || script === void 0 ? void 0 : script.bad_ratings),
              hoverText: "\xA7cBad",
              visible: !!script
            })]
          }), jsxs(Fragment, {
            x: 144,
            y: height - 56,
            children: [jsx("label", {
              id: "lbl_script_download_top",
              text: downloadTopLabel,
              width: 128,
              height: 16,
              x: 0,
              y: 42,
              visible: !!script && downloadTopLabel
            }), jsx("button", {
              id: "btn_script_report",
              label: "Report",
              width: 54,
              height: 16,
              x: 0,
              y: 0,
              hoverText: "A clickable link will appear in the chat",
              visible: !!script && !isScriptManager,
              onClick: function onClick(e) {
                return _this7.onBtnScriptReportClick(e);
              }
            }), jsx("button", {
              id: "btn_script_code",
              label: "See code",
              width: 54,
              height: 16,
              x: 0,
              y: 20,
              hoverText: "A clickable link will appear in the chat",
              visible: !!script,
              onClick: function onClick(e) {
                return _this7.onBtnScriptCodeClick(e);
              }
            }), jsx("button", {
              id: "btn_script_install",
              label: downloadLabel,
              width: 54,
              height: 16,
              x: 182,
              y: 20,
              enabled: !this.state.loading && downloadEnabled,
              visible: !!script,
              onClick: function onClick(e) {
                return _this7.onBtnScriptInstallClick(e);
              }
            })]
          }), jsx(Fragment, {
            x: width / 3,
            y: height / 3,
            children: jsx(Loader, {
              id: "loader",
              x: 0,
              y: 0,
              width: 128,
              height: 48,
              visible: this.state.loading,
              text: this.state.message
            })
          })]
        })]
      });
    }
  }, {
    key: "_renderDownloadConfirmGui",
    value: function _renderDownloadConfirmGui() {
      var _this8 = this;
      var props = {};
      var script = this.state.selectedScript;

      /**
       * @type {ScriptAuthor|null}
       */
      var author = (script === null || script === void 0 ? void 0 : script.users[0]) || null;
      if (!script || !author) {
        props.visible = false;
      }
      var descriptionLines = chunkate("\n    You are about to download \xA79".concat(script.name, "\xA7f by \xA77").concat(author.name, "\xA7f.\n\n    ").concat(!author || this.authorRepo.isTrusted(author.id) ? '' : "\n\n      \xA7c\xA7lWARNING\xA7r\n      This author is NOT verified by ScriptManager. This means we CANNOT guarantee the safety of this script.\n      \n\n      Click the button below to see the code on GreasyFork.\n      \n\n      Download at your own risk!\n      \n\n    ", "\n    \xA7rPress \xA7aYES\xA7r to download the script.\n    ").trim(), 84);
      return jsxs(Fragment, {
        children: [jsx("label", _objectSpread2({
          id: "lbl_download_confirm_title",
          text: "\xA7eAre you sure?",
          width: this.gui.getWidth(),
          height: 16,
          color: COLORS.WHITE.toHex(),
          scale: 2
        }, props)), jsx(Fragment, {
          y: 24,
          children: descriptionLines.map(function (line, index) {
            return jsx("label", {
              id: "lbl_download_confirm_description_".concat(index),
              text: line,
              visible: !!line,
              y: index * 10,
              width: _this8.gui.getWidth(),
              height: 16,
              color: COLORS.WHITE.toHex()
            });
          })
        }), jsxs(Fragment, {
          y: this.gui.getHeight(),
          children: [jsx("button", _objectSpread2({
            id: "btn_download_confirm_no",
            label: "No",
            width: 64,
            height: 16,
            onClick: function onClick(e) {
              return _this8.onBtnDownloadCancelClick(e);
            },
            enabled: !this.state.loading
          }, props)), jsx("button", _objectSpread2({
            id: "btn_download_confirm_code",
            label: "See on GreasyFork",
            width: 128,
            height: 16,
            x: this.gui.getWidth() / 2 - 128 / 2,
            hoverText: "A clickable link will appear in the chat",
            onClick: function onClick(e) {
              return _this8.onBtnDownloadCodeClick(e);
            },
            enabled: !this.state.loading
          }, props)), jsx("button", _objectSpread2({
            id: "btn_download_confirm_yes",
            label: "Yes",
            width: 64,
            height: 16,
            x: this.gui.getWidth() - 64,
            onClick: function onClick(e) {
              return _this8.onBtnDownloadConfirmClick(e);
            },
            enabled: !this.state.loading
          }, props))]
        }), jsx(Loader, {
          id: "loader_download_confirm",
          x: this.gui.getWidth() / 2 - 64,
          y: this.gui.getHeight() / 2 - 24,
          width: 128,
          height: 48,
          text: this.state.message,
          visible: this.state.loading
        })]
      });
    }
  }, {
    key: "update",
    value: function update() {
      this.render();
      this.gui.update();
    }
  }, {
    key: "onScriptSelect",
    value: function onScriptSelect(e) {
      var _this9 = this;
      /**
       * @type {ScriptInfo}
       */
      var script = this.scriptsRepo.scripts[e.scrollIndex];

      // Set always to null when inbetween loading or selecting the same
      this.state.selectedScript = null;
      this.update();

      // if (selectedScriptId == script.id) {
      //     e.scroll.setSelection([]);
      //     this.gui.update(e.scroll);
      //     this.gui.update();
      //     return;
      // }

      doAsync(function () {
        _this9.state.loading = true;
        _this9.update();
        try {
          script.getMetadata();
        } catch (error) {
          _this9.state.loading = false;
          _this9.state.message = '§cHttpError';
          _this9.update();
          return;
        }
        _this9.state.loading = false;
        _this9.state.selectedScript = script;
        _this9.update();
      });
    }
  }, {
    key: "onBtnUpdatePromptConfirmClick",
    value: function onBtnUpdatePromptConfirmClick(e) {
      if (this.state.loading) return;
      this.state.loading = true;
      this.state.message = 'Downloading update...';
      this.update();
      var downloader = new ScriptDownloader(SCRIPT_MANAGER_ID);
      this._downloadScript(downloader);
    }
  }, {
    key: "onBtnDownloadConfirmClick",
    value: function onBtnDownloadConfirmClick(e) {
      if (this.state.loading) return;
      var script = this.state.selectedScript;
      if (!script) return;
      this.state.loading = true;
      this.state.message = 'Downloading script...';
      this.update();
      var downloader = new ScriptDownloader(script.id, script.version_id);
      this._downloadScript(downloader);
    }

    /**
     *
     * @param {ScriptDownloader} downloader
     */
  }, {
    key: "_downloadScript",
    value: function _downloadScript(downloader) {
      var _this0 = this;
      doAsync(function () {
        _this0.state.message = 'Downloading script...';
        _this0.update();
        downloader.downloadScript();
        _this0.state.message = 'Patching script...';
        _this0.update();
        downloader.transformContents();
        var installedScript = _this0.installedRepo.getScript(downloader.scriptId);
        var path = installedScript ? installedScript.path : downloader.getSuggestedPath();
        _this0.state.message = 'Saving script...';
        _this0.update();
        downloader.saveScript(path);
        _this0.installedRepo.reloadScripts();
        _this0.state.message = '';
        _this0.state.loading = false;
        _this0.update();
        _this0.gui.close();
        world.broadcast("\xA7e\xA7l[ScriptManager] \xA7fReloading scripts...");
        API.executeCommand(world, 'noppes script reload');
      }, function (e) {
        _this0.state.loading = false;
        _this0.player.message('§cError: ' + e);
        _this0.update();
      });
    }
  }, {
    key: "onBtnScriptInstallClick",
    value: function onBtnScriptInstallClick(e) {
      this.state.page = 'download_confirm';
      this.update();
    }
  }, {
    key: "onBtnScriptCodeClick",
    value: function onBtnScriptCodeClick(e) {
      var script = this.state.selectedScript;
      if (!script) return;
      this._showScriptCode(script);
    }
  }, {
    key: "onBtnScriptReportClick",
    value: function onBtnScriptReportClick(e) {
      var script = this.state.selectedScript;
      if (!script) return;
      var reportUrl = script.getReportUrl();
      var tellraw = JSON.stringify(['', {
        text: '§e§l[ScriptManager] '
      }, {
        text: "\xA7f\xA7nClick here\xA7r to report \xA76".concat(script.name, "\xA7f"),
        clickEvent: {
          action: 'open_url',
          value: reportUrl
        },
        hoverEvent: {
          action: 'show_text',
          value: '§eClick to report the script'
        }
      }]);
      API.executeCommand(world, "tellraw ".concat(this.player.name, " ").concat(tellraw));
      this.gui.close();
    }
  }, {
    key: "onBtnDownloadCancelClick",
    value: function onBtnDownloadCancelClick(e) {
      this.state.page = 'scripts';
      this.state.selectedScript = null;
      this.update();
    }
  }, {
    key: "onBtnDownloadCodeClick",
    value: function onBtnDownloadCodeClick(e) {
      var script = this.state.selectedScript;
      if (!script) return;
      this._showScriptCode(script);
    }
  }, {
    key: "_showScriptCode",
    value: function _showScriptCode(script) {
      var codeUrl = "".concat(REPO_BASE_URL, "/en/scripts/").concat(script.id, "/code");
      var tellraw = JSON.stringify(['', {
        text: '§e§l[ScriptManager] '
      }, {
        text: '§f§nClick here§r to see the code on GreasyFork',
        clickEvent: {
          action: 'open_url',
          value: codeUrl
        },
        hoverEvent: {
          action: 'show_text',
          value: '§eClick to see the code on GreasyFork'
        }
      }]);
      API.executeCommand(world, "tellraw ".concat(this.player.name, " ").concat(tellraw));
      this.gui.close();
    }
  }]);
}(BaseGui);

var global = {};

/**
 * @type {ScriptManager|null}
 */
global.scriptManager = null;
function customGuiScroll(e) {
  if (e.gui.getID() !== global.scriptManager.gui.getID()) return;
  var shouldCancel = !e.scroll.getEnabled() || global.scriptManager.state.loading || global.scriptManager.state.message;
  if (shouldCancel) {
    e.scroll.setSelection([]);
    e.gui.update(e.scroll);
    e.gui.update();
    return;
  }
  gui.emit(e.scrollId, e);
}
function customGuiButton(e) {
  if (e.gui.getID() !== global.scriptManager.gui.getID()) return;
  var shouldCancel = !e.button.getEnabled() || global.scriptManager.state.loading || global.scriptManager.state.message;
  if (shouldCancel) {
    return;
  }
  gui.emit(e.buttonId, e);
}
function chat(e) {
  if (e.message.indexOf('!scripts') !== 0) return;
  // Check if the player is in creative mode
  if (e.player.gamemode !== 1) return;
  e.setCanceled(true);
  if (!global.scriptManager || !global.scriptManager.state.loading) {
    global.scriptManager = new ScriptManager(e.player);
  }
  var _e$message$split = e.message.split(/\s+/),
    _e$message$split2 = _toArray(_e$message$split);
    _e$message$split2[0];
    var _e$message$split2$ = _e$message$split2[1],
    command = _e$message$split2$ === void 0 ? null : _e$message$split2$,
    args = _e$message$split2.slice(2);
  if (command === 'debug') {
    var _args = _toArray(args),
      _args$ = _args[0],
      debugSubject = _args$ === void 0 ? null : _args$;
      _args.slice(1);
    if (debugSubject === 'installed') {
      global.scriptManager.installedRepo.reloadScripts();
      global.scriptManager.installedRepo.checkForScriptManagerUpdate();
      e.player.message(global.scriptManager.installedRepo.toString());
      return;
    }
    e.player.message(debugSubject ? "\xA7cInvalid subject.\xA7c" : '§cPlease specify a subject to debug.');
    return;
  }
  if (!command) {
    global.scriptManager.init();
    e.player.showCustomGui(global.scriptManager.gui);
    return;
  }
}

