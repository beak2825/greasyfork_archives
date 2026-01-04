// ==UserScript==
// @name         仙宫云自动抢卡助手
// @namespace    http://tampermonkey.net/
// @version      1.8
// @description  仙宫云算力卡自动抢购工具，支持外部txt文件控制广告，无弹窗静默运行，精准识别成功状态 + 确认开机自动点击
// @author       森岚科技
// @match        https://www.xiangongyun.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=xiangongyun.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/556332/%E4%BB%99%E5%AE%AB%E4%BA%91%E8%87%AA%E5%8A%A8%E6%8A%A2%E5%8D%A1%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/556332/%E4%BB%99%E5%AE%AB%E4%BA%91%E8%87%AA%E5%8A%A8%E6%8A%A2%E5%8D%A1%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 算力卡类型定义（新增RTX 4090 48G型号）
    const CARD_TYPES = {
        '4090d_48g': { name: 'RTX 4090 D (48G)', price: '¥2.59/小时' },
        '4090_48g': { name: 'RTX 4090 (48G)', price: '¥3.39/小时' },
        '4090d_24g': { name: 'RTX 4090 D (24G)', price: '¥1.59/小时' },
        '4090_24g': { name: 'RTX 4090 (24G)', price: '¥1.89/小时' }
    };

    // 主题配置（亮色/暗色）
    const THEMES = {
        light: {
            panelBg: '#ffffff',
            panelBorder: '#f0f0f0',
            textPrimary: '#1e293b',
            textSecondary: '#64748b',
            textTertiary: '#334155',
            bgPrimary: '#f8fafc',
            bgSuccess: '#f0fdf4',
            bgError: '#fef2f2',
            bgAd: 'linear-gradient(135deg, #f0f9ff, #e6f7ff)',
            borderAd: '#94a3b8',
            adTextPrimary: '#1e40af',
            adTextSecondary: '#64748b',
            inputBorder: '#d1d5db',
            inputBorderFocus: '#3b82f6'
        },
        dark: {
            panelBg: '#1e1e2e',
            panelBorder: '#333344',
            textPrimary: '#e2e8f0',
            textSecondary: '#94a3b8',
            textTertiary: '#cbd5e1',
            bgPrimary: '#2d2d44',
            bgSuccess: '#1e3a3a',
            bgError: '#4a1a2c',
            bgAd: 'linear-gradient(135deg, #1a202c, #2d3748)',
            borderAd: '#4a5568',
            adTextPrimary: '#93c5fd',
            adTextSecondary: '#a0aec0',
            inputBorder: '#4a5568',
            inputBorderFocus: '#60a5fa'
        }
    };

    // 🔥 外部广告配置（关键！后续修改广告只需改这里的URL或txt文件）
    const AD_CONFIG = {
        externalAdUrl: 'https://gist.githubusercontent.com/hujuying/84bf0cb066e8987fd85344b80918851e/raw/a3042672f9c2d08b1dba92f77ccdd93165601779/xiangongyun-ad.txt', // 外部广告txt文件URL（必填）
        timeout: 5000, // 加载超时时间（毫秒，默认5秒）
        fallbackAd: `<!-- 降级广告（加载失败时显示） -->
            <div style="text-align:center;">
                <div style="font-size:14px;font-weight:bold;margin-bottom:5px;">优质镜像推荐</div>
                <div style="font-size:12px;">
                    <a href="https://www.xiangongyun.com/image/detail/1e1fb2b6-31e0-4cbf-b4e0-e3af838b1f42" target="_blank" style="text-decoration:none;color:inherit;">
                        仙宫云 - 高效稳定的算力服务平台
                    </a>
                </div>
            </div>`
    };

    // 全局状态变量
    let isRunning = false;
    let selectedCard = '4090d_24g';
    let intervalId = null;
    let checkInterval = 2000;
    let hasValidCards = false;
    let isDeploySuccess = false;
    let currentTheme = localStorage.getItem('xgcloud_card_helper_theme') || 'light';
    let failCount = 0;
    let hasInitiatedPurchase = false;
    const DEPLOY_SUCCESS_URL_REGEX = /\/console\/instance/i;

    // ========== 新增：确认开机相关全局变量 ==========
    let isBooting = false; // 是否正在执行开机自动点击
    let bootIntervalId = null; // 开机按钮点击定时器
    const BOOT_CHECK_INTERVAL = 500; // 开机按钮点击间隔（500毫秒）
    const BOOT_SUCCESS_URL_REGEX = /\/console\/instance|\/console\/dashboard/i; // 开机成功的URL特征
    // ========== /新增：确认开机相关全局变量 ==========

    // 创建悬浮控制界面
    function createControlPanel() {
        // 悬浮按钮
        const floatButton = document.createElement('div');
        floatButton.id = 'float-button';
        floatButton.style.cssText = `
            position: fixed;
            right: 20px;
            bottom: 20px;
            width: 56px;
            height: 56px;
            border-radius: 50%;
            background: linear-gradient(135deg, #3b82f6, #2563eb);
            color: white;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 22px;
            box-shadow: 0 4px 15px rgba(59, 130, 246, 0.4);
            cursor: pointer;
            z-index: 9999;
            transition: all 0.3s ease;
        `;
        floatButton.innerHTML = '⚡';
        floatButton.addEventListener('mouseover', () => floatButton.style.transform = 'scale(1.05)');
        floatButton.addEventListener('mouseout', () => floatButton.style.transform = 'scale(1)');
        document.body.appendChild(floatButton);

        // 控制面板
        const controlPanel = document.createElement('div');
        controlPanel.id = 'control-panel';
        controlPanel.style.cssText = `
            position: fixed;
            right: 20px;
            bottom: 86px;
            width: 320px;
            border-radius: 12px;
            box-shadow: 0 6px 20px rgba(0, 0, 0, 0.3);
            padding: 18px;
            z-index: 9998;
            display: none;
            transition: all 0.3s ease;
        `;
        document.body.appendChild(controlPanel);

        // 面板标题
        const title = document.createElement('h3');
        title.innerHTML = '⚡ 仙宫云自动抢卡助手 <span style="font-size:12px;">by：森岚科技</span>';
        title.style.cssText = `
            margin: 0 0 15px 0;
            padding-bottom: 12px;
            border-bottom: 1px solid;
            font-size: 16px;
            display: flex;
            align-items: center;
        `;
        controlPanel.appendChild(title);

        // 主题选择区域
        const themeSelection = document.createElement('div');
        themeSelection.id = 'theme-selection';
        themeSelection.style.cssText = `
            margin-bottom: 15px;
            padding: 10px;
            border-radius: 8px;
            display: flex;
            align-items: center;
            justify-content: space-between;
        `;
        controlPanel.appendChild(themeSelection);

        const themeTitle = document.createElement('span');
        themeTitle.textContent = '主题选择：';
        themeTitle.style.cssText = 'font-size:13px;font-weight:500;';
        themeSelection.appendChild(themeTitle);

        const themeOptions = document.createElement('div');
        themeOptions.style.display = 'flex';
        themeOptions.style.gap = '10px';
        themeSelection.appendChild(themeOptions);

        // 亮色主题选项
        const lightThemeOption = createThemeOption('light', '亮色');
        // 暗色主题选项
        const darkThemeOption = createThemeOption('dark', '暗色');
        themeOptions.appendChild(lightThemeOption);
        themeOptions.appendChild(darkThemeOption);

        // 页面状态提示
        const pageStatus = document.createElement('div');
        pageStatus.id = 'page-status';
        pageStatus.style.cssText = `
            padding: 6px 10px;
            border-radius: 6px;
            font-size: 12px;
            margin-bottom: 15px;
            text-align: center;
        `;
        controlPanel.appendChild(pageStatus);

        // 🔥 广告位容器（动态加载外部广告）
        const adContainer = document.createElement('div');
        adContainer.id = 'ad-container'; // 新增ID，方便定位
        adContainer.style.cssText = `
            width: 100%;
            height: 80px;
            border-radius: 8px;
            margin-bottom: 18px;
            padding: 10px;
            box-sizing: border-box;
            display: flex;
            align-items: center;
            border: 1px dashed;
            overflow: hidden; // 防止外部广告内容溢出
        `;
        controlPanel.appendChild(adContainer);

        // 🔥 加载外部广告（创建容器后立即触发）
        loadExternalAd(adContainer);

        // 算力卡选择区域
        const cardSelection = document.createElement('div');
        cardSelection.id = 'card-selection';
        cardSelection.style.marginBottom = '18px';
        cardSelection.style.display = 'none';
        controlPanel.appendChild(cardSelection);

        const cardTitle = document.createElement('p');
        cardTitle.textContent = '选择算力卡类型:';
        cardTitle.style.cssText = 'font-weight:600;margin:0 0 10px 0;font-size:14px;';
        cardSelection.appendChild(cardTitle);

        // 生成算力卡选项
        Object.keys(CARD_TYPES).forEach(key => {
            const cardOption = document.createElement('label');
            cardOption.style.cssText = `
                display: flex;
                align-items: center;
                margin-bottom: 10px;
                padding: 6px 8px;
                border-radius: 6px;
                transition: background-color 0.2s;
            `;
            cardOption.addEventListener('mouseover', () => cardOption.style.backgroundColor = THEMES[currentTheme].bgPrimary);
            cardOption.addEventListener('mouseout', () => cardOption.style.backgroundColor = 'transparent');

            const radio = document.createElement('input');
            radio.type = 'radio';
            radio.name = 'cardType';
            radio.value = key;
            radio.checked = key === selectedCard;
            radio.style.cssText = 'margin-right:10px;width:16px;height:16px;';
            radio.style.accentColor = currentTheme === 'light' ? '#3b82f6' : '#60a5fa';
            radio.addEventListener('change', (e) => selectedCard = e.target.value);

            const cardInfo = document.createElement('span');
            cardInfo.textContent = `${CARD_TYPES[key].name} (${CARD_TYPES[key].price})`;
            cardInfo.style.fontSize = '13px';

            cardOption.appendChild(radio);
            cardOption.appendChild(cardInfo);
            cardSelection.appendChild(cardOption);
        });

        // 间隔设置区域
        const intervalSetting = document.createElement('div');
        intervalSetting.id = 'interval-setting';
        intervalSetting.style.marginBottom = '18px';
        intervalSetting.style.display = 'none';
        controlPanel.appendChild(intervalSetting);

        const intervalTitle = document.createElement('p');
        intervalTitle.textContent = '抢购检查间隔 (毫秒):';
        intervalTitle.style.cssText = 'margin:0 0 8px 0;font-size:14px;';
        intervalSetting.appendChild(intervalTitle);

        const intervalInput = document.createElement('input');
        intervalInput.type = 'number';
        intervalInput.value = checkInterval;
        intervalInput.min = '500';
        intervalInput.max = '10000';
        intervalInput.style.cssText = `
            width: 100%;
            padding: 8px 10px;
            border: 1px solid;
            border-radius: 6px;
            font-size: 13px;
            box-sizing: border-box;
            transition: border-color 0.2s;
        `;
        intervalInput.addEventListener('focus', () => intervalInput.style.borderColor = THEMES[currentTheme].inputBorderFocus);
        intervalInput.addEventListener('blur', () => intervalInput.style.borderColor = THEMES[currentTheme].inputBorder);
        intervalInput.addEventListener('change', (e) => {
            checkInterval = parseInt(e.target.value) || 2000;
            intervalInput.value = checkInterval;
        });
        intervalSetting.appendChild(intervalInput);

        // 状态和控制按钮区域
        const controlArea = document.createElement('div');
        controlPanel.appendChild(controlArea);

        const statusText = document.createElement('p');
        statusText.id = 'status-text';
        statusText.textContent = '状态: 未运行';
        statusText.style.cssText = `
            margin: 0 0 12px 0;
            font-size: 13px;
            padding: 6px 8px;
            border-radius: 4px;
        `;
        controlArea.appendChild(statusText);

        // 按钮容器
        const buttonContainer = document.createElement('div');
        buttonContainer.id = 'button-container';
        buttonContainer.style.display = 'flex';
        buttonContainer.style.gap = '8px';
        buttonContainer.style.display = 'none';
        controlArea.appendChild(buttonContainer);

        // 开始按钮
        const startButton = createControlButton('start-button', '开始抢卡', '#10b981', '#059669');
        startButton.addEventListener('click', start抢购);
        // 停止按钮
        const stopButton = createControlButton('stop-button', '停止抢卡', '#ef4444', '#dc2626', true);
        stopButton.addEventListener('click', stop抢购);
        buttonContainer.appendChild(startButton);
        buttonContainer.appendChild(stopButton);

        // 悬浮按钮点击事件
        floatButton.addEventListener('click', () => {
            const isHidden = controlPanel.style.display === 'none' || controlPanel.style.display === '';
            controlPanel.style.display = isHidden ? 'block' : 'none';
            if (isHidden) {
                controlPanel.style.opacity = '0';
                controlPanel.style.transform = 'translateY(10px)';
                setTimeout(() => {
                    controlPanel.style.opacity = '1';
                    controlPanel.style.transform = 'translateY(0)';
                }, 10);
            }
        });

        // 应用主题并更新页面状态
        applyTheme();
        updatePageStatus();
    }

    // 辅助函数：创建主题选项（简化代码）
    function createThemeOption(value, text) {
        const label = document.createElement('label');
        label.style.cssText = `
            display: flex;
            align-items: center;
            cursor: pointer;
            font-size: 12px;
            padding: 4px 8px;
            border-radius: 4px;
            transition: background-color 0.2s;
        `;
        label.addEventListener('mouseover', () => label.style.backgroundColor = THEMES[currentTheme].bgPrimary);
        label.addEventListener('mouseout', () => label.style.backgroundColor = 'transparent');

        const radio = document.createElement('input');
        radio.type = 'radio';
        radio.name = 'theme';
        radio.value = value;
        radio.checked = currentTheme === value;
        radio.style.cssText = 'margin-right:6px;width:14px;height:14px;';
        radio.addEventListener('change', () => switchTheme(value));

        const textEl = document.createElement('span');
        textEl.textContent = text;
        textEl.style.color = THEMES[currentTheme].textPrimary;

        label.appendChild(radio);
        label.appendChild(textEl);
        return label;
    }

    // 辅助函数：创建控制按钮（简化代码）
    function createControlButton(id, text, bg1, bg2, isDisabled = false) {
        const button = document.createElement('button');
        button.id = id;
        button.textContent = text;
        button.style.cssText = `
            flex: 1;
            padding: 9px;
            background: linear-gradient(135deg, ${bg1}, ${bg2});
            color: white;
            border: none;
            border-radius: 6px;
            cursor: pointer;
            font-size: 14px;
            font-weight: 500;
            transition: all 0.2s;
            box-shadow: 0 2px 5px rgba(0,0,0,0.1);
        `;
        button.disabled = isDisabled;
        button.style.opacity = isDisabled ? '0.7' : '1';
        button.addEventListener('mouseover', () => {
            if (!button.disabled) button.style.opacity = '0.9';
        });
        button.addEventListener('mouseout', () => {
            if (!button.disabled) button.style.opacity = '1';
        });
        return button;
    }

    // 🔥 核心功能：加载外部广告
    async function loadExternalAd(adContainer) {
        try {
            console.log(`正在加载外部广告：${AD_CONFIG.externalAdUrl}`);
            // 发起请求（设置超时）
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), AD_CONFIG.timeout);

            const response = await fetch(AD_CONFIG.externalAdUrl, {
                signal: controller.signal,
                method: 'GET',
                mode: 'cors' // 允许跨域
            });

            clearTimeout(timeoutId);

            // 检查响应状态
            if (!response.ok) throw new Error(`HTTP错误：${response.status}`);

            // 读取txt文件内容（HTML代码）
            const adHtml = await response.text();
            console.log('外部广告加载成功，内容：', adHtml);

            // 渲染广告（直接插入HTML）
            adContainer.innerHTML = adHtml;

            // 适配主题：外部广告的文字颜色同步当前主题
            const adTexts = adContainer.querySelectorAll('*');
            adTexts.forEach(el => {
                if (!el.style.color) { // 不覆盖外部广告自定义颜色
                    el.style.color = THEMES[currentTheme].adTextPrimary;
                }
                if (el.tagName === 'A' && !el.style.color) {
                    el.style.color = currentTheme === 'light' ? '#3b82f6' : '#60a5fa';
                    el.style.textDecoration = 'none';
                }
            });
        } catch (error) {
            // 加载失败，显示降级广告
            console.error('外部广告加载失败：', error.message);
            adContainer.innerHTML = AD_CONFIG.fallbackAd;
            // 适配降级广告主题
            const adTexts = adContainer.querySelectorAll('*');
            adTexts.forEach(el => {
                el.style.color = THEMES[currentTheme].adTextPrimary;
                if (el.tagName === 'A') {
                    el.style.color = currentTheme === 'light' ? '#3b82f6' : '#60a5fa';
                }
            });
        }
    }

    // 切换主题
    function switchTheme(theme) {
        if (currentTheme === theme) return;
        currentTheme = theme;
        localStorage.setItem('xgcloud_card_helper_theme', theme);
        applyTheme();
        // 更新广告位主题（外部广告同步颜色）
        const adContainer = document.getElementById('ad-container');
        const adTexts = adContainer.querySelectorAll('*');
        adTexts.forEach(el => {
            if (!el.style.color || el.style.color === THEMES[theme === 'light' ? 'dark' : 'light'].adTextPrimary) {
                el.style.color = THEMES[currentTheme].adTextPrimary;
            }
            if (el.tagName === 'A' && (!el.style.color || el.style.color === (theme === 'light' ? '#60a5fa' : '#3b82f6'))) {
                el.style.color = currentTheme === 'light' ? '#3b82f6' : '#60a5fa';
            }
        });
    }

    // 应用当前主题
    function applyTheme() {
        const theme = THEMES[currentTheme];
        const controlPanel = document.getElementById('control-panel');
        const title = controlPanel.querySelector('h3');
        const themeSelection = document.getElementById('theme-selection');
        const pageStatus = document.getElementById('page-status');
        const adContainer = document.getElementById('ad-container');
        const cardTitle = document.querySelector('#card-selection p');
        const cardInfo = document.querySelectorAll('#card-selection span');
        const intervalTitle = document.querySelector('#interval-setting p');
        const intervalInput = document.querySelector('#interval-setting input');
        const statusText = document.getElementById('status-text');

        // 面板基础样式
        controlPanel.style.backgroundColor = theme.panelBg;
        controlPanel.style.border = `1px solid ${theme.panelBorder}`;

        // 标题样式
        title.style.color = theme.textPrimary;
        title.style.borderBottomColor = theme.panelBorder;
        title.querySelector('span').style.color = theme.textSecondary;

        // 主题选择区域
        themeSelection.style.backgroundColor = theme.bgPrimary;
        themeSelection.querySelector('span').style.color = theme.textTertiary;
        document.querySelectorAll('#theme-selection label span').forEach(span => {
            span.style.color = theme.textPrimary;
        });

        // 页面状态提示
        if (pageStatus.textContent.includes('检测到算力卡')) {
            pageStatus.style.backgroundColor = theme.bgSuccess;
            pageStatus.style.color = currentTheme === 'light' ? '#059669' : '#6ee7b7';
        } else if (pageStatus.textContent.includes('未检测到')) {
            pageStatus.style.backgroundColor = theme.bgError;
            pageStatus.style.color = currentTheme === 'light' ? '#dc2626' : '#fca5a5';
        }

        // 广告位样式（基础样式，不覆盖外部广告内容）
        adContainer.style.background = theme.bgAd;
        adContainer.style.borderColor = theme.borderAd;

        // 算力卡选择区域
        if (cardTitle) cardTitle.style.color = theme.textTertiary;
        cardInfo.forEach(span => span.style.color = theme.textPrimary);

        // 间隔设置区域
        if (intervalTitle) intervalTitle.style.color = theme.textTertiary;
        if (intervalInput) {
            intervalInput.style.borderColor = theme.inputBorder;
            intervalInput.style.backgroundColor = theme.panelBg;
            intervalInput.style.color = theme.textPrimary;
        }

        // 状态文本样式
        statusText.style.backgroundColor = theme.bgPrimary;
        statusText.style.color = theme.textPrimary;
        if (statusText.textContent.includes('抢购成功')) {
            statusText.style.backgroundColor = currentTheme === 'light' ? '#eff6ff' : '#1e3a5f';
            statusText.style.color = currentTheme === 'light' ? '#1e40af' : '#93c5fd';
        } else if (statusText.textContent.includes('运行中')) {
            statusText.style.color = currentTheme === 'light' ? '#059669' : '#6ee7b7';
        } else if (statusText.textContent.includes('部署中')) {
            statusText.style.color = currentTheme === 'light' ? '#f59e0b' : '#fcd34d';
        }
        // 新增：开机状态样式
        if (statusText.textContent.includes('开机中')) {
            statusText.style.color = currentTheme === 'light' ? '#8b5cf6' : '#a78bfa';
        }
    }

    // 更新页面状态
    function updatePageStatus() {
        const cardElements = document.querySelectorAll('.flex-1.relative.select-none.cursor-pointer.rounded-xl.border-2');
        hasValidCards = cardElements.length >= 4; // 适配新页面4个显卡元素

        const pageStatusEl = document.getElementById('page-status');
        const cardSelectionEl = document.getElementById('card-selection');
        const intervalSettingEl = document.getElementById('interval-setting');
        const buttonContainerEl = document.getElementById('button-container');

        if (hasValidCards) {
            pageStatusEl.textContent = '当前页面检测到算力卡元素，可进行抢卡操作';
            pageStatusEl.style.backgroundColor = THEMES[currentTheme].bgSuccess;
            pageStatusEl.style.color = currentTheme === 'light' ? '#059669' : '#6ee7b7';
            cardSelectionEl.style.display = 'block';
            intervalSettingEl.style.display = 'block';
            buttonContainerEl.style.display = 'flex';
        } else {
            pageStatusEl.textContent = '当前页面未检测到算力卡元素，抢卡功能已禁用';
            pageStatusEl.style.backgroundColor = THEMES[currentTheme].bgError;
            pageStatusEl.style.color = currentTheme === 'light' ? '#dc2626' : '#fca5a5';
            cardSelectionEl.style.display = 'none';
            intervalSettingEl.style.display = 'none';
            buttonContainerEl.style.display = 'none';

            // 成功状态判断
            if (DEPLOY_SUCCESS_URL_REGEX.test(window.location.href) && hasInitiatedPurchase && !isDeploySuccess) {
                isDeploySuccess = true;
                if (isRunning) stop抢购();
                const panel = document.getElementById('control-panel');
                if (panel) {
                    panel.style.display = 'none';
                    panel.style.opacity = '0';
                }
            }
        }

        // ========== 新增：检测确认开机按钮并启动自动点击 ==========
        checkBootButtonAndStartClick();
        // ========== /新增：检测确认开机按钮并启动自动点击 ==========

        applyTheme();
    }

    // 验证是否部署成功
    function checkDeploySuccess() {
        if (DEPLOY_SUCCESS_URL_REGEX.test(window.location.href) && hasInitiatedPurchase && !isDeploySuccess) {
            isDeploySuccess = true;
            stop抢购();
            document.getElementById('status-text').textContent = `状态: 抢购成功 (尝试${failCount + 1}次) (${CARD_TYPES[selectedCard].name})`;

            const controlPanel = document.getElementById('control-panel');
            if (controlPanel) {
                controlPanel.style.display = 'none';
                controlPanel.style.opacity = '0';
                controlPanel.style.pointerEvents = 'none';
            }

            applyTheme();
            return true;
        }
        return false;
    }

    // 开始抢卡逻辑
    function start抢购() {
        if (isRunning || !hasValidCards) return;
        isRunning = true;
        isDeploySuccess = false;
        failCount = 0;
        hasInitiatedPurchase = true;
        document.getElementById('status-text').textContent = `状态: 运行中 (失败0次) (目标: ${CARD_TYPES[selectedCard].name})`;
        document.getElementById('start-button').disabled = true;
        document.getElementById('start-button').style.opacity = '0.7';
        document.getElementById('stop-button').disabled = false;
        document.getElementById('stop-button').style.opacity = '1';
        applyTheme();
        checkAnd抢购();
        intervalId = setInterval(checkAnd抢购, checkInterval);
    }

    // 停止抢卡逻辑
    function stop抢购() {
        isRunning = false;
        if (intervalId) clearInterval(intervalId);
        intervalId = null;
        document.getElementById('status-text').textContent = `状态: 已停止 (本次共尝试${failCount + 1}次)`;
        document.getElementById('start-button').disabled = false;
        document.getElementById('start-button').style.opacity = '1';
        document.getElementById('stop-button').disabled = true;
        document.getElementById('stop-button').style.opacity = '0.7';
        applyTheme();
    }

    // 🔥 核心优化：模拟真实用户点击确认部署按钮
    function simulateRealClick(element) {
        try {
            // 1. 先触发鼠标悬停事件（模拟用户鼠标移到按钮上）
            const mouseOverEvent = new MouseEvent('mouseover', {
                bubbles: true,
                cancelable: true,
                view: window
            });
            element.dispatchEvent(mouseOverEvent);

            // 2. 延迟100毫秒（模拟用户停顿）
            setTimeout(() => {
                // 3. 触发点击事件（包含真实用户点击的所有特征）
                const clickEvent = new MouseEvent('click', {
                    bubbles: true,
                    cancelable: true,
                    view: window,
                    button: 0, // 左键点击
                    detail: 1 // 点击次数
                });
                element.dispatchEvent(clickEvent);

                // 4. 日志输出（方便排查）
                console.log('已模拟真实用户点击确认部署按钮');
            }, 100);
        } catch (error) {
            console.error('模拟点击失败：', error);
        }
    }

    // 检查并尝试抢购（优化按钮定位+模拟真实点击）
    function checkAnd抢购() {
        if (!hasValidCards || !isRunning) {
            stop抢购();
            return;
        }

        if (checkDeploySuccess()) return;

        try {
            const cardElements = document.querySelectorAll('.flex-1.relative.select-none.cursor-pointer.rounded-xl.border-2');
            if (cardElements.length < 4) {
                console.log('算力卡元素已消失，停止抢卡');
                hasValidCards = false;
                updatePageStatus();
                return;
            }

            let targetIndex = 0;
            switch(selectedCard) {
                case '4090d_48g': targetIndex = 0; break; // 第一个：RTX 4090 D (48G)
                case '4090_48g': targetIndex = 1; break;  // 第二个：RTX 4090 (48G)
                case '4090d_24g': targetIndex = 2; break; // 第三个：RTX 4090 D (24G)
                case '4090_24g': targetIndex = 3; break;  // 第四个：RTX 4090 (24G)
            }

            // 先选择目标显卡（确保显卡已选中）
            if (cardElements[targetIndex]) {
                // 再次确认选中（防止之前未选中）
                if (!cardElements[targetIndex].classList.contains('border-blue-500')) {
                    cardElements[targetIndex].click();
                    console.log(`已选中目标显卡：${CARD_TYPES[selectedCard].name}`);
                } else {
                    console.log(`目标显卡已选中：${CARD_TYPES[selectedCard].name}`);
                }
            }

            // ========== 关键优化：精准定位+模拟真实点击 ==========
            let deployButton = null;
            // 方式1：通过父容器+文本精准定位（最可靠）
            const deployContainers = document.querySelectorAll('div.flex-1.flex > div.rounded-full');
            deployContainers.forEach(container => {
                if (container.textContent.includes('确认部署')) {
                    deployButton = container;
                }
            });

            // 方式2：备用定位（通过样式+图标）
            if (!deployButton) {
                const blueButtons = document.querySelectorAll('div.rounded-full.bg-blue-500.hover\\:bg-blue-600.h-10');
                blueButtons.forEach(btn => {
                    const icon = btn.querySelector('i.fa-duotone.fa-solid.fa-box-check');
                    if (icon) deployButton = btn;
                });
            }

            // 方式3：最终兜底（通过文本模糊匹配）
            if (!deployButton) {
                const allButtons = document.querySelectorAll('div[role="button"], div.cursor-pointer');
                allButtons.forEach(btn => {
                    if (btn.textContent.includes('确认部署') && btn.classList.contains('bg-blue-500')) {
                        deployButton = btn;
                    }
                });
            }
            // ========== /关键优化 ==========

            if (deployButton) {
                console.log(`发现确认部署按钮，准备触发点击（第${failCount + 1}次尝试）`);
                simulateRealClick(deployButton); // 调用模拟真实点击函数
                failCount++;
                document.getElementById('status-text').textContent = `状态: 发起部署中 (失败${failCount}次) (目标: ${CARD_TYPES[selectedCard].name})`;
            } else {
                document.getElementById('status-text').textContent = `状态: 运行中 (失败${failCount}次) (目标: ${CARD_TYPES[selectedCard].name})`;
                console.log(`未找到确认部署按钮，继续等待...（已失败${failCount}次）`);
            }
        } catch (error) {
            console.error('抢购过程出错:', error);
            failCount++;
            document.getElementById('status-text').textContent = `状态: 运行中 (失败${failCount}次) (目标: ${CARD_TYPES[selectedCard].name})`;
            if (isRunning && !intervalId) {
                intervalId = setInterval(checkAnd抢购, checkInterval);
            }
        }

        applyTheme();
    }

    // ========== 新增：确认开机自动点击核心逻辑 ==========
    // 检查开机是否成功
    function checkBootSuccess() {
        // 成功条件：1.URL匹配成功特征 2.确认开机按钮消失 3.弹窗关闭
        const bootButton = getBootButton();
        if (BOOT_SUCCESS_URL_REGEX.test(window.location.href) || !bootButton) {
            stopBootClickLoop();
            isBooting = false;
            console.log('开机成功/按钮消失，停止自动点击确认开机');
            // 更新状态文本
            const statusText = document.getElementById('status-text');
            if (statusText && statusText.textContent.includes('开机中')) {
                statusText.textContent = '状态: 开机成功';
                applyTheme();
            }
            return true;
        }
        return false;
    }

    // 获取确认开机按钮
    function getBootButton() {
        let bootButton = null;
        // 方式1：精准匹配（文本+样式）
        const bootContainers = document.querySelectorAll('div.rounded-full.border-2.border-solid.h-8.cursor-pointer');
        bootContainers.forEach(container => {
            if (container.textContent.includes('确认开机')) {
                bootButton = container;
            }
        });

        // 方式2：备用匹配（图标+文本）
        if (!bootButton) {
            const iconButtons = document.querySelectorAll('div:has(svg[viewBox="0 0 24 24"].fill-green-500)');
            iconButtons.forEach(btn => {
                if (btn.textContent.includes('确认开机')) {
                    bootButton = btn;
                }
            });
        }

        // 方式3：兜底匹配（弹窗内的确认开机按钮）
        if (!bootButton) {
            const popoverButtons = document.querySelectorAll('.arco-popover-content-inner div.cursor-pointer');
            popoverButtons.forEach(btn => {
                if (btn.textContent.includes('确认开机')) {
                    bootButton = btn;
                }
            });
        }
        return bootButton;
    }

    // 模拟点击确认开机按钮（复用真实点击逻辑）
    function simulateBootClick() {
        const bootButton = getBootButton();
        if (bootButton && !checkBootSuccess()) {
            // 模拟真实用户点击
            simulateRealClick(bootButton);
            console.log('已模拟点击确认开机按钮');
            // 更新状态文本
            const statusText = document.getElementById('status-text');
            if (statusText) {
                statusText.textContent = '状态: 开机中（自动点击确认开机按钮）';
                applyTheme();
            }
        }
    }

    // 启动确认开机按钮循环点击
    function startBootClickLoop() {
        if (isBooting || bootIntervalId) return;
        isBooting = true;
        // 立即点击一次
        simulateBootClick();
        // 启动循环
        bootIntervalId = setInterval(() => {
            if (!checkBootSuccess()) {
                simulateBootClick();
            }
        }, BOOT_CHECK_INTERVAL);
        console.log('启动确认开机按钮自动点击循环');
    }

    // 停止确认开机按钮循环点击
    function stopBootClickLoop() {
        if (bootIntervalId) {
            clearInterval(bootIntervalId);
            bootIntervalId = null;
        }
        isBooting = false;
    }

    // 检测确认开机按钮并启动自动点击
    function checkBootButtonAndStartClick() {
        const bootButton = getBootButton();
        if (bootButton && !isBooting && !checkBootSuccess()) {
            startBootClickLoop();
        } else if (!bootButton && isBooting) {
            stopBootClickLoop();
        }
    }
    // ========== /新增：确认开机自动点击核心逻辑 ==========

    // 监听URL变化
    function listenUrlChange() {
        let lastUrl = window.location.href;
        setInterval(() => {
            const currentUrl = window.location.href;
            if (currentUrl !== lastUrl) {
                lastUrl = currentUrl;
                updatePageStatus();
                if (hasInitiatedPurchase) checkDeploySuccess();
                // ========== 新增：URL变化时检查开机状态 ==========
                checkBootSuccess();
                // ========== /新增：URL变化时检查开机状态 ==========
            }
        }, 200);
    }

    // 初始化
    window.addEventListener('load', () => {
        setTimeout(() => {
            createControlPanel();
            const observer = new MutationObserver(() => updatePageStatus());
            observer.observe(document.body, { childList: true, subtree: true });
            listenUrlChange();
            console.log(`仙宫云自动抢卡助手已加载（v1.8 外部广告控制版 + 确认开机自动点击），当前主题：${currentTheme}`);
        }, 2000);
    });
})();