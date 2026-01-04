// ==UserScript==
// @name        DarkGold Rating
// @namespace   http://tampermonkey.net/
// @version     1.6.7
// @description 自动识别暗金装备流派、计算评分，支持面板缩放和部位动态关键词匹配。
// @author      Lunaris
// @match       https://aring.cc/awakening-of-war-soul-ol/
// @icon        https://aring.cc/awakening-of-war-soul-ol/favicon.ico
// @grant       none
// @license     MIT

// @downloadURL https://update.greasyfork.org/scripts/553376/DarkGold%20Rating.user.js
// @updateURL https://update.greasyfork.org/scripts/553376/DarkGold%20Rating.meta.js
// ==/UserScript==

// =======================================================================
// 【用户自定义设置】
// =======================================================================
/**
 * ★ 面板缩放比例系数 (Scale Factor)
 * 默认值 1.0 为原始大小。
 * 设为 0.5 则面板和字体大小变为原来的 50%。
 * 缩小化的面板大小不会受此系数影响。
 */
const SCALE_FACTOR = 0.7;

// =======================================================================
// 【计分说明】
// - 词条命中流派推荐关键词： 满分三分
// - 词条未命中流派推荐关键词时，仅得0.5倍分数
//   例：72.4% 未命中 => 0.724 × 3 × 0.5 = 1.09
// - 非流派核心属性：参与计分，按 0.5 × 完美度。
//
// ★ 新增：用户通过设置面板可自定义以下比例（默认值如下）：
// =======================================================================

// 非流派核心属性得分基础权重（占词条基础权重的比例）
let NON_CORE_PROPS_WEIGHT = 0.5;
// 词条未命中流派关键词时的得分惩罚比例（占满分的比例）
let TRAIT_MISMATCH_PENALTY = 0.5;

(function() {
    'use strict';

    // 全局变量和状态
    let analysisPanel = null;
    let settingsPanel = null; // 新增：设置面板
    let isDragging = false;
    let dragOffsetX, dragOffsetY;

    // 记录用户是否主动关闭了面板。默认为 false (未关闭)。
    let isUserClosed = false;
    // 记录上一次触发评分的装备 DOM 元素
    let lastEquipWrap = null;
    let lastEquipSignature = null;

    // 1. 加载和保存设置的工具函数
    function loadSettings() {
        try {
            const storedSettings = localStorage.getItem('darkGoldRating_settings');
            if (storedSettings) {
                const settings = JSON.parse(storedSettings);
                // 确保加载的值是数字且在合理范围
                if (typeof settings.NON_CORE_PROPS_WEIGHT === 'number' && settings.NON_CORE_PROPS_WEIGHT >= 0 && settings.NON_CORE_PROPS_WEIGHT <= 1) {
                    NON_CORE_PROPS_WEIGHT = settings.NON_CORE_PROPS_WEIGHT;
                }
                if (typeof settings.TRAIT_MISMATCH_PENALTY === 'number' && settings.TRAIT_MISMATCH_PENALTY >= 0 && settings.TRAIT_MISMATCH_PENALTY <= 1) {
                    TRAIT_MISMATCH_PENALTY = settings.TRAIT_MISMATCH_PENALTY;
                }
            }
        } catch (e) {
            console.error('加载设置失败:', e);
        }
    }

    function saveSettings(coreWeight, penalty) {
        try {
            NON_CORE_PROPS_WEIGHT = coreWeight;
            TRAIT_MISMATCH_PENALTY = penalty;
            const settings = {
                NON_CORE_PROPS_WEIGHT: coreWeight,
                TRAIT_MISMATCH_PENALTY: penalty
            };
            localStorage.setItem('darkGoldRating_settings', JSON.stringify(settings));
            console.log('设置已保存:', settings);
        } catch (e) {
            console.error('保存设置失败:', e);
        }
    }

    // 在脚本启动时立即加载设置
    loadSettings();

    // =======================================================================
    // 1. 流派数据、最大值与通用属性定义 (Stream/Build Data Definition)
    // =======================================================================

    /**
     * 流派数据定义。
     * ★ 部位关键词字段统一为 'keywords'。
     */
    const BUILD_DATA = {
        // 分裂流派
        '分裂-追击': {
            core: '攻击速度、破防、命中',
            keywords: {
                '武器': '分裂, 轻灵',
                '头盔': '追击, 碎骨或影刃',
                '衣服': '分裂, 追击',
                '鞋子': '分裂, 追击',
                '戒指': '分裂, 追击',
            },
            priority: 3
        },
        '分裂-裂创': {
            core: '暴击率、攻击速度、命中',
            keywords: {
                '武器': '分裂, 裂创',
                '头盔': '裂创, 击溃',
                '衣服': '分裂, 轻灵, 重创',
                '鞋子': '分裂, 裂创',
                '戒指': '分裂, 裂创',
            },
            priority: 3
        },
        '分裂-重创': {
            core: '暴击率、破防、攻击速度、命中',
            keywords: {
                '武器': '分裂, 残忍',
                '头盔': '重创, 残忍/击溃',
                '衣服': '分裂, 重创',
                '鞋子': '分裂, 重创',
                '戒指': '分裂, 重创',
            },
            priority: 2
        },
                '分裂-重击': {
            core: '攻击速度、攻击、破防',
            keywords: {
                '武器': '分裂, 重击',
                '头盔': '重击, 破阵',
                '衣服': '分裂, 重击, 破阵',
                '鞋子': '分裂, 重击',
                '戒指': '分裂, 轻灵',
            },
            priority: 1
        },

        // 破阵流派
        '破阵-荣耀': { // 对应 "菊花荣耀"
            core: '暴击率、暴击伤害、破防、攻击速度',
            keywords: {
                '武器': '破阵',
                '头盔': '破阵, 爆发',
                '衣服': '破阵, 轻灵',
                '鞋子': '轻灵, 爆发',
                '戒指': '轻灵',
            },
            priority: 2
        },
        '破阵-冲锋/收割': {
            core: '暴击率、暴击伤害、破防、攻击速度、攻击',
            keywords: {
                '武器': '破阵, 冲锋或收割',
                '头盔': '破阵, 冲锋或收割',
                '衣服': '破阵, 冲锋或收割',
                '鞋子': '轻灵, 收尾',
                '戒指': '轻灵, 收尾',
            },
            priority: 1
        },

        // 特殊装备流派 (菊花)
        '菊花-命运': {
            core: '暴击率、暴击伤害、攻击速度、破防',
            keywords: {
                '武器': '破阵',
                '头盔': '破阵, 冲锋或收割',
                '衣服': '破阵, 轻灵',
                '鞋子': '轻灵, 冲击',
                '戒指': '轻灵',
            },
            priority: 4
        },
        '命运-冲锋': {
            core: '暴击率、暴击伤害、破防、攻击速度、攻击',
            keywords: {
                '武器': '破阵',
                '头盔': '破阵, 冲锋',
                '衣服': '破阵, 冲锋',
                '鞋子': '轻灵, 冲击百分比',
                '戒指': '轻灵',
            },
            priority: 4
        },
    };
    const EQUIP_ICONS = {
        '武器': '🔪',
        '头盔': '🧢',
        '衣服': '🥋',
        '鞋子': '🥾',
        '指环': '💍',
        '戒指': '💍',
        '符': '💍', // 符使用戒指的逻辑
    };
    // --- 特殊装备名称列表 (这些装备通常没有词条一，只有刻印词条) ---
    const SPECIAL_EQUIP_NAMES = ['秘 · 菊一文字', '命运', '荣耀'];
    // --- 各种暗金属性的理论最大值 (Max Roll) ---
    const MAX_ROLLS = {
        '破防': 25.5,
        '暴击率': 8.5,
        '全伤害加成': 4.5,
        '暴击伤害': 25.5,
        '攻击速度': 8.5,
        '命中率': 8.5,
        '攻击': 17,
    };
    // --- 核心属性最大分数定义 ---
    const MAX_CORE_SCORE = 4.0;
    // =======================================================================
    // 2. 评分逻辑 (Scoring Logic)
    // =======================================================================

    /**
     * 计算核心属性评分 (Core Props Score)
     */
    function calculateCorePropsScore(equipData, buildInfo) {
        const EXCLUDED_PROPS = [];
        // ★ 使用全局变量
        const NON_CORE_BASE = NON_CORE_PROPS_WEIGHT;
        const corePropNames = String(buildInfo.core || '')
            .split('、')
            .map(s => s.trim())
            .filter(Boolean);
        const FORCED_CORE_PROPS = new Set(['全伤害加成']);
        const isCoreProp = (name) => corePropNames.includes(name) || FORCED_CORE_PROPS.has(name);

        if (!equipData.extraProps || equipData.extraProps.length === 0) {
            return {
            score: 0,
            coreBaseScore: 0,
            quality: 0,
            ignoredProps: [],
            bonusScore: 0,
            combinedProps: []
            };
        }

        const combinedPropsList = [];
        (equipData.extraProps || []).forEach((prop, idx) => {
        combinedPropsList.push({
            // 记录一个顺序 id，方便调试
            id: `extra#${idx + 1}`,
            name: prop.name,
            value: prop.value,
            baseValue: prop.value,
            enhancedValue: 0,
            isEnhanced: false,
            maxRoll: MAX_ROLLS[prop.name]
        });
        });

        // 2) 处理强化属性：按“同名→就近未加成的一条”匹配一次；没匹配到则单独入列
        (equipData.enhancedProps || []).forEach((prop, eidx) => {
        const target = combinedPropsList.find(p => p.name === prop.name && !p.isEnhanced);
        if (target) {
            target.value += prop.value;
            target.enhancedValue += prop.value;
            target.isEnhanced = true;
        } else {
            combinedPropsList.push({
            id: `enhanced#${eidx + 1}`,
            name: prop.name,
            value: prop.value,
            baseValue: 0,
            enhancedValue: prop.value,
            isEnhanced: true,
            maxRoll: MAX_ROLLS[prop.name]
            });
        }
        });

        // 3) 词条权重按“实际词条条数”来均分（包含同名的多条）
        const totalPropsCount = combinedPropsList.length || 1;
        const maxCoreScore = MAX_CORE_SCORE;
        const propBaseWeight = maxCoreScore / totalPropsCount;

        // 4) 遍历评分：不再遍历 Map，而是遍历数组
        let score = 0;
        let coreBaseScore = 0;
        let bonusScore = 0;
        let matchingPropsCount = 0;
        let totalCoreRoll = 0;
        const ignoredProps = [];

        for (const prop of combinedPropsList) {
        const propName = prop.name;
        const maxRoll = prop.maxRoll;

        prop.isCore = false;
        prop.isIgnored = false;
        prop.isOverRoll = false;

        if (EXCLUDED_PROPS.includes(propName)) {
            prop.isIgnored = true;
            ignoredProps.push({ name: propName, reason: '基础属性，已排除评分' });
            continue;
        }
        if (!maxRoll) {
            prop.isIgnored = true;
            ignoredProps.push({ name: propName, reason: '未定义最大值' });
            continue;
        }

        const roll = Math.min(Math.max(prop.value / maxRoll, 0), 1);

        if (isCoreProp(propName)) {
            const add = propBaseWeight * roll;
            score += add;
            coreBaseScore += add;

            totalCoreRoll += roll;
            matchingPropsCount++;

            if (prop.value / maxRoll > 1.0) {
            const over = propBaseWeight * 0.5;
            bonusScore += over;
            score += over;
            prop.isOverRoll = true;
            }

            prop.isCore = true;
        } else {
            const add = NON_CORE_BASE * roll * propBaseWeight;
            score += add;
            coreBaseScore += add;
        }
        }

        const coreRollQuality = matchingPropsCount > 0
        ? (totalCoreRoll / matchingPropsCount)
        : 0;

        return {
        score,
        coreBaseScore,
        quality: coreRollQuality,
        ignoredProps,
        bonusScore,
        combinedProps: combinedPropsList
        };
    }


    /**
     * 计算装备评分 (10分制)
     */
    function calculateScore(equipData, buildInfo) {
        const TRAIT_MATCH_MAX = 3.0; // 命中流派关键词
        // ★ 使用全局变量
        const MISMATCH_PENALTY = TRAIT_MISMATCH_PENALTY;

        const coreScoreResult = calculateCorePropsScore(equipData, buildInfo);
        let score = coreScoreResult.score;

        // buildInfo.primaryKeywords 此时已经是动态生成的 effectiveKeywords
        const keywords = Array.isArray(buildInfo.primaryKeywords) ? buildInfo.primaryKeywords : [];

    const traitScoreAndExplain = (traitObj, isSpecialTraitOne = false) => {
        if (!traitObj || !traitObj.name) {
            if (isSpecialTraitOne && SPECIAL_EQUIP_NAMES.includes(equipData.name)) {
                return { v: TRAIT_MATCH_MAX, exp: `特殊装备无第一词条：默认满分 ${TRAIT_MATCH_MAX}` };
            }
            return { v: 0, exp: '无' };
        }

        const prob = Number(traitObj.probability || 0) / 100;

        if (isSpecialTraitOne && SPECIAL_EQUIP_NAMES.includes(equipData.name)) {
            return { v: TRAIT_MATCH_MAX, exp: `特殊装备：固定满分 ${TRAIT_MATCH_MAX}` };
        }

        // ★ 新增 mandatory 校验逻辑
        const isGrouped = !!(buildInfo && buildInfo.isGrouped && buildInfo.groupMeta);
        const mandatoryOk = !isGrouped
            || [equipData.traitOne?.name, equipData.traitTwo?.name].includes(buildInfo.groupMeta.mandatory);

        const isMatch = keywords.includes(traitObj.name) && mandatoryOk;

        if (isMatch) {
            const v = prob * TRAIT_MATCH_MAX;
            return {
                v,
                exp: `${(prob * 100).toFixed(1)}% × ${TRAIT_MATCH_MAX}（命中部位关键词） = ${v.toFixed(2)}`
            };
        } else {
            const base = TRAIT_MATCH_MAX * MISMATCH_PENALTY;
            const v = prob * base;
            return {
                v,
                exp: `${(prob * 100).toFixed(1)}% × ${TRAIT_MATCH_MAX} × ${MISMATCH_PENALTY.toFixed(2)}（未命中部位关键词） = ${v.toFixed(2)}`
            };
        }
    };


        const t1 = traitScoreAndExplain(equipData.traitOne, true);
        const t2 = traitScoreAndExplain(equipData.traitTwo, false);

        score += t1.v + t2.v;

        return {
            totalScore: score.toFixed(2),
            coreBaseScore: coreScoreResult.coreBaseScore.toFixed(2),
            coreBonusScore: coreScoreResult.bonusScore.toFixed(2),
            coreQuality: (coreScoreResult.quality * 100).toFixed(1),
            traitOneScore: t1.v.toFixed(2),
            traitTwoScore: t2.v.toFixed(2),
            traitOneExplain: t1.exp,
            traitTwoExplain: t2.exp,
            coreIgnoredProps: coreScoreResult.ignoredProps,
            combinedProps: coreScoreResult.combinedProps
        };
    }


    // =======================================================================
    // 3. DOM 操作和数据提取 (更精确的属性提取)
    // =======================================================================
    // ... (parseEquipData, extractProperty, quickEquipSignature, identifyBuilds 保持不变) ...
    
    /**
     * 辅助函数：从 P 标签中提取属性名称和数值
     */
    function extractProperty(p, isPercentage = false) {
        const textContent = p.textContent.trim();
        const property = { name: '', value: 0 };

        let match;
        // 尝试匹配中文名称 + 数值 + % (如果存在)
        if (isPercentage) {
            match = textContent.match(/([\u4e00-\u9fa5]+)\s*[+\-\*]*\s*([\d\.]+)\s*\%/);
        } else {
            match = textContent.match(/([\u4e00-\u9fa5]+)\s*[+\-\*]*\s*([\d\.]+)/);
        }

        if (match) {
            property.name = match[1].trim();
            property.value = parseFloat(match[2]);
            return property;
        }

        // 尝试匹配 span 结构
        const nameSpan = p.querySelector('span:first-child:not(.special)');
        const valueSpan = p.querySelector('.grow');
        if (nameSpan && valueSpan) {
            property.name = nameSpan.textContent.trim();
            let valueText = valueSpan.textContent.trim().replace('%', '');
            property.value = parseFloat(valueText);
            return property;
        }

        return null;
    }


    /**
     * 解析装备详情面板，提取所需数据
     */
    function parseEquipData(wrap) {
        const data = {
            name: '',
            type: '',
            quality: '',
            price: '',
            mainProps: [],
            extraProps: [], // 暗金属性 (核心属性)
            traitOne: { name: '', probability: 0 },
            traitTwo: { name: '', probability: 0 },
            enhancedProps: [] // 强化属性 (精造)

        };
        const equipInfo = wrap;
        if (!equipInfo) return data;

        const infoPs = Array.from(equipInfo.querySelectorAll('p'));
        // --- 1. 提取名称和类型 ---
        const titleP = equipInfo.querySelector('p:first-child');
        if (titleP) {
            /**
             * 根据 class (.weapon, .helmet, .armor, .shoes, .jewelry) 来识别装备类型。
             */
            const classList = titleP.classList;
            if (classList.contains('weapon')) {
                data.type = '武器';
            } else if (classList.contains('helmet')) {
                data.type = '头盔';
            } else if (classList.contains('armor')) {
                data.type = '衣服';
            } else if (classList.contains('shoes')) {
                data.type = '鞋子';
            } else if (classList.contains('jewelry')) {
                data.type = '戒指'; // 涵盖戒指、符等饰品
            }

            // —— DOM 清洗法：不提取 emoji，不做整体字符删除 ——
            // 1) 找到标题的第一个 <span>
            const nameSpan = titleP.querySelector('span:first-child');
            // 2) 克隆一份，用于安全地移除不需要的子元素
            const nameClone = nameSpan.cloneNode(true);
            // 3) 移除会“污染”名字展示的子元素（星标、强化星串、流派标签等）
            nameClone.querySelectorAll('b, .refine-wrap, .dark-gold-spec-info, .equip-lock').forEach(el => el.remove());
            // 4) 读取纯文本，并去掉末尾的 “+数字” 部分（例如 +18）
            let nameText = nameClone.textContent;
            // 去掉末尾的“+18 / +20”等（仅裁掉从第一个“ +数字”开始的后缀）
            nameText = nameText.replace(/\s*\+\d+\s*.*$/, '');
            // 移除名字开头的所有 emoji 与空白
            nameText = nameText.replace(/^[\p{Emoji_Presentation}\p{Extended_Pictographic}\s]+/u, '');
            // 规范空白
            nameText = nameText.replace(/\s+/g, ' ').trim();
            // 5) 设置最终名称（此时会自然包含最前面的 emoji）
            data.name = nameText;
        }
        // 兜底逻辑：如果 class 未能识别类型，则根据名称判断
        if (!data.type && (data.name.includes('指环') || data.name.includes('戒指'))) {
            data.type = '戒指';
        } else if (!data.type && data.name.includes('符')) {
            data.type = '符'; // 确保“符”被识别
        }


        let currentSection = 'start';
        for (const p of infoPs) {
            const text = p.textContent.replace(/\s+/g, '').trim();
            if (text.includes('属性：') && !text.includes('暗金属性')) {
                currentSection = 'mainProps';
                continue;
            } else if (text.includes('暗金属性：')) {
                currentSection = 'extraProps';
                continue;
            } else if (text.includes('刻印属性：')) {
                currentSection = 'traitTwo';
                continue;
            } else if (text.includes('强化属性：')) {
                currentSection = 'enhancedProps';
                continue;
            } else if (text.includes('品质：')) {
                data.quality = p.querySelector('.darkGold, .mythicalGold, .gold')?.textContent.trim() || '暗金';
            } else if (text.includes('售价：')) {
                data.price = p.querySelector('.gold, .mythicalGold')?.textContent.trim() || '未知';
            }



            // --- 核心词条提取 (词条一和词条二) ---
            const specialSpan = p.querySelector('.special');
            const probSpan = p.querySelector('.darkGold');

            if (specialSpan && probSpan) {
                const potentialTraitName = specialSpan.textContent.trim();
                const probText = probSpan.textContent.trim();
                const probMatch = probText.match(/(\d+\.?\d*)\%/);
                const probability = probMatch ? parseFloat(probMatch[1]) : 0;
                // 特殊装备：直接当刻印(词条二)
                if (SPECIAL_EQUIP_NAMES.includes(data.name)) {
                    data.traitTwo.name = potentialTraitName;
                    data.traitTwo.probability = probability;
                } else {
                    // 普通装备：先占词条一，再占词条二
                    if (!data.traitOne.name) {
                        data.traitOne.name = potentialTraitName;
                        data.traitOne.probability = probability;
                    } else if (potentialTraitName !== data.traitOne.name && !data.traitTwo.name) {
                        data.traitTwo.name = potentialTraitName;
                        data.traitTwo.probability = probability;
                    }
                }
                continue; // 跳过属性提取
            }


            // --- 属性数值提取 ---
            if (currentSection === 'mainProps') {
                const prop = extractProperty(p, p.textContent.includes('%'));
                if (prop) data.mainProps.push(prop);
            } else if (currentSection === 'extraProps') {
                const prop = extractProperty(p, p.textContent.includes('%'));
                if (prop) data.extraProps.push(prop);
            } else if (currentSection === 'enhancedProps') {
                // 强化属性通常不显示百分号，但为了兼容性，检查一下
                const prop = extractProperty(p, p.textContent.includes('%'));
                if (prop) data.enhancedProps.push(prop);
            }
        }

        return data;
    }

    function quickEquipSignature(wrap) {
        const titleP = wrap.querySelector('p:first-child');
        let name = '', type = '';
        if (titleP) {
            const cl = titleP.classList;
            if (cl.contains('weapon')) type = '武器';
            else if (cl.contains('helmet')) type = '头盔';
            else if (cl.contains('armor')) type = '衣服';
            else if (cl.contains('shoes')) type = '鞋子';
            else if (cl.contains('jewelry')) type = '戒指';
            const nameSpan = titleP.querySelector('span:first-child');
            name = (nameSpan?.textContent || '').replace(/\s*\+\d+\s*.*$/, '').trim();
        }
        let t1 = '', t2 = '';
        const specials = wrap.querySelectorAll('p .special');
        if (specials[0]) t1 = specials[0].textContent.trim();
        if (specials[1]) t2 = specials[1].textContent.trim();
        return [name || '', type || '', t1, t2].join('|');
    }

    /**
     * 识别适用流派 【返回推荐流派(用于评分)和备用流派(用于显示)】
     * ★ 基于 equipData.type 从流派的 keywords 字段中动态提取关键词进行匹配和评分。
     */
    function identifyBuilds(equipData) {
        const traitOneName = equipData.traitOne.name;
        const traitTwoName = equipData.traitTwo.name;
        const traits = [traitOneName, traitTwoName].filter(Boolean);

        // 1. 确定用于关键词查询的部位类型 ('符' 映射到 '戒指')
        let typeForLookup = equipData.type;
        if (typeForLookup === '符') typeForLookup = '戒指';

        // 2. 特殊装备处理
        if (SPECIAL_EQUIP_NAMES.includes(equipData.name)) {
            const preferName = (equipData.traitOne.name === '冲锋' || equipData.traitTwo.name === '冲锋')
                && BUILD_DATA['命运-冲锋'] ? '命运-冲锋' : '菊花-命运';
            const info = BUILD_DATA[preferName];

            // 提取特殊装备的有效关键词（使用 keywords 字段）
            const keywordsStr = info.keywords ? info.keywords[typeForLookup] : '';
            const effectiveKeywords = keywordsStr
                .split(/,|或|\/|，/)
                .map(s => s.trim())
                .filter(Boolean);

            return {
                builds: preferName,
                backupBuilds: '无',
                core: info.core,
                keywords: info.keywords, // 使用新的字段名
                primaryKeywords: effectiveKeywords, // 使用动态有效关键词
                isSpecial: true,
                strategy: 'special'
            };
        }

        // 普通装备：基于部位关键词 (keywords) 进行匹配
        const perfectMatches = [];
        const partialMatches = [];

        for (const [buildName, info] of Object.entries(BUILD_DATA)) {

            // 3. 动态提取该流派在该部位的“有效关键词”
            const keywordsStr = info.keywords ? info.keywords[typeForLookup] : '';
            if (!keywordsStr) continue;

            // —— 新增：识别“成对逻辑” ——
            // 规则：如果同一串里同时出现 “,”/“，”（表示 AND） 和 “或/ /”（表示 OR）
            // 则按 “A, B或C” => 需要同时命中 A 且 (B 或 C) 的成对逻辑。
            // 仅在同一串内同时出现 AND 和 OR 时启用该逻辑；否则保持原有“扁平或”逻辑。
            const hasAnd = /,|，/.test(keywordsStr);
            const hasOr  = /或|\//.test(keywordsStr);
            const isGrouped = hasAnd && hasOr;

            if (isGrouped) {
                // 仅取第一个逗号前后的两段：A, (B 或 C 或 …)
                // 若写法更复杂，保持向后兼容：只按第一段作为“必选”，第二段作为“候选或集合”
                const parts = keywordsStr.split(/,|，/).map(s => s.trim()).filter(Boolean);
                const mandatory = parts[0]; // A
                const orPool = (parts[1] || '')
                    .split(/或|\//)
                    .map(s => s.trim())
                    .filter(Boolean);       // [B, C, …]

                // 命中情况
                const hasMandatory = traits.includes(mandatory);
                const orHits = orPool.filter(k => traits.includes(k));
                const hasAnyOr = orHits.length > 0;

                // perfect：命中 A 且命中 (B 或 C)
                if (hasMandatory && hasAnyOr) {
                    // 为了后续显示，仍保留 effectiveKeywords（仅用于展示）
                    const effectiveKeywords = [mandatory, ...orPool];
                    perfectMatches.push({ buildName, info: { ...info, effectiveKeywords, isGrouped: true } });
                }
                // partial：只命中 A 或 只命中 (B/C)
                else if (hasMandatory || hasAnyOr) {
                    const hitCount = (hasMandatory ? 1 : 0) + orHits.length;
                    const effectiveKeywords = [mandatory, ...orPool];
                    partialMatches.push({ buildName, info: { ...info, effectiveKeywords, isGrouped: true }, hitCount });
                }
            } else {
                // —— 保持原有“扁平或”逻辑（与之前完全一致） ——
                const effectiveKeywords = keywordsStr
                    .split(/,|或|\/|，/)
                    .map(s => s.trim())
                    .filter(Boolean);

                if (effectiveKeywords.length === 0) continue;

                const hitCount = effectiveKeywords.filter(k => traits.includes(k)).length;

                if (hitCount === effectiveKeywords.length && effectiveKeywords.length >= 1) {
                    perfectMatches.push({ buildName, info: { ...info, effectiveKeywords } });
                } else if (hitCount >= 1) {
                    partialMatches.push({ buildName, info: { ...info, effectiveKeywords }, hitCount });
                }
            }

        }

        // 6. 处理完美匹配 (优先级最高的作为主推荐)
        if (perfectMatches.length > 0) {
            perfectMatches.sort((a, b) => b.info.priority - a.info.priority);
            const primary = perfectMatches[0];
            const backup = partialMatches
                .filter(p => p.buildName !== primary.buildName)
                .map(p => p.buildName);

            return {
                builds: perfectMatches.map(p => p.buildName).join('、'),
                backupBuilds: backup.join('、') || '无',
                core: primary.info.core,
                keywords: primary.info.keywords, // ★ 使用 keywords
                primaryKeywords: primary.info.effectiveKeywords, // 使用部位有效的关键词
                isSpecial: false,
                strategy: 'perfect'
            };
        }

        // 7. 处理部分匹配 (进入候选集评分)
        if (partialMatches.length > 0) {
            // 优先按 priority 排序，次要按 hitCount 排序
            partialMatches.sort((a, b) => (b.info.priority - a.info.priority) || (b.hitCount - a.hitCount));

            const backup = partialMatches.map(p => p.buildName);

            return {
                builds: '（单关键词匹配，待候选集评分决出）',
                backupBuilds: backup.join('、') || '无',
                core: '待候选集评分后确定',
                keywords: {}, // ★ 使用 keywords
                primaryKeywords: [],
                isSpecial: false,
                strategy: 'need_candidates',
                candidates: partialMatches // ★ 关键：返回所有部分匹配的流派数据
            };
        }

        // —— 无匹配：只提示，不评分 ——
        updatePanelForNoBuild(equipData);
        return {
            builds: '无流派',
            backupBuilds: '无流派',
            core: '无明确核心属性',
            keywords: {}, // ★ 使用 keywords
            primaryKeywords: [],
            isSpecial: false,
            strategy: 'none'
        };
    }


    // =======================================================================
    // 4. 浮动面板逻辑 (CSS, 创建, 交互)
    // =======================================================================

    function injectStyles() {
        const scaledWidth = 340 * SCALE_FACTOR;
        const scaledPadding = 15 * SCALE_FACTOR;
        const scaledHeaderPadding = 12 * SCALE_FACTOR;
        const scaledBaseFontSize = 14 * SCALE_FACTOR;
        const scaledHeaderFontSize = 15 * SCALE_FACTOR;
        const scaledControlFontSize = 16 * SCALE_FACTOR;
        const scaledPropFontSize = 13 * SCALE_FACTOR;

        const style = document.createElement('style');
        style.textContent = `
             /* Analysis Panel Base Styles */
             #equip-analysis-panel, #settings-panel { /* 添加设置面板 */
                 position: fixed;
                 top: 150px;
                 right: 20px;
                 width: ${scaledWidth}px; /* 缩放宽度 */
                 background: #2c3e50; /* Dark background */
                 border: 2px solid #f39c12; /* Dark gold border */
                 border-radius: 8px;
                 box-shadow: 0 4px 12px rgba(0, 0, 0, 0.5);
                 z-index: 99999;
                 color: #ecf0f1;
                 font-family: 'Inter', sans-serif;
                 transition: all 0.3s ease-in-out;
                 overflow: hidden;
                 display: none; /* 默认隐藏 */
             }

             /* Panel Header (Drag Handle) */
             .analysis-header, .settings-header {
                 background: #f39c12;
                 color: #2c3e50;
                 padding: ${scaledPadding * 0.5}px ${scaledHeaderPadding}px; /* 缩放内边距 */
                 cursor: move;
                 display: flex;
                 justify-content: space-between;
                 align-items: center;
                 font-weight: bold;
                 font-size: ${scaledHeaderFontSize}px; /* 缩放字体 */
             }

             /* Control Buttons */
             .header-controls button {
                 background: transparent;
                 border: none;
                 color: #2c3e50;
                 font-weight: bold;
                 font-size: ${scaledControlFontSize}px; /* 缩放字体 */
                 margin-left: ${8 * SCALE_FACTOR}px;
                 cursor: pointer;
                 padding: ${2 * SCALE_FACTOR}px ${5 * SCALE_FACTOR}px;
                 border-radius: 4px;
                 transition: background 0.2s;
             }
             .header-controls button:hover {
                 background: rgba(0, 0, 0, 0.1);
             }
             #settings-btn { /* 新增设置按钮的样式 */
                 font-size: ${scaledControlFontSize * 0.8}px;
                 margin-left: ${4 * SCALE_FACTOR}px;
                 padding: ${4 * SCALE_FACTOR}px ${8 * SCALE_FACTOR}px;
                 border: 1px solid #2c3e50;
                 border-radius: 4px;
             }
             #settings-btn:hover {
                 background: #e67e22;
             }

             /* Panel Content */
             .analysis-content, .settings-content {
                 padding: ${10 * SCALE_FACTOR}px ${scaledPadding}px; /* 缩放内边距 */
                 line-height: 1.5;
                 font-size: ${scaledBaseFontSize}px; /* 缩放字体 */
                 display: block; /* Default is visible */
             }
             /* Settings Panel Specific Styles */
             #settings-panel label {
                 display: block;
                 margin-top: ${10 * SCALE_FACTOR}px;
             }
             #settings-panel input[type="range"] {
                 width: 100%;
             }
             #settings-panel .rule-box {
                 border: 1px solid #7f8c8d;
                 padding: ${8 * SCALE_FACTOR}px;
                 margin-top: ${10 * SCALE_FACTOR}px;
                 border-radius: 4px;
                 font-size: ${scaledPropFontSize}px;
                 color: #bdc3c7;
             }
             #settings-panel .rule-box strong {
                 color: #ecf0f1;
             }

             /* Content Colors/Emphasis */
             .analysis-content .darkGold, .settings-content .darkGold {
                 color: #ffd700; /* Gold color for emphasis */
                 font-weight: bold;
             }
             .analysis-content .grow, .settings-content .grow {
                 color: #2ecc71; /* Green color for positive/growth values */
                 font-weight: bold;
                 font-size: inherit;
             }
             .analysis-content .warning, .settings-content .warning {
                 color: #e74c3c;
             }
             .analysis-content p, .settings-content p {
                 margin: ${4 * SCALE_FACTOR}px 0;
                 padding: 0;
             }
             .stat-title {
                 margin-top: ${15 * SCALE_FACTOR}px;
                 font-weight: bold;
                 color: #bdc3c7;
             }

             .stat-list {
                 margin: ${5 * SCALE_FACTOR}px 0 ${10 * SCALE_FACTOR}px 0;
                 padding: 0;
                 list-style: none;
                 border-left: ${3 * SCALE_FACTOR}px solid #3498db;
                 padding-left: ${10 * SCALE_FACTOR}px;
                 font-size: ${scaledPropFontSize}px; /* 缩放字体 */
                 color: #bdc3c7;
             }
             .stat-list li {
                 margin: ${2 * SCALE_FACTOR}px 0;
             }
             .stat-list .ignored {
                  color: #e74c3c;
                  text-decoration: line-through;
             }
             .stat-list .scored {
                  color: #2ecc71;
             }
             .stat-list .overroll {
                 color: #3498db;
                 font-weight: bold;
                 border-bottom: 1px dotted #3498db;
             }

             /* Minimized State (保持原始大小，不进行缩放) */
             .minimized .analysis-content {
                 display: none;
             }
             .minimized {
                 width: 150px !important; /* 原始值 */
                 height: auto !important; /* 原始值 */
                 opacity: 0.95;
             }

             /* Minimized Title Override (确保最小化标题可见，不受SCALE_FACTOR影响) */
             .minimized .analysis-header {
                 font-size: 15px; /* 原始值 */
                 padding: 8px 12px; /* 原始值 */
             }
             .minimized .header-controls button {
                 font-size: 16px; /* 原始值 */
                 margin-left: 8px; /* 原始值 */
                 padding: 2px 5px; /* 原始值 */
             }
         `;
        document.head.appendChild(style);
    }

    /**
      * 设置面板的拖动、最小化和关闭监听器 (支持鼠标和触摸)
      */
    function setupPanelListeners(panel) {
        const header = panel.querySelector('.analysis-header, .settings-header'); // 兼容两个面板
        const minimizeBtn = panel.querySelector('#minimize-btn');
        const closeBtn = panel.querySelector('#close-btn, #settings-close-btn'); // 兼容两个面板
        const settingsBtn = panel.querySelector('#settings-btn');

        // --- 拖动功能 (通用逻辑) ---
        const startDrag = (clientX, clientY) => {
            isDragging = true;
            dragOffsetX = clientX - panel.offsetLeft;
            dragOffsetY = clientY - panel.offsetTop;
            panel.style.transition = 'none'; // 拖动时禁用动画
        };

        const moveDrag = (clientX, clientY) => {
            if (!isDragging) return;
            let newX = clientX - dragOffsetX;
            let newY = clientY - dragOffsetY;

            // 限制拖动范围在屏幕内
            newX = Math.max(0, Math.min(newX, window.innerWidth - panel.offsetWidth));
            newY = Math.max(0, Math.min(newY, window.innerHeight - panel.offsetHeight));

            panel.style.left = newX + 'px';
            panel.style.top = newY + 'px';
        };

        const endDrag = () => {
            if (isDragging) {
                isDragging = false;
                panel.style.transition = 'all 0.3s ease-in-out'; // 恢复动画
            }
        };

        header.addEventListener('mousedown', (e) => {
            if (e.target.closest('.header-controls')) return; // 点击按钮不进入拖拽
            startDrag(e.clientX, e.clientY);
            e.preventDefault();
        });
        document.addEventListener('mousemove', (e) => moveDrag(e.clientX, e.clientY));
        document.addEventListener('mouseup', endDrag);


        // --- 2. 触摸事件监听 (移动端) ---
        header.addEventListener('touchstart', (e) => {
            if (e.touches.length === 1) {
                if (e.target.closest('.header-controls')) return; // 点击按钮不拖拽
                const touch = e.touches[0];
                startDrag(touch.clientX, touch.clientY);
                e.preventDefault();
            }
        }, { passive: false });

        document.addEventListener('touchmove', (e) => {
            if (!isDragging) return;                  // 只有拖拽中才处理
            if (e.touches.length === 1) {
                const touch = e.touches[0];
                moveDrag(touch.clientX, touch.clientY);
                e.preventDefault();                   // 仅拖拽时阻止页面滚动
            }
        }, { passive: false });

        document.addEventListener('touchend', endDrag);
        document.addEventListener('touchcancel', endDrag); // 处理触摸中断情况


        // --- 最小化/恢复功能 (仅分析面板) ---
        if (minimizeBtn) {
           minimizeBtn.addEventListener('click', () => {
               panel.classList.toggle('minimized');
               const minimized = panel.classList.contains('minimized');
               minimizeBtn.textContent = minimized ? '🗗' : '―';

               // 切换标题：最小化显示“得分”，还原显示“装备分析”
               const headerTitle = panel.querySelector('.analysis-header span');
               headerTitle.textContent = minimized
                   ? `得分 ${panel.dataset.latestScore || '—'} `
               : '装备分析';
           });
        }

        // --- 设置按钮功能 (仅分析面板) ---
        if (settingsBtn) {
            settingsBtn.addEventListener('click', () => {
                createSettingsPanel();
            });
        }

        // --- 关闭功能 ---
        closeBtn.addEventListener('click', () => {
            panel.remove();
            if (panel.id === 'equip-analysis-panel') {
                analysisPanel = null;
                // 记录用户已主动关闭，阻止下次自动弹出
                isUserClosed = true;
            } else if (panel.id === 'settings-panel') {
                settingsPanel = null;
            }
        });
    }

    /**
      * 创建或获取浮动分析面板
      */
    function getOrCreatePanel() {
        // 【新增检查】如果用户已主动关闭，则阻止面板创建和显示
        if (isUserClosed) {
            return null;
        }

        if (analysisPanel) {
            return analysisPanel;
        }

        const panel = document.createElement('div');
        panel.id = 'equip-analysis-panel';

        // 默认位置根据 SCALE_FACTOR 调整
        const defaultWidth = 340;
        const scaledWidth = defaultWidth * SCALE_FACTOR;
        panel.style.left = (window.innerWidth - 20 - scaledWidth) + 'px';
        panel.style.top = '150px';

        panel.innerHTML = `
             <div class="analysis-header">
                 <span>装备分析</span>
                 <div class="header-controls">
                     <button id="settings-btn" title="设置">⚙️</button>
                     <button id="minimize-btn" title="最小化/恢复">―</button>
                     <button id="close-btn" title="关闭">✕</button>
                 </div>
             </div>
             <div class="analysis-content">
                 <p>等待暗金装备数据...</p>
             </div>
         `;
        document.body.appendChild(panel);
        setupPanelListeners(panel);
        analysisPanel = panel;
        return analysisPanel;
    }

    /**
     * 创建并显示设置面板
     */
    function createSettingsPanel() {
        if (settingsPanel) {
            settingsPanel.style.display = 'block';
            return;
        }

        const panel = document.createElement('div');
        panel.id = 'settings-panel';

        // 默认位置在分析面板旁边
        const defaultWidth = 340;
        const scaledWidth = defaultWidth * SCALE_FACTOR;
        panel.style.left = (window.innerWidth - 40 - scaledWidth * 2) + 'px';
        panel.style.top = '150px';
        panel.style.display = 'block';

        const nonCoreWeightPercent = (NON_CORE_PROPS_WEIGHT * 100).toFixed(0);
        const traitPenaltyPercent = (TRAIT_MISMATCH_PENALTY * 100).toFixed(0);

        panel.innerHTML = `
            <div class="settings-header">
                <span>评分设置与规则</span>
                <div class="header-controls">
                    <button id="settings-close-btn" title="关闭">✕</button>
                </div>
            </div>
            <div class="settings-content">
                <p class="stat-title">评分权重设置 (百分比):</p>
                
                <label for="nonCoreWeight">
                    非核心属性得分比例: 
                    <span id="nonCoreWeightDisplay" class="grow">${nonCoreWeightPercent}%</span>
                </label>
                <input type="range" id="nonCoreWeight" min="0" max="100" step="5" value="${nonCoreWeightPercent}">
                <p style="margin-top: ${5 * SCALE_FACTOR}px; color:#bdc3c7; font-size: ${12 * SCALE_FACTOR}px;">
                    (非核心属性满分 = 核心属性基础权重 × 此比例)
                </p>

                <label for="traitPenalty">
                    词条未命中惩罚比例: 
                    <span id="traitPenaltyDisplay" class="grow">${traitPenaltyPercent}%</span>
                </label>
                <input type="range" id="traitPenalty" min="0" max="100" step="5" value="${traitPenaltyPercent}">
                <p style="margin-top: ${5 * SCALE_FACTOR}px; color:#bdc3c7; font-size: ${12 * SCALE_FACTOR}px;">
                    (未命中关键词得分 = 词条概率 × 3分 × 此比例)
                </p>

                <button id="saveSettingsBtn" class="darkGold" style="margin-top: ${15 * SCALE_FACTOR}px; padding: ${6 * SCALE_FACTOR}px ${12 * SCALE_FACTOR}px; border: 1px solid #f39c12; background: #e67e22; color: #2c3e50; border-radius: 4px; cursor: pointer;">
                    保存设置并应用 (需重开装备面板)
                </button>

                <p class="stat-title" style="margin-top: ${25 * SCALE_FACTOR}px; color: #f39c12;">当前计分规则:</p>
                <div class="rule-box">
                    <p><strong>基础属性满分:</strong> ${MAX_CORE_SCORE.toFixed(1)}分 (均分给所有暗金属性)</p>
                    <p><strong>核心属性得分:</strong> 基础权重 × 属性完美度 (Roll) [0-100%]</p>
                    <p><strong>非核心属性得分:</strong> 基础权重 × 属性完美度 × <span id="ruleNonCoreWeight">${NON_CORE_PROPS_WEIGHT.toFixed(2)}</span></p>
                    <p><strong>属性超限加分:</strong> 额外 +0.5 基础权重 (仅核心属性)</p>
                    <p style="margin-top: ${8 * SCALE_FACTOR}px;"><strong>词条满分:</strong> ${3.0.toFixed(1)}分 (命中关键词)</p>
                    <p><strong>词条命中关键词得分:</strong> 词条概率 × ${3.0.toFixed(1)}分</p>
                    <p><strong>词条未命中关键词得分:</strong> 词条概率 × ${3.0.toFixed(1)}分 × <span id="ruleTraitPenalty">${TRAIT_MISMATCH_PENALTY.toFixed(2)}</span></p>
                </div>
            </div>
        `;
        document.body.appendChild(panel);
        settingsPanel = panel;
        setupPanelListeners(panel);

        const nonCoreInput = panel.querySelector('#nonCoreWeight');
        const nonCoreDisplay = panel.querySelector('#nonCoreWeightDisplay');
        const traitPenaltyInput = panel.querySelector('#traitPenalty');
        const traitPenaltyDisplay = panel.querySelector('#traitPenaltyDisplay');
        const saveBtn = panel.querySelector('#saveSettingsBtn');
        const ruleNonCoreWeight = panel.querySelector('#ruleNonCoreWeight');
        const ruleTraitPenalty = panel.querySelector('#ruleTraitPenalty');

        const updateDisplays = () => {
            const ncVal = parseInt(nonCoreInput.value) / 100;
            const tpVal = parseInt(traitPenaltyInput.value) / 100;
            nonCoreDisplay.textContent = `${nonCoreInput.value}%`;
            traitPenaltyDisplay.textContent = `${traitPenaltyInput.value}%`;
            ruleNonCoreWeight.textContent = ncVal.toFixed(2);
            ruleTraitPenalty.textContent = tpVal.toFixed(2);
        };

        nonCoreInput.addEventListener('input', updateDisplays);
        traitPenaltyInput.addEventListener('input', updateDisplays);
        
        saveBtn.addEventListener('click', () => {
            const newNonCoreWeight = parseInt(nonCoreInput.value) / 100;
            const newTraitPenalty = parseInt(traitPenaltyInput.value) / 100;
            saveSettings(newNonCoreWeight, newTraitPenalty);
            // 立即更新规则显示
            updateDisplays();
        });

        // 确保初次加载时规则显示正确
        updateDisplays();
    }


    /**
     * 渲染合并后的属性 HTML (使用内联样式进行字体缩放)
     */
    function renderCombinedPropsHTML(combinedProps) {
        if (!Array.isArray(combinedProps)) return '';

        const scaledSmallFontSize = 11 * SCALE_FACTOR;

        return combinedProps.map(prop => {
            const isIgnored = !!prop.isIgnored; // 只对真正忽略的属性划线
            const baseStyle = isIgnored ? 'text-decoration: line-through; opacity: 0.6;' : '';
            // ★ 非核心属性：很暗的灰色 + 轻微透明
            const nonCoreStyle = (!prop.isCore && !isIgnored) ? 'color:#8b9099; opacity:0.7;' : '';
            const nameClass = prop.isCore ? 'grow' : ''; // 核心属性保留绿色，非核心走灰色样式
            const quality = prop.maxRoll
            ? `（属性完美度 ${(Math.min(prop.value / prop.maxRoll, 1) * 100).toFixed(1)}%）`
            : '';

            return `
            <p style="margin:${2 * SCALE_FACTOR}px 0; ${baseStyle} ${nonCoreStyle}">
                <span class="${nameClass}">${prop.name}</span>：<span>${prop.value}</span>
                <span style="font-size: ${scaledSmallFontSize}px; color: #bdc3c7;">${quality}</span>
                ${prop.isOverRoll ? `<span style="margin-left:${6 * SCALE_FACTOR}px;color:#2ecc71; font-size: ${scaledSmallFontSize}px;">（超限加分）</span>` : ''}
            </p>
            `;
        }).join('');
    }


    /**
      * 更新面板内容
      */
    function updatePanelContent(equipData, buildInfo, scoreResult) {
        const traitOneMatched = buildInfo.primaryKeywords?.includes(equipData.traitOne?.name);
        const traitTwoMatched = buildInfo.primaryKeywords?.includes(equipData.traitTwo?.name);

        const traitOneClass = traitOneMatched ? 'grow' : '';
        const traitTwoClass = traitTwoMatched ? 'grow' : '';

        const panel = getOrCreatePanel();
        if (!panel) return;
        const contentDiv = panel.querySelector('.analysis-content');

        const corePropsScoreMax = MAX_CORE_SCORE;
        const traitScoreMax = 3.0;

        // 1) 确保面板可见
        panel.style.display = 'block';
        const minimized = panel.classList.contains('minimized');
        panel.querySelector('#minimize-btn').textContent = minimized ? '🗗' : '―';

        // 2) 基础属性列表 HTML
        const combinedPropsHTML = renderCombinedPropsHTML(scoreResult.combinedProps);

        // 3) 部位关键词（“符”按“戒指”处理）
        let recommendationType = equipData.type;
        if (recommendationType === '符') recommendationType = '戒指';
        // ★ 使用 buildInfo.keywords
        const keywordsBySlot = (buildInfo.keywords && buildInfo.keywords[recommendationType])
            ? buildInfo.keywords[recommendationType]
            : '该部位无特定关键词';

        // 4) 常用变量
        const icon = EQUIP_ICONS[equipData.type] || '✨';
        const coreBaseScore = parseFloat(scoreResult.coreBaseScore);
        const coreBonusScore = parseFloat(scoreResult.coreBonusScore);
        const totalScore = parseFloat(scoreResult.totalScore);
        const coreRatio = (coreBaseScore / corePropsScoreMax) || 0;

        // 原始字符串
        const recBuildsTextRaw = buildInfo.builds || '';
        const backupBuildsTextRaw = buildInfo.backupBuilds || '';

        // 规范化为数组
        const primaryList = recBuildsTextRaw.split('、').map(s => s.trim()).filter(Boolean);
        const backupListRaw = backupBuildsTextRaw.split('、').map(s => s.trim()).filter(Boolean);

        // 过滤：去掉与推荐重复的、去掉空串、去重
        const backupListFiltered = Array.from(new Set(
        backupListRaw.filter(b => !primaryList.includes(b))
        ));

        const recBuildsText = primaryList.length ? primaryList.join('、') : '无';
        const backupBuildsText = backupListFiltered.length ? backupListFiltered.join('、') : '无';

        // 字体大小调整
        const scaledTitleFontSize = 16 * SCALE_FACTOR;
        const scaledInfoMargin = 5 * SCALE_FACTOR;


        // 5) 面板内容
        const contentHTML = `
            <p style="font-size: ${scaledTitleFontSize}px; margin-bottom: ${10 * SCALE_FACTOR}px; border-bottom: 1px solid rgba(255, 255, 255, 0.1); padding-bottom: ${5 * SCALE_FACTOR}px;">
            ${icon} <span class="darkGold">${equipData.name}</span>
            </p>

            <p style="margin-top: ${10 * SCALE_FACTOR}px; font-weight: bold; color: #ff6600;">
            总评分：<span class="grow">${totalScore.toFixed(2)}</span>
            </p>

            <p style="margin: ${scaledInfoMargin}px 0 0 0;">
            <span style="font-weight: bold; color: #bdc3c7;">基础属性得分：</span>
            <span class="${coreRatio > 0.6 ? 'grow' : 'warning'}">${coreBaseScore.toFixed(2)}</span>
            <span style="color:#bdc3c7;"> / ${corePropsScoreMax.toFixed(0)}</span>
            </p>

            <p class="stat-title">基础属性:</p>
            ${combinedPropsHTML}

            ${coreBonusScore > 0.01 ? `
            <p style="margin: ${scaledInfoMargin}px 0 0 0;">
                <span style="font-weight: bold; color: #2ecc71;">超限精造加分:</span>
                <span class="grow">+${coreBonusScore.toFixed(2)}</span>
            </p>
            ` : ''}

            <p class="stat-title" style="color: #f39c12;">流派词条得分:</p>

            <p style="color: #bdc3c7; margin-top: ${scaledInfoMargin}px;">
            自带词条 (<span class="${traitOneClass}">${(equipData.traitOne && equipData.traitOne.name) || '无'}</span>) 概率：
            <span class="darkGold">${(equipData.traitOne && equipData.traitOne.probability) ?? 0}%</span>
            得分: ${scoreResult.traitOneScore} / ${traitScoreMax.toFixed(1)}
            </p>

            <p style="color: #bdc3c7; margin-top: ${6 * SCALE_FACTOR}px;">
            刻印词条 (<span class="${traitTwoClass}">${(equipData.traitTwo && equipData.traitTwo.name) || '无'}</span>) 概率：
            <span class="darkGold">${(equipData.traitTwo && equipData.traitTwo.probability) ?? 0}%</span>
            得分: ${scoreResult.traitTwoScore} / ${traitScoreMax.toFixed(1)}
            </p>

            <p style="margin-top:${8 * SCALE_FACTOR}px;">推荐流派：<span class="grow">${recBuildsText}</span></p>
            <p>备用流派：<span class="grow">${backupBuildsText}</span></p>

            <p>核心属性：<span class="grow">${buildInfo.core}</span></p>
            <p style="margin-bottom: 0;">
            部位关键词 (<span class="darkGold">${equipData.type || '未知部位'}</span>)：
            <span class="grow">${keywordsBySlot}</span>
            </p>
        `;

        contentDiv.innerHTML = contentHTML;

        // 6) 更新标题（最小化时显示分数）
        panel.dataset.latestScore = totalScore.toFixed(2);
        const headerTitle = panel.querySelector('.analysis-header span');
        headerTitle.textContent = panel.classList.contains('minimized')
            ? `得分 ${panel.dataset.latestScore}`
            : '装备分析';
    }

    /**
      * 当未匹配到流派时，更新面板内容为提示信息。
      */
    function updatePanelForNoBuild(equipData) {
        const panel = getOrCreatePanel();
        if (!panel) return;
        const contentDiv = panel.querySelector('.analysis-content');

        // 1) 确保面板可见
        panel.style.display = 'block';
        const icon = EQUIP_ICONS[equipData.type] || '✨';
        const scaledTitleFontSize = 16 * SCALE_FACTOR;
        const scaledWarningFontSize = 15 * SCALE_FACTOR;
        const scaledMargin = 10 * SCALE_FACTOR;

        // 2) 更新内容
        const contentHTML = `
            <p style="font-size: ${scaledTitleFontSize}px; margin-bottom: ${scaledMargin}px; border-bottom: 1px solid rgba(255, 255, 255, 0.1); padding-bottom: ${5 * SCALE_FACTOR}px;">
            ${icon} <span class="darkGold">${equipData.name || '未知装备'}</span>
            </p>
            <p class="warning" style="font-weight: bold; font-size: ${scaledWarningFontSize}px;">
            ❌ 未匹配到任何流派
            </p>
            <p style="margin-top: ${scaledMargin}px; color: #bdc3c7;">
            当前装备词条：
            <span class="darkGold">${(equipData.traitOne && equipData.traitOne.name) || '无'}</span>
            、
            <span class="darkGold">${(equipData.traitTwo && equipData.traitTwo.name) || '无'}</span>
            </p>
            <p style="color: #bdc3c7;">
            根据部位关键词，没有找到匹配的流派。
            </p>
        `;

        contentDiv.innerHTML = contentHTML;

        // 3) 更新标题
        panel.dataset.latestScore = '—';
        const headerTitle = panel.querySelector('.analysis-header span');
        headerTitle.textContent = panel.classList.contains('minimized')
            ? `得分 —`
            : '装备分析（无匹配流派）';
    }

    /**
     * 主函数：处理装备面板并触发浮动面板显示
     */
    function showAnalysisPanel(wrap) {
         // 1) 只处理暗金/神话（标题 p.darkGold / p.myth）
        if (!isDarkOrMythPanel(wrap)) {
        if (analysisPanel) analysisPanel.style.display = 'none';
        lastEquipWrap = null;
        return;
        }


        // ★ 用“快速指纹”判定是否是另一件暗金（零拷贝、零解析）
        const curSignature = quickEquipSignature(wrap);

        // 如果还是同一件且用户曾主动关闭，则不再弹出
        if (isUserClosed && curSignature === lastEquipSignature) {
            if (analysisPanel) analysisPanel.style.display = 'none';
            return;
        }

        // 只要换了“另一件暗金”，才允许重新弹出
        if (curSignature !== lastEquipSignature) {
            isUserClosed = false;
            lastEquipSignature = curSignature;
            lastEquipWrap = wrap; // 兼容保留
        }

        // ——从这里开始，继续使用 v1.6 原有流程：解析 → 识别流派 → 打分 → 渲染——
        const equipData = parseEquipData(wrap);
        if (!equipData.name || equipData.name.includes('...')) {
            if (analysisPanel) analysisPanel.style.display = 'none';
            return;
        }

        const buildInfo = identifyBuilds(equipData);
        if (buildInfo && buildInfo.strategy === 'none') {
            updatePanelForNoBuild(equipData);
            return;
        }
        if (buildInfo.strategy === 'need_candidates' && buildInfo.candidates) {
            const candidateBuilds = buildInfo.candidates;
            if (candidateBuilds.length > 0) {
                let best = { name: '', info: null, score: -Infinity, scoreResult: null };
                for (const candidate of candidateBuilds) {
                    const name = candidate.buildName;
                    const info = candidate.info;
                    const tmpInfo = {
                        core: info.core,
                        keywords: info.keywords,
                        primaryKeywords: info.effectiveKeywords
                    };
                    const s = calculateScore(equipData, tmpInfo);
                    const total = parseFloat(s.totalScore);
                    if (total > best.score) best = { name, info, score: total, scoreResult: s };
                }
                const finalBuildInfo = {
                    builds: best.name,
                    backupBuilds: buildInfo.backupBuilds,
                    core: best.info.core,
                    keywords: best.info.keywords,
                    primaryKeywords: best.info.effectiveKeywords,
                    isSpecial: false,
                    strategy: 'resolved_by_candidates'
                };
                updatePanelContent(equipData, finalBuildInfo, best.scoreResult);
                return;
            } else {
                updatePanelForNoBuild(equipData);
                return;
            }
        }

        const scoreResult = calculateScore(equipData, buildInfo);
        updatePanelContent(equipData, buildInfo, scoreResult);
    }



    // =======================================================================
    // 5. 观察者逻辑 (MutationObserver)
    // =======================================================================

    /**
     * 观察者：监听页面装备面板的出现
     */
    const observer = new MutationObserver(function(mutations) {
        let isDarkGoldPanelVisible = false;

        mutations.forEach(function(mutation) {
            if (mutation.type === 'childList') {
                mutation.addedNodes.forEach(node => {
                    if (node.nodeType === 1) {
                        // 查找 .equip-info.affix
                        const equipWrap = node.closest?.('.equip-info.affix') || node.querySelector?.('.equip-info.affix');
                        if (equipWrap && isDarkOrMythPanel(equipWrap)) {
                        showAnalysisPanel(equipWrap);
                        isDarkGoldPanelVisible = true;
                        }

                    }
                });
            }
        });

                // 兜底逻辑：如果本轮没检测到暗金面板，且页面上也没有“真可见”的暗金/神话面板，则隐藏浮动面板
        if (!isDarkGoldPanelVisible && analysisPanel && analysisPanel.style.display !== 'none') {
        const allEquipPanels = document.querySelectorAll('.equip-info.affix');
        const hasActiveDarkGoldPanel = Array.from(allEquipPanels).some((p) => {
            const popper = p.closest('.el-popper');
            const visible = popper ? isVisible(popper) : isVisible(p);
            return visible && isDarkOrMythPanel(p);
        });

        if (!hasActiveDarkGoldPanel) {
            analysisPanel.style.display = 'none';
            lastEquipWrap = null;
        }
        }

    });
    // =======================================================================
    // 6. 初始化
    //=======================================================================

    // 1. 注入 CSS 样式
    injectStyles();

    // --- 可见性判断 ---
    function isVisible(el) {
    if (!el) return false;
    const style = window.getComputedStyle(el);
    if (style.display === 'none' || style.visibility === 'hidden' || style.opacity === '0') return false;
    // offsetParent 为 null 通常意味着元素或其祖先被 display:none / position:fixed 且无尺寸等
    if (el.offsetParent === null && style.position !== 'fixed') return false;
    const rect = el.getBoundingClientRect();
    if (rect.width <= 0 || rect.height <= 0) return false;
    // 至少有一部分在视口内（避免离屏/被移走也算“可见”）
    const inViewport = rect.bottom > 0 && rect.right > 0 && rect.top < (window.innerHeight || document.documentElement.clientHeight) && rect.left < (window.innerWidth || document.documentElement.clientWidth);
    return inViewport;
    }

    function isDarkOrMythPanel(wrap) {
    // 标题 <p> 可能是 p.darkGold 或 p.myth
    const titleP = wrap.querySelector('p:first-child');
    if (!titleP) return false;
    const cl = titleP.classList;
    // 1) 直接在 p 上的类
    const hitOnP = cl.contains('darkGold') || cl.contains('myth') || cl.contains('mythicalGold');
    if (hitOnP) return true;
    // 2) 兼容：某些主题会把标色类挂在内部元素
    return !!wrap.querySelector('p:first-child .darkGold, p:first-child .myth, p:first-child .mythicalGold');
    }



    // --- 兜底扫描：对所有可见的装备面板触发评分 ---
    function scanAllEquipPanels() {
    const all = Array.from(document.querySelectorAll('.equip-info.affix'));

    // 过滤出“真可见”的候选：popper 看 popper，可嵌入的看自身
    const visibleCandidates = all.filter((wrap) => {
        const popper = wrap.closest('.el-popper');
        if (popper) return isVisible(popper);
        return isVisible(wrap);
    });

    // 优先级：当前交互来源 > 可见 popper > 其它可见
    let target = null;

    if (currentSourceWrap && visibleCandidates.includes(currentSourceWrap)) {
        target = currentSourceWrap;
    } else {
        const visiblePoppers = visibleCandidates.filter(w => w.closest('.el-popper'));
        if (visiblePoppers.length) {
        target = visiblePoppers[visiblePoppers.length - 1]; // DOM 末尾更可能是最新弹出
        } else if (visibleCandidates.length) {
        target = visibleCandidates[visibleCandidates.length - 1];
        }
    }

    if (target) {
        // 防抖：如果目标本体/其 popper 不再真可见则不展示
        const popper = target.closest('.el-popper');
        if ((popper && !isVisible(popper)) || (!popper && !isVisible(target))) {
        return;
        }
        showAnalysisPanel(target);
    } else {
        // 没有任何真可见候选 → 关闭评分面板并重置
        if (analysisPanel) analysisPanel.style.display = 'none';
        lastEquipWrap = null;
        lastEquipSignature = null;
    }
    }


    // --- 监听 el-popper 显隐（style/class/aria-hidden 变化）---
    const popperAttributesObserver = new MutationObserver((mutations) => {
        for (const m of mutations) {
            if (m.type === 'attributes' && ['style', 'class', 'aria-hidden'].includes(m.attributeName)) {
                scanAllEquipPanels();
                break;
            }
        }
    });

    // --- 给当前页所有 el-popper 装上属性监听 ---
    function attachPopperObservers() {
        document.querySelectorAll('.el-popper').forEach((el) => {
            popperAttributesObserver.observe(el, {
                attributes: true,
                attributeFilter: ['style', 'class', 'aria-hidden'],
                subtree: true
            });
        });
    }

    // --- 监听后续新创建的 el-popper（例如打开新弹层时）---
    const popperCreationObserver = new MutationObserver((mutations) => {
        let foundNewPopper = false;
        mutations.forEach((mutation) => {
            mutation.addedNodes.forEach((node) => {
                if (node.nodeType === 1) {
                    if (node.classList.contains('el-popper') || node.querySelector?.('.el-popper')) {
                        foundNewPopper = true;
                    }
                }
            });
        });
        if (foundNewPopper) {
            attachPopperObservers(); // 给新弹层挂监听
            scanAllEquipPanels();    // 立即扫描评分
        }
    });
    popperCreationObserver.observe(document.body, { childList: true, subtree: true });


    // 【优化】为所有平台加延迟扫描，确保装备面板加载完成后再识别
    const DELAY_MS = 120; // 延迟毫秒数，可自行调整
    let currentSourceWrap = null; // 记录最近一次交互命中的 equip 面板

    function markSourceFromEvent(e) {
    const t = e.target;
    if (!t || !t.closest) return;
    const wrap = t.closest('.equip-info.affix');
    if (wrap) currentSourceWrap = wrap;
    }

    document.addEventListener('click', (e) => {
    markSourceFromEvent(e);
    setTimeout(scanAllEquipPanels, DELAY_MS);
    }, true);

    document.addEventListener('touchstart', (e) => {
    markSourceFromEvent(e);
    setTimeout(scanAllEquipPanels, DELAY_MS);
    }, true);



    // --- 启动 ---\
    window.addEventListener('load', () => {
        // 保留原有主体观察（新增节点仍可触发评分）
        observer.observe(document.body, { childList: true, subtree: true });

        // 初始化：给现有 el-popper 安装显隐监听，并做一次全量扫描
        attachPopperObservers();
        scanAllEquipPanels();

        console.log('暗金装备评分脚本已启用：含 el-popper 显隐监听与兜底扫描。');
    });
})();