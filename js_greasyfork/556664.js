// ==UserScript==
// @name        巴哈姆特动画疯 XML格式弹幕下载器
// @name:zh-TW  巴哈姆特動畫瘋 XML格式彈幕下載器
// @name:zh-CN  巴哈姆特动画疯 XML格式弹幕下载器
// @namespace   https://github.com/tiansh
// @description 以XML字幕格式保存巴哈姆特动画疯的弹幕
// @description:zh-TW  以XML格式保存巴哈姆特的彈幕
// @description:zh-cn  以XML格式保存巴哈姆特的弹幕
// @include     https://ani.gamer.com.tw/*
// @version     2.1-xml-吟语版
// @grant       GM_addStyle
// @grant       GM_getValue
// @grant       GM_setValue
// @grant       GM_registerMenuCommand
// @connect     ani.gamer.com.tw
// @run-at      document-start
// @author      吟语
// @copyright   2024+, 吟语
// @license     Mozilla Public License 2.0; http://www.mozilla.org/MPL/2.0/
// @license     CC Attribution-ShareAlike 4.0 International; http://creativecommons.org/licenses/by-sa/4.0/
// @downloadURL https://update.greasyfork.org/scripts/556664/%E5%B7%B4%E5%93%88%E5%A7%86%E7%89%B9%E5%8A%A8%E7%94%BB%E7%96%AF%20XML%E6%A0%BC%E5%BC%8F%E5%BC%B9%E5%B9%95%E4%B8%8B%E8%BD%BD%E5%99%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/556664/%E5%B7%B4%E5%93%88%E5%A7%86%E7%89%B9%E5%8A%A8%E7%94%BB%E7%96%AF%20XML%E6%A0%BC%E5%BC%8F%E5%BC%B9%E5%B9%95%E4%B8%8B%E8%BD%BD%E5%99%A8.meta.js
// ==/UserScript==

// 设置项
var defconfig = {
    'enablePlayPageButtoms': true,
    'enableDaylistButtoms': true,
    'enableNewanimelistButtoms': true,
    'debug': false,
    'language': "zh_tw"
};

//读取设置
var config = GM_getValue("config", null);
if (config === null) {
    GM_setValue("config", defconfig);
    config = defconfig;
};
//填充默认值
for (let key in defconfig) {
    if (!(key in config)) config[key] = defconfig[key];
};
var debug = config.debug ? console.log.bind(console) : function() {};

//html模板
var settingPanelHTMLtemplate = `
<div class="assdanmakusetting-window">
    <div class="assdanmakusetting-title" style="border-bottom: 1px solid black; height: 54px;">
        <button class="assdanmakusetting-exitbutton" title="{{exit}}" onclick="document.querySelector('.assdanmakusetting-window').remove()">{{exit}}</button>
        <button class="assdanmakusetting-savebutton" title="{{save}}">{{save}}</button>
        <p>{{title}}</p>
    </div>
    <form class="assdanmakusetting-container">
    </form>
</div>
`;
var settingItemHTMLtemplate = `
<div class="assdanmakusetting-item">{{content}}</div>
`;
var settingInputHTMLtemplate = `
<lable for="{{key}}" title="{{key}}">{{description}}</lable>
<button type="button" act="setval" acp="def" title="{{butsetdeftitle}}">{{butsetdef}}</button>
<button type="button" act="setval" acp="cur" title="{{butsetcurtitle}}">{{butsetcur}}</button>
<{{htmltag}} name="{{key}}" {{attr}}>{{content}}</{{htmltag}}>
`;
var last3ButtonHTMLtemplate = `
{{title}}
<button type="button" act="executecode">{{executecode}}</button>
<button type="button" act="editconfig">{{editconfig}}</button>
<button type="button" act="resetconfig">{{resetconfig}}</button>
`;
var settingOptionsHTMLtemplate = `
<option value="{{value}}">{{text}}</option>
`;
var injectedCSS = `
.assdanmakusetting-window {
    position: fixed;
    left: 50%;
    top: 50%;
    transform: translateX(-50%) translateY(-50%);
    width: 40%;
    height: 60%;
    min-width: 480px;
    z-index: 114514;
    overflow: hidden;
    background: whitesmoke;
    border: 1px solid black;
    box-shadow: 2px 2px 2px 2px rgb(119, 119, 119);
    border-radius: 4px;
}
.assdanmakusetting-title button {
    color: black;
    font-size: 24px;
    float: right;
    top: 2.5%;
    border: 2px solid black;
    margin: 8px 8px 8px 0px;
    background: gainsboro;
    font-family: "Arial, sans-serif";
    border-radius: 6px;
}
.assdanmakusetting-title p{
    font-size: 24px;
    float: left;
    margin: 16px;
    line-height: 1em;
    z-index: -1;
}
.assdanmakusetting-container {
    overflow: auto;
    height: calc(100% - 58px);
    width: 100%;
}
.assdanmakusetting-item {
    padding: 8px;
    font-size: 16px;
    word-wrap: break-word;
    width: 100%;
    border-bottom: gainsboro solid 1px;
    overflow: hidden;
}
.assdanmakusetting-item input,.assdanmakusetting-item button,.assdanmakusetting-item select{
    float: right;
    margin: 4px;
}
.assdanmakusetting-savebutton:hover {
    color: white;
    background: #37e;
}
.assdanmakusetting-savebutton:active {
    background: #6ce;
}
.assdanmakusetting-exitbutton:hover {
    color: white;
    background: #e44;
}
.assdanmakusetting-exitbutton:active {
    background: #b33;
}
.listgetassdanmaku-button {
    padding: 4px 4px;
    border-radius: 5px;
    background-color: var(--baha-primary-color);
    z-index: 4;
    color: #EEE;
    white-space: nowrap;
}
.listdownloadbutton {
    border: 1px solid var(--btn-favorite-video);
    border-radius: 4px;
    color: var(--btn-favorite-video);
    cursor: pointer;
    padding: 5px 0px;
    font-size: 1em;
    background: transparent;
    margin-right: 5px;
    width: 30px;
    text-align: center;
}
.listdownloadbutton:hover {
    background-color: var(--btn-favorite-video);
    color: rgba(var(--anime-white-rgb), 0.95);
}
.ahveuiw:after {
    content: "" !important;
}
.day-list .text-anime-info {
  position: relative;
}
.day-list .text-anime-info .listgetassdanmaku-button{
  position: absolute;
  bottom: 12.5px;
}
`;

//多语言
var lang = new Object();

var l10n = {
    'name': "正體中文",
    'text': {
        'getdanmaku': "獲取XML彈幕",
        'episodelistgetdanmaku': "下載XML彈幕:"
    },
    'message': {
        'xhrfailed': "獲取失敗",
        'invalidsnid': "無效的SN/Url",
        'invalidsnidlog': "字串中未找到SN號:",
        'getdanmakuformsn': "請輸入SN號或動畫頁面的URL:",
        'gotdanmaku': "獲取了 %d 個彈幕, 從 %s",
        'confirmresetconfig':"您確定要重設設定嗎? 這將重新整理頁面",
        'editconfig': "確定後將立即儲存, 如果再點擊儲存將導致設定被覆蓋, 部分選項仍需要重新整理頁面才能生效",
        'configsaved': "設定已儲存"
    },
    'ui':{
        'setting': "設定",
        'getdanmakuformsn': "從SN號獲取彈幕",
        'settingpaneltitle': "XML格式彈幕下載器設定",
        'save': "儲存",
        'exit': "退出",
        'defaultvalue': "預設值",
        'currenttvalue': "当前值",
        'resetconfig': "重設設定",
        'editconfig': "直接編輯設定(匯入/匯出)",
        'executecode': "執行程式碼",
        'misc': "其他選項",
        'true': "是",
        'false': "否",
        'butsetdeftitle': "設為預設值",
        'butsetcurtitle': "設為目前值"
    },
    'config':{
        'description': {
            'debug': "列印除錯資訊",
            'language': "介面語言 (重新整理生效)",
            'enablePlayPageButtoms': "添加彈幕下載按鈕至動畫播放頁面",
            'enableDaylistButtoms': "添加彈幕下載按鈕至首頁的'週期表'",
            'enableNewanimelistButtoms': "添加彈幕下載按鈕至首頁的'本季新番'"
        },
        'errormsg': {
            'fontlist': ''
        }
    }
};

lang.zh_tw = { 'name': "正體中文" };

//设置面板项
var settingitems = {
    'enablePlayPageButtoms': {
        'htmltag': "select",
        'type': "boolean",
        'exattr': [],
         get options() {
             return [["true", l10n.ui.true], ["false", l10n.ui.false]];
         }
    },
    'enableDaylistButtoms': {
        'htmltag': "select",
        'type': "boolean",
        'exattr': [],
         get options() {
             return [["true", l10n.ui.true], ["false", l10n.ui.false]];
         }
    },
    'enableNewanimelistButtoms': {
        'htmltag': "select",
        'type': "boolean",
        'exattr': [],
         get options() {
             return [["true", l10n.ui.true], ["false", l10n.ui.false]];
         }
    },
    'debug': {
        'htmltag': "select",
        'type': "boolean",
        'exattr': [],
         get options() {
             return [["true", l10n.ui.true], ["false", l10n.ui.false]];
         }
    },
    'language': {
        'htmltag': "select",
        'type': "string",
        'exattr': [],
         get options() {
             var out = new Array();
             for (let key in lang) {
                 out.push([key, lang[key].name]);
             };
             return out;
         }
    }
};

// 将字典中的值填入字符串
var fillStr = function(str) {
    var dict = Array.apply(Array, arguments);
    return str.replace(/{{([^}]+)}}/g, function(r, o) {
        var ret;
        dict.some(function(i) {
            return ret = i[o];
        });
        return ret || '';
    });
};

// 创建下载
var startDownload = function(data, filename) {
    var blob = new Blob([data], {
        type: 'text/xml'
    });
    var url = window.URL.createObjectURL(blob);
    var saveas = document.createElement('a');
    saveas.href = url;
    saveas.style.display = 'none';
    document.body.appendChild(saveas);
    saveas.download = filename;
    saveas.click();
    setTimeout(function() {
        saveas.parentNode.removeChild(saveas);
    }, 1000)
    document.addEventListener('unload', function() {
        window.URL.revokeObjectURL(url);
    });
};

// 生成 XML 内容
var generateXML = function(danmaku, info) {
    var xml = '<?xml version="1.0" encoding="UTF-8"?>\n<i>\n';
    
    // 排序弹幕
    danmaku.sort(function(a, b) {
        return a.time - b.time;
    });

    danmaku.forEach(function(line) {
        // Bilibili XML 格式标准:
        // <d p="Time,Mode,Size,Color,Timestamp,Pool,UserHash,RowID">Content</d>
        var modeMap = {
            'R2L': 1,
            'TOP': 5,
            'BOTTOM': 4
        };
        
        var time = line.time; 
        var mode = modeMap[line.mode] || 1;
        var size = 25; // 默认字号
        var color = parseInt(line.color, 16); // Hex string to Int
        var timestamp = Math.floor(new Date().getTime() / 1000); // 当前时间戳
        var pool = 0;
        var userHash = line.sender || "0";
        var rowId = 0;

        var pAttr = [time, mode, size, color, timestamp, pool, userHash, rowId].join(',');
        
        // 转义 XML 特殊字符
        var content = line.text
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&apos;");

        xml += '    <d p="' + pAttr + '">' + content + '</d>\n';
    });

    xml += '</i>';
    return xml;
};

/*
 * 设置面板部分
 */
//保存设置
var stringToNumberOrBoolean = function(input) {
    var output = parseFloat(input);
    if (!isNaN(output)) return output;
    output = input.trim().toLowerCase();
    if (output === "true") return true;
    if (output === "false") return false;
    return input;
};
var saveSetting = function(e) {
    e.preventDefault();
    if (document.querySelector(".assdanmakusetting-container").reportValidity()) {
        for (let item of document.querySelector(".assdanmakusetting-container").querySelectorAll("input, select")) {
            var parser = stringToNumberOrBoolean;
            if ((item.tagName == "INPUT") && (item.type == "text")) {
                switch (settingitems?.[item.name]?.datatype) {
                    case "array":
                        parser = (input) => input.split(',');
                        break;
                    default:
                };
            };
            config[item.name] = parser(item.value);
        };
        GM_setValue("config", config);
        debug = config.debug ? console.log.bind(console) : function() {};
        alert(l10n.message.configsaved);
    };
};
//创建设置面板
var openSettingPanel = function() {
    if (document.querySelector(".assdanmakusetting-window") == null) {
        document.body.insertAdjacentHTML("beforeend", fillStr(settingPanelHTMLtemplate, {
            'title': l10n.ui.settingpaneltitle,
            'save': l10n.ui.save,
            'exit': l10n.ui.exit
        }));
        document.querySelector(".assdanmakusetting-savebutton").addEventListener('click', saveSetting);
        var container = document.querySelector(".assdanmakusetting-container");
        //添加设置项
        for (let key in settingitems) {
            var item = settingitems[key];
            var content = "";
            var attr = "";
            switch (item.htmltag) {
                case "input":
                    for (let i of item.exattr) {
                        attr = attr + i[0] + '="' + i[1] +'" ';
                    };
                    attr = attr + `type="${item.type}"`;
                    attr = attr + `value="${config[key]}"`;
                    content = fillStr(settingInputHTMLtemplate, {
                        'key': key,
                        'butsetdef': l10n.ui.defaultvalue,
                        'butsetcur': l10n.ui.currenttvalue,
                        'butsetdeftitle': l10n.ui.butsetdeftitle,
                        'butsetcurtitle': l10n.ui.butsetcurtitle,
                        'htmltag': "input",
                        'attr': attr,
                        'content': "",
                        'description': l10n.config.description[key]
                    });
                    container.insertAdjacentHTML("beforeend", fillStr(settingItemHTMLtemplate, {content: content}));
                    break;
                case "select":
                    var options = "";
                    for (let option of item.options) {
                        options = options + fillStr(settingOptionsHTMLtemplate, {
                            'value': option[0],
                            'text': option[1],
                        });
                    };
                    for (let i of item.exattr) {
                        attr = attr + i[0] + '="' + i[1] +'" ';
                    };
                    content = fillStr(settingInputHTMLtemplate, {
                        'key': key,
                        'butsetdef': l10n.ui.defaultvalue,
                        'butsetcur': l10n.ui.currenttvalue,
                        'butsetdeftitle': l10n.ui.butsetdeftitle,
                        'butsetcurtitle': l10n.ui.butsetcurtitle,
                        'htmltag': "select",
                        'attr': attr,
                        'content': options,
                        'description': l10n.config.description[key]
                    });
                    container.insertAdjacentHTML("beforeend", fillStr(settingItemHTMLtemplate, {content: content}));
                    container.lastElementChild.querySelector("select").value = config[key];
                    break;
                default:
            };
        };
        //最后几个按钮
        container.insertAdjacentHTML("beforeend", fillStr(settingItemHTMLtemplate, {
            'content': fillStr(last3ButtonHTMLtemplate, {
                'executecode': l10n.ui.executecode,
                'editconfig': l10n.ui.editconfig,
                'resetconfig': l10n.ui.resetconfig,
                'title': l10n.ui.misc
            })
        }));
        //添加事件监听器
        for (let node of container.getElementsByTagName("button")) {
            node.addEventListener("click", settingPanelButtonListener);
        };
        for (let node of container.getElementsByTagName("select")) {
            node.addEventListener("wheel", settingPanelSelectScrollListener);
        };
        for (let node of container.querySelectorAll(`input[type="text"]`)) {
            node.addEventListener("input", settingPanelTextCheckerListener);
        };
    };
};
//设置项按钮处理
var settingPanelButtonListener = function(e) {
    e.preventDefault();
    switch (e.currentTarget.getAttribute("act")) {
        case "setval":
            var inputelement = e.currentTarget.parentElement.querySelectorAll("input, select")[0];
            switch (e.currentTarget.getAttribute("acp")) {
                case "def":
                    inputelement.value = defconfig?.[inputelement.name];
                    break;
                case "cur":
                    inputelement.value = config?.[inputelement.name];
                    break;
                default:
            };
            break;
        case "resetconfig":
            if (confirm(l10n.message.confirmresetconfig)) {
                GM_setValue("config", null);
                location.reload();
            };
            break;
        case "editconfig":
            var input = prompt(l10n.message.editconfig, JSON.stringify(config));
            if (input !== null) {
                config = JSON.parse(input);
                GM_setValue("config", config);
                debug = config.debug ? console.log.bind(console) : function() {};
                alert(l10n.message.configsaved);
            };
            break;
        case "executecode":
            eval(prompt());
            break;
        default:
    };
};
//设置项select滚轮处理
var settingPanelSelectScrollListener = function(e) {
    e.preventDefault();
    if (e.deltaY > 0) {
        if (e.currentTarget.selectedIndex < (e.currentTarget.options.length - 1)) {
            e.currentTarget.selectedIndex++;
        } else {
            e.currentTarget.selectedIndex = 0;
        };
    } else if (e.deltaY < 0) {
        if (e.currentTarget.selectedIndex > 0) {
            e.currentTarget.selectedIndex--;
        } else {
            e.currentTarget.selectedIndex = e.currentTarget.options.length - 1;
        };
    };
};
//设置项text验证处理
var settingPanelTextCheckerListener = function(e) {
    e.currentTarget.reportValidity();
};
/*
 * 下载部分
 */
//发送请求
var sendXHR = function(url, method, data, callback) {
    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = () => {
        if (xhr.readyState === 4) {
            if (xhr.status === 200) callback(xhr.response);
            else alert(l10n.message.xhrfailed + xhr.status);
        }
    };
    xhr.open(method, url);
    xhr.setRequestHeader("Cookie", document.cookie);
    xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded; charset=UTF-8");
    xhr.send(data);
};
//将弹幕转换为XML并保存
var nmina = function(dm, filename, exinfo) {
    var danmaku = dm.map(function(line) {
        return {
            'text': line.text,
            'time': line.time / 10, 
            'color': line.color.substr(1) || "FFFFFF",
            'mode': ['R2L', 'TOP', 'BOTTOM'][line.position],
            'sender': line.userid,
        };
    });
    debug(l10n.message.gotdanmaku, danmaku.length, exinfo.ori);
    var xml = generateXML(danmaku, exinfo);
    startDownload(xml, filename + '.xml');
};
//从SN号获取弹幕
var downloadDanmakuformSN = function(inputstr, filename, exinfo) {
    var snid = /^\d+$/.test(inputstr) ? inputstr : inputstr.match(/((?<=\?sn=)\d+)|((?<=sn)\d+)/)?.at(0);
    if (snid == null) { alert(l10n.message.invalidsnid); debug(l10n.message.invalidsnidlog + inputstr); return; };
    var fname = null;
    var info1 = { 'ori': "https://ani.gamer.com.tw/animeVideo.php?sn=" + snid };
    var gettitle = function(resp) {
        try {
            info1.title = (new DOMParser()).parseFromString(resp, "text/html").title;
        }
        catch (e) { debug(e) };
        sendXHR("https://ani.gamer.com.tw/ajax/danmuGet.php", "POST", "sn=" + snid.toString(10), getdanmu);
    };
    var getdanmu = function(resp) {
        Object.assign(info1,exinfo);
        try {
            fname = info1.title.replace("線上看 - 巴哈姆特動畫瘋", "[Baha]");
        }
        catch (e) { debug(e) };
        nmina(JSON.parse(resp), (filename == null || filename === "") ? fname : filename, info1);
    };
    //如果没有标题则获取标题
    if (exinfo?.hasOwnProperty("title")) sendXHR("https://ani.gamer.com.tw/ajax/danmuGet.php", "POST", "sn=" + snid.toString(10), getdanmu);
    else sendXHR("https://ani.gamer.com.tw/animeVideo.php?sn=" + snid, "GET", null, gettitle);
};
/*
 * 页面部分
 */
//下载按钮事件监听器
var DLButtonListener = function(e) {
    e.preventDefault();
    downloadDanmakuformSN(e.currentTarget.getAttribute("snid"));
};
//从列表生成下载按钮
var genDLButtonformList = function(snlist) {
    var bs = document.createElement("div");
    bs.insertAdjacentHTML("afterbegin", fillStr(`<p style="font-size:1.2em;">{{text}}</p>`, { 'text': l10n.text.episodelistgetdanmaku }));
    for (let node of snlist) {
        if (node.sn === "---") {
            var p = document.createElement("p");
            p.textContent = node.text;
            bs.appendChild(p);
        } else {
            var b = document.createElement("button");
            b.className = "listdownloadbutton";
            b.textContent = node.text;
            b.setAttribute("snid", node.sn);
            b.addEventListener('click', DLButtonListener);
            bs.appendChild(b);
        };
    };
    return bs;
};
//添加播放页面的按钮
var initPlayPageButton = function() {
    //当前集数的按钮
    const b = document.createElement("button");
    b.textContent = l10n.text.getdanmaku;
    b.addEventListener('click', e => {
        e.preventDefault();
        var fname = null;
        try {
            fname = document.title.replace("線上看 - 巴哈姆特動畫瘋", "[Baha]");
        }
        catch (e) {};
        downloadDanmakuformSN(location.href, fname, {
            'title': document.title,
            'ori': location.href
        });
    });
    b.className = "ahveuiw";
    document.querySelector(".anime_name").appendChild(b);
    //剧集列表的按钮
    var episodelist = new Array();
    for (let node1 of document.querySelector(".season").children) {
        if (node1?.tagName.toLowerCase() == "p") {
            episodelist.push({
            'sn': "---",
            'text': node1.textContent
            });
        };
        if (node1?.tagName.toLowerCase() == "ul") {
            for (let node2 of node1.children) {
                episodelist.push({
                    'sn': node2.querySelector("a").getAttribute("href"),
                    'text': node2.querySelector("a").textContent
                });
            };
        };
    };
    document.querySelector(".season").appendChild(genDLButtonformList(episodelist));
};
//添加新番列表的按钮
var initNewanimelistButton = function() {
    for (let node of document.querySelector(".newanime-block").children) {
        try {
            if (node.querySelector(".anime-card-block") == null) continue;
            var b = document.createElement("div");
            b.className = "listgetassdanmaku-button";
            b.textContent = l10n.text.getdanmaku;
            b.setAttribute("snid", node.querySelector(".anime-card-block").getAttribute("href"));
            b.addEventListener('click', DLButtonListener);
            var ae = node.querySelector(".anime-episode");
            if (ae == null) { ae = document.createElement("div"); ae.className = "anime-episode"; node.querySelector("anime-detail-info-block").appendChild(ae); }
            ae.insertAdjacentHTML("beforeend", "<p>&nbsp;</p>");
            ae.appendChild(b);
        }
        catch (e) { debug(e) };
    };
};
var initDaylistButton = function() {
    for (let node of document.querySelector(".programlist-block").querySelectorAll("a.text-anime-info")) {
        try {
            var b = document.createElement("div");
            b.className = "listgetassdanmaku-button";
            b.textContent = l10n.text.getdanmaku;
            b.setAttribute("snid", node.getAttribute("href"));
            b.addEventListener('click', DLButtonListener);
            node.appendChild(b);
        }
        catch (e) { debug(e) };
    };
};
/*
 * Common
 */
// 初始化
var init = function() {
    Object.assign(l10n, lang?.[config.language]);
    GM_registerMenuCommand(l10n.ui.getdanmakuformsn, function(){downloadDanmakuformSN(prompt(l10n.message.getdanmakuformsn));});
    GM_registerMenuCommand(l10n.ui.setting, openSettingPanel);
    GM_addStyle(injectedCSS);
    if ((document.querySelector(".anime-detail-info-block") != null) && config.enableNewanimelistButtoms) initNewanimelistButton();
    if ((document.querySelector(".programlist-block") != null) && config.enableDaylistButtoms) initDaylistButton();
    if ((document.querySelector(".anime_name") != null) && config.enablePlayPageButtoms) initPlayPageButton();
};
if (document.body) init();
else window.addEventListener('DOMContentLoaded', init);