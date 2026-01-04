// ==UserScript==
// @name         猫国建设者修改器
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  猫国建设者全资源修改器
// @author       阿溯
// @match        http://jsd1.2bps.cn/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/549902/%E7%8C%AB%E5%9B%BD%E5%BB%BA%E8%AE%BE%E8%80%85%E4%BF%AE%E6%94%B9%E5%99%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/549902/%E7%8C%AB%E5%9B%BD%E5%BB%BA%E8%AE%BE%E8%80%85%E4%BF%AE%E6%94%B9%E5%99%A8.meta.js
// ==/UserScript==

(function() {
    'use strict';
    $("body").append(`
    <div style="position:fixed;left:10px;bottom:10px;user-select:none;z-index:9999;background:white;padding:10px;border-radius:5px;box-shadow:0 0 10px rgba(0,0,0,0.3);">
        <select id="resource_selector" style="border:1px solid #4CAF50;color:#4CAF50;background:white;border-radius:4px;padding:5px;margin-right:5px;width:150px;">
            <optgroup label="基础资源">
                <option value="catnip">猫薄荷 (catnip)</option>
                <option value="wood">木材 (wood)</option>
                <option value="minerals">矿物 (minerals)</option>
                <option value="coal">煤炭 (coal)</option>
                <option value="iron">铁锭 (iron)</option>
                <option value="titanium">钛锭 (titanium)</option>
                <option value="gold">黄金 (gold)</option>
                <option value="oil">石油 (oil)</option>
                <option value="uranium">铀 (uranium)</option>
                <option value="unobtainium">难得素 (unobtainium)</option>
            </optgroup>
            <optgroup label="科技资源">
                <option value="manpower">喵力 (manpower)</option>
                <option value="science">科学 (science)</option>
                <option value="culture">文化点 (culture)</option>
                <option value="faith">信仰 (faith)</option>
                <option value="kittens">喵星人 (kittens)</option>
                <option value="zebras">斑马 (zebras)</option>
                <option value="starchart">星图 (starchart)</option>
                <option value="rocket">火箭 (rocket)</option>
                <option value="temporalFlux">时间通量 (temporalFlux)</option>
                <option value="gflops">浮点运算能力 (gflops)</option>
                <option value="hashrates">哈希 (hashrates)</option>
            </optgroup>
            <optgroup label="稀有资源">
                <option value="furs">皮革 (furs)</option>
                <option value="ivory">象牙 (ivory)</option>
                <option value="spice">香料 (spice)</option>
                <option value="unicorns">独角兽 (unicorns)</option>
                <option value="alicorn">空角兽 (alicorn)</option>
                <option value="tears">眼泪 (tears)</option>
            </optgroup>
            <optgroup label="高级资源">
                <option value="paragon">领导力 (paragon)</option>
                <option value="burnedParagon">燃烧领导力 (burnedParagon)</option>
                <option value="timeCrystal">时光水晶 (timeCrystal)</option>
                <option value="sorrow">悲伤 (sorrow)</option>
                <option value="elderBox">礼盒 (elderBox)</option>
                <option value="wrappingPaper">包装纸 (wrappingPaper)</option>
                <option value="blackcoin">黑币 (blackcoin)</option>
            </optgroup>
            <optgroup label="工业资源">
                <option value="beam">木梁 (beam)</option>
                <option value="slab">石板 (slab)</option>
                <option value="concrete">混凝土 (concrete)</option>
                <option value="plate">金属板 (plate)</option>
                <option value="steel">钢铁 (steel)</option>
                <option value="alloy">合金 (alloy)</option>
                <option value="gear">齿轮 (gear)</option>
                <option value="scaffold">脚手架 (scaffold)</option>
                <option value="ship">船 (ship)</option>
                <option value="tanker">油轮 (tanker)</option>
                <option value="kerosene">煤油 (kerosene)</option>
            </optgroup>
            <optgroup label="知识资源">
                <option value="manuscript">手稿 (manuscript)</option>
                <option value="parchment">羊皮纸 (parchment)</option>
                <option value="compendium">摘要 (compendium)</option>
                <option value="blueprint">蓝图 (blueprint)</option>
                <option value="thorium">钍 (thorium)</option>
                <option value="megalith">巨石 (megalith)</option>
            </optgroup>
            <optgroup label="神秘资源">
                <option value="necrocorn">死灵兽 (necrocorn)</option>
                <option value="eludium">E合金 (eludium)</option>
                <option value="void">虚空 (void)</option>
                <option value="relic">圣遗物 (relic)</option>
                <option value="antimatter">反物质 (antimatter)</option>
            </optgroup>
        </select>
        <input type="number" style="width:100px;padding:5px;border:1px solid #4CAF50;border-radius:4px;margin-right:5px;" id="resource_amount" value="10000" />
        <button id="add_resource" style="border:1px solid #4CAF50;color:white;background:#4CAF50;border-radius:4px;cursor:pointer;padding:5px 10px;">
            添加资源
        </button>
    </div>
    `);

    // 处理输入框为空的情况
    $("#resource_amount").on("input", function() {
        if ($(this).val() === "") {
            $(this).val(10000);
        }
    });

    // 添加资源按钮点击事件
    $("#add_resource").click(function() {
        const resourceType = $("#resource_selector").val();
        const amount = Number($("#resource_amount").val());

        if (gamePage && gamePage.resPool && gamePage.resPool.resourceMap && gamePage.resPool.resourceMap[resourceType]) {
            gamePage.resPool.resourceMap[resourceType].value += amount;
        } else {
            alert("资源类型不存在或游戏未加载完成！");
        }
    });
})();
