// ==UserScript==
// @name         GitHub - Enhanced Shortcuts & Header Toolbar
// @namespace    github-header-shortcuts
// @version      1.2.4
// @description  Extends GitHub navigation: adds a header toolbar and fixes native shortcuts to work on any keyboard layout
// @author       Vikindor (https://vikindor.github.io/)
// @homepageURL  https://github.com/Vikindor/github-header-shortcuts/
// @supportURL   https://github.com/Vikindor/github-header-shortcuts/issues
// @license      MIT
// @match        https://github.com/*
// @match        https://gist.github.com/*
// @grant        none
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/553502/GitHub%20-%20Enhanced%20Shortcuts%20%20Header%20Toolbar.user.js
// @updateURL https://update.greasyfork.org/scripts/553502/GitHub%20-%20Enhanced%20Shortcuts%20%20Header%20Toolbar.meta.js
// ==/UserScript==

(function () {
  'use strict';

  const CONFIG = {
    repositories: true,
    projects: true,
    packages: true,
    stars: true,
    gists: true,
    organizations: true,
    enterprises: true,
    issues: true,
    pulls: true,
    order: ['repositories', 'projects', 'packages', 'stars', 'gists', 'organizations', 'enterprises', 'issues', 'pulls'],
  };

  const ID_CONTAINER = 'gh-shortcuts-between-start-end';

  const injectCSS = () => {
    if (document.getElementById('gh-shortcuts-style')) return;
    const style = document.createElement('style');
    style.id = 'gh-shortcuts-style';
    style.textContent = `
      #${ID_CONTAINER}::after{
        content:""; display:block; width:1px; height:20px;
        background-color:var(--borderColor-default,#30363d); opacity:.6; align-self:center;
      }
      #${ID_CONTAINER}{
        display:flex; align-items:center; gap:8px; flex-wrap:nowrap;
      }
      #${ID_CONTAINER} a{
        display:inline-flex; align-items:center; white-space:nowrap;
      }
      #${ID_CONTAINER} a span{
        white-space:nowrap;
      }
      #${ID_CONTAINER} svg{ flex:0 0 auto; }`;
    document.head.appendChild(style);
  };

  const getUserLogin = () =>
    document.querySelector('meta[name="user-login"]')?.getAttribute('content')?.trim() || '';

  const createContainer = () => {
    const wrap = document.createElement('div');
    wrap.id = ID_CONTAINER;
    wrap.className = 'd-flex flex-items-center gap-2 px-2';
    return wrap;
  };

  const resolveMountPoint = () => {
    const host = location.hostname;
    if (host === 'gist.github.com') {
      const bell = document.querySelector('notification-indicator, .notification-indicator');
      const bellItem = bell ? bell.closest('.Header-item') : null;
      if (bellItem && bellItem.parentElement)
        return { parent: bellItem.parentElement, beforeNode: bellItem };
      return { parent: null, beforeNode: null };
    }
    const end = document.querySelector('.AppHeader-globalBar-end');
    if (end && end.parentElement) return { parent: end.parentElement, beforeNode: end };
    return { parent: null, beforeNode: null };
  };

  const createButton = (info) => {
    const a = document.createElement('a');
    a.href = info.href(getUserLogin());
    a.className =
      'AppHeader-link d-flex flex-items-center gap-2 no-underline color-fg-muted hover-color-fg-default';
    a.style.margin = '0 5px';
    a.title = info.tooltip || info.title;
    a.innerHTML = `
      <svg aria-hidden="true" height="16" width="16" viewBox="0 0 16 16" class="octicon octicon-${info.icon}">
        <path d="${info.path}"></path>
      </svg>
      <span>${info.title}</span>`;
    return a;
  };

  const BUTTONS = {
    repositories: {
      title: 'Repositories',
      tooltip: 'Repositories (G + R)',
      icon: 'repo',
      href: (user) => `https://github.com/${user}?tab=repositories`,
      path: 'M2 2.5A2.5 2.5 0 0 1 4.5 0h8.75a.75.75 0 0 1 .75.75v12.5a.75.75 0 0 1-.75.75h-2.5a.75.75 0 0 1 0-1.5h1.75v-2h-8a1 1 0 0 0-.714 1.7.75.75 0 1 1-1.072 1.05A2.495 2.495 0 0 1 2 11.5Zm10.5-1h-8a1 1 0 0 0-1 1v6.708A2.486 2.486 0 0 1 4.5 9h8ZM5 12.25a.25.25 0 0 1 .25-.25h3.5a.25.25 0 0 1 .25.25v3.25a.25.25 0 0 1-.4.2l-1.45-1.087a.249.249 0 0 0-.3 0L5.4 15.7a.25.25 0 0 1-.4-.2Z',
    },
    projects: {
      title: 'Projects',
      tooltip: 'Projects (G + T)',
      icon: 'table',
      href: (user) => `https://github.com/${user}?tab=projects`,
      path: 'M0 1.75C0 .784.784 0 1.75 0h12.5C15.216 0 16 .784 16 1.75v12.5A1.75 1.75 0 0 1 14.25 16H1.75A1.75 1.75 0 0 1 0 14.25ZM6.5 6.5v8h7.75a.25.25 0 0 0 .25-.25V6.5Zm8-1.5V1.75a.25.25 0 0 0-.25-.25H6.5V5Zm-13 1.5v7.75c0 .138.112.25.25.25H5v-8ZM5 5V1.5H1.75a.25.25 0 0 0-.25.25V5Z',
    },
    packages: {
      title: 'Packages',
      tooltip: 'Packages (G + K)',
      icon: 'package',
      href: (user) => `https://github.com/${user}?tab=packages`,
      path: 'm8.878.392 5.25 3.045c.54.314.872.89.872 1.514v6.098a1.75 1.75 0 0 1-.872 1.514l-5.25 3.045a1.75 1.75 0 0 1-1.756 0l-5.25-3.045A1.75 1.75 0 0 1 1 11.049V4.951c0-.624.332-1.201.872-1.514L7.122.392a1.75 1.75 0 0 1 1.756 0ZM7.875 1.69l-4.63 2.685L8 7.133l4.755-2.758-4.63-2.685a.248.248 0 0 0-.25 0ZM2.5 5.677v5.372c0 .09.047.171.125.216l4.625 2.683V8.432Zm6.25 8.271 4.625-2.683a.25.25 0 0 0 .125-.216V5.677L8.75 8.432Z',
    },
    stars: {
      title: 'Stars',
      tooltip: 'Stars (G + S)',
      icon: 'star',
      href: (user) => `https://github.com/${user}?tab=stars`,
      path: 'M8 .25a.75.75 0 0 1 .673.418l1.882 3.815 4.21.612a.75.75 0 0 1 .416 1.279l-3.046 2.97.719 4.192a.751.751 0 0 1-1.088.791L8 12.347l-3.766 1.98a.75.75 0 0 1-1.088-.79l.72-4.194L.818 6.374a.75.75 0 0 1 .416-1.28l4.21-.611L7.327.668A.75.75 0 0 1 8 .25Zm0 2.445L6.615 5.5a.75.75 0 0 1-.564.41l-3.097.45 2.24 2.184a.75.75 0 0 1 .216.664l-.528 3.084 2.769-1.456a.75.75 0 0 1 .698 0l2.77 1.456-.53-3.084a.75.75 0 0 1 .216-.664l2.24-2.183-3.096-.45a.75.75 0 0 1-.564-.41L8 2.694Z',
    },
    gists: {
      title: 'Gists',
      tooltip: 'Gists (G + J)',
      icon: 'gist',
      href: (user) => `https://gist.github.com/${user}`,
      path: 'M0 1.75C0 .784.784 0 1.75 0h12.5C15.216 0 16 .784 16 1.75v12.5A1.75 1.75 0 0 1 14.25 16H1.75A1.75 1.75 0 0 1 0 14.25Zm1.75-.25a.25.25 0 0 0-.25.25v12.5c0 .138.112.25.25.25h12.5a.25.25 0 0 0 .25-.25V1.75a.25.25 0 0 0-.25-.25Zm7.47 3.97a.75.75 0 0 1 1.06 0l2 2a.75.75 0 0 1 0 1.06l-2 2a.749.749 0 0 1-1.275-.326.749.749 0 0 1 .215-.734L10.69 8 9.22 6.53a.75.75 0 0 1 0-1.06ZM6.78 6.53 5.31 8l1.47 1.47a.749.749 0 0 1-.326 1.275.749.749 0 0 1-.734-.215l-2-2a.75.75 0 0 1 0-1.06l2-2a.751.751 0 0 1 1.042.018.751.751 0 0 1 .018 1.042Z'
    },
    organizations: {
      title: 'Organizations',
      tooltip: 'Organizations (G + O)',
      icon: 'organization',
      href: () => 'https://github.com/settings/organizations',
      path: 'M1.75 16A1.75 1.75 0 0 1 0 14.25V1.75C0 .784.784 0 1.75 0h8.5C11.216 0 12 .784 12 1.75v12.5c0 .085-.006.168-.018.25h2.268a.25.25 0 0 0 .25-.25V8.285a.25.25 0 0 0-.111-.208l-1.055-.703a.749.749 0 1 1 .832-1.248l1.055.703c.487.325.779.871.779 1.456v5.965A1.75 1.75 0 0 1 14.25 16h-3.5a.766.766 0 0 1-.197-.026c-.099.017-.2.026-.303.026h-3a.75.75 0 0 1-.75-.75V14h-1v1.25a.75.75 0 0 1-.75.75Zm-.25-1.75c0 .138.112.25.25.25H4v-1.25a.75.75 0 0 1 .75-.75h2.5a.75.75 0 0 1 .75.75v1.25h2.25a.25.25 0 0 0 .25-.25V1.75a.25.25 0 0 0-.25-.25h-8.5a.25.25 0 0 0-.25.25ZM3.75 6h.5a.75.75 0 0 1 0 1.5h-.5a.75.75 0 0 1 0-1.5ZM3 3.75A.75.75 0 0 1 3.75 3h.5a.75.75 0 0 1 0 1.5h-.5A.75.75 0 0 1 3 3.75Zm4 3A.75.75 0 0 1 7.75 6h.5a.75.75 0 0 1 0 1.5h-.5A.75.75 0 0 1 7 6.75ZM7.75 3h.5a.75.75 0 0 1 0 1.5h-.5a.75.75 0 0 1 0-1.5ZM3 9.75A.75.75 0 0 1 3.75 9h.5a.75.75 0 0 1 0 1.5h-.5A.75.75 0 0 1 3 9.75ZM7.75 9h.5a.75.75 0 0 1 0 1.5h-.5a.75.75 0 0 1 0-1.5Z',
    },
    enterprises: {
      title: 'Enterprises',
      tooltip: 'Enterprises (G + E)',
      icon: 'globe',
      href: () => 'https://github.com/settings/enterprises',
      path: 'M8 0a8 8 0 1 1 0 16A8 8 0 0 1 8 0ZM5.78 8.75a9.64 9.64 0 0 0 1.363 4.177c.255.426.542.832.857 1.215.245-.296.551-.705.857-1.215A9.64 9.64 0 0 0 10.22 8.75Zm4.44-1.5a9.64 9.64 0 0 0-1.363-4.177c-.307-.51-.612-.919-.857-1.215a9.927 9.927 0 0 0-.857 1.215A9.64 9.64 0 0 0 5.78 7.25Zm-5.944 1.5H1.543a6.507 6.507 0 0 0 4.666 5.5c-.123-.181-.24-.365-.352-.552-.715-1.192-1.437-2.874-1.581-4.948Zm-2.733-1.5h2.733c.144-2.074.866-3.756 1.58-4.948.12-.197.237-.381.353-.552a6.507 6.507 0 0 0-4.666 5.5Zm10.181 1.5c-.144 2.074-.866 3.756-1.58 4.948-.12.197-.237.381-.353.552a6.507 6.507 0 0 0 4.666-5.5Zm2.733-1.5a6.507 6.507 0 0 0-4.666-5.5c.123.181.24.365.353.552.714 1.192 1.436 2.874 1.58 4.948Z',
    },
    issues: {
      title: 'Issues',
      tooltip: 'Issues (G + I)',
      icon: 'issue-opened',
      href: () => 'https://github.com/issues',
      path: 'M8 9.5a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3ZM8 0a8 8 0 1 1 0 16A8 8 0 0 1 8 0ZM1.5 8a6.5 6.5 0 1 0 13 0 6.5 6.5 0 0 0-13 0Z',
    },
    pulls: {
      title: 'Pull requests',
      tooltip: 'Pull requests (G + P)',
      icon: 'git-pull-request',
      href: () => 'https://github.com/pulls',
      path: 'M1.5 3.25a2.25 2.25 0 1 1 3 2.122v5.256a2.251 2.251 0 1 1-1.5 0V5.372A2.25 2.25 0 0 1 1.5 3.25Zm5.677-.177L9.573.677A.25.25 0 0 1 10 .854V2.5h1A2.5 2.5 0 0 1 13.5 5v5.628a2.251 2.251 0 1 1-1.5 0V5a1 1 0 0 0-1-1h-1v1.646a.25.25 0 0 1-.427.177L7.177 3.427a.25.25 0 0 1 0-.354ZM3.75 2.5a.75.75 0 1 0 0 1.5.75.75 0 0 0 0-1.5Zm0 9.5a.75.75 0 1 0 0 1.5.75.75 0 0 0 0-1.5Zm8.25.75a.75.75 0 1 0 1.5 0 .75.75 0 0 0-1.5 0Z',
    },

  };

  const NON_REPO_FIRST = new Set([
    'settings','orgs','organizations','notifications','issues','pulls','marketplace',
    'explore','topics','collections','sponsors','search','apps','features','pricing',
    'about','codespaces','gist','login','join'
  ]);

  function getRepoBase() {
    const path = location.pathname.replace(/\/+$/, '');
    const parts = path.split('/').filter(Boolean);
    if (parts.length < 2) return null;
    const [seg1, seg2] = parts;
    if (NON_REPO_FIRST.has(seg1)) return null;
    if (!seg2 || seg2.includes('#') || seg2.includes('?')) return null;
    return `/${seg1}/${seg2}`;
  }

  function goRepoTab(tab) {
    const base = getRepoBase();
    if (!base) return false;
    const url = tab ? `https://github.com${base}/${tab}` : `https://github.com${base}`;
    location.href = url;
    return true;
  }

  function goRepoOr(tab, globalUrl) {
    const base = getRepoBase();
    if (base) {
      location.href = tab ? `https://github.com${base}/${tab}` : `https://github.com${base}`;
    } else {
      location.href = globalUrl;
    }
    return true;
  }

  const GITHUB_SHORTCUTS = {
    'KeyG KeyD': () => { location.href = 'https://github.com/'; return true; },
    'KeyG KeyN': () => { location.href = 'https://github.com/notifications'; return true; },
    'KeyG KeyC': () => goRepoTab(''),
    'KeyG KeyA': () => goRepoTab('actions'),
    'KeyG KeyB': () => goRepoTab('projects'),
    'KeyG KeyW': () => goRepoTab('wiki'),
    'KeyG KeyG': () => goRepoTab('discussions'),
    'KeyG KeyI': () => goRepoOr('issues', 'https://github.com/issues'),
    'KeyG KeyP': () => goRepoOr('pulls', 'https://github.com/pulls'),
    'KeyG KeyR': () => { const u = getUserLogin(); if (!u) return false; location.href = `https://github.com/${u}?tab=repositories`; return true; },
    'KeyG KeyT': () => { const u = getUserLogin(); if (!u) return false; location.href = `https://github.com/${u}?tab=projects`; return true; },
    'KeyG KeyK': () => { const u = getUserLogin(); if (!u) return false; location.href = `https://github.com/${u}?tab=packages`; return true; },
    'KeyG KeyS': () => { const u = getUserLogin(); if (!u) return false; location.href = `https://github.com/${u}?tab=stars`; return true; },
    'KeyG KeyJ': () => { const u = getUserLogin(); if (!u) return false; location.href = `https://gist.github.com/${u}`; return true; },
    'KeyG KeyO': () => { location.href = 'https://github.com/settings/organizations'; return true; },
    'KeyG KeyE': () => { location.href = 'https://github.com/settings/enterprises'; return true; },
  };

  const HOTKEY_MAP = new Map(Object.entries(GITHUB_SHORTCUTS));

  const placeShortcuts = () => {
    if (document.getElementById(ID_CONTAINER)) return;
    const { parent, beforeNode } = resolveMountPoint();
    if (!parent || !beforeNode) return;
    const container = createContainer();
    (CONFIG.order || Object.keys(BUTTONS)).forEach((key) => {
      const info = BUTTONS[key];
      if (!info) return;
      if (CONFIG[key]) container.appendChild(createButton(info));
    });
    injectCSS();
    parent.insertBefore(container, beforeNode);
  };

  (() => {
    let buf = [], timer = null;
    const reset = () => { buf = []; if (timer) { clearTimeout(timer); timer = null; } };
    const wait = () => { if (timer) clearTimeout(timer); timer = setTimeout(reset, 800); };
    const hasPrefix = seq => { for (const k of HOTKEY_MAP.keys()) if (k.startsWith(seq)) return true; return false; };
    const isTyping = el => el && (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA' || el.isContentEditable || el.closest?.('[contenteditable="true"]'));

    window.addEventListener('keydown', e => {
      if (!e.isTrusted || e.repeat || e.ctrlKey || e.altKey || e.metaKey) return;
      if (isTyping(document.activeElement)) return;

      if (e.shiftKey && e.code === 'Slash') {
        e.preventDefault();
        document.dispatchEvent(new KeyboardEvent('keydown', { key: '?', code: 'Slash', shiftKey: true, bubbles: true }));
        reset(); return;
      }

      buf.push(e.code);
      const seq = buf.join(' ');
      if (HOTKEY_MAP.has(seq)) { const handled = HOTKEY_MAP.get(seq)(); if (handled !== false) reset(); else wait(); return; }
      hasPrefix(seq) ? wait() : reset();
    });
  })();

  const observer = new MutationObserver(() => {
    if (!document.getElementById(ID_CONTAINER)) placeShortcuts();
  });

  placeShortcuts();
  observer.observe(document.documentElement, { childList: true, subtree: true });
})();
