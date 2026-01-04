// ==UserScript==
// @name 一键到顶/底
// @version 1.0
// @description 添加浮动按钮，根据滚动方向提供快速跳转到页面顶部或底部的功能
// @author DeepSeek
// @match *://*/*
// @grant none
// @namespace https://greasyfork.org/users/452911
// @downloadURL https://update.greasyfork.org/scripts/559774/%E4%B8%80%E9%94%AE%E5%88%B0%E9%A1%B6%E5%BA%95.user.js
// @updateURL https://update.greasyfork.org/scripts/559774/%E4%B8%80%E9%94%AE%E5%88%B0%E9%A1%B6%E5%BA%95.meta.js
// ==/UserScript==

(function() {
 'use strict';

 // 配置对象
 const CONFIG = {
 button: {
 size: 36,
 radius: 10,
 fontSize: 14,
 topArrow: '▲',
 bottomArrow: '▼',
 baseColor: 'hsla(221, 41%, 98%, 0.9)',
 hoverColor: 'hsla(221, 41%, 95%, 0.95)',
 shadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
 position: {
 bottom: '15%',
 right: '20px'
 },
 zIndex: 999999
 },
 scroll: {
 showThreshold: 100, // 显示按钮的滚动阈值
 hideDelay: 2000, // 隐藏延迟（毫秒）
 scrollBehavior: 'smooth', // 平滑滚动
 bottomThreshold: 50 // 距离底部的阈值
 }
 };

 // 滚动管理器
 class ScrollManager {
 constructor() {
 this.lastScrollY = window.scrollY;
 this.isScrollingDown = false;
 this.hideTimeout = null;
 }

 updateScrollPosition() {
 const currentScrollY = window.scrollY;
 this.isScrollingDown = currentScrollY > this.lastScrollY;
 this.lastScrollY = currentScrollY;
 return this.isScrollingDown;
 }

 getScrollState() {
 const scrollHeight = document.documentElement.scrollHeight;
 const clientHeight = window.innerHeight;
 const scrollY = window.scrollY;
 
 return {
 isAtTop: scrollY <= this.config.scroll.showThreshold,
 isAtBottom: scrollY + clientHeight >= scrollHeight - CONFIG.scroll.bottomThreshold,
 position: scrollY,
 direction: this.isScrollingDown ? 'down' : 'up',
 scrollHeight: scrollHeight,
 clientHeight: clientHeight
 };
 }
 }

 // 浮动按钮类
 class FloatingButton {
 constructor(config) {
 this.config = config;
 this.button = null;
 this.isVisible = false;
 this.init();
 }

 init() {
 this.createButton();
 this.applyStyles();
 this.setupEventListeners();
 this.hide(); // 初始状态隐藏
 }

 createButton() {
 this.button = document.createElement('button');
 this.button.id = 'smart-scroll-navigator';
 this.button.type = 'button';
 this.button.setAttribute('aria-label', '滚动导航');
 this.button.setAttribute('title', '点击跳转到页面顶部或底部');
 this.button.textContent = this.config.button.topArrow;
 document.body.appendChild(this.button);
 }

 applyStyles() {
 const style = this.button.style;
 const btnConfig = this.config.button;

 // 基础样式
 style.position = 'fixed';
 style.right = btnConfig.position.right;
 style.bottom = btnConfig.position.bottom;
 style.zIndex = btnConfig.zIndex;
 
 // 尺寸和形状
 style.width = `${btnConfig.size}px`;
 style.height = `${btnConfig.size}px`;
 style.borderRadius = `${btnConfig.radius}px`;
 style.border = 'none';
 
 // 文字样式
 style.fontSize = `${btnConfig.fontSize}px`;
 style.fontFamily = 'system-ui, -apple-system, sans-serif';
 style.fontWeight = 'bold';
 style.color = '#333';
 style.textAlign = 'center';
 style.lineHeight = '1';
 
 // 背景和效果
 style.backgroundColor = btnConfig.baseColor;
 style.boxShadow = btnConfig.shadow;
 style.cursor = 'pointer';
 style.transition = 'all 0.2s ease';
 style.opacity = '0';
 style.transform = 'scale(0.8) translateY(20px)';
 
 // 移除浏览器默认的焦点样式
 style.outline = 'none';
 style.userSelect = 'none';
 style.webkitTapHighlightColor = 'transparent';
 
 // 移除点击时的蓝色背景
 style.WebkitAppearance = 'none';
 style.MozAppearance = 'none';
 style.appearance = 'none';
 }

 show() {
 if (this.isVisible) return;
 
 this.isVisible = true;
 const style = this.button.style;
 
 style.display = 'block';
 requestAnimationFrame(() => {
 style.opacity = '1';
 style.transform = 'scale(1) translateY(0)';
 });
 }

 hide() {
 if (!this.isVisible) return;
 
 this.isVisible = false;
 const style = this.button.style;
 
 style.opacity = '0';
 style.transform = 'scale(0.8) translateY(20px)';
 
 setTimeout(() => {
 if (!this.isVisible) { // 双重检查，避免在动画期间重新显示
 style.display = 'none';
 }
 }, 200); // 等待动画完成
 }

 updateDirection(isScrollingDown) {
 this.button.textContent = isScrollingDown 
 ? this.config.button.bottomArrow 
 : this.config.button.topArrow;
 }

 bindEvents() {
 const button = this.button;
 
 // 清除旧的事件监听器
 const newButton = button.cloneNode(true);
 button.parentNode.replaceChild(newButton, button);
 this.button = newButton;
 
 // 悬停效果
 this.button.addEventListener('mouseenter', () => {
 this.button.style.backgroundColor = this.config.button.hoverColor;
 this.button.style.transform = 'scale(1.05)';
 });
 
 this.button.addEventListener('mouseleave', () => {
 this.button.style.backgroundColor = this.config.button.baseColor;
 this.button.style.transform = 'scale(1)';
 });
 
 // 点击事件
 this.button.addEventListener('click', () => {
 this.handleClick();
 });
 
 // 移除焦点样式
 this.button.addEventListener('focus', (e) => {
 e.target.blur();
 });
 
 // 键盘支持
 this.button.addEventListener('keydown', (e) => {
 if (e.key === 'Enter' || e.key === ' ') {
 e.preventDefault();
 this.handleClick();
 }
 });
 }

 setupEventListeners() {
 this.bindEvents();
 }

 handleClick() {
 const isDown = this.button.textContent === this.config.button.bottomArrow;
 
 if (isDown) {
 // 滚动到底部
 window.scrollTo({
 top: document.documentElement.scrollHeight,
 behavior: this.config.scroll.scrollBehavior
 });
 } else {
 // 滚动到顶部
 window.scrollTo({
 top: 0,
 behavior: this.config.scroll.scrollBehavior
 });
 }
 
 // 点击后立即隐藏按钮
 setTimeout(() => {
 this.hide();
 }, 100);
 }
 }

 // 主应用类
 class SmartScrollNavigator {
 constructor() {
 this.config = CONFIG;
 // 将config传递给ScrollManager
 ScrollManager.prototype.config = this.config;
 this.scrollManager = new ScrollManager();
 this.button = new FloatingButton(this.config);
 this.isEnabled = true;
 this.init();
 }

 init() {
 this.setupScrollListener();
 this.setupVisibilityLogic();
 
 // 初始检查
 this.checkInitialVisibility();
 
 // 监听页面变化
 this.setupMutationObserver();
 
 // 防止在某些页面上冲突
 this.preventConflict();
 }

 setupScrollListener() {
 let ticking = false;
 
 window.addEventListener('scroll', () => {
 if (!ticking) {
 requestAnimationFrame(() => {
 this.handleScroll();
 ticking = false;
 });
 ticking = true;
 }
 }, { passive: true });
 }

 handleScroll() {
 const isScrollingDown = this.scrollManager.updateScrollPosition();
 const scrollState = this.scrollManager.getScrollState();
 
 // 更新按钮方向
 this.button.updateDirection(isScrollingDown);
 
 // 在顶部或底部时隐藏按钮
 if (scrollState.isAtTop || scrollState.isAtBottom) {
 this.button.hide();
 // 清除隐藏计时器
 if (this.scrollManager.hideTimeout) {
 clearTimeout(this.scrollManager.hideTimeout);
 this.scrollManager.hideTimeout = null;
 }
 return;
 }
 
 // 不在顶部也不在底部，且滚动超过阈值时显示按钮
 if (scrollState.position > this.config.scroll.showThreshold) {
 this.button.show();
 this.resetHideTimer();
 } else {
 // 在顶部附近时隐藏
 this.button.hide();
 }
 }

 setupVisibilityLogic() {
 // 鼠标进入按钮区域时取消隐藏
 this.button.button.addEventListener('mouseenter', () => {
 if (this.scrollManager.hideTimeout) {
 clearTimeout(this.scrollManager.hideTimeout);
 this.scrollManager.hideTimeout = null;
 }
 });
 
 // 鼠标离开时重新设置隐藏计时器
 this.button.button.addEventListener('mouseleave', () => {
 const scrollState = this.scrollManager.getScrollState();
 // 只在不在顶部/底部时才设置计时器
 if (!scrollState.isAtTop && !scrollState.isAtBottom) {
 this.resetHideTimer();
 }
 });
 }

 resetHideTimer() {
 // 清除现有的计时器
 if (this.scrollManager.hideTimeout) {
 clearTimeout(this.scrollManager.hideTimeout);
 }
 
 const scrollState = this.scrollManager.getScrollState();
 
 // 只在不在顶部/底部时才设置隐藏计时器
 if (!scrollState.isAtTop && !scrollState.isAtBottom && scrollState.position > this.config.scroll.showThreshold) {
 this.scrollManager.hideTimeout = setTimeout(() => {
 const currentState = this.scrollManager.getScrollState();
 // 再次检查是否不在顶部/底部
 if (!currentState.isAtTop && !currentState.isAtBottom) {
 this.button.hide();
 }
 }, this.config.scroll.hideDelay);
 }
 }

 checkInitialVisibility() {
 const scrollState = this.scrollManager.getScrollState();
 if (scrollState.position > this.config.scroll.showThreshold && 
 !scrollState.isAtTop && !scrollState.isAtBottom) {
 this.button.show();
 }
 }

 setupMutationObserver() {
 // 观察DOM变化，确保按钮始终在body中
 const observer = new MutationObserver((mutations) => {
 if (!document.body.contains(this.button.button)) {
 document.body.appendChild(this.button.button);
 }
 });
 
 observer.observe(document.body, { childList: true });
 }

 preventConflict() {
 // 避免在某些页面上与现有功能冲突
 const style = document.createElement('style');
 style.textContent = `
 #smart-scroll-navigator:active {
 transform: scale(0.95) !important;
 }
 
 /* 移除所有浏览器默认的焦点样式 */
 #smart-scroll-navigator:focus {
 outline: none !important;
 box-shadow: none !important;
 }
 
 #smart-scroll-navigator::-moz-focus-inner {
 border: 0 !important;
 }
 
 /* 在移动设备上调整 */
 @media (max-width: 768px) {
 #smart-scroll-navigator {
 width: 44px !important;
 height: 44px !important;
 font-size: 16px !important;
 right: 12px !important;
 bottom: 80px !important;
 }
 }
 
 /* 深色模式适配 */
 @media (prefers-color-scheme: dark) {
 #smart-scroll-navigator {
 color: #eee !important;
 background-color: hsla(221, 20%, 20%, 0.9) !important;
 }
 #smart-scroll-navigator:hover {
 background-color: hsla(221, 20%, 25%, 0.95) !important;
 }
 }
 `;
 document.head.appendChild(style);
 }

 // 提供API供调试使用
 debug() {
 return {
 config: this.config,
 scrollState: this.scrollManager.getScrollState(),
 buttonVisible: this.button.isVisible
 };
 }
 }

 // 等待页面加载完成后初始化
 if (document.readyState === 'loading') {
 document.addEventListener('DOMContentLoaded', () => {
 new SmartScrollNavigator();
 });
 } else {
 new SmartScrollNavigator();
 }

 // 暴露给全局对象，便于调试
 window.SmartScrollNavigator = SmartScrollNavigator;

})();