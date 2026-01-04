// ==UserScript==
// @name        GGN Torrents Gold
// @namespace   gazellegames
// @description 为种子详情页和历史页计算金币和GTBh值
// @include     https://gazellegames.net/torrents.php*
// @version     2.0
// @grant       none
// @license     MIT
// @downloadURL https://update.greasyfork.org/scripts/551505/GGN%20Torrents%20Gold.user.js
// @updateURL https://update.greasyfork.org/scripts/551505/GGN%20Torrents%20Gold.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 检查当前页面类型并执行相应的功能
    const torrentTable = document.querySelector('.torrent_table');
    const historyTable = document.getElementById('torrent_history_table');

    if (torrentTable) {
        // 处理种子详情页（torrent_table）
        handleTorrentTable();
    }

    if (historyTable) {
        // 处理种子历史页（torrent_history_table）
        handleHistoryTable();
    }

    // 处理种子详情页的功能
    function handleTorrentTable() {
        console.log('处理种子详情页...');

        // 首先在表格头部添加GTBh列
        var headerRow = torrentTable.querySelector('tr.colhead_dark');
        if (headerRow) {
            var GTBhHeader = document.createElement('td');
            GTBhHeader.innerHTML = '<strong>GTBh</strong>';
            GTBhHeader.className = 'sign';
            headerRow.appendChild(GTBhHeader);
        }

        var games = document.getElementsByClassName('group_torrent');

        for(var i = 0; i < games.length; i++){
            try{
                // 跳过edition_info行（这些是分组标题行）
                if (games[i].classList.contains('group_torrent') && games[i].querySelector('.edition_info')) {
                    // 为分组标题行也添加空的GTBh列
                    var editionCell = games[i].querySelector('.edition_info');
                    if (editionCell) {
                        editionCell.setAttribute('colspan', '7'); // 更新colspan为7
                    }
                    continue;
                }

                // 只处理真正的torrent数据行
                if (!games[i].id || !games[i].id.startsWith('torrent')) {
                    continue;
                }

                var childTd = games[i].getElementsByTagName('td')[2];
                var gameSize = childTd.innerHTML;

                // 获取seeder数量（第5列，索引为4）
                var seederTd = games[i].getElementsByTagName('td')[4];
                var seederCount = parseInt(seederTd.innerHTML);

                gameSize = toTeraByte(gameSize);

                // 计算GTBh值
                var GTBhDisplayValue = '-';
                var goldGeneration = null;

                try {
                    goldGeneration = games[i].nextElementSibling.firstElementChild.firstElementChild.getElementsByTagName('span')[1];

                    // 数值验证：确保 goldGeneration 和 gameSize 都是有效数字
                    // 处理包含逗号的数字格式（如 1,069.24）
                    var goldString = goldGeneration.innerHTML.replace(/,/g, '');
                    var goldValue = parseFloat(goldString);
                    var sizeValue = parseFloat(gameSize);

                    // 检查是否为有效数字且 gameSize 不为 0
                    if (!isNaN(goldValue) && !isNaN(sizeValue) && sizeValue > 0) {
                        var goldPerTBh = Math.round(goldValue / sizeValue);

                        // 计算GTBh值：goldPerTBh/seeder数
                        if (!isNaN(seederCount) && seederCount > 0) {
                            var GTBh = (goldPerTBh / seederCount).toFixed(2);
                            GTBhDisplayValue = GTBh;

                            // 更新goldGeneration显示
                            goldGeneration.innerHTML = goldPerTBh + ' Gold/TBh | ' + GTBh + ' GTBh  <br>  ' + goldGeneration.innerHTML;
                        }
                    }
                } catch(err) {
                    console.log('获取goldGeneration时出错: ' + err.message);
                }

                // 在当前行添加GTBh列
                var GTBhCell = document.createElement('td');
                GTBhCell.innerHTML = GTBhDisplayValue;
                GTBhCell.className = 'nobr';
                games[i].appendChild(GTBhCell);

            }
            catch(err){
                console.log('处理torrent行时出错: ' + err.message);
            }
        }
    }

    // 处理种子历史页的功能
    function handleHistoryTable() {
        console.log('处理种子历史页...');

        // 解析大小字符串并转换为TB
        function parseSize(sizeStr) {
            if (!sizeStr || sizeStr === '--') return 0;

            const match = sizeStr.match(/^([\d.,]+)\s*([KMGT]?B)$/i);
            if (!match) return 0;

            const value = parseFloat(match[1].replace(/,/g, ''));
            const unit = match[2].toUpperCase();

            switch(unit) {
                case 'B':   return value / (1024 * 1024 * 1024 * 1024); // B to TB
                case 'KB':  return value / (1024 * 1024 * 1024); // KB to TB
                case 'MB':  return value / (1024 * 1024); // MB to TB
                case 'GB':  return value / 1024; // GB to TB
                case 'TB':  return value; // TB to TB
                default:    return 0;
            }
        }

        // 解析Gold值
        function parseGold(goldCell) {
            // Gold列的结构: <span title="数值">显示值</span> <img> / <span title="...">Hour</span>
            // 我们需要第一个span元素，它包含每小时的Gold值
            const goldSpan = goldCell.querySelector('span[title]:first-of-type');
            if (!goldSpan) return 0;

            const goldValue = parseFloat(goldSpan.getAttribute('title'));
            return isNaN(goldValue) ? 0 : goldValue;
        }

        // 计算GTBh值
        function calculateGTBh(sizeInTB, goldPerHour) {
            if (sizeInTB === 0) return 0;
            return goldPerHour / sizeInTB;
        }

        // 格式化GTBh值显示
        function formatGTBh(GTBh) {
            if (GTBh === 0 || !isFinite(GTBh)) return '0';
            return Math.round(GTBh).toString();
        }

        // 添加表头
        const headerRow = historyTable.querySelector('tr.colhead');
        if (headerRow) {
            const GTBhHeader = document.createElement('td');
            GTBhHeader.innerHTML = '<a href="#" title="Gold per TB per Hour">GTBh</a>';
            GTBhHeader.style.textAlign = 'center';
            GTBhHeader.style.fontWeight = 'bold';

            // 在Gold列后面插入GTBh列
            const goldHeader = headerRow.cells[10]; // Gold列（修正索引）
            if (goldHeader) {
                headerRow.insertBefore(GTBhHeader, goldHeader.nextSibling);
            }
        }

        // 为每一行数据添加GTBh列
        const dataRows = historyTable.querySelectorAll('tr:not(.colhead)');

        dataRows.forEach((row, index) => {
            const cells = row.cells;
            if (cells.length < 11) return; // 确保行有足够的列（包括Gold列）

            const sizeCell = cells[3]; // Size列
            const goldCell = cells[10]; // Gold列（修正索引）

            // 调试：输出前几行的列信息
            if (index < 3) {
                console.log(`Row ${index}: ${cells.length} cells`);
                for (let i = 0; i < cells.length; i++) {
                    console.log(`  Cell ${i}: ${cells[i].textContent.trim().substring(0, 50)}`);
                }
            }

            if (!sizeCell || !goldCell) return;

            // 解析数据
            const sizeStr = sizeCell.textContent.trim();
            const sizeInTB = parseSize(sizeStr);
            const goldPerHour = parseGold(goldCell);

            // 调试信息（可以在浏览器控制台查看）
            if (sizeInTB > 0 || goldPerHour > 0) {
                console.log(`Size: ${sizeStr} -> ${sizeInTB} TB, Gold: ${goldPerHour}/hour`);
            }

            // 计算GTBh
            const GTBh = calculateGTBh(sizeInTB, goldPerHour);

            // 创建GTBh单元格
            const GTBhCell = document.createElement('td');
            GTBhCell.className = 'nobr';
            GTBhCell.style.textAlign = 'center';
            GTBhCell.style.fontSize = '11px';

            // 设置颜色根据GTBh值
            let colorClass = '';
            if (GTBh > 100) {
                colorClass = 'r99'; // 很高的值用绿色
            } else if (GTBh > 80) {
                colorClass = 'r10'; // 高值用浅绿色
            } else if (GTBh > 1) {
                colorClass = 'r05'; // 中等值用黄色
            } else {
                colorClass = 'r00'; // 低值用红色
            }

            GTBhCell.innerHTML = `<span class="${colorClass}" title="每TB每小时Gold值: ${formatGTBh(GTBh)}">${formatGTBh(GTBh)}</span>`;

            // 在Gold列后面插入GTBh列
            const goldCellElement = cells[10];
            if (goldCellElement) {
                row.insertBefore(GTBhCell, goldCellElement.nextSibling);
            }
        });
    }

    // 通用工具函数：将大小转换为TB（用于torrent_table）
    function toTeraByte(str){
        try {
            var re = /(.*?)\s(.*)/;
            var match = str.match(re);

            // 检查正则匹配是否成功
            if (!match || match.length < 3) {
                console.log('无法解析大小字符串: ' + str);
                return NaN;
            }

            var size = match[2];
            // 处理包含逗号的数字格式
            var numberString = match[1].replace(/,/g, '');
            var number = parseFloat(numberString);

            // 检查数字是否有效
            if (isNaN(number)) {
                console.log('无效的数字: ' + match[1]);
                return NaN;
            }

            switch(size) {
            case 'KB':
                number = number / 1073741824 ;
                break;
            case 'MB':
                number = number / 1048576 ;
                break;
            case 'GB':
                number = number / 1024 ;
                break;
            case 'TB':
                // TB 情况下不需要转换
                number = number;
                break;
            default:
                // 假设默认单位是 TB
                number = number;
            }

            return number;
        } catch (err) {
            console.log('toTeraByte 函数错误: ' + err.message);
            return NaN;
        }
    }

    console.log('GGN 种子页面计算金币已加载完成');

})();
