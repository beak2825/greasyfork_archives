// ==UserScript==
// @name         NotebookLM Quiz Exporter Pro
// @namespace    nlmq-pro
// @version      1.4.2
// @match        *://notebooklm.google.com/*
// @match        *://notebooklm.googleusercontent.com/*
// @match        *://*.usercontent.goog/*
// @match        *://*.usercontent.google.com/*
// @match        *://*.googleusercontent.com/*
// @run-at       document-start
// @grant        none
// @description  NotebookLM Quiz Exporter
// @author       Marx
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/559484/NotebookLM%20Quiz%20Exporter%20Pro.user.js
// @updateURL https://update.greasyfork.org/scripts/559484/NotebookLM%20Quiz%20Exporter%20Pro.meta.js
// ==/UserScript==

(() => {
  "use strict";

  const BUS = "NLMQ_BUS_V4";
  const CFG_KEY = "nlmq_pro_cfg_v4";
  const DEFAULT_CFG = {
    htmlMode: "single",
    explain: "auto",
    autoCheckSingle: true,
    openPanelOnCapture: false,
  };

  const isTop = (() => {
    try {
      return window.top === window.self;
    } catch {
      return true;
    }
  })();

  const safeText = (v) => (v == null ? "" : String(v)).replace(/\r\n/g, "\n");
  const decodeMaybeEntities = (s) =>
    safeText(s)
      .replace(/&quot;/g, '"')
      .replace(/&#34;/g, '"')
      .replace(/&amp;/g, "&")
      .replace(/&#39;/g, "'")
      .trim();

  const pad2 = (n) => String(n).padStart(2, "0");
  const ts = () => {
    const d = new Date();
    return `${d.getFullYear()}${pad2(d.getMonth() + 1)}${pad2(d.getDate())}_${pad2(d.getHours())}${pad2(d.getMinutes())}${pad2(d.getSeconds())}`;
  };
  const nowIso = () => new Date().toISOString();
  const letter = (i) => String.fromCharCode(65 + i);
  const escHtml = (s) =>
    safeText(s)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");

  const shorten = (s, n) => {
    const t = safeText(s);
    if (t.length <= n) return t;
    return t.slice(0, Math.max(0, n - 1)) + "…";
  };

  const storageGet = (k) => {
    try {
      return localStorage.getItem(k);
    } catch {
      return null;
    }
  };
  const storageSet = (k, v) => {
    try {
      localStorage.setItem(k, v);
    } catch {}
  };

  const loadCfg = () => {
    try {
      const raw = storageGet(CFG_KEY);
      if (!raw) return { ...DEFAULT_CFG };
      const obj = JSON.parse(raw);
      return { ...DEFAULT_CFG, ...(obj && typeof obj === "object" ? obj : {}) };
    } catch {
      return { ...DEFAULT_CFG };
    }
  };
  const saveCfg = (cfg) => storageSet(CFG_KEY, JSON.stringify(cfg));

  const getNotebookId = (href) => {
    const m = safeText(href).match(/\/notebook\/([^\/?#]+)/);
    return m ? m[1] : "";
  };

  const findQuizTitleInDoc = (doc) => {
    try {
      const q = (sel) => doc.querySelector(sel);
      const el =
        q('artifact-viewer input[formcontrolname="title"]') ||
        q('input[formcontrolname="title"][aria-label]') ||
        q('input.artifact-title[formcontrolname="title"]') ||
        q('input.artifact-title') ||
        q('studio-panel artifact-viewer input[formcontrolname="title"]') ||
        q('input[aria-label="制品标题"][formcontrolname="title"]');
      const v = el && typeof el.value === "string" ? el.value.trim() : "";
      return v;
    } catch {
      return "";
    }
  };

  const getQuizTitleLive = () => {
    const t0 = findQuizTitleInDoc(document);
    if (t0) return t0;
    try {
      const iframes = Array.from(document.querySelectorAll("iframe")).slice(0, 12);
      for (const f of iframes) {
        try {
          const d = f.contentDocument;
          if (!d) continue;
          const t = findQuizTitleInDoc(d);
          if (t) return t;
        } catch {}
      }
    } catch {}
    return "";
  };

  const isValidQuizArray = (arr) => {
    if (!Array.isArray(arr) || !arr.length) return false;
    const q = arr[0];
    return typeof q?.question === "string" && Array.isArray(q?.answerOptions);
  };

  const normalizePayload = (rawObj, captureUrl) => {
    const quiz = Array.isArray(rawObj?.quiz) ? rawObj.quiz : [];
    const href = location.href;
    return {
      meta: {
        exportedAt: nowIso(),
        pageUrl: href,
        pageTitle: document.title || "NotebookLM",
        notebookId: getNotebookId(href),
        captureUrl: safeText(captureUrl || ""),
        quizTitle: "",
      },
      quiz: quiz.map((q) => ({
        question: safeText(q?.question),
        hint: safeText(q?.hint),
        answerOptions: (Array.isArray(q?.answerOptions) ? q.answerOptions : []).map((o) => ({
          text: safeText(o?.text),
          isCorrect: !!o?.isCorrect,
          rationale: safeText(o?.rationale),
        })),
      })),
    };
  };

  const deepFindBestQuiz = (root) => {
    const stack = [{ v: root, d: 0 }];
    const seen = new Set();
    let best = null;
    let bestLen = 0;

    while (stack.length) {
      const { v, d } = stack.pop();
      if (v == null) continue;

      if (typeof v === "object") {
        if (seen.has(v)) continue;
        seen.add(v);

        const qz = v.quiz;
        if (Array.isArray(qz) && isValidQuizArray(qz)) {
          if (qz.length > bestLen) {
            bestLen = qz.length;
            best = v;
          }
        }

        if (d >= 10) continue;
        if (Array.isArray(v)) {
          for (let i = 0; i < v.length; i++) stack.push({ v: v[i], d: d + 1 });
        } else {
          for (const k of Object.keys(v)) stack.push({ v: v[k], d: d + 1 });
        }
        continue;
      }

      if (typeof v === "string") {
        if (d >= 6) continue;
        const t = v.trim();
        if ((t.startsWith("{") || t.startsWith("[")) && /"quiz"\s*:/.test(t)) {
          try {
            stack.push({ v: JSON.parse(t), d: d + 1 });
          } catch {}
        }
      }
    }
    return best;
  };

  const findQuizFromHtml = (text) => {
    if (!/data-app-data/i.test(text)) return null;

    let best = null;
    let bestLen = 0;

    const tryAttr = (rawVal) => {
      try {
        const obj = JSON.parse(decodeMaybeEntities(rawVal));
        if (Array.isArray(obj?.quiz) && isValidQuizArray(obj.quiz)) {
          if (obj.quiz.length > bestLen) {
            bestLen = obj.quiz.length;
            best = obj;
          }
        }
      } catch {}
    };

    const re1 = /data-app-data\s*=\s*"([^"]+)"/g;
    const re2 = /data-app-data\s*=\s*'([^']+)'/g;

    let m;
    while ((m = re1.exec(text)) !== null) tryAttr(m[1]);
    while ((m = re2.exec(text)) !== null) tryAttr(m[1]);

    return best;
  };

  const parseBatchSegments = (text) => {
    let t = safeText(text);
    if (t.startsWith(")]}'")) {
      t = t.slice(4);
      if (t.startsWith("\n")) t = t.slice(1);
    }
    const lines = t
      .split("\n")
      .map((x) => x.trim())
      .filter((x) => x);

    const segs = [];
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      if (/^\d+$/.test(line) && i + 1 < lines.length) {
        const jsonLine = lines[i + 1];
        i++;
        try {
          segs.push(JSON.parse(jsonLine));
        } catch {}
      } else {
        try {
          segs.push(JSON.parse(line));
        } catch {}
      }
    }
    return segs;
  };

  const findQuizFromBatch = (text) => {
    const segs = parseBatchSegments(text);
    let best = null;
    let bestLen = 0;
    for (const seg of segs) {
      const q = deepFindBestQuiz(seg);
      const len = q?.quiz?.length || 0;
      if (q && len > bestLen) {
        bestLen = len;
        best = q;
      }
    }
    return best;
  };

  const findQuizFromJson = (text) => {
    try {
      const obj = JSON.parse(text);
      return deepFindBestQuiz(obj);
    } catch {
      return null;
    }
  };

  const tryParseAppData = (raw) => {
    if (!raw) return null;
    try {
      const obj = JSON.parse(decodeMaybeEntities(raw));
      if (Array.isArray(obj?.quiz) && isValidQuizArray(obj.quiz)) return obj;
    } catch {}
    return null;
  };

  const quickNeedle = (t) => /"quiz"\s*:|\banswerOptions\b|data-app-data/i.test(t);

  const shouldInspectByUrl = (url) => {
    const u = safeText(url);
    if (!u) return false;
    if (/batchexecute/i.test(u)) return true;
    if (/notebooklm-apps/i.test(u)) return true;
    if (/notebooklm/i.test(u)) return true;
    return false;
  };

  const state = {
    cfg: loadCfg(),
    lastSig: "",
    lastBundle: null,
    ui: null,
  };

  const bundleSignature = (bundle) => {
    const q = bundle?.quiz || [];
    const n = q.length;
    const a = (q[0]?.question || "").slice(0, 90);
    const b = (q[n - 1]?.question || "").slice(0, 90);
    const id = bundle?.meta?.notebookId || "";
    return `${id}|${n}|${a}|${b}`;
  };

  const postToTop = (kind, payload) => {
    try {
      window.top.postMessage({ type: BUS, kind, ...payload }, "*");
    } catch {}
  };

  const enrichBundleMeta = (bundle) => {
    if (!bundle?.meta) return bundle;
    if (isTop) {
      const live = getQuizTitleLive();
      if (live) bundle.meta.quizTitle = live;
    }
    if (!bundle.meta.quizTitle) bundle.meta.quizTitle = bundle.meta.pageTitle || "";
    return bundle;
  };

  const setCaptured = (bundle) => {
    if (!bundle?.quiz?.length) return;

    enrichBundleMeta(bundle);

    const sig = bundleSignature(bundle);
    if (sig && sig === state.lastSig) return;

    state.lastSig = sig;
    state.lastBundle = bundle;

    uiSync();
    uiToast(`已捕获 ${bundle.quiz.length} 题`);

    if (!isTop) postToTop("CAPTURE", { bundle });
    if (isTop && state.cfg.openPanelOnCapture) uiOpen(true);
  };

  window.addEventListener("message", (ev) => {
    const msg = ev?.data;
    if (!msg || msg.type !== BUS) return;
    if (msg.kind === "CAPTURE" && msg.bundle?.quiz?.length) setCaptured(msg.bundle);
  });

  const processText = (url, ct, text) => {
    const t = safeText(text);
    if (!t) return;
    if (!quickNeedle(t)) return;

    const isBatch = /batchexecute/i.test(url) || t.startsWith(")]}'");
    let found = null;

    if (isBatch) found = findQuizFromBatch(t);
    if (!found && /data-app-data/i.test(t)) found = findQuizFromHtml(t);

    const tt = t.trim();
    if (!found && (tt.startsWith("{") || tt.startsWith("["))) found = findQuizFromJson(tt);

    if (!found) return;

    setCaptured(normalizePayload(found, url));
  };

  const patchFetch = () => {
    if (window.__nlmq_fetch_patched__) return;
    window.__nlmq_fetch_patched__ = true;

    const orig = window.fetch;
    if (typeof orig !== "function") return;

    window.fetch = async function (...args) {
      const res = await orig.apply(this, args);
      try {
        const u = typeof args[0] === "string" ? args[0] : args[0]?.url || "";
        if (!shouldInspectByUrl(u)) return res;
        const ct = res.headers?.get?.("content-type") || "";
        const clone = res.clone();
        clone.text().then((txt) => processText(u, ct, txt)).catch(() => {});
      } catch {}
      return res;
    };
  };

  const patchXHR = () => {
    if (window.__nlmq_xhr_patched__) return;
    window.__nlmq_xhr_patched__ = true;

    const open = XMLHttpRequest.prototype.open;
    const send = XMLHttpRequest.prototype.send;

    XMLHttpRequest.prototype.open = function (method, url) {
      this.__nlmq_url = url;
      return open.apply(this, arguments);
    };

    XMLHttpRequest.prototype.send = function () {
      this.addEventListener(
        "load",
        () => {
          try {
            const u = this.__nlmq_url || "";
            if (!shouldInspectByUrl(u)) return;
            const ct = this.getResponseHeader("content-type") || "";
            processText(u, ct, this.responseText);
          } catch {}
        },
        { once: true }
      );
      return send.apply(this, arguments);
    };
  };

  const patchCreateObjectURL = () => {
    if (window.__nlmq_objurl_patched__) return;
    window.__nlmq_objurl_patched__ = true;

    const orig = URL.createObjectURL;
    if (typeof orig !== "function") return;

    URL.createObjectURL = function (obj) {
      const url = orig.apply(this, arguments);
      try {
        const isBlobLike = obj && typeof obj === "object" && typeof obj.text === "function" && typeof obj.size === "number";
        if (!isBlobLike) return url;

        const type = safeText(obj.type || "").toLowerCase();
        if (type.startsWith("image/") || type.startsWith("video/") || type.startsWith("audio/")) return url;
        if (obj.size > 10 * 1024 * 1024) return url;

        const mayText =
          !type ||
          type.includes("text") ||
          type.includes("json") ||
          type.includes("xml") ||
          type.includes("html") ||
          type.includes("xhtml");

        if (!mayText) return url;

        obj
          .text()
          .then((txt) => {
            const t = safeText(txt);
            if (!t) return;
            if (!quickNeedle(t) && !t.startsWith(")]}'")) return;
            processText(`objurl:${url}`, type || "blob", t);
          })
          .catch(() => {});
      } catch {}
      return url;
    };
  };

  const startDomObserver = () => {
    if (window.__nlmq_domobs_started__) return;
    window.__nlmq_domobs_started__ = true;

    let scheduled = false;
    const queueScan = (node, tag) => {
      if (scheduled) return;
      scheduled = true;
      setTimeout(() => {
        scheduled = false;
        scanNodeForQuiz(node, tag);
      }, 60);
    };

    const scanNodeForQuiz = (node, tag) => {
      if (!node || node.nodeType !== 1) node = document.documentElement;
      const el = node;

      if (el?.hasAttribute?.("data-app-data")) {
        const obj = tryParseAppData(el.getAttribute("data-app-data"));
        if (obj) setCaptured(normalizePayload(obj, `dom:${tag || "attr"}`));
      }

      if (el?.querySelectorAll) {
        const list = el.querySelectorAll("[data-app-data]");
        let c = 0;
        for (const n of list) {
          if (c++ > 80) break;
          const obj = tryParseAppData(n.getAttribute("data-app-data"));
          if (obj) {
            setCaptured(normalizePayload(obj, `dom:${tag || "subtree"}`));
            break;
          }
        }
      }
    };

    const mo = new MutationObserver((muts) => {
      for (const m of muts) {
        if (m.type === "attributes" && m.attributeName === "data-app-data") queueScan(m.target, "attr");
        else if (m.type === "childList") queueScan(m.target, "add");
      }
    });

    const root = document.documentElement || document;
    try {
      mo.observe(root, { subtree: true, childList: true, attributes: true, attributeFilter: ["data-app-data"] });
    } catch {
      try {
        mo.observe(root, { subtree: true, childList: true, attributes: true });
      } catch {}
    }

    setTimeout(() => {
      try {
        const obj = tryParseAppData(document.querySelector("[data-app-data]")?.getAttribute?.("data-app-data"));
        if (obj) setCaptured(normalizePayload(obj, "dom:initial"));
      } catch {}
    }, 900);
  };

  const renderTxt = (bundle) => {
    const { meta, quiz } = bundle;
    const title = meta.quizTitle || meta.pageTitle || "NotebookLM";
    const out = [];
    out.push(`NotebookLM 测验导出：${title}`.trim());
    out.push(`URL：${meta.pageUrl}`);
    out.push(`导出时间：${meta.exportedAt}`);
    out.push(`题数：${quiz.length}`);
    out.push("");

    quiz.forEach((q, idx) => {
      const opts = q.answerOptions || [];
      const correct = opts.map((o, i) => (o.isCorrect ? letter(i) : null)).filter(Boolean);
      out.push(`${idx + 1}. ${q.question}`.trim());
      opts.forEach((o, i) => out.push(`  ${letter(i)}. ${o.text}`.trim()));
      out.push(`  答案：${correct.length ? correct.join(", ") : "（未标注）"}`);
      if (q.hint) out.push(`  提示：${q.hint}`);
      const hasR = opts.some((o) => o.rationale);
      if (hasR) {
        out.push(`  解析：`);
        opts.forEach((o, i) => o.rationale && out.push(`    - ${letter(i)}：${o.rationale}`));
      }
      out.push("");
    });
    return out.join("\n");
  };

  const renderMd = (bundle) => {
    const { meta, quiz } = bundle;
    const title = meta.quizTitle || meta.pageTitle || "NotebookLM";
    const out = [];
    out.push(`# ${title} - Quiz`);
    out.push("");
    out.push(`- URL：${meta.pageUrl}`);
    out.push(`- 导出时间：${meta.exportedAt}`);
    out.push(`- 题数：${quiz.length}`);
    out.push("");

    quiz.forEach((q, idx) => {
      const opts = q.answerOptions || [];
      const correct = opts.map((o, i) => (o.isCorrect ? letter(i) : null)).filter(Boolean);
      out.push(`## ${idx + 1}. ${q.question}`.trim());
      out.push("");
      opts.forEach((o, i) => out.push(`- ${letter(i)}. ${o.text}`.trim()));
      out.push("");
      out.push(`**答案：** ${correct.length ? correct.join(", ") : "（未标注）"}`);
      if (q.hint) out.push(`\n**提示：** ${q.hint}`.trim());
      const hasR = opts.some((o) => o.rationale);
      if (hasR) {
        out.push("");
        out.push(`**解析：**`);
        opts.forEach((o, i) => o.rationale && out.push(`- ${letter(i)}：${o.rationale}`));
      }
      out.push("");
      out.push("---");
      out.push("");
    });

    return out.join("\n");
  };

  const renderHtmlPro = (bundle, cfg) => {
    const data = {
      meta: bundle.meta,
      quiz: bundle.quiz,
      config: {
        mode: cfg.htmlMode === "scroll" ? "scroll" : "single",
        explain: cfg.explain === "always" || cfg.explain === "never" ? cfg.explain : "auto",
        autoCheckSingle: !!cfg.autoCheckSingle,
      },
      generator: { name: "NotebookLM Quiz Exporter Pro", version: "1.4.1" },
    };

    const dataJson = JSON.stringify(data).replace(/</g, "\\u003c");

    const css = `
:root{--bg:#0b0c0f;--panel:#101223;--card:#141729;--fg:#e9e9ee;--muted:#a6a8b3;--line:#2a2f48;--good:#2ecc71;--bad:#ff5c5c;--accent:#6aa4ff;--btn:#1b2036;--btn2:#151a2c;--shadow:0 18px 48px rgba(0,0,0,.35);--r:14px}
@media (prefers-color-scheme: light){:root{--bg:#f6f7fb;--panel:#ffffff;--card:#ffffff;--fg:#111;--muted:#555;--line:#e7e9f0;--good:#1e9e53;--bad:#d83b3b;--accent:#2e6cff;--btn:#f1f3fa;--btn2:#eef1f9;--shadow:0 18px 48px rgba(17,17,17,.12)}}
*{box-sizing:border-box;writing-mode:inherit;text-orientation:inherit}
html,body{margin:0;padding:0;min-height:100%;background:var(--bg);color:var(--fg);font-family:ui-sans-serif,system-ui,-apple-system,Segoe UI,Roboto,Helvetica,Arial;line-height:1.35;writing-mode:horizontal-tb !important;text-orientation:mixed !important;direction:ltr !important}
a{color:inherit}
button,select,input,textarea{font:inherit;writing-mode:horizontal-tb !important;text-orientation:mixed !important;direction:ltr !important}
button,select{background:var(--btn);color:var(--fg);border:1px solid var(--line);border-radius:12px;padding:8px 10px;cursor:pointer;display:inline-flex;align-items:center;justify-content:center;gap:6px}
button:hover,select:hover{filter:brightness(1.03)}
button:active{transform:translateY(1px)}
button:disabled{opacity:.6;cursor:not-allowed;transform:none}
kbd{font-size:12px;padding:2px 6px;border:1px solid var(--line);border-radius:8px;background:var(--btn2);color:var(--muted)}

.top{position:sticky;top:0;z-index:20;background:color-mix(in srgb, var(--bg) 88%, transparent);backdrop-filter:blur(10px);border-bottom:1px solid var(--line)}
.topin{max-width:980px;margin:0 auto;padding:10px 12px;display:flex;flex-direction:column;gap:10px}
.toprow{display:flex;gap:10px;align-items:center;flex-wrap:wrap}
.brand{display:flex;gap:10px;align-items:center;min-width:0;flex:1 1 420px}
.logo{width:34px;height:34px;border-radius:12px;background:linear-gradient(135deg, color-mix(in srgb, var(--accent) 75%, transparent), color-mix(in srgb, var(--good) 40%, transparent));border:1px solid var(--line);flex:0 0 auto}
.title{display:flex;flex-direction:column;gap:2px;min-width:0}
.title .t{font-weight:850;line-height:1.1;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.title .s{font-size:12px;color:var(--muted);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.actionsTop{display:flex;gap:8px;align-items:center;flex:0 1 auto;flex-wrap:wrap;justify-content:flex-end}
.pill{border-radius:999px;padding:8px 12px}
.toprow2{display:flex;gap:10px;align-items:center;flex-wrap:wrap}
.progress{flex:1 1 520px;height:10px;border-radius:999px;border:1px solid var(--line);overflow:hidden;background:var(--btn2);min-width:220px}
.progress .bar{height:100%;width:0%;background:linear-gradient(90deg,var(--accent),color-mix(in srgb, var(--accent) 60%, var(--good)))}
.stat{font-size:12px;color:var(--muted);white-space:nowrap;flex:0 0 auto}

.main{max-width:980px;margin:0 auto;padding:14px 12px 76px}
.card{background:var(--card);border:1px solid var(--line);border-radius:var(--r);padding:14px;margin-top:12px}
.card.hidden{display:none}

.qhead{display:grid;grid-template-columns:auto 1fr;gap:10px;align-items:start}
.qno{font-weight:950;line-height:1.1;padding-top:1px}
.qmeta{display:flex;gap:8px;align-items:center;flex-wrap:wrap;color:var(--muted);font-size:12px}
.badge{border:1px solid var(--line);border-radius:999px;padding:2px 8px;background:var(--btn2)}
.qtext{grid-column:1 / -1;font-weight:760;line-height:1.55;margin-top:2px;text-indent:2em;word-break:break-word}

.opts{margin-top:12px;display:grid;gap:10px}
.opt{display:flex;gap:10px;align-items:flex-start;padding:10px 12px;border:1px solid var(--line);border-radius:12px;background:color-mix(in srgb, var(--card) 88%, transparent);transition:transform .05s ease, filter .05s ease, border-color .12s ease, box-shadow .12s ease}
.opt:hover{filter:brightness(1.02)}
.opt:active{transform:translateY(1px)}
.opt input{margin-top:2px;flex:0 0 auto}
.opt.selected{border-color:color-mix(in srgb, var(--accent) 45%, var(--line));box-shadow:0 0 0 2px color-mix(in srgb, var(--accent) 18%, transparent) inset}
.opt.correct{border-color:color-mix(in srgb, var(--good) 75%, var(--line));box-shadow:0 0 0 2px color-mix(in srgb, var(--good) 18%, transparent) inset}
.opt.wrong{border-color:color-mix(in srgb, var(--bad) 80%, var(--line));box-shadow:0 0 0 2px color-mix(in srgb, var(--bad) 16%, transparent) inset}

.actions{margin-top:12px;display:flex;gap:10px;flex-wrap:wrap}
.feedback{margin-top:10px;font-weight:850}
.feedback.good{color:var(--good)}
.feedback.bad{color:var(--bad)}
.detail{margin-top:10px;color:var(--muted);font-size:13px;line-height:1.65;display:none;word-break:break-word}
.detail.show{display:block}

.hr{height:1px;background:var(--line);margin:10px 0}
.toast{position:fixed;left:50%;transform:translateX(-50%);bottom:14px;z-index:60;max-width:calc(100vw - 24px);background:var(--panel);border:1px solid var(--line);border-radius:999px;padding:10px 14px;box-shadow:var(--shadow);font-size:13px;color:var(--fg);display:none}
.overlay{position:fixed;inset:0;background:rgba(0,0,0,.35);opacity:0;pointer-events:none;transition:opacity .16s ease;z-index:39}
.overlay.show{opacity:1;pointer-events:auto}
.side{position:fixed;top:0;right:0;height:100vh;width:340px;max-width:92vw;background:var(--panel);border-left:1px solid var(--line);transform:translateX(100%);transition:transform .16s ease;z-index:40;display:flex;flex-direction:column;box-shadow:var(--shadow)}
.side.open{transform:translateX(0)}
.sideHead{padding:12px;border-bottom:1px solid var(--line);display:flex;gap:10px;align-items:center}
.sideHead .h{font-weight:850}
.sideHead .sp{flex:1}
.tabRow{padding:10px 12px;display:flex;gap:8px}
.tabBtn{flex:1;border-radius:12px;background:var(--btn2)}
.tabBtn.active{background:var(--btn);border-color:color-mix(in srgb, var(--accent) 30%, var(--line))}
.pane{padding:12px;overflow:auto}
.grid{display:grid;grid-template-columns:repeat(6,1fr);gap:8px}
.qbtn{border-radius:12px;padding:10px 0;text-align:center;border:1px solid var(--line);background:var(--btn2);color:var(--fg);user-select:none}
.qbtn.todo{opacity:.85}
.qbtn.ok{border-color:color-mix(in srgb, var(--good) 55%, var(--line));box-shadow:0 0 0 2px color-mix(in srgb, var(--good) 14%, transparent) inset}
.qbtn.bad{border-color:color-mix(in srgb, var(--bad) 55%, var(--line));box-shadow:0 0 0 2px color-mix(in srgb, var(--bad) 14%, transparent) inset}
.qbtn.active{outline:2px solid color-mix(in srgb, var(--accent) 55%, transparent);outline-offset:1px}
.row{display:flex;gap:10px;align-items:center;flex-wrap:wrap}
.row .lab{min-width:92px;color:var(--muted);font-size:12px}
.row .ctrl{flex:1 1 auto;min-width:160px}
.small{font-size:12px;color:var(--muted)}
.foot{max-width:980px;margin:0 auto;padding:0 12px 22px;color:var(--muted);font-size:12px}
@media (max-width: 540px){.grid{grid-template-columns:repeat(5,1fr)}}
`;

    const js = `
const DATA = JSON.parse(document.getElementById("nlmq_data").textContent);
const quiz = Array.isArray(DATA.quiz) ? DATA.quiz : [];
const cfg = DATA.config || {};
const meta = DATA.meta || {};
const $ = (sel, root=document) => root.querySelector(sel);
const $$ = (sel, root=document) => Array.from(root.querySelectorAll(sel));
const letter = (i)=>String.fromCharCode(65+i);

const settings = {
  mode: cfg.mode === "scroll" ? "scroll" : "single",
  explain: cfg.explain === "always" || cfg.explain === "never" ? cfg.explain : "auto",
  autoCheckSingle: !!cfg.autoCheckSingle,
  filter: "all",
  order: quiz.map((_, i)=>i),
  currentPos: 0,
  sideTab: "list"
};

const qState = quiz.map(()=>({ checked:false, correct:false, selected:[], shownDetail:false }));

function toast(msg){
  const t = $("#toast");
  t.textContent = msg;
  t.style.display = "block";
  clearTimeout(t._t);
  t._t = setTimeout(()=> t.style.display="none", 1600);
}

function correctIdxs(q){
  const opts = Array.isArray(q.answerOptions) ? q.answerOptions : [];
  return opts.map((o,i)=>o && o.isCorrect ? i : -1).filter(i=>i>=0);
}

function computeStats(){
  const checked = qState.filter(s=>s.checked).length;
  const correct = qState.filter(s=>s.checked && s.correct).length;
  return { total: quiz.length, checked, correct };
}

function updateTop(){
  const { total, checked, correct } = computeStats();
  $("#stat").textContent = "已判分 " + checked + "/" + total + " · 正确 " + correct;
  const pct = total ? Math.round((checked/total)*100) : 0;
  $("#bar").style.width = pct + "%";
  $("#modeBtn").textContent = settings.mode === "single" ? "单题" : "滚动";
}

function applyFilterToCards(){
  if (settings.mode !== "scroll") return;
  const filter = settings.filter;
  $$(".card").forEach(card=>{
    const qi = parseInt(card.getAttribute("data-qi"), 10);
    const st = qState[qi];
    let show = true;
    if (filter === "todo") show = !st.checked;
    else if (filter === "wrong") show = st.checked && !st.correct;
    card.classList.toggle("hidden", !show);
  });
}

function activeQi(){
  return settings.order[settings.currentPos] ?? 0;
}

function topOffset(){
  const top = document.querySelector(".top");
  const h = top ? top.offsetHeight : 0;
  return Math.max(0, h + 10);
}

function scrollToCard(card){
  const r = card.getBoundingClientRect();
  const y = window.scrollY + r.top - topOffset();
  window.scrollTo({ top: Math.max(0, y), behavior: "smooth" });
}

function showPos(pos){
  const max = settings.order.length;
  settings.currentPos = Math.max(0, Math.min(max-1, pos));
  const qi = activeQi();

  if (settings.mode === "single") {
    $$(".card").forEach(c=>{
      const cqi = parseInt(c.getAttribute("data-qi"), 10);
      c.classList.toggle("hidden", cqi !== qi);
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  } else {
    const card = document.querySelector('.card[data-qi="'+qi+'"]');
    if (card) scrollToCard(card);
  }

  updateSideActive(qi);
}

function next(delta){
  showPos(settings.currentPos + delta);
}

function nextTodo(){
  for (let p=0;p<settings.order.length;p++){
    const qi = settings.order[p];
    if (!qState[qi].checked){
      showPos(p);
      toast("跳到下一未做");
      return;
    }
  }
  toast("已全部判分");
}

function setMode(m){
  settings.mode = (m === "scroll") ? "scroll" : "single";
  if (settings.mode === "scroll") {
    $$(".card").forEach(c=>c.classList.remove("hidden"));
    applyFilterToCards();
    toast("切换：滚动多题");
  } else {
    showPos(settings.currentPos);
    toast("切换：单题翻页");
  }
  updateTop();
}

function setExplainMode(m){
  settings.explain = (m === "always" || m === "never") ? m : "auto";
  $$(".card").forEach(card=>{
    const qi = parseInt(card.getAttribute("data-qi"), 10);
    applyDetailPolicy(qi);
  });
  toast("解析显示：" + (settings.explain === "always" ? "总是" : settings.explain === "never" ? "从不" : "自动"));
}

function applyDetailPolicy(qi){
  const card = document.querySelector('.card[data-qi="'+qi+'"]');
  if (!card) return;
  const det = card.querySelector(".detail");
  const st = qState[qi];
  if (settings.explain === "never") det.classList.remove("show");
  else if (settings.explain === "always") det.classList.add("show");
  else {
    const show = st.shownDetail || (st.checked && !st.correct);
    det.classList.toggle("show", !!show);
  }
}

function setAutoCheckSingle(on){
  settings.autoCheckSingle = !!on;
  toast("单选自动判分：" + (settings.autoCheckSingle ? "开" : "关"));
}

function selectedIdxs(qi){
  const card = document.querySelector('.card[data-qi="'+qi+'"]');
  if (!card) return [];
  const inputs = Array.from(card.querySelectorAll('input[name="q'+qi+'"]'));
  const sel = [];
  inputs.forEach((inp, i)=>{ if (inp.checked) sel.push(i); });
  return sel;
}

function setDisabled(qi, disabled){
  const card = document.querySelector('.card[data-qi="'+qi+'"]');
  if (!card) return;
  Array.from(card.querySelectorAll('input[name="q'+qi+'"]')).forEach(inp=> inp.disabled = disabled);
}

function clearMarks(qi){
  const card = document.querySelector('.card[data-qi="'+qi+'"]');
  if (!card) return;
  card.querySelectorAll(".opt").forEach(o=> o.classList.remove("correct","wrong"));
  const fb = card.querySelector(".feedback");
  fb.className = "feedback";
  fb.textContent = "";
}

function mark(qi, ok, corr){
  const card = document.querySelector('.card[data-qi="'+qi+'"]');
  if (!card) return;
  const opts = Array.from(card.querySelectorAll(".opt"));
  opts.forEach((el, i)=>{ if (corr.includes(i)) el.classList.add("correct"); });
  qState[qi].selected.forEach(i=>{ if (!corr.includes(i)) opts[i]?.classList.add("wrong"); });

  const fb = card.querySelector(".feedback");
  fb.classList.add(ok ? "good" : "bad");
  const corrLetters = corr.length ? corr.map(letter).join(", ") : "（未标注）";
  fb.textContent = ok ? "✅ 正确" : ("❌ 错误（正确答案：" + corrLetters + "）");
}

function evaluate(qi){
  const q = quiz[qi];
  const corr = correctIdxs(q);
  const sel = selectedIdxs(qi);
  qState[qi].selected = sel;

  clearMarks(qi);

  const card = document.querySelector('.card[data-qi="'+qi+'"]');
  if (!card) return;

  if (!corr.length) {
    const fb = card.querySelector(".feedback");
    fb.classList.add("bad");
    fb.textContent = "⚠️ 该题未标注答案，无法判分";
    qState[qi].checked = true;
    qState[qi].correct = false;
    updateTop(); updateSideItem(qi); applyDetailPolicy(qi);
    return;
  }

  if (!sel.length) {
    toast("请先选择一个选项");
    return;
  }

  const ok = sel.length === corr.length && sel.every(i=>corr.includes(i));
  qState[qi].checked = true;
  qState[qi].correct = ok;
  if (!ok && settings.explain !== "never") qState[qi].shownDetail = true;

  mark(qi, ok, corr);
  setDisabled(qi, true);

  applyDetailPolicy(qi);
  updateTop();
  updateSideItem(qi);
  if (settings.mode === "single") updateSideActive(qi);
}

function resetOne(qi){
  const card = document.querySelector('.card[data-qi="'+qi+'"]');
  if (!card) return;
  Array.from(card.querySelectorAll('input[name="q'+qi+'"]')).forEach(inp=>{ inp.checked=false; inp.disabled=false; });
  qState[qi] = { checked:false, correct:false, selected:[], shownDetail:false };
  clearMarks(qi);
  applyDetailPolicy(qi);
  updateTop();
  updateSideItem(qi);
}

function resetAll(){
  quiz.forEach((_, qi)=> resetOne(qi));
  toast("已重置全部题目");
}

function toggleDetail(qi){
  const card = document.querySelector('.card[data-qi="'+qi+'"]');
  if (!card) return;
  const det = card.querySelector(".detail");
  const willShow = !det.classList.contains("show");
  if (settings.explain === "never" && willShow) {
    settings.explain = "auto";
    $("#explainSel").value = "auto";
  }
  qState[qi].shownDetail = willShow;
  applyDetailPolicy(qi);
}

function syncSelectedClass(card, qi){
  const labels = Array.from(card.querySelectorAll(".opt"));
  const inputs = Array.from(card.querySelectorAll('input[name="q'+qi+'"]'));
  labels.forEach((lab, i)=>{
    const on = !!inputs[i]?.checked;
    lab.classList.toggle("selected", on);
  });
}

function buildCard(qi){
  const q = quiz[qi];
  const corr = correctIdxs(q);
  const multi = corr.length > 1;
  const type = multi ? "checkbox" : "radio";

  const card = document.createElement("div");
  card.className = "card";
  card.setAttribute("data-qi", String(qi));

  const head = document.createElement("div");
  head.className = "qhead";

  const left = document.createElement("div");
  left.className = "qno";
  left.textContent = "第 " + (qi+1) + " 题";

  const metaRow = document.createElement("div");
  metaRow.className = "qmeta";
  const badgeType = document.createElement("span");
  badgeType.className = "badge";
  badgeType.textContent = multi ? "多选" : "单选";
  const badgeCnt = document.createElement("span");
  badgeCnt.className = "badge";
  badgeCnt.textContent = (Array.isArray(q.answerOptions) ? q.answerOptions.length : 0) + " 选项";
  metaRow.appendChild(badgeType);
  metaRow.appendChild(badgeCnt);

  const qt = document.createElement("div");
  qt.className = "qtext";
  qt.textContent = q.question || "";

  head.appendChild(left);
  head.appendChild(metaRow);
  head.appendChild(qt);
  card.appendChild(head);

  const optsWrap = document.createElement("div");
  optsWrap.className = "opts";

  const opts = Array.isArray(q.answerOptions) ? q.answerOptions : [];
  opts.forEach((o, oi)=>{
    const lab = document.createElement("label");
    lab.className = "opt";

    const inp = document.createElement("input");
    inp.type = type;
    inp.name = "q" + qi;

    const txt = document.createElement("div");
    const b = document.createElement("b");
    b.textContent = letter(oi) + ". ";
    txt.appendChild(b);
    txt.appendChild(document.createTextNode(o?.text || ""));

    lab.appendChild(inp);
    lab.appendChild(txt);
    optsWrap.appendChild(lab);

    inp.addEventListener("change", ()=>{
      syncSelectedClass(card, qi);
      if (!multi && settings.autoCheckSingle && !qState[qi].checked) evaluate(qi);
    });
  });

  card.appendChild(optsWrap);

  const actions = document.createElement("div");
  actions.className = "actions";

  if (!(settings.mode === "single" && !multi)) {
    const btnCheck = document.createElement("button");
    btnCheck.textContent = multi ? "提交" : "检查";
    btnCheck.addEventListener("click", ()=> evaluate(qi));
    actions.appendChild(btnCheck);
  }

  const btnReset = document.createElement("button");
  btnReset.textContent = "重做";
  btnReset.addEventListener("click", ()=> resetOne(qi));

  const btnDetail = document.createElement("button");
  btnDetail.textContent = "解析/提示";
  btnDetail.addEventListener("click", ()=> toggleDetail(qi));

  actions.appendChild(btnReset);
  actions.appendChild(btnDetail);
  card.appendChild(actions);

  const fb = document.createElement("div");
  fb.className = "feedback";
  card.appendChild(fb);

  const det = document.createElement("div");
  det.className = "detail";

  const hasHint = !!q.hint;
  const anyR = opts.some(x=>x?.rationale);

  if (hasHint) {
    const h = document.createElement("div");
    const hb = document.createElement("b");
    hb.textContent = "提示：";
    h.appendChild(hb);
    h.appendChild(document.createTextNode(q.hint));
    det.appendChild(h);
  }

  if (anyR) {
    const t = document.createElement("div");
    t.style.marginTop = "8px";
    const tb = document.createElement("b");
    tb.textContent = "解析：";
    t.appendChild(tb);
    det.appendChild(t);

    opts.forEach((o, oi)=>{
      if (!o?.rationale) return;
      const r = document.createElement("div");
      r.textContent = "• " + letter(oi) + "：" + o.rationale;
      det.appendChild(r);
    });
  }

  if (!hasHint && !anyR) {
    const none = document.createElement("div");
    none.textContent = "（本题无提示/解析）";
    det.appendChild(none);
  }

  card.appendChild(det);

  const st = qState[qi];
  if (st.checked) {
    Array.from(card.querySelectorAll('input[name="q'+qi+'"]')).forEach((inp, i)=>{
      inp.checked = st.selected.includes(i);
      inp.disabled = true;
    });
    syncSelectedClass(card, qi);
    clearMarks(qi);
    mark(qi, st.correct, corr);
  } else {
    syncSelectedClass(card, qi);
  }

  applyDetailPolicy(qi);
  return card;
}

function buildMain(){
  const main = $("#main");
  main.innerHTML = "";
  settings.order.forEach(qi=> main.appendChild(buildCard(qi)));
  if (settings.mode === "single") showPos(settings.currentPos);
  else applyFilterToCards();
  updateSideGrid();
  updateTop();
}

function updateSideItem(qi){
  const btn = document.querySelector('.qbtn[data-qi="'+qi+'"]');
  if (!btn) return;
  btn.classList.remove("todo","ok","bad");
  const st = qState[qi];
  if (!st.checked) btn.classList.add("todo");
  else if (st.correct) btn.classList.add("ok");
  else btn.classList.add("bad");
}

function updateSideGrid(){
  const grid = $("#grid");
  grid.innerHTML = "";
  settings.order.forEach((qi, pos)=>{
    const b = document.createElement("button");
    b.className = "qbtn";
    b.setAttribute("data-qi", String(qi));
    b.setAttribute("data-pos", String(pos));
    b.textContent = String(pos+1);
    b.title = "题号 " + (qi+1);

    updateSideItem(qi);

    b.addEventListener("click", ()=>{
      settings.currentPos = pos;
      showPos(pos);
      closeSide();
    });

    grid.appendChild(b);
  });
  updateSideActive(activeQi());
}

function updateSideActive(qi){
  $$(".qbtn").forEach(b=> b.classList.remove("active"));
  const btn = document.querySelector('.qbtn[data-qi="'+qi+'"]');
  if (btn) btn.classList.add("active");
}

function openSide(tab){
  if (tab === "settings" || tab === "list") settings.sideTab = tab;
  $("#overlay").classList.add("show");
  $("#side").classList.add("open");
  setSideTab(settings.sideTab);
}

function closeSide(){
  $("#overlay").classList.remove("show");
  $("#side").classList.remove("open");
}

function setSideTab(tab){
  settings.sideTab = tab === "settings" ? "settings" : "list";
  $("#tabList").classList.toggle("active", settings.sideTab === "list");
  $("#tabSettings").classList.toggle("active", settings.sideTab === "settings");
  $("#paneList").style.display = settings.sideTab === "list" ? "block" : "none";
  $("#paneSettings").style.display = settings.sideTab === "settings" ? "block" : "none";
}

function shuffleOrder(){
  const arr = quiz.map((_, i)=>i);
  for (let i=arr.length-1;i>0;i--){
    const j = Math.floor(Math.random()*(i+1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  settings.order = arr;
  settings.currentPos = 0;
  buildMain();
  toast("已打乱题序");
}

function restoreOrder(){
  settings.order = quiz.map((_, i)=>i);
  settings.currentPos = 0;
  buildMain();
  toast("已恢复原始题序");
}

function init(){
  const title = meta.quizTitle || meta.pageTitle || "Quiz";
  $("#titleT").textContent = title;
  $("#titleS").textContent = meta.pageUrl || "";
  $("#openSrc").href = meta.pageUrl || "#";
  $("#openSrc").textContent = "打开来源";

  $("#modeBtn").addEventListener("click", ()=> setMode(settings.mode === "single" ? "scroll" : "single"));
  $("#sideBtn").addEventListener("click", ()=> openSide("list"));
  $("#nextBtn").addEventListener("click", ()=> nextTodo());
  $("#prevBtn").addEventListener("click", ()=> next(-1));
  $("#nextQBtn").addEventListener("click", ()=> next(1));

  $("#overlay").addEventListener("click", closeSide);
  $("#closeSide").addEventListener("click", closeSide);

  $("#tabList").addEventListener("click", ()=> setSideTab("list"));
  $("#tabSettings").addEventListener("click", ()=> setSideTab("settings"));

  $("#modeSel").value = settings.mode;
  $("#modeSel").addEventListener("change", (e)=> setMode(e.target.value));

  $("#explainSel").value = settings.explain;
  $("#explainSel").addEventListener("change", (e)=> setExplainMode(e.target.value));

  $("#autoCheck").checked = settings.autoCheckSingle;
  $("#autoCheck").addEventListener("change", (e)=> setAutoCheckSingle(e.target.checked));

  $("#filterSel").value = settings.filter;
  $("#filterSel").addEventListener("change", (e)=>{
    settings.filter = e.target.value || "all";
    applyFilterToCards();
    toast("筛选：" + (settings.filter === "all" ? "全部" : settings.filter === "todo" ? "未做" : "错题"));
  });

  $("#shuffleBtn").addEventListener("click", shuffleOrder);
  $("#restoreBtn").addEventListener("click", restoreOrder);
  $("#resetAllBtn").addEventListener("click", resetAll);

  document.addEventListener("keydown", (e)=>{
    if (e.key === "Escape") closeSide();
    if (e.ctrlKey || e.metaKey || e.altKey) return;

    const tag = (e.target && e.target.tagName) ? e.target.tagName.toLowerCase() : "";
    const inInput = tag === "input" || tag === "textarea" || tag === "select";

    if (!inInput && e.key.toLowerCase() === "l") openSide("list");
    if (!inInput && e.key.toLowerCase() === "s") openSide("settings");
    if (!inInput && e.key.toLowerCase() === "m") setMode(settings.mode === "single" ? "scroll" : "single");

    if (settings.mode === "single" && !inInput) {
      if (e.key === "ArrowLeft") next(-1);
      if (e.key === "ArrowRight") next(1);
      if (e.key.toLowerCase() === "n") next(1);
      if (e.key.toLowerCase() === "p") next(-1);
    }
  });

  buildMain();
  updateTop();
  toast("快捷键：L 列表 · S 设置 · M 模式 · 单题用 ←/→");
}

init();
`;

    const title = bundle.meta.quizTitle || bundle.meta.pageTitle || "Quiz";
    const html = `<!doctype html>
<html lang="zh-CN">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width,initial-scale=1" />
<title>${escHtml(title)} - Quiz</title>
<style>${css}</style>
</head>
<body>
  <div class="top">
    <div class="topin">
      <div class="toprow">
        <div class="brand">
          <div class="logo"></div>
          <div class="title" title="${escHtml(title)}">
            <div class="t" id="titleT"></div>
            <div class="s" id="titleS"></div>
          </div>
        </div>
        <div class="actionsTop">
          <button class="pill" id="modeBtn" title="切换模式 (M)">单题</button>
          <button class="pill" id="nextBtn" title="下一未做">下一未做</button>
          <button class="pill" id="sideBtn" title="打开侧栏 (L)">侧栏</button>
        </div>
      </div>
      <div class="toprow2">
        <div class="progress" aria-label="progress">
          <div class="bar" id="bar"></div>
        </div>
        <div class="stat" id="stat"></div>
      </div>
    </div>
  </div>

  <div class="main" id="main"></div>

  <div class="foot">
    <div>${escHtml(data.generator.name)} v${escHtml(data.generator.version)} · 导出时间 ${escHtml(bundle.meta.exportedAt)}</div>
    <div><a id="openSrc" target="_blank" rel="noopener"></a></div>
  </div>

  <div class="overlay" id="overlay"></div>

  <div class="side" id="side">
    <div class="sideHead">
      <div class="h">题目侧栏</div>
      <div class="sp"></div>
      <button id="closeSide">×</button>
    </div>

    <div class="tabRow">
      <button class="tabBtn active" id="tabList">列表</button>
      <button class="tabBtn" id="tabSettings">设置</button>
    </div>

    <div class="pane" id="paneList">
      <div class="small">点击序号跳题（单题：切换；滚动：滚动定位）</div>
      <div class="hr"></div>
      <div class="grid" id="grid"></div>
      <div class="hr"></div>
      <div class="row">
        <button id="prevBtn" class="pill">上一题</button>
        <button id="nextQBtn" class="pill">下一题</button>
      </div>
      <div class="small" style="margin-top:10px">快捷键：<kbd>←</kbd>/<kbd>→</kbd>（单题） <kbd>L</kbd> 列表 <kbd>S</kbd> 设置 <kbd>M</kbd> 模式</div>
    </div>

    <div class="pane" id="paneSettings" style="display:none">
      <div class="row">
        <div class="lab">模式</div>
        <select class="ctrl" id="modeSel">
          <option value="single">单题翻页</option>
          <option value="scroll">滚动多题</option>
        </select>
      </div>

      <div class="row" style="margin-top:10px">
        <div class="lab">解析显示</div>
        <select class="ctrl" id="explainSel">
          <option value="auto">自动（错题/手动）</option>
          <option value="always">总是显示</option>
          <option value="never">从不显示</option>
        </select>
      </div>

      <div class="row" style="margin-top:10px">
        <div class="lab">单选</div>
        <label class="row" style="gap:8px">
          <input id="autoCheck" type="checkbox" />
          <span class="small">点选自动判分</span>
        </label>
      </div>

      <div class="row" style="margin-top:10px">
        <div class="lab">筛选</div>
        <select class="ctrl" id="filterSel">
          <option value="all">全部</option>
          <option value="todo">未做</option>
          <option value="wrong">错题</option>
        </select>
      </div>

      <div class="hr"></div>

      <div class="row">
        <button id="shuffleBtn" class="pill">打乱题序</button>
        <button id="restoreBtn" class="pill">恢复顺序</button>
      </div>

      <div class="row" style="margin-top:10px">
        <button id="resetAllBtn" class="pill">重置全部</button>
      </div>

      <div class="hr"></div>

      <div class="small">提示：解析/提示按钮可单题展开；快捷键 <kbd>S</kbd> 直接开设置。</div>
    </div>
  </div>

  <div class="toast" id="toast"></div>

  <script id="nlmq_data" type="application/json">${dataJson}</script>
  <script>${js}</script>
</body>
</html>`;

    return html;
  };

  const download = (filename, text, mime) => {
    const blob = new Blob([text], { type: mime || "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.click();
    setTimeout(() => URL.revokeObjectURL(url), 1500);
  };

  const safeFileBase = (bundle) => {
    const id = bundle?.meta?.notebookId ? `_${bundle.meta.notebookId.slice(0, 8)}` : "";
    const title = (bundle?.meta?.quizTitle || bundle?.meta?.pageTitle || "NotebookLM")
      .replace(/[\\/:*?"<>|]+/g, " ")
      .replace(/\s+/g, " ")
      .trim()
      .slice(0, 60);
    return `NotebookLM_Quiz${id}_${title ? title + "_" : ""}${ts()}`;
  };

  const ensureUI = () => {
    if (!isTop) return;
    if (state.ui) return;

    const host = document.createElement("div");
    host.id = "nlmq_pro_host";
    host.style.setProperty("position", "fixed", "important");
    host.style.setProperty("right", "16px", "important");
    host.style.setProperty("bottom", "16px", "important");
    host.style.setProperty("z-index", "2147483647", "important");
    host.style.setProperty("pointer-events", "auto", "important");
    host.style.setProperty("writing-mode", "horizontal-tb", "important");
    host.style.setProperty("text-orientation", "mixed", "important");
    host.style.setProperty("direction", "ltr", "important");

    const shadow = host.attachShadow({ mode: "open" });

    const style = document.createElement("style");
    style.textContent = `
:host{
  writing-mode:horizontal-tb !important;text-orientation:mixed !important;direction:ltr !important;
  font-family:ui-sans-serif,system-ui,-apple-system,Segoe UI,Roboto,Helvetica,Arial;
  line-height:1.35;color-scheme:light dark;
  --panel:#151724;--fg:#f2f2f5;--muted:#a8abb3;--line:#2a2d3c;--btn:#1f2233;--btn2:#191c2b;--shadow:0 18px 48px rgba(0,0,0,.35);--good:#2ecc71;--bad:#ff5c5c;--accent:#6aa4ff
}
@media (prefers-color-scheme: light){
  :host{--panel:#ffffff;--fg:#111;--muted:#555;--line:#e7e9f0;--btn:#f0f2f8;--btn2:#eef1f8;--shadow:0 18px 48px rgba(17,17,17,.12);--good:#1e9e53;--bad:#d83b3b;--accent:#2e6cff}
}
*{box-sizing:border-box;writing-mode:inherit;text-orientation:inherit}
.wrap{position:relative;display:flex;flex-direction:column;align-items:flex-end;gap:10px}
.fab{
  width:46px;height:46px;border-radius:999px;
  background:var(--panel);border:1px solid var(--line);
  box-shadow:var(--shadow);cursor:pointer;
  display:flex;align-items:center;justify-content:center;
  color:var(--fg);user-select:none
}
.fab:active{transform:translateY(1px)}
.badge{
  position:absolute;right:0;top:0;transform:translate(30%,-30%);
  min-width:20px;height:20px;padding:0 6px;border-radius:999px;
  background:var(--accent);color:#fff;font-size:12px;
  display:none;align-items:center;justify-content:center;
  border:1px solid color-mix(in srgb, var(--accent) 60%, #000)
}
.panel{
  width:360px;max-width:calc(100vw - 32px);
  background:var(--panel);border:1px solid var(--line);
  border-radius:16px;box-shadow:var(--shadow);
  padding:12px;display:none;flex-direction:column;gap:10px;
  color:var(--fg);max-height:calc(100vh - 90px);overflow:auto
}
.row{display:flex;gap:10px;align-items:center;flex-wrap:wrap}
.row.center{justify-content:center}
.title{font-weight:900}
.sp{flex:1}
.muted{color:var(--muted);font-size:12px;line-height:1.35;word-break:break-word}
.hr{height:1px;background:var(--line)}
button,select{
  background:var(--btn);color:var(--fg);
  border:1px solid var(--line);border-radius:12px;
  padding:8px 10px;cursor:pointer;font-size:13px;
  display:inline-flex;align-items:center;justify-content:center;gap:6px
}
button:disabled{opacity:.6;cursor:not-allowed}
.pill{border-radius:999px;padding:8px 12px}
.small{font-size:12px;color:var(--muted)}
.toast{
  position:fixed;right:16px;bottom:72px;
  background:var(--panel);border:1px solid var(--line);
  border-radius:999px;padding:10px 14px;
  box-shadow:var(--shadow);font-size:13px;
  display:none;max-width:340px
}
details{border:1px solid var(--line);border-radius:14px;padding:10px;background:var(--btn2)}
summary{cursor:pointer;font-weight:800}
.kv{display:grid;grid-template-columns:72px 1fr;gap:8px}
.kv .k{font-size:12px;color:var(--muted)}
.kv .v{font-size:12px;color:var(--fg);word-break:break-word}
`;

    const wrap = document.createElement("div");
    wrap.className = "wrap";

    const toast = document.createElement("div");
    toast.className = "toast";

    const panel = document.createElement("div");
    panel.className = "panel";

    const hdr = document.createElement("div");
    hdr.className = "row";
    const title = document.createElement("div");
    title.className = "title";
    title.textContent = "Quiz 导出";
    const sp = document.createElement("div");
    sp.className = "sp";
    const btnClose = document.createElement("button");
    btnClose.textContent = "×";
    btnClose.title = "关闭";
    hdr.appendChild(title);
    hdr.appendChild(sp);
    hdr.appendChild(btnClose);

    const status = document.createElement("div");
    status.className = "muted";

    const sub = document.createElement("div");
    sub.className = "muted";

    const rowBtns = document.createElement("div");
    rowBtns.className = "row center";
    const btnTxt = document.createElement("button");
    btnTxt.className = "pill";
    btnTxt.textContent = "TXT";
    const btnMd = document.createElement("button");
    btnMd.className = "pill";
    btnMd.textContent = "MD";
    const btnHtml = document.createElement("button");
    btnHtml.className = "pill";
    btnHtml.textContent = "HTML";
    rowBtns.appendChild(btnTxt);
    rowBtns.appendChild(btnMd);
    rowBtns.appendChild(btnHtml);

    const kv = document.createElement("div");
    kv.className = "kv";
    const kvK1 = document.createElement("div");
    kvK1.className = "k";
    kvK1.textContent = "标题";
    const kvV1 = document.createElement("div");
    kvV1.className = "v";
    const kvK2 = document.createElement("div");
    kvK2.className = "k";
    kvK2.textContent = "链接";
    const kvV2 = document.createElement("div");
    kvV2.className = "v";
    const link = document.createElement("a");
    link.target = "_blank";
    link.rel = "noopener";
    link.textContent = "打开来源";
    kvV2.appendChild(link);
    kv.appendChild(kvK1);
    kv.appendChild(kvV1);
    kv.appendChild(kvK2);
    kv.appendChild(kvV2);

    const settings = document.createElement("details");
    const sum = document.createElement("summary");
    sum.textContent = "设置";
    settings.appendChild(sum);

    const rowMode = document.createElement("div");
    rowMode.className = "row";
    rowMode.style.marginTop = "10px";
    const labMode = document.createElement("div");
    labMode.className = "small";
    labMode.textContent = "HTML 默认模式";
    const selMode = document.createElement("select");
    selMode.style.flex = "1 1 auto";
    const optSingle = document.createElement("option");
    optSingle.value = "single";
    optSingle.textContent = "单题翻页";
    const optScroll = document.createElement("option");
    optScroll.value = "scroll";
    optScroll.textContent = "滚动多题";
    selMode.appendChild(optSingle);
    selMode.appendChild(optScroll);
    rowMode.appendChild(labMode);
    rowMode.appendChild(selMode);

    const rowExplain = document.createElement("div");
    rowExplain.className = "row";
    rowExplain.style.marginTop = "10px";
    const labExplain = document.createElement("div");
    labExplain.className = "small";
    labExplain.textContent = "解析显示";
    const selExplain = document.createElement("select");
    selExplain.style.flex = "1 1 auto";
    [
      ["auto", "自动（错题/手动）"],
      ["always", "总是显示"],
      ["never", "从不显示"],
    ].forEach(([v, t]) => {
      const o = document.createElement("option");
      o.value = v;
      o.textContent = t;
      selExplain.appendChild(o);
    });
    rowExplain.appendChild(labExplain);
    rowExplain.appendChild(selExplain);

    const rowAuto = document.createElement("label");
    rowAuto.className = "row";
    rowAuto.style.marginTop = "10px";
    const chkAuto = document.createElement("input");
    chkAuto.type = "checkbox";
    const txtAuto = document.createElement("span");
    txtAuto.className = "small";
    txtAuto.textContent = "单选题：点选自动判分";
    rowAuto.appendChild(chkAuto);
    rowAuto.appendChild(txtAuto);

    const rowOpen = document.createElement("label");
    rowOpen.className = "row";
    rowOpen.style.marginTop = "10px";
    const chkOpen = document.createElement("input");
    chkOpen.type = "checkbox";
    const txtOpen = document.createElement("span");
    txtOpen.className = "small";
    txtOpen.textContent = "捕获成功自动展开面板";
    rowOpen.appendChild(chkOpen);
    rowOpen.appendChild(txtOpen);

    settings.appendChild(rowMode);
    settings.appendChild(rowExplain);
    settings.appendChild(rowAuto);
    settings.appendChild(rowOpen);

    const hr = () => {
      const d = document.createElement("div");
      d.className = "hr";
      return d;
    };

    panel.appendChild(hdr);
    panel.appendChild(status);
    panel.appendChild(sub);
    panel.appendChild(hr());
    panel.appendChild(rowBtns);
    panel.appendChild(hr());
    panel.appendChild(kv);
    panel.appendChild(hr());
    panel.appendChild(settings);

    const fabWrap = document.createElement("div");
    fabWrap.style.position = "relative";

    const fab = document.createElement("div");
    fab.className = "fab";
    fab.setAttribute("role", "button");
    fab.setAttribute("tabindex", "0");
    fab.textContent = "Q";

    const badge = document.createElement("div");
    badge.className = "badge";
    badge.textContent = "0";
    fabWrap.appendChild(fab);
    fabWrap.appendChild(badge);

    wrap.appendChild(panel);
    wrap.appendChild(fabWrap);

    shadow.appendChild(style);
    shadow.appendChild(toast);
    shadow.appendChild(wrap);

    const mount = () => {
      const p = document.body || document.documentElement;
      if (!p) return;
      if (!p.contains(host)) p.appendChild(host);
      else if (p.lastElementChild !== host) p.appendChild(host);
    };

    const mountLoop = setInterval(() => {
      mount();
      if (document.body) clearInterval(mountLoop);
    }, 250);

    setInterval(mount, 1400);

    const togglePanel = () => uiOpen(!uiIsOpen());
    fab.addEventListener("click", togglePanel);
    fab.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        togglePanel();
      }
    });
    btnClose.addEventListener("click", () => uiOpen(false));

    const applyCfgToUI = () => {
      selMode.value = state.cfg.htmlMode === "scroll" ? "scroll" : "single";
      selExplain.value = state.cfg.explain === "always" || state.cfg.explain === "never" ? state.cfg.explain : "auto";
      chkAuto.checked = !!state.cfg.autoCheckSingle;
      chkOpen.checked = !!state.cfg.openPanelOnCapture;
    };

    selMode.addEventListener("change", () => {
      state.cfg.htmlMode = selMode.value === "scroll" ? "scroll" : "single";
      saveCfg(state.cfg);
      uiToast("已保存设置");
    });

    selExplain.addEventListener("change", () => {
      state.cfg.explain = selExplain.value === "always" || selExplain.value === "never" ? selExplain.value : "auto";
      saveCfg(state.cfg);
      uiToast("已保存设置");
    });

    chkAuto.addEventListener("change", () => {
      state.cfg.autoCheckSingle = !!chkAuto.checked;
      saveCfg(state.cfg);
      uiToast("已保存设置");
    });

    chkOpen.addEventListener("change", () => {
      state.cfg.openPanelOnCapture = !!chkOpen.checked;
      saveCfg(state.cfg);
      uiToast("已保存设置");
    });

    const getBundleForExport = () => {
      const b0 = state.lastBundle;
      if (!b0) return b0;
      const t = getQuizTitleLive();
      if (!t) return b0;
      return { ...b0, meta: { ...(b0.meta || {}), quizTitle: t } };
    };

    const exportTxt = () => {
      const b = getBundleForExport();
      if (!b?.quiz?.length) return uiToast("还没捕获到测验：先打开 Quiz/测验");
      const base = safeFileBase(b);
      download(`${base}.txt`, renderTxt(b), "text/plain;charset=utf-8");
      uiToast("已导出 TXT");
    };

    const exportMd = () => {
      const b = getBundleForExport();
      if (!b?.quiz?.length) return uiToast("还没捕获到测验：先打开 Quiz/测验");
      const base = safeFileBase(b);
      download(`${base}.md`, renderMd(b), "text/markdown;charset=utf-8");
      uiToast("已导出 MD");
    };

    const exportHtml = () => {
      const b = getBundleForExport();
      if (!b?.quiz?.length) return uiToast("还没捕获到测验：先打开 Quiz/测验");
      const base = safeFileBase(b);
      download(`${base}.html`, renderHtmlPro(b, state.cfg), "text/html;charset=utf-8");
      uiToast("已导出 HTML");
    };

    btnTxt.addEventListener("click", exportTxt);
    btnMd.addEventListener("click", exportMd);
    btnHtml.addEventListener("click", exportHtml);

    document.addEventListener("keydown", (e) => {
      if (e.ctrlKey && e.altKey && (e.key === "q" || e.key === "Q")) {
        e.preventDefault();
        uiOpen(!uiIsOpen());
      }
    });

    state.ui = {
      host,
      shadow,
      panel,
      toast,
      badge,
      status,
      sub,
      kvV1,
      link,
      applyCfgToUI,
    };

    applyCfgToUI();
    uiSync();
  };

  const uiIsOpen = () => !!state.ui && state.ui.panel.style.display !== "none";
  const uiOpen = (open) => {
    if (!state.ui) return;
    state.ui.panel.style.display = open ? "flex" : "none";
  };

  const uiToast = (msg) => {
    if (!state.ui) return;
    const t = state.ui.toast;
    t.textContent = msg;
    t.style.display = "block";
    clearTimeout(t._t);
    t._t = setTimeout(() => (t.style.display = "none"), 1600);
  };

  const uiSync = () => {
    if (!state.ui) return;

    const b = state.lastBundle;
    const n = b?.quiz?.length || 0;

    state.ui.badge.style.display = n ? "flex" : "none";
    if (n) state.ui.badge.textContent = n > 99 ? "99+" : String(n);

    if (!n) {
      state.ui.status.textContent = "未捕获（先打开 Quiz/测验界面，让题目加载出来）";
      state.ui.sub.textContent = "快捷键：Ctrl + Alt + Q 打开/关闭面板";
      state.ui.kvV1.textContent = "";
      state.ui.link.href = "#";
    } else {
      const meta = b.meta || {};
      const title = meta.quizTitle || meta.pageTitle || "";
      state.ui.status.textContent = `已捕获：${n} 题`;
      state.ui.sub.textContent = shorten(meta.pageUrl || "", 120);
      state.ui.kvV1.textContent = shorten(title, 140);
      state.ui.link.href = meta.pageUrl || "#";
    }

    state.ui.applyCfgToUI();
  };

  const bootUI = () => {
    if (!isTop) return;
    const w = document.documentElement?.clientWidth || 0;
    const h = document.documentElement?.clientHeight || 0;
    if (w < 240 || h < 240) return;
    ensureUI();
  };

  patchFetch();
  patchXHR();
  patchCreateObjectURL();
  startDomObserver();

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", bootUI, { once: true });
  } else {
    bootUI();
  }

  window.__NLMQ_PRO__ = {
    getCurrent: () => state.lastBundle,
    open: () => uiOpen(true),
    close: () => uiOpen(false),
  };
})();
