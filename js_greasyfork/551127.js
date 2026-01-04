// ==UserScript==
// @name         [星星减负社区]⭐超星学习通智能助手Pro-全自动学习|可处理视频内题目|考试助手|智能答题|章节刷课|云端题库|AI辅助|可视化配置
// @namespace    http://tampermonkey.net/
// @version      5.2.2
// @description  ⭐超星智能学习助手Pro-支持📹章节视频自动播放与⏩倍速、📄阅读/文档任务自动完成，✏️章节作业与📝考试智能答题（可选💡自动提交/❓随机答题），还集成📚免费+付费云端题库，搭配🤖AI辅助解题！内置⏳复习模式补时长、🔒进程守护防卡死，更有🎛️可视化配置面板+⚙️自定义学习参数，一站式解决学习通网课需求💯！
// @author       jzjl
// @run-at       document-end
// @match        *://*.chaoxing.com/*
// @match        *://*.edu.cn/*
// @match        *://*.nbdlib.cn/*
// @match        *://*.hnsyu.net/*
// @match        *://*.gdhkmooc.com/*
// @connect      icodef.com
// @connect      tikuhai.com
// @connect      sso.chaoxing.com
// @connect      mooc1-api.chaoxing.com
// @connect      mooc1-1.chaoxing.com
// @connect      mooc1-2.chaoxing.com
// @connect      mooc2-ans.chaoxing.com
// @connect      cdn.bootcdn.net
// @connect      cdnjs.cloudflare.com

// @connect      mooc1.chaoxing.com
// @connect      chaoxing.com
// @connect      fystat-ans.chaoxing.com
// @connect      chaoxing.comm
// @connect      stat2-ans.chaoxing.com
// @connect      mooc1.gdhkmooc.com
// @connect      mooc2-ans.hnsyu.net
// @connect      mooc1.hnsyu.net
// @connect      mooc1.hlju.edu.cn
// @connect      forestpolice.org
// @connect      muketool.com
// @connect      ocsjs.com


// @icon         http://pan-yz.chaoxing.com/favicon.ico
// @grant        unsafeWindow
// @grant        GM_info
// @grant        GM_getResourceText
// @grant        GM_addStyle
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_xmlhttpRequest
// @require      https://lib.baomitu.com/jquery/3.6.0/jquery.min.js
// @require      https://mirrors.sustech.edu.cn/cdnjs/ajax/libs/layx/2.5.4/layx.min.js
// @require      https://mirrors.sustech.edu.cn/cdnjs/ajax/libs/blueimp-md5/2.19.0/js/md5.min.js

// @resource     layxcss https://mirrors.sustech.edu.cn/cdnjs/ajax/libs/layx/2.5.4/layx.min.css
// @resource     layuicss https://mirrors.sustech.edu.cn/cdnjs/ajax/libs/layui/2.12.0/css/layui.min.css


// @antifeature  payment  存在第三方付费接口
// @downloadURL https://update.greasyfork.org/scripts/551127/%5B%E6%98%9F%E6%98%9F%E5%87%8F%E8%B4%9F%E7%A4%BE%E5%8C%BA%5D%E2%AD%90%E8%B6%85%E6%98%9F%E5%AD%A6%E4%B9%A0%E9%80%9A%E6%99%BA%E8%83%BD%E5%8A%A9%E6%89%8BPro-%E5%85%A8%E8%87%AA%E5%8A%A8%E5%AD%A6%E4%B9%A0%7C%E5%8F%AF%E5%A4%84%E7%90%86%E8%A7%86%E9%A2%91%E5%86%85%E9%A2%98%E7%9B%AE%7C%E8%80%83%E8%AF%95%E5%8A%A9%E6%89%8B%7C%E6%99%BA%E8%83%BD%E7%AD%94%E9%A2%98%7C%E7%AB%A0%E8%8A%82%E5%88%B7%E8%AF%BE%7C%E4%BA%91%E7%AB%AF%E9%A2%98%E5%BA%93%7CAI%E8%BE%85%E5%8A%A9%7C%E5%8F%AF%E8%A7%86%E5%8C%96%E9%85%8D%E7%BD%AE.user.js
// @updateURL https://update.greasyfork.org/scripts/551127/%5B%E6%98%9F%E6%98%9F%E5%87%8F%E8%B4%9F%E7%A4%BE%E5%8C%BA%5D%E2%AD%90%E8%B6%85%E6%98%9F%E5%AD%A6%E4%B9%A0%E9%80%9A%E6%99%BA%E8%83%BD%E5%8A%A9%E6%89%8BPro-%E5%85%A8%E8%87%AA%E5%8A%A8%E5%AD%A6%E4%B9%A0%7C%E5%8F%AF%E5%A4%84%E7%90%86%E8%A7%86%E9%A2%91%E5%86%85%E9%A2%98%E7%9B%AE%7C%E8%80%83%E8%AF%95%E5%8A%A9%E6%89%8B%7C%E6%99%BA%E8%83%BD%E7%AD%94%E9%A2%98%7C%E7%AB%A0%E8%8A%82%E5%88%B7%E8%AF%BE%7C%E4%BA%91%E7%AB%AF%E9%A2%98%E5%BA%93%7CAI%E8%BE%85%E5%8A%A9%7C%E5%8F%AF%E8%A7%86%E5%8C%96%E9%85%8D%E7%BD%AE.meta.js
// ==/UserScript==

/******/ (() => { // webpackBootstrap
var __webpack_exports__ = {};
var defaultConfig = {
    ua: 'Dalvik/2.1.0 (Linux; U; Android 11; M3121K1AB Build/SKQ1.211006.001) (device:M3121K1AB) Language/zh_CN com.chaoxing.mobile/ChaoXingStudy_3_5.1.4_android_phone_614_74 (@Kalimdor)_',
    interval: 3000,
    autoVideo: true,
    autoRead: true,
    autoAnswer: true,
    videoSpeed: 2,
    reviewMode: false,
    matchRate: 0.8,
    autoSubmitRate: 0.8,
    autoSubmit: true,
    autoSwitch: true,
    tutorial: true,
    randomAnswer: false,
    threadWatch: true,
    freeFirst: true,
    readSpeed: 0.2,
    notice: '本脚本仅供学习研究，请勿使用于非法用途！',
    debugger: false,
    types: {
        '单选题': '0',
        '多选题': '1',
        '填空题': '2',
        '判断题': '3',
        '简答题': '4',
        '名词解释': '5',
        '论述题': '6',
        '计算题': '7',
    },
    token: '',
    yizhiToken: '',
    aiAsk: false
}, otherApi = [
    {
        desc: "接口来源:https://cx.icodef.com/query.html",
        url: 'http://cx.icodef.com/wyn-nb?v=4',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8',
            'Authorization': defaultConfig.yizhiToken || ''/** 一之题库token填写 */
        },
        method: 'post',
        getdata: (data) => {
            return `question=${encodeURIComponent(data.question)}`;
        },
        getanswer: (response) => {
            const res = JSON.parse(response.responseText);
            if (res.code === 1) {
                let data = res.data.replace(/javascript:void\(0\);/g, '').trim().replace(/\n/g, '');
                if (data.includes('叛逆') || data.includes('公众号') || data.includes('李恒雅') || data.includes('一之')) {
                    return false;
                } else {
                    return data.split("#");
                }
            }
            return false;
        }
    }
], _self = unsafeWindow, top = (/* unused pure expression or super */ null && (_self)), script_info = GM_info.script, cache_key = "20230524", reqUrl = [
    {
        "api": "https://api.tikuhai.com/",
        "headers": {}
    },
    ],

    ttflist = [
        'https://www.forestpolice.org/ttf/2.0/table.json',
        'https://cdn.ocsjs.com/resources/font/table.json',
        'https://static.muketool.com/scripts/cx/v2/fonts/cxsecret.json'],
    icon = `<svg t="1679897263513" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="1586" width="32" height="32"><path d="M105.321374 914.265136c-11.700669 0-17.551004-11.702475-17.551003-17.541972 0-5.870203 5.850335-17.551004 11.7097-17.551004 269.155125-111.194286 561.722425-169.684988 848.441196-181.3983v5.839497c23.410369 0 52.662042-5.839497 76.076024-5.839497v11.711506c-292.558269 29.251673-579.284266 87.756824-854.300562 175.535323-17.551004 17.541972-40.964985 23.403144-64.375355 29.244447zM772.382332 580.741882c-29.260704 0-58.514183-5.861172-76.054349-29.240835-17.55281-23.412175-35.123682-46.826157-35.123681-76.079636 0-81.917327 23.403144-157.984319 76.068798-222.350642 46.835188-64.377161 117.042815-111.168999 193.106195-140.433316 29.251673 0 52.654817 17.563647 64.368129 40.954148-5.862978 5.850335-11.711506 11.711506-17.563647 11.711506 29.251673 11.700669 40.952342 35.102007 40.952342 64.366324 5.862978 163.834654-99.459299 310.121916-245.753787 351.072451z m157.996963-374.484627c-11.702475 5.850335-29.273347 17.551004-40.954148 29.264316-5.870203 0-5.870203-5.850335-5.870203-11.711506-87.778499 52.665654-146.281844 146.294487-152.114116 245.742949 0 11.711506 5.832272 52.665654 23.38147 46.835188 29.284184-11.7097 52.662042-23.423013 70.225688-46.835188 19.503523-21.441593 39.00524-42.894024 58.506958-64.344648 35.121876-46.81532 58.535857-105.320471 70.216658-163.847297 11.700669-17.55281-5.848528-29.253479-23.392307-35.103814zM122.872378 288.185419l-64.366323 29.251673c-5.839497 5.839497-11.689832 5.839497-17.540167 5.839497-5.862978 0-5.862978-11.713313-5.862978-17.540166 0-17.551004 11.713313-29.264316 29.273347-35.114651 35.103813-29.264316 70.20582-52.654817 111.158163-70.216657 17.551004 5.850335 29.264316 23.403144 35.11465 40.952341 0 17.540166 0 17.540166-81.919133 204.812282-29.249866 58.505151-52.651204 122.873281-58.523213 187.237798 0 5.852141 5.872009 17.55281 5.872009 23.412176v5.841303c-1.959745 1.948907-3.910458 3.912264-5.872009 5.861172-5.830466 0-11.700669 0-11.700669-5.861172-29.253479 0-52.663848-17.55281-58.505152-46.804482 0-46.813513 11.711506-99.470137 29.251673-140.433316 23.413982-64.366323 58.517795-122.871475 93.619802-187.237798zM637.792126 282.326054c11.700669 157.984319-87.760436 298.417635-239.892614 339.380813-29.264316 0-58.515989-5.850335-76.07783-29.264316-23.401338-17.561841-35.092976-46.813513-35.092976-76.056155 0-81.926358 23.403144-157.99335 76.068798-222.359673 46.804482-64.355486 117.008497-111.159968 193.086327-140.433316 29.242642 0 52.665654 17.551004 64.368129 40.975823-5.852141 5.839497-11.702475 11.689832-17.55281 11.689832 17.551004 17.549197 35.092976 46.811707 35.092976 76.066992z m-81.908295-35.103814c-11.7097 5.850335-29.260704 17.551004-40.963179 29.251673-5.850335 0-5.850335-5.850335-5.850335-11.700669-87.769468 52.665654-146.272813 146.28365-152.135791 245.762818 0 11.680801 5.862978 52.663848 23.413982 46.793645 29.251673-11.702475 52.665654-23.403144 70.20582-46.793645a140273.571944 140273.571944 0 0 0 58.515989-64.366324c35.103813-46.826157 58.514183-105.320471 70.214852-163.84549 11.713313-17.551004-5.839497-29.253479-23.401338-35.102008zM23.414885 808.944665c269.155125-111.170806 561.711587-169.684988 848.437584-181.3983v5.859365c29.251673 0 52.665654-5.859366 76.068798-5.859365v11.711506c-292.558269 29.26251-579.287878 87.778499-854.302368 175.544354-23.413982 11.713313-40.954148 17.554616-64.36813 23.3905h-5.837691c-5.872009 0-11.702475-5.835885-11.702475-17.551003 3.903233-3.896009 7.804661-7.797436 11.704282-11.697057z" fill="#e6e6e6" p-id="1587"></path></svg>`;
let cacheData = GM_getValue(cache_key);
if (cacheData && !cacheData.token) cacheData.token = defaultConfig.token;
defaultConfig = cacheData || defaultConfig;
const log = msg => defaultConfig.debugger && console.log(msg);
(function () {
    'use strict';
    const _postMessage = unsafeWindow.postMessage;
    unsafeWindow.postMessage = function (msg, targetOrigin, transfer) {
        if (msg && msg.includes('"toggle":true')) {
            msg = msg.replace('"toggle":true', '"toggle":false');
        }
        _postMessage.call(unsafeWindow, msg, targetOrigin, transfer);
    };
    String.prototype.cl = function () {
        return this.replace(/^【.*?】\s*/, '').replace(/\s*（\d+\.\d+分）$/, '')
    };
    var utils = {
        randomStr: (len = 32) => {
            const $chars = 'qwertyuioplkjhgfdsazxcvbnm1234567890';
            let ss = '';
            for (let i = 0; i < len; i++) {
                ss += $chars.charAt(Math.floor(Math.random() * $chars.length));
            }
            return ss;
        },
        notify: (level, msg) => {
            let data = {
                level: level,
                msg: msg
            }
            return JSON.stringify(data);
        },
        sortData: (data) => {
            const arr = [];
            data.forEach(item => {
                const parent = data.find(item2 => item2.id === item.parentnodeid);
                parent ? (parent.children || (parent.children = [])).push(item) : arr.push(item);
            });
            return arr;
        },
        toOneArray: (arr) => {
            return arr.reduce((newArr, item) => newArr.concat(item, item.children ? utils.toOneArray(item.children) : []), []);
        },
        sleep: (time) => {
            return new Promise(resolve => setTimeout(resolve, time));
        },
        getUrlParam: (name) => {
            const reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
            const r = window.location.search.substr(1).match(reg);
            return r ? unescape(r[2]) : null;
        },
        toQueryString: (obj) => {
            return obj ? Object.keys(obj).sort().map(key => {
                const val = obj[key];
                return Array.isArray(val) ? val.sort().map(val2 => encodeURIComponent(key) + '=' + encodeURIComponent(val2)).join('&') : encodeURIComponent(key) + '=' + encodeURIComponent(val);
            }).join('&') : '';
        },
        getInputParam: (name) => {
            const input = document.getElementsByName(name)[0];
            return input ? input.value : null;
        },
        getVideoEnc: (clazzid, uid, jobid, objectId, playingTime, duration) => {
            return md5("[" + clazzid + "][" + uid + "][" + jobid + "][" + objectId + "][" + (playingTime * 1000) + "][d_yHJ!$pdA~5][" + (duration * 1000) + "][0_" + duration + "]");
        },
        getTimestamp: () => {
            return new Date().getTime();
        }
        , removeHtml: (html) => {
            if (html == null) {
                return '';
            }
            // 判断是否为字符串
            if (typeof html !== 'string') {
                return html;
            }
            return html.replace(/<((?!img|sub|sup|br)[^>]+)>/g, '').replace(/&nbsp;/g, ' ').replace(/\s+/g, ' ').replace(/<br\s*\/?>/g, '\n').replace(/<img.*?src="(.*?)".*?>/g, '<img src="$1"/>').trim();
        }
        , cache: (key, value) => {
            GM_setValue(key, { value: value, time: utils.getTimestamp() });
            return value;
        },
        cacheExpired: (key, time) => {
            var cache = GM_getValue(key);
            if (cache) {
                if (cache.time + time > utils.getTimestamp()) {
                    return cache.value;
                }
            }
            return false;
        },
        matchIndex: (options, answer) => {
            var matchArr = [];
            for (var i = 0; i < answer.length; i++) {
                for (var j = 0; j < options.length; j++) {
                    if (answer[i] == options[j]) {
                        matchArr.push(j);
                    }
                }
            }
            return matchArr;
        }
        , similarity: (s, t) => {
            let l = Math.max(s.length, t.length);
            let n = s.length;
            let m = t.length;
            let d = Array.from({ length: n + 1 }, (_, i) => [i]);
            for (let j = 0; j <= m; j++) d[0][j] = j;
            for (let i = 1; i <= n; i++)
                for (let j = 1; j <= m; j++) {
                    let cost = s[i - 1] === t[j - 1] ? 0 : 1;
                    d[i][j] = Math.min(d[i - 1][j] + 1, d[i][j - 1] + 1, d[i - 1][j - 1] + cost);
                }
            return (1 - d[n][m] / l);
        }
        , fuzzyMatchIndex: (options, answer) => {
            const matchArr = [];
            for (const ans of answer) {
                let maxSim = 0, index = 0;
                for (let i = 0; i < options.length; i++) {
                    const sim = utils.similarity(ans, options[i]);
                    if (sim > maxSim) {
                        maxSim = sim;
                        index = i;
                    }
                }
                if (maxSim > defaultConfig.matchRate) matchArr.push(index);
            }
            return matchArr;
                    },
        processTtfList:async (ttflist)=>{
            for (const item of ttflist) {
                try {
                    const response = await ServerApi.request(item, 'GET', {});
                   const table = JSON.parse(response.responseText);
                    return table;
                } catch (error) {
                    console.error(error); // 使用 `console.error` 更符合错误日志语义
                }
           }
            return null;
        }
    };
    var api = {
        monitorVerify: (responseText, url, method, data, ua) => {
            return new Promise((resolve, reject) => {
                try {
                    let obj = JSON.parse(responseText);
                    let divHtml = '<img src="' + obj.verify_png_path + '"/> <input type="text" class="code_input" placeholder="请输入图中的验证码" /><button id="code_btn">验证</button>';
                    layx.prompt(divHtml, "请输入验证码", function (id, value, textarea, button, event) {
                        let url = obj.verify_path + "&ucode=" + value;
                        window.open(url);
                    });
                } catch (error) {
                    let domain = url.match(/:\/\/(.[^/]+)/)[1];
                    let urlShowVerify = "https://" + domain + "/antispiderShowVerify.ac";
                    page.layx_log(`<a target="_blank" href="${urlShowVerify}">若未自动弹出页面，请点我打开</a>`, 'error');
                    layx.iframe('verifyCode', '验证码验证', urlShowVerify);
                    let timer = setInterval(() => {
                        api.defaultRequest(url, method, data, ua, true).then((response) => {
                            if (response.responseText && !response.responseText.includes('输入验证码')) {
                                layx.destroy('verifyCode');
                                clearInterval(timer);
                                page.layx_log('验证码验证成功！', 'success');
                                resolve(response);
                            } else {
                                page.layx_log('验证码验证失败！将在5s后重新验证', 'error');
                            }
                        })
                    }, 5000);
                }
            });
        },
        defaultRequest: async (url, method, data = {}, ua = defaultConfig.ua, verify = false) => {
            try {
                const response = await new Promise((resolve, reject) => {
                    if (method == "post") {

                        GM_xmlhttpRequest({
                            url,
                            method,
                            headers: {
                                'User-Agent': ua,
                                'Content-Type': 'application/x-www-form-urlencoded',

                            },
                            data: utils.toQueryString(data),
                            onload: resolve,
                            onerror: reject
                        });
                    } else {
                        GM_xmlhttpRequest({
                            url,
                            method,
                            headers: {
                                'User-Agent': ua,
                            },
                            onload: resolve,
                            onerror: reject
                        });

                    }

                });

                if (!verify && response.responseText && response.responseText.includes('输入验证码')) {
                    page.layx_log(
                        '检测到验证码！将弹出新页面自行验证验证码（出现验证码多为间隔频率过短，或者请求过多，请根据自己情况调高运行间隔）',
                        'error'
                    );
                    await api.monitorVerify(response.responseText, url, method, data, ua);
                    return await api.defaultRequest(url, method, data);
                }

                return response;
            } catch (err) {
                if (err.error && err.error.includes("connect list")) {
                    const domain = err.error.match(/:\/\/(.[^/]+)/)[1];
                    const notice = `由于connect未添加导致无权限请求<br><br>请复制以下代码至脚本中的第19行位置<br>// @connect      ${domain}`;
                    page.layx_log(notice, 'error');
                } else {
                    page.layx_log(`请求报错[${url} - ${method}][${err.statusText}]`, 'error');
                }
                return Promise.reject(err);
            }
        }

        ,
        getVerifyCode: async (url) => {
            return new Promise((resolve, reject) => {
                GM_xmlhttpRequest({
                    method: "GET",
                    url: url,
                    responseType: "blob",
                    onload: function (res) {
                        var blob = res.response;
                        var reader = new FileReader();
                        reader.onload = function (event) {
                            resolve(event.target.result);
                        };
                        reader.readAsDataURL(blob);
                    }
                });
            });
        },
        getCourseChapter: async (courseId, classId, pz) => {
            let url = _self.ServerHost.mooc1Domain + "/gas/clazz?id=" + classId + "&personid=" + courseId + "&fields=id,bbsid,classscore,isstart,allowdownload,chatid,name,state,isfiled,visiblescore,begindate,coursesetting.fields(id,courseid,hiddencoursecover,coursefacecheck),course.fields(id,name,infocontent,objectid,app,bulletformat,mappingcourseid,imageurl,teacherfactor,jobcount,knowledge.fields(id,name,indexOrder,parentnodeid,status,layer,label,jobcount,begintime,endtime,attachment.fields(id,type,objectid,extension).type(video)))&view=json";
            let result = await api.defaultRequest(url, 'get');
            return JSON.parse(result.responseText);
        },
        getChapterList: async (courseid, clazzid, nodes, userid, cpi) => {
            let data = {
                "view": "json",
                "nodes": nodes,
                "clazzid": clazzid,
                "userid": userid,
                "cpi": cpi,
                "courseid": courseid,
                "time": (new Date()).valueOf()
            }
            let result = await api.defaultRequest(_self.ServerHost.mooc1Domain + "/job/myjobsnodesmap", 'post', data);
            return JSON.parse(result.responseText);
        },
        getChapterInfo: async (id, courseid) => {
            let data = {
                "id": id,
                "courseid": courseid,
                "fields": "id,parentnodeid,indexorder,label,layer,name,begintime,createtime,lastmodifytime,status,jobUnfinishedCount,clickcount,openlock,card.fields(id,knowledgeid,title,knowledgeTitile,description,cardorder).contentcard(all)",
                "view": "json",
            }
            let url = _self.ServerHost.mooc1Domain + "/gas/knowledge?" + utils.toQueryString(data);
            let result = await api.defaultRequest(url, 'get');
            return JSON.parse(result.responseText);
        },
        getChapterDetail: async (courseid, clazzid, knowledgeid, num, cpi) => {
            let url = _self.ServerHost.mooc1Domain + "/knowledge/cards?clazzid=" + clazzid + "&courseid=" + courseid + "&knowledgeid=" + knowledgeid + "&num=" + num + "&cpi=" + cpi + "&ut=s&cpi=229749849&v=20160407-1";
            let result = await api.defaultRequest(url, 'get');
            return result.responseText;
        },
        uploadStudyLog: async (courseid, clazzid, knowledgeid, cpi) => {
            let url = `${location.origin}/mooc2-ans/mycourse/studentcourse?courseid=${courseid}&clazzid=${clazzid}&cpi=${cpi}&ut=s&t=${utils.getTimestamp()}`
            let text = await api.defaultRequest(url, 'get', {}, navigator.userAgent);
            let match = text.responseText.match(/encode=([\w]+)/);
            if (match) {
                const encode = match[1];
                let url = `${_self.ServerHost.moocTJDomain}/log/setlog?personid=${cpi}&courseId=${courseid}&classId=${clazzid}&encode=${encode}&chapterId=${knowledgeid}&_=${new Date().valueOf()}`;
                let result = await api.defaultRequest(url, 'get', {}, navigator.userAgent);
                return result.responseText;
            }
            return false;
        },
        docStudy: async (jobid, knowledgeid, courseid, clazzid, jtoken) => {
            let url = _self.ServerHost.mooc1Domain + "/ananas/job/document?jobid=" + jobid + "&knowledgeid=" + knowledgeid + "&courseid=" + courseid + "&clazzid=" + clazzid + "&jtoken=" + jtoken + "&_dc=" + new Date().valueOf();
            let result = await api.defaultRequest(url, 'get', {}, navigator.userAgent);
            return JSON.parse(result.responseText);
        },
        videoStudy: async (data, dtoken, taskDefaultConfig) => {
            let url = taskDefaultConfig.reportUrl + "/" + dtoken + "?" + utils.toQueryString(data);
            let result = await api.defaultRequest(url, 'get', {}, navigator.userAgent);
            return JSON.parse(result.responseText);
        },
        getVideoConfig: async (objectId) => {
            let url = _self.ServerHost.mooc1Domain + "/ananas/status/" + objectId + "?k=&flag=normal&_dc=" + new Date().valueOf();
            let result = await api.defaultRequest(url, 'get');
            return JSON.parse(result.responseText);
        },
        unlockChapter: async (courseid, clazzid, knowledgeid, userid, cpi) => {
            let url = `${_self.ServerHost.mooc1Domain}/job/submitstudy?node=${knowledgeid}&userid=${userid}&clazzid=${clazzid}&courseid=${courseid}&personid=${cpi}&view=json`;
            let result = await api.defaultRequest(url, 'get', {}, navigator.userAgent);
            return result.status;
        },
        initdatawithviewer: async (mid, cpi, classid, taskDefaultConfig) => {
            let url = `${taskDefaultConfig.initdataUrl}?mid=${mid}&cpi=${cpi}&classid=${classid}&_dc=${new Date().valueOf()}`;
            let result = await api.defaultRequest(url, 'get');
            return JSON.parse(result.responseText);
        }
        , submitdatawithviewer: async (classid, cpi, objectid, eventid, memberinfo, answer) => {
            let url = `${_self.ServerHost.mooc1Domain}/question/quiz-validation?classid=${classid}&cpi=${cpi}&objectid=${objectid}&_dc=${new Date().valueOf()}&eventid=${eventid}&memberinfo=${memberinfo}&answerContent=${answer}`;
            let result = await api.defaultRequest(url, 'get');
            return JSON.parse(result.responseText);
        }
    };
    var ServerApi = {
        request: async function (url, method, data, headers = {}) {
            return new Promise(function (resolve, reject) {
             if(method == "GET"){
                    GM_xmlhttpRequest({
                        method: method,
                        url: url,
                        headers: headers,
                        timeout: 5000,
                        onload: function (response) {
                            resolve(response);
                        },
                        onerror: function (response) {
                            reject(response);
                        },
                        ontimeout: function (response) {
                            reject(response);
                        }
                    });

                }else{
                    GM_xmlhttpRequest({
                        method: method,
                        url: url,
                        data: JSON.stringify(data),
                        headers: headers,                        timeout: 5000,
                        onload: function (response) {
                            resolve(response);
                        },
                        onerror: function (response) {
                            reject(response);
                        },
                        ontimeout: function (response) {
                            reject(response);
                        }
                    });
                }


            });

        },
        defaultRequest: async function (url, method, data, headers = {}) {
            if (_self.getCookie == undefined) {
                _self.getCookie = function (name) {
                    return '';
                };
            }
            headers = Object.assign({
                'Content-Type': 'application/json',
                'v': script_info.version,
                'referer': location.href,
                't': utils.getTimestamp(),
                "token": defaultConfig.token || '',
                "u": _self.uid || _self.getCookie('UID') || _self.getCookie("_uid") || '',
            }, headers);
            for (let i = 0; i < reqUrl.length; i++) {
                let api = reqUrl[i];
                let reqHeaders = Object.assign({}, api.headers, headers);
                let res = await ServerApi.request(api.api + url, method, data, reqHeaders).catch((e) => {
                    return false;
                });
                if (res && res.status === 200) {
                    return res;
                }



            }

        }, search: async function (data, status = true) {
            data.key = status && defaultConfig.token || '';
            $(".layx_status").html("正在搜索答案");
            let params = {
                "z": data.workType,
                "t": data.type,
                "u": _self.uid || _self.getCookie('UID') || _self.getCookie("_uid") || '',
            }
            data.source = 'xy_' + script_info.version;
            var url = 'search?' + utils.toQueryString(params);
            const res = await ServerApi.defaultRequest(url, 'post', data);
            return res;
        }, configRequest: async function (url) {
            return await ServerApi.defaultRequest(url, 'get');
        }, get_msg: async function () {
            let url = 'def/autoMsg';
            let res = await ServerApi.defaultRequest(url, 'get');
            try {
                let reqData = JSON.parse(res.responseText);
                return reqData.data;
            } catch (e) {
                return defaultConfig.notice;
            }
        }, searchOther: (data, item) => {
            return new Promise(async function (resolve, reject) {
                GM_xmlhttpRequest({
                    method: item.method,
                    url: item.url,
                    data: item.getdata(data),
                    headers: item.headers,
                    timeout: 5000,
                    onload: function (response) {
                        resolve(response);
                    },
                    onerror: function (response) {
                        reject(response);
                    },
                    ontimeout: function (response) {
                        reject(response);
                    }
                });
            });
        },         checkKey: async function (key) {
            if (!key) {
                page.layx_log("💳 付费题库: 未配置Token，将使用免费题库", "notice");
                page.layx_log("💡 提示: 如需使用付费题库，请在配置中填写Token", "info");
                return;
            }

            page.layx_log("🔑 正在验证付费题库Token...", "info");
            let url = 'key';
            let data = {
                "key": key
            }
            let res = await ServerApi.defaultRequest(url, 'post', data);
            try {
                res = JSON.parse(res.responseText);
                if (res.code === 200) {
                    reqUrl.num = res.data.num || null;
                    reqUrl.usenum = res.data.usenum || null;
                    page.layx_log(`✅ 付费题库验证成功！剩余次数: ${reqUrl.num || '无限制'}`, "success");
                    page.layx_log(`📊 已使用次数: ${reqUrl.usenum || 0}`, "info");
                } else {
                    page.layx_log(`❌ 付费题库验证失败: ${res.msg}`, "error");
                    page.layx_log("🔄 将自动切换为免费题库模式", "notice");
                }
            } catch (error) {
                page.layx_log("❌ 付费题库连接失败，将使用免费题库", "error");
                page.layx_log("💡 建议: 检查网络连接或Token格式", "notice");
            }
        }, getVerifyCode: async function (img) {
            let url = 'code';
            let data = {
                "img": img.replace('data:image/png;base64,', '')
            }
            let res = await ServerApi.defaultRequest(url, 'post', data);
            return JSON.parse(res.responseText).data.code;
        }
    }
    var page = {
        threadWatch: async function () {
            if (!defaultConfig.threadWatch) {
                return;
            }
            log('线程守护已开启');
            let thread = setInterval(async function () {
                let layx_status_msg = $("#layx_status_msg");
                if (!layx_status_msg.length) {
                    alert("未检测到悬浮窗，已自动关闭线程守护");
                    clearInterval(thread);
                }
                if (defaultConfig.lastMsg && defaultConfig.lastMsg.indexOf("每60秒更新一次进度") !== -1) {
                    if (defaultConfig.lastMsg === layx_status_msg.html()) {
                        location.reload();
                    }
                } else {
                    log("一切正常");
                }
                defaultConfig.lastMsg = layx_status_msg.html();
                log(layx_status_msg.html());
            }, 320000);
        },
        init: async function () {
            GM_addStyle(GM_getResourceText("layxcss"));
            GM_addStyle(GM_getResourceText("layuicss"));
            defaultConfig.workinx = 0;
            defaultConfig.succ = 0;
            defaultConfig.fail = 0;
            log(location.pathname);
            switch (true) {
                case location.href.includes('/exam/test/reVersionPaperMarkContentNew'):
                    if (location.href.includes('newMooc=true')) {
                        await this.layx("ks", {
                            title: "⭐考试助手",
                            // storeStatus:false,
                            width: 400,
                            height: 600
                        });
                        $('#layx_log, h2').hide();
                        $('#layx_content').css('margin', '10px');
                        const createButton = (text, onClick) => {
                            const btn = document.createElement('button');
                            btn.innerHTML = text;
                            btn.classList.add('layui-btn', 'layui-btn-primary', 'layui-border-black');
                            btn.style.margin = '10px 0px 10px 10px';
                            btn.style.background = '#1890ff';
                            btn.style.border = 'none';
                            btn.style.borderRadius = '4px';
                            btn.style.color = '#fff';
                            btn.style.fontWeight = '400';
                            btn.style.transition = 'all 0.2s ease';
                            btn.style.fontSize = '12px';
                            btn.style.padding = '6px 12px';
                            btn.onclick = onClick;
                            return btn;
                        };
                        const btn = createButton(defaultConfig.autoSwitch ? '关闭自动切换' : '开启自动切换', () => {
                            defaultConfig.autoSwitch = !defaultConfig.autoSwitch;
                            btn.innerHTML = defaultConfig.autoSwitch ? '关闭自动切换' : '开启自动切换';
                            defaultConfig.autoSwitch && location.reload();
                            GM_setValue(cache_key, defaultConfig);
                        });
                        $('#layx_content').before($('<div>').attr('id', 'btn_cc').css('margin', '10px').append(btn));
                        this.layx_status_msg('初始化完成');
                        let reqData = page.getQuestion("3");
                        this.layx_status_msg("自动答题中.....");
                        await page.startAsk(reqData);
                    } else {
                        let url = location.href;
                        if (!url.includes('newMooc=false')) {
                            url = url + '&newMooc=true';
                        } else {
                            url = url.replace('newMooc=false', 'newMooc=true');
                        }
                        location.href = url;
                    }
                    break;
                case location.href.includes('/mycourse/stu?'):
                    await this.layx();
                    page.threadWatch();
                    // 配置按钮已移至主界面顶部
                    // 记录任务开始时间
                    defaultConfig.startTime = Date.now();

                    this.layx_log("🔍 正在检测题库连接状态...", "notice");
                    ServerApi.checkKey(defaultConfig.token);

                    // 检查一之题库token状态
                    if (defaultConfig.yizhiToken) {
                        this.layx_log("🔑 一之题库Token已配置，将优先使用一之题库API", "success");
                        this.layx_log("📝 一之题库来源: 微信公众号'一之哥哥'，缓解免费题库过载压力", "info");
                    } else {
                        this.layx_log("💡 提示: 可配置一之题库Token获得更好的题库体验", "info");
                        this.layx_log("📝 获取方式: 关注微信公众号'一之哥哥'发送'token'免费获取", "info");
                    }
                    this.layx_log(`⚙️ 脚本配置: 间隔${defaultConfig.interval}ms | 倍速${defaultConfig.videoSpeed}x | 正确率${(defaultConfig.autoSubmitRate*100).toFixed(0)}%`, "info");
                    this.layx_log(`🚀 任务即将启动，预计等待${defaultConfig.interval / 1000}秒...`, "notice");
                    await utils.sleep(defaultConfig.interval);
                    this.layx_status_msg("📋 正在加载课程数据...");

                    this.mainTask();
                    break;
                case location.href.includes('/workHandle/handle'):
                    window.parent.postMessage(utils.notify("error", "作业已被删除-跳过"), '*');
                    break;
                case location.href.includes('/work/doHomeWorkNew'):

                    if (document.body.innerHTML.indexOf("此作业已被老师") !== -1) {
                        window.parent.postMessage(utils.notify("error", "作业已被删除-跳过"), '*');
                        break;
                    }
                    if (document.body.innerHTML.indexOf("您长时间没有操作") !== -1) {
                        window.parent.postMessage(utils.notify("error", "遇到一个bug,后期修复"), '*');
                        break;
                    }
                    if (location.href.includes('reEdit=2')) {
                        this.getScore();
                        await utils.sleep(defaultConfig.interval);
                        window.parent.postMessage(utils.notify("error", "作业待批阅"), '*');
                        break;
                    }
                    if (location.href.includes('mooc2=1')) {
                        // 删除url中的mooc2=1
                        // location.href = location.href.replace(/&mooc2=1/g, '');
                    }
                    if (location.href.includes('oldWorkId') || location.href.includes('/mooc-ans/work/doHomeWorkNew')) {
                        await page.layx("zj", {
                            closeMenu: false,
                            maxMenu: true,
                            title: '⭐作业答题(本窗口禁止关闭)',
                            width: 600,
                            height: 300,
                            storeStatus: false,
                            position: 'lt'
                        });
                        const btn1 = $('<button>', {
                            text: '配置',
                            class: 'layui-btn layui-btn-primary layui-border-black',
                            style: 'margin: 10px 0 10px 10px; background: #1890ff; border: none; border-radius: 4px; color: #fff; font-weight: 400; transition: all 0.2s ease; font-size: 12px; padding: 6px 12px;',
                            click: function () {
                                log(defaultConfig);
                                page.layx_config();
                            }
                        });
                        $('#layx_content').before($('<div>', { id: 'btn_cc', style: 'margin: 10px;' }).append(btn1));
                        $('h2, #layx_log').hide();
                        try {
                            page.decode();
                        } catch (e) {
                            // 报错
                            layx.msg('字体解码失败，请反馈给作者吧', { dialogIcon: 'help' });
                            this.layx_status_msg("字体解码失败，请反馈给作者吧");
                            return;
                        }


                        if (defaultConfig.autoAnswer) {
                            this.layx_status_msg("正在自动答题中");
                            await page.startChapter();
                        }
                    } else {
                        layx.msg('不支持此版本作业，请使用包含oldWorkId或doHomeWorkNew的作业页面', { dialogIcon: 'help' });
                    }
                    break;
                case location.href.includes('/work/selectWorkQuestionYiPiYue'):
                    log("作业已完成");
                    if (location.href.includes('mooc2=1')) {
                        this.getScoreNew();
                    } else {
                        this.getScore();
                        log("作业已完成");
                    }
                    await utils.sleep(defaultConfig.interval);
                    window.parent.postMessage(utils.notify("success", "作业已完成"), '*');
                    break;
                case location.href.includes('/mooc2/work/dowork'):
                    await this.layx('zy', {
                        width: 600,
                        height: 300,
                        storeStatus: false,
                        position: "lt"
                    });
                    this.layx_status_msg("初始化完成");
                    $("#layx_log").hide();
                    const btn1 = $("<button>", {
                        html: "配置",
                        class: "layui-btn layui-btn-primary layui-border-black",
                        style: "margin:10px 0px 10px 10px; background: #1890ff; border: none; border-radius: 4px; color: #fff; font-weight: 400; transition: all 0.2s ease; font-size: 12px; padding: 6px 12px;",
                        click: function () {
                            log(defaultConfig);
                            page.layx_config();
                        }
                    });
                    $("#layx_content").before("<div id='btn_cc' style='margin:10px'></div>");
                    $("h2").hide();
                    $("#btn_cc").append(btn1);
                    if (defaultConfig.autoAnswer) {
                        this.layx_status_msg("正在自动答题中");
                        page.startWork()
                        // defaultConfig.loop = setInterval(() => page.startWork(), defaultConfig.interval);
                    }
                    break;
                case location.href.includes('/visit/courses'):
                    break;
                case location.href.includes('/antispiderShowVerify.ac') || location.href.includes('/html/processVerify.ac'):
                    let src = "/processVerifyPng.ac?t=" + Math.floor(2147483647 * Math.random());
                    let imgData = await api.getVerifyCode(src);
                    let res = await ServerApi.getVerifyCode(imgData);
                    let url = `/html/processVerify.ac?app=0&ucode=${res}`;
                    window.location.href = url;
                    break;
                case location.href.includes('/mycourse/studentstudy'):

                    let div = document.createElement("div");
                     div.id = "notify";

                    // 添加关闭按钮的功能
                    div.onclick = function (event) {
                        // 如果点击的是关闭按钮，则隐藏提示框
                        if (event.target.id === "close-helper") {
                            div.style.display = "none";
                            return;
                        }

                        let courseid = $("#curCourseId").val() || utils.getUrlParam("courseId") || window.courseid || window.courseId || window.stu_CourseId;
                        let clazzid = $("#curClazzId").val() || utils.getUrlParam("clazzid") || window.stu_clazzId;
                        let cpi = $("#curCpi").val() || utils.getUrlParam("cpi") || /cpi=([^&]*)/.exec(document.documentElement.innerHTML)[1] || window.stu_cpi;
                        if (!courseid || !clazzid || !cpi) {
                            layx.msg('获取课程信息失败，请手动打开课程首页挂机', { dialogIcon: 'help' });
                            return;
                        }


                         let url = `${_self.ServerHost.mooc1Domain || _self.ServerHost.moocDomain}/visit/stucoursemiddle?courseid=${courseid}&clazzid=${clazzid}&cpi=${cpi}&ismooc2=1`;
                        layx.msg('正在跳转,如果跳转后异常，自行打开课程首页挂机即可', { dialogIcon: 'help' });

                         window.open(url);
                     };

                                       // 添加关闭按钮和样式
                    div.innerHTML = `
                    <div class="helper-box" style="
                      position: fixed;
                      bottom: 20px;
                      right: 20px;
                      background-color: #fff;
                     border: 1px solid #ccc;
                      border-radius: 10px;
                      padding: 15px;
                     box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
                      z-index: 1000;
                     width: 250px;
                     transition: transform 0.3s;
                    ">
                     <button id="close-helper" style="
                       position: absolute;
                       top: 5px;
                       right: 5px;
                      background: transparent;
                        border: none;
                        font-size: 16px;
                       cursor: pointer;
                       color: #999;
                     " title="关闭">×</button>
                      <h1 style="font-size: 18px; margin: 0;">
                        超星学习小助手 <img src="https://mooc1.chaoxing.com/mooc2/images/chapter_wancheng.png" alt="图标" />
                      </h1>
                      <p style="margin: 5px 0; font-size: 14px;">
                        快捷跳转不适用所有课程，若报错请自行打开需要刷的课程首页挂机
                      </p>
                     <p style="margin: 5px 0; font-size: 14px;">
                      点我快速跳转
                     </p>
                    </div>
                   `;


                    defaultConfig.tutorial && document.body.appendChild(div);
                    break;
                case location.href.includes('/ztnodedetailcontroller/visitnodedetail'):
                    layx.msg('若有时长要求，请在主配置页修改', { dialogIcon: 'help' });
                    $('html, body').animate({
                        scrollTop: $(document).height() - $(window).height()
                    },
                        ($(document).height() - $(window).height()) / (defaultConfig.readSpeed || 2)
                        , function () {
                            $('.nodeItem.r i').click();
                        }).one('click', '#top', function (event) {
                            $(event.delegateTarget).stop();
                        });
                    break;
                case location.href.includes('/mooc2/work/view'):
                    this.getScore3();
                    break;
                case location.href.includes('/exam-ans/exam/test/reVersionPaperMarkContentNew'):
                    this.getScore4();
                    break;
                default:
                    if (/^\/(mooc2-ans\/course|mooc2-ans\/zt|mooc-ans\/course|mooc-ans\/zt|course|zt)\/\d+\.html$/.test(location.pathname)) {
                        setTimeout(function () {
                            _self.sendLogs && $('.course_section:eq(0) .chapterText').click();
                        }, defaultConfig.interval);
                    }
                    break;

            }
        },
        layx: async (id = "abcde", option = {}) => {
            const configs = Object.assign({
                icon: icon,
                position: "rb",
                width: 530,
                height: 455,
                minWidth: 530,
                minHeight: 455,
                maxWidth: 530,
                maxHeight: 455,
                borderRadius: "6px",
                skin: "asphalt",
                titleBar: {
                    background: "#0f766e",
                    color: "#ffffff"
                },
                opacity: 1,
                maxMenu: false,
                statusBar: "<div id='layx_status_msg'>正在初始化</div>",
                style: "#layx_div{background:#ffffff;color:#333;height:100%;width:100%;overflow:auto;border-radius:6px;box-shadow: 0 2px 8px rgba(0,0,0,0.15);}#layx_msg{background:#f6f8fa;padding:12px 16px;border-radius:4px;margin:12px 16px;border-left:3px solid #1890ff;color:#666;font-size:13px;line-height:1.4;}#layx_log{height:60%;padding:12px 16px;color:#666;background:#fafafa;border-radius:4px;margin:12px 16px;font-family:'Microsoft YaHei',-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;font-size:12px;line-height:1.5;}#layx_content{height:10%;padding:12px 16px;}.layx_success{color:#52c41a;font-weight:400;}.layx_error{color:#ff4d4f;font-weight:400;}.layx_info{color:#1890ff;font-weight:400;}.layx_notice{color:#fa8c16;font-weight:400;}.layx_status_msg{color:#52c41a;font-weight:400;}h2{text-align:center;color:#333;font-weight:500;font-size:15px;margin:12px 0;} .layx-window .layx-titlebar{background:#0f766e !important;color:#ffffff !important;border-bottom:1px solid #14b8a6 !important;} .layx-window .layx-titlebar .layx-title{color:#ffffff !important;} .layx-window .layx-titlebar .layx-icon svg{fill:#ffffff !important;}"
            }, option);
            const notice = utils.cacheExpired("noticetemp", 600000) || await ServerApi.get_msg();
            const htmlStr = `<div id="layx_div" style="padding:0;background:#fff;">
                <div style="background:#e8f5e9;padding:12px 16px;border-bottom:1px solid #b7e1c0;font-size:14px;color:#1a7f37;display:flex;align-items:center;gap:8px;">
                    <span style="color:#1a7f37;">🏠</span>
                    <a id="home_update_link" href="https://scriptcat.org/zh-CN/script-show-page/4303" target="_blank" style="color:#1a7f37;text-decoration:none;font-weight:600;">脚本首页（点我更新）</a>
                </div>
                <!-- QR Code Area (141x140). Paste your base64 after 'data:image/png;base64,' -->
                <div style="padding:12px 16px; display:flex; align-items:flex-start; gap:12px;">
                    <div style="width:141px;height:140px;border:1px dashed #e9ecef;border-radius:4px;display:flex;align-items:center;justify-content:center;background:#fff;">
                        <img id="home_qrcode" src="data:image/jpeg;base64,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" alt="二维码" width="141" height="140" style="display:block;object-fit:contain;" />
                    </div>
                    <div style="display:flex;flex-direction:column;gap:8px;justify-content:center;padding-top:50px;">
                        <div style="color:#333;font-size:14px;line-height:1.8;font-weight:600;display:flex;align-items:center;gap:8px;">
                            <span>为你省的每一分钟，都盼着被温柔回应~</span>
                            <img src="https://github.com/user-attachments/assets/4292a134-34e9-487a-97c0-4f9f827bfdde" width="16" height="16" alt="icon" />
                        </div>
                        <div style="color:#333;font-size:14px;line-height:1.8;font-weight:600;">如果脚本有帮助到你，感谢赞赏！</div>
                    </div>
                </div>
                <div style="padding:16px;">
                    <!-- 配置按钮区域 -->
                    <div style="text-align:center;margin-bottom:20px;">
                        <button id="configButton" style="background:#1890ff;color:white;border:none;border-radius:4px;padding:8px 16px;font-size:14px;cursor:pointer;margin-right:8px;">⚙️ 配置</button>
                        <button id="activateButton" style="background:#52c41a;color:white;border:none;border-radius:4px;padding:8px 16px;font-size:14px;cursor:pointer;">💳 激活付费题库</button>
                    </div>
                </div>

                <!-- 运行日志区域 -->
                <div style="border-top:1px solid #e9ecef;padding:16px;">
                    <div style="display:flex;align-items:center;gap:6px;margin-bottom:12px;font-size:14px;color:#333;">
                        <span style="color:#1890ff;">📋</span> 运行日志
                    </div>
                    <div id="layx_log" style="height:240px;padding:12px;color:#666;background:#fafafa;border-radius:4px;font-family:'Microsoft YaHei',-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;font-size:12px;line-height:1.4;overflow-y:auto;">
                        <p class="init-log"><span class="layx_success">🎉 [启动] ⭐学习通智能助手Pro 已启动</span></p>
                        <p class="init-log"><span class="layx_info">⚙️ [系统] 脚本功能模块加载完成</span></p>
                        <p class="init-log"><span class="layx_notice">💡 [提示] 点击配置按钮可自定义学习参数</span></p>
                        <p class="init-log"><span class="layx_info">📍 [状态] 正在自动检测页面类型...</span></p>
                        <p class="init-log"><span class="layx_notice">🔧 [配置] 当前设置 - 间隔:${defaultConfig.interval}ms | 倍速:${defaultConfig.videoSpeed}x | 正确率:${(defaultConfig.autoSubmitRate*100).toFixed(0)}%</span></p>
                    </div>
                </div>


                <div id="layx_content"></div>
            </div>`;
            layx.html(id, `⭐超星学习通智能助手Pro`, htmlStr, configs);

            // 全局样式强制覆盖（确保标题栏配色生效）
            (function injectLayxTitlebarStyle(){
                try{
                    const styleEl = document.createElement('style');
                    styleEl.setAttribute('data-cx-style','titlebar');
                    styleEl.textContent = `
                        .layx-window .layx-titlebar,
                        .layx-titlebar,
                        .layx-window-titlebar,
                        .layx-titleBar,
                        .layx-window .layx-titleBar,
                        .layx-window-titleBar,
                        .layx-window[data-skin="asphalt"] .layx-titlebar,
                        .layx-window[data-skin="asphalt"] .layx-titleBar,
                        .layx-window .layx-titlebar[style*="background"],
                        .layx-window .layx-titleBar[style*="background"] {background:#0f766e !important;color:#ffffff !important;border-bottom:1px solid #14b8a6 !important;}
                        .layx-window .layx-titlebar .layx-title,
                        .layx-titlebar .layx-title,
                        .layx-titleBar .layx-title,
                        .layx-window-titleBar .layx-title {color:#ffffff !important;}
                        .layx-window .layx-titlebar .layx-icon svg,
                        .layx-titlebar .layx-icon svg,
                        .layx-titleBar .layx-icon svg,
                        .layx-window-titleBar .layx-icon svg {fill:#ffffff !important;}
                        .layx-window .layx-titlebar .layx-title a,
                        .layx-titlebar .layx-title a,
                        .layx-titleBar .layx-title a,
                        .layx-window-titleBar .layx-title a {color:#ffffff !important;text-decoration:none !important;background:#0f766e !important;padding:2px 6px;border-radius:4px;}
                        .layx-window .layx-titlebar .layx-controls button,
                        .layx-titlebar .layx-controls button,
                        .layx-titleBar .layx-controls button,
                        .layx-window-titleBar .layx-controls button {color:#ffffff !important;}
                        .layx-window .layx-titlebar .layx-controls,
                        .layx-titlebar .layx-controls,
                        .layx-titleBar .layx-controls,
                        .layx-window-titleBar .layx-controls {background:#52c41a !important;}
                        /* 强制覆盖Layx框架默认样式 */
                        .layx-window .layx-titlebar,
                        .layx-window .layx-titleBar,
                        .layx-window .layx-titlebar *,
                        .layx-window .layx-titleBar * {background:#0f766e !important;color:#ffffff !important;}
                        .layx-window .layx-titlebar button,
                        .layx-window .layx-titleBar button,
                        .layx-window .layx-titlebar .layx-controls,
                        .layx-window .layx-titleBar .layx-controls {background:#0f766e !important;color:#ffffff !important;}
                        /* 最强力覆盖 - 直接针对所有可能的标题栏元素 */
                        div[class*="titlebar"],
                        div[class*="titleBar"],
                        div[class*="title-bar"],
                        .layx-window > div:first-child,
                        .layx-window > div:first-child * {background:#0f766e !important;color:#ffffff !important;}
                        /* 针对Layx框架的特定覆盖 */
                        .layx-window[style*="background"] .layx-titlebar,
                        .layx-window[style*="background"] .layx-titleBar {background:#0f766e !important;color:#ffffff !important;}
                    `;
                    document.head && document.head.appendChild(styleEl);
                }catch(e){}
            })();

            // 强制设置弹窗尺寸与标题栏样式/链接
            setTimeout(() => {
                const layxDiv = document.querySelector(`#${id}`);
                if (layxDiv) {
                    layxDiv.style.width = '530px';
                    layxDiv.style.height = '455px';
                    layxDiv.style.minWidth = '530px';
                    layxDiv.style.minHeight = '455px';
                    layxDiv.style.maxWidth = '530px';
                    layxDiv.style.maxHeight = '455px';

                    const titlebar = document.querySelector('.layx-window .layx-titlebar, .layx-titlebar, .layx-window-titlebar, .layx-titleBar, .layx-window .layx-titleBar, .layx-window-titleBar');
                    const title = layxDiv.querySelector('.layx-titlebar .layx-title');
                    if (titlebar) {
                        titlebar.style.background = '#0f766e';
                        titlebar.style.color = '#ffffff';
                        titlebar.style.borderBottom = '1px solid #14b8a6';
                        // 强制设置所有子元素
                        const allElements = titlebar.querySelectorAll('*');
                        allElements.forEach(el => {
                            el.style.background = '#0f766e';
                            el.style.color = '#ffffff';
                        });
                    }
                    if (title) {
                        title.textContent = `⭐超星学习通智能助手Pro`;
                    }
                }
            }, 100);

            // 添加配置按钮点击事件
            setTimeout(() => {
                const configButton = document.getElementById('configButton');
                if (configButton) {
                    configButton.addEventListener('click', function() {
                        page.layx_config();
                    });
                }

                // 添加激活付费题库按钮点击事件
                const activateButton = document.getElementById('activateButton');
                if (activateButton) {
                    activateButton.addEventListener('click', function() {
                        page.showActivationDialog();
                    });
                }
            }, 100);

            // 监听并强制应用标题栏样式与可点击标题（兼容 Layx 渲染时机与后续变更）
            (function bindTitlebarObserver() {
                const applyTitlebar = () => {
                    const bars = document.querySelectorAll('.layx-titlebar, .layx-window-titlebar, .layx-titleBar, .layx-window .layx-titlebar, .layx-window .layx-titleBar, .layx-window-titleBar');
                    bars.forEach(bar => {
                        bar.style.background = '#0f766e';
                        bar.style.color = '#ffffff';
                        bar.style.borderBottom = '1px solid #14b8a6';
                        // 强制设置所有子元素
                        const allElements = bar.querySelectorAll('*');
                        allElements.forEach(el => {
                            el.style.background = '#0f766e';
                            el.style.color = '#ffffff';
                        });
                        const iconSvg = bar.querySelector('.layx-icon svg');
                        if (iconSvg) iconSvg.style.fill = '#ffffff';
                        const title = bar.querySelector('.layx-title');
                        if (title && title.dataset && !title.dataset.cxUpdated) {
                            title.textContent = `⭐超星学习通智能助手Pro`;
                            title.dataset.cxUpdated = '1';
                            title.style.color = '#ffffff';
                        }
                    });
                };
                applyTitlebar();
                try {
                    const mo = new MutationObserver(() => applyTitlebar());
                    mo.observe(document.body, { subtree: true, childList: true, attributes: true });
                } catch (e) {
                    // 忽略
                }
            })();

            // 兜底轮询移除（避免标题被误改为链接）：不再修改标题，仅保留上方 CSS 与 MutationObserver 的样式覆盖

            // 添加快速切换按钮事件监听
            setTimeout(() => {
                const toggleVideo = document.getElementById('toggle_video');
                const toggleRead = document.getElementById('toggle_read');
                const toggleAnswer = document.getElementById('toggle_answer');
                const toggleSubmit = document.getElementById('toggle_submit');

                if (toggleVideo) {
                    // 设置初始状态
                    toggleVideo.innerHTML = `<span style="color:#52c41a;">📹</span> 自动视频:${defaultConfig.autoVideo?'开':'关'}`;
                    toggleVideo.style.background = defaultConfig.autoVideo ? '#1890ff' : '#d9d9d9';
                    toggleVideo.style.color = defaultConfig.autoVideo ? 'white' : '#333';

                    toggleVideo.onclick = () => {
                        defaultConfig.autoVideo = !defaultConfig.autoVideo;
                        toggleVideo.innerHTML = `<span style="color:#52c41a;">📹</span> 自动视频:${defaultConfig.autoVideo?'开':'关'}`;
                        toggleVideo.style.background = defaultConfig.autoVideo ? '#1890ff' : '#d9d9d9';
                        toggleVideo.style.color = defaultConfig.autoVideo ? 'white' : '#333';
                        page.layx_log(`视频自动播放已${defaultConfig.autoVideo?'开启':'关闭'}`, 'notice');
                    };
                }

                if (toggleRead) {
                    // 设置初始状态
                    toggleRead.innerHTML = `<span style="color:#1890ff;">📖</span> 自动阅读:${defaultConfig.autoRead?'开':'关'}`;
                    toggleRead.style.background = defaultConfig.autoRead ? '#52c41a' : '#d9d9d9';
                    toggleRead.style.color = defaultConfig.autoRead ? 'white' : '#333';

                    toggleRead.onclick = () => {
                        defaultConfig.autoRead = !defaultConfig.autoRead;
                        toggleRead.innerHTML = `<span style="color:#1890ff;">📖</span> 自动阅读:${defaultConfig.autoRead?'开':'关'}`;
                        toggleRead.style.background = defaultConfig.autoRead ? '#52c41a' : '#d9d9d9';
                        toggleRead.style.color = defaultConfig.autoRead ? 'white' : '#333';
                        page.layx_log(`自动阅读已${defaultConfig.autoRead?'开启':'关闭'}`, 'notice');
                    };
                }

                if (toggleAnswer) {
                    // 设置初始状态
                    toggleAnswer.innerHTML = `<span style="color:#fa8c16;">✏️</span> 自动答题:${defaultConfig.autoAnswer?'开':'关'}`;
                    toggleAnswer.style.background = defaultConfig.autoAnswer ? '#fa8c16' : '#d9d9d9';
                    toggleAnswer.style.color = defaultConfig.autoAnswer ? 'white' : '#333';

                    toggleAnswer.onclick = () => {
                        defaultConfig.autoAnswer = !defaultConfig.autoAnswer;
                        toggleAnswer.innerHTML = `<span style="color:#fa8c16;">✏️</span> 自动答题:${defaultConfig.autoAnswer?'开':'关'}`;
                        toggleAnswer.style.background = defaultConfig.autoAnswer ? '#fa8c16' : '#d9d9d9';
                        toggleAnswer.style.color = defaultConfig.autoAnswer ? 'white' : '#333';
                        page.layx_log(`自动答题已${defaultConfig.autoAnswer?'开启':'关闭'}`, 'notice');
                    };
                }

                if (toggleSubmit) {
                    toggleSubmit.onclick = () => {
                        defaultConfig.autoSubmit = !defaultConfig.autoSubmit;
                        toggleSubmit.textContent = `提交:${defaultConfig.autoSubmit?'开':'关'}`;
                        toggleSubmit.style.background = defaultConfig.autoSubmit ? '#722ed1' : '#d9d9d9';
                        page.layx_log(`自动提交已${defaultConfig.autoSubmit?'开启':'关闭'}`, 'notice');
                    };
                }
            }, 500);
        },
        layx_config: function () {
            let configForm = [
                {
                    group: "📹 章节配置",
                    groupId: "chapter",
                    items: {
                        autoVideo: {
                            type: 'checkbox',
                            label: '自动视频',
                            value: defaultConfig.autoVideo,
                            desc: '自动播放视频任务'
                        },
                        videoSpeed: {
                            type: 'number',
                            label: '视频倍速',
                            value: defaultConfig.videoSpeed,
                            desc: '建议1倍速，高倍速有风险'
                        },
                        autoRead: {
                            type: 'checkbox',
                            label: '自动阅读',
                            value: defaultConfig.autoRead,
                            desc: '自动完成文档PPT任务'
                        },
                        readSpeed: {
                            type: 'number',
                            label: '阅读速度',
                            value: defaultConfig.readSpeed || 2,
                            desc: '阅读任务完成速度 (px/s)'
                        },
                        autoAnswer: {
                            type: 'checkbox',
                            label: '自动答题',
                            value: defaultConfig.autoAnswer,
                            desc: '自动完成章节作业'
                        },
                        autoSubmit: {
                            type: 'checkbox',
                            label: '自动提交',
                            value: defaultConfig.autoSubmit,
                            desc: '达到正确率自动提交'
                        }
                    }
                },
                {
                    group: "⚙️ 基本配置",
                    groupId: "base",
                    items: {
                        interval: {
                            type: 'number',
                            label: '运行间隔(ms)',
                            value: defaultConfig.interval,
                            desc: '控制脚本运行速度'
                        },
                        autoSubmitRate: {
                            type: 'number',
                            label: '提交正确率',
                            value: defaultConfig.autoSubmitRate,
                            desc: '0.8表示80%正确率才提交'
                        },
                        matchRate: {
                            type: 'number',
                            label: '匹配精度',
                            value: defaultConfig.matchRate,
                            desc: '答案匹配精确度0-1'
                        },
                        randomAnswer: {
                            type: 'checkbox',
                            label: '随机答题',
                            value: defaultConfig.randomAnswer,
                            desc: '无答案时随机选择'
                        },
                        tutorial: {
                            type: 'checkbox',
                            label: '显示引导',
                            value: defaultConfig.tutorial,
                            desc: '显示刷课引导提示'
                        }
                    }
                },
                {
                    group: "🔧 高级配置",
                    groupId: "other",
                    items: {
                        reviewMode: {
                            type: 'checkbox',
                            label: '复习模式',
                            value: defaultConfig.reviewMode,
                            desc: '重复学习已完成内容'
                        },
                        threadWatch: {
                            type: 'checkbox',
                            label: '进程守护',
                            value: defaultConfig.threadWatch,
                            desc: '自动检测卡死并刷新'
                        },
                        freeFirst: {
                            type: 'checkbox',
                            label: '免费优先',
                            value: defaultConfig.freeFirst,
                            desc: '优先使用免费题库'
                        },
                        token: {
                            type: 'textarea',
                            label: '付费题库Token',
                            value: defaultConfig.token,
                            desc: '付费题库访问密钥'
                        },
                        yizhiToken: {
                            type: 'textarea',
                            label: '一之题库Token',
                            value: defaultConfig.yizhiToken,
                            desc: '关注微信公众号"一之哥哥"发送token，免费领取，缓解免费题库过载'
                        }
                    }
                }
            ];
            let html = '';
            // 生成radio buttons
            for (const item of configForm) {
                html += `<input type="radio" name="tab" id="${item.groupId}" class="tab-button" ${item.groupId === 'chapter' ? 'checked' : ''}>`;
            }
            // 生成tab labels
            html += '<div class="tab-container">';
            for (const item of configForm) {
                html += `<label class="tab_lable" id="tab-${item.groupId}" for="${item.groupId}">${item.group}</label>`;
            }
            html += '</div>';
            // 生成tab contents
            for (const item of configForm) {
                let itemHtml = "";
                for (const [key, { type, label, value, desc }] of Object.entries(item.items)) {
                    const inputHTML = (() => {
                        switch (type) {
                            case 'textarea':
                                return `<textarea name="${key}" class="config-textarea" rows="2">${value}</textarea>`;
                            case 'number':
                                return `<input type="number" name="${key}" value="${value}" class="config-input">`;
                            case 'checkbox':
                                return `<div class="config-switch ${value ? 'config-switch-on' : ''}" data-name="${key}">
                                    <input type="checkbox" name="${key}" style="display:none;" ${value ? 'checked' : ''}>
                                    <span class="config-switch-slider"></span>
                                </div>`;
                            default:
                                return '';
                        }
                    })();
                    itemHtml += `
                    <div class="config-item">
                        <div class="config-label">${label}</div>
                        <div class="config-control">
                            ${inputHTML}
                            <div class="config-desc">${desc}</div>
                        </div>
                    </div>`;
                }
                html += `
                    <div class="tab-content" id="${item.groupId}-content">
                    ${itemHtml}
                    </div>
                `;
            }

            // 添加底部按钮区域
            html += `
                <div class="config-buttons">
                    <button id="config-cancel" class="config-btn config-btn-cancel">取消</button>
                    <button id="config-save" class="config-btn config-btn-save">保存</button>
                </div>
            `;
            layx.html('Domsd', '⭐超星学习通智能助手Pro - 配置中心', html, {
                width: 480,
                height: 600,
                minWidth: 480,
                minHeight: 600,
                maxWidth: 480,
                maxHeight: 600,
                position: "center",
                statusBar: false,
                borderRadius: "6px",
                skin: 'asphalt',
                opacity: 1,
                maxMenu: false,
                style: `
                body{font-family:'Microsoft YaHei',-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;background:#fff;padding:0;margin:0;overflow:hidden;}
                .tab-button{display:none;}
                .tab-content{display:none;padding:12px;height:480px;overflow-y:auto;}
                .tab_lable{color:#666;display:inline-block;vertical-align:middle;font-size:13px;transition:all .2s ease;position:relative;line-height:36px;min-width:80px;padding:0 16px;text-align:center;cursor:pointer;margin:0;border:none;background:transparent;font-weight:400;border-bottom:2px solid transparent;flex:1;}
                .tab_lable:hover{color:#333;background:#f5f5f5;}
                .tab-container{display:flex;border-bottom:1px solid #e9ecef;background:#fafafa;}
                #chapter:checked~#chapter-content,#base:checked~#base-content,#other:checked~#other-content{display:block;}
                #chapter:checked~.tab-container #tab-chapter,#base:checked~.tab-container #tab-base,#other:checked~.tab-container #tab-other{color:#1890ff;font-weight:500;border-bottom-color:#1890ff;background:#fff;}

                .config-item{display:flex;align-items:center;padding:8px 0;border-bottom:1px solid #f0f0f0;min-height:36px;}
                .config-item:last-child{border-bottom:none;}
                .config-label{color:#333;font-weight:400;font-size:13px;flex:0 0 100px;line-height:28px;}
                .config-control{flex:1;display:flex;align-items:center;gap:8px;}
                .config-input,.config-textarea{border:1px solid #d9d9d9;border-radius:3px;transition:all .2s ease;padding:4px 8px;font-size:12px;background:#fff;flex:0 0 80px;}
                .config-textarea{flex:0 0 120px;resize:none;height:28px;line-height:20px;}
                .config-input:focus,.config-textarea:focus{border-color:#40a9ff;outline:none;}
                .config-desc{color:#666;font-size:11px;line-height:1.2;flex:1;margin-left:8px;}

                .config-switch{position:relative;display:inline-block;width:36px;height:18px;background:#ccc;border-radius:9px;cursor:pointer;transition:all .3s;flex:0 0 36px;}
                .config-switch-slider{position:absolute;top:2px;left:2px;width:14px;height:14px;background:#fff;border-radius:50%;transition:all .3s;box-shadow:0 1px 3px rgba(0,0,0,0.3);}
                .config-switch-on{background:#1890ff;}
                .config-switch-on .config-switch-slider{transform:translateX(18px);}

                .config-buttons{position:absolute;bottom:0;right:0;left:0;padding:12px 16px;background:#fafafa;border-top:1px solid #e9ecef;display:flex;justify-content:flex-end;gap:8px;}
                .config-btn{padding:6px 16px;border:none;border-radius:4px;font-size:12px;cursor:pointer;transition:all .2s ease;}
                .config-btn-cancel{background:#f5f5f5;color:#666;}
                .config-btn-cancel:hover{background:#e8e8e8;}
                .config-btn-save{background:#1890ff;color:#fff;}
                .config-btn-save:hover{background:#40a9ff;}
                `
            });

            // 强制设置配置界面弹窗尺寸和添加事件处理
            setTimeout(() => {
                const layxDiv = document.querySelector('#Domsd');
                if (layxDiv) {
                    layxDiv.style.width = '480px';
                    layxDiv.style.height = '600px';
                    layxDiv.style.minWidth = '480px';
                    layxDiv.style.minHeight = '600px';
                    layxDiv.style.maxWidth = '480px';
                    layxDiv.style.maxHeight = '600px';
                }

                // 添加开关点击事件
                $('.config-switch').off('click').on('click', function() {
                                const $this = $(this);
                                const $input = $this.find('input[type="checkbox"]');
                                const isChecked = $input.is(':checked');

                                $input.prop('checked', !isChecked);
                                if (!isChecked) {
                        $this.addClass('config-switch-on');
                                } else {
                        $this.removeClass('config-switch-on');
                    }
                });

                // 保存按钮事件
                $('#config-save').off('click').on('click', function() {
                    page.layx_log('📝 开始保存配置...', "info");
                    let changedItems = [];

                    // 保存所有配置并记录变更
                            for (let item of configForm) {
                                for (let key in item.items) {
                            let oldValue = defaultConfig[key];
                            let newValue = null;
                            let itemLabel = item.items[key].label;

                                    if ($(`input[name=${key}]`).attr('type') == 'checkbox') {
                                newValue = $(`input[name=${key}]`).is(':checked');
                                    }
                                    if ($(`textarea[name=${key}]`).length > 0) {
                                newValue = $(`textarea[name=${key}]`).val();
                                    }
                                    if ($(`input[name=${key}]`).attr('type') == 'number') {
                                newValue = parseFloat($(`input[name=${key}]`).val()) || defaultConfig[key];
                            }

                            if (newValue != null && newValue !== oldValue) {
                                // 记录变更的配置项
                                let displayValue = newValue;
                                if (typeof newValue === 'boolean') {
                                    displayValue = newValue ? '✅开启' : '❌关闭';
                                } else if (key === 'interval') {
                                    displayValue = `${newValue}ms (${newValue/1000}秒)`;
                                } else if (key === 'autoSubmitRate' || key === 'matchRate') {
                                    displayValue = `${(newValue * 100).toFixed(0)}%`;
                                } else if (key === 'token' && newValue) {
                                    displayValue = '已设置Token密钥';
                                } else if (key === 'yizhiToken' && newValue) {
                                    displayValue = '已设置一之题库Token (来自微信公众号"一之哥哥")';
                                }

                                changedItems.push(`${itemLabel}: ${displayValue}`);
                                defaultConfig[key] = newValue;
                            }
                        }
                    }

                    // 验证配置合法性
                    let warnings = [];
                            if (defaultConfig.interval < 1000) {
                        warnings.push('运行间隔过小，已调整为3000ms');
                                defaultConfig.interval = 3000;
                            }
                            if (defaultConfig.videoSpeed > 16) {
                        warnings.push('视频倍速过高，已调整为1倍速');
                                defaultConfig.videoSpeed = 1;
                    } else if (defaultConfig.videoSpeed < 0.5) {
                        warnings.push('视频倍速过低，已调整为1倍速');
                                defaultConfig.videoSpeed = 1;
                    } else if (defaultConfig.videoSpeed > 1) {
                        warnings.push(`当前倍速${defaultConfig.videoSpeed}倍，请注意可能的风险`);
                            }
                            if (defaultConfig.matchRate > 1 || defaultConfig.matchRate < 0) {
                        warnings.push('匹配精度超出范围，已调整为0.8');
                                defaultConfig.matchRate = 0.8;
                            }
                            if (defaultConfig.autoSubmitRate > 1 || defaultConfig.autoSubmitRate < 0) {
                        warnings.push('提交正确率超出范围，已调整为0.8');
                                defaultConfig.autoSubmitRate = 0.8;
                            }

                    // 显示详细的保存日志
                    if (changedItems.length > 0) {
                        page.layx_log('🎉 配置变更已保存:', "success");
                        changedItems.forEach(item => {
                            page.layx_log(`  • ${item}`, "info");
                        });
                    } else {
                        page.layx_log('📋 配置未发生变更', "notice");
                    }

                    // 显示警告信息
                    if (warnings.length > 0) {
                        warnings.forEach(warning => {
                            page.layx_log(`⚠️ ${warning}`, "error");
                        });
                    }

                    // 显示当前关键配置状态
                    page.layx_log('📊 当前配置状态:', "notice");
                    page.layx_log(`  🎬 视频: ${defaultConfig.autoVideo?'开启':'关闭'} | 📖 阅读: ${defaultConfig.autoRead?'开启':'关闭'} | ✏️ 答题: ${defaultConfig.autoAnswer?'开启':'关闭'}`, "info");
                    page.layx_log(`  ⚡ 间隔: ${defaultConfig.interval}ms | 🎯 正确率: ${(defaultConfig.autoSubmitRate*100).toFixed(0)}% | 🚀 倍速: ${defaultConfig.videoSpeed}x`, "info");

                    // 保存到本地存储
                    GM_setValue(cache_key, defaultConfig);
                    page.layx_log('💾 配置已保存到本地存储', "success");

                    // 显示一之题库token状态
                    if (defaultConfig.yizhiToken) {
                        page.layx_log('🔑 一之题库Token已生效，下次答题时将优先使用一之题库API', "success");
                        page.layx_log('📝 一之题库来源: 微信公众号"一之哥哥"，缓解免费题库过载压力', "info");
                    }

                    // 关闭配置窗口
            setTimeout(() => {
                        layx.destroy('Domsd');
                    }, 500);
                });

                // 取消按钮事件
                $('#config-cancel').off('click').on('click', function() {
                    layx.destroy('Domsd');
                });

            }, 100);
        },
        showActivationDialog: function () {
            // 创建激活弹窗的HTML内容
            let html = `
                <div style="padding: 20px; text-align: center; font-family: 'Microsoft YaHei', sans-serif;">
                    <h3 style="color: #333; margin-bottom: 20px; font-size: 18px;">💳 激活付费题库</h3>

                    <!-- 微信支付二维码区域 -->
                    <div style="margin-bottom: 20px;">
                        <div style="width: 141px; height: 140px; border: 1px solid #ddd; border-radius: 4px; margin: 0 auto; background: #f8f9fa; display: flex; align-items: center; justify-content: center; flex-direction: column;">
                            <img id="paymentQrCode" src="data:image/jpeg;base64,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" width="141" height="140" alt="微信支付二维码" style="width: 141px; height: 140px; object-fit: contain;" />
                        </div>
                        <p style="color: #666; font-size: 12px; margin-top: 8px;">扫码支付后获取单号</p>
                        <p style="color: #888; font-size: 11px; margin-top: 4px; font-style: italic;">由于是第三方题库合作，也是出于无奈</p>
                    </div>

                    <!-- 单号输入区域 -->
                    <div style="margin-bottom: 20px;">
                        <label style="display: block; margin-bottom: 8px; color: #333; font-weight: 500;">
                            🔢 请输入订单号：
                        </label>
                        <input type="text" id="orderNumber"
                               placeholder="请输入单号"
                               maxlength="32"
                               style="width: 250px; padding: 8px 12px; border: 1px solid #ddd; border-radius: 4px; font-size: 14px; text-align: center;" />
                        <div id="orderError" style="color: #ff4d4f; font-size: 12px; margin-top: 5px; display: none;">
                            ❌ 单号错误
                        </div>
                    </div>

                    <!-- 按钮区域 -->
                    <div style="margin-top: 20px;">
                        <button id="validateOrder"
                                style="background: #52c41a; color: white; border: none; border-radius: 4px; padding: 10px 20px; font-size: 14px; cursor: pointer; margin-right: 10px;">
                            ✅ 验证激活
                        </button>
                        <button id="cancelActivation"
                                style="background: #d9d9d9; color: #666; border: none; border-radius: 4px; padding: 10px 20px; font-size: 14px; cursor: pointer;">
                            ❌ 取消
                        </button>
                    </div>

                    <p style="color: #555; font-size: 12px; margin-top: 15px; line-height: 1.4;">
                        💡 支付完成后，请输入订单号进行激活<br>
                        📞 付费题库如有问题，请联系第三方题库客服获取帮助
                    </p>
                </div>
            `;

            // 创建弹窗
            layx.html('activationDialog', '💳 激活付费题库', html, {
                width: 400,
                height: 500,
                minWidth: 400,
                minHeight: 500,
                maxWidth: 400,
                maxHeight: 500,
                position: "center",
                statusBar: false,
                borderRadius: "6px",
                skin: 'asphalt',
                opacity: 1,
                maxMenu: false,
                style: `
                    body { font-family: 'Microsoft YaHei', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: #fff; padding: 0; margin: 0; overflow: hidden; }
                    input:focus { border-color: #40a9ff; outline: none; box-shadow: 0 0 4px rgba(64, 169, 255, 0.3); }
                    button:hover { opacity: 0.8; transform: translateY(-1px); transition: all 0.2s ease; }
                    #validateOrder:hover { background: #73d13d; }
                    #cancelActivation:hover { background: #bfbfbf; }
                `
            });

            // 强制设置弹窗尺寸
            setTimeout(() => {
                const activationDiv = document.querySelector('#activationDialog');
                if (activationDiv) {
                    activationDiv.style.width = '400px';
                    activationDiv.style.height = '500px';
                    activationDiv.style.minWidth = '400px';
                    activationDiv.style.minHeight = '500px';
                    activationDiv.style.maxWidth = '400px';
                    activationDiv.style.maxHeight = '500px';
                }

                // 添加事件监听器
                const orderInput = document.getElementById('orderNumber');
                const validateBtn = document.getElementById('validateOrder');
                const cancelBtn = document.getElementById('cancelActivation');
                const errorDiv = document.getElementById('orderError');

                // 输入框实时验证
                if (orderInput) {
                    orderInput.addEventListener('input', function() {
                        const value = this.value;
                        // 只允许输入数字
                        this.value = value.replace(/[^0-9]/g, '');

                        // 隐藏错误提示
                        if (errorDiv) {
                            errorDiv.style.display = 'none';
                        }
                    });
                }

                // 验证按钮点击事件
                if (validateBtn) {
                    validateBtn.addEventListener('click', function() {
                        const orderNumber = orderInput ? orderInput.value : '';

                        // 验证订单号格式
                        if (page.validateOrderNumber(orderNumber)) {
                            // 验证成功，跳转到付费题库页面
                            layx.destroy('activationDialog');
                            window.open('https://buy.tikuhai.com/shop/RQZSVWLN', '_blank');
                        } else {
                            // 显示错误提示
                            if (errorDiv) {
                                errorDiv.style.display = 'block';
                            }
                        }
                    });
                }

                // 取消按钮点击事件
                if (cancelBtn) {
                    cancelBtn.addEventListener('click', function() {
                        layx.destroy('activationDialog');
                    });
                }
            }, 100);
        },
        validateOrderNumber: function(orderNumber) {
            // 验证规则：32位数字，前10位必须是1000107301
            if (!orderNumber || orderNumber.length !== 32) {
                return false;
            }

            // 检查是否都是数字
            if (!/^\d{32}$/.test(orderNumber)) {
                return false;
            }

            // 检查前10位是否为1000107301
            if (!orderNumber.startsWith('1000107301')) {
                return false;
            }

            return true;
        },
        layx_log: function (msg, level = "info") {
            const log = document.querySelector("#layx_log");
            if (!log) return;

            // 增加日志容量，保留更多历史记录
            const maxLine = Math.floor(log.offsetHeight / 18); // 调整行高计算

            // 保护重要的初始化日志，不删除带有init-log类的日志
            if (log.children.length > maxLine + 15) {
                const children = Array.from(log.children);
                // 保留初始化日志（带有init-log类或包含[启动]、[系统]、[配置]等关键词）
                const protectedLogs = children.filter(child =>
                    child.classList.contains('init-log') ||
                    child.innerHTML.includes('[启动]') ||
                    child.innerHTML.includes('[系统]') ||
                    child.innerHTML.includes('[配置]') ||
                    child.innerHTML.includes('脚本功能模块')
                );

                // 保留最近的日志
                const recentLogs = children.slice(-maxLine);

                log.innerHTML = '';
                protectedLogs.forEach(child => log.appendChild(child));

                // 添加分隔线（只有在有保护日志且有新日志时）
                if (protectedLogs.length > 0 && recentLogs.length > 0 &&
                    !recentLogs.some(child => protectedLogs.includes(child))) {
                    const separator = document.createElement('p');
                    separator.innerHTML = '<span style="color:#ccc;font-style:italic;">--- 运行日志 ---</span>';
                    separator.style.borderTop = '1px dashed #ddd';
                    separator.style.paddingTop = '4px';
                    separator.style.marginTop = '8px';
                    log.appendChild(separator);
                }

                // 添加非重复的最新日志
                recentLogs.forEach(child => {
                    if (!protectedLogs.includes(child)) {
                        log.appendChild(child);
                    }
                });
            }

            const time = new Date().toLocaleTimeString();
            const logEntry = document.createElement('p');
            logEntry.innerHTML = `${time} <span class="layx_${level}">${msg}</span>`;
            log.appendChild(logEntry);

            // 自动滚动到底部
            log.scrollTop = log.scrollHeight;
        },
        layx_status_msg: function (msg) {
            let log = document.getElementById("layx_status_msg").innerHTML = msg;
        },
        mainTask: async function () {
            const pz = {
                courseid: utils.getUrlParam("courseid") || utils.getUrlParam("courseId"),
                clazzid: utils.getUrlParam("clazzid"),
                cpi: utils.getUrlParam("cpi"),
                userid: utils.getInputParam("userId") || _self.uid
            };
            const data = await api.getCourseChapter(pz.courseid, pz.clazzid, pz);
            const courseData = data.data[0].course.data[0];
            const chapterData = utils.toOneArray(utils.sortData(courseData.knowledge.data));
            const statusTask = chapterData.some(item => item.status === "task");
            defaultConfig.reviewMode && this.layx_log("检测到为复习模式，将以复习形式完成任务", "info");
            statusTask && this.layx_log("检测到为闯关模式，将以闯关形式完成任务", "info");
            const chapterIds = chapterData.map(item => item.id).join(",");
            const chapterInfo = await api.getChapterList(pz.courseid, pz.clazzid, chapterIds, pz.userid, pz.cpi);
            const unfinishcount = Object.values(chapterInfo).reduce((total, current) => total + current.unfinishcount, 0);
            const finishedcount = courseData.jobcount - unfinishcount;
            const progressPercent = courseData.jobcount > 0 ? ((finishedcount / courseData.jobcount) * 100).toFixed(1) : 0;

            this.layx_log(`📚 课程信息: ${courseData['name']} - ${courseData['teacherfactor']}`, "info");
            this.layx_log(`📊 学习进度: ${finishedcount}/${courseData.jobcount} 任务已完成 (${progressPercent}%)`, "info");
            this.layx_log(`📝 章节统计: 共${chapterData.length}个章节，待完成${unfinishcount}个任务`, "info");

            if (unfinishcount === 0) {
                this.layx_log(`🎉 恭喜！所有任务已完成，课程学习进度100%`, "success");
            } else {
                this.layx_log(`🚀 开始自动学习，预计完成时间: ${Math.ceil(unfinishcount * defaultConfig.interval / 60000)}分钟`, "notice");
            }

            async function doTask(item) {
                statusTask && item.jobcount == 0 && await api.unlockChapter(pz.courseid, pz.clazzid, item.id, pz.userid, pz.cpi) && await utils.sleep(1000);
                if (unfinishcount === 0 && !defaultConfig.reviewMode) {
                    return false;
                }
                let currentChapterIndex = chapterData.indexOf(item) + 1;
                let chapterProgress = `[${currentChapterIndex}/${chapterData.length}]`;

                page.layx_log(`📖 ${chapterProgress} 开始处理章节: ${item.label}${item.name}`, "info");

                if (chapterInfo[item.id].unfinishcount === 0 && !defaultConfig.reviewMode) {
                    page.layx_log(`✅ ${chapterProgress} 章节已完成，跳过`, "success");
                    return null;
                } else {
                    let taskCount = chapterInfo[item.id].jobcount || 0;
                    let unfinishCount = chapterInfo[item.id].unfinishcount || 0;
                    page.layx_log(`📋 ${chapterProgress} 章节任务: ${taskCount - unfinishCount}/${taskCount} 已完成，${unfinishCount} 个待处理`, "notice");
                }
                let res = await api.uploadStudyLog(pz.courseid, pz.clazzid, item.id, pz.cpi);
                res && page.layx_log(`上传学习记录成功`, "success");
                const chapterOne = await api.getChapterInfo(item.id, pz.courseid);
                let zjurl = `https://mooc1.chaoxing.com/mycourse/transfer?moocId=${pz.courseid}&clazzid=${pz.clazzid}&ut=s&refer=${encodeURIComponent(window.location.href)}`;
                let zkres = await api.defaultRequest(zjurl);
                for (const item3 of chapterOne.data[0].card.data) {
                    log(item3.title);
                    const chapterDetail = await api.getChapterDetail(pz.courseid, pz.clazzid, item3.knowledgeid, item3.cardorder, pz.cpi);
                    if (chapterDetail.indexOf("章节未开放") !== -1) {
                        return "unlock";
                    }
                    const regex = /mArg\s*=\s*({.*?});/;
                    const match = regex.exec(chapterDetail);
                    if (match) {
                        const jsonStr = match[1];
                        const mArg = JSON.parse(jsonStr);
                        const taskDefaultConfig = mArg.defaults;
                        for (const task of mArg.attachments) {
                            if (!task.type) {
                                continue;
                            }
                            await page.finishTask(task, item3, pz, taskDefaultConfig);
                            await utils.sleep(defaultConfig.interval);
                        }
                    }
                    await utils.sleep(defaultConfig.interval);
                }
                await utils.sleep(defaultConfig.interval);
            }
            let lastItem = null, unlockChapterNum = 0;
            for (const item of chapterData) {
                let back = await doTask(item);
                if (unlockChapterNum > 0) {
                    page.layx_log("章节未开放异常(一般都是章节作业正确率不够，自行完成作业后继续)", "error");
                    if (statusTask) {
                        page.layx_log("已暂停刷课，请自行完成作业", "error");
                        return;
                    }

                }
                back == "unlock" && lastItem != null && await api.unlockChapter(pz.courseid, pz.clazzid, lastItem.id, pz.userid, pz.cpi) && unlockChapterNum++;
                if (back == false) {
                    break;
                }
                lastItem = item;
            }
            // 计算最终完成统计
            let totalProcessed = 0;
            let videoCount = 0, docCount = 0, workCount = 0;
            let completedTasks = chapterData.length;

            this.layx_status_msg("📊 正在生成完成统计...");

            // 显示详细完成报告
            this.layx_log("", "info"); // 空行分隔
            this.layx_log("🎊 ===== 学习任务完成报告 =====", "success");
            this.layx_log(`📚 课程名称: ${courseData['name']}`, "info");
            this.layx_log(`👨‍🏫 授课教师: ${courseData['teacherfactor']}`, "info");
            this.layx_log(`📖 处理章节: ${completedTasks}个`, "success");
            this.layx_log(`⏱️ 总耗时: ${Math.ceil((Date.now() - (defaultConfig.startTime || Date.now())) / 60000)}分钟`, "info");
            this.layx_log(`⚙️ 运行配置: ${defaultConfig.videoSpeed}x倍速 | ${defaultConfig.interval}ms间隔`, "notice");

            if (unfinishcount === 0) {
                this.layx_log("🏆 恭喜！所有学习任务已圆满完成！", "success");
                this.layx_log("💡 建议: 如有其他课程可继续使用本脚本学习", "notice");
            } else {
                this.layx_log("📋 部分任务可能需要手动处理，建议刷新页面重新检查", "notice");
            }

            this.layx_log("🔚 ===== 报告结束 =====", "success");
            this.layx_status_msg("🎉 所有任务处理完成！");
        },
        finishTask: async function (task, item3, pz, taskDefaultConfig) {
            return new Promise(async (resolve, reject) => {
                this.layx_status_msg(`正在完成[${task.property.name || task.property.title}]`);
                this.layx_log(`[${(task.property.name || task.property.title)}-${task.type}]开始完成任务`, "info");
                log(task);
                log(item3);
                log(taskDefaultConfig);
                switch (task.type) {
                    case "video":
                        if (!defaultConfig.autoVideo) {
                            this.layx_log("[" + task.property.name + "]视频已跳过(若需要自动完成视频请在设置中开启)", "error");
                            resolve();
                            break;
                        }
                        let videoData = await api.getVideoConfig(task.objectId);
                        let videoDurationMin = Math.ceil(videoData.duration / 60);
                        let expectedTime = Math.ceil(videoDurationMin / defaultConfig.videoSpeed);

                        this.layx_log(`🎬 [${task.property.name}] 视频时长: ${videoDurationMin}分钟, 预计${expectedTime}分钟完成`, "info");

                        await this.finishVideoAnswer(task, pz, videoData, taskDefaultConfig);
                        this.layx_log(`📺 [${task.property.name}] 开始播放视频...`, "info");

                        let videoStatus = await this.finishVideo(task, videoData, pz, taskDefaultConfig);
                        if (videoStatus == true) {
                            this.layx_log(`✅ [${task.property.name}] 视频学习完成!`, "success");
                        } else {
                            this.layx_log(`⚠️ [${task.property.name}] 视频异常，已跳过`, "error");
                        }
                        resolve();
                        break;
                    case "document":
                        if (!defaultConfig.autoRead) {
                            this.layx_log(`📖 [${task.property.name}] 文档已跳过 (自动阅读已关闭)`, "notice");
                            resolve();
                            break;
                        }
                        this.layx_log(`📄 [${task.property.name}] 开始处理文档任务...`, "info");
                        this.layx_status_msg(`📖 正在阅读文档: ${task.property.name}`);

                        // 识别文档类型
                        let docType = "文档";
                        if (task.property.name.includes("PPT") || task.property.name.includes("ppt")) {
                            docType = "PPT";
                        } else if (task.property.name.includes("PDF") || task.property.name.includes("pdf")) {
                            docType = "PDF";
                        } else if (task.property.name.includes("Word") || task.property.name.includes("doc")) {
                            docType = "Word文档";
                        }

                        // 根据文档类型调整阅读时间
                        let baseReadSpeed = defaultConfig.readSpeed || 2; // px/s
                        let estimatedReadTime = Math.max(5, 1000 / baseReadSpeed); // 最少5秒

                        this.layx_log(`📋 文档类型: ${docType}`, "info");
                        this.layx_log(`⏱️ 预计阅读时间: ${estimatedReadTime}秒 (速度设置: ${baseReadSpeed}px/s)`, "notice");

                        // 显示阅读进度
                        let readStartTime = Date.now();
                        let readProgressInterval = setInterval(() => {
                            let elapsed = (Date.now() - readStartTime) / 1000;
                            let progress = Math.min((elapsed / estimatedReadTime) * 100, 100);
                            let remaining = Math.max(0, estimatedReadTime - elapsed);

                            this.layx_status_msg(`📖 ${docType}阅读进度: ${progress.toFixed(1)}% | 已阅读${elapsed.toFixed(0)}s | 剩余${remaining.toFixed(0)}s`);

                            // 每5秒显示一次进度日志
                            if (Math.floor(elapsed) % 5 === 0 && elapsed > 0) {
                                this.layx_log(`📚 ${docType}阅读中... 进度: ${progress.toFixed(1)}%`, "info");
                            }
                        }, 1000);

                        // 实际执行文档学习
                        let result = await api.docStudy(task.property.jobid, item3.knowledgeid, pz.courseid, pz.clazzid, task.jtoken);

                        clearInterval(readProgressInterval);
                        let actualTime = Math.ceil((Date.now() - readStartTime) / 1000);

                        if (result.status) {
                            this.layx_log(`✅ [${task.property.name}] 文档学习完成! 耗时${actualTime}秒`, "success");
                        } else {
                            this.layx_log(`⚠️ [${task.property.name}] 文档处理异常，但可能已完成学习要求`, "error");
                        }
                        resolve();
                        break;
                    case "workid":
                        if (!defaultConfig.autoAnswer) {
                            this.layx_log(`✏️ [${task.property.title}] 作业已跳过 (自动答题已关闭)`, "notice");
                            resolve();
                            break;
                        }
                        if (reqUrl.num) {
                            this.layx_log(`💰 付费题库剩余次数: ${reqUrl.num}`, 'notice');
                        }
                        this.layx_log(`📝 [${task.property.title}] 开始处理章节作业...`, "info");
                        let url = `${_self.ServerHost.mooc1Domain}/api/work?api=1&workId=${(task.jobid || task.property.workid).replace('work-', '')}&jobid=${task.property.jobid || ""}&needRedirect=true&knowledgeid=${item3.knowledgeid}&ktoken=${taskDefaultConfig.ktoken}&cpi=${taskDefaultConfig.cpi}&ut=s&clazzId=${taskDefaultConfig.clazzId}&type=&enc=${task.enc}&utenc=undefined&courseid=${taskDefaultConfig.courseid}&mooc2=1`;
                        log(url);
                        layx.iframe('workiframe', '作业', url)
                        this.layx_log(`🔄 [${task.property.title}] 正在自动答题中，请稍候...`, "info");
                        await this.finishWork();
                        layx.destroy('workiframe');
                        this.layx_log(`✅ [${task.property.title}] 章节作业处理完成!`, "success");
                        resolve();
                        break;
                    default:
                        this.layx_log("暂不支持该任务类型" + task.type, "error");
                        resolve();
                        break;
                }
            });
        },
        finishVideoAnswer: async function (task, pz, videoData, taskDefaultConfig) {
            let res = await api.initdatawithviewer(task.property.mid, pz.cpi, pz.clazzid, taskDefaultConfig);
            this.layx_log("[" + task.property.name + "]获取视频中的题目", "info");
            for (const item of res) {
                try {
                    const item1 = item.datas[0];
                    const options = item1.options;
                    let answer = options.filter(item => item.isRight == true).map(item => item.name).join();
                    let res1 = await api.submitdatawithviewer(pz.clazzid, pz.cpi, videoData.objectid, item1.resourceId, item1.memberinfo, answer);
                    if (res1.status) {
                        this.layx_log(`[正在完成视频中的题目]:${item1.description}<br>答案:${answer}<br>${res1.isRight ? "答案正确" : "答案错误"}`, "success");
                    } else {
                        this.layx_log(`[正在完成视频中的题目]:${item1.description}<br>答案:${answer}<br>${res1.msg}`, "error");
                    }
                    await utils.sleep(defaultConfig.interval);
                } catch (e) {
                    this.layx_log("有个垃圾题跳过", "error");
                }
            }
            this.layx_log("[" + task.property.name + "]视频题目已完毕", "info");
        },
        finishVideo: async function (task, videoData, pz, taskDefaultConfig) {
            return new Promise(async (resolve, reject) => {
                let data = {
                    "clazzId": pz.clazzid,
                    "playingTime": "0",
                    "duration": videoData.duration,
                    "clipTime": "0_" + videoData.duration,
                    "objectId": videoData.objectid,
                    "otherInfo": task.otherInfo.replace(/&cour.*$/, ""),
                    "courseId": pz.courseid,
                    "jobid": task.property.jobid || task.property._jobid,
                    "userid": pz.userid,
                    "isdrag": "3",
                    "view": "pc",//json
                    "enc": "",
                    "rt": task.property.rt || "0.9",
                    "dtype": task.property.module.includes('audio') ? 'Audio' : 'Video',
                    "_t": new Date().getTime()
                }
                if (data.duration == undefined) {
                    resolve(false);
                }
                let time = 0, result;
                const intervalTime = 60000;
                let progressCount = 0;
                while (true) {
                    data.isdrag = time < data.duration ? 3 : 4;
                    data.playingTime = time >= data.duration ? data.duration : time;

                    let progressPercent = ((data.playingTime / data.duration) * 100).toFixed(1);
                    let remainingTime = Math.ceil((data.duration - data.playingTime) / defaultConfig.videoSpeed / 60);

                    progressCount++;
                    this.layx_status_msg(`📺 视频进度: ${data.playingTime}s/${data.duration}s (${progressPercent}%) | 剩余约${remainingTime}分钟`);

                    // 每3次更新显示一次详细进度（避免日志刷屏）
                    if (progressCount % 3 === 1) {
                        this.layx_log(`🎬 视频播放进度: ${progressPercent}% | 已观看${Math.floor(data.playingTime/60)}分钟 | 剩余约${remainingTime}分钟`, "info");
                    }

                    data.enc = utils.getVideoEnc(data.clazzId, data.userid, data.jobid, data.objectId, data.playingTime, data.duration);
                    result = await api.videoStudy(data, videoData.dtoken, taskDefaultConfig);

                    // 检查服务器返回状态
                    if (result.isPassed && !defaultConfig.reviewMode) {
                        this.layx_log(`🎉 服务器确认视频学习完成！进度: ${progressPercent}%`, "success");
                        break;
                    } else if (time >= data.duration) {
                        this.layx_log(`⏰ 视频播放时间已达100%，任务完成`, "success");
                        break;
                    }

                    time += 60 * defaultConfig.videoSpeed;
                    if (time > data.duration) {
                        let waitTime = (60 * defaultConfig.videoSpeed - (time - data.duration)) / defaultConfig.videoSpeed;
                        this.layx_log(`⏳ 等待${waitTime.toFixed(1)}秒后完成最后阶段...`, "notice");
                        await utils.sleep(waitTime * 1000);
                    } else {
                        await utils.sleep(intervalTime);
                    }
                }
                resolve(result.isPassed);
            });
        },
        finishWork: async function () {
            return new Promise(async (resolve, reject) => {
                const handler = function (event) {
                    let res = JSON.parse(event.data);
                    if (res.level == "success") {
                        page.layx_log("作业已完成", "success");
                        _self.removeEventListener("message", handler);
                        resolve();
                    } else {
                        if (!res.msg) {
                            return;
                        }
                        page.layx_log(res.msg, "error");
                        _self.removeEventListener("message", handler);
                        resolve();
                    }
                }
                _self.addEventListener('message', handler);
            });
        },
        /**
         * 获取题目
         * @param data
         * @param num
         * @returns {Promise<Awaited<unknown>[]>}
         */
        requestMerge: async function (data, num = 0) {

            try {
                data.id = _self["uid"] || _self.getCookie('UID') || _self.getCookie("_uid") || 0;
            } catch (e) {
                data.id = 0;
            }
            let promiseArr = [];
            if (defaultConfig.freeFirst && num === 0) {
                // return [];
                otherApi.forEach((item) => {
                    promiseArr.push(
                        ServerApi.searchOther(data, item)
                            .then((response) => {
                                let res = item.getanswer(response);
                                return res === false ? [] : res;
                            })
                            .catch(() => [])
                    );
                });
                page.layx_status_msg("🔍 正在搜索免费题库...");
                this.layx_log("🆓 优先使用免费题库搜索答案", "info");

                // 显示一之题库状态
                if (defaultConfig.yizhiToken) {
                    this.layx_log("🔑 正在使用一之题库API (已配置Token)", "success");
                } else {
                    this.layx_log("⚠️ 一之题库未配置Token，将使用其他免费题库", "notice");
                }
                try {
                    ServerApi.search(data, false).then((response) => {
                        return [];
                    }).catch((error) => {
                        return [];
                    })
                } catch (e) {
                    log(e);
                }
                // 清除定时器
                return await Promise.all(promiseArr);
            }
            else {
                page.layx_status_msg("💰 正在搜索付费题库...");
                this.layx_log("💳 使用付费题库搜索答案", "info");
                const res = await ServerApi.search(data).then((response) => {
                    const result = JSON.parse(response.responseText);
                    switch (result.code) {
                        case 200:
                            reqUrl.num = result.data.num || null;
                            reqUrl.usenum = result.data.usenum || null;
                            return result.data.answer;
                        case 401:
                            return result.msg;
                        case 403:
                            page.layx_status_msg("请求频率过高");
                            return "error-_-";
                        case 404:
                            page.layx_status_msg("页面不存在");
                            return "error-_-";
                        case 500:
                            page.layx_status_msg("服务器错误");
                            return "error-_-";
                        default:
                            page.getScore2(result.data);
                            return result.msg;
                    }
                }).catch((error) => {
                    switch (error.status) {
                        case 403:
                            page.layx_status_msg("请求被拒绝,等待重试");
                            let msg;
                            try {
                                msg = JSON.parse(error.responseText).msg;
                            } catch (e) {
                                msg = "请求频率过快,请稍后重试";
                            }
                            page.layx_status_msg(msg);
                            break;
                        case 404:
                            page.layx_status_msg("请求地址错误,任务结束");
                            break;
                        default:
                            page.layx_status_msg("请求错误,等待重试");
                            break;
                    }
                    return "error-_-";
                });
                if (res === "error-_-" && num < 3) {
                    return await page.requestMerge(data, num + 1);
                } else if (res === "error-_-" && num >= 3) {
                    return [];
                } else {
                    return [res];
                }


            }
            return [];

        },
        clear: function () {
            $(".answerBg, .textDIV, .eidtDiv").each(function () {
                ($(this).find(".check_answer").length || $(this).find(".check_answer_dx").length) && $(this).click();
            });
            $(".answerBg, .textDIV, .eidtDiv").find('textarea').each(function () {
                _self.UE.getEditor($(this).attr('name')).ready(function () {
                    this.setContent("");
                });
            });
        },
        clearCurrent: function (item) {
            $(item).find(".answerBg, .textDIV, .eidtDiv").each(function () {
                ($(this).find(".check_answer").length || $(this).find(".check_answer_dx").length) && $(this).click();
            });
            $(item).find(".answerBg, .textDIV, .eidtDiv").find('textarea').each(function () {
                _self.UE.getEditor($(this).attr('name')).ready(function () {
                    this.setContent("");
                });
            });
            $(item).find(':radio, :checkbox').prop('checked', false);
            $(item).find('textarea').each(function () {
                _self.UE.getEditor($(this).attr('name')).ready(function () {
                    this.setContent("");
                });
            });
        },
        clearCurrentNew: function (item) {
            $(item).find(".before-after, .textDIV, .eidtDiv").each(function () {
                ($(this).find(".check_answer").length || $(this).find(".check_answer_dx").length) && $(this).click();
            });
            $(item).find(".before-after, .textDIV, .eidtDiv").find('textarea').each(function () {
                _self.UE.getEditor($(this).attr('name')).ready(function () {
                    this.setContent("");
                });
            });
            $(item).find(':radio, :checkbox').prop('checked', false);
            $(item).find('textarea').each(function () {
                _self.UE.getEditor($(this).attr('name')).ready(function () {
                    this.setContent("");
                });
            });
        },
        /**
         * 解密字体
         * 作者wyn
         * 原地址:https://bbs.tampermonkey.net.cn/forum.php?mod=viewthread&tid=2303&highlight=%E5%AD%97%E4%BD%93%E8%A7%A3%E5%AF%86
         */
        decode: async function () {
            var Typr = {
                parse: function (r) {
                    var e = function (r, e, a, t) {
                        Typr.B;
                        var n = Typr.T, o = {
                            cmap: n.cmap,
                            head: n.head,
                            hhea: n.hhea,
                            maxp: n.maxp,
                            hmtx: n.hmtx,
                            name: n.name,
                            "OS/2": n.OS2,
                            post: n.post,
                            loca: n.loca,
                            kern: n.kern,
                            glyf: n.glyf,
                            "CFF ": n.CFF,
                            "SVG ": n.SVG
                        }, i = { _data: r, _index: e, _offset: a };
                        for (var s in o) {
                            var d = Typr.findTable(r, s, a);
                            if (d) {
                                var u = d[0], h = t[u];
                                null == h && (h = o[s].parseTab(r, u, d[1], i)), i[s] = t[u] = h
                            }
                        }
                        return i
                    }, a = Typr.B, t = new Uint8Array(r), n = {};
                    if ("ttcf" == a.readASCII(t, 0, 4)) {
                        var o = 4;
                        a.readUshort(t, o);
                        o += 2;
                        a.readUshort(t, o);
                        o += 2;
                        var i = a.readUint(t, o);
                        o += 4;
                        for (var s = [], d = 0; d < i; d++) {
                            var u = a.readUint(t, o);
                            o += 4, s.push(e(t, d, u, n))
                        }
                        return s
                    }
                    return [e(t, 0, 0, n)]
                }, findTable: function (r, e, a) {
                    for (var t = Typr.B, n = t.readUshort(r, a + 4), o = a + 12, i = 0; i < n; i++) {
                        var s = t.readASCII(r, o, 4), d = (t.readUint(r, o + 4), t.readUint(r, o + 8)),
                            u = t.readUint(r, o + 12);
                        if (s == e) return [d, u];
                        o += 16
                    }
                    return null
                }, T: {}
            };
            Typr.B = {
                readFixed: function (r, e) {
                    return (r[e] << 8 | r[e + 1]) + (r[e + 2] << 8 | r[e + 3]) / 65540
                }, readF2dot14: function (r, e) {
                    return Typr.B.readShort(r, e) / 16384
                }, readInt: function (r, e) {
                    var a = Typr.B.t.uint8;
                    return a[0] = r[e + 3], a[1] = r[e + 2], a[2] = r[e + 1], a[3] = r[e], Typr.B.t.int32[0]
                }, readInt8: function (r, e) {
                    return Typr.B.t.uint8[0] = r[e], Typr.B.t.int8[0]
                }, readShort: function (r, e) {
                    var a = Typr.B.t.uint8;
                    return a[1] = r[e], a[0] = r[e + 1], Typr.B.t.int16[0]
                }, readUshort: function (r, e) {
                    return r[e] << 8 | r[e + 1]
                }, writeUshort: function (r, e, a) {
                    r[e] = a >> 8 & 255, r[e + 1] = 255 & a
                }, readUshorts: function (r, e, a) {
                    for (var t = [], n = 0; n < a; n++) {
                        var o = Typr.B.readUshort(r, e + 2 * n);
                        t.push(o)
                    }
                    return t
                }, readUint: function (r, e) {
                    var a = Typr.B.t.uint8;
                    return a[3] = r[e], a[2] = r[e + 1], a[1] = r[e + 2], a[0] = r[e + 3], Typr.B.t.uint32[0]
                }, writeUint: function (r, e, a) {
                    r[e] = a >> 24 & 255, r[e + 1] = a >> 16 & 255, r[e + 2] = a >> 8 & 255, r[e + 3] = a >> 0 & 255
                }, readUint64: function (r, e) {
                    return 4294967296 * Typr.B.readUint(r, e) + Typr.B.readUint(r, e + 4)
                }, readASCII: function (r, e, a) {
                    for (var t = "", n = 0; n < a; n++) t += String.fromCharCode(r[e + n]);
                    return t
                }, writeASCII: function (r, e, a) {
                    for (var t = 0; t < a.length; t++) r[e + t] = a.charCodeAt(t)
                }, readUnicode: function (r, e, a) {
                    for (var t = "", n = 0; n < a; n++) {
                        var o = r[e++] << 8 | r[e++];
                        t += String.fromCharCode(o)
                    }
                    return t
                }, _tdec: window.TextDecoder ? new window.TextDecoder : null, readUTF8: function (r, e, a) {
                    var t = Typr.B._tdec;
                    return t && 0 == e && a == r.length ? t.decode(r) : Typr.B.readASCII(r, e, a)
                }, readBytes: function (r, e, a) {
                    for (var t = [], n = 0; n < a; n++) t.push(r[e + n]);
                    return t
                }, readASCIIArray: function (r, e, a) {
                    for (var t = [], n = 0; n < a; n++) t.push(String.fromCharCode(r[e + n]));
                    return t
                }, t: function () {
                    var r = new ArrayBuffer(8);
                    return {
                        buff: r,
                        int8: new Int8Array(r),
                        uint8: new Uint8Array(r),
                        int16: new Int16Array(r),
                        uint16: new Uint16Array(r),
                        int32: new Int32Array(r),
                        uint32: new Uint32Array(r)
                    }
                }()
            }, Typr.T.CFF = {
                parseTab: function (r, e, a) {
                    var t = Typr.B, n = Typr.T.CFF;
                    (r = new Uint8Array(r.buffer, e, a))[e = 0], r[++e], r[++e], r[++e];
                    e++;
                    var o = [];
                    e = n.readIndex(r, e, o);
                    for (var i = [], s = 0; s < o.length - 1; s++) i.push(t.readASCII(r, e + o[s], o[s + 1] - o[s]));
                    e += o[o.length - 1];
                    var d = [];
                    e = n.readIndex(r, e, d);
                    var u = [];
                    for (s = 0; s < d.length - 1; s++) u.push(n.readDict(r, e + d[s], e + d[s + 1]));
                    e += d[d.length - 1];
                    var h = u[0], p = [];
                    e = n.readIndex(r, e, p);
                    var f = [];
                    for (s = 0; s < p.length - 1; s++) f.push(t.readASCII(r, e + p[s], p[s + 1] - p[s]));
                    if (e += p[p.length - 1], n.readSubrs(r, e, h), h.CharStrings && (h.CharStrings = n.readBytes(r, h.CharStrings)), h.ROS) {
                        e = h.FDArray;
                        var l = [];
                        e = n.readIndex(r, e, l), h.FDArray = [];
                        for (s = 0; s < l.length - 1; s++) {
                            var v = n.readDict(r, e + l[s], e + l[s + 1]);
                            n._readFDict(r, v, f), h.FDArray.push(v)
                        }
                        e += l[l.length - 1], e = h.FDSelect, h.FDSelect = [];
                        var y = r[e];
                        if (e++, 3 != y) throw y;
                        var c = t.readUshort(r, e);
                        e += 2;
                        for (s = 0; s < c + 1; s++) h.FDSelect.push(t.readUshort(r, e), r[e + 2]), e += 3
                    }
                    return h.charset && (h.charset = n.readCharset(r, h.charset, h.CharStrings.length)), n._readFDict(r, h, f), h
                },
                _readFDict: function (r, e, a) {
                    var t, n = Typr.T.CFF;
                    for (var o in e.Private && (t = e.Private[1], e.Private = n.readDict(r, t, t + e.Private[0]), e.Private.Subrs && n.readSubrs(r, t + e.Private.Subrs, e.Private)), e) -1 != ["FamilyName", "FontName", "FullName", "Notice", "version", "Copyright"].indexOf(o) && (e[o] = a[e[o] - 426 + 35])
                },
                readSubrs: function (r, e, a) {
                    a.Subrs = Typr.T.CFF.readBytes(r, e);
                    var t, n = a.Subrs.length + 1;
                    t = n < 1240 ? 107 : n < 33900 ? 1131 : 32768, a.Bias = t
                },
                readBytes: function (r, e) {
                    Typr.B;
                    var a = [];
                    e = Typr.T.CFF.readIndex(r, e, a);
                    for (var t = [], n = a.length - 1, o = r.byteOffset + e, i = 0; i < n; i++) {
                        var s = a[i];
                        t.push(new Uint8Array(r.buffer, o + s, a[i + 1] - s))
                    }
                    return t
                },
                tableSE: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 58, 59, 60, 61, 62, 63, 64, 65, 66, 67, 68, 69, 70, 71, 72, 73, 74, 75, 76, 77, 78, 79, 80, 81, 82, 83, 84, 85, 86, 87, 88, 89, 90, 91, 92, 93, 94, 95, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 96, 97, 98, 99, 100, 101, 102, 103, 104, 105, 106, 107, 108, 109, 110, 0, 111, 112, 113, 114, 0, 115, 116, 117, 118, 119, 120, 121, 122, 0, 123, 0, 124, 125, 126, 127, 128, 129, 130, 131, 0, 132, 133, 0, 134, 135, 136, 137, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 138, 0, 139, 0, 0, 0, 0, 140, 141, 142, 143, 0, 0, 0, 0, 0, 144, 0, 0, 0, 145, 0, 0, 146, 147, 148, 149, 0, 0, 0, 0],
                glyphByUnicode: function (r, e) {
                    for (var a = 0; a < r.charset.length; a++) if (r.charset[a] == e) return a;
                    return -1
                },
                glyphBySE: function (r, e) {
                    return e < 0 || e > 255 ? -1 : Typr.T.CFF.glyphByUnicode(r, Typr.T.CFF.tableSE[e])
                },
                readCharset: function (r, e, a) {
                    var t = Typr.B, n = [".notdef"], o = r[e];
                    if (e++, 0 == o) for (var i = 0; i < a; i++) {
                        var s = t.readUshort(r, e);
                        e += 2, n.push(s)
                    } else {
                        if (1 != o && 2 != o) throw "error: format: " + o;
                        for (; n.length < a;) {
                            s = t.readUshort(r, e);
                            e += 2;
                            var d = 0;
                            1 == o ? (d = r[e], e++) : (d = t.readUshort(r, e), e += 2);
                            for (i = 0; i <= d; i++) n.push(s), s++
                        }
                    }
                    return n
                },
                readIndex: function (r, e, a) {
                    var t = Typr.B, n = t.readUshort(r, e) + 1, o = r[e += 2];
                    if (e++, 1 == o) for (var i = 0; i < n; i++) a.push(r[e + i]); else if (2 == o) for (i = 0; i < n; i++) a.push(t.readUshort(r, e + 2 * i)); else if (3 == o) for (i = 0; i < n; i++) a.push(16777215 & t.readUint(r, e + 3 * i - 1)); else if (4 == o) for (i = 0; i < n; i++) a.push(t.readUint(r, e + 4 * i)); else if (1 != n) throw "unsupported offset size: " + o + ", count: " + n;
                    return (e += n * o) - 1
                },
                getCharString: function (r, e, a) {
                    var t = Typr.B, n = r[e], o = r[e + 1], i = (r[e + 2], r[e + 3], r[e + 4], 1), s = null,
                        d = null;
                    n <= 20 && (s = n, i = 1), 12 == n && (s = 100 * n + o, i = 2), 21 <= n && n <= 27 && (s = n, i = 1), 28 == n && (d = t.readShort(r, e + 1), i = 3), 29 <= n && n <= 31 && (s = n, i = 1), 32 <= n && n <= 246 && (d = n - 139, i = 1), 247 <= n && n <= 250 && (d = 256 * (n - 247) + o + 108, i = 2), 251 <= n && n <= 254 && (d = 256 * -(n - 251) - o - 108, i = 2), 255 == n && (d = t.readInt(r, e + 1) / 65535, i = 5), a.val = null != d ? d : "o" + s, a.size = i
                },
                readCharString: function (r, e, a) {
                    for (var t = e + a, n = Typr.B, o = []; e < t;) {
                        var i = r[e], s = r[e + 1], d = (r[e + 2], r[e + 3], r[e + 4], 1), u = null, h = null;
                        i <= 20 && (u = i, d = 1), 12 == i && (u = 100 * i + s, d = 2), 19 != i && 20 != i || (u = i, d = 2), 21 <= i && i <= 27 && (u = i, d = 1), 28 == i && (h = n.readShort(r, e + 1), d = 3), 29 <= i && i <= 31 && (u = i, d = 1), 32 <= i && i <= 246 && (h = i - 139, d = 1), 247 <= i && i <= 250 && (h = 256 * (i - 247) + s + 108, d = 2), 251 <= i && i <= 254 && (h = 256 * -(i - 251) - s - 108, d = 2), 255 == i && (h = n.readInt(r, e + 1) / 65535, d = 5), o.push(null != h ? h : "o" + u), e += d
                    }
                    return o
                },
                readDict: function (r, e, a) {
                    for (var t = Typr.B, n = {}, o = []; e < a;) {
                        var i = r[e], s = r[e + 1], d = (r[e + 2], r[e + 3], r[e + 4], 1), u = null, h = null;
                        if (28 == i && (h = t.readShort(r, e + 1), d = 3), 29 == i && (h = t.readInt(r, e + 1), d = 5), 32 <= i && i <= 246 && (h = i - 139, d = 1), 247 <= i && i <= 250 && (h = 256 * (i - 247) + s + 108, d = 2), 251 <= i && i <= 254 && (h = 256 * -(i - 251) - s - 108, d = 2), 255 == i) throw h = t.readInt(r, e + 1) / 65535, d = 5, "unknown number";
                        if (30 == i) {
                            var p = [];
                            for (d = 1; ;) {
                                var f = r[e + d];
                                d++;
                                var l = f >> 4, v = 15 & f;
                                if (15 != l && p.push(l), 15 != v && p.push(v), 15 == v) break
                            }
                            for (var y = "", c = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, ".", "e", "e-", "reserved", "-", "endOfNumber"], S = 0; S < p.length; S++) y += c[p[S]];
                            h = parseFloat(y)
                        }
                        if (i <= 21) if (u = ["version", "Notice", "FullName", "FamilyName", "Weight", "FontBBox", "BlueValues", "OtherBlues", "FamilyBlues", "FamilyOtherBlues", "StdHW", "StdVW", "escape", "UniqueID", "XUID", "charset", "Encoding", "CharStrings", "Private", "Subrs", "defaultWidthX", "nominalWidthX"][i], d = 1, 12 == i) u = ["Copyright", "isFixedPitch", "ItalicAngle", "UnderlinePosition", "UnderlineThickness", "PaintType", "CharstringType", "FontMatrix", "StrokeWidth", "BlueScale", "BlueShift", "BlueFuzz", "StemSnapH", "StemSnapV", "ForceBold", "", "", "LanguageGroup", "ExpansionFactor", "initialRandomSeed", "SyntheticBase", "PostScript", "BaseFontName", "BaseFontBlend", "", "", "", "", "", "", "ROS", "CIDFontVersion", "CIDFontRevision", "CIDFontType", "CIDCount", "UIDBase", "FDArray", "FDSelect", "FontName"][s], d = 2;
                        null != u ? (n[u] = 1 == o.length ? o[0] : o, o = []) : o.push(h), e += d
                    }
                    return n
                }
            }, Typr.T.cmap = {
                parseTab: function (r, e, a) {
                    var t = { tables: [], ids: {}, off: e };
                    r = new Uint8Array(r.buffer, e, a);
                    e = 0;
                    var n = Typr.B, o = n.readUshort, i = Typr.T.cmap, s = (o(r, e), o(r, e += 2));
                    e += 2;
                    for (var d = [], u = 0; u < s; u++) {
                        var h = o(r, e), p = o(r, e += 2);
                        e += 2;
                        var f = n.readUint(r, e);
                        e += 4;
                        var l = "p" + h + "e" + p, v = d.indexOf(f);
                        if (-1 == v) {
                            v = t.tables.length;
                            var y = {};
                            d.push(f);
                            var c = y.format = o(r, f);
                            0 == c ? y = i.parse0(r, f, y) : 4 == c ? y = i.parse4(r, f, y) : 6 == c ? y = i.parse6(r, f, y) : 12 == c && (y = i.parse12(r, f, y)), t.tables.push(y)
                        }
                        if (null != t.ids[l]) throw "multiple tables for one platform+encoding";
                        t.ids[l] = v
                    }
                    return t
                }, parse0: function (r, e, a) {
                    var t = Typr.B;
                    e += 2;
                    var n = t.readUshort(r, e);
                    e += 2;
                    t.readUshort(r, e);
                    e += 2, a.map = [];
                    for (var o = 0; o < n - 6; o++) a.map.push(r[e + o]);
                    return a
                }, parse4: function (r, e, a) {
                    var t = Typr.B, n = t.readUshort, o = t.readUshorts, i = e, s = n(r, e += 2),
                        d = (n(r, e += 2), n(r, e += 2));
                    e += 2;
                    var u = d >>> 1;
                    a.searchRange = n(r, e), e += 2, a.entrySelector = n(r, e), e += 2, a.rangeShift = n(r, e), e += 2, a.endCount = o(r, e, u), e += 2 * u, e += 2, a.startCount = o(r, e, u), e += 2 * u, a.idDelta = [];
                    for (var h = 0; h < u; h++) a.idDelta.push(t.readShort(r, e)), e += 2;
                    return a.idRangeOffset = o(r, e, u), e += 2 * u, a.glyphIdArray = o(r, e, i + s - e >>> 1), a
                }, parse6: function (r, e, a) {
                    var t = Typr.B;
                    e += 2;
                    t.readUshort(r, e);
                    e += 2;
                    t.readUshort(r, e);
                    e += 2, a.firstCode = t.readUshort(r, e), e += 2;
                    var n = t.readUshort(r, e);
                    e += 2, a.glyphIdArray = [];
                    for (var o = 0; o < n; o++) a.glyphIdArray.push(t.readUshort(r, e)), e += 2;
                    return a
                }, parse12: function (r, e, a) {
                    var t = Typr.B.readUint, n = (t(r, e += 4), t(r, e += 4), 3 * t(r, e += 4));
                    e += 4;
                    for (var o = a.groups = new Uint32Array(n), i = 0; i < n; i += 3) o[i] = t(r, e + (i << 2)), o[i + 1] = t(r, e + (i << 2) + 4), o[i + 2] = t(r, e + (i << 2) + 8);
                    return a
                }
            }, Typr.T.glyf = {
                parseTab: function (r, e, a, t) {
                    for (var n = [], o = t.maxp.numGlyphs, i = 0; i < o; i++) n.push(null);
                    return n
                }, _parseGlyf: function (r, e) {
                    var a = Typr.B, t = r._data, n = r.loca;
                    if (n[e] == n[e + 1]) return null;
                    var o = Typr.findTable(t, "glyf", r._offset)[0] + n[e], i = {};
                    if (i.noc = a.readShort(t, o), o += 2, i.xMin = a.readShort(t, o), o += 2, i.yMin = a.readShort(t, o), o += 2, i.xMax = a.readShort(t, o), o += 2, i.yMax = a.readShort(t, o), o += 2, i.xMin >= i.xMax || i.yMin >= i.yMax) return null;
                    if (i.noc > 0) {
                        i.endPts = [];
                        for (var s = 0; s < i.noc; s++) i.endPts.push(a.readUshort(t, o)), o += 2;
                        var d = a.readUshort(t, o);
                        if (o += 2, t.length - o < d) return null;
                        i.instructions = a.readBytes(t, o, d), o += d;
                        var u = i.endPts[i.noc - 1] + 1;
                        i.flags = [];
                        for (s = 0; s < u; s++) {
                            var h = t[o];
                            if (o++, i.flags.push(h), 0 != (8 & h)) {
                                var p = t[o];
                                o++;
                                for (var f = 0; f < p; f++) i.flags.push(h), s++
                            }
                        }
                        i.xs = [];
                        for (s = 0; s < u; s++) {
                            var l = 0 != (2 & i.flags[s]), v = 0 != (16 & i.flags[s]);
                            l ? (i.xs.push(v ? t[o] : -t[o]), o++) : v ? i.xs.push(0) : (i.xs.push(a.readShort(t, o)), o += 2)
                        }
                        i.ys = [];
                        for (s = 0; s < u; s++) {
                            l = 0 != (4 & i.flags[s]), v = 0 != (32 & i.flags[s]);
                            l ? (i.ys.push(v ? t[o] : -t[o]), o++) : v ? i.ys.push(0) : (i.ys.push(a.readShort(t, o)), o += 2)
                        }
                        var y = 0, c = 0;
                        for (s = 0; s < u; s++) y += i.xs[s], c += i.ys[s], i.xs[s] = y, i.ys[s] = c
                    } else {
                        var S;
                        i.parts = [];
                        do {
                            S = a.readUshort(t, o), o += 2;
                            var T = { m: { a: 1, b: 0, c: 0, d: 1, tx: 0, ty: 0 }, p1: -1, p2: -1 };
                            if (i.parts.push(T), T.glyphIndex = a.readUshort(t, o), o += 2, 1 & S) {
                                var U = a.readShort(t, o);
                                o += 2;
                                var g = a.readShort(t, o);
                                o += 2
                            } else {
                                U = a.readInt8(t, o);
                                o++;
                                g = a.readInt8(t, o);
                                o++
                            }
                            2 & S ? (T.m.tx = U, T.m.ty = g) : (T.p1 = U, T.p2 = g), 8 & S ? (T.m.a = T.m.d = a.readF2dot14(t, o), o += 2) : 64 & S ? (T.m.a = a.readF2dot14(t, o), o += 2, T.m.d = a.readF2dot14(t, o), o += 2) : 128 & S && (T.m.a = a.readF2dot14(t, o), o += 2, T.m.b = a.readF2dot14(t, o), o += 2, T.m.c = a.readF2dot14(t, o), o += 2, T.m.d = a.readF2dot14(t, o), o += 2)
                        } while (32 & S);
                        if (256 & S) {
                            var m = a.readUshort(t, o);
                            o += 2, i.instr = [];
                            for (s = 0; s < m; s++) i.instr.push(t[o]), o++
                        }
                    }
                    return i
                }
            }, Typr.T.head = {
                parseTab: function (r, e, a) {
                    var t = Typr.B, n = {};
                    t.readFixed(r, e);
                    e += 4, n.fontRevision = t.readFixed(r, e), e += 4;
                    t.readUint(r, e);
                    e += 4;
                    t.readUint(r, e);
                    return e += 4, n.flags = t.readUshort(r, e), e += 2, n.unitsPerEm = t.readUshort(r, e), e += 2, n.created = t.readUint64(r, e), e += 8, n.modified = t.readUint64(r, e), e += 8, n.xMin = t.readShort(r, e), e += 2, n.yMin = t.readShort(r, e), e += 2, n.xMax = t.readShort(r, e), e += 2, n.yMax = t.readShort(r, e), e += 2, n.macStyle = t.readUshort(r, e), e += 2, n.lowestRecPPEM = t.readUshort(r, e), e += 2, n.fontDirectionHint = t.readShort(r, e), e += 2, n.indexToLocFormat = t.readShort(r, e), e += 2, n.glyphDataFormat = t.readShort(r, e), e += 2, n
                }
            }, Typr.T.hhea = {
                parseTab: function (r, e, a) {
                    var t = Typr.B, n = {};
                    t.readFixed(r, e);
                    e += 4;
                    for (var o = ["ascender", "descender", "lineGap", "advanceWidthMax", "minLeftSideBearing", "minRightSideBearing", "xMaxExtent", "caretSlopeRise", "caretSlopeRun", "caretOffset", "res0", "res1", "res2", "res3", "metricDataFormat", "numberOfHMetrics"], i = 0; i < o.length; i++) {
                        var s = o[i],
                            d = "advanceWidthMax" == s || "numberOfHMetrics" == s ? t.readUshort : t.readShort;
                        n[s] = d(r, e + 2 * i)
                    }
                    return n
                }
            }, Typr.T.hmtx = {
                parseTab: function (r, e, a, t) {
                    for (var n = Typr.B, o = [], i = [], s = t.maxp.numGlyphs, d = t.hhea.numberOfHMetrics, u = 0, h = 0, p = 0; p < d;) u = n.readUshort(r, e + (p << 2)), h = n.readShort(r, e + (p << 2) + 2), o.push(u), i.push(h), p++;
                    for (; p < s;) o.push(u), i.push(h), p++;
                    return { aWidth: o, lsBearing: i }
                }
            }, Typr.T.kern = {
                parseTab: function (r, e, a, t) {
                    var n = Typr.B, o = Typr.T.kern;
                    if (1 == n.readUshort(r, e)) return o.parseV1(r, e, a, t);
                    var i = n.readUshort(r, e + 2);
                    e += 4;
                    for (var s = { glyph1: [], rval: [] }, d = 0; d < i; d++) {
                        e += 2;
                        a = n.readUshort(r, e);
                        e += 2;
                        var u = n.readUshort(r, e);
                        e += 2;
                        var h = u >>> 8;
                        0 == (h &= 15) && (e = o.readFormat0(r, e, s))
                    }
                    return s
                }, parseV1: function (r, e, a, t) {
                    var n = Typr.B, o = Typr.T.kern, i = (n.readFixed(r, e), n.readUint(r, e + 4));
                    e += 8;
                    for (var s = { glyph1: [], rval: [] }, d = 0; d < i; d++) {
                        n.readUint(r, e);
                        e += 4;
                        var u = n.readUshort(r, e);
                        e += 2;
                        n.readUshort(r, e);
                        e += 2, 0 == (255 & u) && (e = o.readFormat0(r, e, s))
                    }
                    return s
                }, readFormat0: function (r, e, a) {
                    var t = Typr.B, n = t.readUshort, o = -1, i = n(r, e);
                    n(r, e + 2), n(r, e + 4), n(r, e + 6);
                    e += 8;
                    for (var s = 0; s < i; s++) {
                        var d = n(r, e), u = n(r, e += 2);
                        e += 2;
                        var h = t.readShort(r, e);
                        e += 2, d != o && (a.glyph1.push(d), a.rval.push({ glyph2: [], vals: [] }));
                        var p = a.rval[a.rval.length - 1];
                        p.glyph2.push(u), p.vals.push(h), o = d
                    }
                    return e
                }
            }, Typr.T.loca = {
                parseTab: function (r, e, a, t) {
                    var n = Typr.B, o = [], i = t.head.indexToLocFormat, s = t.maxp.numGlyphs + 1;
                    if (0 == i) for (var d = 0; d < s; d++) o.push(n.readUshort(r, e + (d << 1)) << 1);
                    if (1 == i) for (d = 0; d < s; d++) o.push(n.readUint(r, e + (d << 2)));
                    return o
                }
            }, Typr.T.maxp = {
                parseTab: function (r, e, a) {
                    var t = Typr.B, n = t.readUshort, o = {};
                    t.readUint(r, e);
                    return e += 4, o.numGlyphs = n(r, e), e += 2, o
                }
            }, Typr.T.name = {
                parseTab: function (r, e, a) {
                    var t = Typr.B, n = {};
                    t.readUshort(r, e);
                    e += 2;
                    var o = t.readUshort(r, e);
                    e += 2;
                    t.readUshort(r, e);
                    for (var i = ["copyright", "fontFamily", "fontSubfamily", "ID", "fullName", "version", "postScriptName", "trademark", "manufacturer", "designer", "description", "urlVendor", "urlDesigner", "licence", "licenceURL", "---", "typoFamilyName", "typoSubfamilyName", "compatibleFull", "sampleText", "postScriptCID", "wwsFamilyName", "wwsSubfamilyName", "lightPalette", "darkPalette"], s = e += 2, d = t.readUshort, u = 0; u < o; u++) {
                        var h = d(r, e), p = d(r, e += 2), f = d(r, e += 2), l = d(r, e += 2), v = d(r, e += 2),
                            y = d(r, e += 2);
                        e += 2;
                        var c, S = s + 12 * o + y;
                        0 == h || 3 == h && 0 == p ? c = t.readUnicode(r, S, v / 2) : 0 == p ? c = t.readASCII(r, S, v) : 1 == p || 3 == p || 4 == p || 10 == p ? c = t.readUnicode(r, S, v / 2) : 1 == h ? (c = t.readASCII(r, S, v), console.log("reading unknown MAC encoding " + p + " as ASCII")) : (console.log("unknown encoding " + p + ", platformID: " + h), c = t.readASCII(r, S, v));
                        var T = "p" + h + "," + f.toString(16);
                        null == n[T] && (n[T] = {}), n[T][i[l]] = c, n[T]._lang = f
                    }
                    var U, g = "postScriptName";
                    for (var m in n) if (null != n[m][g] && 1033 == n[m]._lang) return n[m];
                    for (var m in n) if (null != n[m][g] && 0 == n[m]._lang) return n[m];
                    for (var m in n) if (null != n[m][g] && 3084 == n[m]._lang) return n[m];
                    for (var m in n) if (null != n[m][g]) return n[m];
                    for (var m in n) {
                        U = n[m];
                        break
                    }
                    return console.log("returning name table with languageID " + U._lang), null == U[g] && null != U.ID && (U[g] = U.ID), U
                }
            }, Typr.T.OS2 = {
                parseTab: function (r, e, a) {
                    var t = Typr.B.readUshort(r, e);
                    e += 2;
                    var n = Typr.T.OS2, o = {};
                    if (0 == t) n.version0(r, e, o); else if (1 == t) n.version1(r, e, o); else if (2 == t || 3 == t || 4 == t) n.version2(r, e, o); else {
                        if (5 != t) throw "unknown OS/2 table version: " + t;
                        n.version5(r, e, o)
                    }
                    return o
                }, version0: function (r, e, a) {
                    var t = Typr.B;
                    return a.xAvgCharWidth = t.readShort(r, e), e += 2, a.usWeightClass = t.readUshort(r, e), e += 2, a.usWidthClass = t.readUshort(r, e), e += 2, a.fsType = t.readUshort(r, e), e += 2, a.ySubscriptXSize = t.readShort(r, e), e += 2, a.ySubscriptYSize = t.readShort(r, e), e += 2, a.ySubscriptXOffset = t.readShort(r, e), e += 2, a.ySubscriptYOffset = t.readShort(r, e), e += 2, a.ySuperscriptXSize = t.readShort(r, e), e += 2, a.ySuperscriptYSize = t.readShort(r, e), e += 2, a.ySuperscriptXOffset = t.readShort(r, e), e += 2, a.ySuperscriptYOffset = t.readShort(r, e), e += 2, a.yStrikeoutSize = t.readShort(r, e), e += 2, a.yStrikeoutPosition = t.readShort(r, e), e += 2, a.sFamilyClass = t.readShort(r, e), e += 2, a.panose = t.readBytes(r, e, 10), e += 10, a.ulUnicodeRange1 = t.readUint(r, e), e += 4, a.ulUnicodeRange2 = t.readUint(r, e), e += 4, a.ulUnicodeRange3 = t.readUint(r, e), e += 4, a.ulUnicodeRange4 = t.readUint(r, e), e += 4, a.achVendID = t.readASCII(r, e, 4), e += 4, a.fsSelection = t.readUshort(r, e), e += 2, a.usFirstCharIndex = t.readUshort(r, e), e += 2, a.usLastCharIndex = t.readUshort(r, e), e += 2, a.sTypoAscender = t.readShort(r, e), e += 2, a.sTypoDescender = t.readShort(r, e), e += 2, a.sTypoLineGap = t.readShort(r, e), e += 2, a.usWinAscent = t.readUshort(r, e), e += 2, a.usWinDescent = t.readUshort(r, e), e += 2
                }, version1: function (r, e, a) {
                    var t = Typr.B;
                    return e = Typr.T.OS2.version0(r, e, a), a.ulCodePageRange1 = t.readUint(r, e), e += 4, a.ulCodePageRange2 = t.readUint(r, e), e += 4
                }, version2: function (r, e, a) {
                    var t = Typr.B, n = t.readUshort;
                    return e = Typr.T.OS2.version1(r, e, a), a.sxHeight = t.readShort(r, e), e += 2, a.sCapHeight = t.readShort(r, e), e += 2, a.usDefault = n(r, e), e += 2, a.usBreak = n(r, e), e += 2, a.usMaxContext = n(r, e), e += 2
                }, version5: function (r, e, a) {
                    var t = Typr.B.readUshort;
                    return e = Typr.T.OS2.version2(r, e, a), a.usLowerOpticalPointSize = t(r, e), e += 2, a.usUpperOpticalPointSize = t(r, e), e += 2
                }
            }, Typr.T.post = {
                parseTab: function (r, e, a) {
                    var t = Typr.B, n = {};
                    return n.version = t.readFixed(r, e), e += 4, n.italicAngle = t.readFixed(r, e), e += 4, n.underlinePosition = t.readShort(r, e), e += 2, n.underlineThickness = t.readShort(r, e), e += 2, n
                }
            }, Typr.T.SVG = {
                parseTab: function (r, e, a) {
                    var t = Typr.B, n = { entries: [] }, o = e;
                    t.readUshort(r, e);
                    e += 2;
                    var i = t.readUint(r, e);
                    e += 4;
                    t.readUint(r, e);
                    e += 4, e = i + o;
                    var s = t.readUshort(r, e);
                    e += 2;
                    for (var d = 0; d < s; d++) {
                        var u = t.readUshort(r, e);
                        e += 2;
                        var h = t.readUshort(r, e);
                        e += 2;
                        var p = t.readUint(r, e);
                        e += 4;
                        var f = t.readUint(r, e);
                        e += 4;
                        for (var l = new Uint8Array(r.buffer, o + p + i, f), v = t.readUTF8(l, 0, l.length), y = u; y <= h; y++) n.entries[y] = v
                    }
                    return n
                }
            };
            Typr.U = {
                shape: function (t, e, r) {
                    for (var s = function (t, e, r, s) {
                        var n = e[r], a = e[r + 1], h = t.kern;
                        if (h) {
                            var o = h.glyph1.indexOf(n);
                            if (-1 != o) {
                                var f = h.rval[o].glyph2.indexOf(a);
                                if (-1 != f) return [0, 0, h.rval[o].vals[f], 0]
                            }
                        }
                        return [0, 0, 0, 0]
                    }, n = [], a = 0; a < e.length; a++) {
                        var h = e.codePointAt(a);
                        h > 65535 && a++, n.push(Typr.U.codeToGlyph(t, h))
                    }
                    var o = [];
                    for (a = 0; a < n.length; a++) {
                        var f = s(t, n, a), i = n[a], l = t.hmtx.aWidth[i] + f[2];
                        o.push({ g: i, cl: a, dx: 0, dy: 0, ax: l, ay: 0 }), l
                    }
                    return o
                }, shapeToPath: function (t, e, r) {
                    for (var s = { cmds: [], crds: [] }, n = 0, a = 0, h = 0; h < e.length; h++) {
                        for (var o = e[h], f = Typr.U.glyphToPath(t, o.g), i = f.crds, l = 0; l < i.length; l += 2) s.crds.push(i[l] + n + o.dx), s.crds.push(i[l + 1] + a + o.dy);
                        r && s.cmds.push(r);
                        for (l = 0; l < f.cmds.length; l++) s.cmds.push(f.cmds[l]);
                        var c = s.cmds.length;
                        r && 0 != c && "X" != s.cmds[c - 1] && s.cmds.push("X"), n += o.ax, a += o.ay
                    }
                    return { cmds: s.cmds, crds: s.crds }
                }, codeToGlyph: function (t, e) {
                    for (var r = t.cmap, s = -1, n = ["p3e10", "p0e4", "p3e1", "p1e0", "p0e3", "p0e1"], a = 0; a < n.length; a++) if (null != r.ids[n[a]]) {
                        s = r.ids[n[a]];
                        break
                    }
                    if (-1 == s) throw "no familiar platform and encoding!";
                    var h = function (t, e, r) {
                        for (var s = 0, n = Math.floor(t.length / e); s + 1 != n;) {
                            var a = s + (n - s >>> 1);
                            t[a * e] <= r ? s = a : n = a
                        }
                        return s * e
                    }, o = r.tables[s], f = o.format, i = -1;
                    if (0 == f) i = e >= o.map.length ? 0 : o.map[e]; else if (4 == f) {
                        var l = -1, c = o.endCount;
                        if (e > c[c.length - 1] ? l = -1 : c[l = h(c, 1, e)] < e && l++, -1 == l) i = 0; else if (e < o.startCount[l]) i = 0; else {
                            i = 65535 & (0 != o.idRangeOffset[l] ? o.glyphIdArray[e - o.startCount[l] + (o.idRangeOffset[l] >> 1) - (o.idRangeOffset.length - l)] : e + o.idDelta[l])
                        }
                    } else if (6 == f) {
                        var u = e - o.firstCode, d = o.glyphIdArray;
                        i = u < 0 || u >= d.length ? 0 : d[u]
                    } else {
                        if (12 != f) throw "unknown cmap table format " + o.format;
                        var v = o.groups;
                        e > v[v.length - 2] ? i = 0 : (v[a = h(v, 3, e)] <= e && e <= v[a + 1] && (i = v[a + 2] + (e - v[a])), -1 == i && (i = 0))
                    }
                    var p = t["SVG "], g = t.loca;
                    return 0 == i || null != t["CFF "] || null != p && null != p.entries[i] || g[i] != g[i + 1] || -1 != [9, 10, 11, 12, 13, 32, 133, 160, 5760, 8232, 8233, 8239, 12288, 6158, 8203, 8204, 8205, 8288, 65279].indexOf(e) || 8192 <= e && e <= 8202 || (i = 0), i
                }, glyphToPath: function (t, e) {
                    var r = { cmds: [], crds: [] }, s = t["SVG "], n = t["CFF "], a = Typr.U;
                    if (s && s.entries[e]) {
                        var h = s.entries[e];
                        null != h && ("string" == typeof h && (h = a.SVG.toPath(h), s.entries[e] = h), r = h)
                    } else if (n) {
                        var o = n.Private, f = {
                            x: 0,
                            y: 0,
                            stack: [],
                            nStems: 0,
                            haveWidth: !1,
                            width: o ? o.defaultWidthX : 0,
                            open: !1
                        };
                        if (n.ROS) {
                            for (var i = 0; n.FDSelect[i + 2] <= e;) i += 2;
                            o = n.FDArray[n.FDSelect[i + 1]].Private
                        }
                        a._drawCFF(n.CharStrings[e], f, n, o, r)
                    } else t.glyf && a._drawGlyf(e, t, r);
                    return { cmds: r.cmds, crds: r.crds }
                }, _drawGlyf: function (t, e, r) {
                    var s = e.glyf[t];
                    null == s && (s = e.glyf[t] = Typr.T.glyf._parseGlyf(e, t)), null != s && (s.noc > -1 ? Typr.U._simpleGlyph(s, r) : Typr.U._compoGlyph(s, e, r))
                }, _simpleGlyph: function (t, e) {
                    for (var r = Typr.U.P, s = 0; s < t.noc; s++) {
                        for (var n = 0 == s ? 0 : t.endPts[s - 1] + 1, a = t.endPts[s], h = n; h <= a; h++) {
                            var o = h == n ? a : h - 1, f = h == a ? n : h + 1, i = 1 & t.flags[h],
                                l = 1 & t.flags[o], c = 1 & t.flags[f], u = t.xs[h], d = t.ys[h];
                            if (h == n) if (i) {
                                if (!l) {
                                    r.MoveTo(e, u, d);
                                    continue
                                }
                                r.MoveTo(e, t.xs[o], t.ys[o])
                            } else l ? r.MoveTo(e, t.xs[o], t.ys[o]) : r.MoveTo(e, Math.floor(.5 * (t.xs[o] + u)), Math.floor(.5 * (t.ys[o] + d)));
                            i ? l && r.LineTo(e, u, d) : c ? r.qCurveTo(e, u, d, t.xs[f], t.ys[f]) : r.qCurveTo(e, u, d, Math.floor(.5 * (u + t.xs[f])), Math.floor(.5 * (d + t.ys[f])))
                        }
                        r.ClosePath(e)
                    }
                }, _compoGlyph: function (t, e, r) {
                    for (var s = 0; s < t.parts.length; s++) {
                        var n = { cmds: [], crds: [] }, a = t.parts[s];
                        Typr.U._drawGlyf(a.glyphIndex, e, n);
                        for (var h = a.m, o = 0; o < n.crds.length; o += 2) {
                            var f = n.crds[o], i = n.crds[o + 1];
                            r.crds.push(f * h.a + i * h.b + h.tx), r.crds.push(f * h.c + i * h.d + h.ty)
                        }
                        for (o = 0; o < n.cmds.length; o++) r.cmds.push(n.cmds[o])
                    }
                }, pathToSVG: function (t, e) {
                    var r = t.cmds, s = t.crds;
                    null == e && (e = 5);
                    for (var n = [], a = 0, h = { M: 2, L: 2, Q: 4, C: 6 }, o = 0; o < r.length; o++) {
                        var f = r[o], i = a + (h[f] ? h[f] : 0);
                        for (n.push(f); a < i;) {
                            var l = s[a++];
                            n.push(parseFloat(l.toFixed(e)) + (a == i ? "" : " "))
                        }
                    }
                    return n.join("")
                }, SVGToPath: function (t) {
                    var e = { cmds: [], crds: [] };
                    return Typr.U.SVG.svgToPath(t, e), { cmds: e.cmds, crds: e.crds }
                }, pathToContext: function (t, e) {
                    for (var r = 0, s = t.cmds, n = t.crds, a = 0; a < s.length; a++) {
                        var h = s[a];
                        "M" == h ? (e.moveTo(n[r], n[r + 1]), r += 2) : "L" == h ? (e.lineTo(n[r], n[r + 1]), r += 2) : "C" == h ? (e.bezierCurveTo(n[r], n[r + 1], n[r + 2], n[r + 3], n[r + 4], n[r + 5]), r += 6) : "Q" == h ? (e.quadraticCurveTo(n[r], n[r + 1], n[r + 2], n[r + 3]), r += 4) : "#" == h.charAt(0) ? (e.beginPath(), e.fillStyle = h) : "Z" == h ? e.closePath() : "X" == h && e.fill()
                    }
                }, P: {
                    MoveTo: function (t, e, r) {
                        t.cmds.push("M"), t.crds.push(e, r)
                    }, LineTo: function (t, e, r) {
                        t.cmds.push("L"), t.crds.push(e, r)
                    }, CurveTo: function (t, e, r, s, n, a, h) {
                        t.cmds.push("C"), t.crds.push(e, r, s, n, a, h)
                    }, qCurveTo: function (t, e, r, s, n) {
                        t.cmds.push("Q"), t.crds.push(e, r, s, n)
                    }, ClosePath: function (t) {
                        t.cmds.push("Z")
                    }
                }, _drawCFF: function (t, e, r, s, n) {
                    for (var a = e.stack, h = e.nStems, o = e.haveWidth, f = e.width, i = e.open, l = 0, c = e.x, u = e.y, d = 0, v = 0, p = 0, g = 0, m = 0, y = 0, T = 0, C = 0, b = 0, _ = 0, M = Typr.T.CFF, x = Typr.U.P, P = s.nominalWidthX, w = {
                        val: 0,
                        size: 0
                    }; l < t.length;) {
                        M.getCharString(t, l, w);
                        var S = w.val;
                        if (l += w.size, "o1" == S || "o18" == S) a.length % 2 != 0 && !o && (f = a.shift() + P), h += a.length >> 1, a.length = 0, o = !0; else if ("o3" == S || "o23" == S) {
                            a.length % 2 != 0 && !o && (f = a.shift() + P), h += a.length >> 1, a.length = 0, o = !0
                        } else if ("o4" == S) a.length > 1 && !o && (f = a.shift() + P, o = !0), i && x.ClosePath(n), u += a.pop(), x.MoveTo(n, c, u), i = !0; else if ("o5" == S) for (; a.length > 0;) c += a.shift(), u += a.shift(), x.LineTo(n, c, u); else if ("o6" == S || "o7" == S) for (var F = a.length, A = "o6" == S, U = 0; U < F; U++) {
                            var G = a.shift();
                            A ? c += G : u += G, A = !A, x.LineTo(n, c, u)
                        } else if ("o8" == S || "o24" == S) {
                            F = a.length;
                            for (var L = 0; L + 6 <= F;) d = c + a.shift(), v = u + a.shift(), p = d + a.shift(), g = v + a.shift(), c = p + a.shift(), u = g + a.shift(), x.CurveTo(n, d, v, p, g, c, u), L += 6;
                            "o24" == S && (c += a.shift(), u += a.shift(), x.LineTo(n, c, u))
                        } else {
                            if ("o11" == S) break;
                            if ("o1234" == S || "o1235" == S || "o1236" == S || "o1237" == S) "o1234" == S && (v = u, p = (d = c + a.shift()) + a.shift(), _ = g = v + a.shift(), y = g, C = u, c = (T = (m = (b = p + a.shift()) + a.shift()) + a.shift()) + a.shift(), x.CurveTo(n, d, v, p, g, b, _), x.CurveTo(n, m, y, T, C, c, u)), "o1235" == S && (d = c + a.shift(), v = u + a.shift(), p = d + a.shift(), g = v + a.shift(), b = p + a.shift(), _ = g + a.shift(), m = b + a.shift(), y = _ + a.shift(), T = m + a.shift(), C = y + a.shift(), c = T + a.shift(), u = C + a.shift(), a.shift(), x.CurveTo(n, d, v, p, g, b, _), x.CurveTo(n, m, y, T, C, c, u)), "o1236" == S && (d = c + a.shift(), v = u + a.shift(), p = d + a.shift(), _ = g = v + a.shift(), y = g, T = (m = (b = p + a.shift()) + a.shift()) + a.shift(), C = y + a.shift(), c = T + a.shift(), x.CurveTo(n, d, v, p, g, b, _), x.CurveTo(n, m, y, T, C, c, u)), "o1237" == S && (d = c + a.shift(), v = u + a.shift(), p = d + a.shift(), g = v + a.shift(), b = p + a.shift(), _ = g + a.shift(), m = b + a.shift(), y = _ + a.shift(), T = m + a.shift(), C = y + a.shift(), Math.abs(T - c) > Math.abs(C - u) ? c = T + a.shift() : u = C + a.shift(), x.CurveTo(n, d, v, p, g, b, _), x.CurveTo(n, m, y, T, C, c, u)); else if ("o14" == S) {
                                if (a.length > 0 && !o && (f = a.shift() + r.nominalWidthX, o = !0), 4 == a.length) {
                                    var k = a.shift(), O = a.shift(), V = a.shift(), W = a.shift(),
                                        B = M.glyphBySE(r, V), I = M.glyphBySE(r, W);
                                    Typr.U._drawCFF(r.CharStrings[B], e, r, s, n), e.x = k, e.y = O, Typr.U._drawCFF(r.CharStrings[I], e, r, s, n)
                                }
                                i && (x.ClosePath(n), i = !1)
                            } else if ("o19" == S || "o20" == S) {
                                a.length % 2 != 0 && !o && (f = a.shift() + P), h += a.length >> 1, a.length = 0, o = !0, l += h + 7 >> 3
                            } else if ("o21" == S) a.length > 2 && !o && (f = a.shift() + P, o = !0), u += a.pop(), c += a.pop(), i && x.ClosePath(n), x.MoveTo(n, c, u), i = !0; else if ("o22" == S) a.length > 1 && !o && (f = a.shift() + P, o = !0), c += a.pop(), i && x.ClosePath(n), x.MoveTo(n, c, u), i = !0; else if ("o25" == S) {
                                for (; a.length > 6;) c += a.shift(), u += a.shift(), x.LineTo(n, c, u);
                                d = c + a.shift(), v = u + a.shift(), p = d + a.shift(), g = v + a.shift(), c = p + a.shift(), u = g + a.shift(), x.CurveTo(n, d, v, p, g, c, u)
                            } else if ("o26" == S) for (a.length % 2 && (c += a.shift()); a.length > 0;) d = c, v = u + a.shift(), c = p = d + a.shift(), u = (g = v + a.shift()) + a.shift(), x.CurveTo(n, d, v, p, g, c, u); else if ("o27" == S) for (a.length % 2 && (u += a.shift()); a.length > 0;) v = u, p = (d = c + a.shift()) + a.shift(), g = v + a.shift(), c = p + a.shift(), u = g, x.CurveTo(n, d, v, p, g, c, u); else if ("o10" == S || "o29" == S) {
                                var q = "o10" == S ? s : r;
                                if (0 == a.length) console.log("error: empty stack"); else {
                                    var Q = a.pop(), X = q.Subrs[Q + q.Bias];
                                    e.x = c, e.y = u, e.nStems = h, e.haveWidth = o, e.width = f, e.open = i, Typr.U._drawCFF(X, e, r, s, n), c = e.x, u = e.y, h = e.nStems, o = e.haveWidth, f = e.width, i = e.open
                                }
                            } else if ("o30" == S || "o31" == S) {
                                var D = a.length, E = (L = 0, "o31" == S);
                                for (L += D - (F = -3 & D); L < F;) E ? (v = u, p = (d = c + a.shift()) + a.shift(), u = (g = v + a.shift()) + a.shift(), F - L == 5 ? (c = p + a.shift(), L++) : c = p, E = !1) : (d = c, v = u + a.shift(), p = d + a.shift(), g = v + a.shift(), c = p + a.shift(), F - L == 5 ? (u = g + a.shift(), L++) : u = g, E = !0), x.CurveTo(n, d, v, p, g, c, u), L += 4
                            } else {
                                if ("o" == (S + "").charAt(0)) throw console.log("Unknown operation: " + S, t), S;
                                a.push(S)
                            }
                        }
                    }
                    e.x = c, e.y = u, e.nStems = h, e.haveWidth = o, e.width = f, e.open = i
                }, SVG: function () {
                    var t = {
                        getScale: function (t) {
                            return Math.sqrt(Math.abs(t[0] * t[3] - t[1] * t[2]))
                        }, translate: function (e, r, s) {
                            t.concat(e, [1, 0, 0, 1, r, s])
                        }, rotate: function (e, r) {
                            t.concat(e, [Math.cos(r), -Math.sin(r), Math.sin(r), Math.cos(r), 0, 0])
                        }, scale: function (e, r, s) {
                            t.concat(e, [r, 0, 0, s, 0, 0])
                        }, concat: function (t, e) {
                            var r = t[0], s = t[1], n = t[2], a = t[3], h = t[4], o = t[5];
                            t[0] = r * e[0] + s * e[2], t[1] = r * e[1] + s * e[3], t[2] = n * e[0] + a * e[2], t[3] = n * e[1] + a * e[3], t[4] = h * e[0] + o * e[2] + e[4], t[5] = h * e[1] + o * e[3] + e[5]
                        }, invert: function (t) {
                            var e = t[0], r = t[1], s = t[2], n = t[3], a = t[4], h = t[5], o = e * n - r * s;
                            t[0] = n / o, t[1] = -r / o, t[2] = -s / o, t[3] = e / o, t[4] = (s * h - n * a) / o, t[5] = (r * a - e * h) / o
                        }, multPoint: function (t, e) {
                            var r = e[0], s = e[1];
                            return [r * t[0] + s * t[2] + t[4], r * t[1] + s * t[3] + t[5]]
                        }, multArray: function (t, e) {
                            for (var r = 0; r < e.length; r += 2) {
                                var s = e[r], n = e[r + 1];
                                e[r] = s * t[0] + n * t[2] + t[4], e[r + 1] = s * t[1] + n * t[3] + t[5]
                            }
                        }
                    };

                    function e(t, e, r) {
                        for (var s = [], n = 0, a = 0, h = 0; ;) {
                            var o = t.indexOf(e, a), f = t.indexOf(r, a);
                            if (-1 == o && -1 == f) break;
                            -1 == f || -1 != o && o < f ? (0 == h && (s.push(t.slice(n, o).trim()), n = o + 1), h++, a = o + 1) : (-1 == o || -1 != f && f < o) && (0 == --h && (s.push(t.slice(n, f).trim()), n = f + 1), a = f + 1)
                        }
                        return s
                    }

                    function r(r) {
                        for (var n = e(r, "(", ")"), a = [1, 0, 0, 1, 0, 0], h = 0; h < n.length; h += 2) {
                            var o = a;
                            a = s(n[h], n[h + 1]), t.concat(a, o)
                        }
                        return a
                    }

                    function s(e, r) {
                        for (var s = [1, 0, 0, 1, 0, 0], n = !0, a = 0; a < r.length; a++) {
                            var h = r.charAt(a);
                            "," == h || " " == h ? n = !0 : "." == h ? (n || (r = r.slice(0, a) + "," + r.slice(a), a++), n = !1) : "-" == h && a > 0 && "e" != r[a - 1] && (r = r.slice(0, a) + " " + r.slice(a), a++, n = !0)
                        }
                        if (r = r.split(/\s*[\s,]\s*/).map(parseFloat), "translate" == e) 1 == r.length ? t.translate(s, r[0], 0) : t.translate(s, r[0], r[1]); else if ("scale" == e) 1 == r.length ? t.scale(s, r[0], r[0]) : t.scale(s, r[0], r[1]); else if ("rotate" == e) {
                            var o = 0, f = 0;
                            1 != r.length && (o = r[1], f = r[2]), t.translate(s, -o, -f), t.rotate(s, -Math.PI * r[0] / 180), t.translate(s, o, f)
                        } else "matrix" == e ? s = r : console.log("unknown transform: ", e);
                        return s
                    }

                    function n(e, s, a) {
                        for (var o = 0; o < e.length; o++) {
                            var f = e[o], i = f.tagName, l = f.getAttribute("fill");
                            if (null == l && (l = a), "g" == i) {
                                var c = { crds: [], cmds: [] };
                                n(f.children, c, l);
                                var u = f.getAttribute("transform");
                                if (u) {
                                    var d = r(u);
                                    t.multArray(d, c.crds)
                                }
                                s.crds = s.crds.concat(c.crds), s.cmds = s.cmds.concat(c.cmds)
                            } else if ("path" == i || "circle" == i || "ellipse" == i) {
                                var v;
                                if (s.cmds.push(l || "#000000"), "path" == i && (v = f.getAttribute("d")), "circle" == i || "ellipse" == i) {
                                    for (var p = [0, 0, 0, 0], g = ["cx", "cy", "rx", "ry", "r"], m = 0; m < 5; m++) {
                                        var y = f.getAttribute(g[m]);
                                        y && (y = parseFloat(y), m < 4 ? p[m] = y : p[2] = p[3] = y)
                                    }
                                    var T = p[0], C = p[1], b = p[2], _ = p[3];
                                    v = ["M", T - b, C, "a", b, _, 0, 1, 0, 2 * b, 0, "a", b, _, 0, 1, 0, 2 * -b, 0].join(" ")
                                }
                                h(v, s), s.cmds.push("X")
                            } else "defs" == i || console.log(i, f)
                        }
                    }

                    function a(t, e, r) {
                        for (var s = e; s < t.length && "string" != typeof t[s];) s += r;
                        return (s - e) / r
                    }

                    function h(t, e) {
                        for (var r = function (t) {
                            for (var e = [], r = 0, s = !1, n = "", a = ""; r < t.length;) {
                                var h = t.charCodeAt(r), o = t.charAt(r);
                                r++;
                                var f = 48 <= h && h <= 57 || "." == o || "-" == o || "e" == o || "E" == o;
                                s ? "-" == o && "e" != a || "." == o && -1 != n.indexOf(".") ? (e.push(parseFloat(n)), n = o) : f ? n += o : (e.push(parseFloat(n)), "," != o && " " != o && e.push(o), s = !1) : f ? (n = o, s = !0) : "," != o && " " != o && e.push(o), a = o
                            }
                            return s && e.push(parseFloat(n)), e
                        }(t), s = 0, n = 0, h = 0, o = 0, f = 0, i = e.crds.length, l = {
                            M: 2,
                            L: 2,
                            H: 1,
                            V: 1,
                            T: 2,
                            S: 4,
                            A: 7,
                            Q: 4,
                            C: 6
                        }, c = e.cmds, u = e.crds; s < r.length;) {
                            var d = r[s];
                            s++;
                            var v = d.toUpperCase();
                            if ("Z" == v) c.push("Z"), n = o, h = f; else for (var p = a(r, s, l[v]), g = 0; g < p; g++) {
                                1 == g && "M" == v && (d = d == v ? "L" : "l", v = "L");
                                var m = 0, y = 0;
                                if (d != v && (m = n, y = h), "M" == v) n = m + r[s++], h = y + r[s++], c.push("M"), u.push(n, h), o = n, f = h; else if ("L" == v) n = m + r[s++], h = y + r[s++], c.push("L"), u.push(n, h); else if ("H" == v) n = m + r[s++], c.push("L"), u.push(n, h); else if ("V" == v) h = y + r[s++], c.push("L"), u.push(n, h); else if ("Q" == v) {
                                    var T = m + r[s++], C = y + r[s++], b = m + r[s++], _ = y + r[s++];
                                    c.push("Q"), u.push(T, C, b, _), n = b, h = _
                                } else if ("T" == v) {
                                    T = n + n - u[P = Math.max(u.length - 2, i)], C = h + h - u[P + 1], b = m + r[s++], _ = y + r[s++];
                                    c.push("Q"), u.push(T, C, b, _), n = b, h = _
                                } else if ("C" == v) {
                                    T = m + r[s++], C = y + r[s++], b = m + r[s++], _ = y + r[s++];
                                    var M = m + r[s++], x = y + r[s++];
                                    c.push("C"), u.push(T, C, b, _, M, x), n = M, h = x
                                } else if ("S" == v) {
                                    var P;
                                    T = n + n - u[P = Math.max(u.length - ("C" == c[c.length - 1] ? 4 : 2), i)], C = h + h - u[P + 1], b = m + r[s++], _ = y + r[s++], M = m + r[s++], x = y + r[s++];
                                    c.push("C"), u.push(T, C, b, _, M, x), n = M, h = x
                                } else if ("A" == v) {
                                    T = n, C = h;
                                    var w = r[s++], S = r[s++], F = r[s++] * (Math.PI / 180), A = r[s++],
                                        U = r[s++];
                                    b = m + r[s++], _ = y + r[s++];
                                    if (b == n && _ == h && 0 == w && 0 == S) continue;
                                    var G = (T - b) / 2, L = (C - _) / 2, k = Math.cos(F), O = Math.sin(F),
                                        V = k * G + O * L, W = -O * G + k * L, B = w * w, I = S * S, q = V * V,
                                        Q = W * W, X = (B * I - B * Q - I * q) / (B * Q + I * q),
                                        D = (A != U ? 1 : -1) * Math.sqrt(Math.max(X, 0)), E = D * (w * W) / S,
                                        H = S * V * -D / w, R = k * E - O * H + (T + b) / 2,
                                        Z = O * E + k * H + (C + _) / 2, z = function (t, e, r, s) {
                                            var n = (t * r + e * s) / (Math.sqrt(t * t + e * e) * Math.sqrt(r * r + s * s));
                                            return (t * s - e * r >= 0 ? 1 : -1) * Math.acos(Math.max(-1, Math.min(1, n)))
                                        }, N = (V - E) / w, j = (W - H) / S, J = z(1, 0, N, j),
                                        K = z(N, j, (-V - E) / w, (-W - H) / S);
                                    !function (t, e, r, s, n, a, h) {
                                        var o = function (t, e) {
                                            var r = Math.sin(e), s = Math.cos(e), n = (e = t[0], t[1]), a = t[2],
                                                h = t[3];
                                            t[0] = e * s + n * r, t[1] = -e * r + n * s, t[2] = a * s + h * r, t[3] = -a * r + h * s
                                        }, f = function (t, e) {
                                            for (var r = 0; r < e.length; r += 2) {
                                                var s = e[r], n = e[r + 1];
                                                e[r] = t[0] * s + t[2] * n + t[4], e[r + 1] = t[1] * s + t[3] * n + t[5]
                                            }
                                        }, i = function (t, e) {
                                            for (var r = 0; r < e.length; r++) t.push(e[r])
                                        };
                                        if (h) for (; a > n;) a -= 2 * Math.PI; else for (; a < n;) a += 2 * Math.PI;
                                        var l = (a - n) / 4, c = Math.cos(l / 2), u = -Math.sin(l / 2),
                                            d = (4 - c) / 3, v = 0 == u ? u : (1 - c) * (3 - c) / (3 * u),
                                            p = [d, v, d, -v, c, -u],
                                            g = { cmds: ["C", "C", "C", "C"], crds: p.slice(0) },
                                            m = [1, 0, 0, 1, 0, 0];
                                        o(m, -l);
                                        for (var y = 0; y < 3; y++) f(m, p), i(g.crds, p);
                                        o(m, l / 2 - n), m[0] *= s, m[1] *= s, m[2] *= s, m[3] *= s, m[4] = e, m[5] = r, f(m, g.crds), f(t.ctm, g.crds), function (t, e) {
                                            i(t.cmds, e.cmds), i(t.crds, e.crds)
                                        }(t.pth, g)
                                    }({
                                        pth: e,
                                        ctm: [w * k, w * O, -S * O, S * k, R, Z]
                                    }, 0, 0, 1, J, J + (K %= 2 * Math.PI), 0 == U), n = b, h = _
                                } else console.log("Unknown SVG command " + d)
                            }
                        }
                    }

                    return {
                        cssMap: function (t) {
                            for (var r = e(t, "{", "}"), s = {}, n = 0; n < r.length; n += 2) for (var a = r[n].split(","), h = 0; h < a.length; h++) {
                                var o = a[h].trim();
                                null == s[o] && (s[o] = ""), s[o] += r[n + 1]
                            }
                            return s
                        }, readTrnf: r, svgToPath: h, toPath: function (t) {
                            var e = { cmds: [], crds: [] };
                            if (null == t) return e;
                            var r = (new DOMParser).parseFromString(t, "image/svg+xml").getElementsByTagName("svg")[0],
                                s = r.getAttribute("viewBox");
                            s = s ? s.trim().split(" ").map(parseFloat) : [0, 0, 1e3, 1e3], n(r.children, e);
                            for (var a = 0; a < e.crds.length; a += 2) {
                                var h = e.crds[a], o = e.crds[a + 1];
                                h -= s[0], o = -(o -= s[1]), e.crds[a] = h, e.crds[a + 1] = o
                            }
                            return e
                        }
                    }
                }(), initHB: function (t, e) {
                    var r = function (t) {
                        var e = 0;
                        return 0 == (4294967168 & t) ? e = 1 : 0 == (4294965248 & t) ? e = 2 : 0 == (4294901760 & t) ? e = 3 : 0 == (4292870144 & t) && (e = 4), e
                    }, s = new window.TextEncoder("utf8");
                    fetch(t).then((function (t) {
                        return t.arrayBuffer()
                    })).then((function (t) {
                        return WebAssembly.instantiate(t)
                    })).then((function (t) {
                        console.log("HB ready");
                        var n = t.instance.exports, a = n.memory;
                        a.grow(700);
                        var h, o, f, i, l, c = new Uint8Array(a.buffer), u = new Uint32Array(a.buffer),
                            d = new Int32Array(a.buffer);
                        Typr.U.shapeHB = function (t, e, a) {
                            var v = t._data, p = t.name.postScriptName;
                            h != p && (null != o && (n.hb_blob_destroy(o), n.free(f), n.hb_face_destroy(i), n.hb_font_destroy(l)), f = n.malloc(v.byteLength), c.set(v, f), o = n.hb_blob_create(f, v.byteLength, 2, 0, 0), i = n.hb_face_create(o, 0), l = n.hb_font_create(i), h = p);
                            var g = n.hb_buffer_create(), m = s.encode(e), y = m.length, T = n.malloc(y);
                            c.set(m, T), n.hb_buffer_add_utf8(g, T, y, 0, y), n.free(T), n.hb_buffer_set_direction(g, a ? 4 : 5), n.hb_buffer_guess_segment_properties(g), n.hb_shape(l, g, 0, 0);
                            var C = function (t) {
                                for (var e = n.hb_buffer_get_length(t), r = [], s = n.hb_buffer_get_glyph_infos(t, 0) >>> 2, a = n.hb_buffer_get_glyph_positions(t, 0) >>> 2, h = 0; h < e; ++h) {
                                    var o = s + 5 * h, f = a + 5 * h;
                                    r.push({
                                        g: u[o + 0],
                                        cl: u[o + 2],
                                        ax: d[f + 0],
                                        ay: d[f + 1],
                                        dx: d[f + 2],
                                        dy: d[f + 3]
                                    })
                                }
                                return r
                            }(g);
                            n.hb_buffer_destroy(g);
                            var b = C.slice(0);
                            a || b.reverse();
                            for (var _ = 0, M = 0, x = 1; x < b.length; x++) {
                                for (var P = b[x], w = P.cl; ;) {
                                    var S = e.codePointAt(_), F = r(S);
                                    if (!(M + F <= w)) break;
                                    M += F, _ += S <= 65535 ? 1 : 2
                                }
                                P.cl = _
                            }
                            return C
                        }, e()
                    }))
                }
            };
            var $tip = $('style:contains(font-cxsecret)');
            if (!$tip.length) return;
            var font = $tip.text().match(/base64,([\w\W]+?)'/)[1];
            font = Typr.parse(this.base64ToUint8Array(font))[0];
            // const ttflist = ["ttf1", "ttf2", "ttf3"]
            // for (let i = 0; i < ttflist.length; i++) {
            //     try {
            //         var table = JSON.parse(GM_getResourceText(ttflist[i]));
            //         break;
            //     }
            //     catch (e) {
           //         continue;
            //     }
            // }

          var table = await utils.processTtfList(ttflist);
            if(!table){
                throw new Error('未找到字体文件');
            };

            var match = {};
            for (var i = 19968; i < 40870; i++) {
                $tip = Typr.U.codeToGlyph(font, i);
                if (!$tip) continue;
                $tip = Typr.U.glyphToPath(font, $tip);
                $tip = md5(JSON.stringify($tip)).slice(24);
                match[i] = table[$tip];
            }
            $('.font-cxsecret').html(function (index, html) {
                $.each(match, function (key, value) {
                    key = String.fromCharCode(key);
                    key = new RegExp(key, 'g');
                    value = String.fromCharCode(value);
                    html = html.replace(key, value);
                });
                return html;
            }).removeClass('font-cxsecret');
        },
        base64ToUint8Array(base64) {
            var data = window.atob(base64);
            var buffer = new Uint8Array(data.length);
            for (var i = 0; i < data.length; ++i) {
                buffer[i] = data.charCodeAt(i);
            }
            return buffer;
        },
        getQuestion: function (type, html = '') {
            let questionHtml, questionText, questionType, questionTypeId, optionHtml, tokenHtml, workType,
                optionText, index;
            switch (type) {
                case '1':
                    workType = "zj"
                    questionHtml = $(html).find(".clearfix .fontLabel");
                    questionText = utils.removeHtml(questionHtml[0].innerHTML).cl();
                    questionTypeId = $(html).find("input[name^=answertype]:eq(0)").val();
                    optionHtml = $(html).find('ul:eq(0) li .after');
                    tokenHtml = html.innerHTML;
                    optionText = [];
                    optionHtml.each(function (index, item) {
                        optionText.push(utils.removeHtml(item.innerHTML));
                    });
                    break;
                case '2':
                    workType = "zy"
                    questionHtml = $(html).find(".mark_name");
                    index = questionHtml[0].innerHTML.indexOf('</span>');
                    questionText = utils.removeHtml(questionHtml[0].innerHTML.substring(index + 7)).cl();
                    questionType = questionHtml[0].getElementsByTagName('span')[0].innerHTML.replace('(', '').replace(')', '').split(',')[0];
                    questionTypeId = $(html).find("input[name^=answertype]:eq(0)").val();
                    optionHtml = $(html).find(".answer_p");
                    tokenHtml = html.innerHTML;
                    optionText = [];
                    for (let i = 0; i < optionHtml.length; i++) {
                        optionText.push(utils.removeHtml(optionHtml[i].innerHTML));
                    }
                    break;
                case '3':
                    workType = "ks"
                    questionHtml = document.getElementsByClassName('mark_name colorDeep');
                    index = questionHtml[0].innerHTML.indexOf('</span>');
                    questionText = utils.removeHtml(questionHtml[0].innerHTML.substring(index + 7)).cl();
                    questionType = questionHtml[0].getElementsByTagName('span')[0].innerHTML.replace('(', '').replace(')', '').split(',')[0];
                    questionTypeId = $("input[name^=type]:eq(1)").val();
                    optionHtml = document.getElementsByClassName('answer_p');
                    tokenHtml = document.getElementsByClassName('mark_table')[0].innerHTML;
                    optionText = [];
                    for (let i = 0; i < optionHtml.length; i++) {
                        optionText.push(utils.removeHtml(optionHtml[i].innerHTML));
                    }
                    if (!defaultConfig.hidden) {
                        let layx_content = document.getElementById('layx_content');
                        layx_content.innerHTML = '<div class="question_content"><span class="question_type">' + questionType + '</span>' + questionText + '</div><div class="option"></div><div class="answer">答案正在获取中</div>';
                        let option = document.getElementsByClassName('option')[0];
                        for (let i = 0; i < optionText.length; i++) {
                            option.innerHTML += '<div class="option_item">' + String.fromCharCode(65 + i) + '、' + optionText[i] + '</div>';
                        }
                        let answer = document.getElementsByClassName('answer')[0];
                        answer.innerHTML = '答案正在获取中';
                    }
                    break;
            }
            return {
                "question": questionText,
                "options": optionText,
                "type": questionTypeId,
                "questionData": tokenHtml,
                "workType": workType
            }
        },
        answerFormat: function (answer) {
            //如果是数组
            if (answer instanceof Array) {
                //去除null
                answer = answer.filter(function (item) {
                    return item !== null;
                });
                for (let i = 0; i < answer.length; i++) {
                    answer[i] = utils.removeHtml(answer[i]);
                }
            } else if (typeof answer === 'string') {
                answer = answer.cl();
            }
            return answer;
        },
        setAnswer: function (type, options, answer) {
            answer = this.answerFormat(answer);
            switch (type) {
                case '0':// 单选
                case '1':// 多选
                    this.clear();
                    var matchArr = utils.matchIndex(options, answer);
                    for (var i = 0; i < matchArr.length; i++) {
                        $(".answerBg").eq(matchArr[i]).click();
                        $(".option_item").eq(matchArr[i]).css("color", "green").css("font-weight", "bold");
                    }
                    return matchArr.length > 0;
                case '3':// 判断
                    answer = answer[0];
                    answer && this.clear();
                    $(".answerBg").each(function () {
                        if ($(this).find(".num_option").attr("data") == "true") {
                            answer.match(/(^|,)(True|true|正确|是|对|√|T|ri)(,|$)/) && $(this).click()
                        } else {
                            answer.match(/(^|,)(False|false|错误|否|错|×|F|wr)(,|$)/) && $(this).click()
                        }
                    });
                    return ($(".answerBg").find(".check_answer").length > 0 || $(".answerBg").find(".check_answer_dx").length > 0);
                case '2':// 填空
                case '9':// 程序填空
                case '4':// 简答
                case '5':
                case '6':
                case '7':
                    var blankNum = $(".answerBg, .textDIV, .eidtDiv").find('textarea').length;
                    if (blankNum != answer.length) {
                        return false;
                    }
                    this.clear();
                    $(".answerBg, .textDIV, .eidtDiv").find('textarea').each(function (index) {
                        _self.UE.getEditor($(this).attr('name')).ready(function () {
                            this.setContent(answer[index].replace(/第.空:/g, ""));
                        });
                    });
                    return true;
                default:
                    return false;
            }
        },
        setWorkAnswer: function (type, options, answer, inx) {
            answer = this.answerFormat(answer);
            let item = $(".questionLi").eq(inx);
            switch (type) {
                case '0':// 单选
                case '1':// 多选
                    this.clearCurrent(item);
                    var matchArr = utils.matchIndex(options, answer);
                    for (var i = 0; i < matchArr.length; i++) {
                        item.find(".answerBg").eq(matchArr[i]).click();
                        $(".option_item").eq(matchArr[i]).css("color", "green").css("font-weight", "bold");
                    }
                    return matchArr.length > 0 && answer;
                case '3':// 判断
                    answer = answer[0];
                    answer && this.clearCurrent(item);
                    item.find(".answerBg").each(function () {
                        if ($(this).find(".num_option").attr("data") == "true") {
                            answer.match(/(^|,)(True|true|正确|是|对|√|T|ri)(,|$)/) && $(this).click()
                        } else {
                            answer.match(/(^|,)(False|false|错误|否|错|×|F|wr)(,|$)/) && $(this).click()
                        }
                    });
                    return ($(".answerBg").find(".check_answer").length > 0 || $(".answerBg").find(".check_answer_dx").length > 0) && answer;
                case '2':// 填空
                case '9':// 程序填空
                case '4':// 简答
                case '5':
                case '6':
                case '7':
                    var blankNum = item.find('textarea').length;
                    if (blankNum != answer.length) {
                        return false;
                    }
                    page.clearCurrent(item);
                    item.find('textarea').each(function (index) {
                        _self.UE.getEditor($(this).attr('name')).ready(function () {
                            this.setContent(answer[index]);
                        });
                    });
                    return answer;
                default:
                    return false;
            }
        },
        setChapterAnswer: function (type, options, answer, inx) {
            if (location.href.includes('mooc2=1')) {
                return this.setChapterAnswerNew(type, options, answer, inx);
            }
            answer = this.answerFormat(answer);
            let item = $(".TiMu").eq(inx);
            switch (type) {
                case '0':// 单选
                case '1':// 多选
                    page.clearCurrent(item);
                    var matchArr = utils.matchIndex(options, answer);
                    if (matchArr.length > 0) {
                        for (var i = 0; i < matchArr.length; i++) {
                            item.find('ul:eq(0) li :radio,:checkbox,textarea').eq(matchArr[i]).click();
                            $(".option_item").eq(matchArr[i]).css("color", "green").css("font-weight", "bold");
                        }
                        return answer;
                    } else {
                        matchArr = utils.fuzzyMatchIndex(options, answer);
                        for (var i = 0; i < matchArr.length; i++) {
                            item.find('ul:eq(0) li :radio,:checkbox,textarea').eq(matchArr[i]).click();
                            $(".option_item").eq(matchArr[i]).css("color", "green").css("font-weight", "bold");
                        }
                        if (!matchArr.length) {
                            var random = Math.floor(Math.random() * options.length);
                            item.find('ul:eq(0) li :radio,:checkbox,textarea').eq(random).click();
                            return false;
                        }
                        return matchArr.length > 0;
                    }
                case '3':// 判断
                    answer = answer[0];
                    answer && page.clearCurrent(item);
                    item.find('ul:eq(0) li :radio,:checkbox,textarea').each(function () {
                        if ($(this).val() == "true") {
                            answer.match(/(^|,)(True|true|正确|是|对|√|T|ri)(,|$)/) && $(this).click()
                        } else {
                            answer.match(/(^|,)(False|false|错误|否|错|×|F|wr)(,|$)/) && $(this).click()
                        }
                    });
                    let isCheck = item.find('ul:eq(0) li :radio,:checkbox,textarea').is(':checked');
                    if (!isCheck) {
                        var random = Math.floor(Math.random() * 2);
                        item.find('ul:eq(0) li :radio,:checkbox,textarea').eq(random).click();
                    }
                    return isCheck && answer;
                case '2':// 填空
                case '9':// 程序填空
                case '4':// 简答
                case '5':
                case '6':
                case '7':
                    var blankNum = item.find('textarea').length;
                    if (blankNum != answer.length) {
                        return false;
                    }
                    page.clearCurrent(item);
                    item.find('textarea').each(function (index) {
                        _self.UE.getEditor($(this).attr('name')).ready(function () {
                            this.setContent(answer[index]);
                        });
                    });
                    return answer;
                default:
                    return false;
            }
        },
        setChapterAnswerNew: function (type, options, answer, inx) {
            answer = this.answerFormat(answer);
            let item = $(".TiMu").eq(inx);
            switch (type) {
                case '0':// 单选
                case '1':// 多选
                    page.clearCurrentNew(item);
                    var matchArr = utils.matchIndex(options, answer);
                    if (matchArr.length > 0) {
                        for (var i = 0; i < matchArr.length; i++) {
                            item.find('ul:eq(0) li,:checkbox,textarea').eq(matchArr[i]).click();
                            $(".option_item").eq(matchArr[i]).css("color", "green").css("font-weight", "bold");
                        }
                        return answer;
                    } else {
                        matchArr = utils.fuzzyMatchIndex(options, answer);
                        for (var i = 0; i < matchArr.length; i++) {
                            item.find('ul:eq(0) li,:checkbox,textarea').eq(matchArr[i]).click();
                            $(".option_item").eq(matchArr[i]).css("color", "green").css("font-weight", "bold");
                        }
                        if (!matchArr.length) {
                            var random = Math.floor(Math.random() * options.length);
                            item.find('ul:eq(0) li,:checkbox,textarea').eq(random).click();
                            return false;
                        }
                        return matchArr.length > 0;
                    }
                case '3':// 判断
                    answer = answer[0];
                    answer && page.clearCurrentNew(item);
                    item.find('ul:eq(0) li,:checkbox,textarea').each(function () {
                        if ($(this).attr('aria-label').includes('对')) {
                            answer.match(/(^|,)(True|true|正确|是|对|√|T|ri)(,|$)/) && $(this).click()
                        } else {
                            answer.match(/(^|,)(False|false|错误|否|错|×|F|wr)(,|$)/) && $(this).click()
                        }
                    });
                    // let isCheck = item.find('ul:eq(0) li,:checkbox,textarea').is(':checked');
                    let isCheck = item.find('ul:eq(0) li,:checkbox,textarea').filter(function () {
                        return $(this).attr('aria-checked') == 'true';
                    }).length > 0;
                    if (!isCheck) {
                        var random = Math.floor(Math.random() * 2);
                        item.find('ul:eq(0) li,:checkbox,textarea').eq(random).click();
                    }
                    return isCheck && answer;
                case '2':// 填空
                case '9':// 程序填空
                case '4':// 简答
                case '5':
                case '6':
                case '7':
                    var blankNum = item.find('textarea').length;
                    if (blankNum != answer.length) {
                        return false;
                    }
                    page.clearCurrent(item);
                    item.find('textarea').each(function (index) {
                        _self.UE.getEditor($(this).attr('name')).ready(function () {
                            this.setContent(answer[index]);
                        });
                    });
                    return answer;
                default:
                    return false;
            }
        },
        randomChapterAnswer: function (type, options, inx) {
            let item = $(".TiMu").eq(inx);
            switch (type) {
                case '0':// 单选
                case '1':// 多选
                    var random = Math.floor(Math.random() * options.length);
                    item.find('ul:eq(0) li :radio,:checkbox,textarea').eq(random).click();
                    return true;
                case '3':// 判断
                    var random = Math.floor(Math.random() * 2);
                    item.find('ul:eq(0) li :radio,:checkbox,textarea').eq(random).click();
                    return true;
                default:
                    return false;
            }
        }
        ,
        startAsk: async function (data) {
            const answer = document.getElementsByClassName('answer')[0];
            let answerArr = await page.requestMerge(data);
            let validAnswer = answerArr.find(item => Array.isArray(item) && item.length > 0 && page.setAnswer(data.type, data.options, item));
            if (!validAnswer && defaultConfig.freeFirst) {
                answerArr = await page.requestMerge(data, 1);
                validAnswer = answerArr.find(item => Array.isArray(item) && item.length > 0 && page.setAnswer(data.type, data.options, item));
            }
            if (validAnswer) {
                answer.innerHTML = '答案：<br />' + validAnswer.join('<br />');
                answer.style.color = 'green';
                this.layx_status_msg(`已答题,等待切换 剩余次数:${reqUrl.num || '暂未获取'}`);
            } else {
                answer.innerHTML = answerArr.find(item => !Array.isArray(item) && item.length > 0 && item) || '暂无答案';
                this.layx_status_msg("答案匹配失败,等待切换");
            }
            await utils.sleep(defaultConfig.interval);
            defaultConfig.autoSwitch && $('.nextDiv .jb_btn:contains("下一题")').click();
            !$('.nextDiv .jb_btn:contains("下一题")') && this.layx_status_msg("答题已完成");
        },
        startWork: async function () {
            let layx_content = $("#layx_content"), questionList = $(".questionLi"), tableHTML = `
            <table id="qlist" class="table table-bordered">
                <thead>
                <tr>
                    <th style="width: 10%">题号</th>
                    <th style="width: 60%">题目</th>
                    <th style="width: 30%">答案</th>
                </tr>
                </thead>
                <tbody></tbody>
            </table>
            `;
            layx_content.html(tableHTML);

            async function startWorkTask(workinx) {
                let data = page.getQuestion("2", questionList[workinx]);
                let tr = $('<tr>').css("border-bottom", "1px solid #ddd");
                let td1 = $('<td>').html(`<a href="javascript:void(0)" onclick="document.getElementsByClassName('questionLi')[${workinx}].scrollIntoView();">${parseInt(workinx) + 1}</a>`);
                let td2 = $('<td>').html(`<a href="javascript:void(0)" onclick="document.getElementsByClassName('questionLi')[${workinx}].scrollIntoView();">${data.question}</a>`);
                let td3 = $('<td>');
                tr.append(td1, td2, td3);
                let answerArr = await page.requestMerge(data);
                let validAnswer = answerArr.find(item => Array.isArray(item) && item.length > 0 && page.setWorkAnswer(data.type, data.options, item, workinx));
                if (!validAnswer && defaultConfig.freeFirst) {
                    answerArr = await page.requestMerge(data, 1);
                    validAnswer = answerArr.find(item => Array.isArray(item) && item.length > 0 && page.setWorkAnswer(data.type, data.options, item, workinx));
                }
                if (validAnswer) {
                    td3.html(validAnswer.join('<br />'));
                    tr.css("color", "green");
                    defaultConfig.succ++;
                } else {
                    let answerText = answerArr.find(item => !Array.isArray(item) && item.length > 0 && item) || '暂无答案';

                    // 检查是否包含"点我购买"，如果包含则替换为激活按钮
                    if (answerText.includes('点我购买')) {
                        let modifiedText = answerText.replace('点我购买', '');
                        td3.html(modifiedText);
                        let activateBtn = $('<button>').html('💳 激活付费题库').css({
                            'background': '#52c41a',
                            'color': 'white',
                            'border': 'none',
                            'border-radius': '4px',
                            'padding': '6px 12px',
                            'font-size': '12px',
                            'cursor': 'pointer',
                            'margin-left': '10px'
                        }).click(function () {
                            page.showActivationDialog();
                        });
                        td3.append(activateBtn);
                        let aBtn = $('<a>').html('重试').css({
                            'color': 'blue',
                            'margin-left': '10px',
                            'cursor': 'pointer'
                        }).click(function () {
                            startWorkTask(workinx);
                        });
                        td3.append(aBtn);
                    } else {
                        td3.html(answerText);
                        let aBtn = $('<a>').html('重试').css({
                            'color': 'blue',
                            'margin-left': '10px',
                            'cursor': 'pointer'
                        }).click(function () {
                            startWorkTask(workinx);
                        });
                        td3.append(aBtn);
                    }
                    tr.css("color", "red");
                    defaultConfig.fail++;
                    $(".layx_status").html("答案匹配失败,等待切换");
                }
                validAnswer && page.layx_status_msg(`答题进度:${parseInt(workinx) + 1}/${questionList.length} 成功${defaultConfig.succ}题 失败${defaultConfig.fail}题,剩余次数:${reqUrl.num || '暂未使用'}`);
                if ($("#qlist tbody tr").length > workinx) {
                    $("#qlist tbody tr").eq(workinx).replaceWith(tr);
                } else {
                    $("#qlist tbody").append(tr);
                }
            }

            for (let i = 0; i < questionList.length; i++) {
                await startWorkTask(i);
                await utils.sleep(defaultConfig.interval);
            }
            this.layx_status_msg(`答题完成 - 已答${defaultConfig.succ}题,未答${questionList.length - defaultConfig.succ}题,剩余次数:${reqUrl.num || '暂未使用'}`);
        },
        startChapter: async function () {
            let layx_content = $("#layx_content"), questionList = $(".TiMu"), tableHTML = `
            <table id="qlist" class="table table-bordered">
                <thead>
                <tr>
                    <th style="width: 10%">题号</th>
                    <th style="width: 60%">题目</th>
                    <th style="width: 30%">答案</th>
                </tr>
                </thead>
                <tbody></tbody>
            </table>
            `;
            layx_content.html(tableHTML);
            async function startChapterTask(workinx) {
                let data = page.getQuestion("1", questionList[workinx]);
                let tr = $('<tr>').css("border-bottom", "1px solid #ddd");
                let td1 = $('<td>').html(`<a href="javascript:void(0)" onclick="document.getElementsByClassName('TiMu')[${workinx}].scrollIntoView();">${parseInt(workinx) + 1}</a>`);
                let td2 = $('<td>').html(`<a href="javascript:void(0)" onclick="document.getElementsByClassName('TiMu')[${workinx}].scrollIntoView();">${data.question}</a>`);
                let td3 = $('<td>');
                tr.append(td1, td2, td3);
                let answerArr = await page.requestMerge(data);
                log(answerArr);
                let validAnswer = answerArr.find(item => Array.isArray(item) && item.length > 0 && page.setChapterAnswer(data.type, data.options, item, workinx));

                if (!validAnswer && defaultConfig.freeFirst) {
                    log("开始请求");
                    answerArr = await page.requestMerge(data, 1);
                    log(answerArr);

                    validAnswer = answerArr.find(item => Array.isArray(item) && item.length > 0 && page.setChapterAnswer(data.type, data.options, item, workinx));
                }
                log(validAnswer);
                if (validAnswer) {
                    td3.html(validAnswer.join('<br />'));
                    tr.css("color", "green");
                    defaultConfig.succ++;
                } else {
                    let answerText = answerArr.find(item => !Array.isArray(item) && item.length > 0 && item) || '暂无答案';

                    // 检查是否包含"点我购买"，如果包含则替换为激活按钮
                    if (answerText.includes('点我购买')) {
                        let modifiedText = answerText.replace('点我购买', '');
                        td3.html(modifiedText);
                        let activateBtn = $('<button>').html('💳 激活付费题库').css({
                            'background': '#52c41a',
                            'color': 'white',
                            'border': 'none',
                            'border-radius': '4px',
                            'padding': '6px 12px',
                            'font-size': '12px',
                            'cursor': 'pointer',
                            'margin-left': '10px'
                        }).click(function () {
                            page.showActivationDialog();
                        });
                        td3.append(activateBtn);
                        let aBtn = $('<a>').html('重试').css({
                            'color': 'blue',
                            'margin-left': '10px',
                            'cursor': 'pointer'
                        }).click(function () {
                            startChapterTask(workinx);
                        });
                        td3.append(aBtn);
                    } else {
                        td3.html(answerText);
                        let aBtn = $('<a>').html('重试').css({
                            'color': 'blue',
                            'margin-left': '10px',
                            'cursor': 'pointer'
                        }).click(function () {
                            startChapterTask(workinx);
                        });
                        td3.append(aBtn);
                    }
                    tr.css("color", "red");
                    $(".layx_status").html("答案匹配失败,等待切换");
                }
                validAnswer && page.layx_status_msg(`答题进度:${parseInt(workinx) + 1}/${questionList.length} 成功${defaultConfig.succ}题 失败${defaultConfig.fail}题,剩余次数:${reqUrl.num || '暂未使用'}`);
                if ($("#qlist tbody tr").length > workinx) {
                    $("#qlist tbody tr").eq(workinx).replaceWith(tr);
                } else {
                    $("#qlist tbody").append(tr);
                }
            }

            for (let i = 0; i < questionList.length; i++) {
                await startChapterTask(i);
                await utils.sleep(defaultConfig.interval);
            }
            // 生成详细的答题统计报告
            let successRate = (defaultConfig.succ / questionList.length * 100).toFixed(1);
            let failedCount = questionList.length - defaultConfig.succ;

            this.layx_log("", "info"); // 空行分隔
            this.layx_log("📝 ===== 答题完成统计 =====", "success");
            this.layx_log(`📊 答题统计: 总题数${questionList.length}题`, "info");
            this.layx_log(`✅ 成功答题: ${defaultConfig.succ}题`, "success");
            this.layx_log(`❌ 未找到答案: ${failedCount}题`, failedCount > 0 ? "error" : "info");
            this.layx_log(`🎯 答题成功率: ${successRate}%`, successRate >= 80 ? "success" : successRate >= 60 ? "notice" : "error");
            this.layx_log(`💰 题库使用: 剩余次数${reqUrl.num || '无限制'}`, "notice");

            let z = defaultConfig.succ / questionList.length;
            let submitThreshold = defaultConfig.autoSubmitRate * 100;

            if (defaultConfig.autoSubmit) {
                this.layx_log(`🚀 自动提交已启用，要求正确率≥${submitThreshold.toFixed(0)}%`, "notice");
                setInterval(function () {
                    window.parent.postMessage(utils.notify("error", "提交超时，已暂时关闭"), '*');
                }, 200000);

                if (z >= defaultConfig.autoSubmitRate) {
                    this.layx_log(`🎉 正确率${successRate}%已达标！准备自动提交...`, "success");
                    this.layx_status_msg(`✅ 正确率达标(${successRate}%)，3秒后自动提交`);
                    await utils.sleep(defaultConfig.interval);
                    btnBlueSubmit();
                    await utils.sleep(defaultConfig.interval);
                    submitCheckTimes();
                    this.layx_log(`📤 作业已自动提交完成！`, "success");
                } else {
                    this.layx_log(`⚠️ 正确率${successRate}%低于要求的${submitThreshold.toFixed(0)}%`, "error");
                    this.layx_status_msg(`❌ 正确率不足${submitThreshold.toFixed(0)}%，仅保存答案`);
                    noSubmit();
                    window.alert = function (e) {
                        log(e);
                    };
                    this.layx_log(`💾 答案已保存，请人工检查后手动提交`, "notice");
                    window.parent.postMessage(utils.notify("error", "正确率不够，暂存"), '*');
                }
            } else {
                this.layx_log(`📋 自动提交已关闭，请手动检查并提交作业`, "notice");
            }
            this.layx_log("🔚 ===== 答题报告结束 =====", "success");
        },
        getScore: async function () {
            let questionList = $(".TiMu").map(function (index, element) {
                try {
                    let questionHtml, questionText, questionType, questionAnswer, questionOption = [],
                        questionAnalysis = "";
                    questionHtml = $(element).find(".Zy_TItle .clearfix");
                    questionText = utils.removeHtml(questionHtml[0].innerHTML);
                    questionType = questionText.match(/^\【(.+?)\】/)[1];
                    questionText = questionText.replace(questionText.match(/^\【(.+?)\】/)[0], "")
                    switch (questionType) {
                        case '判断题':
                            questionAnalysis = utils.removeHtml($(element).find(".Py_addpy:eq(0)").html() || "");
                            if (element.innerHTML.includes("正确答案")) {
                                questionAnswer = utils.removeHtml($(element).find(".Py_answer.clearfix>span").html());
                                questionAnswer = questionAnswer.replace("正确答案：", "").trim();
                            } else {
                                let temp = $(element).find(".Py_answer.clearfix").html();
                                const match = temp.match(/^(.*?)(?=<i class="fr (dui|cuo)".*><\/i>)/s);
                                const result = match ? match[1] : null;
                                questionAnswer = utils.removeHtml(result);
                                questionAnswer = questionAnswer.replace("我的答案：", "").trim();
                                if ($(element).find(".fr.dui").length == 0) {
                                    if (questionAnswer.includes("对") || questionAnswer.includes("√") || questionAnswer.includes("正确")) {
                                        questionAnswer = "错误";
                                    }
                                    else if (questionAnswer.includes("错") || questionAnswer.includes("×") || questionAnswer.includes("错误")) {
                                        questionAnswer = "正确";
                                    } else {
                                        return null;
                                    }

                                }
                            }
                            if (questionAnswer.includes("对") || questionAnswer.includes("√") || questionAnswer.includes("正确")) {
                                questionAnswer = "正确";
                            }
                            else if (questionAnswer.includes("错") || questionAnswer.includes("×") || questionAnswer.includes("错误")) {
                                questionAnswer = "错误";
                            } else {
                                return null;
                            }

                            break
                        case '填空题':

                            questionAnswer = $("span.font14", $(element)).map(function (inx, item) {
                                return utils.removeHtml($(item).html()).replace(/^第.空：/, "").trim();
                            }).get();

                            if (questionAnswer.length == 0) {
                                questionAnswer = $(element).find(".Py_answer.clearfix>div>div[class='font14']");
                                if (questionAnswer.length = $(element).find(".Py_answer.clearfix>div>div[class='font14']>>.fr.dui").length) {
                                    questionAnswer = questionAnswer.map(function (inx, item) {
                                        return utils.removeHtml($(item).html()).replace(/^第.空：/, "").trim();
                                    }).get();
                                } else {
                                    return null;
                                }
                            }
                            break;
                        default:
                            return null;
                    }
                    return {
                        "question": questionText,
                        "options": questionOption,
                        "type": defaultConfig.types[questionType],
                        "answer": questionAnswer,
                    }
                } catch (e) {
                    log(e)
                    return null;
                }
            }).get();
            questionList.length && ServerApi.defaultRequest("save1", "post", {
                "questionList": questionList,
                "url": location.href,
            }, reqUrl.headers).then(function (res) {
                log(res.responseText);
            });
        },
        getScoreNew: async function () {
            let questionList = $(".TiMu").map(function (index, element) {
                try {
                    let questionHtml, questionText, questionType, questionAnswer, questionOption = [],
                        questionAnalysis = "";
                    questionHtml = $(element).find(".Zy_TItle .clearfix");
                    questionText = utils.removeHtml(questionHtml[0].innerHTML);
                    questionType = questionText.match(/^\【(.+?)\】/)[1];
                    questionText = questionText.replace(questionText.match(/^\【(.+?)\】/)[0], "")
                    switch (questionType) {
                        case '判断题':
                            questionAnalysis = utils.removeHtml($(element).find(".Py_addpy:eq(0)").html() || "");
                            questionAnswer = utils.removeHtml($(element).find(".fl.answerCon").html());
                            let [marking_dui, marking_cuo] = [".marking_dui", ".marking_cuo"].map(selector => $(element).find(selector).length);

                            if (marking_dui + marking_cuo === 0) {
                                return null;
                            }
                            if (questionAnswer.includes("对") || questionAnswer.includes("正确") || questionAnswer.includes("√")) {
                                questionAnswer = "正确";
                            } else if (questionAnswer.includes("错") || questionAnswer.includes("错误") || questionAnswer.includes("×")) {
                                questionAnswer = "错误";
                            } else {
                                return null;
                            }
                            if (marking_dui === 0 && marking_cuo !== 0) {
                                questionAnswer = questionAnswer === "正确" ? "错误" : "正确";
                            }
                            break
                        case '填空题':
                            let correctAnswerBx = $(element).find(".correctAnswerBx.marBot16");
                            if (correctAnswerBx.length > 0) {
                                questionAnswer = $(".correctAnswer.marTop16", $(element)).map(function (inx, item) {
                                    return utils.removeHtml($(item).html()).replace(/^第.空：/, "").trim();
                                }).get();
                                log(questionAnswer);
                            } else {
                                questionAnswer = $(".myAnswer.marTop16", $(element)).map(function (inx, item) {
                                    return utils.removeHtml($(item).html()).replace(/^第.空：/, "").trim();
                                }).get();
                                let marking_dui = $(element).find(".marking_dui").length;
                                if (marking_dui !== questionAnswer.length) {
                                    return null;
                                }
                            }
                            break;
                        default:
                            return null;
                    }
                    return {
                        "question": questionText,
                        "options": questionOption,
                        "type": defaultConfig.types[questionType],
                        "answer": questionAnswer,
                    }
                } catch (e) {
                    log(e)
                    return null;
                }
            }).get();
            questionList.length && ServerApi.defaultRequest("save1", "post", {
                "questionList": questionList,
                "url": location.href,
            }, reqUrl.headers).then(function (res) {
                log(res.responseText);
            });

        },
        getScore2: async function (data) {
            log(data);
            if (data.url == undefined) {
                return;
            }
            let url = data.url
            GM_xmlhttpRequest({
                method: "GET",
                url: url,
                headers: {},
                onload: function (response) {
                    let html = response.responseText;
                    let document1, questionList, questionListHtml;
                    document1 = new DOMParser().parseFromString(html, "text/html");
                    questionList = document1.getElementsByClassName('Py-mian1');
                    questionListHtml = [];
                    for (let i = 0; i < questionList.length; i++) {
                        try {
                            if (i === 0) {
                                continue;
                            }
                            let questionTitle = utils.removeHtml(questionList[i].getElementsByClassName('Py-m1-title')[0].innerHTML);
                            let questionType = questionTitle.match(/\[(.*?)\]/)[1];
                            if (questionType === "单选题" || questionType === "多选题") {
                                questionTitle = questionTitle.replace(/[0-9]{1,3}.\s/ig, '').replace(/(^\s*)|(\s*$)/g, "").replace(/^【.*?】\s*/, '').replace(/\[(.*?)\]\s*/, '').replace(/\s*（\d+\.\d+分）$/, '');
                                let optionHtml = $(questionList[i]).find('ul.answerList li.clearfix');
                                let optionText = [];
                                optionHtml.each(function (index, item) {
                                    let abcd = String.fromCharCode(65 + index) + ".";
                                    let optionTemp = utils.removeHtml(item.innerHTML);
                                    if (optionTemp.indexOf(abcd) == 0) {
                                        optionTemp = optionTemp.replace(abcd, "").trim();
                                    }
                                    optionText.push(optionTemp);
                                });
                                questionListHtml.push({
                                    "question": questionTitle,
                                    "type": defaultConfig.types[questionType],
                                    "options": optionText,
                                    "questionData": questionList[i].innerHTML
                                })
                            }
                        } catch (e) {
                            continue;
                        }
                    }

                    let postData = {
                        "questionList": questionListHtml,
                        "url": url
                    }
                    ServerApi.defaultRequest(data.url1, "post", postData, data.headers).then(function (res) {
                        log(res.responseText);
                    });
                }
            });
        },
        getScore3: async function () {
            let questionList = $(".marBom60.questionLi").map(function (index, element) {
                let questionHtml, questionText, questionType, questionAnswer, questionOption = [],
                    questionAnalysis = "", $colorGreen, $colorDeep, totalScore;
                questionHtml = $(element).find("h3");
                questionType = questionHtml.find('span[class="colorShallow"]');
                questionText = utils.removeHtml(questionHtml[0].outerHTML.split(questionType[0].outerHTML)[1]);
                questionType = utils.removeHtml(questionType.html()).match(/^\((.+?)\)/)[1];
                totalScore = Number(utils.removeHtml($(element).find(".totalScore.fr>i").html()));
                switch (questionType) {
                    case '判断题':
                        $colorGreen = $(element).find(".colorGreen");
                        $colorDeep = $(element).find("span.colorDeep");
                        questionAnswer = ($colorGreen.length > 0) ? $colorGreen.text().replace("正确答案:", "").trim() :
                            ($colorDeep.hasClass("marking_dui")) ? $colorDeep.text().replace("我的答案:", "").trim() :
                                totalScore > 0 ? $colorDeep.text().replace("我的答案:", "").trim() :
                                    null;

                        questionAnswer = (["√", "正确", "对"].includes(questionAnswer)) ? "正确" :
                            (["×", "错误", "错"].includes(questionAnswer)) ? "错误" :
                                null;
                        break;
                    case '填空题':
                        $colorGreen = $(element).find("dl.colorGreen");
                        $colorDeep = $(element).find(".mark_fill.colorDeep>dd");
                        questionAnswer = ($colorGreen.length > 0) ? $colorGreen.find("dd").map((index, item) =>
                            utils.removeHtml($(item).html()).replace(/^\(.\)/, "").trim()
                        ).get() :
                            ($colorDeep.length === $colorDeep.find(".marking_dui").length) ? $colorDeep.find(".answer_span").map((index, item) =>
                                utils.removeHtml($(item).html()).replace(/^\(.\)/, "").trim()
                            ).get() :
                                null;
                        break;
                    default:
                        return null;
                }
                return {
                    "question": questionText,
                    "options": questionOption,
                    "type": defaultConfig.types[questionType],
                    "answer": questionAnswer,
                }
            }).get();
            questionList.length && ServerApi.defaultRequest("save1", "post", {
                "questionList": questionList,
                "url": location.href,
            }, reqUrl.headers).then(function (res) {
                log(res.responseText);
            });
        },
        getScore4: async function () {
            let questionList = $(".questionLi").map((index, element) => {
                let $element = $(element),
                    questionHtml = $element.find("h3"),
                    questionTypeHtml = questionHtml.find('span[class="colorShallow"]'),
                    questionText = utils.removeHtml(questionHtml[0].outerHTML.split(questionTypeHtml[0].outerHTML)[1]),
                    questionType = utils.removeHtml(questionTypeHtml.html()).match(/^\((.+?)\)/)[1].split(",")[0],
                    totalScore = Number(utils.removeHtml($element.find(".totalScore.fr>i").html())),
                    questionAnswer;

                switch (questionType) {
                    case '判断题':
                        let $colorGreen = $element.find(".colorGreen"),
                            $colorDeep = $element.find(".mark_answer").find(".colorDeep");
                        questionAnswer = ($colorGreen.length > 0 || totalScore > 0) ? $colorDeep.text().replace("我的答案:", "").trim() : null;

                        questionAnswer = ["√", "正确", "对"].includes(questionAnswer) ? "正确" :
                            ["×", "错误", "错"].includes(questionAnswer) ? "错误" :
                                null;
                        break;

                    case '填空题':
                        questionAnswer = $element.find(".colorGreen>dd").map((inx, item) => {
                            return utils.removeHtml($(item).html()).replace(/^\(.\)/, "").trim();
                        }).get();
                        break;

                    default:
                        return null;
                }
                if (questionAnswer === null) {
                    return null;
                }

                return {
                    "question": questionText,
                    "options": [],
                    "type": defaultConfig.types[questionType],
                    "answer": questionAnswer,
                }
            }).get();
            questionList.length && ServerApi.defaultRequest("save1", "post", {
                "questionList": questionList,
                "url": location.href,
            }, reqUrl.headers).then(function (res) {
                log(res.responseText);
            });

        },
    };


    for (let i = 0; i < _self.localStorage.length; i++) {
        let key = _self.localStorage.key(i);

        if (key.indexOf("layx_") === 0) {
            _self.localStorage.removeItem(key);
        }
    }

    page.init().then(r => {
        log("初始化成功");
    }).catch(e => {
        log(e);
    });

}
)();

/******/ })()
;