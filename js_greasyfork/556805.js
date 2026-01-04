// ==UserScript==
// @name         wxw.moe Snapshot to X
// @namespace    https://github.com/neura-neura/userscripts
// @version      2025.11.24
// @description  Creates a clean symmetric-padded snapshot of a Mastodon post and copies it as an image for sharing on X
// @author       neura-neura
// @match        https://wxw.moe/*
// @match        https://*.wxw.moe/*
// @match        https://x.com/*
// @match        https://twitter.com/*
// @match        https://mobile.x.com/*
// @match        https://mobile.twitter.com/*
// @require      https://cdn.jsdelivr.net/npm/html2canvas@1.4.1/dist/html2canvas.min.js
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/556805/wxwmoe%20Snapshot%20to%20X.user.js
// @updateURL https://update.greasyfork.org/scripts/556805/wxwmoe%20Snapshot%20to%20X.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const X_ICON = '<path fill="currentColor" d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231 4.731-6.231zm-1.161 17.52h1.833L7.084 4.126H5.117l11.966 15.644z"/>';

    function showToast(message) {
        const toast = document.createElement('div');
        toast.textContent = message;
        toast.style.cssText = `
            position: fixed;
            bottom: 140px;
            left: 50%;
            transform: translateX(-50%);
            min-width: 340px;
            padding: 18px 32px;
            border-radius: 20px;
            color: #ffffff;
            font-size: 17px;
            font-weight: 600;
            text-align: center;
            font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
            background: #1da1f2;
            box-shadow: 0 10px 40px rgba(0,0,0,0.35);
            z-index: 2147483647;
            opacity: 0;
            transition: opacity 0.5s ease;
        `;
        document.body.appendChild(toast);

        requestAnimationFrame(() => toast.style.opacity = '1');

        setTimeout(() => {
            toast.style.opacity = '0';
            setTimeout(() => toast.remove(), 500);
        }, 4200);
    }

    if (location.hostname.endsWith('x.com') || location.hostname.endsWith('twitter.com')) {
        const params = new URLSearchParams(location.search);
        if (params.has('grok_mastodon_share')) {
            showToast('Image copied to clipboard. Paste with Ctrl+V.');
            params.delete('grok_mastodon_share');
            history.replaceState({}, '', location.pathname + (params.toString() ? '?' + params.toString() : '') + location.hash);
        }
    }

    async function addButton() {
        const bar = document.querySelector('.detailed-status__action-bar');
        if (!bar || bar.querySelector('.x-to-image-btn')) return;

        const wrapper = document.createElement('div');
        wrapper.className = 'detailed-status__button';

        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'icon-button x-to-image-btn';
        btn.title = 'Share to X as image';
        btn.setAttribute('aria-label', 'Share to X as image');

        const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        svg.setAttribute('viewBox', '0 0 24 24');
        svg.setAttribute('width', '24');
        svg.setAttribute('height', '24');
        svg.classList.add('icon');
        svg.innerHTML = X_ICON;
        btn.appendChild(svg);
        wrapper.appendChild(btn);

        const moreBtn = bar.querySelector('.detailed-status__action-bar-dropdown');
        if (moreBtn) bar.insertBefore(wrapper, moreBtn);
        else bar.appendChild(wrapper);

        btn.addEventListener('click', shareToX);
    }

    function forceLightMode(node) {
        const all = [node, ...node.querySelectorAll('*')];
        all.forEach(el => {
            el.style.setProperty('color', '#000000', 'important');
            el.style.setProperty('background-color', 'transparent', 'important');
            el.style.setProperty('fill', '#000000', 'important');
            el.style.setProperty('stroke', '#000000', 'important');
            el.style.setProperty('border-color', '#dddddd', 'important');
            el.style.setProperty('opacity', '1', 'important');
            el.style.setProperty('filter', 'none', 'important');
            el.style.setProperty('box-shadow', 'none', 'important');
            if (el.tagName === 'A') el.style.setProperty('color', '#1da1f2', 'important');
        });
        node.style.setProperty('background-color', '#ffffff', 'important');
    }

    async function proxyImages(node) {
        const imgs = node.querySelectorAll('img');
        const promises = [];
        for (const img of imgs) {
            let src = img.src || img.dataset.src || (img.getAttribute('srcset')?.split(',')[0].trim().split(' ')[0]);
            if (src && !src.startsWith('data:') && !src.startsWith('blob:')) {
                promises.push(
                    fetch(src, {cache: 'no-cache'})
                        .then(r => r.ok ? r.blob() : Promise.reject())
                        .then(blob => {
                            const url = URL.createObjectURL(blob);
                            img.src = url;
                            img.srcset = url;
                            return url;
                        })
                        .catch(() => null)
                );
            }
        }
        return Promise.all(promises);
    }

    async function shareToX(e) {
        e.preventDefault();
        e.stopPropagation();

        const btn = e.currentTarget;
        btn.disabled = true;
        btn.style.opacity = '0.5';

        const status = document.querySelector('.detailed-status');
        if (!status) {
            btn.disabled = false;
            btn.style.opacity = '';
            return;
        }

        const clone = status.cloneNode(true);
        forceLightMode(clone);

        clone.querySelectorAll('.status__content__translate-button, .media-gallery__actions, .media-gallery__actions__pill, .status__content__spoiler, .media-gallery__gifv__label').forEach(el => el.remove());

        const metaLines = clone.querySelectorAll('.detailed-status__meta__line');
        if (metaLines.length >= 1) {
            const dateLink = metaLines[0].querySelector('a.detailed-status__datetime');
            if (dateLink) metaLines[0].innerHTML = dateLink.outerHTML;
        }
        if (metaLines.length >= 2) metaLines[1].style.display = 'none';

        const meta = clone.querySelector('.detailed-status__meta');
        if (meta) meta.style.marginBottom = '16px';

        const objectUrls = await proxyImages(clone);

        const wrapper = document.createElement('div');
        wrapper.style.cssText = `
            position: fixed;
            top: -9999px;
            left: -9999px;
            background: #ffffff !important;
            padding: 1px 28px !important;
            border-radius: 24px;
            box-shadow: 0 12px 40px rgba(0,0,0,0.18);
            width: fit-content;
            max-width: 680px;
            font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
        `;
        wrapper.appendChild(clone);
        document.body.appendChild(wrapper);

        try {
            const canvas = await html2canvas(wrapper, {
                scale: 2,
                useCORS: true,
                allowTaint: true,
                backgroundColor: null,
                logging: false
            });

            const blob = await new Promise(resolve => canvas.toBlob(resolve, 'image/png'));
            if (blob) {
                await navigator.clipboard.write([new ClipboardItem({ 'image/png': blob })]);

                const timeLink = status.querySelector('a.detailed-status__datetime');
                const postUrl = timeLink ? new URL(timeLink.href, location.href).href : location.href;
                const account = status.querySelector('.display-name__account')?.textContent.trim() || '';
                const via = account ? `\n— ${account.substring(1)}` : '\n(via Mastodon)';

                const url = new URL('https://x.com/intent/tweet');
                url.searchParams.set('text', postUrl + via);
                url.searchParams.set('grok_mastodon_share', '1');

                window.open(url.toString(), '_blank');
            }
        } catch (err) {
            console.error(err);
            const toast = document.createElement('div');
            toast.textContent = 'Error generating image';
            toast.style.cssText = 'position:fixed;top:20px;left:50%;transform:translateX(-50%);background:#e74c3c;color:white;padding:15px 25px;border-radius:12px;z-index:99999;font-size:15px;';
            document.body.appendChild(toast);
            setTimeout(() => toast.remove(), 5000);
        } finally {
            objectUrls.forEach(u => u && URL.revokeObjectURL(u));
            document.body.removeChild(wrapper);
            btn.disabled = false;
            btn.style.opacity = '';
        }
    }

    if (location.hostname.endsWith('wxw.moe')) {
        const observer = new MutationObserver(addButton);
        observer.observe(document.body, { childList: true, subtree: true });
        if (document.querySelector('.detailed-status__action-bar')) addButton();
    }
})();
