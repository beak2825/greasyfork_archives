// ==UserScript==
// @name         Codeberg README TOC
// @name:zh-CN   Codeberg README 目录
// @name:zh-TW   Codeberg README 目錄
// @name:ja      Codeberg README 目次
// @name:ko      Codeberg README 목차
// @name:es      Codeberg README Tabla de Contenidos
// @name:fr      Codeberg README Table des Matières
// @name:de      Codeberg README Inhaltsverzeichnis
// @name:ru      Codeberg README Оглавление
// @name:pt      Codeberg README Índice
// @name:pt-BR   Codeberg README Índice
// @name:it      Codeberg README Indice
// @name:pl      Codeberg README Spis Treści
// @name:nl      Codeberg README Inhoudsopgave
// @name:tr      Codeberg README İçindekiler
// @name:ar      Codeberg README جدول المحتويات
// @description  Add table of contents(TOC) for README in Codeberg.
// @description:zh-CN  为 Codeberg 的 README 添加目录。
// @description:zh-TW  為 Codeberg 的 README 添加目錄。
// @description:ja      Codeberg の README に目次を追加します。
// @description:ko      Codeberg의 README에 목차를 추가합니다.
// @description:es      Agrega una tabla de contenidos para README en Codeberg.
// @description:fr      Ajoute une table des matières pour README dans Codeberg.
// @description:de      Fügt ein Inhaltsverzeichnis für README in Codeberg hinzu.
// @description:ru      Добавляет оглавление для README в Codeberg.
// @description:pt      Adiciona um índice para README no Codeberg.
// @description:pt-BR   Adiciona um índice para README no Codeberg.
// @description:it      Aggiunge un indice per README in Codeberg.
// @description:pl      Dodaje spis treści dla README w Codeberg.
// @description:nl      Voegt een inhoudsopgave toe voor README in Codeberg.
// @description:tr      Codeberg'deki README için içindekiler tablosu ekler.
// @description:ar      يضيف جدول محتويات لـ README في Codeberg.
// @namespace    tampermonkey
// @version      0.1.7
// @author       aspen138, Claude Code(Sonnet 4.5)
// @license      MIT
// @icon         data:image/png;base64,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
// @exclude      https://codeberg.org/*/*/commits/*
// @exclude      https://codeberg.org/*/*/branches
// @exclude      https://codeberg.org/*/*/tags
// @exclude      https://codeberg.org/*/*/issues
// @exclude      https://codeberg.org/*/*/pulls
// @exclude      https://codeberg.org/*/*/activity
// @exclude      https://codeberg.org/*/*/actions
// @match        https://codeberg.org/**
// @require      https://cdn.jsdelivr.net/npm/react@18.2.0/umd/react.production.min.js
// @require      https://cdn.jsdelivr.net/npm/react-dom@18.2.0/umd/react-dom.production.min.js
// @downloadURL https://update.greasyfork.org/scripts/558967/Codeberg%20README%20TOC.user.js
// @updateURL https://update.greasyfork.org/scripts/558967/Codeberg%20README%20TOC.meta.js
// ==/UserScript==


(o=>{const t=document.createElement("style");t.dataset.source="vite-plugin-monkey",t.textContent=o,document.head.append(t)})(" /* Main container for two-column layout */ .codeberg-toc-layout-container { display: flex !important; gap: 20px !important; width: 100% !important; } /* README content - left side with increased width */ .codeberg-toc-main-content { flex: 0 0 72% !important; max-width: 72% !important; min-width: 0 !important; } /* TOC container - right side with reduced width */ #codeberg-readme-toc { flex: 0 0 25% !important; max-width: 25% !important; position: sticky !important; top: 20px !important; max-height: calc(100vh - 40px) !important; padding: 16px !important; padding-right: 0px !important; background: var(--color-canvas-subtle, #f6f8fa) !important; border: 1px solid var(--color-border-muted, #d1d9e0) !important; border-radius: 6px !important; display: flex !important; flex-direction: column !important; } /* TOC title */ #codeberg-readme-toc h2 { margin: 0 0 12px 0 !important; font-size: 16px !important; font-weight: 600 !important; color: var(--color-fg-default, #1f2328) !important; border-bottom: 1px solid var(--color-border-muted, #d1d9e0) !important; padding-bottom: 8px !important; } /* TOC list */ #codeberg-readme-toc ul { list-style: none !important; margin: 0 !important; padding: 0 !important; padding-right: 0px !important; overflow-y: auto !important; flex: 1 !important; } #codeberg-readme-toc ul li { margin-bottom: 4px !important; line-height: 1.4 !important; } /* TOC links */ #codeberg-readme-toc a { color: var(--color-fg-default, #1f2328) !important; text-decoration: none !important; display: block !important; padding: 4px 8px !important; border-radius: 4px !important; font-size: 13px !important; transition: background-color 0.2s ease !important; cursor: pointer !important; } #codeberg-readme-toc a:hover { color: var(--color-accent-fg, #0969da) !important; background-color: var(--color-canvas-default, #ffffff) !important; } /* Responsive design */ @media (max-width: 1200px) { .codeberg-toc-layout-container { flex-direction: column !important; } .codeberg-toc-main-content { flex: 1 !important; max-width: 100% !important; } #codeberg-readme-toc { flex: none !important; max-width: 100% !important; position: static !important; margin-top: 20px !important; } } ");

(function (require$$0, require$$0$1) {
  'use strict';

  var jsxRuntimeExports = {};
  var jsxRuntime = {
    get exports() {
      return jsxRuntimeExports;
    },
    set exports(v) {
      jsxRuntimeExports = v;
    }
  };
  var reactJsxRuntime_production_min = {};
  /**
   * @license React
   * react-jsx-runtime.production.min.js
   *
   * Copyright (c) Facebook, Inc. and its affiliates.
   *
   * This source code is licensed under the MIT license found in the
   * LICENSE file in the root directory of this source tree.
   */
  var f = require$$0, k = Symbol.for("react.element"), l = Symbol.for("react.fragment"), m$1 = Object.prototype.hasOwnProperty, n = f.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED.ReactCurrentOwner, p = { key: true, ref: true, __self: true, __source: true };
  function q(c, a, g) {
    var b, d = {}, e = null, h = null;
    void 0 !== g && (e = "" + g);
    void 0 !== a.key && (e = "" + a.key);
    void 0 !== a.ref && (h = a.ref);
    for (b in a)
      m$1.call(a, b) && !p.hasOwnProperty(b) && (d[b] = a[b]);
    if (c && c.defaultProps)
      for (b in a = c.defaultProps, a)
        void 0 === d[b] && (d[b] = a[b]);
    return { $$typeof: k, type: c, key: e, ref: h, props: d, _owner: n.current };
  }
  reactJsxRuntime_production_min.Fragment = l;
  reactJsxRuntime_production_min.jsx = q;
  reactJsxRuntime_production_min.jsxs = q;
  (function(module) {
    {
      module.exports = reactJsxRuntime_production_min;
    }
  })(jsxRuntime);
  var client = {};
  var m = require$$0$1;
  {
    client.createRoot = m.createRoot;
    client.hydrateRoot = m.hydrateRoot;
  }
  const name = "codeberg-readme-toc";

  function ensureElements() {
    const readmeSection = document.querySelector("#readme");
    if (!readmeSection) {
      return null;
    }

    const container = readmeSection.querySelector(".file-view.markup.markdown");
    if (!container) {
      return null;
    }

    const headings = container.querySelectorAll("h1, h2, h3, h4, h5, h6");
    if (!container || !headings.length) {
      return null;
    }

    return { container, headings, readmeSection };
  }

  function getToc() {
    const elements = ensureElements();
    if (!elements) {
      return [];
    }

    const tocItems = [...elements.headings].map((heading) => {
      var _a;
      const depth = Number(heading.tagName.slice(1));
      const anchor = heading.querySelector("a.anchor");
      const text = (_a = heading.textContent) == null ? void 0 : _a.trim();

      let hash = null;
      if (anchor && anchor.href) {
        const url = new URL(anchor.href);
        hash = url.hash;
      } else if (heading.id) {
        hash = '#' + heading.id;
      }

      return {
        depth,
        text,
        hash,
        element: heading
      };
    }).filter(item => item.text && item.hash);

    return tocItems;
  }

  const handleTocClick = (e, element) => {
    e.preventDefault();

    if (element) {
      element.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });

      const hash = element.id ? '#' + element.id : '';
      if (hash && window.history.pushState) {
        window.history.pushState(null, null, hash);
      }
    }
  };

  const Toc = ({ toc }) => {
    return /* @__PURE__ */ jsxRuntimeExports.jsx("ul", { children: toc.map((h, i) => /* @__PURE__ */ jsxRuntimeExports.jsx("li", { style: { paddingLeft: (h.depth - 1) * 16 }, children: /* @__PURE__ */ jsxRuntimeExports.jsx(
      "a",
      {
        href: h.hash,
        onClick: (e) => handleTocClick(e, h.element),
        children: h.text
      }
    ) }, i)) });
  };

  function App() {
    const toc = getToc();

    if (!toc.length) {
      return null;
    }

    return /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "h4 mb-3", children: "Table of Contents" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Toc, { toc })
    ] });
  }

  async function render() {
    let root = document.querySelector(`#${name}`);
    if (root) {
      return;
    }

    const elements = ensureElements();
    if (!elements) {
      return;
    }

    const { readmeSection } = elements;
    const fileHeader = readmeSection.querySelector(".file-header");
    const fileView = readmeSection.querySelector(".file-view");

    if (!fileHeader || !fileView) {
      if (readmeSection.firstElementChild) {
        root = document.createElement("div");
        root.id = name;
        readmeSection.insertBefore(root, readmeSection.firstElementChild);

        const reactRoot = client.createRoot(root);
        const app = /* @__PURE__ */ jsxRuntimeExports.jsx(require$$0.StrictMode, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(App, {}) });
        reactRoot.render(app);
        return;
      }
      return;
    }

    const layoutContainer = document.createElement("div");
    layoutContainer.className = "codeberg-toc-layout-container";

    const contentWrapper = document.createElement("div");
    contentWrapper.className = "codeberg-toc-main-content";

    root = document.createElement("div");
    root.id = name;

    if (fileHeader.nextElementSibling) {
      fileHeader.parentNode.insertBefore(layoutContainer, fileHeader.nextElementSibling);
    } else {
      fileHeader.parentNode.appendChild(layoutContainer);
    }

    contentWrapper.appendChild(fileView);
    layoutContainer.appendChild(contentWrapper);
    layoutContainer.appendChild(root);

    const reactRoot = client.createRoot(root);
    const app = /* @__PURE__ */ jsxRuntimeExports.jsx(require$$0.StrictMode, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(App, {}) });
    reactRoot.render(app);
  }

  function run() {
    const isRepoPage = window.location.pathname.includes('/src/') ||
                       window.location.href.includes('codeberg.org') && !window.location.pathname.includes('/api/');

    if (!isRepoPage) {
      return;
    }

    render();
  }

  function initTOC() {
    run();

    const observer = new MutationObserver((mutations) => {
      let shouldRun = false;

      mutations.forEach((mutation) => {
        if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
          const hasReadme = Array.from(mutation.addedNodes).some(node =>
            node.nodeType === 1 &&
            (node.querySelector && node.querySelector('#readme'))
          );
          if (hasReadme) {
            shouldRun = true;
          }
        }
      });

      if (shouldRun) {
        setTimeout(run, 100);
      }
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      initTOC();
    });
  } else {
    initTOC();
  }

})(React, ReactDOM);