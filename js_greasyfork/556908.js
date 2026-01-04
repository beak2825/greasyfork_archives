// ==UserScript==
// @name         综资肆意编辑
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  释放综资系统编辑功能
// @author       moonscimitar
// @match        *://10.53.160.89/*
// @grant        none
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/556908/%E7%BB%BC%E8%B5%84%E8%82%86%E6%84%8F%E7%BC%96%E8%BE%91.user.js
// @updateURL https://update.greasyfork.org/scripts/556908/%E7%BB%BC%E8%B5%84%E8%82%86%E6%84%8F%E7%BC%96%E8%BE%91.meta.js
// ==/UserScript==

(function() {
    'use strict';

    if (window.__forceEnableInputsInstalled) return;
    window.__forceEnableInputsInstalled = true;

    const enable = el => {
        if (!el) return;
        el.disabled = false;
        if ('readOnly' in el) el.readOnly = false;
        el.removeAttribute?.('disabled');
        el.removeAttribute?.('readonly');
    };

    const walk = root => {
        (root?.querySelectorAll?.('input,textarea,select,button,[disabled],[readonly]') || []).forEach(enable);
        if (root?.nodeType === 1) enable(root);
        const w = document.createTreeWalker(root || document, NodeFilter.SHOW_ELEMENT);
        let n; while (n = w.nextNode()) n.shadowRoot && walk(n.shadowRoot);
    };

    // Hook 属性/方法，防止被页面脚本再次禁用
    const hook = (ctorNames, prop) => {
        ctorNames.forEach(name => {
            const ctor = window[name];
            if (!ctor) return;
            const proto = ctor.prototype;
            const orig = Object.getOwnPropertyDescriptor(proto, prop);
            if (!orig || !orig.configurable) return;
            Object.defineProperty(proto, prop, {
                configurable: true, enumerable: true,
                get: () => false,
                set(v) { if (!v) orig.set?.call(this, v); }
            });
        });
    };
    hook(['HTMLInputElement','HTMLTextAreaElement','HTMLSelectElement','HTMLButtonElement'], 'disabled');
    hook(['HTMLInputElement','HTMLTextAreaElement'], 'readOnly');

    // 监听 DOM 变化
    const mo = new MutationObserver(ms => ms.forEach(m => {
        if (m.type === 'attributes') enable(m.target);
        else m.addedNodes?.forEach(n => {
            if (n.nodeType === 1) walk(n);
            n.shadowRoot && walk(n.shadowRoot);
        });
    }));
    mo.observe(document, {subtree: true, childList: true, attributes: true, attributeFilter: ['disabled','readonly']});

    // 处理 iframe + Shadow DOM
    const refresh = rootDoc => {
        walk(rootDoc);
        [...rootDoc.querySelectorAll('iframe')].forEach(f => {
            try {
                const d = f.contentDocument || f.contentWindow?.document;
                if (d && !d.__forceEnableInputsInjected) {
                    d.__forceEnableInputsInjected = true;
                    walk(d);
                    new MutationObserver(() => walk(d)).observe(d, {subtree: true, childList: true, attributes: true, attributeFilter:['disabled','readonly']});
                }
            } catch {}
        });
        [...document.querySelectorAll('*')].forEach(e => e.shadowRoot && walk(e.shadowRoot));
    };
    refresh(document);

    const interval = setInterval(() => { refresh(document); walk(document); }, 500);

    window.__forceEnableInputsUninstall = () => {
        mo.disconnect();
        clearInterval(interval);
        window.__forceEnableInputsInstalled = false;
        console.log('force-enable-inputs 已卸载');
    };

    console.log('force-enable-inputs 已注入');
})();
