// ==UserScript==
// @name         网课万能助手[全网题库][通用智能适配答题][刷课][刷运动]
// @version      1.8
// @description 支持【超星学习通】【智慧树】【职教云系列】【雨课堂】【考试星】【168网校】【u校园】【大学MOOC】【云班课】【优慕课】【继续教育类】【绎通云课堂】【九江系列】【柠檬文才】【亿学宝云】【优课学堂】【小鹅通】【安徽继续教育】【上海开放大学】【华侨大学自考网络助学平台】【良师在线】【和学在线】【人卫慕课】【国家开放大学】【山财培训网】【浙江省高等学校在线开放课程共享平台】【重庆大学网络教育学院】【浙江省高等教育自学考试网络助学平台】【湖南高等学历继续教育】【优学院】【学起系列】【青书学堂】【学堂在线】【英华学堂】【广开网络教学平台】等，内置题库功能。如您遇到问题，请联系 Q群: 893915372邀请码为6666 系统兼容多种学习平台，支持一键搜题，提升学习效率。新增AI搜题、（如ChatGPT）技术，打破不可复制文本限制。，脚本不收集任何个人信息，确保用户隐私安全。无论是学习、复习备考，还是在线课程，本系统都能提供有效支持，使学习高效轻松。使用本系统，您将能够获取所需学习资源，提升学习效率，取得更好成绩。部分收费是为了维护脚本的运作。感谢您对本系统的信任与支持
// @author       小李咯
// @namespace    https://mx.mixuelo.cc/
// @icon         https://mx.mixuelo.cc/assets/images/2.webp
// @author       CodFrm
// @run-at       document-start
// @match        *://*.mosoteach.cn/*
// @match        *://*.chaoxing.com/*
// @match      	 *://*.xueyinonline.com/*
// @match        *://*.edu.cn/*
// @match        *://*.ouchn.cn/*
// @match        *://*.nbdlib.cn/*
// @match        *://*.hnsyu.net/*
// @match        *://*.gdhkmooc.com/*
// @match        *://*.zhihuishu.com/*
// @match      	 *://*.icve.com.cn/*
// @match      	 *://*.yuketang.cn/*
// @match      	 *://v.met0.top/*
// @match      	 *://*.icourse163.org/*
// @match      	 *://*.xuetangx.com/*
// @match        *://*/mycourse/studentstudy?*
// @match        *://*/ztnodedetailcontroller/visitnodedetail?*
// @match        *://*/antispiderShowVerify.ac*
// @match        *://*/html/processVerify.ac?*
// @match        *://*/exam/test/reVersionPaperMarkContentNew?*
// @match        *://*/exam/test/reVersionTestStartNew?*
// @match        *://*/work/selectWorkQuestionYiPiYue?*
// @match        *://*/work/doHomeWorkNew?*
// @match        *://*/ananas/modules/*/index.html?*
// @match        *://*/exam/test?*
// @match        *://*/course/*.html?*
// @match        *://*.chaoxing.com/
// @match        *://*.zhihuishu.com/
// @match        *://*.chaoxing.com/work/doHomeWorkNew*
// @match        *://*.chaoxing.com/mooc-ans/work/doHomeWorkNew*
// @match        *://*.edu.cn/work/doHomeWorkNew*
// @match        *://*.edu.cn/mooc-ans/work/doHomeWorkNew*
// @grant        GM_xmlhttpRequest
// @grant        GM_notification
// @grant        unsafeWindow
// @resource     Table https://www.forestpolice.org/ttf/2.0/table.json
// @run-at       document-end
// @grant        GM_getResourceText
// @license      MIT
// @supportURL   https://bbs.tampermonkey.net.cn/forum.php?mod=viewthread&tid=63
// @homepage     https://bbs.tampermonkey.net.cn/forum.php?mod=viewthread&tid=63
// @antifeature membership
// @antifeature ads
// @downloadURL https://update.greasyfork.org/scripts/552208/%E7%BD%91%E8%AF%BE%E4%B8%87%E8%83%BD%E5%8A%A9%E6%89%8B%5B%E5%85%A8%E7%BD%91%E9%A2%98%E5%BA%93%5D%5B%E9%80%9A%E7%94%A8%E6%99%BA%E8%83%BD%E9%80%82%E9%85%8D%E7%AD%94%E9%A2%98%5D%5B%E5%88%B7%E8%AF%BE%5D%5B%E5%88%B7%E8%BF%90%E5%8A%A8%5D.user.js
// @updateURL https://update.greasyfork.org/scripts/552208/%E7%BD%91%E8%AF%BE%E4%B8%87%E8%83%BD%E5%8A%A9%E6%89%8B%5B%E5%85%A8%E7%BD%91%E9%A2%98%E5%BA%93%5D%5B%E9%80%9A%E7%94%A8%E6%99%BA%E8%83%BD%E9%80%82%E9%85%8D%E7%AD%94%E9%A2%98%5D%5B%E5%88%B7%E8%AF%BE%5D%5B%E5%88%B7%E8%BF%90%E5%8A%A8%5D.meta.js
// ==/UserScript==
 
let config = {
    answer_ignore: false, //忽略题目,勾选此处将不会答题
    auto: true, //全自动挂机,无需手动操作,即可自动观看视频等
    interval: 0.5, //时间间隔,当任务点完成后,会等待1分钟然后跳转到下一个任务点
    rand_answer: false, //随机答案,没有答案的题目将自动的生成一个答案
    video_multiple: 1, //视频播放倍速,视频播放的倍数,建议不要改动,为1即可,这是危险的功能
    video_mute: true, //视频静音,视频自动静音播放
    video_cdn: "公网1", //锁定视频播放源,为空为记录最后一次选中的源(公网1,公网2等)
    super_mode: true, //解锁flash弹幕视频等,详情请看文档
    topic_interval: 5,//题目答题间隔,单位为秒
    vtoken: "",
};
 
Object.keys(config).forEach(k => {
    localStorage[k] = config[k];
});
 

/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./src/tampermonkey/cxmooc-pack.ts");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./src/config.ts":
/*!***********************!*\
  !*** ./src/config.ts ***!
  \***********************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.SystemConfig = void 0;
var SystemConfig = /** @class */ (function () {
    function SystemConfig() {
    }
    SystemConfig.version = 2.5;
    SystemConfig.url = "";
    SystemConfig.hotVersion = "2.5.2";
    //TODO:优化规则,可以通过ci自动生成匹配规则到tampermonkey和manifest文件中
    SystemConfig.match = {
        "cx": [
            "*://*/mycourse/studentstudy?*",
            "*://*/work/doHomeWorkNew?*",
            "*://*/work/selectWorkQuestionYiPiYue?*",
            "*://*/exam/test/reVersionTestStartNew?*",
            "*://*/ztnodedetailcontroller/visitnodedetail?*",
            "*://*/antispiderShowVerify.ac*",
            "*://*/html/processVerify.ac?*",
            "*://*/exam/test/reVersionPaperMarkContentNew?*",
            "*://*/ananas/modules/*/index.html?*",
            "*://*/exam/test?*",
            "*://*/course/*.html?*"
        ], "zhs": [
            "*://examh5.zhihuishu.com/stuExamWeb.html*",
            "*://onlineexamh5new.zhihuishu.com/stuExamWeb.html*",
            "*://studyh5.zhihuishu.com/videoStudy.html*",
        ], "mooc163": [
            "*://www.icourse163.org/learn/*",
            "*://www.icourse163.org/spoc/learn/*"
        ]
    };
    SystemConfig.config = {
        cx: {
            name: "超星",
            items: [{
                    title: "随机答案",
                    description: "如果题库没有正确的答案会随机选择",
                    type: "checkbox",
                    key: "rand_answer",
                    value: false,
                }, {
                    title: "自动挂机",
                    description: "进入一个页面就会自动开始挂机,完成一个任务之后会自动进行下一个",
                    type: "checkbox",
                    key: "auto",
                    value: true,
                }, {
                    title: "视频静音",
                    description: "播放视频时,自动开启静音",
                    type: "checkbox",
                    key: "video_mute",
                    value: true,
                }, {
                    title: "忽略题目",
                    description: "自动挂机时,忽略掉题目不做,直接跳过",
                    type: "checkbox",
                    key: "answer_ignore",
                    value: false,
                }, {
                    title: "超级模式",
                    description: "超星平台下,超级模式会自动将flash播放器换成h5播放器",
                    type: "checkbox",
                    key: "super_mode",
                    value: true,
                }, {
                    title: "播放源",
                    description: "锁定视频播放源,为空为记录最后一次选中的源(公网1,公网2等)",
                    type: "text",
                    key: "video_cdn",
                    value: "默认"
                }, {
                    title: "播放倍速",
                    description: "视频播放的倍数,1为正常速度(最高16倍,该功能有一定危险)",
                    type: "text",
                    key: "video_multiple",
                    prompt: "这是一个很危险的功能,建议不要进行调整,如果你想调整播放速度请在下方填写yes(智慧树平台播放速度和视频进度无关,最高只能1.5倍速)",
                    unit: "倍",
                    value: "1",
                }, {
                    title: "跳转间隔",
                    description: "视频(题目,任务点)完成后n分钟再继续下一个任务,可以有小数点,例如:0.5=30秒",
                    type: "text",
                    key: "interval",
                    unit: "分",
                    value: "1",
                }, {
                    title: "做题间隔",
                    description: "每一道题之间填写答案的时间间隔",
                    type: "text",
                    key: "topic_interval",
                    unit: "秒",
                    value: "5",
                }],
        }, zhs: {
            name: "智慧树",
            items: [{
                    title: "随机答案",
                    description: "如果题库没有正确的答案会随机选择",
                    type: "checkbox",
                    key: "rand_answer",
                    value: false,
                }, {
                    title: "自动挂机",
                    description: "进入一个页面就会自动开始挂机,完成一个任务之后会自动进行下一个",
                    type: "checkbox",
                    key: "auto",
                    value: true,
                }, {
                    title: "视频静音",
                    description: "播放视频时,自动开启静音",
                    type: "checkbox",
                    key: "video_mute",
                    value: true,
                }, {
                    title: "超级模式",
                    description: "智慧树平台下,超级模式会让任务完成的倍速成真",
                    type: "checkbox",
                    key: "super_mode",
                    value: true,
                }, {
                    title: "播放倍速",
                    description: "视频播放的倍数,1为正常速度(最高16倍,该功能有一定危险)",
                    type: "text",
                    key: "video_multiple",
                    prompt: "这是一个很危险的功能,建议不要进行调整,如果你想调整播放速度请在下方填写yes(智慧树平台播放速度和视频进度无关,最高只能1.5倍速)",
                    unit: "倍",
                    value: "1",
                }, {
                    title: "跳转间隔",
                    description: "视频完成后n分钟再继续播放下一个,可以有小数点,例如:0.5=30秒",
                    type: "text",
                    key: "interval",
                    unit: "分",
                    value: "1",
                }, {
                    title: "做题间隔",
                    description: "每一道题之间填写答案的时间间隔",
                    type: "text",
                    key: "topic_interval",
                    unit: "秒",
                    value: "5",
                }],
        }, mooc163: {
            name: "中国大学MOOC",
            items: [{
                    title: "随机答案",
                    description: "如果题库没有正确的答案会随机选择",
                    type: "checkbox",
                    key: "rand_answer",
                    value: false,
                }, {
                    title: "自动挂机",
                    description: "进入一个页面就会自动开始挂机,完成一个任务之后会自动进行下一个",
                    type: "checkbox",
                    key: "auto",
                    value: true,
                }, {
                    title: "视频静音",
                    description: "播放视频时,自动开启静音",
                    type: "checkbox",
                    key: "video_mute",
                    value: true,
                }, {
                    title: "忽略题目",
                    description: "自动挂机时,忽略掉题目不做,直接跳过",
                    type: "checkbox",
                    key: "answer_ignore",
                    value: false,
                }, {
                    title: "播放倍速",
                    description: "视频播放的倍数,1为正常速度(最高16倍,该功能有一定危险)",
                    type: "text",
                    key: "video_multiple",
                    prompt: "这是一个很危险的功能,建议不要进行调整,如果你想调整播放速度请在下方填写yes(智慧树平台播放速度和视频进度无关,最高只能1.5倍速)",
                    unit: "倍",
                    value: "1",
                }, {
                    title: "跳转间隔",
                    description: "视频完成后n分钟再继续播放下一个,可以有小数点,例如:0.5=30秒",
                    type: "text",
                    key: "interval",
                    unit: "分",
                    value: "1",
                }, {
                    title: "做题间隔",
                    description: "每一道题之间填写答案的时间间隔",
                    type: "text",
                    key: "topic_interval",
                    unit: "秒",
                    value: "5",
                }],
        },
    };
    return SystemConfig;
}());
exports.SystemConfig = SystemConfig;


/***/ }),

/***/ "./src/internal/app/question.ts":
/*!**************************************!*\
  !*** ./src/internal/app/question.ts ***!
  \**************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ToolsQuestionBankFacade = exports.ToolsQuestionBank = exports.SwitchTopicType = exports.QuestionStatusString = exports.TopicStatusString = exports.PushAnswer = void 0;
var utils_1 = __webpack_require__(/*! ../utils/utils */ "./src/internal/utils/utils.ts");
var config_1 = __webpack_require__(/*! @App/config */ "./src/config.ts");
var application_1 = __webpack_require__(/*! ../application */ "./src/internal/application.ts");
var PushAnswer = /** @class */ (function () {
    function PushAnswer() {
    }
    PushAnswer.prototype.Equal = function (content1, content2) {
        return content1 == content2;
    };
    return PushAnswer;
}());
exports.PushAnswer = PushAnswer;
var topicStatusMap = new Map();
topicStatusMap.set("ok", "搜索成功").set("random", "随机答案").set("no_support_random", "不支持的随机答案类型").set("no_answer", "题库中没有搜索到答案").set("no_match", "请手动复制粘贴到棚子AIGC搜索");
var questionStatusMap = new Map();
questionStatusMap.set("success", "搜索成功").set("network", "请手动复制粘贴到棚子AIGC搜索").set("incomplete", "请手动复制粘贴到棚子AIGC搜索").set("processing", "请手动复制粘贴到棚子AIGC搜索");
function TopicStatusString(status) {
    return topicStatusMap.get(status) || "未知错误";
}
exports.TopicStatusString = TopicStatusString;
function QuestionStatusString(status) {
    return questionStatusMap.get(status) || "未知错误";
}
exports.QuestionStatusString = QuestionStatusString;
function SwitchTopicType(title) {
    switch (title) {
        case "单选题": {
            return 1;
        }
        case "多选题": {
            return 2;
        }
        case "判断题": {
            return 3;
        }
        case "填空题": {
            return 4;
        }
        default: {
            return null;
        }
    }
}
exports.SwitchTopicType = SwitchTopicType;
// 小工具题库
var ToolsQuestionBank = /** @class */ (function () {
    function ToolsQuestionBank(platform, info) {
        this.platform = platform;
        this.info = info;
    }
    ToolsQuestionBank.prototype.SetInfo = function (info) {
        this.info = info;
    };
    ToolsQuestionBank.prototype.GetInfo = function () {
        return encodeURIComponent(JSON.stringify(this.info));
    };
    ToolsQuestionBank.prototype.Answer = function (topic, resolve) {
        var _this = this;
        application_1.Application.App.log.Debug("答案查询", topic);
        var num = 20;
        var answer = new Array();
        var retStatus = "success";
        var next = function (index) {
            var body = "info=" + _this.GetInfo() + "&";
            var t = index;
            for (; t < index + num && t < topic.length; t++) {
                var val = topic[t];
                body += "topic[" + (t - index) + "]=" + encodeURIComponent((val.topic)) + "&type[" + (t - index) + "]=" + val.type + "&";
            }
            utils_1.HttpUtils.HttpPost(config_1.SystemConfig.url + "v2/answer?platform=" + _this.platform, body, {
                headers: {
                    "Authorization": application_1.Application.App.config.vtoken,
                    "X-Version": config_1.SystemConfig.version.toString(),
                },
                json: true,
                success: function (result) { return __awaiter(_this, void 0, void 0, function () {
                    var status, tmpResult, i, val;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                status = "success";
                                tmpResult = new Array();
                                for (i = 0; i < result.length; i++) {
                                    if (result[i].result == undefined || result[i].result.length <= 0) {
                                        tmpResult.push({
                                            index: index + result[i].index,
                                            topic: result[i].topic,
                                            type: -1,
                                            status: "no_answer",
                                            answers: null,
                                            correct: null,
                                            Equal: this.Equal,
                                        });
                                        status = "incomplete";
                                        continue;
                                    }
                                    val = result[i].result[0];
                                    tmpResult.push({
                                        index: index + result[i].index,
                                        topic: val.topic,
                                        type: val.type,
                                        correct: val.correct,
                                        status: "ok",
                                        Equal: this.Equal,
                                    });
                                }
                                answer = answer.concat(tmpResult);
                                if (status != "success") {
                                    retStatus = status;
                                }
                                return [4 /*yield*/, resolve({ status: "processing", answer: tmpResult })];
                            case 1:
                                _a.sent();
                                if (t < topic.length) {
                                    next(t);
                                }
                                else {
                                    return [2 /*return*/, resolve({ status: retStatus, answer: answer })];
                                }
                                return [2 /*return*/];
                        }
                    });
                }); },
                error: function () {
                    return resolve({ status: "network", answer: answer });
                }
            });
        };
        next(0);
    };
    ToolsQuestionBank.prototype.Push = function (answer) {
        var _this = this;
        return new Promise(function (resolve) {
            application_1.Application.App.log.Debug("采集提交", answer);
            utils_1.HttpUtils.HttpPost(config_1.SystemConfig.url + "answer?platform=" + _this.platform, "info=" + _this.GetInfo() + "&data=" + encodeURIComponent(JSON.stringify(answer)), {
                headers: {
                    "Authorization": application_1.Application.App.config.vtoken,
                    "X-Version": config_1.SystemConfig.version.toString(),
                },
                json: true,
                success: function (result) {
                    application_1.Application.App.log.Info("答案自动记录成功,成功获得" + result.add_token_num + "个打码数,剩余数量:" + result.token_num);
                    resolve("success");
                },
                error: function () {
                    resolve("network");
                }
            });
        });
    };
    ToolsQuestionBank.prototype.Equal = function (content1, content2) {
        return utils_1.removeHTML(content1) == utils_1.removeHTML(content2);
    };
    ToolsQuestionBank.prototype.CheckCourse = function (info) {
        var _this = this;
        return new Promise(function (resolve) {
            info = info || [_this.info];
            utils_1.HttpUtils.HttpPost(config_1.SystemConfig.url + "v2/check?platform=" + _this.platform, "info=" + encodeURIComponent(JSON.stringify(info)), {
                headers: {
                    "Authorization": application_1.Application.App.config.vtoken,
                    "X-Version": config_1.SystemConfig.version.toString(),
                },
                success: function () {
                    resolve(0);
                }, error: function () {
                    resolve(-1);
                }
            });
            resolve();
        });
    };
    return ToolsQuestionBank;
}());
exports.ToolsQuestionBank = ToolsQuestionBank;
var ToolsQuestionBankFacade = /** @class */ (function () {
    function ToolsQuestionBankFacade(platform, info) {
        if (typeof platform == "string") {
            this.bank = new ToolsQuestionBank(platform, info);
        }
        else {
            this.bank = platform;
        }
        this.question = new Array();
    }
    ToolsQuestionBankFacade.prototype.ClearQuestion = function () {
        this.question = new Array();
    };
    ToolsQuestionBankFacade.prototype.AddQuestion = function (q) {
        this.question.push(q);
    };
    ToolsQuestionBankFacade.prototype.Answer = function (callback) {
        var _this = this;
        var topic = new Array();
        this.question.forEach(function (val) {
            var type = val.GetType();
            if (type == -1) {
                return;
            }
            topic.push({
                topic: (val.GetTopic()),
                type: type,
            });
        });
        var status = "success";
        this.bank.Answer(topic, function (ret) {
            return new Promise(function (resolve) { return __awaiter(_this, void 0, void 0, function () {
                var t, i, answer, question, tmpStatus;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            if (ret.status != "processing") {
                                application_1.Application.App.log.Debug("题库返回", ret);
                                if (ret.status != "success" || status == "success") {
                                    callback(ret.status);
                                    return [2 /*return*/, resolve()];
                                }
                                callback(status);
                                return [2 /*return*/, resolve()];
                            }
                            t = application_1.Application.App.config.topic_interval * 1000;
                            i = 0;
                            _a.label = 1;
                        case 1:
                            if (!(i < ret.answer.length)) return [3 /*break*/, 11];
                            answer = ret.answer[i];
                            question = this.question[answer.index];
                            tmpStatus = answer.status;
                            if (!(answer.status == "no_answer")) return [3 /*break*/, 3];
                            status = this.randAnswer(status, tmpStatus, question);
                            return [4 /*yield*/, utils_1.Sleep(t)];
                        case 2:
                            _a.sent();
                            return [3 /*break*/, 10];
                        case 3:
                            if (!(answer.type != question.GetType())) return [3 /*break*/, 4];
                            tmpStatus = "no_match";
                            return [3 /*break*/, 6];
                        case 4: return [4 /*yield*/, question.Fill(answer)];
                        case 5:
                            tmpStatus = _a.sent();
                            _a.label = 6;
                        case 6:
                            if (!(tmpStatus == "no_match")) return [3 /*break*/, 8];
                            status = this.randAnswer(status, tmpStatus, question);
                            return [4 /*yield*/, utils_1.Sleep(t)];
                        case 7:
                            _a.sent();
                            return [3 /*break*/, 10];
                        case 8:
                            question.SetStatus(tmpStatus);
                            if (!(i < ret.answer.length - 1)) return [3 /*break*/, 10];
                            return [4 /*yield*/, utils_1.Sleep(t)];
                        case 9:
                            _a.sent();
                            _a.label = 10;
                        case 10:
                            i++;
                            return [3 /*break*/, 1];
                        case 11: return [2 /*return*/, resolve()];
                    }
                });
            }); });
        });
    };
    ToolsQuestionBankFacade.prototype.randAnswer = function (status, tmpStatus, question) {
        if (application_1.Application.App.config.rand_answer) {
            tmpStatus = question.Random();
        }
        else {
            status = "incomplete";
        }
        if (tmpStatus == "no_support_random") {
            status = "incomplete";
        }
        question.SetStatus(tmpStatus);
        return status;
    };
    ToolsQuestionBankFacade.prototype.Push = function (callback) {
        var answer = new Array();
        this.question.forEach(function (val) {
            var correct = val.Correct();
            if (correct == null || correct.correct == null || correct.type == -1) {
                return;
            }
            answer.push(correct);
        });
        this.bank.Push(answer).then(function (ret) {
            application_1.Application.App.log.Debug("题库返回", ret);
            return callback(ret);
        });
    };
    ToolsQuestionBankFacade.prototype.dealOption = function (options) {
        for (var i = 0; i < options.length; i++) {
            if (typeof options[i].content == "string") {
                options[i].content = (options[i].content);
            }
        }
        return options;
    };
    ToolsQuestionBankFacade.prototype.CheckCourse = function () {
        return this.bank.CheckCourse();
    };
    return ToolsQuestionBankFacade;
}());
exports.ToolsQuestionBankFacade = ToolsQuestionBankFacade;


/***/ }),

/***/ "./src/internal/app/task.ts":
/*!**********************************!*\
  !*** ./src/internal/app/task.ts ***!
  \**********************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.Task = void 0;
var event_1 = __webpack_require__(/*! @App/internal/utils/event */ "./src/internal/utils/event.ts");
var Task = /** @class */ (function (_super) {
    __extends(Task, _super);
    function Task() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    // 初始化任务
    Task.prototype.Init = function () {
        return new Promise(function (resolve) {
            return resolve();
        });
    };
    // 提交任务,例如topic的类型,可以在本接口内进行提交操作
    Task.prototype.Submit = function () {
        return new Promise(function (resolve) {
            return resolve();
        });
    };
    // 停止任务
    Task.prototype.Stop = function () {
        return new Promise(function (resolve) {
            return resolve();
        });
    };
    // 任务的上下文(对于某些iframe的可能会用到)
    Task.prototype.Context = function () {
        return window;
    };
    return Task;
}(event_1.EventListener));
exports.Task = Task;


/***/ }),

/***/ "./src/internal/app/topic.ts":
/*!***********************************!*\
  !*** ./src/internal/app/topic.ts ***!
  \***********************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.Topic = void 0;
var application_1 = __webpack_require__(/*! ../application */ "./src/internal/application.ts");
var config_1 = __webpack_require__(/*! @App/config */ "./src/config.ts");
// 题目任务点
var Topic = /** @class */ (function () {
    function Topic(content, answer) {
        this.answer = answer;
        this.context = content;
    }
    Topic.prototype.SetQueryQuestions = function (queryQuestions) {
        this.queryQuestions = queryQuestions;
    };
    Topic.prototype.addQuestion = function () {
        var _this = this;
        var questions = this.queryQuestions.QueryQuestions();
        this.answer.ClearQuestion();
        questions.forEach(function (val) {
            _this.answer.AddQuestion(val);
        });
    };
    Topic.prototype.QueryAnswer = function () {
        var _this = this;
        return new Promise(function (resolve) {
            if (_this.lock) {
                return resolve("processing");
            }
            _this.lock = true;
            application_1.Application.App.log.Info('<a href="https://nishang.site/" target="_blank">点击打开 棚子AIGC</a>...');
            _this.addQuestion();
            _this.answer.Answer(function (status) {
                _this.lock = false;
                resolve(status);
                if (status == "network") {
                    return application_1.Application.App.log.Error("手动答题更高效:" + config_1.SystemConfig.url);
                }
                else if (status == "incomplete") {
                    return application_1.Application.App.log.Warn("题库答案不全,请手动填写操作");
                }
            });
        });
    };
    Topic.prototype.CollectAnswer = function () {
        var _this = this;
        return new Promise(function (resolve) {
            application_1.Application.App.log.Debug("收集题目答案", _this.context);
            _this.addQuestion();
            _this.answer.Push(function (status) {
                application_1.Application.App.log.Debug("采集答案返回", status);
                resolve();
            });
        });
    };
    return Topic;
}());
exports.Topic = Topic;


/***/ }),

/***/ "./src/internal/app/vcode.ts":
/*!***********************************!*\
  !*** ./src/internal/app/vcode.ts ***!
  \***********************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.VCode = void 0;
var utils_1 = __webpack_require__(/*! @App/internal/utils/utils */ "./src/internal/utils/utils.ts");
var config_1 = __webpack_require__(/*! @App/config */ "./src/config.ts");
var application_1 = __webpack_require__(/*! ../application */ "./src/internal/application.ts");
var VCode = /** @class */ (function () {
    function VCode(listen) {
        this.listen = listen;
    }
    VCode.prototype.Init = function () {
        var _this = this;
        this.listen.Listen(function (fill) {
            application_1.Application.App.log.Info("准备进行打码");
            _this.getVcode(fill);
        });
    };
    VCode.prototype.getVcode = function (fill) {
        var img = fill.GetImage();
        var base64 = "";
        if (typeof img == "string") {
            base64 = img;
        }
        else {
            base64 = utils_1.getImageBase64(img, 'jpeg');
        }
        utils_1.HttpUtils.HttpPost(config_1.SystemConfig.url + 'vcode', 'img=' + encodeURIComponent(base64.substr('data:image/jpeg;base64,'.length)), {
            headers: {
                "Authorization": application_1.Application.App.config.vtoken,
                "X-Version": config_1.SystemConfig.version.toString(),
            },
            json: false,
            success: function (ret) {
                var json = JSON.parse(ret);
                application_1.Application.App.log.Debug(json);
                if (json.code == -2) {
                    fill.Fill("error", json.msg, "");
                }
                else if (json.code == -1) {
                    fill.Fill("error", "打码服务器发生错误", "");
                }
                else if (json.msg) {
                    fill.Fill("ok", "打码成功", json.msg);
                }
                else {
                    fill.Fill("error", "未知错误", "");
                }
            },
            error: function () {
                fill.Fill("network", "网络请求失败", "");
            }
        });
    };
    return VCode;
}());
exports.VCode = VCode;


/***/ }),

/***/ "./src/internal/application.ts":
/*!*************************************!*\
  !*** ./src/internal/application.ts ***!
  \*************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Application = exports.AppName = exports.Content = exports.Frontend = exports.Backend = void 0;
var message_1 = __webpack_require__(/*! ./utils/message */ "./src/internal/utils/message.ts");
var utils_1 = __webpack_require__(/*! ./utils/utils */ "./src/internal/utils/utils.ts");
var config_1 = __webpack_require__(/*! @App/config */ "./src/config.ts");
exports.Backend = "backend";
exports.Frontend = "frontend";
exports.Content = "content";
exports.AppName = "cxmooc-tools";
var Application = /** @class */ (function () {
    function Application(runEnv, launcher, component) {
        Application.app = this;
        Application.runEnv = runEnv;
        this.runEnvSwitch(runEnv);
        this.launcher = launcher;
        this.component = component;
    }
    Object.defineProperty(Application, "App", {
        get: function () {
            return Application.app;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Application.prototype, "debug", {
        get: function () {
            return "development" == "development";
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Application.prototype, "prod", {
        get: function () {
            return "development" == "production";
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Application.prototype, "config", {
        get: function () {
            return this.component.get("config");
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Application.prototype, "log", {
        get: function () {
            return this.component.get("logger");
        },
        enumerable: false,
        configurable: true
    });
    Application.prototype.run = function () {
        this.launcher.start();
    };
    Object.defineProperty(Application.prototype, "IsFrontend", {
        get: function () {
            return Application.IsFrontend;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Application.prototype, "IsBackend", {
        get: function () {
            return Application.IsBackend;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Application.prototype, "IsContent", {
        get: function () {
            return Application.IsContent;
        },
        enumerable: false,
        configurable: true
    });
    Application.prototype.runEnvSwitch = function (env) {
        switch (env) {
            case exports.Frontend:
                Application.IsFrontend = true;
                break;
            case exports.Backend:
                Application.IsBackend = true;
                break;
            case exports.Content:
                Application.IsContent = true;
                break;
        }
        ;
    };
    Object.defineProperty(Application.prototype, "Client", {
        get: function () {
            if (Application.IsFrontend) {
                return message_1.NewChromeClientMessage(exports.AppName);
            }
            return message_1.NewExtensionClientMessage(exports.AppName);
        },
        enumerable: false,
        configurable: true
    });
    Application.CheckUpdate = function (callback) {
        if (Application.IsContent) {
            chrome.storage.local.get(["version", "enforce", "hotversion", "url"], function (item) {
                return __awaiter(this, void 0, void 0, function () {
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, callback((config_1.SystemConfig.version < item.version), item)];
                            case 1:
                                _a.sent();
                                return [2 /*return*/];
                        }
                    });
                });
            });
            return;
        }
        utils_1.HttpUtils.HttpGet(config_1.SystemConfig.url + "update?ver=" + config_1.SystemConfig.version, {
            json: true,
            success: function (json) {
                return __awaiter(this, void 0, void 0, function () {
                    var data;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                data = {
                                    version: json.version,
                                    url: json.url,
                                    enforce: json.enforce,
                                    hotversion: json.hotversion,
                                    injection: json.injection,
                                };
                                Application.IsContent && chrome.storage.local.set(data);
                                return [4 /*yield*/, callback((config_1.SystemConfig.version < data.version), data)];
                            case 1:
                                _a.sent();
                                return [2 /*return*/];
                        }
                    });
                });
            }, error: function () {
                return __awaiter(this, void 0, void 0, function () {
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, callback(false, undefined)];
                            case 1:
                                _a.sent();
                                return [2 /*return*/];
                        }
                    });
                });
            }
        });
    };
    return Application;
}());
exports.Application = Application;


/***/ }),

/***/ "./src/internal/utils/config.ts":
/*!**************************************!*\
  !*** ./src/internal/utils/config.ts ***!
  \**************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.NewFrontendGetConfig = exports.NewBackendConfig = exports.ChromeConfigItems = void 0;
var utils_1 = __webpack_require__(/*! ./utils */ "./src/internal/utils/utils.ts");
var application_1 = __webpack_require__(/*! ../application */ "./src/internal/application.ts");
var config_1 = __webpack_require__(/*! @App/config */ "./src/config.ts");
// 缓存默认值
var configDefaultValue = new Map();
configDefaultValue.set("vtoken", "");
for (var key in config_1.SystemConfig.config) {
    for (var i = 0; i < config_1.SystemConfig.config[key].items.length; i++) {
        configDefaultValue.set(key + "_" + config_1.SystemConfig.config[key].items[i].key, config_1.SystemConfig.config[key].items[i].value);
    }
}
var ChromeConfigItems = /** @class */ (function () {
    function ChromeConfigItems(config) {
        var _this = this;
        this.Namespace = "";
        this.config = config;
        var list = [];
        configDefaultValue.forEach(function (val, key) {
            list.push(key);
        });
        this.config.Watch(list, function (key, val) {
            _this.localCache[key] = val;
        });
        this.localCache = localStorage;
    }
    // 设置配置的命名空间,储存格式为 namepace_configkey
    ChromeConfigItems.prototype.SetNamespace = function (namespace) {
        this.Namespace = namespace + "_";
    };
    ChromeConfigItems.prototype.ConfigList = function () {
        return this.config.ConfigList();
    };
    ChromeConfigItems.prototype.SetNamespaceConfig = function (namespace, key, val) {
        return this.config.SetConfig(namespace + "_" + key, val);
    };
    ChromeConfigItems.prototype.GetNamespaceConfig = function (namespace, key, defaultVal) {
        return this.config.GetConfig(namespace + "_" + key, defaultVal);
    };
    ChromeConfigItems.prototype.GetConfig = function (key, defaultVal) {
        var val = this.config.GetConfig(this.Namespace + key);
        if (val == undefined) {
            return this.config.GetConfig(key, defaultVal);
        }
        return val || defaultVal;
    };
    ChromeConfigItems.prototype.Watch = function (key, callback) {
        this.config.Watch(key, callback);
    };
    Object.defineProperty(ChromeConfigItems.prototype, "super_mode", {
        get: function () {
            return utils_1.toBool(this.GetConfig("super_mode", "true"));
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(ChromeConfigItems.prototype, "vtoken", {
        get: function () {
            return this.GetConfig("vtoken", "");
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(ChromeConfigItems.prototype, "rand_answer", {
        get: function () {
            return utils_1.toBool(this.GetConfig("rand_answer", "false"));
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(ChromeConfigItems.prototype, "auto", {
        get: function () {
            return utils_1.toBool(this.GetConfig("auto", "true"));
        },
        set: function (val) {
            this.SetConfig("auto", utils_1.boolToString(val));
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(ChromeConfigItems.prototype, "video_mute", {
        get: function () {
            return utils_1.toBool(this.GetConfig("video_mute", "true"));
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(ChromeConfigItems.prototype, "answer_ignore", {
        get: function () {
            return utils_1.toBool(this.GetConfig("answer_ignore", "false"));
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(ChromeConfigItems.prototype, "video_cdn", {
        get: function () {
            var val = this.GetConfig("video_cdn");
            if (val == "默认") {
                return "";
            }
            return val;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(ChromeConfigItems.prototype, "video_multiple", {
        get: function () {
            return parseFloat(this.GetConfig("video_multiple"));
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(ChromeConfigItems.prototype, "interval", {
        get: function () {
            var interval = parseFloat(this.GetConfig("interval", "0.1"));
            interval = interval * 100;
            return Math.floor(utils_1.randNumber(interval - interval / 2, interval + interval / 2)) / 100;
        },
        enumerable: false,
        configurable: true
    });
    ChromeConfigItems.prototype.SetConfig = function (key, val) {
        return this.config.SetConfig(this.Namespace + key, val);
    };
    Object.defineProperty(ChromeConfigItems.prototype, "topic_interval", {
        get: function () {
            return parseInt(this.GetConfig("topic_interval", "5"));
        },
        set: function (val) {
            this.SetConfig("topic_interval", val);
        },
        enumerable: false,
        configurable: true
    });
    return ChromeConfigItems;
}());
exports.ChromeConfigItems = ChromeConfigItems;
// 后台环境中使用
function NewBackendConfig() {
    var _this = this;
    return new Promise(function (resolve) { return __awaiter(_this, void 0, void 0, function () {
        var ret;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    ret = new backendConfig();
                    return [4 /*yield*/, ret.updateCache()];
                case 1:
                    _a.sent();
                    resolve(ret);
                    return [2 /*return*/];
            }
        });
    }); });
}
exports.NewBackendConfig = NewBackendConfig;
var configWatch = /** @class */ (function () {
    function configWatch() {
        this.watchCallback = new Map();
    }
    configWatch.prototype.WatchEvent = function (key, val) {
        var list = this.watchCallback.get(key);
        if (list != undefined) {
            list.forEach(function (v) {
                v(key, val);
            });
        }
        list = this.watchCallback.get("*");
        if (list != undefined) {
            list.forEach(function (v) {
                v(key, val);
            });
        }
    };
    configWatch.prototype.Watch = function (key, callback) {
        var _this = this;
        if (typeof key == "string") {
            this.setWatchMap(key, callback);
            return;
        }
        key.forEach(function (val, index) {
            _this.setWatchMap(val, callback);
        });
    };
    configWatch.prototype.setWatchMap = function (key, callback) {
        var list = this.watchCallback.get(key);
        if (list == undefined) {
            list = new Array();
        }
        list.push(callback);
        this.watchCallback.set(key, list);
    };
    return configWatch;
}());
var backendConfig = /** @class */ (function () {
    function backendConfig() {
        var _this = this;
        this.watch = new configWatch();
        chrome.runtime.onMessage.addListener(function (request) {
            if (request.type && request.type == "cxconfig") {
                _this.cache[request.key] = request.value;
                _this.watch.WatchEvent(request.key, request.value);
                _this.updateConfigStorage();
            }
        });
    }
    // 更新配置转为json,存入
    backendConfig.prototype.updateConfigStorage = function () {
        var txt = JSON.stringify(this.cache);
        chrome.storage.sync.set({ "config_storage": txt });
    };
    // 更新缓存
    backendConfig.prototype.updateCache = function () {
        var _this = this;
        return new Promise(function (resolve) {
            chrome.storage.sync.get("config_storage", function (items) {
                if (items["config_storage"]) {
                    _this.cache = JSON.parse(items["config_storage"]);
                }
                else {
                    _this.cache = {};
                }
                configDefaultValue.forEach(function (val, key) {
                    if (_this.cache[key] === undefined) {
                        _this.cache[key] = val;
                    }
                });
                _this.updateConfigStorage();
                resolve(undefined);
            });
        });
    };
    backendConfig.prototype.GetConfig = function (key, defaultVal) {
        if (this.cache == undefined) {
            application_1.Application.App.log.Fatal("缓存失败!!!");
            return "";
        }
        return this.cache[key] || defaultVal;
    };
    backendConfig.prototype.Watch = function (key, callback) {
        return this.watch.Watch(key, callback);
    };
    backendConfig.prototype.SetConfig = function (key, val) {
        var _this = this;
        return new Promise(function (resolve) {
            var info = {};
            info[key] = val;
            //通知前端和后端
            _this.cache[key] = val;
            chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
                chrome.tabs.sendMessage(tabs[0].id, { type: "cxconfig", key: key, value: val });
            });
            chrome.runtime.sendMessage({ type: "cxconfig", key: key, value: val });
            _this.updateConfigStorage();
            resolve(undefined);
        });
    };
    backendConfig.prototype.ConfigList = function () {
        var _this = this;
        return new Promise(function (resolve) { return __awaiter(_this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (this.cache) {
                            return [2 /*return*/, resolve(this.cache)];
                        }
                        return [4 /*yield*/, this.updateCache()];
                    case 1:
                        _a.sent();
                        resolve(this.cache);
                        return [2 /*return*/];
                }
            });
        }); });
    };
    return backendConfig;
}());
// 前端环境使用
function NewFrontendGetConfig() {
    return new frontendGetConfig();
}
exports.NewFrontendGetConfig = NewFrontendGetConfig;
var frontendGetConfig = /** @class */ (function () {
    function frontendGetConfig() {
        var _this = this;
        this.watch = new configWatch();
        this.cache = window.configData || localStorage;
        window.addEventListener('message', function (event) {
            if (event.data.type && event.data.type == "cxconfig") {
                application_1.Application.App.log.Info("配置更新:" + event.data.key + "=" + event.data.value);
                _this.cache[event.data.key] = event.data.value;
                _this.watch.WatchEvent(event.data.key, event.data.value);
            }
        });
    }
    frontendGetConfig.prototype.GetConfig = function (key, defaultVal) {
        if (window.GM_getValue) {
            return window.GM_getValue(key, defaultVal);
        }
        return this.cache[key] || defaultVal;
    };
    frontendGetConfig.prototype.Watch = function (key, callback) {
        return this.watch.Watch(key, callback);
    };
    frontendGetConfig.prototype.SetConfig = function (key, val) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                this.cache[key] = val;
                if (window.GM_setValue) {
                    return [2 /*return*/, window.GM_setValue(key, val)];
                }
                return [2 /*return*/, application_1.Application.App.Client.Send({
                        type: "GM_setValue", details: { key: key, val: val },
                    })];
            });
        });
    };
    frontendGetConfig.prototype.ConfigList = function () {
        return this.cache;
    };
    return frontendGetConfig;
}());


/***/ }),

/***/ "./src/internal/utils/event.ts":
/*!*************************************!*\
  !*** ./src/internal/utils/event.ts ***!
  \*************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.EventListener = void 0;
var EventListener = /** @class */ (function () {
    function EventListener() {
        this.event = {};
    }
    EventListener.prototype.addEventListener = function (event, callback) {
        if (!this.event[event]) {
            this.event[event] = new Array();
        }
        this.event[event].push({
            callback: callback, param: { once: false },
        });
    };
    EventListener.prototype.addEventListenerOnce = function (event, callback) {
        if (!this.event[event]) {
            this.event[event] = new Array();
        }
        this.event[event].push({
            callback: callback, param: { once: true },
        });
    };
    EventListener.prototype.callEvent = function (event) {
        var _this = this;
        var args = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            args[_i - 1] = arguments[_i];
        }
        if (!this.event[event]) {
            return;
        }
        var del = new Array();
        this.event[event].forEach(function (v, index) {
            v.callback.apply(_this, args);
            if (v.param.once) {
                del.push(index);
            }
        });
        del.forEach(function (v, index) {
            _this.event[event].splice(v - index, 1);
        });
    };
    return EventListener;
}());
exports.EventListener = EventListener;


/***/ }),

/***/ "./src/internal/utils/hook.ts":
/*!************************************!*\
  !*** ./src/internal/utils/hook.ts ***!
  \************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.Hook = void 0;
var application_1 = __webpack_require__(/*! @App/internal/application */ "./src/internal/application.ts");
var Hook = /** @class */ (function () {
    function Hook(func, context) {
        this.context = context || window;
        this.func = func;
    }
    Hook.prototype.Middleware = function (call) {
        var name;
        if (typeof this.func == "string") {
            name = this.func;
        }
        else {
            name = this.func.name;
        }
        var old = this.context[name];
        this.context[name] = function () {
            var args = [old];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i + 1] = arguments[_i];
            }
            return call.apply(this, args);
        };
    };
    Hook.HookAjaxRespond = function (url, call) {
        var _this = this;
        if (!this.once) {
            this.match_list = new Map();
            var self_1 = this;
            var hookXMLHttpRequest = new Hook("open", application_1.Application.GlobalContext.XMLHttpRequest.prototype);
            hookXMLHttpRequest.Middleware(function (next) {
                var _this = this;
                var args = [];
                for (var _a = 1; _a < arguments.length; _a++) {
                    args[_a - 1] = arguments[_a];
                }
                self_1.match_list.forEach(function (val, key) {
                    if (args[1].indexOf(key) != -1) {
                        Object.defineProperty(_this, "responseText", {
                            configurable: true,
                            get: function () {
                                return val.call(this, args[1], this.response);
                            }
                        });
                    }
                });
                return next.apply(this, args);
            });
            this.once = true;
        }
        if (typeof url == "string") {
            this.match_list.set(url, call);
        }
        else {
            url.forEach(function (v) {
                _this.match_list.set(v, call);
            });
        }
    };
    return Hook;
}());
exports.Hook = Hook;


/***/ }),

/***/ "./src/internal/utils/log.ts":
/*!***********************************!*\
  !*** ./src/internal/utils/log.ts ***!
  \***********************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PageLog = exports.ConsoleLog = void 0;
var application_1 = __webpack_require__(/*! ../application */ "./src/internal/application.ts");
__webpack_require__(/*! ../../views/common */ "./src/views/common.ts");
var utils_1 = __webpack_require__(/*! @App/internal/utils/utils */ "./src/internal/utils/utils.ts");
// 开发者工具f12处打印日志
var ConsoleLog = /** @class */ (function () {
    function ConsoleLog() {
    }
    ConsoleLog.prototype.getNowTime = function () {
        var time = new Date();
        return time.getHours() + ":" + time.getMinutes() + ":" + time.getSeconds();
    };
    ConsoleLog.prototype.Debug = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        application_1.Application.App.debug && console.info.apply(console, __spreadArrays(["[debug " + this.getNowTime() + "]"], args));
        return this;
    };
    ConsoleLog.prototype.Info = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        application_1.Application.App.debug && console.info.apply(console, __spreadArrays(["[info " + this.getNowTime() + "]"], args));
        return this;
    };
    ConsoleLog.prototype.Warn = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        console.warn.apply(console, __spreadArrays(["[warn " + this.getNowTime() + "]"], args));
        return this;
    };
    ConsoleLog.prototype.Error = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        console.error.apply(console, __spreadArrays(["[error " + this.getNowTime() + "]"], args));
        return this;
    };
    ConsoleLog.prototype.Fatal = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        console.error.apply(console, __spreadArrays(["[fatal " + this.getNowTime() + "]"], args));
        return this;
    };
    return ConsoleLog;
}());
exports.ConsoleLog = ConsoleLog;
var PageLog = /** @class */ (function () {
    function PageLog() {
        var _this = this;
        this.el = undefined;
        window.addEventListener("load", function () {
            _this.div = document.createElement("div");
            _this.div.innerHTML = "\n            <div class=\"head\" id=\"tools-head\"> \n               <span>\u7F51\u8BFE\u4E07\u80FD\u52A9\u624B</span> \n               <span style=\"position:absolute; left:130px;\">\uD83D\uDE46\u200D\u2642\uFE0F \u70B9\u51FB \uD83D\uDC49</span>\n               <label class=\"switch\" style=\"margin-left: 80px;\">\n                  <input class=\"checkbox-input\" id=\"checkbox\" type=\"checkbox\" checked=\"checked\">\n                  <label class=\"checkbox\" for=\"checkbox\"></label>\n              \n               </label>\n               <span class=\"close\" style=\"float:right; cursor:pointer; margin-right:5px;\">\u2716</span>\n            </div>\n            \n            <div style=\"background-color: #fff !important; padding-bottom: 60px !important; position: relative !important; min-height: 10px !important;\">\n\n             <iframe class=\"iframe\" src=\"https://mx.mixuelo.cc/index/chaxun\" style=\"width: 100%; height:330px;\"></iframe>\n               <div class=\"tools-notice-content\"></div>\n            </div>\n            ";
            // 添加自定义弹窗
            _this.alertDiv = document.createElement("div");
            _this.alertDiv.className = "custom-alert hidden"; // 为自定义弹窗添加类
            document.body.appendChild(_this.alertDiv);
            _this.div.className = "tools-logger-panel";
            document.body.appendChild(_this.div);
            _this.el = _this.div.querySelector(".tools-notice-content");
            _this.div.querySelector(".close").onclick = function () {
                _this.el = undefined;
                _this.div.remove();
            };
            var checkbox = _this.div.querySelector("#checkbox");
            checkbox.checked = (application_1.Application.App.config.GetConfig("is_notify") || "true") == "true";
            _this.is_notify = checkbox.checked;
            if (!checkbox.checked) {
                checkbox.removeAttribute("checked");
            }
            var self = _this;
            checkbox.addEventListener("change", function () {
                self.is_notify = this.checked;
                application_1.Application.App.config.SetConfig("is_notify", this.checked.toString());
                var iframe = self.div.querySelector(".iframe");
                iframe.style.display = this.checked ? "block" : "none";
                self.showAlert("邀请码6666"); // 显示自定义弹窗
            });
            // 默认.iframe是隐藏的
            var iframe = _this.div.querySelector(".iframe");
            iframe.style.display = "none";
            setTimeout(function () {
                application_1.Application.CheckUpdate(function (isnew, data) {
                    if (data == undefined) {
                        _this.Info("目前为最新版本.");
                        return;
                    }
                    var html = "";
                    if (isnew) {
                        html += "<span>[有新版本]</span>";
                    }
                    html += data.injection;
                    _this.Info(html);
                });
            }, 1000);
            // 支持拖拽移动
            function getProperty(ele, prop) {
                return parseInt(window.getComputedStyle(ele)[prop]);
            }
            var windowWidth = window.innerWidth;
            var windowHeight = window.innerHeight;
            var containerWidth = getProperty(_this.div, "width");
            var containerHeight = getProperty(_this.div, "height");
            var x = parseInt(application_1.Application.App.config.GetConfig("notify_tools_x", "60px").replace('px', ''));
            if (x < 0) {
                x = 0;
            }
            if (x >= windowWidth - containerWidth)
                x = windowWidth - containerWidth;
            _this.div.style.left = x + "px";
            var y = parseInt(application_1.Application.App.config.GetConfig("notify_tools_y", "40px").replace('px', ''));
            if (y < 0) {
                y = 0;
            }
            if (y >= windowHeight - containerHeight)
                y = windowHeight - containerHeight;
            _this.div.style.top = y + "px";
            var head = _this.div.querySelector("#tools-head");
            head.onmousedown = function (downEvent) {
                var relaX = downEvent.clientX - _this.div.offsetLeft;
                var relaY = downEvent.clientY - _this.div.offsetTop;
                document.onmousemove = function (moveEvent) {
                    var targetX = moveEvent.clientX - relaX;
                    var targetY = moveEvent.clientY - relaY;
                    if (targetX <= 0)
                        targetX = 0;
                    if (targetY <= 0)
                        targetY = 0;
                    if (targetX >= windowWidth - containerWidth)
                        targetX = windowWidth - containerWidth;
                    if (targetY >= windowHeight - containerHeight)
                        targetY = windowHeight - containerHeight;
                    _this.div.style.left = targetX + "px";
                    _this.div.style.top = targetY + "px";
                };
                document.onmouseup = function () {
                    document.onmouseup = null;
                    document.onmousemove = null;
                    application_1.Application.App.config.SetConfig("notify_tools_x", _this.div.style.left);
                    application_1.Application.App.config.SetConfig("notify_tools_y", _this.div.style.top);
                };
            };
            // 添加样式
            var style = document.createElement('style');
            style.innerHTML = "\n    .hidden { display: none; }\n    .custom-alert {\n        position: fixed;\n        top: 20px;\n        left: 50%;\n        transform: translateX(-50%);\n        padding: 15px 25px; /* \u589E\u52A0\u5DE6\u53F3\u5185\u8FB9\u8DDD */\n        background: linear-gradient(to right, #fb3fbf82, #007affa6); /* \u84DD\u8272\u6E10\u53D8\u80CC\u666F */\n        color: white;\n        border-radius: 12px; /* \u67D4\u548C\u7684\u5706\u89D2 */\n        z-index: 1000;\n        box-shadow: 0 8px 25px rgba(0, 0, 0, 0.3); /* \u66F4\u6DF1\u7684\u9634\u5F71\u6548\u679C */\n        font-size: 18px; /* \u589E\u52A0\u5B57\u4F53\u5927\u5C0F */\n        font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; /* \u4F7F\u7528\u73B0\u4EE3\u5B57\u4F53 */\n        transition: opacity 0.5s ease, transform 0.5s ease; /* \u8FC7\u6E21\u6548\u679C */\n        opacity: 1; /* \u521D\u59CB\u900F\u660E\u5EA6 */\n        transform: translateX(-50%) translateY(0); /* \u521D\u59CB\u4F4D\u7F6E */\n    }\n    \n    .custom-alert.hidden { \n        opacity: 0; \n        transform: translateX(-50%) translateY(-20px); /* \u79BB\u5F00\u7684\u52A8\u753B */\n    }\n\n    /* \u989D\u5916\u7684\u52A8\u753B */\n    @keyframes slideIn {\n        0% { transform: translateX(-50%) translateY(-20px); opacity: 0; }\n        100% { transform: translateX(-50%) translateY(0); opacity: 1; }\n    }\n\n    @keyframes slideOut {\n        0% { transform: translateX(-50%) translateY(0); opacity: 1; }\n        100% { transform: translateX(-50%) translateY(-20px); opacity: 0; }\n    }\n";
            document.head.appendChild(style);
        });
    }
    PageLog.prototype.getNowTime = function () {
        var time = new Date();
        return time.getHours() + ":" + time.getMinutes() + ":" + time.getSeconds();
    };
    PageLog.prototype.first = function (text, color, background) {
        var new_log = document.createElement("div");
        new_log.innerHTML = "\n            <div class=\"log\" style=\"border-color: " + background + "; background-color: " + background + ";\">\n                <p><span style=\"color:" + color + ";\">" + text + "</span></p>\n            </div>\n        ";
        var first = document.getElementsByClassName("tools-notice-content")[0].getElementsByTagName("div");
        document.querySelector(".tools-notice-content").insertBefore(new_log, first[0]);
    };
    PageLog.prototype.toStr = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        var text = "";
        for (var i = 0; i < args.length; i++) {
            if (typeof args[i] == "object") {
                text += args[i].toString() + "\n";
            }
            else {
                text += args[i] + "\n";
            }
        }
        return text.substring(0, text.length - 1);
    };
    PageLog.prototype.showAlert = function (message) {
        var _this = this;
        this.alertDiv.innerText = message;
        this.alertDiv.classList.remove("hidden");
        this.alertDiv.style.opacity = "1";
        this.alertDiv.style.animation = "slideIn 0.5s forwards"; // 应用弹入动画
        setTimeout(function () {
            _this.alertDiv.style.opacity = "0"; // 渐隐
            _this.alertDiv.style.animation = "slideOut 0.5s forwards"; // 应用弹出动画
            setTimeout(function () {
                _this.alertDiv.classList.add("hidden"); // 完全隐藏
            }, 500); // 等待动画结束后隐藏
        }, 3000);
    };
    PageLog.prototype.Debug = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        console.info.apply(console, __spreadArrays(["[debug " + this.getNowTime() + "]"], args));
        return this;
    };
    PageLog.prototype.Info = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        var text = this.toStr.apply(this, args);
        if (this.el) {
            this.first(text, "#409EFF", "rgba(121, 187, 255, 0.2)");
        }
        else {
            console.info.apply(console, __spreadArrays(["[info " + this.getNowTime() + "]"], args));
        }
        return this;
    };
    PageLog.prototype.Warn = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        var text = this.toStr.apply(this, args);
        if (this.el) {
            this.first(text, "#5C3C00", "rgba(250, 236, 216, 0.4)");
        }
        console.warn.apply(console, __spreadArrays(["[warn " + this.getNowTime() + "]"], args));
        if (document.hidden && localStorage["is_notify"] == "true") {
            utils_1.Noifications({
                title: "网课小工具",
                text: text + "\n3秒后自动关闭",
                timeout: 3000,
            });
        }
        return this;
    };
    PageLog.prototype.Error = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        var text = this.toStr.apply(this, args);
        if (this.el) {
            this.first(text, "#FFF0F0", "rgba(253, 226, 226, 0.5)");
        }
        console.error.apply(console, __spreadArrays(["[error " + this.getNowTime() + "]"], args));
        if (localStorage["is_notify"] == "true") {
            utils_1.Noifications({
                title: "网课小工具",
                text: text,
            });
        }
        return this;
    };
    PageLog.prototype.Fatal = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        var text = this.toStr.apply(this, args);
        if (this.el) {
            this.first(text, "#ff0000", "rgba(253, 226, 226, 0.5)");
        }
        console.error.apply(console, __spreadArrays(["[fatal " + this.getNowTime() + "]"], args));
        utils_1.Noifications({
            title: "网课小工具",
            text: text,
        });
        return this;
    };
    return PageLog;
}());
exports.PageLog = PageLog;
// export class EmptyLog implements Logger {
//     public Debug(...args: any): Logger {
//         return this;
//     }
//     public Info(...args: any): Logger {
//         return this;
//     }
//     public Warn(...args: any): Logger {
//         return this;
//     }
//     public Error(...args: any): Logger {
//         return this;
//     }
//     public Fatal(...args: any): Logger {
//         return this;
//     }
// }


/***/ }),

/***/ "./src/internal/utils/message.ts":
/*!***************************************!*\
  !*** ./src/internal/utils/message.ts ***!
  \***************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.NewChromeClientMessage = exports.NewChromeServerMessage = exports.NewExtensionClientMessage = exports.NewExtensionServerMessage = void 0;
function NewExtensionServerMessage(port) {
    return new extensionServerMessage(port);
}
exports.NewExtensionServerMessage = NewExtensionServerMessage;
var extensionServerMessage = /** @class */ (function () {
    function extensionServerMessage(port) {
        this.port = port;
        this.recv();
    }
    extensionServerMessage.prototype.recv = function () {
        var _this = this;
        //监听消息
        chrome.runtime.onConnect.addListener(function (port) {
            if (port.name != _this.port) {
                return;
            }
            port.onMessage.addListener(function (request) {
                _this.acceptCallback(new extensionClientMessage(port), request);
            });
        });
    };
    extensionServerMessage.prototype.Accept = function (callback) {
        this.acceptCallback = callback;
    };
    return extensionServerMessage;
}());
var msg = /** @class */ (function () {
    function msg(tag) {
        this.tag = tag;
    }
    msg.prototype.Recv = function (callback) {
        this.recvCallback = callback;
    };
    return msg;
}());
// 扩展中使用
function NewExtensionClientMessage(tag) {
    return new extensionClientMessage(tag);
}
exports.NewExtensionClientMessage = NewExtensionClientMessage;
var extensionClientMessage = /** @class */ (function (_super) {
    __extends(extensionClientMessage, _super);
    function extensionClientMessage(param) {
        var _this = this;
        if (typeof param === 'string') {
            _this = _super.call(this, param) || this;
            _this.connect();
        }
        else {
            _this.conn = param;
        }
        _this.recv();
        return _this;
    }
    extensionClientMessage.prototype.connect = function () {
        this.conn = chrome.runtime.connect({ name: this.tag });
    };
    extensionClientMessage.prototype.recv = function () {
        var _this = this;
        this.conn.onMessage.addListener(function (response) {
            _this.recvCallback(response);
        });
    };
    extensionClientMessage.prototype.Send = function (msg) {
        this.conn.postMessage(msg);
    };
    return extensionClientMessage;
}(msg));
// 浏览器中使用
function NewChromeServerMessage(tag) {
    return new chromeServerMessage(tag);
}
exports.NewChromeServerMessage = NewChromeServerMessage;
var chromeServerMessage = /** @class */ (function () {
    function chromeServerMessage(tag) {
        this.tag = tag;
        this.recv();
    }
    chromeServerMessage.prototype.recv = function () {
        var _this = this;
        window.addEventListener('message', function (event) {
            if (event.data.tag == _this.tag && event.data.conn_tag && event.data.source == "client") {
                _this.acceptCallback(new chromeClientMessage(_this.tag, event.data.conn_tag), event.data.msg);
            }
        });
    };
    chromeServerMessage.prototype.Accept = function (callback) {
        this.acceptCallback = callback;
    };
    return chromeServerMessage;
}());
function NewChromeClientMessage(tag) {
    return new chromeClientMessage(tag);
}
exports.NewChromeClientMessage = NewChromeClientMessage;
var chromeClientMessage = /** @class */ (function (_super) {
    __extends(chromeClientMessage, _super);
    function chromeClientMessage(tag, conn) {
        var _this = this;
        if (conn !== undefined) {
            _this = _super.call(this, tag) || this;
            _this.connTag = conn;
            _this.source = "server";
        }
        else {
            _this = _super.call(this, tag) || this;
            _this.connect();
            _this.source = "client";
        }
        return _this;
    }
    chromeClientMessage.prototype.connect = function () {
        var _this = this;
        this.connTag = Math.random();
        window.addEventListener('message', function (event) {
            if (event.data.tag == _this.tag && event.data.conn_tag == _this.connTag && event.data.source == "server") {
                _this.recvCallback && _this.recvCallback(event.data.msg);
            }
        });
    };
    chromeClientMessage.prototype.Send = function (msg) {
        window.postMessage({ tag: this.tag, conn_tag: this.connTag, msg: msg, source: this.source }, '*');
    };
    return chromeClientMessage;
}(msg));


/***/ }),

/***/ "./src/internal/utils/utils.ts":
/*!*************************************!*\
  !*** ./src/internal/utils/utils.ts ***!
  \*************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.Sleep = exports.UntrustedClick = exports.boolToString = exports.toBool = exports.Noifications = exports.isPhone = exports.getImageBase64 = exports.protocolPrompt = exports.dealHotVersion = exports.substrex = exports.removeHTML = exports.removeHTMLTag = exports.post = exports.get = exports.createBtn = exports.randNumber = exports.RemoveInjected = exports.syncSetChromeStorageLocal = exports.syncGetChromeStorageLocal = exports.InjectedBySrc = exports.Injected = exports.HttpUtils = void 0;
var application_1 = __webpack_require__(/*! ../application */ "./src/internal/application.ts");
var HttpUtils = /** @class */ (function () {
    function HttpUtils() {
    }
    HttpUtils.Request = function (info) {
        if (application_1.Application.App.IsBackend) {
            fetch(info.url, info).then(function (body) {
                if (info.json) {
                    return body.json();
                }
                else {
                    return body.text();
                }
            }).then(function (body) {
                info.success && info.success(body);
            }).catch(function () {
                info.error && info.error();
            });
            return;
        }
        HttpUtils.crossDomainRequest(info);
    };
    HttpUtils.errorCode = function (ret) {
        if (!ret.code) {
            return false;
        }
        switch (ret.code) {
            case -1: {
                application_1.Application.App.log.Info(ret.msg);
                break;
            }
            case -2: {
                application_1.Application.App.log.Warn(ret.msg);
                break;
            }
            case 1: {
                application_1.Application.App.log.Info(ret.msg);
                return false;
            }
            default: {
                return false;
            }
        }
        return true;
    };
    HttpUtils.crossDomainRequest = function (info) {
        if (window.hasOwnProperty('GM_xmlhttpRequest')) {
            //兼容油猴
            info.data = info.body;
            info.onreadystatechange = function (response) {
                if (response.readyState == 4) {
                    if (response.status == 200) {
                        if (info.json) {
                            var ret = JSON.parse(response.responseText);
                            if (HttpUtils.errorCode(ret)) {
                                info.error && info.error();
                                return;
                            }
                            info.success && info.success(ret);
                        }
                        else {
                            info.success && info.success(response.responseText);
                        }
                    }
                    else {
                        info.error && info.error();
                    }
                }
            };
            window.GM_xmlhttpRequest(info);
        }
        else {
            var client = application_1.Application.App.Client;
            client.Recv(function (data) {
                if (data.code == 0) {
                    if (info.json) {
                        if (HttpUtils.errorCode(data.body)) {
                            info.error && info.error();
                            return;
                        }
                    }
                    info.success && info.success(data.body);
                }
                else {
                    info.error && info.error();
                }
            });
            client.Send({
                type: "GM_xmlhttpRequest", info: {
                    url: info.url,
                    method: info.method,
                    json: info.json,
                    body: info.body,
                    headers: info.headers,
                }
            });
        }
    };
    HttpUtils.HttpGet = function (url, info) {
        info.url = url;
        this.Request(info);
    };
    HttpUtils.HttpPost = function (url, body, info) {
        info.url = url;
        info.body = body;
        if (!info.headers) {
            info.headers = {};
        }
        if (!info.headers["Content-Type"]) {
            info.headers["Content-Type"] = "application/x-www-form-urlencoded";
        }
        info.method = "POST";
        this.Request(info);
    };
    HttpUtils.SendRequest = function (client, data) {
        if (!data.info) {
            return;
        }
        var info = data.info;
        if (application_1.Application.App.IsBackend) {
            info.success = function (body) {
                client.Send({ body: body, code: 0 });
            };
            info.error = function () {
                client.Send({ code: -1 });
            };
            HttpUtils.Request(info);
        }
        else {
            // content 做转发
            var extClient = application_1.Application.App.Client;
            extClient.Send({ type: "GM_xmlhttpRequest", info: info });
            extClient.Recv(function (data) {
                client.Send(data);
            });
        }
    };
    return HttpUtils;
}());
exports.HttpUtils = HttpUtils;
/**
 * 通过源码注入js资源
 * @param doc
 * @param url
 * @constructor
 */
function Injected(doc, source) {
    var temp = doc.createElement('script');
    temp.setAttribute('type', 'text/javascript');
    temp.innerHTML = source;
    temp.className = "injected-js";
    doc.documentElement.appendChild(temp);
    return temp;
}
exports.Injected = Injected;
/**
 * 通过源码注入js资源
 * @param doc
 * @param url
 * @constructor
 */
function InjectedBySrc(doc, source) {
    var temp = doc.createElement('script');
    temp.setAttribute('type', 'text/javascript');
    temp.src = source;
    temp.className = "injected-js";
    doc.documentElement.appendChild(temp);
    return temp;
}
exports.InjectedBySrc = InjectedBySrc;
function syncGetChromeStorageLocal(key) {
    return new Promise(function (resolve) { return (chrome.storage.local.get(key, function (value) {
        resolve(value[key]);
    })); });
}
exports.syncGetChromeStorageLocal = syncGetChromeStorageLocal;
function syncSetChromeStorageLocal(key, value) {
    var tmp = {};
    tmp[key] = value;
    return new Promise(function (resolve) { return (chrome.storage.local.set(tmp, function () {
        resolve();
    })); });
}
exports.syncSetChromeStorageLocal = syncSetChromeStorageLocal;
/**
 * 移除注入js
 * @param doc
 */
function RemoveInjected(doc) {
    var resource = doc.getElementsByClassName("injected-js");
    for (var i = 0; i < resource.length; i++) {
        resource[i].remove();
    }
}
exports.RemoveInjected = RemoveInjected;
function randNumber(minNum, maxNum) {
    return Math.floor(Math.random() * (maxNum - minNum + 1) + minNum);
}
exports.randNumber = randNumber;
/**
 * 创建一个按钮
 * @param title
 * @param description
 * @param id
 */
function createBtn(title, description, className, id) {
    if (description === void 0) { description = ""; }
    if (className === void 0) { className = ""; }
    if (id === void 0) { id = ""; }
    var btn = document.createElement('button');
    btn.innerText = title;
    btn.id = id;
    btn.title = description;
    btn.className = className;
    return btn;
}
exports.createBtn = createBtn;
/**
 * get请求
 * @param {*} url
 */
function get(url, success) {
    var xmlhttp = createRequest();
    xmlhttp.open("GET", url, true);
    xmlhttp.onreadystatechange = function () {
        if (this.readyState == 4) {
            if (this.status == 200) {
                success && success(this.responseText, this.resource);
            }
            else {
                xmlhttp.errorCallback && xmlhttp.errorCallback(this);
            }
        }
    };
    xmlhttp.send();
    return xmlhttp;
}
exports.get = get;
/**
 * post请求
 * @param {*} url
 * @param {*} data
 * @param {*} json
 */
function post(url, data, json, success) {
    if (json === void 0) { json = true; }
    var xmlhttp = createRequest();
    xmlhttp.open("POST", url, true);
    if (json) {
        xmlhttp.setRequestHeader("Content-Type", "application/json");
    }
    else {
        xmlhttp.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    }
    xmlhttp.onreadystatechange = function () {
        if (this.readyState == 4) {
            if (this.status == 200) {
                success && success(this.responseText);
            }
            else {
                xmlhttp.errorCallback && xmlhttp.errorCallback(this);
            }
        }
    };
    xmlhttp.send(data);
    return xmlhttp;
}
exports.post = post;
/**
 * 创建http请求
 */
function createRequest() {
    var xmlhttp;
    if (window.XMLHttpRequest) {
        xmlhttp = new XMLHttpRequest();
    }
    else {
        xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
    }
    xmlhttp.error = function (callback) {
        xmlhttp.errorCallback = callback;
        return xmlhttp;
    };
    xmlhttp.withCredentials = true;
    return xmlhttp;
}
// 移除html tag
function removeHTMLTag(html) {
    var revHtml = /<.*?>/g;
    html = html.replace(revHtml, '');
    html = html.replace(/(^\s+)|(\s+$)/g, '');
    return html;
}
exports.removeHTMLTag = removeHTMLTag;
/**
 * 去除html标签和处理中文
 * @param {string} html
 */
function removeHTML(html) {
    //先处理带src和href属性的标签
    var srcReplace = /<img.*?src="(.*?)".*?>/g;
    html = html.replace(srcReplace, '$1');
    srcReplace = /(<iframe.+?>)\s+?(<\/iframe>)/g;
    html = html.replace(srcReplace, '$1$2');
    srcReplace = /<(iframe|a).*?(src|href)="(.*?)".*?>(.*?)<\/(iframe|a)>/g;
    html = html.replace(srcReplace, '$3$4');
    var revHtml = /<.*?>/g;
    html = html.replace(revHtml, '');
    html = html.replace(/(^\s+)|(\s+$)/g, '');
    html = dealSymbol(html);
    return html.replace(/&nbsp;/g, ' ')
        .replace(/&quot;/g, "\"").replace(/&gt;/g, ">")
        .replace(/&lt;/g, "<").replace(/&amp;/g, '&').trim();
}
exports.removeHTML = removeHTML;
/**
 * 处理符号
 * @param topic
 */
function dealSymbol(topic) {
    topic = topic.replace(/，/g, ',');
    topic = topic.replace(/（/g, '(');
    topic = topic.replace(/）/g, ')');
    topic = topic.replace(/？/g, '?');
    topic = topic.replace(/：/g, ':');
    topic = topic.replace(/。/g, '.');
    topic = topic.replace(/[“”]/g, '"');
    return topic;
}
/**
 * 取中间文本
 * @param str
 * @param left
 * @param right
 */
function substrex(str, left, right) {
    var leftPos = str.indexOf(left) + left.length;
    var rightPos = str.indexOf(right, leftPos);
    return str.substring(leftPos, rightPos);
}
exports.substrex = substrex;
function dealHotVersion(hotversion) {
    hotversion = hotversion.substring(0, hotversion.indexOf(".") + 1) + hotversion.substring(hotversion.indexOf(".") + 1).replace(".", "");
    return Number(hotversion);
}
exports.dealHotVersion = dealHotVersion;
function protocolPrompt(content, key, keyword) {
    keyword = keyword || "yes";
    if (localStorage[key] == undefined || localStorage[key] != 1) {
        var msg = prompt(content + "\n如果以后不想再弹出本对话框并且同意请在下方填写\"" + keyword + "\"");
        if (msg === null)
            return false;
        if (keyword != msg) {
            return false;
        }
        localStorage[key] = 1;
    }
    return true;
}
exports.protocolPrompt = protocolPrompt;
function getImageBase64(img, ext) {
    var canvas = document.createElement("canvas");
    canvas.width = img.width;
    canvas.height = img.height;
    var ctx = canvas.getContext("2d");
    ctx.drawImage(img, 0, 0, img.width, img.height);
    var dataURL = canvas.toDataURL("image/" + ext, 0.75); //节省可怜的流量>_<,虽然好像没有啥
    canvas = null;
    return dataURL;
}
exports.getImageBase64 = getImageBase64;
function isPhone() {
    return /Android|iPhone/i.test(navigator.userAgent);
}
exports.isPhone = isPhone;
function Noifications(details) {
    if (window.hasOwnProperty("GM_notification")) {
        window.GM_notification(details);
    }
    else {
        var client = application_1.Application.App.Client;
        client.Send({
            type: "GM_notification", details: details,
        });
        application_1.Application.App.Client.Send(details);
    }
}
exports.Noifications = Noifications;
function toBool(val) {
    if (typeof val == "boolean") {
        return val;
    }
    return val == "true";
}
exports.toBool = toBool;
function boolToString(val) {
    if (val) {
        return "true";
    }
    return "false";
}
exports.boolToString = boolToString;
function UntrustedClick(el) {
    if (window.CAT_click != undefined) {
        CAT_click(el);
        return true;
    }
    var untrusted = new MouseEvent("click", { "clientX": 10086 });
    if (!untrusted.isTrusted) {
        application_1.Application.App.log.Warn("扩展执行错误");
        return false;
    }
    return el.dispatchEvent(untrusted);
}
exports.UntrustedClick = UntrustedClick;
function Sleep(timeout) {
    return new Promise(function (resolve) {
        setTimeout(function () {
            resolve(undefined);
        }, timeout);
    });
}
exports.Sleep = Sleep;


/***/ }),

/***/ "./src/mooc/chaoxing/course.ts":
/*!*************************************!*\
  !*** ./src/mooc/chaoxing/course.ts ***!
  \*************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CxHomeWork = exports.CxExamTopic = exports.CxCourse = void 0;
var application_1 = __webpack_require__(/*! @App/internal/application */ "./src/internal/application.ts");
var factory_1 = __webpack_require__(/*! @App/mooc/chaoxing/factory */ "./src/mooc/chaoxing/factory.ts");
var event_1 = __webpack_require__(/*! @App/internal/utils/event */ "./src/internal/utils/event.ts");
//课程任务
var CxCourse = /** @class */ (function (_super) {
    __extends(CxCourse, _super);
    function CxCourse() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.taskIndex = 0;
        return _this;
    }
    CxCourse.prototype.Init = function () {
        var _this = this;
        return new Promise(function (resolve) {
            var first = true;
            document.addEventListener("load", function (ev) {
                var el = (ev.srcElement || ev.target);
                if (el.id == "iframe") {
                    application_1.Application.App.log.Info("超星新窗口加载");
                    _this.OperateCard(el);
                    // 超星会有多次加载,所以使用一个flag变量,只回调一次
                    first && resolve(undefined);
                    first = false;
                }
            }, true);
        });
    };
    CxCourse.prototype.Stop = function () {
        throw new Error("Method not implemented.");
    };
    CxCourse.prototype.Next = function () {
        var _this = this;
        return new Promise(function (resolve) {
            if (_this.taskList.length > _this.taskIndex) {
                resolve(_this.taskList[_this.taskIndex]);
                return _this.taskIndex++;
            }
            // 当页任务点全部结束,翻页.由于会重新加载窗口调用reload,在加载完成之后再返回任务点.(本方法是同步调用,所以使用此种方法)
            _this.addEventListenerOnce("reload", function () { return __awaiter(_this, void 0, void 0, function () {
                var _a;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            _a = resolve;
                            return [4 /*yield*/, this.Next()];
                        case 1:
                            _a.apply(void 0, [_b.sent()]);
                            return [2 /*return*/];
                    }
                });
            }); });
            _this.nextPage(null);
        });
    };
    CxCourse.prototype.SetTaskPointer = function (index) {
        this.taskIndex = index;
    };
    // 操作任务卡,一个页面会包含很多任务,取出来
    CxCourse.prototype.OperateCard = function (iframe) {
        return __awaiter(this, void 0, void 0, function () {
            var iframeWindow, match, _loop_1, this_1, index;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        iframeWindow = iframe.contentWindow;
                        // 判断任务的参数
                        if (iframeWindow.mArg == undefined) {
                            match = iframeWindow.document.body.innerHTML.match(/try{\s+?mArg = (.*?);/);
                            if (!match) {
                                return [2 /*return*/];
                            }
                            iframeWindow.mArg = JSON.parse(match[1]);
                        }
                        // 任务的属性
                        this.attachments = iframeWindow.mArg.attachments;
                        this.taskList = new Array();
                        _loop_1 = function (index) {
                            var value, task;
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0:
                                        value = this_1.attachments[index];
                                        value.defaults = iframeWindow.mArg.defaults;
                                        // 任务工厂去创建对应的任务对象
                                        task = factory_1.TaskFactory.CreateCourseTask(iframeWindow, value);
                                        if (!task) {
                                            return [2 /*return*/, "continue"];
                                        }
                                        task.jobIndex = index;
                                        this_1.taskList.push(task);
                                        task.addEventListener("complete", function () {
                                            _this.callEvent("taskComplete", index, task);
                                        });
                                        return [4 /*yield*/, task.Init()];
                                    case 1:
                                        _a.sent();
                                        return [2 /*return*/];
                                }
                            });
                        };
                        this_1 = this;
                        index = 0;
                        _a.label = 1;
                    case 1:
                        if (!(index < this.attachments.length)) return [3 /*break*/, 4];
                        return [5 /*yield**/, _loop_1(index)];
                    case 2:
                        _a.sent();
                        _a.label = 3;
                    case 3:
                        index++;
                        return [3 /*break*/, 1];
                    case 4:
                        this.taskIndex = 0;
                        this.callEvent("reload");
                        return [2 /*return*/];
                }
            });
        });
    };
    CxCourse.prototype.afterPage = function () {
        //感觉奇葩的方法...
        var els = document.querySelectorAll("div.ncells > *:not(.currents) > .orange01");
        var now = document.querySelector("div.ncells > .currents");
        for (var i = 0; i < els.length; i++) {
            if (now.getBoundingClientRect().top < els[i].getBoundingClientRect().top) {
                return els[i];
            }
        }
        return null;
    };
    CxCourse.prototype.nextPage = function (num) {
        var _this = this;
        var el = document.querySelector("span.currents ~ span") || document.querySelector(".prev_next.next");
        if (el != undefined) {
            return el.click();
        }
        //只往后执行
        el = this.afterPage();
        if (el == undefined) {
            //进行有锁任务查找
            if (document.querySelector("div.ncells > *:not(.currents) > .lock") == undefined) {
                return this.callEvent("complete");
            }
            return setTimeout(function () {
                if (num > 5) {
                    return _this.callEvent("error", "被锁卡住了,请手动处理");
                }
                application_1.Application.App.log.Info("等待解锁");
                _this.nextPage(num + 1);
            }, 5000);
        }
        el.parentElement.querySelector("a>span").click();
    };
    return CxCourse;
}(event_1.EventListener));
exports.CxCourse = CxCourse;
// 考试
var CxExamTopic = /** @class */ (function () {
    function CxExamTopic() {
    }
    CxExamTopic.prototype.Init = function () {
        window.addEventListener("load", function () {
            var el = document.querySelector("#paperId");
            var info = "0";
            if (el) {
                info = el.value;
            }
            var task = factory_1.TaskFactory.CreateExamTopicTask(window, {
                refer: document.URL,
                id: "exam-" + info,
                info: info,
            });
            task.Init();
            if (document.URL.indexOf("exam/test/reVersionTestStartNew") > 0) {
                if (application_1.Application.App.config.auto) {
                    task.Start();
                }
            }
        });
    };
    return CxExamTopic;
}());
exports.CxExamTopic = CxExamTopic;
// 作业
var CxHomeWork = /** @class */ (function () {
    function CxHomeWork() {
    }
    CxHomeWork.prototype.Init = function () {
        window.onload = function () {
            var el = document.querySelector("#workLibraryId");
            var info = "";
            if (el) {
                info = el.value;
            }
            var task = factory_1.TaskFactory.CreateHomeworkTopicTask(window, {
                refer: document.URL,
                id: info,
                info: info,
            });
            task.Init();
            if (application_1.Application.App.config.auto && document.querySelector("#workLibraryId")) {
                task.Start();
            }
        };
    };
    return CxHomeWork;
}());
exports.CxHomeWork = CxHomeWork;


/***/ }),

/***/ "./src/mooc/chaoxing/factory.ts":
/*!**************************************!*\
  !*** ./src/mooc/chaoxing/factory.ts ***!
  \**************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TaskFactory = void 0;
var video_1 = __webpack_require__(/*! @App/mooc/chaoxing/video */ "./src/mooc/chaoxing/video.ts");
var topic_1 = __webpack_require__(/*! @App/mooc/chaoxing/topic */ "./src/mooc/chaoxing/topic.ts");
var question_1 = __webpack_require__(/*! @App/internal/app/question */ "./src/internal/app/question.ts");
var question_2 = __webpack_require__(/*! @App/mooc/chaoxing/question */ "./src/mooc/chaoxing/question.ts");
var application_1 = __webpack_require__(/*! @App/internal/application */ "./src/internal/application.ts");
var task_1 = __webpack_require__(/*! @App/mooc/chaoxing/task */ "./src/mooc/chaoxing/task.ts");
var utils_1 = __webpack_require__(/*! @App/mooc/chaoxing/utils */ "./src/mooc/chaoxing/utils.ts");
var utils_2 = __webpack_require__(/*! @App/internal/utils/utils */ "./src/internal/utils/utils.ts");
var special_1 = __webpack_require__(/*! @App/mooc/chaoxing/special */ "./src/mooc/chaoxing/special.ts");
// 任务工厂,创建对应的任务
var TaskFactory = /** @class */ (function () {
    function TaskFactory() {
    }
    TaskFactory.CreateCourseTask = function (context, taskinfo) {
        if (taskinfo.property.module == "insertaudio") {
            taskinfo.type = "audio";
        }
        //TODO:优化
        if (taskinfo.type != "video" && taskinfo.type != "workid" && taskinfo.type != "document"
            && taskinfo.type != "audio") {
            return null;
        }
        var task;
        var taskIframe = context.document.querySelector("iframe[jobid='" + taskinfo.jobid + "']");
        var prev;
        if (taskIframe == undefined) {
            taskIframe = context.document.querySelector("iframe[data*='" + taskinfo.property.mid + "'],iframe[objectid='" + taskinfo.property.objectid + "']");
            prev = document.createElement("div");
            taskIframe.parentElement.prepend(prev);
        }
        else {
            prev = taskIframe.previousElementSibling;
        }
        switch (taskinfo.type) {
            case "video": {
                var bar = new video_1.CxVideoControlBar(prev, new video_1.Video(taskIframe.contentWindow, taskinfo));
                task = bar.task;
                task.muted = application_1.Application.App.config.video_mute;
                task.playbackRate = application_1.Application.App.config.video_multiple;
                break;
            }
            case "workid": {
                var contentWindow = taskIframe.contentWindow.document.querySelector("#frame_content").contentWindow;
                taskinfo.refer = context.document.URL;
                taskinfo.id = taskinfo.property.workid;
                taskinfo.info = taskinfo.property.workid;
                var topic = new topic_1.CxCourseTopic(contentWindow, new question_1.ToolsQuestionBankFacade("cx", {
                    refer: context.document.URL,
                    id: taskinfo.property.workid, info: taskinfo.property.workid,
                }));
                topic.SetQueryQuestions(new topic_1.CxCourseQueryQuestion(contentWindow, function (context, el) {
                    return question_2.CxQuestionFactory.CreateCourseQuestion(context, el);
                }));
                var bar = new topic_1.CxTopicControlBar(prev, new topic_1.TopicAdapter(context, taskinfo, topic));
                if (application_1.Application.App.config.answer_ignore) {
                    return null;
                }
                task = bar.task;
                break;
            }
            case "document": {
                var bar = new task_1.CxTaskControlBar(prev, new special_1.CxDocumentTask(taskIframe.contentWindow, taskinfo));
                // bar.append(bar.download());
                task = bar.task;
                task.muted = application_1.Application.App.config.video_mute;
                task.playbackRate = application_1.Application.App.config.video_multiple;
                break;
            }
            case "audio": {
                var bar = new special_1.CxAudioControlBar(prev, new special_1.CxAudioTask(taskIframe.contentWindow, taskinfo));
                task = bar.task;
                task.muted = application_1.Application.App.config.video_mute;
                task.playbackRate = application_1.Application.App.config.video_multiple;
                break;
            }
            default:
                return null;
        }
        return task;
    };
    TaskFactory.CreateExamTopicTask = function (context, taskinfo) {
        var topic = new topic_1.ExamTopic(context, new question_1.ToolsQuestionBankFacade("cx", taskinfo));
        var task = new topic_1.TopicAdapter(context, taskinfo, topic);
        if (document.URL.indexOf("exam/test/reVersionTestStartNew") > 0) {
            topic.SetQueryQuestions(topic);
            var btn_1 = utils_1.CssBtn(utils_2.createBtn("搜索答案", "搜索题目答案"));
            document.querySelector(".Cy_ulBottom.clearfix.w-buttom,.Cy_ulTk,.Cy_ulBottom.clearfix").append(btn_1);
            btn_1.onclick = function () {
                btn_1.innerText = "答案搜索中...";
                try {
                    task.Start().then(function (ret) {
                        ret = ret || "搜索题目";
                        btn_1.innerText = question_1.QuestionStatusString(ret);
                    });
                }
                catch (e) {
                }
                return false;
            };
        }
        else {
            topic.SetQueryQuestions(new topic_1.CxCourseQueryQuestion(context, function (context, el) {
                return question_2.CxQuestionFactory.CreateExamCollectQuestion(context, el);
            }));
        }
        return task;
    };
    TaskFactory.CreateHomeworkTopicTask = function (context, taskinfo) {
        var _this = this;
        var bank = new question_1.ToolsQuestionBankFacade("cx", taskinfo);
        var topic = new topic_1.HomeworkTopic(context, bank);
        topic.SetQueryQuestions(new topic_1.CxCourseQueryQuestion(context, function (context, el) {
            return question_2.CxQuestionFactory.CreateHomeWorkQuestion(context, el);
        }));
        var task = new topic_1.TopicAdapter(context, taskinfo, topic);
        var btn = utils_1.CssBtn(utils_2.createBtn("搜索答案", "搜索题目答案"));
        if (document.querySelector("input#workRelationId")) {
            document.querySelector(".CyTop").append(btn);
            btn.onclick = function () { return __awaiter(_this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    btn.innerText = "答案搜索中...";
                    task.Start().then(function (ret) {
                        ret = ret || "搜索题目";
                        btn.innerText = question_1.QuestionStatusString(ret);
                    });
                    return [2 /*return*/];
                });
            }); };
        }
        return task;
    };
    return TaskFactory;
}());
exports.TaskFactory = TaskFactory;


/***/ }),

/***/ "./src/mooc/chaoxing/platform.ts":
/*!***************************************!*\
  !*** ./src/mooc/chaoxing/platform.ts ***!
  \***************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.CxPlatform = void 0;
var vcode_1 = __webpack_require__(/*! @App/internal/app/vcode */ "./src/internal/app/vcode.ts");
var course_1 = __webpack_require__(/*! ./course */ "./src/mooc/chaoxing/course.ts");
var vcode_2 = __webpack_require__(/*! ./vcode */ "./src/mooc/chaoxing/vcode.ts");
var video_1 = __webpack_require__(/*! ./video */ "./src/mooc/chaoxing/video.ts");
var read_1 = __webpack_require__(/*! @App/mooc/chaoxing/read */ "./src/mooc/chaoxing/read.ts");
var special_1 = __webpack_require__(/*! @App/mooc/chaoxing/special */ "./src/mooc/chaoxing/special.ts");
var application_1 = __webpack_require__(/*! @App/internal/application */ "./src/internal/application.ts");
var CxPlatform = /** @class */ (function () {
    function CxPlatform() {
    }
    CxPlatform.prototype.CreateMooc = function () {
        var url = document.URL;
        var mooc = null;
        if (url.indexOf("mycourse/studentstudy?") > 0) {
            new vcode_1.VCode(new vcode_2.CxCourseVCode()); //添加打码组件
            mooc = new course_1.CxCourse();
        }
        else if (url.indexOf("ananas/modules/video/index.html") > 0) {
            mooc = new video_1.CxVideoOptimization();
        }
        else if (url.indexOf("ananas/modules/audio/index.html") > 0) {
            mooc = new special_1.CxAudioOptimization();
        }
        else if ((url.indexOf("work/doHomeWorkNew") > 0 || url.indexOf("work/selectWorkQuestionYiPiYue") > 0) && self == top) {
            mooc = new course_1.CxHomeWork();
        }
        else if (url.indexOf("exam/test/reVersionTestStartNew") > 0 || url.indexOf("exam/test/reVersionPaperMarkContentNew") > 0) {
            mooc = new course_1.CxExamTopic();
        }
        else if (url.indexOf("/course/") > 0) {
            mooc = new read_1.ReadStartPage();
        }
        else if (url.indexOf("ztnodedetailcontroller/visitnodedetail") > 0) {
            mooc = new read_1.Read();
        }
        else if (url.indexOf("exam/test?") > 0) {
            mooc = new read_1.Exam();
        }
        if (mooc) {
            application_1.Application.App.config.SetNamespace("cx");
        }
        return mooc;
    };
    return CxPlatform;
}());
exports.CxPlatform = CxPlatform;


/***/ }),

/***/ "./src/mooc/chaoxing/question.ts":
/*!***************************************!*\
  !*** ./src/mooc/chaoxing/question.ts ***!
  \***************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.CxQuestionFactory = void 0;
var utils_1 = __webpack_require__(/*! @App/internal/utils/utils */ "./src/internal/utils/utils.ts");
var question_1 = __webpack_require__(/*! @App/internal/app/question */ "./src/internal/app/question.ts");
var utils_2 = __webpack_require__(/*! ./utils */ "./src/mooc/chaoxing/utils.ts");
//TODO: 优化
var CxQuestionFactory = /** @class */ (function () {
    function CxQuestionFactory() {
    }
    CxQuestionFactory.CreateCourseQuestion = function (context, el) {
        var ret = question_1.SwitchTopicType(utils_1.substrex(el.innerText, '【', '】'));
        return this.CreateCourseQuestionByTopicType(context, ret, el);
    };
    CxQuestionFactory.CreateExamQuestion = function (context, type, el) {
        var processor = new ExamQuestionProcessor();
        var ret = null;
        this.RemoveNotice(el);
        switch (type) {
            case 1:
            case 2: {
                ret = new cxExamSelectQuestion(context, el, type, processor);
                break;
            }
            case 3: {
                ret = new cxExamJudgeQuestion(context, el, type, processor);
                break;
            }
            case 4: {
                ret = new cxExamFillQuestion(context, el, type, processor);
                break;
            }
            default: {
                this.AddNotice(el, "不支持的类型");
                return null;
            }
        }
        return ret;
    };
    CxQuestionFactory.CreateCourseQuestionByTopicType = function (context, type, el) {
        var ret = null;
        var processor = new CourseQuestionProcessor();
        this.RemoveNotice(el);
        switch (type) {
            case 1:
            case 2: {
                ret = new cxSelectQuestion(context, el, type, processor);
                break;
            }
            case 3: {
                ret = new cxJudgeQuestion(context, el, type, processor);
                break;
            }
            case 4: {
                ret = new cxFillQuestion(context, el, type, processor);
                break;
            }
            default: {
                this.AddNotice(el, "不支持的类型");
                return null;
            }
        }
        return ret;
    };
    CxQuestionFactory.getBeforeType = function (el) {
        var before = el.previousElementSibling;
        do {
            if (before.className == "Cy_TItle1") {
                return before;
            }
            before = before.previousElementSibling;
        } while (before != null);
        return null;
    };
    CxQuestionFactory.CreateHomeWorkQuestion = function (context, el) {
        var ret = CxQuestionFactory.getBeforeType(el);
        return this.CreateCourseQuestionByTopicType(context, question_1.SwitchTopicType(utils_1.substrex(ret.innerText, ".", "（")), el);
    };
    //TODO:写的什么玩意啊
    CxQuestionFactory.CreateExamCollectQuestion = function (context, el) {
        var ret = CxQuestionFactory.getBeforeType(el.parentElement);
        var txt = ret.innerText.match(/、(.*?)[\s|（]/)[1];
        return this.CreateExamQuestionByTopicType(context, question_1.SwitchTopicType(txt), el);
    };
    CxQuestionFactory.CreateExamQuestionByTopicType = function (context, type, el) {
        var ret = null;
        var processor = new CourseQuestionProcessor();
        this.RemoveNotice(el);
        switch (type) {
            case 1:
            case 2: {
                ret = new cxSelectQuestion(context, el, type, processor);
                break;
            }
            case 3: {
                ret = new cxJudgeQuestion(context, el, type, processor);
                break;
            }
            case 4: {
                ret = new cxExamFillQuestion(context, el, type, processor);
                break;
            }
            default: {
                this.AddNotice(el, "不支持的类型");
                return null;
            }
        }
        return ret;
    };
    CxQuestionFactory.RemoveNotice = function (el) {
        var tmpel = el.querySelector(".clearfix > ul,.clearfix > .Py_tk,.Zy_ulTk");
        if (tmpel == undefined) {
            tmpel = el;
        }
        tmpel.querySelectorAll(".prompt-line-answer").forEach(function (v) {
            v.remove();
        });
    };
    CxQuestionFactory.AddNotice = function (el, str) {
        var tmpel = el.querySelector(".clearfix > ul,.clearfix > .Py_tk,.Zy_ulTk");
        if (tmpel == undefined) {
            tmpel = el;
        }
        utils_2.CreateNoteLine(str, "answer", tmpel);
    };
    return CxQuestionFactory;
}());
exports.CxQuestionFactory = CxQuestionFactory;
var CourseQuestionProcessor = /** @class */ (function () {
    function CourseQuestionProcessor() {
    }
    CourseQuestionProcessor.prototype.GetTopic = function (el) {
        var ret = el.querySelector(".Zy_TItle > .clearfix,.Cy_TItle > .clearfix").innerHTML;
        ret = ret.substring(ret.indexOf('】') + 1);
        if (/（(.+?)分）($|\s)/.test(ret)) {
            ret = ret.substring(0, ret.lastIndexOf("（"));
        }
        return ret;
    };
    return CourseQuestionProcessor;
}());
var ExamQuestionProcessor = /** @class */ (function () {
    function ExamQuestionProcessor() {
    }
    ExamQuestionProcessor.prototype.GetTopic = function (el) {
        var ret = el.querySelector(".Cy_TItle.clearfix .clearfix").innerHTML;
        ret = ret.substr(0, ret.lastIndexOf('分）'));
        ret = ret.substr(0, ret.lastIndexOf('（'));
        return ret;
    };
    return ExamQuestionProcessor;
}());
var cxQuestion = /** @class */ (function () {
    function cxQuestion(context, el, type, processor) {
        this.context = context;
        this.el = el;
        this.type = type;
        this.processor = processor;
    }
    cxQuestion.prototype.SetStatus = function (status) {
        this.AddNotice(question_1.TopicStatusString(status));
    };
    cxQuestion.prototype.GetTopic = function () {
        return this.processor.GetTopic(this.el);
    };
    cxQuestion.prototype.RemoveNotice = function () {
        CxQuestionFactory.RemoveNotice(this.el);
    };
    cxQuestion.prototype.AddNotice = function (str) {
        CxQuestionFactory.AddNotice(this.el, str);
    };
    cxQuestion.prototype.GetType = function () {
        return this.type;
    };
    cxQuestion.prototype.options = function () {
        var tmpel = this.el.querySelector(".clearfix > ul,.clearfix ul.Zy_ulBottom.clearfix,ul.Zy_ulTk");
        var list = tmpel.querySelectorAll("li");
        return list;
    };
    cxQuestion.prototype.isCorrect = function () {
        var el = this.el.querySelector(".Py_answer.clearfix,.Py_tk");
        if (el) {
            if (el.querySelectorAll('.fr.dui').length > 0 || el.querySelectorAll('.fr.bandui').length > 0) {
                return el;
            }
            else if (el.innerHTML.indexOf('正确答案') >= 0) {
                return el;
            }
        }
        var topic = this.el.querySelector(".Cy_TItle.clearfix");
        if (!topic) {
            return null;
        }
        var fs = topic.querySelector(".font18.fb");
        if (fs && fs.innerHTML != "0.0") {
            return el;
        }
        return null;
    };
    cxQuestion.prototype.defaultAnswer = function () {
        var ret = new question_1.PushAnswer();
        ret.topic = this.GetTopic();
        ret.type = this.GetType();
        ret.correct = new Array();
        ret.answers = new Array();
        return ret;
    };
    return cxQuestion;
}());
var cxSelectQuestion = /** @class */ (function (_super) {
    __extends(cxSelectQuestion, _super);
    function cxSelectQuestion() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    cxSelectQuestion.prototype.getContent = function (el) {
        var ret = el.querySelector("a");
        if (ret == null) {
            var tmpel = el.querySelector("label > input,input");
            if (tmpel.value == "true") {
                return "对√";
            }
            return "错×";
        }
        return ret.innerHTML;
    };
    cxSelectQuestion.prototype.getOption = function (el) {
        return el.querySelector("input").value;
    };
    cxSelectQuestion.prototype.click = function (el, content) {
        var ipt = el.querySelector("label > input");
        if (!ipt.checked) {
            ipt.click();
        }
        this.AddNotice(this.getOption(el) + ":" + content);
    };
    cxSelectQuestion.prototype.Random = function () {
        var options = this.options();
        var pos = utils_1.randNumber(0, options.length - 1);
        this.click(options[pos], this.getContent(options[pos]));
        return "random";
    };
    cxSelectQuestion.prototype.Fill = function (s) {
        var _this = this;
        return new Promise(function (resolve) {
            var options = _this.options();
            var flag = false;
            for (var i = 0; i < s.correct.length; i++) {
                for (var j = 0; j < options.length; j++) {
                    if (s.correct[i].content.trim() == "") {
                        if (_this.getOption(options[j]) == s.correct[i].option) {
                            _this.click(options[j], _this.getContent(options[j]));
                            flag = true;
                        }
                    }
                    else if (s.Equal(_this.getContent(options[j]), s.correct[i].content)) {
                        _this.click(options[j], s.correct[i].content);
                        flag = true;
                    }
                }
            }
            if (flag) {
                return resolve("ok");
            }
            return resolve("no_match");
        });
    };
    cxSelectQuestion.prototype.Correct = function () {
        var correct = this.isCorrect();
        if (correct == null) {
            return null;
        }
        var ret = this.defaultAnswer();
        var options = this.el.querySelectorAll(".Zy_ulTop > li.clearfix,.Cy_ulTop li");
        var correctText = correct.querySelector("span").innerText;
        for (var i = 0; i < options.length; i++) {
            var optionText = options[i].querySelector("i.fl").innerText;
            var option = {
                option: optionText.substring(0, 1),
                content: options[i].querySelector("a.fl,a").innerHTML,
            };
            ret.answers.push(option);
            if (correctText.indexOf(option.option) > 0) {
                ret.correct.push(option);
            }
        }
        return ret;
    };
    return cxSelectQuestion;
}(cxQuestion));
var cxJudgeQuestion = /** @class */ (function (_super) {
    __extends(cxJudgeQuestion, _super);
    function cxJudgeQuestion() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    cxJudgeQuestion.prototype.getContent = function (el) {
        var tmpel = el.querySelector("label > input,input");
        if (tmpel.value == "true") {
            return "对√";
        }
        return "错×";
    };
    cxJudgeQuestion.prototype.click = function (el) {
        var tmpel = el.querySelector("label > input,input");
        if (!tmpel.checked) {
            tmpel.click();
        }
        this.AddNotice(this.getContent(el));
    };
    cxJudgeQuestion.prototype.Random = function () {
        var options = this.options();
        var pos = utils_1.randNumber(0, 1);
        this.click(options[pos]);
        return "random";
    };
    cxJudgeQuestion.prototype.Fill = function (answer) {
        var _this = this;
        return new Promise(function (resolve) {
            var options = _this.options();
            _this.click(options[answer.correct[0].content ? 0 : 1]);
            return resolve("ok");
        });
    };
    cxJudgeQuestion.prototype.Correct = function () {
        var el = this.el.querySelector(".Py_answer.clearfix");
        var ret = this.defaultAnswer();
        var score = this.el.querySelector(".Cy_TItle.clearfix .font18.fb");
        if (el.innerHTML.indexOf('正确答案') !== -1 || (score && score.querySelector(".Cy_TItle.clearfix .font18.fb").innerHTML != "0.0")) {
            var correctText_1 = el.querySelector("span").innerText;
            if (correctText_1.indexOf('×') !== -1) {
                ret.correct.push({ option: false, content: false });
            }
            else {
                ret.correct.push({ option: true, content: true });
            }
            return ret;
        }
        if (!el.querySelectorAll('.fr.dui').length && !el.querySelectorAll('.fr.cuo').length) {
            return null;
        }
        var correctText = el.querySelector("span").innerText;
        if (el.querySelectorAll('.fr.dui').length) {
            if (correctText.indexOf('×') !== -1) {
                ret.correct.push({ option: false, content: false });
            }
            else {
                ret.correct.push({ option: true, content: true });
            }
        }
        else {
            if (correctText.indexOf('×') !== -1) {
                ret.correct.push({ option: true, content: true });
            }
            else {
                ret.correct.push({ option: false, content: false });
            }
        }
        return ret;
    };
    return cxJudgeQuestion;
}(cxSelectQuestion));
var cxFillQuestion = /** @class */ (function (_super) {
    __extends(cxFillQuestion, _super);
    function cxFillQuestion() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    cxFillQuestion.prototype.getOption = function (el) {
        if (el.className == "XztiHover1") {
            return utils_1.substrex(el.previousElementSibling.innerHTML, "第", "空");
        }
        var tmpel = el.querySelector("span.fb");
        return utils_1.substrex(tmpel.innerHTML, "第", "空");
    };
    cxFillQuestion.prototype.Random = function () {
        return "no_support_random";
    };
    cxFillQuestion.prototype.Correct = function () {
        var correct = this.isCorrect();
        if (correct == null) {
            return null;
        }
        var ret = this.defaultAnswer();
        var options = this.el.querySelectorAll(".Py_tk span.font14");
        var isMy = false;
        if (options.length <= 0) {
            isMy = true;
            options = this.el.querySelectorAll(".Py_answer.clearfix .font14");
        }
        for (var i = 0; i < options.length; i++) {
            if (isMy && options[i].querySelectorAll(".fr.dui").length <= 0) {
                continue;
            }
            var optionEl = options[i].querySelector("i.fl");
            var option = {
                option: utils_1.substrex(optionEl.innerHTML, "第", "空"),
                content: options[i].querySelector(".clearfix").innerText,
            };
            ret.correct.push(option);
        }
        return ret;
    };
    cxFillQuestion.prototype.Fill = function (answer) {
        var _this = this;
        return new Promise(function (resolve) {
            var options = _this.options();
            if (!options.length) {
                options = _this.el.querySelector('.Zy_ulTk').querySelectorAll(".XztiHover1");
            }
            var flag = 0;
            for (var i = 0; i < answer.correct.length; i++) {
                for (var j = 0; j < options.length; j++) {
                    if (_this.getOption(options[j]) == answer.correct[i].option) {
                        flag++;
                        var el = options[j].querySelector("input.inp");
                        if (!el) {
                            var uedit = _this.context.$(options[j]).find('textarea');
                            if (uedit.length <= 0) {
                                _this.AddNotice(_this.getOption(options[j]) + "空发生了一个错误");
                                continue;
                            }
                            _this.context.UE.getEditor(uedit.attr('name')).setContent(answer.correct[i].content);
                            _this.AddNotice(_this.getOption(options[j]) + ":" + answer.correct[i].content);
                        }
                        else {
                            el.value = utils_1.removeHTMLTag(answer.correct[i].content);
                            _this.AddNotice(_this.getOption(options[j]) + ":" + answer.correct[i].content);
                        }
                    }
                }
            }
            if (flag == options.length) {
                return resolve("ok");
            }
            return resolve("no_match");
        });
    };
    return cxFillQuestion;
}(cxQuestion));
//TODO: 优化
var cxExamSelectQuestion = /** @class */ (function (_super) {
    __extends(cxExamSelectQuestion, _super);
    function cxExamSelectQuestion() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    cxExamSelectQuestion.prototype.options = function () {
        return this.el.querySelectorAll(".Cy_ulBottom.clearfix.w-buttom li input");
    };
    cxExamSelectQuestion.prototype.getContent = function (el) {
        var textOption = this.el.querySelectorAll(".Cy_ulTop.w-top li div.clearfix a");
        var tmpli = el.parentElement.parentElement;
        var pos = -1;
        do {
            tmpli = tmpli.previousElementSibling;
            pos++;
        } while (tmpli != null);
        return textOption[pos].innerHTML;
    };
    cxExamSelectQuestion.prototype.getOption = function (el) {
        return el.parentElement.innerText;
    };
    cxExamSelectQuestion.prototype.click = function (el, content) {
        el.click();
        this.AddNotice(this.getOption(el) + ":" + content);
    };
    return cxExamSelectQuestion;
}(cxSelectQuestion));
var cxExamFillQuestion = /** @class */ (function (_super) {
    __extends(cxExamFillQuestion, _super);
    function cxExamFillQuestion() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    cxExamFillQuestion.prototype.options = function () {
        return this.el.querySelectorAll(".Cy_ulTk .XztiHover1");
    };
    cxExamFillQuestion.prototype.getOption = function (el) {
        var tmpel = el.querySelector(".fb.font14");
        return utils_1.substrex(tmpel.innerHTML, "第", "空");
    };
    cxExamFillQuestion.prototype.Fill = function (answer) {
        var _this = this;
        return new Promise(function (resolve) {
            var options = _this.options();
            var flag = 0;
            for (var i = 0; i < answer.correct.length; i++) {
                for (var j = 0; j < options.length; j++) {
                    if (_this.getOption(options[j]) == answer.correct[i].option) {
                        flag++;
                        var uedit = window.$(options[j]).find('textarea');
                        if (uedit.length <= 0) {
                            _this.AddNotice(_this.getOption(options[j]) + "空发生了一个错误");
                            continue;
                        }
                        window.UE.getEditor(uedit.attr('name')).setContent(answer.correct[i].content);
                        _this.AddNotice(_this.getOption(options[j]) + ":" + answer.correct[i].content);
                    }
                }
            }
            if (flag == options.length) {
                return resolve("ok");
            }
            return resolve("no_match");
        });
    };
    cxExamFillQuestion.prototype.Correct = function () {
        var correct = this.isCorrect();
        if (correct == null) {
            return null;
        }
        var ret = this.defaultAnswer();
        var options = this.el.querySelectorAll(".Py_tk div[id] span.font14");
        var isMy = false;
        if (options.length <= 0) {
            isMy = true;
            options = this.el.querySelectorAll(".Py_answer.clearfix .font14");
        }
        for (var i = 0; i < options.length; i++) {
            if (isMy && options[i].querySelectorAll(".fr.dui").length <= 0) {
                continue;
            }
            var optionEl = options[i].querySelector("i");
            var option = {
                option: utils_1.substrex(optionEl.innerHTML, "第", "空"),
                content: options[i].innerHTML.substr(options[i].innerHTML.indexOf("</i>") + 4),
            };
            ret.correct.push(option);
        }
        return ret;
    };
    return cxExamFillQuestion;
}(cxFillQuestion));
var cxExamJudgeQuestion = /** @class */ (function (_super) {
    __extends(cxExamJudgeQuestion, _super);
    function cxExamJudgeQuestion() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    cxExamJudgeQuestion.prototype.options = function () {
        return this.el.querySelectorAll(".Cy_ulBottom.clearfix li");
    };
    return cxExamJudgeQuestion;
}(cxJudgeQuestion));


/***/ }),

/***/ "./src/mooc/chaoxing/read.ts":
/*!***********************************!*\
  !*** ./src/mooc/chaoxing/read.ts ***!
  \***********************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.Exam = exports.ReadStartPage = exports.Read = void 0;
var application_1 = __webpack_require__(/*! @App/internal/application */ "./src/internal/application.ts");
var utils_1 = __webpack_require__(/*! @App/internal/utils/utils */ "./src/internal/utils/utils.ts");
var question_1 = __webpack_require__(/*! @App/internal/app/question */ "./src/internal/app/question.ts");
var Read = /** @class */ (function () {
    function Read() {
    }
    Read.prototype.Init = function () {
        var timer;
        var slide = function () {
            if (window.getScrollHeight() - window.getHeight() <= window.getScrollTop() + 40) {
                var next = document.querySelectorAll('.mb15.course_section > a.wh.wh');
                var flag = false;
                for (var i = 0; i < next.length; i++) {
                    if (flag) {
                        next[i].click();
                        return;
                    }
                    if (document.URL == next[i].href) {
                        flag = true;
                    }
                }
                application_1.Application.App.log.Warn("阅读完成啦~");
                clearTimeout(timer);
                return;
            }
            window.scrollTo(0, window.getScrollTop() + utils_1.randNumber(60, 80));
            timer = setTimeout(slide, utils_1.randNumber(10, 20) * 500);
        };
        window.addEventListener("load", function () {
            slide();
        });
    };
    return Read;
}());
exports.Read = Read;
var ReadStartPage = /** @class */ (function () {
    function ReadStartPage() {
    }
    ReadStartPage.prototype.Init = function () {
        window.addEventListener("load", function () {
            if (!application_1.Application.App.config.auto) {
                return application_1.Application.App.log.Info("开启自动挂机能够自动阅读文章哦");
            }
            application_1.Application.App.log.Info("请在10秒内选择章节,否则扩展将从第一章自动开始");
            setTimeout(function () {
                var el = document.querySelector(".mb15.course_section.fix");
                el.querySelector("a").click();
            }, 10000);
        });
    };
    return ReadStartPage;
}());
exports.ReadStartPage = ReadStartPage;
var Exam = /** @class */ (function () {
    function Exam() {
    }
    Exam.prototype.Init = function () {
        var bank = new question_1.ToolsQuestionBank("cx");
        window.addEventListener("load", function () {
            var str = application_1.Application.GlobalContext.document.documentElement.innerHTML;
            var m;
            var regex = new RegExp(/goTest\(.*?,(\d+),\d+,.*?,(\d+),false,/g);
            var info = new Array();
            while ((m = regex.exec(str)) !== null) {
                var tmp = { refer: document.URL, id: "exam-" + m[2], info: m[2] };
                info.push(tmp);
            }
            regex = new RegExp(/lookUpPaper\('(\d+)','\d+','(\d+)'/g);
            while ((m = regex.exec(str)) !== null) {
                var tmp = { refer: document.URL, id: "exam-" + m[2], info: m[2] };
                info.push(tmp);
            }
            bank.CheckCourse(info);
        });
    };
    return Exam;
}());
exports.Exam = Exam;


/***/ }),

/***/ "./src/mooc/chaoxing/special.ts":
/*!**************************************!*\
  !*** ./src/mooc/chaoxing/special.ts ***!
  \**************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.CxAudioControlBar = exports.CxAudioTask = exports.CxAudioOptimization = exports.CxDocumentTask = void 0;
var task_1 = __webpack_require__(/*! @App/mooc/chaoxing/task */ "./src/mooc/chaoxing/task.ts");
var utils_1 = __webpack_require__(/*! @App/internal/utils/utils */ "./src/internal/utils/utils.ts");
var application_1 = __webpack_require__(/*! @App/internal/application */ "./src/internal/application.ts");
var video_1 = __webpack_require__(/*! @App/mooc/chaoxing/video */ "./src/mooc/chaoxing/video.ts");
var utils_2 = __webpack_require__(/*! @App/mooc/chaoxing/utils */ "./src/mooc/chaoxing/utils.ts");
var hook_1 = __webpack_require__(/*! @App/internal/utils/hook */ "./src/internal/utils/hook.ts");
var CxDocumentTask = /** @class */ (function (_super) {
    __extends(CxDocumentTask, _super);
    function CxDocumentTask() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    CxDocumentTask.prototype.Start = function () {
        var _this = this;
        return new Promise(function (resolve) {
            var next = function () {
                var el = _this.context.document.querySelector(".imglook > .mkeRbtn");
                if (el.style.visibility == "hidden") {
                    _this.callEvent("complete");
                    return;
                }
                el.click();
                _this.time = _this.context.setTimeout(next, utils_1.randNumber(1, 5) * 1000);
                resolve();
            };
            _this.time = _this.context.setTimeout(next, utils_1.randNumber(1, 5) * 1000);
        });
    };
    CxDocumentTask.prototype.Type = function () {
        return "document";
    };
    return CxDocumentTask;
}(task_1.CxTask));
exports.CxDocumentTask = CxDocumentTask;
var CxAudioOptimization = /** @class */ (function (_super) {
    __extends(CxAudioOptimization, _super);
    function CxAudioOptimization() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    CxAudioOptimization.prototype.Init = function () {
        var _this = this;
        //对播放器进行优化
        window.addEventListener("load", function () {
            application_1.Application.App.config.super_mode && utils_1.isPhone() && (application_1.Application.GlobalContext.Ext.isChaoxing = true);
        });
        this.hook();
        document.addEventListener("readystatechange", function () {
            _this.hook();
        });
        this.Api();
    };
    CxAudioOptimization.prototype.hook = function () {
        if (document.readyState != "interactive") {
            return;
        }
        application_1.Application.App.log.Debug("hook cx audio");
        var self = this;
        var paramHook = new hook_1.Hook("params2VideoOpt", application_1.Application.GlobalContext.ans.AudioJs.prototype);
        paramHook.Middleware(function (next) {
            var args = [];
            for (var _i = 1; _i < arguments.length; _i++) {
                args[_i - 1] = arguments[_i];
            }
            self.param = args[0];
            return next.apply(this, args);
        });
        application_1.Application.GlobalContext.Ext.isSogou = false;
    };
    return CxAudioOptimization;
}(video_1.CxVideoOptimization));
exports.CxAudioOptimization = CxAudioOptimization;
var CxAudioTask = /** @class */ (function (_super) {
    __extends(CxAudioTask, _super);
    function CxAudioTask() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    CxAudioTask.prototype.queryVideo = function () {
        return this.context.document.getElementById("audio_html5_api");
    };
    return CxAudioTask;
}(video_1.Video));
exports.CxAudioTask = CxAudioTask;
var CxAudioControlBar = /** @class */ (function (_super) {
    __extends(CxAudioControlBar, _super);
    function CxAudioControlBar() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    CxAudioControlBar.prototype.defaultBtn = function () {
        var _this = this;
        _super.prototype.defaultBtn.call(this);
        var pass = utils_2.CssBtn(utils_1.createBtn("秒过嘤频", "秒过会被后台检测到", "cx-btn"));
        pass.style.background = "#F57C00";
        pass.onclick = function () {
            if (!utils_1.protocolPrompt("秒过会产生不良记录,是否继续?", "boom_audio_no_prompt")) {
                return;
            }
            _this.task.sendEndTimePack(function (isPassed) {
                if (isPassed) {
                    alert('秒过成功,刷新后查看效果');
                }
                else {
                    alert('操作失败,错误');
                }
            });
        };
        // this.prev.append(pass, this.download());
    };
    return CxAudioControlBar;
}(task_1.CxTaskControlBar));
exports.CxAudioControlBar = CxAudioControlBar;


/***/ }),

/***/ "./src/mooc/chaoxing/task.ts":
/*!***********************************!*\
  !*** ./src/mooc/chaoxing/task.ts ***!
  \***********************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CxTaskControlBar = exports.CxTask = void 0;
var utils_1 = __webpack_require__(/*! @App/mooc/chaoxing/utils */ "./src/mooc/chaoxing/utils.ts");
var utils_2 = __webpack_require__(/*! @App/internal/utils/utils */ "./src/internal/utils/utils.ts");
var application_1 = __webpack_require__(/*! @App/internal/application */ "./src/internal/application.ts");
var task_1 = __webpack_require__(/*! @App/internal/app/task */ "./src/internal/app/task.ts");
var CxTask = /** @class */ (function (_super) {
    __extends(CxTask, _super);
    function CxTask(context, taskinfo) {
        var _this = _super.call(this) || this;
        _this.taskinfo = taskinfo;
        _this.context = context;
        if (_this.taskinfo.job) {
            _this.done = false;
        }
        else {
            _this.done = true;
        }
        return _this;
    }
    CxTask.prototype.callEvent = function (event) {
        var args = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            args[_i - 1] = arguments[_i];
        }
        if (event == "complete") {
            this.done = true;
        }
        _super.prototype.callEvent.apply(this, __spreadArrays([event], args));
    };
    CxTask.prototype.Init = function () {
        return new Promise(function (resolve) {
            resolve();
        });
    };
    CxTask.prototype.Submit = function () {
        return new Promise(function (resolve) {
            resolve();
        });
    };
    //TODO:停止
    CxTask.prototype.Stop = function () {
        return new Promise(function (resolve) {
            resolve();
        });
    };
    CxTask.prototype.Done = function () {
        return this.done;
    };
    return CxTask;
}(task_1.Task));
exports.CxTask = CxTask;
var CxTaskControlBar = /** @class */ (function () {
    function CxTaskControlBar(prev, task) {
        this.task = task;
        this.prev = document.createElement("div");
        prev.style.textAlign = "center";
        prev.style.width = "100%";
        prev.prepend(this.prev);
        this.defaultBtn();
    }
    CxTaskControlBar.prototype.defaultBtn = function () {
        var _this = this;
        var startBtn = utils_1.CssBtn(utils_2.createBtn(application_1.Application.App.config.auto ? "暂停挂机" : "开始挂机", "点击开始自动挂机", "cx-btn"));
        startBtn.onclick = function () {
            if (startBtn.innerText == '暂停挂机') {
                application_1.Application.App.config.auto = false;
                startBtn.innerText = "开始挂机";
                startBtn.title = "点击开始自动挂机";
                application_1.Application.App.log.Info("挂机停止了");
            }
            else {
                application_1.Application.App.config.auto = true;
                startBtn.innerText = '暂停挂机';
                startBtn.title = "停止挂机,开始好好学习";
                application_1.Application.App.log.Info("挂机开始了");
                _this.task.Start();
            }
        };
        this.prev.append(startBtn);
    };
    CxTaskControlBar.prototype.append = function (el) {
        this.prev.append(el);
    };
    return CxTaskControlBar;
}());
exports.CxTaskControlBar = CxTaskControlBar;


/***/ }),

/***/ "./src/mooc/chaoxing/topic.ts":
/*!************************************!*\
  !*** ./src/mooc/chaoxing/topic.ts ***!
  \************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.HomeworkTopic = exports.ExamTopic = exports.CxCourseTopic = exports.CxCourseQueryQuestion = exports.TopicAdapter = exports.CxTopicControlBar = void 0;
var utils_1 = __webpack_require__(/*! ./utils */ "./src/mooc/chaoxing/utils.ts");
var utils_2 = __webpack_require__(/*! @App/internal/utils/utils */ "./src/internal/utils/utils.ts");
var application_1 = __webpack_require__(/*! @App/internal/application */ "./src/internal/application.ts");
var question_1 = __webpack_require__(/*! @App/internal/app/question */ "./src/internal/app/question.ts");
var question_2 = __webpack_require__(/*! ./question */ "./src/mooc/chaoxing/question.ts");
var topic_1 = __webpack_require__(/*! @App/internal/app/topic */ "./src/internal/app/topic.ts");
var task_1 = __webpack_require__(/*! @App/mooc/chaoxing/task */ "./src/mooc/chaoxing/task.ts");
var CxTopicControlBar = /** @class */ (function (_super) {
    __extends(CxTopicControlBar, _super);
    function CxTopicControlBar() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    CxTopicControlBar.prototype.defaultBtn = function () {
        var _this = this;
        _super.prototype.defaultBtn.call(this);
        var topic = utils_1.CssBtn(utils_2.createBtn("使用棚子AIGC", "手动填完答案，再开启挂机", "cx-btn"));
        topic.style.background = "#3fae93";
        this.prev.append(topic);
        // 绑定事件
        topic.onclick = function () { return __awaiter(_this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                topic.innerText = "答案搜索中111...";
                this.task.Start().then(function (ret) {
                    ret = ret || "搜索题目111";
                    topic.innerText = question_1.QuestionStatusString(ret);
                });
                return [2 /*return*/];
            });
        }); };
    };
    return CxTopicControlBar;
}(task_1.CxTaskControlBar));
exports.CxTopicControlBar = CxTopicControlBar;
var TopicAdapter = /** @class */ (function (_super) {
    __extends(TopicAdapter, _super);
    function TopicAdapter(context, taskinfo, topic) {
        var _this = _super.call(this, context, taskinfo) || this;
        _this.topic = topic;
        return _this;
    }
    TopicAdapter.prototype.Init = function () {
        var _this = this;
        return new Promise(function (resolve) { return __awaiter(_this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        application_1.Application.App.log.Debug("题目信息", this.taskinfo);
                        return [4 /*yield*/, this.topic.Init()];
                    case 1:
                        _a.sent();
                        resolve(undefined);
                        return [2 /*return*/];
                }
            });
        }); });
    };
    TopicAdapter.prototype.Start = function () {
        var _this = this;
        return new Promise(function (resolve) { return __awaiter(_this, void 0, void 0, function () {
            var ret;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (this.lock) {
                            return [2 /*return*/, resolve("processing")];
                        }
                        this.lock = true;
                        return [4 /*yield*/, this.topic.QueryAnswer()];
                    case 1:
                        ret = _a.sent();
                        this.status = ret;
                        this.callEvent("complete");
                        this.lock = false;
                        return [2 /*return*/, resolve(ret)];
                }
            });
        }); });
    };
    TopicAdapter.prototype.Type = function () {
        return "topic";
    };
    TopicAdapter.prototype.Submit = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                return [2 /*return*/, new Promise(function (resolve) {
                        if (_this.status == "success") {
                            _this.topic.Submit().then(function () {
                                resolve();
                            });
                        }
                        else {
                            resolve();
                        }
                    })];
            });
        });
    };
    return TopicAdapter;
}(task_1.CxTask));
exports.TopicAdapter = TopicAdapter;
var CxCourseQueryQuestion = /** @class */ (function () {
    function CxCourseQueryQuestion(content, createQuestion) {
        this.context = content;
        this.createQuestion = createQuestion;
    }
    CxCourseQueryQuestion.prototype.QueryQuestions = function () {
        var _this = this;
        var timu = this.context.document.querySelectorAll(".TiMu");
        var ret = new Array();
        timu.forEach(function (val) {
            var question = _this.createQuestion(_this.context, val);
            if (question == null) {
                return;
            }
            ret.push(question);
        });
        return ret;
    };
    return CxCourseQueryQuestion;
}());
exports.CxCourseQueryQuestion = CxCourseQueryQuestion;
var CxCourseTopic = /** @class */ (function (_super) {
    __extends(CxCourseTopic, _super);
    function CxCourseTopic(content, answer) {
        var _this = _super.call(this, content, answer) || this;
        answer.CheckCourse();
        return _this;
    }
    CxCourseTopic.prototype.Init = function () {
        var _this = this;
        return new Promise(function (resolve) {
            var timer = _this.context.setInterval(function () { return __awaiter(_this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            if (!(this.context.document.readyState == "complete")) return [3 /*break*/, 3];
                            this.context.clearInterval(timer);
                            if (!(this.context.document.URL.indexOf("selectWorkQuestionYiPiYue") > 0)) return [3 /*break*/, 2];
                            return [4 /*yield*/, this.CollectAnswer()];
                        case 1:
                            _a.sent();
                            _a.label = 2;
                        case 2:
                            resolve(undefined);
                            _a.label = 3;
                        case 3: return [2 /*return*/];
                    }
                });
            }); }, 500);
        });
    };
    CxCourseTopic.prototype.QueryAnswer = function () {
        if (this.context.document.URL.indexOf("selectWorkQuestionYiPiYue") > 0) {
            return null;
        }
        return _super.prototype.QueryAnswer.call(this);
    };
    CxCourseTopic.prototype.Submit = function () {
        var _this = this;
        return new Promise(function (resolve) {
            application_1.Application.App.log.Info("准备提交答案");
            var self = _this;
            _this.context.setTimeout(function () {
                var submit = _this.context.document.querySelector(".Btn_blue_1");
                submit.click();
                _this.context.setTimeout(function () {
                    var prompt = _this.context.document.querySelector("#tipContent").innerHTML;
                    if (prompt.indexOf("未做完") > 0) {
                        alert("提示:" + prompt);
                        resolve("未做完");
                        application_1.Application.App.log.Fatal("有题目未完成,请手动操作.提示:" + prompt);
                        return;
                    }
                    var timer = _this.context.setInterval(function () {
                        prompt = document.getElementById("validate");
                        if (prompt.style.display != 'none') {
                            //等待验证码接管
                            return;
                        }
                        _this.context.clearInterval(timer);
                        _this.context.parent.document.querySelector("#frame_content")
                            .addEventListener("load", function () {
                            return __awaiter(this, void 0, void 0, function () {
                                return __generator(this, function (_a) {
                                    switch (_a.label) {
                                        case 0:
                                            if (!(this.contentWindow.document.URL.indexOf('selectWorkQuestionYiPiYue') > 0)) return [3 /*break*/, 2];
                                            return [4 /*yield*/, self.CollectAnswer()];
                                        case 1:
                                            _a.sent();
                                            resolve(undefined);
                                            _a.label = 2;
                                        case 2: return [2 /*return*/];
                                    }
                                });
                            });
                        });
                        //确定提交
                        var submit = _this.context.document.querySelector(".bluebtn");
                        submit.click();
                    }, 2000);
                }, 2000);
            }, 2000);
        });
    };
    return CxCourseTopic;
}(topic_1.Topic));
exports.CxCourseTopic = CxCourseTopic;
var ExamTopic = /** @class */ (function (_super) {
    __extends(ExamTopic, _super);
    function ExamTopic() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    ExamTopic.prototype.QueryQuestions = function () {
        var current = document.querySelector(".current");
        var topicType = question_1.SwitchTopicType(current.parentElement.previousElementSibling.innerText);
        var question = question_2.CxQuestionFactory.CreateExamQuestion(window, topicType, document.querySelector(".leftContent.TiMu"));
        var ret = new Array();
        if (question == null) {
            return ret;
        }
        ret.push(question);
        return ret;
    };
    ExamTopic.prototype.Init = function () {
        if (document.URL.indexOf("exam/test/reVersionPaperMarkContentNew") > 0) {
            this.CollectAnswer();
        }
        return null;
    };
    ExamTopic.prototype.Submit = function () {
        return new Promise(function (resolve) {
            resolve(undefined);
        });
    };
    return ExamTopic;
}(topic_1.Topic));
exports.ExamTopic = ExamTopic;
var HomeworkTopic = /** @class */ (function (_super) {
    __extends(HomeworkTopic, _super);
    function HomeworkTopic(content, answer) {
        return _super.call(this, content, answer) || this;
    }
    HomeworkTopic.prototype.Init = function () {
        var _this = this;
        return new Promise(function (resolve) {
            if (!document.querySelector("input#workRelationId")) {
                _this.CollectAnswer();
            }
            resolve();
        });
    };
    HomeworkTopic.prototype.Submit = function () {
        return new Promise(function (resolve) {
            resolve();
        });
    };
    return HomeworkTopic;
}(CxCourseTopic));
exports.HomeworkTopic = HomeworkTopic;


/***/ }),

/***/ "./src/mooc/chaoxing/utils.ts":
/*!************************************!*\
  !*** ./src/mooc/chaoxing/utils.ts ***!
  \************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateNoteLine = exports.CssBtn = void 0;
/**
 * 美化按钮
 */
function CssBtn(btn) {
    btn.style.outline = 'none';
    btn.style.border = '0';
    btn.style.background = '#7d9d35';
    btn.style.color = '#fff';
    btn.style.borderRadius = '4px';
    btn.style.padding = '2px 8px';
    btn.style.cursor = 'pointer';
    btn.style.fontSize = '12px';
    btn.style.marginLeft = '4px';
    btn.onmousemove = function () {
        btn.style.boxShadow = '1px 1px 1px 1px #ccc';
    };
    btn.onmouseout = function () {
        btn.style.boxShadow = '';
    };
    return btn;
}
exports.CssBtn = CssBtn;
function CreateNoteLine(text, label, append, after) {
    var p = document.createElement("p");
    p.style.color = "red";
    p.style.fontSize = "14px";
    p.className = "prompt-line-" + label;
    p.innerHTML = text;
    if (append != undefined) {
        append.append(p);
    }
    if (after != undefined) {
        after.after(p);
    }
    return p;
}
exports.CreateNoteLine = CreateNoteLine;


/***/ }),

/***/ "./src/mooc/chaoxing/vcode.ts":
/*!************************************!*\
  !*** ./src/mooc/chaoxing/vcode.ts ***!
  \************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.CxCourseVCode = void 0;
var utils_1 = __webpack_require__(/*! ./utils */ "./src/mooc/chaoxing/utils.ts");
var CxCourseVCode = /** @class */ (function () {
    function CxCourseVCode() {
    }
    CxCourseVCode.prototype.Listen = function (callback) {
        var imgel;
        window.addEventListener("load", function () {
            if (imgel = document.getElementById("imgVerCode")) {
                imgel.addEventListener("load", function () {
                    if (imgel.getAttribute("src").indexOf('?') < 0) {
                        return;
                    }
                    var parent = document.querySelector('#sub').parentElement.parentElement;
                    var old = parent.querySelector(".prompt-line-dama");
                    if (old) {
                        old.remove();
                    }
                    var notice = utils_1.CreateNoteLine('cxmooc自动打码中...', 'dama', parent);
                    callback(new CxCourseFillVCode(imgel, notice));
                });
            }
        });
    };
    return CxCourseVCode;
}());
exports.CxCourseVCode = CxCourseVCode;
var CxCourseFillVCode = /** @class */ (function () {
    function CxCourseFillVCode(img, notice) {
        this.img = img;
        this.notice = notice;
    }
    CxCourseFillVCode.prototype.GetImage = function () {
        return this.img;
    };
    CxCourseFillVCode.prototype.Fill = function (status, msg, code) {
        switch (status) {
            case "ok": {
                this.notice.innerText = "cxmooc打码成功,准备提交";
                document.querySelector('input#code').value = code;
                setTimeout(function () {
                    document.querySelector('a#sub').click();
                }, 3000);
                break;
            }
            default: {
                alert(msg);
                this.notice.innerText = msg;
            }
        }
    };
    return CxCourseFillVCode;
}());


/***/ }),

/***/ "./src/mooc/chaoxing/video.ts":
/*!************************************!*\
  !*** ./src/mooc/chaoxing/video.ts ***!
  \************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.Video = exports.CxVideoControlBar = exports.CxVideoOptimization = void 0;
var hook_1 = __webpack_require__(/*! @App/internal/utils/hook */ "./src/internal/utils/hook.ts");
var application_1 = __webpack_require__(/*! @App/internal/application */ "./src/internal/application.ts");
var utils_1 = __webpack_require__(/*! @App/internal/utils/utils */ "./src/internal/utils/utils.ts");
var utils_2 = __webpack_require__(/*! ./utils */ "./src/mooc/chaoxing/utils.ts");
var task_1 = __webpack_require__(/*! @App/mooc/chaoxing/task */ "./src/mooc/chaoxing/task.ts");
// 优化播放器
var CxVideoOptimization = /** @class */ (function () {
    function CxVideoOptimization() {
    }
    CxVideoOptimization.prototype.Init = function () {
        var _this = this;
        //对播放器进行优化
        window.addEventListener("load", function () {
            application_1.Application.App.config.super_mode && utils_1.isPhone() && (application_1.Application.GlobalContext.Ext.isChaoxing = true);
        });
        this.hook();
        document.addEventListener("readystatechange", function () {
            _this.hook();
        });
        this.Api();
    };
    CxVideoOptimization.prototype.hook = function () {
        if (document.readyState != "interactive") {
            return;
        }
        application_1.Application.App.log.Debug("hook cx video");
        var dataHook = new hook_1.Hook("decode", application_1.Application.GlobalContext.Ext);
        var self = this;
        dataHook.Middleware(function (next) {
            var args = [];
            for (var _i = 1; _i < arguments.length; _i++) {
                args[_i - 1] = arguments[_i];
            }
            var ret = next.apply(this, args);
            if (application_1.Application.App.config.super_mode && ret.danmaku == 1) {
                ret.danmaku = 0;
            }
            return ret;
        });
        window.frameElement.setAttribute("fastforward", "");
        window.frameElement.setAttribute("switchwindow", "");
        var paramHook = new hook_1.Hook("params2VideoOpt", application_1.Application.GlobalContext.ans.VideoJs.prototype);
        paramHook.Middleware(function (next) {
            var args = [];
            for (var _i = 1; _i < arguments.length; _i++) {
                args[_i - 1] = arguments[_i];
            }
            self.param = args[0];
            var ret = next.apply(this, args);
            ret.plugins.timelineObjects.url = self.param.rootPath + "/richvideo/initdatawithviewer";
            var cdn = application_1.Application.App.config.video_cdn || localStorage["cdn"] || "公网1";
            for (var i = 0; i < ret.playlines.length; i++) {
                if (ret.playlines[i].label == cdn) {
                    var copy = ret.playlines[i];
                    ret.playlines.splice(i, 1);
                    ret.playlines.splice(0, 0, copy);
                }
            }
            localStorage["cdn"] = ret.playlines[0].label;
            delete ret.plugins.studyControl;
            return ret;
        });
        application_1.Application.GlobalContext.Ext.isSogou = false;
        var errorHook = new hook_1.Hook("afterRender", application_1.Application.GlobalContext.ans.videojs.ErrorDisplay.prototype);
        errorHook.Middleware(function (next) {
            var _this = this;
            var args = [];
            for (var _i = 1; _i < arguments.length; _i++) {
                args[_i - 1] = arguments[_i];
            }
            var ret = next.apply(this, args);
            setTimeout(function () {
                var nowCdn = _this.renderData.selectedIndex;
                var playlines = _this.renderData.playlines;
                var cdn = application_1.Application.App.config.video_cdn || localStorage["cdn"] || "公网1";
                for (var i = 0; i < playlines.length; i++) {
                    if (i != nowCdn) {
                        if (cdn == "") {
                            localStorage["cdn"] = playlines[i].label;
                            return _this.onSelected(i);
                        }
                        else if (cdn == playlines[i].label) {
                            localStorage["cdn"] = playlines[i].label;
                            return _this.onSelected(i);
                        }
                    }
                }
                var index = (nowCdn + 1) % playlines.length;
                localStorage["cdn"] = playlines[index].label;
                return _this.onSelected(index);
            }, 2000);
            return ret;
        });
    };
    /**
     * 操作方法
     */
    CxVideoOptimization.prototype.Api = function () {
        var _this = this;
        application_1.Application.GlobalContext.sendTimePack = function (time, callback) {
            if (time == NaN || time == undefined) {
                time = parseInt(_this.param.duration);
            }
            var playTime = Math.round(time || (_this.param.duration - utils_1.randNumber(1, 2)));
            var enc = '[' + _this.param.clazzId + '][' + _this.param.userid + '][' +
                _this.param.jobid + '][' + _this.param.objectId + '][' +
                (playTime * 1000).toString() + '][d_yHJ!$pdA~5][' + (_this.param.duration * 1000).toString() + '][0_' +
                _this.param.duration + ']';
            enc = application_1.Application.GlobalContext.md5(enc);
            utils_1.get(_this.param.reportUrl + '/' + _this.param.dtoken + '?clipTime=0_' + _this.param.duration +
                '&otherInfo=' + _this.param.otherInfo +
                '&userid=' + _this.param.userid + '&rt=0.9&jobid=' + _this.param.jobid +
                '&duration=' + _this.param.duration + '&dtype=Video&objectId=' + _this.param.objectId +
                '&clazzId=' + _this.param.clazzId +
                '&view=pc&playingTime=' + playTime + '&isdrag=4&enc=' + enc, function (data) {
                var isPassed = JSON.parse(data);
                callback(isPassed.isPassed);
            });
        };
    };
    return CxVideoOptimization;
}());
exports.CxVideoOptimization = CxVideoOptimization;
var CxVideoControlBar = /** @class */ (function (_super) {
    __extends(CxVideoControlBar, _super);
    function CxVideoControlBar() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    CxVideoControlBar.prototype.defaultBtn = function () {
        var _this = this;
        _super.prototype.defaultBtn.call(this);
        var pass = utils_2.CssBtn(utils_1.createBtn("秒过视频", "秒过视频会被后台检测到", "cx-btn"));
        var downloadSubtitle = utils_2.CssBtn(utils_1.createBtn("下载字幕", "我要下载字幕一同食用"));
        pass.style.background = "#F57C00";
        downloadSubtitle.style.background = "#638EE1";
        // this.prev.append(pass, this.download(), downloadSubtitle);
        pass.onclick = function () {
            if (!utils_1.protocolPrompt("秒过视频会产生不良记录,是否继续?", "boom_no_prompt")) {
                return;
            }
            _this.task.sendEndTimePack(function (isPassed) {
                if (isPassed) {
                    alert('秒过成功,刷新后查看效果');
                }
                else {
                    alert('操作失败,错误');
                }
            });
        };
        downloadSubtitle.onclick = function () {
            _this.task.downloadSubtitle();
        };
    };
    return CxVideoControlBar;
}(task_1.CxTaskControlBar));
exports.CxVideoControlBar = CxVideoControlBar;
var Video = /** @class */ (function (_super) {
    __extends(Video, _super);
    function Video() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Video.prototype.queryVideo = function () {
        return this.context.document.getElementById("video_html5_api");
    };
    Video.prototype.Init = function () {
        var _this = this;
        return new Promise(function (resolve) {
            application_1.Application.App.log.Debug("播放器配置", _this.taskinfo);
            var timer = _this.context.setInterval(function () {
                try {
                    var video = _this.queryVideo();
                    if (video == undefined) {
                        if (_this.context.document.querySelector("#reader").innerHTML.indexOf("您没有安装flashplayer") >= 0) {
                            _this.context.clearInterval(timer);
                            _this.flash = true;
                            resolve(undefined);
                        }
                        return;
                    }
                    _this.context.clearInterval(timer);
                    _this.video = video;
                    _this.initPlayer();
                    _this.video.addEventListener("ended", function () {
                        _this.end = true;
                        _this.context.clearInterval(_this.time);
                        _this.callEvent("complete");
                    });
                    resolve(undefined);
                }
                catch (error) {
                    application_1.Application.App.log.Debug("初始化video错误", error);
                }
            }, 500);
        });
    };
    Video.prototype.Type = function () {
        return "video";
    };
    Video.prototype.Start = function () {
        var _this = this;
        return new Promise(function (resolve) {
            application_1.Application.App.log.Debug("开始播放视频");
            if (_this.flash) {
                resolve(undefined);
                return _this.callEvent("complete");
            }
            //定时运行
            _this.time = _this.context.setInterval(function () {
                application_1.Application.App.config.auto && _this.video.paused && _this.video.play();
            }, 5000);
            //同时运行多视频的兼容,后续看看能不能hook
            _this.video.addEventListener("pause", function () {
                if (_this.video.currentTime <= _this.video.duration - 5) {
                    if (!_this.end) {
                        _this.video.play();
                    }
                }
            });
            _this.video.play();
            resolve(undefined);
        });
    };
    Video.prototype.initPlayer = function () {
        this.playbackRate = this._playbackRate;
        this.muted = this._muted;
    };
    /**
     * 秒过
     */
    Video.prototype.sendEndTimePack = function (callback) {
        this.sendTimePack(this.video.duration, callback);
    };
    Video.prototype.sendTimePack = function (time, callback) {
        this.context.sendTimePack(time, function (isPassed) {
            callback(isPassed);
        });
    };
    Video.prototype.downloadSubtitle = function () {
        utils_1.get('/richvideo/subtitle?mid=' + this.taskinfo.property.mid + '&_dc=' +
            Date.parse(new Date().toString()), function (data) {
            var json = JSON.parse(data);
            if (json.length <= 0) {
                alert("没有字幕！");
            }
            else {
                for (var i = 0; i < json.length; i++) {
                    var subtitleURL = json[i]['url'];
                    window.open(subtitleURL);
                }
            }
        });
    };
    Object.defineProperty(Video.prototype, "playbackRate", {
        /**
         * 设置播放速度
         */
        set: function (speed) {
            this._playbackRate = speed;
            if (this.video) {
                this.video.playbackRate = speed;
            }
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Video.prototype, "muted", {
        /**
         * 设置播放静音
         */
        set: function (muted) {
            this._muted = muted;
            if (this.video) {
                this.video.muted = muted;
            }
        },
        enumerable: false,
        configurable: true
    });
    return Video;
}(task_1.CxTask));
exports.Video = Video;


/***/ }),

/***/ "./src/mooc/mooc.ts":
/*!**************************!*\
  !*** ./src/mooc/mooc.ts ***!
  \**************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.mooc = void 0;
var application_1 = __webpack_require__(/*! @App/internal/application */ "./src/internal/application.ts");
var mooc = /** @class */ (function () {
    function mooc(moocFactory) {
        // 防止taskComplete和reload冲突
        this.once = false;
        this.moocFactory = moocFactory;
    }
    mooc.prototype.start = function () {
        return __awaiter(this, void 0, void 0, function () {
            var state, mooc_1, e_1, isShow_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 3, , 4]);
                        state = document.readyState;
                        application_1.Application.App.log.Debug("Start document state:", state);
                        mooc_1 = this.moocFactory.CreateMooc();
                        if (!(mooc_1 != null)) return [3 /*break*/, 2];
                        return [4 /*yield*/, mooc_1.Init()];
                    case 1:
                        _a.sent();
                        // MoocTaskSet接口判断,接管流程
                        if (mooc_1.Next != undefined) {
                            this.runMoocTask(mooc_1);
                        }
                        _a.label = 2;
                    case 2: return [3 /*break*/, 4];
                    case 3:
                        e_1 = _a.sent();
                        application_1.Application.App.log.Fatal("扩展发生了一个致命错误:", e_1);
                        return [3 /*break*/, 4];
                    case 4:
                        //最小化警告
                        if (top == self) {
                            isShow_1 = false;
                            document.addEventListener("visibilitychange", function () {
                                if (document.hidden) {
                                    if (isShow_1) {
                                        return;
                                    }
                                    application_1.Application.App.log.Warn("第一次使用会跳转到'脚本正在试图访问跨域资源;' 点击永久允许即可");
                                    application_1.Application.App.log.Warn("请注意!最小化可能导致视频无法正常播放!允许切换窗口.");
                                    application_1.Application.App.log.Warn("由于很多朋友开了倍数导致，时长被清，建议大家开2倍即可");
                                    isShow_1 = true;
                                }
                            });
                        }
                        return [2 /*return*/];
                }
            });
        });
    };
    mooc.prototype.runMoocTask = function (moocTask) {
        var _this = this;
        moocTask.addEventListener("reload", function () {
            if (application_1.Application.App.config.auto) {
                _this.runTask(moocTask);
            }
            clearTimeout(_this.timer);
        });
        moocTask.addEventListener("complete", function () {
            application_1.Application.App.log.Warn("任务完成了");
            alert("任务完成了");
        });
        moocTask.addEventListener("taskComplete", function (index, task) {
            moocTask.SetTaskPointer(index + 1);
            if (!application_1.Application.App.config.auto) {
                return;
            }
            var interval = application_1.Application.App.config.interval;
            application_1.Application.App.log.Info(interval + "分钟后自动切换下一个任务点");
            _this.timer = setTimeout(function () { return __awaiter(_this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, task.Submit()];
                        case 1:
                            _a.sent();
                            return [4 /*yield*/, this.runTask(moocTask)];
                        case 2:
                            _a.sent();
                            return [2 /*return*/];
                    }
                });
            }); }, interval * 60000);
        });
        moocTask.addEventListener("error", function (msg) {
            application_1.Application.App.log.Fatal(msg);
            alert(msg);
        });
    };
    mooc.prototype.runTask = function (moocTask) {
        return __awaiter(this, void 0, void 0, function () {
            var task;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (this.once) {
                            return [2 /*return*/];
                        }
                        this.once = true;
                        return [4 /*yield*/, moocTask.Next()];
                    case 1:
                        task = _a.sent();
                        _a.label = 2;
                    case 2:
                        if (!(task != null)) return [3 /*break*/, 9];
                        if (!task.Done()) return [3 /*break*/, 4];
                        return [4 /*yield*/, moocTask.Next()];
                    case 3:
                        task = _a.sent();
                        return [3 /*break*/, 2];
                    case 4:
                        if (!(application_1.Application.App.config.answer_ignore && task.Type() == "topic")) return [3 /*break*/, 6];
                        return [4 /*yield*/, moocTask.Next()];
                    case 5:
                        task = _a.sent();
                        return [3 /*break*/, 2];
                    case 6:
                        if (!application_1.Application.App.config.auto) return [3 /*break*/, 8];
                        return [4 /*yield*/, task.Start()];
                    case 7:
                        _a.sent();
                        _a.label = 8;
                    case 8:
                        this.nowTask = task;
                        return [3 /*break*/, 9];
                    case 9:
                        this.once = false;
                        return [2 /*return*/];
                }
            });
        });
    };
    return mooc;
}());
exports.mooc = mooc;


/***/ }),

/***/ "./src/tampermonkey/cxmooc-pack.ts":
/*!*****************************************!*\
  !*** ./src/tampermonkey/cxmooc-pack.ts ***!
  \*****************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var config_1 = __webpack_require__(/*! @App/internal/utils/config */ "./src/internal/utils/config.ts");
var log_1 = __webpack_require__(/*! @App/internal/utils/log */ "./src/internal/utils/log.ts");
var application_1 = __webpack_require__(/*! @App/internal/application */ "./src/internal/application.ts");
var mooc_1 = __webpack_require__(/*! @App/mooc/mooc */ "./src/mooc/mooc.ts");
var platform_1 = __webpack_require__(/*! @App/mooc/chaoxing/platform */ "./src/mooc/chaoxing/platform.ts");
var logger;
if (top == self) {
    logger = new log_1.PageLog();
}
else {
    logger = new log_1.ConsoleLog();
}
application_1.Application.GlobalContext = window.unsafeWindow;
var component = new Map().
    set("config", new config_1.ChromeConfigItems(config_1.NewFrontendGetConfig())).
    set("logger", logger);
var app = new application_1.Application(application_1.Frontend, new mooc_1.mooc(new platform_1.CxPlatform()), component);
app.run();


/***/ }),

/***/ "./src/views/common.ts":
/*!*****************************!*\
  !*** ./src/views/common.ts ***!
  \*****************************/
/*! no static exports found */
/***/ (function(module, exports) {

window.addEventListener("load", function () {
    var css = "\n@keyframes aniripple  \n{\n    0%{\n        width:0px;\n        height:0px;\n        opacity:0.4;\n    }\n    100%{\n        width:500px;\n        height:500px;\n        opacity:0;\n    }\n}  \n\n#cxtools {\n    position: absolute;\n    left: 250px;\n    top: 2px;\n    width: 210px;\n    font-size: 0;\n}\n\n.cx-btn {\n    outline: none;\n    border: 0;\n    background: #7d9d35;\n    color: #fff;\n    border-radius: 4px;\n    padding: 2px 8px;\n    cursor: pointer;\n    font-size: 12px;\n    margin-left: 4px;\n}\n\n.cx-btn:hover {\n    box-shadow: 1px 1px 1px 1px #ccc;\n}\n\n.zhs-tools-btn {\n    color: #fff;\n    background: #ff9d34;\n    padding: 4px;\n    display: inline-block;\n    height: 24px;\n    font-size: 14px;\n    line-height: 24px;\n    margin:0;\n    cursor:pointer;\n}\n.btn-ripple{\n    position:absolute;\n    background:#000;\n    pointer-events:none;\n    transform:translate(-50%,-50%);\n    border-radius:50%;\n    animation:aniripple 1s linear infinite;\n}\n\n.zhs-start-btn{\n    background: #36ac36;\n}\n\n.zhs-start-btn:hover{\n    background: #3b8d3b;\n}\n\n#zhs-ytbn {\n    color: #fff;\n    background: #e777ff;\n}\n\n#zhs-ytbn:hover {\n    background: #e7b7f1;\n}\n\n.zhs-search-answer {\n    border: 0;\n    outline: none;\n    padding: 4px;\n}\n\n.zhs-search-answer:hover {\n    opacity: .85;\n}\n\n.mooc163-search{\n    background-color: #60b900;\n    display: block;\n    margin: 0 auto;\n}\n\n.tools-logger-panel{\n    // width: 360px;\n    // height: auto;\n    // max-height: 400px;\n    color:#000;\n    position: fixed;\n    margin: 0 auto;\n    display: block;\n    font-size: 14px;\n    border-radius: 4px;\n    width: 420px;\n    text-align: center;\n    overflow: hidden;\n    left:60px;\n    top: 40px;\n    z-index: 100000;\n    background: rgba(256, 256, 256, 0.3);\n    box-shadow: 0px 0px 5px #bbb;\n}\n\n.head {\n    width: 100%;\n    height: 30px;\n    padding: 4px;\n    box-sizing: border-box;\n    cursor: move;\n    transition-property: opacity, background-color;\n    transition: 200ms ease-in-out;\n}\n\n.head span{\n    color:#000;\n    float:left;\n    font-weight: 550;\n}\n\n.status {\n    color: #67C23A;\n    font-weight: 600;\n}\n\n.tools-notice-content {\n    width: 100%;\n    border-top:0px;\n    overflow-x: hidden;\n}\n\n.tools-notice-content .log {\n    height: auto;\n    width: auto;\n    text-align: center;\n    border: 1px solid #eee;\n    overflow: hidden;\n}\n\n.tools-notice-content .log p {\n    margin: 0;\n    color: #aaa;\n    font-size: 11px;\n    font-weight: 500;\n    font-family: Arial, Helvetica, sans-serif;\n    line-height: 26px;\n}\n\n/* \u6EDA\u52A8\u69FD */\n::-webkit-scrollbar {\n    width: 10px;\n    height: 10px;\n}\n\n::-webkit-scrollbar-track {\n    border-radius: 3px;\n    background: rgba(0, 0, 0, 0.06);\n    -webkit-box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.08);\n}\n\n/* \u6EDA\u52A8\u6761\u6ED1\u5757 */\n::-webkit-scrollbar-thumb {\n    border-radius: 3px;\n    background: rgba(0, 0, 0, 0.12);\n    -webkit-box-shadow: inset 0 0 10px rgba(0, 0, 0, 0.2);\n}\n\n/* \u590D\u9009\u6846 */\n.switch {\n    margin: 2px auto;\n    display: inline-flex;\n    align-items: center;\n    width: auto;\n    border: 1px solid #d7d7d7;\n    border-radius: 50px;\n}\n.checkbox-input {\n    display: none\n}\n.checkbox {\n    -webkit-transition: background-color 0.3s;\n    transition: background-color 0.3s;\n    background-color: #fff;\n    border: 1px solid #d7d7d7;\n    border-radius: 50px;\n    width: 16px;\n    height: 16px;\n    vertical-align:middle;\n    margin: 0 5px;\n}\n.checkbox-input:checked+.checkbox {\n    background-color: #409EFF;\n}\n.checkbox-input:checked+.checkbox:after {\n    // content: \"\u221A\";\n    display: inline-block;\n    height: 100%;\n    width: 100%;\n    color: #fff;\n    text-align: center;\n    line-height: 16px;\n    font-size: 12px;\n    box-shadow: 0 0 4px #409EFF;\n}\n\n.tools-logger-panel:hover,\n.tools-logger-panel:focus-within {\n    background: rgba(256, 256, 256, 0.7);\n}\n\n.tools-logger-panel .head:active {\n    background-color: #E5E5E5;\n}\n\n.tools-logger-panel > .close {\n    margin: 2px;\n}\n\n";
    var style = document.createElement("style");
    style.innerHTML = css;
    document.body.appendChild(style);
});


/***/ })

/******/ });
//# sourceMappingURL=tampermonkey-cxmooc.js.map


 
(function() {
	'use strict';
 
	// 域名规则列表
	var rules = {
		black_rule: {
			name: "black",
			hook_eventNames: "",
			unhook_eventNames: ""
		},
		default_rule: {
			name: "default",
			hook_eventNames: "contextmenu|select|selectstart|copy|cut|dragstart",
			unhook_eventNames: "mousedown|mouseup|keydown|keyup",
			dom0: true,
			hook_addEventListener: true,
			hook_preventDefault: true,
			hook_set_returnValue: true,
			add_css: true
		}
	};
	// 域名列表
	var lists = {
		// 黑名单
		black_list: [
			/.*\.youtube\.com.*/,
			/.*\.wikipedia\.org.*/,
			/mail\.qq\.com.*/,
			/translate\.google\..*/
		]
	};
 
	// 要处理的 event 列表
	var hook_eventNames, unhook_eventNames, eventNames;
	// 储存名称
	var storageName = getRandStr('qwertyuiopasdfghjklzxcvbnmQWERTYUIOPASDFGHJKLZXCVBNM', parseInt(Math.random() *
		12 + 8));
	// 储存被 Hook 的函数
	var EventTarget_addEventListener = EventTarget.prototype.addEventListener;
	var document_addEventListener = document.addEventListener;
	var Event_preventDefault = Event.prototype.preventDefault;
 
	// Hook addEventListener proc
	function addEventListener(type, func, useCapture) {
		var _addEventListener = this === document ? document_addEventListener : EventTarget_addEventListener;
		if (hook_eventNames.indexOf(type) >= 0) {
			_addEventListener.apply(this, [type, returnTrue, useCapture]);
		} else if (this && unhook_eventNames.indexOf(type) >= 0) {
			var funcsName = storageName + type + (useCapture ? 't' : 'f');
 
			if (this[funcsName] === undefined) {
				this[funcsName] = [];
				_addEventListener.apply(this, [type, useCapture ? unhook_t : unhook_f, useCapture]);
			}
 
			this[funcsName].push(func);
		} else {
			_addEventListener.apply(this, arguments);
		}
	}
 
	// 清理循环
	function clearLoop() {
		var elements = getElements();
 
		for (var i in elements) {
			for (var j in eventNames) {
				var name = 'on' + eventNames[j];
				if (elements[i][name] !== null && elements[i][name] !== onxxx) {
					if (unhook_eventNames.indexOf(eventNames[j]) >= 0) {
						elements[i][storageName + name] = elements[i][name];
						elements[i][name] = onxxx;
					} else {
						elements[i][name] = null;
					}
				}
			}
		}
	}
 
	// 返回true的函数
	function returnTrue(e) {
		return true;
	}
 
	function unhook_t(e) {
		return unhook(e, this, storageName + e.type + 't');
	}
 
	function unhook_f(e) {
		return unhook(e, this, storageName + e.type + 'f');
	}
 
	function unhook(e, self, funcsName) {
		var list = self[funcsName];
		for (var i in list) {
			list[i](e);
		}
 
		e.returnValue = true;
		return true;
	}
 
	function onxxx(e) {
		var name = storageName + 'on' + e.type;
		this[name](e);
 
		e.returnValue = true;
		return true;
	}
 
	// 获取随机字符串
	function getRandStr(chs, len) {
		var str = '';
 
		while (len--) {
			str += chs[parseInt(Math.random() * chs.length)];
		}
 
		return str;
	}
 
	// 获取所有元素 包括document
	function getElements() {
		var elements = Array.prototype.slice.call(document.getElementsByTagName('*'));
		elements.push(document);
 
		return elements;
	}
 
	// 添加css
	function addStyle(css) {
		var style = document.createElement('style');
		style.innerHTML = css;
		document.head.appendChild(style);
	}
 
	// 获取目标域名应该使用的规则
	function getRule(url) {
		function testUrl(list, url) {
			for (var i in list) {
				if (list[i].test(url)) {
					return true;
				}
			}
 
			return false;
		}
 
		if (testUrl(lists.black_list, url)) {
			return rules.black_rule;
		}
 
		return rules.default_rule;
	}
 
	// 初始化
	function init() {
		// 获取当前域名的规则
		var url = window.location.host + window.location.pathname;
		var rule = getRule(url);
 
		// 设置 event 列表
		hook_eventNames = rule.hook_eventNames.split("|");
		// TODO Allowed to return value
		unhook_eventNames = rule.unhook_eventNames.split("|");
		eventNames = hook_eventNames.concat(unhook_eventNames);
 
		// 调用清理 DOM0 event 方法的循环
		if (rule.dom0) {
			setInterval(clearLoop, 30 * 1000);
			setTimeout(clearLoop, 2500);
			window.addEventListener('load', clearLoop, true);
			clearLoop();
		}
 
		// hook addEventListener
		if (rule.hook_addEventListener) {
			EventTarget.prototype.addEventListener = addEventListener;
			document.addEventListener = addEventListener;
		}
 
		// hook preventDefault
		if (rule.hook_preventDefault) {
			Event.prototype.preventDefault = function() {
				if (eventNames.indexOf(this.type) < 0) {
					Event_preventDefault.apply(this, arguments);
				}
			};
		}
 
		// Hook set returnValue
		if (rule.hook_set_returnValue) {
			Event.prototype.__defineSetter__('returnValue', function() {
				if (this.returnValue !== true && eventNames.indexOf(this.type) >= 0) {
					this.returnValue = true;
				}
			});
		}
 
		console.debug('url: ' + url, 'storageName：' + storageName, 'rule: ' + rule.name);
 
		// 添加CSS
		if (rule.add_css) {
			addStyle('html, * {-webkit-user-select:text!important; -moz-user-select:text!important;}');
		}
	}
 
	init();
})();
