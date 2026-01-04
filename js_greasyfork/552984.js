// ==UserScript==
// @name         北华大学实验室安全考试刷时长，每5分钟Confirm确认框取消
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  针对北华大学实验室安全考试系统，考前必需的20小时学习用，让你在一个页面直接刷时间，不再受5分钟确认提示框干扰。
// @match        https://*webvpn.beihua.edu.cn/*
// @author       Yitxxx
// @license     MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/552984/%E5%8C%97%E5%8D%8E%E5%A4%A7%E5%AD%A6%E5%AE%9E%E9%AA%8C%E5%AE%A4%E5%AE%89%E5%85%A8%E8%80%83%E8%AF%95%E5%88%B7%E6%97%B6%E9%95%BF%EF%BC%8C%E6%AF%8F5%E5%88%86%E9%92%9FConfirm%E7%A1%AE%E8%AE%A4%E6%A1%86%E5%8F%96%E6%B6%88.user.js
// @updateURL https://update.greasyfork.org/scripts/552984/%E5%8C%97%E5%8D%8E%E5%A4%A7%E5%AD%A6%E5%AE%9E%E9%AA%8C%E5%AE%A4%E5%AE%89%E5%85%A8%E8%80%83%E8%AF%95%E5%88%B7%E6%97%B6%E9%95%BF%EF%BC%8C%E6%AF%8F5%E5%88%86%E9%92%9FConfirm%E7%A1%AE%E8%AE%A4%E6%A1%86%E5%8F%96%E6%B6%88.meta.js
// ==/UserScript==

(function() {
    'use strict';
let cf = window.confirm;
window.confirm = function(...args){
	if(args[0].indexOf("5分钟")>=0){
		return true;
	}else{
		return cf(...args)
	}
}
})();
