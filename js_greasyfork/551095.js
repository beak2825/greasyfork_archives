// ==UserScript==
// @name         GGN Theme Switcher
// @namespace    http://tampermonkey.net/
// @version      2.1
// @description  Modify page body class to specified class and provide theme switching functionality
// @author       Robin27
// @license      MIT
// @match        *://gazellegames.net/*
// @match        *://*.gazellegames.net/*
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_registerMenuCommand
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/551095/GGN%20Theme%20Switcher.user.js
// @updateURL https://update.greasyfork.org/scripts/551095/GGN%20Theme%20Switcher.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // ===== Configuration Area =====
    // Get configuration from storage, use default values if not exists
    let TARGET_BODY_CLASS = GM_getValue('TARGET_BODY_CLASS', '');
    // ==============================

    // Register configuration menu commands
    GM_registerMenuCommand('Configure Target Theme Class', function() {
        const newClassName = prompt('Enter target theme class name (e.g.: master_3944):', TARGET_BODY_CLASS);
        if (newClassName !== null && newClassName.trim() !== '') {
            TARGET_BODY_CLASS = newClassName.trim();
            GM_setValue('TARGET_BODY_CLASS', TARGET_BODY_CLASS);
            alert('Configuration saved! Refresh the page to take effect.\nCurrent setting: ' + TARGET_BODY_CLASS);
            console.log('✅ Theme class name updated to:', TARGET_BODY_CLASS);
        }
    });

    // Theme ID list - all theme IDs extracted from comments
    const THEME_IDS = [
        // FRANCHISE type
        'franchise_3', 'franchise_16', 'franchise_19', 'franchise_50', 'franchise_53', 'franchise_55', 'franchise_57', 'franchise_58', 'franchise_65', 'franchise_75', 'franchise_91', 'franchise_126', 'franchise_135', 'franchise_179', 'franchise_198', 'franchise_211', 'franchise_344', 'franchise_360', 'franchise_491', 'franchise_587', 'franchise_595', 'franchise_646', 'franchise_833', 'franchise_836', 'franchise_896', 'franchise_986', 'franchise_1519', 'franchise_2521', 'franchise_2773', 'franchise_3155', 'franchise_5276', 'franchise_6816', 'franchise_9300', 'franchise_12545', 'franchise_12565',
        // MASTER type
        'master_117', 'master_465', 'master_680', 'master_691', 'master_904', 'master_2639', 'master_2940', 'master_3073', 'master_3787', 'master_3805', 'master_3944', 'master_4715', 'master_4742', 'master_4752', 'master_5127', 'master_5154', 'master_6427', 'master_6928', 'master_7718', 'master_7884', 'master_15933', 'master_20225', 'master_23228', 'master_29116', 'master_30510', 'master_39874', 'master_43997', 'master_50731', 'master_56065', 'master_65286', 'master_99091',
        // SERIES type
        'series_11', 'series_12', 'series_22', 'series_26', 'series_27', 'series_31', 'series_35', 'series_66', 'series_70', 'series_169', 'series_177', 'series_178', 'series_183', 'series_184', 'series_185', 'series_188', 'series_191', 'series_196', 'series_204', 'series_205', 'series_208', 'series_228', 'series_234', 'series_237', 'series_260', 'series_268', 'series_279', 'series_291', 'series_298', 'series_302', 'series_327', 'series_418', 'series_483', 'series_548', 'series_555', 'series_565', 'series_575', 'series_581', 'series_630', 'series_827', 'series_857', 'series_877', 'series_882', 'series_885', 'series_987', 'series_1109', 'series_1316', 'series_1434', 'series_1503', 'series_2786', 'series_2918', 'series_3308', 'series_3327', 'series_3369', 'series_4624', 'series_4949', 'series_5588', 'series_5635', 'series_6614', 'series_7385', 'series_12344',
        // TGROUP type
        'tgroup_107', 'tgroup_172', 'tgroup_3609', 'tgroup_4231', 'tgroup_6454', 'tgroup_6526', 'tgroup_9559', 'tgroup_11495', 'tgroup_14972', 'tgroup_18505', 'tgroup_18702', 'tgroup_22694', 'tgroup_23617', 'tgroup_30661', 'tgroup_33733', 'tgroup_65589', 'tgroup_71747', 'tgroup_108726'
    ];

    // Current theme index, -1 means using default theme
    let currentThemeIndex = -1;

    console.log('🚀 GGN Page Enhancer started, target class:', GM_getValue('TARGET_BODY_CLASS', 'master_3944'));

    // High-frequency checking - using requestAnimationFrame
    function checkAndModify() {
        if (document.body) {
            const currentClass = document.body.className;
            const targetClass = GM_getValue('TARGET_BODY_CLASS', 'master_3944');
            
            // Use default theme on index.php page
            if (window.location.pathname.includes('index.php')) {
                if (currentClass === '' || currentClass === 'warned' || currentClass.includes('master_112041')) {
                    document.body.className = targetClass;
                    currentThemeIndex = -1; // Keep default state
                    console.log('✅ Homepage theme set successfully - using default theme:', targetClass);
                }
            } else {
                // Other pages use original logic
                if (currentClass === '') {
                    document.body.className = targetClass;
                    console.log('✅ Added successfully - body has no class, added "' + targetClass + '"');
                } else if (currentClass === 'warned') {
                    document.body.className = targetClass;
                    console.log('✅ Replaced successfully - from "warned" to "' + targetClass + '"');
                } else if (currentClass.includes('master_112041')) {
                    // If class contains master_112041, replace it with custom class
                    const newClass = currentClass.replace(/master_112041/g, targetClass);
                    document.body.className = newClass;
                    console.log('✅ Replaced successfully - from class containing "master_112041" to "' + targetClass + '"');
                    console.log('Original class:', currentClass, '→ New class:', newClass);
                }
            }
        }
        // If page is not fully loaded, continue checking
        if (document.readyState !== 'complete') {
            requestAnimationFrame(checkAndModify);
        } else {
            console.log('🏁 Page loading completed, script finished');
        }
    }
    // Start high-frequency checking
    checkAndModify();

    // ------------------------------------------------------------------------------------------
    // Theme switching functionality

    // Wait for specific elements to load
    function waitForElement(selector, callback) {
        const element = document.querySelector(selector);
        if (element) {
            callback(element);
        } else {
            setTimeout(() => waitForElement(selector, callback), 100);
        }
    }

    // Create theme switcher button
    function createThemeSwitcherButton() {
        // Check if on index.php page
        if (!window.location.pathname.includes('index.php')) {
            return;
        }

        // Create button element
        const themeButton = document.createElement('button');
        themeButton.id = 'ggn-theme-switcher';
        themeButton.textContent = 'Switch Theme';
        themeButton.title = 'Left click: Switch theme | Right click: Copy current theme ID';
        
        // Set button styles
        themeButton.style.cssText = `
            position: fixed;
            top: 300px;
            right: 20px;
            z-index: 9999;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            border: none;
            border-radius: 8px;
            padding: 16px 24px;
            font-size: 16px;
            font-weight: bold;
            cursor: pointer;
            box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
            transition: all 0.3s ease;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            width: 140px;
            min-height: 50px;
            display: flex;
            align-items: center;
            justify-content: center;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
        `;

        // Add hover effects
        themeButton.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-2px)';
            this.style.boxShadow = '0 6px 20px rgba(0, 0, 0, 0.3)';
        });

        themeButton.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
            this.style.boxShadow = '0 4px 15px rgba(0, 0, 0, 0.2)';
        });

        // Add left click event
        themeButton.addEventListener('click', function() {
            switchToNextTheme();
        });

        // Add right click event - copy current theme ID
        themeButton.addEventListener('contextmenu', function(e) {
            e.preventDefault(); // Prevent default context menu
            
            let currentThemeId;
            if (currentThemeIndex === -1) {
                // If still using default theme
                currentThemeId = GM_getValue('TARGET_BODY_CLASS', 'master_3944');
            } else {
                // If already switched to theme in the list
                currentThemeId = THEME_IDS[currentThemeIndex];
            }
            
            // Copy to clipboard
            navigator.clipboard.writeText(currentThemeId).then(function() {
                // Create temporary notification
                const originalText = themeButton.textContent;
                themeButton.textContent = 'Copied!';
                themeButton.style.background = 'linear-gradient(135deg, #4CAF50 0%, #45a049 100%)';
                
                // Restore after 1 second
                setTimeout(function() {
                    themeButton.textContent = originalText;
                    themeButton.style.background = 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
                }, 1000);
                
                console.log(`📋 Theme ID copied: ${currentThemeId}`);
            }).catch(function(err) {
                console.error('Copy failed:', err);
                // If clipboard API fails, use traditional method
                const textArea = document.createElement('textarea');
                textArea.value = currentThemeId;
                document.body.appendChild(textArea);
                textArea.select();
                document.execCommand('copy');
                document.body.removeChild(textArea);
                
                // Show notification
                const originalText = themeButton.textContent;
                themeButton.textContent = 'Copied!';
                themeButton.style.background = 'linear-gradient(135deg, #4CAF50 0%, #45a049 100%)';
                
                setTimeout(function() {
                    themeButton.textContent = originalText;
                    themeButton.style.background = 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
                }, 1000);
                
                console.log(`📋 Theme ID copied: ${currentThemeId}`);
            });
        });

        // Add button to page
        document.body.appendChild(themeButton);
        console.log('✅ Theme switcher button created');
    }

    // Switch to next theme
    function switchToNextTheme() {
        // If first click (starting from default theme), start from index 0
        if (currentThemeIndex === -1) {
            currentThemeIndex = 0;
        } else {
            // Move to next theme index
            currentThemeIndex = (currentThemeIndex + 1) % THEME_IDS.length;
        }
        
        const newTheme = THEME_IDS[currentThemeIndex];
        
        // Update body class
        document.body.className = newTheme;
        
        // Update button text to show current theme info
        const themeButton = document.getElementById('ggn-theme-switcher');
        if (themeButton) {
            const themeType = newTheme.split('_')[0];
            const themeNumber = newTheme.split('_')[1];
            // Use more concise display
            themeButton.textContent = `${themeType}_${themeNumber}`;
            themeButton.title = `Current theme: ${newTheme} (${currentThemeIndex + 1}/${THEME_IDS.length})`;
            
            // Button width is fixed at 140px, no need for dynamic adjustment
        }
        
        console.log(`🎨 Theme switched to: ${newTheme} (${currentThemeIndex + 1}/${THEME_IDS.length})`);
    }

    // Wait for page to load completely before creating theme switcher button
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', createThemeSwitcherButton);
    } else {
        createThemeSwitcherButton();
    }
})();
