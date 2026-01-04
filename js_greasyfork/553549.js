// ==UserScript==
// @name         Notion Style Exporter (with Base64 Images)
// @namespace    http://tampermonkey.net/
// @version      3.1
// @description  Export Notion page as a single, styled HTML file with embedded images.
// @author       krg
// @match        https://www.notion.so/*
// @grant        GM_addStyle
// @icon         data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0iYmxhY2siPjxwYXRoIGQ9Ik01IDIwaDE0di0ySDV2MnpNMTIgMkw1LjMzIDloMy41OHY2aDQuMThWOWhzLjU4TDEyIDJ6Ii8+PC9zdmc+

// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/553549/Notion%20Style%20Exporter%20%28with%20Base64%20Images%29.user.js
// @updateURL https://update.greasyfork.org/scripts/553549/Notion%20Style%20Exporter%20%28with%20Base64%20Images%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    GM_addStyle(`
        #notion-exporter-container {
            display: flex;
            align-items: center;
            gap: 4px;
            margin: 0 4px;
        }
        #notion-exporter-button, #notion-exporter-margin-select {
            display: inline-flex;
            align-items: center;
            justify-content: center;
            height: 28px;
            padding: 0 8px;
            border-radius: 6px;
            font-size: 14px;
            font-weight: 500;
            color: var(--c-texPri);
            background-color: transparent;
            border: 1px solid transparent;
            cursor: pointer;
            user-select: none;
            transition: background-color 20ms ease-in;
            white-space: nowrap;
        }
        #notion-exporter-button { gap: 6px; }
        #notion-exporter-button:hover, #notion-exporter-margin-select:hover {
            background-color: var(--c-bacHover);
        }
        #notion-exporter-margin-select {
            padding-right: 2px; /* to align with default notion selects */
        }
        #notion-exporter-button.loading {
            cursor: wait;
            background-color: var(--c-bacActive);
        }
        #notion-exporter-button svg {
             width: 18px;
             height: 18px;
             fill: var(--c-icoPri);
        }
    `);

    // --- メイン処理 ---

    function resourceToDataURI(url) {
        return fetch(url)
            .then(response => response.blob())
            .then(blob => new Promise((resolve, reject) => {
                const reader = new FileReader();
                reader.onloadend = () => resolve(reader.result);
                reader.onerror = reject;
                reader.readAsDataURL(blob);
            }));
    }

    async function exportNotionPage() {
        const button = document.getElementById('notion-exporter-button');
        button.classList.add('loading');

        try {
            // --- 1. CSSスタイルの抽出と埋め込み ---
            button.querySelector('span').textContent = '処理中 (CSS)...';
            const cssSelector = 'head > link[rel="stylesheet"], head > link[href*="katex"]';
            const cssLinks = Array.from(document.querySelectorAll(cssSelector));

            const cssProcessingPromises = cssLinks.map(async (link) => {
                try {
                    const response = await fetch(link.href);
                    let cssText = await response.text();
                    const urlRegex = /url\((['"]?)(?!data:)(.*?)\1\)/g;
                    for (const match of [...cssText.matchAll(urlRegex)]) {
                        try {
                            const absoluteUrl = new URL(match[2], link.href).href;
                            const dataURI = await resourceToDataURI(absoluteUrl);
                            cssText = cssText.replace(match[0], `url(${dataURI})`);
                        } catch (e) { console.warn(`CSS内リソース変換失敗: ${match[2]}`, e); }
                    }
                    return cssText;
                } catch (e) { console.error('CSS取得失敗:', link.href, e); return ''; }
            });

            const processedCssTexts = await Promise.all(cssProcessingPromises);
            const allLinkedCss = processedCssTexts.join('\n');

            const styleTagsHtml = Array.from(document.querySelectorAll('head > style')).map(style => style.outerHTML).join('\n');
            const htmlClass = document.documentElement.className;
            const htmlStyle = document.documentElement.style.cssText;
            const htmlLang = document.documentElement.lang;
            const bodyClass = document.body.className;

            // --- 2. コンテンツの抽出 ---
            const mainFrame = document.querySelector('main.notion-frame');
            if (!mainFrame) throw new Error('エクスポート対象のコンテンツフレームが見つかりませんでした。');

            const titleElement = mainFrame.querySelector('h1.notranslate')?.closest('.notion-page-block');
            const contentElement = mainFrame.querySelector('.notion-page-content');
            if (!contentElement) throw new Error('エクスポート対象のコンテンツ本体が見つかりませんでした。');

            // クローンを作成（DOM操作しても元のページに影響を与えないように）
            const titleClone = titleElement ? titleElement.cloneNode(true) : null;
            const contentClone = contentElement.cloneNode(true);

            // 改ページ処理用のマーカー挿入
            const blocks = contentClone.querySelectorAll('.notion-selectable');
            for (let i = 0; i < blocks.length - 2; i++) {
                if (blocks[i].classList.contains('notion-divider-block') && blocks[i + 1].classList.contains('notion-divider-block') && blocks[i + 2].classList.contains('notion-divider-block')) {
                    const pageBreakIndicator = document.createElement('div');
                    pageBreakIndicator.className = 'page-break-indicator';
                    blocks[i + 2].parentNode.replaceChild(pageBreakIndicator, blocks[i + 2]);
                    blocks[i].remove();
                    blocks[i + 1].remove();
                    i += 2;
                }
            }

            // 編集属性の削除
            [titleClone, contentClone].filter(Boolean).forEach(clone => {
                clone.querySelectorAll('[contenteditable="true"]').forEach(el => el.removeAttribute('contenteditable'));
            });

            // --- 3. 画像のBase64埋め込み処理 ---
            button.querySelector('span').textContent = '処理中 (画像)...';

            const processImagesInElement = async (element) => {
                if (!element) return;
                const images = Array.from(element.querySelectorAll('img'));

                await Promise.all(images.map(async (img) => {
                    let src = img.getAttribute('src');
                    if (!src) return;

                    // 相対パスを絶対パスへ変換
                    if (src.startsWith('/')) {
                        src = location.origin + src;
                    }

                    try {
                        const dataURI = await resourceToDataURI(src);
                        img.setAttribute('src', dataURI);
                        // srcsetがあるとブラウザがBase64以外のURLを優先する可能性があるため削除
                        img.removeAttribute('srcset');
                        // デコード処理中のレイアウト崩れを防ぐためstyleを調整（必要に応じて）
                        img.style.objectFit = 'contain';
                    } catch (e) {
                        console.warn('画像埋め込み失敗:', src, e);
                        // 失敗時は絶対パスを設定しておく（オンラインなら見れるように）
                        img.setAttribute('src', src);
                    }
                }));
            };

            await processImagesInElement(titleClone);
            await processImagesInElement(contentClone);


            // --- 4. HTML構築 ---
            button.querySelector('span').textContent = '処理中 (HTML)...';

            const titleHtml = titleClone ? titleClone.outerHTML : '';
            const contentHtml = contentClone.outerHTML;

            const marginSetting = document.getElementById('notion-exporter-margin-select').value;
            let mainFrameStyle = `max-width: 900px; padding: 80px 40px 30vh;`;
            if (marginSetting === 'report') mainFrameStyle = `max-width: 100%; padding: 50px 80px 30vh;`;
            else if (marginSetting === 'full') mainFrameStyle = `max-width: 100%; padding: 50px 30px 30vh;`;

            const pageTitle = document.title;
            const appInnerClass = document.querySelector('.notion-app-inner')?.className || '';

            const finalHtml = `
<!DOCTYPE html>
<html lang="${htmlLang}" class="${htmlClass}" style="${htmlStyle}">
<head>
    <meta charset="UTF-8"> <meta name="viewport" content="width=device-width, initial-scale=1.0"> <title>${pageTitle}</title>
    ${styleTagsHtml}
    <style>
        ${allLinkedCss}

        html, body {
            background-color: var(--c-bacPri);
        }

        .print-background {
            display: none;
        }

        @media print {
            html, body {
                -webkit-print-color-adjust: exact;
                print-color-adjust: exact;
            }
            .print-background {
                display: block;
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background-color: var(--c-bacPri);
                z-index: -1;
            }
            main.exported-notion-frame {
                max-width: 100% !important;
                padding: 2cm 2.5cm !important;
            }
            .page-break-indicator {
                break-before: page;
                height: 0;
                border: none;
                margin: 0;
            }
        }

        body { overflow: auto !important; }
        .notion-app-inner { display: flex; justify-content: center; color: var(--c-texPri); fill: currentcolor; line-height: 1.5; font-family: ui-sans-serif, -apple-system, BlinkMacSystemFont, "Segoe UI Variable Display", "Segoe UI", Helvetica, "Hiragino Sans", "Hiragino Kaku Gothic ProN", "Hiragino Sans GB", メイリオ, Meiryo, "Apple Color Emoji", Arial, sans-serif, "Segoe UI Emoji", "Segoe UI Symbol"; -webkit-font-smoothing: auto; background-color: var(--c-bacPri); }
        main.exported-notion-frame { position: relative; width: 100%; box-sizing: border-box; ${mainFrameStyle} }
        .notion-code-block .notranslate { white-space: pre-wrap !important; word-break: break-all !important; }
        main.exported-notion-frame .notion-page-block h1 { margin-bottom: 24px !important; }

        /* 画像のスタイル調整 */
        img { max-width: 100%; height: auto; }
    </style>
</head>
<body class="${bodyClass}">
    <div class="print-background"></div>

    <div id="notion-app"> <div class="${appInnerClass}">
        <main class="exported-notion-frame"> ${titleHtml} ${contentHtml} </main>
    </div> </div>
</body>
</html>`;

            // --- 5. ダウンロード処理 ---
            const blob = new Blob([finalHtml], { type: 'text/html' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url; a.download = `${pageTitle.replace(/[\\/?%*:|"<>]/g, '-')}.html`;
            document.body.appendChild(a); a.click();
            document.body.removeChild(a); URL.revokeObjectURL(url);

        } catch (error) {
            console.error('Notion Exporter Error:', error);
            alert(`エクスポートに失敗しました: ${error.message}`);
        } finally {
            button.classList.remove('loading');
            button.querySelector('span').textContent = 'HTMLエクスポート';
        }
    }

    // --- UI追加処理 ---
    function addExportUI() {
        if (document.getElementById('notion-exporter-container')) return;

        const target = document.querySelector('.notion-topbar-action-buttons');
        if (target) {
            const container = document.createElement('div');
            container.id = 'notion-exporter-container';

            const select = document.createElement('select');
            select.id = 'notion-exporter-margin-select';
            select.innerHTML = `<option value="notion">Notion風</option><option value="report" selected>レポート風</option><option value="full">ページ全体</option>`;
            container.appendChild(select);

            const button = document.createElement('div');
            button.id = 'notion-exporter-button';
            button.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M5 20h14v-2H5v2zm7-18L5.33 9h3.58v6h4.18V9h3.58L12 2z"></path></svg><span>HTMLエクスポート</span>`;
            button.addEventListener('click', exportNotionPage);
            container.appendChild(button);

            target.prepend(container);
        }
    }

    const observer = new MutationObserver(() => {
        if (document.querySelector('.notion-topbar-action-buttons')) {
             addExportUI();
        }
    });

    observer.observe(document.body, { childList: true, subtree: true });

})();