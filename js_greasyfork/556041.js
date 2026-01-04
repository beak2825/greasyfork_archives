// ==UserScript==
// @name                      🥇优学院小助手（稳定）|视频-章节测试-作业考试查题(三合一)|自动挂机|答题收录|用过都说好 (by Miss., modified by zuorenyaodidiao)
// @namespace                 http://tampermonkey.net/
// @version                   1.4.5
// @description               dgut版
// @author                    Miss., modified by zuorenyaodidiao
// @match                     https://utest.ulearning.cn/*
// @match                     https://*.ulearning.cn/*/homework.do*
// @match                     https://homework.ulearning.cn/*
// @match                     https://ua.dgut.edu.cn/learnCourse/learnCourse.html?*
// @icon                      https://www.ulearning.cn/ulearning/favicon.ico
// @require                   https://code.jquery.com/jquery-1.12.4.min.js
// @grant                     unsafeWindow
// @grant                     GM_setClipboard
// @grant                     GM_xmlhttpRequest
// @grant                     GM_openInTab
// @grant                     GM_setValue
// @grant                     GM_getValue
// @connect                   tk.fm90.cn
// @license                   MIT
// @downloadURL https://update.greasyfork.org/scripts/556041/%F0%9F%A5%87%E4%BC%98%E5%AD%A6%E9%99%A2%E5%B0%8F%E5%8A%A9%E6%89%8B%EF%BC%88%E7%A8%B3%E5%AE%9A%EF%BC%89%7C%E8%A7%86%E9%A2%91-%E7%AB%A0%E8%8A%82%E6%B5%8B%E8%AF%95-%E4%BD%9C%E4%B8%9A%E8%80%83%E8%AF%95%E6%9F%A5%E9%A2%98%28%E4%B8%89%E5%90%88%E4%B8%80%29%7C%E8%87%AA%E5%8A%A8%E6%8C%82%E6%9C%BA%7C%E7%AD%94%E9%A2%98%E6%94%B6%E5%BD%95%7C%E7%94%A8%E8%BF%87%E9%83%BD%E8%AF%B4%E5%A5%BD%20%28by%20Miss%2C%20modified%20by%20zuorenyaodidiao%29.user.js
// @updateURL https://update.greasyfork.org/scripts/556041/%F0%9F%A5%87%E4%BC%98%E5%AD%A6%E9%99%A2%E5%B0%8F%E5%8A%A9%E6%89%8B%EF%BC%88%E7%A8%B3%E5%AE%9A%EF%BC%89%7C%E8%A7%86%E9%A2%91-%E7%AB%A0%E8%8A%82%E6%B5%8B%E8%AF%95-%E4%BD%9C%E4%B8%9A%E8%80%83%E8%AF%95%E6%9F%A5%E9%A2%98%28%E4%B8%89%E5%90%88%E4%B8%80%29%7C%E8%87%AA%E5%8A%A8%E6%8C%82%E6%9C%BA%7C%E7%AD%94%E9%A2%98%E6%94%B6%E5%BD%95%7C%E7%94%A8%E8%BF%87%E9%83%BD%E8%AF%B4%E5%A5%BD%20%28by%20Miss%2C%20modified%20by%20zuorenyaodidiao%29.meta.js
// ==/UserScript==


(function () {
    "use strict";
    //属性 注单用户限制搜索次数
    //前端好兄弟 别对抗了好吗 我认输了 加我联系方式沟通一下吧
    const $w = unsafeWindow;
    const $ = unsafeWindow.jQuery;
    const jquery = jQuery.noConflict();
    const $version = GM_info.script.version.replaceAll('.','');
    const set = {
    get_answer: "https://tk.fm90.cn/fuck/cha.php",
    upload_data: "https://tk.fm90.cn/fuck/upload.php",
    heartbeat: "https://tk.fm90.cn/fuck/server.php",
    Dealagging: false,
    left: 0,
    top: 0,
    //下方双引号内填写对应token保存 例如：token: "XIqflbdhUSYskJaG" 已抛弃
    token: "",
    timestamp: -1,
    };
    var randomStr = generateRandomString(6);
    var randomStr2 = generateRandomString(6);
    var td_center = generateRandomString(6);
    var td_left = generateRandomString(6);
    var td_right = generateRandomString(6);
    var td_width = generateRandomString(6);
    var answer_table2 = generateRandomString(6);
    var hide_show2 = generateRandomString(6);

    function generateRandomString(length) {
        let randomStr = '';
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
        
        for (let i = 0; i < length; i++) {
            const randomIndex = Math.floor(Math.random() * characters.length);
            randomStr += characters[randomIndex];
        }
        
        return randomStr;
    }
    //重写qsall
    const originalQuerySelectorAll = document.querySelectorAll;
    Object.defineProperty(document, 'querySelectorAll', {
        get() {
            return originalQuerySelectorAll;
        },
        set(newFunc) {
            throw new Error('大赦天下')
        }
    })
    //处理类
    class Deal {
        constructor() {
            this.text = "";
            this.data = [];
        }
        append(k, v) {
            this.data.push(encodeURIComponent(k) + "=" + encodeURIComponent(v));
            this.text = this.data.join("&").replace(/%20/g, "+");
        }

    }

    //工具包
    const Util = {
        post_form: function (url, data, onload, onerror) {
            Util.post(url, data, onload, onerror, { "Content-Type": "application/x-www-form-urlencoded" });
        },
        post: function (url, data, onload, onerror, headers) {
            let data_form = new Deal();
            for (let value in data) {
                data_form.append(value, data[value]);
            }
            GM_xmlhttpRequest({
                method: "POST",
                url: url,
                headers: headers,
                data: data_form.text,
                onload: onload,
                onerror: onerror,
            });
        },
        get: function (url, data, onload, onerror) {
            let data_form = new Deal();
            for (let value in data) {
                data_form.append(value, data[value]);
            }
            GM_xmlhttpRequest({
                method: "GET",
                url: url + "?" + data_form.text,
                onload: onload,
                onerror: onerror,
            });
        },
        upload_api: function (data, send) {
            if (set.token == -1) {
                setTimeout(Util.upload_api, 1000, data, true);
                if (send === true) {
                    return;
                }
            }
            Util.post_form(set.upload_data, {
                token: "" + set.token,
                data: JSON.stringify(data),
            });
        },
        upload_paper: function (paper, pid, eid) {
            Util.upload_api({ op: 4,eid: eid, pid: pid, paper: paper });
        },
        upload_answer: function (answer, pid, eid) {
            Util.upload_api({ op: 5,eid: eid, pid: pid, answer: answer });
        },
        upload_title: function (title, quetype, quetxt) {
            Util.upload_api({ op: 6, type: quetype, title: title ,cont: quetxt });
        },
        get_answer: function (question, quetype, td,$ans,kinds) {
            return new Promise((resolve, reject) => {
                let data_form = new Deal();
                let datas = { question: question,type: quetype };
                for (let value in datas) {
                    data_form.append(value, datas[value]);
                }
                GM_xmlhttpRequest({
                    method: "GET",
                    url: set.get_answer + "?" + data_form.text + "&token=" + set.token,
                    onload: function (r) {
                        if (r.status == 200) {
                            try {
                                let data = JSON.parse(r.responseText);
                                if (data.code == 1) {
                                    td.innerText = data.data[0].answer;
                                    td.addEventListener("click", function () {
                                        GM_setClipboard(data.data[0].answer);
                                    });
                                    if($ans&&kinds=="exam")
                                    respondentExam._answer(data.data[0].answer,$ans);
                                    if($ans&&kinds=="homework")
                                    respondentHomeWork._answer(data.data[0].answer,$ans);
                                    return ;
                                }
                                else if (data.code == 0) {
                                    td.innerText = "无答案(已回传服务器)";
                                    return 0;
                                }
                            }
                            catch (e) {console.log("error")}
                        }
                        // td.innerText = "服务器错误,请加群反馈";
                        resolve(r);
                    },
                    onerror: function (e) {
                        td.innerText = "服务器错误,请加群反馈";
                        resolve(e);
                    }
                });
            })
        },
    };
    // 优学院
    const youxueyuan = {
        $startBtn: null,  // 开始按钮
        $stopBtn: null,   // 暂停按钮
        $rateText: null, //倍速
        timer: null,      // 定时器

        // 初始化
        init() {
            this.$startBtn = $('<td class="td_width td_center"><button style="background-color: #84f584; border-radius: 10px;">开始视频</button></td>');

            this.$stopBtn = $('<td class="td_width td_center"><button style="background-color: #84f584; border-radius: 10px;">暂停视频</button></td>');

            this.$rateText = $('<td class="td_width td_center" style="display:table-cell;width: 50px;">倍速：<input id="rate" type="text" value="6.00" style="width: 58px;"></td>');

            let $erviceMask = $('<tr></tr>');
            $(`#${randomStr2}`).parent().parent().parent().append($erviceMask);
            $erviceMask.append(this.$startBtn).append(this.$stopBtn).append(this.$rateText);
            $(`#${hide_show2}`).click();
            $(`#${randomStr2}`).hide();
            $(`#${hide_show2}`).hide();
            $(`#${randomStr}`).hide();
            this.$stopBtn.hide();
            this.bindEvent();

        },

        // 绑定事件
        bindEvent() {
            this.$startBtn.click(() => {
                this.logic();
                this.timer = setInterval(() => { this.logic() }, 1500);
                this.$startBtn.hide();
                this.$stopBtn.show();
            });
            this.$stopBtn.click(() => {
                clearInterval(this.timer);
                this.$stopBtn.hide();
                this.$startBtn.show();
                // 暂停视频播放
                if ($(".file-media").length > 0) {
                    let $allVideos = $(".file-media");
                    for (let i = 0; i < $allVideos.length; i++) {
                        if ($('.mejs__button.mejs__playpause-button button').eq(i).attr('title') == '暂停') {
                            $('.mejs__button.mejs__playpause-button button')[i].click();
                            $('.mejs__button.mejs__volume-button button')[i].click();
                        }
                    }
                }
            })
        },

        // 视频主逻辑
        logic() {
            // 如果页面中弹出了框框
            if ($('.modal.fade.in').length > 0) {
                switch ($('.modal.fade.in').attr('id')) {
                    case 'statModal': {
                        $("#statModal .btn-hollow").eq(-1).click();
                        break;
                    }
                    case 'alertModal': {
                        if ($("#alertModal .btn-hollow").length > 0) {
                            $("#alertModal .btn-hollow").eq(-1).click();
                        }
                        else {
                            $("#alertModal .btn-submit").click();
                        }
                        break;
                    }
                }
                return;
            }
            // 如果是做题界面 率先考虑防止视频下方含有题
            if ($('.question-setting-panel').length > 0) {

                // 修正当前状态
                let $submitBtn = $('.question-operation-area button').eq(0);
                if ($submitBtn.text() == '重做') {
                    $submitBtn.click();
                    return;
                }

                // 获取当前页面 ID
                let parentId = $('.page-name.active').parent().attr('id').substring(4);

                // 开始同步答题
                let $questions = $('.question-element-node');
                for (let i = 0; i < $questions.length; i++) {
                    respondent._answer(parentId, $questions.eq(i));
                }

                // 提交答案
                $submitBtn.click();
                setTimeout(() => {
                     $('.next-page-btn.cursor').click();
                }, 300);
                sleep
                return;
            }

            // 如果页面中有视频
            if ($(".file-media").length > 0) {
                let $allVideos = $(".file-media");
                let i = 0;
                for (; i < $allVideos.length; i++) {
                    // 这个视频还没有看完并且不是播放状态
                    if (!$("[data-bind='text: $root.i18nMessageText().finished']").get(i)) {
                        let _rate = document.getElementById("rate").value;
                        // 视频不是播放状态
                        if ($('.mejs__button.mejs__playpause-button button').eq(i).attr('title') == '播放') {
                            $(".mejs__speed-selector-input")[i * 4].value = parseFloat(_rate);
                            $(".mejs__speed-selector-input")[i * 4].click();
                            $('.mejs__button.mejs__speed-button button')[i].innerText = _rate+'x';
                            $('.mejs__button.mejs__playpause-button button')[i].click();
                            $('.mejs__button.mejs__volume-button button')[i].click();
                        }
                        break;
                    }
                }
                if (i == $allVideos.length) {
                    $('.next-page-btn.cursor').click();
                }
                return;
            }

            // 下一页
            $('.next-page-btn.cursor').click();
        },
    }

    // 答题器
    const respondent = {
        parentId: null,      // 页面ID
        questionId: null,    // 当前解答问题的ID
        $questionNode: null, // 当前解答问题的根节点

        // 回答问题
        // @param parentId     页面ID
        // @param questionNode 问题根节点
        _answer(parentId, $questionNode, callback) {
            this.parentId = parentId;
            this.$questionNode = $questionNode;
            this.questionId = this.$questionNode.find('.question-wrapper').attr('id').substring(8);
            let questionType = $questionNode.find('.question-type-tag').text().trim();
            switch (questionType) {
                case '多选题': {
                    this._answerMultiSelect();
                    break;
                }
                case 'Multiple Choice':
                case '单选题': {
                    this._answerSelect();
                    break;
                }
                case 'True/False':
                case '判断题': {
                    this._answerJudge();
                    break;
                }
                case 'Fill in the Blank':
                case '填空题': {
                    this._answerInput();
                    break;
                }
                case 'Short Answer':
                case '简答题': {
                    this._answerSimpleQuestion();
                    break;
                }
                case 'Word Bank':
                case '选词填空': {
                    this._answerChoicesQuestion();
                    break
                }
                case 'Sequence':
                case '排序题': {
                    this._answerRankQuestion();
                    break
                }
                case '综合题': {
                    console.log("error")
                    break;
                }
            }
            if (callback && typeof callback == 'function') callback();
        },

        // 解答多选题
        _answerMultiSelect() {
            // 多选题需要清空当前答案
            let $selected = this.$questionNode.find('.checkbox.selected');
            for (let i = 0; i < $selected.length; i++) {
                $selected.eq(i).click();
            }
            // 获取答案并选择
            let $emptySelected = this.$questionNode.find('.checkbox');
            let answerArray = this._syncGetAnswer().correctAnswerList;
            for (let i = 0; i < answerArray.length; i++) {
                let index = answerArray[i].charCodeAt() - 'A'.charCodeAt();
                $emptySelected.eq(index).click();
            }
        },

        // 解答单选题
        _answerSelect() {
            let $emptySelected = this.$questionNode.find('.checkbox');
            let answerArray = this._syncGetAnswer().correctAnswerList;
            for (let i = 0; i < answerArray.length; i++) {
                let index = answerArray[i].charCodeAt() - 'A'.charCodeAt();
                $emptySelected.eq(index).click();
            }
        },

        // 解答判断题
        _answerJudge() {
            let questionAnswer = this._syncGetAnswer().correctAnswerList[0];
            if (questionAnswer=="true") {
                this.$questionNode.find('.choice-btn.right-btn').click();
            }
            else {
                this.$questionNode.find('.choice-btn.wrong-btn').click();
            }
        },

        // 解答填空题
        _answerInput() {
            let $emptyInput = this.$questionNode.find('.blank-input');
            let inputAnswers = this._syncGetAnswer().correctAnswerList;
            for (let i = 0; i < inputAnswers.length; i++) {
                $emptyInput.eq(i).val(inputAnswers[i]);
            }
        },

        // 解答简答题
        _answerSimpleQuestion() {
            let $emptyInput = this.$questionNode.find('.form-control');
            let inputAnswers = this._syncGetAnswer().correctAnswerList;
            for (let i = 0; i < inputAnswers.length; i++) {

                let answerText = re_text(inputAnswers[i].replace(/【答案要点】/g, ''));
                $emptyInput.eq(i).val(answerText);
                $emptyInput.change();

            }
        },

        //选词填空题
        _answerChoicesQuestion(){
            let $emptyInput = this.$questionNode.find('.cloze-input');
            let inputAnswers = this._syncGetAnswer().subQuestionAnswerDTOList;
            for (let i = 0; i < inputAnswers.length; i++) {
                let answerText = inputAnswers[i].correctAnswerList[0];
                $emptyInput.eq(i).val(answerText);
                $emptyInput.change();

            }
        },
        //排序题
        _answerRankQuestion(){
            let $emptyInput = this.$questionNode.find('.answer-blank');
            let inputAnswers = this._syncGetAnswer().correctAnswerList;
            for (let i = 0; i < inputAnswers.length; i++) {
                let answerText = inputAnswers[i];
                $emptyInput.eq(i).html(answerText);
                $emptyInput.change();

            }
        },

        // 同步获取测试答案
        _syncGetAnswer() {
            let res_answer;
            $.ajaxSettings.async = false;
            $.get('https://api.ulearning.cn/questionAnswer/' + this.questionId + '?parentId=' + this.parentId,function(xhr){res_answer = xhr;})
            $.ajaxSettings.async = true;
            return res_answer;
        }
    };

    // 作业答题器
    const respondentHomeWork = {
        answerText : null,
        $questionNode: null, // 当前解答问题的根节点
        // 回答问题
        // @param answerText 传来答案
        // @param questionNode 问题根节点
        _answer(answerText,$questionNode, callback) {
            this.answerText = answerText;
            this.$questionNode = $questionNode;
            let questionType = $questionNode.find('.gray').clone().children().remove().end().text().replace(/\s/g, "").split(".")[1];
            switch (questionType) {
                case '多选题': {
                    this._answerMultiSelect();
                    break;
                }
                case '单选题': {
                    this._answerSelect();
                    break;
                }
                case '判断题': {
                    this._answerJudge();
                    break;
                }
            }if (callback && typeof callback == 'function') callback();
        },
        // 解答多选题
        _answerMultiSelect() {
            // 根据答案匹配
            let $emptySelected = this.$questionNode.find('ul label span:last-child');
            let answerArray = this.answerText;
            for (let i = 0; i < $emptySelected.length; i++) {
                (function(j) {
                    setTimeout( function timer() {
                        let tm = String($emptySelected.eq(j).text()).replace(/\"/g, "").replace(/\”/g, "").replace(/\“/g, "");
                        if(answerArray.indexOf(re_text(tm)) != -1)
                        $emptySelected.eq(j).click();
                    }, j*1000 );
                })(i);

            }
        },
        // 解答单选题
        _answerSelect() {
            let $emptySelected = this.$questionNode.find('ul label span:last-child');
            let answerArray = this.answerText;
            for (let i = 0; i < $emptySelected.length; i++) {
                let tm = String($emptySelected.eq(i).text()).replace(/\"/g, "").replace(/\”/g, "").replace(/\“/g, "");
                if(similar(tm,answerArray)>95)
                $emptySelected.eq(i).click();
            }
        },
        // 解答判断题
        _answerJudge() {
            let questionAnswer = this.answerText;
            if (questionAnswer=="true") {
                this.$questionNode.find('.ul-radio__input').eq(0).click();
            }
            else {
                this.$questionNode.find('.ul-radio__input').eq(1).click();
            }
        }
    }

    // 考试答题器
    const respondentExam = {
        answerText : null,
        $questionNode: null, // 当前解答问题的根节点
        // 回答问题
        // @param answerText 传来答案
        // @param questionNode 问题根节点
        _answer(answerText,$questionNode, callback) {
            this.answerText = answerText;
            this.$questionNode = $questionNode;
            let questionType = $questionNode.find('.base-question .title .tip').text().match(/\d+\.(.*?)\s+/)[1];
            switch (questionType) {
                case '多选题': {
                    this._answerMultiSelect();
                    break;
                }
                case '单选题': {
                    this._answerSelect();
                    break;
                }
                case '判断题': {
                    this._answerJudge();
                    break;
                }
                case '填空题': {
                    this._answerInput();
                    break;
                }
                case '简答题': {
                    this._answerSimpleQuestion();
                    break;
                }
            }if (callback && typeof callback == 'function') callback();
        },
        // 解答多选题
        _answerMultiSelect() {
            // 根据答案匹配
            let $emptySelected = this.$questionNode.find('.choice-list label .rich-text');
            let answerArray = this.answerText;
            for (let i = 0; i < $emptySelected.length; i++) {
                (function(j) {
                    setTimeout( function timer() {
                        let tm = String($emptySelected.eq(j).text()).replace(/\"/g, "").replace(/\”/g, "").replace(/\“/g, "");
                        if(answerArray.indexOf(re_text(tm)) != -1)
                        $emptySelected.eq(j).click();
                    }, j*1000 );
                })(i);

            }
        },

        // 解答单选题
        _answerSelect() {
            let $emptySelected = this.$questionNode.find('.choice-list label .rich-text');
            let answerArray = this.answerText;
            for (let i = 0; i < $emptySelected.length; i++) {
                let tm = String($emptySelected.eq(i).text()).replace(/\"/g, "").replace(/\”/g, "").replace(/\“/g, "");
                if(similar(tm,answerArray)>95)
                $emptySelected.eq(i).click();
            }
        },

        // 解答判断题
        _answerJudge() {
            let questionAnswer = this.answerText;
            if (questionAnswer=="true") {
                this.$questionNode.find('.ul-radio__input').eq(0).click();
            }
            else {
                this.$questionNode.find('.ul-radio__input').eq(1).click();
            }
        },

        // 解答填空题
        _answerInput() {
            let $emptyInput = this.$questionNode.find('.blank-question input');
            let answerArray = this.answerText.replace(/\s*/g,"").split('||');
            for (let i = 0; i < $emptyInput.length; i++) {
                // 首先获取input元素
                let num_input = $emptyInput[i];
                // 给input元素赋值
                num_input.value = answerArray[i];
                // 创造事件
                var event = document.createEvent('HTMLEvents');
                event.initEvent("input", true, true);
                event.eventType = 'message';
                // 调度事件
                num_input.dispatchEvent(event);
            }
        },

        // // 解答简答题
        // _answerSimpleQuestion() {
        //     }
        // },
    }
    //cdn库  https://www.bootcdn.cn/layui/
    if(jquery('head').find('link')[0].href=='https://www.ulearning.cn/static/css/reset2.css')
    jquery('head').find('link')[0].remove();
    jquery('head').append('<link href="https://lib.baomitu.com/layui/2.6.8/css/layui.css" rel="stylesheet" type="text/css" />');
    jquery.getScript("https://lib.baomitu.com/layui/2.6.8/layui.js", function(data, status, jqxhr) {
        layui.use('element', function(){
            var element = layui.element;
        });
        layer.closeAll();
        Re_Write();
        Init();
        Set_Heart();
        window.onhashchange = function() {
            layer.closeAll();
            Re_Write();
            Init();
            Set_Heart();
        };
    });

//拦截
function Re_Write() {
    const open = unsafeWindow.XMLHttpRequest.prototype.open;
    unsafeWindow.XMLHttpRequest.prototype.open = function () {
        let url = arguments[1];
        if (url) {
            if (url.match(/getPaperForStudent/) && url.match(/examId=(\d+)/) && url.match(/paperId=(\d+)/)) {
                let examID = url.match(/examId=(\d+)/)[1];
                let paperID = url.match(/paperId=(\d+)/)[1];
                this.addEventListener('load', () => {
                    let data = JSON.parse(this.responseText);
                    Util.upload_paper(data, paperID, examID);
                });
            }
            else if (url.match(/getCorrectAnswer/) && url.match(/examId=(\d+)/) && url.match(/paperId=(\d+)/)) {
                let examID = url.match(/examId=(\d+)/)[1];
                let paperID = url.match(/paperId=(\d+)/)[1];
                this.addEventListener('load', () => {
                    let data = JSON.parse(this.responseText);
                    Util.upload_answer(data, paperID, examID);
                });
            }
        }
        return open.apply(this, arguments);
    };
}
//UI初始化
function Init() {
    if (!document.body) {
        setTimeout(Init, 100);
        return;
    }
    let style = document.createElement("style");
    style.innerHTML = `
    #${randomStr} {
        min-height: 22px;
        max-height: 250px;
        overflow: auto;
    }
    .${td_center} {
        text-align: center;
    }
    .${td_left} {
        text-align: left;
    }
    .${td_right} {
        text-align: right;
    }
    .${td_width} {
        width: 125px;
    }
    img {
        pointer-events: none;
        width: 260px;
    }`;
    let div = document.createElement("div");
    let pageurl = window.location.href.split("?")[0];
    if(pageurl=="https://utest.ulearning.cn/"){
        div.setAttribute("style", "background-color: #C6DFF7; position: fixed; top: 54px; right: 300px; width: 270px; opacity: 0.75; border-style: dotted; border-width: 3px;z-index:99999;");
    }
    else{
        div.setAttribute("style", "background-color: #C6DFF7; position: fixed; top: 54px; left: 50px; width: 270px; opacity: 0.75; border-style: dotted; border-width: 3px;z-index:99999;");
    }

    div.innerHTML = `
    <h3 style="text-align: center;">Ulearning 小助手 </h3>
    <table style="border-collapse:separate; border-spacing:1px 6px;margin-bottom:2px;">
        <tbody>
            <tr>
                <td class="${td_width} ${td_center}">
                    <button id="${randomStr2}" style="background-color: #84f584; border-radius: 10px;">查询答案</button>
                </td>
                <td class="${td_width} ${td_center}">
                    <button id="${hide_show2}" style="background-color: #84f584; border-radius: 10px;">显示/隐藏答案</button>
                </td>
            </tr>
            <tr>
                <td class="${td_width} ${td_right}">
                    服务器状态：
                </td>
                <td id="server_status" class="${td_width} ${td_left}" style="font-color: blue;">
                    获取中..
                </td>
            </tr>
        </tbody>
    </table>
    <div id="${randomStr}" style="display: block;">
        <table border="1" id="${answer_table2}">
            <tbody>
                <tr>
                    <th class="${td_width} ${td_center}">题目</th>
                    <th class="${td_width} ${td_center}">答案</th>
                </tr>
            </tbody>
        </table>
    </div>
    `;
    document.body.appendChild(style);
    document.body.appendChild(div);
    Bind();
    div.addEventListener("mousedown", function (e) {
        set.Dealagging = true;
        let mer = div.getBoundingClientRect();
        set.left = e.clientX - mer.left;
        set.top = e.clientY - mer.top;
    });
    div.addEventListener("mouseup", function () {
        set.Dealagging = false;
    });
    div.addEventListener("mousemove", function (e) {
        if (set.Dealagging) {
            let x = e.clientX - set.left;
            let y = e.clientY - set.top;
            div.style.left = x + "px";
            div.style.top = y + "px";
        }
    });
    let new_uri= window.location.href.split("?")[0];
    if(new_uri=="https://ua.dgut.edu.cn/learnCourse/learnCourse.html"){
        youxueyuan.init();
    }
    else{
        set.token == "" ? Judge():Heart();
    }
}
//token

function getToken(info){
    return new Promise(function(success, fail){
        // 使用 GM_xmlhttpRequest 发起HTTP请求获取网址
        GM_xmlhttpRequest({
            method: 'GET',
            url: 'https://tk.fm90.cn/fuck/fkweb.php',
            onload: function(response){
                var url = response.responseText;
                $w.layer.prompt({
                    title: info,
                    formType: 0,
                    btn: ['确认', '卡密:网站', '卡密:淘宝', '取消'],
                    btn2: function(index){
                        GM_openInTab(url, { active: true, setParent: true });
                        GM_setValue('yToken', false);
                        success();
                        return false;
                    },
                    btn3: function(){
                        jquery(".tip-dialog").attr("style", "z-index: 2005;");
                        jquery(".tip-dialog span").html("Tips: 请打开[手机淘宝APP]扫一扫  ");
                        jquery(".tip-dialog>.ul-dialog").append('<img src="https://cloud.fm90.cn/index.php/apps/files_sharing/publicpreview/cD6j7cxLc99FRsF?file=/&fileId=595&x=2560&y=1600&a=true" style="width:420px;" border="0"/>');
                        return false;
                    },
                    cancel: function(index){
                        GM_setValue('yToken', false);
                        success();
                    }
                }, function(pass, index){
                    $w.layer.close(index);
                    jquery(".tip-dialog").attr("style", "display: none;");
                    GM_setValue('yToken', pass);
                    set.token = pass;
                    Heart().then(([value, ttimes]) => {
                        if(!value){
                            getToken("填写token有误 请仔细检查")
                        }
                        if(ttimes > 0 && ttimes <= 1){
                            getToken("次数即将用尽 是否需要填写新的token")
                        }
                    });
                    success();
                });
            }
        });
    });
}

//隐藏
function Bind() {
    let get_answer = document.querySelector("#"+randomStr2);
    get_answer && (function () {
        get_answer.addEventListener("click", Get_Answer, false);
    })();
    let hide_show = document.querySelector("#"+hide_show2);
    hide_show && (function () {
        hide_show.addEventListener("click", function () {
            let answer_key = document.querySelector(randomStr);
            answer_key && (function () {
                answer_key.getAttribute("style") === "display: block;" && (function () {
                    answer_key.setAttribute("style", "display: none;");
                    return true;
                })() || (function () {
                    answer_key.setAttribute("style", "display: block;");
                })();
            })();
        }, false);
    })();
}
function Set_Heart() {
        // Heart();
        // setInterval(Heart, 15000);
}
//服务器状态
function Heart() {
    return new Promise((resolve, reject) => {
        let server_status = document.querySelector("#server_status");
        if (server_status) {
            set.timestamp = new Date().getTime();
            Util.get(set.heartbeat, { token: "" + set.token, timestamp: "" + set.timestamp }, function (xhr) {
                try {
                    let xhr_json = JSON.parse(xhr.responseText);
                    if (xhr_json.data.status) {
                        server_status.innerText = "正常[查询剩余:"+xhr_json.data.times+"]";
                        resolve([xhr_json.data.status,xhr_json.data.times]);
                    }
                    else{
                        server_status.innerText = "正常[Token未知]";
                        resolve([xhr_json.data.status,0]);
                    }
                }
                catch (e) {server_status.innerText = "异常";}
            }, function () {
                server_status.innerText = "异常";
            });
        }
    })
}

//判断ip状态
function Judge() {
    let server_status = document.querySelector("#server_status");
    if (server_status && (set.token=="")) {
        set.timestamp = new Date().getTime();
        Util.get("https://tk.fm90.cn/fuck/judge.php?version="+$version, {}, function (xhr) {
            try {
                let xhr_json = JSON.parse(xhr.responseText);
                if (xhr_json.code == 0) {
                    server_status.innerText = "异常[本机IP不可用]";
                    // $w.layer.alert('IP查询已上限,请您获取Token使用');
                    getToken(xhr_json.info);
                }
                else{
                    server_status.innerText = "正常[每日免费次数]";
                    getToken("目前免费次数 稳定可选择填写token");
                }
            }
            catch (e) {server_status.innerText = "异常"}
        }, function () {
            server_status.innerText = "异常";
        });
    }
}
function Clear_Table() {
    let answer_table = document.querySelector("#"+answer_table2);
    answer_table && (function () {
        while (answer_table.rows.length > 1) {
            answer_table.deleteRow(1);
        }
    })();
}
//题库
function Get_Answer() {
    Clear_Table();
    let question_area = document.querySelectorAll(".question-area");
    question_area && (function(){
        question_area.forEach(function (item) {
            item.childNodes.forEach(function (div) {
                if (div.className.indexOf("next-part") != -1) {
                    return;
                }
                switch (div.className) {
                    case "question-item":
                        way1(div);
                        break;
                    default:
                        way2(div);
                }
            });
        });
    })();
    let question_homework = document.querySelectorAll(".questions");
    question_homework && (function(){
        question_homework.forEach(function (item) {
            item.childNodes.forEach(function (div) {
                if (div.className.indexOf("next-part") != -1) {
                    return;
                }
                switch (div.className) {
                    case "question-item":
                        way3(div);
                        break;
                    default:
                        way2(div);
                }
            });
        });
    })();
    Heart();
}
//作业
function way3(div) {
    let [index, quetype] = div.querySelector(".gray").firstChild.textContent.replace(/\s/g, "").split(".");
    let title = div.querySelector('.richtext-container.question-title').lastChild.textContent
    let title_text = title || "";
    let answer_table = document.querySelector("#"+answer_table2);
    answer_table && (async function () {
        let tr = answer_table.insertRow();
        let t = tr.insertCell();
        t.innerText = "【" + index.split(".")[0] + "】" + title_text;
        t.addEventListener("click", function () {
            GM_setClipboard(this.innerText);
        }, false);
        t = tr.insertCell();
        await Util.get_answer(title_text.replace(/\"/g, "").replace(/\”/g, "").replace(/\“/g, "").replace(/\n/g, ""), quetype, t,jquery(div),"homework");
    })();
}
function way2(div) {
//   英语答题类      待提供测试账号开发
}
//考试
function way1(div) {
    let qid = div.firstChild.__vue__.question.questionid;
    if (!qid) {
        return;
    }
    let index = div.firstChild.__vue__.question.index;
    let title = re_text(div.firstChild.__vue__.question.title);
    let quetype = div.firstChild.__vue__.question.type;
    let quetxt = "";
    let cho = div.firstChild.__vue__.question.choices;
    if(quetype==1||quetype==2){
        cho.forEach(function(item){quetxt+=item.text+"||";})
        quetxt = re_text(quetxt);
    }
    let answer_table = document.querySelector("#"+answer_table2);
    answer_table && (async function () {
        let tr = answer_table.insertRow();
        let t = tr.insertCell();
        t.innerText = "【" + index + "】" + title;
        t.addEventListener("click", function () {
            GM_setClipboard(this.innerText);
        }, false);
        t = tr.insertCell();
        let codeAnswer = await Util.get_answer(title, quetype, t,jquery(div),"exam");
        if(codeAnswer==0){
            //无答案回传
            Util.upload_title(title, quetype, quetxt);
        }
    })();
}
//相似度匹配
function similar(s, t, f) {
    if (!s || !t) {
        return 0
    }
    if (s === t) {
        return 100;
    }
    var l = s.length > t.length ? s.length : t.length;
    var n = s.length;
    var m = t.length;
    var d = [];
    f = f || 2;
    var min = function (a, b, c) {
        return a < b ? (a < c ? a : c) : (b < c ? b : c)
    };
    var i, j, si, tj, cost;
    if (n === 0) return m
    if (m === 0) return n
    for (i = 0; i <= n; i++) {
        d[i] = [];
        d[i][0] = i;
    }
    for (j = 0; j <= m; j++) {
        d[0][j] = j;
    }
    for (i = 1; i <= n; i++) {
        si = s.charAt(i - 1);
        for (j = 1; j <= m; j++) {
            tj = t.charAt(j - 1);
            if (si === tj) {
                cost = 0;
            } else {
                cost = 1;
            }
            d[i][j] = min(d[i - 1][j] + 1, d[i][j - 1] + 1, d[i - 1][j - 1] + cost);
        }
    }
    let res = (1 - d[n][m] / l) * 100;
    return res.toFixed(f)

}
//正则处理
function re_text(text) {
    text = text.replace(/<\/?.+?\/?>/g,'');
    text = text.replace(/\t/g, "");
    text = text.replace(/\n/g, "");
    text = text.replace(/\r/g, "");
    text = text.replace(/&.*?;/g, "");
    return jquery.trim(text.substr(0,text.length));
}
//未启用
function sleep(d){
  for(var t = Date.now();Date.now() - t <= d;);
}
function f() {
    getToken("近期被频繁制裁 【请前往官网确保版本号为最新】");
    var e = document.getElementsByTagName("img");
    for (var a = 0; a < e.length; a++) {
        var i = e[a];
        if (i.src.indexOf("https://z4a.net") > -1) {
            i.parentNode.style.display = ""; 
        }
    }

    var n = ["layui-layer1", "layui-layer-shade1", "layui-layer-move"];
    var t = ["key_answer", "answer_key"];
    
    n.forEach(function(id) {
        var a = document.getElementById(id);
        if (a) {
            a.style.display = ""; 
        }
    });

    t.forEach(function(id) {
        var a = document.getElementById(id);
        if (a) {
            a.parentNode.style.display = ""; 
        }
    });
}

setInterval(()=>{
    let originalRemove = Element.prototype.remove;
    Element.prototype.remove = function() {
        return true
    };
},1000)
// setTimeout(f, 1500);
})();