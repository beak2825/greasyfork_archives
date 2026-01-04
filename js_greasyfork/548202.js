// ==UserScript==
// @name         AGV助手
// @namespace    hysyyl
// @version      25.12.30.01
// @description  AGV!
// @author       GaoBin
// @match        http://*/super_server/?systemApp=WMS*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=5.154
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/548202/AGV%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/548202/AGV%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

(function () {
    'use strict';
    GM_addStyle(".vi-right{display: flex;flex:1;justify-content: center;box-sizing:border-box;padding:12px;margin-bottom:20px;}");
    GM_addStyle("#agv0,#agv1{display: flex;flex-direction: column;flex: 1;background: #999;padding: 15px;border-radius: 6px;}");
    GM_addStyle("#agv8 {display: flex;flex-direction: column;flex: 1;background: #999;padding: 15px;border-radius: 6px;}");
    GM_addStyle(".slot_row{display:flex;flex: 1;}");
    GM_addStyle(".slot {background: #e0e0e0;flex: 1;display: flex;justify-content: center;align-items: center;font-weight: bold;border: 2px solid #ccc;border-radius: 4px;}");
    GM_addStyle(".slot.highlight {background:#ffeb3b;border-color:#fbc02d; color:#000;}");

    const state = { LPN: '', href: '' };
    const agvs = { agv: null, agv0: null, agv1: null, agv8: null };
    /**
     * 重绘界面增加仓位展示
     * @param {Number} tim 重绘次数
     */
    const relayout = function (tim = 1) {
        setTimeout(() => {
            if (tim > 20) return;
            const forms = document.querySelectorAll("form.uiForm-labelposition-top");
            if (!forms || !forms.length) {
                relayout(tim++);
                return;
            }
            const cnodes = forms[2].childNodes;
            let node = null;
            for (const _node of cnodes) {
                if (_node.tagName == "DIV" || _node.tagName == "div") {
                    node = _node;
                    break;
                }
            }
            if (!node) return;
            const coms = [];
            node.childNodes.forEach(w => {
                (w.tagName == "DIV" || w.tagName == "div") && coms.push(w);
            })
            if (coms.length != 4) return;

            const el1 = coms[1];
            const el2 = coms[2];
            const el3 = coms[3];
            if (!el1 || !el2 || !el3) {
                relayout(tim++);
                return;
            }

            const parent = el1.parentElement;
            parent.removeChild(el1);
            parent.removeChild(el2);
            parent.removeChild(el3);

            const line = document.createElement("div");
            line.style.display = "flex";
            parent.appendChild(line);

            const left = document.createElement("div");
            left.style.flex = "1";
            left.append(el1);
            left.append(el2);
            left.append(el3);

            agvs.agv = document.createElement("div");
            agvs.agv.className = "vi-right";
            line.appendChild(left);
            line.appendChild(agvs.agv);
            agvs.agv0 = document.createElement("div");
            agvs.agv0.id = "agv0";
            agvs.agv0.innerHTML = '<div class="slot"></div>';
            agvs.agv.appendChild(agvs.agv0);
            setTimeout(() => {
                const els = el3.getElementsByClassName("el-row");
                els.forEach(el => {
                    el.querySelectorAll(".el-col-18").forEach(w => (w.style.maxWidth = "70%"));
                    el.querySelectorAll(".el-col-6").forEach(w => (w.style.maxWidth = "30%"));
                });
            }, 10);
        }, 100);
    };

    /**
     * 监听页面URL发生变化
     */
    const watchurl = function () {
        setTimeout(() => {
            const _href = location.href;
            if (_href == state.href) {
                watchurl();
                return;
            }
            state.href = _href;
            relayout();
            watchurl();
        }, 300);
    };
    watchurl();
    /**
     * 绘制8仓位，并定位到某个仓位
     * @param {Number} no 当前定位到哪个仓位
     * @param {*} tim 重试次数
     * @returns
     */
    const stock8 = function (no, tim = 1) {
        if (!agvs.agv) {
            if (tim > 20) return;
            setTimeout(() => {
                stock8(no, tim++);
            }, 200);
            return;
        };
        if (!agvs.agv8) {
            agvs.agv8 = document.createElement("div");
            agvs.agv8.id = "agv8";
            agvs.agv8.innerHTML = `
    <div class="slot_row">
        <div class="slot" id="agv_slot_7">7</div>
        <div class="slot" id="agv_slot_8" style="margin-left:12px">8</div>
    </div>
    <div class="slot_row" style="margin-top:12px">
        <div class="slot" id="agv_slot_5">5</div>
        <div class="slot" id="agv_slot_6" style="margin-left:12px">6</div>
    </div>
    <div class="slot_row" style="margin-top:12px">
        <div class="slot" id="agv_slot_3">3</div>
        <div class="slot" id="agv_slot_4" style="margin-left:12px">4</div>
    </div>
    <div class="slot_row" style="margin-top:12px">
        <div class="slot" id="agv_slot_1">1</div>
        <div class="slot" id="agv_slot_2" style="margin-left:12px">2</div>
    </div>`;
            agvs.agv.appendChild(agvs.agv8);
        }
        agvs.agv8.querySelectorAll(".slot").forEach(itm => (itm.className = "slot"));
        agvs.agv8.querySelector(`#agv_slot_${no}`).className = "slot highlight";
    };

    /**
     * 绘制2仓位，定位到某个仓位
     * @param {Number} no 当前定位到哪个仓位
     * @param {Number} tim 重试次数
     * @returns
     */
    const stock2 = function (no, tim = 0) {
        if (!agvs.agv) {
            if (tim > 20) return;
            setTimeout(() => { stock2(no, tim++); }, 200);
            return;
        };
        if (!agvs.agv1) {
            agvs.agv1 = document.createElement("div");
            agvs.agv1.id = "agv1";
            //agvs.agv1.innerHTML = '<div class="slot highlight">1</div>';
            agvs.agv1.innerHTML = `<div class="slot_row" style="margin-top:12px">
        <div class="slot" id="agv_slot_1">1</div>
        <div class="slot" id="agv_slot_2" style="margin-left:12px">2</div>
    </div>`;
            agvs.agv.appendChild(agvs.agv1);
        }
        agvs.agv1.querySelectorAll(".slot").forEach(itm => (itm.className = "slot"));
        agvs.agv1.querySelector(`#agv_slot_${no}`).className = "slot highlight";
    };

    const handler = function () {
        var el = document.querySelector("input.el-input__inner[name=LOWER_RIGHT_LPN]");
        if (!el) return;
        var val = el.value;
        if (val == state.LPN) return;
        state.LPN = val;

        if (!val) {
            agvs.agv0 && (agvs.agv0.style.display = "");
            agvs.agv1 && (agvs.agv1.style.display = "none");
            agvs.agv8 && (agvs.agv8.style.display = "none");
            return;
        }

        //读取到货架号
        var _func = Number(val.substring(3, 6)) > 70 ? stock8 : stock2;
        //读取到库位号
        var _no = val.split('-')[1];

        agvs.agv0 && (agvs.agv0.style.display = "none");
        agvs.agv1 && (agvs.agv1.style.display = _func == stock2 ? "" : "none");
        agvs.agv8 && (agvs.agv8.style.display = _func == stock2 ? "none" : "");
        _func(Number(_no), 1);

        console.error(val);
    };

    let heightDiv = null;

    let styleHandler = function () {
        setTimeout(function () {
            let _div = document.querySelector("div[data-com-id=uiForm_emknli]");
            if (_div && _div.childNodes && _div.childNodes[0]) {
                heightDiv = _div.childNodes[0];
                if (heightDiv) {
                    styleHandler = function () {
                        setTimeout(() => {
                            if (heightDiv.style.maxHeight != '') {
                                heightDiv.style.maxHeight = '';
                            }
                            styleHandler();
                        }, 1000);
                    }
                }
            }
            styleHandler();
        }, 200);
    }
    let styleHandler1 = function () {
        setTimeout(function () {
            let _div = document.querySelector("div[data-com-id=uiSplitpanes_mykl0g]");
            if (_div && _div.childNodes && _div.childNodes[0]) {
                heightDiv = _div.childNodes[0];
                if (heightDiv) {
                    styleHandler1 = function () {
                        setTimeout(() => {
                            if (heightDiv.style.height != '100vh') {
                                heightDiv.style.height = '100vh';
                            }
                            styleHandler1();
                        }, 1000);
                    }
                }
            }
            styleHandler1();
        }, 200);
    }
    const beginTimer = function () {
        setTimeout(function () {
            handler();
            beginTimer();
        }, 100);
    };

    beginTimer();
    styleHandler();
    styleHandler1();
})();