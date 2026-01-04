// ==UserScript==
// @name         Torn Radial CSS Library
// @namespace    http://tampermonkey.net/
// @version      1.0.3
// @description  Dynamic CSS generator for Torn Radial Menu
// @author       Sensimillia (2168012)
// @license      MIT
// ==/UserScript==

(function() {
    'use strict';

    // ==================== CSS GENERATOR ====================
    class CSSGenerator {
        constructor() {
            this.styleElement = null;
        }

        generateCSS(config) {
            const { theme, size, position, isPDA } = config;
            
            return `
                @import url('https://fonts.googleapis.com/css2?family=Roboto:wght@400;500;600;700&display=swap');

                * {
                    font-family: -apple-system, BlinkMacSystemFont, 'Roboto', 'Segoe UI', sans-serif;
                }

                #torn-radial-container {
                    position: fixed;
                    left: ${position.x}px;
                    top: ${position.y}px;
                    z-index: 999999;
                    pointer-events: none;
                    transform-origin: center center;
                }

                #torn-radial-btn {
                    width: ${size.main}px;
                    height: ${size.main}px;
                    border-radius: 50%;
                    background: ${theme.mainBtnBg};
                    backdrop-filter: saturate(180%) blur(20px);
                    -webkit-backdrop-filter: saturate(180%) blur(20px);
                    border: 2px solid ${theme.mainBtnBorder};
                    cursor: pointer;
                    pointer-events: auto;
                    box-shadow: 
                        0 12px 48px rgba(0, 0, 0, 0.15),
                        0 2px 8px rgba(0, 0, 0, 0.08);
                    transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: ${size.fontSize}px;
                    user-select: none;
                    position: relative;
                    color: ${theme.primaryColor};
                }

                #torn-radial-btn:active {
                    transform: scale(0.92);
                }

                #torn-radial-btn:hover {
                    transform: scale(1.05);
                    box-shadow: 
                        0 16px 56px rgba(0, 0, 0, 0.2),
                        0 4px 12px rgba(0, 0, 0, 0.1),
                        0 0 0 4px ${theme.primaryColor}33;
                    animation: pulse-glow 2s infinite;
                }

                @keyframes pulse-glow {
                    0%, 100% { box-shadow: 0 16px 56px rgba(0, 0, 0, 0.2), 0 4px 12px rgba(0, 0, 0, 0.1), 0 0 0 4px ${theme.primaryColor}33; }
                    50% { box-shadow: 0 16px 56px rgba(0, 0, 0, 0.2), 0 4px 12px rgba(0, 0, 0, 0.1), 0 0 0 8px ${theme.primaryColor}55; }
                }

                #torn-radial-btn.dragging {
                    cursor: grabbing;
                    transform: scale(1.1);
                    box-shadow: 
                        0 20px 64px rgba(0, 0, 0, 0.25),
                        0 6px 16px rgba(0, 0, 0, 0.15);
                }

                .radial-item {
                    position: absolute;
                    width: ${size.radial}px;
                    height: ${size.radial}px;
                    border-radius: 50%;
                    cursor: pointer;
                    pointer-events: auto;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    color: white;
                    font-size: ${size.radialFont}px;
                    box-shadow: 
                        0 8px 24px rgba(0, 0, 0, 0.2),
                        0 2px 6px rgba(0, 0, 0, 0.12);
                    transition: all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94);
                    opacity: 0;
                    transform: scale(0);
                    text-decoration: none;
                    left: ${(size.main - size.radial) / 2}px;
                    top: ${(size.main - size.radial) / 2}px;
                    backdrop-filter: saturate(180%) blur(20px);
                    -webkit-backdrop-filter: saturate(180%) blur(20px);
                    will-change: transform, opacity;
                }

                .radial-item::before {
                    content: attr(title);
                    position: absolute;
                    bottom: -36px;
                    left: 50%;
                    transform: translateX(-50%) scale(0);
                    background: rgba(0, 0, 0, 0.92);
                    backdrop-filter: saturate(180%) blur(20px);
                    -webkit-backdrop-filter: saturate(180%) blur(20px);
                    color: white;
                    padding: 6px 12px;
                    border-radius: 8px;
                    font-size: 12px;
                    font-weight: 600;
                    white-space: nowrap;
                    pointer-events: none;
                    opacity: 0;
                    transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
                    letter-spacing: 0.3px;
                    z-index: 100;
                }

                .radial-item:hover::before {
                    opacity: 1;
                    transform: translateX(-50%) scale(1);
                    bottom: -40px;
                }

                .radial-item:active {
                    transform: scale(0.85) !important;
                }

                .radial-item:hover {
                    transform: scale(1.15) !important;
                    box-shadow: 
                        0 12px 32px rgba(0, 0, 0, 0.25),
                        0 4px 8px rgba(0, 0, 0, 0.15);
                    z-index: 10;
                }

                .radial-item.open {
                    opacity: 1;
                }

                .radial-item.settings {
                    background: linear-gradient(135deg, #8E8E93 0%, #636366 100%);
                }

                .radial-item.search {
                    background: ${theme.accentGradient};
                }

                .radial-item.calculator {
                    background: linear-gradient(135deg, #FF9500 0%, #FF6B00 100%);
                }

                .radial-item.mini-apps {
                    background: linear-gradient(135deg, ${theme.successColor} 0%, #2FB350 100%);
                }

                /* Notification Toast */
                .torn-radial-notification {
                    position: fixed;
                    top: 20px;
                    right: 20px;
                    background: ${theme.modalBg};
                    border: 2px solid ${theme.primaryColor};
                    color: ${theme.textColor};
                    padding: 16px 24px;
                    border-radius: 12px;
                    font-size: 14px;
                    font-weight: 600;
                    z-index: 9999999;
                    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.4);
                    animation: slideInRight 0.3s ease-out;
                }

                @keyframes slideInRight {
                    from {
                        transform: translateX(400px);
                        opacity: 0;
                    }
                    to {
                        transform: translateX(0);
                        opacity: 1;
                    }
                }

                @keyframes fadeIn {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }

                @keyframes slideUp {
                    from {
                        opacity: 0;
                        transform: scale(0.9) translateY(20px);
                    }
                    to {
                        opacity: 1;
                        transform: scale(1) translateY(0);
                    }
                }

                /* Overlay Base Styles */
                .torn-radial-overlay {
                    display: none;
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    background: rgba(0, 0, 0, 0.8);
                    backdrop-filter: blur(20px);
                    z-index: 1000001;
                    justify-content: center;
                    align-items: center;
                    animation: fadeIn 0.3s ease;
                    padding: ${isPDA ? '8px' : '20px'};
                }

                .torn-radial-overlay.show {
                    display: show;
                }
                
                /* Settings Modal Fix */
                #torn-radial-modal {
                display: none;
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0, 0, 0, 0.8);
                backdrop-filter: blur(30px);
                -webkit-backdrop-filter: blur(30px);
                justify-content: center;
                align-items: center;
                z-index: 99999999 !important;
                animation: fadeIn 0.3s ease;
                padding: 20px;
                    
                }
                #torn-radial-modal[style*="display: flex"] {
                display: flex !important;
                    
                }

                /* Container Base */
                .torn-radial-container-base {
                    background: ${theme.modalBg};
                    border-radius: ${isPDA ? '12px' : '20px'};
                    padding: 0;
                    max-width: ${isPDA ? '100%' : '700px'};
                    width: 100%;
                    max-height: ${isPDA ? '100%' : '90vh'};
                    overflow: hidden;
                    display: flex;
                    flex-direction: column;
                    box-shadow: 0 32px 64px rgba(0, 0, 0, 0.5);
                    animation: slideUp 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
                }

                /* Header Base */
                .torn-radial-header-base {
                    padding: ${isPDA ? '12px 16px' : '20px 24px'};
                    border-bottom: 1px solid ${theme.borderColor};
                    background: ${theme.modalHeaderBg};
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    flex-shrink: 0;
                }

                .torn-radial-header-base h2 {
                    margin: 0;
                    color: ${theme.textColor};
                    font-size: ${isPDA ? '16px' : '20px'};
                    font-weight: 700;
                }

                /* Body Base */
                .torn-radial-body-base {
                    padding: ${isPDA ? '12px' : '24px'};
                    overflow-y: auto;
                    flex: 1;
                    color: ${theme.textColor};
                }

                .torn-radial-body-base::-webkit-scrollbar {
                    width: 6px;
                }

                .torn-radial-body-base::-webkit-scrollbar-track {
                    background: transparent;
                }

                .torn-radial-body-base::-webkit-scrollbar-thumb {
                    background: ${theme.primaryColor}4D;
                    border-radius: 10px;
                }

                /* Footer Base */
                .torn-radial-footer-base {
                    padding: ${isPDA ? '12px 16px' : '16px 24px'};
                    border-top: 1px solid ${theme.borderColor};
                    background: ${theme.modalFooterBg};
                    display: flex;
                    gap: ${isPDA ? '8px' : '12px'};
                    flex-shrink: 0;
                    flex-wrap: ${isPDA ? 'wrap' : 'nowrap'};
                }

                /* Close Button */
                .modal-close {
                    width: ${isPDA ? '28px' : '32px'};
                    height: ${isPDA ? '28px' : '32px'};
                    border-radius: 50%;
                    background: ${theme.inputBg};
                    border: none;
                    color: ${theme.textSecondary};
                    font-size: ${isPDA ? '16px' : '20px'};
                    font-weight: 600;
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    transition: all 0.2s ease;
                }

                .modal-close:hover {
                    background: ${theme.dangerColor};
                    color: white;
                }

                .modal-close:active {
                    transform: scale(0.9);
                }

                /* Buttons */
                .torn-radial-btn-base {
                    padding: ${isPDA ? '10px 14px' : '12px 20px'};
                    border: none;
                    border-radius: ${isPDA ? '8px' : '10px'};
                    cursor: pointer;
                    font-size: ${isPDA ? '12px' : '14px'};
                    font-weight: 600;
                    transition: all 0.2s ease;
                    flex: ${isPDA ? '1 1 45%' : '1'};
                }

                .torn-radial-btn-base:active {
                    transform: scale(0.96);
                }

                .btn-primary {
                    background: ${theme.primaryColor};
                    color: white;
                    box-shadow: 0 4px 12px ${theme.primaryColor}4D;
                }

                .btn-primary:hover {
                    opacity: 0.9;
                    box-shadow: 0 6px 16px ${theme.primaryColor}66;
                }

                .btn-secondary {
                    background: ${theme.inputBg};
                    color: ${theme.textColor};
                }

                .btn-secondary:hover {
                    opacity: 0.8;
                }

                .btn-success {
                    background: ${theme.successColor};
                    color: white;
                    box-shadow: 0 4px 12px rgba(62, 163, 74, 0.3);
                }

                .btn-success:hover {
                    opacity: 0.9;
                    box-shadow: 0 6px 16px rgba(62, 163, 74, 0.4);
                }

                .btn-danger {
                    background: ${theme.dangerColor};
                    color: white;
                }

                .btn-danger:hover {
                    opacity: 0.9;
                }

                /* Section Container */
                .torn-radial-section {
                    background: ${theme.sectionBg};
                    padding: ${isPDA ? '12px' : '16px'};
                    margin-bottom: ${isPDA ? '12px' : '16px'};
                    border-radius: ${isPDA ? '10px' : '14px'};
                    border: 0.5px solid ${theme.borderColor};
                }

                .torn-radial-section h3 {
                    margin: 0 0 ${isPDA ? '10px' : '12px'} 0;
                    font-size: ${isPDA ? '13px' : '16px'};
                    font-weight: 600;
                    color: ${theme.textColor};
                }

                /* Input Fields */
                .torn-radial-input {
                    padding: ${isPDA ? '8px 12px' : '10px 14px'};
                    border: none;
                    border-radius: ${isPDA ? '6px' : '8px'};
                    background: ${theme.inputBg};
                    color: ${theme.textColor};
                    font-size: ${isPDA ? '12px' : '14px'};
                    transition: all 0.2s ease;
                    width: 100%;
                }

                .torn-radial-input:focus {
                    outline: none;
                    border: 2px solid ${theme.primaryColor};
                    box-shadow: 0 0 0 4px ${theme.primaryColor}26;
                }

                /* Select Fields */
                .torn-radial-select {
                    padding: ${isPDA ? '6px 10px' : '8px 12px'};
                    border: none;
                    border-radius: ${isPDA ? '6px' : '8px'};
                    background: ${theme.inputBg};
                    color: ${theme.textColor};
                    font-size: ${isPDA ? '12px' : '14px'};
                    cursor: pointer;
                    transition: all 0.2s ease;
                }

                .torn-radial-select:focus {
                    outline: none;
                    border: 2px solid ${theme.primaryColor};
                    box-shadow: 0 0 0 4px ${theme.primaryColor}26;
                }

                /* Settings Specific Styles */
                .setting-item {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin: ${isPDA ? '8px 0' : '12px 0'};
                    gap: ${isPDA ? '8px' : '10px'};
                    flex-wrap: ${isPDA ? 'wrap' : 'nowrap'};
                }

                .setting-item label {
                    font-size: ${isPDA ? '11px' : '14px'};
                    font-weight: 500;
                    color: ${theme.textColor};
                    flex: ${isPDA ? '1 1 100%' : '1'};
                }

                .setting-item select,
                .setting-item input {
                    flex: ${isPDA ? '1 1 100%' : '0 0 auto'};
                    min-width: ${isPDA ? '100%' : '120px'};
                }

                /* Link Item Grid */
                .link-item {
                    background: ${theme.sectionBg};
                    padding: ${isPDA ? '10px' : '16px'};
                    margin: ${isPDA ? '8px 0' : '12px 0'};
                    border-radius: ${isPDA ? '10px' : '14px'};
                    display: grid;
                    grid-template-columns: ${isPDA ? '35px 1fr' : '50px 1fr 1fr 50px 40px 80px'};
                    gap: ${isPDA ? '6px' : '10px'};
                    align-items: center;
                    border: 0.5px solid ${theme.borderColor};
                    transition: all 0.2s ease;
                }

                ${isPDA ? `
                .link-item input:nth-child(2),
                .link-item input:nth-child(3) {
                    grid-column: span 2;
                }
                
                .link-item .color-picker-wrapper,
                .link-item .delete-btn,
                .link-item .reorder-controls {
                    grid-column: span 1;
                }
                ` : ''}

                .link-item:hover {
                    background: ${theme.inputBg};
                    transform: translateX(4px);
                }

                .link-item input {
                    padding: ${isPDA ? '6px 8px' : '10px 12px'};
                    border: none;
                    border-radius: ${isPDA ? '6px' : '10px'};
                    background: ${theme.inputBg};
                    color: ${theme.textColor};
                    font-size: ${isPDA ? '11px' : '14px'};
                    transition: all 0.2s ease;
                }

                .link-item input:focus {
                    outline: none;
                    border: 2px solid ${theme.primaryColor};
                    box-shadow: 0 0 0 4px ${theme.primaryColor}26;
                }

                /* Color Picker */
                .color-picker {
                    width: ${isPDA ? '35px' : '50px'};
                    height: ${isPDA ? '32px' : '42px'};
                    border-radius: ${isPDA ? '6px' : '10px'};
                    border: none;
                    cursor: pointer;
                    transition: all 0.2s ease;
                }

                .color-picker::-webkit-color-swatch-wrapper {
                    padding: 4px;
                }

                .color-picker::-webkit-color-swatch {
                    border: none;
                    border-radius: 6px;
                    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
                }

                /* Delete Button */
                .delete-btn {
                    width: ${isPDA ? '32px' : '40px'};
                    height: ${isPDA ? '32px' : '40px'};
                    border: none;
                    border-radius: ${isPDA ? '6px' : '10px'};
                    cursor: pointer;
                    background: rgba(163, 58, 58, 0.2);
                    color: ${theme.dangerColor};
                    font-size: ${isPDA ? '14px' : '18px'};
                    transition: all 0.2s ease;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }

                .delete-btn:hover {
                    background: rgba(163, 58, 58, 0.3);
                    transform: scale(1.05);
                }

                /* Reorder Controls */
                .reorder-controls {
                    display: flex;
                    flex-direction: column;
                    gap: 4px;
                }

                .reorder-btn {
                    width: ${isPDA ? '28px' : '36px'};
                    height: ${isPDA ? '14px' : '18px'};
                    border: none;
                    border-radius: 4px;
                    cursor: pointer;
                    background: ${theme.inputBg};
                    color: ${theme.textColor};
                    font-size: ${isPDA ? '8px' : '12px'};
                    transition: all 0.2s ease;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-weight: bold;
                }

                .reorder-btn:hover:not(:disabled) {
                    background: ${theme.primaryColor};
                    color: white;
                }

                .reorder-btn:disabled {
                    opacity: 0.3;
                    cursor: not-allowed;
                }

                /* Loadout Tabs */
                .loadout-tabs {
                    display: flex;
                    gap: ${isPDA ? '6px' : '8px'};
                    flex-wrap: wrap;
                    margin-bottom: ${isPDA ? '10px' : '12px'};
                }

                .loadout-tab {
                    padding: ${isPDA ? '6px 10px' : '8px 16px'};
                    border: none;
                    border-radius: ${isPDA ? '6px' : '10px'};
                    background: ${theme.inputBg};
                    color: ${theme.textColor};
                    font-size: ${isPDA ? '11px' : '14px'};
                    font-weight: 500;
                    cursor: pointer;
                    transition: all 0.2s ease;
                }

                .loadout-tab.active {
                    background: ${theme.primaryColor};
                    color: white;
                    box-shadow: 0 2px 8px ${theme.primaryColor}33;
                }

                .loadout-tab:hover:not(.active) {
                    background: ${theme.borderColor};
                }

                /* Calibration Overlay */
                #torn-radial-calibration {
                    display: none;
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    background: rgba(0, 0, 0, 0.9);
                    z-index: 1000002;
                    cursor: crosshair;
                }

                #torn-radial-calibration.show {
                    display: block;
                }

                .calibration-instruction {
                    position: fixed;
                    top: 50%;
                    left: 50%;
                    transform: translate(-50%, -50%);
                    background: ${theme.modalBg};
                    padding: ${isPDA ? '20px 30px' : '30px 40px'};
                    border-radius: ${isPDA ? '12px' : '20px'};
                    color: ${theme.textColor};
                    font-size: ${isPDA ? '16px' : '24px'};
                    font-weight: 600;
                    text-align: center;
                    box-shadow: 0 32px 64px rgba(0, 0, 0, 0.5);
                    pointer-events: none;
                    max-width: ${isPDA ? '80%' : 'none'};
                }

                .calibration-point {
                    position: absolute;
                    width: ${isPDA ? '16px' : '20px'};
                    height: ${isPDA ? '16px' : '20px'};
                    background: ${theme.primaryColor};
                    border: 3px solid white;
                    border-radius: 50%;
                    transform: translate(-50%, -50%);
                    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.5);
                    animation: pulse 1.5s infinite;
                }

                @keyframes pulse {
                    0%, 100% { transform: translate(-50%, -50%) scale(1); opacity: 1; }
                    50% { transform: translate(-50%, -50%) scale(1.3); opacity: 0.7; }
                }

                .calibration-cancel {
                    position: fixed;
                    bottom: ${isPDA ? '20px' : '40px'};
                    left: 50%;
                    transform: translateX(-50%);
                    padding: ${isPDA ? '10px 20px' : '12px 24px'};
                    background: ${theme.dangerColor};
                    color: white;
                    border: none;
                    border-radius: ${isPDA ? '8px' : '12px'};
                    font-size: ${isPDA ? '13px' : '16px'};
                    font-weight: 600;
                    cursor: pointer;
                    pointer-events: auto;
                    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.3);
                }

                /* Error Log Specific */
                .error-log-btn {
                    width: ${isPDA ? '28px' : '32px'};
                    height: ${isPDA ? '28px' : '32px'};
                    border-radius: 50%;
                    background: ${theme.inputBg};
                    border: none;
                    font-size: ${isPDA ? '14px' : '16px'};
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    transition: all 0.2s ease;
                    margin-right: 8px;
                }

                .error-log-btn:hover {
                    background: rgba(255, 152, 0, 0.2);
                    transform: scale(1.05);
                }
            `;
        }

        injectCSS(config) {
            // Remove existing style if present
            if (this.styleElement) {
                this.styleElement.remove();
            }

            // Create new style element
            this.styleElement = document.createElement('style');
            this.styleElement.textContent = this.generateCSS(config);
            document.head.appendChild(this.styleElement);
        }

        updateCSS(config) {
            this.injectCSS(config);
        }

        removeCSS() {
            if (this.styleElement) {
                this.styleElement.remove();
                this.styleElement = null;
            }
        }
    }

    // ==================== EXPORT ====================
    window.TornRadialCSS = {
        CSSGenerator: CSSGenerator
    };

})();