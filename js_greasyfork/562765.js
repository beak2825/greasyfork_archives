// ==UserScript==
// @name         XPanel Helper
// @namespace    http://tampermonkey.net/
// @version      1.6.1
// @description  Помощник в выплатах
// @author       Dmitry Volkov - DevOps
// @match        http://xpanel.me/*
// @match        https://xpanel.me/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/562765/XPanel%20Helper.user.js
// @updateURL https://update.greasyfork.org/scripts/562765/XPanel%20Helper.meta.js
// ==/UserScript==

(function () {
    'use strict';

    function highlightRowsWithfk() {
        const rows = document.querySelectorAll('tr');
        const values = [
            9623, 47360, 3328, 1954, 155254, 10020, 182093, 1588392, 24789, 11706, 811, 5327, 23054, 5505, 81230, 16851, 9229, 52388, 6362, 252443, 1158, 15516, 6000, 91989, 11241, 1172, 1894, 664, 10974, 48311, 52981, 290874, 383581, 313349, 42955, 291746, 320296, 446642, 194874, 715150, 21339, 935675, 66764, 540798, 398324, 459442, 62329, 1906120, 717536, 262402, 1061520, 624156, 1831962, 434987, 309878, 316760, 1905375, 472948, 398924, 104969, 433372, 82703, 2145, 4040, 1712302, 25622, 1577547, 49576, 1998348, 10517, 490495, 1555598, 397534, 1141729, 1964994, 121333, 847917, 224633, 8996, 5461, 87463, 1999544, 1159, 1125, 733790, 531, 1942, 3033, 18292, 697, 1785, 494, 251, 905405, 9299, 3038, 120464, 1846, 833356, 18465, 33347, 13949, 31789, 43013, 64841, 5050, 1133, 134504, 22863, 29397, 107342, 625510, 15830, 29231, 780, 4801, 196273, 12556, 63025, 56294, 28885, 310363, 264024, 414069, 61942, 15386, 9672, 50, 16704, 1319, 11504, 313124, 234334, 4270, 1060620, 16236, 967, 798, 237839, 15944, 59203, 18460, 1205, 156730, 41085, 252, 1076, 16329, 1501907, 115108, 1077, 16701, 291413, 2734, 11122, 12253, 16577, 9725, 893099, 15860, 87768, 1094143, 829, 8077, 89425, 35697, 1671072, 7581, 15339, 1416336, 1620633, 8463, 56527, 35628, 39552, 20870, 7781, 63456, 1848802, 23049, 242834, 2048, 1584697, 48240, 30387, 291563, 1613153, 26007, 31546, 4406, 1179, 79401, 82, 13907, 22086, 16721, 892, 927380, 16479, 12749, 70516, 141651, 28403, 143683, 40686, 18103, 62131, 11795, 37238, 71546, 313661, 53974, 375285, 53615, 330529, 2719, 3932, 6251, 30911, 36780, 92979, 29567, 195305, 8942, 1483, 120234, 29233, 1110962, 452, 115291, 206301, 25627, 211236, 822993, 6396, 59676, 38465, 9494, 397066, 31086, 121296, 790, 33686, 211268, 60444, 291603, 1741692, 297999, 155582, 251259, 110009, 486279, 402953, 37690, 1587783, 255448, 20591, 2410, 6426, 28440, 6718, 25701, 1324464, 33371, 8572, 13309, 5702, 498725, 177279, 1405970, 56751, 456328, 17474, 92516, 18239, 13945, 1065771, 255264, 26442, 77873, 90247, 392099, 36610, 301290, 15214, 509, 332821, 818, 8845, 103824, 413924, 617632, 431527, 78242, 47455, 8940, 1633035, 1835944, 1557839, 1989399, 2179056, 2000992, 357049, 523119, 595290, 134086, 248427, 483246, 155437, 20162, 142936, 241579, 235753, 1796956, 111518, 17895, 131190, 4305, 350004, 155897, 480545, 389015, 24750, 151104, 64229, 298151, 155623, 30195, 5816, 4388, 429509, 2816, 95567, 2224273, 368279, 2064501, 2335487, 16731, 163846, 2033098, 13611, 16151, 2209072, 442612, 1492035, 776406, 252139, 117561, 6333, 419690, 425594, 399845, 1672492, 2084529, 1603672, 1918730, 1508381, 6940, 14375, 400249, 108160, 163672, 735085, 2516687, 348506, 897424, 208442, 2497880, 128879, 288074, 305569, 387612, 140701, 396, 342598, 2556, 4150, 261, 5847, 7487, 5802, 9810, 5888, 4032, 595, 3965, 119, 4654, 14033, 2484399, 14550, 5583, 12271, 5837, 2755, 6951, 4748, 2325390, 4457, 8361, 12361, 740589, 12480, 571631, 20492, 5799, 4809, 83385, 856950, 759032, 30299, 428141, 478170, 28093, 473516, 641665, 2191752, 179093, 40762, 2224408, 1796910, 2530995, 475054, 491598, 328003, 3, 33536, 483697, 40741, 856034, 10609, 2176744, 5327, 1393666, 503737, 1076, 2164, 4270, 5068, 678, 2205, 779, 2217333, 303160, 9665, 38287, 43499, 2614457, 2003887, 242760, 329238, 6380, 284616, 4113, 6238, 295885, 72514, 8134, 1624846, 53581, 113040, 2467626, 2582240, 561124, 448463, 795814, 599, 2025908, 398744, 501168, 2614147, 1481510, 1697177, 1360471, 82144, 2162020, 750076, 33832, 15740, 116, 2555356, 429902, 289524, 1430574, 1017640, 2302617, 240071, 6086, 531, 2571197, 1039539, 2539951, 461849, 71275, 2235273, 43528, 12408, 2029927, 2051845, 123705, 219747, 395313, 29958, 53774, 773, 122442, 344, 1136076, 826491, 1331401, 2455607, 12568, 58683, 1937092, 50769, 2315969, 987475, 190625, 435947, 32587, 372955, 815051, 1091, 2358687, 295664, 2607218, 273993, 542749, 359948, 972425, 1596770, 390852, 432459, 1134654, 2020291, 573239, 485716, 75651, 459516, 570764, 268280, 127746, 11808, 78522, 1894416, 432665, 2617405, 1817, 442252, 580732, 374824, 81031, 1126566, 999960, 499486, 417144, 2072096, 36280, 538764, 398400, 741704, 84537, 118247, 878940, 324198, 106871, 982940, 15694, 2645887, 39512, 6976, 2874654, 2874380, 2870339, 848840, 8475, 490298, 354081, 74362, 47310, 36246, 734438, 486974, 951380, 3543, 2469985, 571933, 739688, 875234, 2162807, 183653, 6173, 44069, 501082, 1328622, 5086, 203029, 506619, 164746, 72456, 1571994, 2042, 1325, 808422, 61630, 767845, 596607, 224598, 265362, 227240, 452534, 1075247, 41561, 1486821, 917805, 32530, 12660, 136701, 443749, 465496, 39180, 2699991, 2327722, 912, 456189, 56359, 830867, 436877, 2459506, 3635, 2060066, 375245, 825490, 2361845, 320416, 29597, 2913742, 2603884, 678279, 1718276, 479550, 19063, 415561, 32749, 892, 2628134, 2298784, 4021, 5852, 473493, 205780, 2922203, 2710591, 2921778, 553775, 86196, 729701, 991404, 523061, 2620909, 1043828, 2475959, 37662, 17573, 124618, 451797, 547516, 1093392, 614627, 1121991, 486269, 460145, 117720, 270401, 489, 271081, 516981, 2512785, 411755, 440084, 761854, 322998, 452216, 14646, 434355, 1003566, 472261, 227603, 2165081, 16200, 794241, 854944, 361883, 2002761, 52603, 336202, 289524, 480600, 116491, 631101, 762389, 2927777, 486439, 1903571, 536256, 479868, 420264, 866864, 39515, 132555, 848306, 56919, 2794, 470840, 369600, 9508, 890338, 2176976, 41261, 20664, 69215, 138498, 2352001, 302340, 148944, 175182, 51180, 310862, 633519, 736257, 1896, 1126121, 1659608, 143959, 333097, 1477510, 2267495, 2922527, 414291, 385000, 2841131, 641376, 2493174, 266216, 2650704, 81307, 475410, 2213836, 18738, 581326, 540198, 5038, 267793, 1068563, 2821522, 635165, 15177, 2883932, 274586, 287350, 1859786, 515799, 96760, 1077909, 912674, 1117, 2536, 1090231, 161071, 529307, 112655, 888073, 2612, 57973, 1137960, 1943042, 540935, 405110, 57775, 1885258, 107303, 13244, 401134, 2718, 18571, 204294, 30435, 489863, 1462785, 480024, 420986, 309541, 753198, 92632, 475517, 186744, 2212209, 645339, 770436, 8874, 31069, 132056, 1107939, 489221, 583275, 319962, 602616, 14972, 1573755, 546814, 23264, 13866, 91401, 2272098, 2874467, 1878343, 13463, 414025, 167170, 478872, 676554, 56298, 632758, 1141729, 23051, 2525209, 146644, 640787, 126471
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

            // Пропускаем строку, если это InstantWin игра
            if (isInstantWinGame(prevRow)) {
                continue;
            }

            // Берем только 3-ю колонку (индекс 2) - там данные о балансе
            const cells = prevRow.querySelectorAll('td');
            if (cells.length > 2) {
                const balanceCell = cells[2];
                const span = balanceCell.querySelector('span');
                if (span) {
                    const textContent = span.textContent;
                    const extracted = extractWagerAndMore1RUB(textContent);

                    if (extracted.wager !== null && !isNaN(extracted.wager)) {
                        sum += extracted.wager;
                    }
                }
            }
        }
        return sum;
    }

    function calculateTotalSumAboveRow(currentRow) {
        let sum = 0;
        let previousRows = Array.from(currentRow.parentElement.children);
        let currentRowIndex = previousRows.indexOf(currentRow);

        for (let i = 0; i < currentRowIndex; i++) {
            let prevRow = previousRows[i];

            // Берем только 3-ю колонку (индекс 2) - там данные о балансе
            const cells = prevRow.querySelectorAll('td');
            if (cells.length > 2) {
                const balanceCell = cells[2];
                const span = balanceCell.querySelector('span');
                if (span) {
                    const textContent = span.textContent;
                    const extracted = extractWagerAndMore1RUB(textContent);

                    if (extracted.wager !== null && !isNaN(extracted.wager)) {
                        sum += extracted.wager;
                    }
                }
            }
        }
        return sum;
    }
    function calculateMore1RUBSumAboveRow(currentRow) {
        let sum = 0;
        let previousRows = Array.from(currentRow.parentElement.children);
        let currentRowIndex = previousRows.indexOf(currentRow);

        for (let i = 0; i < currentRowIndex; i++) {
            let prevRow = previousRows[i];

            // Пропускаем строку, если это InstantWin игра
            if (isInstantWinGame(prevRow)) {
                continue;
            }

            const spans = prevRow.querySelectorAll('span');
            spans.forEach(span => {
                const textContent = span.textContent;
                const extracted = extractWagerAndMore1RUB(textContent);

                // Берем значение из ВТОРЫХ скобок
                if (extracted.more1RUB !== null && !isNaN(extracted.more1RUB)) {
                    sum += extracted.more1RUB;
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
        const buttons = document.querySelectorAll('span.main_badge__u6DKH.main_tab__8EKqV.main_cyan__Iedd2.awsui_badge_1yjyg_1kk9m_93.awsui_badge-color-grey_1yjyg_1kk9m_113');

        buttons.forEach(button => {
            if (!button.textContent.includes("PROMO CODE")) return;

            let currentRow = button.closest('tr');
            let sum = calculateSumAboveRow(currentRow); // Сумма первых скобок
            let more1RUBSum = calculateMore1RUBSumAboveRow(currentRow); // Сумма вторых скобок

            const depositCell = currentRow.querySelectorAll('td')[2];
            const depositText = depositCell ? cleanText(depositCell.textContent) : '';
            const depositMatch = depositText.match(/([\d.]+)RUB\./);

            let depositValue = 1;
            if (depositMatch) {
                depositValue = parseFloat(depositMatch[1]);
            }

            const multiplier = sum / depositValue; // X из первых скобок
            const more1RUBX = more1RUBSum / depositValue; // X из вторых скобок

            const innerOperations = currentRow.querySelector('.awsui_content_gwq0h_f8qtu_97');
            let innerOperationsNumber = 0;
            if (innerOperations) {
                const match = innerOperations.textContent.match(/Inner operations:\s*(\d+)/);
                if (match) {
                    innerOperationsNumber = parseInt(match[1], 10);
                }
            }

            if (innerOperationsNumber > 5) {
                button.textContent = `PROMO CODE (X: ${multiplier.toFixed(2)}, More1RUB: ${more1RUBX.toFixed(2)}) and COUNT: ${innerOperationsNumber}`;
            } else {
                button.textContent = `PROMO CODE (X: ${multiplier.toFixed(2)}, More1RUB: ${more1RUBX.toFixed(2)})`;
            }
        });
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






    function isInstantWinGame(row) {
        const badges = row.querySelectorAll('span.main_badge__u6DKH');

        for (const badge of badges) {
            const text = badge.textContent;
            // Ищем паттерн типа "GAME NAME (12345) (1,2,3)"
            const match = text.match(/\([^\)]+\)\s*\(([\d,\s]+)\)/);

            if (match) {
                const numbers = match[1].split(',').map(n => parseInt(n.trim()));
                // Проверяем, есть ли 2, 3, 4 или 8
                if (numbers.some(n => n === 2 || n === 3 || n === 4 || n === 8)) {
                    return true;
                }
            }
        }

        return false;
    }
    function extractWagerAndMore1RUB(textContent) {
        const cleanedText = cleanText(textContent);

        // Ищем все значения в скобках с RUB
        const matches = [...cleanedText.matchAll(/\(([\d.\s]+)RUB\.\)/g)];
        const values = matches.map(match => parseFloat(match[1].replace(/\s/g, '')));

        return {
            wager: values.length > 0 ? values[0] : null,  // Первые скобки - для вейджера
            more1RUB: values.length > 1 ? values[1] : null  // Вторые скобки - для More1RUB
        };
    }
    function highlightSweetBonanza() {
        const targetGame = ["SWEET BONANZA 1000 (38973)", "GATES OF SELECTOR (56875)", "GATES OF OLYMPUS (39189)"];
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
    function highlightInstantWinGames() {
        const rows = document.querySelectorAll('tr');

        rows.forEach(function (row) {
            if (isInstantWinGame(row)) {
                row.style.backgroundColor = 'rgba(255, 165, 0, 0.1)'; // Оранжевый цвет с прозрачностью
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

    window.addEventListener('load', highlightRecentRegDates);
    window.addEventListener('load', highlightAmountsBefore6000);
    window.addEventListener('load', showkeywords);
    window.addEventListener('load', highlightSweetBonanza);
    window.addEventListener('load', highlightInstantWinGames);
    setInterval(highlightInstantWinGames, 1000);

    setInterval(highlightRowsWithfk, 5000);
    setInterval(highlightRowsWithCard, 3000);
    setInterval(highlightLargeAmounts, 5000);
    setInterval(checkTransactions, 3000);
    setInterval(highlightAmountsBefore6000, 1000);
    setInterval(highlightRecentRegDates, 1000);
    setInterval(showkeywords, 1000);
    setInterval(highlightSweetBonanza, 1000);
})();