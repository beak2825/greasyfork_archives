// ==UserScript==
// @name         gooboo夜间狩猎药水配方
// @namespace    http://tampermonkey.net/
// @version      2.1
// @description  点击按钮后显示汉化的potion信息，显示药剂名称、等级和材料图标，支持全部/未完成切换，默认显示未完成
// @author       AI Assistant
// @match        *://*/gooboo/
// @match        *://gooboo.g8hh.com.cn/
// @match        *://gooboo.tkfm.online/

// @match        https://gooboo.terrakeeper.top/
// @grant        none
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/551851/gooboo%E5%A4%9C%E9%97%B4%E7%8B%A9%E7%8C%8E%E8%8D%AF%E6%B0%B4%E9%85%8D%E6%96%B9.user.js
// @updateURL https://update.greasyfork.org/scripts/551851/gooboo%E5%A4%9C%E9%97%B4%E7%8B%A9%E7%8C%8E%E8%8D%AF%E6%B0%B4%E9%85%8D%E6%96%B9.meta.js
// ==/UserScript==

(function() {
    'use strict';
    
    let potionData = null;
    let infoPanel = null;
    let currentFilter = 'uncompleted'; // 默认显示未完成
    
    // 汉化映射表
    const translations = {
        // 药剂名称
        'power': '力量药水',
        'insight': '洞察药水',
        'rage': '愤怒药水',
        'calming': '镇静药水',
        'sorrow': '悲伤药水',
        'energy': '能量药水',
        'nature': '自然药水',
        'intensity': '强化药水',
        'hysteria': '癔症药水',
        'insanity': '疯狂药水',
        'patience': '耐心药水',
        'transformation': '变身药水',
        'silence': '沉默药水',
        'photosynthesis': '光合药水',
        'sun': '太阳药水',
        'growth': '生长药水',
        'solidification': '凝固药水',
        'liquification': '液化药水',
        'glowing': '发光药水',
        'stasis': '瘀滞药水',
        'creativity': '创意药水',
        'poison': '毒药药水',
        'warmth': '温暖药水',
        
        // 材料
        'lavender': '薰衣草',
        'mapleLeaf': '枫叶',
        'fourLeafClover': '四叶草',
        'charredSkull': '烧焦的头骨',
        'mysticalWater': '神秘的水',
        'cheese': '奶酪',
        'spiderWeb': '蜘蛛网',
        'strangeEgg': '奇怪的蛋',
        'puzzlePiece': '一块拼图',
        'wizardHat': '巫师帽',
        'cactus': '仙人掌',
        'feather': '羽毛'
    };
    
    // 材料图标映射
    const materialIcons = {
        'lavender': 'mdi-grass',
        'mapleLeaf': 'mdi-leaf-maple',
        'fourLeafClover': 'mdi-clover',
        'charredSkull': 'mdi-skull',
        'mysticalWater': 'mdi-flask-round-bottom-outline',
        'cheese': 'mdi-cheese',
        'spiderWeb': 'mdi-spider-web',
        'strangeEgg': 'mdi-egg-easter',
        'puzzlePiece': 'mdi-puzzle',
        'wizardHat': 'mdi-wizard-hat',
        'cactus': 'mdi-cactus',
        'feather': 'mdi-feather'
    };
    
    // 获取potion数据
    function fetchPotionData() {
        const primaryElements = document.querySelectorAll('.primary');
        
        for (let element of primaryElements) {
            if (element.__vue__ && element.__vue__.$store) {
                potionData = element.__vue__.$store.state?.nightHunt?.potion;
                if (potionData) break;
            }
        }
        
        return potionData;
    }
    
    // 创建材料图标元素
    function createMaterialIcon(ingredientKey) {
        const iconClass = materialIcons[ingredientKey] || 'mdi-help';
        const tooltip = translations[ingredientKey] || ingredientKey;
        
        return `<span class="material-icon" title="${tooltip}" style="display:inline-block;margin:2px 5px;font-size:20px;vertical-align:middle;">
            <i class="mdi ${iconClass}"></i>
        </span>`;
    }
    
    // 获取等级颜色
    function getLevelColor(level) {
        if (level === 0) return '#9ca3af'; // 灰色 - 未完成
        if (level >= 10) return '#fbbf24'; // 金色 - 高级
        if (level >= 5) return '#60a5fa';  // 蓝色 - 中级
        return '#34d399';                  // 绿色 - 初级
    }
    
    // 过滤药水列表
    function filterPotions(potionList, filter) {
        if (filter === 'all') {
            return potionList;
        } else if (filter === 'uncompleted') {
            return potionList.filter(potion => potion.level === 0);
        }
        return potionList;
    }
    
    // 更新显示内容
    function updateDisplayContent(potionList, filter) {
        const filteredPotions = filterPotions(potionList, filter);
        
        if (filteredPotions.length === 0) {
            return '<div style="text-align: center; color: #9ca3af; padding: 20px;">没有找到符合条件的药水</div>';
        }
        
        let displayContent = '<div style="line-height: 1.6;">';
        
        filteredPotions.forEach(potion => {
            const levelColor = getLevelColor(potion.level);
            const levelText = potion.level === 0 ? '未完成' : `Lv. ${potion.level}`;
            
            displayContent += `
                <div style="margin-bottom: 15px; padding: 10px; background: #4a5568; border-radius: 5px;">
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
                        <div style="font-weight: bold; color: #68d391;">${potion.name}</div>
                        <div style="color: ${levelColor}; font-weight: bold; background: rgba(0,0,0,0.3); padding: 2px 8px; border-radius: 10px; font-size: 12px;">
                            ${levelText}
                        </div>
                    </div>
                    <div style="color: #e2e8f0; display: flex; flex-wrap: wrap; align-items: center;">
                        <span style="margin-right: 8px; font-size: 12px; color: #cbd5e0;">材料:</span>
                        ${potion.ingredients.join('')}
                    </div>
                </div>
            `;
        });
        
        displayContent += '</div>';
        return displayContent;
    }
    
    // 显示信息面板
    function showInfoPanel() {
        if (infoPanel) {
            infoPanel.remove();
        }
        
        if (!potionData) {
            potionData = fetchPotionData();
        }
        
        if (potionData) {
            // 提取药剂名称、等级和材料
            const potionList = [];
            
            for (const [potionKey, potionInfo] of Object.entries(potionData)) {
                if (potionInfo && potionInfo.recipe) {
                    const potionName = translations[potionKey] || potionKey;
                    const level = potionInfo.level || 0;
                    const ingredientIcons = potionInfo.recipe.map(ingredient => 
                        createMaterialIcon(ingredient)
                    );
                    
                    potionList.push({
                        name: potionName,
                        level: level,
                        ingredients: ingredientIcons
                    });
                }
            }
            
            infoPanel = document.createElement('div');
            infoPanel.innerHTML = `
                <div style="position:fixed;top:50%;left:50%;transform:translate(-50%,-50%);background:#2d3748;color:white;padding:20px;border-radius:8px;z-index:10000;width:80%;max-width:500px;max-height:80vh;overflow:auto;font-family:Arial;font-size:14px;border:2px solid #68d391;box-shadow:0 0 20px rgba(0,0,0,0.5);">
                    <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:15px;border-bottom:1px solid #4a5568;padding-bottom:10px;">
                        <h4 style="margin:0;color:#68d391;">药水配方列表</h4>
                        <button id="closePanel" style="background:#e53e3e;color:white;border:none;padding:5px 10px;border-radius:3px;cursor:pointer;font-size:12px;">关闭</button>
                    </div>
                    <div style="display:flex;margin-bottom:15px;background:#4a5568;border-radius:5px;overflow:hidden;">
                        <button id="showAll" style="flex:1;background:${currentFilter === 'all' ? '#68d391' : '#4a5568'};color:${currentFilter === 'all' ? '#1a202c' : 'white'};border:none;padding:8px;cursor:pointer;font-weight:bold;">全部</button>
                        <button id="showUncompleted" style="flex:1;background:${currentFilter === 'uncompleted' ? '#68d391' : '#4a5568'};color:${currentFilter === 'uncompleted' ? '#1a202c' : 'white'};border:none;padding:8px;cursor:pointer;font-weight:bold;">未完成</button>
                    </div>
                    <div id="potionListContainer">${updateDisplayContent(potionList, currentFilter)}</div>
                </div>
            `;
            document.body.appendChild(infoPanel);
            
            // 添加关闭按钮事件
            infoPanel.querySelector('#closePanel').addEventListener('click', () => {
                infoPanel.remove();
                infoPanel = null;
            });
            
            // 添加筛选按钮事件
            infoPanel.querySelector('#showAll').addEventListener('click', () => {
                currentFilter = 'all';
                infoPanel.querySelector('#showAll').style.background = '#68d391';
                infoPanel.querySelector('#showAll').style.color = '#1a202c';
                infoPanel.querySelector('#showUncompleted').style.background = '#4a5568';
                infoPanel.querySelector('#showUncompleted').style.color = 'white';
                document.getElementById('potionListContainer').innerHTML = updateDisplayContent(potionList, currentFilter);
            });
            
            infoPanel.querySelector('#showUncompleted').addEventListener('click', () => {
                currentFilter = 'uncompleted';
                infoPanel.querySelector('#showAll').style.background = '#4a5568';
                infoPanel.querySelector('#showAll').style.color = 'white';
                infoPanel.querySelector('#showUncompleted').style.background = '#68d391';
                infoPanel.querySelector('#showUncompleted').style.color = '#1a202c';
                document.getElementById('potionListContainer').innerHTML = updateDisplayContent(potionList, currentFilter);
            });
            
            // 同时在控制台输出
            console.log('🧪 药水配方列表:', potionList);
        } else {
            alert('未找到potion数据，请确保页面已正确加载');
        }
    }
    
    // 创建触发按钮
    function createTriggerButton() {
        const button = document.createElement('button');
        button.innerHTML = '配';
        button.style.cssText = `
            position: fixed;
            bottom: 20px;
            right: 20px;
            z-index: 9999;
            background: #68d391;
            color: #1a202c;
            border: none;
            padding: 10px 16px;
            border-radius: 25px;
            cursor: pointer;
            font-family: Arial, sans-serif;
            font-weight: bold;
            box-shadow: 0 3px 10px rgba(0,0,0,0.3);
            transition: all 0.3s ease;
        `;
        
        // 添加悬停效果
        button.addEventListener('mouseover', function() {
            this.style.transform = 'scale(1.05)';
            this.style.boxShadow = '0 5px 15px rgba(0,0,0,0.4)';
        });
        
        button.addEventListener('mouseout', function() {
            this.style.transform = 'scale(1)';
            this.style.boxShadow = '0 3px 10px rgba(0,0,0,0.3)';
        });
        
        button.addEventListener('click', showInfoPanel);
        document.body.appendChild(button);
    }
    
    // 初始化
    function init() {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', createTriggerButton);
        } else {
            createTriggerButton();
        }
    }
    
    init();
})();