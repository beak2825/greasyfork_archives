// ==UserScript==
// @name         文达-Futbin Futgg中文翻译插件 - WonderFut
// @namespace    http://tampermonkey.net/
// @version      0.83
// @description  在常用的FC UT攻略网站 fut.gg、futbin.com 和 easysbc.io 上自动为指定名词添加中文翻译
// @author       （开发）御羽卓一 yuyuzhuoyi & （翻译）FC冰红茶
// @match        https://fut.gg/*
// @match        https://www.fut.gg/*
// @match        https://www.futbin.com/*
// @match        https://futbin.com/*
// @match        https://www.easysbc.io/*
// @match        https://easysbc.io/*
// @match        https://www.ea.com/ea-sports-fc/ultimate-team/web-app/*
// @grant        none
// @license      CC BY-NC 4.0
// @downloadURL https://update.greasyfork.org/scripts/556098/%E6%96%87%E8%BE%BE-Futbin%20Futgg%E4%B8%AD%E6%96%87%E7%BF%BB%E8%AF%91%E6%8F%92%E4%BB%B6%20-%20WonderFut.user.js
// @updateURL https://update.greasyfork.org/scripts/556098/%E6%96%87%E8%BE%BE-Futbin%20Futgg%E4%B8%AD%E6%96%87%E7%BF%BB%E8%AF%91%E6%8F%92%E4%BB%B6%20-%20WonderFut.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // ==================== 翻译词典配置 ====================
    // 版本 0.3：支持专业术语和玩家常用说法两种模式

    // 翻译模式开关：true = 使用玩家常用说法，false = 使用专业术语
    const usePlayerSlang = true; // 修改此值为 true 可切换为玩家常用说法

    // 是否在中文后面显示原文和括号
    // true  => "中文 (English)" / "民间叫法(官方翻译)"
    // false => 只显示中文或民间叫法，不带括号和原文
    const showOriginalWithBrackets = false;

    // 翻译词典：每个词条包含专业术语和玩家常用说法两种翻译
    const translationDict = {
        // 化学
        'Wall': {
            professional: '铜墙铁壁',
            playerSlang: '铜墙铁壁'
        },
        'Glove': {
            professional: '手套',
            playerSlang: '手套'
        },
        'Shield': {
            professional: '盾',
            playerSlang: '盾'
        },
        'Cat': {
            professional: '猫',
            playerSlang: '猫'
        },
        'Anchor': {
            professional: '中流砥柱',
            playerSlang: '锚'
        },
        'Architect': {
            professional: '建筑师',
            playerSlang: '建筑师'
        },
        'Artist': {
            professional: '艺术家',
            playerSlang: '艺术家'
        },
        'Backbone': {
            professional: '主心骨',
            playerSlang: '主心骨'
        },
        'Basic': {
            professional: '基础',
            playerSlang: '基础'
        },
        'Catalyst': {
            professional: '催化剂',
            playerSlang: '催化剂'
        },
        'Deadeye': {
            professional: '神枪手',
            playerSlang: '死眼'
        },
        'Engine': {
            professional: '发动机',
            playerSlang: '引擎'
        },
        'Finisher': {
            professional: '终结者',
            playerSlang: '终结者'
        },
        'Gladiator': {
            professional: '角斗士',
            playerSlang: '角斗士'
        },
        'Guardian': {
            professional: '守护者',
            playerSlang: '守护者'
        },
        'Hawk': {
            professional: '鹰',
            playerSlang: '鹰'
        },
        'Hunter': {
            professional: '猎手',
            playerSlang: '猎手'
        },
        'Maestro': {
            professional: '大师',
            playerSlang: '大师'
        },
        'Marksman': {
            professional: '神射手',
            playerSlang: '神射手'
        },
        'Powerhouse': {
            professional: '发动机',
            playerSlang: '发动机'
        },
        'Sentinel': {
            professional: '哨兵',
            playerSlang: '哨兵'
        },
        'Shadow': {
            professional: '影子',
            playerSlang: '影子'
        },
        'Sniper': {
            professional: '狙击手',
            playerSlang: '狙击手'
        },

        
        // 比赛风格/技能
        'Finesse Shot': {
            professional: '推射',
            playerSlang: '搓射'
        },
        'Chip Shot': {
            professional: '吊射',
            playerSlang: '吊射'
        },
        'Power Shot': {
            professional: '大力射门',
            playerSlang: '大力射门'
        },
        'Dead Ball': {
            professional: '死球',
            playerSlang: '定位球射门'
        },
        'Precision Header': {
            professional: '精准头球',
            playerSlang: '头球射门'
        },
        'Acrobatic': {
            professional: '杂耍',
            playerSlang: '花式射门'
        },
        'Low Driven Shot': {
            professional: '大力低射',
            playerSlang: '低射'
        },
        'Game Changer': {
            professional: '颠覆者',
            playerSlang: '外脚背射门'
        },
        'Gamechanger': {
            professional: '颠覆者',
            playerSlang: '外脚背射门'
        },
        'Whipped Pass': {
            professional: '弧线传中',
            playerSlang: '弧线传中'
        },
        'Inventive': {
            professional: '别出心裁(独辟蹊径)',
            playerSlang: '花哨传球'
        },
        'Tiki Taka': {
            professional: 'Tiki Taka',
            playerSlang: 'Tiki Taka'
        },
        'Long Ball Pass': {
            professional: '远距离传球',
            playerSlang: '长传'
        },
        'Pinged Pass': {
            professional: '大力传球',
            playerSlang: '大力传球'
        },
        'Incisive Pass': {
            professional: '切入传球',
            playerSlang: '直塞'
        },
        'Jockey': {
            professional: '跟防',
            playerSlang: '螃蟹步'
        },
        'Block': {
            professional: '封堵',
            playerSlang: '封堵'
        },
        'Intercept': {
            professional: '拦截',
            playerSlang: '钩子'
        },
        'Anticipate': {
            professional: '预判',
            playerSlang: '狐狸'
        },
        'Slide Tackle': {
            professional: '滑铲',
            playerSlang: '滑铲'
        },
        'Aerial Fortress': {
            professional: '空中堡垒',
            playerSlang: '空中堡垒'
        },
        'Technical': {
            professional: '技术',
            playerSlang: '游龙'
        },
        'Rapid': {
            professional: '灵动迅捷',
            playerSlang: '跑跑'
        },
        'First Touch': {
            professional: '第一脚触球',
            playerSlang: '磁铁'
        },
        'Trickster': {
            professional: '诡术师',
            playerSlang: '魔术师'
        },
        'Press Proven': {
            professional: '紧逼好手',
            playerSlang: '紧逼好手'
        },
        'Quick Step': {
            professional: '健步如飞',
            playerSlang: '火箭'
        },
        'Relentless': {
            professional: '坚持不懈',
            playerSlang: '电池'
        },
        'Long Throw': {
            professional: '远距离界外球',
            playerSlang: '手抛球'
        },
        'Bruiser': {
            professional: '斗士',
            playerSlang: '肌肉'
        },
        'Enforcer': {
            professional: '执行者',
            playerSlang: '护球盘带'
        },
        'Far Throw': {
            professional: '远距离抛球',
            playerSlang: '门将抛球'
        },
        'Footwork': {
            professional: '步法',
            playerSlang: '用脚扑救'
        },
        'Cross Claimer': {
            professional: '传中没收者',
            playerSlang: '传中拦截'
        },
        'Rush Out': {
            professional: '1对1紧逼',
            playerSlang: '出击'
        },
        'Far Reach': {
            professional: '远距离出击',
            playerSlang: '拦远射'
        },
        'Deflector': {
            professional: '偏转',
            playerSlang: '击球出界'
        }
    };

    // 角色词条列表，供 futbin 页面做定向匹配（从Google Sheet动态加载）
    let roleTerms = new Set();

    const isFutbinHost = location.hostname.indexOf('futbin.com') !== -1;
    const futbinPlayerPathRegex = /^\/\d+\/player\/\d+/;

    function isFutbinPlayerDetailsPage() {
        return isFutbinHost && futbinPlayerPathRegex.test(location.pathname);
    }

    function isTextNodeInsideFutbinRoleList(textNode) {
        if (!isFutbinPlayerDetailsPage()) {
            return false;
        }
        if (!textNode || textNode.nodeType !== Node.TEXT_NODE) {
            return false;
        }
        const parentElement = textNode.parentElement;
        if (!parentElement) {
            return false;
        }
        const roleAnchor = parentElement.closest('a[href*="/roles"]');
        if (!roleAnchor) {
            return false;
        }
        const rowWrapper = roleAnchor.closest('.xxs-row.align-center');
        const listContainer = roleAnchor.closest('.xs-row.flex-wrap');
        return Boolean(rowWrapper && listContainer);
    }

    function canTranslateRoleTermInNode(textNode) {
        if (!isFutbinHost) {
            return true;
        }
        return isTextNodeInsideFutbinRoleList(textNode);
    }

    // 化学风格词条列表，只在 futbin 球员详情页特定位置翻译
    const chemistryStyleTerms = new Set([
        'Wall',
        'Glove',
        'Shield',
        'Cat',
        'Anchor',
        'Architect',
        'Artist',
        'Backbone',
        'Basic',
        'Catalyst',
        'Deadeye',
        'Engine',
        'Finisher',
        'Gladiator',
        'Guardian',
        'Hawk',
        'Hunter',
        'Maestro',
        'Marksman',
        'Powerhouse',
        'Sentinel',
        'Shadow',
        'Sniper'
    ]);

    // 仅允许在球员详情页中示例 HTML 所示的三处区域翻译化学风格英文
    function canTranslateChemistryStyleInNode(textNode) {
        if (!isFutbinPlayerDetailsPage()) {
            return false;
        }
        if (!textNode || textNode.nodeType !== Node.TEXT_NODE) {
            return false;
        }
        const parentElement = textNode.parentElement;
        if (!parentElement) {
            return false;
        }

        // 示例 1：当前已选化学风格（div.xxs-row.align-center.bold 内，带 chemistryIcon 的 svg 旁的文本）
        const chemistryHeader = parentElement.closest('div.xxs-row.align-center.bold');
        if (chemistryHeader && chemistryHeader.querySelector('svg.chemistryIcon')) {
            return true;
        }

        // 示例 2/3：化学风格按钮列表（button.chem-style-button.chem-style-type 内，带 chemistryIcon 的 svg 旁的文本）
        const chemistryButton = parentElement.closest('button.chem-style-button.chem-style-type');
        if (chemistryButton && chemistryButton.querySelector('svg.chemistryIcon')) {
            return true;
        }

        return false;
    }

    // 根据开关选择当前使用的翻译词典
    const translations = {};
    for (const [english, translations_obj] of Object.entries(translationDict)) {
        translations[english] = usePlayerSlang ? translations_obj.playerSlang : translations_obj.professional;
    }
    // ==================== 翻译词典配置结束 ====================

    const sixStatSheetUrl = 'https://docs.google.com/spreadsheets/d/11MELa9ps6Eulr-82bw_gXP5owuV4J6HYrGBOlxH44_E/export?format=csv&gid=0';
    // futbin 球员详情页 - 基本信息（Skills / Weak Foot / Height / Foot / Age / Squad 等）翻译表
    const futbinBasicInfoSheetUrl = 'https://docs.google.com/spreadsheets/d/11MELa9ps6Eulr-82bw_gXP5owuV4J6HYrGBOlxH44_E/export?format=csv&gid=1427260659';
    const futbinRoleSheetUrl = 'https://docs.google.com/spreadsheets/d/11MELa9ps6Eulr-82bw_gXP5owuV4J6HYrGBOlxH44_E/export?format=csv&gid=757113362';
    const roleSheetUrl = 'https://docs.google.com/spreadsheets/d/11MELa9ps6Eulr-82bw_gXP5owuV4J6HYrGBOlxH44_E/export?format=csv&gid=1284075031';

    let sixStatMap = null;
    let sixStatLoaded = false;
    let sixStatLoading = false;

    let futbinBasicInfoMap = null;
    let futbinBasicInfoLoaded = false;
    let futbinBasicInfoLoading = false;

    let futbinRoleMap = null;
    let futbinRoleLoaded = false;
    let futbinRoleLoading = false;

    let roleMap = null;
    let roleLoaded = false;
    let roleLoading = false;

    // 已处理的元素集合，避免重复处理
    const processedElements = new WeakSet();

    // 根据是否显示原文/括号来格式化最终展示文本
    function formatWithOptionalOriginal(mainText, originalText, options = {}) {
        const { noSpaceBeforeBracket = false } = options;

        if (!showOriginalWithBrackets || !originalText) {
            return mainText;
        }

        // 默认中文和括号之间带空格；部分地方（如“火箭(健步如飞)”）不需要空格
        const space = noSpaceBeforeBracket ? '' : ' ';
        return `${mainText}${space}(${originalText})`;
    }

    // 安全转义用于正则的特殊字符
    function escapeRegExp(str) {
        return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    }

    // futbin 球员详情页 - 阵容 / 卡面系列翻译加载状态（例如 Team of the Week / TOTW 等）
    let futbinSquadMap = null;
    let futbinSquadLoaded = false;
    let futbinSquadLoading = false;

    function loadSixStatTranslations() {
        if (sixStatLoaded || sixStatLoading) {
            return;
        }
        if (location.hostname.indexOf('futbin.com') === -1) {
            sixStatLoaded = true;
            sixStatMap = {};
            return;
        }
        sixStatLoading = true;
        fetch(sixStatSheetUrl)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.text();
            })
            .then(text => {
                const map = {};
                const lines = text.split(/\r?\n/);
                for (let i = 1; i < lines.length; i++) {
                    const line = lines[i];
                    if (!line) {
                        continue;
                    }
                    const parts = line.split(',');
                    if (parts.length < 2) {
                        continue;
                    }
                    const english = (parts[0] || '').trim();
                    const official = (parts[1] || '').trim();
                    const slang = (parts[2] || '').trim();
                    if (!english) {
                        continue;
                    }
                    let chinese = '';
                    if (usePlayerSlang) {
                        chinese = slang || official;
                    } else {
                        chinese = official || slang;
                    }
                    if (!chinese) {
                        continue;
                    }
                    map[english] = chinese;
                }
                sixStatMap = map;
                sixStatLoaded = true;
                if (Object.keys(sixStatMap).length > 0) {
                    applySixStatTranslations(document);
                }
            })
            .catch(() => {
                sixStatLoaded = true;
            });
    }

      // 载入 futbin 球员详情页「基本信息」翻译（Skills / Weak Foot / Height / Foot / Age / Squad 等）
      function loadFutbinBasicInfoTranslations() {
          if (futbinBasicInfoLoaded || futbinBasicInfoLoading) {
              return;
        }
        if (!isFutbinHost) {
            futbinBasicInfoLoaded = true;
            futbinBasicInfoMap = {};
            return;
        }
        futbinBasicInfoLoading = true;
        fetch(futbinBasicInfoSheetUrl)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.text();
            })
            .then(text => {
                const map = {};
                const lines = text.split(/\r?\n/);
                // 忽略第一行（标题行）
                for (let i = 1; i < lines.length; i++) {
                    const line = lines[i];
                    if (!line) {
                        continue;
                    }
                    const parts = line.split(',');
                    if (parts.length < 2) {
                        continue;
                    }
                    // 第一列是原文，第二列是官译，第三列是俗称
                    const english = (parts[0] || '').trim().replace(/^"|"$/g, '');
                    const official = (parts[1] || '').trim().replace(/^"|"$/g, '');
                    const slang = (parts[2] || '').trim().replace(/^"|"$/g, '');
                    if (!english) {
                        continue;
                    }
                    let chinese = '';
                    if (usePlayerSlang) {
                        chinese = slang || official;
                    } else {
                        chinese = official || slang;
                    }
                      if (!chinese) {
                          continue;
                      }
                      map[english] = chinese;
                  }
                  futbinBasicInfoMap = map;
                  futbinBasicInfoLoaded = true;
                  // 数据加载完成后，立即尝试翻译当前页面已存在的 Basic Info 区块
                  if (Object.keys(futbinBasicInfoMap).length > 0) {
                      applyFutbinBasicInfoTranslations(document);
                  }
              })
              .catch(() => {
                  futbinBasicInfoLoaded = true;
              });
      }

    // 载入 futbin 球员详情页「阵容 / 卡面系列」（Team of the Week / TOTW 等）翻译
    // 对应 Google Sheet：gid=1197755959
    function loadFutbinSquadTranslations() {
        if (futbinSquadLoaded || futbinSquadLoading) {
            return;
        }
        if (!isFutbinHost || !isFutbinPlayerDetailsPage()) {
            futbinSquadLoaded = true;
            futbinSquadMap = {};
            return;
        }

        futbinSquadLoading = true;
        fetch('https://docs.google.com/spreadsheets/d/11MELa9ps6Eulr-82bw_gXP5owuV4J6HYrGBOlxH44_E/export?format=csv&gid=1197755959')
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.text();
            })
            .then(text => {
                const map = {};
                const lines = text.split(/\r?\n/);
                // 忽略第一行（标题行）
                for (let i = 1; i < lines.length; i++) {
                    const line = lines[i];
                    if (!line) {
                        continue;
                    }
                    const parts = line.split(',');
                    if (parts.length < 2) {
                        continue;
                    }
                    // 第一列是原文，第二列是官译，第三列是俗称
                    const english = (parts[0] || '').trim().replace(/^"|"$/g, '');
                    const official = (parts[1] || '').trim().replace(/^"|"$/g, '');
                    const slang = (parts[2] || '').trim().replace(/^"|"$/g, '');

                    if (!english) {
                        continue;
                    }

                    let chinese = '';
                    if (usePlayerSlang) {
                        chinese = slang || official;
                    } else {
                        chinese = official || slang;
                    }
                    if (!chinese) {
                        continue;
                    }

                    map[english] = chinese;
                }

                futbinSquadMap = map;
                futbinSquadLoaded = true;
                if (Object.keys(futbinSquadMap).length > 0) {
                    // 初次加载完就对整页做一遍阵容翻译
                    applyFutbinSquadTranslations(document);
                }
            })
            .catch(() => {
                futbinSquadLoaded = true;
            });
    }

    function applySixStatTranslations(root) {
        if (!sixStatLoaded || !sixStatMap || !Object.keys(sixStatMap).length) {
            return;
        }
        if (!root) {
            root = document;
        }
        if (location.hostname.indexOf('futbin.com') === -1) {
            return;
        }
        const elements = root.querySelectorAll('div.player-stat-name.text-ellipsis');
        elements.forEach(el => {
            if (!el || el.dataset.sixStatTranslated === '1') {
                return;
            }
            const text = (el.textContent || '').trim();
            if (!text) {
                return;
            }
            const chinese = sixStatMap[text];
            if (!chinese) {
                return;
            }
            // 六维属性名称，根据配置决定是否保留原文和括号
            el.textContent = formatWithOptionalOriginal(chinese, text);
              el.dataset.sixStatTranslated = '1';
          });
      }

      // futbin 球员详情页 - 基本信息（Skills / Weak Foot / Height / Foot / Age / Squad 等）翻译
      // futbin 球员详情页 - 阵容 / 卡面系列（Team of the Week / TOTW9 等）翻译
    function applyFutbinSquadTranslations(root) {
        if (!futbinSquadLoaded || !futbinSquadMap || !Object.keys(futbinSquadMap).length) {
            return;
        }
        if (!root) {
            root = document;
        }
        if (!isFutbinPlayerDetailsPage()) {
            return;
        }

        // 帮助函数：把文字按「英文 + 可选尾部数字」拆开，然后查翻译
        function translateSquadText(text) {
            const original = (text || '').trim();
            if (!original) {
                return null;
            }

            // 把 "TOTW9" 分成 base="TOTW"，suffix="9"
            const match = original.match(/^([A-Za-z ]+?)(\d+)?$/);
            let base = original;
            let suffix = '';
            if (match) {
                base = match[1].trim();
                suffix = match[2] || '';
            }

            const chineseBase = futbinSquadMap[base];
            if (!chineseBase) {
                return null;
            }

            const main = suffix ? chineseBase + suffix : chineseBase;
            // 是否保留原文由全局开关控制
            return formatWithOptionalOriginal(main, original);
        }

        // 示例 1：页面顶部版本列表里的「Team of the Week」
        // <a class="xxs-row align-center green-text xs-font bold"><span class="text-ellipsis">Team of the Week</span></a>
        const versionSpans = root.querySelectorAll(
            'a.xxs-row.align-center.green-text.xs-font.bold span.text-ellipsis'
        );
        versionSpans.forEach(span => {
            if (!span || span.dataset.futbinSquadTranslated === '1') {
                return;
            }
            const newText = translateSquadText(span.textContent);
            if (!newText) {
                return;
            }
            span.textContent = newText;
            span.dataset.futbinSquadTranslated = '1';
        });

        // 示例 2：player-info 基本信息里的 Squad 行（例如 "TOTW9"）
        // <div class="xxs-row xxs-font align-center">
        //   <div class="xxs-font uppercase text-faded">Squad</div>
        //   <a class="slim-font text-ellipsis">TOTW9</a>
        // </div>
        const infoContainers = root.querySelectorAll('.player-info-box-player-info-grid');
        infoContainers.forEach(container => {
            const rows = container.querySelectorAll('.xxs-row.align-center, .xxs-row.xxs-font.align-center');
            rows.forEach(row => {
                const labelEl = row.querySelector('.xxs-font.uppercase.text-faded, .xs-font.uppercase.text-faded');
                const linkEl = row.querySelector('a.slim-font.text-ellipsis');
                if (!linkEl || linkEl.dataset.futbinSquadTranslated === '1') {
                    return;
                }

                // 为了兼容「Squad」已经被 BasicInfo 翻译成中文，直接看是否存在 label+link 这一结构即可
                if (!labelEl) {
                    return;
                }

                const newText = translateSquadText(linkEl.textContent);
                if (!newText) {
                    return;
                }
                linkEl.textContent = newText;
                linkEl.dataset.futbinSquadTranslated = '1';
            });
        });
    }

    function applyFutbinBasicInfoTranslations(root) {
          if (!futbinBasicInfoLoaded || !futbinBasicInfoMap || !Object.keys(futbinBasicInfoMap).length) {
              return;
          }
          if (!root) {
              root = document;
          }
          if (!isFutbinPlayerDetailsPage()) {
              return;
          }
          // 仅在示例 HTML 中的 player-info 基本信息列表内翻译，避免干扰其他位置
          const containers = root.querySelectorAll('.player-info-box-player-info-grid');
          containers.forEach(container => {
              const labelElements = container.querySelectorAll('.xs-font.uppercase.text-faded, .xxs-font.uppercase.text-faded');
              labelElements.forEach(el => {
                  if (!el || el.dataset.futbinBasicInfoTranslated === '1') {
                      return;
                  }
                  const english = (el.textContent || '').trim();
                  if (!english) {
                      return;
                  }
                  const chinese = futbinBasicInfoMap[english];
                  if (!chinese) {
                      return;
                  }
                  // 使用和全局配置一致的格式，必要时保留原文及括号
                  el.textContent = formatWithOptionalOriginal(chinese, english);
                  el.dataset.futbinBasicInfoTranslated = '1';
              });
          });
      }

      function applyEaMatchStyleDeltaTranslations(root) {
        if (location.hostname.indexOf('ea.com') === -1) {
            return;
        }
        if (!root) {
            root = document;
        }
        const containers = root.querySelectorAll('.ut-academy-slot-stat-view');
        containers.forEach(container => {
            const titleEl = container.querySelector('.ut-academy-slot-stat-view--title');
            if (!titleEl) {
                return;
            }
            const titleText = (titleEl.textContent || '').trim();
            if (titleText !== '比赛风格') {
                return;
            }
            const deltaEl = container.querySelector('.ut-academy-slot-stat-view--delta');
            if (!deltaEl || deltaEl.dataset.matchStyleTranslated === '1') {
                return;
            }
            let text = (deltaEl.textContent || '').trim();
            if (!text) {
                return;
            }
            if (!usePlayerSlang) {
                return;
            }
            let newText = text;
            let hasChanges = false;
            for (const [, translations_obj] of Object.entries(translationDict)) {
                const officialTranslation = translations_obj.professional;
                const slangTranslation = translations_obj.playerSlang;
                if (!officialTranslation || !slangTranslation || officialTranslation === slangTranslation) {
                    continue;
                }
                if (newText.includes(`(${officialTranslation})`)) {
                    continue;
                }
                const officialRegex = new RegExp(escapeRegExp(officialTranslation), 'g');
                if (officialRegex.test(newText)) {
                    newText = newText.replace(
                        officialRegex,
                        formatWithOptionalOriginal(
                            slangTranslation,
                            officialTranslation,
                            { noSpaceBeforeBracket: true }
                        )
                    );
                    hasChanges = true;
                }
            }
            if (hasChanges) {
                deltaEl.textContent = newText;
                deltaEl.dataset.matchStyleTranslated = '1';
            }
        });
    }

    function loadFutbinRoleTranslations() {
        if (futbinRoleLoaded || futbinRoleLoading) {
            return;
        }
        if (location.hostname.indexOf('futbin.com') === -1) {
            futbinRoleLoaded = true;
            futbinRoleMap = {};
            return;
        }
        futbinRoleLoading = true;
        fetch(futbinRoleSheetUrl)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.text();
            })
            .then(text => {
                const map = {};
                const lines = text.split(/\r?\n/);
                // 忽略第一行（标题行）
                for (let i = 1; i < lines.length; i++) {
                    const line = lines[i];
                    if (!line) {
                        continue;
                    }
                    const parts = line.split(',');
                    if (parts.length < 2) {
                        continue;
                    }
                    // 第一列是原文，第二列是官译，第三列是俗称
                    const english = (parts[0] || '').trim().replace(/^"|"$/g, '');
                    const official = (parts[1] || '').trim().replace(/^"|"$/g, '');
                    const slang = (parts[2] || '').trim().replace(/^"|"$/g, '');
                    
                    if (!english) {
                        continue;
                    }
                    
                    let chinese = '';
                    if (usePlayerSlang) {
                        chinese = slang || official;
                    } else {
                        chinese = official || slang;
                    }
                    
                    if (!chinese) {
                        continue;
                    }
                    
                    map[english] = chinese;
                }
                futbinRoleMap = map;
                futbinRoleLoaded = true;
                if (Object.keys(futbinRoleMap).length > 0) {
                    applyFutbinRoleTranslations(document);
                }
            })
            .catch(() => {
                futbinRoleLoaded = true;
            });
    }

    function applyFutbinRoleTranslations(root) {
        if (!futbinRoleLoaded || !futbinRoleMap || !Object.keys(futbinRoleMap).length) {
            return;
        }
        if (!root) {
            root = document;
        }
        if (location.hostname.indexOf('futbin.com') === -1) {
            return;
        }
        
        // 查找第一种角色元素：span.positive-color[data-futbin-rating-box-role]
        const roleElements1 = root.querySelectorAll('span.positive-color[data-futbin-rating-box-role]');
        roleElements1.forEach(el => {
            if (!el || el.dataset.roleTranslated === '1') {
                return;
            }
            const text = (el.textContent || '').trim();
            if (!text) {
                return;
            }
            
            // 移除可能的++符号再查找翻译
            const baseText = text.replace(/\s*\+\+*$/, '').trim();
            const chinese = futbinRoleMap[baseText];
            if (!chinese) {
                return;
            }
            
            // 保留原有的++符号
            const suffix = text.match(/\+\+*$/) ? text.match(/\+\+*$/)[0] : '';
            
            if (showOriginalWithBrackets) {
                el.textContent = `${chinese}${suffix} (${baseText})`;
            } else {
                el.textContent = `${chinese}${suffix}`;
            }
            el.dataset.roleTranslated = '1';
        });

        // 查找第二种角色元素：角色列表中的链接
        const roleElements2 = root.querySelectorAll('a[href*="/roles"].positive-color');
        roleElements2.forEach(el => {
            if (!el || el.dataset.roleTranslated === '1') {
                return;
            }
            const text = (el.textContent || '').trim();
            if (!text) {
                return;
            }
            
            // 移除可能的++符号再查找翻译
            const baseText = text.replace(/\s*\+\+*$/, '').trim();
            const chinese = futbinRoleMap[baseText];
            if (!chinese) {
                return;
            }
            
            // 获取实际的++符号（从子元素中获取）
            const plusDiv = el.querySelector('div');
            const suffix = plusDiv ? plusDiv.textContent.trim() : '';
            
            // 角色名称是否保留原文和括号由全局开关控制
            el.firstChild.textContent = formatWithOptionalOriginal(chinese, baseText);
            el.dataset.roleTranslated = '1';
        });
    }

    function loadRoleTranslations() {
        if (roleLoaded || roleLoading) {
            return;
        }
        roleLoading = true;
        fetch(roleSheetUrl)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.text();
            })
            .then(text => {
                const map = {};
                const lines = text.split(/\r?\n/);
                // 忽略第一行（标题行）
                for (let i = 1; i < lines.length; i++) {
                    const line = lines[i];
                    if (!line) {
                        continue;
                    }
                    const parts = line.split(',');
                    if (parts.length < 2) {
                        continue;
                    }
                    // 第一列是原文，第二列是官译，第三列是俗称
                    const english = (parts[0] || '').trim().replace(/^"|"$/g, '');
                    const official = (parts[1] || '').trim().replace(/^"|"$/g, '');
                    const slang = (parts[2] || '').trim().replace(/^"|"$/g, '');
                    
                    if (!english) {
                        continue;
                    }
                    
                    if (official) {
                        map[english] = {
                            professional: official,
                            playerSlang: slang || official
                        };
                    }
                }
                
                // 将Google Sheet数据整合到translationDict中
                for (const [english, translations_obj] of Object.entries(map)) {
                    translationDict[english] = translations_obj;
                    roleTerms.add(english);
                }
                
                // 更新translations对象
                for (const [english, translations_obj] of Object.entries(translationDict)) {
                    translations[english] = usePlayerSlang ? translations_obj.playerSlang : translations_obj.professional;
                }
                
                roleLoaded = true;
            })
            .catch(() => {
                roleLoaded = true;
            });
    }

    loadSixStatTranslations();
    loadFutbinBasicInfoTranslations();
    loadFutbinSquadTranslations();
    loadFutbinRoleTranslations();
    loadRoleTranslations();

    // 翻译文本节点的函数
    function translateTextNode(textNode, options = {}) {
        const text = textNode.textContent;
        let newText = text;
        let hasChanges = false;
        const allowRoleTranslations = options.allowRoleTranslations === true || canTranslateRoleTermInNode(textNode);

        // 遍历所有翻译词条
        for (const [english, translations_obj] of Object.entries(translationDict)) {
            if (isFutbinHost && !allowRoleTranslations && roleTerms.has(english)) {
                continue;
            }
            // futbin 球员详情页上，化学风格词条只在特定区域翻译，其他地方一律跳过
            if (isFutbinHost && chemistryStyleTerms.has(english) && !canTranslateChemistryStyleInNode(textNode)) {
                continue;
            }
            const chinese = usePlayerSlang ? translations_obj.playerSlang : translations_obj.professional;

            // 使用正则表达式匹配单词边界，确保大小写敏感
            // \b 表示单词边界，确保只匹配完整的单词
            // 注意：只匹配首字母大写的版本
            const escapedEnglish = escapeRegExp(english);
            const regex = new RegExp(`\\b${escapedEnglish}\\b`, 'g');

            // 检查是否包含该单词且未被翻译过
            if (regex.test(text) && !text.includes(`(${english})`)) {
                // 替换为：中文翻译 + (英文单词)，是否保留括号取决于配置
                const replacement = formatWithOptionalOriginal(chinese, english);
                newText = newText.replace(regex, replacement);
                hasChanges = true;
            }

            // 当开关为【民间叫法】时，检查并替换官方翻译版本
            // 在 ea.com Web App 上不走这里，改由专门的比赛风格逻辑处理
            if (
                usePlayerSlang &&
                translations_obj.professional !== translations_obj.playerSlang &&
                location.hostname.indexOf('ea.com') === -1
            ) {
                const officialTranslation = translations_obj.professional;
                // 中文不存在单词边界，直接做精确字符串替换
                const officialRegex = new RegExp(escapeRegExp(officialTranslation), 'g');

                // 检查是否包含官方翻译且未被处理
                if (officialRegex.test(text) && !text.includes(`(${officialTranslation})`)) {
                    // 替换为：民间叫法 + (官方翻译)；是否保留括号取决于配置
                    const replacement = formatWithOptionalOriginal(
                        translations_obj.playerSlang,
                        officialTranslation,
                        { noSpaceBeforeBracket: true }
                    );
                    newText = newText.replace(officialRegex, replacement);
                    hasChanges = true;
                }
            }
        }

        // 如果有变化，更新文本节点
        if (hasChanges) {
            textNode.textContent = newText;
        }
    }

    // 处理单个元素及其子节点
    function processElement(element) {
        // 跳过已处理的元素
        if (processedElements.has(element)) {
            return;
        }

        // 跳过 script 和 style 标签
        if (element.tagName === 'SCRIPT' || element.tagName === 'STYLE') {
            return;
        }

        // 遍历所有子节点
        const walker = document.createTreeWalker(
            element,
            NodeFilter.SHOW_TEXT,
            {
                acceptNode: function(node) {
                    // 跳过空文本节点
                    if (node.textContent.trim().length === 0) {
                        return NodeFilter.FILTER_REJECT;
                    }
                    // 跳过已处理的节点
                    if (processedElements.has(node)) {
                        return NodeFilter.FILTER_REJECT;
                    }
                    return NodeFilter.FILTER_ACCEPT;
                }
            }
        );

        const textNodes = [];
        let node;
        while (node = walker.nextNode()) {
            textNodes.push(node);
        }

        // 处理所有文本节点
        textNodes.forEach(textNode => {
            translateTextNode(textNode);
            processedElements.add(textNode);
        });

        // 应用角色翻译到当前元素
        applyFutbinRoleTranslations(element);

        processedElements.add(element);
    }

    // 处理整个页面
    function translatePage() {
        // 处理 body 元素
        processElement(document.body);
        applySixStatTranslations(document);
        applyFutbinBasicInfoTranslations(document);
        applyFutbinSquadTranslations(document);
        applyEaMatchStyleDeltaTranslations(document);
        translateAcceleRateChemistry();
    }

    // 翻译球员详情页的加速类型和化学标题及加速类型
    function translateAcceleRateChemistry() {
        if (!isFutbinPlayerDetailsPage()) return;
        
        // 查找化学区域
        const chemistrySection = document.querySelector('.player-chemistry-section');
        if (!chemistrySection) return;
        
        // 翻译标题
        const h2 = chemistrySection.querySelector('h2');
        if (h2 && h2.textContent.trim() === 'AcceleRATE & Chemistry') {
            h2.textContent = '加速类型 和 化学';
        }
        
        // 翻译加速类型文本
        const accelerationMap = {
            'Explosive': '爆发',
            'Controlled': '掌控',
            'Lengthy': '漫长'
        };
        
        // 查找所有加速类型文本元素并翻译
        const selectors = [
            '.player-accelerate-text',  // 原来的选择器
            '.xxs-font.bold.text-faded' // 新增的选择器，用于处理描述文本
        ];
        
        // 处理加速类型文本
        selectors.forEach(selector => {
            const elements = chemistrySection.querySelectorAll(selector);
            elements.forEach(el => {
                const text = el.textContent.trim();
                if (accelerationMap[text]) {
                    el.textContent = formatWithOptionalOriginal(accelerationMap[text], text);
                }
            });
        });
        
        // 翻译社区投票标题
        const communityVotedTexts = chemistrySection.querySelectorAll('.xxs-font.bold.text-faded');
        communityVotedTexts.forEach(el => {
            if (el.textContent.trim() === 'Top 3 community voted') {
                el.textContent = '投票前三的化学选择';
            }
        });
    }

    // 初始加载时翻译
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            translatePage();
        });
    } else {
        translatePage();
    }

    // 使用 MutationObserver 监听 DOM 变化，处理动态加载的内容
    const observer = new MutationObserver((mutations) => {
        // 检查是否有新添加的节点包含 .player-chemistry-section
        const hasChemistrySection = mutations.some(mutation => {
            return Array.from(mutation.addedNodes).some(node => {
                return node.nodeType === 1 && 
                      (node.matches('.player-chemistry-section') || 
                       node.querySelector('.player-chemistry-section'));
            });
        });
        
        if (hasChemistrySection) {
            translateAcceleRateChemistry();
        }
        mutations.forEach((mutation) => {
            mutation.addedNodes.forEach((node) => {
                // 只处理元素节点
                if (node.nodeType === Node.ELEMENT_NODE) {
                    processElement(node);
                    applySixStatTranslations(node);
                    applyFutbinBasicInfoTranslations(node);
                    applyFutbinSquadTranslations(node);
                    applyEaMatchStyleDeltaTranslations(node);
                }
            });
        });
    });

    // 开始观察
    observer.observe(document.body, {
        childList: true,
        subtree: true
    });

    console.log(`翻译脚本已加载 - 当前模式: ${usePlayerSlang ? '玩家常用说法' : '官方翻译'}`);
})();

