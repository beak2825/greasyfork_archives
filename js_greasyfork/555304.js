// ==UserScript==
// @name         装备信息读取器 + 战斗模拟器
// @namespace    http://tampermonkey.net/
// @version      1.9.44
// @description  读取装备信息并模拟战斗
// @author       Lunaris
// @match        https://aring.cc/awakening-of-war-soul-ol/
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/555304/%E8%A3%85%E5%A4%87%E4%BF%A1%E6%81%AF%E8%AF%BB%E5%8F%96%E5%99%A8%20%2B%20%E6%88%98%E6%96%97%E6%A8%A1%E6%8B%9F%E5%99%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/555304/%E8%A3%85%E5%A4%87%E4%BF%A1%E6%81%AF%E8%AF%BB%E5%8F%96%E5%99%A8%20%2B%20%E6%88%98%E6%96%97%E6%A8%A1%E6%8B%9F%E5%99%A8.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 全局变量存储人物属性和怪物设置
    let playerStats = {
        攻击: 0,
        破防: 0,
        命中率: 100,
        暴击率: 0,
        暴击伤害: 0,
        暴击重击: 0,
        暴击固定减少: 0,
        暴击百分比减少: 0,
        不暴击减免: 1.0,
        攻速: 1.0,
        攻击属性: '无',
        元素伤害加成: 0,
        元素伤害Map: {
            wind: 0,
            fire: 0,
            water: 0,
            earth: 0
        },
        追击伤害: 0,
        追击词条: [],
        影刃词条: [],
        虚无词条: [],
        重击词条: [],
        裂创词条: [],
        重创词条: [],
        分裂词条: [],
        爆发词条: [],
        碎骨词条: [],
        冲击词条: [],
        冲锋词条: [],
        收割词条: [],
        收尾词条: [],
        全伤害加成: 0,
        常驻显示词条: [],
        精准减闪系数: 1,
        残忍减防: 0,
        残忍防御系数: 1,
        残忍百分比词条: [],
        残忍固定词条: []
    };

    // 保存怪物设置
    let monsterSettings = {
        血量: 0,
        防御: 0,
        闪避率: 0,
        抗暴率: 0,
        承伤常数: 150
    };

    // 创建悬浮按钮
    const floatBtn = document.createElement('button');
    floatBtn.innerHTML = '📋 读取装备';
    floatBtn.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        z-index: 99999;
        padding: 10px 20px;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        color: white;
        border: none;
        border-radius: 8px;
        cursor: pointer;
        font-size: 14px;
        font-weight: bold;
        box-shadow: 0 4px 15px rgba(0,0,0,0.3);
        transition: all 0.3s;
    `;
    floatBtn.onmouseover = () => floatBtn.style.transform = 'scale(1.05)';
    floatBtn.onmouseout = () => floatBtn.style.transform = 'scale(1)';
    document.body.appendChild(floatBtn);

    // 创建战斗模拟按钮
    const simulateBtn = document.createElement('button');
    simulateBtn.innerHTML = '⚔️ 战斗模拟';
    simulateBtn.style.cssText = `
        position: fixed;
        top: 150px;
        right: 20px;
        z-index: 99999;
        padding: 10px 20px;
        background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
        color: white;
        border: none;
        border-radius: 8px;
        cursor: pointer;
        font-size: 14px;
        font-weight: bold;
        box-shadow: 0 4px 15px rgba(0,0,0,0.3);
        transition: all 0.3s;
    `;
    simulateBtn.onmouseover = () => simulateBtn.style.transform = 'scale(1.05)';
    simulateBtn.onmouseout = () => simulateBtn.style.transform = 'scale(1)';
    document.body.appendChild(simulateBtn);

    // 创建结果展示面板
    const resultPanel = document.createElement('div');
    resultPanel.style.cssText = `
        position: fixed;
        top: 150px;
        right: 20px;
        z-index: 99998;
        width: 400px;
        max-height: 70vh;
        overflow-y: auto;
        background: white;
        border-radius: 12px;
        box-shadow: 0 8px 32px rgba(0,0,0,0.2);
        display: none;
        padding: 20px;
        font-family: sans-serif;
    `;
    document.body.appendChild(resultPanel);

    // 创建战斗模拟面板
    const simulatePanel = document.createElement('div');
    simulatePanel.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        z-index: 99999;
        width: 600px;
        max-height: 80vh;
        overflow-y: auto;
        background: white;
        border-radius: 12px;
        box-shadow: 0 8px 32px rgba(0,0,0,0.3);
        display: none;
        padding: 25px;
        font-family: sans-serif;
    `;
    document.body.appendChild(simulatePanel);

    // 解析人物基本属性
    function parseUserAttrs() {
        const userAttrsDiv = document.querySelector('.user-attrs');
        const attrs = {};

        if (userAttrsDiv) {
            const paragraphs = userAttrsDiv.querySelectorAll('.text-wrap p');
            paragraphs.forEach(p => {
                const spans = p.querySelectorAll('span');
                if (spans.length >= 2) {
                    const key = spans[0].textContent.replace('：', '').trim();
                    const value = spans[1].textContent.trim();
                    attrs[key] = value;
                }
            });
        }

        // 更新全局玩家属性
        playerStats.攻击 = parseFloat(attrs['攻击'] || 0);
        playerStats.破防 = parseFloat(attrs['破防'] || 0);
        playerStats.命中率 = parseFloat(attrs['命中率']?.replace('%', '') || 100);
        playerStats.暴击率 = parseFloat(attrs['暴击率']?.replace('%', '') || 0);
        playerStats.暴击伤害 = parseFloat(attrs['暴击伤害']?.replace('%', '') || 150) / 100;
        // 尝试读取"攻击速度"或"攻速"
        playerStats.攻速 = parseFloat(attrs['攻击速度'] || attrs['攻速'] || 1.0);
        playerStats.全伤害加成 = parseFloat(attrs['全伤害加成']?.replace('%', '') || 0) / 100;
        playerStats.元素伤害Map = {
            wind: 0,
            fire: 0,
            water: 0,
            earth: 0
        };

        const elementAttrMap = {
            wind: '风伤害加成',
            fire: '火伤害加成',
            water: '水伤害加成',
            earth: '土伤害加成'
        };

        Object.entries(elementAttrMap).forEach(([key, label]) => {
            const value = attrs[label];
            playerStats.元素伤害Map[key] = value ? parseFloat(value.replace('%', '') || 0) / 100 : 0;
        });
        playerStats.元素伤害加成 = 0;

        return attrs;
    }

    // 解析装备信息
    function parseEquipment(equipDiv) {
        const info = {
            affixes: [],
            specialAttrs: []
        };

        const paragraphs = equipDiv.querySelectorAll('p');
        let currentSection = '';

        paragraphs.forEach(p => {
            const text = p.textContent.trim();

            if (text === '暗金属性：') {
                currentSection = 'darkGold';
            } else if (text === '刻印属性：') {
                currentSection = 'affix';
            } else if (text === '特殊属性：') {
                currentSection = 'special';
            } else if (text && !text.endsWith('：')) {
                const specialSpan = p.querySelector('.special');
                if (specialSpan) {
                    const affixName = specialSpan.textContent.trim();
                    const darkGoldSpan = p.querySelector('.darkGold');
                    const percentage = darkGoldSpan ? darkGoldSpan.textContent.trim() : '';

                    let description = '';
                    const tempDiv = document.createElement('div');
                    tempDiv.innerHTML = p.innerHTML;
                    tempDiv.querySelectorAll('.awaken').forEach(span => span.remove());
                    tempDiv.querySelectorAll('.darkGold').forEach(span => span.remove());
                    const specialClone = tempDiv.querySelector('.special');
                    if (specialClone) {
                        specialClone.remove();
                    }
                    let descText = tempDiv.textContent || '';
                    const colonIndex = descText.search(/[：:]/);
                    if (colonIndex !== -1) {
                        descText = descText.slice(colonIndex + 1);
                    }
                    description = descText.trim();

                    info.affixes.push({
                        name: affixName,
                        percentage: percentage,
                        description: description
                    });
                } else if (currentSection === 'special') {
                    const tempDiv = document.createElement('div');
                    tempDiv.innerHTML = p.innerHTML;
                    const awakenSpans = tempDiv.querySelectorAll('.awaken');
                    awakenSpans.forEach(span => span.remove());
                    info.specialAttrs.push(tempDiv.textContent.trim());
                }
            }
        });

        return info;
    }

    // 格式化展示人物属性
    function formatUserAttrsHTML(attrs) {
        let html = `
            <div style="margin-bottom: 20px; padding: 15px; border: 2px solid #667eea; border-radius: 8px; background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);">
                <h3 style="margin: 0 0 10px 0; color: #667eea; border-bottom: 2px solid #667eea; padding-bottom: 5px;">
                    人物基本属性
                </h3>
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px;">
        `;

        for (let [key, value] of Object.entries(attrs)) {
            html += `<div style="background: white; padding: 6px 10px; border-radius: 4px;">
                <span style="color: #555; font-size: 13px;">${key}:</span>
                <span style="color: #27ae60; font-weight: bold;">${value}</span>
            </div>`;
        }

        html += '</div></div>';
        return html;
    }

    // 格式化展示所有装备的词条和特殊属性
    function formatAllEquipmentHTML(equipmentData) {
        let allAffixes = [];
        let allSpecialAttrs = [];

        equipmentData.forEach(eq => {
            allAffixes = allAffixes.concat(eq.affixes);
            allSpecialAttrs = allSpecialAttrs.concat(eq.specialAttrs);
        });

        let html = `
            <div style="margin-bottom: 20px; padding: 15px; border: 2px solid #e74c3c; border-radius: 8px; background: #fff5f5;">
                <h3 style="margin: 0 0 10px 0; color: #e74c3c; border-bottom: 2px solid #e74c3c; padding-bottom: 5px;">
                    装备词条
                </h3>
        `;

        if (allAffixes.length > 0) {
            html += '<ul style="margin: 5px 0; padding-left: 20px;">';
            allAffixes.forEach(affix => {
                const triggerRate = affix.percentage ? `<span style="color: #d4af37;">(${affix.percentage})</span>` : '<span style="color: #27ae60;">(100%)</span>';
                html += `<li style="margin: 5px 0;"><strong style="color: #e74c3c;">${affix.name}</strong> ${triggerRate}: ${affix.description}</li>`;
            });
            html += '</ul>';
        } else {
            html += '<p style="color: #999; text-align: center;">无词条</p>';
        }

        html += '</div>';

        if (allSpecialAttrs.length > 0) {
            html += `
                <div style="margin-bottom: 20px; padding: 15px; border: 2px solid #e67e22; border-radius: 8px; background: #fff8f0;">
                    <h3 style="margin: 0 0 10px 0; color: #e67e22; border-bottom: 2px solid #e67e22; padding-bottom: 5px;">
                        特殊属性
                    </h3>
                    <ul style="margin: 5px 0; padding-left: 20px;">
            `;
            allSpecialAttrs.forEach(attr => {
                html += `<li style="margin: 5px 0;">${attr}</li>`;
            });
            html += '</ul></div>';
        }

        return html;
    }

    function getElementIcon(elementName) {
        switch (elementName) {
            case '风属性':
                return '🌪️';
            case '火属性':
                return '🔥';
            case '水属性':
                return '💧';
            case '土属性':
                return '🌱';
            default:
                return '';
        }
    }

    // 将装备词条转化为角色属性加成
    function applyEquipmentEffects(equipmentData) {
        playerStats.追击伤害 = 0;
        playerStats.追击词条 = [];
        playerStats.影刃词条 = [];
        playerStats.虚无词条 = [];
        playerStats.重击词条 = [];
        playerStats.裂创词条 = [];
        playerStats.重创词条 = [];
        playerStats.分裂词条 = [];
        playerStats.爆发词条 = [];
        playerStats.碎骨词条 = [];
        playerStats.冲击词条 = [];
        playerStats.冲锋词条 = [];
        playerStats.收割词条 = [];
        playerStats.收尾词条 = [];
        playerStats.常驻显示词条 = [];
        playerStats.精准减闪系数 = 1;
        playerStats.残忍减防 = 0;
        playerStats.残忍防御系数 = 1;
        playerStats.残忍百分比词条 = [];
        playerStats.残忍固定词条 = [];

        equipmentData.forEach(eq => {
            eq.affixes.forEach(affix => {
                if (!affix.name) return;

                if (affix.name.includes('精准')) {
                    const preciseName = affix.name.trim() || '精准';
                    playerStats.常驻显示词条.push(preciseName);

                    const percentMatch = (affix.description || '').match(/([\d.]+)\s*%/);
                    if (percentMatch) {
                        const percentValue = parseFloat(percentMatch[1]);
                        if (!isNaN(percentValue)) {
                            const multiplier = Math.max(0, 1 - (percentValue / 100));
                            playerStats.精准减闪系数 *= multiplier;
                        }
                    }
                }

                if (affix.name.includes('追击')) {
                    const desc = affix.description || '';
                    const guaranteedTrigger = /每次(攻击|命中)/.test(desc);
                    let normalizedChance = 100;
                    if (!guaranteedTrigger) {
                        const chanceText = affix.percentage || '';
                        const chanceValue = parseFloat(chanceText.replace(/[^\d.]/g, '')) || 100;
                        normalizedChance = Math.max(0, Math.min(100, chanceValue));
                    }

                    let damageValue = 0;
                    const numberMatches = desc.match(/[\d.]+/g);
                    if (numberMatches && numberMatches.length > 0) {
                        damageValue = parseFloat(numberMatches[numberMatches.length - 1]);
                    }

                    if (!isNaN(damageValue)) {
                        const affixData = {
                            type: '追击',
                            name: affix.name.trim() || '追击',
                            chance: normalizedChance,
                            damage: damageValue
                        };

                        playerStats.追击词条.push(affixData);
                        playerStats.追击伤害 += affixData.damage * (affixData.chance / 100);
                    }
                } else if (affix.name.includes('分裂')) {
                    const percentMatches = affix.description.match(/([\d.]+)\s*%/g);
                    let chanceValue = null;
                    if (percentMatches && percentMatches.length > 0) {
                        const lastPercent = percentMatches[percentMatches.length - 1];
                        chanceValue = parseFloat(lastPercent);
                    }

                    if ((chanceValue === null || isNaN(chanceValue)) && affix.percentage) {
                        chanceValue = parseFloat(affix.percentage.replace(/[^\d.]/g, ''));
                    }

                    const digitSegmentMatch = affix.description.match(/(\d+)\s*段/);
                    let segmentCount = digitSegmentMatch ? parseInt(digitSegmentMatch[1], 10) : null;

                    if (!segmentCount) {
                        const chineseSegmentMatch = affix.description.match(/([一二两三四五六七八九十百千]+)\s*段/);
                        if (chineseSegmentMatch) {
                            segmentCount = parseChineseNumeral(chineseSegmentMatch[1]);
                        }
                    }

                    if (!segmentCount) {
                        segmentCount = 3;
                    }

                    if (!isNaN(chanceValue) && chanceValue > 0) {
                        playerStats.分裂词条.push({
                            type: '分裂',
                            name: affix.name.trim() || '分裂',
                            chance: Math.max(0, Math.min(100, chanceValue)),
                            segments: Math.max(2, segmentCount)
                        });
                    }
                } else if (affix.name.includes('裂创')) {
                    const desc = affix.description || '';
                    const damageMatch = desc.match(/([\d.]+)\s*(?:点)?\s*真实伤害/);
                    let damageValue = damageMatch ? parseFloat(damageMatch[1]) : null;
                    if (damageValue === null) {
                        const numberMatch = desc.match(/[\d.]+/);
                        if (numberMatch) {
                            damageValue = parseFloat(numberMatch[0]);
                        }
                    }

                    if (!isNaN(damageValue) && damageValue !== null) {
                        playerStats.裂创词条.push({
                            type: '裂创',
                            name: affix.name.trim() || '裂创',
                            damage: damageValue
                        });
                    }
                } else if (affix.name.includes('重创')) {
                    const desc = affix.description || '';
                    const damageMatch = desc.match(/([\d.]+)\s*(?:点)?\s*伤害/);
                    let damageValue = damageMatch ? parseFloat(damageMatch[1]) : null;
                    if (damageValue === null) {
                        const numberMatch = desc.match(/[\d.]+/);
                        if (numberMatch) {
                            damageValue = parseFloat(numberMatch[0]);
                        }
                    }

                    if (!isNaN(damageValue) && damageValue !== null) {
                        playerStats.重创词条.push({
                            type: '重创',
                            name: affix.name.trim() || '重创',
                            damage: damageValue
                        });
                    }
                } else if (affix.name.includes('影刃')) {
                    // 影刃默认每次攻击必定判定，不使用词条标题中的百分比
                    const normalizedChance = 100;

                    const percentMatch = affix.description.match(/([\d.]+)\s*%/);
                    const fixedMatch = affix.description.match(/([\d.]+)\s*(?:点|真实伤害)/);

                    let damageValue = null;
                    if (fixedMatch) {
                        damageValue = parseFloat(fixedMatch[1]);
                    }

                    let percentValue = null;
                    if (percentMatch) {
                        percentValue = parseFloat(percentMatch[1]);
                    }

                if (damageValue !== null || percentValue !== null) {
                    playerStats.影刃词条.push({
                        type: '影刃',
                        name: affix.name.trim() || '影刃',
                        chance: normalizedChance,
                        damage: damageValue,
                        percent: percentValue
                    });
                }
                } else if (affix.name.includes('虚无')) {
                    const desc = affix.description || '';
                    const conversionMatch = desc.match(/([\d.]+)\s*%[^%]*真实伤害/);
                    const conversionPercent = conversionMatch ? parseFloat(conversionMatch[1]) : NaN;
                    if (!isNaN(conversionPercent) && conversionPercent > 0) {
                        playerStats.虚无词条.push({
                            type: '虚无',
                            name: affix.name.trim() || '虚无',
                            chance: 100,
                            percent: conversionPercent
                        });
                    }
                } else if (affix.name.includes('重击')) {
                    const desc = affix.description || '';
                    const chanceMatch = desc.match(/([\d.]+)\s*%(?:\s*的)?\s*(?:概率|几率)/);
                    let chanceValue = chanceMatch ? parseFloat(chanceMatch[1]) : NaN;
                    if (isNaN(chanceValue) && affix.percentage) {
                        const fallbackChance = parseFloat(affix.percentage.replace(/[^\d.]/g, ''));
                        if (!isNaN(fallbackChance)) {
                            chanceValue = fallbackChance;
                        }
                    }
                    const normalizedChance = isNaN(chanceValue) ? 100 : Math.max(0, Math.min(100, chanceValue));

                    const percentDamageMatch = desc.match(/(?:造成|附加)[^%]*?([\d.]+)\s*%[^。]*当前攻击力/);
                    const percentDamageMatchAlt = desc.match(/当前攻击力[^%]*?([\d.]+)\s*%/);
                    const flatDamageMatch = desc.match(/(?:造成|附加)\s*([\d.]+)\s*(?:点)?(?:固定)?伤害/);

                    let percentValue = percentDamageMatch ? parseFloat(percentDamageMatch[1]) : NaN;
                    if (isNaN(percentValue) && percentDamageMatchAlt) {
                        percentValue = parseFloat(percentDamageMatchAlt[1]);
                    }
                    const flatValue = flatDamageMatch ? parseFloat(flatDamageMatch[1]) : NaN;
                    const hasPercent = !isNaN(percentValue);
                    const hasFlat = !isNaN(flatValue);

                    if (hasPercent || hasFlat) {
                        playerStats.重击词条.push({
                            type: '重击',
                            name: affix.name.trim() || '重击',
                            chance: normalizedChance,
                            percent: hasPercent ? percentValue : null,
                            flat: hasFlat ? flatValue : null
                        });
                    }
                } else if (affix.name.includes('残忍')) {
                    const desc = affix.description || '';
                    const chanceMatch = desc.match(/([\d.]+)\s*%[^，。,、；]*?(?:几率|概率|触发)/);
                    const triggerChance = chanceMatch ? parseFloat(chanceMatch[1]) : 100;

                    const percentEffectMatches = Array.from(desc.matchAll(/([\d.]+)\s*%[^，。,、；]*?(?:防御|护甲)/g));
                    if (percentEffectMatches.length > 0) {
                        percentEffectMatches.forEach(match => {
                            const percentValue = parseFloat(match[1]);
                            if (!isNaN(percentValue)) {
                                playerStats.残忍百分比词条.push({
                                    name: affix.name.trim() || '残忍',
                                    chance: isNaN(triggerChance) ? 100 : triggerChance,
                                    percent: percentValue
                                });
                            }
                        });
                    } else {
                        const flatMatches = Array.from(desc.matchAll(/([\d.]+)\s*(?:点)?\s*防御/g));
                        flatMatches.forEach(match => {
                            const ignoreValue = parseFloat(match[1]);
                            if (!isNaN(ignoreValue)) {
                                playerStats.残忍固定词条.push({
                                    name: affix.name.trim() || '残忍',
                                    chance: isNaN(triggerChance) ? 100 : triggerChance,
                                    value: ignoreValue
                                });
                            }
                        });
                    }
                } else if (affix.name.includes('爆发')) {
                    const triggerChance = Math.max(0, Math.min(100, parseFloat((affix.percentage || '').replace(/[^\d.]/g, '')) || 100));
                    const desc = affix.description || '';
                    const extraCritMatch = desc.match(/([\d.]+)\s*%/);
                    const extraCritChance = extraCritMatch ? Math.max(0, Math.min(100, parseFloat(extraCritMatch[1]))) : 0;
                    if (extraCritChance > 0) {
                        playerStats.爆发词条.push({
                            name: affix.name.trim() || '爆发',
                            triggerChance,
                            extraCritChance
                        });
                    }
                } else if (affix.name.includes('碎骨')) {
                    const desc = affix.description || '';
                    // 标题中的百分比仅为展示，触发概率以描述为准
                    const triggerChance = 100;
                    const effectChanceMatch = desc.match(/([\d.]+)\s*%[^，。,、；]*?(?:概率|几率)/);
                    const effectChance = effectChanceMatch ? Math.max(0, Math.min(100, parseFloat(effectChanceMatch[1]))) : 100;
                    const percentPattern = /忽略(?:敌方)?\s*([\d.]+)\s*%[^，。,、；]*?(?:防御|护甲)/;
                    const flatPattern = /忽略(?:敌方)?\s*([\d.]+)\s*(?:点)?\s*(?:防御|护甲)/;
                    const ignorePercentMatch = desc.match(percentPattern);
                    const ignoreFlatMatch = (!ignorePercentMatch) ? desc.match(flatPattern) : null;
                    const percentValue = ignorePercentMatch ? parseFloat(ignorePercentMatch[1]) : null;
                    const flatValue = ignoreFlatMatch ? parseFloat(ignoreFlatMatch[1]) : null;
                    if ((!isNaN(percentValue) && percentValue > 0) || (!isNaN(flatValue) && flatValue > 0)) {
                        playerStats.碎骨词条.push({
                            name: affix.name.trim() || '碎骨',
                            triggerChance,
                            effectChance,
                            percent: !isNaN(percentValue) ? percentValue : null,
                            flat: !isNaN(flatValue) ? flatValue : null
                        });
                    }
                } else if (affix.name.includes('冲击')) {
                    const desc = affix.description || '';
                    const thresholdMatch = desc.match(/血量(?:高于|大于|超过)?\s*([\d.]+)\s*%/);
                    const thresholdPercent = thresholdMatch ? parseFloat(thresholdMatch[1]) : null;
                    const percentPattern = /忽略(?:敌方)?\s*([\d.]+)\s*%[^，。,、；]*?(?:防御|护甲)/;
                    const flatPattern = /忽略(?:敌方)?\s*([\d.]+)\s*(?:点)?\s*(?:防御|护甲)/;
                    const percentMatch = desc.match(percentPattern);
                    const flatMatch = (!percentMatch) ? desc.match(flatPattern) : null;
                    const percentValue = percentMatch ? parseFloat(percentMatch[1]) : null;
                    const ignoreValue = flatMatch ? parseFloat(flatMatch[1]) : null;
                    if ((!isNaN(ignoreValue) && ignoreValue > 0) || (!isNaN(percentValue) && percentValue > 0)) {
                        playerStats.冲击词条.push({
                            name: affix.name.trim() || '冲击',
                            chance: 100,
                            thresholdPercent: !isNaN(thresholdPercent) ? thresholdPercent : null,
                            ignoreValue: !isNaN(ignoreValue) ? ignoreValue : null,
                            percent: !isNaN(percentValue) ? percentValue : null
                        });
                    }
                } else if (affix.name.includes('冲锋')) {
                    const desc = affix.description || '';
                    const thresholdMatch = desc.match(/血量(?:高于|大于|超过)?\s*([\d.]+)\s*%/);
                    const thresholdPercent = thresholdMatch ? parseFloat(thresholdMatch[1]) : null;
                    const bonusMatch = desc.match(/额外(?:造成)?\s*([\d.]+)\s*%[^，。,、；]*?(?:伤害|输出)/);
                    const bonusPercent = bonusMatch ? parseFloat(bonusMatch[1]) : null;
                    if (!isNaN(bonusPercent) && bonusPercent > 0) {
                        playerStats.冲锋词条.push({
                            name: affix.name.trim() || '冲锋',
                            chance: 100,
                            thresholdPercent: !isNaN(thresholdPercent) ? thresholdPercent : null,
                            bonusPercent
                        });
                    }
                } else if (affix.name.includes('收割')) {
                    const desc = affix.description || '';
                    const thresholdMatch = desc.match(/(?:血量|生命)[^，。,、；]*?(?:低于|少于|小于)\s*([\d.]+)\s*%/);
                    const thresholdPercent = thresholdMatch ? parseFloat(thresholdMatch[1]) : NaN;
                    const bonusMatch = desc.match(/额外(?:造成)?\s*([\d.]+)\s*%[^，。,、；]*?(?:伤害|输出)/);
                    const bonusPercent = bonusMatch ? parseFloat(bonusMatch[1]) : NaN;
                    let triggerChance = NaN;
                    const namePercentMatch = affix.name.match(/([\d.]+)\s*%/);
                    if (namePercentMatch) {
                        triggerChance = parseFloat(namePercentMatch[1]);
                    }
                    if ((isNaN(triggerChance) || triggerChance <= 0) && affix.percentage) {
                        const percentValue = parseFloat(affix.percentage.replace(/[^\d.]/g, ''));
                        if (!isNaN(percentValue)) {
                            triggerChance = percentValue;
                        }
                    }
                    if (isNaN(triggerChance) || triggerChance <= 0) {
                        const descChanceMatch = desc.match(/([\d.]+)\s*%[^，。,、；]*?(?:概率|几率|触发)/);
                        if (descChanceMatch) {
                            triggerChance = parseFloat(descChanceMatch[1]);
                        }
                    }
                    const normalizedChance = isNaN(triggerChance) ? 100 : Math.max(0, Math.min(100, triggerChance));
                    if (!isNaN(bonusPercent) && bonusPercent > 0 && !isNaN(thresholdPercent)) {
                        playerStats.收割词条.push({
                            name: affix.name.trim() || '收割',
                            chance: normalizedChance,
                            thresholdPercent,
                            bonusPercent
                        });
                    }
                } else if (affix.name.includes('收尾')) {
                    const desc = affix.description || '';
                    const thresholdMatch = desc.match(/(?:血量|生命)[^，。,、；]*?(?:低于|不足|少于|小于)\s*([\d.]+)\s*%/);
                    const thresholdPercent = thresholdMatch ? parseFloat(thresholdMatch[1]) : NaN;
                    const percentPattern = /忽略(?:敌方)?\s*([\d.]+)\s*%[^，。,、；]*?(?:防御|护甲)/;
                    const flatPattern = /忽略(?:敌方)?\s*([\d.]+)\s*(?:点)?\s*(?:防御|护甲)/;
                    const percentMatch = desc.match(percentPattern);
                    const flatMatch = desc.match(flatPattern);
                    const percentValue = percentMatch ? parseFloat(percentMatch[1]) : NaN;
                    const ignoreValue = flatMatch ? parseFloat(flatMatch[1]) : NaN;
                    let triggerChance = NaN;
                    const namePercentMatch = affix.name.match(/([\d.]+)\s*%/);
                    if (namePercentMatch) {
                        triggerChance = parseFloat(namePercentMatch[1]);
                    }
                    if ((isNaN(triggerChance) || triggerChance <= 0) && affix.percentage) {
                        const percentValueFromTitle = parseFloat(affix.percentage.replace(/[^\d.]/g, ''));
                        if (!isNaN(percentValueFromTitle)) {
                            triggerChance = percentValueFromTitle;
                        }
                    }
                    if (isNaN(triggerChance) || triggerChance <= 0) {
                        const descChanceMatch = desc.match(/([\d.]+)\s*%[^，。,、；]*?(?:概率|几率|触发)/);
                        if (descChanceMatch) {
                            triggerChance = parseFloat(descChanceMatch[1]);
                        }
                    }
                    const normalizedChance = isNaN(triggerChance) ? 100 : Math.max(0, Math.min(100, triggerChance));
                    if ((!isNaN(ignoreValue) && ignoreValue > 0) || (!isNaN(percentValue) && percentValue > 0)) {
                        playerStats.收尾词条.push({
                            name: affix.name.trim() || '收尾',
                            chance: normalizedChance,
                            thresholdPercent: isNaN(thresholdPercent) ? null : thresholdPercent,
                            ignoreValue: isNaN(ignoreValue) ? null : ignoreValue,
                            percent: isNaN(percentValue) ? null : percentValue
                        });
                    }
                }
            });
        });
    }

    function parseChineseNumeral(text) {
        if (!text) {
            return null;
        }
        const map = { '零': 0, '一': 1, '二': 2, '两': 2, '三': 3, '四': 4, '五': 5, '六': 6, '七': 7, '八': 8, '九': 9 };
        let total = 0;
        let current = 0;
        for (const char of text) {
            if (char === '十') {
                if (current === 0) {
                    current = 1;
                }
                total += current * 10;
                current = 0;
            } else if (Object.prototype.hasOwnProperty.call(map, char)) {
                current = map[char];
            }
        }
        total += current;
        return total || null;
    }

    function getSplitResult(player) {
        const splitAffixes = player.分裂词条 || [];
        const triggered = [];
        let extraSegments = 0;

        splitAffixes.forEach(affix => {
            const chance = Math.max(0, Math.min(100, affix.chance || 0));
            if (chance > 0 && Math.random() * 100 < chance) {
                triggered.push(affix);
                const segments = Math.max(2, affix.segments || 2);
                extraSegments += segments - 1;
            }
        });

        const totalSegments = 1 + extraSegments;

        return {
            segments: Math.max(1, totalSegments),
            triggered
        };
    }

    function formatSplitDescriptor(splitResult, segmentCount, segmentIndex, extraTags = []) {
        const ratioText = segmentCount > 1 ? `（${segmentIndex}/${segmentCount}）` : '';
        const splitNames = splitResult.triggered.map(affix => affix.name || '分裂');
        const otherTags = extraTags.filter(Boolean);
        const splitNamesText = splitNames.length > 0 ? splitNames.join(' ') : '';
        const otherTagsText = otherTags.length > 0 ? otherTags.join(' ') : '';

        let descriptor = '';
        if (ratioText) {
            descriptor += ratioText;
        }
        if (splitNamesText) {
            descriptor += splitNamesText;
        }
        if (otherTagsText) {
            descriptor = descriptor ? `${descriptor} ${otherTagsText}` : otherTagsText;
        }
        return descriptor.trim();
    }

    function parseDescriptorParts(descriptor) {
        if (!descriptor) {
            return { ratio: '', tags: [] };
        }
        let ratio = '';
        let remaining = descriptor.trim();
        const ratioMatch = remaining.match(/^（\d+\/\d+）/);
        if (ratioMatch) {
            ratio = ratioMatch[0];
            remaining = remaining.slice(ratio.length).trim();
        }

        const tags = remaining ? remaining.split(/\s+/).filter(Boolean) : [];
        return { ratio, tags };
    }

    // 战斗伤害计算
    function calculateDamage(player, monster, isCrit, options = {}) {
        const baseDamageScale = options.baseDamageScale ?? 1;
        const clampChance = (value) => {
            if (typeof value !== 'number' || isNaN(value)) {
                return 100;
            }
            return Math.max(0, Math.min(100, value));
        };
        const shouldTrigger = (chance) => {
            if (typeof chance !== 'number' || isNaN(chance)) {
                return true;
            }
            const normalized = Math.max(0, Math.min(100, chance));
            if (normalized >= 100) {
                return true;
            }
            return Math.random() * 100 < normalized;
        };
        const currentMonsterHP = typeof options.currentMonsterHP === 'number' ? options.currentMonsterHP : null;
        const maxMonsterHP = typeof options.maxMonsterHP === 'number'
            ? options.maxMonsterHP
            : (typeof monster.血量 === 'number' ? monster.血量 : null);
        const monsterHpPercent = (currentMonsterHP !== null && typeof maxMonsterHP === 'number' && maxMonsterHP > 0)
            ? (currentMonsterHP / maxMonsterHP) * 100
            : null;
        let fractureDefenseReduction = 0;
        let shockDefenseReduction = 0;
        let finisherDefenseReduction = 0;
        const triggeredEffectTags = [];
        if (Array.isArray(player.碎骨词条)) {
            player.碎骨词条.forEach(affix => {
                const percentValue = typeof affix.percent === 'number' ? affix.percent : parseFloat(affix.percent);
                const flatValue = typeof affix.flat === 'number' ? affix.flat : parseFloat(affix.flat);
                if ((isNaN(percentValue) || percentValue <= 0) && (isNaN(flatValue) || flatValue <= 0)) {
                    return;
                }
                const triggerChance = clampChance(affix.triggerChance);
                const effectChance = clampChance(affix.effectChance ?? 100);
                if (triggerChance <= 0 || effectChance <= 0) {
                    return;
                }
                if (Math.random() * 100 < triggerChance && Math.random() * 100 < effectChance) {
                    let reduction = 0;
                    if (!isNaN(percentValue) && percentValue > 0) {
                        reduction = monster.防御 * (percentValue / 100);
                    } else if (!isNaN(flatValue) && flatValue > 0) {
                        reduction = flatValue;
                    }
                    fractureDefenseReduction += reduction;
                    triggeredEffectTags.push(affix.name || '碎骨');
                }
            });
        }

        if (monsterHpPercent !== null && Array.isArray(player.冲击词条)) {
            player.冲击词条.forEach(affix => {
                const thresholdPercent = typeof affix.thresholdPercent === 'number'
                    ? affix.thresholdPercent
                    : parseFloat(affix.thresholdPercent);
                if (!isNaN(thresholdPercent) && monsterHpPercent <= thresholdPercent) {
                    return;
                }
                const ignoreValue = typeof affix.ignoreValue === 'number' ? affix.ignoreValue : parseFloat(affix.ignoreValue);
                const percentValue = typeof affix.percent === 'number' ? affix.percent : parseFloat(affix.percent);
                if ((isNaN(ignoreValue) || ignoreValue <= 0) && (isNaN(percentValue) || percentValue <= 0)) {
                    return;
                }
                if (shouldTrigger(affix.chance)) {
                    let reduction = 0;
                    if (!isNaN(percentValue) && percentValue > 0) {
                        reduction += monster.防御 * (percentValue / 100);
                    }
                    if (!isNaN(ignoreValue) && ignoreValue > 0) {
                        reduction += ignoreValue;
                    }
                    shockDefenseReduction += reduction;
                    triggeredEffectTags.push(affix.name || '冲击');
                }
            });
        }

        if (monsterHpPercent !== null && Array.isArray(player.收尾词条)) {
            player.收尾词条.forEach(affix => {
                const thresholdPercent = typeof affix.thresholdPercent === 'number'
                    ? affix.thresholdPercent
                    : parseFloat(affix.thresholdPercent);
                if (!isNaN(thresholdPercent) && monsterHpPercent > thresholdPercent) {
                    return;
                }
                const ignoreValue = typeof affix.ignoreValue === 'number' ? affix.ignoreValue : parseFloat(affix.ignoreValue);
                const percentValue = typeof affix.percent === 'number' ? affix.percent : parseFloat(affix.percent);
                if ((isNaN(ignoreValue) || ignoreValue <= 0) && (isNaN(percentValue) || percentValue <= 0)) {
                    return;
                }
                let reduction = 0;
                if (!isNaN(percentValue) && percentValue > 0) {
                    reduction += monster.防御 * (percentValue / 100);
                }
                if (!isNaN(ignoreValue) && ignoreValue > 0) {
                    reduction += ignoreValue;
                }
                finisherDefenseReduction += reduction;
                triggeredEffectTags.push(affix.name || '收尾');
            });
        }

        const baseDefense = Math.max(0, monster.防御 - player.破防 - fractureDefenseReduction - shockDefenseReduction - finisherDefenseReduction);
        const damageCurveConst = (typeof monster.承伤常数 === 'number' && monster.承伤常数 > 0)
            ? monster.承伤常数
            : 150;
        const baseDamageMultiplier = damageCurveConst / (damageCurveConst + baseDefense);
        const baseAttackDamage = baseDamageMultiplier * player.攻击;
        let baseDamage = 0;
        let preDefenseBaseDamage = 0;
        let extraDamagePortion = 0;
        const pendingExtraSegments = [];
        const pendingVoidConversions = [];
        const damageBonusMultiplier = 1
            + (player.全伤害加成 || 0)
            + (player.元素伤害加成 || 0);
        let crueltyFlatReduction = 0;
        let crueltyPercentReduction = 0;
        let critDamageMultiplier = baseDamageMultiplier;

        if (isCrit) {
            if (Array.isArray(player.残忍百分比词条)) {
                player.残忍百分比词条.forEach(affix => {
                    const percentValue = typeof affix.percent === 'number' ? affix.percent : parseFloat(affix.percent);
                    if (isNaN(percentValue) || percentValue <= 0) {
                        return;
                    }
                    if (shouldTrigger(affix.chance)) {
                        crueltyPercentReduction += monster.防御 * (percentValue / 100);
                        triggeredEffectTags.push(affix.name || '残忍');
                    }
                });
            }

            if (Array.isArray(player.残忍固定词条)) {
                player.残忍固定词条.forEach(affix => {
                    const value = typeof affix.value === 'number' ? affix.value : parseFloat(affix.value);
                    if (isNaN(value) || value <= 0) {
                        return;
                    }
                    if (shouldTrigger(affix.chance)) {
                        crueltyFlatReduction += value;
                        triggeredEffectTags.push(affix.name || '残忍');
                    }
                });
            }

            // 暴击后的防御 = 怪物防御 - 怪物防御*百分比减少 - 暴击固定减少 - 人物破防 等
            const percentRemaining = Math.max(0, 1 - (player.暴击百分比减少 || 0));
            let defenseAfterPercent = monster.防御 * percentRemaining;
            let critDefense = defenseAfterPercent - player.暴击固定减少 - player.破防 - (player.残忍减防 || 0) - crueltyFlatReduction - crueltyPercentReduction - fractureDefenseReduction - shockDefenseReduction - finisherDefenseReduction;
            critDefense = Math.max(0, critDefense);

            // 暴击承伤公式 = 承伤常数/(承伤常数+暴击后的实际防御)
            critDamageMultiplier = damageCurveConst / (damageCurveConst + critDefense);

            // 暴击时的实际伤害 = 人物攻击*人物暴击伤害*暴击承伤公式 + 暴击重击*暴击承伤公式
            const critPreDamage = player.攻击 * player.暴击伤害 + player.暴击重击;
            preDefenseBaseDamage = critPreDamage;
            baseDamage = critPreDamage * critDamageMultiplier;
        } else {
            // 不暴击时的实际伤害 = 150/(150+怪物防御-破防) * 攻击 * 不暴击减免
            const nonCritPreDamage = player.攻击 * player.不暴击减免;
            preDefenseBaseDamage = nonCritPreDamage;
            baseDamage = baseAttackDamage * player.不暴击减免;
        }

        baseDamage *= baseDamageScale;
        preDefenseBaseDamage *= baseDamageScale;

        if (player.追击词条 && player.追击词条.length > 0) {
            player.追击词条.forEach(affix => {
                const chance = Math.max(0, Math.min(100, affix.chance));
                if (Math.random() * 100 < chance) {
                    const chaseDamage = affix.damage * baseDamageMultiplier;
                    extraDamagePortion += chaseDamage;
                    pendingExtraSegments.push({
                        name: affix.name || '追击',
                        rawDamage: chaseDamage,
                        type: '追击'
                    });
                }
            });
        }

        if (player.影刃词条 && player.影刃词条.length > 0) {
            player.影刃词条.forEach(affix => {
                const chance = Math.max(0, Math.min(100, affix.chance));
                if (Math.random() * 100 < chance) {
                    let extraDamage = 0;
                    if (typeof affix.damage === 'number') {
                        extraDamage += affix.damage;
                    }
                    if (typeof affix.percent === 'number') {
                        extraDamage += player.攻击 * (affix.percent / 100);
                    }
                    extraDamagePortion += extraDamage;
                    pendingExtraSegments.push({
                        name: affix.name || '影刃',
                        rawDamage: extraDamage,
                        type: '影刃'
                    });
                }
            });
        }

        if (player.重击词条 && player.重击词条.length > 0) {
            player.重击词条.forEach(affix => {
                const chance = clampChance(affix.chance ?? 100);
                if (Math.random() * 100 < chance) {
                    let extraAttackPortion = 0;
                    if (typeof affix.flat === 'number' && !isNaN(affix.flat)) {
                        extraAttackPortion += affix.flat;
                    }
                    if (typeof affix.percent === 'number' && !isNaN(affix.percent)) {
                        extraAttackPortion += player.攻击 * (affix.percent / 100);
                    }
                    const extraDamage = extraAttackPortion * baseDamageMultiplier * baseDamageScale;
                    if (extraDamage > 0) {
                        extraDamagePortion += extraDamage;
                        pendingExtraSegments.push({
                            name: affix.name || '重击',
                            rawDamage: extraDamage,
                            type: '重击'
                        });
                    }
                }
            });
        }

        if (isCrit && player.裂创词条 && player.裂创词条.length > 0) {
            player.裂创词条.forEach(affix => {
                const extraDamage = typeof affix.damage === 'number' ? affix.damage : 0;
                if (extraDamage > 0) {
                    extraDamagePortion += extraDamage;
                    pendingExtraSegments.push({
                        name: affix.name || '裂创',
                        rawDamage: extraDamage,
                        type: '裂创'
                    });
                }
            });
        }
        if (isCrit && player.重创词条 && player.重创词条.length > 0) {
            player.重创词条.forEach(affix => {
                const extraDamage = typeof affix.damage === 'number' ? affix.damage : 0;
                if (extraDamage > 0) {
                    const scaledExtra = extraDamage * critDamageMultiplier * baseDamageScale;
                    extraDamagePortion += scaledExtra;
                    pendingExtraSegments.push({
                        name: affix.name || '重创',
                        rawDamage: scaledExtra,
                        type: '重创'
                    });
                }
            });
        }

        if (player.虚无词条 && player.虚无词条.length > 0) {
            player.虚无词条.forEach(affix => {
                const chance = clampChance(affix.chance ?? 100);
                if (chance <= 0) {
                    return;
                }
                if (Math.random() * 100 < chance) {
                    const percentValue = typeof affix.percent === 'number' ? affix.percent : parseFloat(affix.percent);
                    if (!isNaN(percentValue) && percentValue > 0) {
                        pendingVoidConversions.push({
                            name: affix.name || '虚无',
                            percent: percentValue
                        });
                    }
                }
            });
        }

        if (pendingVoidConversions.length > 0) {
            const totalConvertedPercent = Math.min(100, pendingVoidConversions
                .map(affix => typeof affix.percent === 'number' ? affix.percent : parseFloat(affix.percent))
                .reduce((sum, value) => {
                    const sanitized = isNaN(value) ? 0 : Math.max(0, value);
                    return sum + sanitized;
                }, 0));
            const remainingRatio = Math.max(0, 1 - totalConvertedPercent / 100);
            baseDamage *= remainingRatio;
        }

        const scaledBaseDamage = Math.ceil(baseDamage * damageBonusMultiplier);

        if (pendingVoidConversions.length > 0 && preDefenseBaseDamage > 0) {
            pendingVoidConversions.forEach(affix => {
                const convertedPreDamage = preDefenseBaseDamage * (affix.percent / 100);
                if (convertedPreDamage > 0) {
                    extraDamagePortion += convertedPreDamage;
                    pendingExtraSegments.push({
                        name: affix.name,
                        rawDamage: convertedPreDamage,
                        type: '虚无'
                    });
                }
            });
        }
        let executionBonusPercent = 0;
        if (monsterHpPercent !== null && Array.isArray(player.收割词条)) {
            player.收割词条.forEach(affix => {
                const thresholdPercent = typeof affix.thresholdPercent === 'number'
                    ? affix.thresholdPercent
                    : parseFloat(affix.thresholdPercent);
                if (isNaN(thresholdPercent) || monsterHpPercent > thresholdPercent) {
                    return;
                }
                const bonusPercent = typeof affix.bonusPercent === 'number'
                    ? affix.bonusPercent
                    : parseFloat(affix.bonusPercent);
                if (isNaN(bonusPercent) || bonusPercent <= 0) {
                    return;
                }
                executionBonusPercent += bonusPercent;
                triggeredEffectTags.push(affix.name || '收割');
            });
        }

        const scaledExtraDamage = Math.round(extraDamagePortion * damageBonusMultiplier);
        let totalDamage = Math.max(0, scaledBaseDamage + scaledExtraDamage);
        if (executionBonusPercent > 0) {
            totalDamage *= (1 + executionBonusPercent / 100);
            totalDamage = Math.max(0, Math.floor(totalDamage));
        }
        const triggeredChargeTags = [];
        let totalChargeBonusPercent = 0;

        if (monsterHpPercent !== null && Array.isArray(player.冲锋词条)) {
            player.冲锋词条.forEach(affix => {
                const thresholdPercent = typeof affix.thresholdPercent === 'number'
                    ? affix.thresholdPercent
                    : parseFloat(affix.thresholdPercent);
                if (!isNaN(thresholdPercent) && monsterHpPercent <= thresholdPercent) {
                    return;
                }
                const bonusPercent = typeof affix.bonusPercent === 'number' ? affix.bonusPercent : parseFloat(affix.bonusPercent);
                if (isNaN(bonusPercent) || bonusPercent <= 0) {
                    return;
                }
                if (shouldTrigger(affix.chance)) {
                    totalChargeBonusPercent += bonusPercent;
                    triggeredChargeTags.push(affix.name || '冲锋');
                }
            });
        }

        if (totalChargeBonusPercent > 0) {
            totalDamage *= (1 + totalChargeBonusPercent / 100);
            triggeredChargeTags.forEach(name => triggeredEffectTags.push(name));
            totalDamage = Math.max(0, Math.round(totalDamage));
        }

        const trueDamageDetails = pendingExtraSegments.map(segment => ({
            name: segment.name,
            damage: Math.max(0, Math.round(segment.rawDamage * damageBonusMultiplier)),
            type: segment.type
        }));

        return {
            damage: totalDamage,
            trueDamageDetails,
            extraTags: triggeredEffectTags
        };
    }

    // 模拟战斗（加入时间概念）
    function simulateBattle(player, monster, battleTime) {
        const battleLog = [];
        let monsterHP = monster.血量;
        let totalDamage = 0;
        let critCount = 0;
        let hitCount = 0;
        let missCount = 0;

        // 实际暴击率与命中率
        const actualCritRate = Math.max(0, Math.min(100, player.暴击率 - monster.抗暴率));
        const dodgeMultiplier = player.精准减闪系数 ?? 1;
        const effectiveMonsterDodge = Math.max(0, monster.闪避率 * dodgeMultiplier);
        const actualHitRate = Math.max(0, Math.min(100, player.命中率 - effectiveMonsterDodge));

        // 计算总攻击次数 = 战斗时间(秒) × 攻速
        const maxHits = Math.floor(battleTime * player.攻速);
        let killTime = 0; // 击杀所需时间（秒）

        for (let i = 0; i < maxHits && monsterHP > 0; i++) {
            const attackNumber = i + 1;
            const didHit = Math.random() * 100 < actualHitRate;
            const splitResult = getSplitResult(player);
            const segmentCount = Math.max(1, splitResult.segments || 1);
            const baseDamageScale = 1 / segmentCount;

            if (!didHit) {
                missCount++;
                const missDescriptor = formatSplitDescriptor(splitResult, segmentCount, 1);
                const missPrefix = missDescriptor ? `${missDescriptor}，` : '';
                battleLog.push(`<p>${missPrefix}攻击未命中</p>`);
                continue;
            }

            hitCount++;

            for (let segmentIndex = 0; segmentIndex < segmentCount && monsterHP > 0; segmentIndex++) {
                let segmentIsCrit = Math.random() * 100 < actualCritRate;
                const explosionTags = [];
                if (!segmentIsCrit && Array.isArray(player.爆发词条) && player.爆发词条.length > 0) {
                    for (const affix of player.爆发词条) {
                        const triggerChance = Math.max(0, Math.min(100, affix.triggerChance ?? 100));
                        const extraChance = Math.max(0, Math.min(100, affix.extraCritChance ?? 0));
                        if (extraChance <= 0 || triggerChance <= 0) {
                            continue;
                        }
                        if (Math.random() * 100 < triggerChance) {
                            if (Math.random() * 100 < extraChance) {
                                segmentIsCrit = true;
                                explosionTags.push(affix.name || '爆发');
                                break;
                            }
                        }
                    }
                }
                if (segmentIsCrit) {
                    critCount++;
                }

                const damageResult = calculateDamage(player, monster, segmentIsCrit, {
                    baseDamageScale,
                    currentMonsterHP: monsterHP,
                    maxMonsterHP: monster.血量
                });
                const damage = damageResult.damage;

                monsterHP = Math.max(0, monsterHP - damage);
                totalDamage += damage;

                // 记录击杀时间
                if (monsterHP <= 0 && killTime === 0) {
                    killTime = attackNumber / player.攻速;
                }

                const effectTags = (player.常驻显示词条 || []).map(name => name);
                if (segmentIsCrit) {
                    effectTags.push('暴击');
                }

                if (damageResult.trueDamageDetails.length > 0) {
                    damageResult.trueDamageDetails.forEach(detail => {
                        effectTags.push(detail.name);
                    });
                }
                if (damageResult.extraTags && damageResult.extraTags.length > 0) {
                    damageResult.extraTags.forEach(tag => {
                        effectTags.push(tag);
                    });
                }
                if (explosionTags.length > 0) {
                    explosionTags.forEach(tag => effectTags.push(tag));
                }

                const descriptor = formatSplitDescriptor(splitResult, segmentCount, segmentIndex + 1, effectTags);
                const { ratio, tags } = parseDescriptorParts(descriptor);
                const ratioHtml = ratio ? `<span class="split-ratio">${ratio}</span>` : '';
                const tagHtml = tags.length > 0 ? tags.map(tag => `<b>${tag}</b>`).join(' ') : '';
                const labelHtml = [ratioHtml, tagHtml].filter(Boolean).join(' ').trim();
                const prefix = labelHtml ? `${labelHtml}，` : '';
                const elementIcon = getElementIcon(player.攻击属性);
                const damageDisplay = elementIcon ? `${elementIcon}${damage}` : `${damage}`;
                const damageColor = '#e74c3c';
                battleLog.push(
                    `<p>${prefix}造成 <span class="hp" style="color: ${damageColor}; font-weight: normal;">${damageDisplay}</span> 点伤害</p>`
                );

                // 附加伤害会在描述中以标签形式展示，无需重复记录
            }
        }

        // 计算实际战斗时间和DPS
        const actualBattleTime = killTime > 0 ? killTime : battleTime;
        const dps = actualBattleTime > 0 ? Math.round(totalDamage / actualBattleTime) : 0;

        return {
            battleLog,
            totalDamage,
            hitCount,
            critCount,
            missCount,
            avgDamage: hitCount > 0 ? Math.round(totalDamage / hitCount) : 0,
            critRate: hitCount > 0 ? Math.round((critCount / hitCount) * 100 * 100) / 100 : 0,
            dps: dps,
            killTime: killTime > 0 ? killTime : null,
            remainingHP: monsterHP,
            isKilled: monsterHP <= 0
        };
    }

    // 重复战斗10次
    function simulateMultipleBattles(player, monster, battleTime, times = 10) {
        const results = [];
        let successCount = 0;
        let totalKillTime = 0;
        let killTimeCount = 0;

        for (let i = 0; i < times; i++) {
            const result = simulateBattle(player, monster, battleTime);
            results.push(result);

            if (result.isKilled) {
                successCount++;
                totalKillTime += result.killTime;
                killTimeCount++;
            }
        }

        const lastBattle = results[results.length - 1];

        return {
            winRate: Math.round((successCount / times) * 100 * 100) / 100,
            currentDPS: lastBattle.dps,
            avgKillTime: killTimeCount > 0 ? totalKillTime / killTimeCount : null,
            lastBattleLog: lastBattle.battleLog,
            lastRemainingHP: lastBattle.remainingHP,
            isKilled: lastBattle.isKilled
        };
    }

    // 主要功能：读取装备
    floatBtn.onclick = async function() {
        resultPanel.innerHTML = '<h2 style="margin: 0 0 15px 0; color: #764ba2; text-align: center;">信息读取中...</h2>';
        resultPanel.style.display = 'block';

        const userAttrs = parseUserAttrs();
        playerStats.攻击属性 = '无';
        const relicMonitor = getRelicMonitor();
        const relicResult = relicMonitor.captureAttackElement();
        const attackElementKey = relicResult.element || null;
        playerStats.攻击属性 = relicResult.elementName;
        playerStats.元素伤害加成 = attackElementKey ? (playerStats.元素伤害Map[attackElementKey] || 0) : 0;
        userAttrs['攻击属性'] = relicResult.elementName;
        if (!relicMonitor.isMonitoring) {
            relicMonitor.startMonitoring();
        }
        const equipButtons = document.querySelectorAll('.item-btn-wrap .common-btn-wrap button');
        const equipmentData = [];

        for (let i = 0; i < Math.min(equipButtons.length, 5); i++) {
            try {
                equipButtons[i].click();
                await new Promise(resolve => setTimeout(resolve, 300));
                const equipInfo = document.querySelector('.item-info-wrap .equip-info.affix');
                if (equipInfo) {
                    const equipment = parseEquipment(equipInfo);
                    equipmentData.push(equipment);
                }
                await new Promise(resolve => setTimeout(resolve, 200));
            } catch (error) {
                resultPanel.innerHTML += `<p style="text-align: center; color: #e74c3c;">读取装备 ${i + 1} 时出现错误，请稍后重试。</p>`;
            }
        }

        let resultHTML = '<h2 style="margin: 0 0 15px 0; color: #764ba2; text-align: center;">属性信息汇总</h2>';

        if (Object.keys(userAttrs).length > 0) {
            resultHTML += formatUserAttrsHTML(userAttrs);
        }

        if (equipmentData.length > 0) {
            applyEquipmentEffects(equipmentData);
            resultHTML += formatAllEquipmentHTML(equipmentData);
        } else {
            playerStats.追击伤害 = 0;
            playerStats.追击词条 = [];
            playerStats.影刃词条 = [];
            playerStats.重击词条 = [];
            playerStats.冲击词条 = [];
            playerStats.冲锋词条 = [];
            playerStats.收割词条 = [];
            playerStats.收尾词条 = [];
            resultHTML += '<p style="text-align: center; color: #e74c3c;">未找到装备信息，请确保页面已加载完成</p>';
        }

        resultHTML += `
            <button id="closeResultPanel" style="
                width: 100%;
                padding: 10px;
                background: #e74c3c;
                color: white;
                border: none;
                border-radius: 6px;
                cursor: pointer;
                font-size: 14px;
                font-weight: bold;
                margin-top: 10px;
            ">关闭</button>
        `;

        resultPanel.innerHTML = resultHTML;
        document.getElementById('closeResultPanel').onclick = () => {
            resultPanel.style.display = 'none';
        };
    };

    // 战斗模拟功能
    simulateBtn.onclick = function() {
        const html = `
            <h2 style="margin: 0 0 20px 0; color: #f5576c; text-align: center;">⚔️ 战斗模拟器</h2>

            <div style="background: #f8f9fa; padding: 15px; border-radius: 8px; margin-bottom: 20px;">
                <h3 style="margin: 0 0 10px 0; color: #495057;">怪物属性设置</h3>
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px;">
                    <div>
                        <label style="display: block; margin-bottom: 5px; color: #6c757d; font-size: 13px;">血量</label>
                        <input type="number" id="monsterHP" value="${monsterSettings.血量}" style="width: 100%; padding: 8px; border: 1px solid #ced4da; border-radius: 4px;">
                    </div>
                    <div>
                        <label style="display: block; margin-bottom: 5px; color: #6c757d; font-size: 13px;">防御</label>
                        <input type="number" id="monsterDefense" value="${monsterSettings.防御}" style="width: 100%; padding: 8px; border: 1px solid #ced4da; border-radius: 4px;">
                    </div>
                    <div>
                        <label style="display: block; margin-bottom: 5px; color: #6c757d; font-size: 13px;">闪避率(%)</label>
                        <input type="number" id="monsterDodge" value="${monsterSettings.闪避率}" style="width: 100%; padding: 8px; border: 1px solid #ced4da; border-radius: 4px;">
                    </div>
                    <div>
                        <label style="display: block; margin-bottom: 5px; color: #6c757d; font-size: 13px;">抗暴率(%)</label>
                        <input type="number" id="monsterAntiCrit" value="${monsterSettings.抗暴率}" style="width: 100%; padding: 8px; border: 1px solid #ced4da; border-radius: 4px;">
                    </div>
                    <div>
                        <label style="display: block; margin-bottom: 5px; color: #6c757d; font-size: 13px;">承伤常数</label>
                        <select id="damageCurveConstant" style="width: 100%; padding: 8px; border: 1px solid #ced4da; border-radius: 4px;">
                            <option value="150" ${monsterSettings.承伤常数 === 150 ? 'selected' : ''}>150（单人）</option>
                            <option value="200" ${monsterSettings.承伤常数 === 200 ? 'selected' : ''}>200（组队）</option>
                        </select>
                    </div>
                </div>
            </div>

            <div style="background: #fff3cd; padding: 15px; border-radius: 8px; margin-bottom: 20px;">
                <h3 style="margin: 0 0 10px 0; color: #856404;">战斗时间设置</h3>
                <div style="display: flex; gap: 10px; margin-bottom: 10px;">
                    <button class="timePreset" data-time="180" style="flex: 1; padding: 10px; background: #ffc107; color: #000; border: 2px solid #ffc107; border-radius: 4px; cursor: pointer; font-weight: bold; font-size: 14px;">3分钟</button>
                    <button class="timePreset" data-time="300" style="flex: 1; padding: 10px; background: #fff; color: #000; border: 2px solid #ffc107; border-radius: 4px; cursor: pointer; font-weight: bold; font-size: 14px;">5分钟</button>
                </div>
                <div>
                    <label style="display: block; margin-bottom: 5px; color: #856404; font-size: 13px;">自定义时间（秒）</label>
                    <input type="number" id="battleTime" value="180" style="width: 100%; padding: 8px; border: 2px solid #ffc107; border-radius: 4px;">
                </div>
            </div>

            <div style="background: #e3f2fd; padding: 15px; border-radius: 8px; margin-bottom: 20px;">
                <h3 style="margin: 0 0 10px 0; color: #1976d2;">当前人物属性</h3>
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px; font-size: 13px;">
                    <div>攻击: <strong>${playerStats.攻击}</strong></div>
                    <div>破防: <strong>${playerStats.破防}</strong></div>
                    <div>命中率: <strong>${playerStats.命中率}%</strong></div>
                    <div>暴击率: <strong>${playerStats.暴击率}%</strong></div>
                    <div>暴击伤害: <strong>${Math.round(playerStats.暴击伤害 * 100)}%</strong></div>
                    <div>攻击速度: <strong>${playerStats.攻速}</strong></div>
                    <div>全伤害加成: <strong>${Math.round(playerStats.全伤害加成 * 100)}%</strong></div>
                    <div>追击伤害(期望): <strong>${Math.round(playerStats.追击伤害 * 100) / 100}</strong></div>
                </div>
                <p style="margin: 10px 0 0 0; font-size: 12px; color: #666;">
                    提示：请先点击"读取装备"按钮读取人物属性
                </p>
            </div>

            <div style="display: flex; gap: 10px;">
                <button id="startBattle" style="
                    flex: 1;
                    padding: 12px;
                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                    color: white;
                    border: none;
                    border-radius: 6px;
                    cursor: pointer;
                    font-size: 14px;
                    font-weight: bold;
                ">开始战斗</button>
                <button id="closeSimulate" style="
                    padding: 12px 20px;
                    background: #6c757d;
                    color: white;
                    border: none;
                    border-radius: 6px;
                    cursor: pointer;
                    font-size: 14px;
                    font-weight: bold;
                ">关闭</button>
            </div>

            <div id="battleResult" style="margin-top: 20px; display: none;">
                <h3 style="color: #f5576c; border-bottom: 2px solid #f5576c; padding-bottom: 8px;">战斗结果</h3>
                <div id="battleStats" style="background: #f8f9fa; padding: 15px; border-radius: 8px; margin: 10px 0;"></div>
                <div id="battleLog" style="max-height: 300px; overflow-y: auto; background: #fff; border: 1px solid #dee2e6; border-radius: 8px; padding: 15px;"></div>
            </div>
        `;

        simulatePanel.innerHTML = html;
        simulatePanel.style.display = 'block';

        // 快捷时间设置按钮
        document.querySelectorAll('.timePreset').forEach(btn => {
            btn.onclick = function() {
                document.getElementById('battleTime').value = this.dataset.time;
                // 高亮选中的按钮
                document.querySelectorAll('.timePreset').forEach(b => {
                    b.style.background = '#fff';
                    b.style.color = '#000';
                });
                this.style.background = '#ffc107';
                this.style.color = '#000';
            };
        });

        document.getElementById('closeSimulate').onclick = () => {
            simulatePanel.style.display = 'none';
        };

        document.getElementById('startBattle').onclick = () => {
            // 保存怪物设置
            monsterSettings.血量 = parseInt(document.getElementById('monsterHP').value) || 0;
            monsterSettings.防御 = parseInt(document.getElementById('monsterDefense').value) || 0;
            monsterSettings.闪避率 = parseFloat(document.getElementById('monsterDodge').value) || 0;
            monsterSettings.抗暴率 = parseFloat(document.getElementById('monsterAntiCrit').value) || 0;
            monsterSettings.承伤常数 = parseInt(document.getElementById('damageCurveConstant').value) || 150;

            const monster = {
                血量: monsterSettings.血量,
                防御: monsterSettings.防御,
                闪避率: monsterSettings.闪避率,
                抗暴率: monsterSettings.抗暴率,
                承伤常数: monsterSettings.承伤常数
            };

            const battleTime = parseInt(document.getElementById('battleTime').value) || 180;

            if (playerStats.攻击 === 0) {
                alert('请先点击"读取装备"按钮读取人物属性！');
                return;
            }

            if (playerStats.攻速 === 0) {
                alert('攻速不能为0！');
                return;
            }

            // 重复战斗10次
            const result = simulateMultipleBattles(playerStats, monster, battleTime, 10);

            // 格式化时间显示
            const formatTime = (seconds) => {
                const mins = Math.floor(seconds / 60);
                const secs = Math.round(seconds % 60);
                return `${mins}分${secs}秒`;
            };

            const killTimeDisplay = result.avgKillTime !== null
                ? `<div style="color: #27ae60; font-size: 28px; font-weight: bold;">${formatTime(result.avgKillTime)}</div>`
                : `<div style="color: #e74c3c; font-size: 28px; font-weight: bold;">未击杀</div>`;

            const remainingHPDisplay = result.isKilled
                ? `<div style="color: #27ae60; font-size: 28px; font-weight: bold;">已击杀</div>`
                : `<div style="color: #e74c3c; font-size: 28px; font-weight: bold;">${result.lastRemainingHP}</div>`;

            const statsHTML = `
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px; text-align: center;">
                    <div style="background: #fff; padding: 15px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
                        <div style="color: #6c757d; font-size: 13px; margin-bottom: 8px;">DPS</div>
                        <div style="color: #9b59b6; font-size: 28px; font-weight: bold;">${result.currentDPS}</div>
                    </div>
                    <div style="background: #fff; padding: 15px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
                        <div style="color: #6c757d; font-size: 13px; margin-bottom: 8px;">击杀时间</div>
                        ${killTimeDisplay}
                    </div>
                    <div style="background: #fff; padding: 15px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
                        <div style="color: #6c757d; font-size: 13px; margin-bottom: 8px;">剩余血量</div>
                        ${remainingHPDisplay}
                    </div>
                    <div style="background: #fff; padding: 15px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
                        <div style="color: #6c757d; font-size: 13px; margin-bottom: 8px;">胜率</div>
                        <div style="color: #f39c12; font-size: 28px; font-weight: bold;">${result.winRate}%</div>
                    </div>
                </div>
            `;

            document.getElementById('battleStats').innerHTML = statsHTML;

            // 添加战斗日志标题
            let logHTML = '<h4 style="margin: 0 0 10px 0; color: #495057;">战斗日志 </h4>';
            logHTML += result.lastBattleLog.join('');
            document.getElementById('battleLog').innerHTML = logHTML;

            document.getElementById('battleResult').style.display = 'block';

            // 滚动到底部
            const logDiv = document.getElementById('battleLog');
            logDiv.scrollTop = logDiv.scrollHeight;
        };
    };

    /**
     * 圣物监控模块
     */
    class RelicMonitor {
        constructor() {
            this.elementMap = {
                '风灵球': 'wind',
                '风暴之核': 'wind',
                '火灵球': 'fire',
                '熔岩之核': 'fire',
                '水灵球': 'water',
                '极冰之核': 'water',
                '土灵球': 'earth',
                '撼地之核': 'earth'
            };

            this.currentRelics = [];
            this.currentElement = null;
            this.observer = null;
            this.debug = true;
            this.isMonitoring = false;
        }

        log() {
            // 控制台输出已禁用，保留钩子方便扩展
        }

        readRelics() {
            const panels = document.querySelectorAll('.btn-wrap.item-btn-wrap');
            if (panels.length < 3) {
                return [];
            }

            const relicPanel = panels[2];
            const buttons = relicPanel.querySelectorAll('.common-btn');
            const relics = [];

            buttons.forEach((button) => {
                const span = button.querySelector('span[data-v-f49ac02d]');
                if (span) {
                    const text = span.textContent.trim();
                    if (text && text !== '(未携带)') {
                        let relicName = text.replace(/[🌪️🔥💧⛰️]/g, '').trim();
                        relicName = relicName.replace(/\[\d+\]$/, '').trim();
                        relics.push(relicName);
                    }
                }
            });

            return relics;
        }

        determineElement(relics) {
            const elementCount = {
                wind: 0,
                fire: 0,
                water: 0,
                earth: 0
            };

            const elementRelics = {
                wind: [],
                fire: [],
                water: [],
                earth: []
            };

            relics.forEach((relic) => {
                const element = this.elementMap[relic];
                if (element) {
                    elementCount[element] += 1;
                    elementRelics[element].push(relic);
                }
            });

            let maxCount = 0;
            let candidates = [];

            for (const [element, count] of Object.entries(elementCount)) {
                if (count > maxCount) {
                    maxCount = count;
                    candidates = [element];
                } else if (count === maxCount && count > 0) {
                    candidates.push(element);
                }
            }

            if (maxCount === 0) {
                return null;
            }

            if (candidates.length === 1) {
                return candidates[0];
            }

            return this.compareElementBonus(candidates, elementRelics);
        }

        compareElementBonus(candidates) {
            const bonusData = this.getElementBonus();
            let maxBonus = -1;
            let bestElement = candidates[0];

            for (const element of candidates) {
                const bonus = bonusData[element] || 0;
                if (bonus > maxBonus) {
                    maxBonus = bonus;
                    bestElement = element;
                }
            }

            return bestElement;
        }

        getElementBonus() {
            const bonus = {
                wind: 0,
                fire: 0,
                water: 0,
                earth: 0
            };

            try {
                const userAttrs = document.querySelector('.user-attrs');
                const textWrap = userAttrs ? userAttrs.querySelector('.text-wrap') : null;
                if (!textWrap) {
                    return bonus;
                }

                const paragraphs = textWrap.querySelectorAll('p');
                paragraphs.forEach((p) => {
                    const text = p.textContent.trim();
                    if (text.includes('风伤害加成：')) {
                        const match = text.match(/风伤害加成：([\d.]+)%/);
                        if (match) {
                            bonus.wind = parseFloat(match[1]);
                        }
                    } else if (text.includes('火伤害加成：')) {
                        const match = text.match(/火伤害加成：([\d.]+)%/);
                        if (match) {
                            bonus.fire = parseFloat(match[1]);
                        }
                    } else if (text.includes('水伤害加成：')) {
                        const match = text.match(/水伤害加成：([\d.]+)%/);
                        if (match) {
                            bonus.water = parseFloat(match[1]);
                        }
                    } else if (text.includes('土伤害加成：')) {
                        const match = text.match(/土伤害加成：([\d.]+)%/);
                        if (match) {
                            bonus.earth = parseFloat(match[1]);
                        }
                    }
                });
            } catch (error) {
                // 静默失败，确保主逻辑不中断
            }

            return bonus;
        }

        checkRelicChanges(newRelics) {
            const added = newRelics.filter((r) => !this.currentRelics.includes(r));
            const removed = this.currentRelics.filter((r) => !newRelics.includes(r));

            return {
                hasChanged: added.length > 0 || removed.length > 0,
                added,
                removed,
                current: newRelics
            };
        }

        update() {
            const newRelics = this.readRelics();
            const changes = this.checkRelicChanges(newRelics);

            if (!changes.hasChanged) {
                return;
            }

            this.currentRelics = newRelics;
            const newElement = this.determineElement(newRelics);

            if (newElement !== this.currentElement) {
                this.currentElement = newElement;
                this.onElementChange(newElement);
            }

            this.onRelicChange(changes);
        }

        onRelicChange() {
            // 供外部覆盖
        }

        onElementChange() {
            // 供外部覆盖
        }

        startMonitoring() {
            this.currentRelics = this.readRelics();
            this.currentElement = this.determineElement(this.currentRelics);

            const targetNode = document.querySelector('.equip-list');
            if (!targetNode) {
                return;
            }

            const config = {
                childList: true,
                subtree: true,
                attributes: true,
                attributeFilter: ['class', 'style']
            };

            this.observer = new MutationObserver(() => {
                this.update();
            });
            this.observer.observe(targetNode, config);
            this.isMonitoring = true;
        }

        stopMonitoring() {
            if (this.observer) {
                this.observer.disconnect();
                this.observer = null;
            }
            this.isMonitoring = false;
        }

        getStatus() {
            return {
                relics: this.currentRelics,
                element: this.currentElement,
                elementName: this.getElementName(this.currentElement)
            };
        }

        getElementName(element) {
            const names = {
                wind: '风属性',
                fire: '火属性',
                water: '水属性',
                earth: '土属性'
            };
            return element ? names[element] : '无';
        }

        test() {
            return this.captureAttackElement();
        }

        captureAttackElement() {
            const relics = this.readRelics();
            const element = this.determineElement(relics);
            return { relics, element, elementName: this.getElementName(element) };
        }
    }

    function getRelicMonitor() {
        if (!window.relicMonitor || typeof window.relicMonitor.captureAttackElement !== 'function') {
            window.relicMonitor = new RelicMonitor();
        }
        return window.relicMonitor;
    }

})();
