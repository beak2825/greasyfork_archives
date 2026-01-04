// ==UserScript==
// @name         人人种子认领筛选
// @icon      data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI2NCIgaGVpZ2h0PSI2NCIgdmlld0JveD0iMCAwIDY0IDY0Ij48cGF0aCBmaWxsPSIjYjU4MzYwIiBkPSJNNDQuNCA5LjNjLTMgMy43LTQuMyA3LjEtMTIuMiAxMS42Yy0yLjggMS42LTMuMiA1LTQuMyA0LjhDMjEuNiAyNC40IDcuNSAyMyA3LjUgMjNMNiAzMS4yYy0uOCAxMS4zIDE4LjUgNy40IDIyLjkgNS40YzIuNy0xLjIgNC41LTEuNCA1LjgtMy43YzEuMi0yLjIgMy4zLjUgMTUuMy0xOS45em0xLjggMjIuMmw5LjItNy42bDMgMTEuNmwtOS4zIDIuN3oiLz48cGF0aCBmaWxsPSIjZDZhNTdjIiBkPSJNNTAuNSA3LjFMMzUuNiAxNmMtLjkgNC4yLjkgNS44IDEuMiA3LjRjLjIuNy0uOCAyLjQtMS40IDMuM2MtMS4yIDIgMS44IDIuNCAyLjcgMS45YzEgMS40LjcgMi4yIDEuNSAxLjZjLjctLjUgMi4xIDIuMyAxLjkgMy4xbDEwLjgtMS41eiIvPjxwYXRoIGZpbGw9IiM1OTQ2NDAiIGQ9Ik00MyAyLjljMTItMy4zIDE2LjQgNy4zIDE2LjcgMTUuNGMuMiA0LjMtMi44IDguNC00LjggMTAuMWwtOS4zLTE2LjhjLTEuOS0uMy04LjQgNS40LTkuOSA0LjRjLTQtMi43LjItMTEuMSA3LjMtMTMuMSIvPjxwYXRoIGZpbGw9IiNlZDRjNWMiIGQ9Im00MS42IDMuOWw2LjEgMTJjLS4zIDEtLjggMi40LS41IDQuMmMyLjEgMTIuNCA0LjggNy45IDguNCAyLjZjMS0xLjUgMS41LTMuNyAxLjUtNC44bDIuOS0xLjFjMS0uNC4yLTMuNS0uOC0zTDU2IDE1Yy0uOC0uOS01LjMtMS45LTYuNC0xLjRMNDQgMi42Yy0uNi0xLjMtMy0uNC0yLjQgMS4zIi8+PHBhdGggZmlsbD0iI2Q2YTU3YyIgZD0ibTEyLjggNmwxNC43IDEwYy45IDQuMi0uOSA1LjgtMS4yIDcuNGMtLjIuNy44IDIuNCAxLjQgMy4zYzEuMiAyLTEuOCAyLjQtMi43IDEuOWMtMSAxLjQtLjcgMi4yLTEuNSAxLjZjLS43LS41LTIuMyAyLjQtMS45IDMuMWMuNC42LS40LjgtMS4yLjJjLS45IDMuNC0yLjggMi43LTYuOSAxLjJDNC45IDMxLjUgMTIuOCA2IDEyLjggNiIvPjxwYXRoIGZpbGw9IiM1OTQ2NDAiIGQ9Ik0yMC4xIDIuOUM4LjItLjQgMy44IDEwLjIgMy41IDE4LjNjLS4yIDQuMyAxLjEgNy40IDMuMiA5LjJsMS40LS41bDkuNS0xNS4zYzEuOS0uMyA4LjUgNS40IDkuOSA0LjRjMy45LTIuOC0uMi0xMS4yLTcuNC0xMy4yIi8+PHBhdGggZmlsbD0iIzQyYWRlMiIgZD0ibTE5LjEgMi42bC01LjYgMTFjLTEuMS0uNS01LjUuNS02LjQgMS40TDQgMTMuOGMtLjktLjQtMS44IDIuNi0uOCAzbDIuOSAxLjFjLjEgMS4xLjUgMy4zIDEuNSA0LjhjMy42IDUuMyA2LjMgOS45IDguNC0yLjZjLjMtMS44LS4yLTMuMi0uNS00LjJsNi0xMi4xYy43LTEuMy0xLjYtMi40LTIuNC0xLjIiLz48cGF0aCBmaWxsPSIjZThlOGU4IiBkPSJtMTUuNiAzNC44bC0xLjgtMTAuNmMtLjItMS40LTIuOS0uOS0yLjYuNUwxMyAzNS4zeiIvPjxwYXRoIGZpbGw9IiM0MmFkZTIiIGQ9Ik0xNy40IDYyUzIxIDU0IDIxIDQ4LjRjMC04LjMtNi4xLTEwLjktMTAuNC0xMi4zYy00LjEtMS4zLTQuNi01LTQuNi01Yy0xIDAtNi4yIDYuOC0zIDE2LjhjMi41IDcuOS0uNCAxNC0uNCAxNGgxNC44eiIvPjxwYXRoIGZpbGw9IiNiNTgzNjAiIGQ9Ik00LjggNjJoNi41czQuOS00LjggNC45LTEzLjNjMC0xMi4yLTguMi0xMi45LTEwLjctMTAuNGMtMy4xIDMuNC0xLjQgNi43LjMgMTMuNWMxIDQtMSAxMC4yLTEgMTAuMiIvPjxwYXRoIGZpbGw9IiNlZDRjNWMiIGQ9Ik00Ni41IDYycy0zLjYtOC0zLjYtMTMuNmMwLTguMyA2LjEtMTAuOSAxMC40LTEyLjNjNC4xLTEuMyA0LjYtNSA0LjYtNWMxIDAgNi4yIDYuOCAzIDE2LjhjLTIuNSA3LjkuNCAxNCAuNCAxNEg0Ni41eiIvPjxwYXRoIGZpbGw9IiNiNTgzNjAiIGQ9Ik01OS4xIDYyaC02LjVzLTQuOS00LjgtNC45LTEzLjNjMC0xMi4yIDguMi0xMi45IDEwLjctMTAuNGMzLjIgMy40IDEuNSA2LjctLjIgMTMuNWMtMSA0IC45IDEwLjIuOSAxMC4yIi8+PHBhdGggZmlsbD0iIzNlNDM0NyIgZD0iTTQxLjcgMzIuOXMzLjctMS45IDcuMy00LjhjLjUtLjQuNi0zLjggNC4yLTYuMWMyLjEtMS4zIDMuMi4zIDQtLjFjLjktLjQgMi4zIDAgMi4zIDBsLTYuMyAxMC43eiIgb3BhY2l0eT0iMC4zIi8+PHBhdGggZmlsbD0iI2Q2YTU3YyIgZD0iTTYwLjcgMjMuMWMtMS41LTMtNC45LjEtNC45LjFzLS44LTIuMi0zLjEtLjNjLTIuNyAyLjItMi4xIDQuNy0zLjMgNS45Yy0yLjcgMi01LjYgMy45LTEyLjMgNS4zYy0zLjIuNi00LjUgMy43LTUuNSAzLjJjLTUuNi0zLjMtMTAuNiAxLjYtMTUuNCAwYy0xMC4xLTMuNS0xMi45IDEuNi0xMi43IDYuOWMuMiAzLjggNC44IDUuOCA4LjMgNi42YzguMyAyLjEgMTQuMS0yLjYgMTguOS0zLjFjMi45LS4zIDMuNS40IDUuNC0xLjRjMS43LTEuNyAyLjkgMS4yIDE3LjgtMTEuOGMwIDAgMi4xLjIgNi41LTMuNWMyLTEuNyAyLjItNC4zLjMtNy45Ii8+PHBhdGggZmlsbD0iI2I1ODM2MCIgZD0iTTI1LjEgNDNzNC45LjcgNy42LTZjLTQuNiA1LjYtNy42IDYtNy42IDYiLz48cGF0aCBmaWxsPSIjM2U0MzQ3IiBkPSJNMzIuMyA0Ny42cy02LjUtMi0xMi43LTguN2MtMS4xLTEuMi0uNy0zLjQtMy42LTUuNGwtMy4xLjNjLS42LS42LTIuNy0zLjItNC42LTEuMmMtMS44IDEuOC0yLjYgNi42LTEuMiA4LjRjLjggMSA3IDUgNy40IDUuNWM0LjcgNS43IDUuMyA5LjQgNS4zIDkuNHMuOC0yLjIgMS4yLTUuMXoiIG9wYWNpdHk9IjAuMyIvPjxwYXRoIGZpbGw9IiNkNmE1N2MiIGQ9Ik02MC45IDQxLjljLTIuMy01LjgtNy45LTcuMy0xMy4yLS4zYy0zLjEgNC4xLTkuNyAyLjQtMTMuMiA3LjdjLTIuMi0zLjQtNy4zLTItMTUuNC05LjZjMCAwLS4yLTQuMS0zLjEtNi4yYy0yLTEuNS0zLjEuMy0zLjEuM3MtMy40LTMuMS00LjktLjFjLTEuOCAzLjYtMS45IDYuNS41IDcuOWM0LjEgMi41IDYuNSAyLjggNi41IDIuOGMxMi44IDE0LjUgMTMuOCAxMi4xIDE1LjUgMTMuNGMyLjkgMi41IDMuOCAyLjEgOS42LjRjNC42LTEuMyAxMS42LTEuMSAxNy45LTcuMmMyLjQtMi42IDQuMy01LjYgMi45LTkuMSIvPjxwYXRoIGZpbGw9IiNiNTgzNjAiIGQ9Ik00Ni45IDQyLjdzNi4zIDUuMyAxMC4zIDQuMmMtMy43IDItOC4zLS42LTEwLjMtNC4yTTQ0IDUwLjFzLTMuNSAzLjYtOS41LS4xYzYuOSAxLjcgOS41LjEgOS41LjEiLz48cGF0aCBmaWxsPSIjNjY0ZTI3IiBkPSJNNDAuOSAyMi4zYy4zIDEuMS0uMSAyLjItLjkgMi40cy0xLjItLjYtMS42LTEuN2MtLjMtMS4yIDIuMi0xLjggMi41LS43bS0xOC4yIDBjLS4zIDEuMS4xIDIuMi45IDIuNHMxLjItLjYgMS42LTEuN2MuMi0xLjItMi4yLTEuOC0yLjUtLjdtLS40IDcuNXMtMS41IDEuNy0xLjQgMi45YzAgMC0xLjgtMS40LTEuMi0yLjRjLjUtMSAyLjYtLjUgMi42LS41bTE4LjUgMHMxLjUgMS43IDEuNCAyLjljMCAwIDEuOC0xLjQgMS4yLTIuNGMtLjQtMS0yLjYtLjUtMi42LS41Ii8+PC9zdmc+
// @namespace    https://greasyfork.org/
// @version      1.2
// @description  魔力值管理增强版，支持顶部排序表格和阈值筛选
// @author       leo_lin
// @license MIT
// @match        https://audiences.me/claim.php?act=seeder*
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/550593/%E4%BA%BA%E4%BA%BA%E7%A7%8D%E5%AD%90%E8%AE%A4%E9%A2%86%E7%AD%9B%E9%80%89.user.js
// @updateURL https://update.greasyfork.org/scripts/550593/%E4%BA%BA%E4%BA%BA%E7%A7%8D%E5%AD%90%E8%AE%A4%E9%A2%86%E7%AD%9B%E9%80%89.meta.js
// ==/UserScript==

(function() {
	'use strict';

	// 样式增强
	GM_addStyle(`
		/* 魔力值列样式 */
		.magic-value-column {
			min-width: 80px;
		}

		/* 阈值输入框样式 */
		#threshold-input {
			position: fixed;
			bottom: 20px;
			right: 20px;
			z-index: 9999;
			padding: 15px;
			background: #ffffff;
			border: 2px solid #007bff;
			border-radius: 8px;
			box-shadow: 0 4px 12px rgba(0,0,0,0.15);
		}

		/* 红色认领标记 */
		.red-claim {
			color: #dc3545 !important;
			font-weight: bold;
			text-shadow: 0 1px 1px rgba(0,0,0,0.1);
		}

		/* 顶部汇总表格样式 */
		#magic-summary-table {
			margin: 20px auto;
			background: #f8f9fa;
			border-radius: 8px;
			overflow: hidden;
			box-shadow: 0 2px 8px rgba(0,0,0,0.1);
		}

		#magic-summary-table th {
			background: #007bff;
			color: white;
			padding: 12px;
		}

		#magic-summary-table td {
			padding: 10px;
			border-bottom: 1px solid #dee2e6;
		}

		.summary-header {
			text-align: center;
			margin: 25px 0 15px;
			color: #2c3e50;
			font-size: 1.4em;
		}
	`);



		//原网页标题加入预估魔力值
		const title = document.querySelectorAll('table tr:has(td.colhead)');
		const temp = title[2];
		const titleCell = document.createElement('td');
		titleCell.className = 'colhead';
		titleCell.textContent = '预估魔力';
		titleCell.style.textAlign = "center";
		temp.appendChild(titleCell);



	// 创建阈值控件
	function createThresholdInput() {
		const container = document.createElement('div');
		container.id = 'threshold-input';
		container.innerHTML = `
		<div style="margin-bottom:8px;color:#007bff;font-weight:bold;">筛选设置</div>

		<select id="type" style="width:80px;padding:6px;border:1pxsolid#ced4da;border-radius:4px;">
		<option value="1">魔力</option>
		<option value="2">体积</option>
		</select>

		<select id="judge" style="width:80px;padding:6px;border:1pxsolid#ced4da;border-radius:4px;">
		<option value="1">大于</option>
		<option value="2">小于</option>
		</select>

		<input type="number"id="threshold"style="width:50px;padding:6px;border:1pxsolid#ced4da;border-radius:4px;"min="0"step="100">

		<br></br>

		<select id="sort"style="width:163px;padding:6px;border:1pxsolid#ced4da;border-radius:4px;">
		<option value="1">按魔力从大到小排列</option>
		<option value="2">按体积从小到大排列</option>
		</select>


		<button id="apply-threshold"style="width:67px; height:30px;background:#007bff;color:white;border:none;padding:6px12px;border-radius:4px;cursor:pointer;">应用</button>
		`;
		document.body.appendChild(container);

		// 加载保存的阈值
		const savedtype = localStorage.getItem('type') || 1;
		document.getElementById('type').value = savedtype;
		const savedjudge = localStorage.getItem('judge') || 1;
		document.getElementById('judge').value = savedjudge;

		const savedThreshold = localStorage.getItem('magicThreshold') || 3000;
		document.getElementById('threshold').value = savedThreshold;

		const savedsort = localStorage.getItem('sort') || 1;
		document.getElementById('sort').value = savedsort;




	}

	// 创建顶部汇总表格
	function createSummaryTable(data) {
		const existingTable = document.getElementById('magic-summary-table');
		if (existingTable) existingTable.remove();

		const table = document.createElement('table');
		table.id = 'magic-summary-table';
		table.className = 'mainouter';
		table.setAttribute('cellspacing', '0');
		table.setAttribute('cellpadding', '5');
		table.style.minWidth = '1460px';

		// 表格头部
		const thead = document.createElement('thead');
		thead.innerHTML = `
			<tr>
				<th class="colhead">排名</th>
				<th class="colhead">种子名称</th>
				<th class="colhead">大小</th>
				<th class="colhead">做种人数</th>
				<th class="colhead">魔力值</th>
				<th class="colhead">操作</th>
			</tr>
		`;

		// 表格内容
		const tbody = document.createElement('tbody');
		data.forEach((item, index) => {
			const row = document.createElement('tr');

            let textContent = setTXT(item.magic);

			row.innerHTML = `
				<td class="rowfollow"  align="center">${index + 1}</td>
				<td><a class="rowfollow" href="${item.link}" target="_blank">${item.name}</a></td>
				<td class="rowfollow"  align="center">${item.size}</td>
				<td class="rowfollow" align="center">${item.num}</td>
				<td class="rowfollow"  align="center" style="color:#28a745;font-weight:bold;">${item.magic}${textContent}</td>
				<td class="rowfollow"  align="center">${item.action}</td>
			`;
			tbody.appendChild(row);
		});

		table.appendChild(thead);
		table.appendChild(tbody);

		// 插入到页面顶部
		const target = document.querySelector('h1');
		if (target) {
			target.parentNode.insertBefore(table, target.nextSibling);
		}
	}


	function start() {

		const type = parseInt(document.getElementById('type').value) || 1;
		const judge = parseInt(document.getElementById('judge').value) || 1;
		const threshold = parseInt(document.getElementById('threshold').value) || 3000;
		const sort = parseInt(document.getElementById('sort').value) || 1;

		localStorage.setItem('type', type);
		localStorage.setItem('judge', judge);
		localStorage.setItem('magicThreshold', threshold);
		localStorage.setItem('sort', sort);

		window.location.reload();

	}

    // 定义条件判断函数
    function setTXT(getmagic) {
        let textContent = "";
        if (getmagic > 6000) {
            textContent += '👑🔥';
        }
        else if (getmagic > 5500) {
            textContent += '👑';
        }
        else if (getmagic > 5000) {
            textContent += '🔥';
        }


        return textContent;
    }






	// 处理主表格数据
	function processMainTable() {
		const type = parseInt(document.getElementById('type').value) || 1;
		const judge = parseInt(document.getElementById('judge').value) || 1;
		const threshold = parseInt(document.getElementById('threshold').value) || 3000;
		const sort = parseInt(document.getElementById('sort').value) || 1;

		localStorage.setItem('type', type);
		localStorage.setItem('judge', judge);
		localStorage.setItem('magicThreshold', threshold);
		localStorage.setItem('sort', sort);

		const qualifiedData = [];


		const rows = document.querySelectorAll('table tr:has(td.rowfollow)');

		// 添加/更新魔力值列
		rows.forEach(row => {
			const cells = row.querySelectorAll('td.rowfollow');
			const nameCell = cells[2];
			const sizeCell = cells[3];
			const numCell = cells[4];
			const actionCell = cells[cells.length - 1];

			if (!nameCell || !sizeCell || !actionCell) return;

			// 转换大小
			const sizeText = sizeCell.textContent.trim();
            let sizeGB = 0;
            if(sizeText.indexOf('MB') != -1){
                sizeGB = parseFloat(sizeText.replace('MB', '').trim())/1024;
            }
            else if(sizeText.indexOf('GB') != -1){
                sizeGB = parseFloat(sizeText.replace('GB', '').trim());
            }
            else if(sizeText.indexOf('TB') != -1){
                sizeGB = parseFloat(sizeText.replace('TB', '').trim())*1024;
            }

			// 计算魔力值
			const magicValue = calculateMagicValue(nameCell.textContent, sizeGB);
			const magicValueRounded = Math.round(magicValue);

			// 更新魔力值列
			let magicCell = row.querySelector('.magic-value-column');
			if (!magicCell) {
				magicCell = document.createElement('td');
				magicCell.className = 'rowfollow magic-value-column';
				magicCell.style.textAlign = "center";
				actionCell.parentNode.append(magicCell);
			}
			magicCell.textContent = magicValueRounded;

            let textContent = setTXT(magicValueRounded);
            magicCell.innerHTML += textContent;

			// 收集符合条件的数据
			const claimLink = actionCell.querySelector('a[href^="javascript:claim"]');

			// 定义条件判断函数
            const isConditionMet = (type, judge, magicValue, sizeGB, threshold, claimLink) => {
                if (!claimLink) return false;

                if (type === 1) {
                    if (judge === 1) return magicValue >= threshold;
                    if (judge === 2) return magicValue <= threshold;
                }

                if (type === 2) {
                    if (judge === 1) return sizeGB >= threshold;
                    if (judge === 2) return sizeGB <= threshold;
                }

                return false;
            };

            // 在主循环中使用条件判断
            if (isConditionMet(type, judge, magicValue, sizeGB, threshold, claimLink)) {
                qualifiedData.push({
                    name: nameCell.innerHTML,
                    size: sizeText,
                    sizenum: sizeGB,
                    num: numCell.innerHTML,
                    magic: magicValueRounded,
                    action: actionCell.innerHTML
                });
            }

            // 统计高于阈值的积分总和
            if (magicValueRounded > threshold) {
                let extra = Math.floor((magicValueRounded - threshold) / 500);
                let color = `hsl(${Math.max(0, 120 - extra * 15)}, 100%, 85%)`;
                row.style.backgroundColor = color;
            }
		});

		// 生成顶部汇总表格（降序排序）
		if(sort == 1){
			qualifiedData.sort((a, b) => b.magic - a.magic);
		}
		else if(sort == 2){
			qualifiedData.sort((a, b) => a.sizenum - b.sizenum);
		}
        createSummaryTable(qualifiedData);
	}

	// 计算魔力值逻辑
	function calculateMagicValue(name, sizeGB) {
		if (/adweb/i.test(name)) return sizeGB * 50;
		if (/remux/i.test(name)) return sizeGB * 40;
		if (/x264/i.test(name)) return sizeGB * 30;
		return sizeGB * 20;
	}

	// 初始化
	function init() {
		createThresholdInput();
		document.getElementById('apply-threshold').addEventListener('click', start);

		// 初始处理
		processMainTable();

	}

	// 启动脚本
	if (document.readyState === 'complete') {
		init();
	} else {
		window.addEventListener('load', init);
	}
})();