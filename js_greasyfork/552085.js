// ==UserScript==
// @name         스마트스코어 오토로그인
// @description  -
// @version      -
// @match        https://cc.smartscore.kr/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=https://www.smartscore.global/
// @grant        none
// @run-at       document-start
// @namespace https://greasyfork.org/users/201299
// @downloadURL https://update.greasyfork.org/scripts/552085/%EC%8A%A4%EB%A7%88%ED%8A%B8%EC%8A%A4%EC%BD%94%EC%96%B4%20%EC%98%A4%ED%86%A0%EB%A1%9C%EA%B7%B8%EC%9D%B8.user.js
// @updateURL https://update.greasyfork.org/scripts/552085/%EC%8A%A4%EB%A7%88%ED%8A%B8%EC%8A%A4%EC%BD%94%EC%96%B4%20%EC%98%A4%ED%86%A0%EB%A1%9C%EA%B7%B8%EC%9D%B8.meta.js
// ==/UserScript==

(() => {
  const href = 'https://www.google.com/s2/favicons?sz=64&domain=https://www.smartscore.global/';
  let iconDone = false;
  let credsDone = false;
  let submitted = false;

  const applyFavicon = () => {
    const h = document.head || document.getElementsByTagName('head')[0];
    if (!h) return false;
    [...document.querySelectorAll('link[rel~="icon"], link[rel="shortcut icon"]')].forEach(n => n.remove());
    const mk = rel => { const l = document.createElement('link'); l.rel = rel; l.href = href; h.appendChild(l); };
    mk('icon'); mk('shortcut icon');
    return true;
  };

  const setVal = (el, v) => {
    if (!el) return false;
    el.focus();
    el.value = v;
    el.setAttribute('value', v);
    el.dispatchEvent(new Event('input', { bubbles: true }));
    el.dispatchEvent(new Event('change', { bubbles: true }));
    el.blur();
    return true;
  };

  const fillCreds = () => {
    const idOk = setVal(document.getElementById('inputID'), 'eleven12');
    const pwOk = setVal(document.getElementById('inputPassword'), 'eleven3500%');
    return idOk && pwOk;
  };

  const trySubmitOnce = () => {
    if (submitted) return true;
    const btn = document.getElementById('admin_login_submit');
    if (!btn) return false;
    btn.click();
    submitted = true;

    setTimeout(() => {
      const yes = document.querySelector('.button_popup > .btnLogoutYes');
      if (yes) yes.click();
    }, 100);

    return true;
  };

  iconDone = applyFavicon();
  credsDone = fillCreds();
  if (credsDone) trySubmitOnce();

  const t = setInterval(() => {
    if (!iconDone) iconDone = applyFavicon();
    if (!credsDone) credsDone = fillCreds();
    if (credsDone) trySubmitOnce();
    if (iconDone && submitted) clearInterval(t);
  }, 50);

  document.addEventListener('DOMContentLoaded', () => {
    if (!iconDone) iconDone = applyFavicon();
    if (!credsDone) credsDone = fillCreds();
    if (credsDone) trySubmitOnce();
    if (iconDone && submitted) clearInterval(t);
  }, { once: true });
})();
