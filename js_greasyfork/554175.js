// ==UserScript==
// @name         复制授权拦截器
// @namespace    https://viayoo.com/
// @version      3.28
// @description  复制必弹窗，2次允许后开始自由复制，3次拒绝永久禁用(变灰，点击灰点恢复变红)，点击小红点恢复，红绿切换自由复制。
// @author       Aloazny & Deepseek
// @match        *://*/*
// @run-at       document-start
// @icon       data:image/png;base64,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
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/554175/%E5%A4%8D%E5%88%B6%E6%8E%88%E6%9D%83%E6%8B%A6%E6%88%AA%E5%99%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/554175/%E5%A4%8D%E5%88%B6%E6%8E%88%E6%9D%83%E6%8B%A6%E6%88%AA%E5%99%A8.meta.js
// ==/UserScript==

(function () {
    const KEY = 'copyAuth:v3'; if (window[KEY]) return; window[KEY] = true;
    let denyCount = 0, allowCount = 0, enabled = true, freeCopyMode = false, isShowingModal = false;
    const MAX_DENY = 3, AUTO_FREE_AFTER_ALLOW = 2, COPY_TIME_THRESHOLD = 1000, COPY_COUNT_THRESHOLD = 3;
    let copyRecords = [], dot = null, hideTimer = null;
    const originalExec = document.execCommand;
    const origWriteText = navigator.clipboard?.writeText;
    const origWrite = navigator.clipboard?.write;

    const disableAllCopyAPIs = () => {
        const emptyFunc = () => false;
        const emptyPromise = () => Promise.reject('复制功能已被永久禁用');

        Object.defineProperty(document, 'execCommand', {
            value: emptyFunc,
            writable: false,
            configurable: false
        });

        if (navigator.clipboard) {
            Object.defineProperty(navigator.clipboard, 'writeText', {
                value: emptyPromise,
                writable: false,
                configurable: false
            });
            if (navigator.clipboard.write) {
                Object.defineProperty(navigator.clipboard, 'write', {
                    value: emptyPromise,
                    writable: false,
                    configurable: false
                });
            }
        }

        setInterval(() => {
            document.execCommand = emptyFunc;
            if (navigator.clipboard) {
                navigator.clipboard.writeText = emptyPromise;
                navigator.clipboard.write = emptyPromise;
            }
        }, 800);
    };

    const showToast = (msg) => {
        if (window.via && typeof window.via.toast === 'function') {
            window.via.toast(msg);
        } else {
            const t = document.createElement('div');
            t.textContent = msg;
            t.style.cssText = 'position:fixed;top:50%;left:50%;transform:translate(-50%,-50%);background:rgba(0,0,0,.8);color:white;padding:12px 20px;border-radius:8px;z-index:2147483647;font-size:14px;';
            document.body.appendChild(t);
            setTimeout(() => t.remove(), 2000);
        }
    };

    const showConfirm = (msg, txt = '') => {
        if (isShowingModal) return Promise.resolve(false);
        return new Promise(r => { isShowingModal = true;
            const modal = document.createElement('div'), dialog = document.createElement('div'), title = document.createElement('h3'), pre = document.createElement('div'), btns = document.createElement('div'), allow = document.createElement('button'), deny = document.createElement('button');
            modal.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,.5);display:flex;align-items:center;justify-content:center;z-index:2147483647;font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,sans-serif;backdrop-filter:blur(8px);padding:16px;box-sizing:border-box;';
            dialog.style.cssText = 'background:rgba(255,255,255,.94);border-radius:18px;width:88vw;max-width:420px;text-align:center;box-shadow:0 12px 40px rgba(0,0,0,.25);display:flex;flex-direction:column;gap:16px;border:1px solid rgba(0,0,0,.06);overflow:hidden;';
            title.style.cssText = 'margin:0;padding:0 20px;font-size:18px;font-weight:700;color:#111;line-height:1.3;';
            pre.style.cssText = 'margin:0 20px;padding:14px;background:#f8f8f8;border-radius:12px;font-family:monospace;font-size:13px;color:#111;max-height:140px;overflow:auto;word-break:break-all;display:' + (txt?'block':'none') + ';line-height:1.4;';
            btns.style.cssText = 'display:flex;gap:12px;margin:0 20px;padding-bottom:8px;';
            allow.style.cssText = 'flex:1;height:48px;border:none;border-radius:14px;background:#007AFF;color:#fff;font-size:16px;font-weight:600;cursor:pointer;box-shadow:0 4px 14px rgba(0,122,255,.35);transition:transform .12s;';
            deny.style.cssText = 'flex:1;height:48px;border:none;border-radius:14px;background:#FF3B30;color:#fff;font-size:16px;font-weight:600;cursor:pointer;box-shadow:0 4px 14px rgba(255,59,48,.35);transition:transform .12s;';
            title.textContent = msg; pre.textContent = txt.slice(0,200)+(txt.length>200?'...':''); allow.textContent='允许'; deny.textContent='拒绝';
            allow.onclick = () => { clean(); r(true); };
            deny.onclick = () => { clean(); r(false); };
            modal.onclick = e => e.target===modal && deny.onclick();
            const clean = () => { modal.remove(); isShowingModal = false; };
            ['touchstart','mousedown'].forEach(ev => {
                allow.addEventListener(ev, () => allow.style.transform = 'translateY(1px)', {passive:true});
                deny.addEventListener(ev, () => deny.style.transform = 'translateY(1px)', {passive:true});
                document.addEventListener(ev==='touchstart'?'touchend':'mouseup', () => { allow.style.transform = deny.style.transform = ''; }, {once:true, passive:true});
            });
            dialog.append(title, pre, btns); btns.append(deny, allow); modal.appendChild(dialog); document.body.appendChild(modal); allow.focus();
        });
    };

    const updateDot = () => { if (!dot) return; dot.style.backgroundColor = freeCopyMode ? '#34C759' : (!enabled ? '#8E8E93' : '#FF3B30'); };

    const showDot = () => {
        if (dot) { clearTimeout(hideTimer); return; }
        dot = document.createElement('div');
        dot.style.cssText = 'position:fixed;bottom:45%;right:10px;width:20px;height:20px;border-radius:10px;background:#FF3B30;z-index:2147483647;opacity:0;transform:scale(0);border:2px solid #fff;box-shadow:0 2px 8px rgba(0,0,0,.3);transition:all .3s cubic-bezier(0.34,1.56,0.64,1);cursor:pointer;touch-action:none;';
        document.body.appendChild(dot);
        requestAnimationFrame(() => { dot.style.opacity = '.8'; dot.style.transform = 'scale(1)'; });
        updateDot();
        let taps = 0, timer = null;
        const handleTap = () => {
            taps++; clearTimeout(timer);
            timer = setTimeout(() => {
                if (taps === 1) {
                    if (enabled && !freeCopyMode) { freeCopyMode = true; enabled = true; updateDot(); }
                    else if (freeCopyMode) { freeCopyMode = false; updateDot(); }
                    else { enabled = true; denyCount = 0; updateDot(); }
                } else if (taps === 2) { freeCopyMode = enabled = true; denyCount = 0; updateDot(); }
                taps = 0;
            }, 300);
        };
        dot.onclick = handleTap; dot.ontouchstart = e => { e.preventDefault(); handleTap(); };
    };

    const tryAutoFreeOnAllow = () => { allowCount++; if (allowCount >= AUTO_FREE_AFTER_ALLOW && !freeCopyMode) { freeCopyMode = true; enabled = true; if (dot) updateDot(); } };

    const hideDotIfNeeded = () => {
        if (!dot) return; clearTimeout(hideTimer);
        if (freeCopyMode || !enabled) return;
        hideTimer = setTimeout(() => { if (dot) { dot.remove(); dot = null; } }, 3000);
    };

    const recordCopy = (method) => {
        const now = Date.now();
        copyRecords.push({ timestamp: now, method });

        copyRecords = copyRecords.filter(r => now - r.timestamp <= COPY_TIME_THRESHOLD);

        if (copyRecords.length >= COPY_COUNT_THRESHOLD) {
            enabled = false;
            updateDot();
            copyRecords = [];
            disableAllCopyAPIs();
            showToast('检测到恶意复制行为，复制功能已被永久禁用');
            return false;
        }
        return true;
    };

    const hookAPI = () => {
        if (origWriteText) navigator.clipboard.writeText = txt => new Promise((res, rej) => {
            if (!recordCopy('writeText')) return rej(new Error('恶意复制已被阻止'));
            if (freeCopyMode) return origWriteText.call(navigator.clipboard, txt).then(res).catch(rej);
            if (!enabled || denyCount >= MAX_DENY) return rej();
            showDot();
            showConfirm('允许复制内容？', txt).then(ok => {
                if (ok) { origWriteText.call(navigator.clipboard, txt).then(res).catch(rej); tryAutoFreeOnAllow(); }
                else { denyCount++; if (denyCount >= MAX_DENY) { enabled = false; updateDot(); disableAllCopyAPIs(); } rej(new Error('用户拒绝复制')); }
                hideDotIfNeeded();
            });
        });

        if (origWrite) navigator.clipboard.write = data => new Promise((res, rej) => {
            if (!recordCopy('write')) return rej(new Error('恶意复制已被阻止'));
            if (freeCopyMode) return origWrite.call(navigator.clipboard, data).then(res).catch(rej);
            if (!enabled || denyCount >= MAX_DENY) return rej();
            const txt = data[0]?.type === 'text/plain' ? data[0].getData('text/plain') : '';
            showDot();
            showConfirm('允许复制内容？', txt).then(ok => {
                if (ok) { origWrite.call(navigator.clipboard, data).then(res).catch(rej); tryAutoFreeOnAllow(); }
                else { denyCount++; if (denyCount >= MAX_DENY) { enabled = false; updateDot(); disableAllCopyAPIs(); } rej(new Error('用户拒绝复制')); }
                hideDotIfNeeded();
            });
        });
    };

    const hookExec = () => {
        document.execCommand = (cmd, ui, val) => {
            if (cmd === 'copy') {
                if (!recordCopy('execCommand')) return false;
                if (freeCopyMode) return originalExec.call(document, cmd, ui, val);
                if (!enabled || denyCount >= MAX_DENY) return false;
                const sel = window.getSelection().toString();
                if (!sel) return originalExec.apply(document, arguments);
                showDot();
                showConfirm('允许复制内容？', sel).then(ok => {
                    if (ok) { 
                        const ta = document.createElement('textarea'); 
                        ta.value = sel; ta.style = 'position:fixed;opacity:0;'; 
                        document.body.appendChild(ta); ta.select(); 
                        originalExec.call(document, 'copy'); 
                        ta.remove(); 
                        tryAutoFreeOnAllow(); 
                    } else { 
                        denyCount++; 
                        if (denyCount >= MAX_DENY) { enabled = false; updateDot(); disableAllCopyAPIs(); } 
                    }
                    hideDotIfNeeded();
                });
                return false;
            }
            return originalExec.apply(document, arguments);
        };
    };

    const setupFrame = iframe => {
        try {
            const doc = iframe.contentDocument; if (!doc) return;
            const win = doc.defaultView; if (!win) return;
            const frameOrigExec = doc.execCommand;
            doc.execCommand = (cmd, ui, val) => {
                if (cmd === 'copy') {
                    if (!recordCopy('frameExecCommand')) return false;
                    if (freeCopyMode) return frameOrigExec.call(doc, cmd, ui, val);
                    if (!enabled || denyCount >= MAX_DENY) return false;
                    const sel = win.getSelection().toString();
                    if (!sel) return frameOrigExec.apply(doc, arguments);
                    showDot();
                    showConfirm('允许复制内容？', sel).then(ok => {
                        if (ok) {
                            const ta = doc.createElement('textarea');
                            ta.value = sel; ta.style = 'position:fixed;opacity:0;';
                            doc.body.appendChild(ta); ta.select();
                            frameOrigExec.call(doc, 'copy');
                            ta.remove();
                            tryAutoFreeOnAllow();
                        } else {
                            denyCount++;
                            if (denyCount >= MAX_DENY) { enabled = false; updateDot(); disableAllCopyAPIs(); }
                        }
                        hideDotIfNeeded();
                    });
                    return false;
                }
                return frameOrigExec.apply(doc, arguments);
            };
        } catch(e) {}
    };

    const obs = new MutationObserver(m => {
        for (const r of m) for (const n of r.addedNodes)
            if (n.nodeType === 1 && n.tagName === 'IFRAME') setupFrame(n);
    });
    obs.observe(document.documentElement, { childList: true, subtree: true });
    document.querySelectorAll('iframe').forEach(setupFrame);

    const init = () => { hookAPI(); hookExec(); };
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => setTimeout(init, 0));
    } else {
        setTimeout(init, 0);
    }

    const prot = setInterval(() => {
        if (navigator.clipboard && navigator.clipboard.writeText === origWriteText) hookAPI();
        if (document.execCommand === originalExec) hookExec();
    }, 1000);
    window.addEventListener('beforeunload', () => clearInterval(prot));
})();