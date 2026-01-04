// ==UserScript==
// @name         超星学习通全能增强小帮手，自动化操作小帮手，题库查询，让学习更轻松高效
// @namespace    Aaron
// @version      1.1.0
// @author       Aaron
// @description  💻提供超星/学习通多项功能支持，全面增强💻。通提供以下内容：1、章节视频 2、课程作业 3、章节测验 4、智能题库对接。🔥简单高效，持续更新。
// @icon         data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBzdGFuZGFsb25lPSJubyI/PjwhRE9DVFlQRSBzdmcgUFVCTElDICItLy9XM0MvL0RURCBTVkcgMS4xLy9FTiIgImh0dHA6Ly93d3cudzMub3JnL0dyYXBoaWNzL1NWRy8xLjEvRFREL3N2ZzExLmR0ZCI+PHN2ZyB0PSIxNzU3MDcxNDYxMDkyIiBjbGFzcz0iaWNvbiIgdmlld0JveD0iMCAwIDEwMjQgMTAyNCIgdmVyc2lvbj0iMS4xIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHAtaWQ9IjI3NTMiIGlkPSJteF9uXzE3NTcwNzE0NjEwOTMiIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCI+PHBhdGggZD0iTTUxMiAwQzIyOS4yMDYgMCAwLjAyIDIyOS4yMjYgMC4wMiA1MTIuMDIgMC4wMiA3OTQuNzc1IDIyOS4yMDcgMTAyNCA1MTIgMTAyNHM1MTEuOTgtMjI5LjIyNiA1MTEuOTgtNTExLjk4QzEwMjMuOTggMjI5LjIyNyA3OTQuNzkzIDAgNTEyIDB6IG0zMDMuMzcyIDMxOC45NUw0NjguNzIgNzgwLjE1NGMtMTAuODMgMTQuMzctMjcuMzI2IDIzLjQxLTQ1LjI4IDI0Ljc0M2E1OC44OSA1OC44OSAwIDAgMS00LjY2NCAwLjE2NmMtMTYuMzMgMC0zMi4wNzUtNi4zNzMtNDMuNzgtMTcuOTExTDE4Mi4wOTQgNTk3LjcwNWMtMjQuNjE4LTI0LjIwMi0yNC45OTMtNjMuNzMyLTAuNzkxLTg4LjM1IDI0LjIwMS0yNC42NiA2My43MzEtMjQuOTUxIDg4LjM1LTAuODMzbDE0Mi4wNDIgMTM5LjUwMiAzMDMuNzg5LTQwNC4yMThjMjAuNzQ0LTI3LjU3NiA1OS45LTMzLjExNiA4Ny41MTYtMTIuNDE0IDI3LjUzNCAyMC44MjggMzMuMTE2IDU5Ljk4MyAxMi4zNzIgODcuNTU5eiIgcC1pZD0iMjc1NCIgZmlsbD0iIzEyOTZkYiI+PC9wYXRoPjwvc3ZnPg==
// @match        *://*.chaoxing.com/*
// @match        *://*.edu.cn/*
// @match        *://*.nbdlib.cn/*
// @match         *://*.hnsyu.net/*
// @match        *://*.gdhkmooc.com/*
// @match        *://*.zhihuishu.com/*
// @require      https://cdn.jsdelivr.net/npm/vue@3.4.31/dist/vue.global.prod.js
// @require      data:application/javascript,%3Bwindow.Vue%3DVue%3B
// @require      https://unpkg.com/dayjs/dayjs.min.js
// @require      https://unpkg.com/dayjs/plugin/customParseFormat.js
// @require      https://unpkg.com/dayjs/plugin/weekday.js
// @require      https://unpkg.com/dayjs/plugin/localeData.js
// @require      https://unpkg.com/dayjs/plugin/weekOfYear.js
// @require      https://unpkg.com/dayjs/plugin/weekYear.js
// @require      https://unpkg.com/dayjs/plugin/advancedFormat.js
// @require      https://unpkg.com/dayjs/plugin/quarterOfYear.js
// @require      https://unpkg.com/ant-design-vue@3.2.20/dist/antd.min.js
// @require      https://unpkg.com/pinia@3.0.3/dist/pinia.iife.prod.js
// @require      https://unpkg.com/blueimp-md5@2.19.0/js/md5.min.js
// @require      https://unpkg.com/crypto-js@4.2.0/crypto-js.js
// @require      https://cdn.jsdelivr.net/npm/systemjs@6.15.1/dist/system.min.js
// @require      https://cdn.jsdelivr.net/npm/systemjs@6.15.1/dist/extras/named-register.min.js
// @require      data:application/javascript,%3B(typeof%20System!%3D'undefined')%26%26(System%3Dnew%20System.constructor())%3B
// @resource     AntdStyle  https://unpkg.com/ant-design-vue@3.3.0-beta.4/dist/antd.min.css
// @resource     ttf        https://www.forestpolice.org/ttf/2.0/table.json
// @connect      cx.icodef.com
// @connect      www.aiask.site
// @connect      ocsjs.com
// @grant        GM_addStyle
// @grant        GM_deleteValue
// @grant        GM_getResourceText
// @grant        GM_getValue
// @grant        GM_info
// @grant        GM_setValue
// @grant        GM_xmlhttpRequest
// @grant        unsafeWindow
// @run-at       document-end
// @antifeature  ads
// @antifeature  payment
// @downloadURL https://update.greasyfork.org/scripts/552437/%E8%B6%85%E6%98%9F%E5%AD%A6%E4%B9%A0%E9%80%9A%E5%85%A8%E8%83%BD%E5%A2%9E%E5%BC%BA%E5%B0%8F%E5%B8%AE%E6%89%8B%EF%BC%8C%E8%87%AA%E5%8A%A8%E5%8C%96%E6%93%8D%E4%BD%9C%E5%B0%8F%E5%B8%AE%E6%89%8B%EF%BC%8C%E9%A2%98%E5%BA%93%E6%9F%A5%E8%AF%A2%EF%BC%8C%E8%AE%A9%E5%AD%A6%E4%B9%A0%E6%9B%B4%E8%BD%BB%E6%9D%BE%E9%AB%98%E6%95%88.user.js
// @updateURL https://update.greasyfork.org/scripts/552437/%E8%B6%85%E6%98%9F%E5%AD%A6%E4%B9%A0%E9%80%9A%E5%85%A8%E8%83%BD%E5%A2%9E%E5%BC%BA%E5%B0%8F%E5%B8%AE%E6%89%8B%EF%BC%8C%E8%87%AA%E5%8A%A8%E5%8C%96%E6%93%8D%E4%BD%9C%E5%B0%8F%E5%B8%AE%E6%89%8B%EF%BC%8C%E9%A2%98%E5%BA%93%E6%9F%A5%E8%AF%A2%EF%BC%8C%E8%AE%A9%E5%AD%A6%E4%B9%A0%E6%9B%B4%E8%BD%BB%E6%9D%BE%E9%AB%98%E6%95%88.meta.js
// ==/UserScript==

(a=>{if(typeof GM_addStyle=="function"){GM_addStyle(a);return}const e=document.createElement("style");e.textContent=a,document.head.append(e)})(" .log-item[data-v-fb48fcc8]{padding:2px 5px}.log-message[data-v-fb48fcc8]{word-break:break-word}.log-message[data-v-fb48fcc8] img{max-width:100%;height:auto;vertical-align:middle}.log-message[data-v-fb48fcc8] p{margin:0;display:inline}.answer-question[data-v-483c44ce] img,.answer-value[data-v-483c44ce] img{max-width:100%;height:auto;vertical-align:middle;margin:2px 0}.answer-question[data-v-483c44ce] p,.answer-value[data-v-483c44ce] p{margin:2px 0;display:inline-block}.answer-question[data-v-483c44ce] *,.answer-value[data-v-483c44ce] *{word-break:break-word}.floating-modal[data-v-95dbc5a8]{position:fixed;z-index:1000} ");

System.addImportMap({ imports: {"vue":"user:vue","pinia":"user:pinia","ant-design-vue":"user:ant-design-vue","crypto-js":"user:crypto-js","blueimp-md5":"user:blueimp-md5"} });
System.set("user:vue", (()=>{const _=Vue;('default' in _)||(_.default=_);return _})());
System.set("user:pinia", (()=>{const _=Pinia;('default' in _)||(_.default=_);return _})());
System.set("user:ant-design-vue", (()=>{const _=antd;('default' in _)||(_.default=_);return _})());
System.set("user:crypto-js", (()=>{const _=CryptoJS;('default' in _)||(_.default=_);return _})());
System.set("user:blueimp-md5", (()=>{const _=md5;('default' in _)||(_.default=_);return _})());

System.register("./__entry.js", ['./__monkey.entry-53VJY8gR.js'], (function (exports, module) {
	'use strict';
	return {
		setters: [null],
		execute: (function () {



		})
	};
}));

System.register("./__monkey.entry-53VJY8gR.js", ['vue', 'pinia', 'crypto-js', 'ant-design-vue'], (function (exports, module) {
  'use strict';
  var defineComponent, reactive, ref, toRefs$1, onMounted, watch, watchEffect, computed, createApp, getCurrentInstance, nextTick, createVNode, toValue, onUnmounted, createElementBlock, openBlock, createElementVNode, createBlock, createCommentVNode, inject, Fragment, renderList, toDisplayString, createTextVNode, normalizeClass, isRef, customRef, h, pushScopeId, popScopeId, getCurrentScope, onScopeDispose, resolveComponent, withCtx, normalizeStyle, resolveDynamicComponent, unref, defineStore, createPinia, CryptoJS, Antd;
  return {
    setters: [module => {
      defineComponent = module.defineComponent;
      reactive = module.reactive;
      ref = module.ref;
      toRefs$1 = module.toRefs;
      onMounted = module.onMounted;
      watch = module.watch;
      watchEffect = module.watchEffect;
      computed = module.computed;
      createApp = module.createApp;
      getCurrentInstance = module.getCurrentInstance;
      nextTick = module.nextTick;
      createVNode = module.createVNode;
      toValue = module.toValue;
      onUnmounted = module.onUnmounted;
      createElementBlock = module.createElementBlock;
      openBlock = module.openBlock;
      createElementVNode = module.createElementVNode;
      createBlock = module.createBlock;
      createCommentVNode = module.createCommentVNode;
      inject = module.inject;
      Fragment = module.Fragment;
      renderList = module.renderList;
      toDisplayString = module.toDisplayString;
      createTextVNode = module.createTextVNode;
      normalizeClass = module.normalizeClass;
      isRef = module.isRef;
      customRef = module.customRef;
      h = module.h;
      pushScopeId = module.pushScopeId;
      popScopeId = module.popScopeId;
      getCurrentScope = module.getCurrentScope;
      onScopeDispose = module.onScopeDispose;
      resolveComponent = module.resolveComponent;
      withCtx = module.withCtx;
      normalizeStyle = module.normalizeStyle;
      resolveDynamicComponent = module.resolveDynamicComponent;
      unref = module.unref;
    }, module => {
      defineStore = module.defineStore;
      createPinia = module.createPinia;
    }, module => {
      CryptoJS = module.default;
    }, module => {
      Antd = module.default;
    }],
    execute: (function () {

      function tryOnScopeDispose(fn) {
        if (getCurrentScope()) {
          onScopeDispose(fn);
          return true;
        }
        return false;
      }
      const isClient = typeof window !== "undefined" && typeof document !== "undefined";
      typeof WorkerGlobalScope !== "undefined" && globalThis instanceof WorkerGlobalScope;
      const toString = Object.prototype.toString;
      const isObject = (val) => toString.call(val) === "[object Object]";
      function toArray(value) {
        return Array.isArray(value) ? value : [value];
      }
      function toRefs(objectRef, options = {}) {
        if (!isRef(objectRef))
          return toRefs$1(objectRef);
        const result = Array.isArray(objectRef.value) ? Array.from({ length: objectRef.value.length }) : {};
        for (const key in objectRef.value) {
          result[key] = customRef(() => ({
            get() {
              return objectRef.value[key];
            },
            set(v) {
              var _a;
              const replaceRef = (_a = toValue(options.replaceRef)) != null ? _a : true;
              if (replaceRef) {
                if (Array.isArray(objectRef.value)) {
                  const copy = [...objectRef.value];
                  copy[key] = v;
                  objectRef.value = copy;
                } else {
                  const newObject = { ...objectRef.value, [key]: v };
                  Object.setPrototypeOf(newObject, Object.getPrototypeOf(objectRef.value));
                  objectRef.value = newObject;
                }
              } else {
                objectRef.value[key] = v;
              }
            }
          }));
        }
        return result;
      }
      function watchImmediate(source, cb, options) {
        return watch(
          source,
          cb,
          {
            ...options,
            immediate: true
          }
        );
      }
      const defaultWindow = isClient ? window : void 0;
      function unrefElement(elRef) {
        var _a;
        const plain = toValue(elRef);
        return (_a = plain == null ? void 0 : plain.$el) != null ? _a : plain;
      }
      function useEventListener(...args) {
        const cleanups = [];
        const cleanup = () => {
          cleanups.forEach((fn) => fn());
          cleanups.length = 0;
        };
        const register = (el, event, listener, options) => {
          el.addEventListener(event, listener, options);
          return () => el.removeEventListener(event, listener, options);
        };
        const firstParamTargets = computed(() => {
          const test = toArray(toValue(args[0])).filter((e) => e != null);
          return test.every((e) => typeof e !== "string") ? test : void 0;
        });
        const stopWatch = watchImmediate(
          () => {
            var _a, _b;
            return [
              (_b = (_a = firstParamTargets.value) == null ? void 0 : _a.map((e) => unrefElement(e))) != null ? _b : [defaultWindow].filter((e) => e != null),
              toArray(toValue(firstParamTargets.value ? args[1] : args[0])),
              toArray(unref(firstParamTargets.value ? args[2] : args[1])),
              // @ts-expect-error - TypeScript gets the correct types, but somehow still complains
              toValue(firstParamTargets.value ? args[3] : args[2])
            ];
          },
          ([raw_targets, raw_events, raw_listeners, raw_options]) => {
            cleanup();
            if (!(raw_targets == null ? void 0 : raw_targets.length) || !(raw_events == null ? void 0 : raw_events.length) || !(raw_listeners == null ? void 0 : raw_listeners.length))
              return;
            const optionsClone = isObject(raw_options) ? { ...raw_options } : raw_options;
            cleanups.push(
              ...raw_targets.flatMap(
                (el) => raw_events.flatMap(
                  (event) => raw_listeners.map((listener) => register(el, event, listener, optionsClone))
                )
              )
            );
          },
          { flush: "post" }
        );
        const stop = () => {
          stopWatch();
          cleanup();
        };
        tryOnScopeDispose(cleanup);
        return stop;
      }
      function useDraggable(target, options = {}) {
        var _a;
        const {
          pointerTypes,
          preventDefault: preventDefault2,
          stopPropagation,
          exact,
          onMove,
          onEnd,
          onStart,
          initialValue,
          axis = "both",
          draggingElement = defaultWindow,
          containerElement,
          handle: draggingHandle = target,
          buttons = [0]
        } = options;
        const position = ref(
          (_a = toValue(initialValue)) != null ? _a : { x: 0, y: 0 }
        );
        const pressedDelta = ref();
        const filterEvent = (e) => {
          if (pointerTypes)
            return pointerTypes.includes(e.pointerType);
          return true;
        };
        const handleEvent = (e) => {
          if (toValue(preventDefault2))
            e.preventDefault();
          if (toValue(stopPropagation))
            e.stopPropagation();
        };
        const start = (e) => {
          var _a2;
          if (!toValue(buttons).includes(e.button))
            return;
          if (toValue(options.disabled) || !filterEvent(e))
            return;
          if (toValue(exact) && e.target !== toValue(target))
            return;
          const container = toValue(containerElement);
          const containerRect = (_a2 = container == null ? void 0 : container.getBoundingClientRect) == null ? void 0 : _a2.call(container);
          const targetRect = toValue(target).getBoundingClientRect();
          const pos = {
            x: e.clientX - (container ? targetRect.left - containerRect.left + container.scrollLeft : targetRect.left),
            y: e.clientY - (container ? targetRect.top - containerRect.top + container.scrollTop : targetRect.top)
          };
          if ((onStart == null ? void 0 : onStart(pos, e)) === false)
            return;
          pressedDelta.value = pos;
          handleEvent(e);
        };
        const move = (e) => {
          if (toValue(options.disabled) || !filterEvent(e))
            return;
          if (!pressedDelta.value)
            return;
          const container = toValue(containerElement);
          const targetRect = toValue(target).getBoundingClientRect();
          let { x, y } = position.value;
          if (axis === "x" || axis === "both") {
            x = e.clientX - pressedDelta.value.x;
            if (container)
              x = Math.min(Math.max(0, x), container.scrollWidth - targetRect.width);
          }
          if (axis === "y" || axis === "both") {
            y = e.clientY - pressedDelta.value.y;
            if (container)
              y = Math.min(Math.max(0, y), container.scrollHeight - targetRect.height);
          }
          position.value = {
            x,
            y
          };
          onMove == null ? void 0 : onMove(position.value, e);
          handleEvent(e);
        };
        const end = (e) => {
          if (toValue(options.disabled) || !filterEvent(e))
            return;
          if (!pressedDelta.value)
            return;
          pressedDelta.value = void 0;
          onEnd == null ? void 0 : onEnd(position.value, e);
          handleEvent(e);
        };
        if (isClient) {
          const config = () => {
            var _a2;
            return {
              capture: (_a2 = options.capture) != null ? _a2 : true,
              passive: !toValue(preventDefault2)
            };
          };
          useEventListener(draggingHandle, "pointerdown", start, config);
          useEventListener(draggingElement, "pointermove", move, config);
          useEventListener(draggingElement, "pointerup", end, config);
        }
        return {
          ...toRefs(position),
          position,
          isDragging: computed(() => !!pressedDelta.value),
          style: computed(
            () => `left:${position.value.x}px;top:${position.value.y}px;`
          )
        };
      }
      const LOG_TYPES = {
        INFO: "info",
        // ℹ️ 普通信息
        SUCCESS: "success",
        // ✅ 成功
        ERROR: "error",
        // ❌ 错误
        WARNING: "warning"
        // ⚠️ 警告
      };
      const useLogStore = defineStore("log", {
        state: () => ({
          logs: [],
          maxLogs: 100
          // 最大日志数量，防止内存占用过多
        }),
        actions: {
          addLog(message, type = LOG_TYPES.INFO) {
            const log = {
              id: Date.now(),
              message,
              type,
              timestamp: (/* @__PURE__ */ new Date()).toLocaleTimeString()
            };
            this.logs.push(log);
            if (this.logs.length > this.maxLogs) {
              this.logs.shift();
            }
            console.log(`${type || ""} ${message}`);
          },
          clearLogs() {
            this.logs = [];
          },
          // 按类型获取日志
          getLogsByType(type) {
            return this.logs.filter((log) => log.type === type);
          }
        },
        getters: {
          // 获取最新的n条日志
          getLogs: (state) => {
            return state.logs;
          },
          // 获取错误日志
          errorLogs: (state) => {
            return state.logs.filter((log) => log.type === "error");
          },
          // 获取成功日志
          successLogs: (state) => {
            return state.logs.filter((log) => log.type === "success");
          },
          // 获取日志总数
          totalLogs: (state) => {
            return state.logs.length;
          }
        }
      });
      const _export_sfc = (sfc, props) => {
        const target = sfc.__vccOpts || sfc;
        for (const [key, val] of props) {
          target[key] = val;
        }
        return target;
      };
      const _sfc_main$4 = defineComponent({
        setup() {
          const logStore2 = useLogStore();
          const getTypeIcon = (type) => {
            switch (type) {
              case LOG_TYPES.SUCCESS:
                return "✅";
              case LOG_TYPES.ERROR:
                return "❌";
              case LOG_TYPES.WARNING:
                return "⚠️";
              case LOG_TYPES.INFO:
              default:
                return "ℹ️";
            }
          };
          return {
            logStore: logStore2,
            getTypeIcon
          };
        }
      });
      const _hoisted_1$4 = {
        class: "log-viewer",
        style: { "max-height": "300px", "overflow": "hidden", "overflow-y": "auto" }
      };
      const _hoisted_2$4 = { class: "log-content" };
      const _hoisted_3$3 = {
        class: "log-time",
        style: { "margin-right": "10px" }
      };
      const _hoisted_4$3 = {
        class: "log-icon",
        style: { "margin-right": "5px" }
      };
      const _hoisted_5$3 = ["innerHTML"];
      function _sfc_render$3(_ctx, _cache, $props, $setup, $data, $options) {
        return openBlock(), createElementBlock("div", _hoisted_1$4, [
          createElementVNode("div", _hoisted_2$4, [
            (openBlock(true), createElementBlock(Fragment, null, renderList(_ctx.logStore.getLogs, (log, index) => {
              return openBlock(), createElementBlock("div", {
                key: index,
                class: normalizeClass(["log-item", log.type]),
                style: { "margin-bottom": "1px" }
              }, [
                createElementVNode("span", _hoisted_3$3, toDisplayString(log.timestamp), 1),
                createElementVNode("span", _hoisted_4$3, toDisplayString(_ctx.getTypeIcon(log.type)), 1),
                createElementVNode("span", {
                  class: "log-message",
                  innerHTML: log.message
                }, null, 8, _hoisted_5$3)
              ], 2);
            }), 128))
          ])
        ]);
      }
      const LogViewer = /* @__PURE__ */ _export_sfc(_sfc_main$4, [["render", _sfc_render$3], ["__scopeId", "data-v-fb48fcc8"]]);
      const useAnswerStore = defineStore("answer", {
        state: () => ({
          answers: [],
          maxAnswers: 100
          // 最大答题记录数量
        }),
        actions: {
          // 添加一个答题记录
          addAnswer(question, answer, type, status = "success", originalAnswer = null) {
            const answerRecord = {
              id: Date.now(),
              question,
              answer,
              type,
              status,
              // 'success', 'partial', 'not_found', 'error'
              originalAnswer,
              // 当匹配失败时保存原始答案
              timestamp: (/* @__PURE__ */ new Date()).toLocaleTimeString()
            };
            this.answers.push(answerRecord);
            if (this.answers.length > this.maxAnswers) {
              this.answers.shift();
            }
          },
          // 清空所有答题记录
          clearAnswers() {
            this.answers = [];
          }
        },
        getters: {
          // 获取所有答题记录
          getAnswers: (state) => {
            return state.answers;
          },
          // 获取特定类型的答题记录
          getAnswersByType: (state) => (type) => {
            return state.answers.filter((answer) => answer.type === type);
          },
          // 获取答题记录总数
          totalAnswers: (state) => {
            return state.answers.length;
          }
        }
      });
      const _sfc_main$3 = defineComponent({
        setup() {
          const answerStore2 = useAnswerStore();
          const formatAnswer = (answer) => {
            if (Array.isArray(answer)) {
              return answer.join("、");
            } else if (answer === "true") {
              return "✓ 正确";
            } else if (answer === "false") {
              return "✗ 错误";
            }
            return answer || "无答案";
          };
          const getStatusIcon = (status) => {
            switch (status) {
              case "success":
                return "✅";
              // 完全匹配成功
              case "partial":
                return "⚠️";
              // 找到答案但匹配失败
              case "not_found":
                return "❌";
              // 未找到答案
              case "error":
                return "❌";
              // 错误
              default:
                return "✅";
            }
          };
          return {
            answerStore: answerStore2,
            formatAnswer,
            getStatusIcon
          };
        }
      });
      const _withScopeId$1 = (n) => (pushScopeId("data-v-483c44ce"), n = n(), popScopeId(), n);
      const _hoisted_1$3 = {
        class: "answer-viewer",
        style: { "max-height": "300px", "overflow": "hidden", "overflow-y": "auto" }
      };
      const _hoisted_2$3 = {
        key: 0,
        class: "empty-message",
        style: { "text-align": "center", "color": "#999", "padding": "20px" }
      };
      const _hoisted_3$2 = {
        key: 1,
        class: "answer-content"
      };
      const _hoisted_4$2 = {
        class: "answer-question",
        style: { "margin-bottom": "5px", "word-break": "break-all" }
      };
      const _hoisted_5$2 = /* @__PURE__ */ _withScopeId$1(() => /* @__PURE__ */ createElementVNode("span", {
        class: "label",
        style: { "margin-right": "5px" }
      }, "题号：", -1));
      const _hoisted_6$2 = {
        class: "answer-question",
        style: { "margin-bottom": "5px" }
      };
      const _hoisted_7$2 = /* @__PURE__ */ _withScopeId$1(() => /* @__PURE__ */ createElementVNode("span", {
        class: "label",
        style: { "margin-right": "5px" }
      }, "题目：", -1));
      const _hoisted_8$2 = ["innerHTML"];
      const _hoisted_9$2 = {
        class: "answer-value",
        style: { "margin-bottom": "5px", "word-break": "break-all" }
      };
      const _hoisted_10$2 = /* @__PURE__ */ _withScopeId$1(() => /* @__PURE__ */ createElementVNode("span", {
        class: "label",
        style: { "margin-right": "5px" }
      }, "答案：", -1));
      const _hoisted_11$2 = ["innerHTML"];
      const _hoisted_12$2 = /* @__PURE__ */ _withScopeId$1(() => /* @__PURE__ */ createElementVNode("div", {
        class: "divider",
        style: { "height": "1px", "background-color": "#eee", "margin": "10px 0" }
      }, null, -1));
      function _sfc_render$2(_ctx, _cache, $props, $setup, $data, $options) {
        return openBlock(), createElementBlock("div", _hoisted_1$3, [
          _ctx.answerStore.totalAnswers === 0 ? (openBlock(), createElementBlock("div", _hoisted_2$3, " 暂无答题记录 ")) : (openBlock(), createElementBlock("div", _hoisted_3$2, [
            (openBlock(true), createElementBlock(Fragment, null, renderList(_ctx.answerStore.getAnswers, (item, index) => {
              return openBlock(), createElementBlock("div", {
                key: item.id,
                class: "answer-item",
                style: { "margin-bottom": "15px", "background-color": "#f9f9f9", "border-radius": "8px", "padding": "10px", "box-shadow": "0 1px 3px rgba(0,0,0,0.1)" }
              }, [
                createElementVNode("div", _hoisted_4$2, [
                  _hoisted_5$2,
                  createElementVNode("span", null, toDisplayString(index + 1), 1)
                ]),
                createElementVNode("div", _hoisted_6$2, [
                  _hoisted_7$2,
                  createElementVNode("span", {
                    innerHTML: item.question
                  }, null, 8, _hoisted_8$2)
                ]),
                createElementVNode("div", _hoisted_9$2, [
                  _hoisted_10$2,
                  createElementVNode("span", null, [
                    createTextVNode(toDisplayString(_ctx.getStatusIcon(item.status)) + " ", 1),
                    createElementVNode("span", {
                      innerHTML: _ctx.formatAnswer(item.answer)
                    }, null, 8, _hoisted_11$2)
                  ])
                ]),
                _hoisted_12$2
              ]);
            }), 128))
          ]))
        ]);
      }
      const AnswerViewer = /* @__PURE__ */ _export_sfc(_sfc_main$3, [["render", _sfc_render$2], ["__scopeId", "data-v-483c44ce"]]);
      var _GM_getResourceText = exports("_", /* @__PURE__ */ (() => typeof GM_getResourceText != "undefined" ? GM_getResourceText : void 0)());
      var _GM_info = /* @__PURE__ */ (() => typeof GM_info != "undefined" ? GM_info : void 0)();
      var _GM_xmlhttpRequest = /* @__PURE__ */ (() => typeof GM_xmlhttpRequest != "undefined" ? GM_xmlhttpRequest : void 0)();
      var _unsafeWindow = /* @__PURE__ */ (() => typeof unsafeWindow != "undefined" ? unsafeWindow : void 0)();
      const SCRIPT_INFO = {
        name: _GM_info.script.name,
        author: _GM_info.script.author,
        version: _GM_info.script.version
      };
      const defaultSettings = {
        version: "",
        // 脚本版本，动态获取
        // 视频设置
        videoSettings: {
          playbackRate: 1.5
          // 视频播放速度
        },
        // 任务提交设置
        submitSettings: {
          autoSubmitChapter: true,
          // 自动提交章节作业
          autoSubmitExam: false,
          // 自动提交考试
          correctRateThreshold: 90
          // 正确率达到多少时自动提交(%)
        },
        // 自动化设置
        automationSettings: {
          autoNextChapter: true,
          // 自动跳转下一章节
          onlyDoQuestions: false,
          // 只答题，不做其他任务
          skipFinishedTasks: true,
          // 跳过已完成任务点
          autoNextExamQuestion: false
          // 考试自动进入下一题
        },
        // 答题设置
        answerSettings: {
          searchInterval: 3,
          // 搜题间隔(秒)
          useAIWhenNoAnswer: false,
          // 无答案时使用AI答题
          autoSaveAnswer: true,
          // 自动保存答案
          token: "",
          // 答题接口的token
          matchThreshold: 90
          // 答案匹配度阈值(%)，超过此值认为匹配成功
        },
        // UI设置
        uiSettings: {
          activeTab: "1",
          // 默认激活的标签页
          position: {
            // 悬浮窗位置
            x: 0,
            y: 0
          }
        },
        // 授权码信息
        cardInfo: {
          card_key: "",
          // 授权码
          score: 0,
          // 剩余次数
          total_score: 0,
          // 总次数
          last_use_time: "",
          // 最后使用时间
          last_use_ip: "",
          // 最后使用IP
          status: 0,
          // 状态 (0: 未验证, 1: 有效)
          message: ""
          // 提示信息
        }
      };
      const deepMerge = (target, source) => {
        const result = { ...target };
        for (const key in source) {
          if (source.hasOwnProperty(key)) {
            if (source[key] && typeof source[key] === "object" && !Array.isArray(source[key])) {
              result[key] = deepMerge(target[key] || {}, source[key]);
            } else {
              result[key] = source[key];
            }
          }
        }
        return result;
      };
      const loadSettings = () => {
        try {
          const currentVersion = SCRIPT_INFO.version;
          if (typeof GM_getValue === "function") {
            const savedSettingsStr = GM_getValue("cxSettings");
            if (savedSettingsStr) {
              const savedSettings = JSON.parse(savedSettingsStr);
              const savedVersion = savedSettings.version;
              const mergedSettings = deepMerge(defaultSettings, savedSettings);
              mergedSettings.version = currentVersion;
              if (savedVersion !== currentVersion) {
                console.log(`检测到版本变化: ${savedVersion || "未知"} -> ${currentVersion}`);
                saveSettings(mergedSettings);
                console.log("设置已更新到当前版本");
              }
              return mergedSettings;
            }
          }
        } catch (error) {
          console.error("读取设置失败:", error);
        }
        const initialSettings = { ...defaultSettings };
        initialSettings.version = SCRIPT_INFO.version;
        return initialSettings;
      };
      const saveSettings = (settings) => {
        try {
          const settingsWithVersion = {
            ...settings,
            version: SCRIPT_INFO.version
          };
          const settingsStr = JSON.stringify(settingsWithVersion);
          if (typeof GM_setValue === "function") {
            GM_setValue("cxSettings", settingsStr);
            return true;
          } else {
            console.warn("GM_setValue 不可用，无法保存设置");
            return false;
          }
        } catch (error) {
          console.error("保存设置失败:", error);
          return false;
        }
      };
      const useSettingsStore = defineStore("settings", {
        state: () => loadSettings(),
        actions: {
          // 更新单个设置项
          updateSetting(category, key, value) {
            if (this[category] && key in this[category]) {
              this[category][key] = value;
              this.saveSettings();
            }
          },
          // 更新嵌套设置项
          updateNestedSetting(category, parent, key, value) {
            if (this[category] && this[category][parent] && key in this[category][parent]) {
              this[category][parent][key] = value;
              this.saveSettings();
            }
          },
          // 更新token
          updateToken(token) {
            this.answerSettings.token = token;
            this.saveSettings();
          },
          // 更新悬浮窗位置
          updatePosition(x, y) {
            this.uiSettings.position.x = x;
            this.uiSettings.position.y = y;
            this.saveSettings();
          },
          // 重置为默认设置
          resetSettings() {
            const token = this.answerSettings.token;
            const position = { ...this.uiSettings.position };
            Object.keys(defaultSettings).forEach((category) => {
              this[category] = { ...defaultSettings[category] };
            });
            this.answerSettings.token = token;
            this.uiSettings.position = position;
            this.saveSettings();
          },
          // 更新授权码信息
          updateCardInfo(cardData) {
            if (cardData) {
              this.cardInfo = {
                card_key: cardData.card_key || "",
                score: cardData.score || 0,
                total_score: cardData.total_score || 0,
                last_use_time: cardData.last_use_time || "",
                last_use_ip: cardData.last_use_ip || "",
                status: cardData.status || 0,
                message: cardData.message || ""
              };
              this.saveSettings();
            }
          },
          // 扣除授权码次数
          decreaseCardScore() {
            if (this.cardInfo.score > 0) {
              this.cardInfo.score -= 1;
              this.saveSettings();
            }
          },
          // 保存当前设置
          saveSettings() {
            saveSettings(this.$state);
          }
        }
      });
      function bound01(n, max) {
        if (isOnePointZero(n)) {
          n = "100%";
        }
        var isPercent = isPercentage(n);
        n = max === 360 ? n : Math.min(max, Math.max(0, parseFloat(n)));
        if (isPercent) {
          n = parseInt(String(n * max), 10) / 100;
        }
        if (Math.abs(n - max) < 1e-6) {
          return 1;
        }
        if (max === 360) {
          n = (n < 0 ? n % max + max : n % max) / parseFloat(String(max));
        } else {
          n = n % max / parseFloat(String(max));
        }
        return n;
      }
      function isOnePointZero(n) {
        return typeof n === "string" && n.indexOf(".") !== -1 && parseFloat(n) === 1;
      }
      function isPercentage(n) {
        return typeof n === "string" && n.indexOf("%") !== -1;
      }
      function boundAlpha(a) {
        a = parseFloat(a);
        if (isNaN(a) || a < 0 || a > 1) {
          a = 1;
        }
        return a;
      }
      function convertToPercentage(n) {
        if (n <= 1) {
          return "".concat(Number(n) * 100, "%");
        }
        return n;
      }
      function pad2(c) {
        return c.length === 1 ? "0" + c : String(c);
      }
      function rgbToRgb(r, g, b) {
        return {
          r: bound01(r, 255) * 255,
          g: bound01(g, 255) * 255,
          b: bound01(b, 255) * 255
        };
      }
      function hue2rgb(p, q, t) {
        if (t < 0) {
          t += 1;
        }
        if (t > 1) {
          t -= 1;
        }
        if (t < 1 / 6) {
          return p + (q - p) * (6 * t);
        }
        if (t < 1 / 2) {
          return q;
        }
        if (t < 2 / 3) {
          return p + (q - p) * (2 / 3 - t) * 6;
        }
        return p;
      }
      function hslToRgb(h2, s, l) {
        var r;
        var g;
        var b;
        h2 = bound01(h2, 360);
        s = bound01(s, 100);
        l = bound01(l, 100);
        if (s === 0) {
          g = l;
          b = l;
          r = l;
        } else {
          var q = l < 0.5 ? l * (1 + s) : l + s - l * s;
          var p = 2 * l - q;
          r = hue2rgb(p, q, h2 + 1 / 3);
          g = hue2rgb(p, q, h2);
          b = hue2rgb(p, q, h2 - 1 / 3);
        }
        return { r: r * 255, g: g * 255, b: b * 255 };
      }
      function rgbToHsv(r, g, b) {
        r = bound01(r, 255);
        g = bound01(g, 255);
        b = bound01(b, 255);
        var max = Math.max(r, g, b);
        var min = Math.min(r, g, b);
        var h2 = 0;
        var v = max;
        var d = max - min;
        var s = max === 0 ? 0 : d / max;
        if (max === min) {
          h2 = 0;
        } else {
          switch (max) {
            case r:
              h2 = (g - b) / d + (g < b ? 6 : 0);
              break;
            case g:
              h2 = (b - r) / d + 2;
              break;
            case b:
              h2 = (r - g) / d + 4;
              break;
          }
          h2 /= 6;
        }
        return { h: h2, s, v };
      }
      function hsvToRgb(h2, s, v) {
        h2 = bound01(h2, 360) * 6;
        s = bound01(s, 100);
        v = bound01(v, 100);
        var i = Math.floor(h2);
        var f = h2 - i;
        var p = v * (1 - s);
        var q = v * (1 - f * s);
        var t = v * (1 - (1 - f) * s);
        var mod = i % 6;
        var r = [v, q, p, p, t, v][mod];
        var g = [t, v, v, q, p, p][mod];
        var b = [p, p, t, v, v, q][mod];
        return { r: r * 255, g: g * 255, b: b * 255 };
      }
      function rgbToHex(r, g, b, allow3Char) {
        var hex = [
          pad2(Math.round(r).toString(16)),
          pad2(Math.round(g).toString(16)),
          pad2(Math.round(b).toString(16))
        ];
        return hex.join("");
      }
      function convertHexToDecimal(h2) {
        return parseIntFromHex(h2) / 255;
      }
      function parseIntFromHex(val) {
        return parseInt(val, 16);
      }
      var names = {
        aliceblue: "#f0f8ff",
        antiquewhite: "#faebd7",
        aqua: "#00ffff",
        aquamarine: "#7fffd4",
        azure: "#f0ffff",
        beige: "#f5f5dc",
        bisque: "#ffe4c4",
        black: "#000000",
        blanchedalmond: "#ffebcd",
        blue: "#0000ff",
        blueviolet: "#8a2be2",
        brown: "#a52a2a",
        burlywood: "#deb887",
        cadetblue: "#5f9ea0",
        chartreuse: "#7fff00",
        chocolate: "#d2691e",
        coral: "#ff7f50",
        cornflowerblue: "#6495ed",
        cornsilk: "#fff8dc",
        crimson: "#dc143c",
        cyan: "#00ffff",
        darkblue: "#00008b",
        darkcyan: "#008b8b",
        darkgoldenrod: "#b8860b",
        darkgray: "#a9a9a9",
        darkgreen: "#006400",
        darkgrey: "#a9a9a9",
        darkkhaki: "#bdb76b",
        darkmagenta: "#8b008b",
        darkolivegreen: "#556b2f",
        darkorange: "#ff8c00",
        darkorchid: "#9932cc",
        darkred: "#8b0000",
        darksalmon: "#e9967a",
        darkseagreen: "#8fbc8f",
        darkslateblue: "#483d8b",
        darkslategray: "#2f4f4f",
        darkslategrey: "#2f4f4f",
        darkturquoise: "#00ced1",
        darkviolet: "#9400d3",
        deeppink: "#ff1493",
        deepskyblue: "#00bfff",
        dimgray: "#696969",
        dimgrey: "#696969",
        dodgerblue: "#1e90ff",
        firebrick: "#b22222",
        floralwhite: "#fffaf0",
        forestgreen: "#228b22",
        fuchsia: "#ff00ff",
        gainsboro: "#dcdcdc",
        ghostwhite: "#f8f8ff",
        goldenrod: "#daa520",
        gold: "#ffd700",
        gray: "#808080",
        green: "#008000",
        greenyellow: "#adff2f",
        grey: "#808080",
        honeydew: "#f0fff0",
        hotpink: "#ff69b4",
        indianred: "#cd5c5c",
        indigo: "#4b0082",
        ivory: "#fffff0",
        khaki: "#f0e68c",
        lavenderblush: "#fff0f5",
        lavender: "#e6e6fa",
        lawngreen: "#7cfc00",
        lemonchiffon: "#fffacd",
        lightblue: "#add8e6",
        lightcoral: "#f08080",
        lightcyan: "#e0ffff",
        lightgoldenrodyellow: "#fafad2",
        lightgray: "#d3d3d3",
        lightgreen: "#90ee90",
        lightgrey: "#d3d3d3",
        lightpink: "#ffb6c1",
        lightsalmon: "#ffa07a",
        lightseagreen: "#20b2aa",
        lightskyblue: "#87cefa",
        lightslategray: "#778899",
        lightslategrey: "#778899",
        lightsteelblue: "#b0c4de",
        lightyellow: "#ffffe0",
        lime: "#00ff00",
        limegreen: "#32cd32",
        linen: "#faf0e6",
        magenta: "#ff00ff",
        maroon: "#800000",
        mediumaquamarine: "#66cdaa",
        mediumblue: "#0000cd",
        mediumorchid: "#ba55d3",
        mediumpurple: "#9370db",
        mediumseagreen: "#3cb371",
        mediumslateblue: "#7b68ee",
        mediumspringgreen: "#00fa9a",
        mediumturquoise: "#48d1cc",
        mediumvioletred: "#c71585",
        midnightblue: "#191970",
        mintcream: "#f5fffa",
        mistyrose: "#ffe4e1",
        moccasin: "#ffe4b5",
        navajowhite: "#ffdead",
        navy: "#000080",
        oldlace: "#fdf5e6",
        olive: "#808000",
        olivedrab: "#6b8e23",
        orange: "#ffa500",
        orangered: "#ff4500",
        orchid: "#da70d6",
        palegoldenrod: "#eee8aa",
        palegreen: "#98fb98",
        paleturquoise: "#afeeee",
        palevioletred: "#db7093",
        papayawhip: "#ffefd5",
        peachpuff: "#ffdab9",
        peru: "#cd853f",
        pink: "#ffc0cb",
        plum: "#dda0dd",
        powderblue: "#b0e0e6",
        purple: "#800080",
        rebeccapurple: "#663399",
        red: "#ff0000",
        rosybrown: "#bc8f8f",
        royalblue: "#4169e1",
        saddlebrown: "#8b4513",
        salmon: "#fa8072",
        sandybrown: "#f4a460",
        seagreen: "#2e8b57",
        seashell: "#fff5ee",
        sienna: "#a0522d",
        silver: "#c0c0c0",
        skyblue: "#87ceeb",
        slateblue: "#6a5acd",
        slategray: "#708090",
        slategrey: "#708090",
        snow: "#fffafa",
        springgreen: "#00ff7f",
        steelblue: "#4682b4",
        tan: "#d2b48c",
        teal: "#008080",
        thistle: "#d8bfd8",
        tomato: "#ff6347",
        turquoise: "#40e0d0",
        violet: "#ee82ee",
        wheat: "#f5deb3",
        white: "#ffffff",
        whitesmoke: "#f5f5f5",
        yellow: "#ffff00",
        yellowgreen: "#9acd32"
      };
      function inputToRGB(color) {
        var rgb = { r: 0, g: 0, b: 0 };
        var a = 1;
        var s = null;
        var v = null;
        var l = null;
        var ok = false;
        var format = false;
        if (typeof color === "string") {
          color = stringInputToObject(color);
        }
        if (typeof color === "object") {
          if (isValidCSSUnit(color.r) && isValidCSSUnit(color.g) && isValidCSSUnit(color.b)) {
            rgb = rgbToRgb(color.r, color.g, color.b);
            ok = true;
            format = String(color.r).substr(-1) === "%" ? "prgb" : "rgb";
          } else if (isValidCSSUnit(color.h) && isValidCSSUnit(color.s) && isValidCSSUnit(color.v)) {
            s = convertToPercentage(color.s);
            v = convertToPercentage(color.v);
            rgb = hsvToRgb(color.h, s, v);
            ok = true;
            format = "hsv";
          } else if (isValidCSSUnit(color.h) && isValidCSSUnit(color.s) && isValidCSSUnit(color.l)) {
            s = convertToPercentage(color.s);
            l = convertToPercentage(color.l);
            rgb = hslToRgb(color.h, s, l);
            ok = true;
            format = "hsl";
          }
          if (Object.prototype.hasOwnProperty.call(color, "a")) {
            a = color.a;
          }
        }
        a = boundAlpha(a);
        return {
          ok,
          format: color.format || format,
          r: Math.min(255, Math.max(rgb.r, 0)),
          g: Math.min(255, Math.max(rgb.g, 0)),
          b: Math.min(255, Math.max(rgb.b, 0)),
          a
        };
      }
      var CSS_INTEGER = "[-\\+]?\\d+%?";
      var CSS_NUMBER = "[-\\+]?\\d*\\.\\d+%?";
      var CSS_UNIT = "(?:".concat(CSS_NUMBER, ")|(?:").concat(CSS_INTEGER, ")");
      var PERMISSIVE_MATCH3 = "[\\s|\\(]+(".concat(CSS_UNIT, ")[,|\\s]+(").concat(CSS_UNIT, ")[,|\\s]+(").concat(CSS_UNIT, ")\\s*\\)?");
      var PERMISSIVE_MATCH4 = "[\\s|\\(]+(".concat(CSS_UNIT, ")[,|\\s]+(").concat(CSS_UNIT, ")[,|\\s]+(").concat(CSS_UNIT, ")[,|\\s]+(").concat(CSS_UNIT, ")\\s*\\)?");
      var matchers = {
        CSS_UNIT: new RegExp(CSS_UNIT),
        rgb: new RegExp("rgb" + PERMISSIVE_MATCH3),
        rgba: new RegExp("rgba" + PERMISSIVE_MATCH4),
        hsl: new RegExp("hsl" + PERMISSIVE_MATCH3),
        hsla: new RegExp("hsla" + PERMISSIVE_MATCH4),
        hsv: new RegExp("hsv" + PERMISSIVE_MATCH3),
        hsva: new RegExp("hsva" + PERMISSIVE_MATCH4),
        hex3: /^#?([0-9a-fA-F]{1})([0-9a-fA-F]{1})([0-9a-fA-F]{1})$/,
        hex6: /^#?([0-9a-fA-F]{2})([0-9a-fA-F]{2})([0-9a-fA-F]{2})$/,
        hex4: /^#?([0-9a-fA-F]{1})([0-9a-fA-F]{1})([0-9a-fA-F]{1})([0-9a-fA-F]{1})$/,
        hex8: /^#?([0-9a-fA-F]{2})([0-9a-fA-F]{2})([0-9a-fA-F]{2})([0-9a-fA-F]{2})$/
      };
      function stringInputToObject(color) {
        color = color.trim().toLowerCase();
        if (color.length === 0) {
          return false;
        }
        var named = false;
        if (names[color]) {
          color = names[color];
          named = true;
        } else if (color === "transparent") {
          return { r: 0, g: 0, b: 0, a: 0, format: "name" };
        }
        var match = matchers.rgb.exec(color);
        if (match) {
          return { r: match[1], g: match[2], b: match[3] };
        }
        match = matchers.rgba.exec(color);
        if (match) {
          return { r: match[1], g: match[2], b: match[3], a: match[4] };
        }
        match = matchers.hsl.exec(color);
        if (match) {
          return { h: match[1], s: match[2], l: match[3] };
        }
        match = matchers.hsla.exec(color);
        if (match) {
          return { h: match[1], s: match[2], l: match[3], a: match[4] };
        }
        match = matchers.hsv.exec(color);
        if (match) {
          return { h: match[1], s: match[2], v: match[3] };
        }
        match = matchers.hsva.exec(color);
        if (match) {
          return { h: match[1], s: match[2], v: match[3], a: match[4] };
        }
        match = matchers.hex8.exec(color);
        if (match) {
          return {
            r: parseIntFromHex(match[1]),
            g: parseIntFromHex(match[2]),
            b: parseIntFromHex(match[3]),
            a: convertHexToDecimal(match[4]),
            format: named ? "name" : "hex8"
          };
        }
        match = matchers.hex6.exec(color);
        if (match) {
          return {
            r: parseIntFromHex(match[1]),
            g: parseIntFromHex(match[2]),
            b: parseIntFromHex(match[3]),
            format: named ? "name" : "hex"
          };
        }
        match = matchers.hex4.exec(color);
        if (match) {
          return {
            r: parseIntFromHex(match[1] + match[1]),
            g: parseIntFromHex(match[2] + match[2]),
            b: parseIntFromHex(match[3] + match[3]),
            a: convertHexToDecimal(match[4] + match[4]),
            format: named ? "name" : "hex8"
          };
        }
        match = matchers.hex3.exec(color);
        if (match) {
          return {
            r: parseIntFromHex(match[1] + match[1]),
            g: parseIntFromHex(match[2] + match[2]),
            b: parseIntFromHex(match[3] + match[3]),
            format: named ? "name" : "hex"
          };
        }
        return false;
      }
      function isValidCSSUnit(color) {
        return Boolean(matchers.CSS_UNIT.exec(String(color)));
      }
      var hueStep = 2;
      var saturationStep = 0.16;
      var saturationStep2 = 0.05;
      var brightnessStep1 = 0.05;
      var brightnessStep2 = 0.15;
      var lightColorCount = 5;
      var darkColorCount = 4;
      var darkColorMap = [{
        index: 7,
        opacity: 0.15
      }, {
        index: 6,
        opacity: 0.25
      }, {
        index: 5,
        opacity: 0.3
      }, {
        index: 5,
        opacity: 0.45
      }, {
        index: 5,
        opacity: 0.65
      }, {
        index: 5,
        opacity: 0.85
      }, {
        index: 4,
        opacity: 0.9
      }, {
        index: 3,
        opacity: 0.95
      }, {
        index: 2,
        opacity: 0.97
      }, {
        index: 1,
        opacity: 0.98
      }];
      function toHsv(_ref) {
        var r = _ref.r, g = _ref.g, b = _ref.b;
        var hsv = rgbToHsv(r, g, b);
        return {
          h: hsv.h * 360,
          s: hsv.s,
          v: hsv.v
        };
      }
      function toHex(_ref2) {
        var r = _ref2.r, g = _ref2.g, b = _ref2.b;
        return "#".concat(rgbToHex(r, g, b));
      }
      function mix(rgb1, rgb2, amount) {
        var p = amount / 100;
        var rgb = {
          r: (rgb2.r - rgb1.r) * p + rgb1.r,
          g: (rgb2.g - rgb1.g) * p + rgb1.g,
          b: (rgb2.b - rgb1.b) * p + rgb1.b
        };
        return rgb;
      }
      function getHue(hsv, i, light) {
        var hue;
        if (Math.round(hsv.h) >= 60 && Math.round(hsv.h) <= 240) {
          hue = light ? Math.round(hsv.h) - hueStep * i : Math.round(hsv.h) + hueStep * i;
        } else {
          hue = light ? Math.round(hsv.h) + hueStep * i : Math.round(hsv.h) - hueStep * i;
        }
        if (hue < 0) {
          hue += 360;
        } else if (hue >= 360) {
          hue -= 360;
        }
        return hue;
      }
      function getSaturation(hsv, i, light) {
        if (hsv.h === 0 && hsv.s === 0) {
          return hsv.s;
        }
        var saturation;
        if (light) {
          saturation = hsv.s - saturationStep * i;
        } else if (i === darkColorCount) {
          saturation = hsv.s + saturationStep;
        } else {
          saturation = hsv.s + saturationStep2 * i;
        }
        if (saturation > 1) {
          saturation = 1;
        }
        if (light && i === lightColorCount && saturation > 0.1) {
          saturation = 0.1;
        }
        if (saturation < 0.06) {
          saturation = 0.06;
        }
        return Number(saturation.toFixed(2));
      }
      function getValue(hsv, i, light) {
        var value;
        if (light) {
          value = hsv.v + brightnessStep1 * i;
        } else {
          value = hsv.v - brightnessStep2 * i;
        }
        if (value > 1) {
          value = 1;
        }
        return Number(value.toFixed(2));
      }
      function generate$1(color) {
        var opts = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
        var patterns = [];
        var pColor = inputToRGB(color);
        for (var i = lightColorCount; i > 0; i -= 1) {
          var hsv = toHsv(pColor);
          var colorString = toHex(inputToRGB({
            h: getHue(hsv, i, true),
            s: getSaturation(hsv, i, true),
            v: getValue(hsv, i, true)
          }));
          patterns.push(colorString);
        }
        patterns.push(toHex(pColor));
        for (var _i = 1; _i <= darkColorCount; _i += 1) {
          var _hsv = toHsv(pColor);
          var _colorString = toHex(inputToRGB({
            h: getHue(_hsv, _i),
            s: getSaturation(_hsv, _i),
            v: getValue(_hsv, _i)
          }));
          patterns.push(_colorString);
        }
        if (opts.theme === "dark") {
          return darkColorMap.map(function(_ref3) {
            var index = _ref3.index, opacity = _ref3.opacity;
            var darkColorString = toHex(mix(inputToRGB(opts.backgroundColor || "#141414"), inputToRGB(patterns[index]), opacity * 100));
            return darkColorString;
          });
        }
        return patterns;
      }
      var presetPrimaryColors = {
        red: "#F5222D",
        volcano: "#FA541C",
        orange: "#FA8C16",
        gold: "#FAAD14",
        yellow: "#FADB14",
        lime: "#A0D911",
        green: "#52C41A",
        cyan: "#13C2C2",
        blue: "#1890FF",
        geekblue: "#2F54EB",
        purple: "#722ED1",
        magenta: "#EB2F96",
        grey: "#666666"
      };
      var presetPalettes = {};
      var presetDarkPalettes = {};
      Object.keys(presetPrimaryColors).forEach(function(key) {
        presetPalettes[key] = generate$1(presetPrimaryColors[key]);
        presetPalettes[key].primary = presetPalettes[key][5];
        presetDarkPalettes[key] = generate$1(presetPrimaryColors[key], {
          theme: "dark",
          backgroundColor: "#141414"
        });
        presetDarkPalettes[key].primary = presetDarkPalettes[key][5];
      });
      var blue = presetPalettes.blue;
      var contextKey = Symbol("iconContext");
      var useInjectIconContext = function useInjectIconContext2() {
        return inject(contextKey, {
          prefixCls: ref("anticon"),
          rootClassName: ref(""),
          csp: ref()
        });
      };
      function canUseDom() {
        return !!(typeof window !== "undefined" && window.document && window.document.createElement);
      }
      function contains(root, n) {
        if (!root) {
          return false;
        }
        if (root.contains) {
          return root.contains(n);
        }
        return false;
      }
      var APPEND_ORDER = "data-vc-order";
      var MARK_KEY = "vc-icon-key";
      var containerCache = /* @__PURE__ */ new Map();
      function getMark() {
        var _ref = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {}, mark = _ref.mark;
        if (mark) {
          return mark.startsWith("data-") ? mark : "data-".concat(mark);
        }
        return MARK_KEY;
      }
      function getContainer(option) {
        if (option.attachTo) {
          return option.attachTo;
        }
        var head = document.querySelector("head");
        return head || document.body;
      }
      function getOrder(prepend) {
        if (prepend === "queue") {
          return "prependQueue";
        }
        return prepend ? "prepend" : "append";
      }
      function findStyles(container) {
        return Array.from((containerCache.get(container) || container).children).filter(function(node) {
          return node.tagName === "STYLE";
        });
      }
      function injectCSS(css) {
        var option = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
        if (!canUseDom()) {
          return null;
        }
        var csp = option.csp, prepend = option.prepend;
        var styleNode = document.createElement("style");
        styleNode.setAttribute(APPEND_ORDER, getOrder(prepend));
        if (csp && csp.nonce) {
          styleNode.nonce = csp.nonce;
        }
        styleNode.innerHTML = css;
        var container = getContainer(option);
        var firstChild = container.firstChild;
        if (prepend) {
          if (prepend === "queue") {
            var existStyle = findStyles(container).filter(function(node) {
              return ["prepend", "prependQueue"].includes(node.getAttribute(APPEND_ORDER));
            });
            if (existStyle.length) {
              container.insertBefore(styleNode, existStyle[existStyle.length - 1].nextSibling);
              return styleNode;
            }
          }
          container.insertBefore(styleNode, firstChild);
        } else {
          container.appendChild(styleNode);
        }
        return styleNode;
      }
      function findExistNode(key) {
        var option = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
        var container = getContainer(option);
        return findStyles(container).find(function(node) {
          return node.getAttribute(getMark(option)) === key;
        });
      }
      function syncRealContainer(container, option) {
        var cachedRealContainer = containerCache.get(container);
        if (!cachedRealContainer || !contains(document, cachedRealContainer)) {
          var placeholderStyle = injectCSS("", option);
          var parentNode = placeholderStyle.parentNode;
          containerCache.set(container, parentNode);
          container.removeChild(placeholderStyle);
        }
      }
      function updateCSS(css, key) {
        var option = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : {};
        var container = getContainer(option);
        syncRealContainer(container, option);
        var existNode = findExistNode(key, option);
        if (existNode) {
          if (option.csp && option.csp.nonce && existNode.nonce !== option.csp.nonce) {
            existNode.nonce = option.csp.nonce;
          }
          if (existNode.innerHTML !== css) {
            existNode.innerHTML = css;
          }
          return existNode;
        }
        var newNode = injectCSS(css, option);
        newNode.setAttribute(getMark(option), key);
        return newNode;
      }
      function _objectSpread$6(target) {
        for (var i = 1; i < arguments.length; i++) {
          var source = arguments[i] != null ? Object(arguments[i]) : {};
          var ownKeys = Object.keys(source);
          if (typeof Object.getOwnPropertySymbols === "function") {
            ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function(sym) {
              return Object.getOwnPropertyDescriptor(source, sym).enumerable;
            }));
          }
          ownKeys.forEach(function(key) {
            _defineProperty$6(target, key, source[key]);
          });
        }
        return target;
      }
      function _defineProperty$6(obj, key, value) {
        if (key in obj) {
          Object.defineProperty(obj, key, { value, enumerable: true, configurable: true, writable: true });
        } else {
          obj[key] = value;
        }
        return obj;
      }
      function warning(valid, message) {
      }
      function isIconDefinition(target) {
        return typeof target === "object" && typeof target.name === "string" && typeof target.theme === "string" && (typeof target.icon === "object" || typeof target.icon === "function");
      }
      function generate(node, key, rootProps) {
        if (!rootProps) {
          return h(node.tag, _objectSpread$6({
            key
          }, node.attrs), (node.children || []).map(function(child, index) {
            return generate(child, "".concat(key, "-").concat(node.tag, "-").concat(index));
          }));
        }
        return h(node.tag, _objectSpread$6({
          key
        }, rootProps, node.attrs), (node.children || []).map(function(child, index) {
          return generate(child, "".concat(key, "-").concat(node.tag, "-").concat(index));
        }));
      }
      function getSecondaryColor(primaryColor) {
        return generate$1(primaryColor)[0];
      }
      function normalizeTwoToneColors(twoToneColor) {
        if (!twoToneColor) {
          return [];
        }
        return Array.isArray(twoToneColor) ? twoToneColor : [twoToneColor];
      }
      var iconStyles = "\n.anticon {\n  display: inline-block;\n  color: inherit;\n  font-style: normal;\n  line-height: 0;\n  text-align: center;\n  text-transform: none;\n  vertical-align: -0.125em;\n  text-rendering: optimizeLegibility;\n  -webkit-font-smoothing: antialiased;\n  -moz-osx-font-smoothing: grayscale;\n}\n\n.anticon > * {\n  line-height: 1;\n}\n\n.anticon svg {\n  display: inline-block;\n}\n\n.anticon::before {\n  display: none;\n}\n\n.anticon .anticon-icon {\n  display: block;\n}\n\n.anticon[tabindex] {\n  cursor: pointer;\n}\n\n.anticon-spin::before,\n.anticon-spin {\n  display: inline-block;\n  -webkit-animation: loadingCircle 1s infinite linear;\n  animation: loadingCircle 1s infinite linear;\n}\n\n@-webkit-keyframes loadingCircle {\n  100% {\n    -webkit-transform: rotate(360deg);\n    transform: rotate(360deg);\n  }\n}\n\n@keyframes loadingCircle {\n  100% {\n    -webkit-transform: rotate(360deg);\n    transform: rotate(360deg);\n  }\n}\n";
      function getRoot(ele) {
        return ele && ele.getRootNode && ele.getRootNode();
      }
      function inShadow(ele) {
        if (!canUseDom()) {
          return false;
        }
        return getRoot(ele) instanceof ShadowRoot;
      }
      function getShadowRoot(ele) {
        return inShadow(ele) ? getRoot(ele) : null;
      }
      var useInsertStyles = function useInsertStyles2() {
        var _useInjectIconContext = useInjectIconContext(), prefixCls = _useInjectIconContext.prefixCls, csp = _useInjectIconContext.csp;
        var instance = getCurrentInstance();
        var mergedStyleStr = iconStyles;
        if (prefixCls) {
          mergedStyleStr = mergedStyleStr.replace(/anticon/g, prefixCls.value);
        }
        nextTick(function() {
          if (!canUseDom()) {
            return;
          }
          var ele = instance.vnode.el;
          var shadowRoot = getShadowRoot(ele);
          updateCSS(mergedStyleStr, "@ant-design-vue-icons", {
            prepend: true,
            csp: csp.value,
            attachTo: shadowRoot
          });
        });
      };
      var _excluded$1 = ["icon", "primaryColor", "secondaryColor"];
      function _objectWithoutProperties$1(source, excluded) {
        if (source == null) return {};
        var target = _objectWithoutPropertiesLoose$1(source, excluded);
        var key, i;
        if (Object.getOwnPropertySymbols) {
          var sourceSymbolKeys = Object.getOwnPropertySymbols(source);
          for (i = 0; i < sourceSymbolKeys.length; i++) {
            key = sourceSymbolKeys[i];
            if (excluded.indexOf(key) >= 0) continue;
            if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue;
            target[key] = source[key];
          }
        }
        return target;
      }
      function _objectWithoutPropertiesLoose$1(source, excluded) {
        if (source == null) return {};
        var target = {};
        var sourceKeys = Object.keys(source);
        var key, i;
        for (i = 0; i < sourceKeys.length; i++) {
          key = sourceKeys[i];
          if (excluded.indexOf(key) >= 0) continue;
          target[key] = source[key];
        }
        return target;
      }
      function _objectSpread$5(target) {
        for (var i = 1; i < arguments.length; i++) {
          var source = arguments[i] != null ? Object(arguments[i]) : {};
          var ownKeys = Object.keys(source);
          if (typeof Object.getOwnPropertySymbols === "function") {
            ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function(sym) {
              return Object.getOwnPropertyDescriptor(source, sym).enumerable;
            }));
          }
          ownKeys.forEach(function(key) {
            _defineProperty$5(target, key, source[key]);
          });
        }
        return target;
      }
      function _defineProperty$5(obj, key, value) {
        if (key in obj) {
          Object.defineProperty(obj, key, { value, enumerable: true, configurable: true, writable: true });
        } else {
          obj[key] = value;
        }
        return obj;
      }
      var twoToneColorPalette = reactive({
        primaryColor: "#333",
        secondaryColor: "#E6E6E6",
        calculated: false
      });
      function setTwoToneColors(_ref) {
        var primaryColor = _ref.primaryColor, secondaryColor = _ref.secondaryColor;
        twoToneColorPalette.primaryColor = primaryColor;
        twoToneColorPalette.secondaryColor = secondaryColor || getSecondaryColor(primaryColor);
        twoToneColorPalette.calculated = !!secondaryColor;
      }
      function getTwoToneColors() {
        return _objectSpread$5({}, twoToneColorPalette);
      }
      var IconBase = function IconBase2(props, context) {
        var _props$context$attrs = _objectSpread$5({}, props, context.attrs), icon = _props$context$attrs.icon, primaryColor = _props$context$attrs.primaryColor, secondaryColor = _props$context$attrs.secondaryColor, restProps = _objectWithoutProperties$1(_props$context$attrs, _excluded$1);
        var colors = twoToneColorPalette;
        if (primaryColor) {
          colors = {
            primaryColor,
            secondaryColor: secondaryColor || getSecondaryColor(primaryColor)
          };
        }
        warning(isIconDefinition(icon));
        if (!isIconDefinition(icon)) {
          return null;
        }
        var target = icon;
        if (target && typeof target.icon === "function") {
          target = _objectSpread$5({}, target, {
            icon: target.icon(colors.primaryColor, colors.secondaryColor)
          });
        }
        return generate(target.icon, "svg-".concat(target.name), _objectSpread$5({}, restProps, {
          "data-icon": target.name,
          width: "1em",
          height: "1em",
          fill: "currentColor",
          "aria-hidden": "true"
        }));
      };
      IconBase.props = {
        icon: Object,
        primaryColor: String,
        secondaryColor: String,
        focusable: String
      };
      IconBase.inheritAttrs = false;
      IconBase.displayName = "IconBase";
      IconBase.getTwoToneColors = getTwoToneColors;
      IconBase.setTwoToneColors = setTwoToneColors;
      function _slicedToArray$1(arr, i) {
        return _arrayWithHoles$1(arr) || _iterableToArrayLimit$1(arr, i) || _unsupportedIterableToArray$1(arr, i) || _nonIterableRest$1();
      }
      function _nonIterableRest$1() {
        throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
      }
      function _unsupportedIterableToArray$1(o, minLen) {
        if (!o) return;
        if (typeof o === "string") return _arrayLikeToArray$1(o, minLen);
        var n = Object.prototype.toString.call(o).slice(8, -1);
        if (n === "Object" && o.constructor) n = o.constructor.name;
        if (n === "Map" || n === "Set") return Array.from(o);
        if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray$1(o, minLen);
      }
      function _arrayLikeToArray$1(arr, len) {
        if (len == null || len > arr.length) len = arr.length;
        for (var i = 0, arr2 = new Array(len); i < len; i++) {
          arr2[i] = arr[i];
        }
        return arr2;
      }
      function _iterableToArrayLimit$1(arr, i) {
        var _i = arr == null ? null : typeof Symbol !== "undefined" && arr[Symbol.iterator] || arr["@@iterator"];
        if (_i == null) return;
        var _arr = [];
        var _n = true;
        var _d = false;
        var _s, _e;
        try {
          for (_i = _i.call(arr); !(_n = (_s = _i.next()).done); _n = true) {
            _arr.push(_s.value);
            if (i && _arr.length === i) break;
          }
        } catch (err) {
          _d = true;
          _e = err;
        } finally {
          try {
            if (!_n && _i["return"] != null) _i["return"]();
          } finally {
            if (_d) throw _e;
          }
        }
        return _arr;
      }
      function _arrayWithHoles$1(arr) {
        if (Array.isArray(arr)) return arr;
      }
      function setTwoToneColor(twoToneColor) {
        var _normalizeTwoToneColo = normalizeTwoToneColors(twoToneColor), _normalizeTwoToneColo2 = _slicedToArray$1(_normalizeTwoToneColo, 2), primaryColor = _normalizeTwoToneColo2[0], secondaryColor = _normalizeTwoToneColo2[1];
        return IconBase.setTwoToneColors({
          primaryColor,
          secondaryColor
        });
      }
      function getTwoToneColor() {
        var colors = IconBase.getTwoToneColors();
        if (!colors.calculated) {
          return colors.primaryColor;
        }
        return [colors.primaryColor, colors.secondaryColor];
      }
      var InsertStyles = defineComponent({
        name: "InsertStyles",
        setup: function setup() {
          useInsertStyles();
          return function() {
            return null;
          };
        }
      });
      var _excluded = ["class", "icon", "spin", "rotate", "tabindex", "twoToneColor", "onClick"];
      function _slicedToArray(arr, i) {
        return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest();
      }
      function _nonIterableRest() {
        throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
      }
      function _unsupportedIterableToArray(o, minLen) {
        if (!o) return;
        if (typeof o === "string") return _arrayLikeToArray(o, minLen);
        var n = Object.prototype.toString.call(o).slice(8, -1);
        if (n === "Object" && o.constructor) n = o.constructor.name;
        if (n === "Map" || n === "Set") return Array.from(o);
        if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen);
      }
      function _arrayLikeToArray(arr, len) {
        if (len == null || len > arr.length) len = arr.length;
        for (var i = 0, arr2 = new Array(len); i < len; i++) {
          arr2[i] = arr[i];
        }
        return arr2;
      }
      function _iterableToArrayLimit(arr, i) {
        var _i = arr == null ? null : typeof Symbol !== "undefined" && arr[Symbol.iterator] || arr["@@iterator"];
        if (_i == null) return;
        var _arr = [];
        var _n = true;
        var _d = false;
        var _s, _e;
        try {
          for (_i = _i.call(arr); !(_n = (_s = _i.next()).done); _n = true) {
            _arr.push(_s.value);
            if (i && _arr.length === i) break;
          }
        } catch (err) {
          _d = true;
          _e = err;
        } finally {
          try {
            if (!_n && _i["return"] != null) _i["return"]();
          } finally {
            if (_d) throw _e;
          }
        }
        return _arr;
      }
      function _arrayWithHoles(arr) {
        if (Array.isArray(arr)) return arr;
      }
      function _objectSpread$4(target) {
        for (var i = 1; i < arguments.length; i++) {
          var source = arguments[i] != null ? Object(arguments[i]) : {};
          var ownKeys = Object.keys(source);
          if (typeof Object.getOwnPropertySymbols === "function") {
            ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function(sym) {
              return Object.getOwnPropertyDescriptor(source, sym).enumerable;
            }));
          }
          ownKeys.forEach(function(key) {
            _defineProperty$4(target, key, source[key]);
          });
        }
        return target;
      }
      function _defineProperty$4(obj, key, value) {
        if (key in obj) {
          Object.defineProperty(obj, key, { value, enumerable: true, configurable: true, writable: true });
        } else {
          obj[key] = value;
        }
        return obj;
      }
      function _objectWithoutProperties(source, excluded) {
        if (source == null) return {};
        var target = _objectWithoutPropertiesLoose(source, excluded);
        var key, i;
        if (Object.getOwnPropertySymbols) {
          var sourceSymbolKeys = Object.getOwnPropertySymbols(source);
          for (i = 0; i < sourceSymbolKeys.length; i++) {
            key = sourceSymbolKeys[i];
            if (excluded.indexOf(key) >= 0) continue;
            if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue;
            target[key] = source[key];
          }
        }
        return target;
      }
      function _objectWithoutPropertiesLoose(source, excluded) {
        if (source == null) return {};
        var target = {};
        var sourceKeys = Object.keys(source);
        var key, i;
        for (i = 0; i < sourceKeys.length; i++) {
          key = sourceKeys[i];
          if (excluded.indexOf(key) >= 0) continue;
          target[key] = source[key];
        }
        return target;
      }
      setTwoToneColor(blue.primary);
      var Icon = function Icon2(props, context) {
        var _classObj;
        var _props$context$attrs = _objectSpread$4({}, props, context.attrs), cls = _props$context$attrs["class"], icon = _props$context$attrs.icon, spin = _props$context$attrs.spin, rotate = _props$context$attrs.rotate, tabindex = _props$context$attrs.tabindex, twoToneColor = _props$context$attrs.twoToneColor, onClick = _props$context$attrs.onClick, restProps = _objectWithoutProperties(_props$context$attrs, _excluded);
        var _useInjectIconContext = useInjectIconContext(), prefixCls = _useInjectIconContext.prefixCls, rootClassName = _useInjectIconContext.rootClassName;
        var classObj = (_classObj = {}, _defineProperty$4(_classObj, rootClassName.value, !!rootClassName.value), _defineProperty$4(_classObj, prefixCls.value, true), _defineProperty$4(_classObj, "".concat(prefixCls.value, "-").concat(icon.name), Boolean(icon.name)), _defineProperty$4(_classObj, "".concat(prefixCls.value, "-spin"), !!spin || icon.name === "loading"), _classObj);
        var iconTabIndex = tabindex;
        if (iconTabIndex === void 0 && onClick) {
          iconTabIndex = -1;
        }
        var svgStyle = rotate ? {
          msTransform: "rotate(".concat(rotate, "deg)"),
          transform: "rotate(".concat(rotate, "deg)")
        } : void 0;
        var _normalizeTwoToneColo = normalizeTwoToneColors(twoToneColor), _normalizeTwoToneColo2 = _slicedToArray(_normalizeTwoToneColo, 2), primaryColor = _normalizeTwoToneColo2[0], secondaryColor = _normalizeTwoToneColo2[1];
        return createVNode("span", _objectSpread$4({
          "role": "img",
          "aria-label": icon.name
        }, restProps, {
          "onClick": onClick,
          "class": [classObj, cls],
          "tabindex": iconTabIndex
        }), [createVNode(IconBase, {
          "icon": icon,
          "primaryColor": primaryColor,
          "secondaryColor": secondaryColor,
          "style": svgStyle
        }, null), createVNode(InsertStyles, null, null)]);
      };
      Icon.props = {
        spin: Boolean,
        rotate: Number,
        icon: Object,
        twoToneColor: [String, Array]
      };
      Icon.displayName = "AntdIcon";
      Icon.inheritAttrs = false;
      Icon.getTwoToneColor = getTwoToneColor;
      Icon.setTwoToneColor = setTwoToneColor;
      var ExpandOutlined$1 = { "icon": { "tag": "svg", "attrs": { "viewBox": "64 64 896 896", "focusable": "false" }, "children": [{ "tag": "defs", "attrs": {}, "children": [{ "tag": "style", "attrs": {} }] }, { "tag": "path", "attrs": { "d": "M342 88H120c-17.7 0-32 14.3-32 32v224c0 8.8 7.2 16 16 16h48c8.8 0 16-7.2 16-16V168h174c8.8 0 16-7.2 16-16v-48c0-8.8-7.2-16-16-16zm578 576h-48c-8.8 0-16 7.2-16 16v176H682c-8.8 0-16 7.2-16 16v48c0 8.8 7.2 16 16 16h222c17.7 0 32-14.3 32-32V680c0-8.8-7.2-16-16-16zM342 856H168V680c0-8.8-7.2-16-16-16h-48c-8.8 0-16 7.2-16 16v224c0 17.7 14.3 32 32 32h222c8.8 0 16-7.2 16-16v-48c0-8.8-7.2-16-16-16zM904 88H682c-8.8 0-16 7.2-16 16v48c0 8.8 7.2 16 16 16h174v176c0 8.8 7.2 16 16 16h48c8.8 0 16-7.2 16-16V120c0-17.7-14.3-32-32-32z" } }] }, "name": "expand", "theme": "outlined" };
      function _objectSpread$3(target) {
        for (var i = 1; i < arguments.length; i++) {
          var source = arguments[i] != null ? Object(arguments[i]) : {};
          var ownKeys = Object.keys(source);
          if (typeof Object.getOwnPropertySymbols === "function") {
            ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function(sym) {
              return Object.getOwnPropertyDescriptor(source, sym).enumerable;
            }));
          }
          ownKeys.forEach(function(key) {
            _defineProperty$3(target, key, source[key]);
          });
        }
        return target;
      }
      function _defineProperty$3(obj, key, value) {
        if (key in obj) {
          Object.defineProperty(obj, key, { value, enumerable: true, configurable: true, writable: true });
        } else {
          obj[key] = value;
        }
        return obj;
      }
      var ExpandOutlined = function ExpandOutlined2(props, context) {
        var p = _objectSpread$3({}, props, context.attrs);
        return createVNode(Icon, _objectSpread$3({}, p, {
          "icon": ExpandOutlined$1
        }), null);
      };
      ExpandOutlined.displayName = "ExpandOutlined";
      ExpandOutlined.inheritAttrs = false;
      var KeyOutlined$1 = { "icon": { "tag": "svg", "attrs": { "viewBox": "64 64 896 896", "focusable": "false" }, "children": [{ "tag": "path", "attrs": { "d": "M608 112c-167.9 0-304 136.1-304 304 0 70.3 23.9 135 63.9 186.5l-41.1 41.1-62.3-62.3a8.15 8.15 0 00-11.4 0l-39.8 39.8a8.15 8.15 0 000 11.4l62.3 62.3-44.9 44.9-62.3-62.3a8.15 8.15 0 00-11.4 0l-39.8 39.8a8.15 8.15 0 000 11.4l62.3 62.3-65.3 65.3a8.03 8.03 0 000 11.3l42.3 42.3c3.1 3.1 8.2 3.1 11.3 0l253.6-253.6A304.06 304.06 0 00608 720c167.9 0 304-136.1 304-304S775.9 112 608 112zm161.2 465.2C726.2 620.3 668.9 644 608 644c-60.9 0-118.2-23.7-161.2-66.8-43.1-43-66.8-100.3-66.8-161.2 0-60.9 23.7-118.2 66.8-161.2 43-43.1 100.3-66.8 161.2-66.8 60.9 0 118.2 23.7 161.2 66.8 43.1 43 66.8 100.3 66.8 161.2 0 60.9-23.7 118.2-66.8 161.2z" } }] }, "name": "key", "theme": "outlined" };
      function _objectSpread$2(target) {
        for (var i = 1; i < arguments.length; i++) {
          var source = arguments[i] != null ? Object(arguments[i]) : {};
          var ownKeys = Object.keys(source);
          if (typeof Object.getOwnPropertySymbols === "function") {
            ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function(sym) {
              return Object.getOwnPropertyDescriptor(source, sym).enumerable;
            }));
          }
          ownKeys.forEach(function(key) {
            _defineProperty$2(target, key, source[key]);
          });
        }
        return target;
      }
      function _defineProperty$2(obj, key, value) {
        if (key in obj) {
          Object.defineProperty(obj, key, { value, enumerable: true, configurable: true, writable: true });
        } else {
          obj[key] = value;
        }
        return obj;
      }
      var KeyOutlined = function KeyOutlined2(props, context) {
        var p = _objectSpread$2({}, props, context.attrs);
        return createVNode(Icon, _objectSpread$2({}, p, {
          "icon": KeyOutlined$1
        }), null);
      };
      KeyOutlined.displayName = "KeyOutlined";
      KeyOutlined.inheritAttrs = false;
      var MinusOutlined$1 = { "icon": { "tag": "svg", "attrs": { "viewBox": "64 64 896 896", "focusable": "false" }, "children": [{ "tag": "path", "attrs": { "d": "M872 474H152c-4.4 0-8 3.6-8 8v60c0 4.4 3.6 8 8 8h720c4.4 0 8-3.6 8-8v-60c0-4.4-3.6-8-8-8z" } }] }, "name": "minus", "theme": "outlined" };
      function _objectSpread$1(target) {
        for (var i = 1; i < arguments.length; i++) {
          var source = arguments[i] != null ? Object(arguments[i]) : {};
          var ownKeys = Object.keys(source);
          if (typeof Object.getOwnPropertySymbols === "function") {
            ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function(sym) {
              return Object.getOwnPropertyDescriptor(source, sym).enumerable;
            }));
          }
          ownKeys.forEach(function(key) {
            _defineProperty$1(target, key, source[key]);
          });
        }
        return target;
      }
      function _defineProperty$1(obj, key, value) {
        if (key in obj) {
          Object.defineProperty(obj, key, { value, enumerable: true, configurable: true, writable: true });
        } else {
          obj[key] = value;
        }
        return obj;
      }
      var MinusOutlined = function MinusOutlined2(props, context) {
        var p = _objectSpread$1({}, props, context.attrs);
        return createVNode(Icon, _objectSpread$1({}, p, {
          "icon": MinusOutlined$1
        }), null);
      };
      MinusOutlined.displayName = "MinusOutlined";
      MinusOutlined.inheritAttrs = false;
      var NotificationOutlined$1 = { "icon": { "tag": "svg", "attrs": { "viewBox": "64 64 896 896", "focusable": "false" }, "children": [{ "tag": "path", "attrs": { "d": "M880 112c-3.8 0-7.7.7-11.6 2.3L292 345.9H128c-8.8 0-16 7.4-16 16.6v299c0 9.2 7.2 16.6 16 16.6h101.7c-3.7 11.6-5.7 23.9-5.7 36.4 0 65.9 53.8 119.5 120 119.5 55.4 0 102.1-37.6 115.9-88.4l408.6 164.2c3.9 1.5 7.8 2.3 11.6 2.3 16.9 0 32-14.2 32-33.2V145.2C912 126.2 897 112 880 112zM344 762.3c-26.5 0-48-21.4-48-47.8 0-11.2 3.9-21.9 11-30.4l84.9 34.1c-2 24.6-22.7 44.1-47.9 44.1zm496 58.4L318.8 611.3l-12.9-5.2H184V417.9h121.9l12.9-5.2L840 203.3v617.4z" } }] }, "name": "notification", "theme": "outlined" };
      function _objectSpread(target) {
        for (var i = 1; i < arguments.length; i++) {
          var source = arguments[i] != null ? Object(arguments[i]) : {};
          var ownKeys = Object.keys(source);
          if (typeof Object.getOwnPropertySymbols === "function") {
            ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function(sym) {
              return Object.getOwnPropertyDescriptor(source, sym).enumerable;
            }));
          }
          ownKeys.forEach(function(key) {
            _defineProperty(target, key, source[key]);
          });
        }
        return target;
      }
      function _defineProperty(obj, key, value) {
        if (key in obj) {
          Object.defineProperty(obj, key, { value, enumerable: true, configurable: true, writable: true });
        } else {
          obj[key] = value;
        }
        return obj;
      }
      var NotificationOutlined = function NotificationOutlined2(props, context) {
        var p = _objectSpread({}, props, context.attrs);
        return createVNode(Icon, _objectSpread({}, p, {
          "icon": NotificationOutlined$1
        }), null);
      };
      NotificationOutlined.displayName = "NotificationOutlined";
      NotificationOutlined.inheritAttrs = false;
      const _sfc_main$2 = defineComponent({
        components: {
          KeyOutlined
        },
        setup() {
          const settingsStore2 = useSettingsStore();
          const state = reactive({
            videoSettings: { ...settingsStore2.videoSettings },
            submitSettings: { ...settingsStore2.submitSettings },
            automationSettings: { ...settingsStore2.automationSettings },
            answerSettings: { ...settingsStore2.answerSettings }
          });
          const updateVideoSetting = (key) => {
            settingsStore2.updateSetting("videoSettings", key, state.videoSettings[key]);
          };
          const updateSubmitSetting = (key) => {
            settingsStore2.updateSetting("submitSettings", key, state.submitSettings[key]);
          };
          const updateAutomationSetting = (key) => {
            settingsStore2.updateSetting("automationSettings", key, state.automationSettings[key]);
          };
          const updateAnswerSetting = (key) => {
            settingsStore2.updateSetting("answerSettings", key, state.answerSettings[key]);
          };
          const resetSettings = () => {
            settingsStore2.resetSettings();
            Object.assign(state.videoSettings, settingsStore2.videoSettings);
            Object.assign(state.submitSettings, settingsStore2.submitSettings);
            Object.assign(state.automationSettings, settingsStore2.automationSettings);
            Object.assign(state.answerSettings, settingsStore2.answerSettings);
          };
          const rootRef = ref(null);
          const getModalContainer = () => {
            var _a;
            return (_a = rootRef.value) == null ? void 0 : _a.getRootNode();
          };
          return {
            ...toRefs$1(state),
            updateVideoSetting,
            updateSubmitSetting,
            updateAutomationSetting,
            updateAnswerSetting,
            resetSettings,
            rootRef,
            getModalContainer
          };
        }
      });
      const _hoisted_1$2 = {
        ref: "rootRef",
        style: { "max-height": "500px", "overflow-y": "auto" }
      };
      const _hoisted_2$2 = { style: { "margin-bottom": "15px", "padding": "10px", "background-color": "#f9f9f9", "border-radius": "6px" } };
      const _hoisted_3$1 = /* @__PURE__ */ createElementVNode("h3", { style: { "font-size": "14px", "font-weight": "bold", "margin-bottom": "8px", "padding-bottom": "5px", "border-bottom": "1px solid #eee" } }, "视频设置", -1);
      const _hoisted_4$1 = { style: { "margin-bottom": "8px", "display": "flex", "align-items": "center" } };
      const _hoisted_5$1 = /* @__PURE__ */ createElementVNode("span", { style: { "margin-right": "8px", "flex-shrink": "0" } }, "应用视频倍速，一切后果自负：", -1);
      const _hoisted_6$1 = { style: { "margin-bottom": "15px", "padding": "10px", "background-color": "#f9f9f9", "border-radius": "6px" } };
      const _hoisted_7$1 = /* @__PURE__ */ createElementVNode("h3", { style: { "font-size": "14px", "font-weight": "bold", "margin-bottom": "8px", "padding-bottom": "5px", "border-bottom": "1px solid #eee" } }, "答题设置", -1);
      const _hoisted_8$1 = { style: { "margin-bottom": "12px" } };
      const _hoisted_9$1 = /* @__PURE__ */ createElementVNode("div", { style: { "margin-bottom": "6px", "font-size": "13px", "color": "#333" } }, [
        /* @__PURE__ */ createElementVNode("span", { style: { "color": "#ff4d4f", "margin-right": "4px" } }, "*"),
        /* @__PURE__ */ createTextVNode("授权码： ")
      ], -1);
      const _hoisted_10$1 = { style: { "margin-bottom": "8px", "display": "flex", "align-items": "center" } };
      const _hoisted_11$1 = /* @__PURE__ */ createElementVNode("span", { style: { "margin-right": "8px", "flex-shrink": "0" } }, "搜题间隔(秒)：", -1);
      const _hoisted_12$1 = { style: { "margin-bottom": "8px", "display": "flex", "align-items": "center" } };
      const _hoisted_13$1 = /* @__PURE__ */ createElementVNode("span", { style: { "margin-right": "8px", "flex-shrink": "0" } }, "选择匹配度高于这个阈值的答案( %)：", -1);
      const _hoisted_14 = { style: { "margin-bottom": "8px", "display": "flex", "align-items": "center" } };
      const _hoisted_15 = { style: { "margin-bottom": "8px", "display": "flex", "align-items": "center" } };
      const _hoisted_16 = { style: { "margin-bottom": "15px", "padding": "10px", "background-color": "#f9f9f9", "border-radius": "6px" } };
      const _hoisted_17 = /* @__PURE__ */ createElementVNode("h3", { style: { "font-size": "14px", "font-weight": "bold", "margin-bottom": "8px", "padding-bottom": "5px", "border-bottom": "1px solid #eee" } }, "任务提交设置", -1);
      const _hoisted_18 = { style: { "margin-bottom": "8px", "display": "flex", "align-items": "center" } };
      const _hoisted_19 = { style: { "margin-bottom": "8px", "display": "flex", "align-items": "center" } };
      const _hoisted_20 = { style: { "margin-bottom": "8px", "display": "flex", "align-items": "center" } };
      const _hoisted_21 = { style: { "margin-bottom": "8px", "display": "flex", "align-items": "center" } };
      const _hoisted_22 = /* @__PURE__ */ createElementVNode("span", { style: { "margin-right": "8px", "flex-shrink": "0" } }, "准确率低于这个值时不会自动提交( %)：", -1);
      const _hoisted_23 = { style: { "margin-bottom": "15px", "padding": "10px", "background-color": "#f9f9f9", "border-radius": "6px" } };
      const _hoisted_24 = /* @__PURE__ */ createElementVNode("h3", { style: { "font-size": "14px", "font-weight": "bold", "margin-bottom": "8px", "padding-bottom": "5px", "border-bottom": "1px solid #eee" } }, "自动化设置", -1);
      const _hoisted_25 = { style: { "margin-bottom": "8px", "display": "flex", "align-items": "center" } };
      const _hoisted_26 = { style: { "margin-bottom": "8px", "display": "flex", "align-items": "center" } };
      const _hoisted_27 = { style: { "margin-bottom": "8px", "display": "flex", "align-items": "center" } };
      const _hoisted_28 = { style: { "margin-bottom": "8px", "display": "flex", "align-items": "center" } };
      const _hoisted_29 = { style: { "margin-top": "15px", "display": "flex", "justify-content": "center" } };
      function _sfc_render$1(_ctx, _cache, $props, $setup, $data, $options) {
        const _component_a_select_option = resolveComponent("a-select-option");
        const _component_a_select = resolveComponent("a-select");
        const _component_key_outlined = resolveComponent("key-outlined");
        const _component_a_input_password = resolveComponent("a-input-password");
        const _component_a_input_number = resolveComponent("a-input-number");
        const _component_a_checkbox = resolveComponent("a-checkbox");
        const _component_a_button = resolveComponent("a-button");
        return openBlock(), createElementBlock("div", _hoisted_1$2, [
          createElementVNode("div", _hoisted_2$2, [
            _hoisted_3$1,
            createElementVNode("div", _hoisted_4$1, [
              _hoisted_5$1,
              createVNode(_component_a_select, {
                getPopupContainer: _ctx.getModalContainer,
                value: _ctx.videoSettings.playbackRate,
                "onUpdate:value": _cache[0] || (_cache[0] = ($event) => _ctx.videoSettings.playbackRate = $event),
                style: { "width": "100px" },
                onChange: _cache[1] || (_cache[1] = ($event) => _ctx.updateVideoSetting("playbackRate"))
              }, {
                default: withCtx(() => [
                  createVNode(_component_a_select_option, { value: 1 }, {
                    default: withCtx(() => [
                      createTextVNode("1倍速")
                    ]),
                    _: 1
                  }),
                  createVNode(_component_a_select_option, { value: 1.5 }, {
                    default: withCtx(() => [
                      createTextVNode("1.5倍速")
                    ]),
                    _: 1
                  }),
                  createVNode(_component_a_select_option, { value: 2 }, {
                    default: withCtx(() => [
                      createTextVNode("2倍速")
                    ]),
                    _: 1
                  })
                ]),
                _: 1
              }, 8, ["getPopupContainer", "value"])
            ])
          ]),
          createElementVNode("div", _hoisted_6$1, [
            _hoisted_7$1,
            createElementVNode("div", _hoisted_8$1, [
              _hoisted_9$1,
              createVNode(_component_a_input_password, {
                value: _ctx.answerSettings.token,
                "onUpdate:value": _cache[2] || (_cache[2] = ($event) => _ctx.answerSettings.token = $event),
                placeholder: "请输入授权码（必填）",
                onChange: _cache[3] || (_cache[3] = ($event) => _ctx.updateAnswerSetting("token")),
                style: { "width": "100%" }
              }, {
                addonBefore: withCtx(() => [
                  createVNode(_component_key_outlined)
                ]),
                _: 1
              }, 8, ["value"])
            ]),
            createElementVNode("div", _hoisted_10$1, [
              _hoisted_11$1,
              createVNode(_component_a_input_number, {
                value: _ctx.answerSettings.searchInterval,
                "onUpdate:value": _cache[4] || (_cache[4] = ($event) => _ctx.answerSettings.searchInterval = $event),
                min: 1,
                max: 10,
                onChange: _cache[5] || (_cache[5] = ($event) => _ctx.updateAnswerSetting("searchInterval")),
                style: { "width": "100px" }
              }, null, 8, ["value"])
            ]),
            createElementVNode("div", _hoisted_12$1, [
              _hoisted_13$1,
              createVNode(_component_a_input_number, {
                value: _ctx.answerSettings.matchThreshold,
                "onUpdate:value": _cache[6] || (_cache[6] = ($event) => _ctx.answerSettings.matchThreshold = $event),
                min: 0,
                max: 100,
                onChange: _cache[7] || (_cache[7] = ($event) => _ctx.updateAnswerSetting("matchThreshold")),
                style: { "width": "100px" }
              }, null, 8, ["value"])
            ]),
            createElementVNode("div", _hoisted_14, [
              createVNode(_component_a_checkbox, {
                checked: _ctx.answerSettings.autoSaveAnswer,
                "onUpdate:checked": _cache[8] || (_cache[8] = ($event) => _ctx.answerSettings.autoSaveAnswer = $event),
                onChange: _cache[9] || (_cache[9] = ($event) => _ctx.updateAnswerSetting("autoSaveAnswer"))
              }, {
                default: withCtx(() => [
                  createTextVNode(" 自动保存答案 ")
                ]),
                _: 1
              }, 8, ["checked"])
            ]),
            createElementVNode("div", _hoisted_15, [
              createVNode(_component_a_checkbox, {
                checked: _ctx.answerSettings.useAIWhenNoAnswer,
                "onUpdate:checked": _cache[10] || (_cache[10] = ($event) => _ctx.answerSettings.useAIWhenNoAnswer = $event),
                onChange: _cache[11] || (_cache[11] = ($event) => _ctx.updateAnswerSetting("useAIWhenNoAnswer")),
                disabled: ""
              }, {
                default: withCtx(() => [
                  createTextVNode(" 无答案时使用AI答题（等待开发） ")
                ]),
                _: 1
              }, 8, ["checked"])
            ])
          ]),
          createElementVNode("div", _hoisted_16, [
            _hoisted_17,
            createElementVNode("div", _hoisted_18, [
              createVNode(_component_a_checkbox, {
                checked: _ctx.submitSettings.autoSubmitChapter,
                "onUpdate:checked": _cache[12] || (_cache[12] = ($event) => _ctx.submitSettings.autoSubmitChapter = $event),
                onChange: _cache[13] || (_cache[13] = ($event) => _ctx.updateSubmitSetting("autoSubmitChapter"))
              }, {
                default: withCtx(() => [
                  createTextVNode(" 自动提交章节作业 ")
                ]),
                _: 1
              }, 8, ["checked"])
            ]),
            createElementVNode("div", _hoisted_19, [
              createVNode(_component_a_checkbox, {
                checked: _ctx.submitSettings.autoSubmitHomework,
                "onUpdate:checked": _cache[14] || (_cache[14] = ($event) => _ctx.submitSettings.autoSubmitHomework = $event),
                onChange: _cache[15] || (_cache[15] = ($event) => _ctx.updateSubmitSetting("autoSubmitHomework")),
                disabled: ""
              }, {
                default: withCtx(() => [
                  createTextVNode(" 自动提交课后作业（请自行提交） ")
                ]),
                _: 1
              }, 8, ["checked"])
            ]),
            createElementVNode("div", _hoisted_20, [
              createVNode(_component_a_checkbox, {
                checked: _ctx.submitSettings.autoSubmitExam,
                "onUpdate:checked": _cache[16] || (_cache[16] = ($event) => _ctx.submitSettings.autoSubmitExam = $event),
                onChange: _cache[17] || (_cache[17] = ($event) => _ctx.updateSubmitSetting("autoSubmitExam")),
                disabled: ""
              }, {
                default: withCtx(() => [
                  createTextVNode(" 自动提交考试（请自行提交） ")
                ]),
                _: 1
              }, 8, ["checked"])
            ]),
            createElementVNode("div", _hoisted_21, [
              _hoisted_22,
              createVNode(_component_a_input_number, {
                value: _ctx.submitSettings.correctRateThreshold,
                "onUpdate:value": _cache[18] || (_cache[18] = ($event) => _ctx.submitSettings.correctRateThreshold = $event),
                min: 0,
                max: 100,
                onChange: _cache[19] || (_cache[19] = ($event) => _ctx.updateSubmitSetting("correctRateThreshold")),
                style: { "width": "100px" }
              }, null, 8, ["value"])
            ])
          ]),
          createElementVNode("div", _hoisted_23, [
            _hoisted_24,
            createElementVNode("div", _hoisted_25, [
              createVNode(_component_a_checkbox, {
                checked: _ctx.automationSettings.autoNextChapter,
                "onUpdate:checked": _cache[20] || (_cache[20] = ($event) => _ctx.automationSettings.autoNextChapter = $event),
                onChange: _cache[21] || (_cache[21] = ($event) => _ctx.updateAutomationSetting("autoNextChapter"))
              }, {
                default: withCtx(() => [
                  createTextVNode(" 自动跳转下一章节 ")
                ]),
                _: 1
              }, 8, ["checked"])
            ]),
            createElementVNode("div", _hoisted_26, [
              createVNode(_component_a_checkbox, {
                checked: _ctx.automationSettings.onlyDoQuestions,
                "onUpdate:checked": _cache[22] || (_cache[22] = ($event) => _ctx.automationSettings.onlyDoQuestions = $event),
                onChange: _cache[23] || (_cache[23] = ($event) => _ctx.updateAutomationSetting("onlyDoQuestions"))
              }, {
                default: withCtx(() => [
                  createTextVNode(" 只完成答题类任务 ")
                ]),
                _: 1
              }, 8, ["checked"])
            ]),
            createElementVNode("div", _hoisted_27, [
              createVNode(_component_a_checkbox, {
                checked: _ctx.automationSettings.skipFinishedTasks,
                "onUpdate:checked": _cache[24] || (_cache[24] = ($event) => _ctx.automationSettings.skipFinishedTasks = $event),
                onChange: _cache[25] || (_cache[25] = ($event) => _ctx.updateAutomationSetting("skipFinishedTasks"))
              }, {
                default: withCtx(() => [
                  createTextVNode(" 自动跳过已完成任务点 ")
                ]),
                _: 1
              }, 8, ["checked"])
            ]),
            createElementVNode("div", _hoisted_28, [
              createVNode(_component_a_checkbox, {
                checked: _ctx.automationSettings.autoNextExamQuestion,
                "onUpdate:checked": _cache[26] || (_cache[26] = ($event) => _ctx.automationSettings.autoNextExamQuestion = $event),
                onChange: _cache[27] || (_cache[27] = ($event) => _ctx.updateAutomationSetting("autoNextExamQuestion"))
              }, {
                default: withCtx(() => [
                  createTextVNode(" 考试自动进入下一题 ")
                ]),
                _: 1
              }, 8, ["checked"])
            ])
          ]),
          createElementVNode("div", _hoisted_29, [
            createVNode(_component_a_button, {
              type: "primary",
              onClick: _ctx.resetSettings
            }, {
              default: withCtx(() => [
                createTextVNode("恢复默认设置")
              ]),
              _: 1
            }, 8, ["onClick"])
          ])
        ], 512);
      }
      const SettingsPanel = /* @__PURE__ */ _export_sfc(_sfc_main$2, [["render", _sfc_render$1]]);
      function get_t(data) {
        const { html, ...rest } = data;
        const flatten = (obj, prefix = "") => {
          const pairs = [];
          Object.keys(obj).sort().forEach((key) => {
            const fullKey = prefix ? `${prefix}.${key}` : key;
            const value = obj[key];
            if (value === null || value === void 0) return;
            if (Array.isArray(value) && value.length === 0) return;
            if (typeof value === "object" && !Array.isArray(value) && Object.keys(value).length === 0) return;
            if (Array.isArray(value)) {
              if (value.every((v) => typeof v !== "object")) {
                pairs.push(`${fullKey}=${value.sort().join(",")}`);
              } else {
                pairs.push(`${fullKey}=${JSON.stringify(value)}`);
              }
            } else if (typeof value === "object") {
              pairs.push(...flatten(value, fullKey));
            } else {
              pairs.push(`${fullKey}=${value}`);
            }
          });
          return pairs;
        };
        const signString = flatten(rest).join("&");
        return CryptoJS.MD5(signString).toString();
      }
      async function encrypt(data = "", key = "asdgdfghfghfghfg", iv = "1234567890123456") {
        try {
          if (!data) {
            return "";
          }
          key = key.substring(0, 16);
          iv = iv.substring(0, 16);
          if (!window.crypto || !window.crypto.subtle) {
            console.log("Web Crypto API 不可用，使用 crypto-js 降级方案");
            const keyUtf8 = CryptoJS.enc.Utf8.parse(key);
            const ivUtf8 = CryptoJS.enc.Utf8.parse(iv);
            const encrypted = CryptoJS.AES.encrypt(data, keyUtf8, {
              iv: ivUtf8,
              mode: CryptoJS.mode.CBC,
              padding: CryptoJS.pad.Pkcs7
            });
            return encrypted.toString();
          }
          const encoder = new TextEncoder();
          const dataBuffer = encoder.encode(data);
          const keyBuffer = encoder.encode(key);
          const ivBuffer = encoder.encode(iv);
          const cryptoKey = await crypto.subtle.importKey(
            "raw",
            keyBuffer,
            { name: "AES-CBC" },
            false,
            ["encrypt"]
          );
          const encryptedBuffer = await crypto.subtle.encrypt(
            {
              name: "AES-CBC",
              iv: ivBuffer
            },
            cryptoKey,
            dataBuffer
          );
          const encryptedArray = new Uint8Array(encryptedBuffer);
          const chunkSize = 1024;
          let binaryString = "";
          for (let i = 0; i < encryptedArray.length; i += chunkSize) {
            const chunk = encryptedArray.slice(i, Math.min(i + chunkSize, encryptedArray.length));
            binaryString += String.fromCharCode.apply(null, Array.from(chunk));
          }
          let base64String;
          try {
            base64String = btoa(binaryString);
          } catch (btaError) {
            console.error("btoa 失败，尝试备用方法", btaError);
            base64String = binaryString.split("").map(
              (char) => ("0" + char.charCodeAt(0).toString(16)).slice(-2)
            ).join("");
          }
          return base64String;
        } catch (e) {
          console.error("加密异常详情", e);
          return "";
        }
      }
      async function decrypt(data = "", key = "asdgdfghfghfghfg", iv = "1234567890123456") {
        try {
          if (!data) {
            return "";
          }
          key = key.substring(0, 16);
          iv = iv.substring(0, 16);
          if (!window.crypto || !window.crypto.subtle) {
            console.log("Web Crypto API 不可用，使用 crypto-js 降级方案");
            const keyUtf8 = CryptoJS.enc.Utf8.parse(key);
            const ivUtf8 = CryptoJS.enc.Utf8.parse(iv);
            const decrypted = CryptoJS.AES.decrypt(data, keyUtf8, {
              iv: ivUtf8,
              mode: CryptoJS.mode.CBC,
              padding: CryptoJS.pad.Pkcs7
            });
            return decrypted.toString(CryptoJS.enc.Utf8);
          }
          const encoder = new TextEncoder();
          const keyBuffer = encoder.encode(key);
          const ivBuffer = encoder.encode(iv);
          let binaryString;
          try {
            binaryString = atob(data);
          } catch (atobError) {
            console.error("atob 解码失败", atobError);
            throw new Error("Base64 解码失败，数据格式不正确");
          }
          const dataBuffer = new Uint8Array(binaryString.length);
          for (let i = 0; i < binaryString.length; i++) {
            dataBuffer[i] = binaryString.charCodeAt(i);
          }
          if (dataBuffer.length % 16 !== 0) {
            throw new Error("加密数据长度不正确，不是16的倍数");
          }
          const cryptoKey = await crypto.subtle.importKey(
            "raw",
            keyBuffer,
            { name: "AES-CBC" },
            false,
            ["decrypt"]
          );
          const decryptedBuffer = await crypto.subtle.decrypt(
            {
              name: "AES-CBC",
              iv: ivBuffer
            },
            cryptoKey,
            dataBuffer
          );
          const decoder = new TextDecoder("utf-8", { fatal: true });
          return decoder.decode(decryptedBuffer);
        } catch (e) {
          console.error("解密异常详情", e);
          return "";
        }
      }
      const _sfc_main$1 = defineComponent({
        components: {
          LogViewer,
          AnswerViewer,
          SettingsPanel,
          MinusOutlined,
          ExpandOutlined,
          KeyOutlined,
          NotificationOutlined
        },
        setup() {
          const settingsStore2 = useSettingsStore();
          const visible = ref(true);
          const modalTitleRef = ref(null);
          const rootRef = ref(null);
          const activeKey = ref(settingsStore2.uiSettings.activeTab);
          const token = ref(settingsStore2.answerSettings.token || "");
          const isMinimized = ref(false);
          const notice = ref("");
          const cardInfo = ref(settingsStore2.cardInfo);
          const toggleMinimize = () => {
            isMinimized.value = !isMinimized.value;
          };
          const updateToken = () => {
            settingsStore2.updateToken(token.value);
          };
          const goToSettings = () => {
            activeKey.value = "3";
          };
          const {
            x,
            y,
            isDragging
          } = useDraggable(modalTitleRef);
          const fetchCardInfo = async () => {
            try {
              const token2 = settingsStore2.answerSettings.token;
              if (!token2) {
                settingsStore2.updateCardInfo({
                  status: 0,
                  message: "未配置授权码"
                });
                cardInfo.value = settingsStore2.cardInfo;
                return;
              }
              const requestData = { api: true };
              const t = get_t(requestData);
              const headers = {
                "Accept": "*/*",
                "referer": location.href,
                "X-Script-Version": SCRIPT_INFO.version,
                "aka": t,
                "Authorization": `Bearer ${token2}`
              };
              _GM_xmlhttpRequest({
                method: "GET",
                url: "https://www.aiask.site/v1/cardTimes",
                headers,
                timeout: 5e3,
                onload: async function(response) {
                  try {
                    if (response.status >= 200 && response.status < 300) {
                      let data = JSON.parse(response.responseText);
                      if (data.encrypted) {
                        const decryptedData = await decrypt(data.data);
                        data = JSON.parse(decryptedData);
                      }
                      if (data.code === 200 && data.data) {
                        settingsStore2.updateCardInfo({
                          ...data.data,
                          status: 1,
                          message: "授权码有效"
                        });
                      } else {
                        settingsStore2.updateCardInfo({
                          status: 0,
                          message: data.message || "授权码验证失败"
                        });
                      }
                      cardInfo.value = settingsStore2.cardInfo;
                    } else {
                      settingsStore2.updateCardInfo({
                        status: 0,
                        message: "获取授权码信息失败"
                      });
                      cardInfo.value = settingsStore2.cardInfo;
                    }
                  } catch (error) {
                    console.error("解析授权码响应失败:", error);
                    settingsStore2.updateCardInfo({
                      status: 0,
                      message: "解析授权码信息失败"
                    });
                    cardInfo.value = settingsStore2.cardInfo;
                  }
                },
                onerror: function(error) {
                  console.error("Failed to fetch card info:", error);
                  settingsStore2.updateCardInfo({
                    status: 0,
                    message: "网络错误，无法获取授权码信息"
                  });
                  cardInfo.value = settingsStore2.cardInfo;
                },
                ontimeout: function() {
                  settingsStore2.updateCardInfo({
                    status: 0,
                    message: "获取授权码信息超时"
                  });
                  cardInfo.value = settingsStore2.cardInfo;
                }
              });
            } catch (error) {
              console.error("Failed to fetch card info:", error);
              settingsStore2.updateCardInfo({
                status: 0,
                message: "获取授权码信息失败"
              });
              cardInfo.value = settingsStore2.cardInfo;
            }
          };
          const fetchNotice = async () => {
            try {
              const requestData = { api: true };
              const t = get_t(requestData);
              const headers = {
                "Accept": "*/*",
                "referer": location.href,
                "X-Script-Version": SCRIPT_INFO.version,
                // 脚本版本号
                "aka": t
                // 添加签名密钥到请求头
              };
              _GM_xmlhttpRequest({
                method: "GET",
                url: "https://www.aiask.site/v1/notice",
                headers,
                timeout: 5e3,
                onload: async function(response) {
                  try {
                    if (response.status >= 200 && response.status < 300) {
                      let data = JSON.parse(response.responseText);
                      if (data.encrypted) {
                        const decryptedData = await decrypt(data.data);
                        data = JSON.parse(decryptedData);
                      }
                      if (data.code === 200 && data.data && data.data.notice) {
                        notice.value = data.data.notice;
                      } else {
                        notice.value = "暂无公告";
                      }
                    } else {
                      notice.value = "获取公告失败，请稍后重试";
                    }
                  } catch (error) {
                    console.error("解析公告响应失败:", error);
                    notice.value = "获取公告失败，请稍后重试";
                  }
                },
                onerror: function(error) {
                  console.error("Failed to fetch notice:", error);
                  notice.value = "获取公告失败，请检查网络连接";
                },
                ontimeout: function() {
                  notice.value = "获取公告超时";
                }
              });
            } catch (error) {
              console.error("Failed to fetch notice:", error);
              notice.value = "获取公告失败，请检查网络或项目地址";
            }
          };
          onMounted(() => {
            document.body.style.overflow = "auto";
            if (settingsStore2.uiSettings.position) {
              transformX.value = settingsStore2.uiSettings.position.x;
              transformY.value = settingsStore2.uiSettings.position.y;
            }
            fetchNotice();
            fetchCardInfo();
          });
          watch(activeKey, (newVal) => {
            settingsStore2.updateSetting("uiSettings", "activeTab", newVal);
          });
          watch(() => settingsStore2.answerSettings.token, (newToken) => {
            if (newToken) {
              fetchCardInfo();
            }
          });
          const handleOk = (e) => {
            console.log(e);
            visible.value = false;
          };
          const startX = ref(0);
          const startY = ref(0);
          const startedDrag = ref(false);
          const transformX = ref(0);
          const transformY = ref(0);
          const preTransformX = ref(0);
          const preTransformY = ref(0);
          const dragRect = ref({
            left: 0,
            right: 0,
            top: 0,
            bottom: 0
          });
          const getModalContainer = () => {
            var _a;
            return (_a = rootRef.value) == null ? void 0 : _a.getRootNode();
          };
          watch([x, y], () => {
            if (!startedDrag.value) {
              startX.value = x.value;
              startY.value = y.value;
              if (modalTitleRef.value) {
                const titleRect = modalTitleRef.value.getBoundingClientRect();
                dragRect.value.left = 0;
                dragRect.value.top = 0;
                dragRect.value.right = window.innerWidth - titleRect.width;
                dragRect.value.bottom = window.innerHeight - titleRect.height;
                preTransformX.value = transformX.value;
                preTransformY.value = transformY.value;
              }
            }
            startedDrag.value = true;
          });
          watch(isDragging, () => {
            if (!isDragging) {
              startedDrag.value = false;
              settingsStore2.updatePosition(transformX.value, transformY.value);
            }
          });
          watchEffect(() => {
            if (startedDrag.value) {
              transformX.value = preTransformX.value + Math.min(Math.max(dragRect.value.left, x.value), dragRect.value.right) - startX.value;
              transformY.value = preTransformY.value + Math.min(Math.max(dragRect.value.top, y.value), dragRect.value.bottom) - startY.value;
            }
          });
          const transformStyle = computed(() => {
            return {
              transform: `translate(${transformX.value}px, ${transformY.value}px)`
            };
          });
          return {
            visible,
            handleOk,
            modalTitleRef,
            transformStyle,
            rootRef,
            getModalContainer,
            activeKey,
            token,
            updateToken,
            toggleMinimize,
            isMinimized,
            notice,
            cardInfo,
            settingsStore: settingsStore2,
            goToSettings
          };
        }
      });
      const _withScopeId = (n) => (pushScopeId("data-v-95dbc5a8"), n = n(), popScopeId(), n);
      const _hoisted_1$1 = { ref: "rootRef" };
      const _hoisted_2$1 = ["innerHTML"];
      const _hoisted_3 = /* @__PURE__ */ _withScopeId(() => /* @__PURE__ */ createElementVNode("div", { style: { "margin": "12px 0", "padding": "8px", "background-color": "#f0f9ff", "border-radius": "4px", "font-size": "12px", "text-align": "center", "border": "1px dashed #1890ff" } }, [
        /* @__PURE__ */ createElementVNode("a", {
          href: "https://github.com/你的项目地址",
          target: "_blank",
          style: { "color": "#1890ff", "text-decoration": "none" }
        }, " CX助手 - 让学习更轻松 - 点击访问项目主页 ")
      ], -1));
      const _hoisted_4 = {
        ref: "modalTitleRef",
        style: { "display": "flex", "align-items": "center", "width": "100%", "cursor": "move", "padding": "5px 0" }
      };
      const _hoisted_5 = { style: { "margin-left": "10px", "display": "flex", "align-items": "center", "gap": "8px" } };
      const _hoisted_6 = { style: { "font-size": "13px", "color": "white", "font-weight": "500" } };
      const _hoisted_7 = /* @__PURE__ */ _withScopeId(() => /* @__PURE__ */ createElementVNode("span", { style: { "font-size": "13px", "color": "#856404", "font-weight": "500" } }, "❌ 授权码验证失败", -1));
      const _hoisted_8 = /* @__PURE__ */ _withScopeId(() => /* @__PURE__ */ createElementVNode("span", { style: { "font-size": "13px", "color": "#0066cc" } }, "前往配置", -1));
      const _hoisted_9 = [
        _hoisted_7,
        _hoisted_8
      ];
      const _hoisted_10 = /* @__PURE__ */ _withScopeId(() => /* @__PURE__ */ createElementVNode("span", { style: { "font-size": "13px", "color": "#721c24", "font-weight": "500" } }, "❌ 未配置授权码", -1));
      const _hoisted_11 = /* @__PURE__ */ _withScopeId(() => /* @__PURE__ */ createElementVNode("span", { style: { "font-size": "13px", "color": "#0066cc" } }, "前往配置", -1));
      const _hoisted_12 = [
        _hoisted_10,
        _hoisted_11
      ];
      const _hoisted_13 = { style: { "margin-left": "auto", "display": "flex", "align-items": "center" } };
      function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
        const _component_LogViewer = resolveComponent("LogViewer");
        const _component_a_tab_pane = resolveComponent("a-tab-pane");
        const _component_AnswerViewer = resolveComponent("AnswerViewer");
        const _component_SettingsPanel = resolveComponent("SettingsPanel");
        const _component_a_tabs = resolveComponent("a-tabs");
        const _component_minus_square_outlined = resolveComponent("minus-square-outlined");
        const _component_expand_outlined = resolveComponent("expand-outlined");
        const _component_minus_outlined = resolveComponent("minus-outlined");
        const _component_a_button = resolveComponent("a-button");
        const _component_a_modal = resolveComponent("a-modal");
        return openBlock(), createElementBlock(Fragment, null, [
          createElementVNode("div", _hoisted_1$1, null, 512),
          createElementVNode("div", null, [
            createVNode(_component_a_modal, {
              ref: "modalRef",
              maskStyle: { display: "none" },
              wrapClassName: "floating-modal",
              getContainer: _ctx.getModalContainer,
              visible: _ctx.visible,
              "onUpdate:visible": _cache[10] || (_cache[10] = ($event) => _ctx.visible = $event),
              maskClosable: false,
              closable: false,
              onOk: _ctx.handleOk,
              footer: null,
              bodyStyle: _ctx.isMinimized ? { display: "none" } : { paddingTop: "10px" }
            }, {
              closeIcon: withCtx(() => [
                createVNode(_component_minus_square_outlined)
              ]),
              title: withCtx(() => [
                createElementVNode("div", _hoisted_4, [
                  createElementVNode("div", _hoisted_5, [
                    _ctx.cardInfo.status === 1 ? (openBlock(), createElementBlock("div", {
                      key: 0,
                      onClick: _cache[1] || (_cache[1] = (...args) => _ctx.goToSettings && _ctx.goToSettings(...args)),
                      style: { "display": "flex", "align-items": "center", "padding": "6px 14px", "background": "linear-gradient(135deg, #667eea 0%, #764ba2 100%)", "border-radius": "4px", "cursor": "pointer", "transition": "all 0.2s" },
                      onMouseenter: _cache[2] || (_cache[2] = (e) => e.currentTarget.style.opacity = "0.85"),
                      onMouseleave: _cache[3] || (_cache[3] = (e) => e.currentTarget.style.opacity = "1")
                    }, [
                      createElementVNode("span", _hoisted_6, "🔑 授权码次数剩余，以刷新后为准：" + toDisplayString(_ctx.cardInfo.score) + "/" + toDisplayString(_ctx.cardInfo.total_score), 1)
                    ], 32)) : _ctx.cardInfo.status === 0 && _ctx.settingsStore.answerSettings.token ? (openBlock(), createElementBlock("div", {
                      key: 1,
                      onClick: _cache[4] || (_cache[4] = (...args) => _ctx.goToSettings && _ctx.goToSettings(...args)),
                      style: { "display": "flex", "align-items": "center", "gap": "8px", "padding": "6px 14px", "background": "#fff3cd", "border-radius": "4px", "cursor": "pointer", "transition": "all 0.2s" },
                      onMouseenter: _cache[5] || (_cache[5] = (e) => e.currentTarget.style.opacity = "0.85"),
                      onMouseleave: _cache[6] || (_cache[6] = (e) => e.currentTarget.style.opacity = "1")
                    }, _hoisted_9, 32)) : (openBlock(), createElementBlock("div", {
                      key: 2,
                      onClick: _cache[7] || (_cache[7] = (...args) => _ctx.goToSettings && _ctx.goToSettings(...args)),
                      style: { "display": "flex", "align-items": "center", "gap": "8px", "padding": "6px 14px", "background": "#f8d7da", "border-radius": "4px", "cursor": "pointer", "transition": "all 0.2s" },
                      onMouseenter: _cache[8] || (_cache[8] = (e) => e.currentTarget.style.opacity = "0.85"),
                      onMouseleave: _cache[9] || (_cache[9] = (e) => e.currentTarget.style.opacity = "1")
                    }, _hoisted_12, 32))
                  ]),
                  createElementVNode("div", _hoisted_13, [
                    createVNode(_component_a_button, {
                      type: "text",
                      size: "small",
                      onClick: _ctx.toggleMinimize,
                      style: { "margin-right": "10px" }
                    }, {
                      icon: withCtx(() => [
                        _ctx.isMinimized ? (openBlock(), createBlock(_component_expand_outlined, { key: 0 })) : (openBlock(), createBlock(_component_minus_outlined, { key: 1 }))
                      ]),
                      _: 1
                    }, 8, ["onClick"])
                  ])
                ], 512)
              ]),
              modalRender: withCtx(({ originVNode }) => [
                createElementVNode("div", {
                  style: normalizeStyle(_ctx.transformStyle)
                }, [
                  (openBlock(), createBlock(resolveDynamicComponent(originVNode)))
                ], 4)
              ]),
              default: withCtx(() => [
                createElementVNode("div", {
                  innerHTML: _ctx.notice,
                  style: { "font-size": "14px", "line-height": "1.6", "color": "#333", "overflow-y": "auto", "margin-top": "10px", "background-color": "#fff" },
                  class: "notice-wrapper"
                }, null, 8, _hoisted_2$1),
                createVNode(_component_a_tabs, {
                  activeKey: _ctx.activeKey,
                  "onUpdate:activeKey": _cache[0] || (_cache[0] = ($event) => _ctx.activeKey = $event),
                  type: "line",
                  size: "small"
                }, {
                  default: withCtx(() => [
                    createVNode(_component_a_tab_pane, {
                      key: "1",
                      tab: "日志"
                    }, {
                      default: withCtx(() => [
                        createVNode(_component_LogViewer)
                      ]),
                      _: 1
                    }),
                    createVNode(_component_a_tab_pane, {
                      key: "2",
                      tab: "答题记录"
                    }, {
                      default: withCtx(() => [
                        createVNode(_component_AnswerViewer)
                      ]),
                      _: 1
                    }),
                    createVNode(_component_a_tab_pane, {
                      key: "3",
                      tab: "高级设置"
                    }, {
                      default: withCtx(() => [
                        createVNode(_component_SettingsPanel)
                      ]),
                      _: 1
                    })
                  ]),
                  _: 1
                }, 8, ["activeKey"]),
                _hoisted_3
              ]),
              _: 1
            }, 8, ["getContainer", "visible", "onOk", "bodyStyle"])
          ])
        ], 64);
      }
      const FloatingWindow = /* @__PURE__ */ _export_sfc(_sfc_main$1, [["render", _sfc_render], ["__scopeId", "data-v-95dbc5a8"]]);
      const scriptRel = /* @__PURE__ */ function detectScriptRel() {
        const relList = typeof document !== "undefined" && document.createElement("link").relList;
        return relList && relList.supports && relList.supports("modulepreload") ? "modulepreload" : "preload";
      }();
      const assetsURL = function(dep) {
        return "/" + dep;
      };
      const seen = {};
      const __vitePreload = function preload(baseModule, deps, importerUrl) {
        let promise = Promise.resolve();
        if (deps && deps.length > 0) {
          let allSettled2 = function(promises) {
            return Promise.all(
              promises.map(
                (p) => Promise.resolve(p).then(
                  (value) => ({ status: "fulfilled", value }),
                  (reason) => ({ status: "rejected", reason })
                )
              )
            );
          };
          document.getElementsByTagName("link");
          const cspNonceMeta = document.querySelector(
            "meta[property=csp-nonce]"
          );
          const cspNonce = (cspNonceMeta == null ? void 0 : cspNonceMeta.nonce) || (cspNonceMeta == null ? void 0 : cspNonceMeta.getAttribute("nonce"));
          promise = allSettled2(
            deps.map((dep) => {
              dep = assetsURL(dep);
              if (dep in seen) return;
              seen[dep] = true;
              const isCss = dep.endsWith(".css");
              const cssSelector = isCss ? '[rel="stylesheet"]' : "";
              if (document.querySelector(`link[href="${dep}"]${cssSelector}`)) {
                return;
              }
              const link = document.createElement("link");
              link.rel = isCss ? "stylesheet" : scriptRel;
              if (!isCss) {
                link.as = "script";
              }
              link.crossOrigin = "";
              link.href = dep;
              if (cspNonce) {
                link.setAttribute("nonce", cspNonce);
              }
              document.head.appendChild(link);
              if (isCss) {
                return new Promise((res, rej) => {
                  link.addEventListener("load", res);
                  link.addEventListener(
                    "error",
                    () => rej(new Error(`Unable to preload CSS for ${dep}`))
                  );
                });
              }
            })
          );
        }
        function handlePreloadError(err) {
          const e = new Event("vite:preloadError", {
            cancelable: true
          });
          e.payload = err;
          window.dispatchEvent(e);
          if (!e.defaultPrevented) {
            throw err;
          }
        }
        return promise.then((res) => {
          for (const item of res || []) {
            if (item.status !== "rejected") continue;
            handlePreloadError(item.reason);
          }
          return baseModule().catch(handlePreloadError);
        });
      };
      function sleep$2(ms) {
        return new Promise((resolve) => setTimeout(resolve, ms));
      }
      function handleError(message) {
        return {
          code: -1,
          // 使用 -1 表示请求失败（区别于服务器返回的 code）
          message
        };
      }
      async function getAnswer(question, options) {
        try {
          const settingsStore2 = useSettingsStore();
          const logStore2 = useLogStore();
          const searchInterval = settingsStore2.answerSettings.searchInterval;
          if (searchInterval > 0) {
            await sleep$2(searchInterval * 1e3);
          }
          const optionsText = options.map((option) => option.text);
          let type = 1;
          console.log(question.type);
          if (question.type.includes("多选题")) {
            type = 1;
          } else if (question.type.includes("判断题")) {
            type = 2;
          } else if (question.type.includes("填空题")) {
            type = 3;
          } else if (question.type.includes("简答题")) {
            type = 4;
          }
          const requestData = {
            type,
            question: question.title,
            options: optionsText,
            api: true
          };
          const t = get_t(requestData);
          const encryptedData = await encrypt(JSON.stringify(requestData), t);
          const headers = {
            "Accept": "*/*",
            "Content-Type": "application/json",
            "Connection": "keep-alive",
            "aka": t,
            // 添加签名密钥到请求头
            "referer": location.href,
            "X-Script-Version": SCRIPT_INFO.version
            // 动态获取脚本版本号
          };
          const token = settingsStore2.answerSettings.token;
          if (token && token.trim() !== "") {
            headers["Authorization"] = `Bearer ${token}`;
          }
          return new Promise((resolve) => {
            _GM_xmlhttpRequest({
              method: "POST",
              url: "https://www.aiask.site/v1/question/precise",
              headers,
              data: JSON.stringify({
                data: encryptedData
              }),
              timeout: 5e3,
              onload: async (response) => {
                try {
                  if (response.status >= 200 && response.status < 300) {
                    let data = JSON.parse(response.responseText);
                    if (data.encrypted) {
                      const decryptedData = await decrypt(data.data);
                      data = JSON.parse(decryptedData);
                    }
                    if (data.code === 200) {
                      settingsStore2.decreaseCardScore();
                      resolve(data);
                    } else {
                      resolve(handleError(`请求失败: ${data.message}`));
                    }
                  } else {
                    resolve(handleError(`请求失败: ${response.status}`));
                  }
                } catch (error) {
                  resolve(handleError(`解析响应失败: ${error.message}`));
                }
              },
              onerror: (error) => {
                resolve(handleError("请求出错"));
              },
              ontimeout: () => {
                resolve(handleError("请求超时"));
              }
            });
          });
        } catch (error) {
          console.error("获取答案失败：", error);
          return handleError(`请求异常: ${error.message}`);
        }
      }
      function calculateSimilarity(str1, str2) {
        if (!str1 || !str2) return 0;
        if (str1 === str2) return 100;
        const s1 = str1.replace(/\s+/g, "").toLowerCase();
        const s2 = str2.replace(/\s+/g, "").toLowerCase();
        if (s1 === s2) return 100;
        if (s1.length === 0 || s2.length === 0) return 0;
        const shorter = s1.length < s2.length ? s1 : s2;
        const longer = s1.length < s2.length ? s2 : s1;
        let matchCount = 0;
        const longerChars = longer.split("");
        const shorterChars = shorter.split("");
        for (const char of shorterChars) {
          const index = longerChars.indexOf(char);
          if (index !== -1) {
            matchCount++;
            longerChars.splice(index, 1);
          }
        }
        const similarity = matchCount / longer.length * 100;
        return Math.round(similarity);
      }
      function findMatchingOption(answerText, options, threshold) {
        if (!answerText || !options || options.length === 0) return null;
        let bestMatch = null;
        let highestSimilarity = 0;
        for (const option of options) {
          const similarity = calculateSimilarity(answerText, option.text);
          if (similarity > highestSimilarity) {
            highestSimilarity = similarity;
            bestMatch = option;
          }
        }
        if (highestSimilarity >= threshold) {
          return { option: bestMatch, similarity: highestSimilarity };
        }
        return null;
      }
      function parseQuestion$2(questionElement) {
        const type = questionElement.querySelector(".newZy_TItle").textContent;
        const titleDiv = questionElement.querySelector(".Zy_TItle .fontLabel");
        const titleHtml = titleDiv.innerHTML;
        return {
          type: type.replace(/[【】]/g, ""),
          title: clean(removeHtml$2(titleHtml))
        };
      }
      function parseOptions$2(questionElement) {
        const questionType = questionElement.querySelector(".newZy_TItle").textContent;
        const options = Array.from(questionElement.querySelectorAll(".Zy_ulTop li"));
        return options.map((option) => {
          const label = option.querySelector(".after");
          let valueElement;
          if (questionType.includes("多选题")) {
            valueElement = option.querySelector(".num_option_dx");
          } else if (questionType.includes("单选题") || questionType.includes("判断题")) {
            valueElement = option.querySelector(".num_option");
          }
          const value = valueElement ? valueElement.getAttribute("data") : "";
          return {
            text: label ? clean(removeHtml$2(label.innerHTML)).trim() : "",
            value
          };
        });
      }
      function getQuestionId$2(questionElement) {
        return questionElement.closest(".singleQuesId").getAttribute("data");
      }
      function removeHtml$2(html) {
        if (html == null) {
          return "";
        }
        return html.replace(/<((?!img|sub|sup|br)[^>]+)>/g, "").replace(/&nbsp;/g, " ").replace(/\s+/g, " ").replace(/<br\s*\/?>/g, "\n").replace(/<img.*?src="(.*?)".*?>/g, '<img src="$1"/>').trim();
      }
      function clean(str) {
        return str.replace(/^【.*?】\s*/, "").replace(/\s*（\d+\.\d+分）$/, "");
      }
      async function checkAnswer(question, options) {
        try {
          if (window._taskCancelled) {
            throw new Error("Task cancelled");
          }
          const logStore2 = useLogStore();
          const settingsStore2 = useSettingsStore();
          const formattedTitle = clean(question.title);
          if (window._taskCancelled) {
            throw new Error("Task cancelled");
          }
          if (window._taskCancelled) {
            throw new Error("Task cancelled");
          }
          const apiResponse = await getAnswer(question, options);
          if (window._taskCancelled) {
            throw new Error("Task cancelled");
          }
          if (apiResponse.code === -1) {
            logStore2.addLog(apiResponse.message, LOG_TYPES.ERROR);
            return {
              isCorrect: false,
              answer: null,
              message: apiResponse.message,
              status: "error",
              title: formattedTitle
            };
          }
          if (apiResponse.code === 200 && apiResponse.data && apiResponse.data.answer) {
            if (Array.isArray(apiResponse.data.answer) && apiResponse.data.answer.length > 0) {
              logStore2.addLog(`找到答案`, LOG_TYPES.SUCCESS);
            }
            const matchThreshold = settingsStore2.answerSettings.matchThreshold || 90;
            if (question.type.includes("多选题")) {
              const matchResults = apiResponse.data.answer.map((answerText) => {
                const exactMatch = options.find((opt) => opt.text === answerText);
                if (exactMatch) {
                  return { value: exactMatch.value, similarity: 100, text: answerText };
                }
                const fuzzyMatch = findMatchingOption(answerText, options, matchThreshold);
                if (fuzzyMatch) {
                  return { value: fuzzyMatch.option.value, similarity: fuzzyMatch.similarity, text: answerText };
                }
                return { value: null, similarity: 0, text: answerText };
              });
              const answerValues = matchResults.filter((r) => r.value).map((r) => r.value);
              const hasUnmatched = answerValues.length < apiResponse.data.answer.length;
              const originalAnswers = apiResponse.data.answer.join("、");
              const matchInfo = matchResults.map(
                (r) => r.value ? `${r.text}(${r.similarity}%)` : `${r.text}(未匹配)`
              ).join("、");
              if (answerValues.length === 0) {
                logStore2.addLog(`匹配失败: ${matchInfo}`, LOG_TYPES.WARNING);
                return {
                  isCorrect: false,
                  answer: null,
                  message: `找到答案但无法匹配选项：${originalAnswers}`,
                  originalAnswer: originalAnswers,
                  status: "partial",
                  title: formattedTitle
                };
              } else if (hasUnmatched) {
                logStore2.addLog(`部分匹配: ${matchInfo}`, LOG_TYPES.WARNING);
                return {
                  isCorrect: true,
                  answer: answerValues,
                  message: `原始答案：${originalAnswers}`,
                  originalAnswer: originalAnswers,
                  status: "partial",
                  title: formattedTitle
                };
              } else {
                logStore2.addLog(`匹配成功: ${matchInfo}`, LOG_TYPES.SUCCESS);
                return {
                  isCorrect: true,
                  answer: answerValues,
                  status: "success",
                  title: formattedTitle
                };
              }
            } else if (question.type.includes("单选题")) {
              const answerText = Array.isArray(apiResponse.data.answer) ? apiResponse.data.answer[0] : apiResponse.data.answer;
              let option = options.find((opt) => opt.text === answerText);
              let similarity = 100;
              if (!option) {
                const fuzzyMatch = findMatchingOption(answerText, options, matchThreshold);
                if (fuzzyMatch) {
                  option = fuzzyMatch.option;
                  similarity = fuzzyMatch.similarity;
                }
              }
              const answerValue = option ? option.value : null;
              if (!answerValue) {
                logStore2.addLog(`匹配失败: ${answerText}`, LOG_TYPES.WARNING);
                return {
                  isCorrect: false,
                  answer: null,
                  message: `找到答案但无法匹配选项：${answerText}`,
                  originalAnswer: answerText,
                  status: "partial",
                  title: formattedTitle
                };
              }
              logStore2.addLog(`匹配成功: ${answerText}(${similarity}%)`, LOG_TYPES.SUCCESS);
              return {
                isCorrect: true,
                answer: answerValue,
                status: "success",
                title: formattedTitle
              };
            } else if (question.type.includes("判断题")) {
              const answerText = (Array.isArray(apiResponse.data.answer) ? apiResponse.data.answer[0] : apiResponse.data.answer).trim();
              const correctWords = [
                "是",
                "对",
                "正确",
                "确定",
                "√",
                "对的",
                "是的",
                "正确的",
                "true",
                "True",
                "T",
                "yes",
                "1"
              ];
              const incorrectWords = [
                "非",
                "否",
                "错",
                "错误",
                "×",
                "X",
                "错的",
                "不对",
                "不正确的",
                "不正确",
                "不是",
                "不是的",
                "false",
                "False",
                "F",
                "no",
                "0"
              ];
              const sortedIncorrectWords = incorrectWords.sort((a, b) => b.length - a.length);
              const sortedCorrectWords = correctWords.sort((a, b) => b.length - a.length);
              let answerValue = null;
              for (const word of sortedIncorrectWords) {
                if (answerText.includes(word)) {
                  answerValue = "false";
                  break;
                }
              }
              if (answerValue === null) {
                for (const word of sortedCorrectWords) {
                  if (answerText.includes(word)) {
                    answerValue = "true";
                    break;
                  }
                }
              }
              if (answerValue === null) {
                return {
                  isCorrect: false,
                  answer: null,
                  message: `找到答案但无法解析：${answerText}`,
                  originalAnswer: answerText,
                  status: "partial",
                  title: formattedTitle
                };
              }
              return {
                isCorrect: true,
                answer: answerValue,
                status: "success",
                title: formattedTitle
              };
            } else if (question.type.includes("填空题")) {
              return {
                isCorrect: true,
                answer: apiResponse.data.answer,
                status: "success",
                title: formattedTitle
              };
            } else if (question.type.includes("简答题")) {
              const answerText = Array.isArray(apiResponse.data.answer) ? apiResponse.data.answer[0] : apiResponse.data.answer;
              return {
                isCorrect: true,
                answer: answerText,
                status: "success",
                title: formattedTitle
              };
            }
          } else {
            const message = apiResponse.message || "未找到答案";
            return {
              isCorrect: false,
              answer: null,
              message,
              status: "not_found",
              title: formattedTitle
            };
          }
        } catch (error) {
          if (error.message === "Task cancelled" || window._taskCancelled) {
            throw new Error("Task cancelled");
          }
          console.error("答案判断失败:", error);
          return {
            isCorrect: false,
            answer: null,
            message: error.message || "答案判断失败",
            status: "error",
            title: question.title
          };
        }
      }
      async function submitAnswer(questionElement, questionId, answers, contentWindow) {
        try {
          if (window._taskCancelled) return false;
          const questionType = questionElement.querySelector(".newZy_TItle").textContent;
          const hasAnswered = checkIfAlreadyAnswered(questionElement, questionId, questionType, answers);
          if (hasAnswered) {
            console.log("此题已正确作答，跳过提交");
            return true;
          }
          if (window._taskCancelled) return false;
          if (Array.isArray(answers)) {
            for (const answer of answers) {
              if (window._taskCancelled) return false;
              const optionLi = questionElement.querySelector(`li[qid="${questionId}"] .num_option_dx[data="${answer}"]`).closest("li");
              if (optionLi) {
                optionLi.click();
                await sleep$1(200);
              }
            }
          } else if (questionType.includes("单选题")) {
            const optionLi = questionElement.querySelector(`li[qid="${questionId}"][qtype="0"] .num_option[data="${answers}"]`).closest("li");
            if (optionLi) {
              optionLi.click();
            }
          } else if (questionType.includes("判断题")) {
            const dataValue = answers === "true" ? "true" : "false";
            const optionLi = questionElement.querySelector(`li[qid="${questionId}"][qtype="3"] .num_option[data="${dataValue}"]`).closest("li");
            if (optionLi) {
              optionLi.click();
            }
          }
          return true;
        } catch (error) {
          console.error("提交答案失败:", error);
          return false;
        }
      }
      function checkIfAlreadyAnswered(questionElement, questionId, questionType, answers) {
        try {
          if (questionType.includes("多选题")) {
            if (Array.isArray(answers)) {
              const selectedOptions = Array.from(
                questionElement.querySelectorAll(`li[qid="${questionId}"] .check_answer`)
              ).map((option) => option.closest("li").querySelector(".num_option_dx").getAttribute("data"));
              const allSelected = answers.every((answer) => selectedOptions.includes(answer));
              const noExtraSelections = selectedOptions.every((selected) => answers.includes(selected));
              return allSelected && noExtraSelections;
            }
          } else if (questionType.includes("单选题")) {
            const selectedOption = questionElement.querySelector(`li[qid="${questionId}"][qtype="0"] .check_answer`);
            if (selectedOption) {
              const selectedValue = selectedOption.closest("li").querySelector(".num_option").getAttribute("data");
              return selectedValue === answers;
            }
          } else if (questionType.includes("判断题")) {
            const dataValue = answers === "true" ? "true" : "false";
            const selectedOption = questionElement.querySelector(`li[qid="${questionId}"][qtype="3"] .check_answer`);
            if (selectedOption) {
              const selectedValue = selectedOption.closest("li").querySelector(".num_option").getAttribute("data");
              return selectedValue === dataValue;
            }
          }
          return false;
        } catch (error) {
          console.error("检查已答题状态失败:", error);
          return false;
        }
      }
      async function submitEssayAnswer(questionElement, questionId, answer, contentWindow) {
        try {
          if (window._taskCancelled) return false;
          const UE = (contentWindow == null ? void 0 : contentWindow.UE) || window.UE;
          if (!UE) {
            throw new Error("找不到UEditor实例");
          }
          const editorId = `answer${questionId}`;
          const ueEditor = UE.getEditor(editorId);
          if (ueEditor) {
            const formattedAnswer = Array.isArray(answer) ? answer[0] : answer;
            const hasAnswered = checkIfEssayAlreadyAnswered(ueEditor, formattedAnswer);
            if (hasAnswered) {
              console.log("简答题已正确作答，跳过提交");
              return true;
            }
            if (window._taskCancelled) return false;
            ueEditor.setContent(formattedAnswer);
            await sleep$1(200);
            return true;
          } else {
            console.error("找不到简答题编辑器:", editorId);
            return false;
          }
        } catch (error) {
          console.error("提交简答题答案失败:", error);
          return false;
        }
      }
      function checkIfEssayAlreadyAnswered(ueEditor, answer) {
        try {
          const currentContent = ueEditor.getContent().trim();
          if (currentContent && answer && currentContent === answer) {
            return true;
          }
          return false;
        } catch (error) {
          console.error("检查简答题答案状态失败:", error);
          return false;
        }
      }
      async function submitFillBlankAnswer(questionElement, questionId, answers, contentWindow) {
        try {
          if (window._taskCancelled) return false;
          const editors = questionElement.querySelectorAll('[id^="answerEditor"]');
          const UE = (contentWindow == null ? void 0 : contentWindow.UE) || window.UE;
          if (!UE) {
            throw new Error("找不到UEditor实例");
          }
          const hasAnswered = checkIfFillBlankAlreadyAnswered(editors, answers, contentWindow);
          if (hasAnswered) {
            console.log("填空题已正确作答，跳过提交");
            return true;
          }
          if (window._taskCancelled) return false;
          for (let i = 0; i < editors.length; i++) {
            if (window._taskCancelled) return false;
            const editor = editors[i];
            const answer = Array.isArray(answers) ? answers[i] : answers;
            const ueEditor = UE.getEditor(editor.id);
            ueEditor.setContent(answer);
            await sleep$1(100);
          }
          return true;
        } catch (error) {
          console.error("提交填空答案失败:", error);
          return false;
        }
      }
      function checkIfFillBlankAlreadyAnswered(editors, answers, contentWindow) {
        try {
          const UE = (contentWindow == null ? void 0 : contentWindow.UE) || window.UE;
          if (!UE) {
            throw new Error("找不到UEditor实例");
          }
          for (let i = 0; i < editors.length; i++) {
            const editor = editors[i];
            const answer = Array.isArray(answers) ? answers[i] : answers;
            const ueEditor = UE.getEditor(editor.id);
            const currentContent = ueEditor.getContent().trim();
            if (!currentContent || !answer || currentContent !== answer) {
              return false;
            }
          }
          return true;
        } catch (error) {
          console.error("检查填空题答案状态失败:", error);
          return false;
        }
      }
      function sleep$1(ms) {
        return new Promise((resolve) => setTimeout(resolve, ms));
      }
      let logStore$2;
      let answerStore$2;
      let settingsStore$2;
      function initStores$2() {
        if (!logStore$2) logStore$2 = useLogStore();
        if (!answerStore$2) answerStore$2 = useAnswerStore();
        if (!settingsStore$2) settingsStore$2 = useSettingsStore();
      }
      const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
      async function waitForPageLoad() {
        return new Promise((resolve) => {
          if (document.readyState === "complete") {
            resolve();
          } else {
            const checkState = async () => {
              if (document.readyState === "complete") {
                resolve();
              } else {
                await sleep(500);
                checkState();
              }
            };
            checkState();
          }
        });
      }
      async function waitForElement(doc, selector, maxAttempts = 20) {
        return new Promise((resolve) => {
          let attempts = 0;
          const checkElement = async () => {
            const element = doc.querySelector(selector);
            if (element) {
              resolve(element);
            } else if (attempts < maxAttempts) {
              attempts++;
              await sleep(500);
              checkElement();
            } else {
              resolve(null);
            }
          };
          checkElement();
        });
      }
      async function waitForIframeLoad(iframe) {
        return new Promise((resolve) => {
          if (!iframe.src || iframe.src === "about:blank" || iframe.src.includes("javascript:")) {
            resolve(null);
            return;
          }
          const checkIframe = async () => {
            var _a;
            try {
              const doc = iframe.contentDocument || ((_a = iframe.contentWindow) == null ? void 0 : _a.document);
              if (doc) {
                if (doc.readyState === "complete") {
                  resolve(doc);
                } else {
                  await sleep(500);
                  checkIframe();
                }
              } else {
                await sleep(500);
                checkIframe();
              }
            } catch (error) {
              resolve(null);
            }
          };
          checkIframe();
        });
      }
      async function handleMedia(mediaElement, mediaType) {
        initStores$2();
        return new Promise(async (resolve) => {
          try {
            logStore$2.addLog(`正在处理一个视频/音频任务，请耐心等待`, LOG_TYPES.INFO);
            const { playbackRate } = settingsStore$2.videoSettings;
            mediaElement.playbackRate = playbackRate;
            const unwatch = watch(
              () => settingsStore$2.videoSettings.playbackRate,
              (newRate) => {
                if (mediaElement && !mediaElement.ended) {
                  mediaElement.playbackRate = newRate;
                  logStore$2.addLog(`已将播放速率更改为 ${newRate} 倍速`, LOG_TYPES.INFO);
                }
              }
            );
            mediaElement.muted = true;
            await mediaElement.pause();
            try {
              await mediaElement.play();
            } catch (playError) {
              console.error("媒体播放初始化失败:", playError);
              logStore$2.addLog(`视频被禁止倍速播放，如能继续播放请忽略`, LOG_TYPES.ERROR);
              setTimeout(async () => {
                try {
                  await mediaElement.play();
                } catch (retryError) {
                  console.error("重试播放失败:", retryError);
                }
              }, 1e3);
            }
            let lastPlayTime = Date.now();
            let isPlaying = true;
            const monitorPlayback = setInterval(() => {
              if (window._taskCancelled) {
                clearInterval(monitorPlayback);
                mediaElement.removeEventListener("pause", mediaElement._handlePause);
                mediaElement.removeEventListener("ended", mediaElement._handleEnded);
                unwatch();
                resolve();
                return;
              }
              if (!mediaElement.ended && !mediaElement.paused) {
                lastPlayTime = Date.now();
                isPlaying = true;
              } else if (!mediaElement.ended && mediaElement.paused && isPlaying) {
                const currentTime = Date.now();
                if (currentTime - lastPlayTime > 1e3) {
                  logStore$2.addLog(`已被暂停，尝试继续播放`, LOG_TYPES.WARNING);
                  mediaElement.play().catch((error) => {
                    console.error(`自动继续播放失败:`, error);
                  });
                }
                isPlaying = false;
              }
            }, 1e3);
            const handlePause = async () => {
              if (window._taskCancelled) return;
              try {
                await mediaElement.play();
              } catch (error) {
                console.error(`${mediaType}重新播放失败:`, error);
                setTimeout(async () => {
                  if (window._taskCancelled) return;
                  try {
                    await mediaElement.play();
                  } catch (retryError) {
                    console.error(`重试播放失败:`, retryError);
                  }
                }, 1e3);
              }
            };
            const handleEnded = () => {
              clearInterval(monitorPlayback);
              mediaElement.removeEventListener("pause", mediaElement._handlePause);
              mediaElement.removeEventListener("ended", mediaElement._handleEnded);
              unwatch();
              resolve();
              logStore$2.addLog(`处理完成`, LOG_TYPES.SUCCESS);
            };
            mediaElement._handlePause = handlePause;
            mediaElement._handleEnded = handleEnded;
            mediaElement._monitorInterval = monitorPlayback;
            mediaElement._unwatchFn = unwatch;
            mediaElement.addEventListener("pause", handlePause);
            mediaElement.addEventListener("ended", handleEnded);
          } catch (error) {
            console.error(`播放${mediaType}时出错:`, error);
            resolve();
          }
        });
      }
      async function handleDocument(panviewElement) {
        initStores$2();
        return new Promise(async (resolve) => {
          var _a;
          try {
            logStore$2.addLog(`正在处理一个文档任务，滚动到底部`, LOG_TYPES.INFO);
            if (window._taskCancelled) {
              resolve();
              return;
            }
            let scrollElements = [panviewElement];
            if (panviewElement.tagName === "IFRAME") {
              try {
                const iframeDoc = panviewElement.contentDocument || ((_a = panviewElement.contentWindow) == null ? void 0 : _a.document);
                if (iframeDoc) {
                  const possibleScrollers = [
                    iframeDoc.documentElement,
                    iframeDoc.body,
                    iframeDoc.querySelector(".doc-container"),
                    iframeDoc.querySelector(".document"),
                    iframeDoc.querySelector('[class*="scroll"]'),
                    iframeDoc.querySelector('[class*="content"]')
                  ].filter((el) => el);
                  scrollElements = possibleScrollers.length > 0 ? possibleScrollers : [iframeDoc.body];
                }
              } catch (e) {
                console.warn("无法访问iframe内容，使用iframe本身");
              }
            }
            let scrolled = false;
            for (const scrollElement of scrollElements) {
              if (!scrollElement) continue;
              const scrollHeight = scrollElement.scrollHeight;
              const clientHeight = scrollElement.clientHeight;
              const scrollDistance = scrollHeight - clientHeight;
              if (scrollDistance > 0) {
                const scrollStep = Math.ceil(scrollDistance / 20);
                let currentScroll = scrollElement.scrollTop;
                while (currentScroll < scrollHeight) {
                  if (window._taskCancelled) {
                    resolve();
                    return;
                  }
                  currentScroll = Math.min(currentScroll + scrollStep, scrollHeight);
                  scrollElement.scrollTop = currentScroll;
                  await sleep(100);
                }
                scrolled = true;
              } else {
                scrollElement.scrollTop = scrollHeight;
              }
            }
            if (scrolled) {
              logStore$2.addLog(`文档阅读成功`, LOG_TYPES.SUCCESS);
            }
            if (window._taskCancelled) {
              resolve();
              return;
            }
            resolve();
            logStore$2.addLog(`文档处理完成`, LOG_TYPES.SUCCESS);
          } catch (error) {
            console.error(`处理文档时出错:`, error);
            logStore$2.addLog(`文档处理出错: ${error.message}`, LOG_TYPES.ERROR);
            resolve();
          }
        });
      }
      async function checkForMedia(iframe) {
        initStores$2();
        return new Promise(async (resolve, reject) => {
          try {
            if (window._taskCancelled) {
              resolve();
              return;
            }
            const signal = window._cancelController.signal;
            signal.addEventListener("abort", () => {
              resolve();
            });
            const doc = await waitForIframeLoad(iframe);
            if (!doc || window._taskCancelled) {
              resolve();
              return;
            }
            if (window._taskCancelled) {
              resolve();
              return;
            }
            if (iframe.src.includes("api/work")) {
              if (window._taskCancelled) {
                resolve();
                return;
              }
              try {
                const { decrypt: decrypt2 } = await __vitePreload(async () => {
                  const { decrypt: decrypt3 } = await module.import('./fontDecrypt-BfNMxRKv-DJbPwEQi.js');
                  return { decrypt: decrypt3 };
                }, true ? void 0 : void 0);
                if (window._taskCancelled) {
                  resolve();
                  return;
                }
                decrypt2(doc);
                logStore$2.addLog("字体解密完成", LOG_TYPES.SUCCESS);
              } catch (error) {
                logStore$2.addLog(`字体解密失败: ${error.message}`, LOG_TYPES.ERROR);
                if (window._taskCancelled) {
                  resolve();
                  return;
                }
              }
              if (window._taskCancelled) {
                resolve();
                return;
              }
              try {
                await handleWork$1(doc);
              } catch (error) {
                if (error.message === "Task cancelled" || window._taskCancelled) {
                  logStore$2.addLog("答题任务已取消", LOG_TYPES.WARNING);
                } else {
                  logStore$2.addLog(`处理作业时出错: ${error.message}`, LOG_TYPES.ERROR);
                }
              }
              resolve();
              return;
            }
            if (window._taskCancelled) {
              resolve();
              return;
            }
            if (settingsStore$2.automationSettings.onlyDoQuestions && !iframe.src.includes("api/work") && !iframe.src.includes("exam")) {
              resolve();
              return;
            }
            const hasVideo = iframe.src.includes("video");
            const hasAudio = iframe.src.includes("audio");
            if ((hasVideo || hasAudio) && !window._taskCancelled) {
              const mediaType = hasVideo ? "video" : "audio";
              const mediaElement = await waitForElement(doc, mediaType);
              if (window._taskCancelled) {
                resolve();
                return;
              }
              if (mediaElement) {
                await handleMedia(mediaElement, mediaType);
              }
            }
            const docKeywords = ["ppt", "doc", "pptx", "docx", "pdf", "txt", "ppt文档"];
            const hasDocument = docKeywords.some((keyword) => iframe.src.includes(keyword));
            if (hasDocument && !window._taskCancelled) {
              const panviewElement = await waitForElement(doc, "#panView");
              if (window._taskCancelled) {
                resolve();
                return;
              }
              if (panviewElement) {
                await handleDocument(panviewElement);
              }
            }
            if (window._taskCancelled) {
              resolve();
              return;
            }
            resolve();
          } catch (error) {
            console.error("处理iframe时出错:", error);
            if (error.message === "Task cancelled" || window._taskCancelled) {
              resolve();
            } else {
              resolve();
            }
          }
        });
      }
      async function handleWork$1(doc) {
        initStores$2();
        if (!settingsStore$2.cardInfo || settingsStore$2.cardInfo.status !== 1) {
          logStore$2.addLog("授权码未配置或已失效，跳过答题", LOG_TYPES.ERROR);
          logStore$2.addLog("请在「高级设置」中配置有效的授权码", LOG_TYPES.WARNING);
          return;
        }
        if (window._taskCancelled) return;
        const questions = doc.querySelectorAll(".TiMu");
        if (!questions.length) return;
        const contentWindow = doc.defaultView || doc.parentWindow;
        if (!contentWindow) {
          logStore$2.addLog(`无法获取iframe的contentWindow`, LOG_TYPES.ERROR);
          return;
        }
        logStore$2.addLog(`正在完成一个作业，共${questions.length}道题目`, LOG_TYPES.INFO);
        let correctCount = 0;
        for (const [index, question] of questions.entries()) {
          if (window._taskCancelled) {
            logStore$2.addLog("答题任务被终止", LOG_TYPES.WARNING);
            break;
          }
          try {
            if (window._taskCancelled) {
              logStore$2.addLog("答题任务被终止", LOG_TYPES.WARNING);
              break;
            }
            const { type, title } = parseQuestion$2(question);
            const questionId = getQuestionId$2(question);
            const options = parseOptions$2(question);
            logStore$2.addLog(`正在完成第${index + 1}题，题型：${type}`, LOG_TYPES.INFO);
            if (window._taskCancelled) {
              logStore$2.addLog("答题任务被终止", LOG_TYPES.WARNING);
              break;
            }
            const { isCorrect, answer, title: fullTitle, message, status, originalAnswer } = await checkAnswer({ type, title }, options);
            if (window._taskCancelled) {
              logStore$2.addLog("答题任务被终止", LOG_TYPES.WARNING);
              break;
            }
            const displayAnswer = isCorrect ? answer : originalAnswer || message;
            answerStore$2.addAnswer(fullTitle, displayAnswer, type, status, originalAnswer);
            if (!isCorrect) {
              if (status === "error") {
                continue;
              } else if (status === "not_found") {
                logStore$2.addLog(`未找到答案，跳过此题`, LOG_TYPES.WARNING);
                continue;
              } else {
                continue;
              }
            } else {
              correctCount++;
            }
            if (window._taskCancelled) {
              logStore$2.addLog("答题任务被终止", LOG_TYPES.WARNING);
              break;
            }
            if (type.includes("单选题")) {
              if (window._taskCancelled) {
                logStore$2.addLog("答题任务被终止", LOG_TYPES.WARNING);
                break;
              }
              await handleSingleChoice$2(question, questionId, answer, contentWindow);
            } else if (type.includes("多选题")) {
              if (window._taskCancelled) {
                logStore$2.addLog("答题任务被终止", LOG_TYPES.WARNING);
                break;
              }
              await handleMultipleChoice$2(question, questionId, answer, contentWindow);
            } else if (type.includes("判断题")) {
              if (window._taskCancelled) {
                logStore$2.addLog("答题任务被终止", LOG_TYPES.WARNING);
                break;
              }
              await handleJudgment$2(question, questionId, answer, contentWindow);
            } else if (type.includes("填空题")) {
              if (window._taskCancelled) {
                logStore$2.addLog("答题任务被终止", LOG_TYPES.WARNING);
                break;
              }
              await handleFillBlank$2(question, questionId, answer, contentWindow);
            } else if (type.includes("简答题")) {
              if (window._taskCancelled) {
                logStore$2.addLog("答题任务被终止", LOG_TYPES.WARNING);
                break;
              }
              await handleEssay$2(question, questionId, answer, contentWindow);
            }
            if (window._taskCancelled) {
              logStore$2.addLog("答题过程中任务被终止", LOG_TYPES.WARNING);
              break;
            }
          } catch (error) {
            if (window._taskCancelled || error.message === "Task cancelled") {
              logStore$2.addLog("答题任务被终止", LOG_TYPES.WARNING);
              break;
            }
            logStore$2.addLog(`处理题目出错: ${error.message}`, LOG_TYPES.ERROR);
          }
        }
        if (window._taskCancelled) {
          return;
        }
        const correctRate = correctCount / questions.length * 100;
        logStore$2.addLog(`答题完成，正确率: ${correctRate.toFixed(2)}%`, LOG_TYPES.SUCCESS);
        const shouldAutoSubmit = settingsStore$2.submitSettings.autoSubmitChapter && correctRate >= settingsStore$2.submitSettings.correctRateThreshold;
        if (shouldAutoSubmit) {
          try {
            if (window._taskCancelled) {
              logStore$2.addLog("任务已取消，不进行提交", LOG_TYPES.WARNING);
              return;
            }
            logStore$2.addLog(`自动提交作业`, LOG_TYPES.INFO);
            contentWindow.btnBlueSubmit();
            await sleep(1e3);
            const submitButton = document.querySelector("#popok");
            if (submitButton) {
              submitButton.click();
              logStore$2.addLog("已点击提交按钮", LOG_TYPES.INFO);
            }
            logStore$2.addLog(`作业提交成功`, LOG_TYPES.SUCCESS);
          } catch (error) {
            if (window._taskCancelled) {
              logStore$2.addLog("提交操作被取消", LOG_TYPES.WARNING);
              return;
            }
            logStore$2.addLog(`提交出错: ${error.message}`, LOG_TYPES.ERROR);
          }
        } else {
          if (settingsStore$2.answerSettings.autoSaveAnswer) {
            try {
              if (typeof contentWindow.noSubmit === "function") {
                const iframes = document.querySelectorAll("iframe");
                iframes.forEach((iframe) => {
                  if (iframe.contentWindow === contentWindow) {
                    iframe.removeEventListener("load", handleIframeLoad);
                    logStore$2.addLog("已移除iframe监听器，防止重复处理", LOG_TYPES.INFO);
                  }
                });
                logStore$2.addLog("正在保存章节答案...", LOG_TYPES.INFO);
                contentWindow.noSubmit();
                await sleep(500);
                logStore$2.addLog("章节答案已保存", LOG_TYPES.SUCCESS);
              }
            } catch (error) {
              logStore$2.addLog(`保存章节答案失败: ${error.message}`, LOG_TYPES.ERROR);
            }
          } else {
            logStore$2.addLog("已完成答题，请手动保存章节答案", LOG_TYPES.INFO);
          }
          if (!settingsStore$2.submitSettings.autoSubmitChapter) {
            logStore$2.addLog(`自动提交已禁用，请手动提交`, LOG_TYPES.INFO);
          } else {
            logStore$2.addLog(`正确率不足，不进行提交，请检查答案后手动提交`, LOG_TYPES.WARNING);
          }
        }
        if (!settingsStore$2.submitSettings.autoSubmitChapter) {
          try {
            if (window._taskCancelled) {
              logStore$2.addLog("任务已取消，不执行阻止提交操作", LOG_TYPES.WARNING);
              return;
            }
            if (contentWindow && contentWindow.document && contentWindow.document.forms.length > 0) {
              const forms = contentWindow.document.forms;
              for (let i = 0; i < forms.length; i++) {
                const originalSubmit = forms[i].submit;
                forms[i].submit = function() {
                  logStore$2.addLog("已阻止自动提交", LOG_TYPES.WARNING);
                  return false;
                };
              }
              logStore$2.addLog("已禁用自动提交功能", LOG_TYPES.SUCCESS);
              if (window._processedIframes) {
                const iframes = document.querySelectorAll("iframe");
                iframes.forEach((iframe) => {
                  if (iframe.contentWindow === contentWindow) {
                    window._processedIframes.delete(iframe);
                    logStore$2.addLog("已移除iframe处理记录，防止重复处理", LOG_TYPES.INFO);
                  }
                });
              }
            }
          } catch (error) {
            if (window._taskCancelled) {
              logStore$2.addLog("任务已取消", LOG_TYPES.WARNING);
              return;
            }
            logStore$2.addLog(`执行不提交操作失败: ${error.message}`, LOG_TYPES.WARNING);
          }
        }
      }
      async function handleSingleChoice$2(question, questionId, answer, contentWindow) {
        initStores$2();
        if (window._taskCancelled) return;
        try {
          if (window._taskCancelled) return;
          if (await submitAnswer(question, questionId, answer, contentWindow)) {
            if (window._taskCancelled) return;
            logStore$2.addLog("单选题已完成", LOG_TYPES.SUCCESS);
          }
        } catch (error) {
          if (window._taskCancelled) return;
          logStore$2.addLog("单选题答题失败", LOG_TYPES.ERROR);
        }
      }
      async function handleMultipleChoice$2(question, questionId, answers, contentWindow) {
        initStores$2();
        if (window._taskCancelled) return;
        try {
          if (window._taskCancelled) return;
          if (await submitAnswer(question, questionId, answers, contentWindow)) {
            if (window._taskCancelled) return;
            logStore$2.addLog("多选题已完成", LOG_TYPES.SUCCESS);
          }
        } catch (error) {
          if (window._taskCancelled) return;
          logStore$2.addLog("多选题答题失败", LOG_TYPES.ERROR);
        }
      }
      async function handleJudgment$2(question, questionId, answer, contentWindow) {
        initStores$2();
        if (window._taskCancelled) return;
        try {
          if (window._taskCancelled) return;
          if (await submitAnswer(question, questionId, answer, contentWindow)) {
            if (window._taskCancelled) return;
            logStore$2.addLog("判断题已完成", LOG_TYPES.SUCCESS);
          }
        } catch (error) {
          if (window._taskCancelled) return;
          logStore$2.addLog("判断题答题失败", LOG_TYPES.ERROR);
        }
      }
      async function handleFillBlank$2(question, questionId, answer, contentWindow) {
        initStores$2();
        if (window._taskCancelled) return;
        try {
          if (window._taskCancelled) return;
          if (await submitFillBlankAnswer(question, questionId, answer, contentWindow)) {
            if (window._taskCancelled) return;
            logStore$2.addLog("填空题已完成", LOG_TYPES.SUCCESS);
          }
        } catch (error) {
          if (window._taskCancelled) return;
          logStore$2.addLog("填空题答题失败", LOG_TYPES.ERROR);
        }
      }
      async function handleEssay$2(question, questionId, answer, contentWindow) {
        initStores$2();
        if (window._taskCancelled) return;
        try {
          if (window._taskCancelled) return;
          if (await submitEssayAnswer(question, questionId, answer, contentWindow)) {
            if (window._taskCancelled) return;
            logStore$2.addLog("简答题已完成", LOG_TYPES.SUCCESS);
          }
        } catch (error) {
          if (window._taskCancelled) return;
          logStore$2.addLog("简答题答题失败", LOG_TYPES.ERROR);
        }
      }
      async function getAllIframes(doc, processedFrames = /* @__PURE__ */ new Set()) {
        var _a;
        initStores$2();
        if (window._taskCancelled || !doc) return [];
        await waitForPageLoad();
        const iframes = Array.from(doc.getElementsByTagName("iframe"));
        const allIframes = [];
        for (const iframe of iframes) {
          if (window._taskCancelled) break;
          if (processedFrames.has(iframe)) {
            continue;
          }
          processedFrames.add(iframe);
          const parentClass = ((_a = iframe.parentElement) == null ? void 0 : _a.className) || "";
          if (parentClass.includes("ans-job-finished") && settingsStore$2.automationSettings.skipFinishedTasks) {
            continue;
          }
          allIframes.push(iframe);
          try {
            const iframeDoc = await waitForIframeLoad(iframe);
            if (iframeDoc) {
              await waitForPageLoad();
              const innerIframes = await getAllIframes(iframeDoc, processedFrames);
              allIframes.push(...innerIframes);
            }
          } catch (error) {
            console.error("获取子iframe失败:", error);
          }
        }
        return allIframes;
      }
      function addIframeLoadListener(iframe) {
        iframe.removeEventListener("load", handleIframeLoad);
        iframe.addEventListener("load", handleIframeLoad);
      }
      function cancelCurrentTask() {
        initStores$2();
        window._taskCancelled = true;
        window._isProcessing = false;
        if (window._cancelController) {
          try {
            window._cancelController.abort("Task cancelled");
            window._cancelController = new AbortController();
          } catch (e) {
          }
        }
        try {
          const mediaElements = document.querySelectorAll("video, audio");
          mediaElements.forEach((media) => {
            try {
              if (!media.paused) {
                media.pause();
              }
              if (media._handlePause) {
                media.removeEventListener("pause", media._handlePause);
                delete media._handlePause;
              }
              if (media._handleEnded) {
                media.removeEventListener("ended", media._handleEnded);
                delete media._handleEnded;
              }
              if (media._monitorInterval) {
                clearInterval(media._monitorInterval);
                delete media._monitorInterval;
              }
              if (media._unwatchFn) {
                media._unwatchFn();
                delete media._unwatchFn;
              }
            } catch (e) {
            }
          });
        } catch (e) {
        }
        if (answerStore$2) {
          answerStore$2.clearAnswers();
          logStore$2.addLog("已清空答题记录", LOG_TYPES.INFO);
        }
        if (window.gc) {
          try {
            window.gc();
          } catch (e) {
          }
        }
        logStore$2.addLog("已终止之前的任务", LOG_TYPES.WARNING);
      }
      function checkCancelled() {
        if (window._taskCancelled) {
          logStore$2.addLog("检测到任务已被取消，终止处理", LOG_TYPES.WARNING);
          throw new Error("Task cancelled");
        }
      }
      async function checkAndNavigateToNextChapter() {
        initStores$2();
        try {
          if (window._taskCancelled) {
            logStore$2.addLog("任务已被取消，不执行章节跳转", LOG_TYPES.WARNING);
            return;
          }
          if (settingsStore$2.automationSettings.autoNextChapter) {
            const nextButton = document.querySelector(".nextChapter") || document.querySelector(".next_chapternew") || document.querySelector('[title="下一章"]');
            if (nextButton) {
              logStore$2.addLog("所有任务完成，准备进入下一章节", LOG_TYPES.INFO);
              try {
                const signal = window._cancelController.signal;
                if (window._taskCancelled) {
                  logStore$2.addLog("任务已取消，取消跳转到下一章", LOG_TYPES.WARNING);
                  return;
                }
                await Promise.race([
                  sleep(5e3),
                  new Promise((_, reject) => {
                    signal.addEventListener("abort", () => reject(new Error("Wait aborted")));
                  })
                ]);
                if (window._taskCancelled) {
                  logStore$2.addLog("任务已取消，取消跳转到下一章", LOG_TYPES.WARNING);
                  return;
                }
                nextButton.click();
                logStore$2.addLog("已跳转到下一章节", LOG_TYPES.SUCCESS);
              } catch (error) {
                if (window._taskCancelled || error.message === "Wait aborted") {
                  logStore$2.addLog("章节跳转已取消", LOG_TYPES.WARNING);
                } else {
                  logStore$2.addLog(`章节跳转出错: ${error.message}`, LOG_TYPES.ERROR);
                }
                return;
              }
            } else {
              logStore$2.addLog("当前已是最后一章，所有任务已完成", LOG_TYPES.SUCCESS);
            }
          }
        } catch (error) {
          if (error.message === "Task cancelled" || window._taskCancelled) {
            logStore$2.addLog("跳转操作已取消", LOG_TYPES.WARNING);
          } else {
            console.error("跳转到下一章节时出错:", error);
            logStore$2.addLog(`跳转到下一章节出错: ${error.message}`, LOG_TYPES.ERROR);
          }
        }
      }
      function handlePageChange() {
        logStore$2.addLog("页面切换，终止当前任务并重新处理页面", LOG_TYPES.INFO);
        cancelCurrentTask();
        clearAllIframeEventListeners();
        if (window._processedIframes) {
          window._processedIframes.clear();
        }
        if (window._cancelController) {
          window._cancelController.abort("Page changed");
          window._cancelController = new AbortController();
        }
        window._taskCancelled = true;
        window._isProcessing = false;
        setTimeout(() => {
          window._taskCancelled = false;
          window._isProcessing = false;
          try {
            const mediaElements = document.querySelectorAll("video, audio");
            mediaElements.forEach((media) => {
              try {
                media.pause();
                media.removeEventListener("pause", media._handlePause);
                media.removeEventListener("ended", media._handleEnded);
              } catch (e) {
              }
            });
          } catch (e) {
          }
          processPage$2();
        }, 3e3);
      }
      function clearAllIframeEventListeners() {
        var _a;
        try {
          const allIframes = Array.from(document.getElementsByTagName("iframe"));
          for (const iframe of allIframes) {
            iframe.removeEventListener("load", handleIframeLoad);
            try {
              const doc = iframe.contentDocument || ((_a = iframe.contentWindow) == null ? void 0 : _a.document);
              if (doc) {
                const forms = doc.forms;
                if (forms) {
                  for (let i = 0; i < forms.length; i++) {
                    if (forms[i]._originalSubmit) {
                      forms[i].submit = forms[i]._originalSubmit;
                      delete forms[i]._originalSubmit;
                    }
                  }
                }
              }
            } catch (e) {
            }
          }
        } catch (error) {
          console.error("清理iframe事件监听器时出错:", error);
        }
      }
      function setupUrlChangeListener() {
        window._lastUrl = window.location.href;
        window.addEventListener("popstate", () => {
          if (window._lastUrl !== window.location.href) {
            window._lastUrl = window.location.href;
            handlePageChange();
          }
        });
        const urlObserver = new MutationObserver(() => {
          if (window._lastUrl !== window.location.href) {
            window._lastUrl = window.location.href;
            logStore$2.addLog("检测到URL变化，终止当前任务", LOG_TYPES.INFO);
            handlePageChange();
          }
        });
        urlObserver.observe(document, {
          subtree: true,
          childList: true,
          attributes: true,
          characterData: false
        });
        window._urlObserver = urlObserver;
        window.addEventListener("hashchange", () => {
          if (window._lastUrl !== window.location.href) {
            window._lastUrl = window.location.href;
            logStore$2.addLog("检测到hash变化，终止当前任务", LOG_TYPES.INFO);
            handlePageChange();
          }
        });
      }
      async function processPage$2() {
        try {
          initStores$2();
          const currentUrl = window.location.href;
          if (!currentUrl.includes("&mooc2=1") && !currentUrl.includes("?mooc2=1")) {
            const separator = currentUrl.includes("?") ? "&" : "?";
            const newUrl = `${currentUrl}${separator}mooc2=1`;
            window.location.href = newUrl;
            return;
          }
          if (!window._processedIframes) {
            window._processedIframes = /* @__PURE__ */ new Set();
          }
          if (!window._urlObserver) {
            setupUrlChangeListener();
          }
          if (!window._cancelController) {
            window._cancelController = new AbortController();
          }
          if (window._isProcessing) {
            logStore$2.addLog("检测到有正在进行的任务，先终止它", LOG_TYPES.WARNING);
            cancelCurrentTask();
            await sleep(1e3);
          }
          window._taskCancelled = false;
          window._isProcessing = true;
          if (answerStore$2) {
            answerStore$2.clearAnswers();
          }
          logStore$2.addLog("正在解析任务", LOG_TYPES.INFO);
          await waitForPageLoad();
          checkCancelled();
          const allIframes = await getAllIframes(document);
          checkCancelled();
          for (const iframe of allIframes) {
            if (window._taskCancelled) {
              logStore$2.addLog("任务已被取消，终止处理", LOG_TYPES.WARNING);
              break;
            }
            if (!window._processedIframes.has(iframe)) {
              window._processedIframes.add(iframe);
              await processIframe(iframe);
              if (window._taskCancelled) {
                logStore$2.addLog("任务已被取消，终止处理", LOG_TYPES.WARNING);
                break;
              }
            }
          }
          if (window._taskCancelled) {
            return;
          }
          await checkAndNavigateToNextChapter();
          window.addEventListener("beforeunload", () => {
            cancelCurrentTask();
          });
        } catch (error) {
          if (error.message === "Task cancelled") {
            if (logStore$2) logStore$2.addLog("页面处理已取消", LOG_TYPES.WARNING);
          } else {
            console.error("处理页面时出错:", error);
          }
        } finally {
          if (window._taskCancelled) {
            window._isProcessing = false;
          }
        }
      }
      async function handleIframeLoad(event) {
        initStores$2();
        if (window._taskCancelled) return;
        const iframe = event.target;
        try {
          if (iframe.src && iframe.src.includes("api/work")) {
            iframe.removeEventListener("load", handleIframeLoad);
            return;
          }
        } catch (e) {
        }
        logStore$2.addLog("检测到iframe加载，终止当前任务", LOG_TYPES.INFO);
        handlePageChange();
      }
      async function processIframe(iframe) {
        var _a;
        initStores$2();
        try {
          if (window._taskCancelled) {
            logStore$2.addLog("任务已被终止，不处理此iframe", LOG_TYPES.WARNING);
            return;
          }
          const parentClass = ((_a = iframe.parentElement) == null ? void 0 : _a.className) || "";
          if (parentClass.includes("ans-job-finished") && settingsStore$2.automationSettings.skipFinishedTasks) {
            logStore$2.addLog("发现一个已完成任务点", LOG_TYPES.SUCCESS);
            return;
          }
          addIframeLoadListener(iframe);
          if (window._taskCancelled) {
            logStore$2.addLog("任务已被终止，不处理媒体", LOG_TYPES.WARNING);
            return;
          }
          await checkForMedia(iframe);
        } catch (error) {
          if (window._taskCancelled || error.message === "Task cancelled") {
            logStore$2.addLog("iframe处理已取消", LOG_TYPES.WARNING);
          } else {
            console.error("处理iframe时出错:", error);
          }
        }
      }
      function handleChapterPage() {
        initStores$2();
        return processPage$2();
      }
      let logStore$1 = null;
      let answerStore$1 = null;
      let settingsStore$1 = null;
      function initStores$1() {
        if (!logStore$1) logStore$1 = useLogStore();
        if (!answerStore$1) answerStore$1 = useAnswerStore();
        if (!settingsStore$1) settingsStore$1 = useSettingsStore();
      }
      function removeHtml$1(html) {
        if (html == null) {
          return "";
        }
        return html.replace(/<((?!img|sub|sup|br)[^>]+)>/g, "").replace(/&nbsp;/g, " ").replace(/\s+/g, " ").replace(/<br\s*\/?>/g, "\n").replace(/<img.*?src="(.*?)".*?>/g, '<img src="$1"/>').trim();
      }
      function parseQuestion$1(questionElement) {
        try {
          const titleElement = questionElement.querySelector(".mark_name");
          const typeElement = questionElement.getAttribute("typeName");
          if (!titleElement) return { type: "", title: "" };
          const titleHtml = titleElement.innerHTML;
          let title = titleHtml.replace(/^\d+\./, "").replace(/<span[^>]*>\([^)]+\)<\/span>/g, "").trim();
          title = removeHtml$1(title);
          return {
            type: typeElement || "",
            title
          };
        } catch (error) {
          return { type: "", title: "" };
        }
      }
      function parseOptions$1(questionElement) {
        try {
          const type = questionElement.getAttribute("typeName");
          const questionId = questionElement.getAttribute("data");
          const stemAnswer = questionElement.querySelector(".stem_answer");
          if (!stemAnswer) return [];
          let options = [];
          if (type === "单选题") {
            options = Array.from(stemAnswer.querySelectorAll(".clearfix.answerBg")).map((option) => {
              const valueElement = option.querySelector(".num_option");
              const textElement = option.querySelector(".answer_p");
              const value = valueElement ? valueElement.getAttribute("data") : "";
              const text = textElement ? removeHtml$1(textElement.innerHTML) : "";
              return { value, text };
            });
          } else if (type === "多选题") {
            options = Array.from(stemAnswer.querySelectorAll(".clearfix.answerBg")).map((option) => {
              const valueElement = option.querySelector(".num_option_dx");
              const textElement = option.querySelector(".answer_p");
              const value = valueElement ? valueElement.getAttribute("data") : "";
              const text = textElement ? removeHtml$1(textElement.innerHTML) : "";
              return { value, text };
            });
          } else if (type === "判断题") {
            options = Array.from(stemAnswer.querySelectorAll(".clearfix.answerBg")).map((option) => {
              const valueElement = option.querySelector(".num_option");
              const textElement = option.querySelector(".answer_p");
              const value = valueElement ? valueElement.getAttribute("data") : "";
              const text = textElement ? removeHtml$1(textElement.innerHTML) : "";
              return { value, text };
            });
          }
          return options;
        } catch (error) {
          return [];
        }
      }
      function getQuestionId$1(questionElement) {
        try {
          const id = questionElement.getAttribute("data") || questionElement.id || "";
          const match = id.match(/question(\d+)/);
          return match ? match[1] : id;
        } catch (error) {
          return "";
        }
      }
      async function handleSingleChoice$1(questionElement, questionId, answer) {
        if (!answer) return;
        try {
          const stemAnswer = questionElement.querySelector(".stem_answer");
          if (!stemAnswer) return;
          const options = Array.from(stemAnswer.querySelectorAll(".clearfix.answerBg"));
          for (const option of options) {
            const valueElement = option.querySelector(".num_option");
            const value = valueElement ? valueElement.getAttribute("data") : "";
            if (value === answer) {
              const isSelected = valueElement && valueElement.classList.contains("check_answer");
              if (!isSelected) {
                option.click();
              }
              break;
            }
          }
        } catch (error) {
        }
      }
      async function handleMultipleChoice$1(questionElement, questionId, answer) {
        if (!answer || !answer.length) return;
        const answers = Array.isArray(answer) ? answer : [answer];
        try {
          const stemAnswer = questionElement.querySelector(".stem_answer");
          if (!stemAnswer) return;
          const options = Array.from(stemAnswer.querySelectorAll(".clearfix.answerBg"));
          for (const option of options) {
            const valueElement = option.querySelector(".num_option_dx");
            const value = valueElement ? valueElement.getAttribute("data") : "";
            if (answers.includes(value)) {
              const isSelected = valueElement && valueElement.classList.contains("check_answer_dx");
              if (!isSelected) {
                option.click();
              }
            }
          }
        } catch (error) {
        }
      }
      async function handleJudgment$1(questionElement, questionId, answer) {
        if (!answer) return;
        try {
          const stemAnswer = questionElement.querySelector(".stem_answer");
          if (!stemAnswer) return;
          const options = Array.from(stemAnswer.querySelectorAll(".clearfix.answerBg"));
          for (const option of options) {
            const valueElement = option.querySelector(".num_option");
            const value = valueElement ? valueElement.getAttribute("data") : "";
            const textElement = option.querySelector(".answer_p");
            const text = textElement ? textElement.textContent.trim() : "";
            const isMatch = answer === value || answer === "true" && (value === "true" || value === "A" || text.includes("对") || text.includes("正确") || text.includes("√")) || answer === "false" && (value === "false" || value === "B" || text.includes("错") || text.includes("×"));
            if (isMatch) {
              const isSelected = valueElement && valueElement.classList.contains("check_answer");
              if (!isSelected) {
                option.click();
              }
              break;
            }
          }
        } catch (error) {
        }
      }
      async function handleFillBlank$1(questionElement, questionId, answer) {
        if (!answer) return;
        try {
          const inputs = Array.from(questionElement.querySelectorAll("textarea"));
          const answers = Array.isArray(answer) ? answer : [answer];
          if (inputs.length === 0) return;
          for (let i = 0; i < inputs.length && i < answers.length; i++) {
            const input = inputs[i];
            if (!input.id) continue;
            try {
              const UE = window.UE || (typeof unsafeWindow !== "undefined" ? unsafeWindow.UE : null);
              if (!UE) continue;
              const editor = UE.getEditor(input.id);
              if (editor) {
                editor.setContent("");
                editor.setContent(answers[i]);
              } else {
                input.value = answers[i];
                const event = new Event("change", { bubbles: true });
                input.dispatchEvent(event);
              }
            } catch (editorError) {
              try {
                input.value = answers[i];
                const event = new Event("change", { bubbles: true });
                input.dispatchEvent(event);
              } catch (inputError) {
              }
            }
          }
        } catch (error) {
        }
      }
      async function handleEssay$1(questionElement, questionId, answer) {
        if (!answer) return;
        try {
          const textarea = questionElement.querySelector("textarea");
          if (!textarea) return;
          if (!textarea.id) {
            textarea.value = answer;
            const event = new Event("change", { bubbles: true });
            textarea.dispatchEvent(event);
            return;
          }
          try {
            const UE = window.UE || (typeof unsafeWindow !== "undefined" ? unsafeWindow.UE : null);
            if (!UE) {
              textarea.value = answer;
              const event = new Event("change", { bubbles: true });
              textarea.dispatchEvent(event);
              return;
            }
            const editor = UE.getEditor(textarea.id);
            if (editor) {
              if (editor.ready) {
                editor.setContent("");
                editor.setContent(answer);
              } else {
                editor.addListener("ready", function() {
                  editor.setContent("");
                  editor.setContent(answer);
                });
              }
            } else {
              textarea.value = answer;
              const event = new Event("change", { bubbles: true });
              textarea.dispatchEvent(event);
            }
          } catch (editorError) {
            try {
              textarea.value = answer;
              const event = new Event("change", { bubbles: true });
              textarea.dispatchEvent(event);
            } catch (inputError) {
            }
          }
        } catch (error) {
        }
      }
      async function handleWork(doc) {
        initStores$1();
        if (!settingsStore$1.cardInfo || settingsStore$1.cardInfo.status !== 1) {
          logStore$1.addLog("授权码未配置或已失效，跳过答题", LOG_TYPES.ERROR);
          logStore$1.addLog("请在「高级设置」中配置有效的授权码", LOG_TYPES.WARNING);
          return;
        }
        if (window._taskCancelled) return;
        const questionSections = doc.querySelectorAll(".whiteDiv");
        if (!questionSections.length) {
          logStore$1.addLog("未找到题目区域", LOG_TYPES.WARNING);
          return;
        }
        let totalQuestions = 0;
        questionSections.forEach((section) => {
          const questions = section.querySelectorAll(".questionLi");
          totalQuestions += questions.length;
        });
        logStore$1.addLog(`找到${questionSections.length}个题目类型，共${totalQuestions}道题`, LOG_TYPES.INFO);
        let correctCount = 0;
        let totalProcessed = 0;
        for (const section of questionSections) {
          if (window._taskCancelled) break;
          const questions = section.querySelectorAll(".questionLi");
          for (const question of questions) {
            if (window._taskCancelled) break;
            totalProcessed++;
            try {
              const questionId = getQuestionId$1(question);
              const { type, title } = parseQuestion$1(question);
              if (!title) continue;
              const options = parseOptions$1(question);
              logStore$1.addLog(`正在完成第${totalProcessed}题，题型：${type}`, LOG_TYPES.INFO);
              if (window._taskCancelled) break;
              const { isCorrect, answer, title: fullTitle, message, status, originalAnswer } = await checkAnswer({ type, title }, options);
              if (window._taskCancelled) break;
              const displayAnswer = isCorrect ? answer : originalAnswer || message;
              answerStore$1.addAnswer(fullTitle, displayAnswer, type, status, originalAnswer);
              if (!isCorrect) {
                if (status === "error") {
                  continue;
                } else if (status === "not_found") {
                  logStore$1.addLog(`未找到答案，跳过此题`, LOG_TYPES.WARNING);
                  continue;
                } else {
                  continue;
                }
              } else {
                correctCount++;
              }
              if (window._taskCancelled) break;
              if (type === "单选题") {
                await handleSingleChoice$1(question, questionId, answer);
              } else if (type === "多选题") {
                await handleMultipleChoice$1(question, questionId, answer);
              } else if (type === "判断题") {
                await handleJudgment$1(question, questionId, answer);
              } else if (type === "填空题") {
                await handleFillBlank$1(question, questionId, answer);
              } else if (type === "简答题") {
                await handleEssay$1(question, questionId, answer);
              }
              if (window._taskCancelled) {
                logStore$1.addLog("答题过程中任务被终止", LOG_TYPES.WARNING);
                break;
              }
            } catch (error) {
              logStore$1.addLog(`处理题目出错: ${error.message}`, LOG_TYPES.ERROR);
              if (window._taskCancelled || error.message === "Task cancelled") {
                break;
              }
            }
          }
        }
        if (window._taskCancelled) return;
        const correctRate = totalProcessed > 0 ? correctCount / totalProcessed * 100 : 0;
        logStore$1.addLog(`答题完成，正确率: ${correctRate.toFixed(2)}%`, LOG_TYPES.SUCCESS);
        if (settingsStore$1.answerSettings.autoSaveAnswer) {
          try {
            logStore$1.addLog("正在保存作业...", LOG_TYPES.INFO);
            await new Promise((resolve) => setTimeout(resolve, 1e3));
            if (typeof window.saveWork === "function") {
              window.saveWork();
            } else if (typeof saveWork === "function") {
              saveWork();
            } else {
              const saveButton = doc.querySelector('a[onclick*="saveWork"]');
              if (saveButton) {
                saveButton.click();
              } else {
                throw new Error("未找到保存函数或按钮");
              }
            }
            logStore$1.addLog("作业已保存", LOG_TYPES.SUCCESS);
          } catch (error) {
            logStore$1.addLog(`保存作业失败: ${error.message}`, LOG_TYPES.ERROR);
          }
        } else {
          logStore$1.addLog("已完成答题，请手动保存作业", LOG_TYPES.INFO);
        }
        if (settingsStore$1.automationSettings.autoSubmit && correctRate >= settingsStore$1.automationSettings.submitThreshold) {
          try {
            if (window._taskCancelled) return;
            const submitButton = doc.querySelector(".Btn_blue_1");
            if (submitButton) {
              logStore$1.addLog("正在提交作业...", LOG_TYPES.INFO);
              submitButton.click();
            } else {
              logStore$1.addLog("未找到提交按钮", LOG_TYPES.WARNING);
            }
          } catch (error) {
            logStore$1.addLog(`提交失败: ${error.message}`, LOG_TYPES.ERROR);
          }
        }
      }
      async function processPage$1() {
        try {
          initStores$1();
          if (!window._cancelController) {
            window._cancelController = new AbortController();
          }
          if (window._isProcessing) {
            window._cancelController.abort("Task cancelled");
            window._cancelController = new AbortController();
            window._taskCancelled = false;
            await new Promise((resolve) => setTimeout(resolve, 500));
          }
          window._taskCancelled = false;
          window._isProcessing = true;
          if (answerStore$1) {
            answerStore$1.clearAnswers();
          }
          logStore$1.addLog("正在解析作业页面", LOG_TYPES.INFO);
          await handleWork(document);
          window._isProcessing = false;
          logStore$1.addLog("作业页面处理完成", LOG_TYPES.SUCCESS);
        } catch (error) {
          if (error.message === "Task cancelled") {
            if (logStore$1) logStore$1.addLog("页面处理已取消", LOG_TYPES.WARNING);
          } else {
            console.error("处理作业页面时出错:", error);
            if (logStore$1) logStore$1.addLog(`处理错误: ${error.message}`, LOG_TYPES.ERROR);
          }
          window._isProcessing = false;
        }
      }
      function handleHomeworkPage() {
        initStores$1();
        logStore$1.addLog("开始处理作业页面", LOG_TYPES.INFO);
        processPage$1().catch((error) => {
          console.error("处理作业页面主函数出错:", error);
          logStore$1.addLog(`处理错误: ${error.message}`, LOG_TYPES.ERROR);
        });
      }
      const experienceNewHandler = () => {
        const experienceLinks = Array.from(document.querySelectorAll(".experience")).filter(
          (el) => el.textContent.includes("体验新版")
        );
        if (experienceLinks.length > 0) {
          experienceLinks[0].click();
          console.log('已点击"体验新版"按钮');
        } else {
          console.log('未找到"体验新版"按钮');
        }
      };
      function myCourseHandler() {
        const logStore2 = useLogStore();
        logStore2.addLog("请进入相关页面学习");
        console.log("超星课程页面处理器已执行");
      }
      let logStore = null;
      let answerStore = null;
      let settingsStore = null;
      function initStores() {
        if (!logStore) logStore = useLogStore();
        if (!answerStore) answerStore = useAnswerStore();
        if (!settingsStore) settingsStore = useSettingsStore();
      }
      function removeHtml(html) {
        if (html == null) {
          return "";
        }
        return html.replace(/<((?!img|sub|sup|br)[^>]+)>/g, "").replace(/&nbsp;/g, " ").replace(/\s+/g, " ").replace(/<br\s*\/?>/g, "\n").replace(/<img.*?src="(.*?)".*?>/g, '<img src="$1"/>').trim();
      }
      function parseQuestion(questionElement) {
        try {
          const titleElement = questionElement.querySelector(".mark_name");
          const typeSpan = titleElement == null ? void 0 : titleElement.querySelector(".colorShallow");
          if (!titleElement) return { type: "", title: "" };
          const titleHtml = titleElement.innerHTML;
          let type = "";
          if (typeSpan) {
            const typeText = typeSpan.textContent;
            if (typeText.includes("单选题")) type = "单选题";
            else if (typeText.includes("多选题")) type = "多选题";
            else if (typeText.includes("填空题")) type = "填空题";
            else if (typeText.includes("判断题")) type = "判断题";
            else if (typeText.includes("简答题")) type = "简答题";
          }
          let title = titleHtml.replace(/^\d+\./, "").replace(/<span[^>]*class="colorShallow"[^>]*>[\s\S]*?<\/span>/g, "").trim();
          title = removeHtml(title);
          return {
            type,
            title
          };
        } catch (error) {
          return { type: "", title: "" };
        }
      }
      function parseOptions(questionElement) {
        try {
          const { type } = parseQuestion(questionElement);
          const questionId = questionElement.getAttribute("data");
          const stemAnswer = questionElement.querySelector(".stem_answer");
          if (!stemAnswer) return [];
          let options = [];
          if (type === "单选题" || type === "多选题" || type === "判断题") {
            options = Array.from(stemAnswer.querySelectorAll(".clearfix.answerBg, .clearfix.singleoption")).map((option) => {
              const valueElement = option.querySelector(`[data]`);
              const textElement = option.querySelector(".answer_p");
              const value = valueElement ? valueElement.getAttribute("data") : "";
              const text = textElement ? removeHtml(textElement.innerHTML) : "";
              return { value, text };
            });
          }
          return options;
        } catch (error) {
          return [];
        }
      }
      function getQuestionId(questionElement) {
        try {
          const id = questionElement.getAttribute("data") || questionElement.id || "";
          return id;
        } catch (error) {
          return "";
        }
      }
      async function handleSingleChoice(questionElement, questionId, answer) {
        if (!answer) return;
        try {
          const stemAnswer = questionElement.querySelector(".stem_answer");
          if (!stemAnswer) return;
          const options = Array.from(stemAnswer.querySelectorAll(".clearfix.answerBg, .clearfix.singleoption"));
          for (const option of options) {
            const valueElement = option.querySelector(`[data]`);
            const value = valueElement ? valueElement.getAttribute("data") : "";
            if (value === answer) {
              const isSelected = option.querySelector(".check_answer") !== null;
              if (!isSelected) {
                option.click();
                logStore.addLog(`已选择答案: ${answer}`, LOG_TYPES.SUCCESS);
              }
              break;
            }
          }
        } catch (error) {
          logStore.addLog(`选择答案失败: ${error.message}`, LOG_TYPES.ERROR);
        }
      }
      async function handleMultipleChoice(questionElement, questionId, answer) {
        if (!answer || !answer.length) return;
        const answers = Array.isArray(answer) ? answer : [answer];
        try {
          const stemAnswer = questionElement.querySelector(".stem_answer");
          if (!stemAnswer) return;
          const options = Array.from(stemAnswer.querySelectorAll(".clearfix.answerBg"));
          for (const option of options) {
            const valueElement = option.querySelector(`[data]`);
            const value = valueElement ? valueElement.getAttribute("data") : "";
            if (answers.includes(value)) {
              const isSelected = option.querySelector(".check_answer") !== null;
              if (!isSelected) {
                option.click();
              }
            }
          }
          logStore.addLog(`已选择答案: ${answers.join(",")}`, LOG_TYPES.SUCCESS);
        } catch (error) {
          logStore.addLog(`选择答案失败: ${error.message}`, LOG_TYPES.ERROR);
        }
      }
      async function handleJudgment(questionElement, questionId, answer) {
        if (!answer) return;
        try {
          const stemAnswer = questionElement.querySelector(".stem_answer");
          if (!stemAnswer) return;
          const options = Array.from(stemAnswer.querySelectorAll(".clearfix.answerBg, .clearfix.singleoption"));
          for (const option of options) {
            const valueElement = option.querySelector(`[data]`);
            const value = valueElement ? valueElement.getAttribute("data") : "";
            const textElement = option.querySelector(".answer_p");
            const text = textElement ? textElement.textContent.trim() : "";
            const isMatch = answer === value || answer === "true" && value === "true" || answer === "false" && value === "false" || answer === "true" && text === "对" || answer === "false" && text === "错" || answer === "对" && text === "对" || answer === "错" && text === "错";
            if (isMatch) {
              const isSelected = option.querySelector(".check_answer") !== null;
              if (!isSelected) {
                option.click();
                logStore.addLog(`已选择答案: ${answer}`, LOG_TYPES.SUCCESS);
              }
              break;
            }
          }
        } catch (error) {
          logStore.addLog(`选择答案失败: ${error.message}`, LOG_TYPES.ERROR);
        }
      }
      async function handleFillBlank(questionElement, questionId, answer) {
        var _a;
        if (!answer) return;
        try {
          const inputs = Array.from(questionElement.querySelectorAll("textarea"));
          const answers = Array.isArray(answer) ? answer : [answer];
          if (inputs.length === 0) return;
          for (let i = 0; i < inputs.length && i < answers.length; i++) {
            const input = inputs[i];
            if (!input.id) continue;
            try {
              const editor = (_a = window.UE) == null ? void 0 : _a.getEditor(input.id);
              if (editor) {
                editor.setContent("");
                editor.setContent(answers[i]);
              } else {
                input.value = answers[i];
                const event = new Event("change", { bubbles: true });
                input.dispatchEvent(event);
              }
            } catch (editorError) {
              try {
                input.value = answers[i];
                const event = new Event("change", { bubbles: true });
                input.dispatchEvent(event);
              } catch (inputError) {
                logStore.addLog(`填写答案失败: ${inputError.message}`, LOG_TYPES.ERROR);
              }
            }
          }
          logStore.addLog(`已填写答案`, LOG_TYPES.SUCCESS);
        } catch (error) {
          logStore.addLog(`填写答案失败: ${error.message}`, LOG_TYPES.ERROR);
        }
      }
      async function handleEssay(questionElement, questionId, answer) {
        var _a;
        if (!answer) return;
        try {
          const textarea = questionElement.querySelector("textarea");
          if (!textarea) return;
          if (!textarea.id) {
            textarea.value = answer;
            const event = new Event("change", { bubbles: true });
            textarea.dispatchEvent(event);
            logStore.addLog(`已填写答案`, LOG_TYPES.SUCCESS);
            return;
          }
          try {
            const editor = (_a = window.UE) == null ? void 0 : _a.getEditor(textarea.id);
            if (editor) {
              if (editor.ready) {
                editor.setContent("");
                editor.setContent(answer);
                logStore.addLog(`已填写答案`, LOG_TYPES.SUCCESS);
              } else {
                editor.addListener("ready", function() {
                  editor.setContent("");
                  editor.setContent(answer);
                  logStore.addLog(`已填写答案`, LOG_TYPES.SUCCESS);
                });
              }
            } else {
              textarea.value = answer;
              const event = new Event("change", { bubbles: true });
              textarea.dispatchEvent(event);
              logStore.addLog(`已填写答案`, LOG_TYPES.SUCCESS);
            }
          } catch (editorError) {
            try {
              textarea.value = answer;
              const event = new Event("change", { bubbles: true });
              textarea.dispatchEvent(event);
              logStore.addLog(`已填写答案`, LOG_TYPES.SUCCESS);
            } catch (inputError) {
              logStore.addLog(`填写答案失败: ${inputError.message}`, LOG_TYPES.ERROR);
            }
          }
        } catch (error) {
          logStore.addLog(`填写答案失败: ${error.message}`, LOG_TYPES.ERROR);
        }
      }
      async function handleExam(doc) {
        initStores();
        if (!settingsStore.cardInfo || settingsStore.cardInfo.status !== 1) {
          logStore.addLog("授权码未配置或已失效，跳过答题", LOG_TYPES.ERROR);
          logStore.addLog("请在「高级设置」中配置有效的授权码", LOG_TYPES.WARNING);
          return;
        }
        if (window._taskCancelled) return;
        const currentQuestion = doc.querySelector(".whiteDiv.questionLi");
        if (!currentQuestion) {
          logStore.addLog("未找到当前题目", LOG_TYPES.WARNING);
          return;
        }
        logStore.addLog("开始处理当前题目", LOG_TYPES.INFO);
        try {
          const questionId = getQuestionId(currentQuestion);
          const { type, title } = parseQuestion(currentQuestion);
          if (!title) {
            logStore.addLog("题目内容为空，跳过", LOG_TYPES.WARNING);
            return;
          }
          const options = parseOptions(currentQuestion);
          logStore.addLog(`题型：${type}`, LOG_TYPES.INFO);
          logStore.addLog(`题目：${title.substring(0, 50)}${title.length > 50 ? "..." : ""}`, LOG_TYPES.INFO);
          if (window._taskCancelled) return;
          const { isCorrect, answer, title: fullTitle, message, status, originalAnswer } = await checkAnswer({ type, title }, options);
          if (window._taskCancelled) return;
          const displayAnswer = isCorrect ? answer : originalAnswer || message;
          answerStore.addAnswer(fullTitle, displayAnswer, type, status, originalAnswer);
          if (!isCorrect) {
            if (status === "error") {
            } else if (status === "not_found") {
              logStore.addLog(`未找到答案: ${message}`, LOG_TYPES.WARNING);
            }
          } else {
            logStore.addLog(`找到答案: ${Array.isArray(answer) ? answer.join(",") : answer}`, LOG_TYPES.SUCCESS);
            if (window._taskCancelled) return;
            if (type === "单选题") {
              await handleSingleChoice(currentQuestion, questionId, answer);
            } else if (type === "多选题") {
              await handleMultipleChoice(currentQuestion, questionId, answer);
            } else if (type === "判断题") {
              await handleJudgment(currentQuestion, questionId, answer);
            } else if (type === "填空题") {
              await handleFillBlank(currentQuestion, questionId, answer);
            } else if (type === "简答题") {
              await handleEssay(currentQuestion, questionId, answer);
            }
            if (window._taskCancelled) {
              logStore.addLog("答题过程中任务被终止", LOG_TYPES.WARNING);
              return;
            }
            await new Promise((resolve) => setTimeout(resolve, 800));
          }
          if (settingsStore.automationSettings.autoNextExamQuestion) {
            const nextButton = doc.querySelector(".nextDiv a.jb_btn");
            if (nextButton) {
              const buttonText = nextButton.textContent.trim();
              if (buttonText.includes("下一题")) {
                logStore.addLog("正在进入下一题...", LOG_TYPES.INFO);
                await new Promise((resolve) => setTimeout(resolve, 1e3));
                nextButton.click();
              } else {
                logStore.addLog(`已是最后一道题目`, LOG_TYPES.INFO);
              }
            } else {
              logStore.addLog("已是最后一道题目", LOG_TYPES.INFO);
            }
          } else {
            logStore.addLog("当前题目已完成（自动进入下一题已关闭）", LOG_TYPES.INFO);
          }
        } catch (error) {
          logStore.addLog(`处理题目出错: ${error.message}`, LOG_TYPES.ERROR);
          if (window._taskCancelled || error.message === "Task cancelled") {
            return;
          }
        }
      }
      async function processPage() {
        try {
          initStores();
          if (!window._cancelController) {
            window._cancelController = new AbortController();
          }
          if (window._isProcessing) {
            window._cancelController.abort("Task cancelled");
            window._cancelController = new AbortController();
            window._taskCancelled = false;
            await new Promise((resolve) => setTimeout(resolve, 500));
          }
          window._taskCancelled = false;
          window._isProcessing = true;
          logStore.addLog("正在解析考试页面", LOG_TYPES.INFO);
          await handleExam(document);
          window._isProcessing = false;
          logStore.addLog("当前题目处理完成", LOG_TYPES.SUCCESS);
        } catch (error) {
          if (error.message === "Task cancelled") {
            if (logStore) logStore.addLog("页面处理已取消", LOG_TYPES.WARNING);
          } else {
            console.error("处理考试页面时出错:", error);
            if (logStore) logStore.addLog(`处理错误: ${error.message}`, LOG_TYPES.ERROR);
          }
          window._isProcessing = false;
        }
      }
      function handleExamPage() {
        initStores();
        logStore.addLog("开始处理考试页面", LOG_TYPES.INFO);
        processPage().catch((error) => {
          console.error("处理考试页面主函数出错:", error);
          logStore.addLog(`处理错误: ${error.message}`, LOG_TYPES.ERROR);
        });
      }
      const routes = [
        {
          // 匹配超星章节页面 - 同时匹配两种路径模式
          pattern: /\.chaoxing\.com\/(mooc-ans\/)?mycourse\/studentstudy/,
          handler: handleChapterPage,
          description: "超星章节"
        },
        {
          // 匹配超星作业页面 /mooc-ans/mooc2/work/dowork
          pattern: /\.chaoxing\.com\/mooc-ans\/mooc2\/work\/dowork/,
          handler: handleHomeworkPage,
          description: "超星作业"
        },
        {
          // 匹配 mooc1.chaoxing.com/mooc-ans/mycourse/studentcourse 页面，点击"体验新版"按钮
          pattern: /mooc1\.chaoxing\.com\/mycourse\/studentcourse/,
          handler: experienceNewHandler,
          description: "点击体验新版"
        },
        {
          // 课程页面处理
          pattern: /\.chaoxing\.com\/mooc2-ans\/mycourse\/stu\?/,
          handler: myCourseHandler,
          description: "超星课程页面"
        },
        {
          // 匹配超星考试页面 /exam-ans/exam/test/reVersionTestStartNew
          pattern: /\.chaoxing\.com\/exam-ans\/exam\/test\/reVersionTestStartNew/,
          handler: handleExamPage,
          description: "超星考试"
        }
        // {
        //   // 匹配其他超星章节页面
        //   pattern: /\.chaoxing\.com\/.*\/chapter/,
        //   handler: chapterHandler,
        //   description: '超星章节页面处理'
        // }
        // 可以继续添加更多路由配置
      ];
      function isMatchingUrl(pattern) {
        const currentUrl = _unsafeWindow.location.href;
        console.log("currentUrl", currentUrl);
        if (pattern instanceof RegExp) {
          return pattern.test(currentUrl);
        }
        return currentUrl.includes(pattern);
      }
      const _hoisted_1 = { id: "app" };
      const _hoisted_2 = { class: "app-container" };
      const _sfc_main = {
        __name: "App",
        setup(__props) {
          const visible = ref(false);
          const processedUrls = /* @__PURE__ */ new Set();
          const checkRouteMatch = async () => {
            const currentUrl = window.location.href;
            if (processedUrls.has(currentUrl)) {
              console.log(`URL已处理过，跳过: ${currentUrl}`);
              return;
            }
            for (const route of routes) {
              if (isMatchingUrl(route.pattern)) {
                console.log(`匹配到路由: ${route.description}，显示浮窗`);
                visible.value = true;
                processedUrls.add(currentUrl);
                try {
                  if (typeof route.handler === "function") {
                    await route.handler();
                  }
                } catch (error) {
                  console.error("执行页面处理器失败:", error);
                }
                return;
              }
            }
            console.log("未匹配到任何路由，隐藏浮窗");
            visible.value = false;
          };
          const setupUrlObserver = () => {
            const observer = new MutationObserver((mutations) => {
              const currentUrl = window.location.href;
              if (window._lastUrl !== currentUrl) {
                window._lastUrl = currentUrl;
                console.log("URL已变化，重新检查路由匹配");
                checkRouteMatch();
              }
            });
            observer.observe(document.body, {
              childList: true,
              subtree: true
            });
            window._urlChangeObserver = observer;
            window._lastUrl = window.location.href;
          };
          onMounted(() => {
            checkRouteMatch();
            setupUrlObserver();
          });
          onUnmounted(() => {
            if (window._urlChangeObserver) {
              window._urlChangeObserver.disconnect();
            }
          });
          return (_ctx, _cache) => {
            return openBlock(), createElementBlock("div", _hoisted_1, [
              createElementVNode("div", _hoisted_2, [
                visible.value ? (openBlock(), createBlock(FloatingWindow, { key: 0 })) : createCommentVNode("", true)
              ])
            ]);
          };
        }
      };
      const inlineCss = '.floating-modal{pointer-events:none}.ant-modal-header{padding:13px}:host{font-family:-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,Helvetica Neue,Arial,Noto Sans,sans-serif,"Apple Color Emoji","Segoe UI Emoji",Segoe UI Symbol,"Noto Color Emoji"}';
      const vueApp = createApp(_sfc_main);
      const pinia = createPinia();
      vueApp.use(pinia).use(Antd).mount(
        (() => {
          const shadow_root = document.createElement("div");
          const app = document.createElement("div");
          document.body.append(shadow_root);
          const shadow = shadow_root.attachShadow({ mode: "open" });
          shadow.appendChild(app);
          const sheet = new CSSStyleSheet();
          const sheet1 = new CSSStyleSheet();
          const AntdStyle = _GM_getResourceText("AntdStyle");
          sheet.replace(AntdStyle);
          sheet1.replace(inlineCss);
          shadow.adoptedStyleSheets = [sheet, sheet1];
          return app;
        })()
      );

    })
  };
}));

System.register("./fontDecrypt-BfNMxRKv-DJbPwEQi.js", ['./__monkey.entry-53VJY8gR.js', 'blueimp-md5', 'vue', 'pinia', 'crypto-js', 'ant-design-vue'], (function (exports, module) {
  'use strict';
  var _GM_getResourceText, md5;
  return {
    setters: [module => {
      _GM_getResourceText = module._;
    }, module => {
      md5 = module.default;
    }, null, null, null, null],
    execute: (function () {

      exports("decrypt", decrypt);

      var dist = {};
      var Typr = {};
      var hasRequiredTypr;
      function requireTypr() {
        if (hasRequiredTypr) return Typr;
        hasRequiredTypr = 1;
        var Typr$1 = {};
        Typr$1.parse = function(buff) {
          var bin = Typr$1._bin;
          var data = new Uint8Array(buff);
          var tag = bin.readASCII(data, 0, 4);
          if (tag == "ttcf") {
            var offset = 4;
            bin.readUshort(data, offset);
            offset += 2;
            bin.readUshort(data, offset);
            offset += 2;
            var numF = bin.readUint(data, offset);
            offset += 4;
            var fnts = [];
            for (var i = 0; i < numF; i++) {
              var foff = bin.readUint(data, offset);
              offset += 4;
              fnts.push(Typr$1._readFont(data, foff));
            }
            return fnts;
          } else
            return [Typr$1._readFont(data, 0)];
        };
        Typr$1._readFont = function(data, offset) {
          var bin = Typr$1._bin;
          var ooff = offset;
          bin.readFixed(data, offset);
          offset += 4;
          var numTables = bin.readUshort(data, offset);
          offset += 2;
          bin.readUshort(data, offset);
          offset += 2;
          bin.readUshort(data, offset);
          offset += 2;
          bin.readUshort(data, offset);
          offset += 2;
          var tags = [
            "cmap",
            "head",
            "hhea",
            "maxp",
            "hmtx",
            "name",
            "OS/2",
            "post",
            //"cvt",
            //"fpgm",
            "loca",
            "glyf",
            "kern",
            //"prep"
            //"gasp"
            "CFF ",
            "GPOS",
            "GSUB",
            "SVG "
            //"VORG",
          ];
          var obj = { _data: data, _offset: ooff };
          var tabs = {};
          for (var i = 0; i < numTables; i++) {
            var tag = bin.readASCII(data, offset, 4);
            offset += 4;
            bin.readUint(data, offset);
            offset += 4;
            var toffset = bin.readUint(data, offset);
            offset += 4;
            var length = bin.readUint(data, offset);
            offset += 4;
            tabs[tag] = { offset: toffset, length };
          }
          for (var i = 0; i < tags.length; i++) {
            var t = tags[i];
            if (tabs[t])
              obj[t.trim()] = Typr$1[t.trim()].parse(data, tabs[t].offset, tabs[t].length, obj);
          }
          return obj;
        };
        Typr$1._tabOffset = function(data, tab, foff) {
          var bin = Typr$1._bin;
          var numTables = bin.readUshort(data, foff + 4);
          var offset = foff + 12;
          for (var i = 0; i < numTables; i++) {
            var tag = bin.readASCII(data, offset, 4);
            offset += 4;
            bin.readUint(data, offset);
            offset += 4;
            var toffset = bin.readUint(data, offset);
            offset += 4;
            bin.readUint(data, offset);
            offset += 4;
            if (tag == tab)
              return toffset;
          }
          return 0;
        };
        Typr$1._bin = {
          readFixed: function(data, o) {
            return (data[o] << 8 | data[o + 1]) + (data[o + 2] << 8 | data[o + 3]) / (256 * 256 + 4);
          },
          readF2dot14: function(data, o) {
            var num = Typr$1._bin.readShort(data, o);
            return num / 16384;
          },
          readInt: function(buff, p) {
            return Typr$1._bin._view(buff).getInt32(p);
          },
          readInt8: function(buff, p) {
            return Typr$1._bin._view(buff).getInt8(p);
          },
          readShort: function(buff, p) {
            return Typr$1._bin._view(buff).getInt16(p);
          },
          readUshort: function(buff, p) {
            return Typr$1._bin._view(buff).getUint16(p);
          },
          readUshorts: function(buff, p, len) {
            var arr = [];
            for (var i = 0; i < len; i++)
              arr.push(Typr$1._bin.readUshort(buff, p + i * 2));
            return arr;
          },
          readUint: function(buff, p) {
            return Typr$1._bin._view(buff).getUint32(p);
          },
          readUint64: function(buff, p) {
            return Typr$1._bin.readUint(buff, p) * (4294967295 + 1) + Typr$1._bin.readUint(buff, p + 4);
          },
          readASCII: function(buff, p, l) {
            var s = "";
            for (var i = 0; i < l; i++)
              s += String.fromCharCode(buff[p + i]);
            return s;
          },
          readUnicode: function(buff, p, l) {
            var s = "";
            for (var i = 0; i < l; i++) {
              var c = buff[p++] << 8 | buff[p++];
              s += String.fromCharCode(c);
            }
            return s;
          },
          _tdec: typeof window !== "undefined" && window["TextDecoder"] ? new window["TextDecoder"]() : null,
          readUTF8: function(buff, p, l) {
            var tdec = Typr$1._bin._tdec;
            if (tdec && p == 0 && l == buff.length)
              return tdec["decode"](buff);
            return Typr$1._bin.readASCII(buff, p, l);
          },
          readBytes: function(buff, p, l) {
            var arr = [];
            for (var i = 0; i < l; i++)
              arr.push(buff[p + i]);
            return arr;
          },
          readASCIIArray: function(buff, p, l) {
            var s = [];
            for (var i = 0; i < l; i++)
              s.push(String.fromCharCode(buff[p + i]));
            return s;
          },
          _view: function(buff) {
            return buff._dataView || (buff._dataView = buff.buffer ? new DataView(buff.buffer, buff.byteOffset, buff.byteLength) : new DataView(new Uint8Array(buff).buffer));
          }
        };
        Typr$1._lctf = {};
        Typr$1._lctf.parse = function(data, offset, length, font, subt) {
          var bin = Typr$1._bin;
          var obj = {};
          var offset0 = offset;
          bin.readFixed(data, offset);
          offset += 4;
          var offScriptList = bin.readUshort(data, offset);
          offset += 2;
          var offFeatureList = bin.readUshort(data, offset);
          offset += 2;
          var offLookupList = bin.readUshort(data, offset);
          offset += 2;
          obj.scriptList = Typr$1._lctf.readScriptList(data, offset0 + offScriptList);
          obj.featureList = Typr$1._lctf.readFeatureList(data, offset0 + offFeatureList);
          obj.lookupList = Typr$1._lctf.readLookupList(data, offset0 + offLookupList, subt);
          return obj;
        };
        Typr$1._lctf.readLookupList = function(data, offset, subt) {
          var bin = Typr$1._bin;
          var offset0 = offset;
          var obj = [];
          var count = bin.readUshort(data, offset);
          offset += 2;
          for (var i = 0; i < count; i++) {
            var noff = bin.readUshort(data, offset);
            offset += 2;
            var lut = Typr$1._lctf.readLookupTable(data, offset0 + noff, subt);
            obj.push(lut);
          }
          return obj;
        };
        Typr$1._lctf.readLookupTable = function(data, offset, subt) {
          var bin = Typr$1._bin;
          var offset0 = offset;
          var obj = { tabs: [] };
          obj.ltype = bin.readUshort(data, offset);
          offset += 2;
          obj.flag = bin.readUshort(data, offset);
          offset += 2;
          var cnt = bin.readUshort(data, offset);
          offset += 2;
          var ltype = obj.ltype;
          for (var i = 0; i < cnt; i++) {
            var noff = bin.readUshort(data, offset);
            offset += 2;
            var tab = subt(data, ltype, offset0 + noff, obj);
            obj.tabs.push(tab);
          }
          return obj;
        };
        Typr$1._lctf.numOfOnes = function(n) {
          var num = 0;
          for (var i = 0; i < 32; i++)
            if ((n >>> i & 1) != 0)
              num++;
          return num;
        };
        Typr$1._lctf.readClassDef = function(data, offset) {
          var bin = Typr$1._bin;
          var obj = [];
          var format = bin.readUshort(data, offset);
          offset += 2;
          if (format == 1) {
            var startGlyph = bin.readUshort(data, offset);
            offset += 2;
            var glyphCount = bin.readUshort(data, offset);
            offset += 2;
            for (var i = 0; i < glyphCount; i++) {
              obj.push(startGlyph + i);
              obj.push(startGlyph + i);
              obj.push(bin.readUshort(data, offset));
              offset += 2;
            }
          }
          if (format == 2) {
            var count = bin.readUshort(data, offset);
            offset += 2;
            for (var i = 0; i < count; i++) {
              obj.push(bin.readUshort(data, offset));
              offset += 2;
              obj.push(bin.readUshort(data, offset));
              offset += 2;
              obj.push(bin.readUshort(data, offset));
              offset += 2;
            }
          }
          return obj;
        };
        Typr$1._lctf.getInterval = function(tab, val) {
          for (var i = 0; i < tab.length; i += 3) {
            var start = tab[i], end = tab[i + 1];
            tab[i + 2];
            if (start <= val && val <= end)
              return i;
          }
          return -1;
        };
        Typr$1._lctf.readCoverage = function(data, offset) {
          var bin = Typr$1._bin;
          var cvg = {};
          cvg.fmt = bin.readUshort(data, offset);
          offset += 2;
          var count = bin.readUshort(data, offset);
          offset += 2;
          if (cvg.fmt == 1)
            cvg.tab = bin.readUshorts(data, offset, count);
          if (cvg.fmt == 2)
            cvg.tab = bin.readUshorts(data, offset, count * 3);
          return cvg;
        };
        Typr$1._lctf.coverageIndex = function(cvg, val) {
          var tab = cvg.tab;
          if (cvg.fmt == 1)
            return tab.indexOf(val);
          if (cvg.fmt == 2) {
            var ind = Typr$1._lctf.getInterval(tab, val);
            if (ind != -1)
              return tab[ind + 2] + (val - tab[ind]);
          }
          return -1;
        };
        Typr$1._lctf.readFeatureList = function(data, offset) {
          var bin = Typr$1._bin;
          var offset0 = offset;
          var obj = [];
          var count = bin.readUshort(data, offset);
          offset += 2;
          for (var i = 0; i < count; i++) {
            var tag = bin.readASCII(data, offset, 4);
            offset += 4;
            var noff = bin.readUshort(data, offset);
            offset += 2;
            var feat = Typr$1._lctf.readFeatureTable(data, offset0 + noff);
            feat.tag = tag.trim();
            obj.push(feat);
          }
          return obj;
        };
        Typr$1._lctf.readFeatureTable = function(data, offset) {
          var bin = Typr$1._bin;
          var offset0 = offset;
          var feat = {};
          var featureParams = bin.readUshort(data, offset);
          offset += 2;
          if (featureParams > 0) {
            feat.featureParams = offset0 + featureParams;
          }
          var lookupCount = bin.readUshort(data, offset);
          offset += 2;
          feat.tab = [];
          for (var i = 0; i < lookupCount; i++)
            feat.tab.push(bin.readUshort(data, offset + 2 * i));
          return feat;
        };
        Typr$1._lctf.readScriptList = function(data, offset) {
          var bin = Typr$1._bin;
          var offset0 = offset;
          var obj = {};
          var count = bin.readUshort(data, offset);
          offset += 2;
          for (var i = 0; i < count; i++) {
            var tag = bin.readASCII(data, offset, 4);
            offset += 4;
            var noff = bin.readUshort(data, offset);
            offset += 2;
            obj[tag.trim()] = Typr$1._lctf.readScriptTable(data, offset0 + noff);
          }
          return obj;
        };
        Typr$1._lctf.readScriptTable = function(data, offset) {
          var bin = Typr$1._bin;
          var offset0 = offset;
          var obj = {};
          var defLangSysOff = bin.readUshort(data, offset);
          offset += 2;
          if (defLangSysOff > 0) {
            obj["default"] = Typr$1._lctf.readLangSysTable(data, offset0 + defLangSysOff);
          }
          var langSysCount = bin.readUshort(data, offset);
          offset += 2;
          for (var i = 0; i < langSysCount; i++) {
            var tag = bin.readASCII(data, offset, 4);
            offset += 4;
            var langSysOff = bin.readUshort(data, offset);
            offset += 2;
            obj[tag.trim()] = Typr$1._lctf.readLangSysTable(data, offset0 + langSysOff);
          }
          return obj;
        };
        Typr$1._lctf.readLangSysTable = function(data, offset) {
          var bin = Typr$1._bin;
          var obj = {};
          bin.readUshort(data, offset);
          offset += 2;
          obj.reqFeature = bin.readUshort(data, offset);
          offset += 2;
          var featureCount = bin.readUshort(data, offset);
          offset += 2;
          obj.features = bin.readUshorts(data, offset, featureCount);
          return obj;
        };
        Typr$1.CFF = {};
        Typr$1.CFF.parse = function(data, offset, length) {
          var bin = Typr$1._bin;
          data = new Uint8Array(data.buffer, offset, length);
          offset = 0;
          data[offset];
          offset++;
          data[offset];
          offset++;
          data[offset];
          offset++;
          data[offset];
          offset++;
          var ninds = [];
          offset = Typr$1.CFF.readIndex(data, offset, ninds);
          var names = [];
          for (var i = 0; i < ninds.length - 1; i++)
            names.push(bin.readASCII(data, offset + ninds[i], ninds[i + 1] - ninds[i]));
          offset += ninds[ninds.length - 1];
          var tdinds = [];
          offset = Typr$1.CFF.readIndex(data, offset, tdinds);
          var topDicts = [];
          for (var i = 0; i < tdinds.length - 1; i++)
            topDicts.push(Typr$1.CFF.readDict(data, offset + tdinds[i], offset + tdinds[i + 1]));
          offset += tdinds[tdinds.length - 1];
          var topdict = topDicts[0];
          var sinds = [];
          offset = Typr$1.CFF.readIndex(data, offset, sinds);
          var strings = [];
          for (var i = 0; i < sinds.length - 1; i++)
            strings.push(bin.readASCII(data, offset + sinds[i], sinds[i + 1] - sinds[i]));
          offset += sinds[sinds.length - 1];
          Typr$1.CFF.readSubrs(data, offset, topdict);
          if (topdict.CharStrings) {
            offset = topdict.CharStrings;
            var sinds = [];
            offset = Typr$1.CFF.readIndex(data, offset, sinds);
            var cstr = [];
            for (var i = 0; i < sinds.length - 1; i++)
              cstr.push(bin.readBytes(data, offset + sinds[i], sinds[i + 1] - sinds[i]));
            topdict.CharStrings = cstr;
          }
          if (topdict.ROS) {
            offset = topdict.FDArray;
            var fdind = [];
            offset = Typr$1.CFF.readIndex(data, offset, fdind);
            topdict.FDArray = [];
            for (var i = 0; i < fdind.length - 1; i++) {
              var dict = Typr$1.CFF.readDict(data, offset + fdind[i], offset + fdind[i + 1]);
              Typr$1.CFF._readFDict(data, dict, strings);
              topdict.FDArray.push(dict);
            }
            offset += fdind[fdind.length - 1];
            offset = topdict.FDSelect;
            topdict.FDSelect = [];
            var fmt = data[offset];
            offset++;
            if (fmt == 3) {
              var rns = bin.readUshort(data, offset);
              offset += 2;
              for (var i = 0; i < rns + 1; i++) {
                topdict.FDSelect.push(bin.readUshort(data, offset), data[offset + 2]);
                offset += 3;
              }
            } else
              throw fmt;
          }
          if (topdict.Encoding)
            topdict.Encoding = Typr$1.CFF.readEncoding(data, topdict.Encoding, topdict.CharStrings.length);
          if (topdict.charset)
            topdict.charset = Typr$1.CFF.readCharset(data, topdict.charset, topdict.CharStrings.length);
          Typr$1.CFF._readFDict(data, topdict, strings);
          return topdict;
        };
        Typr$1.CFF._readFDict = function(data, dict, ss) {
          var offset;
          if (dict.Private) {
            offset = dict.Private[1];
            dict.Private = Typr$1.CFF.readDict(data, offset, offset + dict.Private[0]);
            if (dict.Private.Subrs)
              Typr$1.CFF.readSubrs(data, offset + dict.Private.Subrs, dict.Private);
          }
          for (var p in dict)
            if (["FamilyName", "FontName", "FullName", "Notice", "version", "Copyright"].indexOf(p) != -1)
              dict[p] = ss[dict[p] - 426 + 35];
        };
        Typr$1.CFF.readSubrs = function(data, offset, obj) {
          var bin = Typr$1._bin;
          var gsubinds = [];
          offset = Typr$1.CFF.readIndex(data, offset, gsubinds);
          var bias, nSubrs = gsubinds.length;
          if (nSubrs < 1240)
            bias = 107;
          else if (nSubrs < 33900)
            bias = 1131;
          else
            bias = 32768;
          obj.Bias = bias;
          obj.Subrs = [];
          for (var i = 0; i < gsubinds.length - 1; i++)
            obj.Subrs.push(bin.readBytes(data, offset + gsubinds[i], gsubinds[i + 1] - gsubinds[i]));
        };
        Typr$1.CFF.tableSE = [
          0,
          0,
          0,
          0,
          0,
          0,
          0,
          0,
          0,
          0,
          0,
          0,
          0,
          0,
          0,
          0,
          0,
          0,
          0,
          0,
          0,
          0,
          0,
          0,
          0,
          0,
          0,
          0,
          0,
          0,
          0,
          0,
          1,
          2,
          3,
          4,
          5,
          6,
          7,
          8,
          9,
          10,
          11,
          12,
          13,
          14,
          15,
          16,
          17,
          18,
          19,
          20,
          21,
          22,
          23,
          24,
          25,
          26,
          27,
          28,
          29,
          30,
          31,
          32,
          33,
          34,
          35,
          36,
          37,
          38,
          39,
          40,
          41,
          42,
          43,
          44,
          45,
          46,
          47,
          48,
          49,
          50,
          51,
          52,
          53,
          54,
          55,
          56,
          57,
          58,
          59,
          60,
          61,
          62,
          63,
          64,
          65,
          66,
          67,
          68,
          69,
          70,
          71,
          72,
          73,
          74,
          75,
          76,
          77,
          78,
          79,
          80,
          81,
          82,
          83,
          84,
          85,
          86,
          87,
          88,
          89,
          90,
          91,
          92,
          93,
          94,
          95,
          0,
          0,
          0,
          0,
          0,
          0,
          0,
          0,
          0,
          0,
          0,
          0,
          0,
          0,
          0,
          0,
          0,
          0,
          0,
          0,
          0,
          0,
          0,
          0,
          0,
          0,
          0,
          0,
          0,
          0,
          0,
          0,
          0,
          0,
          96,
          97,
          98,
          99,
          100,
          101,
          102,
          103,
          104,
          105,
          106,
          107,
          108,
          109,
          110,
          0,
          111,
          112,
          113,
          114,
          0,
          115,
          116,
          117,
          118,
          119,
          120,
          121,
          122,
          0,
          123,
          0,
          124,
          125,
          126,
          127,
          128,
          129,
          130,
          131,
          0,
          132,
          133,
          0,
          134,
          135,
          136,
          137,
          0,
          0,
          0,
          0,
          0,
          0,
          0,
          0,
          0,
          0,
          0,
          0,
          0,
          0,
          0,
          0,
          138,
          0,
          139,
          0,
          0,
          0,
          0,
          140,
          141,
          142,
          143,
          0,
          0,
          0,
          0,
          0,
          144,
          0,
          0,
          0,
          145,
          0,
          0,
          146,
          147,
          148,
          149,
          0,
          0,
          0,
          0
        ];
        Typr$1.CFF.glyphByUnicode = function(cff, code) {
          for (var i = 0; i < cff.charset.length; i++)
            if (cff.charset[i] == code)
              return i;
          return -1;
        };
        Typr$1.CFF.glyphBySE = function(cff, charcode) {
          if (charcode < 0 || charcode > 255)
            return -1;
          return Typr$1.CFF.glyphByUnicode(cff, Typr$1.CFF.tableSE[charcode]);
        };
        Typr$1.CFF.readEncoding = function(data, offset, num) {
          Typr$1._bin;
          var array = [".notdef"];
          var format = data[offset];
          offset++;
          if (format == 0) {
            var nCodes = data[offset];
            offset++;
            for (var i = 0; i < nCodes; i++)
              array.push(data[offset + i]);
          } else
            throw "error: unknown encoding format: " + format;
          return array;
        };
        Typr$1.CFF.readCharset = function(data, offset, num) {
          var bin = Typr$1._bin;
          var charset = [".notdef"];
          var format = data[offset];
          offset++;
          if (format == 0) {
            for (var i = 0; i < num; i++) {
              var first = bin.readUshort(data, offset);
              offset += 2;
              charset.push(first);
            }
          } else if (format == 1 || format == 2) {
            while (charset.length < num) {
              var first = bin.readUshort(data, offset);
              offset += 2;
              var nLeft = 0;
              if (format == 1) {
                nLeft = data[offset];
                offset++;
              } else {
                nLeft = bin.readUshort(data, offset);
                offset += 2;
              }
              for (var i = 0; i <= nLeft; i++) {
                charset.push(first);
                first++;
              }
            }
          } else
            throw "error: format: " + format;
          return charset;
        };
        Typr$1.CFF.readIndex = function(data, offset, inds) {
          var bin = Typr$1._bin;
          var count = bin.readUshort(data, offset) + 1;
          offset += 2;
          var offsize = data[offset];
          offset++;
          if (offsize == 1)
            for (var i = 0; i < count; i++)
              inds.push(data[offset + i]);
          else if (offsize == 2)
            for (var i = 0; i < count; i++)
              inds.push(bin.readUshort(data, offset + i * 2));
          else if (offsize == 3)
            for (var i = 0; i < count; i++)
              inds.push(bin.readUint(data, offset + i * 3 - 1) & 16777215);
          else if (count != 1)
            throw "unsupported offset size: " + offsize + ", count: " + count;
          offset += count * offsize;
          return offset - 1;
        };
        Typr$1.CFF.getCharString = function(data, offset, o) {
          var bin = Typr$1._bin;
          var b0 = data[offset], b1 = data[offset + 1];
          data[offset + 2];
          data[offset + 3];
          data[offset + 4];
          var vs = 1;
          var op = null, val = null;
          if (b0 <= 20) {
            op = b0;
            vs = 1;
          }
          if (b0 == 12) {
            op = b0 * 100 + b1;
            vs = 2;
          }
          if (21 <= b0 && b0 <= 27) {
            op = b0;
            vs = 1;
          }
          if (b0 == 28) {
            val = bin.readShort(data, offset + 1);
            vs = 3;
          }
          if (29 <= b0 && b0 <= 31) {
            op = b0;
            vs = 1;
          }
          if (32 <= b0 && b0 <= 246) {
            val = b0 - 139;
            vs = 1;
          }
          if (247 <= b0 && b0 <= 250) {
            val = (b0 - 247) * 256 + b1 + 108;
            vs = 2;
          }
          if (251 <= b0 && b0 <= 254) {
            val = -(b0 - 251) * 256 - b1 - 108;
            vs = 2;
          }
          if (b0 == 255) {
            val = bin.readInt(data, offset + 1) / 65535;
            vs = 5;
          }
          o.val = val != null ? val : "o" + op;
          o.size = vs;
        };
        Typr$1.CFF.readCharString = function(data, offset, length) {
          var end = offset + length;
          var bin = Typr$1._bin;
          var arr = [];
          while (offset < end) {
            var b0 = data[offset], b1 = data[offset + 1];
            data[offset + 2];
            data[offset + 3];
            data[offset + 4];
            var vs = 1;
            var op = null, val = null;
            if (b0 <= 20) {
              op = b0;
              vs = 1;
            }
            if (b0 == 12) {
              op = b0 * 100 + b1;
              vs = 2;
            }
            if (b0 == 19 || b0 == 20) {
              op = b0;
              vs = 2;
            }
            if (21 <= b0 && b0 <= 27) {
              op = b0;
              vs = 1;
            }
            if (b0 == 28) {
              val = bin.readShort(data, offset + 1);
              vs = 3;
            }
            if (29 <= b0 && b0 <= 31) {
              op = b0;
              vs = 1;
            }
            if (32 <= b0 && b0 <= 246) {
              val = b0 - 139;
              vs = 1;
            }
            if (247 <= b0 && b0 <= 250) {
              val = (b0 - 247) * 256 + b1 + 108;
              vs = 2;
            }
            if (251 <= b0 && b0 <= 254) {
              val = -(b0 - 251) * 256 - b1 - 108;
              vs = 2;
            }
            if (b0 == 255) {
              val = bin.readInt(data, offset + 1) / 65535;
              vs = 5;
            }
            arr.push(val != null ? val : "o" + op);
            offset += vs;
          }
          return arr;
        };
        Typr$1.CFF.readDict = function(data, offset, end) {
          var bin = Typr$1._bin;
          var dict = {};
          var carr = [];
          while (offset < end) {
            var b0 = data[offset], b1 = data[offset + 1];
            data[offset + 2];
            data[offset + 3];
            data[offset + 4];
            var vs = 1;
            var key = null, val = null;
            if (b0 == 28) {
              val = bin.readShort(data, offset + 1);
              vs = 3;
            }
            if (b0 == 29) {
              val = bin.readInt(data, offset + 1);
              vs = 5;
            }
            if (32 <= b0 && b0 <= 246) {
              val = b0 - 139;
              vs = 1;
            }
            if (247 <= b0 && b0 <= 250) {
              val = (b0 - 247) * 256 + b1 + 108;
              vs = 2;
            }
            if (251 <= b0 && b0 <= 254) {
              val = -(b0 - 251) * 256 - b1 - 108;
              vs = 2;
            }
            if (b0 == 255) {
              val = bin.readInt(data, offset + 1) / 65535;
              vs = 5;
              throw "unknown number";
            }
            if (b0 == 30) {
              var nibs = [];
              vs = 1;
              while (true) {
                var b = data[offset + vs];
                vs++;
                var nib0 = b >> 4, nib1 = b & 15;
                if (nib0 != 15)
                  nibs.push(nib0);
                if (nib1 != 15)
                  nibs.push(nib1);
                if (nib1 == 15)
                  break;
              }
              var s = "";
              var chars = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, ".", "e", "e-", "reserved", "-", "endOfNumber"];
              for (var i = 0; i < nibs.length; i++)
                s += chars[nibs[i]];
              val = parseFloat(s);
            }
            if (b0 <= 21) {
              var keys = [
                "version",
                "Notice",
                "FullName",
                "FamilyName",
                "Weight",
                "FontBBox",
                "BlueValues",
                "OtherBlues",
                "FamilyBlues",
                "FamilyOtherBlues",
                "StdHW",
                "StdVW",
                "escape",
                "UniqueID",
                "XUID",
                "charset",
                "Encoding",
                "CharStrings",
                "Private",
                "Subrs",
                "defaultWidthX",
                "nominalWidthX"
              ];
              key = keys[b0];
              vs = 1;
              if (b0 == 12) {
                var keys = [
                  "Copyright",
                  "isFixedPitch",
                  "ItalicAngle",
                  "UnderlinePosition",
                  "UnderlineThickness",
                  "PaintType",
                  "CharstringType",
                  "FontMatrix",
                  "StrokeWidth",
                  "BlueScale",
                  "BlueShift",
                  "BlueFuzz",
                  "StemSnapH",
                  "StemSnapV",
                  "ForceBold",
                  0,
                  0,
                  "LanguageGroup",
                  "ExpansionFactor",
                  "initialRandomSeed",
                  "SyntheticBase",
                  "PostScript",
                  "BaseFontName",
                  "BaseFontBlend",
                  0,
                  0,
                  0,
                  0,
                  0,
                  0,
                  "ROS",
                  "CIDFontVersion",
                  "CIDFontRevision",
                  "CIDFontType",
                  "CIDCount",
                  "UIDBase",
                  "FDArray",
                  "FDSelect",
                  "FontName"
                ];
                key = keys[b1];
                vs = 2;
              }
            }
            if (key != null) {
              dict[key] = carr.length == 1 ? carr[0] : carr;
              carr = [];
            } else
              carr.push(val);
            offset += vs;
          }
          return dict;
        };
        Typr$1.cmap = {};
        Typr$1.cmap.parse = function(data, offset, length) {
          data = new Uint8Array(data.buffer, offset, length);
          offset = 0;
          var bin = Typr$1._bin;
          var obj = {};
          bin.readUshort(data, offset);
          offset += 2;
          var numTables = bin.readUshort(data, offset);
          offset += 2;
          var offs = [];
          obj.tables = [];
          for (var i = 0; i < numTables; i++) {
            var platformID = bin.readUshort(data, offset);
            offset += 2;
            var encodingID = bin.readUshort(data, offset);
            offset += 2;
            var noffset = bin.readUint(data, offset);
            offset += 4;
            var id = "p" + platformID + "e" + encodingID;
            var tind = offs.indexOf(noffset);
            if (tind == -1) {
              tind = obj.tables.length;
              var subt;
              offs.push(noffset);
              var format = bin.readUshort(data, noffset);
              if (format == 0)
                subt = Typr$1.cmap.parse0(data, noffset);
              else if (format == 4)
                subt = Typr$1.cmap.parse4(data, noffset);
              else if (format == 6)
                subt = Typr$1.cmap.parse6(data, noffset);
              else if (format == 12)
                subt = Typr$1.cmap.parse12(data, noffset);
              else
                console.warn("unknown format: " + format, platformID, encodingID, noffset);
              obj.tables.push(subt);
            }
            if (obj[id] != null)
              throw "multiple tables for one platform+encoding";
            obj[id] = tind;
          }
          return obj;
        };
        Typr$1.cmap.parse0 = function(data, offset) {
          var bin = Typr$1._bin;
          var obj = {};
          obj.format = bin.readUshort(data, offset);
          offset += 2;
          var len = bin.readUshort(data, offset);
          offset += 2;
          bin.readUshort(data, offset);
          offset += 2;
          obj.map = [];
          for (var i = 0; i < len - 6; i++)
            obj.map.push(data[offset + i]);
          return obj;
        };
        Typr$1.cmap.parse4 = function(data, offset) {
          var bin = Typr$1._bin;
          var offset0 = offset;
          var obj = {};
          obj.format = bin.readUshort(data, offset);
          offset += 2;
          var length = bin.readUshort(data, offset);
          offset += 2;
          bin.readUshort(data, offset);
          offset += 2;
          var segCountX2 = bin.readUshort(data, offset);
          offset += 2;
          var segCount = segCountX2 / 2;
          obj.searchRange = bin.readUshort(data, offset);
          offset += 2;
          obj.entrySelector = bin.readUshort(data, offset);
          offset += 2;
          obj.rangeShift = bin.readUshort(data, offset);
          offset += 2;
          obj.endCount = bin.readUshorts(data, offset, segCount);
          offset += segCount * 2;
          offset += 2;
          obj.startCount = bin.readUshorts(data, offset, segCount);
          offset += segCount * 2;
          obj.idDelta = [];
          for (var i = 0; i < segCount; i++) {
            obj.idDelta.push(bin.readShort(data, offset));
            offset += 2;
          }
          obj.idRangeOffset = bin.readUshorts(data, offset, segCount);
          offset += segCount * 2;
          obj.glyphIdArray = [];
          while (offset < offset0 + length) {
            obj.glyphIdArray.push(bin.readUshort(data, offset));
            offset += 2;
          }
          return obj;
        };
        Typr$1.cmap.parse6 = function(data, offset) {
          var bin = Typr$1._bin;
          var obj = {};
          obj.format = bin.readUshort(data, offset);
          offset += 2;
          bin.readUshort(data, offset);
          offset += 2;
          bin.readUshort(data, offset);
          offset += 2;
          obj.firstCode = bin.readUshort(data, offset);
          offset += 2;
          var entryCount = bin.readUshort(data, offset);
          offset += 2;
          obj.glyphIdArray = [];
          for (var i = 0; i < entryCount; i++) {
            obj.glyphIdArray.push(bin.readUshort(data, offset));
            offset += 2;
          }
          return obj;
        };
        Typr$1.cmap.parse12 = function(data, offset) {
          var bin = Typr$1._bin;
          var obj = {};
          obj.format = bin.readUshort(data, offset);
          offset += 2;
          offset += 2;
          bin.readUint(data, offset);
          offset += 4;
          bin.readUint(data, offset);
          offset += 4;
          var nGroups = bin.readUint(data, offset);
          offset += 4;
          obj.groups = [];
          for (var i = 0; i < nGroups; i++) {
            var off = offset + i * 12;
            var startCharCode = bin.readUint(data, off + 0);
            var endCharCode = bin.readUint(data, off + 4);
            var startGlyphID = bin.readUint(data, off + 8);
            obj.groups.push([startCharCode, endCharCode, startGlyphID]);
          }
          return obj;
        };
        Typr$1.glyf = {};
        Typr$1.glyf.parse = function(data, offset, length, font) {
          var obj = [];
          for (var g = 0; g < font.maxp.numGlyphs; g++)
            obj.push(null);
          return obj;
        };
        Typr$1.glyf._parseGlyf = function(font, g) {
          var bin = Typr$1._bin;
          var data = font._data;
          var offset = Typr$1._tabOffset(data, "glyf", font._offset) + font.loca[g];
          if (font.loca[g] == font.loca[g + 1])
            return null;
          var gl = {};
          gl.noc = bin.readShort(data, offset);
          offset += 2;
          gl.xMin = bin.readShort(data, offset);
          offset += 2;
          gl.yMin = bin.readShort(data, offset);
          offset += 2;
          gl.xMax = bin.readShort(data, offset);
          offset += 2;
          gl.yMax = bin.readShort(data, offset);
          offset += 2;
          if (gl.xMin >= gl.xMax || gl.yMin >= gl.yMax)
            return null;
          if (gl.noc > 0) {
            gl.endPts = [];
            for (var i = 0; i < gl.noc; i++) {
              gl.endPts.push(bin.readUshort(data, offset));
              offset += 2;
            }
            var instructionLength = bin.readUshort(data, offset);
            offset += 2;
            if (data.length - offset < instructionLength)
              return null;
            gl.instructions = bin.readBytes(data, offset, instructionLength);
            offset += instructionLength;
            var crdnum = gl.endPts[gl.noc - 1] + 1;
            gl.flags = [];
            for (var i = 0; i < crdnum; i++) {
              var flag = data[offset];
              offset++;
              gl.flags.push(flag);
              if ((flag & 8) != 0) {
                var rep = data[offset];
                offset++;
                for (var j = 0; j < rep; j++) {
                  gl.flags.push(flag);
                  i++;
                }
              }
            }
            gl.xs = [];
            for (var i = 0; i < crdnum; i++) {
              var i8 = (gl.flags[i] & 2) != 0, same = (gl.flags[i] & 16) != 0;
              if (i8) {
                gl.xs.push(same ? data[offset] : -data[offset]);
                offset++;
              } else {
                if (same)
                  gl.xs.push(0);
                else {
                  gl.xs.push(bin.readShort(data, offset));
                  offset += 2;
                }
              }
            }
            gl.ys = [];
            for (var i = 0; i < crdnum; i++) {
              var i8 = (gl.flags[i] & 4) != 0, same = (gl.flags[i] & 32) != 0;
              if (i8) {
                gl.ys.push(same ? data[offset] : -data[offset]);
                offset++;
              } else {
                if (same)
                  gl.ys.push(0);
                else {
                  gl.ys.push(bin.readShort(data, offset));
                  offset += 2;
                }
              }
            }
            var x = 0, y = 0;
            for (var i = 0; i < crdnum; i++) {
              x += gl.xs[i];
              y += gl.ys[i];
              gl.xs[i] = x;
              gl.ys[i] = y;
            }
          } else {
            var ARG_1_AND_2_ARE_WORDS = 1 << 0;
            var ARGS_ARE_XY_VALUES = 1 << 1;
            var WE_HAVE_A_SCALE = 1 << 3;
            var MORE_COMPONENTS = 1 << 5;
            var WE_HAVE_AN_X_AND_Y_SCALE = 1 << 6;
            var WE_HAVE_A_TWO_BY_TWO = 1 << 7;
            var WE_HAVE_INSTRUCTIONS = 1 << 8;
            gl.parts = [];
            var flags;
            do {
              flags = bin.readUshort(data, offset);
              offset += 2;
              var part = { m: { a: 1, b: 0, c: 0, d: 1, tx: 0, ty: 0 }, p1: -1, p2: -1 };
              gl.parts.push(part);
              part.glyphIndex = bin.readUshort(data, offset);
              offset += 2;
              if (flags & ARG_1_AND_2_ARE_WORDS) {
                var arg1 = bin.readShort(data, offset);
                offset += 2;
                var arg2 = bin.readShort(data, offset);
                offset += 2;
              } else {
                var arg1 = bin.readInt8(data, offset);
                offset++;
                var arg2 = bin.readInt8(data, offset);
                offset++;
              }
              if (flags & ARGS_ARE_XY_VALUES) {
                part.m.tx = arg1;
                part.m.ty = arg2;
              } else {
                part.p1 = arg1;
                part.p2 = arg2;
              }
              if (flags & WE_HAVE_A_SCALE) {
                part.m.a = part.m.d = bin.readF2dot14(data, offset);
                offset += 2;
              } else if (flags & WE_HAVE_AN_X_AND_Y_SCALE) {
                part.m.a = bin.readF2dot14(data, offset);
                offset += 2;
                part.m.d = bin.readF2dot14(data, offset);
                offset += 2;
              } else if (flags & WE_HAVE_A_TWO_BY_TWO) {
                part.m.a = bin.readF2dot14(data, offset);
                offset += 2;
                part.m.b = bin.readF2dot14(data, offset);
                offset += 2;
                part.m.c = bin.readF2dot14(data, offset);
                offset += 2;
                part.m.d = bin.readF2dot14(data, offset);
                offset += 2;
              }
            } while (flags & MORE_COMPONENTS);
            if (flags & WE_HAVE_INSTRUCTIONS) {
              var numInstr = bin.readUshort(data, offset);
              offset += 2;
              gl.instr = [];
              for (var i = 0; i < numInstr; i++) {
                gl.instr.push(data[offset]);
                offset++;
              }
            }
          }
          return gl;
        };
        Typr$1.GPOS = {};
        Typr$1.GPOS.parse = function(data, offset, length, font) {
          return Typr$1._lctf.parse(data, offset, length, font, Typr$1.GPOS.subt);
        };
        Typr$1.GPOS.subt = function(data, ltype, offset, ltable) {
          var bin = Typr$1._bin, offset0 = offset, tab = {};
          tab.fmt = bin.readUshort(data, offset);
          offset += 2;
          if (ltype == 1 || ltype == 2 || ltype == 3 || ltype == 7 || ltype == 8 && tab.fmt <= 2) {
            var covOff = bin.readUshort(data, offset);
            offset += 2;
            tab.coverage = Typr$1._lctf.readCoverage(data, covOff + offset0);
          }
          if (ltype == 1 && tab.fmt == 1) {
            var valFmt1 = bin.readUshort(data, offset);
            offset += 2;
            var ones1 = Typr$1._lctf.numOfOnes(valFmt1);
            if (valFmt1 != 0)
              tab.pos = Typr$1.GPOS.readValueRecord(data, offset, valFmt1);
          } else if (ltype == 2 && tab.fmt >= 1 && tab.fmt <= 2) {
            var valFmt1 = bin.readUshort(data, offset);
            offset += 2;
            var valFmt2 = bin.readUshort(data, offset);
            offset += 2;
            var ones1 = Typr$1._lctf.numOfOnes(valFmt1);
            var ones2 = Typr$1._lctf.numOfOnes(valFmt2);
            if (tab.fmt == 1) {
              tab.pairsets = [];
              var psc = bin.readUshort(data, offset);
              offset += 2;
              for (var i = 0; i < psc; i++) {
                var psoff = offset0 + bin.readUshort(data, offset);
                offset += 2;
                var pvc = bin.readUshort(data, psoff);
                psoff += 2;
                var arr = [];
                for (var j = 0; j < pvc; j++) {
                  var gid2 = bin.readUshort(data, psoff);
                  psoff += 2;
                  var value1, value2;
                  if (valFmt1 != 0) {
                    value1 = Typr$1.GPOS.readValueRecord(data, psoff, valFmt1);
                    psoff += ones1 * 2;
                  }
                  if (valFmt2 != 0) {
                    value2 = Typr$1.GPOS.readValueRecord(data, psoff, valFmt2);
                    psoff += ones2 * 2;
                  }
                  arr.push({ gid2, val1: value1, val2: value2 });
                }
                tab.pairsets.push(arr);
              }
            }
            if (tab.fmt == 2) {
              var classDef1 = bin.readUshort(data, offset);
              offset += 2;
              var classDef2 = bin.readUshort(data, offset);
              offset += 2;
              var class1Count = bin.readUshort(data, offset);
              offset += 2;
              var class2Count = bin.readUshort(data, offset);
              offset += 2;
              tab.classDef1 = Typr$1._lctf.readClassDef(data, offset0 + classDef1);
              tab.classDef2 = Typr$1._lctf.readClassDef(data, offset0 + classDef2);
              tab.matrix = [];
              for (var i = 0; i < class1Count; i++) {
                var row = [];
                for (var j = 0; j < class2Count; j++) {
                  var value1 = null, value2 = null;
                  if (valFmt1 != 0) {
                    value1 = Typr$1.GPOS.readValueRecord(data, offset, valFmt1);
                    offset += ones1 * 2;
                  }
                  if (valFmt2 != 0) {
                    value2 = Typr$1.GPOS.readValueRecord(data, offset, valFmt2);
                    offset += ones2 * 2;
                  }
                  row.push({ val1: value1, val2: value2 });
                }
                tab.matrix.push(row);
              }
            }
          } else if (ltype == 9 && tab.fmt == 1) {
            var extType = bin.readUshort(data, offset);
            offset += 2;
            var extOffset = bin.readUint(data, offset);
            offset += 4;
            if (ltable.ltype == 9) {
              ltable.ltype = extType;
            } else if (ltable.ltype != extType) {
              throw "invalid extension substitution";
            }
            return Typr$1.GPOS.subt(data, ltable.ltype, offset0 + extOffset);
          } else
            console.warn("unsupported GPOS table LookupType", ltype, "format", tab.fmt);
          return tab;
        };
        Typr$1.GPOS.readValueRecord = function(data, offset, valFmt) {
          var bin = Typr$1._bin;
          var arr = [];
          arr.push(valFmt & 1 ? bin.readShort(data, offset) : 0);
          offset += valFmt & 1 ? 2 : 0;
          arr.push(valFmt & 2 ? bin.readShort(data, offset) : 0);
          offset += valFmt & 2 ? 2 : 0;
          arr.push(valFmt & 4 ? bin.readShort(data, offset) : 0);
          offset += valFmt & 4 ? 2 : 0;
          arr.push(valFmt & 8 ? bin.readShort(data, offset) : 0);
          offset += valFmt & 8 ? 2 : 0;
          return arr;
        };
        Typr$1.GSUB = {};
        Typr$1.GSUB.parse = function(data, offset, length, font) {
          return Typr$1._lctf.parse(data, offset, length, font, Typr$1.GSUB.subt);
        };
        Typr$1.GSUB.subt = function(data, ltype, offset, ltable) {
          var bin = Typr$1._bin, offset0 = offset, tab = {};
          tab.fmt = bin.readUshort(data, offset);
          offset += 2;
          if (ltype != 1 && ltype != 4 && ltype != 5 && ltype != 6)
            return null;
          if (ltype == 1 || ltype == 4 || ltype == 5 && tab.fmt <= 2 || ltype == 6 && tab.fmt <= 2) {
            var covOff = bin.readUshort(data, offset);
            offset += 2;
            tab.coverage = Typr$1._lctf.readCoverage(data, offset0 + covOff);
          }
          if (ltype == 1 && tab.fmt >= 1 && tab.fmt <= 2) {
            if (tab.fmt == 1) {
              tab.delta = bin.readShort(data, offset);
              offset += 2;
            } else if (tab.fmt == 2) {
              var cnt = bin.readUshort(data, offset);
              offset += 2;
              tab.newg = bin.readUshorts(data, offset, cnt);
              offset += tab.newg.length * 2;
            }
          } else if (ltype == 4) {
            tab.vals = [];
            var cnt = bin.readUshort(data, offset);
            offset += 2;
            for (var i = 0; i < cnt; i++) {
              var loff = bin.readUshort(data, offset);
              offset += 2;
              tab.vals.push(Typr$1.GSUB.readLigatureSet(data, offset0 + loff));
            }
          } else if (ltype == 5 && tab.fmt == 2) {
            if (tab.fmt == 2) {
              var cDefOffset = bin.readUshort(data, offset);
              offset += 2;
              tab.cDef = Typr$1._lctf.readClassDef(data, offset0 + cDefOffset);
              tab.scset = [];
              var subClassSetCount = bin.readUshort(data, offset);
              offset += 2;
              for (var i = 0; i < subClassSetCount; i++) {
                var scsOff = bin.readUshort(data, offset);
                offset += 2;
                tab.scset.push(scsOff == 0 ? null : Typr$1.GSUB.readSubClassSet(data, offset0 + scsOff));
              }
            }
          } else if (ltype == 6 && tab.fmt == 3) {
            if (tab.fmt == 3) {
              for (var i = 0; i < 3; i++) {
                var cnt = bin.readUshort(data, offset);
                offset += 2;
                var cvgs = [];
                for (var j = 0; j < cnt; j++)
                  cvgs.push(Typr$1._lctf.readCoverage(data, offset0 + bin.readUshort(data, offset + j * 2)));
                offset += cnt * 2;
                if (i == 0)
                  tab.backCvg = cvgs;
                if (i == 1)
                  tab.inptCvg = cvgs;
                if (i == 2)
                  tab.ahedCvg = cvgs;
              }
              var cnt = bin.readUshort(data, offset);
              offset += 2;
              tab.lookupRec = Typr$1.GSUB.readSubstLookupRecords(data, offset, cnt);
            }
          } else if (ltype == 7 && tab.fmt == 1) {
            var extType = bin.readUshort(data, offset);
            offset += 2;
            var extOffset = bin.readUint(data, offset);
            offset += 4;
            if (ltable.ltype == 9) {
              ltable.ltype = extType;
            } else if (ltable.ltype != extType) {
              throw "invalid extension substitution";
            }
            return Typr$1.GSUB.subt(data, ltable.ltype, offset0 + extOffset);
          } else
            console.warn("unsupported GSUB table LookupType", ltype, "format", tab.fmt);
          return tab;
        };
        Typr$1.GSUB.readSubClassSet = function(data, offset) {
          var rUs = Typr$1._bin.readUshort, offset0 = offset, lset = [];
          var cnt = rUs(data, offset);
          offset += 2;
          for (var i = 0; i < cnt; i++) {
            var loff = rUs(data, offset);
            offset += 2;
            lset.push(Typr$1.GSUB.readSubClassRule(data, offset0 + loff));
          }
          return lset;
        };
        Typr$1.GSUB.readSubClassRule = function(data, offset) {
          var rUs = Typr$1._bin.readUshort, rule = {};
          var gcount = rUs(data, offset);
          offset += 2;
          var scount = rUs(data, offset);
          offset += 2;
          rule.input = [];
          for (var i = 0; i < gcount - 1; i++) {
            rule.input.push(rUs(data, offset));
            offset += 2;
          }
          rule.substLookupRecords = Typr$1.GSUB.readSubstLookupRecords(data, offset, scount);
          return rule;
        };
        Typr$1.GSUB.readSubstLookupRecords = function(data, offset, cnt) {
          var rUs = Typr$1._bin.readUshort;
          var out = [];
          for (var i = 0; i < cnt; i++) {
            out.push(rUs(data, offset), rUs(data, offset + 2));
            offset += 4;
          }
          return out;
        };
        Typr$1.GSUB.readChainSubClassSet = function(data, offset) {
          var bin = Typr$1._bin, offset0 = offset, lset = [];
          var cnt = bin.readUshort(data, offset);
          offset += 2;
          for (var i = 0; i < cnt; i++) {
            var loff = bin.readUshort(data, offset);
            offset += 2;
            lset.push(Typr$1.GSUB.readChainSubClassRule(data, offset0 + loff));
          }
          return lset;
        };
        Typr$1.GSUB.readChainSubClassRule = function(data, offset) {
          var bin = Typr$1._bin, rule = {};
          var pps = ["backtrack", "input", "lookahead"];
          for (var pi = 0; pi < pps.length; pi++) {
            var cnt = bin.readUshort(data, offset);
            offset += 2;
            if (pi == 1)
              cnt--;
            rule[pps[pi]] = bin.readUshorts(data, offset, cnt);
            offset += rule[pps[pi]].length * 2;
          }
          var cnt = bin.readUshort(data, offset);
          offset += 2;
          rule.subst = bin.readUshorts(data, offset, cnt * 2);
          offset += rule.subst.length * 2;
          return rule;
        };
        Typr$1.GSUB.readLigatureSet = function(data, offset) {
          var bin = Typr$1._bin, offset0 = offset, lset = [];
          var lcnt = bin.readUshort(data, offset);
          offset += 2;
          for (var j = 0; j < lcnt; j++) {
            var loff = bin.readUshort(data, offset);
            offset += 2;
            lset.push(Typr$1.GSUB.readLigature(data, offset0 + loff));
          }
          return lset;
        };
        Typr$1.GSUB.readLigature = function(data, offset) {
          var bin = Typr$1._bin, lig = { chain: [] };
          lig.nglyph = bin.readUshort(data, offset);
          offset += 2;
          var ccnt = bin.readUshort(data, offset);
          offset += 2;
          for (var k = 0; k < ccnt - 1; k++) {
            lig.chain.push(bin.readUshort(data, offset));
            offset += 2;
          }
          return lig;
        };
        Typr$1.head = {};
        Typr$1.head.parse = function(data, offset, length) {
          var bin = Typr$1._bin;
          var obj = {};
          bin.readFixed(data, offset);
          offset += 4;
          obj.fontRevision = bin.readFixed(data, offset);
          offset += 4;
          bin.readUint(data, offset);
          offset += 4;
          bin.readUint(data, offset);
          offset += 4;
          obj.flags = bin.readUshort(data, offset);
          offset += 2;
          obj.unitsPerEm = bin.readUshort(data, offset);
          offset += 2;
          obj.created = bin.readUint64(data, offset);
          offset += 8;
          obj.modified = bin.readUint64(data, offset);
          offset += 8;
          obj.xMin = bin.readShort(data, offset);
          offset += 2;
          obj.yMin = bin.readShort(data, offset);
          offset += 2;
          obj.xMax = bin.readShort(data, offset);
          offset += 2;
          obj.yMax = bin.readShort(data, offset);
          offset += 2;
          obj.macStyle = bin.readUshort(data, offset);
          offset += 2;
          obj.lowestRecPPEM = bin.readUshort(data, offset);
          offset += 2;
          obj.fontDirectionHint = bin.readShort(data, offset);
          offset += 2;
          obj.indexToLocFormat = bin.readShort(data, offset);
          offset += 2;
          obj.glyphDataFormat = bin.readShort(data, offset);
          offset += 2;
          return obj;
        };
        Typr$1.hhea = {};
        Typr$1.hhea.parse = function(data, offset, length) {
          var bin = Typr$1._bin;
          var obj = {};
          bin.readFixed(data, offset);
          offset += 4;
          obj.ascender = bin.readShort(data, offset);
          offset += 2;
          obj.descender = bin.readShort(data, offset);
          offset += 2;
          obj.lineGap = bin.readShort(data, offset);
          offset += 2;
          obj.advanceWidthMax = bin.readUshort(data, offset);
          offset += 2;
          obj.minLeftSideBearing = bin.readShort(data, offset);
          offset += 2;
          obj.minRightSideBearing = bin.readShort(data, offset);
          offset += 2;
          obj.xMaxExtent = bin.readShort(data, offset);
          offset += 2;
          obj.caretSlopeRise = bin.readShort(data, offset);
          offset += 2;
          obj.caretSlopeRun = bin.readShort(data, offset);
          offset += 2;
          obj.caretOffset = bin.readShort(data, offset);
          offset += 2;
          offset += 4 * 2;
          obj.metricDataFormat = bin.readShort(data, offset);
          offset += 2;
          obj.numberOfHMetrics = bin.readUshort(data, offset);
          offset += 2;
          return obj;
        };
        Typr$1.hmtx = {};
        Typr$1.hmtx.parse = function(data, offset, length, font) {
          var bin = Typr$1._bin;
          var obj = {};
          obj.aWidth = [];
          obj.lsBearing = [];
          var aw = 0, lsb = 0;
          for (var i = 0; i < font.maxp.numGlyphs; i++) {
            if (i < font.hhea.numberOfHMetrics) {
              aw = bin.readUshort(data, offset);
              offset += 2;
              lsb = bin.readShort(data, offset);
              offset += 2;
            }
            obj.aWidth.push(aw);
            obj.lsBearing.push(lsb);
          }
          return obj;
        };
        Typr$1.kern = {};
        Typr$1.kern.parse = function(data, offset, length, font) {
          var bin = Typr$1._bin;
          var version = bin.readUshort(data, offset);
          offset += 2;
          if (version == 1)
            return Typr$1.kern.parseV1(data, offset - 2, length, font);
          var nTables = bin.readUshort(data, offset);
          offset += 2;
          var map = { glyph1: [], rval: [] };
          for (var i = 0; i < nTables; i++) {
            offset += 2;
            var length = bin.readUshort(data, offset);
            offset += 2;
            var coverage = bin.readUshort(data, offset);
            offset += 2;
            var format = coverage >>> 8;
            format &= 15;
            if (format == 0)
              offset = Typr$1.kern.readFormat0(data, offset, map);
            else
              throw "unknown kern table format: " + format;
          }
          return map;
        };
        Typr$1.kern.parseV1 = function(data, offset, length, font) {
          var bin = Typr$1._bin;
          bin.readFixed(data, offset);
          offset += 4;
          var nTables = bin.readUint(data, offset);
          offset += 4;
          var map = { glyph1: [], rval: [] };
          for (var i = 0; i < nTables; i++) {
            bin.readUint(data, offset);
            offset += 4;
            var coverage = bin.readUshort(data, offset);
            offset += 2;
            bin.readUshort(data, offset);
            offset += 2;
            var format = coverage >>> 8;
            format &= 15;
            if (format == 0)
              offset = Typr$1.kern.readFormat0(data, offset, map);
            else
              throw "unknown kern table format: " + format;
          }
          return map;
        };
        Typr$1.kern.readFormat0 = function(data, offset, map) {
          var bin = Typr$1._bin;
          var pleft = -1;
          var nPairs = bin.readUshort(data, offset);
          offset += 2;
          bin.readUshort(data, offset);
          offset += 2;
          bin.readUshort(data, offset);
          offset += 2;
          bin.readUshort(data, offset);
          offset += 2;
          for (var j = 0; j < nPairs; j++) {
            var left = bin.readUshort(data, offset);
            offset += 2;
            var right = bin.readUshort(data, offset);
            offset += 2;
            var value = bin.readShort(data, offset);
            offset += 2;
            if (left != pleft) {
              map.glyph1.push(left);
              map.rval.push({ glyph2: [], vals: [] });
            }
            var rval = map.rval[map.rval.length - 1];
            rval.glyph2.push(right);
            rval.vals.push(value);
            pleft = left;
          }
          return offset;
        };
        Typr$1.loca = {};
        Typr$1.loca.parse = function(data, offset, length, font) {
          var bin = Typr$1._bin;
          var obj = [];
          var ver = font.head.indexToLocFormat;
          var len = font.maxp.numGlyphs + 1;
          if (ver == 0)
            for (var i = 0; i < len; i++)
              obj.push(bin.readUshort(data, offset + (i << 1)) << 1);
          if (ver == 1)
            for (var i = 0; i < len; i++)
              obj.push(bin.readUint(data, offset + (i << 2)));
          return obj;
        };
        Typr$1.maxp = {};
        Typr$1.maxp.parse = function(data, offset, length) {
          var bin = Typr$1._bin;
          var obj = {};
          var ver = bin.readUint(data, offset);
          offset += 4;
          obj.numGlyphs = bin.readUshort(data, offset);
          offset += 2;
          if (ver == 65536) {
            obj.maxPoints = bin.readUshort(data, offset);
            offset += 2;
            obj.maxContours = bin.readUshort(data, offset);
            offset += 2;
            obj.maxCompositePoints = bin.readUshort(data, offset);
            offset += 2;
            obj.maxCompositeContours = bin.readUshort(data, offset);
            offset += 2;
            obj.maxZones = bin.readUshort(data, offset);
            offset += 2;
            obj.maxTwilightPoints = bin.readUshort(data, offset);
            offset += 2;
            obj.maxStorage = bin.readUshort(data, offset);
            offset += 2;
            obj.maxFunctionDefs = bin.readUshort(data, offset);
            offset += 2;
            obj.maxInstructionDefs = bin.readUshort(data, offset);
            offset += 2;
            obj.maxStackElements = bin.readUshort(data, offset);
            offset += 2;
            obj.maxSizeOfInstructions = bin.readUshort(data, offset);
            offset += 2;
            obj.maxComponentElements = bin.readUshort(data, offset);
            offset += 2;
            obj.maxComponentDepth = bin.readUshort(data, offset);
            offset += 2;
          }
          return obj;
        };
        Typr$1.name = {};
        Typr$1.name.parse = function(data, offset, length) {
          var bin = Typr$1._bin;
          var obj = {};
          bin.readUshort(data, offset);
          offset += 2;
          var count = bin.readUshort(data, offset);
          offset += 2;
          bin.readUshort(data, offset);
          offset += 2;
          var names = [
            "copyright",
            "fontFamily",
            "fontSubfamily",
            "ID",
            "fullName",
            "version",
            "postScriptName",
            "trademark",
            "manufacturer",
            "designer",
            "description",
            "urlVendor",
            "urlDesigner",
            "licence",
            "licenceURL",
            "---",
            "typoFamilyName",
            "typoSubfamilyName",
            "compatibleFull",
            "sampleText",
            "postScriptCID",
            "wwsFamilyName",
            "wwsSubfamilyName",
            "lightPalette",
            "darkPalette"
          ];
          var offset0 = offset;
          for (var i = 0; i < count; i++) {
            var platformID = bin.readUshort(data, offset);
            offset += 2;
            var encodingID = bin.readUshort(data, offset);
            offset += 2;
            var languageID = bin.readUshort(data, offset);
            offset += 2;
            var nameID = bin.readUshort(data, offset);
            offset += 2;
            var slen = bin.readUshort(data, offset);
            offset += 2;
            var noffset = bin.readUshort(data, offset);
            offset += 2;
            var cname = names[nameID];
            var soff = offset0 + count * 12 + noffset;
            var str;
            if (platformID == 0)
              str = bin.readUnicode(data, soff, slen / 2);
            else if (platformID == 3 && encodingID == 0)
              str = bin.readUnicode(data, soff, slen / 2);
            else if (encodingID == 0)
              str = bin.readASCII(data, soff, slen);
            else if (encodingID == 1)
              str = bin.readUnicode(data, soff, slen / 2);
            else if (encodingID == 3)
              str = bin.readUnicode(data, soff, slen / 2);
            else if (platformID == 1) {
              str = bin.readASCII(data, soff, slen);
              console.warn("reading unknown MAC encoding " + encodingID + " as ASCII");
            } else
              throw "unknown encoding " + encodingID + ", platformID: " + platformID;
            var tid = "p" + platformID + "," + languageID.toString(16);
            if (obj[tid] == null)
              obj[tid] = {};
            obj[tid][cname !== void 0 ? cname : nameID] = str;
            obj[tid]._lang = languageID;
          }
          for (var p in obj)
            if (obj[p].postScriptName != null && obj[p]._lang == 1033)
              return obj[p];
          for (var p in obj)
            if (obj[p].postScriptName != null && obj[p]._lang == 0)
              return obj[p];
          for (var p in obj)
            if (obj[p].postScriptName != null && obj[p]._lang == 3084)
              return obj[p];
          for (var p in obj)
            if (obj[p].postScriptName != null)
              return obj[p];
          var tname;
          for (var p in obj) {
            tname = p;
            break;
          }
          console.warn("returning name table with languageID " + obj[tname]._lang);
          return obj[tname];
        };
        Typr$1["OS/2"] = {};
        Typr$1["OS/2"].parse = function(data, offset, length) {
          var bin = Typr$1._bin;
          var ver = bin.readUshort(data, offset);
          offset += 2;
          var obj = {};
          if (ver == 0)
            Typr$1["OS/2"].version0(data, offset, obj);
          else if (ver == 1)
            Typr$1["OS/2"].version1(data, offset, obj);
          else if (ver == 2 || ver == 3 || ver == 4)
            Typr$1["OS/2"].version2(data, offset, obj);
          else if (ver == 5)
            Typr$1["OS/2"].version5(data, offset, obj);
          else
            throw "unknown OS/2 table version: " + ver;
          return obj;
        };
        Typr$1["OS/2"].version0 = function(data, offset, obj) {
          var bin = Typr$1._bin;
          obj.xAvgCharWidth = bin.readShort(data, offset);
          offset += 2;
          obj.usWeightClass = bin.readUshort(data, offset);
          offset += 2;
          obj.usWidthClass = bin.readUshort(data, offset);
          offset += 2;
          obj.fsType = bin.readUshort(data, offset);
          offset += 2;
          obj.ySubscriptXSize = bin.readShort(data, offset);
          offset += 2;
          obj.ySubscriptYSize = bin.readShort(data, offset);
          offset += 2;
          obj.ySubscriptXOffset = bin.readShort(data, offset);
          offset += 2;
          obj.ySubscriptYOffset = bin.readShort(data, offset);
          offset += 2;
          obj.ySuperscriptXSize = bin.readShort(data, offset);
          offset += 2;
          obj.ySuperscriptYSize = bin.readShort(data, offset);
          offset += 2;
          obj.ySuperscriptXOffset = bin.readShort(data, offset);
          offset += 2;
          obj.ySuperscriptYOffset = bin.readShort(data, offset);
          offset += 2;
          obj.yStrikeoutSize = bin.readShort(data, offset);
          offset += 2;
          obj.yStrikeoutPosition = bin.readShort(data, offset);
          offset += 2;
          obj.sFamilyClass = bin.readShort(data, offset);
          offset += 2;
          obj.panose = bin.readBytes(data, offset, 10);
          offset += 10;
          obj.ulUnicodeRange1 = bin.readUint(data, offset);
          offset += 4;
          obj.ulUnicodeRange2 = bin.readUint(data, offset);
          offset += 4;
          obj.ulUnicodeRange3 = bin.readUint(data, offset);
          offset += 4;
          obj.ulUnicodeRange4 = bin.readUint(data, offset);
          offset += 4;
          obj.achVendID = [bin.readInt8(data, offset), bin.readInt8(data, offset + 1), bin.readInt8(data, offset + 2), bin.readInt8(data, offset + 3)];
          offset += 4;
          obj.fsSelection = bin.readUshort(data, offset);
          offset += 2;
          obj.usFirstCharIndex = bin.readUshort(data, offset);
          offset += 2;
          obj.usLastCharIndex = bin.readUshort(data, offset);
          offset += 2;
          obj.sTypoAscender = bin.readShort(data, offset);
          offset += 2;
          obj.sTypoDescender = bin.readShort(data, offset);
          offset += 2;
          obj.sTypoLineGap = bin.readShort(data, offset);
          offset += 2;
          obj.usWinAscent = bin.readUshort(data, offset);
          offset += 2;
          obj.usWinDescent = bin.readUshort(data, offset);
          offset += 2;
          return offset;
        };
        Typr$1["OS/2"].version1 = function(data, offset, obj) {
          var bin = Typr$1._bin;
          offset = Typr$1["OS/2"].version0(data, offset, obj);
          obj.ulCodePageRange1 = bin.readUint(data, offset);
          offset += 4;
          obj.ulCodePageRange2 = bin.readUint(data, offset);
          offset += 4;
          return offset;
        };
        Typr$1["OS/2"].version2 = function(data, offset, obj) {
          var bin = Typr$1._bin;
          offset = Typr$1["OS/2"].version1(data, offset, obj);
          obj.sxHeight = bin.readShort(data, offset);
          offset += 2;
          obj.sCapHeight = bin.readShort(data, offset);
          offset += 2;
          obj.usDefault = bin.readUshort(data, offset);
          offset += 2;
          obj.usBreak = bin.readUshort(data, offset);
          offset += 2;
          obj.usMaxContext = bin.readUshort(data, offset);
          offset += 2;
          return offset;
        };
        Typr$1["OS/2"].version5 = function(data, offset, obj) {
          var bin = Typr$1._bin;
          offset = Typr$1["OS/2"].version2(data, offset, obj);
          obj.usLowerOpticalPointSize = bin.readUshort(data, offset);
          offset += 2;
          obj.usUpperOpticalPointSize = bin.readUshort(data, offset);
          offset += 2;
          return offset;
        };
        Typr$1.post = {};
        Typr$1.post.parse = function(data, offset, length) {
          var bin = Typr$1._bin;
          var obj = {};
          obj.version = bin.readFixed(data, offset);
          offset += 4;
          obj.italicAngle = bin.readFixed(data, offset);
          offset += 4;
          obj.underlinePosition = bin.readShort(data, offset);
          offset += 2;
          obj.underlineThickness = bin.readShort(data, offset);
          offset += 2;
          return obj;
        };
        Typr$1.SVG = {};
        Typr$1.SVG.parse = function(data, offset, length) {
          var bin = Typr$1._bin;
          var obj = { entries: [] };
          var offset0 = offset;
          bin.readUshort(data, offset);
          offset += 2;
          var svgDocIndexOffset = bin.readUint(data, offset);
          offset += 4;
          bin.readUint(data, offset);
          offset += 4;
          offset = svgDocIndexOffset + offset0;
          var numEntries = bin.readUshort(data, offset);
          offset += 2;
          for (var i = 0; i < numEntries; i++) {
            var startGlyphID = bin.readUshort(data, offset);
            offset += 2;
            var endGlyphID = bin.readUshort(data, offset);
            offset += 2;
            var svgDocOffset = bin.readUint(data, offset);
            offset += 4;
            var svgDocLength = bin.readUint(data, offset);
            offset += 4;
            var sbuf = new Uint8Array(data.buffer, offset0 + svgDocOffset + svgDocIndexOffset, svgDocLength);
            var svg = bin.readUTF8(sbuf, 0, sbuf.length);
            for (var f = startGlyphID; f <= endGlyphID; f++) {
              obj.entries[f] = svg;
            }
          }
          return obj;
        };
        Typr$1.SVG.toPath = function(str) {
          var pth = { cmds: [], crds: [] };
          if (str == null)
            return pth;
          var prsr = new DOMParser();
          var doc = prsr["parseFromString"](str, "image/svg+xml");
          var svg = doc.firstChild;
          while (svg.tagName != "svg")
            svg = svg.nextSibling;
          var vb = svg.getAttribute("viewBox");
          if (vb)
            vb = vb.trim().split(" ").map(parseFloat);
          else
            vb = [0, 0, 1e3, 1e3];
          Typr$1.SVG._toPath(svg.children, pth);
          for (var i = 0; i < pth.crds.length; i += 2) {
            var x = pth.crds[i], y = pth.crds[i + 1];
            x -= vb[0];
            y -= vb[1];
            y = -y;
            pth.crds[i] = x;
            pth.crds[i + 1] = y;
          }
          return pth;
        };
        Typr$1.SVG._toPath = function(nds, pth, fill) {
          for (var ni = 0; ni < nds.length; ni++) {
            var nd = nds[ni], tn = nd.tagName;
            var cfl = nd.getAttribute("fill");
            if (cfl == null)
              cfl = fill;
            if (tn == "g")
              Typr$1.SVG._toPath(nd.children, pth, cfl);
            else if (tn == "path") {
              pth.cmds.push(cfl ? cfl : "#000000");
              var d = nd.getAttribute("d");
              var toks = Typr$1.SVG._tokens(d);
              Typr$1.SVG._toksToPath(toks, pth);
              pth.cmds.push("X");
            } else if (tn == "defs") ;
            else
              console.warn(tn, nd);
          }
        };
        Typr$1.SVG._tokens = function(d) {
          var ts = [], off = 0, rn = false, cn = "";
          while (off < d.length) {
            var cc = d.charCodeAt(off), ch = d.charAt(off);
            off++;
            var isNum = 48 <= cc && cc <= 57 || ch == "." || ch == "-";
            if (rn) {
              if (ch == "-") {
                ts.push(parseFloat(cn));
                cn = ch;
              } else if (isNum)
                cn += ch;
              else {
                ts.push(parseFloat(cn));
                if (ch != "," && ch != " ")
                  ts.push(ch);
                rn = false;
              }
            } else {
              if (isNum) {
                cn = ch;
                rn = true;
              } else if (ch != "," && ch != " ")
                ts.push(ch);
            }
          }
          if (rn)
            ts.push(parseFloat(cn));
          return ts;
        };
        Typr$1.SVG._toksToPath = function(ts, pth) {
          var i = 0, x = 0, y = 0, ox = 0, oy = 0;
          var pc = { "M": 2, "L": 2, "H": 1, "V": 1, "S": 4, "C": 6 };
          var cmds = pth.cmds, crds = pth.crds;
          while (i < ts.length) {
            var cmd = ts[i];
            i++;
            if (cmd == "z") {
              cmds.push("Z");
              x = ox;
              y = oy;
            } else {
              var cmu = cmd.toUpperCase();
              var ps = pc[cmu], reps = Typr$1.SVG._reps(ts, i, ps);
              for (var j = 0; j < reps; j++) {
                var xi = 0, yi = 0;
                if (cmd != cmu) {
                  xi = x;
                  yi = y;
                }
                if (cmu == "M") {
                  x = xi + ts[i++];
                  y = yi + ts[i++];
                  cmds.push("M");
                  crds.push(x, y);
                  ox = x;
                  oy = y;
                } else if (cmu == "L") {
                  x = xi + ts[i++];
                  y = yi + ts[i++];
                  cmds.push("L");
                  crds.push(x, y);
                } else if (cmu == "H") {
                  x = xi + ts[i++];
                  cmds.push("L");
                  crds.push(x, y);
                } else if (cmu == "V") {
                  y = yi + ts[i++];
                  cmds.push("L");
                  crds.push(x, y);
                } else if (cmu == "C") {
                  var x1 = xi + ts[i++], y1 = yi + ts[i++], x2 = xi + ts[i++], y2 = yi + ts[i++], x3 = xi + ts[i++], y3 = yi + ts[i++];
                  cmds.push("C");
                  crds.push(x1, y1, x2, y2, x3, y3);
                  x = x3;
                  y = y3;
                } else if (cmu == "S") {
                  var co = Math.max(crds.length - 4, 0);
                  var x1 = x + x - crds[co], y1 = y + y - crds[co + 1];
                  var x2 = xi + ts[i++], y2 = yi + ts[i++], x3 = xi + ts[i++], y3 = yi + ts[i++];
                  cmds.push("C");
                  crds.push(x1, y1, x2, y2, x3, y3);
                  x = x3;
                  y = y3;
                } else
                  console.warn("Unknown SVG command " + cmd);
              }
            }
          }
        };
        Typr$1.SVG._reps = function(ts, off, ps) {
          var i = off;
          while (i < ts.length) {
            if (typeof ts[i] == "string")
              break;
            i += ps;
          }
          return (i - off) / ps;
        };
        if (Typr$1 == null)
          Typr$1 = {};
        if (Typr$1.U == null)
          Typr$1.U = {};
        Typr$1.U.codeToGlyph = function(font, code) {
          var cmap = font.cmap;
          for (var _i = 0, _a = [cmap.p0e4, cmap.p3e1, cmap.p3e10, cmap.p0e3, cmap.p1e0]; _i < _a.length; _i++) {
            var tind = _a[_i];
            if (tind == null)
              continue;
            var tab = cmap.tables[tind];
            if (tab.format == 0) {
              if (code >= tab.map.length)
                continue;
              return tab.map[code];
            } else if (tab.format == 4) {
              var sind = -1;
              for (var i = 0; i < tab.endCount.length; i++) {
                if (code <= tab.endCount[i]) {
                  sind = i;
                  break;
                }
              }
              if (sind == -1)
                continue;
              if (tab.startCount[sind] > code)
                continue;
              var gli = 0;
              if (tab.idRangeOffset[sind] != 0) {
                gli = tab.glyphIdArray[code - tab.startCount[sind] + (tab.idRangeOffset[sind] >> 1) - (tab.idRangeOffset.length - sind)];
              } else {
                gli = code + tab.idDelta[sind];
              }
              return gli & 65535;
            } else if (tab.format == 12) {
              if (code > tab.groups[tab.groups.length - 1][1])
                continue;
              for (var i = 0; i < tab.groups.length; i++) {
                var grp = tab.groups[i];
                if (grp[0] <= code && code <= grp[1])
                  return grp[2] + (code - grp[0]);
              }
              continue;
            } else {
              throw "unknown cmap table format " + tab.format;
            }
          }
          return 0;
        };
        Typr$1.U.glyphToPath = function(font, gid) {
          var path = { cmds: [], crds: [] };
          if (font.SVG && font.SVG.entries[gid]) {
            var p = font.SVG.entries[gid];
            if (p == null)
              return path;
            if (typeof p == "string") {
              p = Typr$1.SVG.toPath(p);
              font.SVG.entries[gid] = p;
            }
            return p;
          } else if (font.CFF) {
            var state = { x: 0, y: 0, stack: [], nStems: 0, haveWidth: false, width: font.CFF.Private ? font.CFF.Private.defaultWidthX : 0, open: false };
            var cff = font.CFF, pdct = font.CFF.Private;
            if (cff.ROS) {
              var gi = 0;
              while (cff.FDSelect[gi + 2] <= gid)
                gi += 2;
              pdct = cff.FDArray[cff.FDSelect[gi + 1]].Private;
            }
            Typr$1.U._drawCFF(font.CFF.CharStrings[gid], state, cff, pdct, path);
          } else if (font.glyf) {
            Typr$1.U._drawGlyf(gid, font, path);
          }
          return path;
        };
        Typr$1.U._drawGlyf = function(gid, font, path) {
          var gl = font.glyf[gid];
          if (gl == null)
            gl = font.glyf[gid] = Typr$1.glyf._parseGlyf(font, gid);
          if (gl != null) {
            if (gl.noc > -1) {
              Typr$1.U._simpleGlyph(gl, path);
            } else {
              Typr$1.U._compoGlyph(gl, font, path);
            }
          }
        };
        Typr$1.U._simpleGlyph = function(gl, p) {
          for (var c = 0; c < gl.noc; c++) {
            var i0 = c == 0 ? 0 : gl.endPts[c - 1] + 1;
            var il = gl.endPts[c];
            for (var i = i0; i <= il; i++) {
              var pr = i == i0 ? il : i - 1;
              var nx = i == il ? i0 : i + 1;
              var onCurve = gl.flags[i] & 1;
              var prOnCurve = gl.flags[pr] & 1;
              var nxOnCurve = gl.flags[nx] & 1;
              var x = gl.xs[i], y = gl.ys[i];
              if (i == i0) {
                if (onCurve) {
                  if (prOnCurve) {
                    Typr$1.U.P.moveTo(p, gl.xs[pr], gl.ys[pr]);
                  } else {
                    Typr$1.U.P.moveTo(p, x, y);
                    continue;
                  }
                } else {
                  if (prOnCurve) {
                    Typr$1.U.P.moveTo(p, gl.xs[pr], gl.ys[pr]);
                  } else {
                    Typr$1.U.P.moveTo(p, (gl.xs[pr] + x) / 2, (gl.ys[pr] + y) / 2);
                  }
                }
              }
              if (onCurve) {
                if (prOnCurve)
                  Typr$1.U.P.lineTo(p, x, y);
              } else {
                if (nxOnCurve) {
                  Typr$1.U.P.qcurveTo(p, x, y, gl.xs[nx], gl.ys[nx]);
                } else {
                  Typr$1.U.P.qcurveTo(p, x, y, (x + gl.xs[nx]) / 2, (y + gl.ys[nx]) / 2);
                }
              }
            }
            Typr$1.U.P.closePath(p);
          }
        };
        Typr$1.U._compoGlyph = function(gl, font, p) {
          for (var j = 0; j < gl.parts.length; j++) {
            var path = { cmds: [], crds: [] };
            var prt = gl.parts[j];
            Typr$1.U._drawGlyf(prt.glyphIndex, font, path);
            var m = prt.m;
            for (var i = 0; i < path.crds.length; i += 2) {
              var x = path.crds[i], y = path.crds[i + 1];
              p.crds.push(x * m.a + y * m.b + m.tx);
              p.crds.push(x * m.c + y * m.d + m.ty);
            }
            for (var i = 0; i < path.cmds.length; i++) {
              p.cmds.push(path.cmds[i]);
            }
          }
        };
        Typr$1.U._getGlyphClass = function(g, cd) {
          var intr = Typr$1._lctf.getInterval(cd, g);
          return intr == -1 ? 0 : cd[intr + 2];
        };
        Typr$1.U.getPairAdjustment = function(font, g1, g2) {
          var hasGPOSkern = false;
          if (font.GPOS) {
            var gpos = font["GPOS"];
            var llist = gpos.lookupList, flist = gpos.featureList;
            var tused = [];
            for (var i = 0; i < flist.length; i++) {
              var fl = flist[i];
              if (fl.tag != "kern")
                continue;
              hasGPOSkern = true;
              for (var ti = 0; ti < fl.tab.length; ti++) {
                if (tused[fl.tab[ti]])
                  continue;
                tused[fl.tab[ti]] = true;
                var tab = llist[fl.tab[ti]];
                for (var j = 0; j < tab.tabs.length; j++) {
                  if (tab.tabs[j] == null)
                    continue;
                  var ltab = tab.tabs[j], ind;
                  if (ltab.coverage) {
                    ind = Typr$1._lctf.coverageIndex(ltab.coverage, g1);
                    if (ind == -1)
                      continue;
                  }
                  if (tab.ltype == 1) ;
                  else if (tab.ltype == 2) {
                    var adj = null;
                    if (ltab.fmt == 1) {
                      var right = ltab.pairsets[ind];
                      for (var i = 0; i < right.length; i++) {
                        if (right[i].gid2 == g2)
                          adj = right[i];
                      }
                    } else if (ltab.fmt == 2) {
                      var c1 = Typr$1.U._getGlyphClass(g1, ltab.classDef1);
                      var c2 = Typr$1.U._getGlyphClass(g2, ltab.classDef2);
                      adj = ltab.matrix[c1][c2];
                    }
                    if (adj) {
                      var offset = 0;
                      if (adj.val1 && adj.val1[2])
                        offset += adj.val1[2];
                      if (adj.val2 && adj.val2[0])
                        offset += adj.val2[0];
                      return offset;
                    }
                  }
                }
              }
            }
          }
          if (font.kern && !hasGPOSkern) {
            var ind1 = font.kern.glyph1.indexOf(g1);
            if (ind1 != -1) {
              var ind2 = font.kern.rval[ind1].glyph2.indexOf(g2);
              if (ind2 != -1)
                return font.kern.rval[ind1].vals[ind2];
            }
          }
          return 0;
        };
        Typr$1.U.stringToGlyphs = function(font, str) {
          var gls = [];
          for (var i = 0; i < str.length; i++) {
            var cc = str.codePointAt(i);
            if (cc > 65535)
              i++;
            gls.push(Typr$1.U.codeToGlyph(font, cc));
          }
          for (var i = 0; i < str.length; i++) {
            var cc = str.codePointAt(i);
            if (cc == 2367) {
              var t = gls[i - 1];
              gls[i - 1] = gls[i];
              gls[i] = t;
            }
            if (cc > 65535)
              i++;
          }
          var gsub = font["GSUB"];
          if (gsub == null)
            return gls;
          var llist = gsub.lookupList, flist = gsub.featureList;
          var cligs = [
            "rlig",
            "liga",
            "mset",
            "isol",
            "init",
            "fina",
            "medi",
            "half",
            "pres",
            "blws"
            /* Tibetan fonts like Himalaya.ttf */
          ];
          var tused = [];
          for (var fi = 0; fi < flist.length; fi++) {
            var fl = flist[fi];
            if (cligs.indexOf(fl.tag) == -1)
              continue;
            for (var ti = 0; ti < fl.tab.length; ti++) {
              if (tused[fl.tab[ti]])
                continue;
              tused[fl.tab[ti]] = true;
              var tab = llist[fl.tab[ti]];
              for (var ci = 0; ci < gls.length; ci++) {
                var feat = Typr$1.U._getWPfeature(str, ci);
                if ("isol,init,fina,medi".indexOf(fl.tag) != -1 && fl.tag != feat)
                  continue;
                Typr$1.U._applySubs(gls, ci, tab, llist);
              }
            }
          }
          return gls;
        };
        Typr$1.U._getWPfeature = function(str, ci) {
          var wsep = '\n	" ,.:;!?()  ،';
          var R = "آأؤإاةدذرزوٱٲٳٵٶٷڈډڊڋڌڍڎڏڐڑڒړڔڕږڗژڙۀۃۄۅۆۇۈۉۊۋۍۏےۓەۮۯܐܕܖܗܘܙܞܨܪܬܯݍݙݚݛݫݬݱݳݴݸݹࡀࡆࡇࡉࡔࡧࡩࡪࢪࢫࢬࢮࢱࢲࢹૅેૉ૊૎૏ૐ૑૒૝ૡ૤૯஁ஃ஄அஉ஌எஏ஑னப஫஬";
          var L = "ꡲ્૗";
          var slft = ci == 0 || wsep.indexOf(str[ci - 1]) != -1;
          var srgt = ci == str.length - 1 || wsep.indexOf(str[ci + 1]) != -1;
          if (!slft && R.indexOf(str[ci - 1]) != -1)
            slft = true;
          if (!srgt && R.indexOf(str[ci]) != -1)
            srgt = true;
          if (!srgt && L.indexOf(str[ci + 1]) != -1)
            srgt = true;
          if (!slft && L.indexOf(str[ci]) != -1)
            slft = true;
          var feat = null;
          if (slft) {
            feat = srgt ? "isol" : "init";
          } else {
            feat = srgt ? "fina" : "medi";
          }
          return feat;
        };
        Typr$1.U._applySubs = function(gls, ci, tab, llist) {
          var rlim = gls.length - ci - 1;
          for (var j = 0; j < tab.tabs.length; j++) {
            if (tab.tabs[j] == null)
              continue;
            var ltab = tab.tabs[j], ind;
            if (ltab.coverage) {
              ind = Typr$1._lctf.coverageIndex(ltab.coverage, gls[ci]);
              if (ind == -1)
                continue;
            }
            if (tab.ltype == 1) {
              gls[ci];
              if (ltab.fmt == 1)
                gls[ci] = gls[ci] + ltab.delta;
              else
                gls[ci] = ltab.newg[ind];
            } else if (tab.ltype == 4) {
              var vals = ltab.vals[ind];
              for (var k = 0; k < vals.length; k++) {
                var lig = vals[k], rl = lig.chain.length;
                if (rl > rlim)
                  continue;
                var good = true, em1 = 0;
                for (var l = 0; l < rl; l++) {
                  while (gls[ci + em1 + (1 + l)] == -1)
                    em1++;
                  if (lig.chain[l] != gls[ci + em1 + (1 + l)])
                    good = false;
                }
                if (!good)
                  continue;
                gls[ci] = lig.nglyph;
                for (var l = 0; l < rl + em1; l++)
                  gls[ci + l + 1] = -1;
                break;
              }
            } else if (tab.ltype == 5 && ltab.fmt == 2) {
              var cind = Typr$1._lctf.getInterval(ltab.cDef, gls[ci]);
              var cls = ltab.cDef[cind + 2], scs = ltab.scset[cls];
              for (var i = 0; i < scs.length; i++) {
                var sc = scs[i], inp = sc.input;
                if (inp.length > rlim)
                  continue;
                var good = true;
                for (var l = 0; l < inp.length; l++) {
                  var cind2 = Typr$1._lctf.getInterval(ltab.cDef, gls[ci + 1 + l]);
                  if (cind == -1 && ltab.cDef[cind2 + 2] != inp[l]) {
                    good = false;
                    break;
                  }
                }
                if (!good)
                  continue;
                var lrs = sc.substLookupRecords;
                for (var k = 0; k < lrs.length; k += 2) {
                  lrs[k];
                  lrs[k + 1];
                }
              }
            } else if (tab.ltype == 6 && ltab.fmt == 3) {
              if (!Typr$1.U._glsCovered(gls, ltab.backCvg, ci - ltab.backCvg.length))
                continue;
              if (!Typr$1.U._glsCovered(gls, ltab.inptCvg, ci))
                continue;
              if (!Typr$1.U._glsCovered(gls, ltab.ahedCvg, ci + ltab.inptCvg.length))
                continue;
              var lr = ltab.lookupRec;
              for (var i = 0; i < lr.length; i += 2) {
                var cind = lr[i], tab2 = llist[lr[i + 1]];
                Typr$1.U._applySubs(gls, ci + cind, tab2, llist);
              }
            }
          }
        };
        Typr$1.U._glsCovered = function(gls, cvgs, ci) {
          for (var i = 0; i < cvgs.length; i++) {
            var ind = Typr$1._lctf.coverageIndex(cvgs[i], gls[ci + i]);
            if (ind == -1)
              return false;
          }
          return true;
        };
        Typr$1.U.glyphsToPath = function(font, gls, clr) {
          var tpath = { cmds: [], crds: [] };
          var x = 0;
          for (var i = 0; i < gls.length; i++) {
            var gid = gls[i];
            if (gid == -1)
              continue;
            var gid2 = i < gls.length - 1 && gls[i + 1] != -1 ? gls[i + 1] : 0;
            var path = Typr$1.U.glyphToPath(font, gid);
            for (var j = 0; j < path.crds.length; j += 2) {
              tpath.crds.push(path.crds[j] + x);
              tpath.crds.push(path.crds[j + 1]);
            }
            if (clr)
              tpath.cmds.push(clr);
            for (var j = 0; j < path.cmds.length; j++)
              tpath.cmds.push(path.cmds[j]);
            if (clr)
              tpath.cmds.push("X");
            x += font.hmtx.aWidth[gid];
            if (i < gls.length - 1)
              x += Typr$1.U.getPairAdjustment(font, gid, gid2);
          }
          return tpath;
        };
        Typr$1.U.pathToSVG = function(path, prec) {
          if (prec == null)
            prec = 5;
          var out = [], co = 0, lmap = { "M": 2, "L": 2, "Q": 4, "C": 6 };
          for (var i = 0; i < path.cmds.length; i++) {
            var cmd = path.cmds[i], cn = co + (lmap[cmd] ? lmap[cmd] : 0);
            out.push(cmd);
            while (co < cn) {
              var c = path.crds[co++];
              out.push(parseFloat(c.toFixed(prec)) + (co == cn ? "" : " "));
            }
          }
          return out.join("");
        };
        Typr$1.U.pathToContext = function(path, ctx) {
          var c = 0, crds = path.crds;
          for (var j = 0; j < path.cmds.length; j++) {
            var cmd = path.cmds[j];
            if (cmd == "M") {
              ctx.moveTo(crds[c], crds[c + 1]);
              c += 2;
            } else if (cmd == "L") {
              ctx.lineTo(crds[c], crds[c + 1]);
              c += 2;
            } else if (cmd == "C") {
              ctx.bezierCurveTo(crds[c], crds[c + 1], crds[c + 2], crds[c + 3], crds[c + 4], crds[c + 5]);
              c += 6;
            } else if (cmd == "Q") {
              ctx.quadraticCurveTo(crds[c], crds[c + 1], crds[c + 2], crds[c + 3]);
              c += 4;
            } else if (cmd.charAt(0) == "#") {
              ctx.beginPath();
              ctx.fillStyle = cmd;
            } else if (cmd == "Z") {
              ctx.closePath();
            } else if (cmd == "X") {
              ctx.fill();
            }
          }
        };
        Typr$1.U.P = {};
        Typr$1.U.P.moveTo = function(p, x, y) {
          p.cmds.push("M");
          p.crds.push(x, y);
        };
        Typr$1.U.P.lineTo = function(p, x, y) {
          p.cmds.push("L");
          p.crds.push(x, y);
        };
        Typr$1.U.P.curveTo = function(p, a, b, c, d, e, f) {
          p.cmds.push("C");
          p.crds.push(a, b, c, d, e, f);
        };
        Typr$1.U.P.qcurveTo = function(p, a, b, c, d) {
          p.cmds.push("Q");
          p.crds.push(a, b, c, d);
        };
        Typr$1.U.P.closePath = function(p) {
          p.cmds.push("Z");
        };
        Typr$1.U._drawCFF = function(cmds, state, font, pdct, p) {
          var stack = state.stack;
          var nStems = state.nStems, haveWidth = state.haveWidth, width = state.width, open = state.open;
          var i = 0;
          var x = state.x, y = state.y, c1x = 0, c1y = 0, c2x = 0, c2y = 0, c3x = 0, c3y = 0, c4x = 0, c4y = 0, jpx = 0, jpy = 0;
          var o = { val: 0, size: 0 };
          while (i < cmds.length) {
            Typr$1.CFF.getCharString(cmds, i, o);
            var v = o.val;
            i += o.size;
            if (v == "o1" || v == "o18") {
              var hasWidthArg;
              hasWidthArg = stack.length % 2 !== 0;
              if (hasWidthArg && !haveWidth) {
                width = stack.shift() + pdct.nominalWidthX;
              }
              nStems += stack.length >> 1;
              stack.length = 0;
              haveWidth = true;
            } else if (v == "o3" || v == "o23") {
              var hasWidthArg;
              hasWidthArg = stack.length % 2 !== 0;
              if (hasWidthArg && !haveWidth) {
                width = stack.shift() + pdct.nominalWidthX;
              }
              nStems += stack.length >> 1;
              stack.length = 0;
              haveWidth = true;
            } else if (v == "o4") {
              if (stack.length > 1 && !haveWidth) {
                width = stack.shift() + pdct.nominalWidthX;
                haveWidth = true;
              }
              if (open)
                Typr$1.U.P.closePath(p);
              y += stack.pop();
              Typr$1.U.P.moveTo(p, x, y);
              open = true;
            } else if (v == "o5") {
              while (stack.length > 0) {
                x += stack.shift();
                y += stack.shift();
                Typr$1.U.P.lineTo(p, x, y);
              }
            } else if (v == "o6" || v == "o7") {
              var count = stack.length;
              var isX = v == "o6";
              for (var j = 0; j < count; j++) {
                var sval = stack.shift();
                if (isX) {
                  x += sval;
                } else {
                  y += sval;
                }
                isX = !isX;
                Typr$1.U.P.lineTo(p, x, y);
              }
            } else if (v == "o8" || v == "o24") {
              var count = stack.length;
              var index = 0;
              while (index + 6 <= count) {
                c1x = x + stack.shift();
                c1y = y + stack.shift();
                c2x = c1x + stack.shift();
                c2y = c1y + stack.shift();
                x = c2x + stack.shift();
                y = c2y + stack.shift();
                Typr$1.U.P.curveTo(p, c1x, c1y, c2x, c2y, x, y);
                index += 6;
              }
              if (v == "o24") {
                x += stack.shift();
                y += stack.shift();
                Typr$1.U.P.lineTo(p, x, y);
              }
            } else if (v == "o11") {
              break;
            } else if (v == "o1234" || v == "o1235" || v == "o1236" || v == "o1237") {
              if (v == "o1234") {
                c1x = x + stack.shift();
                c1y = y;
                c2x = c1x + stack.shift();
                c2y = c1y + stack.shift();
                jpx = c2x + stack.shift();
                jpy = c2y;
                c3x = jpx + stack.shift();
                c3y = c2y;
                c4x = c3x + stack.shift();
                c4y = y;
                x = c4x + stack.shift();
                Typr$1.U.P.curveTo(p, c1x, c1y, c2x, c2y, jpx, jpy);
                Typr$1.U.P.curveTo(p, c3x, c3y, c4x, c4y, x, y);
              }
              if (v == "o1235") {
                c1x = x + stack.shift();
                c1y = y + stack.shift();
                c2x = c1x + stack.shift();
                c2y = c1y + stack.shift();
                jpx = c2x + stack.shift();
                jpy = c2y + stack.shift();
                c3x = jpx + stack.shift();
                c3y = jpy + stack.shift();
                c4x = c3x + stack.shift();
                c4y = c3y + stack.shift();
                x = c4x + stack.shift();
                y = c4y + stack.shift();
                stack.shift();
                Typr$1.U.P.curveTo(p, c1x, c1y, c2x, c2y, jpx, jpy);
                Typr$1.U.P.curveTo(p, c3x, c3y, c4x, c4y, x, y);
              }
              if (v == "o1236") {
                c1x = x + stack.shift();
                c1y = y + stack.shift();
                c2x = c1x + stack.shift();
                c2y = c1y + stack.shift();
                jpx = c2x + stack.shift();
                jpy = c2y;
                c3x = jpx + stack.shift();
                c3y = c2y;
                c4x = c3x + stack.shift();
                c4y = c3y + stack.shift();
                x = c4x + stack.shift();
                Typr$1.U.P.curveTo(p, c1x, c1y, c2x, c2y, jpx, jpy);
                Typr$1.U.P.curveTo(p, c3x, c3y, c4x, c4y, x, y);
              }
              if (v == "o1237") {
                c1x = x + stack.shift();
                c1y = y + stack.shift();
                c2x = c1x + stack.shift();
                c2y = c1y + stack.shift();
                jpx = c2x + stack.shift();
                jpy = c2y + stack.shift();
                c3x = jpx + stack.shift();
                c3y = jpy + stack.shift();
                c4x = c3x + stack.shift();
                c4y = c3y + stack.shift();
                if (Math.abs(c4x - x) > Math.abs(c4y - y)) {
                  x = c4x + stack.shift();
                } else {
                  y = c4y + stack.shift();
                }
                Typr$1.U.P.curveTo(p, c1x, c1y, c2x, c2y, jpx, jpy);
                Typr$1.U.P.curveTo(p, c3x, c3y, c4x, c4y, x, y);
              }
            } else if (v == "o14") {
              if (stack.length > 0 && !haveWidth) {
                width = stack.shift() + font.nominalWidthX;
                haveWidth = true;
              }
              if (stack.length == 4) {
                var adx = stack.shift();
                var ady = stack.shift();
                var bchar = stack.shift();
                var achar = stack.shift();
                var bind = Typr$1.CFF.glyphBySE(font, bchar);
                var aind = Typr$1.CFF.glyphBySE(font, achar);
                Typr$1.U._drawCFF(font.CharStrings[bind], state, font, pdct, p);
                state.x = adx;
                state.y = ady;
                Typr$1.U._drawCFF(font.CharStrings[aind], state, font, pdct, p);
              }
              if (open) {
                Typr$1.U.P.closePath(p);
                open = false;
              }
            } else if (v == "o19" || v == "o20") {
              var hasWidthArg;
              hasWidthArg = stack.length % 2 !== 0;
              if (hasWidthArg && !haveWidth) {
                width = stack.shift() + pdct.nominalWidthX;
              }
              nStems += stack.length >> 1;
              stack.length = 0;
              haveWidth = true;
              i += nStems + 7 >> 3;
            } else if (v == "o21") {
              if (stack.length > 2 && !haveWidth) {
                width = stack.shift() + pdct.nominalWidthX;
                haveWidth = true;
              }
              y += stack.pop();
              x += stack.pop();
              if (open)
                Typr$1.U.P.closePath(p);
              Typr$1.U.P.moveTo(p, x, y);
              open = true;
            } else if (v == "o22") {
              if (stack.length > 1 && !haveWidth) {
                width = stack.shift() + pdct.nominalWidthX;
                haveWidth = true;
              }
              x += stack.pop();
              if (open)
                Typr$1.U.P.closePath(p);
              Typr$1.U.P.moveTo(p, x, y);
              open = true;
            } else if (v == "o25") {
              while (stack.length > 6) {
                x += stack.shift();
                y += stack.shift();
                Typr$1.U.P.lineTo(p, x, y);
              }
              c1x = x + stack.shift();
              c1y = y + stack.shift();
              c2x = c1x + stack.shift();
              c2y = c1y + stack.shift();
              x = c2x + stack.shift();
              y = c2y + stack.shift();
              Typr$1.U.P.curveTo(p, c1x, c1y, c2x, c2y, x, y);
            } else if (v == "o26") {
              if (stack.length % 2) {
                x += stack.shift();
              }
              while (stack.length > 0) {
                c1x = x;
                c1y = y + stack.shift();
                c2x = c1x + stack.shift();
                c2y = c1y + stack.shift();
                x = c2x;
                y = c2y + stack.shift();
                Typr$1.U.P.curveTo(p, c1x, c1y, c2x, c2y, x, y);
              }
            } else if (v == "o27") {
              if (stack.length % 2) {
                y += stack.shift();
              }
              while (stack.length > 0) {
                c1x = x + stack.shift();
                c1y = y;
                c2x = c1x + stack.shift();
                c2y = c1y + stack.shift();
                x = c2x + stack.shift();
                y = c2y;
                Typr$1.U.P.curveTo(p, c1x, c1y, c2x, c2y, x, y);
              }
            } else if (v == "o10" || v == "o29") {
              var obj = v == "o10" ? pdct : font;
              if (stack.length == 0) {
                console.warn("error: empty stack");
              } else {
                var ind = stack.pop();
                var subr = obj.Subrs[ind + obj.Bias];
                state.x = x;
                state.y = y;
                state.nStems = nStems;
                state.haveWidth = haveWidth;
                state.width = width;
                state.open = open;
                Typr$1.U._drawCFF(subr, state, font, pdct, p);
                x = state.x;
                y = state.y;
                nStems = state.nStems;
                haveWidth = state.haveWidth;
                width = state.width;
                open = state.open;
              }
            } else if (v == "o30" || v == "o31") {
              var count, count1 = stack.length;
              var index = 0;
              var alternate = v == "o31";
              count = count1 & -3;
              index += count1 - count;
              while (index < count) {
                if (alternate) {
                  c1x = x + stack.shift();
                  c1y = y;
                  c2x = c1x + stack.shift();
                  c2y = c1y + stack.shift();
                  y = c2y + stack.shift();
                  if (count - index == 5) {
                    x = c2x + stack.shift();
                    index++;
                  } else {
                    x = c2x;
                  }
                  alternate = false;
                } else {
                  c1x = x;
                  c1y = y + stack.shift();
                  c2x = c1x + stack.shift();
                  c2y = c1y + stack.shift();
                  x = c2x + stack.shift();
                  if (count - index == 5) {
                    y = c2y + stack.shift();
                    index++;
                  } else {
                    y = c2y;
                  }
                  alternate = true;
                }
                Typr$1.U.P.curveTo(p, c1x, c1y, c2x, c2y, x, y);
                index += 4;
              }
            } else if ((v + "").charAt(0) == "o") {
              console.warn("Unknown operation: " + v, cmds);
              throw v;
            } else
              stack.push(v);
          }
          state.x = x;
          state.y = y;
          state.nStems = nStems;
          state.haveWidth = haveWidth;
          state.width = width;
          state.open = open;
        };
        Typr.Typr = Typr$1;
        return Typr;
      }
      var hasRequiredDist;
      function requireDist() {
        if (hasRequiredDist) return dist;
        hasRequiredDist = 1;
        dist.__esModule = true;
        var Typr_js_1 = requireTypr();
        var friendlyTags = { "aalt": "Access All Alternates", "abvf": "Above-base Forms", "abvm": "Above - base Mark Positioning", "abvs": "Above - base Substitutions", "afrc": "Alternative Fractions", "akhn": "Akhands", "blwf": "Below - base Forms", "blwm": "Below - base Mark Positioning", "blws": "Below - base Substitutions", "calt": "Contextual Alternates", "case": "Case - Sensitive Forms", "ccmp": "Glyph Composition / Decomposition", "cfar": "Conjunct Form After Ro", "cjct": "Conjunct Forms", "clig": "Contextual Ligatures", "cpct": "Centered CJK Punctuation", "cpsp": "Capital Spacing", "cswh": "Contextual Swash", "curs": "Cursive Positioning", "c2pc": "Petite Capitals From Capitals", "c2sc": "Small Capitals From Capitals", "dist": "Distances", "dlig": "Discretionary Ligatures", "dnom": "Denominators", "dtls": "Dotless Forms", "expt": "Expert Forms", "falt": "Final Glyph on Line Alternates", "fin2": "Terminal Forms #2", "fin3": "Terminal Forms #3", "fina": "Terminal Forms", "flac": "Flattened accent forms", "frac": "Fractions", "fwid": "Full Widths", "half": "Half Forms", "haln": "Halant Forms", "halt": "Alternate Half Widths", "hist": "Historical Forms", "hkna": "Horizontal Kana Alternates", "hlig": "Historical Ligatures", "hngl": "Hangul", "hojo": "Hojo Kanji Forms(JIS X 0212 - 1990 Kanji Forms)", "hwid": "Half Widths", "init": "Initial Forms", "isol": "Isolated Forms", "ital": "Italics", "jalt": "Justification Alternates", "jp78": "JIS78 Forms", "jp83": "JIS83 Forms", "jp90": "JIS90 Forms", "jp04": "JIS2004 Forms", "kern": "Kerning", "lfbd": "Left Bounds", "liga": "Standard Ligatures", "ljmo": "Leading Jamo Forms", "lnum": "Lining Figures", "locl": "Localized Forms", "ltra": "Left - to - right alternates", "ltrm": "Left - to - right mirrored forms", "mark": "Mark Positioning", "med2": "Medial Forms #2", "medi": "Medial Forms", "mgrk": "Mathematical Greek", "mkmk": "Mark to Mark Positioning", "mset": "Mark Positioning via Substitution", "nalt": "Alternate Annotation Forms", "nlck": "NLC Kanji Forms", "nukt": "Nukta Forms", "numr": "Numerators", "onum": "Oldstyle Figures", "opbd": "Optical Bounds", "ordn": "Ordinals", "ornm": "Ornaments", "palt": "Proportional Alternate Widths", "pcap": "Petite Capitals", "pkna": "Proportional Kana", "pnum": "Proportional Figures", "pref": "Pre - Base Forms", "pres": "Pre - base Substitutions", "pstf": "Post - base Forms", "psts": "Post - base Substitutions", "pwid": "Proportional Widths", "qwid": "Quarter Widths", "rand": "Randomize", "rclt": "Required Contextual Alternates", "rkrf": "Rakar Forms", "rlig": "Required Ligatures", "rphf": "Reph Forms", "rtbd": "Right Bounds", "rtla": "Right - to - left alternates", "rtlm": "Right - to - left mirrored forms", "ruby": "Ruby Notation Forms", "rvrn": "Required Variation Alternates", "salt": "Stylistic Alternates", "sinf": "Scientific Inferiors", "size": "Optical size", "smcp": "Small Capitals", "smpl": "Simplified Forms", "ssty": "Math script style alternates", "stch": "Stretching Glyph Decomposition", "subs": "Subscript", "sups": "Superscript", "swsh": "Swash", "titl": "Titling", "tjmo": "Trailing Jamo Forms", "tnam": "Traditional Name Forms", "tnum": "Tabular Figures", "trad": "Traditional Forms", "twid": "Third Widths", "unic": "Unicase", "valt": "Alternate Vertical Metrics", "vatu": "Vattu Variants", "vert": "Vertical Writing", "vhal": "Alternate Vertical Half Metrics", "vjmo": "Vowel Jamo Forms", "vkna": "Vertical Kana Alternates", "vkrn": "Vertical Kerning", "vpal": "Proportional Alternate Vertical Metrics", "vrt2": "Vertical Alternates and Rotation", "vrtr": "Vertical Alternates for Rotation", "zero": "Slashed Zero" };
        var Font = (
          /** @class */
          function() {
            function Font2(data) {
              var obj = Typr_js_1.Typr.parse(data);
              if (!obj.length || typeof obj[0] !== "object" || typeof obj[0].hasOwnProperty !== "function") {
                throw "unable to parse font";
              }
              for (var n in obj[0]) {
                this[n] = obj[0][n];
              }
              this.enabledGSUB = {};
            }
            Font2.prototype.getFamilyName = function() {
              return this.name && (this.name.typoFamilyName || this.name.fontFamily) || "";
            };
            Font2.prototype.getSubFamilyName = function() {
              return this.name && (this.name.typoSubfamilyName || this.name.fontSubfamily) || "";
            };
            Font2.prototype.glyphToPath = function(gid) {
              return Typr_js_1.Typr.U.glyphToPath(this, gid);
            };
            Font2.prototype.getPairAdjustment = function(gid1, gid2) {
              return Typr_js_1.Typr.U.getPairAdjustment(this, gid1, gid2);
            };
            Font2.prototype.stringToGlyphs = function(str) {
              return Typr_js_1.Typr.U.stringToGlyphs(this, str);
            };
            Font2.prototype.glyphsToPath = function(gls) {
              return Typr_js_1.Typr.U.glyphsToPath(this, gls);
            };
            Font2.prototype.pathToSVG = function(path, prec) {
              return Typr_js_1.Typr.U.pathToSVG(path, prec);
            };
            Font2.prototype.pathToContext = function(path, ctx) {
              return Typr_js_1.Typr.U.pathToContext(path, ctx);
            };
            Font2.prototype.lookupFriendlyName = function(table, feature) {
              if (this[table] !== void 0) {
                var tbl = this[table];
                var feat = tbl.featureList[feature];
                return this.featureFriendlyName(feat);
              }
              return "";
            };
            Font2.prototype.featureFriendlyName = function(feature) {
              if (friendlyTags[feature.tag]) {
                return friendlyTags[feature.tag];
              }
              if (feature.tag.match(/ss[0-2][0-9]/)) {
                var name_1 = "Stylistic Set " + Number(feature.tag.substr(2, 2)).toString();
                if (feature.featureParams) {
                  var version = Typr_js_1.Typr._bin.readUshort(this._data, feature.featureParams);
                  if (version === 0) {
                    var nameID = Typr_js_1.Typr._bin.readUshort(this._data, feature.featureParams + 2);
                    if (this.name && this.name[nameID] !== void 0) {
                      return name_1 + " - " + this.name[nameID];
                    }
                  }
                }
                return name_1;
              }
              if (feature.tag.match(/cv[0-9][0-9]/)) {
                return "Character Variant " + Number(feature.tag.substr(2, 2)).toString();
              }
              return "";
            };
            Font2.prototype.enableGSUB = function(featureNumber) {
              if (this.GSUB) {
                var feature = this.GSUB.featureList[featureNumber];
                if (feature) {
                  for (var i = 0; i < feature.tab.length; ++i) {
                    this.enabledGSUB[feature.tab[i]] = (this.enabledGSUB[feature.tab[i]] || 0) + 1;
                  }
                }
              }
            };
            Font2.prototype.disableGSUB = function(featureNumber) {
              if (this.GSUB) {
                var feature = this.GSUB.featureList[featureNumber];
                if (feature) {
                  for (var i = 0; i < feature.tab.length; ++i) {
                    if (this.enabledGSUB[feature.tab[i]] > 1) {
                      --this.enabledGSUB[feature.tab[i]];
                    } else {
                      delete this.enabledGSUB[feature.tab[i]];
                    }
                  }
                }
              }
            };
            Font2.prototype.codeToGlyph = function(code) {
              var g = Typr_js_1.Typr.U.codeToGlyph(this, code);
              if (this.GSUB) {
                var gls = [g];
                for (var n in this.enabledGSUB) {
                  var l = this.GSUB.lookupList[n];
                  Typr_js_1.Typr.U._applySubs(gls, 0, l, this.GSUB.lookupList);
                }
                if (gls.length === 1)
                  return gls[0];
              }
              return g;
            };
            return Font2;
          }()
        );
        dist.Font = Font;
        return dist;
      }
      var distExports = requireDist();
      function decrypt(iframeDocument) {
        var _a, _b;
        const styles = iframeDocument.querySelectorAll("style");
        let tip;
        for (let i = 0; i < styles.length; i++) {
          if ((_a = styles[i].textContent) == null ? void 0 : _a.includes("font-cxsecret")) {
            tip = styles[i];
            break;
          }
        }
        if (!tip) return;
        const fontDataMatch = (_b = tip.textContent) == null ? void 0 : _b.match(/base64,([\w\W]+?)'/);
        const fontData = fontDataMatch == null ? void 0 : fontDataMatch[1];
        if (!fontData) return;
        const fontArray = base64ToUint8Array(fontData);
        const font = new distExports.Font(fontArray);
        const table = JSON.parse(_GM_getResourceText("ttf"));
        const match = {};
        for (let i = 19968; i < 40870; i++) {
          const glyph = font.codeToGlyph(i);
          if (!glyph) continue;
          const path = font.glyphToPath(glyph);
          const hash = md5(JSON.stringify(path)).slice(24);
          match[i] = table[hash];
        }
        const elements = iframeDocument.querySelectorAll(".font-cxsecret");
        for (let i = 0; i < elements.length; i++) {
          const el = elements[i];
          let html = el.innerHTML;
          for (const key in match) {
            const value = String.fromCharCode(match[key]);
            const regExp = new RegExp(String.fromCharCode(Number(key)), "g");
            html = html.replace(regExp, value);
          }
          el.innerHTML = html;
          el.classList.remove("font-cxsecret");
        }
      }
      function base64ToUint8Array(base64) {
        const data = window.atob(base64);
        const buffer = new Uint8Array(data.length);
        for (let i = 0; i < data.length; ++i) {
          buffer[i] = data.charCodeAt(i);
        }
        return buffer;
      }

    })
  };
}));

System.import("./__entry.js", "./");