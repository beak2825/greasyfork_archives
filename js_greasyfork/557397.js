// ==UserScript==
// @name         B站首页一键快捷拉黑作者
// @namespace    http://tampermonkey.net/
// @version      2025-11-30-5
// @description  在bilibili主页视频下方自动添加一键拉黑按钮，并且拉黑完成之后直接删除页面元素
// @author       w0r1dtr33
// @match        *://www.bilibili.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=bilibili.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/557397/B%E7%AB%99%E9%A6%96%E9%A1%B5%E4%B8%80%E9%94%AE%E5%BF%AB%E6%8D%B7%E6%8B%89%E9%BB%91%E4%BD%9C%E8%80%85.user.js
// @updateURL https://update.greasyfork.org/scripts/557397/B%E7%AB%99%E9%A6%96%E9%A1%B5%E4%B8%80%E9%94%AE%E5%BF%AB%E6%8D%B7%E6%8B%89%E9%BB%91%E4%BD%9C%E8%80%85.meta.js
// ==/UserScript==

function Block(card, uid, csrf) {
  const data = new URLSearchParams({ fid: uid, act: 5, csrf });
  fetch('https://api.bilibili.com/x/relation/modify', {
    method: 'POST',
    credentials: 'include',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: data
  })
  .then(res => res.json())
  .then(console.log)
  .catch(console.error);
  if (card.classList.contains('floor-card-inner')) {
    card.remove();
  } else {
    card.parentNode.parentNode.parentNode.remove()
  }
}

function addBtn(card) {
  if (card.querySelector('.block-btn')) return;
    const lastEl = parent => parent?.lastElementChild ?? null;
    let linkNode = null;
    if (card?.classList.contains('floor-card-inner')) {
      linkNode = lastEl(lastEl(lastEl(card)));
    } else {
      linkNode = card?.childNodes?.[2] ?? null;
    }
  if (!linkNode || !linkNode.getAttribute) return;
  const href = linkNode.getAttribute('href');
  const uid = href.split('/')[3];
  const csrf = document.cookie
                .split('; ')
                .find(row => row.startsWith('bili_jct='))
                ?.split('=')[1];
  if (!csrf) {
    alert('请先登录（找不到 csrf）');
    return;
  }

  const btn = document.createElement('button');
  btn.className = 'block-btn';
  btn.textContent = '拉黑 up 主';
  btn.style.marginLeft = 'auto';
  btn.onclick = () => Block(card, uid, csrf);
  if (card.classList.contains('floor-card-inner')) {
    card.childNodes[1].appendChild(btn);
  } else {
    card.appendChild(btn);
  }
}

document
  .querySelectorAll('.bili-video-card__info--bottom, .floor-card-inner')
  .forEach(addBtn);

const ob = new MutationObserver(() =>
  document
    .querySelectorAll(
    	'.bili-video-card__info--bottom:not([data-ready]), ' + 
    	'.floor-card-inner:not([data-ready])'
	)
    .forEach(card => {
      addBtn(card);
      card.dataset.ready = '1';
    })
);
ob.observe(document.body, { childList: true, subtree: true });