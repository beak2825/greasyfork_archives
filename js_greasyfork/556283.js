// ==UserScript==
// @name         Battle Simulation beta
// @namespace    http://tampermonkey.net/
// @version      1.10
// @description  读取装备信息并模拟战斗
// @author       Lunaris
// @match        https://aring.cc/awakening-of-war-soul-ol/
// @grant        none
// @icon        https://aring.cc/awakening-of-war-soul-ol/favicon.ico
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/556283/Battle%20Simulation%20beta.user.js
// @updateURL https://update.greasyfork.org/scripts/556283/Battle%20Simulation%20beta.meta.js
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
        承伤系数: 200,
        战斗时间: 180,
        traits: [],
        selectedPresetKey: ''
    };

    // 调试函数：暴露到全局作用域
    window.debugBattleSimulator = function() {
        console.log('=== 战斗模拟器调试信息 ===');
        console.log('怪物设置:', monsterSettings);
        console.log('玩家属性:', playerStats);
        if (monsterSettings.traits && monsterSettings.traits.length > 0) {
            console.log('怪物词条详情:');
            monsterSettings.traits.forEach(trait => {
                console.log(`  - ${trait.name}:`, trait);
            });
        }
    };

    const monsterTraitDefinitions = {
        burningGuard: {
            name: '灼烧',
            desc: '特效大于 2 个时，免疫50%伤害',
            unit: '%',
            effect: 'burningGuard',
            defaultValue: 50,
            minTags: 3
        },
        devour: {
            name: '吞噬',
            desc: '防御高于阈值时免疫部分伤害',
            unit: '%',
            effect: 'devour',
            defaultValue: 50,
            threshold: 100
        },
        intimidate: {
            name: '恐吓',
            desc: '降低玩家破防百分比',
            unit: '%',
            effect: 'intimidate',
            defaultValue: 30
        },
        curse: {
            name: '诅咒',
            desc: '降低玩家命中率百分比',
            unit: '%',
            effect: 'curseAccuracy',
            defaultValue: 25
        },
        fearless: {
            name: '无畏',
            desc: '血量高于70%时，增加100防御',
            unit: '',
            effect: 'fearless',
            defaultValue: 100,
            threshold: 70
        },
        suppress: {
            name: '镇压',
            desc: '受到暴击时，免疫70%的伤害',
            unit: '%',
            effect: 'suppress',
            defaultValue: 70
        },
        weaken: {
            name: '虚弱',
            desc: '降低玩家攻击百分比',
            unit: '%',
            effect: 'weaken',
            defaultValue: 50
        },
        sacredArmor: {
            name: '神圣铠甲',
            desc: '血量低于30%时，免疫真实伤害以外所有伤害',
            unit: '%',
            effect: 'sacredArmor',
            defaultValue: 30,
            threshold: 30
        },
        willpower: {
            name: '意志',
            desc: '血量低于10%时，增加50%抗暴率',
            unit: '%',
            effect: 'willpower',
            defaultValue: 50,
            threshold: 10
        },
        paralysis: {
            name: '麻痹',
            desc: '受到非暴击攻击时，免疫70%的伤害',
            unit: '%',
            effect: 'paralysis',
            defaultValue: 70
        },
        repair: {
            name: '修复',
            desc: '血量低于10%时，免疫一次伤害并恢复30%血量（仅一次）',
            unit: '%',
            effect: 'repair',
            defaultValue: 30,
            threshold: 10
        },
        counter: {
            name: '反击',
            desc: '受到多段攻击时，免疫30%的伤害',
            unit: '%',
            effect: 'counter',
            defaultValue: 30
        }
    };


    const monsterPresets = [
        {
            key: 'wildBull',
            name: '蛮牛',
            stats: {
                血量: 0,
                防御: 0,
                闪避率: 0,
                抗暴率: 0,
                承伤系数: 200
            },
            traits: [
                { key: 'fearless', value: 100, threshold: 70, name: '无畏' },
                { key: 'suppress', value: 70, name: '镇压' }
            ]
        },
        {
            key: 'blazingSprite',
            name: '烈火精灵',
            stats: {
                血量: 0,
                防御: 0,
                闪避率: 0,
                抗暴率: 0,
                承伤系数: 200
            },
            traits: [
                { key: 'burningGuard', value: 70, minTags: 3, name: '灼烧' }
            ]
        },
        {
            key: 'wyvern',
            name: '飞龙',
            stats: {
                血量: 0,
                防御: 0,
                闪避率: 0,
                抗暴率: 0,
                承伤系数: 200
            },
            traits: [
                { key: 'devour', value: 50, name: '吞噬', threshold: 100 },
                { key: 'intimidate', value: 30, name: '恐吓' }
            ]
        },
        {
            key: 'dreadKnight',
            name: '恐怖骑士',
            stats: {
                血量: 0,
                防御: 0,
                闪避率: 0,
                抗暴率: 0,
                承伤系数: 200
            },
            traits: [
                { key: 'curse', value: 25, name: '诅咒' },
                { key: 'intimidate', value: 35, name: '恐吓' }
            ]
        },
        {
            key: 'fireSprite',
            name: '火精灵',
            stats: {
                血量: 0,
                防御: 0,
                闪避率: 0,
                抗暴率: 0,
                承伤系数: 200
            },
            traits: [
                { key: 'burningGuard', value: 50, minTags: 3, name: '灼烧' }
            ]
        },
        {
            key: 'tricksterWizard',
            name: '诡诈巫师',
            stats: {
                血量: 0,
                防御: 0,
                闪避率: 0,
                抗暴率: 0,
                承伤系数: 200
            },
            traits: [
                { key: 'suppress', value: 90, name: '镇压' }
            ]
        },
        {
            key: 'manticore',
            name: '蝎狮',
            stats: {
                血量: 0,
                防御: 0,
                闪避率: 0,
                抗暴率: 0,
                承伤系数: 200
            },
            traits: [
                { key: 'weaken', value: 50, name: '虚弱' }
            ]
        },
        {
            key: 'titan',
            name: '泰坦',
            stats: {
                血量: 0,
                防御: 0,
                闪避率: 0,
                抗暴率: 0,
                承伤系数: 200
            },
            traits: [
                { key: 'sacredArmor', value: 30, threshold: 30, name: '神圣铠甲' },
                { key: 'willpower', value: 50, threshold: 10, name: '意志' },
                { key: 'paralysis', value: 70, name: '麻痹' }
            ]
        },
        {
            key: 'evilKing',
            name: '邪神王',
            stats: {
                血量: 0,
                防御: 0,
                闪避率: 0,
                抗暴率: 0,
                承伤系数: 200
            },
            traits: [
                { key: 'repair', value: 30, threshold: 10, name: '修复' },
                { key: 'counter', value: 30, name: '反击' }
            ]
        }
    ];


    // 按名称长度优先，其次按首字母排序
    monsterPresets.sort((a, b) => {
        const lenDiff = (a.name?.length || 0) - (b.name?.length || 0);
        if (lenDiff !== 0) {
            return lenDiff;
        }
        return (a.name || '').localeCompare(b.name || '');
    });

    function normalizeMonsterTrait(trait) {
        if (!trait || !trait.key) {
            return null;
        }
        const definition = monsterTraitDefinitions[trait.key] || {};
        const parsedValue = typeof trait.value === 'number' ? trait.value : parseFloat(trait.value);
        const value = !isNaN(parsedValue) ? parsedValue : (definition.defaultValue ?? 0);
        const parsedMinTags = typeof trait.minTags === 'number' ? trait.minTags : parseInt(trait.minTags, 10);
        const parsedThreshold = typeof trait.threshold === 'number' ? trait.threshold : parseFloat(trait.threshold);
        return {
            key: trait.key,
            name: trait.name || definition.name || '特性',
            value,
            unit: trait.unit || definition.unit || '',
            desc: trait.desc || definition.desc || '',
            effect: trait.effect || definition.effect || 'none',
            minTags: !isNaN(parsedMinTags) ? parsedMinTags : (definition.minTags ?? 0),
            threshold: !isNaN(parsedThreshold) ? parsedThreshold : (definition.threshold ?? null)
        };
    }

    function applyMonsterTraitEffects(monster) {
        const effects = {
            hpPercent: 0,
            defensePercent: 0,
            dodgeBonus: 0,
            antiCritBonus: 0,
            damageTakenMultiplier: 1,
            intimidatePercent: 0,
            accuracyPenaltyPercent: 0,
            devour: null,
            fearless: null,
            suppress: null
        };

        const normalizedTraits = Array.isArray(monster.traits)
            ? monster.traits.map(normalizeMonsterTrait).filter(Boolean)
            : [];

        normalizedTraits.forEach(trait => {
            switch (trait.effect) {
                case 'hpPercent':
                    effects.hpPercent += trait.value;
                    break;
                case 'defensePercent':
                    effects.defensePercent += trait.value;
                    break;
                case 'dodgeBonus':
                    effects.dodgeBonus += trait.value;
                    break;
                case 'antiCritBonus':
                    effects.antiCritBonus += trait.value;
                    break;
                case 'damageReduction': {
                    const multiplier = Math.max(0, 1 - trait.value / 100);
                    effects.damageTakenMultiplier *= multiplier;
                    break;
                }
                case 'intimidate':
                    effects.intimidatePercent += trait.value;
                    effects.intimidateName = trait.name || monsterTraitDefinitions[trait.key]?.name || '恐吓';
                    break;
                case 'curseAccuracy':
                    effects.accuracyPenaltyPercent += trait.value;
                    effects.accuracyPenaltyName = trait.name || monsterTraitDefinitions[trait.key]?.name || '诅咒';
                    break;
                case 'devour':
                    effects.devour = {
                        value: Math.max(0, trait.value),
                        threshold: typeof trait.threshold === 'number' ? trait.threshold : (monsterTraitDefinitions[trait.key]?.threshold ?? 0),
                        name: trait.name
                    };
                    break;
                case 'fearless':
                    effects.fearless = {
                        value: Math.max(0, trait.value),
                        threshold: typeof trait.threshold === 'number' ? trait.threshold : (monsterTraitDefinitions[trait.key]?.threshold ?? 80),
                        name: trait.name
                    };
                    break;
                case 'suppress':
                    effects.suppress = {
                        value: Math.max(0, Math.min(100, trait.value)),
                        name: trait.name
                    };
                    break;
                case 'weaken':
                    effects.weaken = {
                        value: Math.max(0, Math.min(100, trait.value)),
                        name: trait.name
                    };
                    break;
                case 'sacredArmor':
                    effects.sacredArmor = {
                        threshold: typeof trait.threshold === 'number' ? trait.threshold : (monsterTraitDefinitions[trait.key]?.threshold ?? 30),
                        name: trait.name
                    };
                    break;
                case 'willpower':
                    effects.willpower = {
                        value: Math.max(0, trait.value),
                        threshold: typeof trait.threshold === 'number' ? trait.threshold : (monsterTraitDefinitions[trait.key]?.threshold ?? 10),
                        name: trait.name
                    };
                    break;
                case 'paralysis':
                    effects.paralysis = {
                        value: Math.max(0, Math.min(100, trait.value)),
                        name: trait.name
                    };
                    break;
                case 'repair':
                    effects.repair = {
                        value: Math.max(0, trait.value),
                        threshold: typeof trait.threshold === 'number' ? trait.threshold : (monsterTraitDefinitions[trait.key]?.threshold ?? 10),
                        name: trait.name
                    };
                    break;
                case 'counter':
                    effects.counter = {
                        value: Math.max(0, Math.min(100, trait.value)),
                        name: trait.name
                    };
                    break;
                default:
                    break;
            }
        });

        const enhanced = { ...monster };
        enhanced.traits = normalizedTraits;
        enhanced.血量 = Math.max(0, Math.round(monster.血量 * (1 + effects.hpPercent / 100)));
        enhanced.防御 = Math.max(0, Math.round(monster.防御 * (1 + effects.defensePercent / 100)));
        enhanced.闪避率 = Math.max(0, (monster.闪避率 || 0) + effects.dodgeBonus);
        // 抗暴率允许为负，从而提升玩家暴击率（不做下限截断）
        enhanced.抗暴率 = (monster.抗暴率 || 0) + effects.antiCritBonus;
        enhanced.traitDamageMultiplier = Math.max(0, effects.damageTakenMultiplier);
        enhanced.traitBurningGuard = normalizedTraits.find(trait => trait.effect === 'burningGuard') || null;
        enhanced.traitIntimidatePercent = Math.max(0, effects.intimidatePercent);
        enhanced.traitIntimidateName = effects.intimidateName || null;
        enhanced.traitAccuracyPenaltyPercent = Math.max(0, effects.accuracyPenaltyPercent);
        enhanced.traitAccuracyPenaltyName = effects.accuracyPenaltyName || null;
        enhanced.traitDevour = effects.devour;
        enhanced.traitFearless = effects.fearless;
        enhanced.traitSuppress = effects.suppress;
        enhanced.traitWeaken = effects.weaken;
        enhanced.traitSacredArmor = effects.sacredArmor;
        enhanced.traitWillpower = effects.willpower;
        enhanced.traitParalysis = effects.paralysis;
        enhanced.traitRepair = effects.repair;
        enhanced.traitRepairUsed = false;
        enhanced.traitCounter = effects.counter;
        return enhanced;
    }

    function getMonsterPresetByKey(key) {
        return monsterPresets.find(preset => preset.key === key);
    }

    function getMonsterSettingsFromPreset(key) {
        const preset = getMonsterPresetByKey(key);
        if (!preset) {
            return null;
        }
        return {
            ...preset.stats,
            traits: (preset.traits || []).map(trait => normalizeMonsterTrait(trait))
        };
    }

    // 创建悬浮按钮
    const panelState = {
        isLoading: false,
        isReady: false,
        userAttrs: {},
        equipmentData: []
    };

    const helperPanelState = {
        hasData: false,
        isMinimized: false,
        isClosed: false
    };

    const helperPanel = document.createElement('div');
    helperPanel.style.cssText = `
        position: fixed;
        right: 16px;
        width: min(160px, 92vw);
        background: rgba(5, 6, 10, 0.95);
        border: 1px solid rgba(255,255,255,0.08);
        border-radius: 14px;
        box-shadow: 0 8px 24px rgba(0,0,0,0.45);
        padding: 14px;
        color: #f5f6ff;
        font-family: Arial, sans-serif;
        font-size: 12px;
        line-height: 1.4;
        z-index: 99998;
        backdrop-filter: blur(8px);
    `;

    function setHelperPanelCompact(compact) {
        if (compact) {
            helperPanel.style.top = '50%';
            helperPanel.style.bottom = 'auto';
            helperPanel.style.transform = 'translateY(-50%)';
        } else {
            helperPanel.style.top = 'auto';
            helperPanel.style.bottom = '16px';
            helperPanel.style.transform = 'none';
        }
    }

    const panelHeader = document.createElement('div');
    panelHeader.style.cssText = `
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-bottom: 10px;
    `;
    const panelTitle = document.createElement('span');
    panelTitle.textContent = '战斗模拟';
    panelTitle.style.cssText = `
        font-size: 12px;
        letter-spacing: 1px;
        color: #d1d8ff;
    `;
    const panelActions = document.createElement('div');
    panelActions.style.cssText = 'display: flex; gap: 6px;';

    const minimizePanelBtn = document.createElement('button');
    minimizePanelBtn.textContent = '━';
    minimizePanelBtn.style.cssText = `
        width: 28px;
        height: 28px;
        border-radius: 999px;
        border: 1px solid rgba(255,255,255,0.15);
        background: rgba(255,255,255,0.04);
        color: #f5f6ff;
        cursor: pointer;
        font-size: 14px;
        line-height: 1;
    `;

    const closePanelBtn = document.createElement('button');
    closePanelBtn.textContent = '×';
    closePanelBtn.style.cssText = `
        width: 28px;
        height: 28px;
        border-radius: 999px;
        border: 1px solid rgba(255,255,255,0.15);
        background: rgba(240,96,96,0.18);
        color: #ffbaba;
        cursor: pointer;
        font-size: 16px;
        line-height: 1;
    `;

    panelActions.appendChild(minimizePanelBtn);
    panelActions.appendChild(closePanelBtn);
    panelHeader.appendChild(panelTitle);
    panelHeader.appendChild(panelActions);

    const panelBody = document.createElement('div');
    panelBody.style.cssText = `
        display: flex;
        flex-direction: column;
    `;

    const mainActionBtn = document.createElement('button');
    mainActionBtn.textContent = '加载战斗模拟';
    mainActionBtn.style.cssText = `
        width: 100%;
        background: linear-gradient(135deg, #364269 0%, #7151d8 100%);
        border: none;
        border-radius: 10px;
        padding: 10px 12px;
        font-size: 13px;
        font-weight: bold;
        color: #fff;
        cursor: pointer;
        transition: transform 0.2s ease;
        box-shadow: 0 6px 16px rgba(0,0,0,0.35);
    `;
    mainActionBtn.onmouseover = () => {
        if (!panelState.isLoading) {
            mainActionBtn.style.transform = 'scale(1.02)';
        }
    };
    mainActionBtn.onmouseout = () => mainActionBtn.style.transform = 'scale(1)';

    const statusHint = document.createElement('div');
    statusHint.style.cssText = `
        margin-top: 6px;
        font-size: 11px;
        color: #8f9bc4;
        text-align: center;
        display: none;
        cursor: default;
    `;

    const reopenPanelBtn = document.createElement('button');
    reopenPanelBtn.textContent = '打开战斗助手';
    reopenPanelBtn.style.cssText = `
        position: fixed;
        right: 16px;
        bottom: 16px;
        padding: 6px 14px;
        border-radius: 20px;
        border: 1px solid rgba(255,255,255,0.2);
        background: rgba(5,6,10,0.9);
        color: #d1d8ff;
        font-size: 12px;
        cursor: pointer;
        z-index: 99998;
        display: none;
    `;

    function updateHelperPanelVisibility() {
        if (helperPanelState.isClosed) {
            if (helperPanel.parentElement) {
                helperPanel.remove();
            }
            if (reopenPanelBtn.parentElement) {
                reopenPanelBtn.remove();
            }
            return;
        }

        if (helperPanelState.isMinimized) {
            helperPanel.style.display = 'none';
            if (!reopenPanelBtn.parentElement) {
                document.body.appendChild(reopenPanelBtn);
            }
            reopenPanelBtn.style.display = 'block';
            return;
        }

        if (!helperPanel.parentElement) {
            document.body.appendChild(helperPanel);
        }
        helperPanel.style.display = 'block';
        panelBody.style.display = 'flex';
        reopenPanelBtn.style.display = 'none';
        minimizePanelBtn.textContent = '━';
        setHelperPanelCompact(!helperPanelState.hasData);
    }

    minimizePanelBtn.onclick = (event) => {
        event.stopPropagation();
        if (helperPanelState.isClosed) return;
        helperPanelState.isMinimized = true;
        updateHelperPanelVisibility();
    };

    closePanelBtn.onclick = (event) => {
        event.stopPropagation();
        helperPanelState.isClosed = true;
        updateHelperPanelVisibility();
    };

    reopenPanelBtn.onclick = () => {
        if (helperPanelState.isClosed) return;
        helperPanelState.isMinimized = false;
        updateHelperPanelVisibility();
    };

    const personalSection = document.createElement('div');
    personalSection.style.cssText = `
        margin-top: 14px;
        border: 1px solid rgba(255,255,255,0.08);
        border-radius: 10px;
        padding: 10px;
        background: rgba(255,255,255,0.03);
        display: none;
    `;
    const personalTitle = document.createElement('div');
    personalTitle.textContent = '个人属性';
    personalTitle.style.cssText = `
        font-weight: bold;
        margin-bottom: 6px;
        font-size: 12px;
        color: #d1d8ff;
    `;
    const personalContent = document.createElement('div');
    personalContent.style.cssText = `
        display: flex;
        flex-direction: column;
        gap: 6px;
    `;
    personalSection.appendChild(personalTitle);
    personalSection.appendChild(personalContent);

    const equipmentSection = document.createElement('div');
    equipmentSection.style.cssText = `
        margin-top: 12px;
        border: 1px solid rgba(255,255,255,0.08);
        border-radius: 10px;
        padding: 10px;
        background: rgba(255,255,255,0.02);
        display: none;
    `;
    const equipmentToggle = document.createElement('button');
    equipmentToggle.textContent = '装备词条';
    equipmentToggle.style.cssText = `
        width: 100%;
        background: none;
        border: none;
        color: #f5f6ff;
        font-size: 12px;
        font-weight: bold;
        display: flex;
        justify-content: space-between;
        align-items: center;
        cursor: pointer;
        padding: 0;
    `;
    const toggleIcon = document.createElement('span');
    toggleIcon.textContent = '▼';
    toggleIcon.style.cssText = 'font-size: 11px; color: #8aa4ff;';
    equipmentToggle.appendChild(toggleIcon);

    const equipmentContent = document.createElement('div');
    equipmentContent.style.cssText = `
        margin-top: 8px;
        overflow: hidden;
        max-height: 0;
        opacity: 0;
        transition: max-height 0.25s ease, opacity 0.25s ease;
    `;

    let equipmentExpanded = false;
    equipmentToggle.onclick = () => {
        equipmentExpanded = !equipmentExpanded;
        toggleIcon.textContent = equipmentExpanded ? '▲' : '▼';
        if (equipmentExpanded) {
            equipmentContent.style.maxHeight = equipmentContent.scrollHeight + 'px';
            equipmentContent.style.opacity = '1';
        } else {
            equipmentContent.style.maxHeight = '0px';
            equipmentContent.style.opacity = '0';
        }
    };

    equipmentSection.appendChild(equipmentToggle);
    equipmentSection.appendChild(equipmentContent);

    panelBody.appendChild(mainActionBtn);
    panelBody.appendChild(statusHint);
    panelBody.appendChild(personalSection);
    panelBody.appendChild(equipmentSection);

    helperPanel.appendChild(panelHeader);
    helperPanel.appendChild(panelBody);
    document.body.appendChild(helperPanel);
    document.body.appendChild(reopenPanelBtn);
    updateHelperPanelVisibility();

    const simulatePanel = document.createElement('div');
    simulatePanel.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        z-index: 99999;
        width: min(420px, 94vw);
        max-height: 84vh;
        overflow-y: auto;
        background: rgba(7, 9, 14, 0.98);
        border-radius: 14px;
        border: 1px solid rgba(255,255,255,0.08);
        box-shadow: 0 20px 40px rgba(0,0,0,0.55);
        display: none;
        padding: 22px;
        font-family: Arial, sans-serif;
        color: #f5f6ff;
    `;
    document.body.appendChild(simulatePanel);

    // 解析人物基本属性
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
    function buildPersonalAttrHTML(attrs) {
        const entries = Object.entries(attrs || {});
        if (entries.length === 0) {
            return '<div style="color: #8f9bc4; font-size: 11px;">暂未读取到属性，请在角色界面触发</div>';
        }

        return entries.map(([key, value]) => `
            <div style="
                display: flex;
                justify-content: space-between;
                align-items: center;
                font-size: 11px;
                padding: 4px 6px;
                border-radius: 6px;
                background: rgba(255,255,255,0.03);
                border: 1px solid rgba(255,255,255,0.04);
            ">
                <span style="color: #9ea8d5;">${key}</span>
                <span style="color: #f5f6ff; font-weight: bold;">${value}</span>
            </div>
        `).join('');
    }

    function buildEquipmentTraitsHTML(equipmentData) {
        if (!equipmentData || equipmentData.length === 0) {
            return '<div style="color: #8f9bc4; font-size: 9px;">暂无装备词条</div>';
        }

        let entries = [];
        equipmentData.forEach(eq => {
            entries = entries.concat(
                (eq.affixes || []).map(affix => ({
                    type: 'affix',
                    name: affix.name || '',
                    chance: affix.percentage || '',
                    description: affix.description || ''
                }))
            );
            entries = entries.concat(
                (eq.specialAttrs || []).map(attr => ({
                    type: 'special',
                    description: attr
                }))
            );
        });

        if (entries.length === 0) {
            return '<div style="color: #8f9bc4; font-size: 9px;">暂未检测到可展示的词条</div>';
        }

        return entries.map(entry => {
            if (entry.type === 'special') {
                return `
                    <div style="
                        padding: 6px;
                        border-radius: 8px;
                        margin-bottom: 6px;
                        background: rgba(255,255,255,0.03);
                        border: 1px dashed rgba(255,255,255,0.1);
                        font-size: 9px;
                        color: #ffe3a7;
                    ">${entry.description}</div>
                `;
            }
            const triggerRate = entry.chance ? entry.chance : '100%';
            return `
                <div style="
                    padding: 6px;
                    border-radius: 8px;
                    margin-bottom: 6px;
                    background: rgba(255,255,255,0.02);
                    border: 1px solid rgba(122,145,255,0.3);
                    font-size: 9px;
                ">
                    <div style="display: flex; justify-content: space-between; font-weight: bold; color: #9fb4ff;">
                        <span>${entry.name}</span>
                        <span>${triggerRate}</span>
                    </div>
                    <div style="margin-top: 4px; color: #d7dbff;">${entry.description}</div>
                </div>
            `;
        }).join('');
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

        const intimidateMultiplier = Math.max(0, 1 - (monster.traitIntimidatePercent || 0) / 100);
        const effectiveBreak = Math.max(0, player.破防 * intimidateMultiplier);

        // 无畏特性：血量高于阈值时增加防御
        let fearlessDefenseBonus = 0;
        if (monster.traitFearless && monsterHpPercent !== null) {
            const threshold = monster.traitFearless.threshold || 80;
            if (monsterHpPercent > threshold) {
                fearlessDefenseBonus = monster.traitFearless.value || 0;
                triggeredEffectTags.push(monster.traitFearless.name || '无畏');
            }
        }

        const baseDefense = Math.max(0, monster.防御 + fearlessDefenseBonus - effectiveBreak - fractureDefenseReduction - shockDefenseReduction - finisherDefenseReduction);
        const damageCurveConst = (typeof monster.承伤系数 === 'number' && monster.承伤系数 > 0)
            ? monster.承伤系数
            : 150;
        const baseDamageMultiplier = damageCurveConst / (damageCurveConst + baseDefense);

        // 虚弱特性：降低玩家攻击力
        let effectiveAttack = player.攻击;
        if (monster.traitWeaken) {
            const reduction = Math.max(0, Math.min(100, monster.traitWeaken.value || 0));
            const weakenMultiplier = Math.max(0, 1 - reduction / 100);
            effectiveAttack = Math.max(0, player.攻击 * weakenMultiplier);
            if (reduction > 0) {
                triggeredEffectTags.push(monster.traitWeaken.name || '虚弱');
            }
        }

        const baseAttackDamage = baseDamageMultiplier * effectiveAttack;
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
        let defenseForDevour = baseDefense;

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
            let defenseAfterPercent = (monster.防御 + fearlessDefenseBonus) * percentRemaining;
            let critDefense = defenseAfterPercent - player.暴击固定减少 - effectiveBreak - (player.残忍减防 || 0) - crueltyFlatReduction - crueltyPercentReduction - fractureDefenseReduction - shockDefenseReduction - finisherDefenseReduction;
            critDefense = Math.max(0, critDefense);
            defenseForDevour = critDefense;

            // 暴击承伤公式 = 承伤系数/(承伤系数+暴击后的实际防御)
            critDamageMultiplier = damageCurveConst / (damageCurveConst + critDefense);

            // 暴击时的实际伤害 = 有效攻击*人物暴击伤害*暴击承伤公式 + 暴击重击*暴击承伤公式
            const critPreDamage = effectiveAttack * player.暴击伤害 + player.暴击重击;
            preDefenseBaseDamage = critPreDamage;
            baseDamage = critPreDamage * critDamageMultiplier;
        } else {
            // 不暴击时的实际伤害 = 承伤公式 * 有效攻击 * 不暴击减免
            const nonCritPreDamage = effectiveAttack * player.不暴击减免;
            preDefenseBaseDamage = nonCritPreDamage;
            baseDamage = baseAttackDamage * player.不暴击减免;
        }

        baseDamage *= baseDamageScale;
        preDefenseBaseDamage *= baseDamageScale;

        if (player.追击词条 && player.追击词条.length > 0) {
            player.追击词条.forEach(affix => {
                const chance = Math.max(0, Math.min(100, affix.chance));
                if (Math.random() * 100 < chance) {
                    // 追击与主段同样受承伤和分段缩放
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
                        extraDamage += effectiveAttack * (affix.percent / 100);
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
                        extraAttackPortion += effectiveAttack * (affix.percent / 100);
                    }
                    const extraDamage = extraAttackPortion * baseDamageMultiplier;
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
                    // 重创：暴击时使用暴击承伤系数，不额外吃暴击倍率
                    const scaledExtra = extraDamage * critDamageMultiplier;
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

        const scaledExtraDamage = Math.ceil(extraDamagePortion * damageBonusMultiplier);
        let totalDamage = Math.max(0, scaledBaseDamage + scaledExtraDamage);
        if (executionBonusPercent > 0) {
            totalDamage *= (1 + executionBonusPercent / 100);
            totalDamage = Math.max(0, Math.ceil(totalDamage));
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
            totalDamage = Math.max(0, Math.ceil(totalDamage));
        }

        let devourApplied = false;
        let devourTag = null;
        if (monster.traitDevour && defenseForDevour > (monster.traitDevour.threshold || 0)) {
            const reduction = Math.max(0, Math.min(100, monster.traitDevour.value || 0));
            const multiplier = Math.max(0, 1 - reduction / 100);
            totalDamage = Math.max(0, Math.round(totalDamage * multiplier));
            devourApplied = reduction > 0;
            devourTag = monster.traitDevour.name || '吞噬';
        }

        // 镇压特性：受到暴击时免疫部分伤害
        if (isCrit && monster.traitSuppress) {
            const reduction = Math.max(0, Math.min(100, monster.traitSuppress.value || 0));
            const suppressMultiplier = Math.max(0, 1 - reduction / 100);
            totalDamage = Math.max(0, Math.round(totalDamage * suppressMultiplier));
            if (reduction > 0) {
                triggeredEffectTags.push(monster.traitSuppress.name || '镇压');
            }
        }

        const trueDamageDetails = pendingExtraSegments.map(segment => ({
            name: segment.name,
            damage: Math.max(0, Math.ceil(segment.rawDamage * damageBonusMultiplier)),
            type: segment.type
        }));

        return {
            damage: totalDamage,
            trueDamageDetails,
            extraTags: triggeredEffectTags,
            devourTag,
            devourApplied
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
        const burningGuardTrait = monster.traitBurningGuard || null;
        let repairUsed = false;

        // 实际暴击率与命中率（抗暴率为乘法减免）
        const actualCritRate = Math.max(0, Math.min(100, player.暴击率 * (1 - monster.抗暴率 / 100)));
        const dodgeMultiplier = player.精准减闪系数 ?? 1;
        const effectiveMonsterDodge = Math.max(0, monster.闪避率 * dodgeMultiplier);
        const baseHitRate = Math.max(0, player.命中率 - (monster.traitAccuracyPenaltyPercent || 0));
        const actualHitRate = Math.max(0, Math.min(100, baseHitRate - effectiveMonsterDodge));

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
                // 意志特性：血量低于阈值时增加抗暴率
                let effectiveAntiCrit = monster.抗暴率;
                if (monster.traitWillpower) {
                    const monsterHpPercent = (monsterHP / monster.血量) * 100;
                    const threshold = monster.traitWillpower.threshold || 10;
                    if (monsterHpPercent < threshold) {
                        effectiveAntiCrit += monster.traitWillpower.value || 0;
                    }
                }
                const currentCritRate = Math.max(0, Math.min(100, player.暴击率 * (1 - effectiveAntiCrit / 100)));
                let segmentIsCrit = Math.random() * 100 < currentCritRate;
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
                let damage = damageResult.damage;
                if (typeof monster.traitDamageMultiplier === 'number') {
                    damage = Math.max(0, Math.round(damage * monster.traitDamageMultiplier));
                }

                const effectTags = (player.常驻显示词条 || []).map(name => name);
                if (segmentIsCrit) {
                    effectTags.push('暴击');
                }
                const monsterTraitTags = [];
                if (monster.traitAccuracyPenaltyPercent && monster.traitAccuracyPenaltyPercent > 0) {
                    monsterTraitTags.push(monster.traitAccuracyPenaltyName || '诅咒');
                }
                if (monster.traitIntimidatePercent && monster.traitIntimidatePercent > 0) {
                    monsterTraitTags.push(monster.traitIntimidateName || '恐吓');
                }
                if (damageResult.devourApplied && monster.traitDevour?.name) {
                    monsterTraitTags.push(monster.traitDevour.name);
                }

                if (damageResult.trueDamageDetails.length > 0) {
                    damageResult.trueDamageDetails.forEach(detail => {
                        effectTags.push(detail.name);
                    });
                }
                if (damageResult.extraTags && damageResult.extraTags.length > 0) {
                    // 过滤掉怪物词条（无畏、镇压、虚弱、意志、麻痹、神圣铠甲等），只保留玩家词条
                    const monsterTraitNames = ['无畏', '镇压', '虚弱', '意志', '麻痹', '神圣铠甲'];
                    damageResult.extraTags.forEach(tag => {
                        if (monsterTraitNames.includes(tag)) {
                            // 避免重复添加
                            if (!monsterTraitTags.includes(tag)) {
                                monsterTraitTags.push(tag);
                            }
                        } else {
                            effectTags.push(tag);
                        }
                    });
                }
                if (explosionTags.length > 0) {
                    explosionTags.forEach(tag => effectTags.push(tag));
                }

                // 灼烧：特效数量达到阈值时减免伤害，并记录词条
                let burningReduced = false;
                const burningTagCount = (Array.isArray(splitResult.triggered) ? splitResult.triggered.length : 0) + effectTags.length;
                if (burningGuardTrait && burningTagCount >= (burningGuardTrait.minTags || 3)) {
                    const reduction = Math.max(0, Math.min(100, burningGuardTrait.value || 0));
                    const multiplier = Math.max(0, 1 - reduction / 100);
                    damage = Math.max(0, Math.round(damage * multiplier));
                    burningReduced = reduction > 0;
                }
                if (burningReduced && burningGuardTrait?.name) {
                    monsterTraitTags.push(burningGuardTrait.name);
                }

                const applyParalysisReduction = () => {
                    if (!segmentIsCrit && monster.traitParalysis) {
                        const reduction = Math.max(0, Math.min(100, monster.traitParalysis.value || 0));
                        const multiplier = Math.max(0, 1 - reduction / 100);
                        damage = Math.max(0, Math.ceil(damage * multiplier));
                        // 让已记录的真实伤害段显示与总伤害一致的减免
                        if (damageResult.trueDamageDetails && damageResult.trueDamageDetails.length > 0) {
                            damageResult.trueDamageDetails = damageResult.trueDamageDetails.map(detail => ({
                                ...detail,
                                damage: Math.max(0, Math.ceil(detail.damage * multiplier))
                            }));
                        }
                        if (reduction > 0) {
                            monsterTraitTags.push(monster.traitParalysis.name || '麻痹');
                        }
                        return true;
                    }
                    return false;
                };

                // 反击：多段攻击时减免伤害
                if (monster.traitCounter && segmentCount > 1) {
                    const reduction = Math.max(0, Math.min(100, monster.traitCounter.value || 0));
                    const multiplier = Math.max(0, 1 - reduction / 100);
                    damage = Math.max(0, Math.ceil(damage * multiplier));
                    if (reduction > 0) {
                        monsterTraitTags.push(monster.traitCounter.name || '反击');
                    }
                }

                // 神圣铠甲：血量低于阈值时，免疫真实伤害以外所有伤害
                const currentHpPercent = (monsterHP / monster.血量) * 100;
                if (monster.traitSacredArmor && currentHpPercent <= (monster.traitSacredArmor.threshold || 30)) {
                    if (window.debugSacredArmor) {
                        console.log(`[神圣铠甲触发] 当前血量: ${monsterHP}/${monster.血量} (${currentHpPercent.toFixed(2)}%), 阈值: ${monster.traitSacredArmor.threshold}%, 原伤害: ${damage}`);
                    }
                    // 计算真实伤害部分（裂创、影刃固定伤害、虚无转换等）
                    let trueDamage = 0;
                    if (damageResult.trueDamageDetails && damageResult.trueDamageDetails.length > 0) {
                        damageResult.trueDamageDetails.forEach(detail => {
                            if (detail.type === '裂创' || detail.type === '影刃' || detail.type === '虚无') {
                                trueDamage += detail.damage;
                            }
                        });
                    }
                    // 只保留真实伤害，其余全部免疫
                    const beforeDamage = damage;
                    damage = Math.max(0, trueDamage);
                    if (window.debugSacredArmor) {
                        console.log(`[神圣铠甲] 真实伤害: ${trueDamage}, 最终伤害: ${damage}, 免疫伤害: ${beforeDamage - damage}`);
                    }
                    monsterTraitTags.push(monster.traitSacredArmor.name || '神圣铠甲');
                } else if (monster.traitSacredArmor && window.debugSacredArmor) {
                    console.log(`[神圣铠甲未触发] 当前血量: ${monsterHP}/${monster.血量} (${currentHpPercent.toFixed(2)}%), 阈值: ${monster.traitSacredArmor.threshold}%`);
                }

                // 麻痹：受到非暴击攻击时免疫部分伤害（包括真实伤害在内统一减免）
                applyParalysisReduction();

                // 修复：血量降至阈值以下时免疫一次伤害并恢复百分比血量（仅一次）
                if (monster.traitRepair && !monster.traitRepairUsed) {
                    const nextHp = monsterHP - damage;
                    const thresholdValue = monster.血量 * (monster.traitRepair.threshold / 100);
                    if (!repairUsed && nextHp <= thresholdValue) {
                        const healAmount = Math.max(0, Math.ceil(monster.血量 * (monster.traitRepair.value / 100)));
                        damage = 0;
                        monsterHP = Math.min(monster.血量, monsterHP + healAmount);
                        repairUsed = true;
                        battleLog.push(`<p><i>${monster.traitRepair.name || '修复'}</i>，怪物回复 <span class="grow" style="color:#4ade80;">${healAmount}</span> 血量</p>`);
                    }
                }

                monsterHP = Math.max(0, monsterHP - damage);
                totalDamage += damage;

                // 记录击杀时间
                if (monsterHP <= 0 && killTime === 0) {
                    killTime = attackNumber / player.攻速;
                }

                const descriptor = formatSplitDescriptor(splitResult, segmentCount, segmentIndex + 1, effectTags);
                const { ratio, tags } = parseDescriptorParts(descriptor);
                const ratioHtml = ratio ? `<span class="split-ratio">${ratio}</span>` : '';
                const tagHtml = tags.length > 0 ? tags.map(tag => `<b>${tag}</b>`).join(' ') : '';
                const monsterTagHtml = monsterTraitTags.length > 0 ? monsterTraitTags.map(tag => `<i>${tag}</i>`).join(' ') : '';
                const labelSegments = [monsterTagHtml, ratioHtml, tagHtml].filter(Boolean);
                const labelHtml = labelSegments.join('，').trim();
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
            const battleMonster = JSON.parse(JSON.stringify(monster));
            // 重置一次性状态
            battleMonster.traitRepairUsed = false;
            const result = simulateBattle(player, battleMonster, battleTime);
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

    function setPanelStatus(text, canReload = false) {
        statusHint.textContent = text;
        statusHint.style.display = text ? 'block' : 'none';
        statusHint.dataset.reload = canReload ? 'true' : 'false';
        statusHint.style.cursor = canReload ? 'pointer' : 'default';
    }

    statusHint.dataset.reload = 'false';
    statusHint.onclick = () => {
        if (!panelState.isLoading && statusHint.dataset.reload === 'true') {
            loadBattleData();
        }
    };

    function resetEquipmentCollapse() {
        equipmentExpanded = false;
        toggleIcon.textContent = '▼';
        equipmentContent.style.maxHeight = '0px';
        equipmentContent.style.opacity = '0';
    }

    async function loadBattleData() {
        if (panelState.isLoading) {
            return;
        }

        panelState.isLoading = true;
        mainActionBtn.disabled = true;
        mainActionBtn.textContent = '读取中...';
        setPanelStatus('读取装备中...', false);

        try {
            const userAttrs = parseUserAttrs();
            panelState.userAttrs = userAttrs;
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
                    console.warn('装备读取失败', error);
                }
            }

            if (equipmentData.length > 0) {
                applyEquipmentEffects(equipmentData);
            } else {
                playerStats.追击伤害 = 0;
                playerStats.追击词条 = [];
                playerStats.影刃词条 = [];
                playerStats.虚无词条 = [];
                playerStats.重击词条 = [];
                playerStats.裂创词条 = [];
                playerStats.重创词条 = [];
                playerStats.分裂词条 = [];
                playerStats.爆发词条 = [];
                playerStats.回响词条 = [];
                playerStats.增幅词条 = [];
                playerStats.灼烧词条 = [];
                playerStats.引爆词条 = [];
                playerStats.穿刺词条 = [];
                playerStats.协同词条 = [];
            }

            panelState.equipmentData = equipmentData;
            personalContent.innerHTML = buildPersonalAttrHTML(userAttrs);
            personalSection.style.display = 'block';
            equipmentContent.innerHTML = buildEquipmentTraitsHTML(equipmentData);
            equipmentSection.style.display = 'block';
            resetEquipmentCollapse();
            helperPanelState.hasData = true;
            updateHelperPanelVisibility();

            panelState.isReady = Object.keys(userAttrs).length > 0;
            mainActionBtn.textContent = panelState.isReady ? '打开战斗模拟' : '重新加载';
            setPanelStatus(panelState.isReady ? '读取完成 · 点击重新读取' : '属性缺失 · 点击重新读取', true);
        } catch (error) {
            console.error('读取装备失败', error);
            panelState.isReady = false;
            mainActionBtn.textContent = '重新加载';
            setPanelStatus('读取失败 · 点击重试', true);
        } finally {
            panelState.isLoading = false;
            mainActionBtn.disabled = false;
        }
    }

    mainActionBtn.onclick = () => {
        if (panelState.isLoading) {
            return;
        }
        if (!panelState.isReady) {
            loadBattleData();
            return;
        }
        openSimulationPanel();
    };

    function openSimulationPanel() {
        const presetOptions = monsterPresets.map(preset => {
            const selected = monsterSettings.selectedPresetKey === preset.key ? 'selected' : '';
            return `<option value="${preset.key}" ${selected}>${preset.name}</option>`;
        }).join('');
        const html = `
            <div style="position: relative; text-align: center; margin-bottom: 12px;">
                <div style="position: absolute; left: 0; top: 50%; transform: translateY(-50%);">
                    <button id="monsterSettingsToggle" style="padding: 8px 10px; border-radius: 18px; border: 1px solid rgba(255,255,255,0.1); background: rgba(255,255,255,0.05); color: #d6ddff; font-size: 12px; cursor: pointer;">👾 怪物属性</button>
                </div>

                <h2 style="margin: 0; color: #f8fafc; font-size: 16px;">⚔️ 战斗模拟器</h2>

                <div style="position: absolute; right: 0; top: 50%; transform: translateY(-50%);">
                    <button id="closeSimulate" style="width: 32px; height: 32px; border-radius: 50%; border: 1px solid rgba(255,255,255,0.2); background: rgba(255,255,255,0.06); color: #d1d8ff; font-size: 18px; line-height: 1; cursor: pointer;">×</button>
                </div>
            </div>
            <div style="margin-bottom: 12px;">
                <button id="startBattle" style="width: 100%; padding: 10px; border-radius: 8px; border: none; background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%); color: #fff; font-size: 12px; font-weight: bold; cursor: pointer;">开始模拟</button>
            </div>
            <div id="monsterSettingsPanel" style="display: none; background: rgba(255,255,255,0.02); padding: 12px; border-radius: 10px; border: 1px solid rgba(255,255,255,0.08); margin-bottom: 14px;">
                <div style="display: flex; flex-wrap: wrap; gap: 10px; margin-bottom: 10px;">
                    <label style="display: flex; flex-direction: column; font-size: 11px; color: #9ea8d5; min-width: 160px;">
                        怪物预设
                        <select id="monsterPreset" style="margin-top: 4px; padding: 8px; border-radius: 8px; border: 1px solid rgba(255,255,255,0.15); background: rgba(0,0,0,0.25); color: #fff;">
                            <option value="" ${!monsterSettings.selectedPresetKey ? 'selected' : ''}>木桩</option>
                            ${presetOptions}
                        </select>
                    </label>
                    <button id="resetMonsterTraits" style="padding: 8px 10px; border-radius: 8px; border: 1px solid rgba(255,255,255,0.12); background: rgba(255,255,255,0.04); color: #d6ddff; font-size: 12px; cursor: pointer; height: fit-content;">重置属性</button>
 </div>
                <div style="display: grid; grid-template-columns: auto 1fr auto 1fr; column-gap: 6px; row-gap: 8px; align-items: center;">
                    <div style="font-size: 11px; color: #9ea8d5; text-align: left;">血量</div>
                    <input type="number" id="monsterHP" value="${monsterSettings.血量}" style="padding: 6px; border-radius: 6px; border: 1px solid rgba(255,255,255,0.1); background: rgba(0,0,0,0.2); color: #fff; width: 100%; box-sizing: border-box;">
                    <div style="font-size: 11px; color: #9ea8d5; text-align: left;">防御</div>
                    <input type="number" id="monsterDefense" value="${monsterSettings.防御}" style="padding: 6px; border-radius: 6px; border: 1px solid rgba(255,255,255,0.1); background: rgba(0,0,0,0.2); color: #fff; width: 100%; box-sizing: border-box;">

                    <div style="font-size: 11px; color: #9ea8d5; text-align: left;">闪避(%)</div>
                    <input type="number" id="monsterDodge" value="${monsterSettings.闪避率}" style="padding: 6px; border-radius: 6px; border: 1px solid rgba(255,255,255,0.1); background: rgba(0,0,0,0.2); color: #fff; width: 100%; box-sizing: border-box;">
                    <div style="font-size: 11px; color: #9ea8d5; text-align: left;">抗暴(%)</div>
                    <input type="number" id="monsterAntiCrit" value="${monsterSettings.抗暴率}" style="padding: 6px; border-radius: 6px; border: 1px solid rgba(255,255,255,0.1); background: rgba(0,0,0,0.2); color: #fff; width: 100%; box-sizing: border-box;">

                    <div style="font-size: 11px; color: #9ea8d5; text-align: left;">承伤系数</div>
                    <select id="damageCurveConstant" style="padding: 6px; border-radius: 6px; border: 1px solid rgba(255,255,255,0.1); background: rgba(0,0,0,0.2); color: #fff; width: 100%; box-sizing: border-box;">
                        <option value="150" ${monsterSettings.承伤系数 === 150 ? 'selected' : ''}>150</option>
                        <option value="200" ${monsterSettings.承伤系数 === 200 ? 'selected' : ''}>200</option>
                    </select>
                    <div style="font-size: 11px; color: #9ea8d5; text-align: left;">战斗时间(秒)</div>
                    <input type="number" id="battleTime" value="${monsterSettings.战斗时间}" style="padding: 6px; border-radius: 6px; border: 1px solid rgba(255,255,255,0.1); background: rgba(0,0,0,0.2); color: #fff; width: 100%; box-sizing: border-box;">
                </div>
                <div id="monsterTraitsContainer" style="margin-top: 10px; background: rgba(255,255,255,0.01); border: 1px dashed rgba(255,255,255,0.08); padding: 10px; border-radius: 10px;"></div>
            </div>
                <div id="monsterTraitsContainer" style="margin-top: 10px; background: rgba(255,255,255,0.01); border: 1px dashed rgba(255,255,255,0.08); padding: 10px; border-radius: 10px;"></div>
            </div>
            <div id="battleResult" style="margin-top: 10px; display: none;">
                <h3 style="color: #f093fb; font-size: 13px; border-bottom: 1px solid rgba(255,255,255,0.08); padding-bottom: 6px; margin-bottom: 2px;">模拟结果</h3>
                <div id="battleStats" style="background: rgba(255,255,255,0.02); padding: 12px; border-radius: 10px; margin: 2px 0;"></div>
                <div style="background: rgba(255,255,255,0.02); border: 1px solid rgba(255,255,255,0.08); border-radius: 10px; padding: 10px;">
<button id="battleLogToggle" style="width: 100%; background: none; border: none; color: #f5f6ff; font-size: 12px; font-weight: bold; display: flex; justify-content: space-between; align-items: center; cursor: pointer; position: relative; padding: 0 0;">
    <span style="visibility: hidden;">▼</span>

    <span style="position: absolute; left: 50%; transform: translateX(-50%);">战斗日志</span>

    <span id="battleLogIcon">▼</span>
</button>
                    <div id="battleLogWrapper" style="max-height: 0; overflow: hidden; opacity: 0; transition: max-height 0.25s ease, opacity 0.25s ease;">
                        <div id="battleLog" style="max-height: 260px; overflow-y: auto; font-size: 11px; line-height: 1.35;"></div>


                    </div>
                </div>
            </div>
        `;
        simulatePanel.innerHTML = html;
        simulatePanel.style.display = 'block';

        const settingsPanel = document.getElementById('monsterSettingsPanel');
        const monsterToggle = document.getElementById('monsterSettingsToggle');
        monsterToggle.onclick = () => {
            const isOpen = settingsPanel.style.display === 'block';
            settingsPanel.style.display = isOpen ? 'none' : 'block';
        };

        document.getElementById('closeSimulate').onclick = () => {
            simulatePanel.style.display = 'none';
        };

        const monsterPresetSelect = document.getElementById('monsterPreset');
        const monsterTraitsContainer = document.getElementById('monsterTraitsContainer');
        const resetTraitsBtn = document.getElementById('resetMonsterTraits');
        const monsterInputs = {
            hp: document.getElementById('monsterHP'),
            defense: document.getElementById('monsterDefense'),
            dodge: document.getElementById('monsterDodge'),
            antiCrit: document.getElementById('monsterAntiCrit'),
            curve: document.getElementById('damageCurveConstant'),
            battleTime: document.getElementById('battleTime')
        };

        const renderMonsterTraits = (traits = []) => {
            if (!monsterTraitsContainer) {
                return;
            }
            if (!traits.length) {
                monsterTraitsContainer.innerHTML = `<div style="color: #8f9bc4; font-size: 11px;">选择内置怪物后会显示特性，并可调整数值。</div>`;
                return;
            }
            const traitsHtml = traits.map(trait => {
                const unitText = trait.unit || monsterTraitDefinitions[trait.key]?.unit || '';
                const descText = trait.desc || monsterTraitDefinitions[trait.key]?.desc || '调整数值影响模拟结果';
                const value = typeof trait.value === 'number'
                    ? trait.value
                    : (monsterTraitDefinitions[trait.key]?.defaultValue ?? 0);
                const minTags = typeof trait.minTags === 'number'
                    ? trait.minTags
                    : (monsterTraitDefinitions[trait.key]?.minTags ?? 0);
                const effect = trait.effect || monsterTraitDefinitions[trait.key]?.effect || '';
                // 针对不同特性定制可编辑位置；默认在描述后附上输入框
                const valueText = `<span
                                data-monster-trait-key="${trait.key}"
                                data-trait-name="${trait.name}"
                                data-trait-unit="${unitText}"
                                data-trait-desc="${descText}"
                                data-trait-effect="${effect}"
                                data-trait-min-tags="${minTags}"
                                data-trait-threshold="${typeof trait.threshold === 'number' ? trait.threshold : (monsterTraitDefinitions[trait.key]?.threshold ?? '')}"
                                style="margin-left: 6px; color: inherit; display: inline-block;"
                            >${value}${unitText || '%'}</span>`;

                let renderedDesc = '';
                if (trait.key === 'burningGuard') {
                    // 仅免疫百分比可编辑，特效数量沿用描述/最小特效数
                    const countMatch = descText.match(/特效[^\d]*(\d+)/);
                    const threshold = countMatch ? countMatch[1] : (minTags || '');
                    renderedDesc = `特效大于${threshold}个时，免疫 ${valueText} 的伤害`;
                } else if (trait.key === 'devour') {
                    const threshold = typeof trait.threshold === 'number'
                        ? trait.threshold
                        : (monsterTraitDefinitions[trait.key]?.threshold ?? 0);
                    renderedDesc = `防御高于 ${threshold} 时，免疫 ${valueText} 的伤害`;
                } else if (trait.key === 'fearless') {
                    // 无畏：描述已包含完整信息，但仍需要隐藏的 valueText 用于数据收集
                    renderedDesc = `${descText}<span style="display:none;">${valueText}</span>`;
                } else if (trait.key === 'suppress') {
                    // 镇压：动态显示实际的减免百分比
                    renderedDesc = `受到暴击时，免疫 ${valueText} 的伤害`;
                } else if (trait.key === 'weaken') {
                    // 虚弱：动态显示实际的攻击降低百分比
                    renderedDesc = `降低玩家 ${valueText} 攻击`;
                } else if (trait.key === 'sacredArmor') {
                    // 神圣铠甲：血量低于阈值时免疫真实伤害以外所有伤害（隐藏value用于数据收集）
                    const threshold = typeof trait.threshold === 'number'
                        ? trait.threshold
                        : (monsterTraitDefinitions[trait.key]?.threshold ?? 30);
                    renderedDesc = `血量低于 ${threshold}% 时，免疫真实伤害以外所有伤害<span style="display:none;">${valueText}</span>`;
                } else if (trait.key === 'willpower') {
                    // 意志：血量低于阈值时增加抗暴率
                    const threshold = typeof trait.threshold === 'number'
                        ? trait.threshold
                        : (monsterTraitDefinitions[trait.key]?.threshold ?? 10);
                    renderedDesc = `血量低于 ${threshold}% 时，增加 ${valueText} 抗暴率`;
                } else if (trait.key === 'paralysis') {
                    // 麻痹：受到非暴击攻击时免疫部分伤害
                    renderedDesc = `受到非暴击攻击时，免疫 ${valueText} 的伤害`;
                } else if (trait.key === 'repair') {
                    const threshold = typeof trait.threshold === 'number'
                        ? trait.threshold
                        : (monsterTraitDefinitions[trait.key]?.threshold ?? 10);
                    renderedDesc = `血量低于 ${threshold}% 时，免疫一次伤害并恢复 ${valueText} 血量（仅一次）`;
                } else if (trait.key === 'counter') {
                    renderedDesc = `受到多段攻击时，免疫 ${valueText} 的伤害`;
                } else {
                    renderedDesc = `${descText}${valueText}`;
                }

                return `
                    <div style="background: rgba(0,0,0,0.15); border: 1px solid rgba(255,255,255,0.05); padding: 8px; border-radius: 8px;">
                        <div style="color: #d6ddff; font-size: 12px; font-weight: 600; margin-bottom: 4px;">${trait.name}</div>
                        <div style="color: #8f9bc4; font-size: 11px; line-height: 1.5;">
                            ${renderedDesc}
                        </div>
                    </div>
                `;
            }).join('');
            monsterTraitsContainer.innerHTML = `<div style="display: flex; flex-direction: column; gap: 8px;">${traitsHtml}</div>`;
        };

        const applyMonsterPresetToFields = (presetKey, { replaceFields = true, useCustomTraits = true } = {}) => {
            const isSamePreset = monsterSettings.selectedPresetKey === presetKey;
            const preset = getMonsterSettingsFromPreset(presetKey);
            const presetTraits = preset?.traits || [];
            if (preset && replaceFields) {
                monsterSettings.血量 = preset.血量 ?? monsterSettings.血量;
                monsterSettings.防御 = preset.防御 ?? monsterSettings.防御;
                monsterSettings.闪避率 = preset.闪避率 ?? monsterSettings.闪避率;
                monsterSettings.抗暴率 = preset.抗暴率 ?? monsterSettings.抗暴率;
                monsterSettings.承伤系数 = preset.承伤系数 ?? monsterSettings.承伤系数;
                monsterInputs.hp.value = monsterSettings.血量;
                monsterInputs.defense.value = monsterSettings.防御;
                monsterInputs.dodge.value = monsterSettings.闪避率;
                monsterInputs.antiCrit.value = monsterSettings.抗暴率;
                monsterInputs.curve.value = monsterSettings.承伤系数;
            }
            monsterSettings.selectedPresetKey = presetKey || '';
            const hasCustomTraits = useCustomTraits && isSamePreset && (monsterSettings.traits || []).length > 0;
            const traitsToUse = hasCustomTraits
                ? monsterSettings.traits
                : (preset ? presetTraits : []);
            monsterSettings.traits = traitsToUse.map(normalizeMonsterTrait).filter(Boolean);
            renderMonsterTraits(monsterSettings.traits);
        };

        const collectMonsterTraits = () => {
            const inputs = Array.from(document.querySelectorAll('[data-monster-trait-key]'));
            return inputs.map(input => {
                // 从 textContent 中提取数值（去除单位符号）
                const textValue = input.textContent.trim();
                const numericValue = parseFloat(textValue.replace(/[^\d.]/g, ''));
                return {
                    key: input.dataset.monsterTraitKey,
                    name: input.dataset.traitName,
                    unit: input.dataset.traitUnit,
                    desc: input.dataset.traitDesc,
                    effect: input.dataset.traitEffect,
                    minTags: input.dataset.traitMinTags,
                    threshold: parseFloat(input.dataset.traitThreshold),
                    value: numericValue
                };
            }).map(normalizeMonsterTrait).filter(Boolean);
        };

        monsterPresetSelect.onchange = (event) => {
            applyMonsterPresetToFields(event.target.value || '', { replaceFields: true, useCustomTraits: false });
        };

        resetTraitsBtn.onclick = () => {
            applyMonsterPresetToFields(monsterPresetSelect.value || '', { replaceFields: true, useCustomTraits: false });
        };

        if (monsterSettings.selectedPresetKey) {
            monsterPresetSelect.value = monsterSettings.selectedPresetKey;
            applyMonsterPresetToFields(monsterSettings.selectedPresetKey, { replaceFields: true, useCustomTraits: true });
        } else {
            renderMonsterTraits(monsterSettings.traits || []);
        }

        let logExpanded = false;
        const logToggle = document.getElementById('battleLogToggle');
        const logWrapper = document.getElementById('battleLogWrapper');
        const logIcon = document.getElementById('battleLogIcon');
        logToggle.onclick = () => {
            logExpanded = !logExpanded;
            logIcon.textContent = logExpanded ? '▲' : '▼';
            if (logExpanded) {
                logWrapper.style.maxHeight = logWrapper.scrollHeight + 'px';
                logWrapper.style.opacity = '1';
            } else {
                logWrapper.style.maxHeight = '0px';
                logWrapper.style.opacity = '0';
            }
        };

        document.getElementById('startBattle').onclick = () => {
            monsterSettings.血量 = parseInt(monsterInputs.hp.value) || 0;
            monsterSettings.防御 = parseInt(monsterInputs.defense.value) || 0;
            monsterSettings.闪避率 = parseFloat(monsterInputs.dodge.value) || 0;
            monsterSettings.抗暴率 = parseFloat(monsterInputs.antiCrit.value) || 0;
            monsterSettings.承伤系数 = parseInt(monsterInputs.curve.value) || 150;

            const battleTime = parseInt(monsterInputs.battleTime.value) || 180;
            monsterSettings.战斗时间 = battleTime;
            monsterSettings.selectedPresetKey = monsterPresetSelect.value || '';
            monsterSettings.traits = collectMonsterTraits();

            const monsterBase = {
                血量: monsterSettings.血量,
                防御: monsterSettings.防御,
                闪避率: monsterSettings.闪避率,
                抗暴率: monsterSettings.抗暴率,
                承伤系数: monsterSettings.承伤系数,
                traits: monsterSettings.traits
            };
            const monster = applyMonsterTraitEffects(monsterBase);

            if (playerStats.攻击 === 0) {
                alert('请先通过“加载战斗模拟”读取人物属性');
                return;
            }

            if (playerStats.攻速 === 0) {
                alert('攻速不能为空！');
                return;
            }

            const result = simulateMultipleBattles(playerStats, monster, battleTime, 10);

            const formatTime = (seconds) => {
                const mins = Math.floor(seconds / 60);
                const secs = Math.round(seconds % 60);
                return `${mins}分${secs}秒`;
            };

            const killTimeDisplay = result.avgKillTime !== null
                ? `<div style="color: #4ade80; font-size: 13px; font-weight: bold;">${formatTime(result.avgKillTime)}</div>`
                : `<div style="color: #f87171; font-size: 13px; font-weight: bold;">未击杀</div>`;

            const remainingHPDisplay = result.isKilled
                ? `<div style="color: #4ade80; font-size: 13px; font-weight: bold;">已击杀</div>`
                : `<div style="color: #f87171; font-size: 13px; font-weight: bold;">${result.lastRemainingHP}</div>`;

            const statsHTML = `
                <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(60px, 1fr)); gap: 6px; text-align: center;">
                    <div style="background: rgba(0,0,0,0.25); padding: 6px; border-radius: 8px;">
                        <div style="color: #9ea8d5; font-size: 11px; margin-bottom: 6px;">DPS</div>
                        <div style="color: #c084fc; font-size: 13px; font-weight: bold;">${result.currentDPS}</div>
                    </div>
                    <div style="background: rgba(0,0,0,0.25); padding: 6px; border-radius: 8px;">
                        <div style="color: #9ea8d5; font-size: 11px; margin-bottom: 6px;">击杀时间</div>
                        ${killTimeDisplay}
                    </div>
                    <div style="background: rgba(0,0,0,0.25); padding: 6px; border-radius: 8px;">
                        <div style="color: #9ea8d5; font-size: 11px; margin-bottom: 6px;">剩余血量</div>
                        ${remainingHPDisplay}
                    </div>
                    <div style="background: rgba(0,0,0,0.25); padding: 6px; border-radius: 8px;">
                        <div style="color: #9ea8d5; font-size: 11px; margin-bottom: 6px;">胜率</div>
                        <div style="color: #fcd34d; font-size: 13px; font-weight: bold;">${result.winRate}%</div>
                    </div>
                </div>
            `;

            document.getElementById('battleStats').innerHTML = statsHTML;

            let logHTML = '<h4 style="margin: 0 0 8px 0; color: #d1d8ff; font-size: 12px;">战斗日志</h4>';
            logHTML += result.lastBattleLog.join('');
            const logContainer = document.getElementById('battleLog');
            logContainer.innerHTML = logHTML;
            document.getElementById('battleResult').style.display = 'block';
            logContainer.scrollTop = logContainer.scrollHeight;
        };
    }

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

