// ==UserScript==
// @name         RoberLabs数据提取与更新
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  在页面中添加按钮用于提取和更新数据，支持懒加载/虚拟滚动列表。
// @match        https://www.roberlabs.com/projects/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=roberlabs.com
// @grant        GM_addStyle
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/552116/RoberLabs%E6%95%B0%E6%8D%AE%E6%8F%90%E5%8F%96%E4%B8%8E%E6%9B%B4%E6%96%B0.user.js
// @updateURL https://update.greasyfork.org/scripts/552116/RoberLabs%E6%95%B0%E6%8D%AE%E6%8F%90%E5%8F%96%E4%B8%8E%E6%9B%B4%E6%96%B0.meta.js
// ==/UserScript==

(function () {
	'use strict';

	// --- 样式定义 (无需修改) ---
	GM_addStyle(`
        #tm-tool-container {
            position: fixed;
            bottom: 20px;
            right: 80px;
            z-index: 9999;
            display: flex;
            flex-direction: column;
            gap: 10px;
        }
        .tm-button {
            padding: 10px 15px;
            font-size: 14px;
            color: white;
            border: none;
            border-radius: 5px;
            cursor: pointer;
            box-shadow: 0 2px 5px rgba(0,0,0,0.2);
            transition: background-color 0.3s;
        }
        #tm-extract-btn { background-color: #007bff; }
        #tm-extract-btn:hover { background-color: #0056b3; }
        #tm-update-btn { background-color: #28a745; }
        #tm-update-btn:hover { background-color: #1e7e34; }

        #tm-update-modal {
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: white;
            padding: 20px;
            border-radius: 8px;
            box-shadow: 0 4px 15px rgba(0,0,0,0.2);
            z-index: 10001;
            width: 500px;
            color: #333;
        }
        #tm-update-textarea {
            width: 95%;
            height: 200px;
            margin-top: 10px;
            margin-bottom: 15px;
            padding: 10px;
            border: 1px solid #ccc;
            border-radius: 4px;
        }
        .tm-modal-buttons {
            display: flex;
            justify-content: flex-end;
            gap: 10px;
        }
        #tm-status-indicator {
            position: fixed;
            top: 20px;
            left: 50%;
            transform: translateX(-50%);
            background-color: rgba(0, 0, 0, 0.7);
            color: white;
            padding: 10px 20px;
            border-radius: 5px;
            z-index: 10002;
            font-size: 16px;
        }
    `);

	// --- 核心功能函数 ---

	function getView (el) {
		return el?.ownerDocument?.defaultView || (typeof unsafeWindow !== 'undefined' ? unsafeWindow : window);
	}
	function getDoc (el) {
		return el?.ownerDocument || document;
	}

	/**
	 * 显示一个状态提示
	 * @param {string} message - 要显示的消息
	 * @param {number} [duration=0] - 显示时长（毫秒），0表示一直显示
	 */
	function showStatus (message, duration = 0) {
		let indicator = document.getElementById('tm-status-indicator');
		if (!indicator) {
			indicator = document.createElement('div');
			indicator.id = 'tm-status-indicator';
			document.body.appendChild(indicator);
		}
		indicator.textContent = message;
		indicator.style.display = 'block';

		if (duration > 0) {
			setTimeout(() => {
				indicator.style.display = 'none';
			}, duration);
		}
	}

	/**
	 * 隐藏状态提示
	 */
	function hideStatus () {
		const indicator = document.getElementById('tm-status-indicator');
		if (indicator) {
			indicator.style.display = 'none';
		}
	}

	/**
	 * 文本转义函数
	 * @param {string} str - 输入字符串
	 * @returns {string} - 转义后的字符串
	 */
	function escapeText (str) {
		if (!str) return '';
		return str.replace(/\n/g, '\\n').replace(/\t/g, '    ');
	}

	/**
	 * 创建一个通用的列选择弹窗
	 * @param {string} titleText - 弹窗的标题
	 * @returns {Promise<string>} - 返回用户选择的列的 value
	 */
	function createColumnSelector (titleText) {
		return new Promise((resolve, reject) => {
			const columns = new Map();
			const firstRow = document.querySelector('[data-subtitle-index]');
			if (firstRow) {
				const id = firstRow.getAttribute('data-subtitle-index') || '';
				const source = firstRow.querySelector('.p-1.text-gray-400')?.textContent.trim() || '';
				const target = firstRow.querySelector('.p-1+textarea')?.value.trim() || '';
				columns.set('ID', id);
				columns.set('Source', source);
				columns.set('Target', target);
			}

			const modal = document.createElement('div');
			modal.style.cssText = `
                position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%);
                background: white; padding: 20px; border-radius: 8px;
                box-shadow: 0 2px 10px rgba(0,0,0,0.1); z-index: 10001;
                min-width: 400px; max-width: 600px; color: #000;
            `;

			const title = document.createElement('h3');
			title.textContent = titleText;
			title.style.marginBottom = '20px';

			const list = document.createElement('div');
			list.style.cssText = 'max-height: 300px; overflow-y: auto; margin-bottom: 20px;';

			columns.forEach((content, value) => {
				const item = document.createElement('div');
				item.className = 'column-item';
				item.style.cssText = `
                    margin-bottom: 10px; padding: 10px; border: 2px solid #eee;
                    border-radius: 4px; cursor: pointer; display: flex; align-items: center;
                    transition: all 0.3s ease;
                `;
				item.onclick = () => radio.click();

				const radio = document.createElement('input');
				radio.type = 'radio';
				radio.name = 'column-selector';
				radio.value = value;
				radio.style.marginRight = '10px';
				radio.onchange = () => {
					list.querySelectorAll('.column-item').forEach(el => {
						el.style.borderColor = '#eee';
						el.style.backgroundColor = 'white';
					});
					if (radio.checked) {
						item.style.borderColor = '#4CAF50';
						item.style.backgroundColor = '#f0f9f0';
					}
				};

				const label = document.createElement('label');
				label.style.cssText = 'flex: 1; cursor: pointer; display: flex; justify-content: space-between; align-items: center;';
				label.innerHTML = `
                    <span style="font-weight: bold;">${value}</span>
                    <span style="color: #666; margin-left: 10px;">示例: ${content.substring(0, 30)}${content.length > 30 ? '...' : ''}</span>
                `;

				item.appendChild(radio);
				item.appendChild(label);
				list.appendChild(item);
			});

			const buttons = document.createElement('div');
			buttons.style.cssText = 'display: flex; justify-content: flex-end; gap: 10px;';

			const confirmBtn = document.createElement('button');
			confirmBtn.textContent = '确认';
			confirmBtn.className = 'tm-button';
			confirmBtn.style.backgroundColor = '#4CAF50';
			confirmBtn.onclick = () => {
				const selected = document.querySelector('input[name="column-selector"]:checked');
				if (selected) {
					modal.remove();
					resolve(selected.value);
				} else {
					alert('请选择一个列');
				}
			};

			const cancelBtn = document.createElement('button');
			cancelBtn.textContent = '取消';
			cancelBtn.className = 'tm-button';
			cancelBtn.style.backgroundColor = '#f44336';
			cancelBtn.onclick = () => {
				modal.remove();
				reject('用户取消选择');
			};

			buttons.appendChild(cancelBtn);
			buttons.appendChild(confirmBtn);
			modal.appendChild(title);
			modal.appendChild(list);
			modal.appendChild(buttons);
			document.body.appendChild(modal);
		});
	}

	/**
	 * 滚动并提取所有数据，处理懒加载/虚拟滚动
	 * @param {string} selectedColumn - 用于去重的列名
	 * @returns {Promise<Array>} - 返回包含所有行数据的数组
	 */
	async function scrollAndExtractAllData (selectedColumn) {
		// !!! 重要: 请根据实际页面情况修改此选择器 !!!
		// 这是包含滚动条的元素的选择器
		const scrollContainerSelector = '[data-panel-group-id] .overflow-y-scroll.w-full'; // 示例选择器，需要您手动确认
		const scrollContainer = document.querySelector(scrollContainerSelector);

		if (!scrollContainer) {
			alert(`无法找到滚动容器 (选择器: ${scrollContainerSelector})。请在脚本中更新此选择器。`);
			throw new Error('滚动容器未找到');
		}

		const rows = [];
		const seen = new Set();
		const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

		let lastHeight = 0;
		let consecutiveNoNewData = 0;

		while (consecutiveNoNewData < 5) { // 连续5次滚动没有新数据则停止
			document.querySelectorAll('[data-subtitle-index]').forEach(row => {
				const rowData = {};
				rowData['ID'] = row.getAttribute('data-subtitle-index');
				rowData['Source'] = escapeText(row.querySelector('.p-1.text-gray-400')?.textContent.trim() || '');
				rowData['Target'] = escapeText(row.querySelector('.p-1+textarea')?.value.trim() || '');

				const id = rowData[selectedColumn];
				if (id && !seen.has(id)) {
					seen.add(id);
					rows.push(rowData);
				}
			});

			showStatus(`已提取 ${rows.length} 条数据，正在滚动加载更多...`);

			scrollContainer.scrollTop = scrollContainer.scrollHeight;
			await delay(1000); // 等待1秒让新数据加载

			if (scrollContainer.scrollHeight === lastHeight) {
				consecutiveNoNewData++;
			} else {
				consecutiveNoNewData = 0;
			}
			lastHeight = scrollContainer.scrollHeight;
		}

		hideStatus();
		return rows;
	}


	/**
	 * 提取数据函数
	 */
	async function extractData () {
		try {
			const selectedColumn = await createColumnSelector('请选择ID列（用于去重）');

			const rows = await scrollAndExtractAllData(selectedColumn);
			const columnArray = ['ID', 'Source', 'Target'];

			if (rows.length === 0) {
				alert('未能提取到任何数据。');
				return;
			}

			// --- 数据展示部分无需修改 ---
			const display = document.createElement('div');
			display.style.cssText = `
                position: fixed; top: 20px; right: 20px; background: white; padding: 20px;
                border: 1px solid #ccc; border-radius: 5px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);
                max-height: 80vh; overflow: auto; z-index: 10000; min-width: 800px; color: #000;
            `;

			const table = document.createElement('table');
			table.style.cssText = 'border-collapse: collapse; width: 100%; margin-bottom: 10px;';
			const header = `<tr><th style="border: 1px solid #ddd; padding: 8px; text-align: left;">序号</th>${columnArray.map(col => `<th style="border: 1px solid #ddd; padding: 8px; text-align: left;">${col}</th>`).join('')}</tr>`;
			const rows_html = rows.map((row, index) => `<tr><td style="border: 1px solid #ddd; padding: 8px;">${index + 1}</td>${columnArray.map(col => `<td style="border: 1px solid #ddd; padding: 8px;">${row[col] || ''}</td>`).join('')}</tr>`).join('');
			table.innerHTML = header + rows_html;

			const toolbar = document.createElement('div');
			toolbar.style.cssText = 'display: flex; justify-content: space-between; margin-top: 10px;';

			const copyBtn = document.createElement('button');
			copyBtn.textContent = `复制 ${rows.length} 条数据`;
			copyBtn.style.cssText = 'padding: 5px 10px; cursor: pointer;';
			copyBtn.onclick = () => {
				const text = rows.map((row, index) => `${index + 1}\t${columnArray.map(col => row[col] || '').join('\t')}`).join('\n');
				navigator.clipboard.writeText(text).then(() => {
					copyBtn.textContent = '已复制！';
					setTimeout(() => copyBtn.textContent = `复制 ${rows.length} 条数据`, 2000);
				});
			};

			const closeBtn = document.createElement('button');
			closeBtn.textContent = '关闭';
			closeBtn.style.cssText = 'padding: 5px 10px; cursor: pointer; margin-left: 10px;';
			closeBtn.onclick = () => display.remove();

			toolbar.appendChild(copyBtn);
			toolbar.appendChild(closeBtn);
			display.appendChild(table);
			display.appendChild(toolbar);
			document.body.appendChild(display);

		} catch (error) {
			console.error('操作取消或发生错误:', error);
			hideStatus();
		}
	}

	/**
	 * 更新内容函数
	 * @param {string} excelData - 从文本框输入的Excel数据
	 */
	async function updateContent (excelData) {
		/**
		 * Updates the value of a React-controlled textarea element.
		 * This is the key to making the update work on modern web frameworks.
		 * @param {HTMLTextAreaElement} element The textarea element to update.
		 * @param {string} value The new value to set.
		 */
		function updateReactInput(element, value) {
			const view = getView(element);
			// Use the native value setter to bypass React's synthetic event system for direct value updates.
			const nativeInputValueSetter = Object.getOwnPropertyDescriptor(view.HTMLTextAreaElement.prototype, 'value')?.set;
			if (nativeInputValueSetter) {
				nativeInputValueSetter.call(element, value);
			} else {
				// Fallback for environments where the descriptor might not be found.
				element.value = value;
			}

			// Dispatch an 'input' event to notify the framework (e.g., React) of the change.
			const event = new view.Event('input', { bubbles: true, cancelable: true });
			element.dispatchEvent(event);
		}

		if (!excelData || typeof excelData !== 'string') {
			alert('请提供有效的Excel数据');
			return;
		}

		const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

		function processText (text) {
			return text.replace(/\\n/g, '\n');
		}

		try {
			const selectedColumn = await createColumnSelector('请选择用于匹配的ID列');
			console.log('选择的列:', selectedColumn);

			const updateMap = new Map();
			excelData.trim().split('\n').forEach(line => {
				const parts = line.split('\t');
				if (parts.length >= 2) {
					const id = parts[0].trim();
					const newText = parts.slice(1).join('\t').trim();
					if (id && newText) {
						updateMap.set(id, processText(newText));
					}
				}
			});

			console.log('更新数据Map:', [...updateMap.entries()]);
			if (updateMap.size === 0) {
				alert('没有找到有效的更新数据');
				return;
			}

			let updateCount = 0;
			let skipCount = 0;

			// Note: This process only updates currently visible/rendered rows.
			// For full virtual scrolling support, a loop that scrolls and updates would be needed.
			showStatus(`准备更新 ${updateMap.size} 条数据...`);
			await delay(1000);

			for (const row of document.querySelectorAll('[data-subtitle-index]')) {
				let id;
				if (selectedColumn === 'ID') {
					id = row.getAttribute('data-subtitle-index');
				} else if (selectedColumn === 'Source') {
					id = row.querySelector('.p-1.text-gray-400')?.textContent.trim();
				} else { // Target
					id = row.querySelector('.p-1+textarea')?.value.trim();
				}

				if (id && updateMap.has(id)) {
					const newText = updateMap.get(id);
					const editor = row.querySelector('.p-1+textarea');

					if (editor) {
						showStatus(`正在更新 ID: ${id} (${updateCount + 1}/${updateMap.size})`);
						console.log(`找到匹配: ${id} -> 更新内容`);

						// Scroll the element into view to ensure it's interactable.
						row.scrollIntoView({ behavior: 'smooth', block: 'center' });
						await delay(300); // Wait for scroll to finish.

						// Focus the element to mimic user interaction.
						editor.focus();
						await delay(100);

						// Use the robust update function.
						updateReactInput(editor, newText);
						await delay(100);

						// Blur to signify the end of editing.
						editor.blur();
						await delay(300);

						updateCount++;
						// Remove from map to correctly count remaining items.
						updateMap.delete(id);
					}
				} else {
					skipCount++;
				}
			}

			hideStatus();
			alert(`操作完成:\n- 成功更新: ${updateCount} 条\n- 跳过/未匹配 (在可见区域): ${skipCount} 条\n- 剩余未找到 (可能在未加载区域): ${updateMap.size} 条`);
			console.log(`操作完成: 更新: ${updateCount} 条, 跳过: ${skipCount} 条, 剩余: ${updateMap.size}`);
		} catch (error) {
			console.error('操作取消或发生错误:', error);
			hideStatus();
		}
	}



	// --- UI 和事件监听 (无需修改) ---

	function showUpdateModal () {
		const existingModal = document.getElementById('tm-update-modal');
		if (existingModal) {
			existingModal.remove();
		}

		const modal = document.createElement('div');
		modal.id = 'tm-update-modal';
		modal.innerHTML = `
            <h3>粘贴Excel/表格数据</h3>
            <p>请粘贴数据，格式为 "ID<Tab>新内容"，每行一条记录。</p>
            <textarea id="tm-update-textarea" placeholder="例如：\n0\t这是新的内容。\n1\t这是另一段新内容。"></textarea>
            <div class="tm-modal-buttons">
                <button id="tm-modal-cancel" class="tm-button" style="background-color: #6c757d;">取消</button>
                <button id="tm-modal-confirm" class="tm-button" style="background-color: #28a745;">确认更新</button>
            </div>
        `;
		document.body.appendChild(modal);

		document.getElementById('tm-modal-confirm').onclick = () => {
			const excelData = document.getElementById('tm-update-textarea').value;
			modal.remove();
			if (excelData) {
				updateContent(excelData);
			}
		};

		document.getElementById('tm-modal-cancel').onclick = () => {
			modal.remove();
		};
	}

	function createToolButtons () {
		const container = document.createElement('div');
		container.id = 'tm-tool-container';

		const extractBtn = document.createElement('button');
		extractBtn.id = 'tm-extract-btn';
		extractBtn.className = 'tm-button';
		extractBtn.textContent = '提取数据';
		extractBtn.onclick = extractData;

		const updateBtn = document.createElement('button');
		updateBtn.id = 'tm-update-btn';
		updateBtn.className = 'tm-button';
		updateBtn.textContent = '更新内容';
		updateBtn.onclick = showUpdateModal;

		// container.appendChild(extractBtn);
		container.appendChild(updateBtn);
		document.body.appendChild(container);
	}

	// 脚本入口
	createToolButtons();

})();
