// ==UserScript==
// @name         保护助手
// @namespace    http://tampermonkey.net/
// @version      1.06
// @description  智能移除误选时可能会造成损失的保护素材选项
// @author       perfectpure
// @match        https://www.milkywayidle.com/*
// @match        https://test.milkywayidle.com/*
// @match        https://www.milkywayidlecn.com/*
// @match        https://test.milkywayidlecn.com/*
// @grant        GM_notification
// @grant        GM_getValue
// @grant        GM_setValue
// @icon         https://www.google.com/s2/favicons?sz=64&domain=milkywayidle.com
// @grant        none
// @license      CC-BY-NC-SA-4.0
// @downloadURL https://update.greasyfork.org/scripts/553620/%E4%BF%9D%E6%8A%A4%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/553620/%E4%BF%9D%E6%8A%A4%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==


(function () {

    const marketJSON = JSON.parse(localStorage.getItem("MWITools_marketAPI_json"));
    const blacklist= {
  "/items/dodocamel_gauntlets": "渡渡驼护手",
  "/items/dodocamel_gauntlets_refined": "渡渡驼护手（精）",
  "/items/cursed_bow": "诅咒之弓",
  "/items/cursed_bow_refined": "诅咒之弓（精）",
  "/items/furious_spear": "愤怒长枪",
  "/items/furious_spear_refined": "愤怒长枪（精）",
  "/items/regal_sword": "君王之剑",
  "/items/regal_sword_refined": "君王之剑（精）",
  "/items/chaotic_flail": "混沌连枷",
  "/items/chaotic_flail_refined": "混沌连枷（精）",
  "/items/sundering_crossbow": "裂空之弩",
  "/items/sundering_crossbow_refined": "裂空之弩（精）",
  "/items/rippling_trident": "涟漪三叉戟",
  "/items/rippling_trident_refined": "涟漪三叉戟（精）",
  "/items/blooming_trident": "绽放三叉戟",
  "/items/blooming_trident_refined": "绽放三叉戟（精）",
  "/items/blazing_trident": "烈焰三叉戟",
  "/items/blazing_trident_refined": "烈焰三叉戟（精）",
  "/items/sinister_cape_refined": "阴森斗篷（精）",
  "/items/chimerical_quiver_refined": "奇幻箭袋（精）",
  "/items/enchanted_cloak_refined": "秘法披风（精）",
  "/items/corsair_helmet": "掠夺者头盔",
  "/items/corsair_helmet_refined": "掠夺者头盔（精）",
  "/items/acrobatic_hood": "杂技师兜帽",
  "/items/acrobatic_hood_refined": "杂技师兜帽（精）",
  "/items/magicians_hat": "魔术师帽",
  "/items/magicians_hat_refined": "魔术师帽（精）",
  "/items/anchorbound_plate_body": "锚定胸甲",
  "/items/anchorbound_plate_body_refined": "锚定胸甲（精）",
  "/items/maelstrom_plate_body": "怒涛胸甲",
  "/items/maelstrom_plate_body_refined": "怒涛胸甲（精）",
  "/items/kraken_tunic": "克拉肯皮衣",
  "/items/kraken_tunic_refined": "克拉肯皮衣（精）",
  "/items/royal_water_robe_top": "皇家水系袍服",
  "/items/royal_water_robe_top_refined": "皇家水系袍服（精）",
  "/items/royal_nature_robe_top": "皇家自然系袍服",
  "/items/royal_nature_robe_top_refined": "皇家自然系袍服（精）",
  "/items/royal_fire_robe_top": "皇家火系袍服",
  "/items/royal_fire_robe_top_refined": "皇家火系袍服（精）",
  "/items/anchorbound_plate_legs": "锚定腿甲",
  "/items/anchorbound_plate_legs_refined": "锚定腿甲（精）",
  "/items/maelstrom_plate_legs": "怒涛腿甲",
  "/items/maelstrom_plate_legs_refined": "怒涛腿甲（精）",
  "/items/kraken_chaps": "克拉肯皮裤",
  "/items/kraken_chaps_refined": "克拉肯皮裤（精）",
  "/items/royal_water_robe_bottoms": "皇家水系袍裙",
  "/items/royal_water_robe_bottoms_refined": "皇家水系袍裙（精）",
  "/items/royal_nature_robe_bottoms": "皇家自然系袍裙",
  "/items/royal_nature_robe_bottoms_refined": "皇家自然系袍裙（精）",
  "/items/royal_fire_robe_bottoms": "皇家火系袍裙",
  "/items/royal_fire_robe_bottoms_refined": "皇家火系袍裙（精）",
  "/items/marksman_bracers": "神射护腕",
  "/items/marksman_bracers_refined": "神射护腕（精）",
  "/items/knights_aegis": "骑士盾",
  "/items/knights_aegis_refined": "骑士盾（精）",
  "/items/bishops_codex": "主教法典",
  "/items/bishops_codex_refined": "主教法典（精）",
  "/items/philosophers_necklace": "贤者项链",
  "/items/philosophers_earrings": "贤者耳环",
  "/items/philosophers_ring": "贤者戒指",
  "/items/philosophers_stone": "贤者之石",
  "/items/crushed_philosophers_stone": "贤者之石碎片",
  "/items/expert_milking_charm": "专家挤奶护符",
  "/items/master_milking_charm": "大师挤奶护符",
  "/items/grandmaster_milking_charm": "宗师挤奶护符",
  "/items/expert_foraging_charm": "专家采摘护符",
  "/items/master_foraging_charm": "大师采摘护符",
  "/items/grandmaster_foraging_charm": "宗师采摘护符",
  "/items/expert_woodcutting_charm": "专家伐木护符",
  "/items/master_woodcutting_charm": "大师伐木护符",
  "/items/grandmaster_woodcutting_charm": "宗师伐木护符",
  "/items/expert_cheesesmithing_charm": "专家奶锻护符",
  "/items/master_cheesesmithing_charm": "大师奶锻护符",
  "/items/grandmaster_cheesesmithing_charm": "宗师奶锻护符",
  "/items/expert_crafting_charm": "专家制作护符",
  "/items/master_crafting_charm": "大师制作护符",
  "/items/grandmaster_crafting_charm": "宗师制作护符",
  "/items/expert_tailoring_charm": "专家缝纫护符",
  "/items/master_tailoring_charm": "大师缝纫护符",
  "/items/grandmaster_tailoring_charm": "宗师缝纫护符",
  "/items/expert_cooking_charm": "专家烹饪护符",
  "/items/master_cooking_charm": "大师烹饪护符",
  "/items/grandmaster_cooking_charm": "宗师烹饪护符",
  "/items/expert_brewing_charm": "专家冲泡护符",
  "/items/master_brewing_charm": "大师冲泡护符",
  "/items/grandmaster_brewing_charm": "宗师冲泡护符",
  "/items/expert_alchemy_charm": "专家炼金护符",
  "/items/master_alchemy_charm": "大师炼金护符",
  "/items/grandmaster_alchemy_charm": "宗师炼金护符",
  "/items/expert_enhancing_charm": "专家强化护符",
  "/items/master_enhancing_charm": "大师强化护符",
  "/items/grandmaster_enhancing_charm": "宗师强化护符",
  "/items/expert_stamina_charm": "专家耐力护符",
  "/items/master_stamina_charm": "大师耐力护符",
  "/items/grandmaster_stamina_charm": "宗师耐力护符",
  "/items/expert_intelligence_charm": "专家智力护符",
  "/items/master_intelligence_charm": "大师智力护符",
  "/items/grandmaster_intelligence_charm": "宗师智力护符",
  "/items/expert_attack_charm": "专家攻击护符",
  "/items/master_attack_charm": "大师攻击护符",
  "/items/grandmaster_attack_charm": "宗师攻击护符",
  "/items/expert_defense_charm": "专家防御护符",
  "/items/master_defense_charm": "大师防御护符",
  "/items/grandmaster_defense_charm": "宗师防御护符",
  "/items/expert_melee_charm": "专家近战护符",
  "/items/master_melee_charm": "大师近战护符",
  "/items/grandmaster_melee_charm": "宗师近战护符",
  "/items/expert_ranged_charm": "专家远程护符",
  "/items/master_ranged_charm": "大师远程护符",
  "/items/grandmaster_ranged_charm": "宗师远程护符",
  "/items/expert_magic_charm": "专家魔法护符",
  "/items/master_magic_charm": "大师魔法护符",
  "/items/grandmaster_magic_charm": "宗师魔法护符",
  "/items/expert_task_badge": "专家任务徽章"
}

    // 监听
    if (typeof observerProtectCheck === 'undefined') {
        var observerProtectCheck = new MutationObserver(() => {
            protectCheck();
        });
        observerProtectCheck.observe(document.body, { childList: true, subtree: true });
    }

    function protectCheck() {
        const protectList = document.querySelector(".ItemSelector_itemList__Qa5lq");
        if (!protectList || !isProtectionChoose(protectList)){
        return;
        }
        var lowest=marketJSON.marketData['/items/mirror_of_protection'][0].a
        for (const protect of protectList.children) {
            const href = protect.children[0]?.children[0]?.children[0]?.children[0]?.children[0]?.children[0]?.getAttribute('href');
            if (!href){
                continue}
            const fixedPrefix = '/static/media/items_sprite.328d6606.svg#';
            // 移除固定前缀，获取后半部分
            const itemHrid = href.replace(fixedPrefix, '/items/');
           // console.log(itemHrid);
            if (marketJSON.marketData[itemHrid][0]?.a>0&&marketJSON.marketData[itemHrid][0]?.a<lowest){
                lowest=marketJSON.marketData[itemHrid][0].a
            }
        }
        for (const protect of protectList.children) {
            const href = protect.children[0]?.children[0]?.children[0]?.children[0]?.children[0]?.children[0]?.getAttribute('href');
            if (!href){
                continue}
            const fixedPrefix = '/static/media/items_sprite.328d6606.svg#';
            // 移除固定前缀，获取后半部分
            const itemHrid = href.replace(fixedPrefix, '/items/');
         //   console.log(itemHrid,'0',marketJSON.marketData[itemHrid][0]?.b,lowest);
            if (marketJSON.marketData[itemHrid][0]?.b>-1&&marketJSON.marketData[itemHrid][0]?.b>lowest){
                protect.style.display = 'none';
          //      console.log(itemHrid,'1')
            }
            if (itemHrid in blacklist){
                 protect.style.display = 'none';
         //       console.log(itemHrid,'2')
            }

            if (protect.querySelector('.Item_enhancementLevel__19g-e')){
                protect.style.display = 'none';
           //     console.log(itemHrid,'3')
            }
        }

        function isProtectionChoose(window) {
            for (let i = 1; i <= 4; i++) { // 检查当前选择界面第2,3,4,5个子元素，如果包含保护之镜则认为是保护选择界面
                if (window.children[i]) {
                    const href = window.children[i]?.children[0]?.children[0]?.children[0]?.children[0]?.children[0]?.children[0]?.getAttribute('href');
                    if (href && (href.includes('mirror') )) {
                        return true;
                    }
                }
            }
            return false;
        }

    }







})();
