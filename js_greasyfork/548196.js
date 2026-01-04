// ==UserScript==
// @name         自定义保存和读取方法
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  智邦领料脚本
// @author       You
// @match        http://118.31.43.2:6088/*
// @license            MIT
// @include *://118.31.43.2:6088/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/548196/%E8%87%AA%E5%AE%9A%E4%B9%89%E4%BF%9D%E5%AD%98%E5%92%8C%E8%AF%BB%E5%8F%96%E6%96%B9%E6%B3%95.user.js
// @updateURL https://update.greasyfork.org/scripts/548196/%E8%87%AA%E5%AE%9A%E4%B9%89%E4%BF%9D%E5%AD%98%E5%92%8C%E8%AF%BB%E5%8F%96%E6%96%B9%E6%B3%95.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 委外领料单信息保存
    window.wwbaocun = function() {
        if(localStorage.getItem("wwProductInfo")){
            localStorage.removeItem("wwProductInfo")
        }
        let processID = document.querySelector("td.lvw_cell.rep.lvw_readonlycell[dbcolindex='11'][islvw='1'][realindex='2'][align='Center'][uitype='none'][lvw_id='wwcpDataList'][dbname='wwcpDataList_productOrder_0_11']").innerHTML;
        let processNum = document.querySelector("td.lvw_cell.rep[dbcolindex='19'][islvw='1'][realindex='7'][align='center'][uitype='numberbox'][lvw_id='wwcpDataList'][dbname='wwcpDataList_num1_0_19']>span").innerHTML;
        processNum = Number(processNum)
        let outwardOrderID = document.querySelector("div.sub-field.gray.f_autosnbox.readonly[uitype='autosnbox'][dbname='sn']>span").innerHTML;
        let outwardPrcessProduct = document.querySelector("td[dbname='wwcpDataList_productName_0_9']").textContent.trim();
        let processProduct = document.querySelector("td[dbname='urllink31']>div").nextElementSibling.innerHTML;
        let orderProductName1 = document.querySelector("div.sub-field.gray.f_textbox.readonly[dbname='@wwcpDataList_sysIcusIInheritIdIidI5858_0_67'] span.billfieldreadonlymodecont").innerHTML;
        console.log("委外单流水号"+outwardOrderID," 委外产品名称："+outwardPrcessProduct," 委外产品编号："+processID)
        console.log("加工数量："+processNum+" 外加工单位："+processProduct+" 开单名称："+orderProductName1);
        let wwProductInfo = {
            outwardOrderID:outwardOrderID,//委外单流水号
            outwardPrcessProduct:outwardPrcessProduct,//委外产品名称
            processID:processID,//委外产品编号
            processNum:processNum,//加工数量
            processProduct:processProduct,//外加工单位
            orderProductName1:orderProductName1//开单名称
        };
        localStorage.setItem("wwProductInfo",JSON.stringify(wwProductInfo))


    };

    // 委外领料单信息读取
    window.wwduqu = function() {
        let wwProductInfo = JSON.parse(localStorage.getItem("wwProductInfo"));
        if(wwProductInfo){
            document.getElementById('!B__SysCusmf_0_62001_6164_0_0').value = wwProductInfo.outwardOrderID;
            document.getElementById('!B__SysCusmf_0_62001_6163_0_0').value = wwProductInfo.outwardPrcessProduct;
            document.getElementById('!B__SysCusmf_0_62001_512_0_0').value = wwProductInfo.processID;
            document.getElementById('!B__SysCusmf_0_62001_513_0_0').value = wwProductInfo.processNum;
            document.getElementById('!B__SysCusmf_0_62001_515_0_0').value = wwProductInfo.processProduct;
            document.getElementById('!B__SysCusmf_0_62001_514_0_0').value = wwProductInfo.orderProductName1;
            localStorage.removeItem("wwProductInfo")
        }
    };

    window.llbaocun = function(){
        if( localStorage.getItem("llInfo")){
            localStorage.removeItem("llInfo")
        }
        let pickingListId = document.querySelector("div.sub-field.gray.f_textbox.readonly[dbname='WABH'] span.billfieldreadonlymodecont").innerHTML;
        let productId = document.querySelector("div.sub-field.gray.f_textbox.readonly[dbname='probh'] span.billfieldreadonlymodecont").innerHTML;
        let orderNum = document.querySelector("div.sub-field.gray.f_numberbox.readonly[dbname='NumMake'] span.billfieldreadonlymodecont").innerHTML;
        let orderName1 = document.querySelector("td[dbname='@sys_mforlist_InheritId_id_5858'] div.sub-field.gray.f_textbox.readonly span.billfieldreadonlymodecont").innerHTML;
        orderNum = Number(orderNum);
        console.log("派工单流水号"+pickingListId,"派工件编号"+productId,"加工数量"+orderNum,"开单名称"+orderName1);
        let llInfo = {
            pickingListId:pickingListId,//派工单流水号
            productId:productId,//派工件编号
            orderNum:orderNum,//加工数量
            orderName1:orderName1//开单名称
        }
        localStorage.setItem("llInfo",JSON.stringify(llInfo));
    }


    window.llduqu = function(){
        let llInfo = JSON.parse(localStorage.getItem("llInfo"));
        if(llInfo){
            document.getElementById('!B__SysCusmf_0_62001_6164_0_0').value = llInfo.pickingListId;
            document.getElementById('!B__SysCusmf_0_62001_512_0_0').value = llInfo.productId;
            document.getElementById('!B__SysCusmf_0_62001_513_0_0').value = llInfo.orderNum;
            document.getElementById('!B__SysCusmf_0_62001_514_0_0').value = llInfo.orderName1;
            localStorage.removeItem("llInfo")
        }
    }
    console.log('自定义脚本已加载已可用');
    console.log('脚本包括内容：领料单、委外领料单')
})();