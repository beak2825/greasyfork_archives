// ==UserScript==
// @name           WarSoul-Tools
// @namespace      WarSoul-Tools
// @version        0.5.1
// @author         BKN46
// @description    WarSoul实用工具
// @icon           https://www.milkywayidle.com/favicon.svg
// @include        https://aring.cc/awakening-of-war-soul-ol/
// @match          https://aring.cc/awakening-of-war-soul-ol/*
// @license        GPL-3.0
// @downloadURL https://update.greasyfork.org/scripts/552887/WarSoul-Tools.user.js
// @updateURL https://update.greasyfork.org/scripts/552887/WarSoul-Tools.meta.js
// ==/UserScript==
(function () {
  'use strict';

  function removeLeadingNumbers(str) {
    return str.replace(/^\d+/, '');
  }
  function parseWSmessage(str) {
    return JSON.parse(removeLeadingNumbers(str));
  }
  function logMessage(message) {
    console.log("[WarSoul-Tools]", message);
  }
  function saveToLocalStorage(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error("Error saving to localStorage:", error);
    }
  }
  function loadFromLocalStorage(key, defaultValue = null) {
    try {
      const value = localStorage.getItem(key);
      return value ? JSON.parse(value) : defaultValue;
    } catch (error) {
      console.error("Error loading from localStorage:", error);
      return defaultValue;
    }
  }

  // 监听页面可见性变化
  document.addEventListener('visibilitychange', function () {
  });
  let selfWS = null;
  function hookWS() {
    const dataProperty = Object.getOwnPropertyDescriptor(MessageEvent.prototype, "data");
    const oriGet = dataProperty.get;
    dataProperty.get = hookedGet;
    Object.defineProperty(MessageEvent.prototype, "data", dataProperty);
    function hookedGet() {
      const socket = this.currentTarget;
      if (!(socket instanceof WebSocket)) {
        return oriGet.call(this);
      }
      if (socket.url.indexOf("api.aring.cc") <= -1) {
        return oriGet.call(this);
      }
      selfWS = socket;
      const message = oriGet.call(this);
      Object.defineProperty(this, "data", {
        value: message
      }); // Anti-loop

      try {
        return handleMessage(message);
      } catch (error) {
        console.log("Error in handleMessage:", error);
        return message;
      }
    }
    const sendProperty = Object.getOwnPropertyDescriptor(WebSocket.prototype, "send");
    const oriSend = sendProperty.value;
    sendProperty.value = hookedSend;
    Object.defineProperty(WebSocket.prototype, "send", sendProperty);
    function hookedSend(data) {
      if (this.url.indexOf("api.aring.cc") > -1) {
        try {
          const message = typeof data === 'string' ? data : data.toString();
          // logMessage(`WS Send: ${message}`);

          if (message.startsWith('42')) {
            requestIdCounter += 1;
          }

          // 处理发送消息的钩子
          for (let {
            sendRegex,
            sendHookHandler
          } of hookHandlers) {
            if (sendRegex.test(message)) {
              try {
                const responseHandler = sendHookHandler(message);
                if (responseHandler) {
                  // 生成唯一ID并存储一次性响应处理器
                  const hookId = generateHookId();
                  oneTimeResponseHandlers.set(hookId, {
                    handler: responseHandler.handler,
                    responseRegex: responseHandler.responseRegex,
                    timeout: responseHandler.timeout || 30000,
                    // 默认30秒超时
                    timestamp: Date.now(),
                    originalSendMessage: message
                  });

                  // 设置超时清理
                  setTimeout(() => {
                    oneTimeResponseHandlers.delete(hookId);
                  }, responseHandler.timeout || 30000);
                }
              } catch (error) {
                logMessage("Error in sendHookHandler:");
                logMessage(error);
              }
            }
          }
        } catch (error) {
          console.log("Error in hookedSend:", error);
        }
      }
      return oriSend.call(this, data);
    }
  }
  function wsSend(data) {
    if (selfWS && selfWS.readyState === WebSocket.OPEN) {
      try {
        selfWS.send(data);
      } catch (error) {
        console.log("Error in wsSend:", error);
      }
    } else {
      console.log("WebSocket is not open or not initialized.");
    }
  }
  const messageHandlers = [];
  const pendingRequests = new Map(); // 存储待处理的请求
  const hookHandlers = []; // 存储发送消息的钩子处理器
  const oneTimeResponseHandlers = new Map(); // 存储一次性响应处理器

  function handleMessage(message) {
    let obj;
    try {
      obj = JSON.parse(removeLeadingNumbers(message));
    } catch (error) {
      return message;
    }

    // 检查一次性响应处理器
    for (let [hookId, hookInfo] of oneTimeResponseHandlers.entries()) {
      if (hookInfo.responseRegex.test(message)) {
        try {
          // 先删除处理器，避免重复处理
          oneTimeResponseHandlers.delete(hookId);
          hookInfo.handler(obj, {
            originalSendMessage: hookInfo.originalSendMessage,
            responseMessage: message,
            hookId: hookId
          });
        } catch (error) {
          logMessage(`Error in one-time response handler for ${hookId}:`);
          logMessage(error);
        }
      }
    }

    // 处理常规消息处理器
    for (let {
      regex,
      handler
    } of messageHandlers) {
      if (regex.test(message)) {
        try {
          obj = handler(obj) || obj;
        } catch (error) {
          logMessage(`Error in WS handler for ${obj.regex}:`);
          logMessage(error);
        }
      }
    }
    return message;
  }
  function registMessageHandler(regex, handler) {
    messageHandlers.push({
      regex,
      handler
    });
  }

  // 注册发送消息钩子处理器
  function registSendHookHandler(sendRegex, sendHookHandler) {
    hookHandlers.push({
      sendRegex,
      sendHookHandler
    });
  }
  function hookHTTP() {
    const originalFetch = window.fetch;
    window.fetch = function (...args) {
      const [url, options] = args;
      const requestId = generateRequestId();

      // Log request details for socket.io endpoints
      if (url && url.includes('api.aring.cc')) {
        // 存储请求信息
        pendingRequests.set(requestId, {
          url: url,
          method: options?.method || 'GET',
          body: options?.body,
          headers: options?.headers,
          timestamp: Date.now(),
          type: 'fetch'
        });
      }
      return originalFetch.apply(this, args).then(response => {
        if (response.url && response.url.includes('api.aring.cc')) {
          // Clone response to avoid consuming the stream
          const clonedResponse = response.clone();
          clonedResponse.text().then(data => {
            // Handle Socket.IO polling messages
            if (data) {
              try {
                const requestInfo = pendingRequests.get(requestId);
                handleSocketIOMessage(data, requestInfo);
                // 清理已处理的请求
                pendingRequests.delete(requestId);
              } catch (error) {
                // logMessage('Error handling Socket.IO message: ' + error);
              }
            }
          }).catch(error => {
            // logMessage('Error reading fetch response: ' + error);
            pendingRequests.delete(requestId);
          });
        }
        return response;
      });
    };
    const originalXHROpen = XMLHttpRequest.prototype.open;
    const originalXHRSend = XMLHttpRequest.prototype.send;
    XMLHttpRequest.prototype.open = function (method, url, ...args) {
      this._method = method;
      this._url = url;
      return originalXHROpen.call(this, method, url, ...args);
    };
    XMLHttpRequest.prototype.send = function (data) {
      const requestId = generateRequestId();
      this._requestId = requestId;
      if (this._url && this._url.includes('api.aring.cc')) {
        // 存储请求信息
        pendingRequests.set(requestId, {
          url: this._url,
          method: this._method,
          body: data,
          timestamp: Date.now(),
          type: 'xhr'
        });
        this.addEventListener('load', function () {
          // Handle Socket.IO polling messages
          if (this.responseText) {
            try {
              const requestInfo = pendingRequests.get(requestId);
              handleSocketIOMessage(this.responseText, requestInfo);
              pendingRequests.delete(requestId);
            } catch (error) {
              logMessage('Error handling http message: ' + error);
            }
          }
        });
        this.addEventListener('error', function () {
          pendingRequests.delete(requestId);
        });
      }
      return originalXHRSend.call(this, data);
    };
  }
  function handleSocketIOMessage(message, requestInfo = null) {
    // Socket.IO messages often start with packet type numbers (0, 1, 2, 3, 4, etc.)
    // 0 = open, 1 = close, 2 = ping, 3 = pong, 4 = message
    if (typeof message === 'string' && message.length > 0) {
      // Try to extract JSON payload from Socket.IO message
      const jsonMatch = message.match(/^\d*(.*)$/);
      if (jsonMatch && jsonMatch[1]) {
        try {
          const jsonData = JSON.parse(jsonMatch[1]);
          // Process the message through existing handlers
          for (let {
            urlRegex,
            bodyRegex,
            resBodyRegex,
            handler
          } of httpRequestHandlers) {
            // if ((jsonMatch[1] || '').includes('面甲')) {
            //     debugger;
            // }
            if (urlRegex.test(requestInfo?.url || '') && bodyRegex.test(requestInfo?.body || '') && resBodyRegex.test(message || '')) {
              try {
                handler(jsonData);
              } catch (error) {
                logMessage(`Error in http handler: [${handler}] ${requestInfo?.body} ${error}`);
              }
            }
          }
        } catch (error) {}
      }
    }
  }
  const httpRequestHandlers = [];
  function registHTTPRequestHandler(urlRegex, bodyRegex, resBodyRegex, handler) {
    httpRequestHandlers.push({
      urlRegex,
      bodyRegex,
      resBodyRegex,
      handler
    });
  }

  // 生成唯一的请求ID
  function generateRequestId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }

  // 生成唯一的钩子ID
  function generateHookId() {
    return 'hook_' + Date.now().toString(36) + Math.random().toString(36).substr(2);
  }
  let requestIdCounter = 5;

  // 清理超时的请求记录
  setInterval(() => {
    const now = Date.now();
    for (let [id, request] of pendingRequests.entries()) {
      if (now - request.timestamp > 30000) {
        // 30秒超时
        pendingRequests.delete(id);
      }
    }
  }, 10000); // 每10秒清理一次

  var commonjsGlobal = typeof globalThis !== 'undefined' ? globalThis : typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};

  var check = function (it) {
    return it && it.Math == Math && it;
  };

  // https://github.com/zloirock/core-js/issues/86#issuecomment-115759028
  var global$c =
    // eslint-disable-next-line es/no-global-this -- safe
    check(typeof globalThis == 'object' && globalThis) ||
    check(typeof window == 'object' && window) ||
    // eslint-disable-next-line no-restricted-globals -- safe
    check(typeof self == 'object' && self) ||
    check(typeof commonjsGlobal == 'object' && commonjsGlobal) ||
    // eslint-disable-next-line no-new-func -- fallback
    (function () { return this; })() || Function('return this')();

  var objectGetOwnPropertyDescriptor = {};

  var fails$8 = function (exec) {
    try {
      return !!exec();
    } catch (error) {
      return true;
    }
  };

  var fails$7 = fails$8;

  // Detect IE8's incomplete defineProperty implementation
  var descriptors = !fails$7(function () {
    // eslint-disable-next-line es/no-object-defineproperty -- required for testing
    return Object.defineProperty({}, 1, { get: function () { return 7; } })[1] != 7;
  });

  var objectPropertyIsEnumerable = {};

  var $propertyIsEnumerable = {}.propertyIsEnumerable;
  // eslint-disable-next-line es/no-object-getownpropertydescriptor -- safe
  var getOwnPropertyDescriptor$1 = Object.getOwnPropertyDescriptor;

  // Nashorn ~ JDK8 bug
  var NASHORN_BUG = getOwnPropertyDescriptor$1 && !$propertyIsEnumerable.call({ 1: 2 }, 1);

  // `Object.prototype.propertyIsEnumerable` method implementation
  // https://tc39.es/ecma262/#sec-object.prototype.propertyisenumerable
  objectPropertyIsEnumerable.f = NASHORN_BUG ? function propertyIsEnumerable(V) {
    var descriptor = getOwnPropertyDescriptor$1(this, V);
    return !!descriptor && descriptor.enumerable;
  } : $propertyIsEnumerable;

  var createPropertyDescriptor$2 = function (bitmap, value) {
    return {
      enumerable: !(bitmap & 1),
      configurable: !(bitmap & 2),
      writable: !(bitmap & 4),
      value: value
    };
  };

  var toString = {}.toString;

  var classofRaw$1 = function (it) {
    return toString.call(it).slice(8, -1);
  };

  var fails$6 = fails$8;
  var classof$2 = classofRaw$1;

  var split = ''.split;

  // fallback for non-array-like ES3 and non-enumerable old V8 strings
  var indexedObject = fails$6(function () {
    // throws an error in rhino, see https://github.com/mozilla/rhino/issues/346
    // eslint-disable-next-line no-prototype-builtins -- safe
    return !Object('z').propertyIsEnumerable(0);
  }) ? function (it) {
    return classof$2(it) == 'String' ? split.call(it, '') : Object(it);
  } : Object;

  // `RequireObjectCoercible` abstract operation
  // https://tc39.es/ecma262/#sec-requireobjectcoercible
  var requireObjectCoercible$2 = function (it) {
    if (it == undefined) throw TypeError("Can't call method on " + it);
    return it;
  };

  // toObject with fallback for non-array-like ES3 strings
  var IndexedObject = indexedObject;
  var requireObjectCoercible$1 = requireObjectCoercible$2;

  var toIndexedObject$3 = function (it) {
    return IndexedObject(requireObjectCoercible$1(it));
  };

  // `IsCallable` abstract operation
  // https://tc39.es/ecma262/#sec-iscallable
  var isCallable$d = function (argument) {
    return typeof argument === 'function';
  };

  var isCallable$c = isCallable$d;

  var isObject$5 = function (it) {
    return typeof it === 'object' ? it !== null : isCallable$c(it);
  };

  var global$b = global$c;
  var isCallable$b = isCallable$d;

  var aFunction = function (argument) {
    return isCallable$b(argument) ? argument : undefined;
  };

  var getBuiltIn$4 = function (namespace, method) {
    return arguments.length < 2 ? aFunction(global$b[namespace]) : global$b[namespace] && global$b[namespace][method];
  };

  var getBuiltIn$3 = getBuiltIn$4;

  var engineUserAgent = getBuiltIn$3('navigator', 'userAgent') || '';

  var global$a = global$c;
  var userAgent = engineUserAgent;

  var process = global$a.process;
  var Deno = global$a.Deno;
  var versions = process && process.versions || Deno && Deno.version;
  var v8 = versions && versions.v8;
  var match, version;

  if (v8) {
    match = v8.split('.');
    version = match[0] < 4 ? 1 : match[0] + match[1];
  } else if (userAgent) {
    match = userAgent.match(/Edge\/(\d+)/);
    if (!match || match[1] >= 74) {
      match = userAgent.match(/Chrome\/(\d+)/);
      if (match) version = match[1];
    }
  }

  var engineV8Version = version && +version;

  /* eslint-disable es/no-symbol -- required for testing */

  var V8_VERSION = engineV8Version;
  var fails$5 = fails$8;

  // eslint-disable-next-line es/no-object-getownpropertysymbols -- required for testing
  var nativeSymbol = !!Object.getOwnPropertySymbols && !fails$5(function () {
    var symbol = Symbol();
    // Chrome 38 Symbol has incorrect toString conversion
    // `get-own-property-symbols` polyfill symbols converted to object are not Symbol instances
    return !String(symbol) || !(Object(symbol) instanceof Symbol) ||
      // Chrome 38-40 symbols are not inherited from DOM collections prototypes to instances
      !Symbol.sham && V8_VERSION && V8_VERSION < 41;
  });

  /* eslint-disable es/no-symbol -- required for testing */

  var NATIVE_SYMBOL$1 = nativeSymbol;

  var useSymbolAsUid = NATIVE_SYMBOL$1
    && !Symbol.sham
    && typeof Symbol.iterator == 'symbol';

  var isCallable$a = isCallable$d;
  var getBuiltIn$2 = getBuiltIn$4;
  var USE_SYMBOL_AS_UID$1 = useSymbolAsUid;

  var isSymbol$2 = USE_SYMBOL_AS_UID$1 ? function (it) {
    return typeof it == 'symbol';
  } : function (it) {
    var $Symbol = getBuiltIn$2('Symbol');
    return isCallable$a($Symbol) && Object(it) instanceof $Symbol;
  };

  var tryToString$1 = function (argument) {
    try {
      return String(argument);
    } catch (error) {
      return 'Object';
    }
  };

  var isCallable$9 = isCallable$d;
  var tryToString = tryToString$1;

  // `Assert: IsCallable(argument) is true`
  var aCallable$8 = function (argument) {
    if (isCallable$9(argument)) return argument;
    throw TypeError(tryToString(argument) + ' is not a function');
  };

  var aCallable$7 = aCallable$8;

  // `GetMethod` abstract operation
  // https://tc39.es/ecma262/#sec-getmethod
  var getMethod$4 = function (V, P) {
    var func = V[P];
    return func == null ? undefined : aCallable$7(func);
  };

  var isCallable$8 = isCallable$d;
  var isObject$4 = isObject$5;

  // `OrdinaryToPrimitive` abstract operation
  // https://tc39.es/ecma262/#sec-ordinarytoprimitive
  var ordinaryToPrimitive$1 = function (input, pref) {
    var fn, val;
    if (pref === 'string' && isCallable$8(fn = input.toString) && !isObject$4(val = fn.call(input))) return val;
    if (isCallable$8(fn = input.valueOf) && !isObject$4(val = fn.call(input))) return val;
    if (pref !== 'string' && isCallable$8(fn = input.toString) && !isObject$4(val = fn.call(input))) return val;
    throw TypeError("Can't convert object to primitive value");
  };

  var shared$3 = {exports: {}};

  var global$9 = global$c;

  var setGlobal$3 = function (key, value) {
    try {
      // eslint-disable-next-line es/no-object-defineproperty -- safe
      Object.defineProperty(global$9, key, { value: value, configurable: true, writable: true });
    } catch (error) {
      global$9[key] = value;
    } return value;
  };

  var global$8 = global$c;
  var setGlobal$2 = setGlobal$3;

  var SHARED = '__core-js_shared__';
  var store$3 = global$8[SHARED] || setGlobal$2(SHARED, {});

  var sharedStore = store$3;

  var store$2 = sharedStore;

  (shared$3.exports = function (key, value) {
    return store$2[key] || (store$2[key] = value !== undefined ? value : {});
  })('versions', []).push({
    version: '3.18.3',
    mode: 'global',
    copyright: '© 2021 Denis Pushkarev (zloirock.ru)'
  });

  var requireObjectCoercible = requireObjectCoercible$2;

  // `ToObject` abstract operation
  // https://tc39.es/ecma262/#sec-toobject
  var toObject$2 = function (argument) {
    return Object(requireObjectCoercible(argument));
  };

  var toObject$1 = toObject$2;

  var hasOwnProperty = {}.hasOwnProperty;

  // `HasOwnProperty` abstract operation
  // https://tc39.es/ecma262/#sec-hasownproperty
  var hasOwnProperty_1 = Object.hasOwn || function hasOwn(it, key) {
    return hasOwnProperty.call(toObject$1(it), key);
  };

  var id = 0;
  var postfix = Math.random();

  var uid$2 = function (key) {
    return 'Symbol(' + String(key === undefined ? '' : key) + ')_' + (++id + postfix).toString(36);
  };

  var global$7 = global$c;
  var shared$2 = shared$3.exports;
  var hasOwn$8 = hasOwnProperty_1;
  var uid$1 = uid$2;
  var NATIVE_SYMBOL = nativeSymbol;
  var USE_SYMBOL_AS_UID = useSymbolAsUid;

  var WellKnownSymbolsStore = shared$2('wks');
  var Symbol$1 = global$7.Symbol;
  var createWellKnownSymbol = USE_SYMBOL_AS_UID ? Symbol$1 : Symbol$1 && Symbol$1.withoutSetter || uid$1;

  var wellKnownSymbol$8 = function (name) {
    if (!hasOwn$8(WellKnownSymbolsStore, name) || !(NATIVE_SYMBOL || typeof WellKnownSymbolsStore[name] == 'string')) {
      if (NATIVE_SYMBOL && hasOwn$8(Symbol$1, name)) {
        WellKnownSymbolsStore[name] = Symbol$1[name];
      } else {
        WellKnownSymbolsStore[name] = createWellKnownSymbol('Symbol.' + name);
      }
    } return WellKnownSymbolsStore[name];
  };

  var isObject$3 = isObject$5;
  var isSymbol$1 = isSymbol$2;
  var getMethod$3 = getMethod$4;
  var ordinaryToPrimitive = ordinaryToPrimitive$1;
  var wellKnownSymbol$7 = wellKnownSymbol$8;

  var TO_PRIMITIVE = wellKnownSymbol$7('toPrimitive');

  // `ToPrimitive` abstract operation
  // https://tc39.es/ecma262/#sec-toprimitive
  var toPrimitive$1 = function (input, pref) {
    if (!isObject$3(input) || isSymbol$1(input)) return input;
    var exoticToPrim = getMethod$3(input, TO_PRIMITIVE);
    var result;
    if (exoticToPrim) {
      if (pref === undefined) pref = 'default';
      result = exoticToPrim.call(input, pref);
      if (!isObject$3(result) || isSymbol$1(result)) return result;
      throw TypeError("Can't convert object to primitive value");
    }
    if (pref === undefined) pref = 'number';
    return ordinaryToPrimitive(input, pref);
  };

  var toPrimitive = toPrimitive$1;
  var isSymbol = isSymbol$2;

  // `ToPropertyKey` abstract operation
  // https://tc39.es/ecma262/#sec-topropertykey
  var toPropertyKey$2 = function (argument) {
    var key = toPrimitive(argument, 'string');
    return isSymbol(key) ? key : String(key);
  };

  var global$6 = global$c;
  var isObject$2 = isObject$5;

  var document$1 = global$6.document;
  // typeof document.createElement is 'object' in old IE
  var EXISTS$1 = isObject$2(document$1) && isObject$2(document$1.createElement);

  var documentCreateElement$1 = function (it) {
    return EXISTS$1 ? document$1.createElement(it) : {};
  };

  var DESCRIPTORS$5 = descriptors;
  var fails$4 = fails$8;
  var createElement = documentCreateElement$1;

  // Thank's IE8 for his funny defineProperty
  var ie8DomDefine = !DESCRIPTORS$5 && !fails$4(function () {
    // eslint-disable-next-line es/no-object-defineproperty -- requied for testing
    return Object.defineProperty(createElement('div'), 'a', {
      get: function () { return 7; }
    }).a != 7;
  });

  var DESCRIPTORS$4 = descriptors;
  var propertyIsEnumerableModule = objectPropertyIsEnumerable;
  var createPropertyDescriptor$1 = createPropertyDescriptor$2;
  var toIndexedObject$2 = toIndexedObject$3;
  var toPropertyKey$1 = toPropertyKey$2;
  var hasOwn$7 = hasOwnProperty_1;
  var IE8_DOM_DEFINE$1 = ie8DomDefine;

  // eslint-disable-next-line es/no-object-getownpropertydescriptor -- safe
  var $getOwnPropertyDescriptor = Object.getOwnPropertyDescriptor;

  // `Object.getOwnPropertyDescriptor` method
  // https://tc39.es/ecma262/#sec-object.getownpropertydescriptor
  objectGetOwnPropertyDescriptor.f = DESCRIPTORS$4 ? $getOwnPropertyDescriptor : function getOwnPropertyDescriptor(O, P) {
    O = toIndexedObject$2(O);
    P = toPropertyKey$1(P);
    if (IE8_DOM_DEFINE$1) try {
      return $getOwnPropertyDescriptor(O, P);
    } catch (error) { /* empty */ }
    if (hasOwn$7(O, P)) return createPropertyDescriptor$1(!propertyIsEnumerableModule.f.call(O, P), O[P]);
  };

  var objectDefineProperty = {};

  var isObject$1 = isObject$5;

  // `Assert: Type(argument) is Object`
  var anObject$e = function (argument) {
    if (isObject$1(argument)) return argument;
    throw TypeError(String(argument) + ' is not an object');
  };

  var DESCRIPTORS$3 = descriptors;
  var IE8_DOM_DEFINE = ie8DomDefine;
  var anObject$d = anObject$e;
  var toPropertyKey = toPropertyKey$2;

  // eslint-disable-next-line es/no-object-defineproperty -- safe
  var $defineProperty = Object.defineProperty;

  // `Object.defineProperty` method
  // https://tc39.es/ecma262/#sec-object.defineproperty
  objectDefineProperty.f = DESCRIPTORS$3 ? $defineProperty : function defineProperty(O, P, Attributes) {
    anObject$d(O);
    P = toPropertyKey(P);
    anObject$d(Attributes);
    if (IE8_DOM_DEFINE) try {
      return $defineProperty(O, P, Attributes);
    } catch (error) { /* empty */ }
    if ('get' in Attributes || 'set' in Attributes) throw TypeError('Accessors not supported');
    if ('value' in Attributes) O[P] = Attributes.value;
    return O;
  };

  var DESCRIPTORS$2 = descriptors;
  var definePropertyModule$2 = objectDefineProperty;
  var createPropertyDescriptor = createPropertyDescriptor$2;

  var createNonEnumerableProperty$5 = DESCRIPTORS$2 ? function (object, key, value) {
    return definePropertyModule$2.f(object, key, createPropertyDescriptor(1, value));
  } : function (object, key, value) {
    object[key] = value;
    return object;
  };

  var redefine$3 = {exports: {}};

  var isCallable$7 = isCallable$d;
  var store$1 = sharedStore;

  var functionToString = Function.toString;

  // this helper broken in `core-js@3.4.1-3.4.4`, so we can't use `shared` helper
  if (!isCallable$7(store$1.inspectSource)) {
    store$1.inspectSource = function (it) {
      return functionToString.call(it);
    };
  }

  var inspectSource$2 = store$1.inspectSource;

  var global$5 = global$c;
  var isCallable$6 = isCallable$d;
  var inspectSource$1 = inspectSource$2;

  var WeakMap$1 = global$5.WeakMap;

  var nativeWeakMap = isCallable$6(WeakMap$1) && /native code/.test(inspectSource$1(WeakMap$1));

  var shared$1 = shared$3.exports;
  var uid = uid$2;

  var keys = shared$1('keys');

  var sharedKey$3 = function (key) {
    return keys[key] || (keys[key] = uid(key));
  };

  var hiddenKeys$4 = {};

  var NATIVE_WEAK_MAP = nativeWeakMap;
  var global$4 = global$c;
  var isObject = isObject$5;
  var createNonEnumerableProperty$4 = createNonEnumerableProperty$5;
  var hasOwn$6 = hasOwnProperty_1;
  var shared = sharedStore;
  var sharedKey$2 = sharedKey$3;
  var hiddenKeys$3 = hiddenKeys$4;

  var OBJECT_ALREADY_INITIALIZED = 'Object already initialized';
  var WeakMap = global$4.WeakMap;
  var set, get, has;

  var enforce = function (it) {
    return has(it) ? get(it) : set(it, {});
  };

  var getterFor = function (TYPE) {
    return function (it) {
      var state;
      if (!isObject(it) || (state = get(it)).type !== TYPE) {
        throw TypeError('Incompatible receiver, ' + TYPE + ' required');
      } return state;
    };
  };

  if (NATIVE_WEAK_MAP || shared.state) {
    var store = shared.state || (shared.state = new WeakMap());
    var wmget = store.get;
    var wmhas = store.has;
    var wmset = store.set;
    set = function (it, metadata) {
      if (wmhas.call(store, it)) throw new TypeError(OBJECT_ALREADY_INITIALIZED);
      metadata.facade = it;
      wmset.call(store, it, metadata);
      return metadata;
    };
    get = function (it) {
      return wmget.call(store, it) || {};
    };
    has = function (it) {
      return wmhas.call(store, it);
    };
  } else {
    var STATE = sharedKey$2('state');
    hiddenKeys$3[STATE] = true;
    set = function (it, metadata) {
      if (hasOwn$6(it, STATE)) throw new TypeError(OBJECT_ALREADY_INITIALIZED);
      metadata.facade = it;
      createNonEnumerableProperty$4(it, STATE, metadata);
      return metadata;
    };
    get = function (it) {
      return hasOwn$6(it, STATE) ? it[STATE] : {};
    };
    has = function (it) {
      return hasOwn$6(it, STATE);
    };
  }

  var internalState = {
    set: set,
    get: get,
    has: has,
    enforce: enforce,
    getterFor: getterFor
  };

  var DESCRIPTORS$1 = descriptors;
  var hasOwn$5 = hasOwnProperty_1;

  var FunctionPrototype = Function.prototype;
  // eslint-disable-next-line es/no-object-getownpropertydescriptor -- safe
  var getDescriptor = DESCRIPTORS$1 && Object.getOwnPropertyDescriptor;

  var EXISTS = hasOwn$5(FunctionPrototype, 'name');
  // additional protection from minified / mangled / dropped function names
  var PROPER = EXISTS && (function something() { /* empty */ }).name === 'something';
  var CONFIGURABLE = EXISTS && (!DESCRIPTORS$1 || (DESCRIPTORS$1 && getDescriptor(FunctionPrototype, 'name').configurable));

  var functionName = {
    EXISTS: EXISTS,
    PROPER: PROPER,
    CONFIGURABLE: CONFIGURABLE
  };

  var global$3 = global$c;
  var isCallable$5 = isCallable$d;
  var hasOwn$4 = hasOwnProperty_1;
  var createNonEnumerableProperty$3 = createNonEnumerableProperty$5;
  var setGlobal$1 = setGlobal$3;
  var inspectSource = inspectSource$2;
  var InternalStateModule$1 = internalState;
  var CONFIGURABLE_FUNCTION_NAME = functionName.CONFIGURABLE;

  var getInternalState$1 = InternalStateModule$1.get;
  var enforceInternalState = InternalStateModule$1.enforce;
  var TEMPLATE = String(String).split('String');

  (redefine$3.exports = function (O, key, value, options) {
    var unsafe = options ? !!options.unsafe : false;
    var simple = options ? !!options.enumerable : false;
    var noTargetGet = options ? !!options.noTargetGet : false;
    var name = options && options.name !== undefined ? options.name : key;
    var state;
    if (isCallable$5(value)) {
      if (String(name).slice(0, 7) === 'Symbol(') {
        name = '[' + String(name).replace(/^Symbol\(([^)]*)\)/, '$1') + ']';
      }
      if (!hasOwn$4(value, 'name') || (CONFIGURABLE_FUNCTION_NAME && value.name !== name)) {
        createNonEnumerableProperty$3(value, 'name', name);
      }
      state = enforceInternalState(value);
      if (!state.source) {
        state.source = TEMPLATE.join(typeof name == 'string' ? name : '');
      }
    }
    if (O === global$3) {
      if (simple) O[key] = value;
      else setGlobal$1(key, value);
      return;
    } else if (!unsafe) {
      delete O[key];
    } else if (!noTargetGet && O[key]) {
      simple = true;
    }
    if (simple) O[key] = value;
    else createNonEnumerableProperty$3(O, key, value);
  // add fake Function#toString for correct work wrapped methods / constructors with methods like LoDash isNative
  })(Function.prototype, 'toString', function toString() {
    return isCallable$5(this) && getInternalState$1(this).source || inspectSource(this);
  });

  var objectGetOwnPropertyNames = {};

  var ceil = Math.ceil;
  var floor = Math.floor;

  // `ToIntegerOrInfinity` abstract operation
  // https://tc39.es/ecma262/#sec-tointegerorinfinity
  var toIntegerOrInfinity$2 = function (argument) {
    var number = +argument;
    // eslint-disable-next-line no-self-compare -- safe
    return number !== number || number === 0 ? 0 : (number > 0 ? floor : ceil)(number);
  };

  var toIntegerOrInfinity$1 = toIntegerOrInfinity$2;

  var max = Math.max;
  var min$1 = Math.min;

  // Helper for a popular repeating case of the spec:
  // Let integer be ? ToInteger(index).
  // If integer < 0, let result be max((length + integer), 0); else let result be min(integer, length).
  var toAbsoluteIndex$1 = function (index, length) {
    var integer = toIntegerOrInfinity$1(index);
    return integer < 0 ? max(integer + length, 0) : min$1(integer, length);
  };

  var toIntegerOrInfinity = toIntegerOrInfinity$2;

  var min = Math.min;

  // `ToLength` abstract operation
  // https://tc39.es/ecma262/#sec-tolength
  var toLength$1 = function (argument) {
    return argument > 0 ? min(toIntegerOrInfinity(argument), 0x1FFFFFFFFFFFFF) : 0; // 2 ** 53 - 1 == 9007199254740991
  };

  var toLength = toLength$1;

  // `LengthOfArrayLike` abstract operation
  // https://tc39.es/ecma262/#sec-lengthofarraylike
  var lengthOfArrayLike$2 = function (obj) {
    return toLength(obj.length);
  };

  var toIndexedObject$1 = toIndexedObject$3;
  var toAbsoluteIndex = toAbsoluteIndex$1;
  var lengthOfArrayLike$1 = lengthOfArrayLike$2;

  // `Array.prototype.{ indexOf, includes }` methods implementation
  var createMethod = function (IS_INCLUDES) {
    return function ($this, el, fromIndex) {
      var O = toIndexedObject$1($this);
      var length = lengthOfArrayLike$1(O);
      var index = toAbsoluteIndex(fromIndex, length);
      var value;
      // Array#includes uses SameValueZero equality algorithm
      // eslint-disable-next-line no-self-compare -- NaN check
      if (IS_INCLUDES && el != el) while (length > index) {
        value = O[index++];
        // eslint-disable-next-line no-self-compare -- NaN check
        if (value != value) return true;
      // Array#indexOf ignores holes, Array#includes - not
      } else for (;length > index; index++) {
        if ((IS_INCLUDES || index in O) && O[index] === el) return IS_INCLUDES || index || 0;
      } return !IS_INCLUDES && -1;
    };
  };

  var arrayIncludes = {
    // `Array.prototype.includes` method
    // https://tc39.es/ecma262/#sec-array.prototype.includes
    includes: createMethod(true),
    // `Array.prototype.indexOf` method
    // https://tc39.es/ecma262/#sec-array.prototype.indexof
    indexOf: createMethod(false)
  };

  var hasOwn$3 = hasOwnProperty_1;
  var toIndexedObject = toIndexedObject$3;
  var indexOf = arrayIncludes.indexOf;
  var hiddenKeys$2 = hiddenKeys$4;

  var objectKeysInternal = function (object, names) {
    var O = toIndexedObject(object);
    var i = 0;
    var result = [];
    var key;
    for (key in O) !hasOwn$3(hiddenKeys$2, key) && hasOwn$3(O, key) && result.push(key);
    // Don't enum bug & hidden keys
    while (names.length > i) if (hasOwn$3(O, key = names[i++])) {
      ~indexOf(result, key) || result.push(key);
    }
    return result;
  };

  // IE8- don't enum bug keys
  var enumBugKeys$3 = [
    'constructor',
    'hasOwnProperty',
    'isPrototypeOf',
    'propertyIsEnumerable',
    'toLocaleString',
    'toString',
    'valueOf'
  ];

  var internalObjectKeys$1 = objectKeysInternal;
  var enumBugKeys$2 = enumBugKeys$3;

  var hiddenKeys$1 = enumBugKeys$2.concat('length', 'prototype');

  // `Object.getOwnPropertyNames` method
  // https://tc39.es/ecma262/#sec-object.getownpropertynames
  // eslint-disable-next-line es/no-object-getownpropertynames -- safe
  objectGetOwnPropertyNames.f = Object.getOwnPropertyNames || function getOwnPropertyNames(O) {
    return internalObjectKeys$1(O, hiddenKeys$1);
  };

  var objectGetOwnPropertySymbols = {};

  // eslint-disable-next-line es/no-object-getownpropertysymbols -- safe
  objectGetOwnPropertySymbols.f = Object.getOwnPropertySymbols;

  var getBuiltIn$1 = getBuiltIn$4;
  var getOwnPropertyNamesModule = objectGetOwnPropertyNames;
  var getOwnPropertySymbolsModule = objectGetOwnPropertySymbols;
  var anObject$c = anObject$e;

  // all object keys, includes non-enumerable and symbols
  var ownKeys$1 = getBuiltIn$1('Reflect', 'ownKeys') || function ownKeys(it) {
    var keys = getOwnPropertyNamesModule.f(anObject$c(it));
    var getOwnPropertySymbols = getOwnPropertySymbolsModule.f;
    return getOwnPropertySymbols ? keys.concat(getOwnPropertySymbols(it)) : keys;
  };

  var hasOwn$2 = hasOwnProperty_1;
  var ownKeys = ownKeys$1;
  var getOwnPropertyDescriptorModule = objectGetOwnPropertyDescriptor;
  var definePropertyModule$1 = objectDefineProperty;

  var copyConstructorProperties$1 = function (target, source) {
    var keys = ownKeys(source);
    var defineProperty = definePropertyModule$1.f;
    var getOwnPropertyDescriptor = getOwnPropertyDescriptorModule.f;
    for (var i = 0; i < keys.length; i++) {
      var key = keys[i];
      if (!hasOwn$2(target, key)) defineProperty(target, key, getOwnPropertyDescriptor(source, key));
    }
  };

  var fails$3 = fails$8;
  var isCallable$4 = isCallable$d;

  var replacement = /#|\.prototype\./;

  var isForced$1 = function (feature, detection) {
    var value = data[normalize(feature)];
    return value == POLYFILL ? true
      : value == NATIVE ? false
      : isCallable$4(detection) ? fails$3(detection)
      : !!detection;
  };

  var normalize = isForced$1.normalize = function (string) {
    return String(string).replace(replacement, '.').toLowerCase();
  };

  var data = isForced$1.data = {};
  var NATIVE = isForced$1.NATIVE = 'N';
  var POLYFILL = isForced$1.POLYFILL = 'P';

  var isForced_1 = isForced$1;

  var global$2 = global$c;
  var getOwnPropertyDescriptor = objectGetOwnPropertyDescriptor.f;
  var createNonEnumerableProperty$2 = createNonEnumerableProperty$5;
  var redefine$2 = redefine$3.exports;
  var setGlobal = setGlobal$3;
  var copyConstructorProperties = copyConstructorProperties$1;
  var isForced = isForced_1;

  /*
    options.target      - name of the target object
    options.global      - target is the global object
    options.stat        - export as static methods of target
    options.proto       - export as prototype methods of target
    options.real        - real prototype method for the `pure` version
    options.forced      - export even if the native feature is available
    options.bind        - bind methods to the target, required for the `pure` version
    options.wrap        - wrap constructors to preventing global pollution, required for the `pure` version
    options.unsafe      - use the simple assignment of property instead of delete + defineProperty
    options.sham        - add a flag to not completely full polyfills
    options.enumerable  - export as enumerable property
    options.noTargetGet - prevent calling a getter on target
    options.name        - the .name of the function if it does not match the key
  */
  var _export = function (options, source) {
    var TARGET = options.target;
    var GLOBAL = options.global;
    var STATIC = options.stat;
    var FORCED, target, key, targetProperty, sourceProperty, descriptor;
    if (GLOBAL) {
      target = global$2;
    } else if (STATIC) {
      target = global$2[TARGET] || setGlobal(TARGET, {});
    } else {
      target = (global$2[TARGET] || {}).prototype;
    }
    if (target) for (key in source) {
      sourceProperty = source[key];
      if (options.noTargetGet) {
        descriptor = getOwnPropertyDescriptor(target, key);
        targetProperty = descriptor && descriptor.value;
      } else targetProperty = target[key];
      FORCED = isForced(GLOBAL ? key : TARGET + (STATIC ? '.' : '#') + key, options.forced);
      // contained in target
      if (!FORCED && targetProperty !== undefined) {
        if (typeof sourceProperty === typeof targetProperty) continue;
        copyConstructorProperties(sourceProperty, targetProperty);
      }
      // add a flag to not completely full polyfills
      if (options.sham || (targetProperty && targetProperty.sham)) {
        createNonEnumerableProperty$2(sourceProperty, 'sham', true);
      }
      // extend global
      redefine$2(target, key, sourceProperty, options);
    }
  };

  var anInstance$1 = function (it, Constructor, name) {
    if (it instanceof Constructor) return it;
    throw TypeError('Incorrect ' + (name ? name + ' ' : '') + 'invocation');
  };

  var internalObjectKeys = objectKeysInternal;
  var enumBugKeys$1 = enumBugKeys$3;

  // `Object.keys` method
  // https://tc39.es/ecma262/#sec-object.keys
  // eslint-disable-next-line es/no-object-keys -- safe
  var objectKeys$1 = Object.keys || function keys(O) {
    return internalObjectKeys(O, enumBugKeys$1);
  };

  var DESCRIPTORS = descriptors;
  var definePropertyModule = objectDefineProperty;
  var anObject$b = anObject$e;
  var objectKeys = objectKeys$1;

  // `Object.defineProperties` method
  // https://tc39.es/ecma262/#sec-object.defineproperties
  // eslint-disable-next-line es/no-object-defineproperties -- safe
  var objectDefineProperties = DESCRIPTORS ? Object.defineProperties : function defineProperties(O, Properties) {
    anObject$b(O);
    var keys = objectKeys(Properties);
    var length = keys.length;
    var index = 0;
    var key;
    while (length > index) definePropertyModule.f(O, key = keys[index++], Properties[key]);
    return O;
  };

  var getBuiltIn = getBuiltIn$4;

  var html$1 = getBuiltIn('document', 'documentElement');

  /* global ActiveXObject -- old IE, WSH */

  var anObject$a = anObject$e;
  var defineProperties = objectDefineProperties;
  var enumBugKeys = enumBugKeys$3;
  var hiddenKeys = hiddenKeys$4;
  var html = html$1;
  var documentCreateElement = documentCreateElement$1;
  var sharedKey$1 = sharedKey$3;

  var GT = '>';
  var LT = '<';
  var PROTOTYPE = 'prototype';
  var SCRIPT = 'script';
  var IE_PROTO$1 = sharedKey$1('IE_PROTO');

  var EmptyConstructor = function () { /* empty */ };

  var scriptTag = function (content) {
    return LT + SCRIPT + GT + content + LT + '/' + SCRIPT + GT;
  };

  // Create object with fake `null` prototype: use ActiveX Object with cleared prototype
  var NullProtoObjectViaActiveX = function (activeXDocument) {
    activeXDocument.write(scriptTag(''));
    activeXDocument.close();
    var temp = activeXDocument.parentWindow.Object;
    activeXDocument = null; // avoid memory leak
    return temp;
  };

  // Create object with fake `null` prototype: use iframe Object with cleared prototype
  var NullProtoObjectViaIFrame = function () {
    // Thrash, waste and sodomy: IE GC bug
    var iframe = documentCreateElement('iframe');
    var JS = 'java' + SCRIPT + ':';
    var iframeDocument;
    iframe.style.display = 'none';
    html.appendChild(iframe);
    // https://github.com/zloirock/core-js/issues/475
    iframe.src = String(JS);
    iframeDocument = iframe.contentWindow.document;
    iframeDocument.open();
    iframeDocument.write(scriptTag('document.F=Object'));
    iframeDocument.close();
    return iframeDocument.F;
  };

  // Check for document.domain and active x support
  // No need to use active x approach when document.domain is not set
  // see https://github.com/es-shims/es5-shim/issues/150
  // variation of https://github.com/kitcambridge/es5-shim/commit/4f738ac066346
  // avoid IE GC bug
  var activeXDocument;
  var NullProtoObject = function () {
    try {
      activeXDocument = new ActiveXObject('htmlfile');
    } catch (error) { /* ignore */ }
    NullProtoObject = typeof document != 'undefined'
      ? document.domain && activeXDocument
        ? NullProtoObjectViaActiveX(activeXDocument) // old IE
        : NullProtoObjectViaIFrame()
      : NullProtoObjectViaActiveX(activeXDocument); // WSH
    var length = enumBugKeys.length;
    while (length--) delete NullProtoObject[PROTOTYPE][enumBugKeys[length]];
    return NullProtoObject();
  };

  hiddenKeys[IE_PROTO$1] = true;

  // `Object.create` method
  // https://tc39.es/ecma262/#sec-object.create
  var objectCreate = Object.create || function create(O, Properties) {
    var result;
    if (O !== null) {
      EmptyConstructor[PROTOTYPE] = anObject$a(O);
      result = new EmptyConstructor();
      EmptyConstructor[PROTOTYPE] = null;
      // add "__proto__" for Object.getPrototypeOf polyfill
      result[IE_PROTO$1] = O;
    } else result = NullProtoObject();
    return Properties === undefined ? result : defineProperties(result, Properties);
  };

  var fails$2 = fails$8;

  var correctPrototypeGetter = !fails$2(function () {
    function F() { /* empty */ }
    F.prototype.constructor = null;
    // eslint-disable-next-line es/no-object-getprototypeof -- required for testing
    return Object.getPrototypeOf(new F()) !== F.prototype;
  });

  var hasOwn$1 = hasOwnProperty_1;
  var isCallable$3 = isCallable$d;
  var toObject = toObject$2;
  var sharedKey = sharedKey$3;
  var CORRECT_PROTOTYPE_GETTER = correctPrototypeGetter;

  var IE_PROTO = sharedKey('IE_PROTO');
  var ObjectPrototype = Object.prototype;

  // `Object.getPrototypeOf` method
  // https://tc39.es/ecma262/#sec-object.getprototypeof
  // eslint-disable-next-line es/no-object-getprototypeof -- safe
  var objectGetPrototypeOf = CORRECT_PROTOTYPE_GETTER ? Object.getPrototypeOf : function (O) {
    var object = toObject(O);
    if (hasOwn$1(object, IE_PROTO)) return object[IE_PROTO];
    var constructor = object.constructor;
    if (isCallable$3(constructor) && object instanceof constructor) {
      return constructor.prototype;
    } return object instanceof Object ? ObjectPrototype : null;
  };

  var fails$1 = fails$8;
  var isCallable$2 = isCallable$d;
  var getPrototypeOf = objectGetPrototypeOf;
  var redefine$1 = redefine$3.exports;
  var wellKnownSymbol$6 = wellKnownSymbol$8;

  var ITERATOR$2 = wellKnownSymbol$6('iterator');
  var BUGGY_SAFARI_ITERATORS = false;

  // `%IteratorPrototype%` object
  // https://tc39.es/ecma262/#sec-%iteratorprototype%-object
  var IteratorPrototype$2, PrototypeOfArrayIteratorPrototype, arrayIterator;

  /* eslint-disable es/no-array-prototype-keys -- safe */
  if ([].keys) {
    arrayIterator = [].keys();
    // Safari 8 has buggy iterators w/o `next`
    if (!('next' in arrayIterator)) BUGGY_SAFARI_ITERATORS = true;
    else {
      PrototypeOfArrayIteratorPrototype = getPrototypeOf(getPrototypeOf(arrayIterator));
      if (PrototypeOfArrayIteratorPrototype !== Object.prototype) IteratorPrototype$2 = PrototypeOfArrayIteratorPrototype;
    }
  }

  var NEW_ITERATOR_PROTOTYPE = IteratorPrototype$2 == undefined || fails$1(function () {
    var test = {};
    // FF44- legacy iterators case
    return IteratorPrototype$2[ITERATOR$2].call(test) !== test;
  });

  if (NEW_ITERATOR_PROTOTYPE) IteratorPrototype$2 = {};

  // `%IteratorPrototype%[@@iterator]()` method
  // https://tc39.es/ecma262/#sec-%iteratorprototype%-@@iterator
  if (!isCallable$2(IteratorPrototype$2[ITERATOR$2])) {
    redefine$1(IteratorPrototype$2, ITERATOR$2, function () {
      return this;
    });
  }

  var iteratorsCore = {
    IteratorPrototype: IteratorPrototype$2,
    BUGGY_SAFARI_ITERATORS: BUGGY_SAFARI_ITERATORS
  };

  // https://github.com/tc39/proposal-iterator-helpers
  var $$5 = _export;
  var global$1 = global$c;
  var anInstance = anInstance$1;
  var isCallable$1 = isCallable$d;
  var createNonEnumerableProperty$1 = createNonEnumerableProperty$5;
  var fails = fails$8;
  var hasOwn = hasOwnProperty_1;
  var wellKnownSymbol$5 = wellKnownSymbol$8;
  var IteratorPrototype$1 = iteratorsCore.IteratorPrototype;

  var TO_STRING_TAG$3 = wellKnownSymbol$5('toStringTag');

  var NativeIterator = global$1.Iterator;

  // FF56- have non-standard global helper `Iterator`
  var FORCED = !isCallable$1(NativeIterator)
    || NativeIterator.prototype !== IteratorPrototype$1
    // FF44- non-standard `Iterator` passes previous tests
    || !fails(function () { NativeIterator({}); });

  var IteratorConstructor = function Iterator() {
    anInstance(this, IteratorConstructor);
  };

  if (!hasOwn(IteratorPrototype$1, TO_STRING_TAG$3)) {
    createNonEnumerableProperty$1(IteratorPrototype$1, TO_STRING_TAG$3, 'Iterator');
  }

  if (FORCED || !hasOwn(IteratorPrototype$1, 'constructor') || IteratorPrototype$1.constructor === Object) {
    createNonEnumerableProperty$1(IteratorPrototype$1, 'constructor', IteratorConstructor);
  }

  IteratorConstructor.prototype = IteratorPrototype$1;

  $$5({ global: true, forced: FORCED }, {
    Iterator: IteratorConstructor
  });

  var iterators = {};

  var wellKnownSymbol$4 = wellKnownSymbol$8;
  var Iterators$1 = iterators;

  var ITERATOR$1 = wellKnownSymbol$4('iterator');
  var ArrayPrototype = Array.prototype;

  // check on default Array iterator
  var isArrayIteratorMethod$1 = function (it) {
    return it !== undefined && (Iterators$1.Array === it || ArrayPrototype[ITERATOR$1] === it);
  };

  var aCallable$6 = aCallable$8;

  // optional / simple context binding
  var functionBindContext = function (fn, that, length) {
    aCallable$6(fn);
    if (that === undefined) return fn;
    switch (length) {
      case 0: return function () {
        return fn.call(that);
      };
      case 1: return function (a) {
        return fn.call(that, a);
      };
      case 2: return function (a, b) {
        return fn.call(that, a, b);
      };
      case 3: return function (a, b, c) {
        return fn.call(that, a, b, c);
      };
    }
    return function (/* ...args */) {
      return fn.apply(that, arguments);
    };
  };

  var wellKnownSymbol$3 = wellKnownSymbol$8;

  var TO_STRING_TAG$2 = wellKnownSymbol$3('toStringTag');
  var test = {};

  test[TO_STRING_TAG$2] = 'z';

  var toStringTagSupport = String(test) === '[object z]';

  var TO_STRING_TAG_SUPPORT = toStringTagSupport;
  var isCallable = isCallable$d;
  var classofRaw = classofRaw$1;
  var wellKnownSymbol$2 = wellKnownSymbol$8;

  var TO_STRING_TAG$1 = wellKnownSymbol$2('toStringTag');
  // ES3 wrong here
  var CORRECT_ARGUMENTS = classofRaw(function () { return arguments; }()) == 'Arguments';

  // fallback for IE11 Script Access Denied error
  var tryGet = function (it, key) {
    try {
      return it[key];
    } catch (error) { /* empty */ }
  };

  // getting tag from ES6+ `Object.prototype.toString`
  var classof$1 = TO_STRING_TAG_SUPPORT ? classofRaw : function (it) {
    var O, tag, result;
    return it === undefined ? 'Undefined' : it === null ? 'Null'
      // @@toStringTag case
      : typeof (tag = tryGet(O = Object(it), TO_STRING_TAG$1)) == 'string' ? tag
      // builtinTag case
      : CORRECT_ARGUMENTS ? classofRaw(O)
      // ES3 arguments fallback
      : (result = classofRaw(O)) == 'Object' && isCallable(O.callee) ? 'Arguments' : result;
  };

  var classof = classof$1;
  var getMethod$2 = getMethod$4;
  var Iterators = iterators;
  var wellKnownSymbol$1 = wellKnownSymbol$8;

  var ITERATOR = wellKnownSymbol$1('iterator');

  var getIteratorMethod$2 = function (it) {
    if (it != undefined) return getMethod$2(it, ITERATOR)
      || getMethod$2(it, '@@iterator')
      || Iterators[classof(it)];
  };

  var aCallable$5 = aCallable$8;
  var anObject$9 = anObject$e;
  var getIteratorMethod$1 = getIteratorMethod$2;

  var getIterator$1 = function (argument, usingIterator) {
    var iteratorMethod = arguments.length < 2 ? getIteratorMethod$1(argument) : usingIterator;
    if (aCallable$5(iteratorMethod)) return anObject$9(iteratorMethod.call(argument));
    throw TypeError(String(argument) + ' is not iterable');
  };

  var anObject$8 = anObject$e;
  var getMethod$1 = getMethod$4;

  var iteratorClose$2 = function (iterator, kind, value) {
    var innerResult, innerError;
    anObject$8(iterator);
    try {
      innerResult = getMethod$1(iterator, 'return');
      if (!innerResult) {
        if (kind === 'throw') throw value;
        return value;
      }
      innerResult = innerResult.call(iterator);
    } catch (error) {
      innerError = true;
      innerResult = error;
    }
    if (kind === 'throw') throw value;
    if (innerError) throw innerResult;
    anObject$8(innerResult);
    return value;
  };

  var anObject$7 = anObject$e;
  var isArrayIteratorMethod = isArrayIteratorMethod$1;
  var lengthOfArrayLike = lengthOfArrayLike$2;
  var bind = functionBindContext;
  var getIterator = getIterator$1;
  var getIteratorMethod = getIteratorMethod$2;
  var iteratorClose$1 = iteratorClose$2;

  var Result = function (stopped, result) {
    this.stopped = stopped;
    this.result = result;
  };

  var iterate$3 = function (iterable, unboundFunction, options) {
    var that = options && options.that;
    var AS_ENTRIES = !!(options && options.AS_ENTRIES);
    var IS_ITERATOR = !!(options && options.IS_ITERATOR);
    var INTERRUPTED = !!(options && options.INTERRUPTED);
    var fn = bind(unboundFunction, that, 1 + AS_ENTRIES + INTERRUPTED);
    var iterator, iterFn, index, length, result, next, step;

    var stop = function (condition) {
      if (iterator) iteratorClose$1(iterator, 'normal', condition);
      return new Result(true, condition);
    };

    var callFn = function (value) {
      if (AS_ENTRIES) {
        anObject$7(value);
        return INTERRUPTED ? fn(value[0], value[1], stop) : fn(value[0], value[1]);
      } return INTERRUPTED ? fn(value, stop) : fn(value);
    };

    if (IS_ITERATOR) {
      iterator = iterable;
    } else {
      iterFn = getIteratorMethod(iterable);
      if (!iterFn) throw TypeError(String(iterable) + ' is not iterable');
      // optimisation for array iterators
      if (isArrayIteratorMethod(iterFn)) {
        for (index = 0, length = lengthOfArrayLike(iterable); length > index; index++) {
          result = callFn(iterable[index]);
          if (result && result instanceof Result) return result;
        } return new Result(false);
      }
      iterator = getIterator(iterable, iterFn);
    }

    next = iterator.next;
    while (!(step = next.call(iterator)).done) {
      try {
        result = callFn(step.value);
      } catch (error) {
        iteratorClose$1(iterator, 'throw', error);
      }
      if (typeof result == 'object' && result && result instanceof Result) return result;
    } return new Result(false);
  };

  // https://github.com/tc39/proposal-iterator-helpers
  var $$4 = _export;
  var iterate$2 = iterate$3;
  var aCallable$4 = aCallable$8;
  var anObject$6 = anObject$e;

  $$4({ target: 'Iterator', proto: true, real: true }, {
    every: function every(fn) {
      anObject$6(this);
      aCallable$4(fn);
      return !iterate$2(this, function (value, stop) {
        if (!fn(value)) return stop();
      }, { IS_ITERATOR: true, INTERRUPTED: true }).stopped;
    }
  });

  var redefine = redefine$3.exports;

  var redefineAll$1 = function (target, src, options) {
    for (var key in src) redefine(target, key, src[key], options);
    return target;
  };

  var aCallable$3 = aCallable$8;
  var anObject$5 = anObject$e;
  var create = objectCreate;
  var createNonEnumerableProperty = createNonEnumerableProperty$5;
  var redefineAll = redefineAll$1;
  var wellKnownSymbol = wellKnownSymbol$8;
  var InternalStateModule = internalState;
  var getMethod = getMethod$4;
  var IteratorPrototype = iteratorsCore.IteratorPrototype;

  var setInternalState = InternalStateModule.set;
  var getInternalState = InternalStateModule.get;

  var TO_STRING_TAG = wellKnownSymbol('toStringTag');

  var iteratorCreateProxy = function (nextHandler, IS_ITERATOR) {
    var IteratorProxy = function Iterator(state) {
      state.next = aCallable$3(state.iterator.next);
      state.done = false;
      state.ignoreArg = !IS_ITERATOR;
      setInternalState(this, state);
    };

    IteratorProxy.prototype = redefineAll(create(IteratorPrototype), {
      next: function next(arg) {
        var state = getInternalState(this);
        var args = arguments.length ? [state.ignoreArg ? undefined : arg] : IS_ITERATOR ? [] : [undefined];
        state.ignoreArg = false;
        var result = state.done ? undefined : nextHandler.call(state, args);
        return { done: state.done, value: result };
      },
      'return': function (value) {
        var state = getInternalState(this);
        var iterator = state.iterator;
        state.done = true;
        var $$return = getMethod(iterator, 'return');
        return { done: true, value: $$return ? anObject$5($$return.call(iterator, value)).value : value };
      },
      'throw': function (value) {
        var state = getInternalState(this);
        var iterator = state.iterator;
        state.done = true;
        var $$throw = getMethod(iterator, 'throw');
        if ($$throw) return $$throw.call(iterator, value);
        throw value;
      }
    });

    if (!IS_ITERATOR) {
      createNonEnumerableProperty(IteratorProxy.prototype, TO_STRING_TAG, 'Generator');
    }

    return IteratorProxy;
  };

  var anObject$4 = anObject$e;
  var iteratorClose = iteratorClose$2;

  // call something on iterator step with safe closing on error
  var callWithSafeIterationClosing$2 = function (iterator, fn, value, ENTRIES) {
    try {
      return ENTRIES ? fn(anObject$4(value)[0], value[1]) : fn(value);
    } catch (error) {
      iteratorClose(iterator, 'throw', error);
    }
  };

  // https://github.com/tc39/proposal-iterator-helpers
  var $$3 = _export;
  var aCallable$2 = aCallable$8;
  var anObject$3 = anObject$e;
  var createIteratorProxy$1 = iteratorCreateProxy;
  var callWithSafeIterationClosing$1 = callWithSafeIterationClosing$2;

  var IteratorProxy$1 = createIteratorProxy$1(function (args) {
    var iterator = this.iterator;
    var filterer = this.filterer;
    var next = this.next;
    var result, done, value;
    while (true) {
      result = anObject$3(next.apply(iterator, args));
      done = this.done = !!result.done;
      if (done) return;
      value = result.value;
      if (callWithSafeIterationClosing$1(iterator, filterer, value)) return value;
    }
  });

  $$3({ target: 'Iterator', proto: true, real: true }, {
    filter: function filter(filterer) {
      return new IteratorProxy$1({
        iterator: anObject$3(this),
        filterer: aCallable$2(filterer)
      });
    }
  });

  // https://github.com/tc39/proposal-iterator-helpers
  var $$2 = _export;
  var iterate$1 = iterate$3;
  var aCallable$1 = aCallable$8;
  var anObject$2 = anObject$e;

  $$2({ target: 'Iterator', proto: true, real: true }, {
    find: function find(fn) {
      anObject$2(this);
      aCallable$1(fn);
      return iterate$1(this, function (value, stop) {
        if (fn(value)) return stop(value);
      }, { IS_ITERATOR: true, INTERRUPTED: true }).result;
    }
  });

  // https://github.com/tc39/proposal-iterator-helpers
  var $$1 = _export;
  var iterate = iterate$3;
  var anObject$1 = anObject$e;

  $$1({ target: 'Iterator', proto: true, real: true }, {
    forEach: function forEach(fn) {
      iterate(anObject$1(this), fn, { IS_ITERATOR: true });
    }
  });

  // https://github.com/tc39/proposal-iterator-helpers
  var $ = _export;
  var aCallable = aCallable$8;
  var anObject = anObject$e;
  var createIteratorProxy = iteratorCreateProxy;
  var callWithSafeIterationClosing = callWithSafeIterationClosing$2;

  var IteratorProxy = createIteratorProxy(function (args) {
    var iterator = this.iterator;
    var result = anObject(this.next.apply(iterator, args));
    var done = this.done = !!result.done;
    if (!done) return callWithSafeIterationClosing(iterator, this.mapper, result.value);
  });

  $({ target: 'Iterator', proto: true, real: true }, {
    map: function map(mapper) {
      return new IteratorProxy({
        iterator: anObject(this),
        mapper: aCallable(mapper)
      });
    }
  });

  const effects = {
    // 分裂
    'split': (stats, effectData) => {
      const splitRate = effectData.rate * (1 + stats.splitRune) / 100;
      stats.split = stats.split + splitRate * effectData.value;
    },
    // 重击
    'thump': (stats, effectData) => {
      stats.thump = stats.thump + effectData.rate / 100 * effectData.value;
    },
    // 残忍
    'cruel': (stats, effectData) => {
      stats.cruel = stats.cruel + (effectData?.value || 0) + stats.cruelRune;
      stats.cruelRatio = stats.cruelRatio + (effectData?.multiplier || 0) + stats.cruelRatioRune;
    },
    // 轻灵
    'swiftness': (stats, effectData) => {
      stats.swiftness += effectData.value - 1 + stats.swiftnessRune;
    },
    // 爆发
    'burst': (stats, effectData) => {
      stats.burst += effectData.rate;
    }
  };
  const segmentEffects = {
    // 收割
    'harvest': segment => ({
      hpPercentType: 'below',
      harvestRatio: (segment.multiplier || 0) * (1 + (segment.extraMultiplier || 0)),
      harvest: (segment.value || 0) * (1 + (segment.extraMultiplier || 0))
    }),
    // 冲击
    'impact': segment => ({
      hpPercentType: 'above',
      impactRatio: (segment.multiplier || 0) * (1 + (segment.extraMultiplier || 0)),
      impact: (segment.value || 0) * (1 + (segment.extraMultiplier || 0))
    }),
    // 冲锋
    'assault': segment => ({
      hpPercentType: 'above',
      assault: (segment.multiplier || 0) * (1 + (segment.extraMultiplier || 0))
    })
  };
  const runeEffects = {
    // 残忍
    'cruel': (stats, effectData, runeFactor, typeFactor) => {
      stats.cruelRune += (effectData?.extraValue || 0) * (runeFactor?.extraValue || 1.0) * typeFactor;
      stats.cruelRatioRune += (effectData?.extraMultiplier || 0) * (runeFactor?.extraMultiplier || 1.0) * typeFactor;
    }
  };
  const monsterEffects = {
    '求生': (stats, monsterHpSegment, monsterInfo, abilityInfo) => {
      monsterHpSegment.push({
        hpPercent: abilityInfo[1],
        hpPercentType: 'below',
        monsterEvasion: abilityInfo[2]
      });
    },
    '冰霜巫术': (stats, monsterHpSegment, monsterInfo, abilityInfo) => {
      monsterHpSegment.push({
        hpPercent: 50,
        hpPercentType: 'below',
        monsterLeech: monsterInfo.hpMax * 0.02
      });
    },
    '冰霜护盾': (stats, monsterHpSegment, monsterInfo, abilityInfo) => {
      monsterHpSegment.push({
        hpPercent: 50,
        hpPercentType: 'below',
        monsterEvasion: 55
      });
    },
    '惊骇': (stats, monsterHpSegment, monsterInfo, abilityInfo) => {
      monsterHpSegment.push({
        hpPercent: 10,
        hpPercentType: 'below',
        specialFunc: stats => {
          stats.hr -= 50;
        }
      });
    },
    '吸血': (stats, monsterHpSegment, monsterInfo, abilityInfo) => {
      stats.monsterLeech = monsterInfo.hpMax * abilityInfo[2] / 100;
    },
    // TODO: 多段攻击免疫效果优化
    '反击': (stats, monsterHpSegment, monsterInfo, abilityInfo) => {
      stats.split *= 0.7;
    },
    '恐吓': (stats, monsterHpSegment, monsterInfo, abilityInfo) => {
      stats.heat *= 0.5;
    },
    '磐石': (stats, monsterHpSegment, monsterInfo, abilityInfo) => {
      stats.monsterDefense = abilityInfo[1] / 100 * abilityInfo[2];
    },
    '坚韧': (stats, monsterHpSegment, monsterInfo, abilityInfo) => {
      monsterHpSegment.push({
        hpPercent: abilityInfo[1] || 20,
        hpPercentType: 'below',
        monsterDefense: abilityInfo[2] || 200
      });
    },
    '无畏': (stats, monsterHpSegment, monsterInfo, abilityInfo) => {
      monsterHpSegment.push({
        hpPercent: abilityInfo[1] || 70,
        hpPercentType: 'below',
        monsterDefense: abilityInfo[2] || 100
      });
    },
    '虚弱': (stats, monsterHpSegment, monsterInfo, abilityInfo) => {
      stats.atk *= 0.5;
    },
    '麻痹': (stats, monsterHpSegment, monsterInfo, abilityInfo) => {
      stats.paralysis = abilityInfo[1];
    },
    '迟缓': (stats, monsterHpSegment, monsterInfo, abilityInfo) => {
      stats.finalAtksp -= abilityInfo[1] / 100;
    },
    '诅咒': (stats, monsterHpSegment, monsterInfo, abilityInfo) => {
      stats.hr -= abilityInfo[1] / 100;
    },
    '修复': (stats, monsterHpSegment, monsterInfo, abilityInfo) => {
      monsterHpSegment.push({
        hpPercent: abilityInfo[1],
        hpPercentType: 'above',
        healPercent: abilityInfo[2],
        healTimes: 1
      });
      monsterHpSegment.push({
        // 无实际作用，用于显示回血分段
        hpPercent: abilityInfo[1] + abilityInfo[2],
        hpPercentType: 'above'
      });
    }
  };

  const equipmentsData = loadFromLocalStorage("equipmentsData", {});
  registHTTPRequestHandler(/awakening-of-war-soul-ol\/socket\.io/, /.*/, /^430.+/, res => {
    Object.assign(equipmentsData, res[0].data);
    logMessage(`Equipments Data Updated, total ${Object.keys(equipmentsData).length} items`);
    saveToLocalStorage("equipmentsData", equipmentsData);
    return res;
  });
  const runeData = loadFromLocalStorage("runeData", {});
  registMessageHandler(/^431\[/, obj => {
    Object.assign(runeData, obj[0].data);
    logMessage(`Rune Data Updated, total ${Object.keys(runeData.runeCollection).length} runes`);
    saveToLocalStorage("runeData", runeData);
    return obj;
  });
  const relicData = loadFromLocalStorage("relicData", {});
  registMessageHandler(/^432\[/, obj => {
    Object.assign(relicData, obj[0].data);
    logMessage(`Relic Data Updated, total ${Object.keys(relicData).length} relics`);
    saveToLocalStorage("relicData", relicData);
    return obj;
  });
  const darkGoldData = loadFromLocalStorage("darkGoldData", {});
  registMessageHandler(/^433\[/, obj => {
    Object.assign(darkGoldData, obj[0].data);
    logMessage(`Dark Gold Data Updated`);
    saveToLocalStorage("darkGoldData", darkGoldData);
    return obj;
  });
  const starAttrMap = {
    1: stat => {
      stat.atk += 2;
    },
    // 攻击 + 2
    2: stat => {
      stat.atksp += 1;
    },
    // 攻击速度 + 1%
    3: stat => {
      stat.crt += 2;
    },
    // 暴击率 + 2%
    4: stat => {
      stat.crtd += 6;
    },
    // 暴击伤害 + 6%
    5: stat => {
      stat.heat += 3;
    },
    // 破防 + 3
    6: stat => {
      stat.hr += 1;
    } // 命中率 + 1%
  };
  const equipmentEnhanceMap = {
    'weapon': (stat, level) => {
      stat.atk += equipmentEnhanceTable.atk[level] || 0;
    },
    'helmet': (stat, level) => {
      stat.heat += equipmentEnhanceTable.heat[level] || 0;
    },
    'armor': (stat, level) => {
      stat.hr += equipmentEnhanceTable.rate[level] || 0;
    },
    'shoes': (stat, level) => {
      stat.atksp += equipmentEnhanceTable.rate[level] || 0;
    },
    'jewelry': (stat, level) => {
      stat.crt += equipmentEnhanceTable.rate[level] || 0;
      stat.crtd += equipmentEnhanceTable.crtd[level] || 0;
    }
  };
  function weaponSpecialParse(stats, effect, type = "normal") {
    const effectData = JSON.parse(JSON.stringify(effect.data));
    if (type === "darkGold") {
      const darkGoldEffectData = darkGoldData.darkGoldSpecialFactor[effect.key];
      Object.keys(darkGoldEffectData).forEach(factorKey => {
        if (effectData[factorKey] !== undefined) {
          effectData[factorKey] = (effectData[factorKey] + 10) * darkGoldEffectData[factorKey];
        }
      });
    }
    if (stats[effect.key] !== undefined) {
      const runeKey = `${effect.key}Rune`;
      if (Object.keys(effects).includes(effect.key)) {
        effects[effect.key](stats, effectData);
      } else if (runeKey in stats) {
        stats[effect.key] += effectData.value + stats[runeKey];
      } else if (effectData.value) {
        stats[effect.key] += effectData.value;
      } else if (effectData.multiplier) {
        stats[effect.key] += effectData.multiplier;
      }
    } else if (Object.keys(segmentEffects).includes(effect.key)) {
      addStatsSegment(stats, effect.key, effectData);
    } else if (!stats.ignoreSpecials.includes(effect.key)) {
      stats.ignoreSpecials.push(effect.key);
    }
  }
  function runeSpecialParse(stats, effect, typeFactor = 1.0) {
    const key = `${effect.key}Rune`;
    const p = runeData.runeSpecialFactor[effect.key] || {};
    if (Object.keys(runeEffects).includes(effect.key)) {
      runeEffects[effect.key](stats, effect.data, p, typeFactor);
    } else if (p.extraHpPercent) {
      addRuneSegment(stats, effect.key, p, typeFactor);
    } else if (stats[key] !== undefined) {
      if (effect.data.extraRate) {
        stats[key] += effect.data.extraRate * (p?.extraRate || 1.0) * typeFactor;
      } else if (effect.data.extraValue) {
        stats[key] += effect.data.extraValue * (p?.extraValue || 1.0) * typeFactor;
      } else if (effect.data.extraMultiplier) {
        stats[key] += effect.data.extraMultiplier * (p?.extraMultiplier || 1.0) * typeFactor;
      }
    } else if (!stats.ignoreSpecials.includes(key)) {
      stats.ignoreSpecials.push(key);
    }
  }
  function addStatsSegment(stats, type, effect) {
    stats.segments.push({
      type,
      ...effect
    });
  }
  function addRuneSegment(stats, name, effect, typeFactor) {
    stats.segments.forEach(segment => {
      if (segment.type === name) {
        Object.keys(effect).forEach(key => {
          if (key === 'extraHpPercent') {
            segment.extraHpPercent = (segment.extraHpPercent || 0) + effect[key] * typeFactor;
          } else {
            segment[key] = (segment[key] || 0) + effect[key] * typeFactor;
          }
        });
      }
    });
  }
  function parsePlayerSegments(stats) {
    const hpSegments = [{
      hpPercent: 0,
      hpPercentType: 'above',
      ...stats
    }]; // 以血量百分比为key，属性对象为value
    stats.segments.forEach(segment => {
      const actualHpPercent = 100 - (1 + (segment.extraHpPercent || 0)) * (100 - segment.hpPercent);
      if (Object.keys(segmentEffects).includes(segment.type)) {
        hpSegments.push({
          hpPercent: actualHpPercent,
          ...segmentEffects[segment.type](segment)
        });
      } else {
        stats.ignoreSpecials.push(segment.type);
      }
    });
    return hpSegments;
  }
  function segmentsParse(stats, monsterSegments = []) {
    const hpSegments = parsePlayerSegments(stats);
    hpSegments.push(...monsterSegments);
    return mergeHpSegments(hpSegments);
  }
  const atkSpMap = {
    1.001: 195,
    1.112: 219,
    1.251: 251,
    1.430: 292,
    1.700: 350,
    2.003: 437,
    2.504: 582,
    3.340: 872
  };
  function mergeHpSegments(hpSegments) {
    const breakpoints = new Set([0]);
    hpSegments.forEach(seg => {
      breakpoints.add(seg.hpPercent);
    });

    // 按血量从低到高排序断点
    const sortedBreakpoints = Array.from(breakpoints).sort((a, b) => a - b);

    // 为每个断点计算生效的属性
    const merged = {};
    sortedBreakpoints.forEach(bp => {
      merged[bp] = {
        hpPercent: bp,
        hpPercentType: 'above'
      };

      // 遍历所有分段，判断在当前血量断点下哪些分段生效
      hpSegments.forEach(seg => {
        let shouldInclude = false;
        if (seg.hpPercentType === 'below') {
          // below X 表示血量 < X 时生效，转换为 above 视角：
          // 只在血量断点 < X 时该分段才生效
          shouldInclude = bp < seg.hpPercent;
        } else {
          // above X 表示血量 >= X 时生效
          shouldInclude = bp >= seg.hpPercent;
        }
        if (shouldInclude) {
          // 合并属性，排除元数据字段
          Object.keys(seg).forEach(k => {
            if (k !== 'hpPercent' && k !== 'hpPercentType' && k !== 'segments' && k !== 'ignoreSpecials' && k !== 'type' && k !== 'extraHpPercent') {
              if (typeof seg[k] === 'number') {
                merged[bp][k] = (merged[bp][k] || 0) + seg[k];
              } else if (k === 'specialFunc') {
                merged[bp].specialFunc = (merged[bp].specialFunc || []).concat([seg[k]]);
              } else if (k === 'healPercent' || k === 'healTimes') {
                // 治疗效果只取一次，不累加
                if (merged[bp][k] === undefined) {
                  merged[bp][k] = seg[k];
                }
              } else if (merged[bp][k] === undefined) {
                merged[bp][k] = seg[k];
              }
            }
          });
        }
      });
    });
    return Object.values(merged).sort((a, b) => b.hpPercent - a.hpPercent);
  }
  function equipEquipment(equipmentId) {
    wsSend(`42${requestIdCounter}["equipAcion",{"id":"${equipmentId}","action":"wear"}]`);
  }
  function equipRune(runeId, slot) {
    wsSend(`42${requestIdCounter}["runeAction",{"id":"${runeId}","action":"wear","index":${slot}}]`);
  }
  function unequipRune(runeId) {
    wsSend(`42${requestIdCounter}["runeAction",{"id":"${runeId}","action":"remove"}]`);
  }
  function equipPet(petId) {
    wsSend(`42${requestIdCounter}["setPetFight",{"id":"${petId}"}]`);
  }
  const equipmentEnhanceTable = {
    atk: {
      1: 2,
      2: 3,
      3: 4,
      4: 6,
      5: 8,
      6: 10,
      7: 12,
      8: 14,
      9: 17,
      10: 21,
      11: 24,
      12: 27,
      13: 30,
      14: 33,
      15: 36,
      16: 36,
      17: 36,
      18: 36
    },
    heat: {
      1: 1,
      2: 2,
      3: 3,
      4: 4,
      5: 6,
      6: 7,
      7: 9,
      8: 11,
      9: 13,
      10: 16,
      11: 18,
      12: 20,
      13: 22,
      14: 24,
      15: 26,
      16: 26,
      17: 26,
      18: 26
    },
    rate: {
      1: .4,
      2: .8,
      3: 1.2,
      4: 1.8,
      5: 2.4,
      6: 3.2,
      7: 4,
      8: 4.5,
      9: 5,
      10: 6,
      11: 6.5,
      12: 7,
      13: 7.5,
      14: 8,
      15: 8.5,
      16: 8.5,
      17: 8.5,
      18: 8.5
    },
    crtd: {
      1: 1,
      2: 2,
      3: 3,
      4: 4,
      5: 5.5,
      6: 7,
      7: 8.5,
      8: 10,
      9: 12,
      10: 13.5,
      11: 15,
      12: 16.5,
      13: 18,
      14: 19.5,
      15: 21,
      16: 21,
      17: 21,
      18: 21
    }
  };

  const characterInfo = {};

  // Update character info
  registMessageHandler(/^434\[/, obj => {
    if (!obj[0].data.itemList) {
      return obj;
    }
    Object.assign(characterInfo, obj[0].data);
    characterInfo.isAdvance = characterInfo.advanceLevel == 4;
    logMessage(`Character Info Updated ${characterInfo.id}`);
    setTimeout(() => {
      const parsed = parseCharacterEquipment(characterInfo);
      characterInfo.parsed = parsed;
      logMessage(`Character Equipment Parsed:`);
      logMessage(parsed);
      updateCharacterInfoPanelDps();
    }, 1000);
    return obj;
  });
  function refreshCharacterInfo() {
    wsSend(`42${requestIdCounter}["init",{}]`);
  }
  function parseCharacterEquipment(character) {
    let weaponList = character.equippedList || {};
    let fightPet = (character.petList || []).find(pet => pet.id == character.fightPetId);
    let runeList = (character.runeEquippedList || []).filter(item => item !== "");
    let relicList = (character.relicEquippedList || []).filter(item => item !== "");
    if (character.itemList) {
      // 玩家
      Object.entries(weaponList).forEach(([key, value]) => {
        const item = character.itemList.find(item => item.id === value || item.id === value?.id);
        item.origin = equipmentsData[item.equipId];
        weaponList[key] = item;
      });
      runeList = runeList.map(rune => {
        rune = character.runeList.find(item => item.id === rune);
        rune.origin = runeData.runeCollection[rune.runeId];
        return rune;
      });
      relicList = relicList.map(relic => {
        relic = character.relicList.find(item => item.id === relic);
        relic.origin = relicData[relic.relicId];
        return relic;
      });
    } else {
      // 其他人
      weaponList = {};
      for (let weapon of character.equipList) {
        const origin = equipmentsData[weapon.equipId];
        weaponList[origin.type] = {
          origin: origin,
          ...weapon
        };
      }
      runeList = character.runeList.filter(item => item && item !== "").map(rune => {
        rune.origin = runeData.runeCollection[rune.runeId];
        return rune;
      });
      relicList = character.relicList.filter(item => item && item !== "").map(relic => {
        relic.origin = relicData[relic.relicId];
        return relic;
      });
    }
    const stats = {
      atk: 100,
      // 攻击
      atksp: 100,
      // 攻击速度
      crt: 0,
      // 暴击率
      crtd: 150,
      // 暴击伤害
      heat: 0,
      // 破防
      hr: 100,
      // 命中率
      voidDef: 0,
      // 抗魔
      ad: 0,
      // 全伤害加成

      waterDa: 0,
      fireDa: 0,
      windDa: 0,
      soilDa: 0,
      swiftness: 0,
      // 轻灵：攻速乘子
      swiftnessRune: 0,
      split: 1,
      // 分裂攻击次数期望
      splitRune: 0,
      chasing: 0,
      // 追击：攻击追加
      chasingRune: 0,
      heavyInjury: 0,
      // 重创：暴击追加
      heavyInjuryRune: 0,
      thump: 0,
      // 重击期望：概率额外伤害
      break: 0,
      // 破阵：攻击力追加
      sharp: 0,
      // 锋利：攻击时附加伤害
      tearInjury: 0,
      // 裂创：暴击时额外真实伤害
      shadowBlade: 0,
      // 影刃：攻击时附加真实伤害
      burst: 0,
      // 爆发：未暴击时额外期望

      cruel: 0,
      // 残暴：暴击破防
      cruelRune: 0,
      cruelRatio: 0,
      // 残暴：暴击破防乘子
      cruelRatioRune: 0,
      segments: [],
      // 按照血量分段的属性变化
      ignoreSpecials: []
    };
    const suits = [];
    // 装备基础属性
    Object.entries(weaponList).forEach(([weaponType, weapon]) => {
      for (let starType of weapon.starAttrs || []) {
        starAttrMap[starType](stats);
      }
      // 升级属性加成
      equipmentEnhanceMap[weaponType](stats, Math.min(weapon.reinforcedLevel, 15));
      // +15后全伤害加成
      stats.ad += Math.max(weapon.reinforcedLevel - 15, 0) * 0.2;
      // 基础装备属性
      Object.entries(weapon.origin.attrs.basic).forEach(([attr, val]) => {
        stats[attr] += val;
      });
      // 判断套装
      if (weapon.origin.attrs.suit) {
        const suitName = weapon.origin.attrs.suit.name;
        const suitEquipIds = weapon.origin.attrs.suit.equipIdList;
        const equippedIds = Object.values(weaponList).map(w => w.equipId);
        const hasSuit = suitEquipIds.every(id => equippedIds.includes(id));
        if (hasSuit && !suits.find(s => s.name === suitName)) {
          suits.push({
            name: suitName,
            ...weapon.origin.attrs.suit.attrs
          });
        }
      }
      // 附魔属性
      if (weapon.enchantAttr) {
        stats.voidDef += weapon.enchantAttr[0] * 10;
        stats.ad += weapon.enchantAttr[1];
      }
      // 暗金属性
      for (let effect of weapon?.darkGoldAttrs?.basic || []) {
        stats[effect[0]] += (effect[1] + 5) * darkGoldData.darkGoldBasicFactor[effect[0]];
      }
      // 精造属性
      stats.ad += 0.4 * (weapon.refineAttr?.[0] || 0);
    });

    // 符石
    for (let rune of runeList) {
      // 符石基础属性
      const typeFactor = character.soulType == rune.origin.soulType ? 1.2 : 1.0;
      Object.entries(rune.attrs.basic).forEach(([attr, val]) => {
        // 系数
        const p = runeData.runeBasicFactor[attr] || 1.0;
        stats[attr] += val * p * typeFactor;
      });
      // 符石特殊属性
      for (let effect of rune.attrs?.special || []) {
        runeSpecialParse(stats, effect, typeFactor);
      }
    }

    // 圣物
    for (let relic of relicList) {
      // 圣物基础属性
      Object.entries(relic.origin.attrs.basic).forEach(([attr, val]) => {
        stats[attr] += val + (relic.origin.grow?.basic[attr] || 0) * relic.count;
      });
    }

    // 宠物基础属性
    Object.entries(fightPet?.fightAttrs || {}).forEach(([attr, val]) => {
      // 系数
      // const p = runeData.runeBasicFactor[attr] || 1.0;
      const p = 1.0;
      stats[attr] += val * p;
    });

    // 武器特效
    Object.entries(weaponList).forEach(([weaponType, weapon]) => {
      // 普通特效
      for (let effect of weapon.origin?.attrs?.special || []) {
        weaponSpecialParse(stats, effect);
      }
      // 暗金特效 TODO: bugfix
      for (let effect of weapon.darkGoldAttrs?.special || []) {
        weaponSpecialParse(stats, effect, "darkGold");
      }
      // 刻印特效
      for (let effect of weapon.engrave?.special || []) {
        weaponSpecialParse(stats, effect, "darkGold");
      }
    });

    // 套装效果
    for (let suit of suits) {
      Object.entries(suit.basic || {}).forEach(([key, value]) => {
        stats[key] += value;
      });
      for (let effect of suit.affix || []) {
        weaponSpecialParse(stats, effect);
      }
    }

    // 临时buff
    for (let buff of characterInfo.temporaryBuff || []) {
      Object.entries(buff.basic || {}).forEach(([attr, val]) => {
        stats[attr] += val;
      });
    }

    // 最终攻击力计算
    stats.finalAtk = stats.atk * (1 + stats.break / 100);
    // 最终攻速计算
    stats.finalAtksp = (stats.atksp / 100 - 1) * (1 + stats.swiftness) + 1;

    // 模拟怪物防御
    const monsterDefense = characterInfo.isAdvance ? 100 : 150;
    stats.dpsRaw = getDps(stats, monsterDefense);
    const segments = segmentsParse(stats);
    segments.forEach(seg => {
      seg.dps = getDps(seg, monsterDefense);
    });
    return {
      weaponList,
      fightPet,
      runeList,
      relicList,
      stats,
      segments
    };
  }
  function getActualAtkSp(stats) {
    if (characterInfo.isAdvance) {
      stats.actualAtksp = stats.finalAtksp;
    } else {
      Object.entries(atkSpMap).forEach(([atkSp, actAtkSp]) => {
        if (stats.finalAtksp >= parseFloat(atkSp)) {
          stats.actualAtksp = actAtkSp / 180;
        }
      });
    }
  }
  function getDps(stats, defense = 0, evasion = 0, antiCrit = 0) {
    // 最终攻速计算
    getActualAtkSp(stats);

    // 暴击率
    let crt = Math.max(Math.min(stats.crt - antiCrit, 100) / 100, 0);
    crt = crt + (1 - crt) * (stats.burst / 100);

    // 防御计算系数
    const defenseFactor =
    // 非暴击
    150 / (150 + Math.max(defense - stats.heat, 0)) * (1 - crt) +
    // 暴击
    150 / (150 + Math.max(defense * Math.max(1 - stats.cruelRatio / 100, 0) - stats.heat - stats.cruel, 0)) * crt;
    const hr = Math.max(Math.min((stats.hr - evasion) / 100, 1), 0);
    return stats.actualAtksp * hr * (
    // 需要整合防御计算部分
    defenseFactor * (stats.atk * (1 - crt) + stats.crtd / 100 * stats.atk * crt + stats.split * stats.chasing + stats.split * stats.heavyInjury * crt + stats.split * stats.thump + stats.split * stats.tearInjury) * ((1 + stats.sharp / 100) * (
    // 锋利
    1 + (stats.harvestRatio || 0) / 100) * (
    // 收割
    1 + (stats.impactRatio || 0) / 100) * (
    // 冲击
    1 + (stats.assault || 0) / 100) // 冲锋
    ) + defenseFactor * ((stats.harvest || 0) + (
    // 收割固定伤害
    stats.impact || 0) // 冲击固定伤害
    ) +
    // 真实伤害部分

    stats.split * stats.shadowBlade) * (1 + stats.ad / 100)
    // 怪物麻痹免疫
    * (1 - (stats.paralysis || 0) * (1 - crt) / 100)
    // 未命中吸血效果
    - (stats.monsterLeech || 0) * stats.actualAtksp * (1 - hr);
  }
  function updateCharacterInfoPanelDps() {
    const attrPanel = document.querySelector(".user-attrs");
    let dpsEle = document.getElementById("wst-dps");
    if (!dpsEle) {
      dpsEle = document.createElement("div");
      dpsEle.id = "wst-dps";
      dpsEle.style.fontSize = "14px";
      attrPanel.insertBefore(dpsEle, attrPanel.firstElementChild?.nextElementSibling || attrPanel.firstElementChild);
    }
    const segDps = characterInfo.parsed.segments.map(seg => `>${seg.hpPercent} ${seg.dps.toFixed(0)}`).join("\n");
    dpsEle.innerText = `裸DPS估算: ${characterInfo.parsed.stats.dpsRaw.toFixed(0)}`;
    dpsEle.title = `基于当前装备计算的理论DPS\n模拟怪物防御为100/150(进阶前后)\n不考虑怪物特殊属性和技能加成\n进阶前后攻速有差别\n\n分段DPS:\n` + segDps;
  }
  registSendHookHandler(/\["useEquipRoutine",/, message => {
    const obj = parseWSmessage(message);
    const routineId = obj[1].id;
    const routine = characterInfo.equippedRoutineList.find(r => r.id === routineId);
    if (!routine) {
      logMessage(`Cannot find routine ${routineId} in characterInfo`);
      return;
    }
    characterInfo.equippedList = routine.equippedList;
    characterInfo.runeEquippedList = routine?.runeEquippedList || [];
    characterInfo.relicEquippedList = routine?.relicEquippedList || [];
    characterInfo.parsed = parseCharacterEquipment(characterInfo);
    updateCharacterInfoPanelDps();
    logMessage(characterInfo.parsed);
    return;
  });
  registSendHookHandler(/\["equipAcion",/, message => {
    const obj = parseWSmessage(message);
    const weaponId = obj[1].id;
    const action = obj[1].action;
    const nowRoutine = characterInfo.equippedRoutineList.find(r => r.id === characterInfo.equippedRoutineId);
    if (action == "wear") {
      const weapon = characterInfo.itemList.find(item => item.id === weaponId);
      const weaponType = equipmentsData[weapon.equipId].type;
      characterInfo.equippedList[weaponType] = weaponId;
      if (nowRoutine) {
        nowRoutine.equippedList[weaponType] = weaponId;
      }
    }
    characterInfo.parsed = parseCharacterEquipment(characterInfo);
    updateCharacterInfoPanelDps();
    return;
  });
  registSendHookHandler(/\["runeAction",/, message => {
    const obj = parseWSmessage(message);
    const runeId = obj[1].id;
    const action = obj[1].action;
    const index = obj[1].index;
    const nowRoutine = characterInfo.equippedRoutineList.find(r => r.id === characterInfo.equippedRoutineId);
    if (action == "wear") {
      while (index >= characterInfo.runeEquippedList.length) {
        characterInfo.runeEquippedList.push('');
      }
      characterInfo.runeEquippedList[index] = runeId;
      if (nowRoutine) {
        while (index >= nowRoutine.runeEquippedList.length) {
          nowRoutine.runeEquippedList.push('');
        }
        nowRoutine.runeEquippedList[index] = runeId;
      }
    }
    characterInfo.parsed = parseCharacterEquipment(characterInfo);
    updateCharacterInfoPanelDps();
    return;
  });

  // 判断战斗时间内是否能打过
  let maxTime = 0;
  const hpHistory = []; // 记录过去的血量百分比，用于计算变化率

  setInterval(() => {
    const dungeonPage = document.querySelector('.dungeon-page');
    let fightPage = dungeonPage.querySelector('.person-fight');
    if (!dungeonPage) {
      return;
    }
    if (fightPage.style.display === 'none') {
      fightPage = dungeonPage.querySelector('.team-fight');
    }
    if (fightPage.style.display !== 'none') {
      const timerEls = fightPage?.querySelectorAll('.fight-over-timer');
      const timerEl = timerEls[timerEls.length - 1];
      const timeLeft = parseFightTime(timerEl.innerText);
      if (maxTime === 0 && timeLeft > 185) {
        maxTime = 300;
      } else if (maxTime === 0 && timeLeft > 30) {
        maxTime = 180;
      } else if (maxTime === 0 && timeLeft > 10) {
        maxTime = 30;
      }
      const timeLeftPercent = timeLeft / maxTime;
      const hpEl = fightPage.querySelector('.el-progress-bar__innerText');
      const hpLeftPercent = parseFloat(hpEl.innerText.replace(' %', '')) / 100;

      // 记录血量历史，保留最近10个采样
      hpHistory.push({
        hp: hpLeftPercent,
        time: timeLeft,
        timestamp: Date.now()
      });
      if (hpHistory.length > 10) {
        hpHistory.shift();
      }

      // 计算delta（平均变化率：血量变化 / 时间变化）
      let delta = 0;
      let predictedFinalHp = hpLeftPercent;
      if (hpHistory.length >= 2) {
        const oldestSample = hpHistory[0];
        const newestSample = hpHistory[hpHistory.length - 1];
        const hpChange = newestSample.hp - oldestSample.hp; // 注意：血量是减少的，所以这个值应该是负数
        const timeChange = oldestSample.time - newestSample.time; // 时间是减少的，所以用旧-新

        if (timeChange > 0) {
          delta = hpChange / timeChange; // 每秒血量变化率（负数表示减少）
          // 基于当前血量和变化率预测最终血量
          predictedFinalHp = hpLeftPercent + delta * timeLeft;
          // 限制预测值在合理范围内
          // predictedFinalHp = Math.max(0, Math.min(1, predictedFinalHp));
        }
      }
      let diffEl = timerEl.parentElement.querySelector('.time-diff-indicator');
      if (!diffEl) {
        diffEl = document.createElement('div');
        diffEl.className = 'time-diff-indicator';
        diffEl.style.fontSize = '12px';
        diffEl.style.textAlign = 'center';
        timerEl.parentElement.appendChild(diffEl);
      }

      // 根据预测最终血量调整颜色
      if (predictedFinalHp > 0.05) {
        diffEl.style.backgroundColor = 'red';
      } else if (predictedFinalHp > 0.02) {
        diffEl.style.backgroundColor = 'orange';
      } else if (predictedFinalHp > -0.02) {
        diffEl.style.backgroundColor = 'yellow';
      } else {
        diffEl.style.backgroundColor = 'green';
      }
      const diff = timeLeftPercent - hpLeftPercent;
      diffEl.innerText = `(${(diff * 100).toFixed(2)}%)`;
      if (hpHistory.length >= 2) {
        diffEl.innerHTML += `<br>Δ: ${(delta * 100).toFixed(3)}%/s<br>预测最终: ${(predictedFinalHp * 100).toFixed(2)}%`;
      }
    } else {
      maxTime = 0;
      hpHistory.length = 0; // 清空历史记录
    }
  }, 1000);
  function parseFightTime(timeStr) {
    const [minutes, seconds] = timeStr.split(' : ').map(num => parseInt(num, 10));
    return minutes * 60 + seconds;
  }

  // Actual attack speed calculation
  const atkList = [];
  let isAdvanceFight = false;
  registMessageHandler(/^42\["fightRes/, obj => {
    const atkInfoList = obj[1].atkInfoList;
    atkList.push({
      atk: atkInfoList,
      timestamp: Date.now()
    });
    if (atkList.length > 500) {
      atkList.shift();
    }
    isAdvanceFight = false;
  });
  registMessageHandler(/^42\["advanceFightRes/, obj => {
    const atkInfoList = obj[1].atkInfoList;
    atkList.push({
      atk: atkInfoList,
      timestamp: Date.now()
    });
    if (atkList.length > 500) {
      atkList.shift();
    }
    isAdvanceFight = true;
  });
  setInterval(() => {
    const fightPage = document.querySelector('.fight-page');
    if (!fightPage || fightPage.style.display === 'none' || atkList.length < 1) {
      return;
    }
    const totalAtk = atkList.reduce((sum, atkInfo) => sum + atkInfo.atk.length, 0);
    const avgBasicAtkSpd = atkList.length / ((atkList[atkList.length - 1].timestamp - atkList[0].timestamp) / 1000);
    const avgAtkSpd = totalAtk / ((atkList[atkList.length - 1].timestamp - atkList[0].timestamp) / 1000);
    const fightUserList = document.querySelectorAll('.fight-user-list')[isAdvanceFight ? 1 : 0];
    const hitAccuracy = atkList.reduce((sum, atkInfo) => {
      const unhitCount = atkInfo.atk.filter(atk => atk.unHit).length;
      return sum + (atkInfo.atk.length > 0 ? atkInfo.atk.length - unhitCount : 0);
    }, 0) / totalAtk;
    const criticalRate = atkList.reduce((sum, atkInfo) => {
      const criticalNum = atkInfo.atk.filter(atk => atk.trigger.includes('暴击')).length;
      return sum + (atkInfo.atk.length > 0 ? criticalNum : 0);
    }, 0) / totalAtk;
    let atkEl = document.querySelector('.actual-atk-speed');
    if (!atkEl) {
      atkEl = document.createElement('div');
      atkEl.className = 'actual-atk-speed';
      fightUserList.appendChild(atkEl);
    }
    atkEl.style.fontSize = '8px';
    atkEl.innerText = `实际攻速: ${avgAtkSpd.toFixed(3)}(${avgBasicAtkSpd.toFixed(3)}) 次/秒`;
    atkEl.appendChild(document.createElement('br'));
    atkEl.innerText += `命中率: ${(hitAccuracy * 100).toFixed(2)}% 暴击率: ${(criticalRate * 100).toFixed(2)}%`;
  }, 1000);
  let autoChallengeEnabled = false;
  setInterval(() => {
    const dungeon = document.querySelector('.dungeon');
    if (dungeon) {
      const titleDiv = dungeon.querySelector('.title');
      if (titleDiv && !dungeon.querySelector('.wstools-autochallenge-checkbox')) {
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.className = 'wstools-autochallenge-checkbox';
        checkbox.style.marginLeft = '8px';
        titleDiv.insertAdjacentElement('afterend', checkbox);
        checkbox.addEventListener('change', event => {
          autoChallengeEnabled = event.target.checked;
        });
        const label = document.createElement('span');
        label.innerText = '自动挑战';
        titleDiv.insertAdjacentElement('afterend', label);
      }
    }
  }, 1000);
  const autoChallengeData = {
    type: '',
    level: 0
  };
  registSendHookHandler(/\["dailyChallenge",/, message => {
    const obj = parseWSmessage(message);
    autoChallengeData.type = obj[1].type;
    autoChallengeData.level = obj[1].level;
  });
  registSendHookHandler(/\["cancelPersonFight",/, message => {
    autoChallengeData.type = '';
    autoChallengeData.level = 0;
  });
  function startDailyChallenge(type, level) {
    // type: equip, gold, diamond
    wsSend(`42${requestIdCounter}["dailyChallenge",{"type":"${type}","level":${level}}]`);
  }
  registMessageHandler(/^42\["personFightFail/, obj => {
    if (autoChallengeEnabled && autoChallengeData.type && autoChallengeData.level) {
      setTimeout(() => {
        startDailyChallenge(autoChallengeData.type, autoChallengeData.level);
      }, 2000);
    }
  });
  registMessageHandler(/^42\["personFightCore/, obj => {
    if (obj[1]?.monsterCurHp <= 0) {
      if (autoChallengeEnabled && autoChallengeData.type && autoChallengeData.level) {
        autoChallengeData.level += 1;
        setTimeout(() => {
          startDailyChallenge(autoChallengeData.type, autoChallengeData.level);
        }, 2000);
      }
    }
  });

  registSendHookHandler(/\["fishingCompetitionThrowRod",/, message => {
    const startNumber = parseInt(message.match(/^\d+/)?.[0]);
    const returnButton = Array.from(document.querySelector('.fishing-competition').querySelectorAll('button')).find(btn => btn.innerText === '返回');
    return {
      responseRegex: new RegExp(`^${startNumber + 100}`),
      handler: (obj, other) => {
        const fishData = obj[0].data;
        const position = fishData.position;
        logMessage(`Fishing Competition: Fish appeared at position ${position} est size ${fishData.size}, reeling in...`);
        setTimeout(() => {
          wsSend(`${startNumber + 1}["fishingCompetitionReelIn",{"position":${position}}]`);
          if (returnButton) {
            returnButton.click();
          }
        }, 1000);
      }
    };
  });

  let autoStartFight = false;
  setInterval(() => {
    const roomDiv = document.querySelector('.in-room');
    if (roomDiv) {
      if (!roomDiv.querySelector('#autoStartFightCheckbox')) {
        const label = document.createElement('label');
        label.style.marginLeft = '10px';
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.id = 'autoStartFightCheckbox';
        checkbox.checked = autoStartFight;
        checkbox.addEventListener('change', e => {
          autoStartFight = e.target.checked;
        });
        label.appendChild(checkbox);
        label.appendChild(document.createTextNode(' 自动开始战斗'));
        roomDiv.appendChild(label);
      }
    }
  }, 1000);

  // Get party rooms
  registSendHookHandler(/\["getTeamFightRoom",/, message => {
    const obj = parseWSmessage(message);
    obj[0].data;
  });

  // Join party room
  registSendHookHandler(/\["joinRoom",/, message => {
    const obj = parseWSmessage(message);
    obj[0].data.monster;
  });

  // Cancel party fight
  registSendHookHandler(/\["cancelTeamFight",/, message => {});
  registMessageHandler(/\["nestPlayerJoin",/, obj => {
    // const playerId = obj[1].id;
    if (autoStartFight) {
      let roomType = document.querySelector('.in-room')?.querySelector('.affix')?.querySelector('span')?.class || 'relic';
      if (roomType === 'relic') {
        roomType = 'relicRuin';
      }
      setInterval(() => {
        startFight(roomType);
      }, 1000);
    }
  });
  function startFight(type) {
    // type: crack, relicRuin
    type = type.charAt(0).toUpperCase() + type.slice(1);
    wsSend(`42${requestIdCounter}["start${type}Fight", {}]`);
  }

  let monsterCardShow = false;
  setInterval(() => {
    let monsterCard = null;
    document.querySelectorAll('.monster-detail').forEach(el => {
      if (el.style.display !== 'none' && el.parentElement.style.display !== 'none') {
        monsterCard = el;
      }
    });
    if (monsterCard) {
      if (!monsterCardShow) {
        monsterCardShow = true;
        parseMonsterInfo(monsterCard);
      }
    } else {
      monsterCardShow = false;
    }
  }, 1000);
  function parseMonsterInfo(monsterCard) {
    const monsterName = monsterCard.querySelector('h3').innerText;
    const getP = label => {
      return Array.from(monsterCard.querySelectorAll('p')).find(p => p.innerText.startsWith(label)).innerText.replace(label, '').trim();
    };
    const monsterInfo = {
      name: monsterName,
      hpMax: parseFloat(getP('血量：')),
      defense: parseFloat(getP('防御：')),
      evasion: parseFloat(getP('闪避率：').replace('%', '')),
      antiCrit: parseFloat(getP('抗爆率：').replace('%', ''))
    };
    const specials = monsterCard.querySelectorAll('.special');
    const specialList = [];
    const ignoreSpecials = [];
    for (let special of specials) {
      const title = special.innerText;
      const abilityInfo = Array.from(special.parentElement.querySelectorAll('span')).map(span => {
        const text = span.innerText.trim();
        if (text.endsWith('%')) {
          return parseFloat(text.replace('%', ''));
        } else if (!isNaN(parseFloat(text)) && isFinite(text)) {
          return parseFloat(text);
        } else {
          return text;
        }
      });
      if (monsterEffects[title]) {
        specialList.push({
          title,
          abilityInfo
        });
      } else {
        ignoreSpecials.push(title);
      }
    }
    const fightRes = calculateMonsterTime(monsterInfo, specialList);
    let timeElem = monsterCard.querySelector('.monster-time-to-kill');
    if (!timeElem) {
      timeElem = document.createElement('div');
      timeElem.className = 'monster-time-to-kill';
      timeElem.style.marginTop = '8px';
      timeElem.style.fontWeight = 'bold';
    }
    timeElem.innerHTML = `击杀所需时间: ${fightRes.useTime < 0 ? '∞' : fightRes.useTime.toFixed(2)} 秒`;
    if (fightRes.useTimeSeg.length > 1) {
      timeElem.innerHTML += fightRes.useTimeSeg.map(seg => {
        const hpRange = `${seg.prevHpPercent.toFixed(1)}%→${seg.currentHpPercent.toFixed(1)}%`;
        const time = `${seg.segUseTime < 0 ? '∞' : seg.segUseTime.toFixed(2)}秒`;
        return `<br><span style="display: inline-block;">${hpRange}</span><span style="float: right;">${time}</span>`;
      }).join('');
    }
    if (ignoreSpecials.length > 0) {
      timeElem.innerHTML += `<br>(不考虑 ${ignoreSpecials.join('、')} 特效下)`;
    }
    if (characterInfo.parsed.stats.ignoreSpecials.length > 0) {
      timeElem.innerHTML += `<br>（不考虑角色装备中的 ${characterInfo.parsed.stats.ignoreSpecials.join('、')} 特效下）`;
    }
    monsterCard.appendChild(timeElem);
  }
  function calculateMonsterTime(monsterInfo, specials) {
    let useTime = 0;
    const stats = JSON.parse(JSON.stringify(characterInfo.parsed.stats));
    const monsterHpSegments = [];
    const useTimeSeg = [];
    specials.forEach(special => {
      monsterEffects[special.title](stats, monsterHpSegments, monsterInfo, special.abilityInfo);
    });
    const segments = segmentsParse(stats, monsterHpSegments);

    // 收集所有治疗效果并追踪触发次数
    const healEffects = [];
    segments.forEach(seg => {
      if (seg.healPercent && seg.healTimes) {
        healEffects.push({
          hpPercent: seg.hpPercent,
          healPercent: seg.healPercent,
          remainingTimes: seg.healTimes
        });
      }
    });
    for (let i = 0; i < segments.length; i++) {
      const seg = segments[i];

      // 计算当前分段的HP百分比范围
      const currentHpPercent = seg.hpPercent || 0;
      const prevHpPercent = i > 0 ? segments[i - 1].hpPercent || 100 : 100;
      const hpPercentDiff = prevHpPercent - currentHpPercent;

      // 计算实际分段HP
      let segmentHp = monsterInfo.hpMax * (hpPercentDiff / 100);

      // 计算部分特殊效果
      seg.specialFunc?.forEach(f => f(seg));
      const dps = getDps(seg, monsterInfo.defense + (seg.monsterDefense || 0), monsterInfo.evasion + (seg.monsterEvasion || 0), monsterInfo.antiCrit + (seg.monsterAntiCrit || 0));
      if (dps <= 0) {
        return {
          useTime: -1,
          useTimeSeg: [...useTimeSeg, {
            currentHpPercent,
            prevHpPercent,
            segUseTime: -1
          }]
        };
      }

      // 检查是否在这个分段触发治疗
      const triggeredHeal = healEffects.find(heal => heal.hpPercent === currentHpPercent && heal.remainingTimes > 0);
      if (triggeredHeal) {
        // 触发治疗，增加额外的血量
        const healAmount = monsterInfo.hpMax * (triggeredHeal.healPercent / 100);
        segmentHp += healAmount;
        triggeredHeal.remainingTimes--;
      }
      const segUseTime = segmentHp / dps;
      useTime += segUseTime;
      useTimeSeg.push({
        currentHpPercent,
        prevHpPercent,
        segUseTime,
        healed: !!triggeredHeal
      });
    }
    logMessage(segments);
    return {
      useTime,
      useTimeSeg
    };
  }

  const localEquipmentSet = loadFromLocalStorage("equipmentsSetLocal", {});
  function saveEquipmentSet(name) {
    const equipmentSet = {
      name,
      equippedList: characterInfo.equippedList,
      runeEquippedList: characterInfo?.runeEquippedList,
      relicEquippedList: characterInfo?.relicEquippedList,
      fightPetId: characterInfo?.fightPetId
    };
    localEquipmentSet[name] = equipmentSet;
    saveToLocalStorage("equipmentsSetLocal", localEquipmentSet);
  }
  function applyFromEquipmentSet(name) {
    const equipmentSet = localEquipmentSet[name];
    if (!equipmentSet) {
      logMessage(`Equipment set ${name} not found`);
      return;
    }
    Object.values(equipmentSet.equippedList).forEach(equipment => {
      equipEquipment(equipment.id);
    });
    characterInfo.runeEquippedList?.forEach((runeId, index) => {
      if (runeId) {
        unequipRune(runeId);
      }
    });
    equipmentSet.runeEquippedList?.forEach((runeId, index) => {
      if (runeId) {
        equipRune(runeId, index);
      }
    });
    equipPet(equipmentSet.fightPetId);
    setTimeout(() => {
      refreshCharacterInfo();
    }, 500);
  }
  function addLocalEquipmentSetPanel() {
    const equipList = document.querySelector('.equip-list');
    const elSelect = equipList.querySelector('.el-select');
    const equipmentSetPanel = document.createElement('div');
    equipmentSetPanel.className = 'equipment-set-panel';

    // 创建控制区域
    const controlArea = document.createElement('div');
    controlArea.style.cssText = `
    display: flex;
    align-items: center;
    padding: 3px;
    gap: 3px;
  `;

    // 创建套装选择器
    const setSelector = document.createElement('select');
    setSelector.className = 'equipment-set-selector';
    setSelector.style.cssText = `
    flex: 1;
    font-size: 10px;
    border: 1px solid #ccc;
    border-radius: 4px;
  `;

    // 更新选择器选项
    function updateSelectorOptions() {
      setSelector.innerHTML = '<option value="">选择套装...</option>';
      Object.keys(localEquipmentSet).forEach(setName => {
        const option = document.createElement('option');
        option.value = setName;
        option.textContent = setName;
        setSelector.appendChild(option);
      });
    }

    // 创建添加按钮
    const addButton = document.createElement('button');
    addButton.textContent = '+';
    addButton.title = '保存当前装备为新套装';
    addButton.style.cssText = `
    border: 1px solid #4CAF50;
    border-radius: 4px;
    background-color: #4CAF50;
    color: white;
    font-size: 10px;
    font-weight: bold;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
  `;
    addButton.addEventListener('click', () => {
      const setName = prompt('请输入套装名称:');
      if (setName && setName.trim()) {
        saveEquipmentSet(setName.trim());
        updateSelectorOptions();
        setSelector.value = setName.trim();
        logMessage(`套装 "${setName.trim()}" 已保存`);
      }
    });

    // 创建删除按钮
    const deleteButton = document.createElement('button');
    deleteButton.textContent = '-';
    deleteButton.title = '删除选中的套装';
    deleteButton.style.cssText = `
    border: 1px solid #f44336;
    border-radius: 4px;
    background-color: #f44336;
    color: white;
    font-size: 10px;
    font-weight: bold;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
  `;
    deleteButton.addEventListener('click', () => {
      const selectedSet = setSelector.value;
      if (!selectedSet) {
        alert('请先选择要删除的套装');
        return;
      }
      if (confirm(`确定要删除套装 "${selectedSet}" 吗？`)) {
        delete localEquipmentSet[selectedSet];
        saveToLocalStorage("equipmentsSetLocal", localEquipmentSet);
        updateSelectorOptions();
        logMessage(`套装 "${selectedSet}" 已删除`);
      }
    });

    // 创建应用按钮
    const applyButton = document.createElement('button');
    applyButton.textContent = '应用';
    applyButton.title = '应用选中的套装';
    applyButton.style.cssText = `
    font-size: 10px;
    border: 1px solid #2196F3;
    border-radius: 4px;
    background-color: #2196F3;
    color: white;
    cursor: pointer;
  `;
    applyButton.addEventListener('click', () => {
      const selectedSet = setSelector.value;
      if (!selectedSet) {
        alert('请先选择要应用的套装');
        return;
      }
      applyFromEquipmentSet(selectedSet);
      logMessage(`套装 "${selectedSet}" 已应用`);
    });

    // 套装选择变化事件
    setSelector.addEventListener('change', () => {
      setSelector.value;
    });

    // 组装控制区域
    controlArea.appendChild(setSelector);
    controlArea.appendChild(addButton);
    controlArea.appendChild(deleteButton);
    controlArea.appendChild(applyButton);

    // 组装面板
    equipmentSetPanel.appendChild(controlArea);

    // 初始化选择器选项
    updateSelectorOptions();
    elSelect.insertAdjacentElement('afterend', equipmentSetPanel);
  }

  // 初始化装备套装面板
  function initEquipmentSetPanel() {
    // 等待页面元素加载完成
    const checkAndInit = () => {
      const equipList = document.querySelector('.equip-list');
      if (equipList) {
        addLocalEquipmentSetPanel();
      } else {
        setTimeout(checkAndInit, 1000);
      }
    };
    setTimeout(checkAndInit, 2000);
  }

  hookWS();
  hookHTTP();
  initEquipmentSetPanel();
  // injectDebugTool();

  logMessage("WarSoul-Tools loaded.");

})();
