// ==UserScript==
// @name         XPanel Helper
// @namespace    http://tampermonkey.net/
// @version      1.5.7
// @description  Помощник в выплатах
// @author       Dmitry Volkov - DevOps
// @match        http://xpanel.me/*
// @match        https://xpanel.me/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/553278/XPanel%20Helper.user.js
// @updateURL https://update.greasyfork.org/scripts/553278/XPanel%20Helper.meta.js
// ==/UserScript==
 
(function () {
    'use strict';
 
    function highlightRowsWithfk() {
        const rows = document.querySelectorAll('tr');
        const values = [
            3328, 1954, 941383, 155254, 10020, 130647, 182093, 1588392, 24789, 11706, 811, 5327, 23054, 5505, 81230, 16851, 9229, 52388, 6362, 252443, 277496, 263657, 1158, 15516, 6000, 91989, 1172, 1894, 664, 10974, 48311, 52981, 290874, 443318, 313349, 42955, 291746, 320296, 446642, 194874, 935675, 66764, 398324, 459442, 62329, 717536, 262402, 1061520, 624156, 1831962, 434987, 309878, 316760, 472948, 398924, 104969, 275468, 433372, 207218, 2145, 4040, 1712302, 25622, 1577547, 52700, 49576, 1998348, 10517, 490495, 1079641, 397534, 1141729, 1964994, 121333, 847917, 224633, 8996, 5461, 87463, 16653, 1159, 1125, 733790, 531, 1942, 3033, 18292, 697, 1785, 494, 251, 905405, 9299, 3038, 120464, 1846, 833356, 18465, 33347, 31789, 43013, 7491, 64841, 5050, 1133, 134504, 22863, 29397, 107342, 625510, 15830, 29231, 780, 4801, 196273, 12556, 63025, 56294, 310363, 264024, 414069, 186465, 61942, 15386, 9672, 1319, 11504, 234334, 4270, 1060620, 16236, 237839, 15944, 59203, 18460, 1205, 156730, 41085, 252, 1076, 16329, 1501907, 115108, 1077, 16701, 291413, 2734, 11122, 12253, 16577, 9725, 893099, 15860, 87768, 829, 8077, 89425, 35697, 1671072, 7581, 15339, 1416336, 1620633, 8463, 56527, 35628, 39552, 20870, 7781, 63456, 23049, 242834, 1584697, 1735, 48240, 30387, 291563, 1613153, 26007, 4406, 1179, 818, 79401, 22086, 892, 927380, 16479, 70516, 141651, 28403, 143683, 40686, 18103, 620, 62131, 11795, 37238, 71546, 313661, 53974, 53615, 330529, 2719, 146340, 58225, 1147, 6251, 30911, 36780, 92979, 29567, 8942, 1483, 120234, 29233, 452, 115291, 206301, 25627, 211236, 822993, 6396, 59676, 38465, 9494, 397066, 31086, 121296, 790, 33686, 60444, 291603, 1741692, 297999, 155582, 251259, 17329, 110009, 207, 486279, 402953, 1587783, 255448, 24823, 20591, 2410, 3544, 28440, 6718, 33371, 8572, 13309, 5702, 498725, 177279, 1405970, 56751, 456328, 17474, 18239, 13945, 1065771, 4706, 255264, 26442, 77873, 392099, 36610, 301290, 15214, 509, 332821, 2596, 818, 8845, 182701, 413924, 617632, 431527, 836967, 22171, 78242, 47455, 8940, 69547, 1633035, 1835944, 1557839, 1989399, 2179056, 2000992, 357049, 523119, 595290, 134086, 248427, 483246, 155437, 20162, 241579, 235753, 98, 1796956, 111518, 17895, 131190, 4305, 350004, 155897, 480545, 389015, 24750, 74721, 151104, 64229, 50167, 298151, 155623, 30195, 5816, 8472, 4388, 429509, 2816, 95567, 2224273, 545715, 163846, 47818, 13611, 442612, 12508, 406409, 21048, 19077, 637798, 776406, 252139, 117561, 6333, 419690, 473431, 425594, 1672492, 12014, 2084529, 1603672, 1918730, 1508381, 14375, 400249, 6391, 108160, 735085, 2516687, 348506, 897424, 208442, 2497880, 128879, 288074, 305569, 2165334, 1475238, 387612, 140701, 240360, 396, 342598, 2556, 4150, 261, 5847, 7487, 5802, 9810, 5888, 4032, 595, 3965, 119, 4654, 14033, 2484399, 14550, 5583, 12271, 2755, 6951, 4748, 2325390, 4457, 8361, 12361, 740589, 12480, 571631, 20492, 5799, 4809, 83385, 759032, 30299, 374301, 478170, 28093, 641665, 2191752, 179093, 2224408, 1796910, 2530995, 475054, 491598, 328003, 3, 483697, 40741, 10609, 2176744, 5327, 1393666, 503737, 1076, 2164, 4270, 5068, 678, 2205, 779, 2217333, 303160, 38287, 43499, 2614457, 2003887, 242760, 329238, 6380, 284616, 10635, 4113, 6238, 295885, 72514, 8134, 113040, 2467626, 2582240, 568765, 561124, 448463, 795814, 599, 2025908, 398744, 501168, 2614147, 1697177, 1360471, 82144, 2162020, 750076, 33832, 15740, 116, 218507, 2555356, 289524, 1430574, 1017640, 2302617, 6086, 531, 2571197, 228069, 1039539, 773555, 2539951, 1969877, 71275, 2235273, 43528, 12408, 2029927, 2051845, 123705, 219747, 395313, 29958, 53774, 773, 122442, 344, 884507, 826491, 1331401, 2455607, 12568, 58683, 1937092, 50769, 2315969, 987475, 394901, 190625, 435947, 32587, 372955, 815051, 1091, 295664, 2607218, 542749, 359948, 1596770, 432459, 1134654, 2020291, 573239, 43505, 485716, 75651, 28161, 58787, 30860, 570764, 268280, 127746, 11808, 2809750, 78522, 1894416, 432665, 2617405, 1817, 442252, 580732, 374824, 1126566, 999960, 499486, 417144, 2072096, 36280, 538764, 362626, 398400, 741704, 746746, 84537, 118247, 878940, 324198, 106871, 982940, 15694, 2645887, 39512, 6976, 2874654, 2874380, 2870339, 848840, 8475, 490298, 354081, 74362, 5008, 47310, 36246, 734438, 486974, 951380, 3543, 2469985, 571933, 739688, 875234, 2162807, 183653, 6173, 44069, 501082, 1328622, 457786, 5086, 203029, 506619, 164746, 72456, 1571994, 2042, 1325, 808422, 61630, 767845, 596607, 265362, 227240, 452534, 1075247, 41561, 1486821, 917805, 32530, 104441, 12660, 136701, 443749, 465496, 2327722, 56359, 830867, 436877, 2459506, 167529, 3635, 2060066, 375245, 825490, 2361845, 320416, 29597, 2913742, 2603884, 678279, 1718276, 479550, 19063, 415561, 32749, 892, 2628134, 2298784, 4021, 5852, 76717, 205780, 2922203, 2710591, 2921778, 553775, 86196, 729701, 99306, 991404, 523061, 2620909, 1043828, 2475959, 37662, 17573, 124618, 451797, 547516, 614627, 1121991, 70652, 486269, 460145, 117720, 270401, 489, 271081, 516981, 2512785, 440084, 761854, 322998, 452216, 14646, 434355, 472261, 227603, 2165081, 16200, 794241, 854944, 361883, 2002761, 52603, 336202, 289524, 480600, 116491, 631101, 762389, 486439, 1903571, 536256, 479868, 420264, 866864, 39515
            ];
        rows.forEach(function (row) {
            if (row.textContent.toLowerCase().includes('fk')) {
                row.style.backgroundColor = 'rgba(255, 0, 0, 0.2)';
            }
            if (row.textContent.toLowerCase().includes('payeer')) {
                row.style.backgroundColor = 'rgba(255, 0, 0, 0.2)';
            }
 
            if (row.textContent.toLowerCase().includes('piastrix')) {
                row.style.backgroundColor = 'rgba(255, 0, 0, 0.2)';
            }
            for (const v of values) {
                if (row.children[3].textContent.toLowerCase() === v.toString()) {
                    row.style.backgroundColor = '#4f013e';
                    break;
                }
            }
 
        });
    }
    function showkeywords() {
        const rows = document.querySelectorAll('textarea');
        const values = [
         "был замечен за подделкой чеков", "спамит заявками, проверять внимательно", "мошенник", "3.1.2.2", "3.1.2.4", "скамер", "скам", "СТОП ВЫВОДЫ",
        ];
        rows.forEach(function (row) {
 
            for (const v of values) {
                if (row.textContent.toLowerCase().includes(v.toString().toLowerCase())) {
                    row.style.backgroundColor = 'rgba(255, 0, 0, 0.2)';
                    break;
                }
            }
 
        });
    }
    function highlightRowsWithCard() {
        const rows = document.querySelectorAll('tr');
 
        rows.forEach(function (row) {
            if (row.textContent.toLowerCase().includes('2202206825199065')) {
                row.style.backgroundColor = 'rgba(0, 0, 255, 0.2)';
            }
            if (row.textContent.toLowerCase().includes('79850010660')) {
                row.style.backgroundColor = 'rgba(0, 0, 255, 0.2)';
            }
            if (row.textContent.toLowerCase().includes('f112576345')) {
                row.style.backgroundColor = 'rgba(0, 0, 255, 0.2)';
            }
            if (
                row.textContent.toLowerCase().includes('79850010660') ||
                row.textContent.toLowerCase().includes('79501653905') ||
                row.textContent.toLowerCase().includes('5469680012082535') ||
                row.textContent.toLowerCase().includes('2200700464203479') ||
                row.textContent.toLowerCase().includes('trtzbfvksnvdv5xeunwamphs7ddu3xztcu') ||
                row.textContent.toLowerCase().includes('bc1qt44h3vkx5gjfazukjmfgaepvvuj47tmmwjcq7w') ||
                row.textContent.toLowerCase().includes('0x177c4c4463d1c558d3203bd0fe4635606c2d09c4')
            ) {
                row.style.backgroundColor = 'rgba(0, 0, 255, 0.2)';
            }
            if (row.textContent.toLowerCase().includes('f7202414017360797')) {
                row.style.backgroundColor = 'rgba(0, 0, 255, 0.2)';
            }
            if (row.textContent.toLowerCase().includes('201567513965')) {
                row.style.backgroundColor = 'rgba(0, 0, 255, 0.2)';
            }
            if (row.textContent.toLowerCase().includes('79210168554')) {
                row.style.backgroundColor = 'rgba(0, 0, 255, 0.2)';
            }
            if (row.textContent.toLowerCase().includes('79312705716')) {
                row.style.backgroundColor = 'rgba(0, 0, 255, 0.2)';
            }
            if (row.textContent.toLowerCase().includes('f111076806')) {
                row.style.backgroundColor = 'rgba(0, 0, 255, 0.2)';
            }
            if (row.textContent.toLowerCase().includes('79214148290')) {
                row.style.backgroundColor = 'rgba(0, 0, 255, 0.2)';
            }
            if (row.textContent.toLowerCase().includes('4100118295416955')) {
                row.style.backgroundColor = 'rgba(0, 0, 255, 0.2)';
            }
            if (row.textContent.toLowerCase().includes('f7202430158915330')) {
                row.style.backgroundColor = 'rgba(0, 0, 255, 0.2)';
            }
            if (row.textContent.toLowerCase().includes('79538989261')) {
                row.style.backgroundColor = 'rgba(0, 0, 255, 0.2)';
            }
            if (row.textContent.toLowerCase().includes('2202208070784591')) {
                row.style.backgroundColor = 'rgba(0, 0, 255, 0.2)';
            }
        });
    }
 
    function highlightLargeAmounts() {
        const rows = document.querySelectorAll('tr');
 
        rows.forEach(function (row) {
            const cells = row.querySelectorAll('td');
 
            cells.forEach(function (cell) {
                const span = cell.querySelector('span');
                if (span) {
                    const amountText = span.textContent.replace(/\s+/g, '').replace(',', '.');
                    const amount = parseFloat(amountText);
 
                    if (amount > 50000) {
                        row.style.backgroundColor = 'rgba(0, 96, 128, 0.2)';
                    }
                }
            });
        });
    }
 
    function cleanText(text) {
        return text.replace(/,/g, '.').replace(/[\s\u00A0&\xa0;]/g, '');
    }
 
    function calculateSumAboveRow(currentRow) {
        let sum = 0;
        let previousRows = Array.from(currentRow.parentElement.children);
        let currentRowIndex = previousRows.indexOf(currentRow);
 
        for (let i = 0; i < currentRowIndex; i++) {
            let prevRow = previousRows[i];
 
            // Пропускаем строку, если она соответствует игре из списка LiveInstantGames
            if (isLiveInstantGameRow(prevRow)) {
                continue;
            }
 
            const spans = prevRow.querySelectorAll('span');
            spans.forEach(span => {
                const textContent = span.textContent;
                const cleanedText = cleanText(textContent);
 
                const match = cleanedText.match(/\(([\d.]+)RUB\.\)/);
                if (match) {
                    const value = parseFloat(match[1]);
                    if (!isNaN(value)) {
                        sum += value;
                    }
                }
            });
        }
        return sum;
    }
 
    function calculateTotalSumAboveRow(currentRow) {
        let sum = 0;
        let previousRows = Array.from(currentRow.parentElement.children);
        let currentRowIndex = previousRows.indexOf(currentRow);
 
        for (let i = 0; i < currentRowIndex; i++) {
            let prevRow = previousRows[i];
 
            const spans = prevRow.querySelectorAll('span');
            spans.forEach(span => {
                const textContent = span.textContent;
                const cleanedText = cleanText(textContent);
 
                const match = cleanedText.match(/\(([\d.]+)RUB\.\)/);
                if (match) {
                    const value = parseFloat(match[1]);
                    if (!isNaN(value)) {
                        sum += value;
                    }
                }
            });
        }
        return sum;
    }
 
 
 
    function updateButtons(buttonClass, buttonColor, depositTextMatch, textUpdateCallback) {
        const buttons = document.querySelectorAll(buttonClass);
        buttons.forEach(button => {
            let currentRow = button.closest('tr');
            let sum = calculateSumAboveRow(currentRow);
 
            const depositCell = currentRow.querySelectorAll('td')[2];
            const depositText = depositCell ? cleanText(depositCell.textContent) : '';
            const depositMatch = depositText.match(depositTextMatch);
            let depositValue = 1;
            if (depositMatch) {
                depositValue = parseFloat(depositMatch[1]);
            }
 
            const multiplier = sum / depositValue;
 
            const innerOperations = currentRow.querySelector('.awsui_content_gwq0h_f8qtu_97');
            let innerOperationsCount = '';
            let innerOperationsNumber = 0;
            if (innerOperations) {
                const match = innerOperations.textContent.match(/Inner operations:\s*(\d+)/);
                if (match) {
                    innerOperationsNumber = parseInt(match[1], 10);
                    innerOperationsCount = ` (COUNT: ${innerOperationsNumber})`;
                }
            }
 
            // Only add innerOperationsCount for specific button texts
            const buttonText = button.textContent.replace(/\(COUNT: \d+\)/g, "").trim();
            if (buttonText.includes("WHEEL") || buttonText.includes("VK BONUS") || buttonText.includes("TG BONUS") || buttonText.includes("RAIN")) {
                button.textContent = `${buttonText}${innerOperationsCount}`;
            } else if (buttonText.includes("PROMO CODE")) {
                if (innerOperationsNumber > 5) {
                    button.textContent = `PROMO CODE (X: ${multiplier.toFixed(2)}) and COUNT ${innerOperationsCount})`;
                } else {
                    button.textContent = `PROMO CODE (X: ${multiplier.toFixed(2)})`;
                }
            } else {
                textUpdateCallback(button, multiplier);
            }
        });
    }
 
    function updateDepositButtons() {
        updateButtons(
            'span.main_badge__u6DKH.main_tab__8EKqV.main_green__wzcid.awsui_badge_1yjyg_1kk9m_93.awsui_badge-color-grey_1yjyg_1kk9m_113',
            'main_green__wzcid',
            /([\d.]+)RUB\./,
            (button, multiplier) => {
                let currentRow = button.closest('tr');
                let totalSum = calculateTotalSumAboveRow(currentRow);
                let depositCell = currentRow.querySelectorAll('td')[2];
                let depositText = depositCell ? cleanText(depositCell.textContent) : '';
                let depositMatch = depositText.match(/([\d.]+)RUB\./);
 
                let depositValue = 1;
                if (depositMatch) {
                    depositValue = parseFloat(depositMatch[1]);
                } else {
                    console.warn('Could not parse deposit value:', depositText);
                }
 
                const withoutX = totalSum / depositValue;
 
                // Проверяем, если X меньше 3 и withoutX больше или равно 3
                if (multiplier < 3) {
                    currentRow.style.backgroundColor = 'rgba(255, 0, 0, 0.2)';
                }
 
                button.textContent = `DEPOSIT (X: ${multiplier.toFixed(2)}, All-X: ${withoutX.toFixed(2)})`;
            }
        );
    }
 
    function updatePromoButtons() {
        updateButtons(
            'span.main_badge__u6DKH.main_tab__8EKqV.main_cyan__Iedd2.awsui_badge_1yjyg_1kk9m_93.awsui_badge-color-grey_1yjyg_1kk9m_113',
            'main_cyan__Iedd2',
            /([\d.]+)RUB\./,
            (button, multiplier, innerOperationsCount, innerOperationsNumber) => {
                let currentRow = button.closest('tr');
                let totalSum = calculateTotalSumAboveRow(currentRow);
 
                const depositCell = currentRow.querySelectorAll('td')[2];
                const depositText = depositCell ? cleanText(depositCell.textContent) : '';
                const depositMatch = depositText.match(/([\d.]+)RUB\./);
 
                let depositValue = 1;
                if (depositMatch) {
                    depositValue = parseFloat(depositMatch[1]);
                } else {
                    console.warn('Could not parse deposit value:', depositText);
                }
 
                const withoutX = totalSum / depositValue;
 
                if (button.textContent === "PROMO CODE") {
                    if (innerOperationsNumber > 5) {
                        button.textContent = `PROMO CODE (X: ${multiplier.toFixed(2)}, All-X: ${withoutX.toFixed(2)}) and COUNT ${innerOperationsCount}`;
                    } else {
                        button.textContent = `PROMO CODE (X: ${multiplier.toFixed(2)}, All-X: ${withoutX.toFixed(2)})`;
                    }
                }
            }
        );
    }
 
    function updateWeeklyButtons() {
        updateButtons(
            'span.main_badge__u6DKH.main_tab__8EKqV.main_darkYellow__mFVi0.awsui_badge_1yjyg_1kk9m_93.awsui_badge-color-grey_1yjyg_1kk9m_113',
            'main_darkYellow__mFVi0',
            /([\d.]+)RUB\./,
            (button, multiplier) => {
                let currentRow = button.closest('tr');
                let totalSum = calculateTotalSumAboveRow(currentRow);
 
                const depositCell = currentRow.querySelectorAll('td')[2];
                const depositText = depositCell ? cleanText(depositCell.textContent) : '';
                const depositMatch = depositText.match(/([\d.]+)RUB\./);
 
                let depositValue = 1;
                if (depositMatch) {
                    depositValue = parseFloat(depositMatch[1]);
                } else {
                    console.warn('Could not parse deposit value:', depositText);
                }
 
                const withoutX = totalSum / depositValue;
 
                if (button.textContent === "WEEKLY GIVEAWAY") {
                    button.textContent = `WEEKLY GIVEAWAY (X: ${multiplier.toFixed(2)}, All-X: ${withoutX.toFixed(2)})`;
                }
            }
        );
    }
 
    function processNewNodes(nodes) {
        nodes.forEach(node => {
            if (node.nodeType === 1) {
                if (node.matches('span.main_badge__u6DKH.main_tab__8EKqV.main_green__wzcid.awsui_badge_1yjyg_1kk9m_93.awsui_badge-color-grey_1yjyg_1kk9m_113')) {
                    updateDepositButtons();
                }
                if (node.matches('span.main_badge__u6DKH.main_tab__8EKqV.main_cyan__Iedd2.awsui_badge_1yjyg_1kk9m_93.awsui_badge-color-grey_1yjyg_1kk9m_113')) {
                    updatePromoButtons();
                }
                if (node.matches('span.main_badge__u6DKH.main_tab__8EKqV.main_darkYellow__mFVi0.awsui_badge_1yjyg_1kk9m_93.awsui_badge-color-grey_1yjyg_1kk9m_113')) {
                    updateWeeklyButtons();
                }
 
                const childButtons = node.querySelectorAll('span.main_badge__u6DKH.main_tab__8EKqV.main_green__wzcid.awsui_badge_1yjyg_1kk9m_93.awsui_badge-color-grey_1yjyg_1kk9m_113');
                if (childButtons.length > 0) {
                    updateDepositButtons();
                }
                const childButtonsPromo = node.querySelectorAll('span.main_badge__u6DKH.main_tab__8EKqV.main_cyan__Iedd2.awsui_badge_1yjyg_1kk9m_93.awsui_badge-color-grey_1yjyg_1kk9m_113');
                if (childButtonsPromo.length > 0) {
                    updatePromoButtons();
                }
                const childButtonsWeekly = node.querySelectorAll('span.main_badge__u6DKH.main_tab__8EKqV.main_darkYellow__mFVi0.awsui_badge_1yjyg_1kk9m_93.awsui_badge-color-grey_1yjyg_1kk9m_113');
                if (childButtonsWeekly.length > 0) {
                    updateWeeklyButtons();
                }
            }
        });
    }
 
    const observer = new MutationObserver(mutations => {
        mutations.forEach(mutation => {
            processNewNodes(mutation.addedNodes);
        });
    });
 
    observer.observe(document.body, { childList: true, subtree: true });
 
    updateDepositButtons();
    updatePromoButtons();
    updateWeeklyButtons();
 
    function highlightAmountsBefore6000() {
        const tables = document.querySelectorAll('.awsui_table_wih1l_1ykdk_135');
 
        tables.forEach(function (table) {
            const parentDiv = table.closest('.awsui_wrapper_wih1l_1ykdk_145');
            const containerDiv = table.closest('.awsui_container_1d2i7_1fymu_262');
            if (parentDiv && !containerDiv) {
                const rows = table.querySelectorAll('tr');
 
                rows.forEach(function (row) {
                    let shouldHighlight = true;
                    const badges = row.querySelectorAll('.main_badge__u6DKH');
                    badges.forEach(function (badge) {
                        const text = badge.textContent;
                        if (text.includes("RAKEBACK") || text.includes("RELOAD") || text.includes("SYSTEM") ||
                            text.includes("BOOST") || text.includes("VK BONUS") || text.includes("DEPOSIT") ||
                            text.includes("RACE") || text.includes("REFUND") || text.includes("WITHDRAW") ||
                            text.includes("WHEEL") || text.includes("PROMO CODE") || text.includes("AFF") ||
                            text.includes("LOYALTY") || text.includes("WEEKLY GIVEAWAY") || text.includes("TG BONUS") ||
                            text.includes("RAIN") || text.includes("(") || text.includes("GAME") || text.includes(":") ||
                            text.includes("LVLUP")) {
                            shouldHighlight = false;
                        }
                    });
 
                    if (shouldHighlight) {
                        const cells = row.querySelectorAll('td');
 
                        cells.forEach(function (cell) {
                            const span = cell.querySelector('span');
                            if (span && span.textContent.includes("RUB.") && !span.textContent.includes("(")) {
                                const amountText1 = span.textContent.replace(/[()\s+&nbsp;]/g, '').replace(',', '.');
                                const amount1 = parseFloat(amountText1);
 
                                if (amount1 >= 40000) {
                                    //row.style.display = 'none';
                                    //row.style.backgroundColor = 'rgba(0, 255, 92, 0.05)';
                                }
                            }
                        });
                    }
                });
            }
        });
    }
    const gameNames = ["LIVE ROULETTE A (2871)", "EUROPEAN ROULETTE (57065)", "IMMERSIVE ROULETTE (11206)", "SUPER CARD BLACKJACK LIVE (54534)", "INFINITE FUN FUN 21 BLACKJACK (44169)", "FIREBALL ROULETTE (53258)", "BALLOON ODYSSEY CRASH (52001) ", "SPACE XY (8904)", "RUSSIAN ROYAL BLACKJACK 3 (54180)", "BLACKJACK CLASSIC RU (32857)", "SUPER SPEED BACCARAT (44873)", "BLACKJACK THRONE (54172)", "BLACKJACK CROWN (54170)", "EASY BLACKJACK (47747)", "RUSSIAN ROULETTE (54821)", "CRAZY TIME (54814)", "LIGHTNING BALL (42160)", "DOUBLE ROULETTE (53226)", "RUSSIAN ROYAL BLACKJACK 2", "LIGHTNING BAC BO (53735)", "CRAZY BALLS (46269)", "LUCKY DICE 1 (1268)", "SUPER COLOR GAME (53541)", "MUMMY'S MINES (52843)", "AVIAMASTERS (40017)", "LUCKY SELECTOR (54016)", "JADE COINS (33124)", "TOP EAGLE (44998)", "SNAKES AND LADDERS LIVE (21652)", "AUTO-ROULETTE: VIP (11390)", "SPEED BACCARAT R (11318)", "CASH STREAK (18491)", "THAI SPEED BACCARAT A (24839)", "SPEED BACCARAT 4 (34756)", "2020 HIT SLOT (1990)", "2021 HIT SLOT (7878)", "LUCKY SELECTOR (53542)", "JADE COINS (33124)", "TOP EAGLE (44998)", "AVIATOR (22630)", "FRENCH ROULETTE (49918)", "XXXTREME LIGHTNING ROULETTE (11363)", "AUTO-ROULETTE (11389)", "CRAZY TIME (11239)", "CRAZY PACHINKO (32010)", "RED DOOR ROULETTE (27434)", "MEGA WHEEL (16007)", "ROULETTE 4: RUSSIAN (15746)", "DRAGON'S CRASH (35403)", "PLINKO XY (8896)", "FORTUNE ROULETTE (48761)", "CHANCE MACHINE 100 (3906)", "CHANCE MACHINE 5 (5003)", "HELL HOT 100 (6226)", "HELL HOT 20 (7093)", "HELL HOT 40 (7323)", "HELL HOT 100 DICE (21809)", "HELL HOT 40 DICE (21810)", "LUCKY STREAK X (25253)", "CHANCE MACHINE 5 DICE (31861)", "CHANCE MACHINE 40 (4359)", "2023 HIT SLOT DICE (32663)", "JOKER STOKER DICE (38642)", "CHANCE MACHINE 20 DICE (38643)", "BAC BO (11383)", "MINE-A-LICIOUS (51880)", "LUCKY STREAK 27 (42348)", "LUCKY STREAK 1 (1260)", "LUCKY STREAK 2 (1261)", "2024 HIT SLOT (33125)", "GREEN SLOT (22463)", "HELL HOT 20 DICE (21811)", "LUCKY STREAK 1000 (47576)", "HIT SLOT 2025 (52750)", "LUCKY STREAK 3 (1262)", "CROWN COINS (40577)", "JOKER STOKER (6321)", "FORTUNE ROULTETTE (48761)", "LIVE SPEED ROULETTE (2872)", "ROULETTE GERMANY (2873)", "ROULETTE ITALY (2874)", "ROULETTE RUSSIA (2875)", "LIVE BLACKJACK A (2972)", "LIVE BLACKJACK B (2973)", "LIVE BLACKJACK C (2974)", "LIVE BLACKJACK D (2975)", "LIVE BLACKJACK E (2976)", "LIVE BACCARAT A (3276)", "LIVE BACCARAT B (3277)", "LIVE BACCARAT C (3278)", "ROULETTE MACAO (3279)", "SPEED BACCARAT A (3280)", "SPEED BACCARAT B (3281)", "MEGA SIC BO (3918)", "BLACKJACK AZURE B (4306)", "BLACKJACK AZURE C (4307)", "BLACKJACK AZURE D (4308)", "BLACKJACK AZURE E (4309)", "BLACKJACK AZURE F (4310)", "BLACKJACK AZURE G (4311)", "BLACKJACK AZURE H (4312)", "BLACKJACK AZURE I (4313)", "BLACKJACK AZURE J (4314)", "ROULETTE AZURE (4315)", "BLACKJACK AZURE A (4316)", "MEGA WHEEL (4363)", "MEGA ROULETTE (5189)", "ONE BLACKJACK (5200)", "SPORTBOOK (6142)", "DRAGON TIGER (6155)", "AUTO ROULETTE (6282)", "BLACKJACK 18: AZURE (6284)", "BLACKJACK 20: AZURE (6285)", "SPEED BACCARAT C (6289)", "LIVE BACCARAT E (6291)", "BLACKJACK 21: AZURE (6292)", "BLACKJACK 17: AZURE (6293)", "LIVE BACCARAT D (6295)", "SPEED BACCARAT E (6296)", "BLACKJACK 19: AZURE (6297)", "SPEED BACCARAT D (6298)", "BLACKJACK 24: AZURE (6329)", "BLACKJACK 23: AZURE (6330)", "BLACKJACK 22: AZURE (6331)", "BLACKJACK 26: AZURE (6333)", "BLACKJACK 25: AZURE (6334)", "BLACKJACK 30: AZURE 2 (7059)", "BLACKJACK 31: AZURE 2 (7063)", "BLACKJACK 32: AZURE 2 (7123)", "SWEET BONANZA CANDYLAND (7398)", "BLACKJACK 33: THE CLUB (7399)", "BLACKJACK 36: THE CLUB (7401)", "BLACKJACK 34: THE CLUB (7403)", "ROULETTE 9: THE CLUB (7404)", "ONE BLACKJACK 2: INDIGO (7407)", "BLACKJACK 35: THE CLUB (7408)", "BACCARAT 7 (7439)", "SPEED BACCARAT 8 (7461)", "BACCARAT 9 (7462)", "SPEED BACCARAT 7 (7464)", "BACCARAT 8 (7465)", "BACCARAT 10 (7467)", "ROULETTE 10: RUBY (7474)", "SPEED BACCARAT 9 (7480)", "SPORT (10000)", "DUELBITS: FIRST PERSON BLACKJACK (11173)", "FASTPAY: FIRST PERSON BLACKJACK (11176)", "FOOTBALL STUDIO: DICE (11183)", "FOOTBALL STUDIO; ROULETTE (11184)", "FREE BET BLACKJACK 1 (11187)", "FREE BET BLACKJACK 2 (11188)", "FREE BET BLACKJACK 3 (11189)", "FREE BET BLACKJACK 4 (11190)", "FREE BET BLACKJACK 5 (11191)", "FREE BET BLACKJACK 6 (11192)", "FREE BET BLACKJACK 7 (11193)", "GONZO'S TREASURE HUNT (11198)", "GOODMAN FIRST PERSON BLACKJACK (11199)", "HINDI LIGHTNING ROULETTE (11204)", "INFINITE FREE BET BLACKJACK (11208)", "MONOPOLY LIVE (11221)", "CRAZY COIN FLIP (11236)", "RULETKA LIVE (11268)", "SPEED ROULETTE (11338)", "THREE CARD POKER (11347)", "TURKISH LIGHTNING ROULETTE (11353)", "VIP ROULETTE (11361)", "AUTO LIGHTNING ROULETTE (11367)", "BLACKJACK C (11378)", "BACCARAT C (11400)", "BACCARAT B (11408)", "BLACKJACK VIP X (11430)", "BLACKJACK VIP F (11435)", "BLACKJACK VIP U (11436)", "FIRST PERSON: BLACKJACK (11437)", "BLACKJACK VIP (11438)", "BLACKJACK VIP I (11439)", "BLACKJACK VIP 2 (11445)", "BLACKJACK VIP 6 (11450)", "BLACKJACK VIP 7 (11451)", "BLACKJACK VIP 8 (11452)", "BLACKJACK VIP 9 (11453)", "BLACKJACK VIP A (11454)", "BLACKJACK VIP 3 (11462)", "BLACKJACK VIP 4 (11463)", "BLACKJACK VIP 5 (11465)", "BLACKJACK VIP B (11466)", "BLACKJACK VIP C (11468)", "BLACKJACK VIP D (11469)", "BLACKJACK VIP E (11470)", "BLACKJACK VIP G (11471)", "BLACKJACK VIP H (11472)", "BLACKJACK VIP J (11473)", "BLACKJACK VIP K (11474)", "BLACKJACK VIP L (11475)", "BLACKJACK VIP M (11476)", "BLACKJACK VIP O (11477)", "BLACKJACK VIP P (11479)", "BLACKJACK VIP Q (11480)", "BLACKJACK VIP R (11481)", "BLACKJACK VIP S (11482)", "BLACKJACK VIP T (11483)", "BLACKJACK VIP V (11484)", "BLACKJACK VIP Z (11485)", "BLACKJACK VIP Z (11563)", "BGAMING JACKPOT (13400)", "BLAZE ROLETA AO VIVO (18125)", "FIRST PERSON BACCARAT (18132)", "AVIATOR (22630)", "GOAL (22631)", "DICE (22632)", "KENO (22634)", "HOTLINE (22635)", "MINES (22636)", "PLINKO (22637)", "HILO (22638)", "CLASSIC SPEED BLACKJACK 51 (22820)", "CLASSIC SPEED BLACKJACK 55 (22821)", "CLASSIC SPEED BLACKJACK 54 (22822)", "FIRST PERSON XXXTREME LIGHTNING BACCARAT (33389)", "XXXTREME LIGHTNING BACCARAT (33391)", "DREAM CATCHER (33392)", "MONOPOLY LIVE (33393)", "T√ЬRK√ЗE FUTBOL ST√ЬDYOSU (33394)", "LA PARTAGE FRANCOPHONE (33395)", "SVENSK ROULETTE (33396)", "AMERICAN ROULETTE (33397)", "LONDON ROULETTE (33398)", "FIRST PERSON LIGHTNING ROULETTE (33399)", "FIRST PERSON DREAM CATCHER (33400)", "HIPPODROME GRAND CASINO (33401)", "RULETKA LIVE (33402)", "SALON PRIV√Й ROULETTE (33403)", "BUCHAREST ROULETTE (33404)", "JAPANESE ROULETTE (33405)", "GRAND CASINO ROULETTE (33406)", "VIP ROULETTE (33407)", "LIGHTNING DICE (33408)", "CASINO HOLDEM (33409)", "CARIBBEAN STUD POKER (33410)", "BUCHAREST AUTO-ROULETTE (33411)", "SUOMALAINEN RULETTI (33412)", "FRENCH ROULETTE GOLD (33413)", "SIDE BET CITY (33414)", "DEUTSCHES ROULETTE (33415)", "THREE CARD POKER (33416)", "AUTO LIGHTNING ROULETTE (33417)", "CASINO MALTA ROULETTE (33418)", "VENEZIA ROULETTE (33419)", "FIRST PERSON AMERICAN ROULETTE (33420)", "AUTO-ROULETTE VIP (33421)", "ULTIMATE TEXAS HOLDEM (33422)", "T√ЬRK√ЗE RULET 2 (33423)", "CRAZY TIME (33424)", "ARABIC ROULETTE (33425)", "ROULETTE FRANCOPHONE (33426)", "FIRST PERSON ROULETTE (33427)", "FIRST PERSON BLACKJACK (33428)", "VENEZIA LA PARTAGE (33429)", "NORSK ROULETTE (33430)", "CASH OR CRASH (33431)", "MEGA BALL (33432)", "BENELUX SLINGSHOT (33433)", "SPEED AUTO ROULETTE (33434)", "DANSK ROULETTE (33435)", "FOOTBALL STUDIO (33436)", "DOUBLE BALL ROULETTE (33437)", "SPEED ROULETTE (33438)", "TEXAS HOLDEM BONUS POKER (33439)", "2 HAND CASINO HOLDEM (33440)", "FIRST PERSON MEGA BALL (33441)", "CLASSIC SPEED BLACKJACK 49 (33453)", "CLASSIC SPEED BLACKJACK 27 (33455)", "CLASSIC SPEED BLACKJACK 52 (33458)", "CLASSIC SPEED BLACKJACK 47 (33459)", "CLASSIC SPEED BLACKJACK 56 (33461)", "CLASSIC SPEED BLACKJACK 58 (33474)", "CLASSIC SPEED BLACKJACK 36 (33476)", "CLASSIC SPEED BLACKJACK 13 (33482)", "CLASSIC SPEED BLACKJACK 51 (33489)", "CLASSIC SPEED BLACKJACK 15 (33491)", "TURKISH ROULETTE (33510)", "BACCARAT (33511)", "BACCARAT 2 (33512)", "BACCARAT 3 (33513)", "BACCARAT 5 (33514)", "BACCARAT 8 (33515)", "SPEED BACCARAT 1 (33516)", "SPEED BACCARAT 3 (33517)", "SPEED BACCARAT 6 (33518)", "SPEED BACCARAT 8 (33519)", "SPEED ROULETTE 1 (33520)", "RED DOOR ROULETTE (33523)", "BLACKJACK 37: RUBY (33526)", "SPEED ROULETTE 2 (33529)", "GONZOS TREASURE MAP (33532)", "KLASIK SPEED BLACKJACK 3 (33533)", "SPEED BACCARAT 14 (33534)", "DRAGON TIGER (33536)", "ROMANIAN ROULETTE (33537)", "SPEED BACCARAT 12 (33539)", "LIGHTNING LOTTO (33541)", "GOLD VAULT ROULETTE (33542)", "SPEED BACCARAT 13 (33544)", "CLASSIC SPEED BLACKJACK 57 (33547)", "CLASSIC SPEED BLACKJACK 40 (33548)", "CLASSIC SPEED BLACKJACK 21 (33554)", "CLASSIC SPEED BLACKJACK 26 (33565)", "CRAZY PACHINKO (33566)", "CLASSIC SPEED BLACKJACK 39 (33567)", "CLASSIC SPEED BLACKJACK 31 (33568)", "CLASSIC SPEED BLACKJACK 19 (33571)", "CLASSIC SPEED BLACKJACK 43 (33572)", "CLASSIC SPEED BLACKJACK 48 (33577)", "CLASSIC SPEED BLACKJACK 53 (33578)", "CLASSIC SPEED BLACKJACK 17 (33579)", "CLASSIC SPEED BLACKJACK 59 (33580)", "CLASSIC SPEED BLACKJACK 14 (33581)", "CLASSIC SPEED BLACKJACK 33 (33582)", "CLASSIC SPEED BLACKJACK 12 (33583)", "CLASSIC SPEED BLACKJACK 41 (33584)", "CLASSIC SPEED BLACKJACK 34 (33587)", "CLASSIC SPEED BLACKJACK 46 (33588)", "CLASSIC SPEED BLACKJACK 18 (33590)", "CLASSIC SPEED BLACKJACK 16 (33591)", "CLASSIC SPEED BLACKJACK 37 (33593)", "CLASSIC SPEED BLACKJACK 42 (33594)", "CLASSIC SPEED BLACKJACK 29 (33596)", "CLASSIC SPEED BLACKJACK 54 (33602)", "CLASSIC SPEED BLACKJACK 30 (33604)", "CLASSIC SPEED BLACKJACK 28 (33609)", "CLASSIC SPEED BLACKJACK 24 (33611)", "CLASSIC SPEED BLACKJACK 55 (33612)", "CLASSIC SPEED BLACKJACK 22 (33613)", "CLASSIC SPEED BLACKJACK 44 (33614)", "CLASSIC SPEED BLACKJACK 35 (33616)", "CLASSIC SPEED BLACKJACK 45 (33617)", "CLASSIC SPEED BLACKJACK 38 (33624)", "CLASSIC SPEED BLACKJACK 50 (33626)", "CLASSIC SPEED BLACKJACK 11 (33630)", "CLASSIC SPEED BLACKJACK 23 (33631)", "SPEED BLACKJACK 6: RUBY (33632)", "CLASSIC SPEED BLACKJACK 32 (33634)", "SPEED BACCARAT 2 (33637)", "SPEED BACCARAT 7 (33646)", "ROULETTE (33647)", "ROULETTE 9: THE CLUB (33648)", "MEGA SIC BO (33649)", "BLACKJACK CLASSIC 88 (33650)", "SPEED BACCARAT 11 (33651)", "FIRST PERSON GOLDEN WEALTH BACCARAT (33653)", "SPEED BACCARAT 15 (33654)", "FUNKY TIME (33655)", "FIRST PERSON LIGHTNING LOTTO (33656)", "FIRST PERSON CRAPS (33658)", "SPEED BACCARAT 10 (33660)", "BACCARAT 7 (33664)", "AUTO ROULETTE (33679)", "BACCARAT 1 (33680)", "BACCARAT 6 (33681)", "ROULETTE RUBY (33683)", "VIP ROULETTE вАУ THE CLUB UPGRADE (33684)", "PRIVE LOUNGE BLACKJACK 3 (33686)", "AUTO ROULETTE 1 (15680)", "BACCARAT 9 (15685)", "BLACKJACK (15687)", "BLACKJACK (15689)", "BLACKJACK (15690)", "BLACKJACK 26 AZURE (15691)", "BLACKJACK (15692)", "BLACKJACK (15693)", "BLACKJACK (15694)", "BLACKJACK (15695)", "BLACKJACK (15696)", "BLACKJACK (15697)", "BLACKJACK (15698)", "BLACKJACK (15699)", "BLACKJACK (15700)", "BLACKJACK LOBBY (15702)", "ROULETTE 2 (15729)", "BLACKJACK (15730)", "BACCARAT 2 (15731)", "LUCKY DREAMS ROULETTE (15734)", "POWERUP ROULETTE (15738)", "ROULETTE 11 DUTCH (15742)", "ROULETTE 10 RUBY (15743)", "ROULETTE 6 TURKISH (15744)", "ROULETTE 7 ITALIAN (15745)", "ROULETTE 4 RUSSIAN (15746)", "ROULETTE 1 AZURE (15748)", "SPEED BACCARAT 10 (15751)", "SPEED BACCARAT 7 (15755)", "VIP BLACKJACK 4 RUBY (15770)", "SPEED BACCARAT 13 (15771)", "SPEED BACCARAT 14 (15772)", "SPEED BACCARAT 8 (15773)", "SPEED BACCARAT 9 (15774)", "SPEED BACCARAT 1 (15775)", "SPEED BLACKJACK (15776)", "SPEED BLACKJACK 3 RUBY (15777)", "BLACKJACK (15781)", "BLACKJACK (15782)", "BLACKJACK (15783)", "BLACKJACK (15784)", "BLACKJACK (15785)", "BLACKJACK (15786)", "BLACKJACK (15787)", "BLACKJACK (15788)", "BLACKJACK (15789)", "BLACKJACK (15790)", "BLACKJACK 54 RUBY (15791)", "BLACKJACK 55 RUBY (15792)", "BLACKJACK 52 RUBY (15793)", "BLACKJACK 53 RUBY (15794)", "BLACKJACK (15795)", "BLACKJACK (15797)", "DRAGON TIGER (15805)", "DROPS AND WINS LOBBY (15806)", "INDIAN ROULETTE (15817)", "BACCARAT 5 (15833)", "NO COMM SPEED BACCARAT 2 (15838)", "NO COMM BACCARAT 1 (15839)", "ONE BLACKJACK (15844)", "SPEED BACCARAT 11 (15860)", "VIP BLACKJACK 3 RUBY (15910)", "BACCARAT 8 (15922)", "BLACKJACK (15925)", "BLACKJACK (15927)", "BLACKJACK (15928)", "BLACKJACK (15929)", "BLACKJACK 22 AZURE (15930)", "BLACKJACK 25 AZURE (15931)", "BLACKJACK (15932)", "BLACKJACK (15933)", "BLACKJACK (15934)", "BLACKJACK (15935)", "BLACKJACK (15936)", "ANDAR BAHAR (15946)", "BACCARAT 11 (15949)", "BACCARAT 7 (15950)", "BACCARAT LOBBY (15952)", "BLACKJACK 24 AZURE (15958)", "BLACKJACK (15960)", "BLACKJACK (15961)", "BLACKJACK (15962)", "BLACKJACK 23 AZURE (15963)", "BLACKJACK (15964)", "BLACKJACK (15967)", "BOOM CITY (15970)", "GAME SHOW LOBBY (15985)", "BACCARAT 1 (15998)", "BACCARAT 3 (15999)", "BLACKJACK (16000)", "LOBBY ROULETTE (16002)", "MEGA ROULETTE (16004)", "MEGA WHEEL (16007)", "MEGA SIC BO (16009)", "ROULETTE 5 GERMAN (16018)", "ROULETTE 3 MACAO (16019)", "SPEED BACCARAT 5 (16021)", "SPEED BACCARAT 15 (16024)", "SPEED BACCARAT 12 (16025)", "SPEED BACCARAT 6 (16026)", "SPEED BLACKJACK 4 RUBY (16027)", "LIVE SPEED ROULETTE (16028)", "SUPER 8 BACCARAT (16029)", "SWEET BONANZA CANDYLAND (16032)", "VIP BLACKJACK 5 RUBY (16038)", "BLACKJACK (16042)", "BLACKJACK 56 RUBY (16043)", "BLACKJACK (16044)", "BLACKJACK (16045)", "BLACKJACK (16046)", "FORTUNE 6 BACCARAT (16066)", "BACCARAT 6 (16081)", "BLACKJACK (16082)", "LIVE CASINO LOBBY (16083)", "NO COMM SPEED BACCARAT 1 (16089)", "ONE BLACKJACK (16090)", "ROULETTE 12 ROMANIAN (16096)", "ROULETTE 14 SPANISH (16098)", "ROULETTE 9 THE CLUB (16099)", "SPEED BACCARAT 2 (16105)", "SPEED ROULETTE 2 (16106)", "SPEED BACCARAT 3 (16107)", "VIP BLACKJACK 2 RUBY (16123)", "VIP BLACKJACK 1 RUBY (16126)", "BLACKJACK 58 RUBY (17528)", "BLACKJACK 63 RUBY (17529)", "BLACKJACK 60 RUBY (17530)", "BLACKJACK 57 RUBY (17531)", "BLACKJACK 62 RUBY (17532)", "SPEED BLACKJACK 6 RUBY (17533)", "BLACKJACK 61 RUBY (17535)", "BLACKJACK 59 RUBY (17536)", "SPEED BLACKJACK (17537)", "SPEED BLACKJACK 8 RUBY (17538)", "SPEED BLACKJACK 14 AZURE (17542)", "SPEED BLACKJACK (17543)", "SPEED BLACKJACK 10 RUBY (17545)", "SPEED BLACKJACK 9 RUBY (17546)", "SPEED BLACKJACK 7 RUBY (17547)", "SPEED BLACKJACK (17786)", "SPEED BLACKJACK 7 RUBY (17787)", "SPEED BLACKJACK 8 RUBY (17788)", "SPEED BLACKJACK 9 RUBY (17789)", "BLACKJACK 64 RUBY (18524)", "BLACKJACK 65 RUBY (18525)", "VIP BLACKJACK (18526)", "VIP BLACKJACK (18527)", "VIP BLACKJACK (18528)", "VIP BLACKJACK (18529)", "BLACKJACK (18530)", "SPEED BACCARAT 2 KOREAN (18531)", "ROULETTE 8 INDIAN (19135)", "BLACKJACK 71 RUBY (19152)", "BLACKJACK 72 RUBY (19153)", "BLACKJACK 73 RUBY (19154)", "BLACKJACK 74 RUBY (19155)", "SPEED BLACKJACK 15 RUBY (19157)", "SPEED BLACKJACK 16 RUBY (19158)", "SPEED BLACKJACK 17 RUBY (19159)", "SPEED BLACKJACK 18 RUBY (19160)", "MEGA BACCARAT (19333)", "SPEED AUTO ROULETTE 1 (19334)", "SNAKES AND LADDERS LIVE (21652)", "ROULETTE 16 SWEDISH (22251)", "SPEED BLACKJACK (22331)", "SPEED BLACKJACK 20 EMERALD (22337)", "SPEED BLACKJACK 21 EMERALD (22338)", "SPEED BLACKJACK 19 EMERALD (22339)", "VIP BLACKJACK 7 EMERALD (22340)", "VIP BLACKJACK 6 EMERALD (22341)", "VIP BLACKJACK 8 EMERALD (22342)", "AUTO MEGA ROULETTE (22895)", "VEGAS BALL BONANZA (23029)", "PRIVE LOUNGE (23073)", "PRIVE LOUNGE (23074)", "PRIVE LOUNGE (23075)", "PRIVE LOUNGE (23076)", "PRIVE LOUNGE (23077)", "SPEED BLACKJACK (23118)", "SPEED BLACKJACK (23119)", "SPEED BLACKJACK (23120)", "SPEED BLACKJACK (23121)", "SPEED BLACKJACK (23122)", "SPEED BLACKJACK (23123)", "SPEED BLACKJACK (23124)", "VIP BLACKJACK (23208)", "SPEED BLACKJACK (23210)", "BLACKJACK (23215)", "VIP BLACKJACK (23459)", "BRAZILIAN ROULETTE (23461)", "SIC BO (26878)", "TREASURE ISLAND (31746)", "JUST ROULETTE (31904)", "LUCKY 6 ROULETTE (32135)", "BLAZE AUTO MEGA ROULETTE (32243)", "DIAMOND CLUB BLACKJACK (32296)", "KOREAN SPEED BACCARAT 3 (32607)", "KOREAN SPEED BACCARAT 4 (32608)", "PRIVE LOUNGE BACCARAT 2 (33011)", "PRIVE LOUNGE BACCARAT 3 (33012)", "PRIVE LOUNGE BACCARAT 4 (33013)", "PRIVE LOUNGE BACCARAT 5 (33014)", "PRIVE LOUNGE BACCARAT 1 (33015)", "VIETNAMESE ROULETTE (33016)", "BLACKJACK (33060)", "BLACKJACK (33061)", "VIETNAMESE ROULETTE (33064)", "THAI SPEED BACCARAT 1 (33266)", "LUCKY DREAMS AUTO MEGA ROULETTE (33268)", "JAPANESE SPEED BACCARAT 1 (34690)", "JAPANESE SPEED BACCARAT 2 (34691)", "INDONESIAN SPEED BACCARAT 1 (34699)", "BLACKJACK X 1 AZURE (35364)", "BLACKJACK X 3 AZURE (35365)", "BLACKJACK X 2 AZURE (35366)", "BLACKJACK X 4 RUBY (35367)", "BLACKJACK X 5 RUBY (35368)", "BLACKJACK 80 EMERALD (36111)", "BLACKJACK X 11 AZURE (36112)", "BLACKJACK X 12 AZURE (36113)", "BLACKJACK X 15 RUBY (36114)", "BLACKJACK X 19 RUBY (36115)", "BLACKJACK X 21 RUBY (36116)", "BLACKJACK X 22 RUBY (36117)", "BLACKJACK X 26 AZURE (36118)", "BLACKJACK X 24 AZURE (36119)", "BLACKJACK X 29 RUBY (36120)", "BLACKJACK X 30 RUBY (36121)", "BLACKJACK X 31 AZURE (36122)", "BLACKJACK X 34 RUBY (36123)", "BLACKJACK X 38 AZURE (36124)", "BLACKJACK X 35 RUBY (36125)", "VIP BLACKJACK 13 EMERALD (36129)", "VIP BLACKJACK 14 EMERALD (36130)", "BLACKJACK X 32 AZURE (36131)", "BLACKJACK 79 EMERALD (36132)", "BLACKJACK 81 EMERALD (36133)", "BLACKJACK X 10 RUBY (36134)", "BLACKJACK X 16 AZURE (36135)", "BLACKJACK X 17 AZURE (36136)", "BLACKJACK X 18 AZURE (36137)", "BLACKJACK X 23 RUBY (36138)", "BLACKJACK X 20 RUBY (36139)", "BLACKJACK X 25 AZURE (36140)", "BLACKJACK X 14 RUBY (36141)", "BLACKJACK X 28 AZURE (36142)", "BLACKJACK X 33 RUBY (36143)", "BLACKJACK X 36 AZURE (36144)", "BLACKJACK X 40 RUBY (36145)", "BLACKJACK X 39 RUBY (36146)", "BLACKJACK X 27 AZURE (36147)", "BLACKJACK X 6 AZURE (36148)", "BLACKJACK X 7 AZURE (36149)", "BLACKJACK X 8 RUBY (36150)", "BLACKJACK X 9 RUBY (36151)", "BLACKJACK X 37 AZURE (36152)", "BLACKJACK X 13 AZURE (36153)", "TURKISH MEGA ROULETTE (36159)", "BLACKJACK ITALIA TRICOLORE 1 (36562)", "BLACKJACK ITALIA TRICOLORE 3 (36563)", "BLACKJACK ITALIA TRICOLORE 2 (36564)", "JAPANESE SPEED BACCARAT 3 (36565)", "BLACKJACK 82 EMERALD (36789)", "BLACKJACK 83 EMERALD (36790)", "BLACKJACK 84 EMERALD (36792)", "BLACKJACK X 12 EMERALD (36984)", "BLACKJACK X 28 EMERALD (36985)", "BLACKJACK X 29 EMERALD (36986)", "BLACKJACK X 30 EMERALD (36987)", "BLACKJACK X 11 EMERALD (36988)", "BLACKJACK X 13 EMERALD (36989)", "BLACKJACK X 23 EMERALD (36990)", "BLACKJACK X 27 EMERALD (36991)", "BLACKJACK X 26 EMERALD (36992)", "BLACKJACK X 22 EMERALD (36993)", "PRIVE LOUNGE BLACKJACK 8 (36995)", "PRIVE LOUNGE BLACKJACK 9 (37005)", "PRIVE LOUNGE BLACKJACK 7 (37006)", "PRIVE LOUNGE BLACKJACK 10 (37007)", "PRIVE LOUNGE BLACKJACK 6 (37008)", "KOREAN SPEED BACCARAT 6 (37202)", "CHINESE SPEED BACCARAT 2 (37439)", "KOREAN ROULETTE (37441)", "KOREAN SPEED BACCARAT 1 (37442)", "KOREAN SPEED BACCARAT 5 (37443)", "SUPER TRUNFO (37445)", "VIETNAMESE SPEED BACCARAT 1 (38054)", "BLACKJACK 85 EMERALD (38551)", "PUNTO BANCO ITALIA TRICOLORE (38552)", "SPEED BLACKJACK 31 EMERALD (38553)", "SPEED BLACKJACK 37 THE CLUB (38554)", "SPEED BLACKJACK 34 EMERALD (38557)", "SPEED BLACKJACK 33 EMERALD (38558)", "SPEED BLACKJACK 36 THE CLUB (38559)", "SPEED BLACKJACK 32 EMERALD (38560)", "SPEED BLACKJACK 35 EMERALD (38561)", "KIRMIZI TURKISH SPEED BLACKJACK 2 (38740)", "KIRMIZI TURKISH BLACKJACK X 4 (38741)", "KIRMIZI TURKISH BLACKJACK X 5 (38742)", "KIRMIZI TURKISH BLACKJACK X 2 (38743)", "KIRMIZI TURKISH BLACKJACK X 1 (38744)", "KIRMIZI TURKISH BLACKJACK 2 (38753)", "KIRMIZI TURKISH BLACKJACK X 3 (38768)", "CHINESE SPEED BACCARAT 1 (39388)", "SPEED BLACKJACK 1 RUBY (39390)", "TURKISH ONE BLACKJACK (39391)", "SPEED BLACKJACK 2 RUBY (39393)", "BLACKJACK X ITALIA TRICOLORE 1 (39584)", "BLACKJACK X ITALIA TRICOLORE 5 (39585)", "BLACKJACK X ITALIA TRICOLORE 3 (39586)", "BLACKJACK X ITALIA TRICOLORE 2 (39587)", "BLACKJACK X ITALIA TRICOLORE 4 (39588)", "PRIVE LOUNGE BACCARAT 8 (39589)", "PRIVE LOUNGE BACCARAT 6 (39590)", "PRIVE LOUNGE BACCARAT 7 (39591)", "BLACKJACK 86 RUBY (40027)", "BLACKJACK 93 AZURE (40028)", "BLACKJACK 87 EMERALD (40029)", "BLACKJACK 88 EMERALD (40030)", "BLACKJACK 91 AZURE (40031)", "BLACKJACK 89 EMERALD (40032)", "BLACKJACK 90 AZURE (40033)", "BLACKJACK 92 AZURE (40034)", "CHINESE SPEED BACCARAT 3 (40036)", "MEGA SIC BAC (40037)", "SPEED BLACKJACK 40 EMERALD (40038)", "SPEED BLACKJACK 38 RUBY (40039)", "SPEED BLACKJACK 42 EMERALD (40040)", "SPEED BLACKJACK 44 AZURE (40041)", "SPEED BLACKJACK 47 AZURE (40042)", "SPEED BLACKJACK 39 RUBY (40043)", "SPEED BLACKJACK 43 AZURE (40044)", "SPEED BLACKJACK 46 AZURE (40045)", "SPEED BLACKJACK 41 EMERALD (40046)", "SPEED BLACKJACK 45 AZURE (40047)", "BLACKJACK 18 AZURE (41004)", "BLACKJACK 17 AZURE (41006)", "BLACKJACK 19 AZURE 2 (41007)", "BLACKJACK 20 AZURE (41008)", "BLACKJACK 21 AZURE (41009)", "KOREAN BLACKJACKX 3 (41010)", "KOREAN BLACKJACKX 2 (41013)", "KOREAN BLACKJACKX 1 (41014)", "SPEED BACCARAT 16 (41016)", "BLACKJACK 100 AZURE (41139)", "BLACKJACK 99 AZURE (41140)", "BLACKJACK 95 EMERALD (41141)", "BLACKJACK 97 AZURE (41142)", "BLACKJACK 94 EMERALD (41143)", "BLACKJACK 101 AZURE (41144)", "BLACKJACK 98 AZURE (41146)", "BLACKJACK 96 EMERALD (41147)", "SPEED BLACKJACK 52 AZURE (41150)", "SPEED BLACKJACK 48 EMERALD (41151)", "SPEED BLACKJACK 49 EMERALD (41152)", "SPEED BLACKJACK 50 EMERALD (41153)", "SPEED BLACKJACK 51 AZURE (41154)", "SPEED BLACKJACK 53 AZURE (41155)", "SPEED BLACKJACK 54 AZURE (41156)", "BLACKJACK 17 AZURE 2 (41773)", "BLACKJACK 18 AZURE 2 (41774)", "BLACKJACK 19 AZURE 2 (41775)", "BLACKJACK 20 AZURE 2 (41776)", "BLACKJACK 21 AZURE 2 (41777)", "BLACKJACK 27 AZURE 2 (41778)", "BLACKJACK 28 AZURE 2 (41779)", "BLACKJACK 29 AZURE 2 (41780)", "BLACKJACK 30 AZURE 2 (41781)", "BLACKJACK 31 AZURE 2 (41782)", "BLACKJACK 32 AZURE 2 (41783)", "BLACKJACK 33 THE CLUB (41784)", "BLACKJACK 34 THE CLUB (41785)", "BLACKJACK 35 THE CLUB (41786)", "BLACKJACK 36 THE CLUB (41787)", "BLACKJACK 37 RUBY (41788)", "BLACKJACK 38 RUBY (41789)", "BLACKJACK 39 RUBY (41790)", "BLACKJACK 40 RUBY (41791)", "BLACKJACK 41 RUBY (41792)", "BLACKJACK 42 RUBY (41793)", "BLACKJACK 43 RUBY (41794)", "BLACKJACK 44 RUBY (41795)", "BLACKJACK 45 RUBY (41796)", "BLACKJACK 46 RUBY (41797)", "BLACKJACK 47 RUBY (41798)", "BLACKJACK 48 RUBY (41799)", "BLACKJACK 49 RUBY (41800)", "BLACKJACK 50 RUBY (41801)", "BLACKJACK 51 RUBY (41802)", "BLACKJACK 11 (41803)", "BLACKJACK 3 AZURE (41804)", "BLACKJACK 6 AZURE (41805)", "BLACKJACK 7 AZURE (41806)", "BLACKJACK 4 AZURE (41807)", "BLACKJACK 1 AZURE (41808)", "BLACKJACK 9 AZURE (41809)", "BLACKJACK 10 AZURE (41810)", "BLACKJACK 5 AZURE (41811)", "BLACKJACK 2 AZURE (41812)", "BLACKJACK 8 AZURE (41813)", "BLACKJACK 16 (41814)", "TURKISH BLACKJACK 1 (41815)", "BLACKJACK 12 (41826)", "BLACKJACK 14 (41827)", "BLACKJACK 15 (41828)", "ONE BLACKJACK (41833)", "ONE BLACKJACK 2 RUBY (41834)", "PRIVE LOUNGE BLACKJACK 1 (41835)", "PRIVE LOUNGE BLACKJACK 2 (41836)", "PRIVE LOUNGE BLACKJACK 3 (41837)", "PRIVE LOUNGE BLACKJACK 4 (41838)", "PRIVE LOUNGE BLACKJACK 5 (41839)", "SPEED BLACKJACK 10 RUBY (41844)", "SPEED BLACKJACK 11 AZURE (41845)", "SPEED BLACKJACK 12 AZURE (41846)", "SPEED BLACKJACK 22 EMERALD (41847)", "SPEED BLACKJACK 24 EMERALD (41848)", "SPEED BLACKJACK 25 EMERALD (41849)", "SPEED BLACKJACK 26 EMERALD (41850)", "SPEED BLACKJACK 27 EMERALD (41851)", "SPEED BLACKJACK 28 EMERALD (41852)", "SPEED BLACKJACK 29 EMERALD (41853)", "SPEED BLACKJACK 30 EMERALD (41854)", "BLACKJACK 78 RUBY (41855)", "TURKISH SPEED BLACKJACK 1 (41856)", "VIP BLACKJACK 10 RUBY (41859)", "VIP BLACKJACK 12 RUBY (41860)", "BLACKJACK 70 RUBY (41861)", "VIP BLACKJACK 11 RUBY (41862)", "VIP BLACKJACK 9 RUBY (41863)", "BLACKJACK 75 AZURE (41864)", "BLACKJACK 76 AZURE (41865)", "TURKISH VIP BLACKJACK 1 (41866)", "MEGA ROULETTE BRAZILIAN (43196)", "BLACKJACK 102 EMERALD (43336)", "BLACKJACK 105 EMERALD (43337)", "BLACKJACK 106 EMERALD (43338)", "BLACKJACK 107 EMERALD (43339)", "BLACKJACK 103 EMERALD (43340)", "BLACKJACK 108 EMERALD (43341)", "BLACKJACK 104 EMERALD (43342)", "SPEED BLACKJACK 55 EMERALD (43343)", "SPEED BLACKJACK 59 EMERALD (43344)", "SPEED BLACKJACK 58 EMERALD (43345)", "SPEED BLACKJACK 56 EMERALD (43346)", "SPEED BLACKJACK 60 EMERALD (43347)", "SPEED BLACKJACK 61 EMERALD (43348)", "SPEED BLACKJACK 57 EMERALD (43349)", "BLACKJACKX TRICOLOR ROMANIA 1 (44143)", "BLACKJACKX TRICOLOR ROMANIA 2 (44144)", "BLACKJACKX TRICOLOR ROMANIA 3 (44145)", "BLACKJACKX TRICOLOR ROMANIA 5 (44146)", "BLACKJACKX TRICOLOR ROMANIA 4 (44152)", "TURKISH BLACKJACKX 7 (44836)", "TURKISH BLACKJACKX 6 (44837)", "BET BEHIND PRO BLACKJACK (45035)", "TURKISH BLACKJACK 3 (45041)", "VIP AUTO ROULETTE (45043)", "BLACKJACK 110 (45271)", "BLACKJACK 111 (45272)", "BLACKJACK 114 (45273)", "SPEED BLACKJACK 62 (45275)", "SPEED BLACKJACK 63 (45276)", "SPEED BLACKJACK 64 (45277)", "SPEED BLACKJACK 65 (45278)", "SPEED BLACKJACK 66 (45279)", "BLACKJACK 109 (45286)", "BLACKJACK 113 (45288)", "BLACKJACK 112 (45289)", "NEDERLANDSE ONE BLACKJACK (45296)", "TURKISH SPEED BLACKJACK 3 (45528)", "TURKISH BLACKJACK 4 (45529)", "TURKISH VIP BLACKJACK 2 (45530)", "AMON ROULETTE (46040)", "BRAZILIAN ONE BLACKJACK (46042)", "GREEK ROULETTE (46043)", "RETRO ROULETTE (46044)", "N1 ROULETTE (46046)", "ROLLXO ROULETTE (46047)", "ITALIAN MEGA ROULETTE (47229)", "INDONESIAN BLACKJACKX 1 (47543)", "INDONESIAN BLACKJACKX 2 (47544)", "INDONESIAN BLACKJACKX 3 (47545)", "INDONESIAN BLACKJACKX 4 (47546)", "INDONESIAN BLACKJACKX 5 (47547)", "INDONESIAN ROULETTE (47548)", "BLACKJACKX 31 (48328)", "BLACKJACKX 32 (48329)", "BLACKJACKX 36 (48330)", "BLACKJACKX 37 (48331)", "BLACKJACKX 40 (48332)", "BLACKJACKX 38 (48333)", "BLACKJACKX 35 (48334)", "BLACKJACKX 33 (48335)", "BLACKJACKX 34 (48336)", "BLACKJACKX 39 (48337)", "BRAZILIAN BLACKJACKX 5 (48604)", "BRAZILIAN BLACKJACKX 2 (48605)", "BRAZILIAN BLACKJACKX 3 (48606)", "BRAZILIAN BLACKJACKX 4 (48607)", "BRAZILIAN BLACKJACKX 1 (48608)", "BACCARAT 3 (48756)", "ONE BLACKJACK 2 (48759)", "FORTUNE ROULETTE (48761)", "ROULETTE 10 (48762)", "IMMERSIVE ROULETTE DELUXE (49141)", "VIETNAMESE SPEED BACCARAT 2 (49411)", "BRAZILIAN BLACKJACK 1 (49458)", "BRAZILIAN VIP BLACKJACK 1 (49460)", "BRAZILIAN BLACKJACK 2 (49461)", "INDONESIAN BLACKJACKX 10 (49937)", "INDONESIAN BLACKJACKX 6 (49938)", "INDONESIAN BLACKJACKX 7 (49939)", "INDONESIAN BLACKJACKX 9 (49940)", "INDONESIAN BLACKJACKX 13 (49941)", "INDONESIAN BLACKJACKX 15 (49942)", "INDONESIAN BLACKJACKX 14 (49943)", "INDONESIAN BLACKJACKX 8 (49945)", "INDONESIAN BLACKJACKX 12 (49946)", "INDONESIAN BLACKJACKX 11 (49947)", "DEUTSCHES ROULETTE (11166)", "DIAMOND VIP (11167)", "DOUBLE BALL ROULETTE (11168)", "DRAGONARA ROULETTE (11169)", "DRAGON TIGER (11170)", "DREAM CATCHER (11171)", "DUELBITS BLACKJACK (11172)", "DUELBITS FIRST PERSON BLACKJACK (11173)", "EXTREME TEXAS HOLDEM (11174)", "FAN TAN (11175)", "FASTPAY FIRST PERSON BLACKJACK (11176)", "FIRST PERSON AMERICAN ROULETTE (11177)", "FIRST PERSON BLACKJACK SPAIN (11178)", "FIRST PERSON DEAL OR NO DEAL (11179)", "FIRST PERSON GOLDEN WEALTH BACCARAT (11180)", "FIRST PERSON LIGHTNING BACCARAT (11181)", "FIRST PERSON LIGHTNING BLACKJACK (11182)", "FOOTBALL STUDIO DICE (11183)", "FOOTBALL STUDIO ROULETTE (11184)", "BLACKJACK FORTUNE VIP (11185)", "FREE BET BLACKJACK (11186)", "FREE BET BLACKJACK 1 (11187)", "FREE BET BLACKJACK 2 (11188)", "FREE BET BLACKJACK 3 (11189)", "FREE BET BLACKJACK 4 (11190)", "FREE BET BLACKJACK 5 (11191)", "FREE BET BLACKJACK 6 (11192)", "FREE BET BLACKJACK 7 (11193)", "ROULETTE FRANCOPHONE (11194)", "FRENCH ROULETTE GOLD (11195)", "FUTBOL STUDIO (11196)", "GOLDEN WEALTH BACCARAT (11197)", "GONZO'S TREASURE HUNT (11198)", "GOODMAN FIRST PERSON BLACKJACK (11199)", "GRAND CASINO ROULETTE (11200)", "BLACKJACK GRAND VIP (11201)", "GREEK LIGHTNING ROULETTE (11202)", "GSLOT FIRST PERSON BLACKJACK (11203)", "HINDI LIGHTNING ROULETTE (11204)", "HIPPODROME GRAND CASINO (11205)", "IMMERSIVE ROULETTE (11206)", "INFINITE BLACKJACK (11207)", "INFINITE FREE BET BLACKJACK (11208)", "INSTANT ROULETTE (11209)", "JAPANESE ROULETTE (11210)", "LIGHTNING BACCARAT (11211)", "LIGHTNING BLACKJACK (11212)", "LIGHTNING DICE (11213)", "LIGHTNING ROULETTE (11214)", "LONDON ROULETTE (11215)", "LUCKY DREAMS BLACKJACK (11216)", "LUCKY DREAMS FIRST PERSON BLACKJACK (11217)", "MEGA BALL (11218)", "MEGA BALL EN ESPANOL (11219)", "FIRST PERSON DREAM CATCHER (11220)", "MONOPOLY LIVE (11221)", "MONOPOLY BIG BALLER (11222)", "CLASSIC SPEED BLACKJACK 42 (11223)", "N1 BLACKJACK (11224)", "CLASSIC SPEED BLACKJACK 47 (11225)", "CLASSIC SPEED BLACKJACK 48 (11226)", "CLASSIC SPEED BLACKJACK 45 (11227)", "CLASSIC SPEED BLACKJACK 6 (11228)", "CLASSIC SPEED BLACKJACK 43 (11229)", "CLASSIC SPEED BLACKJACK 46 (11230)", "CLASSIC SPEED BLACKJACK 8 (11231)", "CLASSIC SPEED BLACKJACK 9 (11232)", "CRAPS (11233)", "CLASSIC SPEED BLACKJACK 44 (11234)", "CLASSIC SPEED BLACKJACK 49 (11235)", "CRAZY COIN FLIP (11236)", "CLASSIC SPEED BLACKJACK 5 (11237)", "DEAD OR ALIVE SALOON (11238)", "CRAZY TIME (11239)", "CLASSIC SPEED BLACKJACK 50 (11240)", "DEAL OR NO DEAL (11241)", "NETHERLAND ROULETTE (11242)", "NO COMM SPEED BACCARAT A (11243)", "NO COMM SPEED BACCARAT B (11244)", "NO COMM SPEED BACCARAT C (11245)", "NORSK ROULETTE (11246)", "ONYX BLACKJACK (11247)", "BLACKJACK PARTY (11248)", "PEEK BACCARAT (11249)", "BLACKJACK PLATINUM VIP (11250)", "POWER BLACKJACK (11251)", "PUNTO BANCO (11252)", "LOBBY (11253)", "FIRST PERSON BACCARAT (11254)", "FIRST PERSON CRAPS (11255)", "FIRST PERSON DRAGON TIGER (11256)", "FIRST PERSON MEGA BALL (11257)", "FIRST PERSON TOP CARD (11258)", "ROLETA AO VIVO (11259)", "ROLETA RELAMPAGO (11260)", "ROOBET FIRST PERSON BLACKJACK (11261)", "ROULETTE (11262)", "ROULETTE LIVE (11263)", "RULETA AUTO FRANCESA (11264)", "RULETA AUTOMÁTICA (11265)", "RULETA EN ESPANOL (11266)", "RULETA EN VIVO (11267)", "RULETKA LIVE (11268)", "SALON PRIVE BACCARAT A (11269)", "SALON PRIVE BACCARAT B (11270)", "SALON PRIVE BLACKJACK D (11271)", "SALON PRIVE BLACKJACK E (11272)", "SALON PRIVE BLACKJACK F (11273)", "SALON PRIVE BLACKJACK A (11274)", "SALON PRIVE BLACKJACK C (11275)", "SALON PRIVE BLACKJACK B (11276)", "SALON PRIVE ROULETTE (11277)", "SALON PRIVE BACCARAT C (11278)", "SALON PRIVE BACCARAT D (11279)", "SALON PRIVE BACCARAT E (11280)", "SALON PRIVE BACCARAT F (11281)", "SALON PRIVE BACCARAT G (11282)", "SALON PRIVE BACCARAT H (11283)", "SALON PRIVE BACCARAT I (11284)", "SALON PRIVE BACCARAT J (11285)", "SALON PRIVE BLACKJACK G (11286)", "SALON PRIVE BLACKJACK H (11287)", "SALON PRIVE BLACKJACK I (11288)", "SALON PRIVE BLACKJACK J (11289)", "SIDE BET CITY (11290)", "SILVER (11291)", "BLACKJACK SILVER (11292)", "BLACKJACK SILVER B (11293)", "BLACKJACK SILVER C (11294)", "BLACKJACK SILVER D (11295)", "BLACKJACK SILVER E (11296)", "BLACKJACK SILVER F (11297)", "BLACKJACK SILVER G (11298)", "SOL CASINO FIRST PERSON BLACKJACK (11299)", "SPEED AUTO ROULETTE (11300)", "SPEED BACCARAT (11301)", "SPEED BACCARAT B (11302)", "SPEED BACCARAT C (11303)", "SPEED BACCARAT D (11304)", "SPEED BACCARAT E (11305)", "SPEED BACCARAT F (11306)", "SPEED BACCARAT G (11307)", "SPEED BACCARAT H (11308)", "SPEED BACCARAT I (11309)", "SPEED BACCARAT J (11310)", "SPEED BACCARAT K (11311)", "SPEED BACCARAT L (11312)", "SPEED BACCARAT M (11313)", "SPEED BACCARAT N (11314)", "SPEED BACCARAT O (11315)", "SPEED BACCARAT P (11316)", "SPEED BACCARAT Q (11317)", "SPEED BACCARAT R (11318)", "SPEED BACCARAT S (11319)", "SPEED BACCARAT T (11320)", "SPEED BACCARAT U (11321)", "SPEED BACCARAT V (11322)", "SPEED BACCARAT W (11323)", "SPEED BACCARAT X (11324)", "SPEED VIP BLACKJACK A (11325)", "SPEED VIP BLACKJACK B (11326)", "SPEED VIP BLACKJACK C (11327)", "SPEED VIP BLACKJACK D (11328)", "SPEED VIP BLACKJACK E (11329)", "SPEED VIP BLACKJACK F (11330)", "SPEED VIP BLACKJACK G (11331)", "SPEED VIP BLACKJACK H (11332)", "SPEED VIP BLACKJACK I (11333)", "SPEED VIP BLACKJACK J (11334)", "SPEED VIP BLACKJACK K (11335)", "SPEED VIP BLACKJACK L (11336)", "SPEED VIP BLACKJACK M (11337)", "SPEED ROULETTE (11338)", "CARIBBEAN STUD POKER (11339)", "SUOMALAINEN RULETTI (11340)", "SUPER ANDAR BAHAR (11341)", "SUPER SIC BO (11342)", "NO COMM BACCARAT (11343)", "SVENSK ROULETTE (11344)", "TEEN PATTI (11345)", "TEXAS HOLD'EM BONUS (11346)", "THREE CARD POKER (11347)", "FOOTBALL STUDIO (11348)", "LOBBY (11349)", "TRIPLE CARD POKER (11350)", "TURKCE FUTBOL STUDYOSU (11351)", "TURKCE RULET (11352)", "TURKISH LIGHTNING ROULETTE (11353)", "2 HAND CASINO HOLD'EM (11354)", "ULTIMATE TEXAS HOLD'EM (11355)", "VIP BLACKJACK EM PORTUGUES 4 (11356)", "VIP BLACKJACK EN ESPANOL 7 (11357)", "VIP DIAMOND (11358)", "BLAZE VIP BLACKJACK (11359)", "VIP PLATINUM (11360)", "VIP ROULETTE (11361)", "CLASSIC SPEED BLACKJACK 41 (11362)", "XXXTREME LIGHTNING ROULETTE (11363)", "AMBER BLACKJACK (11364)", "AMERICAN ROULETTE (11365)", "AMERICAN ROULETTE (11366)", "AUTO LIGHTNING ROULETTE (11367)", "AUTO ROULETTE LA PARTAGE (11368)", "BLACKJACK CLASSIC 53 (11369)", "BLACKJACK CLASSIC 57 (11370)", "BLACKJACK CLASSIC 58 (11371)", "BLACKJACK CLASSIC 59 (11372)", "BLACKJACK CLASSIC 64 (11373)", "BLACKJACK CLASSIC 63 (11374)", "BLACKJACK CLASSIC 66 (11375)", "BLACKJACK CLASSIC 69 (11376)", "BLACKJACK CLASSIC 71 (11377)", "BLACKJACK C (11378)", "BLACKJACK CLASSIC 75 (11379)", "ARABIC ROULETTE (11380)", "AURORA BLACKJACK VIRGO (11381)", "BACARA RAPIDO EN ESPANOL (11382)", "BAC BO (11383)", "AURORA BLACKJACK LIBRA (11384)", "AURORA BLACKJACK TAURUS (11385)", "BLACKJACK CLASSIC 72 (11386)", "BLACKJACK A (11387)", "CLASSIC SPEED BLACKJACK 7 (11388)", "AUTO ROULETTE (11389)", "AUTO ROULETTE VIP (11390)", "BLACKJACK CLASICO EN ESPANOL 2 (11391)", "BLACKJACK CLASSIC 60 (11392)", "BLACKJACK CLASSIC 68 (11393)", "BLACKJACK CLASSIC 74 (11394)", "BLACKJACK CLASSIC 73 (11395)", "BLACKJACK CLASSIC 76 (11396)", "BETAMO FIRST PERSON ROULETTE (11397)", "BACCARAT (11398)", "BACCARAT SQUEEZE (11399)", "BACCARAT C (11400)", "CLASSIC SPEED BLACKJACK 11 (11401)", "BACCARAT CONTROLLED SQUEEZE (11402)", "CLASSIC SPEED BLACKJACK 10 (11403)", "LOBBY (11404)", "CLASSIC SPEED BLACKJACK (11405)", "CLASSIC SPEED BLACKJACK 13 (11406)", "CLASSIC SPEED BLACKJACK 14 (11407)", "BACCARAT B (11408)", "CLASSIC SPEED BLACKJACK 16 (11409)", "BLACKJACK CLASSIC 18 (11410)", "CLASSIC SPEED BLACKJACK 19 (11411)", "BLACKJACK CLASSIC 17 (11412)", "CLASSIC SPEED BLACKJACK 2 (11413)", "BLACKJACK CLASSIC 20 (11414)", "BLACKJACK CLASSIC 21 (11415)", "CLASSIC SPEED BLACKJACK 12 (11416)", "CLASSIC SPEED BLACKJACK 15 (11417)", "BLACKJACK CLASSIC 24 (11418)", "CLASSIC SPEED BLACKJACK 17 (11419)", "BLACKJACK CLASSIC 22 (11420)", "CLASSIC SPEED BLACKJACK 18 (11421)", "BLACKJACK CLASSIC 26 (11422)", "BLACKJACK CLASSIC 25 (11423)", "BLACKJACK CLASSIC 29 (11424)", "BLACKJACK CLASSIC 50 (11425)", "BLACKJACK EN ESPANOL 3 (11426)", "BLACKJACK EN ESPANOL 4 (11427)", "BLACKJACK EN ESPANOL 5 (11428)", "BLACKJACK EN ESPANOL 6 (11429)", "BLACKJACK VIP X (11430)", "SPEED BLACKJACK G (11431)", "SPEED BLACKJACK H (11432)", "SPEED BLACKJACK I (11433)", "SPEED BLACKJACK J (11434)", "BLACKJACK VIP F (11435)", "BLACKJACK VIP U (11436)", "FIRST PERSON BLACKJACK (11437)", "BLACKJACK VIP (11438)", "BLACKJACK VIP I (11439)", "BLACKJACK VIP 11 (11440)", "BLACKJACK VIP 10 (11441)", "BLACKJACK VIP 12 (11442)", "BLACKJACK VIP 13 (11443)", "BLACKJACK VIP 17 (11444)", "BLACKJACK VIP 2 (11445)", "BLACKJACK VIP 21 (11446)", "BLACKJACK VIP 20 (11447)", "BLACKJACK VIP 22 (11448)", "BLACKJACK VIP 26 (11449)", "BLACKJACK VIP 6 (11450)", "BLACKJACK VIP 7 (11451)", "BLACKJACK VIP 8 (11452)", "BLACKJACK VIP 9 (11453)", "BLACKJACK VIP A (11454)", "BLACKJACK VIP 14 (11455)", "BLACKJACK VIP 15 (11456)", "BLACKJACK VIP 16 (11457)", "BLACKJACK VIP 18 (11458)", "BLACKJACK VIP 19 (11459)", "BLACKJACK VIP 25 (11460)", "BLACKJACK VIP 27 (11461)", "BLACKJACK VIP 3 (11462)", "BLACKJACK VIP 4 (11463)", "BLACKJACK VIP ALPHA (11464)", "BLACKJACK VIP 5 (11465)", "BLACKJACK VIP B (11466)", "BLACKJACK VIP BETA (11467)", "BLACKJACK VIP C (11468)", "BLACKJACK VIP D (11469)", "BLACKJACK VIP E (11470)", "BLACKJACK VIP G (11471)", "BLACKJACK VIP H (11472)", "BLACKJACK VIP J (11473)", "BLACKJACK VIP K (11474)", "BLACKJACK VIP L (11475)", "BLACKJACK VIP M (11476)", "BLACKJACK VIP O (11477)", "BLACKJACK VIP O (11478)", "BLACKJACK VIP P (11479)", "BLACKJACK VIP Q (11480)", "BLACKJACK VIP R (11481)", "BLACKJACK VIP S (11482)", "BLACKJACK VIP T (11483)", "BLACKJACK VIP V (11484)", "BLACKJACK VIP Z (11485)", "SPEED BLACKJACK K (11486)", "SPEED BLACKJACK L (11487)", "BLACKJACK CLASSIC 8 (11488)", "BLACKJACK CLASSIC 78 (11489)", "BLACKJACK CLASSICO EM PORTUGUES 2 (11490)", "BLACKJACK CLASSIC 9 (11491)", "SPEED BLACKJACK (11492)", "BLACKJACK DIAMOND VIP (11493)", "BLACKJACK EN ESPANOL 1 (11494)", "BLACKJACK CLASSIC 44 (11495)", "BLACKJACK CLASSIC 47 (11496)", "BLACKJACK CLASSIC 30 (11497)", "BLACKJACK CLASSIC 49 (11498)", "BLACKJACK CLASSIC 52 (11499)", "BLACKJACK CLASSIC 55 (11500)", "BLACKJACK CLASSIC 35 (11501)", "BLACKJACK CLASSIC 61 (11502)", "BLACKJACK CLASSIC 65 (11503)", "BLACKJACK CLASSIC 31 (11504)", "BLACKJACK CLASSIC 3 (11505)", "CLASSIC SPEED BLACKJACK 24 (11506)", "CLASSIC SPEED BLACKJACK 33 (11507)", "BLACKJACK CLASSIC 32 (11508)", "BLACKJACK CLASSIC 38 (11509)", "BLACKJACK CLASSIC 43 (11510)", "BLACKJACK CLASSIC 37 (11511)", "BLACKJACK CLASSIC 41 (11512)", "CLASSIC SPEED BLACKJACK 32 (11513)", "BLACKJACK CLASSIC 46 (11514)", "BLACKJACK CLASSIC 42 (11515)", "BLACKJACK CLASSIC 51 (11516)", "BLACKJACK VIP GAMMA (11517)", "BLAZE FIRST PERSON BLACKJACK (11518)", "BLACKJACK CLASSIC 70 (11519)", "BLACKJACK CLASSIC 39 (11520)", "BLACKJACK CLASICO EN ESPANOL 1 (11521)", "BLACKJACK CLASSIC 45 (11522)", "CLASSIC SPEED BLACKJACK 4 (11523)", "BLACKJACK CLASSICO EM PORTUGUES 1 (11524)", "BLACKJACK CLASSIC 81 (11525)", "BLACKJACK CLASSIC 77 (11526)", "BLACKJACK CLASSIC 48 (11527)", "BLACKJACK EN ESPANOL 2 (11528)", "BLACKJACK CLASSIC 54 (11529)", "BLACKJACK CLASSIC 56 (11530)", "BLACKJACK CLASSIC 62 (11531)", "BLACKJACK CLASSIC 67 (11532)", "CLASSIC BLACKJACK 7 (11533)", "BLACKJACK (11534)", "BLACKJACK B (11535)", "BLACKJACK CLASICO EN ESPANOL 3 (11536)", "BLACKJACK CLASSIC 79 (11537)", "BLACKJACK CLASSIC 80 (11538)", "SPEED BLACKJACK E (11539)", "CLASSIC SPEED BLACKJACK 39 (11540)", "CLASSIC SPEED BLACKJACK 38 (11541)", "BRAZILIAN ROULETTE (11542)", "BRONZE (11543)", "CASH OR CRASH (11544)", "CASINO HOLD'EM (11545)", "CASINO MALTA ROULETTE (11546)", "BUCHAREST AUTO ROULETTE (11547)", "CLASSIC SPEED BLACKJACK 21 (11548)", "CLASSIC SPEED BLACKJACK 20 (11549)", "CLASSIC SPEED BLACKJACK 22 (11550)", "CLASSIC SPEED BLACKJACK 25 (11551)", "CLASSIC SPEED BLACKJACK 23 (11552)", "CLASSIC SPEED BLACKJACK 26 (11553)", "CLASSIC SPEED BLACKJACK 28 (11554)", "CLASSIC SPEED BLACKJACK 27 (11555)", "CLASSIC SPEED BLACKJACK 29 (11556)", "CLASSIC SPEED BLACKJACK 30 (11557)", "CLASSIC SPEED BLACKJACK 34 (11558)", "CLASSIC SPEED BLACKJACK 3 (11559)", "CLASSIC SPEED BLACKJACK 35 (11560)", "CLASSIC SPEED BLACKJACK 36 (11561)", "CLASSIC SPEED BLACKJACK 37 (11562)", "BLACKJACK VIP Z (11563)", "CLASSIC SPEED BLACKJACK 40 (11564)", "CLASSIC SPEED BLACKJACK 31 (11565)", "SPEED BLACKJACK M (11566)", "ROX PRIVATE BLACKJACK (12643)", "RULETA BOLA RAPIDA EN VIVO (16609)", "RULETA RELÁMPAGO EN VIVO (16610)", "BLACKJACK CLASSICO EM PORTUGUES 3 (16771)", "CORAL BLACKJACK (16824)", "JADE BLACKJACK (16826)", "MOONSTONE BLACKJACK (16827)", "SPEED BACCARAT 1 (17344)", "SPEED BACCARAT 3 (17345)", "SPEED BACCARAT 2 (17348)", "SPEED BACCARAT Z (17349)", "CHIPS.GG FIRST PERSON BLACKJACK (17357)", "N1 FIRST PERSON BLACKJACK (17359)", "BLACKJACK VIP N (17379)", "ROX FIRST PERSON BLACKJACK (17381)", "CRAZY TIME A (17549)", "RUSSIAN ROYAL BLACKJACK (17792)", "ROLLBIT FIRST PERSON BLACKJACK (18064)", "BLAZE BLACKJACK AO VIVO (18123)", "BLAZE BLACKJACK RAPIDO (18124)", "BLAZE ROLETA AO VIVO (18125)", "BLACKJACK CLASSIC 88 (19312)", "EXTRA CHILLI EPIC SPINS (19362)", "BLACKJACK VIP 29 (19420)", "CLASSIC SPEED BLACKJACK 61 (19421)", "CLASSIC SPEED BLACKJACK 60 (19422)", "BLACKJACK VIP 28 (19423)", "CLASSIC SPEED BLACKJACK 62 (19424)", "CLASSIC SPEED BLACKJACK 65 (19425)", "CLASSIC SPEED BLACKJACK 66 (19426)", "CLASSIC SPEED BLACKJACK 63 (19427)", "CLASSIC SPEED BLACKJACK 64 (19428)", "FUNKY TIME (21653)", "BONSAI SPEED BACCARAT A (21654)", "BONSAI SPEED BACCARAT C (21655)", "BONSAI SPEED BACCARAT B (21656)", "SALON PRIVE BACCARAT K (21657)", "FIRST PERSON BETFURY BLACKJACK (21658)", "SALON PRIVE BACCARAT L (21659)", "BLACKJACK CLASSICO EM PORTUGUES 4 (21703)", "BLACKJACK CLASSICO EM PORTUGUES 5 (21704)", "RULETA DUAL PLAY (21708)", "TONYBET FIRST PERSON BLACKJACK (21781)", "CLASSIC SPEED BLACKJACK 51 (21789)", "CLASSIC SPEED BLACKJACK 55 (21790)", "CLASSIC SPEED BLACKJACK 54 (22257)", "CLASSIC SPEED BLACKJACK 80 (22259)", "FIRST PERSON XXXTREME LIGHTNING ROULETTE (22533)", "BLACKJACK CLASSIC 89 (22745)", "BLACKJACK CLASSIC 90 (22820)", "MEGA BOLA DA SORTE (22821)", "BLACKJACK EM PORTUGUES 1 (22822)", "BLACKJACK EM PORTUGUES 2 (22823)", "GOLD VAULT ROULETTE (22824)", "VIDEO POKER (23083)", "FIRST PERSON PROSPERITY TREE BACCARAT (23084)", "BLACKJACK ILIMITADO AO VIVO (23127)", "GONZO’S TREASURE MAP (23221)", "PROSPERITY TREE BACCARAT (23222)", "FIRST PERSON LIGHTNING LOTTO (23332)", "LIGHTNING LOTTO (23333)", "CLASSIC SPEED BLACKJACK 68 (23888)", "CLASSIC SPEED BLACKJACK 70 (23890)", "CLASSIC SPEED BLACKJACK 71 (23892)", "CLASSIC SPEED BLACKJACK 72 (23894)", "CLASSIC SPEED BLACKJACK 73 (24731)", "CLASSIC SPEED BLACKJACK 75 (24734)", "GRAND JAPANESE BLACKJACK (24777)", "GRAND KOREAN BLACKJACK (24778)", "HINDI ROULETTE (24779)", "HINDI SPEED BACCARAT (24780)", "JAPANESE SPEED BACCARAT A (24781)", "JAPANESE SPEED BACCARAT B (24782)", "JAPANESE SPEED BACCARAT C (24783)", "JAPANESE SPEED BACCARAT D (24784)", "KOREAN DEALER BASEBALL STUDIO (24785)", "KOREAN DEALER LIGHTNING ROULETTE (24786)", "KOREAN DEALER POWER BLACKJACK (24787)", "KOREAN DEALER SPEED BLACKJACK (24788)", "KOREAN SPEAKING SPEED BACCARAT (24789)", "KOREAN SPEAKING SPEED BACCARAT 2 (24790)", "KOREAN SPEED BACCARAT A (24791)", "KOREAN SPEED BACCARAT B (24792)", "KOREAN SPEED BACCARAT C (24793)", "KOREAN SPEED BACCARAT D (24794)", "KOREAN SPEED BACCARAT E (24795)", "KOREAN SPEED BACCARAT F (24796)", "LOTUS ROULETTE (24797)", "LOTUS SPEED BACCARAT A (24798)", "SPEED BACCARAT 11 (24799)", "SPEED BACCARAT 12 (24800)", "SPEED BACCARAT 13 (24801)", "SPEED BACCARAT 14 (24802)", "SPEED BACCARAT 15 (24803)", "SPEED BACCARAT 6 (24804)", "SPEED BACCARAT 7 (24805)", "SPEED BACCARAT 8 (24806)", "FREE BET BLACKJACK 18 (24807)", "CLASSIC SPEED BLACKJACK 67 (24808)", "FREE BET BLACKJACK 20 (24809)", "CLASSIC SPEED BLACKJACK 69 (24810)", "EMPEROR ROULETTE (24811)", "FREE BET BLACKJACK 17 (24812)", "EMPEROR SIC BO (24813)", "EMPEROR SPEED BACCARAT B (24814)", "EMPEROR SIC BO A (24815)", "EMPEROR SPEED BACCARAT A (24816)", "FREE BET BLACKJACK 14 (24817)", "EMPEROR DRAGON TIGER (24818)", "EMPEROR BAC BO (24819)", "FREE BET BLACKJACK 23 (24820)", "FREE BET BLACKJACK 13 (24821)", "FREE BET BLACKJACK 19 (24822)", "EMPEROR SPEED BACCARAT C (24823)", "EMPEROR SPEED BACCARAT D (24824)", "CLASSIC SPEED BLACKJACK 74 (24825)", "FREE BET BLACKJACK 21 (24826)", "FREE BET BLACKJACK 22 (24827)", "FREE BET BLACKJACK 11 (24828)", "FREE BET BLACKJACK 16 (24829)", "FREE BET BLACKJACK 12 (24830)", "FREE BET BLACKJACK 15 (24831)", "FREE BET BLACKJACK 10 (24832)", "THAI SPEED BACCARAT A (24833)", "EMPEROR SIC BO (24834)", "FIRST PERSON XXXTREME LIGHTNING BACCARAT (24835)", "XXXTREME LIGHTNING BACCARAT (24836)", "FIRST PERSON CASH OR CRASH (24837)", "FREE BET BLACKJACK CLASSICO EM PORTUGUES 1 (24838)", "FREE BET BLACKJACK CLASSICO EM PORTUGUES 2 (24839)", "RED DOOR ROULETTE (24911)", "BLACKJACK CLASSIC 10 (25167)", "BLACKJACK CLASSIC 11 (25175)", "BLACKJACK CLASSIC 12 (27430)", "BLACKJACK CLASSIC 1 (27431)", "BLACKJACK CLASSIC 2 (27432)", "BOOMERANG FIRST PERSON BACCARAT (27434)", "BOOMERANG FIRST PERSON BLACKJACK (31133)", "BOOMERANG FIRST PERSON DREAM CATCHER (31134)", "BOOMERANG FIRST PERSON FOOTBALL STUDIO AO VIVO (31135)", "BOOMERANG FIRST PERSON FOOTBALL STUDIO STANDARD (31136)", "CLASSIC SPEED BLACKJACK 52 (31137)", "BLACKJACK EM PORTUGUES OURO (31138)", "BLACKJACK CLASSIC (31139)", "BLACKJACK CLASICO EN ESPANOL 5 (31140)", "BLACKJACK CLASICO EN ESPANOL 6 (31141)", "BLACKJACK CLASICO EN ESPANOL 7 (31142)", "BLACKJACK CLASICO EN ESPANOL 8 (31143)", "BLACKJACK CLASICO EN ESPANOL 9 (31145)", "BLACKJACK CLASSIC 4 (31752)", "BLACKJACK CLASSIC 5 (31753)", "BLACKJACK CLASSIC 8 (31754)", "BLACKJACK CLASICO EN ESPANOL 11 (31755)", "BLACKJACK CLASSIC 9 (31756)", "BLACKJACK CLASICO EN ESPANOL 10 (31757)", "BLACKJACK CLASICO EN ESPANOL 4 (31758)", "BAC BO AO VIVO (31759)", "FREE BET BLACKJACK 8 (31760)", "FIRST PERSON SUPER SIC BO (31761)", "FREE BET BLACKJACK 9 (31762)", "INSTANT SUPER SIC BO (31763)", "CRAZY PACHINKO (31764)", "LOBBY (31915)", "LOBBY (31916)", "LOBBY (31921)", "FIRST PERSON ROULETTE (31922)", "LOBBY (31923)", "FIRST PERSON LIGHTNING ROULETTE (32010)", "LOBBY (32012)", "LOBBY (32013)", "LOBBY (32015)", "BLACKJACK (32016)", "BLACKJACK (32017)", "BOOMERANG FIRST PERSON CRAPS (32018)", "BLACKJACK CLASSICO EM PORTUGUES 9 (32019)", "BINGOBONGA FIRST PERSON FOOTBALL STUDIO AO VIVO (32020)", "BINGOBONGA FIRST PERSON FOOTBALL STUDIO STANDARD (32021)", "BINGOBONGA FIRST PERSON CRAPS (32023)", "BINGOBONGA FIRST PERSON DREAM CATCHER (32245)", "BINGOBONGA FIRST PERSON BACCARAT (32246)", "BINGOBONGA FIRST PERSON BLACKJACK (32473)", "BLACKJACK (32474)", "BLACKJACK (32523)", "BLACKJACK (32524)", "VIP BLACKJACK EN ESPANOL 2 (32525)", "VIP BLACKJACK EN ESPANOL 3 (32526)", "VIP BLACKJACK EN ESPANOL 4 (32527)", "BLACKJACK (32528)", "BLACKJACK (32574)", "VIP BLACKJACK EM PORTUGUES 2 (32575)", "BLACKJACK CLASSIC RU 3 (32645)", "BLACKJACK CLASSIC RU 2 (32761)", "BINGOBONGA FIRST PERSON ROULETTE (32762)", "SPEED BACCARAT 10 (32763)", "SPEED BACCARAT 5 (32857)", "SPEED BACCARAT 9 (32952)", "SPEED BACCARAT 4 (32953)", "VIP BLACKJACK EM PORTUGUES 4 (33100)", "VIP BLACKJACK EM PORTUGUES 5 (33295)", "VIP BLACKJACK EM PORTUGUES 3 (33300)", "BLACKJACK VIP 35 (34751)", "BLACKJACK VIP 31 (34753)", "BLACKJACK VIP 36 (34754)", "BLACKJACK VIP 30 (34755)", "CLASSIC SPEED BLACKJACK 53 (34756)", "BLACKJACK VIP 32 (34757)", "BLACKJACK VIP 34 (34758)", "BLACKJACK VIP 37 (34759)", "CLASSIC SPEED BLACKJACK 56 (34828)", "KLASIK SPEED BLACKJACK 2 (34829)", "KLASIK SPEED BLACKJACK 3 (34830)", "KLASIK SPEED BLACKJACK 1 (34831)", "SPEED VIP BLACKJACK N (34832)", "SPEED VIP BLACKJACK R (34833)", "SPEED VIP BLACKJACK Q (34834)", "SALON PRIVE BACCARAT N (34835)", "SALON PRIVE BACCARAT M (34836)", "SPEED VIP BLACKJACK P (34837)", "BOOMERANG FIRST PERSON ROULETTE (34838)", "GREEK ROULETTE (34839)", "SPEED VIP BLACKJACK O (34840)", "NINE CASINO BLACKJACK (34841)", "BLACKJACK CLASSIC 7 (34842)", "BLACKJACK VIP 41 (34843)", "CLASSIC SPEED BLACKJACK 83 (34844)", "CLASSIC SPEED BLACKJACK 89 (34845)", "CLASSIC SPEED BLACKJACK 81 (35266)", "CLASSIC SPEED BLACKJACK 86 (35268)", "BLACKJACK VIP 33 (35269)", "BLACKJACK VIP 42 (35424)", "BLACKJACK VIP 43 (36169)", "BLACKJACK VIP 44 (36170)", "FREE BET VIP BLACKJACK A (36171)", "FUTEBOL STUDIO AO VIVO (36172)", "CLASSIC SPEED BLACKJACK 88 (36173)", "CLASSIC SPEED BLACKJACK 78 (36174)", "CLASSIC SPEED BLACKJACK 79 (36175)", "CLASSIC SPEED BLACKJACK 77 (36176)", "CLASSIC SPEED BLACKJACK 82 (36177)", "CLASSIC SPEED BLACKJACK 90 (36178)", "CLASSIC SPEED BLACKJACK 87 (36179)", "CLASSIC SPEED BLACKJACK 85 (36180)", "CLASSIC SPEED BLACKJACK 76 (36181)", "CLASSIC SPEED BLACKJACK 84 (36182)", "BLACKJACK VIP 38 (36183)", "KLASIK BLACKJACK 11 (36184)", "KLASIK BLACKJACK 10 (36185)", "KLASIK BLACKJACK 9 (36186)", "KLASIK BLACKJACK 8 (36187)", "KLASIK BLACKJACK 3 (36188)", "FREE BET VIP BLACKJACK B (36189)", "KLASIK BLACKJACK 12 (36190)", "KLASIK BLACKJACK 2 (36191)", "KLASIK BLACKJACK 4 (36192)", "KLASIK BLACKJACK (36193)", "KLASIK BLACKJACK 5 (36194)", "BLACKJACK CLASSICO EM PORTUGUES 14 (36195)", "BLACKJACK CLASSICO EM PORTUGUES 6 (36196)", "CLASSIC SPEED BLACKJACK 107 (36197)", "CLASSIC SPEED BLACKJACK 120 (36198)", "CLASSIC SPEED BLACKJACK 59 (36199)", "CLASSIC SPEED BLACKJACK 121 (36200)", "CLASSIC SPEED BLACKJACK 110 (36202)", "CLASSIC SPEED BLACKJACK 108 (36203)", "CLASSIC SPEED BLACKJACK 58 (36570)", "CLASSIC SPEED BLACKJACK 57 (36571)", "STOCK MARKET (36572)", "CLASSIC SPEED BLACKJACK 122 (36573)", "CLASSIC SPEED BLACKJACK 93 (36574)", "CLASSIC SPEED BLACKJACK 95 (36575)", "BENELUX SLINGSHOT (36576)", "BLACKJACK 1 (36577)", "BJ FRANCOPHONE EXCLUSIVE (36578)", "BJ FRANCOPHONE (36579)", "BLACKJACK 2 (36581)", "BLACKJACK 3 (36743)", "BLACKJACK 4 (36744)", "BLACKJACK VIP 40 (36745)", "BLACKJACK VIP 45 (37022)", "BLACKJACK VIP 50 (37023)", "BLACKJACK VIP 48 (37024)", "BLACKJACK VIP 54 (37025)", "BLACKJACK VIP 47 (37026)", "BLACKJACK VIP 55 (37027)", "BLACKJACK VIP 58 (37028)", "BLACKJACK VIP 59 (37029)", "BLACKJACK VIP 68 (37030)", "BLACKJACK VIP 60 (37031)", "BLACKJACK VIP 66 (37032)", "BLACKJACK VIP 39 (37033)", "BLACKJACK VIP 56 (37034)", "BLACKJACK VIP 67 (37035)", "BLACKJACK VIP 69 (37036)", "BLACKJACK VIP 70 (37037)", "BUCHAREST BLACKJACK A (37038)", "BUCHAREST INFINITE FREE BET BLACKJACK (37039)", "BUCHAREST ROULETTE (37040)", "BLACKJACK VIP 65 (37041)", "CLASSIC SPEED BLACKJACK 102 (37042)", "CLASSIC SPEED BLACKJACK 106 (37043)", "CLASSIC SPEED BLACKJACK 111 (37044)", "CLASSIC SPEED BLACKJACK 105 (37045)", "BLACKJACK VIP 49 (37046)", "BLACKJACK VIP 52 (37047)", "CLASSIC SPEED BLACKJACK 117 (37048)", "BLACKJACK VIP 51 (37049)", "BLACKJACK VIP 53 (37050)", "CLASSIC SPEED BLACKJACK 118 (37051)", "CLASSIC SPEED BLACKJACK 103 (37052)", "BLACKJACK VIP 46 (37053)", "BLACKJACK VIP 63 (37054)", "CLASSIC SPEED BLACKJACK 104 (37055)", "CLASSIC SPEED BLACKJACK 100 (37056)", "BLACKJACK VIP 64 (37057)", "CLASSIC SPEED BLACKJACK 109 (37058)", "BLACKJACK VIP 61 (37059)", "BLACKJACK VIP 62 (37060)", "BUCHAREST BLACKJACK B (37061)", "CLASSIC SPEED BLACKJACK 101 (37062)", "CLASSIC SPEED BLACKJACK 112 (37063)", "CLASSIC SPEED BLACKJACK 113 (37064)", "CLASSIC SPEED BLACKJACK 114 (37065)", "CLASSIC SPEED BLACKJACK 115 (37066)", "CLASSIC SPEED BLACKJACK 116 (37067)", "CASINO HOLD'EM ITALIA (37069)", "CLASSIC SPEED BLACKJACK 119 (37070)", "LA PARTAGE FRANCOPHONE (37071)", "RULETA FRANCESA EN VIVO (37072)", "SPEED SUPER SIC BO (37073)", "BLACKJACK VIP 57 (37074)", "CLASSIC SPEED BLACKJACK 20 (37075)", "CLASSIC SPEED BLACKJACK 91 (37076)", "CLASSIC SPEED BLACKJACK 97 (37077)", "CLASSIC SPEED BLACKJACK 99 (37078)", "EVO SPEED BLACKJACK 5 (37079)", "EVO SPEED BLACKJACK 9 (37080)", "EVO SPEED BLACKJACK 7 (37081)", "EVO SPEED BLACKJACK 6 (37206)", "EVO SPEED BLACKJACK 11 (37207)", "EMPEROR GOLDEN WEALTH BACCARAT (37208)", "FREE BET VIP BLACKJACK D (37210)", "FREE TES (37211)", "ROULETTE INDIAN (33687)", "SPEED BACCARAT 5 (33689)", "PRIVE LOUNGE BLACKJACK 2 (33691)", "PRIVE LOUNGE BLACKJACK 1 (33692)", "PRIVE LOUNGE BLACKJACK 5 (33698)", "MEGA BACCARAT (33700)", "PRIVE LOUNGE BLACKJACK 4 (33703)", "BACCARAT 9 (33705)", "SPEED BACCARAT 9 (33706)", "BLACKJACK 7: AZURE (33707)", "BLACKJACK 2: AZURE (33708)", "BLACKJACK 5: AZURE (33709)", "BLACKJACK 9: AZURE (33710)", "BLACKJACK 8: AZURE (33711)", "BLACKJACK 4: AZURE (33719)", "BLACKJACK 1: AZURE (33720)", "CLASSIC SPEED BLACKJACK 66 (33721)", "BLACKJACK CLASSIC 9 (33722)", "INFINITE BLACKJACK (33723)", "BLACKJACK CLASSIC 49 (33724)", "SWEET BONANZA CANDYLAND (33725)", "ANDAR BAHAR (33726)", "BLACKJACK VIP I (33727)", "BLACKJACK CLASSIC 50 (33728)", "DRAGON TIGER (33729)", "BLACKJACK CLASSIC 55 (33730)", "BLACKJACK VIP V (33731)", "BLACKJACK CLASSIC 70 (33733)", "ONE BLACKJACK (33734)", "BLACKJACK CLASSIC 53 (33737)", "BLACKJACK CLASSIC 62 (33739)", "BLACKJACK VIP F (33740)", "BLACKJACK CLASSIC 56 (33742)", "BLACKJACK CLASSIC 64 (33743)", "BLACKJACK CLASSIC 59 (33744)", "BLACKJACK CLASSIC 58 (33745)", "BLACKJACK CLASSIC 57 (33746)", "BLACKJACK CLASSIC 61 (33747)", "BLACKJACK CLASSIC 60 (33751)", "CLASSIC SPEED BLACKJACK 62 (33753)", "ONE BLACKJACK 2: RUBY (33754)", "MEGA WHEEL (33761)", "BLACKJACK CLASSIC 72 (33766)", "BLACKJACK 15 (33768)", "BLACKJACK CLASSIC 26 (33769)", "BLACKJACK 12 (33770)", "BLACKJACK CLASSIC 20 (33771)", "BLACKJACK CLASSIC 25 (33772)", "BLACKJACK CLASSIC 24 (33773)", "CLASSIC SPEED BLACKJACK 64 (33774)", "BLACKJACK 16 (33779)", "BLACKJACK CLASSIC 63 (33780)", "BLACKJACK VIP B (33781)", "BLACKJACK VIP C (33782)", "BLACKJACK VIP D (33784)", "MEGA ROULETTE (33785)", "BLACKJACK SILVER C (33786)", "BLACKJACK SILVER E (33788)", "CLASSIC SPEED BLACKJACK 63 (33791)", "BLACKJACK CLASSIC 35 (33792)", "BLACKJACK VIP A (33793)", "BLACKJACK 18: AZURE (33794)", "BLACKJACK CLASSIC 54 (33795)", "BLACKJACK 22: AZURE (33796)", "BLACKJACK SILVER A (33797)", "BLACKJACK SILVER D (33798)", "BLACKJACK SILVER B (33800)", "BLACKJACK 30: AZURE (33802)", "BLACKJACK CLASSIC 51 (33803)", "BLACKJACK 28: AZURE (33804)", "BLACKJACK 34: THE CLUB (33806)", "BLACKJACK 21: AZURE (33807)", "BLACKJACK 17: AZURE (33808)", "ROULETTE AZURE (33809)", "BLACKJACK 26: AZURE (33811)", "BLACKJACK 36: THE CLUB (33812)", "BLACKJACK 35: THE CLUB (33813)", "BLACKJACK 31: AZURE (33817)", "BLACKJACK 33: THE CLUB (33818)", "BLACKJACK 32: AZURE (33819)", "ITALIAN ROULETTE (33820)", "BLACKJACK 3: AZURE (33821)", "GERMAN ROULETTE (33824)", "ROULETTE GREEN (33826)", "ROULETTE MACAO (33828)", "BLACKJACK 25: AZURE (33832)", "BLACKJACK 23: AZURE (33839)", "BLACKJACK 24: AZURE (33841)", "BLACKJACK 29: AZURE (33843)", "RUSSIAN ROULETTE (33848)", "BLACKJACK 6: AZURE (33849)", "BLACKJACK VIP L (33851)", "BLACKJACK VIP X (33852)", "BLACKJACK VIP Q (33853)", "BLACKJACK VIP S (33858)", "BLACKJACK VIP Z (33860)", "SALON PRIV√Й BLACKJACK C (33861)", "BLACKJACK CLASSIC 65 (33863)", "INSTANT ROULETTE (33864)", "BLACKJACK VIP ALPHA (33868)", "CLASSIC SPEED BLACKJACK 65 (33872)", "BLACKJACK VIP G (33873)", "BLACKJACK CLASSIC 30 (33875)", "BLACKJACK SILVER F (33876)", "BLACKJACK PLATINUM VIP (33877)", "BLACKJACK VIP E (33878)", "BLACKJACK VIP R (33879)", "BLACKJACK FORTUNE VIP (33882)", "BLACKJACK CLASSIC 44 (33884)", "BLACKJACK CLASSIC 47 (33885)", "FREE BET BLACKJACK (33887)", "BLACKJACK SILVER G (33888)", "BLACKJACK CLASSIC 69 (33890)", "BLACKJACK CLASSIC 8 (33891)", "BLACKJACK VIP O (33892)", "BLACKJACK VIP N (33893)", "BLACKJACK CLASSIC 45 (33894)", "GAME SHOWS (33896)", "BLACKJACK 11 (33897)", "BLACKJACK VIP H (33898)", "BLACKJACK VIP P (33901)", "BLACKJACK CLASSIC 29 (33902)", "BLACKJACK VIP K (33905)", "POWER BLACKJACK (33906)", "BLACKJACK 14 (33908)", "BLACKJACK CLASSIC 17 (33909)", "BLACKJACK VIP M (33911)", "BLACKJACK VIP J (33912)", "BLACKJACK CLASSIC 52 (33913)", "BLACKJACK (33914)", "BLACKJACK CLASSIC 46 (33915)", "BLACKJACK CLASSIC 71 (33921)", "BLACKJACK CLASSIC 18 (33924)", "CLASSIC SPEED BLACKJACK 60 (33925)", "BLACKJACK CLASSIC 48 (33926)", "BLACKJACK CLASSIC 68 (33929)", "BLACKJACK 27: AZURE (33933)", "BLACKJACK CLASSIC 43 (33935)", "IMMERSIVE ROULETTE (33936)", "SALON PRIV√Й BLACKJACK D (33937)", "BLACKJACK CLASSIC 66 (33938)", "AUTO-ROULETTE (33941)", "LIGHTNING ROULETTE (33942)", "SALON PRIV√Й BLACKJACK E (33943)", "BLACKJACK GRAND VIP (33944)", "BLACKJACK CLASSIC 74 (33945)", "SALON PRIV√Й BLACKJACK F (33946)", "SALON PRIV√Й BLACKJACK A (33947)", "BLACKJACK VIP GAMMA (33948)", "SALON PRIV√Й BLACKJACK B (33949)", "BLACKJACK CLASSIC 67 (33950)", "BLACKJACK 19: AZURE (33952)", "BLACKJACK 10: AZURE (33953)", "CLASSIC SPEED BLACKJACK 61 (33954)", "BLACKJACK VIP T (33955)", "BLACKJACK CLASSIC 73 (33956)", "BLACKJACK DIAMOND VIP (33958)", "BLACKJACK VIP U (33959)", "BLACKJACK VIP BETA (33961)", "BLACKJACK 20: AZURE (33962)", "ROULETTE (33966)", "VIP BLACKJACK 4 (33969)", "VIP BLACKJACK 5 (33970)", "SPEED BLACKJACK 4 (33971)", "SPEED BLACKJACK 5 (33972)", "BLACKJACK 65: RUBY (33973)", "BLACKJACK 64: RUBY (33974)", "VIP BLACKJACK 1 (33975)", "VIP BLACKJACK 2 (33976)", "SPEED BLACKJACK 1 (33977)", "SPEED BLACKJACK 2 (33978)", "SPEED BLACKJACK 3 (33979)", "VIP BLACKJACK 3 (33980)", "SUPER 8 BACCARAT (33981)", "POWERUP ROULETTE (33982)", "BLACKJACK 70: RUBY (33983)", "CLASSIC SPEED BLACKJACK 9 (33984)", "CLASSIC SPEED BLACKJACK 10 (33985)", "CLASSIC SPEED BLACKJACK 8 (33986)", "CRAPS (33987)", "SPEED BACCARAT B (33988)", "NO COMMISSION SPEED BACCARAT C (33989)", "SPEED BACCARAT Q (33990)", "SPEED BACCARAT I (33991)", "CLASSIC SPEED BLACKJACK 4 (33992)", "SALON PRIV√Й BACCARAT B (33993)", "SPEED BACCARAT K (33994)", "SPEED BACCARAT R (33995)", "SPEED BACCARAT A (33996)", "NO COMMISSION BACCARAT (33998)", "BACCARAT SQUEEZE (33999)", "FAN TAN (34000)", "SPEED BACCARAT S (34002)", "CLASSIC SPEED BLACKJACK 6 (34004)", "BACCARAT CONTROL SQUEEZE (34005)", "SALON PRIV√Й BACCARAT E (34006)", "SPEED BACCARAT J (34007)", "CLASSIC SPEED BLACKJACK 1 (34012)", "LIGHTNING BACCARAT (34014)", "SPEED BACCARAT C (34015)", "CLASSIC SPEED BLACKJACK 3 (34019)", "SPEED BACCARAT D (34021)", "SPEED BACCARAT G (34024)", "SPEED BACCARAT P (34026)", "SPEED BACCARAT M (34028)", "NO COMMISSION SPEED BACCARAT B (34037)", "SPEED BACCARAT L (34038)", "CLASSIC SPEED BLACKJACK 2 (34042)", "SALON PRIV√Й BACCARAT C (34044)", "SPEED BACCARAT E (34046)", "SALON PRIV√Й BACCARAT D (34047)", "SPEED BACCARAT O (34049)", "NO COMMISSION SPEED BACCARAT A (34050)", "CLASSIC SPEED BLACKJACK 5 (34052)", "SUPER SIC BO (34053)", "SPEED BACCARAT N (34057)", "SPEED BACCARAT F (34058)", "SPEED BACCARAT H (34059)", "SALON PRIV√Й BACCARAT A (34064)", "BACCARAT C (34065)", "PRIV√Й LOUNGE BACCARAT 5 (34071)", "PRIV√Й LOUNGE BACCARAT 3 (34072)", "PRIV√Й LOUNGE BACCARAT 2 (34073)", "PRIV√Й LOUNGE BACCARAT 1 (34074)", "BLACKJACK 77: RUBY (34076)", "BLACKJACK 76: AZURE (34078)", "BLACKJACK 78: RUBY (34079)", "PRIV√Й LOUNGE BACCARAT 4 (34082)", "BLACKJACK 75: AZURE (34085)", "FORTUNE 6 BACCARAT (34087)", "BOOM CITY (34093)", "LUCKY 6 ROULETTE (34104)", "FIRST PERSON DRAGON TIGER (34114)", "POKER LOBBY (34135)", "TEXAS HOLDEM (34136)", "SALON PRIV√Й BACCARAT F (34137)", "ROULETTE LOBBY (34139)", "KLASIK BLACKJACK 4 (34140)", "SPEED BACCARAT V (34141)", "BLACKJACK VIP 27 (34142)", "BLACKJACK CLASICO EN ESPA√СOL 2 (34143)", "LIGHTNING BLACKJACK (34144)", "SPEED BACCARAT T (34145)", "BLACKJACK CLASICO EN ESPA√СOL 3 (34146)", "GAME SHOWS LOBBY (34147)", "SPEED VIP BLACKJACK I (34148)", "BLACKJACK CLASSIC 84 (34149)", "SPEED VIP BLACKJACK K (34150)", "BLACKJACK CLASICO EN ESPA√СOL 1 (34151)", "BLACKJACK VIP 25 (34152)", "BAC BO (34153)", "SPEED VIP BLACKJACK J (34154)", "FIRST PERSON LOBBY (34155)", "BLACKJACK VIP 26 (34157)", "CRAZY COIN FLIP (34158)", "FIRST PERSON BACCARAT (34159)", "MONOPOLY BIG BALLER (34160)", "BLACKJACK CL√БSSICO EM PORTUGU√КS 1 (34161)", "BLACKJACK CLASSIC 82 (34162)", "KLASIK BLACKJACK 3 (34163)", "BLACKJACK CLASSIC 83 (34164)", "SPEED BACCARAT W (34165)", "BLACKJACK CLASSIC 85 (34166)", "SALON PRIV√Й BLACKJACK G (34167)", "SPEED BACCARAT U (34168)", "BLACKJACK CLASSIC 86 (34170)", "KLASIK BLACKJACK (34171)", "DEAL OR NO DEAL (34172)", "BLACKJACK (34173)", "SPEED VIP BLACKJACK M (34174)", "SUPER ANDAR BAHAR (34175)", "BLACKJACK CL√БSSICO EM PORTUGU√КS 2 (34176)", "T√ЬRK√ЗE LIGHTNING RULET (34177)", "BUCHAREST INFINITE FREE BET BLACKJACK (34178)", "SPEED VIP BLACKJACK L (34179)", "SALON PRIV√Й BACCARAT G (34180)", "SPEED BACCARAT X (34181)", "TOP GAMES LOBBY (34182)", "BACCARAT LOBBY (34183)", "KLASIK BLACKJACK 2 (34184)", "XXXTREME LIGHTNING ROULETTE (34185)", "CLASSIC BLACKJACK 11 (34186)", "KOREAN DEALER SPEED BLACKJACK (34187)", "FREE BET BLACKJACK 2 (34188)", "SALON PRIV√Й BLACKJACK H (34189)", "KLASIK BLACKJACK 8 (34190)", "ITALIAN LIGHTNING ROULETTE (34191)", "CASINO HOLDEM ITALIA (34192)", "KOREAN DEALER LIGHTNING ROULETTE (34193)", "FREE BET BLACKJACK 3 (34194)", "CRAZY TIME A (34195)", "GOLDEN WEALTH BACCARAT (34196)", "KOREAN SPEED BACCARAT C (34197)", "DRAGONARA ROULETTE (34199)", "KLASIK BLACKJACK 9 (34200)", "SALON PRIV√Й BACCARAT H (34201)", "KOREAN SPEAKING SPEED BACCARAT 2 (34202)", "DEAD OR ALIVE SALOON (34203)", "SALON PRIV√Й BACCARAT J (34204)", "RULETA BOLA RAPIDA EN VIVO (34205)", "SALON PRIV√Й BLACKJACK I (34206)", "SPEED BACCARAT 3 (34207)", "KOREAN SPEED BACCARAT A (34208)", "SPEED BACCARAT Z (34209)", "SPEED BACCARAT 2 (34210)", "VIP BLACKJACK EM PORTUGU√КS (34211)", "FREE BET BLACKJACK 1 (34212)", "FREE BET BLACKJACK 5 (34213)", "DEAD OR ALIVE (34214)", "KOREAN DEALER BASEBALL STUDIO (34215)", "KLASIK BLACKJACK 5 (34216)", "ROLETA REL√ВMPAGO (34217)", "CLASSIC BLACKJACK 10 (34218)", "KLASIK SPEED BLACKJACK 1 (34219)", "VIP BLACKJACK EN ESPA√СOL (34220)", "FREE BET BLACKJACK 7 (34222)", "KLASIK BLACKJACK 12 (34223)", "KLASIK SPEED BLACKJACK 2 (34224)", "FREE BET BLACKJACK 6 (34225)", "EXTRA CHILLI EPIC SPINS (34226)", "FREE BET BLACKJACK 4 (34227)", "SALON PRIV√Й BLACKJACK J (34228)", "HINDI LIGHTNING ROULETTE (34229)", "KOREAN SPEAKING SPEED BACCARAT (34230)", "KOREAN SPEED BACCARAT B (34231)", "FREE BET BLACKJACK 1 (34232)", "SPEED BACCARAT 2 (34233)", "ROLETA AO VIVO (34234)", "DEAD OR ALIVE (34235)", "SALON PRIV√Й BACCARAT I (34236)", "VEGAS BALL BONANZA (34245)", "AUTO MEGA ROULETTE (34246)", "SPEED AUTO ROULETTE (34257)", "BLACKJACK CLASSIC 76 (34277)", "BLACKJACK CLASSIC 81 (34278)", "SPEED BLACKJACK I (34279)", "BLACKJACK VIP 18 (34280)", "SPEED BLACKJACK G (34281)", "BLACKJACK VIP 4 (34282)", "SPEED VIP BLACKJACK C (34283)", "CLASSIC SPEED BLACKJACK 25 (34284)", "BLACKJACK B (34285)", "SPEED BLACKJACK K (34286)", "BLACKJACK VIP 14 (34287)", "BLACKJACK VIP 15 (34288)", "SPEED BLACKJACK E (34289)", "SPEED BLACKJACK L (34290)", "BLACKJACK CLASSIC 77 (34291)", "BLACKJACK VIP 17 (34292)", "BLACKJACK CLASSIC 80 (34293)", "BLACKJACK VIP 19 (34294)", "BLACKJACK VIP 7 (34295)", "BLACKJACK CLASSIC 7 (34296)", "BLACKJACK VIP 8 (34297)", "CLASSIC SPEED BLACKJACK 7 (34298)", "BLACKJACK CLASSIC 75 (34299)", "BLACKJACK VIP 5 (34300)", "BLACKJACK VIP 11 (34301)", "CLASSIC SPEED BLACKJACK 20 (34302)", "BLACKJACK VIP 9 (34303)", "BLACKJACK CLASSIC 79 (34304)", "BLACKJACK CLASSIC 78 (34305)", "SPEED BLACKJACK J (34306)", "SPEED BLACKJACK H (34307)", "BLACKJACK VIP 10 (34308)", "BLACKJACK VIP 3 (34309)", "SPEED BLACKJACK D (34310)", "BLACKJACK VIP 16 (34311)", "BLACKJACK VIP 2 (34312)", "SPEED VIP BLACKJACK D (34313)", "BLACKJACK VIP 6 (34315)", "BLACKJACK VIP 12 (34316)", "SPEED VIP BLACKJACK F (34317)", "BLACKJACK C (34318)", "BLACKJACK VIP 13 (34319)", "SPEED VIP BLACKJACK G (34320)", "SPEED VIP BLACKJACK E (34321)", "SPEED BLACKJACK M (34322)", "SPEED VIP BLACKJACK B (34323)", "BLACKJACK PARTY (34324)", "BLACKJACK VIP 1 (34325)", "SPEED VIP BLACKJACK A (34326)", "SIC BO (34506)", "BLACKJACK 43: RUBY (34512)", "BLACKJACK 47: RUBY (34513)", "BLACKJACK 39: RUBY (34518)", "BLACKJACK 42: RUBY (34519)", "BLACKJACK 38: RUBY (34522)", "BLACKJACK 40: RUBY (34523)", "BLACKJACK 44: RUBY (34529)", "BLACKJACK 45: RUBY (34530)", "BLACKJACK 46: RUBY (34531)", "BLACKJACK 41: RUBY (34532)", "BLACKJACK 48: RUBY (34545)", "BLACKJACK 50: RUBY (34548)", "BLACKJACK 49: RUBY (34556)", "BLACKJACK 51: RUBY (34558)", "SPACEMAN (34588)", "INSTANT SUPER SIC BO (35068)", "VIDEO POKER (35073)", "FIRST PERSON XXXTREME LIGHTNING ROULETTE (35076)", "PUNTO BANCO (35159)", "FIRST PERSON TOP CARD (36829)", "TEEN PATTI (36830)", "FIRST PERSON VIDEO POKER (36832)", "FIRST PERSON PROSPERITY TREE BACCARAT (36834)", "FIRST PERSON DEAL OR NO DEAL (36835)", "PROSPERITY TREE BACCARAT (36837)", "PEEK BACCARAT (36840)", "FIRST PERSON LIGHTNING BLACKJACK (36841)", "STOCK MARKET (36906)", "SCRATCHY MINI (37628)", "SCRATCHY BIG (37631)", "SCRATCH! BRONZE (37632)", "SCRATCH! PLATINUM (37635)", "SCRATCH! SILVER (37636)", "KING TREASURE (37640)", "SCRATCH! GOLD (37657)", "EXPRESS 200 SCRATCH (37662)", "BLOCKS (37671)", "SCRATCHY (37673)", "QUEEN TREASURE (37677)", "LINES (37692)", "BACCARAT (37695)", "HI-LO (37874)", "PLINKO (37879)", "IT'S BANANAS! (37883)", "HAPPY SCRATCH (37885)", "LUCKY NUMBERS X8 (37892)", "CASH VAULT I (37893)", "PRINCE TREASURE (37895)", "GOLD RUSH (37896)", "LUCKY NUMBERS X20 (37897)", "LUCKY NUMBERS X12 (37898)", "LUCKY SCRATCH (37899)", "DREAM CAR SPEED (37900)", "DIAMOND RUSH (37901)", "LUCKY NUMBERS X16 (37903)", "SHAVE THE BEARD (37904)", "RUBY RUSH (37909)", "COLORS (37910)", "LUCKY SHOT (37912)", "DREAM CAR URBAN (37915)", "CUT THE GRASS (37918)", "CASH VAULT II (37919)", "DREAM CAR SUV (37921)", "TWENTY-ONE (37938)", "BOXES 97% (37939)", "BOXES 88% (37940)", "BOXES 92% (37941)", "MINES (37943)", "COINS 92% (37945)", "BOXES 96% (37947)", "BOXES 98% (37948)", "COINS 94% (37949)", "MINES 98% (37950)", "MINES 97% (37951)", "COINS 88% (37952)", "COINS  (37953)", "COINS 98% (37954)", "COINS 97% (37955)", "BOXES 94% (37956)", "RAT RICHES (37964)", "CHAOS CREW SCRATCH (37965)", "SNOW SCRATCHER (37966)", "GO PANDA (37974)", "SCRATCH'EM (37975)", "STACK'EM SCRATCH (37976)", "SPOOKY SCARY SCRATCHY (37978)", "MINES 94% (37980)", "THE PERFECT SCRATCH (37981)", "CASH POOL (37984)", "FROGS SCRATCH (37985)", "FOOTBALL SCRATCH (37986)", "CRAZY DONUTS (37989)", "KOI CASH (37990)", "EGGSTRA CASH (37991)", "BALLOONS (37992)", "DOUBLE SALARY: 1 YEAR (37993)", "SHAVE THE SHEEP (37996)", "CASH SCRATCH (37997)", "GOLD COINS (37999)", "LOVE IS ALL YOU NEED (38005)", "TIGER SCRATCH (38007)", "MINES 88% (38009)", "BREAK THE ICE (38011)", "MINES 92% (38012)", "BIG BASS CRASH (39102)", "SPACEMAN (39247)", "BLOCKS (39674)", "CASH COMPASS (39714)", "COINS (39784)", "COLORS (39833)", "TWENTY-ONE (39870)", "LINES (39920)", "PLINKO (39949)", "WHEEL (40012)", "MEGA SIC BAC (40574)"];
 
 
    function LiveInstantGames() {
        // Получаем все строки таблицы
        const rows = document.querySelectorAll('tr');
 
        // Перебираем все строки
        rows.forEach(function (row) {
            // В каждой строке ищем ячейки с нужным классом, содержащие названия игр
            const cells = row.querySelectorAll('td');
 
            cells.forEach(function (cell) {
                const span = cell.querySelector('span.main_badge__u6DKH');
                if (span) {
                    // Проверяем, содержит ли текст внутри span одно из названий игр из массива
                    if (gameNames.some(gameName => span.textContent.includes(gameName))) {
                        // Если находим совпадение, выделяем всю строку цветом
                        row.style.backgroundColor = 'rgba(255, 165, 0, 0.1)'; // Оранжевый цвет с прозрачностью
                    }
                }
            });
        });
    }
 
    function isLiveInstantGameRow(row) {
        const cells = row.querySelectorAll('td');
        return Array.from(cells).some(cell => {
            const span = cell.querySelector('span.main_badge__u6DKH');
            return span && gameNames.some(gameName => span.textContent.includes(gameName));
        });
    }
    function highlightSweetBonanza() {
        const targetGame = ["SWEET BONANZA 1000 (38973)", "GATES OF SELECTOR (56875)"];
        const rows = document.querySelectorAll('tr');
 
        rows.forEach(function (row) {
            const cells = row.querySelectorAll('td');
 
            cells.forEach(function (cell) {
                const span = cell.querySelector('span.main_badge__u6DKH');
                if (span) {
                    if (targetGame.some(gameName => span.textContent.includes(gameName))) {
                        row.style.backgroundColor = 'rgba(64, 224, 208, 0.2)'; // Бирюзовый цвет с прозрачностью
                    }
                }
            });
        });
    }
    function parseDate(dateStr) {
        const parts = dateStr.match(/(\d{2})\.(\d{2})\.(\d{4})\s+(\d{2}):(\d{2}):(\d{2})/);
        return new Date(`${parts[2]}/${parts[1]}/${parts[3]} ${parts[4]}:${parts[5]}:${parts[6]}`);
    }
 
    function highlightRecentRegDates() {
        const currentDate = new Date();
        const lastMonthDate = new Date();
        lastMonthDate.setMonth(currentDate.getMonth() - 1);
 
        const spans = document.querySelectorAll('span.awsui_root_18wu0_1n73s_93');
        const mainMenu = document.querySelector('.awsui_with-paddings_14iqq_4079j_165');
 
        spans.forEach(function (span) {
            const content = span.textContent.trim();
            if (content.startsWith("Reg date:")) {
                const dateString = content.replace("Reg date:", "").trim();
                const regDate = parseDate(dateString);
                if (regDate > lastMonthDate && regDate <= currentDate) {
                    let parent = span.closest('.awsui_child-vertical-m_18582_66aol_216');
                    if (parent) {
                        parent.style.backgroundColor = 'rgba(255, 0, 0, 1)';
                        document.getElementsByClassName("awsui_description_2qdw9_12hrg_211 awsui_description-variant-h2_2qdw9_12hrg_224")[1].innerHTML = `<div style = "font-size:18px; color:red">!!!!!!!!!РЕГИСТРАЦИЯ МЕНЬШЕ МЕСЯЦА!!!!!!!!!</div></b>`;
                        document.getElementsByClassName("awsui_root_2rhyz_einbc_93 awsui_input-container_2rhyz_einbc_220")[2].innerHTML = `<div style = "font-size:18px; color:red">!!!!!!!!!!!!!!!!!!!!!!!!!!!  РЕГИСТРАЦИЯ МЕНЬШЕ МЕСЯЦА  !!!!!!!!!!!!!!!!!!!!!!!!!!!</div></b><div style = "font-size:18px; color:red">!!!!!!!!!!!!!!!!!!!  ПРОВЕРЯТЬ НА АБУЗ БОНУСОВ  !!!!!!!!!!!!!!!!!!!</div>`;
                    }
                }
            }
        });
    }
 
    let project;
    let numberOfTOS;
    let WithdrawalLimits;
 
    function extractNumber(str) {
        const matches = str.match(/(\d{1,3}(?:\s\d{3})*(?:,\d+)?)(?=\sRUB)/);
 
        if (matches) {
            const numberString = matches[1].replace(/\s/g, '').replace(',', '.');
            return parseFloat(numberString);
        }
 
        return null;
    }
    function GetGot() {
        const SelectorDark = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iOTM0IiBoZWlnaHQ9IjM2MiIgdmlld0JveD0iMCAwIDkzNCAzNjIiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxwYXRoIGQ9Ik0yNS41NzUgMEgzMDAuN0wyMzIuNSAzNjEuMTVMMCAzMjcuODI1TDI1LjU3NSAwWiIgZmlsbD0iIzA0N0NGQyIvPgo8cGF0aCBkPSJNODMuMjM0OSAx';
        const SelectorLight = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI5MzQiIGhlaWdodD0iMzYyIiB2aWV3Qm94PSIwIDAgOTM0IDM2MiIgZmlsbD0ibm9uZSI+CjxwYXRoIGQ9Ik0yNS41NzUgMEgzMDAuN0wyMzIuNSAzNjEuMTVMMCAzMjcuODI1TDI1LjU3NSAwWiIgZmlsbD0iIzA0N0NGQyIvPgo8cGF0aCBkPSJNODMuMjM0OSAxOTguOTcyQzk1LjMyNDkgMjAyLjM4MiAxMDguNzMyIDIwNC4wODcg';
        const Bounty = 'data:image/svg+xml;base64,PHN2ZyBpZD0ic3ZnIiB2ZXJzaW9uPSIxLjEiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2Zy';
        const FriendsDark = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAABoMAAAKUCAYAAADPZEEvAAAACXBIWXMAAC4jAAAuIwF4pT92AADPFUlEQVR4nOzdeXxeVYH/8W9yc5Oma7qX7rSlLQWkgFCgtFBnUNz1joILKqKOqDjuPwEdQMV9d2YcHVdcRnHG676PhqYt0LJvhUKBsrQUWujetDk5';
        const FriendsLight = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAABoMAAAKUCAYAAADPZEEvAAAACXBIWXMAAC4jAAAuIwF4pT92AAAGOWlUWHRYTUw6Y29tLmFkb2JlLnhtcAAAAAAAPD94cGFja2V0IGJlZ2luPSLvu78iIGlkPSJXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQiPz4gPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iQWRvYmU';
        const TurboDark = 'data:image/svg+xml;base64,PHN2ZyBpZD0iTGF5ZXJfMSIgZGF0YS1uYW1lPSJMYXllciAxIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiB2aWV3Qm94PSIwIDAgNTQwLjQ1IDEyMC4zIj48ZGVmcz48c3R5bGU+LmNscy0xe2ZpbGw6bm9uZTt9LmNscy0ye2NsaXAtcGF0aDp1cmwoI2NsaXAtcGF0aCk7fS5jbHMtM3tmaWxs';
        const TurboLight = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiBpZD0iTGF5ZXJfMSIgZGF0YS1uYW1lPSJMYXllciAxIiB2aWV3Qm94PSIwIDAgNTQwLjQ1IDEyMC4zIj48ZGVmcz48c3R5bGU+LmNscy0xe2ZpbGw6bm9uZTt9LmNscy0ye2NsaXAtcGF0aDp1cmwoI2NsaXAtcGF0aCk7fS5jbHMtM3tmaWxsOiMyNzJkM2E7fS5jbHMtMywuY2xzLTV7ZmlsbC1ydWxlOmV2ZW5vZGQ';
        const BrillxDark = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI3ODQiIGhlaWdodD0iMjM3IiB2aWV3Qm94PSIwIDAgNzg0IDIzNyIgZmlsbD0ibm9uZSI+CjxwYXRoIGQ9Ik00NzcuNjY5IDIyOS43MDhDNDc1LjM4NCAyMjkuNzA4IDQ3My41MTUgMjI4Ljk3OCA0NzIuMDYyIDIyNy41MkM0NzAuNjA4IDIyNi4wNjIgNDY5Ljg4MSAyMjQuMTg2IDQ2OS44ODEgMjIxLjg5NVYxOC4yMzA4QzQ2O';
        const BrillxLight = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI3ODQiIGhlaWdodD0iMjM3IiB2aWV3Qm94PSIwIDAgNzg0IDIzNyIgZmlsbD0ibm9uZSI+CjxwYXRoIGQ9Ik00NzcuNjY5IDIyOS43MDhDNDc1LjM4NCAyMjkuNzA4IDQ3My41MTUgMjI4Ljk3OCA0NzIuMDYyIDIyNy41MkM0NzAuNjA4IDIyNi4wNjIgNDY5Ljg4MSAyMjQuMTg2IDQ2OS44ODEgMjIxLjg5NVYxOC4yMzA4QzQ2OS44ODEgMTUuOTM4OSA0NzAuNjA4IDE0LjA2MzggNDc';
 
        // Получаем все img элементы
        const img = document.querySelectorAll('img');
        const divsWithImages = document.querySelectorAll('.awsui_actions_2qdw9_12hrg_162');
 
        // Перебираем все img элементы и проверяем их src атрибут
        divsWithImages.forEach(div => {
            const img = div.querySelector('img'); // Находим img внутри div
            if (img && img.src) {
                if (img.src.startsWith(SelectorDark) || img.src.startsWith(SelectorLight)) {
                    project = "selector";
                } else if (img.src.startsWith(BrillxDark) || img.src.startsWith(BrillxLight)) {
                    project = "brillx";
                } else if (img.src.startsWith(Bounty)) {
                    project = "bounty";
                } else if (img.src.startsWith(FriendsDark) || img.src.startsWith(FriendsLight)) {
                    project = "friends";
                } else if (img.src.startsWith(TurboDark) || img.src.startsWith(TurboLight)) {
                    project = "turbo";
                } else {
                    project = "else";
                }
            }
        });
    }
 
    function formatNumber(number) {
        let [integer, fraction] = number.toString().split('.');
 
        integer = integer.replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1 ');
 
        return fraction ? `${integer}.${fraction.slice(0, 2)}` : integer;
    }
 
    function getWithdrawalLimits(depositAmount) {
        if (project == "bounty" || project == "friends" || project == "else" || project == "selector" || project == "brillx" || project == "turbo") {
            if (depositAmount <= 5000) {
                numberOfTOS = "5.13.1";
                WithdrawalLimits = { day: 10000, week: 25000, month: 50000 };
            } else if (depositAmount <= 10000) {
                numberOfTOS = "5.13.2";
                WithdrawalLimits = { day: 35000, week: 60000, month: 100000 };
            } else if (depositAmount <= 25000) {
                numberOfTOS = "5.13.3";
                WithdrawalLimits = { day: 90000, week: 180000, month: 300000 };
            } else if (depositAmount <= 50000) {
                numberOfTOS = "5.13.4";
                WithdrawalLimits = { day: 150000, week: 300000, month: 500000 };
            } else if (depositAmount <= 100000) {
                numberOfTOS = "5.13.5";
                WithdrawalLimits = { day: 300000, week: 600000, month: 1000000 };
            } else if (depositAmount <= 250000) {
                numberOfTOS = "5.13.6";
                WithdrawalLimits = { day: 600000, week: 1200000, month: 2000000 };
            } else if (depositAmount <= 500000) {
                numberOfTOS = "5.13.7";
                WithdrawalLimits = { day: 1500000, week: 3000000, month: 5000000 };
            } else if (depositAmount <= 1000000) {
                numberOfTOS = "5.13.8";
                WithdrawalLimits = { day: 3000000, week: 6000000, month: 10000000 };
            } else {
                numberOfTOS = "5.13.9";
                WithdrawalLimits = { day: "Индивидуально", week: "Индивидуально", month: "Индивидуально" };
            };
        }
    }
    function checkTransactions() {
        GetGot();
        const transactionElements = document.querySelectorAll('div.main_item__qFGmJ');
 
        let transactions = {};
        transactionElements.forEach(el => {
            const textContent = el.textContent;
            if (textContent.includes('Лимит за')) {
            } else {
                if (textContent.includes('Deposits last 30 days')) {
                    transactions.deposits30Days = extractNumber(textContent);
                } else if (textContent.includes('Withdrawals last 30 days')) {
                    transactions.withdrawals30Days = extractNumber(textContent);
                } else if (textContent.includes('Deposits last 7 days')) {
                    transactions.deposits7Days = extractNumber(textContent);
                } else if (textContent.includes('Withdrawals last 7 days')) {
                    transactions.withdrawals7Days = extractNumber(textContent);
                } else if (textContent.includes('Deposits last 24 hours')) {
                    transactions.deposits24Hours = extractNumber(textContent);
                } else if (textContent.includes('Withdrawals last 24 hours')) {
                    transactions.withdrawals24Hours = extractNumber(textContent);
                }
            }
        });
 
        const limits = getWithdrawalLimits(transactions.deposits30Days);
        let remainingLimits;
        if (numberOfTOS == "5.13.9") {
            remainingLimits = {
                month: transactions.deposits30Days * 7.5,
                week: (transactions.deposits30Days * 7.5) / 2,
                day: (transactions.deposits30Days * 7.5) / 4
            };
        } else {
            remainingLimits = {
                day: Math.max(0, WithdrawalLimits.day - transactions.withdrawals24Hours),
                week: Math.max(0, WithdrawalLimits.week - transactions.withdrawals7Days),
                month: Math.max(0, WithdrawalLimits.month - transactions.withdrawals30Days)
            };
        }
 
        const spanElements = document.querySelectorAll('span.awsui_root_18wu0_1n73s_93');
        remainingLimits.month = parseFloat(remainingLimits.month);
        remainingLimits.week = parseFloat(remainingLimits.week);
        remainingLimits.day = parseFloat(remainingLimits.day);
        spanElements.forEach(span => {
            if (span.textContent.includes('Withdrawals last 30 days')) {
                if (span.innerHTML.includes('Лимит за 30 дней')) {
 
                } else {
                    span.innerHTML = `<b>Withdrawals last 30 days: Лимит за 30 дней - <div style="color:red">${formatNumber(remainingLimits.month)} RUB.</div>или Правило ${numberOfTOS}_month</b>`;
                    if (remainingLimits.month <= 0) {
                        span.innerHTML = `<b>Withdrawals last 30 days: Лимит за 30 дней - <div style="color:red">${formatNumber(remainingLimits.month)} RUB.</div>ОГРАНИЧЕНИЕ<div style = "font-size:30px; color:red">${numberOfTOS}_month</div></b>`;
                    }
                }
 
            } else if (span.textContent.includes('Withdrawals last 7 days')) {
                if (span.innerHTML.includes('Лимит за 7 дней')) {
 
                } else {
                    span.innerHTML = `<b>Withdrawals last 7 days: Лимит за 7 дней - <div style="color:red">${formatNumber(remainingLimits.week)} RUB.</div>или Правило ${numberOfTOS}_week</b>`;
                }
                if (remainingLimits.week <= 0) {
                    span.innerHTML = `<b>Withdrawals last 7 days: Лимит за 7 дней - <div style="color:red">${formatNumber(remainingLimits.week)} RUB.</div>ОГРАНИЧЕНИЕ<div style = "font-size:30px; color:red">${numberOfTOS}_week</div></b>`;
                }
            } else if (span.textContent.includes('Withdrawals last 24 hours')) {
                if (span.innerHTML.includes('Лимит за 24 часа')) {
 
                } else {
                    span.innerHTML = `<b>Withdrawals last 24 hours: Лимит за 24 часа - <div style="color:red">${formatNumber(remainingLimits.day)} RUB.</div>или Правило ${numberOfTOS}_day</b>`;
                }
                if (remainingLimits.day <= 0) {
                    span.innerHTML = `<b>Withdrawals last 24 hours: Лимит за 24 часа - <div style="color:red">${formatNumber(remainingLimits.day)} RUB.</div>ОГРАНИЧЕНИЕ<div style = "font-size:30px; color:red">${numberOfTOS}_day</div></b>`;
                }
            }
        });
    }
 
    window.addEventListener('load', highlightRowsWithfk);
    window.addEventListener('load', highlightRowsWithCard);
    window.addEventListener('load', highlightLargeAmounts);
    window.addEventListener('load', LiveInstantGames);
    window.addEventListener('load', highlightRecentRegDates);
    window.addEventListener('load', highlightAmountsBefore6000);
    window.addEventListener('load', showkeywords);
    window.addEventListener('load', highlightSweetBonanza);
 
    setInterval(highlightRowsWithfk, 5000);
    setInterval(highlightRowsWithCard, 3000);
    setInterval(highlightLargeAmounts, 5000);
    setInterval(checkTransactions, 3000);
    setInterval(highlightAmountsBefore6000, 1000);
    setInterval(LiveInstantGames, 1000);
    setInterval(highlightRecentRegDates, 1000);
    setInterval(showkeywords, 1000);
    setInterval(highlightSweetBonanza, 1000);
})();