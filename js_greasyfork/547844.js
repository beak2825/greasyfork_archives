// ==UserScript==
// @name         矿神源套件下载助手
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  在无法下载矿神套件时，使用此脚本进行套件下载(恶意下载会被封禁！)
// @author       凯友mrp下载
// @match        https://spk7.imnks.com/*
// @grant        none
// @license MIT
// @icon         https://spk7.imnks.com/favicon.ico
// @downloadURL https://update.greasyfork.org/scripts/547844/%E7%9F%BF%E7%A5%9E%E6%BA%90%E5%A5%97%E4%BB%B6%E4%B8%8B%E8%BD%BD%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/547844/%E7%9F%BF%E7%A5%9E%E6%BA%90%E5%A5%97%E4%BB%B6%E4%B8%8B%E8%BD%BD%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function waitForElement(selector, callback, maxWait = 10000) {
        const element = document.querySelector(selector);
        if (element) {
            callback(element);
            return;
        }

        const startTime = Date.now();
        const interval = setInterval(() => {
            const element = document.querySelector(selector);
            if (element) {
                clearInterval(interval);
                callback(element);
            } else if (Date.now() - startTime > maxWait) {
                clearInterval(interval);
                console.log('等待元素超时:', selector);
            }
        }, 100);
    }

    function createDeviceSelector() {
        console.log('开始创建设备选择器...');
        
        const deviceCards = document.querySelectorAll('div.mdl-cell.mdl-cell--2-col.mdl-card.small-card.clickable-card.mdl-shadow--2dp');
        console.log('找到设备卡片数量:', deviceCards.length);
        
        if (deviceCards.length === 0) {
            console.log('未找到设备卡片，尝试其他选择器...');
            const alternativeCards = document.querySelectorAll('div[onclick*="location.href="]');
            console.log('找到替代卡片数量:', alternativeCards.length);
        }

        const devices = [];
        deviceCards.forEach(card => {
            const onclick = card.getAttribute('onclick');
            if (onclick && onclick.includes('location.href=')) {
                const match = onclick.match(/location\.href='([^']+)'/);
                if (match) {
                    const arch = match[1];
                    const deviceName = card.textContent.trim();
                    devices.push({ name: deviceName, arch: arch });
                    console.log('找到设备:', deviceName, 'arch:', arch);
                }
            }
        });

        console.log('解析到的设备列表:', devices);

        if (devices.length === 0) {
            console.log('未能解析到任何设备信息');
            return;
        }

        const container = document.createElement('div');
        container.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: white;
            border: 2px solid #007acc;
            border-radius: 8px;
            padding: 15px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            z-index: 10000;
            min-width: 250px;
            font-family: Arial, sans-serif;
        `;
        
        // 创建关闭按钮
        const closeButton = document.createElement('button');
        closeButton.innerHTML = '×';
        closeButton.style.cssText = `
            position: absolute;
            top: 5px;
            right: 8px;
            width: 24px;
            height: 24px;
            background: #ff4444;
            color: white;
            border: none;
            border-radius: 50%;
            font-size: 18px;
            font-weight: bold;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            line-height: 1;
            z-index: 10001;
        `;
        
        // 关闭按钮悬停效果
        closeButton.addEventListener('mouseenter', function() {
            this.style.background = '#cc0000';
        });
        
        closeButton.addEventListener('mouseleave', function() {
            this.style.background = '#ff4444';
        });
        
        // 关闭按钮点击事件
        closeButton.addEventListener('click', function() {
            container.remove();
            console.log('设备选择器已关闭');
        });
        
        container.appendChild(closeButton);

        const title = document.createElement('h3');
        title.textContent = '选择设备型号';
        title.style.cssText = 'margin: 0 0 10px 0; color: #007acc; font-size: 16px;';
        container.appendChild(title);

        const select = document.createElement('select');
        select.style.cssText = `
            width: 100%;
            padding: 8px;
            border: 1px solid #ccc;
            border-radius: 4px;
            margin-bottom: 10px;
            font-size: 14px;
        `;

        const defaultOption = document.createElement('option');
        defaultOption.value = '';
        defaultOption.textContent = '请选择设备型号';
        select.appendChild(defaultOption);

        devices.forEach(device => {
            const option = document.createElement('option');
            option.value = device.arch;
            option.textContent = device.name;
            select.appendChild(option);
        });

        select.addEventListener('change', function() {
            if (this.value) {
                console.log('用户选择了设备:', this.value);
                
                const selectedOption = this.options[this.selectedIndex];
                const selectedDeviceName = selectedOption.textContent;
                
                const selectedDevice = devices.find(device => device.arch === this.value && device.name === selectedDeviceName);
                if (selectedDevice) {
                    const deviceInfo = {
                        name: selectedDevice.name,
                        arch: selectedDevice.arch,
                        timestamp: Date.now()
                    };
                    localStorage.setItem('selectedDevice', JSON.stringify(deviceInfo));
                    console.log('已缓存设备信息:', deviceInfo);
                } else {
                    const deviceInfo = {
                        name: selectedDeviceName,
                        arch: this.value,
                        timestamp: Date.now()
                    };
                    localStorage.setItem('selectedDevice', JSON.stringify(deviceInfo));
                    console.log('已缓存设备信息（使用option文本）:', deviceInfo);
                }
                
                window.location.href = this.value;
            }
        });

        container.appendChild(select);
        document.body.appendChild(container);
        console.log('设备选择器已创建并添加到页面');
    }

    function createPackageSelector() {
        console.log('开始创建套件选择器...');
        
        const packageCards = document.querySelectorAll('div.mdl-card');
        console.log('找到套件卡片数量:', packageCards.length);
        
        if (packageCards.length === 0) {
            console.log('未找到套件卡片，尝试其他选择器...');
            const alternativeCards = document.querySelectorAll('div.mdl-cell.mdl-cell--6-col.mdl-card.spk-card.mdl-shadow--2dp');
            console.log('替代选择器找到卡片数量:', alternativeCards.length);
            if (alternativeCards.length === 0) {
                console.log('仍然未找到套件卡片');
                return;
            }
        }
        
         const packageSelectorContainer = document.createElement('div');
         packageSelectorContainer.className = 'package-selector-container';
         packageSelectorContainer.style.cssText = `
             position: fixed;
             top: 20px;
             right: 20px;
             width: 300px;
             max-height: 90vh;
             background: white;
             border: 2px solid #007cba;
             border-radius: 8px;
             padding: 15px;
             box-shadow: 0 4px 12px rgba(0,0,0,0.15);
             z-index: 10000;
             font-family: Arial, sans-serif;
             overflow-y: auto;
         `;
        
        // 创建关闭按钮
        const closeButton = document.createElement('button');
        closeButton.innerHTML = '×';
        closeButton.style.cssText = `
            position: absolute;
            top: 5px;
            right: 8px;
            width: 24px;
            height: 24px;
            background: #ff4444;
            color: white;
            border: none;
            border-radius: 50%;
            font-size: 18px;
            font-weight: bold;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            line-height: 1;
            z-index: 10001;
        `;
        
        // 关闭按钮悬停效果
        closeButton.addEventListener('mouseenter', function() {
            this.style.background = '#cc0000';
        });
        
        closeButton.addEventListener('mouseleave', function() {
            this.style.background = '#ff4444';
        });
        
        // 关闭按钮点击事件
        closeButton.addEventListener('click', function() {
            packageSelectorContainer.remove();
            console.log('套件选择器已关闭');
        });
        
        packageSelectorContainer.appendChild(closeButton);
        
        const title = document.createElement('h3');
        title.textContent = '套件下载器';
        title.style.cssText = `
            margin: 0 0 15px 0;
            color: #007cba;
            font-size: 18px;
            text-align: center;
        `;
        packageSelectorContainer.appendChild(title);
        
        const deviceInfoArea = document.createElement('div');
        deviceInfoArea.style.cssText = `
            margin-bottom: 15px;
            padding: 10px;
            background: #f0f8ff;
            border: 1px solid #007cba;
            border-radius: 4px;
            font-size: 12px;
            text-align: center;
        `;
        
        // 尝试从缓存中读取设备信息
        const cachedDevice = localStorage.getItem('selectedDevice');
        if (cachedDevice) {
            try {
                const deviceInfo = JSON.parse(cachedDevice);
                const timeDiff = Date.now() - deviceInfo.timestamp;
                const hoursDiff = Math.floor(timeDiff / (1000 * 60 * 60));
                
                if (hoursDiff < 24) { // 24小时内的缓存有效
                    // 提取架构名称，去掉URL参数前缀
                    let archName = deviceInfo.arch;
                    if (archName.includes('?arch=')) {
                        archName = archName.split('?arch=')[1];
                    } else if (archName.includes('arch=')) {
                        archName = archName.split('arch=')[1];
                        // 如果还有其他参数，只取第一个
                        if (archName.includes('&')) {
                            archName = archName.split('&')[0];
                        }
                    }
                    deviceInfoArea.innerHTML = `
                        <strong>当前设备:</strong> ${deviceInfo.name}<br>
                        <small>架构: ${archName}</small>
                    `;
                    deviceInfoArea.style.display = 'block';
                } else {
                    // 缓存过期，清除
                    localStorage.removeItem('selectedDevice');
                    deviceInfoArea.style.display = 'none';
                }
            } catch (e) {
                console.log('解析缓存的设备信息失败:', e);
                deviceInfoArea.style.display = 'none';
            }
        } else {
            deviceInfoArea.style.display = 'none';
        }
        
        packageSelectorContainer.appendChild(deviceInfoArea);
        
        const clearCacheButton = document.createElement('button');
        clearCacheButton.textContent = '清除设备缓存';
        clearCacheButton.style.cssText = `
            width: 100%;
            padding: 6px;
            background: #ff9800;
            color: white;
            border: none;
            border-radius: 4px;
            font-size: 11px;
            cursor: pointer;
            margin-bottom: 15px;
            display: none;
        `;
        
        // 根据设备信息显示状态决定按钮显示
        if (deviceInfoArea.style.display !== 'none') {
            clearCacheButton.style.display = 'block';
        }
        
        clearCacheButton.addEventListener('click', function() {
            localStorage.removeItem('selectedDevice');
            deviceInfoArea.style.display = 'none';
            clearCacheButton.style.display = 'none';
            deviceModelInput.value = '';
            console.log('已清除设备缓存');
        });
        
        packageSelectorContainer.appendChild(clearCacheButton);
        
         const packageSelectTitle = document.createElement('h4');
         packageSelectTitle.textContent = '套件选择';
          packageSelectTitle.style.cssText = `
              margin: 0 0 4px 0;
              color: #333;
              font-size: 14px;
              font-weight: bold;
          `;
          packageSelectorContainer.appendChild(packageSelectTitle);
         
          const packageSelect = document.createElement('select');
         packageSelect.style.cssText = `
             width: 100%;
             padding: 8px;
             border: 1px solid #ccc;
             border-radius: 4px;
             margin-bottom: 10px;
             font-size: 14px;
         `;
        
        const defaultOption = document.createElement('option');
        defaultOption.value = '';
        defaultOption.textContent = '请选择套件';
        packageSelect.appendChild(defaultOption);
        
                 const packages = [];
        packageCards.forEach(pkg => {
            const titleElement = pkg.querySelector('h1.mdl-card__title-text');
            if (titleElement) {
                const packageName = titleElement.textContent.trim();
                packages.push(packageName);
                console.log('找到套件:', packageName);
                
                const option = document.createElement('option');
                option.value = packageName;
                option.textContent = packageName;
                packageSelect.appendChild(option);
            }
        });
        
         console.log('总共找到套件数量:', packages.length);
         packageSelectorContainer.appendChild(packageSelect);
         
         const packagesVersionTitle = document.createElement('h4');
          packagesVersionTitle.textContent = '包仓库选择';
          packagesVersionTitle.style.cssText = `
              margin: 0 0 4px 0;
              color: #333;
              font-size: 14px;
              font-weight: bold;
              display: none;
          `;
         packageSelectorContainer.appendChild(packagesVersionTitle);
         
         // 创建packages版本切换选择器
         const packagesVersionSelect = document.createElement('select');
         packagesVersionSelect.style.cssText = `
             width: 100%;
             padding: 8px;
             border: 1px solid #ccc;
             border-radius: 4px;
             margin-bottom: 10px;
             font-size: 14px;
             display: none;
         `;
        
        const packages2025Option = document.createElement('option');
        packages2025Option.value = 'packages2025';
        packages2025Option.textContent = 'packages2025';
        
        const packages2022Option = document.createElement('option');
        packages2022Option.value = 'packages2022';
        packages2022Option.textContent = 'packages2022';
        
        packagesVersionSelect.appendChild(packages2025Option);
        packagesVersionSelect.appendChild(packages2022Option);
                 packagesVersionSelect.value = 'packages2025';
         packageSelectorContainer.appendChild(packagesVersionSelect);
         
         const inputFieldsTitle = document.createElement('h4');
          inputFieldsTitle.textContent = '自定义参数';
          inputFieldsTitle.style.cssText = `
              margin: 0 0 4px 0;
              color: #333;
              font-size: 14px;
              font-weight: bold;
              display: none;
          `;
         packageSelectorContainer.appendChild(inputFieldsTitle);
         
        const inputContainer = document.createElement('div');
         inputContainer.style.cssText = `
             display: flex;
             gap: 8px;
             margin-bottom: 10px;
             display: none;
         `;
        
        const deviceModelInput = document.createElement('input');
        deviceModelInput.type = 'text';
        deviceModelInput.placeholder = '设备型号';
        deviceModelInput.style.cssText = `
            flex: 1;
            padding: 8px;
            border: 1px solid #ccc;
            border-radius: 4px;
            font-size: 12px;
            min-width: 0;
        `;
        
        const firmwareInput = document.createElement('input');
        firmwareInput.type = 'text';
        firmwareInput.placeholder = '固件版本';
        firmwareInput.style.cssText = `
            flex: 1;
            padding: 8px;
            border: 1px solid #ccc;
            border-radius: 4px;
            font-size: 12px;
            min-width: 0;
        `;
        
        const buildInput = document.createElement('input');
        buildInput.type = 'text';
        buildInput.placeholder = 'Build参数';
        buildInput.style.cssText = `
            flex: 1;
            padding: 8px;
            border: 1px solid #ccc;
            border-radius: 4px;
            font-size: 12px;
            min-width: 0;
        `;
        
         inputContainer.appendChild(deviceModelInput);
         inputContainer.appendChild(firmwareInput);
         inputContainer.appendChild(buildInput);
         
         packageSelectorContainer.appendChild(inputContainer);
        
         const autoFillButton = document.createElement('button');
         autoFillButton.textContent = '自动填入参数';
         autoFillButton.style.cssText = `
             width: 100%;
             padding: 8px;
             background: #4caf50;
             color: white;
             border: none;
             border-radius: 4px;
             font-size: 12px;
             cursor: pointer;
             margin-bottom: 10px;
             display: none;
         `;
            autoFillButton.addEventListener('click', function() {
            const selectedPackage = packageSelect.value;
            if (!selectedPackage) {
                errorMessageArea.textContent = '请先选择套件';
                errorMessageArea.style.display = 'block';
                downloadLinkArea.style.display = 'none';
                return;
            }
            
            const packageCards = document.querySelectorAll('div.mdl-card');
            let firmwareInfo = null;
            
            for (const card of packageCards) {
                const titleElement = card.querySelector('h1.mdl-card__title-text');
                if (titleElement && titleElement.textContent.trim() === selectedPackage) {
                    const dsmVersionElement = card.querySelector('div.mdl-card__supporting-text.spk-dsmversion');
                    if (dsmVersionElement) {
                        const versionText = dsmVersionElement.textContent.trim();
                        console.log('找到DSM版本信息:', versionText);
                        
                        const match = versionText.match(/最低DSM适用固件:\s*([\d.]+)-(\d+)/);
                        if (match) {
                            firmwareInfo = {
                                version: match[1],
                                build: match[2]
                            };
                            console.log('解析到的固件信息:', firmwareInfo);
                        }
                    }
                    break;
                }
            }
            
            if (firmwareInfo) {
                firmwareInput.value = firmwareInfo.version;
                buildInput.value = firmwareInfo.build;
                
                const cachedDevice = localStorage.getItem('selectedDevice');
                if (cachedDevice) {
                    try {
                        const deviceInfo = JSON.parse(cachedDevice);
                        const timeDiff = Date.now() - deviceInfo.timestamp;
                        const hoursDiff = Math.floor(timeDiff / (1000 * 60 * 60));
                        
                        if (hoursDiff < 24) {
                            deviceModelInput.value = deviceInfo.name;
                            console.log('已自动填入设备型号:', deviceInfo.name);
                        }
                    } catch (e) {
                        console.log('解析缓存的设备信息失败:', e);
                    }
                }
                
                errorMessageArea.style.cssText = `
                    margin-top: 10px;
                    padding: 10px;
                    background: #e8f5e8;
                    border: 1px solid #4caf50;
                    border-radius: 4px;
                    display: block;
                    color: #2e7d32;
                    font-size: 12px;
                    text-align: center;
                `;
                errorMessageArea.textContent = `已自动填入参数: 固件版本 ${firmwareInfo.version}, Build参数 ${firmwareInfo.build}`;
                downloadLinkArea.style.display = 'none';
            } else {
                errorMessageArea.style.cssText = `
                    margin-top: 10px;
                    padding: 10px;
                    background: #ffebee;
                    border: 1px solid #f44336;
                    border-radius: 4px;
                    display: block;
                    color: #c62828;
                    font-size: 12px;
                    text-align: center;
                `;
                errorMessageArea.textContent = '无法找到该套件的固件信息，请手动填写参数';
                downloadLinkArea.style.display = 'none';
            }
        });
        
         const buttonContainer = document.createElement('div');
         buttonContainer.style.cssText = `
             display: flex;
             gap: 10px;
             margin-bottom: 10px;
             display: none;
         `;
         
         autoFillButton.style.cssText = `
             flex: 1;
             padding: 10px;
             background: #4caf50;
             color: white;
             border: none;
             border-radius: 4px;
             font-size: 14px;
             cursor: pointer;
             margin-bottom: 0;
         `;
         buttonContainer.appendChild(autoFillButton);
         
         const downloadButton = document.createElement('button');
         downloadButton.textContent = '生成下载链接';
         downloadButton.style.cssText = `
             flex: 1;
             padding: 10px;
             background: #007cba;
             color: white;
             border: none;
             border-radius: 4px;
             font-size: 14px;
             cursor: pointer;
         `;
         buttonContainer.appendChild(downloadButton);
         packageSelectorContainer.appendChild(buttonContainer);
         
        const errorMessageArea = document.createElement('div');
        errorMessageArea.style.cssText = `
            margin-top: 10px;
            padding: 10px;
            background: #ffebee;
            border: 1px solid #f44336;
            border-radius: 4px;
            display: none;
            color: #c62828;
            font-size: 12px;
            text-align: center;
        `;
        packageSelectorContainer.appendChild(errorMessageArea);
         
        const downloadLinkArea = document.createElement('div');
        downloadLinkArea.style.cssText = `
            margin-top: 10px;
            padding: 10px;
            background: #f5f5f5;
            border-radius: 4px;
            display: none;
            word-break: break-all;
            font-size: 12px;
        `;
         packageSelectorContainer.appendChild(downloadLinkArea);
         packageSelect.addEventListener('change', function() {
             if (this.value) {
                 console.log('选择了套件:', this.value);
                  packagesVersionTitle.style.display = 'block';
                  packagesVersionSelect.style.display = 'block';
                  inputFieldsTitle.style.display = 'block';
                  inputContainer.style.display = 'flex';
                  buttonContainer.style.display = 'flex';
                  // 隐藏错误信息和下载链接
                  errorMessageArea.style.display = 'none';
                  downloadLinkArea.style.display = 'none';
             } else {
                  packagesVersionTitle.style.display = 'none';
                  packagesVersionSelect.style.display = 'none';
                  inputFieldsTitle.style.display = 'none';
                  inputContainer.style.display = 'none';
                  buttonContainer.style.display = 'none';
                  downloadLinkArea.style.display = 'none';
                  errorMessageArea.style.display = 'none';
             }
          });
         
         downloadButton.addEventListener('click', function() {
             const selectedPackage = packageSelect.value;
             const packagesVersion = packagesVersionSelect.value;
             const deviceModel = deviceModelInput.value.trim();
             const firmwareVersion = firmwareInput.value.trim();
             const buildParam = buildInput.value.trim();
             
                  if (!selectedPackage || !deviceModel || !firmwareVersion || !buildParam) {
                  errorMessageArea.style.cssText = `
                     margin-top: 10px;
                     padding: 10px;
                     background: #ffebee;
                     border: 1px solid #f44336;
                     border-radius: 4px;
                     display: block;
                     color: #c62828;
                     font-size: 12px;
                     text-align: center;
                 `;
                 errorMessageArea.textContent = '请填写所有必要信息';
                 downloadLinkArea.style.display = 'none';
                 return;
             }
             
              const urlParams = new URLSearchParams(window.location.search);
              const arch = urlParams.get('arch');
              if (!arch) {
                  errorMessageArea.style.cssText = `
                     margin-top: 10px;
                     padding: 10px;
                     background: #ffebee;
                     border: 1px solid #f44336;
                     border-radius: 4px;
                     display: block;
                     color: #c62828;
                     font-size: 12px;
                     text-align: center;
                 `;
                 errorMessageArea.textContent = '无法获取设备架构信息';
                 downloadLinkArea.style.display = 'none';
                 return;
             }
             
              const downloadUrl = buildDownloadUrl(selectedPackage, packagesVersion, deviceModel, firmwareVersion, buildParam, arch);
              const userAgent = `"synology_${arch}_${deviceModel} DSM${firmwareVersion}-${buildParam}(package)"`;
              console.log('使用的User-Agent:', userAgent);
              errorMessageArea.style.display = 'none';
             
              // 显示下载配置信息（包含重要提示）
              downloadLinkArea.innerHTML = `
                  <div style="margin-bottom: 15px;">
                      <strong style="color: #e91e63;">⚠️ 重要提示：需要配置浏览器User-Agent才能下载</strong>
                  </div>
                  
                  <div style="margin-bottom: 15px;">
                      <strong>下载链接:</strong><br>
                      <a href="#" id="downloadLink" target="_blank" style="color: #007cba;"></a>
                  </div>
                  
                                    <div style="margin-bottom: 15px;">
                       <strong>User-Agent字符串:</strong><br>
                       <div id="userAgentDisplay" style="background: #f5f5f5; padding: 8px; border-radius: 4px; font-family: monospace; font-size: 11px; word-break: break-all; margin: 5px 0;">
                       </div>
                       <button id="copyDownloadLink" style="margin-top: 5px; margin-right: 5px; padding: 4px 8px; background: #2196f3; color: white; border: none; border-radius: 3px; font-size: 11px; cursor: pointer;">复制下载链接</button>
                       <button id="copyUserAgent" style="margin-top: 5px; padding: 4px 8px; background: #4caf50; color: white; border: none; border-radius: 3px; font-size: 11px; cursor: pointer;">复制User-Agent</button>
                   </div>
                  
                  <div style="margin-bottom: 15px;">
                      <button id="toggleInstructions" style="width: 100%; padding: 8px; background: #ff9800; color: white; border: none; border-radius: 4px; font-size: 12px; cursor: pointer; margin-bottom: 10px; transition: all 0.3s ease; box-shadow: 0 2px 4px rgba(255,152,0,0.3);">
                          📋 点击查看配置步骤
                      </button>
                      <div id="instructionsContent" style="display: none; background: #fff3cd; border: 1px solid #ffeaa7; border-radius: 4px; padding: 12px; font-size: 12px; line-height: 1.4; transition: all 0.3s ease; opacity: 0; transform: translateY(-10px); position: relative; z-index: 10002; margin-bottom: 10px;">
                          <div style="margin-bottom: 15px;">
                              <strong style="color: #e65100; font-size: 13px;">📋 配置步骤:</strong><br>
                              <ol style="margin: 8px 0; padding-left: 20px;">
                                  <li>按 <kbd style="background: #f0f0f0; padding: 2px 4px; border-radius: 2px; font-size: 11px;">F12</kbd> 打开开发者工具</li>
                                  <li>切换到"网络"标签页</li>
                                  <li>点击"网络条件"或"Network conditions"</li>
                                  <li>在"用户代理"中选择"自定义"</li>
                                  <li>粘贴上面的User-Agent字符串</li>
                                  <li>刷新页面或重新访问下载链接</li>
                              </ol>
                          </div>
                          
                          <div style="background: #e8f5e8; border: 1px solid #4caf50; border-radius: 4px; padding: 10px;">
                              <strong style="color: #2e7d32; font-size: 13px;">💡 注意事项:</strong><br>
                              <ul style="margin: 8px 0; padding-left: 20px;">
                                  <li>配置User-Agent后，所有网络请求都会使用该字符串</li>
                                  <li>下载完成后建议恢复默认User-Agent</li>
                                  <li>某些浏览器可能需要重启才能生效</li>
                              </ul>
                          </div>
                          
                          <div style="margin-top: 10px; background: #e3f2fd; border: 1px solid #2196f3; border-radius: 4px; padding: 10px;">
                              <strong style="color: #1565c0; font-size: 13px;">🔧 快速操作:</strong><br>
                              <div style="margin: 8px 0; font-size: 11px;">
                                  • 点击上方"复制User-Agent"按钮快速复制<br>
                                  • 在开发者工具中直接粘贴即可使用
                              </div>
                          </div>
                      </div>
                  </div>
              `;
              
              const downloadLinkElement = document.getElementById('downloadLink');
              if (downloadLinkElement) {
                  downloadLinkElement.href = downloadUrl;
                  downloadLinkElement.textContent = downloadUrl;
              }
              
              const userAgentDisplayElement = document.getElementById('userAgentDisplay');
              if (userAgentDisplayElement) {
                  userAgentDisplayElement.textContent = userAgent;
              }
              downloadLinkArea.style.display = 'block';
              
               setTimeout(() => {
                  const copyDownloadLinkButton = document.getElementById('copyDownloadLink');
                  if (copyDownloadLinkButton) {
                      copyDownloadLinkButton.addEventListener('click', function() {
                          navigator.clipboard.writeText(downloadUrl).then(() => {
                              this.textContent = '已复制!';
                              this.style.background = '#1976d2';
                              setTimeout(() => {
                                  this.textContent = '复制下载链接';
                                  this.style.background = '#2196f3';
                              }, 2000);
                          }).catch(err => {
                              console.error('复制失败:', err);
                              // 降级方案：使用传统复制方法
                              const textArea = document.createElement('textarea');
                              textArea.value = downloadUrl;
                              document.body.appendChild(textArea);
                              textArea.select();
                              document.execCommand('copy');
                              document.body.removeChild(textArea);
                              
                              this.textContent = '已复制!';
                              this.style.background = '#1976d2';
                              setTimeout(() => {
                                  this.textContent = '复制下载链接';
                                  this.style.background = '#2196f3';
                              }, 2000);
                          });
                      });
                   }
                   
                   const copyButton = document.getElementById('copyUserAgent');
                  if (copyButton) {
                      copyButton.addEventListener('click', function() {
                          navigator.clipboard.writeText(userAgent).then(() => {
                              this.textContent = '已复制!';
                              this.style.background = '#4caf50';
                              setTimeout(() => {
                                  this.textContent = '复制User-Agent';
                                  this.style.background = '#4caf50';
                              }, 2000);
                          }).catch(err => {
                              console.error('复制失败:', err);
                              // 降级方案：使用传统复制方法
                              const textArea = document.createElement('textarea');
                              textArea.value = userAgent;
                              document.body.appendChild(textArea);
                              textArea.select();
                              document.execCommand('copy');
                              document.body.removeChild(textArea);
                              
                              this.textContent = '已复制!';
                              this.style.background = '#4caf50';
                              setTimeout(() => {
                                  this.textContent = '复制User-Agent';
                                  this.style.background = '#4caf50';
                              }, 2000);
                          });
                      });
                   }
                  const toggleButton = document.getElementById('toggleInstructions');
                  const instructionsContent = document.getElementById('instructionsContent');
                                         if (toggleButton && instructionsContent) {
                           toggleButton.addEventListener('click', function() {
                               if (instructionsContent.style.display === 'none') {
                                   instructionsContent.style.display = 'block';
                                   setTimeout(() => {
                                  instructionsContent.style.opacity = '1';
                                  instructionsContent.style.transform = 'translateY(0)';
                                  
                                                                     const container = document.querySelector('.package-selector-container');
                                   if (container) {
                                       const containerRect = container.getBoundingClientRect();
                                       const contentRect = instructionsContent.getBoundingClientRect();
                                       
                                       if (contentRect.bottom > window.innerHeight - 20) {
                                           const scrollDistance = contentRect.bottom - window.innerHeight + 20;
                                           container.scrollTop += scrollDistance;
                                       }
                                   }
                                                             }, 10);
                               this.textContent = '📋 点击隐藏配置步骤';
                               this.style.background = '#f57c00';
                           } else {
                               instructionsContent.style.opacity = '0';
                               instructionsContent.style.transform = 'translateY(-10px)';
                               setTimeout(() => {
                                   instructionsContent.style.display = 'none';
                               }, 300);
                               this.textContent = '📋 点击查看配置步骤';
                               this.style.background = '#ff9800';
                           }
                      });
                  }
              }, 100);
              console.log('生成的下载链接:', downloadUrl);
          });
         document.body.appendChild(packageSelectorContainer);
         console.log('套件选择器已添加到页面');
     }

         function buildDownloadUrl(packageName, packagesVersion, deviceModel, firmwareVersion, buildParam, arch) {
         const firmwareParts = firmwareVersion.split('-');
          let major = '7';
          let minor = '2';
          let micro = firmwareVersion; // 直接使用用户输入的固件版本
          let build = buildParam; // 使用用户输入的build参数
          
          if (firmwareParts.length >= 2) {
              const versionParts = firmwareParts[0].split('.');
              if (versionParts.length >= 3) {
                  major = versionParts[0];
                  minor = versionParts[1];
                  micro = firmwareParts[0]; // 如果包含build号，则使用版本部分
              }
          }
        
         const unique = `synology_${arch}_${deviceModel}`;
         let packageFileName = packageName;
         const packageCards = document.querySelectorAll('div.mdl-card');
         for (const card of packageCards) {
             const titleElement = card.querySelector('h1.mdl-card__title-text');
             if (titleElement && titleElement.textContent.trim() === packageName) {
                 const iconDiv = card.querySelector('div.spk-icon img');
                                 if (iconDiv && iconDiv.src) {
                     const imageUrl = iconDiv.src;
                     console.log('找到套件图片URL:', imageUrl);
                     
                     const urlParts = imageUrl.split('/');
                     if (urlParts.length > 0) {
                         const lastPart = urlParts[urlParts.length - 1];
                         packageFileName = lastPart.replace('_thumb_72.png', '');
                         console.log('提取的包文件名:', packageFileName);
                     }
                 }
                break;
            }
        }
         
         const downloadUrl = `https://spk7.imnks.com/${packagesVersion}/${packageFileName}.spk?unique=${unique}&build=${build}&major=${major}&micro=${micro}&pkg_version=&minor=${minor}&mode=install&nano=0`;
         console.log('构建下载链接使用的包文件名:', packageFileName);
         return downloadUrl;
     }

         const style = document.createElement('style');
    style.textContent = `
        #toggleInstructions:hover {
            background: #f57c00 !important;
            transform: translateY(-1px);
            box-shadow: 0 4px 8px rgba(255,152,0,0.4) !important;
        }
        
        #toggleInstructions:active {
            transform: translateY(0);
            box-shadow: 0 2px 4px rgba(255,152,0,0.3) !important;
        }
        
        /* 套件选择器容器的滚动条样式 */
        .package-selector-container::-webkit-scrollbar {
            width: 6px;
        }
        .package-selector-container::-webkit-scrollbar-track {
            background: #f1f1f1;
            border-radius: 3px;
        }
        .package-selector-container::-webkit-scrollbar-thumb {
            background: #007cba;
            border-radius: 3px;
        }
        .package-selector-container::-webkit-scrollbar-thumb:hover {
            background: #005a8b;
        }
    `;
     document.head.appendChild(style);
     console.log('矿神套件下载插件开始执行...');
     console.log('当前URL:', window.location.href);
     
     setTimeout(() => {
        if (window.location.href.includes('?arch=')) {
            console.log('检测到设备页面，创建套件选择器');
            waitForElement('div.mdl-card', createPackageSelector);
        } else {
            console.log('检测到主页面，创建设备选择器');
            waitForElement('div.mdl-cell.mdl-cell--2-col.mdl-card.small-card.clickable-card.mdl-shadow--2dp', createDeviceSelector);
        }
    }, 1000);

})();