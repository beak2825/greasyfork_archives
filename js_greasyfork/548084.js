// ==UserScript==
// @name         ☆我的标注小助手☆
// @namespace    http://tampermonkey.net/
// @version      5.5
// @description  1.收起图片 2.收起无关Tab 3.添加输入框粘贴和清空按钮 4.选中高亮相同文本 5.标记无效助手 6.备注助手
// @author       damu
// @match        *://qlabel.tencent.com/workbench/tasks/*
// @grant        GM_setValue
// @grant        GM_getValue
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/548084/%E2%98%86%E6%88%91%E7%9A%84%E6%A0%87%E6%B3%A8%E5%B0%8F%E5%8A%A9%E6%89%8B%E2%98%86.user.js
// @updateURL https://update.greasyfork.org/scripts/548084/%E2%98%86%E6%88%91%E7%9A%84%E6%A0%87%E6%B3%A8%E5%B0%8F%E5%8A%A9%E6%89%8B%E2%98%86.meta.js
// ==/UserScript==

(function () {
    'use strict';
    const TASKS = {
        RIZHITAGDAAN: "日志tag答案",
        YUANBAOCHANPIN: "元宝产品能力评测集",
        GUIWENDA: {
            display: "GUI各类问答",
            pattern: /GUI-[^-]*问答/
        },
        MACOSJIETU: {
            display: "macos截图",
            pattern: /macos.*截图/
        },
        CHECKTAGANSWER: "分析推理-check-tag-answer",
        FEILUNCEPINGJI: "飞轮评测集标注",
        IQTIMU: "IQ题目",
        GUIdAKUANG: "打框打标",
        ZHAOBUTONG: "找不同",
        HECHENGTUXINGTUILI: "合成图形推理",
        FEILUNCEPINGSHUJUWAJUE: "飞轮评测数据挖掘",
        KEGUANDAANCHOUQU: "客观答案抽取",
        ZIJIANLEIMUTIXI: "自建类目体系",
        BANCHESHUJUARENA: "班车数据arena",
        KUANGZHIDAIDUANYU: "框指代短语修正",
        OCRTUBIAOWENDA: "OCR-图表问答",
        FEILUNQUANNENG: "飞轮全能",
        SHIPINJIEZHEN: "视频截帧",
        NEIRONGCHUANGZUO: "内容创作",
        SHIPINSHENGWEN: "视频生文",
        JICHUSHIBIE: "基础识别",
        ANQUANFANGHU: "安全防护",
        TEZHENGDINGWEI: "特征定位"
    };
    // 无效原因
    const INVALID_REASONS = {
        PUBLIC_REASONS: [
            "拒答", "动图",
            "涉政", "色情",
            "意图不清", "指代不明",
            "不良导向", "涉嫌歧视",
            "问题有时效性", "图片引人不适",
        ],
        TASK_SPECIFIC: {
            [TASKS.RIZHITAGDAAN]: [
                "代码", "数学题",
                "k12", "主观题",
                "无法得到确切答案，信息很有限", "题目信息不全，无法作答",
                "图片计数属性差，且无法提出有效问题", "规律不明显，且无法提出有效问题",
                "计数类"
            ],
            [TASKS.CHECKTAGANSWER]: [
                "图片错误", "纯表情包，无梗",
                "无法作答", "图文无关",
                "答案不唯一", "题目包含答案",
                "图片质量差", "无法准确描述",
                "非推理题目【计数类】", "非推理题目【识别类】",
                "非推理题目【创作类】", "非推理题目【操作类】"
            ],
            [TASKS.FEILUNCEPINGJI]: [
                "图片中是无法判断的实体",
                "多图问题",
                "绘制类问题",
                "生图类问题",
                "推测未来的长相，偏向生图指令",
                "图片和问题无关的",
                "涉及严重人身攻击的",
                "问题意图不清",
                "图片中没有给出问题中提到的关键信息",
                "整体乱码的case",
                "根据图片内容无法回答问题"
            ],
            [TASKS.IQTIMU]: [
                "小语种", "无法提出可行的问题和解答",
                "无法作答，图上规律不明显，无法提出可行的问题和解答", "无法作答，图片信息较少，无法提出可行的问题和解答",
                "图片包含答案", "无法精确描述",
                "主观题，答案不唯一", "答案不唯一",
                "多题无效", "过于复杂的数独题无效",
                "迷宫类，20步以内不能解决", "操作类，需要动手的题无效",
                "画图类问题无效",
            ],
            [TASKS.GUIdAKUANG]: [
                "图片中可操作的按钮小于3个"
            ],
            [TASKS.ZHAOBUTONG]: [
                "------",
                "不是找不同",
                "无法按找不同来提问",
                "两两组合太多，不适合做找不同的答案"
            ],
            [TASKS.FEILUNCEPINGSHUJUWAJUE]: [
                "一题多问", "一图多题",
                "生图指令", "自问自答",
                "问题无效", "无法确定",
                "信息不全", "图文不符",
                "问题无法回答", "代码"
            ],
            [TASKS.KEGUANDAANCHOUQU]: [
                "图文无关", "图文不符",
                "问题质量低", "图片质量低",
                "问题大于一个", "答案重复了问题",
                "主观题答案不唯一", "答案相对客观但是不唯一",
                "答案是多选的并列关系", "没有正确答案",
                "答案不止一个", "无法确定"
            ],
            [TASKS.BANCHESHUJUARENA]: [
                "无法判断位置，缺少条件"
            ],
            [TASKS.KUANGZHIDAIDUANYU]: [
                "框选的物体不完整（误差过大超过20%）", "框内部的目标不止一个，且比例差不多",
                "框选主体以外息要素不足，难以描述", "框选了全部主体，无法描述行列信息",
                "框选主体不明，难以描述", "没有框选主体",
                "框选的是背景", "出现多个框"
            ],
            [TASKS.FEILUNQUANNENG]: [
                "图中无明显安全隐患", "图中无明显违法行为",
                "图片计数属性差", "问题格式错误"
            ],
            [TASKS.SHIPINJIEZHEN]: [
                "图片相同无效", "图片没有很强的操作性"
            ],
            [TASKS.OCRTUBIAOWENDA]: [
                "图片信息贫瘠无意义", "非图表类图片",
                "图片提问价值低", "--------------"
            ]
        }
    };
    // 备注理由
    const NOTE_REASONS = {
        PUBLIC_REASONS: [
        ],
        TASK_SPECIFIC: {
            [TASKS.RIZHITAGDAAN]: [
                "题目错误",
                "答案错误",
                "题目错误+答案错误",
                "题目修正+答案修正",
                "修正答案1",
                "修正答案2",
                "答案过度思考",
                "中英文混杂",
                "混杂拼音",
            ],
            [TASKS.CHECKTAGANSWER]: [
                "题目错误+答案错误",
                "题目错误",
                "答案错误",
                "无法作答",
                "其他语种",
                "主观题",
                "非推理题目【计数类】",
                "非推理题目【识别类】",
                "非推理题目【创作类】",
                "非推理题目【操作类】"
            ],
            [TASKS.IQTIMU]: [
                "图片包含answer"
            ],
            [TASKS.KEGUANDAANCHOUQU]: [
                "原答案错误",
                "原答案不含标准答案",
                "修正答案-用#分隔",
                "修正答案-提取选项文本",
                "修正答案-原答案单位不正确",
                "修正答案-原答案缩写不正确"
            ],
            [TASKS.BANCHESHUJUARENA]: [
                "分析过程错误，后续也没有再做修正"
            ],
            [TASKS.SHIPINJIEZHEN]: [
                "问题过于开放",
                "图片数逻辑性不佳",
                "图片关联性较差",
                "图片没有很强的视觉变化"
            ],
            [TASKS.HECHENGTUXINGTUILI]: [
                "语种错误",
                "规律不明显"
            ]
        }
    };
    // 答案助手
    const ANSWER_TOOLS = {
        PUBLIC_TOOLS: {
            t1: "助手1：一键去除【空格 * 。】",
            t2: "助手2：符号中->英 去首尾空格【,:!; \' \"】",
            t3: "助手3：符号英->中 去全部空格【，：！；‘’“”】"
        },
        TASK_SPECIFIC: {
            [TASKS.IQTIMU]: {
                t4: "助手4：一键替换[#] 【- -> → ,，、\/ 和】"
            },
            [TASKS.KEGUANDAANCHOUQU]: {
                t4: "助手4：一键替换[#] 【- -> → ,，、\/ 和】"
            }
        }
    };
    // 获取答案助手名称
    function getAnswerToolNames(shortTaskName) {
        if (!shortTaskName) shortTaskName = getShortTaskName();
        return [
            ...Object.values(ANSWER_TOOLS.PUBLIC_TOOLS),
            ...(shortTaskName ? Object.values(ANSWER_TOOLS.TASK_SPECIFIC[shortTaskName] || {}) : [])
        ];
    }
    // 获取备注理由（公共 + 专属）
    function getNoteReasons(shortTaskName, textInfo = '') {
        if (!shortTaskName) shortTaskName = getShortTaskName();
        if (textInfo.includes("图片错误备注")) {
            return [
                "语种错误",
                "规律不明显",
                "答案不唯一",
                "没有正确答案",
                "图形存在错误，影响判断"
            ];
        } else if (textInfo.includes("问题错误备注")) {
            return [
                "语种错误"
            ];
        } else if (textInfo.includes("答案错误备注")) {
            return [
                "语种错误",
                "规律错误",
                "答案不唯一",
                "没有正确答案",
                "图形存在错误，影响判断",
                "描述与图片不符-"
            ];
        } else if (textInfo.includes("caption错误备注")) {
            return [
                "语种错误",
                "描述与图片不符-",
                "出现了不正确信息-",
                "图形存在错误，影响判断"
            ];
        } else {
            return [
                ...(NOTE_REASONS.TASK_SPECIFIC[shortTaskName] || []),
                ...NOTE_REASONS.PUBLIC_REASONS
            ];
        }
    }
    // 获取无效原因（公共 + 专属）
    const noNeedList = ['IQ题目', '打框打标', '微信小程序打框打标', '找不同', '合成图形推理'];
    function getInvalidReasons(shortTaskName) {
        if (!shortTaskName) shortTaskName = getShortTaskName();
        if (noNeedList.includes(shortTaskName)) return [...(INVALID_REASONS.TASK_SPECIFIC[shortTaskName] || [])];
        return [
            ...INVALID_REASONS.PUBLIC_REASONS,
            ...(INVALID_REASONS.TASK_SPECIFIC[shortTaskName] || [])
        ];
    }

    // 项目名称
    let taskName = document.querySelector('.z-level__item.z-header__logo b')?.textContent;
    // 获取项目短名称
    function getShortTaskName() {
        const taskName = document.querySelector('.z-level__item.z-header__logo b')?.textContent;
        if (!taskName) return null;

        for (const value of Object.values(TASKS)) {
            if (typeof value === 'object' && value.pattern) {
                // 使用正则表达式匹配
                if (value.pattern.test(taskName)) {
                    return value.display;
                }
            } else if (typeof value === 'string') {
                // 字符串类型：直接检查包含关系
                if (taskName.includes(value)) {
                    return value;
                }
            }
        }

        return null;
    }

    const STATE_KEY_ADDHELPBTN = "add_help_btn";
    const STATE_KEY_CHECKMARKS = 'is_checkmarks_state';
    const STATE_KEY_SKIP = 'hide_skip_state';
    const STATE_KEY_TOP = 'hide_top_state';
    const STATE_KEY_IMGPRE = 'pre_images_state';
    const STATE_KEY_TAB = 'hide_tab_state';
    const STATE_KEY_IMG = 'hide_images_state';
    const POSITION_KEY = 'button_position_side';


    let isAddHelpBtn = localStorage.getItem(STATE_KEY_ADDHELPBTN) === 'true';;
    let isRemoveCheckmarks = localStorage.getItem(STATE_KEY_CHECKMARKS) === 'true';;
    let hiddenSkip = localStorage.getItem(STATE_KEY_SKIP) === 'true';
    let hiddenTop = localStorage.getItem(STATE_KEY_TOP) === 'true';
    let previewImg = localStorage.getItem(STATE_KEY_IMGPRE) === 'true';
    let hiddenTab = localStorage.getItem(STATE_KEY_TAB) === 'true';
    let hiddenImg = localStorage.getItem(STATE_KEY_IMG) === 'true';
    let side = localStorage.getItem(POSITION_KEY) || 'right';

    const wrapper = document.createElement('div');
    wrapper.style.position = 'fixed';
    wrapper.style.top = 'auto';
    wrapper.style.bottom = '60px'; // 距离底部20像素（可根据需要调整）
    wrapper.style[side] = '0px';
    wrapper.style.zIndex = '9999';
    wrapper.style.display = 'flex';
    wrapper.style.flexDirection = 'column';
    wrapper.style.gap = '1px';
    wrapper.style.transition = 'all 0.3s ease';
    // 部分隐藏显示
    function setPartialVisible() {
        wrapper.style[side] = '-74px';
    }
    function setFullyVisible() {
        wrapper.style[side] = '0px';
    }

    function createButton(text) {
        const btn = document.createElement('div');
        btn.textContent = text;
        btn.style.padding = '5px 8px';
        btn.style.backgroundColor = '#007BFF';
        btn.style.color = '#fff';
        btn.style.borderRadius = '3px 0 0 3px';
        btn.style.cursor = 'pointer';
        btn.style.boxShadow = '0 1px 3px rgba(0,0,0,0.2)';
        btn.style.userSelect = 'none';
        btn.style.whiteSpace = 'nowrap';
        btn.style.transition = 'all 0.3s ease';
        return btn;
    }

    const btnQuickSelection = createButton(isAddHelpBtn ? '辅助键:开' : '辅助键:关');
    const btnCheckmarks = createButton(isRemoveCheckmarks ? '自动勾选' : '取消勾选');
    const btnSkip = createButton(hiddenSkip ? '显示跳过' : '隐藏跳过');
    const btnTop = createButton(hiddenTop ? '展开TOP' : '收起TOP');
    const btnImg = createButton(hiddenImg ? '展开图片' : '收起图片');
    const btnTab = createButton(hiddenTab ? '展开TAB' : '收起TAB');
    const btnPreImg = createButton(previewImg ? '预览图:开' : '预览图:关');

    // 添加辅助按钮
    function addHelpBtn() {
        const addIds = [];
        const shortTaskName = getShortTaskName();
        if(!shortTaskName)return;
        switch (shortTaskName) {
            case TASKS.GUIWENDA.display: // GUI各类问答
                addQuickSelectionBtn({ id: 'select-no-q1-a1', text: 'Q&A维度1选 □否', value: '否', top: '647px', left: '1129px', color: '#52c41a', specialFilter: true });
                addCloneBtn(); // 提交按钮分身
                break;
            case TASKS.YUANBAOCHANPIN: // 元宝产品能力评测集
                addCloneBtn(); // 提交按钮分身
                break;
            default:
                addQuickSelectionBtn();
                addCloneBtn(); // 提交按钮分身
                break;
        }

        // 按钮分身 默认为提交按钮
        function addCloneBtn(selectorPparam = `button[class='ivu-btn ivu-btn-primary ivu-btn-large']`) {
            let buttonClone = null;
            if (isAddHelpBtn) {
                buttonClone = document.getElementById(`btn-myclone`);
                if (buttonClone) { buttonClone.style.display = 'flex'; return; }

                const btn = document.querySelector(selectorPparam);
                if (!btn) return;

                buttonClone = document.createElement('div');
                buttonClone.id = `btn-myclone`;
                const clone = btn.cloneNode(true);
                const drag = document.createElement('div');

                // 设置容器样式，使用GM_getValue获取保存的位置或使用默认位置
                buttonClone.style.cssText = `position: fixed; z-index: 99999; display: flex; left: ${GM_getValue('btn-myclone-left', '1437px')}; top: ${GM_getValue('btn-myclone-top', '587px')}; align-items: center; background: transparent; border-radius: 4px; user-select: none;`;

                // 设置拖动按钮样式
                drag.style.cssText = `width: 20px; height: 100%; background: rgba(0, 0, 0, 0.7); color: white; display: flex; align-items: center; justify-content: center; border-radius: 0 4px 4px 0; cursor: move; font-size: 12px; opacity: 0; transition: opacity 0.2s ease; box-shadow: 2px 0 8px rgba(0,0,0,0.15);`;

                drag.innerHTML = '⋮⋮';
                buttonClone.append(clone, drag);
                document.body.appendChild(buttonClone);

                // 事件处理
                buttonClone.onmouseenter = function () { drag.style.opacity = '1'; };
                buttonClone.onmouseleave = function () { drag.style.opacity = '0'; };
                clone.onclick = (e) => { e.stopPropagation(); document.querySelector(selectorPparam).click(); };

                let isDragging = false;
                let dragOffset = { x: 0, y: 0 };

                // 拖拽移动处理函数
                const handleMouseMove = (e) => {
                    if (!isDragging) return;
                    buttonClone.style.left = (e.clientX - dragOffset.x) + 'px';
                    buttonClone.style.top = (e.clientY - dragOffset.y) + 'px';
                };

                // 拖拽结束处理函数
                const handleMouseUp = () => {
                    if (isDragging) {
                        isDragging = false;
                        Object.assign(drag.style, { cursor: 'move', opacity: '0' });
                        buttonClone.style.opacity = '1';

                        // 保存按钮位置
                        GM_setValue('btn-myclone-left', buttonClone.style.left);
                        GM_setValue('btn-myclone-top', buttonClone.style.top);
                    }
                };

                drag.onmousedown = (e) => {
                    if (e.button !== 0) return;
                    isDragging = true;
                    const rect = buttonClone.getBoundingClientRect();
                    Object.assign(dragOffset, { x: e.clientX - rect.left, y: e.clientY - rect.top });
                    Object.assign(drag.style, { cursor: 'grabbing', opacity: '1' });
                    buttonClone.style.opacity = '0.9';

                    // 添加事件监听器
                    document.addEventListener('mousemove', handleMouseMove);
                    document.addEventListener('mouseup', handleMouseUp);
                    e.preventDefault();
                };

                // 阻止文本选择
                [drag, clone].forEach(el => el.addEventListener('selectstart', e => e.preventDefault()));
            } else {
                buttonClone = document.getElementById(`btn-myclone`);
                if (buttonClone) buttonClone.remove();
            }
        }

        // 添加快速选择按钮
        function addQuickSelectionBtn(...newbBttonConfigs) {
            // 默认按钮配置
            const buttonConfigs = [
                { id: 'select-yes', text: '一键勾选 □是', value: '是', top: '588px', left: '1207px', color: '#1890ff' },
                { id: 'select-no', text: '一键勾选 □否', value: '否', top: '703px', left: '1207px', color: '#ff4d4f' }
            ];

            const preCheckboxes = document.querySelectorAll(`input[type="checkbox"]`)
            if(!preCheckboxes.length){ // 检查是否需要添加一键勾选 □按钮
                buttonConfigs.length = 0; // 清空数组
            }
            // 新增按钮配置
            if (newbBttonConfigs) {
                buttonConfigs.push(...newbBttonConfigs);
            }
            // id列表更新
            buttonConfigs.forEach(config => addIds.push(config.id));

            if (isAddHelpBtn) {
                // 遍历配置创建按钮
                buttonConfigs.forEach(config => { createButton(config); });

                // 创建单个功能按钮
                function createButton(config) {
                    // 如果按钮已存在则不再创建
                    if (document.getElementById(`${config.id}-container`)) return;

                    // 创建按钮容器
                    const buttonContainer = document.createElement('div');
                    buttonContainer.id = `${config.id}-container`;
                    // 设置容器样式，使用GM_getValue获取保存的位置或使用默认位置
                    buttonContainer.style.cssText = `position: fixed; top: ${GM_getValue(`${config.id}-top`, config.top)}; left: ${GM_getValue(`${config.id}-left`, config.left)}; z-index: 9999; display: flex; align-items: center; background: transparent; border-radius: 4px; user-select: none;`;

                    // 创建功能按钮
                    const button = document.createElement('button');
                    button.innerHTML = config.text;
                    button.id = config.id;
                    button.style.cssText = `padding: 10px 15px; background: ${config.color}; color: white; border: none; border-radius: 4px 0 0 4px; cursor: pointer; font-size: 14px; box-shadow: 0 2px 8px rgba(0,0,0,0.15); user-select: none; margin: 0;`;

                    // 创建拖拽手柄
                    const dragHandle = document.createElement('div');
                    dragHandle.innerHTML = '⋮⋮';
                    dragHandle.style.cssText = `width: 20px; height: 100%; background: rgba(0, 0, 0, 0.7); color: white; display: flex; align-items: center; justify-content: center; border-radius: 0 4px 4px 0; cursor: move; font-size: 12px; opacity: 0; transition: opacity 0.2s ease; box-shadow: 2px 0 8px rgba(0,0,0,0.15);`;

                    // 鼠标悬停显示拖拽手柄
                    buttonContainer.addEventListener('mouseenter', function () { dragHandle.style.opacity = '1'; });
                    buttonContainer.addEventListener('mouseleave', function () { dragHandle.style.opacity = '0'; });

                    // 拖拽相关变量
                    let isDragging = false;
                    let dragOffset = { x: 0, y: 0 };

                    // 拖拽手柄鼠标按下事件
                    dragHandle.addEventListener('mousedown', function (e) {
                        if (e.button !== 0) return; // 只响应左键
                        isDragging = true;
                        const rect = buttonContainer.getBoundingClientRect();
                        dragOffset.x = e.clientX - rect.left;
                        dragOffset.y = e.clientY - rect.top;
                        dragHandle.style.cursor = 'grabbing';
                        dragHandle.style.opacity = '1';
                        buttonContainer.style.opacity = '0.9';
                        e.preventDefault();
                        e.stopPropagation();
                    });

                    // 鼠标移动事件处理拖拽
                    document.addEventListener('mousemove', function (e) {
                        if (!isDragging) return;
                        const x = e.clientX - dragOffset.x;
                        const y = e.clientY - dragOffset.y;
                        buttonContainer.style.left = x + 'px';
                        buttonContainer.style.top = y + 'px';
                    });

                    // 鼠标松开事件结束拖拽
                    document.addEventListener('mouseup', function () {
                        if (isDragging) {
                            isDragging = false;
                            dragHandle.style.cursor = 'move';
                            buttonContainer.style.opacity = '1';
                            // 保存按钮位置
                            GM_setValue(`${config.id}-left`, buttonContainer.style.left);
                            GM_setValue(`${config.id}-top`, buttonContainer.style.top);
                        }
                    });

                    // 功能按钮点击事件
                    button.addEventListener('click', function (e) {
                        if (isDragging) return; // 拖拽时不触发点击
                        if (config.specialFilter) handleSpecialCheck(config.value); // 特殊处理
                        else handleNormalCheck(config.value); // 普通处理
                    });

                    // 阻止按钮鼠标事件冒泡
                    button.addEventListener('mousedown', function (e) {
                        if (e.button === 0) e.stopPropagation();
                    });

                    // 组装按钮元素
                    buttonContainer.appendChild(button);
                    buttonContainer.appendChild(dragHandle);
                    document.body.appendChild(buttonContainer);

                    // 阻止文本选择
                    dragHandle.addEventListener('selectstart', function (e) { e.preventDefault(); });
                    button.addEventListener('selectstart', function (e) { e.preventDefault(); });
                }

                // 普通勾选处理函数
                function handleNormalCheck(value) {
                    const checkboxes = document.querySelectorAll(`input[type="checkbox"][value="${value}"]`);
                    if (checkboxes.length === 0) {
                        console.log(`未找到值为"${value}"的复选框`);
                        return;
                    }
                    // 遍历并勾选所有匹配的复选框
                    checkboxes.forEach(checkbox => {
                        checkbox.click();
                        if (!checkbox.checked) {
                            checkbox.checked = true;
                            checkbox.dispatchEvent(new Event('change', { bubbles: true }));
                            checkbox.dispatchEvent(new Event('click', { bubbles: true }));
                        }
                    });
                    const checkedCount = document.querySelectorAll(`input[type="checkbox"][value="${value}"]:checked`).length;
                    console.log(`已勾选 ${checkedCount}/${checkboxes.length} 个"${value}"复选框`);
                }

                // 特殊勾选处理函数（针对维度1）
                function handleSpecialCheck(value) {
                    const checkboxes = document.querySelectorAll(`input[type="checkbox"][value="${value}"]`);
                    if (checkboxes.length === 0) {
                        console.log('未找到符合条件的复选框');
                        return;
                    }
                    let checkedCount = 0;
                    // 遍历复选框，只处理特定维度的
                    checkboxes.forEach(checkbox => {
                        const labelElement = checkbox.closest('label.checkboxItem');
                        if (labelElement) {
                            const container = labelElement.closest('.multiple-select');
                            if (container) {
                                const questionLabel = container.querySelector('label.ivu-form-item-label');
                                if (!questionLabel) return;
                                const labelText = questionLabel.textContent;
                                // 只处理包含特定文本的维度
                                if (labelText.includes('问题维度1是否合格【问题和图片内容是否直接相关】') || labelText.includes('答案维度1是否合格【答案是否正确】')) {
                                    checkbox.click();
                                    if (!checkbox.checked) {
                                        checkbox.checked = true;
                                        checkbox.dispatchEvent(new Event('change', { bubbles: true }));
                                        checkbox.dispatchEvent(new Event('click', { bubbles: true }));
                                    }
                                    checkedCount++;
                                    console.log('已点击匹配的复选框');
                                }
                            }
                        }
                    });
                    console.log(`维度1勾选完成，共处理了 ${checkedCount} 个复选框`);
                }
            } else {
                addIds.forEach(id => {
                    const container = document.getElementById(`${id}-container`);
                    if (container) container.remove();
                });
            }
        }
    }
    btnQuickSelection.addEventListener('click', () => {
        isAddHelpBtn = !isAddHelpBtn;
        localStorage.setItem(STATE_KEY_ADDHELPBTN, isAddHelpBtn);
        addHelpBtn();
        btnQuickSelection.textContent = isAddHelpBtn ? '辅助键:开' : '辅助键:关';
    });

    // 是否是标注界面
    const isLabel = new URLSearchParams(window.location.search)?.get('scenes') === 'label';
    // 切换默认勾选状态  isRemoveCheckmarks == true时 取消“完全正确”默认选中
    let oldPackKey = '';
    async function removeCheckmarks() {
        if (!isRemoveCheckmarks) return;
        // const params = new URLSearchParams(window.location.search);
        // if (params.get('scenes') !== 'label') return;
        if (!isLabel) return;
        const packKey = location.pathname.split('/').find(part => part === 'pack_key') && location.pathname.split('/')[location.pathname.split('/').indexOf('pack_key') + 1];
        if (packKey === oldPackKey) return;
        const checkmarks = await getElementWithRetry('.ivu-checkbox-checked', document, 200);
        checkmarks?.forEach(el => el.click());
        oldPackKey = packKey;
    }
    btnCheckmarks.addEventListener('click', () => {
        isRemoveCheckmarks = !isRemoveCheckmarks;
        localStorage.setItem(STATE_KEY_CHECKMARKS, isRemoveCheckmarks);
        removeCheckmarks();
        btnCheckmarks.textContent = isRemoveCheckmarks ? '自动勾选' : '取消勾选';
    });

    // 切换跳过按钮隐藏状态
    async function moveSkipButton() {
        await sleep(70);
        const footer = document.querySelector('.z-footer.z-level');
        if (!footer) return;
        const buttons = footer.querySelectorAll('button');
        const skipButton = [...buttons].find(btn => btn.textContent.includes('跳过') || btn.querySelector('span')?.textContent.includes('跳过'));
        if (!skipButton) return;
        if (hiddenSkip) {
            skipButton.style.display = 'none'; // 隐藏跳过按钮
        } else {
            const pauseButton = [...buttons].find(btn => btn.textContent.includes('暂停') || btn.querySelector('span')?.textContent.includes('暂停'));
            if (pauseButton && skipButton && (pauseButton.compareDocumentPosition(skipButton) & Node.DOCUMENT_POSITION_FOLLOWING)) {
                pauseButton.before(skipButton); // 交换跳过和暂停按钮位置
            }
            skipButton.style.display = '';
        }
    }
    btnSkip.addEventListener('click', () => {
        hiddenSkip = !hiddenSkip;
        localStorage.setItem(STATE_KEY_SKIP, hiddenSkip);
        moveSkipButton();
        btnSkip.textContent = hiddenSkip ? '显示跳过' : '隐藏跳过';
    });

    let isEditTop = false;
    // 切换TOP
    async function applyTopVisibility() {
        // 切换顶部
        const [top] = await getElementWithRetry('div.z-header.z-level')
        if (!top) return;
        const [titleNewSpan] = await getElementWithRetry('#titleNewSpan', top);
        const iTags = top.querySelectorAll('i, p, img');
        const bTags = top.querySelectorAll('button, input');
        if (hiddenTop) {
            isEditTop = true;
            top.style.padding = '0px';
            setAllFontSizes(top, "10px");
            iTags.forEach(iTag => {
                const className = iTag.className;
                if (!className.includes("ivu-icon ivu-icon-md-search") &&
                    !className.includes("ivu-icon ivu-icon-ios-arrow-back") &&
                    !className.includes("ivu-icon ivu-icon-ios-arrow-forward") &&
                    !className.includes("pointer ivu-icon ivu-icon-ios-close")) {
                    iTag.style.display = 'none';
                } else if (className.includes("ivu-icon ivu-icon-md-search")) {
                    iTag.style.lineHeight = '2.5';
                }
            });
            bTags.forEach(bTag => {
                bTag.style.height = '15px';
                bTag.style.padding = '0px';
                bTag.style.boxSizing = 'border-box';
                bTag.style.lineHeight = '1';
            });
            // 任务id和key显示在一行
            if (!titleNewSpan) {
                const [atitle] = await getElementWithRetry('div[data-v-9cef8d1a].z-level__item.z-header__logo', top);
                if(!atitle)return;
                const boldTag = atitle.querySelector('b'); // 获取 <b> 标签
                const pTag = atitle.querySelector('p'); // 获取 <p> 标签
                // 2. 提取 <p> 里的两个 <span> 的内容
                //const span1Text = pTag.querySelector('span.mrm').textContent; // "题包Key：123"
                const span2Text = pTag.querySelector('span:not(.mrm)').textContent; // "任务明细ID: 123"
                // 3. 创建一个新的 <span> 并插入到 <b> 的最后
                const newSpan = document.createElement('span');
                newSpan.id = 'titleNewSpan';
                // newSpan.textContent = `${span1Text} ${span2Text}`; // 合并内容
                newSpan.textContent = `${span2Text}`; // 合并内容
                boldTag.appendChild(newSpan); // 插入到 <b> 内部末尾
            }
        } else if (isEditTop) {
            top.style.padding = '10px';
            setAllFontSizes(top, "16px");
            iTags.forEach(iTag => {
                iTag.style.display = '';
                iTag.style.lineHeight = '1';
            });
            bTags.forEach(bTag => {
                bTag.style.height = '25px';
                bTag.style.padding = '5px';
                bTag.style.lineHeight = '1 ';
            });
            if (titleNewSpan) titleNewSpan.remove();
        }
        // 隐藏图片缩放百分比
        const [viewer] = await getElementWithRetry('div.viewer-tooltip')
        if (viewer) viewer.style.display = hiddenTop ? 'none' : '';
    }
    btnTop.addEventListener('click', () => {
        hiddenTop = !hiddenTop;
        localStorage.setItem(STATE_KEY_TOP, hiddenTop);
        applyTopVisibility();
        btnTop.textContent = hiddenTop ? '展开TOP' : '收起TOP';
    });

    // 切换图片
    function applyImageVisibility() {
        const images = document.querySelectorAll('img');
        images.forEach(img => {
            img.style.display = hiddenImg ? 'none' : '';
        });
    }
    btnImg.addEventListener('click', () => {
        hiddenImg = !hiddenImg;
        localStorage.setItem(STATE_KEY_IMG, hiddenImg);
        applyImageVisibility();
        btnImg.textContent = hiddenImg ? '展开图片' : '收起图片';
    });

    // 切换TAB
    let isTabBlock = false;
    async function applyTabVisibility() {
        if (isTabBlock) return;
        isTabBlock = true;
        observer.disconnect(); // 停止监听
        const taskName = getShortTaskName();
        console.log(taskName);
        if (!taskName) { isTabBlock = false; observer.observe(document.body, { childList: true, subtree: true }); return; } // 非标注页面直接返回
        const tabs = await getElementWithRetry('div.t-col');
        if (!isTabBlock) { isTabBlock = false; observer.observe(document.body, { childList: true, subtree: true }); return; }
        // 让底部变窄一点
        document.head.appendChild(Object.assign(document.createElement('style'), { textContent: '.z-footer { padding: 5px !important; }' }));
        switch (taskName) {
            case TASKS.RIZHITAGDAAN: // 日志tag答案
                changeLayout_5to3(tabs); // 5个模块合并成3个
                break;
            case TASKS.YUANBAOCHANPIN: // 元宝产品能力评测集
                changeImgSize('auto', '500px'); // 图片大小调整
                if (tabs.length > 2) {
                    const stageOperation = document.querySelector("div.z-stage__operation");
                    stageOperation.style.display = hiddenTab ? 'none' : ''; // 隐藏工具栏
                    tabs[0].style.display = hiddenTab ? 'none' : ''; // 隐藏第一个模块
                    tabs[3].style.display = hiddenTab ? 'none' : ''; // 隐藏第四个模块
                }
                break;
            case TASKS.CHECKTAGANSWER: // 分析推理-check-tag-answer
                changeLayout_6to2(tabs); // 6个模块合并成2个
                break;
            case TASKS.FEILUNCEPINGJI: // 飞轮评测集标注
                if (tabs.length > 1) {
                    tabs[0].style.display = hiddenTab ? 'none' : ''; // 隐藏第一个模块
                    tabs[1].style.display = hiddenTab ? 'none' : ''; // 隐藏第二个模块
                }
                break;
            case TASKS.MACOSJIETU.display: // macos xxx 截图
            case TASKS.GUIdAKUANG: // 打框打标
                getElementWithRetry('div.side-menu.ivu-col').then(sideMenu => { if (sideMenu.length > 0) sideMenu[0].style.display = hiddenTab ? 'none' : ''; }); // 隐藏侧边菜单栏
                getElementWithRetry('div.header-menu').then(headerMenu => { if (headerMenu.length > 0) headerMenu[0].style.display = hiddenTab ? 'none' : ''; }); // 隐藏上边菜单栏
                // 让消除图片底部空隙
                document.head.appendChild(Object.assign(document.createElement('style'), { textContent: '.horizontal-layout .z-stage__template[data-v-3ff29041] { padding-bottom: 0px !important; }' }));
                // 将弹出框的取消按钮和设置按钮放到左边
                document.head.appendChild(Object.assign(document.createElement('style'), { textContent: '.ivu-modal-footer { text-align: left !important; }' }));
                break;
            case TASKS.ZHAOBUTONG: // 合成图形推理
                //changeImgSize('600px', '650px'); // 图片大小调整
                changeAnswer(tabs); // 隐藏答案模块
                break;
            case TASKS.HECHENGTUXINGTUILI: // 合成图形推理
                changeImgSize('40%'); // 图片大小调整
                break;
            case TASKS.GUIWENDA.display: // GUI- xxx 问答
                changePageLayout(tabs); // 调整页面布局
                break;
            case TASKS.IQTIMU: // IQ题目
                changeImgSize('50%'); // 图片大小调整
            case TASKS.KEGUANDAANCHOUQU: // 客观答案抽取
                changeImgAndQuestion(tabs); // 合并问题和图片模块
                break;
            case TASKS.NEIRONGCHUANGZUO: // 内容创作
                if (tabs.length > 1) tabs[1].style.display = hiddenTab ? 'none' : ''; // 隐藏第二个模块
                break;
            case TASKS.FEILUNQUANNENG: // 飞轮全能
                if (tabs.length >= 4) { for (let i = 0; i < 4; i++) tabs[i].style.display = hiddenTab ? 'none' : ''; }
                changeImgSize('20%'); // 图片大小调整
                break;
            case TASKS.BANCHESHUJUARENA: // 班车数据arena
                document.querySelectorAll('#chat-1-0, #chat-1-1').forEach(tab => {
                    tab.style.display = hiddenTab ? 'none' : ''; // 隐藏前两个模块
                });
                break;
            case TASKS.KUANGZHIDAIDUANYU: // 框指代短语修正
                if (tabs.length > 1) tabs[1].style.display = hiddenTab ? 'none' : ''; // 隐藏第二个模块
                changeInputWidth('60%'); // 输入部分宽度调整
                changeImgSize('60%'); // 图片大小调整
                break;
            case TASKS.FEILUNCEPINGSHUJUWAJUE: // 飞轮评测数据挖掘
            case TASKS.SHIPINSHENGWEN: { // 视频生文
                const firstTab = document.querySelector('div.chat-content');
                if (firstTab) firstTab.style.display = hiddenTab ? 'none' : ''; // 隐藏第一个模块
                changeInputWidth('25%'); // 输入部分宽度调整
                // TODO: 移除右侧表单逻辑
                break;
            }
            case TASKS.JICHUSHIBIE: // 基础识别
                if (tabs[0]) tabs[0].style.display = hiddenTab ? 'none' : ''; // 隐藏第一个模块
                break;
            default: // 其他任务默认不处理
                break;
        }

        // 问题答案框中的文字大小
        const answerElements = document.getElementsByClassName('markdown-body');
        for (let el of answerElements) {
            el.style.fontSize = '17px';
        }
        // 输入框中的文字大小
        const inputElements = document.getElementsByClassName('customInput');
        for (let el of inputElements) {
            el.style.fontSize = '18px';
        }
        // 问题和答案
        const textContentElements = document.getElementsByClassName('text-content');
        for (let el of textContentElements) {
            el.style.fontSize = '16px';
        }

        isTabBlock = false;
        observer.observe(document.body, { childList: true, subtree: true }); //重启监听
    }
    btnTab.addEventListener('click', () => {
        hiddenTab = !hiddenTab;
        localStorage.setItem(STATE_KEY_TAB, hiddenTab);
        applyTabVisibility();
        btnTab.textContent = hiddenTab ? '展开TAB' : '收起TAB';
    });

    // 切换预览图状态
    function applyPreviewImg() {
        let preview = null, timer = null, target = null;
        const move = e => {
            if (!preview) return;
            const p = 15, w = preview.offsetWidth, h = preview.offsetHeight, sw = window.innerWidth, sh = window.innerHeight;
            let x = e.clientX + p, y = e.clientY + p;
            if (x + w > sw) x = e.clientX - w - p;
            if (y + h > sh) y = e.clientY - h - p;
            if (x < 0) x = 0;
            if (y < 0) y = 0;
            preview.style.left = x + 'px';
            preview.style.top = y + 'px';
        };
        const remove = () => { clearTimeout(timer); if (preview) preview.remove(); preview = null; document.removeEventListener('mousemove', move); };
        document.addEventListener('mouseover', e => {
            if (!previewImg || e.target.tagName !== 'IMG') return;
            target = e.target;
            timer = setTimeout(() => {
                if (preview) return;
                preview = Object.assign(document.createElement('img'), {
                    src: target.src,
                    style: 'position:fixed;width:auto;max-height:800px;z-index:9999;pointer-events:none;border:2px solid #ccc;border-radius:6px;box-shadow:0 0 8px rgba(0,0,0,0.5);'
                });
                document.body.appendChild(preview);
                document.addEventListener('mousemove', move);
            }, 100);
        });
        document.addEventListener('mouseout', e => { if (e.target === target || e.target === preview) remove(); });
        document.addEventListener('click', remove);
    }
    applyPreviewImg();
    btnPreImg.addEventListener('click', () => {
        previewImg = !previewImg;
        localStorage.setItem(STATE_KEY_IMGPRE, previewImg);
        btnPreImg.textContent = previewImg ? '预览图:开' : '预览图:关';
    });

    // 悬停躲入
    wrapper.addEventListener('mouseenter', () => {
        setFullyVisible();
    });
    wrapper.addEventListener('mouseleave', () => {
        setPartialVisible();
    });

    // 拖动切换边
    let isDragging = false;
    let startX = 0;
    wrapper.addEventListener('mousedown', (e) => {
        isDragging = true;
        startX = e.clientX;
        document.body.style.userSelect = 'none';
    });

    document.addEventListener('mousemove', (e) => {
        if (!isDragging) return;
        const dx = e.clientX - startX;
        if (dx > 10) {
            side = 'right';
            wrapper.style.left = '';
            wrapper.style.right = '0px';
            btnImg.style.borderRadius = '5px 0 0 5px';
            btnTab.style.borderRadius = '5px 0 0 5px';
        } else if (dx < -10) {
            side = 'left';
            wrapper.style.right = '';
            wrapper.style.left = '0px';
            btnImg.style.borderRadius = '0 5px 5px 0';
            btnTab.style.borderRadius = '0 5px 5px 0';
        }
        localStorage.setItem(POSITION_KEY, side);
    });

    document.addEventListener('mouseup', () => {
        if (isDragging) {
            setPartialVisible();
            isDragging = false;
            document.body.style.userSelect = '';
        }
    });

    // 将图片移动到表单下面
    function changeImgToTable(tabs) {
        if (tabs.length < 3) return;
        const imgDiv = tabs[0].querySelector('div.safe-image.image-item');
        const oldWrapper = document.getElementById('tow-answers-div')
        if (hiddenTab) {
            if (!oldWrapper) {
                // 最后一个输入框后面显示图片
                const containers = document.querySelectorAll('.customLayoutInput');
                if (!containers) return;
                const lastContainer = containers[containers.length - 1];
                const imgDivClone = imgDiv.cloneNode(true);
                imgDivClone.id = 'imgDivClone';
                imgDivClone.style.marginTop = '15px';
                imgDivClone.addEventListener('click', function () { imgDiv.click(); });
                // await sleep(Math.floor(Math.random() * 9 + 2) * 30); // 睡眠随机时长
                if (!isTabBlock || document.querySelector('#imgDivClone')) return;
                // 插入图片
                lastContainer.insertAdjacentElement('afterend', imgDivClone);
                tabs[0].style.display = 'none';
            }
        } else {
            // 移除图片
            document.querySelector('#imgDivClone')?.remove();
            tabs[0].style.display = '';
        }
    }

    // 隐藏答案模块
    function changeAnswer(tabs) {
        // if (!isLabel) return;
        if (tabs.length < 3) return;
        const oldWrapper = document.getElementById('tow-answers-div')
        if (hiddenTab) {
            // 隐藏答案1, 答案2
            tabs[1].style.display = 'none'; tabs[2].style.display = 'none';
            if (!oldWrapper) {
                // 最后一个输入框后面显示答案1和答案2
                const containers = document.querySelectorAll('.customLayoutInput');
                if (!containers) return;

                const lastContainer = containers[containers.length - 1];
                const wrapper = document.createElement('div');
                const div1 = document.createElement('div');
                const div2 = document.createElement('div');
                const style = document.createElement('style');

                wrapper.id = 'tow-answers-div';
                wrapper.className = 'answers-wrapper';
                wrapper.style.margin = '15px 10px';

                div1.appendChild(extractList(tabs[1]));
                div2.appendChild(extractList(tabs[2]));

                wrapper.appendChild(div1);
                wrapper.appendChild(div2);
                lastContainer.insertAdjacentElement('afterend', wrapper);

                style.textContent = `.answers-wrapper{display:flex;gap:20px;}@media(max-width:600px){.answers-wrapper{flex-direction:column;}}`;
                document.head.appendChild(style);
            }
        } else {
            // 显示答案1, 答案2
            tabs[1].style.display = ''; tabs[2].style.display = '';
            if (oldWrapper) {
                oldWrapper.remove();
            }
        }
    }
    // 提取 tabs[1], tabs[2] 中 li 的文字
    function extractList(tab) {
        const lis = tab.querySelectorAll('li');
        const ul = document.createElement('ul');
        lis.forEach((li, index) => {
            const newLi = document.createElement('li');
            newLi.textContent = `${index + 1}. ${li.textContent.trim()}`;
            ul.appendChild(newLi);
        });
        return ul;
    }

    // 改变页面布局 （5个板块合并成3个，图片在第1个板块，移动到了第3个下方）
    function changeLayout_5to3(tabs) {
        const stageOperation = document.querySelector("div.z-stage__operation");
        stageOperation.style.display = hiddenTab ? 'none' : ''; // 隐藏工具栏
        if (tabs.length < 5) return;
        const imgDiv = tabs[0].querySelector('div.safe-image.image-item');
        const questionDiv = tabs[2].querySelector('div.text-item');
        const components = document.querySelectorAll('div.item-component');
        if (hiddenTab) {
            const imgDivClone = imgDiv.cloneNode(true);
            imgDivClone.id = 'imgDivClone';
            imgDivClone.style.marginTop = '15px';
            imgDivClone.addEventListener('click', function () { imgDiv.click(); });
            if (!isTabBlock || components[2].querySelector('#imgDivClone')) return;
            // 插入图片
            components[2].insertBefore(imgDivClone, questionDiv.nextSibling);
            tabs[0].style.display = 'none';
            tabs[1].style.display = 'none';
            // 创建新的样式规则来覆盖原有的 .t-col-4 样式
            const style = document.createElement('style');
            style.textContent = `.t-col-6 {flex: 0 0 33.33333333% !important; max-width: 33.33333333% !important;}`;
            document.head.appendChild(style);

            const preLbelExtractionDiv = document.createElement('div');
            preLbelExtractionDiv.id = 'preLbelExtraction';
            preLbelExtractionDiv.textContent = tabs[1].querySelector('div[name="类别"]').textContent;
            components[2].insertBefore(preLbelExtractionDiv, imgDivClone.nextSibling);
        } else {
            // 移除图片
            components[2].querySelector('#imgDivClone')?.remove();
            components[2].querySelector('#preLbelExtraction')?.remove();
            tabs[0].style.display = '';
            tabs[1].style.display = '';
            const styles = document.head.getElementsByTagName('style');
            for (let i = 0; i < styles.length; i++) {
                if (styles[i].textContent.includes(`.t-col-6 {flex: 0 0 33.33333333% !important; max-width: 33.33333333% !important;}`)) {
                    styles[i].parentNode.removeChild(styles[i]);
                    break;
                }
            }
        }
    }

    // 改变页面布局（6个板块合并成2个，图片在第3个板块，移动到了第1个下方）
    function changeLayout_6to2(tabs) {
        if (tabs.length < 6) return;
        const imgDiv = tabs[2].querySelector('div.safe-image.image-item');
        const questionDiv = tabs[0].querySelector('div.text-item');
        const components = document.querySelectorAll('div.item-component');
        if (hiddenTab) {
            const imgDivClone = imgDiv.cloneNode(true);
            imgDivClone.id = 'imgDivClone';
            imgDivClone.style.marginTop = '15px';
            imgDivClone.addEventListener('click', function () { imgDiv.click(); });
            if (!isTabBlock || components[0].querySelector('#imgDivClone')) return;
            // 插入图片
            components[0].insertBefore(imgDivClone, questionDiv.nextSibling);
            tabs[2].style.display = 'none';
            tabs[3].style.display = 'none';
            tabs[4].style.display = 'none';
            tabs[5].style.display = 'none';
            // 创建新的样式规则来覆盖原有的 .t-col-4 样式
            const style = document.createElement('style');
            style.textContent = `.t-col-4 {flex: 0 0 50% !important; max-width: 50% !important;}`;
            document.head.appendChild(style);

            const preLbelExtractionDiv = document.createElement('div');
            preLbelExtractionDiv.id = 'preLbelExtraction';
            preLbelExtractionDiv.textContent = tabs[3].querySelector('div[name="预二级"]').textContent + "-" + tabs[4].querySelector('div[name="预三级"]').textContent + "-" + tabs[5].querySelector('div[name="预标签"]').textContent;
            components[0].insertBefore(preLbelExtractionDiv, imgDivClone.nextSibling);
        } else {
            // 移除图片
            components[0].querySelector('#imgDivClone')?.remove();
            components[0].querySelector('#preLbelExtraction')?.remove();
            tabs[2].style.display = '';
            tabs[3].style.display = '';
            tabs[4].style.display = '';
            tabs[5].style.display = '';
            const styles = document.head.getElementsByTagName('style');
            for (let i = 0; i < styles.length; i++) {
                if (styles[i].textContent.includes('.t-col-4 {flex: 0 0 50% !important; max-width: 50% !important;}')) {
                    styles[i].parentNode.removeChild(styles[i]);
                    break;
                }
            }
        }
    }

    //调整页面布局
    function changePageLayout(tabs) {
        if (tabs.length < 3) return;

        const stageOperation = document.querySelector("div.z-stage__operation");
        if (!stageOperation) return;

        if (hiddenTab) {
            // 检查是否已经存在布局元素
            if (document.getElementById('custom-layout-container')) {
                // 如果元素已存在，只需显示stageOperation
                stageOperation.style.display = 'block';
                // 隐藏原始标签页
                tabs[1].style.display = 'none';
                tabs[2].style.display = 'none';
                return;
            }

            // 清空stageOperation div下的所有元素
            stageOperation.innerHTML = '';

            // 获取问题和答案内容
            const question = tabs[1].querySelector('div[name="问题"]').textContent;
            const answer = tabs[2].querySelector('div[name="答案"]').textContent;

            // 提取最终答案
            const finalAnswer = answer.includes('### 最终答案：') ? answer.split('### 最终答案：')[1].trim()
            : answer.includes('### 最终答案') ? answer.split('### 最终答案')[1].trim()
            : answer.includes('答案：') ? answer.split('答案：')[1].trim()
            : answer.includes('综上，') ? answer.split('综上，')[1].trim()
            : answer;

            // 创建容器 - 使用flex布局实现水平排列
            const container = document.createElement('div');
            container.id = 'custom-layout-container';
            container.style.cssText = 'display: flex; align-items: flex-start; gap: 10px; padding: 0;';

            // 创建问题部分 - 在同一行显示
            const questionContainer = document.createElement('div');
            questionContainer.id = 'custom-question-container';
            questionContainer.style.cssText = 'display: flex; align-items: flex-start; gap: 5px; flex: 1; padding: 0;';
            questionContainer.innerHTML = `
        <div style="font-weight: bold; white-space: nowrap; padding: 0;">问题：</div>
        <div style="padding: 0;">${question}</div>
    `;

            // 创建答案部分 - 在同一行显示
            const answerContainer = document.createElement('div');
            answerContainer.id = 'custom-answer-container';
            answerContainer.style.cssText = 'display: flex; align-items: flex-start; gap: 5px; flex: 1; position: relative; padding: 0;';

            // 创建展开分析按钮
            const expandBtn = document.createElement('span');
            expandBtn.id = 'expand-analysis-btn';
            expandBtn.textContent = '展开分析▽';
            expandBtn.style.cssText = 'color: #1890ff; cursor: pointer; font-size: 12px; margin-right: 5px; white-space: nowrap; padding: 0;';

            // 创建答案内容元素
            const answerContent = document.createElement('span');
            answerContent.id = 'answer-content';
            answerContent.textContent = finalAnswer;
            answerContent.style.padding = '0';

            // 直接绑定点击事件到expandBtn
            expandBtn.onclick = function (e) {
                e.stopPropagation();
                if (expandBtn.textContent == '收起分析△') {
                    console.log("点击++++收起分析△");
                    // 收起时显示最终答案
                    answerContent.textContent = finalAnswer;
                    expandBtn.textContent = '展开分析▽';
                } else {
                    console.log("点击++++展开分析▽");
                    // 展开时显示完整答案
                    answerContent.textContent = answer;
                    expandBtn.textContent = '收起分析△';
                }
            };

            // 组装答案部分
            answerContainer.appendChild(expandBtn);

            const answerLabel = document.createElement('span');
            answerLabel.id = 'answer-label';
            answerLabel.textContent = '答案：';
            answerLabel.style.fontWeight = 'bold';
            answerLabel.style.whiteSpace = 'nowrap';
            answerLabel.style.padding = '0';
            answerContainer.appendChild(answerLabel);

            answerContainer.appendChild(answerContent);

            // 组装元素
            container.appendChild(questionContainer);
            container.appendChild(answerContainer);

            // 添加到stageOperation
            stageOperation.appendChild(container);

            // 显示stageOperation
            stageOperation.style.display = 'block';

            // 隐藏原始标签页
            tabs[1].style.display = 'none';
            tabs[2].style.display = 'none';

        } else {
            // 隐藏stageOperation
            stageOperation.style.display = 'none';

            // 显示原始标签页
            tabs[1].style.display = '';
            tabs[2].style.display = '';

            // 清理自定义布局元素（可选，如果需要完全清理）
            const customContainer = document.getElementById('custom-layout-container');
            if (customContainer) {
                customContainer.remove();
            }
        }
    }

// 合并问题和图片模块
function changeImgAndQuestion(tabs) {
    if (tabs.length < 3) return;
    const imgDiv = tabs[0].querySelector('div.safe-image.image-item');
    const questionDiv = tabs[1].querySelector('div.text-item');
    const components = document.querySelectorAll('div.item-component');
    if (hiddenTab) {
        const imgDivClone = imgDiv.cloneNode(true);
        imgDivClone.id = 'imgDivClone';
        imgDivClone.style.marginTop = '15px';
        imgDivClone.addEventListener('click', function () { imgDiv.click(); });
        if (!isTabBlock || components[1].querySelector('#imgDivClone')) return;
        // 插入图片
        components[1].insertBefore(imgDivClone, questionDiv.nextSibling);
        tabs[0].style.display = 'none';
    } else {
        // 移除图片
        components[1].querySelector('#imgDivClone')?.remove();
        tabs[0].style.display = '';
    }
}

// 输入部分宽度调整
function changeInputWidth(width, height = 'auto') {
    var style = document.createElement('style');
    style.type = 'text/css';
    style.innerHTML = `.horizontal-layout .z-stage__annotation[data-v-3940fca0] {width: ` + width + ` height: ` + height + ` !important;}`;
    document.head.appendChild(style);
}

// 图片宽度调整
function changeImgSize(width, height = 'auto') {
    getElementWithRetry(['img.img[data-v-379830d6]', 'img.img[data-v-92a52416]']).then(res => {
        res.forEach(el => {
            el.style.width = width;
            el.style.height = height;
        });
    });
}

// 粘贴按钮和输入助手
function addPasteButtonsAndText() {
    const inputContainers = document.querySelectorAll('.customLayoutInput');
    const isNeedFlex = inputContainers.length > 3;
    inputContainers.forEach(container => {
        const bar = container.querySelector('.bar');
        const inputDiv = container.querySelector('[contenteditable="true"]'); // 文本框

        if (!bar || !inputDiv || bar.querySelector('.paste-btn')) return;

        const pasteBtn = document.createElement('button');
        pasteBtn.innerHTML = '<span>粘贴</span>';
        pasteBtn.className = 'ivu-btn ivu-btn-success ivu-btn-small paste-btn';
        pasteBtn.style.marginLeft = '8px';
        pasteBtn.addEventListener('click', async (e) => {
            e.preventDefault(); // 阻止跳转/提交行为
            e.stopPropagation(); // 阻止事件冒泡
            try {
                const text = await navigator.clipboard.readText();
                inputDiv.focus();
                const cleanedText = text.replace(/\n{3,}/g, '\n\n');

                // 获取当前选区
                const selection = document.getSelection();
                const range = selection.getRangeAt(0);

                // 删除选区内容并插入新文本
                range.deleteContents();
                const textNode = document.createTextNode(cleanedText);
                range.insertNode(textNode);

                // 创建新范围并设置到文本节点末尾
                const newRange = document.createRange();
                newRange.setStartAfter(textNode);
                newRange.collapse(true); // 折叠范围到开始点

                // 清除所有选区并添加新范围
                selection.removeAllRanges();
                selection.addRange(newRange);

                // 触发输入事件
                const event = new Event('input', { bubbles: true });
                inputDiv.dispatchEvent(event);
                inputDiv.blur();
            } catch (err) {
                alert('无法读取剪贴板内容：' + err.message);
            }
        });
        const fontSizeSelected = bar.querySelector("[class='selected']");
        if(fontSizeSelected) {
            fontSizeSelected.insertBefore(pasteBtn, fontSizeSelected.nextSibling);
        }else {
            bar.appendChild(pasteBtn);
        }

        // 创建并添加清空按钮
        const clearBtn = document.createElement('button');
        clearBtn.id = 'Invalid-reason-Clear-btn';
        clearBtn.textContent = '清空';
        clearBtn.className = 'ivu-btn ivu-btn-clear ivu-btn-small clear-btn';
        clearBtn.style.marginLeft = '8px';
        clearBtn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            inputDiv.textContent = '';
            inputDiv.dispatchEvent(new Event('input', { bubbles: true }));
        });
        pasteBtn.insertAdjacentElement('beforebegin', clearBtn);
        // 添加备注内容
        const parent = container.parentElement; // .ivu-form-item-content
        const label = parent?.previousElementSibling; // 前一个兄弟元素（label）
        let invalidContains = [];
        let isClear = true; // 是否清空输入框
        const noCliearList = []; // 不需要清空输入框的任务
        let isReplaceConnectors = false; // 是否更换连接符
        if (!label || !label.classList.contains('ivu-form-item-label')) {
            return;
        }
        const trimmedText = label.textContent.trim();
        const shortTaskName = getShortTaskName();
        if (trimmedText.includes('标准答案')) {
            invalidContains = getAnswerToolNames(shortTaskName)
            isClear = false;
            isReplaceConnectors = true;
        } else if (trimmedText.includes('备注')) {
            if (noCliearList.includes(shortTaskName)) isClear = false;
            invalidContains = getNoteReasons(shortTaskName, trimmedText);
        } else if (trimmedText.includes('核心答案')) {
            invalidContains = ['【/】'];
        } else {
            return;
        }
        if (invalidContains.length == 0) return;

        // 创建悬浮下拉容器（初始隐藏）
        const textBox = document.createElement('div');
        textBox.className = 'el-card box-card is-always-shadow';
        Object.assign(textBox.style, {
            position: 'absolute', display: 'none', zIndex: '9999',
            minWidth: inputDiv.offsetWidth + 'px', maxHeight: '300px', overflowY: 'auto',
            border: '1px solid #409EFF', borderRadius: '4px',
            backgroundColor: getComputedStyle(document.body).backgroundColor || '#fff'
        });

        const cardBody = document.createElement('div');
        cardBody.className = 'el-card__body';
        Object.assign(cardBody.style, { display: 'flex', flexDirection: 'column' });
        textBox.appendChild(cardBody);

        // 循环生成按钮项
        invalidContains.forEach(text => {
            const line = document.createElement('div');
            line.className = 'text item';
            line.textContent = text;
            Object.assign(line.style, {
                cursor: 'pointer', padding: '6px 10px',
                borderBottom: '1px solid #ebeef5'
            });

            line.onclick = async () => {
                if (isReplaceConnectors) {
                    const currentText = inputDiv.textContent || inputDiv.innerText; let processedText = currentText;
                    if (text === ANSWER_TOOLS.PUBLIC_TOOLS.t1) {
                        processedText = currentText.replace(/[\s*。]+/g, ''); // 所有空格 星号 句号
                    } else if (text === ANSWER_TOOLS.PUBLIC_TOOLS.t2) {
                        processedText = currentText
                            .replace(/“([^“”]*)”/g, '"$1"') // 中文双引号（成对）→ 英文双引号
                            .replace(/‘([^‘’]*)’/g, "'$1'") // 中文单引号（成对）→ 英文单引号
                            .replace(/[“”]/g, '"') // 独立中文双引号 → 英文双引号
                            .replace(/[‘’]/g, "'") // 独立中文单引号 → 英文单引号
                            .replace(/[,，]+/g, ',') // 中文逗号 → 英文逗号
                            .replace(/[:：]+/g, ':') // 中文冒号 → 英文冒号
                            .replace(/[!！]+/g, '!') // 中文感叹号 → 英文感叹号
                            .replace(/[;；]+/g, ';') // 中文分号 → 英文分号
                            .replace(/\s+/g, ' ') // 合并连续空格为单个空格 //.replace(/([,:!;])\s*/g, '$1 ') // 英文标点后强制加一个空格
                            .trim(); // 去除首尾空格
                    } else if (text === ANSWER_TOOLS.PUBLIC_TOOLS.t3) {
                        processedText = currentText
                            .replace(/"([^"]*)"/g, '“$1”') // 英文双引号（成对）→ 中文双引号
                            .replace(/'([^']*)'/g, '‘$1’') // 英文单引号（成对）→ 中文单引号
                            .replace(/"/g, '“') // 独立英文双引号 → 中文左双引号
                            .replace(/'/g, '‘') // 独立英文单引号 → 中文左单引号
                            .replace(/[,，]+/g, '，') // 英文逗号 → 中文逗号
                            .replace(/[:：]+/g, '：') // 英文冒号 → 中文冒号
                            .replace(/[!！]+/g, '！') // 英文感叹号 → 中文感叹号
                            .replace(/[;；]+/g, '；') // 英文分号 → 中文分号
                            .replace(/\s+/g, '') // 去除所有空格（中文排版无需空格）
                            .replace(/([，：！；])\1+/g, '$1'); // 避免重复标点（如"！！"→"！"）
                    } else if (text === ANSWER_TOOLS.TASK_SPECIFIC[shortTaskName].t4) {
                        processedText = currentText
                            .replace(/-+>?|→+/g, '#') // 匹配一个或多个 "-" 加可选的 ">" 或一个或多个 "→"
                            .replace(/，+|,+/g, '#') // 匹配一个或多个中文逗号或英文逗号
                            .replace(/、+|\/+/g, '#') // 匹配一个或多个顿号或斜杠
                            .replace(/(?<!和)和(?!和)/g, '#') // 替换单独的“和”
                            .replace(/和+/g, match => '#' + match.slice(1)) // 替换连续“和”的第一个
                            .replace(/#+/g, '#') // 合并连续的 "#"
                            .replace(/\s+/g, ' ') // 合并连续空格为单个空格
                            .trim(); // 去除首尾空格
                    }
                    inputDiv.textContent = processedText; inputDiv.dispatchEvent(new Event('input', { bubbles: true })); inputDiv.blur();
                } else {
                    try {
                        const original = await navigator.clipboard.readText();
                        await navigator.clipboard.writeText(text); if (isClear) clearBtn.click(); pasteBtn.click();
                        setTimeout(async () => await navigator.clipboard.writeText(original), 100);
                    } catch (e) {
                        console.error('操作剪贴板失败:', e);
                        await navigator.clipboard.writeText(text); if (isClear) clearBtn.click(); pasteBtn.click();
                    }
                }
                textBox.style.display = 'none';
            };

            line.onmouseover = function () { this.style.backgroundColor = '#f5f7fa'; };
            line.onmouseout = function () { this.style.backgroundColor = ''; };
            cardBody.appendChild(line);
        });

        // 插入到页面（body下，悬浮定位）
        document.body.appendChild(textBox);
        // 创建箭头按钮（放在输入框右侧外部）
        const arrowBtn = document.createElement('span');
        arrowBtn.textContent = '辛辣填sei ☢™';
        arrowBtn.style.cssText = "cursor:pointer;user-select:none;margin-left:0px;font-size:14px;display:inline-block;width:100px;text-align:center;";
        inputDiv.insertAdjacentElement('afterend', arrowBtn); // 插入到输入框后面

        // 点击箭头显示下拉框
        arrowBtn.addEventListener('click', () => {
            const rect = inputDiv.getBoundingClientRect(),
                  below = window.innerHeight - rect.bottom,
                  above = rect.top;
            textBox.style.minWidth = rect.width + 'px';
            textBox.style.top = (below < 200 && above > below
                                 ? rect.top + window.scrollY - textBox.offsetHeight
                                 : rect.bottom + window.scrollY) + 'px';
            textBox.style.left = rect.left + window.scrollX + 'px';
            textBox.style.display = 'block';
        });

        // 鼠标移开时隐藏（除非停留在下拉框）
        [arrowBtn, textBox].forEach(el => el.addEventListener('mouseleave', () => {
            setTimeout(() => {
                if (!textBox.matches(':hover') && !arrowBtn.matches(':hover')) {
                    textBox.style.display = 'none';
                }
            }, 150);
        }));
    });
}

// 高亮选中内容
let lastHighlightClass = 'tm-highlighted-text';
function removeHighlights() {
    document.querySelectorAll('.' + lastHighlightClass).forEach(el => {
        const parent = el.parentNode;
        parent.replaceChild(document.createTextNode(el.textContent), el);
        parent.normalize(); // 合并相邻文本节点
    });
}
function highlightText(text) {
    if (!text || text.trim().length < 2) return;
    const regex = new RegExp(text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g');

    // 获取当前选中的范围
    const selection = window.getSelection();
    const selectedNode = selection.anchorNode; // 获取选区起点所在的节点

    const treeWalker = document.createTreeWalker(
        document.body,
        NodeFilter.SHOW_TEXT,
        {
            acceptNode: function (node) {
                // 过滤掉脚本、样式、隐藏元素、表单控件等
                const parent = node.parentNode;
                if (!parent || !parent.offsetParent) return NodeFilter.FILTER_REJECT;
                const tag = parent.nodeName.toLowerCase();
                if (['script', 'style', 'textarea', 'input', 'button', 'select'].includes(tag)) return NodeFilter.FILTER_REJECT;
                // 如果是当前选中的文本节点，则跳过
                if (node === selectedNode) return NodeFilter.FILTER_REJECT;
                return NodeFilter.FILTER_ACCEPT;
            }
        },
        false
    );
    let node;
    while (node = treeWalker.nextNode()) {
        const matches = [...node.textContent.matchAll(regex)];
        if (matches.length === 0) continue;

        let currentNode = node;
        matches.reverse().forEach(match => {
            const start = match.index;
            const end = start + match[0].length;
            const before = currentNode.textContent.slice(0, start);
            const matched = currentNode.textContent.slice(start, end);
            const after = currentNode.textContent.slice(end);
            const span = document.createElement('span');
            span.textContent = matched;
            span.className = lastHighlightClass;
            span.style.backgroundColor = 'blue';
            span.style.color = 'black';
            const afterNode = document.createTextNode(after);
            const matchedNode = span;
            const beforeNode = document.createTextNode(before);
            const parent = currentNode.parentNode;
            parent.insertBefore(afterNode, currentNode.nextSibling);
            parent.insertBefore(matchedNode, afterNode);
            parent.insertBefore(beforeNode, matchedNode);
            parent.removeChild(currentNode);
            currentNode = beforeNode;
        });
    }
}
document.addEventListener('mouseup', () => {
    setTimeout(() => {
        const selection = window.getSelection();
        const selectedText = selection.toString().trim();
        removeHighlights();
        if (selectedText.length >= 2) {
            highlightText(selectedText);
        }
    }, 10); // 延迟以确保 selection 获取正确
});

// 标记无效小助手
function toolsOfInvalidTag() {
    const allForms = document.querySelectorAll('form.ivu-form.ivu-form-label-top')
    var invalidForm = null;
    allForms.forEach((form) => {
        // 检查是否是“无效原因”表单
        const label = form.querySelector('.ivu-form-item-label');
        if (label?.textContent.trim() === '无效原因') {
            invalidForm = form;
            return;
        }
    });
    if (!invalidForm || document.querySelector('#Invalid-reason-Paste-btn')) return; // 不是无效原因表单或者已经添加按钮
    // 创建并添加粘贴按钮
    const inputDiv = invalidForm.querySelector('.customInput'); // 定位到输入框
    if (!inputDiv) return;
    const pasteBtn = document.createElement('button');
    pasteBtn.id = 'Invalid-reason-Paste-btn';
    pasteBtn.textContent = '粘贴';
    pasteBtn.className = 'ivu-btn ivu-btn-success ivu-btn-small paste-btn';
    pasteBtn.style.marginLeft = '8px';
    pasteBtn.addEventListener('click', async (e) => {
        e.preventDefault(); // 阻止跳转/提交行为
        e.stopPropagation(); // 阻止事件冒泡
        try {
            const text = await navigator.clipboard.readText();
            inputDiv.focus();
            const cleanedText = text.replace(/\n{3,}/g, '\n\n');

            // 获取当前选区
            const selection = document.getSelection();
            const range = selection.getRangeAt(0);

            // 删除选区内容并插入新文本
            range.deleteContents();
            const textNode = document.createTextNode(cleanedText);
            range.insertNode(textNode);

            // 创建新范围并设置到文本节点末尾
            const newRange = document.createRange();
            newRange.setStartAfter(textNode);
            newRange.collapse(true); // 折叠范围到开始点

            // 清除所有选区并添加新范围
            selection.removeAllRanges();
            selection.addRange(newRange);

            // 触发输入事件
            const event = new Event('input', { bubbles: true });
            inputDiv.dispatchEvent(event);
        } catch (err) {
            alert('无法读取剪贴板内容：' + err.message);
        }
    });
    inputDiv.insertAdjacentElement('afterend', pasteBtn);
    // 创建并添加清空按钮
    const clearBtn = document.createElement('button');
    clearBtn.id = 'Invalid-reason-Clear-btn';
    clearBtn.textContent = '清空';
    clearBtn.className = 'ivu-btn ivu-btn-clear ivu-btn-small clear-btn';
    clearBtn.style.marginLeft = '385px'; // 调整左边距
    clearBtn.onmouseout = pasteBtn.onmouseout;
    clearBtn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        inputDiv.textContent = '';
        inputDiv.dispatchEvent(new Event('input', { bubbles: true }));
    });
    pasteBtn.insertAdjacentElement('beforebegin', clearBtn);
    // 在粘贴按钮后添加文本展示框
    const textBox = document.createElement('div');
    textBox.className = 'el-card box-card is-always-shadow';
    textBox.style.margin = '4px 20px 0px 20px';
    const cardBody = document.createElement('div');
    cardBody.className = 'el-card__body';
    cardBody.style.display = 'flex'; // 添加flex布局样式，允许换行并设置两列
    cardBody.style.flexWrap = 'wrap';
    cardBody.style.gap = '3px'; // 项与项之间的间距
    textBox.appendChild(cardBody);
    const invalidReasons = getInvalidReasons(getShortTaskName());
    invalidReasons.forEach(text => {
        const line = document.createElement('div');
        line.className = 'text item';
        const maxChars = 12; // 只显示前12个字
        line.textContent = text.length > maxChars ? text.substring(0, maxChars) + "..." : text;
        line.title = text; // 鼠标悬停时显示完整文本
        line.style.cssText = 'cursor: pointer; flex: 1 1 calc(50% - 1.5px); min-width: calc(50% - 1.5px); box-sizing: border-box; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;';
        line.onmouseover = function () { this.style.boxShadow = '0 0 2px #DBDBDB'; this.style.backgroundColor = '#C4C4C4'; };
        line.onmouseout = function () { this.style.boxShadow = 'none'; this.style.backgroundColor = ''; };
        //line.onclick = () => {navigator.clipboard.writeText(text);clearBtn.click();pasteBtn.click();};
        line.onclick = async () => {
            try {
                // 1. 首先保存当前的剪贴板内容
                const originalClipboardContent = await navigator.clipboard.readText();

                // 2. 执行你的操作 - 写入新文本并点击按钮
                await navigator.clipboard.writeText(text);
                clearBtn.click();
                pasteBtn.click();

                // 3. 恢复原始的剪贴板内容
                // 添加一个小延迟确保前面的操作完成
                setTimeout(async () => {
                    await navigator.clipboard.writeText(originalClipboardContent);
                }, 100);

            } catch (error) {
                console.error('操作剪贴板失败:', error);
                // 如果出错，仍然执行主要操作但不恢复剪贴板
                await navigator.clipboard.writeText(text);
                clearBtn.click();
                pasteBtn.click();
            }
        };
        cardBody.appendChild(line);
    });
    pasteBtn.insertAdjacentElement('afterend', textBox);
}

//修改元素字体大小
function setAllFontSizes(element, size) {
    // 设置当前元素的字体大小
    element.style.fontSize = size;
    // 递归处理所有子元素
    for (let child of element.children) {
        setAllFontSizes(child, size);
    }
}

// 睡眠
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
// 去抖动
function debounce(func, delay) {
    let timeoutId;
    return function () {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => func.apply(this, arguments), delay);
    };
}
// 获取元素
function getElementWithRetry(selectors, root = document, retries = 3) {
    return new Promise(resolve => {
        let attempts = 0;
        const selectorList = Array.isArray(selectors) ? selectors : [selectors];
        const rootElement = root || document;
        (function tryGetElement() {
            for (const selector of selectorList) {
                const elements = Array.from(rootElement.querySelectorAll(selector));
                if (elements.length) return resolve(elements);
            }
            if (++attempts < retries) {
                setTimeout(tryGetElement, Math.floor(Math.random() * 71) + 30);
            } else {
                resolve([]);
            }
        })();
    });
}

wrapper.appendChild(btnQuickSelection);
wrapper.appendChild(btnPreImg);
wrapper.appendChild(btnTab);
wrapper.appendChild(btnImg);
wrapper.appendChild(btnTop);
wrapper.appendChild(btnSkip);
wrapper.appendChild(btnCheckmarks);
document.body.appendChild(wrapper);

// 监听页面变化自动同步
const observer = new MutationObserver(debounce(() => {
    syncState();
}, 65));
observer.observe(document.body, { childList: true, subtree: true });
// 同步状态
function syncState() {
    applyTabVisibility();
    applyTopVisibility();
    applyImageVisibility();
    addPasteButtonsAndText();
    toolsOfInvalidTag();
    moveSkipButton();
    removeCheckmarks();
    addHelpBtn();
    setTimeout(setPartialVisible, 100);
}
syncState();
})();