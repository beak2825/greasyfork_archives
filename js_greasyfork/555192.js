// ==UserScript==
// @name         超星学习通期末周复习小助手
// @namespace    http://tampermonkey.net/
// @version      3.9.1.5
// @description  这是一款面向学习场景的脚本工具，其集成了支持提示词定制的智能 AI 助手模块，通过 Web 自动化技术实现跨域提问（区别于传统模型 API 调用或题库检索方式）；同时提供答案动态显隐控制功能，适配多轮刷题需求；内置错题星级标记系统，基于错误频次实现重点内容优先级管理；搭载本地持久化存储的富文本笔记组件，支持知识点与解析的实时记录与安全留存；具备可配置化作业题目导出能力，支持得分、答案、解析等字段的自定义筛选，可快速生成结构化刷题集或背题手册；此外，工具还提供可视化控制面板作为配置入口，支持对上述全功能模块的参数与逻辑进行深度个性化定制，为高效学习与复习流程提供技术支撑。
// @author       YJohn
// @match        https://*.chaoxing.com/mooc-ans/mooc2/work/view*
// @match        https://www.doubao.com/chat/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=chaoxing.com
// @grant        GM_xmlhttpRequest
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_deleteValue
// @grant        GM_openInTab
// @connect      p.ananas.chaoxing.com
// @connect      chaoxing.com
// @connect      *.chaoxing.com
// @connect      doubao.com
// @connect      *.doubao.com
// @connect      *
// @require      https://cdn.jsdelivr.net/npm/html-docx-js@0.3.1/dist/html-docx.min.js
// @run-at       document-end
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/555192/%E8%B6%85%E6%98%9F%E5%AD%A6%E4%B9%A0%E9%80%9A%E6%9C%9F%E6%9C%AB%E5%91%A8%E5%A4%8D%E4%B9%A0%E5%B0%8F%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/555192/%E8%B6%85%E6%98%9F%E5%AD%A6%E4%B9%A0%E9%80%9A%E6%9C%9F%E6%9C%AB%E5%91%A8%E5%A4%8D%E4%B9%A0%E5%B0%8F%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // ===================== 配置管理模块 =====================
    class Config {
        static DEFAULT = {
            // ========== DOM 选择器配置 ==========
            selectors: {
                answerBlock: 'div.mark_answer',    // 答案块的选择器
                container: 'div.topicNumber',      // 题目容器的选择器
                questionItem: 'div.mark_item',     // 题目项的选择器
                sidePanel: 'div.fanyaMarking_right' // 侧边栏容器的选择器
            },

            // ========== 延迟配置 ==========
            delays: {
                initialization: 800  // 脚本初始化延迟时间（毫秒），确保页面加载完成
            },

            // ========== 复制题目按钮配置 ==========
            copyButton: {
                // --- 按钮位置配置（绝对定位到题目右上角） ---
                position: {
                    top: '0px',              // 距离顶部
                    right: '0px'             // 距离右侧
                },
                // --- 按钮样式配置 ---
                style: {
                    fontSize: '12px',        // 字体大小
                    padding: '4px 10px',     // 内边距
                    borderRadius: '6px',     // 圆角半径
                    border: 'none',          // 边框样式
                    fontWeight: '500',       // 字体粗细
                    cursor: 'pointer',       // 鼠标样式
                    transition: 'all 0.2s',  // 过渡动画
                    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',  // 阴影效果
                    minWidth: '70px',        // 最小宽度（确保"已复制"不会撑开其他按钮）
                    textAlign: 'center'      // 文字居中
                },
                // --- 按钮颜色配置 ---
                colors: {
                    background: '#718096',       // 按钮背景色（灰色）
                    hoverBackground: '#4a5568',  // 悬停背景色
                    successBackground: '#48bb78', // 复制成功背景色（绿色）
                    textColor: 'white',          // 按钮文字颜色
                    hoverOpacity: '0.8'          // 鼠标悬停时的透明度
                },
                // --- 按钮文字配置 ---
                text: {
                    copy: '复制题目',     // 复制按钮文字
                    copied: '已复制'     // 复制成功文字
                }
            },

            // ========== 问豆包AI按钮配置 ==========
            askDoubaoButton: {
                // --- 按钮位置配置（绝对定位到复制按钮下方5px） ---
                position: {
                    top: '31px',             // 距离顶部（复制按钮26px + 5px间距）
                    right: '0px'             // 距离右侧
                },
                // --- 按钮样式配置 ---
                style: {
                    fontSize: '12px',        // 字体大小
                    padding: '4px 10px',     // 内边距
                    borderRadius: '6px',     // 圆角半径
                    border: 'none',          // 边框样式
                    fontWeight: '500',       // 字体粗细
                    cursor: 'pointer',       // 鼠标样式
                    transition: 'all 0.2s',  // 过渡动画
                    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',  // 阴影效果
                    minWidth: '70px',        // 最小宽度
                    textAlign: 'center'      // 文字居中
                },
                // --- 按钮颜色配置 ---
                colors: {
                    background: '#667eea',       // 按钮背景色（紫色/豆包品牌色）
                    hoverBackground: '#5a67d8',  // 悬停背景色
                    textColor: 'white',          // 按钮文字颜色
                    hoverOpacity: '0.8'          // 鼠标悬停时的透明度
                },
                // --- 按钮文字配置 ---
                text: {
                    ask: '🤖 问豆包'     // 问豆包按钮文字
                },
                // --- 豆包AI配置 ---
                doubaoUrl: 'https://www.doubao.com/chat/',  // 豆包AI网址
                storageKey: 'chaoxing_doubao_question'      // GM存储键名
            },

            // ========== 单个答案控制按钮配置 ==========
            answerButton: {
                // --- 按钮位置配置 ---
                position: {
                    marginLeft: '10px',      // 按钮左外边距
                    marginRight: '0px',      // 按钮右外边距
                    marginTop: '10px',       // 按钮上外边距
                    marginBottom: '0px',     // 按钮下外边距
                    verticalAlign: 'middle'  // 垂直对齐方式（top/middle/bottom）
                },
                // --- 按钮样式配置 ---
                style: {
                    fontSize: '12px',        // 字体大小
                    padding: '4px 10px',     // 内边距（上下 左右）- 缩小尺寸
                    borderRadius: '6px',     // 圆角半径
                    border: 'none',          // 边框样式
                    fontWeight: '500',       // 字体粗细（normal/bold/100-900）
                    cursor: 'pointer',       // 鼠标样式
                    transition: 'all 0.2s',  // 过渡动画
                    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'  // 阴影效果
                },
                // --- 按钮颜色配置 ---
                colors: {
                    showBackground: '#4299e1',     // "显示答案"按钮背景色（蓝色）
                    hideBackground: '#9f7aea',     // "隐藏答案"按钮背景色（紫色）
                    showHoverBackground: '#3182ce', // "显示答案"悬停背景色
                    hideHoverBackground: '#805ad5', // "隐藏答案"悬停背景色
                    textColor: 'white',            // 按钮文字颜色
                    hoverOpacity: '0.8'            // 鼠标悬停时的透明度
                },
                // --- 按钮文字配置 ---
                text: {
                    show: '显示答案',   // "显示答案"按钮文字
                    hide: '隐藏答案'    // "隐藏答案"按钮文字
                }
            },

            // ========== 笔记控制按钮配置 ==========
            noteButton: {
                // --- 按钮位置配置 ---
                position: {
                    marginLeft: '5px',       // 按钮左外边距（与答案按钮的间距）
                    marginRight: '0px',      // 按钮右外边距
                    marginTop: '10px',        // 按钮上外边距
                    marginBottom: '0px',     // 按钮下外边距
                    verticalAlign: 'middle'  // 垂直对齐方式
                },
                // --- 按钮样式配置 ---
                style: {
                    fontSize: '12px',        // 字体大小
                    padding: '4px 10px',     // 内边距（上下 左右）- 缩小尺寸
                    borderRadius: '6px',     // 圆角半径
                    border: 'none',          // 边框样式
                    fontWeight: '500',       // 字体粗细
                    cursor: 'pointer',       // 鼠标样式
                    transition: 'all 0.2s',  // 过渡动画
                    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'  // 阴影效果
                },
                // --- 按钮颜色配置 ---
                colors: {
                    showBackground: '#48bb78',     // "显示笔记"按钮背景色（绿色）
                    hideBackground: '#9f7aea',     // "隐藏笔记"按钮背景色（紫色）
                    showHoverBackground: '#38a169', // "显示笔记"悬停背景色
                    hideHoverBackground: '#805ad5', // "隐藏笔记"悬停背景色
                    textColor: 'white',            // 按钮文字颜色
                    hoverOpacity: '0.8'            // 鼠标悬停时的透明度
                },
                // --- 按钮文字配置 ---
                text: {
                    show: '显示笔记',   // "显示笔记"按钮文字
                    hide: '隐藏笔记'    // "隐藏笔记"按钮文字
                }
            },

            // ========== 保存笔记按钮配置 ==========
            saveNoteButton: {
                // --- 按钮位置配置 ---
                position: {
                    marginLeft: '5px',       // 按钮左外边距（与笔记按钮的间距）
                    marginRight: '0px',      // 按钮右外边距
                    marginTop: '10px',        // 按钮上外边距
                    marginBottom: '0px',     // 按钮下外边距
                    verticalAlign: 'middle'  // 垂直对齐方式
                },
                // --- 按钮样式配置 ---
                style: {
                    fontSize: '12px',        // 字体大小
                    padding: '4px 10px',     // 内边距（上下 左右）- 缩小尺寸
                    borderRadius: '6px',     // 圆角半径
                    border: 'none',          // 边框样式
                    fontWeight: '500',       // 字体粗细
                    cursor: 'pointer',       // 鼠标样式
                    transition: 'all 0.2s',  // 过渡动画
                    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',  // 阴影效果
                    minWidth: '75px',        // 最小宽度（确保文字变化不会撑开按钮）
                    textAlign: 'center'      // 文字居中
                },
                // --- 按钮颜色配置 ---
                colors: {
                    background: '#38b2ac',   // 按钮背景色（青色）
                    textColor: 'white',      // 按钮文字颜色
                    hoverBackground: '#319795', // 悬停时背景色
                    successBackground: '#48bb78', // 保存成功背景色（绿色）
                    hoverOpacity: '0.8'      // 鼠标悬停时的透明度
                },
                // --- 按钮文字配置 ---
                text: {
                    save: '💾 保存',        // 保存按钮文字
                    saved: '✅ 已保存'     // 保存成功文字
                }
            },

            // ========== 错题记录按钮配置 ==========
            mistakeButton: {
                // --- 按钮位置配置（相对定位，插入到mark_name上方） ---
                position: {
                    marginTop: '8px',        // 上边距
                    marginBottom: '0.1px',     // 与星星或题目间距
                    marginLeft: '0px',       // 左边距
                    display: 'block'         // 块级元素
                },
                // --- 按钮样式配置 ---
                style: {
                    fontSize: '12px',        // 字体大小
                    padding: '4px 10px',     // 内边距
                    borderRadius: '6px',     // 圆角半径
                    border: 'none',          // 边框样式
                    fontWeight: '500',       // 字体粗细
                    cursor: 'pointer',       // 鼠标样式
                    transition: 'all 0.2s',  // 过渡动画
                    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'  // 阴影效果
                },
                // --- 按钮颜色配置 ---
                colors: {
                    background: '#f56565',   // 按钮背景色（红色）
                    textColor: 'white',      // 按钮文字颜色
                    hoverBackground: '#e53e3e', // 悬停时背景色
                    hoverOpacity: '0.8'      // 鼠标悬停时的透明度
                },
                // --- 按钮文字配置 ---
                text: {
                    add: '错题+1'           // 按钮文字
                },
                // --- 星星显示配置 ---
                stars: {
                    emoji: '⭐',             // 星星表情
                    perRow: 5,               // 每行显示的星星数量
                    marginTop: '1px',        // 星星容器上边距（与按钮间距）
                    marginBottom: '0.1px',     // 星星容器下边距（与题目间距）
                    fontSize: '16px',        // 星星大小
                    gap: '0.1px'               // 星星之间的间距
                }
            },

            // ========== 编辑模式切换按钮配置 ==========
            editModeButton: {
                // --- 按钮位置配置 ---
                position: {
                    marginLeft: '5px',       // 按钮左外边距（与笔记按钮的间距）
                    marginRight: '0px',      // 按钮右外边距
                    marginTop: '10px',       // 按钮上外边距
                    marginBottom: '0px',     // 按钮下外边距
                    verticalAlign: 'middle'  // 垂直对齐方式
                },
                // --- 按钮样式配置 ---
                style: {
                    fontSize: '12px',        // 字体大小
                    padding: '4px 10px',     // 内边距（上下 左右）- 缩小尺寸
                    borderRadius: '6px',     // 圆角半径
                    border: 'none',          // 边框样式
                    fontWeight: '500',       // 字体粗细
                    cursor: 'pointer',       // 鼠标样式
                    transition: 'all 0.2s',  // 过渡动画
                    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'  // 阴影效果
                },
                // --- 按钮颜色配置 ---
                colors: {
                    editBackground: '#48bb78',   // 编辑模式按钮背景色（绿色）
                    previewBackground: '#ed8936', // 预览模式按钮背景色（橙色）
                    editHoverBackground: '#38a169', // 编辑模式悬停背景色
                    previewHoverBackground: '#dd6b20', // 预览模式悬停背景色
                    textColor: 'white',          // 按钮文字颜色
                    hoverOpacity: '0.8'          // 鼠标悬停时的透明度
                },
                // --- 按钮文字配置 ---
                text: {
                    edit: '编辑',      // 编辑模式按钮文字
                    preview: '预览'   // 预览模式按钮文字
                }
            },

            // ========== 全局控制按钮配置 ==========
            globalButton: {
                // --- 按钮位置配置 ---
                position: {
                    top: '8px',              // 距离容器顶部的距离（在最上方）
                    right: '8px',            // 距离容器右侧的距离
                    zIndex: '9999'           // 层级（确保在最上层）
                },
                // --- 按钮样式配置 ---
                style: {
                    fontSize: '13px',        // 字体大小
                    padding: '6px 12px',     // 内边距
                    borderRadius: '6px',     // 圆角半径
                    border: 'none',          // 边框样式
                    fontWeight: '500',       // 字体粗细
                    cursor: 'pointer',       // 鼠标样式
                    transition: 'all 0.2s',  // 过渡动画
                    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'  // 阴影效果
                },
                // --- 按钮颜色配置 ---
                colors: {
                    showAllBackground: '#4299e1',  // "显示全部答案"按钮背景色（蓝色）
                    hideAllBackground: '#9f7aea',  // "隐藏全部答案"按钮背景色（紫色）
                    showAllHoverBackground: '#3182ce', // "显示全部答案"悬停背景色
                    hideAllHoverBackground: '#805ad5', // "隐藏全部答案"悬停背景色
                    textColor: 'white',            // 按钮文字颜色
                    hoverOpacity: '0.8'            // 鼠标悬停时的透明度
                },
                // --- 按钮文字配置 ---
                text: {
                    showAll: '显示全部答案',   // "显示全部答案"按钮文字
                    hideAll: '隐藏全部答案'    // "隐藏全部答案"按钮文字
                }
            },

            // ========== 笔记编辑器配置 ==========
            noteEditor: {
                placeholder: '在这里记录你的笔记...',  // 编辑器占位符文字
                width: '114.5%',                          // 编辑器宽度
                minHeight: '60px',                      // 编辑器最小高度
                maxHeight: '400px',                     // 编辑器最大高度（超出滚动）
                fontSize: '14px',                       // 编辑器字体大小
                padding: '10px',                        // 编辑器内边距
                marginTop: '10px',                      // 编辑器上外边距
                marginBottom: '10px',                   // 编辑器下外边距
                borderRadius: '4px',                    // 编辑器圆角半径
                borderWidth: '1px',                     // 编辑器边框宽度
                borderStyle: 'solid',                   // 编辑器边框样式
                borderColor: '#cbd5e0',                 // 编辑器边框颜色（默认）
                focusBorderColor: '#4299e1',            // 编辑器获得焦点时的边框颜色
                backgroundColor: '#f7fafc',             // 编辑器背景颜色
                textColor: '#2d3748',                   // 编辑器文字颜色
                fontFamily: 'inherit',                  // 编辑器字体（继承父元素）
                resize: 'vertical'                      // 调整大小方式（none/vertical/horizontal/both）
            },

            // ========== 用户设置默认值 ==========
            settings: {
                autoSave: false,                        // 是否开启自动保存（默认关闭）
                autoSaveDelay: 5000,                    // 自动保存延迟时间（毫秒）
                copyPrefix: '',                         // 复制内容前缀（默认无）
                copySuffix: '',                         // 复制内容后缀（默认无）
                aiPromptPrefix: '',                     // AI提问前缀提示词（默认无）
                aiPromptSuffix: '',                     // AI提问后缀提示词（默认无）
                aiChatId: ''                            // 豆包会话ID（默认无，留空则每次新建）
            },

            // ========== 控制面板按钮配置 ==========
            manageButton: {
                // --- 按钮位置配置 ---
                position: {
                    top: '42px',             // 距离容器顶部的距离（在全局按钮下方）
                    right: '8px',            // 距离容器右侧的距离
                    zIndex: '9999'           // 层级（确保在最上层）
                },
                // --- 按钮样式配置 ---
                style: {
                    fontSize: '13px',        // 字体大小
                    padding: '6px 12px',     // 内边距
                    borderRadius: '6px',     // 圆角半径
                    border: 'none',          // 边框样式
                    fontWeight: '500',       // 字体粗细
                    cursor: 'pointer',       // 鼠标样式
                    transition: 'all 0.2s',  // 过渡动画
                    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'  // 阴影效果
                },
                // --- 按钮颜色配置 ---
                colors: {
                    background: '#ed8936',   // 按钮背景色（橙色）
                    hoverBackground: '#dd6b20', // 悬停背景色
                    textColor: 'white',      // 按钮文字颜色
                    hoverOpacity: '0.8'      // 鼠标悬停时的透明度
                },
                // --- 按钮文字配置 ---
                text: '控制面板'    // 控制面板按钮文字
            },

            // ========== 导出试题按钮配置 ==========
            exportButton: {
                // --- 按钮样式配置 ---
                style: {
                    fontSize: '13px',        // 字体大小
                    padding: '6px 12px',     // 内边距
                    borderRadius: '6px',     // 圆角半径
                    border: 'none',          // 边框样式
                    fontWeight: '500',       // 字体粗细
                    cursor: 'pointer',       // 鼠标样式
                    transition: 'all 0.2s',  // 过渡动画
                    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'  // 阴影效果
                },
                // --- 按钮颜色配置 ---
                colors: {
                    background: '#38b2ac',   // 按钮背景色（青色）
                    hoverBackground: '#319795', // 悬停背景色
                    textColor: 'white',      // 按钮文字颜色
                    hoverOpacity: '0.8',     // 鼠标悬停时的透明度
                    // 带答案导出按钮颜色
                    withAnswerBackground: '#805ad5',  // 紫色
                    withAnswerHoverBackground: '#6b46c1'
                },
                // --- 按钮文字配置 ---
                text: '📄 导出试题（无答案）',           // 导出按钮文字（不带答案）
                textWithAnswer: '📝 导出试题（含答案）'   // 导出按钮文字（带答案）
            },

            // ========== 控制面板保存按钮配置 ==========
            panelSaveButton: {
                // --- 按钮样式配置 ---
                style: {
                    padding: '10px 24px',       // 内边距（上下 左右）
                    borderRadius: '6px',        // 圆角半径
                    border: 'none',             // 边框样式
                    fontSize: '14px',           // 字体大小
                    fontWeight: '600',          // 字体粗细
                    cursor: 'pointer',          // 鼠标样式
                    transition: 'all 0.2s'      // 过渡动画
                },
                // --- 按钮颜色配置 ---
                colors: {
                    background: '#4299e1',          // 按钮背景色（蓝色）
                    hoverBackground: '#3182ce',     // 悬停时背景色
                    textColor: 'white',             // 按钮文字颜色
                    successBackground: '#48bb78',   // 保存成功背景色（绿色）
                    errorBackground: '#f56565',     // 保存失败背景色（红色）
                    boxShadow: '0 2px 4px rgba(66, 153, 225, 0.3)',           // 默认阴影
                    hoverBoxShadow: '0 4px 6px rgba(66, 153, 225, 0.4)'       // 悬停阴影
                },
                // --- 按钮文字配置 ---
                text: {
                    save: '💾 保存设置',      // 默认文字
                    success: '✅ 保存成功',   // 保存成功文字
                    error: '❌ 保存失败'      // 保存失败文字
                }
            },

            // ========== 导出设置配置 ==========
            exportSettings: {
                // 注意：includeAnswer 已由导出按钮控制，不再从此配置读取
                exportFormat: 'doc',         // 导出格式：'doc' 或 'docx'（默认doc，兼容性更好）
                fontFamily: '宋体',          // 字体
                fontSize: 12,                // 字号（pt）
                titleFontSize: 18,           // 标题字号（pt）
                lineHeight: 1.8,             // 行高
                pageMargin: '2.5cm 2cm 2cm 2cm',  // 页边距
                // 导出内容选项
                exportMyAnswer: true,        // 导出"我的答案"
                exportCorrectAnswer: true,   // 导出"正确答案"
                exportScore: true,           // 导出"本题得分"
                exportAnalysis: true         // 导出"答案解析"
            },

            // ========== 数据库配置 ==========
            database: {
                name: 'ChaoxingNotesDB',     // IndexedDB 数据库名称
                version: 4,                   // 数据库版本号（v4：添加错题记录存储）
                stores: {
                    notes: 'notes',           // 笔记存储名称
                    attachments: 'attachments', // 附件存储名称
                    settings: 'settings',      // 用户设置存储名称
                    mistakes: 'mistakes'       // 错题记录存储名称
                }
            },

            // ========== 提示消息配置 ==========
            messages: {
                noAnswerBlocks: 'ℹ️ 未找到答案块（可能页面未完全加载，可刷新重试）',
                noContainer: 'ℹ️ 未找到容器模块，仅启用单个答案块控制功能',
                success: '✅ 超星学习通高效刷题小助手启动成功！',
                hiddenCount: (count) => `- 已为 ${count} 个题目添加答案控制按钮，可自由控制显示/隐藏`,
                globalButton: (hasContainer) => `- ${hasContainer ? '已在右上角添加全局控制按钮' : '未找到容器模块，未添加全局按钮'}`,
                noteSaved: '💾 笔记已自动保存',
                noteLoadError: '⚠️ 加载笔记失败'
            }
        };

        constructor(customConfig = {}) {
            this.config = this._deepMerge(Config.DEFAULT, customConfig);
        }

        get(path) {
            return path.split('.').reduce((obj, key) => obj?.[key], this.config);
        }

        _deepMerge(target, source) {
            const result = { ...target };
            for (const key in source) {
                // 排除函数和数组，只对普通对象进行深度合并
                if (source[key] instanceof Object &&
                    !(source[key] instanceof Function) &&
                    !Array.isArray(source[key]) &&
                    key in target &&
                    target[key] instanceof Object &&
                    !(target[key] instanceof Function) &&
                    !Array.isArray(target[key])) {
                    result[key] = this._deepMerge(target[key], source[key]);
                } else {
                    result[key] = source[key];
                }
            }
            return result;
        }
    }

    // ===================== 日志管理模块 =====================
    class Logger {
        static log(message, type = 'info') {
            const prefix = type === 'error' ? '❌' : type === 'warn' ? '⚠️' : 'ℹ️';
            console.log(`${prefix} ${message}`);
        }

        static success(message) {
            console.log(`✅ ${message}`);
        }

        static error(message, error) {
            console.error(`❌ ${message}`, error);
        }
    }

    // ===================== URL 解析器 =====================
    class URLParser {
        static parseWorkInfo() {
            const url = new URL(window.location.href);
            return {
                courseId: url.searchParams.get('courseId') || '',
                classId: url.searchParams.get('classId') || '',
                workId: url.searchParams.get('workId') || ''
            };
        }

        static getWorkKey() {
            const { courseId, classId, workId } = this.parseWorkInfo();
            return `${courseId}_${classId}_${workId}`;
        }

        /**
         * 解析题号（从题目标题中提取）
         * @param {HTMLElement} questionContainer - 题目容器元素
         * @returns {string} 题号（如"24"），解析失败返回"999"
         */
        static parseQuestionNumber(questionContainer) {
            try {
                const markName = questionContainer.querySelector('.mark_name');
                if (!markName) return '999';
                
                // 获取第一个文本节点（题号所在位置）
                const firstTextNode = markName.childNodes[0];
                if (!firstTextNode || firstTextNode.nodeType !== Node.TEXT_NODE) return '999';
                
                // 提取题号（格式如"24. "）
                const text = firstTextNode.textContent.trim();
                const match = text.match(/^(\d+)\s*\./);
                return match ? match[1] : '999';
            } catch (error) {
                Logger.error('解析题号失败', error);
                return '999';
            }
        }
    }

    // ===================== IndexedDB 管理器 =====================
    class DatabaseManager {
        constructor(config) {
            this.config = config;
            this.db = null;
        }

        async init() {
            return new Promise((resolve, reject) => {
                const request = indexedDB.open(
                    this.config.get('database.name'),
                    this.config.get('database.version')
                );

                request.onerror = () => reject(request.error);
                request.onsuccess = () => {
                    this.db = request.result;
                    resolve(this.db);
                };

                request.onupgradeneeded = (event) => {
                    const db = event.target.result;
                    const oldVersion = event.oldVersion;

                    // 创建或升级笔记存储
                    if (!db.objectStoreNames.contains(this.config.get('database.stores.notes'))) {
                        const notesStore = db.createObjectStore(
                            this.config.get('database.stores.notes'),
                            { keyPath: 'id' }
                        );
                        notesStore.createIndex('workKey', 'workKey', { unique: false });
                        notesStore.createIndex('questionId', 'questionId', { unique: false });
                        notesStore.createIndex('timestamp', 'timestamp', { unique: false });
                    }

                    // v2: 创建附件存储（为未来图片等附件做准备）
                    if (oldVersion < 2 && !db.objectStoreNames.contains(this.config.get('database.stores.attachments'))) {
                        const attachmentsStore = db.createObjectStore(
                            this.config.get('database.stores.attachments'),
                            { keyPath: 'id' }
                        );
                        attachmentsStore.createIndex('noteId', 'noteId', { unique: false });
                        attachmentsStore.createIndex('workKey', 'workKey', { unique: false });
                        attachmentsStore.createIndex('type', 'type', { unique: false });
                        attachmentsStore.createIndex('timestamp', 'timestamp', { unique: false });
                    }

                    // v3: 创建设置存储
                    if (oldVersion < 3 && !db.objectStoreNames.contains(this.config.get('database.stores.settings'))) {
                        db.createObjectStore(
                            this.config.get('database.stores.settings'),
                            { keyPath: 'key' }
                        );
                    }

                    // v4: 创建错题记录存储
                    if (oldVersion < 4 && !db.objectStoreNames.contains(this.config.get('database.stores.mistakes'))) {
                        const mistakesStore = db.createObjectStore(
                            this.config.get('database.stores.mistakes'),
                            { keyPath: 'id' }
                        );
                        mistakesStore.createIndex('workKey', 'workKey', { unique: false });
                        mistakesStore.createIndex('questionId', 'questionId', { unique: false });
                        mistakesStore.createIndex('questionNo', 'questionNo', { unique: false });
                        mistakesStore.createIndex('count', 'count', { unique: false });
                    }
                };
            });
        }

        async saveNote(workKey, questionId, questionNo, content) {
            if (!this.db) await this.init();

            return new Promise((resolve, reject) => {
                const transaction = this.db.transaction(
                    [this.config.get('database.stores.notes')],
                    'readwrite'
                );
                const objectStore = transaction.objectStore(this.config.get('database.stores.notes'));

                const id = `${workKey}_${questionId}_${questionNo}`;
                const data = {
                    id,
                    workKey,
                    questionId,
                    questionNo,
                    content,
                    contentType: 'text',  // 内容类型：text, html等
                    hasAttachments: false, // 是否有附件
                    attachmentCount: 0,    // 附件数量
                    timestamp: Date.now(),
                    updatedAt: Date.now()
                };

                const request = objectStore.put(data);
                request.onsuccess = () => resolve(data);
                request.onerror = () => reject(request.error);
            });
        }

        async getNote(workKey, questionId, questionNo) {
            if (!this.db) await this.init();

            return new Promise((resolve, reject) => {
                const transaction = this.db.transaction(
                    [this.config.get('database.stores.notes')],
                    'readonly'
                );
                const objectStore = transaction.objectStore(this.config.get('database.stores.notes'));

                const id = `${workKey}_${questionId}_${questionNo}`;
                const request = objectStore.get(id);

                request.onsuccess = () => resolve(request.result?.content || '');
                request.onerror = () => reject(request.error);
            });
        }

        async getAllNotes(workKey) {
            if (!this.db) await this.init();

            return new Promise((resolve, reject) => {
                const transaction = this.db.transaction(
                    [this.config.get('database.stores.notes')],
                    'readonly'
                );
                const objectStore = transaction.objectStore(this.config.get('database.stores.notes'));
                const index = objectStore.index('workKey');
                const request = index.getAll(workKey);

                request.onsuccess = () => resolve(request.result);
                request.onerror = () => reject(request.error);
            });
        }

        /**
         * 获取整个域名下的所有笔记
         */
        async getAllDomainNotes() {
            if (!this.db) await this.init();

            return new Promise((resolve, reject) => {
                const transaction = this.db.transaction(
                    [this.config.get('database.stores.notes')],
                    'readonly'
                );
                const objectStore = transaction.objectStore(this.config.get('database.stores.notes'));
                const request = objectStore.getAll();

                request.onsuccess = () => resolve(request.result);
                request.onerror = () => reject(request.error);
            });
        }

        async deleteNote(workKey, questionId, questionNo) {
            if (!this.db) await this.init();

            return new Promise((resolve, reject) => {
                const transaction = this.db.transaction(
                    [this.config.get('database.stores.notes')],
                    'readwrite'
                );
                const objectStore = transaction.objectStore(this.config.get('database.stores.notes'));

                const id = `${workKey}_${questionId}_${questionNo}`;
                const request = objectStore.delete(id);

                request.onsuccess = () => resolve();
                request.onerror = () => reject(request.error);
            });
        }

        /**
         * 批量删除笔记
         * @param {Array<string>} noteIds - 笔记ID数组
         */
        async deleteNotes(noteIds) {
            if (!this.db) await this.init();

            return new Promise((resolve, reject) => {
                const transaction = this.db.transaction(
                    [this.config.get('database.stores.notes')],
                    'readwrite'
                );
                const objectStore = transaction.objectStore(this.config.get('database.stores.notes'));

                let completedCount = 0;
                const totalCount = noteIds.length;

                if (totalCount === 0) {
                    resolve(0);
                    return;
                }

                noteIds.forEach(id => {
                    const request = objectStore.delete(id);
                    request.onsuccess = () => {
                        completedCount++;
                        if (completedCount === totalCount) {
                            resolve(completedCount);
                        }
                    };
                    request.onerror = () => {
                        Logger.error(`删除笔记失败: ${id}`, request.error);
                        completedCount++;
                        if (completedCount === totalCount) {
                            resolve(completedCount);
                        }
                    };
                });
            });
        }

        /**
         * 获取数据库统计信息
         */
        async getStatistics() {
            if (!this.db) await this.init();

            return new Promise((resolve, reject) => {
                const transaction = this.db.transaction(
                    [this.config.get('database.stores.notes')],
                    'readonly'
                );
                const objectStore = transaction.objectStore(this.config.get('database.stores.notes'));
                const countRequest = objectStore.count();

                countRequest.onsuccess = () => {
                    resolve({
                        totalNotes: countRequest.result,
                        databaseName: this.config.get('database.name'),
                        version: this.config.get('database.version')
                    });
                };
                countRequest.onerror = () => reject(countRequest.error);
            });
        }

        /**
         * 保存设置
         * @param {string} key - 设置键
         * @param {any} value - 设置值
         */
        async saveSetting(key, value) {
            if (!this.db) await this.init();

            return new Promise((resolve, reject) => {
                const transaction = this.db.transaction(
                    [this.config.get('database.stores.settings')],
                    'readwrite'
                );
                const objectStore = transaction.objectStore(this.config.get('database.stores.settings'));

                const data = { key, value, updatedAt: Date.now() };
                const request = objectStore.put(data);

                request.onsuccess = () => resolve(data);
                request.onerror = () => reject(request.error);
            });
        }

        /**
         * 获取设置
         * @param {string} key - 设置键
         * @param {any} defaultValue - 默认值
         */
        async getSetting(key, defaultValue = null) {
            if (!this.db) await this.init();

            return new Promise((resolve, reject) => {
                const transaction = this.db.transaction(
                    [this.config.get('database.stores.settings')],
                    'readonly'
                );
                const objectStore = transaction.objectStore(this.config.get('database.stores.settings'));
                const request = objectStore.get(key);

                request.onsuccess = () => {
                    const result = request.result;
                    resolve(result ? result.value : defaultValue);
                };
                request.onerror = () => reject(request.error);
            });
        }

        /**
         * 获取所有设置
         */
        async getAllSettings() {
            if (!this.db) await this.init();

            return new Promise((resolve, reject) => {
                const transaction = this.db.transaction(
                    [this.config.get('database.stores.settings')],
                    'readonly'
                );
                const objectStore = transaction.objectStore(this.config.get('database.stores.settings'));
                const request = objectStore.getAll();

                request.onsuccess = () => {
                    const settings = {};
                    request.result.forEach(item => {
                        settings[item.key] = item.value;
                    });
                    resolve(settings);
                };
                request.onerror = () => reject(request.error);
            });
        }

        /**
         * 清空所有数据（还原到初始状态）
         */
        async clearAllData() {
            if (!this.db) await this.init();

            return new Promise((resolve, reject) => {
                try {
                    const storeNames = [
                        this.config.get('database.stores.notes'),
                        this.config.get('database.stores.settings'),
                        this.config.get('database.stores.attachments'),
                        this.config.get('database.stores.mistakes')
                    ];

                    const transaction = this.db.transaction(storeNames, 'readwrite');
                    let completed = 0;

                    storeNames.forEach(storeName => {
                        if (this.db.objectStoreNames.contains(storeName)) {
                            const objectStore = transaction.objectStore(storeName);
                            const request = objectStore.clear();

                            request.onsuccess = () => {
                                completed++;
                                if (completed === storeNames.filter(name => this.db.objectStoreNames.contains(name)).length) {
                                    resolve();
                                }
                            };

                            request.onerror = () => reject(request.error);
                        } else {
                            completed++;
                        }
                    });

                    transaction.onerror = () => reject(transaction.error);
                } catch (error) {
                    reject(error);
                }
            });
        }

        /**
         * 保存错题记录（增加错题次数）
         * @param {string} workKey - 作业标识
         * @param {string} questionId - 题目ID
         * @param {string} questionNo - 题号
         */
        async addMistake(workKey, questionId, questionNo) {
            if (!this.db) await this.init();

            return new Promise((resolve, reject) => {
                const transaction = this.db.transaction(
                    [this.config.get('database.stores.mistakes')],
                    'readwrite'
                );
                const objectStore = transaction.objectStore(this.config.get('database.stores.mistakes'));

                const id = `${workKey}_${questionId}_${questionNo}_mistakes`;
                
                // 先尝试获取现有记录
                const getRequest = objectStore.get(id);
                
                getRequest.onsuccess = () => {
                    const existing = getRequest.result;
                    const now = Date.now();
                    
                    const data = existing ? {
                        ...existing,
                        count: existing.count + 1,
                        times: [...existing.times, now],
                        updatedAt: now
                    } : {
                        id,
                        workKey,
                        questionId,
                        questionNo,
                        count: 1,
                        times: [now],
                        createdAt: now,
                        updatedAt: now
                    };

                    const putRequest = objectStore.put(data);
                    putRequest.onsuccess = () => resolve(data);
                    putRequest.onerror = () => reject(putRequest.error);
                };
                
                getRequest.onerror = () => reject(getRequest.error);
            });
        }

        /**
         * 获取错题记录
         * @param {string} workKey - 作业标识
         * @param {string} questionId - 题目ID
         * @param {string} questionNo - 题号
         */
        async getMistake(workKey, questionId, questionNo) {
            if (!this.db) await this.init();

            return new Promise((resolve, reject) => {
                const transaction = this.db.transaction(
                    [this.config.get('database.stores.mistakes')],
                    'readonly'
                );
                const objectStore = transaction.objectStore(this.config.get('database.stores.mistakes'));

                const id = `${workKey}_${questionId}_${questionNo}_mistakes`;
                const request = objectStore.get(id);

                request.onsuccess = () => resolve(request.result || null);
                request.onerror = () => reject(request.error);
            });
        }

        /**
         * 获取当前作业的所有错题记录
         * @param {string} workKey - 作业标识
         */
        async getAllMistakes(workKey) {
            if (!this.db) await this.init();

            return new Promise((resolve, reject) => {
                const transaction = this.db.transaction(
                    [this.config.get('database.stores.mistakes')],
                    'readonly'
                );
                const objectStore = transaction.objectStore(this.config.get('database.stores.mistakes'));
                const index = objectStore.index('workKey');
                const request = index.getAll(workKey);

                request.onsuccess = () => resolve(request.result);
                request.onerror = () => reject(request.error);
            });
        }
    }

    // ===================== 笔记编辑器组件 =====================
    class NoteEditor {
        constructor(questionId, questionNo, workKey, dbManager, config, styleGenerator) {
            this.questionId = questionId;
            this.questionNo = questionNo;
            this.workKey = workKey;
            this.dbManager = dbManager;
            this.config = config;
            this.styleGenerator = styleGenerator;
            this.container = null;
            this.editor = null;
            this.toolbar = null;
            this.saveTimer = null;
            this.isVisible = false;
            this.isEditMode = false; // 初始为预览模式
            this.toolbarButtons = new Map(); // 存储按钮引用
        }

        async create() {
            const noteConfig = this.config.get('noteEditor');

            // 创建容器
            this.container = DOMHelper.createElement('div', {
                style: {
                    display: 'none',
                    marginTop: '12px'
                }
            });

            // 创建工具栏
            this.toolbar = this._createToolbar();
            this.container.appendChild(this.toolbar);

            // 创建编辑器（初始为预览模式）
            this.editor = DOMHelper.createElement('div', {
                contentEditable: 'false',
                style: {
                    width: noteConfig.width || '100%',
                    minHeight: noteConfig.minHeight,
                    maxHeight: noteConfig.maxHeight,
                    padding: noteConfig.padding,
                    fontSize: noteConfig.fontSize,
                    border: `${noteConfig.borderWidth} ${noteConfig.borderStyle} ${noteConfig.borderColor}`,
                    borderRadius: noteConfig.borderRadius,
                    backgroundColor: noteConfig.backgroundColor,
                    color: noteConfig.textColor,
                    fontFamily: noteConfig.fontFamily,
                    overflowY: 'auto',
                    overflowX: 'auto',
                    outline: 'none',
                    whiteSpace: 'pre-wrap',
                    wordWrap: 'break-word',
                    transition: 'border-color 0.2s',
                    boxSizing: 'border-box',
                    cursor: 'default'
                }
            });

            this.editor.setAttribute('data-placeholder', noteConfig.placeholder);

            // 添加占位符样式
            const style = document.createElement('style');
            style.textContent = `
                [contenteditable][data-placeholder]:empty:before {
                    content: attr(data-placeholder);
                    color: #a0aec0;
                    cursor: text;
                }
                [contenteditable] h1 { font-size: 2em; font-weight: bold; margin: 0.67em 0; }
                [contenteditable] h2 { font-size: 1.5em; font-weight: bold; margin: 0.75em 0; }
                [contenteditable] h3 { font-size: 1.17em; font-weight: bold; margin: 0.83em 0; }
                [contenteditable] ul, [contenteditable] ol { margin: 1em 0; padding-left: 2em; }
                [contenteditable] li { margin: 0.5em 0; }
                [contenteditable] blockquote { 
                    border-left: 4px solid #cbd5e0; 
                    padding-left: 1em; 
                    margin: 1em 0;
                    color: #718096;
                    font-style: italic;
                }
                [contenteditable] code {
                    background: #f7fafc;
                    padding: 2px 6px;
                    border-radius: 3px;
                    font-family: 'Courier New', monospace;
                    font-size: 0.9em;
                }
                [contenteditable] pre {
                    background: #2d3748;
                    color: #e2e8f0;
                    padding: 12px;
                    border-radius: 4px;
                    overflow-x: auto;
                    margin: 1em 0;
                }
                [contenteditable] a {
                    color: #4299e1;
                    text-decoration: underline;
                }
                [contenteditable] hr {
                    border: none;
                    border-top: 2px solid #e2e8f0;
                    margin: 1.5em 0;
                }
            `;
            document.head.appendChild(style);

            // 加载已保存的笔记
            try {
                const savedContent = await this.dbManager.getNote(this.workKey, this.questionId, this.questionNo);
                if (savedContent) {
                    this.editor.innerHTML = this._sanitizeHTML(savedContent);
                }
            } catch (error) {
                Logger.error(this.config.get('messages.noteLoadError'), error);
            }

            // 监听输入事件
            this.editor.addEventListener('input', () => {
                this._scheduleAutoSave();
            });

            // 监听光标移动和选择变化
            this.editor.addEventListener('mouseup', () => this._updateToolbarState());
            this.editor.addEventListener('keyup', () => this._updateToolbarState());
            this.editor.addEventListener('click', () => this._updateToolbarState());

            // 移除自动进入编辑模式的焦点事件处理
            // 编辑/预览模式切换将由切换按钮控制

            // 处理快捷键
            this.editor.addEventListener('keydown', (e) => {
                if (e.ctrlKey || e.metaKey) {
                    switch (e.key.toLowerCase()) {
                        case 'b':
                            e.preventDefault();
                            this._execCommand('bold');
                            break;
                        case 'i':
                            e.preventDefault();
                            this._execCommand('italic');
                            break;
                        case 'u':
                            e.preventDefault();
                            this._execCommand('underline');
                            break;
                    }
                }
            });

            this.container.appendChild(this.editor);
            return this.container;
        }

        _createToolbar() {
            const toolbar = DOMHelper.createElement('div', {
                style: {
                    display: 'none',
                    flexWrap: 'wrap',
                    gap: '4px',
                    padding: '8px',
                    backgroundColor: '#f7fafc',
                    borderRadius: '6px 6px 0 0',
                    border: '1px solid #e2e8f0',
                    borderBottom: 'none'
                }
            });

            const buttons = [
                { icon: '𝐁', title: '粗体 (Ctrl+B)', command: 'bold' },
                { icon: '𝐼', title: '斜体 (Ctrl+I)', command: 'italic', style: 'font-style: italic;' },
                { icon: 'U̲', title: '下划线 (Ctrl+U)', command: 'underline', style: 'text-decoration: underline;' },
                { icon: 'S̶', title: '删除线', command: 'strikeThrough', style: 'text-decoration: line-through;' },
                { type: 'separator' },
                { icon: 'H1', title: '标题1', command: 'formatBlock', value: '<h1>' },
                { icon: 'H2', title: '标题2', command: 'formatBlock', value: '<h2>' },
                { icon: 'H3', title: '标题3', command: 'formatBlock', value: '<h3>' },
                { type: 'separator' },
                { icon: '•', title: '无序列表', command: 'insertUnorderedList' },
                { icon: '1.', title: '有序列表', command: 'insertOrderedList' },
                { icon: '"', title: '引用', command: 'formatBlock', value: '<blockquote>' },
                { type: 'separator' },
                { icon: '🔗', title: '插入链接', command: 'createLink', prompt: true },
                { icon: '</>', title: '代码', command: 'code' },
                { icon: '—', title: '分隔线', command: 'insertHorizontalRule' },
                { type: 'separator' },
                { icon: '↶', title: '撤销', command: 'undo' },
                { icon: '↷', title: '重做', command: 'redo' },
                { icon: '🗑', title: '清除格式', command: 'removeFormat' }
            ];

            buttons.forEach(btn => {
                if (btn.type === 'separator') {
                    const separator = DOMHelper.createElement('div', {
                        style: {
                            width: '1px',
                            height: '20px',
                            backgroundColor: '#cbd5e0',
                            margin: '0 4px'
                        }
                    });
                    toolbar.appendChild(separator);
                } else {
                    const button = DOMHelper.createElement('button', {
                        innerHTML: btn.icon,
                        title: btn.title,
                        style: {
                            padding: '6px 10px',
                            border: '1px solid #cbd5e0',
                            borderRadius: '4px',
                            backgroundColor: 'white',
                            cursor: 'pointer',
                            fontSize: '14px',
                            fontWeight: 'bold',
                            transition: 'all 0.2s',
                            ...(btn.style ? this._parseStyle(btn.style) : {})
                        }
                    });

                    button.addEventListener('mouseenter', () => {
                        const isActive = button.style.backgroundColor === 'rgb(66, 153, 225)' ||
                            button.style.backgroundColor === '#4299e1';
                        if (!isActive) {
                            button.style.backgroundColor = '#e2e8f0';
                        }
                    });

                    button.addEventListener('mouseleave', () => {
                        const isActive = button.style.color === 'white';
                        if (!isActive) {
                            button.style.backgroundColor = 'white';
                        }
                    });

                    button.addEventListener('mousedown', (e) => {
                        e.preventDefault();

                        // 保存当前选区
                        const selection = window.getSelection();
                        let savedRange = null;
                        if (selection.rangeCount > 0) {
                            savedRange = selection.getRangeAt(0);
                        }

                        if (btn.prompt) {
                            // 处理链接插入
                            const url = prompt('请输入链接地址:');
                            if (url) {
                                // 恢复选区
                                if (savedRange) {
                                    selection.removeAllRanges();
                                    selection.addRange(savedRange);
                                }
                                this._execCommand(btn.command, url);
                            }
                        } else if (btn.value) {
                            // 恢复选区
                            if (savedRange) {
                                selection.removeAllRanges();
                                selection.addRange(savedRange);
                            }
                            this._execCommand(btn.command, btn.value);
                        } else if (btn.command === 'code') {
                            // 恢复选区
                            if (savedRange) {
                                selection.removeAllRanges();
                                selection.addRange(savedRange);
                            }
                            this._toggleCodeStyle();
                        } else if (btn.command) {
                            // 恢复选区
                            if (savedRange) {
                                selection.removeAllRanges();
                                selection.addRange(savedRange);
                            }
                            this._execCommand(btn.command);
                        }

                        // 确保编辑器获得焦点
                        setTimeout(() => {
                            this.editor.focus();
                            this._updateToolbarState();
                        }, 10);
                    });

                    // 保存按钮引用
                    if (btn.command) {
                        this.toolbarButtons.set(btn.command, button);
                    }

                    toolbar.appendChild(button);
                }
            });

            return toolbar;
        }

        _parseStyle(styleString) {
            const styles = {};
            styleString.split(';').forEach(rule => {
                const [key, value] = rule.split(':').map(s => s.trim());
                if (key && value) {
                    const camelKey = key.replace(/-([a-z])/g, (g) => g[1].toUpperCase());
                    styles[camelKey] = value;
                }
            });
            return styles;
        }

        _execCommand(command, value = null) {
            document.execCommand(command, false, value);
            this._updateToolbarState();
        }

        _updateToolbarState() {
            // 更新可切换状态的按钮
            const commands = ['bold', 'italic', 'underline', 'strikeThrough', 'insertUnorderedList', 'insertOrderedList'];

            commands.forEach(command => {
                const button = this.toolbarButtons.get(command);
                if (button) {
                    const isActive = document.queryCommandState(command);
                    if (isActive) {
                        button.style.backgroundColor = '#4299e1';
                        button.style.color = 'white';
                        button.style.borderColor = '#3182ce';
                    } else {
                        button.style.backgroundColor = 'white';
                        button.style.color = 'inherit';
                        button.style.borderColor = '#cbd5e0';
                    }
                }
            });
        }

        _toggleCodeStyle() {
            const selection = window.getSelection();
            if (!selection.rangeCount) return;

            const range = selection.getRangeAt(0);
            const selectedText = range.toString();

            if (selectedText) {
                const code = document.createElement('code');
                code.textContent = selectedText;

                try {
                    range.deleteContents();
                    range.insertNode(code);

                    // 恢复光标位置到代码块之后
                    range.setStartAfter(code);
                    range.setEndAfter(code);
                    selection.removeAllRanges();
                    selection.addRange(range);

                    this.editor.focus();
                } catch (error) {
                    Logger.error('插入代码失败', error);
                }
            } else {
                // 如果没有选中文本，在光标位置插入代码标记
                const code = document.createElement('code');
                code.textContent = '代码';

                try {
                    range.insertNode(code);
                    range.setStartAfter(code);
                    range.setEndAfter(code);
                    selection.removeAllRanges();
                    selection.addRange(range);
                    this.editor.focus();
                } catch (error) {
                    Logger.error('插入代码失败', error);
                }
            }
        }

        _sanitizeHTML(html) {
            // 基本的 HTML 清理，防止 XSS
            const div = document.createElement('div');
            div.innerHTML = html;

            // 移除危险的标签和属性
            const scripts = div.querySelectorAll('script, iframe, object, embed');
            scripts.forEach(el => el.remove());

            return div.innerHTML;
        }

        _scheduleAutoSave() {
            // 检查自动保存是否启用
            this.dbManager.getSetting('autoSave', this.config.get('settings.autoSave'))
                .then(autoSaveEnabled => {
                    if (!autoSaveEnabled) return;

                    if (this.saveTimer) {
                        clearTimeout(this.saveTimer);
                    }

                    this.dbManager.getSetting('autoSaveDelay', this.config.get('settings.autoSaveDelay'))
                        .then(delay => {
                            this.saveTimer = setTimeout(async () => {
                                await this.save();
                            }, delay);
                        });
                });
        }

        async save() {
            try {
                const content = this.editor.innerHTML;
                await this.dbManager.saveNote(this.workKey, this.questionId, this.questionNo, content);
            } catch (error) {
                Logger.error('保存笔记失败', error);
            }
        }

        show() {
            this.container.style.display = 'block';
            this.isVisible = true;
        }

        hide() {
            this.container.style.display = 'none';
            this.isVisible = false;
        }

        toggle() {
            if (this.isVisible) {
                this.hide();
            } else {
                this.show();
            }
        }

        toggleEditMode() {
            this.isEditMode = !this.isEditMode;

            if (this.isEditMode) {
                // 切换到编辑模式
                this.editor.contentEditable = 'true';
                this.editor.style.cursor = 'text';
                this.toolbar.style.display = 'flex';
                this.editor.style.borderColor = this.config.get('noteEditor.focusBorderColor');
                this.editor.focus();
                this._updateToolbarState();
            } else {
                // 切换到预览模式
                this.editor.contentEditable = 'false';
                this.editor.style.cursor = 'default';
                this.toolbar.style.display = 'none';
                this.editor.style.borderColor = this.config.get('noteEditor.borderColor');
                this.editor.blur();
            }
        }

        getElement() {
            return this.container;
        }
    }

    // ===================== 控制面板UI组件 =====================
    class ControlPanelUI {
        constructor(dbManager, workKey, config) {
            this.dbManager = dbManager;
            this.workKey = workKey;
            this.config = config;
            this.modal = null;
            this.notesList = [];
            this.selectedNotes = new Set();
            this.notesScope = 'current'; // 'current', 'course', 'class', 'domain'
            this.currentTab = 'settings'; // 'settings', 'notes', 'styles'
            this.settings = {};
            this.notesMenuExpanded = false; // 管理笔记子菜单是否展开
            this.notesSortBy = 'time'; // 'time' 或 'alpha' (字母序)
            this.notesSortOrder = 'desc'; // 'asc' 升序 或 'desc' 降序

            // 解析 workKey 获取 courseId, classId, workId
            const parts = workKey.split('_');
            this.courseId = parts[0] || '';
            this.classId = parts[1] || '';
            this.workId = parts[2] || '';
        }

        /**
         * 显示控制面板
         */
        async show() {
            await this._loadSettings();
            await this._loadNotes();
            this._createModal();
            this._renderContent();
        }

        /**
         * 加载用户设置
         */
        async _loadSettings() {
            try {
                this.settings = await this.dbManager.getAllSettings();
                // 填充默认值
                if (!('autoSave' in this.settings)) {
                    this.settings.autoSave = this.config.get('settings.autoSave');
                }
                if (!('autoSaveDelay' in this.settings)) {
                    this.settings.autoSaveDelay = this.config.get('settings.autoSaveDelay');
                }
                if (!('aiPromptPrefix' in this.settings)) {
                    this.settings.aiPromptPrefix = this.config.get('settings.aiPromptPrefix');
                }
                if (!('aiPromptSuffix' in this.settings)) {
                    this.settings.aiPromptSuffix = this.config.get('settings.aiPromptSuffix');
                }
                if (!('aiChatId' in this.settings)) {
                    this.settings.aiChatId = this.config.get('settings.aiChatId');
                }
            } catch (error) {
                Logger.error('加载设置失败', error);
                this.settings = {
                    autoSave: this.config.get('settings.autoSave'),
                    autoSaveDelay: this.config.get('settings.autoSaveDelay'),
                    aiPromptPrefix: this.config.get('settings.aiPromptPrefix'),
                    aiPromptSuffix: this.config.get('settings.aiPromptSuffix'),
                    aiChatId: this.config.get('settings.aiChatId')
                };
            }
        }

        /**
         * 加载笔记数据
         */
        async _loadNotes() {
            try {
                const allNotes = await this.dbManager.getAllDomainNotes();

                switch (this.notesScope) {
                    case 'current':
                        // 当前页面：完全匹配 workKey
                        this.notesList = allNotes.filter(note => note.workKey === this.workKey);
                        break;
                    case 'course':
                        // 当前课程：courseId 相同
                        this.notesList = allNotes.filter(note => {
                            const parts = note.workKey.split('_');
                            return parts[0] === this.courseId;
                        });
                        break;
                    case 'class':
                        // 当前班级：courseId 和 classId 都相同
                        this.notesList = allNotes.filter(note => {
                            const parts = note.workKey.split('_');
                            return parts[0] === this.courseId && parts[1] === this.classId;
                        });
                        break;
                    case 'domain':
                        // 整个域名：所有笔记
                        this.notesList = allNotes;
                        break;
                    default:
                        this.notesList = allNotes.filter(note => note.workKey === this.workKey);
                }

                this.notesList.sort((a, b) => b.timestamp - a.timestamp);
            } catch (error) {
                Logger.error('加载笔记失败', error);
                this.notesList = [];
            }
        }

        /**
         * 创建模态框
         */
        _createModal() {
            // 创建遮罩层
            const overlay = DOMHelper.createElement('div', {
                style: {
                    position: 'fixed',
                    top: '0',
                    left: '0',
                    width: '100%',
                    height: '100%',
                    backgroundColor: 'rgba(0, 0, 0, 0.5)',
                    zIndex: '99999',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center'
                }
            });

            // 创建主容器
            const mainContainer = DOMHelper.createElement('div', {
                style: {
                    backgroundColor: 'white',
                    borderRadius: '12px',
                    width: '90%',
                    maxWidth: '900px',
                    height: '85vh',
                    display: 'flex',
                    boxShadow: '0 10px 40px rgba(0, 0, 0, 0.2)',
                    overflow: 'hidden'
                }
            });

            // 创建左侧边栏
            const sidebar = this._createSidebar();
            mainContainer.appendChild(sidebar);

            // 创建右侧内容区
            const contentArea = DOMHelper.createElement('div', {
                id: 'panel-content-area',
                style: {
                    flex: '1',
                    display: 'flex',
                    flexDirection: 'column',
                    backgroundColor: '#f7fafc'
                }
            });

            // 创建内容区标题栏
            const contentHeader = DOMHelper.createElement('div', {
                id: 'panel-content-header',
                style: {
                    padding: '20px 30px',
                    borderBottom: '1px solid #e2e8f0',
                    backgroundColor: 'white',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                }
            });

            const headerTitle = DOMHelper.createElement('h2', {
                id: 'panel-header-title',
                innerText: '⚙️ 设置',
                style: {
                    margin: '0',
                    fontSize: '20px',
                    fontWeight: 'bold',
                    color: '#2d3748'
                }
            });

            const closeBtn = DOMHelper.createElement('button', {
                innerText: '✕',
                style: {
                    background: 'none',
                    border: 'none',
                    fontSize: '24px',
                    cursor: 'pointer',
                    color: '#718096',
                    padding: '0',
                    width: '30px',
                    height: '30px',
                    lineHeight: '30px',
                    textAlign: 'center',
                    borderRadius: '50%',
                    transition: 'background 0.2s'
                }
            });

            closeBtn.addEventListener('mouseenter', () => {
                closeBtn.style.backgroundColor = '#e2e8f0';
            });

            closeBtn.addEventListener('mouseleave', () => {
                closeBtn.style.backgroundColor = 'transparent';
            });

            closeBtn.addEventListener('click', () => this._close());

            contentHeader.appendChild(headerTitle);
            contentHeader.appendChild(closeBtn);
            contentArea.appendChild(contentHeader);

            // 创建内容主体
            const contentBody = DOMHelper.createElement('div', {
                id: 'panel-content-body',
                style: {
                    flex: '1',
                    overflow: 'auto',
                    display: 'flex',
                    flexDirection: 'column'
                }
            });

            contentArea.appendChild(contentBody);
            mainContainer.appendChild(contentArea);
            overlay.appendChild(mainContainer);

            // 点击遮罩层关闭
            overlay.addEventListener('click', (e) => {
                if (e.target === overlay) {
                    this._close();
                }
            });

            this.modal = overlay;
            document.body.appendChild(overlay);
        }

        /**
         * 创建左侧边栏
         */
        _createSidebar() {
            const sidebar = DOMHelper.createElement('div', {
                style: {
                    width: '220px',
                    backgroundColor: '#2d3748',
                    display: 'flex',
                    flexDirection: 'column',
                    padding: '20px 0'
                }
            });

            // 标题
            const title = DOMHelper.createElement('div', {
                innerText: '控制面板',
                style: {
                    padding: '0 20px 20px',
                    fontSize: '18px',
                    fontWeight: 'bold',
                    color: 'white',
                    borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
                    marginBottom: '10px'
                }
            });

            sidebar.appendChild(title);

            // 菜单项
            const menuItems = [
                { id: 'settings', icon: '⚙️', text: '设置' },
                { id: 'copy-config', icon: '📋', text: '复制内容管理' },
                { id: 'ai-prompt', icon: '🤖', text: 'AI提问管理' },
                { id: 'export', icon: '📄', text: '导出格式管理' },
                {
                    id: 'notes',
                    icon: '📝',
                    text: '笔记管理',
                    hasSubmenu: true,
                    submenu: [
                        { id: 'notes-current', icon: '📄', text: '当前页面', scope: 'current' },
                        { id: 'notes-course', icon: '📚', text: '当前课程', scope: 'course' },
                        { id: 'notes-domain', icon: '🌐', text: '当前域名', scope: 'domain' }
                    ]
                },
                { id: 'styles', icon: '🎨', text: '样式管理' }
            ];

            menuItems.forEach(item => {
                const menuItem = this._createMenuItem(item);
                sidebar.appendChild(menuItem);
            });

            return sidebar;
        }

        /**
         * 创建菜单项（支持子菜单）
         */
        _createMenuItem(item) {
            const container = DOMHelper.createElement('div');

            // 主菜单项
            const menuItem = DOMHelper.createElement('div', {
                dataset: { tab: item.id },
                style: {
                    padding: '12px 20px',
                    cursor: 'pointer',
                    color: this.currentTab === item.id ? 'white' : '#a0aec0',
                    backgroundColor: this.currentTab === item.id ? '#4a5568' : 'transparent',
                    borderLeft: this.currentTab === item.id ? '3px solid #4299e1' : '3px solid transparent',
                    fontWeight: this.currentTab === item.id ? 'bold' : 'normal',
                    transition: 'all 0.2s',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    justifyContent: 'space-between'
                }
            });

            const leftContent = DOMHelper.createElement('div', {
                style: {
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px'
                }
            });

            const iconSpan = DOMHelper.createElement('span', {
                innerText: item.icon,
                style: {
                    fontSize: '16px'
                }
            });

            const textSpan = DOMHelper.createElement('span', {
                innerText: item.text,
                style: {
                    fontSize: '14px'
                }
            });

            leftContent.appendChild(iconSpan);
            leftContent.appendChild(textSpan);
            menuItem.appendChild(leftContent);

            // 如果有子菜单，添加展开图标
            if (item.hasSubmenu) {
                const expandIcon = DOMHelper.createElement('span', {
                    innerText: '▼',
                    style: {
                        fontSize: '10px',
                        transition: 'transform 0.2s',
                        transform: this.notesMenuExpanded ? 'rotate(0deg)' : 'rotate(-90deg)'
                    }
                });
                menuItem.appendChild(expandIcon);

                // 创建子菜单容器
                const submenuContainer = DOMHelper.createElement('div', {
                    style: {
                        display: this.notesMenuExpanded ? 'block' : 'none',
                        backgroundColor: '#1a202c'
                    }
                });

                item.submenu.forEach(subItem => {
                    const subMenuItem = this._createSubMenuItem(subItem);
                    submenuContainer.appendChild(subMenuItem);
                });

                menuItem.addEventListener('click', () => {
                    this.notesMenuExpanded = !this.notesMenuExpanded;
                    expandIcon.style.transform = this.notesMenuExpanded ? 'rotate(0deg)' : 'rotate(-90deg)';
                    submenuContainer.style.display = this.notesMenuExpanded ? 'block' : 'none';
                });

                container.appendChild(menuItem);
                container.appendChild(submenuContainer);
            } else {
                // 无子菜单的普通菜单项
                menuItem.addEventListener('mouseenter', () => {
                    if (this.currentTab !== item.id) {
                        menuItem.style.backgroundColor = '#4a5568';
                        menuItem.style.color = '#e2e8f0';
                    }
                });

                menuItem.addEventListener('mouseleave', () => {
                    if (this.currentTab !== item.id) {
                        menuItem.style.backgroundColor = 'transparent';
                        menuItem.style.color = '#a0aec0';
                    }
                });

                menuItem.addEventListener('click', () => {
                    this.currentTab = item.id;
                    this._updateSidebarState();
                    this._renderContent();
                });

                container.appendChild(menuItem);
            }

            return container;
        }

        /**
         * 创建子菜单项
         */
        _createSubMenuItem(subItem) {
            const isActive = this.currentTab === 'notes' && this.notesScope === subItem.scope;

            const subMenuItem = DOMHelper.createElement('div', {
                dataset: { scope: subItem.scope },
                style: {
                    padding: '10px 20px 10px 50px',
                    cursor: 'pointer',
                    color: isActive ? '#63b3ed' : '#718096',
                    backgroundColor: isActive ? '#2d3748' : 'transparent',
                    fontSize: '13px',
                    fontWeight: isActive ? 'bold' : 'normal',
                    textShadow: isActive ? '0 0 8px rgba(99, 179, 237, 0.5)' : 'none',
                    transition: 'all 0.2s',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                }
            });

            const icon = DOMHelper.createElement('span', {
                innerText: subItem.icon,
                style: {
                    fontSize: '14px'
                }
            });

            const text = DOMHelper.createElement('span', {
                innerText: subItem.text
            });

            subMenuItem.appendChild(icon);
            subMenuItem.appendChild(text);

            subMenuItem.addEventListener('mouseenter', () => {
                if (!(this.currentTab === 'notes' && this.notesScope === subItem.scope)) {
                    subMenuItem.style.backgroundColor = '#2d3748';
                    subMenuItem.style.color = '#a0aec0';
                }
            });

            subMenuItem.addEventListener('mouseleave', () => {
                const isCurrentScope = this.currentTab === 'notes' && this.notesScope === subItem.scope;
                if (!isCurrentScope) {
                    subMenuItem.style.backgroundColor = 'transparent';
                    subMenuItem.style.color = '#718096';
                } else {
                    subMenuItem.style.backgroundColor = '#2d3748';
                    subMenuItem.style.color = '#63b3ed';
                    subMenuItem.style.textShadow = '0 0 8px rgba(99, 179, 237, 0.5)';
                }
            });

            subMenuItem.addEventListener('click', async () => {
                this.currentTab = 'notes';
                this.notesScope = subItem.scope;
                this.selectedNotes.clear();
                await this._loadNotes();
                this._updateSidebarState();
                this._renderContent();
            });

            return subMenuItem;
        }

        /**
         * 更新侧边栏状态
         */
        _updateSidebarState() {
            const menuItems = this.modal.querySelectorAll('[data-tab]');
            menuItems.forEach(item => {
                const isActive = item.dataset.tab === this.currentTab;
                item.style.color = isActive ? 'white' : '#a0aec0';
                item.style.backgroundColor = isActive ? '#4a5568' : 'transparent';
                item.style.borderLeft = isActive ? '3px solid #4299e1' : '3px solid transparent';
                item.style.fontWeight = isActive ? 'bold' : 'normal';
            });

            // 更新子菜单项状态
            const subMenuItems = this.modal.querySelectorAll('[data-scope]');
            subMenuItems.forEach(item => {
                const isActive = this.currentTab === 'notes' && this.notesScope === item.dataset.scope;
                item.style.color = isActive ? '#4299e1' : '#718096';
                item.style.backgroundColor = isActive ? '#2d3748' : 'transparent';
            });
        }

        /**
         * 创建统一的底部悬浮操作栏
         * @param {Object} options - 配置选项
         * @param {string} options.saveText - 保存按钮文字
         * @param {Function} options.onSave - 保存回调函数
         * @param {Function} options.onReset - 重置回调函数（可选）
         * @param {string} options.resetText - 重置按钮文字（可选）
         * @returns {HTMLElement} 操作栏元素
         */
        _createFloatingActionBar(options) {
            const {
                saveText = '💾 保存设置',
                onSave,
                onReset = null,
                resetText = '🔄 重置为默认'
            } = options;

            const buttonConfig = this.config.get('panelSaveButton');

            // 创建固定下边栏容器
            const actionBar = DOMHelper.createElement('div', {
                className: 'floating-action-bar',
                style: {
                    position: 'sticky',
                    bottom: '0',
                    left: '0',
                    right: '0',
                    padding: '12px 24px',
                    backgroundColor: 'white',
                    borderTop: '1px solid #e2e8f0',
                    display: 'flex',
                    justifyContent: onReset ? 'space-between' : 'flex-end',
                    alignItems: 'center',
                    boxShadow: '0 -2px 8px rgba(0, 0, 0, 0.06)',
                    zIndex: '100',
                    marginTop: 'auto'
                }
            });

            // 创建重置按钮（如果提供了重置回调）
            if (onReset) {
                const resetButton = DOMHelper.createElement('button', {
                    innerText: resetText,
                    style: {
                        padding: '8px 16px',
                        border: '1px solid #e2e8f0',
                        borderRadius: '6px',
                        backgroundColor: 'white',
                        color: '#718096',
                        fontSize: '13px',
                        fontWeight: '500',
                        cursor: 'pointer',
                        transition: 'all 0.2s'
                    }
                });

                resetButton.addEventListener('mouseenter', () => {
                    resetButton.style.backgroundColor = '#f7fafc';
                    resetButton.style.borderColor = '#cbd5e0';
                    resetButton.style.transform = 'translateY(-1px)';
                    resetButton.style.boxShadow = '0 2px 4px rgba(0, 0, 0, 0.1)';
                });

                resetButton.addEventListener('mouseleave', () => {
                    resetButton.style.backgroundColor = 'white';
                    resetButton.style.borderColor = '#e2e8f0';
                    resetButton.style.transform = 'translateY(0)';
                    resetButton.style.boxShadow = 'none';
                });

                resetButton.addEventListener('click', onReset);
                actionBar.appendChild(resetButton);
            }

            // 创建保存按钮
            const saveButton = DOMHelper.createElement('button', {
                innerText: saveText,
                style: {
                    padding: '8px 18px',
                    border: 'none',
                    borderRadius: '6px',
                    backgroundColor: buttonConfig.colors.background,
                    color: buttonConfig.colors.textColor,
                    fontSize: '13px',
                    fontWeight: '500',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    boxShadow: buttonConfig.colors.boxShadow
                }
            });

            saveButton.addEventListener('mouseenter', () => {
                saveButton.style.backgroundColor = buttonConfig.colors.hoverBackground;
                saveButton.style.transform = 'translateY(-1px)';
                saveButton.style.boxShadow = buttonConfig.colors.hoverBoxShadow;
            });

            saveButton.addEventListener('mouseleave', () => {
                if (!saveButton.dataset.success && !saveButton.dataset.error) {
                    saveButton.style.backgroundColor = buttonConfig.colors.background;
                    saveButton.style.transform = 'translateY(0)';
                    saveButton.style.boxShadow = buttonConfig.colors.boxShadow;
                }
            });

            // 封装保存逻辑
            saveButton.addEventListener('click', async () => {
                try {
                    saveButton.disabled = true;
                    saveButton.innerText = '⏳ 保存中...';

                    await onSave();

                    // 显示成功状态
                    saveButton.dataset.success = 'true';
                    saveButton.innerText = buttonConfig.text.success;
                    saveButton.style.backgroundColor = buttonConfig.colors.successBackground;

                    setTimeout(() => {
                        delete saveButton.dataset.success;
                        saveButton.innerText = saveText;
                        saveButton.style.backgroundColor = buttonConfig.colors.background;
                        saveButton.disabled = false;
                    }, 2000);

                } catch (error) {
                    Logger.error('保存失败', error);

                    // 显示错误状态
                    saveButton.dataset.error = 'true';
                    saveButton.innerText = buttonConfig.text.error;
                    saveButton.style.backgroundColor = buttonConfig.colors.errorBackground;

                    setTimeout(() => {
                        delete saveButton.dataset.error;
                        saveButton.innerText = saveText;
                        saveButton.style.backgroundColor = buttonConfig.colors.background;
                        saveButton.disabled = false;
                    }, 2000);
                }
            });

            actionBar.appendChild(saveButton);

            return actionBar;
        }

        /**
         * 渲染内容区
         */
        _renderContent() {
            const headerTitle = document.getElementById('panel-header-title');
            const contentBody = document.getElementById('panel-content-body');

            if (this.currentTab === 'settings') {
                headerTitle.innerText = '⚙️ 设置';
                this._renderSettingsPanel(contentBody);
            } else if (this.currentTab === 'copy-config') {
                headerTitle.innerText = '📋 复制内容前后缀管理';
                this._renderCopyConfigPanel(contentBody);
            } else if (this.currentTab === 'ai-prompt') {
                headerTitle.innerText = '🤖 AI提问管理';
                this._renderAIPromptPanel(contentBody);
            } else if (this.currentTab === 'export') {
                headerTitle.innerText = '📄 导出设置';
                this._renderExportSettingsPanel(contentBody);
            } else if (this.currentTab === 'notes') {
                headerTitle.innerText = '📝 笔记管理';
                this._renderNotesPanel(contentBody);
            } else if (this.currentTab === 'styles') {
                headerTitle.innerText = '🎨 样式管理';
                this._renderStylesPanel(contentBody);
            }
        }

        /**
         * 渲染设置面板
         */
        _renderSettingsPanel(container) {
            container.innerHTML = '';
            container.style.padding = '0';
            container.style.display = 'flex';
            container.style.flexDirection = 'column';

            // 创建内容包装器（有padding）
            const contentWrapper = DOMHelper.createElement('div', {
                style: {
                    flex: '1',
                    padding: '30px',
                    overflow: 'auto'
                }
            });

            const settingsContainer = DOMHelper.createCard();

            // 自动保存开关
            const autoSaveSection = this._createSettingItem(
                '自动保存',
                '开启后会在输入停止一段时间后自动保存笔记',
                'checkbox',
                'autoSave',
                this.settings.autoSave
            );

            settingsContainer.appendChild(autoSaveSection);

            // 自动保存延迟时间
            const delaySection = this._createSettingItem(
                '自动保存延迟',
                '输入停止后多久开始保存（毫秒）',
                'number',
                'autoSaveDelay',
                this.settings.autoSaveDelay
            );

            settingsContainer.appendChild(delaySection);

            container.appendChild(settingsContainer);

            // 危险操作区域
            const dangerZone = DOMHelper.createCard({
                border: '2px solid #feb2b2'
            });

            const dangerTitle = DOMHelper.createTitle('⚠️ 危险操作', {
                color: '#c53030'
            });

            const clearDbSection = DOMHelper.createElement('div', {
                style: {
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    paddingBottom: '16px'
                }
            });

            const clearDbInfo = DOMHelper.createElement('div');

            const clearDbLabel = DOMHelper.createElement('div', {
                innerText: '清空所有数据',
                style: {
                    fontSize: '14px',
                    fontWeight: '600',
                    color: '#2d3748',
                    marginBottom: '4px'
                }
            });

            const clearDbDesc = DOMHelper.createElement('div', {
                innerText: '删除所有笔记、设置和自定义样式，还原到初始状态。此操作不可恢复！',
                style: {
                    fontSize: '13px',
                    color: '#718096',
                    lineHeight: '1.5'
                }
            });

            clearDbInfo.appendChild(clearDbLabel);
            clearDbInfo.appendChild(clearDbDesc);

            const clearDbBtn = DOMHelper.createElement('button', {
                innerText: '清空数据库',
                style: {
                    padding: '8px 16px',
                    border: 'none',
                    borderRadius: '4px',
                    backgroundColor: '#f56565',
                    color: 'white',
                    fontSize: '13px',
                    fontWeight: '600',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    whiteSpace: 'nowrap'
                }
            });

            clearDbBtn.addEventListener('mouseenter', () => {
                clearDbBtn.style.backgroundColor = '#e53e3e';
                clearDbBtn.style.transform = 'translateY(-1px)';
            });

            clearDbBtn.addEventListener('mouseleave', () => {
                clearDbBtn.style.backgroundColor = '#f56565';
                clearDbBtn.style.transform = 'translateY(0)';
            });

            clearDbBtn.addEventListener('click', async () => {
                const confirmText = '确认要清空所有数据吗？\n\n将删除：\n- 所有笔记\n- 所有设置\n- 所有自定义样式\n\n此操作不可恢复！\n\n请输入 "CLEAR" 确认操作：';
                const userInput = prompt(confirmText);

                if (userInput === 'CLEAR') {
                    try {
                        clearDbBtn.disabled = true;
                        clearDbBtn.innerText = '清空中...';
                        clearDbBtn.style.backgroundColor = '#cbd5e0';

                        await this.dbManager.clearAllData();

                        alert('✅ 数据库已清空！\n\n页面将在 2 秒后刷新...');
                        Logger.success('数据库已成功清空');

                        setTimeout(() => {
                            window.location.reload();
                        }, 2000);
                    } catch (error) {
                        Logger.error('清空数据库失败', error);
                        alert('❌ 清空失败，请查看控制台了解详情');
                        clearDbBtn.disabled = false;
                        clearDbBtn.innerText = '清空数据库';
                        clearDbBtn.style.backgroundColor = '#f56565';
                    }
                } else if (userInput !== null) {
                    alert('输入不正确，操作已取消');
                }
            });

            clearDbSection.appendChild(clearDbInfo);
            clearDbSection.appendChild(clearDbBtn);

            dangerZone.appendChild(dangerTitle);
            dangerZone.appendChild(clearDbSection);

            contentWrapper.appendChild(dangerZone);
            container.appendChild(contentWrapper);

            // 添加统一的底部操作栏
            const actionBar = this._createFloatingActionBar({
                saveText: '💾 保存基础设置',
                onSave: async () => {
                    await this.dbManager.saveSetting('autoSave', this.settings.autoSave);
                    await this.dbManager.saveSetting('autoSaveDelay', this.settings.autoSaveDelay);
                    Logger.success('基础设置已保存');
                },
                onReset: async () => {
                    if (confirm('确定要重置基础设置为默认值吗？')) {
                        const defaults = this.config.get('settings');
                        this.settings.autoSave = defaults.autoSave;
                        this.settings.autoSaveDelay = defaults.autoSaveDelay;
                        await this.dbManager.saveSetting('autoSave', defaults.autoSave);
                        await this.dbManager.saveSetting('autoSaveDelay', defaults.autoSaveDelay);
                        Logger.success('基础设置已重置');
                        this._renderSettingsPanel(container);
                    }
                },
                resetText: '🔄 重置基础设置'
            });
            container.appendChild(actionBar);
        }

        /**
         * 创建设置项
         */
        _createSettingItem(label, description, type, key, value) {
            const item = DOMHelper.createElement('div', {
                style: {
                    marginBottom: '24px',
                    paddingBottom: '24px',
                    borderBottom: '1px solid #e2e8f0'
                }
            });

            const labelEl = DOMHelper.createElement('div', {
                style: {
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: '8px'
                }
            });

            const labelText = DOMHelper.createElement('span', {
                innerText: label,
                style: {
                    fontSize: '16px',
                    fontWeight: '600',
                    color: '#2d3748'
                }
            });

            let input;
            if (type === 'checkbox') {
                input = DOMHelper.createElement('input', {
                    type: 'checkbox',
                    checked: value,
                    style: {
                        width: '20px',
                        height: '20px',
                        cursor: 'pointer'
                    }
                });

                input.addEventListener('change', () => {
                    this.settings[key] = input.checked;
                });
            } else if (type === 'number') {
                input = DOMHelper.createElement('input', {
                    type: 'number',
                    value: value,
                    style: {
                        width: '120px',
                        padding: '6px 12px',
                        border: '1px solid #cbd5e0',
                        borderRadius: '4px',
                        fontSize: '14px'
                    }
                });

                input.addEventListener('change', () => {
                    const numValue = parseInt(input.value);
                    if (numValue > 0) {
                        this.settings[key] = numValue;
                    }
                });
            }

            labelEl.appendChild(labelText);
            labelEl.appendChild(input);

            const desc = DOMHelper.createElement('div', {
                innerText: description,
                style: {
                    fontSize: '13px',
                    color: '#718096',
                    marginTop: '4px'
                }
            });

            item.appendChild(labelEl);
            item.appendChild(desc);

            return item;
        }

        /**
         * 创建文本输入类型的设置项
         * @param {string} label - 设置项标签
         * @param {string} description - 设置项描述
         * @param {string} key - 设置项键名
         * @param {string} value - 当前值
         * @returns {HTMLElement} 设置项元素
         */
        _createTextSettingItem(label, description, key, value) {
            const item = DOMHelper.createElement('div', {
                style: {
                    marginBottom: '20px'
                }
            });

            const labelEl = DOMHelper.createElement('label', {
                innerText: label,
                style: {
                    display: 'block',
                    fontSize: '14px',
                    fontWeight: '600',
                    color: '#2d3748',
                    marginBottom: '8px'
                }
            });

            // 根据key动态设置placeholder
            let placeholder = '留空则不添加前缀/后缀';
            if (key === 'aiChatId') {
                placeholder = '留空则每次新建标签页，示例：32898162890824194';
            }

            const input = DOMHelper.createElement('input', {
                type: 'text',
                value: value || '',
                placeholder: placeholder,
                style: {
                    width: '100%',
                    padding: '8px 12px',
                    border: '1px solid #cbd5e0',
                    borderRadius: '6px',
                    fontSize: '14px',
                    color: '#2d3748',
                    transition: 'border-color 0.2s',
                    boxSizing: 'border-box'
                }
            });

            // 聚焦效果
            input.addEventListener('focus', () => {
                input.style.borderColor = '#4299e1';
                input.style.outline = 'none';
                input.style.boxShadow = '0 0 0 3px rgba(66, 153, 225, 0.1)';
            });

            input.addEventListener('blur', () => {
                input.style.borderColor = '#cbd5e0';
                input.style.boxShadow = 'none';
            });

            // 实时保存
            input.addEventListener('input', () => {
                this.settings[key] = input.value;
            });

            const desc = DOMHelper.createElement('div', {
                innerText: description,
                style: {
                    fontSize: '12px',
                    color: '#718096',
                    marginTop: '6px',
                    lineHeight: '1.5'
                }
            });

            item.appendChild(labelEl);
            item.appendChild(input);
            item.appendChild(desc);

            return item;
        }

        /**
         * 创建文本域类型的设置项（支持多行输入）
         * @param {string} label - 设置项标签
         * @param {string} description - 设置项描述
         * @param {string} key - 设置项键名
         * @param {string} value - 当前值
         * @returns {HTMLElement} 设置项元素
         */
        _createTextareaSettingItem(label, description, key, value) {
            const item = DOMHelper.createElement('div', {
                style: {
                    marginBottom: '24px'
                }
            });

            const labelEl = DOMHelper.createElement('label', {
                innerText: label,
                style: {
                    display: 'block',
                    fontSize: '14px',
                    fontWeight: '600',
                    color: '#2d3748',
                    marginBottom: '8px'
                }
            });

            const textarea = DOMHelper.createElement('textarea', {
                value: value || '',
                placeholder: '留空则不添加前缀/后缀。支持 \\n 换行符',
                rows: 3,
                style: {
                    width: '100%',
                    padding: '10px 12px',
                    border: '1px solid #cbd5e0',
                    borderRadius: '6px',
                    fontSize: '14px',
                    color: '#2d3748',
                    transition: 'border-color 0.2s',
                    boxSizing: 'border-box',
                    fontFamily: 'Consolas, Monaco, "Courier New", monospace',
                    lineHeight: '1.5',
                    resize: 'vertical',
                    minHeight: '60px'
                }
            });

            // 设置初始值
            textarea.value = value || '';

            // 聚焦效果
            textarea.addEventListener('focus', () => {
                textarea.style.borderColor = '#4299e1';
                textarea.style.outline = 'none';
                textarea.style.boxShadow = '0 0 0 3px rgba(66, 153, 225, 0.1)';
            });

            textarea.addEventListener('blur', () => {
                textarea.style.borderColor = '#cbd5e0';
                textarea.style.boxShadow = 'none';
            });

            // 实时保存
            textarea.addEventListener('input', () => {
                this.settings[key] = textarea.value;
            });

            const desc = DOMHelper.createElement('div', {
                innerHTML: description,
                style: {
                    fontSize: '12px',
                    color: '#718096',
                    marginTop: '6px',
                    lineHeight: '1.5'
                }
            });

            // 字符计数提示
            const charCount = DOMHelper.createElement('div', {
                style: {
                    fontSize: '11px',
                    color: '#a0aec0',
                    marginTop: '4px',
                    textAlign: 'right'
                }
            });

            const updateCharCount = () => {
                const length = textarea.value.length;
                const displayValue = textarea.value.replace(/\\n/g, '\n');
                const actualLength = displayValue.length;
                charCount.innerText = `${length} 字符 (实际显示: ${actualLength} 字符)`;
            };

            updateCharCount();
            textarea.addEventListener('input', updateCharCount);

            item.appendChild(labelEl);
            item.appendChild(textarea);
            item.appendChild(desc);
            item.appendChild(charCount);

            return item;
        }

        /**
         * 通用的前后缀配置面板渲染方法（支持复制配置和AI提问管理复用）
         * @param {Object} options - 配置选项
         * @param {string} options.title - 面板标题
         * @param {string} options.prefixKey - 前缀配置键名
         * @param {string} options.suffixKey - 后缀配置键名
         * @param {string} options.prefixLabel - 前缀输入框标签
         * @param {string} options.suffixLabel - 后缀输入框标签
         * @param {string} options.prefixDesc - 前缀输入框描述
         * @param {string} options.suffixDesc - 后缀输入框描述
         * @param {string} options.sampleQuestion - 预览示例题目
         * @param {Function} options.onSave - 保存回调函数
         * @param {Function} options.onReset - 重置回调函数
         */
        _renderPrefixSuffixPanel(container, options) {
            container.innerHTML = '';
            container.style.padding = '0';
            container.style.display = 'flex';
            container.style.flexDirection = 'column';

            // 创建内容包装器（有padding）
            const contentWrapper = DOMHelper.createElement('div', {
                style: {
                    flex: '1',
                    padding: '30px',
                    overflow: 'auto'
                }
            });

            // 配置表单区域
            const configSection = DOMHelper.createCard();

            // 前缀设置
            const prefixSection = this._createTextareaSettingItem(
                options.prefixLabel,
                options.prefixDesc,
                options.prefixKey,
                this.settings[options.prefixKey] || ''
            );

            configSection.appendChild(prefixSection);

            // 后缀设置
            const suffixSection = this._createTextareaSettingItem(
                options.suffixLabel,
                options.suffixDesc,
                options.suffixKey,
                this.settings[options.suffixKey] || ''
            );

            configSection.appendChild(suffixSection);

            container.appendChild(configSection);

            // 示例预览区域
            const previewSection = DOMHelper.createCard();

            const previewTitle = DOMHelper.createTitle('💡 实时预览');

            const previewHint = DOMHelper.createDescription('以下是应用前缀和后缀后的效果：', {
                marginTop: '0',
                marginBottom: '12px'
            });

            const previewContent = DOMHelper.createElement('pre', {
                id: `${options.prefixKey}-preview`,
                style: {
                    fontSize: '13px',
                    color: '#2d3748',
                    lineHeight: '1.6',
                    whiteSpace: 'pre-wrap',
                    fontFamily: 'Consolas, Monaco, "Courier New", monospace',
                    backgroundColor: '#f7fafc',
                    padding: '16px',
                    borderRadius: '6px',
                    border: '1px solid #e2e8f0',
                    margin: '0',
                    overflow: 'auto',
                    maxHeight: '300px'
                }
            });

            // 更新预览内容的函数（处理 \n 转义）
            const updatePreview = () => {
                const prefix = (this.settings[options.prefixKey] || '').replace(/\\n/g, '\n');
                const suffix = (this.settings[options.suffixKey] || '').replace(/\\n/g, '\n');
                previewContent.textContent = prefix + options.sampleQuestion + suffix;
            };

            // 初始预览
            updatePreview();

            // 监听输入变化更新预览
            const prefixTextarea = prefixSection.querySelector('textarea');
            const suffixTextarea = suffixSection.querySelector('textarea');

            if (prefixTextarea) {
                prefixTextarea.addEventListener('input', updatePreview);
            }
            if (suffixTextarea) {
                suffixTextarea.addEventListener('input', updatePreview);
            }

            previewSection.appendChild(previewTitle);
            previewSection.appendChild(previewHint);
            previewSection.appendChild(previewContent);
            
            contentWrapper.appendChild(configSection);
            contentWrapper.appendChild(previewSection);
            container.appendChild(contentWrapper);

            // 底部操作栏
            const actionBar = this._createFloatingActionBar({
                saveText: '💾 保存配置',
                onSave: options.onSave,
                resetText: '🔄 重置配置',
                onReset: options.onReset
            });

            container.appendChild(actionBar);
        }

        /**
         * 渲染复制配置面板
         */
        _renderCopyConfigPanel(container) {
            this._renderPrefixSuffixPanel(container, {
                title: '📋 复制内容管理',
                prefixKey: 'copyPrefix',
                suffixKey: 'copySuffix',
                prefixLabel: '复制内容前缀',
                suffixLabel: '复制内容后缀',
                prefixDesc: '复制题目时自动添加到内容前面的文字。支持 \\n 换行符（如："【题目】\\n"、"问："等）',
                suffixDesc: '复制题目时自动添加到内容后面的文字。支持 \\n 换行符（如："\\n---"、"\\n\\n来源：超星学习通"等）',
                sampleQuestion: '1. (单选题, 3分) 以下哪个是正确的？\nA. 选项A\nB. 选项B\nC. 选项C\nD. 选项D',
                onSave: async () => {
                    // 保存配置
                    try {
                        await this.dbManager.saveSetting('copyPrefix', this.settings.copyPrefix || '');
                        await this.dbManager.saveSetting('copySuffix', this.settings.copySuffix || '');
                    } catch (error) {
                        console.error('保存失败:', error);
                        alert('❌ 保存失败，请重试');
                    }
                },
                onReset: () => {
                    // 重置配置
                    if (confirm('确定要重置复制配置吗？')) {
                        this.settings.copyPrefix = '';
                        this.settings.copySuffix = '';
                        this.dbManager.saveSetting('copyPrefix', '');
                        this.dbManager.saveSetting('copySuffix', '');
                        this._renderCopyConfigPanel(container);
                    }
                }
            });
        }

        /**
         * 渲染AI提问管理面板
         */
        _renderAIPromptPanel(container) {
            container.innerHTML = '';
            container.style.padding = '0';
            container.style.display = 'flex';
            container.style.flexDirection = 'column';

            // 创建内容包装器（有padding）
            const contentWrapper = DOMHelper.createElement('div', {
                style: {
                    flex: '1',
                    padding: '30px',
                    overflow: 'auto'
                }
            });

            // 配置表单区域
            const configSection = DOMHelper.createCard();

            // AI提问前缀设置
            const prefixSection = this._createTextareaSettingItem(
                '前缀提示词',
                '点击"问豆包"按钮时，自动添加到题目前面的提示词。支持 \\n 换行符（如："请帮我解答这道题目：\\n"、"【来自超星学习通】\\n\\n"等）',
                'aiPromptPrefix',
                this.settings.aiPromptPrefix || ''
            );

            configSection.appendChild(prefixSection);

            // AI提问后缀设置
            const suffixSection = this._createTextareaSettingItem(
                '后缀提示词',
                '点击"问豆包"按钮时，自动添加到题目后面的提示词。支持 \\n 换行符（如："\\n\\n请给出详细解释"、"\\n---\\n需要步骤讲解"等）',
                'aiPromptSuffix',
                this.settings.aiPromptSuffix || ''
            );

            configSection.appendChild(suffixSection);

            // 豆包会话ID设置
            const chatIdSection = this._createTextSettingItem(
                '会话ID（可选）',
                '配置固定的豆包会话ID，每次打开同一个会话（浏览器可能自动聚焦已有标签页）。留空则每次新建标签页。示例：从 https://www.doubao.com/chat/32898162890824194 提取数字ID：32898162890824194',
                'aiChatId',
                this.settings.aiChatId || ''
            );

            configSection.appendChild(chatIdSection);

            container.appendChild(configSection);

            // 示例预览区域
            const previewSection = DOMHelper.createCard();

            const previewTitle = DOMHelper.createTitle('💡 实时预览');

            const previewHint = DOMHelper.createDescription('以下是应用前缀和后缀后的效果：', {
                marginTop: '0',
                marginBottom: '12px'
            });

            const previewContent = DOMHelper.createElement('pre', {
                id: 'ai-prompt-preview',
                style: {
                    fontSize: '13px',
                    color: '#2d3748',
                    lineHeight: '1.6',
                    whiteSpace: 'pre-wrap',
                    fontFamily: 'Consolas, Monaco, "Courier New", monospace',
                    backgroundColor: '#f7fafc',
                    padding: '16px',
                    borderRadius: '6px',
                    border: '1px solid #e2e8f0',
                    margin: '0',
                    overflow: 'auto',
                    maxHeight: '300px'
                }
            });

            // 更新预览内容的函数（处理 \n 转义）
            const updatePreview = () => {
                const prefix = (this.settings.aiPromptPrefix || '').replace(/\\n/g, '\n');
                const suffix = (this.settings.aiPromptSuffix || '').replace(/\\n/g, '\n');
                const sampleQuestion = '1. (单选题, 3分) 以下哪个是正确的？\nA. 选项A\nB. 选项B\nC. 选项C\nD. 选项D';
                previewContent.textContent = prefix + sampleQuestion + suffix;
            };

            // 初始预览
            updatePreview();

            // 监听输入变化更新预览
            const prefixTextarea = prefixSection.querySelector('textarea');
            const suffixTextarea = suffixSection.querySelector('textarea');

            if (prefixTextarea) {
                prefixTextarea.addEventListener('input', updatePreview);
            }
            if (suffixTextarea) {
                suffixTextarea.addEventListener('input', updatePreview);
            }

            previewSection.appendChild(previewTitle);
            previewSection.appendChild(previewHint);
            previewSection.appendChild(previewContent);
            
            contentWrapper.appendChild(configSection);
            contentWrapper.appendChild(previewSection);
            container.appendChild(contentWrapper);

            // 底部操作栏
            const actionBar = this._createFloatingActionBar({
                saveText: '💾 保存配置',
                onSave: async () => {
                    // 保存配置
                    try {
                        await this.dbManager.saveSetting('aiPromptPrefix', this.settings.aiPromptPrefix || '');
                        await this.dbManager.saveSetting('aiPromptSuffix', this.settings.aiPromptSuffix || '');
                        await this.dbManager.saveSetting('aiChatId', this.settings.aiChatId || '');
                        Logger.success('AI提问配置已保存');
                    } catch (error) {
                        console.error('保存失败:', error);
                        alert('❌ 保存失败，请重试');
                    }
                },
                resetText: '🔄 重置配置',
                onReset: () => {
                    // 重置配置
                    if (confirm('确定要重置AI提问配置吗？')) {
                        this.settings.aiPromptPrefix = '';
                        this.settings.aiPromptSuffix = '';
                        this.settings.aiChatId = '';
                        this.dbManager.saveSetting('aiPromptPrefix', '');
                        this.dbManager.saveSetting('aiPromptSuffix', '');
                        this.dbManager.saveSetting('aiChatId', '');
                        this._renderAIPromptPanel(container);
                    }
                }
            });

            container.appendChild(actionBar);
        }

        /**
         * 渲染导出设置面板
         */
        _renderExportSettingsPanel(container) {
            container.innerHTML = '';
            container.style.padding = '0';
            container.style.display = 'flex';
            container.style.flexDirection = 'column';

            // 创建内容包装器（有padding）
            const contentWrapper = DOMHelper.createElement('div', {
                style: {
                    flex: '1',
                    padding: '30px',
                    overflow: 'auto'
                }
            });

            // 加载导出设置
            const exportDefaults = this.config.get('exportSettings');
            const exportSettings = {
                exportFormat: this.settings.exportFormat ?? exportDefaults.exportFormat,
                fontFamily: this.settings.exportFontFamily ?? exportDefaults.fontFamily,
                fontSize: this.settings.exportFontSize ?? exportDefaults.fontSize,
                titleFontSize: this.settings.exportTitleFontSize ?? exportDefaults.titleFontSize,
                lineHeight: this.settings.exportLineHeight ?? exportDefaults.lineHeight,
                pageMargin: this.settings.exportPageMargin ?? exportDefaults.pageMargin,
                // 导出内容选项
                exportMyAnswer: this.settings.exportMyAnswer ?? exportDefaults.exportMyAnswer,
                exportCorrectAnswer: this.settings.exportCorrectAnswer ?? exportDefaults.exportCorrectAnswer,
                exportScore: this.settings.exportScore ?? exportDefaults.exportScore,
                exportAnalysis: this.settings.exportAnalysis ?? exportDefaults.exportAnalysis
            };

            // 提示说明区域
            const tipContainer = DOMHelper.createElement('div', {
                style: {
                    backgroundColor: '#ebf8ff',
                    borderRadius: '8px',
                    padding: '16px',
                    marginBottom: '20px',
                    border: '1px solid #bee3f8'
                }
            });

            const tipText = DOMHelper.createElement('div', {
                innerHTML: '💡 <strong>提示：</strong>使用「📄 导出试题（无答案）」按钮导出不带答案的试卷，使用「📝 导出试题（含答案）」按钮导出带答案的试卷。下方「导出内容选项」仅在导出含答案时生效。',
                style: {
                    fontSize: '14px',
                    color: '#2b6cb0',
                    lineHeight: '1.6'
                }
            });
            tipContainer.appendChild(tipText);
            container.appendChild(tipContainer);

            // ========== 导出格式选项区域 ==========
            const formatContainer = DOMHelper.createElement('div', {
                style: {
                    backgroundColor: 'white',
                    borderRadius: '8px',
                    padding: '24px',
                    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
                    marginBottom: '20px'
                }
            });

            const formatTitle = DOMHelper.createElement('h3', {
                innerText: '📝 导出格式',
                style: {
                    fontSize: '16px',
                    fontWeight: 'bold',
                    color: '#2d3748',
                    marginBottom: '16px'
                }
            });
            formatContainer.appendChild(formatTitle);

            // DOC 格式选项
            const docOption = DOMHelper.createElement('label', {
                style: {
                    display: 'flex',
                    alignItems: 'center',
                    marginBottom: '12px',
                    cursor: 'pointer',
                    padding: '8px',
                    borderRadius: '4px',
                    transition: 'background-color 0.2s'
                }
            });

            const docRadio = DOMHelper.createElement('input', {
                type: 'radio',
                name: 'exportFormat',
                value: 'doc',
                checked: exportSettings.exportFormat === 'doc',
                style: {
                    marginRight: '8px',
                    cursor: 'pointer'
                }
            });

            const docLabel = DOMHelper.createElement('span', {
                innerHTML: '<strong>DOC格式</strong> <span style="color: #718096; font-size: 13px;">（默认推荐，兼容性更好）</span>',
                style: {
                    fontSize: '14px',
                    color: '#2d3748'
                }
            });

            docOption.appendChild(docRadio);
            docOption.appendChild(docLabel);
            formatContainer.appendChild(docOption);

            // DOCX 格式选项
            const docxOption = DOMHelper.createElement('label', {
                style: {
                    display: 'flex',
                    alignItems: 'center',
                    marginBottom: '8px',
                    cursor: 'pointer',
                    padding: '8px',
                    borderRadius: '4px',
                    transition: 'background-color 0.2s'
                }
            });

            const docxRadio = DOMHelper.createElement('input', {
                type: 'radio',
                name: 'exportFormat',
                value: 'docx',
                checked: exportSettings.exportFormat === 'docx',
                style: {
                    marginRight: '8px',
                    cursor: 'pointer'
                }
            });

            const docxLabel = DOMHelper.createElement('span', {
                innerHTML: '<strong>DOCX格式</strong> <span style="color: #e53e3e; font-size: 13px;">（注意：在手机/平板上浏览docx可能出现空白或图片失效的bug）</span>',
                style: {
                    fontSize: '14px',
                    color: '#2d3748'
                }
            });

            docxOption.appendChild(docxRadio);
            docxOption.appendChild(docxLabel);
            formatContainer.appendChild(docxOption);

            // 监听格式选择变化
            docRadio.addEventListener('change', () => {
                if (docRadio.checked) {
                    this.settings.exportFormat = 'doc';
                }
            });

            docxRadio.addEventListener('change', () => {
                if (docxRadio.checked) {
                    this.settings.exportFormat = 'docx';
                }
            });

            // 悬停效果
            [docOption, docxOption].forEach(option => {
                option.addEventListener('mouseenter', () => {
                    option.style.backgroundColor = '#f7fafc';
                });
                option.addEventListener('mouseleave', () => {
                    option.style.backgroundColor = 'transparent';
                });
            });

            container.appendChild(formatContainer);

            // ========== 导出内容选项区域 ==========
            const contentContainer = DOMHelper.createElement('div', {
                style: {
                    backgroundColor: 'white',
                    borderRadius: '8px',
                    padding: '24px',
                    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
                    marginBottom: '20px'
                }
            });

            const contentTitle = DOMHelper.createTitle('📋 导出内容选项', {
                marginBottom: '20px',
                paddingBottom: '10px',
                borderBottom: '2px solid #4299e1'
            });
            contentContainer.appendChild(contentTitle);

            const contentDesc = DOMHelper.createDescription('选择导出含答案时包含哪些内容（导出无答案时此选项不生效）', {
                marginTop: '0',
                marginBottom: '16px'
            });
            contentContainer.appendChild(contentDesc);

            // 创建勾选框容器
            const checkboxGrid = DOMHelper.createElement('div', {
                style: {
                    display: 'grid',
                    gridTemplateColumns: 'repeat(2, 1fr)',
                    gap: '12px'
                }
            });

            // 我的答案
            const myAnswerCheckbox = this._createExportCheckboxItem(
                '我的答案',
                '导出时包含"我的答案"信息',
                'exportMyAnswer',
                exportSettings.exportMyAnswer
            );
            checkboxGrid.appendChild(myAnswerCheckbox);

            // 正确答案
            const correctAnswerCheckbox = this._createExportCheckboxItem(
                '正确答案',
                '导出时包含"正确答案"信息',
                'exportCorrectAnswer',
                exportSettings.exportCorrectAnswer
            );
            checkboxGrid.appendChild(correctAnswerCheckbox);

            // 本题得分
            const scoreCheckbox = this._createExportCheckboxItem(
                '本题得分',
                '导出时包含本题得分信息',
                'exportScore',
                exportSettings.exportScore
            );
            checkboxGrid.appendChild(scoreCheckbox);

            // 答案解析
            const analysisCheckbox = this._createExportCheckboxItem(
                '答案解析',
                '导出时包含答案解析内容',
                'exportAnalysis',
                exportSettings.exportAnalysis
            );
            checkboxGrid.appendChild(analysisCheckbox);

            contentContainer.appendChild(checkboxGrid);
            container.appendChild(contentContainer);

            // 样式设置区域
            const styleContainer = DOMHelper.createElement('div', {
                style: {
                    backgroundColor: 'white',
                    borderRadius: '8px',
                    padding: '24px',
                    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
                    marginBottom: '20px'
                }
            });

            const styleTitle = DOMHelper.createElement('div', {
                innerText: '🎨 样式设置',
                style: {
                    fontSize: '16px',
                    fontWeight: 'bold',
                    color: '#2d3748',
                    marginBottom: '20px',
                    paddingBottom: '10px',
                    borderBottom: '2px solid #48bb78'
                }
            });
            styleContainer.appendChild(styleTitle);

            // 字体选择
            const fontFamilySection = this._createExportSettingItem(
                '字体',
                '导出文档使用的字体',
                'select',
                'exportFontFamily',
                exportSettings.fontFamily,
                [
                    { value: '宋体', label: '宋体' },
                    { value: '黑体', label: '黑体' },
                    { value: '楷体', label: '楷体' },
                    { value: '仿宋', label: '仿宋' },
                    { value: '微软雅黑', label: '微软雅黑' },
                    { value: 'Arial', label: 'Arial' },
                    { value: 'Times New Roman', label: 'Times New Roman' }
                ]
            );
            styleContainer.appendChild(fontFamilySection);

            // 正文字号
            const fontSizeSection = this._createExportSettingItem(
                '正文字号',
                '导出文档正文的字体大小（pt）',
                'number',
                'exportFontSize',
                exportSettings.fontSize
            );
            styleContainer.appendChild(fontSizeSection);

            // 标题字号
            const titleFontSizeSection = this._createExportSettingItem(
                '标题字号',
                '导出文档标题的字体大小（pt）',
                'number',
                'exportTitleFontSize',
                exportSettings.titleFontSize
            );
            styleContainer.appendChild(titleFontSizeSection);

            // 行高
            const lineHeightSection = this._createExportSettingItem(
                '行高',
                '行与行之间的间距倍数',
                'number',
                'exportLineHeight',
                exportSettings.lineHeight,
                null,
                0.1  // step
            );
            styleContainer.appendChild(lineHeightSection);

            // 页边距
            const marginSection = this._createExportSettingItem(
                '页边距',
                '导出文档的页边距（格式：上 右 下 左）',
                'text',
                'exportPageMargin',
                exportSettings.pageMargin
            );
            styleContainer.appendChild(marginSection);

            contentWrapper.appendChild(contentContainer);
            contentWrapper.appendChild(styleContainer);
            container.appendChild(contentWrapper);

            // 添加统一的底部操作栏
            const actionBar = this._createFloatingActionBar({
                saveText: '💾 保存导出设置',
                onSave: async () => {
                    // 保存导出格式
                    await this.dbManager.saveSetting('exportFormat', this.settings.exportFormat ?? exportSettings.exportFormat);
                    // 保存样式设置
                    await this.dbManager.saveSetting('exportFontFamily', this.settings.exportFontFamily ?? exportSettings.fontFamily);
                    await this.dbManager.saveSetting('exportFontSize', this.settings.exportFontSize ?? exportSettings.fontSize);
                    await this.dbManager.saveSetting('exportTitleFontSize', this.settings.exportTitleFontSize ?? exportSettings.titleFontSize);
                    await this.dbManager.saveSetting('exportLineHeight', this.settings.exportLineHeight ?? exportSettings.lineHeight);
                    await this.dbManager.saveSetting('exportPageMargin', this.settings.exportPageMargin ?? exportSettings.pageMargin);
                    // 保存导出内容选项
                    await this.dbManager.saveSetting('exportMyAnswer', this.settings.exportMyAnswer ?? exportSettings.exportMyAnswer);
                    await this.dbManager.saveSetting('exportCorrectAnswer', this.settings.exportCorrectAnswer ?? exportSettings.exportCorrectAnswer);
                    await this.dbManager.saveSetting('exportScore', this.settings.exportScore ?? exportSettings.exportScore);
                    await this.dbManager.saveSetting('exportAnalysis', this.settings.exportAnalysis ?? exportSettings.exportAnalysis);
                    Logger.success('导出设置已保存');
                },
                onReset: async () => {
                    if (confirm('确定要重置导出设置为默认值吗？')) {
                        const defaults = this.config.get('exportSettings');
                        // 重置导出格式
                        this.settings.exportFormat = defaults.exportFormat;
                        // 重置样式设置
                        this.settings.exportFontFamily = defaults.fontFamily;
                        this.settings.exportFontSize = defaults.fontSize;
                        this.settings.exportTitleFontSize = defaults.titleFontSize;
                        this.settings.exportLineHeight = defaults.lineHeight;
                        this.settings.exportPageMargin = defaults.pageMargin;
                        // 重置导出内容选项
                        this.settings.exportMyAnswer = defaults.exportMyAnswer;
                        this.settings.exportCorrectAnswer = defaults.exportCorrectAnswer;
                        this.settings.exportScore = defaults.exportScore;
                        this.settings.exportAnalysis = defaults.exportAnalysis;
                        await this.dbManager.saveSetting('exportFontFamily', defaults.fontFamily);
                        await this.dbManager.saveSetting('exportFontSize', defaults.fontSize);
                        await this.dbManager.saveSetting('exportTitleFontSize', defaults.titleFontSize);
                        await this.dbManager.saveSetting('exportLineHeight', defaults.lineHeight);
                        await this.dbManager.saveSetting('exportPageMargin', defaults.pageMargin);
                        await this.dbManager.saveSetting('exportMyAnswer', defaults.exportMyAnswer);
                        await this.dbManager.saveSetting('exportCorrectAnswer', defaults.exportCorrectAnswer);
                        await this.dbManager.saveSetting('exportScore', defaults.exportScore);
                        await this.dbManager.saveSetting('exportAnalysis', defaults.exportAnalysis);
                        Logger.success('导出设置已重置');
                        this._renderExportSettingsPanel(container);
                    }
                },
                resetText: '🔄 重置导出设置'
            });
            container.appendChild(actionBar);
        }

        /**
         * 创建导出内容勾选框项
         */
        _createExportCheckboxItem(label, description, key, checked) {
            const item = DOMHelper.createElement('div', {
                style: {
                    display: 'flex',
                    alignItems: 'center',
                    padding: '12px',
                    backgroundColor: '#f7fafc',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    border: '1px solid #e2e8f0'
                }
            });

            const checkbox = DOMHelper.createElement('input', {
                type: 'checkbox',
                checked: checked,
                style: {
                    width: '18px',
                    height: '18px',
                    marginRight: '12px',
                    cursor: 'pointer',
                    accentColor: '#4299e1'
                }
            });

            const textContainer = DOMHelper.createElement('div', {
                style: {
                    flex: '1'
                }
            });

            const labelText = DOMHelper.createElement('div', {
                innerText: label,
                style: {
                    fontSize: '14px',
                    fontWeight: '600',
                    color: '#2d3748'
                }
            });

            const descText = DOMHelper.createElement('div', {
                innerText: description,
                style: {
                    fontSize: '12px',
                    color: '#718096',
                    marginTop: '2px'
                }
            });

            textContainer.appendChild(labelText);
            textContainer.appendChild(descText);

            // 点击整个项切换勾选状态
            item.addEventListener('click', (e) => {
                if (e.target !== checkbox) {
                    checkbox.checked = !checkbox.checked;
                }
                this.settings[key] = checkbox.checked;
                item.style.backgroundColor = checkbox.checked ? '#ebf8ff' : '#f7fafc';
                item.style.borderColor = checkbox.checked ? '#4299e1' : '#e2e8f0';
            });

            checkbox.addEventListener('change', () => {
                this.settings[key] = checkbox.checked;
                item.style.backgroundColor = checkbox.checked ? '#ebf8ff' : '#f7fafc';
                item.style.borderColor = checkbox.checked ? '#4299e1' : '#e2e8f0';
            });

            // 初始样式
            if (checked) {
                item.style.backgroundColor = '#ebf8ff';
                item.style.borderColor = '#4299e1';
            }

            // 悬停效果
            item.addEventListener('mouseenter', () => {
                item.style.boxShadow = '0 2px 4px rgba(0, 0, 0, 0.1)';
            });
            item.addEventListener('mouseleave', () => {
                item.style.boxShadow = 'none';
            });

            item.appendChild(checkbox);
            item.appendChild(textContainer);

            return item;
        }

        /**
         * 创建导出设置项
         */
        _createExportSettingItem(label, description, type, key, value, options = null, step = 1) {
            const item = DOMHelper.createElement('div', {
                style: {
                    marginBottom: '20px',
                    paddingBottom: '20px',
                    borderBottom: '1px solid #e2e8f0'
                }
            });

            const labelEl = DOMHelper.createElement('div', {
                style: {
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: '8px'
                }
            });

            const labelText = DOMHelper.createElement('span', {
                innerText: label,
                style: {
                    fontSize: '14px',
                    fontWeight: '600',
                    color: '#2d3748'
                }
            });

            let input;
            if (type === 'select' && options) {
                input = DOMHelper.createElement('select', {
                    style: {
                        width: '160px',
                        padding: '6px 12px',
                        border: '1px solid #cbd5e0',
                        borderRadius: '4px',
                        fontSize: '14px',
                        cursor: 'pointer',
                        backgroundColor: 'white'
                    }
                });

                options.forEach(opt => {
                    const option = DOMHelper.createElement('option', {
                        value: opt.value,
                        innerText: opt.label
                    });
                    if (opt.value === value) {
                        option.selected = true;
                    }
                    input.appendChild(option);
                });

                input.addEventListener('change', () => {
                    this.settings[key] = input.value;
                });
            } else if (type === 'number') {
                input = DOMHelper.createElement('input', {
                    type: 'number',
                    value: value,
                    step: step,
                    style: {
                        width: '100px',
                        padding: '6px 12px',
                        border: '1px solid #cbd5e0',
                        borderRadius: '4px',
                        fontSize: '14px',
                        textAlign: 'center'
                    }
                });

                input.addEventListener('change', () => {
                    const numValue = parseFloat(input.value);
                    if (numValue > 0) {
                        this.settings[key] = numValue;
                    }
                });
            } else if (type === 'text') {
                input = DOMHelper.createElement('input', {
                    type: 'text',
                    value: value,
                    style: {
                        width: '200px',
                        padding: '6px 12px',
                        border: '1px solid #cbd5e0',
                        borderRadius: '4px',
                        fontSize: '14px'
                    }
                });

                input.addEventListener('change', () => {
                    this.settings[key] = input.value;
                });
            }

            labelEl.appendChild(labelText);
            labelEl.appendChild(input);

            const desc = DOMHelper.createElement('div', {
                innerText: description,
                style: {
                    fontSize: '12px',
                    color: '#718096',
                    marginTop: '4px'
                }
            });

            item.appendChild(labelEl);
            item.appendChild(desc);

            return item;
        }

        /**
         * 渲染笔记管理面板
         */
        _renderNotesPanel(container) {
            container.innerHTML = '';
            container.style.padding = '0';

            if (this.notesList.length === 0) {
                const emptyMsg = DOMHelper.createElement('div', {
                    innerText: '📭 暂无笔记',
                    style: {
                        textAlign: 'center',
                        color: '#a0aec0',
                        padding: '60px 20px',
                        fontSize: '16px'
                    }
                });
                container.appendChild(emptyMsg);
                return;
            }

            // 操作栏
            const toolbar = DOMHelper.createElement('div', {
                style: {
                    padding: '15px 30px',
                    backgroundColor: 'white',
                    borderBottom: '1px solid #e2e8f0',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                }
            });

            const info = DOMHelper.createElement('span', {
                id: 'notes-info-text',
                innerText: `共 ${this.notesList.length} 条笔记`,
                style: {
                    fontSize: '14px',
                    color: '#718096'
                }
            });

            const actions = DOMHelper.createElement('div', {
                style: {
                    display: 'flex',
                    gap: '10px'
                }
            });

            // 时间排序按钮
            const timeSortBtn = DOMHelper.createElement('button', {
                innerText: this.notesSortBy === 'time'
                    ? (this.notesSortOrder === 'desc' ? '🕒 时间 ↓' : '🕒 时间 ↑')
                    : '🕒 时间',
                style: {
                    padding: '6px 12px',
                    border: '1px solid #cbd5e0',
                    borderRadius: '4px',
                    backgroundColor: this.notesSortBy === 'time' ? '#4299e1' : 'white',
                    color: this.notesSortBy === 'time' ? 'white' : '#4a5568',
                    cursor: 'pointer',
                    fontSize: '12px',
                    fontWeight: '500',
                    transition: 'all 0.2s'
                }
            });

            timeSortBtn.addEventListener('mouseenter', () => {
                timeSortBtn.style.transform = 'translateY(-1px)';
                timeSortBtn.style.boxShadow = '0 2px 4px rgba(0, 0, 0, 0.1)';
            });

            timeSortBtn.addEventListener('mouseleave', () => {
                timeSortBtn.style.transform = 'translateY(0)';
                timeSortBtn.style.boxShadow = 'none';
            });

            timeSortBtn.addEventListener('click', () => {
                if (this.notesSortBy === 'time') {
                    // 已经是时间排序，切换升降序
                    this.notesSortOrder = this.notesSortOrder === 'desc' ? 'asc' : 'desc';
                } else {
                    // 切换到时间排序，默认降序（最新在前）
                    this.notesSortBy = 'time';
                    this.notesSortOrder = 'desc';
                }
                this._sortNotes();
                this._renderContent();
            });

            // 字母排序按钮
            const alphaSortBtn = DOMHelper.createElement('button', {
                innerText: this.notesSortBy === 'alpha'
                    ? (this.notesSortOrder === 'asc' ? '🔤 字母 ↑' : '🔤 字母 ↓')
                    : '🔤 字母',
                style: {
                    padding: '6px 12px',
                    border: '1px solid #cbd5e0',
                    borderRadius: '4px',
                    backgroundColor: this.notesSortBy === 'alpha' ? '#48bb78' : 'white',
                    color: this.notesSortBy === 'alpha' ? 'white' : '#4a5568',
                    cursor: 'pointer',
                    fontSize: '12px',
                    fontWeight: '500',
                    transition: 'all 0.2s'
                }
            });

            alphaSortBtn.addEventListener('mouseenter', () => {
                alphaSortBtn.style.transform = 'translateY(-1px)';
                alphaSortBtn.style.boxShadow = '0 2px 4px rgba(0, 0, 0, 0.1)';
            });

            alphaSortBtn.addEventListener('mouseleave', () => {
                alphaSortBtn.style.transform = 'translateY(0)';
                alphaSortBtn.style.boxShadow = 'none';
            });

            alphaSortBtn.addEventListener('click', () => {
                if (this.notesSortBy === 'alpha') {
                    // 已经是字母排序，切换升降序
                    this.notesSortOrder = this.notesSortOrder === 'asc' ? 'desc' : 'asc';
                } else {
                    // 切换到字母排序，默认升序（A-Z）
                    this.notesSortBy = 'alpha';
                    this.notesSortOrder = 'asc';
                }
                this._sortNotes();
                this._renderContent();
            });

            const selectAllBtn = DOMHelper.createElement('button', {
                innerText: '全选',
                style: {
                    padding: '6px 12px',
                    border: '1px solid #cbd5e0',
                    borderRadius: '4px',
                    backgroundColor: 'white',
                    cursor: 'pointer',
                    fontSize: '12px',
                    fontWeight: '500',
                    transition: 'all 0.2s'
                }
            });

            selectAllBtn.addEventListener('mouseenter', () => {
                selectAllBtn.style.transform = 'translateY(-1px)';
                selectAllBtn.style.boxShadow = '0 2px 4px rgba(0, 0, 0, 0.1)';
            });

            selectAllBtn.addEventListener('mouseleave', () => {
                selectAllBtn.style.transform = 'translateY(0)';
                selectAllBtn.style.boxShadow = 'none';
            });

            const deleteBtn = DOMHelper.createElement('button', {
                innerText: '删除选中',
                style: {
                    padding: '6px 12px',
                    border: 'none',
                    borderRadius: '4px',
                    backgroundColor: '#f56565',
                    color: 'white',
                    cursor: 'pointer',
                    fontSize: '12px',
                    fontWeight: '500',
                    transition: 'all 0.2s'
                }
            });

            deleteBtn.addEventListener('mouseenter', () => {
                deleteBtn.style.backgroundColor = '#e53e3e';
                deleteBtn.style.transform = 'translateY(-1px)';
            });

            deleteBtn.addEventListener('mouseleave', () => {
                deleteBtn.style.backgroundColor = '#f56565';
                deleteBtn.style.transform = 'translateY(0)';
            });

            selectAllBtn.addEventListener('click', () => this._toggleSelectAll());
            deleteBtn.addEventListener('click', () => this._deleteSelected());

            actions.appendChild(timeSortBtn);
            actions.appendChild(alphaSortBtn);
            actions.appendChild(selectAllBtn);
            actions.appendChild(deleteBtn);
            toolbar.appendChild(info);
            toolbar.appendChild(actions);

            // 笔记列表
            const notesList = DOMHelper.createElement('div', {
                id: 'notes-list-content',
                style: {
                    padding: '20px 30px',
                    overflow: 'auto',
                    flex: '1'
                }
            });

            if (this.notesScope === 'current') {
                // 当前页面：直接显示笔记列表
                this.notesList.forEach(note => {
                    const noteItem = this._createNoteItem(note);
                    notesList.appendChild(noteItem);
                });
            } else {
                // 其他范围：按 workKey 分组显示
                const groupedNotes = this._groupNotesByWorkKey(this.notesList);
                Object.entries(groupedNotes).forEach(([workKey, notes]) => {
                    const group = this._createNotesGroup(workKey, notes);
                    notesList.appendChild(group);
                });
            }

            container.appendChild(toolbar);
            container.appendChild(notesList);
        }

        /**
         * 创建笔记项
         */
        _createNoteItem(note) {
            const item = DOMHelper.createElement('div', {
                style: {
                    padding: '16px',
                    marginBottom: '12px',
                    border: '1px solid #e2e8f0',
                    borderRadius: '8px',
                    backgroundColor: this.selectedNotes.has(note.id) ? '#ebf8ff' : 'white',
                    cursor: 'pointer',
                    transition: 'all 0.2s'
                }
            });

            item.addEventListener('mouseenter', () => {
                if (!this.selectedNotes.has(note.id)) {
                    item.style.backgroundColor = '#f7fafc';
                }
            });

            item.addEventListener('mouseleave', () => {
                if (!this.selectedNotes.has(note.id)) {
                    item.style.backgroundColor = 'white';
                }
            });

            const header = DOMHelper.createElement('div', {
                style: {
                    display: 'flex',
                    alignItems: 'center',
                    marginBottom: '10px',
                    gap: '10px'
                }
            });

            const checkbox = DOMHelper.createElement('input', {
                type: 'checkbox',
                checked: this.selectedNotes.has(note.id),
                style: {
                    width: '16px',
                    height: '16px',
                    cursor: 'pointer'
                }
            });

            checkbox.addEventListener('change', (e) => {
                e.stopPropagation();
                if (checkbox.checked) {
                    this.selectedNotes.add(note.id);
                    item.style.backgroundColor = '#ebf8ff';
                } else {
                    this.selectedNotes.delete(note.id);
                    item.style.backgroundColor = 'white';
                }
                this._updateNotesInfo();
            });

            // 格式化题目标题（包含题号）
            const questionNo = note.questionNo || '999';
            const questionIdShort = note.questionId.replace('question', 'Question');
            const questionTitle = `${questionIdShort}_No${questionNo}`;
            
            const questionId = DOMHelper.createElement('span', {
                innerText: questionTitle,
                style: {
                    fontSize: '14px',
                    fontWeight: '600',
                    color: '#4299e1',
                    flex: '1'
                }
            });

            const time = DOMHelper.createElement('span', {
                innerText: new Date(note.timestamp).toLocaleString('zh-CN'),
                style: {
                    fontSize: '12px',
                    color: '#a0aec0'
                }
            });

            header.appendChild(checkbox);
            header.appendChild(questionId);
            header.appendChild(time);

            const content = DOMHelper.createElement('div', {
                innerText: note.content || '(空笔记)',
                style: {
                    fontSize: '14px',
                    color: note.content ? '#2d3748' : '#a0aec0',
                    lineHeight: '1.6',
                    maxHeight: '80px',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'pre-wrap'
                }
            });

            item.appendChild(header);
            item.appendChild(content);

            item.addEventListener('click', (e) => {
                if (e.target !== checkbox) {
                    checkbox.checked = !checkbox.checked;
                    checkbox.dispatchEvent(new Event('change'));
                }
            });

            return item;
        }

        /**
         * 切换全选
         */
        _toggleSelectAll() {
            if (this.selectedNotes.size === this.notesList.length) {
                this.selectedNotes.clear();
            } else {
                this.notesList.forEach(note => this.selectedNotes.add(note.id));
            }
            this._renderContent();
        }

        /**
         * 删除选中的笔记
         */
        async _deleteSelected() {
            if (this.selectedNotes.size === 0) {
                alert('请先选择要删除的笔记');
                return;
            }

            if (!confirm(`确定要删除选中的 ${this.selectedNotes.size} 条笔记吗？\n此操作不可恢复！`)) {
                return;
            }

            try {
                const noteIds = Array.from(this.selectedNotes);
                await this.dbManager.deleteNotes(noteIds);
                Logger.success(`已删除 ${noteIds.length} 条笔记`);

                this.selectedNotes.clear();
                await this._loadNotes();
                this._renderContent();
            } catch (error) {
                Logger.error('删除笔记失败', error);
                alert('删除笔记失败，请查看控制台了解详情');
            }
        }

        /**
         * 更新笔记信息
         */
        _updateNotesInfo() {
            const info = document.getElementById('notes-info-text');
            if (info) {
                const selectedText = this.selectedNotes.size > 0 ? `，已选中 ${this.selectedNotes.size} 条` : '';
                info.innerText = `共 ${this.notesList.length} 条笔记${selectedText}`;
            }
        }

        /**
         * 按 workKey 分组笔记
         */
        _groupNotesByWorkKey(notes) {
            const groups = {};
            notes.forEach(note => {
                if (!groups[note.workKey]) {
                    groups[note.workKey] = [];
                }
                groups[note.workKey].push(note);
            });
            // 按时间戳排序每个组
            Object.keys(groups).forEach(key => {
                groups[key].sort((a, b) => b.timestamp - a.timestamp);
            });
            return groups;
        }

        /**
         * 排序笔记
         */
        _sortNotes() {
            if (this.notesSortBy === 'time') {
                // 按时间排序
                if (this.notesSortOrder === 'desc') {
                    // 降序：最新在前
                    this.notesList.sort((a, b) => b.timestamp - a.timestamp);
                } else {
                    // 升序：最旧在前
                    this.notesList.sort((a, b) => a.timestamp - b.timestamp);
                }
            } else {
                // 按 questionId 字母序
                this.notesList.sort((a, b) => {
                    const idA = a.questionId.toLowerCase();
                    const idB = b.questionId.toLowerCase();
                    if (this.notesSortOrder === 'asc') {
                        // 升序：A-Z
                        return idA.localeCompare(idB);
                    } else {
                        // 降序：Z-A
                        return idB.localeCompare(idA);
                    }
                });
            }
        }

        /**
         * 创建笔记组（用于域名模式）
         */
        _createNotesGroup(workKey, notes) {
            const group = DOMHelper.createElement('div', {
                style: {
                    marginBottom: '30px'
                }
            });

            // 组标题
            const groupHeader = DOMHelper.createElement('div', {
                style: {
                    padding: '12px 16px',
                    backgroundColor: '#e3f2fd',
                    borderRadius: '8px',
                    marginBottom: '12px',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    cursor: 'pointer',
                    transition: 'all 0.2s'
                }
            });

            const headerLeft = DOMHelper.createElement('div', {
                style: {
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px'
                }
            });

            const collapseIcon = DOMHelper.createElement('span', {
                innerText: '▼',
                style: {
                    fontSize: '12px',
                    color: '#1976d2',
                    transition: 'transform 0.2s'
                }
            });

            // 格式化 workKey 显示
            const parts = workKey.split('_');
            let displayText = '📄 ';
            if (parts.length === 3) {
                displayText += `Course${parts[0]}_Class${parts[1]}_Work${parts[2]}`;
            } else {
                displayText += workKey;
            }

            const groupTitle = DOMHelper.createElement('span', {
                innerText: displayText,
                style: {
                    fontSize: '14px',
                    fontWeight: '600',
                    color: '#1976d2'
                }
            });

            const groupCount = DOMHelper.createElement('span', {
                innerText: `(${notes.length} 条)`,
                style: {
                    fontSize: '13px',
                    color: '#64b5f6',
                    marginLeft: '8px'
                }
            });

            headerLeft.appendChild(collapseIcon);
            headerLeft.appendChild(groupTitle);
            headerLeft.appendChild(groupCount);

            // 全选此组的按钮
            const selectGroupBtn = DOMHelper.createElement('button', {
                innerText: '全选',
                style: {
                    padding: '4px 10px',
                    border: '1px solid #2196f3',
                    borderRadius: '4px',
                    backgroundColor: 'white',
                    color: '#2196f3',
                    cursor: 'pointer',
                    fontSize: '12px',
                    fontWeight: '500',
                    transition: 'all 0.2s'
                }
            });

            selectGroupBtn.addEventListener('mouseenter', () => {
                selectGroupBtn.style.transform = 'translateY(-1px)';
                selectGroupBtn.style.boxShadow = '0 2px 4px rgba(0, 0, 0, 0.1)';
            });

            selectGroupBtn.addEventListener('mouseleave', () => {
                selectGroupBtn.style.transform = 'translateY(0)';
                selectGroupBtn.style.boxShadow = 'none';
            });

            selectGroupBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                const allSelected = notes.every(note => this.selectedNotes.has(note.id));
                if (allSelected) {
                    notes.forEach(note => this.selectedNotes.delete(note.id));
                    selectGroupBtn.innerText = '全选';
                } else {
                    notes.forEach(note => this.selectedNotes.add(note.id));
                    selectGroupBtn.innerText = '取消';
                }
                this._renderContent();
            });

            groupHeader.appendChild(headerLeft);
            groupHeader.appendChild(selectGroupBtn);

            // 笔记列表容器
            const notesContainer = DOMHelper.createElement('div', {
                style: {
                    display: 'block',
                    paddingLeft: '20px'
                }
            });

            notes.forEach(note => {
                const noteItem = this._createNoteItem(note);
                notesContainer.appendChild(noteItem);
            });

            // 折叠/展开功能
            let isCollapsed = false;
            groupHeader.addEventListener('click', (e) => {
                if (e.target === selectGroupBtn) return;
                isCollapsed = !isCollapsed;
                notesContainer.style.display = isCollapsed ? 'none' : 'block';
                collapseIcon.style.transform = isCollapsed ? 'rotate(-90deg)' : 'rotate(0deg)';
            });

            group.appendChild(groupHeader);
            group.appendChild(notesContainer);

            return group;
        }

        /**
         * 渲染样式管理面板
         */
        async _renderStylesPanel(container) {
            container.innerHTML = '';
            container.style.padding = '0';
            container.style.display = 'flex';
            container.style.flexDirection = 'column';

            // 样式配置的分类
            const styleCategories = [
                {
                    title: '答案按钮样式',
                    key: 'answerButton',
                    fields: [
                        // 位置配置
                        { name: 'marginLeft', label: '左边距', type: 'text', path: 'position.marginLeft' },
                        { name: 'marginTop', label: '上边距', type: 'text', path: 'position.marginTop' },
                        // 尺寸配置
                        { name: 'fontSize', label: '字体大小', type: 'text', path: 'style.fontSize' },
                        { name: 'padding', label: '内边距', type: 'text', path: 'style.padding' },
                        { name: 'borderRadius', label: '圆角半径', type: 'text', path: 'style.borderRadius' },
                        { name: 'fontWeight', label: '字体粗细', type: 'text', path: 'style.fontWeight' },
                        // 颜色配置
                        { name: 'showBackground', label: '显示按钮背景色', type: 'color', path: 'colors.showBackground' },
                        { name: 'hideBackground', label: '隐藏按钮背景色', type: 'color', path: 'colors.hideBackground' },
                        { name: 'showHoverBackground', label: '显示按钮悬停色', type: 'color', path: 'colors.showHoverBackground' },
                        { name: 'hideHoverBackground', label: '隐藏按钮悬停色', type: 'color', path: 'colors.hideHoverBackground' }
                    ]
                },
                {
                    title: '笔记按钮样式',
                    key: 'noteButton',
                    fields: [
                        // 位置配置
                        { name: 'marginLeft', label: '左边距', type: 'text', path: 'position.marginLeft' },
                        { name: 'marginTop', label: '上边距', type: 'text', path: 'position.marginTop' },
                        // 尺寸配置
                        { name: 'fontSize', label: '字体大小', type: 'text', path: 'style.fontSize' },
                        { name: 'padding', label: '内边距', type: 'text', path: 'style.padding' },
                        { name: 'borderRadius', label: '圆角半径', type: 'text', path: 'style.borderRadius' },
                        { name: 'fontWeight', label: '字体粗细', type: 'text', path: 'style.fontWeight' },
                        // 颜色配置
                        { name: 'showBackground', label: '显示按钮背景色', type: 'color', path: 'colors.showBackground' },
                        { name: 'hideBackground', label: '隐藏按钮背景色', type: 'color', path: 'colors.hideBackground' },
                        { name: 'showHoverBackground', label: '显示按钮悬停色', type: 'color', path: 'colors.showHoverBackground' },
                        { name: 'hideHoverBackground', label: '隐藏按钮悬停色', type: 'color', path: 'colors.hideHoverBackground' }
                    ]
                },
                {
                    title: '编辑按钮样式',
                    key: 'editModeButton',
                    fields: [
                        // 位置配置
                        { name: 'marginLeft', label: '左边距', type: 'text', path: 'position.marginLeft' },
                        { name: 'marginTop', label: '上边距', type: 'text', path: 'position.marginTop' },
                        // 尺寸配置
                        { name: 'fontSize', label: '字体大小', type: 'text', path: 'style.fontSize' },
                        { name: 'padding', label: '内边距', type: 'text', path: 'style.padding' },
                        { name: 'borderRadius', label: '圆角半径', type: 'text', path: 'style.borderRadius' },
                        { name: 'fontWeight', label: '字体粗细', type: 'text', path: 'style.fontWeight' },
                        // 颜色配置
                        { name: 'editBackground', label: '编辑模式背景色', type: 'color', path: 'colors.editBackground' },
                        { name: 'previewBackground', label: '预览模式背景色', type: 'color', path: 'colors.previewBackground' },
                        { name: 'editHoverBackground', label: '编辑模式悬停色', type: 'color', path: 'colors.editHoverBackground' },
                        { name: 'previewHoverBackground', label: '预览模式悬停色', type: 'color', path: 'colors.previewHoverBackground' }
                    ]
                },
                {
                    title: '保存按钮样式',
                    key: 'saveNoteButton',
                    fields: [
                        // 位置配置
                        { name: 'marginLeft', label: '左边距', type: 'text', path: 'position.marginLeft' },
                        { name: 'marginTop', label: '上边距', type: 'text', path: 'position.marginTop' },
                        // 尺寸配置
                        { name: 'fontSize', label: '字体大小', type: 'text', path: 'style.fontSize' },
                        { name: 'padding', label: '内边距', type: 'text', path: 'style.padding' },
                        { name: 'borderRadius', label: '圆角半径', type: 'text', path: 'style.borderRadius' },
                        { name: 'fontWeight', label: '字体粗细', type: 'text', path: 'style.fontWeight' },
                        // 颜色配置
                        { name: 'background', label: '背景色', type: 'color', path: 'colors.background' },
                        { name: 'hoverBackground', label: '悬停背景色', type: 'color', path: 'colors.hoverBackground' }
                    ]
                },
                {
                    title: '全局按钮样式',
                    key: 'globalButton',
                    fields: [
                        // 位置配置
                        { name: 'top', label: '距顶部距离', type: 'text', path: 'position.top' },
                        { name: 'right', label: '距右侧距离', type: 'text', path: 'position.right' },
                        // 尺寸配置
                        { name: 'fontSize', label: '字体大小', type: 'text', path: 'style.fontSize' },
                        { name: 'padding', label: '内边距', type: 'text', path: 'style.padding' },
                        { name: 'borderRadius', label: '圆角半径', type: 'text', path: 'style.borderRadius' },
                        { name: 'fontWeight', label: '字体粗细', type: 'text', path: 'style.fontWeight' },
                        // 颜色配置
                        { name: 'showAllBackground', label: '显示全部背景色', type: 'color', path: 'colors.showAllBackground' },
                        { name: 'hideAllBackground', label: '隐藏全部背景色', type: 'color', path: 'colors.hideAllBackground' },
                        { name: 'showAllHoverBackground', label: '显示全部悬停色', type: 'color', path: 'colors.showAllHoverBackground' },
                        { name: 'hideAllHoverBackground', label: '隐藏全部悬停色', type: 'color', path: 'colors.hideAllHoverBackground' }
                    ]
                },
                {
                    title: '控制面板按钮样式',
                    key: 'manageButton',
                    fields: [
                        // 位置配置
                        { name: 'top', label: '距顶部距离', type: 'text', path: 'position.top' },
                        { name: 'right', label: '距右侧距离', type: 'text', path: 'position.right' },
                        // 尺寸配置
                        { name: 'fontSize', label: '字体大小', type: 'text', path: 'style.fontSize' },
                        { name: 'padding', label: '内边距', type: 'text', path: 'style.padding' },
                        { name: 'borderRadius', label: '圆角半径', type: 'text', path: 'style.borderRadius' },
                        { name: 'fontWeight', label: '字体粗细', type: 'text', path: 'style.fontWeight' },
                        // 颜色配置
                        { name: 'background', label: '背景色', type: 'color', path: 'colors.background' },
                        { name: 'hoverBackground', label: '悬停背景色', type: 'color', path: 'colors.hoverBackground' }
                    ]
                },
                {
                    title: '笔记编辑器样式',
                    key: 'noteEditor',
                    fields: [
                        { name: 'width', label: '宽度', type: 'text', path: 'width' },
                        { name: 'minHeight', label: '最小高度', type: 'text', path: 'minHeight' },
                        { name: 'maxHeight', label: '最大高度', type: 'text', path: 'maxHeight' },
                        { name: 'fontSize', label: '字体大小', type: 'text', path: 'fontSize' },
                        { name: 'backgroundColor', label: '背景色', type: 'color', path: 'backgroundColor' },
                        { name: 'borderColor', label: '边框颜色', type: 'color', path: 'borderColor' }
                    ]
                }
            ];

            // 加载已保存的样式配置
            const savedStyles = await this.dbManager.getSetting('customStyles', {});

            // 创建滚动容器
            const scrollContainer = DOMHelper.createElement('div', {
                style: {
                    overflow: 'auto',
                    padding: '20px'
                }
            });

            // 为每个分类创建配置区块
            styleCategories.forEach(category => {
                const section = this._createStyleSection(category, savedStyles);
                scrollContainer.appendChild(section);
            });

            container.appendChild(scrollContainer);

            // 添加统一的底部操作栏
            const actionBar = this._createFloatingActionBar({
                saveText: '💾 保存样式设置',
                onSave: async () => {
                    const customStyles = {};

                    // 收集所有表单数据
                    styleCategories.forEach(category => {
                        category.fields.forEach(field => {
                            const input = document.getElementById(`style-${category.key}-${field.name}`);
                            if (input && input.value) {
                                if (!customStyles[category.key]) {
                                    customStyles[category.key] = {};
                                }
                                // 设置嵌套属性
                                const pathParts = field.path.split('.');
                                let target = customStyles[category.key];
                                for (let i = 0; i < pathParts.length - 1; i++) {
                                    if (!target[pathParts[i]]) {
                                        target[pathParts[i]] = {};
                                    }
                                    target = target[pathParts[i]];
                                }
                                target[pathParts[pathParts.length - 1]] = input.value;
                            }
                        });
                    });

                    await this.dbManager.saveSetting('customStyles', customStyles);
                    Logger.success('样式已保存，刷新页面后生效');
                },
                onReset: async () => {
                    if (confirm('确定要重置所有样式为默认值吗？')) {
                        await this.dbManager.saveSetting('customStyles', {});
                        Logger.success('样式已重置');
                        this._renderStylesPanel(container);
                    }
                },
                resetText: '🔄 重置样式设置'
            });
            container.appendChild(actionBar);
        }

        /**
         * 创建样式配置区块
         */
        _createStyleSection(category, savedStyles) {
            const section = DOMHelper.createCard({
                padding: '20px'
            });

            const title = DOMHelper.createTitle(category.title, {
                tag: 'h3',
                margin: '0 0 16px 0',
                fontWeight: '600',
                borderBottom: '2px solid #4299e1',
                paddingBottom: '8px'
            });

            section.appendChild(title);

            category.fields.forEach(field => {
                const fieldGroup = DOMHelper.createFlexContainer({
                    justify: 'space-between',
                    marginBottom: '16px'
                });

                const label = DOMHelper.createElement('label', {
                    innerText: field.label,
                    style: {
                        fontSize: '14px',
                        color: '#4a5568',
                        fontWeight: '500',
                        flex: '1'
                    }
                });

                // 获取当前值（优先使用保存的值，否则使用默认配置值）
                let currentValue;
                if (savedStyles[category.key]) {
                    const pathParts = field.path.split('.');
                    let value = savedStyles[category.key];
                    for (let part of pathParts) {
                        value = value?.[part];
                    }
                    currentValue = value;
                }

                if (!currentValue) {
                    const pathParts = field.path.split('.');
                    let value = this.config.get(category.key);
                    for (let part of pathParts) {
                        value = value?.[part];
                    }
                    currentValue = value || '';
                }

                const input = DOMHelper.createElement('input', {
                    type: field.type,
                    value: currentValue,
                    id: `style-${category.key}-${field.name}`,
                    style: {
                        width: field.type === 'color' ? '60px' : '150px',
                        padding: '6px 10px',
                        border: '1px solid #cbd5e0',
                        borderRadius: '4px',
                        fontSize: '13px'
                    }
                });

                fieldGroup.appendChild(label);
                fieldGroup.appendChild(input);
                section.appendChild(fieldGroup);
            });

            return section;
        }

        /**
         * 关闭模态框
         */
        _close() {
            if (this.modal && this.modal.parentNode) {
                document.body.removeChild(this.modal);
                this.modal = null;
            }
        }
    }

    // ===================== DOM 工具类 =====================
    class DOMHelper {
        static createElement(tag, attributes = {}) {
            const element = document.createElement(tag);
            Object.entries(attributes).forEach(([key, value]) => {
                if (key === 'style' && typeof value === 'object') {
                    Object.assign(element.style, value);
                } else if (key === 'dataset' && typeof value === 'object') {
                    Object.entries(value).forEach(([dataKey, dataValue]) => {
                        element.dataset[dataKey] = dataValue;
                    });
                } else {
                    element[key] = value;
                }
            });
            return element;
        }

        static insertElement(element, parent, nextSibling = null) {
            if (nextSibling) {
                parent.insertBefore(element, nextSibling);
            } else {
                parent.appendChild(element);
            }
        }

        static removeElement(element) {
            element?.parentNode?.removeChild(element);
        }

        static ensureRelativePosition(element) {
            if (getComputedStyle(element).position === 'static') {
                element.style.position = 'relative';
            }
        }

        // ========== 通用 UI 组件工厂方法 ==========

        /**
         * 创建带圆角阴影的容器
         * @param {Object} options - 配置选项
         * @returns {HTMLElement}
         */
        static createCard(options = {}) {
            const {
                padding = '24px',
                marginBottom = '20px',
                backgroundColor = 'white',
                borderRadius = '8px',
                boxShadow = '0 1px 3px rgba(0, 0, 0, 0.1)',
                ...otherStyles
            } = options;

            return this.createElement('div', {
                style: {
                    backgroundColor,
                    borderRadius,
                    padding,
                    boxShadow,
                    marginBottom,
                    ...otherStyles
                }
            });
        }

        /**
         * 创建标题元素
         * @param {string} text - 标题文本
         * @param {Object} options - 配置选项
         * @returns {HTMLElement}
         */
        static createTitle(text, options = {}) {
            const {
                tag = 'div',
                fontSize = '16px',
                fontWeight = 'bold',
                color = '#2d3748',
                marginBottom = '16px',
                ...otherStyles
            } = options;

            return this.createElement(tag, {
                innerText: text,
                style: {
                    fontSize,
                    fontWeight,
                    color,
                    marginBottom,
                    ...otherStyles
                }
            });
        }

        /**
         * 创建描述文本元素
         * @param {string} text - 描述文本
         * @param {Object} options - 配置选项
         * @returns {HTMLElement}
         */
        static createDescription(text, options = {}) {
            const {
                fontSize = '13px',
                color = '#718096',
                marginTop = '6px',
                lineHeight = '1.5',
                ...otherStyles
            } = options;

            return this.createElement('div', {
                innerText: text,
                style: {
                    fontSize,
                    color,
                    marginTop,
                    lineHeight,
                    ...otherStyles
                }
            });
        }

        /**
         * 创建按钮元素
         * @param {string} text - 按钮文本
         * @param {Function} onClick - 点击回调
         * @param {Object} options - 配置选项
         * @returns {HTMLElement}
         */
        static createButton(text, onClick, options = {}) {
            const {
                padding = '8px 16px',
                fontSize = '13px',
                fontWeight = '500',
                borderRadius = '6px',
                border = 'none',
                backgroundColor = '#4299e1',
                color = 'white',
                cursor = 'pointer',
                transition = 'all 0.2s',
                ...otherStyles
            } = options;

            const button = this.createElement('button', {
                innerText: text,
                style: {
                    padding,
                    fontSize,
                    fontWeight,
                    borderRadius,
                    border,
                    backgroundColor,
                    color,
                    cursor,
                    transition,
                    ...otherStyles
                }
            });

            if (onClick) {
                button.addEventListener('click', onClick);
            }

            return button;
        }

        /**
         * 创建带悬停效果的按钮
         * @param {string} text - 按钮文本
         * @param {Function} onClick - 点击回调
         * @param {Object} options - 配置选项
         * @returns {HTMLElement}
         */
        static createHoverButton(text, onClick, options = {}) {
            const {
                hoverBg,
                normalBg,
                hoverTransform = 'translateY(-1px)',
                hoverShadow = '0 4px 8px rgba(0, 0, 0, 0.15)',
                normalShadow = '0 2px 4px rgba(0, 0, 0, 0.1)',
                ...otherOptions
            } = options;

            const button = this.createButton(text, onClick, {
                ...otherOptions,
                boxShadow: normalShadow
            });

            // 添加悬停效果
            if (hoverBg || normalBg) {
                button.addEventListener('mouseenter', () => {
                    if (hoverBg) button.style.backgroundColor = hoverBg;
                    button.style.transform = hoverTransform;
                    button.style.boxShadow = hoverShadow;
                });

                button.addEventListener('mouseleave', () => {
                    if (normalBg) button.style.backgroundColor = normalBg;
                    button.style.transform = 'translateY(0)';
                    button.style.boxShadow = normalShadow;
                });
            }

            return button;
        }

        /**
         * 创建 flex 容器
         * @param {Object} options - 配置选项
         * @returns {HTMLElement}
         */
        static createFlexContainer(options = {}) {
            const {
                direction = 'row',
                justify = 'flex-start',
                align = 'center',
                gap = '8px',
                ...otherStyles
            } = options;

            return this.createElement('div', {
                style: {
                    display: 'flex',
                    flexDirection: direction,
                    justifyContent: justify,
                    alignItems: align,
                    gap,
                    ...otherStyles
                }
            });
        }
    }

    // ===================== 样式生成器 =====================
    class StyleGenerator {
        constructor(config) {
            this.config = config;
        }

        // ========== 通用按钮样式生成方法 ==========

        /**
         * 生成内联按钮样式（答案、笔记、保存、编辑等按钮）
         * @param {string} configKey - 配置键名（如 'answerButton', 'noteButton'）
         * @param {string} bgColorKey - 背景色配置键名
         * @returns {Object} 样式对象
         */
        _getInlineButtonStyle(configKey, bgColorKey) {
            const position = this.config.get(`${configKey}.position`);
            const style = this.config.get(`${configKey}.style`);
            const colors = this.config.get(`${configKey}.colors`);

            const result = {
                marginLeft: position.marginLeft,
                marginRight: position.marginRight,
                marginTop: position.marginTop,
                marginBottom: position.marginBottom,
                verticalAlign: position.verticalAlign,
                padding: style.padding,
                border: style.border,
                borderRadius: style.borderRadius,
                background: colors[bgColorKey],
                color: colors.textColor,
                fontSize: style.fontSize,
                fontWeight: style.fontWeight,
                cursor: style.cursor,
                transition: style.transition,
                boxShadow: style.boxShadow,
                display: 'inline-block'
            };

            // 可选属性：minWidth 和 textAlign
            if (style.minWidth) {
                result.minWidth = style.minWidth;
            }
            if (style.textAlign) {
                result.textAlign = style.textAlign;
            }

            return result;
        }

        /**
         * 生成浮动按钮样式（全局、控制面板按钮）
         * @param {string} configKey - 配置键名
         * @param {string} bgColorKey - 背景色配置键名
         * @returns {Object} 样式对象
         */
        _getFloatingButtonStyle(configKey, bgColorKey) {
            const style = this.config.get(`${configKey}.style`);
            const colors = this.config.get(`${configKey}.colors`);

            return {
                display: 'inline-block',
                whiteSpace: 'nowrap',
                border: style.border,
                borderRadius: style.borderRadius,
                padding: style.padding,
                fontSize: style.fontSize,
                fontWeight: style.fontWeight,
                color: colors.textColor,
                cursor: style.cursor,
                transition: style.transition,
                boxShadow: style.boxShadow,
                background: colors[bgColorKey]
            };
        }

        // ========== 具体按钮样式获取方法 ==========

        getCopyButtonStyle() {
            const position = this.config.get('copyButton.position');
            const style = this.config.get('copyButton.style');
            const colors = this.config.get('copyButton.colors');

            return {
                position: 'absolute',
                top: position.top,
                right: position.right,
                zIndex: '100',
                fontSize: style.fontSize,
                padding: style.padding,
                borderRadius: style.borderRadius,
                border: style.border,
                fontWeight: style.fontWeight,
                cursor: style.cursor,
                transition: style.transition,
                boxShadow: style.boxShadow,
                minWidth: style.minWidth,
                textAlign: style.textAlign,
                background: colors.background,
                color: colors.textColor
            };
        }

        getAskDoubaoButtonStyle() {
            const position = this.config.get('askDoubaoButton.position');
            const style = this.config.get('askDoubaoButton.style');
            const colors = this.config.get('askDoubaoButton.colors');

            return {
                position: 'absolute',
                top: position.top,
                right: position.right,
                zIndex: '100',
                fontSize: style.fontSize,
                padding: style.padding,
                borderRadius: style.borderRadius,
                border: style.border,
                fontWeight: style.fontWeight,
                cursor: style.cursor,
                transition: style.transition,
                boxShadow: style.boxShadow,
                minWidth: style.minWidth,
                textAlign: style.textAlign,
                background: colors.background,
                color: colors.textColor
            };
        }

        getAnswerButtonStyle(isHidden = true) {
            return this._getInlineButtonStyle('answerButton', isHidden ? 'showBackground' : 'hideBackground');
        }

        getNoteButtonStyle(isVisible = false) {
            return this._getInlineButtonStyle('noteButton', isVisible ? 'hideBackground' : 'showBackground');
        }

        getSaveNoteButtonStyle() {
            return this._getInlineButtonStyle('saveNoteButton', 'background');
        }

        getMistakeButtonStyle() {
            const config = this.config.get('mistakeButton');
            const style = config.style;
            const colors = config.colors;

            return {
                ...style,
                backgroundColor: colors.background,
                color: colors.textColor
            };
        }

        getEditModeButtonStyle(isEditMode = false) {
            return this._getInlineButtonStyle('editModeButton', isEditMode ? 'previewBackground' : 'editBackground');
        }

        getGlobalButtonStyle(isHidden = true) {
            return this._getFloatingButtonStyle('globalButton', isHidden ? 'showAllBackground' : 'hideAllBackground');
        }

        getManageButtonStyle() {
            return this._getFloatingButtonStyle('manageButton', 'background');
        }

        getExportButtonStyle() {
            return this._getFloatingButtonStyle('exportButton', 'background');
        }

        // ========== 悬停效果管理 ==========

        /**
         * 为按钮添加统一的悬停动画效果
         * @param {HTMLElement} button - 按钮元素
         * @param {Object} options - 配置选项
         * @param {Function} options.getHoverBg - 获取悬停背景色的函数
         * @param {Function} options.getNormalBg - 获取正常背景色的函数
         */
        addHoverEffect(button, options) {
            const { getHoverBg, getNormalBg } = options;

            // 缓存进入时的背景色，确保离开时恢复到正确的颜色
            let cachedBgColor = null;

            button.addEventListener('mouseenter', () => {
                // 进入时缓存当前背景色（而不是调用getNormalBg，因为状态可能在hover期间改变）
                cachedBgColor = button.style.backgroundColor || getNormalBg();
                button.style.backgroundColor = getHoverBg();
                button.style.transform = 'translateY(-1px)';
                button.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.15)';
            });

            button.addEventListener('mouseleave', () => {
                // 恢复到进入时缓存的背景色
                button.style.backgroundColor = cachedBgColor || getNormalBg();
                button.style.transform = 'translateY(0)';
                button.style.boxShadow = '0 2px 4px rgba(0, 0, 0, 0.1)';
            });
        }

        /**
         * 为双状态按钮添加悬停效果（如显示/隐藏按钮）
         * @param {HTMLElement} button - 按钮元素
         * @param {string} configKey - 配置键名
         * @param {Function} getState - 获取当前状态的函数
         * @param {string} trueHoverKey - 状态为true时的悬停色配置键
         * @param {string} falseHoverKey - 状态为false时的悬停色配置键
         * @param {string} trueBgKey - 状态为true时的背景色配置键
         * @param {string} falseBgKey - 状态为false时的背景色配置键
         */
        addToggleHoverEffect(button, configKey, getState, trueHoverKey, falseHoverKey, trueBgKey, falseBgKey) {
            const colors = this.config.get(`${configKey}.colors`);

            this.addHoverEffect(button, {
                getHoverBg: () => getState() ? colors[trueHoverKey] : colors[falseHoverKey],
                getNormalBg: () => getState() ? colors[trueBgKey] : colors[falseBgKey]
            });
        }

        /**
         * 为单状态按钮添加悬停效果
         * @param {HTMLElement} button - 按钮元素
         * @param {string} configKey - 配置键名
         */
        addSimpleHoverEffect(button, configKey) {
            const colors = this.config.get(`${configKey}.colors`);

            this.addHoverEffect(button, {
                getHoverBg: () => colors.hoverBackground,
                getNormalBg: () => colors.background
            });
        }

        /**
         * 为按钮添加悬停动画效果（不改变背景色）
         * @param {HTMLElement} button - 按钮元素
         */
        addNoColorChangeHoverEffect(button) {
            button.addEventListener('mouseenter', () => {
                button.style.transform = 'translateY(-1px)';
                button.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.15)';
            });

            button.addEventListener('mouseleave', () => {
                button.style.transform = 'translateY(0)';
                button.style.boxShadow = '0 2px 4px rgba(0, 0, 0, 0.1)';
            });
        }

        // ========== 笔记编辑器样式 ==========

        getNoteEditorStyle() {
            const noteConfig = this.config.get('noteEditor');

            return {
                width: noteConfig.width || '100%',
                minHeight: noteConfig.minHeight,
                maxHeight: noteConfig.maxHeight,
                padding: noteConfig.padding,
                marginTop: noteConfig.marginTop,
                marginBottom: noteConfig.marginBottom,
                fontSize: noteConfig.fontSize,
                border: `${noteConfig.borderWidth} ${noteConfig.borderStyle} ${noteConfig.borderColor}`,
                borderRadius: noteConfig.borderRadius,
                backgroundColor: noteConfig.backgroundColor,
                color: noteConfig.textColor,
                resize: noteConfig.resize,
                fontFamily: noteConfig.fontFamily,
                outline: 'none',
                display: 'none',
                transition: 'border-color 0.2s',
                boxSizing: 'border-box'
            };
        }
    }

    // ===================== 答案块控制器 =====================
    class AnswerBlockController {
        constructor(block, config, styleGenerator, dbManager, workKey, appInstance) {
            this.block = block;
            this.config = config;
            this.styleGenerator = styleGenerator;
            this.dbManager = dbManager;
            this.workKey = workKey;
            this.appInstance = appInstance; // 保存应用实例引用，用于访问doubaoTabRef
            this.parent = block.parentNode;
            this.nextSibling = block.nextSibling;
            this.originalHTML = block.outerHTML;
            this.toggleButton = null;
            this.noteButton = null;
            this.saveNoteButton = null;
            this.mistakeButton = null;
            this.mistakeStarsContainer = null;
            this.mistakeContainer = null;
            this.noteEditor = null;
            this.buttonContainer = null;
            this.currentAnswerBlock = null;  // 跟踪当前显示的答案块
            this.isHidden = false;
            this.questionId = this._extractQuestionId();
            this.questionNo = this._extractQuestionNo();
        }

        _extractQuestionId() {
            // 从父元素中查找包含 question 的 id
            let element = this.block;
            while (element && element !== document.body) {
                if (element.id && element.id.startsWith('question')) {
                    return element.id;
                }
                element = element.parentElement;
            }
            // 如果没找到，生成一个唯一标识
            return `question_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        }

        _extractQuestionNo() {
            // 查找题目容器
            let questionContainer = null;
            const questionId = this.questionId;

            if (questionId && questionId.startsWith('question')) {
                questionContainer = document.getElementById(questionId);
            }

            // 如果没找到，尝试从 parent 向上查找
            if (!questionContainer && this.parent) {
                let element = this.parent;
                while (element && element !== document.body) {
                    if (element.classList && (element.classList.contains('questionLi') || element.classList.contains('mark_item'))) {
                        questionContainer = element;
                        break;
                    }
                    element = element.parentElement;
                }
            }

            // 使用URLParser解析题号
            return questionContainer ? URLParser.parseQuestionNumber(questionContainer) : '999';
        }

        async initialize() {
            this._hideBlockInitial();
            await this._createButtons();
            await this._createNoteEditor();
            return this.buttonContainer;
        }

        _hideBlockInitial() {
            // 初始化时删除原始答案块
            DOMHelper.removeElement(this.block);
            this.currentAnswerBlock = null;
            this.isHidden = true;
        }

        async _createButtons() {
            // 创建按钮容器
            this.buttonContainer = DOMHelper.createElement('div', {
                style: {
                    display: 'inline-block',
                    marginLeft: this.config.get('answerButton.position.marginLeft'),
                    marginRight: this.config.get('answerButton.position.marginLeft'), // 使右边距与左边距一致
                    marginTop: this.config.get('answerButton.position.marginTop'),
                    verticalAlign: this.config.get('answerButton.position.verticalAlign')
                }
            });

            // 创建错题按钮（定位到题目区域左上角）
            await this._createMistakeButton();

            // 创建复制按钮（定位到题目区域右上角）
            this._createCopyButton();

            // 创建问豆包按钮（定位到复制按钮下方）
            this._createAskDoubaoButton();

            // 创建答案切换按钮
            this._createAnswerToggleButton();

            // 创建笔记切换按钮
            this._createNoteToggleButton();

            // 创建编辑/预览切换按钮
            this._createEditModeToggleButton();

            // 创建保存笔记按钮
            this._createSaveNoteButton();

            // 插入按钮容器
            DOMHelper.insertElement(this.buttonContainer, this.parent, this.nextSibling);
        }

        async _createMistakeButton() {
            const buttonText = this.config.get('mistakeButton.text');
            const colors = this.config.get('mistakeButton.colors');
            const position = this.config.get('mistakeButton.position');
            const starsConfig = this.config.get('mistakeButton.stars');

            // 创建错题按钮容器（使用flexbox，星星在中间撑开空间）
            const mistakeContainer = DOMHelper.createElement('div', {
                style: {
                    marginTop: position.marginTop,
                    marginBottom: position.marginBottom,
                    marginLeft: position.marginLeft,
                    display: 'flex',
                    flexDirection: 'column',   // 垂直排列
                    alignItems: 'flex-start'   // 左对齐
                }
            });

            // 创建错题按钮
            this.mistakeButton = DOMHelper.createElement('button', {
                innerText: buttonText.add,
                style: this.styleGenerator.getMistakeButtonStyle(),
                title: '记录做错次数'
            });

            // 使用统一的悬停效果管理
            this.styleGenerator.addSimpleHoverEffect(this.mistakeButton, 'mistakeButton');

            this.mistakeButton.addEventListener('click', () => this._handleMistakeAdd());

            // 创建星星显示容器（弹性布局，会撑开空间）
            this.mistakeStarsContainer = DOMHelper.createElement('div', {
                style: {
                    display: 'flex',
                    flexWrap: 'wrap',
                    maxWidth: `calc(${starsConfig.perRow} * (${starsConfig.fontSize} + ${starsConfig.gap}))`,
                    gap: starsConfig.gap,
                    fontSize: starsConfig.fontSize,
                    lineHeight: '1',
                    marginTop: starsConfig.marginTop,
                    marginBottom: starsConfig.marginBottom
                }
            });

            // 将按钮和星星容器添加到容器（按钮在上，星星在下）
            mistakeContainer.appendChild(this.mistakeButton);
            mistakeContainer.appendChild(this.mistakeStarsContainer);

            // 保存容器引用
            this.mistakeContainer = mistakeContainer;

            // 查找题目容器中的mark_name元素
            let questionContainer = null;
            let markName = null;
            const questionId = this.questionId;

            if (questionId && questionId.startsWith('question')) {
                questionContainer = document.getElementById(questionId);
            }

            // 如果没找到，尝试从 parent 向上查找
            if (!questionContainer && this.parent) {
                let element = this.parent;
                while (element && element !== document.body) {
                    if (element.classList && (element.classList.contains('questionLi') || element.classList.contains('mark_item'))) {
                        questionContainer = element;
                        break;
                    }
                    element = element.parentElement;
                }
            }

            // 查找mark_name元素并插入错题容器到其上方
            if (questionContainer) {
                markName = questionContainer.querySelector('.mark_name');
                if (markName) {
                    // 插入到mark_name之前
                    markName.parentNode.insertBefore(mistakeContainer, markName);
                    
                    // 加载已有的错题记录并显示星星
                    await this._loadMistakeRecord();
                }
            }
        }

        async _loadMistakeRecord() {
            try {
                const mistake = await this.dbManager.getMistake(this.workKey, this.questionId, this.questionNo);
                if (mistake && mistake.count > 0) {
                    this._renderStars(mistake.count);
                }
            } catch (error) {
                Logger.error('加载错题记录失败', error);
            }
        }

        async _handleMistakeAdd() {
            try {
                const mistake = await this.dbManager.addMistake(this.workKey, this.questionId, this.questionNo);
                this._renderStars(mistake.count);
                
                // 显示提示
                const originalText = this.mistakeButton.innerText;
                this.mistakeButton.innerText = '✅ 已记录';
                setTimeout(() => {
                    this.mistakeButton.innerText = originalText;
                }, 1000);
            } catch (error) {
                Logger.error('添加错题记录失败', error);
            }
        }

        _renderStars(count) {
            const starsConfig = this.config.get('mistakeButton.stars');
            this.mistakeStarsContainer.innerHTML = '';
            
            if (count > 0) {
                // 显示星星容器（弹性布局会自动撑开空间）
                this.mistakeStarsContainer.style.display = 'flex';
                
                for (let i = 0; i < count; i++) {
                    const star = DOMHelper.createElement('span', {
                        innerText: starsConfig.emoji
                    });
                    this.mistakeStarsContainer.appendChild(star);
                }
            } else {
                // 隐藏星星容器（不占空间）
                this.mistakeStarsContainer.style.display = 'none';
            }
        }

        _createCopyButton() {
            const buttonText = this.config.get('copyButton.text');
            const colors = this.config.get('copyButton.colors');

            this.copyButton = DOMHelper.createElement('button', {
                innerText: buttonText.copy,
                style: this.styleGenerator.getCopyButtonStyle(),
                title: '复制题目和选项（纯文本）'
            });

            // 添加悬停效果
            this.copyButton.addEventListener('mouseenter', () => {
                this.copyButton.style.background = colors.hoverBackground;
                this.copyButton.style.transform = 'translateY(-1px)';
            });
            this.copyButton.addEventListener('mouseleave', () => {
                this.copyButton.style.background = colors.background;
                this.copyButton.style.transform = 'translateY(0)';
            });

            this.copyButton.addEventListener('click', () => this._handleCopy());

            // 查找题目容器并插入复制按钮到右上角
            let questionContainer = null;
            const questionId = this.questionId;

            if (questionId && questionId.startsWith('question')) {
                questionContainer = document.getElementById(questionId);
            }

            // 如果没找到，尝试从 parent 向上查找
            if (!questionContainer && this.parent) {
                let element = this.parent;
                while (element && element !== document.body) {
                    if (element.classList && (element.classList.contains('questionLi') || element.classList.contains('mark_item'))) {
                        questionContainer = element;
                        break;
                    }
                    element = element.parentElement;
                }
            }

            // 将复制按钮插入到题目容器
            if (questionContainer) {
                // 确保题目容器有相对定位
                const currentPosition = window.getComputedStyle(questionContainer).position;
                if (currentPosition === 'static') {
                    questionContainer.style.position = 'relative';
                }
                questionContainer.appendChild(this.copyButton);
            } else {
                // 如果找不到题目容器，则添加到按钮容器中作为备选
                this.buttonContainer.appendChild(this.copyButton);
            }
        }

        _createAskDoubaoButton() {
            const buttonText = this.config.get('askDoubaoButton.text');
            const colors = this.config.get('askDoubaoButton.colors');

            this.askDoubaoButton = DOMHelper.createElement('button', {
                innerText: buttonText.ask,
                style: this.styleGenerator.getAskDoubaoButtonStyle(),
                title: '向豆包AI提问当前题目'
            });

            // 添加悬停效果
            this.askDoubaoButton.addEventListener('mouseenter', () => {
                this.askDoubaoButton.style.background = colors.hoverBackground;
                this.askDoubaoButton.style.transform = 'translateY(-1px)';
            });
            this.askDoubaoButton.addEventListener('mouseleave', () => {
                this.askDoubaoButton.style.background = colors.background;
                this.askDoubaoButton.style.transform = 'translateY(0)';
            });

            this.askDoubaoButton.addEventListener('click', () => this._handleAskDoubao());

            // 查找题目容器并插入问豆包按钮到右上角（复制按钮下方）
            let questionContainer = null;
            const questionId = this.questionId;

            if (questionId && questionId.startsWith('question')) {
                questionContainer = document.getElementById(questionId);
            }

            // 如果没找到，尝试从 parent 向上查找
            if (!questionContainer && this.parent) {
                let element = this.parent;
                while (element && element !== document.body) {
                    if (element.classList && (element.classList.contains('questionLi') || element.classList.contains('mark_item'))) {
                        questionContainer = element;
                        break;
                    }
                    element = element.parentElement;
                }
            }

            // 将问豆包按钮插入到题目容器
            if (questionContainer) {
                // 确保题目容器有相对定位
                const currentPosition = window.getComputedStyle(questionContainer).position;
                if (currentPosition === 'static') {
                    questionContainer.style.position = 'relative';
                }
                questionContainer.appendChild(this.askDoubaoButton);
            } else {
                // 如果找不到题目容器，则添加到按钮容器中作为备选
                this.buttonContainer.appendChild(this.askDoubaoButton);
            }
        }

        async _handleAskDoubao() {
            // 获取题目容器
            let questionContainer = null;
            const questionId = this.questionId;

            if (questionId && questionId.startsWith('question')) {
                questionContainer = document.getElementById(questionId);
            }

            // 如果没找到，尝试从 parent 向上查找
            if (!questionContainer && this.parent) {
                let element = this.parent;
                while (element && element !== document.body) {
                    if (element.classList && (element.classList.contains('questionLi') || element.classList.contains('mark_item'))) {
                        questionContainer = element;
                        break;
                    }
                    element = element.parentElement;
                }
            }

            if (!questionContainer) {
                Logger.error('未找到题目容器');
                return;
            }

            // 提取题目文本
            let questionText = '';

            // 1. 获取题号和题型（如 "1. (单选题, 3分)"）
            const markName = questionContainer.querySelector('.mark_name');
            if (markName) {
                // 提取题号
                const firstTextNode = markName.childNodes[0];
                if (firstTextNode && firstTextNode.nodeType === Node.TEXT_NODE) {
                    questionText += firstTextNode.textContent.trim();
                }

                // 提取题型和分值
                const colorShallow = markName.querySelector('.colorShallow');
                if (colorShallow) {
                    questionText += ' ' + colorShallow.textContent.trim();
                }

                // 提取题干
                const qtContent = markName.querySelector('.qtContent');
                if (qtContent) {
                    questionText += '\n' + qtContent.textContent.trim();
                }
                questionText += '\n\n';
            }

            // 2. 获取选项（单选/多选题）
            const markLetter = questionContainer.querySelector('ul.mark_letter');
            if (markLetter) {
                const options = markLetter.querySelectorAll('li');
                options.forEach(option => {
                    questionText += option.textContent.trim() + '\n';
                });
            }

            // 3. 获取完型填空/填空题选项
            const markGestalt = questionContainer.querySelector('div.mark_gestalt');
            if (markGestalt) {
                const rows = markGestalt.querySelectorAll('.gestalt_row, dl');
                rows.forEach(row => {
                    const dt = row.querySelector('dt');
                    if (dt) {
                        questionText += dt.textContent.trim() + '\n';
                    }
                    const dds = row.querySelectorAll('dd');
                    dds.forEach(dd => {
                        questionText += '  ' + dd.textContent.trim() + '\n';
                    });
                });
            }

            // 使用 GM_setValue 存储题目内容（拼接好前后缀后存储）
            const storageKey = this.config.get('askDoubaoButton.storageKey');
            const doubaoBaseUrl = this.config.get('askDoubaoButton.doubaoUrl');

            try {
                // 从 IndexedDB 实时读取用户保存的配置
                let aiPromptPrefix = '';
                let aiPromptSuffix = '';
                let aiChatId = '';
                try {
                    const savedPrefix = await this.dbManager.getSetting('aiPromptPrefix');
                    const savedSuffix = await this.dbManager.getSetting('aiPromptSuffix');
                    const savedChatId = await this.dbManager.getSetting('aiChatId');
                    aiPromptPrefix = savedPrefix || '';
                    aiPromptSuffix = savedSuffix || '';
                    aiChatId = savedChatId || '';
                    console.log('📖 从 IndexedDB 读取配置:');
                    console.log('  前缀配置:', aiPromptPrefix || '(空)');
                    console.log('  后缀配置:', aiPromptSuffix || '(空)');
                    console.log('  会话ID:', aiChatId || '(空)');
                } catch (error) {
                    console.warn('读取配置失败，使用默认值:', error);
                }

                // 处理转义符（\n -> 换行符）
                const processedPrefix = aiPromptPrefix.replace(/\\n/g, '\n');
                const processedSuffix = aiPromptSuffix.replace(/\\n/g, '\n');

                // 拼接完整内容（前缀 + 题目 + 后缀）
                const fullContent = processedPrefix + questionText.trim() + processedSuffix;

                // 存储完整内容到GM缓存
                GM_setValue(storageKey, fullContent);

                // 构建目标URL
                const targetUrl = aiChatId ? `https://www.doubao.com/chat/${aiChatId}` : doubaoBaseUrl;

                Logger.log('题目已保存，正在打开豆包AI...');
                console.log('📝 存储的完整内容:');
                console.log('  前缀:', processedPrefix ? `"${processedPrefix}"` : '(无)');
                console.log('  题目长度:', questionText.trim().length);
                console.log('  后缀:', processedSuffix ? `"${processedSuffix}"` : '(无)');
                console.log('  最终内容长度:', fullContent.length);
                console.log('  目标URL:', targetUrl);

                // 关闭旧的豆包AI标签页（如果存在）
                if (this.appInstance && this.appInstance.doubaoTabRef) {
                    try {
                        this.appInstance.doubaoTabRef.close();
                        console.log('✅ 已关闭旧的豆包AI标签页');
                    } catch (error) {
                        // 静默失败，可能已被用户手动关闭
                        console.log('ℹ️ 旧标签页已不存在或已关闭');
                    }
                    this.appInstance.doubaoTabRef = null;
                }

                // 打开豆包AI并保存引用
                const tabRef = GM_openInTab(targetUrl, {
                    active: true,      // 激活标签页
                    insert: true,      // 插入到当前标签页旁边
                    setParent: true    // 设置父子关系
                });

                // 保存引用到应用实例
                if (this.appInstance) {
                    this.appInstance.doubaoTabRef = tabRef;
                    console.log('✅ 已保存新标签页引用');
                }
            } catch (error) {
                Logger.error('打开豆包AI失败', error);
            }
        }

        async _handleCopy() {
            const buttonText = this.config.get('copyButton.text');
            const colors = this.config.get('copyButton.colors');

            // 获取题目容器
            let questionContainer = null;
            const questionId = this.questionId;

            if (questionId && questionId.startsWith('question')) {
                questionContainer = document.getElementById(questionId);
            }

            // 如果没找到，尝试从 parent 向上查找
            if (!questionContainer && this.parent) {
                let element = this.parent;
                while (element && element !== document.body) {
                    if (element.classList && (element.classList.contains('questionLi') || element.classList.contains('mark_item'))) {
                        questionContainer = element;
                        break;
                    }
                    element = element.parentElement;
                }
            }

            if (!questionContainer) {
                Logger.error('未找到题目容器');
                return;
            }

            try {
                // 克隆题目容器以避免修改原DOM
                const containerClone = questionContainer.cloneNode(true);

                // 移除不需要的元素
                const elementsToRemove = containerClone.querySelectorAll('.mark_answer, button, [contenteditable], .aiAssistant');
                elementsToRemove.forEach(el => el.remove());

                // 移除脚本添加的容器
                const scriptContainers = containerClone.querySelectorAll('div[style*="display: inline-block"], div[style*="display: none"]');
                scriptContainers.forEach(el => el.remove());

                // 提取纯文本内容
                let copyText = '';

                // 1. 获取题号和题型
                const markName = containerClone.querySelector('.mark_name');
                if (markName) {
                    const firstTextNode = markName.childNodes[0];
                    if (firstTextNode && firstTextNode.nodeType === Node.TEXT_NODE) {
                        copyText += firstTextNode.textContent.trim();
                    }

                    const colorShallow = markName.querySelector('.colorShallow');
                    if (colorShallow) {
                        copyText += ' ' + colorShallow.textContent.trim();
                    }

                    const qtContent = markName.querySelector('.qtContent');
                    if (qtContent) {
                        copyText += ' ' + qtContent.textContent.trim();
                    }
                    copyText += '\n';
                }

                // 2. 获取选项
                const markLetter = containerClone.querySelector('ul.mark_letter');
                if (markLetter) {
                    const options = markLetter.querySelectorAll('li');
                    options.forEach(option => {
                        copyText += option.textContent.trim() + '\n';
                    });
                }

                // 3. 获取完型填空/填空题选项
                const markGestalt = containerClone.querySelector('div.mark_gestalt');
                if (markGestalt) {
                    const rows = markGestalt.querySelectorAll('.gestalt_row, dl');
                    rows.forEach(row => {
                        const dt = row.querySelector('dt');
                        if (dt) {
                            copyText += dt.textContent.trim() + '\n';
                        }
                        const dds = row.querySelectorAll('dd');
                        dds.forEach(dd => {
                            copyText += '  ' + dd.textContent.trim() + '\n';
                        });
                    });
                }

                // 构建HTML内容（包含图片）
                let htmlContent = '<div style="font-family: Arial, sans-serif; font-size: 14px;">';

                // 添加题号和题型
                if (markName) {
                    const firstTextNode = questionContainer.querySelector('.mark_name')?.childNodes[0];
                    if (firstTextNode && firstTextNode.nodeType === Node.TEXT_NODE) {
                        htmlContent += '<p><strong>' + firstTextNode.textContent.trim();
                    }

                    const colorShallow = questionContainer.querySelector('.colorShallow');
                    if (colorShallow) {
                        htmlContent += ' ' + colorShallow.textContent.trim();
                    }
                    htmlContent += '</strong></p>';

                    // 添加题干（包含图片）
                    const qtContent = questionContainer.querySelector('.qtContent');
                    if (qtContent) {
                        const qtClone = qtContent.cloneNode(true);
                        // 处理图片：保留原始URL
                        const images = qtClone.querySelectorAll('img');
                        images.forEach(img => {
                            if (img.src) {
                                img.style.maxWidth = '100%';
                                img.style.height = 'auto';
                            }
                        });
                        htmlContent += '<p>' + qtClone.innerHTML + '</p>';
                    }
                }

                // 添加选项（包含可能的图片）
                const originalMarkLetter = questionContainer.querySelector('ul.mark_letter');
                if (originalMarkLetter) {
                    const letterClone = originalMarkLetter.cloneNode(true);
                    const images = letterClone.querySelectorAll('img');
                    images.forEach(img => {
                        if (img.src) {
                            img.style.maxWidth = '100%';
                            img.style.height = 'auto';
                        }
                    });
                    htmlContent += letterClone.outerHTML;
                }

                // 添加完型填空/填空题选项
                const originalMarkGestalt = questionContainer.querySelector('div.mark_gestalt');
                if (originalMarkGestalt) {
                    const gestaltClone = originalMarkGestalt.cloneNode(true);
                    const images = gestaltClone.querySelectorAll('img');
                    images.forEach(img => {
                        if (img.src) {
                            img.style.maxWidth = '100%';
                            img.style.height = 'auto';
                        }
                    });
                    htmlContent += gestaltClone.outerHTML;
                }

                htmlContent += '</div>';

                // 获取配置的前缀和后缀
                const prefix = await this.dbManager.getSetting('copyPrefix', this.config.get('settings.copyPrefix'));
                const suffix = await this.dbManager.getSetting('copySuffix', this.config.get('settings.copySuffix'));

                // 处理前缀和后缀
                let finalText = copyText.trim();
                let finalHtml = htmlContent;

                if (prefix) {
                    const processedPrefix = prefix.replace(/\\n/g, '\n');
                    finalText = processedPrefix + finalText;
                    finalHtml = '<p>' + processedPrefix.replace(/\n/g, '<br>') + '</p>' + finalHtml;
                }
                if (suffix) {
                    const processedSuffix = suffix.replace(/\\n/g, '\n');
                    finalText = finalText + processedSuffix;
                    finalHtml = finalHtml + '<p>' + processedSuffix.replace(/\n/g, '<br>') + '</p>';
                }

                // 尝试使用现代剪贴板API复制（支持HTML和图片）
                if (navigator.clipboard && navigator.clipboard.write) {
                    const htmlBlob = new Blob([finalHtml], { type: 'text/html' });
                    const textBlob = new Blob([finalText], { type: 'text/plain' });

                    const clipboardItem = new ClipboardItem({
                        'text/html': htmlBlob,
                        'text/plain': textBlob
                    });

                    await navigator.clipboard.write([clipboardItem]);

                    // 复制成功
                    this.copyButton.innerText = buttonText.copied;
                    this.copyButton.style.background = colors.successBackground;

                    setTimeout(() => {
                        this.copyButton.innerText = buttonText.copy;
                        this.copyButton.style.background = colors.background;
                    }, 2000);
                } else {
                    // 降级到纯文本复制
                    await navigator.clipboard.writeText(finalText);

                    this.copyButton.innerText = buttonText.copied;
                    this.copyButton.style.background = colors.successBackground;

                    setTimeout(() => {
                        this.copyButton.innerText = buttonText.copy;
                        this.copyButton.style.background = colors.background;
                    }, 2000);
                }

            } catch (err) {
                console.error('复制失败:', err);

                // 最后的降级方案：使用传统方法复制纯文本
                try {
                    let copyText = '';
                    const markName = questionContainer.querySelector('.mark_name');
                    if (markName) {
                        const firstTextNode = markName.childNodes[0];
                        if (firstTextNode && firstTextNode.nodeType === Node.TEXT_NODE) {
                            copyText += firstTextNode.textContent.trim();
                        }
                        const colorShallow = markName.querySelector('.colorShallow');
                        if (colorShallow) {
                            copyText += ' ' + colorShallow.textContent.trim();
                        }
                        const qtContent = markName.querySelector('.qtContent');
                        if (qtContent) {
                            copyText += ' ' + qtContent.textContent.trim();
                        }
                        copyText += '\n';
                    }

                    const markLetter = questionContainer.querySelector('ul.mark_letter');
                    if (markLetter) {
                        const options = markLetter.querySelectorAll('li');
                        options.forEach(option => {
                            copyText += option.textContent.trim() + '\n';
                        });
                    }

                    const markGestalt = questionContainer.querySelector('div.mark_gestalt');
                    if (markGestalt) {
                        const rows = markGestalt.querySelectorAll('.gestalt_row, dl');
                        rows.forEach(row => {
                            const dt = row.querySelector('dt');
                            if (dt) {
                                copyText += dt.textContent.trim() + '\n';
                            }
                            const dds = row.querySelectorAll('dd');
                            dds.forEach(dd => {
                                copyText += '  ' + dd.textContent.trim() + '\n';
                            });
                        });
                    }

                    const prefix = await this.dbManager.getSetting('copyPrefix', this.config.get('settings.copyPrefix'));
                    const suffix = await this.dbManager.getSetting('copySuffix', this.config.get('settings.copySuffix'));

                    let finalText = copyText.trim();
                    if (prefix) {
                        const processedPrefix = prefix.replace(/\\n/g, '\n');
                        finalText = processedPrefix + finalText;
                    }
                    if (suffix) {
                        const processedSuffix = suffix.replace(/\\n/g, '\n');
                        finalText = finalText + processedSuffix;
                    }

                    const textarea = document.createElement('textarea');
                    textarea.value = finalText;
                    textarea.style.position = 'fixed';
                    textarea.style.opacity = '0';
                    document.body.appendChild(textarea);
                    textarea.select();

                    document.execCommand('copy');
                    document.body.removeChild(textarea);

                    this.copyButton.innerText = buttonText.copied;
                    this.copyButton.style.background = colors.successBackground;

                    setTimeout(() => {
                        this.copyButton.innerText = buttonText.copy;
                        this.copyButton.style.background = colors.background;
                    }, 2000);
                } catch (e) {
                    Logger.error('复制失败', e);
                }
            }
        }

        _createAnswerToggleButton() {
            const buttonText = this.config.get('answerButton.text');
            this.toggleButton = DOMHelper.createElement('button', {
                innerText: buttonText.show,
                style: this.styleGenerator.getAnswerButtonStyle(true),
                title: '点击显示/隐藏当前答案块',
                dataset: {
                    isHidden: 'true',
                    originalHTML: this.originalHTML
                }
            });

            // 使用统一的悬停效果管理
            this.styleGenerator.addToggleHoverEffect(
                this.toggleButton,
                'answerButton',
                () => this.toggleButton.dataset.isHidden === 'true',
                'showHoverBackground', 'hideHoverBackground',
                'showBackground', 'hideBackground'
            );

            this.toggleButton.addEventListener('click', () => this._handleAnswerToggle());
            this.buttonContainer.appendChild(this.toggleButton);
        }

        _createNoteToggleButton() {
            const buttonText = this.config.get('noteButton.text');
            this.noteButton = DOMHelper.createElement('button', {
                innerText: buttonText.show,
                style: this.styleGenerator.getNoteButtonStyle(false),
                title: '点击显示/隐藏笔记编辑器',
                dataset: {
                    isVisible: 'false'
                }
            });

            // 使用无颜色变化的悬停效果（仅动画）
            this.styleGenerator.addNoColorChangeHoverEffect(this.noteButton);

            this.noteButton.addEventListener('click', () => this._handleNoteToggle());
            this.buttonContainer.appendChild(this.noteButton);
        }

        _createEditModeToggleButton() {
            const buttonText = this.config.get('editModeButton.text');
            const colors = this.config.get('editModeButton.colors');
            const style = this.styleGenerator.getEditModeButtonStyle(false);
            style.display = 'none'; // 初始隐藏
            // 初始状态：预览模式，显示橙色"编辑"按钮
            style.backgroundColor = colors.previewBackground;

            this.editModeButton = DOMHelper.createElement('button', {
                innerText: buttonText.edit,
                style: style,
                title: '切换编辑/预览模式'
            });

            // 使用无颜色变化的悬停效果（仅动画）
            this.styleGenerator.addNoColorChangeHoverEffect(this.editModeButton);

            this.editModeButton.addEventListener('click', () => {
                const buttonText = this.config.get('editModeButton.text');
                const colors = this.config.get('editModeButton.colors');
                this.noteEditor.toggleEditMode();

                if (this.noteEditor.isEditMode) {
                    // 编辑模式：绿色背景 + "预览"文字
                    this.editModeButton.innerText = buttonText.preview;
                    this.editModeButton.style.backgroundColor = colors.editBackground;
                    // 编辑模式显示保存按钮
                    this.saveNoteButton.style.display = 'inline-block';
                } else {
                    // 预览模式：橙色背景 + "编辑"文字
                    this.editModeButton.innerText = buttonText.edit;
                    this.editModeButton.style.backgroundColor = colors.previewBackground;
                    // 预览模式隐藏保存按钮
                    this.saveNoteButton.style.display = 'none';
                }
            });

            this.buttonContainer.appendChild(this.editModeButton);
        }

        _createSaveNoteButton() {
            const buttonText = this.config.get('saveNoteButton.text');
            const colors = this.config.get('saveNoteButton.colors');
            const style = this.styleGenerator.getSaveNoteButtonStyle();
            style.display = 'none'; // 初始隐藏
            this.saveNoteButton = DOMHelper.createElement('button', {
                innerText: buttonText.save,
                style: style,
                title: '手动保存当前笔记'
            });

            // 使用统一的悬停效果管理
            this.styleGenerator.addSimpleHoverEffect(this.saveNoteButton, 'saveNoteButton');

            this.saveNoteButton.addEventListener('click', async () => {
                await this.noteEditor.save();
                Logger.success('💾 笔记已保存');

                // 点击反馈：文字和颜色变化
                this.saveNoteButton.innerText = buttonText.saved;
                this.saveNoteButton.style.background = colors.successBackground;

                // 2秒后恢复原状
                setTimeout(() => {
                    this.saveNoteButton.innerText = buttonText.save;
                    this.saveNoteButton.style.background = colors.background;
                }, 2000);
            });
            this.buttonContainer.appendChild(this.saveNoteButton);
        }

        async _createNoteEditor() {
            this.noteEditor = new NoteEditor(
                this.questionId,
                this.questionNo,
                this.workKey,
                this.dbManager,
                this.config,
                this.styleGenerator
            );

            const editorElement = await this.noteEditor.create();

            // 将编辑器插入到按钮容器之后
            DOMHelper.insertElement(editorElement, this.parent, this.buttonContainer.nextSibling);
        }

        _handleAnswerToggle() {
            if (this.isHidden) {
                this._showBlock();
            } else {
                this._hideBlock();
            }
            this._updateAnswerButtonState();
        }

        _showBlock() {
            // 如果已经有显示的答案块，先删除它（防止重复）
            if (this.currentAnswerBlock && this.currentAnswerBlock.parentNode) {
                DOMHelper.removeElement(this.currentAnswerBlock);
            }

            const tempContainer = document.createElement('div');
            tempContainer.innerHTML = this.originalHTML;
            const restoredBlock = tempContainer.firstChild;

            // 保存对新创建的答案块的引用
            this.currentAnswerBlock = restoredBlock;

            // 插入到笔记编辑器之后（如果可见）或按钮容器之后
            const insertAfter = this.noteEditor.isVisible ?
                this.noteEditor.getElement().nextSibling :
                this.buttonContainer.nextSibling;
            DOMHelper.insertElement(restoredBlock, this.parent, insertAfter);
            this.isHidden = false;
        }

        _hideBlock() {
            // 删除当前显示的答案块
            if (this.currentAnswerBlock && this.currentAnswerBlock.parentNode) {
                DOMHelper.removeElement(this.currentAnswerBlock);
                this.currentAnswerBlock = null;
            }
            this.isHidden = true;
        }

        _updateAnswerButtonState() {
            const buttonText = this.config.get('answerButton.text');
            const colors = this.config.get('answerButton.colors');

            this.toggleButton.innerText = this.isHidden ? buttonText.show : buttonText.hide;
            this.toggleButton.style.background = this.isHidden ? colors.showBackground : colors.hideBackground;
            this.toggleButton.dataset.isHidden = String(this.isHidden);
        }

        _handleNoteToggle() {
            this.noteEditor.toggle();
            this._updateNoteButtonState();
        }

        _updateNoteButtonState() {
            const buttonText = this.config.get('noteButton.text');
            const colors = this.config.get('noteButton.colors');

            this.noteButton.innerText = this.noteEditor.isVisible ? buttonText.hide : buttonText.show;
            this.noteButton.style.background = this.noteEditor.isVisible ? colors.hideBackground : colors.showBackground;
            this.noteButton.dataset.isVisible = String(this.noteEditor.isVisible);

            // 联动控制编辑按钮的显示/隐藏
            if (this.noteEditor.isVisible) {
                this.editModeButton.style.display = 'inline-block';
                // 保存按钮只在编辑模式下显示
                if (this.noteEditor.isEditMode) {
                    this.saveNoteButton.style.display = 'inline-block';
                } else {
                    this.saveNoteButton.style.display = 'none';
                }
            } else {
                this.editModeButton.style.display = 'none';
                this.saveNoteButton.style.display = 'none';
            }
        }

        toggle() {
            this._handleAnswerToggle();
        }

        getState() {
            return this.isHidden;
        }
    }

    // ===================== 全局控制器 =====================
    class GlobalController {
        constructor(container, controllers, config, styleGenerator, dbManager, workKey) {
            this.container = container;
            this.controllers = controllers;
            this.config = config;
            this.styleGenerator = styleGenerator;
            this.dbManager = dbManager;
            this.workKey = workKey;
            this.globalButton = null;
            this.manageButton = null;
            this.exportButton = null;
            this.buttonContainer = null;
        }

        initialize() {
            if (!this.container) return null;

            // 将按钮放到 fanyaMarking_right 的右侧外部
            this._createButtonContainer();
            // 注意：按钮创建顺序决定显示顺序（上到下/左到右）
            this._createManageButton();     // 控制面板在最上面
            this._createGlobalButton();     // 显示全部答案在第二
            this._createExportButton();     // 导出按钮在下面
            return this.globalButton;
        }

        _createButtonContainer() {
            // 使用统一的选择器配置获取 fanyaMarking_right
            const sidePanelSelector = this.config.get('selectors.sidePanel');
            const fanyaMarkingRight = document.querySelector(sidePanelSelector) || this.container.parentNode;

            // 检测是否为竖屏模式
            const isPortrait = () => window.innerHeight > window.innerWidth;

            // 按钮最小宽度配置（用于空间检测）
            const BUTTON_MIN_WIDTH = 140;  // 单个按钮的最小宽度
            const BUTTON_GAP = 8;          // 按钮间距
            const SIDE_MARGIN = 10;        // 侧边距
            const SAFETY_MARGIN = 20;      // 安全边距（防止按钮贴边或被截断）
            const REQUIRED_SPACE = BUTTON_MIN_WIDTH + SIDE_MARGIN * 2 + SAFETY_MARGIN; // 所需最小空间

            // 创建按钮容器，使用固定定位
            this.buttonContainer = DOMHelper.createElement('div', {
                style: {
                    position: 'fixed',
                    display: 'flex',
                    gap: BUTTON_GAP + 'px',
                    zIndex: '9999',
                    transition: 'all 0.3s ease' // 添加平滑过渡效果
                }
            });

            // 将按钮容器添加到 body
            document.body.appendChild(this.buttonContainer);

            /**
             * 检测右侧是否有足够空间显示按钮
             * @param {DOMRect} rect - 侧边栏的位置信息
             * @returns {boolean} true表示有足够空间，false表示空间不足
             */
            const hasEnoughRightSpace = (rect) => {
                const windowWidth = window.innerWidth;
                const rightEdge = rect.right;
                const availableSpace = windowWidth - rightEdge;

                // 调试日志
                console.log('[按钮布局检测]', {
                    窗口宽度: windowWidth,
                    侧边栏右边缘: rightEdge,
                    可用空间: availableSpace,
                    所需空间: REQUIRED_SPACE,
                    是否充足: availableSpace >= REQUIRED_SPACE
                });

                return availableSpace >= REQUIRED_SPACE;
            };

            /**
             * 更新按钮位置和布局
             * 智能布局逻辑：
             * 1. 竖屏模式：始终在下方横向排列
             * 2. 横屏模式：
             *    - 右侧空间充足：在右侧纵向排列
             *    - 右侧空间不足：在下方纵向排列（从上到下）
             */
            const updatePosition = () => {
                const rect = fanyaMarkingRight.getBoundingClientRect();

                if (isPortrait()) {
                    // 竖屏模式：按钮横向排列在侧边栏下方
                    this.buttonContainer.style.flexDirection = 'row';
                    this.buttonContainer.style.flexWrap = 'wrap';
                    this.buttonContainer.style.top = (rect.bottom + SIDE_MARGIN) + 'px';
                    this.buttonContainer.style.left = rect.left + 'px';
                    this.buttonContainer.style.right = 'auto';
                    this.buttonContainer.style.maxWidth = rect.width + 'px';
                    this.buttonContainer.style.justifyContent = 'flex-start';
                    this.buttonContainer.style.alignItems = 'flex-start';

                    console.log('[按钮布局] 竖屏模式：下方横向排列');
                } else {
                    // 横屏模式：根据右侧空间决定布局
                    const hasSpace = hasEnoughRightSpace(rect);

                    if (hasSpace) {
                        // 右侧空间充足：按钮纵向排列在侧边栏右边
                        this.buttonContainer.style.flexDirection = 'column';
                        this.buttonContainer.style.flexWrap = 'nowrap';
                        this.buttonContainer.style.top = rect.top + 'px';
                        this.buttonContainer.style.left = (rect.right + SIDE_MARGIN) + 'px';
                        this.buttonContainer.style.right = 'auto';
                        this.buttonContainer.style.maxWidth = 'none';
                        this.buttonContainer.style.justifyContent = 'flex-start';
                        this.buttonContainer.style.alignItems = 'stretch';

                        console.log('[按钮布局] 横屏模式：右侧空间充足，右侧纵向排列');
                    } else {
                        // 右侧空间不足：按钮纵向排列在侧边栏下方（从上到下）
                        // 关键修复：确保纵向排列，不换行
                        this.buttonContainer.style.flexDirection = 'column';
                        this.buttonContainer.style.flexWrap = 'nowrap';
                        this.buttonContainer.style.top = (rect.bottom + SIDE_MARGIN) + 'px';
                        this.buttonContainer.style.left = rect.left + 'px';
                        this.buttonContainer.style.right = 'auto';
                        this.buttonContainer.style.maxWidth = rect.width + 'px';
                        this.buttonContainer.style.justifyContent = 'flex-start';
                        this.buttonContainer.style.alignItems = 'stretch'; // 修改为 stretch 使按钮占满宽度

                        console.log('[按钮布局] 横屏模式：右侧空间不足，下方纵向排列');
                    }
                }
            };

            // 初始更新位置（延迟确保DOM完全渲染）
            setTimeout(updatePosition, 100);

            // 滚动和窗口变化时更新位置
            window.addEventListener('scroll', updatePosition, { passive: true });
            window.addEventListener('resize', updatePosition);

            // 监听屏幕方向变化（移动设备）
            if (window.matchMedia) {
                window.matchMedia('(orientation: portrait)').addEventListener('change', updatePosition);
            }

            // 使用 ResizeObserver 监听侧边栏大小变化（更精确的响应式）
            if (typeof ResizeObserver !== 'undefined') {
                const resizeObserver = new ResizeObserver(() => {
                    updatePosition();
                });
                resizeObserver.observe(fanyaMarkingRight);
            }
        }

        _createGlobalButton() {
            const buttonText = this.config.get('globalButton.text');
            this.globalButton = DOMHelper.createElement('button', {
                innerText: buttonText.showAll,
                style: this.styleGenerator.getGlobalButtonStyle(true),
                title: '点击一键显示/隐藏所有答案块'
            });

            // 使用统一的悬停效果管理
            this.styleGenerator.addToggleHoverEffect(
                this.globalButton,
                'globalButton',
                () => this.controllers.every(ctrl => ctrl.getState()),
                'showAllHoverBackground', 'hideAllHoverBackground',
                'showAllBackground', 'hideAllBackground'
            );

            this.globalButton.addEventListener('click', () => this._handleGlobalToggle());
            this.buttonContainer.appendChild(this.globalButton);
        }

        _createManageButton() {
            const buttonText = this.config.get('manageButton.text');
            this.manageButton = DOMHelper.createElement('button', {
                innerText: buttonText,
                style: this.styleGenerator.getManageButtonStyle(),
                title: '打开控制面板：设置和笔记管理'
            });

            // 使用统一的悬停效果管理
            this.styleGenerator.addSimpleHoverEffect(this.manageButton, 'manageButton');

            this.manageButton.addEventListener('click', () => this._handleManageClick());
            this.buttonContainer.appendChild(this.manageButton);
        }

        _createExportButton() {
            const buttonText = this.config.get('exportButton.text');
            const buttonTextWithAnswer = this.config.get('exportButton.textWithAnswer');
            const colors = this.config.get('exportButton.colors');

            // 创建导出试题按钮（不带答案）
            this.exportButton = DOMHelper.createElement('button', {
                innerText: buttonText,
                style: this.styleGenerator.getExportButtonStyle(),
                title: '导出试题为Word文档（不含答案）'
            });

            // 使用统一的悬停效果管理
            this.styleGenerator.addSimpleHoverEffect(this.exportButton, 'exportButton');

            this.exportButton.addEventListener('click', () => this._handleExport(false));
            this.buttonContainer.appendChild(this.exportButton);

            // 创建导出答案按钮（带答案）
            const exportWithAnswerStyle = this.styleGenerator.getExportButtonStyle();
            exportWithAnswerStyle.background = colors.withAnswerBackground;

            this.exportWithAnswerButton = DOMHelper.createElement('button', {
                innerText: buttonTextWithAnswer,
                style: exportWithAnswerStyle,
                title: '导出试题为Word文档（含答案）'
            });

            // 手动添加悬停效果（使用紫色）
            this.exportWithAnswerButton.addEventListener('mouseenter', () => {
                this.exportWithAnswerButton.style.background = colors.withAnswerHoverBackground;
                this.exportWithAnswerButton.style.transform = 'translateY(-1px)';
            });
            this.exportWithAnswerButton.addEventListener('mouseleave', () => {
                this.exportWithAnswerButton.style.background = colors.withAnswerBackground;
                this.exportWithAnswerButton.style.transform = 'translateY(0)';
            });

            this.exportWithAnswerButton.addEventListener('click', () => this._handleExport(true));
            this.buttonContainer.appendChild(this.exportWithAnswerButton);
        }

        async _handleExport(includeAnswer = false) {
            // 确定当前操作的按钮
            const currentButton = includeAnswer ? this.exportWithAnswerButton : this.exportButton;
            const originalText = currentButton.innerText;

            try {
                // 显示导出中状态
                currentButton.innerText = '⏳ 导出中...';
                currentButton.disabled = true;

                // 从控制器中获取答案信息
                if (this.controllers.length === 0) {
                    alert('未找到任何试题');
                    currentButton.innerText = originalText;
                    currentButton.disabled = false;
                    return;
                }

                // 解析题目内容（使用控制器中保存的原始答案）
                const docContent = this._parseQuestionsToDocx();

                if (!docContent.questions || docContent.questions.length === 0) {
                    alert('未能解析到试题内容');
                    currentButton.innerText = originalText;
                    currentButton.disabled = false;
                    return;
                }

                // 从数据库读取用户配置的导出格式
                const exportDefaults = this.config.get('exportSettings');
                let format = 'doc'; // 默认doc格式
                try {
                    const savedFormat = await this.dbManager.getSetting('exportFormat');
                    format = savedFormat ?? exportDefaults.exportFormat ?? 'doc';
                } catch (e) {
                    console.warn('读取导出格式配置失败，使用默认值:', e);
                    format = exportDefaults.exportFormat ?? 'doc';
                }

                // 根据格式调用不同的生成方法
                if (format === 'docx') {
                    await this._generateDocx(docContent, includeAnswer);
                } else {
                    await this._generateDoc(docContent, includeAnswer);
                }

                // 恢复按钮状态
                currentButton.innerText = originalText;
                currentButton.disabled = false;
            } catch (error) {
                console.error('导出失败:', error);
                alert('导出失败，请重试');
                currentButton.innerText = originalText;
                currentButton.disabled = false;
            }
        }

        _parseQuestionsToDocx() {
            const content = [];

            // 获取文档标题（从 mark_title 获取）
            const markTitle = document.querySelector('.mark_title');
            const docTitle = markTitle ? markTitle.innerText.trim() : '试题导出';

            this.controllers.forEach((controller, index) => {
                // 从控制器获取原始答案HTML（保留完整HTML结构）
                const answerHTML = controller.originalHTML;

                // 获取题目信息 - 找到完整的题目容器
                let questionHTML = '';
                let titleText = `第${index + 1}题`;

                // 使用 questionId 找到完整的题目容器
                const questionId = controller.questionId;
                let questionContainer = null;

                if (questionId && questionId.startsWith('question')) {
                    questionContainer = document.getElementById(questionId);
                }

                // 如果没找到，尝试从 parent 向上查找
                if (!questionContainer && controller.parent) {
                    let element = controller.parent;
                    while (element && element !== document.body) {
                        if (element.classList && (element.classList.contains('questionLi') || element.classList.contains('mark_item'))) {
                            questionContainer = element;
                            break;
                        }
                        element = element.parentElement;
                    }
                }

                if (questionContainer) {
                    // 克隆元素以避免影响原始DOM
                    const containerClone = questionContainer.cloneNode(true);

                    // 移除答案块（我们单独处理答案）
                    const answerBlocks = containerClone.querySelectorAll('.mark_answer');
                    answerBlocks.forEach(block => block.remove());

                    // 移除脚本添加的按钮
                    const buttons = containerClone.querySelectorAll('button');
                    buttons.forEach(btn => btn.remove());

                    // 移除脚本添加的编辑器容器
                    const editDivs = containerClone.querySelectorAll('div[contenteditable]');
                    editDivs.forEach(div => {
                        const parent = div.closest('div[style*="display: none"]') || div.closest('div[style*="margin-top: 12px"]');
                        if (parent) parent.remove();
                    });

                    // 移除按钮容器（脚本添加的inline-block div）
                    const inlineBlockDivs = containerClone.querySelectorAll('div[style*="display: inline-block"]');
                    inlineBlockDivs.forEach(div => div.remove());

                    // 获取题号和题目内容
                    const markName = containerClone.querySelector('.mark_name');
                    if (markName) {
                        // 提取题号文本（如 "1. (单选题, 4分)"）
                        const colorShallow = markName.querySelector('.colorShallow');
                        const firstTextNode = markName.childNodes[0];
                        if (firstTextNode && firstTextNode.nodeType === Node.TEXT_NODE) {
                            titleText = firstTextNode.textContent.trim();
                        }
                        if (colorShallow) {
                            titleText += ' ' + colorShallow.textContent.trim();
                        }

                        // 获取题目正文HTML（在 qtContent 中）
                        const qtContent = markName.querySelector('.qtContent');
                        if (qtContent) {
                            questionHTML = qtContent.innerHTML;
                        }
                    }

                    // 获取选项列表 - 支持多种题型
                    // 1. 单选题/多选题: ul.mark_letter
                    const markLetter = containerClone.querySelector('ul.mark_letter');
                    if (markLetter) {
                        questionHTML += markLetter.outerHTML;
                    }

                    // 2. 完型填空/填空题: div.mark_gestalt
                    const markGestalt = containerClone.querySelector('div.mark_gestalt');
                    if (markGestalt) {
                        // 移除脚本添加的按钮容器（在选项内部的）
                        const innerButtons = markGestalt.querySelectorAll('div[style*="display: inline-block"]');
                        innerButtons.forEach(btn => btn.remove());
                        const innerEditors = markGestalt.querySelectorAll('div[style*="display: none"]');
                        innerEditors.forEach(div => div.remove());
                        questionHTML += markGestalt.outerHTML;
                    }

                    // 移除AI讲解链接
                    const aiLinks = containerClone.querySelectorAll('a.aiAssistant');
                    aiLinks.forEach(link => link.remove());

                    // 如果还是没有内容，尝试从 aiAreaContent 获取
                    if (!questionHTML) {
                        const aiAreaContent = containerClone.querySelector('.aiAreaContent');
                        if (aiAreaContent) {
                            // 移除 mark_name 避免重复
                            const mn = aiAreaContent.querySelector('.mark_name');
                            if (mn) mn.remove();
                            questionHTML = aiAreaContent.innerHTML;
                        }
                    }
                }

                console.log(`题目 ${index + 1}:`, {
                    title: titleText,
                    hasQuestionHTML: !!questionHTML,
                    questionHTMLLength: questionHTML.length,
                    hasAnswerHTML: !!answerHTML,
                    answerHTMLLength: answerHTML?.length || 0
                });

                content.push({
                    type: 'question',
                    index: index + 1,
                    title: titleText,
                    questionHTML: questionHTML,
                    answerHTML: answerHTML
                });
            });

            return { docTitle, questions: content };
        }

        async _generateDocx(content, includeAnswer = false) {
            // 获取导出设置（答案由参数控制，不从设置读取）
            const exportDefaults = this.config.get('exportSettings');
            let exportSettings = {};
            let contentOptions = {};
            try {
                const allSettings = await this.dbManager.getAllSettings();
                exportSettings = {
                    fontFamily: allSettings.exportFontFamily ?? exportDefaults.fontFamily,
                    fontSize: allSettings.exportFontSize ?? exportDefaults.fontSize,
                    titleFontSize: allSettings.exportTitleFontSize ?? exportDefaults.titleFontSize,
                    lineHeight: allSettings.exportLineHeight ?? exportDefaults.lineHeight,
                    pageMargin: allSettings.exportPageMargin ?? exportDefaults.pageMargin
                };
                // 导出内容选项
                contentOptions = {
                    exportMyAnswer: allSettings.exportMyAnswer ?? exportDefaults.exportMyAnswer,
                    exportCorrectAnswer: allSettings.exportCorrectAnswer ?? exportDefaults.exportCorrectAnswer,
                    exportScore: allSettings.exportScore ?? exportDefaults.exportScore,
                    exportAnalysis: allSettings.exportAnalysis ?? exportDefaults.exportAnalysis
                };
            } catch (e) {
                exportSettings = { ...exportDefaults };
                contentOptions = {
                    exportMyAnswer: exportDefaults.exportMyAnswer,
                    exportCorrectAnswer: exportDefaults.exportCorrectAnswer,
                    exportScore: exportDefaults.exportScore,
                    exportAnalysis: exportDefaults.exportAnalysis
                };
            }

            // 根据导出内容选项过滤答案HTML
            const filterAnswerHtml = (answerHTML) => {
                if (!answerHTML) return '';

                const tempDiv = document.createElement('div');
                tempDiv.innerHTML = answerHTML;

                // 如果不导出"我的答案"，移除相关元素
                if (!contentOptions.exportMyAnswer) {
                    // 移除包含"我的答案"的span（查找包含stuAnswerContent的父span）
                    const myAnswerSpans = tempDiv.querySelectorAll('.stuAnswerContent');
                    myAnswerSpans.forEach(span => {
                        // 找到包含"我的答案:"标签的父级span
                        const parentSpan = span.closest('span.colorDeep.marginRight40.fl') || span.parentElement;
                        if (parentSpan) parentSpan.remove();
                    });
                }

                // 如果不导出"正确答案"，移除相关元素
                if (!contentOptions.exportCorrectAnswer) {
                    const correctAnswerSpans = tempDiv.querySelectorAll('.rightAnswerContent');
                    correctAnswerSpans.forEach(span => {
                        const parentSpan = span.closest('span.colorGreen.marginRight40.fl') || span.parentElement;
                        if (parentSpan) parentSpan.remove();
                    });
                }

                // 如果不导出"本题得分"，移除相关元素
                if (!contentOptions.exportScore) {
                    const scoreDiv = tempDiv.querySelector('.mark_score');
                    if (scoreDiv) scoreDiv.remove();
                }

                // 如果不导出"答案解析"，移除相关元素
                if (!contentOptions.exportAnalysis) {
                    const analysisDiv = tempDiv.querySelector('.analysisDiv');
                    if (analysisDiv) analysisDiv.remove();
                }

                return tempDiv.innerHTML;
            };

            // 使用 GM_xmlhttpRequest 下载图片（绕过 CORS 限制）
            const downloadImageAsBase64 = (imgUrl) => {
                return new Promise((resolve) => {
                    // 处理相对路径
                    let fullUrl = imgUrl;
                    if (imgUrl.startsWith('//')) {
                        fullUrl = 'https:' + imgUrl;
                    } else if (imgUrl.startsWith('/')) {
                        fullUrl = window.location.origin + imgUrl;
                    }

                    console.log('[图片下载] 开始下载:', fullUrl);

                    // 检查是否有 GM_xmlhttpRequest 可用
                    if (typeof GM_xmlhttpRequest === 'function') {
                        console.log('[图片下载] 使用 GM_xmlhttpRequest');
                        try {
                            GM_xmlhttpRequest({
                                method: 'GET',
                                url: fullUrl,
                                responseType: 'blob',
                                timeout: 15000,
                                headers: {
                                    'Referer': window.location.href
                                },
                                onload: function (response) {
                                    console.log('[图片下载] 响应状态:', response.status, '类型:', response.response?.type);
                                    if (response.status === 200 && response.response) {
                                        const reader = new FileReader();
                                        reader.onloadend = () => {
                                            console.log('[图片下载] 转换成功, base64长度:', reader.result?.length);
                                            resolve(reader.result);
                                        };
                                        reader.onerror = (e) => {
                                            console.error('[图片下载] FileReader 错误:', e);
                                            resolve(fullUrl);
                                        };
                                        reader.readAsDataURL(response.response);
                                    } else {
                                        console.warn('[图片下载] 响应错误:', response.status, response.statusText);
                                        resolve(fullUrl);
                                    }
                                },
                                onerror: function (error) {
                                    console.error('[图片下载] GM_xmlhttpRequest 错误:', error);
                                    resolve(fullUrl);
                                },
                                ontimeout: function () {
                                    console.warn('[图片下载] 超时:', fullUrl);
                                    resolve(fullUrl);
                                }
                            });
                        } catch (e) {
                            console.error('[图片下载] GM_xmlhttpRequest 异常:', e);
                            resolve(fullUrl);
                        }
                    } else {
                        // GM_xmlhttpRequest 不可用，尝试 fetch
                        console.warn('[图片下载] GM_xmlhttpRequest 不可用，尝试 fetch');
                        fetch(fullUrl, { mode: 'cors', credentials: 'include' })
                            .then(response => response.blob())
                            .then(blob => {
                                const reader = new FileReader();
                                reader.onloadend = () => resolve(reader.result);
                                reader.onerror = () => resolve(fullUrl);
                                reader.readAsDataURL(blob);
                            })
                            .catch(e => {
                                console.error('[图片下载] fetch 错误:', e);
                                resolve(fullUrl);
                            });
                    }
                });
            };

            // 处理HTML中的图片（包括尺寸调整）
            // A4纸内容区域约 21cm - 4cm边距 = 17cm ≈ 480pt，这里设置稍小一点确保不超出
            const MAX_IMAGE_WIDTH = 600;  // 最大宽度（像素）

            // 获取图片尺寸，仅当超出最大宽度时才缩放
            const getScaledImageSize = (base64Data) => {
                return new Promise((resolve) => {
                    const img = new Image();
                    img.onload = () => {
                        const originalWidth = img.naturalWidth;
                        const originalHeight = img.naturalHeight;

                        // 只有当宽度超出时才缩放
                        if (originalWidth > MAX_IMAGE_WIDTH) {
                            const scale = MAX_IMAGE_WIDTH / originalWidth;
                            const newWidth = MAX_IMAGE_WIDTH;
                            const newHeight = Math.round(originalHeight * scale);
                            console.log(`[图片缩放] ${originalWidth}x${originalHeight} → ${newWidth}x${newHeight}`);
                            resolve({ width: newWidth, height: newHeight, scaled: true });
                        } else {
                            // 不需要缩放，保持原尺寸
                            console.log(`[图片尺寸] ${originalWidth}x${originalHeight} (无需缩放)`);
                            resolve({ width: originalWidth, height: originalHeight, scaled: false });
                        }
                    };
                    img.onerror = () => {
                        console.warn('[图片尺寸] 无法获取尺寸');
                        resolve({ width: null, height: null, scaled: false });
                    };
                    img.src = base64Data;
                });
            };

            // 处理HTML中的图片
            const processImagesInHtml = async (html) => {
                if (!html) return '';
                const tempDiv = document.createElement('div');
                tempDiv.innerHTML = html;

                const images = tempDiv.querySelectorAll('img');
                for (const img of images) {
                    // 优先使用 data-original（高清原图）
                    const originalSrc = img.getAttribute('data-original');
                    const src = originalSrc || img.getAttribute('src');
                    if (src) {
                        console.log('正在处理图片:', src);
                        const processedSrc = await downloadImageAsBase64(src);
                        img.setAttribute('src', processedSrc);
                        // 移除可能干扰的属性
                        img.removeAttribute('data-original');
                        img.removeAttribute('data-src');

                        // 检查是否成功转为 base64
                        if (processedSrc.startsWith('data:')) {
                            // 获取尺寸信息，只有超宽的才会被缩放
                            const sizeInfo = await getScaledImageSize(processedSrc);

                            if (sizeInfo.scaled && sizeInfo.width && sizeInfo.height) {
                                // 只有被缩放的图片才设置固定尺寸
                                img.setAttribute('width', sizeInfo.width);
                                img.setAttribute('height', sizeInfo.height);
                                img.style.width = `${sizeInfo.width}px`;
                                img.style.height = `${sizeInfo.height}px`;
                            }
                            // 未缩放的图片保持原样，不设置尺寸属性
                        } else {
                            console.warn('图片保留原URL:', processedSrc);
                            // 对于未转换的图片，使用CSS限制最大宽度作为保险
                            img.style.maxWidth = `${MAX_IMAGE_WIDTH}px`;
                            img.style.height = 'auto';
                        }
                    }
                }

                return tempDiv.innerHTML;
            };

            // 清理HTML，保留原始样式和结构，移除不需要的元素
            const cleanHtml = (html) => {
                if (!html) return '';
                const tempDiv = document.createElement('div');
                tempDiv.innerHTML = html;

                // 移除 element-invisible-hidden 类的元素（包含选项完整内容，如":1968年NATO会议"）
                // 用户只需要答案字母（如"B"），不需要这些冗余内容
                const hiddenElements = tempDiv.querySelectorAll('.element-invisible-hidden');
                hiddenElements.forEach(el => el.remove());

                return tempDiv.innerHTML;
            };

            // 构建纯HTML格式文档（Word可以直接打开.doc格式的HTML）
            let htmlContent = `<!DOCTYPE html>
<html xmlns:o="urn:schemas-microsoft-com:office:office"
      xmlns:w="urn:schemas-microsoft-com:office:word"
      xmlns="http://www.w3.org/TR/REC-html40">
<head>
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8">
    <meta name="ProgId" content="Word.Document">
    <meta name="Generator" content="Microsoft Word 15">
    <!--[if gte mso 9]>
    <xml>
        <w:WordDocument>
            <w:View>Print</w:View>
            <w:Zoom>100</w:Zoom>
            <w:DoNotOptimizeForBrowser/>
        </w:WordDocument>
    </xml>
    <![endif]-->
    <style>
        /* 页面基础设置 */
        @page { 
            size: A4; 
            margin: ${exportSettings.pageMargin};
        }
        body { 
            font-family: '${exportSettings.fontFamily}', SimSun, serif; 
            font-size: ${exportSettings.fontSize}pt; 
            line-height: ${exportSettings.lineHeight};
            color: #333;
        }
        
        /* 文档标题 */
        .doc-title {
            text-align: center;
            font-size: ${exportSettings.titleFontSize}pt;
            font-weight: bold;
            margin-bottom: 30px;
            color: #000;
        }
        
        /* 题目容器（添加明显分隔线） */
        .question {
            margin-bottom: 30px;
            padding-bottom: 20px;
            border-bottom: 2px solid #2d3748;
            page-break-inside: avoid;
        }
        .question:last-child {
            border-bottom: none;
        }
        
        /* 题目标题（题号和分值） */
        .question-header {
            font-weight: bold;
            font-size: ${exportSettings.fontSize}pt;
            color: #000;
            margin-bottom: 10px;
            background-color: #f5f5f5;
            padding: 5px 10px;
        }
        
        /* 题目内容区域 */
        .question-content {
            margin: 10px 0;
        }
        .question-content img {
            max-width: 500px;
            height: auto;
        }
        
        /* 答案区域 */
        .answer-section {
            margin-top: 15px;
            padding: 10px;
            background-color: #fff8f8;
            border-left: 3px solid #e74c3c;
        }
        .answer-label {
            font-weight: bold;
            color: #e74c3c;
        }
        .answer-content {
            margin-top: 5px;
        }
        .answer-content img {
            max-width: 500px;
            height: auto;
        }
        
        /* ========== 保留原始网页样式 ========== */
        
        /* 题目名称样式 */
        .mark_name {
            font-weight: bold;
            margin-bottom: 10px;
        }
        .colorShallow {
            color: #999;
            font-weight: normal;
        }
        .colorDeep {
            color: #333;
        }
        .colorGreen {
            color: #48bb78;
        }
        
        /* 单选/多选题选项样式 */
        .mark_letter {
            list-style: none;
            padding: 0;
            margin: 10px 0;
        }
        .mark_letter li {
            padding: 8px 0;
            border-bottom: 1px dashed #e2e8f0;
        }
        .mark_letter li:last-child {
            border-bottom: none;
        }
        
        /* 完型填空选项样式 */
        .mark_gestalt {
            margin: 15px 0;
        }
        .gestalt_row {
            margin: 12px 0;
            padding: 8px 0;
            border-bottom: 1px dashed #e2e8f0;
        }
        .gestalt_row:last-child {
            border-bottom: none;
        }
        .gestalt_row dt {
            font-weight: bold;
            color: #2d3748;
            margin-bottom: 8px;
        }
        .gestalt_row dd {
            display: inline-block;
            margin: 4px 20px 4px 0;
        }
        .gestalt_num {
            font-weight: bold;
            margin-right: 5px;
        }
        
        /* 答案详情样式 */
        .mark_answer {
            padding: 10px;
            background: #f7fafc;
            border-radius: 4px;
        }
        .mark_key {
            margin-bottom: 10px;
        }
        .mark_fill dt {
            font-weight: bold;
        }
        .mark_fill dd {
            display: inline;
        }
        .gestalt_fill {
            display: inline-block;
            margin-right: 15px;
            padding: 2px 8px;
            background: #edf2f7;
            border-radius: 4px;
        }
        .mark_score {
            margin-top: 10px;
            padding-top: 10px;
            border-top: 1px solid #e2e8f0;
        }
        .totalScore {
            font-weight: bold;
            color: #e53e3e;
        }
        .fontWeight {
            font-weight: bold;
        }
        .marginRight40 {
            margin-right: 40px;
        }
        .fl {
            display: inline-block;
        }
        .fr {
            float: right;
        }
        .stuAnswerContent, .rightAnswerContent {
            font-weight: bold;
        }
        
        /* 表格样式 */
        table {
            border-collapse: collapse;
            width: 100%;
            margin: 10px 0;
        }
        td, th {
            border: 1px solid #ddd;
            padding: 8px;
            text-align: left;
        }
    </style>
</head>
<body>
    <div class="doc-title">${this._escapeHtml(content.docTitle)}</div>
`;

            // 处理每道题目
            for (const item of content.questions) {
                // 处理题目HTML中的图片（异步处理，尝试转为base64）
                const processedQuestionHtml = await processImagesInHtml(cleanHtml(item.questionHTML || ''));

                htmlContent += `
    <div class="question">
        <div class="question-header">${this._escapeHtml(item.title)}</div>
        <div class="question-content">${processedQuestionHtml}</div>`;

                // 根据参数决定是否导出答案
                if (includeAnswer && item.answerHTML) {
                    // 先过滤答案内容（根据导出内容选项）
                    const filteredAnswerHtml = filterAnswerHtml(item.answerHTML);
                    // 只有过滤后仍有内容才显示答案区域
                    if (filteredAnswerHtml.trim()) {
                        const processedAnswerHtml = await processImagesInHtml(cleanHtml(filteredAnswerHtml));
                        htmlContent += `
        <div class="answer-section">
            <div class="answer-label">【答案】</div>
            <div class="answer-content">${processedAnswerHtml}</div>
        </div>`;
                    }
                }

                htmlContent += `
    </div>
`;
            }

            htmlContent += `
</body>
</html>`;

            // 生成文件名（使用文档标题 + 时间戳）
            const now = new Date();
            const dateStr = `${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}${String(now.getDate()).padStart(2, '0')}`;
            const timeStr = `${String(now.getHours()).padStart(2, '0')}${String(now.getMinutes()).padStart(2, '0')}`;
            // 清理文件名中的非法字符
            const safeTitle = content.docTitle.replace(/[\\/:*?"<>|]/g, '_').substring(0, 50);

            let blob;
            let fileExtension;

            // 尝试使用 html-docx-js 库生成真正的 docx 文件
            if (typeof htmlDocx !== 'undefined' && htmlDocx.asBlob) {
                try {
                    console.log('[导出] 使用 html-docx-js 生成 docx 文件');
                    blob = htmlDocx.asBlob(htmlContent);
                    fileExtension = 'docx';
                    Logger.success('正在生成 docx 文件...');
                } catch (e) {
                    console.warn('[导出] html-docx-js 转换失败，回退到 doc 格式:', e);
                    // 回退到 HTML 格式的 doc 文件
                    blob = new Blob(['\ufeff' + htmlContent], {
                        type: 'application/msword'
                    });
                    fileExtension = 'doc';
                }
            } else {
                console.log('[导出] html-docx-js 库不可用，使用 doc 格式');
                // html-docx-js 库不可用，使用 HTML 格式的 doc 文件
                blob = new Blob(['\ufeff' + htmlContent], {
                    type: 'application/msword'
                });
                fileExtension = 'doc';
            }

            // 生成下载链接
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = `${safeTitle}_${dateStr}_${timeStr}.${fileExtension}`;

            // 触发下载
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(url);
        }

        /**
         * 生成 DOC 格式文档（手机版-兼容性更好）
         * 直接使用 HTML 格式的 .doc 文件，跳过 html-docx-js 转换
         * @param {Object} content - 文档内容对象
         * @param {boolean} includeAnswer - 是否包含答案
         */
        async _generateDoc(content, includeAnswer = false) {
            // 获取导出设置（与docx共用配置）
            const exportDefaults = this.config.get('exportSettings');
            let exportSettings = {};
            let contentOptions = {};
            try {
                const allSettings = await this.dbManager.getAllSettings();
                exportSettings = {
                    fontFamily: allSettings.exportFontFamily ?? exportDefaults.fontFamily,
                    fontSize: allSettings.exportFontSize ?? exportDefaults.fontSize,
                    titleFontSize: allSettings.exportTitleFontSize ?? exportDefaults.titleFontSize,
                    lineHeight: allSettings.exportLineHeight ?? exportDefaults.lineHeight,
                    pageMargin: allSettings.exportPageMargin ?? exportDefaults.pageMargin
                };
                // 导出内容选项
                contentOptions = {
                    exportMyAnswer: allSettings.exportMyAnswer ?? exportDefaults.exportMyAnswer,
                    exportCorrectAnswer: allSettings.exportCorrectAnswer ?? exportDefaults.exportCorrectAnswer,
                    exportScore: allSettings.exportScore ?? exportDefaults.exportScore,
                    exportAnalysis: allSettings.exportAnalysis ?? exportDefaults.exportAnalysis
                };
            } catch (e) {
                exportSettings = { ...exportDefaults };
                contentOptions = {
                    exportMyAnswer: exportDefaults.exportMyAnswer,
                    exportCorrectAnswer: exportDefaults.exportCorrectAnswer,
                    exportScore: exportDefaults.exportScore,
                    exportAnalysis: exportDefaults.exportAnalysis
                };
            }

            // 根据导出内容选项过滤答案HTML（复用_generateDocx中的逻辑）
            const filterAnswerHtml = (answerHTML) => {
                if (!answerHTML) return '';

                const tempDiv = document.createElement('div');
                tempDiv.innerHTML = answerHTML;

                if (!contentOptions.exportMyAnswer) {
                    const myAnswerSpans = tempDiv.querySelectorAll('.stuAnswerContent');
                    myAnswerSpans.forEach(span => {
                        const parentSpan = span.closest('span.colorDeep.marginRight40.fl') || span.parentElement;
                        if (parentSpan) parentSpan.remove();
                    });
                }

                if (!contentOptions.exportCorrectAnswer) {
                    const correctAnswerSpans = tempDiv.querySelectorAll('.rightAnswerContent');
                    correctAnswerSpans.forEach(span => {
                        const parentSpan = span.closest('span.colorGreen.marginRight40.fl') || span.parentElement;
                        if (parentSpan) parentSpan.remove();
                    });
                }

                if (!contentOptions.exportScore) {
                    const scoreDiv = tempDiv.querySelector('.mark_score');
                    if (scoreDiv) scoreDiv.remove();
                }

                if (!contentOptions.exportAnalysis) {
                    const analysisDiv = tempDiv.querySelector('.analysisDiv');
                    if (analysisDiv) analysisDiv.remove();
                }

                return tempDiv.innerHTML;
            };

            // 使用 GM_xmlhttpRequest 下载图片（复用_generateDocx中的逻辑）
            const downloadImageAsBase64 = (imgUrl) => {
                return new Promise((resolve) => {
                    let fullUrl = imgUrl;
                    if (imgUrl.startsWith('//')) {
                        fullUrl = 'https:' + imgUrl;
                    } else if (imgUrl.startsWith('/')) {
                        fullUrl = window.location.origin + imgUrl;
                    }

                    console.log('[图片下载] 开始下载:', fullUrl);

                    if (typeof GM_xmlhttpRequest === 'function') {
                        console.log('[图片下载] 使用 GM_xmlhttpRequest');
                        try {
                            GM_xmlhttpRequest({
                                method: 'GET',
                                url: fullUrl,
                                responseType: 'blob',
                                timeout: 15000,
                                headers: {
                                    'Referer': window.location.href
                                },
                                onload: function (response) {
                                    console.log('[图片下载] 响应状态:', response.status, '类型:', response.response?.type);
                                    if (response.status === 200 && response.response) {
                                        const reader = new FileReader();
                                        reader.onloadend = () => {
                                            console.log('[图片下载] 转换成功, base64长度:', reader.result?.length);
                                            resolve(reader.result);
                                        };
                                        reader.onerror = (e) => {
                                            console.error('[图片下载] FileReader 错误:', e);
                                            resolve(fullUrl);
                                        };
                                        reader.readAsDataURL(response.response);
                                    } else {
                                        console.warn('[图片下载] 响应错误:', response.status, response.statusText);
                                        resolve(fullUrl);
                                    }
                                },
                                onerror: function (error) {
                                    console.error('[图片下载] GM_xmlhttpRequest 错误:', error);
                                    resolve(fullUrl);
                                },
                                ontimeout: function () {
                                    console.warn('[图片下载] 超时:', fullUrl);
                                    resolve(fullUrl);
                                }
                            });
                        } catch (e) {
                            console.error('[图片下载] GM_xmlhttpRequest 异常:', e);
                            resolve(fullUrl);
                        }
                    } else {
                        console.warn('[图片下载] GM_xmlhttpRequest 不可用，尝试 fetch');
                        fetch(fullUrl, { mode: 'cors', credentials: 'include' })
                            .then(response => response.blob())
                            .then(blob => {
                                const reader = new FileReader();
                                reader.onloadend = () => resolve(reader.result);
                                reader.onerror = () => resolve(fullUrl);
                                reader.readAsDataURL(blob);
                            })
                            .catch(e => {
                                console.error('[图片下载] fetch 错误:', e);
                                resolve(fullUrl);
                            });
                    }
                });
            };

            const MAX_IMAGE_WIDTH = 600;

            const getScaledImageSize = (base64Data) => {
                return new Promise((resolve) => {
                    const img = new Image();
                    img.onload = () => {
                        const originalWidth = img.naturalWidth;
                        const originalHeight = img.naturalHeight;

                        if (originalWidth > MAX_IMAGE_WIDTH) {
                            const scale = MAX_IMAGE_WIDTH / originalWidth;
                            const newWidth = MAX_IMAGE_WIDTH;
                            const newHeight = Math.round(originalHeight * scale);
                            console.log(`[图片缩放] ${originalWidth}x${originalHeight} → ${newWidth}x${newHeight}`);
                            resolve({ width: newWidth, height: newHeight, scaled: true });
                        } else {
                            console.log(`[图片尺寸] ${originalWidth}x${originalHeight} (无需缩放)`);
                            resolve({ width: originalWidth, height: originalHeight, scaled: false });
                        }
                    };
                    img.onerror = () => {
                        console.warn('[图片尺寸] 无法获取尺寸');
                        resolve({ width: null, height: null, scaled: false });
                    };
                    img.src = base64Data;
                });
            };

            const processImagesInHtml = async (html) => {
                if (!html) return '';
                const tempDiv = document.createElement('div');
                tempDiv.innerHTML = html;

                const images = tempDiv.querySelectorAll('img');
                for (const img of images) {
                    const originalSrc = img.getAttribute('data-original');
                    const src = originalSrc || img.getAttribute('src');
                    if (src) {
                        console.log('正在处理图片:', src);
                        const processedSrc = await downloadImageAsBase64(src);
                        img.setAttribute('src', processedSrc);
                        img.removeAttribute('data-original');
                        img.removeAttribute('data-src');

                        if (processedSrc.startsWith('data:')) {
                            const sizeInfo = await getScaledImageSize(processedSrc);

                            if (sizeInfo.scaled && sizeInfo.width && sizeInfo.height) {
                                img.setAttribute('width', sizeInfo.width);
                                img.setAttribute('height', sizeInfo.height);
                                img.style.width = `${sizeInfo.width}px`;
                                img.style.height = `${sizeInfo.height}px`;
                            }
                        } else {
                            console.warn('图片保留原URL:', processedSrc);
                            img.style.maxWidth = `${MAX_IMAGE_WIDTH}px`;
                            img.style.height = 'auto';
                        }
                    }
                }

                return tempDiv.innerHTML;
            };

            const cleanHtml = (html) => {
                if (!html) return '';
                const tempDiv = document.createElement('div');
                tempDiv.innerHTML = html;

                const hiddenElements = tempDiv.querySelectorAll('.element-invisible-hidden');
                hiddenElements.forEach(el => el.remove());

                return tempDiv.innerHTML;
            };

            // 构建纯HTML格式文档（与docx使用相同的HTML结构和样式）
            let htmlContent = `<!DOCTYPE html>
<html xmlns:o="urn:schemas-microsoft-com:office:office"
      xmlns:w="urn:schemas-microsoft-com:office:word"
      xmlns="http://www.w3.org/TR/REC-html40">
<head>
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8">
    <meta name="ProgId" content="Word.Document">
    <meta name="Generator" content="Microsoft Word 15">
    <!--[if gte mso 9]>
    <xml>
        <w:WordDocument>
            <w:View>Print</w:View>
            <w:Zoom>100</w:Zoom>
            <w:DoNotOptimizeForBrowser/>
        </w:WordDocument>
    </xml>
    <![endif]-->
    <style>
        /* 页面基础设置 */
        @page { 
            size: A4; 
            margin: ${exportSettings.pageMargin};
        }
        body { 
            font-family: '${exportSettings.fontFamily}', SimSun, serif; 
            font-size: ${exportSettings.fontSize}pt; 
            line-height: ${exportSettings.lineHeight};
            color: #333;
        }
        
        /* 文档标题 */
        .doc-title {
            text-align: center;
            font-size: ${exportSettings.titleFontSize}pt;
            font-weight: bold;
            margin-bottom: 30px;
            color: #000;
        }
        
        /* 题目容器（添加明显分隔线） */
        .question {
            margin-bottom: 30px;
            padding-bottom: 20px;
            border-bottom: 2px solid #2d3748;
            page-break-inside: avoid;
        }
        .question:last-child {
            border-bottom: none;
        }
        
        /* 题目标题（题号和分值） */
        .question-header {
            font-weight: bold;
            font-size: ${exportSettings.fontSize}pt;
            color: #000;
            margin-bottom: 10px;
            background-color: #f5f5f5;
            padding: 5px 10px;
        }
        
        /* 题目内容区域 */
        .question-content {
            margin: 10px 0;
        }
        .question-content img {
            max-width: 500px;
            height: auto;
        }
        
        /* 答案区域 */
        .answer-section {
            margin-top: 15px;
            padding: 10px;
            background-color: #fff8f8;
            border-left: 3px solid #e74c3c;
        }
        .answer-label {
            font-weight: bold;
            color: #e74c3c;
        }
        .answer-content {
            margin-top: 5px;
        }
        .answer-content img {
            max-width: 500px;
            height: auto;
        }
        
        /* ========== 保留原始网页样式 ========== */
        
        /* 题目名称样式 */
        .mark_name {
            font-weight: bold;
            margin-bottom: 10px;
        }
        .colorShallow {
            color: #999;
            font-weight: normal;
        }
        .colorDeep {
            color: #333;
        }
        .colorGreen {
            color: #48bb78;
        }
        
        /* 单选/多选题选项样式 */
        .mark_letter {
            list-style: none;
            padding: 0;
            margin: 10px 0;
        }
        .mark_letter li {
            padding: 8px 0;
            border-bottom: 1px dashed #e2e8f0;
        }
        .mark_letter li:last-child {
            border-bottom: none;
        }
        
        /* 完型填空选项样式 */
        .mark_gestalt {
            margin: 15px 0;
        }
        .gestalt_row {
            margin: 12px 0;
            padding: 8px 0;
            border-bottom: 1px dashed #e2e8f0;
        }
        .gestalt_row:last-child {
            border-bottom: none;
        }
        .gestalt_row dt {
            font-weight: bold;
            color: #2d3748;
            margin-bottom: 8px;
        }
        .gestalt_row dd {
            display: inline-block;
            margin: 4px 20px 4px 0;
        }
        .gestalt_num {
            font-weight: bold;
            margin-right: 5px;
        }
        
        /* 答案详情样式 */
        .mark_answer {
            padding: 10px;
            background: #f7fafc;
            border-radius: 4px;
        }
        .mark_key {
            margin-bottom: 10px;
        }
        .mark_fill dt {
            font-weight: bold;
        }
        .mark_fill dd {
            display: inline;
        }
        .gestalt_fill {
            display: inline-block;
            margin-right: 15px;
            padding: 2px 8px;
            background: #edf2f7;
            border-radius: 4px;
        }
        .mark_score {
            margin-top: 10px;
            padding-top: 10px;
            border-top: 1px solid #e2e8f0;
        }
        .totalScore {
            font-weight: bold;
            color: #e53e3e;
        }
        .fontWeight {
            font-weight: bold;
        }
        .marginRight40 {
            margin-right: 40px;
        }
        .fl {
            display: inline-block;
        }
        .fr {
            float: right;
        }
        .stuAnswerContent, .rightAnswerContent {
            font-weight: bold;
        }
        
        /* 表格样式 */
        table {
            border-collapse: collapse;
            width: 100%;
            margin: 10px 0;
        }
        td, th {
            border: 1px solid #ddd;
            padding: 8px;
            text-align: left;
        }
    </style>
</head>
<body>
    <div class="doc-title">${this._escapeHtml(content.docTitle)}</div>
`;

            // 处理每道题目
            for (const item of content.questions) {
                const processedQuestionHtml = await processImagesInHtml(cleanHtml(item.questionHTML || ''));

                htmlContent += `
    <div class="question">
        <div class="question-header">${this._escapeHtml(item.title)}</div>
        <div class="question-content">${processedQuestionHtml}</div>`;

                if (includeAnswer && item.answerHTML) {
                    const filteredAnswerHtml = filterAnswerHtml(item.answerHTML);
                    if (filteredAnswerHtml.trim()) {
                        const processedAnswerHtml = await processImagesInHtml(cleanHtml(filteredAnswerHtml));
                        htmlContent += `
        <div class="answer-section">
            <div class="answer-label">答案</div>
            <div class="answer-content">${processedAnswerHtml}</div>
        </div>`;
                    }
                }

                htmlContent += `
    </div>
`;
            }

            htmlContent += `
</body>
</html>`;

            // 生成文件名（与docx使用相同的命名规则）
            const now = new Date();
            const dateStr = `${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}${String(now.getDate()).padStart(2, '0')}`;
            const timeStr = `${String(now.getHours()).padStart(2, '0')}${String(now.getMinutes()).padStart(2, '0')}`;
            const safeTitle = content.docTitle.replace(/[\\/:*?"<>|]/g, '_').substring(0, 50);

            // 直接生成DOC格式（跳过html-docx-js转换）
            console.log('[导出] 生成 DOC 格式文件（手机版）');
            const blob = new Blob(['\ufeff' + htmlContent], {
                type: 'application/msword'
            });
            Logger.success('正在生成 DOC 文件（手机版）...');

            // 生成下载链接
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = `${safeTitle}_${dateStr}_${timeStr}.doc`;

            // 触发下载
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(url);
        }

        _escapeHtml(text) {
            if (!text) return '';
            const div = document.createElement('div');
            div.textContent = text;
            return div.innerHTML;
        }

        _handleManageClick() {
            const controlPanel = new ControlPanelUI(this.dbManager, this.workKey, this.config);
            controlPanel.show();
        }

        _handleGlobalToggle() {
            const allHidden = this.controllers.every(ctrl => ctrl.getState());

            this.controllers.forEach(controller => {
                const shouldToggle = allHidden ? controller.getState() : !controller.getState();
                if (shouldToggle) {
                    controller.toggle();
                }
            });

            this._updateGlobalButtonState(!allHidden);
        }

        _updateGlobalButtonState(allHidden) {
            const buttonText = this.config.get('globalButton.text');
            const colors = this.config.get('globalButton.colors');

            this.globalButton.innerText = allHidden ? buttonText.showAll : buttonText.hideAll;
            this.globalButton.style.background = allHidden ? colors.showAllBackground : colors.hideAllBackground;
        }
    }

    // ===================== 主应用类 =====================
    class ChaoxingAnswerHider {
        constructor(customConfig = {}) {
            this.config = new Config(customConfig);
            this.styleGenerator = new StyleGenerator(this.config);
            this.dbManager = new DatabaseManager(this.config);
            this.answerControllers = [];
            this.globalController = null;
            this.workKey = URLParser.getWorkKey();
            this.doubaoTabRef = null; // 存储豆包AI标签页的引用
        }

        async initialize() {
            try {
                // 初始化数据库
                await this.dbManager.init();
                Logger.success('数据库初始化成功');

                // 加载自定义样式配置
                await this._loadCustomStyles();

                await this._waitForPageLoad();
                const elements = this._findElements();

                if (!this._validateElements(elements)) {
                    return;
                }

                await this._initializeAnswerBlocks(elements.answerBlocks);
                this._initializeGlobalControl(elements.container);
                this._logSuccess(elements.answerBlocks.length, !!elements.container);
            } catch (error) {
                Logger.error('初始化失败', error);
            }
        }

        async _loadCustomStyles() {
            try {
                const customStyles = await this.dbManager.getSetting('customStyles', {});
                if (customStyles && Object.keys(customStyles).length > 0) {
                    // 将自定义样式合并到配置中
                    this.config = new Config(this.config._deepMerge(this.config.config, customStyles));
                    this.styleGenerator = new StyleGenerator(this.config);
                    Logger.log('✨ 已加载自定义样式配置');
                }
            } catch (error) {
                Logger.error('加载自定义样式失败', error);
            }
        }

        _waitForPageLoad() {
            const delay = this.config.get('delays.initialization');
            return new Promise(resolve => setTimeout(resolve, delay));
        }

        _findElements() {
            return {
                container: document.querySelector(this.config.get('selectors.container')),
                answerBlocks: document.querySelectorAll(this.config.get('selectors.answerBlock'))
            };
        }

        _validateElements({ container, answerBlocks }) {
            if (answerBlocks.length === 0) {
                Logger.log(this.config.get('messages.noAnswerBlocks'));
                return false;
            }

            if (!container) {
                Logger.log(this.config.get('messages.noContainer'), 'warn');
            }

            return true;
        }

        async _initializeAnswerBlocks(blocks) {
            for (const block of blocks) {
                const controller = new AnswerBlockController(
                    block,
                    this.config,
                    this.styleGenerator,
                    this.dbManager,
                    this.workKey,
                    this  // 传递应用实例引用
                );
                await controller.initialize();
                this.answerControllers.push(controller);
            }
        }

        _initializeGlobalControl(container) {
            this.globalController = new GlobalController(
                container,
                this.answerControllers,
                this.config,
                this.styleGenerator,
                this.dbManager,
                this.workKey
            );
            this.globalController.initialize();
        }

        _logSuccess(count, hasContainer) {
            Logger.success(this.config.get('messages.success'));
            Logger.log(this.config.get('messages.hiddenCount')(count));
            Logger.log(this.config.get('messages.globalButton')(hasContainer));
            Logger.log(`📝 笔记功能已启用，数据存储标识: ${this.workKey}`);
        }
    }

    // ===================== 启动应用 =====================
    // 检测当前页面是超星还是豆包
    if (window.location.hostname.includes('doubao.com')) {
        // ===================== 豆包AI页面逻辑 =====================
        Logger.log('检测到豆包AI页面，正在初始化自动填充功能...');

        /**
         * 检测是否为移动端设备
         * @returns {boolean} true表示移动端，false表示桌面端
         */
        function isMobileDevice() {
            return /Android|iPhone|iPad|iPod|Mobile/i.test(navigator.userAgent);
        }

        /**
         * 豆包AI自动发送逻辑（读取完整内容并填充）
         * 固定等待1.5秒确保页面加载完成
         */
        async function autoSendMessage() {
            const storageKey = 'chaoxing_doubao_question';

            try {
                // 读取内容
                const fullContent = GM_getValue(storageKey, '');
                console.log('🔍 读取GM存储的完整内容：');
                console.log('  内容预览:', fullContent ? `${fullContent.substring(0, 100)}...` : '(空)');
                console.log('  内容长度:', fullContent.length);

                if (!fullContent) {
                    Logger.warn('未找到待提问的题目内容');
                    GM_deleteValue(storageKey);
                    return;
                }

                Logger.log('找到待提问题目，准备自动填充和发送...');

                // 强制固定等待1.5秒，确保页面完全加载
                Logger.log('⏱️ 等待 1.5 秒确保页面加载...');
                await new Promise(resolve => setTimeout(resolve, 1500));

                // 直接获取元素
                const inputElem = document.querySelector('textarea[data-testid="chat_input_input"]');
                const sendBtn = document.querySelector('button[data-testid="chat_input_send_button"]');

                if (!inputElem || !sendBtn) {
                    throw new Error('等待1.5秒后仍未找到输入框或发送按钮');
                }

                Logger.log('✅ 已获取输入框和发送按钮');

                // 聚焦输入框
                inputElem.click();
                inputElem.focus();

                // 解锁输入逻辑
                document.execCommand('insertText', false, ' ');
                inputElem.dispatchEvent(new Event('input', { bubbles: true, composed: true }));
                inputElem.select();
                document.execCommand('backspace');

                // 输入内容
                document.execCommand('insertText', false, fullContent);
                inputElem.dispatchEvent(new Event('input', { bubbles: true, composed: true }));

                Logger.success('题目已填充到输入框');
                console.log('输入框内容:', inputElem.value.substring(0, 100) + '...');

                // 额外等待一小段时间，确保输入完全处理
                await new Promise(resolve => setTimeout(resolve, 300));

                // 使用 Enter 键发送
                inputElem.dispatchEvent(new KeyboardEvent('keydown', {
                    bubbles: true,
                    cancelable: true,
                    key: 'Enter',
                    code: 'Enter',
                    which: 13,
                    keyCode: 13
                }));

                inputElem.dispatchEvent(new KeyboardEvent('keyup', {
                    bubbles: true,
                    cancelable: true,
                    key: 'Enter',
                    code: 'Enter',
                    which: 13,
                    keyCode: 13
                }));

                Logger.success('已自动发送题目到豆包AI');
                console.log('已模拟按下 Enter 键发送');

            } catch (error) {
                Logger.error('豆包AI自动填充失败', error);
                console.error('详细错误:', error.message);
            } finally {
                // 清除缓存
                try {
                    GM_deleteValue(storageKey);
                    console.log('已清除本地缓存');
                } catch (e) {
                    console.warn('清除缓存失败（可忽略）:', e);
                }
            }
        }

        // 页面加载完成后自动执行一次（包裹在try-catch中防止崩溃）
        try {
            autoSendMessage();
            Logger.log('✅ 豆包AI自动填充功能已启动');
        } catch (error) {
            console.error('❌ 豆包AI自动填充启动失败:', error);
            // 即使失败也不影响页面使用
        }

    } else {
        // ===================== 超星学习通页面逻辑 =====================
        const app = new ChaoxingAnswerHider();
        app.initialize();
    }
})();
