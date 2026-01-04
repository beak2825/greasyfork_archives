// ==UserScript==
// @name         抖音用户数据助手
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  抖音用户数据提取与处理工具，支持高亮和隐藏模式
// @author       寻源
// @match        https://www.douyin.com/*
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_registerMenuCommand
// @require      https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.18.5/xlsx.full.min.js
// @downloadURL https://update.greasyfork.org/scripts/548090/%E6%8A%96%E9%9F%B3%E7%94%A8%E6%88%B7%E6%95%B0%E6%8D%AE%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/548090/%E6%8A%96%E9%9F%B3%E7%94%A8%E6%88%B7%E6%95%B0%E6%8D%AE%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 配置和状态
    const MODE_HIGHLIGHT = 'highlight';
    const MODE_HIDE = 'hide';
    let currentMode = GM_getValue('currentMode') || MODE_HIGHLIGHT;
    let abb = GM_getValue('abb') || [];
    let data = "";

    // 创建模式切换菜单
    function createModeMenu() {
        GM_registerMenuCommand(`切换模式: ${currentMode === MODE_HIGHLIGHT ? '高亮模式' : '隐藏模式'}`, toggleMode);
        GM_registerMenuCommand('导入Excel数据 (Shift+W)', getExcel);
        GM_registerMenuCommand('导出排除项 (Z)', txt);
        GM_registerMenuCommand('执行主功能 (W)', main);
    }

    // 切换模式
    function toggleMode() {
        currentMode = currentMode === MODE_HIGHLIGHT ? MODE_HIDE : MODE_HIGHLIGHT;
        GM_setValue('currentMode', currentMode);
        alert(`已切换到${currentMode === MODE_HIGHLIGHT ? '高亮模式' : '隐藏模式'}`);
        // 重新执行主功能以应用新模式
        main();
    }

    // 应用样式到元素
    function applyStyle(element, isRed) {
        if (currentMode === MODE_HIGHLIGHT) {
            element.style.backgroundColor = isRed ? "red" : "green";
            element.style.display = ""; // 确保显示
        } else {
            element.style.display = isRed ? "none" : "";
            element.style.backgroundColor = "";
        }
    }

    // 获取所有值（用于Excel处理）
    function getAllValues(obj) {
        var values = [];
        for (var key in obj) {
            if (typeof obj[key] === 'object') {
                values = values.concat(getAllValues(obj[key]));
            } else {
                values.push(obj[key]);
            }
        }
        return values;
    }

    // 导入Excel数据
    function getExcel() {
        var zName = new Array();
        var zUrl = new Array();
        var input = document.createElement("input");
        input.type = "file";
        input.id = "fileInput"
        input.style.display = "none";
        document.body.appendChild(input);
        input.click();
        input.addEventListener('change', function(event) {
            const file = event.target.files[0];
            if (file) {
                var startTime = performance.now();
                console.log(startTime)
                const reader = new FileReader();
                reader.onload = function(e) {
                    const data = new Uint8Array(e.target.result);
                    const workbook = XLSX.read(data, {
                        type: 'array'
                    });
                    var sheetList = new Array();
                    for (let i = 0; i < workbook.SheetNames.length; i++) {
                        const sheetName = workbook.SheetNames[i];
                        const sheet = workbook.Sheets[sheetName];
                        sheetList[sheetList.length] = XLSX.utils.sheet_to_json(sheet);
                    }
                    let jsonList = sheetList[0];
                    let jsonListlength=jsonList.length;
                    for (let i = 0; i < jsonListlength; i++) {
                        if (jsonList[i].URL != undefined) {
                            let yUrl = jsonList[i].URL.toString();
                            if (yUrl.includes("MS4wLjABAAAA")) {
                                zUrl[zUrl.length] = yUrl.split("MS4wLjABAAAA")[1].split("?")[0];
                            }
                            if (jsonList[i].NAME != undefined) {
                                let yName = jsonList[i].NAME.toString();
                                zName[zName.length] = yName.replace(/\s+/g, "");
                            }
                        }
                    }
                    if (sheetList.length > 1) {
                        let jsonList2 = sheetList[1];
                        let jsArr = getAllValues(jsonList2);
                        console.log(jsArr)
                        zName = [...zName, ...jsArr];
                    }
                    GM_setValue('zName', zName);
                    GM_setValue('zUrl', zUrl);
                    var endTime = performance.now();
                    console.log(endTime)
                    var elapsedTime = endTime - startTime;
                    alert("数据准备完毕，耗时" + elapsedTime/1000 + "秒");
                };
                reader.readAsArrayBuffer(file);
            }
        });

        input.addEventListener('cancel', function() {
            if(document.getElementById("fileInput") !=null){
                document.getElementById("fileInput").remove();
            }
        });
    }

    // 导出排除项
    function txt() {
        abb = Array.from(new Set(abb));
        let data = "";
        for (var u = 0; u < abb.length; u++) {
            data = data + abb[u] + '\n';
        }
        const blob = new Blob([data], {
            type: 'text/plain'
        });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        const now = new Date();
        const year = now.getFullYear();
        const month = ('0' + (now.getMonth() + 1)).slice(-2);
        const day = ('0' + now.getDate()).slice(-2);
        const hours = ('0' + now.getHours()).slice(-2);
        const minutes = ('0' + now.getMinutes()).slice(-2);
        const formattedTime = year + month + day + hours + minutes;
        a.href = url;
        a.download = '排除项' + formattedTime + '.txt';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }

    // 主功能
    function main() {
        var zzz = GM_getValue("zName");
        if(zzz != undefined){
            zzz = [...zzz, ...abb];
            zzz = Array.from(new Set(zzz));
        } else {
            zzz = abb;
        }

        let p = document.evaluate(
            "/html/body/div[2]/div[1]/div[3]/div[3]/div/div/div[1]/div[2]/div[1]/div/div/div", document,
            null, XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE, null);
        for (let o = 0; o < p.snapshotLength; o++) {
            applyStyle(p.snapshotItem(o), true);
        }

        let x = document.evaluate(
            "/html/body/div[2]/div[1]/div[3]/div[3]/div/div/div[1]/div[2]/div[1]/div/div/div/div/div/div/div[2]/div/div[2]/span[1]/span[2]",
            document, null, XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE, null);
        let w = new Array();
        for (let i = 0; i < x.snapshotLength; i++) {
            w[w.length] = x.snapshotItem(i).innerText.replace(/\s+/g, '');
            x.snapshotItem(i).addEventListener('contextmenu', function(event) {
                getName(event);
            });
            x.snapshotItem(i).addEventListener('click', function(event) {
                getName(event);
            });
        }

        let rearr = Array.from(new Set(w));
        console.log(rearr)
        let abc = new Array();
        for (let z = 0; z < rearr.length; z++) {
            if (zzz.includes(rearr[z]) == true) {
                console.log(rearr[z])
                abc[abc.length] = rearr[z]
            }
        }
        rearr = rearr.filter(item => !abc.includes(item));

        for (let k = 0; k < rearr.length; k++) {
            let green = document.evaluate(
                "/html/body/div[2]/div[1]/div[3]/div[3]/div/div/div[1]/div[2]/div[1]/div/div//span[text()='" +
                rearr[k] +
                "']/parent::*/parent::*/parent::*/parent::*/parent::*/parent::*/parent::*/parent::*",
                document, null, XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE, null);
            for (let y = 0; y < green.snapshotLength; y++) {
                applyStyle(green.snapshotItem(y), false);
            }
        }
    }

    // 获取名称
    function getName(event){
        event.preventDefault();
        abb[abb.length]=event.target.innerText.replace(/\s+/g, '');
        setTimeout(() => {
            let red = document.evaluate(
                "/html/body/div[2]/div[1]/div[3]/div[3]/div/div/div[1]/div[2]/div[1]/div/div//span[text()='" +
                abb[abb.length-1] +
                "']/parent::*/parent::*/parent::*/parent::*/parent::*/parent::*/parent::*/parent::*",
                document, null, XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE, null);
            for (let q = 0; q < red.snapshotLength; q++) {
                applyStyle(red.snapshotItem(q), true);
            }
            GM_setValue('abb', abb);
        }, 50);
    }

    // 键盘快捷键
    function keydown(event) {
        if (event.keyCode == 87 && !event.shiftKey) {
            main();
        }
        if (event.keyCode == 90) {
            txt();
        }
        if (event.shiftKey && event.keyCode == 87) {
            getExcel();
        }
    }

    // 主执行逻辑
    const a = window.location.href;

    if (a.includes("user")) {
        // 用户页面逻辑
        window.addEventListener("contextmenu", function(event) {
            event.preventDefault();
            window.close();
        });

        window.onload = function() {
            var key="&amp;";
            let b = a.split("https://www.douyin.com/user/MS4wLjABAAAA").toString().replace(new RegExp(key,'g'),"&");
            var url = GM_getValue("zUrl");
            if (url) {
                url = Array.from(new Set(url));
            } else {
                url = [];
            }
            b = b.split("?")[0].slice(1).toString();
            console.log("url:"+b);
            if (url.includes(b)){
                var r=confirm("URL重复，点击确认关闭本页面");
                if (r==true) {
                    window.close();
                }
            }

            let element = document.evaluate(
                "/html/body/div[2]/div[1]/div[4]/div[2]/div/div/div/div[2]/div[2]/div[1]/h1/span/span/span/span/span/span",
                document, null, XPathResult.ANY_TYPE, null);
            var node = element.iterateNext();
            if (node) {
                var str = node.innerHTML.toString();
                console.log("str+"+str);
                var name="";
                var sArr=str.split("\">");
                if(sArr.length != 1){
                    for(let i=0;i<sArr.length;i++){
                        if(sArr[i].includes('<img draggable')){
                            var lp=sArr[i].split('<img draggable');
                            for(let j=0;j<lp.length;j++){
                                var lpp=lp[j];
                                if(lpp.includes("alt=\"")){
                                    var nap=lpp.split("alt=\"")[1].split("\" src=")[0].trim();
                                    name = name + nap;
                                }else{
                                    name = name + lpp.trim();
                                }
                            }
                        }else{
                            name = name + sArr[i].trim();
                        }
                    }
                }else{
                    name=str;
                }
                console.log("name="+name)
                navigator.clipboard.writeText(name + "\t" + window.location.href);
            }
        }
    } else {
        // 非用户页面逻辑
        createModeMenu();
        document.addEventListener("keydown", keydown);
    }
})();