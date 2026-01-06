// ==UserScript==
// @name         NeuraVeil Styles (Library)
// @namespace    https://github.com/DREwX-code/neuraveil
// @version      1.0.0
// @description  Styles CSS for NeuraVeil userscript
// @author       Dℝ∃wX
// @grant        none
// @license      Apache-2.0
// @copyright    2025 Dℝ∃wX
// ==/UserScript==


/*

Copyright 2025 Dℝ∃wX

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.

*/


window.NEURAVEIL_CSS = `

                :host {
                    --nv-bg: rgba(23, 23, 28, 0.95);
                    --nv-bg-secondary: rgba(30, 30, 36, 0.9);
                    --nv-border: rgba(255, 255, 255, 0.08);
                    --nv-primary: #8b5cf6;
                    --nv-primary-hover: #7c3aed;
                    --nv-text: #ffffff;
                    --nv-text-muted: #a1a1aa;
                    --nv-radius: 16px;
                    --nv-radius-sm: 8px;
                    --nv-shadow: 0 8px 32px rgba(0, 0, 0, 0.4);
                }

                * { box-sizing: border-box; }

                /* Trigger Button */
                .nv-trigger {
                    width: 56px;
                    height: 56px;
                    border-radius: 50%;
                    background: var(--nv-bg);
                    border: 1px solid var(--nv-border);
                    box-shadow: var(--nv-shadow);
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    transition: transform 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.275);
                    position: absolute;
                    bottom: 0;
                    right: 0;
                    z-index: 10;
                    touch-action: none;
                }
                .nv-trigger:hover { transform: scale(1.05); }
                .nv-trigger:active { transform: scale(0.95); }
                .nv-trigger.grabbing {
                    cursor: grabbing;
                    transform: scale(1.08);
                    box-shadow: 0 12px 36px rgba(0, 0, 0, 0.45);
                }
                .nv-trigger svg { width: 26px; height: 26px; fill: var(--nv-text); transition: all 0.3s; }

                /* Panel */
                .nv-panel {
                    position: absolute;
                    bottom: 72px;
                    right: 0;
                    width: 425px;
                    height: 500px;
                    max-height: 80vh;
                    background: var(--nv-bg);
                    border: 1px solid var(--nv-border);
                    border-radius: var(--nv-radius);
                    box-shadow: var(--nv-shadow);
                    display: flex;
                    flex-direction: column;
                    opacity: 0;
                    transform: translateY(18px) scale(0.97);
                    transform-origin: bottom right;
                    transition: opacity 0.22s ease, transform 0.22s ease;
                    pointer-events: none;
                    visibility: hidden;
                    backdrop-filter: blur(12px);
                    -webkit-backdrop-filter: blur(12px);
                    overflow: hidden;
                    z-index: 20;
                }

                .nv-panel.open {
                    opacity: 1;
                    transform: translateY(0) scale(1);
                    pointer-events: auto;
                    visibility: visible;
                    transition: opacity 0.28s ease, transform 0.28s ease;
                }
                .nv-panel.animating-out {
                    opacity: 0;
                    transform: translateY(18px) scale(0.97);
                    transition: opacity 0.28s ease, transform 0.28s ease;
                    pointer-events: none;
                    visibility: visible;
                }

                /* Sidebar Mode */
                .nv-panel.sidebar {
                    position: fixed;
                    top: 0;
                    bottom: 0;
                    right: 0;
                    height: 100vh;
                    max-height: 100vh;
                    border-radius: 0;
                    border-left: 1px solid var(--nv-border);
                    border-top: none;
                    border-bottom: none;
                    transform: translateX(100%);
                    opacity: 0;
                    width: 430px;
                    z-index: 99999;
                    transition: opacity 0.32s ease, transform 0.32s ease;
                }
                .nv-panel.sidebar.open {
                    transform: translateX(0);
                    opacity: 1;
                }
                .nv-panel.sidebar.animating-out {
                    transform: translateX(100%);
                    opacity: 0;
                    visibility: visible;
                    pointer-events: none;
                    transition: opacity 0.36s ease, transform 0.36s ease;
                }
                .nv-panel.sidebar.sidebar-left {
                    right: auto;
                    left: 0;
                    border-right: 1px solid var(--nv-border);
                    border-left: none;
                    transform: translateX(-100%);
                }
                .nv-panel.sidebar.sidebar-left.open {
                    transform: translateX(0);
                }
                .nv-panel.sidebar.sidebar-left.animating-out {
                    transform: translateX(-100%);
                }

                .nv-sidebar-toggle {
                    position: relative;
                    display: inline-flex;
                    align-items: center;
                    padding-right: 30px;
                }
                .nv-sidebar-arrow {
                    position: absolute;
                    right: 4px;
                    width: 24px;
                    height: 24px;
                    border-radius: 999px;
                    border: 1px solid var(--nv-border);
                    background: rgba(255, 255, 255, 0.05);
                    color: var(--nv-text-muted);
                    display: inline-flex;
                    align-items: center;
                    justify-content: center;
                    cursor: pointer;
                    opacity: 0;
                    transform: translateX(6px) scale(0.95);
                    transition: opacity 0.2s ease, transform 0.2s ease, color 0.2s ease, background 0.2s ease;
                    pointer-events: none;
                }
                .nv-sidebar-toggle:hover .nv-sidebar-arrow,
                .nv-sidebar-arrow:hover {
                    opacity: 1;
                    transform: translateX(0) scale(1);
                    pointer-events: auto;
                }
                .nv-sidebar-toggle.arrow-hidden .nv-sidebar-arrow {
                    opacity: 0;
                    transform: translateX(6px) scale(0.95);
                    pointer-events: none;
                }
                .nv-panel:not(.sidebar) .nv-sidebar-arrow {
                    display: none;
                }
                .nv-sidebar-arrow:hover {
                    color: var(--nv-text);
                    background: rgba(255, 255, 255, 0.12);
                }
                .nv-sidebar-arrow svg {
                    width: 14px;
                    height: 14px;
                    transition: transform 0.2s ease;
                }
                .nv-panel.sidebar-left .nv-sidebar-arrow svg {
                    transform: rotate(180deg);
                }

                /* Header */
                .nv-header {
                    padding: 16px;
                    background: var(--nv-bg-secondary);
                    border-bottom: 1px solid var(--nv-border);
                    align-items: center;
                    justify-content: space-between;
                }
                .nv-header-left { display: flex; align-items: center; gap: 8px; }
                .nv-header-right { display: flex; align-items: center; gap: 4px; margin-right: auto; }
                .nv-header-main { display: flex; align-items: center; justify-content: space-between; gap: 12px; }
                .nv-header-extra {
                    display: none;
                    padding: 10px 16px 12px;
                    background: var(--nv-bg-secondary);
                    border-bottom: 1px solid var(--nv-border);
                    gap: 10px;
                    align-items: center;
                    flex-wrap: wrap;
                }
                .nv-header-extra.open { display: flex; }
                .nv-ghost-pill {
                    display: none;
                    flex: 0 0 100%;
                    padding: 4px 8px;
                    border-radius: 999px;
                    background: rgba(20, 184, 166, 0.18);
                    border: 1px solid rgba(20, 184, 166, 0.5);
                    color: #a5f3fc;
                    font-size: 12px;
                    font-weight: 600;
                    letter-spacing: 0.2px;
                }

                .nv-ghost-pill.visible {
                    display: flex;
                    align-items: center;
                    gap: 6px;
                }

                .nv-ghost-pill::before {
                    content: 'G';
                    font-size: 11px;
                    font-weight: 700;
                    letter-spacing: 0.4px;
                }

                .nv-settings {
                    position: absolute;
                    inset: 58px 0 0 0;
                    background: #17171c;
                    z-index: 6;
                    display: flex;
                    flex-direction: column;
                    padding: 12px 16px 16px;
                    transform: translateX(100%);
                    transition: transform 0.3s ease;
                }
                .nv-settings.visible { transform: translateX(0); }
                .nv-panel-close {
                    position: absolute;
                    top: 10px;
                    right: 12px;
                    width: 24px;
                    height: 24px;
                    border-radius: 6px;
                    border: none;
                    background: transparent;
                    color: #f87171;
                    display: inline-flex;
                    align-items: center;
                    justify-content: center;
                    cursor: pointer;
                    transition: all 0.2s;
                }
                .nv-panel-close:hover {
                    background: transparent;
                    color: #fee2e2;
                }
                .nv-panel-close svg { width: 14px; height: 14px; }
                .nv-settings-title {
                    font-size: 12px;
                    color: var(--nv-text-muted);
                    margin-bottom: 10px;
                    letter-spacing: 0.2px;
                    padding-right: 28px;
                }
                .nv-settings-list {
                    flex: 1;
                    display: flex;
                    flex-direction: column;
                    gap: 8px;
                    overflow-y: auto;
                }
                .nv-settings-item {
                    text-align: left;
                    background: rgba(255, 255, 255, 0.04);
                    border: 1px solid var(--nv-border);
                    border-radius: 10px;
                    padding: 10px 12px;
                    color: var(--nv-text);
                    cursor: pointer;
                    transition: all 0.2s;
                }
                .nv-settings-item:hover { background: rgba(255, 255, 255, 0.08); }
                .nv-settings-item.active {
                    border-color: var(--nv-primary);
                    background: rgba(139, 92, 246, 0.15);
                }
                .nv-settings-label {
                    font-size: 13px;
                    font-weight: 600;
                }
                .nv-settings-desc {
                    font-size: 12px;
                    color: var(--nv-text-muted);
                    margin-top: 4px;
                    line-height: 1.35;
                }
                .nv-settings-danger {
                    margin-top: 12px;
                    padding-top: 12px;
                    border-top: 1px dashed var(--nv-border);
                    display: flex;
                    flex-direction: column;
                    gap: 8px;
                }
                .nv-danger-title {
                    font-size: 11px;
                    letter-spacing: 0.6px;
                    text-transform: uppercase;
                    color: #f87171;
                    font-weight: 700;
                }
                .nv-danger-desc {
                    font-size: 12px;
                    color: var(--nv-text-muted);
                    line-height: 1.35;
                }
                .nv-danger-btn {
                    align-self: flex-start;
                    border-radius: 10px;
                    border: 1px solid rgba(248, 113, 113, 0.7);
                    background: rgba(248, 113, 113, 0.12);
                    color: #fecaca;
                    padding: 8px 12px;
                    font-size: 12px;
                    font-weight: 600;
                    cursor: pointer;
                    transition: all 0.2s;
                }
                .nv-danger-btn:hover {
                    background: rgba(248, 113, 113, 0.22);
                    border-color: rgba(248, 113, 113, 0.9);
                }
                .nv-panel.ghost-mode {
                    background: radial-gradient(circle at 20% 20%, rgba(45, 212, 191, 0.08), transparent 35%), radial-gradient(circle at 80% 0%, rgba(14, 165, 233, 0.08), transparent 35%), rgba(10, 12, 20, 0.95);
                    border-color: rgba(99, 102, 241, 0.35);
                }
                .nv-panel.ghost-mode .nv-header,
                .nv-panel.ghost-mode .nv-header-extra,
                .nv-panel.ghost-mode .nv-settings {
                    background: rgba(15, 23, 42, 0.95);
                    border-color: rgba(99, 102, 241, 0.25);
                }
                .nv-panel.ghost-mode .nv-message.assistant { background: rgba(255, 255, 255, 0.06); }
                .nv-panel.ghost-mode .nv-message.user { background: linear-gradient(135deg, #14b8a6, #06b6d4); }
                .nv-panel.ghost-mode .nv-input-area {
                    background: linear-gradient(135deg, rgba(14, 165, 233, 0.14), rgba(20, 184, 166, 0.14));
                    border-top-color: rgba(99, 102, 241, 0.25);
                }
                .nv-panel.ghost-mode .nv-input {
                    border-color: rgba(99, 102, 241, 0.4);
                    background: rgba(0, 0, 0, 0.25);
                }
                .nv-panel.ghost-mode .nv-status-logo {
                    filter: drop-shadow(0 0 8px rgba(34, 211, 238, 0.8));
                }

                .nv-title {
                    font-size: 16px;
                    font-weight: 600;
                    color: var(--nv-text);
                    display: flex;
                    align-items: center;
                    gap: 8px;
                }
                .nv-title-toggle {
                    background: none;
                    border: none;
                    color: var(--nv-text-muted);
                    cursor: pointer;
                    padding: 4px;
                    border-radius: 6px;
                    display: inline-flex;
                    transition: all 0.2s;
                }
                .nv-title-toggle:hover { background: rgba(255, 255, 255, 0.1); color: var(--nv-text); }
                .nv-title-toggle svg { width: 16px; height: 16px; transition: transform 0.2s; }
                .nv-title-toggle.open svg { transform: rotate(90deg); }
                .nv-status-logo {
                    width: 35px;
                    height: 35px;
                    border-radius: 4px;
                    object-fit: contain;
                    margin-right: -2px;
                    margin-left: -10px;
                }
                .nv-status-logo.ghost-active {
                    filter: drop-shadow(0 0 6px rgba(34, 211, 238, 0.8));
                }

                .nv-btn-icon {
                    background: none;
                    border: none;
                    color: var(--nv-text-muted);
                    cursor: pointer;
                    padding: 6px;
                    border-radius: 6px;
                    transition: all 0.2s;
                    display: flex;
                }
                .nv-btn-icon:hover { background: rgba(255, 255, 255, 0.1); color: var(--nv-text); }
                .nv-btn-icon svg { width: 18px; height: 18px; }
                #nv-btn-history:hover,
                #nv-btn-history.active { color: #60a5fa; }
                .nv-btn-icon.ghost-active {
                    background: rgba(20, 184, 166, 0.18);
                    border: 1px solid rgba(20, 184, 166, 0.45);
                    color: #99f6e4;
                    box-shadow: 0 6px 16px rgba(20, 184, 166, 0.25);
                }
                .nv-header-extra .nv-btn-icon {
                    border: 1px solid var(--nv-border);
                    background: rgba(255, 255, 255, 0.04);
                    border-radius: 10px;
                    padding: 8px;
                }
                .nv-header-extra .nv-btn-icon:hover {
                    background: rgba(255, 255, 255, 0.08);
                }
                .nv-info {
                    position: absolute;
                    inset: 58px 0 0 0;
                    background: #0f111a;
                    z-index: 6;
                    display: flex;
                    flex-direction: column;
                    gap: 12px;
                    padding: 14px 16px 18px;
                    overflow-y: auto;
                    overscroll-behavior: contain;
                    scrollbar-width: thin;
                    scrollbar-color: rgba(255, 255, 255, 0.2) transparent;
                    transform: translateX(100%);
                    transition: transform 0.3s ease;
                }
                .nv-info::-webkit-scrollbar { width: 6px; }
                .nv-info::-webkit-scrollbar-thumb { background: rgba(255, 255, 255, 0.2); border-radius: 10px; }
                .nv-info.visible { transform: translateX(0); }
                .nv-info-title {
                    font-size: 14px;
                    font-weight: 700;
                    color: var(--nv-text);
                    padding-right: 28px;
                }
                .nv-info-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
                    gap: 12px;
                }
                .nv-info-card {
                    border: 1px solid var(--nv-border);
                    border-radius: 12px;
                    padding: 12px;
                    color: var(--nv-text);
                }
                .nv-info-card.variant-a {
                    background: linear-gradient(135deg, rgba(139, 92, 246, 0.1), rgba(59, 130, 246, 0.08));
                }
                .nv-info-card.variant-b {
                    background: linear-gradient(135deg, rgba(16, 185, 129, 0.08), rgba(34, 211, 238, 0.08));
                }
                .nv-info-card.variant-c {
                    background: linear-gradient(135deg, rgba(244, 114, 182, 0.08), rgba(250, 204, 21, 0.08));
                }
                .nv-info-card h4 {
                    margin: 0 0 6px 0;
                    font-size: 13px;
                    font-weight: 700;
                    color: var(--nv-text);
                }
                .nv-info-card p {
                    margin: 0;
                    font-size: 12px;
                    color: var(--nv-text-muted);
                    line-height: 1.45;
                }
                .nv-info-links {
                    display: flex;
                    flex-wrap: wrap;
                    gap: 8px;
                    margin-top: 6px;
                }
                .nv-info-link {
                    display: inline-flex;
                    align-items: center;
                    gap: 6px;
                    padding: 6px 10px;
                    border-radius: 999px;
                    border: 1px solid var(--nv-border);
                    background: rgba(255, 255, 255, 0.05);
                    color: var(--nv-text);
                    text-decoration: none;
                    font-size: 12px;
                    transition: all 0.2s;
                }
                .nv-info-link svg {
                    width: 14px;
                    height: 14px;
                }
                .nv-info-link:hover {
                    background: rgba(255, 255, 255, 0.1);
                }
                .nv-info-support {
                    margin-top: 10px;
                    padding: 12px;
                    border-radius: 14px;
                    border: 1px solid rgba(139, 92, 246, 0.35);
                    background: linear-gradient(135deg, rgba(139, 92, 246, 0.1), rgba(34, 211, 238, 0.06));
                }
                .nv-info-support-title {
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    font-size: 12px;
                    font-weight: 700;
                    color: var(--nv-text);
                }
                .nv-info-support-title svg {
                    width: 16px;
                    height: 16px;
                }
                .nv-info-support-links {
                    display: flex;
                    flex-wrap: wrap;
                    gap: 8px;
                    margin-top: 8px;
                }
                .nv-support-link {
                    display: inline-flex;
                    align-items: center;
                    gap: 8px;
                    padding: 7px 12px;
                    border-radius: 999px;
                    border: 1px solid rgba(255, 255, 255, 0.12);
                    background: rgba(255, 255, 255, 0.04);
                    color: var(--nv-text);
                    text-decoration: none;
                    font-size: 12px;
                    transition: all 0.2s;
                    --nv-support-accent: 139, 92, 246;
                }
                .nv-support-link svg {
                    width: 15px;
                    height: 15px;
                }
                .nv-support-link:hover {
                    color: rgb(var(--nv-support-accent));
                    border-color: rgba(var(--nv-support-accent), 0.55);
                    background: rgba(var(--nv-support-accent), 0.12);
                    transform: translateY(-1px);
                }

                /* Controls Row */
                .nv-controls-row {
                    display: flex;
                    align-items: center;
                    gap: 6px;
                    margin-top: 4px;
                }

                /* Model Selector */
                .nv-model-select {
                    background: transparent;
                    border: none;
                    color: var(--nv-text-muted);
                    font-size: 11px;
                    padding: 2px 4px;
                    cursor: pointer;
                    transition: all 0.2s;
                    outline: none;
                    width: fit-content;
                    opacity: 0.8;
                }
                .nv-model-select:hover { opacity: 1; color: var(--nv-text); }
                .nv-model-select option { background: var(--nv-bg-secondary); color: var(--nv-text); font-size: 12px; }
                .nv-model-select.nv-ghost-icon {
                    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%23ffffff' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M12 3l7 4v6c0 4.5-3 8.5-7 10-4-1.5-7-5.5-7-10V7z'/%3E%3C/svg%3E");
                    background-repeat: no-repeat;
                    background-position: 4px center;
                    padding-left: 22px;
                    appearance: none;
                    -webkit-appearance: none;
                    -moz-appearance: none;
                }
                .nv-model-select.nv-ghost-icon::-ms-expand { display: none; }

                /* Small Image Button */
                .nv-img-btn-small {
                    background: transparent;
                    border: none;
                    color: var(--nv-text-muted);
                    cursor: pointer;
                    padding: 2px;
                    display: flex;
                    justify-content: center;
                    transition: all 0.2s;
                    opacity: 0.7;
                    border-radius: 4px;
                }
                .nv-img-btn-small:hover { opacity: 1; color: var(--nv-text); background: rgba(255,255,255,0.05); }
                .nv-img-btn-small.active {
                    color: var(--nv-primary);
                    opacity: 1;
                    background: rgba(139, 92, 246, 0.15);
                }
                .nv-img-btn-small svg { width: 16px; height: 16px; }

                .nv-input-wrapper {
                    flex: 1;
                    display: flex;
                    flex-direction: column;
                }

                /* History Panel (Overlay) */
                .nv-history {
                    position: absolute;
                    inset: 58px 0 0 0;
                    background: #17171c;
                    z-index: 5;
                    display: flex;
                    flex-direction: column;
                    transform: translateX(100%);
                    transition: transform 0.3s ease;
                }
                .nv-history.visible { transform: translateX(0); }

                .nv-history-header {
                    padding: 12px 16px;
                    font-size: 13px;
                    color: var(--nv-text-muted);
                    text-transform: uppercase;
                    letter-spacing: 0.5px;
                    border-bottom: 1px solid var(--nv-border);
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                }
                .nv-clear-all {
                    background: none;
                    border: none;
                    color: var(--nv-text-muted);
                    cursor: pointer;
                    display: flex;
                    padding: 4px;
                    border-radius: 4px;
                    transition: all 0.2s;
                }
                .nv-clear-all:hover { color: #ef4444; background: rgba(239, 68, 68, 0.1); }

                .nv-history-list {
                    flex: 1;
                    overflow-y: auto;
                    padding: 8px;
                }

                .nv-history-item {
                    padding: 12px;
                    border-radius: 8px;
                    cursor: pointer;
                    transition: background 0.2s;
                    color: var(--nv-text-muted);
                    display: flex;
                    flex-direction: column;
                    gap: 4px;
                    margin-bottom: 4px;
                    position: relative;
                }
                .nv-history-item:hover { background: rgba(255,255,255,0.05); color: var(--nv-text); }
                .nv-history-item.active { background: rgba(139, 92, 246, 0.1); color: var(--nv-primary); }

                .nv-history-actions {
                    display: flex;
                    align-items: center;
                    gap: 8px;
                }
                .nv-history-search {
                    display: flex;
                    align-items: center;
                    gap: 6px;
                    position: relative;
                }
                .nv-search-btn {
                    background: none;
                    border: none;
                    color: var(--nv-text-muted);
                    width: 28px;
                    height: 28px;
                    border-radius: 6px;
                    display: inline-flex;
                    align-items: center;
                    justify-content: center;
                    cursor: pointer;
                    transition: all 0.2s;
                }
                .nv-search-btn:hover { color: var(--nv-primary); background: rgba(139, 92, 246, 0.12); }
                .nv-search-btn svg { width: 16px; height: 16px; }
                .nv-search-input {
                    width: 0;
                    opacity: 0;
                    padding: 6px 0;
                    border: 1px solid var(--nv-border);
                    background: rgba(255, 255, 255, 0.04);
                    color: var(--nv-text);
                    border-radius: 8px;
                    font-size: 13px;
                    transition: all 0.2s ease;
                    pointer-events: none;
                }
                .nv-history-search.active .nv-search-input {
                    width: 180px;
                    opacity: 1;
                    padding: 6px 8px;
                    pointer-events: auto;
                }
                .nv-search-input::placeholder { color: var(--nv-text-muted); }

                .nv-h-title { font-size: 14px; font-weight: 500; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; padding-right: 48px; }
                .nv-h-title.nv-h-editing {
                    width: calc(100% - 64px);
                    padding-right: 12px;
                    outline: 1.5px solid var(--nv-primary);
                    outline-offset: 2px;
                    border-radius: 8px;
                    background: rgba(255, 255, 255, 0.04);
                    cursor: text;
                    white-space: normal;
                    overflow: visible;
                    text-overflow: unset;
                    word-break: break-word;
                }
                .nv-h-date { font-size: 11px; opacity: 0.6; }

                .nv-h-rename,
                .nv-h-delete {
                    position: absolute;
                    top: 50%;
                    transform: translateY(-50%);
                    width: 24px;
                    height: 24px;
                    border-radius: 4px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    cursor: pointer;
                    opacity: 0;
                    transition: all 0.2s;
                    color: var(--nv-text-muted);
                }
                .nv-h-rename { right: 36px; }
                .nv-h-delete { right: 8px; }
                .nv-history-item:hover .nv-h-rename,
                .nv-history-item:hover .nv-h-delete { opacity: 1; }
                .nv-h-rename:hover { background: rgba(59, 130, 246, 0.15); color: #60a5fa; }
                .nv-h-delete:hover { background: rgba(239, 68, 68, 0.2); color: #ef4444; }
                .nv-h-rename svg,
                .nv-h-delete svg { width: 14px; height: 14px; }

                .nv-history-item.search-focus {
                    outline: 1px solid var(--nv-primary);
                    outline-offset: -2px;
                    background: rgba(139, 92, 246, 0.08);
                }
                .nv-h-match {
                    background: rgba(139, 92, 246, 0.25);
                    color: var(--nv-text);
                    border-radius: 4px;
                    padding: 0 2px;
                }

                .nv-history-empty {
                    padding: 16px;
                    text-align: center;
                    color: var(--nv-text-muted);
                    font-size: 13px;
                }

                /* Messages */
                .nv-messages {
                    flex: 1;
                    overflow-y: auto;
                    padding: 16px;
                    display: flex;
                    flex-direction: column;
                    gap: 12px;
                    scroll-behavior: smooth;
                }
                .nv-messages::-webkit-scrollbar { width: 6px; }
                .nv-messages::-webkit-scrollbar-thumb { background: rgba(255, 255, 255, 0.2); border-radius: 10px; }

                .nv-message {
                    max-width: 85%;
                    padding: 12px 16px;
                    border-radius: 14px;
                    font-size: 14px;
                    line-height: 1.5;
                    word-break: break-word;
                    white-space: pre-wrap;
                    animation: slideIn 0.3s ease;
                }
                @keyframes slideIn {
                    from { opacity: 0; transform: translateY(10px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                .nv-message.user { align-self: flex-end; background: var(--nv-primary); color: white; border-bottom-right-radius: 2px; }
                .nv-message.assistant { align-self: flex-start; background: rgba(255, 255, 255, 0.08); color: var(--nv-text); border-bottom-left-radius: 2px; position: relative; }

                /* Tool Rendering */
                .nv-tool {
                    margin-top: 10px;
                }
                .nv-tool:first-child {
                    margin-top: 0;
                }
                .nv-tool-label {
                    font-size: 10px;
                    text-transform: uppercase;
                    letter-spacing: 0.08em;
                    color: var(--nv-text-muted);
                    margin-bottom: 6px;
                }
                .nv-tool-label-row {
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    margin-bottom: 6px;
                }
                .nv-tool-label-row .nv-tool-label {
                    margin-bottom: 0;
                }
                .nv-tool-source-link {
                    font-size: 12px;
                    color: var(--nv-text-muted);
                    text-decoration: none;
                }
                .nv-tool-source-link:hover {
                    color: var(--nv-text);
                    text-decoration: underline;
                    text-underline-offset: 2px;
                }
                .nv-tool-caption {
                    font-size: 12px;
                    color: var(--nv-text-muted);
                    margin-top: 6px;
                }
                .nv-md-p {
                    margin: 0 0 8px;
                }
                .nv-md-p:last-child {
                    margin-bottom: 0;
                }
                .nv-md-h1,
                .nv-md-h2,
                .nv-md-h3,
                .nv-md-h4,
                .nv-md-h5,
                .nv-md-h6 {
                    margin: 0 0 8px;
                    font-weight: 700;
                    line-height: 1.25;
                }
                .nv-md-h1 { font-size: 18px; }
                .nv-md-h2 { font-size: 16px; }
                .nv-md-h3 { font-size: 15px; }
                .nv-md-h4 { font-size: 14px; }
                .nv-md-h5 { font-size: 13px; }
                .nv-md-h6 { font-size: 12px; text-transform: uppercase; letter-spacing: 0.04em; }
                .nv-md-hr {
                    border: none;
                    border-top: 1px solid var(--nv-border);
                    margin: 8px 0;
                }
                .nv-md-list {
                    margin: 0 0 8px 18px;
                    padding: 0;
                }
                .nv-md-list li {
                    margin: 4px 0;
                }
                .nv-md-quote {
                    margin: 0 0 8px;
                    padding: 6px 10px;
                    border-left: 2px solid var(--nv-primary);
                    background: rgba(255, 255, 255, 0.06);
                    border-radius: 8px;
                }
                .nv-tool-attribution {
                    font-size: 11px;
                    color: var(--nv-text-muted);
                }
                .nv-tool-attribution a {
                    color: inherit;
                    text-decoration: underline;
                    text-underline-offset: 2px;
                }
                .nv-tool-image img {
                    width: 100%;
                    display: block;
                    border-radius: 10px;
                    border: 1px solid var(--nv-border);
                }
                .nv-image-frame {
                    position: relative;
                }
                .nv-image-actions {
                    position: absolute;
                    top: 8px;
                    right: 8px;
                    display: flex;
                    gap: 6px;
                    opacity: 0;
                    pointer-events: none;
                    transition: opacity 0.2s ease;
                }
                .nv-image-frame:hover .nv-image-actions,
                .nv-image-frame:focus-within .nv-image-actions {
                    opacity: 1;
                    pointer-events: auto;
                }
                .nv-image-action {
                    width: 28px;
                    height: 28px;
                    border-radius: 8px;
                    border: 1px solid var(--nv-border);
                    background: rgba(12, 17, 23, 0.75);
                    color: var(--nv-text);
                    display: inline-flex;
                    align-items: center;
                    justify-content: center;
                    cursor: pointer;
                    transition: all 0.2s ease;
                }
                .nv-image-action:hover {
                    color: var(--nv-primary);
                    background: rgba(12, 17, 23, 0.9);
                }
                .nv-image-action svg {
                    width: 14px;
                    height: 14px;
                }
                .nv-tool-link a {
                    display: inline-flex;
                    align-items: center;
                    gap: 6px;
                    padding: 6px 10px;
                    border-radius: 999px;
                    border: 1px solid var(--nv-border);
                    background: rgba(255, 255, 255, 0.05);
                    color: var(--nv-text);
                    text-decoration: none;
                    font-size: 12px;
                    margin-block: 2px;
                }
                .nv-tool-link a:hover { background: rgba(255, 255, 255, 0.1); }
                .nv-inline-link {
                    color: var(--nv-text);
                    text-decoration: underline;
                    text-underline-offset: 3px;
                }
                .nv-inline-link:hover { color: var(--nv-primary); }
                .nv-tool-code {
                    background: rgb(12, 17, 23);
                    border-radius: 12px;
                    border: 1px solid var(--nv-border);
                    padding: 10px;
                }
                .nv-code-header {
                    display: flex;
                    justify-content: space-between;
                    font-size: 11px;
                    color: var(--nv-text-muted);
                    margin-bottom: 8px;
                    align-items: center;
                    gap: 8px;
                }
                .nv-code-left {
                    display: inline-flex;
                    align-items: center;
                    gap: 6px;
                }
                .nv-code-label { text-transform: uppercase; letter-spacing: 0.04em; }
                .nv-code-copy {
                    background: transparent;
                    border: none;
                    border-radius: 4px;
                    width: 24px;
                    height: 24px;
                    display: inline-flex;
                    align-items: center;
                    justify-content: center;
                    color: var(--nv-text-muted);
                    cursor: pointer;
                    transition: all 0.2s;
                }
                .nv-code-copy:hover { color: var(--nv-primary); background: rgba(139, 92, 246, 0.08); }
                .nv-code-copy svg { width: 14px; height: 14px; }
                .nv-code-lang { font-variant: small-caps; }
                .nv-code-keyword { color: #c084fc; }
                .nv-code-string { color: #86efac; }
                .nv-code-number { color: #f472b6; }
                .nv-code-comment { color: #9ca3af; font-style: italic; }
                .nv-code-plain { color: var(--nv-text); }
                .hljs { display: block; overflow-x: auto; padding: 0; background: transparent; color: var(--nv-text); }
                .hljs-keyword, .hljs-meta-keyword { color: #c084fc; }
                .hljs-string, .hljs-attr, .hljs-attribute { color: #86efac; }
                .hljs-number, .hljs-literal { color: #f472b6; }
                .hljs-comment { color: #9ca3af; font-style: italic; }
                .nv-tool-code pre {
                    margin: 0;
                    padding: 0;
                    overflow-x: auto;
                    font-size: 12px;
                    line-height: 1.5;
                    font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace;
                    color: var(--nv-text);
                }
                .nv-code-block {
                    background: rgb(12, 17, 23);
                    border-radius: 12px;
                    border: 1px solid var(--nv-border);
                    padding: 10px;
                    margin-top: 10px;
                }
                .nv-code-block:first-child { margin-top: 0; }
                .nv-code-block pre {
                    margin: 0;
                    padding: 0;
                    overflow-x: auto;
                    font-size: 12px;
                    line-height: 1.5;
                    font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace;
                }
                .nv-inline-code {
                    font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace;
                    font-size: 12px;
                    background: rgba(0, 0, 0, 0.35);
                    border: 1px solid var(--nv-border);
                    border-radius: 6px;
                    padding: 1px 6px;
                }

                /* Version Tabs */
                .nv-version-tabs {
                    display: flex;
                    gap: 4px;
                    margin-bottom: 8px;
                    padding-bottom: 8px;
                    border-bottom: 1px solid rgba(255, 255, 255, 0.05);
                    overflow-x: auto;
                    max-width: 100%;
                    scrollbar-width: thin;
                    scrollbar-color: rgba(255, 255, 255, 0.2) transparent;
                }
                .nv-version-tabs::-webkit-scrollbar { height: 4px; }
                .nv-version-tabs::-webkit-scrollbar-track { background: transparent; }
                .nv-version-tabs::-webkit-scrollbar-thumb { background: rgba(255, 255, 255, 0.2); border-radius: 2px; }

                .nv-version-tab {
                    min-width: 24px;
                    height: 24px;
                    padding: 0 8px;
                    border-radius: 4px;
                    background: rgba(255, 255, 255, 0.05);
                    border: 1px solid var(--nv-border);
                    color: var(--nv-text-muted);
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 11px;
                    transition: all 0.2s;
                    flex-shrink: 0;
                    white-space: nowrap;
                }
                .nv-version-tab:hover { background: rgba(255, 255, 255, 0.1); color: var(--nv-text); }
                .nv-version-tab.active {
                    background: var(--nv-primary);
                    color: white;
                    border-color: var(--nv-primary);
                }

                /* Message Actions */
                .nv-message-actions {
                    display: flex;
                    gap: 6px;
                    margin-top: 8px;
                    padding-top: 8px;
                    border-top: 1px solid rgba(255, 255, 255, 0.05);
                }

                .nv-action-btn {
                    padding: 6px 12px;
                    border-radius: 6px;
                    background: rgba(255, 255, 255, 0.05);
                    border: 1px solid var(--nv-border);
                    color: var(--nv-text-muted);
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    gap: 6px;
                    transition: all 0.2s;
                    font-size: 12px;
                }
                .nv-action-btn:hover { background: rgba(255, 255, 255, 0.1); color: var(--nv-text); }
                .nv-action-btn svg { width: 14px; height: 14px; }
                .nv-action-btn.nv-copy-success,
                .nv-code-copy.nv-copy-success {
                    color: #22c55e;
                    background: rgba(34, 197, 94, 0.12);
                    border-color: rgba(34, 197, 94, 0.4);
                    transform: scale(1.03);
                }
                .nv-action-btn.nv-copy-success-primary,
                .nv-code-copy.nv-copy-success-primary {
                    color: var(--nv-primary);
                    background: rgba(139, 92, 246, 0.14);
                    border-color: rgba(139, 92, 246, 0.45);
                    transform: scale(1.03);
                }
                .nv-action-btn.nv-copy-success svg,
                .nv-action-btn.nv-copy-success-primary svg,
                .nv-code-copy.nv-copy-success svg,
                .nv-code-copy.nv-copy-success-primary svg {
                    animation: nv-copy-pop 0.25s ease-out;
                }

                @keyframes nv-copy-pop {
                    0% { transform: scale(0.9); opacity: 0.7; }
                    100% { transform: scale(1); opacity: 1; }
                }

                /* Inline Loading */
                .nv-inline-loading {
                    display: flex;
                    gap: 4px;
                    padding: 12px 0;
                    opacity: 0.6;
                }
                .nv-inline-loading .dot {
                    width: 6px;
                    height: 6px;
                    background: var(--nv-text-muted);
                    border-radius: 50%;
                    animation: bounce 1.4s infinite ease-in-out;
                }
                .nv-inline-loading .dot:nth-child(1) { animation-delay: -0.32s; }
                .nv-inline-loading .dot:nth-child(2) { animation-delay: -0.16s; }

                /* Input Area */
                .nv-input-area {
                    padding: 16px;
                    flex-wrap: wrap;
                    border-top: 1px solid var(--nv-border);
                    display: flex;
                    gap: 10px;
                    background: var(--nv-bg-secondary);
                }
                .nv-input {
                    flex: 1;
                    background: rgba(0, 0, 0, 0.2);
                    border: 1px solid var(--nv-border);
                    border-radius: 24px;
                    padding: 10px 16px;
                    color: var(--nv-text);
                    font-size: 14px;
                    outline: none;
                    transition: border-color 0.2s;
                    min-height: 42px;
                    resize: none;
                    overflow-y: hidden;
                    line-height: 1.5;
                }
                .nv-input:focus { border-color: var(--nv-primary); }
                .nv-send-btn {
                    width: 40px;
                    height: 40px;
                    border-radius: 50%;
                    background: var(--nv-primary);
                    border: none;
                    color: white;
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    transition: all 0.2s;
                }
                .nv-send-btn:hover { background: var(--nv-primary-hover); }
                .nv-send-btn:disabled { opacity: 0.5; cursor: not-allowed; }

                /* Typing Indicator */
                .typing-indicator {
                    display: flex;
                    gap: 4px;
                    padding: 8px 12px;
                    background: rgba(255,255,255,0.05);
                    border-radius: 12px;
                    align-self: flex-start;
                    margin-bottom: 8px;
                    display: none;
                }
                .typing-indicator.visible { display: flex; }
                .dot {
                    width: 6px;
                    height: 6px;
                    background: var(--nv-text-muted);
                    border-radius: 50%;
                    animation: bounce 1.4s infinite ease-in-out;
                }
                .dot:nth-child(1) { animation-delay: -0.32s; }
                .dot:nth-child(2) { animation-delay: -0.16s; }
                @keyframes bounce { 0%, 80%, 100% { transform: scale(0); } 40% { transform: scale(1); } }

                /* Modal */
                .nv-modal-overlay {
                    position: absolute;
                    inset: 0;
                    background: rgba(0, 0, 0, 0.6);
                    backdrop-filter: blur(4px);
                    -webkit-backdrop-filter: blur(4px);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    opacity: 0;
                    pointer-events: none;
                    transition: opacity 0.2s ease;
                    z-index: 100;
                }
                .nv-modal-overlay.visible { opacity: 1; pointer-events: auto; }

                .nv-modal {
                    background: var(--nv-bg-secondary);
                    padding: 24px;
                    border-radius: 16px;
                    width: 85%;
                    max-width: 300px;
                    text-align: center;
                    border: 1px solid var(--nv-border);
                    box-shadow: 0 10px 40px rgba(0,0,0,0.5);
                    transform: scale(0.95);
                    transition: transform 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.275);
                }
                .nv-modal-overlay.visible .nv-modal { transform: scale(1); }

                .nv-modal-text {
                    color: var(--nv-text);
                    font-size: 15px;
                    margin-bottom: 20px;
                    line-height: 1.5;
                }

                .nv-modal-actions {
                    display: flex;
                    gap: 10px;
                    justify-content: center;
                }

                .nv-btn {
                    padding: 8px 16px;
                    border-radius: 8px;
                    font-size: 13px;
                    font-weight: 500;
                    cursor: pointer;
                    border: none;
                    transition: all 0.2s;
                }
                .nv-btn-secondary {
                    background: rgba(255,255,255,0.1);
                    color: var(--nv-text);
                }
                .nv-btn-secondary:hover { background: rgba(255,255,255,0.15); }

                .nv-btn-danger {
                    background: #ef4444;
                    color: white;
                }
                .nv-btn-danger:hover { background: #dc2626; }
                /* Image Button */
                .nv-img-btn {
                    width: 40px;
                    height: 40px;
                    border-radius: 50%;
                    background: rgba(255,255,255,0.1);
                    border: none;
                    color: var(--nv-text-muted);
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    transition: all 0.2s;
                    margin-right: 8px;
                }
                .nv-img-btn:hover { background: rgba(255,255,255,0.15); color: var(--nv-text); }
                .nv-img-btn.active {
                    background: var(--nv-primary);
                    color: white;
                }

`;
