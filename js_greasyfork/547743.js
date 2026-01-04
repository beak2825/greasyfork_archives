// ==UserScript==
// @name         更好的 VS Code 扩展安装程序
// @name:en      Better VS Code Extension Installer
// @namespace    http://tampermonkey.net/
// @version      1.13
// @description  Adds download and install buttons to VS Code extension marketplace pages. Download .vsix files directly or install extensions to VS Code, Cursor, Windsurf, Trae, and Kiro with one click.
// @description:en  Adds download and install buttons to VS Code extension marketplace pages. Download .vsix files directly or install extensions to VS Code, Cursor, Windsurf, Trae, and Kiro with one click.
// @description:zh-CN  为 VS Code 扩展市场页面添加下载和安装按钮。直接下载 .vsix 文件或一键安装扩展到 VS Code、Cursor、Windsurf、Trae 和 Kiro。
// @author       eachann1024
// @match        https://marketplace.visualstudio.com/items?itemName=*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=visualstudio.com
// @grant        none
// @license      MIT
// @homepageURL  https://github.com/eachann1024/scripts-toolbox
// @supportURL   https://github.com/eachann1024/scripts-toolbox/issues
// @run-at       document-idle
// @compatible   chrome
// @compatible   firefox
// @compatible   edge
// @category     Developer Tools
// @tag          vscode
// @tag          extension
// @tag          download
// @tag          cursor
// @tag          windsurf
// @tag          marketplace
// @tag          vsix
// @tag          开发工具
// @tag          vscode扩展
// @tag          扩展
// @tag          下载
// @tag          Kiro
// @tag          Trae
// @tag          Windsurf

// @keyword      vscode extension download cursor windsurf trae kiro vsix marketplace
// @keyword      扩展下载 插件下载 开发工具
// @downloadURL https://update.greasyfork.org/scripts/547743/%E6%9B%B4%E5%A5%BD%E7%9A%84%20VS%20Code%20%E6%89%A9%E5%B1%95%E5%AE%89%E8%A3%85%E7%A8%8B%E5%BA%8F.user.js
// @updateURL https://update.greasyfork.org/scripts/547743/%E6%9B%B4%E5%A5%BD%E7%9A%84%20VS%20Code%20%E6%89%A9%E5%B1%95%E5%AE%89%E8%A3%85%E7%A8%8B%E5%BA%8F.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function getItemNameFromURL() {
        const urlParams = new URLSearchParams(window.location.search);
        return urlParams.get('itemName');
    }

    function parseItemName(itemName) {
        const parts = itemName.split('.');
        if (parts.length < 2) {
            throw new Error('Invalid itemName format');
        }
        return {
            publisher: parts[0],
            extensionName: parts.slice(1).join('.')
        };
    }

    function findVersion() {
        const detailsSections = document.querySelectorAll('.additional-details-section');
        for (let section of detailsSections) {
            const header = section.querySelector('h3');
            if (header && header.textContent.trim() === 'Additional Details') {
                const rows = section.querySelectorAll('tr');
                for (let row of rows) {
                    const firstCell = row.querySelector('td:first-child');
                    if (firstCell && firstCell.textContent.trim() === 'Version') {
                        const versionCell = row.querySelector('td:last-child');
                        if (versionCell) {
                            return versionCell.textContent.trim();
                        }
                    }
                }
            }
        }

        const versionHistory = document.querySelector('#version-history');
        if (versionHistory) {
            const versionElement = versionHistory.querySelector('tr:nth-child(2) td:nth-child(1)');
            if (versionElement) {
                return versionElement.textContent.trim();
            }
        }

        const versionElement = document.querySelector('.version, [data-reporting-key="Version"]');
        if (versionElement) {
            return versionElement.textContent.trim();
        }

        const jsonScript = document.querySelector('script.jiContent');
        if (jsonScript) {
            try {
                const jsonData = JSON.parse(jsonScript.textContent);
                if (jsonData.Resources && jsonData.Resources.Version) {
                    return jsonData.Resources.Version;
                }
            } catch (e) {
                console.error('Error parsing JSON from script tag:', e);
            }
        }

        throw new Error('Could not find extension version on the page');
    }

    function downloadVSIX(publisher, extensionName, version) {
        const downloadUrl = `https://marketplace.visualstudio.com/_apis/public/gallery/publishers/${publisher}/vsextensions/${extensionName}/${version}/vspackage`;
        const link = document.createElement('a');
        link.href = downloadUrl;
        link.download = `${extensionName}-${version}.vsix`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }

    function addCustomInstallButtons() {
        try {
            const itemName = getItemNameFromURL();
            if (!itemName) {
                console.error('Item name not found in URL');
                return;
            }

            const { publisher, extensionName } = parseItemName(itemName);
            
            let installContainer = document.querySelector('.ux-item-action');
            if (!installContainer) {
                installContainer = document.querySelector('.install-button-container') ||
                                 document.querySelector('.extension-action-container') ||
                                 document.querySelector('[class*="install"][class*="button"]') ||
                                 document.querySelector('.action-buttons');
            }
            if (!installContainer) {
                console.error('Main install button container not found');
                return;
            }

            const customButtonsContainer = document.createElement('div');
            customButtonsContainer.className = 'custom-install-buttons';
            customButtonsContainer.style.marginTop = '10px';
            customButtonsContainer.style.display = 'flex';
            customButtonsContainer.style.gap = '10px';
            customButtonsContainer.style.flexWrap = 'wrap';

            const editors = [
                { 
                    name: 'Cursor', 
                    scheme: 'cursor',
                    iconUrl: 'https://icon.horse/icon/cursor.sh'
                },
                { 
                    name: 'Windsurf', 
                    scheme: 'windsurf',
                    iconUrl: 'https://icon.horse/icon/windsurf.ai'
                },
                { 
                    name: 'Trae', 
                    scheme: 'trae',
                    iconUrl: 'https://lf-cdn.trae.ai/obj/trae-ai-sg/trae_website_prod/favicon.png'
                },
                { 
                    name: 'Kiro', 
                    scheme: 'kiro',
                    iconUrl: 'https://kiro.dev/favicon.ico'
                }
            ];

            const downloadButtonWrapper = document.createElement('span');
            downloadButtonWrapper.className = 'ux-oneclick-install-button-container';
            downloadButtonWrapper.innerHTML = `
                <button type="button" class="ms-Button ux-button install ms-Button--default root-39" data-is-focusable="true" id="download-extension-button">
                    <div class="ms-Button-flexContainer flexContainer-40" style="display: flex; align-items: center;">
                        <div class="ms-Button-textContainer textContainer-41">
                            <div class="ms-Button-label label-43" style="display: flex; align-items: center;">
                                <img src="https://icon.horse/icon/visualstudio.com" alt="Download icon" style="width: 16px; height: 16px; margin-right: 8px; display: inline-block;">
                                Download VSIX
                            </div>
                        </div>
                    </div>
                </button>
            `;

            const downloadButton = downloadButtonWrapper.querySelector('button');
            downloadButton.addEventListener('click', function(e) {
                e.preventDefault();
                e.stopPropagation();
                try {
                    const version = findVersion();
                    downloadVSIX(publisher, extensionName, version);
                } catch (error) {
                    console.error('Error downloading extension:', error);
                    alert('Failed to download extension. Please check console for details.');
                }
            });

            customButtonsContainer.appendChild(downloadButtonWrapper);

            editors.forEach(editor => {
                const buttonWrapper = document.createElement('span');
                buttonWrapper.className = 'ux-oneclick-install-button-container';
                buttonWrapper.innerHTML = `
                    <button type="button" class="ms-Button ux-button install ms-Button--default root-39" data-is-focusable="true">
                        <div class="ms-Button-flexContainer flexContainer-40" style="display: flex; align-items: center;">
                            <div class="ms-Button-textContainer textContainer-41">
                                <div class="ms-Button-label label-43" style="display: flex; align-items: center;">
                                    <img src="${editor.iconUrl}" alt="${editor.name} icon" style="width: 16px; height: 16px; margin-right: 8px; display: inline-block;">
                                    ${editor.name}
                                </div>
                            </div>
                        </div>
                    </button>
                `;

                const customButton = buttonWrapper.querySelector('button');
                customButton.addEventListener('click', function(e) {
                    e.preventDefault();
                    e.stopPropagation();
                    try {
                        const customUrl = `${editor.scheme}:extension/${publisher}.${extensionName}`;
                        window.open(customUrl, '_self');
                    } catch (error) {
                        console.error(`Error installing to ${editor.name}:`, error);
                        alert(`Failed to install to ${editor.name}. Please check console for details.`);
                    }
                });

                customButtonsContainer.appendChild(buttonWrapper);
            });

            installContainer.parentNode.insertBefore(customButtonsContainer, installContainer.nextSibling);
            addVersionHistoryButtons(editors, publisher, extensionName);
        } catch (error) {
            console.error('Error adding custom install buttons:', error);
        }
    }

    function addVersionHistoryButtons(editors, publisher, extensionName) {
        const targetTable = document.querySelector('#version-history table') || document.querySelector('.version-history-table, [class*="version"][class*="history"] table');
        if (!targetTable) { return; }
        const rows = targetTable.querySelectorAll('tbody tr');
        rows.forEach(row => {
            if (row.querySelector('.version-custom-buttons')) {
                return;
            }
            const versionCell = row.querySelector('td:first-child');
            if (!versionCell) return;
            const version = versionCell.textContent.trim();
            const buttonsContainer = document.createElement('td');
            buttonsContainer.className = 'version-custom-buttons';
            buttonsContainer.style.cssText = 'padding: 8px; white-space: nowrap; text-align: center;';
            const downloadBtn = document.createElement('button');
            downloadBtn.innerHTML = 'Download VSIX';
            downloadBtn.style.cssText = 'margin-right: 5px; padding: 4px 8px; border: 1px solid #ccc; border-radius: 3px; background: #f5f5f5; cursor: pointer; font-size: 12px;';
            downloadBtn.title = `下载 ${version} 版本`;
            downloadBtn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                try {
                    downloadVSIX(publisher, extensionName, version);
                } catch (error) {
                    console.error('下载扩展时出错:', error);
                    alert('下载失败，请查看控制台了解详情。');
                }
            });
            buttonsContainer.appendChild(downloadBtn);
            editors.forEach(editor => {
                const installBtn = document.createElement('button');
                installBtn.innerHTML = `${editor.name}`;
                installBtn.style.cssText = 'margin-right: 5px; padding: 4px 8px; border: 1px solid #ccc; border-radius: 3px; background: #f0f8ff; cursor: pointer; font-size: 12px;';
                installBtn.title = `安装到 ${editor.name}`;
                installBtn.addEventListener('click', (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    try {
                        const customUrl = `${editor.scheme}:extension/${publisher}.${extensionName}`;
                        window.open(customUrl, '_self');
                    } catch (error) {
                        console.error(`安装到 ${editor.name} 时出错:`, error);
                        alert(`安装到 ${editor.name} 失败，请查看控制台了解详情。`);
                    }
                });
                
                buttonsContainer.appendChild(installBtn);
            });
            row.appendChild(buttonsContainer);
        });
        const headerRow = targetTable.querySelector('thead tr, tr:first-child');
        if (headerRow && !headerRow.querySelector('.version-actions-header')) {
            const headerCell = document.createElement('th');
            headerCell.className = 'version-actions-header';
            headerCell.textContent = '操作';
            headerCell.style.cssText = 'padding: 8px; text-align: center; font-weight: bold;';
            headerRow.appendChild(headerCell);
        }
    }

    function initializeButtons() {
        addCustomInstallButtons();
        setTimeout(() => {
            const customButtons = document.querySelector('.custom-install-buttons');
            if (!customButtons) {
                addCustomInstallButtons();
            }
            const versionButtons = document.querySelector('.version-custom-buttons');
            if (!versionButtons) {
                const itemName = getItemNameFromURL();
                if (itemName) {
                    try {
                        const { publisher, extensionName } = parseItemName(itemName);
                        const editors = [
                            { name: 'Cursor', scheme: 'cursor', iconUrl: 'https://icon.horse/icon/cursor.sh' },
                            { name: 'Windsurf', scheme: 'windsurf', iconUrl: 'https://icon.horse/icon/windsurf.ai' },
                            { name: 'Trae', scheme: 'trae', iconUrl: 'https://lf-cdn.trae.ai/obj/trae-ai-sg/trae_website_prod/favicon.png' },
                            { name: 'Kiro', scheme: 'kiro', iconUrl: 'https://kiro.dev/favicon.ico' }
                        ];
                        addVersionHistoryButtons(editors, publisher, extensionName);
                    } catch (error) {
                        console.error('无法为版本历史添加按钮:', error);
                    }
                }
            }
        }, 2000);
    }
    
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initializeButtons);
    } else {
        initializeButtons();
    }
})();