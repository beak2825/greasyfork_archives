// ==UserScript==
// @name         Biliplus Patch
// @namespace    http://tampermonkey.net/
// @version      1.0.4
// @description  修复biliplus的部分失效功能
// @author       META-USER
// @license      MIT
// @match        *://*.biliplus.com/*
// @grant        GM_xmlhttpRequest
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_deleteValue
// @grant        GM_listValues
// @icon         https://i0.hdslb.com/bfs/new_dyn/e83d7cbadd8f153dbdd88d01eeea3dc59611100.png
// @connect      api.bilibili.com
// @connect      s.video.sina.com.cn
// @connect      api.ivideo.sina.com.cn
// @connect      edge.v.iask.com.sinacloud.net
// @connect      h5vv.video.qq.com
// @connect      pbaccess.video.qq.com
// @connect      access.video.qq.com
// @connect      api.youku.com
// @connect      cdn.jsdelivr.net
// @run-at       document-idle
// @require      https://cdn.jsdelivr.net/npm/protobufjs@8.0.0/dist/protobuf.min.js
// @downloadURL https://update.greasyfork.org/scripts/560428/Biliplus%20Patch.user.js
// @updateURL https://update.greasyfork.org/scripts/560428/Biliplus%20Patch.meta.js
// ==/UserScript==

'use strict';

/* 工具函数 */
// 跨域get请求
function GM_get_request(url, callback, extra, customHeaders = {}, responseType = 'text') {
    let headers = {
        'Accept': '*/*',
        ...customHeaders
    };

    GM_xmlhttpRequest({
        method: 'GET',
        url: url,
        timeout: 10000,
        headers: headers,
        responseType: responseType,
        onload: function(response) {
            // 构建统一的响应对象
            const result = {
                status: response.status,
                statusText: response.statusText,
                headers: response.responseHeaders,
                finalUrl: response.finalUrl,
                response: response.response,
                responseText: response.responseText
            };

            callback(result, extra);
        },
        onerror: function(error) {
            callback({
                status: 0,
                statusText: 'Network Error',
                message: '网络错误'
            }, extra);
        },
        ontimeout: function() {
            callback({
                status: -1,
                statusText: 'Timeout',
                message: '请求超时'
            }, extra);
        }
    });
}
// 跨域get请求
function GM_getjson(url, callback, extra, customHeaders = {}) {
    let headers = {
        'Accept': 'application/json, text/plain, */*',
        ...customHeaders
    };
    GM_xmlhttpRequest({
        method: 'GET',
        url: url,
        timeout: 10000,
        headers: headers,
        responseType: 'json',
        onload: function(response) {
            if (response.status === 200) {
                callback(response.response, extra);
            } else {
                callback({
                    code: response.status,
                    message: `HTTP错误: ${response.status}`
                }, extra);
            }
        },
        onerror: function(error) {
            callback({
                code: -502,
                message: '网络错误'
            }, extra);
        },
        ontimeout: function() {
            callback({
                code: -1,
                message: '请求超时'
            }, extra);
        }
    });
}
// 跨域post请求
function GM_postjson(url, data, callback, extra, customHeaders = {}) {
    let headers = {
        'Accept': 'application/json, text/plain, */*',
        ...customHeaders
    };

    let postData;

    // 判断数据类型并设置相应的Content-Type
    if (typeof data === 'object' && !(data instanceof FormData)) {
        headers['Content-Type'] = 'application/json';
        postData = JSON.stringify(data);
    } else if (typeof data === 'string') {
        headers['Content-Type'] = 'application/x-www-form-urlencoded';
        postData = data;
    } else {
        // FormData或其他类型，不设置Content-Type（让浏览器自动设置）
        postData = data;
    }

    GM_xmlhttpRequest({
        method: 'POST',
        url: url,
        timeout: 10000,
        headers: headers,
        data: postData,
        responseType: 'json',
        onload: function(response) {
            if (response.status === 200 || response.status === 201) {
                if (extra !== undefined) {
                    callback(response.response, extra);
                } else {
                    callback(response.response);
                }
            } else {
                const error = {
                    code: response.status,
                    message: `HTTP错误: ${response.status}`
                };
                if (extra !== undefined) {
                    callback(error, extra);
                } else {
                    callback(error);
                }
            }
        },
        onerror: function(error) {
            const errorObj = {
                code: -502,
                message: '网络错误'
            };
            if (extra !== undefined) {
                callback(errorObj, extra);
            } else {
                callback(errorObj);
            }
        },
        ontimeout: function() {
            const errorObj = {
                code: -1,
                message: '请求超时'
            };
            if (extra !== undefined) {
                callback(errorObj, extra);
            } else {
                callback(errorObj);
            }
        }
    });
}

// 异步sleep配置
function sleep(sec) {
    return new Promise(resolve => setTimeout(resolve, sec * 1000));
}
/**
 * 将Unix时间戳转换为格式化的日期时间字符串
 * @param {number|string} timestamp - Unix时间戳（秒级）
 * @returns {string} 格式化后的日期时间字符串，格式：YYYY-MM-DD HH:mm:ss
 */
function formatTimestamp(timestamp) {
    // 将时间戳转换为毫秒
    const date = new Date(timestamp * 1000);

    // 获取各个时间部分
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // 月份从0开始，需要+1
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');

    // 组合成目标格式
    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}

// 辅助函数：格式化时长（秒转换为时分秒）
function formatDuration(seconds) {
    if (!seconds) return '0秒';

    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    const parts = [];
    if (hours > 0) parts.push(`${hours}小时`);
    if (minutes > 0) parts.push(`${minutes}分钟`);
    if (secs > 0 || parts.length === 0) parts.push(`${secs}秒`);

    return parts.join('');
}
/**
 * 获取今日日期
 * @returns {string} 格式化后的日期时间字符串，格式：YYYY-MM-DD
 */
function getTodayDate() {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}

// av号转bv号
function av2bv(aid) {
    const XOR_CODE = 23442827791579n;
    const MASK_CODE = 2251799813685247n;
    const MAX_AID = 1n << 51n;
    const BASE = 58n;

    const data = 'FcwAPNKTMug3GV5Lj7EJnHpWsx4tb8haYeviqBz6rkCy12mUSDQX9RdoZf';

    const bytes = ['B', 'V', '1', '0', '0', '0', '0', '0', '0', '0', '0', '0'];
    let bvIndex = bytes.length - 1;
    let tmp = (MAX_AID | BigInt(aid)) ^ XOR_CODE;
    while (tmp > 0) {
        bytes[bvIndex] = data[Number(tmp % BigInt(BASE))];
        tmp = tmp / BASE;
        bvIndex -= 1;
    }
    [bytes[3], bytes[9]] = [bytes[9], bytes[3]];
    [bytes[4], bytes[7]] = [bytes[7], bytes[4]];
    return bytes.join('');
}
// bv号转av号
function bv2av(bvid) {
    const XOR_CODE = 23442827791579n;
    const MASK_CODE = 2251799813685247n;
    const MAX_AID = 1n << 51n;
    const BASE = 58n;

    const data = 'FcwAPNKTMug3GV5Lj7EJnHpWsx4tb8haYeviqBz6rkCy12mUSDQX9RdoZf';

    const bvidArr = Array.from(bvid);
    [bvidArr[3], bvidArr[9]] = [bvidArr[9], bvidArr[3]];
    [bvidArr[4], bvidArr[7]] = [bvidArr[7], bvidArr[4]];
    bvidArr.splice(0, 3);
    const tmp = bvidArr.reduce((pre, bvidChar) => pre * BASE + BigInt(data.indexOf(bvidChar)), 0n);
    return Number((tmp & MASK_CODE) ^ XOR_CODE);
}

// 初始化脚本
function script_init() {
    //获取cid记录页数据
    function reload_cid_record_data() {
        const currentPath = window.location.pathname;
        const targetPages = ['/all/video/'];
        const isTargetPage = targetPages.some(page => currentPath.startsWith(page));
        if (!isTargetPage) return;


        async function get_view_all_data() {
            // 正则匹配密钥参数
            let paramMatch = document.documentElement.outerHTML.match(/getjson\('\/api\/view_all\?([^']+)'/);

            if (paramMatch) {
                let queryString = paramMatch[1];
                // 重新请求以获取cid信息
                await getjson('/api/view_all?' + queryString, async json => {
                    window.view_all_data = json;
                });
            }

        }

        get_view_all_data();
    };

    // 执行
    reload_cid_record_data()

}


/* 主要功能 */

// 配置额外功能

/* 
添加额外功能步骤：
注释内已标明步骤顺序，搜索步骤即可

 */
function add_extra_features() {
    // 初始化switches样式
    function switches_init() {
        // 默认开启功能
        // 配置额外功能网页存储默认开关状态 步骤2
        if (localStorage.add_snapshot === undefined) {
            localStorage.add_snapshot = 'on';
        };
        if (localStorage.add_externaldetail === undefined) {
            localStorage.add_externaldetail = 'on';
        };



        // 选项开关状态
        // 配置额外功能渲染默认开关状态 步骤3
        if (localStorage.random_cid == 'on') {
            document.getElementById('feature_random_cid').className = 'switch on'; // 开启样式
        } else {
            document.getElementById('feature_random_cid').className = 'switch'; // 关闭样式
        }
        if (localStorage.ban_history == 'on') {
            document.getElementById('feature_ban_history').className = 'switch on'; // 开启样式
        } else {
            document.getElementById('feature_ban_history').className = 'switch'; // 关闭样式
        }
        if (localStorage.add_snapshot == 'on') {
            document.getElementById('feature_add_snapshot').className = 'switch on'; // 开启样式
        } else {
            document.getElementById('feature_add_snapshot').className = 'switch'; // 关闭样式
        }
        if (localStorage.add_externaldetail == 'on') {
            document.getElementById('feature_add_externaldetail').className = 'switch on'; // 开启样式
        } else {
            document.getElementById('feature_add_externaldetail').className = 'switch'; // 关闭样式
        }
    }

    // 开关点击事件：长期记忆配置
    // 配置额外功能开关点击事件 步骤4
    const random_cid = function() {
        var d = document.getElementById('feature_random_cid');
        d.className = 'switch' + (localStorage.random_cid != 'on' ? ' on' : '');
        localStorage.random_cid = localStorage.random_cid != 'on' ? 'on' : 'off';

    }
    const ban_history = function() {
        var d = document.getElementById('feature_ban_history');
        d.className = 'switch' + (localStorage.ban_history != 'on' ? ' on' : '');
        localStorage.ban_history = localStorage.ban_history != 'on' ? 'on' : 'off';

    }
    const add_snapshot = function() {
        var d = document.getElementById('feature_add_snapshot');
        d.className = 'switch' + (localStorage.add_snapshot != 'on' ? ' on' : '');
        localStorage.add_snapshot = localStorage.add_snapshot != 'on' ? 'on' : 'off';

    }
    const add_externaldetail = function() {
        var d = document.getElementById('feature_add_externaldetail');
        d.className = 'switch' + (localStorage.add_externaldetail != 'on' ? ' on' : '');
        localStorage.add_externaldetail = localStorage.add_externaldetail != 'on' ? 'on' : 'off';

    }
    // 用于添加一个额外功能(参数：父容器，功能标题，开关id，开关点击事件，功能介绍)
    function create_feature_switch(feature_switches, title_text, switch_id, onclick, tip_text) {
        // 创建fieldset容器
        const fieldset = document.createElement('fieldset');
        fieldset.style.maxWidth = '725px';

        // 创建第一个div容器（包含标题和开关）
        const firstDiv = document.createElement('div');
        firstDiv.textContent = title_text;

        // 创建开关按钮
        const switchDiv = document.createElement('div');
        switchDiv.className = 'switch';
        switchDiv.id = switch_id;
        switchDiv.onclick = onclick;

        // 将开关添加到第一个div中
        firstDiv.appendChild(switchDiv);

        // 创建第二个div（提示文字）
        const secondDiv = document.createElement('div');
        secondDiv.textContent = tip_text;

        // 将所有元素添加到fieldset中
        fieldset.appendChild(firstDiv);
        fieldset.appendChild(secondDiv);

        feature_switches.appendChild(fieldset);
    }


    /* 容器配置 */

    // 创建内容容器
    function create_features_container() {
        // 创建features_container
        const features_container = document.createElement('div');
        features_container.id = "features_container";
        features_container.className = "container"
        features_container.style = "opacity:1;display:none;transition:none"

        // 在features_container内部创建背景
        const black_back = document.createElement('div');
        black_back.className = "black_back"
        black_back.style = "opacity:0;transition:0.5s"
        black_back.onclick = () => features(0); // 假设有features函数，与settings函数类似

        features_container.appendChild(black_back);

        // 创建侧边栏容器（类似settings中的样式）
        const sidebar = document.createElement('div');
        sidebar.style = "width:320px;height:100%;position:fixed;top:0;right:-320px;animation-duration:0.5s;background:#EFEFF4";

        // 创建关闭按钮容器
        const closeContainer = document.createElement('div');
        closeContainer.style = "position:absolute;top:0;left:0;padding:10px 15px;width:100%";

        const closeSpan = document.createElement('span');
        closeSpan.textContent = "< 关闭";
        closeSpan.style = "padding:5px;background:#CBCBC0;border-radius:5px;cursor:pointer";
        closeSpan.onclick = () => features(0); // 关闭功能

        closeContainer.appendChild(closeSpan);
        sidebar.appendChild(closeContainer);

        // 创建内容区域
        const contentDiv = document.createElement('div');
        contentDiv.id = "features_content";
        contentDiv.style = "position:absolute;top:40px;bottom:5px;right:5px;width:310px;overflow-y:auto;overflow-x:hidden;-webkit-overflow-scrolling:touch";

        // 创建标题
        const titleDiv = document.createElement('div');
        titleDiv.className = "frametitle";
        titleDiv.textContent = "额外功能";

        const feature_switches = document.createElement('div');
        feature_switches.id = "feature_switches";
        // 创建额外功能 开始 步骤1
        // 重要!配置开关id和点击事件不要错
        create_feature_switch(feature_switches, "随机CID", "feature_random_cid", random_cid, "主页加载随机CID稿件");
        create_feature_switch(feature_switches, "不记录观看历史", "feature_ban_history", ban_history, "修复版html5播放器不记录观看历史（对原版播放器无效）");
        create_feature_switch(feature_switches, "视频快照查看", "feature_add_snapshot", add_snapshot, "CID历史记录页支持CID快照查看");
        create_feature_switch(feature_switches, "源详情查询", "feature_add_externaldetail", add_externaldetail, "CID历史记录页支持源详情查询(目前支持新浪源，优酷源，腾讯源，直传源)");
        // 创建额外功能 结束
        contentDiv.appendChild(titleDiv);
        contentDiv.appendChild(feature_switches);

        sidebar.appendChild(contentDiv);
        features_container.appendChild(sidebar);

        document.body.appendChild(features_container);

    }

    // 侧边栏内'额外功能'项目点击事件(参数：是否渲染内容容器(1：开启，0：关闭))
    const features = function(s) {
        var sc = document.getElementById('features_container'),
            bb = sc.childNodes[0],
            wf = sc.childNodes[1];

        if (s) {
            // 显示设置面板
            sc.style.display = 'block';
            bb.style.opacity = .7;
            bb.style.animationName = 'black_back-in';
            wf.style.right = 0;
            wf.style.animationName = 'right-slide-in';
        } else {
            // 隐藏设置面板
            bb.style.opacity = 0;
            bb.style.animationName = 'black_back-out';
            wf.style.right = '-320px';
            wf.style.animationName = 'right-slide-out';
            setTimeout(function() {
                sc.style.display = 'none';
            }, 500);
        }
    }
    // 在侧边栏添加'额外功能'项目
    function addExtraItem() {
        // 找到用户侧边栏容器
        const userSidebar = document.getElementById('usersidebar');
        if (!userSidebar) return;

        // 检查是否已经添加过项目
        if (document.getElementById('extra-sidebar-item')) {
            return;
        }

        // 创建项目
        const extraItem = document.createElement('div');
        extraItem.className = 'usersidebar_item';
        extraItem.id = 'extra-sidebar-item';

        // 创建内部容器
        const itemInner = document.createElement('div');
        itemInner.className = 'usersidebar_item_inner';
        itemInner.textContent = '额外功能';
        itemInner.style.cursor = 'pointer';

        // 添加点击事件
        itemInner.addEventListener('click', function() {
            features(1);
            usersidebar(0)
        });

        // 添加到侧边栏
        extraItem.appendChild(itemInner);

        // 找到"设置"项目，在其前面插入
        const settingsItem = userSidebar.querySelector('.usersidebar_item[onclick*="settings"]');
        if (settingsItem) {
            userSidebar.insertBefore(extraItem, settingsItem);
        } else {
            userSidebar.appendChild(extraItem);
        }
    }

    create_features_container();
    addExtraItem();
    // 先创建容器再初始化switches
    switches_init()

}

// 添加cid快照查看
function add_video_snapshot() {
    const currentPath = window.location.pathname;
    const targetPages = ['/all/video/'];
    const isTargetPage = targetPages.some(page => currentPath.startsWith(page));

    if (!isTargetPage) return;
    // 不启用此功能则退出
    if (localStorage.add_snapshot !== "on") return;

    const show_snapshot = function(cid) {
        const existingPlayer = document.getElementById('floatingImagePlayer');
        if (existingPlayer) existingPlayer.remove();

        const imageUrl = `https://i0.hdslb.com/bfs/videoshot/${cid}.jpg`;
        // 重点标记，此处图片查看器由Ai编写

        const container = document.createElement('div');
        container.id = 'floatingImagePlayer';
        container.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100vw;
        height: 100vh;
        background-color: rgba(0, 0, 0, 0.9);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 9999;
    `;

        const closeBtn = document.createElement('button');
        closeBtn.textContent = '×';
        closeBtn.style.cssText = `
        position: absolute;
        top: 20px;
        right: 20px;
        background: transparent;
        color: white;
        border: none;
        font-size: 30px;
        cursor: pointer;
        z-index: 10000;
        padding: 10px;
        line-height: 1;
    `;

        const imgContainer = document.createElement('div');
        imgContainer.style.cssText = `
        max-width: 90vw;
        max-height: 90vh;
        display: flex;
        align-items: center;
        justify-content: center;
    `;

        // 创建错误消息元素（但先隐藏）
        const errorMsg = document.createElement('div');
        errorMsg.textContent = '暂无快照';
        errorMsg.style.cssText = `
        color: #999;
        font-size: 16px;
        display: none;
    `;

        const img = document.createElement('img');
        img.id = 'displayedImage';
        img.style.cssText = `
        max-width: 100%;
        max-height: 100%;
        object-fit: contain;
        display: none;
    `;
        img.alt = '视频快照';

        img.onload = () => {
            img.style.display = 'block';
            errorMsg.style.display = 'none';
        };

        img.onerror = () => {
            img.style.display = 'none';
            errorMsg.style.display = 'block';
        };

        closeBtn.onclick = () => container.remove();
        container.onclick = (e) => {
            if (e.target === container) container.remove();
        };

        const escHandler = (e) => {
            if (e.key === 'Escape') container.remove();
        };
        document.addEventListener('keydown', escHandler);

        img.src = imageUrl;
        imgContainer.appendChild(img);
        imgContainer.appendChild(errorMsg);
        container.appendChild(closeBtn);
        container.appendChild(imgContainer);
        document.body.appendChild(container);

        // 清理事件监听器
        container.addEventListener('remove', () => {
            document.removeEventListener('keydown', escHandler);
        });

        return {
            close: () => container.remove()
        };
    };


    function create_snapshot_item(cid) {
        const cid_item = document.getElementById('cid_' + cid)
        if (cid_item) {
            const snapshot_item = document.createElement('div');
            snapshot_item.className = "solidbox pointer";
            snapshot_item.onclick = () => show_snapshot(cid);
            snapshot_item.textContent = "查看快照";
            cid_item.parentNode.insertBefore(snapshot_item, cid_item);
        }


    };
    const timer = setInterval(function() {
        if (window.view_all_data) {
            const json = window.view_all_data
            if (json.code === 0) {
                json.data.parts.forEach(part => {
                    create_snapshot_item(part.cid);
                })
            }
            clearInterval(timer);
        }
    }, 200);
}

function add_video_detail() {
    const currentPath = window.location.pathname;
    const targetPages = ['/all/video/'];
    const isTargetPage = targetPages.some(page => currentPath.startsWith(page));

    if (!isTargetPage) return;
    // 不启用此功能则退出
    if (localStorage.add_externaldetail !== "on") return;

    function get_externaldetail(cid, type, vid) {
        const default_json = {
            "code": -1,
            "message": `暂不支持${type}视频源`,
            "data": {}
        };
        const video_json = {
            "code": 0,
            "message": "获取成功",
            "data": {}
        };

        switch (type) {
            case "sina":
                // 新浪视频信息获取
                return new Promise((resolve, reject) => {
                    getSinaVideoInfo(vid, resolve);
                });
            case "qq":
                // 腾讯视频信息获取
                return new Promise((resolve, reject) => {
                    getQQVideoInfo(vid, resolve);
                });
            case "youku":
                // 优酷视频信息获取
                return new Promise((resolve, reject) => {
                    getYoukuVideoInfo(vid, resolve);
                });
            case "vupload":
                // 直传视频信息获取
                return new Promise((resolve, reject) => {
                    getBillibiliVideoInfo(cid, resolve);
                });
            default:
                return Promise.resolve(default_json);
        }

        // 新浪视频信息获取
        function getSinaVideoInfo(vid, resolve) {
            GM_getjson('https://s.video.sina.com.cn/video/getvideoidbyvid?vid=' + vid, function(json) {
                if (json.code !== 1) {
                    default_json.message = json.message;
                    resolve(default_json);
                    return;
                }

                const sina_video_id = json.data.video_id;

                GM_getjson('http://api.ivideo.sina.com.cn/public/video/play?appname=sinaplayer_pc&tags=sinaplayer_pc&applt=web&appver=V11220.210521.03&player=all&video_id=' + sina_video_id, function(json) {
                    if (json.code !== 1) {
                        default_json.message = json.Message;
                        resolve(default_json);
                        return;
                    }

                    // 通过此数据中的videos获取ipad_id
                    const mp4Video = json.data.videos.find(video => video.type === 'mp4');
                    let ipad_vid = 0;

                    if (mp4Video) {
                        ipad_vid = mp4Video.file_id;
                    }

                    // 配置要返回的数据
                    video_json.data.ids = {
                        "vid": vid,
                        "video_id": sina_video_id,
                        "ipad_vid": ipad_vid
                    };
                    video_json.data.title = json.data.title;
                    video_json.data.link = `http://video.sina.com.cn/view/${sina_video_id}.html`;
                    video_json.data.cover = json.data.image;
                    video_json.data.created = formatTimestamp(json.data.create_time);
                    video_json.data.description = json.data.description;
                    video_json.data.duration = Math.round(json.data.length / 1000);
                    video_json.data.state = "正常";

                    resolve(video_json);
                });
            });
        }

        // 腾讯视频信息获取
        function getQQVideoInfo(vid, resolve) {
            GM_postjson('https://pbaccess.video.qq.com/trpc.universal_backend_service.page_server_rpc.PageServer/GetPageData', {
                "page_params": {
                    "vid": vid,
                    "page_type": "video_detail"
                }
            }, function(pageData) {
                if (pageData.ret !== 0) {
                    default_json.message = pageData.msg;
                    resolve(default_json);
                    return;
                }

                // 初始化视频数据
                video_json.data.ids = {
                    "vid": vid
                };
                video_json.data.link = `https://v.qq.com/x/page/${vid}.html`;
                video_json.data.cover = `https://puui.qpic.cn/vpic_cover/${vid}/${vid}_hz.jpg`;

                // 提取页面数据中的视频信息
                if (pageData.data.module_list_datas[0]?.module_datas[0]?.item_data_lists?.item_datas[0]?.item_params) {
                    const video_item = pageData.data.module_list_datas[0].module_datas[0].item_data_lists.item_datas[0].item_params;

                    video_json.data.title = video_item.title;
                    video_json.data.created = video_item.detail_info.match(/\d{4}年\d{1,2}月\d{1,2}日/)[0];
                    video_json.data.description = video_item.video_description;
                }

                // 提取播放数据中的视频信息
                let play_item = null;
                if (pageData.data.module_list_datas.length > 1) {
                    play_item = pageData.data.module_list_datas[1]?.module_datas[0]?.item_data_lists?.item_datas[0]?.item_params;
                }

                if (play_item && play_item.vid === vid) {
                    if (play_item.title) video_json.data.title = play_item.title;
                    if (play_item.duration) video_json.data.duration = play_item.duration;
                    if (play_item.date) video_json.data.created = play_item.date;
                }

                // 获取分享信息
                getQQShareInfo(vid, video_json, resolve);
            }, null, {
                "Cookie": "video_appid=3000002; vversion_name=8.9.16.0",
                "referer": "https://servicewechat.com"
            });
        }

        // 获取腾讯视频分享信息
        function getQQShareInfo(vid, video_json, resolve) {
            GM_postjson('https://access.video.qq.com/tinyapp/share_info?raw=1&vappid=11333374&vsecret=45ce5b9d91f29688f832ad435ea227cf719a29571257d447', {
                "dataKey": "vid=" + vid,
                "scene": 1
            }, function(shareData) {
                if (shareData.ret === 0 && shareData.data.shareItem) {
                    const video_item = shareData.data.shareItem;

                    if (video_item.shareTitle) video_json.data.title = video_item.shareTitle;
                    if (video_item.totalTime) video_json.data.duration = video_item.totalTime;
                    if (video_item.shareImgUrl) video_json.data.cover = video_item.shareImgUrl;
                }

                // 获取视频状态信息
                getQQVideoStatus(vid, video_json, resolve);
            });
        }

        // 获取腾讯视频状态信息
        function getQQVideoStatus(vid, video_json, resolve) {
            GM_getjson('https://h5vv.video.qq.com/getinfo?otype=ojson&vid=' + vid, function(infoData) {
                if (infoData) {
                    video_json.data.state = infoData.exem !== 0 ? infoData.msg : "正常";
                }

                resolve(video_json);
            });
        }
        // 获取优酷数字ID
        function getYoukuIdByVid(vid) {
            return atob(vid.slice(1)) / 4
        };
        // 获取优酷视频信息
        function getYoukuVideoInfo(vid, resolve) {
            const stateToChinese = {
                "normal": '正常',
                "encoding": '转码中',
                "fail": '转码失败',
                "in_review": '审核中',
                "limited": '分级'
            };
            const youku_id = getYoukuIdByVid(vid)
            GM_getjson('https://api.youku.com/videos/show.json?client_id=f4b0da916cc86fe5&video_id=' + youku_id, function(json) {
                if (json.error) {
                    default_json.message = json.error.description;
                    resolve(default_json);
                    return;
                }
                video_json.data.ids = {
                    "vid": vid,
                    "youku_id": youku_id
                };
                video_json.data.title = json.title;
                video_json.data.link = `http://v.youku.com/v_show/id_${vid}.html`;
                video_json.data.cover = json.thumbnail;
                video_json.data.created = json.created;
                video_json.data.description = json.description;
                video_json.data.duration = Math.round(json.duration);
                video_json.data.state = stateToChinese[json.state];
                video_json.data.nickname = json.user.name

                resolve(video_json);



            });
        }

        function getBillibiliVideoInfo(cid, resolve) {
            GM_getjson('https://www.biliplus.com/api/cidinfo?cid=' + cid, function(json) {
                if (json.code !== 0) {
                    default_json.message = json.message;
                    resolve(default_json);
                    return;
                }
                const aid = json.data.aid;
                const bvid = av2bv(aid);
                video_json.data.ids = {
                    "aid": aid,
                    "bvid": bvid,
                    "cid": cid
                };
                video_json.data.title = json.data.title;
                video_json.data.link = `https://www.bilibili.com/video/av${aid}`;
                video_json.data.cover = json.data.cover;
                video_json.data.nickname = json.data.author;
                getBilibiliShareInfo(aid, video_json, resolve);

            });
        }

        function getBilibiliShareInfo(aid, video_json, resolve) {
            GM_postjson('https://api.bilibili.com/x/share/click', `build=1&buvid=1&oid=${aid}&platform=1&share_channel=MARK_POINT&share_id=main.ugc-video-detail.0.0.pv&share_mode=1`, function(shareData) {
                if (shareData.code === 0) {
                    const video_item = shareData.data;

                    if (video_item.title) video_json.data.title = video_item.title;
                    if (video_item.picture) video_json.data.cover = video_item.picture;
                }

                // 获取视频状态信息
                resolve(video_json);
            });
        }

    }

    const show_externaldetail = function(cid, type, vid) {
        const existingPlayer = document.getElementById('floatingExternalDetail');
        if (existingPlayer) existingPlayer.remove();

        // 创建主容器 - 改为亮色背景
        const container = document.createElement('div');
        container.id = 'floatingExternalDetail';
        container.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100vw;
        height: 100vh;
        background-color: rgba(0, 0, 0, 0.7); /* 半透明遮罩层 */
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 9999;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    `;

        // 内容容器 - 改为亮色主题（白灰色）
        const contentContainer = document.createElement('div');
        contentContainer.style.cssText = `
        background: #f8f9fa; /* 主背景改为浅灰色 */
        border-radius: 12px;
        width: 90%;
        max-width: 800px;
        max-height: 90vh;
        overflow-y: auto;
        padding: 30px;
        box-sizing: border-box;
        box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
        color: #333; /* 文字颜色改为深色 */
        position: relative; /* 为关闭按钮提供定位上下文 */
    `;

        // 关闭按钮 - 移到容器内部右上角
        const closeBtn = document.createElement('button');
        closeBtn.textContent = '×';
        closeBtn.style.cssText = `
        position: absolute;
        top: 15px;
        right: 15px;
        background: #f0f0f0; /* 按钮背景改为浅灰色 */
        color: #666; /* 按钮颜色改为灰色 */
        border: none;
        font-size: 24px;
        cursor: pointer;
        z-index: 10000;
        padding: 5px 10px;
        line-height: 1;
        width: 32px;
        height: 32px;
        border-radius: 50%;
        transition: all 0.3s;
        display: flex;
        align-items: center;
        justify-content: center;
    `;
        closeBtn.onmouseenter = () => {
            closeBtn.style.backgroundColor = '#e0e0e0';
            closeBtn.style.color = '#333';
        };
        closeBtn.onmouseleave = () => {
            closeBtn.style.backgroundColor = '#f0f0f0';
            closeBtn.style.color = '#666';
        };

        // 加载状态 - 改为深色文字
        const loadingDiv = document.createElement('div');
        loadingDiv.style.cssText = `
        text-align: center;
        padding: 40px;
        color: #666;
        font-size: 16px;
    `;
        loadingDiv.textContent = '加载中...';
        contentContainer.appendChild(loadingDiv);

        // 组装容器
        contentContainer.appendChild(closeBtn); // 关闭按钮放在内容容器内部
        container.appendChild(contentContainer);
        document.body.appendChild(container);

        // 事件处理
        closeBtn.onclick = () => container.remove();
        container.onclick = (e) => {
            if (e.target === container) container.remove();
        };

        const escHandler = (e) => {
            if (e.key === 'Escape') container.remove();
        };
        document.addEventListener('keydown', escHandler);

        // 清理事件监听器
        container.addEventListener('remove', () => {
            document.removeEventListener('keydown', escHandler);
        });

        // 获取视频详情数据
        get_externaldetail(cid, type, vid).then(response => {
            if (response.code !== 0) {
                loadingDiv.innerHTML = `<div style="color: #dc3545; text-align: center;">${response.message}</div>`;
                return;
            }

            const data = response.data;

            // 清空加载状态
            contentContainer.innerHTML = '';

            // 重新添加关闭按钮
            contentContainer.appendChild(closeBtn);

            // 1. 封面 - 修复加载失败显示问题
            if (data.cover) {
                const coverContainer = document.createElement('div');
                coverContainer.style.cssText = `
                margin-bottom: 25px;
                border-radius: 8px;
                overflow: hidden;
                display: flex;
                justify-content: center;
                background: #e9ecef; /* 封面背景改为浅灰色 */
                min-height: 200px;
                position: relative; /* 为错误提示提供定位上下文 */
            `;

                const coverImg = document.createElement('img');
                coverImg.style.cssText = `
                max-width: 100%;
                max-height: 300px;
                object-fit: contain;
                display: block;
            `;
                coverImg.alt = '视频封面';
                coverImg.src = data.cover;

                const coverError = document.createElement('div');
                coverError.textContent = '封面加载失败';
                coverError.style.cssText = `
                color: #999;
                font-size: 14px;
                display: none; /* 默认隐藏，只有加载失败时才显示 */
                align-items: center;
                justify-content: center;
                height: 200px;
                position: absolute;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background: #e9ecef;
            `;

                coverImg.onerror = () => {
                    coverImg.style.display = 'none';
                    coverError.style.display = 'flex';
                };

                coverContainer.appendChild(coverImg);
                coverContainer.appendChild(coverError);
                contentContainer.appendChild(coverContainer);
            }

            // 创建信息项辅助函数 - 改为亮色主题样式
            const createInfoItem = (label, value, isLink = false) => {
                const item = document.createElement('div');
                item.style.cssText = `
                margin-bottom: 15px;
                padding-bottom: 15px;
                border-bottom: 1px solid rgba(0, 0, 0, 0.1); /* 边框颜色改为深色透明 */
            `;

                const labelSpan = document.createElement('div');
                labelSpan.textContent = label + ':';
                labelSpan.style.cssText = `
                font-size: 14px;
                color: #666; /* 标签颜色改为深灰色 */
                margin-bottom: 5px;
                font-weight: 500;
            `;

                const valueSpan = document.createElement('div');
                if (isLink) {
                    const link = document.createElement('a');
                    link.href = value;
                    link.textContent = value;
                    link.target = '_blank';
                    link.style.cssText = `
                    color: #007bff; /* 链接颜色改为蓝色 */
                    text-decoration: none;
                    word-break: break-all;
                `;
                    link.onmouseenter = () => link.style.textDecoration = 'underline';
                    link.onmouseleave = () => link.style.textDecoration = 'none';
                    valueSpan.appendChild(link);
                } else {
                    valueSpan.textContent = value || '无';
                    valueSpan.style.cssText = `
                    font-size: 16px;
                    word-break: break-all;
                    line-height: 1.5;
                    color: #333; /* 值颜色改为深色 */
                `;
                }

                item.appendChild(labelSpan);
                item.appendChild(valueSpan);
                return item;
            };

            // 2. ID信息（动态渲染所有ids）- 改为亮色主题
            if (data.ids && Object.keys(data.ids).length > 0) {
                const idsItem = document.createElement('div');
                idsItem.style.cssText = `
                margin-bottom: 15px;
                padding-bottom: 15px;
                border-bottom: 1px solid rgba(0, 0, 0, 0.1);
            `;

                const idsLabel = document.createElement('div');
                idsLabel.textContent = 'ID信息:';
                idsLabel.style.cssText = `
                font-size: 14px;
                color: #666;
                margin-bottom: 8px;
                font-weight: 500;
            `;

                const idsContainer = document.createElement('div');
                idsContainer.style.cssText = `
                display: flex;
                flex-wrap: wrap;
                gap: 10px;
            `;

                Object.entries(data.ids).forEach(([key, value]) => {
                    const idBadge = document.createElement('div');
                    idBadge.style.cssText = `
                    background: rgba(0, 123, 255, 0.1); /* 改为浅蓝色背景 */
                    padding: 5px 10px;
                    border-radius: 4px;
                    font-size: 14px;
                    display: flex;
                    flex-direction: column;
                `;

                    const keySpan = document.createElement('span');
                    keySpan.textContent = key;
                    keySpan.style.cssText = `
                    color: #007bff; /* 改为蓝色 */
                    font-weight: 500;
                    margin-bottom: 2px;
                `;

                    const valueSpan = document.createElement('span');
                    valueSpan.textContent = value;
                    valueSpan.style.cssText = `
                    color: #333; /* 改为深色 */
                `;

                    idBadge.appendChild(keySpan);
                    idBadge.appendChild(valueSpan);
                    idsContainer.appendChild(idBadge);
                });

                idsItem.appendChild(idsLabel);
                idsItem.appendChild(idsContainer);
                contentContainer.appendChild(idsItem);
            }

            // 3. 标题
            if (data.title) {
                contentContainer.appendChild(createInfoItem('标题', data.title));
            }

            // 4. 简介
            if (data.description) {
                const descItem = createInfoItem('简介', data.description);
                descItem.lastChild.style.whiteSpace = 'pre-wrap';
                contentContainer.appendChild(descItem);
            }

            // 5. 上传
            if (data.created) {
                contentContainer.appendChild(createInfoItem('上传', data.created));
            }

            // 6. 视频时长
            if (data.duration) {
                const durationStr = formatDuration(data.duration);
                contentContainer.appendChild(createInfoItem('时长', durationStr));
            }

            // 7. 用户名
            if (data.nickname) {
                contentContainer.appendChild(createInfoItem('用户', data.nickname));
            }

            // 8. 视频状态
            if (data.state) {
                const stateItem = createInfoItem('状态', data.state);
                const stateValue = stateItem.lastChild;

                // 根据状态添加颜色
                if (typeof data.state === 'string') {
                    const stateLower = data.state.toLowerCase();
                    if (stateLower.includes('正常') || stateLower.includes('成功')) {
                        stateValue.style.color = '#28a745'; /* 成功绿色 */
                    } else if (stateLower.includes('失败') || stateLower.includes('错误') || stateLower.includes('分级') || stateLower.includes('不合规') || stateLower.includes('下线')) {
                        stateValue.style.color = '#dc3545'; /* 错误红色 */
                    } else if (stateLower.includes('审核') || stateLower.includes('等待') || stateLower.includes('处理')) {
                        stateValue.style.color = '#ffc107'; /* 警告黄色 */
                    }
                }
                contentContainer.appendChild(stateItem);
            }

            // 9. 视频页地址
            if (data.link) {
                contentContainer.appendChild(createInfoItem('视频页面', data.link, true));
            }

            // 如果没有数据
            if (contentContainer.children.length === 1) { // 只有关闭按钮
                const emptyMsg = document.createElement('div');
                emptyMsg.textContent = '暂无视频详情信息';
                emptyMsg.style.cssText = `
                text-align: center;
                color: #666;
                padding: 40px;
                font-size: 16px;
            `;
                contentContainer.appendChild(emptyMsg);
            }

        }).catch(error => {
            loadingDiv.innerHTML = `<div style="color: #dc3545; text-align: center;">请求失败: ${error.message}</div>`;
        });



        return {
            close: () => container.remove()
        };
    };


    function create_externaldetail_item(cid, type, vid) {
        const cid_item = document.getElementById('cid_' + cid)
        if (cid_item) {
            const externaldetail_item = document.createElement('div');
            externaldetail_item.className = "solidbox pointer";
            externaldetail_item.onclick = () => show_externaldetail(cid, type, vid);
            externaldetail_item.textContent = "源详情";
            cid_item.parentNode.insertBefore(externaldetail_item, cid_item);
        }
    };
    const timer = setInterval(function() {
        if (window.view_all_data) {
            const json = window.view_all_data
            if (json.code === 0) {
                json.data.parts.forEach(part => {
                    create_externaldetail_item(part.cid, part.type, part.vid);
                })
            }
            clearInterval(timer);
        }
    }, 200);

}

// 修复随机视频获取
function fix_index_random_video() {
    // 只在主页执行
    const currentPath = window.location.pathname;
    const isTargetPage = currentPath === "/";
    const hasQuery = window.location.search !== "";


    if (!isTargetPage || hasQuery) return;

    /* 修复随机aid视频*/

    // 原函数为random()
    function random_fix(json) {
        document.getElementById('random-id')
            .parentNode.href = '/video/av' + json.aid + '/';
        document.getElementById('random-pic')
            .setAttribute('_src', json.pic.replace(/https?:/, 'https:') + '@120w.jpg');
        document.getElementById('random-id')
            .textContent = 'AV' + json.aid;
        document.getElementById('random-title')
            .textContent = json.title;
        document.getElementById('random-up')
            .parentNode.href = '/space/' + json.mid + '/';
        document.getElementById('random-up')
            .textContent = 'UP: ' + json.author;
        img_lazyload();
    }
    // 用bp的view接口随机获取一个av号一千万以内的稿件
    async function get_random_aid() {
        const aid = Math.floor(Math.random() * 10000000) + 1;
        await getjson('/api/view?id=' + aid, async json => {
            if (json.code === undefined) { // 没有code则代表获取的是有效稿件数据
                random_fix(json);
            } else {
                await sleep(1); // 简单缓解被拉黑导致-503错误
                get_random_aid();
            }
        });
    }
    // 替换刷新按钮点击事件
    function replace_reload_onlick() {
        // 获取borderbox对应的div标签
        const box = document.querySelector('div.borderbox');
        if (box) {
            // 找出div中的onclick元素
            const hasOnclick = Array.from(
                box.querySelectorAll('[onclick]')
            );
            // 重新给点击事件赋值
            hasOnclick.forEach(el => {
                el.onclick = get_random_aid;
            });
        }
    }

    /* 配置随机cid功能 */


    function create_random_cid_item() {
        const content = document.getElementById("content");
        // 创建外层容器
        const containerDiv = document.createElement('div');
        containerDiv.className = 'borderbox';
        containerDiv.style.cssText = 'margin:5px 0;width:305px;position:relative';

        // 创建图片元素
        const img = document.createElement('img');
        img.id = 'random-cid-pic';
        img.style.cssText = 'width:120px;display:inline-block';
        img.onerror = function() {
            this.src = blankImg;
        };

        // 创建文本信息容器
        const textSpan = document.createElement('span');
        textSpan.style.cssText = 'display:inline-block;width:185px;vertical-align:top;white-space:pre;overflow:hidden;text-overflow:ellipsis;line-height:1.5em';

        // 创建第一个链接（视频信息）
        const videoLink = document.createElement('a');
        videoLink.target = '_blank';

        // 创建视频ID显示
        const idSpan = document.createElement('span');
        idSpan.id = 'random-cid-id';
        idSpan.style.color = '#666';
        idSpan.textContent = 'AVxxxxx-CIDxxxxx';

        // 创建视频标题显示
        const titleSpan = document.createElement('span');
        titleSpan.id = 'random-cid-title';
        titleSpan.textContent = '加载随机CID中';

        // 创建换行
        const br1 = document.createElement('br');

        // 将ID和标题添加到第一个链接中
        videoLink.appendChild(idSpan);
        videoLink.appendChild(br1);
        videoLink.appendChild(titleSpan);

        // 创建第二个链接（UP主信息）
        const upLink = document.createElement('a');
        upLink.target = '_blank';

        // 创建UP主显示
        const upSpan = document.createElement('span');
        upSpan.id = 'random-cid-up';
        upSpan.style.color = '#999';
        upSpan.textContent = 'UP: xxxx';

        // 将UP信息添加到第二个链接中
        upLink.appendChild(upSpan);

        // 创建换行
        const br2 = document.createElement('br');

        // 将两个链接添加到文本容器中
        textSpan.appendChild(videoLink);
        textSpan.appendChild(br2);
        textSpan.appendChild(upLink);

        // 创建刷新按钮
        const reloadSpan = document.createElement('span');
        reloadSpan.style.cssText = 'position:absolute;padding:5px;right:0;bottom:0;cursor:pointer';
        reloadSpan.textContent = 'Reload';
        reloadSpan.onclick = function() {
            get_random_cid();
        };

        // 将元素组装到容器中
        containerDiv.appendChild(img);
        containerDiv.appendChild(textSpan);
        containerDiv.appendChild(reloadSpan);

        const normal_container = document.getElementById("normal_container");
        if (normal_container) {
            content.insertBefore(containerDiv, normal_container);
        } else {
            content.appendChild(containerDiv);
        }
    }

    function random_cid(json) {
        const data = json.data
        document.getElementById('random-cid-id')
            .parentNode.href = '/all/video/av' + data.aid + '/';
        document.getElementById('random-cid-pic')
            .setAttribute('_src', data.cover.replace(/https?:/, 'https:') + '@120w.jpg');
        document.getElementById('random-cid-id')
            .textContent = 'AV' + data.aid + '-' + 'CID' + data.cid;
        if (data.title == "") {
            document.getElementById('random-cid-title')
                .textContent = data.subtitle;
        } else {
            document.getElementById('random-cid-title')
                .textContent = data.title;
        }

        document.getElementById('random-cid-up')
            .parentNode.href = '/space/' + data.mid + '/';
        document.getElementById('random-cid-up')
            .textContent = 'UP: ' + data.author;
        img_lazyload();
    }
    async function get_random_cid() {
        // 4000000以内cid大多为非直传源
        const cid = Math.floor(Math.random() * 4000000) + 1;
        await getjson('/api/cidinfo?cid=' + cid, async json => {
            if (json.code === 0) { // code为0代表有效数据
                random_cid(json);
            } else {
                await sleep(1); // 简单缓解被拉黑导致-503错误
                get_random_cid();
            }
        });
    }

    // 执行
    replace_reload_onlick();
    get_random_aid();

    if (localStorage.random_cid == 'on') { // 启用'额外功能' => '随机CID'
        create_random_cid_item();
        get_random_cid();
    }
}

// 修复用户信息获取
function fix_space_userinfo() {
    // 只在space页面执行
    const currentPath = window.location.pathname;
    const targetPages = ['/space/'];
    const isTargetPage = targetPages.some(page => currentPath.startsWith(page));

    if (!isTargetPage) return;

    function userinfo_fix(json) {
        if (json.code == 0) {
            var card = json.data.card;
            document.getElementById('userinfo').innerHTML = '<img style="width:128px" _src="' + card.face + '"><br/><br/><b style="word-break:break-all">' + card.sign + '</b><br/><br/>关注：' + (card.attention | 0) + '<br/>粉丝：' + card.fans + '<br/>投稿数：<span id="article">' + json.data.archive_count + '</span><br><a href="http://space.bilibili.com/' + card.mid + '" target="_blank"><div class="solidbox">UP主空间</div></a>';
            document.getElementById('header').childNodes[0].innerHTML = card.name;
            titletext = card.name + ' - UP主 - BiliPlus - ( ゜- ゜)つロ 乾杯~';
            title(0);
            imgClick();
            img_lazyload();
        } else {
            document.getElementById('userinfo').innerHTML = '<div class="borderbox pink">修复用户信息失败：[' + json.code + '] ' + json.message + '</div>';
        }
    }

    function get_userinfo_data() {
        GM_getjson('https://api.bilibili.com/x/web-interface/card?mid=' + attention.mid, function(json) {
            if (json.code === 0) {
                userinfo_fix(json);
            }
        });
    }
    const timer = setInterval(function() {
        const targetElement = document.getElementById("userinfo");
        if (targetElement && targetElement.innerHTML.includes("获取用户信息失败")) {

            get_userinfo_data();
            clearInterval(timer);
        }
    }, 200);
}

function fix_space_user_video() {
    // 只在space页面执行
    const currentPath = window.location.pathname;
    const targetPages = ['/space/'];
    const isTargetPage = targetPages.some(page => currentPath.startsWith(page));

    if (!isTargetPage) return;



    function printPage_fix(json, page) {

        isLoading = false;
        window.page = page;
        var str = '',
            i = 0,
            current, count = document.getElementById('article'),
            pagetmp = page - 2,
            mid = attention.mid;
        for (; i < json.data.archives.length; i++) {

            current = json.data.archives[i];

            str += '<hr><table width="100%" border="0"><tr><td width="15%" align="center" class="title">' + "视频" + '</td><td width="85%" align="center" class="title"><b>' + current.title + '</b></td></tr></table><table width="100%" border="0"><tr><td rowspan="5" style="vertical-align:top"><img width="120" _src="' + current.pic + '@120w.jpg" original-src="' + current.pic + '" style="float:left"/></td></tr><tr><td colspan="2" style="word-break:break-all" class="checktextheight pretext"><div>' + current.bvid + '</div></td></tr><tr><td colspan="2" style="color:#666"><b> 发布于 <span datetime="' + new Date(Number(current.pubdate) * 1000).toISOString() + ' +0800' + '" class="timeago normal"></span><span class="hover">' + new Date(Number(current.pubdate) * 1000).toLocaleString(undefined, {
                hour12: false
            }) + '</span></span></b>|<b> 播放:' + current.stat.view + ' </b>|<b> 收藏:' + current.stat.favorite + ' </b>|<b> 评论:' + current.stat.reply + ' </b>|<b> 弹幕:' + current.stat.danmaku + ' </b>|<b> 硬币:' + current.stat.coin + '</b></td></tr><tr><td width="50%" align="center" class="button"><a href="/video/av' + current.aid + '/"><b>视频详情</b></a></td><td width="50%" align="center" class="button"><a href="http://www.bilibili.com/video/av' + current.aid + '/" target="_blank"><b>前往主站播放</b></a></td></tr></table>';

        }
        article = json.data.page.count;
        if (count != null)
            count.innerHTML = article;
        document.getElementById('list').innerHTML = str;
        str = ''
        pages = Math.floor(json.data.page.count / 50) + 1
        if (pages == 0)
            str = '<div class="solidbox"><b>0/0</b></div>';
        else {
            if (page > 1)
                str += '<a data-page="1"><div id="first" class="solidbox"><b>&lt;&lt;</b></div></a><a data-page="' + (page - 1) + '"><div id="previous" class="solidbox"><b>&lt;</b></div></a> '
            for (i = 0; i < 5; i++, pagetmp++) {
                if (pagetmp == page)
                    str += '<div class="solidbox"><b>' + pagetmp + '/' + pages + '</b></div> ';
                else if ((pagetmp > 0) && (pagetmp < ((pages | 0) + 1)))
                    str += '<a data-page="' + pagetmp + '"><div class="solidbox">' + pagetmp + '</div></a> ';
            }
            if (page < pages)
                str += '<a data-page="' + (page + 1) + '"><div id="next" class="solidbox"><b>&gt;</b></div></a><a data-page="' + pages + '"><div id="last" class="solidbox"><b>&gt;&gt;</b></div></a>';
        }
        document.getElementById('footer').innerHTML = str;
        Array.from(document.getElementById('footer').querySelectorAll('a[data-page]')).find(function(i) {
            var page = i.getAttribute('data-page');
            i.setAttribute('onclick', 'loadPage_fix(' + page + ');return false');
            i.href = '/space/' + mid + '/' + page;
            i.removeAttribute('data-page');
        })
        imgClick();
        img_lazyload();
        appLinkClick();
        textAutohide();
        timeagoRun();
    }

    function loadPage_fix(page) {
        if (isLoading) return;
        if (page != window.page)
            history.pushState({}, page, '/space/' + attention.mid + '/' + page);
        isLoading = true;
        GM_getjson('https://api.bilibili.com/x/space/arc/list?ps=50&mid=' + attention.mid + '&pn=' + page, printPage_fix, page)
        document.getElementById('list').innerHTML = '<div class="borderbox pink">修复加载中...</div>';
        GA_Log(location.href, '');
    }
    loadPage_fix(page);
}

function fix_video_user_video() {

    const currentPath = window.location.pathname;
    const targetPages = ['/video/'];
    const isTargetPage = targetPages.some(page => currentPath.startsWith(page));

    if (!isTargetPage) return;

    // 点击视频卡片跳转
    var loadVideoByAid = function(e) {
        clearInterval(timer);
        e.preventDefault();
        ajaxLoad(this.getAttribute("data-aid"));
    };

    // 点击分页按钮加载对应页
    var loadUpVideoPage = function(e) {
        // 清理timer
        clearInterval(timer);
        e.preventDefault();
        load_fix(0 | this.getAttribute("data-page"));
    };


    function printPage_fix(json, page) {
        // 重点标记，此处变量名混淆由Ai对抗

        var contentElement = document.getElementById("uplist_content"),
            startPage = page - 2;

        if (null != contentElement) {
            // 清空现有内容
            Array.from(contentElement.children).forEach(function(child) {
                child.remove()
            });

            // 添加视频列表项

            json.data.archives.forEach(function(video) {

                contentElement.appendChild(_("a", {
                    href: "/video/av" + video.aid + "/",
                    "data-aid": video.aid,
                    event: {
                        click: loadVideoByAid
                    }
                }, [
                    _("div", {
                        className: "borderbox",
                        style: {
                            width: "calc(100% - 16px)"
                        }
                    }, [
                        _("table", {}, [
                            _("tbody", {}, [
                                _("tr", {}, [
                                    _("td", {}, [
                                        _("img", {
                                            src: blankImg,
                                            _src: video.pic,
                                            style: {
                                                width: "120px"
                                            }
                                        })
                                    ]),
                                    _("td", {}, [
                                        _("div", {}, [
                                            _("text", video.title)
                                        ])
                                    ])
                                ])
                            ])
                        ])
                    ])
                ]))
            });

            var pages = Math.floor(json.data.page.count / 50) + 1

            // 创建分页元素
            var paginationElements = [];

            // 添加第一页链接（<<）
            if (page > 1) {
                paginationElements.push(_("a", {
                    href: "/space/" + attention.mid + "/",
                    "data-page": 1,
                    event: {
                        click: loadUpVideoPage
                    }
                }, [
                    _("div", {
                        className: "solidbox"
                    }, [
                        _("text", "<<")
                    ])
                ]));
            }

            // 添加页码链接（显示5个页码）
            for (var i = 0; i < 5; i++, startPage++) {
                if (page == startPage) {
                    // 当前页显示为"页码/总页数"
                    paginationElements.push(_("div", {
                        className: "solidbox"
                    }, [
                        _("text", startPage + "/" + pages)
                    ]));
                } else if (startPage > 0 && startPage < (0 | pages) + 1) {
                    // 其他有效页码
                    paginationElements.push(_("a", {
                        href: "/space/" + attention.mid + "/" + startPage,
                        "data-page": startPage,
                        event: {
                            click: loadUpVideoPage
                        }
                    }, [
                        _("div", {
                            className: "solidbox"
                        }, [
                            _("text", startPage)
                        ])
                    ]));
                }
            }

            // 添加最后一页链接（>>）
            if (page < (0 | pages)) {
                paginationElements.push(_("a", {
                    href: "/space/" + attention.mid + "/" + pages,
                    "data-page": pages,
                    event: {
                        click: loadUpVideoPage
                    }
                }, [
                    _("div", {
                        className: "solidbox"
                    }, [
                        _("text", ">>")
                    ])
                ]));
            }

            // 将分页添加到内容容器
            contentElement.appendChild(_("div", {
                className: "footer_video"
            }, paginationElements));

            // 停止dots计时器并启动图片懒加载
            dots.stopTimer();
            img_lazyload();
        }
    };

    function load_fix(page) {

        document.getElementById("uplist_content").innerHTML = '<div id="dots_container" style="overflow:hidden;width:100%;height:30px"></div>', dots.config.height = "30px", dots.config.width = document.getElementById(dots.config.id).offsetWidth + "px", dots.runTimer(), GM_getjson('https://api.bilibili.com/x/space/arc/list?ps=50&mid=' + attention.mid + '&pn=' + page, printPage_fix, page)
    };


    // 重点标记，这里分页还有bug，循环检测可能会导致新页面被第一页覆盖load_fix(1);
    // 目前应对策略是用户点击分页或视频卡片后清理timer(代表页面修复成功而不是被原页面覆盖)

    const timer = setInterval(function() {


        const targetElement = document.getElementById("uplist_content");

        // 条件：页面已创建uplist_content并且(uplist_content含有视频卡片 或 uplist_content含有分页容器)
        // 分页容器检查防止up主无投稿
        const hasVideoCard = targetElement && (targetElement.querySelector("a[data-aid]") || targetElement.querySelector(".footer_video"));
        if (!hasVideoCard) {

            load_fix(1);


        }
    }, 200);


}
// 修复html5播放器
// 重点标记，此函数需完善
function fix_video_h5play() {

    // 强制加载在线播放按钮

    const enablePlayback = localStorage.getItem('enablePlayback');
    if (enablePlayback !== 'on') {
        localStorage.setItem('enablePlayback', 'on');
    }

    const currentPath = window.location.pathname;
    const targetPages = ['/video/', '/all/video/'];
    const isTargetPage = targetPages.some(page => currentPath.startsWith(page));
    if (!isTargetPage) return;

    /* 配置h5视频播放器 */
    // 尝试基于原播放器修复，结果失败


    // 添加至历史记录
    var history_add = function(cid) {
        if (localStorage.ban_history !== "on") {
            getjson("/api/history_add?aid=" + av + "&cid=" + cid, function() {});
        }


    };

    h5jump = function(partIndex) {
        var videoType = items[partIndex - 1][0],
            partTitle = items[partIndex - 1][1],
            cid = items[partIndex - 1][2],
            videoId = items[partIndex - 1][3]


        // 验证视频类型
        if ("none" == videoType || ["vupload", "movie", "bangumi"].indexOf(videoType) == -1 && "" == videoId) {
            return false;
        }
        // 处理视频类型转换
        "letv" == videoType && (videoType = "vupload", videoId = "vupload_" + cid);
        "vupload" == videoType && "" == videoId && (videoId = "vupload_" + cid);
        history_add(cid); // 添加到历史记录

        // 重点标记，此处视频播放器由Ai编写

        // 如果播放器已存在，先移除
        const existingPlayer = document.getElementById('floatingVideoPlayer');
        if (existingPlayer) {
            existingPlayer.remove();
        }

        // 创建新的播放器容器
        let containerElement = document.body.appendChild(document.createElement("div"));
        containerElement.outerHTML = `
        <div id="floatingVideoPlayer" style="
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            width: 900px;
            max-width: 90vw;
            height: 550px;
            max-height: 80vh;
            background-color: #EFEFF4;
            border-radius: 12px;
            box-shadow: 0 10px 50px rgba(0,0,0,0.5);
            z-index: 99999;
            overflow: hidden;
            display: flex;
            flex-direction: column;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
        ">
            <!-- 播放器头部 -->
            <div style="
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding: 15px 20px;
                background-color: #EFEFF4;
                border-bottom: 1px solid rgba(255,255,255,0.1);
            ">
                <!-- 标题 -->
                <div style="color: black; font-size: 16px; font-weight: bold; max-width: 80%; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">
                ${partTitle} VID：${videoId}
                </div>
                
                <!-- 关闭按钮 -->
                <div id="closeVideoPlayer" style="
                    width: 36px;
                    height: 36px;
                    background-color: rgba(0,0,0,0.1);
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    cursor: pointer;
                    transition: all 0.2s;
                    flex-shrink: 0;
                " onmouseover="this.style.backgroundColor='rgba(255,255,255,0.2)';this.style.transform='rotate(90deg)';" 
                onmouseout="this.style.backgroundColor='rgba(255,255,255,0.1)';this.style.transform='rotate(0deg)';">
                    <span style="color: white; font-size: 24px; font-weight: bold; line-height: 1;">×</span>
                </div>
            </div>
            
            <!-- 视频容器 -->
            <div id="videoContainer" style="
                flex: 1;
                display: flex;
                align-items: center;
                justify-content: center;
                background-color: #000;
                position: relative;
                overflow: hidden;
            ">
                <!-- 视频播放器将会在这里动态创建 -->
                <div id="videoLoading" style="
                    color: white;
                    font-size: 16px;
                    text-align: center;
                ">
                    视频加载中...<br>播放器目前仅支持新浪源<br>若无法加载请在cid记录页播放
                </div>
            </div>
            
        </div>
    `;


        // 添加事件监听器
        const playerElement = document.getElementById('floatingVideoPlayer');
        const closeBtn = document.getElementById('closeVideoPlayer');

        // 关闭按钮事件
        closeBtn.addEventListener('click', function() {
            playerElement.style.display = 'none';
            // 停止所有视频播放
            const videos = playerElement.getElementsByTagName('video');
            for (let video of videos) {
                video.pause();
            }

            // 也可以完全移除播放器
            setTimeout(() => {
                playerElement.remove();
            }, 300);
        });

        // 添加ESC键关闭功能
        const closeOnEsc = function(e) {
            if (e.key === 'Escape') {
                closeBtn.click();
                document.removeEventListener('keydown', closeOnEsc);
            }
        };
        document.addEventListener('keydown', closeOnEsc);

        // 获取视频URL并创建播放器
        const videoUrl = get_video_url(cid, videoType, videoId);


        // 创建视频元素
        videoUrl.then(url => {

            createVideoPlayer(url);
        });
    };

    // 创建视频播放器的函数
    function createVideoPlayer(videoUrl) {

        const videoContainer = document.getElementById('videoContainer');
        const loadingElement = document.getElementById('videoLoading');

        // 移除加载提示
        if (loadingElement) {
            loadingElement.remove();
        }

        // 创建视频元素
        const videoElement = document.createElement('video');
        videoElement.id = 'mainVideoPlayer';
        videoElement.style.width = '100%';
        videoElement.style.height = '100%';
        videoElement.controls = true;
        videoElement.autoplay = true;

        // 设置视频源
        videoElement.innerHTML = `
        <source src="${videoUrl}" type="video/mp4">
        您的浏览器不支持视频播放。
    `;

        // 添加到容器
        videoContainer.appendChild(videoElement);

        // 视频加载错误处理
        videoElement.addEventListener('error', function() {
            videoContainer.innerHTML = `
            <div style="color: white; text-align: center; padding: 20px;">
                <div style="font-size: 24px; margin-bottom: 10px;">⚠️</div>
                <div>视频加载失败</div>
                <button onclick="location.reload()" style="
                    margin-top: 15px;
                    padding: 8px 16px;
                    background-color: #3498db;
                    color: white;
                    border: none;
                    border-radius: 4px;
                    cursor: pointer;
                ">
                    重试
                </button>
            </div>
        `;
        });

    }

    function get_video_url(cid, videoType, videoId) {
        if (videoType === "sina") {
            return new Promise((resolve, reject) => {
                GM_getjson('https://s.video.sina.com.cn/video/getvideoidbyvid?vid=' + videoId, function(json) {
                    if (json.code === 1) {
                        var sina_video_id = json.data.video_id;
                        GM_getjson('http://api.ivideo.sina.com.cn/public/video/play?appname=sinaplayer_pc&tags=sinaplayer_pc&applt=web&appver=V11220.210521.03&player=all&video_id=' + sina_video_id, function(json) {
                            if (json.code === 1) {
                                // 定义视频格式的优先级
                                const formatPriority = ['mp4', 'flv', 'hlv'];

                                // 按优先级查找视频
                                let videoUrl = '';

                                for (const format of formatPriority) {
                                    const video = json.data.videos.find(v => v.type === format);

                                    if (video && video.dispatch_result && video.dispatch_result.url) {
                                        videoUrl = video.dispatch_result.url;
                                        break;
                                    }
                                }

                                // 如果找到了优先格式的视频，使用它的URL
                                if (videoUrl) {
                                    resolve(videoUrl);
                                } else {
                                    resolve("http://edge.v.iask.com.sinacloud.net/" + videoId + ".flv");
                                }
                            } else {
                                resolve("http://edge.v.iask.com.sinacloud.net/" + videoId + ".flv");
                            }
                        });
                    } else {
                        resolve("http://edge.v.iask.com.sinacloud.net/" + videoId + ".flv");
                    }
                });
            });
        }


    }

}

function fix_full_danmaku() {
    const currentPath = window.location.pathname;
    const targetPages = ['/open/moepus.powered.full-danmaku.php'];
    const isTargetPage = targetPages.some(page => currentPath.startsWith(page));

    if (!isTargetPage) return;

    // 新的全弹幕获取页布局
    function new_full_danmaku() {
        // 获取参数cid(如果有)
        const cid = location.hash.slice(1);
        // 清空body
        document.body.textContent = '';

        // 设置页面基本样式
        document.body.style.cssText = `
        font-family: 'Microsoft YaHei', Arial, sans-serif;
        max-width: 800px;
        margin: 0 auto;
        padding: 20px;
        background-color: #f5f5f5;
        min-height: 100vh;
        box-sizing: border-box;
    `;

        // 创建主容器
        const container = document.createElement('div');
        container.style.cssText = `
        background: white;
        border-radius: 10px;
        padding: 25px;
        box-shadow: 0 2px 10px rgba(0,0,0,0.1);
    `;

        // 创建标题
        const title = document.createElement('h1');
        title.textContent = '全弹幕下载';
        title.style.cssText = `
        text-align: center;
        color: #333;
        margin-top: 0;
        margin-bottom: 30px;
        padding-bottom: 15px;
        border-bottom: 2px solid #e8e8e8;
    `;
        container.appendChild(title);

        // 第一部分：CID输入区域
        const cidSection = document.createElement('div');
        cidSection.style.cssText = `
        background: #f9f9f9;
        padding: 20px;
        border-radius: 8px;
        margin-bottom: 20px;
        border: 1px solid #e0e0e0;
    `;

        const cidLabel = document.createElement('label');
        cidLabel.textContent = '视频CID：';
        cidLabel.style.cssText = `
        display: block;
        margin-bottom: 10px;
        font-weight: bold;
        color: #555;
    `;
        cidSection.appendChild(cidLabel);

        const cidInputContainer = document.createElement('div');
        cidInputContainer.style.cssText = `
        display: flex;
        gap: 10px;
        align-items: center;
    `;

        const cidInput = document.createElement('input');
        cidInput.type = 'text';
        cidInput.placeholder = '请输入视频CID（纯数字）';
        cidInput.value = cid || '';
        cidInput.style.cssText = `
            flex: 1;
            min-width: 0;
            padding: 12px 15px;
            border: 2px solid #ddd;
            border-radius: 6px;
            font-size: 16px;
            transition: border-color 0.3s;
            box-sizing: border-box;
        `;

        // 限制只能输入数字
        cidInput.addEventListener('input', function(e) {
            this.value = this.value.replace(/[^\d]/g, '');
        });

        const getButton = document.createElement('button');
        getButton.textContent = '获取';
        getButton.style.cssText = `
            padding: 12px 25px;
            background: linear-gradient(135deg, #00a1d6, #0089b4);
            color: white;
            border: none;
            border-radius: 6px;
            font-size: 16px;
            font-weight: bold;
            cursor: pointer;
            transition: all 0.3s ease;
            white-space: nowrap;
            flex-shrink: 0;
            box-sizing: border-box;
        `;

        // 按钮悬停效果
        getButton.addEventListener('mouseenter', function() {
            this.style.background = 'linear-gradient(135deg, #0089b4, #00729c)';
            this.style.transform = 'translateY(-2px)';
            this.style.boxShadow = '0 4px 8px rgba(0, 161, 214, 0.3)';
        });

        getButton.addEventListener('mouseleave', function() {
            this.style.background = 'linear-gradient(135deg, #00a1d6, #0089b4)';
            this.style.transform = 'translateY(0)';
            this.style.boxShadow = 'none';
        });

        // 第二部分：参数设置区域
        const paramsSection = document.createElement('div');
        paramsSection.style.cssText = `
        background: #f9f9f9;
        padding: 20px;
        border-radius: 8px;
        margin-bottom: 20px;
        border: 1px solid #e0e0e0;
    `;

        const paramsTitle = document.createElement('h3');
        paramsTitle.textContent = '参数设置';
        paramsTitle.style.cssText = `
        margin-top: 0;
        margin-bottom: 15px;
        color: #555;
    `;
        paramsSection.appendChild(paramsTitle);

        const paramsGrid = document.createElement('div');
        paramsGrid.style.cssText = `
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 15px;
    `;

        // 输入框
        const paramInputContainer = document.createElement('div');
        const paramInputLabel = document.createElement('label');
        paramInputLabel.textContent = 'B站Cookie：';
        paramInputLabel.style.cssText = `
        display: block;
        margin-bottom: 5px;
        color: #666;
    `;
        paramInputContainer.appendChild(paramInputLabel);

        const paramInput = document.createElement('input');
        paramInput.type = 'text';
        paramInput.placeholder = '输入B站Cookie';
        paramInput.style.cssText = `
        width: 100%;
        padding: 10px;
        border: 2px solid #ddd;
        border-radius: 6px;
        font-size: 14px;
        box-sizing: border-box;
    `;
        paramInputContainer.appendChild(paramInput);

        // 获取功能点击事件
        getButton.addEventListener('click', function() {
            if (cidInput.value.trim() === '' || paramInput.value.trim() === '') {
                alert('请确保CID和哔哩哔哩Cookie均已填写');
                cidInput.focus();
                return;
            }
            get_full_danmaku(cidInput.value.trim());
        });

        cidInputContainer.appendChild(cidInput);
        cidInputContainer.appendChild(getButton);
        cidSection.appendChild(cidInputContainer);

        // 拖动条
        const sliderContainer = document.createElement('div');
        const sliderLabel = document.createElement('label');
        sliderLabel.textContent = '请求间隔：';
        sliderLabel.style.cssText = `
        display: block;
        margin-bottom: 5px;
        color: #666;
    `;
        sliderContainer.appendChild(sliderLabel);

        const sliderValue = document.createElement('span');
        sliderValue.textContent = '3.5';
        sliderValue.style.cssText = `
        display: inline-block;
        margin-left: 10px;
        font-weight: bold;
        color: #00a1d6;
        min-width: 30px;
    `;

        const slider = document.createElement('input');
        slider.type = 'range';
        slider.min = '2.5';
        slider.max = '10';
        slider.step = '0.1';
        slider.value = '3.5';
        slider.style.cssText = `
        width: 100%;
        height: 6px;
        border-radius: 3px;
        background: #ddd;
        outline: none;
        -webkit-appearance: none;
    `;

        // 自定义滑块样式
        slider.style.background = `linear-gradient(to right, #00a1d6 0%, #00a1d6 ${(slider.value - 2.5) * 100 / 7.5}%, #ddd ${(slider.value - 2.5) * 100 / 7.5}%, #ddd 100%)`;

        slider.addEventListener('input', function() {
            sliderValue.textContent = parseFloat(this.value).toFixed(1);
            this.style.background = `linear-gradient(to right, #00a1d6 0%, #00a1d6 ${(this.value - 2.5) * 100 / 7.5}%, #ddd ${(this.value - 2.5) * 100 / 7.5}%, #ddd 100%)`;
        });

        slider.addEventListener('change', function() {
            sliderValue.textContent = parseFloat(this.value).toFixed(1);
        });

        const sliderWrapper = document.createElement('div');
        sliderWrapper.style.cssText = `
        display: flex;
        align-items: center;
        gap: 10px;
    `;
        sliderWrapper.appendChild(slider);
        sliderWrapper.appendChild(sliderValue);
        sliderContainer.appendChild(sliderWrapper);

        paramsGrid.appendChild(paramInputContainer);
        paramsGrid.appendChild(sliderContainer);
        paramsSection.appendChild(paramsGrid);

        // 第三部分：下载按钮（默认隐藏）
        const downloadSection = document.createElement('div');
        downloadSection.style.cssText = `
        margin-bottom: 20px;
        display: none;
    `;

        const downloadButton = document.createElement('button');
        downloadButton.textContent = '下载全弹幕XML文件';
        downloadButton.style.cssText = `
        width: 100%;
        padding: 15px;
        background: linear-gradient(135deg, #4CAF50, #45a049);
        color: white;
        border: none;
        border-radius: 8px;
        font-size: 16px;
        font-weight: bold;
        cursor: pointer;
        transition: all 0.3s ease;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 10px;
    `;

        // 下载按钮悬停效果
        downloadButton.addEventListener('mouseenter', function() {
            this.style.background = 'linear-gradient(135deg, #45a049, #3d8b40)';
            this.style.transform = 'translateY(-2px)';
            this.style.boxShadow = '0 4px 8px rgba(76, 175, 80, 0.3)';
        });

        downloadButton.addEventListener('mouseleave', function() {
            this.style.background = 'linear-gradient(135deg, #4CAF50, #45a049)';
            this.style.transform = 'translateY(0)';
            this.style.boxShadow = 'none';
        });

        downloadSection.appendChild(downloadButton);

        // 第四部分：信息输出面板
        const infoPanel = document.createElement('div');
        infoPanel.style.cssText = `
        background: #f9f9f9;
        border: 1px solid #e0e0e0;
        border-radius: 8px;
        padding: 20px;
        min-height: 200px;
        max-height: 400px;
        overflow-y: auto;
        font-family: 'Consolas', 'Monaco', monospace;
        font-size: 14px;
        line-height: 1.5;
        color: #333;
    `;

        const infoTitle = document.createElement('h3');
        infoTitle.textContent = '信息输出';
        infoTitle.style.cssText = `
        margin-top: 0;
        margin-bottom: 15px;
        color: #555;
        display: flex;
        justify-content: space-between;
        align-items: center;
    `;
        infoPanel.appendChild(infoTitle);

        const infoContent = document.createElement('div');
        infoContent.id = 'info-output';
        infoContent.style.cssText = `
        white-space: pre-wrap;
        word-break: break-all;
    `;
        infoPanel.appendChild(infoContent);

        // 将所有部分添加到容器
        container.appendChild(cidSection);
        container.appendChild(paramsSection);
        container.appendChild(downloadSection);
        container.appendChild(infoPanel);

        // 将容器添加到body
        document.body.appendChild(container);

        // 暴露一些元素给外部使用
        window.danmakuPage = {
            cidInput,
            getButton,
            paramInput,
            slider,
            sliderValue,
            downloadSection,
            downloadButton,
            infoContent,

            // 显示下载按钮
            showDownloadButton: function() {
                downloadSection.style.display = 'block';
            },

            // 隐藏下载按钮
            hideDownloadButton: function() {
                downloadSection.style.display = 'none';
            },

            // 添加信息到输出面板
            addInfo: function(message, type = 'info') {
                const colors = {
                    info: '#333',
                    success: '#4CAF50',
                    error: '#f44336',
                    warning: '#ff9800'
                };

                const messageElement = document.createElement('div');
                messageElement.textContent = `[${new Date().toLocaleTimeString()}] ${message}`;
                messageElement.style.cssText = `
                margin-bottom: 5px;
                color: ${colors[type] || colors.info};
                border-left: 3px solid ${colors[type] || colors.info};
                padding-left: 10px;
            `;

                infoContent.appendChild(messageElement);
                infoPanel.scrollTop = infoPanel.scrollHeight;
            },

            // 清空信息面板
            clearInfo: function() {
                infoContent.textContent = '';
            }
        };

        // 如果URL中有CID参数，自动聚焦到输入框
        if (cid) {
            cidInput.focus();
        }
    }

    /**
     * 获取全弹幕数据的主函数
     * @param {string} cid - 视频CID
     */
    async function get_full_danmaku(cid) {
        // 参数验证
        if (!cid || typeof cid !== 'string' || cid.trim() === '') {
            if (window.danmakuPage) {
                window.danmakuPage.addInfo('错误：CID不能为空', 'error');
            } else {
                alert('错误：CID不能为空');
            }
            return;
        }

        // 只允许数字
        if (!/^\d+$/.test(cid)) {
            if (window.danmakuPage) {
                window.danmakuPage.addInfo('错误：CID只能包含数字', 'error');
            } else {
                alert('错误：CID只能包含数字');
            }
            return;
        }

        // 获取页面中的参数值
        const paramValue = window.danmakuPage?.paramInput?.value || '';
        const sliderValue = parseFloat(window.danmakuPage?.slider?.value || 3);

        try {
            // 显示开始信息
            window.danmakuPage.clearInfo();
            window.danmakuPage.addInfo(`开始获取弹幕数据...`, 'info');
            window.danmakuPage.addInfo(`CID: ${cid}`, 'info');
            window.danmakuPage.hideDownloadButton();

            // 等待Cookie检查
            const username = await new Promise((resolve, reject) => {
                checkCookie(paramValue, (error, username) => {
                    if (error) {
                        reject(error);
                    } else {
                        resolve(username);
                    }
                });
            });

            window.danmakuPage.addInfo(`鉴权成功: ${username}`, 'success');

            // 初始化proto相关
            proto_init();
            // 初始化全局弹幕数据列表
            window.danmakuData = [];

            let currentDate = getTodayDate(); // 从今日日期开始获取
            let lastRequestedDate = null; // 上一次请求的日期
            let hasMoreData = true;
            let isRateLimited = false; // 是否被风控
            let consecutiveEmptyDays = 0; // 连续空数据天数

            while (hasMoreData && !isRateLimited) {
                try {
                    // 记录当前请求的日期
                    lastRequestedDate = currentDate;

                    // 获取弹幕数据
                    const responseData = await fetchDanmakuAsync(cid, currentDate, paramValue);

                    // 检查是否被风控（返回HTML内容）
                    if (responseData === null) {
                        window.danmakuPage.addInfo(`请求过快，已被风控！请调整请求间隔后重试`, 'error');
                        isRateLimited = true;
                        hasMoreData = false;
                        break;
                    }

                    if (responseData && responseData.length > 0) {
                        consecutiveEmptyDays = 0; // 重置连续空数据计数器
                        window.danmakuPage.addInfo(`获取${currentDate}数据成功，共${responseData.length}条弹幕`, 'success');

                        // 解码并合并弹幕数据
                        decodeAndMergeDanmakuData(responseData);

                        // 找到最早的弹幕时间
                        if (window.danmakuData.length > 0) {
                            const earliestDanmaku = window.danmakuData.reduce((earliest, current) => {
                                return current.ctime < earliest.ctime ? current : earliest;
                            }, window.danmakuData[0]);

                            // 获取最早弹幕的日期
                            const earliestDate = formatTimestampToDate(earliestDanmaku.ctime);

                            // 只有当最早日期和当前请求日期相同时，才向前推一天
                            if (earliestDate === currentDate) {
                                // 日期相同，向前推一天
                                const dateObj = new Date(currentDate);
                                dateObj.setDate(dateObj.getDate() - 1);
                                currentDate = dateObj.toISOString().split('T')[0];
                                window.danmakuPage.addInfo(`最早弹幕日期与请求日期相同，向前推一天：${currentDate}`, 'info');
                            } else {
                                // 日期不同，使用最早弹幕的日期
                                currentDate = earliestDate;
                                window.danmakuPage.addInfo(`最早弹幕日期：${currentDate}，继续获取该日期数据`, 'info');
                            }
                        }
                    } else {
                        consecutiveEmptyDays++;
                        window.danmakuPage.addInfo(`获取${currentDate}数据为空，该日期无弹幕`, 'warning');

                        // 日期为空，向前推一天
                        const dateObj = new Date(currentDate);
                        dateObj.setDate(dateObj.getDate() - 1);
                        currentDate = dateObj.toISOString().split('T')[0];

                        // 如果连续获取到空数据超过1次就停止
                        if (consecutiveEmptyDays >= 1) {
                            window.danmakuPage.addInfo(`已连续获取${consecutiveEmptyDays}天空数据，停止获取`, 'info');
                            hasMoreData = false;
                        }
                    }

                    // 延迟，避免请求过快
                    await new Promise(resolve => setTimeout(resolve, sliderValue * 1000));

                } catch (error) {
                    window.danmakuPage.addInfo(`获取${currentDate}数据失败: ${error.message}`, 'error');
                    hasMoreData = false;
                }
            }

            // 获取完成后显示下载按钮
            if (window.danmakuData.length > 0 && !isRateLimited) {
                window.danmakuPage.showDownloadButton();
                window.danmakuPage.addInfo(`弹幕获取完成！共获取${window.danmakuData.length}条弹幕`, 'success');

                // 为下载按钮绑定事件 - 修复：使用闭包避免变量冲突
                const downloadButton = window.danmakuPage.downloadButton;
                const currentCid = cid; // 保存当前cid
                downloadButton.onclick = function() {
                    downloadDanmakuXML(currentCid, `danmaku_${currentCid}.xml`);
                };
            } else if (isRateLimited) {
                window.danmakuPage.addInfo('获取中断：请求过快被风控，请调整请求间隔后重试', 'error');
            } else {
                window.danmakuPage.addInfo('未获取到任何弹幕数据', 'warning');
            }

        } catch (error) {
            window.danmakuPage.addInfo(`获取失败: ${error.message}`, 'error');
        }
    }

    // 异步版本的fetchDanmaku
    function fetchDanmakuAsync(cid, date, cookie) {
        return new Promise((resolve, reject) => {
            GM_get_request("https://api.bilibili.com/x/v2/dm/web/history/seg.so?type=1&oid=" + cid + "&date=" + date,
                function(response) {
                    try {
                        // 检查响应内容是否为HTML（风控检测）
                        if (response.responseText && (
                                response.responseText.includes('<!DOCTYPE') ||
                                response.responseText.includes('<html') ||
                                response.responseText.includes('Access Denied') ||
                                response.responseText.includes('rate limit') ||
                                response.responseText.includes('Just a moment') ||
                                response.responseText.includes('验证')
                            )) {
                            resolve(null); // 返回null表示被风控
                        }

                        // 尝试解析JSON（如果是错误信息）
                        const json = JSON.parse(response.responseText);
                        reject(new Error(json.message || 'API返回错误'));
                    } catch (e) {
                        // 不是JSON，检查是否为二进制数据
                        if (response.response instanceof ArrayBuffer || response.response instanceof Uint8Array) {
                            // 检查响应是否为空
                            if (response.response.byteLength === 0) {
                                resolve([]); // 返回空数组表示无数据
                            } else {
                                // 解码数据
                                try {
                                    const uint8Array = new Uint8Array(response.response);
                                    const decodedMessage = window.DmSegMobileReply.decode(uint8Array);
                                    resolve(decodedMessage.elems || []);
                                } catch (decodeError) {
                                    reject(new Error('解码失败: ' + decodeError.message));
                                }
                            }
                        } else {
                            resolve([]); // 其他情况也返回空数组
                        }
                    }
                },
                null, {
                    'Cookie': cookie
                },
                "arraybuffer"
            );
        });
    }

    // 检查cookie
    function checkCookie(cookie, callback) {
        GM_getjson("https://api.bilibili.com/x/web-interface/nav",
            (json) => {
                if (json.code !== 0) {
                    callback("非法Cookie");
                } else {
                    callback(null, json.data.uname);
                }
            },
            (error) => {
                callback("网络请求失败");
            }, {
                'Cookie': cookie
            }
        );
    }

    // 时间戳转日期字符串（YYYY-MM-DD）
    function formatTimestampToDate(timestamp) {
        const date = new Date(timestamp * 1000);
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    }

    // 初始化proto工具
    function proto_init() {
        const PROTO_DEFINITION = `
        syntax = "proto3";
        package bilibili.community.service.dm.v1;
        
        // 弹幕条目
        message DanmakuElem {
            int64 id = 1;           // 弹幕ID
            int32 progress = 2;     // 弹幕出现位置(ms)
            int32 mode = 3;         // 弹幕类型
            int32 fontsize = 4;     // 弹幕字号
            uint32 color = 5;       // 弹幕颜色
            string midHash = 6;     // 发送者mid hash
            string content = 7;     // 弹幕正文
            int64 ctime = 8;        // 发送时间（这是你需要的）
            int32 weight = 9;       // 权重
            string action = 10;     // 动作
            int32 pool = 11;        // 弹幕池
            string idStr = 12;      // 弹幕ID字符串
            int32 attr = 13;        // 弹幕属性位
        }
        
        // 分段弹幕响应
        message DmSegMobileReply {
            repeated DanmakuElem elems = 1;  // 弹幕列表
            int32 state = 2;                  // 是否已关闭弹幕
        }`;

        window.danmakuPage.addInfo(`正在初始化弹幕解码工具`, 'info');
        try {
            // 使用protobuf.js 8.0.0加载proto定义
            const root = protobuf.parse(PROTO_DEFINITION).root;

            // 获取消息类型
            window.DmSegMobileReply = root.lookupType("bilibili.community.service.dm.v1.DmSegMobileReply");
            window.DanmakuElem = root.lookupType("bilibili.community.service.dm.v1.DanmakuElem");
            window.danmakuPage.addInfo('解码工具加载成功！', 'success');

        } catch (error) {
            window.danmakuPage.addInfo(`解码工具加载失败: ${error.message}`, 'error');
        }
    }

    // 解码并合并弹幕数据
    function decodeAndMergeDanmakuData(danmakuElems) {
        if (!danmakuElems || danmakuElems.length === 0) return;

        const newDanmaku = [];
        for (const elem of danmakuElems) {
            const danmakuItem = {
                id: elem.id || elem.idStr || '',
                progress: elem.progress || 0,
                mode: elem.mode || 1,
                fontsize: elem.fontsize || 25,
                color: elem.color || 0xFFFFFF,
                midHash: elem.midHash || '',
                content: elem.content || '',
                ctime: elem.ctime || 0,
            };
            newDanmaku.push(danmakuItem);
        }

        // 合并到全局数据
        window.danmakuData = window.danmakuData.concat(newDanmaku);

        // 去重和排序
        const uniqueDanmakuData = [];
        const idSet = new Set();

        for (const item of window.danmakuData) {
            const itemId = item.id || '';
            if (!idSet.has(itemId)) {
                idSet.add(itemId);
                uniqueDanmakuData.push(item);
            }
        }

        window.danmakuData = uniqueDanmakuData.sort((a, b) => a.ctime - b.ctime);
        window.danmakuPage.addInfo(`去重后已获取${window.danmakuData.length}条弹幕`, 'success');
    }

    // XML下载函数
    function downloadDanmakuXML(cid, filename) {
        try {
            if (!window.danmakuData || window.danmakuData.length === 0) {
                window.danmakuPage.addInfo('错误：没有弹幕数据可下载', 'error');
                return;
            }

            window.danmakuPage.addInfo(`开始生成XML文件...`, 'info');

            // 按照 id 去重
            const seenIds = new Set();
            const uniqueDanmaku = [];
            for (const dm of window.danmakuData) {
                const dmId = dm.id || "";
                if (!seenIds.has(dmId)) {
                    seenIds.add(dmId);
                    uniqueDanmaku.push(dm);
                }
            }

            // 创建XML文档
            const doc = document.implementation.createDocument(null, "i", null);
            const root = doc.documentElement;

            // 添加固定元素
            const addElement = (parent, tagName, text) => {
                const elem = doc.createElement(tagName);
                elem.textContent = String(text);
                parent.appendChild(elem);
            };

            addElement(root, "chatserver", "chat.bilibili.com");
            addElement(root, "chatid", cid);
            addElement(root, "mission", "0");
            addElement(root, "maxlimit", "0");
            addElement(root, "state", "0");
            addElement(root, "real_name", "0");
            addElement(root, "source", "k-v");

            // 添加弹幕数据
            uniqueDanmaku.forEach(dm => {
                // 计算progress（秒）
                const progress = dm.progress ? (dm.progress / 1000).toString() : "0";
                const mode = dm.mode || 1;
                const fontsize = dm.fontsize || 25;
                const color = dm.color || 16777215;
                const ctime = dm.ctime || 0;
                const midHash = dm.midHash || "";
                const id = dm.id || "";
                const content = dm.content || "";

                // 构造属性字符串
                const attrStr = `${progress},${mode},${fontsize},${color},${ctime},0,${midHash},${id}`;

                // 创建弹幕元素
                const dElem = doc.createElement("d");
                dElem.setAttribute("p", attrStr);
                dElem.textContent = content;
                root.appendChild(dElem);
            });

            // 生成XML字符串
            const xmlSerializer = new XMLSerializer();
            let xmlString = xmlSerializer.serializeToString(doc);

            // 添加XML声明
            xmlString = '<?xml version="1.0" encoding="UTF-8"?>\n' + xmlString;

            // 创建下载
            const blob = new Blob([xmlString], {
                type: 'text/xml;charset=utf-8'
            });
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = filename;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(url);

            window.danmakuPage.addInfo(`XML文件下载完成: ${filename} (${uniqueDanmaku.length}条弹幕)`, 'success');

        } catch (error) {
            window.danmakuPage.addInfo(`下载失败: ${error.message}`, 'error');
        }
    }

    new_full_danmaku();
}

// 页面加载完成后执行
(function() {
    'use strict';
    // 初始化脚本
    script_init();
    // 额外功能
    add_extra_features();
    add_video_snapshot();
    add_video_detail();
    // 修复功能
    fix_index_random_video();
    fix_space_userinfo();
    fix_space_user_video();
    fix_video_user_video();
    fix_video_h5play();
    fix_full_danmaku();
})();