// ==UserScript==
// @name         深技大安全实验室学时 每五分钟自动确定
// @name:zh-CN   深技大安全实验室学时 每五分钟自动确定
// @version      1.0
// @description  针对深圳技术大学大学实验网刷学时用，不再受5分钟确认提示框干扰。
// @author       You
// @match        *://10.1.20.14/*
// @grant        none
// @namespace https://greasyfork.org/users/1372398
// @downloadURL https://update.greasyfork.org/scripts/552058/%E6%B7%B1%E6%8A%80%E5%A4%A7%E5%AE%89%E5%85%A8%E5%AE%9E%E9%AA%8C%E5%AE%A4%E5%AD%A6%E6%97%B6%20%E6%AF%8F%E4%BA%94%E5%88%86%E9%92%9F%E8%87%AA%E5%8A%A8%E7%A1%AE%E5%AE%9A.user.js
// @updateURL https://update.greasyfork.org/scripts/552058/%E6%B7%B1%E6%8A%80%E5%A4%A7%E5%AE%89%E5%85%A8%E5%AE%9E%E9%AA%8C%E5%AE%A4%E5%AD%A6%E6%97%B6%20%E6%AF%8F%E4%BA%94%E5%88%86%E9%92%9F%E8%87%AA%E5%8A%A8%E7%A1%AE%E5%AE%9A.meta.js
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