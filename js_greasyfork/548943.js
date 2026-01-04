// ==UserScript==
// @name         AniList: add a back-to-top button
// @namespace    plennhar-anilist-add-a-back-to-top-button
// @version      1.0
// @description  Adds a back-to-top button to AniList.
// @author       Plennhar
// @match        https://anilist.co/*
// @run-at       document-idle
// @grant        none
// @noframes
// @license      GPL-3.0-or-later
// @downloadURL https://update.greasyfork.org/scripts/548943/AniList%3A%20add%20a%20back-to-top%20button.user.js
// @updateURL https://update.greasyfork.org/scripts/548943/AniList%3A%20add%20a%20back-to-top%20button.meta.js
// ==/UserScript==
// SPDX-FileCopyrightText: 2025 Plennhar
// SPDX-License-Identifier: GPL-3.0-or-later

(function () {
	'use strict';
	if (window.__alBackToTopInjected) return;
	window.__alBackToTopInjected = true;

	const css = `
    :root {
      --al-btt-left: 16px;
      --al-btt-bottom: 16px;
    }
    #al-back-to-top {
      position: fixed;
      left: var(--al-btt-left);
      bottom: var(--al-btt-bottom);
      z-index: 2147483647;
      width: 44px;
      height: 44px;
      border-radius: 999px;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      user-select: none;
      border: 1px solid rgba(0,0,0,.18);
      background: rgba(255,255,255,.92);
      color: #222;
      box-shadow: 0 6px 18px rgba(0,0,0,.16);
      opacity: 0;
      transform: translateY(8px);
      transition: opacity 160ms ease, transform 160ms ease, background 120ms ease, border-color 120ms ease, box-shadow 120ms ease;
      pointer-events: none;
    }
    #al-back-to-top.visible {
      opacity: 1;
      transform: translateY(0);
      pointer-events: auto;
    }
    #al-back-to-top:hover {
      background: #fff;
      border-color: rgba(0,0,0,.22);
      box-shadow: 0 8px 22px rgba(0,0,0,.22);
    }
    #al-back-to-top:active {
      transform: translateY(1px);
    }
    #al-back-to-top svg {
      width: 20px;
      height: 20px;
      display: block;
    }
    @media (prefers-color-scheme: dark) {
      #al-back-to-top {
        background: rgba(25,25,28,.84);
        color: #fff;
        border-color: rgba(255,255,255,.16);
        box-shadow: 0 6px 18px rgba(0,0,0,.35);
      }
      #al-back-to-top:hover {
        background: rgba(25,25,28,.96);
        border-color: rgba(255,255,255,.22);
        box-shadow: 0 8px 22px rgba(0,0,0,.5);
      }
    }
  `;
	const style = document.createElement('style');
	style.textContent = css;
	document.head.appendChild(style);

	const btn = document.createElement('button');
	btn.id = 'al-back-to-top';
	btn.type = 'button';
	btn.setAttribute('aria-label', 'Back to top');
	btn.title = 'Back to top';
	btn.innerHTML = `
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M12 5.5a1 1 0 0 1 .7.29l6.5 6.5a1 1 0 1 1-1.4 1.42L13 9.31V19a1 1 0 1 1-2 0V9.3l-4.8 4.9a1 1 0 1 1-1.4-1.42l6.5-6.5A1 1 0 0 1 12 5.5z"/>
    </svg>
  `;
	document.body.appendChild(btn);

	const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
	const scrollToTop = () => {
		const behavior = prefersReduced ? 'auto' : 'smooth';
		window.scrollTo({ top: 0, left: 0, behavior });
	};
	btn.addEventListener('click', scrollToTop);
	btn.addEventListener('keydown', (e) => {
		if (e.key === 'Enter' || e.key === ' ') {
			e.preventDefault();
			scrollToTop();
		}
	});

	const THRESHOLD = 400;
	const toggle = () => {
		const y = window.scrollY || document.documentElement.scrollTop || 0;
		if (y > THRESHOLD) btn.classList.add('visible');
		else btn.classList.remove('visible');
	};

	window.addEventListener('scroll', toggle, { passive: true });
	window.addEventListener('resize', toggle, { passive: true });
	const mo = new MutationObserver(() => toggle());
	mo.observe(document.body, { childList: true, subtree: true });

	requestAnimationFrame(toggle);
})();
