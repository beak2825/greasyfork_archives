// ==UserScript==
// @name         Hanime按钮添加
// @namespace    https://www.tampermonkey.net/
// @version      1.7
// @description  添加镜像网站的Hanime缺失的搜索框和评论浮动切换按钮。
// @author       Grok && Aloazny
// @match        https://www.hanime1-me.icu/*
// @match        https://www.hanime365.top/*
// @match        https://www.hanime365.icu/*
// @match        https://hanime*.*/*
// @match        https://www.hanime*.*/*
// @match        https://*.hanime*.*/*
// @grant        none
// @icon         data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADMAAABLCAMAAADqDk+0AAAABGdBTUEAALGPC/xhBQAAACBjSFJNAAB6JgAAgIQAAPoAAACA6AAAdTAAAOpgAAA6mAAAF3CculE8AAAAsVBMVEUAAAD/AAD/AFX/AAC/QEDMMzPVKyvbJCTjHDnfICDmGjPRFy7VKyvYJyfdIjPbJCTfICvZISvbHyrcHi3bIC7bHy3ZIS7bIC3dHi7cHy3aIizbISvaHyzbISvbHyvbICzbICzbICzaISvbIC3bICzbHyzbISzbICzbIC3bICzbHyzbIC3bICzbICzbICvaICzcICvbHyzbICzbICzbICzbICzbICzbHyzbICzbICzbICyToObtAAAAOnRSTlMAAQMCBAUGBwkICgsMDQ8OGC8xMzg5PT9DSUxNUlRruLm6vMjJy8zNztLT1NXW2djf4/D09fb6+/3+PvP7WAAAAP1JREFUeNrtltkOgjAQRVtoccF9w33fd8WF6f9/mJpI+2LiKFKj4T7e5OSUoZAhKntxj5cj9FZQYk/9DjrkUY7CD/UZspRd/yFzEH5Mycxl13vCsDcYQ4NHJ8M/5Olq8HyfcYM8j2Io3mPhzxbIwyQT7tzwHjfQO03FMtlb7OQS7VHdGMtAJV+tN1vNhuNs0Gc7S1qgGZUwGPcdT8T8CAMCwPM8AMAz2/V8MhwMJ7PNCc20a9VSsVAsO60dlgHVjdEe1Y1eYBi3LIu/8g+xY2n7mlQ8uUIzCcIN0zQNyhZ/sR+waK/Sv4tRXXML18Oj+yZ49P0IQ9O9Vp6fm/UFwSt7O0hMcz0AAAAASUVORK5CYII=
// @license      MIT
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/561515/Hanime%E6%8C%89%E9%92%AE%E6%B7%BB%E5%8A%A0.user.js
// @updateURL https://update.greasyfork.org/scripts/561515/Hanime%E6%8C%89%E9%92%AE%E6%B7%BB%E5%8A%A0.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function createCustomSearchFloatButton() {
        const style = document.createElement('style');
        style.textContent = `#search-form,#search-form input#nav-query,#search-form .search-nav-bar,#search-form img[style*="position: absolute"][style*="left: 10px"],form#search-form{display:none!important}
        #custom-float-search-btn{position:fixed;bottom:85px;right:28px;width:62px;height:62px;background:rgba(30,30,40,.68);backdrop-filter:blur(12px);-webkit-backdrop-filter:blur(12px);border-radius:50%;border:1px solid rgba(100,100,120,.35);box-shadow:0 5px 18px rgba(0,0,0,.5);display:flex;align-items:center;justify-content:center;z-index:2147483646;cursor:pointer;transition:all .25s ease}
        #custom-float-search-btn:hover{transform:scale(1.12);background:rgba(40,40,55,.78)}
        #custom-float-search-btn:active{transform:scale(.92)}
        .search-widget-icon{width:34px!important;height:34px!important}
        #custom-search-modal{position:fixed;inset:0;background:rgba(0,0,0,.8);backdrop-filter:blur(16px);-webkit-backdrop-filter:blur(16px);display:none;align-items:center;justify-content:center;z-index:2147483647}
        #custom-search-modal.show{display:flex!important}
        #custom-search-dialog{background:#181818;border:1px solid #333;border-radius:12px;padding:28px 32px;width:90%;max-width:440px;box-shadow:0 15px 45px rgba(0,0,0,.7);animation:popIn .5s cubic-bezier(.34,1.56,.64,1)}
        @keyframes popIn{0%{opacity:0;transform:scale(.75) translateY(30px)}55%{opacity:1;transform:scale(1.08) translateY(-8px)}80%{transform:scale(.96) translateY(4px)}100%{transform:scale(1) translateY(0)}}
        .search-input-wrapper{position:relative;width:100%}
        #custom-search-input{width:100%;height:52px;background:#222;border:1px solid #444;border-radius:8px;color:#ddd;font-size:16px;padding:0 56px 0 16px;outline:none;box-sizing:border-box}
        #custom-search-input:focus{border-color:#555;box-shadow:0 0 0 2px rgba(80,80,100,.4)}
        #custom-search-clear{position:absolute;right:8px;top:50%;transform:translateY(-50%);width:38px;height:38px;background:#333;border-radius:50%;color:#bbb;font-size:18px;font-weight:700;display:flex;align-items:center;justify-content:center;cursor:pointer;transition:all .15s}
        #custom-search-clear:hover{background:#444;color:#eee}
        #custom-search-clear:active{transform:translateY(-50%) scale(.92)}
        #tablinks-wrapper{display:none!important}
        #floating-tab-switch{position:fixed;bottom:170px;right:20px;background:rgba(30,30,40,.85);backdrop-filter:blur(12px);-webkit-backdrop-filter:blur(12px);border-radius:25px;border:1px solid rgba(100,100,120,.35);box-shadow:0 5px 18px rgba(0,0,0,.5);display:flex;align-items:center;justify-content:center;z-index:2147483645;cursor:pointer;transition:all .25s ease;padding:8px 16px;color:#ddd;font-size:14px;font-weight:bold}
        #floating-tab-switch:hover{background:rgba(40,40,55,.95);transform:scale(1.05)}
        #floating-tab-switch:active{transform:scale(.95)}`;
        document.head.appendChild(style);

        const floatBtn = document.createElement('div');
        floatBtn.id = 'custom-float-search-btn';
        floatBtn.innerHTML = `<svg class="search-widget-icon" viewBox="0 0 24 24"><path fill="white" d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"></path></svg>`;
        document.body.appendChild(floatBtn);

        const modal = document.createElement('div');
        modal.id = 'custom-search-modal';

        const dialog = document.createElement('div');
        dialog.id = 'custom-search-dialog';

        const wrapper = document.createElement('div');
        wrapper.className = 'search-input-wrapper';

        const input = document.createElement('input');
        input.id = 'custom-search-input';
        input.type = 'text';
        input.placeholder = '输入关键词搜索';
        input.autofocus = true;

        const clearBtn = document.createElement('div');
        clearBtn.id = 'custom-search-clear';
        clearBtn.textContent = '×';

        wrapper.appendChild(input);
        wrapper.appendChild(clearBtn);
        dialog.appendChild(wrapper);
        modal.appendChild(dialog);
        document.body.appendChild(modal);

        floatBtn.onclick = () => {
            modal.classList.add('show');
            input.focus();
            input.select();
        };

        clearBtn.onclick = () => {
            if (input.value.trim()) {
                input.value = '';
                input.focus();
            } else {
                modal.classList.remove('show');
            }
        };

        modal.onclick = e => {
            if (e.target === modal) modal.classList.remove('show');
        };

        input.addEventListener('keydown', e => {
            if (e.key === 'Enter') {
                const q = input.value.trim();
                if (q) window.location.href = `/search?query=${encodeURIComponent(q)}`;
                modal.classList.remove('show');
            }
        });
    }

    function createFloatingTabSwitch() {
        const checkTabButtons = () => {
            const relatedBtn = document.querySelector('#defaultOpen');
            const commentBtn = document.querySelector('#comment-tablink');

            if (!relatedBtn || !commentBtn) return false;

            const wrapper = document.querySelector('#tablinks-wrapper');
            if (wrapper) {
                wrapper.style.display = 'none';
            }

            let isRelatedActive = relatedBtn.classList.contains('active');
            const commentCount = document.querySelector('#tab-comments-count')?.textContent || '';

            const floatingTab = document.getElementById('floating-tab-switch') || document.createElement('div');
            floatingTab.id = 'floating-tab-switch';
            floatingTab.textContent = isRelatedActive ? `评论${commentCount ? ` (${commentCount})` : ''}` : '相关影片';

            floatingTab.onclick = () => {
                if (isRelatedActive) {
                    commentBtn.click();
                    floatingTab.textContent = '相关影片';
                } else {
                    relatedBtn.click();
                    floatingTab.textContent = `评论${commentCount ? ` (${commentCount})` : ''}`;
                }
                isRelatedActive = !isRelatedActive;
            };

            if (!document.getElementById('floating-tab-switch')) {
                document.body.appendChild(floatingTab);
            }

            return true;
        };

        const observer = new MutationObserver(() => {
            if (checkTabButtons()) {
                observer.disconnect();
            }
        });

        if (!checkTabButtons()) {
            observer.observe(document.body, {
                childList: true,
                subtree: true
            });

            setTimeout(() => {
                if (!document.getElementById('floating-tab-switch')) {
                    checkTabButtons();
                }
            }, 2000);
        }
    }

    function removeAdsAndScripts() {
        const selectors = [
            'script[async="true"][src]',
            'script[src*="view_booster"], script[src*="/on.js"], script[src*="/bn.js"]',
            'script[src*="/eda437"], script[src*="orbsrv.com"]',
            '#btimgid1, #btmad1, #more-related-ad, #ad-wrapper, #bottom-ads',
            'iframe[src*="/HereByAD"], iframe[src*="/herebyad"], iframe[style*="z-index: 2147483647;"], iframe[width="300"][height="250"]',
            'iframe[src*="horribletrainer.com"], iframe[src*="orbsrv"], iframe[class="▶"], iframe[src*="exoclick"]',
            'ins[data-zoneid], div[class="▶"], [class*="juicyads"]',
            'div.hidden-md.hidden-lg[style*="display: inline-block; overflow-y: hidden;"]'
        ];

        const adKeywords = ['viewBooster', 'horribletrainer', 'orbsrv', 'eda437'];
        const networkAdKeywords = ['orbsrv.com', 'phoroglopsu.com', 'horribletrainer.com', 'exoclick.com', 'view_booster', '/bn.js', '/on.js'];

        const originalCreateElement = Document.prototype.createElement;
        Document.prototype.createElement = function(tag) {
            const el = originalCreateElement.call(this, tag);
            if (tag.toLowerCase() === 'script') {
                let scriptSrc = '';
                Object.defineProperty(el, 'src', {
                    get: () => scriptSrc,
                    set: (value) => {
                        scriptSrc = value;
                        if (value && networkAdKeywords.some(keyword => value.includes(keyword))) {
                            el.type = 'javascript/blocked';
                            return;
                        }
                        el.setAttribute('src', value);
                    }
                });
            }
            return el;
        };

        const originalOpen = window.open;
        window.open = function(url, target, features) {
            if (url && !url.includes('hanime')) {
                return null;
            }
            return originalOpen.call(this, url, target, features);
        };

        document.addEventListener('click', function(e) {
            let target = e.target;
            while (target && target.nodeName !== 'A' && target.nodeName !== 'AREA') {
                target = target.parentElement;
            }
            if (target && target.href) {
                try {
                    const url = new URL(target.href, window.location.href);
                    if (!url.hostname.includes('hanime') && (target.target === '_blank' || e.ctrlKey || e.metaKey)) {
                        e.preventDefault();
                        e.stopImmediatePropagation();
                        return false;
                    }
                } catch (err) {}
            }
        }, true);

        window.addEventListener('beforeunload', function(e) {
            if (window.location.href.includes('horribletrainer.com') ||
                window.location.href.includes('orbsrv.com') ||
                window.location.href.includes('exoclick.com')) {
                e.preventDefault();
                e.returnValue = '';
                history.back();
                return '';
            }
        });

        const originalAssign = history.pushState;
        history.pushState = function(state, title, url) {
            if (url && typeof url === 'string' &&
                (url.includes('horribletrainer.com') ||
                    url.includes('orbsrv.com') ||
                    url.includes('exoclick.com'))) {
                return;
            }
            return originalAssign.apply(this, arguments);
        };

        history.replaceState = new Proxy(history.replaceState, {
            apply(target, thisArg, args) {
                const url = args[2];
                if (url && typeof url === 'string' &&
                    (url.includes('horribletrainer.com') ||
                        url.includes('orbsrv.com') ||
                        url.includes('exoclick.com'))) {
                    return;
                }
                return Reflect.apply(target, thisArg, args);
            }
        });

        function interceptNetworkRequests() {
            const originalXHROpen = XMLHttpRequest.prototype.open;
            XMLHttpRequest.prototype.open = function(method, url) {
                if (url && networkAdKeywords.some(keyword => url.includes(keyword))) {
                    this._adBlocked = true;
                    return;
                }
                return originalXHROpen.apply(this, arguments);
            };

            const originalXHRSend = XMLHttpRequest.prototype.send;
            XMLHttpRequest.prototype.send = function(body) {
                if (this._adBlocked) {
                    return;
                }
                return originalXHRSend.call(this, body);
            };

            if (window.fetch) {
                const originalFetch = window.fetch;
                window.fetch = function(input, init) {
                    const url = typeof input === 'string' ? input : input.url;
                    if (url && networkAdKeywords.some(keyword => url.includes(keyword))) {
                        return Promise.reject(new Error('ad blocked'));
                    }
                    return originalFetch.call(this, input, init);
                };
            }
        }

        function removeElements() {
            selectors.forEach(selector => {
                document.querySelectorAll(selector).forEach(el => el.remove());
            });

            document.querySelectorAll('div').forEach(el => {
                const style = el.style.cssText || '';
                if (style.includes('display: flex;') && style.includes('justify-content:')) {
                    const text = el.textContent || '';
                    if (text.includes('防失联') || text.includes('安装APP')) {
                        el.remove();
                    }
                }
            });
        }

        function disableAdFunctions() {
            ['createFixedBottomBannerWithClose', 'addImageAd', 'loadNewPopupAd', 'loadScriptDynamically', 'nbnsfxdm', 'fanwt'].forEach(fn => {
                Object.defineProperty(window, fn, {
                    value: function() {},
                    writable: false,
                    configurable: false
                });
            });
        }

        const adApiHandler = {
            get(target, prop) {
                return () => {};
            },
            apply() {
                return null;
            }
        };

        const adApis = ['AdProvider', 'ExoLoader', 'ExoAdsRefresh', 'ExoSupport', 'VastSupport', 'RendererApi', 'instantiateViewability', 'QueueManager'];
        adApis.forEach(api => {
            Object.defineProperty(window, api, {
                get() {
                    return new Proxy({}, adApiHandler);
                },
                set(value) {
                    return false;
                },
                configurable: false
            });
        });

        const observer = new MutationObserver(() => {
            removeElements();
            document.querySelectorAll('a[href*="horribletrainer.com"], a[href*="orbsrv.com"], a[href*="exoclick.com"]').forEach(a => {
                a.removeAttribute('href');
                a.onclick = function(e) {
                    e.preventDefault();
                    e.stopPropagation();
                    return false;
                };
            });
        });

        observer.observe(document.documentElement, {
            childList: true,
            subtree: true
        });

        interceptNetworkRequests();
        disableAdFunctions();
        removeElements();
    }

    function init() {
        removeAdsAndScripts();
        createCustomSearchFloatButton();
        createFloatingTabSwitch();
    }
    document.addEventListener('DOMContentLoaded', init);
    if (document.readyState !== 'loading') {
        init();
    }
})();