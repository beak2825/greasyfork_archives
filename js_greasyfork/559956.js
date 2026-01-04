// ==UserScript==
// @name       				网课全能助手｜超星学习通｜智慧树｜智慧职教｜中国大学mooc｜自动答题｜自动刷课｜一键操作｜超全题库｜可视化配置
// @version    				1.0.0
// @description				支持超星学习通、智慧树、智慧职教、中国大学mooc等平台，包含自动答题、自动刷课、任务点自动跳转、全网检索答案、chatgpt对接、音频视频自动静音播放、可视化参数配置等功能。
// @icon                                https://apps.chaoxing.com/res/images/apk/logo.png
// @author     				iKaiKail
// @email      				ikaikail@ikaikail.com
// @license    				MIT
// @match      				*://*.zhihuishu.com/*
// @match      				*://*.chaoxing.com/*
// @match      				*://*.edu.cn/*
// @match      				*://*.org.cn/*
// @match      				*://*.xueyinonline.com/*
// @match      				*://*.hnsyu.net/*
// @match      				*://*.qutjxjy.cn/*
// @match      				*://*.ynny.cn/*
// @match      				*://*.hnvist.cn/*
// @match      				*://*.fjlecb.cn/*
// @match      				*://*.gdhkmooc.com/*
// @match      				*://*.cugbonline.cn/*
// @match      				*://*.zjelib.cn/*
// @match      				*://*.cqrspx.cn/*
// @match      				*://*.neauce.com/*
// @match      				*://*.zhihui-yun.com/*
// @match      				*://*.cqie.cn/*
// @match      				*://*.ccqmxx.com/*
// @match      				*://*.icve.com.cn/*
// @match      				*://*.course.icve.com.cn/*
// @match      				*://*.courshare.cn/*
// @match      				*://*.webtrn.cn/*
// @match      				*://*.zjy2.icve.com.cn/*
// @match      				*://*.zyk.icve.com.cn/*
// @match      				*://*.icourse163.org/*
// @match      				*://*.nbdlib.cn/*
// @require      https://update.greasyfork.org/scripts/559955/1719602/vueglobalprodjs.js
// @require      https://update.greasyfork.org/scripts/559954/1719600/indexiifeminjs.js
// @require      https://update.greasyfork.org/scripts/559953/1719599/globaliifeminjs.js
// @require      data:application/javascript,window.Vue%3DVue%3B
// @require      https://update.greasyfork.org/scripts/559952/1719598/piniaiifeprodjs.js
// @require      https://update.greasyfork.org/scripts/559951/1719596/indexfullminjs.js
// @require      https://update.greasyfork.org/scripts/559950/1719593/md5minjs.js
// @require      https://update.greasyfork.org/scripts/559949/1719590/jqueryminjs.js
// @resource     element-plus  https://cdn.staticfile.org/element-plus/2.3.12/index.css
// @resource     ttf           https://www.forestpolice.org/ttf/2.0/table.json
// @grant        GM_addStyle
// @grant        GM_getResourceText
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_info
// @grant        GM_xmlhttpRequest
// @grant        GM_listValues
// @grant        GM_deleteValue
// @grant        GM_notification
// @grant        GM_getTab
// @grant        GM_saveTab
// @grant        unsafeWindow
// @grant        GM_addValueChangeListener
// @grant        GM_removeValueChangeListener
// @run-at     				document-start
// @namespace    			https://github.com/ikaikail
// @homepage     			https://github.com/ikaikail
// @connect      cx.icodef.com
// @connect      tk.enncy.cn
// @connect      api.muketool.com
// @connect      api.tikuhai.com
// @connect      dati.bobo91.com
// @connect      icodef.com
// @connect      ocsjs.com
// @connect      localhost
// @connect      127.0.0.1
// @downloadURL https://update.greasyfork.org/scripts/559956/%E7%BD%91%E8%AF%BE%E5%85%A8%E8%83%BD%E5%8A%A9%E6%89%8B%EF%BD%9C%E8%B6%85%E6%98%9F%E5%AD%A6%E4%B9%A0%E9%80%9A%EF%BD%9C%E6%99%BA%E6%85%A7%E6%A0%91%EF%BD%9C%E6%99%BA%E6%85%A7%E8%81%8C%E6%95%99%EF%BD%9C%E4%B8%AD%E5%9B%BD%E5%A4%A7%E5%AD%A6mooc%EF%BD%9C%E8%87%AA%E5%8A%A8%E7%AD%94%E9%A2%98%EF%BD%9C%E8%87%AA%E5%8A%A8%E5%88%B7%E8%AF%BE%EF%BD%9C%E4%B8%80%E9%94%AE%E6%93%8D%E4%BD%9C%EF%BD%9C%E8%B6%85%E5%85%A8%E9%A2%98%E5%BA%93%EF%BD%9C%E5%8F%AF%E8%A7%86%E5%8C%96%E9%85%8D%E7%BD%AE.user.js
// @updateURL https://update.greasyfork.org/scripts/559956/%E7%BD%91%E8%AF%BE%E5%85%A8%E8%83%BD%E5%8A%A9%E6%89%8B%EF%BD%9C%E8%B6%85%E6%98%9F%E5%AD%A6%E4%B9%A0%E9%80%9A%EF%BD%9C%E6%99%BA%E6%85%A7%E6%A0%91%EF%BD%9C%E6%99%BA%E6%85%A7%E8%81%8C%E6%95%99%EF%BD%9C%E4%B8%AD%E5%9B%BD%E5%A4%A7%E5%AD%A6mooc%EF%BD%9C%E8%87%AA%E5%8A%A8%E7%AD%94%E9%A2%98%EF%BD%9C%E8%87%AA%E5%8A%A8%E5%88%B7%E8%AF%BE%EF%BD%9C%E4%B8%80%E9%94%AE%E6%93%8D%E4%BD%9C%EF%BD%9C%E8%B6%85%E5%85%A8%E9%A2%98%E5%BA%93%EF%BD%9C%E5%8F%AF%E8%A7%86%E5%8C%96%E9%85%8D%E7%BD%AE.meta.js
// ==/UserScript==

(function() {
    'use strict';
    
    // 添加样式
    (t=>{if(typeof GM_addStyle=="function"){GM_addStyle(t);return}const i=document.createElement("style");i.textContent=t,document.head.append(i)})(' .dialog-footer button[data-v-6ed29f7f]:first-child{margin-right:10px}#csbutton[data-v-6ed29f7f]{position:fixed;bottom:20px;right:20px;z-index:99999}#zeokdjg[data-v-c3c6b09f]{position:fixed;left:10px;bottom:50vh;z-index:9999}.question_btn[data-v-c3c6b09f]{width:40px;height:40px;border-radius:5px;margin:5px}.question_div[data-v-c3c6b09f]{height:200px}.question_ti[data-v-c3c6b09f]{margin:10px 0 20px}.cx_log[data-v-c3c6b09f]{margin:2px 0}.status_log[data-v-c3c6b09f]{margin-top:10px}.dialog-footer button[data-v-c3c6b09f]:first-child{margin-right:10px}#csbutton[data-v-c3c6b09f]{position:fixed;bottom:20px;right:20px;z-index:99999} ');
    
    // 初始化Vue和相关库
    const Vue = window.Vue;
    const ElementPlus = window.ElementPlus;
    const pinia = window.Pinia.createPinia();
    Vue.use(ElementPlus);
    Vue.use(pinia);
    
    // 配置管理
    const getConfig = () => {
        const config = GM_getValue("config");
        return config || {
            debugger: false,
            autoAnswer: true,
            autoVideo: true,
            autoJump: true,
            autoSubmit: true,
            thtoken: "",
            yztoken: "",
            gptKey: "",
            gptModel: "gpt-3.5-turbo",
            gpt: false,
            gptType: ["0", "1", "2", "3", "4", "5", "6", "7"],
            interval: 3,
            answerInterval: 3,
            minAccuracy: 0.8,
            autoExam: true,
            hideExam: false
        };
    };
    
    // 用户配置项
    const userConfig = [
        {
            name: "base",
            label: "基础配置",
            config: [
                { name: "interval", label: "通用间隔(秒)", type: "number", value: 3, desc: "通用间隔，用于脚本运行切换" },
                { name: "answerInterval", label: "答题间隔(秒)", type: "number", value: 3, desc: "控制答题速度" },
                { name: "thtoken", label: "题库海秘钥", type: "input", value: "", desc: "非必填，购买后可获得，填写完请保存再刷新页面" },
                { name: "yztoken", label: "一之题库秘钥", type: "input", value: "", desc: "非必填，购买后可获得，填写完请保存再刷新页面" },
                { name: "gptKey", label: "ChatGPT API Key", type: "input", value: "", desc: "非必填，用于简答题AI辅助" },
                { name: "gptModel", label: "ChatGPT模型", type: "input", value: "gpt-3.5-turbo", desc: "ChatGPT模型选择" }
            ]
        },
        {
            name: "chapter",
            label: "章节配置",
            config: [
                { name: "autoAnswer", label: "自动答题", type: "switch", value: true, desc: "开启后，会自动答题" },
                { name: "autoVideo", label: "自动视频", type: "switch", value: true, desc: "开启后，会自动观看视频" },
                { name: "autoJump", label: "自动切换", type: "switch", value: true, desc: "开启后，会自动切换章节" },
                { name: "autoSubmit", label: "自动提交", type: "switch", value: true, desc: "开启后，会自动提交答案" },
                { name: "minAccuracy", label: "最低正确率", type: "input", value: 0.8, desc: "不满足最低正确率则不会自动提交答案" }
            ]
        },
        {
            name: "exam",
            label: "作业/考试配置",
            config: [
                { name: "autoExam", label: "考试自动切换", type: "switch", value: true, desc: "开启后，会考试会自动切换" },
                { name: "gpt", label: "启用ChatGPT", type: "switch", value: false, desc: "开启后，简答题会使用ChatGPT辅助" }
            ]
        }
    ];
    
    // 状态管理
    const useformStore = pinia.defineStore({
        id: "formstore",
        state: () => ({
            forminput: getConfig(),
            dialogV: false,
            activeName: "base"
        }),
        actions: {
            saveConfig(forminput) {
                GM_setValue("config", forminput);
            }
        }
    });
    
    // 应用组件
    const App = Vue.defineComponent({
        setup() {
            const formstoreObj = useformStore();
            const { forminput, dialogV, activeName } = Vue.toRefs(formstoreObj);
            const ruleFormRef = Vue.ref();
            
            const rules = Vue.reactive({
                interval: [
                    { required: true, message: "间隔时间不能为空" },
                    { type: "number", message: "间隔时间必须为数字" },
                    { validator: (rule, value) => value >= 1 ? Promise.resolve() : Promise.reject("间隔时间必须大于等于1") }
                ],
                answerInterval: [
                    { required: true, message: "答题间隔不能为空" },
                    { type: "number", message: "答题间隔必须为数字" },
                    { validator: (rule, value) => value >= 1 ? Promise.resolve() : Promise.reject("答题间隔必须大于等于1") }
                ]
            });
            
            const submitForm = async (formEl) => {
                if (!formEl) return;
                await formEl.validate((valid, fields) => {
                    if (valid) {
                        formstoreObj.saveConfig(forminput.value);
                        ElementPlus.ElNotification({
                            title: "Success",
                            message: "配置保存成功,请自行刷新页面",
                            type: "success"
                        });
                        dialogV.value = false;
                    }
                });
            };
            
            return {
                dialogV,
                activeName,
                ruleFormRef,
                forminput,
                rules,
                submitForm,
                userConfig
            };
        },
        template: `
            <div>
                <el-button type="primary" id="csbutton" @click="dialogV = !dialogV" circle>
                    <el-icon><el-icon-setting /></el-icon>
                </el-button>
                
                <el-dialog
                    v-model="dialogV"
                    title="iKaiKail网课全能助手配置"
                    width="30%"
                    :modal="false"
                    :center="true"
                    :draggable="true"
                >
                    <el-form
                        ref="ruleFormRef"
                        :rules="rules"
                        :model="forminput"
                        class="demo-ruleForm"
                    >
                        <el-tabs v-model="activeName" class="demo-tabs">
                            <el-tab-pane
                                v-for="item in userConfig"
                                :key="item.name"
                                :label="item.label"
                                :name="item.name"
                            >
                                <el-form-item
                                    v-for="item1 in item.config"
                                    :key="item1.name"
                                    :label="item1.label"
                                    :prop="item1.name"
                                >
                                    <el-tooltip
                                        class="box-item"
                                        effect="dark"
                                        :content="item1.desc || ''"
                                        placement="top"
                                    >
                                        <template v-if="item1.type === 'switch'">
                                            <el-switch v-model="forminput[item1.name]" />
                                        </template>
                                        <template v-else-if="item1.type === 'input'">
                                            <el-input v-model="forminput[item1.name]" placeholder="请输入" />
                                        </template>
                                        <template v-else-if="item1.type === 'number'">
                                            <el-input-number v-model="forminput[item1.name]" :min="1" />
                                        </template>
                                        <template v-else>
                                            <el-input v-model="forminput[item1.name]" placeholder="请输入" />
                                        </template>
                                    </el-tooltip>
                                </el-form-item>
                            </el-tab-pane>
                        </el-tabs>
                    </el-form>
                    <template #footer>
                        <span class="dialog-footer">
                            <el-button @click="dialogV = false">取消</el-button>
                            <el-button type="primary" @click="submitForm(ruleFormRef)">保存</el-button>
                        </span>
                    </template>
                </el-dialog>
            </div>
        `
    });
    
    // API服务类
    class ServerApi {
        constructor(window2 = unsafeWindow) {
            this.api1 = "http://api.tikuhai.com";
            this.api2 = "http://cx.icodef.com/wyn-nb?v=4";
            this.api3 = "https://tk.enncy.cn/query";
            this.api4 = "https://api.muketool.com/cx/v2/query";
            this.windowz = window2;
        }
        
        async defaultRequest(url, method, data = {}, headers = {}, type = false) {
            const defaultConfig = getConfig();
            if (type) {
                headers = {
                    "Content-Type": method === "POST" ? "application/json" : "text/plain",
                    Referer: this.windowz.location.href,
                    v: GM_info.script.version,
                    key: defaultConfig.thtoken || "",
                    uid: unsafeWindow.uid || (unsafeWindow.getCookie && unsafeWindow.getCookie.call(unsafeWindow, "_uid")) || "",
                    ...headers
                };
            }
            
            return new Promise((resolve, reject) => {
                GM_xmlhttpRequest({
                    method,
                    url,
                    data: JSON.stringify(data),
                    headers,
                    timeout: 10000,
                    onload: (res) => resolve(res),
                    ontimeout: () => reject("timeout"),
                    onerror: (err) => reject(err)
                });
            });
        }
        
        async getAnswer(questionData) {
            const defaultConfig = getConfig();
            questionData = { key: defaultConfig.thtoken || "", ...questionData };
            
            return new Promise((resolve) => {
                this.defaultRequest(`${this.api1}/search`, "POST", questionData, {}, true)
                    .then((res) => {
                        const data = JSON.parse(res.responseText);
                        if (data.code === -1) {
                            this.s2(data.data);
                            resolve({ form: "题库海", answer: data.msg || "" });
                        } else {
                            resolve({ 
                                form: "题库海", 
                                answer: data.data.answer || data.msg || "", 
                                num: data.data.num || "", 
                                usenum: data.data.usenum || ""
                            });
                        }
                    })
                    .catch((e) => {
                        resolve({ form: "题库海", answer: "" });
                    });
            });
        }
        
        async getAnswer2(questionData) {
            let ip = Array.from({ length: 4 }, () => Math.floor(255 * Math.random())).join(".");
            
            return new Promise((resolve) => {
                let ques = { question: questionData.question };
                this.defaultRequest(this.api2, "POST", ques, {
                    "Content-Type": "application/json",
                    Authorization: getConfig().yztoken,
                    "X-Forwarded-For": ip,
                    "X-Real-IP": ip
                })
                .then((response) => {
                    const res = JSON.parse(response.responseText);
                    let answer = "";
                    if (res.code === 1) {
                        let data = res.data.replace(/javascript:void\(0\);/g, "").trim().replace(/\n/g, "");
                        if (!(data.includes("叛逆") || data.includes("公众号") || data.includes("李恒雅") || data.includes("一之"))) {
                            answer = data.split("#");
                        }
                    }
                    resolve({ form: "一之题库", answer });
                })
                .catch(() => {
                    resolve({ form: "一之题库", answer: "" });
                });
            });
        }
        
        async getAnswer3(questionData) {
            return new Promise((resolve) => {
                const ques = { token: getConfig().enncytoken, title: questionData.question };
                this.defaultRequest(this.api3, "POST", ques)
                .then((response) => {
                    const res = JSON.parse(response.responseText);
                    resolve({ form: "言溪题库", answer: res.code === 1 ? res.data.answer : "" });
                })
                .catch(() => {
                    resolve({ form: "言溪题库", answer: "" });
                });
            });
        }
        
        async getAnswer4(questionData) {
            return new Promise((resolve) => {
                const ques = { question: questionData.question, type: parseInt(questionData.type) };
                this.defaultRequest(this.api4, "POST", ques, { "Content-Type": "application/json" })
                .then((response) => {
                    const res = JSON.parse(response.responseText);
                    resolve({ form: "free4", answer: res.code === 1 ? res.data.split("#") : "" });
                })
                .catch(() => {
                    resolve({ form: "free4", answer: "" });
                });
            });
        }
        
        async s(questionList, url) {
            return new Promise(async (resolve) => {
                const ques = { questionList, url };
                await this.defaultRequest(`${this.api1}/save1`, "POST", ques, { "Content-Type": "application/json" })
                    .then((response) => resolve())
                    .catch((e) => resolve());
            });
        }
        
        async s2(data) {
            if (!data.url) return;
            
            return new Promise(async (resolve) => {
                try {
                    const response = await this.defaultRequest(data.url, "GET", null, {});
                    const html = response.responseText;
                    let document1 = new DOMParser().parseFromString(html, "text/html");
                    let questionList = document1.getElementsByClassName("Py-mian1");
                    let questionListHtml = [];
                    
                    for (let i = 0; i < questionList.length; i++) {
                        try {
                            if (i === 0) continue;
                            
                            let questionTitle = this.removeHtml(questionList[i].getElementsByClassName("Py-m1-title")[0].innerHTML);
                            let questionTypeMatch = questionTitle.match(/\[(.*?)\]/);
                            if (!questionTypeMatch) continue;
                            
                            let questionType = questionTypeMatch[1];
                            if (questionType === "单选题" || questionType === "多选题") {
                                questionTitle = questionTitle
                                    .replace(/[0-9]{1,3}.\s/gi, "")
                                    .replace(/(^\s*)|(\s*$)/g, "")
                                    .replace(/^【.*?】\s*/, "")
                                    .replace(/\[(.*?)\]\s*/, "")
                                    .replace(/\s*（\d+\.\d+分）$/, "");
                                
                                let optionHtml = $(questionList[i]).find("ul.answerList li.clearfix");
                                let optionText = [];
                                
                                optionHtml.each(function(index, item) {
                                    let abcd = String.fromCharCode(65 + index) + ".";
                                    let optionTemp = this.removeHtml(item.innerHTML);
                                    if (optionTemp.indexOf(abcd) === 0) {
                                        optionTemp = optionTemp.replace(abcd, "").trim();
                                    }
                                    optionText.push(optionTemp);
                                }.bind(this));
                                
                                questionListHtml.push({
                                    question: questionTitle,
                                    type: this.getQuestionType(questionType),
                                    options: optionText,
                                    questionData: questionList[i].innerHTML
                                });
                            }
                        } catch (e) {
                            continue;
                        }
                    }
                    
                    let postData = { questionList: questionListHtml, url: data.url };
                    await this.defaultRequest(data.url1, "POST", postData, {}, true);
                } catch (e) {
                    // 忽略错误
                } finally {
                    resolve();
                }
            });
        }
        
        removeHtml(html) {
            return html.replace(/<[^>]*>/g, "");
        }
        
        getQuestionType(typeStr) {
            const typeMap = {
                "单选题": 1,
                "多选题": 2,
                "判断题": 3
            };
            return typeMap[typeStr] || 1;
        }
    }
    
    // 工具函数
    const $ = {
        uuid() {
            return "xxxxxxxxxxxx4xxxyxxxxxxxxxxxxxxx".replace(/[xy]/g, function(c) {
                const r = Math.random() * 16 | 0;
                const v = c === "x" ? r : r & 3 | 8;
                return v.toString(16);
            });
        },
        random(min, max) {
            return Math.round(Math.random() * (max - min)) + min;
        },
        async sleep(period) {
            return new Promise((resolve) => {
                setTimeout(resolve, period);
            });
        },
        isInBrowser() {
            return typeof window !== "undefined" && typeof window.document !== "undefined";
        },
        isInTopWindow() {
            return self === top;
        }
    };
    
    // 防抖函数
    function debounce(func, wait, options) {
        let lastArgs, lastThis, maxWait, result, timerId, lastCallTime, lastInvokeTime = 0, leading = false, maxing = false, trailing = true;
        
        if (typeof func != "function") {
            throw new TypeError("Expected a function");
        }
        
        wait = Number(wait) || 0;
        if (typeof options === "object") {
            leading = !!options.leading;
            maxing = "maxWait" in options;
            maxWait = maxing ? Math.max(Number(options.maxWait) || 0, wait) : maxWait;
            trailing = "trailing" in options ? !!options.trailing : trailing;
        }
        
        function invokeFunc(time) {
            const args = lastArgs, thisArg = lastThis;
            lastArgs = lastThis = void 0;
            lastInvokeTime = time;
            result = func.apply(thisArg, args);
            return result;
        }
        
        function leadingEdge(time) {
            lastInvokeTime = time;
            timerId = setTimeout(timerExpired, wait);
            return leading ? invokeFunc(time) : result;
        }
        
        function remainingWait(time) {
            const timeSinceLastCall = time - lastCallTime, timeSinceLastInvoke = time - lastInvokeTime, timeWaiting = wait - timeSinceLastCall;
            return maxing ? Math.min(timeWaiting, maxWait - timeSinceLastInvoke) : timeWaiting;
        }
        
        function shouldInvoke(time) {
            const timeSinceLastCall = time - lastCallTime, timeSinceLastInvoke = time - lastInvokeTime;
            return lastCallTime === void 0 || timeSinceLastCall >= wait || timeSinceLastCall < 0 || (maxing && timeSinceLastInvoke >= maxWait);
        }
        
        function timerExpired() {
            const time = Date.now();
            if (shouldInvoke(time)) {
                return trailingEdge(time);
            }
            timerId = setTimeout(timerExpired, remainingWait(time));
        }
        
        function trailingEdge(time) {
            timerId = void 0;
            if (trailing && lastArgs) {
                return invokeFunc(time);
            }
            lastArgs = lastThis = void 0;
            return result;
        }
        
        function cancel() {
            if (timerId !== void 0) {
                clearTimeout(timerId);
            }
            lastInvokeTime = 0;
            lastArgs = lastCallTime = lastThis = timerId = void 0;
        }
        
        function flush() {
            return timerId === void 0 ? result : trailingEdge(Date.now());
        }
        
        function debounced() {
            const time = Date.now(), isInvoking = shouldInvoke(time);
            lastArgs = arguments;
            lastThis = this;
            lastCallTime = time;
            
            if (isInvoking) {
                if (timerId === void 0) {
                    return leadingEdge(lastCallTime);
                }
                if (maxing) {
                    clearTimeout(timerId);
                    timerId = setTimeout(timerExpired, wait);
                    return invokeFunc(lastCallTime);
                }
            }
            if (timerId === void 0) {
                timerId = setTimeout(timerExpired, wait);
            }
            return result;
        }
        
        debounced.cancel = cancel;
        debounced.flush = flush;
        return debounced;
    }
    
    // 字符串工具类
    class StringUtils {
        constructor(_text) {
            this._text = _text;
        }
        
        static nowrap(str, replace_str) {
            return (str == null ? void 0 : str.replace(/\n/g, replace_str)) || "";
        }
        
        nowrap(replace_str) {
            this._text = StringUtils.nowrap(this._text, replace_str);
            return this;
        }
        
        static nospace(str) {
            return (str == null ? void 0 : str.replace(/ +/g, " ")) || "";
        }
        
        nospace() {
            this._text = StringUtils.nospace(this._text);
            return this;
        }
        
        static noSpecialChar(str) {
            return (str == null ? void 0 : str.replace(/[^\w\s]/gi, "")) || "";
        }
        
        noSpecialChar() {
            this._text = StringUtils.noSpecialChar(this._text);
            return this;
        }
        
        static max(str, len) {
            return str.length > len ? str.substring(0, len) + "..." : str;
        }
        
        max(len) {
            this._text = StringUtils.max(this._text, len);
            return this;
        }
        
        static hide(str, start, end, replacer = "*") {
            return str.substring(0, start) + str.substring(start, end).replace(/./g, replacer) + str.substring(end);
        }
        
        hide(start, end, replacer = "*") {
            this._text = StringUtils.hide(this._text, start, end, replacer);
            return this;
        }
        
        static of(text) {
            return new StringUtils(text);
        }
        
        toString() {
            return this._text;
        }
    }
    
    // 答案匹配函数
    function compareTwoStrings(first, second) {
        first = first.replace(/\s+/g, "");
        second = second.replace(/\s+/g, "");
        
        if (first === second) return 1;
        if (first.length < 2 || second.length < 2) return 0;
        
        let firstBigrams = new Map();
        for (let i = 0; i < first.length - 1; i++) {
            const bigram = first.substring(i, i + 2);
            const count = firstBigrams.has(bigram) ? firstBigrams.get(bigram) + 1 : 1;
            firstBigrams.set(bigram, count);
        }
        
        let intersectionSize = 0;
        for (let i = 0; i < second.length - 1; i++) {
            const bigram = second.substring(i, i + 2);
            const count = firstBigrams.has(bigram) ? firstBigrams.get(bigram) : 0;
            if (count > 0) {
                firstBigrams.set(bigram, count - 1);
                intersectionSize++;
            }
        }
        
        return 2 * intersectionSize / (first.length + second.length - 2);
    }
    
    function findBestMatch(mainString, targetStrings) {
        if (!Array.isArray(targetStrings) || !targetStrings.length) {
            throw new Error("Bad arguments: First argument should be a string, second should be an array of strings");
        }
        
        const ratings = [];
        let bestMatchIndex = 0;
        
        for (let i = 0; i < targetStrings.length; i++) {
            const currentTargetString = targetStrings[i];
            const currentRating = compareTwoStrings(mainString, currentTargetString);
            ratings.push({ target: currentTargetString, rating: currentRating });
            if (currentRating > ratings[bestMatchIndex].rating) {
                bestMatchIndex = i;
            }
        }
        
        const bestMatch = ratings[bestMatchIndex];
        return { ratings, bestMatch, bestMatchIndex };
    }
    
    // 初始化应用
    function initApp() {
        // 挂载Vue应用
        const app = Vue.createApp(App);
        app.use(pinia);
        app.use(ElementPlus);
        app.mount(document.createElement('div'));
        
        // 初始化服务API
        const serverApi = new ServerApi();
        
        // 在这里添加更多初始化逻辑
        console.log("iKaiKail网课全能助手已加载");
    }
    
    // 页面加载完成后初始化
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initApp);
    } else {
        initApp();
    }
    
})();
