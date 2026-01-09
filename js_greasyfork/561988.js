// ==UserScript==
// @name         中国人民大学 (RUC)  人大研究生系统自动评教助手 - 随机评语/高分一键填报
// @namespace    https://github.com/AntiO2/RUC-Evaluation-Helper
// @version      1.0
// @description  【2026最新版】人大研究生评教 专门为中国人民大学 (RUC) 研究生系统设计的自动评教脚本。一键高分打分，自动填写收获、优点、改进三个维度的开放题，内置150条高质量随机评语，告别重复，提升效率。
// @author       AntiO2
// @match        *://yjs2.ruc.edu.cn/*
// @match        *://*.ruc.edu.cn/*
// @license      MIT
// @run-at       document-end
// @allFrames    true
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/561988/%E4%B8%AD%E5%9B%BD%E4%BA%BA%E6%B0%91%E5%A4%A7%E5%AD%A6%20%28RUC%29%20%20%E4%BA%BA%E5%A4%A7%E7%A0%94%E7%A9%B6%E7%94%9F%E7%B3%BB%E7%BB%9F%E8%87%AA%E5%8A%A8%E8%AF%84%E6%95%99%E5%8A%A9%E6%89%8B%20-%20%E9%9A%8F%E6%9C%BA%E8%AF%84%E8%AF%AD%E9%AB%98%E5%88%86%E4%B8%80%E9%94%AE%E5%A1%AB%E6%8A%A5.user.js
// @updateURL https://update.greasyfork.org/scripts/561988/%E4%B8%AD%E5%9B%BD%E4%BA%BA%E6%B0%91%E5%A4%A7%E5%AD%A6%20%28RUC%29%20%20%E4%BA%BA%E5%A4%A7%E7%A0%94%E7%A9%B6%E7%94%9F%E7%B3%BB%E7%BB%9F%E8%87%AA%E5%8A%A8%E8%AF%84%E6%95%99%E5%8A%A9%E6%89%8B%20-%20%E9%9A%8F%E6%9C%BA%E8%AF%84%E8%AF%AD%E9%AB%98%E5%88%86%E4%B8%80%E9%94%AE%E5%A1%AB%E6%8A%A5.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const comments = {
        // --- 收获部分 (50条) ---
        harvest: [
            "建立了系统的学科理论框架。","掌握了前沿的研究方法。","拓宽了专业视野。","逻辑思维能力显著提升。","学会了独立思考解决问题。","夯实了理论基础。","提高了理论联系实际的能力。","深刻理解了学科成果。","激发了学术灵感。","提升了信息处理能力。",
            "深入理解了本学科的核心理论体系。","对专业领域的历史演变有了清晰认知。","成功构建了相关知识点间的逻辑联系。","接触到了跨学科的前沿视角。","填补了之前知识体系中的空白。",
            "深刻领会了导师传授的学术精神。","对经典文献有了更系统的解读。","不再局限于单一的思维模式。","对行业现状有了全局性的把握。","掌握了大量实用的专业理论工具。",
            "学习了严谨的科研流程与实验设计。","提升了在复杂数据中提取信息的能力。","掌握了必备的研究软件和分析技巧。","学会了批判性地阅读学术论文。","逻辑归纳能力得到了实战锻炼。",
            "掌握了撰写学术报告的基本规范。","提升了文献检索的精确度。","能够独立运用所学方法开展研究。","科研严谨性得到了显著加强。","培养了提炼科学问题的敏锐度。",
            "实现了理论知识向实践操作的转化。","锻炼了解决突发问题的能力。","动手实践能力得到了全方位打磨。","学会了将抽象模型应用到具体场景。","提升了团队协作中沟通观点的能力。",
            "积累了宝贵的项目实践经验。","掌握了行业通用的标准流程。","口头表达和展示自我的能力进步明显。","学会了高效的时间管理方法。","能够熟练处理专业领域常见故障。",
            "批判性思维得到了启发。","养成了良好的学习习惯和钻研精神。","面对难题时的抗压能力得到了磨炼。","激发了对本专业的探索热情。","提升了自主学习和终身学习的意识。",
            "逻辑架构能力增强，思考更全面。","学会了保持高效的思考状态。","增强了学术道德意识与规范。","初步形成了自己的学术审美。","重塑了我的思维习惯与认知模式。"
        ],
        // --- 优点部分 (50条) ---
        strengths: [
            "老师备课充分，资料详实。","讲解深入浅出，生动形象。","授课条理清晰，重点突出。","注重师生互动，耐心负责。","学识渊博，引入前沿成果。","教学态度认真，反馈及时。","课堂氛围活跃。","教学手段多样化。","注重研究方法传授。","严谨治学，人格魅力强。",
            "教学内容紧跟学术前沿。","能够将复杂问题简单化。","对学生的研究想法给予充分尊重。","课件制作精美，逻辑性强。","能够准确把握学科的重难点。",
            "善于通过案例引导学生思考。","讲课富有激情，极具感染力。","批改作业认真，评价中肯。","能够兼顾不同基础的同学。","理论功底极其深厚。",
            "授课方式民主，鼓励百家争鸣。","经常分享实用的科研干货。","对学科边界有深刻的洞察。","能够耐心解答学生的每一个疑问。","时间观念强，教学安排紧凑。",
            "通过启发式教学激发学生潜能。","能够将枯燥的理论讲得妙趣横生。","注重培养学生的科研伦理。","教学资源分享非常慷慨。","对学术前沿动态了如指掌。",
            "课堂组织有序，效率极高。","鼓励学生勇于挑战权威观点。","具有极强的专业素养和敬业精神。","善于引导学生发现研究兴趣。","教学语言精炼，无冗余感。",
            "能够将思政教育自然融入专业课。","课堂讨论深度广度并重。","对学生的问题导向非常明确。","具有国际化的学术视野。","板书或演示逻辑极为严密。",
            "关心学生成长，具有长者风范。","能够结合自身科研经历授课。","课堂纪律与活跃度平衡得极好。","注重对底层逻辑的拆解。","给予学生充分的自主探索空间。",
            "教学反馈循环建立得很好。","善于发掘学生的闪光点。","为人师表，学术风格纯粹。","解答疑惑时具有极强的针对性。","课程考核设计科学合理。"
        ],
        // --- 改进部分 (50条) ---
        improvements: [
            "建议增加更多实践环节。","可以适当增加小组讨论。","希望涉及更多交叉学科知识。","期末考核形式可以更灵活。","希望分享更多论文阅读技巧。","目前进度合理，无需改进。","可以多邀请业内专家讲座。","课件中增加更多图表展示。","增加前沿软件使用指导。","希望能有更多学术规划建议。",
            "建议课后阅读文献清单再精简些。","希望增加一些课堂随堂测试。","建议部分章节的进度可以放缓。","希望能有更多一对一交流机会。","建议增加中英文双语对照资料。",
            "希望课程能结合更多当下热点。","建议增加一些实地考察机会。","希望部分深奥理论能有更多例证。","建议加强课后作业的深度点评。","希望能看到更多老师的科研手稿。",
            "建议多介绍一些失败的研究案例。","希望课件能提前发给学生预习。","建议增加一些模拟汇报的环节。","希望能有更多数据获取渠道的指导。","建议课堂讨论的主题更聚焦。",
            "希望增加一些关于职业操守的内容。","建议推荐一些相关的学术社群。","希望部分公式推导能更详细。","建议增加一些跨系课程的交流。","希望能有更多关于选题技巧的讲座。",
            "目前课程质量很高，希望能保持。","建议增加一些针对低年级的指引。","希望老师能推荐一些优质学术公众号。","建议增加一些论文排版规范的讲解。","希望能有更多针对性的心理支持。",
            "建议建立更便捷的线上答疑渠道。","希望课程能增加一些对比研究视角。","建议对期末论文的要求更具体。","希望能分享一些学术会议的信息。","建议增加一些软件操作的录屏演示。",
            "希望部分理论在不同背景下的应用。","建议增加一些科研报销等常识讲解。","希望课程能够多一些互动小游戏。","建议增加一些关于批判性阅读的讲座。","希望能多看到一些往届优秀作业。",
            "建议增加一些关于学术翻译的指导。","希望部分实验课程能有更多学时。","建议增加一些关于投稿经验的分享。","目前安排已经非常科学，暂无建议。","希望课程能继续保持高水平的产出。"
        ]
    };

    function runEvaluation() {
        const questions = document.querySelectorAll('.paper_tm');
        if (questions.length === 0) return;

        questions.forEach((q) => {
            // 1. 打分 (8-10分随机 或 4-5分随机)
            let scores = q.querySelectorAll('input[value="8"], input[value="10"]');
            if (scores.length === 0) scores = q.querySelectorAll('input[value="4"], input[value="5"]');
            if (scores.length > 0) {
                const target = scores[Math.floor(Math.random() * scores.length)];
                target.click();
                ['change', 'input'].forEach(ev => target.dispatchEvent(new Event(ev, { bubbles: true })));
            }

            // 2. 开放题随机抽取
            const tx = q.querySelector('textarea.paper_tk');
            if (tx) {
                const txt = q.innerText;
                let c = "";
                if (txt.includes("收获")) c = comments.harvest[Math.floor(Math.random() * 50)];
                else if (txt.includes("优点")) c = comments.strengths[Math.floor(Math.random() * 50)];
                else if (txt.includes("改进")) c = comments.improvements[Math.floor(Math.random() * 50)];
                if (c) {
                    tx.value = c;
                    tx.dispatchEvent(new Event('input', { bubbles: true }));
                }
            }
        });
    }

    const timer = setInterval(() => {
        const footer = document.querySelector('#pjfooter');
        if (footer && !document.getElementById('my-final-red-btn')) {
            const btn = document.createElement('a');
            btn.id = 'my-final-red-btn';
            btn.className = 'bh-btn bh-btn-primary';
            btn.innerHTML = '✨ 一键填报';
            btn.style.cssText = 'background-color: #ff4d4f !important; border-color: #ff4d4f !important; color: white !important; margin-left: 10px !important; font-weight: bold !important; cursor: pointer;';
            btn.onclick = (e) => { e.preventDefault(); runEvaluation(); };
            footer.appendChild(btn);
            console.log("【评教助手】按钮已就绪");
        }
    }, 500);

})();