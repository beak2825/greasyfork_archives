// ==UserScript==
// @name         好医生CME批量选课 - 自动静默极速版
// @namespace    http://tampermonkey.net/
// @version      28.0
// @description  移除所有手动确认弹窗，改用自动消失的轻提示。手动勾选 -> 一键启动 -> 自动关闭。
// @author       GGBond
// @license      MIT
// @icon         https://img.icons8.com/?size=100&id=71733&format=png&color=000000
// @match        *://*.cmechina.net/cme/subject.jsp*
// @match        *://*.cmechina.net/cme/subject2.jsp*
// @match        *://*.cmechina.net/cme/course.jsp*
// @match        *://*.cmechina.net/cme/study2.jsp*
// @match        *://*.cmechina.net/cme/polyv.jsp*
// @match        *://*.cmechina.net/cme/cc.jsp*
// @grant        unsafeWindow
// @grant        window.close
// @grant        GM_setValue
// @grant        GM_getValue
// @downloadURL https://update.greasyfork.org/scripts/560120/%E5%A5%BD%E5%8C%BB%E7%94%9FCME%E6%89%B9%E9%87%8F%E9%80%89%E8%AF%BE%20-%20%E8%87%AA%E5%8A%A8%E9%9D%99%E9%BB%98%E6%9E%81%E9%80%9F%E7%89%88.user.js
// @updateURL https://update.greasyfork.org/scripts/560120/%E5%A5%BD%E5%8C%BB%E7%94%9FCME%E6%89%B9%E9%87%8F%E9%80%89%E8%AF%BE%20-%20%E8%87%AA%E5%8A%A8%E9%9D%99%E9%BB%98%E6%9E%81%E9%80%9F%E7%89%88.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const CONFIG = {
        playDuration: 5000,
        scanInterval: 1200
    };

    const cleanOldUI = () => {
        const selectors = [
            '#buyo_floating_btn', '#cme_batch_btn', '.meow-ui-container',
            '#buyo-toolbar-btn', '.buyo-embed-btn', '#buyo_cloned_btn', '.buyo-toast'
        ];
        selectors.forEach(sel => document.querySelectorAll(sel).forEach(el => el.remove()));
    };

    const showToast = (msg, duration = 3000) => {
        const toast = document.createElement('div');
        toast.className = 'buyo-toast';
        toast.style.cssText = `
            position: fixed; top: 15%; left: 50%; transform: translateX(-50%);
            background: rgba(0, 0, 0, 0.75); color: #fff; padding: 10px 20px;
            border-radius: 4px; font-size: 14px; z-index: 100000;
            box-shadow: 0 4px 6px rgba(0,0,0,0.1); pointer-events: none;
            transition: opacity 0.3s;
        `;
        toast.innerText = msg;
        document.body.appendChild(toast);
        setTimeout(() => {
            toast.style.opacity = '0';
            setTimeout(() => toast.remove(), 300);
        }, duration);
    };

    const customQuerySelector = (sel) => document.querySelector(sel);

    const triggerMobileClick = (el) => {
        if (!el) return;
        el.scrollIntoView({block: "center", inline: "nearest"});
        const touchStart = new Event('touchstart', { bubbles: true, cancelable: true });
        const touchEnd = new Event('touchend', { bubbles: true, cancelable: true });
        el.dispatchEvent(touchStart);
        el.click();
        el.dispatchEvent(touchEnd);
    };

    let globalPlayer = null;
    function initPlayer() {
        if (unsafeWindow.player && unsafeWindow.player.params) {
            try { unsafeWindow.player.params.rate_allow_change = true; } catch (e) {}
            globalPlayer = unsafeWindow.player;
        } else if (unsafeWindow.cc_js_Player && unsafeWindow.cc_js_Player.params) {
            try { unsafeWindow.cc_js_Player.params.rate_allow_change = true; } catch (e) {}
            globalPlayer = unsafeWindow.cc_js_Player;
        }
    }

    const findUnlearnedTarget = () => {
        let targetLink = null;
        const listItems = document.querySelectorAll("li");
        for(let li of listItems) {
            if((li.innerText.includes('未学习')) && !li.className.includes('active')) {
                 const a = li.querySelector('a');
                 if(a) { targetLink = a; break; }
            }
        }
        if(!targetLink) {
            const allLinks = document.querySelectorAll('a');
            for(let a of allLinks) {
                if(a.innerText.includes('未学习') && !a.href.includes('javascript:;') && a.offsetParent !== null) {
                    targetLink = a;
                    break;
                }
            }
        }
        return targetLink;
    };

    const currentUrl = window.location.href;
    const isPlayerPage = currentUrl.includes('study2.jsp') || currentUrl.includes('polyv.jsp') || currentUrl.includes('cc.jsp');
    const isDirectoryPage = currentUrl.includes('course.jsp');
    const isSubjectList = currentUrl.includes('subject2.jsp');
    const isSubjectTile = currentUrl.includes('subject.jsp') && !currentUrl.includes('subject2.jsp');

    const getUrlParam = (name) => new URLSearchParams(window.location.search).get(name);
    const isAutoMode = getUrlParam('auto_handle') === 'true' || sessionStorage.getItem('cme_auto_active') === '1';


    if (isAutoMode) {
        sessionStorage.setItem('cme_auto_active', '1');

        const tip = document.createElement('div');
        tip.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.9);color:#FFB74D;z-index:999999;display:flex;flex-direction:column;justify-content:center;align-items:center;font-size:20px;font-family:sans-serif;pointer-events:none;';
        tip.innerHTML = '<img src="https://i.ibb.co/VY4ZddwP/buyoicon-no-backg.png" style="width:60px;margin-bottom:10px;"><div>咘哟正在为您添加课程...</div><div id="cme_log" style="font-size:14px;color:#fff;margin-top:10px;">初始化...</div>';
        document.body.appendChild(tip);
        const log = (t) => document.getElementById('cme_log').innerText = t;

        setTimeout(() => {
            if (isPlayerPage) {
                log('🎬 初始化播放器...');
                initPlayer();
                const video = customQuerySelector('.pv-video') || customQuerySelector('video');
                if (video || globalPlayer) {
                    if (globalPlayer) { try { globalPlayer.setVolume(0); globalPlayer.play(); } catch(e){} }
                    if (video) {
                        try {
                            video.muted = true; video.volume = 0;
                            const p = video.play();
                            if(p && p.catch) p.catch(e => { triggerMobileClick(video); });
                        } catch(e) {}
                    }
                    let count = CONFIG.playDuration / 1000;
                    const timer = setInterval(() => {
                        let isPlaying = (video && video.currentTime > 0) || (globalPlayer);
                        if(isPlaying) log(`✅ 播放中... 剩余 ${count.toFixed(1)}秒`);
                        else log(`⏳ 缓冲中... 剩余 ${count.toFixed(1)}秒`);
                        count -= 0.5;
                        if (count <= 0) {
                            clearInterval(timer);
                            sessionStorage.removeItem('cme_auto_active');
                            window.close();
                        }
                    }, 500);
                } else {
                    log('❌ 未找到播放器。5秒后关闭。');
                    setTimeout(() => window.close(), 5000);
                }
                return;
            }

            if (isDirectoryPage) {
                log('📂 寻找未学习章节...');
                const target = findUnlearnedTarget();
                if (target) {
                    log(`👆 点击: ${target.innerText}`);
                    target.style.border = '3px solid #FFB74D';
                    setTimeout(() => triggerMobileClick(target), 500);
                } else {
                    log('❌ 没找到可点击的章节，5秒后关闭');
                    setTimeout(() => window.close(), 5000);
                }
                return;
            }
        }, 1500);
        return;
    }


    if ((isSubjectList || isSubjectTile) && !isAutoMode) {

        const style = document.createElement('style');
        style.innerHTML = `
            #buyo_panel_mask { position:fixed; top:0; left:0; width:100%; height:100%; background:rgba(0,0,0,0.6); z-index:99998; display:none; backdrop-filter: blur(2px); }
            #buyo_panel { position:fixed; top:50%; left:50%; transform:translate(-50%,-50%); width:450px; background:#fff; border-radius:12px; box-shadow:0 10px 25px rgba(0,0,0,0.5); z-index:99999; display:flex; flex-direction:column; overflow:hidden; font-family: sans-serif; border: 2px solid #FFB74D; }
            #buyo_header { padding:15px; background:#FFF3E0; border-bottom:1px solid #FFB74D; font-weight:bold; color:#E65100; display:flex; justify-content:space-between; align-items:center; }
            #buyo_list { padding:10px; max-height:50vh; overflow-y:auto; background:#FAFAFA; }
            .buyo-item { padding:8px 10px; border-bottom:1px solid #eee; display:flex; align-items:center; transition: background 0.2s; }
            .buyo-item:hover { background:#FFF8E1; }
            .buyo-item input { margin-right:10px; transform: scale(1.2); cursor: pointer; accent-color: #FF9800; }
            .buyo-item label { cursor: pointer; flex: 1; font-size: 14px; color: #333; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
            #buyo_footer { padding:15px; border-top:1px solid #eee; text-align:right; background:#fff; display:flex; justify-content: space-between; align-items: center; }
            .buyo-btn { padding:8px 20px; border-radius:20px; border:none; cursor:pointer; font-weight:bold; font-size:13px; transition: transform 0.1s; }
            .buyo-btn-go { background:#FFB74D; color:white; box-shadow: 0 2px 5px rgba(255, 183, 77, 0.4); }
        `;
        document.head.appendChild(style);

        const injectBtn = () => {
            cleanOldUI();
            const toolbar = document.querySelector('.list_tab');
            if (!toolbar) return;

            let refBtn = toolbar.querySelector('.lb');
            if (!refBtn) refBtn = toolbar.querySelector('a');

            if (refBtn) {
                const newBtn = refBtn.cloneNode(true);
                newBtn.id = 'buyo_cloned_btn';
                newBtn.href = 'javascript:void(0)';
                newBtn.innerHTML = '<img src="https://i.ibb.co/VY4ZddwP/buyoicon-no-backg.png" style="width:16px;vertical-align:text-bottom;margin-right:4px;">批量选课';
                newBtn.classList.remove('active');

                newBtn.onclick = function() {
                    if (isSubjectTile) {
                        showToast('⚠️ 请选择列表排列模式再选择批量选课');
                    } else {
                        showPanel();
                    }
                };

                const computedStyle = window.getComputedStyle(refBtn);
                if (computedStyle.float === 'right') {
                    toolbar.appendChild(newBtn);
                } else {
                    toolbar.insertBefore(newBtn, toolbar.firstChild);
                }
            }
        };

        setTimeout(injectBtn, 1000);
        setTimeout(injectBtn, 2500);


        const mask = document.createElement('div');
        mask.id = 'buyo_panel_mask';
        mask.innerHTML = `
            <div id="buyo_panel">
                <div id="buyo_header">
                    <span>😺 请勾选要添加的课程</span>
                    <span style="cursor:pointer;font-size:20px;" onclick="document.getElementById('buyo_panel_mask').style.display='none'">×</span>
                </div>
                <div id="buyo_list"></div>
                <div id="buyo_footer">
                    <span id="buyo_status" style="font-size:12px;color:#888;"></span>
                    <div><button class="buyo-btn buyo-btn-close" onclick="document.getElementById('buyo_panel_mask').style.display='none'">取消</button> <button class="buyo-btn buyo-btn-go" id="buyo_start_btn">开始挂课</button></div>
                </div>
            </div>
        `;
        document.body.appendChild(mask);

        function showPanel() {
            const links = Array.from(document.querySelectorAll('a')).filter(a => {
                const h = a.getAttribute('href') || '';
                if(h.includes('login') || h.includes('logout') || h.includes('#')) return false;
                return (h.includes('projectId') || h.includes('course.jsp') || h.includes('View.jsp')) && a.innerText.trim().length > 5;
            });

            const unique = new Map();
            links.forEach(a => {
                if (!unique.has(a.href)) unique.set(a.href, a.innerText.trim());
            });

            if (unique.size === 0) return showToast('⚠️ 未在此页面扫描到课程链接');

            const listDiv = document.getElementById('buyo_list');
            listDiv.innerHTML = '<div style="padding:8px;border-bottom:1px dashed #ddd;font-size:12px;"><span id="sel_all" style="cursor:pointer">✅全选</span> <span id="sel_none" style="cursor:pointer">⬜清空</span></div>';

            unique.forEach((text, href) => {
                const item = document.createElement('div');
                item.className = 'buyo-item';
                item.innerHTML = `<input type="checkbox" value="${href}" checked> <label title="${text}">${text}</label>`;
                listDiv.appendChild(item);
            });

            document.getElementById('sel_all').onclick = () => listDiv.querySelectorAll('input').forEach(i => i.checked = true);
            document.getElementById('sel_none').onclick = () => listDiv.querySelectorAll('input').forEach(i => i.checked = false);
            document.getElementById('buyo_panel_mask').style.display = 'block';
            document.getElementById('buyo_status').innerText = `共 ${unique.size} 个课程`;
            document.getElementById('buyo_status').style.color = '#888';
        }

        document.getElementById('buyo_start_btn').onclick = () => {
            const checked = document.querySelectorAll('#buyo_list input:checked');
            if(checked.length === 0) {
                const status = document.getElementById('buyo_status');
                status.innerText = '⚠️ 请至少勾选一个课程！';
                status.style.color = 'red';
                return;
            }

            const urls = Array.from(checked).map(c => c.value);

            document.getElementById('buyo_panel_mask').style.display = 'none';
            showToast(`🚀 已启动 ${urls.length} 个任务...`);

            let i = 0;
            const openNext = () => {
                if (i >= urls.length) return;
                let url = urls[i];
                url += (url.includes('?') ? '&' : '?') + 'auto_handle=true';
                window.open(url, '_blank');
                i++;
                setTimeout(openNext, CONFIG.scanInterval);
            };
            openNext();
        };
    }

})();