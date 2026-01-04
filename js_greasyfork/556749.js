// ==UserScript==
// @name         Salesforce Contact Email Accumulator (Batch Search v13.3)
// @namespace    http://tampermonkey.net/
// @version      13.3
// @description  批量搜尋 Customer ID → Email (支援首頁搜尋)
// @author       Ivory
// @license      MIT
// @match        https://astrocrm.lightning.force.com/*
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_deleteValue
// @downloadURL https://update.greasyfork.org/scripts/556749/Salesforce%20Contact%20Email%20Accumulator%20%28Batch%20Search%20v133%29.user.js
// @updateURL https://update.greasyfork.org/scripts/556749/Salesforce%20Contact%20Email%20Accumulator%20%28Batch%20Search%20v133%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    console.log('=== Customer ID → Email v13.0 (批量搜尋版) ===');

    let accumulatedData = GM_getValue('accumulated_contacts', {});
    let capturedToken = null;
    let capturedFwuid = null;
    let currentAccountId = null;
    let uiCreated = false;

    // 攔截 XHR - 抓取認證資訊
    const originalOpen = XMLHttpRequest.prototype.open;
    const originalSend = XMLHttpRequest.prototype.send;

    XMLHttpRequest.prototype.open = function(method, url) {
        this._url = url;
        return originalOpen.apply(this, arguments);
    };

    XMLHttpRequest.prototype.send = function(body) {
        const url = this._url;

        if (url && url.includes('aura') && body) {
            try {
                const bodyStr = body.toString();

                const tokenMatch = bodyStr.match(/aura\.token=([^&]+)/);
                if (tokenMatch) {
                    capturedToken = decodeURIComponent(tokenMatch[1]);
                }

                const contextMatch = bodyStr.match(/aura\.context=([^&]+)/);
                if (contextMatch) {
                    const contextStr = decodeURIComponent(contextMatch[1]);
                    const contextObj = JSON.parse(contextStr);
                    if (contextObj.fwuid) {
                        capturedFwuid = contextObj.fwuid;
                    }
                }
            } catch (e) {}
        }

        return originalSend.apply(this, arguments);
    };

    // 監控 URL (僅用於手動抓取)
    function detectCurrentAccount() {
        const urlMatch = window.location.pathname.match(/\/lightning\/r\/Account\/([a-zA-Z0-9]+)/);
        if (urlMatch && urlMatch[1] !== currentAccountId) {
            currentAccountId = urlMatch[1];
            console.log('🎯 偵測到 Account:', currentAccountId);
            // 移除自動抓取 - 只在使用者點擊「手動抓取」時才執行
        }
    }

    // 自動抓取 (原有功能)
    async function autoFetchContactsForCurrentAccount() {
        if (!currentAccountId || !capturedToken || !capturedFwuid) {
            return;
        }

        console.log('🔄 開始抓取...');

        const accountInfo = await fetchAccountInfo(currentAccountId);
        const contacts = await fetchContactsByAccountId(currentAccountId);

        if (accountInfo && contacts) {
            saveContacts(currentAccountId, contacts, accountInfo);
        }
    }

    // ========== 新功能：批量搜尋 ==========

    // 用 Customer ID 搜尋 Account
    async function searchAccountByCustomerId(customerId) {
        if (!capturedToken || !capturedFwuid) {
            console.error('❌ 缺少認證資訊');
            return null;
        }

        const message = {
            actions: [{
                id: "batch_search_" + Date.now(),
                descriptor: "serviceComponent://ui.search.components.forcesearch.predictedresults.PredictedResultsDataProviderController/ACTION$getAnswers",
                callingDescriptor: "UNKNOWN",
                params: {
                    term: customerId.toString(),
                    pageSize: 50,
                    currentPage: 1,
                    context: {
                        FILTERS: {},
                        searchSource: "ASSISTANT_DIALOG",
                        disableIntentQuery: false,
                        disableSpellCorrection: false,
                        searchDialogSessionId: generateUUID(),
                        debugInfo: {
                            appName: "Seller_Sales",
                            appType: "Standard",
                            appNamespace: "c",
                            location: "forceSearch:searchPageDesktop"
                        }
                    },
                    sortBy: null,
                    topResultsRequestModel: {
                        scopeNames: [],
                        term: customerId.toString(),
                        pageSize: 5,
                        enableRowActions: false,
                        withSingleSOSL: true,
                        withEntityPrediction: true,
                        batchSize: 3,
                        batchingTimeout: 2500,
                        scopeMap: {
                            type: "TOP_RESULTS",
                            namespace: "",
                            label: "Top Results",
                            labelPlural: "Top Results",
                            resultsCmp: "forceSearch:predictedResults"
                        },
                        context: {
                            FILTERS: {},
                            searchSource: "ASSISTANT_DIALOG",
                            disableIntentQuery: false,
                            disableSpellCorrection: false,
                            searchDialogSessionId: generateUUID(),
                            debugInfo: {
                                appName: "Seller_Sales",
                                appType: "Standard",
                                appNamespace: "c",
                                location: "forceSearch:searchPageDesktop"
                            }
                        },
                        withSpellCorrection: true,
                        configurationName: "GLOBAL_SEARCH_BAR"
                    },
                    remediationOptions: {}
                }
            }]
        };

        const auraContextObj = {
            mode: "PROD",
            fwuid: capturedFwuid,
            app: "one:one",
            loaded: {"APPLICATION@markup://one:one": ""},
            dn: [],
            globals: {},
            uad: true
        };

        const formData = new URLSearchParams();
        formData.append('message', JSON.stringify(message));
        formData.append('aura.context', JSON.stringify(auraContextObj));
        formData.append('aura.pageURI', '/one/one.app');
        formData.append('aura.token', capturedToken);

        try {
            const response = await fetch('https://astrocrm.lightning.force.com/aura?r=9&ui-search-components-forcesearch-predictedresults.PredictedResultsDataProvider.getAnswers=1', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
                },
                body: formData.toString()
            });

            const data = await response.json();

            // 解析回應
            if (data.actions && data.actions[0] && data.actions[0].returnValue) {
                const returnValue = data.actions[0].returnValue;

                // 方法 1: 從 recommendedResult 取得
                if (returnValue.recommendedResult && returnValue.recommendedResult.record) {
                    const record = returnValue.recommendedResult.record;
                    return {
                        accountId: record.Id,
                        customerId: record.Customer_ID__c,
                        name: record.Name,
                        found: true
                    };
                }

                // 方法 2: 從 answers 取得
                if (returnValue.answers && returnValue.answers.length > 0) {
                    for (const answer of returnValue.answers) {
                        if (answer.type === "KEYWORD_SEARCH" && answer.data && answer.data.results) {
                            for (const result of answer.data.results) {
                                if (result.result && result.result.length > 0 && result.result[0].record) {
                                    const record = result.result[0].record;
                                    if (record.sobjectType === "Account") {
                                        return {
                                            accountId: record.Id,
                                            customerId: record.Customer_ID__c,
                                            name: record.Name,
                                            found: true
                                        };
                                    }
                                }
                            }
                        }
                    }
                }
            }

            console.log('❌ 找不到 Customer ID:', customerId);
            return { customerId: customerId, found: false };

        } catch (error) {
            console.error('❌ 搜尋錯誤:', error);
            return { customerId: customerId, found: false, error: error.message };
        }
    }

    // 批量處理 Customer IDs
    async function batchSearchCustomerIds(customerIds) {
        const results = [];
        const totalCount = customerIds.length;
        let processedCount = 0;

        updateBatchStatus(`開始處理 ${totalCount} 個 Customer ID...`);

        for (const customerId of customerIds) {
            processedCount++;
            updateBatchStatus(`處理中 ${processedCount}/${totalCount}: ${customerId}`);

            // 搜尋 Account
            const searchResult = await searchAccountByCustomerId(customerId);

            if (searchResult && searchResult.found) {
                console.log(`✅ 找到: ${customerId} → ${searchResult.accountId}`);

                // 抓取 Contacts
                const contacts = await fetchContactsByAccountId(searchResult.accountId);

                if (contacts && contacts.length > 0) {
                    saveContacts(searchResult.accountId, contacts, {
                        customerId: searchResult.customerId,
                        name: searchResult.name
                    });

                    results.push({
                        customerId: customerId,
                        status: 'success',
                        emailCount: contacts.filter(c => c.Email).length
                    });
                } else {
                    results.push({
                        customerId: customerId,
                        status: 'no_contacts',
                        message: '找不到 Contacts'
                    });
                }
            } else {
                results.push({
                    customerId: customerId,
                    status: 'not_found',
                    message: searchResult?.error || '找不到 Account'
                });
            }

            // 延遲避免過載
            await sleep(500);
        }

        updateBatchStatus(`✅ 完成！處理了 ${totalCount} 個 Customer ID`);
        showBatchResults(results);

        return results;
    }

    // ========== 原有功能 ==========

    // 從 API 抓取 Account 資訊
    async function fetchAccountInfo(accountId) {
        const message = {
            actions: [{
                id: "123;a",
                descriptor: "serviceComponent://ui.force.components.controllers.detail.DetailController/ACTION$getRecord",
                callingDescriptor: "UNKNOWN",
                params: {
                    recordId: accountId,
                    record: null,
                    inContextOfComponent: "",
                    mode: "VIEW",
                    layoutType: "FULL",
                    defaultFieldValues: null,
                    navigationLocation: "LIST_VIEW_ROW"
                }
            }]
        };

        const auraContextObj = {
            mode: "PROD",
            fwuid: capturedFwuid,
            app: "one:one",
            loaded: {"APPLICATION@markup://one:one": ""},
            dn: [],
            globals: {},
            uad: true
        };

        const formData = new URLSearchParams();
        formData.append('message', JSON.stringify(message));
        formData.append('aura.context', JSON.stringify(auraContextObj));
        formData.append('aura.token', capturedToken);

        try {
            const response = await fetch('https://astrocrm.lightning.force.com/aura', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
                },
                body: formData.toString()
            });

            const data = await response.json();

            let customerId = '';
            let name = '';

            if (data.actions && data.actions[0] && data.actions[0].returnValue && data.actions[0].returnValue.record) {
                const record = data.actions[0].returnValue.record;
                customerId = record.Customer_ID__c || '';
                name = record.Name || '';
            }

            if (!customerId || !name) {
                if (data.context && data.context.globalValueProviders) {
                    const recordProvider = data.context.globalValueProviders.find(p => p.type === '$Record');
                    if (recordProvider && recordProvider.values && recordProvider.values.records && recordProvider.values.records[accountId]) {
                        const accountRecord = recordProvider.values.records[accountId].Account.record;
                        if (accountRecord.fields) {
                            if (accountRecord.fields.Customer_ID__c) {
                                customerId = accountRecord.fields.Customer_ID__c.value || '';
                            }
                            if (accountRecord.fields.Name) {
                                name = accountRecord.fields.Name.value || '';
                            }
                        }
                    }
                }
            }

            return { customerId, name };

        } catch (error) {
            console.error('❌ 錯誤:', error);
            return null;
        }
    }

    // 抓取 Contacts
    async function fetchContactsByAccountId(accountId) {
        const message = {
            actions: [{
                id: "906;a",
                descriptor: "aura://RelatedListUiController/ACTION$postRelatedListRecords",
                callingDescriptor: "UNKNOWN",
                params: {
                    parentRecordId: accountId,
                    relatedListId: "AccountContactRelations",
                    listRecordsQuery: {
                        fields: [
                            "AccountContactRelation.Contact.Name",
                            "AccountContactRelation.Contact.Id",
                            "AccountContactRelation.Contact.Email",
                            "AccountContactRelation.Contact.Phone"
                        ],
                        includeColumnLabels: false,
                        optionalFields: [],
                        pageSize: 50,
                        sortBy: []
                    }
                }
            }]
        };

        const auraContextObj = {
            mode: "PROD",
            fwuid: capturedFwuid,
            app: "one:one",
            loaded: {"APPLICATION@markup://one:one": ""},
            dn: [],
            globals: {},
            uad: true
        };

        const formData = new URLSearchParams();
        formData.append('message', JSON.stringify(message));
        formData.append('aura.context', JSON.stringify(auraContextObj));
        formData.append('aura.token', capturedToken);

        try {
            const response = await fetch('https://astrocrm.lightning.force.com/aura', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
                },
                body: formData.toString()
            });

            const data = await response.json();

            if (data.actions && data.actions[0] && data.actions[0].returnValue) {
                const records = data.actions[0].returnValue.records;
                const contacts = [];

                records.forEach(record => {
                    if (record.fields && record.fields.Contact) {
                        const contact = record.fields.Contact.value.fields;
                        contacts.push({
                            Name: contact.Name.value,
                            Email: contact.Email.value || '',
                            Phone: contact.Phone.value || '',
                            ID: contact.Id.value
                        });
                    }
                });

                console.log('✅ 抓到', contacts.length, '個 contacts');
                return contacts;
            }

            return null;
        } catch (error) {
            console.error('❌ 錯誤:', error);
            return null;
        }
    }

    // 儲存
    function saveContacts(accountId, contacts, accountInfo) {
        accumulatedData[accountId] = {
            accountId: accountId,
            customerId: accountInfo.customerId,
            accountName: accountInfo.name,
            contacts: contacts,
            timestamp: new Date().toISOString()
        };

        GM_setValue('accumulated_contacts', accumulatedData);
        console.log('✅ 已儲存');

        if (window.updateAccumulatorUI) {
            window.updateAccumulatorUI();
        }
    }

    // ========== UI 介面 ==========

    function createUI() {
        if (document.getElementById('accumulator-panel')) return;

        const uiContainer = document.createElement('div');
        uiContainer.id = 'contact-accumulator-ui';
        uiContainer.style.cssText = 'position: fixed; top: 0; left: 0; width: 100%; height: 100%; pointer-events: none; z-index: 999999;';
        uiContainer.innerHTML = `
            <div id="accumulator-panel" style="position: fixed; top: 80px; right: 20px; z-index: 999999; background: white; border: 3px solid #0070d2; border-radius: 8px; padding: 15px; box-shadow: 0 4px 12px rgba(0,0,0,0.3); width: 500px; max-height: 85vh; overflow-y: auto; font-family: -apple-system, sans-serif; pointer-events: auto;">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px;">
                    <h3 style="margin: 0; color: #0070d2; font-size: 18px;">📧 Customer ID → Email</h3>
                    <div>
                        <button id="minimize-btn" style="background: none; border: none; font-size: 18px; cursor: pointer; margin-right: 5px; padding: 5px;">−</button>
                        <button id="close-btn" style="background: none; border: none; font-size: 18px; cursor: pointer; color: #999; padding: 5px;">✕</button>
                    </div>
                </div>

                <div id="panel-content">
                    <!-- 批量搜尋區 -->
                    <div style="background: #f4f6f9; padding: 15px; border-radius: 6px; margin-bottom: 15px;">
                        <div style="font-weight: bold; margin-bottom: 8px; color: #16325c;">🔍 批量搜尋</div>
                        <textarea id="batch-input" placeholder="輸入 Customer ID (每行一個或用逗號分隔)&#10;例如:&#10;123456&#10;789012&#10;345678" style="width: 100%; height: 80px; padding: 8px; border: 1px solid #ccc; border-radius: 4px; font-size: 13px; resize: vertical;"></textarea>
                        <button id="batch-search-btn" style="width: 100%; margin-top: 8px; padding: 12px; background: #2e844a; color: white; border: none; border-radius: 4px; cursor: pointer; font-size: 13px; font-weight: bold;">
                            🚀 開始批量搜尋
                        </button>
                        <div id="batch-status" style="margin-top: 8px; font-size: 12px; color: #666; min-height: 20px;"></div>
                    </div>

                    <!-- 統計資訊 -->
                    <div style="background: linear-gradient(135deg, #0070d2, #00a1e0); color: white; padding: 15px; border-radius: 6px; margin-bottom: 15px;">
                        <div style="font-size: 32px; font-weight: bold;" id="total-count">0</div>
                        <div style="font-size: 14px;">個映射</div>
                        <div id="status" style="font-size: 11px; margin-top: 8px; opacity: 0.9;">⏳ 等待認證...</div>
                    </div>

                    <!-- 功能按鈕 -->
                    <div style="margin-bottom: 15px; display: flex; gap: 8px;">
                        <button id="fetch-btn" style="flex: 1; padding: 12px; background: #2e844a; color: white; border: none; border-radius: 4px; cursor: pointer; font-size: 13px; font-weight: bold;">
                            🔄 手動抓取
                        </button>
                        <button id="refresh-btn" style="flex: 1; padding: 12px; background: #16325c; color: white; border: none; border-radius: 4px; cursor: pointer; font-size: 13px; font-weight: bold;">
                            🔄 重新整理
                        </button>
                        <button id="clear-btn" style="flex: 1; padding: 12px; background: #c23934; color: white; border: none; border-radius: 4px; cursor: pointer; font-size: 13px; font-weight: bold;">
                            🗑️ 清空
                        </button>
                    </div>

                    <div style="margin-bottom: 15px; display: flex; gap: 8px;">
                        <button id="copy-btn" style="flex: 1; padding: 12px; background: #ea7600; color: white; border: none; border-radius: 4px; cursor: pointer; font-size: 13px; font-weight: bold;">
                            📋 複製映射
                        </button>
                        <button id="copy-emails-btn" style="flex: 1; padding: 12px; background: #54698d; color: white; border: none; border-radius: 4px; cursor: pointer; font-size: 13px; font-weight: bold;">
                            📧 複製 Email
                        </button>
                    </div>

                    <div style="margin-bottom: 15px;">
                        <button id="download-csv-btn" style="width: 100%; padding: 12px; background: #2e844a; color: white; border: none; border-radius: 4px; cursor: pointer; font-size: 13px; font-weight: bold;">
                            📥 下載 CSV
                        </button>
                    </div>

                    <div id="result" style="max-height: 450px; overflow-y: auto;"></div>
                </div>
            </div>
        `;

        document.body.appendChild(uiContainer);

        // 批量搜尋按鈕
        document.getElementById('batch-search-btn').addEventListener('click', async () => {
            const input = document.getElementById('batch-input').value.trim();
            if (!input) {
                alert('⚠️ 請輸入 Customer ID');
                return;
            }

            if (!capturedToken || !capturedFwuid) {
                alert('⚠️ 請先在頁面上操作一下（例如點擊任何連結），讓系統抓取認證資訊');
                return;
            }

            // 解析輸入
            const customerIds = input
                .split(/[\n,，]/)
                .map(id => id.trim())
                .filter(id => id.length > 0);

            if (customerIds.length === 0) {
                alert('⚠️ 沒有有效的 Customer ID');
                return;
            }

            if (confirm(`確定要搜尋 ${customerIds.length} 個 Customer ID？`)) {
                document.getElementById('batch-search-btn').disabled = true;
                document.getElementById('batch-search-btn').textContent = '⏳ 處理中...';

                await batchSearchCustomerIds(customerIds);

                document.getElementById('batch-search-btn').disabled = false;
                document.getElementById('batch-search-btn').textContent = '🚀 開始批量搜尋';
                document.getElementById('batch-input').value = '';
            }
        });

        // 最小化
        let isMinimized = false;
        document.getElementById('minimize-btn').addEventListener('click', () => {
            const content = document.getElementById('panel-content');
            const btn = document.getElementById('minimize-btn');
            isMinimized = !isMinimized;
            content.style.display = isMinimized ? 'none' : 'block';
            btn.textContent = isMinimized ? '+' : '−';
        });

        // 關閉
        document.getElementById('close-btn').addEventListener('click', () => {
            document.getElementById('accumulator-panel').style.display = 'none';

            if (!document.getElementById('reopen-btn')) {
                const reopenBtn = document.createElement('button');
                reopenBtn.id = 'reopen-btn';
                reopenBtn.innerHTML = '📧';
                reopenBtn.title = '打開 Customer ID → Email';
                reopenBtn.style.cssText = 'position: fixed; top: 80px; right: 20px; z-index: 999999; width: 50px; height: 50px; border-radius: 50%; background: #0070d2; color: white; border: none; font-size: 24px; cursor: pointer; box-shadow: 0 2px 8px rgba(0,0,0,0.3); pointer-events: auto;';
                reopenBtn.addEventListener('click', () => {
                    document.getElementById('accumulator-panel').style.display = 'block';
                    reopenBtn.remove();
                });
                document.body.appendChild(reopenBtn);
            }
        });

        // 手動抓取
        document.getElementById('fetch-btn').addEventListener('click', () => {
            if (!currentAccountId) {
                alert('⚠️ 請先進入 Account 頁面');
                return;
            }
            if (!capturedToken || !capturedFwuid) {
                alert('⚠️ 請先在頁面上操作一下');
                return;
            }
            autoFetchContactsForCurrentAccount();
        });

        // 重新整理
        document.getElementById('refresh-btn').addEventListener('click', () => {
            accumulatedData = GM_getValue('accumulated_contacts', {});
            updateUI();
            alert('✅ 資料已重新載入');
        });

        // 清空
        document.getElementById('clear-btn').addEventListener('click', () => {
            if (confirm('確定要清空所有資料?')) {
                accumulatedData = {};
                GM_deleteValue('accumulated_contacts');
                updateUI();
                alert('✅ 已清空');
            }
        });

        // 複製映射
        document.getElementById('copy-btn').addEventListener('click', () => {
            const mappings = [];
            Object.values(accumulatedData).forEach(account => {
                account.contacts.forEach(c => {
                    if (c.Email) {
                        mappings.push(`${account.customerId} → ${c.Email}`);
                    }
                });
            });

            if (mappings.length === 0) {
                alert('❌ 沒有資料');
                return;
            }

            navigator.clipboard.writeText(mappings.join('\n')).then(() => {
                alert(`✅ 已複製 ${mappings.length} 個映射!`);
            });
        });

        // 複製所有 Email
        document.getElementById('copy-emails-btn').addEventListener('click', () => {
            const emails = [];
            Object.values(accumulatedData).forEach(account => {
                account.contacts.forEach(c => {
                    if (c.Email) emails.push(c.Email);
                });
            });

            if (emails.length === 0) {
                alert('❌ 沒有 Email');
                return;
            }

            navigator.clipboard.writeText(emails.join(', ')).then(() => {
                alert(`✅ 已複製 ${emails.length} 個 Email!`);
            });
        });

        // 下載 CSV
        document.getElementById('download-csv-btn').addEventListener('click', () => {
            const rows = [];
            rows.push(['Customer ID', '公司名', 'Account ID', 'Email', '聯絡人姓名', '電話']);

            Object.values(accumulatedData).forEach(account => {
                account.contacts.forEach(contact => {
                    if (contact.Email) {
                        rows.push([
                            account.customerId || 'NO ID', // Customer ID 保持原樣
                            account.accountName || 'NO NAME',
                            account.accountId || 'NO ACCOUNT ID',
                            contact.Email,
                            contact.Name,
                            contact.Phone ? `\t${contact.Phone}` : '' // 電話加上 Tab
                        ]);
                    }
                });
            });

            if (rows.length <= 1) {
                alert('❌ 沒有資料可下載');
                return;
            }

            const csvContent = rows.map(row =>
                row.map(cell => {
                    const cellStr = String(cell);
                    if (cellStr.includes(',') || cellStr.includes('"') || cellStr.includes('\n')) {
                        return `"${cellStr.replace(/"/g, '""')}"`;
                    }
                    return cellStr;
                }).join(',')
            ).join('\n');

            const BOM = '\uFEFF';
            const blob = new Blob([BOM + csvContent], { type: 'text/csv;charset=utf-8;' });
            const link = document.createElement('a');
            const url = URL.createObjectURL(blob);
            const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, -5);

            link.setAttribute('href', url);
            link.setAttribute('download', `Customer_Email_Mapping_${timestamp}.csv`);
            link.style.visibility = 'hidden';

            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);

            alert(`✅ 已下載 ${rows.length - 1} 筆資料!`);
        });

        // 狀態更新
        setInterval(() => {
            const statusEl = document.getElementById('status');
            if (statusEl) {
                statusEl.innerHTML = (capturedToken && capturedFwuid) ? '✅ 認證就緒' : '⏳ 等待認證';
            }
        }, 1000);

        updateUI();
        uiCreated = true;
    }

    // 更新 UI
    function updateUI() {
        const resultEl = document.getElementById('result');
        const countEl = document.getElementById('total-count');

        if (!resultEl) return;

        const accounts = Object.values(accumulatedData);

        let totalMappings = 0;
        accounts.forEach(acc => {
            totalMappings += acc.contacts.filter(c => c.Email).length;
        });

        if (countEl) countEl.textContent = totalMappings;

        if (accounts.length === 0) {
            resultEl.innerHTML = '<div style="text-align: center; color: #999; padding: 40px;">📭<br><br>尚無資料</div>';
            return;
        }

        let html = '';
        accounts.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

        accounts.forEach(account => {
            const emailContacts = account.contacts.filter(c => c.Email);
            if (emailContacts.length === 0) return;

            html += `
                <div style="border: 2px solid #0070d2; background: #f8f9fa; padding: 15px; margin-bottom: 15px; border-radius: 8px;">
                    <div style="font-size: 18px; font-weight: bold; color: #0070d2; margin-bottom: 5px;">
                        ${account.customerId || 'NO ID'}
                    </div>
                    <div style="font-size: 13px; color: #666; margin-bottom: 12px;">
                        ${account.accountName || 'NO NAME'}
                    </div>
            `;

            emailContacts.forEach(contact => {
                html += `
                    <div style="background: white; padding: 12px; margin-bottom: 8px; border-radius: 4px; border-left: 4px solid #2e844a;">
                        <div style="font-size: 15px; font-weight: bold; color: #0070d2; margin-bottom: 4px;">
                            → ${contact.Email}
                        </div>
                        <div style="font-size: 12px; color: #666;">
                            ${contact.Name}${contact.Phone ? ' | ' + contact.Phone : ''}
                        </div>
                    </div>
                `;
            });

            html += '</div>';
        });

        resultEl.innerHTML = html;
    }

    // 更新批量搜尋狀態
    function updateBatchStatus(message) {
        const statusEl = document.getElementById('batch-status');
        if (statusEl) {
            statusEl.textContent = message;
        }
    }

    // 顯示批量搜尋結果
    function showBatchResults(results) {
        const success = results.filter(r => r.status === 'success').length;
        const failed = results.filter(r => r.status !== 'success').length;

        let message = `搜尋完成！\n成功: ${success}\n失敗: ${failed}`;

        if (failed > 0) {
            const failedIds = results
                .filter(r => r.status !== 'success')
                .map(r => `${r.customerId} (${r.message})`)
                .join('\n');
            message += `\n\n失敗的 ID:\n${failedIds}`;
        }

        alert(message);
    }

    // 工具函式
    function generateUUID() {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
            const r = Math.random() * 16 | 0;
            const v = c === 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
    }

    function sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    window.updateAccumulatorUI = updateUI;

    // 監控 URL
    let lastUrl = window.location.href;
    setInterval(() => {
        if (window.location.href !== lastUrl) {
            lastUrl = window.location.href;
            detectCurrentAccount();
        }
    }, 500);

    // 初始化
    window.addEventListener('load', () => {
        setTimeout(() => {
            createUI();
            detectCurrentAccount();
        }, 2000);
    });

    // 定期檢查 UI
    setInterval(() => {
        if (!document.getElementById('accumulator-panel') && !uiCreated) {
            createUI();
        }
    }, 3000);

})();