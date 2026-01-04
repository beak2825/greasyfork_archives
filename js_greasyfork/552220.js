// ==UserScript==
// @name         通用整页高清截图（增强版 - 修复 oklch）
// @namespace    http://tampermonkey.net/
// @version      2.2.0
// @description  为任意网页生成"整页截图"按钮；自动识别主滚动容器并滚动触发懒加载，高清渲染导出 PNG；支持跨域图片与本地 file:// 截图；兼容 SPA 路由变更；修复 oklch/oklab 等现代颜色问题。
// @author       dami
// @match        https://x.com/*
// @match        file:///*
// @license      MIT
// @grant        GM_download
// @grant        GM_addStyle
// @grant        GM_xmlhttpRequest
// @connect      *
// @require      https://cdn.jsdelivr.net/npm/html2canvas@1.4.1/dist/html2canvas.min.js
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/552220/%E9%80%9A%E7%94%A8%E6%95%B4%E9%A1%B5%E9%AB%98%E6%B8%85%E6%88%AA%E5%9B%BE%EF%BC%88%E5%A2%9E%E5%BC%BA%E7%89%88%20-%20%E4%BF%AE%E5%A4%8D%20oklch%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/552220/%E9%80%9A%E7%94%A8%E6%95%B4%E9%A1%B5%E9%AB%98%E6%B8%85%E6%88%AA%E5%9B%BE%EF%BC%88%E5%A2%9E%E5%BC%BA%E7%89%88%20-%20%E4%BF%AE%E5%A4%8D%20oklch%EF%BC%89.meta.js
// ==/UserScript==

(function () {
  'use strict';

  let installed = false;

  GM_addStyle(`
    .universal-capture-btn {
      position: fixed;
      right: 16px;
      bottom: 16px;
      z-index: 2147483647;
      background: #1677ff;
      color: #fff;
      font-weight: 600;
      border: 0;
      border-radius: 8px;
      padding: 12px 16px;
      cursor: pointer;
      box-shadow: 0 4px 12px rgba(22, 119, 255, 0.4);
      font-size: 14px;
      transition: all 0.3s ease;
    }
    .universal-capture-btn:hover {
      background: #0958d9;
      box-shadow: 0 6px 16px rgba(22, 119, 255, 0.5);
      transform: translateY(-2px);
    }
    .universal-capture-btn[disabled] { 
      opacity: 0.6; 
      cursor: not-allowed;
      transform: none;
    }
    .universal-capture-progress {
      position: fixed;
      right: 16px;
      bottom: 70px;
      z-index: 2147483647;
      background: rgba(0,0,0,0.85);
      color: #fff;
      padding: 10px 14px;
      border-radius: 8px;
      font-size: 13px;
      max-width: min(60vw, 520px);
      white-space: pre-wrap;
      line-height: 1.5;
      box-shadow: 0 4px 12px rgba(0,0,0,0.3);
    }
  `);

  const sleep = (ms) => new Promise(r => setTimeout(r, ms));
  const ts = () => {
    const p2 = n => String(n).padStart(2,'0');
    const d = new Date();
    return `${d.getFullYear()}${p2(d.getMonth()+1)}${p2(d.getDate())}_${p2(d.getHours())}${p2(d.getMinutes())}${p2(d.getSeconds())}`;
  };

  function log(...args) { console.log('[Universal Screenshot]', ...args); }
  
  // 将 oklch/oklab/lch/lab 等现代颜色转换为 rgb
  function convertModernColorToRGB(colorStr) {
    if (!colorStr || typeof colorStr !== 'string') return colorStr;
    
    // 匹配 oklch/oklab/lch/lab 函数
    const modernColorRegex = /(oklch|oklab|lch|lab)\([^)]+\)/gi;
    
    if (!modernColorRegex.test(colorStr)) return colorStr;
    
    try {
      // 创建临时元素测试颜色
      const temp = document.createElement('div');
      temp.style.color = colorStr;
      document.body.appendChild(temp);
      const computed = getComputedStyle(temp).color;
      document.body.removeChild(temp);
      return computed || colorStr;
    } catch {
      return colorStr;
    }
  }
  
  // 清理元素样式中的现代颜色
  function sanitizeElementColors(element) {
    try {
      const computed = getComputedStyle(element);
      const modernColorProps = [
        'color', 'backgroundColor', 'borderColor', 
        'borderTopColor', 'borderRightColor', 'borderBottomColor', 'borderLeftColor',
        'outlineColor', 'textDecorationColor', 'caretColor'
      ];
      
      modernColorProps.forEach(prop => {
        const value = computed[prop];
        if (value && /(oklch|oklab|lch|lab)\(/i.test(value)) {
          const converted = convertModernColorToRGB(value);
          if (converted !== value) {
            element.style[prop] = converted;
          }
        }
      });
    } catch {}
  }
  
  function ensureUI() {
    if (installed) return;
    const body = document.body || document.documentElement;
    if (!body) return;

    const btn = document.createElement('button');
    btn.className = 'universal-capture-btn';
    btn.textContent = '📸 整页截图';
    btn.title = '快捷键：按 S 键快速截图';

    const progress = document.createElement('div');
    progress.className = 'universal-capture-progress';
    progress.style.display = 'none';

    const logProgress = (msg) => { 
      progress.style.display = 'block'; 
      progress.textContent = `📸 ${msg}`; 
    };
    const clearProgress = () => { 
      progress.style.display = 'none'; 
      progress.textContent = ''; 
    };

    body.appendChild(btn);
    body.appendChild(progress);
    installed = true;
    log('截图按钮已注入');

    // ---------- 工具函数 ----------
    const toAbs = (u) => { 
      try { return new URL(u, location.href).toString(); } 
      catch { return u; } 
    };
    
    const getSize = (el) => {
      if (!el || el === document.documentElement || el === document.body) {
        const doc = document.documentElement;
        const body = document.body || document.createElement('body');
        return {
          width: Math.max(doc.scrollWidth, body.scrollWidth, doc.clientWidth),
          height: Math.max(doc.scrollHeight, body.scrollHeight, doc.clientHeight),
        };
      }
      return { width: el.scrollWidth, height: el.scrollHeight };
    };
    
    const computeSafeScale = (el, desired) => {
      const { width, height } = getSize(el);
      const maxPixels = 260e6;
      const need = width * height * desired * desired;
      if (need <= maxPixels) return desired;
      const safe = Math.sqrt(maxPixels / (width * height));
      return Math.max(1, Math.floor(safe * 100) / 100);
    };
    
    const findMainScrollContainer = () => {
      let best = null;
      let bestScore = 0;

      const candidates = [
        'main', '[role="main"]', '#main', '.main',
        'article', '[role="article"]',
        '#content', '.content', '.container',
        '#app', '.app'
      ];

      for (const sel of candidates) {
        const el = document.querySelector(sel);
        if (!el) continue;
        const cs = getComputedStyle(el);
        if (/(auto|scroll)/.test(cs.overflowY)) {
          const scrollable = el.scrollHeight - el.clientHeight;
          if (scrollable > 100) {
            const score = scrollable * (el.clientHeight / window.innerHeight);
            if (score > bestScore) {
              best = el;
              bestScore = score;
            }
          }
        }
      }

      if (best) {
        log('找到主容器（候选）:', best);
        return { el: best, reason: `候选容器: ${best.tagName}${best.id ? '#'+best.id : ''}` };
      }

      document.querySelectorAll('*').forEach((el) => {
        if (!(el instanceof HTMLElement)) return;
        if (el === document.body || el === document.documentElement) return;
        
        const cs = getComputedStyle(el);
        if (/(auto|scroll)/.test(cs.overflowY)) {
          const scrollable = el.scrollHeight - el.clientHeight;
          if (scrollable > 100) {
            const score = scrollable * (el.clientHeight / window.innerHeight);
            if (score > bestScore) {
              best = el;
              bestScore = score;
            }
          }
        }
      });

      if (best) {
        log('找到滚动容器（遍历）:', best);
        return { el: best, reason: `最佳滚动容器: ${best.tagName}` };
      }

      log('使用默认容器: documentElement');
      return { el: document.documentElement, reason: '默认：整个文档' };
    };

    async function tryAutoExpand() {
      const expandTexts = [
        '展开', '展开全部', '展开更多', '显示全部', '显示更多',
        '查看更多', '查看全部', '加载更多', '更多',
        'Show more', 'Load more', 'Expand', 'See more'
      ];
      const regex = new RegExp(expandTexts.join('|'), 'i');
      let cnt = 0;
      
      document.querySelectorAll('button,a,span,[role="button"]').forEach((el) => {
        const t = (el.textContent || '').trim();
        if (regex.test(t)) { 
          try { 
            el.click(); 
            cnt++; 
          } catch {} 
        }
      });
      
      if (cnt) { 
        log('尝试点击展开按钮:', cnt); 
        await sleep(800); 
      }
    }

    function resolveImgUrlFromAttrs(img) {
      const attrs = [
        'src', 'data-src', 'data-original', 'data-lazy', 
        'data-url', 'data-actualsrc', 'data-lazy-src'
      ];
      for (const k of attrs) {
        const v = img.getAttribute(k);
        if (v && !v.startsWith('data:')) return v;
      }
      return img.src || null;
    }
    
    function fetchAsBlob(url) {
      return new Promise((resolve, reject) => {
        GM_xmlhttpRequest({
          method: 'GET', 
          url, 
          responseType: 'blob', 
          timeout: 30000,
          onload: (res) => {
            if (res.status >= 200 && res.status < 400 && res.response) {
              resolve(res.response);
            } else {
              reject(new Error(`HTTP ${res.status}`));
            }
          },
          onerror: () => reject(new Error('Network error')),
          ontimeout: () => reject(new Error('Timeout')),
        });
      });
    }
    
    async function inlineAllImages() {
      const imgs = Array.from(document.images || []);
      imgs.forEach(img => { 
        try { 
          img.loading = 'eager'; 
          img.decoding = 'sync'; 
        } catch {} 
      });
      
      const replaced = [];
      let done = 0;
      let failed = 0;
      
      for (const img of imgs) {
        const u0 = resolveImgUrlFromAttrs(img);
        if (!u0) continue;
        
        try {
          const blob = await fetchAsBlob(toAbs(u0));
          const blobUrl = URL.createObjectURL(blob);
          replaced.push({ 
            img, 
            orig: { src: img.src, crossOrigin: img.crossOrigin }, 
            blobUrl 
          });
          img.crossOrigin = 'anonymous';
          img.src = blobUrl;
          done++;
          
          if (done % 5 === 0) {
            logProgress(`图片预加载中... (${done}/${imgs.length})`);
          }
        } catch {
          failed++;
        }
      }
      
      if (failed > 0) {
        log(`图片加载失败: ${failed}/${imgs.length}`);
      }
      
      try { 
        if (document?.fonts?.ready) {
          await Promise.race([document.fonts.ready, sleep(3000)]); 
        }
      } catch {}
      await sleep(300);
      
      return {
        restore: () => {
          for (const r of replaced) {
            try {
              if (r.orig.crossOrigin != null) {
                r.img.crossOrigin = r.orig.crossOrigin;
              }
              if (r.orig.src) r.img.src = r.orig.src;
              URL.revokeObjectURL(r.blobUrl);
            } catch {}
          }
        }, 
        count: done, 
        total: imgs.length,
        failed
      };
    }

    async function autoScrollLoad(targetEl, maxDurationMs = 30000) {
      const start = Date.now();
      const isWin = !targetEl || targetEl === document.documentElement;
      const viewH = () => isWin ? window.innerHeight : targetEl.clientHeight;
      const stepBase = Math.max(300, Math.floor(viewH() * 0.85));

      const orig = document.documentElement.style.scrollBehavior;
      if (isWin) document.documentElement.style.scrollBehavior = 'auto';
      
      try {
        let last = -1;
        while (Date.now() - start < maxDurationMs) {
          const size = getSize(targetEl);
          const step = Math.min(stepBase, viewH());
          const cur = isWin ? window.scrollY : targetEl.scrollTop;
          const y = Math.min(size.height - viewH(), cur + step);
          
          if (isWin) window.scrollTo(0, y);
          else targetEl.scrollTop = y;
          
          await sleep(150);
          
          if (y >= size.height - viewH() - 2 || y === last) break;
          last = y;
          
          if ((Date.now() - start) % 1000 < 160) {
            logProgress(`滚动加载中... ${Math.round(y)}/${size.height}px`);
          }
        }
        
        if (isWin) window.scrollTo(0, 0);
        else targetEl.scrollTop = 0;
        await sleep(300);
      } finally {
        if (isWin) {
          document.documentElement.style.scrollBehavior = orig || '';
        }
      }
    }

    async function captureFullPage() {
      btn.disabled = true;
      const prev = btn.textContent;
      btn.textContent = '⏳ 准备中...';

      btn.style.display = 'none';
      progress.style.display = 'block';
      logProgress('开始准备整页截图...');

      try {
        await tryAutoExpand();

        const { el: mainContainer, reason } = findMainScrollContainer();
        log('检测滚动容器：', reason, mainContainer);
        logProgress(`检测容器：${reason}`);
        await autoScrollLoad(mainContainer, 30000);

        logProgress('预加载图片资源...');
        let restore = { restore: () => {}, count: 0, total: 0, failed: 0 };
        try {
          restore = await inlineAllImages();
          if (restore.failed > 0) {
            logProgress(`图片加载完成：${restore.count}/${restore.total}（${restore.failed} 个失败）`);
          } else {
            logProgress(`图片加载完成：${restore.count}/${restore.total}`);
          }
        } catch {
          logProgress('部分图片加载失败，继续截图...');
        }

        // 清理现代颜色
        logProgress('优化页面样式...');
        const allElements = mainContainer.querySelectorAll('*');
        let colorFixed = 0;
        allElements.forEach(el => {
          try {
            const before = el.style.color;
            sanitizeElementColors(el);
            if (before !== el.style.color) colorFixed++;
          } catch {}
        });
        if (colorFixed > 0) {
          log(`已转换 ${colorFixed} 个现代颜色格式`);
        }

        const desiredScale = Math.max(2, Math.round(window.devicePixelRatio * 2));
        const scale = computeSafeScale(mainContainer, desiredScale);
        const { width: W, height: H } = getSize(mainContainer);
        logProgress(`目标尺寸: ${W}×${H}px，缩放: ${scale}×`);
        
        try { 
          await (document?.fonts?.ready ?? Promise.resolve()); 
        } catch {}
        await sleep(200);

        btn.textContent = '⏳ 渲染中...';
        logProgress('高分辨率渲染中，请稍候...');
        let canvas;
        
        try {
          const ignoreSet = new WeakSet([btn, progress]);
          
          canvas = await html2canvas(mainContainer, {
            useCORS: false, // 关键：禁用 CORS 避免跨域问题
            allowTaint: true, // 允许污染
            backgroundColor: '#ffffff',
            scale,
            width: W,
            height: H,
            windowWidth: W,
            windowHeight: H,
            scrollX: 0,
            scrollY: 0,
            logging: false,
            onclone: (clonedDoc) => {
              // 在克隆文档中添加样式重置
              try {
                const style = clonedDoc.createElement('style');
                style.textContent = `
                  * {
                    scrollbar-color: #b9cad3 #f7f9f9 !important;
                  }
                `;
                clonedDoc.head.appendChild(style);
              } catch {}
            },
            ignoreElements: (el) => {
              if (ignoreSet.has(el)) return true;
              try {
                const st = getComputedStyle(el);
                if (st && st.position === 'fixed' && el.clientHeight < 100) {
                  return true;
                }
              } catch {}
              return false;
            },
          });
        } catch (e) {
          console.error('html2canvas error:', e);
          logProgress('❌ 渲染失败：' + (e.message || '未知错误'));
          throw e;
        } finally {
          try { restore.restore(); } catch {}
        }

        btn.textContent = '⏳ 导出中...';
        logProgress('生成 PNG 文件...');
        
        const hostname = location.hostname.replace(/^www\./, '');
        const title = (document.title || hostname || 'page')
          .replace(/[\\/:*?"<>|]+/g, '_')
          .slice(0, 50);
        const name = `screenshot_${hostname}_${ts()}.png`;

        const saveByBlob = () => new Promise((resolve, reject) => {
          try {
            canvas.toBlob((blob) => {
              if (!blob) return reject(new Error('toBlob failed'));
              const url = URL.createObjectURL(blob);
              GM_download({
                url, 
                name, 
                saveAs: true,
                onload: () => { 
                  URL.revokeObjectURL(url); 
                  resolve(null); 
                },
                onerror: (e) => { 
                  URL.revokeObjectURL(url); 
                  reject(e); 
                },
              });
            }, 'image/png');
          } catch (e) { 
            reject(e); 
          }
        });

        try {
          await saveByBlob();
          logProgress(`✅ 已保存：${name}`);
        } catch {
          try {
            const dataUrl = canvas.toDataURL('image/png');
            GM_download({
              url: dataUrl, 
              name, 
              saveAs: true,
              onload: () => logProgress(`✅ 已保存：${name}`),
              onerror: () => logProgress('❌ 导出失败'),
            });
          } catch {
            logProgress('❌ 导出失败：图片过大或跨域问题');
          }
        }
      } catch (e) {
        console.error(e);
        logProgress('❌ 截图失败，详情见控制台');
        throw e;
      } finally {
        await sleep(2000);
        clearProgress();
        btn.textContent = prev;
        btn.style.display = 'block';
        btn.disabled = false;
      }
    }

    btn.addEventListener('click', () => {
      captureFullPage().catch((e) => {
        console.error(e);
        btn.disabled = false;
        btn.style.display = 'block';
        btn.textContent = '📸 整页截图';
        progress.style.display = 'block';
        progress.textContent = '❌ 发生错误，已在控制台输出详情';
        setTimeout(() => { progress.style.display = 'none'; }, 5000);
      });
    });

    window.addEventListener('keydown', (e) => {
      if (e.key.toLowerCase() === 's' && !e.ctrlKey && !e.metaKey && !e.altKey) {
        const target = e.target;
        if (target && (
          target.tagName === 'INPUT' || 
          target.tagName === 'TEXTAREA' || 
          target.isContentEditable
        )) {
          return;
        }
        e.preventDefault();
        if (!btn.disabled) btn.click();
      }
    });
  }

  const uiTimer = setInterval(() => {
    if (!installed) ensureUI();
    else clearInterval(uiTimer);
  }, 500);
  ensureUI();

  const mo = new MutationObserver(() => {
    const exists = document.querySelector('.universal-capture-btn');
    if (!exists) {
      installed = false;
      ensureUI();
    }
  });
  mo.observe(document.documentElement, { childList: true, subtree: true });
})();