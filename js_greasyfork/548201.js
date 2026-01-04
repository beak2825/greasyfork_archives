// ==UserScript==
// @name         yuyehk快捷操作（neeko-root 自动点击）Fixed
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  通过快捷键点击 neeko 组件中的按钮/单选项（修复 z 键无效）
// @match        https://aidp.bytedance.com/management/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/548201/yuyehk%E5%BF%AB%E6%8D%B7%E6%93%8D%E4%BD%9C%EF%BC%88neeko-root%20%E8%87%AA%E5%8A%A8%E7%82%B9%E5%87%BB%EF%BC%89Fixed.user.js
// @updateURL https://update.greasyfork.org/scripts/548201/yuyehk%E5%BF%AB%E6%8D%B7%E6%93%8D%E4%BD%9C%EF%BC%88neeko-root%20%E8%87%AA%E5%8A%A8%E7%82%B9%E5%87%BB%EF%BC%89Fixed.meta.js
// ==/UserScript==

(function () {
  'use strict';

  // 更稳：匹配 class 含有 neeko-root（避免尾部空格/变体）
  function getNeekoRoots() {
    return document.querySelectorAll('[class*="neeko-root"]');
  }

  // 根据可见文本点击 arco 单选（或兼容 checkbox），避免使用脆弱的下标
  function clickArcoOptionByText(root, text, { fuzzy = true } = {}) {
    const nodes = root.querySelectorAll('.arco-radio-text, .arco-checkbox-text, [class*="arco-radio-text"], [class*="arco-checkbox-text"]');
    for (const n of nodes) {
      const t = (n.textContent || '').trim();
      const hit = fuzzy ? t.includes(text) : t === text;
      if (hit) {
        const label = n.closest('label');
        if (label) {
          label.click();
          return true;
        }
        n.click();
        return true;
      }
    }
    return false;
  }

  // n：一键复制（点击每个 neeko-root 下的第一个 button）
  function doCopy() {
    for (const root of getNeekoRoots()) {
      const btn = root.querySelector('button');
      if (btn) btn.click();
    }
  }

  // z：商品-正常截图(上传截图)
  function doShotNormal() {
    let ok = false;
    for (const root of getNeekoRoots()) {
      ok = clickArcoOptionByText(root, '商品—正常截图(上传截图)') || ok;
    }
    if (!ok) console.warn('未找到 文案含「商品-正常截图」的选项。');
  }

  // v：店铺找不到
  function doShopNotFound() {
    let ok = false;
    for (const root of getNeekoRoots()) {
      ok = clickArcoOptionByText(root, '店铺—无法找到(无需上传截图)') || ok;
    }
    if (!ok) console.warn('未找到 文案含「店铺找不到」的选项。');
  }

  // m：商品找不到
  function doProductNotFound() {
    let ok = false;
    for (const root of getNeekoRoots()) {
      ok = clickArcoOptionByText(root, '商品—无法找到(无需上传截图)') || ok;
    }
    if (!ok) console.warn('未找到 文案含「商品找不到」的选项。');
  }

  const actions = {
    n: doCopy,
    z: doShotNormal,
    v: doShopNotFound,
    m: doProductNotFound,
  };

  // 按键监听（允许在输入框中触发，与你原始配置一致）
  document.addEventListener('keydown', (e) => {
    const fn = actions[e.key];
    if (!fn) return;
    e.preventDefault();
    fn();
  });
})();
