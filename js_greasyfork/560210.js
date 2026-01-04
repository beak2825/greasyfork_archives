// ==UserScript==
// @name Taming WebSocket Hook
// @author Murka
// @description Hooks taming.io websocket
// @icon https://taming.io/img/ui/favicon.png
// @version 1.0.0
// @match *://taming.io/*
// @run-at document-start
// @grant none
// @license MIT
// @namespace https://greasyfork.org/users/919633
// @downloadURL https://update.greasyfork.org/scripts/560210/Taming%20WebSocket%20Hook.user.js
// @updateURL https://update.greasyfork.org/scripts/560210/Taming%20WebSocket%20Hook.meta.js
// ==/UserScript==
/* jshint esversion:6 */

/*
    Author: Murka
    Github: https://github.com/Murka007
    Greasyfork: https://greasyfork.org/users/919633
    Discord: https://discord.gg/cPRFdcZkeD
*/

(function() {
    "use strict";

    const log = console.log;
    const _Function = Function;
    const _Proxy = Proxy;
    const _apply = Reflect.apply;
    const _WebSocket = WebSocket;
    const _Uint8Array = Uint8Array;
    const _getOwnPropertyDescriptor = Object.getOwnPropertyDescriptor;
    const _defineProperty = Object.defineProperty;

    const _FunctionNew = window.Function = new _Proxy(Function, {
        construct(target, args) {
            if (/debugger/.test(args[0])) {
                return function(){}
            }
            return new target(...args);
        }
    });

    const hookContext = (scope, type, callback) => {
        const proto = scope.HTMLIFrameElement.prototype;
        const descriptor = _getOwnPropertyDescriptor(proto, type);
        _defineProperty(proto, type, {
            get() {
                const target = descriptor.get.call(this);
                callback(target);
                return target;
            },
            configurable: true
        });
    }

    const handleSocket = (socket) => {
        if (socket.onopen === null) return;
        log("socket", socket);

        socket.addEventListener("message", event => {
            const temp = new _Uint8Array(event.data);
            log(temp);
        });
    }

    const scopeList = new Set();
    (function getScope(scope) {
        if (scopeList.has(scope)) return;
        scopeList.add(scope);
        log("found scope", scope);

        const _binaryType = _getOwnPropertyDescriptor(scope.WebSocket.prototype, "binaryType");
        _defineProperty(scope.WebSocket.prototype, "binaryType", {
            set(value) {
                handleSocket(this);
                return _binaryType.set.call(this, value);
            },
            get() {
                return _binaryType.get.call(this);
            },
            configurable: true
        });

        const _createElement = scope.document.createElement;
        scope.document.createElement = function(tagName) {
            if (tagName === "iframe") {
                hookContext(scope, "contentWindow", target => getScope(target));
                hookContext(scope, "contentDocument", target => getScope(target.defaultView));
            }
            return _createElement.call(this, tagName);
        }
    })(window);

    const toStringOld = Function.prototype.toString;
    const toStringNew = Function.prototype.toString = new _Proxy(toStringOld, {
        apply(target, thisArg, args) {
            if (thisArg === _FunctionNew) return _apply(target, _Function, args);
            if (thisArg === toStringNew) return _apply(target, toStringOld, args);
            return _apply(target, thisArg, args);
        }
    });

})();