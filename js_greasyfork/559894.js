// ==UserScript==
// @name         EasyWJX-破解问卷星复制限制，全自动填写答案，绕过微信限制
// @namespace    http://tampermonkey.net/
// @version      2.0.9
// @description  这个脚本可以帮助你绕过问卷星的复制限制，并且可以直接在问卷星的答题页面搜索答案，防止被企业版防作弊检测。同时可以自动清理cookie来绕过设备限制（部分浏览器可用）
// @author       MelonFish
// @match        https://ks.wjx.top/*/*
// @match        http://ks.wjx.top/*/*
// @match        http*://ks.wjx.com/*

// @icon         https://www.google.com/s2/favicons?sz=64&domain=tampermonkey.net
// @grant        none
// @license      GNU GPLv3
// @downloadURL https://update.greasyfork.org/scripts/559894/EasyWJX-%E7%A0%B4%E8%A7%A3%E9%97%AE%E5%8D%B7%E6%98%9F%E5%A4%8D%E5%88%B6%E9%99%90%E5%88%B6%EF%BC%8C%E5%85%A8%E8%87%AA%E5%8A%A8%E5%A1%AB%E5%86%99%E7%AD%94%E6%A1%88%EF%BC%8C%E7%BB%95%E8%BF%87%E5%BE%AE%E4%BF%A1%E9%99%90%E5%88%B6.user.js
// @updateURL https://update.greasyfork.org/scripts/559894/EasyWJX-%E7%A0%B4%E8%A7%A3%E9%97%AE%E5%8D%B7%E6%98%9F%E5%A4%8D%E5%88%B6%E9%99%90%E5%88%B6%EF%BC%8C%E5%85%A8%E8%87%AA%E5%8A%A8%E5%A1%AB%E5%86%99%E7%AD%94%E6%A1%88%EF%BC%8C%E7%BB%95%E8%BF%87%E5%BE%AE%E4%BF%A1%E9%99%90%E5%88%B6.meta.js
// ==/UserScript==

(function() {
    'use strict';
    // Config
    var EasyWJX_version = '2.0.8';
    var server_ip='easywjx_server.kzw.ink';
    var toolbox_ext = []
    var toolbox_ext_onclickfunc = []
    var addToWindow_func = [addButtonToToolbox, getWJID, findAnswerFromAnswerLs, btnclicktourl, btnclick, getToolbox,
                           getReallyIdAndDatakey, getAllAnswer,addGetOneAnswerAndWriteOneAnswerClassToWindow,
                           writeAllAnswer, parseManyinputAnswer, randomNum, sleep, insertAfter, parseDom, getQueryString,
                           copy_to_clipboard, clearCookie, deleteAllCookies, clearStorage]

    // 本地数据库：优先从 localStorage 加载
    var QUESTION_DB = loadLocalDb();

    // 初始化
    initElement();
    compatibleOld();

    // 初始化页面元素
    async function initElement() {
        console.log("EasyWJX is running. From xq.kzw.ink. Version "+EasyWJX_version);
        /*if(window.location.protocol == 'https:') {
            console.log('EasyWJX不能再https下正常运行，正在刷新到http。。。');
            window.location.href = window.location.href.replace('https', 'http');
        }*/
        // 引入layui 和jquery
        // 问：这里为什么不用自带的require引入？
        // 答：第一，require不能引入css。第二，直接引入layer组建会导致显示异常，因此需要单独引入juqery和layer（属于技术原因受限）。第三，下面的三个库均已被GreasyFork认可（可前往https://greasyfork.org/zh-CN/help/cdns 进行审查）。
        // 根据GreasyFork脚本规则“库是应被 @require 的脚本，除非因为技术原因不能这么做。如果一个库被内嵌入了脚本，那么你必须一并提供库的来源（比如一行评论指向原始地址、名称以及版本）。”
        // 我们在下方介绍了对应的库的原始地址、名称以及版本，并且说明了是因为技术原因而不能使用require引用。
        $('head').append($('<link rel="stylesheet" href="https://www.layuicdn.com/layui/css/layui.css">')) // 名称：layui，版本：2.7.6，原始地址：https://www.layuicdn.com/#Layui
        $('head').append($('<script src="https://cdn.bootcdn.net/ajax/libs/jquery/3.6.1/jquery.min.js"></script>')) // 名称：jquery，版本：3.6.1，原始地址：https://www.bootcdn.cn/jquery/
        if (typeof layer == 'undefined') {
            $('head').append('<script src="https://www.layuicdn.com/layer-v3.5.1/layer.js"></script>') // 名称：layer，版本：3.5.1，原始地址：https://www.layuicdn.com/#Layer
        }
        // 等待layer加载成功
        while (true) {
            if (typeof layer != 'undefined') {
                break
            }
            await sleep(0.5)
        }

        //显示加载标签
        var load_icon = layer.load(1);

        // 解除复制粘贴限制
        setTimeout(function () {
            $(".textCont,input,textarea").off();
        },2000)
        $(".textCont,input,textarea").off(); // 既不生效，再来一次又何妨
        document.oncontextmenu = function () {return true;};
        document.onselectstart = function () {return true;};
        $("body").css("user-select", "text");
        syncManyinput();

        // 检查是否需要清理cookie，是否需要绕过微信限制，放一个定时器时刻检查是否需要绕过企业版限制
        setTimeout(function () {
            // 优先级：cookie最高，展开page第二，wechat最低
            checkNeedBypassWechat();
            checkNeedExpandPage();
            checkNeedRemoveCookie();
        },1000)
        var checkNeedBypassEnterprise_interval = setInterval(function () {
            checkNeedBypassEnterprise(checkNeedBypassEnterprise_interval)
        }, 2000)
        // 留个标记不过分吧？
        $('#spanPower').html('<a href="https://xq.kzw.ink" title="线圈脚本">线圈脚本</a><span>提供破解</span>');

        // 初始化一个按钮，并当作功能栏
        var ctrl_btn = document.createElement("div");
        // 一些样式定义，一行三个，节省空间
        ctrl_btn.style.position = 'fixed'; ctrl_btn.style.height = '3rem'; ctrl_btn.style.width = '3rem';
        ctrl_btn.style.background = 'url(https://s1.ax1x.com/2023/01/31/pS0yjEQ.png)' //'url(https://vkceyugu.cdn.bspapp.com/VKCEYUGU-7c225101-813b-41f0-bcda-b99f9ef1c986/70ae58b2-52aa-47d3-b5d1-6a1d6d168d6b.png)';
        ctrl_btn.style.backgroundSize = '2rem 2rem'; ctrl_btn.style.backgroundColor = 'white'; ctrl_btn.style.borderRadius = '1.5rem';
        ctrl_btn.style.boxShadow = '0px 0px 20px 1px Gray'; ctrl_btn.style.backgroundRepeat = 'no-repeat'; ctrl_btn.id = 'ctrl_btn';
        ctrl_btn.style.right = '1rem'; ctrl_btn.style.bottom = '10rem'; ctrl_btn.style.backgroundPosition = 'center';
        ctrl_btn.onclick = function (e) {
            // 显示工具栏
            layer.open({
                type: 1,
                skin: 'layui-layer-rim', //加上边框
                area: ['80%', '80%'], //宽高
                content: getToolbox(),
                title: 'EasyWJX操作栏',
                success: function(layero, index){
                    initToolboxListener();
                    checkLocalAndCtrlElem();
                    if (toolbox_ext.length !=0) {
                        $('#ext_line').css('display', 'block')
                        initExtButtonOnclickFunc()
                    }
                    $('.easywjx_btn').on('click', function () {
                        layer.close(index)
                        console.log('有一个按钮被点击，toolbox已关闭')
                    })
                }
            });
        }
        $('body').append(ctrl_btn);

        // 执行进入成绩界面的默认操作
        checkLocalIsResultAndDoSth()

        // 绑定tips
        layer.tips('点击以使用EasyWJX', '#ctrl_btn');

        // 将函数加载到window
        initAllFuncToWindow()

        // 显示每道题旁的按钮
        initButtonNearQuestion()

        // 初始化结束，发送消息
        initMsgSender();

        // 结束加载标签
        layer.close(load_icon)
    }

    // 初始化一个toolbox监听器
    function initToolboxListener(){
        btnclicktourl('#getmore_btn', 'https://greasyfork.org/zh-CN/scripts?q=EasyWJX')
        btnclicktourl('#goto_greasyfork_btn', 'https://greasyfork.org/zh-CN/scripts/452006')
        btnclicktourl('#heydeveloper_btn','https://space.bilibili.com/1946156137')
        // 导入本地数据库
        btnclick('#import_db_btn', function () {
            openDbImportDialog();
        })
        btnclick('#chat_btn', function () {
            layer.open({
                type: 2,
                title: 'EasyWJX问题反馈与讨论',
                shadeClose: true,
                shade: false,
                maxmin: true, //开启最大化最小化按钮
                area: ['80%', '80%'],
                content: 'https://xq.kzw.ink/?wjx',
                success: function(layero, index){
                    console.log('打开了XChat')
                },
                cancel: function (){
                    console.log('关闭了XChat')
                }
            });
        })
        btnclick('#change_score_btn', function () {
            if ($(".score-form__list.clearfix .tht-content").text().indexOf('名')>=0) {
                layer.prompt({title: '修改后的名次（如果没有排名或者排名修改后出错请点击取消或留空）', formType: 0}, function(text, index){
                    layer.close(index);
                    $(".score-form__list.clearfix .tht-content").eq(1).text("第"+text+"名")
                });
            }
            layer.prompt({title: '修改后的正确题数（注意不要大于总题数）', formType: 0}, function(text, index){
                layer.close(index);
                $(".score-form__list.clearfix .tht-content span").text(text)
            });
            layer.prompt({title: '修改后的分数（注意不要大于总分）', formType: 0}, function(text, index){
                layer.close(index);
                $(".score-font-style").eq(0).text(text)
            });
        })
        btnclick('#addtrueans_btn', function () {
            layer.prompt({title: '输入需要改为正确的题目ID，如需多个可用空格隔开，修改全部清输入“all”', formType: 0}, function(text, index){
                layer.close(index);
                if (text!=null && text!="") {
                    if (text!='all') {
                        text = text.split(' ')
                        for (var i=0; i<text.length; i++) {
                            changeAnsToTrue(text[i])
                        }
                    } else if (text=='all') {
                        var ans_list = document.querySelectorAll('.data__items');
                        for (var i=0; i<ans_list.length; i++) {
                            changeAnsToTrue(i)
                        }
                    }
                }
            });

        })
        btnclick('#clear_elem_btn', function () {
            $('#spanPower').html('<a href="https://www.wjx.cn/" target="_blank" title="问卷星_不止问卷调查/在线考试">问卷星</a><span>提供技术支持</span>')
            ctrl_btn.style.display = 'none'
            var ques_titles = $('.data__tit_cjd');
            for (var i=0; i<ques_titles.length; i++) {
                ques_titles.eq(i).text(ques_titles.eq(i).text().split(' 题目ID：')[0])
            }
            layer.msg('已清理页面')
        })
        btnclick('#clear_ookie_btn', function () {
            deleteAllCookies();
            clearCookie();
            clearStorage();
        })
        btnclick('#auto_write_btn', function () {
            getAnswerFromServerAndWriteAllAnswer()
        })
        btnclick('#change_starttime_btn', function () {
            layer.prompt({title: '请按照下面所给格式修改开始时间', formType: 0, value: $('#starttime').val()}, function(text, index){
                var checkTimeReg = /^((\d{2}(([02468][048])|([13579][26]))[\-\/\s]?((((0?[13578])|(1[02]))[\-\/\s]?((0?[1-9])|([1-2][0-9])|(3[01])))|(((0?[469])|(11))[\-\/\s]?((0?[1-9])|([1-2][0-9])|(30)))|(0?2[\-\/\s]?((0?[1-9])|([1-2][0-9])))))|(\d{2}(([02468][1235679])|([13579][01345789]))[\-\/\s]?((((0?[13578])|(1[02]))[\-\/\s]?((0?[1-9])|([1-2][0-9])|(3[01])))|(((0?[469])|(11))[\-\/\s]?((0?[1-9])|([1-2][0-9])|(30)))|(0?2[\-\/\s]?((0?[1-9])|(1[0-9])|(2[0-8]))))))(\s((([0-1][0-9])|(2?[0-3]))\:([0-5]?[0-9])((\s)|(\:([0-5]?[0-9])))))?$/;
                checkTimeReg.test(text)
                if (!(checkTimeReg.test(text))){
                    layer.msg('输入的内容不符合日期格式', {icon: 2});
                } else {
                    changeStartTime(text)
                    layer.close(index);
                }
            });
        })
        btnclick('#bypass_wechat_btn', function () {
            bypassWechat();
        })
        btnclick('#expand_page_btn', function () {
            expandPage();
        })
        btnclick('#bypass_enterprise_btn', function () {
            bypassEnterprise();
        })
    }

    // 初始化每道题旁边的按钮
    function initButtonNearQuestion(){
        var div_list = $(".field-label");
        // 放置搜索、复制按钮
        for (var i=0; i<div_list.length; i++) {
            var search_btn = $(`<button type="button" class="layui-btn layui-btn-xs" id="search_btn_${i}" style="margin-left:1rem;">搜索</button>`)
            var copy_btn = $(`<button type="button" class="layui-btn layui-btn-xs" id="copy_btn_${i}" style="margin-left:1rem;">复制</button>`)
            search_btn.on('click', function (e) {
                var btn_num = parseInt(e.target.id.split('_')[2])
                var search_content = div_list.eq(btn_num).text().replace('搜索', '').replace('已复制','').replace('复制','').replace('*', '').replace('收起', '');
                var btn_txt = e.target.innerText
                if (btn_txt=="搜索") {
                    var search_div = $(`
                        <div style='margin-top:1rem;' id='search_div_${btn_num}'>
                            <div class='layui-row' style='display:flex; align-items:center; gap:0.5rem;'>
                                <div style='flex:1;'>
                                    <input type="text" value='${search_content}' placeholder="请输入搜索内容" class="layui-input" id='url_input_${btn_num}'>
                                </div>
                                <button type="button" class="layui-btn layui-btn-normal layui-btn-sm" id='gotourl_btn_${btn_num}'>查询</button>
                                <button type="button" class="layui-btn layui-btn-warm layui-btn-sm" id='import_local_db_${btn_num}'>导入DB</button>
                            </div>
                            <div id='search_result_${btn_num}' style='margin-top:1rem; padding:0.8rem; background:#f8f8f8; border-radius:4px; min-height:2rem; color:#333; line-height:1.6;'></div>
                        </div>
                    `);
                    div_list.eq(btn_num).append(search_div);

                    // 绑定搜索
                    $(`#gotourl_btn_${btn_num}`).on('click', function () {
                        var query = $(`#url_input_${btn_num}`).val();
                        var ans = getCorrectAnswer(query, QUESTION_DB);
                        $(`#search_result_${btn_num}`).text(ans ? `正确答案：${ans}` : "未找到答案");
                    });
                    // 打开面板后自动以题目文本进行一次本地搜索
                    (function autoInitialSearch(){
                        try {
                            var ansInit = getCorrectAnswer(search_content, QUESTION_DB);
                            $(`#search_result_${btn_num}`).text(ansInit ? `正确答案：${ansInit}` : "未找到答案");
                        } catch (e) {
                            console.warn('自动本地搜索失败：', e);
                        }
                    })();
                    // 绑定局部导入 DB
                    $(`#import_local_db_${btn_num}`).on('click', function(){ openDbImportDialog(); });

                    e.target.innerText="收起";
                } else {
                    e.target.innerText="搜索";
                    $(`#search_div_${btn_num}`).remove()
                }
            })
            copy_btn.on('click', function (e) {
                var btn_num = parseInt(e.target.id.split('_')[2])
                var copy_content = div_list.eq(btn_num).text().replace('搜索', '').replace('已复制','').replace('复制','').replace('*', '').replace('收起', '');
                copy_to_clipboard(copy_content)
                e.target.innerText ="已复制";
                setTimeout(function(){
                    e.target.innerText="复制";
                },2000)
            })
            div_list.eq(i).append(search_btn)
            div_list.eq(i).append(copy_btn)
        }
    }

    // 快速绑定按钮点击并打开链接
    function btnclicktourl(query, url) {
        btnclick(query, function () {
            window.open(url).location;
        })
    }

    // 初始化成绩页面的题目id
    function initResultQuesID() {
        var ques_titles = $('.data__tit_cjd');
        for (var i=0; i<ques_titles.length; i++) {
            ques_titles.eq(i).text(ques_titles.eq(i).text()+' 题目ID：'+i)
        }
    }

    // 在点击toolbox的时候判断当前位置并隐藏对应元素
    function checkLocalAndCtrlElem(){
        // 判断所属位置，决定显示哪些按钮
        if ($(".score-font-style").length>0) {
            $('#answer_done, #answer_done_line').css('display','block')
        } else {
            $('#answering, #answering_line').css('display','block')
        }
    }

    // 进入成绩页面要进行的默认操作
    function checkLocalIsResultAndDoSth() {
        if ($(".score-font-style").length>0) {
            initResultQuesID()
            var load_icon = layer.load(1);
            setTimeout(function () {
                getAllAnswerAndUpdate()
                layer.close(load_icon)
            }, 1000)
        }
    }

    // 快速绑定按钮点击
    function btnclick(query,func) {
        $(query).on('click', func)
    }

    // 初始化消息发送器，给其他脚本反复发送消息表示已加载完成
    function initMsgSender() {
        setInterval(function () {
            var msg = {msg:'EasyWJX_ready', version: EasyWJX_version, code:0}
            window.postMessage(msg, '*');
        }, 1000)
    }

    // 定义一个对外用于增加toolbox按钮的函数，内部不使用
    function addButtonToToolbox(name, id, event, func) {
        toolbox_ext.push(`<button type="button" class="layui-btn layui-btn-warm easywjx_btn" id="${id}">${name}</button>`)
        toolbox_ext_onclickfunc.push({'func':func, 'id':id, 'event':event})
    }

    // 初始化扩展按钮的点击事件
    function initExtButtonOnclickFunc() {
        for (var i=0; i<toolbox_ext_onclickfunc.length; i++) {
            $(`#${toolbox_ext_onclickfunc[i].id}`).on(toolbox_ext_onclickfunc[i].event, toolbox_ext_onclickfunc[i].func)
        }
    }

    // 兼容旧版脚本和其他脚本（指去除layui自带样式）
    function compatibleOld(){
        $('button').css('font-size','10px')
    }

    // 检查是否需要清理Cookies
    function checkNeedRemoveCookie() {
        if ($("#divTip").text().indexOf("最大填写次数")>=0) {
            layer.confirm('发现你可能被问卷星作答次数限制。点击“确定”以尝试绕过该限制。如果没有效果，请尝试更换浏览器、重启路由器（或开关飞行模式）', {
                btn: ['立即清理','取消'], //按钮
                title: 'EasyWJX提示',
            }, function(index){
                deleteAllCookies();
                clearCookie();
                clearStorage();
                checkNeedExpandPage();
                layer.close(index)
            }, function(){
                checkNeedExpandPage();
                console.log('取消清理cookie');
            });
        }
    }

    // 绕过微信限制
    function bypassWechat(){
        $("#zhezhao2").remove();
        $("#divContent").removeClass('disabled').removeClass('isblur');
        $("#ctlNext").text('破解后可能无法提交')
        setTimeout(function () {
            layer.msg('绕过限制后不能提交');
        },500)
    }

    // 检查是否需要绕过微信限制
    function checkNeedBypassWechat(){
        if ($(".wxtxt").length >0) {
            layer.confirm('监测到微信限制。是否需要移除限制并查看题目（可以查看题目但无法提交）', {
                btn: ['立即绕过','取消'], //按钮
                title: 'EasyWJX提示',
            }, function(index){
                bypassWechat();
                layer.close(index)
            }, function(){
                console.log('取消绕过微信限制');
            });
        }
    }

    // 绕过企业版跳出限制
    function bypassEnterprise(){
        $('#ValError').css('display','none')
        $('.fieldset').css('display','block')
    }

    // 检测是否需要绕过企业版跳出限制
    function checkNeedBypassEnterprise(interval){
        if ($(".fieldset").css('display') =='none') {
            layer.confirm('监测到疑似问卷星企业版作答限制。是否需要移除限制并继续作答？', {
                btn: ['立即绕过','取消'], //按钮
                title: 'EasyWJX提示',
            }, function(index){
                bypassEnterprise();
                layer.close(index)
            }, function(){
                console.log('取消绕过企业版限制');
                clearInterval(interval)
            });
        }
    }

    // 展开分页
    function expandPage() {
        $('.fieldset').css('display','block')
        $('#divSubmit').css('display','block')
        $('#divMultiPage').css('display','none')
    }

    // 检测是否需要展开分页
    function checkNeedExpandPage() {
        if ($('.fieldset').length>1) {
            layer.confirm('检测到该问卷是分页问卷，请问是否需要自动展开问卷？', {
                btn: ['立即展开','取消'], //按钮
                title: 'EasyWJX提示',
            }, function(index){
                expandPage();
                checkNeedBypassWechat();
                layer.close(index)
            }, function(){
                checkNeedBypassWechat();
                console.log('取消展开问卷');
            });
        }
    }

    // 将所有在列表中的函数初始化到window全局变量
    function initAllFuncToWindow() {
        if (window.easywjx == undefined) {
            window.easywjx = {}
        }
        // window.easywjx.getToolbox = getToolbox
        for (var i=0; i<addToWindow_func.length; i++) {
            window.easywjx[addToWindow_func[i].name] = addToWindow_func[i]
        }
    }

    // 获取工具栏需要的元素
    function getToolbox() {
        var toolbox_html = `<div class="layui-btn-container" style="margin: 1rem;" id="easywjx_toolbox">
            <div id='answering' style='display:none;'>
                <button type="button" class="layui-btn layui-btn-normal easywjx_btn" id="auto_write_btn">自动填写</button>
                <button type="button" class="layui-btn layui-btn-normal easywjx_btn" id="clear_ookie_btn">清理数据</button>
                <button type="button" class="layui-btn layui-btn-normal easywjx_btn" id="change_starttime_btn">修改开始答题时间</button>
                <button type="button" class="layui-btn layui-btn-normal easywjx_btn" id="bypass_wechat_btn">手动绕过微信限制</button>
                <button type="button" class="layui-btn layui-btn-normal easywjx_btn" id="expand_page_btn">手动展开分页</button>
                <button type="button" class="layui-btn layui-btn-normal easywjx_btn" id="bypass_enterprise_btn">手动绕过企业作答限制</button>
            </div>
            <hr class="layui-border-black" id="answering_line" style="display:none;">
            <div id='answer_done' style='display:none;'>
                <button type="button" class="layui-btn layui-btn-normal easywjx_btn" id="addtrueans_btn">添加答对题目</button>
                <button type="button" class="layui-btn layui-btn-normal easywjx_btn" id="clear_elem_btn">清理页面元素</button>
                <button type="button" class="layui-btn layui-btn-normal easywjx_btn" id="change_score_btn">修改成绩</button>
            </div>
            <hr class="layui-border-black" id="answer_done_line" style="display:none;">
            <div id='ext'>`+toolbox_ext.join(' ')+`</div>
            <hr class="layui-border-black" id="ext_line" style="display:none;">
            <div id='other'>
                <button type="button" class="layui-btn easywjx_btn" id="chat_btn">在线反馈问题</button>
                <button type="button" class="layui-btn easywjx_btn" id="heydeveloper_btn">联系开发者（Bilibili）</button>
                <button type="button" class="layui-btn easywjx_btn" id="goto_greasyfork_btn">前往脚本发布页面</button>
                <button type="button" class="layui-btn easywjx_btn" id="getmore_btn">获取更多脚本</button>
                <button type="button" class="layui-btn layui-btn-warm easywjx_btn" id="import_db_btn">导入本地数据库</button>
            </div>
        </div>`
        return toolbox_html
    }

    // 同步Manyinput的内容到真正的input标签
    function syncManyinput() {
        setInterval(function () {
            var all_textCont = document.querySelectorAll('.textCont')
            for (var i=0; i<all_textCont.length; i++) {
                var input = all_textCont[i].parentNode.previousSibling;
                input.value = all_textCont[i].innerText
            }
        }, 1500)
    }

    // 将答案切换为正确
    function changeAnsToTrue(str_id) {
        var id = parseInt(str_id);
        var ans_list_html = document.querySelector('.query__data-result.new__data-result');
        var ans_title_list = ans_list_html.querySelectorAll('.data__tit_cjd')
        /*
        for (var i=0; i<ans_title_list.length; i++) {
            var title = ans_title_list[i].innerText
            //if (i!=parseInt(title.split('题目ID：')[1])) {console.log('我发现了一个i和id不符的')}
            if (parseInt(title.split('题目ID：')[1]) == id) {
                var num = i
                break;
            }
        }
        */
        for (var i=0; i<ans_title_list.length; i++) {
            try{
                ans_title_list[i].parentNode.querySelector('.judge_ques_right font').innerText='';
            }catch{}
        }
        try{
            if (ans_title_list[id].parentNode.querySelector('.judge_ques_right span').innerText=='回答错误') {
                ans_title_list[id].parentNode.querySelector('.judge_ques_right').style.color='#01AD56';
                ans_title_list[id].parentNode.querySelector('.judge_ques_right img').src = '//image.wjx.cn/images/newimg/score-form/ans-right@2x.png';
                ans_title_list[id].parentNode.querySelector('.judge_ques_right font').innerText='';
                ans_title_list[id].parentNode.querySelector('.answer-ansys').remove()
                ans_title_list[id].parentNode.querySelector('.judge_ques_right span').innerText = '回答正确'
            }
        }catch{}
    }

    // ---------------------------------用于自动填写的代码【开始】----------------------------------
    // 用于给服务器发请求
    function sendUploadRequest(wj_id, content) {
        $.post('https://'+server_ip+'/upload', {wj_id: wj_id, content: JSON.stringify(content)}, function (result) {
            console.log('服务器返回结果：',result)
        })
    }
    // 获取题目的真实id
    function getReallyIdAndDatakey(str_id, kind='default') {
        var ans_list_html = document.querySelector('.query__data-result.new__data-result');
        var ans_data_key_ls = ans_list_html.querySelectorAll('.data__items');
        var id=-1
        var ans_data_key = 'none'
        for (var i=0; i<ans_data_key_ls.length; i++) {
            try {
                var ques_id = ans_data_key_ls[i].querySelector('.data__tit_cjd').innerText.split('题目ID：')[1]
            } catch {
                var ques_id = '-1'
            }

            if (ans_data_key_ls[i].querySelector('.data__tit_cjd') && ques_id==str_id) {
                if (kind=='manyinput') {
                    ans_data_key = ans_data_key_ls[i]
                } else {
                    ans_data_key = ans_data_key_ls[i].querySelector('.data__key')
                }
                id = parseInt(ques_id)
                break
            }
        }
        return [ans_list_html, id, ans_data_key]
    }
    // 用于获取单个题目的类
    class getOneAnswer {
        constructor() {}
        // 所有返回值格式：[结果, 类型]
        radio(str_id) {
            // 来转一段之前代码里的经典：  问：这段话的目的是什么？答：表达了作者对问卷星前端设计的不满，体现了作者不惧艰难、勇于破解的精神
            // 问卷星迷惑行为： 是已选radio标志， 是未选标志，真的它俩不一样，不要尝试修改不然可能出问题。或者说我改成unicode字符是不是会好一点
            // 好的我现在转换出来了，已选对应的unicode是\ue6df，未选对应的是\ue6e0，问卷星我真谢谢你
            // 然后接着就发现h5里只支持10进制的所以还得转一下，现在h5对应的就是：选中：59103 未选：59104
            // html里转译这种字符的方式就是：&#59103; &#59104;
            // 又是阴间操作：多选题：勾选答案：， 未勾选：

            var [ans_list_html, id, ans_data_key] = getReallyIdAndDatakey(str_id)

            if (ans_data_key!='none' && ans_data_key.querySelectorAll('.ulradiocheck').length !=0){
                var ans_span_txt = ans_data_key.querySelector('.judge_ques_right span').innerText;
                var ans_radio_list = ans_data_key.querySelectorAll('.ulradiocheck div')
                if (ans_radio_list[0].querySelector('i').innerText=='' || ans_radio_list[0].querySelector('i').innerText==''){
                    // 普通radio单选
                    var true_ans_num=-1
                    var i=0
                    if (ans_span_txt == '回答正确'){
                        true_ans_num = -1
                        for (i=0; i<ans_radio_list.length; i++) {
                            if (ans_radio_list[i].querySelector('i').innerText=='') {
                                true_ans_num = i
                                break
                            }
                        }
                    } else {
                        var true_ans_txt = ans_data_key.querySelector('.answer-ansys div').innerText
                        true_ans_num = -1
                        for (i=0; i<ans_radio_list.length; i++) {
                            if (ans_radio_list[i].querySelector('span').innerText==true_ans_txt) {
                                true_ans_num = i
                                break
                            }
                        }
                    }
                    return [ans_radio_list[true_ans_num].querySelector('span').innerText, 'radio']
                } else if (ans_radio_list[0].querySelector('i').innerText=='' || ans_radio_list[0].querySelector('i').innerText==''){
                    // radio多选
                    var true_ans_ls_txt = '';
                    if (ans_span_txt == '回答正确'){
                        for (var i=0; i<ans_radio_list.length; i++) {
                            if (ans_radio_list[i].querySelector('i').innerText=='') {
                                true_ans_ls_txt = true_ans_ls_txt+ans_radio_list[i].querySelector('span').innerText+'|';
                            }
                        }
                        true_ans_ls_txt = true_ans_ls_txt.slice(0,true_ans_ls_txt.length-1)
                    } else {
                        true_ans_ls_txt = ans_data_key.querySelector('.answer-ansys div').innerText.replace('┋', '|');
                    }
                    return [true_ans_ls_txt, 'checkbox']
                }

            } else {
                return ['none', "NOTRADIO"]
            }
        }
        input (str_id) {
            var [ans_list_html, id, ans_data_key] = getReallyIdAndDatakey(str_id)

            if (ans_data_key!='none' && ans_data_key.querySelectorAll('div').length!=0 && ans_data_key.querySelector('div').innerText!='' && ans_data_key.querySelectorAll('.ulradiocheck').length==0){
                if (ans_data_key.querySelector('.judge_ques_right span')) {
                    var ans_span_txt = ans_data_key.querySelector('.judge_ques_right span').innerText;
                } else {return ['none', "NOTINPUT"];}
                var ans_text = ans_data_key.querySelector('div').firstChild.nodeValue
                var true_ans = ''
                if (ans_span_txt == '回答正确'){
                    true_ans = ans_text
                } else {
                    true_ans = ans_data_key.querySelector('.answer-ansys div').innerText
                }
                return [true_ans, 'input']
            } else {
                return ['none', "NOTINPUT"]
            }
        }
        manyinput (str_id) {
            var [ans_list_html, id, ans_data_key] = getReallyIdAndDatakey(str_id, 'manyinput')
            if (ans_data_key=='none') {
                return ['none', 'NOTMANYINPUT']
            }
            var content = ans_data_key.querySelector('.data__tit_cjd').innerText
            if (content.indexOf('【')<0 && content.indexOf('】')<0){
                return ['none', 'NOTMANYINPUT']
            }
            return [content, 'manyinput']
        }
    }
    // 获取全部答案
    function getAllAnswer(getAnswer_class) {
        var ans_list_html = document.querySelector('.query__data-result.new__data-result');
        var ans_title_list = ans_list_html.querySelectorAll('.data__tit_cjd')
        var send_ls = []
        var getAnswer = getAnswer_class
        for (var i=0; i<ans_title_list.length; i++) {
            var title = ans_title_list[i].innerText;
            //var str_id= title.split('题目ID：')[1]; // 这里发现tit_cjd里存放的序号就已经是题目ID了，改变策略。parseInt是支持数字的，所以不用改变太多内容。
            // 下面这段代码请注意优先级，radio最高，manyinput其次，input最低
            var ans,kind;
            try{
                [ans,kind] = getAnswer.radio(i)
            }catch {
                [ans,kind] = ['none', "NOTRADIO"]
            }
            if (kind!='NOTRADIO') {
                send_ls.push({ques_id: i, answer: ans, kind: kind})
            } else if (kind=='NOTRADIO') {
                //try {
                    [ans,kind] = getAnswer.manyinput(i)
                //} catch {
                //    [ans,kind] = ['none', 'NOTMANYINPUT']
                //}
                if (kind!='NOTMANYINPUT') {
                    send_ls.push({ques_id: i, answer: ans, kind: kind})
                } else if (kind=='NOTMANYINPUT') {
                    try {
                        [ans,kind] = getAnswer.input(i)
                    } catch {
                        [ans,kind] = ['none', "NOTINPUT"]
                    }
                    if (kind!='NOTINPUT') {
                        send_ls.push({ques_id: i, answer: ans, kind: kind})
                    }
                }
            }
        }
        return send_ls
    }
    // 上传答案到服务器
    function getAllAnswerAndUpdate() {
        // 上传答案
        var wj_id = getWJID()
        var getAnswer_class = new getOneAnswer()
        var send_ls = getAllAnswer(getAnswer_class)
        console.log(send_ls)
        sendUploadRequest(wj_id, send_ls)
    }
    // 从答案列表查找该题答案
    function findAnswerFromAnswerLs(find_id,answer_ls) {
        for (var i=0; i<answer_ls.length; i++) {
            if (parseInt(answer_ls[i].ques_id) == parseInt(find_id)) {
                return answer_ls[i]
            }
        }
        return "NOANSWER"
    }

    class writeOneAnswer {
        constructor() {
            this.ans_ls_html = document.querySelectorAll('.field.ui-field-contain');
        }
        radio (answer, id) {
            var radios = this.ans_ls_html[id].querySelectorAll('.ui-radio')
            if (radios.length!=0){
                if (answer.ques_id==id && answer.kind=='radio') {
                    for (var i=0; i<radios.length; i++) {
                        if (answer.answer.replace(/\s*/g,"").indexOf(radios[i].innerText.replace(/\s*/g,""))>=0) {
                            radios[i].click()
                        }
                    }
                } else {
                    console.log('radio:答案列表中的id和当前获取id不符合，跳过填写')
                }
            }
        }
        input(answer,id) {
            var input = this.ans_ls_html[id].querySelector('.ui-input-text input')
            if (input) {
                if (answer.ques_id==id) {
                    input.value = answer.answer.split('|')[randomNum(0,answer.answer.split('|').length-1)];
                } else {
                    console.log('input:答案列表中的id和当前获取id不符合，跳过填写')
                }
            }
        }
        checkbox(answer,id) {
            var checkbox = this.ans_ls_html[id].querySelectorAll('.ui-checkbox')
            if (checkbox.length!=0){
                if (answer.ques_id==id && answer.kind=='checkbox') {
                    var ans_txt_ls = answer.answer.split('|')
                    for (var i=0; i<ans_txt_ls.length; i++) {
                        for (var j=0; j<checkbox.length; j++) {
                            if(ans_txt_ls[i].replace(/\s*/g,"").indexOf(checkbox[j].querySelector('.label').innerText.replace(/\s*/g,""))>=0) {
                                checkbox[j].click();
                            }
                        }
                    }
                } else {
                    console.log('checkbox:答案列表中的id和当前获取id不符合，跳过填写')
                }
            }
        }
        manyinput(answer,id,elem) {
            var [ques_ls, original_input_group] = parseManyinputAnswer(this.ans_ls_html[id], elem)

            if (answer.ques_id==id && answer.kind=='manyinput') {
                // 这里开始处理服务器上获取的整体题目，大致思路就是把现有内容replace掉然后就可以拿到两个带括号的答案内容。正确答案后面的括号没有内容，错误答案括号后有正确答案
                var quesandans = answer.answer.split(' 题目ID：')[0];
                for (var ij=0; ij<ques_ls.length-1; ij++){
                    quesandans = quesandans.replace(ques_ls[ij], '')
                }
                var quesandans_ls = quesandans.split('】'); // 这个变量里就是用户答案和标准答案了，用【分割
                for (var ij=0; ij<quesandans_ls.length; ij++){
                    try {
                        if (quesandans_ls[ij]!=''){
                            var usr_ans = quesandans_ls[ij].split('【')[0]
                            var ans_res = quesandans_ls[ij].split('【')[1]
                            var true_ans = ''
                            if (ans_res == ''){
                                true_ans = usr_ans
                            } else if (ans_res.indexOf('正确答案')>=0){
                                true_ans = ans_res.replace('正确答案: ', '')
                            }
                            // 填入input内，这里可能会产生问题所以加上try
                            try{
                                original_input_group.querySelectorAll('.ui-input-text')[ij].value = true_ans
                                if (elem == '.textCont') {
                                    original_input_group.querySelectorAll('.textCont')[ij].innerText = true_ans //当作多项填空填写
                                } else {
                                    original_input_group.querySelectorAll('.bracket')[ij].querySelector('span .selection span span').innerText = true_ans //当作完形填空填写
                                }
                            }catch{}
                        }
                    }catch{}
                }
            }
        }
    }

    // 填写全部答案
    function writeAllAnswer(answer_ls, writeAnswer_class) {
        var ans_ls_html = document.querySelectorAll('.field.ui-field-contain');
        var writeAnswer = writeAnswer_class
        console.log(answer_ls)
        window.easywjx.answer_ls = answer_ls //test
        for (var i=0; i<ans_ls_html.length; i++) {
            var answer = findAnswerFromAnswerLs(i, answer_ls)
            if (answer == 'NOANSWER') {
                console.log('no_find_answer')
                continue;
            }
            console.log(answer)
            try{writeAnswer.radio(answer, i)}catch{}
            try{writeAnswer.input(answer, i)}catch{}
            try{writeAnswer.checkbox(answer, i)}catch{}
            try{writeAnswer.manyinput(answer, i, '.textCont')}catch{}
            try{writeAnswer.manyinput(answer, i, '.bracket')}catch{}
            //writeAnswer.radio(answer_ls[i], i);writeAnswer.input(answer_ls[i], i);writeAnswer.checkbox(answer_ls[i], i);writeAnswer.manyinput(answer_ls[i], i, '.textCont');writeAnswer.manyinput(answer_ls[i], i, '.bracket');

        }
    }

    // 从服务器获取数据并填写全部答案
    function getAnswerFromServerAndWriteAllAnswer() {
        var wj_id = getWJID()
        $.post('https://'+server_ip, {wj_id: wj_id}, function (result) {
            if (result.length==0) {
                layer.msg('暂无答案')
                return 'NONE_ANSWER';
            }
            var writeAnswer_class = new writeOneAnswer()
            var answer_ls = JSON.parse(result[0].content)
            writeAllAnswer(answer_ls, writeAnswer_class)
        })
    }

    // 获取manyinput的答案内容
    function parseManyinputAnswer(ans_html, elem) {
        var original_input_group = ans_html.querySelector('.field-label .topictext') || ans_html.querySelector('.field-label div');
        if (!original_input_group || original_input_group.querySelectorAll(elem).length==0){
            return "CANTPARSE"
        }
        var copy_input_group_dom = parseDom(original_input_group.innerHTML)
        var input_group = document.querySelector('body').appendChild(copy_input_group_dom)
        //var input_group = document.querySelectorAll('div')[document.querySelectorAll('div').length-1]
        // 添加换行符方便分割
        var all_span = input_group.querySelectorAll(elem);
        for (var i=0; i<all_span.length; i++){
            var br = document.createElement("br");
            insertAfter(br, all_span[i])
        }

        // 删除多余元素
        var rm1_ls = input_group.querySelectorAll(elem)
        var rm2_ls = input_group.querySelectorAll(".ui-input-text")
        for (var i=0; i<rm1_ls.length; i++){
            rm1_ls[i].remove()
        }
        for (var i=0; i<rm2_ls.length; i++){
            rm2_ls[i].remove()
        }
        // 拿到拆分的题目
        var ques_ls = input_group.innerHTML.split('<br>')
        for (var i=0; i<ques_ls.length; i++) {
            ques_ls[i] = parseDom(ques_ls[i]).innerText
        }
        console.log(ques_ls)

        // 删除这个复制元素
        input_group.remove()

        return [ques_ls, original_input_group]
    }

    function addGetOneAnswerAndWriteOneAnswerClassToWindow() {
        var class_getOneAnswer = new getOneAnswer()
        var class_writeOneAnswer = new writeOneAnswer()
        window.easywjx.getOneAnswer = class_getOneAnswer
        window.easywjx.writeOneAnswer = class_writeOneAnswer
    }

    // 修改答题时间
    function changeStartTime(time) {
        $('#starttime').val(time)
    }
    // ---------------------------------用于自动填写的代码【结束】----------------------------------

    // ---------------------------------下面是一些通用函数------------------------------------
    // 通用函数，生成范围内随机数
    function randomNum(minNum,maxNum){
        switch(arguments.length){
            case 1:
                return parseInt(Math.random()*minNum+1,10);
                break;
            case 2:
                return parseInt(Math.random()*(maxNum-minNum+1)+minNum,10);
                break;
            default:
                return 0;
                break;
        }
    }
    // 通用函数，同步等待1秒
    function sleep(time) {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                resolve()
            }, time * 1000)
        })
    }

    // 通用函数，获取问卷ID
    function getWJID(){
        var localpath = window.location.pathname
        var wj_id = 'none'
        if (localpath.indexOf('/wjx/join')>=0) {
            wj_id = getQueryString('activityid')
        } else {
            wj_id = localpath.replace('vm', '').replace('.aspx', '').replaceAll('/', '')
        }
        return wj_id
    }
    // 通用函数，插入dom
    function insertAfter(newElement,targetElement){
        var parent = targetElement.parentNode;
        if(parent.lastChild == targetElement){
            parent.appendChild(newElement);
        }else{
            parent.insertBefore(newElement,targetElement.nextSibling);
        }
    }
    // 通用函数，转换dom
    function parseDom(arg) {
        var objE = document.createElement("div");
        objE.innerHTML = arg;
        return objE;
    };
    // 通用函数，获取get请求的一个参数
    function getQueryString(name) {
        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
        var r = window.location.search.substr(1).match(reg);
        if (r != null) return unescape(r[2]); return null;
    }
    //通用函数，复制内容
    function copy_to_clipboard(txt_str){
        const input = document.createElement('input');
        document.body.appendChild(input);
        input.setAttribute('value', txt_str);
        input.select();
        if (document.execCommand('copy')) {
            document.execCommand('copy');
            console.log('复制成功');
            //Alert(500,'复制成功');
        }
        document.body.removeChild(input);
    }
    // 通用函数，清理cookie【方法1，最有效】
    function clearCookie(){
        // 这段代码来自其它脚本，为MIT协议，
        var keys = document.cookie.match(/[^ =;]+(?==)/g);
        if (keys) {
            for (var i = keys.length; i--;) {
                document.cookie = keys[i] + '=0;path=/;expires=' + new Date(0).toUTCString();
                document.cookie = keys[i] + '=0;path=/;domain=' + document.domain + ';expires=' + new Date(0).toUTCString();
                document.cookie = keys[i] + '=0;path=/;domain=ratingdog.cn;expires=' + new Date(0).toUTCString();
            }
        }
        console.log("cookie数据已清除");
        location.reload();
    }
    // 通用函数，清理cookie【方法2】
    function deleteAllCookies() {
        var cookies = document.cookie.split(";");
        console.log(cookies)
        for (var i = 0; i < cookies.length; i++) {
            var cookie = cookies[i];
            var eqPos = cookie.indexOf("=");
            var name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
            document.cookie = name +"=;";
            //document.cookie = null
        }
        var cookies2 = document.cookie.split(";");
    }
    // 通用函数，清理storage
    function clearStorage() {
        localStorage.clear()
        sessionStorage.clear()
    }

    // ---------- 本地数据库相关函数 ----------
    function loadLocalDb() {
        try {
            var raw = localStorage.getItem('EasyWJX_DB');
            if (raw) {
                var parsed = JSON.parse(raw);
                return parsed;
            }
        } catch (e) {
            console.warn('本地数据库加载失败：', e);
        }
        return [];
    }

    function saveLocalDb(db) {
        try {
            localStorage.setItem('EasyWJX_DB', JSON.stringify(db));
        } catch (e) {
            console.warn('本地数据库保存失败：', e);
        }
    }

    function openDbImportDialog() {
        var input = document.createElement('input');
        input.type = 'file';
        input.accept = '.json,application/json';
        input.onchange = function (ev) {
            var file = ev.target.files && ev.target.files[0];
            if (!file) return;
            var reader = new FileReader();
            reader.onload = function () {
                try {
                    var db = JSON.parse(reader.result);
                    QUESTION_DB = db;
                    saveLocalDb(db);
                    var count = Array.isArray(db) ? db.length : Object.keys(db || {}).length;
                    (typeof layer !== 'undefined') ? layer.msg('本地数据库已导入，共 '+count+' 条') : console.log('本地数据库已导入', count);
                } catch (err) {
                    (typeof layer !== 'undefined') ? layer.msg('JSON 解析失败', {icon:2}) : console.error('JSON 解析失败', err);
                }
            };
            reader.readAsText(file, 'utf-8');
        };
        document.body.appendChild(input);
        input.style.display = 'none';
        input.click();
        // 清理临时 input
        setTimeout(function(){ try{ document.body.removeChild(input); }catch{} }, 1000);
    }

    function normalizeText(s) {
        return String(s || '')
            .replace(/\s+/g, '')
            .replace(/[^\u4e00-\u9fa5A-Za-z0-9]/g, '')
            .toLowerCase();
    }

    function similarity(a, b) {
        if (!a || !b) return 0;
        var la = a.length, lb = b.length;
        var len = Math.min(la, lb), match = 0;
        for (var i=0; i<len; i++) {
            if (a[i] === b[i]) match++;
        }
        return match / Math.max(la, lb);
    }

    function getCorrectAnswer(query, db) {
        try {
            var qn = normalizeText(query);
            var items = Array.isArray(db) ? db : Object.entries(db || {}).map(function (kv) { return {q: kv[0], a: kv[1]}; });
            var best = null, bestScore = 0;
            for (var i=0; i<items.length; i++) {
                var item = items[i];
                var sn = normalizeText(item.q || item.question || item.题干);
                var score = similarity(qn, sn);
                if (sn.indexOf(qn) >= 0 || qn.indexOf(sn) >= 0) {
                    score += 0.5; // 轻权重提升包含关系
                }
                if (score > bestScore) {
                    bestScore = score;
                    best = item;
                }
            }
            return bestScore > 0 ? (best.a || best.answer || best.答案 || null) : null;
        } catch (e) {
            console.warn('本地搜索异常：', e);
            return null;
        }
    }

    function autoResizeDiv(id) {
        //需要调整尺寸的div
        let c = document.getElementById(id)
        // body监听移动事件
        document.querySelector('body').addEventListener('mousemove', move)
        // 鼠标按下事件
        c.addEventListener('mousedown', down)
        // 鼠标松开事件
        document.querySelector('body').addEventListener('mouseup', up)

        // 是否开启尺寸修改
        let resizeable = false
        // 鼠标按下时的坐标，并在修改尺寸时保存上一个鼠标的位置
        let clientX, clientY
        // div可修改的最小宽高
        let minW = 8, minH = 8
        // 鼠标按下时的位置，使用n、s、w、e表示
        let direc = ''

        // 鼠标松开时结束尺寸修改
        function up() {
            resizeable = false
        }

        // 鼠标按下时开启尺寸修改
        function down(e) {
            let d = getDirection(e)
            // 当位置为四个边和四个角时才开启尺寸修改
            if (d !== '') {
                resizeable = true
                direc = d
                clientX = e.clientX
                clientY = e.clientY
            }
        }
        // 下面是一些和搜索框拖动有关的函数
        // 鼠标松开时结束尺寸修改
        function up() {
            resizeable = false
        }

        // 鼠标按下时开启尺寸修改
        function down(e) {
            let d = getDirection(e)
            // 当位置为四个边和四个角时才开启尺寸修改
            if (d !== '') {
                resizeable = true
                direc = d
                clientX = e.clientX
                clientY = e.clientY
            }
        }

        // 鼠标移动事件
        function move(e) {
            let d = getDirection(e)
            let cursor
            if (d === '') cursor = 'default';
            else cursor = d + '-resize';
            // 修改鼠标显示效果
            c.style.cursor = cursor;
            // 当开启尺寸修改时，鼠标移动会修改div尺寸
            if (resizeable) {
                /*
                // 鼠标按下的位置在右边，修改宽度
                if (direc.indexOf('e') !== -1) {
                    c.style.width = Math.max(minW, c.offsetWidth + (e.clientX - clientX)) + 'px'
                    clientX = e.clientX
                }
                // 鼠标按下的位置在上部，修改高度
                if (direc.indexOf('n') !== -1) {
                    c.style.height = Math.max(minH, c.offsetHeight + (clientY - e.clientY)) + 'px'
                    clientY = e.clientY
                }
                */
                // 鼠标按下的位置在底部，修改高度
                if (direc.indexOf('s') !== -1) {
                    c.style.height = Math.max(minH, c.offsetHeight + (e.clientY - clientY)) + 'px'
                    clientY = e.clientY
                }
                /*
                // 鼠标按下的位置在左边，修改宽度
                if (direc.indexOf('w') !== -1) {
                    c.style.width = Math.max(minW, c.offsetWidth + (clientX - e.clientX)) + 'px'
                    clientX = e.clientX
                }
                */
            }
        }

        // 获取鼠标所在div的位置
        function getDirection(ev) {
            let xP, yP, offset, dir;
            dir = '';

            xP = ev.offsetX;
            yP = ev.offsetY;
            offset = 10;

            if (yP < offset) dir += 'n';
            else if (yP > c.offsetHeight - offset) dir += 's';
            if (xP < offset) dir += 'w';
            else if (xP > c.offsetWidth - offset) dir += 'e';

            return dir;
        }
    }

})();