// ==UserScript==
// @name         12306火车查询脚本
// @namespace    http://tampermonkey.net/
// @version      2025-09-11
// @description  尝试征服世界！
// @author       Dean
// @match        https://kyfw.12306.cn/otn/leftTicket/init*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=tampermonkey.net
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/549960/12306%E7%81%AB%E8%BD%A6%E6%9F%A5%E8%AF%A2%E8%84%9A%E6%9C%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/549960/12306%E7%81%AB%E8%BD%A6%E6%9F%A5%E8%AF%A2%E8%84%9A%E6%9C%AC.meta.js
// ==/UserScript==

(function () {
	"use strict";

	// 定义需要查询的火车列表
	var train_list = ["K179", "K180"];
	var train_date = "2025-09-26";

	// 默认查询间隔时长为10分钟
	var DEFAULT_INTERVAL = 300000;

	// 刷新延迟时间为3秒
	var REFRESH_DELAY = 3000;
	// 内部属性
	var intervalId = null;
	var logIndex = 0;

	// 检查火车信息
	var checkTrain = function (train_list) {
		var t_list = document.getElementById("t-list");
		var rows = t_list.getElementsByTagName("tr");
		log("查询到" + rows.length + "辆车次，尝试获取目标车次状态...");
		for (var i = 0; i < rows.length; i++) {
			var cells = rows[i].cells;
			var letterText = "";
			var emit = false;
			var booking = false;
			var stationFromTo = "";
			for (var j = 0; j < cells.length; j++) {
				if (j === 0) {
					const trainResult = checkTrainNumber(cells[j], train_list);
					emit = trainResult.checkTrainStatus;
					if (emit) {
						rows[i].className = "";
						rows[i].style.backgroundColor = "lightgreen";
					}
					letterText = trainResult.letterText;
					stationFromTo = trainResult.stationFromTo;
					letterText = `${stationFromTo}  ${letterText}`;
				} else if (j == 1 && emit) {
				} else if (j === 12 && emit) {
					const trainStatus = checkTrainStatus(cells[j], letterText);
					booking = trainStatus.booking;
					letterText += trainStatus.letterText;
					// break trainLoop
				}
			}

			if (letterText && emit) {
				log(letterText + "--->预订状态：" + booking);
				if (booking) {
					// if (bookingBtn) {
					// 开始预定
					// log(`开始预定 ---->${letterText}`)
					// log(bookingBtn)
					// bookingBtn.getElementsByTagName('a')[0].click()
					// setTimeout(() => {
					// checkUser()
					// }, 1000);
					// } else {
					sendMessage("12306火车查询", letterText);
					sendStrongMessage(letterText);
					log("已查询到指定车次，定时逻辑关闭。如需重新开启，请刷新页面...");
					clearInterval(intervalId);
					// }
				}
			}
		}
	};

	var checkUser = function () {
		var loginModal = document.getElementById("login");
		if (loginModal) {
			// 未登录，输入账号密码
			// var J_userName = document.getElementById('J-userName')
			// var J_password = document.getElementById('J-password')
			// if (J_userName && J_password) {
			// 	J_userName.value = username
			// 	J_password.value = password
			// 	log(`密码输入完成...✅✅✅`)
			// 	document.getElementById('J-login').click()
			// }
		}
	};

	// 检查火车车次是否在查询列表中
	var checkTrainNumber = function (cell, train_list) {
		var numberTag = cell.getElementsByClassName("number");
		var number = numberTag[0]?.innerText;
		if (number) {
			if (train_list.includes(number)) {
				var cdzTags = cell.getElementsByClassName("cdz");
				var stationFromTo = "";
				if (cdzTags) {
					var from = cdzTags[0].getElementsByTagName("strong")[0];
					var to = cdzTags[0].getElementsByTagName("strong")[1];
					stationFromTo = `${from.innerHTML} -> ${to.innerHTML}`;
				}
				return { letterText: number, checkTrainStatus: true, stationFromTo };
			} else {
				return { letterText: "未查询到车次", checkTrainStatus: false };
			}
		} else {
			return {};
		}
	};

	// 检查火车状态并发送消息
	var checkTrainStatus = function (cell) {
		var a_link = cell.getElementsByTagName("a");
		if (a_link && a_link.length > 0 && a_link[0].tagName === "A") {
			const letterText = "[" + cell.innerText + "]\n可以预定了，赶快进入12306预定吧！！！";
			return { letterText, booking: true };
		} else {
			const letterText = "[" + cell.innerHTML + "]";
			return { letterText, booking: false };
		}
	};

	var shotToast = function (message) {
		var toastContainer = document.getElementById("message-container");
		if (toastContainer) {
			toastContainer.updateContentAndScrollToTop(
				`<div>${message}</div><br/>` + toastContainer.innerHTML
			);
		}
	};
	var log = function (log, showData = false) {
		console.log(new Date().toTimeString() + ": ", log);
		shotToast(showData ? new Date().toTimeString() + ": " + log : log);
	};

	var sendStrongMessage = function (message) {
		setInterval(() => sendMessage("12306强提醒", message), 10000);
	};

	// 发送消息
	var sendMessage = function (train, letterText) {
		log(letterText);
		// 检查浏览器是否支持Notification API
		if ("Notification" in window) {
			// 请求用户权限
			Notification.requestPermission().then((permission) => {
				if (permission === "granted") {
					// 如果用户授权，则创建通知
					const notification = new Notification(train, {
						body: letterText,
						icon: "https://www.google.com/s2/favicons?sz=64&domain=tampermonkey.net",
						sound: "system",
					});

					// 可以添加事件监听器来处理点击事件等
					notification.onclick = function (event) {
						window.focus();
					};
				}
			});
		} else {
			alert("你的浏览器不支持通知功能");
		}
	};

	var createToastContainer = function () {
		var toastContainer = document.createElement("div");
		toastContainer.id = "toast-container";
		toastContainer.style.position = "fixed";
		toastContainer.style.width = "500px";
		toastContainer.style.top = "20px";
		toastContainer.style.right = "20px";
		toastContainer.style.zIndex = "9999";
		toastContainer.style.padding = "10px";
		toastContainer.style.boxShadow = "0 4px 8px rgba(0,0,0,0.1)";
		toastContainer.style.borderRadius = "5px";
		toastContainer.style.backgroundColor = "rgba(60,60,60,0.9)";
		toastContainer.style.color = "#fff";
		toastContainer.style.fontFamily = "Arial, sans-serif";
		toastContainer.style.fontSize = "14px";
		toastContainer.innerHTML = `<div><H1>12306火车票监控预警已启动<H1><br/></div>`;
		document.body.appendChild(toastContainer);
	};

	var createMessageContainer = function () {
		var toastContainer = document.createElement("div");
		toastContainer.id = "message-container";
		toastContainer.style.position = "fixed";
		toastContainer.style.width = "500px";
		toastContainer.style.top = "160px";
		toastContainer.style.right = "20px";
		toastContainer.style.zIndex = "9999";
		toastContainer.style.padding = "10px";
		toastContainer.style.boxShadow = "0 4px 8px rgba(0,0,0,0.1)";
		toastContainer.style.borderRadius = "5px";
		toastContainer.style.backgroundColor = "rgba(60,60,60,0.9)";
		toastContainer.style.color = "#fff";
		toastContainer.style.fontFamily = "Arial, sans-serif";
		toastContainer.style.fontSize = "14px";
		toastContainer.style.overflowY = "auto"; // 添加这一行来实现垂直滚动
		toastContainer.style.maxHeight = "80%"; // 设置最大高度，超过这个高度就会显示滚动条
		document.body.appendChild(toastContainer);

		// 定义一个方法来更新innerHTML并滚动到顶部
		toastContainer.updateContentAndScrollToTop = function (htmlContent) {
			this.innerHTML = htmlContent;
			this.scrollTop = 0; // 滚动到顶部
		};
	};

	var startCheckSelDate = function () {
		document.title = "12306火车票监控预警已启动";
		document.querySelector("link[rel*='icon']").type = "image/svg+xml";
		document.querySelector("link[rel*='icon']").href =
			'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><circle cx="50" cy="50" r="40" stroke="green" stroke-width="4" fill="yellow" /></svg>';
		createToastContainer();
		createMessageContainer();

		var fromStationText = document.getElementById("fromStationText");
		var toStationText = document.getElementById("toStationText");
		var train_date_input = document.getElementById("train_date");
		if (train_date_input && fromStationText && toStationText) {
			train_date_input.value = train_date;
			var value = train_date_input.value;
			var toastContainer = document.getElementById('toast-container')
			if (toastContainer) {
				toastContainer.innerHTML = toastContainer.innerHTML + `监控车次： 由${fromStationText.value} 发往 ${toStationText.value}的${train_list}<br/> 监听日期： ${value}<br/><p>间隔时长： ${DEFAULT_INTERVAL / 60000}分钟</p>`
			}
		} else {
			log("监控车次的日期错误，请检查后重试...❌❌❌");
			sendMessage("12306监控车次异常", "监控车次的日期错误，请检查后重试...❌❌❌");
		}
	};

	const validCheckTrainStart = function () {
		var currentHour = new Date().getHours();
		if (currentHour < 24 && currentHour > 6) {
			return startCheckTrain;
		} else {
			log("12306封禁期，暂不做任何处理...✊✊✊");
			return () => { };
		}
	};

	// 创建一个更直观的监控信息面板
	function createMonitorPanel() {
		const panel = document.createElement("div");
		panel.id = "monitor-panel";
		panel.style.cssText = `
			position: fixed;
			top: 20px;
			right: 20px;
			width: 350px;
			padding: 20px;
			background-color: rgba(33, 33, 33, 0.95);
			color: #fff;
			border-radius: 12px;
			z-index: 9999;
			font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
			max-height: 85vh;
			overflow-y: auto;
			box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1), 0 1px 3px rgba(0, 0, 0, 0.08);
			backdrop-filter: blur(10px);
			border: 1px solid rgba(255, 255, 255, 0.1);
		`;
		panel.innerHTML = `
			<div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px;">
				<h2 style="margin: 0; color: #4CAF50; font-size: 1.5em;">12306 监控面板</h2>
				<div style="width: 10px; height: 10px; background: #4CAF50; border-radius: 50%; animation: pulse 2s infinite;"></div>
			</div>
			<style>
				@keyframes pulse {
					0% { transform: scale(1); opacity: 1; }
					50% { transform: scale(1.2); opacity: 0.5; }
					100% { transform: scale(1); opacity: 1; }
				}
				.monitor-section {
					background: rgba(255, 255, 255, 0.05);
					padding: 12px;
					border-radius: 8px;
					margin-bottom: 12px;
				}
				.monitor-section h3 {
					margin: 0 0 8px 0;
					color: #4CAF50;
					font-size: 1.1em;
				}
				.train-tag {
					display: inline-block;
					background-color: #4CAF50;
					color: white;
					padding: 4px 8px;
					margin: 2px;
					border-radius: 4px;
					font-size: 0.9em;
					transition: all 0.3s ease;
				}
				.train-tag:hover {
					transform: translateY(-2px);
					box-shadow: 0 2px 4px rgba(0,0,0,0.2);
				}
				.log-entry {
					padding: 8px;
					border-bottom: 1px solid rgba(255, 255, 255, 0.1);
					font-size: 0.9em;
					transition: background-color 0.3s ease;
				}
				.log-entry:hover {
					background-color: rgba(255, 255, 255, 0.05);
				}
				.timestamp {
					color: #888;
					font-size: 0.8em;
				}
			</style>
			<div id="monitor-info" class="monitor-section"></div>
			<div id="train-list" class="monitor-section"></div>
			<div id="next-refresh" class="monitor-section"></div>
			<div id="log-container" class="monitor-section" style="max-height: 300px; overflow-y: auto;"></div>
			<button id="reset-config" style="
				width: 100%;
				padding: 10px;
				background-color: #f44336;
				color: white;
				border: none;
				border-radius: 6px;
				cursor: pointer;
				font-weight: bold;
				transition: all 0.3s ease;
				margin-top: 10px;
			">重置配置</button>
		`;
		document.body.appendChild(panel);

		// 添加按钮悬停效果
		const resetButton = document.getElementById("reset-config");
		resetButton.addEventListener("mouseenter", () => {
			resetButton.style.backgroundColor = "#d32f2f";
		});
		resetButton.addEventListener("mouseleave", () => {
			resetButton.style.backgroundColor = "#f44336";
		});

		// 添加重置配置按钮的事件监听
		resetButton.addEventListener("click", resetConfig);
	}

	// 创建日期选择提醒
	function createDateReminder() {
		const reminder = document.createElement("div");
		reminder.id = "date-reminder";
		reminder.style.cssText = `
		position: fixed;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
		background-color: rgba(0, 0, 0, 0.8);
		color: #fff;
		padding: 20px;
		border-radius: 10px;
		text-align: center;
		z-index: 10000;
	  `;
		reminder.innerHTML = `
		<h3>请选择查询日期</h3>
		<p>点击日期输入框选择您要查询的日期</p>
		<button id="close-reminder" style="
		  margin-top: 10px;
		  padding: 5px 10px;
		  background-color: #4CAF50;
		  color: white;
		  border: none;
		  border-radius: 5px;
		  cursor: pointer;
		">我知道了</button>
	  `;
		document.body.appendChild(reminder);

		document.getElementById("close-reminder").addEventListener("click", () => {
			reminder.style.display = "none";
		});
	}

	// 触发日期选择器并设置监听
	function triggerDatePicker() {
		const dateInput = document.getElementById("train_date");
		if (dateInput) {
			dateInput.focus();
			// 模拟点击事件以打开日期选择器
			const event = new MouseEvent('click', {
				view: window,
				bubbles: true,
				cancelable: true
			});
			dateInput.dispatchEvent(event);

			// 添加日期变更监听
			dateInput.addEventListener('change', function () {
				updateMonitorDate(this.value);
			});
		}
	}

	// 更新监控日期并刷新页面
	function updateMonitorDate(newDate) {
		train_date = newDate; // 更新全局变量

		// 更新localStorage中的日期
		localStorage.setItem("train_date", newDate);

		// 更新监控信息显示
		const fromStationText = document.getElementById("fromStationText");
		const toStationText = document.getElementById("toStationText");
		updateMonitorInfo(fromStationText.value, toStationText.value, newDate);

		// 立即执行一次查询
		log(`日期已更新为 ${newDate}，正在刷新查询...`);
		validCheckTrainStart()(JSON.parse(localStorage.getItem("train_list")) || train_list);

		// 更新下次刷新时间
		updateNextRefreshTime();

		// 可选：如果你想重新加载整个页面，可以取消下面这行的注释
		// window.location.href = new URL(window.location.href).searchParams.set('date', newDate).toString();
	}

	// 更新监控信息
	function updateMonitorInfo(fromStation, toStation, date) {
		const infoDiv = document.getElementById("monitor-info");
		infoDiv.innerHTML = `
			<h3>监控信息</h3>
			<div style="display: grid; grid-template-columns: auto 1fr; gap: 8px;">
				<span style="color: #888;">出发站:</span>
				<span style="color: #fff;">${fromStation}</span>
				<span style="color: #888;">到达站:</span>
				<span style="color: #fff;">${toStation}</span>
				<span style="color: #888;">日期:</span>
				<span style="color: #fff;">${date}</span>
				<span style="color: #888;">刷新间隔:</span>
				<span style="color: #fff;">${DEFAULT_INTERVAL / 60000}分钟</span>
			</div>
		`;
	}

	// 更新列车列表
	function updateTrainList(trainList) {
		const listDiv = document.getElementById("train-list");
		listDiv.innerHTML = "<h3>监控车次</h3><div style='display: flex; flex-wrap: wrap; gap: 4px;'>";
		trainList.forEach(train => {
			listDiv.innerHTML += `<span class="train-tag">${train}</span>`;
		});
		listDiv.innerHTML += "</div>";
	}

	// 更新下次刷新时间
	function updateNextRefreshTime() {
		const nextRefreshDiv = document.getElementById("next-refresh");
		const nextRefreshTime = new Date(Date.now() + DEFAULT_INTERVAL);
		nextRefreshDiv.innerHTML = `
			<h3>下次刷新</h3>
			<div style="display: flex; align-items: center; gap: 8px;">
				<span style="color: #4CAF50;">${nextRefreshTime.toLocaleTimeString()}</span>
				<div style="flex-grow: 1; height: 2px; background: linear-gradient(to right, #4CAF50, transparent);"></div>
			</div>
		`;
	}

	// 优化日志显示
	function log(message, showTimestamp = true) {
		const logContainer = document.getElementById("log-container");
		if (!logContainer) {
			console.error("Log container not found");
			return;
		}

		const logEntry = document.createElement("div");
		logEntry.className = "log-entry";

		if (showTimestamp) {
			const timestamp = new Date().toLocaleTimeString();
			logEntry.innerHTML = `
				<span class="timestamp">[${timestamp}]</span>
				<span style="margin-left: 8px;">${message}</span>
			`;
		} else {
			logEntry.textContent = message;
		}

		// 添加新日志时的动画效果
		logEntry.style.opacity = "0";
		logEntry.style.transform = "translateY(-10px)";
		logContainer.insertBefore(logEntry, logContainer.firstChild);

		// 触发动画
		setTimeout(() => {
			logEntry.style.transition = "all 0.3s ease";
			logEntry.style.opacity = "1";
			logEntry.style.transform = "translateY(0)";
		}, 50);

		// 限制日志条目数量，保持最新的20条
		while (logContainer.children.length > 20) {
			logContainer.removeChild(logContainer.lastChild);
		}

		// 自动滚动到顶部
		logContainer.scrollTop = 0;

		console.log(message);
	}

	// 重置配置函数
	function resetConfig() {
		localStorage.removeItem("12306_first_visit");
		localStorage.removeItem("train def setup_web_channel_js(self");
		log("配置已重置，请刷新页面以应用更改。");
	}

	// 开始查询火车信息
	function startCheckTrain(trainList) {
		const queryTicket = document.getElementById("query_ticket");
		log("尝试刷新车次列表...");
		if (queryTicket) {
			queryTicket.click();
			log("刷新车次列表成功 ✅");
			setTimeout(() => {
				checkTrain(trainList);
			}, REFRESH_DELAY);
		} else {
			log("刷新车次列表失败,请检查后重试 ❌", true);
			sendMessage("12306刷新车次失败", "刷新车次列表失败,请检查后重试");
		}
		updateNextRefreshTime();
	}

	// 主函数
	function main(trainList) {
		createMonitorPanel();
		const fromStationText = document.getElementById("fromStationText");
		const toStationText = document.getElementById("toStationText");
		const trainDateInput = document.getElementById("train_date");

		if (fromStationText && toStationText && trainDateInput) {
			// 检查是否是首次访问或配置已重置
			if (!localStorage.getItem("12306_first_visit")) {
				createDateReminder();
				triggerDatePicker();
				localStorage.setItem("12306_first_visit", "true");

				// 保存初始配置
				localStorage.setItem("train_list", JSON.stringify(trainList));
				localStorage.setItem("train_date", trainDateInput.value);
			} else {
				// 从 localStorage 加载配置
				trainList = JSON.parse(localStorage.getItem("train_list")) || trainList;
				train_date = localStorage.getItem("train_date") || train_date;
				trainDateInput.value = train_date;
			}

			updateMonitorInfo(fromStationText.value, toStationText.value, trainDateInput.value);
			updateTrainList(trainList);
			log(`监控已启动,正在查询指定车次`, true);
			validCheckTrainStart()(trainList);
			intervalId = setInterval(() => {
				log(`定时刷新,重新查询车次`, true);
				validCheckTrainStart()(trainList);
			}, DEFAULT_INTERVAL);
		} else {
			log("获取车站信息失败,请检查页面是否正确加载", true);
		}
	}

	// 确保在页面加载完成后再执行脚本
	window.addEventListener('load', () => {
		main(train_list);
	});
})();
