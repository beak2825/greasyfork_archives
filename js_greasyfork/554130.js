// ==UserScript==

// @name         Seiko Mod Parts Finder & Guide
// @name:en      Seiko Mod Parts Finder & Guide
// @version      1.3
// @description:en  Enhance your Seiko watch shopping experience with instant access to mod parts, custom options, and modification guides. Perfect for Seiko modding enthusiasts!
// @author       SkyrimWrist
// @match        https://skyrimwrist.com/*
// @match        https://skyrimwrist.uk/*
// @grant        GM_addStyle
// @grant        GM_xmlhttpRequest
// @license      MIT
// @namespace http://tampermonkey.net/
// @description Enhance your Seiko watch shopping experience with instant access to mod parts, custom options, and modification guides. Perfect for Seiko modding enthusiasts!
// @downloadURL https://update.greasyfork.org/scripts/554130/Seiko%20Mod%20Parts%20Finder%20%20Guide.user.js
// @updateURL https://update.greasyfork.org/scripts/554130/Seiko%20Mod%20Parts%20Finder%20%20Guide.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Configuration
    const CONFIG = {
        triggerKeywords: [
            'seiko', 'skx', 'skx007', 'skx009', 'skx013',
            'turtle', 'samurai', 'monster', 'alpinist',
            'mod', 'nh35', 'nh36', '4r36', '7s26'
        ],
        resourceUrl: 'https://skyrimwrist.com', // Your website
        modGuideUrl: 'https://skyrimwrist.com/collections/seiko-mod-watches',
        customWatchesUrl: 'https://skyrimwrist.com/collections/custom-seiko-watches'
    };

    // CSS Styles
    GM_addStyle(`
        #seiko-mod-helper {
            position: fixed;
            bottom: 20px;
            right: 20px;
            width: 320px;
            background: linear-gradient(135deg, #1e3c72 0%, #2a5298 100%);
            border-radius: 12px;
            box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
            z-index: 999999;
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif;
            color: #ffffff;
            transition: transform 0.3s ease, opacity 0.3s ease;
        }

        #seiko-mod-helper.minimized {
            transform: translateY(calc(100% - 50px));
        }

        .smh-header {
            padding: 15px;
            border-bottom: 1px solid rgba(255, 255, 255, 0.2);
            cursor: pointer;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }

        .smh-title {
            font-size: 16px;
            font-weight: 600;
            margin: 0;
        }

        .smh-toggle {
            background: rgba(255, 255, 255, 0.2);
            border: none;
            color: white;
            width: 24px;
            height: 24px;
            border-radius: 50%;
            cursor: pointer;
            font-size: 18px;
            line-height: 1;
            transition: background 0.2s;
        }

        .smh-toggle:hover {
            background: rgba(255, 255, 255, 0.3);
        }

        .smh-content {
            padding: 15px;
            max-height: 400px;
            overflow-y: auto;
        }

        .smh-section {
            margin-bottom: 15px;
        }

        .smh-section-title {
            font-size: 13px;
            font-weight: 600;
            margin-bottom: 8px;
            color: #ffd700;
        }

        .smh-link {
            display: block;
            padding: 10px 12px;
            margin-bottom: 6px;
            background: rgba(255, 255, 255, 0.1);
            border-radius: 6px;
            text-decoration: none;
            color: #ffffff;
            font-size: 13px;
            transition: all 0.2s;
            border-left: 3px solid transparent;
        }

        .smh-link:hover {
            background: rgba(255, 255, 255, 0.2);
            border-left-color: #ffd700;
            transform: translateX(3px);
        }

        .smh-link-icon {
            margin-right: 6px;
        }

        .smh-info {
            font-size: 11px;
            color: rgba(255, 255, 255, 0.7);
            line-height: 1.4;
            margin-bottom: 12px;
        }

        .smh-badge {
            display: inline-block;
            padding: 2px 8px;
            background: rgba(255, 215, 0, 0.2);
            border-radius: 10px;
            font-size: 10px;
            color: #ffd700;
            margin-left: 6px;
        }

        .smh-close {
            position: absolute;
            top: 10px;
            right: 45px;
            background: rgba(255, 255, 255, 0.15);
            border: none;
            color: white;
            width: 24px;
            height: 24px;
            border-radius: 50%;
            cursor: pointer;
            font-size: 16px;
            line-height: 1;
            transition: background 0.2s;
        }

        .smh-close:hover {
            background: rgba(255, 0, 0, 0.5);
        }

        @keyframes slideIn {
            from {
                transform: translateX(400px);
                opacity: 0;
            }
            to {
                transform: translateX(0);
                opacity: 1;
            }
        }

        #seiko-mod-helper.show {
            animation: slideIn 0.4s ease-out;
        }
    `);

    // Check if page content contains Seiko-related keywords
    function isRelevantPage() {
        const pageText = document.body.innerText.toLowerCase();
        const pageTitle = document.title.toLowerCase();
        const combinedText = pageText + ' ' + pageTitle;

        return CONFIG.triggerKeywords.some(keyword =>
            combinedText.includes(keyword.toLowerCase())
        );
    }

    // Create the helper widget
    function createWidget() {
        const widget = document.createElement('div');
        widget.id = 'seiko-mod-helper';
        widget.className = 'show';

        widget.innerHTML = `
            <div class="smh-header">
                <h3 class="smh-title">⌚ Seiko Mod Helper</h3>
                <button class="smh-close" title="Close">×</button>
                <button class="smh-toggle" title="Toggle">−</button>
            </div>
            <div class="smh-content">
                <div class="smh-section">
                    <div class="smh-info">
                        💡 Looking for Seiko mod parts or custom watches? Get expert guidance and quality parts!
                    </div>
                </div>

                <div class="smh-section">
                    <div class="smh-section-title">🔧 Seiko Mod Watches</div>
                    <a href="${CONFIG.modGuideUrl}" target="_blank" class="smh-link">
                        <span class="smh-link-icon">📚</span>
                        Complete Seiko Mod Collection
                        <span class="smh-badge">Popular</span>
                    </a>
                    <a href="${CONFIG.modGuideUrl}?filter=skx" target="_blank" class="smh-link">
                        <span class="smh-link-icon">⚙️</span>
                        SKX Mod Parts & Builds
                    </a>
                </div>

                <div class="smh-section">
                    <div class="smh-section-title">✨ Custom Seiko Watches</div>
                    <a href="${CONFIG.customWatchesUrl}" target="_blank" class="smh-link">
                        <span class="smh-link-icon">🎨</span>
                        Custom Seiko Watches Gallery
                        <span class="smh-badge">New</span>
                    </a>
                    <a href="${CONFIG.resourceUrl}/pages/seiko-mod-guide" target="_blank" class="smh-link">
                        <span class="smh-link-icon">📖</span>
                        Seiko Modding Guide
                    </a>
                </div>

                <div class="smh-section">
                    <div class="smh-section-title">🛠️ Quick Resources</div>
                    <a href="${CONFIG.resourceUrl}/collections/watch-hands" target="_blank" class="smh-link">
                        <span class="smh-link-icon">👉</span>
                        Watch Hands & Dials
                    </a>
                    <a href="${CONFIG.resourceUrl}/collections/watch-cases" target="_blank" class="smh-link">
                        <span class="smh-link-icon">📦</span>
                        Cases & Bezels
                    </a>
                </div>

                <div class="smh-info" style="text-align: center; margin-top: 15px; padding-top: 15px; border-top: 1px solid rgba(255,255,255,0.2);">
                    Powered by <a href="${CONFIG.resourceUrl}" target="_blank" style="color: #ffd700; text-decoration: none; font-weight: 600;">SkyrimWrist</a> - Your Seiko Mod Expert
                </div>
            </div>
        `;

        document.body.appendChild(widget);

        // Add event listeners
        const toggleBtn = widget.querySelector('.smh-toggle');
        const closeBtn = widget.querySelector('.smh-close');
        const header = widget.querySelector('.smh-header');

        toggleBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            widget.classList.toggle('minimized');
            toggleBtn.textContent = widget.classList.contains('minimized') ? '+' : '−';
        });

        closeBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            widget.style.display = 'none';
            // Store user preference
            localStorage.setItem('seikoModHelperClosed', 'true');
        });

        // Track link clicks (optional analytics)
        widget.querySelectorAll('.smh-link').forEach(link => {
            link.addEventListener('click', () => {
                console.log('Seiko Mod Helper: Link clicked -', link.href);
            });
        });
    }

    // Initialize
    function init() {
        // Check if user previously closed the widget
        if (localStorage.getItem('seikoModHelperClosed') === 'true') {
            // Reset after 24 hours
            const closedTime = localStorage.getItem('seikoModHelperClosedTime');
            if (!closedTime || Date.now() - parseInt(closedTime) > 24 * 60 * 60 * 1000) {
                localStorage.removeItem('seikoModHelperClosed');
            } else {
                return; // Don't show widget
            }
        }

        // Only show on relevant pages
        if (isRelevantPage()) {
            // Wait for page to load
            if (document.readyState === 'loading') {
                document.addEventListener('DOMContentLoaded', createWidget);
            } else {
                createWidget();
            }
        }
    }

    // Run script
    init();
})();
