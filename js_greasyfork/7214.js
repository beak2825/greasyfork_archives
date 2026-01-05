// ==UserScript==
// @name      qzone auto login(mobile)
// @namespace  https://greasyfork.org/zh-CN/scripts/19523-qzone-auto-login-mobile
// @version    0.1.5
// @description  anything..
// @icon           http://torn.jd-app.com/head/
// @include     *ui.ptlogin*.qq.com/cgi-bin/login*
// @require0		http://cdn.staticfile.org/jquery/2.1.1-rc2/jquery.min.js
// @copyright	2016+, hatn
// @author		hatn
// @run-at     	document-start
// @grant       none
// @grant0       GM_xmlhttpRequest
// @grant0       GM_getValue
// @grant0       GM_setValue
// @grant0       GM_deleteValue
// @downloadURL https://update.greasyfork.org/scripts/7214/qzone%20auto%20login%28mobile%29.user.js
// @updateURL https://update.greasyfork.org/scripts/7214/qzone%20auto%20login%28mobile%29.meta.js
// ==/UserScript==

// 配置
var config0 = {
	data: qq_data,
	userTag: '#u',
	pwdTag: '#p',
	submitTag: '#go',
	checkTag: '#web_login'
};
var autoLogin = {
	conf: config0,
	timenow: 0,
	preKey: 0,
	/* 初始化 */
	init: function () {
	var s = this;
	s.band();
	
	s.selectUserbox();
	s.userWriteToForm(s.conf.data[0], false);
	console.log('init ok ...');
	},
	/* 启动器 */
	launcher: function () {
	typeof _loadJS_ != 'undefined' && die(); // 防止重复加载
	var s = this;
	var timer = 20;
	s.getJQ();
	var preTimer = setInterval(function () {
		if (typeof jQuery == 'undefined') {
			return false;
		}
		jQuery.noConflict();
		$$ = jQuery;
		if (typeof $$ != 'undefined' && $$(s.conf.checkTag).length > 0) {
		window.clearInterval(preTimer);
		s.init();
		return true;
		}
		if (timer < 1) {
		window.clearInterval(preTimer);
		return false;
		}
		timer -= 1;
		//$ = unsafeWindow.$;
	}, 700);
	},
	/* 双击判定 */
	doubleClick: function (keyCode) {
	var s = this;
	s.timenow = typeof s.timenow == 'undefined' ? 0 : s.timenow;
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
	/* 事件绑定 */
	band: function () {
	var s = this;
	
	/* 双击q 登陆 */
	$$(document).keyup(function (event) {
		var keyCode = event.keyCode;
		if (event.type != 'keyup') {
		return false;
		}
		var double = s.doubleClick(keyCode);
		if (double == false) {
		return false;
		}
		console.log('auto run...');
		if (keyCode == '81') {
		for (var i in s.conf.data[0]) {
			$$(s.conf[i + '' + 'Tag']).val(s.conf.data[0][i]);
		}
		$$(s.conf.submitTag).click();
		}
	});
	/* 切换账号自动登陆 */
	$$(document).on('change', 'select.select-box', function() {
		s.doLoginByChange();
	});
	},
	/* 候选登陆html */
	selectUserbox: function() {
	var s = this;
	var stype = '<style>' + 
		'.hide { display: none; } .select-box { position: fixed; top: 15px; right: 25px; }' +
		'</style>';
	var selcetBox = '<select class="select-box">' + 
		'<option class="hide" value=""></option>' +
		'</select>';
	var html = stype + selcetBox;
	$$('body').prepend(html);
	
	var $sbox = $$('select.select-box');
	var optionTemp, userItem;
	var dataArr = s.conf.data;
	var $op = $$('select.select-box option:eq(0)');
	for (var i in dataArr) {
		userItem = dataArr[i];
		optionTemp = $op.clone().removeClass('hide').val(userItem.pwd).text(userItem.user);
		$sbox.append(optionTemp);
	}
	$op.remove();
	},
	/* 默认填入第一个用户 账户密码 */
	userWriteToForm: function(data, loginFlag) {
	var s = this;
	var data = data || s.conf.data[0];
	var loginFlag = loginFlag || false; 
	$$(s.conf.userTag).val(data.user);
	$$(s.conf.pwdTag).val(data.pwd);
	loginFlag && $$(s.conf.submitTag).click();
	},
	/* 填充账户并登陆 */
	doLoginByChange: function() {
		var s = this;
		var $option = $$('select.select-box option:selected');
		var data = {"user": $option.text(), "pwd": $option.val()};
		s.userWriteToForm(data, true);
	},
	/* 获取jq */
	getJQ: function() {
	/* habit 只能手动引入外部js库 */
	//typeof _loadJS_ != 'undefined' && die();
	var ga1 = document.createElement('script');
	ga1.type = 'text/javascript';
	ga1.async = false;
	ga1.src = "http://cdn.staticfile.org/jquery/2.1.1-rc2/jquery.min.js";
	document.body.appendChild(ga1);
	window._loadJS_ = true;
	}
};
// 执行！
autoLogin.launcher();
