// ==UserScript==
// @name         🚀Export ChatGPT Chat as JSON or Markdown🚀
// @namespace    ChatGPT Mods
// @version      1.0.3
// @author       ChatGPT Mods
// @description  Newest userscript to export ChatGPT chat as JSON or Markdown. 📚All formulas 🧮 and tables📊 are fully preserved ✔️
// @license      MIT
// @icon         data:image/svg+xml;base64,PHN2ZyBmaWxsPSJjdXJyZW50Q29sb3IiIGZpbGwtcnVsZT0iZXZlbm9kZCIgaGVpZ2h0PSIxZW0iIHN0eWxlPSJmbGV4Om5vbmU7bGluZS1oZWlnaHQ6MSIgdmlld0JveD0iMCAwIDI0IDI0IiB3aWR0aD0iMWVtIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjx0aXRsZT5PcGVuQUk8L3RpdGxlPjxwYXRoIGQ9Ik0yMS41NSAxMC4wMDRhNS40MTYgNS40MTYgMCAwMC0uNDc4LTQuNTAxYy0xLjIxNy0yLjA5LTMuNjYyLTMuMTY2LTYuMDUtMi42NkE1LjU5IDUuNTkgMCAwMDEwLjgzMSAxQzguMzkuOTk1IDYuMjI0IDIuNTQ2IDUuNDczIDQuODM4QTUuNTUzIDUuNTUzIDAgMDAxLjc2IDcuNDk2YTUuNDg3IDUuNDg3IDAgMDAuNjkxIDYuNSA1LjQxNiA1LjQxNiAwIDAwLjQ3NyA0LjUwMmMxLjIxNyAyLjA5IDMuNjYyIDMuMTY1IDYuMDUgMi42NkE1LjU4NiA1LjU4NiAwIDAwMTMuMTY4IDIzYzIuNDQzLjAwNiA0LjYxLTEuNTQ2IDUuMzYxLTMuODRhNS41NTMgNS41NTMgMCAwMDMuNzE1LTIuNjYgNS40ODggNS40ODggMCAwMC0uNjkzLTYuNDk3di4wMDF6bS04LjM4MSAxMS41NThhNC4xOTkgNC4xOTkgMCAwMS0yLjY3NS0uOTU0Yy4wMzQtLjAxOC4wOTMtLjA1LjEzMi0uMDc0bDQuNDQtMi41M2EuNzEuNzEgMCAwMC4zNjQtLjYyM3YtNi4xNzZsMS44NzcgMS4wNjljLjAyLjAxLjAzMy4wMjkuMDM2LjA1djUuMTE1Yy0uMDAzIDIuMjc0LTEuODcgNC4xMTgtNC4xNzQgNC4xMjN6TTQuMTkyIDE3Ljc4YTQuMDU5IDQuMDU5IDAgMDEtLjQ5OC0yLjc2M2MuMDMyLjAyLjA5LjA1NS4xMzEuMDc4bDQuNDQgMi41M2MuMjI1LjEzLjUwNC4xMy43MyAwbDUuNDItMy4wODh2Mi4xMzhhLjA2OC4wNjggMCAwMS0uMDI3LjA1N0w5LjkgMTkuMjg4Yy0xLjk5OSAxLjEzNi00LjU1Mi40Ni01LjcwNy0xLjUxaC0uMDAxek0zLjAyMyA4LjIxNkE0LjE1IDQuMTUgMCAwMTUuMTk4IDYuNDFsLS4wMDIuMTUxdjUuMDZhLjcxMS43MTEgMCAwMC4zNjQuNjI0bDUuNDIgMy4wODctMS44NzYgMS4wN2EuMDY3LjA2NyAwIDAxLS4wNjMuMDA1bC00LjQ4OS0yLjU1OWMtMS45OTUtMS4xNC0yLjY3OS0zLjY1OC0xLjUzLTUuNjNoLjAwMXptMTUuNDE3IDMuNTRsLTUuNDItMy4wODhMMTQuODk2IDcuNmEuMDY3LjA2NyAwIDAxLjA2My0uMDA2bDQuNDg5IDIuNTU3YzEuOTk4IDEuMTQgMi42ODMgMy42NjIgMS41MjkgNS42MzNhNC4xNjMgNC4xNjMgMCAwMS0yLjE3NCAxLjgwN1YxMi4zOGEuNzEuNzEgMCAwMC0uMzYzLS42MjN6bTEuODY3LTIuNzczYTYuMDQgNi4wNCAwIDAwLS4xMzItLjA3OGwtNC40NC0yLjUzYS43MzEuNzMxIDAgMDAtLjcyOSAwbC01LjQyIDMuMDg4VjcuMzI1YS4wNjguMDY4IDAgMDEuMDI3LS4wNTdMMTQuMSA0LjcxM2MyLTEuMTM3IDQuNTU1LS40NiA1LjcwNyAxLjUxMy40ODcuODMzLjY2NCAxLjgwOS40OTkgMi43NTdoLjAwMXptLTExLjc0MSAzLjgxbC0xLjg3Ny0xLjA2OGEuMDY1LjA2NSAwIDAxLS4wMzYtLjA1MVY2LjU1OWMuMDAxLTIuMjc3IDEuODczLTQuMTIyIDQuMTgxLTQuMTIuOTc2IDAgMS45Mi4zMzggMi42NzEuOTU0LS4wMzQuMDE4LS4wOTIuMDUtLjEzMS4wNzNsLTQuNDQgMi41M2EuNzEuNzEgMCAwMC0uMzY1LjYyM2wtLjAwMyA2LjE3M3YuMDAyem0xLjAyLTIuMTY4TDEyIDkuMjVsMi40MTQgMS4zNzV2Mi43NUwxMiAxNC43NWwtMi40MTUtMS4zNzV2LTIuNzV6Ij48L3BhdGg+PC9zdmc+
// @match        https://chatgpt.com/*
// @require      https://cdn.jsdelivr.net/npm/vue@3.5.21/dist/vue.global.prod.js
// @grant        GM_download
// @grant        unsafeWindow
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/549284/%F0%9F%9A%80Export%20ChatGPT%20Chat%20as%20JSON%20or%20Markdown%F0%9F%9A%80.user.js
// @updateURL https://update.greasyfork.org/scripts/549284/%F0%9F%9A%80Export%20ChatGPT%20Chat%20as%20JSON%20or%20Markdown%F0%9F%9A%80.meta.js
// ==/UserScript==

(function (vue) {
  'use strict';

  const GLOBAL_MESSAGE_OPEN_AI_TOKEN_GOT = "GLOBAL_MESSAGE_OPEN_AI_TOKEN_GOT";
  const DOM_ID_HEADER_TOOL = "DOM_ID_HEADER_TOOL";
  const DOM_ID_GLOBAL_LAYER = "DOM_ID_GLOBAL_LAYER";
  var _GM_download = (() => typeof GM_download != "undefined" ? GM_download : void 0)();
  var _unsafeWindow = (() => typeof unsafeWindow != "undefined" ? unsafeWindow : void 0)();
  class FetchInterceptorManager {
    requestInterceptors = [];
    responseInterceptors = [];
    originalFetch;
    constructor() {
      this.originalFetch = _unsafeWindow.fetch.bind(_unsafeWindow);
      this.patchFetch();
    }
    patchFetch() {
      _unsafeWindow.fetch = async (input, init) => {
        const newInput = typeof input === "string" ? input : input instanceof URL ? input.toString() : input;
        let context = { input: newInput, init };
        for (const interceptor of this.requestInterceptors) {
          context = await interceptor(context.input, context.init);
        }
        const response = await this.originalFetch(context.input, context.init);
        let finalResponse = response;
        for (const interceptor of this.responseInterceptors) {
          finalResponse = await interceptor(finalResponse, context);
        }
        return finalResponse;
      };
    }
    useRequest(interceptor) {
      this.requestInterceptors.push(interceptor);
    }
    useResponse(interceptor) {
      this.responseInterceptors.push(interceptor);
    }
    ejectAll() {
      this.requestInterceptors = [];
      this.responseInterceptors = [];
      _unsafeWindow.fetch = this.originalFetch;
    }
  }
  const FetchInterceptor = new FetchInterceptorManager();
  bootstrap$1();
  function bootstrap$1() {
    FetchInterceptor.useRequest(async (input, init) => {
      try {
        const a = document.createElement("a");
        a.href = typeof input === "string" ? input : input.url;
        const url = a.href;
        console.log(url);
        const regexp = "/backend-api/(?!edge$)";
        if (regexp && new RegExp(regexp).test(url)) {
          let authorization = "";
          if (input instanceof Request) {
            authorization = input.headers.get("Authorization") || "";
          } else if (init?.headers) {
            authorization = init.headers.Authorization || "";
          }
          if (authorization) {
            window.postMessage({
              type: GLOBAL_MESSAGE_OPEN_AI_TOKEN_GOT,
              data: {
                authorization
              }
            });
          }
        }
      } catch {
      }
      return { input, init };
    });
  }
  vue.ref(false);
  vue.ref(false);
  vue.ref(false);
  vue.ref(false);
  vue.ref(false);
  vue.ref(false);
  const overlayContainer = vue.ref();
  function initGlobal(container) {
    overlayContainer.value = container;
  }
  const configStore = vue.ref({
    data: {
      chatGpt: {
        conversationIdRegExp: "/c/(?!WEB:)([0-9a-zA-Z-]+)",
        authRelatedPathRegExp: "/backend-api/(?!edge$)",
        apiConversationContent: "/backend-api/conversation/{{id}}"
      },
      injectTarget: {
        headerTool: '//*[@id="conversation-header-actions"]'
      }
    }
  });
  const userInfoStore = vue.ref({
    auth: {
      openaiAuth: ""
    }
  });
  function simpleTemplate(template, data) {
    if (!data) {
      return template;
    } else {
      return template.replace(/\{\{(\w+)\}\}/g, (_, key) => {
        return key in data ? data[key] : "";
      });
    }
  }
  function getConversationId(url) {
    const pathname = location.pathname;
    const match = pathname.match(new RegExp(configStore.value.data.chatGpt.conversationIdRegExp));
    if (match && match.length === 2) {
      return match[1];
    }
    return null;
  }
  function getElementsByXPath(xpath, contextNode = document, rootNode = document) {
    const snapshots = rootNode.evaluate(xpath, contextNode, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
    if (snapshots.snapshotLength > 0) {
      const elements = [];
      for (let i = 0; i < snapshots.snapshotLength; i++) {
        const item = snapshots.snapshotItem(i);
        if (item) {
          elements.push(item);
        }
      }
      return elements;
    }
    return null;
  }
  function getElementByXPath(xpath, contextNode = document, rootNode = document) {
    const elements = getElementsByXPath(xpath, contextNode, rootNode);
    if (elements) {
      return elements[0];
    }
    return null;
  }
  function textToBase64Url(text, mimeType) {
    const encoder = new TextEncoder();
    const encoded = encoder.encode(text);
    const base64 = btoa(String.fromCharCode(...encoded));
    return `data:${mimeType};base64,${base64}`;
  }
  navigator.userAgent.toLocaleLowerCase().includes("mac");
  const _export_sfc = (sfc, props) => {
    const target = sfc.__vccOpts || sfc;
    for (const [key, val] of props) {
      target[key] = val;
    }
    return target;
  };
  const _sfc_main$1 = {};
  function _sfc_render(_ctx, _cache) {
    return null;
  }
  const GlobalOverlay = _export_sfc(_sfc_main$1, [["render", _sfc_render]]);
  async function request(method, path, params, signal) {
    if (!userInfoStore.value.auth.openaiAuth) {
      throw new Error("openAI not login");
    }
    let body = null;
    const headers = {
      authorization: userInfoStore.value.auth.openaiAuth
    };
    const response = await fetch(path, {
      signal,
      headers,
      method,
      body,
      mode: "cors",
      credentials: "include"
    });
    if (response.ok) {
      return response.json();
    } else {
      throw new Error(response.statusText);
    }
  }
  async function getConversationContent(id) {
    const result = await request("GET", simpleTemplate(configStore.value.data.chatGpt.apiConversationContent, { id }));
    const mapping = {};
    for (const [key, value] of Object.entries(result.mapping)) {
      if (value.message && value.message.content) {
        mapping[key] = {
          role: value.message.author?.role,
          type: value.message.content.content_type,
          content: value.message.content.parts?.filter((item) => typeof item === "string").join(""),
          recipient: value.message.recipient,
          parentId: value.parent
        };
      }
    }
    return {
      title: result.title,
      mapping,
      currentNode: result.current_node
    };
  }
  const _hoisted_1 = {
    key: 0,
    class: "flex gap-2 text-sm items-center h-full"
  };
  const _hoisted_2 = { key: 0 };
  const _hoisted_3 = { key: 0 };
  const _hoisted_4 = { key: 1 };
  const _hoisted_5 = { key: 0 };
  const _hoisted_6 = { key: 1 };
  const _hoisted_7 = {
    key: 1,
    class: "text-sm flex items-center h-full text-red-500"
  };
  const _sfc_main = vue.defineComponent({
    __name: "HeaderTool",
    setup(__props) {
      const isMac = navigator.userAgent.includes("Macintosh");
      const downloadingJson = vue.ref(false);
      const downloadingMarkdown = vue.ref(false);
      const counter = vue.ref(JSON.parse(localStorage.getItem("oai/apps/counter") || JSON.stringify({
        count: 0,
        date: ( new Date()).toDateString()
      })));
      if (counter.value.date !== ( new Date()).toDateString()) {
        counter.value = {
          count: 0,
          date: ( new Date()).toDateString()
        };
        localStorage.setItem("oai/apps/counter", JSON.stringify(counter.value));
      }
      vue.watch(counter, (value) => {
        localStorage.setItem("oai/apps/counter", JSON.stringify(value));
      }, {
        deep: true
      });
      function isLimited() {
        const today = ( new Date()).toDateString();
        if (counter.value.date !== today) {
          counter.value = {
            count: 0,
            date: today
          };
        }
        if (counter.value.count > 1) {
          return true;
        } else {
          counter.value.count++;
          return false;
        }
      }
      async function saveAsJson() {
        if (isLimited()) {
          return;
        }
        downloadingJson.value = true;
        const conversationData = await getConversationData();
        downloadingJson.value = false;
        if (conversationData) {
          const lastMessageId = conversationData.currentNode;
          let currentMessage = conversationData.mapping[lastMessageId];
          const result = [];
          while (currentMessage) {
            if (currentMessage.role && currentMessage.type && currentMessage.content && ["user", "assistant"].includes(currentMessage.role) && ["text", "multimodal_text"].includes(currentMessage.type) && currentMessage.recipient === "all") {
              result.push({
                role: currentMessage.role,
                content: currentMessage.content
              });
            }
            currentMessage = conversationData.mapping[currentMessage.parentId || ""];
          }
          result.reverse();
          const base64Url = textToBase64Url(JSON.stringify({
            title: conversationData.title,
            items: result
          }, null, 2), "application/json");
          _GM_download(base64Url, `${conversationData.title}.json`);
        }
      }
      async function saveAsMarkdown() {
        if (isLimited()) {
          return;
        }
        downloadingMarkdown.value = true;
        const conversationData = await getConversationData();
        downloadingMarkdown.value = false;
        if (conversationData) {
          const result = [];
          const lastMessageId = conversationData.currentNode;
          let currentMessage = conversationData.mapping[lastMessageId];
          while (currentMessage) {
            if (currentMessage.role && currentMessage.type && currentMessage.content && ["user", "assistant"].includes(currentMessage.role) && ["text", "multimodal_text"].includes(currentMessage.type) && currentMessage.recipient === "all") {
              result.push(`# ${currentMessage.role}:

${currentMessage.content}`);
            }
            currentMessage = conversationData.mapping[currentMessage.parentId || ""];
          }
          result.reverse();
          const base64Url = textToBase64Url(result.join("\n\n"), "text/markdown");
          _GM_download(base64Url, `${conversationData.title}.md.txt`);
        }
      }
      async function getConversationData() {
        const conversationId = getConversationId();
        if (conversationId) {
          return await getConversationContent(conversationId);
        }
      }
      return (_ctx, _cache) => {
        return vue.unref(userInfoStore).auth.openaiAuth ? (vue.openBlock(), vue.createElementBlock("div", _hoisted_1, [
          counter.value.count > 1 ? (vue.openBlock(), vue.createElementBlock("span", _hoisted_2, [..._cache[0] || (_cache[0] = [
            vue.createTextVNode("You have reached today's limit. ", -1),
            vue.createElementVNode("a", {
              target: "_blank",
              class: "text-red-500 underline",
              href: "https://chromewebstore.google.com/detail/lmiigijnefpkjcenfbinhdpafehaddag?utm_source=userscript"
            }, [
              vue.createTextVNode("Get more for "),
              vue.createElementVNode("strong", null, "free🎉")
            ], -1)
          ])])) : (vue.openBlock(), vue.createElementBlock(vue.Fragment, { key: 1 }, [
            vue.createElementVNode("button", {
              class: "rounded-2xl border border-gray-200 px-2 py-1 hover:bg-gray-100",
              onClick: saveAsJson
            }, [
              downloadingJson.value ? (vue.openBlock(), vue.createElementBlock("span", _hoisted_3, "Downloading...")) : (vue.openBlock(), vue.createElementBlock("span", _hoisted_4, "Export JSON"))
            ]),
            vue.createElementVNode("button", {
              class: "rounded-2xl border border-gray-200 px-2 py-1 hover:bg-gray-100",
              onClick: saveAsMarkdown
            }, [
              downloadingMarkdown.value ? (vue.openBlock(), vue.createElementBlock("span", _hoisted_5, "Downloading...")) : (vue.openBlock(), vue.createElementBlock("span", _hoisted_6, "Export Markdown"))
            ])
          ], 64))
        ])) : (vue.openBlock(), vue.createElementBlock("div", _hoisted_7, " Make a Hard Reload using " + vue.toDisplayString(vue.unref(isMac) ? "⇧⌘R" : "Ctrl+Shift+R") + " to activate the script ", 1));
      };
    }
  });
  const observerHandlers = [];
  waitForDomReady().then(() => {
    const observer = new MutationObserver((mutations, observer2) => {
      for (const handler of observerHandlers) {
        handler(mutations, observer2);
      }
    });
    observer.observe(document.body, {
      childList: true,
      subtree: true
    });
    if (localStorage.getItem("oai/apps/auth")) {
      userInfoStore.value.auth.openaiAuth = localStorage.getItem("oai/apps/auth");
    }
    bootstrap();
  });
  window.addEventListener("message", messageHandler);
  function messageHandler(e) {
    if (e.data.type === GLOBAL_MESSAGE_OPEN_AI_TOKEN_GOT) {
      userInfoStore.value.auth.openaiAuth = e.data.data.authorization;
      localStorage.setItem("oai/apps/auth", e.data.data.authorization);
    }
  }
  async function waitForDomReady() {
    return new Promise((resolve) => {
      console.log(document.readyState);
      if (document.readyState === "interactive" || document.readyState === "complete") {
        resolve();
      } else {
        window.addEventListener("DOMContentLoaded", () => resolve());
      }
    });
  }
  function bootstrap() {
    createGlobalLayer();
    const appBuilder = createAppBuilder();
    bootstrapHeaderTool(appBuilder);
  }
  function createAppBuilder() {
    function buildApp(cmp, id, props) {
      const container = document.createElement("div");
      container.id = id;
      const root = document.createElement("div");
      root.id = `app`;
      container.appendChild(root);
      const app = vue.createApp(cmp, props);
      return { app, root, container };
    }
    return buildApp;
  }
  function bootstrapHeaderTool(appBuilder) {
    const containerId = DOM_ID_HEADER_TOOL;
    let mounted = false;
    const { app, root, container } = appBuilder(_sfc_main, containerId);
    container.style.alignSelf = "stretch";
    root.style.height = "100%";
    function tryMount() {
      const pageHeader = getElementByXPath(configStore.value.data.injectTarget.headerTool);
      if (pageHeader instanceof HTMLElement) {
        if (!document.querySelector(`#${containerId}`) && getConversationId()) {
          pageHeader.prepend(container);
          if (!mounted) {
            mounted = true;
            app.mount(root);
          }
        }
      }
    }
    tryMount();
    observerHandlers.push(tryMount);
  }
  function createGlobalLayer() {
    const container = document.createElement("div");
    container.id = DOM_ID_GLOBAL_LAYER;
    const root = document.createElement("div");
    root.style.position = "fixed";
    root.style.left = "0px";
    root.style.top = "0px";
    root.id = `app`;
    const $globalLayer = document.createElement("div");
    $globalLayer.style.position = "fixed";
    $globalLayer.style.left = "0px";
    $globalLayer.style.top = "0px";
    $globalLayer.id = `container`;
    root.appendChild($globalLayer);
    initGlobal($globalLayer);
    container.appendChild(root);
    document.body.after(container);
    const globalLayerApp = vue.createApp(GlobalOverlay);
    globalLayerApp.mount($globalLayer);
  }

})(Vue);