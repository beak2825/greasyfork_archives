// ==UserScript==
// @name         解除中国大学 MOOC网站各种限制
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  移除复制粘贴限制、允许使用右键、禁止切屏检测、禁止弹窗警告、去除水印
// @author       Androw Smith
// @include      *://*.icourse163.org/*
// @include      *://*.163.net/*
// @include      *://*.126.net/*
// @include      *://*.127.net/*
// @grant        none
// @run-at       document-start
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/561120/%E8%A7%A3%E9%99%A4%E4%B8%AD%E5%9B%BD%E5%A4%A7%E5%AD%A6%20MOOC%E7%BD%91%E7%AB%99%E5%90%84%E7%A7%8D%E9%99%90%E5%88%B6.user.js
// @updateURL https://update.greasyfork.org/scripts/561120/%E8%A7%A3%E9%99%A4%E4%B8%AD%E5%9B%BD%E5%A4%A7%E5%AD%A6%20MOOC%E7%BD%91%E7%AB%99%E5%90%84%E7%A7%8D%E9%99%90%E5%88%B6.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 禁止弹窗警告
    (function() {
      window.Notification = {
        get permission() {
          return "denied";
        },
        set permission(a) {
          return "denied";
        },
        requestPermission: function(fn) {
          if ("function" === typeof fn) {
            fn("denied");
            return;
          } else {
            return {
              then: function(fn) {
                fn("denied");
                return this;
              }
            };
          }
        }
      };
    })();

    // 禁止拦截剪贴板
    (function() {
        document.execCommand = () => {};
        if (navigator.clipboard) {
            navigator.clipboard.writeText = () => {};
            navigator.clipboard.write = () => {};
        }
    })();


    // 解除右键、选择和复制限制
    (function() {
        const head = document.head;
        if (!head) return;

        // 强制允许选择文本
        const css = document.createElement('style');
        css.type = 'text/css';
        css.innerText = `* {
            -webkit-user-select: text !important;
            -moz-user-select: text !important;
            -ms-user-select: text !important;
             user-select: text !important;
        }`;
        head.appendChild(css);

        // 获取并移除旧的事件处理
        const doc = document;
        const body = document.body;

        doc.oncontextmenu = null;
        doc.onselectstart = null;  //移除
        doc.ondragstart = null;
        doc.onmousedown = null;

        if (body) {
            body.oncontextmenu = null;
            body.onselectstart = null;
            body.ondragstart = null;
            body.onmousedown = null;
            body.oncut = null;
            body.oncopy = null;
            body.onpaste = null;
        }

        //彻底解除限制
        const eventsToStop = ['contextmenu', 'copy', 'cut', 'paste', 'mouseup', 'mousedown', 'keyup', 'keydown', 'drag', 'dragstart', 'select', 'selectstart'];
        eventsToStop.forEach(function(event) {
            document.addEventListener(event, function(e) {
                e.stopPropagation(); //阻止事件
            }, true);
        });

        // 增加上下文菜单处理
        window.addEventListener('contextmenu', function contextmenu(event) {
            event.stopPropagation();
            event.stopImmediatePropagation();
            var handler = new eventHandler(event);
            window.removeEventListener(event.type, contextmenu, true);
            var eventsCallBack = new eventsCall(function() {});
            handler.fire();
            window.addEventListener(event.type, contextmenu, true);
            if (handler.isCanceled && (eventsCallBack.isCalled)) {
                event.preventDefault();
            }
        }, true);

        function eventsCall() {
            this.events = ['DOMAttrModified', 'DOMNodeInserted', 'DOMNodeRemoved', 'DOMCharacterDataModified', 'DOMSubtreeModified'];
            this.bind();
        }
        eventsCall.prototype.bind = function() {
            this.events.forEach(function (event) {
                document.addEventListener(event, this, true);
            }.bind(this));
        };
        eventsCall.prototype.handleEvent = function() {
            this.isCalled = true;
        };

        function eventHandler(event) {
            this.event = event;
            this.contextmenuEvent = this.createEvent(this.event.type);
        }
        eventHandler.prototype.createEvent = function(type) {
            var target = this.event.target;
            var event = target.ownerDocument.createEvent('MouseEvents');
            event.initMouseEvent(
                type, this.event.bubbles, this.event.cancelable,
                target.ownerDocument.defaultView, this.event.detail,
                this.event.screenX, this.event.screenY, this.event.clientX, this.event.clientY,
                this.event.ctrlKey, this.event.altKey, this.event.shiftKey, this.event.metaKey,
                this.event.button, this.event.relatedTarget
            );
            return event;
        };
        eventHandler.prototype.fire = function() {
            var target = this.event.target;
            target.dispatchEvent(this.contextmenuEvent);
            this.isCanceled = this.contextmenuEvent.defaultPrevented;
        };
    })();

    // 禁止切屏检测，禁止读取页面非活动状态
    (function () {
      function pinValue(obj, key, value) {
        try {
          Object.defineProperty(obj, key, {
            enumerable: false,
            configurable: false,
            get: () => value,
            set: () => {}
          });
        } catch(e) { /* 忽略 */ }
      }

      function disableEvent(eventTarget, name) {
        try {
          eventTarget.addEventListener(
            name,
            (ev) => {
              ev.stopImmediatePropagation();
            },
            true
          );
        } catch(e) { /* 忽略 */ }
      }

      pinValue(document, "hidden", false);
      pinValue(document, "webkitHidden", false);
      pinValue(document, "visibilityState", "visible");
      pinValue(document, "webkitVisibilityState", "visible");

      disableEvent(window, "blur");
      disableEvent(window, "pagehide");
      disableEvent(document, "visibilitychange");

      if(document.hasFocus) {
          document.hasFocus = () => true;
      }

    })();

    // 去除水印
    (function() {
        'use strict';
        function removeWaterContent() {
            var waterContent = document.getElementById("waterContent");
            if (waterContent) {
                waterContent.remove();
            }
        }
        // 立即执行一次，并设定定时器每10秒循环一次
        removeWaterContent();
        setInterval(removeWaterContent, 10000);
    })();

})();

