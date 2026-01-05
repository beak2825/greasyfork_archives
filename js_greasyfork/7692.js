// ==UserScript==
// @name         BaiduPanUrlHelper
// @namespace    https://greasyfork.org/scripts/7692-baidupanurlhelper/code/BaiduPanUrlHelper.user.js
// @version      0.0.538
// @description  将短链接转换为长链接并通过wap版直接下载大文件
// @author       icgeass
// @match        http://pan.baidu.com/s/*
// @match        http://pan.baidu.com/share/link?*
// @match        http://pan.baidu.com/wap/link?*
// @match        http://pan.baidu.com/disk/home*
// @match        http://pan.baidu.com/wap/home*
// @match        http://yun.baidu.com/s/*
// @match        http://yun.baidu.com/share/link?*
// @match        http://yun.baidu.com/wap/link?*
// @match        http://yun.baidu.com/disk/home*
// @match        http://yun.baidu.com/wap/home*
// @include        http://pan.baidu.com/s/*
// @include        http://pan.baidu.com/share/link?*
// @include        http://pan.baidu.com/wap/link?*
// @include        http://pan.baidu.com/disk/home*
// @include        http://pan.baidu.com/wap/home*
// @include        http://yun.baidu.com/s/*
// @include        http://yun.baidu.com/share/link?*
// @include        http://yun.baidu.com/wap/link?*
// @include        http://yun.baidu.com/disk/home*
// @include        http://yun.baidu.com/wap/home*
// @run-at       document-end
// @grant        unsafeWindow
// @grant        GM_setValue
// @grant        GM_getValue
// @copyright  2015+, icgeass@hotmail.com
// @downloadURL https://update.greasyfork.org/scripts/7692/BaiduPanUrlHelper.user.js
// @updateURL https://update.greasyfork.org/scripts/7692/BaiduPanUrlHelper.meta.js
// ==/UserScript==

// 更新历史
// v0.0.1	初始版本
// v0.0.2	解决yun.baidu.com域名失效的问题
// v0.0.3	常量作用域调整，避免全局污染
// v0.0.4	增加对网盘主页的支持
// v0.0.5	增加对在特定文件夹内的web页面与wap页面间切换的支持
// v0.0.51	修复短链接跳转404的错误
// v0.0.52	修复yun域名失效和细节调整
// v0.0.53	解决可能因事件覆盖导致的脚本冲突
// v0.0.531	排除链接不存在页面提示
// v0.0.532	对v0.0.531更新进行细节增强
// v0.0.533	解决百度盘wap版分享路径增加父目录引起的切换错误
// v0.0.534	1.解决部分浏览器（测试使用waterfox）的兼容问题；2.将空格键转为切换按键避免使用ctrl+shift选择输入法或连续选择网盘文件时导致的错误切换
// v0.0.535	分享父目录为根目录不能使用的bug
// v0.0.536	WEB版主页提供是否使用按钮选项，为防止按键误敲，默认使用按钮；其他页面不变
// v0.0.537	WEB版主页切换到WAP版部分出现目录不对应问题
// v0.0.538	233。。。。

var _BaiduPanUrlHelper_USEKEY = 32; // 32对应空格键ascii，可以改为你喜欢的按键的ascii，从而使用该按键切换
var _BaiduPanUrlHelper_USEBUTTON = true; // true表示在WEB版主页使用按钮，false表示使用快捷键

var _BaiduPanUrlHelper_BTN_TEXT = "轉到WAP";
var _BaiduPanUrlHelper_CLASS_NAME_APPEND_TO = "bar global-clearfix";

(function() {
	// wap版、失效链接没有yunData全局；放在function里面防止全局污染，相当于私有，按键的事件处理函数可引用
	var URL_SHORT = "http://pan.baidu.com/s/";
	var URL_SHARE = "http://pan.baidu.com/share/link";
	var URL_WAP = "http://pan.baidu.com/wap/link";
	var URL_HOME_WEB = "http://pan.baidu.com/disk/home";
	var URL_HOME_WAP = "http://pan.baidu.com/wap/home";
	var bdYunData = unsafeWindow.yunData;
	var url = getUrl(); // 确保能处理yun.baidu.com域名，引用给if判断和按键事件
	if (GM_getValue("_BaiduPanUrlHelper_WARNING", "false") != "true") { // 233。。。。
		var result = window.confirm("BaiduPanUrlHelper提示：\r\n百度盘限制电脑对WAP页面，请配合使用脚本 https://greasyfork.org/zh-CN/scripts/13434 或 安装插件 User Agent Switcher 解决问题\r\n不再提醒？");
		if (result) {
			GM_setValue("_BaiduPanUrlHelper_WARNING", "true");
		}
	}
	if (_BaiduPanUrlHelper_USEBUTTON && url.indexOf(URL_HOME_WEB) != -1) { // 为网盘WEB主页添加按钮
		var btn_wap = document.createElement("button");
		btn_wap.type = "button";
		btn_wap.style.cssText = 'margin: 0px 10px;height: 28px;';
		btn_wap.innerHTML = _BaiduPanUrlHelper_BTN_TEXT;
		btn_wap.id = _BaiduPanUrlHelper_BTN_TEXT;
		var el_append_to = document.getElementsByClassName(_BaiduPanUrlHelper_CLASS_NAME_APPEND_TO)[0];
		if (typeof el_append_to != "object") {
			_BaiduPanUrlHelper_USEBUTTON = false; // 保证无法使用按钮时也能使用快捷键操作
		} else {
			if (!document.getElementById(_BaiduPanUrlHelper_BTN_TEXT)) {
				el_append_to.appendChild(btn_wap);
			}
			btn_wap.onclick = function(e) {
				e = e || window.event;
				url = getUrl();
				path = "?" + findUrlParas(url).path.replace("path=", "dir=").replace(/%25/g, "%");
				window.location.href = URL_HOME_WAP + ("?" == path ? "" : path);
			};
		}

	}
	if (url.indexOf(URL_SHORT) != -1) { // 将短链接转换为长链接
		if (typeof bdYunData != "object") {
			if ((document.title.indexOf("下载") != -1) && (!/^.*(不存在|失效|不能|无法|不可|非法|禁止|未|没).*$/.test(document.title))) {
				// console.error("yunData is not defined");
				window.alert("提示：脚本BaiduPanUrlHelper失效，请禁用脚本或报告错误！\n\nERROR: yunData is not defined");
			}
			return;
		}
		var uk = bdYunData.SHARE_UK;
		var shareid = bdYunData.SHARE_ID;
		if (uk && shareid) {
			window.location.href = URL_SHARE + "?shareid=" + shareid + "&uk=" + uk;
		} else {
			// console.error("uk = "uk + ", shareid = " + shareid);
			window.alert("提示：脚本BaiduPanUrlHelper失效，请禁用脚本或报告错误！\n\nERROR: uk = " + uk + ", shareid = " + shareid);
			return;
		}
	} else { // 添加文档按键跳转事件
		document.addEventListener("keydown", function(e) { // 为文档添加链接转换事件
			e = e || window.event;
			var key = e.keyCode || e.charCode;
			if (key == _BaiduPanUrlHelper_USEKEY) {
				url = getUrl(); // 当前实时URL，兼容yun.baidu.com
				var parasObj = findUrlParas(url);
				var path = "";
				var uk = "";
				var shareid = "";
				var parent_path = "";
				if (url.indexOf(URL_SHARE) != -1) {
					try {
						if (!(bdYunData.SHARE_UK && bdYunData.SHARE_ID && typeof bdYunData.FILEINFO[0].parent_path == "string")) {
							throw Exception();
						}
						GM_setValue(bdYunData.SHARE_UK + "|" + bdYunData.SHARE_ID + "#FILEINFO_PARENT_PATH", bdYunData.FILEINFO[0].parent_path); // 分享的文件(夹)都在同一目录下
					} catch (e) {
						window.alert("提示：脚本BaiduPanUrlHelper失效，请禁用脚本或报告错误！ \n\nERROR: Required variable is missing");
						return;
					}
					path = "&" + parasObj.path.replace("path=", "dir=").replace(/%25/g, "%");
					if (path == "&dir=%2F" || path == "&") { // 分享根目录,Wap版参数
																// dir=/父目录 有效,
																// 而dir=/父目录/ 无效
						path = "&";
					} else { // 分享子目录
						path = path.replace("&dir=", "&dir=" + bdYunData.FILEINFO[0].parent_path);
					}
					window.location.href = URL_WAP + "?" + parasObj.shareid + "&" + parasObj.uk + ("&" == path ? "" : path);
				} else if (url.indexOf(URL_WAP) != -1) {
					uk = parasObj.uk.replace("uk=", "");
					shareid = parasObj.shareid.replace("shareid=", "");
					parent_path = GM_getValue(uk + "|" + shareid + "#FILEINFO_PARENT_PATH", "???"); // 用 uk
																									// 和
																									// shareid
																									// 获取父目录,
																									// 防止用户同时打开多个页面出现的错误
					if (parent_path == "???") {
						window.alert("提示：脚本BaiduPanUrlHelper分享页面切换需从Web版开始访问，请重试、禁用脚本或报告错误！\n\nERROR: parent_path = \"???\"");
						return;
					}
					path = "#" + parasObj.dir.replace("dir=", "path=").replace(parent_path, "").replace(/%/g, "%25");
					window.location.href = URL_SHARE + "?" + parasObj.shareid + "&" + parasObj.uk + ("#" == path ? "" : path);
				} else if (url.indexOf(URL_HOME_WEB) != -1) {
					if (!_BaiduPanUrlHelper_USEBUTTON) {
						path = "?" + parasObj.path.replace("path=", "dir=").replace(/%25/g, "%");
						window.location.href = URL_HOME_WAP + ("?" == path ? "" : path);
					}
				} else if (url.indexOf(URL_HOME_WAP) != -1) {
					path = "#" + parasObj.dir.replace("dir=", "path=").replace(/%/g, "%25");
					window.location.href = URL_HOME_WEB + ("#" == path ? "" : path);
				}
			}
		}, false);
	}
	// 截取必要参数作为对象返回
	function findUrlParas(url) {
		var re = new Object();
		var arr_index = [ url.indexOf("uk="), url.indexOf("shareid="), url.indexOf("path="), url.indexOf("dir=") ];
		var arr_keys = [ "uk", "shareid", "path", "dir" ];
		var i = 0, lastIndex = -1;
		for (i = 0; i < arr_index.length; i++) {
			if (arr_index[i] != -1) {
				lastIndex = url.indexOf("&", arr_index[i]);
				lastIndex = lastIndex == -1 ? url.indexOf("#", arr_index[i]) : lastIndex;
				lastIndex = lastIndex == -1 ? url.length : lastIndex;
				re[arr_keys[i]] = url.substring(arr_index[i], lastIndex);
			} else {
				re[arr_keys[i]] = ""; // 避免未定义出现的异常
			}
		}
		return re;
	}
	function getUrl() {
		return document.URL.replace("://yun.baidu.com/", "://pan.baidu.com/");
	}
}());