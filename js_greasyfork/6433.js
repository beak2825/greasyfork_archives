// ==UserScript==
// @name       Bilibili shielding
// @namespace  https://greasyfork.org/zh-CN/users/6065-hatn
// @version    0.5.3
// @description  B站视频评论/at列表记录 屏蔽：双击【q】键开/关屏蔽，【u】键 编辑屏蔽用户名列表
// @icon           http://www.gravatar.com/avatar/10670da5cbd7779dcb70c28594abbe56?r=PG&s=92&default=identicon
// @include     *.bilibili.*account/at
// @include		*bilibili.*/video*
// @require		http://cdn.staticfile.org/jquery/2.1.1-rc2/jquery.min.js
// @copyright	2014+, hatn
// @author		hatn
// @run-at     	document-start
// @grant0       GM_xmlhttpRequest
// @grant       GM_getValue
// @grant       GM_setValue
// @grant       GM_setValue
// @grant0       GM_deleteValue
// @downloadURL https://update.greasyfork.org/scripts/6433/Bilibili%20shielding.user.js
// @updateURL https://update.greasyfork.org/scripts/6433/Bilibili%20shielding.meta.js
// ==/UserScript==

/**
*
* 功能：用于哔哩哔哩站 屏蔽特定用户的视频评论及at列表记录
*
* 使用说明：
* 1、可脚本内修改config设置（自动更新不会丢失,重新填写后将覆盖以前数据）
* 2、双击 【u】按键 动态增删需屏蔽的用户名列表，多个用','分隔 如：你好,dd123,bishi
* 3、双击 【q】按键 停止（取消）/启用 屏蔽功能，恢复的屏蔽内容以粉红背景显示
*
*/

/* #########  参数设置 S ######### */

var config = {
	notifyFlag: 0, // 弹窗提示 [1]关闭(默认) [2]开启
	intvalTime: 0, // 监控频率 （默认300毫秒）
	type: 0 // 屏蔽方式 [1]屏蔽评论+at（默认） [2]只屏蔽评论 [3]只屏蔽at
}
/* #########  参数设置 E ######### */

var pingbi = {
	/* 参数 */
	cfg: {}, // 参数集
	defaultCfg: {
		shieldArr: [],
		warn: false,
		intvalTime: 300,
		sType: 1
	},
	shields1: '', shields2: '', shields3: '', father1: '', father2: '', father3: '', timer: '', huifuFlag: false, timerFlag: false, timenow: 0, preKey: '', keepTime: 6000,
	/* 初始化 */
	init: function () {
		var s = this;
		s.checkDom();
		s.setParam(config);
		s.makeShieldStr();
		s.band();
		s.cycle('on', s);
		console.log('bilibili shield, run...');
	},
	/* 启动器 */
	launcher: function () {
		var s = this;
		var times = 100;
		var preTimer = setInterval(function () {
			if ($('.footer').length > 0) {
				window.clearInterval(preTimer);
				s.init();
				return true;
			}
			if (--times < 0) {
        window.clearInterval(preTimer) + console.log('err: time out!');
			}
		}, 600);
	},
	/* 检查页面 */
	checkDom: function () {
		var at = $('#atme').length;
		var pl = $('.common .comm').length;
		var runFlag = at + pl;
		runFlag < 1 && console.log('Cancel..') + die(); // 停止脚本
	},
	/* timer */
	timerMgr: function (act) {
		var act = act == 'ticktock' ? 'ticktock' : 'reset';
		if (act == 'ticktock') {
			this.keepTime = (this.keepTime -= this.cfg.intvalTime) > 0 ? this.keepTime : 0;
			return this.keepTime <= 0 ? true : false;
		} else if (act == 'reset') {
			this.keepTime = 6000;
			this.timerFlag == false && this.cycle('on', this);
		}
	},
	/* 参数读取 */
	setParam: function (config) {
		var s = this;
		if (typeof config == 'undefined') {
			return false;
		}
		s.dataMgr('get');
		s.cfg = {
			shieldArr: s.cfg.shieldArr.length > 0 ? s.cfg.shieldArr : s.defaultCfg.shieldArr, // 屏蔽名单
			warn: config.notifyFlag == 0 ? s.defaultCfg.warn : (config.notifyFlag == 2 ? true : s.defaultCfg.warn),
			intvalTime: config.intvalTime == 0 ? s.defaultCfg.intvalTime : (config.intvalTime < 300 ? s.defaultCfg.intvalTime : config.intvalTime),
			sType: config.type == 0 ? s.defaultCfg.sType : (config.type > 0 && config.type <= 2 ? parseInt(config.type) : s.defaultCfg.sType)
		};
		s.dataMgr('set');
		
		/* 父元素 */
		s.father1 = '.re_ul>li:visible';
		s.father2 = '.comm_list>li:visible';
		s.father3 = '.atlist>li:visible';
		return true;
	},
	/* 事件绑定 */
	band: function () {
		var s = this;
		$(window).on('keyup click', function (event) {
			var keyCode = event.keyCode;
			if (event.type == 'keyup') {
				var double = s.doubleClick(keyCode);
				if (double == false) {
					return false;
				}
				if (keyCode == '81') {
					if (s.timerFlag == false) {
						s.huifuFlag = true;
						s.cycle('on', s);
						console.log('继续监控..') + (s.cfg.warn && alert('继续监控..'));
					} else {
						s.cycle('off', s);
						console.log('暂停监控..') + (s.cfg.warn && alert('暂停监控..'));
					}
				} else if (keyCode == '85') {
					//console.log(s.cfg.shieldArr) + alert(s.cfg.shieldArr);
					var userStr = s.cfg.shieldArr.length > 0 ? s.cfg.shieldArr.join(',') : '';
					var _userNames = prompt('设置屏蔽名单(多个用逗号分隔)', userStr);
					_userNames = $.trim(_userNames);
					var reCat = /，/gi;
					var userNames = _userNames.replace(reCat, ',');
					s.setUsers(userNames);
				} else if (keyCode == '66') {
					s.backup();
				}
			} else if (event.type == 'click') {
				s.timerMgr();
			}
		});
	},
	/* 设置用户名单 */
	setUsers: function (userStr) {
		var s = this;
		if (typeof userStr == 'undefined' || userStr == '') {
			return false; // 列表为空不操作
		}
		var users = userStr.split(',');
		s.cfg.shieldArr = users;
		s.dataMgr('set');
		s.makeShieldStr();
		s.cycle('off', s);
		s.cycle('on', s);
	},
	/* 数据操作 */
	dataMgr: function (act) {
		var s = this;
		var action = act == 'set' ? 'set' : 'get';
		if (action == 'get') {
			var cfgStr = GM_getValue('config');
			if (typeof cfgStr == 'undefined' || cfgStr == '') {
				s.cfg = s.defaultCfg;
				return false;
			}
			s.cfg = JSON.parse(cfgStr);
		} else {
			var cfgStr = JSON.stringify(s.cfg);
			GM_setValue('config', cfgStr);
		}
	},
	/* 双击判定 */
	doubleClick: function (keyCode) {
		var s = this;
		/*if (typeof keyCode == 'undefined' || (parseInt(keyCode) != 85 && parseInt(keyCode) != 81)) {
			s.timenow = 0;
			return false;
		}*/
		var timenow = (new Date()).getTime();
		if (s.timenow == 0) {
			s.timenow = timenow;
			s.preKey = keyCode;
			return false;
		} else {
			var intval = timenow - s.timenow;
			if (intval < 400 && s.preKey == keyCode) {
				s.timenow = 0;
				return true;
			}
			s.timenow = timenow;
		}
		return false;
	},
	/* 过滤组装 */
	makeShieldStr: function () {
		var s = this, userNameTemp, shieldTemp1, shieldTemp2, shieldTemp3;
		shieldTemp1 = shieldTemp2 = shieldTemp3 = [];
		for (var i in s.cfg.shieldArr) {
			userNameTemp = $.trim(s.cfg.shieldArr[i]);
			shieldTemp1.push('.re_ul>li>a[card="' + userNameTemp + '"]:visible');// .re_ul li
			shieldTemp2.push('.t>a[card="' + userNameTemp + '"]:visible');
			shieldTemp3.push('.atlist .t>a[card="' + userNameTemp + '"]:visible');
		}
		s.shields1 = shieldTemp1.join(',');
		s.shields2 = shieldTemp2.join(',');
		s.shields3 = shieldTemp3.join(',');
	},
	/* 循环执行 */
	cycle: function (act, ss) { // act [on]开启 [off]停止 [await]待机
		var s = ss;
		var action = typeof act != 'undefined' ? act : 'on';
		/* 暂停/待机 */
		if (action == 'off') {
			window.clearInterval(s.timer);
			s.timerFlag = false;
			$('li:hidden').css('background-color', '#f7e4e4').show();
			return true;
		}
		if (action == 'await') {
			s.timerFlag = false;
			window.clearInterval(s.timer);
			return true;
		}
		/* 执行 */
		if (s.cfg.shieldArr == false) {
			console.log('userNameList is null ~');
			return false;
		}
		s.timerFlag = true;
		s.timerMgr();
		s.timer = setInterval(function () {
			//console.log(s.shields1 + '----' + s.father1);
			var timeout = s.timerMgr('ticktock');
			if (timeout == true) {
				s.cycle('await', s);
				return false;
			}
			var total = 0;
			var q1 = s.cfg.sType != 3 ? $(s.shields1).parents(s.father1).hide() : '';
			var q2 = s.cfg.sType != 3 ? $(s.shields2).parents(s.father2).hide() : '';
			var q3 = s.cfg.sType != 2 ? $(s.shields3).parents(s.father3).hide() : '';// at列表）
			if (s.huifuFlag == true) {
				s.huifuFlag = false;
				return true;
			}
			total = q1.length + q2.length + q3.length;
			s.cfg.warn && total > 0 && alert('当前页隐藏了' + total + '条评论/at');
		}, s.cfg.intvalTime);
	},
	/* 导出 */
	backup: function () {
		var fileName = 'bilibili_blacklist.txt'; 
		var content = this.cfg.shieldArr.join(',');
		if (confirm("确定要导出屏蔽名单吗？")) {
			downloadFile(fileName, content);
		}
	}
};

pingbi.launcher();

/* 下载 */
function downloadFile(fileName, content, type) {
	if (typeof window.URL == 'undefined') {
		alert('浏览器JS缺少URL对象！请双击u键手动复制');
		return false;
	}
	var href;
	var aLink = document.createElement('a');
	var type = typeof type == 'undefined' || type == 'text' ? 'text' : 'url';
	if (type == 'text') {
		var blob = new Blob([content]);
		href = URL.createObjectURL(blob);
	} else if (type == 'url') {
		href = content; 
	}
	var evt = document.createEvent("HTMLEvents");
	evt.initEvent("click", false, false);
	aLink.download = fileName;
	aLink.href = URL.createObjectURL(blob);
	aLink.dispatchEvent(evt);
}