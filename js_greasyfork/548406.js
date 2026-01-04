// ==UserScript==
// @name         PT万能签到(不会反复跳转)(自定义ai)
// @namespace    http://tampermonkey.net/
// @version      1.0
// @license      MIT
// @author       noone
// @description  基于(https://greasyfork.org/zh-CN/scripts/497771-pt%E4%B8%87%E8%83%BD%E7%AD%BE%E5%88%B0-%E4%B8%8D%E4%BC%9A%E5%8F%8D%E5%A4%8D%E8%B7%B3%E8%BD%AC)修改 支持99.999%PT站点签到,兼容大聪明,论坛存在签到字样不会反复跳转。
// @grant GM_setValue
// @grant GM_getValue
// @grant GM_deleteValue
// @grant GM_registerMenuCommand
// @grant GM_xmlhttpRequest
// @connect   192.168.*.*
// @connect   movie-pilot.org
// @connect   open.bigmodel.cn
// @run-at       document-end
// @icon  data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACMAAAAgCAYAAACYTcH3AAAAAXNSR0IArs4c6QAAAbxJREFUWEftlz1IQlEUx/9Xn4hBRGNNBdXQh0a1RIsRfdDmUCQ0CAUt0ahCi0sNrrUEDm4NDQ8iomiwIWjRIKmlpaYc4xVU0vPduI8EETOOeXzQ69x73ve9937v3Pu4D8Sj6kYK4E8BxbnFC4EqF14AbAoooVmKDaOIRIZV3eAArqmJ/2JSAPwBxUGqQxL9XxhvRFtzMOxwjuu1LbbXiZeXAiLbn9TOIrTZgb5+J2K7H7ViMpwbp9l4d4z5wto2GA7qVWghjFmaMb7KfBEtDWCS3TCc86yAEVtS9wjLc68FXJ7n62qLgsVlN3p6nOTWkmFIMKRpTDULZzvjOzOx5cJd+oe8Xy2bmZUgB2NkVcGp+p0MtBLIgjw+6Dg5/mqfM42CmPcT9ToQls8vuXF1kYd440qnGRApmIEBBeshj8kgrC8HahaEDEOIJTuiYDmQFSAyMJWAhsechKQc1kptJs/MaHCpQ+K5FSBJmZkClACaW3AjmzOk1rfWnjfkDPmDIYnQhnFvbcmRAfNFtTtwzMgGWq1nDLfMG37fYIwntE4um48DQfPHfzz65gcc+7V+b2WTi+gT4Ejez7sOf+WH3JPmb7nvAAAAAElFTkSuQmCC
// @include    http://hdmayi.com/*
// @include    http://ihdbits.me/*
// @include    https://zhuque.in/*
// @include    https://1ptba.com/*
// @include    https://audiences.me/*
// @include    https://byr.pt/*
// @include    https://ccfbits.org/*
// @include    https://club.hares.top/*
// @include    https://cyanbug.net/*
// @include    https://discfan.net/*
// @include    https://et8.org/*
// @include    https://filelist.io/*
// @include    https://hdatmos.club/*
// @include    https://hdchina.org/*
// @include    https://hdcity.leniter.org/*
// @include    https://hdfans.org/*
// @include    https://hdhome.org/*
// @include    https://hdmayi.com/*
// @include    https://hdsky.me/*
// @include    https://hdtime.org/*
// @include    https://hdvideo.one/*
// @include    https://hhanclub.top/*
// @include    https://hudbt.hust.edu.cn/*
// @include    https://iptorre*
// @include    https://kp.m-team.cc/*
// @include    https://lemonhd.org/*
// @include    https://nanyangpt.com/*
// @include    https://npupt.com/*
// @include    https://ourbits.club/*
// @include    https://piggo.me/*
// @include    https://pt.btschool.club/*
// @include    https://pt.eastgame.org/*
// @include    https://pt.hdbd.us/*
// @include    https://ptchina.org/*
// @include    https://pterclub.com/*
// @include    https://pthome.net/*
// @include    https://totheglory.im/*
// @include    https://www.beitai.pt/*
// @include    https://www.carpet.net/*
// @include    https://www.haidan.video/*
// @include    https://www.hd.ai/*
// @include    https://www.hdarea.co/*
// @include    https://hdarea.club/*
// @include    https://www.hddolby.com/*
// @include    https://www.hdpt.xyz/*
// @include    https://www.htpt.cc/*
// @include    https://www.icc2022.com/*
// @include    https://www.nicept.net/*
// @include    https://www.oshen.win/*
// @include    https://www.pthome.net/*
// @include    https://www.tjupt.org/*
// @include    https://www.torrent*
// @include    https://zmpt.cc/*
// @include    https://carpt.net/*
// @include    https://wintersakura.net/*
// @include    https://sharkpt.net/*
// @include    https://gainbound.net/*
// @include    https://hdvideo.one/*
// @include    https://pt.2xfree.org/*
// @include    http://www.oshen.win/*
// @include    http://uploads.ltd/*
// @include    https://ubits.club/*
// @include    http://hdzone.me/*
// @include    https://pt.soulvoice.club/*
// @include    https://www.gamegamept.com/*
// @include    https://pt.itzmx.com/*
// @include    https://pt.0ff.cc/*
// @include    https://carpt.net/*
// @include    https://www.pttime.org/*
// @include    https://rousi.zip/*
// @include    https://pandapt.net/*
// @include    https://invites.fun/*
// @include    https://wukongwendao.top/*
// @include    https://hdfun.me/*
// @include    https://hhanclub.top/*
// @include    https://pt.hd4fans.org/*
// @include    https://pt.gtk.pw/*
// @include    https://star-space.net/*
// @include    https://u2.dmhy.org/*
// @include    https://www.agsvpt.com/*
// @include    https://www.qingwapt.com/*
// @include    https://pt.cdfile.org/*
// @include    https://bitporn.eu/*
// @include    https://www.haidan.video/*
// @include    https://lemonhd.club/*
// @include    https://leaves.red/*
// @include    https://ptchdbits.co/*
// @downloadURL https://update.greasyfork.org/scripts/548406/PT%E4%B8%87%E8%83%BD%E7%AD%BE%E5%88%B0%28%E4%B8%8D%E4%BC%9A%E5%8F%8D%E5%A4%8D%E8%B7%B3%E8%BD%AC%29%28%E8%87%AA%E5%AE%9A%E4%B9%89ai%29.user.js
// @updateURL https://update.greasyfork.org/scripts/548406/PT%E4%B8%87%E8%83%BD%E7%AD%BE%E5%88%B0%28%E4%B8%8D%E4%BC%9A%E5%8F%8D%E5%A4%8D%E8%B7%B3%E8%BD%AC%29%28%E8%87%AA%E5%AE%9A%E4%B9%89ai%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 注册菜单命令
    GM_registerMenuCommand('重新签到', reload);
    GM_registerMenuCommand('AI设置', showAISettings);

    // 默认AI设置
    const DEFAULT_AI_SETTINGS = {
        model: 'glm-4-flash',
        endpoint: 'https://open.bigmodel.cn/api/paas/v4/chat/completions',
        token: ''
    };

    // 获取AI设置
    function getAISettings() {
        const settings = GM_getValue('aiSettings', DEFAULT_AI_SETTINGS);
        return { ...DEFAULT_AI_SETTINGS, ...settings };
    }

    // 显示AI设置对话框
    function showAISettings() {
        const settings = getAISettings();
        const formHtml = `
            <div style="position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.5); z-index: 10000; display: flex; justify-content: center; align-items: center;">
                <div style="background: white; padding: 20px; border-radius: 8px; width: 500px; max-width: 90%;">
                    <h3>AI设置</h3>
                    <div style="margin-bottom: 15px;">
                        <label style="display: block; margin-bottom: 5px;">模型名称:</label>
                        <input type="text" id="ai-model" value="${settings.model}" style="width: 100%; padding: 5px; box-sizing: border-box;">
                    </div>
                    <div style="margin-bottom: 15px;">
                        <label style="display: block; margin-bottom: 5px;">API端点:</label>
                        <input type="text" id="ai-endpoint" value="${settings.endpoint}" style="width: 100%; padding: 5px; box-sizing: border-box;">
                    </div>
                    <div style="margin-bottom: 15px;">
                        <label style="display: block; margin-bottom: 5px;">认证Token:</label>
                        <input type="password" id="ai-token" value="${settings.token}" style="width: 100%; padding: 5px; box-sizing: border-box;">
                    </div>
                    <div style="text-align: right;">
                        <button id="save-settings" style="padding: 8px 16px; margin-right: 10px; background: #4CAF50; color: white; border: none; border-radius: 4px; cursor: pointer;">保存</button>
                        <button id="cancel-settings" style="padding: 8px 16px; background: #f44336; color: white; border: none; border-radius: 4px; cursor: pointer;">取消</button>
                    </div>
                </div>
            </div>
        `;

        const container = document.createElement('div');
        container.innerHTML = formHtml;
        document.body.appendChild(container);

        container.querySelector('#save-settings').addEventListener('click', () => {
            const newSettings = {
                model: container.querySelector('#ai-model').value,
                endpoint: container.querySelector('#ai-endpoint').value,
                token: container.querySelector('#ai-token').value
            };

            GM_setValue('aiSettings', newSettings);
            document.body.removeChild(container);
            alert('设置已保存！');
        });

        container.querySelector('#cancel-settings').addEventListener('click', () => {
            document.body.removeChild(container);
        });
    }

    const host = window.location.host;
    const href = window.location.href;
    //refresh();
    const AttendanceDay = host + 'AttendanceDay';
    const PreDay=host + 'PreDay';
    const attendanceTexts = [
        "签 到",
        "签到",
        "每日打卡",
        "attend",
        "簽到",
    ];
    function formatDate(date) {
        let year = date.getFullYear();
        let month = (date.getMonth() + 1).toString().padStart(2, '0');
        let day = date.getDate().toString().padStart(2, '0');
        return `${year}-${month}-${day}`;
    }
    const today = formatDate(new Date());
    function xpath(query,node) {
        return document.evaluate(query, node, null,
                                 XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE, null);
    }
    function getElementByXPath(xpath) {
        const result = document.evaluate(
            xpath,
            document,
            null,
            XPathResult.FIRST_ORDERED_NODE_TYPE,
            null
        );
        return result.singleNodeValue;
    }
    function waitRandomSeconds(min, max) {
        return new Promise(resolve => {
            const randomSeconds = Math.random() * (max - min) + min;
            const randomTimeMs = Math.round(randomSeconds * 1000);
            setTimeout(() => {
                console.log(`等待了 ${randomTimeMs} 毫秒 (${randomSeconds.toFixed(2)} 秒)`);
                resolve(); // 完成等待
            }, randomTimeMs);
        });
    }

    function waitForElement(xpath, maxWait = 20, context = document) {
        return new Promise((resolve) => {
            let elapsed = 0;
            const check = setInterval(() => {
                const result = document.evaluate(
                    xpath,
                    context,
                    null,
                    XPathResult.FIRST_ORDERED_NODE_TYPE,
                    null
                );
                const element = result.singleNodeValue;
                if (element) {
                    clearInterval(check);
                    resolve(element);
                } else if (elapsed >= maxWait * 1000) {
                    clearInterval(check);
                    resolve(null);
                }
                elapsed += 500;
            }, 500);
        });
    }
    function getElementAbsolutePosition(element) {
        const rect = element.getBoundingClientRect();
        return {
            x: rect.left + window.pageXOffset,
            y: rect.top + window.pageYOffset
        };
    }
    function simulateNaturalClick(element) {
        const pos = getElementAbsolutePosition(element);
        const rand = Math.random() * 4 - 2;
        const eventConfig = {
            bubbles: true,
            cancelable: true,
            buttons: 1,
            screenX: pos.x+rand,
            screenY: pos.y+rand,
            clientX: pos.x+rand,
            clientY: pos.y+rand
        };
        ['mousedown', 'mouseup', 'click'].forEach(eventType => {
            element.dispatchEvent(
                new MouseEvent(eventType, eventConfig)
            );
        });
        ['focus', 'change'].forEach(eventType => {
            element.dispatchEvent(
                new Event(eventType, eventConfig)
            );
        });
    }

    function toLowerCase(value) {
        return value && value.toString().toLowerCase();
    }


    function verify(img){
        if(img === null){
            const codeList = document.getElementsByTagName('img');
            for (var i = 0; i < codeList.length; i++) {
                var src = codeList[i].src;
                if (codeList[i].alt == "CAPTCHA"){
                    img = codeList[i];
                }
            }
        }
        // console.log("--img:",img.src,img.width,img.height)
        if (img.src && img.width != 0 && img.height != 0) {
            var canvas = document.createElement("canvas");
            var ctx = canvas.getContext("2d");
            canvas.width = img.width;
            canvas.height = img.height;
            ctx.drawImage(img, 0, 0, img.width, img.height);
            var code = canvas.toDataURL("image/png");
            const datas = {
                // "image_file": String(code.split("base64,")[1]),
                "base64_img": String(code.split("base64,")[1])
            }

            const aiSettings = getAISettings();

            GM_xmlhttpRequest({
                method: "POST",
                //url: "http://192.168.246.53/hh",
                url: atob("aHR0cHM6Ly9tb3ZpZS1waWxvdC5vcmcvY2FwdGNoYS9iYXNlNjQ="),
                data: JSON.stringify(datas),
                headers: {
                    "Content-Type": "application/json",
                },
                responseType: "json",
                onload: function(response) {
                    let s = "ABCDEFGHIJKLMNPQRSTUVWY123456789";
                    let result1 = Array(6).join().split(',').map(function() { return s.charAt(Math.floor(Math.random() * s.length)); }).join('');
                    let result = "123456";
                    try {
                        result = JSON.parse(response.responseText).result
                        console.log("result:",result);
                    } catch (error) {
                        console.error("JSON 解析失败:", error);
                    }
                    var resulthash = MD5(result);
                    var inputList = document.getElementsByTagName('input');
                    let i = 0;
                    let j = 0;
                    for (; j < inputList.length; j++) {
                        let attr = inputList[j].name;
                        if (attr == "imagestring") {
                            inputList[j].value=result;
                            break;
                        }
                    }
                    for (; i < inputList.length; i++) {
                        let attr = inputList[i].name;
                        if (attr == "imagehash") {
                            if(resulthash == inputList[i].value){
                                console.log("识别成功");
                                break;
                            }else{
                                console.log("result1:",result1);
                                inputList[j].value=result1;
                                inputList[i].value=MD5(result1);
                            }
                        }
                    }
                    waitRandomSeconds(1, 3);
                    var showupbutton = document.getElementById('showupbutton');
                    showupbutton.click();
                },
                onerror: function (e){
                    console.log("error",e);
                }
            });
            return;
        }
    }

   function leaves(){
        const question = document.querySelector('input[name="question"]');
        console.log("question.value"+question.value)

        const aiSettings = getAISettings();

        GM_xmlhttpRequest({
            method: "POST",
            url: aiSettings.endpoint,
            headers: {
                "Authorization": "Bearer " + aiSettings.token,
                "Content-Type": "application/json"
            },
            data: JSON.stringify({
                "model": aiSettings.model,
                "temperature": "0.98",
                "messages": [
                    {
                        "role": "user",
                        "content": "作为一名贴吧味很浓的热心用户，不需要给出理由，请为我接下来的所有问题做出简短的一句话作为回答，不要带标点符号"
                    },
                    {
                        "role": "assistant",
                        "content": "好嘞"
                    },
                    {
                        "role": "user",
                        "content": question.value
                    }
                ]
            }),
            onload: function(response) {
                console.log("请求成功", JSON.parse(response.responseText));
                let result = JSON.parse(response.responseText).choices
                if (result.length >0){
                    console.log("result:",result[0].message.content);
                    document.getElementById('character').value = result[0].message.content;
                    const moods = [
                        '还不错', '心情不错', '不错', '还行', '嗨皮嗨皮', '有点儿闲',
                        '开心', '兴奋', '平静', '好奇', '充满希望', '略感疲倦',
                        '充满活力', '有些犹豫', '非常感恩', '稍感焦虑', '特别乐观',
                        '有点烦躁', '不太好，有点累', '有些困惑', '非常专注', '略带忧郁',
                        '挺开心的', '很愉快', '有些紧张', '十分满足', '格外冷静',
                        '一般般', '孤独', '郁闷', '超级振奋','激动','焦虑','低落',
                        '没啥感觉', '挺好', '忐忑不安', '无比幸福']
                    const randomMood = moods[Math.floor(Math.random() * moods.length)];
                    document.getElementById('mood').value = randomMood;
                    const uncheckboxes = document.querySelectorAll('input[type="checkbox"][required]:not(:checked)');
                    uncheckboxes.forEach(checkbox => {
                        console.log("simulateNaturalClick checkbox")
                        simulateNaturalClick(checkbox);
                    });
                    waitRandomSeconds(6, 12);
                    // sign
                }
            },
            onerror: function(error) {
                console.error("请求失败", error);
            }
        });
    }
    async function chd(){
        const questionElem = document.querySelector('table table td.text:first-child');
        const question = questionElem ? questionElem.innerText.trim() : '';
        const options = [];
        document.querySelectorAll('input[type="radio"]').forEach(radio => {
            const text = radio.nextSibling.textContent.trim();
            options.push({
                value: radio.value,
                text: text
            });
        });
        const questionData = { question, options };
        console.log("questionData",questionData);
        if (!questionData.question) {
            throw new Error('未找到问题');
        }

        const aiSettings = getAISettings();

        const q = {
                    "model": aiSettings.model,
                    "temperature": "0.98",
                    "messages": [
                        {
                            "role": "user",
                            "content": "作为一名答题机器人，接下来我会给你一个选择题，选项部分的格式是text'选项内容'，value'选项代号'。请你选择一个最合适的选项，只需要给出问题的value即选项代号就可以了，必须严格回复正确选项的value，不需要给出理由，不要带标点符号"
                        },
                        {
                            "role": "assistant",
                            "content": "好"
                        },
                        {
                            "role": "user",
                            "content": questionData
                        }
                    ]
                };
        console.log(q);
        return new Promise((resolve, reject) => {
            GM_xmlhttpRequest({
                method: "POST",
                url: aiSettings.endpoint,
                headers: {
                    "Authorization": "Bearer " + aiSettings.token,
                    "Content-Type": "application/json"
                },
                data: JSON.stringify(q),
                onload: function(response) {
                    if (response.status === 200) {
                        console.log(response.responseText)
                        let result = JSON.parse(response.responseText).choices
                        console.log(result[0].message.content)
                        const correctValue = result[0].message.content;
                        const radio = document.querySelector(`input[type="radio"][value="${correctValue}"]`);
                       if (!radio) {
                            throw new Error('未找到对应答案选项');
                        }
                        radio.checked = true;
                        document.querySelector('input[name="wantskip"]').click();
                        console.log('答案已提交');
                        resolve(correctValue);
                    } else {
                        reject('API请求失败');
                    }
                },
                onerror: function(error) {
                    console.error("请求失败", error);
                    reject(error);
                }
            });
        });
    }
    function refresh(){
        if(host.indexOf("lemonhd")!=-1 && href.indexOf("signup.php")!=-1){
            let intervalId = setInterval(() => {
                try {
                    var fullXPath = "/html/body/table[2]/tbody/tr/td/table/tbody/tr/td/h2";
                    var h2Element = getElementByXPath(fullXPath);
                    console.log(h2Element);
                    console.log(h2Element.innerText);
                    if(h2Element.innerText === "对不起"){
                        window.location.reload();
                    }else{
                        console.log('clearing the interval');
                        clearInterval(intervalId);
                    }
                } catch (error) {
                    console.error(error);
                    console.log('clearing the interval');
                    clearInterval(intervalId);
                }
            }, 1000);
        }
    }

    function reload(){
        GM_deleteValue(AttendanceDay);
        GM_deleteValue(PreDay);
        window.location.reload();
    }
    function rhex(num) {
        var hex_chr = "0123456789abcdef";
        var str = "";
        for (var j = 0; j <= 3; j++){
            str += hex_chr.charAt((num >> (j * 8 + 4)) & 0x0F) +
                hex_chr.charAt((num >> (j * 8)) & 0x0F);
        }
        return str;
    }
    function str2blks_MD5(str) {
        var nblk = ((str.length + 8) >> 6) + 1;
        var blks = new Array(nblk * 16);
        for (var i = 0; i < nblk * 16; i++) blks[i] = 0;
        for (i = 0; i < str.length; i++){
            blks[i >> 2] |= str.charCodeAt(i) << ((i % 4) * 8);
        }
        blks[i >> 2] |= 0x80 << ((i % 4) * 8);
        blks[nblk * 16 - 2] = str.length * 8;
        return blks;
    }
    function add(x, y) {
        var lsw = (x & 0xFFFF) + (y & 0xFFFF);
        var msw = (x >> 16) + (y >> 16) + (lsw >> 16);
        return (msw << 16) | (lsw & 0xFFFF);
    }
    function rol(num, cnt) {
        return (num << cnt) | (num >>> (32 - cnt));
    }
    function cmn(q, a, b, x, s, t) {
        return add(rol(add(add(a, q), add(x, t)), s), b);
    }
    function ff(a, b, c, d, x, s, t) {
        return cmn((b & c) | ((~b) & d), a, b, x, s, t);
    }
    function gg(a, b, c, d, x, s, t) {
        return cmn((b & d) | (c & (~d)), a, b, x, s, t);
    }
    function hh(a, b, c, d, x, s, t) {
        return cmn(b ^ c ^ d, a, b, x, s, t);
    }
    function ii(a, b, c, d, x, s, t) {
        return cmn(c ^ (b | (~d)), a, b, x, s, t);
    }
    function MD5(str) {
        var x = str2blks_MD5(str);
        var a = 1732584193;
        var b = -271733879;
        var c = -1732584194;
        var d = 271733878;
        for (var i = 0; i < x.length; i += 16) {
            var olda = a;
            var oldb = b;
            var oldc = c;
            var oldd = d;
            a = ff(a, b, c, d, x[i + 0], 7, -680876936);
            d = ff(d, a, b, c, x[i + 1], 12, -389564586);
            c = ff(c, d, a, b, x[i + 2], 17, 606105819);
            b = ff(b, c, d, a, x[i + 3], 22, -1044525330);
            a = ff(a, b, c, d, x[i + 4], 7, -176418897);
            d = ff(d, a, b, c, x[i + 5], 12, 1200080426);
            c = ff(c, d, a, b, x[i + 6], 17, -1473231341);
            b = ff(b, c, d, a, x[i + 7], 22, -45705983);
            a = ff(a, b, c, d, x[i + 8], 7, 1770035416);
            d = ff(d, a, b, c, x[i + 9], 12, -1958414417);
            c = ff(c, d, a, b, x[i + 10], 17, -42063);
            b = ff(b, c, d, a, x[i + 11], 22, -1990404162);
            a = ff(a, b, c, d, x[i + 12], 7, 1804603682);
            d = ff(d, a, b, c, x[i + 13], 12, -40341101);
            c = ff(c, d, a, b, x[i + 14], 17, -1502002290);
            b = ff(b, c, d, a, x[i + 15], 22, 1236535329);
            a = gg(a, b, c, d, x[i + 1], 5, -165796510);
            d = gg(d, a, b, c, x[i + 6], 9, -1069501632);
            c = gg(c, d, a, b, x[i + 11], 14, 643717713);
            b = gg(b, c, d, a, x[i + 0], 20, -373897302);
            a = gg(a, b, c, d, x[i + 5], 5, -701558691);
            d = gg(d, a, b, c, x[i + 10], 9, 38016083);
            c = gg(c, d, a, b, x[i + 15], 14, -660478335);
            b = gg(b, c, d, a, x[i + 4], 20, -405537848);
            a = gg(a, b, c, d, x[i + 9], 5, 568446438);
            d = gg(d, a, b, c, x[i + 14], 9, -1019803690);
            c = gg(c, d, a, b, x[i + 3], 14, -187363961);
            b = gg(b, c, d, a, x[i + 8], 20, 1163531501);
            a = gg(a, b, c, d, x[i + 13], 5, -1444681467);
            d = gg(d, a, b, c, x[i + 2], 9, -51403784);
            c = gg(c, d, a, b, x[i + 7], 14, 1735328473);
            b = gg(b, c, d, a, x[i + 12], 20, -1926607734);
            a = hh(a, b, c, d, x[i + 5], 4, -378558);
            d = hh(d, a, b, c, x[i + 8], 11, -2022574463);
            c = hh(c, d, a, b, x[i + 11], 16, 1839030562);
            b = hh(b, c, d, a, x[i + 14], 23, -35309556);
            a = hh(a, b, c, d, x[i + 1], 4, -1530992060);
            d = hh(d, a, b, c, x[i + 4], 11, 1272893353);
            c = hh(c, d, a, b, x[i + 7], 16, -155497632);
            b = hh(b, c, d, a, x[i + 10], 23, -1094730640);
            a = hh(a, b, c, d, x[i + 13], 4, 681279174);
            d = hh(d, a, b, c, x[i + 0], 11, -358537222);
            c = hh(c, d, a, b, x[i + 3], 16, -722521979);
            b = hh(b, c, d, a, x[i + 6], 23, 76029189);
            a = hh(a, b, c, d, x[i + 9], 4, -640364487);
            d = hh(d, a, b, c, x[i + 12], 11, -421815835);
            c = hh(c, d, a, b, x[i + 15], 16, 530742520);
            b = hh(b, c, d, a, x[i + 2], 23, -995338651);
            a = ii(a, b, c, d, x[i + 0], 6, -198630844);
            d = ii(d, a, b, c, x[i + 7], 10, 1126891415);
            c = ii(c, d, a, b, x[i + 14], 15, -1416354905);
            b = ii(b, c, d, a, x[i + 5], 21, -57434055);
            a = ii(a, b, c, d, x[i + 12], 6, 1700485571);
            d = ii(d, a, b, c, x[i + 3], 10, -1894986606);
            c = ii(c, d, a, b, x[i + 10], 15, -1051523);
            b = ii(b, c, d, a, x[i + 1], 21, -2054922799);
            a = ii(a, b, c, d, x[i + 8], 6, 1873313359);
            d = ii(d, a, b, c, x[i + 15], 10, -30611744);
            c = ii(c, d, a, b, x[i + 6], 15, -1560198380);
            b = ii(b, c, d, a, x[i + 13], 21, 1309151649);
            a = ii(a, b, c, d, x[i + 4], 6, -145523070);
            d = ii(d, a, b, c, x[i + 11], 10, -1120210379);
            c = ii(c, d, a, b, x[i + 2], 15, 718787259);
            b = ii(b, c, d, a, x[i + 9], 21, -343485551);
            a = add(a, olda);
            b = add(b, oldb);
            c = add(c, oldc);
            d = add(d, oldd);
        }
        return rhex(a) + rhex(b) + rhex(c) + rhex(d);
    }

    async function attendance(){
        const lastAttendanceDay = GM_getValue(AttendanceDay);
        if (lastAttendanceDay === today) {
            console.log("今日已签到:"+lastAttendanceDay);
            return;
        }

        let tElements = xpath("//text()[contains(translate(normalize-space(.), 'ABCDEFGHIJKLMNOPQRSTUVWXYZ', 'abcdefghijklmnopqrstuvwxyz'),'签到')]",document).snapshotItem(0);
        if (tElements && tElements.data && tElements.data.indexOf("已") != -1) {
            console.log("检测到已签到:" + window.location.host);
            GM_setValue(AttendanceDay, today);
        }
        if(host.indexOf("leaves")!=-1 ){
            if(href.indexOf("attendance")==-1){
                const signButton = await waitForElement('//a[contains(@class, "info-item") and normalize-space()="立即签到"]');
                signButton.click();
            }else{
                const parent = await waitForElement('//*[@id="rlcaptcha-box"]');
                if (!parent) {
                    throw new Error("父元素 rlcaptcha-box 未找到");
                }
                const rlcaptchaBox = await waitForElement('.//div[contains(@class, "mosparo__row")]', 360, parent);
                if (rlcaptchaBox) {
                    console.log("rlcaptchaBox loaded");
                    leaves();
                    GM_setValue(AttendanceDay, today);
                }
            }
            return;
        }

        if(host.indexOf("ptchdbits")!=-1 ){
            if(href.indexOf("bakatest")==-1){
                const signButton = await waitForElement('//a[contains(@href, "bakatest.php")]');
                signButton.click();
            }else{
                await waitRandomSeconds(1, 2);
                await chd();
                GM_setValue(AttendanceDay, today);
            }
            return;
        }

        for (var index in attendanceTexts) {
            const text = attendanceTexts[index];
            const allElements = xpath("//*[contains(translate(normalize-space(text()), 'ABCDEFGHIJKLMNOPQRSTUVWXYZ', 'abcdefghijklmnopqrstuvwxyz'),'"+text+"')]",document);
            for (var i = 0; i < allElements.snapshotLength; i++) {
                const ptSignElements = allElements.snapshotItem(i);
                if (ptSignElements != null) {
                    if (toLowerCase(ptSignElements.innerText).indexOf(text) != -1) {
                        //console.log("触发跳转:"+lastAttendanceDay);
                        try{
                            if(href.indexOf("attendance.php")==-1){
                                if(host.indexOf("ourbits")!=-1 ){
                                    //eslint-disable-next-line no-loop-func
                                    setTimeout(function(){ptSignElements.click();},5000);
                                }else if(host.indexOf("hdsky")!=-1 ){
                                    //eslint-disable-next-line no-loop-func
                                    setTimeout(function(){ptSignElements.click();},5000);
                                    let firstload = true;
                                    //eslint-disable-next-line no-loop-func
                                    const imgElObserver = new MutationObserver((mutations) => {
                                        mutations.forEach(function(mutation) {
                                            mutation.addedNodes.forEach(node =>{
                                                let img = xpath("//*/img[@id='showupimg']",node);
                                                if(img.snapshotLength === 1 && firstload){
                                                    firstload = false;
                                                    img = document.getElementById('showupimg');
                                                    img.addEventListener('load',() => {
                                                        console.log('Image loaded');
                                                        verify(img);
                                                    });
                                                    img.addEventListener('error',() => {
                                                        console.log('Error loading image');
                                                    })
                                                }
                                            });
                                        });
                                    });
                                    imgElObserver.observe(document.body, {
                                        subtree: true,
                                        childList: true,
                                        attributes: true,
                                    });
                                }else{
                                    ptSignElements.click();
                                }
                            }
                            console.log("签到:" + window.location.host);
                            GM_setValue(AttendanceDay, today);
                        } catch (error) {
                            // do nothing
                            console.log("error:"+error);
                        }
                    }
                }
            }
        }
    }

    async function preHandle(){
        if(host.indexOf("lemonhd")!=-1){
            return (async function handleLemonHD(){
                try {
                    if(href.indexOf("lottery.php") === -1){
                        //const syElement = getElementByXPath("/html/body/table[2]/tbody/tr[1]/td/table[2]/tbody/tr/td/table/tbody/tr/td[1]/div[1]/a[4]/b");
                        const syElement = getElementByXPath("//a[b[contains(text(),'神游')]]");
                        if(syElement?.innerText.includes("神游")){
                            console.log('开始导航至抽奖页面');
                            await new Promise(resolve => {
                                const checkNavigation = setInterval(() => {
                                    if(window.location.href.indexOf("lottery.php") !== -1){
                                        clearInterval(checkNavigation);
                                        resolve();
                                    }
                                }, 500);
                                syElement.click();
                            });
                        }
                        return; // 中断后续流程等待页面刷新
                    }
                    console.log('已到达抽奖页面');
                    const button = await waitForElement("/html/body/table[2]/tbody/tr[2]/td/table[1]/tbody/tr[4]/td/div/form[1]/button");
                    if (button && !button.disabled) {
                        console.log('触发免费神游');
                        button.click();
                        GM_setValue(PreDay, today);
                        await new Promise(r => setTimeout(r, 3000)); // 等待操作完成
                    }else if(button.disabled){
                        console.log('已使用免费神游');
                        GM_setValue(PreDay, today);
                    }
                } catch (error) {
                    console.error('LemonHD处理异常:', error);
                }
            })();
        }else if(host.indexOf("zhuque")!=-1){
            console.log("批量释放技能");
            return (async function handleZhuque(){
                const csrfToken = document.querySelector('meta[name="x-csrf-token"]')?.content;
                console.log("csrfToken:",csrfToken);
                GM_xmlhttpRequest({
                    method: "POST",
                    url: "/api/gaming/fireGenshinCharacterMagic",
                    data: JSON.stringify({"all": 1, "resetModal": true}),
                    headers: {
                        "Content-Type": "application/json",
                        "x-csrf-token": csrfToken
                    },
                    responseType: "json",
                    onload: function(response) {
                        try {
                            let status = JSON.parse(response.responseText).status
                            console.log("批量释放成功:", response.responseText);
                            GM_setValue(PreDay, today);
                        } catch (error) {
                            console.error("批量释放失败:", error);
                        }
                    },
                    onerror: function (e){
                        console.error("批量释放失败:", e);
                    }
                });
            })();
        }else{
            GM_setValue(PreDay, today);
        }
    }

    (async () => {
        await waitRandomSeconds(1, 2)
        const lastPreDay = GM_getValue(PreDay);
        if (lastPreDay === today) {
            console.log("今日已预处理:"+lastPreDay);
            attendance();
        }else {
            await preHandle();
            await attendance();
        }
    })();
})();