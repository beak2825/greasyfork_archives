// ==UserScript==
// @name         WWW XP Time Calculator (for MWICombatSimulator)
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Shows time remaining to level up each skill based on current XP rates
// @author       WekizZ
// @match        https://shykai.github.io/MWICombatSimulatorTest/dist/*
// @match        https://www.milkywayidle.com/*
// @grant        GM_setValue
// @grant        GM_getValue
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/555866/WWW%20XP%20Time%20Calculator%20%28for%20MWICombatSimulator%29.user.js
// @updateURL https://update.greasyfork.org/scripts/555866/WWW%20XP%20Time%20Calculator%20%28for%20MWICombatSimulator%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const expTable = {
        1: 0, 2: 33, 3: 43, 4: 56, 5: 70, 6: 84, 7: 100, 8: 117, 9: 134, 10: 154,
        11: 173, 12: 195, 13: 218, 14: 243, 15: 271, 16: 301, 17: 333, 18: 368, 19: 407, 20: 450,
        21: 497, 22: 548, 23: 605, 24: 668, 25: 737, 26: 813, 27: 899, 28: 991, 29: 1096, 30: 1210,
        31: 1337, 32: 1478, 33: 1633, 34: 1806, 35: 1996, 36: 2207, 37: 2441, 38: 2699, 39: 2985, 40: 3301,
        41: 3649, 42: 4035, 43: 4461, 44: 4931, 45: 5449, 46: 6021, 47: 6652, 48: 7347, 49: 8113, 50: 8956,
        51: 9884, 52: 10905, 53: 12027, 54: 13263, 55: 14619, 56: 16109, 57: 17745, 58: 19540, 59: 21511, 60: 23670,
        61: 26039, 62: 28633, 63: 31475, 64: 34587, 65: 37993, 66: 41719, 67: 45794, 68: 50250, 69: 55119, 70: 60439,
        71: 66249, 72: 72591, 73: 79513, 74: 87065, 75: 95301, 76: 104282, 77: 114068, 78: 124732, 79: 136347, 80: 148994,
        81: 162762, 82: 177743, 83: 194042, 84: 211767, 85: 231039, 86: 251986, 87: 274748, 88: 299474, 89: 326328, 90: 355482,
        91: 387129, 92: 421467, 93: 458722, 94: 499124, 95: 542934, 96: 590424, 97: 641889, 98: 697651, 99: 758052, 100: 823463,
        101: 1404976, 102: 1499591, 103: 1609833, 104: 1727680, 105: 1853622, 106: 1988184, 107: 2131922, 108: 2285422, 109: 2449310, 110: 2624247,
        111: 2810934, 112: 3010117, 113: 3222582, 114: 3449164, 115: 3690748, 116: 3948271, 117: 4222725, 118: 4515161, 119: 4826690, 120: 5158491,
        121: 5511809, 122: 5887961, 123: 6288343, 124: 6714431, 125: 7167786, 126: 14406130, 127: 15712264, 128: 17201262, 129: 18827962, 130: 20604810,
        131: 22545343, 132: 24664301, 133: 26977715, 134: 29503027, 135: 32259214, 136: 35266910, 137: 38548557, 138: 42128558, 139: 46033441, 140: 50292044,
        141: 54935714, 142: 59998511, 143: 65517455, 144: 71532759, 145: 78088116, 146: 85230981, 147: 93012897, 148: 101489833, 149: 110722569, 150: 120777085,
        151: 131725012, 152: 143644096, 153: 156618719, 154: 170740445, 155: 186108628, 156: 202831060, 157: 221024671, 158: 240816292, 159: 262343476, 160: 285755393,
        161: 311213781, 162: 338894002, 163: 368986151, 164: 401696287, 165: 437247736, 166: 475882521, 167: 517862896, 168: 563473004, 169: 613020673, 170: 666839361,
        171: 725290240, 172: 788764470, 173: 857685635, 174: 932512394, 175: 1013741327, 176: 1101910017, 177: 1197600375, 178: 1301442241, 179: 1414117248, 180: 1536363024,
        181: 1668977702, 182: 1812824804, 183: 1968838501, 184: 2138029305, 185: 2321490193, 186: 2520403225, 187: 2736046691, 188: 2969802806, 189: 3223166015, 190: 3497751968,
        191: 3795307178, 192: 4117719444, 193: 4467029099, 194: 4845441132, 195: 5255338257, 196: 5699295007, 197: 6180092921, 198: 6700736933, 199: 7264473008, 200: 7874807178
    };

    let skillData = GM_getValue('mwi_skill_data', {});
    let isProcessing = false;

    function getSkillInfo(skillName) {
        const skillContainers = Array.from(document.querySelectorAll('.NavigationBar_nav__3uuUl'));
        const skillContainer = skillContainers.find(container => {
            const label = container.querySelector('.NavigationBar_label__1uH-y');
            return label && label.textContent.toLowerCase() === skillName.toLowerCase();
        });

        if (!skillContainer) return null;

        const levelElement = skillContainer.querySelector('.NavigationBar_level__3C7eR');
        const level = levelElement ? parseFloat(levelElement.textContent) : null;

        const progressBar = skillContainer.querySelector('.NavigationBar_currentExperience__3GDeX');
        const percent = progressBar ? parseFloat(progressBar.style.width) : null;

        return {
            level: Math.floor(level),
            percent: percent
        };
    }

    function getRemainingExp(skillName) {
        const info = getSkillInfo(skillName);
        if (!info) return null;

        const neededForLevelUp = expTable[info.level + 1];
        if (!neededForLevelUp) return 0;

        const gainedExp = neededForLevelUp * (info.percent / 100);
        return Math.floor(neededForLevelUp - gainedExp);
    }

    function formatTime(hours) {
        if (hours < 1) {
            return `${Math.round(hours * 60)}m`;
        } else if (hours < 24) {
            return `${Math.floor(hours)}h ${Math.round((hours % 1) * 60)}m`;
        } else {
            const days = Math.floor(hours / 24);
            const remainingHours = Math.floor(hours % 24);
            return `${days}d ${remainingHours}h`;
        }
    }

    function trackSkills() {
        const skills = ['Stamina', 'Intelligence', 'Attack', 'Melee', 'Defense'];

        skills.forEach(skill => {
            const remainingXP = getRemainingExp(skill);
            if (remainingXP !== null) {
                skillData[skill.toLowerCase()] = {
                    xpToLevel: remainingXP,
                    timestamp: Date.now()
                };
            }
        });

        GM_setValue('mwi_skill_data', skillData);
    }

    function processResults() {
        const resultsDiv = document.getElementById('simulationResultExperienceGain');
        if (!resultsDiv || isProcessing) return;

        isProcessing = true;
        const progressBar = document.getElementById('simulationProgressBar');

        if (progressBar && progressBar.style.width !== '100%') {
            setTimeout(processResults, 100);
            return;
        }

        try {
            const results = {};
            resultsDiv.querySelectorAll('.row').forEach(row => {
                const cols = row.children;
                if (cols.length >= 2) {
                    const skillName = cols[0].textContent.trim();
                    const xpPerHour = parseInt(cols[1].textContent.replace(/,/g, '')) || 0;
                    results[skillName.toLowerCase()] = xpPerHour;
                }
            });

            GM_setValue('last_simulation_results', results);
            addTimeToLevel(results);
        } catch (e) {
            console.error('Error processing results:', e);
        } finally {
            isProcessing = false;
        }
    }

    function addTimeToLevel(results) {
        const resultsDiv = document.getElementById('simulationResultExperienceGain');
        if (!resultsDiv) return;

        resultsDiv.querySelectorAll('.row').forEach(row => {
            row.style.cssText = `
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding: 2px 0;
            `;

            const cols = row.children;
            if (cols.length >= 2) {
                cols[0].style.cssText = `
                    width: 120px;
                    flex-shrink: 0;
                `;

                cols[1].style.cssText = `
                    width: 80px;
                    text-align: right;
                    margin-right: 20px;
                    flex-shrink: 0;
                `;

                if (!row.querySelector('.time-to-level')) {
                    const timeCol = document.createElement('div');
                    timeCol.className = 'col text-end time-to-level';
                    timeCol.style.cssText = `
                        flex-grow: 1;
                        text-align: right;
                        white-space: nowrap;
                    `;

                    if (cols[0].textContent.includes('Total')) {
                        timeCol.textContent = 'Time to Level';
                        timeCol.id = 'timeToLevelHeader';
                    } else {
                        const skillName = cols[0].textContent.trim().toLowerCase();
                        const xpPerHour = results[skillName] || 0;

                        if (skillData[skillName] && xpPerHour > 0) {
                            const xpNeeded = skillData[skillName].xpToLevel;
                            const timeToLevel = xpNeeded / xpPerHour;
                            timeCol.textContent = `${formatTime(timeToLevel)} (${xpNeeded.toLocaleString()} xp)`;
                        } else {
                            timeCol.textContent = 'Reading...';
                            timeCol.style.color = '#999';
                        }
                    }
                    row.appendChild(timeCol);
                }
            }
        });
    }

    if (window.location.hostname === 'www.milkywayidle.com') {
        setInterval(trackSkills, 5000);
        trackSkills();
    }

    const simulationObserver = new MutationObserver((mutations) => {
        const progressBar = document.getElementById('simulationProgressBar');
        if (progressBar && progressBar.style.width === '100%') {
            processResults();
        }
    });

    setInterval(() => {
        const progressBar = document.getElementById('simulationProgressBar');
        if (progressBar) {
            simulationObserver.observe(progressBar, {
                attributes: true,
                characterData: true,
                subtree: true
            });
        }

        const lastResults = GM_getValue('last_simulation_results', null);
        if (lastResults) {
            addTimeToLevel(lastResults);
        }
    }, 1000);

})();