// ==UserScript==
// @name         HDSky 体育沙龙管理面板-开发版
// @namespace    http://tampermonkey.net/
// @version      3.6
// @description  计算HDSky论坛赌注帖子的输赢和下注点数总和
// @author       江畔 | LOVE
// @match        *://hdsky.me/forums.php?action=viewtopic*
// @icon         https://hdsky.me/favicon.ico
// @grant        GM_setValue
// @grant        GM_getValue
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/558294/HDSky%20%E4%BD%93%E8%82%B2%E6%B2%99%E9%BE%99%E7%AE%A1%E7%90%86%E9%9D%A2%E6%9D%BF-%E5%BC%80%E5%8F%91%E7%89%88.user.js
// @updateURL https://update.greasyfork.org/scripts/558294/HDSky%20%E4%BD%93%E8%82%B2%E6%B2%99%E9%BE%99%E7%AE%A1%E7%90%86%E9%9D%A2%E6%9D%BF-%E5%BC%80%E5%8F%91%E7%89%88.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // ========== 调试开关 ==========
    // 设置为 false 时，submitBatchesInSequence 不会真正提交表单（用于调试）
    const ENABLE_BATCH_SUBMIT = true;  // 改为 false 可以禁用批次提交
    // =============================

    // 获取topicid
    function getTopicId() {
        const urlParams = new URLSearchParams(window.location.search);
        const topicid = urlParams.get('topicid');
        return topicid || '';
    }

    // 获取forumid（从URL或页面表单中）
    function getForumId() {
        // 首先尝试从URL获取
        const urlParams = new URLSearchParams(window.location.search);
        const forumid = urlParams.get('forumid');
        if (forumid) {
            return forumid;
        }
        
        // 如果URL中没有，尝试从页面上的第一个评分表单获取
        const firstForm = document.querySelector('div[id^="admark"] form');
        if (firstForm) {
            const forumidInput = firstForm.querySelector('input[name="forumid"]');
            if (forumidInput && forumidInput.value) {
                return forumidInput.value;
            }
        }
        
        return '29'; // 默认值（体育沙龙论坛ID）
    }

    // 检测是否为手机端
    function isMobile() {
        return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ||
               (window.innerWidth <= 768 && window.innerHeight <= 1024);
    }

    // 配置管理
    const Config = {
        // 获取面板展开状态
        getPanelExpanded() {
            return GM_getValue('betCalculatorPanelExpanded', true); // 默认展开
        },
        // 设置面板展开状态
        setPanelExpanded(expanded) {
            GM_setValue('betCalculatorPanelExpanded', expanded);
        },
        // 获取保存的关键词（根据topicid）
        getKeywords(topicid) {
            if (!topicid) return '';
            return GM_getValue(`betCalculatorKeywords_${topicid}`, '');
        },
        // 保存关键词（根据topicid）
        setKeywords(keywords, topicid) {
            if (!topicid) return;
            GM_setValue(`betCalculatorKeywords_${topicid}`, keywords);
        },
        // 获取保存的赔率（根据topicid）
        getOdds(topicid) {
            if (!topicid) return '';
            return GM_getValue(`betCalculatorOdds_${topicid}`, '');
        },
        // 保存赔率（根据topicid）
        setOdds(odds, topicid) {
            if (!topicid) return;
            GM_setValue(`betCalculatorOdds_${topicid}`, odds);
        },
        // 获取保存的高亮颜色（全局，所有帖子共用）
        getHighlightColor() {
            return GM_getValue('betCalculatorHighlightColor', '');
        },
        // 保存高亮颜色（全局，所有帖子共用）
        setHighlightColor(color) {
            GM_setValue('betCalculatorHighlightColor', color);
        }
    };

    // 辅助函数：设置元素样式
    function setStyles(element, styles) {
        for (const key in styles) {
            element.style[key] = styles[key];
        }
    }

    // ========== UI组件创建函数 ==========
    
    // 创建通用按钮
    function createButton(config) {
        const btn = document.createElement('button');
        if (config.id) btn.id = config.id;
        if (config.text) btn.textContent = config.text;
        if (config.innerHTML) btn.innerHTML = config.innerHTML;
        if (config.title) btn.title = config.title;
        if (config.type) btn.type = config.type;
        if (config.className) btn.className = config.className;
        
        // 手机端：按钮样式放大2倍
        const styles = config.styles || {};
        if (isMobile() && !config.skipMobileScale) {  // 收缩按钮跳过，因为它已经单独处理了
            const scaledStyles = {};
            for (const [key, value] of Object.entries(styles)) {
                if (typeof value === 'string' && value.match(/^\d+px$/)) {
                    const numValue = parseInt(value);
                    scaledStyles[key] = (numValue * 2) + 'px';
                } else if (typeof value === 'number' && (key.includes('fontSize') || key.includes('padding') || key.includes('margin') || key.includes('width') || key.includes('height'))) {
                    scaledStyles[key] = value * 2;
                } else {
                    scaledStyles[key] = value;
                }
            }
            setStyles(btn, scaledStyles);
        } else {
            setStyles(btn, styles);
        }
        
        if (config.onClick) btn.addEventListener('click', config.onClick);
        if (config.onMouseEnter) {
            btn.addEventListener('mouseenter', config.onMouseEnter);
        }
        if (config.onMouseLeave) {
            btn.addEventListener('mouseleave', config.onMouseLeave);
        }
        if (config.onKeyPress) {
            btn.addEventListener('keypress', config.onKeyPress);
        }
        
        return btn;
    }

    // 创建输入框
    function createInput(config) {
        const input = document.createElement('input');
        input.type = config.type || 'text';
        if (config.id) input.id = config.id;
        if (config.placeholder) input.placeholder = config.placeholder;
        if (config.value !== undefined) input.value = config.value;
        
        const defaultStyles = {
            width: '100%',
            padding: '5px',
            marginBottom: '10px',
            boxSizing: 'border-box',
            border: '1px solid #ccc',
            borderRadius: '3px',
            fontSize: '13px'
        };
        
        // 手机端：输入框样式放大2倍
        let finalStyles = Object.assign({}, defaultStyles, config.styles || {});
        if (isMobile()) {
            const scaledStyles = {};
            for (const [key, value] of Object.entries(finalStyles)) {
                if (typeof value === 'string' && value.match(/^\d+px$/)) {
                    const numValue = parseInt(value);
                    scaledStyles[key] = (numValue * 2) + 'px';
                } else if (typeof value === 'number' && (key.includes('fontSize') || key.includes('padding') || key.includes('margin') || key.includes('borderRadius'))) {
                    scaledStyles[key] = value * 2;
                } else {
                    scaledStyles[key] = value;
                }
            }
            finalStyles = scaledStyles;
        }
        
        setStyles(input, finalStyles);
        
        if (config.onKeyPress) {
            input.addEventListener('keypress', config.onKeyPress);
        }
        
        return input;
    }

    // 创建标签
    function createLabel(text, styles) {
        const label = document.createElement('label');
        label.textContent = text;
        const defaultStyles = {
            display: 'block',
            marginBottom: '5px',
            fontWeight: 'bold',
            fontSize: '13px'
        };
        
        // 手机端：标签样式放大2倍
        let finalStyles = Object.assign({}, defaultStyles, styles || {});
        if (isMobile()) {
            const scaledStyles = {};
            for (const [key, value] of Object.entries(finalStyles)) {
                if (typeof value === 'string' && value.match(/^\d+px$/)) {
                    const numValue = parseInt(value);
                    scaledStyles[key] = (numValue * 2) + 'px';
                } else if (typeof value === 'number' && (key.includes('fontSize') || key.includes('padding') || key.includes('margin'))) {
                    scaledStyles[key] = value * 2;
                } else {
                    scaledStyles[key] = value;
                }
            }
            finalStyles = scaledStyles;
        }
        
        setStyles(label, finalStyles);
        return label;
    }

    // 创建区域标题
    function createSectionTitle(text, color) {
        const title = document.createElement('div');
        title.textContent = text;
        
        const titleStyles = {
            fontSize: '16px',
            fontWeight: 'bold',
            marginBottom: '12px',
            marginTop: '8px',
            color: color,
            padding: '6px 0',
            borderBottom: `2px solid ${color}`
        };
        
        // 手机端：区域标题放大2倍
        if (isMobile()) {
            titleStyles.fontSize = '32px';  // 16px * 2
            titleStyles.marginBottom = '24px';  // 12px * 2
            titleStyles.marginTop = '16px';  // 8px * 2
            titleStyles.padding = '12px 0';  // 6px * 2
            titleStyles.borderBottom = `4px solid ${color}`;  // 2px * 2
        }
        
        setStyles(title, titleStyles);
        return title;
    }

    // 创建分隔线
    function createDivider(styles) {
        const divider = document.createElement('div');
        const defaultStyles = {
            height: '1px',
            backgroundColor: '#ddd',
            margin: '15px 0',
            width: '100%'
        };
        
        // 手机端：分隔线放大2倍
        let finalStyles = Object.assign({}, defaultStyles, styles || {});
        if (isMobile()) {
            finalStyles.height = '2px';  // 1px * 2
            finalStyles.margin = '30px 0';  // 15px * 2
        }
        
        setStyles(divider, finalStyles);
        return divider;
    }

    // 创建或获取iframe
    function createOrGetIframe(id, name) {
        let iframe = document.getElementById(id);
        if (!iframe) {
            iframe = document.createElement('iframe');
            iframe.id = id;
            iframe.name = name;
            setStyles(iframe, {
                position: 'absolute',
                width: '0',
                height: '0',
                border: 'none',
                display: 'none'
            });
            document.body.appendChild(iframe);
        }
        return iframe;
    }

    // ========== UI创建函数 ==========
    
    // 创建进度条组件
    function createProgressBar() {
        const progressContainer = document.createElement('div');
        progressContainer.id = 'bet-progress-container';
        const containerStyles = {
            marginTop: '12px',
            marginBottom: '10px',
            display: 'none'
        };
        
        // 手机端：进度条容器放大2倍
        if (isMobile()) {
            containerStyles.marginTop = '24px';  // 12px * 2
            containerStyles.marginBottom = '20px';  // 10px * 2
        }
        
        setStyles(progressContainer, containerStyles);

        const progressText = document.createElement('div');
        progressText.id = 'bet-progress-text';
        progressText.textContent = '进度: 0/0';
        const textStyles = {
            fontSize: '12px',
            color: '#666',
            marginBottom: '5px',
            textAlign: 'center'
        };
        
        // 手机端：进度文本放大2倍
        if (isMobile()) {
            textStyles.fontSize = '24px';  // 12px * 2
            textStyles.marginBottom = '10px';  // 5px * 2
        }
        
        setStyles(progressText, textStyles);
        progressContainer.appendChild(progressText);

        const progressBarBg = document.createElement('div');
        progressBarBg.id = 'bet-progress-bar-bg';
        const bgStyles = {
            width: '100%',
            height: '20px',
            backgroundColor: '#e0e0e0',
            borderRadius: '10px',
            overflow: 'hidden',
            position: 'relative'
        };
        
        // 手机端：进度条背景放大2倍
        if (isMobile()) {
            bgStyles.height = '40px';  // 20px * 2
            bgStyles.borderRadius = '20px';  // 10px * 2
        }
        
        setStyles(progressBarBg, bgStyles);

        const progressBarFill = document.createElement('div');
        progressBarFill.id = 'bet-progress-bar-fill';
        const fillStyles = {
            height: '100%',
            width: '0%',
            backgroundColor: '#4CAF50',
            transition: 'width 0.3s ease',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            fontSize: '11px',
            fontWeight: 'bold'
        };
        
        // 手机端：进度条填充放大2倍
        if (isMobile()) {
            fillStyles.fontSize = '22px';  // 11px * 2
        }
        
        setStyles(progressBarFill, fillStyles);
        progressBarBg.appendChild(progressBarFill);
        progressContainer.appendChild(progressBarBg);

        return progressContainer;
    }

    // 创建结算管理区域
    function createSettlementSection(panel) {
        panel.appendChild(createSectionTitle('结算管理', '#FF9800'));

        // 输入框（关键词）
        panel.appendChild(createLabel('输入关键词（用空格分隔）：'));
        const topicid = getTopicId();
        const savedKeywords = Config.getKeywords(topicid);
        const input = createInput({
            id: 'bet-keywords',
            placeholder: '例如：走水 拜 斯 门 奥 勒 小 大',
            value: savedKeywords || '',
            onKeyPress: function(e) {
                if (e.which === 13 || e.keyCode === 13) {
                    calculateBets();
                }
            }
        });
        panel.appendChild(input);

        // 赔率输入框
        const oddsLabel = createLabel('赔率：', { marginTop: '10px' });
        panel.appendChild(oddsLabel);
        const savedOdds = Config.getOdds(topicid);
        const oddsInput = createInput({
            id: 'bet-odds',
            placeholder: '例如：0.9 或 1.5',
            value: savedOdds || '0.9',
            onKeyPress: function(e) {
                if (e.which === 13 || e.keyCode === 13) {
                    calculateBets();
                }
            }
        });
        panel.appendChild(oddsInput);

        // 检查违规下注按钮
        const checkViolationBtn = createButton({
            id: 'bet-check-violation-btn',
            text: '检查违规下注',
            styles: {
                width: '100%',
                padding: '8px',
                background: '#ff9800',
                color: 'white',
                border: 'none',
                borderRadius: '3px',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: 'bold',
                transition: 'background 0.3s',
                marginBottom: '10px'
            },
            onMouseEnter: function() {
                this.style.background = '#f57c00';
            },
            onMouseLeave: function() {
                this.style.background = '#ff9800';
            },
            onClick: checkViolationBets
        });
        panel.appendChild(checkViolationBtn);

        // 计算按钮
        const calcBtn = createButton({
            id: 'bet-calculate-btn',
            text: '计算',
            styles: {
                width: '100%',
                padding: '8px',
                background: '#4CAF50',
                color: 'white',
                border: 'none',
                borderRadius: '3px',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: 'bold',
                transition: 'background 0.3s',
                marginBottom: '10px'
            },
            onMouseEnter: function() {
                this.style.background = '#45a049';
            },
            onMouseLeave: function() {
                this.style.background = '#4CAF50';
            },
            onClick: calculateBets
        });
        panel.appendChild(calcBtn);

        // 进度条
        panel.appendChild(createProgressBar());

        // 一键全部结算按钮
        const batchSettleBtn = createButton({
            id: 'bet-batch-settle-btn',
            text: '一键全部结算',
            styles: {
                width: '100%',
                padding: '8px',
                background: '#2196F3',
                color: 'white',
                border: 'none',
                borderRadius: '3px',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: 'bold',
                transition: 'background 0.3s',
                marginBottom: '10px'
            },
            onMouseEnter: function() {
                this.style.background = '#1976D2';
            },
            onMouseLeave: function() {
                this.style.background = '#2196F3';
            },
            onClick: batchSettleAll
        });
        panel.appendChild(batchSettleBtn);
    }

    // 创建输入框和计算按钮的UI
    function createCalculatorUI() {
        // 检查是否已经存在UI，避免重复创建
        if (document.getElementById('bet-calculator-container')) {
            return;
        }

        // 创建容器，包含折叠按钮和面板
        const container = document.createElement('div');
        container.id = 'bet-calculator-container';
        setStyles(container, {
            position: 'fixed',
            top: '10px',
            right: '10px',
            display: 'flex',
            alignItems: 'flex-start',
            zIndex: '10000'
        });

        // 创建折叠按钮
        const toggleBtn = document.createElement('button');
        toggleBtn.id = 'bet-panel-toggle-btn';
        toggleBtn.innerHTML = '◀';
        toggleBtn.title = '收起面板';
        
        // 基础样式
        const toggleBtnStyles = {
            background: '#e0e0e0',
            color: '#666',
            border: 'none',
            borderRadius: '4px 0 0 4px',
            width: '24px',
            height: '40px',
            cursor: 'pointer',
            fontSize: '14px',
            transition: 'background 0.3s',
            marginRight: '-2px',
            zIndex: '1'
        };
        
        // 手机端：收缩按钮放大5倍
        if (isMobile()) {
            toggleBtnStyles.width = '120px';  // 24px * 5
            toggleBtnStyles.height = '200px';  // 40px * 5
            toggleBtnStyles.fontSize = '70px';  // 14px * 5
            toggleBtnStyles.borderRadius = '20px 0 0 20px';  // 4px * 5
            toggleBtnStyles.marginRight = '-10px';  // -2px * 5
        }
        
        setStyles(toggleBtn, toggleBtnStyles);
        toggleBtn.addEventListener('mouseenter', function() {
            this.style.background = '#d0d0d0';
        });
        toggleBtn.addEventListener('mouseleave', function() {
            this.style.background = '#e0e0e0';
        });
        toggleBtn.addEventListener('click', togglePanel);

        const panel = document.createElement('div');
        panel.id = 'bet-calculator-ui';
        
        // 基础样式
        const panelStyles = {
            background: '#fff',
            border: '1px solid #ddd',
            borderRadius: '0 8px 8px 0',
            padding: '15px',
            boxShadow: '0 4px 8px rgba(0,0,0,0.2)',
            width: '300px',
            fontFamily: 'Arial, sans-serif',
            transition: 'all 0.3s ease'
        };
        
        // 手机端：所有UI放大2倍
        if (isMobile()) {
            panelStyles.width = '600px';  // 300px * 2
            panelStyles.padding = '30px';  // 15px * 2
            panelStyles.borderRadius = '0 16px 16px 0';  // 8px * 2
            panelStyles.boxShadow = '0 8px 16px rgba(0,0,0,0.2)';  // 4px * 2, 8px * 2
        }
        
        setStyles(panel, panelStyles);

        // 面板标题
        const title = document.createElement('div');
        title.textContent = '体育沙龙管理面板';
        const titleStyles = {
            fontSize: '16px',
            fontWeight: 'bold',
            marginBottom: '12px',
            color: '#333',
            textAlign: 'center',
            borderBottom: '1px solid #ddd',
            paddingBottom: '8px'
        };
        
        // 手机端：标题放大2倍
        if (isMobile()) {
            titleStyles.fontSize = '32px';  // 16px * 2
            titleStyles.marginBottom = '24px';  // 12px * 2
            titleStyles.paddingBottom = '16px';  // 8px * 2
        }
        
        setStyles(title, titleStyles);
        panel.appendChild(title);

        // 创建结算管理区域
        createSettlementSection(panel);

        // 分隔线
        panel.appendChild(createDivider());

        // 主题管理区域标题
        panel.appendChild(createSectionTitle('主题管理', '#2196F3'));

        // 主题管理按钮容器
        const manageButtonsContainer = document.createElement('div');
        manageButtonsContainer.id = 'bet-manage-buttons-container';
        const containerStyles = {
            display: 'flex',
            flexDirection: 'column',
            gap: '8px'
        };
        
        // 手机端：按钮容器间距放大2倍
        if (isMobile()) {
            containerStyles.gap = '16px';  // 8px * 2
        }
        
        setStyles(manageButtonsContainer, containerStyles);
        panel.appendChild(manageButtonsContainer);

        // 创建主题管理按钮
        createManageButtons(manageButtonsContainer);

        // 分隔线
        panel.appendChild(createDivider());


        // 组装容器
        container.appendChild(toggleBtn);
        container.appendChild(panel);
        document.body.appendChild(container);

        // 应用保存的面板状态
        const isPanelExpanded = Config.getPanelExpanded();
        if (!isPanelExpanded) {
            panel.style.display = 'none';
            toggleBtn.innerHTML = '▶';
            toggleBtn.title = '展开面板';
            toggleBtn.style.borderRadius = '4px';
        }
    }

    // 切换面板显示/隐藏
    function togglePanel() {
        const panel = document.getElementById('bet-calculator-ui');
        const toggleBtn = document.getElementById('bet-panel-toggle-btn');
        
        if (panel.style.display === 'none') {
            // 展开面板
            panel.style.display = 'block';
            toggleBtn.innerHTML = '◀';
            toggleBtn.title = '收起面板';
            toggleBtn.style.borderRadius = '4px 0 0 4px';
            Config.setPanelExpanded(true);
        } else {
            // 收起面板
            panel.style.display = 'none';
            toggleBtn.innerHTML = '▶';
            toggleBtn.title = '展开面板';
            toggleBtn.style.borderRadius = '4px';
            Config.setPanelExpanded(false);
        }
    }

    // 解析下注信息
    function parseBetPost(postBody) {
        const betInfo = {
            bets: [],  // 下注球队（动态数量，最多20个）
            points: 0  // 下注点数
        };

        // 将HTML内容按行分割（处理<br>和换行符）
        const lines = postBody.split(/<br\s*\/?>|\\n|\n/i);
        
        // 逐行处理，查找包含"下注球隊"的行
        const allMatches = [];
        for (let i = 0; i < lines.length; i++) {
            const line = lines[i];
            if (line.includes('下注球隊')) {
                // 去除HTML标签和HTML实体
                let textContent = line.replace(/<[^>]+>/g, '');
                textContent = textContent.replace(/&nbsp;/g, ' ');
                textContent = textContent.replace(/&[a-z]+;/gi, ' ');
                
                // 提取数字（场次号）（支持数字后可能有空格的情况）
                const numberMatch = textContent.match(/(\d+)\.\s*下注球隊/);
                if (numberMatch) {
                    const index = parseInt(numberMatch[1], 10);
                    if (index >= 1) {
                        // 去除"数字.下注球隊"部分（支持数字后可能有空格的情况）
                        let teamName = textContent.replace(/\d+\.\s*下注球隊[：:]\s*/i, '');
                        // 去除所有 [] 内的标记（如 [1]、[1.0]、[0.9] 等）
                        teamName = teamName.replace(/\[[^\]]*\]/g, '');
                        // 去除所有符号、空格、换行等，只保留中文、英文、数字
                        teamName = teamName.replace(/[^\u4e00-\u9fa5a-zA-Z0-9]/g, '');
                        
                        // 如果去除后依然包含中文或英文字符，则记录；否则视为无效
                        const hasValidChars = /[\u4e00-\u9fa5a-zA-Z]/.test(teamName);
                        allMatches.push({
                            index: index,
                            content: hasValidChars ? teamName : ''
                        });
                    }
                }
            }
        }
        
        // 按场次号排序并填充
        if (allMatches.length > 0) {
            // 按场次号排序
            allMatches.sort((a, b) => a.index - b.index);
            const maxIndex = allMatches[allMatches.length - 1].index;
            
            // 填充所有场次（1到最大场次号）
            for (let i = 1; i <= maxIndex; i++) {
                const match = allMatches.find(m => m.index === i);
                if (match) {
                    // 直接使用 match.content（可能是空字符串）
                    betInfo.bets.push(match.content);
                } else {
                    // 如果没有匹配到，说明这个场次不存在，填充空字符串
                    betInfo.bets.push('');
                }
            }
        }

        // 提取下注点数（改进的正则，支持更多格式）
        // 先尝试标准格式：下注点数：100000
        let pointsMatch = postBody.match(/下注点数[：:]\s*(\d+)/i);
        
        // 如果失败，尝试更宽松的格式（可能中间有HTML标签、换行等）
        if (!pointsMatch) {
            // 移除HTML标签后再匹配
            const textContent = postBody.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ');
            pointsMatch = textContent.match(/下注点数[：:]\s*(\d+)/i);
        }
        
        // 如果还是失败，尝试匹配"下注点数"后面任意位置的数字
        if (!pointsMatch) {
            const textContent = postBody.replace(/<[^>]+>/g, ' ');
            const pointsIndex = textContent.indexOf('下注点数');
            if (pointsIndex !== -1) {
                const afterPoints = textContent.substring(pointsIndex + 4);
                const numberMatch = afterPoints.match(/(\d+)/);
                if (numberMatch) {
                    pointsMatch = numberMatch;
                }
            }
        }
        
        if (pointsMatch && pointsMatch[1]) {
            betInfo.points = parseInt(pointsMatch[1], 10);
        }

        return betInfo;
    }

    // 获取对应帖子的魔力值（支持负数）
    function getBonusValueForPost(postBody) {
        if (!postBody) {
            return null;
        }

        const row = postBody.closest('tr');
        if (!row) {
            return null;
        }

        const userInfoCell = row.querySelector('td.rowfollow');
        if (!userInfoCell) {
            return null;
        }

        const text = userInfoCell.textContent || '';
        // 匹配正数和负数（包含负号）
        const match = text.match(/魔力值[:：]\s*(-?[\d.,]+)/);
        if (!match || !match[1]) {
            return null;
        }

        const numericValue = parseFloat(match[1].replace(/,/g, ''));
        if (isNaN(numericValue)) {
            return null;
        }

        return {
            value: numericValue,
            raw: match[1]
        };
    }

    // 检查单场下注是否胜利（根据对应的关键词）
    function checkSingleBetWin(betText, keyword) {
        if (!betText || betText.trim() === '') {
            return false;
        }
        
        if (!keyword || keyword.trim() === '') {
            return false;
        }

        const trimmedKeyword = keyword.trim();
        
        // 如果关键词是"走水"，不计算
        if (trimmedKeyword === '走水') {
            return false;
        }

        // 检查下注文本是否包含关键词
        return betText.includes(trimmedKeyword);
    }

    // 计算所有下注
    function calculateBets() {
        const keywordsInput = document.getElementById('bet-keywords');
        if (!keywordsInput) return;
        
        const keywordsInputValue = keywordsInput.value.trim();
        if (!keywordsInputValue) {
            alert('请输入关键词！');
            return;
        }

        // 保存关键词（根据topicid）
        const topicid = getTopicId();
        Config.setKeywords(keywordsInputValue, topicid);

        // 获取赔率
        const oddsInput = document.getElementById('bet-odds');
        let odds = 0.9;  // 默认赔率为0.9
        if (oddsInput && oddsInput.value.trim()) {
            const oddsValue = parseFloat(oddsInput.value.trim());
            if (!isNaN(oddsValue) && oddsValue > 0) {
                odds = oddsValue;
            }
        }

        // 保存赔率（根据topicid）
        Config.setOdds(oddsInput ? oddsInput.value.trim() : '', topicid);

        // 解析关键词（用空格分隔）
        const keywords = keywordsInputValue.split(/\s+/).filter(k => k.trim() !== '');

        if (keywords.length === 0) {
            alert('请输入有效的关键词！');
            return;
        }

        // 使用 parseAllPosts 获取解析后的数据，避免重复解析（不打印到控制台）
        const postsData = parseAllPosts(false);

        // 获取截止时间（用于检查违规）
        let deadline = getDeadlineFromTitle();
        if (deadline) {
            // 给截止时间加5分钟（宽限时间）
            deadline = new Date(deadline.getTime() + 5 * 60 * 1000);
        }

        // 先清除之前的结果标记
        const oldBadges = document.querySelectorAll('.bet-result-badge');
        oldBadges.forEach(badge => badge.remove());
        
        // 清除之前的警告信息
        const oldWarnings = document.querySelectorAll('.bet-skip-warning');
        oldWarnings.forEach(warning => warning.remove());

        let bestBonusAssigned = false;
        const skippedPosts = []; // 记录被跳过的帖子

        postsData.forEach(function(postData) {
            // 如果没有下注点数，跳过（但记录日志以便调试）
            if (postData.betNum === 0) {
                const skipInfo = {
                    floorNumber: postData.floorNumber || '未知',
                    author: postData.author || '未知用户',
                    replyId: postData.replyId,
                    reason: '下注点数为0（可能解析失败）'
                };
                skippedPosts.push(skipInfo);
                console.warn(`⚠️ 跳过帖子（下注点数为0）: 楼层${skipInfo.floorNumber} - ${skipInfo.author} (ID: ${skipInfo.replyId})`);
                // 输出帖子内容的前100个字符以便调试
                if (postData.postBody && postData.postBody.textContent) {
                    const preview = postData.postBody.textContent.substring(0, 100).replace(/\s+/g, ' ');
                    console.warn(`  帖子内容预览: ${preview}...`);
                }
                // 在页面上显示警告
                showSkipWarning(postData.postBody, skipInfo);
                return;
            }

            // 检查是否违规，如果违规则跳过结算
            if (isPostViolated(postData, postsData, deadline)) {
                console.log(`跳过违规下注的结算 - 楼层: ${postData.floorNumber || postData.replyId}, 用户: ${postData.author}`);
                return;
            }

            // 获取下注球队的数量（动态）
            const betCount = postData.bets ? postData.bets.length : 0;
            
            // 确保关键词数量与下注数量匹配（如果不够，用空字符串补齐）
            const matchKeywords = [];
            for (let i = 0; i < betCount; i++) {
                if (i < keywords.length) {
                    matchKeywords.push(keywords[i]);
                } else {
                    matchKeywords.push('');
                }
            }

            let winCountForPost = 0;  // 该回帖胜利的场次数
            let loseCountForPost = 0;  // 该回帖失败的场次数
            let pushCountForPost = 0;  // 该回帖走水的场次数
            let validBetCount = 0;  // 有效的下注场次数（非走水且非空）
            const winBets = [];  // 胜利的下注
            const loseBets = [];  // 失败的下注
            const pushBets = [];  // 走水的下注

            // 检查所有下注，每个下注对应一个关键词
            for (let i = 0; i < betCount; i++) {
                const betText = postData.bets[i];
                const keyword = matchKeywords[i];
                
                // 如果下注为空或只包含空白字符，跳过（不计算）
                // betText 在提取时已经去除了所有空白字符，所以直接检查是否为空即可
                // 使用更严格的检查：确保是字符串且长度大于0
                if (typeof betText !== 'string' || betText.length === 0) {
                    continue;
                }

                // 如果关键词是"走水"，不计算
                if (keyword && keyword.trim() === '走水') {
                    pushCountForPost++;
                    pushBets.push(`第${i + 1}场: ${betText}`);
                    continue;
                }

                // 如果关键词为空，跳过（不计算）
                if (!keyword || keyword.trim() === '') {
                    continue;
                }

                // 记录有效下注（有下注内容且关键词不为空且不是走水）
                validBetCount++;

                // 检查是否胜利
                if (checkSingleBetWin(betText, keyword)) {
                    winCountForPost++;
                    winBets.push(`第${i + 1}场: ${betText} (关键词: ${keyword})`);
                } else {
                    // 只有真正有下注内容且关键词匹配失败才算失败
                    loseCountForPost++;
                    loseBets.push(`第${i + 1}场: ${betText}`);
                }
            }

            // 计算净收益：胜场乘以赔率，输场不减赔率
            // 公式：胜场数 * 下注点数 * 赔率 - 输场数 * 下注点数
            const netProfit = Math.round((winCountForPost * postData.betNum * odds) - (loseCountForPost * postData.betNum));

            // 判断该回帖的结果类型（用于显示样式）
            let postResult = {
                type: 'lose',
                points: postData.betNum,
                netProfit: netProfit,  // 净收益
                winBets: winBets,
                loseBets: loseBets,
                pushBets: pushBets,  // 走水的下注
                winCount: winCountForPost,
                loseCount: loseCountForPost,
                pushCount: pushCountForPost,
                totalCount: validBetCount,
                exceedMagic: Boolean(postData.bonus !== null && postData.betNum > postData.bonus),
                bestBonus: 0
            };

            if (pushCountForPost > 0 && validBetCount === 0) {
                // 全部走水
                postResult.type = 'push';
            } else if (netProfit > 0) {
                // 净收益为正（赢了）
                postResult.type = 'win';
            } else if (netProfit < 0) {
                // 净收益为负（输了）
                postResult.type = 'lose';
            } else {
                // 净收益为0（平局，但不算走水）
                postResult.type = 'lose';
            }

            // 检查全场最佳奖金条件：第一个全对的回帖且满足下注点数与盘口限制
            const isAllWin = postResult.type === 'win' &&
                postResult.winCount > 0 &&
                postResult.loseCount === 0 &&
                postResult.pushCount === 0 &&
                postResult.winCount === postResult.totalCount;
            const hasEnoughPoints = postData.betNum >= 100000;
            const hasEnoughMarkets = postResult.totalCount >= 4;

            if (!bestBonusAssigned && isAllWin && hasEnoughPoints && hasEnoughMarkets) {
                const bonusAmount = 500000;
                postResult.bestBonus = bonusAmount;
                postResult.netProfit += bonusAmount;
                bestBonusAssigned = true;
            }

            // 在该回帖上显示结果
            displayPostResult(postData.postBody, postResult);
        });
        
        // 如果有被跳过的帖子，显示汇总信息
        if (skippedPosts.length > 0) {
            console.warn(`⚠️ 共跳过 ${skippedPosts.length} 个帖子（下注点数为0）`);
            // 在面板中显示警告
            showSkippedPostsSummary(skippedPosts);
        }

        // 自动打开所有评分框
        openAllRatingForms();
    }
    
    // 在帖子下方显示跳过警告
    function showSkipWarning(postBody, skipInfo) {
        if (!postBody || !postBody.parentNode) return;
        
        const warningDiv = document.createElement('div');
        warningDiv.className = 'bet-skip-warning';
        setStyles(warningDiv, {
            display: 'inline-block',
            backgroundColor: '#fff3cd',
            border: '2px solid #ffc107',
            padding: '8px',
            marginTop: '8px',
            borderRadius: '4px',
            fontSize: isMobile() ? '24px' : '12px',
            color: '#856404',
            fontWeight: 'bold'
        });
        warningDiv.innerHTML = `⚠️ 跳过计算：${skipInfo.reason}<br>楼层${skipInfo.floorNumber} - ${skipInfo.author}`;
        
        postBody.parentNode.insertBefore(warningDiv, postBody.nextSibling);
    }
    
    // 在面板中显示被跳过帖子的汇总
    function showSkippedPostsSummary(skippedPosts) {
        const panel = document.getElementById('bet-calculator-ui');
        if (!panel) return;
        
        // 查找是否已存在汇总信息
        let summaryDiv = document.getElementById('bet-skipped-summary');
        if (summaryDiv) {
            summaryDiv.remove();
        }
        
        summaryDiv = document.createElement('div');
        summaryDiv.id = 'bet-skipped-summary';
        setStyles(summaryDiv, {
            backgroundColor: '#fff3cd',
            border: '2px solid #ffc107',
            padding: isMobile() ? '20px' : '10px',
            marginTop: isMobile() ? '20px' : '10px',
            borderRadius: '4px',
            fontSize: isMobile() ? '24px' : '12px',
            color: '#856404'
        });
        
        let summaryHTML = `<strong>⚠️ 警告：有 ${skippedPosts.length} 个帖子被跳过（下注点数为0）</strong><br>`;
        skippedPosts.forEach((skip, index) => {
            if (index < 5) { // 只显示前5个
                summaryHTML += `楼层${skip.floorNumber} - ${skip.author}<br>`;
            }
        });
        if (skippedPosts.length > 5) {
            summaryHTML += `...还有 ${skippedPosts.length - 5} 个帖子被跳过`;
        }
        summaryHTML += '<br><small>请检查这些帖子的"下注点数"格式是否正确</small>';
        
        summaryDiv.innerHTML = summaryHTML;
        
        // 插入到面板底部
        panel.appendChild(summaryDiv);
    }

    // 打开所有评分表单
    function openAllRatingForms() {
        // 查找所有评分表单容器（id以"admark"开头）
        const ratingForms = document.querySelectorAll('div[id^="admark"]');
        ratingForms.forEach(function(formDiv) {
            // 将display设置为inline（与admark函数的行为一致）
            formDiv.style.display = 'inline';
        });
    }

    // 更新进度条
    function updateProgress(current, total) {
        const progressContainer = document.getElementById('bet-progress-container');
        const progressText = document.getElementById('bet-progress-text');
        const progressBarFill = document.getElementById('bet-progress-bar-fill');
        
        if (!progressContainer || !progressText || !progressBarFill) {
            return;
        }

        if (total === 0) {
            progressContainer.style.display = 'none';
            return;
        }

        // 显示进度条
        progressContainer.style.display = 'block';
        
        // 更新文本
        progressText.textContent = `进度: ${current}/${total}`;
        
        // 计算百分比
        const percentage = Math.round((current / total) * 100);
        progressBarFill.style.width = percentage + '%';
        progressBarFill.textContent = percentage + '%';
    }

    // 隐藏进度条
    function hideProgress() {
        const progressContainer = document.getElementById('bet-progress-container');
        if (progressContainer) {
            progressContainer.style.display = 'none';
        }
    }

    // 创建主题管理按钮
    function createManageButtons(container) {
        // 检测当前状态
        const stickyForm = document.querySelector('form[action*="setsticky"]');
        const lockedForm = document.querySelector('form[action*="setlocked"]');
        const highlightForm = document.querySelector('form[action*="hltopic"]');

        // 检测置顶状态
        let isSticky = false;
        if (stickyForm) {
            const stickyInput = stickyForm.querySelector('input[name="sticky"]');
            if (stickyInput) {
                // 如果值为"no"，说明当前是置顶状态（按钮显示"取消置顶"）
                isSticky = stickyInput.value === 'no';
            }
        }

        // 检测锁定状态
        let isLocked = false;
        if (lockedForm) {
            const lockedInput = lockedForm.querySelector('input[name="locked"]');
            if (lockedInput) {
                // 如果值为"no"，说明当前是锁定状态（按钮显示"解除主题锁定"）
                isLocked = lockedInput.value === 'no';
            }
        }

        // 检测高亮状态
        let isHighlighted = false;
        if (highlightForm) {
            const colorSelect = highlightForm.querySelector('select[name="color"]');
            if (colorSelect) {
                // 如果值不是"0"，说明有高亮
                isHighlighted = colorSelect.value !== '0';
            }
        }

        // 创建置顶按钮
        const stickyBtn = createButton({
            id: 'bet-sticky-btn',
            text: isSticky ? '解除置顶' : '置顶',
            styles: {
                width: '100%',
                padding: '8px',
                background: isSticky ? '#FF5722' : '#4CAF50',
                color: 'white',
                border: 'none',
                borderRadius: '3px',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: 'bold',
                transition: 'background 0.3s'
            },
            onMouseEnter: function() {
                this.style.background = isSticky ? '#E64A19' : '#45a049';
            },
            onMouseLeave: function() {
                this.style.background = isSticky ? '#FF5722' : '#4CAF50';
            },
            onClick: function() {
                toggleSticky(stickyBtn, stickyForm);
            }
        });
        stickyBtn.dataset.isSticky = isSticky;
        stickyBtn.dataset.formAction = stickyForm ? 'setsticky' : '';
        container.appendChild(stickyBtn);

        // 创建锁定按钮
        const lockedBtn = createButton({
            id: 'bet-locked-btn',
            text: isLocked ? '解除锁定' : '锁定',
            styles: {
                width: '100%',
                padding: '8px',
                background: isLocked ? '#FF5722' : '#4CAF50',
                color: 'white',
                border: 'none',
                borderRadius: '3px',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: 'bold',
                transition: 'background 0.3s'
            },
            onMouseEnter: function() {
                this.style.background = isLocked ? '#E64A19' : '#45a049';
            },
            onMouseLeave: function() {
                this.style.background = isLocked ? '#FF5722' : '#4CAF50';
            },
            onClick: function() {
                toggleLocked(lockedBtn, lockedForm);
            }
        });
        lockedBtn.dataset.isLocked = isLocked;
        lockedBtn.dataset.formAction = lockedForm ? 'setlocked' : '';
        container.appendChild(lockedBtn);

        // 创建高亮区域（包含颜色选择和按钮）
        const highlightContainer = document.createElement('div');
        setStyles(highlightContainer, {
            display: 'flex',
            gap: '8px',
            alignItems: 'center'
        });

        // 高亮颜色选择下拉框
        const highlightSelect = document.createElement('select');
        highlightSelect.id = 'bet-highlight-color-select';
        setStyles(highlightSelect, {
            flex: '1',
            padding: '6px',
            border: '1px solid #ccc',
            borderRadius: '3px',
            fontSize: '13px'
        });

        // 添加颜色选项（与HTML中的选项一致）
        const colorOptions = [
            { value: '0', text: '无', color: 'transparent' },
            { value: '1', text: 'Black', color: 'black' },
            { value: '2', text: 'Sienna', color: 'sienna' },
            { value: '3', text: 'Dark Olive Green', color: 'darkolivegreen' },
            { value: '4', text: 'Dark Green', color: 'darkgreen' },
            { value: '5', text: 'Dark Slate Blue', color: 'darkslateblue' },
            { value: '6', text: 'Navy', color: 'navy' },
            { value: '7', text: 'Indigo', color: 'indigo' },
            { value: '8', text: 'Dark Slate Gray', color: 'darkslategray' },
            { value: '9', text: 'Dark Red', color: 'darkred' },
            { value: '10', text: 'Dark Orange', color: 'darkorange' },
            { value: '11', text: 'Olive', color: 'olive' },
            { value: '12', text: 'Green', color: 'green' },
            { value: '13', text: 'Teal', color: 'teal' },
            { value: '14', text: 'Blue', color: 'blue' },
            { value: '15', text: 'Slate Gray', color: 'slategray' },
            { value: '16', text: 'Dim Gray', color: 'dimgray' },
            { value: '17', text: 'Red', color: 'red' },
            { value: '18', text: 'Sandy Brown', color: 'sandybrown' },
            { value: '19', text: 'Yellow Green', color: 'yellowgreen' },
            { value: '20', text: 'Sea Green', color: 'seagreen' },
            { value: '21', text: 'Medium Turquoise', color: 'mediumturquoise' },
            { value: '22', text: 'Royal Blue', color: 'royalblue' },
            { value: '23', text: 'Purple', color: 'purple' },
            { value: '24', text: 'Gray', color: 'gray' },
            { value: '25', text: 'Magenta', color: 'magenta' },
            { value: '26', text: 'Orange', color: 'orange' },
            { value: '27', text: 'Yellow', color: 'yellow' },
            { value: '28', text: 'Lime', color: 'lime' },
            { value: '29', text: 'Cyan', color: 'cyan' },
            { value: '30', text: 'Deep Sky Blue', color: 'deepskyblue' },
            { value: '31', text: 'Dark Orchid', color: 'darkorchid' },
            { value: '32', text: 'Silver', color: 'silver' },
            { value: '33', text: 'Pink', color: 'pink' },
            { value: '34', text: 'Wheat', color: 'wheat' },
            { value: '35', text: 'Lemon Chiffon', color: 'lemonchiffon' },
            { value: '36', text: 'Pale Green', color: 'palegreen' },
            { value: '37', text: 'Pale Turquoise', color: 'paleturquoise' },
            { value: '38', text: 'Light Blue', color: 'lightblue' },
            { value: '39', text: 'Plum', color: 'plum' },
            { value: '40', text: 'White', color: 'white' }
        ];

        colorOptions.forEach(function(option) {
            const optionElement = document.createElement('option');
            optionElement.value = option.value;
            optionElement.textContent = option.text;
            if (option.color !== 'transparent') {
                optionElement.style.backgroundColor = option.color;
            }
            highlightSelect.appendChild(optionElement);
        });

        // 设置当前选中的颜色（优先使用保存的颜色）
        let initialColorSet = false;
        const savedHighlightColor = Config.getHighlightColor();
        if (savedHighlightColor && colorOptions.some(opt => opt.value === savedHighlightColor)) {
            highlightSelect.value = savedHighlightColor;
            initialColorSet = true;
        }
        if (!initialColorSet && highlightForm) {
            const colorSelect = highlightForm.querySelector('select[name="color"]');
            if (colorSelect) {
                highlightSelect.value = colorSelect.value;
                initialColorSet = true;
            }
        }

        highlightContainer.appendChild(highlightSelect);

        // 高亮应用按钮
        const highlightBtn = createButton({
            id: 'bet-highlight-btn',
            text: isHighlighted ? '解除高亮' : '应用高亮',
            styles: {
                padding: '8px 12px',
                background: isHighlighted ? '#FF5722' : '#4CAF50',
                color: 'white',
                border: 'none',
                borderRadius: '3px',
                cursor: 'pointer',
                fontSize: '13px',
                fontWeight: 'bold',
                transition: 'background 0.3s',
                whiteSpace: 'nowrap'
            },
            onMouseEnter: function() {
                this.style.background = isHighlighted ? '#E64A19' : '#45a049';
            },
            onMouseLeave: function() {
                this.style.background = isHighlighted ? '#FF5722' : '#4CAF50';
            },
            onClick: function() {
                applyHighlight(highlightBtn, highlightForm, highlightSelect);
            }
        });
        highlightBtn.dataset.isHighlighted = isHighlighted;
        highlightBtn.dataset.formAction = highlightForm ? 'hltopic' : '';
        highlightContainer.appendChild(highlightBtn);

        container.appendChild(highlightContainer);

        // 解除高亮置顶按钮（快速操作）
        const removeHighlightBtn = createButton({
            id: 'bet-remove-highlight-btn',
            text: '解除高亮置顶',
            styles: {
                width: '100%',
                padding: '8px',
                background: '#FF9800',
                color: 'white',
                border: 'none',
                borderRadius: '3px',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: 'bold',
                transition: 'background 0.3s',
                marginTop: '8px'
            },
            onMouseEnter: function() {
                this.style.background = '#F57C00';
            },
            onMouseLeave: function() {
                this.style.background = '#FF9800';
            },
            onClick: removeHighlightAndSticky
        });
        container.appendChild(removeHighlightBtn);
    }

    // 切换置顶状态
    function toggleSticky(btn, form) {
        if (!form) {
            alert('未找到置顶表单');
            return;
        }

        const isSticky = btn.dataset.isSticky === 'true';
        const stickyInput = form.querySelector('input[name="sticky"]');
        if (!stickyInput) {
            alert('未找到置顶输入框');
            return;
        }

        // 置顶提交"yes"，取消置顶提交"no"
        const newValue = isSticky ? 'no' : 'yes';
        stickyInput.value = newValue;
        
        console.log(`置顶操作: 当前状态=${isSticky ? '已置顶' : '未置顶'}, 设置值=${newValue} (目标: ${isSticky ? '取消置顶' : '置顶'})`);
        
        // 使用与removeHighlightAndSticky相同的逻辑
        const submitIframe = createOrGetIframe('manage-form-iframe', 'manage-form-iframe');

        const originalTarget = form.target;
        form.target = 'manage-form-iframe';

        console.log(`开始执行: ${isSticky ? '取消置顶' : '置顶'}`);
        form.submit();

        // 由于会重定向，直接使用固定延迟
        setTimeout(function() {
            console.log(`${isSticky ? '取消置顶' : '置顶'}已提交`);
            // 刷新页面以更新状态
            window.location.reload();
        }, 500);
    }

    // 切换锁定状态
    function toggleLocked(btn, form) {
        if (!form) {
            alert('未找到锁定表单');
            return;
        }

        const isLocked = btn.dataset.isLocked === 'true';
        const lockedInput = form.querySelector('input[name="locked"]');
        if (!lockedInput) {
            alert('未找到锁定输入框');
            return;
        }

        // 解除锁定提交"no"，锁定提交"yes"
        const newValue = isLocked ? 'no' : 'yes';
        lockedInput.value = newValue;
        
        console.log(`锁定操作: 当前状态=${isLocked ? '已锁定' : '未锁定'}, 设置值=${newValue} (目标: ${isLocked ? '解除锁定' : '锁定'})`);
        
        // 使用与removeHighlightAndSticky相同的逻辑
        const submitIframe = createOrGetIframe('manage-form-iframe', 'manage-form-iframe');

        const originalTarget = form.target;
        form.target = 'manage-form-iframe';

        console.log(`开始执行: ${isLocked ? '解除锁定' : '锁定'}`);
        form.submit();

        // 由于会重定向，直接使用固定延迟
        setTimeout(function() {
            console.log(`${isLocked ? '解除锁定' : '锁定'}已提交`);
            // 刷新页面以更新状态
            window.location.reload();
        }, 500);
    }

    // 应用高亮
    function applyHighlight(btn, form, colorSelect) {
        if (!form) {
            alert('未找到高亮表单');
            return;
        }

        const formColorSelect = form.querySelector('select[name="color"]');
        if (!formColorSelect) {
            alert('未找到高亮颜色选择框');
            return;
        }

        // 获取选中的颜色值
        const selectedColor = colorSelect.value;
        
        // 设置表单中的颜色值
        formColorSelect.value = selectedColor;

        // 保存最近使用的颜色（全局，所有帖子共用）
        Config.setHighlightColor(selectedColor);
        
        // 提交表单
        submitFormInIframe(form, function() {
            // 刷新页面以更新状态
            setTimeout(function() {
                window.location.reload();
            }, 500);
        });
    }

    // 在iframe中提交表单的通用函数
    function submitFormInIframe(form, callback) {
        // 创建隐藏的iframe用于提交表单
        const submitIframe = createOrGetIframe('manage-form-iframe', 'manage-form-iframe');

        const originalTarget = form.target;
        form.target = 'manage-form-iframe';

        // 调试：输出表单数据
        const formData = new FormData(form);
        console.log('提交表单:', form.action);
        for (let [key, value] of formData.entries()) {
            console.log(`  ${key}: ${value}`);
        }

        form.submit();

        // 使用固定延迟（因为会重定向）
        setTimeout(function() {
            if (callback) {
                callback();
            }
        }, 500);
    }

    // 解除高亮置顶（保留原有功能，但可以移除）
    function removeHighlightAndSticky() {
        if (!confirm('确定要解除高亮和置顶吗？')) {
            return;
        }

        // 创建隐藏的iframe用于提交表单（避免页面刷新）
        const submitIframe = createOrGetIframe('remove-highlight-iframe', 'remove-highlight-iframe');

        // 查找"取消置顶"表单
        const stickyForm = document.querySelector('form[action*="setsticky"]');
        // 查找"高亮显示主题"表单
        const highlightForm = document.querySelector('form[action*="hltopic"]');

        if (!stickyForm && !highlightForm) {
            alert('未找到相关表单，请确认当前页面是否有管理权限');
            return;
        }

        // 依次提交表单：取消置顶 -> 解除高亮
        let currentAction = 0;
        const actions = [];

        // 准备取消置顶操作
        if (stickyForm) {
            const stickyInput = stickyForm.querySelector('input[name="sticky"]');
            if (stickyInput) {
                stickyInput.value = 'no';
                actions.push({
                    form: stickyForm,
                    name: '取消置顶'
                });
            }
        }

        // 准备解除高亮操作
        if (highlightForm) {
            const colorSelect = highlightForm.querySelector('select[name="color"]');
            if (colorSelect) {
                colorSelect.value = '0';
                actions.push({
                    form: highlightForm,
                    name: '解除高亮'
                });
            }
        }

        // 依次执行操作
        function executeNextAction() {
            if (currentAction >= actions.length) {
                // 所有操作完成
                setTimeout(function() {
                    alert('解除高亮和置顶操作已完成！');
                    window.location.reload();
                }, 200);
                return;
            }

            const action = actions[currentAction];
            const form = action.form;
            const actionName = action.name;

            const originalTarget = form.target;
            form.target = 'remove-highlight-iframe';

            console.log(`开始执行: ${actionName}`);
            form.submit();

            // 由于会重定向，load事件可能不可靠，直接使用固定延迟
            // 操作都成功了，说明延迟时间足够
            setTimeout(function() {
                console.log(`${actionName}已提交`);
                currentAction++;
                // 等待150ms后执行下一个操作（加快处理速度）
                setTimeout(executeNextAction, 150);
            }, 300); // 0.3秒延迟，足够服务器处理请求
        }

        // 开始执行第一个操作
        if (actions.length > 0) {
            executeNextAction();
        } else {
            alert('未找到可执行的操作');
        }
    }

    // 检查帖子是否已结算
    function isPostSettled(pid) {
        // 查找对应的帖子body
        const postBody = document.getElementById(`pid${pid}body`);
        if (!postBody) {
            return false;
        }

        // 获取评分总和
        const ratingSum = RatingManager.getRatingSum(postBody);
        
        // 如果没有评分记录，说明未结算
        if (ratingSum === 0) {
            return false;
        }

        // 尝试从结果标记中获取计算结果（netProfit）
        const resultBadge = postBody.parentElement.querySelector('.bet-result-badge');
        if (resultBadge) {
            // 从结果标记中提取结算金额（计算结果 netProfit）
            const winLoseText = resultBadge.textContent || '';
            // 匹配 "结算: +100000" 或 "结算: -50000" 格式
            const match = winLoseText.match(/结算[：:]\s*([+-]?\d[\d,]*)/);
            if (match) {
                const expectedAmount = parseInt(match[1].replace(/,/g, ''), 10);
                // 判断：如果评分总和和计算结果一致，就是已结算
                return ratingSum === expectedAmount;
            }
        }

        // 如果找不到计算结果标记，使用原来的逻辑（检查是否有评分记录）
        const container = postBody.parentElement;
        if (!container) {
            return false;
        }
        const allDivs = container.querySelectorAll('div');
        for (let i = 0; i < allDivs.length; i++) {
            const div = allDivs[i];
            const text = div.textContent || '';
            if (text.includes('[评分]')) {
                const html = div.innerHTML || '';
                // 如果包含日期时间格式（如 2025-11-28）和评分理由，说明已有评分记录
                if (html.match(/\d{4}-\d{2}-\d{2}\s+\d{2}:\d{2}:\d{2}/) && html.includes('评分理由')) {
                    return true;
                }
            }
        }

        return false;
    }

    // 获取标题中的截止时间
    function getDeadlineFromTitle() {
        const topSpan = document.getElementById('top');
        if (!topSpan) return null;
        
        const titleText = topSpan.textContent;
        // 匹配格式：截止时间：2025-11-13 21:00 或 下注截止时间 2025-12-02 10:00:00
        // 支持两种格式：带秒和不带秒
        // "截止时间"后面可以是冒号（中文或英文）或直接是空格，然后匹配日期时间
        const deadlineMatch = titleText.match(/截止时间[：:\s]+\s*(\d{4}-\d{2}-\d{2}\s+\d{2}:\d{2}(?::\d{2})?)/);
        
        if (deadlineMatch && deadlineMatch[1]) {
            try {
                const deadlineStr = deadlineMatch[1];
                // 如果只有时:分，补上秒
                const deadlineStrWithSeconds = deadlineStr.includes(':') && deadlineStr.split(':').length === 2 
                    ? deadlineStr + ':00' 
                    : deadlineStr;
                // 解析截止时间（北京时间）
                const deadlineDate = new Date(deadlineStrWithSeconds.replace(' ', 'T') + '+08:00');
                if (!isNaN(deadlineDate.getTime())) {
                    return deadlineDate;
                }
            } catch (e) {
                console.error('解析截止时间失败:', e);
            }
        }
        
        return null;
    }

    // ========== 违规检查模块 ==========
    const ViolationChecker = {
        // 获取单个帖子的违规类型列表
        getPostViolations(post, allPosts, deadline) {
            const violationTypes = [];
            
            // 1. 检查下注点数超过魔力值且下注点数大于100000
            if (post.bonus !== null && post.betNum > post.bonus && post.betNum > 100000) {
                violationTypes.push('下注点数超过魔力值');
            }
            
            // 2. 检查重复下注（有两个及以上他的回复）
            if (post.author) {
                const userReplyCount = allPosts.filter(p => p.author === post.author).length;
                if (userReplyCount >= 2) {
                    violationTypes.push('重复下注');
                }
            }
            
            // 3. 检查下注时间超过标题的截止时间
            if (deadline && post.replyTime) {
                try {
                    const replyTimeStr = post.replyTime.replace(' ', 'T') + '+08:00';
                    const replyTimeDate = new Date(replyTimeStr);
                    if (!isNaN(replyTimeDate.getTime())) {
                        if (replyTimeDate > deadline) {
                            violationTypes.push('超过截止时间');
                        }
                    }
                } catch (e) {
                    // 解析失败，不标记为违规
                }
            }
            
            // 4. 检查是否私自编辑回帖
            if (post.isEdited) {
                violationTypes.push('私自编辑回帖');
            }
            
            return violationTypes;
        },

        // 检查单个帖子是否违规（返回布尔值）
        isPostViolated(post, allPosts, deadline) {
            const violations = this.getPostViolations(post, allPosts, deadline);
            return violations.length > 0;
        },

        // 检查违规下注
        checkViolationBets() {
            // 使用 parseAllPosts 获取解析后的数据
            const postsData = parseAllPosts(false);
            
            if (!postsData || postsData.length === 0) {
                alert('当前页面未找到下注内容，无法检查违规。');
                return;
            }

            // 获取截止时间
            let deadline = getDeadlineFromTitle();
            if (!deadline) {
                console.warn('未能从标题中提取截止时间，将跳过超时检查');
            } else {
                // 给截止时间加5分钟（宽限时间）
                deadline = new Date(deadline.getTime() + 5 * 60 * 1000);
                console.log('提取的截止时间（加5分钟宽限）:', deadline);
            }
            
            // 检查违规情况
            const violations = [];
            
            postsData.forEach(post => {
                const violationTypes = this.getPostViolations(post, postsData, deadline);
                
                if (violationTypes.length > 0) {
                    violations.push({
                        replyId: post.replyId,
                        floorNumber: post.floorNumber || 0,  // 楼层号
                        author: post.author || '未知',
                        betNum: post.betNum,
                        bonus: post.bonus,
                        violationTypes: violationTypes,
                        postBody: post.postBody
                    });
                }
            });

            // 显示违规检查结果
            this.openDialog(violations);
        }
    };

    // 检查违规下注（对外接口）
    function checkViolationBets() {
        ViolationChecker.checkViolationBets();
    }

    // 检查单个帖子是否违规（对外接口）
    function isPostViolated(post, allPosts, deadline) {
        return ViolationChecker.isPostViolated(post, allPosts, deadline);
    }

    // 打开违规检查弹窗（违规检查模块的方法）
    ViolationChecker.openDialog = function(violations) {
        // 移除旧的弹窗（如果存在）
        const existing = document.getElementById('violation-check-dialog');
        if (existing) {
            existing.remove();
        }

        const overlay = document.createElement('div');
        overlay.id = 'violation-check-dialog';
        overlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.5);
            z-index: 10003;
            display: flex;
            justify-content: center;
            align-items: center;
        `;

        const dialog = document.createElement('div');
        dialog.style.cssText = `
            background: white;
            border-radius: 10px;
            padding: 20px;
            width: 800px;
            max-width: 95vw;
            max-height: 90vh;
            overflow-y: auto;
            box-shadow: 0 4px 20px rgba(0,0,0,0.3);
        `;

        const header = document.createElement('div');
        header.style.cssText = `
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 15px;
            padding-bottom: 10px;
            border-bottom: 2px solid #2196F3;
            background: transparent;
        `;

        const title = document.createElement('h2');
        title.textContent = '违规下注检查';
        title.style.cssText = `
            margin: 0;
            padding: 0;
            color: #2196F3;
            font-size: 20px;
            background: transparent;
            border: none;
            outline: none;
        `;
        header.appendChild(title);

        const closeBtn = document.createElement('button');
        closeBtn.textContent = '✕';
        closeBtn.style.cssText = `
            background: #f44336;
            color: white;
            border: none;
            border-radius: 50%;
            width: 30px;
            height: 30px;
            cursor: pointer;
            font-size: 18px;
            font-weight: bold;
            transition: background 0.3s;
        `;
        closeBtn.onmouseover = () => closeBtn.style.background = '#d32f2f';
        closeBtn.onmouseout = () => closeBtn.style.background = '#f44336';
        closeBtn.onclick = () => overlay.remove();
        header.appendChild(closeBtn);

        const tableWrapper = document.createElement('div');
        tableWrapper.style.cssText = `
            border: 1px solid #ddd;
            border-radius: 8px;
            padding: 10px;
            background: #fafafa;
            max-height: 70vh;
            overflow: auto;
        `;

        // 渲染表格
        this.renderTable(violations, tableWrapper);

        dialog.appendChild(header);
        dialog.appendChild(tableWrapper);
        overlay.appendChild(dialog);
        document.body.appendChild(overlay);

        overlay.addEventListener('click', event => {
            if (event.target === overlay) {
                overlay.remove();
            }
        });
    }

    // 渲染违规检查表格（违规检查模块的方法）
    ViolationChecker.renderTable = function(violations, container) {
        container.innerHTML = '';

        if (violations.length === 0) {
            const empty = document.createElement('div');
            empty.style.cssText = `
                padding: 40px 20px;
                text-align: center;
                color: #999;
                font-size: 14px;
            `;
            empty.textContent = '未发现违规下注。';
            container.appendChild(empty);
            return;
        }

        const table = document.createElement('table');
        table.style.cssText = `
            width: 100%;
            border-collapse: separate;
            border-spacing: 0;
            font-size: 13px;
            background: #fff;
            border-radius: 8px;
            overflow: hidden;
        `;

        const thead = document.createElement('thead');
        const headerRow = document.createElement('tr');
        headerRow.style.background = '#f5f5f5';

        const headers = ['楼层', '用户名', '违规类型'];
        headers.forEach(headerText => {
            const th = document.createElement('th');
            th.textContent = headerText;
            th.style.cssText = 'border: 1px solid #ddd; padding: 8px;';
            if (headerText === '楼层') {
                th.style.width = '60px';
            } else if (headerText === '用户名') {
                th.style.width = '120px';
            } else if (headerText === '违规类型') {
                // 违规类型列不设置固定宽度，让它自适应
            }
            headerRow.appendChild(th);
        });

        thead.appendChild(headerRow);
        table.appendChild(thead);

        const tbody = document.createElement('tbody');

        violations.forEach(violation => {
            const tr = document.createElement('tr');
            tr.style.background = '#fff';

            // 跳转到楼层的函数
            const jumpToFloor = () => {
                const target = document.getElementById(`pid${violation.replyId}`);
                if (target) {
                    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    target.style.boxShadow = '0 0 12px rgba(33,150,243,0.7)';
                    setTimeout(() => target.style.boxShadow = '', 2000);
                } else {
                    window.location.href = `#pid${violation.replyId}`;
                }
                const overlay = document.getElementById('violation-check-dialog');
                if (overlay) {
                    overlay.remove();
                }
            };

            // 楼层
            const replyIdTd = document.createElement('td');
            replyIdTd.style.cssText = 'border: 1px solid #ddd; padding: 8px; text-align: center;';
            const anchorLink = document.createElement('a');
            // 如果楼层号为0，使用replyId作为备选显示
            const floorDisplay = violation.floorNumber > 0 ? `${violation.floorNumber}楼` : `#${violation.replyId}`;
            anchorLink.textContent = floorDisplay;
            anchorLink.style.cssText = 'color: #2196F3; text-decoration: none; cursor: pointer;';
            anchorLink.title = '点击跳转到该楼层';
            anchorLink.onclick = jumpToFloor;
            replyIdTd.appendChild(anchorLink);
            tr.appendChild(replyIdTd);

            // 用户名
            const authorTd = document.createElement('td');
            authorTd.style.cssText = 'border: 1px solid #ddd; padding: 8px; font-weight: bold;';
            const authorLink = document.createElement('a');
            authorLink.textContent = violation.author;
            authorLink.style.cssText = 'color: #2196F3; text-decoration: none; cursor: pointer;';
            authorLink.title = '点击跳转到该楼层';
            authorLink.onclick = jumpToFloor;
            authorLink.onmouseover = () => authorLink.style.textDecoration = 'underline';
            authorLink.onmouseout = () => authorLink.style.textDecoration = 'none';
            authorTd.appendChild(authorLink);
            tr.appendChild(authorTd);

            // 理由（详细描述违规情况）
            const reasonTd = document.createElement('td');
            reasonTd.style.cssText = 'border: 1px solid #ddd; padding: 8px; color: #f44336; font-weight: bold; max-width: 600px; word-wrap: break-word;';
            
            // 构建详细的违规理由描述
            const reasonParts = [];
            violation.violationTypes.forEach(violationType => {
                if (violationType === '下注点数超过魔力值') {
                    reasonParts.push(`下注点数(${violation.betNum.toLocaleString()})超过魔力值(${violation.bonus !== null ? violation.bonus.toLocaleString() : '未知'})，且下注点数大于100000`);
                } else if (violationType === '重复下注') {
                    reasonParts.push('该用户有多个回复，属于重复下注');
                } else if (violationType === '超过截止时间') {
                    reasonParts.push('下注时间超过标题中规定的截止时间');
                } else if (violationType === '私自编辑回帖') {
                    reasonParts.push('该回帖被编辑过，属于私自编辑回帖');
                } else {
                    reasonParts.push(violationType);
                }
            });
            
            reasonTd.textContent = reasonParts.join('；');
            tr.appendChild(reasonTd);

            tbody.appendChild(tr);
        });

        table.appendChild(tbody);
        container.appendChild(table);
    };

    // 一键全部结算（使用计算结果直接创建表单提交）
    function batchSettleAll() {
        // 检查是否有计算结果
        if (calculationResults.size === 0) {
            alert('请先点击"计算"按钮进行计算！');
            return;
        }

        let settledCount = 0;
        const toSettleForms = []; // 需要结算的表单列表
        const results = [];
        const forumid = getForumId();

        // 遍历所有计算结果
        calculationResults.forEach(function(calcData, pid) {
            const { postBody, result } = calcData;
            
            // 检查是否已结算
            if (isPostSettled(pid)) {
                settledCount++;
                const logMsg = `帖子 #${pid}: 已结算`;
                console.log(logMsg);
                results.push(logMsg);
            } else {
                // 获取评分总和（用于调整）
                const ratingSum = RatingManager.getRatingSum(postBody);
                
                // 计算最终结算金额
                let finalAmount = result.netProfit;
                if (ratingSum !== 0 && ratingSum !== result.netProfit) {
                    // 如果已有评分，需要调整：最终结算 = 计算结果 - 已有评分总和
                    finalAmount = result.netProfit - ratingSum;
                }

                // 如果走水或金额为0，跳过
                if (finalAmount === 0) {
                    const logMsg = `帖子 #${pid}: 结算金额为0，跳过`;
                    console.log(logMsg);
                    results.push(logMsg);
                    return;
                }

                const markType = finalAmount > 0 ? '增加' : '扣减';
                const markAmount = Math.abs(finalAmount);
                const logMsg = `帖子 #${pid}: 准备结算 - ${markType} ${markAmount.toLocaleString()} 分`;
                console.log(logMsg);
                results.push(logMsg);

                // 添加到待结算列表
                toSettleForms.push({
                    pid: pid,
                    forumid: forumid,
                    markdes: finalAmount > 0 ? 'add' : 'sub',
                    totalAmount: markAmount,
                    reason: '' // 可以根据需要设置原因
                });
            }
        });

        // 输出汇总日志
        console.log('=== 一键全部结算汇总 ===');
        console.log(`总计: ${calculationResults.size} 个帖子`);
        console.log(`已结算: ${settledCount} 个`);
        console.log(`待结算: ${toSettleForms.length} 个`);
        console.log('详细结果:');
        results.forEach(function(msg) {
            console.log('  ' + msg);
        });
        console.log('======================');

        if (toSettleForms.length === 0) {
            alert(`所有帖子已结算！\n总计: ${calculationResults.size} 个\n已结算: ${settledCount} 个`);
            return;
        }

        // 确认是否继续
        if (!confirm(`准备结算 ${toSettleForms.length} 个帖子，将自动分批提交（每次最多500000）。\n\n确认继续？`)) {
            return;
        }

        // 初始化进度条（总帖子数包括已结算和待结算）
        const totalForms = calculationResults.size;
        updateProgress(settledCount, totalForms);

        // 依次处理每个表单的自动分批提交
        processBatchSettleForms(toSettleForms, 0, totalForms, settledCount);
    }

    // 创建并提交评分表单（不依赖页面元素）
    function createAndSubmitRatingForm(formData, submitIframe) {
        const form = document.createElement('form');
        form.method = 'post';
        form.action = 'forumpostrate.php';
        form.target = submitIframe.name;
        form.style.display = 'none';

        // 添加表单字段
        const fields = {
            'markdes': formData.markdes,  // 'add' 或 'sub'
            'mark': formData.mark,        // 分数
            'reason': formData.reason || '',  // 原因
            'admintype': 'mark',
            'forumid': formData.forumid,
            'pid': formData.pid
        };

        for (const [name, value] of Object.entries(fields)) {
            const input = document.createElement('input');
            input.type = 'hidden';
            input.name = name;
            input.value = value;
            form.appendChild(input);
        }

        document.body.appendChild(form);
        form.submit();
        
        // 提交后移除表单
        setTimeout(() => {
            if (form.parentNode) {
                form.parentNode.removeChild(form);
            }
        }, 1000);
    }

    // 通用的批次提交函数（支持直接创建表单）
    function submitBatchesInSequence(formData, batches, submitIframe, options) {
        options = options || {};
        const onComplete = options.onComplete || function() {};
        const onProgress = options.onProgress || function() {};
        const onTimeout = options.onTimeout || function() {};
        const onBeforeSubmit = options.onBeforeSubmit || function() {};
        
        let batchIndex = 0;
        
        function submitNextBatch() {
            if (batchIndex >= batches.length) {
                onComplete();
                return;
            }

            const batchAmount = batches[batchIndex];
            
            // 调用进度回调
            onProgress(batchIndex, batchAmount);
            
            // 调用提交前回调
            onBeforeSubmit(batchIndex, batchAmount);

            // 准备表单数据
            const submitFormData = {
                markdes: formData.markdes,
                mark: batchAmount,
                reason: formData.reason || '',
                admintype: 'mark',
                forumid: formData.forumid,
                pid: formData.pid
            };

            // 监听iframe加载完成
            let loadTimeout;
            const iframeLoadHandler = function() {
                if (loadTimeout) {
                    clearTimeout(loadTimeout);
                }
                submitIframe.removeEventListener('load', iframeLoadHandler);
                batchIndex++;
                // 等待100ms后提交下一批（加快处理速度）
                setTimeout(submitNextBatch, 100);
            };
            submitIframe.addEventListener('load', iframeLoadHandler);

            // 设置超时处理（如果500ms内没有响应，继续下一批）
            loadTimeout = setTimeout(function() {
                submitIframe.removeEventListener('load', iframeLoadHandler);
                onTimeout(batchIndex);
                batchIndex++;
                // 等待100ms后提交下一批
                setTimeout(submitNextBatch, 100);
            }, 500);

            // 检查调试开关
            if (!ENABLE_BATCH_SUBMIT) {
                console.warn(`⚠️ 调试模式：批次提交已禁用，不会真正提交表单 (第 ${batchIndex + 1}/${batches.length} 批，金额: ${batchAmount.toLocaleString()})`);
                // 模拟提交：直接触发加载完成事件
                setTimeout(function() {
                    iframeLoadHandler();
                }, 100);
                return;
            }

            // 创建并提交表单
            createAndSubmitRatingForm(submitFormData, submitIframe);
        }

        // 开始提交第一批
        submitNextBatch();
    }

    // 依次处理批量结算表单（使用自动分批，直接创建表单提交）
    function processBatchSettleForms(forms, currentIndex, totalForms, initialSettledCount) {
        if (currentIndex >= forms.length) {
            // 所有表单处理完成
            console.log('=== 所有结算完成 ===');
            updateProgress(totalForms, totalForms);
            setTimeout(function() {
                hideProgress();
                alert(`所有结算已完成！共处理 ${forms.length} 个帖子。\n请刷新页面查看结果。`);
            }, 500);
            return;
        }

        // 更新进度条（已结算数量 + 当前处理的索引）
        const currentSettled = initialSettledCount + currentIndex;
        updateProgress(currentSettled, totalForms);

        const formData = forms[currentIndex];
        const { pid, forumid, markdes, totalAmount, reason } = formData;

        const markType = markdes === 'add' ? '增加' : '扣减';
        console.log(`开始处理帖子 #${pid}: ${markType} ${totalAmount.toLocaleString()} 分`);

        // 计算分批（支持增加和扣减）
        const maxPerBatch = 500000;
        const batches = [];
        let remaining = totalAmount;

        while (remaining > 0) {
            const batchAmount = Math.min(remaining, maxPerBatch);
            batches.push(batchAmount);
            remaining -= batchAmount;
        }

        console.log(`帖子 #${pid}: 将分 ${batches.length} 次提交：${batches.map(b => b.toLocaleString()).join(', ')}`);

        // 创建隐藏的iframe用于提交表单（避免页面刷新）
        const submitIframe = createOrGetIframe('batch-rating-iframe', 'batch-rating-iframe');

        // 准备表单数据
        const submitFormData = {
            pid: pid,
            forumid: forumid,
            markdes: markdes,
            reason: reason || ''
        };

        // 完成后的回调函数
        const onComplete = function() {
            console.log(`帖子 #${pid}: 所有批次提交完成`);
            // 等待100ms后处理下一个表单（加快处理速度）
            setTimeout(function() {
                processBatchSettleForms(forms, currentIndex + 1, totalForms, initialSettledCount);
            }, 100);
        };

        // 使用通用的批次提交函数（直接创建表单）
        submitBatchesInSequence(submitFormData, batches, submitIframe, {
            onComplete: onComplete,
            onProgress: function(batchIndex, batchAmount) {
                console.log(`帖子 #${pid}: 提交第 ${batchIndex + 1}/${batches.length} 批，金额: ${batchAmount.toLocaleString()}`);
            },
            onTimeout: function(batchIndex) {
                console.log(`帖子 #${pid}: 第 ${batchIndex}/${batches.length} 批提交超时，继续下一批`);
            }
        });
    }

    // 存储计算结果（用于一键结算）
    const calculationResults = new Map();

    // 在单个回帖上显示结果
    function displayPostResult(postBody, result) {
        // 存储计算结果
        const postIdMatch = postBody.id.match(/^pid(\d+)body$/);
        if (postIdMatch) {
            const pid = postIdMatch[1];
            calculationResults.set(pid, {
                postBody: postBody,
                result: result
            });
        }
        // 构建结果显示文本
        let statusText = '';
        let bgColor = '';
        let borderColor = '';
        let winLoseText = '';  // 赢/输金额文本
        
        if (result.type === 'win') {
            statusText = '✓ 胜利';
            bgColor = '#e8f5e9';  // 浅绿色背景
            borderColor = '#4CAF50';  // 绿色边框
            winLoseText = `结算: +${result.netProfit}`;
        } else if (result.type === 'push') {
            statusText = '○ 走水';
            bgColor = '#fff3e0';  // 浅橙色背景
            borderColor = '#ff9800';  // 橙色边框
            winLoseText = '走水（不计算）';
        } else {
            statusText = '✗ 失败';
            bgColor = '#ffebee';  // 浅红色背景
            borderColor = '#f44336';  // 红色边框
            winLoseText = `结算: ${result.netProfit}`;
        }

        // 构建详细信息
        let detailText = '';
        if (result.type === 'push' && result.totalCount === 0) {
            detailText = '走水（不计算）';
        } else if (result.totalCount > 0 || result.pushCount > 0) {
            // 显示输赢场次统计
            const parts = [];
            if (result.winCount > 0) {
                parts.push(`+${result.winCount}`);
            }
            if (result.loseCount > 0) {
                parts.push(`-${result.loseCount}`);
            }
            
            // 收集所有场次（胜利、失败、走水），并记录场次号和状态
            const allBetDetails = [];
            
            // 胜利的场次
            if (result.winBets.length > 0) {
                result.winBets.forEach(bet => {
                    const match = bet.match(/第(\d+)场:/);
                    if (match) {
                        allBetDetails.push({
                            index: parseInt(match[1], 10),
                            text: `第${match[1]}场`,
                            type: 'win'
                        });
                    }
                });
            }
            
            // 失败的场次
            if (result.loseBets.length > 0) {
                result.loseBets.forEach(bet => {
                    const match = bet.match(/第(\d+)场:/);
                    if (match) {
                        allBetDetails.push({
                            index: parseInt(match[1], 10),
                            text: `第${match[1]}场`,
                            type: 'lose'
                        });
                    }
                });
            }
            
            // 走水的场次
            if (result.pushBets && result.pushBets.length > 0) {
                result.pushBets.forEach(bet => {
                    const match = bet.match(/第(\d+)场:/);
                    if (match) {
                        allBetDetails.push({
                            index: parseInt(match[1], 10),
                            text: `第${match[1]}场`,
                            type: 'push'
                        });
                    }
                });
            }
            
            // 按场次号排序
            allBetDetails.sort((a, b) => a.index - b.index);
            
            // 根据类型添加颜色标签
            const allDetails = allBetDetails.map(detail => {
                if (detail.type === 'lose') {
                    return `<span style="color: #f44336;">${detail.text}</span>`;
                } else if (detail.type === 'push') {
                    return `<span style="color: #999;">${detail.text}</span>`;
                } else {
                    return detail.text;
                }
            });
            
            // 将所有场次放在一个括号里
            if (allDetails.length > 0) {
                if (parts.length > 0) {
                    detailText = `${parts.join(' ')} (${allDetails.join('、')})`;
                } else {
                    detailText = `(${allDetails.join('、')})`;
                }
            } else if (parts.length > 0) {
                detailText = parts.join(' ');
            }
        } else {
            detailText = '无有效下注';
        }

        // 创建结果显示框
        const resultDiv = document.createElement('div');
        resultDiv.className = 'bet-result-badge';
        setStyles(resultDiv, {
            display: 'inline-block',
            backgroundColor: bgColor,
            border: `1px solid ${borderColor}`,
            padding: '8px',
            marginTop: '8px'
        });
        const bonusLine = result.bestBonus > 0
            ? `<span style="display:inline-block;margin-top:4px;color:#fb8c00;font-weight:bold;">全场最佳: +${result.bestBonus}</span><br>`
            : '';

        resultDiv.innerHTML = `
            <strong>[${statusText}]</strong><br>
            ${detailText}<br>
            ${bonusLine}
            ${winLoseText}
        `;

        if (result.exceedMagic && result.points > 100000) {
            const warningDiv = document.createElement('div');
            setStyles(warningDiv, {
                marginTop: '6px',
                color: '#d32f2f',
                fontWeight: 'bold'
            });
            warningDiv.textContent = '下注点数大于魔力值';
            resultDiv.appendChild(warningDiv);
        }

        // 插入到回帖内容下方
        postBody.parentNode.insertBefore(resultDiv, postBody.nextSibling);

        // 自动将结算分数填入评分表单
        const fillResult = RatingManager.autoFillRatingForm(postBody, result.netProfit);
        
        // 如果有调整，显示调整提示
        if (fillResult && fillResult.adjustment !== 0) {
            const adjustmentLine = document.createElement('div');
            setStyles(adjustmentLine, {
                marginTop: '6px',
                color: '#ff9800',
                fontWeight: 'bold',
                fontSize: '13px'
            });
            const netProfitPrefix = result.netProfit > 0 ? '+' : '';
            const ratingSumPrefix = fillResult.ratingSum > 0 ? '+' : '';
            const adjustedPrefix = fillResult.adjustedProfit > 0 ? '+' : '';
            adjustmentLine.textContent = `已调整: 计算结果 ${netProfitPrefix}${result.netProfit.toLocaleString()}，评分总和 ${ratingSumPrefix}${fillResult.ratingSum.toLocaleString()}，最终结算 ${adjustedPrefix}${fillResult.adjustedProfit.toLocaleString()}`;
            resultDiv.appendChild(adjustmentLine);
        }

        // 如果存在评分信息，追加评分总和
        RatingManager.appendRatingSummary(postBody);
    }

    // ========== 评分管理模块 ==========
    const RatingManager = {
        // 获取评分总和
        getRatingSum(postBody) {
            const container = postBody.parentElement;
            if (!container) return 0;

            // 查找包含"[评分]"的 div
            const ratingDiv = Array.from(container.querySelectorAll('div')).find(div => {
                const text = div.textContent || '';
                return text.includes('[评分]');
            });

            if (!ratingDiv) {
                return 0;
            }

            const html = ratingDiv.innerHTML || '';
            const lines = html.split(/<br\s*\/?>|\n/i);
            let sum = 0;
            let foundScore = false;

            lines.forEach(line => {
                const clean = line.replace(/<[^>]+>/g, '').trim();
                if (!clean || !clean.includes('评分理由')) {
                    return;
                }
                const match = clean.match(/\s([+-]\d[\d,]*)\s*评分理由/);
                if (match) {
                    const value = parseInt(match[1].trim().replace(/,/g, ''), 10);
                    if (!isNaN(value)) {
                        sum += value;
                        foundScore = true;
                    }
                }
            });

            return foundScore ? sum : 0;
        },

        // 自动将结算分数填入评分表单
        autoFillRatingForm(postBody, netProfit) {
            // 从postBody的id中提取pid（格式：pid451034body）
            const postIdMatch = postBody.id.match(/^pid(\d+)body$/);
            if (!postIdMatch) {
                return { adjustedProfit: netProfit, adjustment: 0, ratingSum: 0 }; // 无法提取pid，跳过
            }
            const pid = postIdMatch[1];

            // 查找对应的评分表单
            const ratingFormDiv = document.getElementById(`admark${pid}`);
            if (!ratingFormDiv) {
                return { adjustedProfit: netProfit, adjustment: 0, ratingSum: 0 }; // 找不到评分表单，跳过
            }

            const form = ratingFormDiv.querySelector('form');
            if (!form) {
                return { adjustedProfit: netProfit, adjustment: 0, ratingSum: 0 }; // 找不到表单，跳过
            }

            // 获取评分总和（在判断走水之前获取，以便返回正确的ratingSum）
            const ratingSum = this.getRatingSum(postBody);

            // 如果走水（netProfit为0），不自动填入
            if (netProfit === 0) {
                return { adjustedProfit: netProfit, adjustment: 0, ratingSum };
            }
            
            // 计算调整值：如果评分总和与计算结果不一致，需要加回来
            // 例如：计算结果100000，评分总和-50000，那么应该结算150000
            let adjustedProfit = netProfit;
            let adjustment = 0;
            
            if (ratingSum !== 0 && ratingSum !== netProfit) {
                // 计算差值并加回来
                adjustment = ratingSum;
                adjustedProfit = netProfit - ratingSum; // 减去已有的评分总和，得到应该结算的金额
            }

            // 找到分数输入框和选择框
            const markInput = form.querySelector('input[name="mark"]');
            const markdesSelect = form.querySelector('select[name="markdes"]');

            if (!markInput || !markdesSelect) {
                return { adjustedProfit: netProfit, adjustment: 0, ratingSum }; // 找不到输入框或选择框，跳过
            }

            // 设置分数（使用绝对值）
            markInput.value = Math.abs(adjustedProfit);

            // 根据正负自动选择增加/扣减
            if (adjustedProfit > 0) {
                markdesSelect.value = 'add';
            } else {
                markdesSelect.value = 'sub';
            }
            
            return { adjustedProfit, adjustment, ratingSum };
        },

        // 追加评分总和
        appendRatingSummary(postBody) {
            const container = postBody.parentElement;
            if (!container) return;

            // 查找包含"[评分]"的 div
            const ratingDiv = Array.from(container.querySelectorAll('div')).find(div => {
                const text = div.textContent || '';
                return text.includes('[评分]');
            });

            if (!ratingDiv) {
                return;
            }

            // 检查是否已经存在评分总和，如果存在则先移除
            const existingSummary = ratingDiv.querySelector('.rating-summary');
            if (existingSummary) {
                existingSummary.remove();
            }

            // 使用 getRatingSum 函数获取评分总和，避免重复代码
            const sum = this.getRatingSum(postBody);

            if (sum === 0) {
                return;
            }

            const prefix = sum > 0 ? '+' : '';
            const summaryDiv = document.createElement('div');
            summaryDiv.className = 'rating-summary';
            setStyles(summaryDiv, {
                marginTop: '6px',
                fontSize: '14px',
                fontWeight: 'bold'
            });
            summaryDiv.textContent = `评分总和：${prefix}${sum}`;

            ratingDiv.appendChild(summaryDiv);
        },

        // 初始化所有帖子的评分总和显示
        initAllRatingSummaries() {
            // 查找所有评分表单容器（id以"admark"开头）
            const ratingFormDivs = document.querySelectorAll('div[id^="admark"]');
            
            ratingFormDivs.forEach(function(formDiv) {
                // 从id中提取pid（格式：admark451034）
                const pidMatch = formDiv.id.match(/^admark(\d+)$/);
                if (!pidMatch) {
                    return;
                }
                const pid = pidMatch[1];
                
                // 查找对应的postBody
                const postBody = document.getElementById(`pid${pid}body`);
                if (!postBody) {
                    return;
                }
                
                // 检查是否已经存在评分总和，避免重复添加
                const container = postBody.parentElement;
                if (!container) return;
                
                const ratingDiv = Array.from(container.querySelectorAll('div')).find(div => {
                    const text = div.textContent || '';
                    return text.includes('[评分]');
                });
                
                if (ratingDiv && ratingDiv.querySelector('.rating-summary')) {
                    // 已经存在评分总和，跳过
                    return;
                }
                
                // 调用appendRatingSummary显示评分总和
                this.appendRatingSummary(postBody);
            }.bind(this));
        }
    };

    // 对外接口函数（保持向后兼容）
    function getRatingSum(postBody) {
        return RatingManager.getRatingSum(postBody);
    }

    function autoFillRatingForm(postBody, netProfit) {
        return RatingManager.autoFillRatingForm(postBody, netProfit);
    }

    function appendRatingSummary(postBody) {
        RatingManager.appendRatingSummary(postBody);
    }

    function initAllRatingSummaries() {
        RatingManager.initAllRatingSummaries();
    }

    // 为评分表单添加自动分批提交功能
    function addBatchRatingButtons() {
        // 查找所有评分表单
        const ratingForms = document.querySelectorAll('div[id^="admark"] form');
        
        ratingForms.forEach(form => {
            // 检查是否已经添加过按钮
            if (form.querySelector('.batch-rating-btn')) {
                return;
            }

            // 查找分数输入框
            const markInput = form.querySelector('input[name="mark"]');
            if (!markInput) {
                return;
            }

            // 创建自动分批按钮
            const batchBtn = createButton({
                type: 'button',
                className: 'batch-rating-btn',
                text: '自动分批',
                title: '自动分批提交（每次最多500000）',
                styles: {
                    marginLeft: '8px',
                    padding: '4px 12px',
                    backgroundColor: '#4CAF50',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    fontSize: '12px',
                    fontWeight: 'bold'
                },
                onMouseEnter: function() {
                    this.style.backgroundColor = '#45a049';
                },
                onMouseLeave: function() {
                    this.style.backgroundColor = '#4CAF50';
                },
                onClick: function() {
                    handleBatchRating(form, markInput);
                }
            });

            // 将按钮插入到原因文本框后面
            const reasonInput = form.querySelector('input[name="reason"]');
            if (reasonInput) {
                // 在原因输入框后面插入按钮
                reasonInput.parentNode.insertBefore(batchBtn, reasonInput.nextSibling);
                // 在按钮前添加空格
                const space = document.createTextNode(' ');
                reasonInput.parentNode.insertBefore(space, batchBtn);
            } else {
                // 备选方案：如果找不到原因输入框，插入到分数输入框后面
                markInput.parentNode.insertBefore(batchBtn, markInput.nextSibling);
            }
        });
    }

    // 处理自动分批提交
    function handleBatchRating(form, markInput) {
        const totalAmount = parseInt(markInput.value, 10);
        
        // 验证输入
        if (isNaN(totalAmount) || totalAmount <= 0) {
            alert('请输入有效的分数！');
            return;
        }

        // 检查是否选择了"增加"或"扣减"
        const markdesSelect = form.querySelector('select[name="markdes"]');
        if (!markdesSelect || (markdesSelect.value !== 'add' && markdesSelect.value !== 'sub')) {
            alert('请先选择"(＋) 增加"或"(－) 扣减"！');
            return;
        }

        // 获取原因（虽然获取了但未使用，保留以备将来使用）
        // const reasonInput = form.querySelector('input[name="reason"]');
        // const reason = reasonInput ? reasonInput.value : '';

        // 计算分批
        const maxPerBatch = 500000;
        const batches = [];
        let remaining = totalAmount;

        while (remaining > 0) {
            const batchAmount = Math.min(remaining, maxPerBatch);
            batches.push(batchAmount);
            remaining -= batchAmount;
        }

        // 确认分批信息
        const confirmMsg = `将分 ${batches.length} 次提交：\n${batches.map((b, i) => `第${i + 1}次: ${b.toLocaleString()}`).join('\n')}\n\n总计: ${totalAmount.toLocaleString()}\n\n确认提交？`;
        if (!confirm(confirmMsg)) {
            return;
        }

        // 禁用按钮，防止重复点击
        const batchBtn = form.querySelector('.batch-rating-btn');
        if (batchBtn) {
            batchBtn.disabled = true;
            batchBtn.textContent = `提交中 (0/${batches.length})`;
            setStyles(batchBtn, {
                backgroundColor: '#999',
                cursor: 'not-allowed'
            });
        }

        // 创建隐藏的iframe用于提交表单（避免页面刷新）
        const submitIframe = createOrGetIframe('batch-rating-iframe', 'batch-rating-iframe');

        // 设置表单的target为iframe
        const originalTarget = form.target;
        form.target = 'batch-rating-iframe';

        // 完成后的回调函数
        const onComplete = function() {
            form.target = originalTarget; // 恢复原始target
            if (batchBtn) {
                batchBtn.disabled = false;
                batchBtn.textContent = '自动分批';
                setStyles(batchBtn, {
                    backgroundColor: '#4CAF50',
                    cursor: 'pointer'
                });
            }
            alert(`所有批次提交完成！共 ${batches.length} 次，总计 ${totalAmount.toLocaleString()} 分。\n请刷新页面查看结果。`);
        };

        // 提交前的回调函数（更新按钮状态）
        const onBeforeSubmit = function(batchIndex, batchAmount) {
            if (batchBtn) {
                batchBtn.textContent = `提交中 (${batchIndex + 1}/${batches.length})`;
            }
        };

        // 使用通用的批次提交函数
        submitBatchesInSequence(form, markInput, batches, submitIframe, {
            onComplete: onComplete,
            onBeforeSubmit: onBeforeSubmit
        });
    }

    // 解析所有回帖信息并组织成字典格式
    function parseAllPosts(shouldLog = true) {
        const postsData = [];
        
        // 获取所有回帖
        const postBodies = document.querySelectorAll('div[id^="pid"][id$="body"]');
        
        postBodies.forEach(function(postBody) {
            // 提取楼层ID（从id中提取，格式：pid451034body）
            const postIdMatch = postBody.id.match(/^pid(\d+)body$/);
            if (!postIdMatch) {
                return;
            }
            const replyId = postIdMatch[1];
            
            // 提取用户名、楼层号和回复时间（从帖子标题行中提取）
            let author = '';
            let floorNumber = 0;  // 默认楼层号为0，如果解析失败
            let replyTime = '';  // 回复时间
            // 查找包含该pid的标题table（格式：id="pid453434"）
            const titleTable = document.getElementById(`pid${replyId}`);
            if (titleTable) {
                // 在标题table中查找用户链接
                const userLink = titleTable.querySelector('a[href*="userdetails.php?id"]');
                if (userLink) {
                    // 优先获取 <b> 标签内的文本
                    const boldTag = userLink.querySelector('b');
                    if (boldTag) {
                        // 如果<b>标签内有<span class="rainbow">，则从span中提取
                        const rainbowSpan = boldTag.querySelector('span.rainbow');
                        if (rainbowSpan) {
                            author = rainbowSpan.textContent.trim();
                        } else {
                            author = boldTag.textContent.trim();
                        }
                    } else {
                        // 如果没有<b>标签，直接使用链接的文本内容
                        author = userLink.textContent.trim();
                    }
                }
                
                // 提取楼层号：查找 <font class="big"><b>数字</b>楼</font>
                const floorFont = titleTable.querySelector('font.big');
                if (floorFont) {
                    const floorBold = floorFont.querySelector('b');
                    if (floorBold) {
                        const floorText = floorBold.textContent.trim();
                        const floorMatch = floorText.match(/^(\d+)$/);
                        if (floorMatch && floorMatch[1]) {
                            floorNumber = parseInt(floorMatch[1], 10);
                        }
                    }
                }
                
                // 提取回复时间：从标题table的文本中匹配时间格式 2025-11-30 19:39:06
                const titleText = titleTable.textContent || '';
                const timeMatch = titleText.match(/(\d{4}-\d{2}-\d{2}\s+\d{2}:\d{2}:\d{2})/);
                if (timeMatch && timeMatch[1]) {
                    replyTime = timeMatch[1].trim();
                }
            }
            
            // 第一层楼不参与数据统计，跳过
            if (floorNumber === 1) {
                return;
            }
            
            // 提取魔力值
            const bonusValueInfo = getBonusValueForPost(postBody);
            const bonus = bonusValueInfo ? bonusValueInfo.value : null;
            
            // 提取下注信息（保留原始格式，包含赔率标记）
            const postBodyHTML = postBody.innerHTML;
            const betInfo = parseBetPost(postBodyHTML);
            
            // 从原始HTML中提取所有包含"下注球隊"的行
            const lines = postBodyHTML.split(/<br\s*\/?>|\\n|\n/i);
            const betLines = [];
            for (let i = 0; i < lines.length; i++) {
                const line = lines[i];
                if (line.includes('下注球隊')) {
                    // 去除HTML标签，但保留原始格式（包括赔率标记）
                    let textContent = line.replace(/<[^>]+>/g, '');
                    textContent = textContent.replace(/&nbsp;/g, ' ');
                    textContent = textContent.replace(/&[a-z]+;/gi, ' ');
                    textContent = textContent.trim();
                    if (textContent) {
                        betLines.push(textContent);
                    }
                }
            }
            const betInfoText = betLines.join('\n');
            
            // 提取下注点数
            const betNum = betInfo.points || 0;
            
            // 检查是否被编辑过（查找"编辑于"文本）
            const isEdited = postBody.innerHTML.includes('编辑于') || postBody.textContent.includes('编辑于');
            
            // 组织成字典格式
            const postData = {
                replyId: replyId,
                floorNumber: floorNumber,  // 楼层号（从HTML中解析，如1楼、2楼等）
                author: author,
                replyTime: replyTime,  // 回复时间（从HTML中解析，格式：2025-11-30 19:39:06）
                bonus: bonus,
                betInfo: betInfoText,
                betNum: betNum,
                bets: betInfo.bets,  // 解析后的下注球队数组
                postBody: postBody,   // 保存postBody引用，用于后续计算
                isEdited: isEdited    // 是否被编辑过
            };
            
            postsData.push(postData);
        });
        
        // 打印到控制台（仅在需要时）
        if (shouldLog) {
            console.log('=== 所有回帖解析数据 ===');
            console.log(`找到 ${postBodies.length} 个帖子元素，成功解析 ${postsData.length} 个回帖`);
            
            // 检查是否有帖子被跳过
            if (postBodies.length !== postsData.length) {
                console.warn(`⚠️ 警告：有 ${postBodies.length - postsData.length} 个帖子未被解析！`);
                
                // 找出未解析的帖子
                const parsedIds = new Set(postsData.map(p => p.replyId));
                postBodies.forEach(function(postBody) {
                    const postIdMatch = postBody.id.match(/^pid(\d+)body$/);
                    if (postIdMatch) {
                        const replyId = postIdMatch[1];
                        if (!parsedIds.has(replyId)) {
                            console.warn(`  未解析的帖子ID: ${replyId}, 元素ID: ${postBody.id}`);
                            // 检查是否是第一层楼
                            const titleTable = document.getElementById(`pid${replyId}`);
                            if (titleTable) {
                                const floorFont = titleTable.querySelector('font.big');
                                if (floorFont) {
                                    const floorBold = floorFont.querySelector('b');
                                    if (floorBold) {
                                        const floorText = floorBold.textContent.trim();
                                        const floorMatch = floorText.match(/^(\d+)$/);
                                        if (floorMatch && parseInt(floorMatch[1], 10) === 1) {
                                            console.warn(`    → 这是第一层楼，正常跳过`);
                                        }
                                    }
                                }
                            }
                        }
                    }
                });
            }
            
            // 统计下注点数为0的帖子
            const zeroBetPosts = postsData.filter(p => p.betNum === 0);
            if (zeroBetPosts.length > 0) {
                console.warn(`⚠️ 有 ${zeroBetPosts.length} 个帖子的下注点数为0（将在计算时被跳过）:`);
                zeroBetPosts.forEach(p => {
                    console.warn(`  楼层${p.floorNumber || '未知'} - ${p.author || '未知用户'} (ID: ${p.replyId})`);
                });
            }
            
            console.log(JSON.stringify(postsData, null, 2));
            console.log('总计:', postsData.length, '个回帖');
            console.log('======================');
        }
        
        return postsData;
    }

    // 初始化
    function init() {
        createCalculatorUI();
        
        // 解析所有回帖信息（页面加载时自动解析）
        setTimeout(function() {
            parseAllPosts();
        }, 500);
        
        // 初始化所有帖子的评分总和显示（页面加载时自动显示）
        // 延迟执行，确保页面内容完全加载
        setTimeout(function() {
            RatingManager.initAllRatingSummaries();
        }, 500);
        
        // 如果有保存的关键词，自动执行计算（根据topicid）
        const topicid = getTopicId();
        const savedKeywords = Config.getKeywords(topicid);
        if (savedKeywords) {
            // 等待一小段时间确保UI已创建
            setTimeout(function() {
                const keywordsInput = document.getElementById('bet-keywords');
                if (keywordsInput && savedKeywords) {
                    // 加载保存的赔率，如果没有保存的赔率，使用默认值0.9
                    const savedOdds = Config.getOdds(topicid);
                    const oddsInput = document.getElementById('bet-odds');
                    if (oddsInput) {
                        if (savedOdds) {
                            oddsInput.value = savedOdds;
                        } else {
                            oddsInput.value = '0.9'; // 默认赔率为0.9
                        }
                    }
                    calculateBets();
                }
            }, 100);
        }

        // 添加自动分批评分按钮
        // 使用MutationObserver监听动态加载的评分表单
        const observer = new MutationObserver(function(mutations) {
            addBatchRatingButtons();
        });
        observer.observe(document.body, {
            childList: true,
            subtree: true
        });

        // 立即执行一次，处理已存在的表单
        setTimeout(addBatchRatingButtons, 500);
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();
