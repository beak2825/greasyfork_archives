// ==UserScript==
// @name         墨水屏电纸书优化
// @namespace    cc.cxuan.books
// @version      1.56
// @description  针对墨水屏的优化 适合电纸书省电 看漫画 ①可消除移动动画(松手才移动页面) ②可设置双击放大复原 ③可屏蔽长按图片弹出的菜单 ②可设置长按放大单图 ④可给底部增加半屏空白
// @match        *://*/*
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_registerMenuCommand
// @run-at       document-end
// @noframes
// @license      MIT
// @author       cxuan.cc
// @downloadURL https://update.greasyfork.org/scripts/551610/%E5%A2%A8%E6%B0%B4%E5%B1%8F%E7%94%B5%E7%BA%B8%E4%B9%A6%E4%BC%98%E5%8C%96.user.js
// @updateURL https://update.greasyfork.org/scripts/551610/%E5%A2%A8%E6%B0%B4%E5%B1%8F%E7%94%B5%E7%BA%B8%E4%B9%A6%E4%BC%98%E5%8C%96.meta.js
// ==/UserScript==
(function(){
    //全站/本域
    let useGlobalName = location.hostname + '__useGlobal';
    let useGlobal = GM_getValue(useGlobalName, true);
    function cfgKey(key){
        let prefix = useGlobal ? 'G__' : location.hostname + '__';
        return prefix + key;
    }
    function getCfg(key, def){
        return GM_getValue(cfgKey(key), def);
    }
    function setCfg(key, val){
        GM_setValue(cfgKey(key), val);
        updateAllCfg();
    }
    // 设置项
    let my;
    let mx;
    let intervalSec;
    let doubleClickZoom;
    let enableMx;
    let enableParent;
    let blockContextMenu;
    let blockContextZoom;
    let addBottomSpace;
    let autoNext;

    function updateAllCfg(){
        my = getCfg('multiplierY', 2.5);
        mx = 2.5;
        intervalSec = getCfg('interval', 0.3);
        doubleClickZoom = getCfg('doubleClickZoom', 2);
        enableMx = getCfg('enableMx', false);
        enableParent = getCfg('enableParent', false);
        blockContextMenu = getCfg('blockContextMenu', false);
        blockContextZoom = getCfg('blockContextZoom', 0); //状态0:关闭 1:再长按拖到左端 2:再长按拖到左上角
        addBottomSpace = getCfg('addBottomSpace', false);
        autoNext = getCfg('autoNext', false);
    }
    updateAllCfg();

    function updateSettings({key, value}) {
        // 更新本地变量
        setCfg(key, value);
        switch (key) {
            case 'multiplierY': break;
            case 'interval': stopTimer(); startTimer(); break;
            case 'doubleClickZoom': applyViewport(); break;
            case 'enableMx': break;
            case 'enableParent': break;
            case 'blockContextMenu': applyContextMenuBlock(); break;
            case 'blockContextZoom': applyContextMenuZoom(); break;
            case 'addBottomSpace': applyAddBottomSpace(); break;
            case 'autoNext': break;
        }
    }
    GM_registerMenuCommand(
        `切换参数作用域（当前：${useGlobal?'全站':'本域'}）`,
        ()=>{
            useGlobal = !useGlobal;
            GM_setValue(useGlobalName, useGlobal);
            alert('已切换到 ' + (useGlobal?'全站':'本域') + ' 参数');
            location.reload();
        }
    );
    GM_registerMenuCommand(`设置Y轴移动倍率（之前 ${my}）`, ()=>{
        let v = parseFloat(prompt('Y 轴滑动倍率:', my));
        if (!isNaN(v)) {
            updateSettings({key:'multiplierY', value:v});
            alert(`设置Y轴移动倍率（当前 ${v}）`);
        }
    });
    GM_registerMenuCommand(`设置更新间隔（之前 ${intervalSec}s）`, ()=>{
        let v = parseFloat(prompt('更新间隔（秒，0=仅松手时刷新）:', intervalSec));
        if (!isNaN(v)) {
            updateSettings({key:'interval', value:v});
            alert(`设置更新间隔（当前 ${v}s）`);
        }
    });
    GM_registerMenuCommand(`设置双击放大倍率（之前 ${doubleClickZoom}）`, ()=>{
        let v = parseFloat(prompt('双击放大倍率（0=无双击放大）:', doubleClickZoom));
        if (!isNaN(v)) {
            updateSettings({key:'doubleClickZoom', value:v});
            alert(`设置双击放大倍率（当前 ${v}）`);
        }
    });
    GM_registerMenuCommand(`切换x轴移动优化开关 固定${mx}倍（之前 ${enableMx ? '开' : '关'}）`, ()=>{
        let v = !enableMx;
        updateSettings({key:'enableMx', value:v});
        alert(`切换x轴移动优化（当前 ${v ? '开' : '关'}）`);
    });
    GM_registerMenuCommand(`切换父元素一同滚动（之前 ${enableParent ? '开' : '关'}）`, ()=>{
        let v = !enableParent;
        updateSettings({key:'enableParent', value:v});
        alert(`切换父元素一同滚动（当前 ${v ? '开' : '关'}）`);
    });
    GM_registerMenuCommand(`切换右键菜单屏蔽（之前 ${blockContextMenu ? '开' : '关'}）`, ()=>{
        let v = !blockContextMenu;
        updateSettings({key:'blockContextMenu', value:v});
        alert(`切换右键菜单屏蔽（当前 ${v ? '开' : '关'}）`);
    });
    GM_registerMenuCommand(`切换长按图片放大（当前 ${(blockContextZoom==0)?'关':((blockContextZoom==1)?'再长按跳转左端':'再长按跳转左上角')}）`, ()=>{
        let v = (blockContextZoom + 1) % 3;
        updateSettings({key:'blockContextZoom', value:v});
        alert(`切换长按图片放大（当前 ${(v==0)?'关':((v==1)?'再长按跳转左端':'再长按跳转左上角')}）`);
    });
    GM_registerMenuCommand(`切换底部增加空白（之前 ${addBottomSpace ? '开' : '关'}）`, ()=>{
        let v = !addBottomSpace;
        updateSettings({key:'addBottomSpace', value:v});
        alert(`切换底部增加空白（当前 ${v ? '开' : '关'}）`);
    });
    GM_registerMenuCommand(`自动跳下一页（当前 ${autoNext?'开':'关'}）`,()=>{
        let v = !autoNext;
        updateSettings({key:'autoNext', value:v});
        alert(`自动跳下一页：${v?'已开启':'已关闭'}`);
    });

    //开启或禁止双指缩放
    let meta = document.querySelector('meta[name=viewport]');
    const vp = 'width=device-width, initial-scale=1, minimum-scale=0.25, maximum-scale=10, user-scalable=yes';

    const applyViewport = ()=>{
        let head = document.head || document.getElementsByTagName('head')[0] || document.documentElement;
        if(doubleClickZoom > 0){
            if (meta) {
                meta.setAttribute('content', vp);
            } else {
                meta = document.createElement('meta');
                meta.name = 'viewport';
                meta.content = vp;
                document.head.appendChild(meta);
            }
        }else{
            if (meta) {
                meta.setAttribute('content', vp);
            }
        }
        head.prepend(meta);
    };
    applyViewport();

    // 右键放大函数
    let zimg;
    let showZoomedImg = function(img, event) {
        if (zimg) {
            zimg.remove();
            zimg = null;
        }

        zimg = img.cloneNode(true);
        zimg.classList.add("ci_books_img_big");

        zimg.style.position = 'fixed';
        zimg.style.zIndex = 999999999998;
        zimg.style.pointerEvents = 'auto';
        zimg.style.maxWidth = 'none';
        zimg.style.maxHeight = 'none';

        let rect = img.getBoundingClientRect();
        let w = rect.width * doubleClickZoom;
        let h = rect.height * doubleClickZoom;
        zimg.style.width = w + 'px';
        zimg.style.height = h + 'px';

        // 计算点击点相对图片的比例
        let clickX = event.clientX - rect.left;
        let clickY = event.clientY - rect.top;

        let centerX = window.innerWidth / 2;
        let centerY = window.innerHeight / 2;

        // 让点击点移动到屏幕中心
        let left = centerX - (clickX * (w / rect.width));
        let top = centerY - (clickY * (h / rect.height));

        zimg.style.left = left + 'px';
        zimg.style.top = top + 'px';
        zimg.style.boxShadow = '0 0 20px #0009';
        zimg.style.background = '#fff';

        // 单击移除
        zimg.addEventListener('click', function(){
            zimg.remove();
            zimg = null;
        });

        // 长按逻辑
        zimg.addEventListener('contextmenu', function(e){
            if (!zimg) return;
            let w = parseInt(zimg.style.width);
            let h = parseInt(zimg.style.height);
            let l = parseInt(zimg.style.left);

            let viewportW = window.innerWidth;
            let viewportH = window.innerHeight;
            let isLeft = w + l - viewportW > - l;
            isLeft = w > viewportW ? isLeft : !isLeft;

            if (blockContextZoom === 1) {
                // 拖到左右端
                if (isLeft) {
                    // 移到右端
                    zimg.style.left = viewportW - w + 'px';
                } else {
                    // 移到左端
                    zimg.style.left = '0px';
                }
            } else if (blockContextZoom === 2) {
                // 拖到左右上角
                if (isLeft) {
                    // 移到右端
                    zimg.style.left = viewportW - w + 'px';
                } else {
                    // 移到左端
                    zimg.style.left = '0px';
                }
                zimg.style.top = '0px';
            }
            if (!blockContextMenu) return;
            if (!e.target.closest('a')) e.preventDefault();
        },true);

        zoomedImgLimit()
        document.body.appendChild(zimg);
    }

    let zoomedImgLimit = function(isY) {
        // 检查边缘
        let left = parseInt(zimg.style.left);
        let top = parseInt(zimg.style.top);
        let w = parseInt(zimg.style.width);
        let h = parseInt(zimg.style.height);
        if (w >= window.innerWidth) {
            if (left > 0) left = 0;
            if (left + w < window.innerWidth) left = window.innerWidth - w;
        }
        if (h >= window.innerHeight) {
            if (top > 0) top = 0;
            if (top + h < window.innerHeight) top = window.innerHeight - h;
        }
        zimg.style.left = left + 'px';
        if(isY) zimg.style.top = top + 'px';
    }

    let pressTimer = null;
    // 右键菜单屏蔽函数
    let contextMenuHandler = function(e) {
        if (!blockContextMenu) return;
        if (blockContextZoom !== 0 && e.target.tagName == 'IMG') return;
        if (!e.target.closest('a')) e.preventDefault();
    }
    function applyContextMenuBlock() {
        document.removeEventListener('contextmenu', contextMenuHandler, true);
        if (blockContextMenu) {
            document.addEventListener('contextmenu', contextMenuHandler, true);
        }
    }
    applyContextMenuBlock();

    // 右键放大图片
    let contextZoomHandler = function(e) {
        // 状态0关闭
        if(blockContextZoom === 0) return;
        // 要求，只处理新图
        if (e.target.tagName == 'IMG') {
            if (zimg == e.target) {
                return;
            }
            showZoomedImg(e.target, e);
        }
        if (!blockContextMenu) return;
        if (!e.target.closest('a')) e.preventDefault();
    }
    let mouseupHandler = ()=>{
        if (pressTimer) clearTimeout(pressTimer);
    }

    function applyContextMenuZoom() {
        document.removeEventListener('contextmenu', contextZoomHandler, true);
        document.removeEventListener('mouseup', mouseupHandler, true);

        if (blockContextZoom !== 0) {
            document.addEventListener('contextmenu', contextZoomHandler, true);
            document.addEventListener('mouseup', mouseupHandler, true);
        }
    }
    applyContextMenuZoom();

    //底部增加空白
    function applyAddBottomSpace() {
        let id = 'ci-bottom-space-extension';
        if (addBottomSpace) {
            if (!document.getElementById(id)) {
                let div = document.createElement('div');
                div.id = id;
                div.style.height = '50vh';
                div.style.width = '100%';
                div.style.pointerEvents = 'none';
                document.body.appendChild(div);
            }
        } else {
            let oldDiv = document.getElementById(id);
            if (oldDiv) oldDiv.remove();
        }
    }
    applyAddBottomSpace();

    // 底部跳转下一页
    let loadingNext = false;
    window.addEventListener('scroll', ()=>{
        if (!autoNext || loadingNext) return;

        if (window.innerHeight + window.scrollY < document.body.scrollHeight - 50) return;

        let re = /下一[页章节话頁章節畫話]/;
        let els = [...document.querySelectorAll('a,button')];
        let nextEl = els.find(el => re.test(el.textContent.trim()));
        if (nextEl) {
            loadingNext = true;
            let url = nextEl.href || nextEl.getAttribute('data-href') || '';
            if (url) location.href = url;
        }
    });

    const touchMap = {}; // id -> { sx, sy, cx, cy, el, lastDx, lastDy }
    let timerId = null;

    //跳过移动动画
    function periodicUpdate() {
        for (let id in touchMap) {
            const info = touchMap[id];
            if (info.cx == null || info.cy == null) continue;
            let totalDx = (info.sx - info.cx) * mx;
            let totalDy = (info.sy - info.cy) * my;
            let dX = totalDx - (info.lastDx || 0);
            let dY = totalDy - (info.lastDy || 0);
            if(zimg){
                if (dY) dY = dY / my;
                let left = parseInt(zimg.style.left);
                let top = parseInt(zimg.style.top);
                if (dX) zimg.style.left = left - dX * doubleClickZoom + 'px';
                if (dY) zimg.style.top = top - dY * doubleClickZoom + 'px';
                zoomedImgLimit()
            }
            if (enableParent) {
                let node = info.el;
                while (node) {
                    if(zimg == node) continue;
                    if (dX) node.scrollLeft += dX;
                    if (dY) node.scrollTop += dY;
                    node = node.parentNode;
                }
            } else {
                if (dX) info.el.scrollLeft += dX;
                if (dY) info.el.scrollTop += dY;
            }
            info.lastDx = totalDx;
            info.lastDy = totalDy;
        }
    }
    function startTimer(){
        if (intervalSec > 0 && !timerId) {
            timerId = setInterval(periodicUpdate, intervalSec * 1000);
        }
    }
    function stopTimer(){
        if (timerId) {
            clearInterval(timerId);
            timerId = null;
        }
    }

    document.addEventListener('touchstart', e=>{
        if (e.touches.length > 1) return;
        for (const t of e.changedTouches) {
            let el = t.target;
            while (el && el !== document) {
                const style = getComputedStyle(el);
                const canScrollY = el.scrollHeight > el.clientHeight && /auto|scroll/.test(style.overflowY);
                const canScrollX = el.scrollWidth > el.clientWidth && /auto|scroll/.test(style.overflowX);
                if (canScrollY || canScrollX) break;
                el = el.parentNode;
            }
            if (!el || el === document) {
                el = document.scrollingElement || document.documentElement;
            }
            touchMap[t.identifier] = {
                sx: t.clientX, sy: t.clientY,
                cx: t.clientX, cy: t.clientY,
                el,
                lastDx: 0, lastDy: 0
            };
        }
        startTimer();
    }, { passive:false });

    document.addEventListener('touchmove', e=>{
        if (e.touches.length > 1) return;
        let doPrevent = false;
        for (const t of e.changedTouches) {
            const info = touchMap[t.identifier];
            if (!info) continue;
            info.cx = t.clientX;
            info.cy = t.clientY;
            // 允许顶部下拉刷新
            if (!(info.el === (document.scrollingElement || document.documentElement)
                  && info.el.scrollTop === 0
                  && (t.clientY - info.sy) > 0)) {
                doPrevent = true;
            }
            // 主要横向移动
            if(!enableMx){
                if (Math.abs(info.cx - info.sx) > Math.abs(info.cy - info.sy) * 2){
                    doPrevent = false;
                }
            }
        }
        if (doPrevent) e.preventDefault();
    }, { passive:false });

    function finishTouch(e) {
        if (e.touches.length > 1) return;
        for (const t of e.changedTouches) {
            const info = touchMap[t.identifier];
            if (!info) continue;
            if (intervalSec === 0) {
                let dx = (info.sx - t.clientX) * mx;
                let dy = (info.sy - t.clientY) * my;
                info.el.scrollLeft += dx;
                info.el.scrollTop += dy;
            } else {
                info.cx = t.clientX;
                info.cy = t.clientY;
                periodicUpdate();
            }
            delete touchMap[t.identifier];
        }
        if (Object.keys(touchMap).length === 0) stopTimer();
    }
    document.addEventListener('touchend', finishTouch, { passive:false });
    document.addEventListener('touchcancel', finishTouch, { passive:false });

    // 用 viewport 实现双击放大
    let isDoubleClickZoomBig = false;
    let lastTap = 0;
    let lastTapX = 0, lastTapY = 0;
    let moved = false;
    let moveDist = 0;
    const DOUBLE_CLICK_TIMEOUT = 300;
    const MOVE_DIST_MAX = 20;

    document.addEventListener('touchstart', e => {
        if (e.touches.length === 1) {
            const now = Date.now();
            if (now - lastTap >= DOUBLE_CLICK_TIMEOUT){
                moved = false;
                moveDist = 0;
                lastTapX = e.touches[0].clientX;
                lastTapY = e.touches[0].clientY;
            }
        }
    },{passive:true});

    document.addEventListener('touchmove', e => {
        if (e.touches.length === 1) {
            // 计算与初始按下点距离
            let dx = e.touches[0].clientX - lastTapX;
            let dy = e.touches[0].clientY - lastTapY;
            moveDist += Math.sqrt(dx*dx + dy*dy);
            // 如果拖动太多，不当作双击
            if (moveDist > MOVE_DIST_MAX) {
                moved = true;
            }
        }
    },{passive:true});

    document.addEventListener('touchend', e => {
        if (doubleClickZoom == 0) return;
        if (e.touches.length === 0 && e.changedTouches.length === 1) {
            const now = Date.now();
            const x = e.changedTouches[0].clientX, y = e.changedTouches[0].clientY;
            // 距离判断
            let dist = Math.sqrt((x - lastTapX) ** 2 + (y - lastTapY) ** 2);
            if ((now - lastTap < DOUBLE_CLICK_TIMEOUT) && dist < MOVE_DIST_MAX && !moved) {
                // 修改或插入 viewport
                let meta = document.querySelector('meta[name=viewport]');
                isDoubleClickZoomBig = !isDoubleClickZoomBig;
                const vp = `width=device-width, initial-scale=${isDoubleClickZoomBig ? doubleClickZoom : 1}, maximum-scale=10`;
                if (meta) {
                    meta.setAttribute('content', vp);
                } else {
                    meta = document.createElement('meta');
                    meta.name = 'viewport';
                    meta.content = vp;
                    document.head.appendChild(meta);
                }
            }
            lastTap = now;
            moveDist = 0;
        }
    }, { passive:true });

})();