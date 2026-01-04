// ==UserScript==
// @name         chat-exporter
// @namespace    berry22jelly/chat-exporter
// @version      0.0.1
// @license MIT
// @description  A Chat export plugin to help you use chat with OpenAI lib easily.
// @match        https://chatgpt.com/**/**
// @grant        GM.registerMenuCommand
// @grant        GM_registerMenuCommand
// @downloadURL https://update.greasyfork.org/scripts/547932/chat-exporter.user.js
// @updateURL https://update.greasyfork.org/scripts/547932/chat-exporter.meta.js
// ==/UserScript==

(async function () {
  'use strict';

  (function() {
    const template = document.createElement("template");
    template.innerHTML = `
    <style>
      :host{ position: fixed; inset:0; display:none; }
      :host([open]){ display:block; }

      .backdrop{ position:absolute; inset:0; background: var(--backdrop-bg, rgba(0,0,0,.45)); opacity:0; transition: opacity .2s cubic-bezier(.2,.7,.2,1); }
      .sheet{ position:absolute; inset:0; display:grid; place-items:center; pointer-events:none; }

      .dialog{ pointer-events:auto; width:min(92vw, var(--modal-width, 520px)); background:var(--modal-bg, #fff); border-radius:var(--modal-radius, 16px); box-shadow: var(--modal-shadow, 0 20px 60px rgba(0,0,0,.25)); overflow:hidden; transform: translateY(8px) scale(.98); opacity:.98; transition: transform .22s cubic-bezier(.2,.7,.2,1), opacity .22s cubic-bezier(.2,.7,.2,1); }
      .body{ padding: var(--modal-padding, 20px); }

      header{ display:flex; align-items:center; justify-content:space-between; gap:.5rem; padding:16px 20px; border-bottom:1px solid #eee; }
      header ::slotted(*){ font-weight:600; font-size:1.05rem; }
      .title{ font-weight:600; font-size:1.05rem; }
      .x{ border:none; background:transparent; font-size:20px; line-height:1; cursor:pointer; padding:6px; border-radius:8px; }
      .x:focus{ outline: 2px solid Highlight; outline-offset:2px; }

      footer{ padding:16px 20px; border-top:1px solid #eee; }

      :host([open]) .backdrop{ opacity:1; }
      :host([open]) .dialog{ transform: translateY(0) scale(1); opacity:1; }

      @media (prefers-reduced-motion: reduce){
        .backdrop, .dialog{ transition: none; }
      }
    </style>
    <div class="backdrop" part="backdrop" data-backdrop></div>
    <div class="sheet">
      <div class="dialog" part="dialog" role="dialog" aria-modal="true" aria-labelledby="titleEl">
        <header part="header">
          <slot name="header"><span id="titleEl" class="title"></span></slot>
          <button class="x" aria-label="关闭" data-close>&times;</button>
        </header>
        <div class="body" part="body">
          <slot></slot>
        </div>
        <footer part="footer">
          <slot name="footer"></slot>
        </footer>
      </div>
    </div>
  `;
    class MyModal extends HTMLElement {
      static get observedAttributes() {
        return ["open", "title"];
      }
      constructor() {
        super();
        this._open = false;
        this._lastFocused = null;
        this.attachShadow({ mode: "open" }).appendChild(template.content.cloneNode(true));
        this.$ = (sel) => this.shadowRoot.querySelector(sel);
        this._onKeydown = this._onKeydown.bind(this);
        this._onClick = this._onClick.bind(this);
      }
      connectedCallback() {
        this._syncTitle();
        this.shadowRoot.addEventListener("click", this._onClick);
        this.shadowRoot.querySelectorAll("[data-close]").forEach((btn) => {
          btn.addEventListener("click", () => this.hide());
        });
        this.querySelectorAll("[data-close]").forEach((btn) => {
          btn.addEventListener("click", () => this.hide());
        });
        if (this.hasAttribute("open")) this._openSetup();
      }
      disconnectedCallback() {
        this.shadowRoot.removeEventListener("click", this._onClick);
        document.removeEventListener("keydown", this._onKeydown);
      }
      attributeChangedCallback(name, oldVal, newVal) {
        if (name === "open") {
          const isOpen = this.hasAttribute("open");
          if (isOpen) this._openSetup();
          else this._closeCleanup();
          this.dispatchEvent(new CustomEvent(isOpen ? "open" : "close", { bubbles: true }));
        }
        if (name === "title") this._syncTitle();
      }
      get open() {
        return this.hasAttribute("open");
      }
      set open(v) {
        v ? this.setAttribute("open", "") : this.removeAttribute("open");
      }
      show() {
        this.setAttribute("open", "");
      }
      hide() {
        this.removeAttribute("open");
      }
      toggle() {
        this.open ? this.hide() : this.show();
      }
      _syncTitle() {
        const t = this.getAttribute("title") || "";
        const el = this.shadowRoot.getElementById("titleEl");
        if (el) el.textContent = t;
      }
      _onClick(e) {
        const backdrop = e.composedPath().includes(this.$("[data-backdrop]"));
        if (backdrop && !this.hasAttribute("no-backdrop-close")) this.hide();
      }
      _onKeydown(e) {
        if (!this.open) return;
        if (e.key === "Escape") {
          e.preventDefault();
          this.hide();
          return;
        }
        if (e.key === "Tab") {
          const focusables = this._getFocusable();
          if (focusables.length === 0) {
            e.preventDefault();
            return;
          }
          const first = focusables[0];
          const last = focusables[focusables.length - 1];
          const active = this._rootActiveElement();
          if (e.shiftKey) {
            if (active === first || !this.contains(active)) {
              e.preventDefault();
              last.focus();
            }
          } else {
            if (active === last) {
              e.preventDefault();
              first.focus();
            }
          }
        }
      }
      _rootActiveElement() {
        let ae = this.getRootNode().activeElement;
        while (ae && ae.shadowRoot && ae.shadowRoot.activeElement) {
          ae = ae.shadowRoot.activeElement;
        }
        return ae;
      }
      _getFocusable() {
        const dlg = this.$(".dialog");
        return [...dlg.querySelectorAll(
          'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])'
        )].filter((el) => !el.hasAttribute("disabled") && !el.getAttribute("aria-hidden"));
      }
      _openSetup() {
        if (this._open) return;
        this._open = true;
        this._lastFocused = this._rootActiveElement();
        document.addEventListener("keydown", this._onKeydown);
        this._prevOverflow = document.documentElement.style.overflow;
        document.documentElement.style.overflow = "hidden";
        requestAnimationFrame(() => {
          const f = this._getFocusable()[0] || this.$(".x");
          f && f.focus();
        });
        try {
          const siblings = [...document.body.children].filter((n) => n !== this.closest("body > *") && n !== this);
          siblings.forEach((n) => n.inert = true);
          this._inertSiblings = siblings;
        } catch (err) {
        }
      }
      _closeCleanup() {
        if (!this._open) return;
        this._open = false;
        document.removeEventListener("keydown", this._onKeydown);
        document.documentElement.style.overflow = this._prevOverflow || "";
        if (this._inertSiblings) {
          this._inertSiblings.forEach((n) => n.inert = false);
          this._inertSiblings = null;
        }
        if (this._lastFocused && this._lastFocused.focus) this._lastFocused.focus();
      }
    }
    customElements.define("chat-exporter-modal", MyModal);
  })();
  const innerHtml = `

<div style="padding: 25px;">
    <div style="margin-bottom: 20px; text-align: center;">
        <button id="actionBtn" style="background: linear-gradient(to right, #3911cbff 0%, #2575fc 100%); border: none; color: white; padding: 12px 28px; border-radius: 30px; font-size: 16px; cursor: pointer; transition: all 0.3s ease; box-shadow: 0 4px 10px rgba(37, 117, 252, 0.3);" onmouseover="this.style.transform='translateY(-2px)'; this.style.boxShadow='0 6px 14px rgba(37, 117, 252, 0.4)';" onmouseout="this.style.transform='translateY(0)'; this.style.boxShadow='0 4px 10px rgba(37, 117, 252, 0.3)';">生成结果</button>
    </div>
    
    <div style="margin-bottom: 10px;">
        <label style="display: block; margin-bottom: 8px; color: #555; font-weight: 500;">结果展示 (可编辑):</label>
        <textarea style="width: 100%; height: 180px; padding: 15px; border: 1px solid #ddd; border-radius: 8px; resize: vertical; font-family: monospace; font-size: 14px; box-sizing: border-box;" placeholder="这里将显示生成的结果..."></textarea>
    </div>
    
    <div style="font-size: 13px;  text-align: center;">
        <p>您可以编辑上述文本区域中的内容</p>
    </div>
</div>
`;
  var ChatGPTAPIURL = "https://chatgpt.com/backend-api/conversation/";
  var session = null;
  async function fetchSession() {
    const _response = await fetch("/api/auth/session");
    if (!_response.ok) {
      throw new Error(_response.statusText);
    }
    session = (await _response.json())["accessToken"];
  }
  await( fetchSession());
  async function exportCurrentChat() {
    const chatUUID = window.location.pathname.split("/").at(-1);
    let messages = await (await fetch(
      ChatGPTAPIURL + chatUUID,
      {
        "credentials": "include",
        "headers": {
          "Authorization": "Bearer " + session
        },
        "method": "GET"
      }
    )).json();
    return _extractConversation(messages);
  }
  function _extractConversation(data) {
    const mapping = data.mapping;
    const currentNodeId = data.current_node;
    let chain = [];
    let nodeId = currentNodeId;
    while (nodeId) {
      const node = mapping[nodeId];
      if (node && node.message) {
        const role = node.message.author.role;
        const textParts = node.message.content?.parts || [];
        const content = textParts.join("\n").trim();
        if (content) {
          chain.push({
            role,
            content
          });
        }
      }
      nodeId = node.parent;
    }
    return chain.reverse();
  }
  var _GM_registerMenuCommand = (() => typeof GM_registerMenuCommand != "undefined" ? GM_registerMenuCommand : void 0)();
  function chatexportgen() {
    exportCurrentChat().then((resultJson) => {
      toolDialogue.getElementsByTagName("textarea")[0].value = JSON.stringify(resultJson);
    });
  }
  const toolDialogue = document.createElement("chat-exporter-modal");
  toolDialogue.innerHTML = innerHtml;
  toolDialogue.getElementsByTagName("button")[0].onclick = () => {
    chatexportgen();
  };
  document.body.appendChild(toolDialogue);
  _GM_registerMenuCommand("show", () => {
    toolDialogue.show();
  });

})();