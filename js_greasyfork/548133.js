// ==UserScript==
// @name         划词搜索（通过16mag.net）磁力链接 0.1
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  在网页上选中文字，弹出搜索磁力按钮（需先开启右侧可拖动开关），点击后在当前页面小窗口显示 16mag.net 搜索结果，窗口大小和位置可动态调整，点击主页面空白处可关闭窗口。开关位置可沿右边缘拖动并记忆。
// @author       You
// @match        *://*/*
// @grant        GM_xmlhttpRequest
// @connect      16mag.net
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/548133/%E5%88%92%E8%AF%8D%E6%90%9C%E7%B4%A2%EF%BC%88%E9%80%9A%E8%BF%8716magnet%EF%BC%89%E7%A3%81%E5%8A%9B%E9%93%BE%E6%8E%A5%2001.user.js
// @updateURL https://update.greasyfork.org/scripts/548133/%E5%88%92%E8%AF%8D%E6%90%9C%E7%B4%A2%EF%BC%88%E9%80%9A%E8%BF%8716magnet%EF%BC%89%E7%A3%81%E5%8A%9B%E9%93%BE%E6%8E%A5%2001.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // --- Configuration ---
    const localStorageKey = 'magnetSearchEnabled';
    const localStorageKeyTogglePosition = 'magnetSearchTogglePositionTop'; // Key for saving toggle's top position

    // --- State ---
    let isSearchFeatureEnabled = localStorage.getItem(localStorageKey) === 'true';
    let isDraggingToggle = false;
    let dragStartMouseY = 0;
    let dragStartToggleTop = 0;

    // --- Create UI Elements ---

    // 1. Toggle Switch Elements (Checkbox only, draggable container)
    const toggleContainer = document.createElement('div');
    toggleContainer.id = 'magnet-search-toggle-container';
    toggleContainer.style.position = 'fixed';
    // Initial position will be set by applyTogglePosition function
    toggleContainer.style.right = '15px';
    toggleContainer.style.backgroundColor = 'rgba(245, 245, 245, 0.9)';
    toggleContainer.style.border = '1px solid #bbb';
    toggleContainer.style.padding = '5px';
    toggleContainer.style.borderRadius = '4px';
    toggleContainer.style.boxShadow = '0 1px 3px rgba(0, 0, 0, 0.2)';
    toggleContainer.style.zIndex = '10001';
    toggleContainer.style.display = 'flex';
    toggleContainer.style.alignItems = 'center';
    toggleContainer.style.cursor = 'grab'; // Indicate draggability

    const toggleCheckbox = document.createElement('input');
    toggleCheckbox.type = 'checkbox';
    toggleCheckbox.id = 'magnet-search-toggle';
    toggleCheckbox.checked = isSearchFeatureEnabled;
    toggleCheckbox.style.cursor = 'pointer'; // Checkbox itself retains pointer
    toggleCheckbox.style.verticalAlign = 'middle';
    toggleCheckbox.style.width = '14px';
    toggleCheckbox.style.height = '14px';

    toggleContainer.appendChild(toggleCheckbox);
    document.body.appendChild(toggleContainer);

    // Function to apply initial or saved position for the toggle container
    function applyTogglePosition() {
        const savedTop = localStorage.getItem(localStorageKeyTogglePosition);
        if (savedTop !== null) {
            toggleContainer.style.top = savedTop;
            toggleContainer.style.bottom = 'auto'; // Ensure bottom is not conflicting
        } else {
            // Default position (approx bottom third) if nothing is saved
            toggleContainer.style.top = 'auto';
            toggleContainer.style.bottom = '33vh';
        }
    }
    applyTogglePosition(); // Apply position after element is created

    // 2. Search Popup
    const searchPopup = document.createElement('div');
    searchPopup.id = 'search-popup';
    searchPopup.style.display = 'none';
    searchPopup.style.position = 'absolute';
    searchPopup.style.backgroundColor = 'white';
    searchPopup.style.border = '1px solid #ccc';
    searchPopup.style.padding = '3px';
    searchPopup.style.borderRadius = '4px';
    searchPopup.style.boxShadow = '0 2px 5px rgba(0, 0, 0, 0.2)';
    searchPopup.style.zIndex = '9999';
    document.body.appendChild(searchPopup);


    // 3. Search Button (inside popup)
    const searchButton = document.createElement('button');
    searchButton.id = 'search-button';
    searchButton.textContent = '搜磁力';
    searchButton.style.backgroundColor = '#007BFF';
    searchButton.style.color = 'white';
    searchButton.style.padding = '3px 6px';
    searchButton.style.border = 'none';
    searchButton.style.borderRadius = '3px';
    searchButton.style.cursor = 'pointer';
    searchButton.style.fontSize = '12px';
    searchPopup.appendChild(searchButton);


    // 4. Container for Search Results
    const resultContainer = document.createElement('div');
    resultContainer.id = 'result-container';
    resultContainer.style.display = 'none';
    resultContainer.style.position = 'fixed'; // Changed to fixed for centering relative to viewport
    resultContainer.style.border = '1px solid #ccc';
    resultContainer.style.zIndex = '9999';
    resultContainer.style.backgroundColor = 'white';
    resultContainer.style.padding = '10px';
    resultContainer.style.overflowY = 'auto';
    resultContainer.style.resize = 'both';
    document.body.appendChild(resultContainer);

    // 5. Close Button for Iframe
    const closeButton = document.createElement('button');
    closeButton.textContent = '关闭';
    closeButton.style.position = 'absolute'; // Changed to absolute to be relative to the container
    closeButton.style.zIndex = '10000';
    closeButton.style.display = 'none';
    closeButton.style.padding = '4px 8px';
    closeButton.style.backgroundColor = '#6c757d';
    closeButton.style.color = 'white';
    closeButton.style.border = 'none';
    closeButton.style.borderRadius = '3px';
    closeButton.style.cursor = 'pointer';
    closeButton.style.fontSize = '12px';
    document.body.appendChild(closeButton);

    // --- Event Listeners ---

    // Toggle Switch Checkbox Functionality
    toggleCheckbox.addEventListener('change', function() {
        isSearchFeatureEnabled = this.checked;
        localStorage.setItem(localStorageKey, isSearchFeatureEnabled);
        if (!isSearchFeatureEnabled) {
            searchPopup.style.display = 'none';
        }
    });

    // Drag functionality for Toggle Container
    toggleContainer.addEventListener('mousedown', function(event) {
        if (event.target === toggleCheckbox) { // If click is on checkbox, let checkbox handler work
            return;
        }
        event.preventDefault(); // Prevent text selection on the container itself
        isDraggingToggle = true;

        const rect = toggleContainer.getBoundingClientRect();
        dragStartToggleTop = rect.top; // Current top position in pixels

        // Explicitly set top and unset bottom for consistent drag calculations
        toggleContainer.style.top = dragStartToggleTop + 'px';
        toggleContainer.style.bottom = 'auto';

        dragStartMouseY = event.clientY;
        toggleContainer.style.cursor = 'grabbing';
        document.body.style.userSelect = 'none'; // Prevent text selection on page during drag
    });

    document.addEventListener('mousemove', function(event) {
        if (!isDraggingToggle) {
            return;
        }
        // No event.preventDefault() here to allow natural interaction if mouse leaves window briefly.
        // The one in mousedown is key.

        const deltaY = event.clientY - dragStartMouseY;
        let newTop = dragStartToggleTop + deltaY;

        const containerHeight = toggleContainer.offsetHeight;
        // Clamp newTop to be within viewport bounds
        newTop = Math.max(0, newTop); // Min top is 0 (prevent dragging above viewport)
        newTop = Math.min(window.innerHeight - containerHeight, newTop); // Max top (prevent dragging below viewport)

        toggleContainer.style.top = newTop + 'px';
    });

    document.addEventListener('mouseup', function(event) { // This listener handles multiple mouseup scenarios
        // Handle end of toggle drag
        if (isDraggingToggle) {
            isDraggingToggle = false;
            toggleContainer.style.cursor = 'grab';
            document.body.style.userSelect = ''; // Restore user select on page

            localStorage.setItem(localStorageKeyTogglePosition, toggleContainer.style.top);
        }

        // Original mouseup logic for text selection popup (excluding toggle container itself)
        if (toggleContainer.contains(event.target)) {
            // If the click (mouseup) was inside the toggle container (e.g. on checkbox or finishing a drag)
            // do not proceed with text selection logic.
            return;
        }

        if (!isSearchFeatureEnabled) {
            if (searchPopup.style.display === 'block' && !searchPopup.contains(event.target)) {
                 searchPopup.style.display = 'none';
            }
            return;
        }

        const selectedText = window.getSelection().toString().trim();
        if (selectedText) {
            const activeElement = document.activeElement;
            if (activeElement && (activeElement.tagName.toLowerCase() === 'input' || activeElement.tagName.toLowerCase() === 'textarea')) {
                if (activeElement.contains(window.getSelection().anchorNode)) {
                    searchPopup.style.display = 'none';
                    return;
                }
            }

            const range = window.getSelection().getRangeAt(0);
            const rect = range.getBoundingClientRect();
            searchPopup.style.left = rect.left + window.scrollX + 'px';
            searchPopup.style.top = rect.bottom + window.scrollY + 5 + 'px';
            searchPopup.style.display = 'block';
            searchButton.dataset.query = selectedText;
        } else {
            if (searchPopup.style.display === 'block' && !searchPopup.contains(event.target) && event.target !== searchButton) {
                searchPopup.style.display = 'none';
            }
        }
    });

    // Listen for Mouse Down (Mainly for Hiding Iframe Popup)
    document.addEventListener('mousedown', function (event) {
        // This mousedown is primarily for closing the iframe popup.
        // Drag initiation is handled by toggleContainer's mousedown.
        // Search popup hiding on click-away is partly handled by mouseup logic.

        if (toggleContainer.contains(event.target) || searchPopup.contains(event.target) || (resultContainer.style.display === 'block' && resultContainer.contains(event.target)) || closeButton.contains(event.target)) {
            // If click is on toggle, search popup, iframe, or its close button, do nothing here.
            return;
        }

        // Hide result container if it's visible and click is outside all relevant UI
        if (resultContainer.style.display === 'block') {
            resultContainer.style.display = 'none';
            closeButton.style.display = 'none';
            resultContainer.innerHTML = ''; // Clear content
        }

        // Consolidate searchPopup hiding for mousedown outside
        // This can be tricky with selection. The mouseup logic is often better for this.
        // For now, let mouseup handle searchPopup hiding to avoid conflicts with text selection.
        // if (searchPopup.style.display === 'block' && !window.getSelection().toString().trim()) {
        // searchPopup.style.display = 'none';
        // }
    });


    // Search Button Click
    searchButton.addEventListener('click', function () {
        searchPopup.style.display = 'none';
        const query = this.dataset.query;
        const searchUrl = `https://16mag.net/search?q=${encodeURIComponent(query)}`;

        // Show a loading message
        resultContainer.innerHTML = '<p style="text-align: center; color: #555;">正在加载...</p>';
        resultContainer.style.display = 'block';
        closeButton.style.display = 'block';

        // Center the container
        const windowWidth = window.innerWidth;
        const windowHeight = window.innerHeight;
        const containerWidth = Math.min(windowWidth * 0.8, 800);
        const containerHeight = Math.min(windowHeight * 0.8, 600);
        const containerLeft = (windowWidth - containerWidth) / 2;
        const containerTop = (windowHeight - containerHeight) / 2;

        resultContainer.style.width = containerWidth + 'px';
        resultContainer.style.height = containerHeight + 'px';
        resultContainer.style.left = containerLeft + 'px';
        resultContainer.style.top = containerTop + 'px';

        // Position close button relative to the container
        const closeButtonWidth = closeButton.offsetWidth;
        closeButton.style.left = (containerLeft + containerWidth - closeButtonWidth - 15) + 'px'; // 15px from right
        closeButton.style.top = (containerTop + 5) + 'px'; // 5px from top

        GM_xmlhttpRequest({
            method: "GET",
            url: searchUrl,
            onload: function(response) {
                console.log('--- 16mag.net Response HTML ---');
                console.log(response.responseText);

                const parser = new DOMParser();
                const doc = parser.parseFromString(response.responseText, "text/html");
                const resultRows = doc.querySelectorAll('.file-list tr');

                let htmlContent = '<div style="font-family: -apple-system, BlinkMacSystemFont, \'Segoe UI\', Roboto, sans-serif; max-width: 100%;">';
                if (resultRows.length > 0) {
                    htmlContent += '<div style="display: grid; gap: 12px;">';
                    resultRows.forEach(row => {
                        const titleLink = row.querySelector('a[href^="/!"]');
                        const sizeElement = row.querySelector('.td-size');
                        const magnetElement = row.querySelector('a[href^="magnet:"]');

                        if (titleLink) {
                            const title = titleLink.querySelector('b') ? titleLink.querySelector('b').textContent.trim() : titleLink.textContent.trim();
                            const detailUrl = 'https://16mag.net' + titleLink.getAttribute('href');

                            let magnetLink = '';
                            if (magnetElement) {
                                magnetLink = magnetElement.getAttribute('href');
                            } else {
                                magnetLink = '#'; // 占位，后续异步替换
                            }
                            const size = sizeElement ? sizeElement.textContent.trim() : 'N/A';
                            const sampleText = row.querySelector('.sample') ? row.querySelector('.sample').textContent.trim() : '';

                            htmlContent += `
                            <div style="border: 1px solid #e1e5e9; border-radius: 8px; padding: 16px; background: #fafbfc; transition: box-shadow 0.2s;">
                                <div style="font-weight: 600; font-size: 16px; color: #24292e; margin-bottom: 8px;">
                                    <a href="${detailUrl}" target="_blank" style="color: #24292e; text-decoration: none;">${title}</a>
                                </div>
                                ${sampleText ? `<div style="font-size: 14px; color: #586069; margin-bottom: 8px;">${sampleText}</div>` : ''}
                                <div style="font-size: 14px; color: #0366d6; word-break: break-all; margin-bottom: 8px;">
                                    <a href="${magnetLink}" style="color: #0366d6; text-decoration: none;">${magnetLink}</a>
                                </div>
                                <div style="font-size: 13px; color: #6a737d; font-weight: 500;">📦 ${size}</div>
                            </div>`;
                        }
                    });
                    htmlContent += '</div>';
                } else {
                    htmlContent += '<div style="text-align: center; padding: 40px; color: #586069; font-size: 16px;">🔍 未找到相关结果</div>';
                }htmlContent += '</div>';
                htmlContent += '</div>';
                resultContainer.innerHTML = htmlContent;

                // 异步获取详情页哈希值
                const cards = resultContainer.querySelectorAll('div[style*="border: 1px solid"]');
                cards.forEach(card => {
                    const titleLink = card.querySelector('a[href*="/!"]');
                    let magnetLinkElement = card.querySelector('a[href^="magnet:"], a[href="#"]');

                    if (!titleLink) {
                        return;
                    }

                    const detailUrl = titleLink.href;

                    GM_xmlhttpRequest({
                        method: "GET",
                        url: detailUrl,
                        onload: function(response) {
                            const parser = new DOMParser();
                            const detailDoc = parser.parseFromString(response.responseText, "text/html");

                            let hash = '';
                            const dtElements = detailDoc.querySelectorAll('dt');
                            for (let dt of dtElements) {
                                if (dt.textContent.trim() === 'Hash :') {
                                    const dd = dt.nextElementSibling;
                                    if (dd && dd.tagName === 'DD') {
                                        hash = dd.textContent.trim();
                                        break;
                                    }
                                }
                            }

                            if (!hash) {
                                const textContent = detailDoc.body ? detailDoc.body.textContent : '';
                                const hashMatch = textContent.match(/[a-fA-F0-9]{40}/);
                                if (hashMatch) {
                                    hash = hashMatch[0];
                                }
                            }

                            if (hash) {
                                const newMagnetLink = `magnet:?xt=urn:btih:${hash}`;

                                // 如果磁力链接元素不存在，创建一个新的
                                if (!magnetLinkElement) {
                                    const magnetDiv = document.createElement('div');
                                    magnetDiv.style.cssText = 'font-size: 14px; color: #0366d6; word-break: break-all; margin-bottom: 8px;';

                                    const newMagnetLinkEl = document.createElement('a');
                                    newMagnetLinkEl.href = newMagnetLink;
                                    newMagnetLinkEl.textContent = newMagnetLink;
                                    newMagnetLinkEl.style.cssText = 'color: #0366d6; text-decoration: none;';

                                    magnetDiv.appendChild(newMagnetLinkEl);
                                    card.insertBefore(magnetDiv, card.querySelector('div:last-child'));
                                    magnetLinkElement = newMagnetLinkEl;
                                } else {
                                    magnetLinkElement.href = newMagnetLink;
                                    magnetLinkElement.textContent = newMagnetLink;
                                }
                            }
                        },
                        onerror: function() {
                            console.log('无法获取详情页哈希值');
                        }
                    });
                });
            },
            onerror: function(error) {
                resultContainer.innerHTML = `<p style="text-align: center; color: red;">加载失败: ${error.statusText || 'Network Error'}</p>`;
            }
        });
    });

    // Close Button Click
    closeButton.addEventListener('click', function() {
        resultContainer.style.display = 'none';
        closeButton.style.display = 'none';
        resultContainer.innerHTML = ''; // Clear content
    });

})();