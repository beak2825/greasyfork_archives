// ==UserScript==
// @name         小說朗讀助手
// @namespace    http://tampermonkey.net/
// @version      5.8
// @description  自動朗讀小說，支援跨域同步、實體化反白、點擊跳轉。針對筆趣閣等網站進行極致過濾，解決標題重複及廣告干擾問題。
// @author       Antigravity
// @license      MIT
// @match        *://*/*
// @match        https://*.linovelib.com/novel/*/*.html
// @match        https://*.biquge.com/*
// @match        https://*.biquuge.com/*
// @match        https://*.bqg.org/*
// @match        https://*.69shuba.cx/*
// @match        https://*.wa01.com/novel/pagea/*.html
// @match        https://*.ttkan.co/novel/pagea/*.html
// @match        https://ttk.tw/novel/chapters/*/*.html
// @match        https://czbooks.net/n/*/*
// @match        https://www.wenku8.net/novel/*/*/*.htm
// @match        https://mp.weixin.qq.com/*
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_addValueChangeListener
// @downloadURL https://update.greasyfork.org/scripts/556798/%E5%B0%8F%E8%AA%AA%E6%9C%97%E8%AE%80%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/556798/%E5%B0%8F%E8%AA%AA%E6%9C%97%E8%AE%80%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==
(function() {
    'use strict';
    // --- 1. 網站專屬設定 ---
    const siteConfig = {
        "linovelib.com": { selector: "#acontent, .read-content", clean: ['.run-text', '.img_box', '.div-img'] },
        "wa01.com": { selector: ".content" },
        "ttkan.co": { selector: ".content" },
        "ttk.tw": { selector: ".content" },
        "czbooks.net": { selector: ".content" },
        "wenku8.net": { selector: "#content" },
        "qq.com": { selector: "#js_content" },
        "69shuba": { selector: ".txtnav" },
        "biqu": { 
            selector: "#content, #htmlContent, .content", 
            clean: ['.bottem1', '.bottem2', '.bookname', '.read_app', '#app_read', '.footer', '.header', '.navbar', 'script', 'style', '.ads', '.divimage', 'h1'] 
        },
        "bqg": { 
            selector: "#content", 
            clean: ['.bottem1', '.bottem2', '.bookname'] 
        }
    };
    // --- 2. 智慧判斷 ---
    const isNovelPage = () => {
        const url = window.location.href;
        if (url.includes('fanqienovel.com')) return false;
        for (let domain in siteConfig) { if (url.includes(domain)) return true; }
        if (url.match(/(chapter|read|html|\d+\/\d+)/)) {
            if (document.body.innerText.includes('下一章') || document.body.innerText.includes('下一页') || document.body.innerText.includes('下一頁')) {
                return true;
            }
        }
        return false;
    };
    if (!isNovelPage()) return;
    if (document.getElementById('tts-overlay')) return;
    // --- 3. 注入 CSS ---
    const style = document.createElement('style');
    style.textContent = `
        .tts-sentence { cursor: pointer; transition: background-color 0.2s; border-radius: 3px; }
        .tts-sentence:hover { background-color: #e3f2fd; }
        .tts-active { background-color: #fff9c4 !important; color: #d50000 !important; font-weight: bold; box-shadow: 0 0 5px rgba(255, 193, 7, 0.5); }
    `;
    document.head.appendChild(style);
    const savedRate = localStorage.getItem('tts-rate') || '1.2';
    // --- 4. 介面構建 ---
    const overlay = document.createElement('div');
    overlay.id = 'tts-overlay';
    overlay.style.cssText = `
        position: fixed; bottom: 20px; right: 20px; width: 50px; height: 50px;
        background: #2196f3; border-radius: 25px; box-shadow: 0 4px 12px rgba(0,0,0,0.3);
        z-index: 99999; display: flex; align-items: center; justify-content: center;
        color: white; font-size: 24px; cursor: pointer; transition: all 0.3s;
    `;
    overlay.innerHTML = '🎧';
    document.body.appendChild(overlay);
    const panel = document.createElement('div');
    panel.id = 'tts-panel';
    panel.style.cssText = `
        position: fixed; bottom: 80px; right: 20px; width: 300px; background: white;
        padding: 15px; border-radius: 10px; box-shadow: 0 4px 20px rgba(0,0,0,0.2);
        z-index: 99999; display: none; font-family: -apple-system, system-ui;
    `;
    panel.innerHTML = `
        <div style="display:flex;justify-content:space-between;margin-bottom:15px;">
            <h3 style="margin:0;font-size:16px;">朗讀控制</h3>
            <span id="tts-status" style="font-size:12px;color:#666;">準備就緒</span>
        </div>
        <div style="margin-bottom:15px;">
            <div style="display:flex;justify-content:space-between;margin-bottom:5px;">
                <span style="font-size:14px;">進度</span>
                <span id="tts-progress-val" style="font-size:14px;">0%</span>
            </div>
            <input type="range" id="tts-progress" min="0" max="100" value="0" style="width:100%; cursor: pointer;">
        </div>
        <div style="display:flex;gap:10px;margin-bottom:15px;">
            <button id="tts-play" style="flex:1;padding:10px;background:#2196f3;color:white;border:none;border-radius:8px;font-size:16px;">▶ 播放</button>
            <button id="tts-pause" style="flex:1;padding:10px;background:#f5f5f5;color:#333;border:none;border-radius:8px;font-size:16px;">⏸ 暫停</button>
        </div>
        <div style="margin-bottom:10px;">
            <div style="display:flex;justify-content:space-between;margin-bottom:5px;">
                <span style="font-size:14px;">語速</span>
                <span id="tts-rate-val" style="font-size:14px;">${savedRate}x</span>
            </div>
            <input type="range" id="tts-rate" min="0.5" max="2" step="0.1" value="${savedRate}" style="width:100%">
        </div>
        <label style="display:flex;align-items:center;gap:8px;font-size:14px;">
            <input type="checkbox" id="tts-auto-next" checked> 自動翻頁播放
        </label>
        <label style="display:flex;align-items:center;gap:8px;font-size:14px;margin-top:5px;">
            <input type="checkbox" id="tts-auto-scroll" checked> 自動捲動畫面
        </label>
    `;
    document.body.appendChild(panel);
    let synth = window.speechSynthesis;
    let utterance = null;
    let idx = 0;
    let isPlaying = false;
    let isDragging = false;
    let playlistElements = []; 
    const tabId = Math.random().toString(36).substr(2, 9);
    GM_addValueChangeListener('tts_active_tab', function(name, oldVal, newVal, remote) {
        if (newVal !== tabId && isPlaying) {
            stopPlayback(true);
        }
    });
    overlay.onclick = () => {
        panel.style.display = panel.style.display === 'none' ? 'block' : 'none';
    };
    // --- 5. 核心：內容處理 ---
    function prepareContent() {
        playlistElements = [];
        let contentElement = null;
        let config = null;
        const url = window.location.href;
        for (let domain in siteConfig) {
            if (url.includes(domain)) {
                config = siteConfig[domain];
                const selectors = config.selector.split(', ');
                for (let sel of selectors) {
                    let el = document.querySelector(sel);
                    if (el) { contentElement = el; break; }
                }
                break;
            }
        }
        if (!contentElement) {
            const commonSelectors = ['#content', '#chaptercontent', '.read-content', '.novel-content', '#BookText', '.txtnav', '#text', '.entry-content', '#acontent'];
            for (let sel of commonSelectors) {
                let el = document.querySelector(sel);
                if (el && el.innerText.length > 200) { contentElement = el; break; }
            }
        }
        
        if (!contentElement) contentElement = document.body;
        if (config && config.clean) {
            config.clean.forEach(sel => contentElement.querySelectorAll(sel).forEach(el => el.remove()));
        }
        contentElement.querySelectorAll('script, style, noscript, iframe, .ads, .advertisement').forEach(el => el.remove());
        const walker = document.createTreeWalker(contentElement, NodeFilter.SHOW_TEXT, {
            acceptNode: function(node) {
                if (!node.nodeValue.trim()) return NodeFilter.FILTER_REJECT;
                const parent = node.parentElement;
                if (['script', 'style', 'noscript', 'iframe'].includes(parent.tagName.toLowerCase())) return NodeFilter.FILTER_REJECT;
                if (parent.classList.contains('tts-sentence')) return NodeFilter.FILTER_REJECT;
                if (parent.closest('#tts-overlay') || parent.closest('#tts-panel')) return NodeFilter.FILTER_REJECT;
                return NodeFilter.FILTER_ACCEPT;
            }
        }, false);
        const nodesToProcess = [];
        let currentNode;
        while (currentNode = walker.nextNode()) nodesToProcess.push(currentNode);
        const filterKeywords = [
            '上一章', '下一章', '返回目录', '加入书签', '推荐本书', '章节错误', 'Copyright', 
            'All rights reserved', '下载APP', '广告', '手机阅读', '追看新章节', '下载本站客户端',
            '本站所有收录', '网站地图', '存书签', '换手', '关灯', '字体', '登录', '注册',
            '首页', '玄幻', '武侠', '都市', '历史', '网游', '科幻', '言情', '排行', '完本',
            '笔趣阁', '搜索', '其他', '目录'
        ];
        let lastText = "";
        const pageTitle = document.title.replace(/[\s\-_].*$/, '').trim();
        nodesToProcess.forEach(node => {
            const text = node.nodeValue;
            let skip = false;
            
            for (let k of filterKeywords) { 
                if (text.includes(k)) { 
                    skip = true; 
                    break; 
                } 
            }
            
            if (skip || /第\s*[\(\（]\s*\d+\s*[\/\\]\s*\d+\s*[\)\）]\s*页/.test(text)) return;
            if (/^[\s\d\.\-\_\|]+$/.test(text)) return;
            const sentences = text.split(/([。！？；\n]+)/);
            const fragment = document.createDocumentFragment();
            let hasContent = false;
            
            for (let i = 0; i < sentences.length; i++) {
                const part = sentences[i].trim();
                if (!part) continue;
                if (part === lastText) continue;
                
                if (playlistElements.length < 3 && (part.includes(pageTitle) || pageTitle.includes(part))) {
                    continue;
                }
                
                const span = document.createElement('span');
                span.className = 'tts-sentence';
                span.textContent = sentences[i]; 
                span.onclick = (e) => {
                    e.stopPropagation();
                    const index = playlistElements.indexOf(span);
                    if (index !== -1) {
                        idx = index;
                        if (isPlaying) { synth.cancel(); speakNext(); } else { play(); }
                    }
                };
                fragment.appendChild(span);
                
                if (part.length > 1 && !/^[。！？；\n\s]+$/.test(part)) {
                    playlistElements.push(span);
                    lastText = part;
                    hasContent = true;
                }
            }
            if (hasContent) node.parentNode.replaceChild(fragment, node);
        });
    }
    function clearHighlight() {
        document.querySelectorAll('.tts-active').forEach(el => el.classList.remove('tts-active'));
    }
    function highlightAndScroll(element) {
        clearHighlight();
        if (element) {
            element.classList.add('tts-active');
            if (document.getElementById('tts-auto-scroll').checked) {
                element.scrollIntoView({behavior: "smooth", block: "center"});
            }
        }
    }
    function stopPlayback(isExternal = false) {
        isPlaying = false;
        synth.cancel();
        updateUI(false);
        clearHighlight();
        if (isExternal) {
            document.getElementById('tts-status').innerText = '已由其他分頁接手';
        }
    }
    function play() {
        if(isPlaying) return;
        GM_setValue('tts_active_tab', tabId);
        synth.cancel();
        
        if (playlistElements.length === 0 || !document.body.contains(playlistElements[0])) {
            prepareContent();
        }
        
        if (playlistElements.length === 0) { 
            document.getElementById('tts-status').innerText = '內容載入中...';
            setTimeout(play, 1000);
            return; 
        }
        const progress = document.getElementById('tts-progress');
        progress.max = playlistElements.length - 1;
        progress.value = idx;
        
        isPlaying = true;
        updateUI(true);
        setTimeout(speakNext, 100);
    }
    function speakNext() {
        if(!isPlaying) return;
        if (GM_getValue('tts_active_tab') !== tabId) {
            stopPlayback(true);
            return;
        }
        
        if(idx >= playlistElements.length) {
            document.getElementById('tts-status').innerText = '本章結束';
            clearHighlight();
            if(document.getElementById('tts-auto-next').checked) {
                goToNextChapter();
            } else {
                isPlaying = false;
                updateUI(false);
            }
            return;
        }
        if (!isDragging) {
            const progress = document.getElementById('tts-progress');
            progress.value = idx;
            const percent = Math.round((idx / playlistElements.length) * 100);
            document.getElementById('tts-progress-val').innerText = percent + '%';
            document.getElementById('tts-status').innerText = `朗讀中 ${percent}%`;
        }
        const element = playlistElements[idx];
        const text = element.textContent;
        highlightAndScroll(element);
        utterance = new SpeechSynthesisUtterance(text);
        utterance.rate = document.getElementById('tts-rate').value;
        utterance.lang = 'zh-TW';
        
        utterance.onend = () => { if (isPlaying) { idx++; speakNext(); } };
        utterance.onerror = (e) => { if(isPlaying && e.error !== 'interrupted') { idx++; speakNext(); } };
        synth.speak(utterance);
    }
    function goToNextChapter() {
        document.getElementById('tts-status').innerText = '正在跳轉...';
        const links = document.querySelectorAll('a');
        let nextLink = null;
        for(let link of links) {
            const t = link.innerText;
            if(t.includes('下一章') || t.includes('下一页') || t.includes('下一頁') || (t.toLowerCase().includes('next') && t.length < 10)) {
                nextLink = link;
                break;
            }
        }
        if (!nextLink) {
            const nextBtn = document.querySelector('.next-chapter') || document.querySelector('#next_url');
            if (nextBtn) nextLink = nextBtn;
        }
        if (nextLink) {
            localStorage.setItem('tts-autoplay', 'true');
            nextLink.click();
        } else {
            alert('找不到下一章連結');
            isPlaying = false;
            updateUI(false);
        }
    }
    function updateUI(playing) {
        const playBtn = document.getElementById('tts-play');
        const pauseBtn = document.getElementById('tts-pause');
        if(playing) {
            playBtn.style.background = '#4caf50';
            playBtn.innerText = '朗讀中';
            pauseBtn.innerText = '⏸ 暫停';
        } else {
            playBtn.style.background = '#2196f3';
            playBtn.innerText = '▶ 播放';
            pauseBtn.innerText = '▶ 繼續';
        }
    }
    const progressBar = document.getElementById('tts-progress');
    progressBar.oninput = function() {
        isDragging = true;
        idx = parseInt(this.value);
        const percent = Math.round((idx / playlistElements.length) * 100);
        document.getElementById('tts-progress-val').innerText = percent + '%';
    };
    progressBar.onchange = function() {
        isDragging = false;
        idx = parseInt(this.value);
        if (isPlaying) {
            synth.cancel();
            setTimeout(() => { if (!synth.speaking) speakNext(); }, 100);
        }
    };
    document.getElementById('tts-play').onclick = play;
    document.getElementById('tts-pause').onclick = () => {
        if (isPlaying) {
            isPlaying = false;
            synth.cancel();
            updateUI(false);
        } else {
            play();
        }
    };
    document.getElementById('tts-rate').oninput = function() {
        document.getElementById('tts-rate-val').innerText = this.value + 'x';
        localStorage.setItem('tts-rate', this.value);
    };
    document.getElementById('tts-rate').onchange = function() {
        if (isPlaying) {
            synth.cancel();
            setTimeout(() => { if (!synth.speaking) speakNext(); }, 100);
        }
    };
    if(localStorage.getItem('tts-autoplay') === 'true') {
        localStorage.removeItem('tts-autoplay');
        setTimeout(() => { panel.style.display = 'block'; play(); }, 1500);
    }
})();