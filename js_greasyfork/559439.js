// ==UserScript==
// @name         天镜智价自动化办公
// @namespace    http://tampermonkey.net/
// @version      8.9.17
// @description  V8.9.17 性能优化版：引入 CPU 空闲检测机制 (Idle Callback)，解决首次加载卡顿问题；严格限制截图计算区域，大幅提升自动同步速度。
// @match        *://item.jd.com/*
// @match        *://item.jd.hk/*
// @match        *://npcitem.jd.hk/*
// @match        *://search.jd.com/*
// @require      https://cdn.jsdelivr.net/npm/html2canvas@1.4.1/dist/html2canvas.min.js
// @grant        GM_xmlhttpRequest
// @grant        GM_addStyle
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_registerMenuCommand
// @grant        GM_openInTab
// @grant        GM_info
// @run-at       document-start
// @connect      *
// @connect      update.greasyfork.org
// @downloadURL https://update.greasyfork.org/scripts/559439/%E5%A4%A9%E9%95%9C%E6%99%BA%E4%BB%B7%E8%87%AA%E5%8A%A8%E5%8C%96%E5%8A%9E%E5%85%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/559439/%E5%A4%A9%E9%95%9C%E6%99%BA%E4%BB%B7%E8%87%AA%E5%8A%A8%E5%8C%96%E5%8A%9E%E5%85%AC.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // --- 0. 基础配置 ---
    const SCRIPT_ID = '559439'; 
    const UPDATE_CHECK_URL = `https://update.greasyfork.org/scripts/${SCRIPT_ID}/code.meta.js`;
    const DOWNLOAD_URL = `https://update.greasyfork.org/scripts/${SCRIPT_ID}/code.user.js`;
    
    // --- 1. UI 系统 ---
    const STYLE = `
        .tj-ui-container { position: fixed; bottom: 30px; right: 20px; z-index: 99999; display: flex; flex-direction: column; gap: 10px; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif; pointer-events: none; }
        .tj-action-btn { pointer-events: auto; background: #2979ff; color: #fff; border: none; padding: 10px 16px; border-radius: 30px; cursor: pointer; font-size: 13px; font-weight: 600; box-shadow: 0 4px 12px rgba(41, 121, 255, 0.3); transition: all 0.2s; display: flex; align-items: center; gap: 6px; width: fit-content; align-self: flex-end; }
        .tj-action-btn:hover { transform: translateY(-2px); box-shadow: 0 6px 16px rgba(41, 121, 255, 0.4); background: #2962ff; }
        .tj-action-btn:active { transform: translateY(0); }
        .tj-action-btn.loading { background: #78909c; cursor: wait; }
        
        .tj-toast { background: rgba(33, 33, 33, 0.95); color: #fff; padding: 10px 16px; border-radius: 6px; font-size: 13px; box-shadow: 0 4px 12px rgba(0,0,0,0.15); display: flex; align-items: center; gap: 8px; animation: tjSlideIn 0.3s; pointer-events: auto; backdrop-filter: blur(4px); }
        .tj-toast.success { border-left: 3px solid #00e676; }
        .tj-toast.error { border-left: 3px solid #ff1744; }
        .tj-toast.info { border-left: 3px solid #2979ff; }
        .tj-toast.update { border-left: 3px solid #ff9100; cursor: pointer; font-weight: bold; }
        
        @keyframes tjSlideIn { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes tjFadeOut { from { opacity: 1; transform: translateX(0); } to { opacity: 0; transform: translateX(100%); } }
    `;

    if (document.head) { GM_addStyle(STYLE); } 
    else { const observer = new MutationObserver(() => { if (document.head) { GM_addStyle(STYLE); observer.disconnect(); } }); observer.observe(document, { childList: true, subtree: true }); }

    const UI = {
        container: null,
        getContainer: () => {
            if (!UI.container) {
                const div = document.createElement('div');
                div.className = 'tj-ui-container';
                if (Utils.getPageType() === 'detail') {
                    const btn = document.createElement('button');
                    btn.className = 'tj-action-btn';
                    btn.innerHTML = '🔄 手动同步数据';
                    btn.onclick = async () => {
                        if (btn.classList.contains('loading')) return;
                        btn.classList.add('loading');
                        btn.innerHTML = '⏳ 处理中...';
                        await Core.executeSync(true); // 手动模式不等待空闲，立即执行
                        setTimeout(() => {
                            btn.classList.remove('loading');
                            btn.innerHTML = '🔄 手动同步数据';
                        }, 2000);
                    };
                    div.appendChild(btn);
                }
                document.body.appendChild(div);
                UI.container = div;
            }
            return UI.container;
        },
        toast: (text, type = 'info', duration = 3000) => {
            if (!document.body) return;
            const el = document.createElement('div');
            el.className = `tj-toast ${type}`;
            let icon = type === 'success' ? '✅' : (type === 'error' ? '❌' : (type === 'update' ? '🚀' : 'ℹ️'));
            el.innerHTML = `<span>${icon}</span><span>${text}</span>`;
            UI.getContainer().prepend(el);
            setTimeout(() => { el.style.animation = 'tjFadeOut 0.3s forwards'; setTimeout(() => el.remove(), 300); }, duration);
        }
    };

    const CONFIG = { 
        API_URL: GM_getValue('custom_api_url', 'https://toubiao.tc.benlai.com/rest/jditem'),
        HEADERS: { 'Content-Type': 'application/json', 'User-Agent': 'Apifox/1.0.0', 'Accept': '*/*' }, 
        WATCH_INTERVAL: 1500 
    };
    const STATE = { uploadedSkus: new Set(), isProcessing: false, detailParsed: false };

    GM_registerMenuCommand("⚙️ 设置接口地址", () => {
        const input = prompt("请输入数据上传接口地址：", CONFIG.API_URL);
        if (input && input.trim()) { GM_setValue('custom_api_url', input.trim()); location.reload(); }
    });

    // --- 3. 性能优化版截图模块 ---
    const Screenshot = {
        getSnapshotBase64: async () => {
            try {
                // 仅截取当前视口，避免全页渲染造成的卡顿
                const width = window.innerWidth;
                const height = window.innerHeight;
                
                const canvas = await html2canvas(document.body, {
                    useCORS: true,
                    allowTaint: false,
                    width: width,      // 强制限制宽度
                    height: height,    // 强制限制高度
                    windowWidth: width,
                    windowHeight: height,
                    x: window.scrollX,
                    y: window.scrollY,
                    scale: 1,          // 保持1倍缩放，速度最快
                    logging: false,    // 关闭日志减少开销
                    ignoreElements: (element) => element.classList.contains('tj-ui-container')
                });
                return canvas.toDataURL('image/jpeg', 0.5);
            } catch (err) {
                console.error('Screenshot error:', err);
                return "";
            }
        }
    };

    // --- 4. 选择器配置 (保持不变) ---
    const SELECTORS = {
        header: { user: ['#ttbar-login-2024 .nickname', '#ttbar-login .nickname', '.nickname'], location: ['#areamini-2024 .ui-areamini-text', '#ttbar-mycity .ui-areamini-text', '.ui-areamini-text'] },
        list: { card: 'div[data-sku]', name: ['span[class*="_text_"]', '.p-name em', '.p-name'], price: ['span[class*="_price_"]', '.p-price strong i', '.price strong'], shop: ['span[class*="_name_"]', '.p-shop a', '.curr-shop'], self: ['img[alt="自营"]', '.goods-icons .self-support'], tags: 'div[class*="_tags_"] span', promoText: 'div[class*="_common-wrap_"]', subsidyLabel: 'div[class*="_subsidy_"]', grayPrice: 'span[class*="_gray_"]' },
        detail: { name: ['.sku-title-name', '#sku-name-container', '.sku-name', '#name h1'], priceBase: ['.p-price .price', '.summary-price .price', '#jd-price'], priceFinal: ['#J_FinalPrice .price', '.summary-price-wrap .price'], shop: ['.top-name-tag .top-name', '.contact-name a'], brand: ['a[href*="ev=exbrand"]', '#parameter-brand li a'], promotionsSafe: ['.shareds .floor-item', '#sx-discount .floor-item:not(.multiple-item)'], modalFormulaItems: '.discount-modal .formula-details .item' }
    };

    const Utils = {
        cleanPrice: (str) => { if (!str) return 0; return parseFloat(str.replace(/[^\d.]/g, '')) || 0; },
        getText: (ctx, sels) => { if (!Array.isArray(sels)) sels = [sels]; for (const s of sels) { try { const el = ctx.querySelector(s); if (el) return (el.getAttribute('title') || el.innerText || '').trim(); } catch (e) { continue; } } return ''; },
        getBrandFromTable: () => { try { const items = document.querySelectorAll('.item'); for (const item of items) { if (item.innerText.includes('品牌')) { const val = item.querySelector('.value'); if (val) return (val.getAttribute('title') || val.innerText).trim(); } } } catch(e) {} return ''; },
        getPageTitle: () => document.title.split('-')[0].replace('【行情 报价 价格 评测】', '').trim(),
        cleanCity: (rawStr) => rawStr ? rawStr.split(/[-–—]/).pop().trim() : '',
        cleanReviewText: (str) => str ? str.replace(/(已售|销量|评价|条|Comments|Sold|\+)/gi, '').trim() : '0',
        getPageType: () => location.host.includes('item.jd') ? 'detail' : (location.host.includes('search.jd') ? 'list' : 'unknown'),
        sleep: (ms) => new Promise(r => setTimeout(r, ms)),
        extractAmountFromText: (text) => { const match = text.match(/(?:减|省|[¥￥]|^首购礼金)\D*(\d+(\.\d+)?)/); return match ? parseFloat(match[1]) : 0; },
        // 新增：空闲执行器
        runWhenIdle: (callback) => {
            if ('requestIdleCallback' in window) {
                // 等待浏览器空闲，最长等待3秒
                window.requestIdleCallback(() => callback(), { timeout: 3000 });
            } else {
                setTimeout(callback, 1000);
            }
        }
    };

    // --- 6. 解析核心 (保持不变) ---
    const Parser = {
        getEnvironmentInfo: () => ({ user: Utils.getText(document, SELECTORS.header.user) || '未登录', city: Utils.cleanCity(Utils.getText(document, SELECTORS.header.location)) }),
        parseDetailFromModal: () => {
            const discounts = { gov: 0, plus: 0, first: 0 };
            const promoList = [];
            const formulaItems = document.querySelectorAll(SELECTORS.detail.modalFormulaItems);
            if (formulaItems.length === 0) return null;
            formulaItems.forEach(item => {
                const desc = item.querySelector('.desc')?.innerText.trim();
                const valStr = item.querySelector('.value')?.innerText.trim();
                const val = Utils.cleanPrice(valStr);
                if (val > 0 && desc) {
                    promoList.push(`${desc} ${valStr}`);
                    if (desc.toUpperCase().includes('PLUS')) discounts.plus += val;
                    else if (desc.includes('政府') || desc.includes('补贴')) discounts.gov += val;
                    else if (desc.includes('首购')) discounts.first += val;
                }
            });
            return { discounts, promoList };
        },
        parseDetailFromDOM: () => {
            const discounts = { gov: 0, plus: 0, first: 0 };
            const promoList = [];
            document.querySelectorAll(SELECTORS.detail.promotionsSafe.join(',')).forEach(item => {
                if (item.closest('.again-shareds')) return;
                const text = item.innerText.trim();
                if (!text) return;
                promoList.push(text);
                if (text.includes('政府补贴')) discounts.gov = Utils.extractAmountFromText(text);
                else if (text.toUpperCase().includes('PLUS')) discounts.plus = Utils.extractAmountFromText(text);
                else if (text.includes('首购')) discounts.first = Utils.extractAmountFromText(text);
            });
            return { discounts, promoList };
        },
        parseDetail: () => {
            const itemCode = location.pathname.match(/\/(\d+)\.html/)?.[1] || '';
            const env = Parser.getEnvironmentInfo();
            const isOff = document.body.innerText.includes('已下柜') || document.body.innerText.includes('已下架');
            const name = Utils.getText(document, SELECTORS.detail.name) || Utils.getPageTitle();
            const basePrice = Utils.cleanPrice(Utils.getText(document, SELECTORS.detail.priceBase));
            const finalPrice = Utils.cleanPrice(Utils.getText(document, SELECTORS.detail.priceFinal)) || basePrice;
            const shopName = Utils.getText(document, SELECTORS.detail.shop) || '京东自营';
            const brand = Utils.getText(document, SELECTORS.detail.brand) || Utils.getBrandFromTable();

            let promoData = Parser.parseDetailFromModal();
            if (!promoData || (promoData.discounts.gov === 0 && promoData.discounts.plus === 0 && promoData.discounts.first === 0)) {
                promoData = Parser.parseDetailFromDOM();
            }

            return {
                "jd_sku": itemCode, "jd_name": isOff ? `【已下架】${name}` : name, "jd_price": basePrice, "jd_final_price": finalPrice,
                "jd_review": Utils.cleanReviewText(document.querySelector('#comment-count a')?.innerText),
                "jd_self_owned": (shopName.includes('自营') || !!document.querySelector('.u-jd')),
                "jd_seller": shopName, "jd_city": env.city, "jd_brand": brand,
                "jd_promotion_Info": JSON.stringify(promoData.promoList), "jd_source": "detail",
                "jd_discount_gov": promoData.discounts.gov, "jd_discount_plus": promoData.discounts.plus, "jd_discount_first": promoData.discounts.first,
                "userInfo": env.user, "jd_status": isOff ? 'off' : 'normal', "snapshot_base64": ""
            };
        },
        parseListNodes: (nodeList) => {
            const items = [];
            const env = Parser.getEnvironmentInfo();
            nodeList.forEach(card => {
                try {
                    const sku = card.getAttribute('data-sku');
                    if (!sku) return;
                    items.push({ 
                        "jd_sku": sku, "jd_name": Utils.getText(card, SELECTORS.list.name), "jd_price": Utils.cleanPrice(card.querySelector(SELECTORS.list.price[0])?.innerText), "jd_final_price": Utils.cleanPrice(card.querySelector(SELECTORS.list.price[0])?.innerText), 
                        "jd_seller": Utils.getText(card, SELECTORS.list.shop), "jd_city": env.city, "jd_source": "list", "userInfo": env.user
                    });
                } catch(e){}
            });
            return items;
        }
    };

    const Network = {
        upload: (dataList) => {
            return new Promise((resolve, reject) => {
                GM_xmlhttpRequest({
                    method: "POST", url: CONFIG.API_URL, headers: CONFIG.HEADERS, data: JSON.stringify({ "data": dataList }),
                    onload: (res) => res.status >= 200 && res.status < 300 ? resolve(res.responseText) : reject(new Error(`HTTP ${res.status}`)),
                    onerror: () => reject(new Error("网络请求失败"))
                });
            });
        }
    };

    // --- 7. 任务调度核心 ---
    const Core = {
        executeSync: async (isManual = false) => {
            if (isManual) UI.toast('开始手动同步...', 'info');
            try {
                const item = Parser.parseDetail();
                // 如果是自动采集，且不是手动点击，则提示正在处理，但不阻断用户
                if (!isManual) UI.toast('数据解析完成，等待后台生成证据...', 'info', 2000);
                
                const snapshot = await Screenshot.getSnapshotBase64();
                item.snapshot_base64 = snapshot;
                
                if (isManual) UI.toast('正在上传...', 'info');
                await Network.upload([item]);
                UI.toast(isManual ? '手动同步成功' : '自动采集成功', 'success');
                return true;
            } catch (e) {
                console.error(e);
                UI.toast(isManual ? '同步失败' : '自动采集失败', 'error');
                return false;
            }
        }
    };

    // --- 8. 智能监听 ---
    const Observer = {
        startListWatcher: () => {
            setInterval(async () => {
                if (STATE.isProcessing) return; 
                const allCards = document.querySelectorAll(SELECTORS.list.card);
                const newCards = [];
                allCards.forEach(card => {
                    const sku = card.getAttribute('data-sku');
                    if (sku && !STATE.uploadedSkus.has(sku)) newCards.push(card);
                });
                if (newCards.length > 0) {
                    STATE.isProcessing = true;
                    newCards.forEach(c => STATE.uploadedSkus.add(c.getAttribute('data-sku')));
                    const data = Parser.parseListNodes(newCards);
                    if (data.length > 0) {
                        try { await Network.upload(data); UI.toast(`采集成功 +${data.length}`, 'success'); } catch (err) {}
                    }
                    STATE.isProcessing = false;
                }
            }, CONFIG.WATCH_INTERVAL);
        },

        startDetailWatcher: async () => {
            UI.toast('等待页面渲染...', 'info');
            let attempts = 0;
            const checkDataReady = async () => {
                if (STATE.detailParsed) return;
                const domName = Utils.getText(document, SELECTORS.detail.name);
                const priceText = Utils.getText(document, SELECTORS.detail.priceFinal) || Utils.getText(document, SELECTORS.detail.priceBase);
                
                if (Utils.cleanPrice(priceText) > 0 && (domName || Utils.getPageTitle())) {
                    STATE.detailParsed = true;
                    // 性能核心：等待浏览器空闲时再执行截图，避免和网页加载抢资源
                    UI.toast('页面就绪，准备采集', 'info');
                    
                    // 延迟1.5秒，确保价格数字完全跳动结束，DOM稳定
                    setTimeout(() => {
                        Utils.runWhenIdle(() => Core.executeSync(false));
                    }, 1500); 
                    
                } else {
                    attempts++;
                    if (attempts > 50) { // 超时强制采集
                         STATE.detailParsed = true;
                         Core.executeSync(false);
                    } else { setTimeout(checkDataReady, 200); }
                }
            };
            checkDataReady();
        }
    };

    // --- 9. 更新逻辑 ---
    const Updater = {
        compare: (v1, v2) => {
            const p1 = v1.split('.').map(Number);
            const p2 = v2.split('.').map(Number);
            for (let i = 0; i < Math.max(p1.length, p2.length); i++) {
                if ((p1[i] || 0) > (p2[i] || 0)) return 1;
                if ((p1[i] || 0) < (p2[i] || 0)) return -1;
            }
            return 0;
        },
        check: () => {
            GM_xmlhttpRequest({
                method: "GET", url: UPDATE_CHECK_URL, headers: { "Cache-Control": "no-cache" },
                onload: (res) => {
                    const remoteVer = res.responseText.match(/@version\s+([\d.]+)/i)?.[1];
                    const currentVer = GM_info.script.version;
                    if (remoteVer && Updater.compare(remoteVer, currentVer) > 0) {
                        UI.toast(`🚀 发现新版本 V${remoteVer}，3秒后自动跳转更新...`, 'update', 5000);
                        setTimeout(() => GM_openInTab(DOWNLOAD_URL, { active: true, insert: true }), 3000);
                    }
                }
            });
        }
    };

    document.addEventListener('DOMContentLoaded', () => {
        Updater.check();
        if (Utils.getPageType() === 'detail') UI.getContainer();
    });
    
    if (document.readyState === 'interactive' || document.readyState === 'complete') {
         const pageType = Utils.getPageType();
         if (pageType === 'detail' && !STATE.detailParsed) Observer.startDetailWatcher();
         if (pageType === 'list') window.addEventListener('load', Observer.startListWatcher);
    } else {
         window.addEventListener('load', () => {
             const pageType = Utils.getPageType();
             if (pageType === 'list') Observer.startListWatcher();
             if (pageType === 'detail' && !STATE.detailParsed) Observer.startDetailWatcher();
         });
    }

})();