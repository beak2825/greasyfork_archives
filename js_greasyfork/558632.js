// ==UserScript==
// @name         DeepSeek Theme Detection Tester
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Test what DeepSeek uses for theme switching
// @match        https://chat.deepseek.com
// @match        https://chat.deepseek.com/*
// @grant        none
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/558632/DeepSeek%20Theme%20Detection%20Tester.user.js
// @updateURL https://update.greasyfork.org/scripts/558632/DeepSeek%20Theme%20Detection%20Tester.meta.js
// ==/UserScript==

(function() {
    'use strict';
    
    // Wait for page to load
    window.addEventListener('load', function() {
        setTimeout(runThemeDetectionTest, 1000);
    });
    
    function runThemeDetectionTest() {
        console.log('=== DEEPSEEK THEME DETECTION TEST ===');
        console.log('Switch between light and dark mode on DeepSeek, then check the results below:\n');
        
        // Test 1: HTML element attributes
        console.log('1. HTML ELEMENT CHECKS:');
        const html = document.documentElement;
        console.log('   - data-theme:', html.getAttribute('data-theme'));
        console.log('   - data-mode:', html.getAttribute('data-mode'));
        console.log('   - theme:', html.getAttribute('theme'));
        console.log('   - class:', html.className);
        console.log('   - All attributes:', Array.from(html.attributes).map(a => `${a.name}="${a.value}"`).join(', '));
        
        // Test 2: Body element
        console.log('\n2. BODY ELEMENT CHECKS:');
        const body = document.body;
        if (body) {
            console.log('   - class:', body.className);
            console.log('   - All attributes:', Array.from(body.attributes).map(a => `${a.name}="${a.value}"`).join(', '));
        }
        
        // Test 3: Computed styles
        console.log('\n3. COMPUTED STYLES:');
        console.log('   - HTML background:', window.getComputedStyle(html).backgroundColor);
        console.log('   - Body background:', window.getComputedStyle(body).backgroundColor);
        console.log('   - Body color:', window.getComputedStyle(body).color);
        
        // Test 4: CSS Variables
        console.log('\n4. CSS VARIABLES (--):');
        const styles = window.getComputedStyle(html);
        const cssVars = [];
        for (let i = 0; i < styles.length; i++) {
            const prop = styles[i];
            if (prop.startsWith('--')) {
                const value = styles.getPropertyValue(prop);
                if (value.includes('theme') || value.includes('dark') || value.includes('light') || 
                    prop.includes('theme') || prop.includes('dark') || prop.includes('light') ||
                    prop.includes('bg') || prop.includes('background') || prop.includes('color')) {
                    cssVars.push(`   - ${prop}: ${value}`);
                }
            }
        }
        if (cssVars.length > 0) {
            console.log(cssVars.join('\n'));
        } else {
            console.log('   - No theme-related CSS variables found');
        }
        
        // Test 5: Look for theme-related elements
        console.log('\n5. THEME SWITCHER ELEMENTS:');
        const themeButtons = document.querySelectorAll('[class*="theme"], [class*="dark"], [class*="light"], button[aria-label*="theme"]');
        if (themeButtons.length > 0) {
            themeButtons.forEach((btn, i) => {
                console.log(`   - Button ${i + 1}:`, btn.className, btn.getAttribute('aria-label'));
            });
        } else {
            console.log('   - No obvious theme switcher found');
        }
        
        // Test 6: Meta tags
        console.log('\n6. META TAGS:');
        const metaTheme = document.querySelector('meta[name="theme-color"]');
        const metaColorScheme = document.querySelector('meta[name="color-scheme"]');
        console.log('   - theme-color:', metaTheme ? metaTheme.content : 'not found');
        console.log('   - color-scheme:', metaColorScheme ? metaColorScheme.content : 'not found');
        
        // Test 7: System preference
        console.log('\n7. SYSTEM PREFERENCE:');
        console.log('   - prefers-color-scheme: dark?', window.matchMedia('(prefers-color-scheme: dark)').matches);
        console.log('   - prefers-color-scheme: light?', window.matchMedia('(prefers-color-scheme: light)').matches);
        
        console.log('\n=== END TEST ===');
        console.log('Now switch DeepSeek theme and run: runThemeDetectionTest() again');
        
        // Make function available globally
        window.runThemeDetectionTest = runThemeDetectionTest;
    }
    
    // Setup observer to catch changes
    const observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            if (mutation.type === 'attributes') {
                console.log('🔔 Attribute changed on', mutation.target.tagName, ':', mutation.attributeName, '=', mutation.target.getAttribute(mutation.attributeName));
            }
        });
    });
    
    // Start observing once DOM is ready
    if (document.documentElement) {
        observer.observe(document.documentElement, { attributes: true });
    }
    if (document.body) {
        observer.observe(document.body, { attributes: true });
    }
    
    console.log('✅ Theme Detection Tester loaded. The test will run automatically in 1 second.');
    console.log('💡 Any attribute changes will be logged with 🔔');
})();