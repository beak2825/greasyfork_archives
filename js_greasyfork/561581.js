// ==UserScript==
// @name         PBC Score Extra
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  评按钮可拖动，弹窗无重叠，美观专业，加入月份选择
// @author       andy
// @license      none
// @match        http://know.xm.akubela.local/*
// @match        http://work.xm.akubela.local/*
// @match        http://192.168.10.17/zentao/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/561581/PBC%20Score%20Extra.user.js
// @updateURL https://update.greasyfork.org/scripts/561581/PBC%20Score%20Extra.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // reasonMap ...
    const reasonMap = {
        "低级问题" : ["迷之操作"],
        "任务分": ["延期严重，且不够努力完成", "延期一般，且不够努力完成", "任务中提出了更好的策略"],
        "质量分": ["客诉问题","客诉问题-未及时更新举措","客诉问题-被@后超过1周未更新进度","产品经理体验标记基本不通过","激活BUG"],
        "文档规范性": ["月总结未及时编写或发邮件", "未按时完成PBC编写", "编写文档不符合规范，比如没有写到confluence中", "文档一拖再拖影响了整体的推进速度","机型管控未及时完成标记,存在重复工作的风险","禅道BUG备注不规范","禅道BUG重复操作不规范","禅道BUG未及时转给对应同学","禅道BUG没有及时备注,投入的时间无产出","禅道BUG没有备注就转给跨小组同学","压测BUG未及时抛转","压测BUG操作不规范", "疑难BUG未发起内部讨论就给产品评审","没有从BUG反馈到评审要素表中形成预防", "周计划未更新", "周计划有更新，但处理中 的任务工期<4天，或大于6天", "周计划有更新，但任务的先后顺序明显和实际不符","月计划未按要求日期完成更新", "进度未更新，任务备注未更新，任务情况不明", "校验中的任务明显过多"],
        "质量规范性": ["代码提交不符合规范","自测文档未评审","自测文档存在fail项","自测文档中测试建议未实施", "自测文档基础路径未包含", "产品经理体验差", "UI工程师体验差", "严重问题遇到困难没有及时发起讨论","版本质量差，且Figma评论明显偏少"],
        "责任心": ["突发事件没有及时响应", "突发事件及时响应，渡过难关", "对目标完成，缺乏努力", "不情愿接受任务", "提出的问题点未看到改进", "承诺的事情没有按时完成，过程也无反馈", "逃避职责", "通过特别努力发现机会或降低潜在风险", "主动作为某个事务的责任人推进落地"],
        "主动性": ["关键事项没有主动发起讨论，推动进程", "任务提前完成后没有继续后续工作", "需要人督促完成事务", "影响他人，更高价值", "主动拉齐各端节奏，促进目标完成"],
        "团队协作": ["信息传递遗漏","逻辑表达不清晰，缺乏同理心", "信息传递经常被误解", "信息传递偶尔被误解", "过于执着", "很少帮助别人", "高超的谈判技巧"],
        "专业主": ["Fragment/Activity泄漏时有发生", "发生数组越界/空指针等基础Crash", "发生多线程竞争/异步问题", "不时发生明显的性能问题", "不熟悉规范，破坏框架", "缺乏软件设计能力"],
        "专业辅": ["缺乏软件工程认知", "缺乏软件编程基本思想", "缺乏周边工具/脚本的应用能力"],
        "项目管理": ["对新品开发流程不熟悉", "对新品质量把控体系认知不到位", "风险基本未前置处理", "项目风险小，在死亡时间到时遗留较多概率性问题", "无法独立开展新品开发，需要太多其他人协助", "项目排期合理性一般，属于被动状态"],
        "计划执行":["一级	明确目标：能够根据公司或上级的明确要求，结合本岗位的职责，确定自己工作的短期目标", "二级	目标分解：根据具体目标，将工作分解为若干的关键可操作性步骤，设立优先次序，形成任务时间进度表", "三级	资源配置：能够准确评估实现工作目标所需的人、财、物等资源，并做出资源配置的可行性方案", "四级	监控与反馈：建立监控和反馈机制，能够从整体上把握计划实施的进程", "五级	灵活应变：①在工作计划中预先考虑预留弹性或额外工作时间，以应对意外事件②主动评估工作中可能存在的风险，随时准备应对各种障碍和问题，并提前制定应变方案，以确保工作任务总是按时、保质地完成"],
        "学习领悟":["一级	学习积累：①对别人身上的闪光点或者好的做法，即使目前不使用，也记录和积累下来	②多向有经验的人学习好的想法和好的做法", "二级	直接运用：①将别人明确表述的经验和做法，应用到工作中	", "三级	举一反三：①对别人明确表述的经验和做法加以调整修改，运用于解决不同的问题	②总结出的方法可以教授给他人，具有可复用性", "四级	融会贯通：①将各方面知识的精髓融为一体，得到处理不同问题的通则或经验方法，并将之变成为自己的东西，用它来分析现实中的工作问题，提出有效的解决办法", "五级	提炼升华：①从经历的偶发体验或事件中，自己总结出解决问题的方法并加以运用	②能够总结出行业或专业领域中高水平的方法论"],
        "客户导向":["一级	及时回应： 耐心倾听客户的咨询、要求和抱怨，及时回应内外部客户的要求，解决常规性的客户问题", "二级	保持沟通：与内外部客户保持沟通，当内外部客户需要帮助的时候可以随时取得联系，关注内外部客户的满意度，提供对内外部客户有帮助的信息", "三级	个性化服务：①把内外部客户的明确需求看成是自己的工作任务，为此投入时间和精力去做工作	②当常规产品和服务不能满足内外部客户需要时，为客户提供个性化的产品和服务，尽可能快速准确的解决内外部客户问题	", "四级	挖掘潜在需求：①关注和了解内外部客户的潜在需求，致力于开发符合内外部客户需求的产品和服务", "五级	重视长远利益：①担任内外部客户的顾问角色，针对内外部客户的需求、问题提出自己独立的观点，并采取行动解决问题，积极参与帮助内外部客户进行决策②为内外部客户寻找长期利益，能够采取具体的措施为内外部客户提供增值服务，并借此成功取信于客户"],
        "关注质量":["一级	行事规范: 对自己的工作要求严格，都会按照既定的操作规范或上级指示进行，较少出现错误", "二级	主动检查: 注重对自己的工作进行检查，以核实提供的资料和信息的真实性", "三级	多方验证: 在提供资料或信息前，能够主动通过多种途径，对其真实性进行交叉验证	", "四级	监控他人: 注意督促下属或配合自己工作的其他人员对工作的各个环节进行多角度、全方位的考虑，确保工作准确无误", "五级	运用系统: 学习并督促自己及他人掌握各种可以提升和改进工作细节的方法，能够设计或使用程序化检查错误的手段	"],
        "困难承受":["一级	树立信念: ①在工作中树立了不松懈的工作信念②在在受到挫折和批评时，能够抑制自己的消极想法和冲动", "二级	行为坚定：①为了达到目标，能够持续不懈地努力工作，甚至面临繁琐的、枯燥的工作任务时也能坚持", "三级	克服困难：①面对挫折时能够主动意识并正确对待自己的不足，从错误中吸取教训，不怕从头再来：②能够承受较大的工作压力，采取积极行动去克服困难", "四级	自我激励: ①追求目标的过程中不断地激励自己，即使很艰难也照样不停歇②具有强大的耐久性和忍耐力，能够承受压力和逆境，并从中获得力量和成长", "五级	意志顽强、信念坚定：①面对突发情况或强烈反对也毫不退缩和动摇，并团结和带领他人为实现目标一起奋斗②越挫越勇，在屡战屡败的情况下不放弃采取新的理念和方法去探索，以完成任务或达到目标"],
        "领导力":["一级	告知团队：①主动向团队成员传达某项决定的内容或工作任务的要求,清晰地表明工作的原则和权限范围,明确要完成的目标。②以正式的渠道公告授权内容，向团队成员解释其中的过程或原因，确保他们了解必要 的信息，帮助他们获得配合和减少冲突。","二级	维护群体：①确保团队的合理需要得到满足,并为团队成员的工作开展争取所需要的各种信息、资源。②保护自己领导的团队及其声誉，采取各类实质性的举措让团队成员感受到自己对团队 利益的重视。","三级	做好表率: ①通过以身作则,向团队成员示范自己所期望的行为,使他们接受自己为团队设定的使 命和目标,以及做出的安排和决定等,确保集体的任务能够完成。②在必要的时候与下属同甘共苦，赢得下属的信赖。","四级	激发士气：①针对不同的情况,灵活采取不同的激励手段,激发下属的热情。②善于描绘激动人心的使命和目标，使下属充满热情和希望。③采用各种方式来提高团队的士气,如迅速解雇绩效不佳者,对工作流程进行科学、合 理的调整等,以改进团队的工作效率,加强集体向心力。","五级	创造氛围: ①成为团队的精神领袖,从做事方式上深入影响下属,利用个人人格魅力或突出的工作 能力在下属和同事间树立威信。②鼓励团队成员之间互相帮助,创造坦率、温暖、合作的团队氛围。"]
    };


    const style = `
.tm-pbc-drag-evaluate-btn {
    position: fixed; z-index: 99999;
    top: 220px; right: 38px;
    width: 40px; height: 40px;
    border-radius: 50%; background: linear-gradient(145deg,#39affb 55%,#B1EDFF 100%);
    color: #156ed8; font-family: '微软雅黑',Arial,sans-serif;
    font-weight: bold; font-size: 21px;
    border: 1.7px solid #AEEBFF;
    box-shadow: 0 6px 18px #25a8ec35, 0 1.5px 6px #38cefc13;
    text-align: center; line-height: 40px;
    cursor: grab; user-select: none; transition: box-shadow .15s, background .18s, color .2s;
}
.tm-pbc-drag-evaluate-btn:hover {
    color: #2b74d7; background: linear-gradient(145deg,#53cfff 45%,#e2faff 100%);
    box-shadow: 0 3px 22px #14b0eff0;
}
.tm-pbc-eval-mask {
    z-index: 99990; position: fixed; inset: 0;
    background: rgba(33,65,91,.15);
}
.tm-pbc-eval-modal {
    z-index: 99991; position: fixed; left: 0; top: 0; width:100vw; height:100vh;
    display: flex; align-items: center; justify-content: center; pointer-events: none;
}
.tm-pbc-outerbox {
    pointer-events: auto;
    background: linear-gradient(108deg, #deeeff 0%, #eaf8fc 100%);
    border-radius: 17px;
    min-width: 368px; max-width: 420px;
    box-shadow: 0 10px 48px #79dfff63, 0 2px 9px #82eaff35;
    padding: 0; position:relative; border: 1.5px solid #b2ebffb5;
    transition: box-shadow .3s, border .3s;
    animation: tm-pop-appear .28s;
    display: flex; flex-direction: column; align-items: stretch;
}
@keyframes tm-pop-appear {
  from { opacity:0; transform: scale(.92);}
  to   { opacity:1; transform: scale(1);}
}
#tm-pbc-container {
    background: #fff;
    border-radius: 14px;
    margin: 0;
    max-width: 428px;
    min-width: 0;
    width: 100%;
    box-shadow: 0 0 0 transparent;
    font-family: 'Segoe UI', '微软雅黑', Arial, sans-serif;
    font-size: 15px; letter-spacing: .02em;
    color: #18304b;
    position: relative;
    padding: 34px 32px 22px 32px;
    box-sizing: border-box;
}
#tm-pbc-close-btn {
    position: absolute;
    top: 12px; right: 18px;
    width:30px; height:30px; line-height: 26px;
    border-radius: 50%; background: #e4f3ff;
    color:#1898df; font-size: 20px; font-weight: 400;
    text-align: center; border: none; cursor: pointer;
    transition:background .19s;
    box-shadow: 0 1px 7px #60ccfc0e;
    z-index: 4;
}
#tm-pbc-close-btn:hover {
    background: #f5fcff;
    color:#d0371c;
}
#tm-pbc-container label {
    display: flex; flex-direction: column;
    margin-bottom: 17px; font-weight: 500;
    color: #205687; font-size: 15px;
}
#tm-pbc-container input[type="text"],
#tm-pbc-container select,
#tm-pbc-container input[type="month"],
#tm-pbc-container textarea {
    margin-top: 5px; width: 100%;
    padding: 10px 11px 10px 11px;
    border: 1.3px solid #d2e2fd;
    border-radius: 7px; font-size: 15px;
    background: #f5f8fc;
    transition: border-color .2s, box-shadow .2s;
    box-sizing: border-box;
    resize: none; outline: none;
}
#tm-pbc-container input[type="text"]:focus,
#tm-pbc-container select:focus,
#tm-pbc-container input[type="month"]:focus,
#tm-pbc-container textarea:focus {
    border-color: #39affb; background: #eef7fe;
    box-shadow: 0 0 0 2px #86e7ff40;
}
#tm-pbc-container textarea {
    min-height: 138px; max-height: 300px;
    font-size: 15px; line-height: 1.5em;
}
#tm-pbc-container button[type="button"] {
    display: block; width: 98%;
    margin: 17px auto 5px auto;
    background: linear-gradient(90deg,#39affb,#77dcfa 85%);
    color: #114070; border: none; border-radius: 7px;
    font-size: 17px; font-weight: 600; letter-spacing: 0.08em;
    padding: 11px 0 10px 0; cursor: pointer;
    box-shadow: 0 2px 10px #1cb2e733; transition: background .22s, color .22s, box-shadow .20s;
}
#tm-pbc-container button[type="button"]:hover, #tm-pbc-container button[type="button"]:focus {
    background: linear-gradient(93deg,#38bbcc,#b3e7fa 95%);
    color: #197399; box-shadow: 0 5px 18px #41c9ff17;
}
#tm-pbc-container #tm-msg {
    margin-top: 11px; font-weight:600; min-height:27px;
    color:#e14037; text-align: center; font-size:15px; transition: color .2s;
}
`
    const styleTag = document.createElement('style');
    styleTag.innerText = style;
    document.head.appendChild(styleTag);

    // 圆形按钮
    const circleBtn = document.createElement('div');
    circleBtn.className = 'tm-pbc-drag-evaluate-btn';
    circleBtn.innerText = '评';
    document.body.appendChild(circleBtn);

    // 蒙版+弹窗
    const mask = document.createElement('div');
    mask.className = "tm-pbc-eval-mask";
    mask.style.display = "none";
    document.body.appendChild(mask);

    const modal = document.createElement('div');
    modal.className = "tm-pbc-eval-modal";
    modal.style.display = "none";
    modal.innerHTML = `<div class="tm-pbc-outerbox"></div>`;
    document.body.appendChild(modal);

    // 表单主体，NO margin-top!
    const container = document.createElement('div');
    container.id = 'tm-pbc-container';
    container.innerHTML = `
        <button id="tm-pbc-close-btn" title="关闭">&times;</button>
        <label>
            人员:
            <select id="tm-person">
                <option value="None">None</option>
                <option value="Andy">Andy</option>
                <option value="黄长发">黄长发</option>
                <option value="张佳达">张佳达</option>
                <option value="方晓圳">方晓圳</option>
                <option value="魏雁升">魏雁升</option>
                <option value="黄耀鹏">黄耀鹏</option>
                <option value="施培基">施培基</option>
                <option value="杜慧超">杜慧超</option>
                <option value="黄腾禹">黄腾禹</option>
                <option value="陈阳坤">陈阳坤</option>
                <option value="张明发">张明发</option>
                <option value="蔡灿煌">蔡灿煌</option>
                <option value="陈君杰">陈君杰</option>
                <option value="陈彧">陈彧</option>
                <option value="刘朝明">刘朝明</option>
                <option value="王文桓">王文桓</option>
                <option value="乐忠豪">乐忠豪</option>
                <option value="赖胜昌">赖胜昌</option>
                <option value="陈聪波">陈聪波</option>
                <option value="张明耀">张明耀</option>
                <option value="洪国源">洪国源</option>
                <option value="黄海翔">黄海翔</option>
                <option value="陈鸿儒">陈鸿儒</option>
                <option value="罗兴富">罗兴富</option>
                <option value="林诗怡">林诗怡</option>
                <option value="王军">王军</option>
                <option value="林鸿伟">林鸿伟</option>
                <option value="黄艺山">黄艺山</option>
                <option value="郑国忠">郑国忠</option>
                <option value="李兴武">李兴武</option>
                <option value="洪泽群">洪泽群</option>
                <option value="安卓组">安卓组</option>
                <option value="安卓大屏组">安卓大屏组</option>
                <option value="安卓小屏组">安卓小屏组</option>
                <option value="嵌入式组">嵌入式组</option>
                <option value="驱动">驱动</option>
                <option value="Python组">Python组</option>
                <option value="WEB组">WEB组</option>
            </select>
        </label>
        <label>
            记录月份（可选）:
            <input id="tm-month" type="month" style="padding:7px 11px;" />
            <small style="color:#5588af;">不选则默认当天</small>
        </label>
        <label>
            知识能力素质:
            <select id="tm-knowl">
                <option value="None">None</option>
                <option value="低级问题">低级问题</option>
                <option value="任务分">任务分</option>
                <option value="质量分">质量分</option>
                <option value="文档规范性">文档规范性</option>
                <option value="质量规范性">质量规范性</option>
                <option value="责任心">责任心</option>
                <option value="主动性">主动性</option>
                <option value="团队协作">团队协作</option>
                <option value="专业主">专业主</option>
                <option value="专业辅">专业辅</option>
                <option value="项目管理">项目管理</option>
                <option value="计划执行">计划执行</option>
                <option value="学习领悟">学习领悟</option>
                <option value="客户导向">客户导向</option>
                <option value="关注质量">关注质量</option>
                <option value="困难承受">困难承受</option>
                <option value="领导力">领导力</option>
            </select>
        </label>
        <label>
            数值输入:
            <input id="tm-score" type="text" placeholder="仅允许数字和'-'" autocomplete="off" />
        </label>
        <label>
            详细原因:
            <select id="tm-reason" disabled>
                <option value="">请先选择知识能力素质</option>
            </select>
        </label>
        <label>
            多行输入:
            <textarea id="tm-extraInfo" placeholder="可留空"></textarea>
        </label>
        <button type="button" id="tm-submitBtn">提交</button>
        <div id="tm-msg"></div>
    `;
    modal.querySelector('.tm-pbc-outerbox').appendChild(container);

    // 联动
    function updateReasonOptions(typeValue) {
        const reasonSel = container.querySelector("#tm-reason");
        reasonSel.innerHTML = "";
        if (!reasonMap[typeValue]) {
            reasonSel.disabled = true;
            reasonSel.innerHTML = `<option value="">请先选择知识能力素质</option>`;
            return;
        }
        reasonSel.disabled = false;
        reasonSel.innerHTML = `<option value="">请选择详细原因</option>`;
        reasonMap[typeValue].forEach(r=>{
            let opt = document.createElement('option');
            opt.textContent = r; opt.value = r; reasonSel.appendChild(opt);
        });
    }
    container.querySelector("#tm-knowl").addEventListener("change", function() {
        updateReasonOptions(this.value);
    });
    container.querySelector("#tm-score").addEventListener("input", function() {
        this.value = this.value.replace(/[^0-9\-]/g, '');
    });
    container.querySelector("#tm-submitBtn").onclick = function(){
        const username = container.querySelector("#tm-person").value;
        const type = container.querySelector("#tm-knowl").value;
        const score = container.querySelector("#tm-score").value.trim();
        const reason = container.querySelector("#tm-reason").value;
        const extra_info = container.querySelector("#tm-extraInfo").value.trim();
        const monthInput = container.querySelector('#tm-month').value;
        const msgDiv = container.querySelector("#tm-msg");
        if(username === "None") {
            msgDiv.style.color = "#e14037";
            msgDiv.innerText = "请选择人员";
            return;
        }
        if(type === "None") {
            msgDiv.style.color = "#e14037";
            msgDiv.innerText = "请选择知识能力素质";
            return;
        }
        if(score === "") {
            msgDiv.style.color = "#e14037";
            msgDiv.innerText = "数值输入不能为空";
            return;
        }
        if(!reason) {
            msgDiv.style.color = "#e14037";
            msgDiv.innerText = "请选择详细原因";
            return;
        }
        msgDiv.innerText = "";

        let create_date;
        if (monthInput) {
            // monthInput 格式: "2023-11"
            create_date = monthInput + '-01'; // 默认取每月1日
        } else {
            // 没填则用当天日期
            const now = new Date();
            const year = now.getFullYear();
            const month = String(now.getMonth()+1).padStart(2,'0');
            const day = String(now.getDate()).padStart(2,'0');
            create_date = `${year}-${month}-01`;
        }

        const payload = {
            username,
            create_date,
            score,
            type,
            reason,
            extra_info
        };
        msgDiv.style.color = "#2b3b54";
        msgDiv.innerText = "正在提交...";
        fetch('http://192.168.10.51:62180/pbc_score_extra', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        })
        .then(response=>{
            if(response.ok){
                msgDiv.style.color="#19b971";
                msgDiv.innerText="提交成功";
                container.querySelector("#tm-person").value="None";
                container.querySelector("#tm-knowl").value="None";
                container.querySelector("#tm-score").value="";
                container.querySelector("#tm-month").value="";
                updateReasonOptions("None");
                container.querySelector("#tm-extraInfo").value="";
                setTimeout(function(){
                    showEvalModal(false);
                }, 2000);
            }else{
                msgDiv.style.color="#e14037";
                msgDiv.innerText="提交失败";
            }
        })
        .catch(err=>{
            msgDiv.style.color="#e14037";
            msgDiv.innerText="提交出错: "+err;
        });
    };
    updateReasonOptions("None");

    // 弹窗显示隐藏
    function showEvalModal(show=true) {
        mask.style.display = show ? "" : "none";
        modal.style.display = show ? "" : "none";
    }
    circleBtn.onclick = ()=> showEvalModal(true);
    container.querySelector("#tm-pbc-close-btn").onclick =
    mask.onclick = () => showEvalModal(false);

    // 评按钮可拖动
    (function makeDrag(ele) {
        let offsetX = 0, offsetY = 0, moving = false;
        ele.onmousedown = function(e){
            moving = true;
            offsetX = e.clientX - ele.getBoundingClientRect().left;
            offsetY = e.clientY - ele.getBoundingClientRect().top;
            document.body.style.userSelect = 'none';
        }
        document.addEventListener('mousemove', function(e){
            if(moving) {
                let x = e.clientX - offsetX;
                let y = e.clientY - offsetY;
                if(x < 0) x = 0;
                if(y < 0) y = 0;
                if(x > window.innerWidth - 40) x = window.innerWidth - 40;
                if(y > window.innerHeight - 40) y = window.innerHeight - 40;
                ele.style.left = x + 'px';
                ele.style.top = y + 'px';
                ele.style.right = '';
            }
        });
        document.addEventListener('mouseup', function(){ moving = false; document.body.style.userSelect = ''; });
    })(circleBtn);

})();
