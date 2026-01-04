// ==UserScript==
// @name         阿里国际站直播助手（树洞先生）
// @version      1.0
// @description  核心功能：直播倒计时、自动名片、自动回复、语音提醒与播报、自动关播
// @author       树洞先生
// @license      MIT
// @match        https://content.alibaba.com/live/live-detail.htm*
// @run-at       document-end
// @grant        none
// @namespace https://greasyfork.org/users/1485135
// @downloadURL https://update.greasyfork.org/scripts/549238/%E9%98%BF%E9%87%8C%E5%9B%BD%E9%99%85%E7%AB%99%E7%9B%B4%E6%92%AD%E5%8A%A9%E6%89%8B%EF%BC%88%E6%A0%91%E6%B4%9E%E5%85%88%E7%94%9F%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/549238/%E9%98%BF%E9%87%8C%E5%9B%BD%E9%99%85%E7%AB%99%E7%9B%B4%E6%92%AD%E5%8A%A9%E6%89%8B%EF%BC%88%E6%A0%91%E6%B4%9E%E5%85%88%E7%94%9F%EF%BC%89.meta.js
// ==/UserScript==

(function () {
	'use strict';

	// ------------- 持久化工具 -------------
	const LS = {
		get(key, d=null){ try { return JSON.parse(localStorage.getItem(key)); } catch(e){ return localStorage.getItem(key) ?? d; } },
		set(key, val){ localStorage.setItem(key, typeof val === 'string' ? val : JSON.stringify(val)); },
		del(key){ localStorage.removeItem(key); }
	};
	// keys 与原扩展保持一致
	const K = {
		isRobotOn: 'isRobotOn',
		startLiveTime: 'startLiveTime',
		endLiveTime: 'endLiveTime',
		currentLive_URL: 'currentLive_URL',
		currentLive_ID: 'currentLive_ID', 
		isAutoSendCard: 'isAutoSendCard',
		isAutoCloseLive: 'isAutoCloseLive',
		isNoticeCommit: 'isNoticeCommit',
		isWelcomeVoice: 'isWelcomeVoice',
		isAutoComment: 'isAutoComment',
		isPlayCommentVoice: 'isPlayCommentVoice'
	};

	// ------------- 全局运行态 -------------
	let countdownTimer = null;
	let observeComments = null;
	let observeInto = null;
	let isDragging = false;
	let dragStartX = 0, dragStartY = 0, startLeft = 0, startTop = 0;

	// ------------- DOM/查询帮助 -------------
	function $(sel, root=document){ return root.querySelector(sel); }
	function $shadowRoot(){ return $("#__qiankun_microapp_wrapper_for_live_interactive_micro_app__")?.shadowRoot || null; }
	function nowFmt(ts=Date.now()){
		const d = new Date(ts);
		const p = n => (n<10?'0'+n:n);
		return `${d.getFullYear()}-${p(d.getMonth()+1)}-${p(d.getDate())} ${p(d.getHours())}:${p(d.getMinutes())}:${p(d.getSeconds())}`;
	}
	async function sleep(ms){ return new Promise(r => setTimeout(r, ms)); }

	// ------------- 语音与提示音 -------------
	function playBeep(){
		let a = $('#tm-myAudio');
		if(!a){
			a = document.createElement('audio');
			a.id = 'tm-myAudio';
			a.src = 'https://rfq-tuchuang.oss-cn-hangzhou.aliyuncs.com/voice.ogg';
			document.body.appendChild(a);
		}
		a.play().catch(()=>{});
	}
	function speak(text){
		try{
			if(!text) return;
			const u = new SpeechSynthesisUtterance(text);
			u.rate = 1;
			u.pitch = 1;
			u.lang = 'en-US'; // 如需中文可改为 zh-CN
			window.speechSynthesis.speak(u);
		}catch(e){}
	}

	// ------------- 智能回复（关键词匹配） -------------
	let smartReplyRules = [
		{
			keywords: ['price','how much','报价','价格','cost','best price','报价多少'],
			reply: 'Thanks for your interest. Please tell me your quantity and destination country, I will quote the best price quickly.'
		},
		{
			keywords: ['moq','minimum','起订量','最小起订','起订'],
			reply: 'Our MOQ is flexible. What quantity do you plan to order for the first trial?'
		},
		{
			keywords: ['sample','样品','free sample','样板','打样'],
			reply: 'Samples are available. Could you share your address and express account, or we can quote the freight for you.'
		},
		{
			keywords: ['shipping','ship','运费','发货','运输','物流','delivery'],
			reply: 'We can ship by sea, air or express. Please tell me your destination city to check the shipping cost and time.'
		},
		{
			keywords: ['lead time','交期','生产时间','delivery time','多久','when'],
			reply: 'Regular lead time is 7-15 days depending on quantity. What quantity do you need?'
		},
		{
			keywords: ['custom','定制','logo','oem','odm','尺寸','颜色'],
			reply: 'OEM/ODM is supported. Please send your logo/file or requirements, we will make a solution and quote soon.'
		},
		{
			keywords: ['payment','付款','支付','terms','方式','paypal','tt','信用证','lc'],
			reply: 'Payment terms are flexible (T/T, PayPal, etc.). Which method do you prefer?'
		},
		{
			keywords: ['catalog','目录','产品册','brochure','catalogue'],
			reply: 'I can send you our latest catalog. May I have your email or WhatsApp?'
		},
		{
			keywords: ['warranty','保修','售后','质保'],
			reply: 'We provide reliable quality and warranty service. What usage scenario do you have? I will recommend suitable models.'
		}
	];

	// 加载保存的规则
	function loadSmartReplyRules() {
		const savedRules = LS.get('smartReplyRules');
		if (savedRules && Array.isArray(savedRules)) {
			smartReplyRules = savedRules;
		}
	}

	// 保存规则到本地存储
	function saveSmartReplyRules() {
		LS.set('smartReplyRules', smartReplyRules);
	}

	function getSmartReplyByText(commentText){
		const text = (commentText || '').toLowerCase();
		
		for(const rule of smartReplyRules){
			if(rule.keywords.some(k => text.includes(k))){
				return rule.reply;
			}
		}
		// 默认回复
		return 'Thanks for your message. Our sales will reply with details shortly. Could you tell me your quantity and destination country?';
	}

	// 导出Excel格式的智能回复模板
	function exportSmartReplyTemplate() {
		// 创建CSV内容（Excel可以打开）
		let csvContent = "关键词,回复内容\n";
		smartReplyRules.forEach(rule => {
			const keywords = rule.keywords.join(';');
			const reply = rule.reply.replace(/"/g, '""'); // 转义双引号
			csvContent += `"${keywords}","${reply}"\n`;
		});

		// 创建下载链接
		const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
		const link = document.createElement('a');
		const url = URL.createObjectURL(blob);
		link.setAttribute('href', url);
		link.setAttribute('download', '智能回复模板.csv');
		link.style.visibility = 'hidden';
		document.body.appendChild(link);
		link.click();
		document.body.removeChild(link);
	}

	// 导入Excel格式的智能回复模板
	function importSmartReplyTemplate() {
		const input = document.createElement('input');
		input.type = 'file';
		input.accept = '.csv,.xlsx,.xls';
		input.onchange = function(e) {
			const file = e.target.files[0];
			if (file) {
				const reader = new FileReader();
				reader.onload = function(e) {
					try {
						const content = e.target.result;
						// 简单的CSV解析
						const lines = content.split('\n');
						const newRules = [];
						
						for (let i = 1; i < lines.length; i++) { // 跳过标题行
							const line = lines[i].trim();
							if (line) {
								// 简单的CSV解析，处理引号内的逗号
								const parts = [];
								let current = '';
								let inQuotes = false;
								
								for (let j = 0; j < line.length; j++) {
									const char = line[j];
									if (char === '"') {
										inQuotes = !inQuotes;
									} else if (char === ',' && !inQuotes) {
										parts.push(current.trim());
										current = '';
									} else {
										current += char;
									}
								}
								parts.push(current.trim());
								
								if (parts.length >= 2) {
									const keywords = parts[0].split(';').map(k => k.trim()).filter(k => k);
									const reply = parts[1].replace(/^"|"$/g, ''); // 移除首尾引号
									
									if (keywords.length > 0 && reply) {
										newRules.push({ keywords, reply });
									}
								}
							}
						}
						
						if (newRules.length > 0) {
							smartReplyRules = newRules;
							saveSmartReplyRules();
							alert(`成功导入 ${newRules.length} 条智能回复规则！`);
						} else {
							alert('导入失败：文件格式不正确或没有有效数据');
						}
					} catch (error) {
						alert('导入失败：' + error.message);
					}
				};
				reader.readAsText(file);
			}
		};
		input.click();
	}

	// 显示智能回复模板管理界面
	function showSmartReplyManager() {
		const modal = document.createElement('div');
		modal.style.cssText = `
			position: fixed;
			top: 0;
			left: 0;
			width: 100%;
			height: 100%;
			background: rgba(0,0,0,0.5);
			z-index: 1000000;
			display: flex;
			align-items: center;
			justify-content: center;
		`;

		const content = document.createElement('div');
		content.style.cssText = `
			background: white;
			border-radius: 8px;
			padding: 20px;
			max-width: 800px;
			max-height: 80vh;
			overflow-y: auto;
			position: relative;
		`;

		content.innerHTML = `
			<div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
				<h3 style="margin: 0;">智能回复模板管理</h3>
				<button id="close-modal" style="background: none; border: none; font-size: 20px; cursor: pointer;">×</button>
			</div>
			
			<div style="background: #fff3cd; padding: 15px; border-radius: 5px; margin-bottom: 20px;">
				<div style="display: flex; gap: 10px; align-items: center;">
					<button id="add-rule" style="background: #007bff; color: white; border: none; padding: 8px 16px; border-radius: 4px; cursor: pointer;">+ 添加规则</button>
					<button id="export-template" style="background: #28a745; color: white; border: none; padding: 8px 16px; border-radius: 4px; cursor: pointer;">📤 导出模板</button>
					<button id="import-template" style="background: #ffc107; color: black; border: none; padding: 8px 16px; border-radius: 4px; cursor: pointer;">📥 导入模板</button>
				</div>
			</div>
			
			<div style="overflow-x: auto;">
				<table style="width: 100%; border-collapse: collapse; border: 1px solid #ddd;">
					<thead>
						<tr style="background: #f8f9fa;">
							<th style="border: 1px solid #ddd; padding: 10px; text-align: left;">关键词</th>
							<th style="border: 1px solid #ddd; padding: 10px; text-align: left;">回复内容</th>
							<th style="border: 1px solid #ddd; padding: 10px; text-align: center;">操作</th>
						</tr>
					</thead>
					<tbody id="rules-table-body">
						${smartReplyRules.map((rule, index) => `
							<tr>
								<td style="border: 1px solid #ddd; padding: 10px;">
									<input type="text" value="${rule.keywords.join(';')}" style="width: 100%; border: 1px solid #ddd; padding: 5px;" onchange="updateRule(${index}, 'keywords', this.value)">
								</td>
								<td style="border: 1px solid #ddd; padding: 10px;">
									<textarea style="width: 100%; border: 1px solid #ddd; padding: 5px; height: 60px; resize: vertical;" onchange="updateRule(${index}, 'reply', this.value)">${rule.reply}</textarea>
								</td>
								<td style="border: 1px solid #ddd; padding: 10px; text-align: center;">
									<button onclick="deleteRule(${index})" style="background: #dc3545; color: white; border: none; padding: 5px 10px; border-radius: 3px; cursor: pointer;">删除</button>
								</td>
							</tr>
						`).join('')}
					</tbody>
				</table>
			</div>
		`;

		modal.appendChild(content);
		document.body.appendChild(modal);

		// 绑定事件
		document.getElementById('close-modal').onclick = () => {
			document.body.removeChild(modal);
		};

		document.getElementById('add-rule').onclick = () => {
			smartReplyRules.push({
				keywords: ['新关键词'],
				reply: '新回复内容'
			});
			saveSmartReplyRules();
			showSmartReplyManager(); // 刷新界面
		};

		document.getElementById('export-template').onclick = exportSmartReplyTemplate;
		document.getElementById('import-template').onclick = importSmartReplyTemplate;

		// 添加全局函数
		window.updateRule = function(index, field, value) {
			if (field === 'keywords') {
				smartReplyRules[index].keywords = value.split(';').map(k => k.trim()).filter(k => k);
			} else {
				smartReplyRules[index][field] = value;
			}
			saveSmartReplyRules();
		};

		window.deleteRule = function(index) {
			if (confirm('确定要删除这条规则吗？')) {
				smartReplyRules.splice(index, 1);
				saveSmartReplyRules();
				showSmartReplyManager(); // 刷新界面
			}
		};
	}

	// ------------- 面板 UI -------------
	function createPanel(){
		if($('#bp_start')) return;
		const div = document.createElement('div');
		div.id = 'bp_start';
		div.style = 'position:fixed;z-index:999999;left:50%;top:50%;transform:translate(-50%, -50%) translateX(-20%);background:#87CEEB;color:#000;border:2px solid #4682B4;border-radius:8px;font-family:Arial,Helvetica,sans-serif;user-select:none;';
		div.innerHTML = `
<div class="bp-start" style="width:300px;padding:12px 12px 8px 12px;cursor:move;position:relative;">
	<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px;">
		<div class="bp-title" style="font-weight:bold;">国际站直播小助手（树洞先生）</div>
		<button id="tm-close" style="background:none;border:none;color:#000;font-size:18px;cursor:pointer;padding:0;width:24px;height:24px;line-height:1;">×</button>
	</div>
	<div style="display:flex;gap:8px;align-items:center;margin-bottom:6px;">
		<button id="tm-start" style="padding:6px 10px;">开始</button>
		<button id="tm-stop" style="padding:6px 10px;">停止</button>
		<div style="margin-left:auto;">倒计时：
			<span id="tm-H">00</span>:<span id="tm-M">00</span>:<span id="tm-S">00</span>
		</div>
	</div>
	<div style="display:flex;gap:8px;align-items:center;margin:6px 0 10px 0;font-size:12px;">
		<label style="opacity:.9;">时长(小时)：</label>
		<input id="tm-duration" type="number" step="0.5" min="0.1" value="2" style="width:60px;padding:4px 6px;background:#E0F6FF;color:#000;border:1px solid #4682B4;border-radius:4px;">
		<span style="opacity:.65;">开始前设置</span>
	</div>
			<div style="display:grid;grid-template-columns:1fr auto;gap:6px 8px;align-items:center;font-size:12px;padding:8px;background:#B0E0E6;border-radius:6px;">
			<div>结束后关闭直播</div>
			<label><input id="tm-isAutoCloseLive" type="checkbox"></label>
			<div>评论语音提醒</div>
			<label><input id="tm-isNoticeCommit" type="checkbox"></label>
			<div>进场自动发送名片</div>
			<label><input id="tm-isAutoSendCard" type="checkbox"></label>
			<div>进场语音欢迎</div>
			<label><input id="tm-isWelcomeVoice" type="checkbox"></label>
			<div>评论自动文本回复</div>
			<label><input id="tm-isAutoComment" type="checkbox"></label>
			<div>评论语音播报回复语</div>
			<label><input id="tm-isPlayCommentVoice" type="checkbox"></label>
		</div>
		<div style="text-align:center;margin-top:10px;">
			<button id="tm-manage-templates" style="background:#4682B4;color:white;border:none;padding:8px 16px;border-radius:4px;cursor:pointer;font-size:12px;">📝 管理智能回复模板</button>
		</div>
	<div style="font-size:12px;margin-top:8px;opacity:.8;">
		开始时间：<span id="tm-startTime">-</span><br>
		结束时间：<span id="tm-endTime">-</span>
	</div>
</div>
		`;
		document.body.appendChild(div);

		// 拖拽
		const header = div.querySelector('.bp-start');
		header.addEventListener('mousedown', (e)=>{
			isDragging = true;
			dragStartX = e.clientX;
			dragStartY = e.clientY;
			startLeft = div.offsetLeft;
			startTop = div.offsetTop;
		});
		document.addEventListener('mousemove', (e)=>{
			if(!isDragging) return;
			const nx = Math.max(0, Math.min(startLeft + (e.clientX-dragStartX), document.body.clientWidth - header.clientWidth));
			const ny = Math.max(0, Math.min(startTop + (e.clientY-dragStartY), document.body.clientHeight - header.clientHeight));
			div.style.left = nx+'px';
			div.style.top = ny+'px';
		});
		document.addEventListener('mouseup', ()=>{ isDragging = false; });

		// 恢复设置
		$('#tm-isAutoCloseLive').checked = (LS.get(K.isAutoCloseLive, 'off') === 'on');
		$('#tm-isNoticeCommit').checked = (LS.get(K.isNoticeCommit, 'off') === 'on');
		$('#tm-isAutoSendCard').checked = (LS.get(K.isAutoSendCard, 'off') === 'on');
		$('#tm-isWelcomeVoice').checked = (LS.get(K.isWelcomeVoice, 'off') === 'on');
		$('#tm-isAutoComment').checked = (LS.get(K.isAutoComment, 'off') === 'on');
		$('#tm-isPlayCommentVoice').checked = (LS.get(K.isPlayCommentVoice, 'off') === 'on');
		// 恢复时长
		const savedDur = Number(LS.get('tm_duration_hours')) || 2;
		const durInput = $('#tm-duration');
		if(durInput){ durInput.value = String(savedDur); }

		// 监听设置变化
		$('#tm-isAutoCloseLive').addEventListener('change', e => LS.set(K.isAutoCloseLive, e.target.checked?'on':'off'));
		$('#tm-isNoticeCommit').addEventListener('change', e => LS.set(K.isNoticeCommit, e.target.checked?'on':'off'));
		$('#tm-isAutoSendCard').addEventListener('change', e => LS.set(K.isAutoSendCard, e.target.checked?'on':'off'));
		$('#tm-isWelcomeVoice').addEventListener('change', e => LS.set(K.isWelcomeVoice, e.target.checked?'on':'off'));
		$('#tm-isAutoComment').addEventListener('change', e => LS.set(K.isAutoComment, e.target.checked?'on':'off'));
		$('#tm-isPlayCommentVoice').addEventListener('change', e => LS.set(K.isPlayCommentVoice, e.target.checked?'on':'off'));

		$('#tm-start').addEventListener('click', onStart);
		$('#tm-stop').addEventListener('click', ()=> stopRobot(true));
		$('#tm-close').addEventListener('click', ()=> {
			div.style.display = 'none';
		});
		$('#tm-manage-templates').addEventListener('click', showSmartReplyManager);
		$('#tm-duration') && $('#tm-duration').addEventListener('change', (e)=>{
			const v = Math.max(0.1, Number(e.target.value)||2);
			e.target.value = String(v);
			LS.set('tm_duration_hours', v);
		});
		refreshPanel();
	}

	// 切换按钮（点击后创建或显示/隐藏面板）
	function createToggleBtn(){
		if($('#tm-toggle')) return;
		
		// 智能查找目标元素 - 多种选择器策略
		let targetElement = null;
		const selectors = [
			'.header--title--teC2aTV',                    // 原始选择器
			'.header--titleBox--Mt15Y50',                // 新的父容器选择器
			'[class*="header--title"]',                  // 包含header--title的类
			'[class*="title"]',                          // 包含title的类
			'.header--headerInfo--y954c6x',              // 头部信息区域
			'[data-spm-anchor-id*="live"]',              // 包含live的spm元素
			'.header--header--msGoWRD',                  // 头部区域
			'[class*="header"]'                          // 包含header的类
		];
		
		for (const selector of selectors) {
			targetElement = document.querySelector(selector);
			if (targetElement) {
				console.log('找到目标元素:', selector, targetElement);
				break;
			}
		}
		
		// 如果还是找不到，尝试查找包含特定文本的元素
		if (!targetElement) {
			const allElements = document.querySelectorAll('*');
			for (const element of allElements) {
				if (element.textContent && (
					element.textContent.includes('live room') || 
					element.textContent.includes('直播') ||
					element.textContent.includes('Live') ||
					element.textContent.includes('reception') ||
					element.textContent.includes('In real-time reception')
				)) {
					targetElement = element;
					console.log('通过文本内容找到目标元素:', element);
					break;
				}
			}
		}
		
		// 如果还是找不到，直接放在页面正中间
		if(!targetElement) {
			console.log('未找到目标元素，使用页面正中间定位');
			const btn = document.createElement('button');
			btn.id = 'tm-toggle';
			btn.textContent = '🎥 阿里直播助手';
			btn.title = '打开/隐藏 国际站直播小助手';
			btn.style = 'position:fixed;z-index:999998;left:50%;top:50%;transform:translate(-50%, -50%);padding:12px 20px;background:#87CEEB;color:#000;border:2px solid #4682B4;border-radius:10px;cursor:pointer;font-size:16px;font-weight:bold;box-shadow:0 6px 20px rgba(0,0,0,0.2);transition:all 0.3s ease;';
			
			// 添加悬停效果
			btn.addEventListener('mouseenter', () => {
				btn.style.background = '#4682B4';
				btn.style.color = '#fff';
				btn.style.transform = 'translate(-50%, -50%) scale(1.05)';
				btn.style.boxShadow = '0 8px 25px rgba(0,0,0,0.3)';
			});
			
			btn.addEventListener('mouseleave', () => {
				btn.style.background = '#87CEEB';
				btn.style.color = '#000';
				btn.style.transform = 'translate(-50%, -50%) scale(1)';
				btn.style.boxShadow = '0 6px 20px rgba(0,0,0,0.2)';
			});
			
			btn.addEventListener('click', ()=>{
				const panel = $('#bp_start');
				if(panel){
					panel.style.display = panel.style.display === 'none' ? 'block' : 'none';
				} else {
					createPanel();
				}
			});
			document.body.appendChild(btn);
			return;
		}
		
		const btn = document.createElement('button');
		btn.id = 'tm-toggle';
		btn.textContent = '阿里直播助手';
		btn.title = '打开/隐藏 国际站直播小助手';
		btn.style = 'margin-left:10px;padding:6px 10px;background:#87CEEB;color:#000;border:2px solid #4682B4;border-radius:6px;cursor:pointer;display:inline-block;vertical-align:middle;';
		btn.addEventListener('click', ()=>{
			const panel = $('#bp_start');
			if(panel){
				panel.style.display = panel.style.display === 'none' ? 'block' : 'none';
			} else {
				createPanel();
			}
		});
		
		// 将按钮插入到目标元素后面
		targetElement.parentNode.insertBefore(btn, targetElement.nextSibling);
	}

	function refreshPanel(){
		$('#tm-startTime') && ($('#tm-startTime').textContent = LS.get(K.startLiveTime) || '-');
		$('#tm-endTime') && ($('#tm-endTime').textContent = LS.get(K.endLiveTime) || '-');
		$('#tm-url') && ($('#tm-url').textContent = LS.get(K.currentLive_URL) || location.href);
	}

	// ------------- 业务：开始/停止/倒计时 -------------
	function onStart(){
		// 若页面结构未就绪，也允许先开始倒计时；观察器等待就绪后再挂载
		const flag = $("#container .header--iconShowItem--B7GxSsm");
		const qk = $shadowRoot();
		const pageReady = !!(flag && flag.innerText === '直播中' && qk);
		if(!pageReady){
			console.warn('页面结构未完全就绪，将先启动倒计时，稍后自动挂载监听');
		}

		const hours = Number($('#tm-duration')?.value) || Number(LS.get('tm_duration_hours')) || 2; // 时长（小时）
		const now = Date.now();
		const end = now + hours*3600*1000;

		LS.set(K.isRobotOn, true);
		LS.set(K.startLiveTime, nowFmt(now));
		LS.set(K.endLiveTime, nowFmt(end));
		LS.set(K.currentLive_URL, location.href);
		LS.set(K.currentLive_ID, null);

		refreshPanel();
		startCountdown(end);
		if(pageReady){
			startObservers();
		} else {
			waitAndMountObservers();
		}
		alert('小助手已启动');
	}

	// 页面未就绪时，轮询等待后挂载监听
	function waitAndMountObservers(){
		let tries = 0;
		const t = setInterval(()=>{
			tries++;
			const flag = $("#container .header--iconShowItem--B7GxSsm");
			const qk = $shadowRoot();
			if(flag && flag.innerText === '直播中' && qk){
				clearInterval(t);
				startObservers();
			}
			if(tries > 60){ // 最长约3分钟
				clearInterval(t);
			}
		}, 3000);
	}

	function stopRobot(manual=false){
		clearCountdown();
		stopObservers();
		LS.set(K.isRobotOn, false);
		if(manual){
			location.reload();
		}else{
			// 到点自动关播
			if(LS.get(K.isAutoCloseLive, 'off') === 'on'){
				autoCloseLive();
			}
			setTimeout(()=>location.reload(), 1000);
		}
	}

	function startCountdown(endTs){
		clearCountdown();
		countdownTimer = setInterval(()=>{
			const rest = Math.max(0, Math.floor((endTs - Date.now())/1000));
			setTimerView(rest);
			if(rest === 0){
				stopRobot(false);
			}
		}, 1000);
	}
	function clearCountdown(){
		if(countdownTimer){ clearInterval(countdownTimer); countdownTimer = null; }
		setTimerView(0);
	}
	function setTimerView(sec){
		const H = Math.floor(sec/3600), M = Math.floor((sec%3600)/60), S = Math.floor(sec%60);
		const p = n => n<10?('0'+n):''+n;
		$('#tm-H') && ($('#tm-H').textContent = p(H));
		$('#tm-M') && ($('#tm-M').textContent = p(M));
		$('#tm-S') && ($('#tm-S').textContent = p(S));
	}

	// ------------- 业务：监听与动作 -------------
	function startObservers(){
		const root = $shadowRoot();
		if(!root) return;

		// 评论数节点，用于等待首次>0再挂评论列表
		const commentsCountEle = $("#container div.video-container--data--GCIOjpa > div:nth-child(4) > div.video-container--dataItemValue--JqK3lMx");
		if(commentsCountEle && Number(commentsCountEle.innerText) > 0){
			watchComments(root);
		}else{
			const tar = commentsCountEle;
			if(tar){
				const ob = new MutationObserver(()=>{
					dealFirstComments(root);
					ob.disconnect();
					watchComments(root);
				});
				ob.observe(tar, { characterData:true, attributes:true, childList:true, subtree:true });
			}
		}

		// 进场数节点，用于等待首次>0再挂进场列表
		const lookerCountEle = $("#container div.video-container--data--GCIOjpa > div:nth-child(2) > div.video-container--dataItemValue--JqK3lMx");
		if(lookerCountEle && Number(lookerCountEle.innerText) > 0){
			watchInto(root);
		}else{
			const ob2 = new MutationObserver(()=>{
				dealFirstInto(root);
				ob2.disconnect();
				watchInto(root);
			});
			lookerCountEle && ob2.observe(lookerCountEle, { characterData:true, attributes:true, childList:true, subtree:true });
		}
	}

	function stopObservers(){
		if(observeComments){ observeComments.disconnect(); observeComments = null; }
		if(observeInto){ observeInto.disconnect(); observeInto = null; }
	}

	function watchComments(root){
		const list = root.querySelector(".comment-list-box .comment-content>div");
		if(!list) return;
		observeComments = new MutationObserver(async (muts)=>{
			await sleep(300);
			const changed = muts[0]?.target || list;
			handleNewComment(changed);
		});
		observeComments.observe(list, { childList:true });
	}

	function watchInto(root){
		// 切换到进场tab
		const tab2 = root.querySelector("#parentContainer .interactive-header.pc .interactive-tab-list > div:nth-child(2)");
		tab2 && tab2.click();
		const box = root.querySelector(".interactive-approach-container .approach-page .approach-box.pc");
		if(!box) return;
		observeInto = new MutationObserver(async (muts)=>{
			await sleep(300);
			const changed = muts[0]?.target || box;
			handleNewInto(changed);
		});
		observeInto.observe(box, { childList:true });
	}

	function dealFirstComments(root){
		const box = root.querySelector(".comment-list-box .comment-content>div");
		box && handleNewComment(box);
	}
	function dealFirstInto(root){
		const box = root.querySelector(".interactive-approach-container .approach-page .approach-box.pc");
		box && handleNewInto(box);
	}

	// 新评论处理：自动回复 + 提示音 + 回复语音
	async function handleNewComment(container){
		if(LS.get(K.isNoticeCommit, 'off') === 'on'){ playBeep(); }
		if(LS.get(K.isAutoComment, 'off') !== 'on') return;

		const last = container?.childNodes?.[0];
		if(!last) return;

		const text = last.innerText?.trim() || '';

		// 定位回复按钮（影子DOM中的结构）
		let replyBtn = last.querySelector("div.sp7juUVC7TtSm4K0acmH > div > span:last-child");
		if(!replyBtn) return;
		replyBtn.click();
		await sleep(200);

		// 弹窗输入并确认
		const root = $shadowRoot();
		let textarea = root?.querySelector(".next-input.next-input-textarea>textarea") || $(".next-input.next-input-textarea>textarea");
		let confirmBtn = root?.querySelector(".next-btn.next-medium.next-btn-normal") || $(".next-btn.next-medium.next-btn-primary.next-dialog-btn");
		const replyContent = getSmartReplyByText(text);
		if(textarea){
			textarea.value = replyContent;
			textarea.dispatchEvent(new Event('input', { bubbles:true, cancelable:true }));
		}
		await sleep(200);
		confirmBtn && confirmBtn.click();

		if(LS.get(K.isPlayCommentVoice, 'off') === 'on'){
			speak(replyContent);
		}
	}

	// 新进场处理：发送名片 + 欢迎语音
	function handleNewInto(container){
		const last = container?.childNodes?.[0];
		if(!last) return;

		// 自动名片
		if(LS.get(K.isAutoSendCard, 'off') === 'on'){
			let btn = last.querySelector(".icon-namecard");
			if(!btn){
				const root = $shadowRoot();
				btn = root?.querySelector("#parentContainer .interactive-approach-tab-panel.active .iconfont.icon-namecard");
			}
			btn && btn.click();
		}

		// 欢迎语
		if(LS.get(K.isWelcomeVoice, 'off') === 'on'){
			const raw = last.innerText?.trim() || '';
			const username = (raw.split('\n')[0] || 'Friend');
			speak(`Welcome, ${username}`);
		}
	}

	// ------------- 自动关播 -------------
	async function autoCloseLive(){
		// 顶部“关闭直播”按钮
		const closeBtn = $("#container  div.header--header--msGoWRD > div.header--headerInfo--y954c6x > div > button.next-btn.next-medium.next-btn-primary > span");
		if(closeBtn){
			closeBtn.click();
			await sleep(600);
			// 确认按钮
			const okBtn = $("body > div.next-overlay-wrapper.opened > div.next-dialog.next-closeable.next-overlay-inner.next-dialog-quick > div.next-dialog-footer.next-align-right > button.next-btn.next-medium.next-btn-primary.next-dialog-btn > span");
			okBtn && okBtn.click();
		}
	}

	// ------------- 启动入口 -------------
	function init(){
		createToggleBtn();
		loadSmartReplyRules(); // 加载智能回复规则
		// 若上次处于运行态，自动恢复
		if(LS.get(K.isRobotOn, false)){
			const endStr = LS.get(K.endLiveTime);
			if(endStr){
				const endTs = new Date(endStr.replace(/-/g,'/')).getTime();
				if(endTs > Date.now()){
					startCountdown(endTs);
					startObservers();
				}
			}
		}
	}

	// 等待大容器就绪后初始化
	window.addEventListener('load', ()=>{
		try{
			// 页面结构加载稍慢，延迟一点
			setTimeout(init, 1200);
		}catch(e){}
	});

	// 监听页面变化，自动重新定位按钮
	let lastButtonPosition = null;
	const observer = new MutationObserver((mutations) => {
		// 检查是否有按钮位置变化或页面结构变化
		const currentButton = $('#tm-toggle');
		if (currentButton) {
			const rect = currentButton.getBoundingClientRect();
			const currentPosition = { left: rect.left, top: rect.top };
			
			if (lastButtonPosition && (
				Math.abs(currentPosition.left - lastButtonPosition.left) > 10 ||
				Math.abs(currentPosition.top - lastButtonPosition.top) > 10
			)) {
				console.log('检测到按钮位置变化，重新定位');
				repositionButton();
			}
			lastButtonPosition = currentPosition;
		}
	});

	// 重新定位按钮的函数
	function repositionButton() {
		const existingButton = $('#tm-toggle');
		if (existingButton) {
			existingButton.remove();
		}
		
		// 延迟一点再创建，确保页面结构稳定
		setTimeout(() => {
			createToggleBtn();
		}, 500);
	}

	// 启动观察器
	setTimeout(() => {
		observer.observe(document.body, {
			childList: true,
			subtree: true,
			attributes: true,
			attributeFilter: ['class', 'style']
		});
	}, 2000);
})();