// ==UserScript==
// @name         umingle of Uhmegle AutoSkip v3
// @namespace    http://tampermonkey.net/
// @version      3.1.0
// @description  Auto-skip chats based on pre-configured country list (195 countries enabled by default) and if "You have disconnected" appears, simulate an ESC key press after a randomized delay.
// @author       01 dev
// @match        *://uhmegle.com/*
// @match        *://umingle.com/*
// @grant        none
// @license      MIT
// @supportURL   https://discord.gg/69mE7xjghp
// @downloadURL https://update.greasyfork.org/scripts/548587/umingle%20of%20Uhmegle%20AutoSkip%20v3.user.js
// @updateURL https://update.greasyfork.org/scripts/548587/umingle%20of%20Uhmegle%20AutoSkip%20v3.meta.js
// ==/UserScript==

/**
 * ============================================================================
 *                    UHMEGLE AUTOSKIP V2
 *                   Advanced Country Filtering System
 * ============================================================================
 * 
 *                        DEVELOPED BY: 01 DEV
 *                     ★ Premium Userscript Creator ★
 * 
 * ============================================================================
 * 
 * INTRODUCTION:
 * Welcome to Uhmegle AutoSkip v2, crafted by 01 dev - a cutting-edge userscript
 * that revolutionizes your Uhmegle experience through intelligent country-based
 * filtering and advanced automation features.
 * 
 * CREATOR EXPERTISE (01 dev):
 * ✓ Advanced JavaScript Engineering
 * ✓ Modern CSS3 & Dark Theme Design
 * ✓ UI/UX Optimization & Animation
 * ✓ Browser Extension Development
 * ✓ Real-time Data Processing
 * ✓ Persistent Storage Architecture
 * 
 * TECHNICAL IMPLEMENTATION BY 01 DEV:
 * • CSS: Glass morphism dark theme with advanced animations
 * • JavaScript: Sophisticated filtering algorithms and UI interactions
 * • Design: Responsive layout with intuitive user experience
 * • Performance: Optimized code for seamless operation
 * 
 * PREMIUM FEATURES:
 * • Auto-skip 195 comprehensive country list
 * • Real-time search and intelligent filtering
 * • Bulk actions for efficient management
 * • Persistent settings with local storage
 * • Professional dark UI design
 * • Advanced disconnect detection & recovery
 * • Drag & drop panel positioning
 * • One-click Bitcoin donation integration
 * 
 * CONNECT WITH 01 DEV:
 * Discord Community: https://discord.gg/69mE7xjghp
 * Bitcoin Donations: 3EMEWx5b5wwfaf5NKAQzW1sWHDYwFGEqw2
 * 
 * ============================================================================
 *                      © 2024 01 dev - All Rights Reserved
 * ============================================================================
 */

(function() {
    'use strict';

    // -------------------------------
    // Persistent Country List Settings
    // -------------------------------

    const storageKey = 'uhmegleAutoSkipCountries';

    // Default countries to auto-skip (all enabled by default)
    const defaultAutoSkipCountries = {
        'Afghanistan': true,
        'Albania': true,
        'Algeria': true,
        'Andorra': true,
        'Angola': true,
        'Antigua and Barbuda': true,
        'Argentina': true,
        'Armenia': true,
        'Australia': true,
        'Austria': true,
        'Azerbaijan': true,
        'Bahamas': true,
        'Bahrain': true,
        'Bangladesh': true,
        'Barbados': true,
        'Belarus': true,
        'Belgium': true,
        'Belize': true,
        'Benin': true,
        'Bhutan': true,
        'Bolivia': true,
        'Bosnia and Herzegovina': true,
        'Botswana': true,
        'Brazil': true,
        'Brunei': true,
        'Bulgaria': true,
        'Burkina Faso': true,
        'Burundi': true,
        'Cabo Verde': true,
        'Cambodia': true,
        'Cameroon': true,
        'Canada': true,
        'Central African Republic': true,
        'Chad': true,
        'Chile': true,
        'China': true,
        'Colombia': true,
        'Comoros': true,
        'Congo (Congo-Brazzaville)': true,
        'Costa Rica': true,
        'Côte d\'Ivoire': true,
        'Croatia': true,
        'Cuba': true,
        'Cyprus': true,
        'Czechia (Czech Republic)': true,
        'Democratic Republic of the Congo': true,
        'Denmark': true,
        'Djibouti': true,
        'Dominica': true,
        'Dominican Republic': true,
        'Ecuador': true,
        'Egypt': true,
        'El Salvador': true,
        'Equatorial Guinea': true,
        'Eritrea': true,
        'Estonia': true,
        'Eswatini (formerly Swaziland)': true,
        'Ethiopia': true,
        'Fiji': true,
        'Finland': true,
        'France': true,
        'Gabon': true,
        'Gambia': true,
        'Georgia': true,
        'Germany': true,
        'Ghana': true,
        'Greece': true,
        'Grenada': true,
        'Guatemala': true,
        'Guinea': true,
        'Guinea-Bissau': true,
        'Guyana': true,
        'Haiti': true,
        'Holy See': true,
        'Honduras': true,
        'Hungary': true,
        'Iceland': true,
        'India': true,
        'Indonesia': true,
        'Iran': true,
        'Iraq': true,
        'Ireland': true,
        'Israel': true,
        'Italy': true,
        'Jamaica': true,
        'Japan': true,
        'Jordan': true,
        'Kazakhstan': true,
        'Kenya': true,
        'Kiribati': true,
        'Kuwait': true,
        'Kyrgyzstan': true,
        'Laos': true,
        'Latvia': true,
        'Lebanon': true,
        'Lesotho': true,
        'Liberia': true,
        'Libya': true,
        'Liechtenstein': true,
        'Lithuania': true,
        'Luxembourg': true,
        'Madagascar': true,
        'Malawi': true,
        'Malaysia': true,
        'Maldives': true,
        'Mali': true,
        'Malta': true,
        'Marshall Islands': true,
        'Mauritania': true,
        'Mauritius': true,
        'Mexico': true,
        'Micronesia': true,
        'Moldova': true,
        'Monaco': true,
        'Mongolia': true,
        'Montenegro': true,
        'Morocco': true,
        'Mozambique': true,
        'Myanmar (formerly Burma)': true,
        'Namibia': true,
        'Nauru': true,
        'Nepal': true,
        'Netherlands': true,
        'New Zealand': true,
        'Nicaragua': true,
        'Niger': true,
        'Nigeria': true,
        'North Korea (Democratic People\'s Republic of Korea)': true,
        'North Macedonia': true,
        'Norway': true,
        'Oman': true,
        'Pakistan': true,
        'Palau': true,
        'Palestine': true,
        'Panama': true,
        'Papua New Guinea': true,
        'Paraguay': true,
        'Peru': true,
        'Philippines': true,
        'Poland': true,
        'Portugal': true,
        'Qatar': true,
        'Romania': true,
        'Russia (Russian Federation)': true,
        'Rwanda': true,
        'Saint Kitts and Nevis': true,
        'Saint Lucia': true,
        'Saint Vincent and the Grenadines': true,
        'Samoa': true,
        'San Marino': true,
        'Sao Tome and Principe': true,
        'Saudi Arabia': true,
        'Senegal': true,
        'Serbia': true,
        'Seychelles': true,
        'Sierra Leone': true,
        'Singapore': true,
        'Slovakia': true,
        'Slovenia': true,
        'Solomon Islands': true,
        'Somalia': true,
        'South Africa': true,
        'South Korea (Republic of Korea)': true,
        'South Sudan': true,
        'Spain': true,
        'Sri Lanka': true,
        'Sudan': true,
        'Suriname': true,
        'Sweden': true,
        'Switzerland': true,
        'Syria': true,
        'Tajikistan': true,
        'Tanzania': true,
        'Thailand': true,
        'Timor-Leste (East Timor)': true,
        'Togo': true,
        'Tonga': true,
        'Trinidad and Tobago': true,
        'Tunisia': true,
        'Turkey': true,
        'Turkmenistan': true,
        'Tuvalu': true,
        'Uganda': true,
        'Ukraine': true,
        'United Arab Emirates': true,
        'United Kingdom': true,
        'United States': true,
        'Uruguay': true,
        'Uzbekistan': true,
        'Vanuatu': true,
        'Venezuela': true,
        'Vietnam': true,
        'Yemen': true,
        'Zambia': true,
        'Zimbabwe': true
    };

    // Retrieve stored auto-skip country settings or initialize with defaults
    let storedCountries = JSON.parse(localStorage.getItem(storageKey)) || {};
    
    // Merge stored settings with default countries (stored settings take precedence)
    let autoSkipCountries = { ...defaultAutoSkipCountries, ...storedCountries };

    // Country flag emoji mapping
    const countryFlags = {
        'Afghanistan': '🇦🇫',
        'Albania': '🇦🇱',
        'Algeria': '🇩🇿',
        'Andorra': '🇦🇩',
        'Angola': '🇦🇴',
        'Antigua and Barbuda': '🇦🇬',
        'Argentina': '🇦🇷',
        'Armenia': '🇦🇲',
        'Australia': '🇦🇺',
        'Austria': '🇦🇹',
        'Azerbaijan': '🇦🇿',
        'Bahamas': '🇧🇸',
        'Bahrain': '🇧🇭',
        'Bangladesh': '🇧🇩',
        'Barbados': '🇧🇧',
        'Belarus': '🇧🇾',
        'Belgium': '🇧🇪',
        'Belize': '🇧🇿',
        'Benin': '🇧🇯',
        'Bhutan': '🇧🇹',
        'Bolivia': '🇧🇴',
        'Bosnia and Herzegovina': '🇧🇦',
        'Botswana': '🇧🇼',
        'Brazil': '🇧🇷',
        'Brunei': '🇧🇳',
        'Bulgaria': '🇧🇬',
        'Burkina Faso': '🇧🇫',
        'Burundi': '🇧🇮',
        'Cabo Verde': '🇨🇻',
        'Cambodia': '🇰🇭',
        'Cameroon': '🇨🇲',
        'Canada': '🇨🇦',
        'Central African Republic': '🇨🇫',
        'Chad': '🇹🇩',
        'Chile': '🇨🇱',
        'China': '🇨🇳',
        'Colombia': '🇨🇴',
        'Comoros': '🇰🇲',
        'Congo (Congo-Brazzaville)': '🇨🇬',
        'Costa Rica': '🇨🇷',
        'Côte d\'Ivoire': '🇨🇮',
        'Croatia': '🇭🇷',
        'Cuba': '🇨🇺',
        'Cyprus': '🇨🇾',
        'Czechia (Czech Republic)': '🇨🇿',
        'Democratic Republic of the Congo': '🇨🇩',
        'Denmark': '🇩🇰',
        'Djibouti': '🇩🇯',
        'Dominica': '🇩🇲',
        'Dominican Republic': '🇩🇴',
        'Ecuador': '🇪🇨',
        'Egypt': '🇪🇬',
        'El Salvador': '🇸🇻',
        'Equatorial Guinea': '🇬🇶',
        'Eritrea': '🇪🇷',
        'Estonia': '🇪🇪',
        'Eswatini (formerly Swaziland)': '🇸🇿',
        'Ethiopia': '🇪🇹',
        'Fiji': '🇫🇯',
        'Finland': '🇫🇮',
        'France': '🇫🇷',
        'Gabon': '🇬🇦',
        'Gambia': '🇬🇲',
        'Georgia': '🇬🇪',
        'Germany': '🇩🇪',
        'Ghana': '🇬🇭',
        'Greece': '🇬🇷',
        'Grenada': '🇬🇩',
        'Guatemala': '🇬🇹',
        'Guinea': '🇬🇳',
        'Guinea-Bissau': '🇬🇼',
        'Guyana': '🇬🇾',
        'Haiti': '🇭🇹',
        'Holy See': '🇻🇦',
        'Honduras': '🇭🇳',
        'Hungary': '🇭🇺',
        'Iceland': '🇮🇸',
        'India': '🇮🇳',
        'Indonesia': '🇮🇩',
        'Iran': '🇮🇷',
        'Iraq': '🇮🇶',
        'Ireland': '🇮🇪',
        'Israel': '🇮🇱',
        'Italy': '🇮🇹',
        'Jamaica': '🇯🇲',
        'Japan': '🇯🇵',
        'Jordan': '🇯🇴',
        'Kazakhstan': '🇰🇿',
        'Kenya': '🇰🇪',
        'Kiribati': '🇰🇮',
        'Kuwait': '🇰🇼',
        'Kyrgyzstan': '🇰🇬',
        'Laos': '🇱🇦',
        'Latvia': '🇱🇻',
        'Lebanon': '🇱🇧',
        'Lesotho': '🇱🇸',
        'Liberia': '🇱🇷',
        'Libya': '🇱🇾',
        'Liechtenstein': '🇱🇮',
        'Lithuania': '🇱🇹',
        'Luxembourg': '🇱🇺',
        'Madagascar': '🇲🇬',
        'Malawi': '🇲🇼',
        'Malaysia': '🇲🇾',
        'Maldives': '🇲🇻',
        'Mali': '🇲🇱',
        'Malta': '🇲🇹',
        'Marshall Islands': '🇲🇭',
        'Mauritania': '🇲🇷',
        'Mauritius': '🇲🇺',
        'Mexico': '🇲🇽',
        'Micronesia': '🇫🇲',
        'Moldova': '🇲🇩',
        'Monaco': '🇲🇨',
        'Mongolia': '🇲🇳',
        'Montenegro': '🇲🇪',
        'Morocco': '🇲🇦',
        'Mozambique': '🇲🇿',
        'Myanmar (formerly Burma)': '🇲🇲',
        'Namibia': '🇳🇦',
        'Nauru': '🇳🇷',
        'Nepal': '🇳🇵',
        'Netherlands': '🇳🇱',
        'New Zealand': '🇳🇿',
        'Nicaragua': '🇳🇮',
        'Niger': '🇳🇪',
        'Nigeria': '🇳🇬',
        'North Korea (Democratic People\'s Republic of Korea)': '🇰🇵',
        'North Macedonia': '🇲🇰',
        'Norway': '🇳🇴',
        'Oman': '🇴🇲',
        'Pakistan': '🇵🇰',
        'Palau': '🇵🇼',
        'Palestine': '🇵🇸',
        'Panama': '🇵🇦',
        'Papua New Guinea': '🇵🇬',
        'Paraguay': '🇵🇾',
        'Peru': '🇵🇪',
        'Philippines': '🇵🇭',
        'Poland': '🇵🇱',
        'Portugal': '🇵🇹',
        'Qatar': '🇶🇦',
        'Romania': '🇷🇴',
        'Russia (Russian Federation)': '🇷🇺',
        'Rwanda': '🇷🇼',
        'Saint Kitts and Nevis': '🇰🇳',
        'Saint Lucia': '🇱🇨',
        'Saint Vincent and the Grenadines': '🇻🇨',
        'Samoa': '🇼🇸',
        'San Marino': '🇸🇲',
        'Sao Tome and Principe': '🇸🇹',
        'Saudi Arabia': '🇸🇦',
        'Senegal': '🇸🇳',
        'Serbia': '🇷🇸',
        'Seychelles': '🇸🇨',
        'Sierra Leone': '🇸🇱',
        'Singapore': '🇸🇬',
        'Slovakia': '🇸🇰',
        'Slovenia': '🇸🇮',
        'Solomon Islands': '🇸🇧',
        'Somalia': '🇸🇴',
        'South Africa': '🇿🇦',
        'South Korea (Republic of Korea)': '🇰🇷',
        'South Sudan': '🇸🇸',
        'Spain': '🇪🇸',
        'Sri Lanka': '🇱🇰',
        'Sudan': '🇸🇩',
        'Suriname': '🇸🇷',
        'Sweden': '🇸🇪',
        'Switzerland': '🇨🇭',
        'Syria': '🇸🇾',
        'Tajikistan': '🇹🇯',
        'Tanzania': '🇹🇿',
        'Thailand': '🇹🇭',
        'Timor-Leste (East Timor)': '🇹🇱',
        'Togo': '🇹🇬',
        'Tonga': '🇹🇴',
        'Trinidad and Tobago': '🇹🇹',
        'Tunisia': '🇹🇳',
        'Turkey': '🇹🇷',
        'Turkmenistan': '🇹🇲',
        'Tuvalu': '🇹🇻',
        'Uganda': '🇺🇬',
        'Ukraine': '🇺🇦',
        'United Arab Emirates': '🇦🇪',
        'United Kingdom': '🇬🇧',
        'United States': '🇺🇸',
        'Uruguay': '🇺🇾',
        'Uzbekistan': '🇺🇿',
        'Vanuatu': '🇻🇺',
        'Venezuela': '🇻🇪',
        'Vietnam': '🇻🇳',
        'Yemen': '🇾🇪',
        'Zambia': '🇿🇲',
        'Zimbabwe': '🇿🇼'
    };

    // Save changes to localStorage.
    function saveAutoSkipCountries() {
        localStorage.setItem(storageKey, JSON.stringify(autoSkipCountries));
    }

    // Create and style a modern dark panel for the country list
    const panel = document.createElement('div');
    panel.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        width: 340px;
        max-height: 520px;
        background: linear-gradient(145deg, #0a0a1f 0%, #1a1a2e 30%, #16213e 60%, #0f3460 100%);
        border: 2px solid rgba(100, 181, 246, 0.3);
        border-radius: 20px;
        padding: 0;
        z-index: 10000;
        box-shadow: 
            0 25px 50px rgba(0, 0, 0, 0.7),
            0 0 0 1px rgba(255, 255, 255, 0.1),
            inset 0 1px 0 rgba(255, 255, 255, 0.1);
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Inter', sans-serif;
        backdrop-filter: blur(25px);
        overflow: hidden;
        transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
        transform: translateZ(0);
    `;
    
    // Create header
    const header = document.createElement('div');
    header.style.cssText = `
        background: linear-gradient(135deg, rgba(100, 181, 246, 0.15) 0%, rgba(0, 0, 0, 0.4) 100%);
        padding: 18px 24px;
        border-bottom: 1px solid rgba(100, 181, 246, 0.3);
        display: flex;
        justify-content: space-between;
        align-items: center;
        backdrop-filter: blur(15px);
        position: relative;
    `;
    
    // Add subtle glow effect to header
    header.style.setProperty('--glow', '0 0 20px rgba(100, 181, 246, 0.2)');
    header.style.boxShadow = 'var(--glow)';
    
    const title = document.createElement('h4');
    title.innerHTML = 'AutoSkip <span style="color: #64b5f6; font-weight: 700;">v2</span>';
    title.style.cssText = `
        margin: 0;
        color: #ffffff;
        font-size: 18px;
        font-weight: 600;
        text-shadow: 0 2px 8px rgba(0, 0, 0, 0.5), 0 0 20px rgba(100, 181, 246, 0.3);
        letter-spacing: 0.8px;
        text-transform: uppercase;
    `;
    
    // Add toggle button for minimize/expand
    const toggleBtn = document.createElement('button');
    toggleBtn.innerHTML = '−';
    toggleBtn.style.cssText = `
        background: linear-gradient(135deg, rgba(100, 181, 246, 0.2) 0%, rgba(255, 255, 255, 0.1) 100%);
        border: 2px solid rgba(100, 181, 246, 0.4);
        color: #ffffff;
        width: 32px;
        height: 32px;
        border-radius: 50%;
        cursor: pointer;
        font-size: 18px;
        font-weight: bold;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
        backdrop-filter: blur(15px);
        box-shadow: 0 4px 15px rgba(100, 181, 246, 0.2);
    `;
    
    toggleBtn.addEventListener('mouseenter', () => {
        toggleBtn.style.background = 'linear-gradient(135deg, rgba(100, 181, 246, 0.4) 0%, rgba(255, 255, 255, 0.2) 100%)';
        toggleBtn.style.transform = 'scale(1.15) rotate(5deg)';
        toggleBtn.style.boxShadow = '0 8px 25px rgba(100, 181, 246, 0.4), 0 0 30px rgba(100, 181, 246, 0.3)';
        toggleBtn.style.borderColor = 'rgba(100, 181, 246, 0.6)';
    });
    toggleBtn.addEventListener('mouseleave', () => {
        toggleBtn.style.background = 'linear-gradient(135deg, rgba(100, 181, 246, 0.2) 0%, rgba(255, 255, 255, 0.1) 100%)';
        toggleBtn.style.transform = 'scale(1) rotate(0deg)';
        toggleBtn.style.boxShadow = '0 4px 15px rgba(100, 181, 246, 0.2)';
        toggleBtn.style.borderColor = 'rgba(100, 181, 246, 0.4)';
    });
    
    header.appendChild(title);
    header.appendChild(toggleBtn);
    
    // Create content container
    const content = document.createElement('div');
    content.style.cssText = `
        background: linear-gradient(180deg, rgba(10, 10, 31, 0.95) 0%, rgba(26, 26, 46, 0.9) 100%);
        max-height: 420px;
        overflow-y: auto;
        transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
        backdrop-filter: blur(15px);
        border-top: 1px solid rgba(100, 181, 246, 0.1);
    `;
    
    // Create stats bar
    const statsBar = document.createElement('div');
    statsBar.style.cssText = `
        padding: 14px 24px;
        background: linear-gradient(135deg, rgba(100, 181, 246, 0.1) 0%, rgba(15, 52, 96, 0.2) 100%);
        border-bottom: 1px solid rgba(100, 181, 246, 0.2);
        font-size: 12px;
        color: #64b5f6;
        font-weight: 600;
        text-shadow: 0 1px 3px rgba(0, 0, 0, 0.5);
    `;
    
    // Create country list container
    const countryListContainer = document.createElement('div');
    countryListContainer.id = 'countryList';
    countryListContainer.style.cssText = `
        padding: 12px;
        max-height: 320px;
        overflow-y: auto;
        background: rgba(26, 26, 46, 0.8);
    `;
    
    // Custom animations
    const animationStyle = document.createElement('style');
    animationStyle.textContent = `
        @keyframes fadeIn {
            from { opacity: 0; transform: translateY(-8px) scale(0.95); }
            to { opacity: 1; transform: translateY(0) scale(1); }
        }
        @keyframes pulse {
            0% { transform: scale(1); }
            50% { transform: scale(1.4); filter: brightness(1.5); }
            100% { transform: scale(1); }
        }
        @keyframes glow {
            0%, 100% { box-shadow: 0 0 15px rgba(100, 181, 246, 0.3); }
            50% { box-shadow: 0 0 25px rgba(100, 181, 246, 0.6); }
        }
        #countryList::-webkit-scrollbar {
            width: 10px;
        }
        #countryList::-webkit-scrollbar-track {
            background: rgba(0, 0, 0, 0.3);
            border-radius: 5px;
            border: 1px solid rgba(100, 181, 246, 0.1);
        }
        #countryList::-webkit-scrollbar-thumb {
            background: linear-gradient(135deg, rgba(100, 181, 246, 0.6) 0%, rgba(100, 181, 246, 0.8) 100%);
            border-radius: 5px;
            border: 1px solid rgba(100, 181, 246, 0.3);
        }
        #countryList::-webkit-scrollbar-thumb:hover {
            background: linear-gradient(135deg, rgba(100, 181, 246, 0.8) 0%, rgba(100, 181, 246, 1) 100%);
            box-shadow: 0 0 10px rgba(100, 181, 246, 0.5);
        }
    `;
    document.head.appendChild(animationStyle);
    
    // Create search input
    const searchContainer = document.createElement('div');
    searchContainer.style.cssText = `
        padding: 16px 20px;
        border-bottom: 1px solid rgba(100, 181, 246, 0.2);
        background: linear-gradient(135deg, rgba(0, 0, 0, 0.3) 0%, rgba(100, 181, 246, 0.05) 100%);
    `;
    
    const searchInput = document.createElement('input');
    searchInput.type = 'text';
    searchInput.placeholder = '🔍 Search countries...';
    searchInput.style.cssText = `
        width: 100%;
        padding: 12px 18px;
        border: 2px solid rgba(100, 181, 246, 0.3);
        border-radius: 15px;
        font-size: 14px;
        background: rgba(0, 0, 0, 0.4);
        color: #ffffff;
        transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
        outline: none;
        backdrop-filter: blur(10px);
        box-shadow: inset 0 2px 10px rgba(0, 0, 0, 0.3);
        font-weight: 500;
    `;
    
    searchInput.addEventListener('focus', () => {
        searchInput.style.borderColor = '#64b5f6';
        searchInput.style.boxShadow = '0 0 0 4px rgba(100, 181, 246, 0.2), inset 0 2px 10px rgba(0, 0, 0, 0.3), 0 0 30px rgba(100, 181, 246, 0.1)';
        searchInput.style.background = 'rgba(0, 0, 0, 0.5)';
        searchInput.style.transform = 'scale(1.02)';
    });
    
    searchInput.addEventListener('blur', () => {
        searchInput.style.borderColor = 'rgba(100, 181, 246, 0.3)';
        searchInput.style.boxShadow = 'inset 0 2px 10px rgba(0, 0, 0, 0.3)';
        searchInput.style.background = 'rgba(0, 0, 0, 0.4)';
        searchInput.style.transform = 'scale(1)';
    });
    
    searchContainer.appendChild(searchInput);
    
    // Create bulk actions bar
    const bulkActions = document.createElement('div');
    bulkActions.style.cssText = `
        padding: 8px 15px;
        background: rgba(88, 101, 242, 0.05);
        border-bottom: 1px solid rgba(88, 101, 242, 0.1);
        display: flex;
        gap: 8px;
        justify-content: space-between;
        align-items: center;
    `;
    
    const bulkBtnStyle = `
        padding: 6px 10px;
        border: 1px solid rgba(255, 255, 255, 0.2);
        border-radius: 8px;
        font-size: 11px;
        font-weight: 500;
        cursor: pointer;
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        color: white;
        backdrop-filter: blur(10px);
    `;
    
    const enableAllBtn = document.createElement('button');
    enableAllBtn.textContent = '✅ Enable All';
    enableAllBtn.style.cssText = bulkBtnStyle + 'background: rgba(76, 175, 80, 0.3);';
    
    const disableAllBtn = document.createElement('button');
    disableAllBtn.textContent = '❌ Disable All';
    disableAllBtn.style.cssText = bulkBtnStyle + 'background: rgba(244, 67, 54, 0.3);';
    
    const resetBtn = document.createElement('button');
    resetBtn.textContent = '🔄 Reset';
    resetBtn.style.cssText = bulkBtnStyle + 'background: rgba(255, 152, 0, 0.3);';
    
    [enableAllBtn, disableAllBtn, resetBtn].forEach(btn => {
        btn.addEventListener('mouseenter', () => {
            btn.style.transform = 'translateY(-2px) scale(1.05)';
            btn.style.boxShadow = '0 4px 15px rgba(255, 255, 255, 0.2)';
            btn.style.borderColor = 'rgba(255, 255, 255, 0.4)';
        });
        btn.addEventListener('mouseleave', () => {
            btn.style.transform = 'translateY(0) scale(1)';
            btn.style.boxShadow = 'none';
            btn.style.borderColor = 'rgba(255, 255, 255, 0.2)';
        });
    });
    
    bulkActions.appendChild(enableAllBtn);
    bulkActions.appendChild(disableAllBtn);
    bulkActions.appendChild(resetBtn);
    
    // Create footer with Discord and donation info
    const footer = document.createElement('div');
    footer.style.cssText = `
        padding: 8px 16px;
        background: rgba(0, 0, 0, 0.4);
        border-top: 1px solid rgba(255, 255, 255, 0.1);
        font-size: 10px;
        color: rgba(255, 255, 255, 0.7);
        display: flex;
        flex-direction: column;
        gap: 4px;
    `;
    
    const topRow = document.createElement('div');
    topRow.style.cssText = `
        display: flex;
        justify-content: space-between;
        align-items: center;
    `;
    
    const discordLink = document.createElement('a');
    discordLink.href = 'https://discord.gg/69mE7xjghp';
    discordLink.target = '_blank';
    discordLink.textContent = '💬 Discord';
    discordLink.style.cssText = `
        color: #7289da;
        text-decoration: none;
        font-weight: 500;
        transition: all 0.2s ease;
    `;
    
    discordLink.addEventListener('mouseenter', () => {
        discordLink.style.color = '#ffffff';
        discordLink.style.textShadow = '0 0 8px #7289da';
    });
    
    discordLink.addEventListener('mouseleave', () => {
        discordLink.style.color = '#7289da';
        discordLink.style.textShadow = 'none';
    });
    
    const donationInfo = document.createElement('span');
    donationInfo.innerHTML = '₿ <span style="cursor: pointer; color: #f7931a; font-family: monospace; font-size: 9px;" title="Click to copy Bitcoin address">3EMEWx5b5wwfaf5NKAQzW1sWHDYwFGEqw2</span>';
    
    const btcAddress = donationInfo.querySelector('span');
    btcAddress.addEventListener('click', () => {
        navigator.clipboard.writeText('3EMEWx5b5wwfaf5NKAQzW1sWHDYwFGEqw2').then(() => {
            btcAddress.style.color = '#4caf50';
            btcAddress.textContent = 'Copied!';
            setTimeout(() => {
                btcAddress.style.color = '#f7931a';
                btcAddress.textContent = '3EMEWx5b5wwfaf5NKAQzW1sWHDYwFGEqw2';
            }, 1500);
        }).catch(() => {
            // Fallback for older browsers
            const textArea = document.createElement('textarea');
            textArea.value = '3EMEWx5b5wwfaf5NKAQzW1sWHDYwFGEqw2';
            document.body.appendChild(textArea);
            textArea.select();
            document.execCommand('copy');
            document.body.removeChild(textArea);
            btcAddress.style.color = '#4caf50';
            btcAddress.textContent = 'Copied!';
            setTimeout(() => {
                btcAddress.style.color = '#f7931a';
                btcAddress.textContent = '3EMEWx5b5wwfaf5NKAQzW1sWHDYwFGEqw2';
            }, 1500);
        });
    });
    
    footer.appendChild(discordLink);
    footer.appendChild(donationInfo);
    
    // Add author credit
    const authorCredit = document.createElement('div');
    authorCredit.textContent = 'by 01 dev';
    authorCredit.style.cssText = `
        font-size: 9px;
        color: rgba(255, 255, 255, 0.5);
        font-style: italic;
        text-align: center;
        margin-top: 2px;
    `;
    footer.appendChild(authorCredit);
    
    content.appendChild(statsBar);
    content.appendChild(searchContainer);
    content.appendChild(bulkActions);
    content.appendChild(countryListContainer);
    content.appendChild(footer);
    
    panel.appendChild(header);
    panel.appendChild(content);
    document.body.appendChild(panel);
    
    // Add drag functionality
    let isDragging = false;
    let dragOffset = { x: 0, y: 0 };
    
    header.style.cursor = 'move';
    
    header.addEventListener('mousedown', (e) => {
        if (e.target === toggleBtn) return;
        isDragging = true;
        dragOffset.x = e.clientX - panel.offsetLeft;
        dragOffset.y = e.clientY - panel.offsetTop;
        panel.style.transition = 'none';
    });
    
    document.addEventListener('mousemove', (e) => {
        if (!isDragging) return;
        const newX = e.clientX - dragOffset.x;
        const newY = e.clientY - dragOffset.y;
        panel.style.left = Math.max(0, Math.min(newX, window.innerWidth - panel.offsetWidth)) + 'px';
        panel.style.top = Math.max(0, Math.min(newY, window.innerHeight - panel.offsetHeight)) + 'px';
        panel.style.right = 'auto';
    });
    
    document.addEventListener('mouseup', () => {
        if (isDragging) {
            isDragging = false;
            panel.style.transition = 'all 0.3s ease';
        }
    });
    
    // Bulk action handlers
    enableAllBtn.addEventListener('click', () => {
        Object.keys(autoSkipCountries).forEach(country => {
            autoSkipCountries[country] = true;
        });
        saveAutoSkipCountries();
        updateCountryListUI();
    });
    
    disableAllBtn.addEventListener('click', () => {
        Object.keys(autoSkipCountries).forEach(country => {
            autoSkipCountries[country] = false;
        });
        saveAutoSkipCountries();
        updateCountryListUI();
    });
    
    resetBtn.addEventListener('click', () => {
        if (confirm('Reset all countries to default settings?')) {
            autoSkipCountries = { ...defaultAutoSkipCountries };
            saveAutoSkipCountries();
            updateCountryListUI();
        }
    });
    
    // Search functionality
    let currentSearchTerm = '';
    searchInput.addEventListener('input', (e) => {
        currentSearchTerm = e.target.value.toLowerCase();
        updateCountryListUI();
    });
    let isMinimized = false;
    toggleBtn.addEventListener('click', () => {
        isMinimized = !isMinimized;
        if (isMinimized) {
            content.style.maxHeight = '0';
            content.style.padding = '0';
            toggleBtn.innerHTML = '+';
            panel.style.width = '320px';
        } else {
            content.style.maxHeight = '500px';
            content.style.padding = '';
            toggleBtn.innerHTML = '−';
            panel.style.width = '320px';
        }
    });

    // Update the panel with the list of countries and their auto-skip checkbox
    function updateCountryListUI() {
        const listDiv = document.getElementById('countryList');
        const statsBar = listDiv.parentElement.querySelector('div');
        
        // Filter countries based on search
        const filteredCountries = Object.keys(autoSkipCountries).filter(country => 
            country.toLowerCase().includes(currentSearchTerm)
        );
        
        // Calculate statistics
        const totalCountries = filteredCountries.length;
        const enabledCountries = filteredCountries.filter(country => autoSkipCountries[country]).length;
        const totalAllCountries = Object.keys(autoSkipCountries).length;
        const enabledAllCountries = Object.values(autoSkipCountries).filter(enabled => enabled).length;
        
        // Update stats bar with search info
        const searchInfo = currentSearchTerm ? ` (filtered: ${totalCountries}/${totalAllCountries})` : '';
        statsBar.innerHTML = `
            <div style="display: flex; justify-content: space-between; align-items: center;">
                <span style="font-size: 11px; opacity: 0.8;">📊 Total: ${totalAllCountries}${searchInfo}</span>
                <span style="display: flex; gap: 10px; font-size: 11px;">
                    <span style="color: #57f287;">✅ ${enabledAllCountries}</span>
                    <span style="color: #ed4245;">❌ ${totalAllCountries - enabledAllCountries}</span>
                </span>
            </div>
        `;
        
        listDiv.innerHTML = '';
        
        if (totalCountries === 0 && currentSearchTerm) {
            const noResults = document.createElement('div');
            noResults.style.cssText = `
                padding: 20px;
                text-align: center;
                color: rgba(255, 255, 255, 0.6);
                font-style: italic;
            `;
            noResults.textContent = `No countries found for "${currentSearchTerm}"`;
            listDiv.appendChild(noResults);
            return;
        }
        
        // Sort countries alphabetically
        const sortedCountries = filteredCountries.sort();
        
        sortedCountries.forEach(country => {
            const countryItem = document.createElement('div');
            countryItem.style.cssText = `
                display: flex;
                align-items: center;
                padding: 10px 12px;
                margin-bottom: 3px;
                border-radius: 8px;
                transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                cursor: pointer;
                border: 1px solid transparent;
                animation: fadeIn 0.3s ease;
                background: rgba(255, 255, 255, 0.03);
            `;
            
            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.checked = autoSkipCountries[country];
            checkbox.style.cssText = `
                margin-right: 12px;
                transform: scale(1.3);
                accent-color: #64b5f6;
            `;
            
            // Add country flag icon
            const flagIcon = document.createElement('span');
            flagIcon.textContent = countryFlags[country] || '🏳️';
            flagIcon.style.cssText = `
                font-size: 20px;
                margin-right: 10px;
                filter: drop-shadow(0 1px 3px rgba(0, 0, 0, 0.3));
                transition: all 0.2s ease;
            `;
            
            const countryLabel = document.createElement('span');
            countryLabel.innerHTML = currentSearchTerm ? 
                country.replace(new RegExp(currentSearchTerm, 'gi'), match => `<mark style="background: #ffd700; color: #000; padding: 2px 3px; border-radius: 3px; font-weight: bold;">${match}</mark>`) :
                country;
            countryLabel.style.cssText = `
                flex: 1;
                font-size: 14px;
                font-weight: 500;
                color: #ffffff;
                transition: color 0.2s ease;
            `;
            
            const statusIcon = document.createElement('span');
            statusIcon.textContent = autoSkipCountries[country] ? '🚫' : '✅';
            statusIcon.style.cssText = `
                font-size: 16px;
                margin-left: 8px;
                transition: transform 0.2s ease;
                filter: drop-shadow(0 0 3px rgba(255, 255, 255, 0.3));
            `;
            
            // Hover effects with better visual feedback
            countryItem.addEventListener('mouseenter', () => {
                countryItem.style.backgroundColor = autoSkipCountries[country] ? 
                    'rgba(244, 67, 54, 0.2)' : 'rgba(76, 175, 80, 0.2)';
                countryItem.style.borderColor = autoSkipCountries[country] ? 
                    'rgba(244, 67, 54, 0.5)' : 'rgba(76, 175, 80, 0.5)';
                countryItem.style.boxShadow = '0 2px 10px rgba(255, 255, 255, 0.1)';
                statusIcon.style.transform = 'scale(1.2)';
                flagIcon.style.transform = 'scale(1.1) rotate(5deg)';
                flagIcon.style.filter = 'drop-shadow(0 2px 8px rgba(0, 0, 0, 0.5)) brightness(1.2)';
            });
            
            countryItem.addEventListener('mouseleave', () => {
                countryItem.style.backgroundColor = 'rgba(255, 255, 255, 0.03)';
                countryItem.style.borderColor = 'transparent';
                countryItem.style.boxShadow = 'none';
                statusIcon.style.transform = 'scale(1)';
                flagIcon.style.transform = 'scale(1) rotate(0deg)';
                flagIcon.style.filter = 'drop-shadow(0 1px 3px rgba(0, 0, 0, 0.3))';
            });
            
            // Click to toggle with animation
            countryItem.addEventListener('click', (e) => {
                if (e.target !== checkbox) {
                    checkbox.click();
                }
            });
            
            checkbox.addEventListener('change', function() {
                autoSkipCountries[country] = this.checked;
                statusIcon.textContent = this.checked ? '🚫' : '✅';
                
                // Add pulse animation
                statusIcon.style.animation = 'pulse 0.3s ease';
                setTimeout(() => statusIcon.style.animation = '', 300);
                
                saveAutoSkipCountries();
                updateCountryListUI(); // Refresh to update stats
            });
            
            countryItem.appendChild(checkbox);
            countryItem.appendChild(flagIcon);
            countryItem.appendChild(countryLabel);
            countryItem.appendChild(statusIcon);
            listDiv.appendChild(countryItem);
        });
    }

    updateCountryListUI();

    // -------------------------------
    // ESC Key Simulation Functions
    // -------------------------------

    // Function to simulate one ESC key press.
    function simulateEsc() {
        const escEvent = new KeyboardEvent('keydown', {
            key: 'Escape',
            code: 'Escape',
            keyCode: 27,
            which: 27,
            bubbles: true,
            cancelable: true
        });
        document.dispatchEvent(escEvent);
    }

    // Function to simulate two ESC key presses.
    function simulateSkip() {
        console.log('Simulating ESC key presses for auto-skip...');
        simulateEsc();
        // Random delay between 400ms and 600ms.
        const randomDelay = 400 + Math.random() * 200;
        setTimeout(simulateEsc, randomDelay);
    }

    // -------------------------------
    // Monitor for Country Changes
    // -------------------------------

    let lastCountry = '';

    function checkCountry() {
        const countryElem = document.getElementById('countryName');
        if (countryElem) {
            const currentCountry = countryElem.textContent.trim();
            if (currentCountry && currentCountry !== lastCountry) {
                lastCountry = currentCountry;
                // Add new country if not already present.
                if (!(currentCountry in autoSkipCountries)) {
                    autoSkipCountries[currentCountry] = false; // default auto-skip off
                    saveAutoSkipCountries();
                    updateCountryListUI();
                }
                // If auto-skip is enabled for this country, simulate the skip.
                if (autoSkipCountries[currentCountry]) {
                    simulateSkip();
                }
            }
        }
    }

    // Use a recursive function to randomize interval between country checks.
    function scheduleCountryCheck() {
        checkCountry();
        const nextDelay = 800 + Math.random() * 400; // 800ms to 1200ms
        setTimeout(scheduleCountryCheck, nextDelay);
    }
    scheduleCountryCheck();

    // Also observe DOM changes in case the country element is loaded dynamically.
    const countryObserver = new MutationObserver(checkCountry);
    countryObserver.observe(document.body, { childList: true, subtree: true });

    // -------------------------------
    // Monitor for "You have disconnected" Text
    // -------------------------------

    let disconnectTriggered = false;
    function checkForDisconnect() {
        // Check if the phrase "You have disconnected" appears anywhere in the visible text.
        const pageText = document.body.innerText || "";
        const found = pageText.includes("You have disconnected");
        if (found && !disconnectTriggered) {
            disconnectTriggered = true;
            console.log('"You have disconnected" detected. Simulating ESC key press after a random delay...');
            // Random delay between 400ms and 600ms before simulating an ESC key press.
            const randomDelay = 400 + Math.random() * 200;
            setTimeout(simulateEsc, randomDelay);
        } else if (!found && disconnectTriggered) {
            disconnectTriggered = false;
        }
    }

    // Recursive check for disconnect with random interval.
    function scheduleDisconnectCheck() {
        checkForDisconnect();
        const nextDelay = 800 + Math.random() * 400;
        setTimeout(scheduleDisconnectCheck, nextDelay);
    }
    scheduleDisconnectCheck();

    // -------------------------------
    // End of Script
    // -------------------------------
})();
