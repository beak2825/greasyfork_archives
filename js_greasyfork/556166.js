// ==UserScript==
// @name         GitHub Wiki Launchers
// @version      1.1.0
// @description  Buttons for opening the current GitHub repository on DeepWiki or codewiki.google.
// @match        *://github.com/*
// @license      MIT
// @namespace https://greasyfork.org/users/1412785
// @downloadURL https://update.greasyfork.org/scripts/556166/GitHub%20Wiki%20Launchers.user.js
// @updateURL https://update.greasyfork.org/scripts/556166/GitHub%20Wiki%20Launchers.meta.js
// ==/UserScript==

(() => {
    'use strict';

    const SCRIPT_ID = 'github-wiki-actions';
    const ACTION_LIST_SELECTORS = Object.freeze([
        'ul.UnderlineNav-actions',
        'ul.pagehead-actions',
    ]);
    const HISTORY_METHODS = ['pushState', 'replaceState'];
    const URL_EVENTS = ['pjax:end', 'turbo:render', 'turbo:load', 'popstate'];
    const TREE_BRANCHES = new Set(['main', 'master']);
    const BUTTONS = Object.freeze([
        {
            id: 'deepwiki',
            label: 'DeepWiki',
            title: 'Open this repository on DeepWiki',
            href: (repoPath) => `https://deepwiki.com${repoPath}`,
        },
        {
            id: 'codewiki',
            label: 'CodeWiki',
            title: 'Open this repository on codewiki.google',
            href: (repoPath) => `https://codewiki.google/github.com${repoPath}`,
        },
    ]);

    const cleanups = new Set();
    let fatalError = null;
    let lastRenderedRepo = null;

    const rerender = (reason = 'manual') => {
        if (fatalError) {
            return;
        }
        try {
            updateButtons();
        } catch (error) {
            fatalError = error instanceof Error ? error : new Error(String(error));
            teardown();
            console.error(`[${SCRIPT_ID}] ${reason}`, fatalError);
            throw fatalError;
        }
    };

    function registerCleanup(task) {
        cleanups.add(task);
    }

    function teardown() {
        cleanups.forEach((task) => {
            try {
                task();
            } catch (error) {
                console.error(`[${SCRIPT_ID}] cleanup failure`, error);
            }
        });
        cleanups.clear();
    }

    function normalizeRepoPath(pathname) {
        const trimmed = pathname.replace(/\/+$/, '');
        const segments = trimmed.split('/').filter(Boolean);
        if (segments.length < 2) {
            return null;
        }

        const [owner, repo, third, fourth] = segments;
        if (!owner || !repo) {
            return null;
        }

        if (segments.length === 2) {
            return `/${owner}/${repo}`;
        }

        if (third === 'tree' && TREE_BRANCHES.has(fourth ?? '')) {
            return `/${owner}/${repo}`;
        }

        return null;
    }

    function findActionList() {
        for (const selector of ACTION_LIST_SELECTORS) {
            const list = document.querySelector(selector);
            if (list) {
                return list;
            }
        }
        return null;
    }

    function purgeButtons(list) {
        list.querySelectorAll(`[data-${SCRIPT_ID}]`).forEach((node) => node.remove());
    }

    function createButton(definition, repoPath) {
        const item = document.createElement('li');
        item.setAttribute(`data-${SCRIPT_ID}`, definition.id);

        const anchor = document.createElement('a');
        anchor.classList.add('btn', 'btn-sm');
        anchor.target = '_blank';
        anchor.rel = 'noreferrer noopener';
        anchor.href = definition.href(repoPath);
        anchor.textContent = definition.label;
        anchor.title = definition.title;

        item.appendChild(anchor);
        return item;
    }

    function updateButtons() {
        const repoPath = normalizeRepoPath(location.pathname);
        const list = repoPath ? findActionList() : null;

        if (!repoPath) {
            lastRenderedRepo = null;
            if (list) {
                purgeButtons(list);
            }
            return;
        }

        if (!list) {
            if (document.readyState === 'complete') {
                throw new Error('GitHub repository action list missing; cannot inject wiki buttons.');
            }
            return;
        }

        if (lastRenderedRepo === repoPath && list.querySelector(`[data-${SCRIPT_ID}]`)) {
            return;
        }

        purgeButtons(list);
        const fragment = document.createDocumentFragment();
        BUTTONS.forEach((definition) => fragment.appendChild(createButton(definition, repoPath)));
        list.insertBefore(fragment, list.firstChild);
        lastRenderedRepo = repoPath;
    }

    function observeDomMutations() {
        const body = document.body;
        if (!body) {
            throw new Error('document.body missing; cannot observe mutations.');
        }
        const observer = new MutationObserver(() => rerender('mutation'));
        observer.observe(body, { childList: true, subtree: true });
        registerCleanup(() => observer.disconnect());
    }

    function observeUrlChanges() {
        URL_EVENTS.forEach((eventName) => {
            const handler = () => rerender(`event:${eventName}`);
            window.addEventListener(eventName, handler, { passive: true });
            registerCleanup(() => window.removeEventListener(eventName, handler));
        });

        HISTORY_METHODS.forEach((method) => {
            const original = history[method];
            if (typeof original !== 'function') {
                return;
            }
            history[method] = function patchedHistory(...args) {
                const result = original.apply(this, args);
                rerender(`history:${method}`);
                return result;
            };
            registerCleanup(() => {
                history[method] = original;
            });
        });
    }

    function bootstrap() {
        observeDomMutations();
        observeUrlChanges();
        rerender('bootstrap');
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', bootstrap, { once: true });
    } else {
        bootstrap();
    }
})();
