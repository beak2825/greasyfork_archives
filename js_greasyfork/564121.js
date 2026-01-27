// ==UserScript==
// @name         Galactic Tycoons利润计算器
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  计算Galactic Tycoons利润并进行排序
// @author       You
// @match        https://g2.galactictycoons.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=galactictycoons.com
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/564121/Galactic%20Tycoons%E5%88%A9%E6%B6%A6%E8%AE%A1%E7%AE%97%E5%99%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/564121/Galactic%20Tycoons%E5%88%A9%E6%B6%A6%E8%AE%A1%E7%AE%97%E5%99%A8.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    var cnItems = {
        Milk: '牛奶',
        Ale: '啤酒',
        Rations: '给养',
        'Fine Rations': '精细口粮',
        'Lab. Suit': '实验室套装',
        Exosuit: '外套',
        'Drinking Water': '饮用水',
        'Adv. Tools': '高级工具',
        'Fusion Kit': '融合套件',
        Robot: '机器人',
        Coffee: '咖啡',
        Bioxene: '生物苯',
        Tesserite: '铁白云石',
        Neoplast: '新塑料',
        Fertilizer: '肥料',
        'Uranium Ore': '铀矿石',
        Flux: '助熔剂',
        Workwear: '工作服',
        'Titanium Ore': '钛矿石',
        Titanium: '钛',
        'Coffee Beans': '咖啡豆',
        Motor: '电动机',
        'El. Circuit': '电子电路',
        Lithium: '锂',
        'Sulfuric Acid': '硫酸',
        Electronics: '电子产品',
        Research: '研究',
        'Advanced Research': '高级研究',
        'Aeridium Ore': '铱矿石',
        Argon: '氩气',
        Kryon: '克里昂',
        Coolant: '冷却剂',
        Epoxy: '环氧树脂',
        'Fission Fuel': '裂变燃料',
        Kevlar: '凯芙拉合成纤维',
        'Platinum Ore': '铂矿石',
        Platinum: '铂',
        Graphene: '石墨烯',
        Aerogel: '气凝胶',
        'Graphenium Wire': '石墨线',
        'Radiation Shielding': '辐射护盾',
        'Life Support System': '生命维持系统',
        'Reinforced Glass': '强化玻璃',
        'Mining Vehicle': '采矿车',
        Chickens: '鸡肉',
        'Insulation Panels': '绝缘板',
        'Apex Struct. Element': '顶端结构。元素',
        'Composite Truss': '复合桁架',
        'TiC Drill': '抽搐钻',
        Console: '控制台',
        'Cargo Bay': '货舱',
        'Fuel Tank': '燃料罐',
        Pump: '泵',
        'Linear Emitter': '线性发射器',
        'Heat Shielding': '隔热材料',
        ACB: 'ACB',
        'Sensor Array': '传感器阵列',
        'VR Headset': 'VR头盔',
        Durablend: '耐久',
        'Neoplast Sheet': '新塑料片材',
        Transistor: '晶体管',
        'Silicon Wafer': '硅晶片',
        'Apex Research': '极品研究',
        Honeycaps: '金银花',
        Sugar: '糖',
        Pie: '馅饼',
        Eggs: '鸡蛋',
        'Fission Reactor': '裂变反应堆',
        'Quantum Emitter': '量子发射极',
        Aeridium: '铱',
        Tiridium: '氚',
        AICore: 'AI核心',
        'Hauler Bridge': '牵引桥',
        Mainframe: '主机',
        Drone: '无人机',
        Cohesilite: '粘聚体',
        'Operating System': '操作系统',
        'Training Data': '训练数据',
        Antimatter: '反物质',
        'Antimatter Reactor': '反物质反应堆',
        'Antimatter Cont.': '反物质容器',
        SuperCoil: '超级线圈',
        'Gourmet Rations': '美食口粮',
        'Exotic Spices': '异域香料',
        Lobster: '龙虾',
        Herbs: '草药',
        Vitaqua: '维塔水',
        Quadranium: '四方龛',
        Biopolyne: '生物碱',
        'Quantum Research': '量子研究',
        'Filtration System': '过滤系统',
        'Freighter Bridge': '货船桥',
        'Neural Interface': '神经接口',
        APU: 'APU',
        Starglass: '星镜',
        'Starlifter Elements': '升星元素',
        Graphenium: '石墨烯',
        'Quantum Mainframe': '量子大型机',
        'Nutrient Blend': '营养混合物',
        'Food Shipment': '粮食运输',
        'Defense pack': '防御包',
        Habitats: '栖息地',
        'Scientific Shipment': '科学运输',
        'Iron Ore': '铁矿石',
        Iron: '铁',
        Concrete: '混凝土',
        Grain: '粮食',
        Copper: '铜',
        Oxygen: '氧气',
        Silica: '硅',
        Water: '水',
        Tools: '工具',
        Hydrogen: '氢气',
        Polyethylene: '聚乙烯',
        'Construction Kit': '建造套件',
        'Construction Tools': '建造工具',
        Fruits: '水果',
        Vegetables: '蔬菜',
        Carbon: '碳',
        Nitrogen: '氮气',
        Glass: '玻璃',
        Limestone: '石灰岩',
        Steel: '钢',
        Cows: '牛',
        Meat: '肉',
        Cotton: '棉花',
        Aluminium: '铝',
        Furniture: '家具',
        Wood: '木材',
        Leather: '皮革',
        Fabric: '织物',
        'Construction Vehicle': '工程车辆',
        Rubber: '橡胶',
        Engine: '引擎',
        Battery: '电池',
        Ethanol: '乙醇',
        Lubricant: '润滑剂',
        'Office Supplies': '办公用品',
        Pipes: '管道',
        'Color Compound': '颜色化合物',
        Drill: '钻',
        'Pressure Sealant': '压力密封剂',
        'Structural Elements': '结构元素',
        'Prefab Kit': '预制套件',
        Amenities: '便利设施',
        'Advanced Constr. Kit': '高级施工套件',
        'Advanced Prefab Kit': '高级预制套件',
        'Advanced Amenities': '高级设施',
        Truss: '桁架',
        'Hydrogen Generator': '氢气发生器',
        'Ship Interior Kit': '飞船内部套件',
        'Hull Plate': '船体板',
        'Welding Kit': '焊接套件',
        'Hydrogen Fuel': '氢燃料',
        'Repair Kit': '维修工具',
        Cooling: '冷却',
        'Shuttle Bridge': '航天桥',
        'Composite Shielding': '复合护盾',
        'Nanoweave Shielding': '纳米织物护盾',
        'Modern Prefab Kit': '现代预制套件',
        Nanopolyne: '纳米聚乙烯',
        'Apex Prefab Kit': '极品预制套件',
        'Industrial Machinery': '工业机械',
        Medicine: '药品',
        'Ship Parts': '飞船部件',
        'Copper Ore': '铜矿石',
        'Aluminium Ore': '铝矿石',
        'Copper Wire': '铜电线',
        'Carbon Nanotubes': '碳纳米管',
    };
    var globalData = {};
    var priceData = {};
    var technologyTypeMap = {
        1: '建筑',
        2: '制造业',
        3: '农业',
        4: '资源提取',
        5: '冶金',
        6: '化学',
        7: '电子技术',
        8: '食物生产',
        10: '科学',
    }
    function getGameData() {
        return new Promise((resolve, reject) => {
            var xml = new XMLHttpRequest();
            xml.open('GET', 'https://api.g2.galactictycoons.com/gamedata.json?v=' + Date.now())
            xml.send();
            xml.onreadystatechange = function(e) {
                if(e.target.readyState === 4 && e.target.status === 200) {
                    globalData = JSON.parse(e.target.response);
                    window.__GT = globalData;
                    console.log(globalData);
                    resolve();
                }
            }
        })
    }
    function getPrice() {
        return new Promise((resolve) => {
            var timer = setInterval(() => {
                var data = localStorage.getItem('gt_matPrices')
                if (data) {
                    clearInterval(timer);
                    priceData = JSON.parse(data)
                    resolve();
                }
            }, 100)
        })
    }
    function getName(id) {
        return globalData.materials[id - 1].sName;
    }
    function sortByProfit() {
        const recipeMap = { all: [] };
        const recipeByTechMap = {};
        globalData.recipes.forEach((r) => {
            if (!recipeMap[r.reqTech]) recipeMap[r.reqTech] = [];
            const earn = r.output.a * priceData[r.output.id - 1].avg;
            const cost = r.inputs ? r.inputs.reduce((sum, i) => {
                return sum + i.a * priceData[i.id - 1].avg
            }, 0) : 0;
            const building = globalData.buildings[r.producedIn - 1];
            const techType = technologyTypeMap[building.specialization];
            const name = getName(r.output.id)
            if (!recipeByTechMap[techType]) recipeByTechMap[techType] = [];
            var item = {
                name,
                cnName: cnItems[name],
                tech: r.reqTech,
                type: techType,
                profit: (earn - cost) / r.timeMinutes / 100,
                inputs: r.inputs ? r.inputs.map((i) => getName(i.id)) : [],
            }
            recipeByTechMap[techType].push(item);
            recipeMap[r.reqTech].push(item);
            recipeMap.all.push(item);
        });
        Object.values(recipeMap).forEach(r => {
            r.sort((a, b) => b.profit - a.profit);
        })
        Object.values(recipeByTechMap).forEach(r => {
            r.sort((a, b) => b.profit - a.profit);
        })
        console.log(recipeMap);
        console.log(recipeByTechMap);
    }
    async function main() {
        await getGameData();
        await getPrice();
        sortByProfit();
    }
    main();
})();