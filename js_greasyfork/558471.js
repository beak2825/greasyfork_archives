// ==UserScript==
// @name         ChatGPT TeX Copy & Quote 整合版
// @namespace    http://tampermonkey.net/
// @version      1.0.0
// @description  让 ChatGPT 的“Ask ChatGPT”引用和普通复制，对包含 KaTeX 的选区优先返回原始 LaTeX（$...$ / $$...$$），不改动 DOM，不叠加多余文本，跨行选区也保持稳定；整合了 TexCopyer 的双击复制功能。
// @author       schweigen
// @match        https://chatgpt.com/*
// @license      GPL-3.0-or-later
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/558471/ChatGPT%20TeX%20Copy%20%20Quote%20%E6%95%B4%E5%90%88%E7%89%88.user.js
// @updateURL https://update.greasyfork.org/scripts/558471/ChatGPT%20TeX%20Copy%20%20Quote%20%E6%95%B4%E5%90%88%E7%89%88.meta.js
// ==/UserScript==

(function () {
  'use strict';

  // 本脚本在原「ChatGPT TeX Copy & Quote 兼容版」基础上，
  // 仅整合了「TexCopyer」的双击复制交互（及相关提示样式），其余功能保持原样。
  // 组合来源：
  //   - ChatGPT Better TeX Quote, by schweigen（MIT License）
  //   - TexCopyer, by yjy | blime（GPLv3）, https://greasyfork.org/en/scripts/499346-texcopyer
  // 合并脚本整体以 GPLv3 或更高版本发布。
  //
  // This program is free software: you can redistribute it and/or modify
  // it under the terms of the GNU General Public License as published by
  // the Free Software Foundation, either version 3 of the License, or
  // (at your option) any later version.
  //
  // This program is distributed in the hope that it will be useful,
  // but WITHOUT ANY WARRANTY; without even the implied warranty of
  // MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
  // GNU General Public License for more details.
  //
  // You should have received a copy of the GNU General Public License
  // along with this program.  If not, see <https://www.gnu.org/licenses/>.

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
  function btq_setupDblClickCopy() {
    if (!document || !document.body) return;

    try {
      const css =
        '.btq-latex-tooltip{position:fixed;background-color:rgba(0,0,0,0.7);color:#fff;padding:4px 8px;border-radius:4px;font-size:11px;z-index:1000;opacity:0;transition:opacity 0.15s;pointer-events:none;}' +
        '.btq-latex-copy-success{position:fixed;bottom:10%;left:50%;transform:translateX(-50%);background-color:rgba(0,0,0,0.7);color:#fff;padding:8px 16px;border-radius:4px;font-size:12px;z-index:1000;opacity:1;transition:opacity 0.2s;pointer-events:none;}';

      if (document.head) {
        const styleEl = document.createElement('style');
        styleEl.type = 'text/css';
        styleEl.textContent = css;
        document.head.appendChild(styleEl);
      }

      const tooltip = document.createElement('div');
      tooltip.className = 'btq-latex-tooltip';
      tooltip.style.display = 'none';
      document.body.appendChild(tooltip);

      let tooltipTimer = null;
      let lastKatex = null;

      function btq_copyTexToClipboard(tex, onDone) {
        if (!tex) return;
        const done = typeof onDone === 'function' ? onDone : function () {};
        try {
          if (navigator && navigator.clipboard && typeof navigator.clipboard.writeText === 'function') {
            navigator.clipboard.writeText(tex).then(done).catch(function () {
              btq_fallbackCopy(tex);
              done();
            });
          } else {
            btq_fallbackCopy(tex);
            done();
          }
        } catch (_) {
          btq_fallbackCopy(tex);
          done();
        }
      }

      function btq_fallbackCopy(tex) {
        try {
          if (!document || !document.body || !document.createElement) return;
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
        } catch (_) {
        }
      }

      function btq_showCopySuccess() {
        if (!document || !document.body) return;
        const el = document.createElement('div');
        el.className = 'btq-latex-copy-success';
        el.textContent = '已复制 LaTeX 公式';
        document.body.appendChild(el);
        setTimeout(function () {
          el.style.opacity = '0';
          setTimeout(function () {
            if (el.parentNode) {
              el.parentNode.removeChild(el);
            }
          }, 200);
        }, 1000);
      }

      function btq_showTooltip(katexEl, tex) {
        if (!katexEl || !tex) return;
        try {
          const rect = katexEl.getBoundingClientRect();
          tooltip.textContent = tex;
          tooltip.style.left = rect.left + 'px';
          const top = rect.top - 24;
          tooltip.style.top = (top < 0 ? 0 : top) + 'px';
          tooltip.style.display = 'block';
          tooltip.style.opacity = '0.8';
        } catch (_) {
        }
      }

      function btq_hideTooltip() {
        tooltip.style.display = 'none';
        tooltip.style.opacity = '0';
      }

      document.addEventListener(
        'mouseover',
        function (ev) {
          const target = ev && ev.target;
          if (!target || !(target instanceof Element)) return;
          const katexEl = target.closest('.katex');
          if (!katexEl) return;
          katexEl.style.cursor = 'pointer';
          lastKatex = katexEl;
          if (tooltipTimer) {
            clearTimeout(tooltipTimer);
          }
          tooltipTimer = setTimeout(function () {
            const tex = findTexFromKatex(katexEl);
            if (!tex) return;
            btq_showTooltip(katexEl, tex);
          }, 800);
        },
        true
      );

      document.addEventListener(
        'mouseout',
        function (ev) {
          const from = ev && ev.target;
          if (!from || !(from instanceof Element)) return;
          const fromKatex = from.closest('.katex');
          if (!fromKatex) return;
          const to = ev.relatedTarget;
          if (to && to instanceof Element) {
            const toKatex = to.closest('.katex');
            if (toKatex === fromKatex) {
              return;
            }
          }
          if (tooltipTimer) {
            clearTimeout(tooltipTimer);
            tooltipTimer = null;
          }
          btq_hideTooltip();
        },
        true
      );

      document.addEventListener(
        'dblclick',
        function (ev) {
          const target = ev && ev.target;
          if (!target || !(target instanceof Element)) return;
          const katexEl = target.closest('.katex');
          if (!katexEl) return;
          const tex = findTexFromKatex(katexEl);
          if (!tex) return;
          btq_copyTexToClipboard(tex, btq_showCopySuccess);
        },
        false
      );
    } catch (e) {
      console.warn('[BetterTeXQuote] dblclick copy setup error:', e);
    }
  }

  if (typeof document !== 'undefined') {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', btq_setupDblClickCopy);
    } else {
      btq_setupDblClickCopy();
    }
  }
})();
