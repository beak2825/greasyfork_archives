// ==UserScript==
// @name         KiwiFarms Quick Stick
// @description  QoL sticker adder
// @namespace    kf-quick-stick
// @author       wormpilled
// @license      MIT
// @version      1.0
// @match        https://kiwifarms.st/threads/*
// @run-at       document-end
// @grant        none
// @icon         https://kiwifarms.st/favicon.ico
// @downloadURL https://update.greasyfork.org/scripts/560124/KiwiFarms%20Quick%20Stick.user.js
// @updateURL https://update.greasyfork.org/scripts/560124/KiwiFarms%20Quick%20Stick.meta.js
// ==/UserScript==

(function () {
    'use strict';

    let activeToast = null;

    document.addEventListener('click', function (e) {
        const link = e.target.closest('a.reactionsBar-link');
        if (!link) return;

        e.preventDefault();
        e.stopImmediatePropagation();

        const url = new URL(link.href, location.origin);
        const reactionId = url.searchParams.get('reaction_id');
        if (!reactionId) {
            return;
        }

        const postMatch = link.href.match(/\/posts\/(\d+)\//);
        if (!postMatch) {
            return;
        }

        const postId = postMatch[1];

        react(postId, reactionId);
    }, true);

    // todo cleanup
    function getCsrf() {
        const meta = document.querySelector('meta[name="csrf-token"]');
        if (meta?.content) {
            return meta.content;
        }

        const input = document.querySelector('input[name="_xfToken"]');
        if (input?.value) {
            return input.value;
        }

        const scriptConfig = document.documentElement.innerHTML.match(/"csrf":"([^"]+)"/);
        if (scriptConfig) {
            return scriptConfig[1];
        }

        const m = document.cookie.match(/(?:^|;\s*)xf_csrf=([^;]+)/);
        if (m) {
            return decodeURIComponent(m[1]);
        }

        return null;
    }

    function react(postId, reactionId) {
        const csrf = getCsrf();
        if (!csrf) {
            toast('Error: No CSRF Token');
            return;
        }

        const formData = new URLSearchParams();
        formData.append('_xfResponseType', 'json');
        formData.append('_xfWithData', '1');
        formData.append('_xfRequestUri', location.pathname + location.search);
        formData.append('_xfToken', csrf);
        formData.append('reaction_id', reactionId);

        const requestUrl = new URL(`/posts/${postId}/react`, location.origin).href;

        fetch(requestUrl, {
            method: 'POST',
            credentials: 'same-origin',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
                'X-Requested-With': 'XMLHttpRequest',
                'Accept': 'application/json'
            },
            body: formData
        })
        .then(r => {
            if (!r.ok) {
                if (r.status === 429) {
                    toast('⚠ Rate Limited! Wait before reacting again'); // todo
                    throw new Error('Rate limited');
                } else if (r.status === 403) {
                    toast('Error: Forbidden (403)');
                    throw new Error('Forbidden');
                }
            }

            return r.json();
        })
        .then(data => {
            if (data.errors && data.errors.length > 0) {
                toast(`✗ ${data.errors[0]}`);
            } else if (data?.status === 'ok' || data.hasOwnProperty('reactionId')) {
                const isRemoval = data.reactionId === null;

                if (isRemoval) {
                    toast('✗ Reaction removed');
                } else {
                    const reactionInfo = getReactionInfo(data);
                    toast(reactionInfo.name, reactionInfo.sprite);
                }

                updateReactionBar(postId, data);
            } else {
                toast('⚠ Unknown response');
            }
        })
        .catch(err => {
            toast('✗ Network error');
        });
    }

    function toast(text, spriteClass) {
        // kill toasts
        if (activeToast) {
            activeToast.remove();
            activeToast = null;
        }

        const d = document.createElement('div');

        if (spriteClass) {
            const reactionSpan = document.createElement('span');
            reactionSpan.className = spriteClass;
            reactionSpan.innerHTML = '<i aria-hidden="true"></i><img src="data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7" class="reaction-sprite js-reaction" />';
            d.appendChild(reactionSpan);
            d.appendChild(document.createTextNode(' ' + text));
        } else {
            d.textContent = text;
        }

        Object.assign(d.style, {
            position: 'fixed',
            top: '20px',
            right: '20px',
            background: '#222',
            color: '#fff',
            padding: '8px 12px',
            border: '1px solid #555',
            zIndex: 99999,
            fontSize: '13px',
            borderRadius: '4px',
            boxShadow: '0 2px 5px rgba(0,0,0,0.5)',
            display: 'flex',
            alignItems: 'center',
            gap: '4px'
        });

        document.body.appendChild(d);
        activeToast = d;

        setTimeout(() => {
            if (d.parentNode) {
                d.remove();
            }
            if (activeToast === d) {
                activeToast = null;
            }
        }, 2500);
    }

    function getReactionInfo(data) {
        if (data.html && data.html.content) {
            const tempDiv = document.createElement('div');
            tempDiv.innerHTML = data.html.content;

            const reactionSpan = tempDiv.querySelector('.reaction');
            if (reactionSpan) {
                const img = reactionSpan.querySelector('img');
                const reactionName = img ? img.getAttribute('alt') : 'Reaction';
                const spriteClass = reactionSpan.className;
                return { name: reactionName, sprite: spriteClass };
            }
        }

        return { name: `Reaction ${data.reactionId || ''}`, sprite: null };
    }

    function updateReactionBar(postId, data) {
        const postContainer = document.querySelector(`[data-content="post-${postId}"]`) ||
                              document.getElementById(`js-post-${postId}`);

        if (!postContainer) {
            return;
        }

        const reactionSummary = postContainer.querySelector('.reactPlusSummary');

        if (!reactionSummary) {
            return;
        }

        if (data.reactionList && data.reactionList.content) {
            const tempDiv = document.createElement('div');
            tempDiv.innerHTML = data.reactionList.content;
            const newSummary = tempDiv.querySelector('.reactPlusSummary');

            if (newSummary) {
                reactionSummary.innerHTML = newSummary.innerHTML;
            }
        }
    }
})();