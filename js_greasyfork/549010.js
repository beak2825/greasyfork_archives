// ==UserScript==
// @name         Codeforces Font Changer
// @name:zh-cn   Codeforces Font Changer
// @description  Change Codeforces Font.
// @match        *://*.codeforces.com/*
// @namespace    https://www.murasame-chan.me
// @license      MIT
// @grant        none
// @run-at       document-end
// @version      2.1
// @downloadURL https://update.greasyfork.org/scripts/549587/Codeforces%20Font%20Changer.user.js
// @updateURL https://update.greasyfork.org/scripts/549587/Codeforces%20Font%20Changer.meta.js
// ==/UserScript==
(function(){
    'use strict';
    const PAGE_FONT = 'Lato, "Noto Sans CJK SC", sans-serif, "Line Awesome Brands", iconfont';
    const CODE_FONT = '"Fira Code", "Cascadia Code", "JetBrains Mono", monospace';
    const MATH_FONT = '"KaTeX_Main", "KaTeX_Math", "Times New Roman", serif';
    const SKIP_CONTAINER_SELECTOR = [
        '.menu-list',
        '.main-menu-list',
        '.second-level-menu',
        '.second-level-menu-list',
        '.backLava',
        '.selectedLava',
        '.MathJax',
        '.mjx-container',
        '.katex'
    ].join(', ');
    const CODE_ANCHORS = 'code, pre, .CodeMirror, .monaco-editor, textarea, .ace-content, .ace_scroller';

    function isInsideSkippedContainer(node){
        if(!(node && node.nodeType === 1)) return false;
        try{ return !!node.closest(SKIP_CONTAINER_SELECTOR); }catch(e){ return false; }
    }

    function applyFontToElement(el){
        if(!el || el.nodeType !== 1) return;
        if(isInsideSkippedContainer(el)) return;
        try{
            if(el.closest && el.closest(CODE_ANCHORS)){
                el.style.setProperty('font-family', CODE_FONT, 'important');
                el.style.setProperty('font-variant-ligatures', 'common-ligatures', 'important');
                el.style.setProperty('-webkit-font-variant-ligatures', 'common-ligatures', 'important');
                el.style.setProperty('font-feature-settings', '"liga", "clig"', 'important');
                return;
            }
            if(el.matches && el.matches('.MathJax, .MathJax_Display, .MathJax_Preview, .mjx-container, .katex, .MJXp-math, .MJXp-mn')){
                el.style.setProperty('font-family', MATH_FONT, 'important');
                el.style.setProperty('font-variant-ligatures', 'normal', 'important');
                el.style.setProperty('-webkit-font-variant-ligatures', 'normal', 'important');
                el.style.setProperty('font-feature-settings', 'normal', 'important');
                return;
            }
            el.style.setProperty('font-family', PAGE_FONT, 'important');
            el.style.setProperty('font-variant-ligatures', 'normal', 'important');
            el.style.setProperty('-webkit-font-variant-ligatures', 'normal', 'important');
            el.style.setProperty('font-feature-settings', 'normal', 'important');
        }catch(e){}
    }

    function applyFontsToExisting(){
        const all = document.getElementsByTagName('*');
        for(let i=0;i<all.length;i++) applyFontToElement(all[i]);
    }

    function observeMutations(){
        const mo = new MutationObserver(mutations=>{
            for(const m of mutations){
                if(m.addedNodes && m.addedNodes.length){
                    m.addedNodes.forEach(node=>{
                        if(node.nodeType!==1) return;
                        if(isInsideSkippedContainer(node)) return;
                        applyFontToElement(node);
                        const elems = node.getElementsByTagName ? node.getElementsByTagName('*') : [];
                        for(let j=0;j<elems.length;j++) applyFontToElement(elems[j]);
                    });
                }
                if(m.type==='attributes' && m.target && m.target.nodeType===1){
                    applyFontToElement(m.target);
                }
            }
        });
        mo.observe(document.documentElement||document.body, { childList: true, subtree: true, attributes: true, attributeFilter: ['class','style'] });
    }

    function disableMathJaxMenu(){
        try{
            if(window.MathJax && window.MathJax.Hub && typeof window.MathJax.Hub.Config === 'function'){
                try{ window.MathJax.Hub.Config({ showMathMenu: false, showMathMenuMSIE: false }); }catch(e){}
            }
        }catch(e){}
        document.addEventListener('contextmenu', function(e){
            try{
                const tgt = e.target;
                if(!tgt || typeof tgt.closest!=='function') return;
                if(tgt.closest('.MathJax, .MathJax_Display, .MathJax_Preview, .mjx-container, .katex, .MJXp-math, .MJXp-mn')){
                    e.stopImmediatePropagation();
                }
            }catch(err){}
        }, true);
    }

    function ensureKaTeXCSS(){
        try{
            const hasKaTeX = Array.from(document.styleSheets).some(s=>{
                try{ return !!s.href && /katex/i.test(s.href); }catch(e){ return false; }
            }) || !!document.querySelector('link[href*="katex"]');
            if(!hasKaTeX){
                const link = document.createElement('link');
                link.rel = 'stylesheet';
                link.href = 'https://cdn.jsdelivr.net/npm/katex@0.16.8/dist/katex.min.css';
                link.crossOrigin = 'anonymous';
                document.head.appendChild(link);
            }
        }catch(e){}
    }

    try{
        // Optional: Change KaTeX font to KaTeX_Main, KaTeX_Math
        // ensureKaTeXCSS();
        applyFontsToExisting();
        observeMutations();
        // Optional: Disable MathJax right-click menu
        // disableMathJaxMenu();
        console.info('Font changer active: code descendants forced to Fira Code.');
    }catch(e){}
})();
