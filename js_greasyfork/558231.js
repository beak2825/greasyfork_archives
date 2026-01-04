// ==UserScript==
// @name         SukiSuki特典会自动填写
// @namespace    http://tampermonkey.net/
// @version      2025-12-07
// @description  SukiSuki特典会自动填写弓具
// @author       菠萝巫见PineMiko
// @match        https://sukisuki-shop.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=sukisuki-shop.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/558231/SukiSuki%E7%89%B9%E5%85%B8%E4%BC%9A%E8%87%AA%E5%8A%A8%E5%A1%AB%E5%86%99.user.js
// @updateURL https://update.greasyfork.org/scripts/558231/SukiSuki%E7%89%B9%E5%85%B8%E4%BC%9A%E8%87%AA%E5%8A%A8%E5%A1%AB%E5%86%99.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Storage keys
    const STORAGE_KEY = 'sukisuki_nicknames';

    // Load saved nicknames
    function loadNicknames() {
        const saved = localStorage.getItem(STORAGE_KEY);
        return saved ? JSON.parse(saved) : [];
    }

    // Save nicknames
    function saveNicknames(nicknames) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(nicknames));
    }

    // Extract all apply targets
    function extractTargets() {
        const targets = [];
        const skuforms = document.querySelectorAll('.skuform');

        skuforms.forEach(skuform => {
            const memberNameElem = skuform.querySelector('.skuname');
            const priceElem = skuform.querySelector('.field_price');
            const typeElem = skuform.querySelector('span[style*="background-color"]');

            if (memberNameElem && priceElem) {
                const fullName = memberNameElem.textContent.trim();
                const memberName = fullName.split(' ')[0];

                const price = priceElem.textContent.trim();
                const type = typeElem ? typeElem.textContent.trim() : '';
                const isFCOnly = type.includes('FC会員限定');

                // Try to find actual SKU from existing inputs or data attributes
                let sku = fullName; // fallback to product name
                const skuInput = skuform.querySelector('input[name*="quant"]');
                if (skuInput) {
                    const nameMatch = skuInput.name.match(/quant\[\d+\]\[([^\]]+)\]/);
                    if (nameMatch) {
                        sku = nameMatch[1];
                    }
                }

                targets.push({
                    element: skuform,
                    memberName: memberName,
                    productName: fullName,
                    sku: sku,
                    price: price,
                    type: type,
                    isFCOnly: isFCOnly
                });
            }
        });

        return targets;
    }

    // Group targets by member
    function groupByMember(targets) {
        const groups = {};
        targets.forEach(target => {
            if (!groups[target.memberName]) {
                groups[target.memberName] = [];
            }
            groups[target.memberName].push(target);
        });
        return groups;
    }

    // Create control panel
    function createPanel() {
        const targets = extractTargets();
        if (targets.length === 0) {
            console.log('No apply targets found.');
            return;
        }
        const panel = document.createElement('div');
        panel.id = 'sukisuki-panel';
        panel.style.cssText = `
            position: fixed;
            top: 20px;
            left: 20px;
            width: 400px;
            max-height: 80vh;
            background: white;
            border: 2px solid #ff6991;
            border-radius: 10px;
            padding: 15px;
            z-index: 10000;
            box-shadow: 0 4px 20px rgba(0,0,0,0.3);
            overflow-y: auto;
            font-family: Arial, sans-serif;
            font-size: 14px;
        `;
        const groupedTargets = groupByMember(targets);
        const savedNicknames = loadNicknames();

        panel.innerHTML = `
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px;">
                <h3 style="margin: 0; color: #ff6991;">SUKISUKI Auto Apply</h3>
                <button id="toggle-panel" style="background: #ff6991; color: white; border: none; padding: 5px 10px; border-radius: 5px; cursor: pointer;">−</button>
            </div>

            <div id="panel-content">
                <!-- Nickname Settings -->
                <div style="margin-bottom: 15px; padding: 10px; background: #f9f9f9; border-radius: 5px;">
                    <h4 style="margin: 0 0 10px 0;">ニックネーム設定</h4>
                    <input type="text" id="nickname-input" placeholder="ニックネーム" style="width: 100%; padding: 8px; margin-bottom: 5px; border: 1px solid #ddd; border-radius: 3px;">
                    <input type="text" id="nickname-kana-input" placeholder="ニックネーム読み" style="width: 100%; padding: 8px; margin-bottom: 10px; border: 1px solid #ddd; border-radius: 3px;">

                    <div style="margin-bottom: 10px;">
                        <label style="font-weight: bold;">保存済みニックネーム:</label>
                        <select id="saved-nicknames" style="width: 100%; padding: 5px; margin-top: 5px;">
                            <option value="">選択してください</option>
                            ${savedNicknames.map(nick => `<option value="${nick.name}|${nick.kana}">${nick.name} (${nick.kana})</option>`).join('')}
                        </select>
                    </div>

                    <button id="save-nickname" style="background: #2EC9E8; color: white; border: none; padding: 8px 15px; border-radius: 5px; cursor: pointer; margin-right: 5px;">保存</button>
                    <button id="load-nickname" style="background: #28a745; color: white; border: none; padding: 8px 15px; border-radius: 5px; cursor: pointer;">読込</button>
                </div>

                <!-- Member Selection -->
                <div style="margin-bottom: 15px;">
                    <h4 style="margin: 0 0 10px 0;">メンバー・商品選択</h4>
                    <div id="member-selection">
                        ${Object.keys(groupedTargets).map(memberName => `
                            <div style="margin-bottom: 15px; border: 1px solid #ddd; border-radius: 5px; padding: 10px;">
                                <div style="display: flex; align-items: center; margin-bottom: 10px;">
                                    <input type="checkbox" id="member-${memberName.replace(/\s/g, '_')}" style="margin-right: 8px;">
                                    <label for="member-${memberName.replace(/\s/g, '_')}" style="font-weight: bold; color: #ff6991;">${memberName}</label>
                                </div>
                                <div style="margin-left: 20px;">
                                    ${groupedTargets[memberName].map((target, idx) => `
                                        <div style="margin-bottom: 5px;">
                                            <input type="checkbox" id="target-${memberName.replace(/\s/g, '_')}-${idx}" data-member="${memberName}" data-product="${target.productName}" style="margin-right: 5px;">
                                            <label for="target-${memberName.replace(/\s/g, '_')}-${idx}" style="font-size: 12px;">
                                                ${target.productName} - ${target.price}
                                                ${target.isFCOnly ? '<span style="background: #ff6991; color: white; padding: 2px 5px; border-radius: 3px; margin-left: 5px; font-size: 10px;">FC限定</span>' : '<span style="background: #2EC9E8; color: white; padding: 2px 5px; border-radius: 3px; margin-left: 5px; font-size: 10px;">誰でも</span>'}
                                            </label>
                                        </div>
                                    `).join('')}
                                </div>
                            </div>
                        `).join('')}
                    </div>
                </div>

                <!-- Action Buttons -->
                <div style="text-align: center;">
                    <button id="select-all" style="background: #28a745; color: white; border: none; padding: 10px 20px; border-radius: 5px; cursor: pointer; margin-right: 10px;">全選択</button>
                    <button id="clear-all" style="background: #dc3545; color: white; border: none; padding: 10px 20px; border-radius: 5px; cursor: pointer; margin-right: 10px;">全解除</button>
                    <button id="submit-all" style="background: #ff6991; color: white; border: none; padding: 15px 30px; border-radius: 5px; cursor: pointer; font-weight: bold; font-size: 16px;">一括申込</button>
                </div>

                <div id="status" style="margin-top: 15px; padding: 10px; background: #f8f9fa; border-radius: 5px; font-size: 12px; min-height: 20px;"></div>
            </div>
        `;

        document.body.appendChild(panel);
        attachEventListeners(targets, groupedTargets);
    }

    // Attach event listeners
    function attachEventListeners(targets, groupedTargets) {
        // Toggle panel
        document.getElementById('toggle-panel').addEventListener('click', function() {
            const content = document.getElementById('panel-content');
            const button = this;
            if (content.style.display === 'none') {
                content.style.display = 'block';
                button.textContent = '−';
            } else {
                content.style.display = 'none';
                button.textContent = '+';
            }
        });

        // Save nickname
        document.getElementById('save-nickname').addEventListener('click', function() {
            const name = document.getElementById('nickname-input').value.trim();
            const kana = document.getElementById('nickname-kana-input').value.trim();

            if (name && kana) {
                const saved = loadNicknames();
                const existing = saved.find(n => n.name === name && n.kana === kana);

                if (!existing) {
                    saved.push({ name, kana });
                    saveNicknames(saved);

                    // Update dropdown
                    const select = document.getElementById('saved-nicknames');
                    const option = document.createElement('option');
                    option.value = `${name}|${kana}`;
                    option.textContent = `${name} (${kana})`;
                    select.appendChild(option);

                    updateStatus('ニックネームを保存しました', 'success');
                } else {
                    updateStatus('このニックネームは既に保存されています', 'warning');
                }
            } else {
                updateStatus('ニックネームと読みを入力してください', 'error');
            }
        });

        // Load nickname
        document.getElementById('load-nickname').addEventListener('click', function() {
            const selected = document.getElementById('saved-nicknames').value;
            if (selected) {
                const [name, kana] = selected.split('|');
                document.getElementById('nickname-input').value = name;
                document.getElementById('nickname-kana-input').value = kana;
                updateStatus('ニックネームを読み込みました', 'success');
            }
        });

        // Member checkbox logic
        Object.keys(groupedTargets).forEach(memberName => {
            const memberCheckbox = document.getElementById(`member-${memberName.replace(/\s/g, '_')}`);
            memberCheckbox.addEventListener('change', function() {
                groupedTargets[memberName].forEach((target, idx) => {
                    const targetCheckbox = document.getElementById(`target-${memberName.replace(/\s/g, '_')}-${idx}`);
                    targetCheckbox.checked = this.checked;
                });
            });
        });

        // Select all
        document.getElementById('select-all').addEventListener('click', function() {
            document.querySelectorAll('#member-selection input[type="checkbox"]').forEach(cb => {
                cb.checked = true;
            });
        });

        // Clear all
        document.getElementById('clear-all').addEventListener('click', function() {
            document.querySelectorAll('#member-selection input[type="checkbox"]').forEach(cb => {
                cb.checked = false;
            });
        });

        // Submit all
        document.getElementById('submit-all').addEventListener('click', function() {
            submitSelectedTargets(targets);
        });
    }

    // Submit selected targets
    function submitSelectedTargets(targets) {
        const name = document.getElementById('nickname-input').value.trim();
        const kana = document.getElementById('nickname-kana-input').value.trim();

        if (!name || !kana) {
            updateStatus('ニックネームと読みを入力してください', 'error');
            return;
        }

        const selectedTargets = [];
        document.querySelectorAll('#member-selection input[type="checkbox"]:checked').forEach(cb => {
            if (cb.dataset.member && cb.dataset.product) {
                const target = targets.find(t => t.memberName === cb.dataset.member && t.productName === cb.dataset.product);
                if (target) {
                    selectedTargets.push(target);
                }
            }
        });

        if (selectedTargets.length === 0) {
            updateStatus('申込対象を選択してください', 'error');
            return;
        }

        updateStatus(`${selectedTargets.length}件の申込を開始します...`, 'info');

        let successCount = 0;

        // Process each target directly with fetch
        const tasks = selectedTargets.map((target, index) => {
            updateStatus(`申込中... ${index + 1}/${selectedTargets.length} - ${target.memberName}`, 'info');

            // Highlight current target
            target.element.style.border = '3px solid #ff6991';
            target.element.scrollIntoView({ behavior: 'smooth', block: 'center' });

            // Submit directly via fetch
            return submitApplication(target, name, kana)
                .then(success => {
                    if (success) {
                        target.element.style.border = '3px solid #28a745';
                        updateStatus(`${target.memberName} の申込が完了しました`, 'success');
                        successCount++;
                    } else {
                        target.element.style.border = '3px solid #dc3545';
                        updateStatus(`${target.memberName} の申込に失敗しました`, 'error');
                    }
                })
                .catch(error => {
                    console.error('Application error:', error);
                    target.element.style.border = '3px solid #dc3545';
                    updateStatus(`${target.memberName} でエラー: ${error.message}`, 'error');
                });
        });
        Promise.all(tasks).then(() => {
            console.log('All submissions processed.');
            updateStatus(`全ての申込処理が完了しました: ${successCount}/${selectedTargets.length}件成功`);
            updateStatus('Please refresh the page to see updated status.', 'warning');
        });
    }

    // Extract SKU and SKUDISP from target's select button
    function extractSkuFromTarget(target) {
        // Look for .selectbutton with data-sku and data-skudisp attributes
        const selectButton = target.element.querySelector('.selectbutton[data-sku]');
        if (selectButton) {
            const sku = selectButton.getAttribute('data-sku');
            const skudisp = selectButton.getAttribute('data-skudisp');

            if (sku) {
                console.log('Found SKU from selectbutton:', sku);
                console.log('Found SKUDISP from selectbutton:', skudisp);
                return { sku, skudisp };
            }
        }

        // Fallback: look for any element with data-sku
        const anySkuElement = target.element.querySelector('[data-sku]');
        if (anySkuElement) {
            const sku = anySkuElement.getAttribute('data-sku');
            const skudisp = anySkuElement.getAttribute('data-skudisp') || target.productName;

            console.log('Found SKU from any element:', sku);
            return { sku, skudisp };
        }

        console.error('Could not find SKU for target:', target.productName);
        return null;
    }

    // Submit application via fetch
    async function submitApplication(target, nickname, nicknameKana) {
        try {
            // Extract SKU and SKUDISP from target
            const skuData = extractSkuFromTarget(target);
            if (!skuData || !skuData.sku) {
                throw new Error('Could not find SKU for target');
            }

            // Build query parameters like in the curl command
            const params = new URLSearchParams({
                apply: '1',
                sku: skuData.sku,
                skudisp: skuData.skudisp,
                req_qty: '1',
                nickname: nickname,
                nickname_kana: nicknameKana
            });

            // Construct URL with query parameters
            const baseUrl = window.location.href.split('?')[0];
            const submitUrl = `${baseUrl}?${params.toString()}`;

            // Log what we're submitting for debugging
            console.log('Submitting application:', {
                url: submitUrl,
                sku: skuData.sku,
                skudisp: skuData.skudisp,
                nickname,
                nicknameKana
            });

            // Submit via GET request (like the curl command)
            const response = await fetch(submitUrl, {
                method: 'GET',
                headers: {
                    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8',
                    'Accept-Language': 'ja-JP,ja;q=0.9,en;q=0.8',
                    'Cache-Control': 'no-cache',
                    'Pragma': 'no-cache',
                    'Upgrade-Insecure-Requests': '1',
                    'User-Agent': navigator.userAgent,
                    'Referer': window.location.href
                },
                credentials: 'same-origin', // Include cookies
                redirect: 'follow'
            });

            // Log response details
            console.log('Response status:', response.status);
            console.log('Response URL:', response.url);
            console.log('Response headers:', Object.fromEntries(response.headers.entries()));

            // Check if the response indicates success
            if (response.ok) {
                const responseText = await response.text();

                // Log response content for debugging (first 500 chars)
                console.log('Response content (truncated):', responseText.substring(0, 500));

                return true;
            } else {
                console.error('HTTP error:', response.status, response.statusText);
                const errorText = await response.text();
                console.error('Error response:', errorText.substring(0, 500));
                return false;
            }

        } catch (error) {
            console.error('Submit application error:', error);
            throw error;
        }
    }



    // Update status message
    function updateStatus(message, type = 'info') {
        const status = document.getElementById('status');
        const colors = {
            success: '#28a745',
            error: '#dc3545',
            warning: '#ffc107',
            info: '#17a2b8'
        };

        const newMessage = document.createElement('div');
        newMessage.style.color = colors[type] || colors.info;
        newMessage.textContent = message;
        status.appendChild(newMessage);
    }

    // Initialize
    function init() {
        // Wait for page to load
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', createPanel);
        } else {
            createPanel();
        }
    }

    init();
})();