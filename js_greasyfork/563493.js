// ==UserScript==
// @name         Arcacon Picker Plus
// @namespace    npm/vite-plugin-monkey
// @version      0.8.1
// @description  아카콘 기능 확장
// @license      MIT
// @icon         https://raw.githubusercontent.com/Iced0368/AracaconPickerPlus/refs/heads/main/ap-plus-icon.svg
// @match        https://arca.live/*
// @grant        GM_addStyle
// @grant        unsafeWindow
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/563493/Arcacon%20Picker%20Plus.user.js
// @updateURL https://update.greasyfork.org/scripts/563493/Arcacon%20Picker%20Plus.meta.js
// ==/UserScript==

(function () {
  'use strict';

  const d=new Set;const importCSS = async e=>{d.has(e)||(d.add(e),(t=>{typeof GM_addStyle=="function"?GM_addStyle(t):(document.head||document.documentElement).appendChild(document.createElement("style")).append(t);})(e));};

  var commonjsGlobal = typeof globalThis !== "undefined" ? globalThis : typeof window !== "undefined" ? window : typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : {};
  function getDefaultExportFromCjs(x) {
    return x && x.__esModule && Object.prototype.hasOwnProperty.call(x, "default") ? x["default"] : x;
  }
  var jsxRuntime = { exports: {} };
  var reactJsxRuntime_production = {};
  var hasRequiredReactJsxRuntime_production;
  function requireReactJsxRuntime_production() {
    if (hasRequiredReactJsxRuntime_production) return reactJsxRuntime_production;
    hasRequiredReactJsxRuntime_production = 1;
    var REACT_ELEMENT_TYPE = Symbol.for("react.transitional.element"), REACT_FRAGMENT_TYPE = Symbol.for("react.fragment");
    function jsxProd(type, config, maybeKey) {
      var key = null;
      void 0 !== maybeKey && (key = "" + maybeKey);
      void 0 !== config.key && (key = "" + config.key);
      if ("key" in config) {
        maybeKey = {};
        for (var propName in config)
          "key" !== propName && (maybeKey[propName] = config[propName]);
      } else maybeKey = config;
      config = maybeKey.ref;
      return {
        $$typeof: REACT_ELEMENT_TYPE,
        type,
        key,
        ref: void 0 !== config ? config : null,
        props: maybeKey
      };
    }
    reactJsxRuntime_production.Fragment = REACT_FRAGMENT_TYPE;
    reactJsxRuntime_production.jsx = jsxProd;
    reactJsxRuntime_production.jsxs = jsxProd;
    return reactJsxRuntime_production;
  }
  var hasRequiredJsxRuntime;
  function requireJsxRuntime() {
    if (hasRequiredJsxRuntime) return jsxRuntime.exports;
    hasRequiredJsxRuntime = 1;
    {
      jsxRuntime.exports = requireReactJsxRuntime_production();
    }
    return jsxRuntime.exports;
  }
  var jsxRuntimeExports = requireJsxRuntime();
  var react = { exports: {} };
  var react_production = {};
  var hasRequiredReact_production;
  function requireReact_production() {
    if (hasRequiredReact_production) return react_production;
    hasRequiredReact_production = 1;
    var REACT_ELEMENT_TYPE = Symbol.for("react.transitional.element"), REACT_PORTAL_TYPE = Symbol.for("react.portal"), REACT_FRAGMENT_TYPE = Symbol.for("react.fragment"), REACT_STRICT_MODE_TYPE = Symbol.for("react.strict_mode"), REACT_PROFILER_TYPE = Symbol.for("react.profiler"), REACT_CONSUMER_TYPE = Symbol.for("react.consumer"), REACT_CONTEXT_TYPE = Symbol.for("react.context"), REACT_FORWARD_REF_TYPE = Symbol.for("react.forward_ref"), REACT_SUSPENSE_TYPE = Symbol.for("react.suspense"), REACT_MEMO_TYPE = Symbol.for("react.memo"), REACT_LAZY_TYPE = Symbol.for("react.lazy"), REACT_ACTIVITY_TYPE = Symbol.for("react.activity"), MAYBE_ITERATOR_SYMBOL = Symbol.iterator;
    function getIteratorFn(maybeIterable) {
      if (null === maybeIterable || "object" !== typeof maybeIterable) return null;
      maybeIterable = MAYBE_ITERATOR_SYMBOL && maybeIterable[MAYBE_ITERATOR_SYMBOL] || maybeIterable["@@iterator"];
      return "function" === typeof maybeIterable ? maybeIterable : null;
    }
    var ReactNoopUpdateQueue = {
      isMounted: function() {
        return false;
      },
      enqueueForceUpdate: function() {
      },
      enqueueReplaceState: function() {
      },
      enqueueSetState: function() {
      }
    }, assign = Object.assign, emptyObject = {};
    function Component(props, context, updater) {
      this.props = props;
      this.context = context;
      this.refs = emptyObject;
      this.updater = updater || ReactNoopUpdateQueue;
    }
    Component.prototype.isReactComponent = {};
    Component.prototype.setState = function(partialState, callback) {
      if ("object" !== typeof partialState && "function" !== typeof partialState && null != partialState)
        throw Error(
          "takes an object of state variables to update or a function which returns an object of state variables."
        );
      this.updater.enqueueSetState(this, partialState, callback, "setState");
    };
    Component.prototype.forceUpdate = function(callback) {
      this.updater.enqueueForceUpdate(this, callback, "forceUpdate");
    };
    function ComponentDummy() {
    }
    ComponentDummy.prototype = Component.prototype;
    function PureComponent(props, context, updater) {
      this.props = props;
      this.context = context;
      this.refs = emptyObject;
      this.updater = updater || ReactNoopUpdateQueue;
    }
    var pureComponentPrototype = PureComponent.prototype = new ComponentDummy();
    pureComponentPrototype.constructor = PureComponent;
    assign(pureComponentPrototype, Component.prototype);
    pureComponentPrototype.isPureReactComponent = true;
    var isArrayImpl = Array.isArray;
    function noop() {
    }
    var ReactSharedInternals = { H: null, A: null, T: null, S: null }, hasOwnProperty = Object.prototype.hasOwnProperty;
    function ReactElement(type, key, props) {
      var refProp = props.ref;
      return {
        $$typeof: REACT_ELEMENT_TYPE,
        type,
        key,
        ref: void 0 !== refProp ? refProp : null,
        props
      };
    }
    function cloneAndReplaceKey(oldElement, newKey) {
      return ReactElement(oldElement.type, newKey, oldElement.props);
    }
    function isValidElement(object) {
      return "object" === typeof object && null !== object && object.$$typeof === REACT_ELEMENT_TYPE;
    }
    function escape(key) {
      var escaperLookup = { "=": "=0", ":": "=2" };
      return "$" + key.replace(/[=:]/g, function(match) {
        return escaperLookup[match];
      });
    }
    var userProvidedKeyEscapeRegex = /\/+/g;
    function getElementKey(element, index) {
      return "object" === typeof element && null !== element && null != element.key ? escape("" + element.key) : index.toString(36);
    }
    function resolveThenable(thenable) {
      switch (thenable.status) {
        case "fulfilled":
          return thenable.value;
        case "rejected":
          throw thenable.reason;
        default:
          switch ("string" === typeof thenable.status ? thenable.then(noop, noop) : (thenable.status = "pending", thenable.then(
            function(fulfilledValue) {
              "pending" === thenable.status && (thenable.status = "fulfilled", thenable.value = fulfilledValue);
            },
            function(error) {
              "pending" === thenable.status && (thenable.status = "rejected", thenable.reason = error);
            }
          )), thenable.status) {
            case "fulfilled":
              return thenable.value;
            case "rejected":
              throw thenable.reason;
          }
      }
      throw thenable;
    }
    function mapIntoArray(children, array, escapedPrefix, nameSoFar, callback) {
      var type = typeof children;
      if ("undefined" === type || "boolean" === type) children = null;
      var invokeCallback = false;
      if (null === children) invokeCallback = true;
      else
        switch (type) {
          case "bigint":
          case "string":
          case "number":
            invokeCallback = true;
            break;
          case "object":
            switch (children.$$typeof) {
              case REACT_ELEMENT_TYPE:
              case REACT_PORTAL_TYPE:
                invokeCallback = true;
                break;
              case REACT_LAZY_TYPE:
                return invokeCallback = children._init, mapIntoArray(
                  invokeCallback(children._payload),
                  array,
                  escapedPrefix,
                  nameSoFar,
                  callback
                );
            }
        }
      if (invokeCallback)
        return callback = callback(children), invokeCallback = "" === nameSoFar ? "." + getElementKey(children, 0) : nameSoFar, isArrayImpl(callback) ? (escapedPrefix = "", null != invokeCallback && (escapedPrefix = invokeCallback.replace(userProvidedKeyEscapeRegex, "$&/") + "/"), mapIntoArray(callback, array, escapedPrefix, "", function(c) {
          return c;
        })) : null != callback && (isValidElement(callback) && (callback = cloneAndReplaceKey(
          callback,
          escapedPrefix + (null == callback.key || children && children.key === callback.key ? "" : ("" + callback.key).replace(
            userProvidedKeyEscapeRegex,
            "$&/"
          ) + "/") + invokeCallback
        )), array.push(callback)), 1;
      invokeCallback = 0;
      var nextNamePrefix = "" === nameSoFar ? "." : nameSoFar + ":";
      if (isArrayImpl(children))
        for (var i = 0; i < children.length; i++)
          nameSoFar = children[i], type = nextNamePrefix + getElementKey(nameSoFar, i), invokeCallback += mapIntoArray(
            nameSoFar,
            array,
            escapedPrefix,
            type,
            callback
          );
      else if (i = getIteratorFn(children), "function" === typeof i)
        for (children = i.call(children), i = 0; !(nameSoFar = children.next()).done; )
          nameSoFar = nameSoFar.value, type = nextNamePrefix + getElementKey(nameSoFar, i++), invokeCallback += mapIntoArray(
            nameSoFar,
            array,
            escapedPrefix,
            type,
            callback
          );
      else if ("object" === type) {
        if ("function" === typeof children.then)
          return mapIntoArray(
            resolveThenable(children),
            array,
            escapedPrefix,
            nameSoFar,
            callback
          );
        array = String(children);
        throw Error(
          "Objects are not valid as a React child (found: " + ("[object Object]" === array ? "object with keys {" + Object.keys(children).join(", ") + "}" : array) + "). If you meant to render a collection of children, use an array instead."
        );
      }
      return invokeCallback;
    }
    function mapChildren(children, func, context) {
      if (null == children) return children;
      var result = [], count = 0;
      mapIntoArray(children, result, "", "", function(child) {
        return func.call(context, child, count++);
      });
      return result;
    }
    function lazyInitializer(payload) {
      if (-1 === payload._status) {
        var ctor = payload._result;
        ctor = ctor();
        ctor.then(
          function(moduleObject) {
            if (0 === payload._status || -1 === payload._status)
              payload._status = 1, payload._result = moduleObject;
          },
          function(error) {
            if (0 === payload._status || -1 === payload._status)
              payload._status = 2, payload._result = error;
          }
        );
        -1 === payload._status && (payload._status = 0, payload._result = ctor);
      }
      if (1 === payload._status) return payload._result.default;
      throw payload._result;
    }
    var reportGlobalError = "function" === typeof reportError ? reportError : function(error) {
      if ("object" === typeof window && "function" === typeof window.ErrorEvent) {
        var event = new window.ErrorEvent("error", {
          bubbles: true,
          cancelable: true,
          message: "object" === typeof error && null !== error && "string" === typeof error.message ? String(error.message) : String(error),
          error
        });
        if (!window.dispatchEvent(event)) return;
      } else if ("object" === typeof process && "function" === typeof process.emit) {
        process.emit("uncaughtException", error);
        return;
      }
      console.error(error);
    }, Children = {
      map: mapChildren,
      forEach: function(children, forEachFunc, forEachContext) {
        mapChildren(
          children,
          function() {
            forEachFunc.apply(this, arguments);
          },
          forEachContext
        );
      },
      count: function(children) {
        var n = 0;
        mapChildren(children, function() {
          n++;
        });
        return n;
      },
      toArray: function(children) {
        return mapChildren(children, function(child) {
          return child;
        }) || [];
      },
      only: function(children) {
        if (!isValidElement(children))
          throw Error(
            "React.Children.only expected to receive a single React element child."
          );
        return children;
      }
    };
    react_production.Activity = REACT_ACTIVITY_TYPE;
    react_production.Children = Children;
    react_production.Component = Component;
    react_production.Fragment = REACT_FRAGMENT_TYPE;
    react_production.Profiler = REACT_PROFILER_TYPE;
    react_production.PureComponent = PureComponent;
    react_production.StrictMode = REACT_STRICT_MODE_TYPE;
    react_production.Suspense = REACT_SUSPENSE_TYPE;
    react_production.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE = ReactSharedInternals;
    react_production.__COMPILER_RUNTIME = {
      __proto__: null,
      c: function(size) {
        return ReactSharedInternals.H.useMemoCache(size);
      }
    };
    react_production.cache = function(fn) {
      return function() {
        return fn.apply(null, arguments);
      };
    };
    react_production.cacheSignal = function() {
      return null;
    };
    react_production.cloneElement = function(element, config, children) {
      if (null === element || void 0 === element)
        throw Error(
          "The argument must be a React element, but you passed " + element + "."
        );
      var props = assign({}, element.props), key = element.key;
      if (null != config)
        for (propName in void 0 !== config.key && (key = "" + config.key), config)
          !hasOwnProperty.call(config, propName) || "key" === propName || "__self" === propName || "__source" === propName || "ref" === propName && void 0 === config.ref || (props[propName] = config[propName]);
      var propName = arguments.length - 2;
      if (1 === propName) props.children = children;
      else if (1 < propName) {
        for (var childArray = Array(propName), i = 0; i < propName; i++)
          childArray[i] = arguments[i + 2];
        props.children = childArray;
      }
      return ReactElement(element.type, key, props);
    };
    react_production.createContext = function(defaultValue) {
      defaultValue = {
        $$typeof: REACT_CONTEXT_TYPE,
        _currentValue: defaultValue,
        _currentValue2: defaultValue,
        _threadCount: 0,
        Provider: null,
        Consumer: null
      };
      defaultValue.Provider = defaultValue;
      defaultValue.Consumer = {
        $$typeof: REACT_CONSUMER_TYPE,
        _context: defaultValue
      };
      return defaultValue;
    };
    react_production.createElement = function(type, config, children) {
      var propName, props = {}, key = null;
      if (null != config)
        for (propName in void 0 !== config.key && (key = "" + config.key), config)
          hasOwnProperty.call(config, propName) && "key" !== propName && "__self" !== propName && "__source" !== propName && (props[propName] = config[propName]);
      var childrenLength = arguments.length - 2;
      if (1 === childrenLength) props.children = children;
      else if (1 < childrenLength) {
        for (var childArray = Array(childrenLength), i = 0; i < childrenLength; i++)
          childArray[i] = arguments[i + 2];
        props.children = childArray;
      }
      if (type && type.defaultProps)
        for (propName in childrenLength = type.defaultProps, childrenLength)
          void 0 === props[propName] && (props[propName] = childrenLength[propName]);
      return ReactElement(type, key, props);
    };
    react_production.createRef = function() {
      return { current: null };
    };
    react_production.forwardRef = function(render) {
      return { $$typeof: REACT_FORWARD_REF_TYPE, render };
    };
    react_production.isValidElement = isValidElement;
    react_production.lazy = function(ctor) {
      return {
        $$typeof: REACT_LAZY_TYPE,
        _payload: { _status: -1, _result: ctor },
        _init: lazyInitializer
      };
    };
    react_production.memo = function(type, compare) {
      return {
        $$typeof: REACT_MEMO_TYPE,
        type,
        compare: void 0 === compare ? null : compare
      };
    };
    react_production.startTransition = function(scope) {
      var prevTransition = ReactSharedInternals.T, currentTransition = {};
      ReactSharedInternals.T = currentTransition;
      try {
        var returnValue = scope(), onStartTransitionFinish = ReactSharedInternals.S;
        null !== onStartTransitionFinish && onStartTransitionFinish(currentTransition, returnValue);
        "object" === typeof returnValue && null !== returnValue && "function" === typeof returnValue.then && returnValue.then(noop, reportGlobalError);
      } catch (error) {
        reportGlobalError(error);
      } finally {
        null !== prevTransition && null !== currentTransition.types && (prevTransition.types = currentTransition.types), ReactSharedInternals.T = prevTransition;
      }
    };
    react_production.unstable_useCacheRefresh = function() {
      return ReactSharedInternals.H.useCacheRefresh();
    };
    react_production.use = function(usable) {
      return ReactSharedInternals.H.use(usable);
    };
    react_production.useActionState = function(action, initialState, permalink) {
      return ReactSharedInternals.H.useActionState(action, initialState, permalink);
    };
    react_production.useCallback = function(callback, deps) {
      return ReactSharedInternals.H.useCallback(callback, deps);
    };
    react_production.useContext = function(Context) {
      return ReactSharedInternals.H.useContext(Context);
    };
    react_production.useDebugValue = function() {
    };
    react_production.useDeferredValue = function(value, initialValue) {
      return ReactSharedInternals.H.useDeferredValue(value, initialValue);
    };
    react_production.useEffect = function(create2, deps) {
      return ReactSharedInternals.H.useEffect(create2, deps);
    };
    react_production.useEffectEvent = function(callback) {
      return ReactSharedInternals.H.useEffectEvent(callback);
    };
    react_production.useId = function() {
      return ReactSharedInternals.H.useId();
    };
    react_production.useImperativeHandle = function(ref, create2, deps) {
      return ReactSharedInternals.H.useImperativeHandle(ref, create2, deps);
    };
    react_production.useInsertionEffect = function(create2, deps) {
      return ReactSharedInternals.H.useInsertionEffect(create2, deps);
    };
    react_production.useLayoutEffect = function(create2, deps) {
      return ReactSharedInternals.H.useLayoutEffect(create2, deps);
    };
    react_production.useMemo = function(create2, deps) {
      return ReactSharedInternals.H.useMemo(create2, deps);
    };
    react_production.useOptimistic = function(passthrough, reducer) {
      return ReactSharedInternals.H.useOptimistic(passthrough, reducer);
    };
    react_production.useReducer = function(reducer, initialArg, init) {
      return ReactSharedInternals.H.useReducer(reducer, initialArg, init);
    };
    react_production.useRef = function(initialValue) {
      return ReactSharedInternals.H.useRef(initialValue);
    };
    react_production.useState = function(initialState) {
      return ReactSharedInternals.H.useState(initialState);
    };
    react_production.useSyncExternalStore = function(subscribe, getSnapshot, getServerSnapshot) {
      return ReactSharedInternals.H.useSyncExternalStore(
        subscribe,
        getSnapshot,
        getServerSnapshot
      );
    };
    react_production.useTransition = function() {
      return ReactSharedInternals.H.useTransition();
    };
    react_production.version = "19.2.3";
    return react_production;
  }
  var hasRequiredReact;
  function requireReact() {
    if (hasRequiredReact) return react.exports;
    hasRequiredReact = 1;
    {
      react.exports = requireReact_production();
    }
    return react.exports;
  }
  var reactExports = requireReact();
  const React = getDefaultExportFromCjs(reactExports);
  var client = { exports: {} };
  var reactDomClient_production = {};
  var scheduler = { exports: {} };
  var scheduler_production = {};
  var hasRequiredScheduler_production;
  function requireScheduler_production() {
    if (hasRequiredScheduler_production) return scheduler_production;
    hasRequiredScheduler_production = 1;
    (function(exports$1) {
      function push(heap, node) {
        var index = heap.length;
        heap.push(node);
        a: for (; 0 < index; ) {
          var parentIndex = index - 1 >>> 1, parent = heap[parentIndex];
          if (0 < compare(parent, node))
            heap[parentIndex] = node, heap[index] = parent, index = parentIndex;
          else break a;
        }
      }
      function peek(heap) {
        return 0 === heap.length ? null : heap[0];
      }
      function pop(heap) {
        if (0 === heap.length) return null;
        var first = heap[0], last = heap.pop();
        if (last !== first) {
          heap[0] = last;
          a: for (var index = 0, length = heap.length, halfLength = length >>> 1; index < halfLength; ) {
            var leftIndex = 2 * (index + 1) - 1, left = heap[leftIndex], rightIndex = leftIndex + 1, right = heap[rightIndex];
            if (0 > compare(left, last))
              rightIndex < length && 0 > compare(right, left) ? (heap[index] = right, heap[rightIndex] = last, index = rightIndex) : (heap[index] = left, heap[leftIndex] = last, index = leftIndex);
            else if (rightIndex < length && 0 > compare(right, last))
              heap[index] = right, heap[rightIndex] = last, index = rightIndex;
            else break a;
          }
        }
        return first;
      }
      function compare(a, b) {
        var diff = a.sortIndex - b.sortIndex;
        return 0 !== diff ? diff : a.id - b.id;
      }
      exports$1.unstable_now = void 0;
      if ("object" === typeof performance && "function" === typeof performance.now) {
        var localPerformance = performance;
        exports$1.unstable_now = function() {
          return localPerformance.now();
        };
      } else {
        var localDate = Date, initialTime = localDate.now();
        exports$1.unstable_now = function() {
          return localDate.now() - initialTime;
        };
      }
      var taskQueue = [], timerQueue = [], taskIdCounter = 1, currentTask = null, currentPriorityLevel = 3, isPerformingWork = false, isHostCallbackScheduled = false, isHostTimeoutScheduled = false, needsPaint = false, localSetTimeout = "function" === typeof setTimeout ? setTimeout : null, localClearTimeout = "function" === typeof clearTimeout ? clearTimeout : null, localSetImmediate = "undefined" !== typeof setImmediate ? setImmediate : null;
      function advanceTimers(currentTime) {
        for (var timer = peek(timerQueue); null !== timer; ) {
          if (null === timer.callback) pop(timerQueue);
          else if (timer.startTime <= currentTime)
            pop(timerQueue), timer.sortIndex = timer.expirationTime, push(taskQueue, timer);
          else break;
          timer = peek(timerQueue);
        }
      }
      function handleTimeout(currentTime) {
        isHostTimeoutScheduled = false;
        advanceTimers(currentTime);
        if (!isHostCallbackScheduled)
          if (null !== peek(taskQueue))
            isHostCallbackScheduled = true, isMessageLoopRunning || (isMessageLoopRunning = true, schedulePerformWorkUntilDeadline());
          else {
            var firstTimer = peek(timerQueue);
            null !== firstTimer && requestHostTimeout(handleTimeout, firstTimer.startTime - currentTime);
          }
      }
      var isMessageLoopRunning = false, taskTimeoutID = -1, frameInterval = 5, startTime = -1;
      function shouldYieldToHost() {
        return needsPaint ? true : exports$1.unstable_now() - startTime < frameInterval ? false : true;
      }
      function performWorkUntilDeadline() {
        needsPaint = false;
        if (isMessageLoopRunning) {
          var currentTime = exports$1.unstable_now();
          startTime = currentTime;
          var hasMoreWork = true;
          try {
            a: {
              isHostCallbackScheduled = false;
              isHostTimeoutScheduled && (isHostTimeoutScheduled = false, localClearTimeout(taskTimeoutID), taskTimeoutID = -1);
              isPerformingWork = true;
              var previousPriorityLevel = currentPriorityLevel;
              try {
                b: {
                  advanceTimers(currentTime);
                  for (currentTask = peek(taskQueue); null !== currentTask && !(currentTask.expirationTime > currentTime && shouldYieldToHost()); ) {
                    var callback = currentTask.callback;
                    if ("function" === typeof callback) {
                      currentTask.callback = null;
                      currentPriorityLevel = currentTask.priorityLevel;
                      var continuationCallback = callback(
                        currentTask.expirationTime <= currentTime
                      );
                      currentTime = exports$1.unstable_now();
                      if ("function" === typeof continuationCallback) {
                        currentTask.callback = continuationCallback;
                        advanceTimers(currentTime);
                        hasMoreWork = true;
                        break b;
                      }
                      currentTask === peek(taskQueue) && pop(taskQueue);
                      advanceTimers(currentTime);
                    } else pop(taskQueue);
                    currentTask = peek(taskQueue);
                  }
                  if (null !== currentTask) hasMoreWork = true;
                  else {
                    var firstTimer = peek(timerQueue);
                    null !== firstTimer && requestHostTimeout(
                      handleTimeout,
                      firstTimer.startTime - currentTime
                    );
                    hasMoreWork = false;
                  }
                }
                break a;
              } finally {
                currentTask = null, currentPriorityLevel = previousPriorityLevel, isPerformingWork = false;
              }
              hasMoreWork = void 0;
            }
          } finally {
            hasMoreWork ? schedulePerformWorkUntilDeadline() : isMessageLoopRunning = false;
          }
        }
      }
      var schedulePerformWorkUntilDeadline;
      if ("function" === typeof localSetImmediate)
        schedulePerformWorkUntilDeadline = function() {
          localSetImmediate(performWorkUntilDeadline);
        };
      else if ("undefined" !== typeof MessageChannel) {
        var channel = new MessageChannel(), port = channel.port2;
        channel.port1.onmessage = performWorkUntilDeadline;
        schedulePerformWorkUntilDeadline = function() {
          port.postMessage(null);
        };
      } else
        schedulePerformWorkUntilDeadline = function() {
          localSetTimeout(performWorkUntilDeadline, 0);
        };
      function requestHostTimeout(callback, ms) {
        taskTimeoutID = localSetTimeout(function() {
          callback(exports$1.unstable_now());
        }, ms);
      }
      exports$1.unstable_IdlePriority = 5;
      exports$1.unstable_ImmediatePriority = 1;
      exports$1.unstable_LowPriority = 4;
      exports$1.unstable_NormalPriority = 3;
      exports$1.unstable_Profiling = null;
      exports$1.unstable_UserBlockingPriority = 2;
      exports$1.unstable_cancelCallback = function(task) {
        task.callback = null;
      };
      exports$1.unstable_forceFrameRate = function(fps) {
        0 > fps || 125 < fps ? console.error(
          "forceFrameRate takes a positive int between 0 and 125, forcing frame rates higher than 125 fps is not supported"
        ) : frameInterval = 0 < fps ? Math.floor(1e3 / fps) : 5;
      };
      exports$1.unstable_getCurrentPriorityLevel = function() {
        return currentPriorityLevel;
      };
      exports$1.unstable_next = function(eventHandler) {
        switch (currentPriorityLevel) {
          case 1:
          case 2:
          case 3:
            var priorityLevel = 3;
            break;
          default:
            priorityLevel = currentPriorityLevel;
        }
        var previousPriorityLevel = currentPriorityLevel;
        currentPriorityLevel = priorityLevel;
        try {
          return eventHandler();
        } finally {
          currentPriorityLevel = previousPriorityLevel;
        }
      };
      exports$1.unstable_requestPaint = function() {
        needsPaint = true;
      };
      exports$1.unstable_runWithPriority = function(priorityLevel, eventHandler) {
        switch (priorityLevel) {
          case 1:
          case 2:
          case 3:
          case 4:
          case 5:
            break;
          default:
            priorityLevel = 3;
        }
        var previousPriorityLevel = currentPriorityLevel;
        currentPriorityLevel = priorityLevel;
        try {
          return eventHandler();
        } finally {
          currentPriorityLevel = previousPriorityLevel;
        }
      };
      exports$1.unstable_scheduleCallback = function(priorityLevel, callback, options) {
        var currentTime = exports$1.unstable_now();
        "object" === typeof options && null !== options ? (options = options.delay, options = "number" === typeof options && 0 < options ? currentTime + options : currentTime) : options = currentTime;
        switch (priorityLevel) {
          case 1:
            var timeout = -1;
            break;
          case 2:
            timeout = 250;
            break;
          case 5:
            timeout = 1073741823;
            break;
          case 4:
            timeout = 1e4;
            break;
          default:
            timeout = 5e3;
        }
        timeout = options + timeout;
        priorityLevel = {
          id: taskIdCounter++,
          callback,
          priorityLevel,
          startTime: options,
          expirationTime: timeout,
          sortIndex: -1
        };
        options > currentTime ? (priorityLevel.sortIndex = options, push(timerQueue, priorityLevel), null === peek(taskQueue) && priorityLevel === peek(timerQueue) && (isHostTimeoutScheduled ? (localClearTimeout(taskTimeoutID), taskTimeoutID = -1) : isHostTimeoutScheduled = true, requestHostTimeout(handleTimeout, options - currentTime))) : (priorityLevel.sortIndex = timeout, push(taskQueue, priorityLevel), isHostCallbackScheduled || isPerformingWork || (isHostCallbackScheduled = true, isMessageLoopRunning || (isMessageLoopRunning = true, schedulePerformWorkUntilDeadline())));
        return priorityLevel;
      };
      exports$1.unstable_shouldYield = shouldYieldToHost;
      exports$1.unstable_wrapCallback = function(callback) {
        var parentPriorityLevel = currentPriorityLevel;
        return function() {
          var previousPriorityLevel = currentPriorityLevel;
          currentPriorityLevel = parentPriorityLevel;
          try {
            return callback.apply(this, arguments);
          } finally {
            currentPriorityLevel = previousPriorityLevel;
          }
        };
      };
    })(scheduler_production);
    return scheduler_production;
  }
  var hasRequiredScheduler;
  function requireScheduler() {
    if (hasRequiredScheduler) return scheduler.exports;
    hasRequiredScheduler = 1;
    {
      scheduler.exports = requireScheduler_production();
    }
    return scheduler.exports;
  }
  var reactDom = { exports: {} };
  var reactDom_production = {};
  var hasRequiredReactDom_production;
  function requireReactDom_production() {
    if (hasRequiredReactDom_production) return reactDom_production;
    hasRequiredReactDom_production = 1;
    var React2 = requireReact();
    function formatProdErrorMessage(code) {
      var url = "https://react.dev/errors/" + code;
      if (1 < arguments.length) {
        url += "?args[]=" + encodeURIComponent(arguments[1]);
        for (var i = 2; i < arguments.length; i++)
          url += "&args[]=" + encodeURIComponent(arguments[i]);
      }
      return "Minified React error #" + code + "; visit " + url + " for the full message or use the non-minified dev environment for full errors and additional helpful warnings.";
    }
    function noop() {
    }
    var Internals = {
      d: {
        f: noop,
        r: function() {
          throw Error(formatProdErrorMessage(522));
        },
        D: noop,
        C: noop,
        L: noop,
        m: noop,
        X: noop,
        S: noop,
        M: noop
      },
      p: 0,
      findDOMNode: null
    }, REACT_PORTAL_TYPE = Symbol.for("react.portal");
    function createPortal$1(children, containerInfo, implementation) {
      var key = 3 < arguments.length && void 0 !== arguments[3] ? arguments[3] : null;
      return {
        $$typeof: REACT_PORTAL_TYPE,
        key: null == key ? null : "" + key,
        children,
        containerInfo,
        implementation
      };
    }
    var ReactSharedInternals = React2.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE;
    function getCrossOriginStringAs(as, input) {
      if ("font" === as) return "";
      if ("string" === typeof input)
        return "use-credentials" === input ? input : "";
    }
    reactDom_production.__DOM_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE = Internals;
    reactDom_production.createPortal = function(children, container) {
      var key = 2 < arguments.length && void 0 !== arguments[2] ? arguments[2] : null;
      if (!container || 1 !== container.nodeType && 9 !== container.nodeType && 11 !== container.nodeType)
        throw Error(formatProdErrorMessage(299));
      return createPortal$1(children, container, null, key);
    };
    reactDom_production.flushSync = function(fn) {
      var previousTransition = ReactSharedInternals.T, previousUpdatePriority = Internals.p;
      try {
        if (ReactSharedInternals.T = null, Internals.p = 2, fn) return fn();
      } finally {
        ReactSharedInternals.T = previousTransition, Internals.p = previousUpdatePriority, Internals.d.f();
      }
    };
    reactDom_production.preconnect = function(href, options) {
      "string" === typeof href && (options ? (options = options.crossOrigin, options = "string" === typeof options ? "use-credentials" === options ? options : "" : void 0) : options = null, Internals.d.C(href, options));
    };
    reactDom_production.prefetchDNS = function(href) {
      "string" === typeof href && Internals.d.D(href);
    };
    reactDom_production.preinit = function(href, options) {
      if ("string" === typeof href && options && "string" === typeof options.as) {
        var as = options.as, crossOrigin = getCrossOriginStringAs(as, options.crossOrigin), integrity = "string" === typeof options.integrity ? options.integrity : void 0, fetchPriority = "string" === typeof options.fetchPriority ? options.fetchPriority : void 0;
        "style" === as ? Internals.d.S(
          href,
          "string" === typeof options.precedence ? options.precedence : void 0,
          {
            crossOrigin,
            integrity,
            fetchPriority
          }
        ) : "script" === as && Internals.d.X(href, {
          crossOrigin,
          integrity,
          fetchPriority,
          nonce: "string" === typeof options.nonce ? options.nonce : void 0
        });
      }
    };
    reactDom_production.preinitModule = function(href, options) {
      if ("string" === typeof href)
        if ("object" === typeof options && null !== options) {
          if (null == options.as || "script" === options.as) {
            var crossOrigin = getCrossOriginStringAs(
              options.as,
              options.crossOrigin
            );
            Internals.d.M(href, {
              crossOrigin,
              integrity: "string" === typeof options.integrity ? options.integrity : void 0,
              nonce: "string" === typeof options.nonce ? options.nonce : void 0
            });
          }
        } else null == options && Internals.d.M(href);
    };
    reactDom_production.preload = function(href, options) {
      if ("string" === typeof href && "object" === typeof options && null !== options && "string" === typeof options.as) {
        var as = options.as, crossOrigin = getCrossOriginStringAs(as, options.crossOrigin);
        Internals.d.L(href, as, {
          crossOrigin,
          integrity: "string" === typeof options.integrity ? options.integrity : void 0,
          nonce: "string" === typeof options.nonce ? options.nonce : void 0,
          type: "string" === typeof options.type ? options.type : void 0,
          fetchPriority: "string" === typeof options.fetchPriority ? options.fetchPriority : void 0,
          referrerPolicy: "string" === typeof options.referrerPolicy ? options.referrerPolicy : void 0,
          imageSrcSet: "string" === typeof options.imageSrcSet ? options.imageSrcSet : void 0,
          imageSizes: "string" === typeof options.imageSizes ? options.imageSizes : void 0,
          media: "string" === typeof options.media ? options.media : void 0
        });
      }
    };
    reactDom_production.preloadModule = function(href, options) {
      if ("string" === typeof href)
        if (options) {
          var crossOrigin = getCrossOriginStringAs(options.as, options.crossOrigin);
          Internals.d.m(href, {
            as: "string" === typeof options.as && "script" !== options.as ? options.as : void 0,
            crossOrigin,
            integrity: "string" === typeof options.integrity ? options.integrity : void 0
          });
        } else Internals.d.m(href);
    };
    reactDom_production.requestFormReset = function(form) {
      Internals.d.r(form);
    };
    reactDom_production.unstable_batchedUpdates = function(fn, a) {
      return fn(a);
    };
    reactDom_production.useFormState = function(action, initialState, permalink) {
      return ReactSharedInternals.H.useFormState(action, initialState, permalink);
    };
    reactDom_production.useFormStatus = function() {
      return ReactSharedInternals.H.useHostTransitionStatus();
    };
    reactDom_production.version = "19.2.3";
    return reactDom_production;
  }
  var hasRequiredReactDom;
  function requireReactDom() {
    if (hasRequiredReactDom) return reactDom.exports;
    hasRequiredReactDom = 1;
    function checkDCE() {
      if (typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ === "undefined" || typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE !== "function") {
        return;
      }
      try {
        __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE(checkDCE);
      } catch (err) {
        console.error(err);
      }
    }
    {
      checkDCE();
      reactDom.exports = requireReactDom_production();
    }
    return reactDom.exports;
  }
  var hasRequiredReactDomClient_production;
  function requireReactDomClient_production() {
    if (hasRequiredReactDomClient_production) return reactDomClient_production;
    hasRequiredReactDomClient_production = 1;
    var Scheduler = requireScheduler(), React2 = requireReact(), ReactDOM2 = requireReactDom();
    function formatProdErrorMessage(code) {
      var url = "https://react.dev/errors/" + code;
      if (1 < arguments.length) {
        url += "?args[]=" + encodeURIComponent(arguments[1]);
        for (var i = 2; i < arguments.length; i++)
          url += "&args[]=" + encodeURIComponent(arguments[i]);
      }
      return "Minified React error #" + code + "; visit " + url + " for the full message or use the non-minified dev environment for full errors and additional helpful warnings.";
    }
    function isValidContainer(node) {
      return !(!node || 1 !== node.nodeType && 9 !== node.nodeType && 11 !== node.nodeType);
    }
    function getNearestMountedFiber(fiber) {
      var node = fiber, nearestMounted = fiber;
      if (fiber.alternate) for (; node.return; ) node = node.return;
      else {
        fiber = node;
        do
          node = fiber, 0 !== (node.flags & 4098) && (nearestMounted = node.return), fiber = node.return;
        while (fiber);
      }
      return 3 === node.tag ? nearestMounted : null;
    }
    function getSuspenseInstanceFromFiber(fiber) {
      if (13 === fiber.tag) {
        var suspenseState = fiber.memoizedState;
        null === suspenseState && (fiber = fiber.alternate, null !== fiber && (suspenseState = fiber.memoizedState));
        if (null !== suspenseState) return suspenseState.dehydrated;
      }
      return null;
    }
    function getActivityInstanceFromFiber(fiber) {
      if (31 === fiber.tag) {
        var activityState = fiber.memoizedState;
        null === activityState && (fiber = fiber.alternate, null !== fiber && (activityState = fiber.memoizedState));
        if (null !== activityState) return activityState.dehydrated;
      }
      return null;
    }
    function assertIsMounted(fiber) {
      if (getNearestMountedFiber(fiber) !== fiber)
        throw Error(formatProdErrorMessage(188));
    }
    function findCurrentFiberUsingSlowPath(fiber) {
      var alternate = fiber.alternate;
      if (!alternate) {
        alternate = getNearestMountedFiber(fiber);
        if (null === alternate) throw Error(formatProdErrorMessage(188));
        return alternate !== fiber ? null : fiber;
      }
      for (var a = fiber, b = alternate; ; ) {
        var parentA = a.return;
        if (null === parentA) break;
        var parentB = parentA.alternate;
        if (null === parentB) {
          b = parentA.return;
          if (null !== b) {
            a = b;
            continue;
          }
          break;
        }
        if (parentA.child === parentB.child) {
          for (parentB = parentA.child; parentB; ) {
            if (parentB === a) return assertIsMounted(parentA), fiber;
            if (parentB === b) return assertIsMounted(parentA), alternate;
            parentB = parentB.sibling;
          }
          throw Error(formatProdErrorMessage(188));
        }
        if (a.return !== b.return) a = parentA, b = parentB;
        else {
          for (var didFindChild = false, child$0 = parentA.child; child$0; ) {
            if (child$0 === a) {
              didFindChild = true;
              a = parentA;
              b = parentB;
              break;
            }
            if (child$0 === b) {
              didFindChild = true;
              b = parentA;
              a = parentB;
              break;
            }
            child$0 = child$0.sibling;
          }
          if (!didFindChild) {
            for (child$0 = parentB.child; child$0; ) {
              if (child$0 === a) {
                didFindChild = true;
                a = parentB;
                b = parentA;
                break;
              }
              if (child$0 === b) {
                didFindChild = true;
                b = parentB;
                a = parentA;
                break;
              }
              child$0 = child$0.sibling;
            }
            if (!didFindChild) throw Error(formatProdErrorMessage(189));
          }
        }
        if (a.alternate !== b) throw Error(formatProdErrorMessage(190));
      }
      if (3 !== a.tag) throw Error(formatProdErrorMessage(188));
      return a.stateNode.current === a ? fiber : alternate;
    }
    function findCurrentHostFiberImpl(node) {
      var tag = node.tag;
      if (5 === tag || 26 === tag || 27 === tag || 6 === tag) return node;
      for (node = node.child; null !== node; ) {
        tag = findCurrentHostFiberImpl(node);
        if (null !== tag) return tag;
        node = node.sibling;
      }
      return null;
    }
    var assign = Object.assign, REACT_LEGACY_ELEMENT_TYPE = Symbol.for("react.element"), REACT_ELEMENT_TYPE = Symbol.for("react.transitional.element"), REACT_PORTAL_TYPE = Symbol.for("react.portal"), REACT_FRAGMENT_TYPE = Symbol.for("react.fragment"), REACT_STRICT_MODE_TYPE = Symbol.for("react.strict_mode"), REACT_PROFILER_TYPE = Symbol.for("react.profiler"), REACT_CONSUMER_TYPE = Symbol.for("react.consumer"), REACT_CONTEXT_TYPE = Symbol.for("react.context"), REACT_FORWARD_REF_TYPE = Symbol.for("react.forward_ref"), REACT_SUSPENSE_TYPE = Symbol.for("react.suspense"), REACT_SUSPENSE_LIST_TYPE = Symbol.for("react.suspense_list"), REACT_MEMO_TYPE = Symbol.for("react.memo"), REACT_LAZY_TYPE = Symbol.for("react.lazy");
    var REACT_ACTIVITY_TYPE = Symbol.for("react.activity");
    var REACT_MEMO_CACHE_SENTINEL = Symbol.for("react.memo_cache_sentinel");
    var MAYBE_ITERATOR_SYMBOL = Symbol.iterator;
    function getIteratorFn(maybeIterable) {
      if (null === maybeIterable || "object" !== typeof maybeIterable) return null;
      maybeIterable = MAYBE_ITERATOR_SYMBOL && maybeIterable[MAYBE_ITERATOR_SYMBOL] || maybeIterable["@@iterator"];
      return "function" === typeof maybeIterable ? maybeIterable : null;
    }
    var REACT_CLIENT_REFERENCE = Symbol.for("react.client.reference");
    function getComponentNameFromType(type) {
      if (null == type) return null;
      if ("function" === typeof type)
        return type.$$typeof === REACT_CLIENT_REFERENCE ? null : type.displayName || type.name || null;
      if ("string" === typeof type) return type;
      switch (type) {
        case REACT_FRAGMENT_TYPE:
          return "Fragment";
        case REACT_PROFILER_TYPE:
          return "Profiler";
        case REACT_STRICT_MODE_TYPE:
          return "StrictMode";
        case REACT_SUSPENSE_TYPE:
          return "Suspense";
        case REACT_SUSPENSE_LIST_TYPE:
          return "SuspenseList";
        case REACT_ACTIVITY_TYPE:
          return "Activity";
      }
      if ("object" === typeof type)
        switch (type.$$typeof) {
          case REACT_PORTAL_TYPE:
            return "Portal";
          case REACT_CONTEXT_TYPE:
            return type.displayName || "Context";
          case REACT_CONSUMER_TYPE:
            return (type._context.displayName || "Context") + ".Consumer";
          case REACT_FORWARD_REF_TYPE:
            var innerType = type.render;
            type = type.displayName;
            type || (type = innerType.displayName || innerType.name || "", type = "" !== type ? "ForwardRef(" + type + ")" : "ForwardRef");
            return type;
          case REACT_MEMO_TYPE:
            return innerType = type.displayName || null, null !== innerType ? innerType : getComponentNameFromType(type.type) || "Memo";
          case REACT_LAZY_TYPE:
            innerType = type._payload;
            type = type._init;
            try {
              return getComponentNameFromType(type(innerType));
            } catch (x) {
            }
        }
      return null;
    }
    var isArrayImpl = Array.isArray, ReactSharedInternals = React2.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE, ReactDOMSharedInternals = ReactDOM2.__DOM_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE, sharedNotPendingObject = {
      pending: false,
      data: null,
      method: null,
      action: null
    }, valueStack = [], index = -1;
    function createCursor(defaultValue) {
      return { current: defaultValue };
    }
    function pop(cursor) {
      0 > index || (cursor.current = valueStack[index], valueStack[index] = null, index--);
    }
    function push(cursor, value) {
      index++;
      valueStack[index] = cursor.current;
      cursor.current = value;
    }
    var contextStackCursor = createCursor(null), contextFiberStackCursor = createCursor(null), rootInstanceStackCursor = createCursor(null), hostTransitionProviderCursor = createCursor(null);
    function pushHostContainer(fiber, nextRootInstance) {
      push(rootInstanceStackCursor, nextRootInstance);
      push(contextFiberStackCursor, fiber);
      push(contextStackCursor, null);
      switch (nextRootInstance.nodeType) {
        case 9:
        case 11:
          fiber = (fiber = nextRootInstance.documentElement) ? (fiber = fiber.namespaceURI) ? getOwnHostContext(fiber) : 0 : 0;
          break;
        default:
          if (fiber = nextRootInstance.tagName, nextRootInstance = nextRootInstance.namespaceURI)
            nextRootInstance = getOwnHostContext(nextRootInstance), fiber = getChildHostContextProd(nextRootInstance, fiber);
          else
            switch (fiber) {
              case "svg":
                fiber = 1;
                break;
              case "math":
                fiber = 2;
                break;
              default:
                fiber = 0;
            }
      }
      pop(contextStackCursor);
      push(contextStackCursor, fiber);
    }
    function popHostContainer() {
      pop(contextStackCursor);
      pop(contextFiberStackCursor);
      pop(rootInstanceStackCursor);
    }
    function pushHostContext(fiber) {
      null !== fiber.memoizedState && push(hostTransitionProviderCursor, fiber);
      var context = contextStackCursor.current;
      var JSCompiler_inline_result = getChildHostContextProd(context, fiber.type);
      context !== JSCompiler_inline_result && (push(contextFiberStackCursor, fiber), push(contextStackCursor, JSCompiler_inline_result));
    }
    function popHostContext(fiber) {
      contextFiberStackCursor.current === fiber && (pop(contextStackCursor), pop(contextFiberStackCursor));
      hostTransitionProviderCursor.current === fiber && (pop(hostTransitionProviderCursor), HostTransitionContext._currentValue = sharedNotPendingObject);
    }
    var prefix, suffix;
    function describeBuiltInComponentFrame(name) {
      if (void 0 === prefix)
        try {
          throw Error();
        } catch (x) {
          var match = x.stack.trim().match(/\n( *(at )?)/);
          prefix = match && match[1] || "";
          suffix = -1 < x.stack.indexOf("\n    at") ? " (<anonymous>)" : -1 < x.stack.indexOf("@") ? "@unknown:0:0" : "";
        }
      return "\n" + prefix + name + suffix;
    }
    var reentry = false;
    function describeNativeComponentFrame(fn, construct) {
      if (!fn || reentry) return "";
      reentry = true;
      var previousPrepareStackTrace = Error.prepareStackTrace;
      Error.prepareStackTrace = void 0;
      try {
        var RunInRootFrame = {
          DetermineComponentFrameRoot: function() {
            try {
              if (construct) {
                var Fake = function() {
                  throw Error();
                };
                Object.defineProperty(Fake.prototype, "props", {
                  set: function() {
                    throw Error();
                  }
                });
                if ("object" === typeof Reflect && Reflect.construct) {
                  try {
                    Reflect.construct(Fake, []);
                  } catch (x) {
                    var control = x;
                  }
                  Reflect.construct(fn, [], Fake);
                } else {
                  try {
                    Fake.call();
                  } catch (x$1) {
                    control = x$1;
                  }
                  fn.call(Fake.prototype);
                }
              } else {
                try {
                  throw Error();
                } catch (x$2) {
                  control = x$2;
                }
                (Fake = fn()) && "function" === typeof Fake.catch && Fake.catch(function() {
                });
              }
            } catch (sample) {
              if (sample && control && "string" === typeof sample.stack)
                return [sample.stack, control.stack];
            }
            return [null, null];
          }
        };
        RunInRootFrame.DetermineComponentFrameRoot.displayName = "DetermineComponentFrameRoot";
        var namePropDescriptor = Object.getOwnPropertyDescriptor(
          RunInRootFrame.DetermineComponentFrameRoot,
          "name"
        );
        namePropDescriptor && namePropDescriptor.configurable && Object.defineProperty(
          RunInRootFrame.DetermineComponentFrameRoot,
          "name",
          { value: "DetermineComponentFrameRoot" }
        );
        var _RunInRootFrame$Deter = RunInRootFrame.DetermineComponentFrameRoot(), sampleStack = _RunInRootFrame$Deter[0], controlStack = _RunInRootFrame$Deter[1];
        if (sampleStack && controlStack) {
          var sampleLines = sampleStack.split("\n"), controlLines = controlStack.split("\n");
          for (namePropDescriptor = RunInRootFrame = 0; RunInRootFrame < sampleLines.length && !sampleLines[RunInRootFrame].includes("DetermineComponentFrameRoot"); )
            RunInRootFrame++;
          for (; namePropDescriptor < controlLines.length && !controlLines[namePropDescriptor].includes(
            "DetermineComponentFrameRoot"
          ); )
            namePropDescriptor++;
          if (RunInRootFrame === sampleLines.length || namePropDescriptor === controlLines.length)
            for (RunInRootFrame = sampleLines.length - 1, namePropDescriptor = controlLines.length - 1; 1 <= RunInRootFrame && 0 <= namePropDescriptor && sampleLines[RunInRootFrame] !== controlLines[namePropDescriptor]; )
              namePropDescriptor--;
          for (; 1 <= RunInRootFrame && 0 <= namePropDescriptor; RunInRootFrame--, namePropDescriptor--)
            if (sampleLines[RunInRootFrame] !== controlLines[namePropDescriptor]) {
              if (1 !== RunInRootFrame || 1 !== namePropDescriptor) {
                do
                  if (RunInRootFrame--, namePropDescriptor--, 0 > namePropDescriptor || sampleLines[RunInRootFrame] !== controlLines[namePropDescriptor]) {
                    var frame = "\n" + sampleLines[RunInRootFrame].replace(" at new ", " at ");
                    fn.displayName && frame.includes("<anonymous>") && (frame = frame.replace("<anonymous>", fn.displayName));
                    return frame;
                  }
                while (1 <= RunInRootFrame && 0 <= namePropDescriptor);
              }
              break;
            }
        }
      } finally {
        reentry = false, Error.prepareStackTrace = previousPrepareStackTrace;
      }
      return (previousPrepareStackTrace = fn ? fn.displayName || fn.name : "") ? describeBuiltInComponentFrame(previousPrepareStackTrace) : "";
    }
    function describeFiber(fiber, childFiber) {
      switch (fiber.tag) {
        case 26:
        case 27:
        case 5:
          return describeBuiltInComponentFrame(fiber.type);
        case 16:
          return describeBuiltInComponentFrame("Lazy");
        case 13:
          return fiber.child !== childFiber && null !== childFiber ? describeBuiltInComponentFrame("Suspense Fallback") : describeBuiltInComponentFrame("Suspense");
        case 19:
          return describeBuiltInComponentFrame("SuspenseList");
        case 0:
        case 15:
          return describeNativeComponentFrame(fiber.type, false);
        case 11:
          return describeNativeComponentFrame(fiber.type.render, false);
        case 1:
          return describeNativeComponentFrame(fiber.type, true);
        case 31:
          return describeBuiltInComponentFrame("Activity");
        default:
          return "";
      }
    }
    function getStackByFiberInDevAndProd(workInProgress2) {
      try {
        var info = "", previous = null;
        do
          info += describeFiber(workInProgress2, previous), previous = workInProgress2, workInProgress2 = workInProgress2.return;
        while (workInProgress2);
        return info;
      } catch (x) {
        return "\nError generating stack: " + x.message + "\n" + x.stack;
      }
    }
    var hasOwnProperty = Object.prototype.hasOwnProperty, scheduleCallback$3 = Scheduler.unstable_scheduleCallback, cancelCallback$1 = Scheduler.unstable_cancelCallback, shouldYield = Scheduler.unstable_shouldYield, requestPaint = Scheduler.unstable_requestPaint, now = Scheduler.unstable_now, getCurrentPriorityLevel = Scheduler.unstable_getCurrentPriorityLevel, ImmediatePriority = Scheduler.unstable_ImmediatePriority, UserBlockingPriority = Scheduler.unstable_UserBlockingPriority, NormalPriority$1 = Scheduler.unstable_NormalPriority, LowPriority = Scheduler.unstable_LowPriority, IdlePriority = Scheduler.unstable_IdlePriority, log$1 = Scheduler.log, unstable_setDisableYieldValue = Scheduler.unstable_setDisableYieldValue, rendererID = null, injectedHook = null;
    function setIsStrictModeForDevtools(newIsStrictMode) {
      "function" === typeof log$1 && unstable_setDisableYieldValue(newIsStrictMode);
      if (injectedHook && "function" === typeof injectedHook.setStrictMode)
        try {
          injectedHook.setStrictMode(rendererID, newIsStrictMode);
        } catch (err) {
        }
    }
    var clz32 = Math.clz32 ? Math.clz32 : clz32Fallback, log = Math.log, LN2 = Math.LN2;
    function clz32Fallback(x) {
      x >>>= 0;
      return 0 === x ? 32 : 31 - (log(x) / LN2 | 0) | 0;
    }
    var nextTransitionUpdateLane = 256, nextTransitionDeferredLane = 262144, nextRetryLane = 4194304;
    function getHighestPriorityLanes(lanes) {
      var pendingSyncLanes = lanes & 42;
      if (0 !== pendingSyncLanes) return pendingSyncLanes;
      switch (lanes & -lanes) {
        case 1:
          return 1;
        case 2:
          return 2;
        case 4:
          return 4;
        case 8:
          return 8;
        case 16:
          return 16;
        case 32:
          return 32;
        case 64:
          return 64;
        case 128:
          return 128;
        case 256:
        case 512:
        case 1024:
        case 2048:
        case 4096:
        case 8192:
        case 16384:
        case 32768:
        case 65536:
        case 131072:
          return lanes & 261888;
        case 262144:
        case 524288:
        case 1048576:
        case 2097152:
          return lanes & 3932160;
        case 4194304:
        case 8388608:
        case 16777216:
        case 33554432:
          return lanes & 62914560;
        case 67108864:
          return 67108864;
        case 134217728:
          return 134217728;
        case 268435456:
          return 268435456;
        case 536870912:
          return 536870912;
        case 1073741824:
          return 0;
        default:
          return lanes;
      }
    }
    function getNextLanes(root2, wipLanes, rootHasPendingCommit) {
      var pendingLanes = root2.pendingLanes;
      if (0 === pendingLanes) return 0;
      var nextLanes = 0, suspendedLanes = root2.suspendedLanes, pingedLanes = root2.pingedLanes;
      root2 = root2.warmLanes;
      var nonIdlePendingLanes = pendingLanes & 134217727;
      0 !== nonIdlePendingLanes ? (pendingLanes = nonIdlePendingLanes & ~suspendedLanes, 0 !== pendingLanes ? nextLanes = getHighestPriorityLanes(pendingLanes) : (pingedLanes &= nonIdlePendingLanes, 0 !== pingedLanes ? nextLanes = getHighestPriorityLanes(pingedLanes) : rootHasPendingCommit || (rootHasPendingCommit = nonIdlePendingLanes & ~root2, 0 !== rootHasPendingCommit && (nextLanes = getHighestPriorityLanes(rootHasPendingCommit))))) : (nonIdlePendingLanes = pendingLanes & ~suspendedLanes, 0 !== nonIdlePendingLanes ? nextLanes = getHighestPriorityLanes(nonIdlePendingLanes) : 0 !== pingedLanes ? nextLanes = getHighestPriorityLanes(pingedLanes) : rootHasPendingCommit || (rootHasPendingCommit = pendingLanes & ~root2, 0 !== rootHasPendingCommit && (nextLanes = getHighestPriorityLanes(rootHasPendingCommit))));
      return 0 === nextLanes ? 0 : 0 !== wipLanes && wipLanes !== nextLanes && 0 === (wipLanes & suspendedLanes) && (suspendedLanes = nextLanes & -nextLanes, rootHasPendingCommit = wipLanes & -wipLanes, suspendedLanes >= rootHasPendingCommit || 32 === suspendedLanes && 0 !== (rootHasPendingCommit & 4194048)) ? wipLanes : nextLanes;
    }
    function checkIfRootIsPrerendering(root2, renderLanes2) {
      return 0 === (root2.pendingLanes & ~(root2.suspendedLanes & ~root2.pingedLanes) & renderLanes2);
    }
    function computeExpirationTime(lane, currentTime) {
      switch (lane) {
        case 1:
        case 2:
        case 4:
        case 8:
        case 64:
          return currentTime + 250;
        case 16:
        case 32:
        case 128:
        case 256:
        case 512:
        case 1024:
        case 2048:
        case 4096:
        case 8192:
        case 16384:
        case 32768:
        case 65536:
        case 131072:
        case 262144:
        case 524288:
        case 1048576:
        case 2097152:
          return currentTime + 5e3;
        case 4194304:
        case 8388608:
        case 16777216:
        case 33554432:
          return -1;
        case 67108864:
        case 134217728:
        case 268435456:
        case 536870912:
        case 1073741824:
          return -1;
        default:
          return -1;
      }
    }
    function claimNextRetryLane() {
      var lane = nextRetryLane;
      nextRetryLane <<= 1;
      0 === (nextRetryLane & 62914560) && (nextRetryLane = 4194304);
      return lane;
    }
    function createLaneMap(initial) {
      for (var laneMap = [], i = 0; 31 > i; i++) laneMap.push(initial);
      return laneMap;
    }
    function markRootUpdated$1(root2, updateLane) {
      root2.pendingLanes |= updateLane;
      268435456 !== updateLane && (root2.suspendedLanes = 0, root2.pingedLanes = 0, root2.warmLanes = 0);
    }
    function markRootFinished(root2, finishedLanes, remainingLanes, spawnedLane, updatedLanes, suspendedRetryLanes) {
      var previouslyPendingLanes = root2.pendingLanes;
      root2.pendingLanes = remainingLanes;
      root2.suspendedLanes = 0;
      root2.pingedLanes = 0;
      root2.warmLanes = 0;
      root2.expiredLanes &= remainingLanes;
      root2.entangledLanes &= remainingLanes;
      root2.errorRecoveryDisabledLanes &= remainingLanes;
      root2.shellSuspendCounter = 0;
      var entanglements = root2.entanglements, expirationTimes = root2.expirationTimes, hiddenUpdates = root2.hiddenUpdates;
      for (remainingLanes = previouslyPendingLanes & ~remainingLanes; 0 < remainingLanes; ) {
        var index$7 = 31 - clz32(remainingLanes), lane = 1 << index$7;
        entanglements[index$7] = 0;
        expirationTimes[index$7] = -1;
        var hiddenUpdatesForLane = hiddenUpdates[index$7];
        if (null !== hiddenUpdatesForLane)
          for (hiddenUpdates[index$7] = null, index$7 = 0; index$7 < hiddenUpdatesForLane.length; index$7++) {
            var update = hiddenUpdatesForLane[index$7];
            null !== update && (update.lane &= -536870913);
          }
        remainingLanes &= ~lane;
      }
      0 !== spawnedLane && markSpawnedDeferredLane(root2, spawnedLane, 0);
      0 !== suspendedRetryLanes && 0 === updatedLanes && 0 !== root2.tag && (root2.suspendedLanes |= suspendedRetryLanes & ~(previouslyPendingLanes & ~finishedLanes));
    }
    function markSpawnedDeferredLane(root2, spawnedLane, entangledLanes) {
      root2.pendingLanes |= spawnedLane;
      root2.suspendedLanes &= ~spawnedLane;
      var spawnedLaneIndex = 31 - clz32(spawnedLane);
      root2.entangledLanes |= spawnedLane;
      root2.entanglements[spawnedLaneIndex] = root2.entanglements[spawnedLaneIndex] | 1073741824 | entangledLanes & 261930;
    }
    function markRootEntangled(root2, entangledLanes) {
      var rootEntangledLanes = root2.entangledLanes |= entangledLanes;
      for (root2 = root2.entanglements; rootEntangledLanes; ) {
        var index$8 = 31 - clz32(rootEntangledLanes), lane = 1 << index$8;
        lane & entangledLanes | root2[index$8] & entangledLanes && (root2[index$8] |= entangledLanes);
        rootEntangledLanes &= ~lane;
      }
    }
    function getBumpedLaneForHydration(root2, renderLanes2) {
      var renderLane = renderLanes2 & -renderLanes2;
      renderLane = 0 !== (renderLane & 42) ? 1 : getBumpedLaneForHydrationByLane(renderLane);
      return 0 !== (renderLane & (root2.suspendedLanes | renderLanes2)) ? 0 : renderLane;
    }
    function getBumpedLaneForHydrationByLane(lane) {
      switch (lane) {
        case 2:
          lane = 1;
          break;
        case 8:
          lane = 4;
          break;
        case 32:
          lane = 16;
          break;
        case 256:
        case 512:
        case 1024:
        case 2048:
        case 4096:
        case 8192:
        case 16384:
        case 32768:
        case 65536:
        case 131072:
        case 262144:
        case 524288:
        case 1048576:
        case 2097152:
        case 4194304:
        case 8388608:
        case 16777216:
        case 33554432:
          lane = 128;
          break;
        case 268435456:
          lane = 134217728;
          break;
        default:
          lane = 0;
      }
      return lane;
    }
    function lanesToEventPriority(lanes) {
      lanes &= -lanes;
      return 2 < lanes ? 8 < lanes ? 0 !== (lanes & 134217727) ? 32 : 268435456 : 8 : 2;
    }
    function resolveUpdatePriority() {
      var updatePriority = ReactDOMSharedInternals.p;
      if (0 !== updatePriority) return updatePriority;
      updatePriority = window.event;
      return void 0 === updatePriority ? 32 : getEventPriority(updatePriority.type);
    }
    function runWithPriority(priority, fn) {
      var previousPriority = ReactDOMSharedInternals.p;
      try {
        return ReactDOMSharedInternals.p = priority, fn();
      } finally {
        ReactDOMSharedInternals.p = previousPriority;
      }
    }
    var randomKey = Math.random().toString(36).slice(2), internalInstanceKey = "__reactFiber$" + randomKey, internalPropsKey = "__reactProps$" + randomKey, internalContainerInstanceKey = "__reactContainer$" + randomKey, internalEventHandlersKey = "__reactEvents$" + randomKey, internalEventHandlerListenersKey = "__reactListeners$" + randomKey, internalEventHandlesSetKey = "__reactHandles$" + randomKey, internalRootNodeResourcesKey = "__reactResources$" + randomKey, internalHoistableMarker = "__reactMarker$" + randomKey;
    function detachDeletedInstance(node) {
      delete node[internalInstanceKey];
      delete node[internalPropsKey];
      delete node[internalEventHandlersKey];
      delete node[internalEventHandlerListenersKey];
      delete node[internalEventHandlesSetKey];
    }
    function getClosestInstanceFromNode(targetNode) {
      var targetInst = targetNode[internalInstanceKey];
      if (targetInst) return targetInst;
      for (var parentNode = targetNode.parentNode; parentNode; ) {
        if (targetInst = parentNode[internalContainerInstanceKey] || parentNode[internalInstanceKey]) {
          parentNode = targetInst.alternate;
          if (null !== targetInst.child || null !== parentNode && null !== parentNode.child)
            for (targetNode = getParentHydrationBoundary(targetNode); null !== targetNode; ) {
              if (parentNode = targetNode[internalInstanceKey]) return parentNode;
              targetNode = getParentHydrationBoundary(targetNode);
            }
          return targetInst;
        }
        targetNode = parentNode;
        parentNode = targetNode.parentNode;
      }
      return null;
    }
    function getInstanceFromNode(node) {
      if (node = node[internalInstanceKey] || node[internalContainerInstanceKey]) {
        var tag = node.tag;
        if (5 === tag || 6 === tag || 13 === tag || 31 === tag || 26 === tag || 27 === tag || 3 === tag)
          return node;
      }
      return null;
    }
    function getNodeFromInstance(inst) {
      var tag = inst.tag;
      if (5 === tag || 26 === tag || 27 === tag || 6 === tag) return inst.stateNode;
      throw Error(formatProdErrorMessage(33));
    }
    function getResourcesFromRoot(root2) {
      var resources = root2[internalRootNodeResourcesKey];
      resources || (resources = root2[internalRootNodeResourcesKey] = { hoistableStyles: new Map(), hoistableScripts: new Map() });
      return resources;
    }
    function markNodeAsHoistable(node) {
      node[internalHoistableMarker] = true;
    }
    var allNativeEvents = new Set(), registrationNameDependencies = {};
    function registerTwoPhaseEvent(registrationName, dependencies) {
      registerDirectEvent(registrationName, dependencies);
      registerDirectEvent(registrationName + "Capture", dependencies);
    }
    function registerDirectEvent(registrationName, dependencies) {
      registrationNameDependencies[registrationName] = dependencies;
      for (registrationName = 0; registrationName < dependencies.length; registrationName++)
        allNativeEvents.add(dependencies[registrationName]);
    }
    var VALID_ATTRIBUTE_NAME_REGEX = RegExp(
      "^[:A-Z_a-z\\u00C0-\\u00D6\\u00D8-\\u00F6\\u00F8-\\u02FF\\u0370-\\u037D\\u037F-\\u1FFF\\u200C-\\u200D\\u2070-\\u218F\\u2C00-\\u2FEF\\u3001-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFFD][:A-Z_a-z\\u00C0-\\u00D6\\u00D8-\\u00F6\\u00F8-\\u02FF\\u0370-\\u037D\\u037F-\\u1FFF\\u200C-\\u200D\\u2070-\\u218F\\u2C00-\\u2FEF\\u3001-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFFD\\-.0-9\\u00B7\\u0300-\\u036F\\u203F-\\u2040]*$"
    ), illegalAttributeNameCache = {}, validatedAttributeNameCache = {};
    function isAttributeNameSafe(attributeName) {
      if (hasOwnProperty.call(validatedAttributeNameCache, attributeName))
        return true;
      if (hasOwnProperty.call(illegalAttributeNameCache, attributeName)) return false;
      if (VALID_ATTRIBUTE_NAME_REGEX.test(attributeName))
        return validatedAttributeNameCache[attributeName] = true;
      illegalAttributeNameCache[attributeName] = true;
      return false;
    }
    function setValueForAttribute(node, name, value) {
      if (isAttributeNameSafe(name))
        if (null === value) node.removeAttribute(name);
        else {
          switch (typeof value) {
            case "undefined":
            case "function":
            case "symbol":
              node.removeAttribute(name);
              return;
            case "boolean":
              var prefix$10 = name.toLowerCase().slice(0, 5);
              if ("data-" !== prefix$10 && "aria-" !== prefix$10) {
                node.removeAttribute(name);
                return;
              }
          }
          node.setAttribute(name, "" + value);
        }
    }
    function setValueForKnownAttribute(node, name, value) {
      if (null === value) node.removeAttribute(name);
      else {
        switch (typeof value) {
          case "undefined":
          case "function":
          case "symbol":
          case "boolean":
            node.removeAttribute(name);
            return;
        }
        node.setAttribute(name, "" + value);
      }
    }
    function setValueForNamespacedAttribute(node, namespace, name, value) {
      if (null === value) node.removeAttribute(name);
      else {
        switch (typeof value) {
          case "undefined":
          case "function":
          case "symbol":
          case "boolean":
            node.removeAttribute(name);
            return;
        }
        node.setAttributeNS(namespace, name, "" + value);
      }
    }
    function getToStringValue(value) {
      switch (typeof value) {
        case "bigint":
        case "boolean":
        case "number":
        case "string":
        case "undefined":
          return value;
        case "object":
          return value;
        default:
          return "";
      }
    }
    function isCheckable(elem) {
      var type = elem.type;
      return (elem = elem.nodeName) && "input" === elem.toLowerCase() && ("checkbox" === type || "radio" === type);
    }
    function trackValueOnNode(node, valueField, currentValue) {
      var descriptor = Object.getOwnPropertyDescriptor(
        node.constructor.prototype,
        valueField
      );
      if (!node.hasOwnProperty(valueField) && "undefined" !== typeof descriptor && "function" === typeof descriptor.get && "function" === typeof descriptor.set) {
        var get = descriptor.get, set = descriptor.set;
        Object.defineProperty(node, valueField, {
          configurable: true,
          get: function() {
            return get.call(this);
          },
          set: function(value) {
            currentValue = "" + value;
            set.call(this, value);
          }
        });
        Object.defineProperty(node, valueField, {
          enumerable: descriptor.enumerable
        });
        return {
          getValue: function() {
            return currentValue;
          },
          setValue: function(value) {
            currentValue = "" + value;
          },
          stopTracking: function() {
            node._valueTracker = null;
            delete node[valueField];
          }
        };
      }
    }
    function track(node) {
      if (!node._valueTracker) {
        var valueField = isCheckable(node) ? "checked" : "value";
        node._valueTracker = trackValueOnNode(
          node,
          valueField,
          "" + node[valueField]
        );
      }
    }
    function updateValueIfChanged(node) {
      if (!node) return false;
      var tracker = node._valueTracker;
      if (!tracker) return true;
      var lastValue = tracker.getValue();
      var value = "";
      node && (value = isCheckable(node) ? node.checked ? "true" : "false" : node.value);
      node = value;
      return node !== lastValue ? (tracker.setValue(node), true) : false;
    }
    function getActiveElement(doc) {
      doc = doc || ("undefined" !== typeof document ? document : void 0);
      if ("undefined" === typeof doc) return null;
      try {
        return doc.activeElement || doc.body;
      } catch (e) {
        return doc.body;
      }
    }
    var escapeSelectorAttributeValueInsideDoubleQuotesRegex = /[\n"\\]/g;
    function escapeSelectorAttributeValueInsideDoubleQuotes(value) {
      return value.replace(
        escapeSelectorAttributeValueInsideDoubleQuotesRegex,
        function(ch) {
          return "\\" + ch.charCodeAt(0).toString(16) + " ";
        }
      );
    }
    function updateInput(element, value, defaultValue, lastDefaultValue, checked, defaultChecked, type, name) {
      element.name = "";
      null != type && "function" !== typeof type && "symbol" !== typeof type && "boolean" !== typeof type ? element.type = type : element.removeAttribute("type");
      if (null != value)
        if ("number" === type) {
          if (0 === value && "" === element.value || element.value != value)
            element.value = "" + getToStringValue(value);
        } else
          element.value !== "" + getToStringValue(value) && (element.value = "" + getToStringValue(value));
      else
        "submit" !== type && "reset" !== type || element.removeAttribute("value");
      null != value ? setDefaultValue(element, type, getToStringValue(value)) : null != defaultValue ? setDefaultValue(element, type, getToStringValue(defaultValue)) : null != lastDefaultValue && element.removeAttribute("value");
      null == checked && null != defaultChecked && (element.defaultChecked = !!defaultChecked);
      null != checked && (element.checked = checked && "function" !== typeof checked && "symbol" !== typeof checked);
      null != name && "function" !== typeof name && "symbol" !== typeof name && "boolean" !== typeof name ? element.name = "" + getToStringValue(name) : element.removeAttribute("name");
    }
    function initInput(element, value, defaultValue, checked, defaultChecked, type, name, isHydrating2) {
      null != type && "function" !== typeof type && "symbol" !== typeof type && "boolean" !== typeof type && (element.type = type);
      if (null != value || null != defaultValue) {
        if (!("submit" !== type && "reset" !== type || void 0 !== value && null !== value)) {
          track(element);
          return;
        }
        defaultValue = null != defaultValue ? "" + getToStringValue(defaultValue) : "";
        value = null != value ? "" + getToStringValue(value) : defaultValue;
        isHydrating2 || value === element.value || (element.value = value);
        element.defaultValue = value;
      }
      checked = null != checked ? checked : defaultChecked;
      checked = "function" !== typeof checked && "symbol" !== typeof checked && !!checked;
      element.checked = isHydrating2 ? element.checked : !!checked;
      element.defaultChecked = !!checked;
      null != name && "function" !== typeof name && "symbol" !== typeof name && "boolean" !== typeof name && (element.name = name);
      track(element);
    }
    function setDefaultValue(node, type, value) {
      "number" === type && getActiveElement(node.ownerDocument) === node || node.defaultValue === "" + value || (node.defaultValue = "" + value);
    }
    function updateOptions(node, multiple, propValue, setDefaultSelected) {
      node = node.options;
      if (multiple) {
        multiple = {};
        for (var i = 0; i < propValue.length; i++)
          multiple["$" + propValue[i]] = true;
        for (propValue = 0; propValue < node.length; propValue++)
          i = multiple.hasOwnProperty("$" + node[propValue].value), node[propValue].selected !== i && (node[propValue].selected = i), i && setDefaultSelected && (node[propValue].defaultSelected = true);
      } else {
        propValue = "" + getToStringValue(propValue);
        multiple = null;
        for (i = 0; i < node.length; i++) {
          if (node[i].value === propValue) {
            node[i].selected = true;
            setDefaultSelected && (node[i].defaultSelected = true);
            return;
          }
          null !== multiple || node[i].disabled || (multiple = node[i]);
        }
        null !== multiple && (multiple.selected = true);
      }
    }
    function updateTextarea(element, value, defaultValue) {
      if (null != value && (value = "" + getToStringValue(value), value !== element.value && (element.value = value), null == defaultValue)) {
        element.defaultValue !== value && (element.defaultValue = value);
        return;
      }
      element.defaultValue = null != defaultValue ? "" + getToStringValue(defaultValue) : "";
    }
    function initTextarea(element, value, defaultValue, children) {
      if (null == value) {
        if (null != children) {
          if (null != defaultValue) throw Error(formatProdErrorMessage(92));
          if (isArrayImpl(children)) {
            if (1 < children.length) throw Error(formatProdErrorMessage(93));
            children = children[0];
          }
          defaultValue = children;
        }
        null == defaultValue && (defaultValue = "");
        value = defaultValue;
      }
      defaultValue = getToStringValue(value);
      element.defaultValue = defaultValue;
      children = element.textContent;
      children === defaultValue && "" !== children && null !== children && (element.value = children);
      track(element);
    }
    function setTextContent(node, text) {
      if (text) {
        var firstChild = node.firstChild;
        if (firstChild && firstChild === node.lastChild && 3 === firstChild.nodeType) {
          firstChild.nodeValue = text;
          return;
        }
      }
      node.textContent = text;
    }
    var unitlessNumbers = new Set(
      "animationIterationCount aspectRatio borderImageOutset borderImageSlice borderImageWidth boxFlex boxFlexGroup boxOrdinalGroup columnCount columns flex flexGrow flexPositive flexShrink flexNegative flexOrder gridArea gridRow gridRowEnd gridRowSpan gridRowStart gridColumn gridColumnEnd gridColumnSpan gridColumnStart fontWeight lineClamp lineHeight opacity order orphans scale tabSize widows zIndex zoom fillOpacity floodOpacity stopOpacity strokeDasharray strokeDashoffset strokeMiterlimit strokeOpacity strokeWidth MozAnimationIterationCount MozBoxFlex MozBoxFlexGroup MozLineClamp msAnimationIterationCount msFlex msZoom msFlexGrow msFlexNegative msFlexOrder msFlexPositive msFlexShrink msGridColumn msGridColumnSpan msGridRow msGridRowSpan WebkitAnimationIterationCount WebkitBoxFlex WebKitBoxFlexGroup WebkitBoxOrdinalGroup WebkitColumnCount WebkitColumns WebkitFlex WebkitFlexGrow WebkitFlexPositive WebkitFlexShrink WebkitLineClamp".split(
        " "
      )
    );
    function setValueForStyle(style2, styleName, value) {
      var isCustomProperty = 0 === styleName.indexOf("--");
      null == value || "boolean" === typeof value || "" === value ? isCustomProperty ? style2.setProperty(styleName, "") : "float" === styleName ? style2.cssFloat = "" : style2[styleName] = "" : isCustomProperty ? style2.setProperty(styleName, value) : "number" !== typeof value || 0 === value || unitlessNumbers.has(styleName) ? "float" === styleName ? style2.cssFloat = value : style2[styleName] = ("" + value).trim() : style2[styleName] = value + "px";
    }
    function setValueForStyles(node, styles, prevStyles) {
      if (null != styles && "object" !== typeof styles)
        throw Error(formatProdErrorMessage(62));
      node = node.style;
      if (null != prevStyles) {
        for (var styleName in prevStyles)
          !prevStyles.hasOwnProperty(styleName) || null != styles && styles.hasOwnProperty(styleName) || (0 === styleName.indexOf("--") ? node.setProperty(styleName, "") : "float" === styleName ? node.cssFloat = "" : node[styleName] = "");
        for (var styleName$16 in styles)
          styleName = styles[styleName$16], styles.hasOwnProperty(styleName$16) && prevStyles[styleName$16] !== styleName && setValueForStyle(node, styleName$16, styleName);
      } else
        for (var styleName$17 in styles)
          styles.hasOwnProperty(styleName$17) && setValueForStyle(node, styleName$17, styles[styleName$17]);
    }
    function isCustomElement(tagName) {
      if (-1 === tagName.indexOf("-")) return false;
      switch (tagName) {
        case "annotation-xml":
        case "color-profile":
        case "font-face":
        case "font-face-src":
        case "font-face-uri":
        case "font-face-format":
        case "font-face-name":
        case "missing-glyph":
          return false;
        default:
          return true;
      }
    }
    var aliases = new Map([
      ["acceptCharset", "accept-charset"],
      ["htmlFor", "for"],
      ["httpEquiv", "http-equiv"],
      ["crossOrigin", "crossorigin"],
      ["accentHeight", "accent-height"],
      ["alignmentBaseline", "alignment-baseline"],
      ["arabicForm", "arabic-form"],
      ["baselineShift", "baseline-shift"],
      ["capHeight", "cap-height"],
      ["clipPath", "clip-path"],
      ["clipRule", "clip-rule"],
      ["colorInterpolation", "color-interpolation"],
      ["colorInterpolationFilters", "color-interpolation-filters"],
      ["colorProfile", "color-profile"],
      ["colorRendering", "color-rendering"],
      ["dominantBaseline", "dominant-baseline"],
      ["enableBackground", "enable-background"],
      ["fillOpacity", "fill-opacity"],
      ["fillRule", "fill-rule"],
      ["floodColor", "flood-color"],
      ["floodOpacity", "flood-opacity"],
      ["fontFamily", "font-family"],
      ["fontSize", "font-size"],
      ["fontSizeAdjust", "font-size-adjust"],
      ["fontStretch", "font-stretch"],
      ["fontStyle", "font-style"],
      ["fontVariant", "font-variant"],
      ["fontWeight", "font-weight"],
      ["glyphName", "glyph-name"],
      ["glyphOrientationHorizontal", "glyph-orientation-horizontal"],
      ["glyphOrientationVertical", "glyph-orientation-vertical"],
      ["horizAdvX", "horiz-adv-x"],
      ["horizOriginX", "horiz-origin-x"],
      ["imageRendering", "image-rendering"],
      ["letterSpacing", "letter-spacing"],
      ["lightingColor", "lighting-color"],
      ["markerEnd", "marker-end"],
      ["markerMid", "marker-mid"],
      ["markerStart", "marker-start"],
      ["overlinePosition", "overline-position"],
      ["overlineThickness", "overline-thickness"],
      ["paintOrder", "paint-order"],
      ["panose-1", "panose-1"],
      ["pointerEvents", "pointer-events"],
      ["renderingIntent", "rendering-intent"],
      ["shapeRendering", "shape-rendering"],
      ["stopColor", "stop-color"],
      ["stopOpacity", "stop-opacity"],
      ["strikethroughPosition", "strikethrough-position"],
      ["strikethroughThickness", "strikethrough-thickness"],
      ["strokeDasharray", "stroke-dasharray"],
      ["strokeDashoffset", "stroke-dashoffset"],
      ["strokeLinecap", "stroke-linecap"],
      ["strokeLinejoin", "stroke-linejoin"],
      ["strokeMiterlimit", "stroke-miterlimit"],
      ["strokeOpacity", "stroke-opacity"],
      ["strokeWidth", "stroke-width"],
      ["textAnchor", "text-anchor"],
      ["textDecoration", "text-decoration"],
      ["textRendering", "text-rendering"],
      ["transformOrigin", "transform-origin"],
      ["underlinePosition", "underline-position"],
      ["underlineThickness", "underline-thickness"],
      ["unicodeBidi", "unicode-bidi"],
      ["unicodeRange", "unicode-range"],
      ["unitsPerEm", "units-per-em"],
      ["vAlphabetic", "v-alphabetic"],
      ["vHanging", "v-hanging"],
      ["vIdeographic", "v-ideographic"],
      ["vMathematical", "v-mathematical"],
      ["vectorEffect", "vector-effect"],
      ["vertAdvY", "vert-adv-y"],
      ["vertOriginX", "vert-origin-x"],
      ["vertOriginY", "vert-origin-y"],
      ["wordSpacing", "word-spacing"],
      ["writingMode", "writing-mode"],
      ["xmlnsXlink", "xmlns:xlink"],
      ["xHeight", "x-height"]
    ]), isJavaScriptProtocol = /^[\u0000-\u001F ]*j[\r\n\t]*a[\r\n\t]*v[\r\n\t]*a[\r\n\t]*s[\r\n\t]*c[\r\n\t]*r[\r\n\t]*i[\r\n\t]*p[\r\n\t]*t[\r\n\t]*:/i;
    function sanitizeURL(url) {
      return isJavaScriptProtocol.test("" + url) ? "javascript:throw new Error('React has blocked a javascript: URL as a security precaution.')" : url;
    }
    function noop$1() {
    }
    var currentReplayingEvent = null;
    function getEventTarget(nativeEvent) {
      nativeEvent = nativeEvent.target || nativeEvent.srcElement || window;
      nativeEvent.correspondingUseElement && (nativeEvent = nativeEvent.correspondingUseElement);
      return 3 === nativeEvent.nodeType ? nativeEvent.parentNode : nativeEvent;
    }
    var restoreTarget = null, restoreQueue = null;
    function restoreStateOfTarget(target) {
      var internalInstance = getInstanceFromNode(target);
      if (internalInstance && (target = internalInstance.stateNode)) {
        var props = target[internalPropsKey] || null;
        a: switch (target = internalInstance.stateNode, internalInstance.type) {
          case "input":
            updateInput(
              target,
              props.value,
              props.defaultValue,
              props.defaultValue,
              props.checked,
              props.defaultChecked,
              props.type,
              props.name
            );
            internalInstance = props.name;
            if ("radio" === props.type && null != internalInstance) {
              for (props = target; props.parentNode; ) props = props.parentNode;
              props = props.querySelectorAll(
                'input[name="' + escapeSelectorAttributeValueInsideDoubleQuotes(
                  "" + internalInstance
                ) + '"][type="radio"]'
              );
              for (internalInstance = 0; internalInstance < props.length; internalInstance++) {
                var otherNode = props[internalInstance];
                if (otherNode !== target && otherNode.form === target.form) {
                  var otherProps = otherNode[internalPropsKey] || null;
                  if (!otherProps) throw Error(formatProdErrorMessage(90));
                  updateInput(
                    otherNode,
                    otherProps.value,
                    otherProps.defaultValue,
                    otherProps.defaultValue,
                    otherProps.checked,
                    otherProps.defaultChecked,
                    otherProps.type,
                    otherProps.name
                  );
                }
              }
              for (internalInstance = 0; internalInstance < props.length; internalInstance++)
                otherNode = props[internalInstance], otherNode.form === target.form && updateValueIfChanged(otherNode);
            }
            break a;
          case "textarea":
            updateTextarea(target, props.value, props.defaultValue);
            break a;
          case "select":
            internalInstance = props.value, null != internalInstance && updateOptions(target, !!props.multiple, internalInstance, false);
        }
      }
    }
    var isInsideEventHandler = false;
    function batchedUpdates$1(fn, a, b) {
      if (isInsideEventHandler) return fn(a, b);
      isInsideEventHandler = true;
      try {
        var JSCompiler_inline_result = fn(a);
        return JSCompiler_inline_result;
      } finally {
        if (isInsideEventHandler = false, null !== restoreTarget || null !== restoreQueue) {
          if (flushSyncWork$1(), restoreTarget && (a = restoreTarget, fn = restoreQueue, restoreQueue = restoreTarget = null, restoreStateOfTarget(a), fn))
            for (a = 0; a < fn.length; a++) restoreStateOfTarget(fn[a]);
        }
      }
    }
    function getListener(inst, registrationName) {
      var stateNode = inst.stateNode;
      if (null === stateNode) return null;
      var props = stateNode[internalPropsKey] || null;
      if (null === props) return null;
      stateNode = props[registrationName];
      a: switch (registrationName) {
        case "onClick":
        case "onClickCapture":
        case "onDoubleClick":
        case "onDoubleClickCapture":
        case "onMouseDown":
        case "onMouseDownCapture":
        case "onMouseMove":
        case "onMouseMoveCapture":
        case "onMouseUp":
        case "onMouseUpCapture":
        case "onMouseEnter":
          (props = !props.disabled) || (inst = inst.type, props = !("button" === inst || "input" === inst || "select" === inst || "textarea" === inst));
          inst = !props;
          break a;
        default:
          inst = false;
      }
      if (inst) return null;
      if (stateNode && "function" !== typeof stateNode)
        throw Error(
          formatProdErrorMessage(231, registrationName, typeof stateNode)
        );
      return stateNode;
    }
    var canUseDOM = !("undefined" === typeof window || "undefined" === typeof window.document || "undefined" === typeof window.document.createElement), passiveBrowserEventsSupported = false;
    if (canUseDOM)
      try {
        var options = {};
        Object.defineProperty(options, "passive", {
          get: function() {
            passiveBrowserEventsSupported = true;
          }
        });
        window.addEventListener("test", options, options);
        window.removeEventListener("test", options, options);
      } catch (e) {
        passiveBrowserEventsSupported = false;
      }
    var root = null, startText = null, fallbackText = null;
    function getData() {
      if (fallbackText) return fallbackText;
      var start, startValue = startText, startLength = startValue.length, end, endValue = "value" in root ? root.value : root.textContent, endLength = endValue.length;
      for (start = 0; start < startLength && startValue[start] === endValue[start]; start++) ;
      var minEnd = startLength - start;
      for (end = 1; end <= minEnd && startValue[startLength - end] === endValue[endLength - end]; end++) ;
      return fallbackText = endValue.slice(start, 1 < end ? 1 - end : void 0);
    }
    function getEventCharCode(nativeEvent) {
      var keyCode = nativeEvent.keyCode;
      "charCode" in nativeEvent ? (nativeEvent = nativeEvent.charCode, 0 === nativeEvent && 13 === keyCode && (nativeEvent = 13)) : nativeEvent = keyCode;
      10 === nativeEvent && (nativeEvent = 13);
      return 32 <= nativeEvent || 13 === nativeEvent ? nativeEvent : 0;
    }
    function functionThatReturnsTrue() {
      return true;
    }
    function functionThatReturnsFalse() {
      return false;
    }
    function createSyntheticEvent(Interface) {
      function SyntheticBaseEvent(reactName, reactEventType, targetInst, nativeEvent, nativeEventTarget) {
        this._reactName = reactName;
        this._targetInst = targetInst;
        this.type = reactEventType;
        this.nativeEvent = nativeEvent;
        this.target = nativeEventTarget;
        this.currentTarget = null;
        for (var propName in Interface)
          Interface.hasOwnProperty(propName) && (reactName = Interface[propName], this[propName] = reactName ? reactName(nativeEvent) : nativeEvent[propName]);
        this.isDefaultPrevented = (null != nativeEvent.defaultPrevented ? nativeEvent.defaultPrevented : false === nativeEvent.returnValue) ? functionThatReturnsTrue : functionThatReturnsFalse;
        this.isPropagationStopped = functionThatReturnsFalse;
        return this;
      }
      assign(SyntheticBaseEvent.prototype, {
        preventDefault: function() {
          this.defaultPrevented = true;
          var event = this.nativeEvent;
          event && (event.preventDefault ? event.preventDefault() : "unknown" !== typeof event.returnValue && (event.returnValue = false), this.isDefaultPrevented = functionThatReturnsTrue);
        },
        stopPropagation: function() {
          var event = this.nativeEvent;
          event && (event.stopPropagation ? event.stopPropagation() : "unknown" !== typeof event.cancelBubble && (event.cancelBubble = true), this.isPropagationStopped = functionThatReturnsTrue);
        },
        persist: function() {
        },
        isPersistent: functionThatReturnsTrue
      });
      return SyntheticBaseEvent;
    }
    var EventInterface = {
      eventPhase: 0,
      bubbles: 0,
      cancelable: 0,
      timeStamp: function(event) {
        return event.timeStamp || Date.now();
      },
      defaultPrevented: 0,
      isTrusted: 0
    }, SyntheticEvent = createSyntheticEvent(EventInterface), UIEventInterface = assign({}, EventInterface, { view: 0, detail: 0 }), SyntheticUIEvent = createSyntheticEvent(UIEventInterface), lastMovementX, lastMovementY, lastMouseEvent, MouseEventInterface = assign({}, UIEventInterface, {
      screenX: 0,
      screenY: 0,
      clientX: 0,
      clientY: 0,
      pageX: 0,
      pageY: 0,
      ctrlKey: 0,
      shiftKey: 0,
      altKey: 0,
      metaKey: 0,
      getModifierState: getEventModifierState,
      button: 0,
      buttons: 0,
      relatedTarget: function(event) {
        return void 0 === event.relatedTarget ? event.fromElement === event.srcElement ? event.toElement : event.fromElement : event.relatedTarget;
      },
      movementX: function(event) {
        if ("movementX" in event) return event.movementX;
        event !== lastMouseEvent && (lastMouseEvent && "mousemove" === event.type ? (lastMovementX = event.screenX - lastMouseEvent.screenX, lastMovementY = event.screenY - lastMouseEvent.screenY) : lastMovementY = lastMovementX = 0, lastMouseEvent = event);
        return lastMovementX;
      },
      movementY: function(event) {
        return "movementY" in event ? event.movementY : lastMovementY;
      }
    }), SyntheticMouseEvent = createSyntheticEvent(MouseEventInterface), DragEventInterface = assign({}, MouseEventInterface, { dataTransfer: 0 }), SyntheticDragEvent = createSyntheticEvent(DragEventInterface), FocusEventInterface = assign({}, UIEventInterface, { relatedTarget: 0 }), SyntheticFocusEvent = createSyntheticEvent(FocusEventInterface), AnimationEventInterface = assign({}, EventInterface, {
      animationName: 0,
      elapsedTime: 0,
      pseudoElement: 0
    }), SyntheticAnimationEvent = createSyntheticEvent(AnimationEventInterface), ClipboardEventInterface = assign({}, EventInterface, {
      clipboardData: function(event) {
        return "clipboardData" in event ? event.clipboardData : window.clipboardData;
      }
    }), SyntheticClipboardEvent = createSyntheticEvent(ClipboardEventInterface), CompositionEventInterface = assign({}, EventInterface, { data: 0 }), SyntheticCompositionEvent = createSyntheticEvent(CompositionEventInterface), normalizeKey = {
      Esc: "Escape",
      Spacebar: " ",
      Left: "ArrowLeft",
      Up: "ArrowUp",
      Right: "ArrowRight",
      Down: "ArrowDown",
      Del: "Delete",
      Win: "OS",
      Menu: "ContextMenu",
      Apps: "ContextMenu",
      Scroll: "ScrollLock",
      MozPrintableKey: "Unidentified"
    }, translateToKey = {
      8: "Backspace",
      9: "Tab",
      12: "Clear",
      13: "Enter",
      16: "Shift",
      17: "Control",
      18: "Alt",
      19: "Pause",
      20: "CapsLock",
      27: "Escape",
      32: " ",
      33: "PageUp",
      34: "PageDown",
      35: "End",
      36: "Home",
      37: "ArrowLeft",
      38: "ArrowUp",
      39: "ArrowRight",
      40: "ArrowDown",
      45: "Insert",
      46: "Delete",
      112: "F1",
      113: "F2",
      114: "F3",
      115: "F4",
      116: "F5",
      117: "F6",
      118: "F7",
      119: "F8",
      120: "F9",
      121: "F10",
      122: "F11",
      123: "F12",
      144: "NumLock",
      145: "ScrollLock",
      224: "Meta"
    }, modifierKeyToProp = {
      Alt: "altKey",
      Control: "ctrlKey",
      Meta: "metaKey",
      Shift: "shiftKey"
    };
    function modifierStateGetter(keyArg) {
      var nativeEvent = this.nativeEvent;
      return nativeEvent.getModifierState ? nativeEvent.getModifierState(keyArg) : (keyArg = modifierKeyToProp[keyArg]) ? !!nativeEvent[keyArg] : false;
    }
    function getEventModifierState() {
      return modifierStateGetter;
    }
    var KeyboardEventInterface = assign({}, UIEventInterface, {
      key: function(nativeEvent) {
        if (nativeEvent.key) {
          var key = normalizeKey[nativeEvent.key] || nativeEvent.key;
          if ("Unidentified" !== key) return key;
        }
        return "keypress" === nativeEvent.type ? (nativeEvent = getEventCharCode(nativeEvent), 13 === nativeEvent ? "Enter" : String.fromCharCode(nativeEvent)) : "keydown" === nativeEvent.type || "keyup" === nativeEvent.type ? translateToKey[nativeEvent.keyCode] || "Unidentified" : "";
      },
      code: 0,
      location: 0,
      ctrlKey: 0,
      shiftKey: 0,
      altKey: 0,
      metaKey: 0,
      repeat: 0,
      locale: 0,
      getModifierState: getEventModifierState,
      charCode: function(event) {
        return "keypress" === event.type ? getEventCharCode(event) : 0;
      },
      keyCode: function(event) {
        return "keydown" === event.type || "keyup" === event.type ? event.keyCode : 0;
      },
      which: function(event) {
        return "keypress" === event.type ? getEventCharCode(event) : "keydown" === event.type || "keyup" === event.type ? event.keyCode : 0;
      }
    }), SyntheticKeyboardEvent = createSyntheticEvent(KeyboardEventInterface), PointerEventInterface = assign({}, MouseEventInterface, {
      pointerId: 0,
      width: 0,
      height: 0,
      pressure: 0,
      tangentialPressure: 0,
      tiltX: 0,
      tiltY: 0,
      twist: 0,
      pointerType: 0,
      isPrimary: 0
    }), SyntheticPointerEvent = createSyntheticEvent(PointerEventInterface), TouchEventInterface = assign({}, UIEventInterface, {
      touches: 0,
      targetTouches: 0,
      changedTouches: 0,
      altKey: 0,
      metaKey: 0,
      ctrlKey: 0,
      shiftKey: 0,
      getModifierState: getEventModifierState
    }), SyntheticTouchEvent = createSyntheticEvent(TouchEventInterface), TransitionEventInterface = assign({}, EventInterface, {
      propertyName: 0,
      elapsedTime: 0,
      pseudoElement: 0
    }), SyntheticTransitionEvent = createSyntheticEvent(TransitionEventInterface), WheelEventInterface = assign({}, MouseEventInterface, {
      deltaX: function(event) {
        return "deltaX" in event ? event.deltaX : "wheelDeltaX" in event ? -event.wheelDeltaX : 0;
      },
      deltaY: function(event) {
        return "deltaY" in event ? event.deltaY : "wheelDeltaY" in event ? -event.wheelDeltaY : "wheelDelta" in event ? -event.wheelDelta : 0;
      },
      deltaZ: 0,
      deltaMode: 0
    }), SyntheticWheelEvent = createSyntheticEvent(WheelEventInterface), ToggleEventInterface = assign({}, EventInterface, {
      newState: 0,
      oldState: 0
    }), SyntheticToggleEvent = createSyntheticEvent(ToggleEventInterface), END_KEYCODES = [9, 13, 27, 32], canUseCompositionEvent = canUseDOM && "CompositionEvent" in window, documentMode = null;
    canUseDOM && "documentMode" in document && (documentMode = document.documentMode);
    var canUseTextInputEvent = canUseDOM && "TextEvent" in window && !documentMode, useFallbackCompositionData = canUseDOM && (!canUseCompositionEvent || documentMode && 8 < documentMode && 11 >= documentMode), SPACEBAR_CHAR = String.fromCharCode(32), hasSpaceKeypress = false;
    function isFallbackCompositionEnd(domEventName, nativeEvent) {
      switch (domEventName) {
        case "keyup":
          return -1 !== END_KEYCODES.indexOf(nativeEvent.keyCode);
        case "keydown":
          return 229 !== nativeEvent.keyCode;
        case "keypress":
        case "mousedown":
        case "focusout":
          return true;
        default:
          return false;
      }
    }
    function getDataFromCustomEvent(nativeEvent) {
      nativeEvent = nativeEvent.detail;
      return "object" === typeof nativeEvent && "data" in nativeEvent ? nativeEvent.data : null;
    }
    var isComposing = false;
    function getNativeBeforeInputChars(domEventName, nativeEvent) {
      switch (domEventName) {
        case "compositionend":
          return getDataFromCustomEvent(nativeEvent);
        case "keypress":
          if (32 !== nativeEvent.which) return null;
          hasSpaceKeypress = true;
          return SPACEBAR_CHAR;
        case "textInput":
          return domEventName = nativeEvent.data, domEventName === SPACEBAR_CHAR && hasSpaceKeypress ? null : domEventName;
        default:
          return null;
      }
    }
    function getFallbackBeforeInputChars(domEventName, nativeEvent) {
      if (isComposing)
        return "compositionend" === domEventName || !canUseCompositionEvent && isFallbackCompositionEnd(domEventName, nativeEvent) ? (domEventName = getData(), fallbackText = startText = root = null, isComposing = false, domEventName) : null;
      switch (domEventName) {
        case "paste":
          return null;
        case "keypress":
          if (!(nativeEvent.ctrlKey || nativeEvent.altKey || nativeEvent.metaKey) || nativeEvent.ctrlKey && nativeEvent.altKey) {
            if (nativeEvent.char && 1 < nativeEvent.char.length)
              return nativeEvent.char;
            if (nativeEvent.which) return String.fromCharCode(nativeEvent.which);
          }
          return null;
        case "compositionend":
          return useFallbackCompositionData && "ko" !== nativeEvent.locale ? null : nativeEvent.data;
        default:
          return null;
      }
    }
    var supportedInputTypes = {
      color: true,
      date: true,
      datetime: true,
      "datetime-local": true,
      email: true,
      month: true,
      number: true,
      password: true,
      range: true,
      search: true,
      tel: true,
      text: true,
      time: true,
      url: true,
      week: true
    };
    function isTextInputElement(elem) {
      var nodeName = elem && elem.nodeName && elem.nodeName.toLowerCase();
      return "input" === nodeName ? !!supportedInputTypes[elem.type] : "textarea" === nodeName ? true : false;
    }
    function createAndAccumulateChangeEvent(dispatchQueue, inst, nativeEvent, target) {
      restoreTarget ? restoreQueue ? restoreQueue.push(target) : restoreQueue = [target] : restoreTarget = target;
      inst = accumulateTwoPhaseListeners(inst, "onChange");
      0 < inst.length && (nativeEvent = new SyntheticEvent(
        "onChange",
        "change",
        null,
        nativeEvent,
        target
      ), dispatchQueue.push({ event: nativeEvent, listeners: inst }));
    }
    var activeElement$1 = null, activeElementInst$1 = null;
    function runEventInBatch(dispatchQueue) {
      processDispatchQueue(dispatchQueue, 0);
    }
    function getInstIfValueChanged(targetInst) {
      var targetNode = getNodeFromInstance(targetInst);
      if (updateValueIfChanged(targetNode)) return targetInst;
    }
    function getTargetInstForChangeEvent(domEventName, targetInst) {
      if ("change" === domEventName) return targetInst;
    }
    var isInputEventSupported = false;
    if (canUseDOM) {
      var JSCompiler_inline_result$jscomp$286;
      if (canUseDOM) {
        var isSupported$jscomp$inline_427 = "oninput" in document;
        if (!isSupported$jscomp$inline_427) {
          var element$jscomp$inline_428 = document.createElement("div");
          element$jscomp$inline_428.setAttribute("oninput", "return;");
          isSupported$jscomp$inline_427 = "function" === typeof element$jscomp$inline_428.oninput;
        }
        JSCompiler_inline_result$jscomp$286 = isSupported$jscomp$inline_427;
      } else JSCompiler_inline_result$jscomp$286 = false;
      isInputEventSupported = JSCompiler_inline_result$jscomp$286 && (!document.documentMode || 9 < document.documentMode);
    }
    function stopWatchingForValueChange() {
      activeElement$1 && (activeElement$1.detachEvent("onpropertychange", handlePropertyChange), activeElementInst$1 = activeElement$1 = null);
    }
    function handlePropertyChange(nativeEvent) {
      if ("value" === nativeEvent.propertyName && getInstIfValueChanged(activeElementInst$1)) {
        var dispatchQueue = [];
        createAndAccumulateChangeEvent(
          dispatchQueue,
          activeElementInst$1,
          nativeEvent,
          getEventTarget(nativeEvent)
        );
        batchedUpdates$1(runEventInBatch, dispatchQueue);
      }
    }
    function handleEventsForInputEventPolyfill(domEventName, target, targetInst) {
      "focusin" === domEventName ? (stopWatchingForValueChange(), activeElement$1 = target, activeElementInst$1 = targetInst, activeElement$1.attachEvent("onpropertychange", handlePropertyChange)) : "focusout" === domEventName && stopWatchingForValueChange();
    }
    function getTargetInstForInputEventPolyfill(domEventName) {
      if ("selectionchange" === domEventName || "keyup" === domEventName || "keydown" === domEventName)
        return getInstIfValueChanged(activeElementInst$1);
    }
    function getTargetInstForClickEvent(domEventName, targetInst) {
      if ("click" === domEventName) return getInstIfValueChanged(targetInst);
    }
    function getTargetInstForInputOrChangeEvent(domEventName, targetInst) {
      if ("input" === domEventName || "change" === domEventName)
        return getInstIfValueChanged(targetInst);
    }
    function is(x, y) {
      return x === y && (0 !== x || 1 / x === 1 / y) || x !== x && y !== y;
    }
    var objectIs = "function" === typeof Object.is ? Object.is : is;
    function shallowEqual(objA, objB) {
      if (objectIs(objA, objB)) return true;
      if ("object" !== typeof objA || null === objA || "object" !== typeof objB || null === objB)
        return false;
      var keysA = Object.keys(objA), keysB = Object.keys(objB);
      if (keysA.length !== keysB.length) return false;
      for (keysB = 0; keysB < keysA.length; keysB++) {
        var currentKey = keysA[keysB];
        if (!hasOwnProperty.call(objB, currentKey) || !objectIs(objA[currentKey], objB[currentKey]))
          return false;
      }
      return true;
    }
    function getLeafNode(node) {
      for (; node && node.firstChild; ) node = node.firstChild;
      return node;
    }
    function getNodeForCharacterOffset(root2, offset) {
      var node = getLeafNode(root2);
      root2 = 0;
      for (var nodeEnd; node; ) {
        if (3 === node.nodeType) {
          nodeEnd = root2 + node.textContent.length;
          if (root2 <= offset && nodeEnd >= offset)
            return { node, offset: offset - root2 };
          root2 = nodeEnd;
        }
        a: {
          for (; node; ) {
            if (node.nextSibling) {
              node = node.nextSibling;
              break a;
            }
            node = node.parentNode;
          }
          node = void 0;
        }
        node = getLeafNode(node);
      }
    }
    function containsNode(outerNode, innerNode) {
      return outerNode && innerNode ? outerNode === innerNode ? true : outerNode && 3 === outerNode.nodeType ? false : innerNode && 3 === innerNode.nodeType ? containsNode(outerNode, innerNode.parentNode) : "contains" in outerNode ? outerNode.contains(innerNode) : outerNode.compareDocumentPosition ? !!(outerNode.compareDocumentPosition(innerNode) & 16) : false : false;
    }
    function getActiveElementDeep(containerInfo) {
      containerInfo = null != containerInfo && null != containerInfo.ownerDocument && null != containerInfo.ownerDocument.defaultView ? containerInfo.ownerDocument.defaultView : window;
      for (var element = getActiveElement(containerInfo.document); element instanceof containerInfo.HTMLIFrameElement; ) {
        try {
          var JSCompiler_inline_result = "string" === typeof element.contentWindow.location.href;
        } catch (err) {
          JSCompiler_inline_result = false;
        }
        if (JSCompiler_inline_result) containerInfo = element.contentWindow;
        else break;
        element = getActiveElement(containerInfo.document);
      }
      return element;
    }
    function hasSelectionCapabilities(elem) {
      var nodeName = elem && elem.nodeName && elem.nodeName.toLowerCase();
      return nodeName && ("input" === nodeName && ("text" === elem.type || "search" === elem.type || "tel" === elem.type || "url" === elem.type || "password" === elem.type) || "textarea" === nodeName || "true" === elem.contentEditable);
    }
    var skipSelectionChangeEvent = canUseDOM && "documentMode" in document && 11 >= document.documentMode, activeElement = null, activeElementInst = null, lastSelection = null, mouseDown = false;
    function constructSelectEvent(dispatchQueue, nativeEvent, nativeEventTarget) {
      var doc = nativeEventTarget.window === nativeEventTarget ? nativeEventTarget.document : 9 === nativeEventTarget.nodeType ? nativeEventTarget : nativeEventTarget.ownerDocument;
      mouseDown || null == activeElement || activeElement !== getActiveElement(doc) || (doc = activeElement, "selectionStart" in doc && hasSelectionCapabilities(doc) ? doc = { start: doc.selectionStart, end: doc.selectionEnd } : (doc = (doc.ownerDocument && doc.ownerDocument.defaultView || window).getSelection(), doc = {
        anchorNode: doc.anchorNode,
        anchorOffset: doc.anchorOffset,
        focusNode: doc.focusNode,
        focusOffset: doc.focusOffset
      }), lastSelection && shallowEqual(lastSelection, doc) || (lastSelection = doc, doc = accumulateTwoPhaseListeners(activeElementInst, "onSelect"), 0 < doc.length && (nativeEvent = new SyntheticEvent(
        "onSelect",
        "select",
        null,
        nativeEvent,
        nativeEventTarget
      ), dispatchQueue.push({ event: nativeEvent, listeners: doc }), nativeEvent.target = activeElement)));
    }
    function makePrefixMap(styleProp, eventName) {
      var prefixes = {};
      prefixes[styleProp.toLowerCase()] = eventName.toLowerCase();
      prefixes["Webkit" + styleProp] = "webkit" + eventName;
      prefixes["Moz" + styleProp] = "moz" + eventName;
      return prefixes;
    }
    var vendorPrefixes = {
      animationend: makePrefixMap("Animation", "AnimationEnd"),
      animationiteration: makePrefixMap("Animation", "AnimationIteration"),
      animationstart: makePrefixMap("Animation", "AnimationStart"),
      transitionrun: makePrefixMap("Transition", "TransitionRun"),
      transitionstart: makePrefixMap("Transition", "TransitionStart"),
      transitioncancel: makePrefixMap("Transition", "TransitionCancel"),
      transitionend: makePrefixMap("Transition", "TransitionEnd")
    }, prefixedEventNames = {}, style = {};
    canUseDOM && (style = document.createElement("div").style, "AnimationEvent" in window || (delete vendorPrefixes.animationend.animation, delete vendorPrefixes.animationiteration.animation, delete vendorPrefixes.animationstart.animation), "TransitionEvent" in window || delete vendorPrefixes.transitionend.transition);
    function getVendorPrefixedEventName(eventName) {
      if (prefixedEventNames[eventName]) return prefixedEventNames[eventName];
      if (!vendorPrefixes[eventName]) return eventName;
      var prefixMap = vendorPrefixes[eventName], styleProp;
      for (styleProp in prefixMap)
        if (prefixMap.hasOwnProperty(styleProp) && styleProp in style)
          return prefixedEventNames[eventName] = prefixMap[styleProp];
      return eventName;
    }
    var ANIMATION_END = getVendorPrefixedEventName("animationend"), ANIMATION_ITERATION = getVendorPrefixedEventName("animationiteration"), ANIMATION_START = getVendorPrefixedEventName("animationstart"), TRANSITION_RUN = getVendorPrefixedEventName("transitionrun"), TRANSITION_START = getVendorPrefixedEventName("transitionstart"), TRANSITION_CANCEL = getVendorPrefixedEventName("transitioncancel"), TRANSITION_END = getVendorPrefixedEventName("transitionend"), topLevelEventsToReactNames = new Map(), simpleEventPluginEvents = "abort auxClick beforeToggle cancel canPlay canPlayThrough click close contextMenu copy cut drag dragEnd dragEnter dragExit dragLeave dragOver dragStart drop durationChange emptied encrypted ended error gotPointerCapture input invalid keyDown keyPress keyUp load loadedData loadedMetadata loadStart lostPointerCapture mouseDown mouseMove mouseOut mouseOver mouseUp paste pause play playing pointerCancel pointerDown pointerMove pointerOut pointerOver pointerUp progress rateChange reset resize seeked seeking stalled submit suspend timeUpdate touchCancel touchEnd touchStart volumeChange scroll toggle touchMove waiting wheel".split(
      " "
    );
    simpleEventPluginEvents.push("scrollEnd");
    function registerSimpleEvent(domEventName, reactName) {
      topLevelEventsToReactNames.set(domEventName, reactName);
      registerTwoPhaseEvent(reactName, [domEventName]);
    }
    var reportGlobalError = "function" === typeof reportError ? reportError : function(error) {
      if ("object" === typeof window && "function" === typeof window.ErrorEvent) {
        var event = new window.ErrorEvent("error", {
          bubbles: true,
          cancelable: true,
          message: "object" === typeof error && null !== error && "string" === typeof error.message ? String(error.message) : String(error),
          error
        });
        if (!window.dispatchEvent(event)) return;
      } else if ("object" === typeof process && "function" === typeof process.emit) {
        process.emit("uncaughtException", error);
        return;
      }
      console.error(error);
    }, concurrentQueues = [], concurrentQueuesIndex = 0, concurrentlyUpdatedLanes = 0;
    function finishQueueingConcurrentUpdates() {
      for (var endIndex = concurrentQueuesIndex, i = concurrentlyUpdatedLanes = concurrentQueuesIndex = 0; i < endIndex; ) {
        var fiber = concurrentQueues[i];
        concurrentQueues[i++] = null;
        var queue = concurrentQueues[i];
        concurrentQueues[i++] = null;
        var update = concurrentQueues[i];
        concurrentQueues[i++] = null;
        var lane = concurrentQueues[i];
        concurrentQueues[i++] = null;
        if (null !== queue && null !== update) {
          var pending = queue.pending;
          null === pending ? update.next = update : (update.next = pending.next, pending.next = update);
          queue.pending = update;
        }
        0 !== lane && markUpdateLaneFromFiberToRoot(fiber, update, lane);
      }
    }
    function enqueueUpdate$1(fiber, queue, update, lane) {
      concurrentQueues[concurrentQueuesIndex++] = fiber;
      concurrentQueues[concurrentQueuesIndex++] = queue;
      concurrentQueues[concurrentQueuesIndex++] = update;
      concurrentQueues[concurrentQueuesIndex++] = lane;
      concurrentlyUpdatedLanes |= lane;
      fiber.lanes |= lane;
      fiber = fiber.alternate;
      null !== fiber && (fiber.lanes |= lane);
    }
    function enqueueConcurrentHookUpdate(fiber, queue, update, lane) {
      enqueueUpdate$1(fiber, queue, update, lane);
      return getRootForUpdatedFiber(fiber);
    }
    function enqueueConcurrentRenderForLane(fiber, lane) {
      enqueueUpdate$1(fiber, null, null, lane);
      return getRootForUpdatedFiber(fiber);
    }
    function markUpdateLaneFromFiberToRoot(sourceFiber, update, lane) {
      sourceFiber.lanes |= lane;
      var alternate = sourceFiber.alternate;
      null !== alternate && (alternate.lanes |= lane);
      for (var isHidden = false, parent = sourceFiber.return; null !== parent; )
        parent.childLanes |= lane, alternate = parent.alternate, null !== alternate && (alternate.childLanes |= lane), 22 === parent.tag && (sourceFiber = parent.stateNode, null === sourceFiber || sourceFiber._visibility & 1 || (isHidden = true)), sourceFiber = parent, parent = parent.return;
      return 3 === sourceFiber.tag ? (parent = sourceFiber.stateNode, isHidden && null !== update && (isHidden = 31 - clz32(lane), sourceFiber = parent.hiddenUpdates, alternate = sourceFiber[isHidden], null === alternate ? sourceFiber[isHidden] = [update] : alternate.push(update), update.lane = lane | 536870912), parent) : null;
    }
    function getRootForUpdatedFiber(sourceFiber) {
      if (50 < nestedUpdateCount)
        throw nestedUpdateCount = 0, rootWithNestedUpdates = null, Error(formatProdErrorMessage(185));
      for (var parent = sourceFiber.return; null !== parent; )
        sourceFiber = parent, parent = sourceFiber.return;
      return 3 === sourceFiber.tag ? sourceFiber.stateNode : null;
    }
    var emptyContextObject = {};
    function FiberNode(tag, pendingProps, key, mode) {
      this.tag = tag;
      this.key = key;
      this.sibling = this.child = this.return = this.stateNode = this.type = this.elementType = null;
      this.index = 0;
      this.refCleanup = this.ref = null;
      this.pendingProps = pendingProps;
      this.dependencies = this.memoizedState = this.updateQueue = this.memoizedProps = null;
      this.mode = mode;
      this.subtreeFlags = this.flags = 0;
      this.deletions = null;
      this.childLanes = this.lanes = 0;
      this.alternate = null;
    }
    function createFiberImplClass(tag, pendingProps, key, mode) {
      return new FiberNode(tag, pendingProps, key, mode);
    }
    function shouldConstruct(Component) {
      Component = Component.prototype;
      return !(!Component || !Component.isReactComponent);
    }
    function createWorkInProgress(current, pendingProps) {
      var workInProgress2 = current.alternate;
      null === workInProgress2 ? (workInProgress2 = createFiberImplClass(
        current.tag,
        pendingProps,
        current.key,
        current.mode
      ), workInProgress2.elementType = current.elementType, workInProgress2.type = current.type, workInProgress2.stateNode = current.stateNode, workInProgress2.alternate = current, current.alternate = workInProgress2) : (workInProgress2.pendingProps = pendingProps, workInProgress2.type = current.type, workInProgress2.flags = 0, workInProgress2.subtreeFlags = 0, workInProgress2.deletions = null);
      workInProgress2.flags = current.flags & 65011712;
      workInProgress2.childLanes = current.childLanes;
      workInProgress2.lanes = current.lanes;
      workInProgress2.child = current.child;
      workInProgress2.memoizedProps = current.memoizedProps;
      workInProgress2.memoizedState = current.memoizedState;
      workInProgress2.updateQueue = current.updateQueue;
      pendingProps = current.dependencies;
      workInProgress2.dependencies = null === pendingProps ? null : { lanes: pendingProps.lanes, firstContext: pendingProps.firstContext };
      workInProgress2.sibling = current.sibling;
      workInProgress2.index = current.index;
      workInProgress2.ref = current.ref;
      workInProgress2.refCleanup = current.refCleanup;
      return workInProgress2;
    }
    function resetWorkInProgress(workInProgress2, renderLanes2) {
      workInProgress2.flags &= 65011714;
      var current = workInProgress2.alternate;
      null === current ? (workInProgress2.childLanes = 0, workInProgress2.lanes = renderLanes2, workInProgress2.child = null, workInProgress2.subtreeFlags = 0, workInProgress2.memoizedProps = null, workInProgress2.memoizedState = null, workInProgress2.updateQueue = null, workInProgress2.dependencies = null, workInProgress2.stateNode = null) : (workInProgress2.childLanes = current.childLanes, workInProgress2.lanes = current.lanes, workInProgress2.child = current.child, workInProgress2.subtreeFlags = 0, workInProgress2.deletions = null, workInProgress2.memoizedProps = current.memoizedProps, workInProgress2.memoizedState = current.memoizedState, workInProgress2.updateQueue = current.updateQueue, workInProgress2.type = current.type, renderLanes2 = current.dependencies, workInProgress2.dependencies = null === renderLanes2 ? null : {
        lanes: renderLanes2.lanes,
        firstContext: renderLanes2.firstContext
      });
      return workInProgress2;
    }
    function createFiberFromTypeAndProps(type, key, pendingProps, owner, mode, lanes) {
      var fiberTag = 0;
      owner = type;
      if ("function" === typeof type) shouldConstruct(type) && (fiberTag = 1);
      else if ("string" === typeof type)
        fiberTag = isHostHoistableType(
          type,
          pendingProps,
          contextStackCursor.current
        ) ? 26 : "html" === type || "head" === type || "body" === type ? 27 : 5;
      else
        a: switch (type) {
          case REACT_ACTIVITY_TYPE:
            return type = createFiberImplClass(31, pendingProps, key, mode), type.elementType = REACT_ACTIVITY_TYPE, type.lanes = lanes, type;
          case REACT_FRAGMENT_TYPE:
            return createFiberFromFragment(pendingProps.children, mode, lanes, key);
          case REACT_STRICT_MODE_TYPE:
            fiberTag = 8;
            mode |= 24;
            break;
          case REACT_PROFILER_TYPE:
            return type = createFiberImplClass(12, pendingProps, key, mode | 2), type.elementType = REACT_PROFILER_TYPE, type.lanes = lanes, type;
          case REACT_SUSPENSE_TYPE:
            return type = createFiberImplClass(13, pendingProps, key, mode), type.elementType = REACT_SUSPENSE_TYPE, type.lanes = lanes, type;
          case REACT_SUSPENSE_LIST_TYPE:
            return type = createFiberImplClass(19, pendingProps, key, mode), type.elementType = REACT_SUSPENSE_LIST_TYPE, type.lanes = lanes, type;
          default:
            if ("object" === typeof type && null !== type)
              switch (type.$$typeof) {
                case REACT_CONTEXT_TYPE:
                  fiberTag = 10;
                  break a;
                case REACT_CONSUMER_TYPE:
                  fiberTag = 9;
                  break a;
                case REACT_FORWARD_REF_TYPE:
                  fiberTag = 11;
                  break a;
                case REACT_MEMO_TYPE:
                  fiberTag = 14;
                  break a;
                case REACT_LAZY_TYPE:
                  fiberTag = 16;
                  owner = null;
                  break a;
              }
            fiberTag = 29;
            pendingProps = Error(
              formatProdErrorMessage(130, null === type ? "null" : typeof type, "")
            );
            owner = null;
        }
      key = createFiberImplClass(fiberTag, pendingProps, key, mode);
      key.elementType = type;
      key.type = owner;
      key.lanes = lanes;
      return key;
    }
    function createFiberFromFragment(elements, mode, lanes, key) {
      elements = createFiberImplClass(7, elements, key, mode);
      elements.lanes = lanes;
      return elements;
    }
    function createFiberFromText(content, mode, lanes) {
      content = createFiberImplClass(6, content, null, mode);
      content.lanes = lanes;
      return content;
    }
    function createFiberFromDehydratedFragment(dehydratedNode) {
      var fiber = createFiberImplClass(18, null, null, 0);
      fiber.stateNode = dehydratedNode;
      return fiber;
    }
    function createFiberFromPortal(portal, mode, lanes) {
      mode = createFiberImplClass(
        4,
        null !== portal.children ? portal.children : [],
        portal.key,
        mode
      );
      mode.lanes = lanes;
      mode.stateNode = {
        containerInfo: portal.containerInfo,
        pendingChildren: null,
        implementation: portal.implementation
      };
      return mode;
    }
    var CapturedStacks = new WeakMap();
    function createCapturedValueAtFiber(value, source) {
      if ("object" === typeof value && null !== value) {
        var existing = CapturedStacks.get(value);
        if (void 0 !== existing) return existing;
        source = {
          value,
          source,
          stack: getStackByFiberInDevAndProd(source)
        };
        CapturedStacks.set(value, source);
        return source;
      }
      return {
        value,
        source,
        stack: getStackByFiberInDevAndProd(source)
      };
    }
    var forkStack = [], forkStackIndex = 0, treeForkProvider = null, treeForkCount = 0, idStack = [], idStackIndex = 0, treeContextProvider = null, treeContextId = 1, treeContextOverflow = "";
    function pushTreeFork(workInProgress2, totalChildren) {
      forkStack[forkStackIndex++] = treeForkCount;
      forkStack[forkStackIndex++] = treeForkProvider;
      treeForkProvider = workInProgress2;
      treeForkCount = totalChildren;
    }
    function pushTreeId(workInProgress2, totalChildren, index2) {
      idStack[idStackIndex++] = treeContextId;
      idStack[idStackIndex++] = treeContextOverflow;
      idStack[idStackIndex++] = treeContextProvider;
      treeContextProvider = workInProgress2;
      var baseIdWithLeadingBit = treeContextId;
      workInProgress2 = treeContextOverflow;
      var baseLength = 32 - clz32(baseIdWithLeadingBit) - 1;
      baseIdWithLeadingBit &= ~(1 << baseLength);
      index2 += 1;
      var length = 32 - clz32(totalChildren) + baseLength;
      if (30 < length) {
        var numberOfOverflowBits = baseLength - baseLength % 5;
        length = (baseIdWithLeadingBit & (1 << numberOfOverflowBits) - 1).toString(32);
        baseIdWithLeadingBit >>= numberOfOverflowBits;
        baseLength -= numberOfOverflowBits;
        treeContextId = 1 << 32 - clz32(totalChildren) + baseLength | index2 << baseLength | baseIdWithLeadingBit;
        treeContextOverflow = length + workInProgress2;
      } else
        treeContextId = 1 << length | index2 << baseLength | baseIdWithLeadingBit, treeContextOverflow = workInProgress2;
    }
    function pushMaterializedTreeId(workInProgress2) {
      null !== workInProgress2.return && (pushTreeFork(workInProgress2, 1), pushTreeId(workInProgress2, 1, 0));
    }
    function popTreeContext(workInProgress2) {
      for (; workInProgress2 === treeForkProvider; )
        treeForkProvider = forkStack[--forkStackIndex], forkStack[forkStackIndex] = null, treeForkCount = forkStack[--forkStackIndex], forkStack[forkStackIndex] = null;
      for (; workInProgress2 === treeContextProvider; )
        treeContextProvider = idStack[--idStackIndex], idStack[idStackIndex] = null, treeContextOverflow = idStack[--idStackIndex], idStack[idStackIndex] = null, treeContextId = idStack[--idStackIndex], idStack[idStackIndex] = null;
    }
    function restoreSuspendedTreeContext(workInProgress2, suspendedContext) {
      idStack[idStackIndex++] = treeContextId;
      idStack[idStackIndex++] = treeContextOverflow;
      idStack[idStackIndex++] = treeContextProvider;
      treeContextId = suspendedContext.id;
      treeContextOverflow = suspendedContext.overflow;
      treeContextProvider = workInProgress2;
    }
    var hydrationParentFiber = null, nextHydratableInstance = null, isHydrating = false, hydrationErrors = null, rootOrSingletonContext = false, HydrationMismatchException = Error(formatProdErrorMessage(519));
    function throwOnHydrationMismatch(fiber) {
      var error = Error(
        formatProdErrorMessage(
          418,
          1 < arguments.length && void 0 !== arguments[1] && arguments[1] ? "text" : "HTML",
          ""
        )
      );
      queueHydrationError(createCapturedValueAtFiber(error, fiber));
      throw HydrationMismatchException;
    }
    function prepareToHydrateHostInstance(fiber) {
      var instance = fiber.stateNode, type = fiber.type, props = fiber.memoizedProps;
      instance[internalInstanceKey] = fiber;
      instance[internalPropsKey] = props;
      switch (type) {
        case "dialog":
          listenToNonDelegatedEvent("cancel", instance);
          listenToNonDelegatedEvent("close", instance);
          break;
        case "iframe":
        case "object":
        case "embed":
          listenToNonDelegatedEvent("load", instance);
          break;
        case "video":
        case "audio":
          for (type = 0; type < mediaEventTypes.length; type++)
            listenToNonDelegatedEvent(mediaEventTypes[type], instance);
          break;
        case "source":
          listenToNonDelegatedEvent("error", instance);
          break;
        case "img":
        case "image":
        case "link":
          listenToNonDelegatedEvent("error", instance);
          listenToNonDelegatedEvent("load", instance);
          break;
        case "details":
          listenToNonDelegatedEvent("toggle", instance);
          break;
        case "input":
          listenToNonDelegatedEvent("invalid", instance);
          initInput(
            instance,
            props.value,
            props.defaultValue,
            props.checked,
            props.defaultChecked,
            props.type,
            props.name,
            true
          );
          break;
        case "select":
          listenToNonDelegatedEvent("invalid", instance);
          break;
        case "textarea":
          listenToNonDelegatedEvent("invalid", instance), initTextarea(instance, props.value, props.defaultValue, props.children);
      }
      type = props.children;
      "string" !== typeof type && "number" !== typeof type && "bigint" !== typeof type || instance.textContent === "" + type || true === props.suppressHydrationWarning || checkForUnmatchedText(instance.textContent, type) ? (null != props.popover && (listenToNonDelegatedEvent("beforetoggle", instance), listenToNonDelegatedEvent("toggle", instance)), null != props.onScroll && listenToNonDelegatedEvent("scroll", instance), null != props.onScrollEnd && listenToNonDelegatedEvent("scrollend", instance), null != props.onClick && (instance.onclick = noop$1), instance = true) : instance = false;
      instance || throwOnHydrationMismatch(fiber, true);
    }
    function popToNextHostParent(fiber) {
      for (hydrationParentFiber = fiber.return; hydrationParentFiber; )
        switch (hydrationParentFiber.tag) {
          case 5:
          case 31:
          case 13:
            rootOrSingletonContext = false;
            return;
          case 27:
          case 3:
            rootOrSingletonContext = true;
            return;
          default:
            hydrationParentFiber = hydrationParentFiber.return;
        }
    }
    function popHydrationState(fiber) {
      if (fiber !== hydrationParentFiber) return false;
      if (!isHydrating) return popToNextHostParent(fiber), isHydrating = true, false;
      var tag = fiber.tag, JSCompiler_temp;
      if (JSCompiler_temp = 3 !== tag && 27 !== tag) {
        if (JSCompiler_temp = 5 === tag)
          JSCompiler_temp = fiber.type, JSCompiler_temp = !("form" !== JSCompiler_temp && "button" !== JSCompiler_temp) || shouldSetTextContent(fiber.type, fiber.memoizedProps);
        JSCompiler_temp = !JSCompiler_temp;
      }
      JSCompiler_temp && nextHydratableInstance && throwOnHydrationMismatch(fiber);
      popToNextHostParent(fiber);
      if (13 === tag) {
        fiber = fiber.memoizedState;
        fiber = null !== fiber ? fiber.dehydrated : null;
        if (!fiber) throw Error(formatProdErrorMessage(317));
        nextHydratableInstance = getNextHydratableInstanceAfterHydrationBoundary(fiber);
      } else if (31 === tag) {
        fiber = fiber.memoizedState;
        fiber = null !== fiber ? fiber.dehydrated : null;
        if (!fiber) throw Error(formatProdErrorMessage(317));
        nextHydratableInstance = getNextHydratableInstanceAfterHydrationBoundary(fiber);
      } else
        27 === tag ? (tag = nextHydratableInstance, isSingletonScope(fiber.type) ? (fiber = previousHydratableOnEnteringScopedSingleton, previousHydratableOnEnteringScopedSingleton = null, nextHydratableInstance = fiber) : nextHydratableInstance = tag) : nextHydratableInstance = hydrationParentFiber ? getNextHydratable(fiber.stateNode.nextSibling) : null;
      return true;
    }
    function resetHydrationState() {
      nextHydratableInstance = hydrationParentFiber = null;
      isHydrating = false;
    }
    function upgradeHydrationErrorsToRecoverable() {
      var queuedErrors = hydrationErrors;
      null !== queuedErrors && (null === workInProgressRootRecoverableErrors ? workInProgressRootRecoverableErrors = queuedErrors : workInProgressRootRecoverableErrors.push.apply(
        workInProgressRootRecoverableErrors,
        queuedErrors
      ), hydrationErrors = null);
      return queuedErrors;
    }
    function queueHydrationError(error) {
      null === hydrationErrors ? hydrationErrors = [error] : hydrationErrors.push(error);
    }
    var valueCursor = createCursor(null), currentlyRenderingFiber$1 = null, lastContextDependency = null;
    function pushProvider(providerFiber, context, nextValue) {
      push(valueCursor, context._currentValue);
      context._currentValue = nextValue;
    }
    function popProvider(context) {
      context._currentValue = valueCursor.current;
      pop(valueCursor);
    }
    function scheduleContextWorkOnParentPath(parent, renderLanes2, propagationRoot) {
      for (; null !== parent; ) {
        var alternate = parent.alternate;
        (parent.childLanes & renderLanes2) !== renderLanes2 ? (parent.childLanes |= renderLanes2, null !== alternate && (alternate.childLanes |= renderLanes2)) : null !== alternate && (alternate.childLanes & renderLanes2) !== renderLanes2 && (alternate.childLanes |= renderLanes2);
        if (parent === propagationRoot) break;
        parent = parent.return;
      }
    }
    function propagateContextChanges(workInProgress2, contexts, renderLanes2, forcePropagateEntireTree) {
      var fiber = workInProgress2.child;
      null !== fiber && (fiber.return = workInProgress2);
      for (; null !== fiber; ) {
        var list = fiber.dependencies;
        if (null !== list) {
          var nextFiber = fiber.child;
          list = list.firstContext;
          a: for (; null !== list; ) {
            var dependency = list;
            list = fiber;
            for (var i = 0; i < contexts.length; i++)
              if (dependency.context === contexts[i]) {
                list.lanes |= renderLanes2;
                dependency = list.alternate;
                null !== dependency && (dependency.lanes |= renderLanes2);
                scheduleContextWorkOnParentPath(
                  list.return,
                  renderLanes2,
                  workInProgress2
                );
                forcePropagateEntireTree || (nextFiber = null);
                break a;
              }
            list = dependency.next;
          }
        } else if (18 === fiber.tag) {
          nextFiber = fiber.return;
          if (null === nextFiber) throw Error(formatProdErrorMessage(341));
          nextFiber.lanes |= renderLanes2;
          list = nextFiber.alternate;
          null !== list && (list.lanes |= renderLanes2);
          scheduleContextWorkOnParentPath(nextFiber, renderLanes2, workInProgress2);
          nextFiber = null;
        } else nextFiber = fiber.child;
        if (null !== nextFiber) nextFiber.return = fiber;
        else
          for (nextFiber = fiber; null !== nextFiber; ) {
            if (nextFiber === workInProgress2) {
              nextFiber = null;
              break;
            }
            fiber = nextFiber.sibling;
            if (null !== fiber) {
              fiber.return = nextFiber.return;
              nextFiber = fiber;
              break;
            }
            nextFiber = nextFiber.return;
          }
        fiber = nextFiber;
      }
    }
    function propagateParentContextChanges(current, workInProgress2, renderLanes2, forcePropagateEntireTree) {
      current = null;
      for (var parent = workInProgress2, isInsidePropagationBailout = false; null !== parent; ) {
        if (!isInsidePropagationBailout) {
          if (0 !== (parent.flags & 524288)) isInsidePropagationBailout = true;
          else if (0 !== (parent.flags & 262144)) break;
        }
        if (10 === parent.tag) {
          var currentParent = parent.alternate;
          if (null === currentParent) throw Error(formatProdErrorMessage(387));
          currentParent = currentParent.memoizedProps;
          if (null !== currentParent) {
            var context = parent.type;
            objectIs(parent.pendingProps.value, currentParent.value) || (null !== current ? current.push(context) : current = [context]);
          }
        } else if (parent === hostTransitionProviderCursor.current) {
          currentParent = parent.alternate;
          if (null === currentParent) throw Error(formatProdErrorMessage(387));
          currentParent.memoizedState.memoizedState !== parent.memoizedState.memoizedState && (null !== current ? current.push(HostTransitionContext) : current = [HostTransitionContext]);
        }
        parent = parent.return;
      }
      null !== current && propagateContextChanges(
        workInProgress2,
        current,
        renderLanes2,
        forcePropagateEntireTree
      );
      workInProgress2.flags |= 262144;
    }
    function checkIfContextChanged(currentDependencies) {
      for (currentDependencies = currentDependencies.firstContext; null !== currentDependencies; ) {
        if (!objectIs(
          currentDependencies.context._currentValue,
          currentDependencies.memoizedValue
        ))
          return true;
        currentDependencies = currentDependencies.next;
      }
      return false;
    }
    function prepareToReadContext(workInProgress2) {
      currentlyRenderingFiber$1 = workInProgress2;
      lastContextDependency = null;
      workInProgress2 = workInProgress2.dependencies;
      null !== workInProgress2 && (workInProgress2.firstContext = null);
    }
    function readContext(context) {
      return readContextForConsumer(currentlyRenderingFiber$1, context);
    }
    function readContextDuringReconciliation(consumer, context) {
      null === currentlyRenderingFiber$1 && prepareToReadContext(consumer);
      return readContextForConsumer(consumer, context);
    }
    function readContextForConsumer(consumer, context) {
      var value = context._currentValue;
      context = { context, memoizedValue: value, next: null };
      if (null === lastContextDependency) {
        if (null === consumer) throw Error(formatProdErrorMessage(308));
        lastContextDependency = context;
        consumer.dependencies = { lanes: 0, firstContext: context };
        consumer.flags |= 524288;
      } else lastContextDependency = lastContextDependency.next = context;
      return value;
    }
    var AbortControllerLocal = "undefined" !== typeof AbortController ? AbortController : function() {
      var listeners = [], signal = this.signal = {
        aborted: false,
        addEventListener: function(type, listener) {
          listeners.push(listener);
        }
      };
      this.abort = function() {
        signal.aborted = true;
        listeners.forEach(function(listener) {
          return listener();
        });
      };
    }, scheduleCallback$2 = Scheduler.unstable_scheduleCallback, NormalPriority = Scheduler.unstable_NormalPriority, CacheContext = {
      $$typeof: REACT_CONTEXT_TYPE,
      Consumer: null,
      Provider: null,
      _currentValue: null,
      _currentValue2: null,
      _threadCount: 0
    };
    function createCache() {
      return {
        controller: new AbortControllerLocal(),
        data: new Map(),
        refCount: 0
      };
    }
    function releaseCache(cache) {
      cache.refCount--;
      0 === cache.refCount && scheduleCallback$2(NormalPriority, function() {
        cache.controller.abort();
      });
    }
    var currentEntangledListeners = null, currentEntangledPendingCount = 0, currentEntangledLane = 0, currentEntangledActionThenable = null;
    function entangleAsyncAction(transition, thenable) {
      if (null === currentEntangledListeners) {
        var entangledListeners = currentEntangledListeners = [];
        currentEntangledPendingCount = 0;
        currentEntangledLane = requestTransitionLane();
        currentEntangledActionThenable = {
          status: "pending",
          value: void 0,
          then: function(resolve) {
            entangledListeners.push(resolve);
          }
        };
      }
      currentEntangledPendingCount++;
      thenable.then(pingEngtangledActionScope, pingEngtangledActionScope);
      return thenable;
    }
    function pingEngtangledActionScope() {
      if (0 === --currentEntangledPendingCount && null !== currentEntangledListeners) {
        null !== currentEntangledActionThenable && (currentEntangledActionThenable.status = "fulfilled");
        var listeners = currentEntangledListeners;
        currentEntangledListeners = null;
        currentEntangledLane = 0;
        currentEntangledActionThenable = null;
        for (var i = 0; i < listeners.length; i++) (0, listeners[i])();
      }
    }
    function chainThenableValue(thenable, result) {
      var listeners = [], thenableWithOverride = {
        status: "pending",
        value: null,
        reason: null,
        then: function(resolve) {
          listeners.push(resolve);
        }
      };
      thenable.then(
        function() {
          thenableWithOverride.status = "fulfilled";
          thenableWithOverride.value = result;
          for (var i = 0; i < listeners.length; i++) (0, listeners[i])(result);
        },
        function(error) {
          thenableWithOverride.status = "rejected";
          thenableWithOverride.reason = error;
          for (error = 0; error < listeners.length; error++)
            (0, listeners[error])(void 0);
        }
      );
      return thenableWithOverride;
    }
    var prevOnStartTransitionFinish = ReactSharedInternals.S;
    ReactSharedInternals.S = function(transition, returnValue) {
      globalMostRecentTransitionTime = now();
      "object" === typeof returnValue && null !== returnValue && "function" === typeof returnValue.then && entangleAsyncAction(transition, returnValue);
      null !== prevOnStartTransitionFinish && prevOnStartTransitionFinish(transition, returnValue);
    };
    var resumedCache = createCursor(null);
    function peekCacheFromPool() {
      var cacheResumedFromPreviousRender = resumedCache.current;
      return null !== cacheResumedFromPreviousRender ? cacheResumedFromPreviousRender : workInProgressRoot.pooledCache;
    }
    function pushTransition(offscreenWorkInProgress, prevCachePool) {
      null === prevCachePool ? push(resumedCache, resumedCache.current) : push(resumedCache, prevCachePool.pool);
    }
    function getSuspendedCache() {
      var cacheFromPool = peekCacheFromPool();
      return null === cacheFromPool ? null : { parent: CacheContext._currentValue, pool: cacheFromPool };
    }
    var SuspenseException = Error(formatProdErrorMessage(460)), SuspenseyCommitException = Error(formatProdErrorMessage(474)), SuspenseActionException = Error(formatProdErrorMessage(542)), noopSuspenseyCommitThenable = { then: function() {
    } };
    function isThenableResolved(thenable) {
      thenable = thenable.status;
      return "fulfilled" === thenable || "rejected" === thenable;
    }
    function trackUsedThenable(thenableState2, thenable, index2) {
      index2 = thenableState2[index2];
      void 0 === index2 ? thenableState2.push(thenable) : index2 !== thenable && (thenable.then(noop$1, noop$1), thenable = index2);
      switch (thenable.status) {
        case "fulfilled":
          return thenable.value;
        case "rejected":
          throw thenableState2 = thenable.reason, checkIfUseWrappedInAsyncCatch(thenableState2), thenableState2;
        default:
          if ("string" === typeof thenable.status) thenable.then(noop$1, noop$1);
          else {
            thenableState2 = workInProgressRoot;
            if (null !== thenableState2 && 100 < thenableState2.shellSuspendCounter)
              throw Error(formatProdErrorMessage(482));
            thenableState2 = thenable;
            thenableState2.status = "pending";
            thenableState2.then(
              function(fulfilledValue) {
                if ("pending" === thenable.status) {
                  var fulfilledThenable = thenable;
                  fulfilledThenable.status = "fulfilled";
                  fulfilledThenable.value = fulfilledValue;
                }
              },
              function(error) {
                if ("pending" === thenable.status) {
                  var rejectedThenable = thenable;
                  rejectedThenable.status = "rejected";
                  rejectedThenable.reason = error;
                }
              }
            );
          }
          switch (thenable.status) {
            case "fulfilled":
              return thenable.value;
            case "rejected":
              throw thenableState2 = thenable.reason, checkIfUseWrappedInAsyncCatch(thenableState2), thenableState2;
          }
          suspendedThenable = thenable;
          throw SuspenseException;
      }
    }
    function resolveLazy(lazyType) {
      try {
        var init = lazyType._init;
        return init(lazyType._payload);
      } catch (x) {
        if (null !== x && "object" === typeof x && "function" === typeof x.then)
          throw suspendedThenable = x, SuspenseException;
        throw x;
      }
    }
    var suspendedThenable = null;
    function getSuspendedThenable() {
      if (null === suspendedThenable) throw Error(formatProdErrorMessage(459));
      var thenable = suspendedThenable;
      suspendedThenable = null;
      return thenable;
    }
    function checkIfUseWrappedInAsyncCatch(rejectedReason) {
      if (rejectedReason === SuspenseException || rejectedReason === SuspenseActionException)
        throw Error(formatProdErrorMessage(483));
    }
    var thenableState$1 = null, thenableIndexCounter$1 = 0;
    function unwrapThenable(thenable) {
      var index2 = thenableIndexCounter$1;
      thenableIndexCounter$1 += 1;
      null === thenableState$1 && (thenableState$1 = []);
      return trackUsedThenable(thenableState$1, thenable, index2);
    }
    function coerceRef(workInProgress2, element) {
      element = element.props.ref;
      workInProgress2.ref = void 0 !== element ? element : null;
    }
    function throwOnInvalidObjectTypeImpl(returnFiber, newChild) {
      if (newChild.$$typeof === REACT_LEGACY_ELEMENT_TYPE)
        throw Error(formatProdErrorMessage(525));
      returnFiber = Object.prototype.toString.call(newChild);
      throw Error(
        formatProdErrorMessage(
          31,
          "[object Object]" === returnFiber ? "object with keys {" + Object.keys(newChild).join(", ") + "}" : returnFiber
        )
      );
    }
    function createChildReconciler(shouldTrackSideEffects) {
      function deleteChild(returnFiber, childToDelete) {
        if (shouldTrackSideEffects) {
          var deletions = returnFiber.deletions;
          null === deletions ? (returnFiber.deletions = [childToDelete], returnFiber.flags |= 16) : deletions.push(childToDelete);
        }
      }
      function deleteRemainingChildren(returnFiber, currentFirstChild) {
        if (!shouldTrackSideEffects) return null;
        for (; null !== currentFirstChild; )
          deleteChild(returnFiber, currentFirstChild), currentFirstChild = currentFirstChild.sibling;
        return null;
      }
      function mapRemainingChildren(currentFirstChild) {
        for (var existingChildren = new Map(); null !== currentFirstChild; )
          null !== currentFirstChild.key ? existingChildren.set(currentFirstChild.key, currentFirstChild) : existingChildren.set(currentFirstChild.index, currentFirstChild), currentFirstChild = currentFirstChild.sibling;
        return existingChildren;
      }
      function useFiber(fiber, pendingProps) {
        fiber = createWorkInProgress(fiber, pendingProps);
        fiber.index = 0;
        fiber.sibling = null;
        return fiber;
      }
      function placeChild(newFiber, lastPlacedIndex, newIndex) {
        newFiber.index = newIndex;
        if (!shouldTrackSideEffects)
          return newFiber.flags |= 1048576, lastPlacedIndex;
        newIndex = newFiber.alternate;
        if (null !== newIndex)
          return newIndex = newIndex.index, newIndex < lastPlacedIndex ? (newFiber.flags |= 67108866, lastPlacedIndex) : newIndex;
        newFiber.flags |= 67108866;
        return lastPlacedIndex;
      }
      function placeSingleChild(newFiber) {
        shouldTrackSideEffects && null === newFiber.alternate && (newFiber.flags |= 67108866);
        return newFiber;
      }
      function updateTextNode(returnFiber, current, textContent, lanes) {
        if (null === current || 6 !== current.tag)
          return current = createFiberFromText(textContent, returnFiber.mode, lanes), current.return = returnFiber, current;
        current = useFiber(current, textContent);
        current.return = returnFiber;
        return current;
      }
      function updateElement(returnFiber, current, element, lanes) {
        var elementType = element.type;
        if (elementType === REACT_FRAGMENT_TYPE)
          return updateFragment(
            returnFiber,
            current,
            element.props.children,
            lanes,
            element.key
          );
        if (null !== current && (current.elementType === elementType || "object" === typeof elementType && null !== elementType && elementType.$$typeof === REACT_LAZY_TYPE && resolveLazy(elementType) === current.type))
          return current = useFiber(current, element.props), coerceRef(current, element), current.return = returnFiber, current;
        current = createFiberFromTypeAndProps(
          element.type,
          element.key,
          element.props,
          null,
          returnFiber.mode,
          lanes
        );
        coerceRef(current, element);
        current.return = returnFiber;
        return current;
      }
      function updatePortal(returnFiber, current, portal, lanes) {
        if (null === current || 4 !== current.tag || current.stateNode.containerInfo !== portal.containerInfo || current.stateNode.implementation !== portal.implementation)
          return current = createFiberFromPortal(portal, returnFiber.mode, lanes), current.return = returnFiber, current;
        current = useFiber(current, portal.children || []);
        current.return = returnFiber;
        return current;
      }
      function updateFragment(returnFiber, current, fragment, lanes, key) {
        if (null === current || 7 !== current.tag)
          return current = createFiberFromFragment(
            fragment,
            returnFiber.mode,
            lanes,
            key
          ), current.return = returnFiber, current;
        current = useFiber(current, fragment);
        current.return = returnFiber;
        return current;
      }
      function createChild(returnFiber, newChild, lanes) {
        if ("string" === typeof newChild && "" !== newChild || "number" === typeof newChild || "bigint" === typeof newChild)
          return newChild = createFiberFromText(
            "" + newChild,
            returnFiber.mode,
            lanes
          ), newChild.return = returnFiber, newChild;
        if ("object" === typeof newChild && null !== newChild) {
          switch (newChild.$$typeof) {
            case REACT_ELEMENT_TYPE:
              return lanes = createFiberFromTypeAndProps(
                newChild.type,
                newChild.key,
                newChild.props,
                null,
                returnFiber.mode,
                lanes
              ), coerceRef(lanes, newChild), lanes.return = returnFiber, lanes;
            case REACT_PORTAL_TYPE:
              return newChild = createFiberFromPortal(
                newChild,
                returnFiber.mode,
                lanes
              ), newChild.return = returnFiber, newChild;
            case REACT_LAZY_TYPE:
              return newChild = resolveLazy(newChild), createChild(returnFiber, newChild, lanes);
          }
          if (isArrayImpl(newChild) || getIteratorFn(newChild))
            return newChild = createFiberFromFragment(
              newChild,
              returnFiber.mode,
              lanes,
              null
            ), newChild.return = returnFiber, newChild;
          if ("function" === typeof newChild.then)
            return createChild(returnFiber, unwrapThenable(newChild), lanes);
          if (newChild.$$typeof === REACT_CONTEXT_TYPE)
            return createChild(
              returnFiber,
              readContextDuringReconciliation(returnFiber, newChild),
              lanes
            );
          throwOnInvalidObjectTypeImpl(returnFiber, newChild);
        }
        return null;
      }
      function updateSlot(returnFiber, oldFiber, newChild, lanes) {
        var key = null !== oldFiber ? oldFiber.key : null;
        if ("string" === typeof newChild && "" !== newChild || "number" === typeof newChild || "bigint" === typeof newChild)
          return null !== key ? null : updateTextNode(returnFiber, oldFiber, "" + newChild, lanes);
        if ("object" === typeof newChild && null !== newChild) {
          switch (newChild.$$typeof) {
            case REACT_ELEMENT_TYPE:
              return newChild.key === key ? updateElement(returnFiber, oldFiber, newChild, lanes) : null;
            case REACT_PORTAL_TYPE:
              return newChild.key === key ? updatePortal(returnFiber, oldFiber, newChild, lanes) : null;
            case REACT_LAZY_TYPE:
              return newChild = resolveLazy(newChild), updateSlot(returnFiber, oldFiber, newChild, lanes);
          }
          if (isArrayImpl(newChild) || getIteratorFn(newChild))
            return null !== key ? null : updateFragment(returnFiber, oldFiber, newChild, lanes, null);
          if ("function" === typeof newChild.then)
            return updateSlot(
              returnFiber,
              oldFiber,
              unwrapThenable(newChild),
              lanes
            );
          if (newChild.$$typeof === REACT_CONTEXT_TYPE)
            return updateSlot(
              returnFiber,
              oldFiber,
              readContextDuringReconciliation(returnFiber, newChild),
              lanes
            );
          throwOnInvalidObjectTypeImpl(returnFiber, newChild);
        }
        return null;
      }
      function updateFromMap(existingChildren, returnFiber, newIdx, newChild, lanes) {
        if ("string" === typeof newChild && "" !== newChild || "number" === typeof newChild || "bigint" === typeof newChild)
          return existingChildren = existingChildren.get(newIdx) || null, updateTextNode(returnFiber, existingChildren, "" + newChild, lanes);
        if ("object" === typeof newChild && null !== newChild) {
          switch (newChild.$$typeof) {
            case REACT_ELEMENT_TYPE:
              return existingChildren = existingChildren.get(
                null === newChild.key ? newIdx : newChild.key
              ) || null, updateElement(returnFiber, existingChildren, newChild, lanes);
            case REACT_PORTAL_TYPE:
              return existingChildren = existingChildren.get(
                null === newChild.key ? newIdx : newChild.key
              ) || null, updatePortal(returnFiber, existingChildren, newChild, lanes);
            case REACT_LAZY_TYPE:
              return newChild = resolveLazy(newChild), updateFromMap(
                existingChildren,
                returnFiber,
                newIdx,
                newChild,
                lanes
              );
          }
          if (isArrayImpl(newChild) || getIteratorFn(newChild))
            return existingChildren = existingChildren.get(newIdx) || null, updateFragment(returnFiber, existingChildren, newChild, lanes, null);
          if ("function" === typeof newChild.then)
            return updateFromMap(
              existingChildren,
              returnFiber,
              newIdx,
              unwrapThenable(newChild),
              lanes
            );
          if (newChild.$$typeof === REACT_CONTEXT_TYPE)
            return updateFromMap(
              existingChildren,
              returnFiber,
              newIdx,
              readContextDuringReconciliation(returnFiber, newChild),
              lanes
            );
          throwOnInvalidObjectTypeImpl(returnFiber, newChild);
        }
        return null;
      }
      function reconcileChildrenArray(returnFiber, currentFirstChild, newChildren, lanes) {
        for (var resultingFirstChild = null, previousNewFiber = null, oldFiber = currentFirstChild, newIdx = currentFirstChild = 0, nextOldFiber = null; null !== oldFiber && newIdx < newChildren.length; newIdx++) {
          oldFiber.index > newIdx ? (nextOldFiber = oldFiber, oldFiber = null) : nextOldFiber = oldFiber.sibling;
          var newFiber = updateSlot(
            returnFiber,
            oldFiber,
            newChildren[newIdx],
            lanes
          );
          if (null === newFiber) {
            null === oldFiber && (oldFiber = nextOldFiber);
            break;
          }
          shouldTrackSideEffects && oldFiber && null === newFiber.alternate && deleteChild(returnFiber, oldFiber);
          currentFirstChild = placeChild(newFiber, currentFirstChild, newIdx);
          null === previousNewFiber ? resultingFirstChild = newFiber : previousNewFiber.sibling = newFiber;
          previousNewFiber = newFiber;
          oldFiber = nextOldFiber;
        }
        if (newIdx === newChildren.length)
          return deleteRemainingChildren(returnFiber, oldFiber), isHydrating && pushTreeFork(returnFiber, newIdx), resultingFirstChild;
        if (null === oldFiber) {
          for (; newIdx < newChildren.length; newIdx++)
            oldFiber = createChild(returnFiber, newChildren[newIdx], lanes), null !== oldFiber && (currentFirstChild = placeChild(
              oldFiber,
              currentFirstChild,
              newIdx
            ), null === previousNewFiber ? resultingFirstChild = oldFiber : previousNewFiber.sibling = oldFiber, previousNewFiber = oldFiber);
          isHydrating && pushTreeFork(returnFiber, newIdx);
          return resultingFirstChild;
        }
        for (oldFiber = mapRemainingChildren(oldFiber); newIdx < newChildren.length; newIdx++)
          nextOldFiber = updateFromMap(
            oldFiber,
            returnFiber,
            newIdx,
            newChildren[newIdx],
            lanes
          ), null !== nextOldFiber && (shouldTrackSideEffects && null !== nextOldFiber.alternate && oldFiber.delete(
            null === nextOldFiber.key ? newIdx : nextOldFiber.key
          ), currentFirstChild = placeChild(
            nextOldFiber,
            currentFirstChild,
            newIdx
          ), null === previousNewFiber ? resultingFirstChild = nextOldFiber : previousNewFiber.sibling = nextOldFiber, previousNewFiber = nextOldFiber);
        shouldTrackSideEffects && oldFiber.forEach(function(child) {
          return deleteChild(returnFiber, child);
        });
        isHydrating && pushTreeFork(returnFiber, newIdx);
        return resultingFirstChild;
      }
      function reconcileChildrenIterator(returnFiber, currentFirstChild, newChildren, lanes) {
        if (null == newChildren) throw Error(formatProdErrorMessage(151));
        for (var resultingFirstChild = null, previousNewFiber = null, oldFiber = currentFirstChild, newIdx = currentFirstChild = 0, nextOldFiber = null, step = newChildren.next(); null !== oldFiber && !step.done; newIdx++, step = newChildren.next()) {
          oldFiber.index > newIdx ? (nextOldFiber = oldFiber, oldFiber = null) : nextOldFiber = oldFiber.sibling;
          var newFiber = updateSlot(returnFiber, oldFiber, step.value, lanes);
          if (null === newFiber) {
            null === oldFiber && (oldFiber = nextOldFiber);
            break;
          }
          shouldTrackSideEffects && oldFiber && null === newFiber.alternate && deleteChild(returnFiber, oldFiber);
          currentFirstChild = placeChild(newFiber, currentFirstChild, newIdx);
          null === previousNewFiber ? resultingFirstChild = newFiber : previousNewFiber.sibling = newFiber;
          previousNewFiber = newFiber;
          oldFiber = nextOldFiber;
        }
        if (step.done)
          return deleteRemainingChildren(returnFiber, oldFiber), isHydrating && pushTreeFork(returnFiber, newIdx), resultingFirstChild;
        if (null === oldFiber) {
          for (; !step.done; newIdx++, step = newChildren.next())
            step = createChild(returnFiber, step.value, lanes), null !== step && (currentFirstChild = placeChild(step, currentFirstChild, newIdx), null === previousNewFiber ? resultingFirstChild = step : previousNewFiber.sibling = step, previousNewFiber = step);
          isHydrating && pushTreeFork(returnFiber, newIdx);
          return resultingFirstChild;
        }
        for (oldFiber = mapRemainingChildren(oldFiber); !step.done; newIdx++, step = newChildren.next())
          step = updateFromMap(oldFiber, returnFiber, newIdx, step.value, lanes), null !== step && (shouldTrackSideEffects && null !== step.alternate && oldFiber.delete(null === step.key ? newIdx : step.key), currentFirstChild = placeChild(step, currentFirstChild, newIdx), null === previousNewFiber ? resultingFirstChild = step : previousNewFiber.sibling = step, previousNewFiber = step);
        shouldTrackSideEffects && oldFiber.forEach(function(child) {
          return deleteChild(returnFiber, child);
        });
        isHydrating && pushTreeFork(returnFiber, newIdx);
        return resultingFirstChild;
      }
      function reconcileChildFibersImpl(returnFiber, currentFirstChild, newChild, lanes) {
        "object" === typeof newChild && null !== newChild && newChild.type === REACT_FRAGMENT_TYPE && null === newChild.key && (newChild = newChild.props.children);
        if ("object" === typeof newChild && null !== newChild) {
          switch (newChild.$$typeof) {
            case REACT_ELEMENT_TYPE:
              a: {
                for (var key = newChild.key; null !== currentFirstChild; ) {
                  if (currentFirstChild.key === key) {
                    key = newChild.type;
                    if (key === REACT_FRAGMENT_TYPE) {
                      if (7 === currentFirstChild.tag) {
                        deleteRemainingChildren(
                          returnFiber,
                          currentFirstChild.sibling
                        );
                        lanes = useFiber(
                          currentFirstChild,
                          newChild.props.children
                        );
                        lanes.return = returnFiber;
                        returnFiber = lanes;
                        break a;
                      }
                    } else if (currentFirstChild.elementType === key || "object" === typeof key && null !== key && key.$$typeof === REACT_LAZY_TYPE && resolveLazy(key) === currentFirstChild.type) {
                      deleteRemainingChildren(
                        returnFiber,
                        currentFirstChild.sibling
                      );
                      lanes = useFiber(currentFirstChild, newChild.props);
                      coerceRef(lanes, newChild);
                      lanes.return = returnFiber;
                      returnFiber = lanes;
                      break a;
                    }
                    deleteRemainingChildren(returnFiber, currentFirstChild);
                    break;
                  } else deleteChild(returnFiber, currentFirstChild);
                  currentFirstChild = currentFirstChild.sibling;
                }
                newChild.type === REACT_FRAGMENT_TYPE ? (lanes = createFiberFromFragment(
                  newChild.props.children,
                  returnFiber.mode,
                  lanes,
                  newChild.key
                ), lanes.return = returnFiber, returnFiber = lanes) : (lanes = createFiberFromTypeAndProps(
                  newChild.type,
                  newChild.key,
                  newChild.props,
                  null,
                  returnFiber.mode,
                  lanes
                ), coerceRef(lanes, newChild), lanes.return = returnFiber, returnFiber = lanes);
              }
              return placeSingleChild(returnFiber);
            case REACT_PORTAL_TYPE:
              a: {
                for (key = newChild.key; null !== currentFirstChild; ) {
                  if (currentFirstChild.key === key)
                    if (4 === currentFirstChild.tag && currentFirstChild.stateNode.containerInfo === newChild.containerInfo && currentFirstChild.stateNode.implementation === newChild.implementation) {
                      deleteRemainingChildren(
                        returnFiber,
                        currentFirstChild.sibling
                      );
                      lanes = useFiber(currentFirstChild, newChild.children || []);
                      lanes.return = returnFiber;
                      returnFiber = lanes;
                      break a;
                    } else {
                      deleteRemainingChildren(returnFiber, currentFirstChild);
                      break;
                    }
                  else deleteChild(returnFiber, currentFirstChild);
                  currentFirstChild = currentFirstChild.sibling;
                }
                lanes = createFiberFromPortal(newChild, returnFiber.mode, lanes);
                lanes.return = returnFiber;
                returnFiber = lanes;
              }
              return placeSingleChild(returnFiber);
            case REACT_LAZY_TYPE:
              return newChild = resolveLazy(newChild), reconcileChildFibersImpl(
                returnFiber,
                currentFirstChild,
                newChild,
                lanes
              );
          }
          if (isArrayImpl(newChild))
            return reconcileChildrenArray(
              returnFiber,
              currentFirstChild,
              newChild,
              lanes
            );
          if (getIteratorFn(newChild)) {
            key = getIteratorFn(newChild);
            if ("function" !== typeof key) throw Error(formatProdErrorMessage(150));
            newChild = key.call(newChild);
            return reconcileChildrenIterator(
              returnFiber,
              currentFirstChild,
              newChild,
              lanes
            );
          }
          if ("function" === typeof newChild.then)
            return reconcileChildFibersImpl(
              returnFiber,
              currentFirstChild,
              unwrapThenable(newChild),
              lanes
            );
          if (newChild.$$typeof === REACT_CONTEXT_TYPE)
            return reconcileChildFibersImpl(
              returnFiber,
              currentFirstChild,
              readContextDuringReconciliation(returnFiber, newChild),
              lanes
            );
          throwOnInvalidObjectTypeImpl(returnFiber, newChild);
        }
        return "string" === typeof newChild && "" !== newChild || "number" === typeof newChild || "bigint" === typeof newChild ? (newChild = "" + newChild, null !== currentFirstChild && 6 === currentFirstChild.tag ? (deleteRemainingChildren(returnFiber, currentFirstChild.sibling), lanes = useFiber(currentFirstChild, newChild), lanes.return = returnFiber, returnFiber = lanes) : (deleteRemainingChildren(returnFiber, currentFirstChild), lanes = createFiberFromText(newChild, returnFiber.mode, lanes), lanes.return = returnFiber, returnFiber = lanes), placeSingleChild(returnFiber)) : deleteRemainingChildren(returnFiber, currentFirstChild);
      }
      return function(returnFiber, currentFirstChild, newChild, lanes) {
        try {
          thenableIndexCounter$1 = 0;
          var firstChildFiber = reconcileChildFibersImpl(
            returnFiber,
            currentFirstChild,
            newChild,
            lanes
          );
          thenableState$1 = null;
          return firstChildFiber;
        } catch (x) {
          if (x === SuspenseException || x === SuspenseActionException) throw x;
          var fiber = createFiberImplClass(29, x, null, returnFiber.mode);
          fiber.lanes = lanes;
          fiber.return = returnFiber;
          return fiber;
        } finally {
        }
      };
    }
    var reconcileChildFibers = createChildReconciler(true), mountChildFibers = createChildReconciler(false), hasForceUpdate = false;
    function initializeUpdateQueue(fiber) {
      fiber.updateQueue = {
        baseState: fiber.memoizedState,
        firstBaseUpdate: null,
        lastBaseUpdate: null,
        shared: { pending: null, lanes: 0, hiddenCallbacks: null },
        callbacks: null
      };
    }
    function cloneUpdateQueue(current, workInProgress2) {
      current = current.updateQueue;
      workInProgress2.updateQueue === current && (workInProgress2.updateQueue = {
        baseState: current.baseState,
        firstBaseUpdate: current.firstBaseUpdate,
        lastBaseUpdate: current.lastBaseUpdate,
        shared: current.shared,
        callbacks: null
      });
    }
    function createUpdate(lane) {
      return { lane, tag: 0, payload: null, callback: null, next: null };
    }
    function enqueueUpdate(fiber, update, lane) {
      var updateQueue = fiber.updateQueue;
      if (null === updateQueue) return null;
      updateQueue = updateQueue.shared;
      if (0 !== (executionContext & 2)) {
        var pending = updateQueue.pending;
        null === pending ? update.next = update : (update.next = pending.next, pending.next = update);
        updateQueue.pending = update;
        update = getRootForUpdatedFiber(fiber);
        markUpdateLaneFromFiberToRoot(fiber, null, lane);
        return update;
      }
      enqueueUpdate$1(fiber, updateQueue, update, lane);
      return getRootForUpdatedFiber(fiber);
    }
    function entangleTransitions(root2, fiber, lane) {
      fiber = fiber.updateQueue;
      if (null !== fiber && (fiber = fiber.shared, 0 !== (lane & 4194048))) {
        var queueLanes = fiber.lanes;
        queueLanes &= root2.pendingLanes;
        lane |= queueLanes;
        fiber.lanes = lane;
        markRootEntangled(root2, lane);
      }
    }
    function enqueueCapturedUpdate(workInProgress2, capturedUpdate) {
      var queue = workInProgress2.updateQueue, current = workInProgress2.alternate;
      if (null !== current && (current = current.updateQueue, queue === current)) {
        var newFirst = null, newLast = null;
        queue = queue.firstBaseUpdate;
        if (null !== queue) {
          do {
            var clone = {
              lane: queue.lane,
              tag: queue.tag,
              payload: queue.payload,
              callback: null,
              next: null
            };
            null === newLast ? newFirst = newLast = clone : newLast = newLast.next = clone;
            queue = queue.next;
          } while (null !== queue);
          null === newLast ? newFirst = newLast = capturedUpdate : newLast = newLast.next = capturedUpdate;
        } else newFirst = newLast = capturedUpdate;
        queue = {
          baseState: current.baseState,
          firstBaseUpdate: newFirst,
          lastBaseUpdate: newLast,
          shared: current.shared,
          callbacks: current.callbacks
        };
        workInProgress2.updateQueue = queue;
        return;
      }
      workInProgress2 = queue.lastBaseUpdate;
      null === workInProgress2 ? queue.firstBaseUpdate = capturedUpdate : workInProgress2.next = capturedUpdate;
      queue.lastBaseUpdate = capturedUpdate;
    }
    var didReadFromEntangledAsyncAction = false;
    function suspendIfUpdateReadFromEntangledAsyncAction() {
      if (didReadFromEntangledAsyncAction) {
        var entangledActionThenable = currentEntangledActionThenable;
        if (null !== entangledActionThenable) throw entangledActionThenable;
      }
    }
    function processUpdateQueue(workInProgress$jscomp$0, props, instance$jscomp$0, renderLanes2) {
      didReadFromEntangledAsyncAction = false;
      var queue = workInProgress$jscomp$0.updateQueue;
      hasForceUpdate = false;
      var firstBaseUpdate = queue.firstBaseUpdate, lastBaseUpdate = queue.lastBaseUpdate, pendingQueue = queue.shared.pending;
      if (null !== pendingQueue) {
        queue.shared.pending = null;
        var lastPendingUpdate = pendingQueue, firstPendingUpdate = lastPendingUpdate.next;
        lastPendingUpdate.next = null;
        null === lastBaseUpdate ? firstBaseUpdate = firstPendingUpdate : lastBaseUpdate.next = firstPendingUpdate;
        lastBaseUpdate = lastPendingUpdate;
        var current = workInProgress$jscomp$0.alternate;
        null !== current && (current = current.updateQueue, pendingQueue = current.lastBaseUpdate, pendingQueue !== lastBaseUpdate && (null === pendingQueue ? current.firstBaseUpdate = firstPendingUpdate : pendingQueue.next = firstPendingUpdate, current.lastBaseUpdate = lastPendingUpdate));
      }
      if (null !== firstBaseUpdate) {
        var newState = queue.baseState;
        lastBaseUpdate = 0;
        current = firstPendingUpdate = lastPendingUpdate = null;
        pendingQueue = firstBaseUpdate;
        do {
          var updateLane = pendingQueue.lane & -536870913, isHiddenUpdate = updateLane !== pendingQueue.lane;
          if (isHiddenUpdate ? (workInProgressRootRenderLanes & updateLane) === updateLane : (renderLanes2 & updateLane) === updateLane) {
            0 !== updateLane && updateLane === currentEntangledLane && (didReadFromEntangledAsyncAction = true);
            null !== current && (current = current.next = {
              lane: 0,
              tag: pendingQueue.tag,
              payload: pendingQueue.payload,
              callback: null,
              next: null
            });
            a: {
              var workInProgress2 = workInProgress$jscomp$0, update = pendingQueue;
              updateLane = props;
              var instance = instance$jscomp$0;
              switch (update.tag) {
                case 1:
                  workInProgress2 = update.payload;
                  if ("function" === typeof workInProgress2) {
                    newState = workInProgress2.call(instance, newState, updateLane);
                    break a;
                  }
                  newState = workInProgress2;
                  break a;
                case 3:
                  workInProgress2.flags = workInProgress2.flags & -65537 | 128;
                case 0:
                  workInProgress2 = update.payload;
                  updateLane = "function" === typeof workInProgress2 ? workInProgress2.call(instance, newState, updateLane) : workInProgress2;
                  if (null === updateLane || void 0 === updateLane) break a;
                  newState = assign({}, newState, updateLane);
                  break a;
                case 2:
                  hasForceUpdate = true;
              }
            }
            updateLane = pendingQueue.callback;
            null !== updateLane && (workInProgress$jscomp$0.flags |= 64, isHiddenUpdate && (workInProgress$jscomp$0.flags |= 8192), isHiddenUpdate = queue.callbacks, null === isHiddenUpdate ? queue.callbacks = [updateLane] : isHiddenUpdate.push(updateLane));
          } else
            isHiddenUpdate = {
              lane: updateLane,
              tag: pendingQueue.tag,
              payload: pendingQueue.payload,
              callback: pendingQueue.callback,
              next: null
            }, null === current ? (firstPendingUpdate = current = isHiddenUpdate, lastPendingUpdate = newState) : current = current.next = isHiddenUpdate, lastBaseUpdate |= updateLane;
          pendingQueue = pendingQueue.next;
          if (null === pendingQueue)
            if (pendingQueue = queue.shared.pending, null === pendingQueue)
              break;
            else
              isHiddenUpdate = pendingQueue, pendingQueue = isHiddenUpdate.next, isHiddenUpdate.next = null, queue.lastBaseUpdate = isHiddenUpdate, queue.shared.pending = null;
        } while (1);
        null === current && (lastPendingUpdate = newState);
        queue.baseState = lastPendingUpdate;
        queue.firstBaseUpdate = firstPendingUpdate;
        queue.lastBaseUpdate = current;
        null === firstBaseUpdate && (queue.shared.lanes = 0);
        workInProgressRootSkippedLanes |= lastBaseUpdate;
        workInProgress$jscomp$0.lanes = lastBaseUpdate;
        workInProgress$jscomp$0.memoizedState = newState;
      }
    }
    function callCallback(callback, context) {
      if ("function" !== typeof callback)
        throw Error(formatProdErrorMessage(191, callback));
      callback.call(context);
    }
    function commitCallbacks(updateQueue, context) {
      var callbacks = updateQueue.callbacks;
      if (null !== callbacks)
        for (updateQueue.callbacks = null, updateQueue = 0; updateQueue < callbacks.length; updateQueue++)
          callCallback(callbacks[updateQueue], context);
    }
    var currentTreeHiddenStackCursor = createCursor(null), prevEntangledRenderLanesCursor = createCursor(0);
    function pushHiddenContext(fiber, context) {
      fiber = entangledRenderLanes;
      push(prevEntangledRenderLanesCursor, fiber);
      push(currentTreeHiddenStackCursor, context);
      entangledRenderLanes = fiber | context.baseLanes;
    }
    function reuseHiddenContextOnStack() {
      push(prevEntangledRenderLanesCursor, entangledRenderLanes);
      push(currentTreeHiddenStackCursor, currentTreeHiddenStackCursor.current);
    }
    function popHiddenContext() {
      entangledRenderLanes = prevEntangledRenderLanesCursor.current;
      pop(currentTreeHiddenStackCursor);
      pop(prevEntangledRenderLanesCursor);
    }
    var suspenseHandlerStackCursor = createCursor(null), shellBoundary = null;
    function pushPrimaryTreeSuspenseHandler(handler) {
      var current = handler.alternate;
      push(suspenseStackCursor, suspenseStackCursor.current & 1);
      push(suspenseHandlerStackCursor, handler);
      null === shellBoundary && (null === current || null !== currentTreeHiddenStackCursor.current ? shellBoundary = handler : null !== current.memoizedState && (shellBoundary = handler));
    }
    function pushDehydratedActivitySuspenseHandler(fiber) {
      push(suspenseStackCursor, suspenseStackCursor.current);
      push(suspenseHandlerStackCursor, fiber);
      null === shellBoundary && (shellBoundary = fiber);
    }
    function pushOffscreenSuspenseHandler(fiber) {
      22 === fiber.tag ? (push(suspenseStackCursor, suspenseStackCursor.current), push(suspenseHandlerStackCursor, fiber), null === shellBoundary && (shellBoundary = fiber)) : reuseSuspenseHandlerOnStack();
    }
    function reuseSuspenseHandlerOnStack() {
      push(suspenseStackCursor, suspenseStackCursor.current);
      push(suspenseHandlerStackCursor, suspenseHandlerStackCursor.current);
    }
    function popSuspenseHandler(fiber) {
      pop(suspenseHandlerStackCursor);
      shellBoundary === fiber && (shellBoundary = null);
      pop(suspenseStackCursor);
    }
    var suspenseStackCursor = createCursor(0);
    function findFirstSuspended(row) {
      for (var node = row; null !== node; ) {
        if (13 === node.tag) {
          var state = node.memoizedState;
          if (null !== state && (state = state.dehydrated, null === state || isSuspenseInstancePending(state) || isSuspenseInstanceFallback(state)))
            return node;
        } else if (19 === node.tag && ("forwards" === node.memoizedProps.revealOrder || "backwards" === node.memoizedProps.revealOrder || "unstable_legacy-backwards" === node.memoizedProps.revealOrder || "together" === node.memoizedProps.revealOrder)) {
          if (0 !== (node.flags & 128)) return node;
        } else if (null !== node.child) {
          node.child.return = node;
          node = node.child;
          continue;
        }
        if (node === row) break;
        for (; null === node.sibling; ) {
          if (null === node.return || node.return === row) return null;
          node = node.return;
        }
        node.sibling.return = node.return;
        node = node.sibling;
      }
      return null;
    }
    var renderLanes = 0, currentlyRenderingFiber = null, currentHook = null, workInProgressHook = null, didScheduleRenderPhaseUpdate = false, didScheduleRenderPhaseUpdateDuringThisPass = false, shouldDoubleInvokeUserFnsInHooksDEV = false, localIdCounter = 0, thenableIndexCounter = 0, thenableState = null, globalClientIdCounter = 0;
    function throwInvalidHookError() {
      throw Error(formatProdErrorMessage(321));
    }
    function areHookInputsEqual(nextDeps, prevDeps) {
      if (null === prevDeps) return false;
      for (var i = 0; i < prevDeps.length && i < nextDeps.length; i++)
        if (!objectIs(nextDeps[i], prevDeps[i])) return false;
      return true;
    }
    function renderWithHooks(current, workInProgress2, Component, props, secondArg, nextRenderLanes) {
      renderLanes = nextRenderLanes;
      currentlyRenderingFiber = workInProgress2;
      workInProgress2.memoizedState = null;
      workInProgress2.updateQueue = null;
      workInProgress2.lanes = 0;
      ReactSharedInternals.H = null === current || null === current.memoizedState ? HooksDispatcherOnMount : HooksDispatcherOnUpdate;
      shouldDoubleInvokeUserFnsInHooksDEV = false;
      nextRenderLanes = Component(props, secondArg);
      shouldDoubleInvokeUserFnsInHooksDEV = false;
      didScheduleRenderPhaseUpdateDuringThisPass && (nextRenderLanes = renderWithHooksAgain(
        workInProgress2,
        Component,
        props,
        secondArg
      ));
      finishRenderingHooks(current);
      return nextRenderLanes;
    }
    function finishRenderingHooks(current) {
      ReactSharedInternals.H = ContextOnlyDispatcher;
      var didRenderTooFewHooks = null !== currentHook && null !== currentHook.next;
      renderLanes = 0;
      workInProgressHook = currentHook = currentlyRenderingFiber = null;
      didScheduleRenderPhaseUpdate = false;
      thenableIndexCounter = 0;
      thenableState = null;
      if (didRenderTooFewHooks) throw Error(formatProdErrorMessage(300));
      null === current || didReceiveUpdate || (current = current.dependencies, null !== current && checkIfContextChanged(current) && (didReceiveUpdate = true));
    }
    function renderWithHooksAgain(workInProgress2, Component, props, secondArg) {
      currentlyRenderingFiber = workInProgress2;
      var numberOfReRenders = 0;
      do {
        didScheduleRenderPhaseUpdateDuringThisPass && (thenableState = null);
        thenableIndexCounter = 0;
        didScheduleRenderPhaseUpdateDuringThisPass = false;
        if (25 <= numberOfReRenders) throw Error(formatProdErrorMessage(301));
        numberOfReRenders += 1;
        workInProgressHook = currentHook = null;
        if (null != workInProgress2.updateQueue) {
          var children = workInProgress2.updateQueue;
          children.lastEffect = null;
          children.events = null;
          children.stores = null;
          null != children.memoCache && (children.memoCache.index = 0);
        }
        ReactSharedInternals.H = HooksDispatcherOnRerender;
        children = Component(props, secondArg);
      } while (didScheduleRenderPhaseUpdateDuringThisPass);
      return children;
    }
    function TransitionAwareHostComponent() {
      var dispatcher = ReactSharedInternals.H, maybeThenable = dispatcher.useState()[0];
      maybeThenable = "function" === typeof maybeThenable.then ? useThenable(maybeThenable) : maybeThenable;
      dispatcher = dispatcher.useState()[0];
      (null !== currentHook ? currentHook.memoizedState : null) !== dispatcher && (currentlyRenderingFiber.flags |= 1024);
      return maybeThenable;
    }
    function checkDidRenderIdHook() {
      var didRenderIdHook = 0 !== localIdCounter;
      localIdCounter = 0;
      return didRenderIdHook;
    }
    function bailoutHooks(current, workInProgress2, lanes) {
      workInProgress2.updateQueue = current.updateQueue;
      workInProgress2.flags &= -2053;
      current.lanes &= ~lanes;
    }
    function resetHooksOnUnwind(workInProgress2) {
      if (didScheduleRenderPhaseUpdate) {
        for (workInProgress2 = workInProgress2.memoizedState; null !== workInProgress2; ) {
          var queue = workInProgress2.queue;
          null !== queue && (queue.pending = null);
          workInProgress2 = workInProgress2.next;
        }
        didScheduleRenderPhaseUpdate = false;
      }
      renderLanes = 0;
      workInProgressHook = currentHook = currentlyRenderingFiber = null;
      didScheduleRenderPhaseUpdateDuringThisPass = false;
      thenableIndexCounter = localIdCounter = 0;
      thenableState = null;
    }
    function mountWorkInProgressHook() {
      var hook = {
        memoizedState: null,
        baseState: null,
        baseQueue: null,
        queue: null,
        next: null
      };
      null === workInProgressHook ? currentlyRenderingFiber.memoizedState = workInProgressHook = hook : workInProgressHook = workInProgressHook.next = hook;
      return workInProgressHook;
    }
    function updateWorkInProgressHook() {
      if (null === currentHook) {
        var nextCurrentHook = currentlyRenderingFiber.alternate;
        nextCurrentHook = null !== nextCurrentHook ? nextCurrentHook.memoizedState : null;
      } else nextCurrentHook = currentHook.next;
      var nextWorkInProgressHook = null === workInProgressHook ? currentlyRenderingFiber.memoizedState : workInProgressHook.next;
      if (null !== nextWorkInProgressHook)
        workInProgressHook = nextWorkInProgressHook, currentHook = nextCurrentHook;
      else {
        if (null === nextCurrentHook) {
          if (null === currentlyRenderingFiber.alternate)
            throw Error(formatProdErrorMessage(467));
          throw Error(formatProdErrorMessage(310));
        }
        currentHook = nextCurrentHook;
        nextCurrentHook = {
          memoizedState: currentHook.memoizedState,
          baseState: currentHook.baseState,
          baseQueue: currentHook.baseQueue,
          queue: currentHook.queue,
          next: null
        };
        null === workInProgressHook ? currentlyRenderingFiber.memoizedState = workInProgressHook = nextCurrentHook : workInProgressHook = workInProgressHook.next = nextCurrentHook;
      }
      return workInProgressHook;
    }
    function createFunctionComponentUpdateQueue() {
      return { lastEffect: null, events: null, stores: null, memoCache: null };
    }
    function useThenable(thenable) {
      var index2 = thenableIndexCounter;
      thenableIndexCounter += 1;
      null === thenableState && (thenableState = []);
      thenable = trackUsedThenable(thenableState, thenable, index2);
      index2 = currentlyRenderingFiber;
      null === (null === workInProgressHook ? index2.memoizedState : workInProgressHook.next) && (index2 = index2.alternate, ReactSharedInternals.H = null === index2 || null === index2.memoizedState ? HooksDispatcherOnMount : HooksDispatcherOnUpdate);
      return thenable;
    }
    function use(usable) {
      if (null !== usable && "object" === typeof usable) {
        if ("function" === typeof usable.then) return useThenable(usable);
        if (usable.$$typeof === REACT_CONTEXT_TYPE) return readContext(usable);
      }
      throw Error(formatProdErrorMessage(438, String(usable)));
    }
    function useMemoCache(size) {
      var memoCache = null, updateQueue = currentlyRenderingFiber.updateQueue;
      null !== updateQueue && (memoCache = updateQueue.memoCache);
      if (null == memoCache) {
        var current = currentlyRenderingFiber.alternate;
        null !== current && (current = current.updateQueue, null !== current && (current = current.memoCache, null != current && (memoCache = {
          data: current.data.map(function(array) {
            return array.slice();
          }),
          index: 0
        })));
      }
      null == memoCache && (memoCache = { data: [], index: 0 });
      null === updateQueue && (updateQueue = createFunctionComponentUpdateQueue(), currentlyRenderingFiber.updateQueue = updateQueue);
      updateQueue.memoCache = memoCache;
      updateQueue = memoCache.data[memoCache.index];
      if (void 0 === updateQueue)
        for (updateQueue = memoCache.data[memoCache.index] = Array(size), current = 0; current < size; current++)
          updateQueue[current] = REACT_MEMO_CACHE_SENTINEL;
      memoCache.index++;
      return updateQueue;
    }
    function basicStateReducer(state, action) {
      return "function" === typeof action ? action(state) : action;
    }
    function updateReducer(reducer) {
      var hook = updateWorkInProgressHook();
      return updateReducerImpl(hook, currentHook, reducer);
    }
    function updateReducerImpl(hook, current, reducer) {
      var queue = hook.queue;
      if (null === queue) throw Error(formatProdErrorMessage(311));
      queue.lastRenderedReducer = reducer;
      var baseQueue = hook.baseQueue, pendingQueue = queue.pending;
      if (null !== pendingQueue) {
        if (null !== baseQueue) {
          var baseFirst = baseQueue.next;
          baseQueue.next = pendingQueue.next;
          pendingQueue.next = baseFirst;
        }
        current.baseQueue = baseQueue = pendingQueue;
        queue.pending = null;
      }
      pendingQueue = hook.baseState;
      if (null === baseQueue) hook.memoizedState = pendingQueue;
      else {
        current = baseQueue.next;
        var newBaseQueueFirst = baseFirst = null, newBaseQueueLast = null, update = current, didReadFromEntangledAsyncAction$60 = false;
        do {
          var updateLane = update.lane & -536870913;
          if (updateLane !== update.lane ? (workInProgressRootRenderLanes & updateLane) === updateLane : (renderLanes & updateLane) === updateLane) {
            var revertLane = update.revertLane;
            if (0 === revertLane)
              null !== newBaseQueueLast && (newBaseQueueLast = newBaseQueueLast.next = {
                lane: 0,
                revertLane: 0,
                gesture: null,
                action: update.action,
                hasEagerState: update.hasEagerState,
                eagerState: update.eagerState,
                next: null
              }), updateLane === currentEntangledLane && (didReadFromEntangledAsyncAction$60 = true);
            else if ((renderLanes & revertLane) === revertLane) {
              update = update.next;
              revertLane === currentEntangledLane && (didReadFromEntangledAsyncAction$60 = true);
              continue;
            } else
              updateLane = {
                lane: 0,
                revertLane: update.revertLane,
                gesture: null,
                action: update.action,
                hasEagerState: update.hasEagerState,
                eagerState: update.eagerState,
                next: null
              }, null === newBaseQueueLast ? (newBaseQueueFirst = newBaseQueueLast = updateLane, baseFirst = pendingQueue) : newBaseQueueLast = newBaseQueueLast.next = updateLane, currentlyRenderingFiber.lanes |= revertLane, workInProgressRootSkippedLanes |= revertLane;
            updateLane = update.action;
            shouldDoubleInvokeUserFnsInHooksDEV && reducer(pendingQueue, updateLane);
            pendingQueue = update.hasEagerState ? update.eagerState : reducer(pendingQueue, updateLane);
          } else
            revertLane = {
              lane: updateLane,
              revertLane: update.revertLane,
              gesture: update.gesture,
              action: update.action,
              hasEagerState: update.hasEagerState,
              eagerState: update.eagerState,
              next: null
            }, null === newBaseQueueLast ? (newBaseQueueFirst = newBaseQueueLast = revertLane, baseFirst = pendingQueue) : newBaseQueueLast = newBaseQueueLast.next = revertLane, currentlyRenderingFiber.lanes |= updateLane, workInProgressRootSkippedLanes |= updateLane;
          update = update.next;
        } while (null !== update && update !== current);
        null === newBaseQueueLast ? baseFirst = pendingQueue : newBaseQueueLast.next = newBaseQueueFirst;
        if (!objectIs(pendingQueue, hook.memoizedState) && (didReceiveUpdate = true, didReadFromEntangledAsyncAction$60 && (reducer = currentEntangledActionThenable, null !== reducer)))
          throw reducer;
        hook.memoizedState = pendingQueue;
        hook.baseState = baseFirst;
        hook.baseQueue = newBaseQueueLast;
        queue.lastRenderedState = pendingQueue;
      }
      null === baseQueue && (queue.lanes = 0);
      return [hook.memoizedState, queue.dispatch];
    }
    function rerenderReducer(reducer) {
      var hook = updateWorkInProgressHook(), queue = hook.queue;
      if (null === queue) throw Error(formatProdErrorMessage(311));
      queue.lastRenderedReducer = reducer;
      var dispatch = queue.dispatch, lastRenderPhaseUpdate = queue.pending, newState = hook.memoizedState;
      if (null !== lastRenderPhaseUpdate) {
        queue.pending = null;
        var update = lastRenderPhaseUpdate = lastRenderPhaseUpdate.next;
        do
          newState = reducer(newState, update.action), update = update.next;
        while (update !== lastRenderPhaseUpdate);
        objectIs(newState, hook.memoizedState) || (didReceiveUpdate = true);
        hook.memoizedState = newState;
        null === hook.baseQueue && (hook.baseState = newState);
        queue.lastRenderedState = newState;
      }
      return [newState, dispatch];
    }
    function updateSyncExternalStore(subscribe, getSnapshot, getServerSnapshot) {
      var fiber = currentlyRenderingFiber, hook = updateWorkInProgressHook(), isHydrating$jscomp$0 = isHydrating;
      if (isHydrating$jscomp$0) {
        if (void 0 === getServerSnapshot) throw Error(formatProdErrorMessage(407));
        getServerSnapshot = getServerSnapshot();
      } else getServerSnapshot = getSnapshot();
      var snapshotChanged = !objectIs(
        (currentHook || hook).memoizedState,
        getServerSnapshot
      );
      snapshotChanged && (hook.memoizedState = getServerSnapshot, didReceiveUpdate = true);
      hook = hook.queue;
      updateEffect(subscribeToStore.bind(null, fiber, hook, subscribe), [
        subscribe
      ]);
      if (hook.getSnapshot !== getSnapshot || snapshotChanged || null !== workInProgressHook && workInProgressHook.memoizedState.tag & 1) {
        fiber.flags |= 2048;
        pushSimpleEffect(
          9,
          { destroy: void 0 },
          updateStoreInstance.bind(
            null,
            fiber,
            hook,
            getServerSnapshot,
            getSnapshot
          ),
          null
        );
        if (null === workInProgressRoot) throw Error(formatProdErrorMessage(349));
        isHydrating$jscomp$0 || 0 !== (renderLanes & 127) || pushStoreConsistencyCheck(fiber, getSnapshot, getServerSnapshot);
      }
      return getServerSnapshot;
    }
    function pushStoreConsistencyCheck(fiber, getSnapshot, renderedSnapshot) {
      fiber.flags |= 16384;
      fiber = { getSnapshot, value: renderedSnapshot };
      getSnapshot = currentlyRenderingFiber.updateQueue;
      null === getSnapshot ? (getSnapshot = createFunctionComponentUpdateQueue(), currentlyRenderingFiber.updateQueue = getSnapshot, getSnapshot.stores = [fiber]) : (renderedSnapshot = getSnapshot.stores, null === renderedSnapshot ? getSnapshot.stores = [fiber] : renderedSnapshot.push(fiber));
    }
    function updateStoreInstance(fiber, inst, nextSnapshot, getSnapshot) {
      inst.value = nextSnapshot;
      inst.getSnapshot = getSnapshot;
      checkIfSnapshotChanged(inst) && forceStoreRerender(fiber);
    }
    function subscribeToStore(fiber, inst, subscribe) {
      return subscribe(function() {
        checkIfSnapshotChanged(inst) && forceStoreRerender(fiber);
      });
    }
    function checkIfSnapshotChanged(inst) {
      var latestGetSnapshot = inst.getSnapshot;
      inst = inst.value;
      try {
        var nextValue = latestGetSnapshot();
        return !objectIs(inst, nextValue);
      } catch (error) {
        return true;
      }
    }
    function forceStoreRerender(fiber) {
      var root2 = enqueueConcurrentRenderForLane(fiber, 2);
      null !== root2 && scheduleUpdateOnFiber(root2, fiber, 2);
    }
    function mountStateImpl(initialState) {
      var hook = mountWorkInProgressHook();
      if ("function" === typeof initialState) {
        var initialStateInitializer = initialState;
        initialState = initialStateInitializer();
        if (shouldDoubleInvokeUserFnsInHooksDEV) {
          setIsStrictModeForDevtools(true);
          try {
            initialStateInitializer();
          } finally {
            setIsStrictModeForDevtools(false);
          }
        }
      }
      hook.memoizedState = hook.baseState = initialState;
      hook.queue = {
        pending: null,
        lanes: 0,
        dispatch: null,
        lastRenderedReducer: basicStateReducer,
        lastRenderedState: initialState
      };
      return hook;
    }
    function updateOptimisticImpl(hook, current, passthrough, reducer) {
      hook.baseState = passthrough;
      return updateReducerImpl(
        hook,
        currentHook,
        "function" === typeof reducer ? reducer : basicStateReducer
      );
    }
    function dispatchActionState(fiber, actionQueue, setPendingState, setState, payload) {
      if (isRenderPhaseUpdate(fiber)) throw Error(formatProdErrorMessage(485));
      fiber = actionQueue.action;
      if (null !== fiber) {
        var actionNode = {
          payload,
          action: fiber,
          next: null,
          isTransition: true,
          status: "pending",
          value: null,
          reason: null,
          listeners: [],
          then: function(listener) {
            actionNode.listeners.push(listener);
          }
        };
        null !== ReactSharedInternals.T ? setPendingState(true) : actionNode.isTransition = false;
        setState(actionNode);
        setPendingState = actionQueue.pending;
        null === setPendingState ? (actionNode.next = actionQueue.pending = actionNode, runActionStateAction(actionQueue, actionNode)) : (actionNode.next = setPendingState.next, actionQueue.pending = setPendingState.next = actionNode);
      }
    }
    function runActionStateAction(actionQueue, node) {
      var action = node.action, payload = node.payload, prevState = actionQueue.state;
      if (node.isTransition) {
        var prevTransition = ReactSharedInternals.T, currentTransition = {};
        ReactSharedInternals.T = currentTransition;
        try {
          var returnValue = action(prevState, payload), onStartTransitionFinish = ReactSharedInternals.S;
          null !== onStartTransitionFinish && onStartTransitionFinish(currentTransition, returnValue);
          handleActionReturnValue(actionQueue, node, returnValue);
        } catch (error) {
          onActionError(actionQueue, node, error);
        } finally {
          null !== prevTransition && null !== currentTransition.types && (prevTransition.types = currentTransition.types), ReactSharedInternals.T = prevTransition;
        }
      } else
        try {
          prevTransition = action(prevState, payload), handleActionReturnValue(actionQueue, node, prevTransition);
        } catch (error$66) {
          onActionError(actionQueue, node, error$66);
        }
    }
    function handleActionReturnValue(actionQueue, node, returnValue) {
      null !== returnValue && "object" === typeof returnValue && "function" === typeof returnValue.then ? returnValue.then(
        function(nextState) {
          onActionSuccess(actionQueue, node, nextState);
        },
        function(error) {
          return onActionError(actionQueue, node, error);
        }
      ) : onActionSuccess(actionQueue, node, returnValue);
    }
    function onActionSuccess(actionQueue, actionNode, nextState) {
      actionNode.status = "fulfilled";
      actionNode.value = nextState;
      notifyActionListeners(actionNode);
      actionQueue.state = nextState;
      actionNode = actionQueue.pending;
      null !== actionNode && (nextState = actionNode.next, nextState === actionNode ? actionQueue.pending = null : (nextState = nextState.next, actionNode.next = nextState, runActionStateAction(actionQueue, nextState)));
    }
    function onActionError(actionQueue, actionNode, error) {
      var last = actionQueue.pending;
      actionQueue.pending = null;
      if (null !== last) {
        last = last.next;
        do
          actionNode.status = "rejected", actionNode.reason = error, notifyActionListeners(actionNode), actionNode = actionNode.next;
        while (actionNode !== last);
      }
      actionQueue.action = null;
    }
    function notifyActionListeners(actionNode) {
      actionNode = actionNode.listeners;
      for (var i = 0; i < actionNode.length; i++) (0, actionNode[i])();
    }
    function actionStateReducer(oldState, newState) {
      return newState;
    }
    function mountActionState(action, initialStateProp) {
      if (isHydrating) {
        var ssrFormState = workInProgressRoot.formState;
        if (null !== ssrFormState) {
          a: {
            var JSCompiler_inline_result = currentlyRenderingFiber;
            if (isHydrating) {
              if (nextHydratableInstance) {
                b: {
                  var JSCompiler_inline_result$jscomp$0 = nextHydratableInstance;
                  for (var inRootOrSingleton = rootOrSingletonContext; 8 !== JSCompiler_inline_result$jscomp$0.nodeType; ) {
                    if (!inRootOrSingleton) {
                      JSCompiler_inline_result$jscomp$0 = null;
                      break b;
                    }
                    JSCompiler_inline_result$jscomp$0 = getNextHydratable(
                      JSCompiler_inline_result$jscomp$0.nextSibling
                    );
                    if (null === JSCompiler_inline_result$jscomp$0) {
                      JSCompiler_inline_result$jscomp$0 = null;
                      break b;
                    }
                  }
                  inRootOrSingleton = JSCompiler_inline_result$jscomp$0.data;
                  JSCompiler_inline_result$jscomp$0 = "F!" === inRootOrSingleton || "F" === inRootOrSingleton ? JSCompiler_inline_result$jscomp$0 : null;
                }
                if (JSCompiler_inline_result$jscomp$0) {
                  nextHydratableInstance = getNextHydratable(
                    JSCompiler_inline_result$jscomp$0.nextSibling
                  );
                  JSCompiler_inline_result = "F!" === JSCompiler_inline_result$jscomp$0.data;
                  break a;
                }
              }
              throwOnHydrationMismatch(JSCompiler_inline_result);
            }
            JSCompiler_inline_result = false;
          }
          JSCompiler_inline_result && (initialStateProp = ssrFormState[0]);
        }
      }
      ssrFormState = mountWorkInProgressHook();
      ssrFormState.memoizedState = ssrFormState.baseState = initialStateProp;
      JSCompiler_inline_result = {
        pending: null,
        lanes: 0,
        dispatch: null,
        lastRenderedReducer: actionStateReducer,
        lastRenderedState: initialStateProp
      };
      ssrFormState.queue = JSCompiler_inline_result;
      ssrFormState = dispatchSetState.bind(
        null,
        currentlyRenderingFiber,
        JSCompiler_inline_result
      );
      JSCompiler_inline_result.dispatch = ssrFormState;
      JSCompiler_inline_result = mountStateImpl(false);
      inRootOrSingleton = dispatchOptimisticSetState.bind(
        null,
        currentlyRenderingFiber,
        false,
        JSCompiler_inline_result.queue
      );
      JSCompiler_inline_result = mountWorkInProgressHook();
      JSCompiler_inline_result$jscomp$0 = {
        state: initialStateProp,
        dispatch: null,
        action,
        pending: null
      };
      JSCompiler_inline_result.queue = JSCompiler_inline_result$jscomp$0;
      ssrFormState = dispatchActionState.bind(
        null,
        currentlyRenderingFiber,
        JSCompiler_inline_result$jscomp$0,
        inRootOrSingleton,
        ssrFormState
      );
      JSCompiler_inline_result$jscomp$0.dispatch = ssrFormState;
      JSCompiler_inline_result.memoizedState = action;
      return [initialStateProp, ssrFormState, false];
    }
    function updateActionState(action) {
      var stateHook = updateWorkInProgressHook();
      return updateActionStateImpl(stateHook, currentHook, action);
    }
    function updateActionStateImpl(stateHook, currentStateHook, action) {
      currentStateHook = updateReducerImpl(
        stateHook,
        currentStateHook,
        actionStateReducer
      )[0];
      stateHook = updateReducer(basicStateReducer)[0];
      if ("object" === typeof currentStateHook && null !== currentStateHook && "function" === typeof currentStateHook.then)
        try {
          var state = useThenable(currentStateHook);
        } catch (x) {
          if (x === SuspenseException) throw SuspenseActionException;
          throw x;
        }
      else state = currentStateHook;
      currentStateHook = updateWorkInProgressHook();
      var actionQueue = currentStateHook.queue, dispatch = actionQueue.dispatch;
      action !== currentStateHook.memoizedState && (currentlyRenderingFiber.flags |= 2048, pushSimpleEffect(
        9,
        { destroy: void 0 },
        actionStateActionEffect.bind(null, actionQueue, action),
        null
      ));
      return [state, dispatch, stateHook];
    }
    function actionStateActionEffect(actionQueue, action) {
      actionQueue.action = action;
    }
    function rerenderActionState(action) {
      var stateHook = updateWorkInProgressHook(), currentStateHook = currentHook;
      if (null !== currentStateHook)
        return updateActionStateImpl(stateHook, currentStateHook, action);
      updateWorkInProgressHook();
      stateHook = stateHook.memoizedState;
      currentStateHook = updateWorkInProgressHook();
      var dispatch = currentStateHook.queue.dispatch;
      currentStateHook.memoizedState = action;
      return [stateHook, dispatch, false];
    }
    function pushSimpleEffect(tag, inst, create2, deps) {
      tag = { tag, create: create2, deps, inst, next: null };
      inst = currentlyRenderingFiber.updateQueue;
      null === inst && (inst = createFunctionComponentUpdateQueue(), currentlyRenderingFiber.updateQueue = inst);
      create2 = inst.lastEffect;
      null === create2 ? inst.lastEffect = tag.next = tag : (deps = create2.next, create2.next = tag, tag.next = deps, inst.lastEffect = tag);
      return tag;
    }
    function updateRef() {
      return updateWorkInProgressHook().memoizedState;
    }
    function mountEffectImpl(fiberFlags, hookFlags, create2, deps) {
      var hook = mountWorkInProgressHook();
      currentlyRenderingFiber.flags |= fiberFlags;
      hook.memoizedState = pushSimpleEffect(
        1 | hookFlags,
        { destroy: void 0 },
        create2,
        void 0 === deps ? null : deps
      );
    }
    function updateEffectImpl(fiberFlags, hookFlags, create2, deps) {
      var hook = updateWorkInProgressHook();
      deps = void 0 === deps ? null : deps;
      var inst = hook.memoizedState.inst;
      null !== currentHook && null !== deps && areHookInputsEqual(deps, currentHook.memoizedState.deps) ? hook.memoizedState = pushSimpleEffect(hookFlags, inst, create2, deps) : (currentlyRenderingFiber.flags |= fiberFlags, hook.memoizedState = pushSimpleEffect(
        1 | hookFlags,
        inst,
        create2,
        deps
      ));
    }
    function mountEffect(create2, deps) {
      mountEffectImpl(8390656, 8, create2, deps);
    }
    function updateEffect(create2, deps) {
      updateEffectImpl(2048, 8, create2, deps);
    }
    function useEffectEventImpl(payload) {
      currentlyRenderingFiber.flags |= 4;
      var componentUpdateQueue = currentlyRenderingFiber.updateQueue;
      if (null === componentUpdateQueue)
        componentUpdateQueue = createFunctionComponentUpdateQueue(), currentlyRenderingFiber.updateQueue = componentUpdateQueue, componentUpdateQueue.events = [payload];
      else {
        var events = componentUpdateQueue.events;
        null === events ? componentUpdateQueue.events = [payload] : events.push(payload);
      }
    }
    function updateEvent(callback) {
      var ref = updateWorkInProgressHook().memoizedState;
      useEffectEventImpl({ ref, nextImpl: callback });
      return function() {
        if (0 !== (executionContext & 2)) throw Error(formatProdErrorMessage(440));
        return ref.impl.apply(void 0, arguments);
      };
    }
    function updateInsertionEffect(create2, deps) {
      return updateEffectImpl(4, 2, create2, deps);
    }
    function updateLayoutEffect(create2, deps) {
      return updateEffectImpl(4, 4, create2, deps);
    }
    function imperativeHandleEffect(create2, ref) {
      if ("function" === typeof ref) {
        create2 = create2();
        var refCleanup = ref(create2);
        return function() {
          "function" === typeof refCleanup ? refCleanup() : ref(null);
        };
      }
      if (null !== ref && void 0 !== ref)
        return create2 = create2(), ref.current = create2, function() {
          ref.current = null;
        };
    }
    function updateImperativeHandle(ref, create2, deps) {
      deps = null !== deps && void 0 !== deps ? deps.concat([ref]) : null;
      updateEffectImpl(4, 4, imperativeHandleEffect.bind(null, create2, ref), deps);
    }
    function mountDebugValue() {
    }
    function updateCallback(callback, deps) {
      var hook = updateWorkInProgressHook();
      deps = void 0 === deps ? null : deps;
      var prevState = hook.memoizedState;
      if (null !== deps && areHookInputsEqual(deps, prevState[1]))
        return prevState[0];
      hook.memoizedState = [callback, deps];
      return callback;
    }
    function updateMemo(nextCreate, deps) {
      var hook = updateWorkInProgressHook();
      deps = void 0 === deps ? null : deps;
      var prevState = hook.memoizedState;
      if (null !== deps && areHookInputsEqual(deps, prevState[1]))
        return prevState[0];
      prevState = nextCreate();
      if (shouldDoubleInvokeUserFnsInHooksDEV) {
        setIsStrictModeForDevtools(true);
        try {
          nextCreate();
        } finally {
          setIsStrictModeForDevtools(false);
        }
      }
      hook.memoizedState = [prevState, deps];
      return prevState;
    }
    function mountDeferredValueImpl(hook, value, initialValue) {
      if (void 0 === initialValue || 0 !== (renderLanes & 1073741824) && 0 === (workInProgressRootRenderLanes & 261930))
        return hook.memoizedState = value;
      hook.memoizedState = initialValue;
      hook = requestDeferredLane();
      currentlyRenderingFiber.lanes |= hook;
      workInProgressRootSkippedLanes |= hook;
      return initialValue;
    }
    function updateDeferredValueImpl(hook, prevValue, value, initialValue) {
      if (objectIs(value, prevValue)) return value;
      if (null !== currentTreeHiddenStackCursor.current)
        return hook = mountDeferredValueImpl(hook, value, initialValue), objectIs(hook, prevValue) || (didReceiveUpdate = true), hook;
      if (0 === (renderLanes & 42) || 0 !== (renderLanes & 1073741824) && 0 === (workInProgressRootRenderLanes & 261930))
        return didReceiveUpdate = true, hook.memoizedState = value;
      hook = requestDeferredLane();
      currentlyRenderingFiber.lanes |= hook;
      workInProgressRootSkippedLanes |= hook;
      return prevValue;
    }
    function startTransition(fiber, queue, pendingState, finishedState, callback) {
      var previousPriority = ReactDOMSharedInternals.p;
      ReactDOMSharedInternals.p = 0 !== previousPriority && 8 > previousPriority ? previousPriority : 8;
      var prevTransition = ReactSharedInternals.T, currentTransition = {};
      ReactSharedInternals.T = currentTransition;
      dispatchOptimisticSetState(fiber, false, queue, pendingState);
      try {
        var returnValue = callback(), onStartTransitionFinish = ReactSharedInternals.S;
        null !== onStartTransitionFinish && onStartTransitionFinish(currentTransition, returnValue);
        if (null !== returnValue && "object" === typeof returnValue && "function" === typeof returnValue.then) {
          var thenableForFinishedState = chainThenableValue(
            returnValue,
            finishedState
          );
          dispatchSetStateInternal(
            fiber,
            queue,
            thenableForFinishedState,
            requestUpdateLane(fiber)
          );
        } else
          dispatchSetStateInternal(
            fiber,
            queue,
            finishedState,
            requestUpdateLane(fiber)
          );
      } catch (error) {
        dispatchSetStateInternal(
          fiber,
          queue,
          { then: function() {
          }, status: "rejected", reason: error },
          requestUpdateLane()
        );
      } finally {
        ReactDOMSharedInternals.p = previousPriority, null !== prevTransition && null !== currentTransition.types && (prevTransition.types = currentTransition.types), ReactSharedInternals.T = prevTransition;
      }
    }
    function noop() {
    }
    function startHostTransition(formFiber, pendingState, action, formData) {
      if (5 !== formFiber.tag) throw Error(formatProdErrorMessage(476));
      var queue = ensureFormComponentIsStateful(formFiber).queue;
      startTransition(
        formFiber,
        queue,
        pendingState,
        sharedNotPendingObject,
        null === action ? noop : function() {
          requestFormReset$1(formFiber);
          return action(formData);
        }
      );
    }
    function ensureFormComponentIsStateful(formFiber) {
      var existingStateHook = formFiber.memoizedState;
      if (null !== existingStateHook) return existingStateHook;
      existingStateHook = {
        memoizedState: sharedNotPendingObject,
        baseState: sharedNotPendingObject,
        baseQueue: null,
        queue: {
          pending: null,
          lanes: 0,
          dispatch: null,
          lastRenderedReducer: basicStateReducer,
          lastRenderedState: sharedNotPendingObject
        },
        next: null
      };
      var initialResetState = {};
      existingStateHook.next = {
        memoizedState: initialResetState,
        baseState: initialResetState,
        baseQueue: null,
        queue: {
          pending: null,
          lanes: 0,
          dispatch: null,
          lastRenderedReducer: basicStateReducer,
          lastRenderedState: initialResetState
        },
        next: null
      };
      formFiber.memoizedState = existingStateHook;
      formFiber = formFiber.alternate;
      null !== formFiber && (formFiber.memoizedState = existingStateHook);
      return existingStateHook;
    }
    function requestFormReset$1(formFiber) {
      var stateHook = ensureFormComponentIsStateful(formFiber);
      null === stateHook.next && (stateHook = formFiber.alternate.memoizedState);
      dispatchSetStateInternal(
        formFiber,
        stateHook.next.queue,
        {},
        requestUpdateLane()
      );
    }
    function useHostTransitionStatus() {
      return readContext(HostTransitionContext);
    }
    function updateId() {
      return updateWorkInProgressHook().memoizedState;
    }
    function updateRefresh() {
      return updateWorkInProgressHook().memoizedState;
    }
    function refreshCache(fiber) {
      for (var provider = fiber.return; null !== provider; ) {
        switch (provider.tag) {
          case 24:
          case 3:
            var lane = requestUpdateLane();
            fiber = createUpdate(lane);
            var root$69 = enqueueUpdate(provider, fiber, lane);
            null !== root$69 && (scheduleUpdateOnFiber(root$69, provider, lane), entangleTransitions(root$69, provider, lane));
            provider = { cache: createCache() };
            fiber.payload = provider;
            return;
        }
        provider = provider.return;
      }
    }
    function dispatchReducerAction(fiber, queue, action) {
      var lane = requestUpdateLane();
      action = {
        lane,
        revertLane: 0,
        gesture: null,
        action,
        hasEagerState: false,
        eagerState: null,
        next: null
      };
      isRenderPhaseUpdate(fiber) ? enqueueRenderPhaseUpdate(queue, action) : (action = enqueueConcurrentHookUpdate(fiber, queue, action, lane), null !== action && (scheduleUpdateOnFiber(action, fiber, lane), entangleTransitionUpdate(action, queue, lane)));
    }
    function dispatchSetState(fiber, queue, action) {
      var lane = requestUpdateLane();
      dispatchSetStateInternal(fiber, queue, action, lane);
    }
    function dispatchSetStateInternal(fiber, queue, action, lane) {
      var update = {
        lane,
        revertLane: 0,
        gesture: null,
        action,
        hasEagerState: false,
        eagerState: null,
        next: null
      };
      if (isRenderPhaseUpdate(fiber)) enqueueRenderPhaseUpdate(queue, update);
      else {
        var alternate = fiber.alternate;
        if (0 === fiber.lanes && (null === alternate || 0 === alternate.lanes) && (alternate = queue.lastRenderedReducer, null !== alternate))
          try {
            var currentState = queue.lastRenderedState, eagerState = alternate(currentState, action);
            update.hasEagerState = true;
            update.eagerState = eagerState;
            if (objectIs(eagerState, currentState))
              return enqueueUpdate$1(fiber, queue, update, 0), null === workInProgressRoot && finishQueueingConcurrentUpdates(), false;
          } catch (error) {
          } finally {
          }
        action = enqueueConcurrentHookUpdate(fiber, queue, update, lane);
        if (null !== action)
          return scheduleUpdateOnFiber(action, fiber, lane), entangleTransitionUpdate(action, queue, lane), true;
      }
      return false;
    }
    function dispatchOptimisticSetState(fiber, throwIfDuringRender, queue, action) {
      action = {
        lane: 2,
        revertLane: requestTransitionLane(),
        gesture: null,
        action,
        hasEagerState: false,
        eagerState: null,
        next: null
      };
      if (isRenderPhaseUpdate(fiber)) {
        if (throwIfDuringRender) throw Error(formatProdErrorMessage(479));
      } else
        throwIfDuringRender = enqueueConcurrentHookUpdate(
          fiber,
          queue,
          action,
          2
        ), null !== throwIfDuringRender && scheduleUpdateOnFiber(throwIfDuringRender, fiber, 2);
    }
    function isRenderPhaseUpdate(fiber) {
      var alternate = fiber.alternate;
      return fiber === currentlyRenderingFiber || null !== alternate && alternate === currentlyRenderingFiber;
    }
    function enqueueRenderPhaseUpdate(queue, update) {
      didScheduleRenderPhaseUpdateDuringThisPass = didScheduleRenderPhaseUpdate = true;
      var pending = queue.pending;
      null === pending ? update.next = update : (update.next = pending.next, pending.next = update);
      queue.pending = update;
    }
    function entangleTransitionUpdate(root2, queue, lane) {
      if (0 !== (lane & 4194048)) {
        var queueLanes = queue.lanes;
        queueLanes &= root2.pendingLanes;
        lane |= queueLanes;
        queue.lanes = lane;
        markRootEntangled(root2, lane);
      }
    }
    var ContextOnlyDispatcher = {
      readContext,
      use,
      useCallback: throwInvalidHookError,
      useContext: throwInvalidHookError,
      useEffect: throwInvalidHookError,
      useImperativeHandle: throwInvalidHookError,
      useLayoutEffect: throwInvalidHookError,
      useInsertionEffect: throwInvalidHookError,
      useMemo: throwInvalidHookError,
      useReducer: throwInvalidHookError,
      useRef: throwInvalidHookError,
      useState: throwInvalidHookError,
      useDebugValue: throwInvalidHookError,
      useDeferredValue: throwInvalidHookError,
      useTransition: throwInvalidHookError,
      useSyncExternalStore: throwInvalidHookError,
      useId: throwInvalidHookError,
      useHostTransitionStatus: throwInvalidHookError,
      useFormState: throwInvalidHookError,
      useActionState: throwInvalidHookError,
      useOptimistic: throwInvalidHookError,
      useMemoCache: throwInvalidHookError,
      useCacheRefresh: throwInvalidHookError
    };
    ContextOnlyDispatcher.useEffectEvent = throwInvalidHookError;
    var HooksDispatcherOnMount = {
      readContext,
      use,
      useCallback: function(callback, deps) {
        mountWorkInProgressHook().memoizedState = [
          callback,
          void 0 === deps ? null : deps
        ];
        return callback;
      },
      useContext: readContext,
      useEffect: mountEffect,
      useImperativeHandle: function(ref, create2, deps) {
        deps = null !== deps && void 0 !== deps ? deps.concat([ref]) : null;
        mountEffectImpl(
          4194308,
          4,
          imperativeHandleEffect.bind(null, create2, ref),
          deps
        );
      },
      useLayoutEffect: function(create2, deps) {
        return mountEffectImpl(4194308, 4, create2, deps);
      },
      useInsertionEffect: function(create2, deps) {
        mountEffectImpl(4, 2, create2, deps);
      },
      useMemo: function(nextCreate, deps) {
        var hook = mountWorkInProgressHook();
        deps = void 0 === deps ? null : deps;
        var nextValue = nextCreate();
        if (shouldDoubleInvokeUserFnsInHooksDEV) {
          setIsStrictModeForDevtools(true);
          try {
            nextCreate();
          } finally {
            setIsStrictModeForDevtools(false);
          }
        }
        hook.memoizedState = [nextValue, deps];
        return nextValue;
      },
      useReducer: function(reducer, initialArg, init) {
        var hook = mountWorkInProgressHook();
        if (void 0 !== init) {
          var initialState = init(initialArg);
          if (shouldDoubleInvokeUserFnsInHooksDEV) {
            setIsStrictModeForDevtools(true);
            try {
              init(initialArg);
            } finally {
              setIsStrictModeForDevtools(false);
            }
          }
        } else initialState = initialArg;
        hook.memoizedState = hook.baseState = initialState;
        reducer = {
          pending: null,
          lanes: 0,
          dispatch: null,
          lastRenderedReducer: reducer,
          lastRenderedState: initialState
        };
        hook.queue = reducer;
        reducer = reducer.dispatch = dispatchReducerAction.bind(
          null,
          currentlyRenderingFiber,
          reducer
        );
        return [hook.memoizedState, reducer];
      },
      useRef: function(initialValue) {
        var hook = mountWorkInProgressHook();
        initialValue = { current: initialValue };
        return hook.memoizedState = initialValue;
      },
      useState: function(initialState) {
        initialState = mountStateImpl(initialState);
        var queue = initialState.queue, dispatch = dispatchSetState.bind(null, currentlyRenderingFiber, queue);
        queue.dispatch = dispatch;
        return [initialState.memoizedState, dispatch];
      },
      useDebugValue: mountDebugValue,
      useDeferredValue: function(value, initialValue) {
        var hook = mountWorkInProgressHook();
        return mountDeferredValueImpl(hook, value, initialValue);
      },
      useTransition: function() {
        var stateHook = mountStateImpl(false);
        stateHook = startTransition.bind(
          null,
          currentlyRenderingFiber,
          stateHook.queue,
          true,
          false
        );
        mountWorkInProgressHook().memoizedState = stateHook;
        return [false, stateHook];
      },
      useSyncExternalStore: function(subscribe, getSnapshot, getServerSnapshot) {
        var fiber = currentlyRenderingFiber, hook = mountWorkInProgressHook();
        if (isHydrating) {
          if (void 0 === getServerSnapshot)
            throw Error(formatProdErrorMessage(407));
          getServerSnapshot = getServerSnapshot();
        } else {
          getServerSnapshot = getSnapshot();
          if (null === workInProgressRoot)
            throw Error(formatProdErrorMessage(349));
          0 !== (workInProgressRootRenderLanes & 127) || pushStoreConsistencyCheck(fiber, getSnapshot, getServerSnapshot);
        }
        hook.memoizedState = getServerSnapshot;
        var inst = { value: getServerSnapshot, getSnapshot };
        hook.queue = inst;
        mountEffect(subscribeToStore.bind(null, fiber, inst, subscribe), [
          subscribe
        ]);
        fiber.flags |= 2048;
        pushSimpleEffect(
          9,
          { destroy: void 0 },
          updateStoreInstance.bind(
            null,
            fiber,
            inst,
            getServerSnapshot,
            getSnapshot
          ),
          null
        );
        return getServerSnapshot;
      },
      useId: function() {
        var hook = mountWorkInProgressHook(), identifierPrefix = workInProgressRoot.identifierPrefix;
        if (isHydrating) {
          var JSCompiler_inline_result = treeContextOverflow;
          var idWithLeadingBit = treeContextId;
          JSCompiler_inline_result = (idWithLeadingBit & ~(1 << 32 - clz32(idWithLeadingBit) - 1)).toString(32) + JSCompiler_inline_result;
          identifierPrefix = "_" + identifierPrefix + "R_" + JSCompiler_inline_result;
          JSCompiler_inline_result = localIdCounter++;
          0 < JSCompiler_inline_result && (identifierPrefix += "H" + JSCompiler_inline_result.toString(32));
          identifierPrefix += "_";
        } else
          JSCompiler_inline_result = globalClientIdCounter++, identifierPrefix = "_" + identifierPrefix + "r_" + JSCompiler_inline_result.toString(32) + "_";
        return hook.memoizedState = identifierPrefix;
      },
      useHostTransitionStatus,
      useFormState: mountActionState,
      useActionState: mountActionState,
      useOptimistic: function(passthrough) {
        var hook = mountWorkInProgressHook();
        hook.memoizedState = hook.baseState = passthrough;
        var queue = {
          pending: null,
          lanes: 0,
          dispatch: null,
          lastRenderedReducer: null,
          lastRenderedState: null
        };
        hook.queue = queue;
        hook = dispatchOptimisticSetState.bind(
          null,
          currentlyRenderingFiber,
          true,
          queue
        );
        queue.dispatch = hook;
        return [passthrough, hook];
      },
      useMemoCache,
      useCacheRefresh: function() {
        return mountWorkInProgressHook().memoizedState = refreshCache.bind(
          null,
          currentlyRenderingFiber
        );
      },
      useEffectEvent: function(callback) {
        var hook = mountWorkInProgressHook(), ref = { impl: callback };
        hook.memoizedState = ref;
        return function() {
          if (0 !== (executionContext & 2))
            throw Error(formatProdErrorMessage(440));
          return ref.impl.apply(void 0, arguments);
        };
      }
    }, HooksDispatcherOnUpdate = {
      readContext,
      use,
      useCallback: updateCallback,
      useContext: readContext,
      useEffect: updateEffect,
      useImperativeHandle: updateImperativeHandle,
      useInsertionEffect: updateInsertionEffect,
      useLayoutEffect: updateLayoutEffect,
      useMemo: updateMemo,
      useReducer: updateReducer,
      useRef: updateRef,
      useState: function() {
        return updateReducer(basicStateReducer);
      },
      useDebugValue: mountDebugValue,
      useDeferredValue: function(value, initialValue) {
        var hook = updateWorkInProgressHook();
        return updateDeferredValueImpl(
          hook,
          currentHook.memoizedState,
          value,
          initialValue
        );
      },
      useTransition: function() {
        var booleanOrThenable = updateReducer(basicStateReducer)[0], start = updateWorkInProgressHook().memoizedState;
        return [
          "boolean" === typeof booleanOrThenable ? booleanOrThenable : useThenable(booleanOrThenable),
          start
        ];
      },
      useSyncExternalStore: updateSyncExternalStore,
      useId: updateId,
      useHostTransitionStatus,
      useFormState: updateActionState,
      useActionState: updateActionState,
      useOptimistic: function(passthrough, reducer) {
        var hook = updateWorkInProgressHook();
        return updateOptimisticImpl(hook, currentHook, passthrough, reducer);
      },
      useMemoCache,
      useCacheRefresh: updateRefresh
    };
    HooksDispatcherOnUpdate.useEffectEvent = updateEvent;
    var HooksDispatcherOnRerender = {
      readContext,
      use,
      useCallback: updateCallback,
      useContext: readContext,
      useEffect: updateEffect,
      useImperativeHandle: updateImperativeHandle,
      useInsertionEffect: updateInsertionEffect,
      useLayoutEffect: updateLayoutEffect,
      useMemo: updateMemo,
      useReducer: rerenderReducer,
      useRef: updateRef,
      useState: function() {
        return rerenderReducer(basicStateReducer);
      },
      useDebugValue: mountDebugValue,
      useDeferredValue: function(value, initialValue) {
        var hook = updateWorkInProgressHook();
        return null === currentHook ? mountDeferredValueImpl(hook, value, initialValue) : updateDeferredValueImpl(
          hook,
          currentHook.memoizedState,
          value,
          initialValue
        );
      },
      useTransition: function() {
        var booleanOrThenable = rerenderReducer(basicStateReducer)[0], start = updateWorkInProgressHook().memoizedState;
        return [
          "boolean" === typeof booleanOrThenable ? booleanOrThenable : useThenable(booleanOrThenable),
          start
        ];
      },
      useSyncExternalStore: updateSyncExternalStore,
      useId: updateId,
      useHostTransitionStatus,
      useFormState: rerenderActionState,
      useActionState: rerenderActionState,
      useOptimistic: function(passthrough, reducer) {
        var hook = updateWorkInProgressHook();
        if (null !== currentHook)
          return updateOptimisticImpl(hook, currentHook, passthrough, reducer);
        hook.baseState = passthrough;
        return [passthrough, hook.queue.dispatch];
      },
      useMemoCache,
      useCacheRefresh: updateRefresh
    };
    HooksDispatcherOnRerender.useEffectEvent = updateEvent;
    function applyDerivedStateFromProps(workInProgress2, ctor, getDerivedStateFromProps, nextProps) {
      ctor = workInProgress2.memoizedState;
      getDerivedStateFromProps = getDerivedStateFromProps(nextProps, ctor);
      getDerivedStateFromProps = null === getDerivedStateFromProps || void 0 === getDerivedStateFromProps ? ctor : assign({}, ctor, getDerivedStateFromProps);
      workInProgress2.memoizedState = getDerivedStateFromProps;
      0 === workInProgress2.lanes && (workInProgress2.updateQueue.baseState = getDerivedStateFromProps);
    }
    var classComponentUpdater = {
      enqueueSetState: function(inst, payload, callback) {
        inst = inst._reactInternals;
        var lane = requestUpdateLane(), update = createUpdate(lane);
        update.payload = payload;
        void 0 !== callback && null !== callback && (update.callback = callback);
        payload = enqueueUpdate(inst, update, lane);
        null !== payload && (scheduleUpdateOnFiber(payload, inst, lane), entangleTransitions(payload, inst, lane));
      },
      enqueueReplaceState: function(inst, payload, callback) {
        inst = inst._reactInternals;
        var lane = requestUpdateLane(), update = createUpdate(lane);
        update.tag = 1;
        update.payload = payload;
        void 0 !== callback && null !== callback && (update.callback = callback);
        payload = enqueueUpdate(inst, update, lane);
        null !== payload && (scheduleUpdateOnFiber(payload, inst, lane), entangleTransitions(payload, inst, lane));
      },
      enqueueForceUpdate: function(inst, callback) {
        inst = inst._reactInternals;
        var lane = requestUpdateLane(), update = createUpdate(lane);
        update.tag = 2;
        void 0 !== callback && null !== callback && (update.callback = callback);
        callback = enqueueUpdate(inst, update, lane);
        null !== callback && (scheduleUpdateOnFiber(callback, inst, lane), entangleTransitions(callback, inst, lane));
      }
    };
    function checkShouldComponentUpdate(workInProgress2, ctor, oldProps, newProps, oldState, newState, nextContext) {
      workInProgress2 = workInProgress2.stateNode;
      return "function" === typeof workInProgress2.shouldComponentUpdate ? workInProgress2.shouldComponentUpdate(newProps, newState, nextContext) : ctor.prototype && ctor.prototype.isPureReactComponent ? !shallowEqual(oldProps, newProps) || !shallowEqual(oldState, newState) : true;
    }
    function callComponentWillReceiveProps(workInProgress2, instance, newProps, nextContext) {
      workInProgress2 = instance.state;
      "function" === typeof instance.componentWillReceiveProps && instance.componentWillReceiveProps(newProps, nextContext);
      "function" === typeof instance.UNSAFE_componentWillReceiveProps && instance.UNSAFE_componentWillReceiveProps(newProps, nextContext);
      instance.state !== workInProgress2 && classComponentUpdater.enqueueReplaceState(instance, instance.state, null);
    }
    function resolveClassComponentProps(Component, baseProps) {
      var newProps = baseProps;
      if ("ref" in baseProps) {
        newProps = {};
        for (var propName in baseProps)
          "ref" !== propName && (newProps[propName] = baseProps[propName]);
      }
      if (Component = Component.defaultProps) {
        newProps === baseProps && (newProps = assign({}, newProps));
        for (var propName$73 in Component)
          void 0 === newProps[propName$73] && (newProps[propName$73] = Component[propName$73]);
      }
      return newProps;
    }
    function defaultOnUncaughtError(error) {
      reportGlobalError(error);
    }
    function defaultOnCaughtError(error) {
      console.error(error);
    }
    function defaultOnRecoverableError(error) {
      reportGlobalError(error);
    }
    function logUncaughtError(root2, errorInfo) {
      try {
        var onUncaughtError = root2.onUncaughtError;
        onUncaughtError(errorInfo.value, { componentStack: errorInfo.stack });
      } catch (e$74) {
        setTimeout(function() {
          throw e$74;
        });
      }
    }
    function logCaughtError(root2, boundary, errorInfo) {
      try {
        var onCaughtError = root2.onCaughtError;
        onCaughtError(errorInfo.value, {
          componentStack: errorInfo.stack,
          errorBoundary: 1 === boundary.tag ? boundary.stateNode : null
        });
      } catch (e$75) {
        setTimeout(function() {
          throw e$75;
        });
      }
    }
    function createRootErrorUpdate(root2, errorInfo, lane) {
      lane = createUpdate(lane);
      lane.tag = 3;
      lane.payload = { element: null };
      lane.callback = function() {
        logUncaughtError(root2, errorInfo);
      };
      return lane;
    }
    function createClassErrorUpdate(lane) {
      lane = createUpdate(lane);
      lane.tag = 3;
      return lane;
    }
    function initializeClassErrorUpdate(update, root2, fiber, errorInfo) {
      var getDerivedStateFromError = fiber.type.getDerivedStateFromError;
      if ("function" === typeof getDerivedStateFromError) {
        var error = errorInfo.value;
        update.payload = function() {
          return getDerivedStateFromError(error);
        };
        update.callback = function() {
          logCaughtError(root2, fiber, errorInfo);
        };
      }
      var inst = fiber.stateNode;
      null !== inst && "function" === typeof inst.componentDidCatch && (update.callback = function() {
        logCaughtError(root2, fiber, errorInfo);
        "function" !== typeof getDerivedStateFromError && (null === legacyErrorBoundariesThatAlreadyFailed ? legacyErrorBoundariesThatAlreadyFailed = new Set([this]) : legacyErrorBoundariesThatAlreadyFailed.add(this));
        var stack = errorInfo.stack;
        this.componentDidCatch(errorInfo.value, {
          componentStack: null !== stack ? stack : ""
        });
      });
    }
    function throwException(root2, returnFiber, sourceFiber, value, rootRenderLanes) {
      sourceFiber.flags |= 32768;
      if (null !== value && "object" === typeof value && "function" === typeof value.then) {
        returnFiber = sourceFiber.alternate;
        null !== returnFiber && propagateParentContextChanges(
          returnFiber,
          sourceFiber,
          rootRenderLanes,
          true
        );
        sourceFiber = suspenseHandlerStackCursor.current;
        if (null !== sourceFiber) {
          switch (sourceFiber.tag) {
            case 31:
            case 13:
              return null === shellBoundary ? renderDidSuspendDelayIfPossible() : null === sourceFiber.alternate && 0 === workInProgressRootExitStatus && (workInProgressRootExitStatus = 3), sourceFiber.flags &= -257, sourceFiber.flags |= 65536, sourceFiber.lanes = rootRenderLanes, value === noopSuspenseyCommitThenable ? sourceFiber.flags |= 16384 : (returnFiber = sourceFiber.updateQueue, null === returnFiber ? sourceFiber.updateQueue = new Set([value]) : returnFiber.add(value), attachPingListener(root2, value, rootRenderLanes)), false;
            case 22:
              return sourceFiber.flags |= 65536, value === noopSuspenseyCommitThenable ? sourceFiber.flags |= 16384 : (returnFiber = sourceFiber.updateQueue, null === returnFiber ? (returnFiber = {
                transitions: null,
                markerInstances: null,
                retryQueue: new Set([value])
              }, sourceFiber.updateQueue = returnFiber) : (sourceFiber = returnFiber.retryQueue, null === sourceFiber ? returnFiber.retryQueue = new Set([value]) : sourceFiber.add(value)), attachPingListener(root2, value, rootRenderLanes)), false;
          }
          throw Error(formatProdErrorMessage(435, sourceFiber.tag));
        }
        attachPingListener(root2, value, rootRenderLanes);
        renderDidSuspendDelayIfPossible();
        return false;
      }
      if (isHydrating)
        return returnFiber = suspenseHandlerStackCursor.current, null !== returnFiber ? (0 === (returnFiber.flags & 65536) && (returnFiber.flags |= 256), returnFiber.flags |= 65536, returnFiber.lanes = rootRenderLanes, value !== HydrationMismatchException && (root2 = Error(formatProdErrorMessage(422), { cause: value }), queueHydrationError(createCapturedValueAtFiber(root2, sourceFiber)))) : (value !== HydrationMismatchException && (returnFiber = Error(formatProdErrorMessage(423), {
          cause: value
        }), queueHydrationError(
          createCapturedValueAtFiber(returnFiber, sourceFiber)
        )), root2 = root2.current.alternate, root2.flags |= 65536, rootRenderLanes &= -rootRenderLanes, root2.lanes |= rootRenderLanes, value = createCapturedValueAtFiber(value, sourceFiber), rootRenderLanes = createRootErrorUpdate(
          root2.stateNode,
          value,
          rootRenderLanes
        ), enqueueCapturedUpdate(root2, rootRenderLanes), 4 !== workInProgressRootExitStatus && (workInProgressRootExitStatus = 2)), false;
      var wrapperError = Error(formatProdErrorMessage(520), { cause: value });
      wrapperError = createCapturedValueAtFiber(wrapperError, sourceFiber);
      null === workInProgressRootConcurrentErrors ? workInProgressRootConcurrentErrors = [wrapperError] : workInProgressRootConcurrentErrors.push(wrapperError);
      4 !== workInProgressRootExitStatus && (workInProgressRootExitStatus = 2);
      if (null === returnFiber) return true;
      value = createCapturedValueAtFiber(value, sourceFiber);
      sourceFiber = returnFiber;
      do {
        switch (sourceFiber.tag) {
          case 3:
            return sourceFiber.flags |= 65536, root2 = rootRenderLanes & -rootRenderLanes, sourceFiber.lanes |= root2, root2 = createRootErrorUpdate(sourceFiber.stateNode, value, root2), enqueueCapturedUpdate(sourceFiber, root2), false;
          case 1:
            if (returnFiber = sourceFiber.type, wrapperError = sourceFiber.stateNode, 0 === (sourceFiber.flags & 128) && ("function" === typeof returnFiber.getDerivedStateFromError || null !== wrapperError && "function" === typeof wrapperError.componentDidCatch && (null === legacyErrorBoundariesThatAlreadyFailed || !legacyErrorBoundariesThatAlreadyFailed.has(wrapperError))))
              return sourceFiber.flags |= 65536, rootRenderLanes &= -rootRenderLanes, sourceFiber.lanes |= rootRenderLanes, rootRenderLanes = createClassErrorUpdate(rootRenderLanes), initializeClassErrorUpdate(
                rootRenderLanes,
                root2,
                sourceFiber,
                value
              ), enqueueCapturedUpdate(sourceFiber, rootRenderLanes), false;
        }
        sourceFiber = sourceFiber.return;
      } while (null !== sourceFiber);
      return false;
    }
    var SelectiveHydrationException = Error(formatProdErrorMessage(461)), didReceiveUpdate = false;
    function reconcileChildren(current, workInProgress2, nextChildren, renderLanes2) {
      workInProgress2.child = null === current ? mountChildFibers(workInProgress2, null, nextChildren, renderLanes2) : reconcileChildFibers(
        workInProgress2,
        current.child,
        nextChildren,
        renderLanes2
      );
    }
    function updateForwardRef(current, workInProgress2, Component, nextProps, renderLanes2) {
      Component = Component.render;
      var ref = workInProgress2.ref;
      if ("ref" in nextProps) {
        var propsWithoutRef = {};
        for (var key in nextProps)
          "ref" !== key && (propsWithoutRef[key] = nextProps[key]);
      } else propsWithoutRef = nextProps;
      prepareToReadContext(workInProgress2);
      nextProps = renderWithHooks(
        current,
        workInProgress2,
        Component,
        propsWithoutRef,
        ref,
        renderLanes2
      );
      key = checkDidRenderIdHook();
      if (null !== current && !didReceiveUpdate)
        return bailoutHooks(current, workInProgress2, renderLanes2), bailoutOnAlreadyFinishedWork(current, workInProgress2, renderLanes2);
      isHydrating && key && pushMaterializedTreeId(workInProgress2);
      workInProgress2.flags |= 1;
      reconcileChildren(current, workInProgress2, nextProps, renderLanes2);
      return workInProgress2.child;
    }
    function updateMemoComponent(current, workInProgress2, Component, nextProps, renderLanes2) {
      if (null === current) {
        var type = Component.type;
        if ("function" === typeof type && !shouldConstruct(type) && void 0 === type.defaultProps && null === Component.compare)
          return workInProgress2.tag = 15, workInProgress2.type = type, updateSimpleMemoComponent(
            current,
            workInProgress2,
            type,
            nextProps,
            renderLanes2
          );
        current = createFiberFromTypeAndProps(
          Component.type,
          null,
          nextProps,
          workInProgress2,
          workInProgress2.mode,
          renderLanes2
        );
        current.ref = workInProgress2.ref;
        current.return = workInProgress2;
        return workInProgress2.child = current;
      }
      type = current.child;
      if (!checkScheduledUpdateOrContext(current, renderLanes2)) {
        var prevProps = type.memoizedProps;
        Component = Component.compare;
        Component = null !== Component ? Component : shallowEqual;
        if (Component(prevProps, nextProps) && current.ref === workInProgress2.ref)
          return bailoutOnAlreadyFinishedWork(current, workInProgress2, renderLanes2);
      }
      workInProgress2.flags |= 1;
      current = createWorkInProgress(type, nextProps);
      current.ref = workInProgress2.ref;
      current.return = workInProgress2;
      return workInProgress2.child = current;
    }
    function updateSimpleMemoComponent(current, workInProgress2, Component, nextProps, renderLanes2) {
      if (null !== current) {
        var prevProps = current.memoizedProps;
        if (shallowEqual(prevProps, nextProps) && current.ref === workInProgress2.ref)
          if (didReceiveUpdate = false, workInProgress2.pendingProps = nextProps = prevProps, checkScheduledUpdateOrContext(current, renderLanes2))
            0 !== (current.flags & 131072) && (didReceiveUpdate = true);
          else
            return workInProgress2.lanes = current.lanes, bailoutOnAlreadyFinishedWork(current, workInProgress2, renderLanes2);
      }
      return updateFunctionComponent(
        current,
        workInProgress2,
        Component,
        nextProps,
        renderLanes2
      );
    }
    function updateOffscreenComponent(current, workInProgress2, renderLanes2, nextProps) {
      var nextChildren = nextProps.children, prevState = null !== current ? current.memoizedState : null;
      null === current && null === workInProgress2.stateNode && (workInProgress2.stateNode = {
        _visibility: 1,
        _pendingMarkers: null,
        _retryCache: null,
        _transitions: null
      });
      if ("hidden" === nextProps.mode) {
        if (0 !== (workInProgress2.flags & 128)) {
          prevState = null !== prevState ? prevState.baseLanes | renderLanes2 : renderLanes2;
          if (null !== current) {
            nextProps = workInProgress2.child = current.child;
            for (nextChildren = 0; null !== nextProps; )
              nextChildren = nextChildren | nextProps.lanes | nextProps.childLanes, nextProps = nextProps.sibling;
            nextProps = nextChildren & ~prevState;
          } else nextProps = 0, workInProgress2.child = null;
          return deferHiddenOffscreenComponent(
            current,
            workInProgress2,
            prevState,
            renderLanes2,
            nextProps
          );
        }
        if (0 !== (renderLanes2 & 536870912))
          workInProgress2.memoizedState = { baseLanes: 0, cachePool: null }, null !== current && pushTransition(
            workInProgress2,
            null !== prevState ? prevState.cachePool : null
          ), null !== prevState ? pushHiddenContext(workInProgress2, prevState) : reuseHiddenContextOnStack(), pushOffscreenSuspenseHandler(workInProgress2);
        else
          return nextProps = workInProgress2.lanes = 536870912, deferHiddenOffscreenComponent(
            current,
            workInProgress2,
            null !== prevState ? prevState.baseLanes | renderLanes2 : renderLanes2,
            renderLanes2,
            nextProps
          );
      } else
        null !== prevState ? (pushTransition(workInProgress2, prevState.cachePool), pushHiddenContext(workInProgress2, prevState), reuseSuspenseHandlerOnStack(), workInProgress2.memoizedState = null) : (null !== current && pushTransition(workInProgress2, null), reuseHiddenContextOnStack(), reuseSuspenseHandlerOnStack());
      reconcileChildren(current, workInProgress2, nextChildren, renderLanes2);
      return workInProgress2.child;
    }
    function bailoutOffscreenComponent(current, workInProgress2) {
      null !== current && 22 === current.tag || null !== workInProgress2.stateNode || (workInProgress2.stateNode = {
        _visibility: 1,
        _pendingMarkers: null,
        _retryCache: null,
        _transitions: null
      });
      return workInProgress2.sibling;
    }
    function deferHiddenOffscreenComponent(current, workInProgress2, nextBaseLanes, renderLanes2, remainingChildLanes) {
      var JSCompiler_inline_result = peekCacheFromPool();
      JSCompiler_inline_result = null === JSCompiler_inline_result ? null : { parent: CacheContext._currentValue, pool: JSCompiler_inline_result };
      workInProgress2.memoizedState = {
        baseLanes: nextBaseLanes,
        cachePool: JSCompiler_inline_result
      };
      null !== current && pushTransition(workInProgress2, null);
      reuseHiddenContextOnStack();
      pushOffscreenSuspenseHandler(workInProgress2);
      null !== current && propagateParentContextChanges(current, workInProgress2, renderLanes2, true);
      workInProgress2.childLanes = remainingChildLanes;
      return null;
    }
    function mountActivityChildren(workInProgress2, nextProps) {
      nextProps = mountWorkInProgressOffscreenFiber(
        { mode: nextProps.mode, children: nextProps.children },
        workInProgress2.mode
      );
      nextProps.ref = workInProgress2.ref;
      workInProgress2.child = nextProps;
      nextProps.return = workInProgress2;
      return nextProps;
    }
    function retryActivityComponentWithoutHydrating(current, workInProgress2, renderLanes2) {
      reconcileChildFibers(workInProgress2, current.child, null, renderLanes2);
      current = mountActivityChildren(workInProgress2, workInProgress2.pendingProps);
      current.flags |= 2;
      popSuspenseHandler(workInProgress2);
      workInProgress2.memoizedState = null;
      return current;
    }
    function updateActivityComponent(current, workInProgress2, renderLanes2) {
      var nextProps = workInProgress2.pendingProps, didSuspend = 0 !== (workInProgress2.flags & 128);
      workInProgress2.flags &= -129;
      if (null === current) {
        if (isHydrating) {
          if ("hidden" === nextProps.mode)
            return current = mountActivityChildren(workInProgress2, nextProps), workInProgress2.lanes = 536870912, bailoutOffscreenComponent(null, current);
          pushDehydratedActivitySuspenseHandler(workInProgress2);
          (current = nextHydratableInstance) ? (current = canHydrateHydrationBoundary(
            current,
            rootOrSingletonContext
          ), current = null !== current && "&" === current.data ? current : null, null !== current && (workInProgress2.memoizedState = {
            dehydrated: current,
            treeContext: null !== treeContextProvider ? { id: treeContextId, overflow: treeContextOverflow } : null,
            retryLane: 536870912,
            hydrationErrors: null
          }, renderLanes2 = createFiberFromDehydratedFragment(current), renderLanes2.return = workInProgress2, workInProgress2.child = renderLanes2, hydrationParentFiber = workInProgress2, nextHydratableInstance = null)) : current = null;
          if (null === current) throw throwOnHydrationMismatch(workInProgress2);
          workInProgress2.lanes = 536870912;
          return null;
        }
        return mountActivityChildren(workInProgress2, nextProps);
      }
      var prevState = current.memoizedState;
      if (null !== prevState) {
        var dehydrated = prevState.dehydrated;
        pushDehydratedActivitySuspenseHandler(workInProgress2);
        if (didSuspend)
          if (workInProgress2.flags & 256)
            workInProgress2.flags &= -257, workInProgress2 = retryActivityComponentWithoutHydrating(
              current,
              workInProgress2,
              renderLanes2
            );
          else if (null !== workInProgress2.memoizedState)
            workInProgress2.child = current.child, workInProgress2.flags |= 128, workInProgress2 = null;
          else throw Error(formatProdErrorMessage(558));
        else if (didReceiveUpdate || propagateParentContextChanges(current, workInProgress2, renderLanes2, false), didSuspend = 0 !== (renderLanes2 & current.childLanes), didReceiveUpdate || didSuspend) {
          nextProps = workInProgressRoot;
          if (null !== nextProps && (dehydrated = getBumpedLaneForHydration(nextProps, renderLanes2), 0 !== dehydrated && dehydrated !== prevState.retryLane))
            throw prevState.retryLane = dehydrated, enqueueConcurrentRenderForLane(current, dehydrated), scheduleUpdateOnFiber(nextProps, current, dehydrated), SelectiveHydrationException;
          renderDidSuspendDelayIfPossible();
          workInProgress2 = retryActivityComponentWithoutHydrating(
            current,
            workInProgress2,
            renderLanes2
          );
        } else
          current = prevState.treeContext, nextHydratableInstance = getNextHydratable(dehydrated.nextSibling), hydrationParentFiber = workInProgress2, isHydrating = true, hydrationErrors = null, rootOrSingletonContext = false, null !== current && restoreSuspendedTreeContext(workInProgress2, current), workInProgress2 = mountActivityChildren(workInProgress2, nextProps), workInProgress2.flags |= 4096;
        return workInProgress2;
      }
      current = createWorkInProgress(current.child, {
        mode: nextProps.mode,
        children: nextProps.children
      });
      current.ref = workInProgress2.ref;
      workInProgress2.child = current;
      current.return = workInProgress2;
      return current;
    }
    function markRef(current, workInProgress2) {
      var ref = workInProgress2.ref;
      if (null === ref)
        null !== current && null !== current.ref && (workInProgress2.flags |= 4194816);
      else {
        if ("function" !== typeof ref && "object" !== typeof ref)
          throw Error(formatProdErrorMessage(284));
        if (null === current || current.ref !== ref)
          workInProgress2.flags |= 4194816;
      }
    }
    function updateFunctionComponent(current, workInProgress2, Component, nextProps, renderLanes2) {
      prepareToReadContext(workInProgress2);
      Component = renderWithHooks(
        current,
        workInProgress2,
        Component,
        nextProps,
        void 0,
        renderLanes2
      );
      nextProps = checkDidRenderIdHook();
      if (null !== current && !didReceiveUpdate)
        return bailoutHooks(current, workInProgress2, renderLanes2), bailoutOnAlreadyFinishedWork(current, workInProgress2, renderLanes2);
      isHydrating && nextProps && pushMaterializedTreeId(workInProgress2);
      workInProgress2.flags |= 1;
      reconcileChildren(current, workInProgress2, Component, renderLanes2);
      return workInProgress2.child;
    }
    function replayFunctionComponent(current, workInProgress2, nextProps, Component, secondArg, renderLanes2) {
      prepareToReadContext(workInProgress2);
      workInProgress2.updateQueue = null;
      nextProps = renderWithHooksAgain(
        workInProgress2,
        Component,
        nextProps,
        secondArg
      );
      finishRenderingHooks(current);
      Component = checkDidRenderIdHook();
      if (null !== current && !didReceiveUpdate)
        return bailoutHooks(current, workInProgress2, renderLanes2), bailoutOnAlreadyFinishedWork(current, workInProgress2, renderLanes2);
      isHydrating && Component && pushMaterializedTreeId(workInProgress2);
      workInProgress2.flags |= 1;
      reconcileChildren(current, workInProgress2, nextProps, renderLanes2);
      return workInProgress2.child;
    }
    function updateClassComponent(current, workInProgress2, Component, nextProps, renderLanes2) {
      prepareToReadContext(workInProgress2);
      if (null === workInProgress2.stateNode) {
        var context = emptyContextObject, contextType = Component.contextType;
        "object" === typeof contextType && null !== contextType && (context = readContext(contextType));
        context = new Component(nextProps, context);
        workInProgress2.memoizedState = null !== context.state && void 0 !== context.state ? context.state : null;
        context.updater = classComponentUpdater;
        workInProgress2.stateNode = context;
        context._reactInternals = workInProgress2;
        context = workInProgress2.stateNode;
        context.props = nextProps;
        context.state = workInProgress2.memoizedState;
        context.refs = {};
        initializeUpdateQueue(workInProgress2);
        contextType = Component.contextType;
        context.context = "object" === typeof contextType && null !== contextType ? readContext(contextType) : emptyContextObject;
        context.state = workInProgress2.memoizedState;
        contextType = Component.getDerivedStateFromProps;
        "function" === typeof contextType && (applyDerivedStateFromProps(
          workInProgress2,
          Component,
          contextType,
          nextProps
        ), context.state = workInProgress2.memoizedState);
        "function" === typeof Component.getDerivedStateFromProps || "function" === typeof context.getSnapshotBeforeUpdate || "function" !== typeof context.UNSAFE_componentWillMount && "function" !== typeof context.componentWillMount || (contextType = context.state, "function" === typeof context.componentWillMount && context.componentWillMount(), "function" === typeof context.UNSAFE_componentWillMount && context.UNSAFE_componentWillMount(), contextType !== context.state && classComponentUpdater.enqueueReplaceState(context, context.state, null), processUpdateQueue(workInProgress2, nextProps, context, renderLanes2), suspendIfUpdateReadFromEntangledAsyncAction(), context.state = workInProgress2.memoizedState);
        "function" === typeof context.componentDidMount && (workInProgress2.flags |= 4194308);
        nextProps = true;
      } else if (null === current) {
        context = workInProgress2.stateNode;
        var unresolvedOldProps = workInProgress2.memoizedProps, oldProps = resolveClassComponentProps(Component, unresolvedOldProps);
        context.props = oldProps;
        var oldContext = context.context, contextType$jscomp$0 = Component.contextType;
        contextType = emptyContextObject;
        "object" === typeof contextType$jscomp$0 && null !== contextType$jscomp$0 && (contextType = readContext(contextType$jscomp$0));
        var getDerivedStateFromProps = Component.getDerivedStateFromProps;
        contextType$jscomp$0 = "function" === typeof getDerivedStateFromProps || "function" === typeof context.getSnapshotBeforeUpdate;
        unresolvedOldProps = workInProgress2.pendingProps !== unresolvedOldProps;
        contextType$jscomp$0 || "function" !== typeof context.UNSAFE_componentWillReceiveProps && "function" !== typeof context.componentWillReceiveProps || (unresolvedOldProps || oldContext !== contextType) && callComponentWillReceiveProps(
          workInProgress2,
          context,
          nextProps,
          contextType
        );
        hasForceUpdate = false;
        var oldState = workInProgress2.memoizedState;
        context.state = oldState;
        processUpdateQueue(workInProgress2, nextProps, context, renderLanes2);
        suspendIfUpdateReadFromEntangledAsyncAction();
        oldContext = workInProgress2.memoizedState;
        unresolvedOldProps || oldState !== oldContext || hasForceUpdate ? ("function" === typeof getDerivedStateFromProps && (applyDerivedStateFromProps(
          workInProgress2,
          Component,
          getDerivedStateFromProps,
          nextProps
        ), oldContext = workInProgress2.memoizedState), (oldProps = hasForceUpdate || checkShouldComponentUpdate(
          workInProgress2,
          Component,
          oldProps,
          nextProps,
          oldState,
          oldContext,
          contextType
        )) ? (contextType$jscomp$0 || "function" !== typeof context.UNSAFE_componentWillMount && "function" !== typeof context.componentWillMount || ("function" === typeof context.componentWillMount && context.componentWillMount(), "function" === typeof context.UNSAFE_componentWillMount && context.UNSAFE_componentWillMount()), "function" === typeof context.componentDidMount && (workInProgress2.flags |= 4194308)) : ("function" === typeof context.componentDidMount && (workInProgress2.flags |= 4194308), workInProgress2.memoizedProps = nextProps, workInProgress2.memoizedState = oldContext), context.props = nextProps, context.state = oldContext, context.context = contextType, nextProps = oldProps) : ("function" === typeof context.componentDidMount && (workInProgress2.flags |= 4194308), nextProps = false);
      } else {
        context = workInProgress2.stateNode;
        cloneUpdateQueue(current, workInProgress2);
        contextType = workInProgress2.memoizedProps;
        contextType$jscomp$0 = resolveClassComponentProps(Component, contextType);
        context.props = contextType$jscomp$0;
        getDerivedStateFromProps = workInProgress2.pendingProps;
        oldState = context.context;
        oldContext = Component.contextType;
        oldProps = emptyContextObject;
        "object" === typeof oldContext && null !== oldContext && (oldProps = readContext(oldContext));
        unresolvedOldProps = Component.getDerivedStateFromProps;
        (oldContext = "function" === typeof unresolvedOldProps || "function" === typeof context.getSnapshotBeforeUpdate) || "function" !== typeof context.UNSAFE_componentWillReceiveProps && "function" !== typeof context.componentWillReceiveProps || (contextType !== getDerivedStateFromProps || oldState !== oldProps) && callComponentWillReceiveProps(
          workInProgress2,
          context,
          nextProps,
          oldProps
        );
        hasForceUpdate = false;
        oldState = workInProgress2.memoizedState;
        context.state = oldState;
        processUpdateQueue(workInProgress2, nextProps, context, renderLanes2);
        suspendIfUpdateReadFromEntangledAsyncAction();
        var newState = workInProgress2.memoizedState;
        contextType !== getDerivedStateFromProps || oldState !== newState || hasForceUpdate || null !== current && null !== current.dependencies && checkIfContextChanged(current.dependencies) ? ("function" === typeof unresolvedOldProps && (applyDerivedStateFromProps(
          workInProgress2,
          Component,
          unresolvedOldProps,
          nextProps
        ), newState = workInProgress2.memoizedState), (contextType$jscomp$0 = hasForceUpdate || checkShouldComponentUpdate(
          workInProgress2,
          Component,
          contextType$jscomp$0,
          nextProps,
          oldState,
          newState,
          oldProps
        ) || null !== current && null !== current.dependencies && checkIfContextChanged(current.dependencies)) ? (oldContext || "function" !== typeof context.UNSAFE_componentWillUpdate && "function" !== typeof context.componentWillUpdate || ("function" === typeof context.componentWillUpdate && context.componentWillUpdate(nextProps, newState, oldProps), "function" === typeof context.UNSAFE_componentWillUpdate && context.UNSAFE_componentWillUpdate(
          nextProps,
          newState,
          oldProps
        )), "function" === typeof context.componentDidUpdate && (workInProgress2.flags |= 4), "function" === typeof context.getSnapshotBeforeUpdate && (workInProgress2.flags |= 1024)) : ("function" !== typeof context.componentDidUpdate || contextType === current.memoizedProps && oldState === current.memoizedState || (workInProgress2.flags |= 4), "function" !== typeof context.getSnapshotBeforeUpdate || contextType === current.memoizedProps && oldState === current.memoizedState || (workInProgress2.flags |= 1024), workInProgress2.memoizedProps = nextProps, workInProgress2.memoizedState = newState), context.props = nextProps, context.state = newState, context.context = oldProps, nextProps = contextType$jscomp$0) : ("function" !== typeof context.componentDidUpdate || contextType === current.memoizedProps && oldState === current.memoizedState || (workInProgress2.flags |= 4), "function" !== typeof context.getSnapshotBeforeUpdate || contextType === current.memoizedProps && oldState === current.memoizedState || (workInProgress2.flags |= 1024), nextProps = false);
      }
      context = nextProps;
      markRef(current, workInProgress2);
      nextProps = 0 !== (workInProgress2.flags & 128);
      context || nextProps ? (context = workInProgress2.stateNode, Component = nextProps && "function" !== typeof Component.getDerivedStateFromError ? null : context.render(), workInProgress2.flags |= 1, null !== current && nextProps ? (workInProgress2.child = reconcileChildFibers(
        workInProgress2,
        current.child,
        null,
        renderLanes2
      ), workInProgress2.child = reconcileChildFibers(
        workInProgress2,
        null,
        Component,
        renderLanes2
      )) : reconcileChildren(current, workInProgress2, Component, renderLanes2), workInProgress2.memoizedState = context.state, current = workInProgress2.child) : current = bailoutOnAlreadyFinishedWork(
        current,
        workInProgress2,
        renderLanes2
      );
      return current;
    }
    function mountHostRootWithoutHydrating(current, workInProgress2, nextChildren, renderLanes2) {
      resetHydrationState();
      workInProgress2.flags |= 256;
      reconcileChildren(current, workInProgress2, nextChildren, renderLanes2);
      return workInProgress2.child;
    }
    var SUSPENDED_MARKER = {
      dehydrated: null,
      treeContext: null,
      retryLane: 0,
      hydrationErrors: null
    };
    function mountSuspenseOffscreenState(renderLanes2) {
      return { baseLanes: renderLanes2, cachePool: getSuspendedCache() };
    }
    function getRemainingWorkInPrimaryTree(current, primaryTreeDidDefer, renderLanes2) {
      current = null !== current ? current.childLanes & ~renderLanes2 : 0;
      primaryTreeDidDefer && (current |= workInProgressDeferredLane);
      return current;
    }
    function updateSuspenseComponent(current, workInProgress2, renderLanes2) {
      var nextProps = workInProgress2.pendingProps, showFallback = false, didSuspend = 0 !== (workInProgress2.flags & 128), JSCompiler_temp;
      (JSCompiler_temp = didSuspend) || (JSCompiler_temp = null !== current && null === current.memoizedState ? false : 0 !== (suspenseStackCursor.current & 2));
      JSCompiler_temp && (showFallback = true, workInProgress2.flags &= -129);
      JSCompiler_temp = 0 !== (workInProgress2.flags & 32);
      workInProgress2.flags &= -33;
      if (null === current) {
        if (isHydrating) {
          showFallback ? pushPrimaryTreeSuspenseHandler(workInProgress2) : reuseSuspenseHandlerOnStack();
          (current = nextHydratableInstance) ? (current = canHydrateHydrationBoundary(
            current,
            rootOrSingletonContext
          ), current = null !== current && "&" !== current.data ? current : null, null !== current && (workInProgress2.memoizedState = {
            dehydrated: current,
            treeContext: null !== treeContextProvider ? { id: treeContextId, overflow: treeContextOverflow } : null,
            retryLane: 536870912,
            hydrationErrors: null
          }, renderLanes2 = createFiberFromDehydratedFragment(current), renderLanes2.return = workInProgress2, workInProgress2.child = renderLanes2, hydrationParentFiber = workInProgress2, nextHydratableInstance = null)) : current = null;
          if (null === current) throw throwOnHydrationMismatch(workInProgress2);
          isSuspenseInstanceFallback(current) ? workInProgress2.lanes = 32 : workInProgress2.lanes = 536870912;
          return null;
        }
        var nextPrimaryChildren = nextProps.children;
        nextProps = nextProps.fallback;
        if (showFallback)
          return reuseSuspenseHandlerOnStack(), showFallback = workInProgress2.mode, nextPrimaryChildren = mountWorkInProgressOffscreenFiber(
            { mode: "hidden", children: nextPrimaryChildren },
            showFallback
          ), nextProps = createFiberFromFragment(
            nextProps,
            showFallback,
            renderLanes2,
            null
          ), nextPrimaryChildren.return = workInProgress2, nextProps.return = workInProgress2, nextPrimaryChildren.sibling = nextProps, workInProgress2.child = nextPrimaryChildren, nextProps = workInProgress2.child, nextProps.memoizedState = mountSuspenseOffscreenState(renderLanes2), nextProps.childLanes = getRemainingWorkInPrimaryTree(
            current,
            JSCompiler_temp,
            renderLanes2
          ), workInProgress2.memoizedState = SUSPENDED_MARKER, bailoutOffscreenComponent(null, nextProps);
        pushPrimaryTreeSuspenseHandler(workInProgress2);
        return mountSuspensePrimaryChildren(workInProgress2, nextPrimaryChildren);
      }
      var prevState = current.memoizedState;
      if (null !== prevState && (nextPrimaryChildren = prevState.dehydrated, null !== nextPrimaryChildren)) {
        if (didSuspend)
          workInProgress2.flags & 256 ? (pushPrimaryTreeSuspenseHandler(workInProgress2), workInProgress2.flags &= -257, workInProgress2 = retrySuspenseComponentWithoutHydrating(
            current,
            workInProgress2,
            renderLanes2
          )) : null !== workInProgress2.memoizedState ? (reuseSuspenseHandlerOnStack(), workInProgress2.child = current.child, workInProgress2.flags |= 128, workInProgress2 = null) : (reuseSuspenseHandlerOnStack(), nextPrimaryChildren = nextProps.fallback, showFallback = workInProgress2.mode, nextProps = mountWorkInProgressOffscreenFiber(
            { mode: "visible", children: nextProps.children },
            showFallback
          ), nextPrimaryChildren = createFiberFromFragment(
            nextPrimaryChildren,
            showFallback,
            renderLanes2,
            null
          ), nextPrimaryChildren.flags |= 2, nextProps.return = workInProgress2, nextPrimaryChildren.return = workInProgress2, nextProps.sibling = nextPrimaryChildren, workInProgress2.child = nextProps, reconcileChildFibers(
            workInProgress2,
            current.child,
            null,
            renderLanes2
          ), nextProps = workInProgress2.child, nextProps.memoizedState = mountSuspenseOffscreenState(renderLanes2), nextProps.childLanes = getRemainingWorkInPrimaryTree(
            current,
            JSCompiler_temp,
            renderLanes2
          ), workInProgress2.memoizedState = SUSPENDED_MARKER, workInProgress2 = bailoutOffscreenComponent(null, nextProps));
        else if (pushPrimaryTreeSuspenseHandler(workInProgress2), isSuspenseInstanceFallback(nextPrimaryChildren)) {
          JSCompiler_temp = nextPrimaryChildren.nextSibling && nextPrimaryChildren.nextSibling.dataset;
          if (JSCompiler_temp) var digest = JSCompiler_temp.dgst;
          JSCompiler_temp = digest;
          nextProps = Error(formatProdErrorMessage(419));
          nextProps.stack = "";
          nextProps.digest = JSCompiler_temp;
          queueHydrationError({ value: nextProps, source: null, stack: null });
          workInProgress2 = retrySuspenseComponentWithoutHydrating(
            current,
            workInProgress2,
            renderLanes2
          );
        } else if (didReceiveUpdate || propagateParentContextChanges(current, workInProgress2, renderLanes2, false), JSCompiler_temp = 0 !== (renderLanes2 & current.childLanes), didReceiveUpdate || JSCompiler_temp) {
          JSCompiler_temp = workInProgressRoot;
          if (null !== JSCompiler_temp && (nextProps = getBumpedLaneForHydration(JSCompiler_temp, renderLanes2), 0 !== nextProps && nextProps !== prevState.retryLane))
            throw prevState.retryLane = nextProps, enqueueConcurrentRenderForLane(current, nextProps), scheduleUpdateOnFiber(JSCompiler_temp, current, nextProps), SelectiveHydrationException;
          isSuspenseInstancePending(nextPrimaryChildren) || renderDidSuspendDelayIfPossible();
          workInProgress2 = retrySuspenseComponentWithoutHydrating(
            current,
            workInProgress2,
            renderLanes2
          );
        } else
          isSuspenseInstancePending(nextPrimaryChildren) ? (workInProgress2.flags |= 192, workInProgress2.child = current.child, workInProgress2 = null) : (current = prevState.treeContext, nextHydratableInstance = getNextHydratable(
            nextPrimaryChildren.nextSibling
          ), hydrationParentFiber = workInProgress2, isHydrating = true, hydrationErrors = null, rootOrSingletonContext = false, null !== current && restoreSuspendedTreeContext(workInProgress2, current), workInProgress2 = mountSuspensePrimaryChildren(
            workInProgress2,
            nextProps.children
          ), workInProgress2.flags |= 4096);
        return workInProgress2;
      }
      if (showFallback)
        return reuseSuspenseHandlerOnStack(), nextPrimaryChildren = nextProps.fallback, showFallback = workInProgress2.mode, prevState = current.child, digest = prevState.sibling, nextProps = createWorkInProgress(prevState, {
          mode: "hidden",
          children: nextProps.children
        }), nextProps.subtreeFlags = prevState.subtreeFlags & 65011712, null !== digest ? nextPrimaryChildren = createWorkInProgress(
          digest,
          nextPrimaryChildren
        ) : (nextPrimaryChildren = createFiberFromFragment(
          nextPrimaryChildren,
          showFallback,
          renderLanes2,
          null
        ), nextPrimaryChildren.flags |= 2), nextPrimaryChildren.return = workInProgress2, nextProps.return = workInProgress2, nextProps.sibling = nextPrimaryChildren, workInProgress2.child = nextProps, bailoutOffscreenComponent(null, nextProps), nextProps = workInProgress2.child, nextPrimaryChildren = current.child.memoizedState, null === nextPrimaryChildren ? nextPrimaryChildren = mountSuspenseOffscreenState(renderLanes2) : (showFallback = nextPrimaryChildren.cachePool, null !== showFallback ? (prevState = CacheContext._currentValue, showFallback = showFallback.parent !== prevState ? { parent: prevState, pool: prevState } : showFallback) : showFallback = getSuspendedCache(), nextPrimaryChildren = {
          baseLanes: nextPrimaryChildren.baseLanes | renderLanes2,
          cachePool: showFallback
        }), nextProps.memoizedState = nextPrimaryChildren, nextProps.childLanes = getRemainingWorkInPrimaryTree(
          current,
          JSCompiler_temp,
          renderLanes2
        ), workInProgress2.memoizedState = SUSPENDED_MARKER, bailoutOffscreenComponent(current.child, nextProps);
      pushPrimaryTreeSuspenseHandler(workInProgress2);
      renderLanes2 = current.child;
      current = renderLanes2.sibling;
      renderLanes2 = createWorkInProgress(renderLanes2, {
        mode: "visible",
        children: nextProps.children
      });
      renderLanes2.return = workInProgress2;
      renderLanes2.sibling = null;
      null !== current && (JSCompiler_temp = workInProgress2.deletions, null === JSCompiler_temp ? (workInProgress2.deletions = [current], workInProgress2.flags |= 16) : JSCompiler_temp.push(current));
      workInProgress2.child = renderLanes2;
      workInProgress2.memoizedState = null;
      return renderLanes2;
    }
    function mountSuspensePrimaryChildren(workInProgress2, primaryChildren) {
      primaryChildren = mountWorkInProgressOffscreenFiber(
        { mode: "visible", children: primaryChildren },
        workInProgress2.mode
      );
      primaryChildren.return = workInProgress2;
      return workInProgress2.child = primaryChildren;
    }
    function mountWorkInProgressOffscreenFiber(offscreenProps, mode) {
      offscreenProps = createFiberImplClass(22, offscreenProps, null, mode);
      offscreenProps.lanes = 0;
      return offscreenProps;
    }
    function retrySuspenseComponentWithoutHydrating(current, workInProgress2, renderLanes2) {
      reconcileChildFibers(workInProgress2, current.child, null, renderLanes2);
      current = mountSuspensePrimaryChildren(
        workInProgress2,
        workInProgress2.pendingProps.children
      );
      current.flags |= 2;
      workInProgress2.memoizedState = null;
      return current;
    }
    function scheduleSuspenseWorkOnFiber(fiber, renderLanes2, propagationRoot) {
      fiber.lanes |= renderLanes2;
      var alternate = fiber.alternate;
      null !== alternate && (alternate.lanes |= renderLanes2);
      scheduleContextWorkOnParentPath(fiber.return, renderLanes2, propagationRoot);
    }
    function initSuspenseListRenderState(workInProgress2, isBackwards, tail, lastContentRow, tailMode, treeForkCount2) {
      var renderState = workInProgress2.memoizedState;
      null === renderState ? workInProgress2.memoizedState = {
        isBackwards,
        rendering: null,
        renderingStartTime: 0,
        last: lastContentRow,
        tail,
        tailMode,
        treeForkCount: treeForkCount2
      } : (renderState.isBackwards = isBackwards, renderState.rendering = null, renderState.renderingStartTime = 0, renderState.last = lastContentRow, renderState.tail = tail, renderState.tailMode = tailMode, renderState.treeForkCount = treeForkCount2);
    }
    function updateSuspenseListComponent(current, workInProgress2, renderLanes2) {
      var nextProps = workInProgress2.pendingProps, revealOrder = nextProps.revealOrder, tailMode = nextProps.tail;
      nextProps = nextProps.children;
      var suspenseContext = suspenseStackCursor.current, shouldForceFallback = 0 !== (suspenseContext & 2);
      shouldForceFallback ? (suspenseContext = suspenseContext & 1 | 2, workInProgress2.flags |= 128) : suspenseContext &= 1;
      push(suspenseStackCursor, suspenseContext);
      reconcileChildren(current, workInProgress2, nextProps, renderLanes2);
      nextProps = isHydrating ? treeForkCount : 0;
      if (!shouldForceFallback && null !== current && 0 !== (current.flags & 128))
        a: for (current = workInProgress2.child; null !== current; ) {
          if (13 === current.tag)
            null !== current.memoizedState && scheduleSuspenseWorkOnFiber(current, renderLanes2, workInProgress2);
          else if (19 === current.tag)
            scheduleSuspenseWorkOnFiber(current, renderLanes2, workInProgress2);
          else if (null !== current.child) {
            current.child.return = current;
            current = current.child;
            continue;
          }
          if (current === workInProgress2) break a;
          for (; null === current.sibling; ) {
            if (null === current.return || current.return === workInProgress2)
              break a;
            current = current.return;
          }
          current.sibling.return = current.return;
          current = current.sibling;
        }
      switch (revealOrder) {
        case "forwards":
          renderLanes2 = workInProgress2.child;
          for (revealOrder = null; null !== renderLanes2; )
            current = renderLanes2.alternate, null !== current && null === findFirstSuspended(current) && (revealOrder = renderLanes2), renderLanes2 = renderLanes2.sibling;
          renderLanes2 = revealOrder;
          null === renderLanes2 ? (revealOrder = workInProgress2.child, workInProgress2.child = null) : (revealOrder = renderLanes2.sibling, renderLanes2.sibling = null);
          initSuspenseListRenderState(
            workInProgress2,
            false,
            revealOrder,
            renderLanes2,
            tailMode,
            nextProps
          );
          break;
        case "backwards":
        case "unstable_legacy-backwards":
          renderLanes2 = null;
          revealOrder = workInProgress2.child;
          for (workInProgress2.child = null; null !== revealOrder; ) {
            current = revealOrder.alternate;
            if (null !== current && null === findFirstSuspended(current)) {
              workInProgress2.child = revealOrder;
              break;
            }
            current = revealOrder.sibling;
            revealOrder.sibling = renderLanes2;
            renderLanes2 = revealOrder;
            revealOrder = current;
          }
          initSuspenseListRenderState(
            workInProgress2,
            true,
            renderLanes2,
            null,
            tailMode,
            nextProps
          );
          break;
        case "together":
          initSuspenseListRenderState(
            workInProgress2,
            false,
            null,
            null,
            void 0,
            nextProps
          );
          break;
        default:
          workInProgress2.memoizedState = null;
      }
      return workInProgress2.child;
    }
    function bailoutOnAlreadyFinishedWork(current, workInProgress2, renderLanes2) {
      null !== current && (workInProgress2.dependencies = current.dependencies);
      workInProgressRootSkippedLanes |= workInProgress2.lanes;
      if (0 === (renderLanes2 & workInProgress2.childLanes))
        if (null !== current) {
          if (propagateParentContextChanges(
            current,
            workInProgress2,
            renderLanes2,
            false
          ), 0 === (renderLanes2 & workInProgress2.childLanes))
            return null;
        } else return null;
      if (null !== current && workInProgress2.child !== current.child)
        throw Error(formatProdErrorMessage(153));
      if (null !== workInProgress2.child) {
        current = workInProgress2.child;
        renderLanes2 = createWorkInProgress(current, current.pendingProps);
        workInProgress2.child = renderLanes2;
        for (renderLanes2.return = workInProgress2; null !== current.sibling; )
          current = current.sibling, renderLanes2 = renderLanes2.sibling = createWorkInProgress(current, current.pendingProps), renderLanes2.return = workInProgress2;
        renderLanes2.sibling = null;
      }
      return workInProgress2.child;
    }
    function checkScheduledUpdateOrContext(current, renderLanes2) {
      if (0 !== (current.lanes & renderLanes2)) return true;
      current = current.dependencies;
      return null !== current && checkIfContextChanged(current) ? true : false;
    }
    function attemptEarlyBailoutIfNoScheduledUpdate(current, workInProgress2, renderLanes2) {
      switch (workInProgress2.tag) {
        case 3:
          pushHostContainer(workInProgress2, workInProgress2.stateNode.containerInfo);
          pushProvider(workInProgress2, CacheContext, current.memoizedState.cache);
          resetHydrationState();
          break;
        case 27:
        case 5:
          pushHostContext(workInProgress2);
          break;
        case 4:
          pushHostContainer(workInProgress2, workInProgress2.stateNode.containerInfo);
          break;
        case 10:
          pushProvider(
            workInProgress2,
            workInProgress2.type,
            workInProgress2.memoizedProps.value
          );
          break;
        case 31:
          if (null !== workInProgress2.memoizedState)
            return workInProgress2.flags |= 128, pushDehydratedActivitySuspenseHandler(workInProgress2), null;
          break;
        case 13:
          var state$102 = workInProgress2.memoizedState;
          if (null !== state$102) {
            if (null !== state$102.dehydrated)
              return pushPrimaryTreeSuspenseHandler(workInProgress2), workInProgress2.flags |= 128, null;
            if (0 !== (renderLanes2 & workInProgress2.child.childLanes))
              return updateSuspenseComponent(current, workInProgress2, renderLanes2);
            pushPrimaryTreeSuspenseHandler(workInProgress2);
            current = bailoutOnAlreadyFinishedWork(
              current,
              workInProgress2,
              renderLanes2
            );
            return null !== current ? current.sibling : null;
          }
          pushPrimaryTreeSuspenseHandler(workInProgress2);
          break;
        case 19:
          var didSuspendBefore = 0 !== (current.flags & 128);
          state$102 = 0 !== (renderLanes2 & workInProgress2.childLanes);
          state$102 || (propagateParentContextChanges(
            current,
            workInProgress2,
            renderLanes2,
            false
          ), state$102 = 0 !== (renderLanes2 & workInProgress2.childLanes));
          if (didSuspendBefore) {
            if (state$102)
              return updateSuspenseListComponent(
                current,
                workInProgress2,
                renderLanes2
              );
            workInProgress2.flags |= 128;
          }
          didSuspendBefore = workInProgress2.memoizedState;
          null !== didSuspendBefore && (didSuspendBefore.rendering = null, didSuspendBefore.tail = null, didSuspendBefore.lastEffect = null);
          push(suspenseStackCursor, suspenseStackCursor.current);
          if (state$102) break;
          else return null;
        case 22:
          return workInProgress2.lanes = 0, updateOffscreenComponent(
            current,
            workInProgress2,
            renderLanes2,
            workInProgress2.pendingProps
          );
        case 24:
          pushProvider(workInProgress2, CacheContext, current.memoizedState.cache);
      }
      return bailoutOnAlreadyFinishedWork(current, workInProgress2, renderLanes2);
    }
    function beginWork(current, workInProgress2, renderLanes2) {
      if (null !== current)
        if (current.memoizedProps !== workInProgress2.pendingProps)
          didReceiveUpdate = true;
        else {
          if (!checkScheduledUpdateOrContext(current, renderLanes2) && 0 === (workInProgress2.flags & 128))
            return didReceiveUpdate = false, attemptEarlyBailoutIfNoScheduledUpdate(
              current,
              workInProgress2,
              renderLanes2
            );
          didReceiveUpdate = 0 !== (current.flags & 131072) ? true : false;
        }
      else
        didReceiveUpdate = false, isHydrating && 0 !== (workInProgress2.flags & 1048576) && pushTreeId(workInProgress2, treeForkCount, workInProgress2.index);
      workInProgress2.lanes = 0;
      switch (workInProgress2.tag) {
        case 16:
          a: {
            var props = workInProgress2.pendingProps;
            current = resolveLazy(workInProgress2.elementType);
            workInProgress2.type = current;
            if ("function" === typeof current)
              shouldConstruct(current) ? (props = resolveClassComponentProps(current, props), workInProgress2.tag = 1, workInProgress2 = updateClassComponent(
                null,
                workInProgress2,
                current,
                props,
                renderLanes2
              )) : (workInProgress2.tag = 0, workInProgress2 = updateFunctionComponent(
                null,
                workInProgress2,
                current,
                props,
                renderLanes2
              ));
            else {
              if (void 0 !== current && null !== current) {
                var $$typeof = current.$$typeof;
                if ($$typeof === REACT_FORWARD_REF_TYPE) {
                  workInProgress2.tag = 11;
                  workInProgress2 = updateForwardRef(
                    null,
                    workInProgress2,
                    current,
                    props,
                    renderLanes2
                  );
                  break a;
                } else if ($$typeof === REACT_MEMO_TYPE) {
                  workInProgress2.tag = 14;
                  workInProgress2 = updateMemoComponent(
                    null,
                    workInProgress2,
                    current,
                    props,
                    renderLanes2
                  );
                  break a;
                }
              }
              workInProgress2 = getComponentNameFromType(current) || current;
              throw Error(formatProdErrorMessage(306, workInProgress2, ""));
            }
          }
          return workInProgress2;
        case 0:
          return updateFunctionComponent(
            current,
            workInProgress2,
            workInProgress2.type,
            workInProgress2.pendingProps,
            renderLanes2
          );
        case 1:
          return props = workInProgress2.type, $$typeof = resolveClassComponentProps(
            props,
            workInProgress2.pendingProps
          ), updateClassComponent(
            current,
            workInProgress2,
            props,
            $$typeof,
            renderLanes2
          );
        case 3:
          a: {
            pushHostContainer(
              workInProgress2,
              workInProgress2.stateNode.containerInfo
            );
            if (null === current) throw Error(formatProdErrorMessage(387));
            props = workInProgress2.pendingProps;
            var prevState = workInProgress2.memoizedState;
            $$typeof = prevState.element;
            cloneUpdateQueue(current, workInProgress2);
            processUpdateQueue(workInProgress2, props, null, renderLanes2);
            var nextState = workInProgress2.memoizedState;
            props = nextState.cache;
            pushProvider(workInProgress2, CacheContext, props);
            props !== prevState.cache && propagateContextChanges(
              workInProgress2,
              [CacheContext],
              renderLanes2,
              true
            );
            suspendIfUpdateReadFromEntangledAsyncAction();
            props = nextState.element;
            if (prevState.isDehydrated)
              if (prevState = {
                element: props,
                isDehydrated: false,
                cache: nextState.cache
              }, workInProgress2.updateQueue.baseState = prevState, workInProgress2.memoizedState = prevState, workInProgress2.flags & 256) {
                workInProgress2 = mountHostRootWithoutHydrating(
                  current,
                  workInProgress2,
                  props,
                  renderLanes2
                );
                break a;
              } else if (props !== $$typeof) {
                $$typeof = createCapturedValueAtFiber(
                  Error(formatProdErrorMessage(424)),
                  workInProgress2
                );
                queueHydrationError($$typeof);
                workInProgress2 = mountHostRootWithoutHydrating(
                  current,
                  workInProgress2,
                  props,
                  renderLanes2
                );
                break a;
              } else {
                current = workInProgress2.stateNode.containerInfo;
                switch (current.nodeType) {
                  case 9:
                    current = current.body;
                    break;
                  default:
                    current = "HTML" === current.nodeName ? current.ownerDocument.body : current;
                }
                nextHydratableInstance = getNextHydratable(current.firstChild);
                hydrationParentFiber = workInProgress2;
                isHydrating = true;
                hydrationErrors = null;
                rootOrSingletonContext = true;
                renderLanes2 = mountChildFibers(
                  workInProgress2,
                  null,
                  props,
                  renderLanes2
                );
                for (workInProgress2.child = renderLanes2; renderLanes2; )
                  renderLanes2.flags = renderLanes2.flags & -3 | 4096, renderLanes2 = renderLanes2.sibling;
              }
            else {
              resetHydrationState();
              if (props === $$typeof) {
                workInProgress2 = bailoutOnAlreadyFinishedWork(
                  current,
                  workInProgress2,
                  renderLanes2
                );
                break a;
              }
              reconcileChildren(current, workInProgress2, props, renderLanes2);
            }
            workInProgress2 = workInProgress2.child;
          }
          return workInProgress2;
        case 26:
          return markRef(current, workInProgress2), null === current ? (renderLanes2 = getResource(
            workInProgress2.type,
            null,
            workInProgress2.pendingProps,
            null
          )) ? workInProgress2.memoizedState = renderLanes2 : isHydrating || (renderLanes2 = workInProgress2.type, current = workInProgress2.pendingProps, props = getOwnerDocumentFromRootContainer(
            rootInstanceStackCursor.current
          ).createElement(renderLanes2), props[internalInstanceKey] = workInProgress2, props[internalPropsKey] = current, setInitialProperties(props, renderLanes2, current), markNodeAsHoistable(props), workInProgress2.stateNode = props) : workInProgress2.memoizedState = getResource(
            workInProgress2.type,
            current.memoizedProps,
            workInProgress2.pendingProps,
            current.memoizedState
          ), null;
        case 27:
          return pushHostContext(workInProgress2), null === current && isHydrating && (props = workInProgress2.stateNode = resolveSingletonInstance(
            workInProgress2.type,
            workInProgress2.pendingProps,
            rootInstanceStackCursor.current
          ), hydrationParentFiber = workInProgress2, rootOrSingletonContext = true, $$typeof = nextHydratableInstance, isSingletonScope(workInProgress2.type) ? (previousHydratableOnEnteringScopedSingleton = $$typeof, nextHydratableInstance = getNextHydratable(props.firstChild)) : nextHydratableInstance = $$typeof), reconcileChildren(
            current,
            workInProgress2,
            workInProgress2.pendingProps.children,
            renderLanes2
          ), markRef(current, workInProgress2), null === current && (workInProgress2.flags |= 4194304), workInProgress2.child;
        case 5:
          if (null === current && isHydrating) {
            if ($$typeof = props = nextHydratableInstance)
              props = canHydrateInstance(
                props,
                workInProgress2.type,
                workInProgress2.pendingProps,
                rootOrSingletonContext
              ), null !== props ? (workInProgress2.stateNode = props, hydrationParentFiber = workInProgress2, nextHydratableInstance = getNextHydratable(props.firstChild), rootOrSingletonContext = false, $$typeof = true) : $$typeof = false;
            $$typeof || throwOnHydrationMismatch(workInProgress2);
          }
          pushHostContext(workInProgress2);
          $$typeof = workInProgress2.type;
          prevState = workInProgress2.pendingProps;
          nextState = null !== current ? current.memoizedProps : null;
          props = prevState.children;
          shouldSetTextContent($$typeof, prevState) ? props = null : null !== nextState && shouldSetTextContent($$typeof, nextState) && (workInProgress2.flags |= 32);
          null !== workInProgress2.memoizedState && ($$typeof = renderWithHooks(
            current,
            workInProgress2,
            TransitionAwareHostComponent,
            null,
            null,
            renderLanes2
          ), HostTransitionContext._currentValue = $$typeof);
          markRef(current, workInProgress2);
          reconcileChildren(current, workInProgress2, props, renderLanes2);
          return workInProgress2.child;
        case 6:
          if (null === current && isHydrating) {
            if (current = renderLanes2 = nextHydratableInstance)
              renderLanes2 = canHydrateTextInstance(
                renderLanes2,
                workInProgress2.pendingProps,
                rootOrSingletonContext
              ), null !== renderLanes2 ? (workInProgress2.stateNode = renderLanes2, hydrationParentFiber = workInProgress2, nextHydratableInstance = null, current = true) : current = false;
            current || throwOnHydrationMismatch(workInProgress2);
          }
          return null;
        case 13:
          return updateSuspenseComponent(current, workInProgress2, renderLanes2);
        case 4:
          return pushHostContainer(
            workInProgress2,
            workInProgress2.stateNode.containerInfo
          ), props = workInProgress2.pendingProps, null === current ? workInProgress2.child = reconcileChildFibers(
            workInProgress2,
            null,
            props,
            renderLanes2
          ) : reconcileChildren(current, workInProgress2, props, renderLanes2), workInProgress2.child;
        case 11:
          return updateForwardRef(
            current,
            workInProgress2,
            workInProgress2.type,
            workInProgress2.pendingProps,
            renderLanes2
          );
        case 7:
          return reconcileChildren(
            current,
            workInProgress2,
            workInProgress2.pendingProps,
            renderLanes2
          ), workInProgress2.child;
        case 8:
          return reconcileChildren(
            current,
            workInProgress2,
            workInProgress2.pendingProps.children,
            renderLanes2
          ), workInProgress2.child;
        case 12:
          return reconcileChildren(
            current,
            workInProgress2,
            workInProgress2.pendingProps.children,
            renderLanes2
          ), workInProgress2.child;
        case 10:
          return props = workInProgress2.pendingProps, pushProvider(workInProgress2, workInProgress2.type, props.value), reconcileChildren(current, workInProgress2, props.children, renderLanes2), workInProgress2.child;
        case 9:
          return $$typeof = workInProgress2.type._context, props = workInProgress2.pendingProps.children, prepareToReadContext(workInProgress2), $$typeof = readContext($$typeof), props = props($$typeof), workInProgress2.flags |= 1, reconcileChildren(current, workInProgress2, props, renderLanes2), workInProgress2.child;
        case 14:
          return updateMemoComponent(
            current,
            workInProgress2,
            workInProgress2.type,
            workInProgress2.pendingProps,
            renderLanes2
          );
        case 15:
          return updateSimpleMemoComponent(
            current,
            workInProgress2,
            workInProgress2.type,
            workInProgress2.pendingProps,
            renderLanes2
          );
        case 19:
          return updateSuspenseListComponent(current, workInProgress2, renderLanes2);
        case 31:
          return updateActivityComponent(current, workInProgress2, renderLanes2);
        case 22:
          return updateOffscreenComponent(
            current,
            workInProgress2,
            renderLanes2,
            workInProgress2.pendingProps
          );
        case 24:
          return prepareToReadContext(workInProgress2), props = readContext(CacheContext), null === current ? ($$typeof = peekCacheFromPool(), null === $$typeof && ($$typeof = workInProgressRoot, prevState = createCache(), $$typeof.pooledCache = prevState, prevState.refCount++, null !== prevState && ($$typeof.pooledCacheLanes |= renderLanes2), $$typeof = prevState), workInProgress2.memoizedState = { parent: props, cache: $$typeof }, initializeUpdateQueue(workInProgress2), pushProvider(workInProgress2, CacheContext, $$typeof)) : (0 !== (current.lanes & renderLanes2) && (cloneUpdateQueue(current, workInProgress2), processUpdateQueue(workInProgress2, null, null, renderLanes2), suspendIfUpdateReadFromEntangledAsyncAction()), $$typeof = current.memoizedState, prevState = workInProgress2.memoizedState, $$typeof.parent !== props ? ($$typeof = { parent: props, cache: props }, workInProgress2.memoizedState = $$typeof, 0 === workInProgress2.lanes && (workInProgress2.memoizedState = workInProgress2.updateQueue.baseState = $$typeof), pushProvider(workInProgress2, CacheContext, props)) : (props = prevState.cache, pushProvider(workInProgress2, CacheContext, props), props !== $$typeof.cache && propagateContextChanges(
            workInProgress2,
            [CacheContext],
            renderLanes2,
            true
          ))), reconcileChildren(
            current,
            workInProgress2,
            workInProgress2.pendingProps.children,
            renderLanes2
          ), workInProgress2.child;
        case 29:
          throw workInProgress2.pendingProps;
      }
      throw Error(formatProdErrorMessage(156, workInProgress2.tag));
    }
    function markUpdate(workInProgress2) {
      workInProgress2.flags |= 4;
    }
    function preloadInstanceAndSuspendIfNeeded(workInProgress2, type, oldProps, newProps, renderLanes2) {
      if (type = 0 !== (workInProgress2.mode & 32)) type = false;
      if (type) {
        if (workInProgress2.flags |= 16777216, (renderLanes2 & 335544128) === renderLanes2)
          if (workInProgress2.stateNode.complete) workInProgress2.flags |= 8192;
          else if (shouldRemainOnPreviousScreen()) workInProgress2.flags |= 8192;
          else
            throw suspendedThenable = noopSuspenseyCommitThenable, SuspenseyCommitException;
      } else workInProgress2.flags &= -16777217;
    }
    function preloadResourceAndSuspendIfNeeded(workInProgress2, resource) {
      if ("stylesheet" !== resource.type || 0 !== (resource.state.loading & 4))
        workInProgress2.flags &= -16777217;
      else if (workInProgress2.flags |= 16777216, !preloadResource(resource))
        if (shouldRemainOnPreviousScreen()) workInProgress2.flags |= 8192;
        else
          throw suspendedThenable = noopSuspenseyCommitThenable, SuspenseyCommitException;
    }
    function scheduleRetryEffect(workInProgress2, retryQueue) {
      null !== retryQueue && (workInProgress2.flags |= 4);
      workInProgress2.flags & 16384 && (retryQueue = 22 !== workInProgress2.tag ? claimNextRetryLane() : 536870912, workInProgress2.lanes |= retryQueue, workInProgressSuspendedRetryLanes |= retryQueue);
    }
    function cutOffTailIfNeeded(renderState, hasRenderedATailFallback) {
      if (!isHydrating)
        switch (renderState.tailMode) {
          case "hidden":
            hasRenderedATailFallback = renderState.tail;
            for (var lastTailNode = null; null !== hasRenderedATailFallback; )
              null !== hasRenderedATailFallback.alternate && (lastTailNode = hasRenderedATailFallback), hasRenderedATailFallback = hasRenderedATailFallback.sibling;
            null === lastTailNode ? renderState.tail = null : lastTailNode.sibling = null;
            break;
          case "collapsed":
            lastTailNode = renderState.tail;
            for (var lastTailNode$106 = null; null !== lastTailNode; )
              null !== lastTailNode.alternate && (lastTailNode$106 = lastTailNode), lastTailNode = lastTailNode.sibling;
            null === lastTailNode$106 ? hasRenderedATailFallback || null === renderState.tail ? renderState.tail = null : renderState.tail.sibling = null : lastTailNode$106.sibling = null;
        }
    }
    function bubbleProperties(completedWork) {
      var didBailout = null !== completedWork.alternate && completedWork.alternate.child === completedWork.child, newChildLanes = 0, subtreeFlags = 0;
      if (didBailout)
        for (var child$107 = completedWork.child; null !== child$107; )
          newChildLanes |= child$107.lanes | child$107.childLanes, subtreeFlags |= child$107.subtreeFlags & 65011712, subtreeFlags |= child$107.flags & 65011712, child$107.return = completedWork, child$107 = child$107.sibling;
      else
        for (child$107 = completedWork.child; null !== child$107; )
          newChildLanes |= child$107.lanes | child$107.childLanes, subtreeFlags |= child$107.subtreeFlags, subtreeFlags |= child$107.flags, child$107.return = completedWork, child$107 = child$107.sibling;
      completedWork.subtreeFlags |= subtreeFlags;
      completedWork.childLanes = newChildLanes;
      return didBailout;
    }
    function completeWork(current, workInProgress2, renderLanes2) {
      var newProps = workInProgress2.pendingProps;
      popTreeContext(workInProgress2);
      switch (workInProgress2.tag) {
        case 16:
        case 15:
        case 0:
        case 11:
        case 7:
        case 8:
        case 12:
        case 9:
        case 14:
          return bubbleProperties(workInProgress2), null;
        case 1:
          return bubbleProperties(workInProgress2), null;
        case 3:
          renderLanes2 = workInProgress2.stateNode;
          newProps = null;
          null !== current && (newProps = current.memoizedState.cache);
          workInProgress2.memoizedState.cache !== newProps && (workInProgress2.flags |= 2048);
          popProvider(CacheContext);
          popHostContainer();
          renderLanes2.pendingContext && (renderLanes2.context = renderLanes2.pendingContext, renderLanes2.pendingContext = null);
          if (null === current || null === current.child)
            popHydrationState(workInProgress2) ? markUpdate(workInProgress2) : null === current || current.memoizedState.isDehydrated && 0 === (workInProgress2.flags & 256) || (workInProgress2.flags |= 1024, upgradeHydrationErrorsToRecoverable());
          bubbleProperties(workInProgress2);
          return null;
        case 26:
          var type = workInProgress2.type, nextResource = workInProgress2.memoizedState;
          null === current ? (markUpdate(workInProgress2), null !== nextResource ? (bubbleProperties(workInProgress2), preloadResourceAndSuspendIfNeeded(workInProgress2, nextResource)) : (bubbleProperties(workInProgress2), preloadInstanceAndSuspendIfNeeded(
            workInProgress2,
            type,
            null,
            newProps,
            renderLanes2
          ))) : nextResource ? nextResource !== current.memoizedState ? (markUpdate(workInProgress2), bubbleProperties(workInProgress2), preloadResourceAndSuspendIfNeeded(workInProgress2, nextResource)) : (bubbleProperties(workInProgress2), workInProgress2.flags &= -16777217) : (current = current.memoizedProps, current !== newProps && markUpdate(workInProgress2), bubbleProperties(workInProgress2), preloadInstanceAndSuspendIfNeeded(
            workInProgress2,
            type,
            current,
            newProps,
            renderLanes2
          ));
          return null;
        case 27:
          popHostContext(workInProgress2);
          renderLanes2 = rootInstanceStackCursor.current;
          type = workInProgress2.type;
          if (null !== current && null != workInProgress2.stateNode)
            current.memoizedProps !== newProps && markUpdate(workInProgress2);
          else {
            if (!newProps) {
              if (null === workInProgress2.stateNode)
                throw Error(formatProdErrorMessage(166));
              bubbleProperties(workInProgress2);
              return null;
            }
            current = contextStackCursor.current;
            popHydrationState(workInProgress2) ? prepareToHydrateHostInstance(workInProgress2) : (current = resolveSingletonInstance(type, newProps, renderLanes2), workInProgress2.stateNode = current, markUpdate(workInProgress2));
          }
          bubbleProperties(workInProgress2);
          return null;
        case 5:
          popHostContext(workInProgress2);
          type = workInProgress2.type;
          if (null !== current && null != workInProgress2.stateNode)
            current.memoizedProps !== newProps && markUpdate(workInProgress2);
          else {
            if (!newProps) {
              if (null === workInProgress2.stateNode)
                throw Error(formatProdErrorMessage(166));
              bubbleProperties(workInProgress2);
              return null;
            }
            nextResource = contextStackCursor.current;
            if (popHydrationState(workInProgress2))
              prepareToHydrateHostInstance(workInProgress2);
            else {
              var ownerDocument = getOwnerDocumentFromRootContainer(
                rootInstanceStackCursor.current
              );
              switch (nextResource) {
                case 1:
                  nextResource = ownerDocument.createElementNS(
                    "http://www.w3.org/2000/svg",
                    type
                  );
                  break;
                case 2:
                  nextResource = ownerDocument.createElementNS(
                    "http://www.w3.org/1998/Math/MathML",
                    type
                  );
                  break;
                default:
                  switch (type) {
                    case "svg":
                      nextResource = ownerDocument.createElementNS(
                        "http://www.w3.org/2000/svg",
                        type
                      );
                      break;
                    case "math":
                      nextResource = ownerDocument.createElementNS(
                        "http://www.w3.org/1998/Math/MathML",
                        type
                      );
                      break;
                    case "script":
                      nextResource = ownerDocument.createElement("div");
                      nextResource.innerHTML = "<script><\/script>";
                      nextResource = nextResource.removeChild(
                        nextResource.firstChild
                      );
                      break;
                    case "select":
                      nextResource = "string" === typeof newProps.is ? ownerDocument.createElement("select", {
                        is: newProps.is
                      }) : ownerDocument.createElement("select");
                      newProps.multiple ? nextResource.multiple = true : newProps.size && (nextResource.size = newProps.size);
                      break;
                    default:
                      nextResource = "string" === typeof newProps.is ? ownerDocument.createElement(type, { is: newProps.is }) : ownerDocument.createElement(type);
                  }
              }
              nextResource[internalInstanceKey] = workInProgress2;
              nextResource[internalPropsKey] = newProps;
              a: for (ownerDocument = workInProgress2.child; null !== ownerDocument; ) {
                if (5 === ownerDocument.tag || 6 === ownerDocument.tag)
                  nextResource.appendChild(ownerDocument.stateNode);
                else if (4 !== ownerDocument.tag && 27 !== ownerDocument.tag && null !== ownerDocument.child) {
                  ownerDocument.child.return = ownerDocument;
                  ownerDocument = ownerDocument.child;
                  continue;
                }
                if (ownerDocument === workInProgress2) break a;
                for (; null === ownerDocument.sibling; ) {
                  if (null === ownerDocument.return || ownerDocument.return === workInProgress2)
                    break a;
                  ownerDocument = ownerDocument.return;
                }
                ownerDocument.sibling.return = ownerDocument.return;
                ownerDocument = ownerDocument.sibling;
              }
              workInProgress2.stateNode = nextResource;
              a: switch (setInitialProperties(nextResource, type, newProps), type) {
                case "button":
                case "input":
                case "select":
                case "textarea":
                  newProps = !!newProps.autoFocus;
                  break a;
                case "img":
                  newProps = true;
                  break a;
                default:
                  newProps = false;
              }
              newProps && markUpdate(workInProgress2);
            }
          }
          bubbleProperties(workInProgress2);
          preloadInstanceAndSuspendIfNeeded(
            workInProgress2,
            workInProgress2.type,
            null === current ? null : current.memoizedProps,
            workInProgress2.pendingProps,
            renderLanes2
          );
          return null;
        case 6:
          if (current && null != workInProgress2.stateNode)
            current.memoizedProps !== newProps && markUpdate(workInProgress2);
          else {
            if ("string" !== typeof newProps && null === workInProgress2.stateNode)
              throw Error(formatProdErrorMessage(166));
            current = rootInstanceStackCursor.current;
            if (popHydrationState(workInProgress2)) {
              current = workInProgress2.stateNode;
              renderLanes2 = workInProgress2.memoizedProps;
              newProps = null;
              type = hydrationParentFiber;
              if (null !== type)
                switch (type.tag) {
                  case 27:
                  case 5:
                    newProps = type.memoizedProps;
                }
              current[internalInstanceKey] = workInProgress2;
              current = current.nodeValue === renderLanes2 || null !== newProps && true === newProps.suppressHydrationWarning || checkForUnmatchedText(current.nodeValue, renderLanes2) ? true : false;
              current || throwOnHydrationMismatch(workInProgress2, true);
            } else
              current = getOwnerDocumentFromRootContainer(current).createTextNode(
                newProps
              ), current[internalInstanceKey] = workInProgress2, workInProgress2.stateNode = current;
          }
          bubbleProperties(workInProgress2);
          return null;
        case 31:
          renderLanes2 = workInProgress2.memoizedState;
          if (null === current || null !== current.memoizedState) {
            newProps = popHydrationState(workInProgress2);
            if (null !== renderLanes2) {
              if (null === current) {
                if (!newProps) throw Error(formatProdErrorMessage(318));
                current = workInProgress2.memoizedState;
                current = null !== current ? current.dehydrated : null;
                if (!current) throw Error(formatProdErrorMessage(557));
                current[internalInstanceKey] = workInProgress2;
              } else
                resetHydrationState(), 0 === (workInProgress2.flags & 128) && (workInProgress2.memoizedState = null), workInProgress2.flags |= 4;
              bubbleProperties(workInProgress2);
              current = false;
            } else
              renderLanes2 = upgradeHydrationErrorsToRecoverable(), null !== current && null !== current.memoizedState && (current.memoizedState.hydrationErrors = renderLanes2), current = true;
            if (!current) {
              if (workInProgress2.flags & 256)
                return popSuspenseHandler(workInProgress2), workInProgress2;
              popSuspenseHandler(workInProgress2);
              return null;
            }
            if (0 !== (workInProgress2.flags & 128))
              throw Error(formatProdErrorMessage(558));
          }
          bubbleProperties(workInProgress2);
          return null;
        case 13:
          newProps = workInProgress2.memoizedState;
          if (null === current || null !== current.memoizedState && null !== current.memoizedState.dehydrated) {
            type = popHydrationState(workInProgress2);
            if (null !== newProps && null !== newProps.dehydrated) {
              if (null === current) {
                if (!type) throw Error(formatProdErrorMessage(318));
                type = workInProgress2.memoizedState;
                type = null !== type ? type.dehydrated : null;
                if (!type) throw Error(formatProdErrorMessage(317));
                type[internalInstanceKey] = workInProgress2;
              } else
                resetHydrationState(), 0 === (workInProgress2.flags & 128) && (workInProgress2.memoizedState = null), workInProgress2.flags |= 4;
              bubbleProperties(workInProgress2);
              type = false;
            } else
              type = upgradeHydrationErrorsToRecoverable(), null !== current && null !== current.memoizedState && (current.memoizedState.hydrationErrors = type), type = true;
            if (!type) {
              if (workInProgress2.flags & 256)
                return popSuspenseHandler(workInProgress2), workInProgress2;
              popSuspenseHandler(workInProgress2);
              return null;
            }
          }
          popSuspenseHandler(workInProgress2);
          if (0 !== (workInProgress2.flags & 128))
            return workInProgress2.lanes = renderLanes2, workInProgress2;
          renderLanes2 = null !== newProps;
          current = null !== current && null !== current.memoizedState;
          renderLanes2 && (newProps = workInProgress2.child, type = null, null !== newProps.alternate && null !== newProps.alternate.memoizedState && null !== newProps.alternate.memoizedState.cachePool && (type = newProps.alternate.memoizedState.cachePool.pool), nextResource = null, null !== newProps.memoizedState && null !== newProps.memoizedState.cachePool && (nextResource = newProps.memoizedState.cachePool.pool), nextResource !== type && (newProps.flags |= 2048));
          renderLanes2 !== current && renderLanes2 && (workInProgress2.child.flags |= 8192);
          scheduleRetryEffect(workInProgress2, workInProgress2.updateQueue);
          bubbleProperties(workInProgress2);
          return null;
        case 4:
          return popHostContainer(), null === current && listenToAllSupportedEvents(workInProgress2.stateNode.containerInfo), bubbleProperties(workInProgress2), null;
        case 10:
          return popProvider(workInProgress2.type), bubbleProperties(workInProgress2), null;
        case 19:
          pop(suspenseStackCursor);
          newProps = workInProgress2.memoizedState;
          if (null === newProps) return bubbleProperties(workInProgress2), null;
          type = 0 !== (workInProgress2.flags & 128);
          nextResource = newProps.rendering;
          if (null === nextResource)
            if (type) cutOffTailIfNeeded(newProps, false);
            else {
              if (0 !== workInProgressRootExitStatus || null !== current && 0 !== (current.flags & 128))
                for (current = workInProgress2.child; null !== current; ) {
                  nextResource = findFirstSuspended(current);
                  if (null !== nextResource) {
                    workInProgress2.flags |= 128;
                    cutOffTailIfNeeded(newProps, false);
                    current = nextResource.updateQueue;
                    workInProgress2.updateQueue = current;
                    scheduleRetryEffect(workInProgress2, current);
                    workInProgress2.subtreeFlags = 0;
                    current = renderLanes2;
                    for (renderLanes2 = workInProgress2.child; null !== renderLanes2; )
                      resetWorkInProgress(renderLanes2, current), renderLanes2 = renderLanes2.sibling;
                    push(
                      suspenseStackCursor,
                      suspenseStackCursor.current & 1 | 2
                    );
                    isHydrating && pushTreeFork(workInProgress2, newProps.treeForkCount);
                    return workInProgress2.child;
                  }
                  current = current.sibling;
                }
              null !== newProps.tail && now() > workInProgressRootRenderTargetTime && (workInProgress2.flags |= 128, type = true, cutOffTailIfNeeded(newProps, false), workInProgress2.lanes = 4194304);
            }
          else {
            if (!type)
              if (current = findFirstSuspended(nextResource), null !== current) {
                if (workInProgress2.flags |= 128, type = true, current = current.updateQueue, workInProgress2.updateQueue = current, scheduleRetryEffect(workInProgress2, current), cutOffTailIfNeeded(newProps, true), null === newProps.tail && "hidden" === newProps.tailMode && !nextResource.alternate && !isHydrating)
                  return bubbleProperties(workInProgress2), null;
              } else
                2 * now() - newProps.renderingStartTime > workInProgressRootRenderTargetTime && 536870912 !== renderLanes2 && (workInProgress2.flags |= 128, type = true, cutOffTailIfNeeded(newProps, false), workInProgress2.lanes = 4194304);
            newProps.isBackwards ? (nextResource.sibling = workInProgress2.child, workInProgress2.child = nextResource) : (current = newProps.last, null !== current ? current.sibling = nextResource : workInProgress2.child = nextResource, newProps.last = nextResource);
          }
          if (null !== newProps.tail)
            return current = newProps.tail, newProps.rendering = current, newProps.tail = current.sibling, newProps.renderingStartTime = now(), current.sibling = null, renderLanes2 = suspenseStackCursor.current, push(
              suspenseStackCursor,
              type ? renderLanes2 & 1 | 2 : renderLanes2 & 1
            ), isHydrating && pushTreeFork(workInProgress2, newProps.treeForkCount), current;
          bubbleProperties(workInProgress2);
          return null;
        case 22:
        case 23:
          return popSuspenseHandler(workInProgress2), popHiddenContext(), newProps = null !== workInProgress2.memoizedState, null !== current ? null !== current.memoizedState !== newProps && (workInProgress2.flags |= 8192) : newProps && (workInProgress2.flags |= 8192), newProps ? 0 !== (renderLanes2 & 536870912) && 0 === (workInProgress2.flags & 128) && (bubbleProperties(workInProgress2), workInProgress2.subtreeFlags & 6 && (workInProgress2.flags |= 8192)) : bubbleProperties(workInProgress2), renderLanes2 = workInProgress2.updateQueue, null !== renderLanes2 && scheduleRetryEffect(workInProgress2, renderLanes2.retryQueue), renderLanes2 = null, null !== current && null !== current.memoizedState && null !== current.memoizedState.cachePool && (renderLanes2 = current.memoizedState.cachePool.pool), newProps = null, null !== workInProgress2.memoizedState && null !== workInProgress2.memoizedState.cachePool && (newProps = workInProgress2.memoizedState.cachePool.pool), newProps !== renderLanes2 && (workInProgress2.flags |= 2048), null !== current && pop(resumedCache), null;
        case 24:
          return renderLanes2 = null, null !== current && (renderLanes2 = current.memoizedState.cache), workInProgress2.memoizedState.cache !== renderLanes2 && (workInProgress2.flags |= 2048), popProvider(CacheContext), bubbleProperties(workInProgress2), null;
        case 25:
          return null;
        case 30:
          return null;
      }
      throw Error(formatProdErrorMessage(156, workInProgress2.tag));
    }
    function unwindWork(current, workInProgress2) {
      popTreeContext(workInProgress2);
      switch (workInProgress2.tag) {
        case 1:
          return current = workInProgress2.flags, current & 65536 ? (workInProgress2.flags = current & -65537 | 128, workInProgress2) : null;
        case 3:
          return popProvider(CacheContext), popHostContainer(), current = workInProgress2.flags, 0 !== (current & 65536) && 0 === (current & 128) ? (workInProgress2.flags = current & -65537 | 128, workInProgress2) : null;
        case 26:
        case 27:
        case 5:
          return popHostContext(workInProgress2), null;
        case 31:
          if (null !== workInProgress2.memoizedState) {
            popSuspenseHandler(workInProgress2);
            if (null === workInProgress2.alternate)
              throw Error(formatProdErrorMessage(340));
            resetHydrationState();
          }
          current = workInProgress2.flags;
          return current & 65536 ? (workInProgress2.flags = current & -65537 | 128, workInProgress2) : null;
        case 13:
          popSuspenseHandler(workInProgress2);
          current = workInProgress2.memoizedState;
          if (null !== current && null !== current.dehydrated) {
            if (null === workInProgress2.alternate)
              throw Error(formatProdErrorMessage(340));
            resetHydrationState();
          }
          current = workInProgress2.flags;
          return current & 65536 ? (workInProgress2.flags = current & -65537 | 128, workInProgress2) : null;
        case 19:
          return pop(suspenseStackCursor), null;
        case 4:
          return popHostContainer(), null;
        case 10:
          return popProvider(workInProgress2.type), null;
        case 22:
        case 23:
          return popSuspenseHandler(workInProgress2), popHiddenContext(), null !== current && pop(resumedCache), current = workInProgress2.flags, current & 65536 ? (workInProgress2.flags = current & -65537 | 128, workInProgress2) : null;
        case 24:
          return popProvider(CacheContext), null;
        case 25:
          return null;
        default:
          return null;
      }
    }
    function unwindInterruptedWork(current, interruptedWork) {
      popTreeContext(interruptedWork);
      switch (interruptedWork.tag) {
        case 3:
          popProvider(CacheContext);
          popHostContainer();
          break;
        case 26:
        case 27:
        case 5:
          popHostContext(interruptedWork);
          break;
        case 4:
          popHostContainer();
          break;
        case 31:
          null !== interruptedWork.memoizedState && popSuspenseHandler(interruptedWork);
          break;
        case 13:
          popSuspenseHandler(interruptedWork);
          break;
        case 19:
          pop(suspenseStackCursor);
          break;
        case 10:
          popProvider(interruptedWork.type);
          break;
        case 22:
        case 23:
          popSuspenseHandler(interruptedWork);
          popHiddenContext();
          null !== current && pop(resumedCache);
          break;
        case 24:
          popProvider(CacheContext);
      }
    }
    function commitHookEffectListMount(flags, finishedWork) {
      try {
        var updateQueue = finishedWork.updateQueue, lastEffect = null !== updateQueue ? updateQueue.lastEffect : null;
        if (null !== lastEffect) {
          var firstEffect = lastEffect.next;
          updateQueue = firstEffect;
          do {
            if ((updateQueue.tag & flags) === flags) {
              lastEffect = void 0;
              var create2 = updateQueue.create, inst = updateQueue.inst;
              lastEffect = create2();
              inst.destroy = lastEffect;
            }
            updateQueue = updateQueue.next;
          } while (updateQueue !== firstEffect);
        }
      } catch (error) {
        captureCommitPhaseError(finishedWork, finishedWork.return, error);
      }
    }
    function commitHookEffectListUnmount(flags, finishedWork, nearestMountedAncestor$jscomp$0) {
      try {
        var updateQueue = finishedWork.updateQueue, lastEffect = null !== updateQueue ? updateQueue.lastEffect : null;
        if (null !== lastEffect) {
          var firstEffect = lastEffect.next;
          updateQueue = firstEffect;
          do {
            if ((updateQueue.tag & flags) === flags) {
              var inst = updateQueue.inst, destroy = inst.destroy;
              if (void 0 !== destroy) {
                inst.destroy = void 0;
                lastEffect = finishedWork;
                var nearestMountedAncestor = nearestMountedAncestor$jscomp$0, destroy_ = destroy;
                try {
                  destroy_();
                } catch (error) {
                  captureCommitPhaseError(
                    lastEffect,
                    nearestMountedAncestor,
                    error
                  );
                }
              }
            }
            updateQueue = updateQueue.next;
          } while (updateQueue !== firstEffect);
        }
      } catch (error) {
        captureCommitPhaseError(finishedWork, finishedWork.return, error);
      }
    }
    function commitClassCallbacks(finishedWork) {
      var updateQueue = finishedWork.updateQueue;
      if (null !== updateQueue) {
        var instance = finishedWork.stateNode;
        try {
          commitCallbacks(updateQueue, instance);
        } catch (error) {
          captureCommitPhaseError(finishedWork, finishedWork.return, error);
        }
      }
    }
    function safelyCallComponentWillUnmount(current, nearestMountedAncestor, instance) {
      instance.props = resolveClassComponentProps(
        current.type,
        current.memoizedProps
      );
      instance.state = current.memoizedState;
      try {
        instance.componentWillUnmount();
      } catch (error) {
        captureCommitPhaseError(current, nearestMountedAncestor, error);
      }
    }
    function safelyAttachRef(current, nearestMountedAncestor) {
      try {
        var ref = current.ref;
        if (null !== ref) {
          switch (current.tag) {
            case 26:
            case 27:
            case 5:
              var instanceToUse = current.stateNode;
              break;
            case 30:
              instanceToUse = current.stateNode;
              break;
            default:
              instanceToUse = current.stateNode;
          }
          "function" === typeof ref ? current.refCleanup = ref(instanceToUse) : ref.current = instanceToUse;
        }
      } catch (error) {
        captureCommitPhaseError(current, nearestMountedAncestor, error);
      }
    }
    function safelyDetachRef(current, nearestMountedAncestor) {
      var ref = current.ref, refCleanup = current.refCleanup;
      if (null !== ref)
        if ("function" === typeof refCleanup)
          try {
            refCleanup();
          } catch (error) {
            captureCommitPhaseError(current, nearestMountedAncestor, error);
          } finally {
            current.refCleanup = null, current = current.alternate, null != current && (current.refCleanup = null);
          }
        else if ("function" === typeof ref)
          try {
            ref(null);
          } catch (error$140) {
            captureCommitPhaseError(current, nearestMountedAncestor, error$140);
          }
        else ref.current = null;
    }
    function commitHostMount(finishedWork) {
      var type = finishedWork.type, props = finishedWork.memoizedProps, instance = finishedWork.stateNode;
      try {
        a: switch (type) {
          case "button":
          case "input":
          case "select":
          case "textarea":
            props.autoFocus && instance.focus();
            break a;
          case "img":
            props.src ? instance.src = props.src : props.srcSet && (instance.srcset = props.srcSet);
        }
      } catch (error) {
        captureCommitPhaseError(finishedWork, finishedWork.return, error);
      }
    }
    function commitHostUpdate(finishedWork, newProps, oldProps) {
      try {
        var domElement = finishedWork.stateNode;
        updateProperties(domElement, finishedWork.type, oldProps, newProps);
        domElement[internalPropsKey] = newProps;
      } catch (error) {
        captureCommitPhaseError(finishedWork, finishedWork.return, error);
      }
    }
    function isHostParent(fiber) {
      return 5 === fiber.tag || 3 === fiber.tag || 26 === fiber.tag || 27 === fiber.tag && isSingletonScope(fiber.type) || 4 === fiber.tag;
    }
    function getHostSibling(fiber) {
      a: for (; ; ) {
        for (; null === fiber.sibling; ) {
          if (null === fiber.return || isHostParent(fiber.return)) return null;
          fiber = fiber.return;
        }
        fiber.sibling.return = fiber.return;
        for (fiber = fiber.sibling; 5 !== fiber.tag && 6 !== fiber.tag && 18 !== fiber.tag; ) {
          if (27 === fiber.tag && isSingletonScope(fiber.type)) continue a;
          if (fiber.flags & 2) continue a;
          if (null === fiber.child || 4 === fiber.tag) continue a;
          else fiber.child.return = fiber, fiber = fiber.child;
        }
        if (!(fiber.flags & 2)) return fiber.stateNode;
      }
    }
    function insertOrAppendPlacementNodeIntoContainer(node, before, parent) {
      var tag = node.tag;
      if (5 === tag || 6 === tag)
        node = node.stateNode, before ? (9 === parent.nodeType ? parent.body : "HTML" === parent.nodeName ? parent.ownerDocument.body : parent).insertBefore(node, before) : (before = 9 === parent.nodeType ? parent.body : "HTML" === parent.nodeName ? parent.ownerDocument.body : parent, before.appendChild(node), parent = parent._reactRootContainer, null !== parent && void 0 !== parent || null !== before.onclick || (before.onclick = noop$1));
      else if (4 !== tag && (27 === tag && isSingletonScope(node.type) && (parent = node.stateNode, before = null), node = node.child, null !== node))
        for (insertOrAppendPlacementNodeIntoContainer(node, before, parent), node = node.sibling; null !== node; )
          insertOrAppendPlacementNodeIntoContainer(node, before, parent), node = node.sibling;
    }
    function insertOrAppendPlacementNode(node, before, parent) {
      var tag = node.tag;
      if (5 === tag || 6 === tag)
        node = node.stateNode, before ? parent.insertBefore(node, before) : parent.appendChild(node);
      else if (4 !== tag && (27 === tag && isSingletonScope(node.type) && (parent = node.stateNode), node = node.child, null !== node))
        for (insertOrAppendPlacementNode(node, before, parent), node = node.sibling; null !== node; )
          insertOrAppendPlacementNode(node, before, parent), node = node.sibling;
    }
    function commitHostSingletonAcquisition(finishedWork) {
      var singleton = finishedWork.stateNode, props = finishedWork.memoizedProps;
      try {
        for (var type = finishedWork.type, attributes = singleton.attributes; attributes.length; )
          singleton.removeAttributeNode(attributes[0]);
        setInitialProperties(singleton, type, props);
        singleton[internalInstanceKey] = finishedWork;
        singleton[internalPropsKey] = props;
      } catch (error) {
        captureCommitPhaseError(finishedWork, finishedWork.return, error);
      }
    }
    var offscreenSubtreeIsHidden = false, offscreenSubtreeWasHidden = false, needsFormReset = false, PossiblyWeakSet = "function" === typeof WeakSet ? WeakSet : Set, nextEffect = null;
    function commitBeforeMutationEffects(root2, firstChild) {
      root2 = root2.containerInfo;
      eventsEnabled = _enabled;
      root2 = getActiveElementDeep(root2);
      if (hasSelectionCapabilities(root2)) {
        if ("selectionStart" in root2)
          var JSCompiler_temp = {
            start: root2.selectionStart,
            end: root2.selectionEnd
          };
        else
          a: {
            JSCompiler_temp = (JSCompiler_temp = root2.ownerDocument) && JSCompiler_temp.defaultView || window;
            var selection = JSCompiler_temp.getSelection && JSCompiler_temp.getSelection();
            if (selection && 0 !== selection.rangeCount) {
              JSCompiler_temp = selection.anchorNode;
              var anchorOffset = selection.anchorOffset, focusNode = selection.focusNode;
              selection = selection.focusOffset;
              try {
                JSCompiler_temp.nodeType, focusNode.nodeType;
              } catch (e$20) {
                JSCompiler_temp = null;
                break a;
              }
              var length = 0, start = -1, end = -1, indexWithinAnchor = 0, indexWithinFocus = 0, node = root2, parentNode = null;
              b: for (; ; ) {
                for (var next; ; ) {
                  node !== JSCompiler_temp || 0 !== anchorOffset && 3 !== node.nodeType || (start = length + anchorOffset);
                  node !== focusNode || 0 !== selection && 3 !== node.nodeType || (end = length + selection);
                  3 === node.nodeType && (length += node.nodeValue.length);
                  if (null === (next = node.firstChild)) break;
                  parentNode = node;
                  node = next;
                }
                for (; ; ) {
                  if (node === root2) break b;
                  parentNode === JSCompiler_temp && ++indexWithinAnchor === anchorOffset && (start = length);
                  parentNode === focusNode && ++indexWithinFocus === selection && (end = length);
                  if (null !== (next = node.nextSibling)) break;
                  node = parentNode;
                  parentNode = node.parentNode;
                }
                node = next;
              }
              JSCompiler_temp = -1 === start || -1 === end ? null : { start, end };
            } else JSCompiler_temp = null;
          }
        JSCompiler_temp = JSCompiler_temp || { start: 0, end: 0 };
      } else JSCompiler_temp = null;
      selectionInformation = { focusedElem: root2, selectionRange: JSCompiler_temp };
      _enabled = false;
      for (nextEffect = firstChild; null !== nextEffect; )
        if (firstChild = nextEffect, root2 = firstChild.child, 0 !== (firstChild.subtreeFlags & 1028) && null !== root2)
          root2.return = firstChild, nextEffect = root2;
        else
          for (; null !== nextEffect; ) {
            firstChild = nextEffect;
            focusNode = firstChild.alternate;
            root2 = firstChild.flags;
            switch (firstChild.tag) {
              case 0:
                if (0 !== (root2 & 4) && (root2 = firstChild.updateQueue, root2 = null !== root2 ? root2.events : null, null !== root2))
                  for (JSCompiler_temp = 0; JSCompiler_temp < root2.length; JSCompiler_temp++)
                    anchorOffset = root2[JSCompiler_temp], anchorOffset.ref.impl = anchorOffset.nextImpl;
                break;
              case 11:
              case 15:
                break;
              case 1:
                if (0 !== (root2 & 1024) && null !== focusNode) {
                  root2 = void 0;
                  JSCompiler_temp = firstChild;
                  anchorOffset = focusNode.memoizedProps;
                  focusNode = focusNode.memoizedState;
                  selection = JSCompiler_temp.stateNode;
                  try {
                    var resolvedPrevProps = resolveClassComponentProps(
                      JSCompiler_temp.type,
                      anchorOffset
                    );
                    root2 = selection.getSnapshotBeforeUpdate(
                      resolvedPrevProps,
                      focusNode
                    );
                    selection.__reactInternalSnapshotBeforeUpdate = root2;
                  } catch (error) {
                    captureCommitPhaseError(
                      JSCompiler_temp,
                      JSCompiler_temp.return,
                      error
                    );
                  }
                }
                break;
              case 3:
                if (0 !== (root2 & 1024)) {
                  if (root2 = firstChild.stateNode.containerInfo, JSCompiler_temp = root2.nodeType, 9 === JSCompiler_temp)
                    clearContainerSparingly(root2);
                  else if (1 === JSCompiler_temp)
                    switch (root2.nodeName) {
                      case "HEAD":
                      case "HTML":
                      case "BODY":
                        clearContainerSparingly(root2);
                        break;
                      default:
                        root2.textContent = "";
                    }
                }
                break;
              case 5:
              case 26:
              case 27:
              case 6:
              case 4:
              case 17:
                break;
              default:
                if (0 !== (root2 & 1024)) throw Error(formatProdErrorMessage(163));
            }
            root2 = firstChild.sibling;
            if (null !== root2) {
              root2.return = firstChild.return;
              nextEffect = root2;
              break;
            }
            nextEffect = firstChild.return;
          }
    }
    function commitLayoutEffectOnFiber(finishedRoot, current, finishedWork) {
      var flags = finishedWork.flags;
      switch (finishedWork.tag) {
        case 0:
        case 11:
        case 15:
          recursivelyTraverseLayoutEffects(finishedRoot, finishedWork);
          flags & 4 && commitHookEffectListMount(5, finishedWork);
          break;
        case 1:
          recursivelyTraverseLayoutEffects(finishedRoot, finishedWork);
          if (flags & 4)
            if (finishedRoot = finishedWork.stateNode, null === current)
              try {
                finishedRoot.componentDidMount();
              } catch (error) {
                captureCommitPhaseError(finishedWork, finishedWork.return, error);
              }
            else {
              var prevProps = resolveClassComponentProps(
                finishedWork.type,
                current.memoizedProps
              );
              current = current.memoizedState;
              try {
                finishedRoot.componentDidUpdate(
                  prevProps,
                  current,
                  finishedRoot.__reactInternalSnapshotBeforeUpdate
                );
              } catch (error$139) {
                captureCommitPhaseError(
                  finishedWork,
                  finishedWork.return,
                  error$139
                );
              }
            }
          flags & 64 && commitClassCallbacks(finishedWork);
          flags & 512 && safelyAttachRef(finishedWork, finishedWork.return);
          break;
        case 3:
          recursivelyTraverseLayoutEffects(finishedRoot, finishedWork);
          if (flags & 64 && (finishedRoot = finishedWork.updateQueue, null !== finishedRoot)) {
            current = null;
            if (null !== finishedWork.child)
              switch (finishedWork.child.tag) {
                case 27:
                case 5:
                  current = finishedWork.child.stateNode;
                  break;
                case 1:
                  current = finishedWork.child.stateNode;
              }
            try {
              commitCallbacks(finishedRoot, current);
            } catch (error) {
              captureCommitPhaseError(finishedWork, finishedWork.return, error);
            }
          }
          break;
        case 27:
          null === current && flags & 4 && commitHostSingletonAcquisition(finishedWork);
        case 26:
        case 5:
          recursivelyTraverseLayoutEffects(finishedRoot, finishedWork);
          null === current && flags & 4 && commitHostMount(finishedWork);
          flags & 512 && safelyAttachRef(finishedWork, finishedWork.return);
          break;
        case 12:
          recursivelyTraverseLayoutEffects(finishedRoot, finishedWork);
          break;
        case 31:
          recursivelyTraverseLayoutEffects(finishedRoot, finishedWork);
          flags & 4 && commitActivityHydrationCallbacks(finishedRoot, finishedWork);
          break;
        case 13:
          recursivelyTraverseLayoutEffects(finishedRoot, finishedWork);
          flags & 4 && commitSuspenseHydrationCallbacks(finishedRoot, finishedWork);
          flags & 64 && (finishedRoot = finishedWork.memoizedState, null !== finishedRoot && (finishedRoot = finishedRoot.dehydrated, null !== finishedRoot && (finishedWork = retryDehydratedSuspenseBoundary.bind(
            null,
            finishedWork
          ), registerSuspenseInstanceRetry(finishedRoot, finishedWork))));
          break;
        case 22:
          flags = null !== finishedWork.memoizedState || offscreenSubtreeIsHidden;
          if (!flags) {
            current = null !== current && null !== current.memoizedState || offscreenSubtreeWasHidden;
            prevProps = offscreenSubtreeIsHidden;
            var prevOffscreenSubtreeWasHidden = offscreenSubtreeWasHidden;
            offscreenSubtreeIsHidden = flags;
            (offscreenSubtreeWasHidden = current) && !prevOffscreenSubtreeWasHidden ? recursivelyTraverseReappearLayoutEffects(
              finishedRoot,
              finishedWork,
              0 !== (finishedWork.subtreeFlags & 8772)
            ) : recursivelyTraverseLayoutEffects(finishedRoot, finishedWork);
            offscreenSubtreeIsHidden = prevProps;
            offscreenSubtreeWasHidden = prevOffscreenSubtreeWasHidden;
          }
          break;
        case 30:
          break;
        default:
          recursivelyTraverseLayoutEffects(finishedRoot, finishedWork);
      }
    }
    function detachFiberAfterEffects(fiber) {
      var alternate = fiber.alternate;
      null !== alternate && (fiber.alternate = null, detachFiberAfterEffects(alternate));
      fiber.child = null;
      fiber.deletions = null;
      fiber.sibling = null;
      5 === fiber.tag && (alternate = fiber.stateNode, null !== alternate && detachDeletedInstance(alternate));
      fiber.stateNode = null;
      fiber.return = null;
      fiber.dependencies = null;
      fiber.memoizedProps = null;
      fiber.memoizedState = null;
      fiber.pendingProps = null;
      fiber.stateNode = null;
      fiber.updateQueue = null;
    }
    var hostParent = null, hostParentIsContainer = false;
    function recursivelyTraverseDeletionEffects(finishedRoot, nearestMountedAncestor, parent) {
      for (parent = parent.child; null !== parent; )
        commitDeletionEffectsOnFiber(finishedRoot, nearestMountedAncestor, parent), parent = parent.sibling;
    }
    function commitDeletionEffectsOnFiber(finishedRoot, nearestMountedAncestor, deletedFiber) {
      if (injectedHook && "function" === typeof injectedHook.onCommitFiberUnmount)
        try {
          injectedHook.onCommitFiberUnmount(rendererID, deletedFiber);
        } catch (err) {
        }
      switch (deletedFiber.tag) {
        case 26:
          offscreenSubtreeWasHidden || safelyDetachRef(deletedFiber, nearestMountedAncestor);
          recursivelyTraverseDeletionEffects(
            finishedRoot,
            nearestMountedAncestor,
            deletedFiber
          );
          deletedFiber.memoizedState ? deletedFiber.memoizedState.count-- : deletedFiber.stateNode && (deletedFiber = deletedFiber.stateNode, deletedFiber.parentNode.removeChild(deletedFiber));
          break;
        case 27:
          offscreenSubtreeWasHidden || safelyDetachRef(deletedFiber, nearestMountedAncestor);
          var prevHostParent = hostParent, prevHostParentIsContainer = hostParentIsContainer;
          isSingletonScope(deletedFiber.type) && (hostParent = deletedFiber.stateNode, hostParentIsContainer = false);
          recursivelyTraverseDeletionEffects(
            finishedRoot,
            nearestMountedAncestor,
            deletedFiber
          );
          releaseSingletonInstance(deletedFiber.stateNode);
          hostParent = prevHostParent;
          hostParentIsContainer = prevHostParentIsContainer;
          break;
        case 5:
          offscreenSubtreeWasHidden || safelyDetachRef(deletedFiber, nearestMountedAncestor);
        case 6:
          prevHostParent = hostParent;
          prevHostParentIsContainer = hostParentIsContainer;
          hostParent = null;
          recursivelyTraverseDeletionEffects(
            finishedRoot,
            nearestMountedAncestor,
            deletedFiber
          );
          hostParent = prevHostParent;
          hostParentIsContainer = prevHostParentIsContainer;
          if (null !== hostParent)
            if (hostParentIsContainer)
              try {
                (9 === hostParent.nodeType ? hostParent.body : "HTML" === hostParent.nodeName ? hostParent.ownerDocument.body : hostParent).removeChild(deletedFiber.stateNode);
              } catch (error) {
                captureCommitPhaseError(
                  deletedFiber,
                  nearestMountedAncestor,
                  error
                );
              }
            else
              try {
                hostParent.removeChild(deletedFiber.stateNode);
              } catch (error) {
                captureCommitPhaseError(
                  deletedFiber,
                  nearestMountedAncestor,
                  error
                );
              }
          break;
        case 18:
          null !== hostParent && (hostParentIsContainer ? (finishedRoot = hostParent, clearHydrationBoundary(
            9 === finishedRoot.nodeType ? finishedRoot.body : "HTML" === finishedRoot.nodeName ? finishedRoot.ownerDocument.body : finishedRoot,
            deletedFiber.stateNode
          ), retryIfBlockedOn(finishedRoot)) : clearHydrationBoundary(hostParent, deletedFiber.stateNode));
          break;
        case 4:
          prevHostParent = hostParent;
          prevHostParentIsContainer = hostParentIsContainer;
          hostParent = deletedFiber.stateNode.containerInfo;
          hostParentIsContainer = true;
          recursivelyTraverseDeletionEffects(
            finishedRoot,
            nearestMountedAncestor,
            deletedFiber
          );
          hostParent = prevHostParent;
          hostParentIsContainer = prevHostParentIsContainer;
          break;
        case 0:
        case 11:
        case 14:
        case 15:
          commitHookEffectListUnmount(2, deletedFiber, nearestMountedAncestor);
          offscreenSubtreeWasHidden || commitHookEffectListUnmount(4, deletedFiber, nearestMountedAncestor);
          recursivelyTraverseDeletionEffects(
            finishedRoot,
            nearestMountedAncestor,
            deletedFiber
          );
          break;
        case 1:
          offscreenSubtreeWasHidden || (safelyDetachRef(deletedFiber, nearestMountedAncestor), prevHostParent = deletedFiber.stateNode, "function" === typeof prevHostParent.componentWillUnmount && safelyCallComponentWillUnmount(
            deletedFiber,
            nearestMountedAncestor,
            prevHostParent
          ));
          recursivelyTraverseDeletionEffects(
            finishedRoot,
            nearestMountedAncestor,
            deletedFiber
          );
          break;
        case 21:
          recursivelyTraverseDeletionEffects(
            finishedRoot,
            nearestMountedAncestor,
            deletedFiber
          );
          break;
        case 22:
          offscreenSubtreeWasHidden = (prevHostParent = offscreenSubtreeWasHidden) || null !== deletedFiber.memoizedState;
          recursivelyTraverseDeletionEffects(
            finishedRoot,
            nearestMountedAncestor,
            deletedFiber
          );
          offscreenSubtreeWasHidden = prevHostParent;
          break;
        default:
          recursivelyTraverseDeletionEffects(
            finishedRoot,
            nearestMountedAncestor,
            deletedFiber
          );
      }
    }
    function commitActivityHydrationCallbacks(finishedRoot, finishedWork) {
      if (null === finishedWork.memoizedState && (finishedRoot = finishedWork.alternate, null !== finishedRoot && (finishedRoot = finishedRoot.memoizedState, null !== finishedRoot))) {
        finishedRoot = finishedRoot.dehydrated;
        try {
          retryIfBlockedOn(finishedRoot);
        } catch (error) {
          captureCommitPhaseError(finishedWork, finishedWork.return, error);
        }
      }
    }
    function commitSuspenseHydrationCallbacks(finishedRoot, finishedWork) {
      if (null === finishedWork.memoizedState && (finishedRoot = finishedWork.alternate, null !== finishedRoot && (finishedRoot = finishedRoot.memoizedState, null !== finishedRoot && (finishedRoot = finishedRoot.dehydrated, null !== finishedRoot))))
        try {
          retryIfBlockedOn(finishedRoot);
        } catch (error) {
          captureCommitPhaseError(finishedWork, finishedWork.return, error);
        }
    }
    function getRetryCache(finishedWork) {
      switch (finishedWork.tag) {
        case 31:
        case 13:
        case 19:
          var retryCache = finishedWork.stateNode;
          null === retryCache && (retryCache = finishedWork.stateNode = new PossiblyWeakSet());
          return retryCache;
        case 22:
          return finishedWork = finishedWork.stateNode, retryCache = finishedWork._retryCache, null === retryCache && (retryCache = finishedWork._retryCache = new PossiblyWeakSet()), retryCache;
        default:
          throw Error(formatProdErrorMessage(435, finishedWork.tag));
      }
    }
    function attachSuspenseRetryListeners(finishedWork, wakeables) {
      var retryCache = getRetryCache(finishedWork);
      wakeables.forEach(function(wakeable) {
        if (!retryCache.has(wakeable)) {
          retryCache.add(wakeable);
          var retry = resolveRetryWakeable.bind(null, finishedWork, wakeable);
          wakeable.then(retry, retry);
        }
      });
    }
    function recursivelyTraverseMutationEffects(root$jscomp$0, parentFiber) {
      var deletions = parentFiber.deletions;
      if (null !== deletions)
        for (var i = 0; i < deletions.length; i++) {
          var childToDelete = deletions[i], root2 = root$jscomp$0, returnFiber = parentFiber, parent = returnFiber;
          a: for (; null !== parent; ) {
            switch (parent.tag) {
              case 27:
                if (isSingletonScope(parent.type)) {
                  hostParent = parent.stateNode;
                  hostParentIsContainer = false;
                  break a;
                }
                break;
              case 5:
                hostParent = parent.stateNode;
                hostParentIsContainer = false;
                break a;
              case 3:
              case 4:
                hostParent = parent.stateNode.containerInfo;
                hostParentIsContainer = true;
                break a;
            }
            parent = parent.return;
          }
          if (null === hostParent) throw Error(formatProdErrorMessage(160));
          commitDeletionEffectsOnFiber(root2, returnFiber, childToDelete);
          hostParent = null;
          hostParentIsContainer = false;
          root2 = childToDelete.alternate;
          null !== root2 && (root2.return = null);
          childToDelete.return = null;
        }
      if (parentFiber.subtreeFlags & 13886)
        for (parentFiber = parentFiber.child; null !== parentFiber; )
          commitMutationEffectsOnFiber(parentFiber, root$jscomp$0), parentFiber = parentFiber.sibling;
    }
    var currentHoistableRoot = null;
    function commitMutationEffectsOnFiber(finishedWork, root2) {
      var current = finishedWork.alternate, flags = finishedWork.flags;
      switch (finishedWork.tag) {
        case 0:
        case 11:
        case 14:
        case 15:
          recursivelyTraverseMutationEffects(root2, finishedWork);
          commitReconciliationEffects(finishedWork);
          flags & 4 && (commitHookEffectListUnmount(3, finishedWork, finishedWork.return), commitHookEffectListMount(3, finishedWork), commitHookEffectListUnmount(5, finishedWork, finishedWork.return));
          break;
        case 1:
          recursivelyTraverseMutationEffects(root2, finishedWork);
          commitReconciliationEffects(finishedWork);
          flags & 512 && (offscreenSubtreeWasHidden || null === current || safelyDetachRef(current, current.return));
          flags & 64 && offscreenSubtreeIsHidden && (finishedWork = finishedWork.updateQueue, null !== finishedWork && (flags = finishedWork.callbacks, null !== flags && (current = finishedWork.shared.hiddenCallbacks, finishedWork.shared.hiddenCallbacks = null === current ? flags : current.concat(flags))));
          break;
        case 26:
          var hoistableRoot = currentHoistableRoot;
          recursivelyTraverseMutationEffects(root2, finishedWork);
          commitReconciliationEffects(finishedWork);
          flags & 512 && (offscreenSubtreeWasHidden || null === current || safelyDetachRef(current, current.return));
          if (flags & 4) {
            var currentResource = null !== current ? current.memoizedState : null;
            flags = finishedWork.memoizedState;
            if (null === current)
              if (null === flags)
                if (null === finishedWork.stateNode) {
                  a: {
                    flags = finishedWork.type;
                    current = finishedWork.memoizedProps;
                    hoistableRoot = hoistableRoot.ownerDocument || hoistableRoot;
                    b: switch (flags) {
                      case "title":
                        currentResource = hoistableRoot.getElementsByTagName("title")[0];
                        if (!currentResource || currentResource[internalHoistableMarker] || currentResource[internalInstanceKey] || "http://www.w3.org/2000/svg" === currentResource.namespaceURI || currentResource.hasAttribute("itemprop"))
                          currentResource = hoistableRoot.createElement(flags), hoistableRoot.head.insertBefore(
                            currentResource,
                            hoistableRoot.querySelector("head > title")
                          );
                        setInitialProperties(currentResource, flags, current);
                        currentResource[internalInstanceKey] = finishedWork;
                        markNodeAsHoistable(currentResource);
                        flags = currentResource;
                        break a;
                      case "link":
                        var maybeNodes = getHydratableHoistableCache(
                          "link",
                          "href",
                          hoistableRoot
                        ).get(flags + (current.href || ""));
                        if (maybeNodes) {
                          for (var i = 0; i < maybeNodes.length; i++)
                            if (currentResource = maybeNodes[i], currentResource.getAttribute("href") === (null == current.href || "" === current.href ? null : current.href) && currentResource.getAttribute("rel") === (null == current.rel ? null : current.rel) && currentResource.getAttribute("title") === (null == current.title ? null : current.title) && currentResource.getAttribute("crossorigin") === (null == current.crossOrigin ? null : current.crossOrigin)) {
                              maybeNodes.splice(i, 1);
                              break b;
                            }
                        }
                        currentResource = hoistableRoot.createElement(flags);
                        setInitialProperties(currentResource, flags, current);
                        hoistableRoot.head.appendChild(currentResource);
                        break;
                      case "meta":
                        if (maybeNodes = getHydratableHoistableCache(
                          "meta",
                          "content",
                          hoistableRoot
                        ).get(flags + (current.content || ""))) {
                          for (i = 0; i < maybeNodes.length; i++)
                            if (currentResource = maybeNodes[i], currentResource.getAttribute("content") === (null == current.content ? null : "" + current.content) && currentResource.getAttribute("name") === (null == current.name ? null : current.name) && currentResource.getAttribute("property") === (null == current.property ? null : current.property) && currentResource.getAttribute("http-equiv") === (null == current.httpEquiv ? null : current.httpEquiv) && currentResource.getAttribute("charset") === (null == current.charSet ? null : current.charSet)) {
                              maybeNodes.splice(i, 1);
                              break b;
                            }
                        }
                        currentResource = hoistableRoot.createElement(flags);
                        setInitialProperties(currentResource, flags, current);
                        hoistableRoot.head.appendChild(currentResource);
                        break;
                      default:
                        throw Error(formatProdErrorMessage(468, flags));
                    }
                    currentResource[internalInstanceKey] = finishedWork;
                    markNodeAsHoistable(currentResource);
                    flags = currentResource;
                  }
                  finishedWork.stateNode = flags;
                } else
                  mountHoistable(
                    hoistableRoot,
                    finishedWork.type,
                    finishedWork.stateNode
                  );
              else
                finishedWork.stateNode = acquireResource(
                  hoistableRoot,
                  flags,
                  finishedWork.memoizedProps
                );
            else
              currentResource !== flags ? (null === currentResource ? null !== current.stateNode && (current = current.stateNode, current.parentNode.removeChild(current)) : currentResource.count--, null === flags ? mountHoistable(
                hoistableRoot,
                finishedWork.type,
                finishedWork.stateNode
              ) : acquireResource(
                hoistableRoot,
                flags,
                finishedWork.memoizedProps
              )) : null === flags && null !== finishedWork.stateNode && commitHostUpdate(
                finishedWork,
                finishedWork.memoizedProps,
                current.memoizedProps
              );
          }
          break;
        case 27:
          recursivelyTraverseMutationEffects(root2, finishedWork);
          commitReconciliationEffects(finishedWork);
          flags & 512 && (offscreenSubtreeWasHidden || null === current || safelyDetachRef(current, current.return));
          null !== current && flags & 4 && commitHostUpdate(
            finishedWork,
            finishedWork.memoizedProps,
            current.memoizedProps
          );
          break;
        case 5:
          recursivelyTraverseMutationEffects(root2, finishedWork);
          commitReconciliationEffects(finishedWork);
          flags & 512 && (offscreenSubtreeWasHidden || null === current || safelyDetachRef(current, current.return));
          if (finishedWork.flags & 32) {
            hoistableRoot = finishedWork.stateNode;
            try {
              setTextContent(hoistableRoot, "");
            } catch (error) {
              captureCommitPhaseError(finishedWork, finishedWork.return, error);
            }
          }
          flags & 4 && null != finishedWork.stateNode && (hoistableRoot = finishedWork.memoizedProps, commitHostUpdate(
            finishedWork,
            hoistableRoot,
            null !== current ? current.memoizedProps : hoistableRoot
          ));
          flags & 1024 && (needsFormReset = true);
          break;
        case 6:
          recursivelyTraverseMutationEffects(root2, finishedWork);
          commitReconciliationEffects(finishedWork);
          if (flags & 4) {
            if (null === finishedWork.stateNode)
              throw Error(formatProdErrorMessage(162));
            flags = finishedWork.memoizedProps;
            current = finishedWork.stateNode;
            try {
              current.nodeValue = flags;
            } catch (error) {
              captureCommitPhaseError(finishedWork, finishedWork.return, error);
            }
          }
          break;
        case 3:
          tagCaches = null;
          hoistableRoot = currentHoistableRoot;
          currentHoistableRoot = getHoistableRoot(root2.containerInfo);
          recursivelyTraverseMutationEffects(root2, finishedWork);
          currentHoistableRoot = hoistableRoot;
          commitReconciliationEffects(finishedWork);
          if (flags & 4 && null !== current && current.memoizedState.isDehydrated)
            try {
              retryIfBlockedOn(root2.containerInfo);
            } catch (error) {
              captureCommitPhaseError(finishedWork, finishedWork.return, error);
            }
          needsFormReset && (needsFormReset = false, recursivelyResetForms(finishedWork));
          break;
        case 4:
          flags = currentHoistableRoot;
          currentHoistableRoot = getHoistableRoot(
            finishedWork.stateNode.containerInfo
          );
          recursivelyTraverseMutationEffects(root2, finishedWork);
          commitReconciliationEffects(finishedWork);
          currentHoistableRoot = flags;
          break;
        case 12:
          recursivelyTraverseMutationEffects(root2, finishedWork);
          commitReconciliationEffects(finishedWork);
          break;
        case 31:
          recursivelyTraverseMutationEffects(root2, finishedWork);
          commitReconciliationEffects(finishedWork);
          flags & 4 && (flags = finishedWork.updateQueue, null !== flags && (finishedWork.updateQueue = null, attachSuspenseRetryListeners(finishedWork, flags)));
          break;
        case 13:
          recursivelyTraverseMutationEffects(root2, finishedWork);
          commitReconciliationEffects(finishedWork);
          finishedWork.child.flags & 8192 && null !== finishedWork.memoizedState !== (null !== current && null !== current.memoizedState) && (globalMostRecentFallbackTime = now());
          flags & 4 && (flags = finishedWork.updateQueue, null !== flags && (finishedWork.updateQueue = null, attachSuspenseRetryListeners(finishedWork, flags)));
          break;
        case 22:
          hoistableRoot = null !== finishedWork.memoizedState;
          var wasHidden = null !== current && null !== current.memoizedState, prevOffscreenSubtreeIsHidden = offscreenSubtreeIsHidden, prevOffscreenSubtreeWasHidden = offscreenSubtreeWasHidden;
          offscreenSubtreeIsHidden = prevOffscreenSubtreeIsHidden || hoistableRoot;
          offscreenSubtreeWasHidden = prevOffscreenSubtreeWasHidden || wasHidden;
          recursivelyTraverseMutationEffects(root2, finishedWork);
          offscreenSubtreeWasHidden = prevOffscreenSubtreeWasHidden;
          offscreenSubtreeIsHidden = prevOffscreenSubtreeIsHidden;
          commitReconciliationEffects(finishedWork);
          if (flags & 8192)
            a: for (root2 = finishedWork.stateNode, root2._visibility = hoistableRoot ? root2._visibility & -2 : root2._visibility | 1, hoistableRoot && (null === current || wasHidden || offscreenSubtreeIsHidden || offscreenSubtreeWasHidden || recursivelyTraverseDisappearLayoutEffects(finishedWork)), current = null, root2 = finishedWork; ; ) {
              if (5 === root2.tag || 26 === root2.tag) {
                if (null === current) {
                  wasHidden = current = root2;
                  try {
                    if (currentResource = wasHidden.stateNode, hoistableRoot)
                      maybeNodes = currentResource.style, "function" === typeof maybeNodes.setProperty ? maybeNodes.setProperty("display", "none", "important") : maybeNodes.display = "none";
                    else {
                      i = wasHidden.stateNode;
                      var styleProp = wasHidden.memoizedProps.style, display = void 0 !== styleProp && null !== styleProp && styleProp.hasOwnProperty("display") ? styleProp.display : null;
                      i.style.display = null == display || "boolean" === typeof display ? "" : ("" + display).trim();
                    }
                  } catch (error) {
                    captureCommitPhaseError(wasHidden, wasHidden.return, error);
                  }
                }
              } else if (6 === root2.tag) {
                if (null === current) {
                  wasHidden = root2;
                  try {
                    wasHidden.stateNode.nodeValue = hoistableRoot ? "" : wasHidden.memoizedProps;
                  } catch (error) {
                    captureCommitPhaseError(wasHidden, wasHidden.return, error);
                  }
                }
              } else if (18 === root2.tag) {
                if (null === current) {
                  wasHidden = root2;
                  try {
                    var instance = wasHidden.stateNode;
                    hoistableRoot ? hideOrUnhideDehydratedBoundary(instance, true) : hideOrUnhideDehydratedBoundary(wasHidden.stateNode, false);
                  } catch (error) {
                    captureCommitPhaseError(wasHidden, wasHidden.return, error);
                  }
                }
              } else if ((22 !== root2.tag && 23 !== root2.tag || null === root2.memoizedState || root2 === finishedWork) && null !== root2.child) {
                root2.child.return = root2;
                root2 = root2.child;
                continue;
              }
              if (root2 === finishedWork) break a;
              for (; null === root2.sibling; ) {
                if (null === root2.return || root2.return === finishedWork) break a;
                current === root2 && (current = null);
                root2 = root2.return;
              }
              current === root2 && (current = null);
              root2.sibling.return = root2.return;
              root2 = root2.sibling;
            }
          flags & 4 && (flags = finishedWork.updateQueue, null !== flags && (current = flags.retryQueue, null !== current && (flags.retryQueue = null, attachSuspenseRetryListeners(finishedWork, current))));
          break;
        case 19:
          recursivelyTraverseMutationEffects(root2, finishedWork);
          commitReconciliationEffects(finishedWork);
          flags & 4 && (flags = finishedWork.updateQueue, null !== flags && (finishedWork.updateQueue = null, attachSuspenseRetryListeners(finishedWork, flags)));
          break;
        case 30:
          break;
        case 21:
          break;
        default:
          recursivelyTraverseMutationEffects(root2, finishedWork), commitReconciliationEffects(finishedWork);
      }
    }
    function commitReconciliationEffects(finishedWork) {
      var flags = finishedWork.flags;
      if (flags & 2) {
        try {
          for (var hostParentFiber, parentFiber = finishedWork.return; null !== parentFiber; ) {
            if (isHostParent(parentFiber)) {
              hostParentFiber = parentFiber;
              break;
            }
            parentFiber = parentFiber.return;
          }
          if (null == hostParentFiber) throw Error(formatProdErrorMessage(160));
          switch (hostParentFiber.tag) {
            case 27:
              var parent = hostParentFiber.stateNode, before = getHostSibling(finishedWork);
              insertOrAppendPlacementNode(finishedWork, before, parent);
              break;
            case 5:
              var parent$141 = hostParentFiber.stateNode;
              hostParentFiber.flags & 32 && (setTextContent(parent$141, ""), hostParentFiber.flags &= -33);
              var before$142 = getHostSibling(finishedWork);
              insertOrAppendPlacementNode(finishedWork, before$142, parent$141);
              break;
            case 3:
            case 4:
              var parent$143 = hostParentFiber.stateNode.containerInfo, before$144 = getHostSibling(finishedWork);
              insertOrAppendPlacementNodeIntoContainer(
                finishedWork,
                before$144,
                parent$143
              );
              break;
            default:
              throw Error(formatProdErrorMessage(161));
          }
        } catch (error) {
          captureCommitPhaseError(finishedWork, finishedWork.return, error);
        }
        finishedWork.flags &= -3;
      }
      flags & 4096 && (finishedWork.flags &= -4097);
    }
    function recursivelyResetForms(parentFiber) {
      if (parentFiber.subtreeFlags & 1024)
        for (parentFiber = parentFiber.child; null !== parentFiber; ) {
          var fiber = parentFiber;
          recursivelyResetForms(fiber);
          5 === fiber.tag && fiber.flags & 1024 && fiber.stateNode.reset();
          parentFiber = parentFiber.sibling;
        }
    }
    function recursivelyTraverseLayoutEffects(root2, parentFiber) {
      if (parentFiber.subtreeFlags & 8772)
        for (parentFiber = parentFiber.child; null !== parentFiber; )
          commitLayoutEffectOnFiber(root2, parentFiber.alternate, parentFiber), parentFiber = parentFiber.sibling;
    }
    function recursivelyTraverseDisappearLayoutEffects(parentFiber) {
      for (parentFiber = parentFiber.child; null !== parentFiber; ) {
        var finishedWork = parentFiber;
        switch (finishedWork.tag) {
          case 0:
          case 11:
          case 14:
          case 15:
            commitHookEffectListUnmount(4, finishedWork, finishedWork.return);
            recursivelyTraverseDisappearLayoutEffects(finishedWork);
            break;
          case 1:
            safelyDetachRef(finishedWork, finishedWork.return);
            var instance = finishedWork.stateNode;
            "function" === typeof instance.componentWillUnmount && safelyCallComponentWillUnmount(
              finishedWork,
              finishedWork.return,
              instance
            );
            recursivelyTraverseDisappearLayoutEffects(finishedWork);
            break;
          case 27:
            releaseSingletonInstance(finishedWork.stateNode);
          case 26:
          case 5:
            safelyDetachRef(finishedWork, finishedWork.return);
            recursivelyTraverseDisappearLayoutEffects(finishedWork);
            break;
          case 22:
            null === finishedWork.memoizedState && recursivelyTraverseDisappearLayoutEffects(finishedWork);
            break;
          case 30:
            recursivelyTraverseDisappearLayoutEffects(finishedWork);
            break;
          default:
            recursivelyTraverseDisappearLayoutEffects(finishedWork);
        }
        parentFiber = parentFiber.sibling;
      }
    }
    function recursivelyTraverseReappearLayoutEffects(finishedRoot$jscomp$0, parentFiber, includeWorkInProgressEffects) {
      includeWorkInProgressEffects = includeWorkInProgressEffects && 0 !== (parentFiber.subtreeFlags & 8772);
      for (parentFiber = parentFiber.child; null !== parentFiber; ) {
        var current = parentFiber.alternate, finishedRoot = finishedRoot$jscomp$0, finishedWork = parentFiber, flags = finishedWork.flags;
        switch (finishedWork.tag) {
          case 0:
          case 11:
          case 15:
            recursivelyTraverseReappearLayoutEffects(
              finishedRoot,
              finishedWork,
              includeWorkInProgressEffects
            );
            commitHookEffectListMount(4, finishedWork);
            break;
          case 1:
            recursivelyTraverseReappearLayoutEffects(
              finishedRoot,
              finishedWork,
              includeWorkInProgressEffects
            );
            current = finishedWork;
            finishedRoot = current.stateNode;
            if ("function" === typeof finishedRoot.componentDidMount)
              try {
                finishedRoot.componentDidMount();
              } catch (error) {
                captureCommitPhaseError(current, current.return, error);
              }
            current = finishedWork;
            finishedRoot = current.updateQueue;
            if (null !== finishedRoot) {
              var instance = current.stateNode;
              try {
                var hiddenCallbacks = finishedRoot.shared.hiddenCallbacks;
                if (null !== hiddenCallbacks)
                  for (finishedRoot.shared.hiddenCallbacks = null, finishedRoot = 0; finishedRoot < hiddenCallbacks.length; finishedRoot++)
                    callCallback(hiddenCallbacks[finishedRoot], instance);
              } catch (error) {
                captureCommitPhaseError(current, current.return, error);
              }
            }
            includeWorkInProgressEffects && flags & 64 && commitClassCallbacks(finishedWork);
            safelyAttachRef(finishedWork, finishedWork.return);
            break;
          case 27:
            commitHostSingletonAcquisition(finishedWork);
          case 26:
          case 5:
            recursivelyTraverseReappearLayoutEffects(
              finishedRoot,
              finishedWork,
              includeWorkInProgressEffects
            );
            includeWorkInProgressEffects && null === current && flags & 4 && commitHostMount(finishedWork);
            safelyAttachRef(finishedWork, finishedWork.return);
            break;
          case 12:
            recursivelyTraverseReappearLayoutEffects(
              finishedRoot,
              finishedWork,
              includeWorkInProgressEffects
            );
            break;
          case 31:
            recursivelyTraverseReappearLayoutEffects(
              finishedRoot,
              finishedWork,
              includeWorkInProgressEffects
            );
            includeWorkInProgressEffects && flags & 4 && commitActivityHydrationCallbacks(finishedRoot, finishedWork);
            break;
          case 13:
            recursivelyTraverseReappearLayoutEffects(
              finishedRoot,
              finishedWork,
              includeWorkInProgressEffects
            );
            includeWorkInProgressEffects && flags & 4 && commitSuspenseHydrationCallbacks(finishedRoot, finishedWork);
            break;
          case 22:
            null === finishedWork.memoizedState && recursivelyTraverseReappearLayoutEffects(
              finishedRoot,
              finishedWork,
              includeWorkInProgressEffects
            );
            safelyAttachRef(finishedWork, finishedWork.return);
            break;
          case 30:
            break;
          default:
            recursivelyTraverseReappearLayoutEffects(
              finishedRoot,
              finishedWork,
              includeWorkInProgressEffects
            );
        }
        parentFiber = parentFiber.sibling;
      }
    }
    function commitOffscreenPassiveMountEffects(current, finishedWork) {
      var previousCache = null;
      null !== current && null !== current.memoizedState && null !== current.memoizedState.cachePool && (previousCache = current.memoizedState.cachePool.pool);
      current = null;
      null !== finishedWork.memoizedState && null !== finishedWork.memoizedState.cachePool && (current = finishedWork.memoizedState.cachePool.pool);
      current !== previousCache && (null != current && current.refCount++, null != previousCache && releaseCache(previousCache));
    }
    function commitCachePassiveMountEffect(current, finishedWork) {
      current = null;
      null !== finishedWork.alternate && (current = finishedWork.alternate.memoizedState.cache);
      finishedWork = finishedWork.memoizedState.cache;
      finishedWork !== current && (finishedWork.refCount++, null != current && releaseCache(current));
    }
    function recursivelyTraversePassiveMountEffects(root2, parentFiber, committedLanes, committedTransitions) {
      if (parentFiber.subtreeFlags & 10256)
        for (parentFiber = parentFiber.child; null !== parentFiber; )
          commitPassiveMountOnFiber(
            root2,
            parentFiber,
            committedLanes,
            committedTransitions
          ), parentFiber = parentFiber.sibling;
    }
    function commitPassiveMountOnFiber(finishedRoot, finishedWork, committedLanes, committedTransitions) {
      var flags = finishedWork.flags;
      switch (finishedWork.tag) {
        case 0:
        case 11:
        case 15:
          recursivelyTraversePassiveMountEffects(
            finishedRoot,
            finishedWork,
            committedLanes,
            committedTransitions
          );
          flags & 2048 && commitHookEffectListMount(9, finishedWork);
          break;
        case 1:
          recursivelyTraversePassiveMountEffects(
            finishedRoot,
            finishedWork,
            committedLanes,
            committedTransitions
          );
          break;
        case 3:
          recursivelyTraversePassiveMountEffects(
            finishedRoot,
            finishedWork,
            committedLanes,
            committedTransitions
          );
          flags & 2048 && (finishedRoot = null, null !== finishedWork.alternate && (finishedRoot = finishedWork.alternate.memoizedState.cache), finishedWork = finishedWork.memoizedState.cache, finishedWork !== finishedRoot && (finishedWork.refCount++, null != finishedRoot && releaseCache(finishedRoot)));
          break;
        case 12:
          if (flags & 2048) {
            recursivelyTraversePassiveMountEffects(
              finishedRoot,
              finishedWork,
              committedLanes,
              committedTransitions
            );
            finishedRoot = finishedWork.stateNode;
            try {
              var _finishedWork$memoize2 = finishedWork.memoizedProps, id = _finishedWork$memoize2.id, onPostCommit = _finishedWork$memoize2.onPostCommit;
              "function" === typeof onPostCommit && onPostCommit(
                id,
                null === finishedWork.alternate ? "mount" : "update",
                finishedRoot.passiveEffectDuration,
                -0
              );
            } catch (error) {
              captureCommitPhaseError(finishedWork, finishedWork.return, error);
            }
          } else
            recursivelyTraversePassiveMountEffects(
              finishedRoot,
              finishedWork,
              committedLanes,
              committedTransitions
            );
          break;
        case 31:
          recursivelyTraversePassiveMountEffects(
            finishedRoot,
            finishedWork,
            committedLanes,
            committedTransitions
          );
          break;
        case 13:
          recursivelyTraversePassiveMountEffects(
            finishedRoot,
            finishedWork,
            committedLanes,
            committedTransitions
          );
          break;
        case 23:
          break;
        case 22:
          _finishedWork$memoize2 = finishedWork.stateNode;
          id = finishedWork.alternate;
          null !== finishedWork.memoizedState ? _finishedWork$memoize2._visibility & 2 ? recursivelyTraversePassiveMountEffects(
            finishedRoot,
            finishedWork,
            committedLanes,
            committedTransitions
          ) : recursivelyTraverseAtomicPassiveEffects(finishedRoot, finishedWork) : _finishedWork$memoize2._visibility & 2 ? recursivelyTraversePassiveMountEffects(
            finishedRoot,
            finishedWork,
            committedLanes,
            committedTransitions
          ) : (_finishedWork$memoize2._visibility |= 2, recursivelyTraverseReconnectPassiveEffects(
            finishedRoot,
            finishedWork,
            committedLanes,
            committedTransitions,
            0 !== (finishedWork.subtreeFlags & 10256) || false
          ));
          flags & 2048 && commitOffscreenPassiveMountEffects(id, finishedWork);
          break;
        case 24:
          recursivelyTraversePassiveMountEffects(
            finishedRoot,
            finishedWork,
            committedLanes,
            committedTransitions
          );
          flags & 2048 && commitCachePassiveMountEffect(finishedWork.alternate, finishedWork);
          break;
        default:
          recursivelyTraversePassiveMountEffects(
            finishedRoot,
            finishedWork,
            committedLanes,
            committedTransitions
          );
      }
    }
    function recursivelyTraverseReconnectPassiveEffects(finishedRoot$jscomp$0, parentFiber, committedLanes$jscomp$0, committedTransitions$jscomp$0, includeWorkInProgressEffects) {
      includeWorkInProgressEffects = includeWorkInProgressEffects && (0 !== (parentFiber.subtreeFlags & 10256) || false);
      for (parentFiber = parentFiber.child; null !== parentFiber; ) {
        var finishedRoot = finishedRoot$jscomp$0, finishedWork = parentFiber, committedLanes = committedLanes$jscomp$0, committedTransitions = committedTransitions$jscomp$0, flags = finishedWork.flags;
        switch (finishedWork.tag) {
          case 0:
          case 11:
          case 15:
            recursivelyTraverseReconnectPassiveEffects(
              finishedRoot,
              finishedWork,
              committedLanes,
              committedTransitions,
              includeWorkInProgressEffects
            );
            commitHookEffectListMount(8, finishedWork);
            break;
          case 23:
            break;
          case 22:
            var instance = finishedWork.stateNode;
            null !== finishedWork.memoizedState ? instance._visibility & 2 ? recursivelyTraverseReconnectPassiveEffects(
              finishedRoot,
              finishedWork,
              committedLanes,
              committedTransitions,
              includeWorkInProgressEffects
            ) : recursivelyTraverseAtomicPassiveEffects(
              finishedRoot,
              finishedWork
            ) : (instance._visibility |= 2, recursivelyTraverseReconnectPassiveEffects(
              finishedRoot,
              finishedWork,
              committedLanes,
              committedTransitions,
              includeWorkInProgressEffects
            ));
            includeWorkInProgressEffects && flags & 2048 && commitOffscreenPassiveMountEffects(
              finishedWork.alternate,
              finishedWork
            );
            break;
          case 24:
            recursivelyTraverseReconnectPassiveEffects(
              finishedRoot,
              finishedWork,
              committedLanes,
              committedTransitions,
              includeWorkInProgressEffects
            );
            includeWorkInProgressEffects && flags & 2048 && commitCachePassiveMountEffect(finishedWork.alternate, finishedWork);
            break;
          default:
            recursivelyTraverseReconnectPassiveEffects(
              finishedRoot,
              finishedWork,
              committedLanes,
              committedTransitions,
              includeWorkInProgressEffects
            );
        }
        parentFiber = parentFiber.sibling;
      }
    }
    function recursivelyTraverseAtomicPassiveEffects(finishedRoot$jscomp$0, parentFiber) {
      if (parentFiber.subtreeFlags & 10256)
        for (parentFiber = parentFiber.child; null !== parentFiber; ) {
          var finishedRoot = finishedRoot$jscomp$0, finishedWork = parentFiber, flags = finishedWork.flags;
          switch (finishedWork.tag) {
            case 22:
              recursivelyTraverseAtomicPassiveEffects(finishedRoot, finishedWork);
              flags & 2048 && commitOffscreenPassiveMountEffects(
                finishedWork.alternate,
                finishedWork
              );
              break;
            case 24:
              recursivelyTraverseAtomicPassiveEffects(finishedRoot, finishedWork);
              flags & 2048 && commitCachePassiveMountEffect(finishedWork.alternate, finishedWork);
              break;
            default:
              recursivelyTraverseAtomicPassiveEffects(finishedRoot, finishedWork);
          }
          parentFiber = parentFiber.sibling;
        }
    }
    var suspenseyCommitFlag = 8192;
    function recursivelyAccumulateSuspenseyCommit(parentFiber, committedLanes, suspendedState) {
      if (parentFiber.subtreeFlags & suspenseyCommitFlag)
        for (parentFiber = parentFiber.child; null !== parentFiber; )
          accumulateSuspenseyCommitOnFiber(
            parentFiber,
            committedLanes,
            suspendedState
          ), parentFiber = parentFiber.sibling;
    }
    function accumulateSuspenseyCommitOnFiber(fiber, committedLanes, suspendedState) {
      switch (fiber.tag) {
        case 26:
          recursivelyAccumulateSuspenseyCommit(
            fiber,
            committedLanes,
            suspendedState
          );
          fiber.flags & suspenseyCommitFlag && null !== fiber.memoizedState && suspendResource(
            suspendedState,
            currentHoistableRoot,
            fiber.memoizedState,
            fiber.memoizedProps
          );
          break;
        case 5:
          recursivelyAccumulateSuspenseyCommit(
            fiber,
            committedLanes,
            suspendedState
          );
          break;
        case 3:
        case 4:
          var previousHoistableRoot = currentHoistableRoot;
          currentHoistableRoot = getHoistableRoot(fiber.stateNode.containerInfo);
          recursivelyAccumulateSuspenseyCommit(
            fiber,
            committedLanes,
            suspendedState
          );
          currentHoistableRoot = previousHoistableRoot;
          break;
        case 22:
          null === fiber.memoizedState && (previousHoistableRoot = fiber.alternate, null !== previousHoistableRoot && null !== previousHoistableRoot.memoizedState ? (previousHoistableRoot = suspenseyCommitFlag, suspenseyCommitFlag = 16777216, recursivelyAccumulateSuspenseyCommit(
            fiber,
            committedLanes,
            suspendedState
          ), suspenseyCommitFlag = previousHoistableRoot) : recursivelyAccumulateSuspenseyCommit(
            fiber,
            committedLanes,
            suspendedState
          ));
          break;
        default:
          recursivelyAccumulateSuspenseyCommit(
            fiber,
            committedLanes,
            suspendedState
          );
      }
    }
    function detachAlternateSiblings(parentFiber) {
      var previousFiber = parentFiber.alternate;
      if (null !== previousFiber && (parentFiber = previousFiber.child, null !== parentFiber)) {
        previousFiber.child = null;
        do
          previousFiber = parentFiber.sibling, parentFiber.sibling = null, parentFiber = previousFiber;
        while (null !== parentFiber);
      }
    }
    function recursivelyTraversePassiveUnmountEffects(parentFiber) {
      var deletions = parentFiber.deletions;
      if (0 !== (parentFiber.flags & 16)) {
        if (null !== deletions)
          for (var i = 0; i < deletions.length; i++) {
            var childToDelete = deletions[i];
            nextEffect = childToDelete;
            commitPassiveUnmountEffectsInsideOfDeletedTree_begin(
              childToDelete,
              parentFiber
            );
          }
        detachAlternateSiblings(parentFiber);
      }
      if (parentFiber.subtreeFlags & 10256)
        for (parentFiber = parentFiber.child; null !== parentFiber; )
          commitPassiveUnmountOnFiber(parentFiber), parentFiber = parentFiber.sibling;
    }
    function commitPassiveUnmountOnFiber(finishedWork) {
      switch (finishedWork.tag) {
        case 0:
        case 11:
        case 15:
          recursivelyTraversePassiveUnmountEffects(finishedWork);
          finishedWork.flags & 2048 && commitHookEffectListUnmount(9, finishedWork, finishedWork.return);
          break;
        case 3:
          recursivelyTraversePassiveUnmountEffects(finishedWork);
          break;
        case 12:
          recursivelyTraversePassiveUnmountEffects(finishedWork);
          break;
        case 22:
          var instance = finishedWork.stateNode;
          null !== finishedWork.memoizedState && instance._visibility & 2 && (null === finishedWork.return || 13 !== finishedWork.return.tag) ? (instance._visibility &= -3, recursivelyTraverseDisconnectPassiveEffects(finishedWork)) : recursivelyTraversePassiveUnmountEffects(finishedWork);
          break;
        default:
          recursivelyTraversePassiveUnmountEffects(finishedWork);
      }
    }
    function recursivelyTraverseDisconnectPassiveEffects(parentFiber) {
      var deletions = parentFiber.deletions;
      if (0 !== (parentFiber.flags & 16)) {
        if (null !== deletions)
          for (var i = 0; i < deletions.length; i++) {
            var childToDelete = deletions[i];
            nextEffect = childToDelete;
            commitPassiveUnmountEffectsInsideOfDeletedTree_begin(
              childToDelete,
              parentFiber
            );
          }
        detachAlternateSiblings(parentFiber);
      }
      for (parentFiber = parentFiber.child; null !== parentFiber; ) {
        deletions = parentFiber;
        switch (deletions.tag) {
          case 0:
          case 11:
          case 15:
            commitHookEffectListUnmount(8, deletions, deletions.return);
            recursivelyTraverseDisconnectPassiveEffects(deletions);
            break;
          case 22:
            i = deletions.stateNode;
            i._visibility & 2 && (i._visibility &= -3, recursivelyTraverseDisconnectPassiveEffects(deletions));
            break;
          default:
            recursivelyTraverseDisconnectPassiveEffects(deletions);
        }
        parentFiber = parentFiber.sibling;
      }
    }
    function commitPassiveUnmountEffectsInsideOfDeletedTree_begin(deletedSubtreeRoot, nearestMountedAncestor) {
      for (; null !== nextEffect; ) {
        var fiber = nextEffect;
        switch (fiber.tag) {
          case 0:
          case 11:
          case 15:
            commitHookEffectListUnmount(8, fiber, nearestMountedAncestor);
            break;
          case 23:
          case 22:
            if (null !== fiber.memoizedState && null !== fiber.memoizedState.cachePool) {
              var cache = fiber.memoizedState.cachePool.pool;
              null != cache && cache.refCount++;
            }
            break;
          case 24:
            releaseCache(fiber.memoizedState.cache);
        }
        cache = fiber.child;
        if (null !== cache) cache.return = fiber, nextEffect = cache;
        else
          a: for (fiber = deletedSubtreeRoot; null !== nextEffect; ) {
            cache = nextEffect;
            var sibling = cache.sibling, returnFiber = cache.return;
            detachFiberAfterEffects(cache);
            if (cache === fiber) {
              nextEffect = null;
              break a;
            }
            if (null !== sibling) {
              sibling.return = returnFiber;
              nextEffect = sibling;
              break a;
            }
            nextEffect = returnFiber;
          }
      }
    }
    var DefaultAsyncDispatcher = {
      getCacheForType: function(resourceType) {
        var cache = readContext(CacheContext), cacheForType = cache.data.get(resourceType);
        void 0 === cacheForType && (cacheForType = resourceType(), cache.data.set(resourceType, cacheForType));
        return cacheForType;
      },
      cacheSignal: function() {
        return readContext(CacheContext).controller.signal;
      }
    }, PossiblyWeakMap = "function" === typeof WeakMap ? WeakMap : Map, executionContext = 0, workInProgressRoot = null, workInProgress = null, workInProgressRootRenderLanes = 0, workInProgressSuspendedReason = 0, workInProgressThrownValue = null, workInProgressRootDidSkipSuspendedSiblings = false, workInProgressRootIsPrerendering = false, workInProgressRootDidAttachPingListener = false, entangledRenderLanes = 0, workInProgressRootExitStatus = 0, workInProgressRootSkippedLanes = 0, workInProgressRootInterleavedUpdatedLanes = 0, workInProgressRootPingedLanes = 0, workInProgressDeferredLane = 0, workInProgressSuspendedRetryLanes = 0, workInProgressRootConcurrentErrors = null, workInProgressRootRecoverableErrors = null, workInProgressRootDidIncludeRecursiveRenderUpdate = false, globalMostRecentFallbackTime = 0, globalMostRecentTransitionTime = 0, workInProgressRootRenderTargetTime = Infinity, workInProgressTransitions = null, legacyErrorBoundariesThatAlreadyFailed = null, pendingEffectsStatus = 0, pendingEffectsRoot = null, pendingFinishedWork = null, pendingEffectsLanes = 0, pendingEffectsRemainingLanes = 0, pendingPassiveTransitions = null, pendingRecoverableErrors = null, nestedUpdateCount = 0, rootWithNestedUpdates = null;
    function requestUpdateLane() {
      return 0 !== (executionContext & 2) && 0 !== workInProgressRootRenderLanes ? workInProgressRootRenderLanes & -workInProgressRootRenderLanes : null !== ReactSharedInternals.T ? requestTransitionLane() : resolveUpdatePriority();
    }
    function requestDeferredLane() {
      if (0 === workInProgressDeferredLane)
        if (0 === (workInProgressRootRenderLanes & 536870912) || isHydrating) {
          var lane = nextTransitionDeferredLane;
          nextTransitionDeferredLane <<= 1;
          0 === (nextTransitionDeferredLane & 3932160) && (nextTransitionDeferredLane = 262144);
          workInProgressDeferredLane = lane;
        } else workInProgressDeferredLane = 536870912;
      lane = suspenseHandlerStackCursor.current;
      null !== lane && (lane.flags |= 32);
      return workInProgressDeferredLane;
    }
    function scheduleUpdateOnFiber(root2, fiber, lane) {
      if (root2 === workInProgressRoot && (2 === workInProgressSuspendedReason || 9 === workInProgressSuspendedReason) || null !== root2.cancelPendingCommit)
        prepareFreshStack(root2, 0), markRootSuspended(
          root2,
          workInProgressRootRenderLanes,
          workInProgressDeferredLane,
          false
        );
      markRootUpdated$1(root2, lane);
      if (0 === (executionContext & 2) || root2 !== workInProgressRoot)
        root2 === workInProgressRoot && (0 === (executionContext & 2) && (workInProgressRootInterleavedUpdatedLanes |= lane), 4 === workInProgressRootExitStatus && markRootSuspended(
          root2,
          workInProgressRootRenderLanes,
          workInProgressDeferredLane,
          false
        )), ensureRootIsScheduled(root2);
    }
    function performWorkOnRoot(root$jscomp$0, lanes, forceSync) {
      if (0 !== (executionContext & 6)) throw Error(formatProdErrorMessage(327));
      var shouldTimeSlice = !forceSync && 0 === (lanes & 127) && 0 === (lanes & root$jscomp$0.expiredLanes) || checkIfRootIsPrerendering(root$jscomp$0, lanes), exitStatus = shouldTimeSlice ? renderRootConcurrent(root$jscomp$0, lanes) : renderRootSync(root$jscomp$0, lanes, true), renderWasConcurrent = shouldTimeSlice;
      do {
        if (0 === exitStatus) {
          workInProgressRootIsPrerendering && !shouldTimeSlice && markRootSuspended(root$jscomp$0, lanes, 0, false);
          break;
        } else {
          forceSync = root$jscomp$0.current.alternate;
          if (renderWasConcurrent && !isRenderConsistentWithExternalStores(forceSync)) {
            exitStatus = renderRootSync(root$jscomp$0, lanes, false);
            renderWasConcurrent = false;
            continue;
          }
          if (2 === exitStatus) {
            renderWasConcurrent = lanes;
            if (root$jscomp$0.errorRecoveryDisabledLanes & renderWasConcurrent)
              var JSCompiler_inline_result = 0;
            else
              JSCompiler_inline_result = root$jscomp$0.pendingLanes & -536870913, JSCompiler_inline_result = 0 !== JSCompiler_inline_result ? JSCompiler_inline_result : JSCompiler_inline_result & 536870912 ? 536870912 : 0;
            if (0 !== JSCompiler_inline_result) {
              lanes = JSCompiler_inline_result;
              a: {
                var root2 = root$jscomp$0;
                exitStatus = workInProgressRootConcurrentErrors;
                var wasRootDehydrated = root2.current.memoizedState.isDehydrated;
                wasRootDehydrated && (prepareFreshStack(root2, JSCompiler_inline_result).flags |= 256);
                JSCompiler_inline_result = renderRootSync(
                  root2,
                  JSCompiler_inline_result,
                  false
                );
                if (2 !== JSCompiler_inline_result) {
                  if (workInProgressRootDidAttachPingListener && !wasRootDehydrated) {
                    root2.errorRecoveryDisabledLanes |= renderWasConcurrent;
                    workInProgressRootInterleavedUpdatedLanes |= renderWasConcurrent;
                    exitStatus = 4;
                    break a;
                  }
                  renderWasConcurrent = workInProgressRootRecoverableErrors;
                  workInProgressRootRecoverableErrors = exitStatus;
                  null !== renderWasConcurrent && (null === workInProgressRootRecoverableErrors ? workInProgressRootRecoverableErrors = renderWasConcurrent : workInProgressRootRecoverableErrors.push.apply(
                    workInProgressRootRecoverableErrors,
                    renderWasConcurrent
                  ));
                }
                exitStatus = JSCompiler_inline_result;
              }
              renderWasConcurrent = false;
              if (2 !== exitStatus) continue;
            }
          }
          if (1 === exitStatus) {
            prepareFreshStack(root$jscomp$0, 0);
            markRootSuspended(root$jscomp$0, lanes, 0, true);
            break;
          }
          a: {
            shouldTimeSlice = root$jscomp$0;
            renderWasConcurrent = exitStatus;
            switch (renderWasConcurrent) {
              case 0:
              case 1:
                throw Error(formatProdErrorMessage(345));
              case 4:
                if ((lanes & 4194048) !== lanes) break;
              case 6:
                markRootSuspended(
                  shouldTimeSlice,
                  lanes,
                  workInProgressDeferredLane,
                  !workInProgressRootDidSkipSuspendedSiblings
                );
                break a;
              case 2:
                workInProgressRootRecoverableErrors = null;
                break;
              case 3:
              case 5:
                break;
              default:
                throw Error(formatProdErrorMessage(329));
            }
            if ((lanes & 62914560) === lanes && (exitStatus = globalMostRecentFallbackTime + 300 - now(), 10 < exitStatus)) {
              markRootSuspended(
                shouldTimeSlice,
                lanes,
                workInProgressDeferredLane,
                !workInProgressRootDidSkipSuspendedSiblings
              );
              if (0 !== getNextLanes(shouldTimeSlice, 0, true)) break a;
              pendingEffectsLanes = lanes;
              shouldTimeSlice.timeoutHandle = scheduleTimeout(
                commitRootWhenReady.bind(
                  null,
                  shouldTimeSlice,
                  forceSync,
                  workInProgressRootRecoverableErrors,
                  workInProgressTransitions,
                  workInProgressRootDidIncludeRecursiveRenderUpdate,
                  lanes,
                  workInProgressDeferredLane,
                  workInProgressRootInterleavedUpdatedLanes,
                  workInProgressSuspendedRetryLanes,
                  workInProgressRootDidSkipSuspendedSiblings,
                  renderWasConcurrent,
                  "Throttled",
                  -0,
                  0
                ),
                exitStatus
              );
              break a;
            }
            commitRootWhenReady(
              shouldTimeSlice,
              forceSync,
              workInProgressRootRecoverableErrors,
              workInProgressTransitions,
              workInProgressRootDidIncludeRecursiveRenderUpdate,
              lanes,
              workInProgressDeferredLane,
              workInProgressRootInterleavedUpdatedLanes,
              workInProgressSuspendedRetryLanes,
              workInProgressRootDidSkipSuspendedSiblings,
              renderWasConcurrent,
              null,
              -0,
              0
            );
          }
        }
        break;
      } while (1);
      ensureRootIsScheduled(root$jscomp$0);
    }
    function commitRootWhenReady(root2, finishedWork, recoverableErrors, transitions, didIncludeRenderPhaseUpdate, lanes, spawnedLane, updatedLanes, suspendedRetryLanes, didSkipSuspendedSiblings, exitStatus, suspendedCommitReason, completedRenderStartTime, completedRenderEndTime) {
      root2.timeoutHandle = -1;
      suspendedCommitReason = finishedWork.subtreeFlags;
      if (suspendedCommitReason & 8192 || 16785408 === (suspendedCommitReason & 16785408)) {
        suspendedCommitReason = {
          stylesheets: null,
          count: 0,
          imgCount: 0,
          imgBytes: 0,
          suspenseyImages: [],
          waitingForImages: true,
          waitingForViewTransition: false,
          unsuspend: noop$1
        };
        accumulateSuspenseyCommitOnFiber(
          finishedWork,
          lanes,
          suspendedCommitReason
        );
        var timeoutOffset = (lanes & 62914560) === lanes ? globalMostRecentFallbackTime - now() : (lanes & 4194048) === lanes ? globalMostRecentTransitionTime - now() : 0;
        timeoutOffset = waitForCommitToBeReady(
          suspendedCommitReason,
          timeoutOffset
        );
        if (null !== timeoutOffset) {
          pendingEffectsLanes = lanes;
          root2.cancelPendingCommit = timeoutOffset(
            commitRoot.bind(
              null,
              root2,
              finishedWork,
              lanes,
              recoverableErrors,
              transitions,
              didIncludeRenderPhaseUpdate,
              spawnedLane,
              updatedLanes,
              suspendedRetryLanes,
              exitStatus,
              suspendedCommitReason,
              null,
              completedRenderStartTime,
              completedRenderEndTime
            )
          );
          markRootSuspended(root2, lanes, spawnedLane, !didSkipSuspendedSiblings);
          return;
        }
      }
      commitRoot(
        root2,
        finishedWork,
        lanes,
        recoverableErrors,
        transitions,
        didIncludeRenderPhaseUpdate,
        spawnedLane,
        updatedLanes,
        suspendedRetryLanes
      );
    }
    function isRenderConsistentWithExternalStores(finishedWork) {
      for (var node = finishedWork; ; ) {
        var tag = node.tag;
        if ((0 === tag || 11 === tag || 15 === tag) && node.flags & 16384 && (tag = node.updateQueue, null !== tag && (tag = tag.stores, null !== tag)))
          for (var i = 0; i < tag.length; i++) {
            var check = tag[i], getSnapshot = check.getSnapshot;
            check = check.value;
            try {
              if (!objectIs(getSnapshot(), check)) return false;
            } catch (error) {
              return false;
            }
          }
        tag = node.child;
        if (node.subtreeFlags & 16384 && null !== tag)
          tag.return = node, node = tag;
        else {
          if (node === finishedWork) break;
          for (; null === node.sibling; ) {
            if (null === node.return || node.return === finishedWork) return true;
            node = node.return;
          }
          node.sibling.return = node.return;
          node = node.sibling;
        }
      }
      return true;
    }
    function markRootSuspended(root2, suspendedLanes, spawnedLane, didAttemptEntireTree) {
      suspendedLanes &= ~workInProgressRootPingedLanes;
      suspendedLanes &= ~workInProgressRootInterleavedUpdatedLanes;
      root2.suspendedLanes |= suspendedLanes;
      root2.pingedLanes &= ~suspendedLanes;
      didAttemptEntireTree && (root2.warmLanes |= suspendedLanes);
      didAttemptEntireTree = root2.expirationTimes;
      for (var lanes = suspendedLanes; 0 < lanes; ) {
        var index$6 = 31 - clz32(lanes), lane = 1 << index$6;
        didAttemptEntireTree[index$6] = -1;
        lanes &= ~lane;
      }
      0 !== spawnedLane && markSpawnedDeferredLane(root2, spawnedLane, suspendedLanes);
    }
    function flushSyncWork$1() {
      return 0 === (executionContext & 6) ? (flushSyncWorkAcrossRoots_impl(0), false) : true;
    }
    function resetWorkInProgressStack() {
      if (null !== workInProgress) {
        if (0 === workInProgressSuspendedReason)
          var interruptedWork = workInProgress.return;
        else
          interruptedWork = workInProgress, lastContextDependency = currentlyRenderingFiber$1 = null, resetHooksOnUnwind(interruptedWork), thenableState$1 = null, thenableIndexCounter$1 = 0, interruptedWork = workInProgress;
        for (; null !== interruptedWork; )
          unwindInterruptedWork(interruptedWork.alternate, interruptedWork), interruptedWork = interruptedWork.return;
        workInProgress = null;
      }
    }
    function prepareFreshStack(root2, lanes) {
      var timeoutHandle = root2.timeoutHandle;
      -1 !== timeoutHandle && (root2.timeoutHandle = -1, cancelTimeout(timeoutHandle));
      timeoutHandle = root2.cancelPendingCommit;
      null !== timeoutHandle && (root2.cancelPendingCommit = null, timeoutHandle());
      pendingEffectsLanes = 0;
      resetWorkInProgressStack();
      workInProgressRoot = root2;
      workInProgress = timeoutHandle = createWorkInProgress(root2.current, null);
      workInProgressRootRenderLanes = lanes;
      workInProgressSuspendedReason = 0;
      workInProgressThrownValue = null;
      workInProgressRootDidSkipSuspendedSiblings = false;
      workInProgressRootIsPrerendering = checkIfRootIsPrerendering(root2, lanes);
      workInProgressRootDidAttachPingListener = false;
      workInProgressSuspendedRetryLanes = workInProgressDeferredLane = workInProgressRootPingedLanes = workInProgressRootInterleavedUpdatedLanes = workInProgressRootSkippedLanes = workInProgressRootExitStatus = 0;
      workInProgressRootRecoverableErrors = workInProgressRootConcurrentErrors = null;
      workInProgressRootDidIncludeRecursiveRenderUpdate = false;
      0 !== (lanes & 8) && (lanes |= lanes & 32);
      var allEntangledLanes = root2.entangledLanes;
      if (0 !== allEntangledLanes)
        for (root2 = root2.entanglements, allEntangledLanes &= lanes; 0 < allEntangledLanes; ) {
          var index$4 = 31 - clz32(allEntangledLanes), lane = 1 << index$4;
          lanes |= root2[index$4];
          allEntangledLanes &= ~lane;
        }
      entangledRenderLanes = lanes;
      finishQueueingConcurrentUpdates();
      return timeoutHandle;
    }
    function handleThrow(root2, thrownValue) {
      currentlyRenderingFiber = null;
      ReactSharedInternals.H = ContextOnlyDispatcher;
      thrownValue === SuspenseException || thrownValue === SuspenseActionException ? (thrownValue = getSuspendedThenable(), workInProgressSuspendedReason = 3) : thrownValue === SuspenseyCommitException ? (thrownValue = getSuspendedThenable(), workInProgressSuspendedReason = 4) : workInProgressSuspendedReason = thrownValue === SelectiveHydrationException ? 8 : null !== thrownValue && "object" === typeof thrownValue && "function" === typeof thrownValue.then ? 6 : 1;
      workInProgressThrownValue = thrownValue;
      null === workInProgress && (workInProgressRootExitStatus = 1, logUncaughtError(
        root2,
        createCapturedValueAtFiber(thrownValue, root2.current)
      ));
    }
    function shouldRemainOnPreviousScreen() {
      var handler = suspenseHandlerStackCursor.current;
      return null === handler ? true : (workInProgressRootRenderLanes & 4194048) === workInProgressRootRenderLanes ? null === shellBoundary ? true : false : (workInProgressRootRenderLanes & 62914560) === workInProgressRootRenderLanes || 0 !== (workInProgressRootRenderLanes & 536870912) ? handler === shellBoundary : false;
    }
    function pushDispatcher() {
      var prevDispatcher = ReactSharedInternals.H;
      ReactSharedInternals.H = ContextOnlyDispatcher;
      return null === prevDispatcher ? ContextOnlyDispatcher : prevDispatcher;
    }
    function pushAsyncDispatcher() {
      var prevAsyncDispatcher = ReactSharedInternals.A;
      ReactSharedInternals.A = DefaultAsyncDispatcher;
      return prevAsyncDispatcher;
    }
    function renderDidSuspendDelayIfPossible() {
      workInProgressRootExitStatus = 4;
      workInProgressRootDidSkipSuspendedSiblings || (workInProgressRootRenderLanes & 4194048) !== workInProgressRootRenderLanes && null !== suspenseHandlerStackCursor.current || (workInProgressRootIsPrerendering = true);
      0 === (workInProgressRootSkippedLanes & 134217727) && 0 === (workInProgressRootInterleavedUpdatedLanes & 134217727) || null === workInProgressRoot || markRootSuspended(
        workInProgressRoot,
        workInProgressRootRenderLanes,
        workInProgressDeferredLane,
        false
      );
    }
    function renderRootSync(root2, lanes, shouldYieldForPrerendering) {
      var prevExecutionContext = executionContext;
      executionContext |= 2;
      var prevDispatcher = pushDispatcher(), prevAsyncDispatcher = pushAsyncDispatcher();
      if (workInProgressRoot !== root2 || workInProgressRootRenderLanes !== lanes)
        workInProgressTransitions = null, prepareFreshStack(root2, lanes);
      lanes = false;
      var exitStatus = workInProgressRootExitStatus;
      a: do
        try {
          if (0 !== workInProgressSuspendedReason && null !== workInProgress) {
            var unitOfWork = workInProgress, thrownValue = workInProgressThrownValue;
            switch (workInProgressSuspendedReason) {
              case 8:
                resetWorkInProgressStack();
                exitStatus = 6;
                break a;
              case 3:
              case 2:
              case 9:
              case 6:
                null === suspenseHandlerStackCursor.current && (lanes = true);
                var reason = workInProgressSuspendedReason;
                workInProgressSuspendedReason = 0;
                workInProgressThrownValue = null;
                throwAndUnwindWorkLoop(root2, unitOfWork, thrownValue, reason);
                if (shouldYieldForPrerendering && workInProgressRootIsPrerendering) {
                  exitStatus = 0;
                  break a;
                }
                break;
              default:
                reason = workInProgressSuspendedReason, workInProgressSuspendedReason = 0, workInProgressThrownValue = null, throwAndUnwindWorkLoop(root2, unitOfWork, thrownValue, reason);
            }
          }
          workLoopSync();
          exitStatus = workInProgressRootExitStatus;
          break;
        } catch (thrownValue$165) {
          handleThrow(root2, thrownValue$165);
        }
      while (1);
      lanes && root2.shellSuspendCounter++;
      lastContextDependency = currentlyRenderingFiber$1 = null;
      executionContext = prevExecutionContext;
      ReactSharedInternals.H = prevDispatcher;
      ReactSharedInternals.A = prevAsyncDispatcher;
      null === workInProgress && (workInProgressRoot = null, workInProgressRootRenderLanes = 0, finishQueueingConcurrentUpdates());
      return exitStatus;
    }
    function workLoopSync() {
      for (; null !== workInProgress; ) performUnitOfWork(workInProgress);
    }
    function renderRootConcurrent(root2, lanes) {
      var prevExecutionContext = executionContext;
      executionContext |= 2;
      var prevDispatcher = pushDispatcher(), prevAsyncDispatcher = pushAsyncDispatcher();
      workInProgressRoot !== root2 || workInProgressRootRenderLanes !== lanes ? (workInProgressTransitions = null, workInProgressRootRenderTargetTime = now() + 500, prepareFreshStack(root2, lanes)) : workInProgressRootIsPrerendering = checkIfRootIsPrerendering(
        root2,
        lanes
      );
      a: do
        try {
          if (0 !== workInProgressSuspendedReason && null !== workInProgress) {
            lanes = workInProgress;
            var thrownValue = workInProgressThrownValue;
            b: switch (workInProgressSuspendedReason) {
              case 1:
                workInProgressSuspendedReason = 0;
                workInProgressThrownValue = null;
                throwAndUnwindWorkLoop(root2, lanes, thrownValue, 1);
                break;
              case 2:
              case 9:
                if (isThenableResolved(thrownValue)) {
                  workInProgressSuspendedReason = 0;
                  workInProgressThrownValue = null;
                  replaySuspendedUnitOfWork(lanes);
                  break;
                }
                lanes = function() {
                  2 !== workInProgressSuspendedReason && 9 !== workInProgressSuspendedReason || workInProgressRoot !== root2 || (workInProgressSuspendedReason = 7);
                  ensureRootIsScheduled(root2);
                };
                thrownValue.then(lanes, lanes);
                break a;
              case 3:
                workInProgressSuspendedReason = 7;
                break a;
              case 4:
                workInProgressSuspendedReason = 5;
                break a;
              case 7:
                isThenableResolved(thrownValue) ? (workInProgressSuspendedReason = 0, workInProgressThrownValue = null, replaySuspendedUnitOfWork(lanes)) : (workInProgressSuspendedReason = 0, workInProgressThrownValue = null, throwAndUnwindWorkLoop(root2, lanes, thrownValue, 7));
                break;
              case 5:
                var resource = null;
                switch (workInProgress.tag) {
                  case 26:
                    resource = workInProgress.memoizedState;
                  case 5:
                  case 27:
                    var hostFiber = workInProgress;
                    if (resource ? preloadResource(resource) : hostFiber.stateNode.complete) {
                      workInProgressSuspendedReason = 0;
                      workInProgressThrownValue = null;
                      var sibling = hostFiber.sibling;
                      if (null !== sibling) workInProgress = sibling;
                      else {
                        var returnFiber = hostFiber.return;
                        null !== returnFiber ? (workInProgress = returnFiber, completeUnitOfWork(returnFiber)) : workInProgress = null;
                      }
                      break b;
                    }
                }
                workInProgressSuspendedReason = 0;
                workInProgressThrownValue = null;
                throwAndUnwindWorkLoop(root2, lanes, thrownValue, 5);
                break;
              case 6:
                workInProgressSuspendedReason = 0;
                workInProgressThrownValue = null;
                throwAndUnwindWorkLoop(root2, lanes, thrownValue, 6);
                break;
              case 8:
                resetWorkInProgressStack();
                workInProgressRootExitStatus = 6;
                break a;
              default:
                throw Error(formatProdErrorMessage(462));
            }
          }
          workLoopConcurrentByScheduler();
          break;
        } catch (thrownValue$167) {
          handleThrow(root2, thrownValue$167);
        }
      while (1);
      lastContextDependency = currentlyRenderingFiber$1 = null;
      ReactSharedInternals.H = prevDispatcher;
      ReactSharedInternals.A = prevAsyncDispatcher;
      executionContext = prevExecutionContext;
      if (null !== workInProgress) return 0;
      workInProgressRoot = null;
      workInProgressRootRenderLanes = 0;
      finishQueueingConcurrentUpdates();
      return workInProgressRootExitStatus;
    }
    function workLoopConcurrentByScheduler() {
      for (; null !== workInProgress && !shouldYield(); )
        performUnitOfWork(workInProgress);
    }
    function performUnitOfWork(unitOfWork) {
      var next = beginWork(unitOfWork.alternate, unitOfWork, entangledRenderLanes);
      unitOfWork.memoizedProps = unitOfWork.pendingProps;
      null === next ? completeUnitOfWork(unitOfWork) : workInProgress = next;
    }
    function replaySuspendedUnitOfWork(unitOfWork) {
      var next = unitOfWork;
      var current = next.alternate;
      switch (next.tag) {
        case 15:
        case 0:
          next = replayFunctionComponent(
            current,
            next,
            next.pendingProps,
            next.type,
            void 0,
            workInProgressRootRenderLanes
          );
          break;
        case 11:
          next = replayFunctionComponent(
            current,
            next,
            next.pendingProps,
            next.type.render,
            next.ref,
            workInProgressRootRenderLanes
          );
          break;
        case 5:
          resetHooksOnUnwind(next);
        default:
          unwindInterruptedWork(current, next), next = workInProgress = resetWorkInProgress(next, entangledRenderLanes), next = beginWork(current, next, entangledRenderLanes);
      }
      unitOfWork.memoizedProps = unitOfWork.pendingProps;
      null === next ? completeUnitOfWork(unitOfWork) : workInProgress = next;
    }
    function throwAndUnwindWorkLoop(root2, unitOfWork, thrownValue, suspendedReason) {
      lastContextDependency = currentlyRenderingFiber$1 = null;
      resetHooksOnUnwind(unitOfWork);
      thenableState$1 = null;
      thenableIndexCounter$1 = 0;
      var returnFiber = unitOfWork.return;
      try {
        if (throwException(
          root2,
          returnFiber,
          unitOfWork,
          thrownValue,
          workInProgressRootRenderLanes
        )) {
          workInProgressRootExitStatus = 1;
          logUncaughtError(
            root2,
            createCapturedValueAtFiber(thrownValue, root2.current)
          );
          workInProgress = null;
          return;
        }
      } catch (error) {
        if (null !== returnFiber) throw workInProgress = returnFiber, error;
        workInProgressRootExitStatus = 1;
        logUncaughtError(
          root2,
          createCapturedValueAtFiber(thrownValue, root2.current)
        );
        workInProgress = null;
        return;
      }
      if (unitOfWork.flags & 32768) {
        if (isHydrating || 1 === suspendedReason) root2 = true;
        else if (workInProgressRootIsPrerendering || 0 !== (workInProgressRootRenderLanes & 536870912))
          root2 = false;
        else if (workInProgressRootDidSkipSuspendedSiblings = root2 = true, 2 === suspendedReason || 9 === suspendedReason || 3 === suspendedReason || 6 === suspendedReason)
          suspendedReason = suspenseHandlerStackCursor.current, null !== suspendedReason && 13 === suspendedReason.tag && (suspendedReason.flags |= 16384);
        unwindUnitOfWork(unitOfWork, root2);
      } else completeUnitOfWork(unitOfWork);
    }
    function completeUnitOfWork(unitOfWork) {
      var completedWork = unitOfWork;
      do {
        if (0 !== (completedWork.flags & 32768)) {
          unwindUnitOfWork(
            completedWork,
            workInProgressRootDidSkipSuspendedSiblings
          );
          return;
        }
        unitOfWork = completedWork.return;
        var next = completeWork(
          completedWork.alternate,
          completedWork,
          entangledRenderLanes
        );
        if (null !== next) {
          workInProgress = next;
          return;
        }
        completedWork = completedWork.sibling;
        if (null !== completedWork) {
          workInProgress = completedWork;
          return;
        }
        workInProgress = completedWork = unitOfWork;
      } while (null !== completedWork);
      0 === workInProgressRootExitStatus && (workInProgressRootExitStatus = 5);
    }
    function unwindUnitOfWork(unitOfWork, skipSiblings) {
      do {
        var next = unwindWork(unitOfWork.alternate, unitOfWork);
        if (null !== next) {
          next.flags &= 32767;
          workInProgress = next;
          return;
        }
        next = unitOfWork.return;
        null !== next && (next.flags |= 32768, next.subtreeFlags = 0, next.deletions = null);
        if (!skipSiblings && (unitOfWork = unitOfWork.sibling, null !== unitOfWork)) {
          workInProgress = unitOfWork;
          return;
        }
        workInProgress = unitOfWork = next;
      } while (null !== unitOfWork);
      workInProgressRootExitStatus = 6;
      workInProgress = null;
    }
    function commitRoot(root2, finishedWork, lanes, recoverableErrors, transitions, didIncludeRenderPhaseUpdate, spawnedLane, updatedLanes, suspendedRetryLanes) {
      root2.cancelPendingCommit = null;
      do
        flushPendingEffects();
      while (0 !== pendingEffectsStatus);
      if (0 !== (executionContext & 6)) throw Error(formatProdErrorMessage(327));
      if (null !== finishedWork) {
        if (finishedWork === root2.current) throw Error(formatProdErrorMessage(177));
        didIncludeRenderPhaseUpdate = finishedWork.lanes | finishedWork.childLanes;
        didIncludeRenderPhaseUpdate |= concurrentlyUpdatedLanes;
        markRootFinished(
          root2,
          lanes,
          didIncludeRenderPhaseUpdate,
          spawnedLane,
          updatedLanes,
          suspendedRetryLanes
        );
        root2 === workInProgressRoot && (workInProgress = workInProgressRoot = null, workInProgressRootRenderLanes = 0);
        pendingFinishedWork = finishedWork;
        pendingEffectsRoot = root2;
        pendingEffectsLanes = lanes;
        pendingEffectsRemainingLanes = didIncludeRenderPhaseUpdate;
        pendingPassiveTransitions = transitions;
        pendingRecoverableErrors = recoverableErrors;
        0 !== (finishedWork.subtreeFlags & 10256) || 0 !== (finishedWork.flags & 10256) ? (root2.callbackNode = null, root2.callbackPriority = 0, scheduleCallback$1(NormalPriority$1, function() {
          flushPassiveEffects();
          return null;
        })) : (root2.callbackNode = null, root2.callbackPriority = 0);
        recoverableErrors = 0 !== (finishedWork.flags & 13878);
        if (0 !== (finishedWork.subtreeFlags & 13878) || recoverableErrors) {
          recoverableErrors = ReactSharedInternals.T;
          ReactSharedInternals.T = null;
          transitions = ReactDOMSharedInternals.p;
          ReactDOMSharedInternals.p = 2;
          spawnedLane = executionContext;
          executionContext |= 4;
          try {
            commitBeforeMutationEffects(root2, finishedWork, lanes);
          } finally {
            executionContext = spawnedLane, ReactDOMSharedInternals.p = transitions, ReactSharedInternals.T = recoverableErrors;
          }
        }
        pendingEffectsStatus = 1;
        flushMutationEffects();
        flushLayoutEffects();
        flushSpawnedWork();
      }
    }
    function flushMutationEffects() {
      if (1 === pendingEffectsStatus) {
        pendingEffectsStatus = 0;
        var root2 = pendingEffectsRoot, finishedWork = pendingFinishedWork, rootMutationHasEffect = 0 !== (finishedWork.flags & 13878);
        if (0 !== (finishedWork.subtreeFlags & 13878) || rootMutationHasEffect) {
          rootMutationHasEffect = ReactSharedInternals.T;
          ReactSharedInternals.T = null;
          var previousPriority = ReactDOMSharedInternals.p;
          ReactDOMSharedInternals.p = 2;
          var prevExecutionContext = executionContext;
          executionContext |= 4;
          try {
            commitMutationEffectsOnFiber(finishedWork, root2);
            var priorSelectionInformation = selectionInformation, curFocusedElem = getActiveElementDeep(root2.containerInfo), priorFocusedElem = priorSelectionInformation.focusedElem, priorSelectionRange = priorSelectionInformation.selectionRange;
            if (curFocusedElem !== priorFocusedElem && priorFocusedElem && priorFocusedElem.ownerDocument && containsNode(
              priorFocusedElem.ownerDocument.documentElement,
              priorFocusedElem
            )) {
              if (null !== priorSelectionRange && hasSelectionCapabilities(priorFocusedElem)) {
                var start = priorSelectionRange.start, end = priorSelectionRange.end;
                void 0 === end && (end = start);
                if ("selectionStart" in priorFocusedElem)
                  priorFocusedElem.selectionStart = start, priorFocusedElem.selectionEnd = Math.min(
                    end,
                    priorFocusedElem.value.length
                  );
                else {
                  var doc = priorFocusedElem.ownerDocument || document, win = doc && doc.defaultView || window;
                  if (win.getSelection) {
                    var selection = win.getSelection(), length = priorFocusedElem.textContent.length, start$jscomp$0 = Math.min(priorSelectionRange.start, length), end$jscomp$0 = void 0 === priorSelectionRange.end ? start$jscomp$0 : Math.min(priorSelectionRange.end, length);
                    !selection.extend && start$jscomp$0 > end$jscomp$0 && (curFocusedElem = end$jscomp$0, end$jscomp$0 = start$jscomp$0, start$jscomp$0 = curFocusedElem);
                    var startMarker = getNodeForCharacterOffset(
                      priorFocusedElem,
                      start$jscomp$0
                    ), endMarker = getNodeForCharacterOffset(
                      priorFocusedElem,
                      end$jscomp$0
                    );
                    if (startMarker && endMarker && (1 !== selection.rangeCount || selection.anchorNode !== startMarker.node || selection.anchorOffset !== startMarker.offset || selection.focusNode !== endMarker.node || selection.focusOffset !== endMarker.offset)) {
                      var range = doc.createRange();
                      range.setStart(startMarker.node, startMarker.offset);
                      selection.removeAllRanges();
                      start$jscomp$0 > end$jscomp$0 ? (selection.addRange(range), selection.extend(endMarker.node, endMarker.offset)) : (range.setEnd(endMarker.node, endMarker.offset), selection.addRange(range));
                    }
                  }
                }
              }
              doc = [];
              for (selection = priorFocusedElem; selection = selection.parentNode; )
                1 === selection.nodeType && doc.push({
                  element: selection,
                  left: selection.scrollLeft,
                  top: selection.scrollTop
                });
              "function" === typeof priorFocusedElem.focus && priorFocusedElem.focus();
              for (priorFocusedElem = 0; priorFocusedElem < doc.length; priorFocusedElem++) {
                var info = doc[priorFocusedElem];
                info.element.scrollLeft = info.left;
                info.element.scrollTop = info.top;
              }
            }
            _enabled = !!eventsEnabled;
            selectionInformation = eventsEnabled = null;
          } finally {
            executionContext = prevExecutionContext, ReactDOMSharedInternals.p = previousPriority, ReactSharedInternals.T = rootMutationHasEffect;
          }
        }
        root2.current = finishedWork;
        pendingEffectsStatus = 2;
      }
    }
    function flushLayoutEffects() {
      if (2 === pendingEffectsStatus) {
        pendingEffectsStatus = 0;
        var root2 = pendingEffectsRoot, finishedWork = pendingFinishedWork, rootHasLayoutEffect = 0 !== (finishedWork.flags & 8772);
        if (0 !== (finishedWork.subtreeFlags & 8772) || rootHasLayoutEffect) {
          rootHasLayoutEffect = ReactSharedInternals.T;
          ReactSharedInternals.T = null;
          var previousPriority = ReactDOMSharedInternals.p;
          ReactDOMSharedInternals.p = 2;
          var prevExecutionContext = executionContext;
          executionContext |= 4;
          try {
            commitLayoutEffectOnFiber(root2, finishedWork.alternate, finishedWork);
          } finally {
            executionContext = prevExecutionContext, ReactDOMSharedInternals.p = previousPriority, ReactSharedInternals.T = rootHasLayoutEffect;
          }
        }
        pendingEffectsStatus = 3;
      }
    }
    function flushSpawnedWork() {
      if (4 === pendingEffectsStatus || 3 === pendingEffectsStatus) {
        pendingEffectsStatus = 0;
        requestPaint();
        var root2 = pendingEffectsRoot, finishedWork = pendingFinishedWork, lanes = pendingEffectsLanes, recoverableErrors = pendingRecoverableErrors;
        0 !== (finishedWork.subtreeFlags & 10256) || 0 !== (finishedWork.flags & 10256) ? pendingEffectsStatus = 5 : (pendingEffectsStatus = 0, pendingFinishedWork = pendingEffectsRoot = null, releaseRootPooledCache(root2, root2.pendingLanes));
        var remainingLanes = root2.pendingLanes;
        0 === remainingLanes && (legacyErrorBoundariesThatAlreadyFailed = null);
        lanesToEventPriority(lanes);
        finishedWork = finishedWork.stateNode;
        if (injectedHook && "function" === typeof injectedHook.onCommitFiberRoot)
          try {
            injectedHook.onCommitFiberRoot(
              rendererID,
              finishedWork,
              void 0,
              128 === (finishedWork.current.flags & 128)
            );
          } catch (err) {
          }
        if (null !== recoverableErrors) {
          finishedWork = ReactSharedInternals.T;
          remainingLanes = ReactDOMSharedInternals.p;
          ReactDOMSharedInternals.p = 2;
          ReactSharedInternals.T = null;
          try {
            for (var onRecoverableError = root2.onRecoverableError, i = 0; i < recoverableErrors.length; i++) {
              var recoverableError = recoverableErrors[i];
              onRecoverableError(recoverableError.value, {
                componentStack: recoverableError.stack
              });
            }
          } finally {
            ReactSharedInternals.T = finishedWork, ReactDOMSharedInternals.p = remainingLanes;
          }
        }
        0 !== (pendingEffectsLanes & 3) && flushPendingEffects();
        ensureRootIsScheduled(root2);
        remainingLanes = root2.pendingLanes;
        0 !== (lanes & 261930) && 0 !== (remainingLanes & 42) ? root2 === rootWithNestedUpdates ? nestedUpdateCount++ : (nestedUpdateCount = 0, rootWithNestedUpdates = root2) : nestedUpdateCount = 0;
        flushSyncWorkAcrossRoots_impl(0);
      }
    }
    function releaseRootPooledCache(root2, remainingLanes) {
      0 === (root2.pooledCacheLanes &= remainingLanes) && (remainingLanes = root2.pooledCache, null != remainingLanes && (root2.pooledCache = null, releaseCache(remainingLanes)));
    }
    function flushPendingEffects() {
      flushMutationEffects();
      flushLayoutEffects();
      flushSpawnedWork();
      return flushPassiveEffects();
    }
    function flushPassiveEffects() {
      if (5 !== pendingEffectsStatus) return false;
      var root2 = pendingEffectsRoot, remainingLanes = pendingEffectsRemainingLanes;
      pendingEffectsRemainingLanes = 0;
      var renderPriority = lanesToEventPriority(pendingEffectsLanes), prevTransition = ReactSharedInternals.T, previousPriority = ReactDOMSharedInternals.p;
      try {
        ReactDOMSharedInternals.p = 32 > renderPriority ? 32 : renderPriority;
        ReactSharedInternals.T = null;
        renderPriority = pendingPassiveTransitions;
        pendingPassiveTransitions = null;
        var root$jscomp$0 = pendingEffectsRoot, lanes = pendingEffectsLanes;
        pendingEffectsStatus = 0;
        pendingFinishedWork = pendingEffectsRoot = null;
        pendingEffectsLanes = 0;
        if (0 !== (executionContext & 6)) throw Error(formatProdErrorMessage(331));
        var prevExecutionContext = executionContext;
        executionContext |= 4;
        commitPassiveUnmountOnFiber(root$jscomp$0.current);
        commitPassiveMountOnFiber(
          root$jscomp$0,
          root$jscomp$0.current,
          lanes,
          renderPriority
        );
        executionContext = prevExecutionContext;
        flushSyncWorkAcrossRoots_impl(0, false);
        if (injectedHook && "function" === typeof injectedHook.onPostCommitFiberRoot)
          try {
            injectedHook.onPostCommitFiberRoot(rendererID, root$jscomp$0);
          } catch (err) {
          }
        return true;
      } finally {
        ReactDOMSharedInternals.p = previousPriority, ReactSharedInternals.T = prevTransition, releaseRootPooledCache(root2, remainingLanes);
      }
    }
    function captureCommitPhaseErrorOnRoot(rootFiber, sourceFiber, error) {
      sourceFiber = createCapturedValueAtFiber(error, sourceFiber);
      sourceFiber = createRootErrorUpdate(rootFiber.stateNode, sourceFiber, 2);
      rootFiber = enqueueUpdate(rootFiber, sourceFiber, 2);
      null !== rootFiber && (markRootUpdated$1(rootFiber, 2), ensureRootIsScheduled(rootFiber));
    }
    function captureCommitPhaseError(sourceFiber, nearestMountedAncestor, error) {
      if (3 === sourceFiber.tag)
        captureCommitPhaseErrorOnRoot(sourceFiber, sourceFiber, error);
      else
        for (; null !== nearestMountedAncestor; ) {
          if (3 === nearestMountedAncestor.tag) {
            captureCommitPhaseErrorOnRoot(
              nearestMountedAncestor,
              sourceFiber,
              error
            );
            break;
          } else if (1 === nearestMountedAncestor.tag) {
            var instance = nearestMountedAncestor.stateNode;
            if ("function" === typeof nearestMountedAncestor.type.getDerivedStateFromError || "function" === typeof instance.componentDidCatch && (null === legacyErrorBoundariesThatAlreadyFailed || !legacyErrorBoundariesThatAlreadyFailed.has(instance))) {
              sourceFiber = createCapturedValueAtFiber(error, sourceFiber);
              error = createClassErrorUpdate(2);
              instance = enqueueUpdate(nearestMountedAncestor, error, 2);
              null !== instance && (initializeClassErrorUpdate(
                error,
                instance,
                nearestMountedAncestor,
                sourceFiber
              ), markRootUpdated$1(instance, 2), ensureRootIsScheduled(instance));
              break;
            }
          }
          nearestMountedAncestor = nearestMountedAncestor.return;
        }
    }
    function attachPingListener(root2, wakeable, lanes) {
      var pingCache = root2.pingCache;
      if (null === pingCache) {
        pingCache = root2.pingCache = new PossiblyWeakMap();
        var threadIDs = new Set();
        pingCache.set(wakeable, threadIDs);
      } else
        threadIDs = pingCache.get(wakeable), void 0 === threadIDs && (threadIDs = new Set(), pingCache.set(wakeable, threadIDs));
      threadIDs.has(lanes) || (workInProgressRootDidAttachPingListener = true, threadIDs.add(lanes), root2 = pingSuspendedRoot.bind(null, root2, wakeable, lanes), wakeable.then(root2, root2));
    }
    function pingSuspendedRoot(root2, wakeable, pingedLanes) {
      var pingCache = root2.pingCache;
      null !== pingCache && pingCache.delete(wakeable);
      root2.pingedLanes |= root2.suspendedLanes & pingedLanes;
      root2.warmLanes &= ~pingedLanes;
      workInProgressRoot === root2 && (workInProgressRootRenderLanes & pingedLanes) === pingedLanes && (4 === workInProgressRootExitStatus || 3 === workInProgressRootExitStatus && (workInProgressRootRenderLanes & 62914560) === workInProgressRootRenderLanes && 300 > now() - globalMostRecentFallbackTime ? 0 === (executionContext & 2) && prepareFreshStack(root2, 0) : workInProgressRootPingedLanes |= pingedLanes, workInProgressSuspendedRetryLanes === workInProgressRootRenderLanes && (workInProgressSuspendedRetryLanes = 0));
      ensureRootIsScheduled(root2);
    }
    function retryTimedOutBoundary(boundaryFiber, retryLane) {
      0 === retryLane && (retryLane = claimNextRetryLane());
      boundaryFiber = enqueueConcurrentRenderForLane(boundaryFiber, retryLane);
      null !== boundaryFiber && (markRootUpdated$1(boundaryFiber, retryLane), ensureRootIsScheduled(boundaryFiber));
    }
    function retryDehydratedSuspenseBoundary(boundaryFiber) {
      var suspenseState = boundaryFiber.memoizedState, retryLane = 0;
      null !== suspenseState && (retryLane = suspenseState.retryLane);
      retryTimedOutBoundary(boundaryFiber, retryLane);
    }
    function resolveRetryWakeable(boundaryFiber, wakeable) {
      var retryLane = 0;
      switch (boundaryFiber.tag) {
        case 31:
        case 13:
          var retryCache = boundaryFiber.stateNode;
          var suspenseState = boundaryFiber.memoizedState;
          null !== suspenseState && (retryLane = suspenseState.retryLane);
          break;
        case 19:
          retryCache = boundaryFiber.stateNode;
          break;
        case 22:
          retryCache = boundaryFiber.stateNode._retryCache;
          break;
        default:
          throw Error(formatProdErrorMessage(314));
      }
      null !== retryCache && retryCache.delete(wakeable);
      retryTimedOutBoundary(boundaryFiber, retryLane);
    }
    function scheduleCallback$1(priorityLevel, callback) {
      return scheduleCallback$3(priorityLevel, callback);
    }
    var firstScheduledRoot = null, lastScheduledRoot = null, didScheduleMicrotask = false, mightHavePendingSyncWork = false, isFlushingWork = false, currentEventTransitionLane = 0;
    function ensureRootIsScheduled(root2) {
      root2 !== lastScheduledRoot && null === root2.next && (null === lastScheduledRoot ? firstScheduledRoot = lastScheduledRoot = root2 : lastScheduledRoot = lastScheduledRoot.next = root2);
      mightHavePendingSyncWork = true;
      didScheduleMicrotask || (didScheduleMicrotask = true, scheduleImmediateRootScheduleTask());
    }
    function flushSyncWorkAcrossRoots_impl(syncTransitionLanes, onlyLegacy) {
      if (!isFlushingWork && mightHavePendingSyncWork) {
        isFlushingWork = true;
        do {
          var didPerformSomeWork = false;
          for (var root$170 = firstScheduledRoot; null !== root$170; ) {
            if (0 !== syncTransitionLanes) {
              var pendingLanes = root$170.pendingLanes;
              if (0 === pendingLanes) var JSCompiler_inline_result = 0;
              else {
                var suspendedLanes = root$170.suspendedLanes, pingedLanes = root$170.pingedLanes;
                JSCompiler_inline_result = (1 << 31 - clz32(42 | syncTransitionLanes) + 1) - 1;
                JSCompiler_inline_result &= pendingLanes & ~(suspendedLanes & ~pingedLanes);
                JSCompiler_inline_result = JSCompiler_inline_result & 201326741 ? JSCompiler_inline_result & 201326741 | 1 : JSCompiler_inline_result ? JSCompiler_inline_result | 2 : 0;
              }
              0 !== JSCompiler_inline_result && (didPerformSomeWork = true, performSyncWorkOnRoot(root$170, JSCompiler_inline_result));
            } else
              JSCompiler_inline_result = workInProgressRootRenderLanes, JSCompiler_inline_result = getNextLanes(
                root$170,
                root$170 === workInProgressRoot ? JSCompiler_inline_result : 0,
                null !== root$170.cancelPendingCommit || -1 !== root$170.timeoutHandle
              ), 0 === (JSCompiler_inline_result & 3) || checkIfRootIsPrerendering(root$170, JSCompiler_inline_result) || (didPerformSomeWork = true, performSyncWorkOnRoot(root$170, JSCompiler_inline_result));
            root$170 = root$170.next;
          }
        } while (didPerformSomeWork);
        isFlushingWork = false;
      }
    }
    function processRootScheduleInImmediateTask() {
      processRootScheduleInMicrotask();
    }
    function processRootScheduleInMicrotask() {
      mightHavePendingSyncWork = didScheduleMicrotask = false;
      var syncTransitionLanes = 0;
      0 !== currentEventTransitionLane && shouldAttemptEagerTransition() && (syncTransitionLanes = currentEventTransitionLane);
      for (var currentTime = now(), prev = null, root2 = firstScheduledRoot; null !== root2; ) {
        var next = root2.next, nextLanes = scheduleTaskForRootDuringMicrotask(root2, currentTime);
        if (0 === nextLanes)
          root2.next = null, null === prev ? firstScheduledRoot = next : prev.next = next, null === next && (lastScheduledRoot = prev);
        else if (prev = root2, 0 !== syncTransitionLanes || 0 !== (nextLanes & 3))
          mightHavePendingSyncWork = true;
        root2 = next;
      }
      0 !== pendingEffectsStatus && 5 !== pendingEffectsStatus || flushSyncWorkAcrossRoots_impl(syncTransitionLanes);
      0 !== currentEventTransitionLane && (currentEventTransitionLane = 0);
    }
    function scheduleTaskForRootDuringMicrotask(root2, currentTime) {
      for (var suspendedLanes = root2.suspendedLanes, pingedLanes = root2.pingedLanes, expirationTimes = root2.expirationTimes, lanes = root2.pendingLanes & -62914561; 0 < lanes; ) {
        var index$5 = 31 - clz32(lanes), lane = 1 << index$5, expirationTime = expirationTimes[index$5];
        if (-1 === expirationTime) {
          if (0 === (lane & suspendedLanes) || 0 !== (lane & pingedLanes))
            expirationTimes[index$5] = computeExpirationTime(lane, currentTime);
        } else expirationTime <= currentTime && (root2.expiredLanes |= lane);
        lanes &= ~lane;
      }
      currentTime = workInProgressRoot;
      suspendedLanes = workInProgressRootRenderLanes;
      suspendedLanes = getNextLanes(
        root2,
        root2 === currentTime ? suspendedLanes : 0,
        null !== root2.cancelPendingCommit || -1 !== root2.timeoutHandle
      );
      pingedLanes = root2.callbackNode;
      if (0 === suspendedLanes || root2 === currentTime && (2 === workInProgressSuspendedReason || 9 === workInProgressSuspendedReason) || null !== root2.cancelPendingCommit)
        return null !== pingedLanes && null !== pingedLanes && cancelCallback$1(pingedLanes), root2.callbackNode = null, root2.callbackPriority = 0;
      if (0 === (suspendedLanes & 3) || checkIfRootIsPrerendering(root2, suspendedLanes)) {
        currentTime = suspendedLanes & -suspendedLanes;
        if (currentTime === root2.callbackPriority) return currentTime;
        null !== pingedLanes && cancelCallback$1(pingedLanes);
        switch (lanesToEventPriority(suspendedLanes)) {
          case 2:
          case 8:
            suspendedLanes = UserBlockingPriority;
            break;
          case 32:
            suspendedLanes = NormalPriority$1;
            break;
          case 268435456:
            suspendedLanes = IdlePriority;
            break;
          default:
            suspendedLanes = NormalPriority$1;
        }
        pingedLanes = performWorkOnRootViaSchedulerTask.bind(null, root2);
        suspendedLanes = scheduleCallback$3(suspendedLanes, pingedLanes);
        root2.callbackPriority = currentTime;
        root2.callbackNode = suspendedLanes;
        return currentTime;
      }
      null !== pingedLanes && null !== pingedLanes && cancelCallback$1(pingedLanes);
      root2.callbackPriority = 2;
      root2.callbackNode = null;
      return 2;
    }
    function performWorkOnRootViaSchedulerTask(root2, didTimeout) {
      if (0 !== pendingEffectsStatus && 5 !== pendingEffectsStatus)
        return root2.callbackNode = null, root2.callbackPriority = 0, null;
      var originalCallbackNode = root2.callbackNode;
      if (flushPendingEffects() && root2.callbackNode !== originalCallbackNode)
        return null;
      var workInProgressRootRenderLanes$jscomp$0 = workInProgressRootRenderLanes;
      workInProgressRootRenderLanes$jscomp$0 = getNextLanes(
        root2,
        root2 === workInProgressRoot ? workInProgressRootRenderLanes$jscomp$0 : 0,
        null !== root2.cancelPendingCommit || -1 !== root2.timeoutHandle
      );
      if (0 === workInProgressRootRenderLanes$jscomp$0) return null;
      performWorkOnRoot(root2, workInProgressRootRenderLanes$jscomp$0, didTimeout);
      scheduleTaskForRootDuringMicrotask(root2, now());
      return null != root2.callbackNode && root2.callbackNode === originalCallbackNode ? performWorkOnRootViaSchedulerTask.bind(null, root2) : null;
    }
    function performSyncWorkOnRoot(root2, lanes) {
      if (flushPendingEffects()) return null;
      performWorkOnRoot(root2, lanes, true);
    }
    function scheduleImmediateRootScheduleTask() {
      scheduleMicrotask(function() {
        0 !== (executionContext & 6) ? scheduleCallback$3(
          ImmediatePriority,
          processRootScheduleInImmediateTask
        ) : processRootScheduleInMicrotask();
      });
    }
    function requestTransitionLane() {
      if (0 === currentEventTransitionLane) {
        var actionScopeLane = currentEntangledLane;
        0 === actionScopeLane && (actionScopeLane = nextTransitionUpdateLane, nextTransitionUpdateLane <<= 1, 0 === (nextTransitionUpdateLane & 261888) && (nextTransitionUpdateLane = 256));
        currentEventTransitionLane = actionScopeLane;
      }
      return currentEventTransitionLane;
    }
    function coerceFormActionProp(actionProp) {
      return null == actionProp || "symbol" === typeof actionProp || "boolean" === typeof actionProp ? null : "function" === typeof actionProp ? actionProp : sanitizeURL("" + actionProp);
    }
    function createFormDataWithSubmitter(form, submitter) {
      var temp = submitter.ownerDocument.createElement("input");
      temp.name = submitter.name;
      temp.value = submitter.value;
      form.id && temp.setAttribute("form", form.id);
      submitter.parentNode.insertBefore(temp, submitter);
      form = new FormData(form);
      temp.parentNode.removeChild(temp);
      return form;
    }
    function extractEvents$1(dispatchQueue, domEventName, maybeTargetInst, nativeEvent, nativeEventTarget) {
      if ("submit" === domEventName && maybeTargetInst && maybeTargetInst.stateNode === nativeEventTarget) {
        var action = coerceFormActionProp(
          (nativeEventTarget[internalPropsKey] || null).action
        ), submitter = nativeEvent.submitter;
        submitter && (domEventName = (domEventName = submitter[internalPropsKey] || null) ? coerceFormActionProp(domEventName.formAction) : submitter.getAttribute("formAction"), null !== domEventName && (action = domEventName, submitter = null));
        var event = new SyntheticEvent(
          "action",
          "action",
          null,
          nativeEvent,
          nativeEventTarget
        );
        dispatchQueue.push({
          event,
          listeners: [
            {
              instance: null,
              listener: function() {
                if (nativeEvent.defaultPrevented) {
                  if (0 !== currentEventTransitionLane) {
                    var formData = submitter ? createFormDataWithSubmitter(nativeEventTarget, submitter) : new FormData(nativeEventTarget);
                    startHostTransition(
                      maybeTargetInst,
                      {
                        pending: true,
                        data: formData,
                        method: nativeEventTarget.method,
                        action
                      },
                      null,
                      formData
                    );
                  }
                } else
                  "function" === typeof action && (event.preventDefault(), formData = submitter ? createFormDataWithSubmitter(nativeEventTarget, submitter) : new FormData(nativeEventTarget), startHostTransition(
                    maybeTargetInst,
                    {
                      pending: true,
                      data: formData,
                      method: nativeEventTarget.method,
                      action
                    },
                    action,
                    formData
                  ));
              },
              currentTarget: nativeEventTarget
            }
          ]
        });
      }
    }
    for (var i$jscomp$inline_1577 = 0; i$jscomp$inline_1577 < simpleEventPluginEvents.length; i$jscomp$inline_1577++) {
      var eventName$jscomp$inline_1578 = simpleEventPluginEvents[i$jscomp$inline_1577], domEventName$jscomp$inline_1579 = eventName$jscomp$inline_1578.toLowerCase(), capitalizedEvent$jscomp$inline_1580 = eventName$jscomp$inline_1578[0].toUpperCase() + eventName$jscomp$inline_1578.slice(1);
      registerSimpleEvent(
        domEventName$jscomp$inline_1579,
        "on" + capitalizedEvent$jscomp$inline_1580
      );
    }
    registerSimpleEvent(ANIMATION_END, "onAnimationEnd");
    registerSimpleEvent(ANIMATION_ITERATION, "onAnimationIteration");
    registerSimpleEvent(ANIMATION_START, "onAnimationStart");
    registerSimpleEvent("dblclick", "onDoubleClick");
    registerSimpleEvent("focusin", "onFocus");
    registerSimpleEvent("focusout", "onBlur");
    registerSimpleEvent(TRANSITION_RUN, "onTransitionRun");
    registerSimpleEvent(TRANSITION_START, "onTransitionStart");
    registerSimpleEvent(TRANSITION_CANCEL, "onTransitionCancel");
    registerSimpleEvent(TRANSITION_END, "onTransitionEnd");
    registerDirectEvent("onMouseEnter", ["mouseout", "mouseover"]);
    registerDirectEvent("onMouseLeave", ["mouseout", "mouseover"]);
    registerDirectEvent("onPointerEnter", ["pointerout", "pointerover"]);
    registerDirectEvent("onPointerLeave", ["pointerout", "pointerover"]);
    registerTwoPhaseEvent(
      "onChange",
      "change click focusin focusout input keydown keyup selectionchange".split(" ")
    );
    registerTwoPhaseEvent(
      "onSelect",
      "focusout contextmenu dragend focusin keydown keyup mousedown mouseup selectionchange".split(
        " "
      )
    );
    registerTwoPhaseEvent("onBeforeInput", [
      "compositionend",
      "keypress",
      "textInput",
      "paste"
    ]);
    registerTwoPhaseEvent(
      "onCompositionEnd",
      "compositionend focusout keydown keypress keyup mousedown".split(" ")
    );
    registerTwoPhaseEvent(
      "onCompositionStart",
      "compositionstart focusout keydown keypress keyup mousedown".split(" ")
    );
    registerTwoPhaseEvent(
      "onCompositionUpdate",
      "compositionupdate focusout keydown keypress keyup mousedown".split(" ")
    );
    var mediaEventTypes = "abort canplay canplaythrough durationchange emptied encrypted ended error loadeddata loadedmetadata loadstart pause play playing progress ratechange resize seeked seeking stalled suspend timeupdate volumechange waiting".split(
      " "
    ), nonDelegatedEvents = new Set(
      "beforetoggle cancel close invalid load scroll scrollend toggle".split(" ").concat(mediaEventTypes)
    );
    function processDispatchQueue(dispatchQueue, eventSystemFlags) {
      eventSystemFlags = 0 !== (eventSystemFlags & 4);
      for (var i = 0; i < dispatchQueue.length; i++) {
        var _dispatchQueue$i = dispatchQueue[i], event = _dispatchQueue$i.event;
        _dispatchQueue$i = _dispatchQueue$i.listeners;
        a: {
          var previousInstance = void 0;
          if (eventSystemFlags)
            for (var i$jscomp$0 = _dispatchQueue$i.length - 1; 0 <= i$jscomp$0; i$jscomp$0--) {
              var _dispatchListeners$i = _dispatchQueue$i[i$jscomp$0], instance = _dispatchListeners$i.instance, currentTarget = _dispatchListeners$i.currentTarget;
              _dispatchListeners$i = _dispatchListeners$i.listener;
              if (instance !== previousInstance && event.isPropagationStopped())
                break a;
              previousInstance = _dispatchListeners$i;
              event.currentTarget = currentTarget;
              try {
                previousInstance(event);
              } catch (error) {
                reportGlobalError(error);
              }
              event.currentTarget = null;
              previousInstance = instance;
            }
          else
            for (i$jscomp$0 = 0; i$jscomp$0 < _dispatchQueue$i.length; i$jscomp$0++) {
              _dispatchListeners$i = _dispatchQueue$i[i$jscomp$0];
              instance = _dispatchListeners$i.instance;
              currentTarget = _dispatchListeners$i.currentTarget;
              _dispatchListeners$i = _dispatchListeners$i.listener;
              if (instance !== previousInstance && event.isPropagationStopped())
                break a;
              previousInstance = _dispatchListeners$i;
              event.currentTarget = currentTarget;
              try {
                previousInstance(event);
              } catch (error) {
                reportGlobalError(error);
              }
              event.currentTarget = null;
              previousInstance = instance;
            }
        }
      }
    }
    function listenToNonDelegatedEvent(domEventName, targetElement) {
      var JSCompiler_inline_result = targetElement[internalEventHandlersKey];
      void 0 === JSCompiler_inline_result && (JSCompiler_inline_result = targetElement[internalEventHandlersKey] = new Set());
      var listenerSetKey = domEventName + "__bubble";
      JSCompiler_inline_result.has(listenerSetKey) || (addTrappedEventListener(targetElement, domEventName, 2, false), JSCompiler_inline_result.add(listenerSetKey));
    }
    function listenToNativeEvent(domEventName, isCapturePhaseListener, target) {
      var eventSystemFlags = 0;
      isCapturePhaseListener && (eventSystemFlags |= 4);
      addTrappedEventListener(
        target,
        domEventName,
        eventSystemFlags,
        isCapturePhaseListener
      );
    }
    var listeningMarker = "_reactListening" + Math.random().toString(36).slice(2);
    function listenToAllSupportedEvents(rootContainerElement) {
      if (!rootContainerElement[listeningMarker]) {
        rootContainerElement[listeningMarker] = true;
        allNativeEvents.forEach(function(domEventName) {
          "selectionchange" !== domEventName && (nonDelegatedEvents.has(domEventName) || listenToNativeEvent(domEventName, false, rootContainerElement), listenToNativeEvent(domEventName, true, rootContainerElement));
        });
        var ownerDocument = 9 === rootContainerElement.nodeType ? rootContainerElement : rootContainerElement.ownerDocument;
        null === ownerDocument || ownerDocument[listeningMarker] || (ownerDocument[listeningMarker] = true, listenToNativeEvent("selectionchange", false, ownerDocument));
      }
    }
    function addTrappedEventListener(targetContainer, domEventName, eventSystemFlags, isCapturePhaseListener) {
      switch (getEventPriority(domEventName)) {
        case 2:
          var listenerWrapper = dispatchDiscreteEvent;
          break;
        case 8:
          listenerWrapper = dispatchContinuousEvent;
          break;
        default:
          listenerWrapper = dispatchEvent2;
      }
      eventSystemFlags = listenerWrapper.bind(
        null,
        domEventName,
        eventSystemFlags,
        targetContainer
      );
      listenerWrapper = void 0;
      !passiveBrowserEventsSupported || "touchstart" !== domEventName && "touchmove" !== domEventName && "wheel" !== domEventName || (listenerWrapper = true);
      isCapturePhaseListener ? void 0 !== listenerWrapper ? targetContainer.addEventListener(domEventName, eventSystemFlags, {
        capture: true,
        passive: listenerWrapper
      }) : targetContainer.addEventListener(domEventName, eventSystemFlags, true) : void 0 !== listenerWrapper ? targetContainer.addEventListener(domEventName, eventSystemFlags, {
        passive: listenerWrapper
      }) : targetContainer.addEventListener(domEventName, eventSystemFlags, false);
    }
    function dispatchEventForPluginEventSystem(domEventName, eventSystemFlags, nativeEvent, targetInst$jscomp$0, targetContainer) {
      var ancestorInst = targetInst$jscomp$0;
      if (0 === (eventSystemFlags & 1) && 0 === (eventSystemFlags & 2) && null !== targetInst$jscomp$0)
        a: for (; ; ) {
          if (null === targetInst$jscomp$0) return;
          var nodeTag = targetInst$jscomp$0.tag;
          if (3 === nodeTag || 4 === nodeTag) {
            var container = targetInst$jscomp$0.stateNode.containerInfo;
            if (container === targetContainer) break;
            if (4 === nodeTag)
              for (nodeTag = targetInst$jscomp$0.return; null !== nodeTag; ) {
                var grandTag = nodeTag.tag;
                if ((3 === grandTag || 4 === grandTag) && nodeTag.stateNode.containerInfo === targetContainer)
                  return;
                nodeTag = nodeTag.return;
              }
            for (; null !== container; ) {
              nodeTag = getClosestInstanceFromNode(container);
              if (null === nodeTag) return;
              grandTag = nodeTag.tag;
              if (5 === grandTag || 6 === grandTag || 26 === grandTag || 27 === grandTag) {
                targetInst$jscomp$0 = ancestorInst = nodeTag;
                continue a;
              }
              container = container.parentNode;
            }
          }
          targetInst$jscomp$0 = targetInst$jscomp$0.return;
        }
      batchedUpdates$1(function() {
        var targetInst = ancestorInst, nativeEventTarget = getEventTarget(nativeEvent), dispatchQueue = [];
        a: {
          var reactName = topLevelEventsToReactNames.get(domEventName);
          if (void 0 !== reactName) {
            var SyntheticEventCtor = SyntheticEvent, reactEventType = domEventName;
            switch (domEventName) {
              case "keypress":
                if (0 === getEventCharCode(nativeEvent)) break a;
              case "keydown":
              case "keyup":
                SyntheticEventCtor = SyntheticKeyboardEvent;
                break;
              case "focusin":
                reactEventType = "focus";
                SyntheticEventCtor = SyntheticFocusEvent;
                break;
              case "focusout":
                reactEventType = "blur";
                SyntheticEventCtor = SyntheticFocusEvent;
                break;
              case "beforeblur":
              case "afterblur":
                SyntheticEventCtor = SyntheticFocusEvent;
                break;
              case "click":
                if (2 === nativeEvent.button) break a;
              case "auxclick":
              case "dblclick":
              case "mousedown":
              case "mousemove":
              case "mouseup":
              case "mouseout":
              case "mouseover":
              case "contextmenu":
                SyntheticEventCtor = SyntheticMouseEvent;
                break;
              case "drag":
              case "dragend":
              case "dragenter":
              case "dragexit":
              case "dragleave":
              case "dragover":
              case "dragstart":
              case "drop":
                SyntheticEventCtor = SyntheticDragEvent;
                break;
              case "touchcancel":
              case "touchend":
              case "touchmove":
              case "touchstart":
                SyntheticEventCtor = SyntheticTouchEvent;
                break;
              case ANIMATION_END:
              case ANIMATION_ITERATION:
              case ANIMATION_START:
                SyntheticEventCtor = SyntheticAnimationEvent;
                break;
              case TRANSITION_END:
                SyntheticEventCtor = SyntheticTransitionEvent;
                break;
              case "scroll":
              case "scrollend":
                SyntheticEventCtor = SyntheticUIEvent;
                break;
              case "wheel":
                SyntheticEventCtor = SyntheticWheelEvent;
                break;
              case "copy":
              case "cut":
              case "paste":
                SyntheticEventCtor = SyntheticClipboardEvent;
                break;
              case "gotpointercapture":
              case "lostpointercapture":
              case "pointercancel":
              case "pointerdown":
              case "pointermove":
              case "pointerout":
              case "pointerover":
              case "pointerup":
                SyntheticEventCtor = SyntheticPointerEvent;
                break;
              case "toggle":
              case "beforetoggle":
                SyntheticEventCtor = SyntheticToggleEvent;
            }
            var inCapturePhase = 0 !== (eventSystemFlags & 4), accumulateTargetOnly = !inCapturePhase && ("scroll" === domEventName || "scrollend" === domEventName), reactEventName = inCapturePhase ? null !== reactName ? reactName + "Capture" : null : reactName;
            inCapturePhase = [];
            for (var instance = targetInst, lastHostComponent; null !== instance; ) {
              var _instance = instance;
              lastHostComponent = _instance.stateNode;
              _instance = _instance.tag;
              5 !== _instance && 26 !== _instance && 27 !== _instance || null === lastHostComponent || null === reactEventName || (_instance = getListener(instance, reactEventName), null != _instance && inCapturePhase.push(
                createDispatchListener(instance, _instance, lastHostComponent)
              ));
              if (accumulateTargetOnly) break;
              instance = instance.return;
            }
            0 < inCapturePhase.length && (reactName = new SyntheticEventCtor(
              reactName,
              reactEventType,
              null,
              nativeEvent,
              nativeEventTarget
            ), dispatchQueue.push({ event: reactName, listeners: inCapturePhase }));
          }
        }
        if (0 === (eventSystemFlags & 7)) {
          a: {
            reactName = "mouseover" === domEventName || "pointerover" === domEventName;
            SyntheticEventCtor = "mouseout" === domEventName || "pointerout" === domEventName;
            if (reactName && nativeEvent !== currentReplayingEvent && (reactEventType = nativeEvent.relatedTarget || nativeEvent.fromElement) && (getClosestInstanceFromNode(reactEventType) || reactEventType[internalContainerInstanceKey]))
              break a;
            if (SyntheticEventCtor || reactName) {
              reactName = nativeEventTarget.window === nativeEventTarget ? nativeEventTarget : (reactName = nativeEventTarget.ownerDocument) ? reactName.defaultView || reactName.parentWindow : window;
              if (SyntheticEventCtor) {
                if (reactEventType = nativeEvent.relatedTarget || nativeEvent.toElement, SyntheticEventCtor = targetInst, reactEventType = reactEventType ? getClosestInstanceFromNode(reactEventType) : null, null !== reactEventType && (accumulateTargetOnly = getNearestMountedFiber(reactEventType), inCapturePhase = reactEventType.tag, reactEventType !== accumulateTargetOnly || 5 !== inCapturePhase && 27 !== inCapturePhase && 6 !== inCapturePhase))
                  reactEventType = null;
              } else SyntheticEventCtor = null, reactEventType = targetInst;
              if (SyntheticEventCtor !== reactEventType) {
                inCapturePhase = SyntheticMouseEvent;
                _instance = "onMouseLeave";
                reactEventName = "onMouseEnter";
                instance = "mouse";
                if ("pointerout" === domEventName || "pointerover" === domEventName)
                  inCapturePhase = SyntheticPointerEvent, _instance = "onPointerLeave", reactEventName = "onPointerEnter", instance = "pointer";
                accumulateTargetOnly = null == SyntheticEventCtor ? reactName : getNodeFromInstance(SyntheticEventCtor);
                lastHostComponent = null == reactEventType ? reactName : getNodeFromInstance(reactEventType);
                reactName = new inCapturePhase(
                  _instance,
                  instance + "leave",
                  SyntheticEventCtor,
                  nativeEvent,
                  nativeEventTarget
                );
                reactName.target = accumulateTargetOnly;
                reactName.relatedTarget = lastHostComponent;
                _instance = null;
                getClosestInstanceFromNode(nativeEventTarget) === targetInst && (inCapturePhase = new inCapturePhase(
                  reactEventName,
                  instance + "enter",
                  reactEventType,
                  nativeEvent,
                  nativeEventTarget
                ), inCapturePhase.target = lastHostComponent, inCapturePhase.relatedTarget = accumulateTargetOnly, _instance = inCapturePhase);
                accumulateTargetOnly = _instance;
                if (SyntheticEventCtor && reactEventType)
                  b: {
                    inCapturePhase = getParent;
                    reactEventName = SyntheticEventCtor;
                    instance = reactEventType;
                    lastHostComponent = 0;
                    for (_instance = reactEventName; _instance; _instance = inCapturePhase(_instance))
                      lastHostComponent++;
                    _instance = 0;
                    for (var tempB = instance; tempB; tempB = inCapturePhase(tempB))
                      _instance++;
                    for (; 0 < lastHostComponent - _instance; )
                      reactEventName = inCapturePhase(reactEventName), lastHostComponent--;
                    for (; 0 < _instance - lastHostComponent; )
                      instance = inCapturePhase(instance), _instance--;
                    for (; lastHostComponent--; ) {
                      if (reactEventName === instance || null !== instance && reactEventName === instance.alternate) {
                        inCapturePhase = reactEventName;
                        break b;
                      }
                      reactEventName = inCapturePhase(reactEventName);
                      instance = inCapturePhase(instance);
                    }
                    inCapturePhase = null;
                  }
                else inCapturePhase = null;
                null !== SyntheticEventCtor && accumulateEnterLeaveListenersForEvent(
                  dispatchQueue,
                  reactName,
                  SyntheticEventCtor,
                  inCapturePhase,
                  false
                );
                null !== reactEventType && null !== accumulateTargetOnly && accumulateEnterLeaveListenersForEvent(
                  dispatchQueue,
                  accumulateTargetOnly,
                  reactEventType,
                  inCapturePhase,
                  true
                );
              }
            }
          }
          a: {
            reactName = targetInst ? getNodeFromInstance(targetInst) : window;
            SyntheticEventCtor = reactName.nodeName && reactName.nodeName.toLowerCase();
            if ("select" === SyntheticEventCtor || "input" === SyntheticEventCtor && "file" === reactName.type)
              var getTargetInstFunc = getTargetInstForChangeEvent;
            else if (isTextInputElement(reactName))
              if (isInputEventSupported)
                getTargetInstFunc = getTargetInstForInputOrChangeEvent;
              else {
                getTargetInstFunc = getTargetInstForInputEventPolyfill;
                var handleEventFunc = handleEventsForInputEventPolyfill;
              }
            else
              SyntheticEventCtor = reactName.nodeName, !SyntheticEventCtor || "input" !== SyntheticEventCtor.toLowerCase() || "checkbox" !== reactName.type && "radio" !== reactName.type ? targetInst && isCustomElement(targetInst.elementType) && (getTargetInstFunc = getTargetInstForChangeEvent) : getTargetInstFunc = getTargetInstForClickEvent;
            if (getTargetInstFunc && (getTargetInstFunc = getTargetInstFunc(domEventName, targetInst))) {
              createAndAccumulateChangeEvent(
                dispatchQueue,
                getTargetInstFunc,
                nativeEvent,
                nativeEventTarget
              );
              break a;
            }
            handleEventFunc && handleEventFunc(domEventName, reactName, targetInst);
            "focusout" === domEventName && targetInst && "number" === reactName.type && null != targetInst.memoizedProps.value && setDefaultValue(reactName, "number", reactName.value);
          }
          handleEventFunc = targetInst ? getNodeFromInstance(targetInst) : window;
          switch (domEventName) {
            case "focusin":
              if (isTextInputElement(handleEventFunc) || "true" === handleEventFunc.contentEditable)
                activeElement = handleEventFunc, activeElementInst = targetInst, lastSelection = null;
              break;
            case "focusout":
              lastSelection = activeElementInst = activeElement = null;
              break;
            case "mousedown":
              mouseDown = true;
              break;
            case "contextmenu":
            case "mouseup":
            case "dragend":
              mouseDown = false;
              constructSelectEvent(dispatchQueue, nativeEvent, nativeEventTarget);
              break;
            case "selectionchange":
              if (skipSelectionChangeEvent) break;
            case "keydown":
            case "keyup":
              constructSelectEvent(dispatchQueue, nativeEvent, nativeEventTarget);
          }
          var fallbackData;
          if (canUseCompositionEvent)
            b: {
              switch (domEventName) {
                case "compositionstart":
                  var eventType = "onCompositionStart";
                  break b;
                case "compositionend":
                  eventType = "onCompositionEnd";
                  break b;
                case "compositionupdate":
                  eventType = "onCompositionUpdate";
                  break b;
              }
              eventType = void 0;
            }
          else
            isComposing ? isFallbackCompositionEnd(domEventName, nativeEvent) && (eventType = "onCompositionEnd") : "keydown" === domEventName && 229 === nativeEvent.keyCode && (eventType = "onCompositionStart");
          eventType && (useFallbackCompositionData && "ko" !== nativeEvent.locale && (isComposing || "onCompositionStart" !== eventType ? "onCompositionEnd" === eventType && isComposing && (fallbackData = getData()) : (root = nativeEventTarget, startText = "value" in root ? root.value : root.textContent, isComposing = true)), handleEventFunc = accumulateTwoPhaseListeners(targetInst, eventType), 0 < handleEventFunc.length && (eventType = new SyntheticCompositionEvent(
            eventType,
            domEventName,
            null,
            nativeEvent,
            nativeEventTarget
          ), dispatchQueue.push({ event: eventType, listeners: handleEventFunc }), fallbackData ? eventType.data = fallbackData : (fallbackData = getDataFromCustomEvent(nativeEvent), null !== fallbackData && (eventType.data = fallbackData))));
          if (fallbackData = canUseTextInputEvent ? getNativeBeforeInputChars(domEventName, nativeEvent) : getFallbackBeforeInputChars(domEventName, nativeEvent))
            eventType = accumulateTwoPhaseListeners(targetInst, "onBeforeInput"), 0 < eventType.length && (handleEventFunc = new SyntheticCompositionEvent(
              "onBeforeInput",
              "beforeinput",
              null,
              nativeEvent,
              nativeEventTarget
            ), dispatchQueue.push({
              event: handleEventFunc,
              listeners: eventType
            }), handleEventFunc.data = fallbackData);
          extractEvents$1(
            dispatchQueue,
            domEventName,
            targetInst,
            nativeEvent,
            nativeEventTarget
          );
        }
        processDispatchQueue(dispatchQueue, eventSystemFlags);
      });
    }
    function createDispatchListener(instance, listener, currentTarget) {
      return {
        instance,
        listener,
        currentTarget
      };
    }
    function accumulateTwoPhaseListeners(targetFiber, reactName) {
      for (var captureName = reactName + "Capture", listeners = []; null !== targetFiber; ) {
        var _instance2 = targetFiber, stateNode = _instance2.stateNode;
        _instance2 = _instance2.tag;
        5 !== _instance2 && 26 !== _instance2 && 27 !== _instance2 || null === stateNode || (_instance2 = getListener(targetFiber, captureName), null != _instance2 && listeners.unshift(
          createDispatchListener(targetFiber, _instance2, stateNode)
        ), _instance2 = getListener(targetFiber, reactName), null != _instance2 && listeners.push(
          createDispatchListener(targetFiber, _instance2, stateNode)
        ));
        if (3 === targetFiber.tag) return listeners;
        targetFiber = targetFiber.return;
      }
      return [];
    }
    function getParent(inst) {
      if (null === inst) return null;
      do
        inst = inst.return;
      while (inst && 5 !== inst.tag && 27 !== inst.tag);
      return inst ? inst : null;
    }
    function accumulateEnterLeaveListenersForEvent(dispatchQueue, event, target, common, inCapturePhase) {
      for (var registrationName = event._reactName, listeners = []; null !== target && target !== common; ) {
        var _instance3 = target, alternate = _instance3.alternate, stateNode = _instance3.stateNode;
        _instance3 = _instance3.tag;
        if (null !== alternate && alternate === common) break;
        5 !== _instance3 && 26 !== _instance3 && 27 !== _instance3 || null === stateNode || (alternate = stateNode, inCapturePhase ? (stateNode = getListener(target, registrationName), null != stateNode && listeners.unshift(
          createDispatchListener(target, stateNode, alternate)
        )) : inCapturePhase || (stateNode = getListener(target, registrationName), null != stateNode && listeners.push(
          createDispatchListener(target, stateNode, alternate)
        )));
        target = target.return;
      }
      0 !== listeners.length && dispatchQueue.push({ event, listeners });
    }
    var NORMALIZE_NEWLINES_REGEX = /\r\n?/g, NORMALIZE_NULL_AND_REPLACEMENT_REGEX = /\u0000|\uFFFD/g;
    function normalizeMarkupForTextOrAttribute(markup) {
      return ("string" === typeof markup ? markup : "" + markup).replace(NORMALIZE_NEWLINES_REGEX, "\n").replace(NORMALIZE_NULL_AND_REPLACEMENT_REGEX, "");
    }
    function checkForUnmatchedText(serverText, clientText) {
      clientText = normalizeMarkupForTextOrAttribute(clientText);
      return normalizeMarkupForTextOrAttribute(serverText) === clientText ? true : false;
    }
    function setProp(domElement, tag, key, value, props, prevValue) {
      switch (key) {
        case "children":
          "string" === typeof value ? "body" === tag || "textarea" === tag && "" === value || setTextContent(domElement, value) : ("number" === typeof value || "bigint" === typeof value) && "body" !== tag && setTextContent(domElement, "" + value);
          break;
        case "className":
          setValueForKnownAttribute(domElement, "class", value);
          break;
        case "tabIndex":
          setValueForKnownAttribute(domElement, "tabindex", value);
          break;
        case "dir":
        case "role":
        case "viewBox":
        case "width":
        case "height":
          setValueForKnownAttribute(domElement, key, value);
          break;
        case "style":
          setValueForStyles(domElement, value, prevValue);
          break;
        case "data":
          if ("object" !== tag) {
            setValueForKnownAttribute(domElement, "data", value);
            break;
          }
        case "src":
        case "href":
          if ("" === value && ("a" !== tag || "href" !== key)) {
            domElement.removeAttribute(key);
            break;
          }
          if (null == value || "function" === typeof value || "symbol" === typeof value || "boolean" === typeof value) {
            domElement.removeAttribute(key);
            break;
          }
          value = sanitizeURL("" + value);
          domElement.setAttribute(key, value);
          break;
        case "action":
        case "formAction":
          if ("function" === typeof value) {
            domElement.setAttribute(
              key,
              "javascript:throw new Error('A React form was unexpectedly submitted. If you called form.submit() manually, consider using form.requestSubmit() instead. If you\\'re trying to use event.stopPropagation() in a submit event handler, consider also calling event.preventDefault().')"
            );
            break;
          } else
            "function" === typeof prevValue && ("formAction" === key ? ("input" !== tag && setProp(domElement, tag, "name", props.name, props, null), setProp(
              domElement,
              tag,
              "formEncType",
              props.formEncType,
              props,
              null
            ), setProp(
              domElement,
              tag,
              "formMethod",
              props.formMethod,
              props,
              null
            ), setProp(
              domElement,
              tag,
              "formTarget",
              props.formTarget,
              props,
              null
            )) : (setProp(domElement, tag, "encType", props.encType, props, null), setProp(domElement, tag, "method", props.method, props, null), setProp(domElement, tag, "target", props.target, props, null)));
          if (null == value || "symbol" === typeof value || "boolean" === typeof value) {
            domElement.removeAttribute(key);
            break;
          }
          value = sanitizeURL("" + value);
          domElement.setAttribute(key, value);
          break;
        case "onClick":
          null != value && (domElement.onclick = noop$1);
          break;
        case "onScroll":
          null != value && listenToNonDelegatedEvent("scroll", domElement);
          break;
        case "onScrollEnd":
          null != value && listenToNonDelegatedEvent("scrollend", domElement);
          break;
        case "dangerouslySetInnerHTML":
          if (null != value) {
            if ("object" !== typeof value || !("__html" in value))
              throw Error(formatProdErrorMessage(61));
            key = value.__html;
            if (null != key) {
              if (null != props.children) throw Error(formatProdErrorMessage(60));
              domElement.innerHTML = key;
            }
          }
          break;
        case "multiple":
          domElement.multiple = value && "function" !== typeof value && "symbol" !== typeof value;
          break;
        case "muted":
          domElement.muted = value && "function" !== typeof value && "symbol" !== typeof value;
          break;
        case "suppressContentEditableWarning":
        case "suppressHydrationWarning":
        case "defaultValue":
        case "defaultChecked":
        case "innerHTML":
        case "ref":
          break;
        case "autoFocus":
          break;
        case "xlinkHref":
          if (null == value || "function" === typeof value || "boolean" === typeof value || "symbol" === typeof value) {
            domElement.removeAttribute("xlink:href");
            break;
          }
          key = sanitizeURL("" + value);
          domElement.setAttributeNS(
            "http://www.w3.org/1999/xlink",
            "xlink:href",
            key
          );
          break;
        case "contentEditable":
        case "spellCheck":
        case "draggable":
        case "value":
        case "autoReverse":
        case "externalResourcesRequired":
        case "focusable":
        case "preserveAlpha":
          null != value && "function" !== typeof value && "symbol" !== typeof value ? domElement.setAttribute(key, "" + value) : domElement.removeAttribute(key);
          break;
        case "inert":
        case "allowFullScreen":
        case "async":
        case "autoPlay":
        case "controls":
        case "default":
        case "defer":
        case "disabled":
        case "disablePictureInPicture":
        case "disableRemotePlayback":
        case "formNoValidate":
        case "hidden":
        case "loop":
        case "noModule":
        case "noValidate":
        case "open":
        case "playsInline":
        case "readOnly":
        case "required":
        case "reversed":
        case "scoped":
        case "seamless":
        case "itemScope":
          value && "function" !== typeof value && "symbol" !== typeof value ? domElement.setAttribute(key, "") : domElement.removeAttribute(key);
          break;
        case "capture":
        case "download":
          true === value ? domElement.setAttribute(key, "") : false !== value && null != value && "function" !== typeof value && "symbol" !== typeof value ? domElement.setAttribute(key, value) : domElement.removeAttribute(key);
          break;
        case "cols":
        case "rows":
        case "size":
        case "span":
          null != value && "function" !== typeof value && "symbol" !== typeof value && !isNaN(value) && 1 <= value ? domElement.setAttribute(key, value) : domElement.removeAttribute(key);
          break;
        case "rowSpan":
        case "start":
          null == value || "function" === typeof value || "symbol" === typeof value || isNaN(value) ? domElement.removeAttribute(key) : domElement.setAttribute(key, value);
          break;
        case "popover":
          listenToNonDelegatedEvent("beforetoggle", domElement);
          listenToNonDelegatedEvent("toggle", domElement);
          setValueForAttribute(domElement, "popover", value);
          break;
        case "xlinkActuate":
          setValueForNamespacedAttribute(
            domElement,
            "http://www.w3.org/1999/xlink",
            "xlink:actuate",
            value
          );
          break;
        case "xlinkArcrole":
          setValueForNamespacedAttribute(
            domElement,
            "http://www.w3.org/1999/xlink",
            "xlink:arcrole",
            value
          );
          break;
        case "xlinkRole":
          setValueForNamespacedAttribute(
            domElement,
            "http://www.w3.org/1999/xlink",
            "xlink:role",
            value
          );
          break;
        case "xlinkShow":
          setValueForNamespacedAttribute(
            domElement,
            "http://www.w3.org/1999/xlink",
            "xlink:show",
            value
          );
          break;
        case "xlinkTitle":
          setValueForNamespacedAttribute(
            domElement,
            "http://www.w3.org/1999/xlink",
            "xlink:title",
            value
          );
          break;
        case "xlinkType":
          setValueForNamespacedAttribute(
            domElement,
            "http://www.w3.org/1999/xlink",
            "xlink:type",
            value
          );
          break;
        case "xmlBase":
          setValueForNamespacedAttribute(
            domElement,
            "http://www.w3.org/XML/1998/namespace",
            "xml:base",
            value
          );
          break;
        case "xmlLang":
          setValueForNamespacedAttribute(
            domElement,
            "http://www.w3.org/XML/1998/namespace",
            "xml:lang",
            value
          );
          break;
        case "xmlSpace":
          setValueForNamespacedAttribute(
            domElement,
            "http://www.w3.org/XML/1998/namespace",
            "xml:space",
            value
          );
          break;
        case "is":
          setValueForAttribute(domElement, "is", value);
          break;
        case "innerText":
        case "textContent":
          break;
        default:
          if (!(2 < key.length) || "o" !== key[0] && "O" !== key[0] || "n" !== key[1] && "N" !== key[1])
            key = aliases.get(key) || key, setValueForAttribute(domElement, key, value);
      }
    }
    function setPropOnCustomElement(domElement, tag, key, value, props, prevValue) {
      switch (key) {
        case "style":
          setValueForStyles(domElement, value, prevValue);
          break;
        case "dangerouslySetInnerHTML":
          if (null != value) {
            if ("object" !== typeof value || !("__html" in value))
              throw Error(formatProdErrorMessage(61));
            key = value.__html;
            if (null != key) {
              if (null != props.children) throw Error(formatProdErrorMessage(60));
              domElement.innerHTML = key;
            }
          }
          break;
        case "children":
          "string" === typeof value ? setTextContent(domElement, value) : ("number" === typeof value || "bigint" === typeof value) && setTextContent(domElement, "" + value);
          break;
        case "onScroll":
          null != value && listenToNonDelegatedEvent("scroll", domElement);
          break;
        case "onScrollEnd":
          null != value && listenToNonDelegatedEvent("scrollend", domElement);
          break;
        case "onClick":
          null != value && (domElement.onclick = noop$1);
          break;
        case "suppressContentEditableWarning":
        case "suppressHydrationWarning":
        case "innerHTML":
        case "ref":
          break;
        case "innerText":
        case "textContent":
          break;
        default:
          if (!registrationNameDependencies.hasOwnProperty(key))
            a: {
              if ("o" === key[0] && "n" === key[1] && (props = key.endsWith("Capture"), tag = key.slice(2, props ? key.length - 7 : void 0), prevValue = domElement[internalPropsKey] || null, prevValue = null != prevValue ? prevValue[key] : null, "function" === typeof prevValue && domElement.removeEventListener(tag, prevValue, props), "function" === typeof value)) {
                "function" !== typeof prevValue && null !== prevValue && (key in domElement ? domElement[key] = null : domElement.hasAttribute(key) && domElement.removeAttribute(key));
                domElement.addEventListener(tag, value, props);
                break a;
              }
              key in domElement ? domElement[key] = value : true === value ? domElement.setAttribute(key, "") : setValueForAttribute(domElement, key, value);
            }
      }
    }
    function setInitialProperties(domElement, tag, props) {
      switch (tag) {
        case "div":
        case "span":
        case "svg":
        case "path":
        case "a":
        case "g":
        case "p":
        case "li":
          break;
        case "img":
          listenToNonDelegatedEvent("error", domElement);
          listenToNonDelegatedEvent("load", domElement);
          var hasSrc = false, hasSrcSet = false, propKey;
          for (propKey in props)
            if (props.hasOwnProperty(propKey)) {
              var propValue = props[propKey];
              if (null != propValue)
                switch (propKey) {
                  case "src":
                    hasSrc = true;
                    break;
                  case "srcSet":
                    hasSrcSet = true;
                    break;
                  case "children":
                  case "dangerouslySetInnerHTML":
                    throw Error(formatProdErrorMessage(137, tag));
                  default:
                    setProp(domElement, tag, propKey, propValue, props, null);
                }
            }
          hasSrcSet && setProp(domElement, tag, "srcSet", props.srcSet, props, null);
          hasSrc && setProp(domElement, tag, "src", props.src, props, null);
          return;
        case "input":
          listenToNonDelegatedEvent("invalid", domElement);
          var defaultValue = propKey = propValue = hasSrcSet = null, checked = null, defaultChecked = null;
          for (hasSrc in props)
            if (props.hasOwnProperty(hasSrc)) {
              var propValue$184 = props[hasSrc];
              if (null != propValue$184)
                switch (hasSrc) {
                  case "name":
                    hasSrcSet = propValue$184;
                    break;
                  case "type":
                    propValue = propValue$184;
                    break;
                  case "checked":
                    checked = propValue$184;
                    break;
                  case "defaultChecked":
                    defaultChecked = propValue$184;
                    break;
                  case "value":
                    propKey = propValue$184;
                    break;
                  case "defaultValue":
                    defaultValue = propValue$184;
                    break;
                  case "children":
                  case "dangerouslySetInnerHTML":
                    if (null != propValue$184)
                      throw Error(formatProdErrorMessage(137, tag));
                    break;
                  default:
                    setProp(domElement, tag, hasSrc, propValue$184, props, null);
                }
            }
          initInput(
            domElement,
            propKey,
            defaultValue,
            checked,
            defaultChecked,
            propValue,
            hasSrcSet,
            false
          );
          return;
        case "select":
          listenToNonDelegatedEvent("invalid", domElement);
          hasSrc = propValue = propKey = null;
          for (hasSrcSet in props)
            if (props.hasOwnProperty(hasSrcSet) && (defaultValue = props[hasSrcSet], null != defaultValue))
              switch (hasSrcSet) {
                case "value":
                  propKey = defaultValue;
                  break;
                case "defaultValue":
                  propValue = defaultValue;
                  break;
                case "multiple":
                  hasSrc = defaultValue;
                default:
                  setProp(domElement, tag, hasSrcSet, defaultValue, props, null);
              }
          tag = propKey;
          props = propValue;
          domElement.multiple = !!hasSrc;
          null != tag ? updateOptions(domElement, !!hasSrc, tag, false) : null != props && updateOptions(domElement, !!hasSrc, props, true);
          return;
        case "textarea":
          listenToNonDelegatedEvent("invalid", domElement);
          propKey = hasSrcSet = hasSrc = null;
          for (propValue in props)
            if (props.hasOwnProperty(propValue) && (defaultValue = props[propValue], null != defaultValue))
              switch (propValue) {
                case "value":
                  hasSrc = defaultValue;
                  break;
                case "defaultValue":
                  hasSrcSet = defaultValue;
                  break;
                case "children":
                  propKey = defaultValue;
                  break;
                case "dangerouslySetInnerHTML":
                  if (null != defaultValue) throw Error(formatProdErrorMessage(91));
                  break;
                default:
                  setProp(domElement, tag, propValue, defaultValue, props, null);
              }
          initTextarea(domElement, hasSrc, hasSrcSet, propKey);
          return;
        case "option":
          for (checked in props)
            if (props.hasOwnProperty(checked) && (hasSrc = props[checked], null != hasSrc))
              switch (checked) {
                case "selected":
                  domElement.selected = hasSrc && "function" !== typeof hasSrc && "symbol" !== typeof hasSrc;
                  break;
                default:
                  setProp(domElement, tag, checked, hasSrc, props, null);
              }
          return;
        case "dialog":
          listenToNonDelegatedEvent("beforetoggle", domElement);
          listenToNonDelegatedEvent("toggle", domElement);
          listenToNonDelegatedEvent("cancel", domElement);
          listenToNonDelegatedEvent("close", domElement);
          break;
        case "iframe":
        case "object":
          listenToNonDelegatedEvent("load", domElement);
          break;
        case "video":
        case "audio":
          for (hasSrc = 0; hasSrc < mediaEventTypes.length; hasSrc++)
            listenToNonDelegatedEvent(mediaEventTypes[hasSrc], domElement);
          break;
        case "image":
          listenToNonDelegatedEvent("error", domElement);
          listenToNonDelegatedEvent("load", domElement);
          break;
        case "details":
          listenToNonDelegatedEvent("toggle", domElement);
          break;
        case "embed":
        case "source":
        case "link":
          listenToNonDelegatedEvent("error", domElement), listenToNonDelegatedEvent("load", domElement);
        case "area":
        case "base":
        case "br":
        case "col":
        case "hr":
        case "keygen":
        case "meta":
        case "param":
        case "track":
        case "wbr":
        case "menuitem":
          for (defaultChecked in props)
            if (props.hasOwnProperty(defaultChecked) && (hasSrc = props[defaultChecked], null != hasSrc))
              switch (defaultChecked) {
                case "children":
                case "dangerouslySetInnerHTML":
                  throw Error(formatProdErrorMessage(137, tag));
                default:
                  setProp(domElement, tag, defaultChecked, hasSrc, props, null);
              }
          return;
        default:
          if (isCustomElement(tag)) {
            for (propValue$184 in props)
              props.hasOwnProperty(propValue$184) && (hasSrc = props[propValue$184], void 0 !== hasSrc && setPropOnCustomElement(
                domElement,
                tag,
                propValue$184,
                hasSrc,
                props,
                void 0
              ));
            return;
          }
      }
      for (defaultValue in props)
        props.hasOwnProperty(defaultValue) && (hasSrc = props[defaultValue], null != hasSrc && setProp(domElement, tag, defaultValue, hasSrc, props, null));
    }
    function updateProperties(domElement, tag, lastProps, nextProps) {
      switch (tag) {
        case "div":
        case "span":
        case "svg":
        case "path":
        case "a":
        case "g":
        case "p":
        case "li":
          break;
        case "input":
          var name = null, type = null, value = null, defaultValue = null, lastDefaultValue = null, checked = null, defaultChecked = null;
          for (propKey in lastProps) {
            var lastProp = lastProps[propKey];
            if (lastProps.hasOwnProperty(propKey) && null != lastProp)
              switch (propKey) {
                case "checked":
                  break;
                case "value":
                  break;
                case "defaultValue":
                  lastDefaultValue = lastProp;
                default:
                  nextProps.hasOwnProperty(propKey) || setProp(domElement, tag, propKey, null, nextProps, lastProp);
              }
          }
          for (var propKey$201 in nextProps) {
            var propKey = nextProps[propKey$201];
            lastProp = lastProps[propKey$201];
            if (nextProps.hasOwnProperty(propKey$201) && (null != propKey || null != lastProp))
              switch (propKey$201) {
                case "type":
                  type = propKey;
                  break;
                case "name":
                  name = propKey;
                  break;
                case "checked":
                  checked = propKey;
                  break;
                case "defaultChecked":
                  defaultChecked = propKey;
                  break;
                case "value":
                  value = propKey;
                  break;
                case "defaultValue":
                  defaultValue = propKey;
                  break;
                case "children":
                case "dangerouslySetInnerHTML":
                  if (null != propKey)
                    throw Error(formatProdErrorMessage(137, tag));
                  break;
                default:
                  propKey !== lastProp && setProp(
                    domElement,
                    tag,
                    propKey$201,
                    propKey,
                    nextProps,
                    lastProp
                  );
              }
          }
          updateInput(
            domElement,
            value,
            defaultValue,
            lastDefaultValue,
            checked,
            defaultChecked,
            type,
            name
          );
          return;
        case "select":
          propKey = value = defaultValue = propKey$201 = null;
          for (type in lastProps)
            if (lastDefaultValue = lastProps[type], lastProps.hasOwnProperty(type) && null != lastDefaultValue)
              switch (type) {
                case "value":
                  break;
                case "multiple":
                  propKey = lastDefaultValue;
                default:
                  nextProps.hasOwnProperty(type) || setProp(
                    domElement,
                    tag,
                    type,
                    null,
                    nextProps,
                    lastDefaultValue
                  );
              }
          for (name in nextProps)
            if (type = nextProps[name], lastDefaultValue = lastProps[name], nextProps.hasOwnProperty(name) && (null != type || null != lastDefaultValue))
              switch (name) {
                case "value":
                  propKey$201 = type;
                  break;
                case "defaultValue":
                  defaultValue = type;
                  break;
                case "multiple":
                  value = type;
                default:
                  type !== lastDefaultValue && setProp(
                    domElement,
                    tag,
                    name,
                    type,
                    nextProps,
                    lastDefaultValue
                  );
              }
          tag = defaultValue;
          lastProps = value;
          nextProps = propKey;
          null != propKey$201 ? updateOptions(domElement, !!lastProps, propKey$201, false) : !!nextProps !== !!lastProps && (null != tag ? updateOptions(domElement, !!lastProps, tag, true) : updateOptions(domElement, !!lastProps, lastProps ? [] : "", false));
          return;
        case "textarea":
          propKey = propKey$201 = null;
          for (defaultValue in lastProps)
            if (name = lastProps[defaultValue], lastProps.hasOwnProperty(defaultValue) && null != name && !nextProps.hasOwnProperty(defaultValue))
              switch (defaultValue) {
                case "value":
                  break;
                case "children":
                  break;
                default:
                  setProp(domElement, tag, defaultValue, null, nextProps, name);
              }
          for (value in nextProps)
            if (name = nextProps[value], type = lastProps[value], nextProps.hasOwnProperty(value) && (null != name || null != type))
              switch (value) {
                case "value":
                  propKey$201 = name;
                  break;
                case "defaultValue":
                  propKey = name;
                  break;
                case "children":
                  break;
                case "dangerouslySetInnerHTML":
                  if (null != name) throw Error(formatProdErrorMessage(91));
                  break;
                default:
                  name !== type && setProp(domElement, tag, value, name, nextProps, type);
              }
          updateTextarea(domElement, propKey$201, propKey);
          return;
        case "option":
          for (var propKey$217 in lastProps)
            if (propKey$201 = lastProps[propKey$217], lastProps.hasOwnProperty(propKey$217) && null != propKey$201 && !nextProps.hasOwnProperty(propKey$217))
              switch (propKey$217) {
                case "selected":
                  domElement.selected = false;
                  break;
                default:
                  setProp(
                    domElement,
                    tag,
                    propKey$217,
                    null,
                    nextProps,
                    propKey$201
                  );
              }
          for (lastDefaultValue in nextProps)
            if (propKey$201 = nextProps[lastDefaultValue], propKey = lastProps[lastDefaultValue], nextProps.hasOwnProperty(lastDefaultValue) && propKey$201 !== propKey && (null != propKey$201 || null != propKey))
              switch (lastDefaultValue) {
                case "selected":
                  domElement.selected = propKey$201 && "function" !== typeof propKey$201 && "symbol" !== typeof propKey$201;
                  break;
                default:
                  setProp(
                    domElement,
                    tag,
                    lastDefaultValue,
                    propKey$201,
                    nextProps,
                    propKey
                  );
              }
          return;
        case "img":
        case "link":
        case "area":
        case "base":
        case "br":
        case "col":
        case "embed":
        case "hr":
        case "keygen":
        case "meta":
        case "param":
        case "source":
        case "track":
        case "wbr":
        case "menuitem":
          for (var propKey$222 in lastProps)
            propKey$201 = lastProps[propKey$222], lastProps.hasOwnProperty(propKey$222) && null != propKey$201 && !nextProps.hasOwnProperty(propKey$222) && setProp(domElement, tag, propKey$222, null, nextProps, propKey$201);
          for (checked in nextProps)
            if (propKey$201 = nextProps[checked], propKey = lastProps[checked], nextProps.hasOwnProperty(checked) && propKey$201 !== propKey && (null != propKey$201 || null != propKey))
              switch (checked) {
                case "children":
                case "dangerouslySetInnerHTML":
                  if (null != propKey$201)
                    throw Error(formatProdErrorMessage(137, tag));
                  break;
                default:
                  setProp(
                    domElement,
                    tag,
                    checked,
                    propKey$201,
                    nextProps,
                    propKey
                  );
              }
          return;
        default:
          if (isCustomElement(tag)) {
            for (var propKey$227 in lastProps)
              propKey$201 = lastProps[propKey$227], lastProps.hasOwnProperty(propKey$227) && void 0 !== propKey$201 && !nextProps.hasOwnProperty(propKey$227) && setPropOnCustomElement(
                domElement,
                tag,
                propKey$227,
                void 0,
                nextProps,
                propKey$201
              );
            for (defaultChecked in nextProps)
              propKey$201 = nextProps[defaultChecked], propKey = lastProps[defaultChecked], !nextProps.hasOwnProperty(defaultChecked) || propKey$201 === propKey || void 0 === propKey$201 && void 0 === propKey || setPropOnCustomElement(
                domElement,
                tag,
                defaultChecked,
                propKey$201,
                nextProps,
                propKey
              );
            return;
          }
      }
      for (var propKey$232 in lastProps)
        propKey$201 = lastProps[propKey$232], lastProps.hasOwnProperty(propKey$232) && null != propKey$201 && !nextProps.hasOwnProperty(propKey$232) && setProp(domElement, tag, propKey$232, null, nextProps, propKey$201);
      for (lastProp in nextProps)
        propKey$201 = nextProps[lastProp], propKey = lastProps[lastProp], !nextProps.hasOwnProperty(lastProp) || propKey$201 === propKey || null == propKey$201 && null == propKey || setProp(domElement, tag, lastProp, propKey$201, nextProps, propKey);
    }
    function isLikelyStaticResource(initiatorType) {
      switch (initiatorType) {
        case "css":
        case "script":
        case "font":
        case "img":
        case "image":
        case "input":
        case "link":
          return true;
        default:
          return false;
      }
    }
    function estimateBandwidth() {
      if ("function" === typeof performance.getEntriesByType) {
        for (var count = 0, bits = 0, resourceEntries = performance.getEntriesByType("resource"), i = 0; i < resourceEntries.length; i++) {
          var entry = resourceEntries[i], transferSize = entry.transferSize, initiatorType = entry.initiatorType, duration = entry.duration;
          if (transferSize && duration && isLikelyStaticResource(initiatorType)) {
            initiatorType = 0;
            duration = entry.responseEnd;
            for (i += 1; i < resourceEntries.length; i++) {
              var overlapEntry = resourceEntries[i], overlapStartTime = overlapEntry.startTime;
              if (overlapStartTime > duration) break;
              var overlapTransferSize = overlapEntry.transferSize, overlapInitiatorType = overlapEntry.initiatorType;
              overlapTransferSize && isLikelyStaticResource(overlapInitiatorType) && (overlapEntry = overlapEntry.responseEnd, initiatorType += overlapTransferSize * (overlapEntry < duration ? 1 : (duration - overlapStartTime) / (overlapEntry - overlapStartTime)));
            }
            --i;
            bits += 8 * (transferSize + initiatorType) / (entry.duration / 1e3);
            count++;
            if (10 < count) break;
          }
        }
        if (0 < count) return bits / count / 1e6;
      }
      return navigator.connection && (count = navigator.connection.downlink, "number" === typeof count) ? count : 5;
    }
    var eventsEnabled = null, selectionInformation = null;
    function getOwnerDocumentFromRootContainer(rootContainerElement) {
      return 9 === rootContainerElement.nodeType ? rootContainerElement : rootContainerElement.ownerDocument;
    }
    function getOwnHostContext(namespaceURI) {
      switch (namespaceURI) {
        case "http://www.w3.org/2000/svg":
          return 1;
        case "http://www.w3.org/1998/Math/MathML":
          return 2;
        default:
          return 0;
      }
    }
    function getChildHostContextProd(parentNamespace, type) {
      if (0 === parentNamespace)
        switch (type) {
          case "svg":
            return 1;
          case "math":
            return 2;
          default:
            return 0;
        }
      return 1 === parentNamespace && "foreignObject" === type ? 0 : parentNamespace;
    }
    function shouldSetTextContent(type, props) {
      return "textarea" === type || "noscript" === type || "string" === typeof props.children || "number" === typeof props.children || "bigint" === typeof props.children || "object" === typeof props.dangerouslySetInnerHTML && null !== props.dangerouslySetInnerHTML && null != props.dangerouslySetInnerHTML.__html;
    }
    var currentPopstateTransitionEvent = null;
    function shouldAttemptEagerTransition() {
      var event = window.event;
      if (event && "popstate" === event.type) {
        if (event === currentPopstateTransitionEvent) return false;
        currentPopstateTransitionEvent = event;
        return true;
      }
      currentPopstateTransitionEvent = null;
      return false;
    }
    var scheduleTimeout = "function" === typeof setTimeout ? setTimeout : void 0, cancelTimeout = "function" === typeof clearTimeout ? clearTimeout : void 0, localPromise = "function" === typeof Promise ? Promise : void 0, scheduleMicrotask = "function" === typeof queueMicrotask ? queueMicrotask : "undefined" !== typeof localPromise ? function(callback) {
      return localPromise.resolve(null).then(callback).catch(handleErrorInNextTick);
    } : scheduleTimeout;
    function handleErrorInNextTick(error) {
      setTimeout(function() {
        throw error;
      });
    }
    function isSingletonScope(type) {
      return "head" === type;
    }
    function clearHydrationBoundary(parentInstance, hydrationInstance) {
      var node = hydrationInstance, depth = 0;
      do {
        var nextNode = node.nextSibling;
        parentInstance.removeChild(node);
        if (nextNode && 8 === nextNode.nodeType)
          if (node = nextNode.data, "/$" === node || "/&" === node) {
            if (0 === depth) {
              parentInstance.removeChild(nextNode);
              retryIfBlockedOn(hydrationInstance);
              return;
            }
            depth--;
          } else if ("$" === node || "$?" === node || "$~" === node || "$!" === node || "&" === node)
            depth++;
          else if ("html" === node)
            releaseSingletonInstance(parentInstance.ownerDocument.documentElement);
          else if ("head" === node) {
            node = parentInstance.ownerDocument.head;
            releaseSingletonInstance(node);
            for (var node$jscomp$0 = node.firstChild; node$jscomp$0; ) {
              var nextNode$jscomp$0 = node$jscomp$0.nextSibling, nodeName = node$jscomp$0.nodeName;
              node$jscomp$0[internalHoistableMarker] || "SCRIPT" === nodeName || "STYLE" === nodeName || "LINK" === nodeName && "stylesheet" === node$jscomp$0.rel.toLowerCase() || node.removeChild(node$jscomp$0);
              node$jscomp$0 = nextNode$jscomp$0;
            }
          } else
            "body" === node && releaseSingletonInstance(parentInstance.ownerDocument.body);
        node = nextNode;
      } while (node);
      retryIfBlockedOn(hydrationInstance);
    }
    function hideOrUnhideDehydratedBoundary(suspenseInstance, isHidden) {
      var node = suspenseInstance;
      suspenseInstance = 0;
      do {
        var nextNode = node.nextSibling;
        1 === node.nodeType ? isHidden ? (node._stashedDisplay = node.style.display, node.style.display = "none") : (node.style.display = node._stashedDisplay || "", "" === node.getAttribute("style") && node.removeAttribute("style")) : 3 === node.nodeType && (isHidden ? (node._stashedText = node.nodeValue, node.nodeValue = "") : node.nodeValue = node._stashedText || "");
        if (nextNode && 8 === nextNode.nodeType)
          if (node = nextNode.data, "/$" === node)
            if (0 === suspenseInstance) break;
            else suspenseInstance--;
          else
            "$" !== node && "$?" !== node && "$~" !== node && "$!" !== node || suspenseInstance++;
        node = nextNode;
      } while (node);
    }
    function clearContainerSparingly(container) {
      var nextNode = container.firstChild;
      nextNode && 10 === nextNode.nodeType && (nextNode = nextNode.nextSibling);
      for (; nextNode; ) {
        var node = nextNode;
        nextNode = nextNode.nextSibling;
        switch (node.nodeName) {
          case "HTML":
          case "HEAD":
          case "BODY":
            clearContainerSparingly(node);
            detachDeletedInstance(node);
            continue;
          case "SCRIPT":
          case "STYLE":
            continue;
          case "LINK":
            if ("stylesheet" === node.rel.toLowerCase()) continue;
        }
        container.removeChild(node);
      }
    }
    function canHydrateInstance(instance, type, props, inRootOrSingleton) {
      for (; 1 === instance.nodeType; ) {
        var anyProps = props;
        if (instance.nodeName.toLowerCase() !== type.toLowerCase()) {
          if (!inRootOrSingleton && ("INPUT" !== instance.nodeName || "hidden" !== instance.type))
            break;
        } else if (!inRootOrSingleton)
          if ("input" === type && "hidden" === instance.type) {
            var name = null == anyProps.name ? null : "" + anyProps.name;
            if ("hidden" === anyProps.type && instance.getAttribute("name") === name)
              return instance;
          } else return instance;
        else if (!instance[internalHoistableMarker])
          switch (type) {
            case "meta":
              if (!instance.hasAttribute("itemprop")) break;
              return instance;
            case "link":
              name = instance.getAttribute("rel");
              if ("stylesheet" === name && instance.hasAttribute("data-precedence"))
                break;
              else if (name !== anyProps.rel || instance.getAttribute("href") !== (null == anyProps.href || "" === anyProps.href ? null : anyProps.href) || instance.getAttribute("crossorigin") !== (null == anyProps.crossOrigin ? null : anyProps.crossOrigin) || instance.getAttribute("title") !== (null == anyProps.title ? null : anyProps.title))
                break;
              return instance;
            case "style":
              if (instance.hasAttribute("data-precedence")) break;
              return instance;
            case "script":
              name = instance.getAttribute("src");
              if ((name !== (null == anyProps.src ? null : anyProps.src) || instance.getAttribute("type") !== (null == anyProps.type ? null : anyProps.type) || instance.getAttribute("crossorigin") !== (null == anyProps.crossOrigin ? null : anyProps.crossOrigin)) && name && instance.hasAttribute("async") && !instance.hasAttribute("itemprop"))
                break;
              return instance;
            default:
              return instance;
          }
        instance = getNextHydratable(instance.nextSibling);
        if (null === instance) break;
      }
      return null;
    }
    function canHydrateTextInstance(instance, text, inRootOrSingleton) {
      if ("" === text) return null;
      for (; 3 !== instance.nodeType; ) {
        if ((1 !== instance.nodeType || "INPUT" !== instance.nodeName || "hidden" !== instance.type) && !inRootOrSingleton)
          return null;
        instance = getNextHydratable(instance.nextSibling);
        if (null === instance) return null;
      }
      return instance;
    }
    function canHydrateHydrationBoundary(instance, inRootOrSingleton) {
      for (; 8 !== instance.nodeType; ) {
        if ((1 !== instance.nodeType || "INPUT" !== instance.nodeName || "hidden" !== instance.type) && !inRootOrSingleton)
          return null;
        instance = getNextHydratable(instance.nextSibling);
        if (null === instance) return null;
      }
      return instance;
    }
    function isSuspenseInstancePending(instance) {
      return "$?" === instance.data || "$~" === instance.data;
    }
    function isSuspenseInstanceFallback(instance) {
      return "$!" === instance.data || "$?" === instance.data && "loading" !== instance.ownerDocument.readyState;
    }
    function registerSuspenseInstanceRetry(instance, callback) {
      var ownerDocument = instance.ownerDocument;
      if ("$~" === instance.data) instance._reactRetry = callback;
      else if ("$?" !== instance.data || "loading" !== ownerDocument.readyState)
        callback();
      else {
        var listener = function() {
          callback();
          ownerDocument.removeEventListener("DOMContentLoaded", listener);
        };
        ownerDocument.addEventListener("DOMContentLoaded", listener);
        instance._reactRetry = listener;
      }
    }
    function getNextHydratable(node) {
      for (; null != node; node = node.nextSibling) {
        var nodeType = node.nodeType;
        if (1 === nodeType || 3 === nodeType) break;
        if (8 === nodeType) {
          nodeType = node.data;
          if ("$" === nodeType || "$!" === nodeType || "$?" === nodeType || "$~" === nodeType || "&" === nodeType || "F!" === nodeType || "F" === nodeType)
            break;
          if ("/$" === nodeType || "/&" === nodeType) return null;
        }
      }
      return node;
    }
    var previousHydratableOnEnteringScopedSingleton = null;
    function getNextHydratableInstanceAfterHydrationBoundary(hydrationInstance) {
      hydrationInstance = hydrationInstance.nextSibling;
      for (var depth = 0; hydrationInstance; ) {
        if (8 === hydrationInstance.nodeType) {
          var data = hydrationInstance.data;
          if ("/$" === data || "/&" === data) {
            if (0 === depth)
              return getNextHydratable(hydrationInstance.nextSibling);
            depth--;
          } else
            "$" !== data && "$!" !== data && "$?" !== data && "$~" !== data && "&" !== data || depth++;
        }
        hydrationInstance = hydrationInstance.nextSibling;
      }
      return null;
    }
    function getParentHydrationBoundary(targetInstance) {
      targetInstance = targetInstance.previousSibling;
      for (var depth = 0; targetInstance; ) {
        if (8 === targetInstance.nodeType) {
          var data = targetInstance.data;
          if ("$" === data || "$!" === data || "$?" === data || "$~" === data || "&" === data) {
            if (0 === depth) return targetInstance;
            depth--;
          } else "/$" !== data && "/&" !== data || depth++;
        }
        targetInstance = targetInstance.previousSibling;
      }
      return null;
    }
    function resolveSingletonInstance(type, props, rootContainerInstance) {
      props = getOwnerDocumentFromRootContainer(rootContainerInstance);
      switch (type) {
        case "html":
          type = props.documentElement;
          if (!type) throw Error(formatProdErrorMessage(452));
          return type;
        case "head":
          type = props.head;
          if (!type) throw Error(formatProdErrorMessage(453));
          return type;
        case "body":
          type = props.body;
          if (!type) throw Error(formatProdErrorMessage(454));
          return type;
        default:
          throw Error(formatProdErrorMessage(451));
      }
    }
    function releaseSingletonInstance(instance) {
      for (var attributes = instance.attributes; attributes.length; )
        instance.removeAttributeNode(attributes[0]);
      detachDeletedInstance(instance);
    }
    var preloadPropsMap = new Map(), preconnectsSet = new Set();
    function getHoistableRoot(container) {
      return "function" === typeof container.getRootNode ? container.getRootNode() : 9 === container.nodeType ? container : container.ownerDocument;
    }
    var previousDispatcher = ReactDOMSharedInternals.d;
    ReactDOMSharedInternals.d = {
      f: flushSyncWork,
      r: requestFormReset,
      D: prefetchDNS,
      C: preconnect,
      L: preload,
      m: preloadModule,
      X: preinitScript,
      S: preinitStyle,
      M: preinitModuleScript
    };
    function flushSyncWork() {
      var previousWasRendering = previousDispatcher.f(), wasRendering = flushSyncWork$1();
      return previousWasRendering || wasRendering;
    }
    function requestFormReset(form) {
      var formInst = getInstanceFromNode(form);
      null !== formInst && 5 === formInst.tag && "form" === formInst.type ? requestFormReset$1(formInst) : previousDispatcher.r(form);
    }
    var globalDocument = "undefined" === typeof document ? null : document;
    function preconnectAs(rel, href, crossOrigin) {
      var ownerDocument = globalDocument;
      if (ownerDocument && "string" === typeof href && href) {
        var limitedEscapedHref = escapeSelectorAttributeValueInsideDoubleQuotes(href);
        limitedEscapedHref = 'link[rel="' + rel + '"][href="' + limitedEscapedHref + '"]';
        "string" === typeof crossOrigin && (limitedEscapedHref += '[crossorigin="' + crossOrigin + '"]');
        preconnectsSet.has(limitedEscapedHref) || (preconnectsSet.add(limitedEscapedHref), rel = { rel, crossOrigin, href }, null === ownerDocument.querySelector(limitedEscapedHref) && (href = ownerDocument.createElement("link"), setInitialProperties(href, "link", rel), markNodeAsHoistable(href), ownerDocument.head.appendChild(href)));
      }
    }
    function prefetchDNS(href) {
      previousDispatcher.D(href);
      preconnectAs("dns-prefetch", href, null);
    }
    function preconnect(href, crossOrigin) {
      previousDispatcher.C(href, crossOrigin);
      preconnectAs("preconnect", href, crossOrigin);
    }
    function preload(href, as, options2) {
      previousDispatcher.L(href, as, options2);
      var ownerDocument = globalDocument;
      if (ownerDocument && href && as) {
        var preloadSelector = 'link[rel="preload"][as="' + escapeSelectorAttributeValueInsideDoubleQuotes(as) + '"]';
        "image" === as ? options2 && options2.imageSrcSet ? (preloadSelector += '[imagesrcset="' + escapeSelectorAttributeValueInsideDoubleQuotes(
          options2.imageSrcSet
        ) + '"]', "string" === typeof options2.imageSizes && (preloadSelector += '[imagesizes="' + escapeSelectorAttributeValueInsideDoubleQuotes(
          options2.imageSizes
        ) + '"]')) : preloadSelector += '[href="' + escapeSelectorAttributeValueInsideDoubleQuotes(href) + '"]' : preloadSelector += '[href="' + escapeSelectorAttributeValueInsideDoubleQuotes(href) + '"]';
        var key = preloadSelector;
        switch (as) {
          case "style":
            key = getStyleKey(href);
            break;
          case "script":
            key = getScriptKey(href);
        }
        preloadPropsMap.has(key) || (href = assign(
          {
            rel: "preload",
            href: "image" === as && options2 && options2.imageSrcSet ? void 0 : href,
            as
          },
          options2
        ), preloadPropsMap.set(key, href), null !== ownerDocument.querySelector(preloadSelector) || "style" === as && ownerDocument.querySelector(getStylesheetSelectorFromKey(key)) || "script" === as && ownerDocument.querySelector(getScriptSelectorFromKey(key)) || (as = ownerDocument.createElement("link"), setInitialProperties(as, "link", href), markNodeAsHoistable(as), ownerDocument.head.appendChild(as)));
      }
    }
    function preloadModule(href, options2) {
      previousDispatcher.m(href, options2);
      var ownerDocument = globalDocument;
      if (ownerDocument && href) {
        var as = options2 && "string" === typeof options2.as ? options2.as : "script", preloadSelector = 'link[rel="modulepreload"][as="' + escapeSelectorAttributeValueInsideDoubleQuotes(as) + '"][href="' + escapeSelectorAttributeValueInsideDoubleQuotes(href) + '"]', key = preloadSelector;
        switch (as) {
          case "audioworklet":
          case "paintworklet":
          case "serviceworker":
          case "sharedworker":
          case "worker":
          case "script":
            key = getScriptKey(href);
        }
        if (!preloadPropsMap.has(key) && (href = assign({ rel: "modulepreload", href }, options2), preloadPropsMap.set(key, href), null === ownerDocument.querySelector(preloadSelector))) {
          switch (as) {
            case "audioworklet":
            case "paintworklet":
            case "serviceworker":
            case "sharedworker":
            case "worker":
            case "script":
              if (ownerDocument.querySelector(getScriptSelectorFromKey(key)))
                return;
          }
          as = ownerDocument.createElement("link");
          setInitialProperties(as, "link", href);
          markNodeAsHoistable(as);
          ownerDocument.head.appendChild(as);
        }
      }
    }
    function preinitStyle(href, precedence, options2) {
      previousDispatcher.S(href, precedence, options2);
      var ownerDocument = globalDocument;
      if (ownerDocument && href) {
        var styles = getResourcesFromRoot(ownerDocument).hoistableStyles, key = getStyleKey(href);
        precedence = precedence || "default";
        var resource = styles.get(key);
        if (!resource) {
          var state = { loading: 0, preload: null };
          if (resource = ownerDocument.querySelector(
            getStylesheetSelectorFromKey(key)
          ))
            state.loading = 5;
          else {
            href = assign(
              { rel: "stylesheet", href, "data-precedence": precedence },
              options2
            );
            (options2 = preloadPropsMap.get(key)) && adoptPreloadPropsForStylesheet(href, options2);
            var link = resource = ownerDocument.createElement("link");
            markNodeAsHoistable(link);
            setInitialProperties(link, "link", href);
            link._p = new Promise(function(resolve, reject) {
              link.onload = resolve;
              link.onerror = reject;
            });
            link.addEventListener("load", function() {
              state.loading |= 1;
            });
            link.addEventListener("error", function() {
              state.loading |= 2;
            });
            state.loading |= 4;
            insertStylesheet(resource, precedence, ownerDocument);
          }
          resource = {
            type: "stylesheet",
            instance: resource,
            count: 1,
            state
          };
          styles.set(key, resource);
        }
      }
    }
    function preinitScript(src, options2) {
      previousDispatcher.X(src, options2);
      var ownerDocument = globalDocument;
      if (ownerDocument && src) {
        var scripts = getResourcesFromRoot(ownerDocument).hoistableScripts, key = getScriptKey(src), resource = scripts.get(key);
        resource || (resource = ownerDocument.querySelector(getScriptSelectorFromKey(key)), resource || (src = assign({ src, async: true }, options2), (options2 = preloadPropsMap.get(key)) && adoptPreloadPropsForScript(src, options2), resource = ownerDocument.createElement("script"), markNodeAsHoistable(resource), setInitialProperties(resource, "link", src), ownerDocument.head.appendChild(resource)), resource = {
          type: "script",
          instance: resource,
          count: 1,
          state: null
        }, scripts.set(key, resource));
      }
    }
    function preinitModuleScript(src, options2) {
      previousDispatcher.M(src, options2);
      var ownerDocument = globalDocument;
      if (ownerDocument && src) {
        var scripts = getResourcesFromRoot(ownerDocument).hoistableScripts, key = getScriptKey(src), resource = scripts.get(key);
        resource || (resource = ownerDocument.querySelector(getScriptSelectorFromKey(key)), resource || (src = assign({ src, async: true, type: "module" }, options2), (options2 = preloadPropsMap.get(key)) && adoptPreloadPropsForScript(src, options2), resource = ownerDocument.createElement("script"), markNodeAsHoistable(resource), setInitialProperties(resource, "link", src), ownerDocument.head.appendChild(resource)), resource = {
          type: "script",
          instance: resource,
          count: 1,
          state: null
        }, scripts.set(key, resource));
      }
    }
    function getResource(type, currentProps, pendingProps, currentResource) {
      var JSCompiler_inline_result = (JSCompiler_inline_result = rootInstanceStackCursor.current) ? getHoistableRoot(JSCompiler_inline_result) : null;
      if (!JSCompiler_inline_result) throw Error(formatProdErrorMessage(446));
      switch (type) {
        case "meta":
        case "title":
          return null;
        case "style":
          return "string" === typeof pendingProps.precedence && "string" === typeof pendingProps.href ? (currentProps = getStyleKey(pendingProps.href), pendingProps = getResourcesFromRoot(
            JSCompiler_inline_result
          ).hoistableStyles, currentResource = pendingProps.get(currentProps), currentResource || (currentResource = {
            type: "style",
            instance: null,
            count: 0,
            state: null
          }, pendingProps.set(currentProps, currentResource)), currentResource) : { type: "void", instance: null, count: 0, state: null };
        case "link":
          if ("stylesheet" === pendingProps.rel && "string" === typeof pendingProps.href && "string" === typeof pendingProps.precedence) {
            type = getStyleKey(pendingProps.href);
            var styles$243 = getResourcesFromRoot(
              JSCompiler_inline_result
            ).hoistableStyles, resource$244 = styles$243.get(type);
            resource$244 || (JSCompiler_inline_result = JSCompiler_inline_result.ownerDocument || JSCompiler_inline_result, resource$244 = {
              type: "stylesheet",
              instance: null,
              count: 0,
              state: { loading: 0, preload: null }
            }, styles$243.set(type, resource$244), (styles$243 = JSCompiler_inline_result.querySelector(
              getStylesheetSelectorFromKey(type)
            )) && !styles$243._p && (resource$244.instance = styles$243, resource$244.state.loading = 5), preloadPropsMap.has(type) || (pendingProps = {
              rel: "preload",
              as: "style",
              href: pendingProps.href,
              crossOrigin: pendingProps.crossOrigin,
              integrity: pendingProps.integrity,
              media: pendingProps.media,
              hrefLang: pendingProps.hrefLang,
              referrerPolicy: pendingProps.referrerPolicy
            }, preloadPropsMap.set(type, pendingProps), styles$243 || preloadStylesheet(
              JSCompiler_inline_result,
              type,
              pendingProps,
              resource$244.state
            )));
            if (currentProps && null === currentResource)
              throw Error(formatProdErrorMessage(528, ""));
            return resource$244;
          }
          if (currentProps && null !== currentResource)
            throw Error(formatProdErrorMessage(529, ""));
          return null;
        case "script":
          return currentProps = pendingProps.async, pendingProps = pendingProps.src, "string" === typeof pendingProps && currentProps && "function" !== typeof currentProps && "symbol" !== typeof currentProps ? (currentProps = getScriptKey(pendingProps), pendingProps = getResourcesFromRoot(
            JSCompiler_inline_result
          ).hoistableScripts, currentResource = pendingProps.get(currentProps), currentResource || (currentResource = {
            type: "script",
            instance: null,
            count: 0,
            state: null
          }, pendingProps.set(currentProps, currentResource)), currentResource) : { type: "void", instance: null, count: 0, state: null };
        default:
          throw Error(formatProdErrorMessage(444, type));
      }
    }
    function getStyleKey(href) {
      return 'href="' + escapeSelectorAttributeValueInsideDoubleQuotes(href) + '"';
    }
    function getStylesheetSelectorFromKey(key) {
      return 'link[rel="stylesheet"][' + key + "]";
    }
    function stylesheetPropsFromRawProps(rawProps) {
      return assign({}, rawProps, {
        "data-precedence": rawProps.precedence,
        precedence: null
      });
    }
    function preloadStylesheet(ownerDocument, key, preloadProps, state) {
      ownerDocument.querySelector('link[rel="preload"][as="style"][' + key + "]") ? state.loading = 1 : (key = ownerDocument.createElement("link"), state.preload = key, key.addEventListener("load", function() {
        return state.loading |= 1;
      }), key.addEventListener("error", function() {
        return state.loading |= 2;
      }), setInitialProperties(key, "link", preloadProps), markNodeAsHoistable(key), ownerDocument.head.appendChild(key));
    }
    function getScriptKey(src) {
      return '[src="' + escapeSelectorAttributeValueInsideDoubleQuotes(src) + '"]';
    }
    function getScriptSelectorFromKey(key) {
      return "script[async]" + key;
    }
    function acquireResource(hoistableRoot, resource, props) {
      resource.count++;
      if (null === resource.instance)
        switch (resource.type) {
          case "style":
            var instance = hoistableRoot.querySelector(
              'style[data-href~="' + escapeSelectorAttributeValueInsideDoubleQuotes(props.href) + '"]'
            );
            if (instance)
              return resource.instance = instance, markNodeAsHoistable(instance), instance;
            var styleProps = assign({}, props, {
              "data-href": props.href,
              "data-precedence": props.precedence,
              href: null,
              precedence: null
            });
            instance = (hoistableRoot.ownerDocument || hoistableRoot).createElement(
              "style"
            );
            markNodeAsHoistable(instance);
            setInitialProperties(instance, "style", styleProps);
            insertStylesheet(instance, props.precedence, hoistableRoot);
            return resource.instance = instance;
          case "stylesheet":
            styleProps = getStyleKey(props.href);
            var instance$249 = hoistableRoot.querySelector(
              getStylesheetSelectorFromKey(styleProps)
            );
            if (instance$249)
              return resource.state.loading |= 4, resource.instance = instance$249, markNodeAsHoistable(instance$249), instance$249;
            instance = stylesheetPropsFromRawProps(props);
            (styleProps = preloadPropsMap.get(styleProps)) && adoptPreloadPropsForStylesheet(instance, styleProps);
            instance$249 = (hoistableRoot.ownerDocument || hoistableRoot).createElement("link");
            markNodeAsHoistable(instance$249);
            var linkInstance = instance$249;
            linkInstance._p = new Promise(function(resolve, reject) {
              linkInstance.onload = resolve;
              linkInstance.onerror = reject;
            });
            setInitialProperties(instance$249, "link", instance);
            resource.state.loading |= 4;
            insertStylesheet(instance$249, props.precedence, hoistableRoot);
            return resource.instance = instance$249;
          case "script":
            instance$249 = getScriptKey(props.src);
            if (styleProps = hoistableRoot.querySelector(
              getScriptSelectorFromKey(instance$249)
            ))
              return resource.instance = styleProps, markNodeAsHoistable(styleProps), styleProps;
            instance = props;
            if (styleProps = preloadPropsMap.get(instance$249))
              instance = assign({}, props), adoptPreloadPropsForScript(instance, styleProps);
            hoistableRoot = hoistableRoot.ownerDocument || hoistableRoot;
            styleProps = hoistableRoot.createElement("script");
            markNodeAsHoistable(styleProps);
            setInitialProperties(styleProps, "link", instance);
            hoistableRoot.head.appendChild(styleProps);
            return resource.instance = styleProps;
          case "void":
            return null;
          default:
            throw Error(formatProdErrorMessage(443, resource.type));
        }
      else
        "stylesheet" === resource.type && 0 === (resource.state.loading & 4) && (instance = resource.instance, resource.state.loading |= 4, insertStylesheet(instance, props.precedence, hoistableRoot));
      return resource.instance;
    }
    function insertStylesheet(instance, precedence, root2) {
      for (var nodes = root2.querySelectorAll(
        'link[rel="stylesheet"][data-precedence],style[data-precedence]'
      ), last = nodes.length ? nodes[nodes.length - 1] : null, prior = last, i = 0; i < nodes.length; i++) {
        var node = nodes[i];
        if (node.dataset.precedence === precedence) prior = node;
        else if (prior !== last) break;
      }
      prior ? prior.parentNode.insertBefore(instance, prior.nextSibling) : (precedence = 9 === root2.nodeType ? root2.head : root2, precedence.insertBefore(instance, precedence.firstChild));
    }
    function adoptPreloadPropsForStylesheet(stylesheetProps, preloadProps) {
      null == stylesheetProps.crossOrigin && (stylesheetProps.crossOrigin = preloadProps.crossOrigin);
      null == stylesheetProps.referrerPolicy && (stylesheetProps.referrerPolicy = preloadProps.referrerPolicy);
      null == stylesheetProps.title && (stylesheetProps.title = preloadProps.title);
    }
    function adoptPreloadPropsForScript(scriptProps, preloadProps) {
      null == scriptProps.crossOrigin && (scriptProps.crossOrigin = preloadProps.crossOrigin);
      null == scriptProps.referrerPolicy && (scriptProps.referrerPolicy = preloadProps.referrerPolicy);
      null == scriptProps.integrity && (scriptProps.integrity = preloadProps.integrity);
    }
    var tagCaches = null;
    function getHydratableHoistableCache(type, keyAttribute, ownerDocument) {
      if (null === tagCaches) {
        var cache = new Map();
        var caches = tagCaches = new Map();
        caches.set(ownerDocument, cache);
      } else
        caches = tagCaches, cache = caches.get(ownerDocument), cache || (cache = new Map(), caches.set(ownerDocument, cache));
      if (cache.has(type)) return cache;
      cache.set(type, null);
      ownerDocument = ownerDocument.getElementsByTagName(type);
      for (caches = 0; caches < ownerDocument.length; caches++) {
        var node = ownerDocument[caches];
        if (!(node[internalHoistableMarker] || node[internalInstanceKey] || "link" === type && "stylesheet" === node.getAttribute("rel")) && "http://www.w3.org/2000/svg" !== node.namespaceURI) {
          var nodeKey = node.getAttribute(keyAttribute) || "";
          nodeKey = type + nodeKey;
          var existing = cache.get(nodeKey);
          existing ? existing.push(node) : cache.set(nodeKey, [node]);
        }
      }
      return cache;
    }
    function mountHoistable(hoistableRoot, type, instance) {
      hoistableRoot = hoistableRoot.ownerDocument || hoistableRoot;
      hoistableRoot.head.insertBefore(
        instance,
        "title" === type ? hoistableRoot.querySelector("head > title") : null
      );
    }
    function isHostHoistableType(type, props, hostContext) {
      if (1 === hostContext || null != props.itemProp) return false;
      switch (type) {
        case "meta":
        case "title":
          return true;
        case "style":
          if ("string" !== typeof props.precedence || "string" !== typeof props.href || "" === props.href)
            break;
          return true;
        case "link":
          if ("string" !== typeof props.rel || "string" !== typeof props.href || "" === props.href || props.onLoad || props.onError)
            break;
          switch (props.rel) {
            case "stylesheet":
              return type = props.disabled, "string" === typeof props.precedence && null == type;
            default:
              return true;
          }
        case "script":
          if (props.async && "function" !== typeof props.async && "symbol" !== typeof props.async && !props.onLoad && !props.onError && props.src && "string" === typeof props.src)
            return true;
      }
      return false;
    }
    function preloadResource(resource) {
      return "stylesheet" === resource.type && 0 === (resource.state.loading & 3) ? false : true;
    }
    function suspendResource(state, hoistableRoot, resource, props) {
      if ("stylesheet" === resource.type && ("string" !== typeof props.media || false !== matchMedia(props.media).matches) && 0 === (resource.state.loading & 4)) {
        if (null === resource.instance) {
          var key = getStyleKey(props.href), instance = hoistableRoot.querySelector(
            getStylesheetSelectorFromKey(key)
          );
          if (instance) {
            hoistableRoot = instance._p;
            null !== hoistableRoot && "object" === typeof hoistableRoot && "function" === typeof hoistableRoot.then && (state.count++, state = onUnsuspend.bind(state), hoistableRoot.then(state, state));
            resource.state.loading |= 4;
            resource.instance = instance;
            markNodeAsHoistable(instance);
            return;
          }
          instance = hoistableRoot.ownerDocument || hoistableRoot;
          props = stylesheetPropsFromRawProps(props);
          (key = preloadPropsMap.get(key)) && adoptPreloadPropsForStylesheet(props, key);
          instance = instance.createElement("link");
          markNodeAsHoistable(instance);
          var linkInstance = instance;
          linkInstance._p = new Promise(function(resolve, reject) {
            linkInstance.onload = resolve;
            linkInstance.onerror = reject;
          });
          setInitialProperties(instance, "link", props);
          resource.instance = instance;
        }
        null === state.stylesheets && (state.stylesheets = new Map());
        state.stylesheets.set(resource, hoistableRoot);
        (hoistableRoot = resource.state.preload) && 0 === (resource.state.loading & 3) && (state.count++, resource = onUnsuspend.bind(state), hoistableRoot.addEventListener("load", resource), hoistableRoot.addEventListener("error", resource));
      }
    }
    var estimatedBytesWithinLimit = 0;
    function waitForCommitToBeReady(state, timeoutOffset) {
      state.stylesheets && 0 === state.count && insertSuspendedStylesheets(state, state.stylesheets);
      return 0 < state.count || 0 < state.imgCount ? function(commit) {
        var stylesheetTimer = setTimeout(function() {
          state.stylesheets && insertSuspendedStylesheets(state, state.stylesheets);
          if (state.unsuspend) {
            var unsuspend = state.unsuspend;
            state.unsuspend = null;
            unsuspend();
          }
        }, 6e4 + timeoutOffset);
        0 < state.imgBytes && 0 === estimatedBytesWithinLimit && (estimatedBytesWithinLimit = 62500 * estimateBandwidth());
        var imgTimer = setTimeout(
          function() {
            state.waitingForImages = false;
            if (0 === state.count && (state.stylesheets && insertSuspendedStylesheets(state, state.stylesheets), state.unsuspend)) {
              var unsuspend = state.unsuspend;
              state.unsuspend = null;
              unsuspend();
            }
          },
          (state.imgBytes > estimatedBytesWithinLimit ? 50 : 800) + timeoutOffset
        );
        state.unsuspend = commit;
        return function() {
          state.unsuspend = null;
          clearTimeout(stylesheetTimer);
          clearTimeout(imgTimer);
        };
      } : null;
    }
    function onUnsuspend() {
      this.count--;
      if (0 === this.count && (0 === this.imgCount || !this.waitingForImages)) {
        if (this.stylesheets) insertSuspendedStylesheets(this, this.stylesheets);
        else if (this.unsuspend) {
          var unsuspend = this.unsuspend;
          this.unsuspend = null;
          unsuspend();
        }
      }
    }
    var precedencesByRoot = null;
    function insertSuspendedStylesheets(state, resources) {
      state.stylesheets = null;
      null !== state.unsuspend && (state.count++, precedencesByRoot = new Map(), resources.forEach(insertStylesheetIntoRoot, state), precedencesByRoot = null, onUnsuspend.call(state));
    }
    function insertStylesheetIntoRoot(root2, resource) {
      if (!(resource.state.loading & 4)) {
        var precedences = precedencesByRoot.get(root2);
        if (precedences) var last = precedences.get(null);
        else {
          precedences = new Map();
          precedencesByRoot.set(root2, precedences);
          for (var nodes = root2.querySelectorAll(
            "link[data-precedence],style[data-precedence]"
          ), i = 0; i < nodes.length; i++) {
            var node = nodes[i];
            if ("LINK" === node.nodeName || "not all" !== node.getAttribute("media"))
              precedences.set(node.dataset.precedence, node), last = node;
          }
          last && precedences.set(null, last);
        }
        nodes = resource.instance;
        node = nodes.getAttribute("data-precedence");
        i = precedences.get(node) || last;
        i === last && precedences.set(null, nodes);
        precedences.set(node, nodes);
        this.count++;
        last = onUnsuspend.bind(this);
        nodes.addEventListener("load", last);
        nodes.addEventListener("error", last);
        i ? i.parentNode.insertBefore(nodes, i.nextSibling) : (root2 = 9 === root2.nodeType ? root2.head : root2, root2.insertBefore(nodes, root2.firstChild));
        resource.state.loading |= 4;
      }
    }
    var HostTransitionContext = {
      $$typeof: REACT_CONTEXT_TYPE,
      Provider: null,
      Consumer: null,
      _currentValue: sharedNotPendingObject,
      _currentValue2: sharedNotPendingObject,
      _threadCount: 0
    };
    function FiberRootNode(containerInfo, tag, hydrate, identifierPrefix, onUncaughtError, onCaughtError, onRecoverableError, onDefaultTransitionIndicator, formState) {
      this.tag = 1;
      this.containerInfo = containerInfo;
      this.pingCache = this.current = this.pendingChildren = null;
      this.timeoutHandle = -1;
      this.callbackNode = this.next = this.pendingContext = this.context = this.cancelPendingCommit = null;
      this.callbackPriority = 0;
      this.expirationTimes = createLaneMap(-1);
      this.entangledLanes = this.shellSuspendCounter = this.errorRecoveryDisabledLanes = this.expiredLanes = this.warmLanes = this.pingedLanes = this.suspendedLanes = this.pendingLanes = 0;
      this.entanglements = createLaneMap(0);
      this.hiddenUpdates = createLaneMap(null);
      this.identifierPrefix = identifierPrefix;
      this.onUncaughtError = onUncaughtError;
      this.onCaughtError = onCaughtError;
      this.onRecoverableError = onRecoverableError;
      this.pooledCache = null;
      this.pooledCacheLanes = 0;
      this.formState = formState;
      this.incompleteTransitions = new Map();
    }
    function createFiberRoot(containerInfo, tag, hydrate, initialChildren, hydrationCallbacks, isStrictMode, identifierPrefix, formState, onUncaughtError, onCaughtError, onRecoverableError, onDefaultTransitionIndicator) {
      containerInfo = new FiberRootNode(
        containerInfo,
        tag,
        hydrate,
        identifierPrefix,
        onUncaughtError,
        onCaughtError,
        onRecoverableError,
        onDefaultTransitionIndicator,
        formState
      );
      tag = 1;
      true === isStrictMode && (tag |= 24);
      isStrictMode = createFiberImplClass(3, null, null, tag);
      containerInfo.current = isStrictMode;
      isStrictMode.stateNode = containerInfo;
      tag = createCache();
      tag.refCount++;
      containerInfo.pooledCache = tag;
      tag.refCount++;
      isStrictMode.memoizedState = {
        element: initialChildren,
        isDehydrated: hydrate,
        cache: tag
      };
      initializeUpdateQueue(isStrictMode);
      return containerInfo;
    }
    function getContextForSubtree(parentComponent) {
      if (!parentComponent) return emptyContextObject;
      parentComponent = emptyContextObject;
      return parentComponent;
    }
    function updateContainerImpl(rootFiber, lane, element, container, parentComponent, callback) {
      parentComponent = getContextForSubtree(parentComponent);
      null === container.context ? container.context = parentComponent : container.pendingContext = parentComponent;
      container = createUpdate(lane);
      container.payload = { element };
      callback = void 0 === callback ? null : callback;
      null !== callback && (container.callback = callback);
      element = enqueueUpdate(rootFiber, container, lane);
      null !== element && (scheduleUpdateOnFiber(element, rootFiber, lane), entangleTransitions(element, rootFiber, lane));
    }
    function markRetryLaneImpl(fiber, retryLane) {
      fiber = fiber.memoizedState;
      if (null !== fiber && null !== fiber.dehydrated) {
        var a = fiber.retryLane;
        fiber.retryLane = 0 !== a && a < retryLane ? a : retryLane;
      }
    }
    function markRetryLaneIfNotHydrated(fiber, retryLane) {
      markRetryLaneImpl(fiber, retryLane);
      (fiber = fiber.alternate) && markRetryLaneImpl(fiber, retryLane);
    }
    function attemptContinuousHydration(fiber) {
      if (13 === fiber.tag || 31 === fiber.tag) {
        var root2 = enqueueConcurrentRenderForLane(fiber, 67108864);
        null !== root2 && scheduleUpdateOnFiber(root2, fiber, 67108864);
        markRetryLaneIfNotHydrated(fiber, 67108864);
      }
    }
    function attemptHydrationAtCurrentPriority(fiber) {
      if (13 === fiber.tag || 31 === fiber.tag) {
        var lane = requestUpdateLane();
        lane = getBumpedLaneForHydrationByLane(lane);
        var root2 = enqueueConcurrentRenderForLane(fiber, lane);
        null !== root2 && scheduleUpdateOnFiber(root2, fiber, lane);
        markRetryLaneIfNotHydrated(fiber, lane);
      }
    }
    var _enabled = true;
    function dispatchDiscreteEvent(domEventName, eventSystemFlags, container, nativeEvent) {
      var prevTransition = ReactSharedInternals.T;
      ReactSharedInternals.T = null;
      var previousPriority = ReactDOMSharedInternals.p;
      try {
        ReactDOMSharedInternals.p = 2, dispatchEvent2(domEventName, eventSystemFlags, container, nativeEvent);
      } finally {
        ReactDOMSharedInternals.p = previousPriority, ReactSharedInternals.T = prevTransition;
      }
    }
    function dispatchContinuousEvent(domEventName, eventSystemFlags, container, nativeEvent) {
      var prevTransition = ReactSharedInternals.T;
      ReactSharedInternals.T = null;
      var previousPriority = ReactDOMSharedInternals.p;
      try {
        ReactDOMSharedInternals.p = 8, dispatchEvent2(domEventName, eventSystemFlags, container, nativeEvent);
      } finally {
        ReactDOMSharedInternals.p = previousPriority, ReactSharedInternals.T = prevTransition;
      }
    }
    function dispatchEvent2(domEventName, eventSystemFlags, targetContainer, nativeEvent) {
      if (_enabled) {
        var blockedOn = findInstanceBlockingEvent(nativeEvent);
        if (null === blockedOn)
          dispatchEventForPluginEventSystem(
            domEventName,
            eventSystemFlags,
            nativeEvent,
            return_targetInst,
            targetContainer
          ), clearIfContinuousEvent(domEventName, nativeEvent);
        else if (queueIfContinuousEvent(
          blockedOn,
          domEventName,
          eventSystemFlags,
          targetContainer,
          nativeEvent
        ))
          nativeEvent.stopPropagation();
        else if (clearIfContinuousEvent(domEventName, nativeEvent), eventSystemFlags & 4 && -1 < discreteReplayableEvents.indexOf(domEventName)) {
          for (; null !== blockedOn; ) {
            var fiber = getInstanceFromNode(blockedOn);
            if (null !== fiber)
              switch (fiber.tag) {
                case 3:
                  fiber = fiber.stateNode;
                  if (fiber.current.memoizedState.isDehydrated) {
                    var lanes = getHighestPriorityLanes(fiber.pendingLanes);
                    if (0 !== lanes) {
                      var root2 = fiber;
                      root2.pendingLanes |= 2;
                      for (root2.entangledLanes |= 2; lanes; ) {
                        var lane = 1 << 31 - clz32(lanes);
                        root2.entanglements[1] |= lane;
                        lanes &= ~lane;
                      }
                      ensureRootIsScheduled(fiber);
                      0 === (executionContext & 6) && (workInProgressRootRenderTargetTime = now() + 500, flushSyncWorkAcrossRoots_impl(0));
                    }
                  }
                  break;
                case 31:
                case 13:
                  root2 = enqueueConcurrentRenderForLane(fiber, 2), null !== root2 && scheduleUpdateOnFiber(root2, fiber, 2), flushSyncWork$1(), markRetryLaneIfNotHydrated(fiber, 2);
              }
            fiber = findInstanceBlockingEvent(nativeEvent);
            null === fiber && dispatchEventForPluginEventSystem(
              domEventName,
              eventSystemFlags,
              nativeEvent,
              return_targetInst,
              targetContainer
            );
            if (fiber === blockedOn) break;
            blockedOn = fiber;
          }
          null !== blockedOn && nativeEvent.stopPropagation();
        } else
          dispatchEventForPluginEventSystem(
            domEventName,
            eventSystemFlags,
            nativeEvent,
            null,
            targetContainer
          );
      }
    }
    function findInstanceBlockingEvent(nativeEvent) {
      nativeEvent = getEventTarget(nativeEvent);
      return findInstanceBlockingTarget(nativeEvent);
    }
    var return_targetInst = null;
    function findInstanceBlockingTarget(targetNode) {
      return_targetInst = null;
      targetNode = getClosestInstanceFromNode(targetNode);
      if (null !== targetNode) {
        var nearestMounted = getNearestMountedFiber(targetNode);
        if (null === nearestMounted) targetNode = null;
        else {
          var tag = nearestMounted.tag;
          if (13 === tag) {
            targetNode = getSuspenseInstanceFromFiber(nearestMounted);
            if (null !== targetNode) return targetNode;
            targetNode = null;
          } else if (31 === tag) {
            targetNode = getActivityInstanceFromFiber(nearestMounted);
            if (null !== targetNode) return targetNode;
            targetNode = null;
          } else if (3 === tag) {
            if (nearestMounted.stateNode.current.memoizedState.isDehydrated)
              return 3 === nearestMounted.tag ? nearestMounted.stateNode.containerInfo : null;
            targetNode = null;
          } else nearestMounted !== targetNode && (targetNode = null);
        }
      }
      return_targetInst = targetNode;
      return null;
    }
    function getEventPriority(domEventName) {
      switch (domEventName) {
        case "beforetoggle":
        case "cancel":
        case "click":
        case "close":
        case "contextmenu":
        case "copy":
        case "cut":
        case "auxclick":
        case "dblclick":
        case "dragend":
        case "dragstart":
        case "drop":
        case "focusin":
        case "focusout":
        case "input":
        case "invalid":
        case "keydown":
        case "keypress":
        case "keyup":
        case "mousedown":
        case "mouseup":
        case "paste":
        case "pause":
        case "play":
        case "pointercancel":
        case "pointerdown":
        case "pointerup":
        case "ratechange":
        case "reset":
        case "resize":
        case "seeked":
        case "submit":
        case "toggle":
        case "touchcancel":
        case "touchend":
        case "touchstart":
        case "volumechange":
        case "change":
        case "selectionchange":
        case "textInput":
        case "compositionstart":
        case "compositionend":
        case "compositionupdate":
        case "beforeblur":
        case "afterblur":
        case "beforeinput":
        case "blur":
        case "fullscreenchange":
        case "focus":
        case "hashchange":
        case "popstate":
        case "select":
        case "selectstart":
          return 2;
        case "drag":
        case "dragenter":
        case "dragexit":
        case "dragleave":
        case "dragover":
        case "mousemove":
        case "mouseout":
        case "mouseover":
        case "pointermove":
        case "pointerout":
        case "pointerover":
        case "scroll":
        case "touchmove":
        case "wheel":
        case "mouseenter":
        case "mouseleave":
        case "pointerenter":
        case "pointerleave":
          return 8;
        case "message":
          switch (getCurrentPriorityLevel()) {
            case ImmediatePriority:
              return 2;
            case UserBlockingPriority:
              return 8;
            case NormalPriority$1:
            case LowPriority:
              return 32;
            case IdlePriority:
              return 268435456;
            default:
              return 32;
          }
        default:
          return 32;
      }
    }
    var hasScheduledReplayAttempt = false, queuedFocus = null, queuedDrag = null, queuedMouse = null, queuedPointers = new Map(), queuedPointerCaptures = new Map(), queuedExplicitHydrationTargets = [], discreteReplayableEvents = "mousedown mouseup touchcancel touchend touchstart auxclick dblclick pointercancel pointerdown pointerup dragend dragstart drop compositionend compositionstart keydown keypress keyup input textInput copy cut paste click change contextmenu reset".split(
      " "
    );
    function clearIfContinuousEvent(domEventName, nativeEvent) {
      switch (domEventName) {
        case "focusin":
        case "focusout":
          queuedFocus = null;
          break;
        case "dragenter":
        case "dragleave":
          queuedDrag = null;
          break;
        case "mouseover":
        case "mouseout":
          queuedMouse = null;
          break;
        case "pointerover":
        case "pointerout":
          queuedPointers.delete(nativeEvent.pointerId);
          break;
        case "gotpointercapture":
        case "lostpointercapture":
          queuedPointerCaptures.delete(nativeEvent.pointerId);
      }
    }
    function accumulateOrCreateContinuousQueuedReplayableEvent(existingQueuedEvent, blockedOn, domEventName, eventSystemFlags, targetContainer, nativeEvent) {
      if (null === existingQueuedEvent || existingQueuedEvent.nativeEvent !== nativeEvent)
        return existingQueuedEvent = {
          blockedOn,
          domEventName,
          eventSystemFlags,
          nativeEvent,
          targetContainers: [targetContainer]
        }, null !== blockedOn && (blockedOn = getInstanceFromNode(blockedOn), null !== blockedOn && attemptContinuousHydration(blockedOn)), existingQueuedEvent;
      existingQueuedEvent.eventSystemFlags |= eventSystemFlags;
      blockedOn = existingQueuedEvent.targetContainers;
      null !== targetContainer && -1 === blockedOn.indexOf(targetContainer) && blockedOn.push(targetContainer);
      return existingQueuedEvent;
    }
    function queueIfContinuousEvent(blockedOn, domEventName, eventSystemFlags, targetContainer, nativeEvent) {
      switch (domEventName) {
        case "focusin":
          return queuedFocus = accumulateOrCreateContinuousQueuedReplayableEvent(
            queuedFocus,
            blockedOn,
            domEventName,
            eventSystemFlags,
            targetContainer,
            nativeEvent
          ), true;
        case "dragenter":
          return queuedDrag = accumulateOrCreateContinuousQueuedReplayableEvent(
            queuedDrag,
            blockedOn,
            domEventName,
            eventSystemFlags,
            targetContainer,
            nativeEvent
          ), true;
        case "mouseover":
          return queuedMouse = accumulateOrCreateContinuousQueuedReplayableEvent(
            queuedMouse,
            blockedOn,
            domEventName,
            eventSystemFlags,
            targetContainer,
            nativeEvent
          ), true;
        case "pointerover":
          var pointerId = nativeEvent.pointerId;
          queuedPointers.set(
            pointerId,
            accumulateOrCreateContinuousQueuedReplayableEvent(
              queuedPointers.get(pointerId) || null,
              blockedOn,
              domEventName,
              eventSystemFlags,
              targetContainer,
              nativeEvent
            )
          );
          return true;
        case "gotpointercapture":
          return pointerId = nativeEvent.pointerId, queuedPointerCaptures.set(
            pointerId,
            accumulateOrCreateContinuousQueuedReplayableEvent(
              queuedPointerCaptures.get(pointerId) || null,
              blockedOn,
              domEventName,
              eventSystemFlags,
              targetContainer,
              nativeEvent
            )
          ), true;
      }
      return false;
    }
    function attemptExplicitHydrationTarget(queuedTarget) {
      var targetInst = getClosestInstanceFromNode(queuedTarget.target);
      if (null !== targetInst) {
        var nearestMounted = getNearestMountedFiber(targetInst);
        if (null !== nearestMounted) {
          if (targetInst = nearestMounted.tag, 13 === targetInst) {
            if (targetInst = getSuspenseInstanceFromFiber(nearestMounted), null !== targetInst) {
              queuedTarget.blockedOn = targetInst;
              runWithPriority(queuedTarget.priority, function() {
                attemptHydrationAtCurrentPriority(nearestMounted);
              });
              return;
            }
          } else if (31 === targetInst) {
            if (targetInst = getActivityInstanceFromFiber(nearestMounted), null !== targetInst) {
              queuedTarget.blockedOn = targetInst;
              runWithPriority(queuedTarget.priority, function() {
                attemptHydrationAtCurrentPriority(nearestMounted);
              });
              return;
            }
          } else if (3 === targetInst && nearestMounted.stateNode.current.memoizedState.isDehydrated) {
            queuedTarget.blockedOn = 3 === nearestMounted.tag ? nearestMounted.stateNode.containerInfo : null;
            return;
          }
        }
      }
      queuedTarget.blockedOn = null;
    }
    function attemptReplayContinuousQueuedEvent(queuedEvent) {
      if (null !== queuedEvent.blockedOn) return false;
      for (var targetContainers = queuedEvent.targetContainers; 0 < targetContainers.length; ) {
        var nextBlockedOn = findInstanceBlockingEvent(queuedEvent.nativeEvent);
        if (null === nextBlockedOn) {
          nextBlockedOn = queuedEvent.nativeEvent;
          var nativeEventClone = new nextBlockedOn.constructor(
            nextBlockedOn.type,
            nextBlockedOn
          );
          currentReplayingEvent = nativeEventClone;
          nextBlockedOn.target.dispatchEvent(nativeEventClone);
          currentReplayingEvent = null;
        } else
          return targetContainers = getInstanceFromNode(nextBlockedOn), null !== targetContainers && attemptContinuousHydration(targetContainers), queuedEvent.blockedOn = nextBlockedOn, false;
        targetContainers.shift();
      }
      return true;
    }
    function attemptReplayContinuousQueuedEventInMap(queuedEvent, key, map) {
      attemptReplayContinuousQueuedEvent(queuedEvent) && map.delete(key);
    }
    function replayUnblockedEvents() {
      hasScheduledReplayAttempt = false;
      null !== queuedFocus && attemptReplayContinuousQueuedEvent(queuedFocus) && (queuedFocus = null);
      null !== queuedDrag && attemptReplayContinuousQueuedEvent(queuedDrag) && (queuedDrag = null);
      null !== queuedMouse && attemptReplayContinuousQueuedEvent(queuedMouse) && (queuedMouse = null);
      queuedPointers.forEach(attemptReplayContinuousQueuedEventInMap);
      queuedPointerCaptures.forEach(attemptReplayContinuousQueuedEventInMap);
    }
    function scheduleCallbackIfUnblocked(queuedEvent, unblocked) {
      queuedEvent.blockedOn === unblocked && (queuedEvent.blockedOn = null, hasScheduledReplayAttempt || (hasScheduledReplayAttempt = true, Scheduler.unstable_scheduleCallback(
        Scheduler.unstable_NormalPriority,
        replayUnblockedEvents
      )));
    }
    var lastScheduledReplayQueue = null;
    function scheduleReplayQueueIfNeeded(formReplayingQueue) {
      lastScheduledReplayQueue !== formReplayingQueue && (lastScheduledReplayQueue = formReplayingQueue, Scheduler.unstable_scheduleCallback(
        Scheduler.unstable_NormalPriority,
        function() {
          lastScheduledReplayQueue === formReplayingQueue && (lastScheduledReplayQueue = null);
          for (var i = 0; i < formReplayingQueue.length; i += 3) {
            var form = formReplayingQueue[i], submitterOrAction = formReplayingQueue[i + 1], formData = formReplayingQueue[i + 2];
            if ("function" !== typeof submitterOrAction)
              if (null === findInstanceBlockingTarget(submitterOrAction || form))
                continue;
              else break;
            var formInst = getInstanceFromNode(form);
            null !== formInst && (formReplayingQueue.splice(i, 3), i -= 3, startHostTransition(
              formInst,
              {
                pending: true,
                data: formData,
                method: form.method,
                action: submitterOrAction
              },
              submitterOrAction,
              formData
            ));
          }
        }
      ));
    }
    function retryIfBlockedOn(unblocked) {
      function unblock(queuedEvent) {
        return scheduleCallbackIfUnblocked(queuedEvent, unblocked);
      }
      null !== queuedFocus && scheduleCallbackIfUnblocked(queuedFocus, unblocked);
      null !== queuedDrag && scheduleCallbackIfUnblocked(queuedDrag, unblocked);
      null !== queuedMouse && scheduleCallbackIfUnblocked(queuedMouse, unblocked);
      queuedPointers.forEach(unblock);
      queuedPointerCaptures.forEach(unblock);
      for (var i = 0; i < queuedExplicitHydrationTargets.length; i++) {
        var queuedTarget = queuedExplicitHydrationTargets[i];
        queuedTarget.blockedOn === unblocked && (queuedTarget.blockedOn = null);
      }
      for (; 0 < queuedExplicitHydrationTargets.length && (i = queuedExplicitHydrationTargets[0], null === i.blockedOn); )
        attemptExplicitHydrationTarget(i), null === i.blockedOn && queuedExplicitHydrationTargets.shift();
      i = (unblocked.ownerDocument || unblocked).$$reactFormReplay;
      if (null != i)
        for (queuedTarget = 0; queuedTarget < i.length; queuedTarget += 3) {
          var form = i[queuedTarget], submitterOrAction = i[queuedTarget + 1], formProps = form[internalPropsKey] || null;
          if ("function" === typeof submitterOrAction)
            formProps || scheduleReplayQueueIfNeeded(i);
          else if (formProps) {
            var action = null;
            if (submitterOrAction && submitterOrAction.hasAttribute("formAction"))
              if (form = submitterOrAction, formProps = submitterOrAction[internalPropsKey] || null)
                action = formProps.formAction;
              else {
                if (null !== findInstanceBlockingTarget(form)) continue;
              }
            else action = formProps.action;
            "function" === typeof action ? i[queuedTarget + 1] = action : (i.splice(queuedTarget, 3), queuedTarget -= 3);
            scheduleReplayQueueIfNeeded(i);
          }
        }
    }
    function defaultOnDefaultTransitionIndicator() {
      function handleNavigate(event) {
        event.canIntercept && "react-transition" === event.info && event.intercept({
          handler: function() {
            return new Promise(function(resolve) {
              return pendingResolve = resolve;
            });
          },
          focusReset: "manual",
          scroll: "manual"
        });
      }
      function handleNavigateComplete() {
        null !== pendingResolve && (pendingResolve(), pendingResolve = null);
        isCancelled || setTimeout(startFakeNavigation, 20);
      }
      function startFakeNavigation() {
        if (!isCancelled && !navigation.transition) {
          var currentEntry = navigation.currentEntry;
          currentEntry && null != currentEntry.url && navigation.navigate(currentEntry.url, {
            state: currentEntry.getState(),
            info: "react-transition",
            history: "replace"
          });
        }
      }
      if ("object" === typeof navigation) {
        var isCancelled = false, pendingResolve = null;
        navigation.addEventListener("navigate", handleNavigate);
        navigation.addEventListener("navigatesuccess", handleNavigateComplete);
        navigation.addEventListener("navigateerror", handleNavigateComplete);
        setTimeout(startFakeNavigation, 100);
        return function() {
          isCancelled = true;
          navigation.removeEventListener("navigate", handleNavigate);
          navigation.removeEventListener("navigatesuccess", handleNavigateComplete);
          navigation.removeEventListener("navigateerror", handleNavigateComplete);
          null !== pendingResolve && (pendingResolve(), pendingResolve = null);
        };
      }
    }
    function ReactDOMRoot(internalRoot) {
      this._internalRoot = internalRoot;
    }
    ReactDOMHydrationRoot.prototype.render = ReactDOMRoot.prototype.render = function(children) {
      var root2 = this._internalRoot;
      if (null === root2) throw Error(formatProdErrorMessage(409));
      var current = root2.current, lane = requestUpdateLane();
      updateContainerImpl(current, lane, children, root2, null, null);
    };
    ReactDOMHydrationRoot.prototype.unmount = ReactDOMRoot.prototype.unmount = function() {
      var root2 = this._internalRoot;
      if (null !== root2) {
        this._internalRoot = null;
        var container = root2.containerInfo;
        updateContainerImpl(root2.current, 2, null, root2, null, null);
        flushSyncWork$1();
        container[internalContainerInstanceKey] = null;
      }
    };
    function ReactDOMHydrationRoot(internalRoot) {
      this._internalRoot = internalRoot;
    }
    ReactDOMHydrationRoot.prototype.unstable_scheduleHydration = function(target) {
      if (target) {
        var updatePriority = resolveUpdatePriority();
        target = { blockedOn: null, target, priority: updatePriority };
        for (var i = 0; i < queuedExplicitHydrationTargets.length && 0 !== updatePriority && updatePriority < queuedExplicitHydrationTargets[i].priority; i++) ;
        queuedExplicitHydrationTargets.splice(i, 0, target);
        0 === i && attemptExplicitHydrationTarget(target);
      }
    };
    var isomorphicReactPackageVersion$jscomp$inline_1840 = React2.version;
    if ("19.2.3" !== isomorphicReactPackageVersion$jscomp$inline_1840)
      throw Error(
        formatProdErrorMessage(
          527,
          isomorphicReactPackageVersion$jscomp$inline_1840,
          "19.2.3"
        )
      );
    ReactDOMSharedInternals.findDOMNode = function(componentOrElement) {
      var fiber = componentOrElement._reactInternals;
      if (void 0 === fiber) {
        if ("function" === typeof componentOrElement.render)
          throw Error(formatProdErrorMessage(188));
        componentOrElement = Object.keys(componentOrElement).join(",");
        throw Error(formatProdErrorMessage(268, componentOrElement));
      }
      componentOrElement = findCurrentFiberUsingSlowPath(fiber);
      componentOrElement = null !== componentOrElement ? findCurrentHostFiberImpl(componentOrElement) : null;
      componentOrElement = null === componentOrElement ? null : componentOrElement.stateNode;
      return componentOrElement;
    };
    var internals$jscomp$inline_2347 = {
      bundleType: 0,
      version: "19.2.3",
      rendererPackageName: "react-dom",
      currentDispatcherRef: ReactSharedInternals,
      reconcilerVersion: "19.2.3"
    };
    if ("undefined" !== typeof __REACT_DEVTOOLS_GLOBAL_HOOK__) {
      var hook$jscomp$inline_2348 = __REACT_DEVTOOLS_GLOBAL_HOOK__;
      if (!hook$jscomp$inline_2348.isDisabled && hook$jscomp$inline_2348.supportsFiber)
        try {
          rendererID = hook$jscomp$inline_2348.inject(
            internals$jscomp$inline_2347
          ), injectedHook = hook$jscomp$inline_2348;
        } catch (err) {
        }
    }
    reactDomClient_production.createRoot = function(container, options2) {
      if (!isValidContainer(container)) throw Error(formatProdErrorMessage(299));
      var isStrictMode = false, identifierPrefix = "", onUncaughtError = defaultOnUncaughtError, onCaughtError = defaultOnCaughtError, onRecoverableError = defaultOnRecoverableError;
      null !== options2 && void 0 !== options2 && (true === options2.unstable_strictMode && (isStrictMode = true), void 0 !== options2.identifierPrefix && (identifierPrefix = options2.identifierPrefix), void 0 !== options2.onUncaughtError && (onUncaughtError = options2.onUncaughtError), void 0 !== options2.onCaughtError && (onCaughtError = options2.onCaughtError), void 0 !== options2.onRecoverableError && (onRecoverableError = options2.onRecoverableError));
      options2 = createFiberRoot(
        container,
        1,
        false,
        null,
        null,
        isStrictMode,
        identifierPrefix,
        null,
        onUncaughtError,
        onCaughtError,
        onRecoverableError,
        defaultOnDefaultTransitionIndicator
      );
      container[internalContainerInstanceKey] = options2.current;
      listenToAllSupportedEvents(container);
      return new ReactDOMRoot(options2);
    };
    reactDomClient_production.hydrateRoot = function(container, initialChildren, options2) {
      if (!isValidContainer(container)) throw Error(formatProdErrorMessage(299));
      var isStrictMode = false, identifierPrefix = "", onUncaughtError = defaultOnUncaughtError, onCaughtError = defaultOnCaughtError, onRecoverableError = defaultOnRecoverableError, formState = null;
      null !== options2 && void 0 !== options2 && (true === options2.unstable_strictMode && (isStrictMode = true), void 0 !== options2.identifierPrefix && (identifierPrefix = options2.identifierPrefix), void 0 !== options2.onUncaughtError && (onUncaughtError = options2.onUncaughtError), void 0 !== options2.onCaughtError && (onCaughtError = options2.onCaughtError), void 0 !== options2.onRecoverableError && (onRecoverableError = options2.onRecoverableError), void 0 !== options2.formState && (formState = options2.formState));
      initialChildren = createFiberRoot(
        container,
        1,
        true,
        initialChildren,
        null != options2 ? options2 : null,
        isStrictMode,
        identifierPrefix,
        formState,
        onUncaughtError,
        onCaughtError,
        onRecoverableError,
        defaultOnDefaultTransitionIndicator
      );
      initialChildren.context = getContextForSubtree(null);
      options2 = initialChildren.current;
      isStrictMode = requestUpdateLane();
      isStrictMode = getBumpedLaneForHydrationByLane(isStrictMode);
      identifierPrefix = createUpdate(isStrictMode);
      identifierPrefix.callback = null;
      enqueueUpdate(options2, identifierPrefix, isStrictMode);
      options2 = isStrictMode;
      initialChildren.current.lanes = options2;
      markRootUpdated$1(initialChildren, options2);
      ensureRootIsScheduled(initialChildren);
      container[internalContainerInstanceKey] = initialChildren.current;
      listenToAllSupportedEvents(container);
      return new ReactDOMHydrationRoot(initialChildren);
    };
    reactDomClient_production.version = "19.2.3";
    return reactDomClient_production;
  }
  var hasRequiredClient;
  function requireClient() {
    if (hasRequiredClient) return client.exports;
    hasRequiredClient = 1;
    function checkDCE() {
      if (typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ === "undefined" || typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE !== "function") {
        return;
      }
      try {
        __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE(checkDCE);
      } catch (err) {
        console.error(err);
      }
    }
    {
      checkDCE();
      client.exports = requireReactDomClient_production();
    }
    return client.exports;
  }
  var clientExports = requireClient();
  const ReactDOM = getDefaultExportFromCjs(clientExports);
  const createStoreImpl = (createState) => {
    let state;
    const listeners = new Set();
    const setState = (partial, replace) => {
      const nextState = typeof partial === "function" ? partial(state) : partial;
      if (!Object.is(nextState, state)) {
        const previousState = state;
        state = (replace != null ? replace : typeof nextState !== "object" || nextState === null) ? nextState : Object.assign({}, state, nextState);
        listeners.forEach((listener) => listener(state, previousState));
      }
    };
    const getState = () => state;
    const getInitialState = () => initialState;
    const subscribe = (listener) => {
      listeners.add(listener);
      return () => listeners.delete(listener);
    };
    const api = { setState, getState, getInitialState, subscribe };
    const initialState = state = createState(setState, getState, api);
    return api;
  };
  const createStore = ((createState) => createState ? createStoreImpl(createState) : createStoreImpl);
  const identity = (arg) => arg;
  function useStore(api, selector = identity) {
    const slice = React.useSyncExternalStore(
      api.subscribe,
      React.useCallback(() => selector(api.getState()), [api, selector]),
      React.useCallback(() => selector(api.getInitialState()), [api, selector])
    );
    React.useDebugValue(slice);
    return slice;
  }
  const createImpl = (createState) => {
    const api = createStore(createState);
    const useBoundStore = (selector) => useStore(api, selector);
    Object.assign(useBoundStore, api);
    return useBoundStore;
  };
  const create = ((createState) => createState ? createImpl(createState) : createImpl);
  const useElementStore = create((set, get) => ({
    pickers: [],
    thumbnailWraps: [],
    setArcaconPicker: (_pickers) => set({ pickers: _pickers }),
    setThumbnailWraps: (_thumbnailWraps) => set({ thumbnailWraps: _thumbnailWraps })
  }));
  const FAVORITE_PACKAGE_ID = "-1";
  const SERACH_PACKAGE_ID = "-2";
  const STORAGE_ARCACON_DATA = "arcacon-data";
  const STORAGE_FAVORITE_DATA = "arcacon-favorites";
  const STORAGE_MEMO_DATA = "arcacon-memos";
  var dexie_min$1 = { exports: {} };
  var dexie_min = dexie_min$1.exports;
  var hasRequiredDexie_min;
  function requireDexie_min() {
    if (hasRequiredDexie_min) return dexie_min$1.exports;
    hasRequiredDexie_min = 1;
    (function(module, exports$1) {
      (function(e, t) {
        module.exports = t();
      })(dexie_min, function() {
        var s = function(e2, t2) {
          return (s = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function(e3, t3) {
            e3.__proto__ = t3;
          } || function(e3, t3) {
            for (var n2 in t3) Object.prototype.hasOwnProperty.call(t3, n2) && (e3[n2] = t3[n2]);
          })(e2, t2);
        };
        var _ = function() {
          return (_ = Object.assign || function(e2) {
            for (var t2, n2 = 1, r2 = arguments.length; n2 < r2; n2++) for (var i2 in t2 = arguments[n2]) Object.prototype.hasOwnProperty.call(t2, i2) && (e2[i2] = t2[i2]);
            return e2;
          }).apply(this, arguments);
        };
        function i(e2, t2, n2) {
          for (var r2, i2 = 0, o2 = t2.length; i2 < o2; i2++) !r2 && i2 in t2 || ((r2 = r2 || Array.prototype.slice.call(t2, 0, i2))[i2] = t2[i2]);
          return e2.concat(r2 || Array.prototype.slice.call(t2));
        }
        var f = "undefined" != typeof globalThis ? globalThis : "undefined" != typeof self ? self : "undefined" != typeof window ? window : commonjsGlobal, O = Object.keys, x = Array.isArray;
        function a(t2, n2) {
          return "object" != typeof n2 || O(n2).forEach(function(e2) {
            t2[e2] = n2[e2];
          }), t2;
        }
        "undefined" == typeof Promise || f.Promise || (f.Promise = Promise);
        var c = Object.getPrototypeOf, n = {}.hasOwnProperty;
        function m(e2, t2) {
          return n.call(e2, t2);
        }
        function r(t2, n2) {
          "function" == typeof n2 && (n2 = n2(c(t2))), ("undefined" == typeof Reflect ? O : Reflect.ownKeys)(n2).forEach(function(e2) {
            l(t2, e2, n2[e2]);
          });
        }
        var u = Object.defineProperty;
        function l(e2, t2, n2, r2) {
          u(e2, t2, a(n2 && m(n2, "get") && "function" == typeof n2.get ? { get: n2.get, set: n2.set, configurable: true } : { value: n2, configurable: true, writable: true }, r2));
        }
        function o(t2) {
          return { from: function(e2) {
            return t2.prototype = Object.create(e2.prototype), l(t2.prototype, "constructor", t2), { extend: r.bind(null, t2.prototype) };
          } };
        }
        var h = Object.getOwnPropertyDescriptor;
        var d = [].slice;
        function b(e2, t2, n2) {
          return d.call(e2, t2, n2);
        }
        function p(e2, t2) {
          return t2(e2);
        }
        function y(e2) {
          if (!e2) throw new Error("Assertion Failed");
        }
        function v(e2) {
          f.setImmediate ? setImmediate(e2) : setTimeout(e2, 0);
        }
        function g(e2, t2) {
          if ("string" == typeof t2 && m(e2, t2)) return e2[t2];
          if (!t2) return e2;
          if ("string" != typeof t2) {
            for (var n2 = [], r2 = 0, i2 = t2.length; r2 < i2; ++r2) {
              var o2 = g(e2, t2[r2]);
              n2.push(o2);
            }
            return n2;
          }
          var a2 = t2.indexOf(".");
          if (-1 !== a2) {
            var u2 = e2[t2.substr(0, a2)];
            return null == u2 ? void 0 : g(u2, t2.substr(a2 + 1));
          }
        }
        function w(e2, t2, n2) {
          if (e2 && void 0 !== t2 && !("isFrozen" in Object && Object.isFrozen(e2))) if ("string" != typeof t2 && "length" in t2) {
            y("string" != typeof n2 && "length" in n2);
            for (var r2 = 0, i2 = t2.length; r2 < i2; ++r2) w(e2, t2[r2], n2[r2]);
          } else {
            var o2, a2, u2 = t2.indexOf(".");
            -1 !== u2 ? (o2 = t2.substr(0, u2), "" === (a2 = t2.substr(u2 + 1)) ? void 0 === n2 ? x(e2) && !isNaN(parseInt(o2)) ? e2.splice(o2, 1) : delete e2[o2] : e2[o2] = n2 : w(u2 = !(u2 = e2[o2]) || !m(e2, o2) ? e2[o2] = {} : u2, a2, n2)) : void 0 === n2 ? x(e2) && !isNaN(parseInt(t2)) ? e2.splice(t2, 1) : delete e2[t2] : e2[t2] = n2;
          }
        }
        function k(e2) {
          var t2, n2 = {};
          for (t2 in e2) m(e2, t2) && (n2[t2] = e2[t2]);
          return n2;
        }
        var t = [].concat;
        function P(e2) {
          return t.apply([], e2);
        }
        var e = "BigUint64Array,BigInt64Array,Array,Boolean,String,Date,RegExp,Blob,File,FileList,FileSystemFileHandle,FileSystemDirectoryHandle,ArrayBuffer,DataView,Uint8ClampedArray,ImageBitmap,ImageData,Map,Set,CryptoKey".split(",").concat(P([8, 16, 32, 64].map(function(t2) {
          return ["Int", "Uint", "Float"].map(function(e2) {
            return e2 + t2 + "Array";
          });
        }))).filter(function(e2) {
          return f[e2];
        }), K = new Set(e.map(function(e2) {
          return f[e2];
        }));
        var E = null;
        function S(e2) {
          E = new WeakMap();
          e2 = (function e3(t2) {
            if (!t2 || "object" != typeof t2) return t2;
            var n2 = E.get(t2);
            if (n2) return n2;
            if (x(t2)) {
              n2 = [], E.set(t2, n2);
              for (var r2 = 0, i2 = t2.length; r2 < i2; ++r2) n2.push(e3(t2[r2]));
            } else if (K.has(t2.constructor)) n2 = t2;
            else {
              var o2, a2 = c(t2);
              for (o2 in n2 = a2 === Object.prototype ? {} : Object.create(a2), E.set(t2, n2), t2) m(t2, o2) && (n2[o2] = e3(t2[o2]));
            }
            return n2;
          })(e2);
          return E = null, e2;
        }
        var j = {}.toString;
        function A(e2) {
          return j.call(e2).slice(8, -1);
        }
        var C = "undefined" != typeof Symbol ? Symbol.iterator : "@@iterator", T = "symbol" == typeof C ? function(e2) {
          var t2;
          return null != e2 && (t2 = e2[C]) && t2.apply(e2);
        } : function() {
          return null;
        };
        function I(e2, t2) {
          t2 = e2.indexOf(t2);
          return 0 <= t2 && e2.splice(t2, 1), 0 <= t2;
        }
        var q = {};
        function D(e2) {
          var t2, n2, r2, i2;
          if (1 === arguments.length) {
            if (x(e2)) return e2.slice();
            if (this === q && "string" == typeof e2) return [e2];
            if (i2 = T(e2)) {
              for (n2 = []; !(r2 = i2.next()).done; ) n2.push(r2.value);
              return n2;
            }
            if (null == e2) return [e2];
            if ("number" != typeof (t2 = e2.length)) return [e2];
            for (n2 = new Array(t2); t2--; ) n2[t2] = e2[t2];
            return n2;
          }
          for (t2 = arguments.length, n2 = new Array(t2); t2--; ) n2[t2] = arguments[t2];
          return n2;
        }
        var B = "undefined" != typeof Symbol ? function(e2) {
          return "AsyncFunction" === e2[Symbol.toStringTag];
        } : function() {
          return false;
        }, R = ["Unknown", "Constraint", "Data", "TransactionInactive", "ReadOnly", "Version", "NotFound", "InvalidState", "InvalidAccess", "Abort", "Timeout", "QuotaExceeded", "Syntax", "DataClone"], F = ["Modify", "Bulk", "OpenFailed", "VersionChange", "Schema", "Upgrade", "InvalidTable", "MissingAPI", "NoSuchDatabase", "InvalidArgument", "SubTransaction", "Unsupported", "Internal", "DatabaseClosed", "PrematureCommit", "ForeignAwait"].concat(R), M = { VersionChanged: "Database version changed by other database connection", DatabaseClosed: "Database has been closed", Abort: "Transaction aborted", TransactionInactive: "Transaction has already completed or failed", MissingAPI: "IndexedDB API missing. Please visit https://tinyurl.com/y2uuvskb" };
        function N(e2, t2) {
          this.name = e2, this.message = t2;
        }
        function L(e2, t2) {
          return e2 + ". Errors: " + Object.keys(t2).map(function(e3) {
            return t2[e3].toString();
          }).filter(function(e3, t3, n2) {
            return n2.indexOf(e3) === t3;
          }).join("\n");
        }
        function U(e2, t2, n2, r2) {
          this.failures = t2, this.failedKeys = r2, this.successCount = n2, this.message = L(e2, t2);
        }
        function V(e2, t2) {
          this.name = "BulkError", this.failures = Object.keys(t2).map(function(e3) {
            return t2[e3];
          }), this.failuresByPos = t2, this.message = L(e2, this.failures);
        }
        o(N).from(Error).extend({ toString: function() {
          return this.name + ": " + this.message;
        } }), o(U).from(N), o(V).from(N);
        var z = F.reduce(function(e2, t2) {
          return e2[t2] = t2 + "Error", e2;
        }, {}), W = N, Y = F.reduce(function(e2, n2) {
          var r2 = n2 + "Error";
          function t2(e3, t3) {
            this.name = r2, e3 ? "string" == typeof e3 ? (this.message = "".concat(e3).concat(t3 ? "\n " + t3 : ""), this.inner = t3 || null) : "object" == typeof e3 && (this.message = "".concat(e3.name, " ").concat(e3.message), this.inner = e3) : (this.message = M[n2] || r2, this.inner = null);
          }
          return o(t2).from(W), e2[n2] = t2, e2;
        }, {});
        Y.Syntax = SyntaxError, Y.Type = TypeError, Y.Range = RangeError;
        var $ = R.reduce(function(e2, t2) {
          return e2[t2 + "Error"] = Y[t2], e2;
        }, {});
        var Q = F.reduce(function(e2, t2) {
          return -1 === ["Syntax", "Type", "Range"].indexOf(t2) && (e2[t2 + "Error"] = Y[t2]), e2;
        }, {});
        function G() {
        }
        function X(e2) {
          return e2;
        }
        function H(t2, n2) {
          return null == t2 || t2 === X ? n2 : function(e2) {
            return n2(t2(e2));
          };
        }
        function J(e2, t2) {
          return function() {
            e2.apply(this, arguments), t2.apply(this, arguments);
          };
        }
        function Z(i2, o2) {
          return i2 === G ? o2 : function() {
            var e2 = i2.apply(this, arguments);
            void 0 !== e2 && (arguments[0] = e2);
            var t2 = this.onsuccess, n2 = this.onerror;
            this.onsuccess = null, this.onerror = null;
            var r2 = o2.apply(this, arguments);
            return t2 && (this.onsuccess = this.onsuccess ? J(t2, this.onsuccess) : t2), n2 && (this.onerror = this.onerror ? J(n2, this.onerror) : n2), void 0 !== r2 ? r2 : e2;
          };
        }
        function ee(n2, r2) {
          return n2 === G ? r2 : function() {
            n2.apply(this, arguments);
            var e2 = this.onsuccess, t2 = this.onerror;
            this.onsuccess = this.onerror = null, r2.apply(this, arguments), e2 && (this.onsuccess = this.onsuccess ? J(e2, this.onsuccess) : e2), t2 && (this.onerror = this.onerror ? J(t2, this.onerror) : t2);
          };
        }
        function te(i2, o2) {
          return i2 === G ? o2 : function(e2) {
            var t2 = i2.apply(this, arguments);
            a(e2, t2);
            var n2 = this.onsuccess, r2 = this.onerror;
            this.onsuccess = null, this.onerror = null;
            e2 = o2.apply(this, arguments);
            return n2 && (this.onsuccess = this.onsuccess ? J(n2, this.onsuccess) : n2), r2 && (this.onerror = this.onerror ? J(r2, this.onerror) : r2), void 0 === t2 ? void 0 === e2 ? void 0 : e2 : a(t2, e2);
          };
        }
        function ne(e2, t2) {
          return e2 === G ? t2 : function() {
            return false !== t2.apply(this, arguments) && e2.apply(this, arguments);
          };
        }
        function re(i2, o2) {
          return i2 === G ? o2 : function() {
            var e2 = i2.apply(this, arguments);
            if (e2 && "function" == typeof e2.then) {
              for (var t2 = this, n2 = arguments.length, r2 = new Array(n2); n2--; ) r2[n2] = arguments[n2];
              return e2.then(function() {
                return o2.apply(t2, r2);
              });
            }
            return o2.apply(this, arguments);
          };
        }
        Q.ModifyError = U, Q.DexieError = N, Q.BulkError = V;
        var ie = "undefined" != typeof location && /^(http|https):\/\/(localhost|127\.0\.0\.1)/.test(location.href);
        function oe(e2) {
          ie = e2;
        }
        var ae = {}, ue = 100, e = "undefined" == typeof Promise ? [] : (function() {
          var e2 = Promise.resolve();
          if ("undefined" == typeof crypto || !crypto.subtle) return [e2, c(e2), e2];
          var t2 = crypto.subtle.digest("SHA-512", new Uint8Array([0]));
          return [t2, c(t2), e2];
        })(), R = e[0], F = e[1], e = e[2], F = F && F.then, se = R && R.constructor, ce = !!e;
        var le = function(e2, t2) {
          be.push([e2, t2]), he && (queueMicrotask(Se), he = false);
        }, fe = true, he = true, de = [], pe = [], ye = X, ve = { id: "global", global: true, ref: 0, unhandleds: [], onunhandled: G, pgp: false, env: {}, finalize: G }, me = ve, be = [], ge = 0, we = [];
        function _e(e2) {
          if ("object" != typeof this) throw new TypeError("Promises must be constructed via new");
          this._listeners = [], this._lib = false;
          var t2 = this._PSD = me;
          if ("function" != typeof e2) {
            if (e2 !== ae) throw new TypeError("Not a function");
            return this._state = arguments[1], this._value = arguments[2], void (false === this._state && Oe(this, this._value));
          }
          this._state = null, this._value = null, ++t2.ref, (function t3(r2, e3) {
            try {
              e3(function(n2) {
                if (null === r2._state) {
                  if (n2 === r2) throw new TypeError("A promise cannot be resolved with itself.");
                  var e4 = r2._lib && je();
                  n2 && "function" == typeof n2.then ? t3(r2, function(e5, t4) {
                    n2 instanceof _e ? n2._then(e5, t4) : n2.then(e5, t4);
                  }) : (r2._state = true, r2._value = n2, Pe(r2)), e4 && Ae();
                }
              }, Oe.bind(null, r2));
            } catch (e4) {
              Oe(r2, e4);
            }
          })(this, e2);
        }
        var xe = { get: function() {
          var u2 = me, t2 = Fe;
          function e2(n2, r2) {
            var i2 = this, o2 = !u2.global && (u2 !== me || t2 !== Fe), a2 = o2 && !Ue(), e3 = new _e(function(e4, t3) {
              Ke(i2, new ke(Qe(n2, u2, o2, a2), Qe(r2, u2, o2, a2), e4, t3, u2));
            });
            return this._consoleTask && (e3._consoleTask = this._consoleTask), e3;
          }
          return e2.prototype = ae, e2;
        }, set: function(e2) {
          l(this, "then", e2 && e2.prototype === ae ? xe : { get: function() {
            return e2;
          }, set: xe.set });
        } };
        function ke(e2, t2, n2, r2, i2) {
          this.onFulfilled = "function" == typeof e2 ? e2 : null, this.onRejected = "function" == typeof t2 ? t2 : null, this.resolve = n2, this.reject = r2, this.psd = i2;
        }
        function Oe(e2, t2) {
          var n2, r2;
          pe.push(t2), null === e2._state && (n2 = e2._lib && je(), t2 = ye(t2), e2._state = false, e2._value = t2, r2 = e2, de.some(function(e3) {
            return e3._value === r2._value;
          }) || de.push(r2), Pe(e2), n2 && Ae());
        }
        function Pe(e2) {
          var t2 = e2._listeners;
          e2._listeners = [];
          for (var n2 = 0, r2 = t2.length; n2 < r2; ++n2) Ke(e2, t2[n2]);
          var i2 = e2._PSD;
          --i2.ref || i2.finalize(), 0 === ge && (++ge, le(function() {
            0 == --ge && Ce();
          }, []));
        }
        function Ke(e2, t2) {
          if (null !== e2._state) {
            var n2 = e2._state ? t2.onFulfilled : t2.onRejected;
            if (null === n2) return (e2._state ? t2.resolve : t2.reject)(e2._value);
            ++t2.psd.ref, ++ge, le(Ee, [n2, e2, t2]);
          } else e2._listeners.push(t2);
        }
        function Ee(e2, t2, n2) {
          try {
            var r2, i2 = t2._value;
            !t2._state && pe.length && (pe = []), r2 = ie && t2._consoleTask ? t2._consoleTask.run(function() {
              return e2(i2);
            }) : e2(i2), t2._state || -1 !== pe.indexOf(i2) || (function(e3) {
              var t3 = de.length;
              for (; t3; ) if (de[--t3]._value === e3._value) return de.splice(t3, 1);
            })(t2), n2.resolve(r2);
          } catch (e3) {
            n2.reject(e3);
          } finally {
            0 == --ge && Ce(), --n2.psd.ref || n2.psd.finalize();
          }
        }
        function Se() {
          $e(ve, function() {
            je() && Ae();
          });
        }
        function je() {
          var e2 = fe;
          return he = fe = false, e2;
        }
        function Ae() {
          var e2, t2, n2;
          do {
            for (; 0 < be.length; ) for (e2 = be, be = [], n2 = e2.length, t2 = 0; t2 < n2; ++t2) {
              var r2 = e2[t2];
              r2[0].apply(null, r2[1]);
            }
          } while (0 < be.length);
          he = fe = true;
        }
        function Ce() {
          var e2 = de;
          de = [], e2.forEach(function(e3) {
            e3._PSD.onunhandled.call(null, e3._value, e3);
          });
          for (var t2 = we.slice(0), n2 = t2.length; n2; ) t2[--n2]();
        }
        function Te(e2) {
          return new _e(ae, false, e2);
        }
        function Ie(n2, r2) {
          var i2 = me;
          return function() {
            var e2 = je(), t2 = me;
            try {
              return We(i2, true), n2.apply(this, arguments);
            } catch (e3) {
              r2 && r2(e3);
            } finally {
              We(t2, false), e2 && Ae();
            }
          };
        }
        r(_e.prototype, { then: xe, _then: function(e2, t2) {
          Ke(this, new ke(null, null, e2, t2, me));
        }, catch: function(e2) {
          if (1 === arguments.length) return this.then(null, e2);
          var t2 = e2, n2 = arguments[1];
          return "function" == typeof t2 ? this.then(null, function(e3) {
            return (e3 instanceof t2 ? n2 : Te)(e3);
          }) : this.then(null, function(e3) {
            return (e3 && e3.name === t2 ? n2 : Te)(e3);
          });
        }, finally: function(t2) {
          return this.then(function(e2) {
            return _e.resolve(t2()).then(function() {
              return e2;
            });
          }, function(e2) {
            return _e.resolve(t2()).then(function() {
              return Te(e2);
            });
          });
        }, timeout: function(r2, i2) {
          var o2 = this;
          return r2 < 1 / 0 ? new _e(function(e2, t2) {
            var n2 = setTimeout(function() {
              return t2(new Y.Timeout(i2));
            }, r2);
            o2.then(e2, t2).finally(clearTimeout.bind(null, n2));
          }) : this;
        } }), "undefined" != typeof Symbol && Symbol.toStringTag && l(_e.prototype, Symbol.toStringTag, "Dexie.Promise"), ve.env = Ye(), r(_e, { all: function() {
          var o2 = D.apply(null, arguments).map(Ve);
          return new _e(function(n2, r2) {
            0 === o2.length && n2([]);
            var i2 = o2.length;
            o2.forEach(function(e2, t2) {
              return _e.resolve(e2).then(function(e3) {
                o2[t2] = e3, --i2 || n2(o2);
              }, r2);
            });
          });
        }, resolve: function(n2) {
          return n2 instanceof _e ? n2 : n2 && "function" == typeof n2.then ? new _e(function(e2, t2) {
            n2.then(e2, t2);
          }) : new _e(ae, true, n2);
        }, reject: Te, race: function() {
          var e2 = D.apply(null, arguments).map(Ve);
          return new _e(function(t2, n2) {
            e2.map(function(e3) {
              return _e.resolve(e3).then(t2, n2);
            });
          });
        }, PSD: { get: function() {
          return me;
        }, set: function(e2) {
          return me = e2;
        } }, totalEchoes: { get: function() {
          return Fe;
        } }, newPSD: Ne, usePSD: $e, scheduler: { get: function() {
          return le;
        }, set: function(e2) {
          le = e2;
        } }, rejectionMapper: { get: function() {
          return ye;
        }, set: function(e2) {
          ye = e2;
        } }, follow: function(i2, n2) {
          return new _e(function(e2, t2) {
            return Ne(function(n3, r2) {
              var e3 = me;
              e3.unhandleds = [], e3.onunhandled = r2, e3.finalize = J(function() {
                var t3, e4 = this;
                t3 = function() {
                  0 === e4.unhandleds.length ? n3() : r2(e4.unhandleds[0]);
                }, we.push(function e5() {
                  t3(), we.splice(we.indexOf(e5), 1);
                }), ++ge, le(function() {
                  0 == --ge && Ce();
                }, []);
              }, e3.finalize), i2();
            }, n2, e2, t2);
          });
        } }), se && (se.allSettled && l(_e, "allSettled", function() {
          var e2 = D.apply(null, arguments).map(Ve);
          return new _e(function(n2) {
            0 === e2.length && n2([]);
            var r2 = e2.length, i2 = new Array(r2);
            e2.forEach(function(e3, t2) {
              return _e.resolve(e3).then(function(e4) {
                return i2[t2] = { status: "fulfilled", value: e4 };
              }, function(e4) {
                return i2[t2] = { status: "rejected", reason: e4 };
              }).then(function() {
                return --r2 || n2(i2);
              });
            });
          });
        }), se.any && "undefined" != typeof AggregateError && l(_e, "any", function() {
          var e2 = D.apply(null, arguments).map(Ve);
          return new _e(function(n2, r2) {
            0 === e2.length && r2(new AggregateError([]));
            var i2 = e2.length, o2 = new Array(i2);
            e2.forEach(function(e3, t2) {
              return _e.resolve(e3).then(function(e4) {
                return n2(e4);
              }, function(e4) {
                o2[t2] = e4, --i2 || r2(new AggregateError(o2));
              });
            });
          });
        }), se.withResolvers && (_e.withResolvers = se.withResolvers));
        var qe = { awaits: 0, echoes: 0, id: 0 }, De = 0, Be = [], Re = 0, Fe = 0, Me = 0;
        function Ne(e2, t2, n2, r2) {
          var i2 = me, o2 = Object.create(i2);
          o2.parent = i2, o2.ref = 0, o2.global = false, o2.id = ++Me, ve.env, o2.env = ce ? { Promise: _e, PromiseProp: { value: _e, configurable: true, writable: true }, all: _e.all, race: _e.race, allSettled: _e.allSettled, any: _e.any, resolve: _e.resolve, reject: _e.reject } : {}, t2 && a(o2, t2), ++i2.ref, o2.finalize = function() {
            --this.parent.ref || this.parent.finalize();
          };
          r2 = $e(o2, e2, n2, r2);
          return 0 === o2.ref && o2.finalize(), r2;
        }
        function Le() {
          return qe.id || (qe.id = ++De), ++qe.awaits, qe.echoes += ue, qe.id;
        }
        function Ue() {
          return !!qe.awaits && (0 == --qe.awaits && (qe.id = 0), qe.echoes = qe.awaits * ue, true);
        }
        function Ve(e2) {
          return qe.echoes && e2 && e2.constructor === se ? (Le(), e2.then(function(e3) {
            return Ue(), e3;
          }, function(e3) {
            return Ue(), Xe(e3);
          })) : e2;
        }
        function ze() {
          var e2 = Be[Be.length - 1];
          Be.pop(), We(e2, false);
        }
        function We(e2, t2) {
          var n2, r2 = me;
          (t2 ? !qe.echoes || Re++ && e2 === me : !Re || --Re && e2 === me) || queueMicrotask(t2 ? (function(e3) {
            ++Fe, qe.echoes && 0 != --qe.echoes || (qe.echoes = qe.awaits = qe.id = 0), Be.push(me), We(e3, true);
          }).bind(null, e2) : ze), e2 !== me && (me = e2, r2 === ve && (ve.env = Ye()), ce && (n2 = ve.env.Promise, t2 = e2.env, (r2.global || e2.global) && (Object.defineProperty(f, "Promise", t2.PromiseProp), n2.all = t2.all, n2.race = t2.race, n2.resolve = t2.resolve, n2.reject = t2.reject, t2.allSettled && (n2.allSettled = t2.allSettled), t2.any && (n2.any = t2.any))));
        }
        function Ye() {
          var e2 = f.Promise;
          return ce ? { Promise: e2, PromiseProp: Object.getOwnPropertyDescriptor(f, "Promise"), all: e2.all, race: e2.race, allSettled: e2.allSettled, any: e2.any, resolve: e2.resolve, reject: e2.reject } : {};
        }
        function $e(e2, t2, n2, r2, i2) {
          var o2 = me;
          try {
            return We(e2, true), t2(n2, r2, i2);
          } finally {
            We(o2, false);
          }
        }
        function Qe(t2, n2, r2, i2) {
          return "function" != typeof t2 ? t2 : function() {
            var e2 = me;
            r2 && Le(), We(n2, true);
            try {
              return t2.apply(this, arguments);
            } finally {
              We(e2, false), i2 && queueMicrotask(Ue);
            }
          };
        }
        function Ge(e2) {
          Promise === se && 0 === qe.echoes ? 0 === Re ? e2() : enqueueNativeMicroTask(e2) : setTimeout(e2, 0);
        }
        -1 === ("" + F).indexOf("[native code]") && (Le = Ue = G);
        var Xe = _e.reject;
        var He = String.fromCharCode(65535), Je = "Invalid key provided. Keys must be of type string, number, Date or Array<string | number | Date>.", Ze = "String expected.", et = [], tt = "__dbnames", nt = "readonly", rt = "readwrite";
        function it(e2, t2) {
          return e2 ? t2 ? function() {
            return e2.apply(this, arguments) && t2.apply(this, arguments);
          } : e2 : t2;
        }
        var ot = { type: 3, lower: -1 / 0, lowerOpen: false, upper: [[]], upperOpen: false };
        function at(t2) {
          return "string" != typeof t2 || /\./.test(t2) ? function(e2) {
            return e2;
          } : function(e2) {
            return void 0 === e2[t2] && t2 in e2 && delete (e2 = S(e2))[t2], e2;
          };
        }
        function ut() {
          throw Y.Type("Entity instances must never be new:ed. Instances are generated by the framework bypassing the constructor.");
        }
        function st(e2, t2) {
          try {
            var n2 = ct(e2), r2 = ct(t2);
            if (n2 !== r2) return "Array" === n2 ? 1 : "Array" === r2 ? -1 : "binary" === n2 ? 1 : "binary" === r2 ? -1 : "string" === n2 ? 1 : "string" === r2 ? -1 : "Date" === n2 ? 1 : "Date" !== r2 ? NaN : -1;
            switch (n2) {
              case "number":
              case "Date":
              case "string":
                return t2 < e2 ? 1 : e2 < t2 ? -1 : 0;
              case "binary":
                return (function(e3, t3) {
                  for (var n3 = e3.length, r3 = t3.length, i2 = n3 < r3 ? n3 : r3, o2 = 0; o2 < i2; ++o2) if (e3[o2] !== t3[o2]) return e3[o2] < t3[o2] ? -1 : 1;
                  return n3 === r3 ? 0 : n3 < r3 ? -1 : 1;
                })(lt(e2), lt(t2));
              case "Array":
                return (function(e3, t3) {
                  for (var n3 = e3.length, r3 = t3.length, i2 = n3 < r3 ? n3 : r3, o2 = 0; o2 < i2; ++o2) {
                    var a2 = st(e3[o2], t3[o2]);
                    if (0 !== a2) return a2;
                  }
                  return n3 === r3 ? 0 : n3 < r3 ? -1 : 1;
                })(e2, t2);
            }
          } catch (e3) {
          }
          return NaN;
        }
        function ct(e2) {
          var t2 = typeof e2;
          if ("object" != t2) return t2;
          if (ArrayBuffer.isView(e2)) return "binary";
          e2 = A(e2);
          return "ArrayBuffer" === e2 ? "binary" : e2;
        }
        function lt(e2) {
          return e2 instanceof Uint8Array ? e2 : ArrayBuffer.isView(e2) ? new Uint8Array(e2.buffer, e2.byteOffset, e2.byteLength) : new Uint8Array(e2);
        }
        function ft(t2, n2, r2) {
          var e2 = t2.schema.yProps;
          return e2 ? (n2 && 0 < r2.numFailures && (n2 = n2.filter(function(e3, t3) {
            return !r2.failures[t3];
          })), Promise.all(e2.map(function(e3) {
            e3 = e3.updatesTable;
            return n2 ? t2.db.table(e3).where("k").anyOf(n2).delete() : t2.db.table(e3).clear();
          })).then(function() {
            return r2;
          })) : r2;
        }
        var ht = (dt.prototype.execute = function(e2) {
          var t2 = this["@@propmod"];
          if (void 0 !== t2.add) {
            var n2 = t2.add;
            if (x(n2)) return i(i([], x(e2) ? e2 : [], true), n2).sort();
            if ("number" == typeof n2) return (Number(e2) || 0) + n2;
            if ("bigint" == typeof n2) try {
              return BigInt(e2) + n2;
            } catch (e3) {
              return BigInt(0) + n2;
            }
            throw new TypeError("Invalid term ".concat(n2));
          }
          if (void 0 !== t2.remove) {
            var r2 = t2.remove;
            if (x(r2)) return x(e2) ? e2.filter(function(e3) {
              return !r2.includes(e3);
            }).sort() : [];
            if ("number" == typeof r2) return Number(e2) - r2;
            if ("bigint" == typeof r2) try {
              return BigInt(e2) - r2;
            } catch (e3) {
              return BigInt(0) - r2;
            }
            throw new TypeError("Invalid subtrahend ".concat(r2));
          }
          n2 = null === (n2 = t2.replacePrefix) || void 0 === n2 ? void 0 : n2[0];
          return n2 && "string" == typeof e2 && e2.startsWith(n2) ? t2.replacePrefix[1] + e2.substring(n2.length) : e2;
        }, dt);
        function dt(e2) {
          this["@@propmod"] = e2;
        }
        function pt(e2, t2) {
          for (var n2 = O(t2), r2 = n2.length, i2 = false, o2 = 0; o2 < r2; ++o2) {
            var a2 = n2[o2], u2 = t2[a2], s2 = g(e2, a2);
            u2 instanceof ht ? (w(e2, a2, u2.execute(s2)), i2 = true) : s2 !== u2 && (w(e2, a2, u2), i2 = true);
          }
          return i2;
        }
        var yt = (vt.prototype._trans = function(e2, r2, t2) {
          var n2 = this._tx || me.trans, i2 = this.name, o2 = ie && "undefined" != typeof console && console.createTask && console.createTask("Dexie: ".concat("readonly" === e2 ? "read" : "write", " ").concat(this.name));
          function a2(e3, t3, n3) {
            if (!n3.schema[i2]) throw new Y.NotFound("Table " + i2 + " not part of transaction");
            return r2(n3.idbtrans, n3);
          }
          var u2 = je();
          try {
            var s2 = n2 && n2.db._novip === this.db._novip ? n2 === me.trans ? n2._promise(e2, a2, t2) : Ne(function() {
              return n2._promise(e2, a2, t2);
            }, { trans: n2, transless: me.transless || me }) : (function t3(n3, r3, i3, o3) {
              if (n3.idbdb && (n3._state.openComplete || me.letThrough || n3._vip)) {
                var a3 = n3._createTransaction(r3, i3, n3._dbSchema);
                try {
                  a3.create(), n3._state.PR1398_maxLoop = 3;
                } catch (e3) {
                  return e3.name === z.InvalidState && n3.isOpen() && 0 < --n3._state.PR1398_maxLoop ? (console.warn("Dexie: Need to reopen db"), n3.close({ disableAutoOpen: false }), n3.open().then(function() {
                    return t3(n3, r3, i3, o3);
                  })) : Xe(e3);
                }
                return a3._promise(r3, function(e3, t4) {
                  return Ne(function() {
                    return me.trans = a3, o3(e3, t4, a3);
                  });
                }).then(function(e3) {
                  if ("readwrite" === r3) try {
                    a3.idbtrans.commit();
                  } catch (e4) {
                  }
                  return "readonly" === r3 ? e3 : a3._completion.then(function() {
                    return e3;
                  });
                });
              }
              if (n3._state.openComplete) return Xe(new Y.DatabaseClosed(n3._state.dbOpenError));
              if (!n3._state.isBeingOpened) {
                if (!n3._state.autoOpen) return Xe(new Y.DatabaseClosed());
                n3.open().catch(G);
              }
              return n3._state.dbReadyPromise.then(function() {
                return t3(n3, r3, i3, o3);
              });
            })(this.db, e2, [this.name], a2);
            return o2 && (s2._consoleTask = o2, s2 = s2.catch(function(e3) {
              return console.trace(e3), Xe(e3);
            })), s2;
          } finally {
            u2 && Ae();
          }
        }, vt.prototype.get = function(t2, e2) {
          var n2 = this;
          return t2 && t2.constructor === Object ? this.where(t2).first(e2) : null == t2 ? Xe(new Y.Type("Invalid argument to Table.get()")) : this._trans("readonly", function(e3) {
            return n2.core.get({ trans: e3, key: t2 }).then(function(e4) {
              return n2.hook.reading.fire(e4);
            });
          }).then(e2);
        }, vt.prototype.where = function(o2) {
          if ("string" == typeof o2) return new this.db.WhereClause(this, o2);
          if (x(o2)) return new this.db.WhereClause(this, "[".concat(o2.join("+"), "]"));
          var n2 = O(o2);
          if (1 === n2.length) return this.where(n2[0]).equals(o2[n2[0]]);
          var e2 = this.schema.indexes.concat(this.schema.primKey).filter(function(t3) {
            if (t3.compound && n2.every(function(e4) {
              return 0 <= t3.keyPath.indexOf(e4);
            })) {
              for (var e3 = 0; e3 < n2.length; ++e3) if (-1 === n2.indexOf(t3.keyPath[e3])) return false;
              return true;
            }
            return false;
          }).sort(function(e3, t3) {
            return e3.keyPath.length - t3.keyPath.length;
          })[0];
          if (e2 && this.db._maxKey !== He) {
            var t2 = e2.keyPath.slice(0, n2.length);
            return this.where(t2).equals(t2.map(function(e3) {
              return o2[e3];
            }));
          }
          !e2 && ie && console.warn("The query ".concat(JSON.stringify(o2), " on ").concat(this.name, " would benefit from a ") + "compound index [".concat(n2.join("+"), "]"));
          var a2 = this.schema.idxByName;
          function u2(e3, t3) {
            return 0 === st(e3, t3);
          }
          var r2 = n2.reduce(function(e3, t3) {
            var n3 = e3[0], r3 = e3[1], e3 = a2[t3], i2 = o2[t3];
            return [n3 || e3, n3 || !e3 ? it(r3, e3 && e3.multi ? function(e4) {
              e4 = g(e4, t3);
              return x(e4) && e4.some(function(e5) {
                return u2(i2, e5);
              });
            } : function(e4) {
              return u2(i2, g(e4, t3));
            }) : r3];
          }, [null, null]), t2 = r2[0], r2 = r2[1];
          return t2 ? this.where(t2.name).equals(o2[t2.keyPath]).filter(r2) : e2 ? this.filter(r2) : this.where(n2).equals("");
        }, vt.prototype.filter = function(e2) {
          return this.toCollection().and(e2);
        }, vt.prototype.count = function(e2) {
          return this.toCollection().count(e2);
        }, vt.prototype.offset = function(e2) {
          return this.toCollection().offset(e2);
        }, vt.prototype.limit = function(e2) {
          return this.toCollection().limit(e2);
        }, vt.prototype.each = function(e2) {
          return this.toCollection().each(e2);
        }, vt.prototype.toArray = function(e2) {
          return this.toCollection().toArray(e2);
        }, vt.prototype.toCollection = function() {
          return new this.db.Collection(new this.db.WhereClause(this));
        }, vt.prototype.orderBy = function(e2) {
          return new this.db.Collection(new this.db.WhereClause(this, x(e2) ? "[".concat(e2.join("+"), "]") : e2));
        }, vt.prototype.reverse = function() {
          return this.toCollection().reverse();
        }, vt.prototype.mapToClass = function(r2) {
          var e2, t2 = this.db, n2 = this.name;
          function i2() {
            return null !== e2 && e2.apply(this, arguments) || this;
          }
          (this.schema.mappedClass = r2).prototype instanceof ut && ((function(e3, t3) {
            if ("function" != typeof t3 && null !== t3) throw new TypeError("Class extends value " + String(t3) + " is not a constructor or null");
            function n3() {
              this.constructor = e3;
            }
            s(e3, t3), e3.prototype = null === t3 ? Object.create(t3) : (n3.prototype = t3.prototype, new n3());
          })(i2, e2 = r2), Object.defineProperty(i2.prototype, "db", { get: function() {
            return t2;
          }, enumerable: false, configurable: true }), i2.prototype.table = function() {
            return n2;
          }, r2 = i2);
          for (var o2 = new Set(), a2 = r2.prototype; a2; a2 = c(a2)) Object.getOwnPropertyNames(a2).forEach(function(e3) {
            return o2.add(e3);
          });
          function u2(e3) {
            if (!e3) return e3;
            var t3, n3 = Object.create(r2.prototype);
            for (t3 in e3) if (!o2.has(t3)) try {
              n3[t3] = e3[t3];
            } catch (e4) {
            }
            return n3;
          }
          return this.schema.readHook && this.hook.reading.unsubscribe(this.schema.readHook), this.schema.readHook = u2, this.hook("reading", u2), r2;
        }, vt.prototype.defineClass = function() {
          return this.mapToClass(function(e2) {
            a(this, e2);
          });
        }, vt.prototype.add = function(t2, n2) {
          var r2 = this, e2 = this.schema.primKey, i2 = e2.auto, o2 = e2.keyPath, a2 = t2;
          return o2 && i2 && (a2 = at(o2)(t2)), this._trans("readwrite", function(e3) {
            return r2.core.mutate({ trans: e3, type: "add", keys: null != n2 ? [n2] : null, values: [a2] });
          }).then(function(e3) {
            return e3.numFailures ? _e.reject(e3.failures[0]) : e3.lastResult;
          }).then(function(e3) {
            if (o2) try {
              w(t2, o2, e3);
            } catch (e4) {
            }
            return e3;
          });
        }, vt.prototype.upsert = function(r2, i2) {
          var o2 = this, a2 = this.schema.primKey.keyPath;
          return this._trans("readwrite", function(n2) {
            return o2.core.get({ trans: n2, key: r2 }).then(function(t2) {
              var e2 = null != t2 ? t2 : {};
              return pt(e2, i2), a2 && w(e2, a2, r2), o2.core.mutate({ trans: n2, type: "put", values: [e2], keys: [r2], upsert: true, updates: { keys: [r2], changeSpecs: [i2] } }).then(function(e3) {
                return e3.numFailures ? _e.reject(e3.failures[0]) : !!t2;
              });
            });
          });
        }, vt.prototype.update = function(e2, t2) {
          if ("object" != typeof e2 || x(e2)) return this.where(":id").equals(e2).modify(t2);
          e2 = g(e2, this.schema.primKey.keyPath);
          return void 0 === e2 ? Xe(new Y.InvalidArgument("Given object does not contain its primary key")) : this.where(":id").equals(e2).modify(t2);
        }, vt.prototype.put = function(t2, n2) {
          var r2 = this, e2 = this.schema.primKey, i2 = e2.auto, o2 = e2.keyPath, a2 = t2;
          return o2 && i2 && (a2 = at(o2)(t2)), this._trans("readwrite", function(e3) {
            return r2.core.mutate({ trans: e3, type: "put", values: [a2], keys: null != n2 ? [n2] : null });
          }).then(function(e3) {
            return e3.numFailures ? _e.reject(e3.failures[0]) : e3.lastResult;
          }).then(function(e3) {
            if (o2) try {
              w(t2, o2, e3);
            } catch (e4) {
            }
            return e3;
          });
        }, vt.prototype.delete = function(t2) {
          var n2 = this;
          return this._trans("readwrite", function(e2) {
            return n2.core.mutate({ trans: e2, type: "delete", keys: [t2] }).then(function(e3) {
              return ft(n2, [t2], e3);
            }).then(function(e3) {
              return e3.numFailures ? _e.reject(e3.failures[0]) : void 0;
            });
          });
        }, vt.prototype.clear = function() {
          var t2 = this;
          return this._trans("readwrite", function(e2) {
            return t2.core.mutate({ trans: e2, type: "deleteRange", range: ot }).then(function(e3) {
              return ft(t2, null, e3);
            });
          }).then(function(e2) {
            return e2.numFailures ? _e.reject(e2.failures[0]) : void 0;
          });
        }, vt.prototype.bulkGet = function(t2) {
          var n2 = this;
          return this._trans("readonly", function(e2) {
            return n2.core.getMany({ keys: t2, trans: e2 }).then(function(e3) {
              return e3.map(function(e4) {
                return n2.hook.reading.fire(e4);
              });
            });
          });
        }, vt.prototype.bulkAdd = function(r2, e2, t2) {
          var o2 = this, a2 = Array.isArray(e2) ? e2 : void 0, u2 = (t2 = t2 || (a2 ? void 0 : e2)) ? t2.allKeys : void 0;
          return this._trans("readwrite", function(e3) {
            var t3 = o2.schema.primKey, n2 = t3.auto, t3 = t3.keyPath;
            if (t3 && a2) throw new Y.InvalidArgument("bulkAdd(): keys argument invalid on tables with inbound keys");
            if (a2 && a2.length !== r2.length) throw new Y.InvalidArgument("Arguments objects and keys must have the same length");
            var i2 = r2.length, t3 = t3 && n2 ? r2.map(at(t3)) : r2;
            return o2.core.mutate({ trans: e3, type: "add", keys: a2, values: t3, wantResults: u2 }).then(function(e4) {
              var t4 = e4.numFailures, n3 = e4.results, r3 = e4.lastResult, e4 = e4.failures;
              if (0 === t4) return u2 ? n3 : r3;
              throw new V("".concat(o2.name, ".bulkAdd(): ").concat(t4, " of ").concat(i2, " operations failed"), e4);
            });
          });
        }, vt.prototype.bulkPut = function(r2, e2, t2) {
          var o2 = this, a2 = Array.isArray(e2) ? e2 : void 0, u2 = (t2 = t2 || (a2 ? void 0 : e2)) ? t2.allKeys : void 0;
          return this._trans("readwrite", function(e3) {
            var t3 = o2.schema.primKey, n2 = t3.auto, t3 = t3.keyPath;
            if (t3 && a2) throw new Y.InvalidArgument("bulkPut(): keys argument invalid on tables with inbound keys");
            if (a2 && a2.length !== r2.length) throw new Y.InvalidArgument("Arguments objects and keys must have the same length");
            var i2 = r2.length, t3 = t3 && n2 ? r2.map(at(t3)) : r2;
            return o2.core.mutate({ trans: e3, type: "put", keys: a2, values: t3, wantResults: u2 }).then(function(e4) {
              var t4 = e4.numFailures, n3 = e4.results, r3 = e4.lastResult, e4 = e4.failures;
              if (0 === t4) return u2 ? n3 : r3;
              throw new V("".concat(o2.name, ".bulkPut(): ").concat(t4, " of ").concat(i2, " operations failed"), e4);
            });
          });
        }, vt.prototype.bulkUpdate = function(t2) {
          var h2 = this, n2 = this.core, r2 = t2.map(function(e2) {
            return e2.key;
          }), i2 = t2.map(function(e2) {
            return e2.changes;
          }), d2 = [];
          return this._trans("readwrite", function(e2) {
            return n2.getMany({ trans: e2, keys: r2, cache: "clone" }).then(function(c2) {
              var l2 = [], f2 = [];
              t2.forEach(function(e3, t3) {
                var n3 = e3.key, r3 = e3.changes, i3 = c2[t3];
                if (i3) {
                  for (var o2 = 0, a2 = Object.keys(r3); o2 < a2.length; o2++) {
                    var u2 = a2[o2], s3 = r3[u2];
                    if (u2 === h2.schema.primKey.keyPath) {
                      if (0 !== st(s3, n3)) throw new Y.Constraint("Cannot update primary key in bulkUpdate()");
                    } else w(i3, u2, s3);
                  }
                  d2.push(t3), l2.push(n3), f2.push(i3);
                }
              });
              var s2 = l2.length;
              return n2.mutate({ trans: e2, type: "put", keys: l2, values: f2, updates: { keys: r2, changeSpecs: i2 } }).then(function(e3) {
                var t3 = e3.numFailures, n3 = e3.failures;
                if (0 === t3) return s2;
                for (var r3 = 0, i3 = Object.keys(n3); r3 < i3.length; r3++) {
                  var o2, a2 = i3[r3], u2 = d2[Number(a2)];
                  null != u2 && (o2 = n3[a2], delete n3[a2], n3[u2] = o2);
                }
                throw new V("".concat(h2.name, ".bulkUpdate(): ").concat(t3, " of ").concat(s2, " operations failed"), n3);
              });
            });
          });
        }, vt.prototype.bulkDelete = function(t2) {
          var r2 = this, i2 = t2.length;
          return this._trans("readwrite", function(e2) {
            return r2.core.mutate({ trans: e2, type: "delete", keys: t2 }).then(function(e3) {
              return ft(r2, t2, e3);
            });
          }).then(function(e2) {
            var t3 = e2.numFailures, n2 = e2.lastResult, e2 = e2.failures;
            if (0 === t3) return n2;
            throw new V("".concat(r2.name, ".bulkDelete(): ").concat(t3, " of ").concat(i2, " operations failed"), e2);
          });
        }, vt);
        function vt() {
        }
        function mt(i2) {
          function t2(e3, t3) {
            if (t3) {
              for (var n3 = arguments.length, r2 = new Array(n3 - 1); --n3; ) r2[n3 - 1] = arguments[n3];
              return a2[e3].subscribe.apply(null, r2), i2;
            }
            if ("string" == typeof e3) return a2[e3];
          }
          var a2 = {};
          t2.addEventType = u2;
          for (var e2 = 1, n2 = arguments.length; e2 < n2; ++e2) u2(arguments[e2]);
          return t2;
          function u2(e3, n3, r2) {
            if ("object" != typeof e3) {
              var i3;
              n3 = n3 || ne;
              var o2 = { subscribers: [], fire: r2 = r2 || G, subscribe: function(e4) {
                -1 === o2.subscribers.indexOf(e4) && (o2.subscribers.push(e4), o2.fire = n3(o2.fire, e4));
              }, unsubscribe: function(t3) {
                o2.subscribers = o2.subscribers.filter(function(e4) {
                  return e4 !== t3;
                }), o2.fire = o2.subscribers.reduce(n3, r2);
              } };
              return a2[e3] = t2[e3] = o2;
            }
            O(i3 = e3).forEach(function(e4) {
              var t3 = i3[e4];
              if (x(t3)) u2(e4, i3[e4][0], i3[e4][1]);
              else {
                if ("asap" !== t3) throw new Y.InvalidArgument("Invalid event config");
                var n4 = u2(e4, X, function() {
                  for (var e5 = arguments.length, t4 = new Array(e5); e5--; ) t4[e5] = arguments[e5];
                  n4.subscribers.forEach(function(e6) {
                    v(function() {
                      e6.apply(null, t4);
                    });
                  });
                });
              }
            });
          }
        }
        function bt(e2, t2) {
          return o(t2).from({ prototype: e2 }), t2;
        }
        function gt(e2, t2) {
          return !(e2.filter || e2.algorithm || e2.or) && (t2 ? e2.justLimit : !e2.replayFilter);
        }
        function wt(e2, t2) {
          e2.filter = it(e2.filter, t2);
        }
        function _t(e2, t2, n2) {
          var r2 = e2.replayFilter;
          e2.replayFilter = r2 ? function() {
            return it(r2(), t2());
          } : t2, e2.justLimit = n2 && !r2;
        }
        function xt(e2, t2) {
          if (e2.isPrimKey) return t2.primaryKey;
          var n2 = t2.getIndexByKeyPath(e2.index);
          if (!n2) throw new Y.Schema("KeyPath " + e2.index + " on object store " + t2.name + " is not indexed");
          return n2;
        }
        function kt(e2, t2, n2) {
          var r2 = xt(e2, t2.schema);
          return t2.openCursor({ trans: n2, values: !e2.keysOnly, reverse: "prev" === e2.dir, unique: !!e2.unique, query: { index: r2, range: e2.range } });
        }
        function Ot(e2, o2, t2, n2) {
          var a2 = e2.replayFilter ? it(e2.filter, e2.replayFilter()) : e2.filter;
          if (e2.or) {
            var u2 = {}, r2 = function(e3, t3, n3) {
              var r3, i2;
              a2 && !a2(t3, n3, function(e4) {
                return t3.stop(e4);
              }, function(e4) {
                return t3.fail(e4);
              }) || ("[object ArrayBuffer]" === (i2 = "" + (r3 = t3.primaryKey)) && (i2 = "" + new Uint8Array(r3)), m(u2, i2) || (u2[i2] = true, o2(e3, t3, n3)));
            };
            return Promise.all([e2.or._iterate(r2, t2), Pt(kt(e2, n2, t2), e2.algorithm, r2, !e2.keysOnly && e2.valueMapper)]);
          }
          return Pt(kt(e2, n2, t2), it(e2.algorithm, a2), o2, !e2.keysOnly && e2.valueMapper);
        }
        function Pt(e2, r2, i2, o2) {
          var a2 = Ie(o2 ? function(e3, t2, n2) {
            return i2(o2(e3), t2, n2);
          } : i2);
          return e2.then(function(n2) {
            if (n2) return n2.start(function() {
              var t2 = function() {
                return n2.continue();
              };
              r2 && !r2(n2, function(e3) {
                return t2 = e3;
              }, function(e3) {
                n2.stop(e3), t2 = G;
              }, function(e3) {
                n2.fail(e3), t2 = G;
              }) || a2(n2.value, n2, function(e3) {
                return t2 = e3;
              }), t2();
            });
          });
        }
        var Kt = (Et.prototype._read = function(e2, t2) {
          var n2 = this._ctx;
          return n2.error ? n2.table._trans(null, Xe.bind(null, n2.error)) : n2.table._trans("readonly", e2).then(t2);
        }, Et.prototype._write = function(e2) {
          var t2 = this._ctx;
          return t2.error ? t2.table._trans(null, Xe.bind(null, t2.error)) : t2.table._trans("readwrite", e2, "locked");
        }, Et.prototype._addAlgorithm = function(e2) {
          var t2 = this._ctx;
          t2.algorithm = it(t2.algorithm, e2);
        }, Et.prototype._iterate = function(e2, t2) {
          return Ot(this._ctx, e2, t2, this._ctx.table.core);
        }, Et.prototype.clone = function(e2) {
          var t2 = Object.create(this.constructor.prototype), n2 = Object.create(this._ctx);
          return e2 && a(n2, e2), t2._ctx = n2, t2;
        }, Et.prototype.raw = function() {
          return this._ctx.valueMapper = null, this;
        }, Et.prototype.each = function(t2) {
          var n2 = this._ctx;
          return this._read(function(e2) {
            return Ot(n2, t2, e2, n2.table.core);
          });
        }, Et.prototype.count = function(e2) {
          var i2 = this;
          return this._read(function(e3) {
            var t2 = i2._ctx, n2 = t2.table.core;
            if (gt(t2, true)) return n2.count({ trans: e3, query: { index: xt(t2, n2.schema), range: t2.range } }).then(function(e4) {
              return Math.min(e4, t2.limit);
            });
            var r2 = 0;
            return Ot(t2, function() {
              return ++r2, false;
            }, e3, n2).then(function() {
              return r2;
            });
          }).then(e2);
        }, Et.prototype.sortBy = function(e2, t2) {
          var n2 = e2.split(".").reverse(), r2 = n2[0], i2 = n2.length - 1;
          function o2(e3, t3) {
            return t3 ? o2(e3[n2[t3]], t3 - 1) : e3[r2];
          }
          var a2 = "next" === this._ctx.dir ? 1 : -1;
          function u2(e3, t3) {
            return st(o2(e3, i2), o2(t3, i2)) * a2;
          }
          return this.toArray(function(e3) {
            return e3.sort(u2);
          }).then(t2);
        }, Et.prototype.toArray = function(e2) {
          var o2 = this;
          return this._read(function(e3) {
            var t2 = o2._ctx;
            if ("next" === t2.dir && gt(t2, true) && 0 < t2.limit) {
              var n2 = t2.valueMapper, r2 = xt(t2, t2.table.core.schema);
              return t2.table.core.query({ trans: e3, limit: t2.limit, values: true, query: { index: r2, range: t2.range } }).then(function(e4) {
                e4 = e4.result;
                return n2 ? e4.map(n2) : e4;
              });
            }
            var i2 = [];
            return Ot(t2, function(e4) {
              return i2.push(e4);
            }, e3, t2.table.core).then(function() {
              return i2;
            });
          }, e2);
        }, Et.prototype.offset = function(t2) {
          var e2 = this._ctx;
          return t2 <= 0 || (e2.offset += t2, gt(e2) ? _t(e2, function() {
            var n2 = t2;
            return function(e3, t3) {
              return 0 === n2 || (1 === n2 ? --n2 : t3(function() {
                e3.advance(n2), n2 = 0;
              }), false);
            };
          }) : _t(e2, function() {
            var e3 = t2;
            return function() {
              return --e3 < 0;
            };
          })), this;
        }, Et.prototype.limit = function(e2) {
          return this._ctx.limit = Math.min(this._ctx.limit, e2), _t(this._ctx, function() {
            var r2 = e2;
            return function(e3, t2, n2) {
              return --r2 <= 0 && t2(n2), 0 <= r2;
            };
          }, true), this;
        }, Et.prototype.until = function(r2, i2) {
          return wt(this._ctx, function(e2, t2, n2) {
            return !r2(e2.value) || (t2(n2), i2);
          }), this;
        }, Et.prototype.first = function(e2) {
          return this.limit(1).toArray(function(e3) {
            return e3[0];
          }).then(e2);
        }, Et.prototype.last = function(e2) {
          return this.reverse().first(e2);
        }, Et.prototype.filter = function(t2) {
          var e2;
          return wt(this._ctx, function(e3) {
            return t2(e3.value);
          }), (e2 = this._ctx).isMatch = it(e2.isMatch, t2), this;
        }, Et.prototype.and = function(e2) {
          return this.filter(e2);
        }, Et.prototype.or = function(e2) {
          return new this.db.WhereClause(this._ctx.table, e2, this);
        }, Et.prototype.reverse = function() {
          return this._ctx.dir = "prev" === this._ctx.dir ? "next" : "prev", this._ondirectionchange && this._ondirectionchange(this._ctx.dir), this;
        }, Et.prototype.desc = function() {
          return this.reverse();
        }, Et.prototype.eachKey = function(n2) {
          var e2 = this._ctx;
          return e2.keysOnly = !e2.isMatch, this.each(function(e3, t2) {
            n2(t2.key, t2);
          });
        }, Et.prototype.eachUniqueKey = function(e2) {
          return this._ctx.unique = "unique", this.eachKey(e2);
        }, Et.prototype.eachPrimaryKey = function(n2) {
          var e2 = this._ctx;
          return e2.keysOnly = !e2.isMatch, this.each(function(e3, t2) {
            n2(t2.primaryKey, t2);
          });
        }, Et.prototype.keys = function(e2) {
          var t2 = this._ctx;
          t2.keysOnly = !t2.isMatch;
          var n2 = [];
          return this.each(function(e3, t3) {
            n2.push(t3.key);
          }).then(function() {
            return n2;
          }).then(e2);
        }, Et.prototype.primaryKeys = function(e2) {
          var n2 = this._ctx;
          if ("next" === n2.dir && gt(n2, true) && 0 < n2.limit) return this._read(function(e3) {
            var t2 = xt(n2, n2.table.core.schema);
            return n2.table.core.query({ trans: e3, values: false, limit: n2.limit, query: { index: t2, range: n2.range } });
          }).then(function(e3) {
            return e3.result;
          }).then(e2);
          n2.keysOnly = !n2.isMatch;
          var r2 = [];
          return this.each(function(e3, t2) {
            r2.push(t2.primaryKey);
          }).then(function() {
            return r2;
          }).then(e2);
        }, Et.prototype.uniqueKeys = function(e2) {
          return this._ctx.unique = "unique", this.keys(e2);
        }, Et.prototype.firstKey = function(e2) {
          return this.limit(1).keys(function(e3) {
            return e3[0];
          }).then(e2);
        }, Et.prototype.lastKey = function(e2) {
          return this.reverse().firstKey(e2);
        }, Et.prototype.distinct = function() {
          var e2 = this._ctx, e2 = e2.index && e2.table.schema.idxByName[e2.index];
          if (!e2 || !e2.multi) return this;
          var n2 = {};
          return wt(this._ctx, function(e3) {
            var t2 = e3.primaryKey.toString(), e3 = m(n2, t2);
            return n2[t2] = true, !e3;
          }), this;
        }, Et.prototype.modify = function(x2) {
          var n2 = this, k2 = this._ctx;
          return this._write(function(p2) {
            var y2 = "function" == typeof x2 ? x2 : function(e3) {
              return pt(e3, x2);
            }, v2 = k2.table.core, e2 = v2.schema.primaryKey, m2 = e2.outbound, b2 = e2.extractKey, g2 = 200, e2 = n2.db._options.modifyChunkSize;
            e2 && (g2 = "object" == typeof e2 ? e2[v2.name] || e2["*"] || 200 : e2);
            function w2(e3, t3) {
              var n3 = t3.failures, t3 = t3.numFailures;
              u2 += e3 - t3;
              for (var r2 = 0, i2 = O(n3); r2 < i2.length; r2++) {
                var o2 = i2[r2];
                a2.push(n3[o2]);
              }
            }
            var a2 = [], u2 = 0, t2 = [], _2 = x2 === St;
            return n2.clone().primaryKeys().then(function(f2) {
              function h2(s2) {
                var c2 = Math.min(g2, f2.length - s2), l2 = f2.slice(s2, s2 + c2);
                return (_2 ? Promise.resolve([]) : v2.getMany({ trans: p2, keys: l2, cache: "immutable" })).then(function(e3) {
                  var n3 = [], t3 = [], r2 = m2 ? [] : null, i2 = _2 ? l2 : [];
                  if (!_2) for (var o2 = 0; o2 < c2; ++o2) {
                    var a3 = e3[o2], u3 = { value: S(a3), primKey: f2[s2 + o2] };
                    false !== y2.call(u3, u3.value, u3) && (null == u3.value ? i2.push(f2[s2 + o2]) : m2 || 0 === st(b2(a3), b2(u3.value)) ? (t3.push(u3.value), m2 && r2.push(f2[s2 + o2])) : (i2.push(f2[s2 + o2]), n3.push(u3.value)));
                  }
                  return Promise.resolve(0 < n3.length && v2.mutate({ trans: p2, type: "add", values: n3 }).then(function(e4) {
                    for (var t4 in e4.failures) i2.splice(parseInt(t4), 1);
                    w2(n3.length, e4);
                  })).then(function() {
                    return (0 < t3.length || d2 && "object" == typeof x2) && v2.mutate({ trans: p2, type: "put", keys: r2, values: t3, criteria: d2, changeSpec: "function" != typeof x2 && x2, isAdditionalChunk: 0 < s2 }).then(function(e4) {
                      return w2(t3.length, e4);
                    });
                  }).then(function() {
                    return (0 < i2.length || d2 && _2) && v2.mutate({ trans: p2, type: "delete", keys: i2, criteria: d2, isAdditionalChunk: 0 < s2 }).then(function(e4) {
                      return ft(k2.table, i2, e4);
                    }).then(function(e4) {
                      return w2(i2.length, e4);
                    });
                  }).then(function() {
                    return f2.length > s2 + c2 && h2(s2 + g2);
                  });
                });
              }
              var d2 = gt(k2) && k2.limit === 1 / 0 && ("function" != typeof x2 || _2) && { index: k2.index, range: k2.range };
              return h2(0).then(function() {
                if (0 < a2.length) throw new U("Error modifying one or more objects", a2, u2, t2);
                return f2.length;
              });
            });
          });
        }, Et.prototype.delete = function() {
          var i2 = this._ctx, n2 = i2.range;
          return !gt(i2) || i2.table.schema.yProps || !i2.isPrimKey && 3 !== n2.type ? this.modify(St) : this._write(function(e2) {
            var t2 = i2.table.core.schema.primaryKey, r2 = n2;
            return i2.table.core.count({ trans: e2, query: { index: t2, range: r2 } }).then(function(n3) {
              return i2.table.core.mutate({ trans: e2, type: "deleteRange", range: r2 }).then(function(e3) {
                var t3 = e3.failures, e3 = e3.numFailures;
                if (e3) throw new U("Could not delete some values", Object.keys(t3).map(function(e4) {
                  return t3[e4];
                }), n3 - e3);
                return n3 - e3;
              });
            });
          });
        }, Et);
        function Et() {
        }
        var St = function(e2, t2) {
          return t2.value = null;
        };
        function jt(e2, t2) {
          return e2 < t2 ? -1 : e2 === t2 ? 0 : 1;
        }
        function At(e2, t2) {
          return t2 < e2 ? -1 : e2 === t2 ? 0 : 1;
        }
        function Ct(e2, t2, n2) {
          e2 = e2 instanceof Bt ? new e2.Collection(e2) : e2;
          return e2._ctx.error = new (n2 || TypeError)(t2), e2;
        }
        function Tt(e2) {
          return new e2.Collection(e2, function() {
            return Dt("");
          }).limit(0);
        }
        function It(e2, s2, n2, r2) {
          var i2, c2, l2, f2, h2, d2, p2, y2 = n2.length;
          if (!n2.every(function(e3) {
            return "string" == typeof e3;
          })) return Ct(e2, Ze);
          function t2(e3) {
            i2 = "next" === e3 ? function(e4) {
              return e4.toUpperCase();
            } : function(e4) {
              return e4.toLowerCase();
            }, c2 = "next" === e3 ? function(e4) {
              return e4.toLowerCase();
            } : function(e4) {
              return e4.toUpperCase();
            }, l2 = "next" === e3 ? jt : At;
            var t3 = n2.map(function(e4) {
              return { lower: c2(e4), upper: i2(e4) };
            }).sort(function(e4, t4) {
              return l2(e4.lower, t4.lower);
            });
            f2 = t3.map(function(e4) {
              return e4.upper;
            }), h2 = t3.map(function(e4) {
              return e4.lower;
            }), p2 = "next" === (d2 = e3) ? "" : r2;
          }
          t2("next");
          e2 = new e2.Collection(e2, function() {
            return qt(f2[0], h2[y2 - 1] + r2);
          });
          e2._ondirectionchange = function(e3) {
            t2(e3);
          };
          var v2 = 0;
          return e2._addAlgorithm(function(e3, t3, n3) {
            var r3 = e3.key;
            if ("string" != typeof r3) return false;
            var i3 = c2(r3);
            if (s2(i3, h2, v2)) return true;
            for (var o2 = null, a2 = v2; a2 < y2; ++a2) {
              var u2 = (function(e4, t4, n4, r4, i4, o3) {
                for (var a3 = Math.min(e4.length, r4.length), u3 = -1, s3 = 0; s3 < a3; ++s3) {
                  var c3 = t4[s3];
                  if (c3 !== r4[s3]) return i4(e4[s3], n4[s3]) < 0 ? e4.substr(0, s3) + n4[s3] + n4.substr(s3 + 1) : i4(e4[s3], r4[s3]) < 0 ? e4.substr(0, s3) + r4[s3] + n4.substr(s3 + 1) : 0 <= u3 ? e4.substr(0, u3) + t4[u3] + n4.substr(u3 + 1) : null;
                  i4(e4[s3], c3) < 0 && (u3 = s3);
                }
                return a3 < r4.length && "next" === o3 ? e4 + n4.substr(e4.length) : a3 < e4.length && "prev" === o3 ? e4.substr(0, n4.length) : u3 < 0 ? null : e4.substr(0, u3) + r4[u3] + n4.substr(u3 + 1);
              })(r3, i3, f2[a2], h2[a2], l2, d2);
              null === u2 && null === o2 ? v2 = a2 + 1 : (null === o2 || 0 < l2(o2, u2)) && (o2 = u2);
            }
            return t3(null !== o2 ? function() {
              e3.continue(o2 + p2);
            } : n3), false;
          }), e2;
        }
        function qt(e2, t2, n2, r2) {
          return { type: 2, lower: e2, upper: t2, lowerOpen: n2, upperOpen: r2 };
        }
        function Dt(e2) {
          return { type: 1, lower: e2, upper: e2 };
        }
        var Bt = (Object.defineProperty(Rt.prototype, "Collection", { get: function() {
          return this._ctx.table.db.Collection;
        }, enumerable: false, configurable: true }), Rt.prototype.between = function(e2, t2, n2, r2) {
          n2 = false !== n2, r2 = true === r2;
          try {
            return 0 < this._cmp(e2, t2) || 0 === this._cmp(e2, t2) && (n2 || r2) && (!n2 || !r2) ? Tt(this) : new this.Collection(this, function() {
              return qt(e2, t2, !n2, !r2);
            });
          } catch (e3) {
            return Ct(this, Je);
          }
        }, Rt.prototype.equals = function(e2) {
          return null == e2 ? Ct(this, Je) : new this.Collection(this, function() {
            return Dt(e2);
          });
        }, Rt.prototype.above = function(e2) {
          return null == e2 ? Ct(this, Je) : new this.Collection(this, function() {
            return qt(e2, void 0, true);
          });
        }, Rt.prototype.aboveOrEqual = function(e2) {
          return null == e2 ? Ct(this, Je) : new this.Collection(this, function() {
            return qt(e2, void 0, false);
          });
        }, Rt.prototype.below = function(e2) {
          return null == e2 ? Ct(this, Je) : new this.Collection(this, function() {
            return qt(void 0, e2, false, true);
          });
        }, Rt.prototype.belowOrEqual = function(e2) {
          return null == e2 ? Ct(this, Je) : new this.Collection(this, function() {
            return qt(void 0, e2);
          });
        }, Rt.prototype.startsWith = function(e2) {
          return "string" != typeof e2 ? Ct(this, Ze) : this.between(e2, e2 + He, true, true);
        }, Rt.prototype.startsWithIgnoreCase = function(e2) {
          return "" === e2 ? this.startsWith(e2) : It(this, function(e3, t2) {
            return 0 === e3.indexOf(t2[0]);
          }, [e2], He);
        }, Rt.prototype.equalsIgnoreCase = function(e2) {
          return It(this, function(e3, t2) {
            return e3 === t2[0];
          }, [e2], "");
        }, Rt.prototype.anyOfIgnoreCase = function() {
          var e2 = D.apply(q, arguments);
          return 0 === e2.length ? Tt(this) : It(this, function(e3, t2) {
            return -1 !== t2.indexOf(e3);
          }, e2, "");
        }, Rt.prototype.startsWithAnyOfIgnoreCase = function() {
          var e2 = D.apply(q, arguments);
          return 0 === e2.length ? Tt(this) : It(this, function(t2, e3) {
            return e3.some(function(e4) {
              return 0 === t2.indexOf(e4);
            });
          }, e2, He);
        }, Rt.prototype.anyOf = function() {
          var t2 = this, i2 = D.apply(q, arguments), o2 = this._cmp;
          try {
            i2.sort(o2);
          } catch (e3) {
            return Ct(this, Je);
          }
          if (0 === i2.length) return Tt(this);
          var e2 = new this.Collection(this, function() {
            return qt(i2[0], i2[i2.length - 1]);
          });
          e2._ondirectionchange = function(e3) {
            o2 = "next" === e3 ? t2._ascending : t2._descending, i2.sort(o2);
          };
          var a2 = 0;
          return e2._addAlgorithm(function(e3, t3, n2) {
            for (var r2 = e3.key; 0 < o2(r2, i2[a2]); ) if (++a2 === i2.length) return t3(n2), false;
            return 0 === o2(r2, i2[a2]) || (t3(function() {
              e3.continue(i2[a2]);
            }), false);
          }), e2;
        }, Rt.prototype.notEqual = function(e2) {
          return this.inAnyRange([[-1 / 0, e2], [e2, this.db._maxKey]], { includeLowers: false, includeUppers: false });
        }, Rt.prototype.noneOf = function() {
          var e2 = D.apply(q, arguments);
          if (0 === e2.length) return new this.Collection(this);
          try {
            e2.sort(this._ascending);
          } catch (e3) {
            return Ct(this, Je);
          }
          var t2 = e2.reduce(function(e3, t3) {
            return e3 ? e3.concat([[e3[e3.length - 1][1], t3]]) : [[-1 / 0, t3]];
          }, null);
          return t2.push([e2[e2.length - 1], this.db._maxKey]), this.inAnyRange(t2, { includeLowers: false, includeUppers: false });
        }, Rt.prototype.inAnyRange = function(e2, t2) {
          var o2 = this, a2 = this._cmp, u2 = this._ascending, n2 = this._descending, s2 = this._min, c2 = this._max;
          if (0 === e2.length) return Tt(this);
          if (!e2.every(function(e3) {
            return void 0 !== e3[0] && void 0 !== e3[1] && u2(e3[0], e3[1]) <= 0;
          })) return Ct(this, "First argument to inAnyRange() must be an Array of two-value Arrays [lower,upper] where upper must not be lower than lower", Y.InvalidArgument);
          var r2 = !t2 || false !== t2.includeLowers, i2 = t2 && true === t2.includeUppers;
          var l2, f2 = u2;
          function h2(e3, t3) {
            return f2(e3[0], t3[0]);
          }
          try {
            (l2 = e2.reduce(function(e3, t3) {
              for (var n3 = 0, r3 = e3.length; n3 < r3; ++n3) {
                var i3 = e3[n3];
                if (a2(t3[0], i3[1]) < 0 && 0 < a2(t3[1], i3[0])) {
                  i3[0] = s2(i3[0], t3[0]), i3[1] = c2(i3[1], t3[1]);
                  break;
                }
              }
              return n3 === r3 && e3.push(t3), e3;
            }, [])).sort(h2);
          } catch (e3) {
            return Ct(this, Je);
          }
          var d2 = 0, p2 = i2 ? function(e3) {
            return 0 < u2(e3, l2[d2][1]);
          } : function(e3) {
            return 0 <= u2(e3, l2[d2][1]);
          }, y2 = r2 ? function(e3) {
            return 0 < n2(e3, l2[d2][0]);
          } : function(e3) {
            return 0 <= n2(e3, l2[d2][0]);
          };
          var v2 = p2, e2 = new this.Collection(this, function() {
            return qt(l2[0][0], l2[l2.length - 1][1], !r2, !i2);
          });
          return e2._ondirectionchange = function(e3) {
            f2 = "next" === e3 ? (v2 = p2, u2) : (v2 = y2, n2), l2.sort(h2);
          }, e2._addAlgorithm(function(e3, t3, n3) {
            for (var r3, i3 = e3.key; v2(i3); ) if (++d2 === l2.length) return t3(n3), false;
            return !p2(r3 = i3) && !y2(r3) || (0 === o2._cmp(i3, l2[d2][1]) || 0 === o2._cmp(i3, l2[d2][0]) || t3(function() {
              f2 === u2 ? e3.continue(l2[d2][0]) : e3.continue(l2[d2][1]);
            }), false);
          }), e2;
        }, Rt.prototype.startsWithAnyOf = function() {
          var e2 = D.apply(q, arguments);
          return e2.every(function(e3) {
            return "string" == typeof e3;
          }) ? 0 === e2.length ? Tt(this) : this.inAnyRange(e2.map(function(e3) {
            return [e3, e3 + He];
          })) : Ct(this, "startsWithAnyOf() only works with strings");
        }, Rt);
        function Rt() {
        }
        function Ft(t2) {
          return Ie(function(e2) {
            return Mt(e2), t2(e2.target.error), false;
          });
        }
        function Mt(e2) {
          e2.stopPropagation && e2.stopPropagation(), e2.preventDefault && e2.preventDefault();
        }
        var Nt = "storagemutated", Lt = "x-storagemutated-1", Ut = mt(null, Nt), Vt = (zt.prototype._lock = function() {
          return y(!me.global), ++this._reculock, 1 !== this._reculock || me.global || (me.lockOwnerFor = this), this;
        }, zt.prototype._unlock = function() {
          if (y(!me.global), 0 == --this._reculock) for (me.global || (me.lockOwnerFor = null); 0 < this._blockedFuncs.length && !this._locked(); ) {
            var e2 = this._blockedFuncs.shift();
            try {
              $e(e2[1], e2[0]);
            } catch (e3) {
            }
          }
          return this;
        }, zt.prototype._locked = function() {
          return this._reculock && me.lockOwnerFor !== this;
        }, zt.prototype.create = function(t2) {
          var n2 = this;
          if (!this.mode) return this;
          var e2 = this.db.idbdb, r2 = this.db._state.dbOpenError;
          if (y(!this.idbtrans), !t2 && !e2) switch (r2 && r2.name) {
            case "DatabaseClosedError":
              throw new Y.DatabaseClosed(r2);
            case "MissingAPIError":
              throw new Y.MissingAPI(r2.message, r2);
            default:
              throw new Y.OpenFailed(r2);
          }
          if (!this.active) throw new Y.TransactionInactive();
          return y(null === this._completion._state), (t2 = this.idbtrans = t2 || (this.db.core || e2).transaction(this.storeNames, this.mode, { durability: this.chromeTransactionDurability })).onerror = Ie(function(e3) {
            Mt(e3), n2._reject(t2.error);
          }), t2.onabort = Ie(function(e3) {
            Mt(e3), n2.active && n2._reject(new Y.Abort(t2.error)), n2.active = false, n2.on("abort").fire(e3);
          }), t2.oncomplete = Ie(function() {
            n2.active = false, n2._resolve(), "mutatedParts" in t2 && Ut.storagemutated.fire(t2.mutatedParts);
          }), this;
        }, zt.prototype._promise = function(n2, r2, i2) {
          var o2 = this;
          if ("readwrite" === n2 && "readwrite" !== this.mode) return Xe(new Y.ReadOnly("Transaction is readonly"));
          if (!this.active) return Xe(new Y.TransactionInactive());
          if (this._locked()) return new _e(function(e3, t2) {
            o2._blockedFuncs.push([function() {
              o2._promise(n2, r2, i2).then(e3, t2);
            }, me]);
          });
          if (i2) return Ne(function() {
            var e3 = new _e(function(e4, t2) {
              o2._lock();
              var n3 = r2(e4, t2, o2);
              n3 && n3.then && n3.then(e4, t2);
            });
            return e3.finally(function() {
              return o2._unlock();
            }), e3._lib = true, e3;
          });
          var e2 = new _e(function(e3, t2) {
            var n3 = r2(e3, t2, o2);
            n3 && n3.then && n3.then(e3, t2);
          });
          return e2._lib = true, e2;
        }, zt.prototype._root = function() {
          return this.parent ? this.parent._root() : this;
        }, zt.prototype.waitFor = function(e2) {
          var t2, r2 = this._root(), i2 = _e.resolve(e2);
          r2._waitingFor ? r2._waitingFor = r2._waitingFor.then(function() {
            return i2;
          }) : (r2._waitingFor = i2, r2._waitingQueue = [], t2 = r2.idbtrans.objectStore(r2.storeNames[0]), (function e3() {
            for (++r2._spinCount; r2._waitingQueue.length; ) r2._waitingQueue.shift()();
            r2._waitingFor && (t2.get(-1 / 0).onsuccess = e3);
          })());
          var o2 = r2._waitingFor;
          return new _e(function(t3, n2) {
            i2.then(function(e3) {
              return r2._waitingQueue.push(Ie(t3.bind(null, e3)));
            }, function(e3) {
              return r2._waitingQueue.push(Ie(n2.bind(null, e3)));
            }).finally(function() {
              r2._waitingFor === o2 && (r2._waitingFor = null);
            });
          });
        }, zt.prototype.abort = function() {
          this.active && (this.active = false, this.idbtrans && this.idbtrans.abort(), this._reject(new Y.Abort()));
        }, zt.prototype.table = function(e2) {
          var t2 = this._memoizedTables || (this._memoizedTables = {});
          if (m(t2, e2)) return t2[e2];
          var n2 = this.schema[e2];
          if (!n2) throw new Y.NotFound("Table " + e2 + " not part of transaction");
          n2 = new this.db.Table(e2, n2, this);
          return n2.core = this.db.core.table(e2), t2[e2] = n2;
        }, zt);
        function zt() {
        }
        function Wt(e2, t2, n2, r2, i2, o2, a2, u2) {
          return { name: e2, keyPath: t2, unique: n2, multi: r2, auto: i2, compound: o2, src: (n2 && !a2 ? "&" : "") + (r2 ? "*" : "") + (i2 ? "++" : "") + Yt(t2), type: u2 };
        }
        function Yt(e2) {
          return "string" == typeof e2 ? e2 : e2 ? "[" + [].join.call(e2, "+") + "]" : "";
        }
        function $t(e2, t2, n2) {
          return { name: e2, primKey: t2, indexes: n2, mappedClass: null, idxByName: (r2 = function(e3) {
            return [e3.name, e3];
          }, n2.reduce(function(e3, t3, n3) {
            n3 = r2(t3, n3);
            return n3 && (e3[n3[0]] = n3[1]), e3;
          }, {})) };
          var r2;
        }
        var Qt = function(e2) {
          try {
            return e2.only([[]]), Qt = function() {
              return [[]];
            }, [[]];
          } catch (e3) {
            return Qt = function() {
              return He;
            }, He;
          }
        };
        function Gt(t2) {
          return null == t2 ? function() {
          } : "string" == typeof t2 ? 1 === (n2 = t2).split(".").length ? function(e2) {
            return e2[n2];
          } : function(e2) {
            return g(e2, n2);
          } : function(e2) {
            return g(e2, t2);
          };
          var n2;
        }
        function Xt(e2) {
          return [].slice.call(e2);
        }
        var Ht = 0;
        function Jt(e2) {
          return null == e2 ? ":id" : "string" == typeof e2 ? e2 : "[".concat(e2.join("+"), "]");
        }
        function Zt(e2, i2, t2) {
          function _2(e3) {
            if (3 === e3.type) return null;
            if (4 === e3.type) throw new Error("Cannot convert never type to IDBKeyRange");
            var t3 = e3.lower, n3 = e3.upper, r3 = e3.lowerOpen, e3 = e3.upperOpen;
            return void 0 === t3 ? void 0 === n3 ? null : i2.upperBound(n3, !!e3) : void 0 === n3 ? i2.lowerBound(t3, !!r3) : i2.bound(t3, n3, !!r3, !!e3);
          }
          function n2(e3) {
            var h2, w2 = e3.name;
            return { name: w2, schema: e3, mutate: function(e4) {
              var y2 = e4.trans, v2 = e4.type, m2 = e4.keys, b2 = e4.values, g2 = e4.range;
              return new Promise(function(t3, e5) {
                t3 = Ie(t3);
                var n3 = y2.objectStore(w2), r3 = null == n3.keyPath, i3 = "put" === v2 || "add" === v2;
                if (!i3 && "delete" !== v2 && "deleteRange" !== v2) throw new Error("Invalid operation type: " + v2);
                var o3, a3 = (m2 || b2 || { length: 1 }).length;
                if (m2 && b2 && m2.length !== b2.length) throw new Error("Given keys array must have same length as given values array.");
                if (0 === a3) return t3({ numFailures: 0, failures: {}, results: [], lastResult: void 0 });
                function u3(e6) {
                  ++l2, Mt(e6);
                }
                var s3 = [], c3 = [], l2 = 0;
                if ("deleteRange" === v2) {
                  if (4 === g2.type) return t3({ numFailures: l2, failures: c3, results: [], lastResult: void 0 });
                  3 === g2.type ? s3.push(o3 = n3.clear()) : s3.push(o3 = n3.delete(_2(g2)));
                } else {
                  var r3 = i3 ? r3 ? [b2, m2] : [b2, null] : [m2, null], f2 = r3[0], h3 = r3[1];
                  if (i3) for (var d2 = 0; d2 < a3; ++d2) s3.push(o3 = h3 && void 0 !== h3[d2] ? n3[v2](f2[d2], h3[d2]) : n3[v2](f2[d2])), o3.onerror = u3;
                  else for (d2 = 0; d2 < a3; ++d2) s3.push(o3 = n3[v2](f2[d2])), o3.onerror = u3;
                }
                function p2(e6) {
                  e6 = e6.target.result, s3.forEach(function(e7, t4) {
                    return null != e7.error && (c3[t4] = e7.error);
                  }), t3({ numFailures: l2, failures: c3, results: "delete" === v2 ? m2 : s3.map(function(e7) {
                    return e7.result;
                  }), lastResult: e6 });
                }
                o3.onerror = function(e6) {
                  u3(e6), p2(e6);
                }, o3.onsuccess = p2;
              });
            }, getMany: function(e4) {
              var f2 = e4.trans, h3 = e4.keys;
              return new Promise(function(t3, e5) {
                t3 = Ie(t3);
                for (var n3, r3 = f2.objectStore(w2), i3 = h3.length, o3 = new Array(i3), a3 = 0, u3 = 0, s3 = function(e6) {
                  e6 = e6.target;
                  o3[e6._pos] = e6.result, ++u3 === a3 && t3(o3);
                }, c3 = Ft(e5), l2 = 0; l2 < i3; ++l2) null != h3[l2] && ((n3 = r3.get(h3[l2]))._pos = l2, n3.onsuccess = s3, n3.onerror = c3, ++a3);
                0 === a3 && t3(o3);
              });
            }, get: function(e4) {
              var r3 = e4.trans, i3 = e4.key;
              return new Promise(function(t3, e5) {
                t3 = Ie(t3);
                var n3 = r3.objectStore(w2).get(i3);
                n3.onsuccess = function(e6) {
                  return t3(e6.target.result);
                }, n3.onerror = Ft(e5);
              });
            }, query: (h2 = s2, function(f2) {
              return new Promise(function(n3, e4) {
                n3 = Ie(n3);
                var r3, i3, o3, t3 = f2.trans, a3 = f2.values, u3 = f2.limit, s3 = f2.query, c3 = u3 === 1 / 0 ? void 0 : u3, l2 = s3.index, s3 = s3.range, t3 = t3.objectStore(w2), l2 = l2.isPrimaryKey ? t3 : t3.index(l2.name), s3 = _2(s3);
                if (0 === u3) return n3({ result: [] });
                h2 ? ((c3 = a3 ? l2.getAll(s3, c3) : l2.getAllKeys(s3, c3)).onsuccess = function(e5) {
                  return n3({ result: e5.target.result });
                }, c3.onerror = Ft(e4)) : (r3 = 0, i3 = !a3 && "openKeyCursor" in l2 ? l2.openKeyCursor(s3) : l2.openCursor(s3), o3 = [], i3.onsuccess = function(e5) {
                  var t4 = i3.result;
                  return t4 ? (o3.push(a3 ? t4.value : t4.primaryKey), ++r3 === u3 ? n3({ result: o3 }) : void t4.continue()) : n3({ result: o3 });
                }, i3.onerror = Ft(e4));
              });
            }), openCursor: function(e4) {
              var c3 = e4.trans, o3 = e4.values, a3 = e4.query, u3 = e4.reverse, l2 = e4.unique;
              return new Promise(function(t3, n3) {
                t3 = Ie(t3);
                var e5 = a3.index, r3 = a3.range, i3 = c3.objectStore(w2), i3 = e5.isPrimaryKey ? i3 : i3.index(e5.name), e5 = u3 ? l2 ? "prevunique" : "prev" : l2 ? "nextunique" : "next", s3 = !o3 && "openKeyCursor" in i3 ? i3.openKeyCursor(_2(r3), e5) : i3.openCursor(_2(r3), e5);
                s3.onerror = Ft(n3), s3.onsuccess = Ie(function(e6) {
                  var r4, i4, o4, a4, u4 = s3.result;
                  u4 ? (u4.___id = ++Ht, u4.done = false, r4 = u4.continue.bind(u4), i4 = (i4 = u4.continuePrimaryKey) && i4.bind(u4), o4 = u4.advance.bind(u4), a4 = function() {
                    throw new Error("Cursor not stopped");
                  }, u4.trans = c3, u4.stop = u4.continue = u4.continuePrimaryKey = u4.advance = function() {
                    throw new Error("Cursor not started");
                  }, u4.fail = Ie(n3), u4.next = function() {
                    var e7 = this, t4 = 1;
                    return this.start(function() {
                      return t4-- ? e7.continue() : e7.stop();
                    }).then(function() {
                      return e7;
                    });
                  }, u4.start = function(e7) {
                    function t4() {
                      if (s3.result) try {
                        e7();
                      } catch (e8) {
                        u4.fail(e8);
                      }
                      else u4.done = true, u4.start = function() {
                        throw new Error("Cursor behind last entry");
                      }, u4.stop();
                    }
                    var n4 = new Promise(function(t5, e8) {
                      t5 = Ie(t5), s3.onerror = Ft(e8), u4.fail = e8, u4.stop = function(e9) {
                        u4.stop = u4.continue = u4.continuePrimaryKey = u4.advance = a4, t5(e9);
                      };
                    });
                    return s3.onsuccess = Ie(function(e8) {
                      s3.onsuccess = t4, t4();
                    }), u4.continue = r4, u4.continuePrimaryKey = i4, u4.advance = o4, t4(), n4;
                  }, t3(u4)) : t3(null);
                }, n3);
              });
            }, count: function(e4) {
              var t3 = e4.query, i3 = e4.trans, o3 = t3.index, a3 = t3.range;
              return new Promise(function(t4, e5) {
                var n3 = i3.objectStore(w2), r3 = o3.isPrimaryKey ? n3 : n3.index(o3.name), n3 = _2(a3), r3 = n3 ? r3.count(n3) : r3.count();
                r3.onsuccess = Ie(function(e6) {
                  return t4(e6.target.result);
                }), r3.onerror = Ft(e5);
              });
            } };
          }
          var r2, o2, a2, u2 = (o2 = t2, a2 = Xt((r2 = e2).objectStoreNames), { schema: { name: r2.name, tables: a2.map(function(e3) {
            return o2.objectStore(e3);
          }).map(function(t3) {
            var e3 = t3.keyPath, n3 = t3.autoIncrement, r3 = x(e3), i3 = {}, n3 = { name: t3.name, primaryKey: { name: null, isPrimaryKey: true, outbound: null == e3, compound: r3, keyPath: e3, autoIncrement: n3, unique: true, extractKey: Gt(e3) }, indexes: Xt(t3.indexNames).map(function(e4) {
              return t3.index(e4);
            }).map(function(e4) {
              var t4 = e4.name, n4 = e4.unique, r4 = e4.multiEntry, e4 = e4.keyPath, r4 = { name: t4, compound: x(e4), keyPath: e4, unique: n4, multiEntry: r4, extractKey: Gt(e4) };
              return i3[Jt(e4)] = r4;
            }), getIndexByKeyPath: function(e4) {
              return i3[Jt(e4)];
            } };
            return i3[":id"] = n3.primaryKey, null != e3 && (i3[Jt(e3)] = n3.primaryKey), n3;
          }) }, hasGetAll: 0 < a2.length && "getAll" in o2.objectStore(a2[0]) && !("undefined" != typeof navigator && /Safari/.test(navigator.userAgent) && !/(Chrome\/|Edge\/)/.test(navigator.userAgent) && [].concat(navigator.userAgent.match(/Safari\/(\d*)/))[1] < 604) }), t2 = u2.schema, s2 = u2.hasGetAll, u2 = t2.tables.map(n2), c2 = {};
          return u2.forEach(function(e3) {
            return c2[e3.name] = e3;
          }), { stack: "dbcore", transaction: e2.transaction.bind(e2), table: function(e3) {
            if (!c2[e3]) throw new Error("Table '".concat(e3, "' not found"));
            return c2[e3];
          }, MIN_KEY: -1 / 0, MAX_KEY: Qt(i2), schema: t2 };
        }
        function en(e2, t2, n2, r2) {
          var i2 = n2.IDBKeyRange;
          return n2.indexedDB, { dbcore: (r2 = Zt(t2, i2, r2), e2.dbcore.reduce(function(e3, t3) {
            t3 = t3.create;
            return _(_({}, e3), t3(e3));
          }, r2)) };
        }
        function tn(n2, e2) {
          var t2 = e2.db, e2 = en(n2._middlewares, t2, n2._deps, e2);
          n2.core = e2.dbcore, n2.tables.forEach(function(e3) {
            var t3 = e3.name;
            n2.core.schema.tables.some(function(e4) {
              return e4.name === t3;
            }) && (e3.core = n2.core.table(t3), n2[t3] instanceof n2.Table && (n2[t3].core = e3.core));
          });
        }
        function nn(i2, e2, t2, o2) {
          t2.forEach(function(n2) {
            var r2 = o2[n2];
            e2.forEach(function(e3) {
              var t3 = (function e4(t4, n3) {
                return h(t4, n3) || (t4 = c(t4)) && e4(t4, n3);
              })(e3, n2);
              (!t3 || "value" in t3 && void 0 === t3.value) && (e3 === i2.Transaction.prototype || e3 instanceof i2.Transaction ? l(e3, n2, { get: function() {
                return this.table(n2);
              }, set: function(e4) {
                u(this, n2, { value: e4, writable: true, configurable: true, enumerable: true });
              } }) : e3[n2] = new i2.Table(n2, r2));
            });
          });
        }
        function rn(n2, e2) {
          e2.forEach(function(e3) {
            for (var t2 in e3) e3[t2] instanceof n2.Table && delete e3[t2];
          });
        }
        function on(e2, t2) {
          return e2._cfg.version - t2._cfg.version;
        }
        function an(n2, r2, i2, e2) {
          var o2 = n2._dbSchema;
          i2.objectStoreNames.contains("$meta") && !o2.$meta && (o2.$meta = $t("$meta", pn("")[0], []), n2._storeNames.push("$meta"));
          var a2 = n2._createTransaction("readwrite", n2._storeNames, o2);
          a2.create(i2), a2._completion.catch(e2);
          var u2 = a2._reject.bind(a2), s2 = me.transless || me;
          Ne(function() {
            return me.trans = a2, me.transless = s2, 0 !== r2 ? (tn(n2, i2), t2 = r2, ((e3 = a2).storeNames.includes("$meta") ? e3.table("$meta").get("version").then(function(e4) {
              return null != e4 ? e4 : t2;
            }) : _e.resolve(t2)).then(function(e4) {
              return c2 = e4, l2 = a2, f2 = i2, t3 = [], e4 = (s3 = n2)._versions, h2 = s3._dbSchema = hn(0, s3.idbdb, f2), 0 !== (e4 = e4.filter(function(e5) {
                return e5._cfg.version >= c2;
              })).length ? (e4.forEach(function(u3) {
                t3.push(function() {
                  var t4 = h2, e5 = u3._cfg.dbschema;
                  dn(s3, t4, f2), dn(s3, e5, f2), h2 = s3._dbSchema = e5;
                  var n3 = sn(t4, e5);
                  n3.add.forEach(function(e6) {
                    cn(f2, e6[0], e6[1].primKey, e6[1].indexes);
                  }), n3.change.forEach(function(e6) {
                    if (e6.recreate) throw new Y.Upgrade("Not yet support for changing primary key");
                    var t5 = f2.objectStore(e6.name);
                    e6.add.forEach(function(e7) {
                      return fn(t5, e7);
                    }), e6.change.forEach(function(e7) {
                      t5.deleteIndex(e7.name), fn(t5, e7);
                    }), e6.del.forEach(function(e7) {
                      return t5.deleteIndex(e7);
                    });
                  });
                  var r3 = u3._cfg.contentUpgrade;
                  if (r3 && u3._cfg.version > c2) {
                    tn(s3, f2), l2._memoizedTables = {};
                    var i3 = k(e5);
                    n3.del.forEach(function(e6) {
                      i3[e6] = t4[e6];
                    }), rn(s3, [s3.Transaction.prototype]), nn(s3, [s3.Transaction.prototype], O(i3), i3), l2.schema = i3;
                    var o3, a3 = B(r3);
                    a3 && Le();
                    n3 = _e.follow(function() {
                      var e6;
                      (o3 = r3(l2)) && a3 && (e6 = Ue.bind(null, null), o3.then(e6, e6));
                    });
                    return o3 && "function" == typeof o3.then ? _e.resolve(o3) : n3.then(function() {
                      return o3;
                    });
                  }
                }), t3.push(function(e5) {
                  var t4, n3, r3 = u3._cfg.dbschema;
                  t4 = r3, n3 = e5, [].slice.call(n3.db.objectStoreNames).forEach(function(e6) {
                    return null == t4[e6] && n3.db.deleteObjectStore(e6);
                  }), rn(s3, [s3.Transaction.prototype]), nn(s3, [s3.Transaction.prototype], s3._storeNames, s3._dbSchema), l2.schema = s3._dbSchema;
                }), t3.push(function(e5) {
                  s3.idbdb.objectStoreNames.contains("$meta") && (Math.ceil(s3.idbdb.version / 10) === u3._cfg.version ? (s3.idbdb.deleteObjectStore("$meta"), delete s3._dbSchema.$meta, s3._storeNames = s3._storeNames.filter(function(e6) {
                    return "$meta" !== e6;
                  })) : e5.objectStore("$meta").put(u3._cfg.version, "version"));
                });
              }), (function e5() {
                return t3.length ? _e.resolve(t3.shift()(l2.idbtrans)).then(e5) : _e.resolve();
              })().then(function() {
                ln(h2, f2);
              })) : _e.resolve();
              var s3, c2, l2, f2, t3, h2;
            }).catch(u2)) : (O(o2).forEach(function(e4) {
              cn(i2, e4, o2[e4].primKey, o2[e4].indexes);
            }), tn(n2, i2), void _e.follow(function() {
              return n2.on.populate.fire(a2);
            }).catch(u2));
            var e3, t2;
          });
        }
        function un(e2, r2) {
          ln(e2._dbSchema, r2), r2.db.version % 10 != 0 || r2.objectStoreNames.contains("$meta") || r2.db.createObjectStore("$meta").add(Math.ceil(r2.db.version / 10 - 1), "version");
          var t2 = hn(0, e2.idbdb, r2);
          dn(e2, e2._dbSchema, r2);
          for (var n2 = 0, i2 = sn(t2, e2._dbSchema).change; n2 < i2.length; n2++) {
            var o2 = (function(t3) {
              if (t3.change.length || t3.recreate) return console.warn("Unable to patch indexes of table ".concat(t3.name, " because it has changes on the type of index or primary key.")), { value: void 0 };
              var n3 = r2.objectStore(t3.name);
              t3.add.forEach(function(e3) {
                ie && console.debug("Dexie upgrade patch: Creating missing index ".concat(t3.name, ".").concat(e3.src)), fn(n3, e3);
              });
            })(i2[n2]);
            if ("object" == typeof o2) return o2.value;
          }
        }
        function sn(e2, t2) {
          var n2, r2 = { del: [], add: [], change: [] };
          for (n2 in e2) t2[n2] || r2.del.push(n2);
          for (n2 in t2) {
            var i2 = e2[n2], o2 = t2[n2];
            if (i2) {
              var a2 = { name: n2, def: o2, recreate: false, del: [], add: [], change: [] };
              if ("" + (i2.primKey.keyPath || "") != "" + (o2.primKey.keyPath || "") || i2.primKey.auto !== o2.primKey.auto) a2.recreate = true, r2.change.push(a2);
              else {
                var u2 = i2.idxByName, s2 = o2.idxByName, c2 = void 0;
                for (c2 in u2) s2[c2] || a2.del.push(c2);
                for (c2 in s2) {
                  var l2 = u2[c2], f2 = s2[c2];
                  l2 ? l2.src !== f2.src && a2.change.push(f2) : a2.add.push(f2);
                }
                (0 < a2.del.length || 0 < a2.add.length || 0 < a2.change.length) && r2.change.push(a2);
              }
            } else r2.add.push([n2, o2]);
          }
          return r2;
        }
        function cn(e2, t2, n2, r2) {
          var i2 = e2.db.createObjectStore(t2, n2.keyPath ? { keyPath: n2.keyPath, autoIncrement: n2.auto } : { autoIncrement: n2.auto });
          return r2.forEach(function(e3) {
            return fn(i2, e3);
          }), i2;
        }
        function ln(t2, n2) {
          O(t2).forEach(function(e2) {
            n2.db.objectStoreNames.contains(e2) || (ie && console.debug("Dexie: Creating missing table", e2), cn(n2, e2, t2[e2].primKey, t2[e2].indexes));
          });
        }
        function fn(e2, t2) {
          e2.createIndex(t2.name, t2.keyPath, { unique: t2.unique, multiEntry: t2.multi });
        }
        function hn(e2, t2, u2) {
          var s2 = {};
          return b(t2.objectStoreNames, 0).forEach(function(e3) {
            for (var t3 = u2.objectStore(e3), n2 = Wt(Yt(a2 = t3.keyPath), a2 || "", true, false, !!t3.autoIncrement, a2 && "string" != typeof a2, true), r2 = [], i2 = 0; i2 < t3.indexNames.length; ++i2) {
              var o2 = t3.index(t3.indexNames[i2]), a2 = o2.keyPath, o2 = Wt(o2.name, a2, !!o2.unique, !!o2.multiEntry, false, a2 && "string" != typeof a2, false);
              r2.push(o2);
            }
            s2[e3] = $t(e3, n2, r2);
          }), s2;
        }
        function dn(e2, t2, n2) {
          for (var r2 = n2.db.objectStoreNames, i2 = 0; i2 < r2.length; ++i2) {
            var o2 = r2[i2], a2 = n2.objectStore(o2);
            e2._hasGetAll = "getAll" in a2;
            for (var u2 = 0; u2 < a2.indexNames.length; ++u2) {
              var s2 = a2.indexNames[u2], c2 = a2.index(s2).keyPath, l2 = "string" == typeof c2 ? c2 : "[" + b(c2).join("+") + "]";
              !t2[o2] || (c2 = t2[o2].idxByName[l2]) && (c2.name = s2, delete t2[o2].idxByName[l2], t2[o2].idxByName[s2] = c2);
            }
          }
          "undefined" != typeof navigator && /Safari/.test(navigator.userAgent) && !/(Chrome\/|Edge\/)/.test(navigator.userAgent) && f.WorkerGlobalScope && f instanceof f.WorkerGlobalScope && [].concat(navigator.userAgent.match(/Safari\/(\d*)/))[1] < 604 && (e2._hasGetAll = false);
        }
        function pn(e2) {
          return e2.split(",").map(function(e3, t2) {
            var n2 = e3.split(":"), r2 = null === (i2 = n2[1]) || void 0 === i2 ? void 0 : i2.trim(), i2 = (e3 = n2[0].trim()).replace(/([&*]|\+\+)/g, ""), n2 = /^\[/.test(i2) ? i2.match(/^\[(.*)\]$/)[1].split("+") : i2;
            return Wt(i2, n2 || null, /\&/.test(e3), /\*/.test(e3), /\+\+/.test(e3), x(n2), 0 === t2, r2);
          });
        }
        var yn = (vn.prototype._createTableSchema = $t, vn.prototype._parseIndexSyntax = pn, vn.prototype._parseStoresSpec = function(r2, i2) {
          var o2 = this;
          O(r2).forEach(function(e2) {
            if (null !== r2[e2]) {
              var t2 = o2._parseIndexSyntax(r2[e2]), n2 = t2.shift();
              if (!n2) throw new Y.Schema("Invalid schema for table " + e2 + ": " + r2[e2]);
              if (n2.unique = true, n2.multi) throw new Y.Schema("Primary key cannot be multiEntry*");
              t2.forEach(function(e3) {
                if (e3.auto) throw new Y.Schema("Only primary key can be marked as autoIncrement (++)");
                if (!e3.keyPath) throw new Y.Schema("Index must have a name and cannot be an empty string");
              });
              t2 = o2._createTableSchema(e2, n2, t2);
              i2[e2] = t2;
            }
          });
        }, vn.prototype.stores = function(e2) {
          var t2 = this.db;
          this._cfg.storesSource = this._cfg.storesSource ? a(this._cfg.storesSource, e2) : e2;
          var e2 = t2._versions, n2 = {}, r2 = {};
          return e2.forEach(function(e3) {
            a(n2, e3._cfg.storesSource), r2 = e3._cfg.dbschema = {}, e3._parseStoresSpec(n2, r2);
          }), t2._dbSchema = r2, rn(t2, [t2._allTables, t2, t2.Transaction.prototype]), nn(t2, [t2._allTables, t2, t2.Transaction.prototype, this._cfg.tables], O(r2), r2), t2._storeNames = O(r2), this;
        }, vn.prototype.upgrade = function(e2) {
          return this._cfg.contentUpgrade = re(this._cfg.contentUpgrade || G, e2), this;
        }, vn);
        function vn() {
        }
        function mn(e2, t2) {
          var n2 = e2._dbNamesDB;
          return n2 || (n2 = e2._dbNamesDB = new nr(tt, { addons: [], indexedDB: e2, IDBKeyRange: t2 })).version(1).stores({ dbnames: "name" }), n2.table("dbnames");
        }
        function bn(e2) {
          return e2 && "function" == typeof e2.databases;
        }
        function gn(e2) {
          return Ne(function() {
            return me.letThrough = true, e2();
          });
        }
        function wn(e2) {
          return !("from" in e2);
        }
        var _n = function(e2, t2) {
          if (!this) {
            var n2 = new _n();
            return e2 && "d" in e2 && a(n2, e2), n2;
          }
          a(this, arguments.length ? { d: 1, from: e2, to: 1 < arguments.length ? t2 : e2 } : { d: 0 });
        };
        function xn(e2, t2, n2) {
          var r2 = st(t2, n2);
          if (!isNaN(r2)) {
            if (0 < r2) throw RangeError();
            if (wn(e2)) return a(e2, { from: t2, to: n2, d: 1 });
            var i2 = e2.l, r2 = e2.r;
            if (st(n2, e2.from) < 0) return i2 ? xn(i2, t2, n2) : e2.l = { from: t2, to: n2, d: 1, l: null, r: null }, Kn(e2);
            if (0 < st(t2, e2.to)) return r2 ? xn(r2, t2, n2) : e2.r = { from: t2, to: n2, d: 1, l: null, r: null }, Kn(e2);
            st(t2, e2.from) < 0 && (e2.from = t2, e2.l = null, e2.d = r2 ? r2.d + 1 : 1), 0 < st(n2, e2.to) && (e2.to = n2, e2.r = null, e2.d = e2.l ? e2.l.d + 1 : 1);
            n2 = !e2.r;
            i2 && !e2.l && kn(e2, i2), r2 && n2 && kn(e2, r2);
          }
        }
        function kn(e2, t2) {
          wn(t2) || (function e3(t3, n2) {
            var r2 = n2.from, i2 = n2.to, o2 = n2.l, n2 = n2.r;
            xn(t3, r2, i2), o2 && e3(t3, o2), n2 && e3(t3, n2);
          })(e2, t2);
        }
        function On(e2, t2) {
          var n2 = Pn(t2), r2 = n2.next();
          if (r2.done) return false;
          for (var i2 = r2.value, o2 = Pn(e2), a2 = o2.next(i2.from), u2 = a2.value; !r2.done && !a2.done; ) {
            if (st(u2.from, i2.to) <= 0 && 0 <= st(u2.to, i2.from)) return true;
            st(i2.from, u2.from) < 0 ? i2 = (r2 = n2.next(u2.from)).value : u2 = (a2 = o2.next(i2.from)).value;
          }
          return false;
        }
        function Pn(e2) {
          var n2 = wn(e2) ? null : { s: 0, n: e2 };
          return { next: function(e3) {
            for (var t2 = 0 < arguments.length; n2; ) switch (n2.s) {
              case 0:
                if (n2.s = 1, t2) for (; n2.n.l && st(e3, n2.n.from) < 0; ) n2 = { up: n2, n: n2.n.l, s: 1 };
                else for (; n2.n.l; ) n2 = { up: n2, n: n2.n.l, s: 1 };
              case 1:
                if (n2.s = 2, !t2 || st(e3, n2.n.to) <= 0) return { value: n2.n, done: false };
              case 2:
                if (n2.n.r) {
                  n2.s = 3, n2 = { up: n2, n: n2.n.r, s: 0 };
                  continue;
                }
              case 3:
                n2 = n2.up;
            }
            return { done: true };
          } };
        }
        function Kn(e2) {
          var t2, n2, r2 = ((null === (t2 = e2.r) || void 0 === t2 ? void 0 : t2.d) || 0) - ((null === (n2 = e2.l) || void 0 === n2 ? void 0 : n2.d) || 0), i2 = 1 < r2 ? "r" : r2 < -1 ? "l" : "";
          i2 && (t2 = "r" == i2 ? "l" : "r", n2 = _({}, e2), r2 = e2[i2], e2.from = r2.from, e2.to = r2.to, e2[i2] = r2[i2], n2[i2] = r2[t2], (e2[t2] = n2).d = En(n2)), e2.d = En(e2);
        }
        function En(e2) {
          var t2 = e2.r, e2 = e2.l;
          return (t2 ? e2 ? Math.max(t2.d, e2.d) : t2.d : e2 ? e2.d : 0) + 1;
        }
        function Sn(t2, n2) {
          return O(n2).forEach(function(e2) {
            t2[e2] ? kn(t2[e2], n2[e2]) : t2[e2] = (function e3(t3) {
              var n3, r2, i2 = {};
              for (n3 in t3) m(t3, n3) && (r2 = t3[n3], i2[n3] = !r2 || "object" != typeof r2 || K.has(r2.constructor) ? r2 : e3(r2));
              return i2;
            })(n2[e2]);
          }), t2;
        }
        function jn(t2, n2) {
          return t2.all || n2.all || Object.keys(t2).some(function(e2) {
            return n2[e2] && On(n2[e2], t2[e2]);
          });
        }
        r(_n.prototype, ((F = { add: function(e2) {
          return kn(this, e2), this;
        }, addKey: function(e2) {
          return xn(this, e2, e2), this;
        }, addKeys: function(e2) {
          var t2 = this;
          return e2.forEach(function(e3) {
            return xn(t2, e3, e3);
          }), this;
        }, hasKey: function(e2) {
          var t2 = Pn(this).next(e2).value;
          return t2 && st(t2.from, e2) <= 0 && 0 <= st(t2.to, e2);
        } })[C] = function() {
          return Pn(this);
        }, F));
        var An = {}, Cn = {}, Tn = false;
        function In(e2) {
          Sn(Cn, e2), Tn || (Tn = true, setTimeout(function() {
            Tn = false, qn(Cn, !(Cn = {}));
          }, 0));
        }
        function qn(e2, t2) {
          void 0 === t2 && (t2 = false);
          var n2 = new Set();
          if (e2.all) for (var r2 = 0, i2 = Object.values(An); r2 < i2.length; r2++) Dn(a2 = i2[r2], e2, n2, t2);
          else for (var o2 in e2) {
            var a2, u2 = /^idb\:\/\/(.*)\/(.*)\//.exec(o2);
            u2 && (o2 = u2[1], u2 = u2[2], (a2 = An["idb://".concat(o2, "/").concat(u2)]) && Dn(a2, e2, n2, t2));
          }
          n2.forEach(function(e3) {
            return e3();
          });
        }
        function Dn(e2, t2, n2, r2) {
          for (var i2 = [], o2 = 0, a2 = Object.entries(e2.queries.query); o2 < a2.length; o2++) {
            for (var u2 = a2[o2], s2 = u2[0], c2 = [], l2 = 0, f2 = u2[1]; l2 < f2.length; l2++) {
              var h2 = f2[l2];
              jn(t2, h2.obsSet) ? h2.subscribers.forEach(function(e3) {
                return n2.add(e3);
              }) : r2 && c2.push(h2);
            }
            r2 && i2.push([s2, c2]);
          }
          if (r2) for (var d2 = 0, p2 = i2; d2 < p2.length; d2++) {
            var y2 = p2[d2], s2 = y2[0], c2 = y2[1];
            e2.queries.query[s2] = c2;
          }
        }
        function Bn(f2) {
          var h2 = f2._state, r2 = f2._deps.indexedDB;
          if (h2.isBeingOpened || f2.idbdb) return h2.dbReadyPromise.then(function() {
            return h2.dbOpenError ? Xe(h2.dbOpenError) : f2;
          });
          h2.isBeingOpened = true, h2.dbOpenError = null, h2.openComplete = false;
          var t2 = h2.openCanceller, d2 = Math.round(10 * f2.verno), p2 = false;
          function e2() {
            if (h2.openCanceller !== t2) throw new Y.DatabaseClosed("db.open() was cancelled");
          }
          function y2() {
            return new _e(function(s2, n3) {
              if (e2(), !r2) throw new Y.MissingAPI();
              var c2 = f2.name, l2 = h2.autoSchema || !d2 ? r2.open(c2) : r2.open(c2, d2);
              if (!l2) throw new Y.MissingAPI();
              l2.onerror = Ft(n3), l2.onblocked = Ie(f2._fireOnBlocked), l2.onupgradeneeded = Ie(function(e3) {
                var t3;
                v2 = l2.transaction, h2.autoSchema && !f2._options.allowEmptyDB ? (l2.onerror = Mt, v2.abort(), l2.result.close(), (t3 = r2.deleteDatabase(c2)).onsuccess = t3.onerror = Ie(function() {
                  n3(new Y.NoSuchDatabase("Database ".concat(c2, " doesnt exist")));
                })) : (v2.onerror = Ft(n3), e3 = e3.oldVersion > Math.pow(2, 62) ? 0 : e3.oldVersion, m2 = e3 < 1, f2.idbdb = l2.result, p2 && un(f2, v2), an(f2, e3 / 10, v2, n3));
              }, n3), l2.onsuccess = Ie(function() {
                v2 = null;
                var e3, t3, n4, r3, i3, o2 = f2.idbdb = l2.result, a2 = b(o2.objectStoreNames);
                if (0 < a2.length) try {
                  var u2 = o2.transaction(1 === (r3 = a2).length ? r3[0] : r3, "readonly");
                  if (h2.autoSchema) t3 = o2, n4 = u2, (e3 = f2).verno = t3.version / 10, n4 = e3._dbSchema = hn(0, t3, n4), e3._storeNames = b(t3.objectStoreNames, 0), nn(e3, [e3._allTables], O(n4), n4);
                  else if (dn(f2, f2._dbSchema, u2), ((i3 = sn(hn(0, (i3 = f2).idbdb, u2), i3._dbSchema)).add.length || i3.change.some(function(e4) {
                    return e4.add.length || e4.change.length;
                  })) && !p2) return console.warn("Dexie SchemaDiff: Schema was extended without increasing the number passed to db.version(). Dexie will add missing parts and increment native version number to workaround this."), o2.close(), d2 = o2.version + 1, p2 = true, s2(y2());
                  tn(f2, u2);
                } catch (e4) {
                }
                et.push(f2), o2.onversionchange = Ie(function(e4) {
                  h2.vcFired = true, f2.on("versionchange").fire(e4);
                }), o2.onclose = Ie(function() {
                  f2.close({ disableAutoOpen: false });
                }), m2 && (i3 = f2._deps, u2 = c2, o2 = i3.indexedDB, i3 = i3.IDBKeyRange, bn(o2) || u2 === tt || mn(o2, i3).put({ name: u2 }).catch(G)), s2();
              }, n3);
            }).catch(function(e3) {
              switch (null == e3 ? void 0 : e3.name) {
                case "UnknownError":
                  if (0 < h2.PR1398_maxLoop) return h2.PR1398_maxLoop--, console.warn("Dexie: Workaround for Chrome UnknownError on open()"), y2();
                  break;
                case "VersionError":
                  if (0 < d2) return d2 = 0, y2();
              }
              return _e.reject(e3);
            });
          }
          var n2, i2 = h2.dbReadyResolve, v2 = null, m2 = false;
          return _e.race([t2, ("undefined" == typeof navigator ? _e.resolve() : !navigator.userAgentData && /Safari\//.test(navigator.userAgent) && !/Chrom(e|ium)\//.test(navigator.userAgent) && indexedDB.databases ? new Promise(function(e3) {
            function t3() {
              return indexedDB.databases().finally(e3);
            }
            n2 = setInterval(t3, 100), t3();
          }).finally(function() {
            return clearInterval(n2);
          }) : Promise.resolve()).then(y2)]).then(function() {
            return e2(), h2.onReadyBeingFired = [], _e.resolve(gn(function() {
              return f2.on.ready.fire(f2.vip);
            })).then(function e3() {
              if (0 < h2.onReadyBeingFired.length) {
                var t3 = h2.onReadyBeingFired.reduce(re, G);
                return h2.onReadyBeingFired = [], _e.resolve(gn(function() {
                  return t3(f2.vip);
                })).then(e3);
              }
            });
          }).finally(function() {
            h2.openCanceller === t2 && (h2.onReadyBeingFired = null, h2.isBeingOpened = false);
          }).catch(function(e3) {
            h2.dbOpenError = e3;
            try {
              v2 && v2.abort();
            } catch (e4) {
            }
            return t2 === h2.openCanceller && f2._close(), Xe(e3);
          }).finally(function() {
            h2.openComplete = true, i2();
          }).then(function() {
            var n3;
            return m2 && (n3 = {}, f2.tables.forEach(function(t3) {
              t3.schema.indexes.forEach(function(e3) {
                e3.name && (n3["idb://".concat(f2.name, "/").concat(t3.name, "/").concat(e3.name)] = new _n(-1 / 0, [[[]]]));
              }), n3["idb://".concat(f2.name, "/").concat(t3.name, "/")] = n3["idb://".concat(f2.name, "/").concat(t3.name, "/:dels")] = new _n(-1 / 0, [[[]]]);
            }), Ut(Nt).fire(n3), qn(n3, true)), f2;
          });
        }
        function Rn(t2) {
          function e2(e3) {
            return t2.next(e3);
          }
          var r2 = n2(e2), i2 = n2(function(e3) {
            return t2.throw(e3);
          });
          function n2(n3) {
            return function(e3) {
              var t3 = n3(e3), e3 = t3.value;
              return t3.done ? e3 : e3 && "function" == typeof e3.then ? e3.then(r2, i2) : x(e3) ? Promise.all(e3).then(r2, i2) : r2(e3);
            };
          }
          return n2(e2)();
        }
        function Fn(e2, t2, n2) {
          for (var r2 = x(e2) ? e2.slice() : [e2], i2 = 0; i2 < n2; ++i2) r2.push(t2);
          return r2;
        }
        var Mn = { stack: "dbcore", name: "VirtualIndexMiddleware", level: 1, create: function(f2) {
          return _(_({}, f2), { table: function(e2) {
            var a2 = f2.table(e2), t2 = a2.schema, u2 = {}, s2 = [];
            function c2(e3, t3, n3) {
              var r3 = Jt(e3), i3 = u2[r3] = u2[r3] || [], o2 = null == e3 ? 0 : "string" == typeof e3 ? 1 : e3.length, a3 = 0 < t3, a3 = _(_({}, n3), { name: a3 ? "".concat(r3, "(virtual-from:").concat(n3.name, ")") : n3.name, lowLevelIndex: n3, isVirtual: a3, keyTail: t3, keyLength: o2, extractKey: Gt(e3), unique: !a3 && n3.unique });
              return i3.push(a3), a3.isPrimaryKey || s2.push(a3), 1 < o2 && c2(2 === o2 ? e3[0] : e3.slice(0, o2 - 1), t3 + 1, n3), i3.sort(function(e4, t4) {
                return e4.keyTail - t4.keyTail;
              }), a3;
            }
            e2 = c2(t2.primaryKey.keyPath, 0, t2.primaryKey);
            u2[":id"] = [e2];
            for (var n2 = 0, r2 = t2.indexes; n2 < r2.length; n2++) {
              var i2 = r2[n2];
              c2(i2.keyPath, 0, i2);
            }
            function l2(e3) {
              var t3, n3 = e3.query.index;
              return n3.isVirtual ? _(_({}, e3), { query: { index: n3.lowLevelIndex, range: (t3 = e3.query.range, n3 = n3.keyTail, { type: 1 === t3.type ? 2 : t3.type, lower: Fn(t3.lower, t3.lowerOpen ? f2.MAX_KEY : f2.MIN_KEY, n3), lowerOpen: true, upper: Fn(t3.upper, t3.upperOpen ? f2.MIN_KEY : f2.MAX_KEY, n3), upperOpen: true }) } }) : e3;
            }
            return _(_({}, a2), { schema: _(_({}, t2), { primaryKey: e2, indexes: s2, getIndexByKeyPath: function(e3) {
              return (e3 = u2[Jt(e3)]) && e3[0];
            } }), count: function(e3) {
              return a2.count(l2(e3));
            }, query: function(e3) {
              return a2.query(l2(e3));
            }, openCursor: function(t3) {
              var e3 = t3.query.index, r3 = e3.keyTail, n3 = e3.isVirtual, i3 = e3.keyLength;
              return n3 ? a2.openCursor(l2(t3)).then(function(e4) {
                return e4 && o2(e4);
              }) : a2.openCursor(t3);
              function o2(n4) {
                return Object.create(n4, { continue: { value: function(e4) {
                  null != e4 ? n4.continue(Fn(e4, t3.reverse ? f2.MAX_KEY : f2.MIN_KEY, r3)) : t3.unique ? n4.continue(n4.key.slice(0, i3).concat(t3.reverse ? f2.MIN_KEY : f2.MAX_KEY, r3)) : n4.continue();
                } }, continuePrimaryKey: { value: function(e4, t4) {
                  n4.continuePrimaryKey(Fn(e4, f2.MAX_KEY, r3), t4);
                } }, primaryKey: { get: function() {
                  return n4.primaryKey;
                } }, key: { get: function() {
                  var e4 = n4.key;
                  return 1 === i3 ? e4[0] : e4.slice(0, i3);
                } }, value: { get: function() {
                  return n4.value;
                } } });
              }
            } });
          } });
        } };
        function Nn(i2, o2, a2, u2) {
          return a2 = a2 || {}, u2 = u2 || "", O(i2).forEach(function(e2) {
            var t2, n2, r2;
            m(o2, e2) ? (t2 = i2[e2], n2 = o2[e2], "object" == typeof t2 && "object" == typeof n2 && t2 && n2 ? (r2 = A(t2)) !== A(n2) ? a2[u2 + e2] = o2[e2] : "Object" === r2 ? Nn(t2, n2, a2, u2 + e2 + ".") : t2 !== n2 && (a2[u2 + e2] = o2[e2]) : t2 !== n2 && (a2[u2 + e2] = o2[e2])) : a2[u2 + e2] = void 0;
          }), O(o2).forEach(function(e2) {
            m(i2, e2) || (a2[u2 + e2] = o2[e2]);
          }), a2;
        }
        function Ln(e2, t2) {
          return "delete" === t2.type ? t2.keys : t2.keys || t2.values.map(e2.extractKey);
        }
        var Un = { stack: "dbcore", name: "HooksMiddleware", level: 2, create: function(e2) {
          return _(_({}, e2), { table: function(r2) {
            var y2 = e2.table(r2), v2 = y2.schema.primaryKey;
            return _(_({}, y2), { mutate: function(e3) {
              var t2 = me.trans, n2 = t2.table(r2).hook, h2 = n2.deleting, d2 = n2.creating, p2 = n2.updating;
              switch (e3.type) {
                case "add":
                  if (d2.fire === G) break;
                  return t2._promise("readwrite", function() {
                    return a2(e3);
                  }, true);
                case "put":
                  if (d2.fire === G && p2.fire === G) break;
                  return t2._promise("readwrite", function() {
                    return a2(e3);
                  }, true);
                case "delete":
                  if (h2.fire === G) break;
                  return t2._promise("readwrite", function() {
                    return a2(e3);
                  }, true);
                case "deleteRange":
                  if (h2.fire === G) break;
                  return t2._promise("readwrite", function() {
                    return (function n3(r3, i2, o2) {
                      return y2.query({ trans: r3, values: false, query: { index: v2, range: i2 }, limit: o2 }).then(function(e4) {
                        var t3 = e4.result;
                        return a2({ type: "delete", keys: t3, trans: r3 }).then(function(e5) {
                          return 0 < e5.numFailures ? Promise.reject(e5.failures[0]) : t3.length < o2 ? { failures: [], numFailures: 0, lastResult: void 0 } : n3(r3, _(_({}, i2), { lower: t3[t3.length - 1], lowerOpen: true }), o2);
                        });
                      });
                    })(e3.trans, e3.range, 1e4);
                  }, true);
              }
              return y2.mutate(e3);
              function a2(c2) {
                var e4, t3, n3, l2 = me.trans, f2 = c2.keys || Ln(v2, c2);
                if (!f2) throw new Error("Keys missing");
                return "delete" !== (c2 = "add" === c2.type || "put" === c2.type ? _(_({}, c2), { keys: f2 }) : _({}, c2)).type && (c2.values = i([], c2.values)), c2.keys && (c2.keys = i([], c2.keys)), e4 = y2, n3 = f2, ("add" === (t3 = c2).type ? Promise.resolve([]) : e4.getMany({ trans: t3.trans, keys: n3, cache: "immutable" })).then(function(u2) {
                  var s2 = f2.map(function(e5, t4) {
                    var n4, r3, i2, o2 = u2[t4], a3 = { onerror: null, onsuccess: null };
                    return "delete" === c2.type ? h2.fire.call(a3, e5, o2, l2) : "add" === c2.type || void 0 === o2 ? (n4 = d2.fire.call(a3, e5, c2.values[t4], l2), null == e5 && null != n4 && (c2.keys[t4] = e5 = n4, v2.outbound || w(c2.values[t4], v2.keyPath, e5))) : (n4 = Nn(o2, c2.values[t4]), (r3 = p2.fire.call(a3, n4, e5, o2, l2)) && (i2 = c2.values[t4], Object.keys(r3).forEach(function(e6) {
                      m(i2, e6) ? i2[e6] = r3[e6] : w(i2, e6, r3[e6]);
                    }))), a3;
                  });
                  return y2.mutate(c2).then(function(e5) {
                    for (var t4 = e5.failures, n4 = e5.results, r3 = e5.numFailures, e5 = e5.lastResult, i2 = 0; i2 < f2.length; ++i2) {
                      var o2 = (n4 || f2)[i2], a3 = s2[i2];
                      null == o2 ? a3.onerror && a3.onerror(t4[i2]) : a3.onsuccess && a3.onsuccess("put" === c2.type && u2[i2] ? c2.values[i2] : o2);
                    }
                    return { failures: t4, results: n4, numFailures: r3, lastResult: e5 };
                  }).catch(function(t4) {
                    return s2.forEach(function(e5) {
                      return e5.onerror && e5.onerror(t4);
                    }), Promise.reject(t4);
                  });
                });
              }
            } });
          } });
        } };
        function Vn(e2, t2, n2) {
          try {
            if (!t2) return null;
            if (t2.keys.length < e2.length) return null;
            for (var r2 = [], i2 = 0, o2 = 0; i2 < t2.keys.length && o2 < e2.length; ++i2) 0 === st(t2.keys[i2], e2[o2]) && (r2.push(n2 ? S(t2.values[i2]) : t2.values[i2]), ++o2);
            return r2.length === e2.length ? r2 : null;
          } catch (e3) {
            return null;
          }
        }
        var zn = { stack: "dbcore", level: -1, create: function(t2) {
          return { table: function(e2) {
            var n2 = t2.table(e2);
            return _(_({}, n2), { getMany: function(t3) {
              if (!t3.cache) return n2.getMany(t3);
              var e3 = Vn(t3.keys, t3.trans._cache, "clone" === t3.cache);
              return e3 ? _e.resolve(e3) : n2.getMany(t3).then(function(e4) {
                return t3.trans._cache = { keys: t3.keys, values: "clone" === t3.cache ? S(e4) : e4 }, e4;
              });
            }, mutate: function(e3) {
              return "add" !== e3.type && (e3.trans._cache = null), n2.mutate(e3);
            } });
          } };
        } };
        function Wn(e2, t2) {
          return "readonly" === e2.trans.mode && !!e2.subscr && !e2.trans.explicit && "disabled" !== e2.trans.db._options.cache && !t2.schema.primaryKey.outbound;
        }
        function Yn(e2, t2) {
          switch (e2) {
            case "query":
              return t2.values && !t2.unique;
            case "get":
            case "getMany":
            case "count":
            case "openCursor":
              return false;
          }
        }
        var $n = { stack: "dbcore", level: 0, name: "Observability", create: function(b2) {
          var g2 = b2.schema.name, w2 = new _n(b2.MIN_KEY, b2.MAX_KEY);
          return _(_({}, b2), { transaction: function(e2, t2, n2) {
            if (me.subscr && "readonly" !== t2) throw new Y.ReadOnly("Readwrite transaction in liveQuery context. Querier source: ".concat(me.querier));
            return b2.transaction(e2, t2, n2);
          }, table: function(d2) {
            var p2 = b2.table(d2), y2 = p2.schema, v2 = y2.primaryKey, e2 = y2.indexes, c2 = v2.extractKey, l2 = v2.outbound, m2 = v2.autoIncrement && e2.filter(function(e3) {
              return e3.compound && e3.keyPath.includes(v2.keyPath);
            }), t2 = _(_({}, p2), { mutate: function(a2) {
              function u2(e4) {
                return e4 = "idb://".concat(g2, "/").concat(d2, "/").concat(e4), n2[e4] || (n2[e4] = new _n());
              }
              var e3, o2, s2, t3 = a2.trans, n2 = a2.mutatedParts || (a2.mutatedParts = {}), r2 = u2(""), i2 = u2(":dels"), c3 = a2.type, l3 = "deleteRange" === a2.type ? [a2.range] : "delete" === a2.type ? [a2.keys] : a2.values.length < 50 ? [Ln(v2, a2).filter(function(e4) {
                return e4;
              }), a2.values] : [], f3 = l3[0], h2 = l3[1], l3 = a2.trans._cache;
              return x(f3) ? (r2.addKeys(f3), (l3 = "delete" === c3 || f3.length === h2.length ? Vn(f3, l3) : null) || i2.addKeys(f3), (l3 || h2) && (e3 = u2, o2 = l3, s2 = h2, y2.indexes.forEach(function(t4) {
                var n3 = e3(t4.name || "");
                function r3(e4) {
                  return null != e4 ? t4.extractKey(e4) : null;
                }
                function i3(e4) {
                  return t4.multiEntry && x(e4) ? e4.forEach(function(e5) {
                    return n3.addKey(e5);
                  }) : n3.addKey(e4);
                }
                (o2 || s2).forEach(function(e4, t5) {
                  var n4 = o2 && r3(o2[t5]), t5 = s2 && r3(s2[t5]);
                  0 !== st(n4, t5) && (null != n4 && i3(n4), null != t5 && i3(t5));
                });
              }))) : f3 ? (h2 = { from: null !== (h2 = f3.lower) && void 0 !== h2 ? h2 : b2.MIN_KEY, to: null !== (h2 = f3.upper) && void 0 !== h2 ? h2 : b2.MAX_KEY }, i2.add(h2), r2.add(h2)) : (r2.add(w2), i2.add(w2), y2.indexes.forEach(function(e4) {
                return u2(e4.name).add(w2);
              })), p2.mutate(a2).then(function(o3) {
                return !f3 || "add" !== a2.type && "put" !== a2.type || (r2.addKeys(o3.results), m2 && m2.forEach(function(t4) {
                  for (var e4 = a2.values.map(function(e5) {
                    return t4.extractKey(e5);
                  }), n3 = t4.keyPath.findIndex(function(e5) {
                    return e5 === v2.keyPath;
                  }), r3 = 0, i3 = o3.results.length; r3 < i3; ++r3) e4[r3][n3] = o3.results[r3];
                  u2(t4.name).addKeys(e4);
                })), t3.mutatedParts = Sn(t3.mutatedParts || {}, n2), o3;
              });
            } }), e2 = function(e3) {
              var t3 = e3.query, e3 = t3.index, t3 = t3.range;
              return [e3, new _n(null !== (e3 = t3.lower) && void 0 !== e3 ? e3 : b2.MIN_KEY, null !== (t3 = t3.upper) && void 0 !== t3 ? t3 : b2.MAX_KEY)];
            }, f2 = { get: function(e3) {
              return [v2, new _n(e3.key)];
            }, getMany: function(e3) {
              return [v2, new _n().addKeys(e3.keys)];
            }, count: e2, query: e2, openCursor: e2 };
            return O(f2).forEach(function(s2) {
              t2[s2] = function(i2) {
                var e3 = me.subscr, t3 = !!e3, n2 = Wn(me, p2) && Yn(s2, i2) ? i2.obsSet = {} : e3;
                if (t3) {
                  var r2 = function(e4) {
                    e4 = "idb://".concat(g2, "/").concat(d2, "/").concat(e4);
                    return n2[e4] || (n2[e4] = new _n());
                  }, o2 = r2(""), a2 = r2(":dels"), e3 = f2[s2](i2), t3 = e3[0], e3 = e3[1];
                  if (("query" === s2 && t3.isPrimaryKey && !i2.values ? a2 : r2(t3.name || "")).add(e3), !t3.isPrimaryKey) {
                    if ("count" !== s2) {
                      var u2 = "query" === s2 && l2 && i2.values && p2.query(_(_({}, i2), { values: false }));
                      return p2[s2].apply(this, arguments).then(function(t4) {
                        if ("query" === s2) {
                          if (l2 && i2.values) return u2.then(function(e5) {
                            e5 = e5.result;
                            return o2.addKeys(e5), t4;
                          });
                          var e4 = i2.values ? t4.result.map(c2) : t4.result;
                          (i2.values ? o2 : a2).addKeys(e4);
                        } else if ("openCursor" === s2) {
                          var n3 = t4, r3 = i2.values;
                          return n3 && Object.create(n3, { key: { get: function() {
                            return a2.addKey(n3.primaryKey), n3.key;
                          } }, primaryKey: { get: function() {
                            var e5 = n3.primaryKey;
                            return a2.addKey(e5), e5;
                          } }, value: { get: function() {
                            return r3 && o2.addKey(n3.primaryKey), n3.value;
                          } } });
                        }
                        return t4;
                      });
                    }
                    a2.add(w2);
                  }
                }
                return p2[s2].apply(this, arguments);
              };
            }), t2;
          } });
        } };
        function Qn(e2, t2, n2) {
          if (0 === n2.numFailures) return t2;
          if ("deleteRange" === t2.type) return null;
          var r2 = t2.keys ? t2.keys.length : "values" in t2 && t2.values ? t2.values.length : 1;
          if (n2.numFailures === r2) return null;
          t2 = _({}, t2);
          return x(t2.keys) && (t2.keys = t2.keys.filter(function(e3, t3) {
            return !(t3 in n2.failures);
          })), "values" in t2 && x(t2.values) && (t2.values = t2.values.filter(function(e3, t3) {
            return !(t3 in n2.failures);
          })), t2;
        }
        function Gn(e2, t2) {
          return n2 = e2, (void 0 === (r2 = t2).lower || (r2.lowerOpen ? 0 < st(n2, r2.lower) : 0 <= st(n2, r2.lower))) && (e2 = e2, void 0 === (t2 = t2).upper || (t2.upperOpen ? st(e2, t2.upper) < 0 : st(e2, t2.upper) <= 0));
          var n2, r2;
        }
        function Xn(e2, d2, t2, n2, r2, i2) {
          if (!t2 || 0 === t2.length) return e2;
          var o2 = d2.query.index, p2 = o2.multiEntry, y2 = d2.query.range, v2 = n2.schema.primaryKey.extractKey, m2 = o2.extractKey, a2 = (o2.lowLevelIndex || o2).extractKey, t2 = t2.reduce(function(e3, t3) {
            var n3 = e3, r3 = [];
            if ("add" === t3.type || "put" === t3.type) for (var i3 = new _n(), o3 = t3.values.length - 1; 0 <= o3; --o3) {
              var a3, u2 = t3.values[o3], s2 = v2(u2);
              i3.hasKey(s2) || (a3 = m2(u2), (p2 && x(a3) ? a3.some(function(e4) {
                return Gn(e4, y2);
              }) : Gn(a3, y2)) && (i3.addKey(s2), r3.push(u2)));
            }
            switch (t3.type) {
              case "add":
                var c2 = new _n().addKeys(d2.values ? e3.map(function(e4) {
                  return v2(e4);
                }) : e3), n3 = e3.concat(d2.values ? r3.filter(function(e4) {
                  e4 = v2(e4);
                  return !c2.hasKey(e4) && (c2.addKey(e4), true);
                }) : r3.map(function(e4) {
                  return v2(e4);
                }).filter(function(e4) {
                  return !c2.hasKey(e4) && (c2.addKey(e4), true);
                }));
                break;
              case "put":
                var l2 = new _n().addKeys(t3.values.map(function(e4) {
                  return v2(e4);
                }));
                n3 = e3.filter(function(e4) {
                  return !l2.hasKey(d2.values ? v2(e4) : e4);
                }).concat(d2.values ? r3 : r3.map(function(e4) {
                  return v2(e4);
                }));
                break;
              case "delete":
                var f2 = new _n().addKeys(t3.keys);
                n3 = e3.filter(function(e4) {
                  return !f2.hasKey(d2.values ? v2(e4) : e4);
                });
                break;
              case "deleteRange":
                var h2 = t3.range;
                n3 = e3.filter(function(e4) {
                  return !Gn(v2(e4), h2);
                });
            }
            return n3;
          }, e2);
          return t2 === e2 ? e2 : (t2.sort(function(e3, t3) {
            return st(a2(e3), a2(t3)) || st(v2(e3), v2(t3));
          }), d2.limit && d2.limit < 1 / 0 && (t2.length > d2.limit ? t2.length = d2.limit : e2.length === d2.limit && t2.length < d2.limit && (r2.dirty = true)), i2 ? Object.freeze(t2) : t2);
        }
        function Hn(e2, t2) {
          return 0 === st(e2.lower, t2.lower) && 0 === st(e2.upper, t2.upper) && !!e2.lowerOpen == !!t2.lowerOpen && !!e2.upperOpen == !!t2.upperOpen;
        }
        function Jn(e2, t2) {
          return (function(e3, t3, n2, r2) {
            if (void 0 === e3) return void 0 !== t3 ? -1 : 0;
            if (void 0 === t3) return 1;
            if (0 === (t3 = st(e3, t3))) {
              if (n2 && r2) return 0;
              if (n2) return 1;
              if (r2) return -1;
            }
            return t3;
          })(e2.lower, t2.lower, e2.lowerOpen, t2.lowerOpen) <= 0 && 0 <= (function(e3, t3, n2, r2) {
            if (void 0 === e3) return void 0 !== t3 ? 1 : 0;
            if (void 0 === t3) return -1;
            if (0 === (t3 = st(e3, t3))) {
              if (n2 && r2) return 0;
              if (n2) return -1;
              if (r2) return 1;
            }
            return t3;
          })(e2.upper, t2.upper, e2.upperOpen, t2.upperOpen);
        }
        function Zn(n2, r2, i2, e2) {
          n2.subscribers.add(i2), e2.addEventListener("abort", function() {
            var e3, t2;
            n2.subscribers.delete(i2), 0 === n2.subscribers.size && (e3 = n2, t2 = r2, setTimeout(function() {
              0 === e3.subscribers.size && I(t2, e3);
            }, 3e3));
          });
        }
        var er = { stack: "dbcore", level: 0, name: "Cache", create: function(k2) {
          var O2 = k2.schema.name;
          return _(_({}, k2), { transaction: function(g2, w2, e2) {
            var _2, t2, x2 = k2.transaction(g2, w2, e2);
            return "readwrite" === w2 && (t2 = (_2 = new AbortController()).signal, e2 = function(b2) {
              return function() {
                if (_2.abort(), "readwrite" === w2) {
                  for (var t3 = new Set(), e3 = 0, n2 = g2; e3 < n2.length; e3++) {
                    var r2 = n2[e3], i2 = An["idb://".concat(O2, "/").concat(r2)];
                    if (i2) {
                      var o2 = k2.table(r2), a2 = i2.optimisticOps.filter(function(e4) {
                        return e4.trans === x2;
                      });
                      if (x2._explicit && b2 && x2.mutatedParts) for (var u2 = 0, s2 = Object.values(i2.queries.query); u2 < s2.length; u2++) for (var c2 = 0, l2 = (d2 = s2[u2]).slice(); c2 < l2.length; c2++) jn((p2 = l2[c2]).obsSet, x2.mutatedParts) && (I(d2, p2), p2.subscribers.forEach(function(e4) {
                        return t3.add(e4);
                      }));
                      else if (0 < a2.length) {
                        i2.optimisticOps = i2.optimisticOps.filter(function(e4) {
                          return e4.trans !== x2;
                        });
                        for (var f2 = 0, h2 = Object.values(i2.queries.query); f2 < h2.length; f2++) for (var d2, p2, y2, v2 = 0, m2 = (d2 = h2[f2]).slice(); v2 < m2.length; v2++) null != (p2 = m2[v2]).res && x2.mutatedParts && (b2 && !p2.dirty ? (y2 = Object.isFrozen(p2.res), y2 = Xn(p2.res, p2.req, a2, o2, p2, y2), p2.dirty ? (I(d2, p2), p2.subscribers.forEach(function(e4) {
                          return t3.add(e4);
                        })) : y2 !== p2.res && (p2.res = y2, p2.promise = _e.resolve({ result: y2 }))) : (p2.dirty && I(d2, p2), p2.subscribers.forEach(function(e4) {
                          return t3.add(e4);
                        })));
                      }
                    }
                  }
                  t3.forEach(function(e4) {
                    return e4();
                  });
                }
              };
            }, x2.addEventListener("abort", e2(false), { signal: t2 }), x2.addEventListener("error", e2(false), { signal: t2 }), x2.addEventListener("complete", e2(true), { signal: t2 })), x2;
          }, table: function(c2) {
            var l2 = k2.table(c2), i2 = l2.schema.primaryKey;
            return _(_({}, l2), { mutate: function(t2) {
              var e2 = me.trans;
              if (i2.outbound || "disabled" === e2.db._options.cache || e2.explicit || "readwrite" !== e2.idbtrans.mode) return l2.mutate(t2);
              var n2 = An["idb://".concat(O2, "/").concat(c2)];
              if (!n2) return l2.mutate(t2);
              e2 = l2.mutate(t2);
              return "add" !== t2.type && "put" !== t2.type || !(50 <= t2.values.length || Ln(i2, t2).some(function(e3) {
                return null == e3;
              })) ? (n2.optimisticOps.push(t2), t2.mutatedParts && In(t2.mutatedParts), e2.then(function(e3) {
                0 < e3.numFailures && (I(n2.optimisticOps, t2), (e3 = Qn(0, t2, e3)) && n2.optimisticOps.push(e3), t2.mutatedParts && In(t2.mutatedParts));
              }), e2.catch(function() {
                I(n2.optimisticOps, t2), t2.mutatedParts && In(t2.mutatedParts);
              })) : e2.then(function(r2) {
                var e3 = Qn(0, _(_({}, t2), { values: t2.values.map(function(e4, t3) {
                  var n3;
                  if (r2.failures[t3]) return e4;
                  e4 = null !== (n3 = i2.keyPath) && void 0 !== n3 && n3.includes(".") ? S(e4) : _({}, e4);
                  return w(e4, i2.keyPath, r2.results[t3]), e4;
                }) }), r2);
                n2.optimisticOps.push(e3), queueMicrotask(function() {
                  return t2.mutatedParts && In(t2.mutatedParts);
                });
              }), e2;
            }, query: function(t2) {
              if (!Wn(me, l2) || !Yn("query", t2)) return l2.query(t2);
              var i3 = "immutable" === (null === (o2 = me.trans) || void 0 === o2 ? void 0 : o2.db._options.cache), e2 = me, n2 = e2.requery, r2 = e2.signal, o2 = (function(e3, t3, n3, r3) {
                var i4 = An["idb://".concat(e3, "/").concat(t3)];
                if (!i4) return [];
                if (!(t3 = i4.queries[n3])) return [null, false, i4, null];
                var o3 = t3[(r3.query ? r3.query.index.name : null) || ""];
                if (!o3) return [null, false, i4, null];
                switch (n3) {
                  case "query":
                    var a3 = o3.find(function(e4) {
                      return e4.req.limit === r3.limit && e4.req.values === r3.values && Hn(e4.req.query.range, r3.query.range);
                    });
                    return a3 ? [a3, true, i4, o3] : [o3.find(function(e4) {
                      return ("limit" in e4.req ? e4.req.limit : 1 / 0) >= r3.limit && (!r3.values || e4.req.values) && Jn(e4.req.query.range, r3.query.range);
                    }), false, i4, o3];
                  case "count":
                    a3 = o3.find(function(e4) {
                      return Hn(e4.req.query.range, r3.query.range);
                    });
                    return [a3, !!a3, i4, o3];
                }
              })(O2, c2, "query", t2), a2 = o2[0], e2 = o2[1], u2 = o2[2], s2 = o2[3];
              return a2 && e2 ? a2.obsSet = t2.obsSet : (e2 = l2.query(t2).then(function(e3) {
                var t3 = e3.result;
                if (a2 && (a2.res = t3), i3) {
                  for (var n3 = 0, r3 = t3.length; n3 < r3; ++n3) Object.freeze(t3[n3]);
                  Object.freeze(t3);
                } else e3.result = S(t3);
                return e3;
              }).catch(function(e3) {
                return s2 && a2 && I(s2, a2), Promise.reject(e3);
              }), a2 = { obsSet: t2.obsSet, promise: e2, subscribers: new Set(), type: "query", req: t2, dirty: false }, s2 ? s2.push(a2) : (s2 = [a2], (u2 = u2 || (An["idb://".concat(O2, "/").concat(c2)] = { queries: { query: {}, count: {} }, objs: new Map(), optimisticOps: [], unsignaledParts: {} })).queries.query[t2.query.index.name || ""] = s2)), Zn(a2, s2, n2, r2), a2.promise.then(function(e3) {
                return { result: Xn(e3.result, t2, null == u2 ? void 0 : u2.optimisticOps, l2, a2, i3) };
              });
            } });
          } });
        } };
        function tr(e2, r2) {
          return new Proxy(e2, { get: function(e3, t2, n2) {
            return "db" === t2 ? r2 : Reflect.get(e3, t2, n2);
          } });
        }
        var nr = (rr.prototype.version = function(t2) {
          if (isNaN(t2) || t2 < 0.1) throw new Y.Type("Given version is not a positive number");
          if (t2 = Math.round(10 * t2) / 10, this.idbdb || this._state.isBeingOpened) throw new Y.Schema("Cannot add version when database is open");
          this.verno = Math.max(this.verno, t2);
          var e2 = this._versions, n2 = e2.filter(function(e3) {
            return e3._cfg.version === t2;
          })[0];
          return n2 || (n2 = new this.Version(t2), e2.push(n2), e2.sort(on), n2.stores({}), this._state.autoSchema = false, n2);
        }, rr.prototype._whenReady = function(e2) {
          var n2 = this;
          return this.idbdb && (this._state.openComplete || me.letThrough || this._vip) ? e2() : new _e(function(e3, t2) {
            if (n2._state.openComplete) return t2(new Y.DatabaseClosed(n2._state.dbOpenError));
            if (!n2._state.isBeingOpened) {
              if (!n2._state.autoOpen) return void t2(new Y.DatabaseClosed());
              n2.open().catch(G);
            }
            n2._state.dbReadyPromise.then(e3, t2);
          }).then(e2);
        }, rr.prototype.use = function(e2) {
          var t2 = e2.stack, n2 = e2.create, r2 = e2.level, i2 = e2.name;
          i2 && this.unuse({ stack: t2, name: i2 });
          e2 = this._middlewares[t2] || (this._middlewares[t2] = []);
          return e2.push({ stack: t2, create: n2, level: null == r2 ? 10 : r2, name: i2 }), e2.sort(function(e3, t3) {
            return e3.level - t3.level;
          }), this;
        }, rr.prototype.unuse = function(e2) {
          var t2 = e2.stack, n2 = e2.name, r2 = e2.create;
          return t2 && this._middlewares[t2] && (this._middlewares[t2] = this._middlewares[t2].filter(function(e3) {
            return r2 ? e3.create !== r2 : !!n2 && e3.name !== n2;
          })), this;
        }, rr.prototype.open = function() {
          var e2 = this;
          return $e(ve, function() {
            return Bn(e2);
          });
        }, rr.prototype._close = function() {
          this.on.close.fire(new CustomEvent("close"));
          var n2 = this._state, e2 = et.indexOf(this);
          if (0 <= e2 && et.splice(e2, 1), this.idbdb) {
            try {
              this.idbdb.close();
            } catch (e3) {
            }
            this.idbdb = null;
          }
          n2.isBeingOpened || (n2.dbReadyPromise = new _e(function(e3) {
            n2.dbReadyResolve = e3;
          }), n2.openCanceller = new _e(function(e3, t2) {
            n2.cancelOpen = t2;
          }));
        }, rr.prototype.close = function(e2) {
          var t2 = (void 0 === e2 ? { disableAutoOpen: true } : e2).disableAutoOpen, e2 = this._state;
          t2 ? (e2.isBeingOpened && e2.cancelOpen(new Y.DatabaseClosed()), this._close(), e2.autoOpen = false, e2.dbOpenError = new Y.DatabaseClosed()) : (this._close(), e2.autoOpen = this._options.autoOpen || e2.isBeingOpened, e2.openComplete = false, e2.dbOpenError = null);
        }, rr.prototype.delete = function(n2) {
          var i2 = this;
          void 0 === n2 && (n2 = { disableAutoOpen: true });
          var o2 = 0 < arguments.length && "object" != typeof arguments[0], a2 = this._state;
          return new _e(function(r2, t2) {
            function e2() {
              i2.close(n2);
              var e3 = i2._deps.indexedDB.deleteDatabase(i2.name);
              e3.onsuccess = Ie(function() {
                var e4, t3, n3;
                e4 = i2._deps, t3 = i2.name, n3 = e4.indexedDB, e4 = e4.IDBKeyRange, bn(n3) || t3 === tt || mn(n3, e4).delete(t3).catch(G), r2();
              }), e3.onerror = Ft(t2), e3.onblocked = i2._fireOnBlocked;
            }
            if (o2) throw new Y.InvalidArgument("Invalid closeOptions argument to db.delete()");
            a2.isBeingOpened ? a2.dbReadyPromise.then(e2) : e2();
          });
        }, rr.prototype.backendDB = function() {
          return this.idbdb;
        }, rr.prototype.isOpen = function() {
          return null !== this.idbdb;
        }, rr.prototype.hasBeenClosed = function() {
          var e2 = this._state.dbOpenError;
          return e2 && "DatabaseClosed" === e2.name;
        }, rr.prototype.hasFailed = function() {
          return null !== this._state.dbOpenError;
        }, rr.prototype.dynamicallyOpened = function() {
          return this._state.autoSchema;
        }, Object.defineProperty(rr.prototype, "tables", { get: function() {
          var t2 = this;
          return O(this._allTables).map(function(e2) {
            return t2._allTables[e2];
          });
        }, enumerable: false, configurable: true }), rr.prototype.transaction = function() {
          var e2 = (function(e3, t2, n2) {
            var r2 = arguments.length;
            if (r2 < 2) throw new Y.InvalidArgument("Too few arguments");
            for (var i2 = new Array(r2 - 1); --r2; ) i2[r2 - 1] = arguments[r2];
            return n2 = i2.pop(), [e3, P(i2), n2];
          }).apply(this, arguments);
          return this._transaction.apply(this, e2);
        }, rr.prototype._transaction = function(e2, t2, n2) {
          var r2 = this, i2 = me.trans;
          i2 && i2.db === this && -1 === e2.indexOf("!") || (i2 = null);
          var o2, a2, u2 = -1 !== e2.indexOf("?");
          e2 = e2.replace("!", "").replace("?", "");
          try {
            if (a2 = t2.map(function(e3) {
              e3 = e3 instanceof r2.Table ? e3.name : e3;
              if ("string" != typeof e3) throw new TypeError("Invalid table argument to Dexie.transaction(). Only Table or String are allowed");
              return e3;
            }), "r" == e2 || e2 === nt) o2 = nt;
            else {
              if ("rw" != e2 && e2 != rt) throw new Y.InvalidArgument("Invalid transaction mode: " + e2);
              o2 = rt;
            }
            if (i2) {
              if (i2.mode === nt && o2 === rt) {
                if (!u2) throw new Y.SubTransaction("Cannot enter a sub-transaction with READWRITE mode when parent transaction is READONLY");
                i2 = null;
              }
              i2 && a2.forEach(function(e3) {
                if (i2 && -1 === i2.storeNames.indexOf(e3)) {
                  if (!u2) throw new Y.SubTransaction("Table " + e3 + " not included in parent transaction.");
                  i2 = null;
                }
              }), u2 && i2 && !i2.active && (i2 = null);
            }
          } catch (n3) {
            return i2 ? i2._promise(null, function(e3, t3) {
              t3(n3);
            }) : Xe(n3);
          }
          var s2 = (function i3(o3, a3, u3, s3, c2) {
            return _e.resolve().then(function() {
              var e3 = me.transless || me, t3 = o3._createTransaction(a3, u3, o3._dbSchema, s3);
              if (t3.explicit = true, e3 = { trans: t3, transless: e3 }, s3) t3.idbtrans = s3.idbtrans;
              else try {
                t3.create(), t3.idbtrans._explicit = true, o3._state.PR1398_maxLoop = 3;
              } catch (e4) {
                return e4.name === z.InvalidState && o3.isOpen() && 0 < --o3._state.PR1398_maxLoop ? (console.warn("Dexie: Need to reopen db"), o3.close({ disableAutoOpen: false }), o3.open().then(function() {
                  return i3(o3, a3, u3, null, c2);
                })) : Xe(e4);
              }
              var n3, r3 = B(c2);
              return r3 && Le(), e3 = _e.follow(function() {
                var e4;
                (n3 = c2.call(t3, t3)) && (r3 ? (e4 = Ue.bind(null, null), n3.then(e4, e4)) : "function" == typeof n3.next && "function" == typeof n3.throw && (n3 = Rn(n3)));
              }, e3), (n3 && "function" == typeof n3.then ? _e.resolve(n3).then(function(e4) {
                return t3.active ? e4 : Xe(new Y.PrematureCommit("Transaction committed too early. See http://bit.ly/2kdckMn"));
              }) : e3.then(function() {
                return n3;
              })).then(function(e4) {
                return s3 && t3._resolve(), t3._completion.then(function() {
                  return e4;
                });
              }).catch(function(e4) {
                return t3._reject(e4), Xe(e4);
              });
            });
          }).bind(null, this, o2, a2, i2, n2);
          return i2 ? i2._promise(o2, s2, "lock") : me.trans ? $e(me.transless, function() {
            return r2._whenReady(s2);
          }) : this._whenReady(s2);
        }, rr.prototype.table = function(e2) {
          if (!m(this._allTables, e2)) throw new Y.InvalidTable("Table ".concat(e2, " does not exist"));
          return this._allTables[e2];
        }, rr);
        function rr(e2, t2) {
          var o2 = this;
          this._middlewares = {}, this.verno = 0;
          var n2 = rr.dependencies;
          this._options = t2 = _({ addons: rr.addons, autoOpen: true, indexedDB: n2.indexedDB, IDBKeyRange: n2.IDBKeyRange, cache: "cloned" }, t2), this._deps = { indexedDB: t2.indexedDB, IDBKeyRange: t2.IDBKeyRange };
          n2 = t2.addons;
          this._dbSchema = {}, this._versions = [], this._storeNames = [], this._allTables = {}, this.idbdb = null, this._novip = this;
          var a2, r2, u2, i2, s2, c2 = { dbOpenError: null, isBeingOpened: false, onReadyBeingFired: null, openComplete: false, dbReadyResolve: G, dbReadyPromise: null, cancelOpen: G, openCanceller: null, autoSchema: true, PR1398_maxLoop: 3, autoOpen: t2.autoOpen };
          c2.dbReadyPromise = new _e(function(e3) {
            c2.dbReadyResolve = e3;
          }), c2.openCanceller = new _e(function(e3, t3) {
            c2.cancelOpen = t3;
          }), this._state = c2, this.name = e2, this.on = mt(this, "populate", "blocked", "versionchange", "close", { ready: [re, G] }), this.once = function(n3, r3) {
            var i3 = function() {
              for (var e3 = [], t3 = 0; t3 < arguments.length; t3++) e3[t3] = arguments[t3];
              o2.on(n3).unsubscribe(i3), r3.apply(o2, e3);
            };
            return o2.on(n3, i3);
          }, this.on.ready.subscribe = p(this.on.ready.subscribe, function(i3) {
            return function(n3, r3) {
              rr.vip(function() {
                var t3, e3 = o2._state;
                e3.openComplete ? (e3.dbOpenError || _e.resolve().then(n3), r3 && i3(n3)) : e3.onReadyBeingFired ? (e3.onReadyBeingFired.push(n3), r3 && i3(n3)) : (i3(n3), t3 = o2, r3 || i3(function e4() {
                  t3.on.ready.unsubscribe(n3), t3.on.ready.unsubscribe(e4);
                }));
              });
            };
          }), this.Collection = (a2 = this, bt(Kt.prototype, function(e3, t3) {
            this.db = a2;
            var n3 = ot, r3 = null;
            if (t3) try {
              n3 = t3();
            } catch (e4) {
              r3 = e4;
            }
            var i3 = e3._ctx, t3 = i3.table, e3 = t3.hook.reading.fire;
            this._ctx = { table: t3, index: i3.index, isPrimKey: !i3.index || t3.schema.primKey.keyPath && i3.index === t3.schema.primKey.name, range: n3, keysOnly: false, dir: "next", unique: "", algorithm: null, filter: null, replayFilter: null, justLimit: true, isMatch: null, offset: 0, limit: 1 / 0, error: r3, or: i3.or, valueMapper: e3 !== X ? e3 : null };
          })), this.Table = (r2 = this, bt(yt.prototype, function(e3, t3, n3) {
            this.db = r2, this._tx = n3, this.name = e3, this.schema = t3, this.hook = r2._allTables[e3] ? r2._allTables[e3].hook : mt(null, { creating: [Z, G], reading: [H, X], updating: [te, G], deleting: [ee, G] });
          })), this.Transaction = (u2 = this, bt(Vt.prototype, function(e3, t3, n3, r3, i3) {
            var o3 = this;
            "readonly" !== e3 && t3.forEach(function(e4) {
              e4 = null === (e4 = n3[e4]) || void 0 === e4 ? void 0 : e4.yProps;
              e4 && (t3 = t3.concat(e4.map(function(e5) {
                return e5.updatesTable;
              })));
            }), this.db = u2, this.mode = e3, this.storeNames = t3, this.schema = n3, this.chromeTransactionDurability = r3, this.idbtrans = null, this.on = mt(this, "complete", "error", "abort"), this.parent = i3 || null, this.active = true, this._reculock = 0, this._blockedFuncs = [], this._resolve = null, this._reject = null, this._waitingFor = null, this._waitingQueue = null, this._spinCount = 0, this._completion = new _e(function(e4, t4) {
              o3._resolve = e4, o3._reject = t4;
            }), this._completion.then(function() {
              o3.active = false, o3.on.complete.fire();
            }, function(e4) {
              var t4 = o3.active;
              return o3.active = false, o3.on.error.fire(e4), o3.parent ? o3.parent._reject(e4) : t4 && o3.idbtrans && o3.idbtrans.abort(), Xe(e4);
            });
          })), this.Version = (i2 = this, bt(yn.prototype, function(e3) {
            this.db = i2, this._cfg = { version: e3, storesSource: null, dbschema: {}, tables: {}, contentUpgrade: null };
          })), this.WhereClause = (s2 = this, bt(Bt.prototype, function(e3, t3, n3) {
            if (this.db = s2, this._ctx = { table: e3, index: ":id" === t3 ? null : t3, or: n3 }, this._cmp = this._ascending = st, this._descending = function(e4, t4) {
              return st(t4, e4);
            }, this._max = function(e4, t4) {
              return 0 < st(e4, t4) ? e4 : t4;
            }, this._min = function(e4, t4) {
              return st(e4, t4) < 0 ? e4 : t4;
            }, this._IDBKeyRange = s2._deps.IDBKeyRange, !this._IDBKeyRange) throw new Y.MissingAPI();
          })), this.on("versionchange", function(e3) {
            0 < e3.newVersion ? console.warn("Another connection wants to upgrade database '".concat(o2.name, "'. Closing db now to resume the upgrade.")) : console.warn("Another connection wants to delete database '".concat(o2.name, "'. Closing db now to resume the delete request.")), o2.close({ disableAutoOpen: false });
          }), this.on("blocked", function(e3) {
            !e3.newVersion || e3.newVersion < e3.oldVersion ? console.warn("Dexie.delete('".concat(o2.name, "') was blocked")) : console.warn("Upgrade '".concat(o2.name, "' blocked by other connection holding version ").concat(e3.oldVersion / 10));
          }), this._maxKey = Qt(t2.IDBKeyRange), this._createTransaction = function(e3, t3, n3, r3) {
            return new o2.Transaction(e3, t3, n3, o2._options.chromeTransactionDurability, r3);
          }, this._fireOnBlocked = function(t3) {
            o2.on("blocked").fire(t3), et.filter(function(e3) {
              return e3.name === o2.name && e3 !== o2 && !e3._state.vcFired;
            }).map(function(e3) {
              return e3.on("versionchange").fire(t3);
            });
          }, this.use(zn), this.use(er), this.use($n), this.use(Mn), this.use(Un);
          var l2 = new Proxy(this, { get: function(e3, t3, n3) {
            if ("_vip" === t3) return true;
            if ("table" === t3) return function(e4) {
              return tr(o2.table(e4), l2);
            };
            var r3 = Reflect.get(e3, t3, n3);
            return r3 instanceof yt ? tr(r3, l2) : "tables" === t3 ? r3.map(function(e4) {
              return tr(e4, l2);
            }) : "_createTransaction" === t3 ? function() {
              return tr(r3.apply(this, arguments), l2);
            } : r3;
          } });
          this.vip = l2, n2.forEach(function(e3) {
            return e3(o2);
          });
        }
        var ir, F = "undefined" != typeof Symbol && "observable" in Symbol ? Symbol.observable : "@@observable", or = (ar.prototype.subscribe = function(e2, t2, n2) {
          return this._subscribe(e2 && "function" != typeof e2 ? e2 : { next: e2, error: t2, complete: n2 });
        }, ar.prototype[F] = function() {
          return this;
        }, ar);
        function ar(e2) {
          this._subscribe = e2;
        }
        try {
          ir = { indexedDB: f.indexedDB || f.mozIndexedDB || f.webkitIndexedDB || f.msIndexedDB, IDBKeyRange: f.IDBKeyRange || f.webkitIDBKeyRange };
        } catch (e2) {
          ir = { indexedDB: null, IDBKeyRange: null };
        }
        function ur(h2) {
          var d2, p2 = false, e2 = new or(function(r2) {
            var i2 = B(h2);
            var o2, a2 = false, u2 = {}, s2 = {}, e3 = { get closed() {
              return a2;
            }, unsubscribe: function() {
              a2 || (a2 = true, o2 && o2.abort(), c2 && Ut.storagemutated.unsubscribe(f2));
            } };
            r2.start && r2.start(e3);
            var c2 = false, l2 = function() {
              return Ge(t2);
            };
            var f2 = function(e4) {
              Sn(u2, e4), jn(s2, u2) && l2();
            }, t2 = function() {
              var t3, n2, e4;
              !a2 && ir.indexedDB && (u2 = {}, t3 = {}, o2 && o2.abort(), o2 = new AbortController(), e4 = (function(e5) {
                var t4 = je();
                try {
                  i2 && Le();
                  var n3 = Ne(h2, e5);
                  return n3 = i2 ? n3.finally(Ue) : n3;
                } finally {
                  t4 && Ae();
                }
              })(n2 = { subscr: t3, signal: o2.signal, requery: l2, querier: h2, trans: null }), Promise.resolve(e4).then(function(e5) {
                p2 = true, d2 = e5, a2 || n2.signal.aborted || (u2 = {}, (function(e6) {
                  for (var t4 in e6) if (m(e6, t4)) return;
                  return 1;
                })(s2 = t3) || c2 || (Ut(Nt, f2), c2 = true), Ge(function() {
                  return !a2 && r2.next && r2.next(e5);
                }));
              }, function(e5) {
                p2 = false, ["DatabaseClosedError", "AbortError"].includes(null == e5 ? void 0 : e5.name) || a2 || Ge(function() {
                  a2 || r2.error && r2.error(e5);
                });
              }));
            };
            return setTimeout(l2, 0), e3;
          });
          return e2.hasValue = function() {
            return p2;
          }, e2.getValue = function() {
            return d2;
          }, e2;
        }
        var sr = nr;
        function cr(e2) {
          var t2 = fr;
          try {
            fr = true, Ut.storagemutated.fire(e2), qn(e2, true);
          } finally {
            fr = t2;
          }
        }
        r(sr, _(_({}, Q), { delete: function(e2) {
          return new sr(e2, { addons: [] }).delete();
        }, exists: function(e2) {
          return new sr(e2, { addons: [] }).open().then(function(e3) {
            return e3.close(), true;
          }).catch("NoSuchDatabaseError", function() {
            return false;
          });
        }, getDatabaseNames: function(e2) {
          try {
            return t2 = sr.dependencies, n2 = t2.indexedDB, t2 = t2.IDBKeyRange, (bn(n2) ? Promise.resolve(n2.databases()).then(function(e3) {
              return e3.map(function(e4) {
                return e4.name;
              }).filter(function(e4) {
                return e4 !== tt;
              });
            }) : mn(n2, t2).toCollection().primaryKeys()).then(e2);
          } catch (e3) {
            return Xe(new Y.MissingAPI());
          }
          var t2, n2;
        }, defineClass: function() {
          return function(e2) {
            a(this, e2);
          };
        }, ignoreTransaction: function(e2) {
          return me.trans ? $e(me.transless, e2) : e2();
        }, vip: gn, async: function(t2) {
          return function() {
            try {
              var e2 = Rn(t2.apply(this, arguments));
              return e2 && "function" == typeof e2.then ? e2 : _e.resolve(e2);
            } catch (e3) {
              return Xe(e3);
            }
          };
        }, spawn: function(e2, t2, n2) {
          try {
            var r2 = Rn(e2.apply(n2, t2 || []));
            return r2 && "function" == typeof r2.then ? r2 : _e.resolve(r2);
          } catch (e3) {
            return Xe(e3);
          }
        }, currentTransaction: { get: function() {
          return me.trans || null;
        } }, waitFor: function(e2, t2) {
          t2 = _e.resolve("function" == typeof e2 ? sr.ignoreTransaction(e2) : e2).timeout(t2 || 6e4);
          return me.trans ? me.trans.waitFor(t2) : t2;
        }, Promise: _e, debug: { get: function() {
          return ie;
        }, set: function(e2) {
          oe(e2);
        } }, derive: o, extend: a, props: r, override: p, Events: mt, on: Ut, liveQuery: ur, extendObservabilitySet: Sn, getByKeyPath: g, setByKeyPath: w, delByKeyPath: function(t2, e2) {
          "string" == typeof e2 ? w(t2, e2, void 0) : "length" in e2 && [].map.call(e2, function(e3) {
            w(t2, e3, void 0);
          });
        }, shallowClone: k, deepClone: S, getObjectDiff: Nn, cmp: st, asap: v, minKey: -1 / 0, addons: [], connections: et, errnames: z, dependencies: ir, cache: An, semVer: "4.2.1", version: "4.2.1".split(".").map(function(e2) {
          return parseInt(e2);
        }).reduce(function(e2, t2, n2) {
          return e2 + t2 / Math.pow(10, 2 * n2);
        }) })), sr.maxKey = Qt(sr.dependencies.IDBKeyRange), "undefined" != typeof dispatchEvent && "undefined" != typeof addEventListener && (Ut(Nt, function(e2) {
          fr || (e2 = new CustomEvent(Lt, { detail: e2 }), fr = true, dispatchEvent(e2), fr = false);
        }), addEventListener(Lt, function(e2) {
          e2 = e2.detail;
          fr || cr(e2);
        }));
        var lr, fr = false, hr = function() {
        };
        return "undefined" != typeof BroadcastChannel && ((hr = function() {
          (lr = new BroadcastChannel(Lt)).onmessage = function(e2) {
            return e2.data && cr(e2.data);
          };
        })(), "function" == typeof lr.unref && lr.unref(), Ut(Nt, function(e2) {
          fr || lr.postMessage(e2);
        })), "undefined" != typeof addEventListener && (addEventListener("pagehide", function(e2) {
          if (!nr.disableBfCache && e2.persisted) {
            ie && console.debug("Dexie: handling persisted pagehide"), null != lr && lr.close();
            for (var t2 = 0, n2 = et; t2 < n2.length; t2++) n2[t2].close({ disableAutoOpen: false });
          }
        }), addEventListener("pageshow", function(e2) {
          !nr.disableBfCache && e2.persisted && (ie && console.debug("Dexie: handling persisted pageshow"), hr(), cr({ all: new _n(-1 / 0, [[]]) }));
        })), _e.rejectionMapper = function(e2, t2) {
          return !e2 || e2 instanceof N || e2 instanceof TypeError || e2 instanceof SyntaxError || !e2.name || !$[e2.name] ? e2 : (t2 = new $[e2.name](t2 || e2.message, e2), "stack" in e2 && l(t2, "stack", { get: function() {
            return this.inner.stack;
          } }), t2);
        }, oe(ie), _(nr, Object.freeze({ __proto__: null, Dexie: nr, liveQuery: ur, Entity: ut, cmp: st, PropModification: ht, replacePrefix: function(e2, t2) {
          return new ht({ replacePrefix: [e2, t2] });
        }, add: function(e2) {
          return new ht({ add: e2 });
        }, remove: function(e2) {
          return new ht({ remove: e2 });
        }, default: nr, RangeSet: _n, mergeRanges: kn, rangesOverlap: On }), { default: nr }), nr;
      });
    })(dexie_min$1);
    return dexie_min$1.exports;
  }
  var dexie_minExports = requireDexie_min();
  const _Dexie = getDefaultExportFromCjs(dexie_minExports);
  const DexieSymbol = Symbol.for("Dexie");
  const Dexie = globalThis[DexieSymbol] || (globalThis[DexieSymbol] = _Dexie);
  if (_Dexie.semVer !== Dexie.semVer) {
    throw new Error(`Two different versions of Dexie loaded in the same app: ${_Dexie.semVer} and ${Dexie.semVer}`);
  }
  const {
    liveQuery,
    mergeRanges,
    rangesOverlap,
    RangeSet,
    cmp,
    Entity,
    PropModification,
    replacePrefix,
    add,
    remove,
    DexieYProvider
  } = Dexie;
  const db = new Dexie("ArcaconPickerPlusDB");
  db.version(1).stores({
    [STORAGE_ARCACON_DATA]: "id,emoticonid,imageUrl,type,poster,orig",
    [STORAGE_FAVORITE_DATA]: "id",
    [STORAGE_MEMO_DATA]: "id,text"
  });
  function getDatabase(tableName) {
    return db[tableName];
  }
  async function saveData(dbTable, item) {
    await dbTable.put(item);
  }
  async function loadData(dbTable) {
    return await dbTable.toArray();
  }
  async function deleteData(dbTable, key) {
    await dbTable.delete(key);
  }
  class GenericTable {
    constructor(primaryKey, fields) {
      this.primaryKey = primaryKey;
      this.fields = fields;
      this.rows = new Map();
    }
    load(dataArray) {
      dataArray.forEach((row) => {
        this.insert(row);
      });
    }
    insert(row) {
      const key = row[this.primaryKey];
      if (key === void 0) throw new Error("Primary key missing");
      this.rows.set(key, { ...row });
    }
    update(key, updates) {
      if (!this.rows.has(key)) return false;
      this.rows.set(key, { ...this.rows.get(key), ...updates });
      return true;
    }
    delete(key) {
      return this.rows.delete(key);
    }
    get(key) {
      return this.rows.get(key) || null;
    }
    getAll() {
      return Array.from(this.rows.values());
    }
    has(key) {
      return this.rows.has(key);
    }
    clear() {
      this.rows.clear();
    }
  }
  async function getEmoticonId(id) {
    const response = await fetch(`/api/emoticon/shop/${id}`, {
      method: "HEAD"
    });
    if (!response.redirected) throw new Error(`이모티콘(${id})이 포함된 번들 페이지를 조회하는데 실패했습니다.`);
    return response.url.match(/[0-9]+$/)[0];
  }
  var reactDomExports = requireReactDom();
  function PortalAhead({ children, fragment, target, className, title, ...restProps }) {
    const containerRef = reactExports.useRef(document.createElement(fragment || "div"));
    reactExports.useLayoutEffect(() => {
      const container = containerRef.current;
      if (target && target.parentNode) {
        target.parentNode.insertBefore(container, target);
      }
    }, [target]);
    reactExports.useLayoutEffect(() => {
      const container = containerRef.current;
      if (className !== void 0) container.className = className;
      if (title !== void 0) container.title = title;
      Object.entries(restProps).forEach(([key, value]) => {
        if (key.startsWith("data-")) container.setAttribute(key, value);
      });
    }, [className, title, ...Object.values(restProps)]);
    if (!target) return null;
    return reactDomExports.createPortal(children, containerRef.current);
  }
  const arcaconIDBTable = getDatabase(STORAGE_ARCACON_DATA);
  const relatedIDBTable = [STORAGE_FAVORITE_DATA, STORAGE_MEMO_DATA].map(getDatabase);
  async function removeArcaconIfUnreferenced(id) {
    for (const dbTable of relatedIDBTable) {
      const item = await dbTable.get(id);
      if (item) {
        console.log(id, "is still referenced in", dbTable.name);
        return false;
      }
    }
    await deleteData(arcaconIDBTable, id);
    return true;
  }
  const useArcaconStore = create(() => {
    const arcaconPernamentTable = new GenericTable("id", ["id", "emoticonid", "imageUrl", "type", "poster", "orig"]);
    const arcaconTemporaryTable = new GenericTable("id", ["id", "emoticonid", "imageUrl", "type", "poster", "orig"]);
    async function loadArcaconItems() {
      const data = await loadData(arcaconIDBTable) || [];
      arcaconPernamentTable.load(data);
      console.log("[ArcaconPickerPlus] Loaded arcacon items: ", data.length, "items loaded.");
    }
    function setArcaconItem({ id, emoticonid, imageUrl, type, poster, orig }, permanent = false) {
      const item = { id, emoticonid, imageUrl, type, poster, orig };
      if (permanent) {
        arcaconPernamentTable.insert(item);
        saveData(arcaconIDBTable, item);
      } else {
        arcaconTemporaryTable.insert(item);
      }
    }
    function setPermanent(id) {
      const item = arcaconTemporaryTable.get(id);
      if (item) {
        console.log("[ArcaconPickerPlus] Setting arcacon item as permanent: ", id);
        setArcaconItem(item, true);
      }
    }
    const getArcaconById = (id, permanentOnly = false) => {
      return permanentOnly ? arcaconPernamentTable.get(id) : arcaconPernamentTable.get(id) || arcaconTemporaryTable.get(id);
    };
    return {
      loadArcaconItems,
      getArcaconById,
      setArcaconItem,
      setPermanent
    };
  });
  const favoriteIDBTable = getDatabase(STORAGE_FAVORITE_DATA);
  const useFavoriteStore = create((set) => {
    const favoriteTable = new GenericTable("id", ["id"]);
    async function loadFavoriteItems() {
      const data = await loadData(favoriteIDBTable) || [];
      favoriteTable.load(data);
      set({ favorites: favoriteTable.getAll() });
      console.log("[ArcaconPickerPlus] Loaded favorite items: ", data.length, "items loaded.");
    }
    function addFavoriteItem(id) {
      favoriteTable.insert({ id });
      saveData(favoriteIDBTable, { id });
      set({ favorites: favoriteTable.getAll() });
      console.log("[ArcaconPickerPlus] Added favorite: ", id);
    }
    function removeFavoriteItem(id) {
      favoriteTable.delete(id);
      deleteData(favoriteIDBTable, id).then(() => {
        removeArcaconIfUnreferenced(id);
      });
      set({ favorites: favoriteTable.getAll() });
      console.log("[ArcaconPickerPlus] Removed favorite: ", id);
    }
    return {
      favorites: [],
      loadFavoriteItems,
      addFavoriteItem,
      removeFavoriteItem,
      isFavorite: (id) => favoriteTable.get(id) !== null
    };
  });
  const memoIDBTable = getDatabase(STORAGE_MEMO_DATA);
  const useMemoStore = create((set) => {
    const memoTable = new GenericTable("id", ["id", "text"]);
    async function loadMemoItems() {
      const data = await loadData(memoIDBTable) || [];
      memoTable.load(data);
      set({ memoItems: memoTable.getAll() });
      console.log("[ArcaconPickerPlus] Loaded memo items: ", data.length, "items loaded.");
    }
    function setMemoItem(id, text) {
      memoTable.insert({ id, text });
      saveData(memoIDBTable, { id, text });
      set({ memoItems: memoTable.getAll() });
    }
    function deleteMemoItem(id) {
      memoTable.delete(id);
      deleteData(memoIDBTable, id).then(() => {
        removeArcaconIfUnreferenced(id);
      });
      set({ memoItems: memoTable.getAll() });
    }
    return {
      memoItems: [],
      loadMemoItems,
      setMemoItem,
      deleteMemoItem,
      getMemoById: (id) => memoTable.get(id)
    };
  });
  function useMultiState(initialState) {
    const [state, setState] = reactExports.useState({});
    const get = reactExports.useCallback((key) => state[key] || initialState, [state, initialState]);
    const set = reactExports.useCallback((key, value) => {
      setState((prev) => {
        const newValue = typeof value === "function" ? value(prev[key]) : value;
        return { ...prev, [key]: newValue };
      });
    }, []);
    return { get, set, state };
  }
  function useEventListener(event, handler, target = window, options, enabled = true) {
    const savedHandler = reactExports.useRef();
    reactExports.useEffect(() => {
      savedHandler.current = handler;
    }, [handler]);
    reactExports.useEffect(() => {
      if (!enabled || !target?.addEventListener) return;
      const eventListener = (e) => savedHandler.current?.(e);
      target.addEventListener(event, eventListener, options);
      return () => {
        target.removeEventListener(event, eventListener, options);
      };
    }, [event, target, options, enabled]);
  }
  function useDebounce(callback, delay = 300) {
    const timer = reactExports.useRef();
    return reactExports.useCallback(
      (...args) => {
        if (timer.current) clearTimeout(timer.current);
        timer.current = setTimeout(() => {
          callback(...args);
        }, delay);
      },
      [callback, delay]
    );
  }
  const fetchHookRegistry = [];
  let isFetchPatched = false;
  let originalFetch = null;
  function patchFetch() {
    if (isFetchPatched) return;
    const globalObj = typeof unsafeWindow !== "undefined" ? unsafeWindow : window;
    originalFetch = globalObj.fetch;
    globalObj.fetch = async function(...args) {
      const url = args[0]?.url || args[0];
      let result;
      for (const { pattern, callback } of fetchHookRegistry) {
        if (typeof pattern === "string" && url === pattern) {
          try {
            const cbResult = callback(...args);
            if (cbResult !== void 0) {
              result = cbResult;
            }
          } catch (e) {
          }
        } else if (pattern instanceof RegExp) {
          const match = url.match(pattern);
          if (match) {
            try {
              const cbResult = callback(args, ...match.slice(1), ...args);
              if (cbResult !== void 0) {
                result = cbResult;
              }
            } catch (e) {
            }
          }
        }
      }
      if (result !== void 0) {
        return result;
      }
      return originalFetch.apply(this, args);
    };
    isFetchPatched = true;
  }
  function useFetchHook(pattern, callback) {
    const ref = reactExports.useRef({ pattern, callback });
    ref.current.pattern = pattern;
    ref.current.callback = callback;
    reactExports.useEffect(() => {
      patchFetch();
      const entry = { pattern, callback };
      fetchHookRegistry.push(entry);
      return () => {
        const idx = fetchHookRegistry.indexOf(entry);
        if (idx !== -1) fetchHookRegistry.splice(idx, 1);
      };
    }, [pattern, callback]);
  }
  function ContentCollector() {
    const { setArcaconPicker, setThumbnailWraps } = useElementStore();
    const { loadArcaconItems, setArcaconItem } = useArcaconStore();
    const getChildElements = (picker) => {
      if (!picker.hasAttribute("data-uid")) {
        picker.setAttribute("data-uid", crypto.randomUUID());
      }
      const uid = picker.getAttribute("data-uid");
      const titleArea = picker.querySelector(".title-area");
      const mainArea = picker.querySelector(".main-area");
      const optionsToolbar = titleArea ? titleArea.querySelector(".options-toolbar") : null;
      const sidebar = mainArea ? mainArea.querySelector(".sidebar") : null;
      const content = mainArea ? mainArea.querySelector(".content") : null;
      return { self: picker, titleArea, mainArea, optionsToolbar, sidebar, content, uid };
    };
    const saveArcaconItem = (thumb) => {
      if (!thumb) return;
      const id = thumb.getAttribute("data-attachment-id"), emoticonid = thumb.getAttribute("data-emoticon-id"), imageUrl = thumb.getAttribute("data-src"), type = thumb.getAttribute("data-type"), poster = thumb.getAttribute("data-poster"), orig = thumb.getAttribute("data-orig");
      setArcaconItem({ id, emoticonid, imageUrl, type, poster, orig }, false);
    };
    useEventListener(
      "click",
      (e) => {
        const target = e.target;
        if (target.classList.contains("thumbnail-wrap")) {
          console.log(target);
          saveArcaconItem(target);
        }
      },
      document
    );
    reactExports.useEffect(() => {
      loadArcaconItems();
      const observer = new MutationObserver(() => {
        const pickers = document.querySelectorAll(".arcaconPicker");
        const newPickers = Array.from(pickers).map((picker) => getChildElements(picker));
        setArcaconPicker(newPickers);
        const thumbnails = document.querySelectorAll("img.thumbnail, video.thumbnail");
        const thumbnailWraps = Array.from(thumbnails).map((thumb) => thumb.closest(".thumbnail-wrap"));
        thumbnailWraps.forEach((wrap) => saveArcaconItem(wrap));
        setThumbnailWraps(thumbnailWraps);
      });
      observer.observe(document.body, {
        childList: true,
        subtree: true
      });
      return () => observer.disconnect();
    }, []);
    return null;
  }
  const overlayCss = ".arcacon-overlay-list{position:absolute;top:0;left:0;width:100%;display:flex;flex-direction:row-reverse}";
  importCSS(overlayCss);
  function ThumbnailOverlay() {
    const { thumbnailWraps } = useElementStore();
    return jsxRuntimeExports.jsx(jsxRuntimeExports.Fragment, { children: thumbnailWraps.map((node) => {
      if (!node) return;
      if (node.style.position === "" || node.style.position === "static") {
        node.style.position = "relative";
      }
      return reactDomExports.createPortal( jsxRuntimeExports.jsx("div", { className: "arcacon-overlay-list" }), node);
    }) });
  }
  function getOverlay(node) {
    if (!node) return null;
    return node.querySelector(".arcacon-overlay-list");
  }
  function FavoriteController({ pickers, getToggleValue }) {
    const { isFavorite, addFavoriteItem, removeFavoriteItem } = useFavoriteStore();
    const { setPermanent } = useArcaconStore();
    const handleClick = (uid) => (e) => {
      const target = e.target.closest(".thumbnail-wrap");
      if (target && getToggleValue(uid)) {
        e.stopPropagation();
        const id = target.getAttribute("data-attachment-id");
        if (isFavorite(id)) {
          removeFavoriteItem(id);
        } else {
          addFavoriteItem(id);
          setPermanent(id);
        }
      }
    };
    reactExports.useEffect(() => {
      const pickerListeners = pickers.map((picker) => {
        const listener = picker?.self.addEventListener("click", handleClick(picker.uid), true);
        return { picker, listener };
      });
      return () => {
        pickerListeners.forEach(({ picker, listener }) => {
          picker?.self.removeEventListener("click", listener, true);
        });
      };
    }, [pickers.length]);
    return null;
  }
  function PackageContent({ title, items }) {
    return jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
jsxRuntimeExports.jsx("span", { className: "package-title", children: title }),
jsxRuntimeExports.jsx("div", { className: "thumbnails", children: items.map((fav) => {
        return fav ? jsxRuntimeExports.jsx(
          "div",
          {
            className: "thumbnail-wrap loading",
            "data-type": fav.type || "",
            "data-src": fav.imageUrl || "",
            "data-emoticon-id": fav.emoticonid || "",
            "data-attachment-id": fav.id || "",
            "data-poster": fav.poster || "",
            "data-orig": fav.orig || "",
            children: fav.type === "video" ? jsxRuntimeExports.jsx(
              "video",
              {
                className: "thumbnail",
                draggable: "false",
                "data-attachmentid": fav.id || "",
                "data-emoticonid": fav.emoticonid || "",
                src: `${fav.imageUrl || ""}`,
                poster: `${fav.poster || ""}`,
                "data-orig": `${fav.orig || ""}`,
                autoPlay: true,
                loop: true,
                muted: true,
                playsInline: true
              }
            ) : jsxRuntimeExports.jsx(
              "img",
              {
                className: "thumbnail",
                draggable: "false",
                src: fav.imageUrl || "",
                "data-emoticonid": fav.emoticonid || "",
                "data-attachmentid": fav.id || ""
              }
            )
          },
          `thumbnail-wrap-favorite-${fav.id}`
        ) : null;
      }) })
    ] });
  }
  function PackageItem({ id, title, imgUrl }) {
    return jsxRuntimeExports.jsx(jsxRuntimeExports.Fragment, { children: jsxRuntimeExports.jsx(
      "div",
      {
        className: "package-thumbnail",
        "data-package-id": id,
        style: {
          backgroundImage: `url(${imgUrl})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          width: 40,
          height: 40
        },
        onClick: (e) => {
          const t = e.target;
          const n = t.getAttribute("data-package-id");
          const a = t.closest(".arcaconPicker").querySelector('.content .--package-wrap[data-package-id="' + n + '"]');
          a && (a.parentElement.scrollTop = a.offsetTop);
        }
      }
    ) });
  }
  const ModalCss = ".microModal>div div[role=input]{width:320px;padding:2em;border-radius:16px;box-shadow:0 -3px 6px #00000029;background-color:var(--color-modal-bg);border:2px solid var(--color-modal-bd)}@media screen and (orientation:portrait)and (max-width:576px){.microModal>div div[role=input]{position:fixed;top:0;left:0;width:100%;border-top-left-radius:0;border-top-right-radius:0;animation-name:microModalSlideDownMobile;animation-duration:.3s}}@keyframes microModalSlideDownMobile{0%{transform:translateY(-100%)}to{transform:translateY(0)}}";
  importCSS(ModalCss);
  function Modal({ children, id, onClickBackground }) {
    const downTarget = reactExports.useRef(null);
    const handleMouseDown = (e) => {
      downTarget.current = e.target;
    };
    const handleMouseUp = (e) => {
      if (e.currentTarget === e.target && downTarget.current === e.target) {
        onClickBackground();
      }
    };
    return jsxRuntimeExports.jsx("div", { className: "microModal is-open is-last", "aria-hidden": "false", id: `modal_${id}`, children: jsxRuntimeExports.jsx("div", { tabIndex: "-1", onMouseDown: handleMouseDown, onMouseUp: handleMouseUp, children: jsxRuntimeExports.jsx("div", { role: "input", className: "arca-dialog", "aria-modal": "true", children }) }) });
  }
  function Title({ children }) {
    return jsxRuntimeExports.jsx("h1", { className: "microModal-title", children });
  }
  function Content({ children }) {
    return jsxRuntimeExports.jsx("div", { className: "microModal-content", children });
  }
  function Buttons({ children }) {
    return jsxRuntimeExports.jsx("div", { className: "microModal-buttons", children });
  }
  Modal.Title = Title;
  Modal.Content = Content;
  Modal.Buttons = Buttons;
  function createModal(modal) {
    return reactDomExports.createPortal(modal, document.body);
  }
  const SvgFavoriteIcon = (props) => reactExports.createElement("svg", { viewBox: "0 0 24 24", fill: "white", xmlns: "http://www.w3.org/2000/svg", ...props }, reactExports.createElement("path", { d: "M12 2l3.09 6.26L22 9.27l-5 4.87L18.18 22 12 18.27 5.82 22 7 14.14l-5-4.87 6.91-1.01z", fill: "white" }));
  const arcaconFavoriteIconCss = ".arcacon-overlay.favorite{background:#ef4444}.arcacon-favorite-overlay svg{width:14px;height:14px;fill:#ef4444;display:block}";
  importCSS(arcaconFavoriteIconCss);
  const STAR_SVG_DATA_URL = "data:image/svg+xml;utf8," + encodeURIComponent(
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="32" height="32" fill="#FFD600"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87L18.18 22 12 18.27 5.82 22 7 14.14l-5-4.87 6.91-1.01z"/></svg>'
  );
  function FavoriteView({ pickers, getToggleValue, toggleFavorite }) {
    const { favorites, isFavorite } = useFavoriteStore();
    const { thumbnailWraps } = useElementStore();
    const { getArcaconById } = useArcaconStore();
    return jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, {
children: [
        pickers.map(
          (picker) => picker.content?.firstChild && jsxRuntimeExports.jsx(
            PortalAhead,
            {
              target: picker.content.firstChild,
              className: "--package-wrap",
              "data-package-id": FAVORITE_PACKAGE_ID,
              children: jsxRuntimeExports.jsx(PackageContent, { items: favorites.map((fav) => getArcaconById(fav.id)), title: "즐겨찾기" })
            },
            `content-${picker.uid}`
          )
        ),
pickers.map(
          (picker) => picker.sidebar?.firstChild && jsxRuntimeExports.jsx(
            PortalAhead,
            {
              target: picker.sidebar.firstChild,
              className: "package-item",
              "data-package-id": FAVORITE_PACKAGE_ID,
              "data-package-name": "즐겨찾기",
              title: "즐겨찾기",
              children: jsxRuntimeExports.jsx(PackageItem, { id: FAVORITE_PACKAGE_ID, title: "즐겨찾기", imgUrl: STAR_SVG_DATA_URL })
            },
            `item-${picker.uid}`
          )
        ),
pickers.map(
          (picker) => picker.optionsToolbar?.firstChild && jsxRuntimeExports.jsxs(
            PortalAhead,
            {
              fragment: "label",
              target: picker.optionsToolbar.firstChild,
              className: "option-combo-emoticon visible",
              id: "favorite-toggle-button",
              children: [
                "즐겨찾기 토글",
jsxRuntimeExports.jsx(
                  "input",
                  {
                    type: "checkbox",
                    name: "option-favorite-emoticon",
                    checked: getToggleValue(picker.uid) || false,
                    onChange: () => toggleFavorite(picker.uid)
                  }
                )
              ]
            },
            `toggle-${picker.uid}`
          )
        ),
thumbnailWraps.map((node) => {
          if (!node) return null;
          const id = node.getAttribute("data-attachment-id");
          if (!isFavorite(id)) return null;
          const overlay = getOverlay(node);
          if (!overlay) return null;
          return reactDomExports.createPortal(
jsxRuntimeExports.jsx("div", { className: "arcacon-overlay favorite", children: jsxRuntimeExports.jsx(SvgFavoriteIcon, {}) }),
            overlay
          );
        })
      ]
    });
  }
  function FavoriteModule() {
    const { loadFavoriteItems } = useFavoriteStore();
    const { pickers } = useElementStore();
    const { get: getToggle, set: setToggle, state: toggle } = useMultiState();
    reactExports.useEffect(() => {
      loadFavoriteItems();
    }, [loadFavoriteItems]);
    const toggleRef = reactExports.useRef(toggle);
    reactExports.useEffect(() => {
      toggleRef.current = toggle;
    }, [toggle]);
    const getToggleValue = (uid) => toggleRef.current[uid];
    const toggleFavorite = (uid) => {
      const current = getToggleValue(uid) || false;
      setToggle(uid, !current);
    };
    return jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
jsxRuntimeExports.jsx(FavoriteView, { pickers, getToggleValue: getToggle, toggleFavorite }),
jsxRuntimeExports.jsx(FavoriteController, { pickers, getToggleValue })
    ] });
  }
  function MemoController({ openMemo }) {
    useEventListener(
      "contextmenu",
      (e) => {
        const target = e.target.closest(".thumbnail-wrap");
        if (!target) return;
        e.preventDefault();
        const id = target.getAttribute("data-attachment-id");
        openMemo(id);
      },
      document,
      true
    );
    return null;
  }
  const MemoFragmentCss = ".memo-modal-overlay{position:fixed;top:0;left:0;width:100vw;height:100vh;z-index:9998;background:#00000059;display:flex;align-items:center;justify-content:center;font-family:Segoe UI,Apple SD Gothic Neo,Arial,sans-serif}.memo-modal-box{background:#fff;border:none;border-radius:14px;box-shadow:0 6px 32px #0000002e;padding:28px 24px 20px;min-width:280px;max-width:360px;width:100%;z-index:9999;display:flex;flex-direction:column}.memo-modal-title{display:flex;align-items:center;justify-content:space-between;font-weight:600;font-size:18px;margin-bottom:12px;color:#222}.memo-modal-textarea{width:100%;min-height:80px;resize:vertical;border:1px solid #e0e0e0;border-radius:8px;padding:10px 12px;font-size:15px;color:#222;outline:none;box-sizing:border-box;margin-bottom:16px;background:#fafbfc;transition:border .2s}.memo-modal-actions{display:flex;justify-content:flex-end;gap:8px}.memo-modal-btn-cancel{background:#f5f6fa;color:#555;border:none;border-radius:6px;padding:7px 18px;font-size:15px;cursor:pointer;transition:background .2s}.memo-modal-btn-save{background:#3b82f6;color:#fff;border:none;border-radius:6px;padding:7px 18px;font-size:15px;font-weight:600;cursor:pointer;box-shadow:0 1px 4px #3b82f614;transition:background .2s}.memo-modal-btn-remove{background:transparent;border:none;padding:0;margin-left:8px;cursor:pointer;display:flex;align-items:center}@media(prefers-color-scheme:dark){.memo-modal-title{color:#ddd}.memo-modal-box{background:#23272f}.memo-modal-btn-cancel{color:#ddd;background:#111}}";
  importCSS(MemoFragmentCss);
  const SvgDeleteIcon = (props) => reactExports.createElement("svg", { xmlns: "http://www.w3.org/2000/svg", fill: "#ef4444", viewBox: "0 0 24 24", width: "24px", height: "24px", ...props }, reactExports.createElement("path", { d: "M 10 2 L 9 3 L 4 3 L 4 5 L 20 5 L 20 3 L 15 3 L 14 2 L 10 2 z M 5 7 L 5 22 L 19 22 L 19 7 L 5 7 z M 8 9 L 10 9 L 10 20 L 8 20 L 8 9 z M 14 9 L 16 9 L 16 20 L 14 20 L 14 9 z" }));
  function MemoFragment({ visible, text, onChange, onClose, onSave, onRemove }) {
    if (!visible) return null;
    const handleKeyDown = (e) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        onSave();
      } else if (e.key === "Escape") {
        e.preventDefault();
        onClose();
      }
    };
    return createModal(
jsxRuntimeExports.jsxs(Modal, { id: "memo", onClickBackground: onClose, children: [
jsxRuntimeExports.jsx(Modal.Title, { children: jsxRuntimeExports.jsxs("div", { style: { display: "flex", alignItems: "center", justifyContent: "space-between" }, children: [
jsxRuntimeExports.jsx("span", { children: "메모 작성" }),
jsxRuntimeExports.jsx("button", { className: "memo-modal-btn-remove", onClick: onRemove, title: "메모 삭제", children: jsxRuntimeExports.jsx(SvgDeleteIcon, {}) })
        ] }) }),
jsxRuntimeExports.jsx(Modal.Content, { children: jsxRuntimeExports.jsx(
          "textarea",
          {
            className: "memo-modal-textarea",
            value: text,
            onChange,
            onKeyDown: handleKeyDown,
            autoFocus: true
          }
        ) }),
jsxRuntimeExports.jsx(Modal.Buttons, { children: jsxRuntimeExports.jsxs("div", { style: { display: "flex", justifyContent: "flex-end", gap: "8px" }, children: [
jsxRuntimeExports.jsx("button", { className: "memo-modal-btn-cancel", onClick: onClose, children: "취소" }),
jsxRuntimeExports.jsx("button", { className: "memo-modal-btn-save", onClick: onSave, children: "저장" })
        ] }) })
      ] })
    );
  }
  const SvgMemoIcon = (props) => reactExports.createElement("svg", { viewBox: "0 0 24 24", fill: "none", xmlns: "http://www.w3.org/2000/svg", ...props }, reactExports.createElement("rect", { x: 4, y: 4, width: 16, height: 16, rx: 3, fill: "white" }), reactExports.createElement("path", { d: "M8 8H16V10H8V8ZM8 12H14V14H8V12Z", fill: "#2563eb" }));
  const arcaconMemoOverlayCss = ".arcacon-overlay.memo{background:#2563eb}.arcacon-memo-overlay svg{width:14px;height:14px;fill:#2563eb;display:block}";
  importCSS(arcaconMemoOverlayCss);
  function MemoView({ memoVisible, currentMemoId, openMemo, closeMemo, saveMemo, removeMemo }) {
    const { getMemoById } = useMemoStore();
    const { thumbnailWraps } = useElementStore();
    const [memoText, setMemoText] = reactExports.useState("");
    reactExports.useEffect(() => {
      if (memoVisible && currentMemoId) {
        const memo2 = getMemoById(currentMemoId);
        setMemoText(memo2?.text || "");
      }
    }, [memoVisible, currentMemoId]);
    const isMemoed = (id) => {
      return getMemoById(id) !== null;
    };
    return jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
jsxRuntimeExports.jsx(
        MemoFragment,
        {
          visible: memoVisible,
          text: memoText,
          onChange: (e) => setMemoText(e.target.value),
          onClose: () => {
            setMemoText("");
            closeMemo();
          },
          onSave: () => {
            saveMemo(currentMemoId, memoText);
            setMemoText("");
            closeMemo();
          },
          onRemove: () => {
            removeMemo(currentMemoId);
            setMemoText("");
            closeMemo();
          }
        }
      ),
thumbnailWraps.map((node) => {
        if (!node) return null;
        const id = node.getAttribute("data-attachment-id");
        if (!isMemoed(id)) return null;
        const overlay = getOverlay(node);
        if (!overlay) return null;
        return reactDomExports.createPortal(
jsxRuntimeExports.jsx("div", { className: "arcacon-overlay memo", children: jsxRuntimeExports.jsx(SvgMemoIcon, {}) }),
          overlay
        );
      })
    ] });
  }
  function MemoModule() {
    const { loadMemoItems, getMemoById, setMemoItem, deleteMemoItem } = useMemoStore();
    const { setPermanent } = useArcaconStore();
    const [currentMemoId, setCurrentMemoId] = reactExports.useState(null);
    const [memoVisible, setMemoVisible] = reactExports.useState(false);
    reactExports.useEffect(() => {
      loadMemoItems();
    }, [loadMemoItems]);
    const openMemo = reactExports.useCallback((id) => {
      setCurrentMemoId(id);
      setMemoVisible(true);
    }, []);
    const closeMemo = reactExports.useCallback(() => {
      setCurrentMemoId(null);
      setMemoVisible(false);
    }, []);
    const saveMemo = reactExports.useCallback((id, text) => {
      if (!text) {
        deleteMemoItem(id);
        return;
      }
      setMemoItem(id, text);
      setPermanent(id);
    }, []);
    return jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
jsxRuntimeExports.jsx(
        MemoView,
        {
          memoVisible,
          currentMemoId,
          openMemo,
          closeMemo,
          saveMemo,
          removeMemo: deleteMemoItem
        }
      ),
jsxRuntimeExports.jsx(MemoController, { openMemo })
    ] });
  }
  const SearchInputFragmentCss = ".arcacon-search-input-clear{position:absolute;right:6px;top:50%;transform:translateY(-50%);background:transparent;border:none;padding:0;cursor:pointer;display:flex;align-items:center;z-index:1;transition:background .15s}.arcacon-search-input-clear:hover svg circle{fill:#d1d5db}.arcacon-search-input-container{position:relative;display:flex;align-items:center;height:35px;gap:8px}.arcacon-search-input-container>span{white-space:nowrap}.arcacon-search-input{flex:1;height:30px;padding:8px 28px 8px 12px;font-size:15px;border-radius:6px;border:1px solid #e0e0e0;outline:none;box-sizing:border-box;background:#fafbfc;box-shadow:inset 0 1px 2px #00000026}";
  importCSS(SearchInputFragmentCss);
  const SvgClearIcon = (props) => reactExports.createElement("svg", { width: 18, height: 18, viewBox: "0 0 20 20", fill: "none", xmlns: "http://www.w3.org/2000/svg", ...props }, reactExports.createElement("circle", { cx: 10, cy: 10, r: 9, fill: "#e0e0e0" }), reactExports.createElement("path", { d: "M7 7l6 6M13 7l-6 6", stroke: "#888", strokeWidth: 1.5, strokeLinecap: "round" }));
  function SearchInputFragment({ value, onChange }) {
    return jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
jsxRuntimeExports.jsx("span", { children: "메모 검색" }),
jsxRuntimeExports.jsxs("div", { className: "arcacon-search-input-container", children: [
jsxRuntimeExports.jsx(
          "input",
          {
            className: "arcacon-search-input",
            type: "text",
            value,
            onChange,
            placeholder: "검색어를 입력하세요"
          }
        ),
        value && jsxRuntimeExports.jsx(
          "button",
          {
            type: "button",
            className: "arcacon-search-input-clear",
            onClick: () => onChange({ target: { value: "" } }),
            tabIndex: -1,
            "aria-label": "검색어 지우기",
            children: jsxRuntimeExports.jsx(SvgClearIcon, {})
          }
        )
      ] })
    ] });
  }
  function SearchView({ getInputValue, setInputValue, keyword, getKeyword, setKeyword }) {
    const { pickers } = useElementStore();
    const { memoItems } = useMemoStore();
    const { getArcaconById } = useArcaconStore();
    const updateKeyword = useDebounce(setKeyword, 300);
    return jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
      pickers.map((picker) => {
        const node = picker.optionsToolbar;
        if (!node) return null;
        return jsxRuntimeExports.jsx(PortalAhead, { className: "arcacon-search-input-container", target: node, children: jsxRuntimeExports.jsx(
          SearchInputFragment,
          {
            value: getInputValue(picker.uid),
            onChange: (e) => {
              const value = e.target.value;
              setInputValue(picker.uid, value);
              updateKeyword(picker.uid, value);
            }
          }
        ) }, `arcacon-search-${picker.uid}`);
      }),
Object.entries(keyword).map(([uid, kw]) => {
        const picker = pickers.find((p) => p.uid === uid);
        picker.content.classList.remove("search-only");
        if (!kw) return null;
        if (!picker) return null;
        picker.content.classList.add("search-only");
        const searchResult = memoItems.reduce((acc, item) => item.text.includes(kw) ? [...acc, item] : acc, []);
        return reactDomExports.createPortal(
jsxRuntimeExports.jsx("div", { className: "--package-wrap", "data-package-id": SERACH_PACKAGE_ID, children: jsxRuntimeExports.jsx(
            PackageContent,
            {
              id: SERACH_PACKAGE_ID,
              title: `검색 결과: ${kw}, 총 ${searchResult.length}개`,
              items: searchResult.map((item) => getArcaconById(item.id))
            }
          ) }, `arcacon-search-result-${uid}`),
          picker.content
        );
      })
    ] });
  }
  function SearchController({ setInputValue, setKeyword }) {
    useEventListener("click", (e) => {
      const target = e.target;
      if (target.closest(".package-item")) {
        const uid = target.closest(".arcaconPicker")?.getAttribute("data-uid");
        setKeyword(uid, "");
        setInputValue(uid, "");
        setTimeout(() => {
          const t = e.target;
          const n = t.getAttribute("data-package-id");
          const a = t.closest(".arcaconPicker").querySelector(
            `.content [data-package-id="${n}"].package-wrap, .content [data-package-id="${n}"].--package-wrap`
          );
          a && (a.parentElement.scrollTop = a.offsetTop);
        }, 100);
      }
    });
    return null;
  }
  function SearchModule() {
    const { get: getInputValue, set: setInputValue, state: inputValue } = useMultiState("");
    const { get: getKeyword, set: setKeyword, state: keyword } = useMultiState("");
    return jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
jsxRuntimeExports.jsx(
        SearchView,
        {
          inputValue,
          getInputValue,
          setInputValue,
          keyword,
          getKeyword,
          setKeyword
        }
      ),
jsxRuntimeExports.jsx(SearchController, { setInputValue, setKeyword })
    ] });
  }
  function FixerModule() {
    const { getArcaconById, setArcaconItem } = useArcaconStore();
    useFetchHook(/\/b\/([^/]+)\/\d+\/comment/, async (args) => {
      const body = args[1]?.body;
      let parsed = {};
      if (typeof body === "string" && body.includes("=")) {
        parsed = Object.fromEntries(new URLSearchParams(body));
      }
      if (parsed.contentType === "emoticon") {
        const id = parsed.attachmentId;
        const emoticonid = parsed.emoticonId;
        if (emoticonid <= 0) {
          const arcaconItem = getArcaconById(id, true);
          if (arcaconItem) {
            arcaconItem.emoticonid = await getEmoticonId(id);
            setArcaconItem(arcaconItem, true);
            parsed.emoticonId = arcaconItem.emoticonid;
          }
        }
      } else if (parsed.contentType === "combo_emoticon") {
        const combolist = JSON.parse(parsed.combolist).map((item) => ({ id: item[1], emoticonid: item[0] }));
        for (const { id, emoticonid } of combolist) {
          if (emoticonid <= 0) {
            const arcaconItem = getArcaconById(id, true);
            if (arcaconItem) {
              arcaconItem.emoticonid = await getEmoticonId(id);
              setArcaconItem(arcaconItem, true);
              combolist.emoticonid = arcaconItem.emoticonid;
            }
          }
        }
        parsed.combolist = JSON.stringify(combolist.map((item) => [item.emoticonid, item.id]));
      }
      let modifiedBody = "";
      for (const [key, value] of Object.entries(parsed)) {
        if (modifiedBody.length > 0) modifiedBody += "&";
        modifiedBody += `${key}=${encodeURIComponent(value)}`;
      }
      const newArgs = [...args];
      if (newArgs[1]) {
        newArgs[1] = { ...newArgs[1], body: modifiedBody };
      } else {
        newArgs[1] = { body: modifiedBody };
      }
      return originalFetch.apply(this, newArgs);
    });
    return null;
  }
  function App() {
    return jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
jsxRuntimeExports.jsx(ContentCollector, {}),
jsxRuntimeExports.jsx(ThumbnailOverlay, {}),
jsxRuntimeExports.jsx(FavoriteModule, {}),
jsxRuntimeExports.jsx(MemoModule, {}),
jsxRuntimeExports.jsx(SearchModule, {}),
jsxRuntimeExports.jsx(FixerModule, {})
    ] });
  }
  const indexCss = '.thumbnail-wrap:hover:has(.arcacon-overlay){border-top-right-radius:0!important}.thumbnails{padding-top:.5rem}.option-combo-emoticon.visible{visibility:visible}.--arcacon-not-found{display:none}.arcacon-overlay{width:16px;height:16px;border-radius:0 0 6px 6px;box-shadow:0 2px 4px #00000080;display:flex;align-items:center;justify-content:center;pointer-events:auto;border-top:none}.content.search-only>.package-wrap[data-package-id]:not([data-package-id="-2"]),.content.search-only>.--package-wrap[data-package-id]:not([data-package-id="-2"]){display:none}.arcaconPicker .title-area{height:auto;display:flex;flex-wrap:wrap;justify-content:flex-end}.arcaconPicker .title-area>:first-child{margin-right:auto}.options-toolbar{margin-left:20px}';
  importCSS(indexCss);
  const origRemove = Node.prototype.removeChild;
  Node.prototype.removeChild = function(child) {
    if (child.parentNode !== this) {
      return child;
    }
    return origRemove.apply(this, arguments);
  };
  ReactDOM.createRoot(
    (() => {
      const app = document.createElement("div");
      document.body.append(app);
      return app;
    })()
  ).render(
jsxRuntimeExports.jsx(React.StrictMode, { children: jsxRuntimeExports.jsx(App, {}) })
  );

})();