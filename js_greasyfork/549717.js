// ==UserScript==
// @name         BlackRussia: Auto Like + Auto Profile Post (clean)
// @namespace    https://forum.blackrussia.online/
// @version      1.0
// @description  точка
// @author       Димочка кров 
// @match        *://forum.blackrussia.online/whats-new/profile-posts/*
// @match        *://forum.blackrussia.online/members/*
// @run-at       document-idle
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/549717/BlackRussia%3A%20Auto%20Like%20%2B%20Auto%20Profile%20Post%20%28clean%29.user.js
// @updateURL https://update.greasyfork.org/scripts/549717/BlackRussia%3A%20Auto%20Like%20%2B%20Auto%20Profile%20Post%20%28clean%29.meta.js
// ==/UserScript==

(() => {
  'use strict';

  /************* НАСТРОЙКА *************/
  const SETTINGS = {
    messageText: 'Привет! Хорошего дня 🚀',
    maxLikesPerRun: 4,          // Сколько лайков за запуск ленты
    postOncePerUser: true,      // Не писать повторно одному и тому же юзеру
    jumpToRandomProfile: true,  // Переходить в рандомный профиль из ленты
    randomDelayMs: [3500, 8000],// Задержки между действиями
    postDelayMs: [3000, 7000],  // Пауза перед отправкой сообщения на стене
    storageLikeKey: 'br_like_', // ключи для localStorage
    storagePostKey: 'br_post_',
  };

  // Селекторы с фолбэками (под XenForo 2)
  const SELECTORS = {
    feedPostRoot: ['article.message', '.message', '.profilePost'],
    likeButton: [
      'button[data-xf-click="reaction"]',
      'a[data-xf-click="reaction"]',
      '.actionBar-action--reaction button',
      '.actionBar-action--reaction a',
      '.button--reactionLike',
      'button[aria-label*="Нравится" i]',
      'button[aria-label*="Like" i]'
    ],
    authorLinkInFeed: [
      '.message-userDetails a[href*="/members/"]',
      'a.username[href*="/members/"]',
      '.profilePost a[href*="/members/"]'
    ],
    profilePostForm: [
      'form[data-xf-init="profile-post-editor"]',
      'form[action*="/profile-posts/"]',
      'form#profile-post-form'
    ],
    profilePostTextarea: [
      'form[data-xf-init="profile-post-editor"] textarea[name="message"]',
      'form[action*="/profile-posts/"] textarea[name="message"]',
      'textarea#ProfilePoster_text',
      'form textarea[name="message"]'
    ],
    profilePostSubmit: [
      'form[data-xf-init="profile-post-editor"] button[type="submit"]',
      'form[action*="/profile-posts/"] button[type="submit"]',
      'form button[type="submit"]'
    ]
  };

  /************* УТИЛИТЫ *************/
  const rand = (a,b)=>Math.floor(Math.random()*(b-a+1))+a;
  const wait = ms => new Promise(r=>setTimeout(r, ms));
  const randDelay = ([a,b]) => wait(rand(a,b));

  const qs = (arr, root=document) => {
    for (const s of arr) { const el = root.querySelector(s); if (el) return el; }
    return null;
  };
  const qsa = (arr, root=document) => {
    const out = new Set();
    for (const s of arr) document.querySelectorAll(s).forEach(el=>out.add(el));
    return Array.from(out);
  };

  const getUserIdFromUrl = (url = location.pathname) => {
    const m = url.match(/\/members\/[^/.]+\.([0-9]+)/i);
    return m ? m[1] : null;
  };

  const mark = (key) => localStorage.setItem(key, '1');
  const wasMarked = (key) => localStorage.getItem(key) === '1';

  /************* ЛОГИКА ЛЕНТЫ *************/
  async function likeInFeed() {
    const posts = qsa(SELECTORS.feedPostRoot);
    if (!posts.length) return;

    let liked = 0;
    for (const post of posts) {
      if (liked >= SETTINGS.maxLikesPerRun) break;

      const postId =
        post.getAttribute('data-content') ||
        post.id ||
        post.querySelector('a[href*="/profile-posts/"]')?.getAttribute('href') ||
        Math.random().toString(36).slice(2);

      const likeKey = SETTINGS.storageLikeKey + postId;
      if (wasMarked(likeKey)) continue;

      const btn = qs(SELECTORS.likeButton, post);
      if (!btn) continue;

      // если уже активно
      if (btn.classList.contains('is-active') || btn.getAttribute('aria-pressed') === 'true') {
        mark(likeKey); continue;
      }

      await randDelay(SETTINGS.randomDelayMs);
      btn.click();
      mark(likeKey);
      liked++;
      console.log('[BR] liked', postId);
    }
  }

  async function jumpToRandomProfile() {
    if (!SETTINGS.jumpToRandomProfile) return;
    const links = qsa(SELECTORS.authorLinkInFeed)
      .map(a => a.href)
      .filter(h => /\/members\/.+\.\d+/.test(h));
    if (!links.length) return;

    const target = links[rand(0, links.length - 1)];
    await randDelay(SETTINGS.randomDelayMs);
    console.log('[BR] jump ->', target);
    location.href = target;
  }

  /************* ЛОГИКА ПРОФИЛЯ *************/
  async function postOnProfile() {
    const userId = getUserIdFromUrl();
    if (!userId) return;

    const postKey = SETTINGS.storagePostKey + userId;
    if (SETTINGS.postOncePerUser && wasMarked(postKey)) {
      console.log('[BR] already posted to', userId);
      return;
    }

    // ждём, пока дорисуется форма
    let form, ta, submit;
    for (let i=0; i<8; i++) {
      form = qs(SELECTORS.profilePostForm);
      ta = qs(SELECTORS.profilePostTextarea);
      submit = qs(SELECTORS.profilePostSubmit);
      if (ta && submit) break;
      await wait(700);
    }
    if (!ta || !submit) {
      console.log('[BR] form not found');
      return;
    }

    await randDelay(SETTINGS.postDelayMs);
    ta.focus();
    ta.value = SETTINGS.messageText;
    ta.dispatchEvent(new Event('input', {bubbles:true}));
    ta.dispatchEvent(new Event('change', {bubbles:true}));

    await wait(rand(400, 1200));
    submit.click();
    mark(postKey);
    console.log('[BR] posted to', userId);
  }

  /************* РОУТИНГ *************/
  function onRoute() {
    const p = location.pathname;

    if (/^\/whats-new\/profile-posts\/?/.test(p)) {
      likeInFeed()
        .then(jumpToRandomProfile)
        .catch(console.error);
    } else if (/^\/members\/[^/]+\.\d+/.test(p)) {
      postOnProfile().catch(console.error);
    }
  }

  // старт
  onRoute();

  // если форум — SPA, пробуем реагировать на изменения
  const mo = new MutationObserver(() => {
    const p = location.pathname;
    if (/^\/whats-new\/profile-posts\/?/.test(p)) likeInFeed();
  });
  mo.observe(document.documentElement, {childList:true, subtree:true});
})();
