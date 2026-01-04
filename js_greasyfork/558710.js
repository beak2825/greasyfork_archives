// ==UserScript==
// @name         巴哈姆特文章圖片替代文字修正
// @name:en      Bahamut Image Alt Text Fixer
// @description  將巴哈姆特小屋貼文與討論串的圖片改為帶有使用者名稱、帳號、網域、貼文標題的替代文字，以增加辨識度。
// @description:en Improves image accessibility on Bahamut by setting descriptive alt text containing username, user ID, domain, and post title for better identification.
//
// @match       https://forum.gamer.com.tw/C.php*
// @match       https://home.gamer.com.tw/artwork.php*
// @version     1.1.0
//
// @author      Max
// @namespace   https://github.com/Max46656
// @license     MPL2.0
// @downloadURL https://update.greasyfork.org/scripts/558710/%E5%B7%B4%E5%93%88%E5%A7%86%E7%89%B9%E6%96%87%E7%AB%A0%E5%9C%96%E7%89%87%E6%9B%BF%E4%BB%A3%E6%96%87%E5%AD%97%E4%BF%AE%E6%AD%A3.user.js
// @updateURL https://update.greasyfork.org/scripts/558710/%E5%B7%B4%E5%93%88%E5%A7%86%E7%89%B9%E6%96%87%E7%AB%A0%E5%9C%96%E7%89%87%E6%9B%BF%E4%BB%A3%E6%96%87%E5%AD%97%E4%BF%AE%E6%AD%A3.meta.js
// ==/UserScript==

class ImageAltFiller {
    constructor() {
        this.pageTitle = document.querySelector('head title')?.textContent?.trim() || '';
        if (!this.pageTitle) {
            console.warn('找不到 <title>，已中止');
            return;
        }

        this.strategy = this.detectStrategy();

        if (!this.strategy) {
            console.info('本頁面不支援');
            return;
        }

        this.init();
    }

    detectStrategy() {
        const { pathname } = window.location;

        const rules = [
            { test: /^\/artwork\.php/, value: 'home' },
            { test: /^\/home\.php/, value: 'home' },
            { test: /^\/C\.php/, value: 'forum' },
        ];

        for (const rule of rules)
            if (rule.test.test(pathname)) return rule.value;

        return null;
    }

    init() {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.execute());
        } else {
            this.execute();
        }
    }

    execute() {
        if (this.strategy === 'home') {
            this.fillHomeImages();
        } else if (this.strategy === 'forum') {
            this.fillForumImages();
            this.observeDynamicContent();
        }
    }

    fillHomeImages() {
        const images = document.querySelectorAll('div.article-content.comics img, div.article-content.main img');

        images.forEach(img => {
            if (!img.alt || img.alt.trim() === '' || /placeholder/i.test(img.alt)) {
                img.alt = this.pageTitle;
                img.title = this.pageTitle;
            }
        });

        console.log(`已處理 ${images.length} 張圖片`);
    }

    fillForumImages() {
        const images = document.querySelectorAll('a.photoswipe-image img');

        images.forEach(img => {
            const postContainer = img.closest('div.c-post, section') || document;
            const authorName = postContainer.querySelector('.c-post__header__author a.username')?.textContent?.trim() || '';;
            const authorId = postContainer.querySelector('.c-post__header__author a.userid')?.textContent?.trim() || '';;

            let altText = this.pageTitle;
            if (authorName || authorId) {
                const authorPart = [authorName, authorId].filter(Boolean).join(' @');
                altText = `${this.pageTitle} - ${authorPart}`;
            }

            const apply = () => {
                img.alt = altText;
                img.title = altText;
            };

            if (img.complete && img.naturalWidth > 0) {
                apply();
            } else {
                img.addEventListener('load', apply, { once: true });
            }
        });

        console.log(`已處理 ${images.length} 張相簿圖片`);
    }

    observeDynamicContent() {
        if (this.strategy !== 'forum') return;

        const observer = new MutationObserver(mutations => {
            let shouldRun = false;
            for (const m of mutations) {
                if (m.addedNodes.length > 0) {
                    shouldRun = true;
                    break;
                }
            }
            if (shouldRun) {
                setTimeout(() => this.fillForumImages(), 300);
            }
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });

        //console.info('已啟動動態載入監聽');
    }
}


new ImageAltFiller();

window.BahaAltFiller = ImageAltFiller;
