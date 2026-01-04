// ==UserScript==
// @name         JDFZSystemHacker
// @namespace    http://tampermonkey.net/
// @version      1.0.0
// @description  开发仅供娱乐，因本脚本造成的一切后果，开发者概不负责
// @author       JH_Developer
// @match        https://fz.sjtu.edu.cn/*
// @require      https://cdn.jsdelivr.net/npm/lil-gui@0.16
// @icon         https://static.dao3.fun/block/Qme2PuAngt72Z6afBJmcX87TJ9tNrsRpJDLS2huUuqDshh.ico
// @license      GPL-3.0-only
// @grant        GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/554477/JDFZSystemHacker.user.js
// @updateURL https://update.greasyfork.org/scripts/554477/JDFZSystemHacker.meta.js
// ==/UserScript==

(async function() {
    'use strict';
    function sleep(ms) {
        return new Promise(function (resolve, reject) {
            setTimeout(() => {
                console.log('sleep end');
                resolve();
            }, ms);
        });
    };
    var keep_Services = {
        '刷新':() => {
            window.location.reload();
        }
    };
    var services = {};
    if(document.getElementsByClassName('layui-btn layui-btn-sm layui-btn-normal').length > 0) {
        services['[慎用]获得可编辑课程内容权限'] = async function() {
            const g = prompt('！您正在使用危险功能！\n如果按下了按钮，请确保不会将其拿来做任何影响他人的事，造成的后果开发者不负责，不负责，不负责\n输入"确认,我会承担一切后果"以使用它的功能');
            if(g == "确认,我会承担一切后果") {
                alert('本功能由于太过逆天吓坏了开发者，已被删除');
            }
        }
    }
    if(document.getElementsByClassName('layui-card-header').length > 0) {
        if(document.getElementsByClassName('layui-card-header')[0].textContent.includes('在线选课')){
            services['[慎用]将所有选课更改为可选择'] = async function() {
                const g = prompt('！您正在使用危险功能！\n如果按下了按钮，请确保不会将其拿来做任何影响他人的事，造成的后果开发者不负责，不负责，不负责\n输入"确认,我会承担一切后果"以使用它的功能');
                if(g == "确认,我会承担一切后果") {
                    while(document.getElementsByClassName('layui-btn layui-btn-sm layui-btn-disabled').length > 0) {
                        for(let i of document.getElementsByClassName('layui-btn layui-btn-sm layui-btn-disabled')) {
                            i.className = 'layui-btn layui-btn-sm layui-btn-enabled';
                            i.attributes['lay-event'].value = "choose";
                        }
                        await sleep(1);
                    }
                }
            }
        }
    }
    if(document.getElementById('show')) {
        if(document.getElementById('show').textContent.includes('百分比')){
            services['直接查看百分比'] = async function() {
                while(document.getElementsByClassName('hidden').length > 0) {
                    for(let i of document.getElementsByClassName('hidden')) i.className='';
                    await sleep(1);
                }
            }
        }
    }
    if(Object.keys(services).length > 0) {
        window.gui = new lil.GUI({ title: 'JZHacker' });
        window.gui.domElement.style.top = 'unset';
        window.gui.domElement.style.bottom = '0';
        window.gui.domElement.style.userSelect = 'none';
        var page = gui.addFolder('普通功能');
        for(let i of Object.keys(services)) {
            page.add(services,i).name(i);
        }
        var page2 = gui.addFolder('保留功能');
        page2.add(keep_Services,'刷新').name('刷新');
    }
})();