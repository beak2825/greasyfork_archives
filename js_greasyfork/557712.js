// ==UserScript==
// @name         [银河奶牛]强化在线统计(折线图版)
// @name-en      [MWI]Enhance Record With Line Chart
// @namespace    http://tampermonkey.net/
// @version      1.7.1
// @description  以表格加上折线图的方式记录强化过程
// @description:en Record enhance data with form and line chart
// @author       jhd32
// @license      CC-BY-NC-SA-4.0
// @match        https://www.milkywayidlecn.com/*
// @match        https://www.milkywayidle.com/*
// @match        https://test.milkywayidlecn.com/*
// @match        https://test.milkywayidle.com/*
// @require      https://cdn.jsdelivr.net/npm/chart.js@4.4.8/dist/chart.umd.min.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/557712/%5B%E9%93%B6%E6%B2%B3%E5%A5%B6%E7%89%9B%5D%E5%BC%BA%E5%8C%96%E5%9C%A8%E7%BA%BF%E7%BB%9F%E8%AE%A1%28%E6%8A%98%E7%BA%BF%E5%9B%BE%E7%89%88%29.user.js
// @updateURL https://update.greasyfork.org/scripts/557712/%5B%E9%93%B6%E6%B2%B3%E5%A5%B6%E7%89%9B%5D%E5%BC%BA%E5%8C%96%E5%9C%A8%E7%BA%BF%E7%BB%9F%E8%AE%A1%28%E6%8A%98%E7%BA%BF%E5%9B%BE%E7%89%88%29.meta.js
// ==/UserScript==

(function () {
    "use strict";

    const config = getConfig();
    const useLanguage = localStorage.getItem("i18nextLng") || "en";
    const TEXT = {
        zh: {
            description: '在线强化统计',
            title: '在线强化统计',
            target: '目标',
            prot: '保护',
            total: '总计',
            failure: '失败',
            success: '成功',
            blessed: '福气',
            blessedCount: '福气次数',
            rate: '概率',
            protCount: '保护次数',
            level: '等级',
            curLevel: '当前等级',
            deleteTip: '双击删除所有数据',
            enhanceCount: '强化次数',
            outputTip:'单击/双击导出10/20次强化记录至剪贴板',
        },
        en: {
            description: 'Enhance Record',
            title: 'Enhance Record',
            target: 'T',
            prot: 'P',
            total: 'Total',
            failure: 'Failure',
            success: 'Success',
            blessed: 'Blessed',
            blessedCount: 'Blessed',
            rate: 'Rate',
            protCount: 'Prot',
            level: 'Level',
            curLevel: 'curLevel',
            deleteTip: 'double click to delete all data',
            enhanceCount: 'count',
            outputTip:'single/double click to export 10/20 enhancement records to the clipboard',
        }
    };
    const t = useLanguage == "en" ? TEXT.en : TEXT.zh;
    const panelState = ["collapsed", "normal", "expanded"];

    let panelStateIndex = 1;
    const state = {
        container: null,
        dataPanel: null,
        chartContainer: null,
        chartInstance: null,
        toggleBtn: null,
        select: null,
        tbody: null,
        tfoot: null,
        canvasContainer: null,
        chartFoot: null,
    };
    let enhanceData = JSON.parse(localStorage.getItem(config.STORAGE_KEY)) || [];

    function getConfig() {
        const isMobile = window.innerWidth <= 768;
        return {
            STORAGE_KEY: "enhanceData32",
            CHART_WIDTH: isMobile ? "300px" : "400px",
            TABLE_WIDTH: "250px",
            COLLAPSED_CHART_WIDTH: "250px",
            MAX_POINT_COUNT: isMobile ? 40 : 50,
        };
    }

    function formatToPercent(number, decimalPlaces = 2) {
        return (number * 100).toFixed(decimalPlaces) + '%';
    }

    function formatTimeDifference(startTime, endTime) {
        const start = new Date(startTime);
        const end = new Date(endTime);
        const diffMs = end - start;

        const hours = Math.floor(diffMs / (1000 * 60 * 60));
        const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diffMs % (1000 * 60)) / 1000);
        const formatNumber = (num) => num.toString().padStart(2, '0');

        return `${hours}h${formatNumber(minutes)}m${formatNumber(seconds)}s`;
    }

    function formatDateTimeLocal(timestamp) {
        const date = new Date(timestamp);
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');
        const seconds = String(date.getSeconds()).padStart(2, '0');

        return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
    }

    function findPreviousLevel(items, targetHrid, currentLevel) {
        for (const item of items) {
            if (item.itemHrid === targetHrid && item.enhancementLevel !== currentLevel) {
                return item.enhancementLevel;
            }
        }
        return 0;
    }

    function parseItemHash(itemHash) {
        const parts = itemHash.split("::");
        return [parts[2], parseInt(parts[3])];
    }

    function getEquipmentName(itemHrid){
        const list = {
            "/items/acrobatic_hood": {
            "zh": "杂技师兜帽",
            "en": "Acrobatic Hood"
            },
            "/items/acrobatic_hood_refined": {
            "zh": "杂技师兜帽（精）",
            "en": "Acrobatic Hood (R)"
            },
            "/items/advanced_alchemy_charm": {
            "zh": "高级炼金护符",
            "en": "Advanced Alchemy Charm"
            },
            "/items/advanced_attack_charm": {
            "zh": "高级攻击护符",
            "en": "Advanced Attack Charm"
            },
            "/items/advanced_brewing_charm": {
            "zh": "高级冲泡护符",
            "en": "Advanced Brewing Charm"
            },
            "/items/advanced_cheesesmithing_charm": {
            "zh": "高级奶酪锻造护符",
            "en": "Advanced Cheesesmithing Charm"
            },
            "/items/advanced_cooking_charm": {
            "zh": "高级烹饪护符",
            "en": "Advanced Cooking Charm"
            },
            "/items/advanced_crafting_charm": {
            "zh": "高级制作护符",
            "en": "Advanced Crafting Charm"
            },
            "/items/advanced_defense_charm": {
            "zh": "高级防御护符",
            "en": "Advanced Defense Charm"
            },
            "/items/advanced_enhancing_charm": {
            "zh": "高级强化护符",
            "en": "Advanced Enhancing Charm"
            },
            "/items/advanced_foraging_charm": {
            "zh": "高级采摘护符",
            "en": "Advanced Foraging Charm"
            },
            "/items/advanced_intelligence_charm": {
            "zh": "高级智力护符",
            "en": "Advanced Intelligence Charm"
            },
            "/items/advanced_magic_charm": {
            "zh": "高级魔法护符",
            "en": "Advanced Magic Charm"
            },
            "/items/advanced_melee_charm": {
            "zh": "高级近战护符",
            "en": "Advanced Melee Charm"
            },
            "/items/advanced_milking_charm": {
            "zh": "高级挤奶护符",
            "en": "Advanced Milking Charm"
            },
            "/items/advanced_ranged_charm": {
            "zh": "高级远程护符",
            "en": "Advanced Ranged Charm"
            },
            "/items/advanced_stamina_charm": {
            "zh": "高级耐力护符",
            "en": "Advanced Stamina Charm"
            },
            "/items/advanced_tailoring_charm": {
            "zh": "高级缝纫护符",
            "en": "Advanced Tailoring Charm"
            },
            "/items/advanced_task_badge": {
            "zh": "高级任务徽章",
            "en": "Advanced Task Badge"
            },
            "/items/advanced_woodcutting_charm": {
            "zh": "高级伐木护符",
            "en": "Advanced Woodcutting Charm"
            },
            "/items/alchemists_bottoms": {
            "zh": "炼金师下装",
            "en": "Alchemist's Bottoms"
            },
            "/items/alchemists_top": {
            "zh": "炼金师上衣",
            "en": "Alchemist's Top"
            },
            "/items/anchorbound_plate_body": {
            "zh": "锚定胸甲",
            "en": "Anchorbound Plate Body"
            },
            "/items/anchorbound_plate_body_refined": {
            "zh": "锚定胸甲（精）",
            "en": "Anchorbound Plate Body (R)"
            },
            "/items/anchorbound_plate_legs": {
            "zh": "锚定腿甲",
            "en": "Anchorbound Plate Legs"
            },
            "/items/anchorbound_plate_legs_refined": {
            "zh": "锚定腿甲（精）",
            "en": "Anchorbound Plate Legs (R)"
            },
            "/items/arcane_bow": {
            "zh": "神秘弓",
            "en": "Arcane Bow"
            },
            "/items/arcane_crossbow": {
            "zh": "神秘弩",
            "en": "Arcane Crossbow"
            },
            "/items/arcane_fire_staff": {
            "zh": "神秘火法杖",
            "en": "Arcane Fire Staff"
            },
            "/items/arcane_nature_staff": {
            "zh": "神秘自然法杖",
            "en": "Arcane Nature Staff"
            },
            "/items/arcane_shield": {
            "zh": "神秘盾",
            "en": "Arcane Shield"
            },
            "/items/arcane_water_staff": {
            "zh": "神秘水法杖",
            "en": "Arcane Water Staff"
            },
            "/items/azure_alembic": {
            "zh": "蔚蓝蒸馏器",
            "en": "Azure Alembic"
            },
            "/items/azure_boots": {
            "zh": "蔚蓝靴",
            "en": "Azure Boots"
            },
            "/items/azure_brush": {
            "zh": "蔚蓝刷子",
            "en": "Azure Brush"
            },
            "/items/azure_buckler": {
            "zh": "蔚蓝圆盾",
            "en": "Azure Buckler"
            },
            "/items/azure_bulwark": {
            "zh": "蔚蓝重盾",
            "en": "Azure Bulwark"
            },
            "/items/azure_chisel": {
            "zh": "蔚蓝凿子",
            "en": "Azure Chisel"
            },
            "/items/azure_enhancer": {
            "zh": "蔚蓝强化器",
            "en": "Azure Enhancer"
            },
            "/items/azure_gauntlets": {
            "zh": "蔚蓝护手",
            "en": "Azure Gauntlets"
            },
            "/items/azure_hammer": {
            "zh": "蔚蓝锤子",
            "en": "Azure Hammer"
            },
            "/items/azure_hatchet": {
            "zh": "蔚蓝斧头",
            "en": "Azure Hatchet"
            },
            "/items/azure_helmet": {
            "zh": "蔚蓝头盔",
            "en": "Azure Helmet"
            },
            "/items/azure_mace": {
            "zh": "蔚蓝钉头锤",
            "en": "Azure Mace"
            },
            "/items/azure_needle": {
            "zh": "蔚蓝针",
            "en": "Azure Needle"
            },
            "/items/azure_plate_body": {
            "zh": "蔚蓝胸甲",
            "en": "Azure Plate Body"
            },
            "/items/azure_plate_legs": {
            "zh": "蔚蓝腿甲",
            "en": "Azure Plate Legs"
            },
            "/items/azure_pot": {
            "zh": "蔚蓝壶",
            "en": "Azure Pot"
            },
            "/items/azure_shears": {
            "zh": "蔚蓝剪刀",
            "en": "Azure Shears"
            },
            "/items/azure_spatula": {
            "zh": "蔚蓝锅铲",
            "en": "Azure Spatula"
            },
            "/items/azure_spear": {
            "zh": "蔚蓝长枪",
            "en": "Azure Spear"
            },
            "/items/azure_sword": {
            "zh": "蔚蓝剑",
            "en": "Azure Sword"
            },
            "/items/bamboo_boots": {
            "zh": "竹靴",
            "en": "Bamboo Boots"
            },
            "/items/bamboo_gloves": {
            "zh": "竹手套",
            "en": "Bamboo Gloves"
            },
            "/items/bamboo_hat": {
            "zh": "竹帽",
            "en": "Bamboo Hat"
            },
            "/items/bamboo_robe_bottoms": {
            "zh": "竹袍裙",
            "en": "Bamboo Robe Bottoms"
            },
            "/items/bamboo_robe_top": {
            "zh": "竹袍服",
            "en": "Bamboo Robe Top"
            },
            "/items/basic_alchemy_charm": {
            "zh": "基础炼金护符",
            "en": "Basic Alchemy Charm"
            },
            "/items/basic_attack_charm": {
            "zh": "基础攻击护符",
            "en": "Basic Attack Charm"
            },
            "/items/basic_brewing_charm": {
            "zh": "基础冲泡护符",
            "en": "Basic Brewing Charm"
            },
            "/items/basic_cheesesmithing_charm": {
            "zh": "基础奶酪锻造护符",
            "en": "Basic Cheesesmithing Charm"
            },
            "/items/basic_cooking_charm": {
            "zh": "基础烹饪护符",
            "en": "Basic Cooking Charm"
            },
            "/items/basic_crafting_charm": {
            "zh": "基础制作护符",
            "en": "Basic Crafting Charm"
            },
            "/items/basic_defense_charm": {
            "zh": "基础防御护符",
            "en": "Basic Defense Charm"
            },
            "/items/basic_enhancing_charm": {
            "zh": "基础强化护符",
            "en": "Basic Enhancing Charm"
            },
            "/items/basic_foraging_charm": {
            "zh": "基础采摘护符",
            "en": "Basic Foraging Charm"
            },
            "/items/basic_intelligence_charm": {
            "zh": "基础智力护符",
            "en": "Basic Intelligence Charm"
            },
            "/items/basic_magic_charm": {
            "zh": "基础魔法护符",
            "en": "Basic Magic Charm"
            },
            "/items/basic_melee_charm": {
            "zh": "基础近战护符",
            "en": "Basic Melee Charm"
            },
            "/items/basic_milking_charm": {
            "zh": "基础挤奶护符",
            "en": "Basic Milking Charm"
            },
            "/items/basic_ranged_charm": {
            "zh": "基础远程护符",
            "en": "Basic Ranged Charm"
            },
            "/items/basic_stamina_charm": {
            "zh": "基础耐力护符",
            "en": "Basic Stamina Charm"
            },
            "/items/basic_tailoring_charm": {
            "zh": "基础缝纫护符",
            "en": "Basic Tailoring Charm"
            },
            "/items/basic_task_badge": {
            "zh": "基础任务徽章",
            "en": "Basic Task Badge"
            },
            "/items/basic_woodcutting_charm": {
            "zh": "基础伐木护符",
            "en": "Basic Woodcutting Charm"
            },
            "/items/beast_boots": {
            "zh": "野兽靴",
            "en": "Beast Boots"
            },
            "/items/beast_bracers": {
            "zh": "野兽护腕",
            "en": "Beast Bracers"
            },
            "/items/beast_chaps": {
            "zh": "野兽皮裤",
            "en": "Beast Chaps"
            },
            "/items/beast_hood": {
            "zh": "野兽兜帽",
            "en": "Beast Hood"
            },
            "/items/beast_tunic": {
            "zh": "野兽皮衣",
            "en": "Beast Tunic"
            },
            "/items/birch_bow": {
            "zh": "桦木弓",
            "en": "Birch Bow"
            },
            "/items/birch_crossbow": {
            "zh": "桦木弩",
            "en": "Birch Crossbow"
            },
            "/items/birch_fire_staff": {
            "zh": "桦木火法杖",
            "en": "Birch Fire Staff"
            },
            "/items/birch_nature_staff": {
            "zh": "桦木自然法杖",
            "en": "Birch Nature Staff"
            },
            "/items/birch_shield": {
            "zh": "桦木盾",
            "en": "Birch Shield"
            },
            "/items/birch_water_staff": {
            "zh": "桦木水法杖",
            "en": "Birch Water Staff"
            },
            "/items/bishops_codex": {
            "zh": "主教法典",
            "en": "Bishop's Codex"
            },
            "/items/bishops_codex_refined": {
            "zh": "主教法典（精）",
            "en": "Bishop's Codex (R)"
            },
            "/items/black_bear_shoes": {
            "zh": "黑熊鞋",
            "en": "Black Bear Shoes"
            },
            "/items/blazing_trident": {
            "zh": "炽焰三叉戟",
            "en": "Blazing Trident"
            },
            "/items/blazing_trident_refined": {
            "zh": "炽焰三叉戟（精）",
            "en": "Blazing Trident (R)"
            },
            "/items/blooming_trident": {
            "zh": "绽放三叉戟",
            "en": "Blooming Trident"
            },
            "/items/blooming_trident_refined": {
            "zh": "绽放三叉戟（精）",
            "en": "Blooming Trident (R)"
            },
            "/items/brewers_bottoms": {
            "zh": "饮品师下装",
            "en": "Brewer's Bottoms"
            },
            "/items/brewers_top": {
            "zh": "饮品师上衣",
            "en": "Brewer's Top"
            },
            "/items/burble_alembic": {
            "zh": "深紫蒸馏器",
            "en": "Burble Alembic"
            },
            "/items/burble_boots": {
            "zh": "深紫靴",
            "en": "Burble Boots"
            },
            "/items/burble_brush": {
            "zh": "深紫刷子",
            "en": "Burble Brush"
            },
            "/items/burble_buckler": {
            "zh": "深紫圆盾",
            "en": "Burble Buckler"
            },
            "/items/burble_bulwark": {
            "zh": "深紫重盾",
            "en": "Burble Bulwark"
            },
            "/items/burble_chisel": {
            "zh": "深紫凿子",
            "en": "Burble Chisel"
            },
            "/items/burble_enhancer": {
            "zh": "深紫强化器",
            "en": "Burble Enhancer"
            },
            "/items/burble_gauntlets": {
            "zh": "深紫护手",
            "en": "Burble Gauntlets"
            },
            "/items/burble_hammer": {
            "zh": "深紫锤子",
            "en": "Burble Hammer"
            },
            "/items/burble_hatchet": {
            "zh": "深紫斧头",
            "en": "Burble Hatchet"
            },
            "/items/burble_helmet": {
            "zh": "深紫头盔",
            "en": "Burble Helmet"
            },
            "/items/burble_mace": {
            "zh": "深紫钉头锤",
            "en": "Burble Mace"
            },
            "/items/burble_needle": {
            "zh": "深紫针",
            "en": "Burble Needle"
            },
            "/items/burble_plate_body": {
            "zh": "深紫胸甲",
            "en": "Burble Plate Body"
            },
            "/items/burble_plate_legs": {
            "zh": "深紫腿甲",
            "en": "Burble Plate Legs"
            },
            "/items/burble_pot": {
            "zh": "深紫壶",
            "en": "Burble Pot"
            },
            "/items/burble_shears": {
            "zh": "深紫剪刀",
            "en": "Burble Shears"
            },
            "/items/burble_spatula": {
            "zh": "深紫锅铲",
            "en": "Burble Spatula"
            },
            "/items/burble_spear": {
            "zh": "深紫长枪",
            "en": "Burble Spear"
            },
            "/items/burble_sword": {
            "zh": "深紫剑",
            "en": "Burble Sword"
            },
            "/items/cedar_bow": {
            "zh": "雪松弓",
            "en": "Cedar Bow"
            },
            "/items/cedar_crossbow": {
            "zh": "雪松弩",
            "en": "Cedar Crossbow"
            },
            "/items/cedar_fire_staff": {
            "zh": "雪松火法杖",
            "en": "Cedar Fire Staff"
            },
            "/items/cedar_nature_staff": {
            "zh": "雪松自然法杖",
            "en": "Cedar Nature Staff"
            },
            "/items/cedar_shield": {
            "zh": "雪松盾",
            "en": "Cedar Shield"
            },
            "/items/cedar_water_staff": {
            "zh": "雪松水法杖",
            "en": "Cedar Water Staff"
            },
            "/items/celestial_alembic": {
            "zh": "星空蒸馏器",
            "en": "Celestial Alembic"
            },
            "/items/celestial_brush": {
            "zh": "星空刷子",
            "en": "Celestial Brush"
            },
            "/items/celestial_chisel": {
            "zh": "星空凿子",
            "en": "Celestial Chisel"
            },
            "/items/celestial_enhancer": {
            "zh": "星空强化器",
            "en": "Celestial Enhancer"
            },
            "/items/celestial_hammer": {
            "zh": "星空锤子",
            "en": "Celestial Hammer"
            },
            "/items/celestial_hatchet": {
            "zh": "星空斧头",
            "en": "Celestial Hatchet"
            },
            "/items/celestial_needle": {
            "zh": "星空针",
            "en": "Celestial Needle"
            },
            "/items/celestial_pot": {
            "zh": "星空壶",
            "en": "Celestial Pot"
            },
            "/items/celestial_shears": {
            "zh": "星空剪刀",
            "en": "Celestial Shears"
            },
            "/items/celestial_spatula": {
            "zh": "星空锅铲",
            "en": "Celestial Spatula"
            },
            "/items/centaur_boots": {
            "zh": "半人马靴",
            "en": "Centaur Boots"
            },
            "/items/chaotic_flail": {
            "zh": "混沌连枷",
            "en": "Chaotic Flail"
            },
            "/items/chaotic_flail_refined": {
            "zh": "混沌连枷（精）",
            "en": "Chaotic Flail (R)"
            },
            "/items/cheese_alembic": {
            "zh": "奶酪蒸馏器",
            "en": "Cheese Alembic"
            },
            "/items/cheese_boots": {
            "zh": "奶酪靴",
            "en": "Cheese Boots"
            },
            "/items/cheese_brush": {
            "zh": "奶酪刷子",
            "en": "Cheese Brush"
            },
            "/items/cheese_buckler": {
            "zh": "奶酪圆盾",
            "en": "Cheese Buckler"
            },
            "/items/cheese_bulwark": {
            "zh": "奶酪重盾",
            "en": "Cheese Bulwark"
            },
            "/items/cheese_chisel": {
            "zh": "奶酪凿子",
            "en": "Cheese Chisel"
            },
            "/items/cheese_enhancer": {
            "zh": "奶酪强化器",
            "en": "Cheese Enhancer"
            },
            "/items/cheese_gauntlets": {
            "zh": "奶酪护手",
            "en": "Cheese Gauntlets"
            },
            "/items/cheese_hammer": {
            "zh": "奶酪锤子",
            "en": "Cheese Hammer"
            },
            "/items/cheese_hatchet": {
            "zh": "奶酪斧头",
            "en": "Cheese Hatchet"
            },
            "/items/cheese_helmet": {
            "zh": "奶酪头盔",
            "en": "Cheese Helmet"
            },
            "/items/cheese_mace": {
            "zh": "奶酪钉头锤",
            "en": "Cheese Mace"
            },
            "/items/cheese_needle": {
            "zh": "奶酪针",
            "en": "Cheese Needle"
            },
            "/items/cheese_plate_body": {
            "zh": "奶酪胸甲",
            "en": "Cheese Plate Body"
            },
            "/items/cheese_plate_legs": {
            "zh": "奶酪腿甲",
            "en": "Cheese Plate Legs"
            },
            "/items/cheese_pot": {
            "zh": "奶酪壶",
            "en": "Cheese Pot"
            },
            "/items/cheese_shears": {
            "zh": "奶酪剪刀",
            "en": "Cheese Shears"
            },
            "/items/cheese_spatula": {
            "zh": "奶酪锅铲",
            "en": "Cheese Spatula"
            },
            "/items/cheese_spear": {
            "zh": "奶酪长枪",
            "en": "Cheese Spear"
            },
            "/items/cheese_sword": {
            "zh": "奶酪剑",
            "en": "Cheese Sword"
            },
            "/items/cheesemakers_bottoms": {
            "zh": "奶酪师下装",
            "en": "Cheesemaker's Bottoms"
            },
            "/items/cheesemakers_top": {
            "zh": "奶酪师上衣",
            "en": "Cheesemaker's Top"
            },
            "/items/chefs_bottoms": {
            "zh": "厨师下装",
            "en": "Chef's Bottoms"
            },
            "/items/chefs_top": {
            "zh": "厨师上衣",
            "en": "Chef's Top"
            },
            "/items/chimerical_quiver": {
            "zh": "奇幻箭袋",
            "en": "Chimerical Quiver"
            },
            "/items/chimerical_quiver_refined": {
            "zh": "奇幻箭袋（精）",
            "en": "Chimerical Quiver (R)"
            },
            "/items/chrono_gloves": {
            "zh": "时空手套",
            "en": "Chrono Gloves"
            },
            "/items/collectors_boots": {
            "zh": "收藏家靴",
            "en": "Collector's Boots"
            },
            "/items/colossus_plate_body": {
            "zh": "巨像胸甲",
            "en": "Colossus Plate Body"
            },
            "/items/colossus_plate_legs": {
            "zh": "巨像腿甲",
            "en": "Colossus Plate Legs"
            },
            "/items/corsair_helmet": {
            "zh": "掠夺者头盔",
            "en": "Corsair Helmet"
            },
            "/items/corsair_helmet_refined": {
            "zh": "掠夺者头盔（精）",
            "en": "Corsair Helmet (R)"
            },
            "/items/cotton_boots": {
            "zh": "棉靴",
            "en": "Cotton Boots"
            },
            "/items/cotton_gloves": {
            "zh": "棉手套",
            "en": "Cotton Gloves"
            },
            "/items/cotton_hat": {
            "zh": "棉帽",
            "en": "Cotton Hat"
            },
            "/items/cotton_robe_bottoms": {
            "zh": "棉袍裙",
            "en": "Cotton Robe Bottoms"
            },
            "/items/cotton_robe_top": {
            "zh": "棉袍服",
            "en": "Cotton Robe Top"
            },
            "/items/crafters_bottoms": {
            "zh": "工匠下装",
            "en": "Crafter's Bottoms"
            },
            "/items/crafters_top": {
            "zh": "工匠上衣",
            "en": "Crafter's Top"
            },
            "/items/crimson_alembic": {
            "zh": "绛红蒸馏器",
            "en": "Crimson Alembic"
            },
            "/items/crimson_boots": {
            "zh": "绛红靴",
            "en": "Crimson Boots"
            },
            "/items/crimson_brush": {
            "zh": "绛红刷子",
            "en": "Crimson Brush"
            },
            "/items/crimson_buckler": {
            "zh": "绛红圆盾",
            "en": "Crimson Buckler"
            },
            "/items/crimson_bulwark": {
            "zh": "绛红重盾",
            "en": "Crimson Bulwark"
            },
            "/items/crimson_chisel": {
            "zh": "绛红凿子",
            "en": "Crimson Chisel"
            },
            "/items/crimson_enhancer": {
            "zh": "绛红强化器",
            "en": "Crimson Enhancer"
            },
            "/items/crimson_gauntlets": {
            "zh": "绛红护手",
            "en": "Crimson Gauntlets"
            },
            "/items/crimson_hammer": {
            "zh": "绛红锤子",
            "en": "Crimson Hammer"
            },
            "/items/crimson_hatchet": {
            "zh": "绛红斧头",
            "en": "Crimson Hatchet"
            },
            "/items/crimson_helmet": {
            "zh": "绛红头盔",
            "en": "Crimson Helmet"
            },
            "/items/crimson_mace": {
            "zh": "绛红钉头锤",
            "en": "Crimson Mace"
            },
            "/items/crimson_needle": {
            "zh": "绛红针",
            "en": "Crimson Needle"
            },
            "/items/crimson_plate_body": {
            "zh": "绛红胸甲",
            "en": "Crimson Plate Body"
            },
            "/items/crimson_plate_legs": {
            "zh": "绛红腿甲",
            "en": "Crimson Plate Legs"
            },
            "/items/crimson_pot": {
            "zh": "绛红壶",
            "en": "Crimson Pot"
            },
            "/items/crimson_shears": {
            "zh": "绛红剪刀",
            "en": "Crimson Shears"
            },
            "/items/crimson_spatula": {
            "zh": "绛红锅铲",
            "en": "Crimson Spatula"
            },
            "/items/crimson_spear": {
            "zh": "绛红长枪",
            "en": "Crimson Spear"
            },
            "/items/crimson_sword": {
            "zh": "绛红剑",
            "en": "Crimson Sword"
            },
            "/items/cursed_bow": {
            "zh": "咒怨之弓",
            "en": "Cursed Bow"
            },
            "/items/cursed_bow_refined": {
            "zh": "咒怨之弓（精）",
            "en": "Cursed Bow (R)"
            },
            "/items/dairyhands_bottoms": {
            "zh": "挤奶工下装",
            "en": "Dairyhand's Bottoms"
            },
            "/items/dairyhands_top": {
            "zh": "挤奶工上衣",
            "en": "Dairyhand's Top"
            },
            "/items/demonic_plate_body": {
            "zh": "恶魔胸甲",
            "en": "Demonic Plate Body"
            },
            "/items/demonic_plate_legs": {
            "zh": "恶魔腿甲",
            "en": "Demonic Plate Legs"
            },
            "/items/dodocamel_gauntlets": {
            "zh": "渡渡驼护手",
            "en": "Dodocamel Gauntlets"
            },
            "/items/dodocamel_gauntlets_refined": {
            "zh": "渡渡驼护手（精）",
            "en": "Dodocamel Gauntlets (R)"
            },
            "/items/earrings_of_armor": {
            "zh": "护甲耳环",
            "en": "Earrings Of Armor"
            },
            "/items/earrings_of_critical_strike": {
            "zh": "暴击耳环",
            "en": "Earrings Of Critical Strike"
            },
            "/items/earrings_of_essence_find": {
            "zh": "精华发现耳环",
            "en": "Earrings Of Essence Find"
            },
            "/items/earrings_of_gathering": {
            "zh": "采集耳环",
            "en": "Earrings Of Gathering"
            },
            "/items/earrings_of_rare_find": {
            "zh": "稀有发现耳环",
            "en": "Earrings Of Rare Find"
            },
            "/items/earrings_of_regeneration": {
            "zh": "恢复耳环",
            "en": "Earrings Of Regeneration"
            },
            "/items/earrings_of_resistance": {
            "zh": "抗性耳环",
            "en": "Earrings Of Resistance"
            },
            "/items/enchanted_cloak": {
            "zh": "秘法披风",
            "en": "Enchanted Cloak"
            },
            "/items/enchanted_cloak_refined": {
            "zh": "秘法披风（精）",
            "en": "Enchanted Cloak (R)"
            },
            "/items/enchanted_gloves": {
            "zh": "附魔手套",
            "en": "Enchanted Gloves"
            },
            "/items/enhancers_bottoms": {
            "zh": "强化师下装",
            "en": "Enhancer's Bottoms"
            },
            "/items/enhancers_top": {
            "zh": "强化师上衣",
            "en": "Enhancer's Top"
            },
            "/items/expert_alchemy_charm": {
            "zh": "专家炼金护符",
            "en": "Expert Alchemy Charm"
            },
            "/items/expert_attack_charm": {
            "zh": "专家攻击护符",
            "en": "Expert Attack Charm"
            },
            "/items/expert_brewing_charm": {
            "zh": "专家冲泡护符",
            "en": "Expert Brewing Charm"
            },
            "/items/expert_cheesesmithing_charm": {
            "zh": "专家奶酪锻造护符",
            "en": "Expert Cheesesmithing Charm"
            },
            "/items/expert_cooking_charm": {
            "zh": "专家烹饪护符",
            "en": "Expert Cooking Charm"
            },
            "/items/expert_crafting_charm": {
            "zh": "专家制作护符",
            "en": "Expert Crafting Charm"
            },
            "/items/expert_defense_charm": {
            "zh": "专家防御护符",
            "en": "Expert Defense Charm"
            },
            "/items/expert_enhancing_charm": {
            "zh": "专家强化护符",
            "en": "Expert Enhancing Charm"
            },
            "/items/expert_foraging_charm": {
            "zh": "专家采摘护符",
            "en": "Expert Foraging Charm"
            },
            "/items/expert_intelligence_charm": {
            "zh": "专家智力护符",
            "en": "Expert Intelligence Charm"
            },
            "/items/expert_magic_charm": {
            "zh": "专家魔法护符",
            "en": "Expert Magic Charm"
            },
            "/items/expert_melee_charm": {
            "zh": "专家近战护符",
            "en": "Expert Melee Charm"
            },
            "/items/expert_milking_charm": {
            "zh": "专家挤奶护符",
            "en": "Expert Milking Charm"
            },
            "/items/expert_ranged_charm": {
            "zh": "专家远程护符",
            "en": "Expert Ranged Charm"
            },
            "/items/expert_stamina_charm": {
            "zh": "专家耐力护符",
            "en": "Expert Stamina Charm"
            },
            "/items/expert_tailoring_charm": {
            "zh": "专家缝纫护符",
            "en": "Expert Tailoring Charm"
            },
            "/items/expert_task_badge": {
            "zh": "专家任务徽章",
            "en": "Expert Task Badge"
            },
            "/items/expert_woodcutting_charm": {
            "zh": "专家伐木护符",
            "en": "Expert Woodcutting Charm"
            },
            "/items/eye_watch": {
            "zh": "掌上监工",
            "en": "Eye Watch"
            },
            "/items/fighter_necklace": {
            "zh": "战士项链",
            "en": "Fighter Necklace"
            },
            "/items/flaming_robe_bottoms": {
            "zh": "烈焰袍裙",
            "en": "Flaming Robe Bottoms"
            },
            "/items/flaming_robe_top": {
            "zh": "烈焰袍服",
            "en": "Flaming Robe Top"
            },
            "/items/fluffy_red_hat": {
            "zh": "蓬松红帽子",
            "en": "Fluffy Red Hat"
            },
            "/items/foragers_bottoms": {
            "zh": "采摘者下装",
            "en": "Forager's Bottoms"
            },
            "/items/foragers_top": {
            "zh": "采摘者上衣",
            "en": "Forager's Top"
            },
            "/items/frost_staff": {
            "zh": "冰霜法杖",
            "en": "Frost Staff"
            },
            "/items/furious_spear": {
            "zh": "狂怒长枪",
            "en": "Furious Spear"
            },
            "/items/furious_spear_refined": {
            "zh": "狂怒长枪（精）",
            "en": "Furious Spear (R)"
            },
            "/items/gator_vest": {
            "zh": "鳄鱼马甲",
            "en": "Gator Vest"
            },
            "/items/giant_pouch": {
            "zh": "巨大袋子",
            "en": "Giant Pouch"
            },
            "/items/ginkgo_bow": {
            "zh": "银杏弓",
            "en": "Ginkgo Bow"
            },
            "/items/ginkgo_crossbow": {
            "zh": "银杏弩",
            "en": "Ginkgo Crossbow"
            },
            "/items/ginkgo_fire_staff": {
            "zh": "银杏火法杖",
            "en": "Ginkgo Fire Staff"
            },
            "/items/ginkgo_nature_staff": {
            "zh": "银杏自然法杖",
            "en": "Ginkgo Nature Staff"
            },
            "/items/ginkgo_shield": {
            "zh": "银杏盾",
            "en": "Ginkgo Shield"
            },
            "/items/ginkgo_water_staff": {
            "zh": "银杏水法杖",
            "en": "Ginkgo Water Staff"
            },
            "/items/gluttonous_pouch": {
            "zh": "贪食之袋",
            "en": "Gluttonous Pouch"
            },
            "/items/gobo_boomstick": {
            "zh": "哥布林火棍",
            "en": "Gobo Boomstick"
            },
            "/items/gobo_boots": {
            "zh": "哥布林靴",
            "en": "Gobo Boots"
            },
            "/items/gobo_bracers": {
            "zh": "哥布林护腕",
            "en": "Gobo Bracers"
            },
            "/items/gobo_chaps": {
            "zh": "哥布林皮裤",
            "en": "Gobo Chaps"
            },
            "/items/gobo_defender": {
            "zh": "哥布林防御者",
            "en": "Gobo Defender"
            },
            "/items/gobo_hood": {
            "zh": "哥布林兜帽",
            "en": "Gobo Hood"
            },
            "/items/gobo_shooter": {
            "zh": "哥布林弹弓",
            "en": "Gobo Shooter"
            },
            "/items/gobo_slasher": {
            "zh": "哥布林关刀",
            "en": "Gobo Slasher"
            },
            "/items/gobo_smasher": {
            "zh": "哥布林狼牙棒",
            "en": "Gobo Smasher"
            },
            "/items/gobo_stabber": {
            "zh": "哥布林长剑",
            "en": "Gobo Stabber"
            },
            "/items/gobo_tunic": {
            "zh": "哥布林皮衣",
            "en": "Gobo Tunic"
            },
            "/items/grandmaster_alchemy_charm": {
            "zh": "宗师炼金护符",
            "en": "Grandmaster Alchemy Charm"
            },
            "/items/grandmaster_attack_charm": {
            "zh": "宗师攻击护符",
            "en": "Grandmaster Attack Charm"
            },
            "/items/grandmaster_brewing_charm": {
            "zh": "宗师冲泡护符",
            "en": "Grandmaster Brewing Charm"
            },
            "/items/grandmaster_cheesesmithing_charm": {
            "zh": "宗师奶酪锻造护符",
            "en": "Grandmaster Cheesesmithing Charm"
            },
            "/items/grandmaster_cooking_charm": {
            "zh": "宗师烹饪护符",
            "en": "Grandmaster Cooking Charm"
            },
            "/items/grandmaster_crafting_charm": {
            "zh": "宗师制作护符",
            "en": "Grandmaster Crafting Charm"
            },
            "/items/grandmaster_defense_charm": {
            "zh": "宗师防御护符",
            "en": "Grandmaster Defense Charm"
            },
            "/items/grandmaster_enhancing_charm": {
            "zh": "宗师强化护符",
            "en": "Grandmaster Enhancing Charm"
            },
            "/items/grandmaster_foraging_charm": {
            "zh": "宗师采摘护符",
            "en": "Grandmaster Foraging Charm"
            },
            "/items/grandmaster_intelligence_charm": {
            "zh": "宗师智力护符",
            "en": "Grandmaster Intelligence Charm"
            },
            "/items/grandmaster_magic_charm": {
            "zh": "宗师魔法护符",
            "en": "Grandmaster Magic Charm"
            },
            "/items/grandmaster_melee_charm": {
            "zh": "宗师近战护符",
            "en": "Grandmaster Melee Charm"
            },
            "/items/grandmaster_milking_charm": {
            "zh": "宗师挤奶护符",
            "en": "Grandmaster Milking Charm"
            },
            "/items/grandmaster_ranged_charm": {
            "zh": "宗师远程护符",
            "en": "Grandmaster Ranged Charm"
            },
            "/items/grandmaster_stamina_charm": {
            "zh": "宗师耐力护符",
            "en": "Grandmaster Stamina Charm"
            },
            "/items/grandmaster_tailoring_charm": {
            "zh": "宗师缝纫护符",
            "en": "Grandmaster Tailoring Charm"
            },
            "/items/grandmaster_woodcutting_charm": {
            "zh": "宗师伐木护符",
            "en": "Grandmaster Woodcutting Charm"
            },
            "/items/granite_bludgeon": {
            "zh": "花岗岩大棒",
            "en": "Granite Bludgeon"
            },
            "/items/griffin_bulwark": {
            "zh": "狮鹫重盾",
            "en": "Griffin Bulwark"
            },
            "/items/griffin_bulwark_refined": {
            "zh": "狮鹫重盾（精）",
            "en": "Griffin Bulwark (R)"
            },
            "/items/griffin_chaps": {
            "zh": "狮鹫皮裤",
            "en": "Griffin Chaps"
            },
            "/items/griffin_tunic": {
            "zh": "狮鹫皮衣",
            "en": "Griffin Tunic"
            },
            "/items/grizzly_bear_shoes": {
            "zh": "棕熊鞋",
            "en": "Grizzly Bear Shoes"
            },
            "/items/guzzling_pouch": {
            "zh": "暴饮之囊",
            "en": "Guzzling Pouch"
            },
            "/items/holy_alembic": {
            "zh": "神圣蒸馏器",
            "en": "Holy Alembic"
            },
            "/items/holy_boots": {
            "zh": "神圣靴",
            "en": "Holy Boots"
            },
            "/items/holy_brush": {
            "zh": "神圣刷子",
            "en": "Holy Brush"
            },
            "/items/holy_buckler": {
            "zh": "神圣圆盾",
            "en": "Holy Buckler"
            },
            "/items/holy_bulwark": {
            "zh": "神圣重盾",
            "en": "Holy Bulwark"
            },
            "/items/holy_chisel": {
            "zh": "神圣凿子",
            "en": "Holy Chisel"
            },
            "/items/holy_enhancer": {
            "zh": "神圣强化器",
            "en": "Holy Enhancer"
            },
            "/items/holy_gauntlets": {
            "zh": "神圣护手",
            "en": "Holy Gauntlets"
            },
            "/items/holy_hammer": {
            "zh": "神圣锤子",
            "en": "Holy Hammer"
            },
            "/items/holy_hatchet": {
            "zh": "神圣斧头",
            "en": "Holy Hatchet"
            },
            "/items/holy_helmet": {
            "zh": "神圣头盔",
            "en": "Holy Helmet"
            },
            "/items/holy_mace": {
            "zh": "神圣钉头锤",
            "en": "Holy Mace"
            },
            "/items/holy_needle": {
            "zh": "神圣针",
            "en": "Holy Needle"
            },
            "/items/holy_plate_body": {
            "zh": "神圣胸甲",
            "en": "Holy Plate Body"
            },
            "/items/holy_plate_legs": {
            "zh": "神圣腿甲",
            "en": "Holy Plate Legs"
            },
            "/items/holy_pot": {
            "zh": "神圣壶",
            "en": "Holy Pot"
            },
            "/items/holy_shears": {
            "zh": "神圣剪刀",
            "en": "Holy Shears"
            },
            "/items/holy_spatula": {
            "zh": "神圣锅铲",
            "en": "Holy Spatula"
            },
            "/items/holy_spear": {
            "zh": "神圣长枪",
            "en": "Holy Spear"
            },
            "/items/holy_sword": {
            "zh": "神圣剑",
            "en": "Holy Sword"
            },
            "/items/icy_robe_bottoms": {
            "zh": "冰霜袍裙",
            "en": "Icy Robe Bottoms"
            },
            "/items/icy_robe_top": {
            "zh": "冰霜袍服",
            "en": "Icy Robe Top"
            },
            "/items/infernal_battlestaff": {
            "zh": "炼狱法杖",
            "en": "Infernal Battlestaff"
            },
            "/items/jackalope_staff": {
            "zh": "鹿角兔之杖",
            "en": "Jackalope Staff"
            },
            "/items/knights_aegis": {
            "zh": "骑士盾",
            "en": "Knight's Aegis"
            },
            "/items/knights_aegis_refined": {
            "zh": "骑士盾（精）",
            "en": "Knight's Aegis (R)"
            },
            "/items/kraken_chaps": {
            "zh": "克拉肯皮裤",
            "en": "Kraken Chaps"
            },
            "/items/kraken_chaps_refined": {
            "zh": "克拉肯皮裤（精）",
            "en": "Kraken Chaps (R)"
            },
            "/items/kraken_tunic": {
            "zh": "克拉肯皮衣",
            "en": "Kraken Tunic"
            },
            "/items/kraken_tunic_refined": {
            "zh": "克拉肯皮衣（精）",
            "en": "Kraken Tunic (R)"
            },
            "/items/large_pouch": {
            "zh": "大袋子",
            "en": "Large Pouch"
            },
            "/items/linen_boots": {
            "zh": "亚麻靴",
            "en": "Linen Boots"
            },
            "/items/linen_gloves": {
            "zh": "亚麻手套",
            "en": "Linen Gloves"
            },
            "/items/linen_hat": {
            "zh": "亚麻帽",
            "en": "Linen Hat"
            },
            "/items/linen_robe_bottoms": {
            "zh": "亚麻袍裙",
            "en": "Linen Robe Bottoms"
            },
            "/items/linen_robe_top": {
            "zh": "亚麻袍服",
            "en": "Linen Robe Top"
            },
            "/items/lumberjacks_bottoms": {
            "zh": "伐木工下装",
            "en": "Lumberjack's Bottoms"
            },
            "/items/lumberjacks_top": {
            "zh": "伐木工上衣",
            "en": "Lumberjack's Top"
            },
            "/items/luna_robe_bottoms": {
            "zh": "月神袍裙",
            "en": "Luna Robe Bottoms"
            },
            "/items/luna_robe_top": {
            "zh": "月神袍服",
            "en": "Luna Robe Top"
            },
            "/items/maelstrom_plate_body": {
            "zh": "怒涛胸甲",
            "en": "Maelstrom Plate Body"
            },
            "/items/maelstrom_plate_body_refined": {
            "zh": "怒涛胸甲（精）",
            "en": "Maelstrom Plate Body (R)"
            },
            "/items/maelstrom_plate_legs": {
            "zh": "怒涛腿甲",
            "en": "Maelstrom Plate Legs"
            },
            "/items/maelstrom_plate_legs_refined": {
            "zh": "怒涛腿甲（精）",
            "en": "Maelstrom Plate Legs (R)"
            },
            "/items/magicians_hat": {
            "zh": "魔术师帽",
            "en": "Magician's Hat"
            },
            "/items/magicians_hat_refined": {
            "zh": "魔术师帽（精）",
            "en": "Magician's Hat (R)"
            },
            "/items/magnetic_gloves": {
            "zh": "磁力手套",
            "en": "Magnetic Gloves"
            },
            "/items/manticore_shield": {
            "zh": "蝎狮盾",
            "en": "Manticore Shield"
            },
            "/items/marine_chaps": {
            "zh": "航海皮裤",
            "en": "Marine Chaps"
            },
            "/items/marine_tunic": {
            "zh": "海洋皮衣",
            "en": "Marine Tunic"
            },
            "/items/marksman_bracers": {
            "zh": "神射护腕",
            "en": "Marksman Bracers"
            },
            "/items/marksman_bracers_refined": {
            "zh": "神射护腕（精）",
            "en": "Marksman Bracers (R)"
            },
            "/items/master_alchemy_charm": {
            "zh": "大师炼金护符",
            "en": "Master Alchemy Charm"
            },
            "/items/master_attack_charm": {
            "zh": "大师攻击护符",
            "en": "Master Attack Charm"
            },
            "/items/master_brewing_charm": {
            "zh": "大师冲泡护符",
            "en": "Master Brewing Charm"
            },
            "/items/master_cheesesmithing_charm": {
            "zh": "大师奶酪锻造护符",
            "en": "Master Cheesesmithing Charm"
            },
            "/items/master_cooking_charm": {
            "zh": "大师烹饪护符",
            "en": "Master Cooking Charm"
            },
            "/items/master_crafting_charm": {
            "zh": "大师制作护符",
            "en": "Master Crafting Charm"
            },
            "/items/master_defense_charm": {
            "zh": "大师防御护符",
            "en": "Master Defense Charm"
            },
            "/items/master_enhancing_charm": {
            "zh": "大师强化护符",
            "en": "Master Enhancing Charm"
            },
            "/items/master_foraging_charm": {
            "zh": "大师采摘护符",
            "en": "Master Foraging Charm"
            },
            "/items/master_intelligence_charm": {
            "zh": "大师智力护符",
            "en": "Master Intelligence Charm"
            },
            "/items/master_magic_charm": {
            "zh": "大师魔法护符",
            "en": "Master Magic Charm"
            },
            "/items/master_melee_charm": {
            "zh": "大师近战护符",
            "en": "Master Melee Charm"
            },
            "/items/master_milking_charm": {
            "zh": "大师挤奶护符",
            "en": "Master Milking Charm"
            },
            "/items/master_ranged_charm": {
            "zh": "大师远程护符",
            "en": "Master Ranged Charm"
            },
            "/items/master_stamina_charm": {
            "zh": "大师耐力护符",
            "en": "Master Stamina Charm"
            },
            "/items/master_tailoring_charm": {
            "zh": "大师缝纫护符",
            "en": "Master Tailoring Charm"
            },
            "/items/master_woodcutting_charm": {
            "zh": "大师伐木护符",
            "en": "Master Woodcutting Charm"
            },
            "/items/medium_pouch": {
            "zh": "中袋子",
            "en": "Medium Pouch"
            },
            "/items/necklace_of_efficiency": {
            "zh": "效率项链",
            "en": "Necklace Of Efficiency"
            },
            "/items/necklace_of_speed": {
            "zh": "速度项链",
            "en": "Necklace Of Speed"
            },
            "/items/necklace_of_wisdom": {
            "zh": "经验项链",
            "en": "Necklace Of Wisdom"
            },
            "/items/panda_gloves": {
            "zh": "熊猫手套",
            "en": "Panda Gloves"
            },
            "/items/philosophers_earrings": {
            "zh": "贤者耳环",
            "en": "Philosopher's Earrings"
            },
            "/items/philosophers_necklace": {
            "zh": "贤者项链",
            "en": "Philosopher's Necklace"
            },
            "/items/philosophers_ring": {
            "zh": "贤者戒指",
            "en": "Philosopher's Ring"
            },
            "/items/pincer_gloves": {
            "zh": "蟹钳手套",
            "en": "Pincer Gloves"
            },
            "/items/polar_bear_shoes": {
            "zh": "北极熊鞋",
            "en": "Polar Bear Shoes"
            },
            "/items/purpleheart_bow": {
            "zh": "紫心弓",
            "en": "Purpleheart Bow"
            },
            "/items/purpleheart_crossbow": {
            "zh": "紫心弩",
            "en": "Purpleheart Crossbow"
            },
            "/items/purpleheart_fire_staff": {
            "zh": "紫心火法杖",
            "en": "Purpleheart Fire Staff"
            },
            "/items/purpleheart_nature_staff": {
            "zh": "紫心自然法杖",
            "en": "Purpleheart Nature Staff"
            },
            "/items/purpleheart_shield": {
            "zh": "紫心盾",
            "en": "Purpleheart Shield"
            },
            "/items/purpleheart_water_staff": {
            "zh": "紫心水法杖",
            "en": "Purpleheart Water Staff"
            },
            "/items/radiant_boots": {
            "zh": "光辉靴",
            "en": "Radiant Boots"
            },
            "/items/radiant_gloves": {
            "zh": "光辉手套",
            "en": "Radiant Gloves"
            },
            "/items/radiant_hat": {
            "zh": "光辉帽",
            "en": "Radiant Hat"
            },
            "/items/radiant_robe_bottoms": {
            "zh": "光辉袍裙",
            "en": "Radiant Robe Bottoms"
            },
            "/items/radiant_robe_top": {
            "zh": "光辉袍服",
            "en": "Radiant Robe Top"
            },
            "/items/rainbow_alembic": {
            "zh": "彩虹蒸馏器",
            "en": "Rainbow Alembic"
            },
            "/items/rainbow_boots": {
            "zh": "彩虹靴",
            "en": "Rainbow Boots"
            },
            "/items/rainbow_brush": {
            "zh": "彩虹刷子",
            "en": "Rainbow Brush"
            },
            "/items/rainbow_buckler": {
            "zh": "彩虹圆盾",
            "en": "Rainbow Buckler"
            },
            "/items/rainbow_bulwark": {
            "zh": "彩虹重盾",
            "en": "Rainbow Bulwark"
            },
            "/items/rainbow_chisel": {
            "zh": "彩虹凿子",
            "en": "Rainbow Chisel"
            },
            "/items/rainbow_enhancer": {
            "zh": "彩虹强化器",
            "en": "Rainbow Enhancer"
            },
            "/items/rainbow_gauntlets": {
            "zh": "彩虹护手",
            "en": "Rainbow Gauntlets"
            },
            "/items/rainbow_hammer": {
            "zh": "彩虹锤子",
            "en": "Rainbow Hammer"
            },
            "/items/rainbow_hatchet": {
            "zh": "彩虹斧头",
            "en": "Rainbow Hatchet"
            },
            "/items/rainbow_helmet": {
            "zh": "彩虹头盔",
            "en": "Rainbow Helmet"
            },
            "/items/rainbow_mace": {
            "zh": "彩虹钉头锤",
            "en": "Rainbow Mace"
            },
            "/items/rainbow_needle": {
            "zh": "彩虹针",
            "en": "Rainbow Needle"
            },
            "/items/rainbow_plate_body": {
            "zh": "彩虹胸甲",
            "en": "Rainbow Plate Body"
            },
            "/items/rainbow_plate_legs": {
            "zh": "彩虹腿甲",
            "en": "Rainbow Plate Legs"
            },
            "/items/rainbow_pot": {
            "zh": "彩虹壶",
            "en": "Rainbow Pot"
            },
            "/items/rainbow_shears": {
            "zh": "彩虹剪刀",
            "en": "Rainbow Shears"
            },
            "/items/rainbow_spatula": {
            "zh": "彩虹锅铲",
            "en": "Rainbow Spatula"
            },
            "/items/rainbow_spear": {
            "zh": "彩虹长枪",
            "en": "Rainbow Spear"
            },
            "/items/rainbow_sword": {
            "zh": "彩虹剑",
            "en": "Rainbow Sword"
            },
            "/items/ranger_necklace": {
            "zh": "射手项链",
            "en": "Ranger Necklace"
            },
            "/items/red_culinary_hat": {
            "zh": "红色厨师帽",
            "en": "Red Culinary Hat"
            },
            "/items/redwood_bow": {
            "zh": "红杉弓",
            "en": "Redwood Bow"
            },
            "/items/redwood_crossbow": {
            "zh": "红杉弩",
            "en": "Redwood Crossbow"
            },
            "/items/redwood_fire_staff": {
            "zh": "红杉火法杖",
            "en": "Redwood Fire Staff"
            },
            "/items/redwood_nature_staff": {
            "zh": "红杉自然法杖",
            "en": "Redwood Nature Staff"
            },
            "/items/redwood_shield": {
            "zh": "红杉盾",
            "en": "Redwood Shield"
            },
            "/items/redwood_water_staff": {
            "zh": "红杉水法杖",
            "en": "Redwood Water Staff"
            },
            "/items/regal_sword": {
            "zh": "君王之剑",
            "en": "Regal Sword"
            },
            "/items/regal_sword_refined": {
            "zh": "君王之剑（精）",
            "en": "Regal Sword (R)"
            },
            "/items/reptile_boots": {
            "zh": "爬行动物靴",
            "en": "Reptile Boots"
            },
            "/items/reptile_bracers": {
            "zh": "爬行动物护腕",
            "en": "Reptile Bracers"
            },
            "/items/reptile_chaps": {
            "zh": "爬行动物皮裤",
            "en": "Reptile Chaps"
            },
            "/items/reptile_hood": {
            "zh": "爬行动物兜帽",
            "en": "Reptile Hood"
            },
            "/items/reptile_tunic": {
            "zh": "爬行动物皮衣",
            "en": "Reptile Tunic"
            },
            "/items/revenant_chaps": {
            "zh": "亡灵皮裤",
            "en": "Revenant Chaps"
            },
            "/items/revenant_tunic": {
            "zh": "亡灵皮衣",
            "en": "Revenant Tunic"
            },
            "/items/ring_of_armor": {
            "zh": "护甲戒指",
            "en": "Ring Of Armor"
            },
            "/items/ring_of_critical_strike": {
            "zh": "暴击戒指",
            "en": "Ring Of Critical Strike"
            },
            "/items/ring_of_essence_find": {
            "zh": "精华发现戒指",
            "en": "Ring Of Essence Find"
            },
            "/items/ring_of_gathering": {
            "zh": "采集戒指",
            "en": "Ring Of Gathering"
            },
            "/items/ring_of_rare_find": {
            "zh": "稀有发现戒指",
            "en": "Ring Of Rare Find"
            },
            "/items/ring_of_regeneration": {
            "zh": "恢复戒指",
            "en": "Ring Of Regeneration"
            },
            "/items/ring_of_resistance": {
            "zh": "抗性戒指",
            "en": "Ring Of Resistance"
            },
            "/items/rippling_trident": {
            "zh": "涟漪三叉戟",
            "en": "Rippling Trident"
            },
            "/items/rippling_trident_refined": {
            "zh": "涟漪三叉戟（精）",
            "en": "Rippling Trident (R)"
            },
            "/items/rough_boots": {
            "zh": "粗糙靴",
            "en": "Rough Boots"
            },
            "/items/rough_bracers": {
            "zh": "粗糙护腕",
            "en": "Rough Bracers"
            },
            "/items/rough_chaps": {
            "zh": "粗糙皮裤",
            "en": "Rough Chaps"
            },
            "/items/rough_hood": {
            "zh": "粗糙兜帽",
            "en": "Rough Hood"
            },
            "/items/rough_tunic": {
            "zh": "粗糙皮衣",
            "en": "Rough Tunic"
            },
            "/items/royal_fire_robe_bottoms": {
            "zh": "皇家火系袍裙",
            "en": "Royal Fire Robe Bottoms"
            },
            "/items/royal_fire_robe_bottoms_refined": {
            "zh": "皇家火系袍裙（精）",
            "en": "Royal Fire Robe Bottoms (R)"
            },
            "/items/royal_fire_robe_top": {
            "zh": "皇家火系袍服",
            "en": "Royal Fire Robe Top"
            },
            "/items/royal_fire_robe_top_refined": {
            "zh": "皇家火系袍服（精）",
            "en": "Royal Fire Robe Top (R)"
            },
            "/items/royal_nature_robe_bottoms": {
            "zh": "皇家自然系袍裙",
            "en": "Royal Nature Robe Bottoms"
            },
            "/items/royal_nature_robe_bottoms_refined": {
            "zh": "皇家自然系袍裙（精）",
            "en": "Royal Nature Robe Bottoms (R)"
            },
            "/items/royal_nature_robe_top": {
            "zh": "皇家自然系袍服",
            "en": "Royal Nature Robe Top"
            },
            "/items/royal_nature_robe_top_refined": {
            "zh": "皇家自然系袍服（精）",
            "en": "Royal Nature Robe Top (R)"
            },
            "/items/royal_water_robe_bottoms": {
            "zh": "皇家水系袍裙",
            "en": "Royal Water Robe Bottoms"
            },
            "/items/royal_water_robe_bottoms_refined": {
            "zh": "皇家水系袍裙（精）",
            "en": "Royal Water Robe Bottoms (R)"
            },
            "/items/royal_water_robe_top": {
            "zh": "皇家水系袍服",
            "en": "Royal Water Robe Top"
            },
            "/items/royal_water_robe_top_refined": {
            "zh": "皇家水系袍服（精）",
            "en": "Royal Water Robe Top (R)"
            },
            "/items/shoebill_shoes": {
            "zh": "鲸头鹳鞋",
            "en": "Shoebill Shoes"
            },
            "/items/sighted_bracers": {
            "zh": "瞄准护腕",
            "en": "Sighted Bracers"
            },
            "/items/silk_boots": {
            "zh": "丝靴",
            "en": "Silk Boots"
            },
            "/items/silk_gloves": {
            "zh": "丝手套",
            "en": "Silk Gloves"
            },
            "/items/silk_hat": {
            "zh": "丝帽",
            "en": "Silk Hat"
            },
            "/items/silk_robe_bottoms": {
            "zh": "丝绸袍裙",
            "en": "Silk Robe Bottoms"
            },
            "/items/silk_robe_top": {
            "zh": "丝绸袍服",
            "en": "Silk Robe Top"
            },
            "/items/sinister_cape": {
            "zh": "阴森斗篷",
            "en": "Sinister Cape"
            },
            "/items/sinister_cape_refined": {
            "zh": "阴森斗篷（精）",
            "en": "Sinister Cape (R)"
            },
            "/items/small_pouch": {
            "zh": "小袋子",
            "en": "Small Pouch"
            },
            "/items/snail_shell_helmet": {
            "zh": "蜗牛壳头盔",
            "en": "Snail Shell Helmet"
            },
            "/items/snake_fang_dirk": {
            "zh": "蛇牙短剑",
            "en": "Snake Fang Dirk"
            },
            "/items/sorcerer_boots": {
            "zh": "巫师靴",
            "en": "Sorcerer Boots"
            },
            "/items/soul_hunter_crossbow": {
            "zh": "灵魂猎手弩",
            "en": "Soul Hunter Crossbow"
            },
            "/items/spiked_bulwark": {
            "zh": "尖刺重盾",
            "en": "Spiked Bulwark"
            },
            "/items/stalactite_spear": {
            "zh": "石钟长枪",
            "en": "Stalactite Spear"
            },
            "/items/sundering_crossbow": {
            "zh": "裂空之弩",
            "en": "Sundering Crossbow"
            },
            "/items/sundering_crossbow_refined": {
            "zh": "裂空之弩（精）",
            "en": "Sundering Crossbow (R)"
            },
            "/items/tailors_bottoms": {
            "zh": "裁缝下装",
            "en": "Tailor's Bottoms"
            },
            "/items/tailors_top": {
            "zh": "裁缝上衣",
            "en": "Tailor's Top"
            },
            "/items/tome_of_healing": {
            "zh": "治疗之书",
            "en": "Tome Of Healing"
            },
            "/items/tome_of_the_elements": {
            "zh": "元素之书",
            "en": "Tome Of The Elements"
            },
            "/items/trainee_alchemy_charm": {
            "zh": "实习炼金护符",
            "en": "Trainee Alchemy Charm"
            },
            "/items/trainee_attack_charm": {
            "zh": "实习攻击护符",
            "en": "Trainee Attack Charm"
            },
            "/items/trainee_brewing_charm": {
            "zh": "实习冲泡护符",
            "en": "Trainee Brewing Charm"
            },
            "/items/trainee_cheesesmithing_charm": {
            "zh": "实习奶酪锻造护符",
            "en": "Trainee Cheesesmithing Charm"
            },
            "/items/trainee_cooking_charm": {
            "zh": "实习烹饪护符",
            "en": "Trainee Cooking Charm"
            },
            "/items/trainee_crafting_charm": {
            "zh": "实习制作护符",
            "en": "Trainee Crafting Charm"
            },
            "/items/trainee_defense_charm": {
            "zh": "实习防御护符",
            "en": "Trainee Defense Charm"
            },
            "/items/trainee_enhancing_charm": {
            "zh": "实习强化护符",
            "en": "Trainee Enhancing Charm"
            },
            "/items/trainee_foraging_charm": {
            "zh": "实习采摘护符",
            "en": "Trainee Foraging Charm"
            },
            "/items/trainee_intelligence_charm": {
            "zh": "实习智力护符",
            "en": "Trainee Intelligence Charm"
            },
            "/items/trainee_magic_charm": {
            "zh": "实习魔法护符",
            "en": "Trainee Magic Charm"
            },
            "/items/trainee_melee_charm": {
            "zh": "实习近战护符",
            "en": "Trainee Melee Charm"
            },
            "/items/trainee_milking_charm": {
            "zh": "实习挤奶护符",
            "en": "Trainee Milking Charm"
            },
            "/items/trainee_ranged_charm": {
            "zh": "实习远程护符",
            "en": "Trainee Ranged Charm"
            },
            "/items/trainee_stamina_charm": {
            "zh": "实习耐力护符",
            "en": "Trainee Stamina Charm"
            },
            "/items/trainee_tailoring_charm": {
            "zh": "实习缝纫护符",
            "en": "Trainee Tailoring Charm"
            },
            "/items/trainee_woodcutting_charm": {
            "zh": "实习伐木护符",
            "en": "Trainee Woodcutting Charm"
            },
            "/items/treant_shield": {
            "zh": "树人盾",
            "en": "Treant Shield"
            },
            "/items/turtle_shell_body": {
            "zh": "龟壳胸甲",
            "en": "Turtle Shell Body"
            },
            "/items/turtle_shell_legs": {
            "zh": "龟壳腿甲",
            "en": "Turtle Shell Legs"
            },
            "/items/umbral_boots": {
            "zh": "暗影靴",
            "en": "Umbral Boots"
            },
            "/items/umbral_bracers": {
            "zh": "暗影护腕",
            "en": "Umbral Bracers"
            },
            "/items/umbral_chaps": {
            "zh": "暗影皮裤",
            "en": "Umbral Chaps"
            },
            "/items/umbral_hood": {
            "zh": "暗影兜帽",
            "en": "Umbral Hood"
            },
            "/items/umbral_tunic": {
            "zh": "暗影皮衣",
            "en": "Umbral Tunic"
            },
            "/items/vampire_fang_dirk": {
            "zh": "吸血鬼短剑",
            "en": "Vampire Fang Dirk"
            },
            "/items/vampiric_bow": {
            "zh": "吸血弓",
            "en": "Vampiric Bow"
            },
            "/items/verdant_alembic": {
            "zh": "翠绿蒸馏器",
            "en": "Verdant Alembic"
            },
            "/items/verdant_boots": {
            "zh": "翠绿靴",
            "en": "Verdant Boots"
            },
            "/items/verdant_brush": {
            "zh": "翠绿刷子",
            "en": "Verdant Brush"
            },
            "/items/verdant_buckler": {
            "zh": "翠绿圆盾",
            "en": "Verdant Buckler"
            },
            "/items/verdant_bulwark": {
            "zh": "翠绿重盾",
            "en": "Verdant Bulwark"
            },
            "/items/verdant_chisel": {
            "zh": "翠绿凿子",
            "en": "Verdant Chisel"
            },
            "/items/verdant_enhancer": {
            "zh": "翠绿强化器",
            "en": "Verdant Enhancer"
            },
            "/items/verdant_gauntlets": {
            "zh": "翠绿护手",
            "en": "Verdant Gauntlets"
            },
            "/items/verdant_hammer": {
            "zh": "翠绿锤子",
            "en": "Verdant Hammer"
            },
            "/items/verdant_hatchet": {
            "zh": "翠绿斧头",
            "en": "Verdant Hatchet"
            },
            "/items/verdant_helmet": {
            "zh": "翠绿头盔",
            "en": "Verdant Helmet"
            },
            "/items/verdant_mace": {
            "zh": "翠绿钉头锤",
            "en": "Verdant Mace"
            },
            "/items/verdant_needle": {
            "zh": "翠绿针",
            "en": "Verdant Needle"
            },
            "/items/verdant_plate_body": {
            "zh": "翠绿胸甲",
            "en": "Verdant Plate Body"
            },
            "/items/verdant_plate_legs": {
            "zh": "翠绿腿甲",
            "en": "Verdant Plate Legs"
            },
            "/items/verdant_pot": {
            "zh": "翠绿壶",
            "en": "Verdant Pot"
            },
            "/items/verdant_shears": {
            "zh": "翠绿剪刀",
            "en": "Verdant Shears"
            },
            "/items/verdant_spatula": {
            "zh": "翠绿锅铲",
            "en": "Verdant Spatula"
            },
            "/items/verdant_spear": {
            "zh": "翠绿长枪",
            "en": "Verdant Spear"
            },
            "/items/verdant_sword": {
            "zh": "翠绿剑",
            "en": "Verdant Sword"
            },
            "/items/vision_helmet": {
            "zh": "视觉头盔",
            "en": "Vision Helmet"
            },
            "/items/vision_shield": {
            "zh": "视觉盾",
            "en": "Vision Shield"
            },
            "/items/watchful_relic": {
            "zh": "警戒遗物",
            "en": "Watchful Relic"
            },
            "/items/werewolf_slasher": {
            "zh": "狼人关刀",
            "en": "Werewolf Slasher"
            },
            "/items/wizard_necklace": {
            "zh": "巫师项链",
            "en": "Wizard Necklace"
            },
            "/items/wooden_bow": {
            "zh": "木弓",
            "en": "Wooden Bow"
            },
            "/items/wooden_crossbow": {
            "zh": "木弩",
            "en": "Wooden Crossbow"
            },
            "/items/wooden_fire_staff": {
            "zh": "木制火法杖",
            "en": "Wooden Fire Staff"
            },
            "/items/wooden_nature_staff": {
            "zh": "木制自然法杖",
            "en": "Wooden Nature Staff"
            },
            "/items/wooden_shield": {
            "zh": "木盾",
            "en": "Wooden Shield"
            },
            "/items/wooden_water_staff": {
            "zh": "木制水法杖",
            "en": "Wooden Water Staff"
            }
        }
        return list[itemHrid][useLanguage];
    }

    function hookWS() {
        const dataProperty = Object.getOwnPropertyDescriptor(MessageEvent.prototype, "data");
        const oriGet = dataProperty.get;

        dataProperty.get = hookedGet;
        Object.defineProperty(MessageEvent.prototype, "data", dataProperty);

        function hookedGet() {
            const socket = this.currentTarget;
            if (!(socket instanceof WebSocket)) {
                return oriGet.call(this);
            }
            if (socket.url.indexOf("api.milkywayidle.com/ws") <= -1 && 
                socket.url.indexOf("api-test.milkywayidle.com/ws") <= -1 && 
                socket.url.indexOf("api.milkywayidlecn.com/ws") <= -1 && 
                socket.url.indexOf("api-test.milkywayidlecn.com/ws") <= -1) {
                return oriGet.call(this);
            }

            const message = oriGet.call(this);
            Object.defineProperty(this, "data", { value: message });
            return handleMessage(message);
        }
    }

    function handleMessage(message) {
        let obj = JSON.parse(message);
        if (obj && obj.type === "action_completed") {
            if (obj.endCharacterAction.actionHrid == "/actions/enhancing/enhance") {
                handleEnhanceData(obj);
                updateSelect();
            }
        }
        return message;
    }

    function initEnhanceData(actionData) {
        return {
            levelData: {},
            chartData: [],
            enhanceCount: 0,
            useProt: 0,
            hitMaxLevel: false,
            createdAt: "",
            updatedAt: "",
            curLevel: 0,
            itemName: getEquipmentName(actionData.primaryItemHrid),
            maxLevel: actionData.maxLevel,
            protLevel: actionData.minLevel,
            actionId: actionData.actionId,
        };
    }

    function updateEnhanceData(curData, actionData) {
        const { preLevel, curLevel, enhanceCount, createdAt, updatedAt } = actionData;
        const isSuccess = curLevel > preLevel;
        const isUsedProt = !isSuccess && curLevel >= 1;
        const isBlessed = isSuccess && curLevel == preLevel + 2;

        let preLevelData = curData.levelData[preLevel];
        if (!preLevelData) {
            preLevelData = [0, 0, 0];
            curData.levelData[preLevel] = preLevelData;
        }
        preLevelData[0] += isSuccess ? 1 : 0;
        preLevelData[1] += !isSuccess ? 1 : 0;
        preLevelData[2] += isBlessed ? 1 : 0;

        let chartData = curData.chartData;
        chartData.push([preLevel, curLevel, enhanceCount]);
        if (chartData.length > config.MAX_POINT_COUNT) {
            chartData.shift();
        }

        curData.enhanceCount = enhanceCount;
        curData.useProt += isUsedProt ? 1 : 0;
        curData.hitMaxLevel = curLevel == curData.maxLevel;
        curData.curLevel = curLevel;
        curData.createdAt = createdAt;
        curData.updatedAt = updatedAt;
        return curData;
    }

    function handleActionData(action_completed_json) {
        const [primaryItemHrid, curLevel] = parseItemHash(action_completed_json.endCharacterAction.primaryItemHash);
        const [protItemHrid, _] = parseItemHash(action_completed_json.endCharacterAction.secondaryItemHash);
        const preLevel = findPreviousLevel(action_completed_json.endCharacterItems, primaryItemHrid, curLevel);
        return {
            actionId: action_completed_json.endCharacterAction.id,
            primaryItemHash: action_completed_json.endCharacterAction.primaryItemHash,
            endCharacterItems: action_completed_json.endCharacterItems,
            maxLevel: action_completed_json.endCharacterAction.enhancingMaxLevel,
            minLevel: action_completed_json.endCharacterAction.enhancingProtectionMinLevel,
            enhanceCount: action_completed_json.endCharacterAction.currentCount,
            createdAt: action_completed_json.endCharacterAction.createdAt,
            updatedAt: action_completed_json.endCharacterAction.updatedAt,
            primaryItemHrid: primaryItemHrid,
            curLevel: curLevel,
            preLevel: preLevel,
        };
    }

    function handleEnhanceData(action_completed_json) {
        const actionData = handleActionData(action_completed_json);
        const curIndex = enhanceData.findIndex(data => data.actionId == actionData.actionId);
        let curData = curIndex == -1 ? initEnhanceData(actionData) : enhanceData[curIndex];
        curData = updateEnhanceData(curData, actionData);

        if (curIndex != -1) {
            enhanceData.splice(curIndex, 1);
        }
        enhanceData.unshift(curData);

        if (enhanceData.length > 10) {
            enhanceData.pop();
        }

        localStorage.setItem(config.STORAGE_KEY, JSON.stringify(enhanceData));
    }

    function injectStyles() {
        if (document.querySelector("#enhance-style")) {
            return;
        }
        const styles = document.createElement("style");
        styles.id = "enhance-style";
        styles.textContent = `
            .enhance-panel-container {
                position: fixed;
                left: 100px;
                top: 100px;
                background-color: #fff;
                border-radius: 12px;
                box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
                overflow: hidden;
                z-index: 999999;
                font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
                display:flex;
                width: fit-content;
            }

            .enhance-data-panel {
                width: ${config.TABLE_WIDTH};
                padding: 8px;
                box-sizing: border-box;
                border-left: 1px solid #f0f2f5;
                overflow: hidden;
            }

            .canvas-container {
                display: flex;
                align-items: center;
                flex: 1;
                width: 100%;
            }

            .chart-container {
                width: ${config.CHART_WIDTH};
                flex-grow: 1;
                padding: 8px;
                box-sizing: border-box;
                display: flex;
                flex-direction: column;
            }

            .panel-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding-bottom: 5px;
                margin: 5px 0 5px 0;
                border-bottom: 1px solid #f0f2f5;
            }

            .panel-title {
                font-size: 15px;
                font-weight: 600;
                color: #1d2129;
                margin: 0 0 0 5px;
            }

            .chart-toggle-btn{
                border-radius: 50%;
                height: 25px;
                width: 25px;
                display: flex;
                justify-content: center;
                align-items: center;
                cursor: pointer;
                transition: all 0.3s ease;
                border: none;
                background: rgba(112, 107, 255, 0.15)
            }
            .chart-toggle-btn:hover{
                background: rgba(112, 107, 255, 0.25);
                transform: scale(1.1);
            }

            .item-select {
                color:black;
                width: 100%;
                padding: 6px 10px;
                border: 1px solid #e2e8f0;
                border-radius: 8px;
                margin-bottom: 8px;
                font-size: 12px;
                text-align: center;
                background: white;
                box-shadow: 0 2px 5px rgba(0, 0, 0, 0.05);
                transition: all 0.3s ease;
                appearance: none;
                background-image: url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%236b7280' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e");
                background-repeat: no-repeat;
                background-position: right 12px center;
                background-size: 14px;
            }

            .item-select:focus {
                outline: none;
                border-color: #3b82f6;
                box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
            }

            .item-select.success {
                background-color: #f0fdf4;
                border-color: #22c55e;
                color: #166534;
            }

            .item-select.failure {
                background-color: #fef2f2;
                border-color: #ef4444;
                color: #991b1b;
            }

            option.success {
                background-color: #f0fdf4 !important;
                color: #166534 !important;
            }

            option.failure {
                background-color: #fef2f2 !important;
                color: #991b1b !important;
            }

            .enhance-table {
                width: 100%;
                border-collapse: collapse;
                font-size: 12px;
                table-layout: fixed;
            }

            .enhance-table td {
                padding: 4px 8px;
                text-align: center;
                border-bottom: 1px solid #f0f2f5;
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
            }

            .enhance-table th {
                background-color: #f5f7fa;
                color: #4e5969;
                font-weight: 500;
                font-size:13px;
                padding: 6px 8px;
                text-align: center;
            }

            .enhance-table tbody tr:hover {
                background-color: #fafafa;
            }

            .enhance-table tbody tr:nth-child(even) {
                background-color: #fcfdfe;
            }

            .success-rate {
                color: #00b42a;
                font-weight: 500;
            }

            .table-footer {
                background-color: #f5f7fa;
                font-weight: 500;
                color: #1d2129;
            }

            .chart-canvas {
                width: 100%;
                min-height:250px;
                max-height:250px;
            }

            .chart-header {
                font-weight:500;
                width: 100%;
                height: 30px;
                color: black;
                display: flex;
                justify-content: center;
                align-items: center;
            }

            .enhance-table tbody tr.current-level {
                background-color: #cde8fa;
                outline: 2px solid #3b82f6;
                outline-offset: -2px;
                border-radius: 6px;
            }

            .chart-foot {
                width: 100%;
                font-size: 12px;
                background-color: #f5f7fa;
                padding: 6px 8px;
                text-align: center;
                font-weight: 500;
                color: #1d2129;
            }

            .chart-icon::before {
                content: "📊";
                display: inline-block;
                margin-right: 4px;
            }
        `;
        document.head.appendChild(styles);
    }

    function insertButton() {
        const waitForNavi = () => {
            const targetNode = document.querySelector("div.NavigationBar_minorNavigationLinks__dbxh7");
            if (targetNode) {
                let div = document.createElement("div");
                div.setAttribute("class", "NavigationBar_minorNavigationLink__31K7Y");
                div.style.color = "#ED694D";
                div.innerHTML = `${t.description}`;
                div.addEventListener("click", () => {
                    createPanelContainer();
                });
                targetNode.insertAdjacentElement("afterbegin", div);
            } else {
                setTimeout(insertButton, 1000);
            }
        };
        waitForNavi();
    }

    function createPanelContainer() {
        const container = document.querySelector("#enhance-panel-container");
        if (container) {
            if (state.chartInstance) {
                state.chartInstance.destroy();
            }
            panelStateIndex = 1;
            container.remove();
            Object.keys(state).forEach(key => state[key] = null);
            return;
        }
        initPanel();
        initEventListeners();
        updateSelect();
        updateCanvas();
    }

    function initPanel() {
        const container = document.createElement('div');
        container.className = 'enhance-panel-container';
        container.id = "enhance-panel-container";
        state.container = container;

        const chartContainer = document.createElement('div');
        chartContainer.className = 'chart-container';
        state.chartContainer = chartContainer;

        const header = createHeader();
        const select = createSelect();
        const canvasContainer = createCanvasContainer();
        const chartFoot = createChartFoot();

        chartContainer.appendChild(header);
        chartContainer.appendChild(select);
        chartContainer.appendChild(canvasContainer);
        chartContainer.appendChild(chartFoot);

        container.appendChild(chartContainer);
        document.body.appendChild(container);
    }

    function createHeader() {
        const header = document.createElement('div');
        header.className = 'panel-header';

        const titleContainer = document.createElement("div");
        titleContainer.style.display = "flex";
        titleContainer.innerHTML = `
            <button title="${t.deleteTip}" class="chart-toggle-btn" id="delete-button">🗑️</button>
            <h3 class="panel-title">${t.title}</h3>
        `;

        const buttonContainer = document.createElement("div");
        buttonContainer.style.display = "flex";
        buttonContainer.innerHTML = `
            <button title="${t.outputTip}" class="chart-toggle-btn" id="output-button" style="margin-right:15px;">📄</button>
            <button class="chart-toggle-btn" id="toggle-button">📊</button>
        `;
        

        header.appendChild(titleContainer);
        header.appendChild(buttonContainer);
        return header;
    }

    function createSelect() {
        const select = document.createElement('select');
        select.classList.add('item-select');
        state.select = select;
        return select;
    }

    function createDataPanel() {
        const dataPanel = document.createElement('div');
        dataPanel.className = 'enhance-data-panel';
        const table = createTable();
        dataPanel.appendChild(table);
        return dataPanel;
    }

    function createTable() {
        const table = document.createElement('table');
        table.className = 'enhance-table';

        const thead = document.createElement('thead');
        thead.innerHTML = `
            <tr>
                <th>${t.level}</th>
                <th>${t.success}</th>
                <th>${t.failure}</th>
                <th>${t.rate}</th>
            </tr>
        `;

        const tbody = document.createElement('tbody');
        state.tbody = tbody;

        const tfoot = document.createElement('tfoot');
        state.tfoot = tfoot;

        table.appendChild(thead);
        table.appendChild(tbody);
        table.appendChild(tfoot);
        return table;
    }

    function createCanvasContainer() {
        const canvasContainer = document.createElement('div');
        canvasContainer.className = 'canvas-container';
        state.canvasContainer = canvasContainer;

        const canvas = document.createElement('canvas');
        canvas.className = 'chart-canvas';

        const chartInstance = createCanvas(canvas);
        state.chartInstance = chartInstance;

        canvasContainer.appendChild(canvas);
        return canvasContainer;
    }

    function createChartFoot() {
        const chartFoot = document.createElement('div');
        chartFoot.className = 'chart-foot';
        state.chartFoot = chartFoot;
        return chartFoot;
    }

    function togglePanelState() {
        panelStateIndex = (panelStateIndex + 1) % panelState.length;
        if (panelState[panelStateIndex] == "expanded") {
            expandedPanel();
        } else if (panelState[panelStateIndex] == "collapsed") {
            collapsedPanel();
        } else {
            recoverCollapsedPanel();
        }
    }

    function expandedPanel() {
        const dataPanel = createDataPanel();
        state.dataPanel = dataPanel;
        state.container.appendChild(dataPanel);
        updateTable();
    }

    function collapsedPanel() {
        if (state.dataPanel) {
            state.dataPanel.remove();
            state.dataPanel = null;
            state.tfoot = null;
            state.tbody = null;
        }

        if (state.chartInstance) {
            state.chartInstance.destroy();
            state.chartInstance = null;
        }
        if (state.canvasContainer) {
            state.canvasContainer.remove();
            state.canvasContainer = null;
        }
        if (state.select) {
            state.select.remove();
            state.select = null;
        }
        if (state.chartFoot) {
            state.chartFoot.remove();
            state.chartFoot = null;
        }
        state.chartContainer.style.width = config.COLLAPSED_CHART_WIDTH;
    }

    function recoverCollapsedPanel() {
        state.chartContainer.style.width = config.CHART_WIDTH;

        const select = createSelect();
        select.addEventListener('change', () => {
            handleSelectChange();
            updateTable();
            updateCanvas();
        });

        const canvasContainer = createCanvasContainer();

        const chartFoot = createChartFoot();

        state.chartContainer.appendChild(select);
        state.chartContainer.appendChild(canvasContainer);
        state.chartContainer.appendChild(chartFoot);
        updateSelect();
    }

    function updateSelect() {
        if (!state.select) return;
        const preActionId = state.select.value;
        const preIndex = state.select.selectedIndex;
        let foundIndex = 0;

        let htmlText = ``;
        enhanceData.forEach((data, index) => {
            if (preActionId && data.actionId == preActionId) {
                foundIndex = index;
            }
            htmlText += `<option class="${data.hitMaxLevel ? "success" : "failure"}" 
                    value="${data.actionId}">
                    ${data.itemName} ${t.target}:${data.maxLevel} ${t.prot}:${data.protLevel} ${t.total}:${data.enhanceCount}
                </option>`;
        });

        state.select.innerHTML = htmlText;
        state.select.selectedIndex = preIndex == 0 ? 0 : foundIndex;
        handleSelectChange();
        if (preIndex == 0 || preIndex == null || preIndex == -1) {
            updateTable();
            updateCanvas();
        }
    }

    function handleSelectChange() {
        const select = state.select;
        if (!select) return;
        const hitMaxLevel = select.options[select.selectedIndex].classList.contains("success");
        select.classList.remove("success");
        select.classList.remove("failure");
        select.classList.add(hitMaxLevel ? "success" : "failure");
    }

    function getTableData(actionId) {
        const curData = enhanceData.find(data => data.actionId == actionId);
        if (!curData) return null;

        let total = { success: 0, failure: 0, blessed: 0 };
        let tableData = [];
        let hasCurLevelData = false;
        const curLevel = curData.curLevel;

        for (const [level, levelData] of Object.entries(curData.levelData)) {
            if (level == curLevel) hasCurLevelData = true;
            total.success += levelData[0];
            total.failure += levelData[1];
            total.blessed += levelData[2];
            tableData.push([level, levelData[0], levelData[1], levelData[2], levelData[0] / (levelData[0] + levelData[1])]);
        }

        if (!hasCurLevelData) {
            tableData.push([curLevel, 0, 0, 0, 0]);
        }
        tableData.sort((a, b) => b[0] - a[0]);

        return {
            data: tableData,
            totalSuccess: total.success,
            totalFailure: total.failure,
            totalBlessed: total.blessed,
            curLevel,
            useProt: curData.useProt,
            createdAt: curData.createdAt,
            updatedAt: curData.updatedAt,
        };
    }

    function updateTable() {
        const { select, tbody, tfoot } = state;
        if (!select || !tbody || !tfoot) return;

        const actionId = select.value;
        const tableData = getTableData(actionId);
        if (!tableData) return;

        const { data, totalSuccess, totalFailure, totalBlessed, curLevel, useProt, createdAt, updatedAt } = tableData;

        const tableRowHTML = `
            <tr>
                <td>${t.total}</td>
                <td>${totalSuccess}</td>
                <td>${totalFailure}</td>
                <td>${formatToPercent(totalSuccess / (totalSuccess + totalFailure), 1)}</td>
            </tr>
        `;

        const tableRowsHTML = data.map(curData => {
            const tr = document.createElement("tr");
            if (curData[0] == curLevel) tr.classList.add("current-level");
            const blessedText = curData[3] == 0 ? `` : ` (${curData[3]})`;
            tr.innerHTML = `
                <td>${curData[0]}</td>
                <td>${curData[1]}${blessedText}</td>
                <td>${curData[2]}</td>
                <td>${formatToPercent(curData[4], 1)}</td>
            `;
            return tr.outerHTML;
        }).join("");

        tbody.innerHTML = tableRowHTML + tableRowsHTML;

        tfoot.innerHTML = `
            <tr>
                <td colspan="4" class="table-footer">${t.blessedCount}: ${totalBlessed} ${t.rate}: ${totalSuccess == 0 ? 0 : formatToPercent(totalBlessed / totalSuccess, 2)} ${t.protCount}: ${useProt}</td>
            </tr>
            <tr>
                <td colspan="4" class="table-footer">${formatDateTimeLocal(createdAt)}  ${formatTimeDifference(createdAt, updatedAt)}</td>
            </tr>
        `;
    }

    function createCanvas(canvas) {
        const ctx = canvas.getContext('2d');
        const chartInstance = new Chart(ctx, {
            type: 'line',
            data: { datasets: [] },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    x: {
                        title: { display: false, text: '', color: '#4e5969', font: { size: 14 } },
                        min: 0,
                        max: config.MAX_POINT_COUNT,
                        ticks: { stepSize: 5, color: '#666' },
                        grid: { color: '#f0f2f5' },
                        beginAtZero: true,
                        type: 'linear'
                    },
                    y: {
                        title: { display: false },
                        min: 0,
                        max: 20,
                        ticks: { stepSize: 5, color: '#666' },
                        grid: { color: '#f0f2f5' }
                    }
                },
                plugins: {
                    legend: { display: false },
                    tooltip: {
                        backgroundColor: function (context) {
                            if (!context.dataset) return 'rgba(0, 0, 0, 0.7)';
                            return context.dataset.borderColor;
                        },
                        borderWidth: 0,
                        padding: 10,
                        borderRadius: 6,
                        filter: function (context) {
                            return context.dataIndex === 1;
                        },
                        callbacks: {
                            label: (context) => {
                                const dataPoint = context.raw;
                                return `${t.enhanceCount}: ${dataPoint.count} ${t.level}: ${dataPoint.y}`;
                            },
                            title: function () { return ""; }
                        }
                    }
                },
                interaction: { mode: 'nearest', axis: 'x', intersect: false },
                animation: { duration: 0, easing: 'easeOutQuart' }
            }
        });
        return chartInstance;
    }

    function updateCanvas() {
        const { select, chartInstance, chartFoot } = state;
        if (!select || !chartInstance || !chartFoot) return;

        const actionId = select.value;
        const itemData = enhanceData.find(data => data.actionId == actionId);
        if (!itemData?.chartData?.length) return;

        let maxLevel = 10;
        const chartData = itemData.chartData;
        const lastChartData = chartData[chartData.length - 1];
        const resText = `${lastChartData[1] > lastChartData[0] ? (lastChartData[1] == lastChartData[0] + 2 ? t.blessed : t.success) : t.failure}`;
        const titleText = `${itemData.itemName} ${lastChartData[2]}${useLanguage == "zh" ? "次" : "th"} [${resText}] ${t.curLevel}: ${lastChartData[1]}`;

        const basePointStyle = {
            backgroundColor: '#409eff',
            radius: 1,
            hoverRadius: 3,
            pointStyle: 'circle'
        };

        const datasets = chartData.map((item, index) => {
            const [preLevel, curLevel, count] = item;
            const diff = curLevel - preLevel;
            let lineColor = '#e54c3c';

            if (diff === 2) lineColor = '#FBB54B';
            else if (diff > 0) lineColor = '#00b42a';

            maxLevel = (preLevel >= maxLevel || curLevel >= maxLevel) ? maxLevel + 5 : maxLevel;

            return {
                label: '',
                data: [
                    { x: index, y: preLevel, count: count },
                    { x: index + 1, y: curLevel, count: count }
                ],
                borderColor: lineColor,
                borderWidth: 1,
                tension: 0,
                fill: false,
                ...basePointStyle,
                showInLegend: false
            };
        });

        chartInstance.data.datasets = datasets;
        chartFoot.textContent = titleText;
        chartInstance.canvas.dataset.actionId = actionId;
        chartInstance.options.scales.y.max = Math.min(maxLevel, 20);
        chartInstance.update();
    }

    async function outputDataToClipboard(clickCount){
        if(!state.select){
            return;
        }
        const outputLength = Math.min(clickCount*10, config.MAX_POINT_COUNT);
        const actionId = state.select.value;
        const curData = enhanceData.find(data=>data.actionId == actionId);
        if(!curData){
            return;
        }
        let enhanceCount = curData.enhanceCount;
        const chartData = curData.chartData;
        const chartDataLength = chartData.length; 
        const itemName = `[${curData.itemName}]`;
        const stopAt = `${useLanguage=="zh"?"目标":"target"}:${curData.maxLevel}`;
        const diffTime = `${useLanguage=="zh"?"耗时:":"time:"}`+formatTimeDifference(curData.createdAt, curData.updatedAt);
        const count = enhanceCount+`${useLanguage == "zh" ? "次" : "th"}: `
        let outputText = itemName+" "+stopAt+" "+diffTime+" "+count;
        let outputArr = [];
        for(let i=chartDataLength-1; i>=chartDataLength-1-outputLength;i--){
            if(i<0 || chartData[i][2] != enhanceCount){
                break;
            }
            outputArr.push(chartData[i][1]);
            enhanceCount--;
        }
        outputArr.reverse();
        outputText += outputArr.join("→")+"\n";
        if (navigator.clipboard) {
            try {
                await navigator.clipboard.writeText(outputText);
            } catch (err) {
                console.warn('Clipboard API执行失败，尝试降级方案：', err);
            }
        }
    }

    function initEventListeners() {
        if (state.container) {
            let isDragging = false;
            let startX = 0;
            let startY = 0;
            let initialLeft = 0;
            let initialTop = 0;

            function startDrag(e) {
                const isBtn = e.target.closest('.chart-toggle-btn, .item-select');
                if (isBtn) return;

                e.stopPropagation();
                const clientX = e.type.startsWith('touch') ? e.touches[0].clientX : e.clientX;
                const clientY = e.type.startsWith('touch') ? e.touches[0].clientY : e.clientY;

                initialLeft = parseInt(state.container.style.left) || 100;
                initialTop = parseInt(state.container.style.top) || 100;
                isDragging = true;
                startX = clientX;
                startY = clientY;

                document.addEventListener('mousemove', drag);
                document.addEventListener('mouseup', endDrag);
                document.addEventListener('touchmove', drag, { passive: false });
                document.addEventListener('touchend', endDrag);
            }

            function drag(e) {
                if (!isDragging) return;
                e.preventDefault();
                e.stopPropagation();

                const clientX = e.type.startsWith('touch') ? e.touches[0].clientX : e.clientX;
                const clientY = e.type.startsWith('touch') ? e.touches[0].clientY : e.clientY;

                const offsetX = clientX - startX;
                const offsetY = clientY - startY;
                state.container.style.left = `${initialLeft + offsetX}px`;
                state.container.style.top = `${initialTop + offsetY}px`;
            }

            function endDrag() {
                isDragging = false;
                document.removeEventListener('mousemove', drag);
                document.removeEventListener('mouseup', endDrag);
                document.removeEventListener('touchmove', drag);
                document.removeEventListener('touchend', endDrag);
            }

            state.container.addEventListener('mousedown', startDrag);
            state.container.addEventListener('touchstart', startDrag, { passive: false });
            state.container.style.transition = 'opacity 0.2s ease';
            state.container.addEventListener('mousemove', () => {
                if (isDragging) state.container.style.opacity = '0.9';
            });
            state.container.addEventListener('mouseup', () => {
                state.container.style.opacity = '1';
            });
        }

        const toggleBtn = document.querySelector("#toggle-button");
        if (toggleBtn) {
            toggleBtn.addEventListener("click", togglePanelState);
        }

        const outputBtn = document.querySelector("#output-button");
        if (outputBtn) {
            let clickCount = 0;
            let timer = null;
            const CLICK_DELAY = 300;

            outputBtn.addEventListener('click', function() {
                clickCount++;
                clearTimeout(timer);

                timer = setTimeout(() => {
                    outputDataToClipboard(clickCount);
                    clickCount = 0;
                }, CLICK_DELAY);
            });
        }

        if (state.select) {
            state.select.addEventListener('change', () => {
                handleSelectChange();
                updateTable();
                updateCanvas();
            });
        }

        const deleteBtn = document.querySelector("#delete-button");
        if (deleteBtn) {
            deleteBtn.addEventListener("dblclick", () => {
                enhanceData = [];
                localStorage.setItem(config.STORAGE_KEY, JSON.stringify(enhanceData));
            });
        }
    }

    hookWS();
    injectStyles();
    insertButton();
})();