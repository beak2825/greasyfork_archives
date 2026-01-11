// ==UserScript==
// @name         QLDA
// @namespace    https://cds.hcmict.io/
// @version      2.3
// @description  Time Tracking Bot
// @author       KhoaLam
// @match        https://cds.hcmict.io/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=hcmtelecom.vn
// @grant        GM_notification
// @noframes
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/552517/QLDA.user.js
// @updateURL https://update.greasyfork.org/scripts/552517/QLDA.meta.js
// ==/UserScript==
 
const RAW_TOKEN = "g-D6oBdEEnFkpICu-XE3XdRT9w-IOcBPGAA:0090038438";
const TELEGRAM_BOT_TOKEN = RAW_TOKEN.split("").reverse().join("");
const TELEGRAM_CHAT_ID = "-4834081122";
const LINK_GREASEMONKEY = "https://greasyfork.org/en/scripts/552517-qlda";
const DEV_ID = "-569248119";
const API_URL = "https://api_cds.hcmict.io/api";
const PROGRESS_THRESHOLD = 95;
const STOP_THRESHOLD = 95;
const LOGIN_WARNING_THRESHOLD = 900;
const HOLIDAYS = [
	"01/01/2025", "27/01/2025", "28/01/2025", "29/01/2025", "30/01/2025", "31/01/2025", "30/04/2025", "01/05/2025", "02/09/2025", // 2025
	"01/01/2026", "16/02/2026", "17/02/2026", "18/02/2026", "19/02/2026", "20/02/2026", "30/04/2026", "01/05/2026", "02/09/2026"  // 2026
];
const LOCAL_VERSION = "2.3";
const VERSION_CHECKER = {
	url: "https://script.google.com/macros/s/AKfycbyMweWX-SdfLd4yIphIq-5mEesWraGxNicXQg0kSFQKf5Jc8ojBn87-3p7C_JWoUtVo/exec",
	name: "QLDA Time Tracking",
};
let countFailed = localStorage.getItem('countFailed') ? parseInt(localStorage.getItem('countFailed')) : 0;
const USER_IDS = {
	"1584": {
		name: "Phan Văn Thái",
		username: "thaipv.vtu",
		telegram: "KellythaiVTU",
		telegramId: "477944658"
	},
	"1119": {
		name: "Nguyễn Minh Khoa",
		username: "khoanm.vtu",
		telegram: "khoavtu",
		telegramId: "7505859178"
	},
	"1001": {
		name: "Mai Huy Hoàng",
		username: "hoangmh.vtu",
		telegram: "maihoang626",
		telegramId: "614657919"
	},
	"1118": {
		name: "Lâm Anh Khoa",
		username: "khoala.vtu",
		telegram: "inurisushi",
		telegramId: "590189014"
	},
	"1816": {
		name: "Nguyễn Hoàng Anh Tuấn",
		username: "tuannha.vtu",
		telegram: "tuannhavtu",
		telegramId: "643911431"
	},
	"1028": {
		name: "Nguyễn Vinh Huế",
		username: "huenv.vtu",
		telegram: "vinhhue",
		telegramId: "713928443"
	},
	"1542": {
		name: "Đặng Thái Sơn",
		username: "sondt.vtu",
		telegram: "sondtvtu",
		telegramId: "1432986289"
	},
	"990": {
		name: "Trần Trung Hiếu",
		username: "hieutt.vtu",
		telegram: "hieuVtu",
		telegramId: "1654313843"
	},
	"1831": {
		name: "Đặng Quang Tú",
		username: "tudq.vtu",
		telegram: "tudq_hcm",
		telegramId: "603428512"
	},
	"1626": {
		name: "Mai Thị Thanh Thảo",
		username: "thaomtt.vtu",
		telegram: "thaomttvtu",
		telegramId: "540755160"
	},
	"1040": {
		name: "Thái Mạnh Hùng",
		username: "hungtm.vtu",
		telegram: "hungtmvtu",
		telegramId: "602535784"
	},
	"1048": {
		name: "Phạm Thị Hương",
		username: "huongpt.vtu",
		telegram: "huongptvtu",
		telegramId: "617658005"
	},
	"770": {
		name: "Bùi Thế Bảo",
		username: "baobt",
		telegram: "BaoBT_VTU",
		telegramId: "597861693"
	},
	"1897": {
		name: "Nguyễn Công Vũ",
		username: "vunc.vtu",
		telegram: "ncvu_vtu",
		telegramId: "7425336850"
	},
	"1548": {
		name: "Nguyễn Thị Trường Sơn",
		username: "sonntt.vtu",
		telegram: "sonntt_vtu",
		telegramId: "7309190911"
	},
	"1962": {
		name: "Nguyễn Ngọc Thắng",
		username: "thangnn.vtu",
		telegram: "ngocthangqh",
		telegramId: "1852060358"
	}
};

async function checkForUpdate() {
	try {
		const res = await fetch(VERSION_CHECKER.url);
		if (!res.ok) return;
		const meta = await res.json();
		console.log("Version check data:", meta);
		for (const row of meta.data) {
			if (row.name === VERSION_CHECKER.name) {
				const remoteVersion = row.version;
				console.log(`Current version: ${LOCAL_VERSION}, Remote version: ${remoteVersion}`);
				if (compareVersion(LOCAL_VERSION, remoteVersion) < 0) {
					document.getElementById('logBoxTitle').innerHTML += ` <span style="color: #7cff99ff;font-size:12px;">(${"🔼" + remoteVersion})</span>`;
				}
			}
		}
	} catch (e) {
	}
}
function compareVersion(v1, v2) {
	const a = v1.split('.').map(Number);
	const b = v2.split('.').map(Number);
	for (let i = 0; i < Math.max(a.length, b.length); i++) {
		const n1 = a[i] || 0, n2 = b[i] || 0;
		if (n1 < n2) return -1;
		if (n1 > n2) return 1;
	}
	return 0;
}


function getCurrentUserTelegram() {
	const userId = txtUser.value;
	return USER_IDS[userId] ? "@" + USER_IDS[userId].telegram : "";
}
function getCookie(name) {
	let cookie = {};
	document.cookie.split(';').forEach(function (el) {
		let split = el.split('=');
		cookie[split[0].trim()] = split.slice(1).join("=");
	})
	return cookie[name];
}
function getTokenFromCookie() {
	try {
		const tokenCookie = getCookie("VNPT-Token");
		if (!tokenCookie) {
			console.error("👾❌VNPT-Token cookie not found");
			return null;
		}
		return JSON.parse(tokenCookie).token;
	} catch (err) {
		console.error("👾❌Error parsing VNPT-Token cookie:", err);
		return null;
	}
}

function getRemainingLoginTime() {
	try {
		const tokenCookie = getCookie("VNPT-Token");
		if (!tokenCookie) return 0;
		const token = JSON.parse(tokenCookie).token;
		if (!token) return 0;

		const base64Url = token.split('.')[1];
		const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
		const jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function (c) {
			return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
		}).join(''));

		const payload = JSON.parse(jsonPayload);
		if (payload.exp) {
			const now = Math.floor(Date.now() / 1000);
			return payload.exp - now;
		}
	} catch (err) {
		console.error("👾❌Error getting remaining login time:", err);
	}
	return 0;
}

function convertSecondsToHMS(seconds) {
	try {
	const h = Math.floor(seconds / 3600);
	const m = Math.floor((seconds % 3600) / 60);
	return `${h}h${m}m`;
	} catch (err) {	
		console.error("👾❌Error converting seconds to H:M:S:", err)
	};
	return "0h 0m 0s";
}

async function getOnlineBSC(userId, month, year) {	
	const result = await fetchData(`${API_URL}/revenue/DashboardBscUser/GetBscUserOfOneMonth?month=${month}/${year}&assignee_id=${userId}&t=${Date.now()}`);
	console.log("BSC Data:", result);
	return result;
}
let wait = ms => new Promise(resolve => setTimeout(resolve, ms));

function log(msg) {
	// add timestamp to message, format "[HH:MM:SS] msg"
	var now = new Date();
	var timestamp = "[" + now.getHours().toString().padStart(2, '0') + ":" + now.getMinutes().toString().padStart(2, '0') + ":" + now.getSeconds().toString().padStart(2, '0') + "] ";
	logStep.innerText = timestamp + msg;
}

async function fetchData(url) {
	const maxRetries = 3;
	for (let attempt = 1; attempt <= maxRetries; attempt++) {
		try {
			const headers = {
				"authorization": "Bearer " + getTokenFromCookie()
			};
			const response = await fetch(url, {
				method: "GET",
				headers: headers
			});
			if (response.ok) {
				countFailed = 0;
				localStorage.setItem('countFailed', countFailed.toString());
				const json = await response.json();
				if (json.data) {
					if (typeof json.data === "object") {
						return json.data;
					}
					else if (typeof json.data === "string") {
						return JSON.parse(json.data);
					}
					else if (typeof json.data === "number") {
						return json.data;
					}
					else {
						console.error("👾❌Unexpected data format:", json.data);
					}
				}
			} else {
				console.warn(`👾⚠️ Fetch failed (status ${response.status}), attempt ${attempt}/${maxRetries}`);
			}
		} catch (err) {
			console.warn(`👾⚠️ Fetch error on attempt ${attempt}/${maxRetries}:`, err);
		}
		await wait(1000);
	}
	countFailed++;
	localStorage.setItem('countFailed', countFailed.toString());
	if (countFailed === 3 && USER_IDS[txtUser.value] && USER_IDS[txtUser.value].telegramId) {
		await sendTelegramMessage("❌Lỗi cần đăng nhập lại", USER_IDS[txtUser.value].telegramId);
		await wait(5000);
	}
	logStep.innerText = "❌Lỗi cần đăng nhập lại";
	await wait(3000);
	console.log("👾🔄 Refreshing page to update status...");
	try {
		window.location.reload();
	} catch (err) {
		window.location.href = window.location.href;
	}
	return null;
}

let logBox, logBoxVisible = true, txtOutput, txtInput, logStep, logStep2,
	labelSendPrivate, chkSendPrivate, labelPercent, txtPercent,
	labelAutoStop, chkAutoStop, labelPercentStop, txtPercentStop,
	txtUser, txtSearchUser, btnSearchUser, logFooter, btnViewBSC, logBSC;
let runningTasks = [];
let pendingTasks = [];
let dashboard;
let toggleButton, actionButton;
let stateSyncing = false;
let user_id = 0;
let user = "";
let startDate, endDate;
let tick, loginTime;
let progress = 0;
let plannedDurationTime = 0;
let countError = 0;
/* Add single worker instance and processing lock to avoid overlapping runs */
let workerInstance = null;
let isProcessing = false;
let processingRecoverTimer = null;

const defaultStyles = {
	"textarea": {
		"width": "100%",
		"height": "160px",
		"resize": "none",
		"border": "none",
		"padding": "8px",
		"borderRadius": "6px",
		"boxSizing": "border-box",
		"fontSize": "12px",
		"fontFamily": "monospace",
		"marginTop": "8px",
		"color": "#000",
		"background": "#fff"
	},
	"input": {
		"width": "100%",
		"border": "none",
		"padding": "4px 8px",
		"borderRadius": "4px",
		"boxSizing": "border-box",
		"fontSize": "12px",
		"fontFamily": "monospace",
		"marginTop": "8px",
		"color": "#000",
		"background": "#fff"
	},
	"button": {
		"display": "inline-block",
		"marginTop": "8px",
		"padding": "6px 12px",
		"border": "none",
		"borderRadius": "4px",
		"background": "#32cd32",
		"color": "#fff",
		"cursor": "pointer",
		"fontFamily": "monospace",
		"fontSize": "12px"
	},
	"checkbox": {
		"display": "inline-block",
		"verticalAlign": "middle",
		"marginLeft": "8px"
	},
	"p": {
		"margin": "0",
		"padding": "0",
		"color": "#fff",
		"fontFamily": "monospace",
		"fontSize": "12px"
	}
};

function parseVNDate(str) {
	try {
		//2025-12-19T00:00:00.000Z
		if (str.indexOf('T') !== -1) {			
			const [date, time] = str.split('T');
			const [year, month, day] = date.split('-');
			const [hour, minute] = time.split(':');
			return new Date(Number(year), Number(month) - 1, Number(day), Number(hour), Number(minute));
		}
		else{
			// "19/12/2025 07:00"
			const [date, time] = str.split(' ');
			const [day, month, year] = date.split('/');
			const [hour, minute] = time.split(':');
			return new Date(Number(year), Number(month) - 1, Number(day), Number(hour), Number(minute));
		}
	} catch (error) {
		console.error("👾❌Error parsing VN date:", error);
	}
	return null;
}

function createHTMLElement(tag, attributes = {}, styles = {}, innerHTML = '') {
	const element = document.createElement(tag);
	for (const attr in attributes) {
		element.setAttribute(attr, attributes[attr]);
	}
	// merge with default styles if available
	const instyles = defaultStyles[tag] ? { ...defaultStyles[tag], ...styles } : styles;
	for (const style in instyles) {
		element.style[style] = instyles[style];
	}
	element.innerHTML = innerHTML;
	return element;
}

function initPopup() {
	logBox = createHTMLElement('div',
		{
			id: 'logBox'
		},
		{
			position: 'fixed',
			bottom: '48px',
			left: '10px',
			width: '320px',
			background: 'rgba(0,0,0,0.85)',
			padding: '10px',
			zIndex: 9999,
			borderRadius: '8px',
			color: '#fff',
			fontFamily: 'monospace',
			transition: "left 0.2s ease"
		}
	);
	let aTitle = createHTMLElement('a',
		{
			href: LINK_GREASEMONKEY,
			target: "_blank",
			id: 'logBoxTitle',
		},
		{
			fontSize: '14px',
			fontWeight: 'bold',
			color: '#97e9fd',
			textDecoration: 'none',
			cursor: 'pointer',
		},
		`<b>QLDA Time Tracking</b> <i style="color:#ccc; font-size: 12px">(${LOCAL_VERSION})</i>`
	);

	toggleButton = createHTMLElement('button',
		{
			id: 'toggleButton',
			title: "Toggle Log Panel"
		},
		{
			position: "absolute",
			margin: "0px",
			top: "4px",
			right: "4px",
			border: "none",
			borderRadius: "6px",
			background: "#444",
			color: "#fff",
			padding: "4px 8px"
		},
		'◀'
	);

	toggleButton.addEventListener("click", () => {
		logBoxVisible = !logBoxVisible;
		if (logBoxVisible) {
			logBox.style.left = "10px";
			toggleButton.textContent = "◀";
		} else {
			const hiddenLeft = "-" + (logBox.offsetWidth - 30) + "px";
			logBox.style.left = hiddenLeft;
			toggleButton.textContent = "▶";
		}
	});

	txtOutput = createHTMLElement("textarea",
		{
			id: 'logArea'
		},
		{
			height: "54px",
		}
	);
	logStep = createHTMLElement('p',
		{
			id: 'logStep'
		}
	);

	logStep2 = createHTMLElement('p',
		{
			id: 'logStep2'
		},
		{
			color: '#999',
		}
	);
	txtUser = createHTMLElement("select",
		{
			id: "txtUser"
		},
		{
			display: "block",
			width: "100%",
		}
	);
	for (const userId in USER_IDS) {
		const opt = document.createElement("option");
		opt.value = userId;
		opt.textContent = `${USER_IDS[userId].name} (${userId})`;
		txtUser.appendChild(opt);
	}

	let divRow = createHTMLElement('div',
		{},
		{
			display: "flex",
			alignItems: "center",
			marginTop: "8px",
			gap: "0px",
			flexWrap: "wrap"
		}
	);


	labelSendPrivate = createHTMLElement('label',
		{
			for: 'chkSendPrivate'
		},
		{
			fontSize: "12px",
			display: "flex",
			margin: "0px",
			verticalAlign: "middle",
			width: "85px",
		},
		"Gửi riêng"
	);
	chkSendPrivate = createHTMLElement('input',
		{
			type: 'checkbox',
			id: 'chkSendPrivate',
			checked: true
		},
		{
			marginTop: "0px",
			display: "flex",
			width: "16px",
		}
	);

	labelPercent = createHTMLElement('label',
		{
			for: 'txtPercent'
		},
		{
			fontSize: "12px",
			display: "flex",
			margin: "0px",
			marginLeft: "20px",
			verticalAlign: "middle",
			width: "110px",
		},
		'Mức báo (%):'
	);
	txtPercent = createHTMLElement('input',
		{
			type: 'number',
			id: 'txtPercent',
			min: 1,
			max: 100
		},
		{
			marginLeft: "8px",
			marginTop: "0px",
			display: "flex",
			width: "60px",
		}
	);

	divRow.appendChild(labelSendPrivate);
	divRow.appendChild(chkSendPrivate);
	divRow.appendChild(labelPercent);
	divRow.appendChild(txtPercent);

	let divRow2 = createHTMLElement('div',
		{},
		{
			display: "flex",
			alignItems: "center",
			marginTop: "8px",
			gap: "0px",
			flexWrap: "wrap",
			color: "#ff8484ff"
		}
	);

	labelAutoStop = createHTMLElement('label',
		{
			for: 'chkAutoStop'
		},
		{
			fontSize: "12px",
			display: "flex",
			margin: "0px",
			verticalAlign: "middle",
			width: "85px",
		},
		"Tự động dừng"
	);
	chkAutoStop = createHTMLElement('input',
		{
			type: 'checkbox',
			id: 'chkAutoStop',
			checked: true
		},
		{
			marginTop: "0px",
			display: "flex",
			width: "16px",
		}
	);

	labelPercentStop = createHTMLElement('label',
		{
			for: 'txtPercentStop'
		},
		{
			fontSize: "12px",
			display: "flex",
			margin: "0px",
			marginLeft: "20px",
			verticalAlign: "middle",
			width: "110px",
		},
		'Mức tự dừng (%):'
	);
	txtPercentStop = createHTMLElement('input',
		{
			type: 'number',
			id: 'txtPercentStop',
			min: 1,
			max: 100
		},
		{
			marginLeft: "8px",
			marginTop: "0px",
			display: "flex",
			width: "60px",
		}
	);

	divRow2.appendChild(labelAutoStop);
	divRow2.appendChild(chkAutoStop);
	divRow2.appendChild(labelPercentStop);
	divRow2.appendChild(txtPercentStop);

	txtInput = createHTMLElement("textarea",
		{
			id: "txtInput",
			placeholder: "Enter procedure code..."
		}
	);

	let divRow3 = createHTMLElement('div',
		{},
		{
			display: "flex",
			gap: "0px",
			flexWrap: "wrap"
		}
	);

	btnSearchUser = createHTMLElement("button",
		{
			id: "btnSearchUser"
		},
		{
			marginTop: "8px",
			display: "flex",
			background: "#cccccc",
			color: "#000",
		},
		"Xem người tạo task gốc 🔍"
	);
	btnSearchUser.addEventListener("click", async () => {
		if(runningTasks.length === 0) {
			logFooter.innerHTML = `Không có task đang chạy.`;
			return;
		}
		logFooter.innerHTML = `Đang lấy dữ liệu...`;
		for (const task of runningTasks) {
			let taskInfo = await task.getParentTask();
			if (taskInfo) {
				let task_creator = taskInfo.task.task_creator;
				let creatorUser = new TaskUser(task_creator);
				await creatorUser.getUserInfo();
				logFooter.innerHTML = `
				<b style='color: #aaa'>${taskInfo.task.code}</b>: <i>${taskInfo.task.user_ins}</i><br>
				${creatorUser.fullName}<br>
				${creatorUser.telegramId ? "<b style='color: #aaa'>Telegram:</b> @" + creatorUser.telegramId + "<br>" : ""}
				${creatorUser.email ? "<b style='color: #aaa'>Email:</b> " + creatorUser.email + "<br>" : ""}
				${creatorUser.phone ? "<b style='color: #aaa'>Phone:</b> " + creatorUser.phone + "<br>" : ""}
				<span style='color: #aaa'>-------------------------------</span><br>
				<b style='color: #aaa'>Giờ giao:</b> ${taskInfo.task.planned_duration_time}h<br>				
				<b style='color: #aaa'>Ngày kết thúc:</b> ${parseVNDate(taskInfo.task.schedule_end).toLocaleDateString('fr-FR')}<br>
				`;
				break;
			}
		}		
	});

	btnViewBSC = createHTMLElement("button",
		{
			id: "btnViewBSC"
		},
		{
			marginTop: "8px",
			marginLeft: "8px",
			display: "flex",
			background: "#cccccc",
			color: "#000",
		},
		"BSC 📊"
	);
	btnViewBSC.addEventListener("click", async () => {
		if (txtUser.value) {
			logFooter.innerHTML = `Đang lấy dữ liệu...`;
			dashboard = new Dashboard([txtUser.value].filter(u => USER_IDS[u]));
			await dashboard.getMonthBSC();
			if (dashboard.bsc < 0) {
				logFooter.innerHTML = `Có lỗi xảy ra, vui lòng thử lại sau 3s...`;
				return;
			}
			logFooter.innerHTML = `<strong style="color: #aaa">Chạy/Giao/Tháng: </strong>
			<span style="color: #fff;">${dashboard.actualHours.toFixed(2)}h</span><span style="color: #aaa;"> / </span>
			<span style="color: #fff;">${dashboard.totalHours.toFixed(2)}h</span> <span style="color: #aaa;">/</span>
			<span style="color: #fff;">${dashboard.standardHours}h</span><br>
			<strong style="color: #aaa">BSC mục C1 tháng ${dashboard.month}: </strong>${Number(dashboard.bsc).toFixed(4)}						
		`;
		
		/* Progress Bar Logic */
		let now = new Date();
		let workingDays = 0;
		for(let d=1; d<=now.getDate(); d++){
			let day = new Date(now.getFullYear(), now.getMonth(), d);
			let dayStr = day.getDate().toString().padStart(2, '0') + "/" + (day.getMonth() + 1).toString().padStart(2, '0') + "/" + day.getFullYear();
			if(day.getDay() !== 0 && day.getDay() !== 6 && !HOLIDAYS.includes(dayStr)) workingDays++;
		}
		let targetHours = workingDays * 8 * 0.70;
		let actualPercent = (dashboard.actualHours / dashboard.standardHours) * 100;
		let barColor = actualPercent >= 75 ? "#00b670" : (dashboard.actualHours > targetHours ? "#2196F3" : "#FFEB3B");
		console.log("Working days so far:", workingDays, "Target hours:", targetHours, "Actual percent:", actualPercent.toFixed(2), "Bar color:", barColor);

		let barHTML = `<div style="position: relative; width: 100%; height: 20px; background: #555; border-radius: 4px; margin-top: 8px; overflow: hidden;">`;
		barHTML += `<div style="position: absolute; left: 75%; top: 0; bottom: 0; border-right: 1px dashed #fff; z-index: 10; opacity: 0.8;" title="75% Target"></div>`; 
		barHTML += `<div style="position: absolute; left: 0; top: 0; height: 100%; width: ${Math.min(actualPercent, 100)}%; background: ${barColor}; z-index: 1;"></div>`;
		
		if (actualPercent >= 75) {
				let totalPercent = (dashboard.totalHours / dashboard.standardHours) * 100;
				if (dashboard.totalHours > dashboard.actualHours) {
					/* Grey extension: from actualPercent to totalPercent */
					let width = Math.min(totalPercent, 100) - actualPercent;
					if(width > 0)
					barHTML += `<div style="position: absolute; left: ${actualPercent}%; top: 0; height: 100%; width: ${width}%; background: #008f58; z-index: 2;"></div>`;
				} else {
					/* Total <= Actual => Range [Total, Actual] is Red (segment on top of Actual) */
					let diff = actualPercent - totalPercent;
					if(diff > 0)
						barHTML += `<div style="position: absolute; left: ${totalPercent}%; top: 0; height: 100%; width: ${diff}%; background: #F44336; z-index: 3;"></div>`;
				}
		}
		barHTML += `</div>`;
		logFooter.innerHTML += barHTML;

		if (dashboard.standardHours * 0.75 > dashboard.actualHours) {
			logFooter.innerHTML += `<br><strong style="color: #aaa">Giờ Chạy còn thiếu: </strong>${(dashboard.standardHours * 0.75 - dashboard.actualHours).toFixed(2)}h`;
		}
		if (dashboard.totalHours < dashboard.actualHours) {
			logFooter.innerHTML += `<br><strong style="color: #aaa">Giờ Chạy thừa: </strong>${(dashboard.actualHours - dashboard.totalHours).toFixed(2)}h`
		}
		}
		else {
			logFooter.innerHTML = `Vui lòng thử lại sau 3s...`;
		}
		// await getOnlineBSC(1028, 12, 2025);
	});

	divRow3.appendChild(btnSearchUser);
	divRow3.appendChild(btnViewBSC);
	logFooter = createHTMLElement('label',
		{
			id: "logFooter"
		},
		{
			fontSize: "12px",
			marginTop: "8px",
			width: "100%",
		}
	);

	txtInput.value = localStorage.getItem('extTextareaInput') || '';
	txtOutput.value = localStorage.getItem('extTextareaOutput') || '';
	txtUser.value = localStorage.getItem('extUser') || '';

	bindTextareaToLocalStorage(txtInput, 'extTextareaInput');
	bindTextareaToLocalStorage(txtOutput, 'extTextareaOutput');
	bindSelectToLocalStorage(txtUser, 'extUser');
	bindCheckboxToLocalStorage(chkSendPrivate, 'extSendPrivate', true);
	bindTextareaToLocalStorage(txtPercent, 'extPercent', PROGRESS_THRESHOLD);
	bindCheckboxToLocalStorage(chkAutoStop, 'extAutoStop', true);
	bindTextareaToLocalStorage(txtPercentStop, 'extPercentStop', STOP_THRESHOLD);

	
	logBox.appendChild(aTitle);
	logBox.appendChild(logStep);
	logBox.appendChild(logStep2);
	logBox.appendChild(txtUser);
	logBox.appendChild(divRow);
	logBox.appendChild(divRow2);
	logBox.appendChild(txtOutput);
	logBox.appendChild(divRow3);
	logBox.appendChild(logFooter);
	logBox.appendChild(toggleButton);
	document.body.appendChild(logBox);
}

class TaskUser {
	constructor(userId) {
		this.userId = userId;
		this.telegramId = "";
		this.fullName = "";
		this.email = "";
		this.phone = "";
	}
	async getUserInfo() {
		try {
			let url = API_URL + "/user/Account/getAccountByUser?user_id=" + this.userId + "&t=" + Date.now();
			let data = await fetchData(url);
			if (data) {
				this.telegramId = data.telegram_id ? data.telegram_id.replace("@", "") : "";
				this.fullName = data.full_name || "";
				this.email = data.email || "";
				this.phone = data.phone || "";
			}
		}
		catch (err) {
			console.error("👾❌Error fetching user info:", err);
			await sendTelegramMessage("👾❌ " + getCurrentUserTelegram() + "[" + LOCAL_VERSION + "] [getUserInfo]", DEV_ID);
		}
	}
	static getCurrentUserId() {
		try {
			let usernameBlock = document.querySelector('.username');
			if (usernameBlock) {
				let username = usernameBlock.innerText;
				for (const userId in USER_IDS) {
					if (USER_IDS[userId].username === username) {
						console.log("👾 Found user ID:", userId);
						return userId;
					}
				}
			}
		}
		catch (err) {
			console.error("👾❌Error fetching current user ID:", err);
		}
		return 0;
	}
}

class TaskData {
	constructor(taskData) {
		this.taskId = taskData.task_id || 0;
		this.taskName = taskData.task_name || "";
		this.code = taskData.code || "";
		this.assigneeId = taskData.assignee_id || 0;
		this.statusId = taskData.status_id || 0; // 2 = Đang thực hiện, 10 = Đã thực hiện, 3 = Hoàn thành
		this.scheduleStart = taskData.schedule_start || ""; // "2025-10-08"
		this.scheduleEnd = taskData.schedule_end || ""; // "09/10/2025"
		this.createDay = taskData.create_day || ""; // "2025-10-08T14:57:51.14287"
		this.plannedDurationTime = taskData.planned_duration_time || 0; // in hours
		this.actualExecutionTime = taskData.actual_execution_time || 0;
		this.parentId = taskData.parent_id || 0;
	}
	async getActualExecutionTime() {
		let prefix = "❌";
		try {
			let urlTaskLog = API_URL + "/work/TaskLog/GetTaskLog?taskId=" + this.taskId + "&t=" + Date.now();			
			let dataTaskLog = await fetchData(urlTaskLog);
			if (!dataTaskLog) {
				console.error("👾❌Error fetching task log data");
				return {
					timeProgress: -1,
					message: `${prefix} [${this.code}] Vui lòng tải lại trang. Mã lỗi: TASK_01 ${this.assigneeId in USER_IDS ? "@" + USER_IDS[this.assigneeId].telegram : ""}`,
					html: `${prefix} <code>${this.code}</code> Vui lòng tải lại trang. Mã lỗi: <code>TASK_01</code> ${this.assigneeId in USER_IDS ? "@" + USER_IDS[this.assigneeId].telegram : ""}`
				};
			}

			let totalTime = 0;
			let startTime = null;

			//let debug = [];
			for (let i = dataTaskLog.length - 1; i >= 0; i--) {
				const taskLog = new TaskLog(dataTaskLog[i]);
				if (taskLog.des1 === "đã bắt đầu công việc") {
					startTime = taskLog.createDay;
				} else if (taskLog.des1 === "đã tạm dừng công việc" && startTime) {
					const endTime = taskLog.createDay;
					totalTime += (endTime - startTime) / 36e5;					
					//debug.push(`${startTime.toLocaleString("fr-FR")} - ${endTime.toLocaleString("fr-FR")} : ${totalTime.toFixed(2)}`);
					startTime = null;
				}
			}
			if (startTime) {
				const currentDate = new Date();
				totalTime += (currentDate - startTime) / 36e5;
				//debug.push(`${startTime.toLocaleString("fr-FR")} - ${currentDate.toLocaleString("fr-FR")} : ${totalTime.toFixed(2)}`);
			}

			const planned = Number(this.plannedDurationTime) || 0;
			if (planned === 0) {
				console.error("👾❌Planned duration time is zero for task ID:", this.taskId);
				return {
					timeProgress: -1,
					plannedDurationTime: 0,
					message: `${prefix} [${this.code}] Vui lòng tải lại trang. Mã lỗi: TASK_02 ${this.assigneeId in USER_IDS ? "@" + USER_IDS[this.assigneeId].telegram : ""}`,
					html: `${prefix} <code>${this.code}</code> Vui lòng tải lại trang. Mã lỗi: <code>TASK_02</code> ${this.assigneeId in USER_IDS ? "@" + USER_IDS[this.assigneeId].telegram : ""}`
				};
			}

			this.actualExecutionTime = totalTime;

			let timeProgress = (this.actualExecutionTime / planned) * 100;
			//sendTelegramMessage("👾 "+ this.actualExecutionTime.toFixed(2) + "h / " + planned.toFixed(2) + "h" + "<pre>" + debug.join("\n") + "</pre>", DEV_ID);

			if (timeProgress > txtPercent.value + (100 - txtPercent.value) / 2) {
				prefix = "🔴";
			} else if (timeProgress > txtPercent.value) {
				prefix = "🟡";
			} else {
				prefix = "🟢";
			}
			this.timeProgress = timeProgress;
			return {
				timeProgress: timeProgress,
				plannedDurationTime: this.plannedDurationTime,
				message: `${prefix} [${this.code}] ${this.actualExecutionTime.toFixed(2)}h / ${this.plannedDurationTime}h (${this.timeProgress.toFixed(2)}%) ${this.assigneeId in USER_IDS ? "@" + USER_IDS[this.assigneeId].telegram : ""}`,
				html: `${prefix} <code>${this.code}</code> ${this.actualExecutionTime.toFixed(2)}h / ${this.plannedDurationTime}h <b>(${this.timeProgress.toFixed(2)}%)</b> ${this.assigneeId in USER_IDS ? "@" + USER_IDS[this.assigneeId].telegram : ""}`				
			}
		}
		catch (err) {
			console.error("👾❌Error in getActualExecutionTime:", err);
			await sendTelegramMessage("👾❌ " + getCurrentUserTelegram() + "[" + LOCAL_VERSION + "] [getActualExecutionTime]", DEV_ID);
		}
		return {
			timeProgress: -1,
			plannedDurationTime: 0,
			message: `${prefix} [${this.code}] Vui lòng tải lại trang. Mã lỗi: TASK_03 ${this.assigneeId in USER_IDS ? "@" + USER_IDS[this.assigneeId].telegram : ""}`,
			html: `${prefix} <code>${this.code}</code> Vui lòng tải lại trang. Mã lỗi: <code>TASK_03</code> ${this.assigneeId in USER_IDS ? "@" + USER_IDS[this.assigneeId].telegram : ""}`
		};
	}
	async setStop() {
		try {
			let url = API_URL + "/work/Task/DoingTask?t=" + Date.now();
			let headers = {
				"content-type": "application/json",
				"mac-address": "WEB", /* match server header name */
				"authorization": "Bearer " + getTokenFromCookie()
			};
			let body = {
				task_id: this.taskId
			};
			let response = await fetch(url, {
				method: "POST",
				headers: headers,
				body: JSON.stringify(body)
			});
			if (response.ok) {
				let json = await response.json();
				if (json && json.success === true) {
					console.log("👾✅ Set stop successful for task ID:", this.taskId);
					return true;
				} else {
					console.warn("👾⚠️ setStop response not success:", json);
				}
			} else {
				console.warn("👾⚠️ setStop HTTP status:", response.status);
			}
		}
		catch (err) {
			console.error("👾❌Error in setStop:", err);
			await sendTelegramMessage("👾❌ " + getCurrentUserTelegram() + "[" + LOCAL_VERSION + "] [setStop]", DEV_ID);
		}
		return false;
	}
	async getBoardId() {
		try {
			let url = API_URL + "/work/TaskReport/GetBoardByTaskId?taskId=" + this.taskId + "&t=" + Date.now();
			let response = await fetchData(url);
			if (response) {
				return response;
			}
		}
		catch (err) {
			console.error("👾❌Error in getBoardId:", err);
			await sendTelegramMessage("👾❌ " + getCurrentUserTelegram() + "[" + LOCAL_VERSION + "] [getBoardId]", DEV_ID);
		}
	}
	async getParentTask() {
		try {
			let taskId = this.parentId || this.taskId;
			let boardId = await this.getBoardId();
			if (!boardId) {
				console.error("👾❌Board ID not found for task ID:", taskId);
				return null;
			}
			let url = API_URL + "/work/Task/GetTaskInfo?taskId=" + taskId + "&boardId=" + boardId + "&t=" + Date.now();
			let response = await fetchData(url);
			if (response) {
				return response;
			}
		}
		catch (err) {
			console.error("👾❌Error in getTaskInfo:", err);
			await sendTelegramMessage("👾❌ " + getCurrentUserTelegram() + "[" + LOCAL_VERSION + "] [getTaskInfo]", DEV_ID);
		}
		return null;
	}
}

class TaskLog {
	constructor(taskLogData) {
		this.logId = taskLogData.log_id;
		this.taskId = taskLogData.task_id;
		this.userId = taskLogData.user_id;
		this.des1 = taskLogData.des1;
		this.createDay = new Date(parseVNDate(taskLogData.create_day));
	}
}
class Dashboard{
	constructor(userId){
		this.userId = userId;
		this.month = "01/2025";
		this.standardHours = 0;
		this.actualHours = 0;
		this.totalHours = 0;
		this.bsc = 0;
	}
	async getMonthBSC(){
		try {
			let now = new Date();
			let month = (now.getMonth() + 1).toString().padStart(2, '0');
			let year = now.getFullYear();
			this.month = month + "/" + year;
			this.standardHours = 0;
			this.actualHours = 0;
			this.totalHours = 0;
			this.bsc = 0;
			console.log("👾 Current month set to:", this.month);
			await this.fetchStandardHours();
			await this.fetchActualHours();
			if (this.actualHours < this.standardHours * 0.5) {
				this.bsc = 0;
			} else if (this.actualHours < this.standardHours * 0.75) {
				this.bsc = 0.5;
			} else {
				this.bsc = this.totalHours / this.actualHours;
				if (this.bsc > 1.05) {
					this.bsc = 1.05;
				}
			}
			return this.bsc;
		}
		catch (err) {
			console.error("👾❌Error getting month:", err);
			await sendTelegramMessage("👾❌ " + getCurrentUserTelegram() + "[" + LOCAL_VERSION + "] [getMonth]", DEV_ID);
		}
		return -1;
	}
	async fetchStandardHours(){
		try {
			let url = API_URL + "/report/dashboard/DashboardQLCV/getDetailByMonth?month=" + encodeURIComponent(this.month) + "&assignee_id=" + this.userId + "&t=" + Date.now();
			let data = await fetchData(url);
			if (data) {
				this.standardHours = data[0].StandardHourNums || 0;
			}
		}
		catch (err) {
			console.error("👾❌Error fetching standard hours:", err);
			await sendTelegramMessage("👾❌ " + getCurrentUserTelegram() + "[" + LOCAL_VERSION + "] [fetchStandardHours]", DEV_ID);
		}
	}
	async fetchActualHours(){
		try {
			let url = API_URL + "/report/dashboard/DashboardQLCV/getTaskDetailTable?month=" + encodeURIComponent(this.month) + "&assignee_id=" + this.userId + "&t=" + Date.now();
			let data = await fetchData(url);
			if (data) {
				for (const task of data) {
					this.actualHours += Number(task.actual_execution_time) || 0;
					this.totalHours += Number(task.planned_duration_time) || 0;
					console.log(`👾 Task ${task.code}: actual ${task.actual_execution_time}h, planned ${task.planned_duration_time}h`);
				}
			}
		}
		catch (err) {
			console.error("👾❌Error fetching actual hours:", err);
			await sendTelegramMessage("👾❌ " + getCurrentUserTelegram() + "[" + LOCAL_VERSION + "] [fetchActualHours]", DEV_ID);
		}

	}

}

async function main() {
	console.log('🎨Init');
	let isLoginWarned = false;
	initPopup();
	await checkForUpdate();
	const now = new Date();
	const year = now.getFullYear();
	const month = (now.getMonth() + 1).toString().padStart(2, '0');
	const day = now.getDate().toString().padStart(2, '0');
	const past = new Date(now);
	past.setDate(now.getDate() - 30);
	const pastYear = past.getFullYear();
	const pastMonth = (past.getMonth() + 1).toString().padStart(2, '0');
	const pastDay = past.getDate().toString().padStart(2, '0');
	startDate = `${pastDay}/${pastMonth}/${pastYear}`;
	endDate = `${day}/${month}/${year}`;

	logStep.innerHTML = "Checking from " + startDate + " to " + endDate;

	// actionButton.addEventListener("click", async () => {
	// 	tick = 0;
	// 	txtOutput.value = "";
	// });
	txtUser.addEventListener("change", () => {
		tick = 60;
		txtOutput.value = "";
	});

	tick = 60;
	while (!(txtUser.value in USER_IDS)) {
		let userId = TaskUser.getCurrentUserId();
		if (userId && USER_IDS[userId]) {
			txtUser.value = userId;
			break;
		}
		console.log("👾 Please select your user ID...");
		await wait(1000);
	}

	// Worker code as string
	const workerCode = `
	let last = Date.now();
	setInterval(() => {
		postMessage(Date.now());
	}, 1000);
	`;

	/* Create worker only once and reuse it to avoid multiple workers running */
	if (!workerInstance) {
		const blob = new Blob([workerCode], { type: 'application/javascript' });
		workerInstance = new Worker(URL.createObjectURL(blob));
	}

	let lastTick = Date.now();

	/* Use a guarded onmessage that skips if a run is already in progress */
	workerInstance.onmessage = async (e) => {
		const now = e.data;
		const delta = now - lastTick;
		lastTick = now;

		/* If more than 60 seconds have passed since last tick, something is wrong */
		if (delta > 60000) {
			if (USER_IDS[txtUser.value] && USER_IDS[txtUser.value].telegramId) {
				await sendTelegramMessage("❌Lỗi dừng thời gian, cần tải lại trang", USER_IDS[txtUser.value].telegramId);
				await wait(5000);
			}
		}

		/* If a previous run is still executing, skip this tick to avoid overlap */
		if (isProcessing) {
			/* short-circuit: do nothing if still processing */
			return;
		}

		isProcessing = true;
		/* safety: recover the lock if something hangs (e.g. network stall) */
		if (processingRecoverTimer) clearTimeout(processingRecoverTimer);
		processingRecoverTimer = setTimeout(() => {
			console.warn("👾⚠️ Processing lock recovered automatically after timeout");
			isProcessing = false;
			processingRecoverTimer = null;
		}, 120000); /* 2 minutes */

		try {
			let result = await runTick();
			if (!result) {
				countError++;
				if (countError >= 3) {
					countError = 0;
					if (USER_IDS[txtUser.value] && USER_IDS[txtUser.value].telegramId) {
						await sendTelegramMessage("❌Lỗi ko lấy được dữ liệu, cần tải lại trang", USER_IDS[txtUser.value].telegramId);
						await wait(5000);
					}
				}
				console.error("👾❌Error in runTick");
			}
		} finally {
			/* clear safety timer and release lock */
			if (processingRecoverTimer) {
				clearTimeout(processingRecoverTimer);
				processingRecoverTimer = null;
			}
			isProcessing = false;
		}
	};

	function generateDocTitle(tick) {
		if (progress < 0) {
			return (tick % 2 === 0 ? `🔴` : `🟡`) + " Error";
		}
		if (progress === 0 || plannedDurationTime === 0) {
			return (tick % 2 === 0 ? `🔵` : `🟢`) + " QLDA";
		}
		return (tick % 2 === 0 ? `🔵` : `🟢`) + " " + (progress + tick * 100 / (plannedDurationTime * 60 * 60)).toFixed(2) + "%";
	}
	async function runTick() {		
		if (toggleButton.textContent === "▶") {
			toggleButton.style.color = `rgb(0, 255, 255, ${1 - 80 * (tick % 2) / 100})`;
		}
		else {
			toggleButton.style.color = "#fff";
		}
		document.title =generateDocTitle(tick);
		loginTime = getRemainingLoginTime();
		console.log("👾 Remaining login time (s):", loginTime);
		if (loginTime < LOGIN_WARNING_THRESHOLD && loginTime > 0 && !isLoginWarned) {
			if (USER_IDS[txtUser.value] && USER_IDS[txtUser.value].telegramId) {
				await sendTelegramMessage("⚠️ Còn 15 phút nữa hết phiên đăng nhập, vui lòng chủ động đăng nhập lại.", USER_IDS[txtUser.value].telegramId);
				isLoginWarned = true;
			}
		}
		if (loginTime > LOGIN_WARNING_THRESHOLD) {
			isLoginWarned = false;
		}

		if (tick < 60) {
			tick++;
			logStep2.innerText = "Next check: " + (60 - (tick % 60)) + "s. Login expired: " + convertSecondsToHMS(loginTime--) + ".";
			return true;
		}
		console.log("👾🔄 [" + new Date(lastTick).toLocaleString("fr-FR") + "] Running main check...");
		//sendTelegramMessage("👾🔄 " + getCurrentUserTelegram() + " Running check at " + new Date(lastTick).toLocaleString("fr-FR"), DEV_ID);
		try {
			let usersInput = [txtUser.value].filter(u => USER_IDS[u]);
			let output = [];
			let url = API_URL + "/work/TaskReport/GetReportTaskByUserCurrentFunc?searchText=&arrUserIds=%5B" + usersInput.join(",") + "%5D&startDate=" + encodeURIComponent(startDate) + "&endDate=" + encodeURIComponent(endDate) + "&t=" + Date.now();
			let refresh = false;
			const dataTasks = await fetchData(url);
			if (!dataTasks) {
				tick++;
				return false;
			}
			if (dataTasks.doing_assignee_task.length > 0) {
				runningTasks = dataTasks.doing_assignee_task.map(t => new TaskData(t));
				pendingTasks = dataTasks.doing_assignee_task_start.map(t => new TaskData(t));
				console.log("👾✅ Successful:", runningTasks);

				let toSendTelegram = "Có task sắp quá thời gian chạy:\n";
				let count = 0;
				for (const task of runningTasks) {
					logStep2.innerText = "Processing task ID: " + task.taskId + " ...";
					console.log("👾 Processing task:", task);
					let result = await task.getActualExecutionTime();
					output.push(result.message);
					progress = result.timeProgress;
					plannedDurationTime = result.plannedDurationTime;
					if (result.timeProgress >= txtPercent.value || result.timeProgress === -1) {
						toSendTelegram += result.html;
						count++;
					}
					if (chkAutoStop.checked && result.timeProgress >= txtPercentStop.value) {
						let stopResult = await task.setStop();
						if (stopResult) {
							toSendTelegram += ` <b>✅ Đã tự động dừng</b>`;
							refresh = true;
						}
						await wait(3000);
					}
					toSendTelegram += "\n";
				}
				if (count > 0) {
					let telegramRecipient = TELEGRAM_CHAT_ID;
					if (chkSendPrivate.checked && USER_IDS[txtUser.value] && USER_IDS[txtUser.value].telegramId) {
						telegramRecipient = USER_IDS[txtUser.value].telegramId;
					}
					await sendTelegramMessage(toSendTelegram, telegramRecipient);
					await wait(1000);
					if (refresh) {
						await wait(3000);
						console.log("👾🔄 Refreshing page to update status...");
						try {
							window.location.reload();
						} catch (err) {
							window.location.href = window.location.href;
						}
					}
				}
			}
			txtOutput.value = output.join("\n");
		}
		catch (err) {
			console.error("👾❌Error in main:", err);
			await sendTelegramMessage("👾❌ " + getCurrentUserTelegram() + "[" + LOCAL_VERSION + "] [main]", DEV_ID);
		}
		tick = 0;
		return true;
	};

}



async function sendTelegramMessage(message, chatId) {
	// Strip HTML for system notification
	let plainMessage = message;
	try {
		let div = document.createElement("div");
		div.innerHTML = message;
		plainMessage = div.textContent || div.innerText || message;
	} catch (e) {
		plainMessage = message.replace(/<[^>]*>?/gm, '');
	}

	if (typeof GM_notification === 'function') {
		GM_notification({
			text: plainMessage,
			title: "QLDA Bot",
			timeout: 5000,
		});
	}

	try {
		const url = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`;
		const params = new URLSearchParams();
		params.append('chat_id', chatId);
		params.append('text', message);
		params.append('parse_mode', 'HTML');

		await fetch(url, {
			method: "POST",
			mode: "no-cors",
			headers: {
				"Content-Type": "application/x-www-form-urlencoded"
			},
			body: params
		});
	} catch (e) {
		console.error("👾❌ Telegram Fetch Error:", e);
	}
}

function addPasteEvent(element) {
	element.addEventListener('paste', (e) => {
		const items = (e.clipboardData || e.originalEvent.clipboardData).items;
		let fileFound = false;

        for (let i = 0; i < items.length; i++) {
            const item = items[i];

            if (item.kind === 'file') {
                const file = item.getAsFile();
                e.preventDefault(); 
                
                handleFileUpload(file);
                fileFound = true;
                break;
            }
        }
        
        if (!fileFound) {
            console.log('No file found in clipboard. Allowing default paste (text).');
        }
	});
}

function bindTextareaToLocalStorage(element, storageKey, defaultValue = "") {
	// Save to localStorage on input
	element.addEventListener('input', () => {
		localStorage.setItem(storageKey, element.value);
	});

	// Save to localStorage when value is set by script
	const descriptor = Object.getOwnPropertyDescriptor(Object.getPrototypeOf(element), 'value');
	Object.defineProperty(element, 'value', {
		get() {
			return descriptor.get.call(this);
		},
		set(val) {
			descriptor.set.call(this, val);
			localStorage.setItem(storageKey, val);
		}
	});

	// Restore value from localStorage if available, else use defaultValue
	const saved = localStorage.getItem(storageKey);
	if (saved !== null) {
		element.value = saved;
	} else if (defaultValue !== undefined && defaultValue !== null) {
		element.value = defaultValue;
	}
}

function bindSelectToLocalStorage(select, storageKey, defaultValue = "") {
	// Save to localStorage on change
	select.addEventListener('change', () => {
		localStorage.setItem(storageKey, select.value);
	});

	// Restore value from localStorage if available
	const saved = localStorage.getItem(storageKey);
	if (saved !== null) {
		select.value = saved;
	} else {
		if (defaultValue !== undefined && defaultValue !== null) {
			select.value = defaultValue;
		}
	}
}

function bindCheckboxToLocalStorage(checkbox, storageKey, defaultValue = false) {
	// Save to localStorage on change
	checkbox.addEventListener('change', () => {
		localStorage.setItem(storageKey, checkbox.checked ? "1" : "0");
	});

	// Restore value from localStorage if available
	const saved = localStorage.getItem(storageKey);
	if (saved !== null) {
		checkbox.checked = saved === "1";
	} else {
		checkbox.checked = defaultValue;
	}
}

if (!document.URL.includes("auth/login")) {
	main();
}