// ==UserScript==
// @name         Character Enhancer Pro
// @namespace    http://tampermonkey.net/
// @version      6.6
// @description  Complete character page enhancements: VIP visuals, talkboxes, achievement remapping, cash/star quality/points overrides, health/mood bars
// @author       You
// @match        https://*.popmundo.com/World/Popmundo.aspx/Character*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/560860/Character%20Enhancer%20Pro.user.js
// @updateURL https://update.greasyfork.org/scripts/560860/Character%20Enhancer%20Pro.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // ===========================================================================
    // SHARED CHARACTER ID DETECTION
    // ===========================================================================

    function getCharacterId() {
        // Method 1: Try to resolve from URL first (works on /Character and /Character/<id>)
        const parts = window.location.pathname.split('/');
        const last = parts[parts.length - 1];
        if (/^\d+$/.test(last)) return last;

        // Method 2: Check .idHolder element
        const idHolder = document.querySelector('.idHolder');
        if (idHolder) return idHolder.textContent.trim();

        // Method 3: Check URL match
        const urlMatch = window.location.href.match(/Character\/(\d+)/);
        if (urlMatch) return urlMatch[1];

        // Method 4: Find any link pointing to /Character/<id>
        const link = document.querySelector('a[href*="/World/Popmundo.aspx/Character/"]');
        if (link) {
            const m = link.href.match(/\/Character\/(\d+)/);
            if (m) return m[1];
        }

        // Method 5: Fallback — scan all anchors for a Character/<id> pattern
        for (const a of document.querySelectorAll('a[href]')) {
            const m = a.href.match(/\/Character\/(\d+)/);
            if (m) return m[1];
        }

        return null;
    }

    const charID = getCharacterId();
    if (!charID) return; // Exit if not on a valid character page

    // ===========================================================================
    // PART 1: HEALTH/MOOD BARS ENHANCEMENT
    // ===========================================================================

    // List of character IDs for health/mood bar conversion
    const healthMoodAllowedIds = new Set([
        "2887796",
        "3620479",
        "3620400",
        "3616694",
        "3247354",
        "3613365",
        "3602175",
        "3570776"
    ]);

    function convertHealthMoodBars(root = document) {
        if (!healthMoodAllowedIds.has(charID)) return;

        root.querySelectorAll(
            'div.charMainValues div.progressBar > div.low, ' +
            'div.charMainValues div.progressBar > div.med, ' +
            'div.charMainValues div.progressBar > div.high'
        ).forEach(inner => {
            inner.classList.remove('low', 'med');
            inner.classList.add('high');
            inner.style.width = '97%';
            inner.style.height = '100%';
        });
    }

    // ===========================================================================
    // PART 2: VIP & TALKBOX ENHANCEMENTS
    // ===========================================================================

    const vipCharacterIds = [
        '3620479', '3620400', '3609829', '3616694', '3581055', '3570776',
        '3552119', '3613832', '3552255', '3617745', '3613365', '3580776'
    ];

    const talkboxes = {
        '3555692': "living the dream ─ nothing can stop me!",
        '3554762': "quiet as a shadow ─ yet always noticed.",
        '3501813': "dancing in the moonlight ─ unstoppable vibe!",
        '3555337': "hitting every note ─ music is my life.",
        '3558887': "walking on clouds ─ surreal but real.",
        '3609829': "williams ♡ /off.",
        '3616694': "uhhh, blows kisses ₊˚⊹♡",
        '3613832': "erase me ─ ass.",
        '3552119': "fvck my luck, sugoi...",
        '3552255': "kawaii on purpose ⸝⸝.ᐟ⋆",
        '3569924': "🧩 ∾︎ on a might've been",
        '3570271': "grrrl, i don't care.. ≽^•⩊•^≼",
        '3561510': "trying my best, phew.. .·°՞(っ-ᯅ-ς)՞°·.",
        '2664429': "close your eyes, open your heart",
        '3552393': "dealing bullshit daily, per usual.",
        '3556299': "do you miss me? like i miss you..",
        '3558102': "please, i don't buy it.",
        '3558420': "i'm just cool at my pace.",
        '3558449': "it's so bad ─ so good.",
        '3561128': "you want me, trust.",
        '3617745': "⚞ • ⚟ ddo okkumaaaaaaa~",
        '3620479': "i'm a star ─ how could i not shine?",
        '3620400': "boom! ─ am i here?",
        '3613365': "hail before me /off",
        '3580776': "i sparkle no matter what ✩",
        '3581055': "sighs in pretty. /off",
        '3580037': "ugh fine, i'll save the world again",
        '3614576': "kinda dead inside but the outfit slays",
        '3613871': "smiles in lowercase ツ",
        '3570776': "all goes quiet in the end — silentia"
        // ⠀★ ⠀ misty’s mom⠀ ⠀/ ⠀ ⠀pienso en tu mira, lili
        //too glam to give a damn
        // drama? i am the whole season, babe.
        // don’t text me, manifest me ✩
        // you wish you sparkled like this ✦₊˚
        // smiles in lowercase
    };

    const vipStarHTML = `<a href="/Shop/Popmundo.aspx/VIPInfo" title="VIP member."><img src="/Static/Icons/VIPNameStar.png" class="lmargin5" style="vertical-align: top;"></a>`;
    const vipRowHTML = `
        <tr id="vip-row-added-by-script">
            <td></td>
            <td><a href="/Shop/Popmundo.aspx/VIPInfo">VIP Member</a></td>
        </tr>`;

    function addVipElements() {
        // Add VIP star to character name (works on main and sub-pages)
        const characterNameHeading = document.querySelector('.charPresBox h2, .characterPresentation h2, h2:has(a[href*="/Character/"])');
        if (characterNameHeading && !characterNameHeading.innerHTML.includes('VIPNameStar.png')) {
            characterNameHeading.insertAdjacentHTML('beforeend', vipStarHTML);
        }

        // Add VIP row to info table (only if .charMainValues exists)
        const infoTableBody = document.querySelector('.charMainValues table.width100 tbody');
        if (infoTableBody && !document.getElementById('vip-row-added-by-script')) {
            infoTableBody.insertAdjacentHTML('beforeend', vipRowHTML);
        }
    }

    function insertTalkbox() {
        // Don't insert if talkbox already exists
        if (document.getElementById('customTalkbox')) return;

        // Try multiple locations for talkbox insertion - looking for the character presentation area
        const possibleContainers = [
            '.characterPresentation',
            '.charPresBox',
            '#ctl00_cphLeftColumn > div:first-child',
            '.characterinfo'
        ];

        let targetElement = null;
        for (const selector of possibleContainers) {
            const element = document.querySelector(selector);
            if (element) {
                targetElement = element;
                break;
            }
        }

        // If no specific container found, try to find the main content area
        if (!targetElement) {
            targetElement = document.querySelector('#ctl00_cphLeftColumn') || document.body;
        }

        if (targetElement) {
            const talkboxHTML = `
                <div class="talkbox talkbox-white sayleft bylineleft nobmargin" id="customTalkbox" style="margin-top: 10px;">
                    <div class="talkbox-content">
                        <a title="Edit statement" class="float_right" href="/World/Popmundo.aspx/Character/Texts">
                            <img title="Edit statement" src="/Static/Icons/TinyEdit_White.png" alt="">
                        </a>
                        <span>${talkboxes[charID]}</span>
                    </div>
                    <div class="talkbox-byline"><p></p></div>
                </div>`;
            // Insert at the BOTTOM of the container (beforeend = inside the element, after its last child)
            targetElement.insertAdjacentHTML('beforeend', talkboxHTML);
        }
    }

    // ===========================================================================
    // PART 3: ACHIEVEMENT & STATS ENHANCEMENTS
    // ===========================================================================

    // 🎯 Achievement replacements
    const characterReplacements = {
        '3620479': { 'Achievement_443': 'Achievement_82', 'Achievement_428': 'Achievement_362', 'Achievement_287': 'Achievement_84' },
        '3620400': { 'Achievement_239': 'Achievement_250', 'Achievement_443': 'Achievement_357', 'Achievement_323': 'Achievement_352' },
        '2887796': { 'Achievement_322': 'Achievement_82', 'Achievement_34': 'Achievement_20', 'Achievement_366': 'Achievement_201' },
        '3616694': { 'Achievement_238': 'Achievement_238', 'Achievement_230': 'Achievement_316', 'Achievement_188': 'Achievement_272' },
        '3498957': { 'Achievement_186': 'Achievement_82', 'Achievement_81': 'Achievement_20', 'Achievement_285': 'Achievement_201' },
        '3570664': { 'Achievement_194': 'Achievement_83', 'Achievement_298': 'Achievement_127', 'Achievement_371': 'Achievement_17' },
        '3568978': { 'Achievement_156': 'Achievement_17', 'Achievement_186': 'Achievement_125', 'Achievement_298': 'Achievement_127' },
        '3570722': { 'Achievement_186': 'Achievement_125', 'Achievement_110': 'Achievement_91', 'Achievement_281': 'Achievement_35' },
        '3571113': { 'Achievement_426': 'Achievement_31', 'Achievement_298': 'Achievement_127', 'Achievement_428': 'Achievement_51' },
        '3572316': { 'Achievement_6': 'Achievement_129', 'Achievement_323': 'Achievement_83', 'Achievement_312': 'Achievement_51' },
        '3572154': { 'Achievement_311': 'Achievement_125', 'Achievement_90': 'Achievement_16', 'Achievement_443': 'Achievement_160' },
        '3571876': { 'Achievement_317': 'Achievement_38', 'Achievement_441': 'Achievement_137', 'Achievement_439': 'Achievement_17' },
        '3572401': { 'Achievement_298': 'Achievement_238', 'Achievement_317': 'Achievement_20', 'Achievement_239': 'Achievement_380' },
        '3613832': { 'Achievement_426': 'Achievement_31', 'Achievement_226': 'Achievement_228', 'Achievement_208': 'Achievement_352' },
        '3247354': { 'Achievement_317': 'Achievement_317', 'Achievement_27': 'Achievement_337', 'Achievement_11': 'Achievement_331' },
        '3613365': { 'Achievement_219': 'Achievement_330', 'Achievement_279': 'Achievement_137', 'Achievement_284': 'Achievement_332' },
        '3580776': { 'Achievement_363': 'Achievement_121', 'Achievement_291': 'Achievement_35', 'Achievement_358': 'Achievement_48' },
        '3581055': { 'Achievement_363': 'Achievement_332', 'Achievement_291': 'Achievement_129', 'Achievement_358': 'Achievement_125' },
        '3602175': { 'Achievement_177': 'Achievement_391', 'Achievement_291': 'Achievement_96', 'Achievement_358': 'Achievement_48' },
        '3580037': { 'Achievement_443': 'Achievement_82', 'Achievement_299': 'Achievement_129', 'Achievement_319': 'Achievement_143' },
        '3609829': { 'Achievement_443': 'Achievement_31', 'Achievement_317': 'Achievement_125', 'Achievement_300': 'Achievement_117' },
        '3614576': { 'Achievement_207': 'Achievement_331', 'Achievement_74': 'Achievement_235', 'Achievement_443': 'Achievement_227' },
        '3616694': { 'Achievement_443': 'Achievement_443', 'Achievement_238': 'Achievement_238', 'Achievement_297': 'Achievement_332' },
        '3613871': { 'Achievement_443': 'Achievement_181', 'Achievement_299': 'Achievement_368', 'Achievement_287': 'Achievement_332' },
        '3570776': { 'Achievement_426': 'Achievement_404', 'Achievement_387': 'Achievement_238', 'Achievement_437': 'Achievement_400' },
        '3577905': { 'Achievement_331': 'Achievement_290', 'Achievement_247': 'Achievement_129', 'Achievement_51': 'Achievement_264' }
    };

    const genericReplacements = {
        '2887796': { 'Achievement_428': 'Achievement_82', 'Achievement_366': 'Achievement_20', 'Achievement_358': 'Achievement_201' }
    };

    // 💰 Cash spoofing
    const cashValues = {
        '2887796': '1,213,073.00 M$', '3620479': '1,113,073.00 M$',
        '3620400': '1,013,073.00 M$', '3247354': '1,013,073.00 M$',
        '3580776': '3,013,073.00 M$', '3581055': '2,013,073.00 M$',
        '3602175': '2,013,073.00 M$', '3570776': '2,013,073.00 M$',
    };

    // 🌟 Star Quality override
    const starQualityValues = {
        '2887796': 100, '3620479': 100, '3620400': 95,
        '3247354': 95, '3581055': 95, '3580776': 95, '3602175': 95, '3570776':95
    };

    // 📈 Achievement Points override
    const pointsValues = {
        '2887796': '7200', '3620479': '8800', '3620400': '6400',
        '3498957': '5000', '3247354': '3100', '3581055': '3100',
        '3580776': '3120', '3602175': '3120', '3570776': '7200',
    };

    // 🏆 Achievement remapping
    function replaceAchievements() {
        // Look for achievements in multiple possible locations
        const achievementsSelectors = [
            '.characterAchievements',
            '.achievementContainer',
            '.achievements',
            '[class*="achievement"]'
        ];

        let achievementsContainer = null;
        for (const selector of achievementsSelectors) {
            const element = document.querySelector(selector);
            if (element && element.querySelector('.Achievement')) {
                achievementsContainer = element;
                break;
            }
        }

        if (!achievementsContainer) return;

        const replacements = charID ? characterReplacements[charID] : genericReplacements['2887796'];
        if (!replacements) return;

        achievementsContainer.querySelectorAll('.Achievement').forEach(achievement => {
            for (const oldClass in replacements) {
                if (achievement.classList.contains(oldClass)) {
                    achievement.classList.replace(oldClass, replacements[oldClass]);
                    break;
                }
            }
        });
    }

    // 💰 Cash spoofing
    function changeCashValue() {
        if (!cashValues[charID]) return;

        // Look for cash in multiple possible locations
        const cashSelectors = [
            'img[title="Cash"]',
            'img[alt*="Cash"]',
            'img[src*="Cash"]',
            'td:contains("Cash") + td',
            'tr:has(img[title="Cash"]) td:nth-child(2)'
        ];

        let cashElement = null;
        for (const selector of cashSelectors) {
            const element = document.querySelector(selector);
            if (element) {
                cashElement = element;
                break;
            }
        }

        if (cashElement) {
            if (cashElement.tagName === 'IMG') {
                const row = cashElement.closest('tr');
                if (row) {
                    const cashCell = row.querySelectorAll('td')[1];
                    if (cashCell) {
                        cashCell.textContent = cashValues[charID];
                    }
                }
            } else {
                cashElement.textContent = cashValues[charID];
            }
        }
    }

    // 🌟 Star Quality override
    function changeStarQuality() {
        if (!starQualityValues[charID]) return;

        const value = starQualityValues[charID];

        // Look for star quality in multiple possible locations
        const sqSelectors = [
            'img[title="Star Quality"]',
            'img[alt*="Star Quality"]',
            'img[src*="StarQuality"]',
            'td:contains("Star Quality")'
        ];

        let starQualityElement = null;
        for (const selector of sqSelectors) {
            const element = document.querySelector(selector);
            if (element) {
                starQualityElement = element;
                break;
            }
        }

        if (!starQualityElement) return;

        const row = starQualityElement.closest('tr');
        if (!row) return;

        const progressBarDiv = row.querySelector('.greenProgressBar, .progressBar');
        const progressBarSpan = row.querySelector('.sortkey');
        const scriptElement = row.querySelector('script');

        if (progressBarDiv) {
            const isMax = value === 100;
            const barClass = isMax ? 'progressBar' : 'greenProgressBar';
            const fillClass = isMax ? 'full' : 'high';

            progressBarDiv.className = barClass;
            progressBarDiv.title = value + '%';

            let innerDiv = progressBarDiv.querySelector('div');
            if (!innerDiv) {
                innerDiv = document.createElement('div');
                progressBarDiv.appendChild(innerDiv);
            }

            innerDiv.className = fillClass;
            innerDiv.style.width = value + '%';
            innerDiv.style.height = '100%';
            innerDiv.style.background = '';
        }

        if (progressBarSpan) {
            progressBarSpan.textContent = value.toString();
        }

        if (scriptElement) {
            const barClass = value === 100 ? 'progressBar' : 'greenProgressBar';
            scriptElement.textContent = `drawProgressBar(${value}, false, "${value}%", "${barClass}", false, "${value}%");`;
        }
    }

    // 📈 Achievement Points override
    function changePointsValue() {
        if (!pointsValues[charID]) return;

        // Look for achievement points in multiple possible locations
        const pointsSelectors = [
            '#ctl00_cphLeftColumn_ctl00_lnkAchievementPoints',
            'a[href*="AchievementPoints"]',
            'a:contains("Achievement Points")',
            'td:contains("Achievement Points") + td a',
            '.achievementPoints'
        ];

        for (const selector of pointsSelectors) {
            const pointsLink = document.querySelector(selector);
            if (pointsLink) {
                pointsLink.textContent = pointsValues[charID];
                break;
            }
        }
    }

    // ===========================================================================
    // MAIN EXECUTION & MUTATION OBSERVER
    // ===========================================================================

    function runAllEnhancements() {
        // Part 1: Health/Mood Bars
        convertHealthMoodBars();

        // Part 2: VIP & Talkbox
        if (vipCharacterIds.includes(charID)) {
            addVipElements();
        }

        if (talkboxes[charID]) {
            insertTalkbox();
        }

        // Part 3: Achievement & Stats
        replaceAchievements();
        changeCashValue();
        changeStarQuality();
        changePointsValue();
    }

    // Initial run
    function initialize() {
        if (!charID) return;

        // Run immediately if DOM is ready
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', runAllEnhancements);
        } else {
            runAllEnhancements();
        }
    }

    initialize();

    // Mutation observer for dynamic content updates (AJAX navigation)
    const observer = new MutationObserver(mutations => {
        let shouldReRun = false;

        mutations.forEach(mutation => {
            mutation.addedNodes.forEach(node => {
                if (node.nodeType === Node.ELEMENT_NODE) {
                    // Check if we're on a character sub-page now
                    if (getCharacterId() !== charID) {
                        // Character changed, reload page or reinitialize
                        location.reload();
                        return;
                    }

                    // Check if any relevant elements were added
                    if (node.querySelector && (
                        node.querySelector('.charMainValues') ||
                        node.querySelector('.characterAchievements') ||
                        node.querySelector('img[title="Cash"]') ||
                        node.querySelector('img[title="Star Quality"]') ||
                        node.querySelector('a[href*="AchievementPoints"]') ||
                        node.querySelector('.charPresBox') ||
                        node.querySelector('.characterPresentation') ||
                        node.querySelector('.Achievement') ||
                        node.querySelector('div.progressBar')
                    )) {
                        shouldReRun = true;
                    }

                    // Also check the node itself
                    if (node.classList && (
                        node.classList.contains('charMainValues') ||
                        node.classList.contains('characterAchievements') ||
                        node.classList.contains('charPresBox') ||
                        node.classList.contains('characterPresentation')
                    )) {
                        shouldReRun = true;
                    }
                }
            });
        });

        if (shouldReRun) {
            // Debounce to avoid multiple rapid executions
            clearTimeout(window.enhancerTimeout);
            window.enhancerTimeout = setTimeout(runAllEnhancements, 100);
        }
    });

    observer.observe(document.body, { childList: true, subtree: true });

    // Also handle AJAX navigation specifically for Popmundo
    if (window.history && window.history.pushState) {
        const originalPushState = window.history.pushState;
        window.history.pushState = function() {
            originalPushState.apply(this, arguments);
            // Wait a bit for AJAX to load new content
            setTimeout(runAllEnhancements, 500);
        };
    }

})();