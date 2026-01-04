// ==UserScript==
// @name         Post Action
// @namespace    https://github.com/RANSAA
// @version      0.0.8
// @description  将当前页面的网址发送到指定的服务器，服务器地址信息需要再代码中修改以适合自己使用！目前已经支持视频地址获取站点：四色AV(335pai.com),黄色仓库(hsck.net,huangsecangku.net)
// @author       sayaDev
// @license      MIT License
// @icon         data:image/png;base64,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

// @match        http://*/*
// @match        *://*/*

// @require 	https://update.greasyfork.org/scripts/494214/1432041/TKBaseSDK.js

// @grant       unsafeWindow
// @grant       GM_openInTab
// @grant       GM_xmlhttpRequest


// @connect     self
// @connect     localhost
// @connect     127.0.0.1
// @connect     *


// @compatible   chrome
// @compatible   edge
// @compatible   firefox
// @compatible   opera
// @compatible   safari


// @noframes
// @downloadURL https://update.greasyfork.org/scripts/556061/Post%20Action.user.js
// @updateURL https://update.greasyfork.org/scripts/556061/Post%20Action.meta.js
// ==/UserScript==
/**
 * 目前支持的参数:
 * pageURL: 当前页面的url地址
 * title: 当前网页的标题
 * videoURL: pageURL页面中的视频地址，如果没有获取到视频地址则它的值与pageURL相同。
 **/





/**
 * 配置信息，可更具需求更改配置
 **/
const SERVER_CONFIG = {
    host: "127.0.0.1",          //服务器地址
    port: "80",                 //服务器端口，直接使用”“不指定端口
    method: "POST",             //请求方式
    scheme: "http",             //协议类型
    taskAdd: "task/add",     //yt-dlp 任务添加API Query Path路劲地址
};



/**
 * 将参数组装成JSON格式
 * 获取当前需要的所有属性
 * pageURL: 当前页面的url地址
 * title: 当前网页的标题
 * videoURL: pageURL页面中的视频地址，如果没有获取到视频地址则它的值与pageURL相同。
 **/
function loadParameterJSON(){
    // //示例
    // var json = {
    //  jsonrpc:'2.0',
    //  method:'aria2.addUri',
    //  id:url,
    //  params:[
    //   [url],
    //  ]
    // }
    // return JSON.stringify(json)


    //网页地址
    let pageURL = window.location.href;
    //标题
    let title = filterVideoTitle();
    //视频链接
    let videoURL = filterVideoLink();
    

    let json = {
        "pageURL": pageURL,
        "title": title,
        "videoURL":videoURL
    };
    return JSON.stringify(json)
}



(function() {
    'use strict';
    TKBaseSDK.initToast();
    addSendServerButton();
})();




// -------------------------------Setup UI-------------------------------
function addSendServerButton(){
    //添加style
    TKBaseSDK.addButtonStyle();

    //创建Send URL按钮
    let sendURL = TKBaseSDK.createListItemButton("Send URL");
    //定义的是事件被触发后要做的事情
    sendURL.addEventListener("click", function() {
        sendLocationURLAction();
    });

    //创建Copy URL按钮
    let copyURL = TKBaseSDK.createListItemButton("Copy URL");
    //定义的是事件被触发后要做的事情
    copyURL.addEventListener("click", function() {
        copyLocationURLAction();
    });

    //创建Copy M3u8按钮
    let copyM3u8 = TKBaseSDK.createListItemButton("Copy M3U8");
    //定义的是事件被触发后要做的事情
    copyM3u8.addEventListener("click", function() {
        copyM3u8LinkAction();
    });

    //创建Copy yt-dlp-n按钮
    let copyYtDlpN = TKBaseSDK.createListItemButton("Copy yt-dlp-n");
    //定义的是事件被触发后要做的事情
    copyYtDlpN.addEventListener("click", function() {        
        copy_yt_dlp_n_M3U8LinkAction();
    });

    //创建Copy yt-dlp按钮
    let copyYtDlp = TKBaseSDK.createListItemButton("Copy yt-dlp");
    //定义的是事件被触发后要做的事情
    copyYtDlp.addEventListener("click", function() {
        copy_yt_dlp_M3U8LinkAction();
    });


    //创建Copy Magnet按钮
    let copyMagnet = TKBaseSDK.createListItemButton("Copy Magnet");
    copyMagnet.addEventListener("click", function() {
        copyMagnetLinksAction();
    });



    let list = document.createElement("TKButtonList");
    list.className = "TKButtonListStyle";
    list.appendChild(sendURL);
    //list.appendChild(copyURL);
    list.appendChild(copyM3u8);
    list.appendChild(copyYtDlpN);
    list.appendChild(copyYtDlp);
    list.appendChild(copyMagnet);
    document.body.appendChild(list);
}

// -------------------------------Setup UI-------------------------------




// -------------------------------Action-------------------------------

/**
 * 发送数据当前页面的URL到指定服务器
 */
function sendLocationURLAction()
{
    console.log(`Send Server`);

    //服务器的地址
    var serverUrl = SERVER_CONFIG.scheme + "://" + SERVER_CONFIG.host + ":" + SERVER_CONFIG.port + "/" + SERVER_CONFIG.taskAdd;
    if (SERVER_CONFIG.port === "" ) {
        serverUrl = SERVER_CONFIG.scheme + "://" + SERVER_CONFIG.host +  "/" + SERVER_CONFIG.taskAdd;
    }


    //发送的参数数据
    let data = loadParameterJSON();
    console.log(`serverUrl: ${serverUrl}`);
    console.log(`parameter: ${data}`);


    //GM_xmlhttpRequest方式请求
    GM_xmlhttpRequest({
        method: SERVER_CONFIG.method,
        url: serverUrl,
        headers: {
            'Content-Type': 'application/json; charset=utf-8',
        },
        data: data,
        onload: function(response) {
            console.log(response);
            console.log(`readyState:${response.readyState}`);
            console.log(`status:${response.status}`);
            console.log(`statusText:${response.statusText}`);
            console.log(`responseHeaders:\n${response.responseHeaders}`);
            console.log(`responseText:${response.responseText}`);
            if (response.status === 200) {
                console.log(`Send URL Success: ${url}`);
                TKBaseSDK.showToast("当前URL地址发送成功！",1);
            } else {
                console.log(`Send URL Error: ${url} statusText: ${response.statusText}`);
                TKBaseSDK.showToast("当前URL地址发送失败！",0);
            }
        },
        onerror: function(response) {
            // 请求发生错误时执行
            console.error("Request failed:", response);
            let msg = `发送失败，Send Server服务地址：${response.finalUrl}`;
            console.log(msg);
            TKBaseSDK.showToastWtihTime(msg, 0, 4000);
        }
    });
}

/**
 * 拷贝当前网页地址
 **/
function copyLocationURLAction(){
    //当前网页地址
    let url = window.location.href;
	TKBaseSDK.copyToClipBoard(url);
    TKBaseSDK.showToast("复制成功！",1);
}


/**
 * 获取并拷贝m3u8链接
 **/
function copyM3u8LinkAction(){
    let m3u8URL = filterVideoLink();
    if (m3u8URL === "" || m3u8URL === window.location.href) {
        TKBaseSDK.showToast("复制失败，没有找到M3U8链接！",0);
        TKBaseSDK.copyToClipBoard("");
    }else{
        TKBaseSDK.showToast("复制成功！",1);
        //拷贝到剪切板
        TKBaseSDK.copyToClipBoard(m3u8URL);
    }
}




/**
 * 拷贝四色AV中的标题与m3u8链接，并且组装yt-dlp-n命令
 * 格式： yt-dlp-n "视频标题" "m3u8视频地址"
 **/
function copy_yt_dlp_n_M3U8LinkAction(){
    let videoURL = filterVideoLink();
    let title = filterVideoTitle();

    if (videoURL === "" || title === "") {
        TKBaseSDK.showToast("yt-dlp-n下载命令复制失败，没有找到视频链接！",0);
        TKBaseSDK.copyToClipBoard("");
    }else{
        TKBaseSDK.showToast("yt-dlp-n下载命令复制成功！",1);

        //拷贝到剪切板
        let cmd = "yt-dlp " + "\"" + title + "\"" + " \"" + videoURL + "\"" + "";
        TKBaseSDK.copyToClipBoard(cmd);
    }
}




/**
 * 拷贝当前网页链接， 并组装yt-dlp命令
 * 格式：yt-dlp "网页地址"
 **/
function copy_yt_dlp_M3U8LinkAction(){
    let videoURL = filterVideoLink();

    TKBaseSDK.showToast("yt-dlp下载命令复制成功！",1);
    //拷贝到剪切板
    let cmd = "yt-dlp " + "\"" + videoURL + "\"" + "";
    TKBaseSDK.copyToClipBoard(cmd);

}



/**
 * 功能：拷贝当前页面的所有magnet磁力链接
 **/
function copyMagnetLinksAction(){
    const magnetLinks = getMagnetLinks();
    // 转换成换行分隔的字符串
    const magnetLinksString = magnetLinks.join('\n');
    if (magnetLinksString === "" ) {
        TKBaseSDK.showToast("Copy Mangnet失败，没有找到磁力链接！",0);
        TKBaseSDK.copyToClipBoard("");
    }else{
        TKBaseSDK.showToast("Copy Mangnet成功！",1);
        //拷贝到剪切板
        TKBaseSDK.copyToClipBoard(magnetLinksString);
    }
}

// -------------------------------Action-------------------------------






// -------------------------------解析视频地址和标题-------------------------------
/**
 * 过滤获取当前视频指定的名称
 **/ 
function filterVideoTitle(){
    // 默认使用网站标题作为title
    var title = document.title;

    //匹配四色AV站点标题
    let fourColorAVTitle = getFourColorAVTitle();
    if (fourColorAVTitle) {
        title = fourColorAVTitle;
    }

    //匹配其它站点...
    let hsckTitle = getHuangSeCangKuTitle();
    if (hsckTitle) {
        title = hsckTitle;
    }



    //去掉字符串两端的空格和不可见字符（例如空格、换行、制表符等）
    title = title.trim();

    // 处理文件名中的特殊字符
    title = sanitizeFileName(title);

    return title
}


/**
 * 过滤并获取视频地址，如果没有获取到视频地址则直接使用window.location.href
 **/ 
function filterVideoLink(){
    // 默认使用当前页面地址
    var videoURL = window.location.href;

    //获取四色AV的视频地址
    let fourColorAVURL = getFourColorAVM3u8Url();
    if (fourColorAVURL) { // 等效 fourColorAVURL !== ""
        videoURL =  fourColorAVURL;
    }


    // 黄色仓库
    let hsckVideoURL = getHuangSeCangKuM3U8Url();
    if (hsckVideoURL) {
        videoURL = hsckVideoURL;
    }

    //其它站点...

    return videoURL
}




/**
 * 获取四色AV中的m3u8链接地址
 **/
function getFourColorAVM3u8Url(){
    // Define a regular expression to match the playUrl variable pattern
    const playUrlPattern = /var playUrl\s*=\s*"([^"]+)"/;

    // Get all script tags on the page
    const scripts = Array.from(document.getElementsByTagName('script'));

    // Look for the script containing the playUrl variable
    const matchedScript = scripts.find(script => playUrlPattern.test(script.textContent));

    var m3u8Url = ""

    // // If found, extract the URL
    // if (matchedScript) {
    //     const match = matchedScript.textContent.match(playUrlPattern);
    //     m3u8Url = match && match[1];
    //     //将域名占位符转换正真正的主机 - 已弃用：不能写死
    //     m3u8Url = m3u8Url.replace(/\+\@movivecom\@\+/g, "qfvgzy.com");
    //     console.log('四色AV站点：m3u8 URL:', m3u8Url);
    // } else {
    //     console.warn('四色AV站点：m3u8 URL could not be found.');
    // }


    // 获取地址的新方法
    // 判断变量playUrl是否存在， 直接获取playUrl变量的值。
    if (typeof playUrl !== "undefined") {
        m3u8Url = playUrl;
    }
    m3u8Url = m3u8Url.trim();
    console.log('四色AV站点：m3u8 URL:', m3u8Url);


    return m3u8Url
}


/**
 * 获取四色AV中视频的标题
 **/
function getFourColorAVTitle(){
    var title = ""

    // 获取包含 h1 元素的 div.main 元素
    const mainDiv = document.querySelector('.wrap > .main');
    // 确认 main 元素存在
    if (mainDiv) {
        // 在 mainDiv 内查找 h1 元素
        const h1Element = mainDiv.querySelector('h1');

        // 确认 h1 元素存在
        if (h1Element) {
            // 获取 h1 元素的文本内容
            const h1Content = h1Element.textContent.trim();
            console.log('四色AV站点：查找h1 内容为:', h1Content);
             title = h1Content
        } else {
            console.warn('四色AV站点：查找视频标题时未找到 h1 元素！');
            // title = "test---222"
        }
    } else {
        console.warn('四色AV站点：查找视频标题时未找到 .main 元素！');
        // title = "test-333"
    }

    return title
}





/**
 * 获取黄色仓库的视频地址
 * 站点1：huangsecangku.net
 * 站点2：hsck.net
 * 站点3：hsck.app
 **/
function getHuangSeCangKuM3U8Url(){
    var m3u8Url = "";
    // 判断变量player_aaaa.url是否存在，并且直接根据player_aaaa.url的值来获取视频地址
    if (typeof player_aaaa !== "undefined" && player_aaaa.url !== undefined) {
        m3u8Url = player_aaaa.url;
    }
    m3u8Url = m3u8Url.trim();
    console.log('黄色仓库站点：m3u8 URL:', m3u8Url);
    return m3u8Url;
}


/**
 * 获取黄色仓库标题
 **/
function getHuangSeCangKuTitle(){
    var title = ""

    /**
     * trim()：去掉字符串两端的空格和不可见字符（例如空格、换行、制表符等）
     * if (text) 自动判断 null, undefined, ""
     **/
    const quearyTitle = document.querySelector(".stui-warp-content h3.title")?.textContent?.trim();
    if (quearyTitle) {//查询到的表示有效
        title = quearyTitle;
    }
    console.log('黄色仓库站点：Video Title:', title);

    return title
}




/**
 * 获取页面中的所有magnet磁力链接
 **/ 
function getMagnetLinks(){
    // 从整个 HTML 文档中提取磁力链接
    const htmlContent = document.documentElement.innerHTML;
    const magnetRegex = /magnet:\?xt=urn:[a-zA-Z0-9:]+/g;
    const magnetLinks = Array.from(new Set(htmlContent.match(magnetRegex) || []));
    console.log(magnetLinks);
    return magnetLinks;
}

// -------------------------------解析视频地址和标题-------------------------------






// -------------------------------处理文件名合规性-------------------------------

/**
 * 功能：将字符串中不能作为文件名的字符替换成"_",并且如果存在英文的双引号"替换成英文的单引号'
 * replace(/"/g, '“');      //正则表达式
 * replaceAll('"', '“');    //直接替换函数
 **/
function sanitizeFileName(filename) {
    //使用正则表达式将"替换成'
    var name = filename;
    name = name.replace(/"/g, "'");     //注意：这儿使用的正则表达式无法将"替换成'，然后再调用这个函数的外部直接对字符串操作又可以，不知道是什么原因。所以直接使用replaceAll方法进行替换。
    name = name.replaceAll('"', "'");
    name = name.replaceAll(':', "：");
    name = name.replaceAll('”', "'");
    name = name.replaceAll('!', "！");

    //将不能作为文件名的字符替换为:_
    name = name.replace(/[:]+/g, '_');  // -osx
    // name = name.replace(/[\/\\:*?"<>|]+/g, '_');  // win

    return name
}

/**
 *  功能：将字符串中不能作为路径的字符替换成”_“
 **/ 
function sanitizePath(path) {
  return path.replace(/[\/\\:*?"<>|]+/g, '_');  // 替换为单个下划线
}

// -------------------------------处理文件名合规性-------------------------------




