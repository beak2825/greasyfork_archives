// ==UserScript==
// @name         ChatGPT TeX Copy & Quote 兼容版
// @namespace    http://tampermonkey.net/
// @version      0.4.0
// @description  让 ChatGPT 的“Ask ChatGPT”引用和普通复制，对包含 KaTeX 的选区优先返回原始 LaTeX（$...$ / $$...$$），不改动 DOM，不叠加多余文本，跨行选区也保持稳定；与 TexCopyer 等脚本兼容。
// @author       schweigen
// @match        https://chatgpt.com/*
// @license      MIT
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/558472/ChatGPT%20TeX%20Copy%20%20Quote%20%E5%85%BC%E5%AE%B9%E7%89%88.user.js
// @updateURL https://update.greasyfork.org/scripts/558472/ChatGPT%20TeX%20Copy%20%20Quote%20%E5%85%BC%E5%AE%B9%E7%89%88.meta.js
// ==/UserScript==

(function () {
  'use strict';

  const RangeCtor = window.Range;
  if (!RangeCtor || !RangeCtor.prototype || RangeCtor.prototype._btqPatched) {
    return;
  }

  const rangeProto = RangeCtor.prototype;
  const nativeCloneContents = rangeProto.cloneContents;
  const nativeRangeToString = rangeProto.toString;

  function findTexFromKatex(katexEl) {
    if (!katexEl || !(katexEl instanceof Element)) return null;
    try {
      const ann = katexEl.querySelector('annotation[encoding="application/x-tex"], annotation');
      if (!ann || !ann.textContent) return null;
      const raw = ann.textContent.trim();
      if (!raw) return null;
      const isDisplay = katexEl.classList.contains('katex-display');
      return isDisplay ? `$$${raw}$$` : `$${raw}$`;
    } catch (_) {
      return null;
    }
  }

  function transformFragment(frag) {
    if (!frag || !frag.querySelectorAll) {
      return { fragment: frag, changed: false };
    }

    const list = frag.querySelectorAll('.katex');
    if (!list.length) {
      return { fragment: frag, changed: false };
    }

    let changed = false;
    for (const el of Array.from(list)) {
      const tex = findTexFromKatex(el);
      if (!tex) continue;
      const textNode = frag.ownerDocument.createTextNode(tex);
      el.replaceWith(textNode);
      changed = true;
    }

    return { fragment: frag, changed };
  }

  rangeProto.cloneContents = function btq_cloneContents() {
    const frag = nativeCloneContents.call(this);
    try {
      return transformFragment(frag).fragment;
    } catch (e) {
      console.warn('[BetterTeXQuote] cloneContents transform error:', e);
      return frag;
    }
  };

  rangeProto.toString = function btq_rangeToString() {
    try {
      const frag = nativeCloneContents.call(this);
      const res = transformFragment(frag);
      if (res.changed) {
        return res.fragment.textContent || '';
      }
    } catch (e) {
      console.warn('[BetterTeXQuote] range.toString transform error:', e);
    }
    return nativeRangeToString.call(this);
  };

  rangeProto._btqPatched = true;

  const SelCtor = window.Selection;
  if (SelCtor && SelCtor.prototype && typeof SelCtor.prototype.toString === 'function') {
    const selProto = SelCtor.prototype;
    const nativeSelToString = selProto.toString;

    selProto.toString = function btq_selectionToString() {
      try {
        if (this.rangeCount > 0) {
          const range = this.getRangeAt(0);
          if (range && typeof range.toString === 'function') {
            return range.toString();
          }
        }
      } catch (e) {
        console.warn('[BetterTeXQuote] selection.toString error:', e);
      }
      return nativeSelToString.call(this);
    };
  }

  function btq_copyTexToClipboard(tex) {
    if (!tex) return;
    try {
      if (navigator && navigator.clipboard && typeof navigator.clipboard.writeText === 'function') {
        navigator.clipboard.writeText(tex).catch(function () {});
      } else if (document && document.body && document.createElement) {
        const ta = document.createElement('textarea');
        ta.value = tex;
        ta.setAttribute('readonly', 'readonly');
        ta.style.position = 'fixed';
        ta.style.top = '0';
        ta.style.left = '-9999px';
        document.body.appendChild(ta);
        ta.select();
        try {
          document.execCommand('copy');
        } catch (_) {
        }
        document.body.removeChild(ta);
      }
    } catch (_) {
    }
  }

  function btq_handleDblClickCopy(ev) {
    const target = ev && ev.target;
    if (!target || !(target instanceof Element)) return;
    const katexEl = target.closest('.katex');
    if (!katexEl) return;
    const tex = findTexFromKatex(katexEl);
    if (!tex) return;
    btq_copyTexToClipboard(tex);
  }

  document.addEventListener('dblclick', btq_handleDblClickCopy, false);
})();
