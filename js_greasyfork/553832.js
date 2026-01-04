// ==UserScript==
// @name         [银河奶牛]制造类细分
// @version      1.1
// @description  细分部分制造类别下的装备
// @match        https://www.milkywayidle.com/*
// @match        https://www.milkywayidlecn.com/*
// @match        https://test.milkywayidle.com/*
// @icon         https://www.milkywayidle.com/favicon.svg
// @author       GPT-DiamondMoo
// @license      MIT
// @namespace    http://tampermonkey.net/
// @downloadURL https://update.greasyfork.org/scripts/553832/%5B%E9%93%B6%E6%B2%B3%E5%A5%B6%E7%89%9B%5D%E5%88%B6%E9%80%A0%E7%B1%BB%E7%BB%86%E5%88%86.user.js
// @updateURL https://update.greasyfork.org/scripts/553832/%5B%E9%93%B6%E6%B2%B3%E5%A5%B6%E7%89%9B%5D%E5%88%B6%E9%80%A0%E7%B1%BB%E7%BB%86%E5%88%86.meta.js
// ==/UserScript==
(function () {
  'use strict';
  /********************* ★配置表★ *********************/
  const craftingCategories = {
    '制作': {
      '法杖': {
        '水系': {
          "Wooden Water Staff": "木制水法杖",
          "Birch Water Staff": "桦木水法杖",
          "Cedar Water Staff": "雪松水法杖",
          "Purpleheart Water Staff": "紫心水法杖",
          "Ginkgo Water Staff": "银杏水法杖",
          "Redwood Water Staff": "红杉水法杖",
          "Arcane Water Staff": "神秘水法杖",
          "Frost Staff": "冰霜法杖",
          "Rippling Trident": "涟漪三叉戟",
          "Rippling Trident (R)": "涟漪三叉戟（精）"
        },
        '火系': {
          "Wooden Fire Staff": "木制火法杖",
          "Birch Fire Staff": "桦木火法杖",
          "Cedar Fire Staff": "雪松火法杖",
          "Purpleheart Fire Staff": "紫心火法杖",
          "Ginkgo Fire Staff": "银杏火法杖",
          "Redwood Fire Staff": "红杉火法杖",
          "Arcane Fire Staff": "神秘火法杖",
          "Infernal Battlestaff": "炼狱法杖",
          "Blazing Trident": "炽焰三叉戟",
          "Blazing Trident (R)": "炽焰三叉戟（精）"
        },
        '自然系': {
          "Wooden Nature Staff": "木制自然法杖",
          "Birch Nature Staff": "桦木自然法杖",
          "Cedar Nature Staff": "雪松自然法杖",
          "Purpleheart Nature Staff": "紫心自然法杖",
          "Ginkgo Nature Staff": "银杏自然法杖",
          "Redwood Nature Staff": "红杉自然法杖",
          "Arcane Nature Staff": "神秘自然法杖",
          "Jackalope Staff": "鹿角兔之杖",
          "Blooming Trident": "绽放三叉戟",
          "Blooming Trident (R)": "绽放三叉戟（精）"
        }
      },
      '护符': {
        '挤奶': {
          "Trainee Milking Charm": "实习挤奶护符",
          "Basic Milking Charm": "基础挤奶护符",
          "Advanced Milking Charm": "高级挤奶护符",
          "Expert Milking Charm": "专家挤奶护符",
          "Master Milking Charm": "大师挤奶护符",
          "Grandmaster Milking Charm": "宗师挤奶护符"
        },
        '采摘': {
          "Trainee Foraging Charm": "实习采摘护符",
          "Basic Foraging Charm": "基础采摘护符",
          "Advanced Foraging Charm": "高级采摘护符",
          "Expert Foraging Charm": "专家采摘护符",
          "Master Foraging Charm": "大师采摘护符",
          "Grandmaster Foraging Charm": "宗师采摘护符"
        },
        '伐木': {
          "Trainee Woodcutting Charm": "实习伐木护符",
          "Basic Woodcutting Charm": "基础伐木护符",
          "Advanced Woodcutting Charm": "高级伐木护符",
          "Expert Woodcutting Charm": "专家伐木护符",
          "Master Woodcutting Charm": "大师伐木护符",
          "Grandmaster Woodcutting Charm": "宗师伐木护符"
        },
        '奶酪锻造': {
          "Trainee Cheesesmithing Charm": "实习奶酪锻造护符",
          "Basic Cheesesmithing Charm": "基础奶酪锻造护符",
          "Advanced Cheesesmithing Charm": "高级奶酪锻造护符",
          "Expert Cheesesmithing Charm": "专家奶酪锻造护符",
          "Master Cheesesmithing Charm": "大师奶酪锻造护符",
          "Grandmaster Cheesesmithing Charm": "宗师奶酪锻造护符"
        },
        '制作': {
          "Trainee Crafting Charm": "实习制作护符",
          "Basic Crafting Charm": "基础制作护符",
          "Advanced Crafting Charm": "高级制作护符",
          "Expert Crafting Charm": "专家制作护符",
          "Master Crafting Charm": "大师制作护符",
          "Grandmaster Crafting Charm": "宗师制作护符"
        },
        '缝纫': {
          "Trainee Tailoring Charm": "实习缝纫护符",
          "Basic Tailoring Charm": "基础缝纫护符",
          "Advanced Tailoring Charm": "高级缝纫护符",
          "Expert Tailoring Charm": "专家缝纫护符",
          "Master Tailoring Charm": "大师缝纫护符",
          "Grandmaster Tailoring Charm": "宗师缝纫护符"
        },
        '烹饪': {
          "Trainee Cooking Charm": "实习烹饪护符",
          "Basic Cooking Charm": "基础烹饪护符",
          "Advanced Cooking Charm": "高级烹饪护符",
          "Expert Cooking Charm": "专家烹饪护符",
          "Master Cooking Charm": "大师烹饪护符",
          "Grandmaster Cooking Charm": "宗师烹饪护符"
        },
        '冲泡': {
          "Trainee Brewing Charm": "实习冲泡护符",
          "Basic Brewing Charm": "基础冲泡护符",
          "Advanced Brewing Charm": "高级冲泡护符",
          "Expert Brewing Charm": "专家冲泡护符",
          "Master Brewing Charm": "大师冲泡护符",
          "Grandmaster Brewing Charm": "宗师冲泡护符"
        },
        '炼金': {
          "Trainee Alchemy Charm": "实习炼金护符",
          "Basic Alchemy Charm": "基础炼金护符",
          "Advanced Alchemy Charm": "高级炼金护符",
          "Expert Alchemy Charm": "专家炼金护符",
          "Master Alchemy Charm": "大师炼金护符",
          "Grandmaster Alchemy Charm": "宗师炼金护符"
        },
        '强化': {
          "Trainee Enhancing Charm": "实习强化护符",
          "Basic Enhancing Charm": "基础强化护符",
          "Advanced Enhancing Charm": "高级强化护符",
          "Expert Enhancing Charm": "专家强化护符",
          "Master Enhancing Charm": "大师强化护符",
          "Grandmaster Enhancing Charm": "宗师强化护符"
        },
        '耐力': {
          "Trainee Stamina Charm": "实习耐力护符",
          "Basic Stamina Charm": "基础耐力护符",
          "Advanced Stamina Charm": "高级耐力护符",
          "Expert Stamina Charm": "专家耐力护符",
          "Master Stamina Charm": "大师耐力护符",
          "Grandmaster Stamina Charm": "宗师耐力护符"
        },
        '智力': {
          "Trainee Intelligence Charm": "实习智力护符",
          "Basic Intelligence Charm": "基础智力护符",
          "Advanced Intelligence Charm": "高级智力护符",
          "Expert Intelligence Charm": "专家智力护符",
          "Master Intelligence Charm": "大师智力护符",
          "Grandmaster Intelligence Charm": "宗师智力护符"
        },
        '攻击': {
          "Trainee Attack Charm": "实习攻击护符",
          "Basic Attack Charm": "基础攻击护符",
          "Advanced Attack Charm": "高级攻击护符",
          "Expert Attack Charm": "专家攻击护符",
          "Master Attack Charm": "大师攻击护符",
          "Grandmaster Attack Charm": "宗师攻击护符"
        },
        '防御': {
          "Trainee Defense Charm": "实习防御护符",
          "Basic Defense Charm": "基础防御护符",
          "Advanced Defense Charm": "高级防御护符",
          "Expert Defense Charm": "专家防御护符",
          "Master Defense Charm": "大师防御护符",
          "Grandmaster Defense Charm": "宗师防御护符"
        },
        '近战': {
          "Trainee Melee Charm": "实习近战护符",
          "Basic Melee Charm": "基础近战护符",
          "Advanced Melee Charm": "高级近战护符",
          "Expert Melee Charm": "专家近战护符",
          "Master Melee Charm": "大师近战护符",
          "Grandmaster Melee Charm": "宗师近战护符"
        },
        '远程': {
          "Trainee Ranged Charm": "实习远程护符",
          "Basic Ranged Charm": "基础远程护符",
          "Advanced Ranged Charm": "高级远程护符",
          "Expert Ranged Charm": "专家远程护符",
          "Master Ranged Charm": "大师远程护符",
          "Grandmaster Ranged Charm": "宗师远程护符"
        },
        '魔法': {
          "Trainee Magic Charm": "实习魔法护符",
          "Basic Magic Charm": "基础魔法护符",
          "Advanced Magic Charm": "高级魔法护符",
          "Expert Magic Charm": "专家魔法护符",
          "Master Magic Charm": "大师魔法护符",
          "Grandmaster Magic Charm": "宗师魔法护符"
        }
      }
    },
    '奶酪锻造': {
      '主手': {
        '剑': {
          "Cheese Sword": "奶酪剑",
          "Verdant Sword": "翠绿剑",
          "Azure Sword": "蔚蓝剑",
          "Burble Sword": "深紫剑",
          "Crimson Sword": "绛红剑",
          "Rainbow Sword": "彩虹剑",
          "Holy Sword": "神圣剑",
          "Regal Sword": "君王之剑",
          "Regal Sword (R)": "君王之剑（精）"
        },
        '长枪': {
          "Cheese Spear": "奶酪长枪",
          "Verdant Spear": "翠绿长枪",
          "Azure Spear": "蔚蓝长枪",
          "Burble Spear": "深紫长枪",
          "Crimson Spear": "绛红长枪",
          "Rainbow Spear": "彩虹长枪",
          "Holy Spear": "神圣长枪",
          "Stalactite Spear": "石钟长枪",
          "Furious Spear": "狂怒长枪",
          "Furious Spear (R)": "狂怒长枪（精）"
        },
        '锤': {
          "Cheese Mace": "奶酪钉头锤",
          "Verdant Mace": "翠绿钉头锤",
          "Azure Mace": "蔚蓝钉头锤",
          "Burble Mace": "深紫钉头锤",
          "Crimson Mace": "绛红钉头锤",
          "Rainbow Mace": "彩虹钉头锤",
          "Holy Mace": "神圣钉头锤",
          "Granite Bludgeon": "花岗岩大棒",
          "Chaotic Flail": "混沌连枷",
          "Chaotic Flail (R)": "混沌连枷（精）"
        }
      },
      '工具': {
        '刷子': {
          "Celestial Brush": "星空刷子",
          "Cheese Brush": "奶酪刷子",
          "Verdant Brush": "翠绿刷子",
          "Azure Brush": "蔚蓝刷子",
          "Burble Brush": "深紫刷子",
          "Crimson Brush": "绛红刷子",
          "Rainbow Brush": "彩虹刷子",
          "Holy Brush": "神圣刷子"
        },
        '剪刀': {
          "Celestial Shears": "星空剪刀",
          "Cheese Shears": "奶酪剪刀",
          "Verdant Shears": "翠绿剪刀",
          "Azure Shears": "蔚蓝剪刀",
          "Burble Shears": "深紫剪刀",
          "Crimson Shears": "绛红剪刀",
          "Rainbow Shears": "彩虹剪刀",
          "Holy Shears": "神圣剪刀"
        },
        '斧头': {
          "Celestial Hatchet": "星空斧头",
          "Cheese Hatchet": "奶酪斧头",
          "Verdant Hatchet": "翠绿斧头",
          "Azure Hatchet": "蔚蓝斧头",
          "Burble Hatchet": "深紫斧头",
          "Crimson Hatchet": "绛红斧头",
          "Rainbow Hatchet": "彩虹斧头",
          "Holy Hatchet": "神圣斧头"
        },
        '锤子': {
          "Celestial Hammer": "星空锤子",
          "Cheese Hammer": "奶酪锤子",
          "Verdant Hammer": "翠绿锤子",
          "Azure Hammer": "蔚蓝锤子",
          "Burble Hammer": "深紫锤子",
          "Crimson Hammer": "绛红锤子",
          "Rainbow Hammer": "彩虹锤子",
          "Holy Hammer": "神圣锤子"
        },
        '凿子': {
          "Celestial Chisel": "星空凿子",
          "Cheese Chisel": "奶酪凿子",
          "Verdant Chisel": "翠绿凿子",
          "Azure Chisel": "蔚蓝凿子",
          "Burble Chisel": "深紫凿子",
          "Crimson Chisel": "绛红凿子",
          "Rainbow Chisel": "彩虹凿子",
          "Holy Chisel": "神圣凿子"
        },
        '针': {
          "Celestial Needle": "星空针",
          "Cheese Needle": "奶酪针",
          "Verdant Needle": "翠绿针",
          "Azure Needle": "蔚蓝针",
          "Burble Needle": "深紫针",
          "Crimson Needle": "绛红针",
          "Rainbow Needle": "彩虹针",
          "Holy Needle": "神圣针"
        },
        '锅铲': {
          "Celestial Spatula": "星空锅铲",
          "Cheese Spatula": "奶酪锅铲",
          "Verdant Spatula": "翠绿锅铲",
          "Azure Spatula": "蔚蓝锅铲",
          "Burble Spatula": "深紫锅铲",
          "Crimson Spatula": "绛红锅铲",
          "Rainbow Spatula": "彩虹锅铲",
          "Holy Spatula": "神圣锅铲"
        },
        '壶': {
          "Celestial Pot": "星空壶",
          "Cheese Pot": "奶酪壶",
          "Verdant Pot": "翠绿壶",
          "Azure Pot": "蔚蓝壶",
          "Burble Pot": "深紫壶",
          "Crimson Pot": "绛红壶",
          "Rainbow Pot": "彩虹壶",
          "Holy Pot": "神圣壶"
        },
        '蒸馏器': {
          "Celestial Alembic": "星空蒸馏器",
          "Cheese Alembic": "奶酪蒸馏器",
          "Verdant Alembic": "翠绿蒸馏器",
          "Azure Alembic": "蔚蓝蒸馏器",
          "Burble Alembic": "深紫蒸馏器",
          "Crimson Alembic": "绛红蒸馏器",
          "Rainbow Alembic": "彩虹蒸馏器",
          "Holy Alembic": "神圣蒸馏器"
        },
        '强化器': {
          "Celestial Enhancer": "星空强化器",
          "Cheese Enhancer": "奶酪强化器",
          "Verdant Enhancer": "翠绿强化器",
          "Azure Enhancer": "蔚蓝强化器",
          "Burble Enhancer": "深紫强化器",
          "Crimson Enhancer": "绛红强化器",
          "Rainbow Enhancer": "彩虹强化器",
          "Holy Enhancer": "神圣强化器"
        }
      }
    },
    '缝纫': {
      '脚部': {
        '皮革': {
          "Centaur Boots": "半人马靴",
          "Rough Boots": "粗糙靴",
          "Reptile Boots": "爬行动物靴",
          "Gobo Boots": "哥布林靴",
          "Beast Boots": "野兽靴",
          "Umbral Boots": "暗影靴",
          "Shoebill Shoes": "鲸头鹳鞋"
        },
        '布料': {
          "Sorcerer Boots": "巫师靴",
          "Cotton Boots": "棉靴",
          "Linen Boots": "亚麻靴",
          "Bamboo Boots": "竹靴",
          "Silk Boots": "丝靴",
          "Radiant Boots": "光辉靴",
          "Shoebill Shoes": "鲸头鹳鞋"
        },
        '生活': {
          "Collector's Boots": "收藏家靴"
        }
      },
      '手部': {
        '皮革': {
          "Sighted Bracers": "瞄准护腕",
          "Marksman Bracers": "神射护腕",
          "Marksman Bracers (R)": "神射护腕（精）",
          "Rough Bracers": "粗糙护腕",
          "Reptile Bracers": "爬行动物护腕",
          "Gobo Bracers": "哥布林护腕",
          "Beast Bracers": "野兽护腕",
          "Umbral Bracers": "暗影护腕"
        },
        '布料': {
          "Chrono Gloves": "时空手套",
          "Cotton Gloves": "棉手套",
          "Linen Gloves": "亚麻手套",
          "Bamboo Gloves": "竹手套",
          "Silk Gloves": "丝手套",
          "Radiant Gloves": "光辉手套"
        },
        '生活': {
          "Enchanted Gloves": "附魔手套"
        }
      },
      '头部': {
        '皮革': {
          "Acrobatic Hood": "杂技师兜帽",
          "Acrobatic Hood (R)": "杂技师兜帽（精）",
          "Rough Hood": "粗糙兜帽",
          "Reptile Hood": "爬行动物兜帽",
          "Gobo Hood": "哥布林兜帽",
          "Beast Hood": "野兽兜帽",
          "Umbral Hood": "暗影兜帽",
          "Fluffy Red Hat": "蓬松红帽子"
        },
        '布料': {
          "Magician's Hat": "魔术师帽",
          "Magician's Hat (R)": "魔术师帽（精）",
          "Cotton Hat": "棉帽",
          "Linen Hat": "亚麻帽",
          "Bamboo Hat": "竹帽",
          "Silk Hat": "丝帽",
          "Radiant Hat": "光辉帽",
          "Fluffy Red Hat": "蓬松红帽子"
        },
        '生活': {
          "Red Culinary Hat": "红色厨师帽",
        }
      },
      '腿部': {
        '皮革': {
          "Marine Chaps": "航海皮裤",
          "Revenant Chaps": "亡灵皮裤",
          "Griffin Chaps": "狮鹫皮裤",
          "Kraken Chaps": "克拉肯皮裤",
          "Kraken Chaps (R)": "克拉肯皮裤（精）",
          "Rough Chaps": "粗糙皮裤",
          "Reptile Chaps": "爬行动物皮裤",
          "Gobo Chaps": "哥布林皮裤",
          "Beast Chaps": "野兽皮裤",
          "Umbral Chaps": "暗影皮裤"
        },
        '布料': {
          "Icy Robe Bottoms": "冰霜袍裙",
          "Flaming Robe Bottoms": "烈焰袍裙",
          "Luna Robe Bottoms": "月神袍裙",
          "Royal Water Robe Bottoms": "皇家水系袍裙",
          "Royal Water Robe Bottoms (R)": "皇家水系袍裙（精）",
          "Royal Nature Robe Bottoms": "皇家自然系袍裙",
          "Royal Nature Robe Bottoms (R)": "皇家自然系袍裙（精）",
          "Royal Fire Robe Bottoms": "皇家火系袍裙",
          "Royal Fire Robe Bottoms (R)": "皇家火系袍裙（精）",
          "Cotton Robe Bottoms": "棉袍裙",
          "Linen Robe Bottoms": "亚麻袍裙",
          "Bamboo Robe Bottoms": "竹袍裙",
          "Silk Robe Bottoms": "丝绸袍裙",
          "Radiant Robe Bottoms": "光辉袍裙"
        },
        '生活': {
          "Dairyhand's Bottoms": "挤奶工下装",
          "Forager's Bottoms": "采摘者下装",
          "Lumberjack's Bottoms": "伐木工下装",
          "Cheesemaker's Bottoms": "奶酪师下装",
          "Crafter's Bottoms": "工匠下装",
          "Tailor's Bottoms": "裁缝下装",
          "Chef's Bottoms": "厨师下装",
          "Brewer's Bottoms": "饮品师下装",
          "Alchemist's Bottoms": "炼金师下装",
          "Enhancer's Bottoms": "强化师下装"
        }
      },
      '身体': {
        '皮革': {
          "Marine Tunic": "海洋皮衣",
          "Revenant Tunic": "亡灵皮衣",
          "Griffin Tunic": "狮鹫皮衣",
          "Kraken Tunic": "克拉肯皮衣",
          "Kraken Tunic (R)": "克拉肯皮衣（精）",
          "Rough Tunic": "粗糙皮衣",
          "Reptile Tunic": "爬行动物皮衣",
          "Gobo Tunic": "哥布林皮衣",
          "Beast Tunic": "野兽皮衣",
          "Umbral Tunic": "暗影皮衣"
        },
        '布料': {
          "Icy Robe Top": "冰霜袍服",
          "Flaming Robe Top": "烈焰袍服",
          "Luna Robe Top": "月神袍服",
          "Royal Water Robe Top": "皇家水系袍服",
          "Royal Water Robe Top (R)": "皇家水系袍服（精）",
          "Royal Nature Robe Top": "皇家自然系袍服",
          "Royal Nature Robe Top (R)": "皇家自然系袍服（精）",
          "Royal Fire Robe Top": "皇家火系袍服",
          "Royal Fire Robe Top (R)": "皇家火系袍服（精）",
          "Cotton Robe Top": "棉袍服",
          "Linen Robe Top": "亚麻袍服",
          "Bamboo Robe Top": "竹袍服",
          "Silk Robe Top": "丝绸袍服",
          "Radiant Robe Top": "光辉袍服"
        },
        '生活': {
          "Dairyhand's Top": "挤奶工上衣",
          "Forager's Top": "采摘者上衣",
          "Lumberjack's Top": "伐木工上衣",
          "Cheesemaker's Top": "奶酪师上衣",
          "Crafter's Top": "工匠上衣",
          "Tailor's Top": "裁缝上衣",
          "Chef's Top": "厨师上衣",
          "Brewer's Top": "饮品师上衣",
          "Alchemist's Top": "炼金师上衣",
          "Enhancer's Top": "强化师上衣"
        }
      }
    }
  };

  /********************* 内部状态 *********************/
  let lastMain = null;
  let lastSub = null;
  let lastFilterBtn = null;
  let cachedItems = [];

  const debounce = (fn, ms = 140) => { let t; return (...a) => { clearTimeout(t); t = setTimeout(() => fn(...a), ms); }; };
  const escapeId = (s) => String(s || '').replace(/\s+/g, '_').replace(/[^\w-]/g, '');

  function resetAllItemsVisible() {
    cachedItems.forEach(i => i.style.display = '');
  }

  /********************* createFilterBar（核心） *********************/
  function createFilterBar(mainCategory, subCategory, categoriesMap) {
    if (!categoriesMap) return;

    document.querySelectorAll('[id^="tm-filter-"]').forEach(e => e.remove());
    lastFilterBtn = null;
    resetAllItemsVisible();

    cachedItems = Array.from(document.querySelectorAll('.SkillAction_skillAction__1esCp'));

    const id = `tm-filter-${escapeId(mainCategory)}-${escapeId(subCategory)}`;
    const bar = document.createElement('div');
    bar.id = id;

    Object.assign(bar.style, {
      display: 'flex',
      flexWrap: 'wrap',
      justifyContent: 'center',
      gap: '0px',
      padding: '4px 0 0 0',
      boxSizing: 'border-box',
      borderBottom: '2px solid rgb(51,52,79)', 
      background: 'transparent'
    });

    /******** 注入局部 CSS（变量 + 按钮样式） ********/
    const varsAndCss = `
#${id} {
  --spacing-xs-plus: 0.375rem;
  --font-size-base: 0.875rem;
  --button-min-width-normal: 3.125rem;
  --button-height-small: 1.5rem;
  --radius-sm: 0.25rem;
  --color-midnight-500: #2c2e45;
  --tab-button: rgb(113, 123, 169);
  --tab-button-hover: rgba(108, 117, 160, 0.5);
  --tab-selected-bg: var(--color-space-600, #4357af);
  --color-text-dark-mode: var(--color-neutral-100, #e7e7e7);
}

#${id} .tm-filter-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: var(--spacing-xs-plus);
  min-height: var(--button-height-small);
  min-width: var(--button-min-width-normal);
  background: var(--color-midnight-500);
  color: var(--color-text-dark-mode);
  border: 0px solid var(--tab-button);
  border-bottom: none;            /* 与栏底贴合（下直角） */
  border-top-left-radius: 6px;
  border-top-right-radius: 6px;
  border-bottom-left-radius: 0px;
  border-bottom-right-radius: 0px;
  box-sizing: border-box;
  font-family: Roboto, Helvetica, Arial, sans-serif;
  font-size: var(--font-size-base);
  font-weight: 500;
  line-height: 1.25;
  letter-spacing: 0.02857em;
  white-space: normal;
  cursor: pointer;
  user-select: none;
  width: auto;
  flex-shrink: 0;
  position: relative;
  overflow: hidden;
  margin: 0 1px;
  background-clip: padding-box;
  transition: background-color 0.15s ease;
}

#${id} .tm-filter-btn:hover {
  background: var(--tab-button-hover);
}

#${id} .tm-filter-btn.tm-selected {
  background: var(--tab-selected-bg) !important;
  border-color: var(--tab-selected-bg) !important;
  color: var(--color-neutral-0, #fff) !important;
}

#${id} { margin: 0; }

`;

    const styleTag = document.createElement('style');
    styleTag.textContent = varsAndCss;
    bar.appendChild(styleTag);

    /********************* 按钮生成（保持逻辑不变） *********************/
    const makeButton = (text, cb) => {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'tm-filter-btn';
      btn.innerText = text;

      btn.addEventListener('click', () => {
        if (lastFilterBtn === btn) {
          lastFilterBtn.classList.remove('tm-selected');
          lastFilterBtn = null;
          resetAllItemsVisible();
          return;
        }

        if (lastFilterBtn) lastFilterBtn.classList.remove('tm-selected');
        lastFilterBtn = btn;
        btn.classList.add('tm-selected');
        cb();
      });

      return btn;
    };

    const allBtn = makeButton('全部', resetAllItemsVisible);
    bar.appendChild(allBtn);

    for (const [name, mapping] of Object.entries(categoriesMap)) {
      const keys = Object.entries(mapping);
      const btn = makeButton(name, () => {
        cachedItems.forEach(i => {
          const itemName = i.querySelector('.SkillAction_name__2VPXa')?.innerText?.trim() || '';
          const show = keys.some(([eng, chi]) => itemName === eng || itemName === chi || itemName.includes(eng));
          i.style.display = show ? '' : 'none';
        });
      });
      bar.appendChild(btn);
    }

    /********************* 插入位置：固定在子 Tabs 下方（居中） *********************/
    const tabsContainer = document.querySelector('.TabsComponent_tabsContainer__3BDUp')
                        || document.querySelector('.TabsComponent_tabsContainer__3BDUp.TabsComponent_wrap__3fEC7')
                        || document.querySelector('.MuiTabs-root')
                        || document.querySelector('.MuiTabs-scroller');

    if (tabsContainer && tabsContainer.parentNode) {
      tabsContainer.parentNode.insertBefore(bar, tabsContainer.nextSibling);
    } else {
      document.body.appendChild(bar);
      console.warn('[TM] 插入失败 → fallback to document.body.appendChild(bar)');
    }
  }

  /********************* 分类检测（子类无筛选自动 reset） *********************/
  const classify = debounce(() => {
    const mainLabel = document.querySelector('[class*="NavigationBar_active__"] [class*="NavigationBar_label__"]')?.innerText?.trim();
    const subLabel = document.querySelector('.MuiTab-root.Mui-selected')?.innerText?.trim();
    if (!mainLabel || !subLabel) return;
    if (mainLabel === lastMain && subLabel === lastSub) return;

    lastMain = mainLabel;
    lastSub = subLabel;

    const subCfg = craftingCategories?.[mainLabel]?.[subLabel];
    if (subCfg) createFilterBar(mainLabel, subLabel, subCfg);
    else {
      resetAllItemsVisible();
      document.querySelectorAll('[id^="tm-filter-"]').forEach(e => e.remove());
      lastFilterBtn = null;
    }
  }, 200);

  const observer = new MutationObserver(classify);
  observer.observe(document.body, { childList: true, subtree: true });

})();
