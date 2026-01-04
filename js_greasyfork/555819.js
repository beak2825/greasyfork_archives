// ==UserScript==
// @name         Zenhub Sub-issues Estimate Display
// @namespace    https://github.com/
// @icon         https://github.githubassets.com/favicons/favicon.svg
// @version      2.4.3
// @description  GitHubのissueページでSub-issuesのZenhub estimateを表示
// @supportURL   https://github.com/y-saeki/UserScript
// @author       y-saeki w/ Cursor
// @match        https://github.com/*/*/issues/*
// @noframes
// @grant        GM_xmlhttpRequest
// @grant        GM_getValue
// @grant        GM_setValue
// @connect      api.zenhub.com
// @downloadURL https://update.greasyfork.org/scripts/555819/Zenhub%20Sub-issues%20Estimate%20Display.user.js
// @updateURL https://update.greasyfork.org/scripts/555819/Zenhub%20Sub-issues%20Estimate%20Display.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Zenhub API設定
    const ZENHUB_API_URL = 'https://api.zenhub.com/public/graphql';
    const API_KEY_STORAGE = 'zenhub_api_key';

    // グローバル変数
    let repositoryGhId = null;
    let urlInfo = null;
    let apiKeyCancelled = false; // API Key入力がキャンセルされたかどうか

    // API Keyの設定
    function setApiKey() {
        const key = prompt('Zenhub Personal API Keyを入力してください:\n(https://app.zenhub.com/settings/tokens で取得できます)');
        if (key) {
            GM_setValue(API_KEY_STORAGE, key);
            apiKeyCancelled = false; // 正常に設定された場合はフラグをリセット
            return key;
        }
        // キャンセルされた場合
        apiKeyCancelled = true;
        console.warn('Zenhub API Keyの入力がキャンセルされました。Estimateは表示されません。');
        console.warn('API Keyを設定するには、コンソールで window.resetZenhubApiKey() を実行してからページをリロードしてください。');
        return null;
    }

    // API Keyの取得
    function getApiKey() {
        let key = GM_getValue(API_KEY_STORAGE);
        if (!key && !apiKeyCancelled) {
            // キャンセルされていない場合のみpromptを表示
            key = setApiKey();
        }
        return key;
    }

    // URLから repository情報とissue番号を抽出
    function parseGitHubUrl() {
        const match = window.location.pathname.match(/\/([^\/]+)\/([^\/]+)\/issues\/(\d+)/);
        if (match) {
            return {
                owner: match[1],
                repo: match[2],
                issueNumber: parseInt(match[3])
            };
        }
        return null;
    }

    // DOMまたはGitHub APIでリポジトリIDを取得
    async function getRepositoryGhId(owner, repo) {
        // まずDOMから取得を試みる
        try {
            const repoElement = document.querySelector('[data-repository-id]');
            if (repoElement) {
                const repoId = parseInt(repoElement.getAttribute('data-repository-id'));
                if (repoId) {
                    return repoId;
                }
            }

            const metaTag = document.querySelector('meta[name="octolytics-dimension-repository_id"]');
            if (metaTag) {
                const repoId = parseInt(metaTag.getAttribute('content'));
                if (repoId) {
                    return repoId;
                }
            }

            if (window.__PRIMER_DATA__ && window.__PRIMER_DATA__.repository) {
                const repoId = window.__PRIMER_DATA__.repository.id;
                if (repoId) {
                    return repoId;
                }
            }
        } catch (error) {
            // DOMからの取得に失敗した場合はAPIを使用
        }

        try {
            const response = await fetch(`https://api.github.com/repos/${owner}/${repo}`);

            if (!response.ok) {
                console.error('GitHub APIエラー:', response.status, response.statusText);
                return null;
            }

            const data = await response.json();
            return data.id;
        } catch (error) {
            console.error('GitHub APIエラー:', error);
            return null;
        }
    }

    function buildBatchIssueQuery(issueNumbers) {
        const selections = issueNumbers.map(number => `
            issue_${number}: issueByInfo(repositoryGhId: $repositoryGhId, issueNumber: ${number}) {
                number
                estimate {
                    value
                }
            }
        `).join('\n');

        return `
            query getIssueInfoBatch($repositoryGhId: Int!) {
                ${selections}
            }
        `;
    }

    // Zenhub GraphQL APIでestimateをバッチ取得
    function fetchEstimatesBatch(repositoryGhId, issueNumbers) {
        if (!issueNumbers || issueNumbers.length === 0) {
            return Promise.resolve({});
        }

        return new Promise((resolve, reject) => {
            const apiKey = getApiKey();
            if (!apiKey) {
                reject('API Key not set');
                return;
            }

            const query = buildBatchIssueQuery(issueNumbers);

            GM_xmlhttpRequest({
                method: 'POST',
                url: ZENHUB_API_URL,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${apiKey}`
                },
                data: JSON.stringify({
                    query: query,
                    variables: {
                        repositoryGhId: repositoryGhId
                    }
                }),
                onload: function(response) {
                    try {
                        const data = JSON.parse(response.responseText);
                        if (data.errors) {
                            console.error('Zenhub API エラー:', data.errors);
                            if (data.errors[0]?.message?.includes('authentication')) {
                                GM_setValue(API_KEY_STORAGE, '');
                                alert('API Keyが無効です。再度設定してください。');
                            }
                            reject(data.errors);
                            return;
                        }

                        const issueData = data.data || {};
                        const resultMap = {};

                        issueNumbers.forEach(number => {
                            const alias = `issue_${number}`;
                            const issueInfo = issueData[alias];
                            resultMap[number] = issueInfo?.estimate?.value ?? 0;
                        });

                        resolve(resultMap);
                    } catch (error) {
                        reject(error);
                    }
                },
                onerror: function(error) {
                    console.error('Zenhub API リクエストエラー:', error);
                    reject(error);
                }
            });
        });
    }

    // Sub-issuesからissue番号を抽出（直下の子issueのみ）
    function extractDirectSubIssues(container) {
        const subIssues = [];

        if (!container) {
            container = document.querySelector('[data-testid="sub-issues-issue-container"]');
        }

        if (!container) {
            return subIssues;
        }

        // ルートレベルの<ul>要素を取得
        const rootUl = container.querySelector('ul[role="tree"]');
        if (!rootUl) {
            return subIssues;
        }

        // ルート直下の<li>要素を取得
        // ul配下の全てのliを取得し、その中でネストされていないものを判別
        const allLis = rootUl.querySelectorAll('li.PRIVATE_TreeView-item');

        allLis.forEach(listItem => {
            // このli要素が別のli要素の子孫でないか確認
            // 親要素をたどってul[role="tree"]に直接つながっているか確認
            let parent = listItem.parentElement;
            let isDirectChild = false;

            // 最大10階層まで遡る
            for (let i = 0; i < 10; i++) {
                if (!parent) break;

                if (parent === rootUl) {
                    // ルートulの直接の子孫
                    isDirectChild = true;
                    break;
                }

                if (parent.tagName === 'UL' && parent !== rootUl) {
                    // 別のulの中にある = 孫issue
                    isDirectChild = false;
                    break;
                }

                parent = parent.parentElement;
            }

            if (!isDirectChild) {
                return; // 孫issueなのでスキップ
            }

            // 直下の子issueとして処理
            const directContent = listItem.querySelector(':scope > div');
            if (!directContent) return;

            const issueLink = directContent.querySelector('a[href*="/issues/"]');
            if (issueLink) {
                const match = issueLink.href.match(/\/issues\/(\d+)/);
                if (match) {
                    const issueNumber = parseInt(match[1]);
                    subIssues.push({
                        number: issueNumber,
                        element: listItem,
                        link: issueLink
                    });
                }
            }
        });

        return subIssues;
    }

    // 特定のli要素が孫issueを持っているかどうかを判定
    function hasChildIssues(parentLi) {
        // まず、展開済みかどうかを確認（ul要素の存在で判定）
        // 展開後はrole="group"になることがある
        const nestedUl = parentLi.querySelector('ul[role="tree"]') ||
                         parentLi.querySelector('ul[role="group"]') ||
                         parentLi.querySelector('ul[class*="TreeView"]');

        if (nestedUl) {
            // 展開済みの場合、実際に孫issueが存在するか確認
            const parentLevel = parseInt(parentLi.getAttribute('aria-level') || '1');
            const childLevel = parentLevel + 1;
            const nestedLis = nestedUl.querySelectorAll(`li.PRIVATE_TreeView-item[aria-level="${childLevel}"]`);

            if (nestedLis.length > 0) {
                return true;
            }

            // 代替方法：aria-levelが正しく設定されていない場合のフォールバック
            const allNestedLis = nestedUl.querySelectorAll('li.PRIVATE_TreeView-item');
            for (let li of allNestedLis) {
                const level = li.getAttribute('aria-level');
                if (level === String(childLevel)) {
                    return true;
                }
            }
        }

        // 展開されていない場合、トグルボタンの存在で判定
        // GitHubのUIでは、トグルボタンがある = 孫issueが存在する可能性が高い
        const toggleDiv = parentLi.querySelector('div.PRIVATE_TreeView-item-toggle') ||
                          parentLi.querySelector('[class*="TreeView-item-toggle"]');

        if (toggleDiv) {
            return true;
        }

        return false;
    }

    // 特定のli要素内の孫issueを抽出
    function extractChildIssues(parentLi) {
        const childIssues = [];

        // 親issueのaria-levelを取得
        const parentLevel = parseInt(parentLi.getAttribute('aria-level') || '1');
        const childLevel = parentLevel + 1;

        // このparentLi内にある、aria-level="${childLevel}"のli要素を取得
        const nestedLis = parentLi.querySelectorAll(`li.PRIVATE_TreeView-item[aria-level="${childLevel}"]`);

        if (nestedLis.length === 0) {
            // 代替方法：親li内の全てのliを取得してフィルタ
            const allNestedLis = parentLi.querySelectorAll('li.PRIVATE_TreeView-item');

            allNestedLis.forEach(li => {
                const level = li.getAttribute('aria-level');
                if (li !== parentLi && level === String(childLevel)) {
                    const directContent = li.querySelector(':scope > div');
                    if (directContent) {
                        const issueLink = directContent.querySelector('a[href*="/issues/"]');
                        if (issueLink) {
                            const match = issueLink.href.match(/\/issues\/(\d+)/);
                            if (match) {
                                const issueNumber = parseInt(match[1]);
                                childIssues.push({
                                    number: issueNumber,
                                    element: li,
                                    link: issueLink
                                });
                            }
                        }
                    }
                }
            });
        } else {
            nestedLis.forEach(nestedLi => {
                const directContent = nestedLi.querySelector(':scope > div');
                if (directContent) {
                    const issueLink = directContent.querySelector('a[href*="/issues/"]');
                    if (issueLink) {
                        const match = issueLink.href.match(/\/issues\/(\d+)/);
                        if (match) {
                            const issueNumber = parseInt(match[1]);
                            childIssues.push({
                                number: issueNumber,
                                element: nestedLi,
                                link: issueLink
                            });
                        }
                    }
                }
            });
        }
        return childIssues;
    }

    // Estimateバッジを作成
    function createEstimateBadge(value) {
        const badge = document.createElement('span');
        badge.className = 'zenhub-estimate-badge';

        // 「?」の場合は背景色をグレーに
        const isDash = value === '?';
        const badgeGrayscale = isDash ? '1' : '0';

        badge.style.cssText = `
            display: inline-flex;
            align-items: center;
            justify-content: center;
            width: 18px;
            height: 18px;
            margin-right: 4px;
            background-color: #4660f9;
            filter: grayscale(${badgeGrayscale});
            color: white;
            border-radius: 50%;
            font-size: 12px;
            font-weight: 400;
            line-height: 20px;
            font-variant-numeric: tabular-nums;
            vertical-align: middle;
        `;
        badge.textContent = `${value}`;
        badge.title = isDash ? 'Zenhub Estimate: ? (Epic)' : `Zenhub Estimate: ${value}`;
        return badge;
    }

    // ローディングスピナーを作成
    function createLoadingSpinner() {
        const spinner = document.createElement('span');
        spinner.className = 'zenhub-estimate-loading';
        spinner.style.cssText = `
            display: inline-block;
            margin-right: 4px;
            width: 14px;
            height: 14px;
            border: 2px solid #d0d7de;
            border-top-color: #0969da;
            border-radius: 50%;
            animation: zenhub-spin 0.8s linear infinite;
            vertical-align: middle;
        `;
        spinner.title = 'Estimate読み込み中...';

        // アニメーションのスタイルを追加（初回のみ）
        if (!document.getElementById('zenhub-estimate-spinner-style')) {
            const style = document.createElement('style');
            style.id = 'zenhub-estimate-spinner-style';
            style.textContent = `
                @keyframes zenhub-spin {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                }
            `;
            document.head.appendChild(style);
        }

        return spinner;
    }

    // 複数issueのestimateを並列取得（バッチ処理）
    async function displayEstimatesForIssues(subIssues) {
        if (!repositoryGhId || subIssues.length === 0) return;

        const BATCH_SIZE = 10; // 同時実行数

        // 孫issueを持つissueと持たないissueを分離
        const issuesWithChildren = [];
        const issuesWithoutChildren = [];

        subIssues.forEach(subIssue => {
            // 既存のバッジがあればスキップ
            if (subIssue.element.querySelector('.zenhub-estimate-badge')) {
                return;
            }

            // 孫issueを持つかどうかを判定
            if (hasChildIssues(subIssue.element)) {
                issuesWithChildren.push(subIssue);
            } else {
                issuesWithoutChildren.push(subIssue);
            }
        });

        // 孫issueを持つissueは、APIリクエストをスキップして直接「?」を表示
        issuesWithChildren.forEach(subIssue => {
            const badge = createEstimateBadge('?');
            if (subIssue.link && subIssue.link.parentElement) {
                const linkParent = subIssue.link.closest('[data-component="text"]') || subIssue.link.parentElement;
                linkParent.insertAdjacentElement('afterend', badge);
            }
        });

        // 孫issueを持たないissueのみ、APIリクエストを実行
        if (issuesWithoutChildren.length === 0) {
            return;
        }

        // 各issueにスピナーを表示
        issuesWithoutChildren.forEach(subIssue => {
            // 既存のスピナーを削除
            const existingSpinner = subIssue.element.querySelector('.zenhub-estimate-loading');
            if (existingSpinner) {
                existingSpinner.remove();
            }

            if (subIssue.link && subIssue.link.parentElement) {
                const spinner = createLoadingSpinner();
                const linkParent = subIssue.link.closest('[data-component="text"]') || subIssue.link.parentElement;
                linkParent.insertAdjacentElement('afterend', spinner);
            }
        });

        // バッチに分割して処理
        for (let i = 0; i < issuesWithoutChildren.length; i += BATCH_SIZE) {
            const batch = issuesWithoutChildren.slice(i, i + BATCH_SIZE);

            // このバッチ内のissueを並列取得
            let estimates = {};

            try {
                estimates = await fetchEstimatesBatch(repositoryGhId, batch.map(subIssue => subIssue.number));
            } catch (error) {
                console.error('Estimate取得エラー:', error);
            }

            // このバッチの結果を表示
            batch.forEach(subIssue => {
                // スピナーを削除
                const spinner = subIssue.element.querySelector('.zenhub-estimate-loading');
                if (spinner) {
                    spinner.remove();
                }

                // estimate値を表示
                const displayValue = estimates[subIssue.number] ?? 0;

                // バッジを追加
                const badge = createEstimateBadge(displayValue);
                if (subIssue.link && subIssue.link.parentElement) {
                    const linkParent = subIssue.link.closest('[data-component="text"]') || subIssue.link.parentElement;
                    linkParent.insertAdjacentElement('afterend', badge);
                }
            });
        }
    }

    // アコーディオン展開を監視
    function observeAccordionExpansion(parentLi) {
        // このli要素内のトグルボタンを探す
        const toggleDiv = parentLi.querySelector('div.PRIVATE_TreeView-item-toggle');
        if (!toggleDiv) return;

        // 既にイベントリスナーが登録されているか確認（data属性で管理）
        if (toggleDiv.dataset.zenhubListenerAdded === 'true') {
            return;
        }

        // クリックイベントをリッスン
        const clickHandler = async () => {
            // DOM更新を待つ（アニメーション完了を考慮）
            await new Promise(resolve => setTimeout(resolve, 500));

            // 展開されているか確認（ul要素の存在で判定）
            // 展開後はrole="group"になることがある
            let nestedUl = parentLi.querySelector('ul[role="tree"]') ||
                           parentLi.querySelector('ul[role="group"]') ||
                           parentLi.querySelector('ul[class*="TreeView"]');

            // chevron-downの存在でも判定（より確実）
            const chevronDown = toggleDiv.querySelector('svg.octicon-chevron-down');
            const isExpanded = nestedUl || chevronDown;

            if (isExpanded) {
                // MutationObserverを使って、孫issueが完全にレンダリングされるまで待つ
                await new Promise((resolve) => {
                    const observer = new MutationObserver((mutations, obs) => {
                        // 孫issueが存在するか確認
                        const childIssues = extractChildIssues(parentLi);
                        if (childIssues.length > 0) {
                            obs.disconnect();
                            resolve();
                        }
                    });

                    // 親li要素の変更を監視
                    observer.observe(parentLi, {
                        childList: true,
                        subtree: true
                    });

                    // タイムアウト（最大2秒待つ）
                    setTimeout(() => {
                        observer.disconnect();
                        resolve();
                    }, 2000);
                });

                // さらに少し待つ（念のため）
                await new Promise(resolve => setTimeout(resolve, 200));

                // 孫issueを取得
                const childIssues = extractChildIssues(parentLi);

                if (childIssues.length > 0) {
                    await displayEstimatesForIssues(childIssues);
                }
            }
        };

        toggleDiv.addEventListener('click', clickHandler);
        toggleDiv.dataset.zenhubListenerAdded = 'true';
    }

    // メイン処理：初期表示
    async function displayEstimates() {
        urlInfo = parseGitHubUrl();
        if (!urlInfo) {
            return;
        }

        // Repository IDを取得
        repositoryGhId = await getRepositoryGhId(urlInfo.owner, urlInfo.repo);
        if (!repositoryGhId) {
            console.error('Repository IDの取得に失敗しました');
            return;
        }

        // 直下の子issueのみを取得
        const directSubIssues = extractDirectSubIssues();
        if (directSubIssues.length === 0) {
            return;
        }

        // 各子issueにアコーディオン展開の監視を設定
        directSubIssues.forEach(subIssue => {
            observeAccordionExpansion(subIssue.element);
        });

        // 直下の子issueのestimateを表示
        await displayEstimatesForIssues(directSubIssues);
    }

    // ページ読み込み完了後に実行
    function init() {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => {
                setTimeout(displayEstimates, 1000);
            });
        } else {
            setTimeout(displayEstimates, 1000);
        }

        // GitHub SPAのナビゲーションを監視
        let lastUrl = location.href;
        new MutationObserver(() => {
            const url = location.href;
            if (url !== lastUrl) {
                lastUrl = url;
                if (url.includes('/issues/')) {
                    setTimeout(displayEstimates, 1000);
                }
            }
        }).observe(document.querySelector('body'), { subtree: true, childList: true });
    }

    // 設定リセット用のコマンド
    const resetFunction = function() {
        GM_setValue(API_KEY_STORAGE, '');
        apiKeyCancelled = false; // フラグもリセット
        alert('API Keyをリセットしました。ページをリロードしてください。');
    };

    // Tampermonkeyコンテキストとページコンテキストの両方で利用可能にする
    window.resetZenhubApiKey = resetFunction;
    if (typeof unsafeWindow !== 'undefined') {
        unsafeWindow.resetZenhubApiKey = resetFunction;
    }


    init();
})();