// ==UserScript==
// @name         coolenglish-英文-外掛-浮動翻譯按鈕
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  自動選取文字即翻譯，四色按鈕，語音朗讀，穩定多來源翻譯 API（Google + LibreTranslate）
// @author       issac
// @match        *://*/*
// @grant        GM_addStyle
// @license      GPL-3.0 License
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/554264/coolenglish-%E8%8B%B1%E6%96%87-%E5%A4%96%E6%8E%9B-%E6%B5%AE%E5%8B%95%E7%BF%BB%E8%AD%AF%E6%8C%89%E9%88%95.user.js
// @updateURL https://update.greasyfork.org/scripts/554264/coolenglish-%E8%8B%B1%E6%96%87-%E5%A4%96%E6%8E%9B-%E6%B5%AE%E5%8B%95%E7%BF%BB%E8%AD%AF%E6%8C%89%E9%88%95.meta.js
// ==/UserScript==
 
(function() {
  'use strict';
  const TARGET_LANG = 'zh-TW';
 
  GM_addStyle(`
    #miniTrans {
      position: fixed; right: 20px; bottom: 20px;
      width: 280px; background: #0d1117; color: #fff;
      font-family: sans-serif; border: 1px solid #333;
      border-radius: 8px; box-shadow: 0 5px 20px rgba(0,0,0,0.5);
      z-index: 99999; resize: both; overflow: hidden;
    }
    #miniTrans header {
      background: #161b22; padding: 5px 8px;
      font-size: 13px; cursor: move; display: flex;
      justify-content: space-between; align-items: center;
    }
    #miniTrans header button {
      background: transparent; border: none; color: #ccc;
      cursor: pointer; font-size: 14px;
    }
    #miniTrans textarea {
      width: 95%; margin: 5px; height: 60px;
      border: none; border-radius: 5px; padding: 5px;
      background: #161b22; color: #fff; font-size: 13px; resize: vertical;
    }
    #miniTrans .btns {
      display: flex; justify-content: space-around; padding: 5px; gap: 4px;
    }
    #miniTrans button {
      flex: 1; border: none; padding: 4px 6px;
      border-radius: 5px; cursor: pointer; font-size: 12px;
      color: #fff; transition: background 0.2s;
    }
    #mt-trans { background: #2563eb; }
    #mt-trans:hover { background: #1d4ed8; }
    #mt-speak { background: #22c55e; }
    #mt-speak:hover { background: #16a34a; }
    #mt-src { background: #eab308; color:#222; }
    #mt-src:hover { background: #ca8a04; color:#111; }
    #mt-clear { background: #ef4444; }
    #mt-clear:hover { background: #dc2626; }
    #miniTrans.min { height: 28px; overflow: hidden; }
  `);
 
  const box = document.createElement('div');
  box.id = 'miniTrans';
  box.innerHTML = `
    <header><span>翻譯小窗</span><button id="mt-min">−</button></header>
    <textarea id="mt-input" placeholder="選取文字後自動翻譯"></textarea>
    <textarea id="mt-output" placeholder="翻譯結果" readonly></textarea>
    <div class="btns">
      <button id="mt-trans">翻譯</button>
      <button id="mt-speak">唸譯文</button>
      <button id="mt-src">唸原文</button>
      <button id="mt-clear">清除</button>
    </div>
  `;
  document.body.appendChild(box);
 
  const header = box.querySelector('header');
  const minBtn = box.querySelector('#mt-min');
  const input = box.querySelector('#mt-input');
  const output = box.querySelector('#mt-output');
  const btnTrans = box.querySelector('#mt-trans');
  const btnSpeak = box.querySelector('#mt-speak');
  const btnSrc = box.querySelector('#mt-src');
  const btnClear = box.querySelector('#mt-clear');
 
  // 拖曳功能
  (function dragElement(el, handle) {
    let x=0, y=0, dx=0, dy=0, dragging=false;
    handle.addEventListener('mousedown', e => {
      dragging=true; x=e.clientX; y=e.clientY;
      e.preventDefault();
    });
    window.addEventListener('mousemove', e => {
      if(!dragging) return;
      dx=e.clientX-x; dy=e.clientY-y;
      const rect = el.getBoundingClientRect();
      el.style.left = rect.left+dx+'px';
      el.style.top = rect.top+dy+'px';
      el.style.right = 'auto';
      el.style.bottom = 'auto';
      x=e.clientX; y=e.clientY;
    });
    window.addEventListener('mouseup', ()=>dragging=false);
  })(box, header);
 
  // 最小化
  let minimized = false;
  minBtn.onclick = () => {
    minimized = !minimized;
    box.classList.toggle('min');
    minBtn.textContent = minimized ? '+' : '−';
  };
 
  // 清除
  btnClear.onclick = () => {
    input.value = '';
    output.value = '';
  };
 
  // 翻譯函式（多來源備援）
  async function translateText(text) {
    const sources = [
      async () => {
        const res = await fetch('https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=' + TARGET_LANG + '&dt=t&q=' + encodeURIComponent(text));
        const data = await res.json();
        return data[0].map(x => x[0]).join('');
      },
      async () => {
        const res = await fetch('https://libretranslate.de/translate', {
          method: 'POST',
          headers: {'Content-Type':'application/json'},
          body: JSON.stringify({q:text, source:'auto', target:TARGET_LANG})
        });
        const data = await res.json();
        return data.translatedText;
      }
    ];
    for (const fn of sources) {
      try {
        const result = await fn();
        if (result) return result;
      } catch (e) { /* 繼續嘗試下一個 */ }
    }
    throw new Error('所有翻譯來源皆失敗');
  }
 
  // 手動翻譯按鈕
  btnTrans.onclick = async () => {
    const text = input.value.trim();
    if(!text) return;
    output.value = '翻譯中...';
    try {
      const translated = await translateText(text);
      output.value = translated;
    } catch (e) {
      output.value = '翻譯錯誤：無法取得結果';
    }
  };
 
  // 語音
  function speak(text, lang) {
    if(!text) return;
    speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text);
    u.lang = lang || 'zh-TW';
    speechSynthesis.speak(u);
  }
  btnSpeak.onclick = () => speak(output.value, 'zh-TW');
  btnSrc.onclick = () => speak(input.value, 'auto');
 
  // 自動偵測選取文字 → 自動翻譯
  let lastSel = '';
  document.addEventListener('mouseup', () => {
    setTimeout(async () => {
      const sel = window.getSelection().toString().trim();
      if(sel && sel !== lastSel) {
        lastSel = sel;
        input.value = sel;
        output.value = '翻譯中...';
        try {
          const translated = await translateText(sel);
          output.value = translated;
        } catch (e) {
          output.value = '翻譯錯誤：無法取得結果';
        }
      }
    }, 100);
  });
})();