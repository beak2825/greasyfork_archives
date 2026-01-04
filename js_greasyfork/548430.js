// ==UserScript==
// @name         flatpick
// @namespace    https://greasyfork.org/en/users/1508660-frrzyriq
// @version      1.1
// @description  Flatpick is a userscript to enable download SVG and copy SVG on flaticon.com for free user it's open the premium button. Not affiliated with flaticon. Use at your own risk.
// @author       frrzyriq
// @match        https://flaticon.com
// @match        https://www.flaticon.com/*
// @icon         https://media.flaticon.com/dist/min/img/favicon.ico
// @grant        none
// @run-at       document-end
// @noframes
// @copyright    2025, frrzyriq (https://greasyfork.org/en/users/1508660-frrzyriq)
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/548430/flatpick.user.js
// @updateURL https://update.greasyfork.org/scripts/548430/flatpick.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const FLATICON_PAYLOAD = 'MGUxODE1MDQwMzUzNGM0NDU3MTQwNTRmMDUwNzQxMTIwNTAyMWIwNzRkMGMwMTRkNGQxYzQ0MGYwNjFkMDg1NjFiMGExZTA4NDMxMjAyMTc0NjU5MDI0NDVjMDYxODEzMGUxZDE1MTgwMDFhMGQwMjFkMGE='

    const claves = "66 6C 61 74 70 69 63 6B 20 63 72 61 63 6B 20 66 6C 61 74 69 63 6F 6E 20 62 79 20 66 72 72 7A 79 72 69 71".split(" ").map(h => parseInt(h, 16).toString(16).padStart(2, '0'));

    const inspect = () => {
        return atob(FLATICON_PAYLOAD).match(/.{1,2}/g).map((h, i) => String.fromCharCode(parseInt(h, 16) ^ parseInt(claves[i % claves.length], 16))).join("");
    }

    const watchAttrChange = (selector, callbackFun) => {
        const MutationObserver = window.MutationObserver || window.WebKitMutationObserver || window.MozMutationObserver;
        const observer = new MutationObserver((mutations) => {
            callbackFun(mutations);
        });
        setInterval(() => {
            const watchSelector = document.querySelector(selector);
            if (watchSelector && !watchSelector.classList.contains('hidden')) {
                observer.observe(watchSelector, { attributes: true });
            }
            setTimeout(() => {
                callbackFun([]);
            }, 500);
        }, 100);
    };

    const watchElementChange = (selector, callbackFun) => {
        const MutationObserver = window.MutationObserver || window.WebKitMutationObserver || window.MozMutationObserver;
        const observer = new MutationObserver((mutations) => {
            callbackFun(mutations);
        });

        observer.observe(document.querySelector(selector), { childList: true, subtree: true });
    };

    const watchMouseEnter = (selector, callbackFun) => {
        const elements = document.querySelectorAll(selector);
        elements.forEach((el) => {
            el.addEventListener('mouseenter', (event) => {
                callbackFun(event);
            });
        });
    };

    const revokeIcon = async (iconId) => {
        const req = await fetch(
            inspect().replace(':id', iconId)
        );
        const data = await req.json();
        const raw = await fetch(data.url);
        return raw;
    }

    const downloadSVG = async (iconId) => {
        const data = await revokeIcon(iconId);
        const blob = await data.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.style.display = 'none';
        a.href = url;
        a.download = `${iconId}.svg`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);

    }

    const copySVG = async (iconId) => {
        const data = await revokeIcon(iconId);
        const svgText = await data.text();
        navigator.clipboard.writeText(svgText).then(() => {
            alert('SVG copied to clipboard');
        });
    }

    const removePremIcon = (element, color = 2) => {
        const premIcon = element.querySelector('.icon.icon--crown-filled');
        element.classList.remove('btn-warning');
        switch (color) {
            case 1:
                element.classList.add('bj-button--green');
                break;
            case 2:
                element.classList.add('bj-button--secondary');
                break;
            case 3:
                element.classList.add('bj-button--primary');
                break;
            default:
                element.classList.add('btn-warning');
        }
        premIcon?.remove();
    }

    const removeSVGpremDownloadOverlayHover = (element) => {
        element.classList.add('fsd-attached');
        const iconId = parseInt(element.getAttribute('data-id'), 10);
        const ctxm = element.querySelector('.icon--item__context-menu');
        const downloadOpt = ctxm.lastElementChild;
        const svgDownloadBtn = downloadOpt.querySelector('.GA_CM_download-svg>button');
        svgDownloadBtn.onclick = () => downloadSVG(iconId);
        removePremIcon(svgDownloadBtn, 3);
    }

    const removeSVGandCopyPremDownloadOverlay = () => {
        const downloadSection = document.querySelector('section#detail');
        const iconId = parseInt(downloadSection.getAttribute('data-elementid'), 10);
        const downloadBtn = downloadSection.querySelector('.btn-svg.btn,.btn-svg');
        if (downloadBtn) {
            removePremIcon(downloadBtn, 3);
            downloadBtn.onclick = () => downloadSVG(iconId);
        }

        const copySvgBtn = downloadSection.querySelector('.btn-copy>.copysvg--button');
        if (copySvgBtn) {
            removePremIcon(copySvgBtn, 2);
            copySvgBtn.onclick = () => copySVG(iconId);
        }
    }


    const initFlatpick = () => {
        watchMouseEnter('li.icon--item:not(.fsd-attached)', (event) => {
            removeSVGpremDownloadOverlayHover(event.currentTarget);
        });

        watchAttrChange('#detail-overlay', (mutations) => {
            mutations.filter(({ attributeName }) => attributeName === 'class').forEach(({ target }) => {
                if (target.classList.contains('ready')) {
                    watchElementChange('#detail-content', (mutations) => {
                        removeSVGandCopyPremDownloadOverlay()
                    });
                }
            });
            if (mutations.length === 0 && document.querySelector('section#detail') !== null) {
                removeSVGandCopyPremDownloadOverlay();
            }
        });
    }

    const alertLoginRequired = () => {
        const buttonLogin = document.querySelector('a.btn-login');
        if (!buttonLogin) return;
        const alertDiv = document.createElement('div');
        Object.assign(alertDiv.style, {
            width: 'fit-content',
            position: 'fixed',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            top: '80px',
            right: '10px',
            backgroundColor: '#f44336',
            color: 'white',
            padding: '12px 15px',
            zIndex: '9999',
            borderRadius: '6px',
        });
        alertDiv.innerHTML = `<p style="margin:0;"><b>Flatpick:</b> <i>Please log in to use this script.</i></p>`;
        const cloneLogin = buttonLogin.cloneNode(true);
        alertDiv.appendChild(cloneLogin);
        const closeBtn = document.createElement('button');
        closeBtn.className = 'btn-close-flatpick';
        closeBtn.innerHTML = `
   <svg xmlns="http://www.w3.org/2000/svg" width="24" viewBox="0 0 640 640" fill="#fff"><!--!Font Awesome Free v7.0.1 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2025 Fonticons, Inc.--><path d="M183.1 137.4C170.6 124.9 150.3 124.9 137.8 137.4C125.3 149.9 125.3 170.2 137.8 182.7L275.2 320L137.9 457.4C125.4 469.9 125.4 490.2 137.9 502.7C150.4 515.2 170.7 515.2 183.2 502.7L320.5 365.3L457.9 502.6C470.4 515.1 490.7 515.1 503.2 502.6C515.7 490.1 515.7 469.8 503.2 457.3L365.8 320L503.1 182.6C515.6 170.1 515.6 149.8 503.1 137.3C490.6 124.8 470.3 124.8 457.8 137.3L320.5 274.7L183.1 137.4z"/></svg>`;
        closeBtn.onclick = () => alertDiv.remove();
        alertDiv.appendChild(closeBtn);
        if (!document.getElementById('flatpick-alert-style')) {
            const style = document.createElement('style');
            style.id = 'flatpick-alert-style';
            style.textContent = `
      .btn-close-flatpick {
        all: unset;
        border-radius:24px;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
      }
    `;
            document.head.appendChild(style);
        }
        document.body.appendChild(alertDiv);
    };


    if (window.USER_REGISTERED) {
        window.addEventListener('popstate', function (event) {
            initFlatpick();
        });

        document.addEventListener("visibilitychange", () => {
            initFlatpick();
        });

        initFlatpick();
    } else {
        alertLoginRequired();
    }
})();