// ==UserScript==
// @name         Minimal Demo External
// @namespace    example.minimal.demo.external
// @version      1.0.2
// @description  Minimal Demo Main 用の外部ライブラリ
// ==/UserScript==

const DEMO_STORAGE_KEY = 'minimal-demo-text';

function external_loadText() {
  console.log('[External] external_loadText called');
  return GM_getValue(DEMO_STORAGE_KEY, '');
}

function external_saveText(text) {
  console.log('[External] external_saveText called', text);
  GM_setValue(DEMO_STORAGE_KEY, text);
}
