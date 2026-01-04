// ==UserScript==
// @name         pixivブックマーク自動分類スクリプト
// @namespace    https://greasyfork.org/ja/users/1519380-yofumin
// @version      0.1.2
// @description  pixivのブックマークページで、「未分類」のイラストに自動でタグを付けるスクリプトです。シンプルなルールや高度なカスタムルールに基づいてタグを分類し、整理作業を効率化します。
// @author       yofumin
// @homepageURL  https://greasyfork.org/ja/scripts/551184
// @match        https://www.pixiv.net/users/*/bookmarks/artworks*
// @icon         data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><text x="51" y="91" font-size="118" text-anchor="middle">🅿️</text><text x="77" y="92" font-size="50" text-anchor="middle">⚡️</text></svg>
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_setClipboard
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/551184/pixiv%E3%83%96%E3%83%83%E3%82%AF%E3%83%9E%E3%83%BC%E3%82%AF%E8%87%AA%E5%8B%95%E5%88%86%E9%A1%9E%E3%82%B9%E3%82%AF%E3%83%AA%E3%83%97%E3%83%88.user.js
// @updateURL https://update.greasyfork.org/scripts/551184/pixiv%E3%83%96%E3%83%83%E3%82%AF%E3%83%9E%E3%83%BC%E3%82%AF%E8%87%AA%E5%8B%95%E5%88%86%E9%A1%9E%E3%82%B9%E3%82%AF%E3%83%AA%E3%83%97%E3%83%88.meta.js
// ==/UserScript==

(async function() {
    'use strict';

    const DEFAULT_SETTINGS = {
        excludedTags: "R-18,漫画",
        othersTag: "その他",
        useAdvancedRules: false,
        advancedRules: `// ルールの例
// 女の子 | 少女 -> キャラクター, 女の子
// 風景 & 夜 -> 夜景, 風景`
    };
    const API_LIMIT = 100;
    const MAX_LOG_LINES = 7;
    const UI_CONTAINER_ID = 'auto-classifier-ui';

    let settings = {};

    function logToPanel(message, type = 'info') {
        const logPanel = document.getElementById('ac-log-panel');
        if (!logPanel) return;
        const logEntry = document.createElement('p');
        logEntry.textContent = message;
        logEntry.className = `ac-log-entry ac-log-${type}`;
        logPanel.appendChild(logEntry);
        while (logPanel.children.length > MAX_LOG_LINES) {
            logPanel.removeChild(logPanel.firstChild);
        }
        logPanel.scrollTop = logPanel.scrollHeight;
    }

    const log = (message, type = 'info') => {
        console.log(`[自動分類スクリプト] ${message}`);
        logToPanel(message, type);
    };

    const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

    async function saveSettings() {
        const newSettings = {
            excludedTags: document.getElementById('ac-excluded-tags-input').value,
            othersTag: document.getElementById('ac-others-tag-input').value,
            useAdvancedRules: document.getElementById('ac-use-advanced-rules-checkbox').checked,
            advancedRules: document.getElementById('ac-advanced-rules-textarea').value,
        };
        await GM_setValue('pixivAutoClassifierSettings', newSettings);
        settings = newSettings;
        logToPanel("設定を保存しました。", "success");
        closeSettingsModal();
    }

    async function loadSettings() {
        const savedSettings = await GM_getValue('pixivAutoClassifierSettings', {});
        settings = { ...DEFAULT_SETTINGS, ...savedSettings };

        document.getElementById('ac-excluded-tags-input').value = settings.excludedTags;
        document.getElementById('ac-others-tag-input').value = settings.othersTag;
        document.getElementById('ac-use-advanced-rules-checkbox').checked = settings.useAdvancedRules;
        document.getElementById('ac-advanced-rules-textarea').value = settings.advancedRules;

        toggleAdvancedRuleUI(settings.useAdvancedRules);
    }

    function toggleAdvancedRuleUI(isVisible) {
        document.getElementById('ac-advanced-rules-container').style.display = isVisible ? 'block' : 'none';
    }

    function openSettingsModal() { document.getElementById('ac-settings-modal').style.display = 'flex'; }
    function closeSettingsModal() { document.getElementById('ac-settings-modal').style.display = 'none'; }
    function isUiVisible() { return !!document.getElementById(UI_CONTAINER_ID); }
    function removeUI() {
        const uiContainer = document.getElementById(UI_CONTAINER_ID);
        if (uiContainer) { uiContainer.remove(); }
    }

    function createUI() {
        const uiContainer = document.createElement('div');
        uiContainer.id = UI_CONTAINER_ID;
        // コントロールパネル
        const acControls = document.createElement('div');
        acControls.id = 'ac-controls';

        const startButton = document.createElement('button');
        startButton.id = 'ac-start-button';
        startButton.className = 'ac-button';
        startButton.textContent = '自動分類';

        const settingsIcon = document.createElement('div');
        settingsIcon.id = 'ac-settings-icon';
        settingsIcon.textContent = '⚙️';

        acControls.appendChild(startButton);
        acControls.appendChild(settingsIcon);

        // ログパネル
        const logPanel = document.createElement('div');
        logPanel.id = 'ac-log-panel';

        // 設定モーダル
        const settingsModal = document.createElement('div');
        settingsModal.id = 'ac-settings-modal';
        settingsModal.style.display = 'none';

        const settingsContent = document.createElement('div');
        settingsContent.id = 'ac-settings-content';

        // 設定タイトル
        const settingsTitle = document.createElement('h2');
        settingsTitle.textContent = '自動分類スクリプト設定';
        settingsContent.appendChild(settingsTitle);

        // 保持タグ設定
        const excludedTagsItem = document.createElement('div');
        excludedTagsItem.className = 'ac-setting-item';

        const excludedTagsLabel = document.createElement('label');
        excludedTagsLabel.setAttribute('for', 'ac-excluded-tags-input');
        excludedTagsLabel.textContent = '保持タグ：他に分類出来るタグがない場合、代替タグも付けるタグ';

        const excludedTagsInput = document.createElement('input');
        excludedTagsInput.type = 'text';
        excludedTagsInput.id = 'ac-excluded-tags-input';

        excludedTagsItem.appendChild(excludedTagsLabel);
        excludedTagsItem.appendChild(excludedTagsInput);
        settingsContent.appendChild(excludedTagsItem);

        // 代替タグ設定
        const othersTagItem = document.createElement('div');
        othersTagItem.className = 'ac-setting-item';

        const othersTagLabel = document.createElement('label');
        othersTagLabel.setAttribute('for', 'ac-others-tag-input');
        othersTagLabel.textContent = '代替タグ：分類不能・ルール不一致時のタグ';

        const othersTagInput = document.createElement('input');
        othersTagInput.type = 'text';
        othersTagInput.id = 'ac-others-tag-input';

        othersTagItem.appendChild(othersTagLabel);
        othersTagItem.appendChild(othersTagInput);
        settingsContent.appendChild(othersTagItem);

        // 区切り線
        const hr = document.createElement('hr');
        hr.className = 'ac-hr';
        settingsContent.appendChild(hr);

        // 高度なルールチェックボックス
        const advancedRulesItem = document.createElement('div');
        advancedRulesItem.className = 'ac-setting-item';

        const advancedRulesCheckbox = document.createElement('input');
        advancedRulesCheckbox.type = 'checkbox';
        advancedRulesCheckbox.id = 'ac-use-advanced-rules-checkbox';

        const advancedRulesLabel = document.createElement('label');
        advancedRulesLabel.setAttribute('for', 'ac-use-advanced-rules-checkbox');
        advancedRulesLabel.textContent = '高度なタグ付けルールを使用する';

        advancedRulesItem.appendChild(advancedRulesCheckbox);
        advancedRulesItem.appendChild(advancedRulesLabel);
        settingsContent.appendChild(advancedRulesItem);

        // 高度なルールコンテナ
        const advancedRulesContainer = document.createElement('div');
        advancedRulesContainer.id = 'ac-advanced-rules-container';
        advancedRulesContainer.style.display = 'none';

        const ruleHeader = document.createElement('div');
        ruleHeader.className = 'ac-rule-header';

        const ruleHeaderLabel = document.createElement('label');
        ruleHeaderLabel.textContent = 'タグ付けルール (1行1ルール):';

        const copyRulesButton = document.createElement('button');
        copyRulesButton.id = 'ac-copy-simple-rules-button';
        copyRulesButton.className = 'ac-button ac-button-small';
        copyRulesButton.textContent = 'シンプル分類ルールをコピー';

        ruleHeader.appendChild(ruleHeaderLabel);
        ruleHeader.appendChild(copyRulesButton);
        advancedRulesContainer.appendChild(ruleHeader);

        const ruleDescription = document.createElement('div');
        ruleDescription.className = 'ac-rule-description';
        ruleDescription.innerHTML = '<b>基本:</b> <code>条件タグ -> 追加タグ</code><br>' +
                                   '<b>複数追加:</b> <code>条件タグ -> 追加タグ1, 追加タグ2</code><br>' +
                                   '<b>OR条件:</b> <code>条件A | 条件B -> 追加タグ</code><br>' +
                                   '<b>AND条件:</b> <code>条件X & 条件Y -> 追加タグ</code><br>' +
                                   '<b>部分一致:</b> <code>*部分マッチ* -> 追加タグ</code>';
        advancedRulesContainer.appendChild(ruleDescription);

        const advancedRulesTextarea = document.createElement('textarea');
        advancedRulesTextarea.id = 'ac-advanced-rules-textarea';
        advancedRulesTextarea.rows = 8;
        advancedRulesContainer.appendChild(advancedRulesTextarea);

        settingsContent.appendChild(advancedRulesContainer);

        // 設定ボタン
        const settingsButtons = document.createElement('div');
        settingsButtons.id = 'ac-settings-buttons';

        const saveButton = document.createElement('button');
        saveButton.id = 'ac-save-button';
        saveButton.className = 'ac-button';
        saveButton.textContent = '保存';

        const closeButton = document.createElement('button');
        closeButton.id = 'ac-close-button';
        closeButton.className = 'ac-button ac-button-secondary';
        closeButton.textContent = '閉じる';

        settingsButtons.appendChild(saveButton);
        settingsButtons.appendChild(closeButton);
        settingsContent.appendChild(settingsButtons);

        settingsModal.appendChild(settingsContent);

        // すべてをuiContainerに追加
        uiContainer.appendChild(acControls);
        uiContainer.appendChild(logPanel);
        uiContainer.appendChild(settingsModal);
        const style = document.createElement('style');
        style.textContent = `
            #auto-classifier-ui { position: fixed; top: 80px; right: 20px; z-index: 10000; background-color: #fff; border: 1px solid #ddd; border-radius: 8px; padding: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.15); display: flex; flex-direction: column; gap: 10px; width: 300px; }
            #ac-controls { display: flex; align-items: center; justify-content: space-between; }
            .ac-button { padding: 8px 12px; border: none; border-radius: 4px; color: white; background-color: #007bff; cursor: pointer; font-weight: bold; font-size: 14px; }
            .ac-button:disabled { background-color: #6c757d; cursor: not-allowed; }
            .ac-button-secondary { background-color: #6c757d; }
            #ac-settings-icon { cursor: pointer; font-size: 24px; line-height: 1; }
            #ac-log-panel { height: 140px; background-color: #f8f9fa; border: 1px solid #e9ecef; border-radius: 4px; padding: 8px; overflow-y: auto; font-size: 12px; line-height: 1.5; color: #333; }
            .ac-log-entry { margin: 0; padding: 0; }
            .ac-log-success { color: #28a745; }
            .ac-log-error { color: #dc3545; font-weight: bold; }
            #ac-settings-modal { position: fixed; top: 0; left: 0; width: 100%; height: 100%; background-color: rgba(0,0,0,0.5); display: flex; justify-content: center; align-items: center; z-index: 10001; }
            #ac-settings-content { background-color: white; padding: 24px; border-radius: 8px; width: 500px; box-shadow: 0 4px 8px rgba(0,0,0,0.2); }
            .ac-setting-item { margin-bottom: 16px; }
            .ac-setting-item label { display: block; margin-bottom: 4px; font-weight: bold; }
            .ac-setting-item input[type="text"] { width: 95%; padding: 8px; }
            .ac-setting-item input[type="checkbox"] + label { font-weight: normal; }
            #ac-settings-buttons { text-align: right; margin-top: 24px; }
            .ac-hr { border: none; border-top: 1px solid #eee; margin: 20px 0; }
            .ac-rule-description { font-size: 12px; color: #555; background-color: #f8f9fa; padding: 8px; border-radius: 4px; margin: 4px 0 8px 0; line-height: 1.6; }
            .ac-rule-description code { background-color: #e9ecef; padding: 2px 4px; border-radius: 3px; font-family: Consolas, monaco, monospace; }
            #ac-advanced-rules-textarea { width: 95%; padding: 8px; font-family: Consolas, monaco, monospace; }
            .ac-rule-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 4px; }
            .ac-button-small { padding: 4px 8px; font-size: 12px; background-color: #6c757d; font-weight: normal; }

        `;
        document.head.appendChild(style);
        document.body.appendChild(uiContainer);
    }

    async function initializeUI(userId) {
        if (isUiVisible()) return;
        createUI();
        await loadSettings();
        document.getElementById('ac-start-button').addEventListener('click', () => startClassification(userId));
        document.getElementById('ac-settings-icon').addEventListener('click', openSettingsModal);
        document.getElementById('ac-save-button').addEventListener('click', saveSettings);
        document.getElementById('ac-close-button').addEventListener('click', closeSettingsModal);
        document.getElementById('ac-use-advanced-rules-checkbox').addEventListener('change', (e) => {
            toggleAdvancedRuleUI(e.target.checked);
        });
        document.getElementById('ac-copy-simple-rules-button').addEventListener('click', () => copySimpleRulesToClipboard(userId));

    }

      /**
     * シンプル分類のルールを生成し、クリップボードにコピーします。
     * @param {string} userId
     */
    async function copySimpleRulesToClipboard(userId) {
        const button = document.getElementById('ac-copy-simple-rules-button');
        const originalText = button.textContent;
        button.disabled = true;
        button.textContent = 'コピー中...';

        try {
            log('ブックマークタグ一覧を取得しています...');
            const myTagsResponse = await fetch(`/ajax/user/${userId}/illusts/bookmark/tags?lang=ja`);
            if (!myTagsResponse.ok) throw new Error(`タグ一覧取得APIエラー: ${myTagsResponse.status}`);
            const myTagsData = await myTagsResponse.json();
            if (myTagsData.error) throw new Error(`タグ一覧の取得に失敗: ${myTagsData.message}`);

            const excludedTags = new Set(settings.excludedTags.split(',').map(t => t.trim()).filter(Boolean));
            const allMyBookmarkTags = [...myTagsData.body.public, ...myTagsData.body.private].map(item => item.tag);

            const rules = allMyBookmarkTags
                .filter(tag => !excludedTags.has(tag)) // 除外タグを除外
                .map(tag => `${tag} -> ${tag}`);       // 「タグ -> タグ」形式に変換

            if (rules.length === 0) {
                log('コピー対象のタグが見つかりませんでした。', 'error');
                button.textContent = '対象なし';
            } else {
                const rulesText = rules.join('\n');
                await navigator.clipboard.writeText(rulesText);
                log(`${rules.length}件のシンプル分類ルールをクリップボードにコピーしました。`, 'success');
                button.textContent = 'コピーしました！';
            }

        } catch (error) {
            log(`[エラー] ルールのコピーに失敗しました: ${error.message}`, 'error');
            button.textContent = '失敗';
        } finally {
            setTimeout(() => {
                button.disabled = false;
                button.textContent = originalText;
            }, 2000); // 2秒後にボタンの状態を元に戻す
        }
    }

      function parseAdvancedRules(rulesText) {
          const parsedRules = [];
          const lines = rulesText.split('\n').filter(line => !line.trim().startsWith('//') && line.trim() !== '' && line.includes('->'));

          for (const line of lines) {
              const [conditionPart, tagsPart] = line.split('->').map(s => s.trim());
              if (!conditionPart || !tagsPart) continue;

              const tagsToAdd = tagsPart.split(',').map(t => t.trim()).filter(Boolean);
              if (tagsToAdd.length === 0) continue;

              let conditions = [];
              let type = 'OR';
              let matchType = 'EXACT'; // 新規追加

              if (conditionPart.includes('&')) {
                  conditions = conditionPart.split('&').map(c => c.trim()).filter(Boolean);
                  type = 'AND';
              } else {
                  conditions = conditionPart.split('|').map(c => c.trim()).filter(Boolean);
                  type = 'OR';
              }

              // ワイルドカード判定を追加
              conditions = conditions.map(cond => {
                  if (cond.startsWith('*') && cond.endsWith('*')) {
                      matchType = 'PARTIAL';
                      return cond.slice(1, -1); // *を除去
                  }
                  return cond;
              });

              if (conditions.length > 0) {
                  parsedRules.push({ conditions, tagsToAdd, type, matchType });
              }
          }

          return parsedRules;
      }


    async function startClassification(userId) {
        const startButton = document.getElementById('ac-start-button');
        startButton.disabled = true;

        try {
            log("スクリプトを開始します。");
            const csrfToken = (() => {
                const nextData = JSON.parse(document.getElementById('__NEXT_DATA__').textContent);
                const pageProps = nextData.props.pageProps;
                return pageProps.token || JSON.parse(pageProps.serverSerializedPreloadedState).api.token;
            })();
            if (!csrfToken) throw new Error("CSRFトークンが取得できませんでした。");

            log("自分のブックマークタグ一覧を取得中...");
            const myTagsResponse = await fetch(`/ajax/user/${userId}/illusts/bookmark/tags?lang=ja`);
            if (!myTagsResponse.ok) throw new Error(`タグ一覧取得APIエラー: ${myTagsResponse.status}`);
            const myTagsData = await myTagsResponse.json();
            if (myTagsData.error) throw new Error(`タグ一覧の取得に失敗: ${myTagsData.message}`);
            const allMyBookmarkTags = new Set([...myTagsData.body.public, ...myTagsData.body.private].map(item => item.tag));

            const preservedTags = new Set(settings.excludedTags.split(',').map(t => t.trim()).filter(Boolean));

            log("「未分類」のブックマークを取得します...");
            const works = await fetchUnclassifiedWorks(userId, csrfToken);
            if (works.length === 0) {
                log("分類対象のブックマークが見つかりませんでした。");
                return;
            }
            log(`合計 ${works.length}件のイラストを分類します。`, "success");

            let processedCount = 0;
            for (const work of works) {
                processedCount++;
                startButton.textContent = `分類中...(${processedCount}/${works.length})`;

                const tagsForThisWork = new Set();
                const workTagsSet = new Set(work.tags);

                if (settings.useAdvancedRules) {
                    const parsedRules = parseAdvancedRules(settings.advancedRules);

                    // 1. ルールに基づいてタグを決定
                    for (const rule of parsedRules) {
                      let match = false;
                      const conditionCheckTags = new Set([...workTagsSet].filter(t => !preservedTags.has(t)));

                      if (rule.matchType === 'PARTIAL') {
                          // 部分マッチ処理
                          if (rule.type === 'OR') {
                              match = rule.conditions.some(cond =>
                                  [...conditionCheckTags].some(tag => tag.includes(cond))
                              );
                          } else {
                              match = rule.conditions.every(cond =>
                                  [...conditionCheckTags].some(tag => tag.includes(cond))
                              );
                          }
                      } else {
                          // 既存の完全マッチ処理
                          if (rule.type === 'OR') {
                              match = rule.conditions.some(cond => conditionCheckTags.has(cond));
                          } else {
                              match = rule.conditions.every(cond => conditionCheckTags.has(cond));
                          }
                      }

                      if (match) {
                          rule.tagsToAdd.forEach(tag => tagsForThisWork.add(tag));
                        }
                    }

                    // 2. ルールにマッチしなかった場合、代替タグを追加
                    if (tagsForThisWork.size === 0) {
                        tagsForThisWork.add(settings.othersTag);
                    }

                } else {
                    const matchedTags = work.tags.filter(tag => allMyBookmarkTags.has(tag) && !preservedTags.has(tag));
                    if (matchedTags.length > 0) {
                        matchedTags.forEach(tag => tagsForThisWork.add(tag));
                    } else {
                        tagsForThisWork.add(settings.othersTag);
                    }
                }

                // 3. 保持タグを（ルール適用結果に関わらず）追加
                preservedTags.forEach(tag => {
                    if (workTagsSet.has(tag)) {
                        tagsForThisWork.add(tag);
                    }
                });

                await addTagsToBookmark(work, [...tagsForThisWork], csrfToken);
                await sleep(1000);
            }

            log("全ての処理が完了しました。", "success");
            log("結果を反映するには、手動でページを更新してください。");

        } catch (error) {
            log(`[エラー] ${error.message}`, "error");
            alert(`エラーが発生したため処理を中断しました。\n詳細は開発者コンソールとUI上のログを確認してください。`);
        } finally {
            if (isUiVisible()) {
                const startButton = document.getElementById('ac-start-button');
                startButton.disabled = false;
                startButton.textContent = "自動分類";
            }
        }
    }

    async function fetchUnclassifiedWorks(userId, csrfToken) {
        let offset = 0;
        let allWorks = [];
        const startButton = document.getElementById('ac-start-button');
        while (true) {
            startButton.textContent = `取得中...(${offset}～)`;
            const encodedTag = encodeURIComponent("未分類");
            const bookmarksApiUrl = `/ajax/user/${userId}/illusts/bookmarks?tag=${encodedTag}&offset=${offset}&limit=${API_LIMIT}&rest=show&lang=ja`;
            const bookmarksResponse = await fetch(bookmarksApiUrl, { headers: { "accept": "application/json", "referer": location.href, "x-user-id": userId, 'x-csrf-token': csrfToken } });
            if (!bookmarksResponse.ok) throw new Error(`ブックマーク一覧取得APIエラー: ${bookmarksResponse.status}`);
            const bookmarksData = await bookmarksResponse.json();
            if (bookmarksData.error) throw new Error(`ブックマーク一覧の取得に失敗: ${bookmarksData.message}`);
            const works = bookmarksData.body.works;
            if (!works || works.length === 0) break;
            log(`${offset}件目から${works.length}件の作品を取得しました。`);
            allWorks.push(...works);
            offset += works.length;
            if (works.length < API_LIMIT) break;
            await sleep(500);
        }
        return allWorks;
    }

    async function addTagsToBookmark(work, tags, csrfToken) {
        if (tags.length === 0) {
            log(`「${work.title}」に追加するタグがありませんでした。スキップします。`);
            return;
        }
        const addTagsResponse = await fetch('/ajax/illusts/bookmarks/add_tags', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'x-csrf-token': csrfToken, "referer": location.href },
            body: JSON.stringify({ bookmarkIds: [work.bookmarkData.id], tags: tags })
        });
        if (!addTagsResponse.ok) {
            log(`「${work.title}」のタグ付けでHTTPエラー: ${addTagsResponse.status}`, "error");
            return;
        }
        const result = await addTagsResponse.json();
        if (result.error) {
            log(`「${work.title}」でエラー: ${result.message}`, "error");
        } else {
            log(`「${work.title}」にタグ「${tags.join(', ')}」を追加しました。`, "success");
        }
    }

    function checkUrlAndToggleUI() {
        try {
            const pageOwnerIdMatch = location.pathname.match(/\/users\/(\d+)\/bookmarks\/artworks/);
            const pageOwnerId = pageOwnerIdMatch ? pageOwnerIdMatch[1] : null;
            if (!pageOwnerId) {
                removeUI();
                return;
            }
            const nextDataElement = document.getElementById('__NEXT_DATA__');
            if (!nextDataElement) {
                removeUI();
                return;
            }
            const nextData = JSON.parse(nextDataElement.textContent);
            const loggedInUserId = nextData?.props?.pageProps?.gaUserData?.userId;
            if (loggedInUserId && pageOwnerId === loggedInUserId) {
                initializeUI(loggedInUserId);
            } else {
                removeUI();
            }
        } catch (error) {
            console.error('[自動分類スクリプト] URLチェック中にエラー:', error);
            removeUI();
        }
    }

    const originalPushState = history.pushState;
    history.pushState = function(...args) {
        const result = originalPushState.apply(this, args);
        window.dispatchEvent(new Event('pushstate'));
        return result;
    };

    checkUrlAndToggleUI();
    window.addEventListener('pushstate', checkUrlAndToggleUI);
    window.addEventListener('popstate', checkUrlAndToggleUI);

})();