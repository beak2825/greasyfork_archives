// ==UserScript==
// @name         PT种子批量下载
// @name:en      NexusPHP PT torrents batch download
// @version      1.3
// @namespace    http://tampermonkey.net/
// @description  PT种子批量下载插件
// @description:en  NexusPHP PT torrents batch download Plugin
// @author       sdcjj
// @match        https://**/userdetails.php**
// @match        https://**/torrents.php**
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/556630/PT%E7%A7%8D%E5%AD%90%E6%89%B9%E9%87%8F%E4%B8%8B%E8%BD%BD.user.js
// @updateURL https://update.greasyfork.org/scripts/556630/PT%E7%A7%8D%E5%AD%90%E6%89%B9%E9%87%8F%E4%B8%8B%E8%BD%BD.meta.js
// ==/UserScript==

(function () {
    'use strict';

    window.onload = function () {
        initDiv();
        let btn = document.querySelector('#xx_btn_down');
        let href = window.location.href;
        if (href.indexOf("userdetails.php") >= 0) {
            btn.addEventListener('click', function () {
                down_user_torr();
            })
        } else if (href.indexOf("torrents.php") >= 0) {
            btn.addEventListener('click', function () {
                down_torr();
            })
        }

        let url = new URL(window.location.href);
        let params = url.searchParams;
        if (params.get("xx_auto_down") == 1) {
            let xx_input_down_time = params.get("xx_input_down_time");
            document.getElementById('xx_input_down_time').value = xx_input_down_time;
            down_torr();
        }

    }

    async function down_torr() {
        let count= init_down_count('inclbookmarked=');
        if (!count || count <= 0) {
            return;
        }
        init_down_num();
        var torrIds = [];
        await down_page(".torrents", torrIds);
        redirectToNextPage();
    }
    async function down_user_torr() {
        let count = init_down_count("getusertorrentlistajax.php");
        if (!count || count <= 0) {
            return;
        }
        var parentId = "";
        let paginationDiv = document.querySelector('.nexus-pagination');
        if (paginationDiv == null) {
            parentId = findUserParentDiv();
        } else {
            parentId = paginationDiv.parentElement.id;
        }

        var torrIds = [];
        for (let i = 0; i < count; i++) {
            let pageLink = document.querySelector('.nexus-pagination a[href="getusertorrentlistajax.php?page=' + i + '"]');
            if (pageLink) {
                pageLink.click();
                // 等待3秒 等数据加载
                await new Promise(resolve => setTimeout(resolve, 3000));
                // 加载完后执行下载
                init_user_down_num();
                torrIds = await down_page("#" + parentId, torrIds);
            } else {
                init_user_down_num();
                torrIds = await down_page("#" + parentId, torrIds);
            }
        }
        alert('下载完成');
    }

    async function down_page(parentId, torrIds) {
        let openTime = document.getElementById('xx_input_down_time').value;
        let page_torrs = document.querySelectorAll(parentId + ' table a');

        var torrIdsTmp = [];
        for (const page_torr of page_torrs) {
            let href = page_torr.href;
            if (href.indexOf('details.php?id=') < 0) {
                continue;
            }
            //检查torrIds数组里是否存在href
            if (torrIds.includes(href)) {
                continue;
            }
            await new Promise(resolve => setTimeout(resolve, openTime));
            window.open(href.replace("details.php", "download.php"));
            //console.log(href.replace("details.php","download.php"));
            torrIdsTmp.push(href);
        }
        return torrIdsTmp;
    }

    function initDiv() {
        var floatingDiv = document.createElement('div');
        floatingDiv.id = 'floatingDiv';
        floatingDiv.innerHTML = `<h3 style="margin-top: 0px;margin-bottom: 2px;">设置面板</h3>
            <table>
                <tr>
                    <td colspan="2">下载开始后需选择始终允许打开新页面</td>
                </tr>
                <tr>
                    <td colspan="2">用户详情页的种子有很多种类，刷新后先展开指定种类列表再下载</td>
                </tr>
                <tr>
                    <td><label>总页数</label></td>
                    <td><input type="number" id="xx_input_down_count" style="width: 50px;" disabled value=""/></td>
                </tr>
                <tr>
                    <td><label>正在拉取</label></td>
                    <td><b id="xx_input_down_num"></b></td>
                </tr>
                <tr>
                    <td><label>间隔(ms)</label></td>
                    <td><input type="number" id="xx_input_down_time" style="width: 50px;" value="5000"/></td>
                </tr>
                <tr>
                    <td colspan="2"><input id="xx_btn_down" type="button" value="批量下载"/></td>
                </tr>
            </table>`;
        floatingDiv.style.cssText = `
            position: fixed;
            top: 5px;
            left: 5px;
            background-color: rgba(245, 245, 245, 1);
            border: 1px solid rgba(4, 0, 0, 1);
            border-radius: 5px;
            padding: 3px;
            box-shadow: 0 2px 10px #00ff99;
            z-index: 9999;
            max-width: 150px;
            min-width: 100px;
        `;
        document.body.appendChild(floatingDiv);
    }
    function redirectToNextPage() {
        let xx_input_down_count = document.getElementById('xx_input_down_count').value;
        let url = new URL(window.location.href);
        let params = url.searchParams;
        let currentPage = parseInt(params.get("page")) || 0;
        let nextPage = currentPage + 1;
        if (nextPage > xx_input_down_count) {
            alert('下载完成');
            return;
        }

        params.set("page", nextPage);
        params.set("xx_auto_down", 1);

        let xx_input_down_time = document.getElementById('xx_input_down_time').value;
        params.set("xx_input_down_time", xx_input_down_time);
        url.search = params.toString();
        window.location.href = url.toString();
    }

    function init_down_count(tag) {
        let firstPagination = document.querySelector('.nexus-pagination');
        if (!firstPagination) {
            let parentId = findUserParentDiv();
            if (parentId) {
                document.getElementById('xx_input_down_count').value = 1;
                return 1;
            }
            if(tag=="inclbookmarked="){
                firstPagination=document.querySelector("#outer table.main p")
            }else{
                alert('未找到种子列表，请先展开种子列表');
                return 0;
            }
        }
        let paginationLinks = firstPagination.querySelectorAll('a');
        var count = 0;
        paginationLinks.forEach(function (link) {
            let href = link.href;
            let url = new URL(href);
            let params = url.searchParams;
            let currentPage = parseInt(params.get("page")) || 0;
            if (currentPage > count) {
                count = currentPage;
            }
        })
        document.getElementById('xx_input_down_count').value = count + 1;
        return count + 1;
    }
    function findUserParentDiv() {
        const ka1 = document.getElementById('ka1');
        const ka2 = document.getElementById('ka2');
        const ka3 = document.getElementById('ka3');
        const ka4 = document.getElementById('ka4');
        const ka5 = document.getElementById('ka5');
        if (ka1 && ka1.innerText) {
            return 'ka1';
        }
        if (ka2 && ka2.innerText) {
            return 'ka2';
        }
        if (ka3 && ka3.innerText) {
            return 'ka3';
        }
        if (ka4 && ka4.innerText) {
            return 'ka4';
        }
        if (ka5 && ka5.innerText) {
            return 'ka5';
        }
        return null;
    }

    function init_down_num() {
        let url = new URL(window.location.href);
        let params = url.searchParams;
        let currentPage = parseInt(params.get("page")) || 0;
        document.getElementById('xx_input_down_num').textContent = "第" + (currentPage + 1) + "页";
    }
    function init_user_down_num() {
        let firstPagination = document.querySelector('.nexus-pagination');
        if (!firstPagination) {
            document.getElementById('xx_input_down_num').textContent = "第1页";
            return;
        }
        let pageFonts = firstPagination.querySelectorAll('.nexus-pagination font');
        for (const pageFont of pageFonts) {
            if (pageFont.textContent.indexOf('页') > 0) {
                continue;
            }
            document.getElementById('xx_input_down_num').textContent = pageFont.textContent;
            break;
        }
    }
})();
