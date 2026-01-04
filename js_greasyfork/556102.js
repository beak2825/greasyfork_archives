// ==UserScript==
// @name         YouTube Channel Analytics Pro
// @version      0.1
// @description  Расширенная статистика для YouTube: отображение скрытых метрик каналов, анализ просмотров, динамики и активности.
// @author       lumo
// @match        https://www.youtube.com/*
// @grant        none
// @license      Proprietary - запрещено копировать, изменять, распространять и использовать код без разрешения автора
// @homepageURL  https://greasyfork.org/
// @supportURL   https://greasyfork.org/
// @namespace http://tampermonkey.net/
// @downloadURL https://update.greasyfork.org/scripts/556102/YouTube%20Channel%20Analytics%20Pro.user.js
// @updateURL https://update.greasyfork.org/scripts/556102/YouTube%20Channel%20Analytics%20Pro.meta.js
// ==/UserScript==

(function() {
'use strict';

const style = document.createElement('style');
style.textContent = `
    .lumo-analytics-wrapper {
        width: 100%;
        margin-top: 16px;
    }

    .lumo-analytics-container {
        background: linear-gradient(135deg, #0f0f0f 0%, #1a1a1a 100%);
        border-radius: 16px;
        padding: 20px;
        border: 1px solid #303030;
        width: 100%;
        max-width: 100%;
        box-sizing: border-box;
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        font-family: "Roboto", "Arial", sans-serif;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
    }

    .lumo-analytics-container:hover {
        background: linear-gradient(135deg, #1a1a1a 0%, #242424 100%);
        border-color: #404040;
        box-shadow: 0 4px 16px rgba(0, 0, 0, 0.4);
        transform: translateY(-2px);
    }

    .lumo-analytics-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-bottom: 16px;
        gap: 12px;
        flex-wrap: wrap;
    }

    .lumo-analytics-title {
        font-size: 16px;
        font-weight: 600;
        color: #ffffff;
        display: flex;
        align-items: center;
        gap: 10px;
        font-family: "Roboto", "Arial", sans-serif;
        letter-spacing: 0.5px;
    }

    .lumo-analytics-badge {
        background: linear-gradient(135deg, #ff0000 0%, #cc0000 100%);
        padding: 4px 10px;
        border-radius: 4px;
        font-size: 11px;
        font-weight: 700;
        text-transform: uppercase;
        letter-spacing: 1px;
        color: #ffffff;
        box-shadow: 0 2px 8px rgba(255, 0, 0, 0.3);
    }

    .lumo-analytics-badge.live {
        background: linear-gradient(135deg, #ff0000 0%, #ff4444 100%);
        animation: lumo-pulse 1.5s infinite;
    }

    @keyframes lumo-pulse {
        0%, 100% { opacity: 1; transform: scale(1); }
        50% { opacity: 0.8; transform: scale(1.05); }
    }

    .lumo-analytics-expand-btn {
        background: linear-gradient(135deg, #272727 0%, #3f3f3f 100%);
        border: none;
        color: #ffffff;
        padding: 10px 18px;
        border-radius: 20px;
        cursor: pointer;
        font-size: 14px;
        font-weight: 600;
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        display: flex;
        align-items: center;
        gap: 8px;
        font-family: "Roboto", "Arial", sans-serif;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
    }

    .lumo-analytics-expand-btn:hover {
        background: linear-gradient(135deg, #3f3f3f 0%, #4f4f4f 100%);
        transform: translateY(-2px);
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
    }

    .lumo-analytics-expand-btn:active {
        transform: scale(0.95);
    }

    .lumo-stats-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
        gap: 12px;
    }

    .lumo-stat-card {
        background: linear-gradient(135deg, #1a1a1a 0%, #242424 100%);
        border-radius: 12px;
        padding: 16px;
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        border: 1px solid #303030;
        position: relative;
        overflow: hidden;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
    }

    .lumo-stat-card::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 2px;
        background: linear-gradient(90deg, #ff0000, #ff4444);
        transform: scaleX(0);
        transition: transform 0.3s;
    }

    .lumo-stat-card:hover::before {
        transform: scaleX(1);
    }

    .lumo-stat-card:hover {
        background: linear-gradient(135deg, #242424 0%, #2f2f2f 100%);
        border-color: #505050;
        transform: translateY(-4px);
        box-shadow: 0 6px 20px rgba(0, 0, 0, 0.4);
    }

    .lumo-stat-label {
        font-size: 13px;
        color: #cccccc;
        margin-bottom: 8px;
        font-family: "Roboto", "Arial", sans-serif;
        font-weight: 500;
        letter-spacing: 0.5px;
    }

    .lumo-stat-value {
        font-size: 18px;
        font-weight: 700;
        color: #ffffff;
        display: flex;
        align-items: center;
        gap: 8px;
        font-family: "Roboto", "Arial", sans-serif;
    }

    .lumo-stat-icon {
        font-size: 16px;
        opacity: 0.95;
        color: #ff0000;
    }

    .lumo-loading {
        text-align: center;
        padding: 20px;
    }

    .lumo-spinner {
        width: 24px;
        height: 24px;
        border: 3px solid #272727;
        border-top-color: #ff0000;
        border-radius: 50%;
        animation: lumo-spin 0.8s linear infinite;
        margin: 0 auto 12px;
    }

    @keyframes lumo-spin {
        to { transform: rotate(360deg); }
    }

    .lumo-loading-text {
        font-size: 14px;
        color: #cccccc;
        font-family: "Roboto", "Arial", sans-serif;
        font-weight: 500;
    }

    .lumo-country-info {
        display: flex;
        align-items: center;
        gap: 10px;
    }

    .lumo-country-flag {
        width: 28px;
        height: 20px;
        border-radius: 3px;
        object-fit: cover;
        border: 1px solid #3f3f3f;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
    }

    .lumo-country-name {
        font-size: 15px;
        color: #ffffff;
        font-family: "Roboto", "Arial", sans-serif;
        font-weight: 600;
    }

    .lumo-modal {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.92);
        z-index: 99999;
        display: none;
        align-items: center;
        justify-content: center;
        animation: lumo-fade-in 0.25s;
        backdrop-filter: blur(4px);
    }

    .lumo-modal.active {
        display: flex;
    }

    .lumo-modal-content {
        background: linear-gradient(135deg, #0f0f0f 0%, #1a1a1a 100%);
        border-radius: 16px;
        padding: 28px;
        max-width: 1400px;
        width: 94%;
        max-height: 90vh;
        overflow-y: auto;
        animation: lumo-slide-up 0.4s cubic-bezier(0.4, 0, 0.2, 1);
        box-shadow: 0 12px 48px rgba(0, 0, 0, 0.8);
        border: 1px solid #303030;
    }

    .lumo-modal-content::-webkit-scrollbar {
        width: 12px;
    }

    .lumo-modal-content::-webkit-scrollbar-track {
        background: #0f0f0f;
        border-radius: 6px;
    }

    .lumo-modal-content::-webkit-scrollbar-thumb {
        background: linear-gradient(135deg, #3f3f3f 0%, #5f5f5f 100%);
        border-radius: 6px;
    }

    .lumo-modal-content::-webkit-scrollbar-thumb:hover {
        background: linear-gradient(135deg, #5f5f5f 0%, #7f7f7f 100%);
    }

    @keyframes lumo-slide-up {
        from {
            opacity: 0;
            transform: translateY(40px) scale(0.95);
        }
        to {
            opacity: 1;
            transform: translateY(0) scale(1);
        }
    }

    @keyframes lumo-fade-in {
        from { opacity: 0; }
        to { opacity: 1; }
    }

    .lumo-modal-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 24px;
        padding-bottom: 20px;
        border-bottom: 2px solid #303030;
    }

    .lumo-modal-title {
        font-size: 24px;
        font-weight: 700;
        color: #ffffff;
        font-family: "Roboto", "Arial", sans-serif;
        letter-spacing: 0.5px;
    }

    .lumo-modal-close {
        background: linear-gradient(135deg, #272727 0%, #3f3f3f 100%);
        border: none;
        color: #ffffff;
        width: 42px;
        height: 42px;
        border-radius: 50%;
        cursor: pointer;
        font-size: 24px;
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 0;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
    }

    .lumo-modal-close:hover {
        background: linear-gradient(135deg, #ff0000 0%, #cc0000 100%);
        transform: rotate(90deg) scale(1.1);
        box-shadow: 0 4px 16px rgba(255, 0, 0, 0.4);
    }

    .lumo-modal-close:active {
        transform: rotate(90deg) scale(0.95);
    }

    .lumo-tabs {
        display: flex;
        gap: 8px;
        margin-bottom: 24px;
        overflow-x: auto;
        -webkit-overflow-scrolling: touch;
        padding-bottom: 6px;
    }

    .lumo-tabs::-webkit-scrollbar {
        height: 0;
    }

    .lumo-tab {
        background: linear-gradient(135deg, #1a1a1a 0%, #242424 100%);
        border: 1px solid #303030;
        color: #cccccc;
        padding: 12px 22px;
        cursor: pointer;
        font-size: 14px;
        font-weight: 600;
        border-radius: 10px;
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        position: relative;
        white-space: nowrap;
        font-family: "Roboto", "Arial", sans-serif;
        letter-spacing: 0.5px;
        box-shadow: 0 2px 6px rgba(0, 0, 0, 0.2);
    }

    .lumo-tab:hover {
        color: #ffffff;
        background: linear-gradient(135deg, #272727 0%, #3f3f3f 100%);
        border-color: #505050;
        transform: translateY(-2px);
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
    }

    .lumo-tab.active {
        color: #ffffff;
        background: linear-gradient(135deg, #ff0000 0%, #cc0000 100%);
        border-color: #ff0000;
        box-shadow: 0 4px 16px rgba(255, 0, 0, 0.4);
    }

    .lumo-tab-content {
        display: none;
    }

    .lumo-tab-content.active {
        display: block;
        animation: lumo-fade-in 0.3s;
    }

    .lumo-detail-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
        gap: 16px;
        margin-bottom: 20px;
    }

    .lumo-detail-card {
        background: linear-gradient(135deg, #1a1a1a 0%, #242424 100%);
        border-radius: 12px;
        padding: 20px;
        border: 1px solid #303030;
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
    }

    .lumo-detail-card:hover {
        background: linear-gradient(135deg, #242424 0%, #2f2f2f 100%);
        border-color: #505050;
        transform: translateY(-4px);
        box-shadow: 0 6px 20px rgba(0, 0, 0, 0.4);
    }

    .lumo-detail-card-title {
        font-size: 12px;
        color: #cccccc;
        margin-bottom: 12px;
        text-transform: uppercase;
        letter-spacing: 1.2px;
        font-family: "Roboto", "Arial", sans-serif;
        font-weight: 600;
    }

    .lumo-detail-card-value {
        font-size: 28px;
        font-weight: 700;
        color: #ffffff;
        margin-bottom: 8px;
        font-family: "Roboto", "Arial", sans-serif;
    }

    .lumo-detail-card-subtitle {
        font-size: 13px;
        color: #aaaaaa;
        font-family: "Roboto", "Arial", sans-serif;
        letter-spacing: 0.3px;
        font-weight: 500;
    }

    .lumo-chart-bar {
        margin-bottom: 16px;
    }

    .lumo-chart-label {
        font-size: 13px;
        color: #cccccc;
        margin-bottom: 10px;
        display: flex;
        justify-content: space-between;
        font-family: "Roboto", "Arial", sans-serif;
        letter-spacing: 0.3px;
        font-weight: 600;
    }

    .lumo-chart-bar-bg {
        background: #272727;
        height: 10px;
        border-radius: 5px;
        overflow: hidden;
        box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.3);
    }

    .lumo-chart-bar-fill {
        height: 100%;
        background: linear-gradient(90deg, #ff0000, #ff4444);
        border-radius: 5px;
        transition: width 0.8s cubic-bezier(0.4, 0, 0.2, 1);
        box-shadow: 0 0 10px rgba(255, 0, 0, 0.5);
    }

    .lumo-day-distribution {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(80px, 1fr));
        gap: 12px;
        margin-top: 16px;
    }

    .lumo-day-item {
        background: linear-gradient(135deg, #1a1a1a 0%, #242424 100%);
        border-radius: 12px;
        padding: 16px 12px;
        text-align: center;
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        border: 1px solid #303030;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
    }

    .lumo-day-item:hover {
        background: linear-gradient(135deg, #242424 0%, #2f2f2f 100%);
        transform: translateY(-4px) scale(1.05);
        border-color: #505050;
        box-shadow: 0 6px 20px rgba(0, 0, 0, 0.4);
    }

    .lumo-day-item.active {
        background: linear-gradient(135deg, #ff0000 0%, #cc0000 100%);
        border-color: #ff0000;
        box-shadow: 0 6px 24px rgba(255, 0, 0, 0.5);
    }

    .lumo-day-name {
        font-size: 12px;
        color: #cccccc;
        margin-bottom: 8px;
        font-family: "Roboto", "Arial", sans-serif;
        letter-spacing: 0.6px;
        text-transform: uppercase;
        font-weight: 600;
    }

    .lumo-day-item.active .lumo-day-name {
        color: #ffffff;
    }

    .lumo-day-count {
        font-size: 20px;
        font-weight: 700;
        color: #ffffff;
        font-family: "Roboto", "Arial", sans-serif;
    }

    .lumo-trend-up {
        color: #00ff88;
    }

    .lumo-trend-down {
        color: #ff4444;
    }

    .lumo-trend-stable {
        color: #ffbb33;
    }

    .lumo-chart-wrapper {
        position: relative;
        margin-bottom: 24px;
    }

    .lumo-chart-canvas {
        width: 100%;
        height: 320px;
        border-radius: 12px;
        background: linear-gradient(135deg, #1a1a1a 0%, #242424 100%);
        border: 1px solid #303030;
        cursor: crosshair;
        box-shadow: 0 4px 16px rgba(0, 0, 0, 0.3);
    }

    .lumo-chart-tooltip {
        position: fixed;
        background: linear-gradient(135deg, #1f1f1f 0%, #2a2a2a 100%);
        border: 1px solid #505050;
        border-radius: 10px;
        padding: 12px 16px;
        pointer-events: none;
        opacity: 0;
        transition: opacity 0.2s;
        font-family: "Roboto", "Arial", sans-serif;
        font-size: 13px;
        color: #ffffff;
        box-shadow: 0 6px 20px rgba(0, 0, 0, 0.6);
        z-index: 100000;
        white-space: nowrap;
    }

    .lumo-chart-tooltip.visible {
        opacity: 1;
    }

    .lumo-chart-tooltip-label {
        font-weight: 600;
        margin-bottom: 6px;
        color: #ff4444;
        letter-spacing: 0.5px;
    }

    .lumo-chart-tooltip-value {
        font-size: 18px;
        font-weight: 700;
        color: #ffffff;
    }

    .lumo-trend-indicator {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 20px;
        padding: 28px;
        background: linear-gradient(135deg, #1a1a1a 0%, #242424 100%);
        border-radius: 16px;
        margin-bottom: 24px;
        border: 2px solid #303030;
        box-shadow: 0 4px 16px rgba(0, 0, 0, 0.3);
    }

    .lumo-trend-indicator.explosive-growth {
        border-color: #00ff88;
        background: linear-gradient(135deg, rgba(0, 255, 136, 0.15) 0%, rgba(0, 255, 136, 0.03) 100%);
        box-shadow: 0 4px 24px rgba(0, 255, 136, 0.3);
    }

    .lumo-trend-indicator.strong-growth {
        border-color: #33ff99;
        background: linear-gradient(135deg, rgba(51, 255, 153, 0.12) 0%, rgba(51, 255, 153, 0.02) 100%);
        box-shadow: 0 4px 20px rgba(51, 255, 153, 0.25);
    }

    .lumo-trend-indicator.moderate-growth {
        border-color: #66ffaa;
        background: linear-gradient(135deg, rgba(102, 255, 170, 0.1) 0%, rgba(102, 255, 170, 0.02) 100%);
        box-shadow: 0 4px 16px rgba(102, 255, 170, 0.2);
    }

    .lumo-trend-indicator.slight-growth {
        border-color: #99ffbb;
        background: linear-gradient(135deg, rgba(153, 255, 187, 0.08) 0%, rgba(153, 255, 187, 0.01) 100%);
    }

    .lumo-trend-indicator.stable {
        border-color: #ffbb33;
        background: linear-gradient(135deg, rgba(255, 187, 51, 0.12) 0%, rgba(255, 187, 51, 0.02) 100%);
        box-shadow: 0 4px 16px rgba(255, 187, 51, 0.2);
    }

    .lumo-trend-indicator.stagnant {
        border-color: #999999;
        background: linear-gradient(135deg, rgba(153, 153, 153, 0.12) 0%, rgba(153, 153, 153, 0.02) 100%);
    }

    .lumo-trend-indicator.slight-decline {
        border-color: #ffaa99;
        background: linear-gradient(135deg, rgba(255, 170, 153, 0.08) 0%, rgba(255, 170, 153, 0.01) 100%);
    }

    .lumo-trend-indicator.moderate-decline {
        border-color: #ff6666;
        background: linear-gradient(135deg, rgba(255, 102, 102, 0.1) 0%, rgba(255, 102, 102, 0.02) 100%);
        box-shadow: 0 4px 16px rgba(255, 102, 102, 0.2);
    }

    .lumo-trend-indicator.strong-decline {
        border-color: #ff3333;
        background: linear-gradient(135deg, rgba(255, 51, 51, 0.12) 0%, rgba(255, 51, 51, 0.02) 100%);
        box-shadow: 0 4px 20px rgba(255, 51, 51, 0.25);
    }

    .lumo-trend-indicator.critical-decline {
        border-color: #ff0000;
        background: linear-gradient(135deg, rgba(255, 0, 0, 0.15) 0%, rgba(255, 0, 0, 0.03) 100%);
        box-shadow: 0 4px 24px rgba(255, 0, 0, 0.3);
    }

    .lumo-trend-icon {
        font-size: 56px;
        line-height: 1;
        filter: drop-shadow(0 3px 6px rgba(0, 0, 0, 0.4));
    }

    .lumo-trend-info {
        flex: 1;
    }

    .lumo-trend-status {
        font-size: 28px;
        font-weight: 700;
        margin-bottom: 8px;
        font-family: "Roboto", "Arial", sans-serif;
        letter-spacing: 0.5px;
        color: #ffffff;
    }

    .lumo-trend-desc {
        font-size: 15px;
        color: #cccccc;
        font-family: "Roboto", "Arial", sans-serif;
        letter-spacing: 0.3px;
        font-weight: 500;
    }

    .lumo-metrics-row {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
        gap: 16px;
        margin-bottom: 24px;
    }

    .lumo-metric-card {
        background: linear-gradient(135deg, #1a1a1a 0%, #242424 100%);
        border-radius: 12px;
        padding: 20px;
        border-left: 4px solid #ff0000;
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
    }

    .lumo-metric-card:hover {
        background: linear-gradient(135deg, #242424 0%, #2f2f2f 100%);
        transform: translateX(4px);
        box-shadow: 0 6px 20px rgba(0, 0, 0, 0.4);
    }

    .lumo-metric-card.positive {
        border-left-color: #00ff88;
    }

    .lumo-metric-card.negative {
        border-left-color: #ff4444;
    }

    .lumo-metric-card.neutral {
        border-left-color: #ffbb33;
    }

    .lumo-metric-label {
        font-size: 12px;
        color: #cccccc;
        margin-bottom: 12px;
        font-family: "Roboto", "Arial", sans-serif;
        text-transform: uppercase;
        letter-spacing: 1.2px;
        font-weight: 600;
    }

    .lumo-metric-value {
        font-size: 24px;
        font-weight: 700;
        margin-bottom: 8px;
        font-family: "Roboto", "Arial", sans-serif;
        color: #ffffff;
    }

    .lumo-metric-change {
        font-size: 14px;
        font-family: "Roboto", "Arial", sans-serif;
        display: flex;
        align-items: center;
        gap: 8px;
        color: #ffffff;
        letter-spacing: 0.3px;
        font-weight: 500;
    }

    .lumo-author {
        text-align: center;
        margin-top: 24px;
        padding-top: 20px;
        border-top: 1px solid #303030;
        font-size: 12px;
        color: #888888;
        font-family: "Roboto", "Arial", sans-serif;
        letter-spacing: 0.6px;
        font-weight: 500;
    }

    .lumo-performance-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
        gap: 16px;
    }

    .lumo-performance-item {
        background: linear-gradient(135deg, #1a1a1a 0%, #242424 100%);
        border-radius: 12px;
        padding: 20px;
        border: 1px solid #303030;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    }

    .lumo-performance-item:hover {
        transform: translateY(-4px);
        box-shadow: 0 6px 20px rgba(0, 0, 0, 0.4);
        border-color: #505050;
    }

    .lumo-performance-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 14px;
    }

    .lumo-performance-title {
        font-size: 13px;
        color: #cccccc;
        text-transform: uppercase;
        letter-spacing: 1px;
        font-weight: 600;
    }

    .lumo-performance-score {
        font-size: 28px;
        font-weight: 700;
        font-family: "Roboto", "Arial", sans-serif;
    }

    .lumo-performance-desc {
        font-size: 13px;
        color: #aaaaaa;
        margin-top: 10px;
        line-height: 1.6;
        font-weight: 500;
    }

    .lumo-score-excellent {
        color: #00ff88;
    }

    .lumo-score-good {
        color: #33ff99;
    }

    .lumo-score-average {
        color: #ffbb33;
    }

    .lumo-score-poor {
        color: #ff9966;
    }

    .lumo-score-bad {
        color: #ff4444;
    }

    .lumo-score-legend {
        background: linear-gradient(135deg, #1a1a1a 0%, #242424 100%);
        border-radius: 12px;
        padding: 20px;
        margin-bottom: 20px;
        border: 1px solid #303030;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
    }

    .lumo-score-legend-title {
        font-size: 16px;
        font-weight: 700;
        color: #ffffff;
        margin-bottom: 16px;
    }

    .lumo-score-legend-items {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(130px, 1fr));
        gap: 12px;
    }

    .lumo-score-legend-item {
        display: flex;
        align-items: center;
        gap: 10px;
        font-size: 13px;
        font-weight: 600;
        color: #ffffff;
    }

    .lumo-score-legend-badge {
        font-size: 18px;
        font-weight: 700;
        min-width: 40px;
    }

    .lumo-compare-section {
        background: linear-gradient(135deg, #1a1a1a 0%, #242424 100%);
        border-radius: 12px;
        padding: 24px;
        margin-bottom: 20px;
        border: 1px solid #303030;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
    }

    .lumo-compare-title {
        font-size: 18px;
        font-weight: 700;
        color: #ffffff;
        margin-bottom: 20px;
        font-family: "Roboto", "Arial", sans-serif;
    }

    .lumo-compare-grid {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 24px;
    }

    .lumo-compare-column {
        text-align: center;
    }

    .lumo-compare-column-title {
        font-size: 14px;
        color: #cccccc;
        margin-bottom: 14px;
        text-transform: uppercase;
        letter-spacing: 1px;
        font-weight: 600;
    }

    .lumo-compare-value {
        font-size: 36px;
        font-weight: 700;
        color: #ffffff;
        margin-bottom: 10px;
        font-family: "Roboto", "Arial", sans-serif;
    }

    .lumo-compare-diff {
        font-size: 15px;
        font-weight: 600;
        font-family: "Roboto", "Arial", sans-serif;
    }

    .lumo-compare-diff.positive {
        color: #00ff88;
    }

    .lumo-compare-diff.negative {
        color: #ff4444;
    }

    .lumo-live-stats {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
        gap: 14px;
        margin-bottom: 20px;
    }

    .lumo-live-card {
        background: linear-gradient(135deg, #1a1a1a 0%, #242424 100%);
        border-radius: 12px;
        padding: 18px;
        border: 1px solid #303030;
        text-align: center;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    }

    .lumo-live-card:hover {
        transform: translateY(-4px);
        box-shadow: 0 6px 20px rgba(0, 0, 0, 0.4);
    }

    .lumo-live-card.highlight {
        border-color: #ff0000;
        box-shadow: 0 4px 24px rgba(255, 0, 0, 0.4);
        animation: lumo-pulse 2s infinite;
    }

    .lumo-live-label {
        font-size: 12px;
        color: #cccccc;
        margin-bottom: 10px;
        text-transform: uppercase;
        letter-spacing: 1px;
        font-weight: 600;
    }

    .lumo-live-value {
        font-size: 32px;
        font-weight: 700;
        color: #ffffff;
        font-family: "Roboto", "Arial", sans-serif;
    }

    .lumo-health-indicator {
        background: linear-gradient(135deg, #1a1a1a 0%, #242424 100%);
        border-radius: 12px;
        padding: 24px;
        margin-bottom: 20px;
        border: 1px solid #303030;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
    }

    .lumo-health-title {
        font-size: 16px;
        font-weight: 700;
        color: #ffffff;
        margin-bottom: 16px;
    }

    .lumo-health-bar {
        background: #272727;
        height: 14px;
        border-radius: 7px;
        overflow: hidden;
        margin-bottom: 12px;
        box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.3);
    }

    .lumo-health-fill {
        height: 100%;
        transition: width 1s cubic-bezier(0.4, 0, 0.2, 1);
        border-radius: 7px;
        box-shadow: 0 0 12px rgba(255, 255, 255, 0.3);
    }

    .lumo-health-label {
        font-size: 14px;
        color: #cccccc;
        text-align: center;
        font-weight: 600;
    }

    .lumo-prediction-card {
        background: linear-gradient(135deg, #1a1a1a 0%, #242424 100%);
        border-radius: 12px;
        padding: 24px;
        margin-bottom: 20px;
        border: 1px solid #303030;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
    }

    .lumo-prediction-title {
        font-size: 16px;
        font-weight: 700;
        color: #ffffff;
        margin-bottom: 16px;
    }

    .lumo-prediction-content {
        display: flex;
        align-items: center;
        gap: 16px;
    }

    .lumo-prediction-icon {
        font-size: 48px;
        filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.3));
    }

    .lumo-prediction-text {
        flex: 1;
        font-size: 15px;
        color: #cccccc;
        line-height: 1.6;
        font-weight: 500;
    }

    @media (max-width: 768px) {
        .lumo-stats-grid {
            grid-template-columns: repeat(2, 1fr);
        }

        .lumo-detail-grid {
            grid-template-columns: 1fr;
        }

        .lumo-modal-content {
            width: 96%;
            padding: 20px;
        }

        .lumo-chart-canvas {
            height: 240px;
        }

        .lumo-metrics-row {
            grid-template-columns: 1fr;
        }

        .lumo-performance-grid {
            grid-template-columns: 1fr;
        }

        .lumo-compare-grid {
            grid-template-columns: 1fr;
        }
    }
`;
document.head.appendChild(style);

const countryFlags = {
    'Россия': 'https://flagcdn.com/w80/ru.png',
    'США': 'https://flagcdn.com/w80/us.png',
    'Украина': 'https://flagcdn.com/w80/ua.png',
    'Беларусь': 'https://flagcdn.com/w80/by.png',
    'Казахстан': 'https://flagcdn.com/w80/kz.png',
    'Германия': 'https://flagcdn.com/w80/de.png',
    'Франция': 'https://flagcdn.com/w80/fr.png',
    'Великобритания': 'https://flagcdn.com/w80/gb.png',
    'Канада': 'https://flagcdn.com/w80/ca.png',
    'Австралия': 'https://flagcdn.com/w80/au.png'
};

const dayNames = ['Вс', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'];

let cachedData = null;
let isAnalyzing = false;
let chartData = null;
let liveUpdateInterval = null;
let currentMode = 'videos';
let viewerHistory = [];
let maxHistoryLength = 120;

function createElement(tag, className, text) {
    const el = document.createElement(tag);
    if (className) el.className = className;
    if (text) el.textContent = text;
    return el;
}

function parseViews(text) {
    if (!text) return 0;
    const cleanText = text.replace(/\s/g, '').replace(/&nbsp;/g, '').toLowerCase();
    const num = parseFloat(cleanText.replace(',', '.'));
    if (cleanText.includes('млн')) return num * 1000000;
    if (cleanText.includes('тыс')) return num * 1000;
    return num || 0;
}

function parseDuration(text) {
    if (!text) return 0;
    const parts = text.trim().split(':').map(p => parseInt(p) || 0);
    if (parts.length === 3) return parts[0] * 3600 + parts[1] * 60 + parts[2];
    if (parts.length === 2) return parts[0] * 60 + parts[1];
    return parts[0] || 0;
}

function parseRelativeDate(text) {
    if (!text) return null;
    const now = new Date();
    const lowerText = text.toLowerCase();

    if (lowerText.includes('час')) {
        const hours = parseInt(text) || 1;
        return new Date(now - hours * 3600000);
    }
    if (lowerText.includes('день') || lowerText.includes('дня') || lowerText.includes('дней')) {
        const days = parseInt(text) || 1;
        return new Date(now - days * 86400000);
    }
    if (lowerText.includes('недел')) {
        const weeks = parseInt(text) || 1;
        return new Date(now - weeks * 604800000);
    }
    if (lowerText.includes('месяц')) {
        const months = parseInt(text) || 1;
        return new Date(now - months * 2592000000);
    }
    if (lowerText.includes('год') || lowerText.includes('лет')) {
        const years = parseInt(text) || 1;
        return new Date(now - years * 31536000000);
    }

    return null;
}

function formatNumber(num) {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + ' млн';
    if (num >= 1000) return (num / 1000).toFixed(1) + ' тыс';
    return Math.floor(num).toLocaleString('ru-RU');
}

function formatTime(seconds) {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = Math.floor(seconds % 60);
    if (h > 0) return `${h}ч ${m}м`;
    if (m > 0) return `${m}м ${s}с`;
    return `${s}с`;
}

function formatVideosPerWeek(num) {
    if (num < 0.5) return '< 1/мес';
    if (num < 1) return `${Math.round(num * 4)}/мес`;
    return `~${Math.round(num)}/нед`;
}

function getCountryFromAbout() {
    const metadataRenderer = document.querySelector('ytd-channel-about-metadata-renderer, ytd-about-channel-renderer');
    if (!metadataRenderer) return null;

    const rows = metadataRenderer.querySelectorAll('tr');
    for (const row of rows) {
        const cells = row.querySelectorAll('td');
        if (cells.length === 2) {
            const labelText = cells[0].textContent.trim().toLowerCase();
            if (labelText === 'location' || labelText === 'местоположение') {
                return cells[1].textContent.trim();
            }
        }
    }

    for (const row of rows) {
        const cells = row.querySelectorAll('td');
        if (cells.length === 2) {
            const potentialCountry = cells[1].textContent.trim();
            if (countryFlags.hasOwnProperty(potentialCountry)) {
                return potentialCountry;
            }
        }
    }

    return null;
}

function getVideosFromPage() {
    const videos = document.querySelectorAll('ytd-rich-item-renderer, ytd-grid-video-renderer');
    const data = [];

    videos.forEach(video => {
        if (video.querySelector('ytd-thumbnail-overlay-time-status-renderer[overlay-style="SHORTS"]')) {
            return;
        }

        const metadataLine = video.querySelector('#metadata-line');
        const durationEl = video.querySelector('ytd-thumbnail-overlay-time-status-renderer #text, ytd-thumbnail-overlay-time-status-renderer .yt-badge-shape__text');
        if (!metadataLine || !durationEl) return;

        const metaItems = metadataLine.querySelectorAll('span.inline-metadata-item');
        if (metaItems.length < 2) return;

        const viewsText = metaItems[0].textContent;
        const dateText = metaItems[1].textContent;
        const durationText = durationEl.textContent.trim();

        const parsedDate = parseRelativeDate(dateText);
        const parsedViews = parseViews(viewsText);
        const parsedDuration = parseDuration(durationText);

        if (parsedViews > 0 && parsedDate && parsedDuration > 0) {
            data.push({
                views: parsedViews,
                date: parsedDate,
                duration: parsedDuration
            });
        }
    });
    return data;
}

function getShortsFromPage() {
    const data = [];

    document.querySelectorAll('ytd-rich-item-renderer').forEach(item => {
        const viewsEl = item.querySelector('.shortsLockupViewModelHostOutsideMetadataSubhead .yt-core-attributed-string');
        if (viewsEl) {
            const parsedViews = parseViews(viewsEl.textContent);
            if (parsedViews > 0) {
                data.push({ views: parsedViews });
            }
        }
    });

    document.querySelectorAll('ytd-reel-item-renderer').forEach(item => {
        const viewsEl = item.querySelector('#video-info');
        if (viewsEl) {
            const parsedViews = parseViews(viewsEl.textContent);
            if (parsedViews > 0) {
                data.push({ views: parsedViews });
            }
        }
    });

    return data;
}

function getStreamsFromPage() {
    const streams = document.querySelectorAll('ytd-rich-item-renderer');
    const data = {
        liveNow: [],
        pastStreams: []
    };

    streams.forEach(stream => {
        const metadataLine = stream.querySelector('#metadata-line');
        if (!metadataLine) return;

        const metaItems = metadataLine.querySelectorAll('span.inline-metadata-item');
        const isLive = stream.querySelector('ytd-thumbnail-overlay-time-status-renderer[overlay-style="LIVE"]');

        if (isLive) {
            let viewers = 0;
            metaItems.forEach(item => {
                const text = item.textContent.trim();
                if (text.includes('Зрителей:')) {
                    viewers = parseInt(text.replace(/\D/g, '')) || 0;
                }
            });

            if (viewers > 0) {
                data.liveNow.push({ viewers });
            }
        } else {
            if (metaItems.length >= 2) {
                const viewsText = metaItems[0].textContent;
                const dateText = metaItems[1].textContent;

                if (dateText.includes('Трансляция закончилась')) {
                    const parsedViews = parseViews(viewsText);
                    const parsedDate = parseRelativeDate(dateText);

                    if (parsedViews > 0 && parsedDate) {
                        data.pastStreams.push({
                            views: parsedViews,
                            date: parsedDate
                        });
                    }
                }
            }
        }
    });

    return data;
}

function getLiveViewers() {
    const ariaLabel = document.querySelector('#view-count[aria-label]');
    if (ariaLabel) {
        const label = ariaLabel.getAttribute('aria-label');
        const match = label.match(/(\d+)/);
        if (match) {
            return parseInt(match[1]) || 0;
        }
    }

    const viewCountEl = document.querySelector('ytd-watch-info-text #view-count');
    if (!viewCountEl) return 0;

    const text = viewCountEl.textContent.trim();
    const match = text.match(/(\d+)/);
    if (match) {
        return parseInt(match[1]) || 0;
    }

    return 0;
}

function analyzeVideos(videosData) {
    if (!videosData || videosData.length === 0) {
        return {
            totalVideos: 0,
            totalViews: 0,
            avgViews: 0,
            avgDuration: 0,
            videosPerWeek: 0,
            mostActiveDay: 0,
            dayDistribution: [0, 0, 0, 0, 0, 0, 0],
            totalDays: 0,
            recentAvgViews: 0,
            oldAvgViews: 0,
            avgInterval: 0,
            shortVideos: 0,
            mediumVideos: 0,
            longVideos: 0,
            topViews: 0,
            lowViews: 0,
            viewsArray: [],
            viewsTrend: [],
            consistency: 0,
            growthRate: 0,
            volatility: 0,
            momentum: 0,
            daysSinceLastVideo: 0,
            channelHealth: 0
        };
    }

    let totalViews = 0;
    let totalDuration = 0;
    let count = 0;
    let dates = [];
    let dayDistribution = [0, 0, 0, 0, 0, 0, 0];
    let shortVideos = 0;
    let mediumVideos = 0;
    let longVideos = 0;
    let viewsArray = [];

    videosData.forEach(video => {
        if (video.views > 0) {
            totalViews += video.views;
            viewsArray.push(video.views);
            count++;
        }

        if (video.duration > 0) {
            totalDuration += video.duration;

            if (video.duration < 300) shortVideos++;
            else if (video.duration < 1200) mediumVideos++;
            else longVideos++;
        }

        if (video.date) {
            dates.push(video.date);
            dayDistribution[video.date.getDay()]++;
        }
    });

    viewsArray.sort((a, b) => b - a);
    dates.sort((a, b) => b - a);

    const halfCount = Math.floor(count / 2);
    const quarterCount = Math.floor(count / 4);
    let recentViews = 0;
    let oldViews = 0;
    let veryRecentViews = 0;

    for (let i = 0; i < count; i++) {
        if (i < quarterCount) veryRecentViews += viewsArray[i];
        if (i < halfCount) recentViews += viewsArray[i];
        else oldViews += viewsArray[i];
    }

    let videosPerWeek = 0;
    let avgInterval = 0;
    let daysSinceLastVideo = 0;

    if (dates.length > 1) {
        const oldestDate = dates[dates.length - 1];
        const newestDate = dates[0];
        const daysDiff = Math.max(1, (newestDate - oldestDate) / 86400000);
        const weeks = daysDiff / 7;
        videosPerWeek = weeks > 0 ? dates.length / weeks : 0;

        daysSinceLastVideo = Math.floor((new Date() - newestDate) / 86400000);

        let intervals = [];
        for (let i = 0; i < dates.length - 1; i++) {
            const interval = (dates[i] - dates[i + 1]) / 86400000;
            intervals.push(interval);
        }
        avgInterval = intervals.length > 0 ? intervals.reduce((a, b) => a + b, 0) / intervals.length : 0;
    } else if (dates.length === 1) {
        daysSinceLastVideo = Math.floor((new Date() - dates[0]) / 86400000);
    }

    const mostActiveDay = dayDistribution.indexOf(Math.max(...dayDistribution));
    const topViews = viewsArray.length > 0 ? viewsArray[0] : 0;
    const lowViews = viewsArray.length > 0 ? viewsArray[viewsArray.length - 1] : 0;

    const avgViews = count > 0 ? totalViews / count : 0;
    const stdDev = count > 0 ? Math.sqrt(viewsArray.reduce((sum, v) => sum + Math.pow(v - avgViews, 2), 0) / count) : 0;
    const consistency = avgViews > 0 ? (1 - (stdDev / avgViews)) * 100 : 0;

    const recentAvg = halfCount > 0 ? recentViews / halfCount : 0;
    const oldAvg = (count - halfCount) > 0 ? oldViews / (count - halfCount) : 0;
    const veryRecentAvg = quarterCount > 0 ? veryRecentViews / quarterCount : 0;

    let growthRate = oldAvg > 0 ? ((recentAvg - oldAvg) / oldAvg) * 100 : 0;
    const momentum = recentAvg > 0 ? ((veryRecentAvg - recentAvg) / recentAvg) * 100 : 0;
    const volatility = avgViews > 0 ? (stdDev / avgViews) * 100 : 0;

    if (daysSinceLastVideo > 60) {
        growthRate -= 30;
    } else if (daysSinceLastVideo > 30) {
        growthRate -= 15;
    } else if (daysSinceLastVideo > 14) {
        growthRate -= 5;
    }

    if (videosPerWeek < 0.3) {
        growthRate -= 20;
    } else if (videosPerWeek < 0.5) {
        growthRate -= 10;
    }

    const viewsTrend = viewsArray.slice(0, Math.min(30, viewsArray.length)).reverse();

    let channelHealth = 50;
    if (consistency > 60) channelHealth += 15;
    else if (consistency < 30) channelHealth -= 15;

    if (growthRate > 20) channelHealth += 20;
    else if (growthRate < -20) channelHealth -= 20;

    if (videosPerWeek >= 2) channelHealth += 15;
    else if (videosPerWeek < 0.5) channelHealth -= 15;

    if (daysSinceLastVideo > 30) channelHealth -= 20;

    channelHealth = Math.max(0, Math.min(100, channelHealth));

    return {
        totalVideos: count,
        totalViews,
        avgViews,
        avgDuration: count > 0 ? totalDuration / count : 0,
        videosPerWeek,
        mostActiveDay,
        dayDistribution,
        totalDays: dates.length > 1 ? (dates[0] - dates[dates.length - 1]) / 86400000 : 0,
        recentAvgViews: recentAvg,
        oldAvgViews: oldAvg,
        avgInterval,
        shortVideos,
        mediumVideos,
        longVideos,
        topViews,
        lowViews,
        viewsArray,
        viewsTrend,
        consistency: Math.max(0, Math.min(100, consistency)),
        growthRate,
        volatility,
        momentum,
        daysSinceLastVideo,
        channelHealth
    };
}

function analyzeShortsData(shortsData) {
    if (!shortsData || shortsData.length === 0) {
        return {
            totalShorts: 0,
            totalViews: 0,
            avgViews: 0,
            topViews: 0,
            lowViews: 0,
            viewsArray: [],
            consistency: 0,
            volatility: 0
        };
    }

    let totalViews = 0;
    let count = 0;
    let viewsArray = [];

    shortsData.forEach(short => {
        if (short.views > 0) {
            totalViews += short.views;
            viewsArray.push(short.views);
            count++;
        }
    });

    viewsArray.sort((a, b) => b - a);

    const avgViews = count > 0 ? totalViews / count : 0;
    const stdDev = count > 0 ? Math.sqrt(viewsArray.reduce((sum, v) => sum + Math.pow(v - avgViews, 2), 0) / count) : 0;
    const consistency = avgViews > 0 ? (1 - (stdDev / avgViews)) * 100 : 0;
    const volatility = avgViews > 0 ? (stdDev / avgViews) * 100 : 0;

    return {
        totalShorts: count,
        totalViews,
        avgViews,
        topViews: viewsArray.length > 0 ? viewsArray[0] : 0,
        lowViews: viewsArray.length > 0 ? viewsArray[viewsArray.length - 1] : 0,
        viewsArray,
        consistency: Math.max(0, Math.min(100, consistency)),
        volatility
    };
}

function analyzeStreamsData(streamsData) {
    const stats = {
        liveCount: streamsData.liveNow.length,
        currentViewers: 0,
        pastStreamsCount: streamsData.pastStreams.length,
        avgViews: 0,
        totalViews: 0,
        topViews: 0,
        lowViews: 0
    };

    if (streamsData.liveNow.length > 0) {
        stats.currentViewers = streamsData.liveNow.reduce((sum, s) => sum + s.viewers, 0);
    }

    if (streamsData.pastStreams.length > 0) {
        const views = streamsData.pastStreams.map(s => s.views);
        stats.totalViews = views.reduce((sum, v) => sum + v, 0);
        stats.avgViews = stats.totalViews / views.length;
        stats.topViews = Math.max(...views);
        stats.lowViews = Math.min(...views);
    }

    return stats;
}

function createStatCardElement(label, value, icon) {
    const card = createElement('div', 'lumo-stat-card');
    const labelEl = createElement('div', 'lumo-stat-label', label);
    const valueEl = createElement('div', 'lumo-stat-value');
    const iconEl = createElement('span', 'lumo-stat-icon', icon);
    const textEl = createElement('span', '', value);

    valueEl.appendChild(iconEl);
    valueEl.appendChild(textEl);
    card.appendChild(labelEl);
    card.appendChild(valueEl);

    return card;
}

function createDetailCardElement(title, value, subtitle) {
    const card = createElement('div', 'lumo-detail-card');
    const titleEl = createElement('div', 'lumo-detail-card-title', title);
    const valueEl = createElement('div', 'lumo-detail-card-value', value);
    const subEl = createElement('div', 'lumo-detail-card-subtitle', subtitle);

    card.appendChild(titleEl);
    card.appendChild(valueEl);
    card.appendChild(subEl);

    return card;
}

function createCountryCard(country) {
    const card = createElement('div', 'lumo-detail-card');
    const titleEl = createElement('div', 'lumo-detail-card-title', 'Страна');
    const info = createElement('div', 'lumo-country-info');
    const flag = document.createElement('img');
    flag.className = 'lumo-country-flag';
    flag.src = countryFlags[country] || 'https://flagcdn.com/w80/ru.png';
    flag.onerror = () => flag.style.display = 'none';
    const name = createElement('span', 'lumo-country-name', country);

    info.appendChild(flag);
    info.appendChild(name);
    card.appendChild(titleEl);
    card.appendChild(info);

    return card;
}

function drawLineChart(canvas, data, color = '#ff0000') {
    if (!canvas || !data || data.length === 0) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();

    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);

    const width = rect.width;
    const height = rect.height;
    const padding = 40;

    ctx.clearRect(0, 0, width, height);

    if (data.length === 1) {
        const value = data[0];
        ctx.fillStyle = color;
        ctx.font = 'bold 24px Roboto';
        ctx.textAlign = 'center';
        ctx.fillText(formatNumber(value), width / 2, height / 2);
        return;
    }

    const max = Math.max(...data);
    const min = Math.min(...data);
    const range = max - min || 1;

    const stepX = (width - padding * 2) / (data.length - 1);
    const stepY = (height - padding * 2) / range;

    ctx.strokeStyle = '#303030';
    ctx.lineWidth = 1;
    for (let i = 0; i <= 5; i++) {
        const y = padding + (height - padding * 2) * i / 5;
        ctx.beginPath();
        ctx.moveTo(padding, y);
        ctx.lineTo(width - padding, y);
        ctx.stroke();
    }

    ctx.strokeStyle = '#303030';
    const xSteps = Math.min(10, data.length);
    for (let i = 0; i < data.length; i += Math.max(1, Math.floor(data.length / xSteps))) {
        const x = padding + i * stepX;
        ctx.beginPath();
        ctx.moveTo(x, padding);
        ctx.lineTo(x, height - padding);
        ctx.stroke();
    }

    const gradient = ctx.createLinearGradient(0, padding, 0, height - padding);
    gradient.addColorStop(0, color);
    gradient.addColorStop(1, color + 'CC');

    ctx.beginPath();
    data.forEach((value, index) => {
        const x = padding + index * stepX;
        const y = height - padding - (value - min) * stepY;

        if (index === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
    });
    ctx.strokeStyle = gradient;
    ctx.lineWidth = 3;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.stroke();

    ctx.lineTo(width - padding, height - padding);
    ctx.lineTo(padding, height - padding);
    ctx.closePath();

    const fillGradient = ctx.createLinearGradient(0, padding, 0, height - padding);
    fillGradient.addColorStop(0, color + '40');
    fillGradient.addColorStop(1, color + '08');
    ctx.fillStyle = fillGradient;
    ctx.fill();

    data.forEach((value, index) => {
        const x = padding + index * stepX;
        const y = height - padding - (value - min) * stepY;

        ctx.beginPath();
        ctx.arc(x, y, 6, 0, Math.PI * 2);
        ctx.fillStyle = color;
        ctx.fill();
        ctx.strokeStyle = '#0f0f0f';
        ctx.lineWidth = 2;
        ctx.stroke();
    });

    chartData = { data, padding, stepX, stepY, min, height, width };
}

function setupChartTooltip(canvas, wrapper) {
    const tooltip = createElement('div', 'lumo-chart-tooltip');
    document.body.appendChild(tooltip);

    canvas.addEventListener('mousemove', (e) => {
        if (!chartData) return;

        const rect = canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const { data, padding, stepX, stepY, min, height } = chartData;

        let closestIndex = -1;
        let closestDistance = Infinity;

        data.forEach((value, index) => {
            const pointX = padding + index * stepX;
            const pointY = height - padding - (value - min) * stepY;
            const distance = Math.sqrt(Math.pow(x - pointX, 2) + Math.pow(y - pointY, 2));

            if (distance < closestDistance && distance < 25) {
                closestDistance = distance;
                closestIndex = index;
            }
        });

        if (closestIndex !== -1) {
            const value = data[closestIndex];
            let label;
            if (currentMode === 'videos') {
                label = `Видео ${data.length - closestIndex}`;
            } else if (currentMode === 'shorts') {
                label = `Shorts ${data.length - closestIndex}`;
            } else if (currentMode === 'live') {
                const timeAgo = (data.length - closestIndex) * 3;
                label = `${timeAgo} сек назад`;
            } else {
                label = `Точка ${closestIndex + 1}`;
            }

            tooltip.textContent = '';
            const labelDiv = createElement('div', 'lumo-chart-tooltip-label', label);
            const valueDiv = createElement('div', 'lumo-chart-tooltip-value', currentMode === 'live' ? `${value} зрителей` : `${formatNumber(value)} просмотров`);
            tooltip.appendChild(labelDiv);
            tooltip.appendChild(valueDiv);

            let tooltipX = e.clientX + 15;
            let tooltipY = e.clientY - 45;

            const tooltipRect = tooltip.getBoundingClientRect();
            const viewportWidth = window.innerWidth;
            const viewportHeight = window.innerHeight;

            if (tooltipX + tooltipRect.width > viewportWidth - 10) {
                tooltipX = e.clientX - tooltipRect.width - 15;
            }

            if (tooltipY < 10) {
                tooltipY = e.clientY + 15;
            }

            if (tooltipY + tooltipRect.height > viewportHeight - 10) {
                tooltipY = viewportHeight - tooltipRect.height - 10;
            }

            tooltip.style.left = tooltipX + 'px';
            tooltip.style.top = tooltipY + 'px';
            tooltip.classList.add('visible');
        } else {
            tooltip.classList.remove('visible');
        }
    });

    canvas.addEventListener('mouseleave', () => {
        tooltip.classList.remove('visible');
    });
}

function getDetailedTrendStatus(stats) {
    const { growthRate, consistency, momentum, volatility, videosPerWeek, avgInterval, daysSinceLastVideo } = stats;

    const stabilityBonus = consistency > 60 ? 1.25 : consistency < 30 ? 0.75 : 1;
    let adjustedGrowth = growthRate * stabilityBonus;

    const isAbandoned = daysSinceLastVideo > 90;
    const isInactive = daysSinceLastVideo > 45 || videosPerWeek < 0.3;
    const isLowActivity = videosPerWeek < 0.8 && !isInactive;

    if (isAbandoned) {
        return {
            status: 'critical-decline',
            icon: '💀',
            text: 'Канал заброшен',
            desc: 'Очень давно не было публикаций, канал неактивен',
            level: 0
        };
    }

    if (isInactive && avgInterval > 40) {
        return {
            status: 'stagnant',
            icon: '⏸',
            text: 'Застой',
            desc: 'Канал публикует редко, активность на низком уровне',
            level: 1
        };
    }

    if (isLowActivity && adjustedGrowth < 5) {
        adjustedGrowth *= 0.6;
    }

    if (adjustedGrowth > 120 && momentum > 40 && videosPerWeek >= 2) {
        return {
            status: 'explosive-growth',
            icon: '🚀',
            text: 'Взрывной рост',
            desc: 'Невероятная динамика! Канал стремительно набирает обороты',
            level: 10
        };
    } else if (adjustedGrowth > 70 && consistency > 55 && videosPerWeek >= 1.5) {
        return {
            status: 'strong-growth',
            icon: '📈',
            text: 'Сильный рост',
            desc: 'Канал активно развивается со стабильными показателями',
            level: 9
        };
    } else if (adjustedGrowth > 45 && videosPerWeek >= 1) {
        return {
            status: 'strong-growth',
            icon: '📊',
            text: 'Активный рост',
            desc: 'Отличная положительная динамика развития канала',
            level: 8
        };
    } else if (adjustedGrowth > 25) {
        return {
            status: 'moderate-growth',
            icon: '↗',
            text: 'Умеренный рост',
            desc: 'Стабильное развитие с хорошими показателями',
            level: 7
        };
    } else if (adjustedGrowth > 12) {
        return {
            status: 'moderate-growth',
            icon: '↗',
            text: 'Рост выше среднего',
            desc: 'Канал растет, показатели постепенно улучшаются',
            level: 6
        };
    } else if (adjustedGrowth > 3) {
        return {
            status: 'slight-growth',
            icon: '→',
            text: 'Небольшой рост',
            desc: 'Слабая положительная динамика, рост медленный',
            level: 5
        };
    } else if (adjustedGrowth >= -8) {
        return {
            status: 'stable',
            icon: '━',
            text: 'Стабильно',
            desc: 'Показатели держатся примерно на одном уровне',
            level: 4
        };
    } else if (adjustedGrowth >= -20) {
        return {
            status: 'slight-decline',
            icon: '↘',
            text: 'Небольшое снижение',
            desc: 'Показатели немного падают, требуется внимание',
            level: 3
        };
    } else if (adjustedGrowth >= -40) {
        return {
            status: 'moderate-decline',
            icon: '📉',
            text: 'Умеренный спад',
            desc: 'Заметное снижение показателей, нужны изменения',
            level: 2
        };
    } else if (adjustedGrowth >= -65) {
        return {
            status: 'strong-decline',
            icon: '⬇',
            text: 'Сильный спад',
            desc: 'Серьезное падение популярности канала',
            level: 1
        };
    } else {
        return {
            status: 'critical-decline',
            icon: '⚠',
            text: 'Критический спад',
            desc: 'Катастрофическое падение показателей',
            level: 0
        };
    }
}

function getPerformanceScore(value, thresholds) {
    if (value >= thresholds.excellent) return { score: 'A+', class: 'excellent', percent: 100 };
    if (value >= thresholds.good) return { score: 'A', class: 'good', percent: 88 };
    if (value >= thresholds.average) return { score: 'B', class: 'average', percent: 72 };
    if (value >= thresholds.poor) return { score: 'C', class: 'poor', percent: 55 };
    return { score: 'D', class: 'bad', percent: 35 };
}

function createHealthIndicator(health) {
    const indicator = createElement('div', 'lumo-health-indicator');
    const title = createElement('div', 'lumo-health-title', 'Здоровье канала');
    const bar = createElement('div', 'lumo-health-bar');
    const fill = createElement('div', 'lumo-health-fill');

    let color;
    let statusText;
    if (health >= 80) {
        color = '#00ff88';
        statusText = 'Отличное';
    } else if (health >= 60) {
        color = '#66ffaa';
        statusText = 'Хорошее';
    } else if (health >= 40) {
        color = '#ffbb33';
        statusText = 'Среднее';
    } else if (health >= 20) {
        color = '#ff9966';
        statusText = 'Слабое';
    } else {
        color = '#ff4444';
        statusText = 'Критическое';
    }

    fill.style.background = `linear-gradient(90deg, ${color}, ${color}CC)`;
    fill.style.width = '0%';

    bar.appendChild(fill);

    const label = createElement('div', 'lumo-health-label', `${statusText} • ${health}%`);

    indicator.appendChild(title);
    indicator.appendChild(bar);
    indicator.appendChild(label);

    requestAnimationFrame(() => {
        fill.style.width = health + '%';
    });

    return indicator;
}

function createPredictionCard(stats) {
    const card = createElement('div', 'lumo-prediction-card');
    const title = createElement('div', 'lumo-prediction-title', 'Прогноз');
    const content = createElement('div', 'lumo-prediction-content');

    let icon, text;

    if (stats.daysSinceLastVideo > 60) {
        icon = '⏰';
        text = 'Канал давно не публикует. Рекомендуется возобновить активность в ближайшее время.';
    } else if (stats.avgInterval > 0 && stats.avgInterval < 30) {
        const nextDays = Math.round(stats.avgInterval);
        icon = '📅';
        text = `Следующее видео ожидается примерно через ${nextDays} ${nextDays === 1 ? 'день' : nextDays < 5 ? 'дня' : 'дней'}.`;
    } else if (stats.momentum > 20) {
        icon = '⚡';
        text = 'Канал набирает обороты! Продолжайте в том же духе для максимального роста.';
    } else if (stats.growthRate < -20) {
        icon = '💡';
        text = 'Показатели падают. Рекомендуется пересмотреть контент-стратегию.';
    } else if (stats.consistency > 70) {
        icon = '✨';
        text = 'Отличная стабильность! Аудитория знает, чего ожидать от канала.';
    } else {
        icon = '📊';
        text = 'Стабильное развитие. Для роста рекомендуется увеличить частоту публикаций.';
    }

    const iconEl = createElement('div', 'lumo-prediction-icon', icon);
    const textEl = createElement('div', 'lumo-prediction-text', text);

    content.appendChild(iconEl);
    content.appendChild(textEl);
    card.appendChild(title);
    card.appendChild(content);

    return card;
}

function createModal() {
    const modal = createElement('div', 'lumo-modal');
    const content = createElement('div', 'lumo-modal-content');

    const header = createElement('div', 'lumo-modal-header');
    const title = createElement('div', 'lumo-modal-title', '▣ Подробная аналитика');
    const closeBtn = createElement('button', 'lumo-modal-close', '✕');

    closeBtn.addEventListener('click', () => modal.classList.remove('active'));

    header.appendChild(title);
    header.appendChild(closeBtn);

    const tabs = createElement('div', 'lumo-tabs');

    let tabData = [];
    if (currentMode === 'videos') {
        tabData = [
            { name: 'overview', label: 'Обзор' },
            { name: 'trends', label: 'Тренды' },
            { name: 'frequency', label: 'Частота' },
            { name: 'days', label: 'Дни недели' },
            { name: 'compare', label: 'Сравнение' },
            { name: 'performance', label: 'Оценка' }
        ];
    } else if (currentMode === 'shorts') {
        tabData = [
            { name: 'overview', label: 'Обзор' },
            { name: 'trends', label: 'Тренды' }
        ];
    } else if (currentMode === 'streams') {
        tabData = [
            { name: 'overview', label: 'Обзор' },
            { name: 'live', label: 'Текущие' }
        ];
    }

    const tabContents = {};

    tabData.forEach((tab, index) => {
        const button = createElement('button', index === 0 ? 'lumo-tab active' : 'lumo-tab', tab.label);
        button.dataset.tab = tab.name;
        tabs.appendChild(button);

        const tabContent = createElement('div', index === 0 ? 'lumo-tab-content active' : 'lumo-tab-content');
        tabContent.dataset.content = tab.name;
        tabContents[tab.name] = tabContent;
    });

    content.appendChild(header);
    content.appendChild(tabs);

    Object.values(tabContents).forEach(tc => content.appendChild(tc));

    const author = createElement('div', 'lumo-author', 'Created by lumo');
    content.appendChild(author);

    modal.appendChild(content);
    document.body.appendChild(modal);

    modal.addEventListener('click', (e) => {
        if (e.target === modal) modal.classList.remove('active');
    });

    tabs.querySelectorAll('.lumo-tab').forEach(tab => {
        tab.addEventListener('click', () => {
            const tabName = tab.dataset.tab;
            modal.querySelectorAll('.lumo-tab').forEach(t => t.classList.remove('active'));
            modal.querySelectorAll('.lumo-tab-content').forEach(c => c.classList.remove('active'));
            tab.classList.add('active');
            modal.querySelector(`[data-content="${tabName}"]`).classList.add('active');
        });
    });

    return modal;
}

function forceYouTubeResize() {
    window.dispatchEvent(new Event('resize'));
    requestAnimationFrame(() => {
        window.dispatchEvent(new Event('resize'));
    });

    const ytdApp = document.querySelector('ytd-app');
    if (ytdApp && ytdApp.__dataHost) {
        ytdApp.__dataHost.notifyResize();
    }
}

async function showDetailedStats() {
    if (isAnalyzing) return;
    isAnalyzing = true;

    let modal = document.querySelector('.lumo-modal');
    if (!modal) {
        modal = createModal();
    }

    let stats, data;

    if (currentMode === 'videos') {
        data = getVideosFromPage();
        stats = analyzeVideos(data);
    } else if (currentMode === 'shorts') {
        data = getShortsFromPage();
        stats = analyzeShortsData(data);
    } else if (currentMode === 'streams') {
        data = getStreamsFromPage();
        stats = analyzeStreamsData(data);
    }

    const country = getCountryFromAbout();

    const overviewContent = modal.querySelector('[data-content="overview"]');
    const trendsContent = modal.querySelector('[data-content="trends"]');
    const frequencyContent = modal.querySelector('[data-content="frequency"]');
    const daysContent = modal.querySelector('[data-content="days"]');
    const compareContent = modal.querySelector('[data-content="compare"]');
    const performanceContent = modal.querySelector('[data-content="performance"]');

    if (overviewContent) {
        overviewContent.textContent = '';

        if (currentMode === 'videos' && stats.channelHealth !== undefined) {
            overviewContent.appendChild(createHealthIndicator(stats.channelHealth));
            overviewContent.appendChild(createPredictionCard(stats));
        }

        const overviewGrid = createElement('div', 'lumo-detail-grid');

        if (currentMode === 'videos') {
            overviewGrid.appendChild(createDetailCardElement('Средние просмотры', formatNumber(stats.avgViews), 'на видео'));
            overviewGrid.appendChild(createDetailCardElement('Всего просмотров', formatNumber(stats.totalViews), 'на странице'));
            overviewGrid.appendChild(createDetailCardElement('Средняя длительность', formatTime(stats.avgDuration), 'видео'));
            overviewGrid.appendChild(createDetailCardElement('Частота', formatVideosPerWeek(stats.videosPerWeek), 'публикаций'));
            overviewGrid.appendChild(createDetailCardElement('Топ видео', formatNumber(stats.topViews), 'просмотров'));
            overviewGrid.appendChild(createDetailCardElement('Низ видео', formatNumber(stats.lowViews), 'просмотров'));
        } else if (currentMode === 'shorts') {
            overviewGrid.appendChild(createDetailCardElement('Всего Shorts', stats.totalShorts.toString(), 'на странице'));
            overviewGrid.appendChild(createDetailCardElement('Средние просмотры', formatNumber(stats.avgViews), 'на shorts'));
            overviewGrid.appendChild(createDetailCardElement('Всего просмотров', formatNumber(stats.totalViews), 'общие'));
            overviewGrid.appendChild(createDetailCardElement('Топ Shorts', formatNumber(stats.topViews), 'просмотров'));
            overviewGrid.appendChild(createDetailCardElement('Низ Shorts', formatNumber(stats.lowViews), 'просмотров'));
            overviewGrid.appendChild(createDetailCardElement('Стабильность', stats.consistency.toFixed(0) + '%', 'консистентность'));
        } else if (currentMode === 'streams') {
            overviewGrid.appendChild(createDetailCardElement('Активные стримы', stats.liveCount.toString(), 'сейчас в эфире'));
            overviewGrid.appendChild(createDetailCardElement('Текущие зрители', stats.currentViewers.toString(), 'смотрят сейчас'));
            overviewGrid.appendChild(createDetailCardElement('Прошлых стримов', stats.pastStreamsCount.toString(), 'записей'));
            if (stats.pastStreamsCount > 0) {
                overviewGrid.appendChild(createDetailCardElement('Средние просмотры', formatNumber(stats.avgViews), 'на стрим'));
                overviewGrid.appendChild(createDetailCardElement('Топ стрим', formatNumber(stats.topViews), 'просмотров'));
            }
        }

        if (country) {
            overviewGrid.appendChild(createCountryCard(country));
        }
        overviewContent.appendChild(overviewGrid);
    }

    if (trendsContent) {
        trendsContent.textContent = '';

        if (currentMode === 'videos') {
            const trendInfo = getDetailedTrendStatus(stats);
            const trendIndicator = createElement('div', `lumo-trend-indicator ${trendInfo.status}`);
            const trendIcon = createElement('div', 'lumo-trend-icon', trendInfo.icon);
            const trendInfoDiv = createElement('div', 'lumo-trend-info');
            const trendStatus = createElement('div', `lumo-trend-status lumo-trend-${trendInfo.status.includes('growth') ? 'up' : trendInfo.status.includes('decline') || trendInfo.status === 'stagnant' ? 'down' : 'stable'}`, trendInfo.text);
            const trendDesc = createElement('div', 'lumo-trend-desc', trendInfo.desc);

            trendInfoDiv.appendChild(trendStatus);
            trendInfoDiv.appendChild(trendDesc);
            trendIndicator.appendChild(trendIcon);
            trendIndicator.appendChild(trendInfoDiv);
            trendsContent.appendChild(trendIndicator);

            const metricsRow = createElement('div', 'lumo-metrics-row');

            const growthCard = createElement('div', `lumo-metric-card ${stats.growthRate > 10 ? 'positive' : stats.growthRate < -10 ? 'negative' : 'neutral'}`);
            const growthLabel = createElement('div', 'lumo-metric-label', 'Динамика роста');
            const growthValue = createElement('div', `lumo-metric-value lumo-trend-${stats.growthRate > 0 ? 'up' : stats.growthRate < 0 ? 'down' : 'stable'}`, `${stats.growthRate > 0 ? '+' : ''}${stats.growthRate.toFixed(1)}%`);
            const growthChange = createElement('div', 'lumo-metric-change', stats.growthRate > 0 ? '↗ Новые видео лучше старых' : stats.growthRate < 0 ? '↘ Новые видео хуже старых' : '━ Стабильные показатели');
            growthCard.appendChild(growthLabel);
            growthCard.appendChild(growthValue);
            growthCard.appendChild(growthChange);

            const consistencyCard = createElement('div', `lumo-metric-card ${stats.consistency > 60 ? 'positive' : stats.consistency < 30 ? 'negative' : 'neutral'}`);
            const consistencyLabel = createElement('div', 'lumo-metric-label', 'Стабильность');
            const consistencyValue = createElement('div', `lumo-metric-value lumo-trend-${stats.consistency > 60 ? 'up' : stats.consistency < 30 ? 'down' : 'stable'}`, `${stats.consistency.toFixed(0)}%`);
            const consistencyChange = createElement('div', 'lumo-metric-change', stats.consistency > 60 ? '✓ Стабильный контент' : stats.consistency < 30 ? '⚠ Нестабильные просмотры' : '~ Средняя стабильность');
            consistencyCard.appendChild(consistencyLabel);
            consistencyCard.appendChild(consistencyValue);
            consistencyCard.appendChild(consistencyChange);

            const momentumCard = createElement('div', `lumo-metric-card ${stats.momentum > 10 ? 'positive' : stats.momentum < -10 ? 'negative' : 'neutral'}`);
            const momentumLabel = createElement('div', 'lumo-metric-label', 'Импульс');
            const momentumValue = createElement('div', `lumo-metric-value lumo-trend-${stats.momentum > 0 ? 'up' : stats.momentum < 0 ? 'down' : 'stable'}`, `${stats.momentum > 0 ? '+' : ''}${stats.momentum.toFixed(1)}%`);
            const momentumChange = createElement('div', 'lumo-metric-change', stats.momentum > 0 ? '↗ Ускорение роста' : stats.momentum < 0 ? '↘ Замедление' : '━ Равномерно');
            momentumCard.appendChild(momentumLabel);
            momentumCard.appendChild(momentumValue);
            momentumCard.appendChild(momentumChange);

            metricsRow.appendChild(growthCard);
            metricsRow.appendChild(consistencyCard);
            metricsRow.appendChild(momentumCard);
            trendsContent.appendChild(metricsRow);

            if (stats.viewsTrend && stats.viewsTrend.length > 0) {
                const wrapper = createElement('div', 'lumo-chart-wrapper');
                const canvas = document.createElement('canvas');
                canvas.className = 'lumo-chart-canvas';
                wrapper.appendChild(canvas);
                trendsContent.appendChild(wrapper);

                requestAnimationFrame(() => {
                    const trendLevel = trendInfo.level;
                    let color;
                    if (trendLevel >= 8) color = '#00ff88';
                    else if (trendLevel >= 6) color = '#66ffaa';
                    else if (trendLevel >= 5) color = '#99ffbb';
                    else if (trendLevel === 4) color = '#ffbb33';
                    else if (trendLevel === 3) color = '#ffaa99';
                    else if (trendLevel >= 1) color = '#ff6666';
                    else color = '#999999';

                    drawLineChart(canvas, stats.viewsTrend, color);
                    setupChartTooltip(canvas, wrapper);
                });
            }

            const detailGrid = createElement('div', 'lumo-detail-grid');
            detailGrid.appendChild(createDetailCardElement('Новые видео', formatNumber(stats.recentAvgViews), 'средние просмотры'));
            detailGrid.appendChild(createDetailCardElement('Старые видео', formatNumber(stats.oldAvgViews), 'средние просмотры'));
            detailGrid.appendChild(createDetailCardElement('Топ видео', formatNumber(stats.topViews), 'максимум просмотров'));
            detailGrid.appendChild(createDetailCardElement('Волатильность', stats.volatility.toFixed(1) + '%', 'изменчивость'));
            trendsContent.appendChild(detailGrid);
        } else if (currentMode === 'shorts') {
            if (stats.viewsArray && stats.viewsArray.length > 0) {
                const wrapper = createElement('div', 'lumo-chart-wrapper');
                const canvas = document.createElement('canvas');
                canvas.className = 'lumo-chart-canvas';
                wrapper.appendChild(canvas);
                trendsContent.appendChild(wrapper);

                requestAnimationFrame(() => {
                    const trendData = stats.viewsArray.slice(0, 30).reverse();
                    drawLineChart(canvas, trendData, '#ff4444');
                    setupChartTooltip(canvas, wrapper);
                });
            }

            const detailGrid = createElement('div', 'lumo-detail-grid');
            detailGrid.appendChild(createDetailCardElement('Всего Shorts', stats.totalShorts.toString(), 'на странице'));
            detailGrid.appendChild(createDetailCardElement('Средние просмотры', formatNumber(stats.avgViews), 'на shorts'));
            detailGrid.appendChild(createDetailCardElement('Топ Shorts', formatNumber(stats.topViews), 'максимум'));
            detailGrid.appendChild(createDetailCardElement('Низ Shorts', formatNumber(stats.lowViews), 'минимум'));
            trendsContent.appendChild(detailGrid);
        }
    }

    if (frequencyContent) {
        frequencyContent.textContent = '';
        if (currentMode === 'videos') {
            const frequencyGrid = createElement('div', 'lumo-detail-grid');
            frequencyGrid.appendChild(createDetailCardElement('Частота', formatVideosPerWeek(stats.videosPerWeek), 'публикаций'));
            frequencyGrid.appendChild(createDetailCardElement('Интервал', stats.avgInterval.toFixed(1), 'дней между видео'));
            frequencyGrid.appendChild(createDetailCardElement('Период анализа', Math.floor(stats.totalDays).toString(), 'дней'));
            frequencyGrid.appendChild(createDetailCardElement('Короткие', stats.shortVideos.toString(), '< 5 минут'));
            frequencyGrid.appendChild(createDetailCardElement('Средние', stats.mediumVideos.toString(), '5-20 минут'));
            frequencyGrid.appendChild(createDetailCardElement('Длинные', stats.longVideos.toString(), '> 20 минут'));
            frequencyContent.appendChild(frequencyGrid);
        }
    }

    if (daysContent) {
        daysContent.textContent = '';
        if (currentMode === 'videos' && stats.dayDistribution) {
            const maxCount = Math.max(...stats.dayDistribution);
            const dayDist = createElement('div', 'lumo-day-distribution');
            stats.dayDistribution.forEach((count, index) => {
                const isActive = index === stats.mostActiveDay && maxCount > 0;
                const dayItem = createElement('div', isActive ? 'lumo-day-item active' : 'lumo-day-item');
                const dayNameEl = createElement('div', 'lumo-day-name', dayNames[index]);
                const dayCountEl = createElement('div', 'lumo-day-count', count.toString());
                dayItem.appendChild(dayNameEl);
                dayItem.appendChild(dayCountEl);
                dayDist.appendChild(dayItem);
            });
            daysContent.appendChild(dayDist);

            const chartsContainer = document.createElement('div');
            chartsContainer.style.marginTop = '24px';
            stats.dayDistribution.forEach((count, index) => {
                const percentage = maxCount > 0 ? (count / maxCount) * 100 : 0;
                const bar = createElement('div', 'lumo-chart-bar');
                const label = createElement('div', 'lumo-chart-label');
                const labelName = createElement('span', '', dayNames[index]);
                const labelCount = createElement('span', '', `${count} видео`);
                label.appendChild(labelName);
                label.appendChild(labelCount);

                const bg = createElement('div', 'lumo-chart-bar-bg');
                const fill = createElement('div', 'lumo-chart-bar-fill');
                fill.style.width = '0%';

                bg.appendChild(fill);
                bar.appendChild(label);
                bar.appendChild(bg);
                chartsContainer.appendChild(bar);

                requestAnimationFrame(() => {
                    setTimeout(() => {
                        fill.style.width = percentage + '%';
                    }, index * 50);
                });
            });
            daysContent.appendChild(chartsContainer);
        }
    }

    if (compareContent) {
        compareContent.textContent = '';
        if (currentMode === 'videos') {
            const compareSection = createElement('div', 'lumo-compare-section');
            const compareTitle = createElement('div', 'lumo-compare-title', 'Сравнение периодов');
            const compareGrid = createElement('div', 'lumo-compare-grid');

            const recentColumn = createElement('div', 'lumo-compare-column');
            const recentTitle = createElement('div', 'lumo-compare-column-title', 'Новые видео');
            const recentValue = createElement('div', 'lumo-compare-value', formatNumber(stats.recentAvgViews));
            const diff = stats.recentAvgViews - stats.oldAvgViews;
            const diffPercent = stats.oldAvgViews > 0 ? ((diff / stats.oldAvgViews) * 100).toFixed(1) : 0;
            const recentDiff = createElement('div', `lumo-compare-diff ${diff >= 0 ? 'positive' : 'negative'}`,
                `${diff >= 0 ? '+' : ''}${diffPercent}%`);
            recentColumn.appendChild(recentTitle);
            recentColumn.appendChild(recentValue);
            recentColumn.appendChild(recentDiff);

            const oldColumn = createElement('div', 'lumo-compare-column');
            const oldTitle = createElement('div', 'lumo-compare-column-title', 'Старые видео');
            const oldValue = createElement('div', 'lumo-compare-value', formatNumber(stats.oldAvgViews));
            const oldDiff = createElement('div', 'lumo-compare-diff', 'Базовый уровень');
            oldColumn.appendChild(oldTitle);
            oldColumn.appendChild(oldValue);
            oldColumn.appendChild(oldDiff);

            compareGrid.appendChild(recentColumn);
            compareGrid.appendChild(oldColumn);
            compareSection.appendChild(compareTitle);
            compareSection.appendChild(compareGrid);
            compareContent.appendChild(compareSection);

            const detailsGrid = createElement('div', 'lumo-detail-grid');
            detailsGrid.appendChild(createDetailCardElement('Разница', formatNumber(Math.abs(diff)), diff >= 0 ? 'прирост' : 'снижение'));
            detailsGrid.appendChild(createDetailCardElement('Рост', `${diff >= 0 ? '+' : ''}${diffPercent}%`, 'в процентах'));
            detailsGrid.appendChild(createDetailCardElement('Топ видео', formatNumber(stats.topViews), 'лучший результат'));
            detailsGrid.appendChild(createDetailCardElement('Консистентность', `${stats.consistency.toFixed(0)}%`, 'стабильность'));
            compareContent.appendChild(detailsGrid);
        }
    }

    if (performanceContent) {
        performanceContent.textContent = '';

        const legend = createElement('div', 'lumo-score-legend');
        const legendTitle = createElement('div', 'lumo-score-legend-title', 'Расшифровка оценок');
        const legendItems = createElement('div', 'lumo-score-legend-items');

        const grades = [
            { grade: 'A+', desc: 'Отлично', class: 'excellent' },
            { grade: 'A', desc: 'Хорошо', class: 'good' },
            { grade: 'B', desc: 'Средне', class: 'average' },
            { grade: 'C', desc: 'Слабо', class: 'poor' },
            { grade: 'D', desc: 'Плохо', class: 'bad' }
        ];

        grades.forEach(g => {
            const item = createElement('div', 'lumo-score-legend-item');
            const badge = createElement('span', `lumo-score-legend-badge lumo-score-${g.class}`, g.grade);
            const desc = createElement('span', '', g.desc);
            item.appendChild(badge);
            item.appendChild(desc);
            legendItems.appendChild(item);
        });

        legend.appendChild(legendTitle);
        legend.appendChild(legendItems);
        performanceContent.appendChild(legend);

        const perfGrid = createElement('div', 'lumo-performance-grid');

        const viewsScore = getPerformanceScore(stats.avgViews, {
            excellent: 100000,
            good: 50000,
            average: 10000,
            poor: 1000
        });
        const viewsItem = createElement('div', 'lumo-performance-item');
        const viewsHeader = createElement('div', 'lumo-performance-header');
        viewsHeader.appendChild(createElement('div', 'lumo-performance-title', 'Просмотры'));
        viewsHeader.appendChild(createElement('div', `lumo-performance-score lumo-score-${viewsScore.class}`, viewsScore.score));
        viewsItem.appendChild(viewsHeader);
        viewsItem.appendChild(createElement('div', 'lumo-performance-desc', `Средние просмотры ${formatNumber(stats.avgViews)}`));
        perfGrid.appendChild(viewsItem);

        if (currentMode === 'videos') {
            const consistScore = getPerformanceScore(stats.consistency, {
                excellent: 70,
                good: 55,
                average: 40,
                poor: 25
            });
            const consistItem = createElement('div', 'lumo-performance-item');
            const consistHeader = createElement('div', 'lumo-performance-header');
            consistHeader.appendChild(createElement('div', 'lumo-performance-title', 'Стабильность'));
            consistHeader.appendChild(createElement('div', `lumo-performance-score lumo-score-${consistScore.class}`, consistScore.score));
            consistItem.appendChild(consistHeader);
            consistItem.appendChild(createElement('div', 'lumo-performance-desc', `Стабильность ${stats.consistency.toFixed(0)}%`));
            perfGrid.appendChild(consistItem);

            const freqScore = getPerformanceScore(stats.videosPerWeek, {
                excellent: 5,
                good: 3,
                average: 1,
                poor: 0.5
            });
            const freqItem = createElement('div', 'lumo-performance-item');
            const freqHeader = createElement('div', 'lumo-performance-header');
            freqHeader.appendChild(createElement('div', 'lumo-performance-title', 'Активность'));
            freqHeader.appendChild(createElement('div', `lumo-performance-score lumo-score-${freqScore.class}`, freqScore.score));
            freqItem.appendChild(freqHeader);
            freqItem.appendChild(createElement('div', 'lumo-performance-desc', `Частота ${formatVideosPerWeek(stats.videosPerWeek)}`));
            perfGrid.appendChild(freqItem);

            const growthScore = getPerformanceScore(stats.growthRate, {
                excellent: 40,
                good: 20,
                average: 5,
                poor: -10
            });
            const growthItem = createElement('div', 'lumo-performance-item');
            const growthHeader = createElement('div', 'lumo-performance-header');
            growthHeader.appendChild(createElement('div', 'lumo-performance-title', 'Рост'));
            growthHeader.appendChild(createElement('div', `lumo-performance-score lumo-score-${growthScore.class}`, growthScore.score));
            growthItem.appendChild(growthHeader);
            growthItem.appendChild(createElement('div', 'lumo-performance-desc', `Динамика ${stats.growthRate > 0 ? '+' : ''}${stats.growthRate.toFixed(1)}%`));
            perfGrid.appendChild(growthItem);

            const durationScore = getPerformanceScore(stats.avgDuration, {
                excellent: 900,
                good: 600,
                average: 300,
                poor: 120
            });
            const durationItem = createElement('div', 'lumo-performance-item');
            const durationHeader = createElement('div', 'lumo-performance-header');
            durationHeader.appendChild(createElement('div', 'lumo-performance-title', 'Длительность'));
            durationHeader.appendChild(createElement('div', `lumo-performance-score lumo-score-${durationScore.class}`, durationScore.score));
            durationItem.appendChild(durationHeader);
            durationItem.appendChild(createElement('div', 'lumo-performance-desc', `Средняя ${formatTime(stats.avgDuration)}`));
            perfGrid.appendChild(durationItem);

            const engagementRatio = stats.topViews > 0 ? (stats.avgViews / stats.topViews) * 100 : 0;
            const engageScore = getPerformanceScore(engagementRatio, {
                excellent: 60,
                good: 40,
                average: 20,
                poor: 10
            });
            const engageItem = createElement('div', 'lumo-performance-item');
            const engageHeader = createElement('div', 'lumo-performance-header');
            engageHeader.appendChild(createElement('div', 'lumo-performance-title', 'Вовлеченность'));
            engageHeader.appendChild(createElement('div', `lumo-performance-score lumo-score-${engageScore.class}`, engageScore.score));
            engageItem.appendChild(engageHeader);
            engageItem.appendChild(createElement('div', 'lumo-performance-desc', `Соотношение ${engagementRatio.toFixed(0)}%`));
            perfGrid.appendChild(engageItem);
        } else if (currentMode === 'shorts') {
            const consistScore = getPerformanceScore(stats.consistency, {
                excellent: 70,
                good: 55,
                average: 40,
                poor: 25
            });
            const consistItem = createElement('div', 'lumo-performance-item');
            const consistHeader = createElement('div', 'lumo-performance-header');
            consistHeader.appendChild(createElement('div', 'lumo-performance-title', 'Стабильность'));
            consistHeader.appendChild(createElement('div', `lumo-performance-score lumo-score-${consistScore.class}`, consistScore.score));
            consistItem.appendChild(consistHeader);
            consistItem.appendChild(createElement('div', 'lumo-performance-desc', `Стабильность ${stats.consistency.toFixed(0)}%`));
            perfGrid.appendChild(consistItem);
        }

        performanceContent.appendChild(perfGrid);
    }

    modal.classList.add('active');
    isAnalyzing = false;

    forceYouTubeResize();
}

function createAnalyticsPanel() {
    const existing = document.querySelector('.lumo-analytics-wrapper');
    if (existing) existing.remove();

    const wrapper = createElement('div', 'lumo-analytics-wrapper');
    const container = createElement('div', 'lumo-analytics-container');

    const header = createElement('div', 'lumo-analytics-header');
    const titleContainer = createElement('div', 'lumo-analytics-title');
    const titleText = createElement('span', '', '▣ Аналитика');
    const badge = createElement('span', 'lumo-analytics-badge', 'Pro');
    titleContainer.appendChild(titleText);
    titleContainer.appendChild(badge);

    const expandBtn = createElement('button', 'lumo-analytics-expand-btn', 'Подробно →');
    expandBtn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        showDetailedStats();
    });

    header.appendChild(titleContainer);
    header.appendChild(expandBtn);

    const loading = createElement('div', 'lumo-loading');
    const spinner = createElement('div', 'lumo-spinner');
    const loadingText = createElement('div', 'lumo-loading-text', 'Анализ данных...');
    loading.appendChild(spinner);
    loading.appendChild(loadingText);

    container.appendChild(header);
    container.appendChild(loading);
    wrapper.appendChild(container);

    const pageHeader = document.querySelector('#page-header');
    if (pageHeader) {
        pageHeader.appendChild(wrapper);
        requestAnimationFrame(() => loadInitialStats());
    }
}

function createLiveAnalyticsPanel() {
    const existing = document.querySelector('.lumo-analytics-wrapper');
    if (existing) existing.remove();

    const wrapper = createElement('div', 'lumo-analytics-wrapper');
    const container = createElement('div', 'lumo-analytics-container');

    const header = createElement('div', 'lumo-analytics-header');
    const titleContainer = createElement('div', 'lumo-analytics-title');
    const titleText = createElement('span', '', '▣ Аналитика стрима');
    const badge = createElement('span', 'lumo-analytics-badge live', 'LIVE');
    titleContainer.appendChild(titleText);
    titleContainer.appendChild(badge);

    header.appendChild(titleContainer);

    container.appendChild(header);

    const statsContainer = createElement('div', 'lumo-live-stats');
    statsContainer.id = 'live-stats-container';
    container.appendChild(statsContainer);

    const chartWrapper = createElement('div', 'lumo-chart-wrapper');
    chartWrapper.style.marginTop = '16px';
    const canvas = document.createElement('canvas');
    canvas.className = 'lumo-chart-canvas';
    canvas.id = 'live-chart';
    chartWrapper.appendChild(canvas);
    container.appendChild(chartWrapper);

    wrapper.appendChild(container);

    const secondary = document.querySelector('#secondary');
    if (secondary) {
        secondary.insertBefore(wrapper, secondary.firstChild);
        requestAnimationFrame(() => {
            updateLiveStats();
            drawLiveChart();
        });
        startLiveUpdates();
    }
}

function updateLiveStats() {
    const viewers = getLiveViewers();

    viewerHistory.push({
        viewers: viewers,
        timestamp: Date.now()
    });

    if (viewerHistory.length > maxHistoryLength) {
        viewerHistory.shift();
    }

    const statsContainer = document.getElementById('live-stats-container');
    if (statsContainer) {
        while (statsContainer.firstChild) {
            statsContainer.removeChild(statsContainer.firstChild);
        }

        const viewerCard = createElement('div', 'lumo-live-card highlight');
        const viewerLabel = createElement('div', 'lumo-live-label', 'Зрителей');
        const viewerValue = createElement('div', 'lumo-live-value', viewers.toString());
        viewerCard.appendChild(viewerLabel);
        viewerCard.appendChild(viewerValue);

        const peakCard = createElement('div', 'lumo-live-card');
        const peakLabel = createElement('div', 'lumo-live-label', 'Пик');
        const peak = viewerHistory.length > 0 ? Math.max(...viewerHistory.map(h => h.viewers)) : viewers;
        const peakValue = createElement('div', 'lumo-live-value', peak.toString());
        peakCard.appendChild(peakLabel);
        peakCard.appendChild(peakValue);

        const minCard = createElement('div', 'lumo-live-card');
        const minLabel = createElement('div', 'lumo-live-label', 'Минимум');
        const min = viewerHistory.length > 0 ? Math.min(...viewerHistory.map(h => h.viewers)) : viewers;
        const minValue = createElement('div', 'lumo-live-value', min.toString());
        minCard.appendChild(minLabel);
        minCard.appendChild(minValue);

        const avgCard = createElement('div', 'lumo-live-card');
        const avgLabel = createElement('div', 'lumo-live-label', 'Средние');
        const avg = viewerHistory.length > 0 ? Math.round(viewerHistory.reduce((sum, h) => sum + h.viewers, 0) / viewerHistory.length) : viewers;
        const avgValue = createElement('div', 'lumo-live-value', avg.toString());
        avgCard.appendChild(avgLabel);
        avgCard.appendChild(avgValue);

        statsContainer.appendChild(viewerCard);
        statsContainer.appendChild(peakCard);
        statsContainer.appendChild(minCard);
        statsContainer.appendChild(avgCard);
    }

    drawLiveChart();
}

function drawLiveChart() {
    const canvas = document.getElementById('live-chart');
    if (!canvas || viewerHistory.length === 0) return;

    const data = viewerHistory.map(h => h.viewers);
    drawLineChart(canvas, data, '#ff0000');
    setupChartTooltip(canvas, canvas.parentElement);
}

function startLiveUpdates() {
    if (liveUpdateInterval) clearInterval(liveUpdateInterval);

    liveUpdateInterval = setInterval(() => {
        requestAnimationFrame(() => updateLiveStats());
    }, 3000);
}

function stopLiveUpdates() {
    if (liveUpdateInterval) {
        clearInterval(liveUpdateInterval);
        liveUpdateInterval = null;
    }
    viewerHistory = [];
}

function loadInitialStats() {
    const container = document.querySelector('.lumo-analytics-container');
    if (!container) return;

    let stats, data;

    if (currentMode === 'videos') {
        data = getVideosFromPage();
        stats = analyzeVideos(data);
    } else if (currentMode === 'shorts') {
        data = getShortsFromPage();
        stats = analyzeShortsData(data);
    } else if (currentMode === 'streams') {
        data = getStreamsFromPage();
        stats = analyzeStreamsData(data);
    }

    const country = getCountryFromAbout();

    const loading = container.querySelector('.lumo-loading');
    if (loading) loading.remove();

    const statsGrid = createElement('div', 'lumo-stats-grid');

    if (currentMode === 'videos') {
        statsGrid.appendChild(createStatCardElement('Ср. просмотры', formatNumber(stats.avgViews), '◉'));
        statsGrid.appendChild(createStatCardElement('Ср. длительность', formatTime(stats.avgDuration), '◷'));
        statsGrid.appendChild(createStatCardElement('Частота', formatVideosPerWeek(stats.videosPerWeek), '◔'));
    } else if (currentMode === 'shorts') {
        statsGrid.appendChild(createStatCardElement('Ср. просмотры', formatNumber(stats.avgViews), '◉'));
        statsGrid.appendChild(createStatCardElement('Всего Shorts', stats.totalShorts.toString(), '▣'));
        statsGrid.appendChild(createStatCardElement('Топ Shorts', formatNumber(stats.topViews), '↑'));
    } else if (currentMode === 'streams') {
        statsGrid.appendChild(createStatCardElement('Активные', stats.liveCount.toString(), '▣'));
        statsGrid.appendChild(createStatCardElement('Зрители сейчас', stats.currentViewers.toString(), '◉'));
        if (stats.pastStreamsCount > 0) {
            statsGrid.appendChild(createStatCardElement('Ср. просмотры', formatNumber(stats.avgViews), '◷'));
        }
    }

    if (country) {
        const countryCard = createElement('div', 'lumo-stat-card');
        const label = createElement('div', 'lumo-stat-label', 'Страна');
        const info = createElement('div', 'lumo-country-info');
        const flag = document.createElement('img');
        flag.className = 'lumo-country-flag';
        flag.src = countryFlags[country] || 'https://flagcdn.com/w80/ru.png';
        flag.onerror = () => flag.style.display = 'none';
        const name = createElement('span', 'lumo-country-name', country);

        info.appendChild(flag);
        info.appendChild(name);
        countryCard.appendChild(label);
        countryCard.appendChild(info);
        statsGrid.appendChild(countryCard);
    }

    container.appendChild(statsGrid);

    forceYouTubeResize();
}

function init() {
    const path = window.location.pathname;

    if (path.includes('/live/') || (path.includes('/watch') && document.querySelector('ytd-watch-info-text #view-count'))) {
        currentMode = 'live';
        stopLiveUpdates();
        setTimeout(() => {
            const existing = document.querySelector('.lumo-analytics-wrapper');
            if (!existing) {
                createLiveAnalyticsPanel();
            }
        }, 2000);
    } else if ((path.includes('/@') || path.includes('/channel/') || path.includes('/c/')) && path.includes('/streams')) {
        currentMode = 'streams';
        stopLiveUpdates();
        setTimeout(() => {
            if (!document.querySelector('.lumo-analytics-wrapper')) {
                createAnalyticsPanel();
            }
        }, 1000);
    } else if ((path.includes('/@') || path.includes('/channel/') || path.includes('/c/')) && path.includes('/videos')) {
        currentMode = 'videos';
        stopLiveUpdates();
        setTimeout(() => {
            if (!document.querySelector('.lumo-analytics-wrapper')) {
                createAnalyticsPanel();
            }
        }, 1000);
    } else if ((path.includes('/@') || path.includes('/channel/') || path.includes('/c/')) && path.includes('/shorts')) {
        currentMode = 'shorts';
        stopLiveUpdates();
        setTimeout(() => {
            if (!document.querySelector('.lumo-analytics-wrapper')) {
                createAnalyticsPanel();
            }
        }, 1000);
    } else {
        stopLiveUpdates();
    }
}

let lastUrl = location.href;
const observer = new MutationObserver(() => {
    const url = location.href;
    if (url !== lastUrl) {
        lastUrl = url;
        const modal = document.querySelector('.lumo-modal');
        if (modal) modal.remove();
        const wrapper = document.querySelector('.lumo-analytics-wrapper');
        if (wrapper) wrapper.remove();
        const tooltip = document.querySelector('.lumo-chart-tooltip');
        if (tooltip) tooltip.remove();
        cachedData = null;
        isAnalyzing = false;
        chartData = null;
        stopLiveUpdates();
        setTimeout(init, 500);
    }
});

observer.observe(document.body, { subtree: true, childList: true });
init();

})();