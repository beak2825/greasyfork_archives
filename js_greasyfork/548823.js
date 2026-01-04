// ==UserScript==
// @name         蝦皮優惠券-查詢可用商品
// @version      1.5
// @description  快速查看蝦皮優惠券可用商品，不用再猜哪些商品能折扣，省時又方便｜支援優惠卷頁面、活動領券中心、商城券/店家券。
// @license      MIT
// @author       movwei
// @match        https://shopee.tw/*
// @match        https://shopee.tw/user/voucher-wallet
// @require      https://cdn.jsdelivr.net/npm/sweetalert2@11
// @namespace https://greasyfork.org/users/1041101
// @downloadURL https://update.greasyfork.org/scripts/548915/%E8%9D%A6%E7%9A%AE%E5%84%AA%E6%83%A0%E5%88%B8-%E6%9F%A5%E8%A9%A2%E5%8F%AF%E7%94%A8%E5%95%86%E5%93%81.user.js
// @updateURL https://update.greasyfork.org/scripts/548915/%E8%9D%A6%E7%9A%AE%E5%84%AA%E6%83%A0%E5%88%B8-%E6%9F%A5%E8%A9%A2%E5%8F%AF%E7%94%A8%E5%95%86%E5%93%81.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function buildShopeeUrl(voucherUrl) {
        const evcodeMatch = voucherUrl.match(/evcode=([^&]+)/);
        const signatureMatch = voucherUrl.match(/signature=([^&]+)/);
        const promotionIdMatch = voucherUrl.match(/promotionId=(\d+)/);

        if (evcodeMatch && signatureMatch && promotionIdMatch) {
            const evcode = evcodeMatch[1];
            const signature = signatureMatch[1];
            const promotionId = promotionIdMatch[1];
            return `https://shopee.tw/search?evcode=${evcode}&preSource=voucher-pages%2Fwallet&promotionId=${promotionId}&signature=${signature}&utm_content=tajs----&utm_medium=affiliates&utm_source=an_16366650006`;
        }
        return null;
    }

    function showAlert(title, text, icon='info') {
        if (typeof Swal === 'undefined') {
            setTimeout(() => showAlert(title, text, icon), 100);
            return;
        }
        Swal.fire({
            title,
            text,
            icon,
            confirmButtonColor: '#d0011b'
        });
    }

    function checkVoucherStatus(cardElement) {

        const statusSpans = cardElement.querySelectorAll('.lvIwMO div span, .z0Xxct span, .WHIV6W span, .F2MklE, .vqJoas, .OPj1Ym span');
        let statusText = '';
        statusSpans.forEach(span => {
            if(span.textContent) {
                const text = span.textContent.trim();
				if (text === '領取') {
                    statusText = '領取';
				} else if (text === '去逛逛') {
					statusText = '去逛逛';
				} else if (text === '兌換完畢' || text === '已兌換完畢' || text === '已領取' || text === '已使用') {
                    statusText = text;
                }
            }
        });

        const svgTexts = cardElement.querySelectorAll('svg text');
        svgTexts.forEach(textElement => {
            const text = textElement.textContent.trim();
            if (text === '已兌換完畢' || text === '已領取' || text === '已使用') {
                statusText = text;
            }
        });

        const disabledElements = cardElement.querySelectorAll('.nt35kv, .zVvLvp, .UM3epg, .sx8fQN');
        if (disabledElements.length > 0) {

            disabledElements.forEach(element => {
                const text = element.textContent.trim();
                if (text.includes('兌換完畢') || text.includes('已兌換') || text.includes('已領取')) {
                    statusText = '已兌換完畢';
                }
            });
        }

        const overlayElements = cardElement.querySelectorAll('.nvzMks, .GrDv19');
        if (overlayElements.length > 0) {
            overlayElements.forEach(overlay => {
                if (overlay.querySelector('svg[fill="#BDBDBD"]') ||
                    overlay.querySelector('text[fill="#BDBDBD"]') ||
                    overlay.textContent.includes('已兌換完畢')) {
                    statusText = '已兌換完畢';
                }
            });
        }

        const cardStyles = window.getComputedStyle(cardElement);
        if (cardStyles.opacity < 1 || cardStyles.filter.includes('grayscale')) {

            const allText = cardElement.textContent;
            if (allText.includes('兌換完畢') || allText.includes('已兌換') || allText.includes('已領取')) {
                statusText = '已兌換完畢';
            }
        }

    // 再次判斷
    if (!statusText) {
        const allText = cardElement.textContent;
        if (allText.includes('領取') && !allText.includes('去逛逛')) {
            statusText = '領取';
		} else if (allText.includes('去逛逛')) {
			statusText = '去逛逛';
        } else if (allText.includes('兌換完畢') || allText.includes('已兌換') || allText.includes('已領取') || allText.includes('已使用')) {
            statusText = '已兌換完畢';
        }
    }

        return statusText;
    }

    function createButton(voucherUrl, cardElement) {
        const newBtn = document.createElement('a');
        newBtn.textContent = '查詢可用商品';
        newBtn.href = '#';
        newBtn.className = 'custom-shopee-btn-safe';

        newBtn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();

            const currentButton = cardElement.querySelector('.OPj1Ym span');
            let currentStatus = '';
            if (currentButton) {
            currentStatus = currentButton.textContent.trim();
            }

            if (currentStatus === '領取') {
                showAlert('提醒', '請先 領取優惠券 再查詢可用商品', 'warning');
                return;
            }

            const statusText = checkVoucherStatus(cardElement);
            if (statusText === '兌換完畢' || statusText === '已兌換完畢' || statusText === '已領取' || statusText === '已使用') {
                showAlert('錯誤', '此優惠券 已兌換完畢 或 已使用', 'error');
                return;
            }

            const searchUrl = buildShopeeUrl(voucherUrl);
            if (searchUrl) {
                window.open(searchUrl, '_blank');
            } else {
                showAlert('錯誤', '無法解析折扣碼網址', 'error');
            }
        });

        return newBtn;
    }

    function addCustomButtons() {

        const allCards = document.querySelectorAll('.Ozujd4, .TVjANi, ._hsjbR.n8iYL8, .BBE8vQ, .Hvy133, .EHXP6I.eYf2xv.yymuwL, .kxI6jR [data-testid="vcCard"]');
        allCards.forEach(card => {

            const link = card.querySelector('a[href*="/voucher/details"], a[href*="evcode="], a[href*="promotionId="]');
            if (!link) return;

            if (!card.querySelector('.custom-shopee-btn-safe')) {
                const voucherUrl = link.href;
                const newBtn = createButton(voucherUrl, card);

                let insertTarget = link;

                const ruleLink = card.querySelector('a[aria-label*="term"], a[href*="使用規則"], .wFLABo');
                if (ruleLink) {
                    insertTarget = ruleLink;
                }

                insertTarget.insertAdjacentElement('afterend', newBtn);
            }
        });
    }

    const style = document.createElement('style');
    style.textContent = `
        .custom-shopee-btn-safe {
            margin-left: 8px;
            padding: 3px 7px;
            border: 1px solid #d0011b;
            border-radius: 4px;
            color: #d0011b !important;
            font-size: 12px;
            cursor: pointer;
            text-decoration: none;
            background-color: transparent;
            transition: background-color 0.2s;
            display: inline-block;
        }
        .custom-shopee-btn-safe:hover {
            background-color: rgba(208, 1, 27, 0.1);
            color: #d0011b !important;
        }
    `;
    document.head.appendChild(style);

    window.addEventListener('load', () => {
        setTimeout(addCustomButtons, 1000);

        const observer = new MutationObserver(() => {
            setTimeout(addCustomButtons, 300);
        });
        observer.observe(document.body, { childList: true, subtree: true });
    });

    let scrollTimeout;
    window.addEventListener('scroll', () => {
        clearTimeout(scrollTimeout);
        scrollTimeout = setTimeout(() => {
            addCustomButtons();
        }, 500);
    });
})();