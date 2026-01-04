// ==UserScript==
// @name         综测总分计算器
// @namespace    https://github.com/MuonChaser/ZongceCalculator
// @version      1.0
// @author       MuonChaser
// @description  自动计算综合测评总分并显示在页面上
// @license MIT
// @match        *://i.cufe.edu.cn/xsfw/sys/zhcpapp_cufe*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/549285/%E7%BB%BC%E6%B5%8B%E6%80%BB%E5%88%86%E8%AE%A1%E7%AE%97%E5%99%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/549285/%E7%BB%BC%E6%B5%8B%E6%80%BB%E5%88%86%E8%AE%A1%E7%AE%97%E5%99%A8.meta.js
// ==/UserScript==


(function() {
    'use strict';

    // 计算综测总分的函数
    function calculateTotalScore() {
        // 获取表格数据
        const table = document.querySelector('#tablewdzpTreeTable');
        if (!table) {
            console.log('未找到综测表格');
            return;
        }

        const scores = {};
        const rows = table.querySelectorAll('tr');
        let currentCategory = '';

        // 遍历表格行，提取分数数据
        rows.forEach(row => {
            const cells = row.querySelectorAll('td');
            if (cells.length >= 4) {
                const titleCell = cells[0];
                const scoreCell = cells[2]; // 学生自评得分列
                const bonusCell = cells[3]; // 学生自评加分列

                if (titleCell && scoreCell) {
                    const titleSpan = titleCell.querySelector('.jqx-tree-grid-title');
                    if (titleSpan) {
                        const title = titleSpan.textContent.trim();
                        const scoreText = scoreCell.textContent.trim();
                        const bonusText = bonusCell ? bonusCell.textContent.trim() : '0';

                        // 识别当前所属的大类别
                        const indentSpans = titleCell.querySelectorAll('.jqx-tree-grid-indent');
                        const indentLevel = indentSpans.length;

                        // 如果是顶级类别（缩进少），更新当前类别
                        if (indentLevel <= 2) {
                            if (title.includes('德育')) currentCategory = '德育';
                            else if (title.includes('智育')) currentCategory = '智育';
                            else if (title.includes('体质健康') || title.includes('体育')) currentCategory = '体育';
                            else if (title.includes('学术科研') || title.includes('科研')) currentCategory = '学术科研';
                            else if (title.includes('组织管理')) currentCategory = '组织管理';
                            else if (title.includes('劳动实践')) currentCategory = '劳动实践';
                            else if (title.includes('美育') || title.includes('美术')) currentCategory = '美育';
                        }

                        // 提取数字，忽略"--"
                        const score = (scoreText !== '--' && scoreText !== '') ? (parseFloat(scoreText) || 0) : 0;
                        const bonus = (bonusText !== '--' && bonusText !== '') ? (parseFloat(bonusText) || 0) : 0;

                        if (score > 0 || bonus > 0) {
                            // 为重复的项目名添加类别前缀
                            let uniqueTitle = title;
                            if (title === '基本分' || title === '加分') {
                                uniqueTitle = `${currentCategory}_${title}`;
                            }

                            scores[uniqueTitle] = {
                                score,
                                bonus,
                                total: score + bonus,
                                category: currentCategory,
                                originalTitle: title
                            };
                            console.log(`${uniqueTitle}: 基础分${score}, 加分${bonus}, 小计${score + bonus} [类别:${currentCategory}]`);
                        }
                    }
                }
            }
        });

        // 根据实际页面数据，重新定义分类映射
        const categories = {
            德育: {
                items: ['政治思想', '道德品质', '法纪观念', '学习态度', '集体意识', '生活修养'],
                weight: 0.3,
                maxScore: 100,
                description: '德育基础分数'
            },
            智育: {
                items: ['学习成绩'],
                weight: 0.6,
                maxScore: 100,
                description: '智育基础分数（学习成绩）'
            },
            体育锻炼: {
                items: ['日常体育锻炼', '体质与健康测试', '体育_基础分', '体育_加分'],
                weight: 0.1,
                maxScore: 100,
                description: '体质健康与锻炼'
            },
            学术科研与创新: {
                items: ['学术科研_基本分', '学科竞赛类', '科研项目类', '发表文章类', '学术科研与创新类荣誉称号'],
                weight: 0.1,
                maxScore: 200,
                description: '学术科研与创新能力'
            },
            组织管理能力: {
                items: ['组织管理_基本分', '业绩能力分', '组织管理_加分'],
                weight: 0.1,
                maxScore: 100,
                description: '组织管理能力'
            },
            劳动实践: {
                items: ['劳动实践_基本分', '劳动实践_加分'],
                weight: 0.1,
                maxScore: 100,
                description: '劳动实践评价'
            },
            美育素养: {
                items: ['美育_基本分', '参加文化、艺术类竞赛活动', '发表文学、艺术类作品'],
                weight: 0.1,
                maxScore: 100,
                description: '美育素质评价'
            }
        };

        // 处理智育加分项
        const zhiyuBonus = (scores['通用知识课程选修']?.total || 0) + (scores['书籍阅读情况']?.total || 0);
        if (zhiyuBonus > 0) {
            // 如果智育有加分项，加到智育总分中
            const zhiyuBase = scores['学习成绩']?.total || 0;
            scores['智育总分'] = { score: zhiyuBase, bonus: zhiyuBonus, total: zhiyuBase * 0.9 + zhiyuBonus *0.1 };
            categories.智育.items = ['智育总分'];
        }

        const categoryScores = {};

        // 计算各类别分数
        Object.entries(categories).forEach(([categoryName, category]) => {
            let categoryTotal = 0;
            let foundItems = [];
            let originalTotal = 0; // 记录原始总分
            let isLimited = false; // 记录是否被限制

            category.items.forEach(item => {
                if (scores[item]) {
                    originalTotal += scores[item].total;
                    const displayName = scores[item].originalTitle || item;
                    foundItems.push(`${displayName}(${scores[item].total})`);
                }
            });

            // 应用最大值限制
            categoryTotal = Math.min(originalTotal, category.maxScore);
            isLimited = originalTotal > category.maxScore;

            categoryScores[categoryName] = {
                total: categoryTotal,
                originalTotal: originalTotal,
                maxScore: category.maxScore,
                isLimited: isLimited,
                weighted: categoryTotal * category.weight,
                items: foundItems,
                description: category.description
            };

            if (isLimited) {
                console.log(`${categoryName}: ${originalTotal}分 (超限，取${category.maxScore}分) × ${category.weight} = ${(categoryTotal * category.weight).toFixed(2)}分 ⚠️`);
            } else {
                console.log(`${categoryName}: ${categoryTotal}分 × ${category.weight} = ${(categoryTotal * category.weight).toFixed(2)}分`);
            }
        });

        // 计算总分
        const totalScore = Object.values(categoryScores).reduce((sum, cat) => sum + cat.weighted, 0);

        return { categoryScores, totalScore, scores };
    }

    // 创建显示结果的界面
    function createScoreDisplay(result) {
        // 移除已存在的显示框
        const existingDisplay = document.getElementById('scoreDisplay');
        if (existingDisplay) {
            existingDisplay.remove();
        }

        // 创建显示容器
        const displayDiv = document.createElement('div');
        displayDiv.id = 'scoreDisplay';
        displayDiv.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            width: 400px;
            max-height: 80vh;
            background: #fff;
            border: 2px solid #007cba;
            border-radius: 10px;
            padding: 20px;
            box-shadow: 0 4px 20px rgba(0,0,0,0.3);
            z-index: 10000;
            font-family: "Microsoft YaHei", Arial, sans-serif;
            font-size: 14px;
            overflow-y: auto;
        `;

        let html = `
            <div style="text-align: center; margin-bottom: 15px;">
                <h3 style="margin: 0; color: #007cba; font-size: 18px;">📊 综测总分计算结果</h3>
            </div>
            <div style="background: #f0f8ff; padding: 15px; border-radius: 8px; margin-bottom: 15px; text-align: center;">
                <div style="font-size: 24px; font-weight: bold; color: #d32f2f;">
                    总分: ${result.totalScore.toFixed(2)}
                </div>
            </div>
        `;

        html += '<div style="margin-bottom: 15px;"><strong>📋 各项评价详情:</strong></div>';

        // 显示各类别得分
        Object.entries(result.categoryScores).forEach(([categoryName, categoryData]) => {
            const percentage = result.totalScore > 0 ? (categoryData.weighted / result.totalScore * 100).toFixed(1) : '0.0';
            const weightPercentage = (categoryData.total > 0 ? categoryData.weighted / categoryData.total : 0) * 100;

            // 构建显示内容
            let statusColor = '#007cba';
            let statusIcon = '';
            let limitInfo = '';

            if (categoryData.isLimited) {
                statusColor = '#ff6b6b';
                statusIcon = ' ⚠️';
                limitInfo = `<div style="font-size: 11px; color: #ff6b6b; margin-top: 3px;">
                    ⚠️ 原始分${categoryData.originalTotal}分，超出上限${categoryData.maxScore}分，已限制
                </div>`;
            } else {
                limitInfo = `<div style="font-size: 11px; color: #28a745; margin-top: 3px;">
                    ✅ 未超限 (上限${categoryData.maxScore}分)
                </div>`;
            }

            html += `
                <div style="margin-bottom: 12px; padding: 10px; background: #f8f9fa; border-radius: 5px; border-left: 4px solid ${statusColor};">
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 5px;">
                        <strong style="color: #333;">${categoryName}${statusIcon}</strong>
                        <span style="color: ${statusColor}; font-weight: bold;">${categoryData.weighted.toFixed(2)}分</span>
                    </div>
                    <div style="font-size: 12px; color: #666;">
                        计算分: ${categoryData.total}分 × 权重${weightPercentage.toFixed(0)}%
                        (占总分${percentage}%)
                    </div>
                    ${limitInfo}
                    ${categoryData.items.length > 0 ?
                        `<div style="font-size: 11px; color: #888; margin-top: 3px;">
                            包含: ${categoryData.items.join(', ')}
                        </div>` : ''
                    }
                    ${categoryData.description ?
                        `<div style="font-size: 10px; color: #999; margin-top: 2px; font-style: italic;">
                            ${categoryData.description}
                        </div>` : ''
                    }
                </div>
            `;
        });

        // 添加计算公式说明
        html += `
            <div style="margin-top: 15px; padding: 10px; background: #fff3cd; border-radius: 5px; border: 1px solid #ffeaa7;">
                <div style="font-size: 12px; color: #856404;">
                    <strong>💡 计算公式:</strong><br>
                    总分 = 德育×30% + 智育×60% + 体育锻炼×10% + 学术科研×10% + 组织管理×10% + 劳动实践×10% + 美育素养×10%
                </div>
            </div>
        `;

        // 添加关闭按钮
        html += `
            <div style="text-align: center; margin-top: 15px;">
                <button id="closeScoreDisplay" style="
                    background: #007cba;
                    color: white;
                    border: none;
                    padding: 8px 20px;
                    border-radius: 5px;
                    cursor: pointer;
                    font-size: 14px;
                ">关闭</button>
                <button id="refreshScore" style="
                    background: #28a745;
                    color: white;
                    border: none;
                    padding: 8px 20px;
                    border-radius: 5px;
                    cursor: pointer;
                    font-size: 14px;
                    margin-left: 10px;
                ">刷新计算</button>
            </div>
        `;

        displayDiv.innerHTML = html;
        document.body.appendChild(displayDiv);

        // 添加关闭按钮事件
        document.getElementById('closeScoreDisplay').onclick = () => {
            displayDiv.remove();
        };

        // 添加刷新按钮事件
        document.getElementById('refreshScore').onclick = () => {
            const newResult = calculateTotalScore();
            if (newResult) {
                createScoreDisplay(newResult);
            }
        };

        // 添加拖拽功能
        let isDragging = false;
        let dragOffset = { x: 0, y: 0 };

        displayDiv.onmousedown = (e) => {
            if (e.target.tagName === 'BUTTON') return;
            isDragging = true;
            dragOffset.x = e.clientX - displayDiv.offsetLeft;
            dragOffset.y = e.clientY - displayDiv.offsetTop;
            displayDiv.style.cursor = 'move';
        };

        document.onmousemove = (e) => {
            if (isDragging) {
                displayDiv.style.left = (e.clientX - dragOffset.x) + 'px';
                displayDiv.style.top = (e.clientY - dragOffset.y) + 'px';
                displayDiv.style.right = 'auto';
            }
        };

        document.onmouseup = () => {
            isDragging = false;
            displayDiv.style.cursor = 'default';
        };
    }

    // 创建计算按钮
    function createCalculateButton() {
        const button = document.createElement('button');
        button.id = 'calculateScoreBtn';
        button.innerHTML = '🧮 计算综测总分';
        button.style.cssText = `
            position: fixed;
            top: 20px;
            left: 20px;
            background: #007cba;
            color: white;
            border: none;
            padding: 12px 20px;
            border-radius: 25px;
            cursor: pointer;
            font-size: 16px;
            font-weight: bold;
            box-shadow: 0 2px 10px rgba(0,0,0,0.2);
            z-index: 9999;
            transition: all 0.3s ease;
        `;

        button.onmouseover = () => {
            button.style.background = '#005a8b';
            button.style.transform = 'scale(1.05)';
        };

        button.onmouseout = () => {
            button.style.background = '#007cba';
            button.style.transform = 'scale(1)';
        };

        button.onclick = () => {
            const result = calculateTotalScore();
            if (result) {
                createScoreDisplay(result);
            } else {
                alert('无法计算分数，请确保页面已加载完成且包含综测数据');
            }
        };

        document.body.appendChild(button);
    }

    // 等待页面加载完成
    function init() {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', init);
            return;
        }

        // 延迟执行，确保动态内容加载完成
        setTimeout(() => {
            createCalculateButton();

            // 自动计算一次（可选）
            const result = calculateTotalScore();
            if (result) {
                console.log('综测总分:', result.totalScore.toFixed(2));
            }
        }, 2000);
    }

    init();
})();
