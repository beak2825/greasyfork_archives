// ==UserScript==
// @name         Prompt Copy & Regenerate Button for Rentry (v6.0 日本語エラー対応版)
// @namespace    https://rentry.co/8772bcnh
// @version      6.0
// @license      MIT
// @description  [Multi-domain support] Adds buttons to copy/regenerate prompts from rentry.co and rentry.org links.
// @match        *://seesaawiki.jp/gpt4545/d/*
// @match        *://rentry.co/*
// @match        *://rentry.org/*
// @match        *://mercury.bbspink.com/test/read.cgi/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=seesaawiki.jp
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_addStyle
// @grant        GM_openInTab
// @connect      generativelanguage.googleapis.com
// @downloadURL https://update.greasyfork.org/scripts/554288/Prompt%20Copy%20%20Regenerate%20Button%20for%20Rentry%20%28v60%20%E6%97%A5%E6%9C%AC%E8%AA%9E%E3%82%A8%E3%83%A9%E3%83%BC%E5%AF%BE%E5%BF%9C%E7%89%88%29.user.js
// @updateURL https://update.greasyfork.org/scripts/554288/Prompt%20Copy%20%20Regenerate%20Button%20for%20Rentry%20%28v60%20%E6%97%A5%E6%9C%AC%E8%AA%9E%E3%82%A8%E3%83%A9%E3%83%BC%E5%AF%BE%E5%BF%9C%E7%89%88%29.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // --- 設定 ---
    const GEMINI_API_KEY_STORAGE_KEY = 'gemini_api_key';
    const GEMINI_MODEL_NAME = "gemini-3-flash-preview"; // 最新モデルに更新
    // --- ---

    let lastCompletedButton = null;

    function getApiKey() {
        let apiKey = GM_getValue(GEMINI_API_KEY_STORAGE_KEY);
        if (!apiKey) {
            apiKey = prompt("Gemini APIキーを入力してください。Google AI Studioから取得できます。");
            if (apiKey) GM_setValue(GEMINI_API_KEY_STORAGE_KEY, apiKey);
        }
        return apiKey;
    }

    // ★★★ 新機能: APIエラーメッセージを日本語に変換 ★★★
    function translateApiError(errorMessage) {
        // クォータ超過エラー
        if (errorMessage.includes('exceeded your current quota') || errorMessage.includes('Quota exceeded')) {
            // リトライ時間を抽出
            const retryMatch = errorMessage.match(/retry in (\d+(\.\d+)?)/i);
            const retrySeconds = retryMatch ? Math.ceil(parseFloat(retryMatch[1])) : null;

            let message = '🚫 API利用制限に達しました\n\n';
            message += '無料枠の制限を超えたため、しばらく待つ必要があります。\n\n';

            if (retrySeconds) {
                const minutes = Math.floor(retrySeconds / 60);
                const seconds = retrySeconds % 60;
                if (minutes > 0) {
                    message += `⏰ 約${minutes}分${seconds}秒後に再試行できます\n\n`;
                } else {
                    message += `⏰ 約${retrySeconds}秒後に再試行できます\n\n`;
                }
            }

            return message;
        }

        // APIキー無効
        if (errorMessage.includes('API key not valid')) {
            return '🔑 APIキーが無効です\n\nページを再読み込みして、新しいAPIキーを入力してください。\n\nAPIキーはGoogle AI Studio（https://aistudio.google.com）から無料で取得できます。';
        }

        // レート制限
        if (errorMessage.includes('rate limit') || errorMessage.includes('too many requests')) {
            return '⚡ リクエストが多すぎます\n\n短時間に多くのリクエストを送信したため、一時的に制限されています。\n\n30秒〜1分ほど待ってから再試行してください。';
        }

        // モデルが見つからない
        if (errorMessage.includes('model') && (errorMessage.includes('not found') || errorMessage.includes('does not exist'))) {
            return '❌ AIモデルが見つかりません\n\n指定されたGeminiモデルが利用できません。\nスクリプトの更新が必要かもしれません。';
        }

        // サーバーエラー
        if (errorMessage.includes('500') || errorMessage.includes('503') || errorMessage.includes('internal')) {
            return '🔧 Google側で一時的な問題が発生しています\n\nサーバーエラーのため、しばらく待ってから再試行してください。';
        }

        // その他のエラー
        return `APIエラー: ${errorMessage}`;
    }

    // プロンプトコピーボタン用のコンテンツ抽出
    async function extractContent(url) {
        try {
            const response = await fetch(url);
            if (!response.ok) throw new Error(`HTTPエラー: ${response.status}`);
            const html = await response.text();
            const doc = new DOMParser().parseFromString(html, 'text/html');
            const containerSelectors = ['#content > article', '.entry-text-container article'];
            let container = null;
            for (const selector of containerSelectors) {
                const el = doc.querySelector(selector);
                if (el) {
                    container = el;
                    break;
                }
            }
            if (!container) {
                const rawEl = doc.querySelector('body > pre');
                if (rawEl) return { prompt: rawEl.textContent.trim() };
            }
            if (!container) throw new Error("メインコンテンツエリアが見つかりませんでした。");
            let prompt = '';
            const codeBlocks = container.querySelectorAll('.codeblock, pre');
            if (codeBlocks.length > 0) {
                codeBlocks.forEach(el => {
                    if (el.closest('.linenos')) return;
                    const clippy = el.querySelector('.clippy');
                    prompt += (clippy?.getAttribute('value') || el.textContent).trim() + "\n\n";
                });
                prompt = prompt.trim();
            }
            if (!prompt) {
                prompt = container.innerText.trim();
            }
            if (!prompt) throw new Error("プロンプトが見つかりませんでした。");
            return { prompt };
        } catch (error) {
            console.error('Content extraction failed:', error);
            throw error;
        }
    }

    // お任せコピー用のページデータ取得
    async function fetchPageData(url, signal) {
        try {
            const response = await fetch(url, { signal });
            if (!response.ok) throw new Error(`HTTPエラー: ${response.status}`);
            const html = await response.text();
            const doc = new DOMParser().parseFromString(html, 'text/html');

            const normalSelectors = ['#content > article', '.entry-text-container article'];
            for (const selector of normalSelectors) {
                const el = doc.querySelector(selector);
                if (el) return { type: 'normal', content: el.innerText.trim() };
            }
            const rawEl = doc.querySelector('body > pre');
            if (rawEl) return { type: 'raw', content: rawEl.textContent.trim() };
            throw new Error("コピー対象のコンテンツが見つかりませんでした。");
        } catch (error) {
            console.error('Page data fetch failed:', error);
            throw error;
        }
    }

    // Gemini再生成
    async function regeneratePromptWithGemini(fullPageText, signal) {
        const apiKey = getApiKey();
        if (!apiKey) throw new Error("Gemini APIキーが設定されていません。");

        const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL_NAME}:generateContent?key=${apiKey}`;
        const promptForAI = `あなたは、与えられた文章全体から最も重要となる「プロンプト」部分を抽出し、最適化する専門家です。\n\n# あなたのタスク\n1. 以下の「ウェブページの全テキスト」を注意深く読み、全体の内容を理解します。\n2. このテキストの中から、AIに指示を与えることを目的とした「プロンプト」として機能する中心的な部分を見つけ出します。\n3. プロンプト本体だけでなく、そのプロンプトを補足する説明、設定、背景情報なども含めて、一つの完成されたプロンプトに統合・再構成してください。\n4. 余分な挨拶、ウェブサイトのUIに関するテキスト（例：「コピー」ボタンの文言）、無関係な雑談などはすべて除去します。\n5. 最終的に、最適化されたプロンプトのテキスト「のみ」を出力してください。あなたの意見や追加の解説（例：「これが抽出したプロンプトです」）は絶対に含めないでください。\n\n---\n## ウェブページの全テキスト\n${fullPageText}\n---`;

        const response = await fetch(API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ contents: [{ parts: [{ text: promptForAI }] }] }),
            signal
        });
        const data = await response.json();

        if (!response.ok) {
            const errorMessage = data?.error?.message || `HTTP ${response.status}`;

            // ★★★ 日本語エラーメッセージに変換 ★★★
            if (errorMessage.includes('API key not valid')) {
                GM_setValue(GEMINI_API_KEY_STORAGE_KEY, null);
            }
            throw new Error(translateApiError(errorMessage));
        }

        if (data?.promptFeedback?.blockReason) {
            const reason = data.promptFeedback.blockReason;
            throw new Error(`Gemini APIで入力内容がポリシー違反（${reason}）としてブロックされました。`);
        }
        if (Array.isArray(data?.candidates) && data.candidates.length > 0) {
            const firstCandidate = data.candidates[0];
            if (firstCandidate.finishReason && firstCandidate.finishReason !== 'STOP') {
                const reason = firstCandidate.finishReason;
                throw new Error(`Gemini APIで生成された内容がポリシー違反（${reason}）としてブロックされました。`);
            }
            if (firstCandidate.content?.parts && Array.isArray(firstCandidate.content.parts) && typeof firstCandidate.content.parts[0]?.text === "string") {
                return firstCandidate.content.parts[0].text.trim();
            }
        }
        console.error("Unexpected API response structure:", JSON.stringify(data, null, 2));
        throw new Error("APIから予期しない形式の応答がありました。コンソールで詳細を確認してください。");
    }

    // クリップボードへのコピー処理
    async function copyToClipboard(text) {
        try {
            await navigator.clipboard.writeText(text);
        } catch (err) {
            console.error('Clipboard copy failed:', err);
            throw new Error("クリップボードへのコピーに失敗しました。");
        }
    }

    function resetLastCompletedButtonState() {
        if (lastCompletedButton) {
            lastCompletedButton.textContent = lastCompletedButton.dataset.originalText;
            lastCompletedButton.style.backgroundColor = '';
            lastCompletedButton.disabled = false;
            lastCompletedButton = null;
        }
    }

    function processLinks() {
        const selector = 'a[href*="rentry.co"]:not([data-processed="true"]), a[href*="rentry.org"]:not([data-processed="true"])';

        document.querySelectorAll(selector).forEach(link => {
            const rawHref = link.getAttribute('href');
            if (!rawHref) return;

            let targetUrl = rawHref;

            if (rawHref.includes('www.pinktower.com/?')) {
                const parts = rawHref.split('?');
                if (parts.length > 1 && (parts[1].startsWith('https://rentry.co') || parts[1].startsWith('https://rentry.org'))) {
                    targetUrl = parts[1];
                } else {
                    return;
                }
            }

            link.dataset.processed = 'true';
            const buttonWrapper = document.createElement('span');
            link.insertAdjacentElement('afterend', buttonWrapper);

            // ① プロンプトコピーボタン
            const copyBtn = document.createElement('button');
            copyBtn.textContent = 'プロンプトコピー';
            copyBtn.className = 'prompt-btn copy-btn';
            copyBtn.dataset.originalText = copyBtn.textContent;
            buttonWrapper.appendChild(copyBtn);

            copyBtn.addEventListener('click', async (e) => {
                e.preventDefault();
                resetLastCompletedButtonState();

                copyBtn.textContent = '抽出中...';
                copyBtn.disabled = true;
                try {
                    const { prompt } = await extractContent(targetUrl);
                    await copyToClipboard(prompt);
                    copyBtn.textContent = 'コピー完了!';
                    copyBtn.style.backgroundColor = '#17a2b8';
                    lastCompletedButton = copyBtn;
                } catch (error) {
                    alert(`処理に失敗: ${error.message}`);
                    copyBtn.textContent = copyBtn.dataset.originalText;
                } finally {
                    copyBtn.disabled = false;
                }
            });

            // ② お任せコピーボタン
            const regenerateBtn = document.createElement('button');
            regenerateBtn.textContent = 'お任せコピー';
            regenerateBtn.className = 'prompt-btn regenerate-btn';
            regenerateBtn.dataset.originalText = regenerateBtn.textContent;
            buttonWrapper.appendChild(regenerateBtn);

            regenerateBtn.addEventListener('click', async (e) => {
                e.preventDefault();
                resetLastCompletedButtonState();

                const controller = new AbortController();
                const cancelBtn = document.createElement('button');
                cancelBtn.textContent = '✖';
                cancelBtn.className = 'prompt-btn cancel-btn';
                cancelBtn.title = 'キャンセル';
                cancelBtn.onclick = () => controller.abort();

                regenerateBtn.disabled = true;
                regenerateBtn.insertAdjacentElement('afterend', cancelBtn);

                try {
                    regenerateBtn.textContent = 'ページ読込中...';
                    const { type, content } = await fetchPageData(targetUrl, controller.signal);
                    let resultText, successMessage = 'コピー完了!';
                    if (type === 'raw') {
                        resultText = content;
                        successMessage = '全コピー完了!';
                    } else {
                        regenerateBtn.textContent = '再生成中...';
                        resultText = await regeneratePromptWithGemini(content, controller.signal);
                    }
                    await copyToClipboard(resultText);
                    regenerateBtn.textContent = successMessage;
                    regenerateBtn.style.backgroundColor = '#17a2b8';
                    lastCompletedButton = regenerateBtn;
                } catch (error) {
                    if (error.name === 'AbortError') {
                        console.log('処理がキャンセルされました。');
                        regenerateBtn.textContent = regenerateBtn.dataset.originalText;
                        return;
                    }

                    if (error.message && error.message.includes('404')) {
                        const openArchive = confirm('ページが見つかりませんでした (404エラー)。\nWeb Archiveを開きますか？ (URLはクリップボードにコピーされます)');
                        if (openArchive) {
                            GM_openInTab('https://web.archive.org/', { active: true });
                            await copyToClipboard(targetUrl);
                            regenerateBtn.textContent = 'URLコピー完了';
                            regenerateBtn.style.backgroundColor = '#ffc107';
                            lastCompletedButton = regenerateBtn;
                        } else {
                            regenerateBtn.textContent = regenerateBtn.dataset.originalText;
                        }
                    } else if (error.message && error.message.includes('ポリシー違反')) {
                        try {
                            regenerateBtn.textContent = '代替コピー中...';
                            const { prompt } = await extractContent(targetUrl);
                            await copyToClipboard(prompt);
                            const baseMessage = error.message.endsWith('。') ? error.message.slice(0, -1) : error.message;
                            alert(`${baseMessage}ため、プロンプトコピーを実行しました。`);
                            regenerateBtn.textContent = 'コピー完了!';
                            regenerateBtn.style.backgroundColor = '#17a2b8';
                            lastCompletedButton = regenerateBtn;
                        } catch (copyError) {
                            alert(`Geminiによる再生成に失敗し、代替のコピー処理も失敗しました: ${copyError.message}`);
                            regenerateBtn.textContent = regenerateBtn.dataset.originalText;
                            regenerateBtn.style.backgroundColor = '#dc3545';
                            setTimeout(() => {
                                if (lastCompletedButton !== regenerateBtn) regenerateBtn.style.backgroundColor = '';
                            }, 2000);
                        }
                    } else if (error.message && error.message.includes('API利用制限')) {
                        // ★★★ クォータ超過時は自動で代替コピーを実行（ポリシー違反と同じ処理） ★★★
                        try {
                            regenerateBtn.textContent = '代替コピー中...';
                            const { prompt } = await extractContent(targetUrl);
                            await copyToClipboard(prompt);
                            alert(`${error.message}\n\n代わりに「プロンプトコピー」（AI不使用）を実行しました。`);
                            regenerateBtn.textContent = 'コピー完了!';
                            regenerateBtn.style.backgroundColor = '#17a2b8';
                            lastCompletedButton = regenerateBtn;
                        } catch (copyError) {
                            alert(`Geminiによる再生成に失敗し、代替のコピー処理も失敗しました: ${copyError.message}`);
                            regenerateBtn.textContent = regenerateBtn.dataset.originalText;
                            regenerateBtn.style.backgroundColor = '#dc3545';
                            setTimeout(() => {
                                if (lastCompletedButton !== regenerateBtn) regenerateBtn.style.backgroundColor = '';
                            }, 2000);
                        }
                    } else {
                        alert(`処理に失敗:\n\n${error.message}`);
                        regenerateBtn.textContent = regenerateBtn.dataset.originalText;
                        regenerateBtn.style.backgroundColor = '#dc3545';
                        setTimeout(() => {
                            if (lastCompletedButton !== regenerateBtn) regenerateBtn.style.backgroundColor = '';
                        }, 2000);
                    }
                } finally {
                    cancelBtn.remove();
                    regenerateBtn.disabled = false;
                }
            });
        });
    }

    GM_addStyle(`
        .prompt-btn { margin-left: 6px; padding: 3px 8px; border: none; border-radius: 4px; color: white; cursor: pointer; font-size: 12px; transition: background-color 0.2s, transform 0.1s; line-height: 1.5; vertical-align: middle; }
        .prompt-btn:hover:not(:disabled) { transform: scale(1.05); }
        .copy-btn { background-color: #007bff; }
        .copy-btn:hover:not(:disabled) { background-color: #0056b3; }
        .regenerate-btn { background-color: #28a745; }
        .regenerate-btn:hover:not(:disabled) { background-color: #1e7e34; }
        .prompt-btn:disabled { background-color: #6c757d; cursor: not-allowed; }
        .cancel-btn {
            background-color: #dc3545;
            padding: 3px 7px;
            border-radius: 50%;
            font-size: 10px;
            line-height: 1;
            font-weight: bold;
        }
        .cancel-btn:hover:not(:disabled) {
            background-color: #c82333;
        }
    `);

    const observer = new MutationObserver(processLinks);
    observer.observe(document.body, { childList: true, subtree: true });
    processLinks();

    window.addEventListener('beforeunload', resetLastCompletedButtonState);
})();
