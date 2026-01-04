// ==UserScript==
// @name         ReyoungEcology9 RequestId 跳转按钮（高内聚版，Rect版）
// @namespace    http://tampermonkey.net/
// @version      3.2
// @description  使用 getBoundingClientRect() 计算位置和尺寸
// @match        http://ec.reyoung.com:5221/*
// @grant        none
// @license      GPL-2.0-only
// @downloadURL https://update.greasyfork.org/scripts/548668/ReyoungEcology9%20RequestId%20%E8%B7%B3%E8%BD%AC%E6%8C%89%E9%92%AE%EF%BC%88%E9%AB%98%E5%86%85%E8%81%9A%E7%89%88%EF%BC%8CRect%E7%89%88%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/548668/ReyoungEcology9%20RequestId%20%E8%B7%B3%E8%BD%AC%E6%8C%89%E9%92%AE%EF%BC%88%E9%AB%98%E5%86%85%E8%81%9A%E7%89%88%EF%BC%8CRect%E7%89%88%EF%BC%89.meta.js
// ==/UserScript==

(function () {
    'use strict';

    class RequestIdButton {
        constructor() {
            this.STORAGE_KEY = 'reyoung_btn_ratio';
            this.SNAP_THRESHOLD_RATIO = 0.05;
            this.isDragging = false;
            this.offsetX = 0;
            this.offsetY = 0;

            this.loadPosition();
            this.createButton();
            this.setInitialPosition();
            this.bindEvents();
        }

        loadPosition() {
            const saved = JSON.parse(localStorage.getItem(this.STORAGE_KEY) || '{}');
            this.ratioX = typeof saved.ratioX === 'number' ? saved.ratioX : null;
            this.ratioY = typeof saved.ratioY === 'number' ? saved.ratioY : null;
        }

        createButton() {
            this.btn = document.createElement('button');
            this.btn.textContent = '跳转到 RequestId';
            Object.assign(this.btn.style, {
                position: 'fixed',
                zIndex: 9999,
                padding: '8px 12px',
                backgroundColor: '#4CAF50',
                color: '#fff',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                userSelect: 'none'
            });
            document.body.appendChild(this.btn);

            // 用 rect 获取初始宽度
            const rect = this.btn.getBoundingClientRect();
            this.initialWidth = rect.width;
            this.btn.style.width = this.initialWidth + 'px';
        }

        setInitialPosition() {
            if (this.ratioX === null || this.ratioY === null) {
                this.ratioX = (window.innerWidth - this.initialWidth - 20) / window.innerWidth;
                this.ratioY = 20 / window.innerHeight;
            }
            this.updatePositionFromRatio();
            this.applySnap();
        }

        updatePositionFromRatio() {
            let x = this.ratioX * window.innerWidth;
            let y = this.ratioY * window.innerHeight;

            const rect = this.btn.getBoundingClientRect();
            x = Math.max(0, Math.min(window.innerWidth - rect.width, x));
            y = Math.max(0, Math.min(window.innerHeight - rect.height, y));

            this.btn.style.left = x + 'px';
            this.btn.style.top = y + 'px';
            this.btn.style.right = 'auto';
        }

        applySnap() {
            const rect = this.btn.getBoundingClientRect();
            const threshold = window.innerWidth * this.SNAP_THRESHOLD_RATIO;

            this.btn.style.width = rect.width + 'px';
            this.btn.style.right = 'auto';

            if (rect.left <= threshold) {
                this.btn.style.left = '0px';
            } else if (window.innerWidth - (rect.left + rect.width) <= threshold) {
                this.btn.style.left = (window.innerWidth - rect.width) + 'px';
            }
        }

        savePosition() {
            const rect = this.btn.getBoundingClientRect();
            this.ratioX = rect.left / window.innerWidth;
            this.ratioY = rect.top / window.innerHeight;
            localStorage.setItem(this.STORAGE_KEY, JSON.stringify({
                ratioX: this.ratioX,
                ratioY: this.ratioY
            }));
        }

        startDrag(e) {
            this.isDragging = false;

            const rect = this.btn.getBoundingClientRect();
            this.offsetX = e.clientX - rect.left;
            this.offsetY = e.clientY - rect.top;

            const onMouseMove = e => {
                this.isDragging = true;
                let x = e.clientX - this.offsetX;
                let y = e.clientY - this.offsetY;

                const currentRect = this.btn.getBoundingClientRect();
                x = Math.max(0, Math.min(window.innerWidth - currentRect.width, x));
                y = Math.max(0, Math.min(window.innerHeight - currentRect.height, y));

                this.btn.style.left = x + 'px';
                this.btn.style.top = y + 'px';
                this.btn.style.right = 'auto';
            };

            const onMouseUp = () => {
                document.removeEventListener('mousemove', onMouseMove);
                document.removeEventListener('mouseup', onMouseUp);
                this.applySnap();
                this.savePosition();
                this.btn.style.cursor = 'pointer';
                setTimeout(() => this.isDragging = false, 50);
            };

            document.addEventListener('mousemove', onMouseMove);
            document.addEventListener('mouseup', onMouseUp);
        }

        handleClick() {
            if (this.isDragging) return;
            const requestId = prompt('请输入 RequestId:');
            if (requestId && /^\d+$/.test(requestId.trim())) {
                location.href = `http://ec.reyoung.com:5221/workflow/request/ViewRequestForwardSPA.jsp?ismonitor=1&requestid=${requestId.trim()}`;
            } else if (requestId !== null) {
                alert('请输入有效的数字 RequestId！');
            }
        }

        bindEvents() {
            window.addEventListener('resize', () => this.updatePositionFromRatio());
            this.btn.addEventListener('mousedown', e => this.startDrag(e));
            this.btn.addEventListener('click', () => this.handleClick());
        }
    }

    new RequestIdButton();
})();