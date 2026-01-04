// ==UserScript==
// @name         CMS资源站播放助手（纯净版）
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  为多个影视CMS站点自动添加M3U8加速播放按钮、去除广告、优化UI
// @author       You
// @match        *://*/*
// @grant        GM_addStyle
// @run-at       document-end
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/558272/CMS%E8%B5%84%E6%BA%90%E7%AB%99%E6%92%AD%E6%94%BE%E5%8A%A9%E6%89%8B%EF%BC%88%E7%BA%AF%E5%87%80%E7%89%88%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/558272/CMS%E8%B5%84%E6%BA%90%E7%AB%99%E6%92%AD%E6%94%BE%E5%8A%A9%E6%89%8B%EF%BC%88%E7%BA%AF%E5%87%80%E7%89%88%EF%BC%89.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // 直接注入CSS
    GM_addStyle(`
.d-i-b {
  display: inline-block !important;
}
 .kk-btn {
  display: flex;
  flex: none;
  align-items: center;
  box-sizing: border-box;
  border: 1px solid #1890ff;
  width: -moz-fit-content;
  width: fit-content;
  max-height: 30px;
  line-height: 30px;
  color: #1890ff !important;
  background-color: #fff;
  text-decoration: none;
  margin: 5px 10px;
  border-radius: 4px;
  padding: 0 4px;
  font-size: 16px;
  letter-spacing: 2px;
  font-weight: bold;
  box-shadow: 0 0 20px 2px #00000099;
}

.kk-btn-jump {
  font-size: 30px;
  max-height: 60px;
  line-height: 50px;
}

.kk-btn-sure {
  float: none !important;
  display: flex !important;
  flex: none !important;
  align-items: center !important;
  box-sizing: border-box !important;
  border: 1px solid #1890ff !important;
  width: -moz-fit-content !important;
  width: fit-content !important;
  height: 30px !important;
  min-height: 30px !important;
  max-height: 30px !important;
  line-height: 30px !important;
  color: #1890ff !important;
  background-color: #fff !important;
  text-decoration: none !important;
  margin-left: 5px !important;
  border-radius: 4px !important;
  padding: 0 4px !important;
  font-size: 16px !important;
  letter-spacing: 2px !important;
  font-weight: bold !important;
  text-decoration: none !important;
}

.kk-btn:hover {
  cursor: pointer;
  color: #5468ff !important;
  outline: 2px solid #1890ff !important;
}

.kk-btn:visited {
  cursor: pointer;
  color: #999 !important;
  border-color: #5468ff;
}
    `);

    const loc_href = window.location.href;
    const loc_hash = window.location.hash;
    const loc_origin = window.location.origin;

    // M3U8 解析加速接口（公开可用）
    const api_endpoint = 'https://m3u8.xuehuayu.cn?url=';

    // 简化选择器
    const qS = (sel, ctx = document) => ctx.querySelector(sel);
    const qSA = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];

    // 工具函数：创建播放按钮
    function createPlaybackLink(targetHref, displayText) {
        const newAnchor = document.createElement('a');
        newAnchor.href = targetHref;
        newAnchor.target = '_blank';
        newAnchor.className = 'kk-btn kk-btn-sure';
        newAnchor.innerText = displayText;
        newAnchor.style.cssText = `
            margin-left: 8px;
            padding: 2px 6px;
            background: #4CAF50;
            color: white;
            text-decoration: none;
            border-radius: 4px;
            font-size: 12px;
        `;
        return newAnchor;
    }

    // 移除高 z-index 广告遮罩
    function removeOverlays() {
        const allDivs = qSA('body>div, body div>div');
        allDivs.forEach(el => {
            const zIndex = parseInt(window.getComputedStyle(el).zIndex, 10);
            if (zIndex > 9999) el.remove();
        });
    }

    // 批量移除元素
    function removeElements(selectorsOrSelector) {
        const selectors = Array.isArray(selectorsOrSelector) ? selectorsOrSelector : [selectorsOrSelector];
        selectors.forEach(sel => {
            qSA(sel).forEach(el => el.remove());
        });
    }

    // 添加 CSS 类
    function addClassToElement(selector, className) {
        const el = qS(selector);
        if (el) el.classList.add(className);
    }

    // 添加 sticky 类
    function addStickyClass(selector, stickyClassName) {
        addClassToElement(selector, stickyClassName);
    }

    // 插入“跳转到播放源”快捷按钮
    function insertPlaybackTypeJumper(wrapperSelector, targetSelector) {
        const wrappers = qSA(wrapperSelector);
        let indexYun = null, indexM3u8 = null;

        wrappers.forEach((el, idx) => {
            const txt = el.innerText;
            if (txt.includes('yun') || txt.includes('云')) {
                indexYun = idx;
                indexM3u8 = wrappers.length - idx - 1;
            } else if (txt.includes('m3u8')) {
                indexM3u8 = idx;
                indexYun = wrappers.length - idx - 1;
            }
        });

        if (wrappers[indexYun]) wrappers[indexYun].id = 'kk-play-yun';
        if (wrappers[indexM3u8]) wrappers[indexM3u8].id = 'kk-play-m3u8';

        const target = qS(targetSelector);
        if (!target) return;

        const container = document.createElement('div');
        const inner = document.createElement('div');
        inner.style.textAlign = "center";
        inner.style.margin = "10px 0";

        const btnYun = document.createElement('a');
        btnYun.className = "kk-btn kk-btn-jump d-i-b";
        btnYun.href = "#kk-play-yun";
        btnYun.textContent = "跳到云播";
        btnYun.style.cssText = "margin: 0 8px; color: #1E88E5; text-decoration: underline; cursor: pointer;";

        const btnM3U8 = document.createElement('a');
        btnM3U8.className = "kk-btn kk-btn-jump d-i-b";
        btnM3U8.href = "#kk-play-m3u8";
        btnM3U8.textContent = "跳到M3U8";
        btnM3U8.style.cssText = "margin: 0 8px; color: #E53935; text-decoration: underline; cursor: pointer;";

        inner.appendChild(btnYun);
        inner.appendChild(btnM3U8);
        container.appendChild(inner);
        target.after(container);
    }

    // 插入收藏按钮（仅 UI，无实际存储）
    function insertFavoriteButton(imageSrc = '') {
        const favContainer = document.createElement('div');
        favContainer.className = 'kk-like-wrap';
        favContainer.style.cssText = `
            position: fixed;
            bottom: 20px;
            right: 20px;
            z-index: 9999;
        `;

        const favButton = document.createElement('button');
        favButton.className = 'kk-like-btn';
        favButton.innerText = "★ 收藏";
        favButton.title = "点击收藏（仅提示）";
        favButton.style.cssText = `
            padding: 8px 12px;
            background: #ff9800;
            color: white;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            font-size: 14px;
        `;

        favButton.onclick = function () {
            alert("【提示】此为演示版，收藏功能需配合扩展使用。\n当前为纯油猴脚本，无法保存。");
            favButton.innerText = "👌 已点击";
        };

        favContainer.appendChild(favButton);
        document.body.appendChild(favContainer);
    }

    // 开始执行主逻辑
    removeOverlays();

    if (loc_href.includes('ryzyw')) {
        insertPlaybackTypeJumper('h4>div', '.people');
        qSA('.playlist li').forEach(li => {
            const a = qS('a', li);
            if (!a || li.innerText.includes('全选')) return;
            let href = a.href;
            if (href.includes('.m3u8')) {
                href = api_endpoint + encodeURIComponent(href);
            } else {
                href = api_endpoint + encodeURIComponent(href) + '&iframe=true';
            }
            a.after(createPlaybackLink(href, '播放:' + a.title));
        });
        insertFavoriteButton(qS('.people .left img')?.src);

    } else if (loc_href.includes('dyttzy') && loc_href.includes('vod/detail/id')) {
        qSA('.playlist li').forEach(li => {
            const a = qS('a', li);
            if (!a || li.innerText.includes('全选')) return;
            let href = a.href;
            if (href.includes('.m3u8')) {
                href = api_endpoint + encodeURIComponent(href);
            }
            a.after(createPlaybackLink(href, '播放:' + a.title));
        });
        insertFavoriteButton(qS('.bg-extra-sage img.w-full.h-full.rounded-lg.shadow-md')?.src);

    } else if (loc_href.includes('dbzy') || loc_href.includes('doubanz')) {
        if (loc_href.includes('/voddetail/')) {
            qSA('.vodplayinfo li').forEach(li => {
                const a = qS('a', li);
                if (!a || li.innerText.includes('全选')) return;
                let raw = a.href;
                if (!raw.startsWith('http')) raw = loc_origin + '/' + raw;
                const num = a.innerText.split('$')[0] || '';
                let final = raw.includes('.m3u8')
                    ? api_endpoint + encodeURIComponent(raw)
                    : api_endpoint + encodeURIComponent(raw) + '&iframe=true';
                a.after(createPlaybackLink(final, `播放:${num}`));
            });
            insertPlaybackTypeJumper('.vodplayinfo h3', '.ibox');
            insertFavoriteButton(qS('.vodImg img')?.src);
            removeElements('header');
        }
        addStickyClass('.xing_top', 'kk-sticky');
        addClassToElement('.search-text', 'kk-search-ipt');
        addClassToElement('.search-btn', 'kk-search-btn');
        removeElements('.gg_top');

    } else if (loc_href.includes('mozhua') && loc_href.includes('/vod/detail/')) {
        qSA('.listitems').forEach(li => {
            const btn = qS('.btn a', li);
            if (!btn) return;
            const text = li.innerText.split('$')[0] || '';
            const match = btn.href.match(/=(https?:\/\/[^&]+?\.m3u8)/);
            if (match) {
                btn.href = api_endpoint + encodeURIComponent(match[1]);
            }
            btn.innerText += ':' + text;
            btn.classList.add('kk-btn');
        });
        insertFavoriteButton(qS('article img')?.src);

    } else if (loc_href.includes('jisuz') && loc_href.includes('/vod/detail/')) {
        qSA('.vod-list .list-item').forEach(li => {
            const a = qS('a', li);
            if (!a || li.innerText.includes('全选')) return;
            let raw = a.href;
            if (!raw.startsWith('http')) raw = loc_origin + '/' + raw;
            const num = a.innerText.split('$')[0] || '';
            let final = raw.includes('.m3u8')
                ? api_endpoint + encodeURIComponent(raw)
                : api_endpoint + encodeURIComponent(raw) + '&iframe=true';
            a.after(createPlaybackLink(final, `播放:${num}`));
        });
        insertFavoriteButton(qS('.vod-img img')?.src);
        insertPlaybackTypeJumper('.vod-list h3', '.vod-introduce');
        removeElements('.topbg');

    } else if (loc_href.includes('moduzy') && loc_href.includes('/vod/')) {
        qSA('.content__playlist li').forEach(li => {
            const a = qS('a', li);
            if (!a || li.innerText.includes('全选')) return;
            let raw = a.href;
            if (!raw.startsWith('http')) raw = loc_origin + '/' + raw;
            const num = a.innerText.split('$')[0] || '';
            let final = raw;
            const m3u8Match = raw.match(/=(https?:\/\/[^&]+?\.m3u8)/);
            if (m3u8Match) {
                final = api_endpoint + encodeURIComponent(m3u8Match[1]);
            }
            li.append(createPlaybackLink(final, `播放:${num}`));
        });
        insertFavoriteButton(qS('.content__thumb thumb img')?.src);
        removeElements('.index-header');

    } else if (loc_href.includes('haohuazy') || loc_href.includes('haohuazyziyuan')) {
        if (loc_href.includes('detail')) {
            qSA('.vod-list .list-item').forEach(li => {
                let raw = qS('a', li)?.href;
                if (!raw || li.innerText.includes('全选')) return;
                if (!raw.startsWith('http')) raw = loc_origin + '/' + raw;
                const numEl = qS('.list-title', li);
                const num = numEl ? numEl.innerText.split('$')[0] : '';
                let final = raw.includes('.m3u8')
                    ? api_endpoint + encodeURIComponent(raw)
                    : api_endpoint + encodeURIComponent(raw) + '&iframe=true';
                li.append(createPlaybackLink(final, `播放:${num}`));
            });
            insertFavoriteButton(qS('.vod-img img')?.src);
            insertPlaybackTypeJumper('.vod-list h3', '.vod-info');
        }
        addStickyClass('.top', 'kk-sticky');
        addClassToElement('.search-text', 'kk-search-ipt');
        addClassToElement('.top-search button', 'kk-search-btn');
        removeElements(['.card', 'body>a']);

    } else if (loc_href.includes('guangsuzy') || loc_href.includes('guangsuziyuan')) {
        if (loc_href.includes('detail')) {
            qSA('.dy-collect-list li').forEach(li => {
                let raw = qS('a', li)?.href;
                if (!raw || li.innerText.includes('全选')) return;
                if (!raw.startsWith('http')) raw = loc_origin + '/' + raw;
                const name = qS('.c-name', li)?.innerText || '';
                let final = raw.includes('.m3u8')
                    ? api_endpoint + encodeURIComponent(raw)
                    : api_endpoint + encodeURIComponent(raw) + '&iframe=true';
                li.append(createPlaybackLink(final, `播放:${name}`));
            });
            insertFavoriteButton(qS('.dy-photo img')?.src);
            insertPlaybackTypeJumper('.dy-collect-video', '.detailed');
        }

    } else if (loc_href.includes('hongniuzy') || loc_href.includes('hongniuziyuan')) {
        if (loc_href.includes('detail')) {
            qSA('.vodplayinfo li').forEach(li => {
                let raw = qS('a', li)?.href;
                if (!raw || li.innerText.includes('全选')) return;
                if (!raw.startsWith('http')) raw = loc_origin + '/' + raw;
                const title = qS('a', li)?.title || '';
                let final = raw.includes('.m3u8')
                    ? api_endpoint + encodeURIComponent(raw)
                    : api_endpoint + encodeURIComponent(raw) + '&iframe=true';
                li.append(createPlaybackLink(final, `播放:${title}`));
            });
            insertFavoriteButton(qS('.vodImg img')?.src);
            insertPlaybackTypeJumper('.vodplayinfo h3', '.ibox');
            removeElements('.index-header');
        }
        addStickyClass('.xing_top', 'kk-sticky');
        addClassToElement('#wd', 'kk-search-ipt');
        addClassToElement('.search-btn', 'kk-search-btn');
        removeElements('.index-header a');

    } else if (loc_href.includes('1080zyk') && loc_href.includes('detail')) {
        qSA('.playlist li').forEach(li => {
            const full = li.innerText;
            if (full.includes('全选')) return;
            const parts = full.split('$');
            const label = parts[0];
            let href = qS('a', li)?.href || parts[1];
            const m3u8Match = href.match(/=(https?:\/\/[^&]+?\.m3u8)/);
            if (m3u8Match) href = api_endpoint + encodeURIComponent(m3u8Match[1]);
            li.append(createPlaybackLink(href, `播放:${label}`));
        });
        insertFavoriteButton(qS('.vodImg img')?.src);
        removeElements(['#topBar', 'body>table']);
        addClassToElement('.search-text', 'kk-search-ipt');
        addClassToElement('.search-btn', 'kk-search-btn');

    } else if (loc_href.includes('ffzy') && loc_href.includes('detail')) {
        qSA('.playlist li').forEach(li => {
            let raw = qS('font', li)?.innerText || '';
            if (!raw || raw.includes('全选')) return;
            if (!raw.startsWith('http')) raw = loc_origin + '/' + raw;
            const parts = raw.split('$');
            const label = parts[0];
            const actual = parts[1];
            let final = actual.includes('.m3u8')
                ? api_endpoint + encodeURIComponent(actual)
                : api_endpoint + encodeURIComponent(actual) + '&iframe=true';
            li.append(createPlaybackLink(final, `播放:${label}`));
        });
        insertFavoriteButton(qS('.people .left img')?.src);
        insertPlaybackTypeJumper('#content h4', '.people');
        removeElements('.index-header');

    } else if (loc_href.includes('xinlangz') && loc_href.includes('detail')) {
        qSA('.collect-item-href .left').forEach(li => {
            const span = qS('span', li);
            const num = span ? span.innerText : '';
            const a = qS('a', li);
            if (!a) return;
            let href = a.href;
            if (href.includes('.m3u8')) {
                href = api_endpoint + encodeURIComponent(href);
            } else {
                href = api_endpoint + encodeURIComponent(href) + '&iframe=true';
            }
            li.append(createPlaybackLink(href, `播放:${num}`));
        });
        insertFavoriteButton(qS('.dy-pic img')?.src);
        insertPlaybackTypeJumper('.collect-item-title', '.dy-details');

    } else if (loc_href.includes('ikunzy') && loc_href.includes('voddetail')) {
        qSA('.listitems').forEach(li => {
            const full = li.innerText;
            if (full.includes('全选')) return;
            const label = full.split('$')[0];
            const btn = qS('.btn a', li);
            if (!btn) return;
            const match = btn.href.match(/=(https?:\/\/[^&]+?\.m3u8)/);
            if (match) {
                btn.href = api_endpoint + encodeURIComponent(match[1]);
            }
            btn.innerText += ':' + label;
            btn.classList.add('kk-btn');
        });
        insertFavoriteButton(qS('.countimg img')?.src);
        removeElements('.indextop');

    } else if (loc_href.includes('suonizy') || loc_href.includes('snzy')) {
        if (loc_href.includes('voddetail')) {
            qSA('.dy-collect-list li').forEach(li => {
                const full = li.innerText;
                if (full.includes('全选')) return;
                const parts = full.split('$');
                const label = parts[0];
                let href = qS('a', li)?.href || parts[1];
                const m3u8Match = href.match(/=(https?:\/\/[^&]+?\.m3u8)/);
                if (m3u8Match) href = api_endpoint + encodeURIComponent(m3u8Match[1]);
                li.append(createPlaybackLink(href, `播放:${label}`));
            });
            insertFavoriteButton(qS('img.res-img')?.src);
            removeElements(['.link-box']);
        }
        addClassToElement('#wd', 'kk-search-ipt');
        addClassToElement('.nav-input form button', 'kk-search-btn');
        removeElements(['header .content >a']);

    } else if (loc_href.includes('bfzy.tv') || /bfzy\d+\.tv/.test(loc_href)) {
        if (loc_href.includes('vod/detail')) {
            qSA('.playlist li').forEach(li => {
                const full = li.innerText;
                if (full.includes('全选')) return;
                const parts = full.split('$');
                const label = parts[0];
                let href = qS('a', li)?.href || parts[1];
                const m3u8Match = href.match(/=(https?:\/\/[^&]+?\.m3u8)/);
                if (m3u8Match) href = api_endpoint + encodeURIComponent(m3u8Match[1]);
                li.append(createPlaybackLink(href, `播放:${label}`));
            });
            insertFavoriteButton(qS('.people img')?.src);
            removeElements('.index-header');
        }
        addStickyClass('.head_box', 'kk-sticky');
        addClassToElement('.search-input', 'kk-search-ipt');
        addClassToElement('#searchbutton', 'kk-search-btn');
        removeElements('.index-card a[href*="ads"]');

    } else if (loc_href.includes('huyazy') || loc_href.includes('huyaziyuan')) {
        if (loc_href.includes('vod/detail')) {
            qSA('.vodplayinfo li').forEach(li => {
                const full = li.innerText;
                if (full.includes('全选')) return;
                const parts = full.split('$');
                const label = parts[0];
                let href = qS('a', li)?.href || parts[1];
                let final = href.includes('.m3u8')
                    ? api_endpoint + encodeURIComponent(href)
                    : api_endpoint + encodeURIComponent(href) + '&iframe=true';
                li.append(createPlaybackLink(final, `播放:${label}`));
            });
            insertFavoriteButton(qS('.vodImg img')?.src);
            insertPlaybackTypeJumper('.vodplayinfo h3', '.ibox');
            removeElements(['.imagetopbg', '.index-header', '.noticetop', 'body>a']);
        }
        removeElements(['.imagetopbg', 'body>a']);
    } else {
        const M3U8_URL_REGEX = /https?:\/\/[^\s"'\)<>\[\]{}]*\.m3u8(?:[?#][^\s"'\)<>\[\]{}]*)?/gi;
        const INSERTED_CLASS = 'm3u8-link-inserted';
        const coveredElements = new WeakSet();
        function extractFirstM3U8(str) {
            if (typeof str !== 'string') return null;
            const match = str.match(M3U8_URL_REGEX);
            return match ? match[0] : null;
        }
        function traversePostOrder(node) {
            if (node.nodeType !== Node.ELEMENT_NODE) {
                return;
            }
            for (const child of Array.from(node.children)) {
                traversePostOrder(child);
            }
            if (coveredElements.has(node)) {
                return;
            }
            if (!node.parentNode || node.parentNode.nodeType !== Node.ELEMENT_NODE) {
                return;
            }
            if (node.nextElementSibling?.classList?.contains(INSERTED_CLASS)) {
                return;
            }
            let m3u8Url = null;
            m3u8Url = extractFirstM3U8(node.textContent);
            if (!m3u8Url && node.attributes) {
                for (const attr of node.attributes) {
                    m3u8Url = extractFirstM3U8(attr.value);
                    if (m3u8Url) break;
                }
            }
            if (m3u8Url) {
                const link = createPlaybackLink(api_endpoint + encodeURIComponent(m3u8Url), '加速播放')
                node.parentNode.insertBefore(link, node.nextSibling);
                let ancestor = node;
                while (ancestor && ancestor.nodeType === Node.ELEMENT_NODE) {
                    coveredElements.add(ancestor);
                    ancestor = ancestor.parentElement;
                }
            }
        }
        if (document.body) {
            traversePostOrder(document.body);
        } else {

            document.addEventListener('DOMContentLoaded', () => {
                traversePostOrder(document.body);
            });
        }
    }

})();