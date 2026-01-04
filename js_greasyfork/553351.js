// ==UserScript==
// @name         国家中小学智慧教育平台电子课本一键下载
// @namespace    https://basic.smartedu.cn/
// @version      1.0.1
// @description  在教材详情页点击“下载PDF”按钮下载当前课文
// @author       you
// @match        https://basic.smartedu.cn/tchMaterial/detail*
// @icon         https://is1-ssl.mzstatic.com/image/thumb/Purple211/v4/6b/45/93/6b45939d-23ba-6324-c089-50709553a28f/AppIcon-0-0-1x_U007epad-0-9-0-85-220.png/460x0w.webp
// @run-at       document-idle
// @grant        GM_xmlhttpRequest
// @grant        GM_download
// @connect      s-file-1.ykt.cbern.com.cn
// @connect      *.ykt.cbern.com.cn
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/553351/%E5%9B%BD%E5%AE%B6%E4%B8%AD%E5%B0%8F%E5%AD%A6%E6%99%BA%E6%85%A7%E6%95%99%E8%82%B2%E5%B9%B3%E5%8F%B0%E7%94%B5%E5%AD%90%E8%AF%BE%E6%9C%AC%E4%B8%80%E9%94%AE%E4%B8%8B%E8%BD%BD.user.js
// @updateURL https://update.greasyfork.org/scripts/553351/%E5%9B%BD%E5%AE%B6%E4%B8%AD%E5%B0%8F%E5%AD%A6%E6%99%BA%E6%85%A7%E6%95%99%E8%82%B2%E5%B9%B3%E5%8F%B0%E7%94%B5%E5%AD%90%E8%AF%BE%E6%9C%AC%E4%B8%80%E9%94%AE%E4%B8%8B%E8%BD%BD.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // 下载图标
    const DOWNLOAD_ICON_DATA_URL = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTUwIiBoZWlnaHQ9IjE1MCIgdmlld0JveD0iMCAwIDE1MCAxNTAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxwYXRoIGQ9Ik03NSAxMjEuODc1QzEwOS42NTYgMTIxLjg3NSAxMjcuMDA5IDEyMi4yNSAxMzQuMzk2IDEyMi40ODFDMTM3LjM2NCAxMjIuNTczIDE0MC4wOTUgMTI0LjAwMyAxNDAuNDY2IDEyNi45NDhDMTQwLjU2NCAxMjcuNzI4IDE0MC42MjUgMTI4LjYzNiAxNDAuNjI1IDEyOS42ODhDMTQwLjYyNSAxMzAuNzQgMTQwLjU2NCAxMzEuNjQ4IDE0MC40NjYgMTMyLjQyN0MxNDAuMDk1IDEzNS4zNzMgMTM3LjM2NCAxMzYuODAyIDEzNC4zOTYgMTM2Ljg5NUMxMjcuMDA5IDEzNy4xMjUgMTA5LjY1NiAxMzcuNSA3NSAxMzcuNUM0MC4zNDQ1IDEzNy41IDIyLjk5MDggMTM3LjEyNSAxNS42MDM1IDEzNi44OTVDMTIuNjM2IDEzNi44MDIgOS45MDUwMiAxMzUuMzczIDkuNTM0MTggMTMyLjQyN0M5LjQzNjEzIDEzMS42NDggOS4zNzUwMSAxMzAuNzQgOS4zNzUgMTI5LjY4OEM5LjM3NSAxMjguNjM2IDkuNDM2MTIgMTI3LjcyOCA5LjUzNDE4IDEyNi45NDhDOS45MDQ3NyAxMjQuMDAzIDEyLjYzNTggMTIyLjU3MyAxNS42MDM1IDEyMi40ODFDMjIuOTkwOCAxMjIuMjUgNDAuMzQ0NSAxMjEuODc1IDc1IDEyMS44NzVaTTc1LjA0ODggMTIuNTAwMkM3Ni42MzE4IDEyLjUwNDggNzcuOTc3MSAxMi41NjExIDc5LjExNTIgMTIuNjQ3N0M4Mi44Mzg3IDEyLjkzMTUgODUuMjYxNCAxNS44NTE0IDg1Ljc3NzMgMTkuNTcwNkM4Ni40MjE5IDI0LjIxNzIgODcuMjYwMiA1Mi4yMjAzIDg3Ljg0NjcgNjIuOTM2OEM5Ni43NDYyIDYzLjIzNjQgMTAzLjE5OCA2My44Mjg4IDEwNy42OTYgNjQuNDE4MkMxMTIuMTQ1IDY1LjAwMTIgMTEzLjk2NyA2OS43NTc0IDExMS4xNjQgNzMuMjgwNUMxMDIuNjA2IDg0LjAzODggOTAuOTY3NyA5NS4yNDg0IDgxLjUxNzYgMTAzLjcyOUM3Ny43NzA4IDEwNy4wOTEgNzIuMTM0MyAxMDcuMDkgNjguMzg3NyAxMDMuNzI4QzU4Ljk3NjUgOTUuMjgxOSA0Ny4zOTMzIDg0LjEyOTMgMzguODQ1NyA3My40MTE0QzM2LjAwODEgNjkuODUyNyAzNy44ODA1IDY1LjAxNyA0Mi4zNzk5IDY0LjQzNjhDNDYuODU1MyA2My44NTk2IDUzLjIwMDUgNjMuMjc1OSA2MS44MjYyIDYyLjk2NTFDNjIuNDAyNiA1Mi4xNzc5IDYzLjMxNTQgMjQuMTUxMSA2NC4wMjczIDE5LjUwOUM2NC41OTMgMTUuODIxNSA2Ny4wNTM1IDEyLjkzMzkgNzAuNzUyIDEyLjY0NThDNzEuOTQ3NSAxMi41NTI2IDczLjM2ODYgMTIuNDk0OSA3NS4wNDg4IDEyLjUwMDJaIiBmaWxsPSJ3aGl0ZSIvPgo8L3N2Zz4K';

    const PRIVATE_PDF_RE = /^https?:\/\/(?:.+)\.ykt\.cbern\.com\.cn\/(.+)\/([\da-f]{8}-[\da-f]{4}-[\da-f]{4}-[\da-f]{4}-[\da-f]{12})\.pkg\/(.+)\.pdf$/i;

    function parseSearch() {
      const u = new URL(location.href);
      return {
        contentId: u.searchParams.get('contentId'),
        contentType: u.searchParams.get('contentType') || 'assets_document',
      };
    }

    function requestJson(url) {
      return new Promise((resolve, reject) => {
        GM_xmlhttpRequest({
          method: 'GET',
          url,
          headers: { 'X-ND-AUTH': 'MAC id="0",nonce="0",mac="0"' },
          responseType: 'json',
          // 默认带 Cookie，匿名模式会禁用，这里不启用匿名
          onload: (res) => {
            if (res.status >= 200 && res.status < 300) resolve(res.response);
            else reject(new Error('HTTP ' + res.status));
          },
          onerror: (err) => reject(err instanceof Error ? err : new Error('Network error')),
        });
      });
    }

    // 轻量延时
    function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

    // 带重试与防缓存的 JSON 请求（应对页面初载时接口暂不可用或缓存未命中）
    async function requestJsonWithRetry(url, attempts = 4, interval = 500) {
      let err;
      for (let i = 0; i < attempts; i++) {
        try {
          const u = url + (url.includes('?') ? '&' : '?') + '_=' + Date.now();
          return await requestJson(u);
        } catch (e) {
          err = e;
          await sleep(interval * (i + 1));
        }
      }
      throw err || new Error('request failed');
    }

    // （已移除 toast 提示）

    // 等待页面内出现 PDF 直链（用于站点异步渲染阶段）
    function waitPdfFromPage(timeoutMs = 8000) {
      return new Promise((resolve) => {
        const now = extractPdfFromPage();
        if (now) return resolve(now);
        const mo = new MutationObserver(() => {
          const url = extractPdfFromPage();
          if (url) { mo.disconnect(); resolve(url); }
        });
        mo.observe(document.documentElement, { childList: true, subtree: true });
        setTimeout(() => { mo.disconnect(); resolve(null); }, timeoutMs);
      });
    }

    async function resolvePdfLink(pageUrl, contentId, contentType) {
      const isSyncClassroom = /\/syncClassroom\/basicWork\/detail/.test(pageUrl);
      const detailUrl = isSyncClassroom || contentType === 'thematic_course'
        ? `https://s-file-1.ykt.cbern.com.cn/zxx/ndrs/special_edu/resources/details/${contentId}.json`
        : `https://s-file-1.ykt.cbern.com.cn/zxx/ndrv2/resources/tch_material/details/${contentId}.json`;

      const data = await requestJsonWithRetry(detailUrl);
      let resourceUrl = null;
      if (Array.isArray(data?.ti_items)) {
        for (const item of data.ti_items) {
          if (item?.lc_ti_format === 'pdf' && item?.ti_storages?.[0]) {
            resourceUrl = item.ti_storages[0];
            break;
          }
        }
      }

      if (!resourceUrl && contentType === 'thematic_course') {
        const listUrl = `https://s-file-1.ykt.cbern.com.cn/zxx/ndrs/special_edu/thematic_course/${contentId}/resources/list.json`;
        const listData = await requestJsonWithRetry(listUrl);
        for (const res of listData || []) {
          if (res?.resource_type_code === 'assets_document' && Array.isArray(res?.ti_items)) {
            const pdfItem = res.ti_items.find(x => x?.lc_ti_format === 'pdf' && x?.ti_storages?.[0]);
            if (pdfItem) { resourceUrl = pdfItem.ti_storages[0]; break; }
          }
        }
      }

      if (!resourceUrl) return { url: null, title: null };
      const finalUrl = resourceUrl.replace(PRIVATE_PDF_RE, 'https://c1.ykt.cbern.com.cn/$1/$2.pkg/$3.pdf');
      return { url: finalUrl, title: data?.title || 'download' };
    }

    function toSafeFilename(title) {
      return `${(title || 'download').replace(/[\\/:*?"<>|]/g, '_')}.pdf`;
    }

    function extractPdfFromPage() {
      const a = document.querySelector('a[href$=".pdf"], a[href*=".pdf?"]');
      if (a?.href) return a.href;
      const iframe = document.querySelector('iframe, embed');
      if (iframe?.src && /\.pdf(\?|$)/i.test(iframe.src)) return iframe.src;
      const meta = document.querySelector('meta[property="og:pdf"], link[type="application/pdf"]');
      if (meta) return meta.getAttribute('content') || meta.getAttribute('href');
      return null;
    }

    // 更新按钮文本（优先改内部 span，避免破坏结构）
    function setBtnText(btn, text) {
      const label = btn && btn.querySelector('span');
      if (label) label.textContent = text; else if (btn) btn.textContent = text;
    }

    // 启动下载并返回 Promise，支持进度回调与完成后复位
    function startDownload(url, title, btn, saveAs = true) {
      const name = toSafeFilename(title);
      return new Promise((resolve, reject) => {
        GM_download({
          url,
          name,
          saveAs,
          onprogress: (e) => {
            try {
              const loaded = e?.done ?? e?.loaded ?? 0;
              const total = e?.total ?? 0;
              if (total > 0) {
                const pct = Math.min(99, Math.max(0, Math.floor((loaded / total) * 100)));
                setBtnText(btn, `下载中 ${pct}%`);
              } else {
                setBtnText(btn, '下载中...');
              }
            } catch {}
          },
          onload: () => {
            try { setBtnText(btn, '下载PDF'); } catch {}
            resolve(true);
          },
          onerror: (e) => {
            try { setBtnText(btn, '下载PDF'); } catch {}
            reject(e);
          }
        });
      });
    }

    function findFullscreenBlock() {
      const spanXpath = `//span[normalize-space(text())='全屏授课']`;
      const it = document.evaluate(spanXpath, document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
      if (it.snapshotLength > 0) {
        const span = it.snapshotItem(0);
        const wrapper = span && span.closest('[class*="play-warpper"], [class*="to-teach"], [class*="toTeach"]');
        if (wrapper) return wrapper;
        if (span && span.parentElement) return span.parentElement;
      }
      const any = document.evaluate(`//button[contains(., '全屏授课')] | //a[contains(., '全屏授课')] | //div[contains(., '全屏授课')]`, document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
      if (any.snapshotLength > 0) return any.snapshotItem(0);
      const candidates = Array.from(document.querySelectorAll('button, a, div, span')).filter(el => /全屏授课/.test((el.textContent || '').trim()));
      if (candidates[0]) return candidates[0].closest('button, a, [role="button"], div') || candidates[0].parentElement;
      return null;
    }

    function createDownloadButton(host) {
      const cloned = host.cloneNode(true);
      const iconImg = cloned.querySelector('img');
      if (iconImg) {
        iconImg.src = DOWNLOAD_ICON_DATA_URL;
        iconImg.alt = '下载';
        iconImg.style.width = '18px';
        iconImg.style.height = '18px';
        iconImg.style.objectFit = 'contain';
      }
      const labelSpan = cloned.querySelector('span');
      if (labelSpan) labelSpan.textContent = '下载PDF'; else cloned.textContent = '下载PDF';
      cloned.style.marginLeft = '16px';
      if (cloned.tagName.toLowerCase() === 'a') cloned.removeAttribute('href');
      const stopEarly = (e) => { e.preventDefault(); e.stopPropagation(); };
      ['mousedown','mouseup','pointerdown','pointerup','touchstart','touchend'].forEach(evt => cloned.addEventListener(evt, stopEarly, { capture: true }));
      cloned.setAttribute('role', 'button');
      cloned.setAttribute('tabindex', '0');
      cloned.addEventListener('keydown', (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); cloned.click(); } });
      return cloned;
    }

    function inject() {
      const host = findFullscreenBlock();
      if (!host) return false;
      if (host.parentElement && host.parentElement.querySelector('[data-tch-dl-btn]')) return true;
      const btn = createDownloadButton(host);
      btn.setAttribute('data-tch-dl-btn', '1');
      let busy = false;
      btn.addEventListener('click', async (ev) => {
        ev.preventDefault(); ev.stopPropagation();
        if (busy) return;
        busy = true;
        const originalHTML = btn.innerHTML;
        btn.style.pointerEvents = 'none';
        btn.style.opacity = '0.85';
        const label = btn.querySelector('span');
        if (label) label.textContent = '解析中...'; else btn.textContent = '解析中...';
        const { contentId, contentType } = parseSearch();
        if (!contentId) { alert('未找到 contentId，无法下载'); return; }
        const pageUrl = location.href;
        try {
          let { url, title } = await resolvePdfLink(pageUrl, contentId, contentType);
          if (!url) {
            const directWait = await waitPdfFromPage(8000);
            let direct = directWait || extractPdfFromPage();
            if (direct) {
              direct = direct.replace(PRIVATE_PDF_RE, 'https://c1.ykt.cbern.com.cn/$1/$2.pkg/$3.pdf');
              url = direct; title = 'download';
            }
          }
          if (!url) throw new Error('未解析到PDF链接');
          setBtnText(btn, '下载中...');
          await startDownload(url, title || 'download', btn, true);
        } catch (e) {
          alert('下载失败：' + e);
        }
        btn.style.pointerEvents = '';
        btn.style.opacity = '';
        btn.innerHTML = originalHTML;
        busy = false;
      });
      host.insertAdjacentElement('afterend', btn);
      return true;
    }

    if (!inject()) {
      const mo = new MutationObserver(() => { if (inject()) mo.disconnect(); });
      mo.observe(document.documentElement, { childList: true, subtree: true });
    }
  })();


