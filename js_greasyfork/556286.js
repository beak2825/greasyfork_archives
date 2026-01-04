// ==UserScript==
// @name         视图转换
// @namespace    https://viayoo.com/
// @version      1.4.1
// @description  电脑端和手机端视图切换工具
// @author       DeepSeek
// @match        *://*/*
// @grant        GM_registerMenuCommand
// @grant        GM_unregisterMenuCommand
// @grant        GM_setValue
// @grant        GM_getValue
// @run-at       document-start
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/556286/%E8%A7%86%E5%9B%BE%E8%BD%AC%E6%8D%A2.user.js
// @updateURL https://update.greasyfork.org/scripts/556286/%E8%A7%86%E5%9B%BE%E8%BD%AC%E6%8D%A2.meta.js
// ==/UserScript==

(function() {
    'use strict';

    class ViewConverter {
        constructor() {
            this.currentHost = window.location.hostname;
            this.isEnabled = false;
            this.settings = {
                viewMode: 'desktop',
                customViewportWidth: 375,
                desktopViewportWidth: 1200
            };
            this.menuCommands = [];
            
            this.viewportPresets = {
                '小屏设备 (320px)': 320,
                '标准手机 (375px)': 375,
                '大屏手机 (390px)': 390,
                'Google Pixel (412px)': 412,
                'iPhone Plus (414px)': 414,
                '平板设备 (768px)': 768,
                '小平板 (1024px)': 1024
            };
            
            this.init();
        }

        init() {
            this.loadSettings();
            this.createMainMenu();
            if (this.isEnabled) {
                if (document.readyState === 'loading') {
                    document.addEventListener('DOMContentLoaded', () => this.applyViewMode());
                } else {
                    this.applyViewMode();
                }
            }
        }

        loadSettings() {
            const enabledHosts = GM_getValue('enabledHosts', {});
            this.isEnabled = !!enabledHosts[this.currentHost];
            
            const hostSettings = GM_getValue(`host_${this.currentHost}`, {
                viewMode: 'desktop',
                customViewportWidth: 375,
                desktopViewportWidth: 1200
            });
            this.settings = hostSettings;
        }

        saveSettings() {
            GM_setValue(`host_${this.currentHost}`, this.settings);
        }

        enableCurrentHost() {
            const enabledHosts = GM_getValue('enabledHosts', {});
            enabledHosts[this.currentHost] = true;
            GM_setValue('enabledHosts', enabledHosts);
            this.isEnabled = true;
        }

        disableCurrentHost() {
            const enabledHosts = GM_getValue('enabledHosts', {});
            delete enabledHosts[this.currentHost];
            GM_setValue('enabledHosts', enabledHosts);
            this.isEnabled = false;
        }

        createMainMenu() {
            this.clearMenu();
            
            if (!this.isEnabled) {
                this.menuCommands.push(
                    GM_registerMenuCommand(`🚫 在当前网站启用 (${this.currentHost})`, () => this.enableScript())
                );
                return;
            }

            const currentStatus = this.getCurrentStatusText();
            const switchText = this.getSwitchText();
            
            this.menuCommands.push(
                GM_registerMenuCommand(`✅ ${currentStatus}`, () => this.showStatus()),
                GM_registerMenuCommand(switchText, () => this.toggleViewMode())
            );

            if (this.settings.viewMode === 'mobile') {
                this.menuCommands.push(
                    GM_registerMenuCommand('🎯 设置手机视口', () => this.showMobileViewportMenu())
                );
            } else {
                this.menuCommands.push(
                    GM_registerMenuCommand('🔧 设置电脑视口', () => this.showDesktopViewportMenu())
                );
            }

            this.menuCommands.push(
                GM_registerMenuCommand('❌ 禁用脚本', () => this.disableScript())
            );
        }

        clearMenu() {
            this.menuCommands.forEach(id => GM_unregisterMenuCommand(id));
            this.menuCommands = [];
        }

        getCurrentStatusText() {
            if (this.settings.viewMode === 'mobile') {
                return `手机模式: ${this.settings.customViewportWidth}px`;
            } else {
                return `电脑模式: ${this.settings.desktopViewportWidth}px`;
            }
        }

        getSwitchText() {
            return this.settings.viewMode === 'mobile' ? '💻 切换到电脑端' : '📱 切换到手机端';
        }

        enableScript() {
            this.enableCurrentHost();
            this.saveSettings();
            this.createMainMenu();
            this.applyViewMode();
            this.showNotification(`已在 ${this.currentHost} 启用脚本`);
        }

        disableScript() {
            this.removeAllStyles();
            this.resetViewport();
            this.disableCurrentHost();
            this.createMainMenu();
            this.showNotification(`已在 ${this.currentHost} 禁用脚本`);
        }

        toggleViewMode() {
            if (!this.isEnabled) return;
            
            this.settings.viewMode = this.settings.viewMode === 'mobile' ? 'desktop' : 'mobile';
            this.saveSettings();
            this.createMainMenu();
            this.applyViewMode();
            
            this.showNotification(`已切换到 ${this.settings.viewMode === 'mobile' ? '手机模式' : '电脑模式'}`);
        }

        showMobileViewportMenu() {
            if (!this.isEnabled) return;

            this.clearMenu();
            
            Object.keys(this.viewportPresets).forEach(deviceName => {
                this.menuCommands.push(
                    GM_registerMenuCommand(`📱 ${deviceName}`, () => {
                        this.setMobileViewport(this.viewportPresets[deviceName]);
                    })
                );
            });

            this.menuCommands.push(
                GM_registerMenuCommand('🔧 自定义宽度', () => this.setCustomMobileViewport()),
                GM_registerMenuCommand('↩️ 返回', () => this.createMainMenu())
            );
        }

        showDesktopViewportMenu() {
            if (!this.isEnabled) return;

            this.clearMenu();
            
            const desktopPresets = {
                '💻 笔记本 (1200px)': 1200,
                '🖥️ 标准桌面 (1366px)': 1366,
                '🖥️ 大屏桌面 (1440px)': 1440,
                '🖥️ 宽屏桌面 (1920px)': 1920
            };

            Object.keys(desktopPresets).forEach(presetName => {
                this.menuCommands.push(
                    GM_registerMenuCommand(presetName, () => {
                        this.setDesktopViewport(desktopPresets[presetName]);
                    })
                );
            });

            this.menuCommands.push(
                GM_registerMenuCommand('🔧 自定义宽度', () => this.setCustomDesktopViewport()),
                GM_registerMenuCommand('↩️ 返回', () => this.createMainMenu())
            );
        }

        setMobileViewport(width) {
            this.settings.customViewportWidth = width;
            this.settings.viewMode = 'mobile';
            this.saveSettings();
            this.applyViewMode();
            this.showNotification(`手机视口设置为 ${width}px`);
        }

        setDesktopViewport(width) {
            this.settings.desktopViewportWidth = width;
            this.settings.viewMode = 'desktop';
            this.saveSettings();
            this.applyViewMode();
            this.showNotification(`电脑视口设置为 ${width}px`);
        }

        setCustomMobileViewport() {
            const width = parseInt(prompt('请输入手机视口宽度 (px):', this.settings.customViewportWidth));
            if (!isNaN(width) && width >= 200 && width <= 2000) {
                this.setMobileViewport(width);
            } else if (!isNaN(width)) {
                this.showNotification('宽度无效 (200-2000)');
            }
            this.showMobileViewportMenu();
        }

        setCustomDesktopViewport() {
            const width = parseInt(prompt('请输入电脑视口宽度 (px):', this.settings.desktopViewportWidth));
            if (!isNaN(width) && width >= 800 && width <= 4000) {
                this.setDesktopViewport(width);
            } else if (!isNaN(width)) {
                this.showNotification('宽度无效 (800-4000)');
            }
            this.showDesktopViewportMenu();
        }

        showStatus() {
            const enabledHosts = GM_getValue('enabledHosts', {});
            alert(`当前模式: ${this.getCurrentStatusText()}\n已启用网站: ${Object.keys(enabledHosts).join(', ') || '无'}`);
        }

        applyViewMode() {
            if (!this.isEnabled) return;
            
            this.removeAllStyles();
            this.resetViewport();
            
            if (this.settings.viewMode === 'mobile') {
                this.applyMobileView();
            } else {
                this.applyDesktopView();
            }
        }

        applyMobileView() {
            this.setViewport(`width=${this.settings.customViewportWidth}, initial-scale=1.0, user-scalable=no`);
            
            const style = document.createElement('style');
            style.id = 'mobile-view-styles';
            style.textContent = `
                body {
                    width: ${this.settings.customViewportWidth}px !important;
                    max-width: ${this.settings.customViewportWidth}px !important;
                    min-width: ${this.settings.customViewportWidth}px !important;
                    margin: 0 auto !important;
                    transform-origin: top center !important;
                    overflow-x: hidden !important;
                }
                html {
                    overflow-x: hidden !important;
                }
                img, video {
                    max-width: 100% !important;
                    height: auto !important;
                }
                table {
                    width: 100% !important;
                }
            `;
            document.head.appendChild(style);
            
            this.forceLayoutUpdate();
        }

        applyDesktopView() {
            this.setViewport(`width=${this.settings.desktopViewportWidth}, initial-scale=1.0`);
            
            const style = document.createElement('style');
            style.id = 'desktop-view-styles';
            style.textContent = `
                body {
                    min-width: ${this.settings.desktopViewportWidth}px !important;
                    margin: 0 auto !important;
                }
                html {
                    overflow-x: auto !important;
                }
            `;
            document.head.appendChild(style);
            
            this.forceLayoutUpdate();
        }

        setViewport(content) {
            let viewport = document.querySelector('meta[name="viewport"]');
            if (!viewport) {
                viewport = document.createElement('meta');
                viewport.name = 'viewport';
                document.head.appendChild(viewport);
            }
            viewport.content = content;
        }

        resetViewport() {
            let viewport = document.querySelector('meta[name="viewport"]');
            if (viewport) {
                viewport.content = 'width=device-width, initial-scale=1.0';
            }
        }

        removeAllStyles() {
            ['mobile-view-styles', 'desktop-view-styles'].forEach(id => {
                const style = document.getElementById(id);
                if (style) style.remove();
            });
        }

        forceLayoutUpdate() {
            document.body.style.display = 'none';
            document.body.offsetHeight;
            document.body.style.display = '';
            window.dispatchEvent(new Event('resize'));
        }

        showNotification(message) {
            console.log(`🔧 视图转换: ${message}`);
            this.showTempMessage(message);
        }

        showTempMessage(message) {
            const div = document.createElement('div');
            div.textContent = `🔧 ${message}`;
            div.style.cssText = `
                position: fixed;
                top: 20px;
                right: 20px;
                background: #4CAF50;
                color: white;
                padding: 10px 20px;
                border-radius: 5px;
                z-index: 10000;
                font-size: 14px;
                box-shadow: 0 2px 10px rgba(0,0,0,0.3);
            `;
            document.body.appendChild(div);
            setTimeout(() => div.remove(), 2000);
        }
    }

    new ViewConverter();
})();