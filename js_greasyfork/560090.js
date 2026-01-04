// ==UserScript==
// @name        阳光助手正式版
// @namespace   Violentmonkey Scripts
// @match       http://10.176.0.84/*
// @grant       GM_addStyle
// @grant       GM_registerMenuCommand
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_addStyle
// @version     1.02更新复制，更新慢病健康教育处方20250702，20251114
// @author      万水千山总能旗开得胜
// @license MIT
// @description 2025/2/4 18:31:26
// @downloadURL https://update.greasyfork.org/scripts/560090/%E9%98%B3%E5%85%89%E5%8A%A9%E6%89%8B%E6%AD%A3%E5%BC%8F%E7%89%88.user.js
// @updateURL https://update.greasyfork.org/scripts/560090/%E9%98%B3%E5%85%89%E5%8A%A9%E6%89%8B%E6%AD%A3%E5%BC%8F%E7%89%88.meta.js
// ==/UserScript==
//设置共同操作流程
(function() {
    'use strict';
    GM_addStyle(`
        .new-class {
            color: red;
            font-size: 20px;
        }
    `);
})();
//设定共同操作保存操作jiankangjiaoyuchufang()，为健康教育处方点击使用
  function jiankangjiaoyuchufang() {

    const TARGET_TEXT2 = '健康教育处方';
    let clicked2 = false;

    const clickSaveSpan2 = () => {
        if (clicked2) return;

        // 主文档检测
        const spans2 = [...document.querySelectorAll('span')];
        const saveSpan2 = spans2.find(span2 =>
            span2.textContent.trim() === TARGET_TEXT2 &&
            getComputedStyle(span2).display !== 'none' &&
            span2.offsetParent !== null
        );

        if (saveSpan2) {
            saveSpan2.click();
            console.log('SPAN健康教育处方按钮已点击（仅一次）');
            clicked2 = true;
        }
    };

    // 初始检测
    clickSaveSpan2();

    // 短时间监听DOM变化（3秒后自动停止）
    const observer2 = new MutationObserver(clickSaveSpan2);
    observer2.observe(document.body, { subtree: true, childList: true });
    setTimeout(() => observer2.disconnect(), 3000);
};
//设定共同操作保存操作manxingbing()，为健康教育处方点击保存使用
  function manxingbing() {

    const TARGET_TEXT1 = "慢性病";
    let clicked1 = false;

    const clickSavediv = () => {
        if (clicked1) return;

        // 主文档检测
        const divs = [...document.querySelectorAll('div')];
        const savediv = divs.find(div =>
            div.textContent.trim() === TARGET_TEXT1 &&
            getComputedStyle(div).display !== 'none' &&
            div.offsetParent !== null
        );

        if (savediv) {
            savediv.click();
            console.log('SPAN保存按钮已点击（仅一次）');
            clicked1 = true;
        }
    };

    // 初始检测
    clickSavediv();

    // 短时间监听DOM变化（3秒后自动停止）
    const observer = new MutationObserver(clickSave);
    observer.observe(document.body, { subtree: true, childList: true });
    setTimeout(() => observer.disconnect(), 3000);
};
//设定共同操作保存操作dianjibaocun()，为慢病健康处方点击保存使用
  function dianjibaocun() {

    const TARGET_TEXT = '保存';
    let clicked = false;

    const clickSaveSpan = () => {
        if (clicked) return;

        // 主文档检测
        const spans = [...document.querySelectorAll('span')];
        const saveSpan = spans.find(span =>
            span.textContent.trim() === TARGET_TEXT &&
            getComputedStyle(span).display !== 'none' &&
            span.offsetParent !== null
        );

        if (saveSpan) {
            saveSpan.click();
            console.log('SPAN保存按钮已点击（仅一次）');
            clicked = true;
        }
    };

    // 初始检测
    clickSaveSpan();

    // 短时间监听DOM变化（3秒后自动停止）
    const observer = new MutationObserver(clickSaveSpan);
    observer.observe(document.body, { subtree: true, childList: true });
    setTimeout(() => observer.disconnect(), 3000);
};
//设定共同操作保存操作naoxueguanjiankang()，为脑血管病患者健康教育处方点击保存使用
  function naoxueguanjiankang() {

    const TARGET_TEXT1 = "脑血管病患者健康教育处方";
    let clicked1 = false;

    const clickSavediv = () => {
        if (clicked1) return;

        // 主文档检测
        const divs = [...document.querySelectorAll('div')];
        const savediv = divs.find(div =>
            div.textContent.trim() === TARGET_TEXT1 &&
            getComputedStyle(div).display !== 'none' &&
            div.offsetParent !== null
        );

        if (savediv) {
            savediv.click();
            console.log('SPAN保存按钮已点击（仅一次）');
            clicked1 = true;
        }
    };

    // 初始检测
    clickSavediv();

    // 短时间监听DOM变化（3秒后自动停止）
    const observer = new MutationObserver(clickSave);
    observer.observe(document.body, { subtree: true, childList: true });
    setTimeout(() => observer.disconnect(), 3000);
};

//设定共同操作保存操作zhiqiguanyan()，为慢病健康处方点击保存使用
  function zhiqiguanyan() {

    const TARGET_TEXT1 = "急性支气管炎患者健康教育处方";
    let clicked1 = false;

    const clickSavediv = () => {
        if (clicked1) return;

        // 主文档检测
        const divs = [...document.querySelectorAll('div')];
        const savediv = divs.find(div =>
            div.textContent.trim() === TARGET_TEXT1 &&
            getComputedStyle(div).display !== 'none' &&
            div.offsetParent !== null
        );

        if (savediv) {
            savediv.click();
            console.log('SPAN保存按钮已点击（仅一次）');
            clicked1 = true;
        }
    };

    // 初始检测
    clickSavediv();

    // 短时间监听DOM变化（3秒后自动停止）
    const observer = new MutationObserver(clickSave);
    observer.observe(document.body, { subtree: true, childList: true });
    setTimeout(() => observer.disconnect(), 3000);
};
//设定共同操作保存操作tangniaobingjiankang()，为慢病健康处方点击保存使用
  function tangniaobingjiankang() {

    const TARGET_TEXT1 = "2型糖尿病患者健康教育处方";
    let clicked1 = false;

    const clickSavediv = () => {
        if (clicked1) return;

        // 主文档检测
        const divs = [...document.querySelectorAll('div')];
        const savediv = divs.find(div =>
            div.textContent.trim() === TARGET_TEXT1 &&
            getComputedStyle(div).display !== 'none' &&
            div.offsetParent !== null
        );

        if (savediv) {
            savediv.click();
            console.log('SPAN保存按钮已点击（仅一次）');
            clicked1 = true;
        }
    };

    // 初始检测
    clickSavediv();

    // 短时间监听DOM变化（3秒后自动停止）
    const observer = new MutationObserver(clickSave);
    observer.observe(document.body, { subtree: true, childList: true });
    setTimeout(() => observer.disconnect(), 3000);
};
//设定共同操作保存操作guanxinbingjiankang()，为慢病健康处方点击保存使用
  function guanxinbingjiankang() {

    const TARGET_TEXT1 = "冠心病患者健康教育处方";
    let clicked1 = false;

    const clickSavediv = () => {
        if (clicked1) return;

        // 主文档检测
        const divs = [...document.querySelectorAll('div')];
        const savediv = divs.find(div =>
            div.textContent.trim() === TARGET_TEXT1 &&
            getComputedStyle(div).display !== 'none' &&
            div.offsetParent !== null
        );

        if (savediv) {
            savediv.click();
            console.log('SPAN保存按钮已点击（仅一次）');
            clicked1 = true;
        }
    };

    // 初始检测
    clickSavediv();

    // 短时间监听DOM变化（3秒后自动停止）
    const observer = new MutationObserver(clickSave);
    observer.observe(document.body, { subtree: true, childList: true });
    setTimeout(() => observer.disconnect(), 3000);
};
//设定共同操作保存操作gaoxueyajiankang()，为慢病健康处方点击保存使用
  function gaoxueyajiankang() {

    const TARGET_TEXT1 = "高血压患者健康教育处方";
    let clicked1 = false;

    const clickSavediv = () => {
        if (clicked1) return;

        // 主文档检测
        const divs = [...document.querySelectorAll('div')];
        const savediv = divs.find(div =>
            div.textContent.trim() === TARGET_TEXT1 &&
            getComputedStyle(div).display !== 'none' &&
            div.offsetParent !== null
        );

        if (savediv) {
            savediv.click();
            console.log('SPAN保存按钮已点击（仅一次）');
            clicked1 = true;
        }
    };

    // 初始检测
    clickSavediv();

    // 短时间监听DOM变化（3秒后自动停止）
    const observer = new MutationObserver(clickSave);
    observer.observe(document.body, { subtree: true, childList: true });
    setTimeout(() => observer.disconnect(), 3000);
};
//设定共同操作保存操作zhenliaofei()，为诊疗费医嘱点击使用
  function zhenliaofei() {

    const TARGET_TEXT2 = '1.诊疗费';
    let clicked2 = false;

    const clickSaveSpan2 = () => {
        if (clicked2) return;

        // 主文档检测
        const spans2 = [...document.querySelectorAll('span')];
        const saveSpan2 = spans2.find(span2 =>
            span2.textContent.trim() === TARGET_TEXT2 &&
            getComputedStyle(span2).display !== 'none' &&
            span2.offsetParent !== null
        );

        if (saveSpan2) {
            saveSpan2.click();
            console.log('SPAN保存按钮已点击（仅一次）');
            clicked2 = true;
        }
    };

    // 初始检测
    clickSaveSpan2();

    // 短时间监听DOM变化（3秒后自动停止）
    const observer2 = new MutationObserver(clickSaveSpan2);
    observer2.observe(document.body, { subtree: true, childList: true });
    setTimeout(() => observer2.disconnect(), 3000);
};
//设定共同操作保存操作zhenchafei()，为诊疗费医嘱点击使用
  function zhenchafei() {

    const TARGET_TEXT2 = '2.门诊诊查费';
    let clicked2 = false;

    const clickSaveSpan2 = () => {
        if (clicked2) return;

        // 主文档检测
        const spans2 = [...document.querySelectorAll('span')];
        const saveSpan2 = spans2.find(span2 =>
            span2.textContent.trim() === TARGET_TEXT2 &&
            getComputedStyle(span2).display !== 'none' &&
            span2.offsetParent !== null
        );

        if (saveSpan2) {
            saveSpan2.click();
            console.log('SPAN保存按钮已点击（仅一次）');
            clicked2 = true;
        }
    };

    // 初始检测
    clickSaveSpan2();

    // 短时间监听DOM变化（3秒后自动停止）
    const observer2 = new MutationObserver(clickSaveSpan2);
    observer2.observe(document.body, { subtree: true, childList: true });
    setTimeout(() => observer2.disconnect(), 3000);
};

//设定共同操作保存操作danshenpian()，为丹参片医嘱点击使用
  function danshenpian() {

    const TARGET_TEXT2 = '1.丹参片';
    let clicked2 = false;

    const clickSaveSpan2 = () => {
        if (clicked2) return;

        // 主文档检测
        const spans2 = [...document.querySelectorAll('span')];
        const saveSpan2 = spans2.find(span2 =>
            span2.textContent.trim() === TARGET_TEXT2 &&
            getComputedStyle(span2).display !== 'none' &&
            span2.offsetParent !== null
        );

        if (saveSpan2) {
            saveSpan2.click();
            console.log('SPAN保存按钮已点击（仅一次）');
            clicked2 = true;
        }
    };

    // 初始检测
    clickSaveSpan2();

    // 短时间监听DOM变化（3秒后自动停止）
    const observer2 = new MutationObserver(clickSaveSpan2);
    observer2.observe(document.body, { subtree: true, childList: true });
    setTimeout(() => observer2.disconnect(), 3000);
};
//设定共同操作保存操作mubanyinyong()，为丹参片医嘱点击使用
  function mubanyinyong() {

    const TARGET_TEXT2 = '模板引用';
    let clicked2 = false;

    const clickSaveSpan2 = () => {
        if (clicked2) return;

        // 主文档检测
        const spans2 = [...document.querySelectorAll('span')];
        const saveSpan2 = spans2.find(span2 =>
            span2.textContent.trim() === TARGET_TEXT2 &&
            getComputedStyle(span2).display !== 'none' &&
            span2.offsetParent !== null
        );

        if (saveSpan2) {
            saveSpan2.click();
            console.log('SPAN保存按钮已点击（仅一次）');
            clicked2 = true;
        }
    };

    // 初始检测
    clickSaveSpan2();

    // 短时间监听DOM变化（3秒后自动停止）
    const observer2 = new MutationObserver(clickSaveSpan2);
    observer2.observe(document.body, { subtree: true, childList: true });
    setTimeout(() => observer2.disconnect(), 3000);
};
//设定共同操作保存操作aomeilazuo()，为奥美拉唑医嘱点击使用
  function aomeilazuo() {

    const TARGET_TEXT2 = '9.奥美拉唑';
    let clicked2 = false;

    const clickSaveSpan2 = () => {
        if (clicked2) return;

        // 主文档检测
        const spans2 = [...document.querySelectorAll('span')];
        const saveSpan2 = spans2.find(span2 =>
            span2.textContent.trim() === TARGET_TEXT2 &&
            getComputedStyle(span2).display !== 'none' &&
            span2.offsetParent !== null
        );

        if (saveSpan2) {
            saveSpan2.click();
            console.log('SPAN保存按钮已点击（仅一次）');
            clicked2 = true;
        }
    };

    // 初始检测
    clickSaveSpan2();

    // 短时间监听DOM变化（3秒后自动停止）
    const observer2 = new MutationObserver(clickSaveSpan2);
    observer2.observe(document.body, { subtree: true, childList: true });
    setTimeout(() => observer2.disconnect(), 3000);
};
//设定共同操作保存操作anlvdiping()，为奥美拉唑医嘱点击使用
  function anlvdiping() {

    const TARGET_TEXT2 = '10.氨氯地平';
    let clicked2 = false;

    const clickSaveSpan2 = () => {
        if (clicked2) return;

        // 主文档检测
        const spans2 = [...document.querySelectorAll('span')];
        const saveSpan2 = spans2.find(span2 =>
            span2.textContent.trim() === TARGET_TEXT2 &&
            getComputedStyle(span2).display !== 'none' &&
            span2.offsetParent !== null
        );

        if (saveSpan2) {
            saveSpan2.click();
            console.log('SPAN保存按钮已点击（仅一次）');
            clicked2 = true;
        }
    };

    // 初始检测
    clickSaveSpan2();

    // 短时间监听DOM变化（3秒后自动停止）
    const observer2 = new MutationObserver(clickSaveSpan2);
    observer2.observe(document.body, { subtree: true, childList: true });
    setTimeout(() => observer2.disconnect(), 3000);
};
//设定共同操作保存操作huposuanmei()，为琥珀酸美托洛尔医嘱点击使用
  function huposuanmei() {

    const TARGET_TEXT2 = '11.琥珀酸美';
    let clicked2 = false;

    const clickSaveSpan2 = () => {
        if (clicked2) return;

        // 主文档检测
        const spans2 = [...document.querySelectorAll('span')];
        const saveSpan2 = spans2.find(span2 =>
            span2.textContent.trim() === TARGET_TEXT2 &&
            getComputedStyle(span2).display !== 'none' &&
            span2.offsetParent !== null
        );

        if (saveSpan2) {
            saveSpan2.click();
            console.log('SPAN保存按钮已点击（仅一次）');
            clicked2 = true;
        }
    };

    // 初始检测
    clickSaveSpan2();

    // 短时间监听DOM变化（3秒后自动停止）
    const observer2 = new MutationObserver(clickSaveSpan2);
    observer2.observe(document.body, { subtree: true, childList: true });
    setTimeout(() => observer2.disconnect(), 3000);
};
//设定共同操作保存操作xiaokong()，为硝苯地平控释片医嘱点击使用
  function xiaokong() {

    const TARGET_TEXT2 = '12.硝控';
    let clicked2 = false;

    const clickSaveSpan2 = () => {
        if (clicked2) return;

        // 主文档检测
        const spans2 = [...document.querySelectorAll('span')];
        const saveSpan2 = spans2.find(span2 =>
            span2.textContent.trim() === TARGET_TEXT2 &&
            getComputedStyle(span2).display !== 'none' &&
            span2.offsetParent !== null
        );

        if (saveSpan2) {
            saveSpan2.click();
            console.log('SPAN保存按钮已点击（仅一次）');
            clicked2 = true;
        }
    };

    // 初始检测
    clickSaveSpan2();

    // 短时间监听DOM变化（3秒后自动停止）
    const observer2 = new MutationObserver(clickSaveSpan2);
    observer2.observe(document.body, { subtree: true, childList: true });
    setTimeout(() => observer2.disconnect(), 3000);
};
//设定共同操作保存操作akabotang()，为阿卡波糖片医嘱点击使用
  function akabotang() {

    const TARGET_TEXT2 = '13.阿卡波糖';
    let clicked2 = false;

    const clickSaveSpan2 = () => {
        if (clicked2) return;

        // 主文档检测
        const spans2 = [...document.querySelectorAll('span')];
        const saveSpan2 = spans2.find(span2 =>
            span2.textContent.trim() === TARGET_TEXT2 &&
            getComputedStyle(span2).display !== 'none' &&
            span2.offsetParent !== null
        );

        if (saveSpan2) {
            saveSpan2.click();
            console.log('SPAN保存按钮已点击（仅一次）');
            clicked2 = true;
        }
    };

    // 初始检测
    clickSaveSpan2();

    // 短时间监听DOM变化（3秒后自动停止）
    const observer2 = new MutationObserver(clickSaveSpan2);
    observer2.observe(document.body, { subtree: true, childList: true });
    setTimeout(() => observer2.disconnect(), 3000);
};
//设定共同操作保存操作xxian()，为x线医嘱点击使用
  function xxian() {

    const TARGET_TEXT2 = '21.X线';
    let clicked2 = false;

    const clickSaveSpan2 = () => {
        if (clicked2) return;

        // 主文档检测
        const spans2 = [...document.querySelectorAll('span')];
        const saveSpan2 = spans2.find(span2 =>
            span2.textContent.trim() === TARGET_TEXT2 &&
            getComputedStyle(span2).display !== 'none' &&
            span2.offsetParent !== null
        );

        if (saveSpan2) {
            saveSpan2.click();
            console.log('SPAN保存按钮已点击（仅一次）');
            clicked2 = true;
        }
    };

    // 初始检测
    clickSaveSpan2();

    // 短时间监听DOM变化（3秒后自动停止）
    const observer2 = new MutationObserver(clickSaveSpan2);
    observer2.observe(document.body, { subtree: true, childList: true });
    setTimeout(() => observer2.disconnect(), 3000);
};
/*
 (function() {
    'use strict';
    const TARGET_TEXT = '保存';
    let clicked = false;

    const clickSaveSpan = () => {
        if (clicked) return;

        // 主文档检测
        const spans = [...document.querySelectorAll('span')];
        const saveSpan = spans.find(span =>
            span.textContent.trim() === TARGET_TEXT &&
            getComputedStyle(span).display !== 'none' &&
            span.offsetParent !== null
        );

        if (saveSpan) {
            saveSpan.click();
            console.log('SPAN保存按钮已点击（仅一次）');
            clicked = true;
        }
    };

    // 初始检测
    clickSaveSpan();

    // 短时间监听DOM变化（3秒后自动停止）
    const observer = new MutationObserver(clickSaveSpan);
    observer.observe(document.body, { subtree: true, childList: true });
    setTimeout(() => observer.disconnect(), 3000);
})();*/
//以上为设定共同操作保存操作dianjibaocun()，为慢病健康处方点击保存使用

(function() {
    'use strict';

    // 创建一个style元素
    var style = document.createElement('style');
    // 添加CSS规则
    style.innerHTML = `
        .new-class {
            color: red;
            font-size: 20px;
        }
    `;
    // 将style元素添加到文档的head中
    document.head.appendChild(style);
})();




function performActions() {
        let buttonx = document.querySelector("#xmg-container")
      if (buttonx) {
      // 如果弹窗存在则移除
      document.querySelectorAll('#xmg-container').forEach(element => {
    element.remove();
});//删除;
    } else {



  //点击一下读身份证,
 (function() {
    'use strict';
    let triple7=document.createElement("button");
    triple7.innerText="读卡F1";
    triple7.style.background="#ebb563";//颜色弄得差不多吧
    triple7.style.color="black";
    triple7.id = "xmg-container"
    triple7.style.width="55px"
    triple7.style.height="30px"
    triple7.style.borderRadius = '3px'
    triple7.style.border = '0.1px solid white';// 边框大小为1像素，实线，白色
    //triple7.style.borderColor='transparent'//透明颜色边框
    triple7.onclick=function(){
    //三连代码，使用appendChild函数于div后也不再刷新，appendChild()方法将节点(元素)作为最后一个子元素添加到元素。
        document.querySelector("#main > div > div.single-page-con > div > div > div > form > div > div:nth-child(1) > div:nth-child(1) > label > div > label:nth-child(1) > span").click();//点击切换“身份证”按钮
        document.querySelector("#main > div > div.single-page-con > div > div > div > form > div > div:nth-child(1) > div:nth-child(3) > label > button").click();//点击“读身份证”按钮

        //setTimeout(function () {
            //document.querySelector("#main > div > div.single-page-con > div > div > div > form > div > div:nth-child(1) > div:nth-child(2) > label > div > button").click();//点击“读身份证”按钮
            //document.querySelector("#main > div > div.single-page-con > div > div > div > form > div > div:nth-child(1) > div:nth-child(1) > label > div > label:nth-child(2) > span").click();//点击切换“扫码”按钮
        //}, 100 )
    }
    //let share7=document.querySelector("#main > div > div.single-page-con > div > div > div > form > div");//这个代码，出现后放在了身份证按钮上面一行，不好用，影响多
    let share7=document.querySelector("#pane-DOC_ORD > div:nth-child(2) > div > div > div");
    share7.parentElement.before(triple7);
})();
  //点击一下扫码,
 (function() {
    'use strict';
    let triple7=document.createElement("button");
    triple7.innerText="扫码";
    triple7.style.background="rgb(64, 158, 255)";//颜色弄得差不多吧
    triple7.style.color="white";
    triple7.id = "xmg-container"
    triple7.style.width="55px"
    triple7.style.height="30px"
    triple7.style.borderRadius = '3px'
    triple7.style.border = '0.1px solid white';// 边框大小为1像素，实线，白色
    //triple7.style.borderColor='transparent'//透明颜色边框
    triple7.onclick=function(){
    //三连代码，使用appendChild函数于div后也不再刷新，appendChild()方法将节点(元素)作为最后一个子元素添加到元素。
        document.querySelector("#main > div > div.single-page-con > div > div > div > form > div > div:nth-child(1) > div:nth-child(1) > label > div > label:nth-child(1) > span").click();
        setTimeout(function () {
            document.querySelector("#main > div > div.single-page-con > div > div > div > form > div > div:nth-child(1) > div:nth-child(1) > label > div > label:nth-child(2) > span").click();
        }, 100 )
    }
    //let share7=document.querySelector("#main > div > div.single-page-con > div > div > div > form > div");//这个代码，出现后放在了身份证按钮上面一行，不好用，影响多
    let share7=document.querySelector("#pane-DOC_ORD > div:nth-child(2) > div > div > div");
    share7.parentElement.before(triple7);
})();
  //普通门诊
    (function() {
    'use strict';
    let triple5=document.createElement("button");
    triple5.innerText="普通门诊";
    triple5.style.background="pink";//颜色弄得差不多吧
    triple5.style.color="black";
    triple5.id = "xmg-container"
    triple5.style.width="70px"
    triple5.style.height="30px"
    triple5.style.borderRadius = '3px'
    triple5.style.border = '0.1px solid white';// 边框大小为1像素，实线，白色
    //triple5.style.borderColor='transparent'//透明颜色边框
    triple5.onclick=function(){
    //三连代码，使用appendChild函数于div后也不再刷新，appendChild()方法将节点(元素)作为最后一个子元素添加到元素。
        document.querySelector("#main > div > div.single-page-con > div > div > div > div:nth-child(2) > div:nth-child(1) > form > div > div > div.sun-select > div > div.el-select-dropdown.el-popper > div.el-scrollbar > div.el-select-dropdown__wrap.el-scrollbar__wrap > ul > li:nth-child(3) > span").click()
    }
    //let share5=document.querySelector("#main > div > div.single-page-con > div > div > div > div:nth-child(2) > div:nth-child(1)");//button所属于div
    let share5=document.querySelector("#pane-DOC_ORD > div:nth-child(2) > div > div > div");//button所属于div
    share5.parentElement.before(triple5);

})();
//慢病门诊
    (function() {
    'use strict';
    let triple6=document.createElement("button");
    triple6.innerText="慢病门诊";
    triple6.style.background="blue";//颜色弄得差不多吧
    triple6.style.color="#fff";
    triple6.id = "xmg-container"
    triple6.style.width="70px"
    triple6.style.height="30px"
    triple6.style.borderRadius = '3px'
    triple6.style.border = '0.1px solid white';// 边框大小为1像素，实线，白色
    //triple6.style.borderColor='transparent'//透明颜色边框
        triple6.addEventListener('click',(c)=>{
        c.preventDefault()//加了之后不刷新了，哈哈哈

        console.log('点击了',c.target.innerText)
        document.querySelector("#main > div > div.single-page-con > div > div > div > div:nth-child(2) > div:nth-child(1) > form > div > div > div.sun-select > div > div.el-select-dropdown.el-popper > div.el-scrollbar > div.el-select-dropdown__wrap.el-scrollbar__wrap > ul > li:nth-child(1)").click();
        });

    let share6=document.querySelector("#pane-DOC_ORD > div:nth-child(2) > div > div > div");//button所属于div
    share6.parentElement.before(triple6);

})();
    //慢病健康处方-冠心病
   (function() {
    'use strict';
    let triple5=document.createElement("button");
    triple5.innerText="冠心病";
    triple5.style.background="red";//颜色弄得差不多吧
    triple5.style.color="white";
    triple5.id = "xmg-container"
    triple5.style.width="70px"
    triple5.style.height="30px"
    triple5.style.borderRadius = '3px'
    triple5.style.border = '0.1px solid white';// 边框大小为1像素，实线，白色
    //triple5.style.borderColor='transparent'//透明颜色边框
    triple5.onclick=function(){
    //三连代码，使用appendChild函数于div后也不再刷新，appendChild()方法将节点(元素)作为最后一个子元素添加到元素。
      //点击健康处方标签
          jiankangjiaoyuchufang()
      //点击慢性病标签
      setTimeout(function () {
            manxingbing()
        }, 600 )
      //点击冠心病标签
      setTimeout(function () {
      guanxinbingjiankang()
        }, 1200 )
    //点击保存标签
      setTimeout(function () {
        dianjibaocun()
        //document.querySelector("body > div:nth-child(31) > div.ivu-modal-wrap.undefined.sun-responsive-modal > div > div > div.ivu-modal-footer > div > button.el-button.el-tooltip.el-button--primary.el-button--small.sun-button.sun-button-small").click()
        }, 1500 )

    }
    //let share5=document.querySelector("#main > div > div.single-page-con > div > div > div > div:nth-child(2) > div:nth-child(1)");//button所属于div
    let share5=document.querySelector("#pane-DOC_ORD > div:nth-child(2) > div > div > div");//button所属于div
    share5.parentElement.before(triple5);
})();
    //慢病健康处方-脑血管
   (function() {
    'use strict';
    let triple5=document.createElement("button");
    triple5.innerText="脑血管";
    triple5.style.background="rgb(64, 158, 255)";//颜色弄得差不多吧
    triple5.style.color="white";
    triple5.id = "xmg-container"
    triple5.style.width="70px"
    triple5.style.height="30px"
    triple5.style.borderRadius = '3px'
    triple5.style.border = '0.1px solid white';// 边框大小为1像素，实线，白色
    //triple5.style.borderColor='transparent'//透明颜色边框
    triple5.onclick=function(){
    //三连代码，使用appendChild函数于div后也不再刷新，appendChild()方法将节点(元素)作为最后一个子元素添加到元素。
      //点击健康处方标签
          jiankangjiaoyuchufang()
      //点击慢性病标签
      setTimeout(function () {
            manxingbing()
        }, 600 )
      //点击冠心病标签
      setTimeout(function () {
        naoxueguanjiankang()
        }, 1200 )
    //点击保存标签
      setTimeout(function () {
        dianjibaocun()
        //document.querySelector("body > div:nth-child(31) > div.ivu-modal-wrap.undefined.sun-responsive-modal > div > div > div.ivu-modal-footer > div > button.el-button.el-tooltip.el-button--primary.el-button--small.sun-button.sun-button-small").click()
        }, 1500 )

    }
    //let share5=document.querySelector("#main > div > div.single-page-con > div > div > div > div:nth-child(2) > div:nth-child(1)");//button所属于div
    let share5=document.querySelector("#pane-DOC_ORD > div:nth-child(2) > div > div > div");//button所属于div
    share5.parentElement.before(triple5);
})();
      //慢病健康处方-高血压
   (function() {
    'use strict';
    let triple5=document.createElement("button");
    triple5.innerText="高血压";
    triple5.style.background="#ebb563";//颜色弄得差不多吧
    triple5.style.color="white";
    triple5.id = "xmg-container"
    triple5.style.width="70px"
    triple5.style.height="30px"
    triple5.style.borderRadius = '3px'
    triple5.style.border = '0.1px solid white';// 边框大小为1像素，实线，白色
    //triple5.style.borderColor='transparent'//透明颜色边框
    triple5.onclick=function(){
    //三连代码，使用appendChild函数于div后也不再刷新，appendChild()方法将节点(元素)作为最后一个子元素添加到元素。
      //点击健康处方标签
          jiankangjiaoyuchufang()
      //点击慢性病标签
      setTimeout(function () {
            manxingbing()
        }, 600 )
      //点击高血压标签
      setTimeout(function () {
      gaoxueyajiankang()
        }, 1200 )
    //点击保存标签
      setTimeout(function () {
        dianjibaocun()
        //document.querySelector("body > div:nth-child(31) > div.ivu-modal-wrap.undefined.sun-responsive-modal > div > div > div.ivu-modal-footer > div > button.el-button.el-tooltip.el-button--primary.el-button--small.sun-button.sun-button-small").click()
        }, 1500 )

    }
    //let share5=document.querySelector("#main > div > div.single-page-con > div > div > div > div:nth-child(2) > div:nth-child(1)");//button所属于div
    let share5=document.querySelector("#pane-DOC_ORD > div:nth-child(2) > div > div > div");//button所属于div
    share5.parentElement.before(triple5);
})();
//慢病健康处方-糖尿病
   (function() {
    'use strict';
    let triple5=document.createElement("button");
    triple5.innerText="糖尿病";
    triple5.style.background="rgb(64, 158, 255)";//颜色弄得差不多吧
    triple5.style.color="white";
    triple5.id = "xmg-container"
    triple5.style.width="70px"
    triple5.style.height="30px"
    triple5.style.borderRadius = '3px'
    triple5.style.border = '0.1px solid white';// 边框大小为1像素，实线，白色
    //triple5.style.borderColor='transparent'//透明颜色边框
    triple5.onclick=function(){
    //三连代码，使用appendChild函数于div后也不再刷新，appendChild()方法将节点(元素)作为最后一个子元素添加到元素。
      //点击健康处方标签
          jiankangjiaoyuchufang()
      //点击慢性病标签
      setTimeout(function () {
            manxingbing()
        }, 600 )
      //点击糖尿病标签
      setTimeout(function () {
      tangniaobingjiankang()
      }, 1200 )
    //点击保存标签
      setTimeout(function () {
        //document.querySelector("body > div:nth-child(31) > div.ivu-modal-wrap.undefined.sun-responsive-modal > div > div > div.ivu-modal-footer > div > button.el-button.el-tooltip.el-button--primary.el-button--small.sun-button.sun-button-small").click()
        dianjibaocun()
        }, 1500 )

    }
    //let share5=document.querySelector("#main > div > div.single-page-con > div > div > div > div:nth-child(2) > div:nth-child(1)");//button所属于div
    let share5=document.querySelector("#pane-DOC_ORD > div:nth-child(2) > div > div > div");//button所属于div
    share5.parentElement.before(triple5);
})();


  //慢病健康处方-支气管炎
   (function() {
    'use strict';
    let triple5=document.createElement("button");
    triple5.innerText="支气管炎";
    triple5.style.background="white";//颜色弄得差不多吧
    triple5.style.color="black";
    triple5.id = "xmg-container"
    triple5.style.width="70px"
    triple5.style.height="30px"
    triple5.style.borderRadius = '3px'
    triple5.style.border = '0.1px solid black';// 边框大小为1像素，实线，黑色
    //triple5.style.borderColor='transparent'//透明颜色边框
    triple5.onclick=function(){
    //三连代码，使用appendChild函数于div后也不再刷新，appendChild()方法将节点(元素)作为最后一个子元素添加到元素。
      //点击健康处方标签
          jiankangjiaoyuchufang()
      //点击慢性病标签
      setTimeout(function () {
            manxingbing()
        }, 600 )
      //点击支气管标签
      setTimeout(function () {
        zhiqiguanyan()
        //document.querySelector("#rowContextmenuClass > div > div.el-table__body-wrapper.is-scrolling-none > table > tbody > tr:nth-child(15) > td.el-table_22_column_171.is-center.el-table__cell > div").click()
        }, 1200 )
    //点击保存标签
      setTimeout(function () {
          dianjibaocun()
        //document.querySelector("body > div:nth-child(31) > div.ivu-modal-wrap.undefined.sun-responsive-modal > div > div > div.ivu-modal-footer > div > button.el-button.el-tooltip.el-button--primary.el-button--small.sun-button.sun-button-small").click()
        }, 1500 )

    }
    //let share5=document.querySelector("#main > div > div.single-page-con > div > div > div > div:nth-child(2) > div:nth-child(1)");//button所属于div
    let share5=document.querySelector("#pane-DOC_ORD > div:nth-child(2) > div > div > div");//button所属于div
    share5.parentElement.before(triple5);
})();






  //合为一组
    (function() {
    'use strict';
    let triple5=document.createElement("button");
    triple5.innerText="合为一组F7";
    triple5.style.background="white";//颜色弄得差不多吧
    triple5.style.color="black";
    triple5.style.fontSize="10px"//字体大小
    triple5.id = "xmg-container"
    triple5.style.width="70px"
    triple5.style.height="30px"
    triple5.style.borderRadius = '3px'
    triple5.style.border = '0.1px solid black';// 边框大小为1像素，实线，黑色
    triple5.onclick=function(){
    document.querySelector("body > ul > li:nth-child(13)").click()//点击鼠标右击后的合为一组
          }
    let share5=document.querySelector("#pane-DOC_ORD > div:nth-child(2) > div > div > div");//button所属于div
    share5.parentElement.appendChild(triple5);

})();
     //选中取消
    (function() {
    'use strict';
    let triple7=document.createElement("button");
    triple7.innerText="选中取消";
    triple7.style.background="blue";//颜色弄得差不多吧
    triple7.style.color="white";
    triple7.id = "xmg-container"
    triple7.style.width="70px"
    triple7.style.height="30px"
    triple7.style.borderRadius = '3px'
    triple7.style.border = '0.1px solid white';// 边框大小为1像素，实线，白色
    //triple7.style.borderColor='transparent'//透明颜色边框
    triple7.onclick=function(){
    //三连代码，使用appendChild函数于div后也不再刷新，appendChild()方法将节点(元素)作为最后一个子元素添加到元素。
        document.querySelector("body > ul > li:nth-child(6)").click();
        setTimeout(function () {
            document.querySelector("body > div.el-message-box__wrapper > div > div.el-message-box__btns > button.el-button.el-button--default.el-button--small.el-button--primary > span").click();
        }, 100 )
    }
    let share7=document.querySelector("#pane-DOC_ORD > div:nth-child(2) > div > div > div");//button所属于div
    share7.parentElement.appendChild(triple7);


})();
    //选中删除
 (function() {
    'use strict';
    let triple7=document.createElement("button");
    triple7.innerText="删除";
    triple7.style.background="red";//颜色弄得差不多吧
    triple7.style.color="yellow";
    triple7.id = "xmg-container"
    triple7.style.width="70px"
    triple7.style.height="30px"
    triple7.style.borderRadius = '3px'
    triple7.style.border = '0.1px solid white';// 边框大小为1像素，实线，白色
    //triple7.style.borderColor='transparent'//透明颜色边框
    triple7.onclick=function(){
    //三连代码，使用appendChild函数于div后也不再刷新，appendChild()方法将节点(元素)作为最后一个子元素添加到元素。
        document.querySelector("body > ul > li:nth-child(11)").click();
        setTimeout(function () {
            document.querySelector("body > div.el-message-box__wrapper > div > div.el-message-box__btns > button.el-button.el-button--default.el-button--small.el-button--primary > span").click();
        }, 100 )
    }
    let share7=document.querySelector("#pane-DOC_ORD > div:nth-child(2) > div > div > div");//button所属于div
    share7.parentElement.appendChild(triple7);


})();

    //全选复制
(function() {
    'use strict';
    let triple6=document.createElement("button");
    triple6.innerText="全选复制";
    triple6.style.background="#ebb563";//颜色弄得差不多吧
    triple6.style.color="white";
    triple6.id = "xmg-container"
    triple6.style.width="70px"
    triple6.style.height="30px"
    triple6.style.borderRadius = '3px'
    triple6.style.border = '0.1px solid white';// 边框大小为1像素，实线，白色
    //triple6.style.borderColor='transparent'//透明颜色边框
        triple6.addEventListener('click',(c)=>{
        c.preventDefault()//加了之后不刷新了，哈哈哈

        console.log('点击了',c.target.innerText)
        //document.querySelector("#medicalAdviceEntryTableById > div.el-table.el-table--fit.el-table--border.el-table--fluid-height.el-table--scrollable-x.el-table--enable-row-transition.el-table--default > div.el-table__header-wrapper > table > thead > tr > th.el-table_7_column_32.is-center.el-table-column--selection.is-leaf.el-table__cell > div > label > span > span").click()
        document.querySelector("#medicalAdviceEntryTableById > div.el-table.el-table--fit.el-table--border.el-table--scrollable-x.el-table--enable-row-transition.el-table--default > div.el-table__header-wrapper > table > thead > tr > th.el-table_7_column_32.is-center.el-table-column--selection.is-leaf.el-table__cell > div > label > span > span").click()
        setTimeout(function () {
            document.querySelector("#medicalAdviceEntryTableById > div.button-tools-group > div > div > span > button.el-button.el-tooltip.toolButton.el-button--success.el-button--mini.sun-button.sun-button-mini > span").click();
        }, 200 )
        });

    let share6=document.querySelector("#pane-DOC_ORD > div:nth-child(2) > div > div > div");//button所属于div
    share6.parentElement.appendChild(triple6);

})();
    //慢病门诊签名
    (function() {
    'use strict';
    let triple6=document.createElement("button");
    triple6.innerText="慢门签名";
    triple6.style.background="rgb(64, 158, 255)";//颜色弄得差不多吧
    triple6.style.color="#fff";
    triple6.id = "xmg-container"
    triple6.style.width="70px"
    triple6.style.height="30px"
    triple6.style.borderRadius = '3px'
    triple6.style.border = '0.1px solid white';// 边框大小为1像素，实线，白色
    //triple6.style.borderColor='transparent'//透明颜色边框
        triple6.addEventListener('click',(c)=>{
        c.preventDefault()//加了之后不刷新了，哈哈哈

        console.log('点击了',c.target.innerText)
        document.querySelector("#main > div > div.single-page-con > div > div > div > div:nth-child(2) > div:nth-child(1) > form > div > div > div.sun-select > div > div.el-select-dropdown.el-popper > div.el-scrollbar > div.el-select-dropdown__wrap.el-scrollbar__wrap > ul > li:nth-child(1)").click();
        document.querySelector("#medicalAdviceEntryTableById > div.button-tools-group > div > div > span > button:nth-child(3)").click();//点击全部签名
        });

    let share6=document.querySelector("#pane-DOC_ORD > div:nth-child(2) > div > div > div");//button所属于div
    share6.parentElement.appendChild(triple6);

})();
    //普通门诊签名
    (function() {
    'use strict';
    let triple5=document.createElement("button");
    triple5.innerText="普门签名";
    triple5.style.background="rgb(64, 158, 255)";//颜色弄得差不多吧
    triple5.style.color="white";
    triple5.id = "xmg-container"
    triple5.style.width="70px"
    triple5.style.height="30px"
    triple5.style.borderRadius = '3px'
    triple5.style.border = '0.1px solid white';// 边框大小为1像素，实线，白色
    //triple5.style.borderColor='transparent'//透明颜色边框
    triple5.onclick=function(){
    //三连代码，使用appendChild函数于div后也不再刷新，appendChild()方法将节点(元素)作为最后一个子元素添加到元素。
        document.querySelector("#main > div > div.single-page-con > div > div > div > div:nth-child(2) > div:nth-child(1) > form > div > div > div.sun-select > div > div.el-select-dropdown.el-popper > div.el-scrollbar > div.el-select-dropdown__wrap.el-scrollbar__wrap > ul > li:nth-child(3) > span").click()
        document.querySelector("#medicalAdviceEntryTableById > div.button-tools-group > div > div > span > button:nth-child(3)").click();//点击全部签名
    }
    //let share5=document.querySelector("#main > div > div.single-page-con > div > div > div > div:nth-child(2) > div:nth-child(1)");//button所属于div
    let share5=document.querySelector("#pane-DOC_ORD > div:nth-child(2) > div > div > div");//button所属于div
    share5.parentElement.appendChild(triple5);

})();
        //自动其他
    (function() {
    'use strict';
    let triple5=document.createElement("button");
    triple5.innerText="其他";
    triple5.style.background="white";//颜色弄得差不多吧
    triple5.style.color="black";
    triple5.id = "xmg-container"
    triple5.style.width="70px"
    triple5.style.borderRadius = '3px'
    triple5.style.border = '0.1px solid black';// 边框大小为1像素，实线，黑色
    triple5.style.height="30px"
    triple5.onclick=function(){
    //三连代码，使用appendChild函数于div后也不再刷新，appendChild()方法将节点(元素)作为最后一个子元素添加到元素。
        var input = document.querySelector("#main > div > div.single-page-con > div > div > div > div:nth-child(2) > div:nth-child(5) > label > div > div.el-select__tags > input");
// 先手动触发input事件
        input.dispatchEvent(new Event('input', { bubbles: true }));//dispatchEvent(new Event('focus'))
// 再手动触发change事件
        input.dispatchEvent(new Event('change', { bubbles: true }));
// 然后再设置value
        input.value = 'qt';
        input.dispatchEvent(new Event('input'))
        input.dispatchEvent(new Event('blur'))
        setTimeout(function () {
            input.click()
        }, 300 )
        setTimeout(function () {
            document.querySelector("body > div.el-select-dropdown.el-popper.is-multiple > div.el-scrollbar > div.el-select-dropdown__wrap.el-scrollbar__wrap > ul > li:nth-child(19) > span:nth-child(1)").click();
        }, 600 )
        input.addEventListener.value('qt', function() {
            input.click();
});
    }
    //let share5=document.querySelector("#main > div > div.single-page-con > div > div > div > div:nth-child(2) > div:nth-child(1)");//button所属于div
    let share5=document.querySelector("#pane-DOC_ORD > div:nth-child(2) > div > div > div");//button所属于div
    share5.parentElement.appendChild(triple5);
})();
    //自动诊疗费，暂停使用
    /*
    (function() {
    'use strict';
    let triple5=document.createElement("button");
    triple5.innerText="诊疗费";
    triple5.style.background="white";//颜色弄得差不多吧
    triple5.style.color="black";
    triple5.id = "xmg-container"
    triple5.style.width="70px"
    triple5.style.height="30px"
    triple5.style.borderRadius = '3px'
    triple5.style.border = '0.1px solid black';// 边框大小为1像素，实线，黑色
    triple5.onclick=function(){
    document.querySelector("#pane-DOC_ORD > div:nth-child(1) > div > form > div > div:nth-child(1) > div > div > div > label:nth-child(3) > span").click()//单击医疗标签
    var input = document.querySelector("#pane-DOC_ORD > div:nth-child(1) > div > form > div > div:nth-child(6) > div > div > div.sun-select-table > div > div > input");//输入框
        input.click()
        input.dispatchEvent(new Event('input', { bubbles: true }));//dispatchEvent(new Event('focus'))
        input.dispatchEvent(new Event('change', { bubbles: true }));
        setTimeout(function () {
            input.value = 'ybzlf'
            input.dispatchEvent(new Event('input', { bubbles: true }))
        }, 300 )
        setTimeout(function () {
            document.querySelector("body > div.el-select-dropdown.el-popper.sun-width_762.undefined > div.el-scrollbar > div.el-select-dropdown__wrap.el-scrollbar__wrap > ul > li:nth-child(4) > div:nth-child(3) > span").click()//点击一般诊疗费
            document.querySelector("#pane-DOC_ORD > div:nth-child(1) > div > form > div > div:nth-child(22) > div > div > div > button.el-button.el-button--primary.el-button--mini.sun-button.sun-button-mini").click();//点击+号添加医嘱
        }, 2000 )
    let share5=document.querySelector("#pane-DOC_ORD > div:nth-child(2) > div > div > div");//button所属于div
    share5.parentElement.appendChild(triple5);

})();
*/
      //诊疗费2
    (function() {
    'use strict';
    let triple5=document.createElement("button");
    triple5.innerText="诊疗费";
    triple5.style.background="rgb(64, 158, 255)";//颜色弄得差不多吧
    triple5.style.color="white";
    triple5.id = "xmg-container"
    triple5.style.width="70px"
    triple5.style.height="30px"
    triple5.style.borderRadius = '3px'
    triple5.style.border = '0.1px solid white';// 边框大小为1像素，实线，白色
    //triple5.style.borderColor='transparent'//透明颜色边框
    triple5.onclick=function(){
    //三连代码，使用appendChild函数于div后也不再刷新，appendChild()方法将节点(元素)作为最后一个子元素添加到元素。
        document.querySelector("#pane-DOC_ORD > div:nth-child(2) > div > div > div > button:nth-child(4) > span").click()
        document.querySelector("#tab-1285303").click();//点击个人
      setTimeout(function () {
            zhenliaofei()
            zhenliaofei()
        //点击抽血耗材
        }, 300 )
      //setTimeout(function () {
          //  document.querySelector("body > div.quote-template-modal.v-transfer-dom > div.ivu-modal-wrap.undefined.sun-responsive-modal > div > div > div.ivu-modal-body > div > div > div.leftTreeClass > div.el-scrollbar > div.el-scrollbar__wrap > div > div > div:nth-child(1) > div.el-tree-node__children > div:nth-child(1) > div.el-tree-node__content").click()//点击抽血耗材
        //}, 400 )

    }
    //let share5=document.querySelector("#main > div > div.single-page-con > div > div > div > div:nth-child(2) > div:nth-child(1)");//button所属于div
    let share5=document.querySelector("#pane-DOC_ORD > div:nth-child(2) > div > div > div");//button所属于div
    share5.parentElement.appendChild(triple5);

      // 创建提示元素
const createTooltip = () => {
    const tooltip = document.createElement('div');
    tooltip.textContent = '开药用';
    tooltip.style.position = 'absolute';
    tooltip.style.padding = '6px 12px';
    tooltip.style.background = 'rgba(0,0,0,0.8)';
    tooltip.style.color = '#fff';
    tooltip.style.borderRadius = '4px';
    tooltip.style.fontSize = '14px';
    tooltip.style.fontFamily = '"PingFang SC","Microsoft YaHei",sans-serif';
    tooltip.style.zIndex = '9999';
    tooltip.style.pointerEvents = 'none';
    tooltip.style.opacity = '0';
    tooltip.style.transition = 'opacity 0.2s';
    document.body.appendChild(tooltip);
    return tooltip;
};

          const tooltip = createTooltip();

    // 添加悬停事件
    triple5.addEventListener('mouseenter', function() {
        const rect = this.getBoundingClientRect();
        tooltip.style.left = `${rect.left + rect.width/2 - tooltip.offsetWidth/2}px`;
        tooltip.style.top = `${rect.top - tooltip.offsetHeight - 8}px`;
        tooltip.style.opacity = '1';
    });

    triple5.addEventListener('mouseleave', function() {
        tooltip.style.opacity = '0';
    });


})();
      //普通门诊诊查费
    (function() {
    'use strict';
    let triple5=document.createElement("button");
    triple5.innerText="门诊查费";
    triple5.style.background="#ebb563";//颜色弄得差不多吧
    triple5.style.color="white";
    triple5.id = "xmg-container"
    triple5.style.width="70px"
    triple5.style.height="30px"
    triple5.style.borderRadius = '3px'
    triple5.style.border = '0.1px solid white';// 边框大小为1像素，实线，白色
    //triple5.style.borderColor='transparent'//透明颜色边框
    triple5.onclick=function(){
    //三连代码，使用appendChild函数于div后也不再刷新，appendChild()方法将节点(元素)作为最后一个子元素添加到元素。
        document.querySelector("#pane-DOC_ORD > div:nth-child(2) > div > div > div > button:nth-child(4) > span").click()
        document.querySelector("#tab-1285303").click();//点击个人
      setTimeout(function () {
        zhenchafei()
        zhenchafei()
        }, 300 )
      //setTimeout(function () {
          //  document.querySelector("body > div.quote-template-modal.v-transfer-dom > div.ivu-modal-wrap.undefined.sun-responsive-modal > div > div > div.ivu-modal-body > div > div > div.leftTreeClass > div.el-scrollbar > div.el-scrollbar__wrap > div > div > div:nth-child(1) > div.el-tree-node__children > div:nth-child(1) > div.el-tree-node__content").click()//点击抽血耗材
        //}, 400 )

    }
    //let share5=document.querySelector("#main > div > div.single-page-con > div > div > div > div:nth-child(2) > div:nth-child(1)");//button所属于div
    let share5=document.querySelector("#pane-DOC_ORD > div:nth-child(2) > div > div > div");//button所属于div
    share5.parentElement.appendChild(triple5);

      // 创建提示元素
const createTooltip = () => {
    const tooltip = document.createElement('div');
    tooltip.textContent = '有注射费、雾化、吸氧、导尿、灌肠等治疗费用的开';
    tooltip.style.position = 'absolute';
    tooltip.style.padding = '6px 12px';
    tooltip.style.background = 'rgba(0,0,0,0.8)';
    tooltip.style.color = '#fff';
    tooltip.style.borderRadius = '4px';
    tooltip.style.fontSize = '14px';
    tooltip.style.fontFamily = '"PingFang SC","Microsoft YaHei",sans-serif';
    tooltip.style.zIndex = '9999';
    tooltip.style.pointerEvents = 'none';
    tooltip.style.opacity = '0';
    tooltip.style.transition = 'opacity 0.2s';
    document.body.appendChild(tooltip);
    return tooltip;
};

          const tooltip = createTooltip();

    // 添加悬停事件
    triple5.addEventListener('mouseenter', function() {
        const rect = this.getBoundingClientRect();
        tooltip.style.left = `${rect.left + rect.width/2 - tooltip.offsetWidth/2}px`;
        tooltip.style.top = `${rect.top - tooltip.offsetHeight - 8}px`;
        tooltip.style.opacity = '1';
    });

    triple5.addEventListener('mouseleave', function() {
        tooltip.style.opacity = '0';
    });


})();
     /* //ct
    (function() {
    'use strict';
    let triple5=document.createElement("button");
    triple5.innerText="CT+会诊";
    triple5.style.background="rgb(64, 158, 255)";//颜色弄得差不多吧
    triple5.style.color="white";
    triple5.id = "xmg-container"
    triple5.style.width="70px"
    triple5.style.height="30px"
    triple5.style.borderRadius = '3px'
    triple5.style.border = '0.1px solid white';// 边框大小为1像素，实线，白色
    //triple5.style.borderColor='transparent'//透明颜色边框
    triple5.onclick=function(){
    //三连代码，使用appendChild函数于div后也不再刷新，appendChild()方法将节点(元素)作为最后一个子元素添加到元素。

      //document.querySelector("#pane-DOC_ORD > div:nth-child(2) > div > div > div > button:nth-child(4) > span").click()
        //document.querySelector("##tab-1285303").click();//点击个人
      document.querySelector("body > div.quote-template-modal.v-transfer-dom > div.ivu-modal-wrap.undefined.sun-responsive-modal > div > div > div.ivu-modal-body > div > div > div.leftTreeClass > div.el-scrollbar > div.el-scrollbar__wrap > div > div > div:nth-child(1) > div.el-tree-node__children > div:nth-child(3) > div.el-tree-node__content > span.el-tree-node__label").click()
      document.querySelector("body > div.quote-template-modal.v-transfer-dom > div.ivu-modal-wrap.undefined.sun-responsive-modal > div > div > div.ivu-modal-body > div > div > div.leftTreeClass > div.el-scrollbar > div.el-scrollbar__wrap > div > div > div:nth-child(1) > div.el-tree-node__children > div:nth-child(3) > div.el-tree-node__content > span.el-tree-node__label").click()
    }
    //let share5=document.querySelector("#main > div > div.single-page-con > div > div > div > div:nth-child(2) > div:nth-child(1)");//button所属于div
    let share5=document.querySelector("#pane-DOC_ORD > div:nth-child(2) > div > div > div");//button所属于div
    share5.parentElement.appendChild(triple5);
})();*/


      //口服药
      (function() {
    'use strict';

    // 添加CSS样式
    GM_addStyle(`
        .triple-container {
            position: relative;
            display: inline-block;
            margin: 0px;/*四周边距*/
            z-index: 9999;
        }
        .triple5 {

    background: linear-gradient(135deg, #667eea, #764ba2);
    color="white";
    width="70px"
    height="30px"

    border = '0.1px solid white';// 边框大小为1像素，实线，白色
          border-radius: 3px;
          /*padding: 10px 20px;
            background: linear-gradient(135deg, #667eea, #764ba2);
            color: white;
            border: none;
            border-radius: 25px;
            cursor: pointer;
            box-shadow: 0 4px 8px rgba(0,0,0,0.2);
            font-weight: 600;
            font-size: 14px;
            transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);*/
        }
        .triple5:hover {
            transform: translateY(-3px);
            box-shadow: 0 6px 12px rgba(0,0,0,0.3);
        }
        .triple-submenu {
          z-index: 9999;
            position: absolute;
            /*bottom: -0px;*/
            /*top: 0%;  关键修改：改为从父元素底部开始计算 */
            left: 0;
            display: none;
            flex-direction: column;/*按钮从上到下排列*/
            gap: 1px;/*按钮之间的距离*/
            background: white;
            padding: 12px;
            border-radius: 12px;
            box-shadow: 0 8px 16px rgba(0,0,0,0.15);
            min-width: 140px;
            opacity: 0;
            transform: translateY(10px);
            transition: all 0.3s ease;
          /*margin-top: 5px;  添加与按钮的间距 */
        }
        .triple-container:hover .triple-submenu {
            display: flex;
            opacity: 1;
            transform: translateY(0);
        }
        .triple6, .triple7, .triple8, .triple9, .triple10, .triple11, .triple12, .triple13, .triple14, .triple15, .triple16, .triple1, .triple2 {
            padding: 8px 16px;
            background: linear-gradient(135deg, #4facfe, #00f2fe);
            color: white;
            border: none;
            border-radius: 20px;
            cursor: pointer;
            text-align: left;
            transition: all 0.2s;
            font-size: 13px;
          z-index: 9999;
        }
        .triple6:hover, .triple7:hover, .triple8:hover, .triple9:hover, .triple10:hover, .triple11:hover, .triple12:hover, .triple13:hover, .triple14:hover, .triple15:hover, .triple16:hover, .triple1:hover, .triple2:hover {
            transform: translateX(5px);
            opacity: 0.9;
        }
    `);

    // 创建按钮组件
    const createButtonGroup = () => {
        const container = document.createElement('div');
        container.className = 'triple-container';
        container.id="xmg-container"

        const triple5 = document.createElement('button');
        triple5.className = 'triple5';
        //triple5.textContent = 'Triple5';
        triple5.id="xmg-container"
        triple5.innerText="口服药";
        //triple5.style.background="#ebb563";//颜色弄得差不多吧
        triple5.style.color="white";
        triple5.style.width="70px"
        triple5.style.height="30px"
        triple5.style.borderRadius = '3px'
        triple5.style.border = '0.1px solid white';

        const submenu = document.createElement('div');
        submenu.className = 'triple-submenu';
        submenu.id="xmg-container"

        const triple6 = document.createElement('button');
        triple6.className = 'triple6';
        triple6.textContent = '硝缓+缬沙坦';
        triple6.id="xmg-container"
      triple6.onclick=function(){
      document.querySelector("body > div.quote-template-modal.v-transfer-dom > div.ivu-modal-wrap.undefined.sun-responsive-modal > div > div > div.ivu-modal-body > div > div > div.leftTreeClass > div.el-scrollbar > div.el-scrollbar__wrap > div > div > div:nth-child(1) > div.el-tree-node__children > div:nth-child(10) > div.el-tree-node__content > span.el-tree-node__label").click()
      document.querySelector("body > div.quote-template-modal.v-transfer-dom > div.ivu-modal-wrap.undefined.sun-responsive-modal > div > div > div.ivu-modal-body > div > div > div.leftTreeClass > div.el-scrollbar > div.el-scrollbar__wrap > div > div > div:nth-child(1) > div.el-tree-node__children > div:nth-child(10) > div.el-tree-node__content > span.el-tree-node__label").click()
    }

        const triple7 = document.createElement('button');
        triple7.className = 'triple7';
        triple7.textContent = '双胍+格列';
        triple7.id="xmg-container"
      triple7.onclick=function(){
      document.querySelector("body > div.quote-template-modal.v-transfer-dom > div.ivu-modal-wrap.undefined.sun-responsive-modal > div > div > div.ivu-modal-body > div > div > div.leftTreeClass > div.el-scrollbar > div.el-scrollbar__wrap > div > div > div:nth-child(1) > div.el-tree-node__children > div:nth-child(11) > div.el-tree-node__content > span.el-tree-node__label").click()
      document.querySelector("body > div.quote-template-modal.v-transfer-dom > div.ivu-modal-wrap.undefined.sun-responsive-modal > div > div > div.ivu-modal-body > div > div > div.leftTreeClass > div.el-scrollbar > div.el-scrollbar__wrap > div > div > div:nth-child(1) > div.el-tree-node__children > div:nth-child(11) > div.el-tree-node__content > span.el-tree-node__label").click()
    }

        const triple8 = document.createElement('button');
        triple8.className = 'triple8';
        triple8.textContent = '恩格列净';
        triple8.id="xmg-container"
      triple8.onclick=function(){
      document.querySelector("body > div.quote-template-modal.v-transfer-dom > div.ivu-modal-wrap.undefined.sun-responsive-modal > div > div > div.ivu-modal-body > div > div > div.leftTreeClass > div.el-scrollbar > div.el-scrollbar__wrap > div > div > div:nth-child(1) > div.el-tree-node__children > div:nth-child(12) > div.el-tree-node__content > span.el-tree-node__label").click()
      document.querySelector("body > div.quote-template-modal.v-transfer-dom > div.ivu-modal-wrap.undefined.sun-responsive-modal > div > div > div.ivu-modal-body > div > div > div.leftTreeClass > div.el-scrollbar > div.el-scrollbar__wrap > div > div > div:nth-child(1) > div.el-tree-node__children > div:nth-child(12) > div.el-tree-node__content > span.el-tree-node__label").click()
    }
      const triple9 = document.createElement('button');
        triple9.className = 'triple9';
        triple9.textContent = '阿司匹林';
        triple9.id="xmg-container"
      triple9.onclick=function(){
      document.querySelector("body > div.quote-template-modal.v-transfer-dom > div.ivu-modal-wrap.undefined.sun-responsive-modal > div > div > div.ivu-modal-body > div > div > div.leftTreeClass > div.el-scrollbar > div.el-scrollbar__wrap > div > div > div:nth-child(1) > div.el-tree-node__children > div:nth-child(13) > div.el-tree-node__content > span.el-tree-node__label").click()
      document.querySelector("body > div.quote-template-modal.v-transfer-dom > div.ivu-modal-wrap.undefined.sun-responsive-modal > div > div > div.ivu-modal-body > div > div > div.leftTreeClass > div.el-scrollbar > div.el-scrollbar__wrap > div > div > div:nth-child(1) > div.el-tree-node__children > div:nth-child(13) > div.el-tree-node__content > span.el-tree-node__label").click()
    }
      const triple10 = document.createElement('button');
        triple10.className = 'triple10';
        triple10.textContent = '阿托伐';
        triple10.id="xmg-container"
      triple10.onclick=function(){
      document.querySelector("body > div.quote-template-modal.v-transfer-dom > div.ivu-modal-wrap.undefined.sun-responsive-modal > div > div > div.ivu-modal-body > div > div > div.leftTreeClass > div.el-scrollbar > div.el-scrollbar__wrap > div > div > div:nth-child(1) > div.el-tree-node__children > div:nth-child(14) > div.el-tree-node__content > span.el-tree-node__label").click()
      document.querySelector("body > div.quote-template-modal.v-transfer-dom > div.ivu-modal-wrap.undefined.sun-responsive-modal > div > div > div.ivu-modal-body > div > div > div.leftTreeClass > div.el-scrollbar > div.el-scrollbar__wrap > div > div > div:nth-child(1) > div.el-tree-node__children > div:nth-child(14) > div.el-tree-node__content > span.el-tree-node__label").click()
    }
      const triple11 = document.createElement('button');
        triple11.className = 'triple11';
        triple11.textContent = '丹参片';
        triple11.id="xmg-container"
      triple11.onclick=function(){
      mubanyinyong()
        document.querySelector("#tab-1285303").click();//点击个人
        setTimeout(function () {
          danshenpian()
      danshenpian()
        }, 200 )

    }
      const triple12 = document.createElement('button');
        triple12.className = 'triple12';
        triple12.textContent = '奥美拉唑';
        triple12.id="xmg-container"
        triple12.onclick=function(){
      mubanyinyong()
          document.querySelector("#tab-1285303").click();//点击个人
        setTimeout(function () {
          aomeilazuo()
      aomeilazuo()
        }, 200 )
    }
      const triple13 = document.createElement('button');
        triple13.className = 'triple13';
        triple13.textContent = '氨氯地平片';
        triple13.id="xmg-container"
        triple13.onclick=function(){
      mubanyinyong()
          document.querySelector("#tab-1285303").click();//点击个人
        setTimeout(function () {
          anlvdiping()
          anlvdiping()
        }, 200 )
    }
      const triple14 = document.createElement('button');
        triple14.className = 'triple14';
        triple14.textContent = '琥珀酸美';
        triple14.id="xmg-container"
        triple14.onclick=function(){
      mubanyinyong()
          document.querySelector("#tab-1285303").click();//点击个人
        setTimeout(function () {
          huposuanmei()
          huposuanmei()
        }, 200 )
    }
      const triple15 = document.createElement('button');
        triple15.className = 'triple15';
        triple15.textContent = '硝苯（控）';
        triple15.id="xmg-container"
        triple15.onclick=function(){
      mubanyinyong()
          document.querySelector("#tab-1285303").click();//点击个人
        setTimeout(function () {
          xiaokong()
          xiaokong()
        }, 200 )
    }
      const triple16 = document.createElement('button');
        triple16.className = 'triple16';
        triple16.textContent = '阿卡波糖';
        triple16.id="xmg-container"
        triple16.onclick=function(){
      mubanyinyong()
          document.querySelector("#tab-1285303").click();//点击个人
        setTimeout(function () {
          akabotang()
          akabotang()
        }, 200 )
    }
      const triple1 = document.createElement('button');
        triple1.className = 'triple1';
        triple1.textContent = '输液';
        triple1.id="xmg-container"
      triple1.onclick=function(){
      document.querySelector("body > div.quote-template-modal.v-transfer-dom > div.ivu-modal-wrap.undefined.sun-responsive-modal > div > div > div.ivu-modal-body > div > div > div.leftTreeClass > div.el-scrollbar > div.el-scrollbar__wrap > div > div > div:nth-child(1) > div.el-tree-node__children > div:nth-child(9) > div.el-tree-node__content > span.el-tree-node__label").click()
      document.querySelector("body > div.quote-template-modal.v-transfer-dom > div.ivu-modal-wrap.undefined.sun-responsive-modal > div > div > div.ivu-modal-body > div > div > div.leftTreeClass > div.el-scrollbar > div.el-scrollbar__wrap > div > div > div:nth-child(1) > div.el-tree-node__children > div:nth-child(9) > div.el-tree-node__content > span.el-tree-node__label").click()
    }
      const triple2 = document.createElement('button');
        triple2.className = 'triple2';
        triple2.textContent = '发热小针';
        triple2.id="xmg-container"
      triple2.onclick=function(){
      document.querySelector("body > div.quote-template-modal.v-transfer-dom > div.ivu-modal-wrap.undefined.sun-responsive-modal > div > div > div.ivu-modal-body > div > div > div.leftTreeClass > div.el-scrollbar > div.el-scrollbar__wrap > div > div > div:nth-child(1) > div.el-tree-node__children > div:nth-child(15) > div.el-tree-node__content > span.el-tree-node__label").click()
      document.querySelector("body > div.quote-template-modal.v-transfer-dom > div.ivu-modal-wrap.undefined.sun-responsive-modal > div > div > div.ivu-modal-body > div > div > div.leftTreeClass > div.el-scrollbar > div.el-scrollbar__wrap > div > div > div:nth-child(1) > div.el-tree-node__children > div:nth-child(15) > div.el-tree-node__content > span.el-tree-node__label").click()
    }

        submenu.append(triple6, triple7, triple8,triple9,triple9,triple10,triple11,triple12,triple13,triple14,triple15,triple16,triple1,triple2);
        container.append(triple5, submenu);

        return container;
    };

    // 主执行函数
    const init = () => {
        try {
            const target = document.querySelector("#pane-DOC_ORD > div:nth-child(2) > div > div > div");
            if (target && target.parentElement) {
                const buttonGroup = createButtonGroup();
                target.parentElement.appendChild(buttonGroup);
                console.log('Triple按钮组已成功添加');
            }
        } catch (e) {
            console.error('Triple按钮添加失败:', e);
        }
    };

    // 延迟执行确保DOM加载完成
    setTimeout(init, 100);
})();



//检查
      (function() {
    'use strict';

    // 添加CSS样式
    GM_addStyle(`
        .triple-container {
            position: relative;
            display: inline-block;
            margin: 0px;/*四周边距*/
            z-index: 9999;
        }


        .triple5 {

    background="#ebb563";//颜色弄得差不多吧
    color="white";
    width="70px"
    height="30px"

    border = '0.1px solid white';// 边框大小为1像素，实线，白色
          /*padding: 10px 20px;
            background: linear-gradient(135deg, #667eea, #764ba2);
            color: white;
            border: none;
            border-radius: 25px;
            cursor: pointer;
            box-shadow: 0 4px 8px rgba(0,0,0,0.2);
            font-weight: 600;
            font-size: 14px;
            transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);*/
        }
        .triple5:hover {
            transform: translateY(-3px);
            box-shadow: 0 6px 12px rgba(0,0,0,0.3);
        }
        .triple-submenu1 {
            position: absolute;
            /*bottom: 0px;*/
            left: 0;
            display: none;
            flex-direction: column;/*按钮从上到下排列*/
            gap: 1px;/*按钮之间的距离*/
            background: white;
            padding: 12px;
            border-radius: 12px;
            box-shadow: 0 8px 16px rgba(0,0,0,0.15);
            min-width: 140px;
            opacity: 0;
            transform: translateY(10px);
            transition: all 0.3s ease;
        }
        .triple-container:hover .triple-submenu1 {
            display: flex;
            opacity: 1;
            transform: translateY(0);
        }
        .triple6, .triple7, .triple8, .triple9, .triple10, .triple11 {
            padding: 8px 16px;
            background: linear-gradient(135deg, #4facfe, #00f2fe);
            color: white;
            border: none;
            border-radius: 20px;
            cursor: pointer;
            text-align: left;
            transition: all 0.2s;
            font-size: 13px;
        }
        .triple6:hover, .triple7:hover, .triple8:hover, .triple9:hover, .triple10:hover, .triple11:hover {
            transform: translateX(5px);
            opacity: 0.9;
        }
    `);

    // 创建按钮组件
    const createButtonGroup = () => {
        const container = document.createElement('div');
        container.className = 'triple-container';
        container.id="xmg-container"

        const triple5 = document.createElement('button');
        triple5.className = 'triple5';
        //triple5.textContent = 'Triple5';
        triple5.id="xmg-container"
        triple5.innerText="检查";
        triple5.style.background="#ebb563";//颜色弄得差不多吧
        triple5.style.color="white";
        triple5.style.width="70px"
        triple5.style.height="30px"
        triple5.style.borderRadius = '3px'
        triple5.style.border = '0.1px solid white';

        const submenu1 = document.createElement('div');
        submenu1.className = 'triple-submenu1';
        submenu1.id="xmg-container"

        const triple6 = document.createElement('button');
        triple6.className = 'triple6';
        triple6.textContent = 'CT+会诊';
        triple6.id="xmg-container"
      triple6.onclick=function(){
      document.querySelector("body > div.quote-template-modal.v-transfer-dom > div.ivu-modal-wrap.undefined.sun-responsive-modal > div > div > div.ivu-modal-body > div > div > div.leftTreeClass > div.el-scrollbar > div.el-scrollbar__wrap > div > div > div:nth-child(1) > div.el-tree-node__children > div:nth-child(3) > div.el-tree-node__content > span.el-tree-node__label").click()
      document.querySelector("body > div.quote-template-modal.v-transfer-dom > div.ivu-modal-wrap.undefined.sun-responsive-modal > div > div > div.ivu-modal-body > div > div > div.leftTreeClass > div.el-scrollbar > div.el-scrollbar__wrap > div > div > div:nth-child(1) > div.el-tree-node__children > div:nth-child(3) > div.el-tree-node__content > span.el-tree-node__label").click()
    }

        const triple7 = document.createElement('button');
        triple7.className = 'triple7';
        triple7.textContent = '心电图';
        triple7.id="xmg-container"
      triple7.onclick=function(){
      document.querySelector("body > div.quote-template-modal.v-transfer-dom > div.ivu-modal-wrap.undefined.sun-responsive-modal > div > div > div.ivu-modal-body > div > div > div.leftTreeClass > div.el-scrollbar > div.el-scrollbar__wrap > div > div > div:nth-child(1) > div.el-tree-node__children > div:nth-child(4) > div.el-tree-node__content > span.el-tree-node__label").click()
      document.querySelector("body > div.quote-template-modal.v-transfer-dom > div.ivu-modal-wrap.undefined.sun-responsive-modal > div > div > div.ivu-modal-body > div > div > div.leftTreeClass > div.el-scrollbar > div.el-scrollbar__wrap > div > div > div:nth-child(1) > div.el-tree-node__children > div:nth-child(4) > div.el-tree-node__content > span.el-tree-node__label").click()
    }

        const triple8 = document.createElement('button');
        triple8.className = 'triple8';
        triple8.textContent = '血常规+crp';
        triple8.id="xmg-container"
      triple8.onclick=function(){
      document.querySelector("body > div.quote-template-modal.v-transfer-dom > div.ivu-modal-wrap.undefined.sun-responsive-modal > div > div > div.ivu-modal-body > div > div > div.leftTreeClass > div.el-scrollbar > div.el-scrollbar__wrap > div > div > div:nth-child(1) > div.el-tree-node__children > div:nth-child(5) > div.el-tree-node__content > span.el-tree-node__label").click()
      document.querySelector("body > div.quote-template-modal.v-transfer-dom > div.ivu-modal-wrap.undefined.sun-responsive-modal > div > div > div.ivu-modal-body > div > div > div.leftTreeClass > div.el-scrollbar > div.el-scrollbar__wrap > div > div > div:nth-child(1) > div.el-tree-node__children > div:nth-child(5) > div.el-tree-node__content > span.el-tree-node__label").click()
    }
      const triple9 = document.createElement('button');
        triple9.className = 'triple9';
        triple9.textContent = '彩超104';
        triple9.id="xmg-container"
      triple9.onclick=function(){
      document.querySelector("body > div.quote-template-modal.v-transfer-dom > div.ivu-modal-wrap.undefined.sun-responsive-modal > div > div > div.ivu-modal-body > div > div > div.leftTreeClass > div.el-scrollbar > div.el-scrollbar__wrap > div > div > div:nth-child(1) > div.el-tree-node__children > div:nth-child(6) > div.el-tree-node__content > span.el-tree-node__label").click()
      document.querySelector("body > div.quote-template-modal.v-transfer-dom > div.ivu-modal-wrap.undefined.sun-responsive-modal > div > div > div.ivu-modal-body > div > div > div.leftTreeClass > div.el-scrollbar > div.el-scrollbar__wrap > div > div > div:nth-child(1) > div.el-tree-node__children > div:nth-child(6) > div.el-tree-node__content > span.el-tree-node__label").click()
    }
            // 创建提示元素
const createTooltip9 = () => {
    const tooltip9 = document.createElement('div');
    tooltip9.textContent = '彩色多普勒超声常规检查计价部位为：1.胸部（含肺、胸腔、纵隔）;2.腹部（含肝、胆、胰、脾、双肾）;3.胃肠道;4.泌尿系（含双肾、输尿管、膀胱、前列腺）;5.妇科（含子宫、附件、膀胱及周围组织）;6.产科（含胎儿及宫腔);7.、男性生殖系统(含睾丸、附睾、输精管、精索、前列腺；8.肠系膜';
    tooltip9.style.position = 'absolute';
    tooltip9.style.padding = '6px 12px';
    tooltip9.style.background = 'rgba(0,0,0,0.8)';
    tooltip9.style.color = '#fff';
    tooltip9.style.borderRadius = '4px';
    tooltip9.style.fontSize = '14px';
    tooltip9.style.fontFamily = '"PingFang SC","Microsoft YaHei",sans-serif';
    tooltip9.style.zIndex = '9999';
    tooltip9.style.pointerEvents = 'none';
    tooltip9.style.opacity = '0';
    tooltip9.style.transition = 'opacity 0.2s';
    tooltip9.style.width="500px"
    document.body.appendChild(tooltip9);
    return tooltip9;
};

          const tooltip9 = createTooltip9();

    // 添加悬停事件
    triple9.addEventListener('mouseenter', function() {
        const rect9 = this.getBoundingClientRect();
        tooltip9.style.left = `${rect9.left + rect9.width}px`;///2 - tooltip9.offsetWidth/2
        tooltip9.style.top = `${rect9.top}px`;// - tooltip9.offsetHeight - 8
        tooltip9.style.opacity = '1';
      tooltip9.style.max="20"
    });

    triple9.addEventListener('mouseleave', function() {
        tooltip9.style.opacity = '0';
    });

      const triple10 = document.createElement('button');
        triple10.className = 'triple10';
        triple10.textContent = '彩超96';
        triple10.id="xmg-container"
      triple10.onclick=function(){
      document.querySelector("body > div.quote-template-modal.v-transfer-dom > div.ivu-modal-wrap.undefined.sun-responsive-modal > div > div > div.ivu-modal-body > div > div > div.leftTreeClass > div.el-scrollbar > div.el-scrollbar__wrap > div > div > div:nth-child(1) > div.el-tree-node__children > div:nth-child(7) > div.el-tree-node__content > span.el-tree-node__label").click()
      document.querySelector("body > div.quote-template-modal.v-transfer-dom > div.ivu-modal-wrap.undefined.sun-responsive-modal > div > div > div.ivu-modal-body > div > div > div.leftTreeClass > div.el-scrollbar > div.el-scrollbar__wrap > div > div > div:nth-child(1) > div.el-tree-node__children > div:nth-child(7) > div.el-tree-node__content > span.el-tree-node__label").click()
    }
            // 创建提示元素
const createTooltip10 = () => {
    const tooltip10 = document.createElement('div');
    tooltip10.textContent = '浅表器官彩色多普勒超声检查计价部位分为：1．双眼及附属器；2．双涎腺及颈部淋巴结；3．甲状腺及颈部淋巴结；4．乳腺及其引流区淋巴结；5．上肢或下肢软组织；6．阴囊、双侧睾丸、附睾；7．颅腔；8.体表包块；9.关节；10.其他。包括周围神经彩色多普勒超声。';
    tooltip10.style.position = 'absolute';
    tooltip10.style.padding = '6px 12px';
    tooltip10.style.background = 'rgba(0,0,0,0.8)';
    tooltip10.style.color = '#fff';
    tooltip10.style.borderRadius = '4px';
    tooltip10.style.fontSize = '14px';
    tooltip10.style.fontFamily = '"PingFang SC","Microsoft YaHei",sans-serif';
    tooltip10.style.zIndex = '9999';
    tooltip10.style.pointerEvents = 'none';
    tooltip10.style.opacity = '0';
    tooltip10.style.transition = 'opacity 0.2s';
    tooltip10.style.width="500px"
    document.body.appendChild(tooltip10);
    return tooltip10;
};

          const tooltip10 = createTooltip10();

    // 添加悬停事件
    triple10.addEventListener('mouseenter', function() {
        const rect10 = this.getBoundingClientRect();
        tooltip10.style.left = `${rect10.left + rect10.width}px`;///2 - tooltip10.offsetWidth/2
        tooltip10.style.top = `${rect10.top}px`;// - tooltip10.offsetHeight - 8
        tooltip10.style.opacity = '1';
    });

    triple10.addEventListener('mouseleave', function() {
        tooltip10.style.opacity = '0';
    });

      const triple11 = document.createElement('button');
        triple11.className = 'triple11';
        triple11.textContent = 'X线';
        triple11.id="xmg-container"
      triple11.onclick=function(){
      mubanyinyong()
          document.querySelector("#tab-1285303").click();//点击个人
        setTimeout(function () {
          xxian()
          xxian()
        }, 200 )
    }





        submenu1.append(triple6, triple7, triple8,triple9,triple9,triple10,triple11);
        container.append(triple5, submenu1);

        return container;
    };

    // 主执行函数
    const init = () => {
        try {
            const target = document.querySelector("#pane-DOC_ORD > div:nth-child(2) > div > div > div");
            if (target && target.parentElement) {
                const buttonGroup = createButtonGroup();
                target.parentElement.appendChild(buttonGroup);
                console.log('Triple按钮组已成功添加');
            }
        } catch (e) {
            console.error('Triple按钮添加失败:', e);
        }
    };

    // 延迟执行确保DOM加载完成
    setTimeout(init, 100);
})();


      //签名
      (function() {
    'use strict';

    // 添加CSS样式
    GM_addStyle(`
        .triple-container {
            position: relative;
            display: inline-block;
            margin: 0px;/*四周边距*/
            z-index: 9999;
        }


        .triple5 {

    background="#ebb563";//颜色弄得差不多吧
    color="white";
    width="70px"
    height="30px"

    border = '0.1px solid white';// 边框大小为1像素，实线，白色
          /*padding: 10px 20px;
            background: linear-gradient(135deg, #667eea, #764ba2);
            color: white;
            border: none;
            border-radius: 25px;
            cursor: pointer;
            box-shadow: 0 4px 8px rgba(0,0,0,0.2);
            font-weight: 600;
            font-size: 14px;
            transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);*/
        }
        .triple5:hover {
            transform: translateY(-3px);
            box-shadow: 0 6px 12px rgba(0,0,0,0.3);
        }
        .triple-submenu1 {
            position: absolute;
            /*bottom: 0px;*/
            left: 0;
            display: none;
            flex-direction: column;/*按钮从上到下排列*/
            gap: 1px;/*按钮之间的距离*/
            background: white;
            padding: 12px;
            border-radius: 12px;
            box-shadow: 0 8px 16px rgba(0,0,0,0.15);
            min-width: 140px;
            opacity: 0;
            transform: translateY(10px);
            transition: all 0.3s ease;
        }
        .triple-container:hover .triple-submenu1 {
            display: flex;
            opacity: 1;
            transform: translateY(0);
        }
        .triple6, .triple7, .triple8, .triple9, .triple10 {
            padding: 8px 16px;
            background: linear-gradient(135deg, #4facfe, #00f2fe);
            color: white;
            border: none;
            border-radius: 20px;
            cursor: pointer;
            text-align: left;
            transition: all 0.2s;
            font-size: 13px;
        }
        .triple6:hover, .triple7:hover, .triple8:hover, .triple9:hover, .triple10:hover {
            transform: translateX(5px);
            opacity: 0.9;
        }
    `);

    // 创建按钮组件
    const createButtonGroup = () => {
        const container = document.createElement('div');
        container.className = 'triple-container';
        container.id="xmg-container"

        const triple5 = document.createElement('button');
        triple5.className = 'triple5';
        //triple5.textContent = 'Triple5';
        triple5.id="xmg-container"
        triple5.innerText="医嘱签名";
        triple5.style.background="rgb(64, 158, 255)";//颜色弄得差不多吧
        triple5.style.color="white";
        triple5.style.width="70px"
        triple5.style.height="30px"
        triple5.style.borderRadius = '3px'
        triple5.style.border = '0.1px solid white';
      triple5.onclick=function(){
        document.querySelector("#main > div > div.single-page-con > div > div > div > div:nth-child(2) > div:nth-child(1) > form > div > div > div.sun-select > div > div.el-select-dropdown.el-popper > div.el-scrollbar > div.el-select-dropdown__wrap.el-scrollbar__wrap > ul > li:nth-child(3) > span").click()
        document.querySelector("#medicalAdviceEntryTableById > div.button-tools-group > div > div > span > button:nth-child(3)").click()
        }
        const submenu1 = document.createElement('div');
        submenu1.className = 'triple-submenu1';
        submenu1.id="xmg-container"

        const triple6 = document.createElement('button');
        triple6.className = 'triple6';
        triple6.textContent = '高血压签名';
        triple6.id="xmg-container"
      triple6.onclick=function(){
        document.querySelector("#main > div > div.single-page-con > div > div > div > div:nth-child(2) > div:nth-child(1) > form > div > div > div.sun-select > div > div.el-select-dropdown.el-popper > div.el-scrollbar > div.el-select-dropdown__wrap.el-scrollbar__wrap > ul > li:nth-child(3) > span").click()
        document.querySelector("#medicalAdviceEntryTableById > div.button-tools-group > div > div > span > button:nth-child(3)").click()
        //点击健康处方标签
        setTimeout(function () {
          jiankangjiaoyuchufang()
        }, 1600 )
      //点击慢性病标签
      setTimeout(function () {
            manxingbing()
        }, 2300 )
      //点击高血压标签
      setTimeout(function () {
      gaoxueyajiankang()
        }, 2500 )
    //点击保存标签
      setTimeout(function () {
        dianjibaocun()
        //document.querySelector("body > div:nth-child(31) > div.ivu-modal-wrap.undefined.sun-responsive-modal > div > div > div.ivu-modal-footer > div > button.el-button.el-tooltip.el-button--primary.el-button--small.sun-button.sun-button-small").click()
        }, 2800 )
      }

        const triple7 = document.createElement('button');
        triple7.className = 'triple7';
        triple7.textContent = '糖尿病签名';
        triple7.id="xmg-container"
      triple7.onclick=function(){
        document.querySelector("#main > div > div.single-page-con > div > div > div > div:nth-child(2) > div:nth-child(1) > form > div > div > div.sun-select > div > div.el-select-dropdown.el-popper > div.el-scrollbar > div.el-select-dropdown__wrap.el-scrollbar__wrap > ul > li:nth-child(3) > span").click()
        document.querySelector("#medicalAdviceEntryTableById > div.button-tools-group > div > div > span > button:nth-child(3)").click()
        //点击健康处方标签
        setTimeout(function () {
          jiankangjiaoyuchufang()
        }, 1600 )
      //点击慢性病标签
      setTimeout(function () {
            manxingbing()
        }, 2300 )
      //点击高血压标签
      setTimeout(function () {
      tangniaobingjiankang()
        }, 2500 )
    //点击保存标签
      setTimeout(function () {
        dianjibaocun()
        //document.querySelector("body > div:nth-child(31) > div.ivu-modal-wrap.undefined.sun-responsive-modal > div > div > div.ivu-modal-footer > div > button.el-button.el-tooltip.el-button--primary.el-button--small.sun-button.sun-button-small").click()
        }, 2800 )
      }

        const triple8 = document.createElement('button');
        triple8.className = 'triple8';
        triple8.textContent = '脑血管签名';
        triple8.id="xmg-container"
      triple8.onclick=function(){
      document.querySelector("#main > div > div.single-page-con > div > div > div > div:nth-child(2) > div:nth-child(1) > form > div > div > div.sun-select > div > div.el-select-dropdown.el-popper > div.el-scrollbar > div.el-select-dropdown__wrap.el-scrollbar__wrap > ul > li:nth-child(3) > span").click()
        document.querySelector("#medicalAdviceEntryTableById > div.button-tools-group > div > div > span > button:nth-child(3)").click()
        //点击健康处方标签
        setTimeout(function () {
          jiankangjiaoyuchufang()
        }, 1600 )
      //点击慢性病标签
      setTimeout(function () {
            manxingbing()
        }, 2300 )
      //点击高血压标签
      setTimeout(function () {
      naoxueguanjiankang()
        }, 2500 )
    //点击保存标签
      setTimeout(function () {
        dianjibaocun()
        //document.querySelector("body > div:nth-child(31) > div.ivu-modal-wrap.undefined.sun-responsive-modal > div > div > div.ivu-modal-footer > div > button.el-button.el-tooltip.el-button--primary.el-button--small.sun-button.sun-button-small").click()
        }, 2800 )}
      const triple9 = document.createElement('button');
        triple9.className = 'triple9';
        triple9.textContent = '冠心病签名';
        triple9.id="xmg-container"
      triple9.onclick=function(){
      document.querySelector("#main > div > div.single-page-con > div > div > div > div:nth-child(2) > div:nth-child(1) > form > div > div > div.sun-select > div > div.el-select-dropdown.el-popper > div.el-scrollbar > div.el-select-dropdown__wrap.el-scrollbar__wrap > ul > li:nth-child(3) > span").click()
        document.querySelector("#medicalAdviceEntryTableById > div.button-tools-group > div > div > span > button:nth-child(3)").click()
        //点击健康处方标签
        setTimeout(function () {
          jiankangjiaoyuchufang()
        }, 1600 )
      //点击慢性病标签
      setTimeout(function () {
          manxingbing()
        }, 2300 )
      //点击冠心病标签
      setTimeout(function () {
        guanxinbingjiankang()
        }, 2500 )
    //点击保存标签
      setTimeout(function () {
        dianjibaocun()
        //document.querySelector("body > div:nth-child(31) > div.ivu-modal-wrap.undefined.sun-responsive-modal > div > div > div.ivu-modal-footer > div > button.el-button.el-tooltip.el-button--primary.el-button--small.sun-button.sun-button-small").click()
        }, 2800 )}

      const triple10 = document.createElement('button');
        triple10.className = 'triple10';
        triple10.textContent = '支气管签名';
        triple10.id="xmg-container"
      triple10.onclick=function(){
      document.querySelector("#main > div > div.single-page-con > div > div > div > div:nth-child(2) > div:nth-child(1) > form > div > div > div.sun-select > div > div.el-select-dropdown.el-popper > div.el-scrollbar > div.el-select-dropdown__wrap.el-scrollbar__wrap > ul > li:nth-child(3) > span").click()
        document.querySelector("#medicalAdviceEntryTableById > div.button-tools-group > div > div > span > button:nth-child(3)").click()
        //点击健康处方标签
        setTimeout(function () {
          jiankangjiaoyuchufang()
        }, 1600 )
      //点击慢性病标签
      setTimeout(function () {
            manxingbing()
        }, 2300 )
      //点击高血压标签
      setTimeout(function () {
      zhiqiguanyan()
        }, 2500 )
    //点击保存标签
      setTimeout(function () {
        dianjibaocun()
        //document.querySelector("body > div:nth-child(31) > div.ivu-modal-wrap.undefined.sun-responsive-modal > div > div > div.ivu-modal-footer > div > button.el-button.el-tooltip.el-button--primary.el-button--small.sun-button.sun-button-small").click()
        }, 2800 )}



        submenu1.append(triple6, triple7, triple8,triple9,triple9,triple10);
        container.append(triple5, submenu1);

        return container;
    };

    // 主执行函数
    const init = () => {
        try {
            const target = document.querySelector("#pane-DOC_ORD > div:nth-child(2) > div > div > div");
            if (target && target.parentElement) {
                const buttonGroup = createButtonGroup();
                target.parentElement.appendChild(buttonGroup);
                console.log('Triple按钮组已成功添加');
            }
        } catch (e) {
            console.error('Triple按钮添加失败:', e);
        }
    };

    // 延迟执行确保DOM加载完成
    setTimeout(init, 100);
})();




(function() {
    document.onkeydown = function(event1){
    if (event1.key === 'F7'){//event.shiftKey && event.ctrlKey && event.key.toLowerCase() === 'x'event.code='KeyF2'（F2需要三个=）
        event1.preventDefault()
        document.querySelector("body > ul > li:nth-child(13)").click()
        //return
    }
  if (event.key === 'F8' && !event.repeat){
    event.preventDefault()
        performActions()}
      //太牛了，形成了一个循环，“performActions()”为本句话上下文的概括，没想到在概括内部可以引用概括，并且解决了之前单独引用只能用1-2次的问题，这个解决办法真是绝了！！！
  if (event1.key === 'F10' && !event1.repeat){
        event1.preventDefault()
      let alertBox = document.querySelector("body > div.multi-alert")
      if (alertBox) {
      // 如果弹窗存在则移除
      alertBox.remove();
    } else {
      GM_addStyle(`
    .multi-alert {
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 15px;
        background: #f8f9fa;
        border-left: 4px solid #007bff;
        border-radius: 4px;
        box-shadow: 0 2px 8px rgba(0,0,0,0.1);
        z-index: 9999;
        animation: slideIn 0.3s ease-out;
      //不知道啥用word-wrap: break-word; /* 或 overflow-wrap: break-word; */
      //不知道啥用white-space: pre-wrap; /* 或 white-space: normal; */
       width:300px
    }
    .red { color: #dc3545; }
    .green { color: #28a745; }
    .blue { color: #007bff; }
.purple { color: #800080; }
.yellow{ color: #E6A23C; }
.pre-line { white-space: pre-line; }  /* 使\n生效‌:ml-citation{ref="3,5" data="citationList"} */

    @keyframes slideIn { from { opacity: 0; transform: translateX(100%); } }
`);

function showMultiColorAlert(contentArr) {
    const alertBox = document.createElement('div');
    alertBox.className = 'multi-alert';

    contentArr.forEach(item => {
        const span = document.createElement('span');
        span.className = item.color;
        span.textContent = item.text;
        alertBox.appendChild(span);
    });

    document.body.appendChild(alertBox);
    setTimeout(() => alertBox.remove(), 6000);
}
      //alertBox.remove()
        //return
    // 调用示例
showMultiColorAlert([
     { text: `1.紫色管：血常规,C反应蛋白，肺炎支原体，肺炎衣原体，糖化血红蛋白，心梗三项，BNP，降钙素原，血型（1-2ml血量，需要混匀)—————————————————大紫管：高血压四项（抽5ml）—————————————————`,color: 'purple'},
    { text: `2.红色管：小生化，大生化，肝功，肾功，血糖，血脂，尿酸，电解质，白介素6，腺病毒，呼吸道合胞病毒，柯萨奇病毒，抗O，类风湿因子，同型半胱氨酸，乙肝五项，梅毒，艾滋病，丙肝（3-5ml血量，不需要混匀）血清胱抑素，血清α-L-岩藻糖苷酶测定—————————————————`, color: 'red' },
    { text: `3.蓝色管：凝血四项，D-二聚体（2ml血量，需要混匀）—————————————————`, color: 'blue' },
  { text: `4.黄色塑料管：甲功五项，甲功七项，病毒八项，男女性肿瘤标志物测定，C肽，胰岛素测定，抗胰岛素抗体测定（外送艾迪康测定，3-5ml血量，不需要混匀）—————————————————`, color: 'yellow' },
  { text: `5.黑色管：血沉测定（1.6ml血量混匀），注意黑色管中间有一蓝色线，为抽血到达量！—————————————————`, color: 'black' },
  { text: `6.绿色塑料管：微量元素五项，微量元素六项（2ml血量混匀）━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`, color: 'green' },
]);
    }}
    //F1执行读卡后扫码
    if (event1.key === 'F1'){//event.shiftKey && event.ctrlKey && event.key.toLowerCase() === 'x'event.code='KeyF2'（F2需要三个=）
        event1.preventDefault()
        //document.querySelector("#main > div > div.single-page-con > div > div > div > form > div > div:nth-child(1) > div:nth-child(1) > label > div > label:nth-child(1) > span").click();//点击切换“身份证”按钮
        document.querySelector("#main > div > div.single-page-con > div > div > div > form > div > div:nth-child(1) > div:nth-child(3) > label > button").click();//点击“读身份证”按钮2025.05.02更新
        setTimeout(function () {
            //document.querySelector("#main > div > div.single-page-con > div > div > div > form > div > div:nth-child(1) > div:nth-child(2) > label > div > button").click();//点击“读身份证”按钮
            document.querySelector("#main > div > div.single-page-con > div > div > div > form > div > div:nth-child(1) > div:nth-child(1) > label > div > label:nth-child(2) > span").click();//点击切换“扫码”按钮
        //alert('成功！')//提示文本框
        }, 300 )
   }
   }

})();
(function() {
            document.querySelector("#main > div > div.single-page-con > div > div > div > div:nth-child(2) > div:nth-child(1) > form > div > div > div.sun-select > div > div.el-select-dropdown.el-popper > div.el-scrollbar > div.el-select-dropdown__wrap.el-scrollbar__wrap > ul > li:nth-child(3) > span").click()

//自动症状及描述示：其他
    function performActions1() {
    var input = document.querySelector("#main > div > div.single-page-con > div > div > div > div:nth-child(2) > div:nth-child(5) > label > div > div.el-select__tags > input");
    input.dispatchEvent(new Event('input', { bubbles: true }));//dispatchEvent(new Event('focus'))
    input.dispatchEvent(new Event('change', { bubbles: true }));
    input.value = 'qt';
        input.dispatchEvent(new Event('input'))
        input.dispatchEvent(new Event('blur'))
        setTimeout(function () {
            input.click()

        }, 1200 )
        setTimeout(function () {
            document.querySelector("body > div.el-select-dropdown.el-popper.is-multiple > div.el-scrollbar > div.el-select-dropdown__wrap.el-scrollbar__wrap > ul > li:nth-child(19) > span:nth-child(1)").click();

        }, 2000 )
    input.addEventListener.value('qt', function() {
        input.click()

    })};
    setTimeout(function () {
            performActions1();
        }, 100 )

})();;
  //alert(`辅助已打开`);



}
    }


///////以上为公共操作
//...............................................................................................................................................................................................................................................................................
//
//
//
 //快捷键F10调用提示查血管耗材
document.onkeydown = function(event){
  if (event.key === 'F8' && !event.repeat){
    event.preventDefault()
        performActions()}
  if (event.key === 'F10' && !event.repeat){
      event.preventDefault()
      let alertBox = document.querySelector("body > div.multi-alert")
      if (alertBox) {
      // 如果弹窗存在则移除
      alertBox.remove();
    } else {
      GM_addStyle(`
    .multi-alert {
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 15px;
        background: #f8f9fa;
        border-left: 4px solid #007bff;
        border-radius: 4px;
        box-shadow: 0 2px 8px rgba(0,0,0,0.1);
        z-index: 9999;
        animation: slideIn 0.3s ease-out;
      //不知道啥用word-wrap: break-word; /* 或 overflow-wrap: break-word; */
      //不知道啥用white-space: pre-wrap; /* 或 white-space: normal; */
       width:300px
    }
    .red { color: #dc3545; }
    .green { color: #28a745; }
    .blue { color: #007bff; }
.purple { color: #800080; }
.yellow{ color: #E6A23C; }
.pre-line { white-space: pre-line; }  /* 使\n生效‌:ml-citation{ref="3,5" data="citationList"} */

    @keyframes slideIn { from { opacity: 0; transform: translateX(100%); } }
`);

function showMultiColorAlert(contentArr) {
    const alertBox = document.createElement('div');
    alertBox.className = 'multi-alert';
    contentArr.forEach(item => {
        const span = document.createElement('span');
        span.className = item.color;
        span.textContent = item.text;
        alertBox.appendChild(span);
    });

    document.body.appendChild(alertBox);
    setTimeout(() => alertBox.remove(), 9000);//退出时间
}
      //alertBox.remove()
        //return
    // 调用示例
showMultiColorAlert([
  { text: `1.紫色管：血常规,C反应蛋白，肺炎支原体，肺炎衣原体，糖化血红蛋白，心梗三项，BNP，降钙素原，血型（1-2ml血量，需要混匀)—————————————————大紫管：高血压四项（抽5ml）—————————————————`,color: 'purple'},
    { text: `2.红色管：小生化，大生化，肝功，肾功，血糖，血脂，尿酸，电解质，白介素6，腺病毒，呼吸道合胞病毒，柯萨奇病毒，抗O，类风湿因子，同型半胱氨酸，乙肝五项，梅毒，艾滋病，丙肝（3-5ml血量，不需要混匀）血清胱抑素，血清α-L-岩藻糖苷酶测定—————————————————`, color: 'red' },
    { text: `3.蓝色管：凝血四项，D-二聚体（2ml血量，需要混匀）—————————————————`, color: 'blue' },
  { text: `4.黄色塑料管：甲功五项，甲功七项，病毒八项，男女性肿瘤标志物测定，C肽，胰岛素测定，抗胰岛素抗体测定（外送艾迪康测定，3-5ml血量，不需要混匀）—————————————————`, color: 'yellow' },
  { text: `5.黑色管：血沉测定（1.6ml血量混匀），注意黑色管中间有一蓝色线，为抽血到达量！—————————————————`, color: 'black' },
  { text: `6.绿色塑料管：微量元素五项，微量元素六项（2ml血量混匀）━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`, color: 'green' },
]);
    }}
}
// 在Tampermonkey脚本管理菜单中添加自定义命令
GM_registerMenuCommand("📊 打开门诊辅助F8", () => {
  performActions()
});

// 在Tampermonkey脚本管理菜单中添加自定义命令
GM_registerMenuCommand("⚙️ 关闭门诊辅助", () => {
  document.querySelectorAll('#xmg-container').forEach(element => {
    element.remove();
});//删除;
});
GM_registerMenuCommand("⚠️ 一键新增", () => {
  document.getElementsByClassName('el-button el-button--text el-button--small')[0].click();//新建入院记录🩺📋⚙📋🔍📁📤🏥
  document.getElementsByClassName("el-button el-button--text el-button--small")[4].click()//新建首程记录
      document.getElementsByClassName("el-button el-button--text el-button--small")[17].click()//新建医患沟通;
});
GM_registerMenuCommand("✅ 查血用啥管F10", () => {
GM_addStyle(`
    .multi-alert {
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 15px;
        background: #f8f9fa;
        border-left: 4px solid #007bff;
        border-radius: 4px;
        box-shadow: 0 2px 8px rgba(0,0,0,0.1);
        z-index: 9999;
        animation: slideIn 0.3s ease-out;
      //不知道啥用word-wrap: break-word; /* 或 overflow-wrap: break-word; */
      //不知道啥用white-space: pre-wrap; /* 或 white-space: normal; */
       width:300px
    }
    .red { color: #dc3545; }
    .green { color: #28a745; }
    .blue { color: #007bff; }
.purple { color: #800080; }
.yellow{ color: #E6A23C; }
.pre-line { white-space: pre-line; }  /* 使\n生效‌:ml-citation{ref="3,5" data="citationList"} */

    @keyframes slideIn { from { opacity: 0; transform: translateX(100%); } }
`);

function showMultiColorAlert(contentArr) {
    const alertBox = document.createElement('div');
    alertBox.className = 'multi-alert';

    contentArr.forEach(item => {
        const span = document.createElement('span');
        span.className = item.color;
        span.textContent = item.text;
        alertBox.appendChild(span);
    });

    document.body.appendChild(alertBox);
    setTimeout(() => alertBox.remove(), 6000);
}
      //alertBox.remove()
        //return
    // 调用示例
showMultiColorAlert([
    { text: `1.紫色管：血常规,C反应蛋白，肺炎支原体，肺炎衣原体，糖化血红蛋白，心梗三项，BNP，降钙素原，血型（1-2ml血量，需要混匀)—————————————————大紫管：高血压四项（抽5ml）—————————————————`,color: 'purple'},
    { text: `2.红色管：小生化，大生化，肝功，肾功，血糖，血脂，尿酸，电解质，白介素6，腺病毒，呼吸道合胞病毒，柯萨奇病毒，抗O，类风湿因子，同型半胱氨酸，乙肝五项，梅毒，艾滋病，丙肝（3-5ml血量，不需要混匀）血清胱抑素，血清α-L-岩藻糖苷酶测定—————————————————`, color: 'red' },
    { text: `3.蓝色管：凝血四项，D-二聚体（2ml血量，需要混匀）—————————————————`, color: 'blue' },
  { text: `4.黄色塑料管：甲功五项，甲功七项，病毒八项，男女性肿瘤标志物测定，C肽，胰岛素测定，抗胰岛素抗体测定（外送艾迪康测定，3-5ml血量，不需要混匀）—————————————————`, color: 'yellow' },
  { text: `5.黑色管：血沉测定（1.6ml血量混匀），注意黑色管中间有一蓝色线，为抽血到达量！—————————————————`, color: 'black' },
  { text: `6.绿色塑料管：微量元素五项，微量元素六项（2ml血量混匀）━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`, color: 'green' },
]);
});




