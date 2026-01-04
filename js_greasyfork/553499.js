// ==UserScript==
// @name         极客湾手机SOC添加机型、置顶
// @namespace    http://tampermonkey.net/
// @version      1.0.1
// @description  极客湾SOC排行，添加机型方便参考（该机型仅作为搭载该SOC的一个参考，与UP跑分机型无关）。也可以自行添加备注。还能将多行SOC固定在屏幕上方便对比。
// @author       Jackxwb
// @match        https://www.socpk.com/cpu/*
// @match        https://www.socpk.com/allperf/*
// @match        https://www.socpk.com/gpu/*
// @match        https://www.socpk.com/cpueffcrank/*
// @match        https://www.socpk.com/geekbench6/*
// @match        https://www.socpk.com/geekbench5/*
// @match        https://www.socpk.com/gfx/*
// @match        https://www.socpk.com/3dmwle/*
// @icon         https://socpk.com/MAINPIC/favicon.ico
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/553499/%E6%9E%81%E5%AE%A2%E6%B9%BE%E6%89%8B%E6%9C%BASOC%E6%B7%BB%E5%8A%A0%E6%9C%BA%E5%9E%8B%E3%80%81%E7%BD%AE%E9%A1%B6.user.js
// @updateURL https://update.greasyfork.org/scripts/553499/%E6%9E%81%E5%AE%A2%E6%B9%BE%E6%89%8B%E6%9C%BASOC%E6%B7%BB%E5%8A%A0%E6%9C%BA%E5%9E%8B%E3%80%81%E7%BD%AE%E9%A1%B6.meta.js
// ==/UserScript==

(function() {
    'use strict';

    /*
1.空白数据数据可通过该方法获取

JSON.stringify(
    Object.fromEntries(
        Array.from(document.querySelectorAll("#mainForm tr")).map(item=>{
            let socName = item.querySelector(".socName").innerText;
            return [socName.toLowerCase(), ""]
        })
    )
)

2.已修改数据保存在 localStorage 可自行获取
let data = JSON.parse(localStorage.getItem("SocData"));
let buff = {};
Object.keys(data).sort().forEach(key => {
    buff[key] = data[key];
});
localStorage.getItem("SocData")

3.如果需要自己添加defSocData数据，请保证键的名称全部小写，不然无法匹配（原站就有大小写不一样的问题，所有这里统一小写）
4.初始数据量太多，匹配的机型使用了AI自动查询+人工修补缺失型号
 */
    let defSocData = {
        "": "(数据来源自AI+人工修补，仅供参考)",
        "8 gen2领先版(红魔)": "红魔 8S Pro(2023)",
        "a10": "iPhone 7 (2016), iPhone 7 Plus (2016), iPad (2018), iPad (2019),iPod touch 7(2019)",
        "a10x": "iPad Pro 10.5英寸 (2017), iPad Pro 12.9英寸第二代 (2017)",
        "a11": "iPhone 8 (2017), iPhone 8 Plus (2017), iPhone X (2017)",
        "a12": "iPhone XS (2018), iPhone XS Max (2018), iPhone XR (2018)",
        "a12 (ipad)": "iPad Air 第三代 (2019), iPad Mini 第五代 (2019), iPad 第八代 (2020)",
        "a12(ipad)": "iPad Air 第三代 (2019), iPad Mini 第五代 (2019), iPad 第八代 (2020)",
        "a12x": "iPad Pro 11英寸 (2018), iPad Pro 12.9英寸第三代 (2018)",
        "a12z": "iPad Pro 11英寸第二代 (2020), iPad Pro 12.9英寸第四代 (2020)",
        "a13": "iPhone 11 (2019), iPhone 11 Pro (2019), iPhone 11 Pro Max (2019), iPhone SE 第二代 (2020), iPad 第九代 (2021)",
        "a14": "iPhone 12 (2020), iPhone 12 Mini (2020), iPhone 12 Pro (2020), iPhone 12 Pro Max (2020)",
        "a14 (ipad)": "iPad Air 第四代 (2020), iPad 第十代 (2022)",
        "a14(ipad)": "iPad Air 第四代 (2020), iPad 第十代 (2022)",
        "a15": "iPhone 13 (2021), iPhone SE 第三代 (2022), iPad Mini 第六代 (2021), iPhone 14 (2022), iPhone 14 Plus (2022)",
        "a15 (4gpu)": "iPhone 13 (2021), iPhone 13 Mini (2021), iPhone SE 第三代 (2022)",
        "a15 (5gpu)": "iPhone 13 Pro (2021), iPhone 13 Pro Max (2021), iPad Mini 第六代 (2021), iPhone 14 (2022), iPhone 14 Plus (2022)",
        "a15 (iphone 13 pm)": "iPhone 13 Pro Max (2021)",
        "a15 (iphone 13)": "iPhone 13 (2021)",
        "a16": "iPhone 14 Pro (2022), iPhone 14 Pro Max (2022), iPhone 15 (2023), iPhone 15 Plus (2023)",
        "a17 pro": "iPhone 15 Pro (2023), iPhone 15 Pro Max (2023)",
        "a18": "iPhone 16 (2024), iPhone 16 Plus (2024)",
        "a18 pro": "iPhone 16 Pro (2024), iPhone 16 Pro Max (2024)",
        "a19": "iPhone 17 (2025), iPhone Air (2025)",
        "a19 pro": "iPhone 17 Pro (2025)",
        "a7": "iPhone 5S (2013), iPad Air (2013), iPad Mini 2 (2013), iPad Mini 3 (2014)",
        "a8": "iPhone 6 (2014), iPhone 6 Plus (2014), iPad Air 2 (2014), iPad Mini 4 (2015),iPod touch 6(2015)",
        "a9": "iPhone 6S (2015), iPhone 6S Plus (2015), iPhone SE (2016), iPad (2017)",
        "bcm2711 (2ghz)": "树莓派4B (2019)",
        "bcm2711(2ghz)": "树莓派4B (2019)",
        "bcm2711(树莓派4b)": "树莓派4B (2019)",
        "bcm2711(超频750mhz)": "树莓派4B (2019)",
        "exynos 1080": "vivo X60 (2021), vivo X60 Pro (2021), vivo X70 Pro (2021), vivo X70t (2021), vivo S15e (2022), vivo S16e (2022)",
        "exynos 2100": "三星Galaxy S21 (2021), 三星Galaxy S21+ (2021), 三星Galaxy S21 Ultra (2021)",
        "exynos 2200": "三星Galaxy S22 (2022), 三星Galaxy S22+ (2022), 三星Galaxy S22 Ultra (2022)",
        "exynos 2400": "三星Galaxy S24 (2024), 三星Galaxy S24+ (2024), 三星Galaxy S24 FE (2024), 三星Galaxy S25 FE (2025), 三星Galaxy Z Flip7 FE (2025)",
        "exynos 7420": "三星Galaxy S6 (2015), 三星Galaxy S6 Edge (2015), 三星Galaxy Note 5 (2015)",
        "exynos 8890": "三星Galaxy S7 (2016), 三星Galaxy S7 Edge (2016), 三星Galaxy Note 7 (2016)",
        "exynos 8895": "三星Galaxy S8 (2017), 三星Galaxy S8+ (2017), 三星Galaxy Note 8 (2017)",
        "exynos 980": "三星Galaxy A51 5G (2020), 三星Galaxy A71 5G (2020), vivo S6 5G (2020), vivo X30(2019),vivo X30 Pro(2019)",
        "exynos 9810": "三星Galaxy S9 (2018), 三星Galaxy S9+ (2018), 三星Galaxy Note 9 (2018)",
        "exynos 9820": "三星Galaxy S10 (2019), 三星Galaxy S10+ (2019), 三星Galaxy S10e (2019), 三星Galaxy Note 10 (2019)",
        "exynos 990": "三星Galaxy S20 (2020), 三星Galaxy S20+ (2020), 三星Galaxy S20 Ultra (2020), 三星Galaxy Note 20 (2020)",
        "m1 (ipad air)": "iPad Air 第五代 (2022)",
        "m1 (ipad pro)": "iPad Pro 11英寸第四代 (2022), iPad Pro 12.9英寸第六代 (2022)",
        "m2 (ipad pro)": "iPad Pro 11英寸第四代 (2022), iPad Pro 12.9英寸第六代 (2022)",
        "m4 (3+6)": "iPad Pro 11英寸 (2024)",
        "m4 (4+6)": "iPad Pro 12.9英寸 (2024)",
        "m4(3+6)": "iPad Pro 11英寸 (2024)",
        "m4(4+6)": "iPad Pro 12.9英寸 (2024)",
        "s922x": "Odroid N2 (2019), Beelink GT King (2019), Ugoos AM6 (2019), Amazon Fire TV Cube (2019)",
        "tegra k1(32bit)": "NVIDIA Shield Tablet (2014), Acer Chromebook 13 (2014), Google Project Tango Tablet (2014)",
        "tegra k1(64bit)": "NVIDIA Shield Tablet (2014), Acer Chromebook 13 (2014), Google Project Tango Tablet (2014)",
        "tegra x1": "NVIDIA Shield TV (2015), Google Pixel C (2015)",
        "tegra x1(ns底座)": "Nintendo Switch (2017)",
        "tegra x1(ns掌机)": "Nintendo Switch (2017)",
        "tensor": "Google Pixel 6 (2021), Google Pixel 6 Pro (2021), Google Pixel 6a (2022)",
        "tensor g3": "Google Pixel 8 (2023), Google Pixel 8 Pro (2023), Google Pixel 8a (2024)",
        "tensor g4": "Google Pixel 9 (2024), Google Pixel 9 Pro (2024), Google Pixel 9 Pro XL (2024)",
        "天玑 1000+": "OPPO Reno5 Pro 5G (2020)",
        "天玑 1000l": "OPPO Reno3 5G (2019)",
        "天玑 1080": "小米Redmi Note 12 Pro (2022)",
        "天玑 1100": "vivo S9 (2021)",
        "天玑 1200": "一加Nord 2 (2021), realme 真我GT Neo 2 (2021)",
        "天玑 1200(8050)": "realme 真我GT Neo Flash (2021)",
        "天玑 700": "realme 真我8 5G (2021), OPPO A53s 5G (2021)",
        "天玑 700(6020)": "realme 真我V3 5G (2020)",
        "天玑 720": "realme 真我V5 5G (2020)",
        "天玑 7200 ultra": "小米Redmi Note 13(2023)",
        "天玑 7200ultra": "小米Redmi Note 13 Pro (2023)",
        "天玑 800": "OPPO Reno4 SE (2020)",
        "天玑 800u": "realme 真我Q2 5G (2020)",
        "天玑 810": "realme 真我8s 5G (2021)",
        "天玑 810(6080)": "realme 真我8s 5G (2021)",
        "天玑 8100": "一加10R (2022), realme 真我GT Neo 3 (2022)",
        "天玑 820": "小米Redmi 10X 5G (2020)",
        "天玑 8200": "iQOO Neo 7 SE (2022)",
        "天玑 8300 ultra": "小米Poco X6 Pro (2024), 小米Redmi K70E (2023)",
        "天玑 8300ultra": "小米Poco X6 Pro (2024), 小米Redmi K70E (2023)",
        "天玑 8400-max": "小米Redmi K80 (2025)",
        "天玑 9000": "OPPO Find N2 Flip (2022), vivo X80 (2022)",
        "天玑 9000+": "iQOO Neo 7(2022),iQOO Pad(2023)",
        "天玑 920": "realme 真我9 Pro+ (2022)",
        "天玑 9200": "vivo X90 Pro+ (2022)",
        "天玑 9200+": "OPPO Find N3 Flip (2023)",
        "天玑 9300": "OPPO Find X7 (2024), vivo X100 (2023)",
        "天玑 9300+": "三星Galaxy Tab S10系列 (2024)",
        "天玑 9400": "vivo X200 (2024), iQOO Neo10 Pro (2024)",
        "天玑 9500": "OPPO Find X9 (2025), vivo X300 (2025)",
        "展锐 sc9863a": "Nokia C21 Plus (2022), Alcatel 1L Pro (2021)",
        "展锐 t606": "Tecno Spark 8C (2022), Nokia G11 (2022)",
        "展锐 t610": "荣耀Play5T(2021),realme C21Y (2021), Nokia T20 (2021)",
        "展锐 t616": "酷派炫影30 Pro(2025)",
        "展锐 t618": "Hisense A6L (2020)",
        "展锐 t740": "虎贲T7510, 海信 F50+(2020)， 海信心意 T50(2020)",
        "展锐 t760": "努比亚小牛(2024), HMD Crest 5G(2024)",
        "展锐 t765": "展锐T8200 Flyme特调满血版, 魅族Note16(2025)",
        "展锐 t770": "唐古拉T770, 中国电信 天翼一号2022款(2022)",
        "展锐 t820": "努比亚NEO 5G(2023), 安伯尼克RG Cube游戏掌机(2024)",
        "展锐 t8200": "魅族Note16(2025)",
        "微软 sq1": "Microsoft Surface Pro X (2019)",
        "微软sq1": "Microsoft Surface Pro X (2019)",
        "曦力 85": "小米Redmi Note 9 (2020), Infinix Note 8 (2020)",
        "曦力 99": "Infinix Note 12 Pro (2022)",
        "曦力 g80": "realme Narzo 20 (2020), Infinix Note 8 (2020)",
        "曦力 g85": "小米Redmi Note 9 (2020)",
        "曦力 g90t": "小米Redmi Note 8 Pro (2019)",
        "曦力 g99": "Infinix Note 12 Pro (2022)",
        "曦力 p35": "OPPO A5s (2019)",
        "曦力 p60": "OPPO F9 (2018)",
        "曦力 p70": "realme U1 (2018)",
        "曦力 p90": "OPPO Reno Z (2019)",
        "曦力 x20": "Meizu MX6 (2016)",
        "曦力 x30": "Meizu Pro 7 Plus (2017)",
        "澎湃 s1": "小米Mi 5C (2017)",
        "澎湃s1": "小米Mi 5C (2017)",
        "玄戒 o1": "小米15S Pro(2025), 小米平板7Ultra(2025)",
        "迅鲲 1300t": "荣耀Tablet V7 Pro (2021), Lenovo Tab P12 Pro (2021)",
        "骁龙 4 gen1": "三星Galaxy A14 5G (2023), iQOO Z6 Lite (2022)",
        "骁龙 4 gen2": "Nokia G42 (2023), 小米Redmi 12 5G (2023)",
        "骁龙 430": "小米Redmi 4A (2016), Moto E4 (2017)",
        "骁龙 439": "小米Redmi 7A (2019), vivo Y91 (2019)",
        "骁龙 480": "Moto G50 (2021), Nokia XR20 (2021)",
        "骁龙 6 gen1": "Moto G Stylus 5G (2023), 荣耀X50 (2023)",
        "骁龙 625": "小米Redmi Note 4 (2016), Moto G5 Plus (2017)",
        "骁龙 636": "小米Redmi Note 5 (2018), Moto Z3 Play (2018)",
        "骁龙 660": "小米Redmi Note 7 (2019), vivo X21 (2018)",
        "骁龙 662": "Moto G30 (2021), realme 7i (2020)",
        "骁龙 665": "小米Redmi Note 8 (2019), vivo S1 Pro (2019)",
        "骁龙 675": "小米Redmi Note 7 Pro (2019), vivo U20 (2019)",
        "骁龙 680": "小米Redmi Note 11 (2021), vivo Y21T (2022)",
        "骁龙 695": "Moto G Stylus 5G (2022), realme 9 Pro+ (2022)",
        "骁龙 7 gen1": "一加Nord CE 3 Lite (2023), realme 真我GT Neo 3T (2022)",
        "骁龙 7+ gen2": "realme 真我GT Neo 5 SE (2023), 小米Poco F5 (2023)",
        "骁龙 7+ gen3": "一加Ace 3V (2024), realme 真我GT Neo 6 SE (2024)",
        "骁龙 710": "OPPO Reno (2019), vivo Z1 Pro (2019)",
        "骁龙 730g": "Google Pixel 4a (2020), 小米Redmi K30 (2019)",
        "骁龙 750g": "Moto G 5G (2020), 三星Galaxy A42 5G (2020)",
        "骁龙 765g": "Google Pixel 4a 5G (2020), 一加Nord (2020)",
        "骁龙 768g": "Redmi K30 5G极速版(2020)",
        "骁龙 778g": "三星Galaxy A52s (2021), 荣耀50 (2021)",
        "骁龙 780g": "小米Mi 11 Lite 5G NE (2021)",
        "骁龙 782g": "荣耀50 Lite (2021)",
        "骁龙 7s gen2": "realme 12 Pro (2024), 三星Galaxy A55 (2024)",
        "骁龙 8 elite": "骁龙8至尊版, 三星Galaxy S25 Ultra (2025), 一加13 (2025), 小米15 (2025)",
        "骁龙 8 elite gen5": "一加15 (2025), 三星Galaxy S25 (2025), 小米15 (2025)",
        "骁龙 8 gen1": "三星Galaxy S22 (2022), 一加10 Pro (2022), 小米12 (2022)",
        "骁龙 8 gen2": "三星Galaxy S23 (2023), 一加11 (2023), 小米13 (2023)",
        "骁龙 8 gen3": "三星Galaxy S24 (2024), 一加12 (2024), 小米14 (2024)",
        "骁龙 8+ gen1": "一加10T (2022), realme 真我GT2 Master Explorer (2022)",
        "骁龙 805": "三星Galaxy Note 4 (2014), Moto Maxx (2014)",
        "骁龙 808": "LG G4 (2015), Microsoft Lumia 950 (2015)",
        "骁龙 810": "LG G Flex 2 (2015), 一加2 (2015)",
        "骁龙 820": "三星Galaxy S7 (2016), LG G5 (2016)",
        "骁龙 821": "Google Pixel (2016), 一加3T (2016)",
        "骁龙 835": "三星Galaxy S8 (2017), Google Pixel 2 (2017)",
        "骁龙 845": "三星Galaxy S9 (2018), 一加6 (2018)",
        "骁龙 855": "三星Galaxy S10 (2019), 一加7 (2019)",
        "骁龙 855+": "一加7T (2019), Asus ROG Phone 2 (2019)",
        "骁龙 860": "小米Poco X3 Pro (2021)",
        "骁龙 865": "三星Galaxy S20 (2020), 一加8 (2020)",
        "骁龙 865+": "Asus ROG Phone 3 (2020), 三星Galaxy Note 20 Ultra (2020)",
        "骁龙 870": "小米Poco F3 (2021), Moto G100 (2021)",
        "骁龙 888": "一加9 (2021), 小米Mi 11 (2021)",
        "骁龙 888+": "Asus ROG Phone 5s (2021), 荣耀Magic 3 (2021)",
        "骁龙 8s gen3": "小米Poco F6 Pro (2024), 小米Civi 4 Pro (2024)",
        "麒麟 710f": "荣耀9X Lite (2020), 华为P30 Lite New Edition (2020)",
        "麒麟 8000": "华为Nova 12 (2023), 华为Nova 12 Pro (2023)",
        "麒麟 810": "华为Nova 5 (2019), 荣耀9X (2019)",
        "麒麟 820": "荣耀30S (2020)",
        "麒麟 9000": "华为Mate 40 Pro (2020)",
        "麒麟 9000e": "华为Mate 40 (2020)",
        "麒麟 9000s": "华为Mate 60 Pro (2023)",
        "麒麟 9000sl": "华为Nova 12 Pro (2023)",
        "麒麟 9000wl": "华为MatePad Pro 13.2 (2023)",
        "麒麟 9000wm": "华为MatePad Pro 13.2 (2023)",
        "麒麟 9010": "华为Pura 70 Ultra (2024)",
        "麒麟 9020": "华为Pura 80 (2025), 华为Mate 70 (2025), 华为Mate X6 (2025)",
        "麒麟 950": "华为Mate 8 (2015)",
        "麒麟 960": "华为P10 (2017), 华为Mate 9 (2016)",
        "麒麟 970": "华为P20 Pro (2018), 华为Mate 10 Pro (2017)",
        "麒麟 980": "华为P30 Pro (2019), 华为Mate 20 Pro (2018)",
        "麒麟 985": "荣耀30 (2020)",
        "麒麟 990": "华为Mate30(2019)",
        "麒麟 990 5g": "华为P40 Pro (2020), 华为Mate 30 Pro (2019)"
    };

    // 右边渲染标签宽度，可自行调整
    const viewWidth = "20rem";

    function init() {
        let caption = document.getElementById("caption");

        let span = document.createElement("span");
        span.innerHTML = "隐藏";
        span.id = "edit_button";
        span.style.border = "1px dashed";
        span.style.userSelect="none";
        span.onclick = function() {
            if(this.innerHTML == "编辑") {
                document.querySelectorAll(".phoneMark").forEach(item=>{
                    item.style.display = "table-cell";
                })
                this.innerHTML = "隐藏";
            } else {
                document.querySelectorAll(".phoneMark").forEach(item=>{
                    item.style.display = "none";
                })
                this.innerHTML = "编辑";
            }
            // 重新计算高度
            let tableHeight = document.getElementById("mainForm").getBoundingClientRect().height + 100;
            document.querySelectorAll(".ratioLineHeight").forEach(item=>{
                item.style.height = tableHeight + "px";
            })
        }
        // Debug 模式
        //initSocData(true)

        if(caption) {
            caption.insertBefore(span, caption.firstChild);
        }
        initTable();
        setTimeout(()=>{
            span.click();
        }, 100);
    }
    init();

    // 初始化数据
    function initSocData(force=false){
        let SocData = localStorage.getItem("SocData");
        if(!SocData || force){
            localStorage.removeItem("SocData");
            localStorage.setItem("SocData", JSON.stringify(defSocData));
        }
    }
    // 获取所有数据
    function getSocData(){
        let SocData = localStorage.getItem("SocData");
        if(!SocData || SocData.trim() === ""){
            initSocData();
            SocData = localStorage.getItem("SocData");
        }
        return JSON.parse(SocData);
    }
    // 记录自己的数据
    function MarkSocPhone(socName, phones){
        let SocData = getSocData();
        socName = socName.trim().toLowerCase();
        if(!SocData[socName]){
            SocData[socName] = [];
        }
        SocData[socName] = phones;
        localStorage.setItem("SocData", JSON.stringify(SocData));
    }

    // 固定/取消固定 行
    function RecalculateTopItem(){
        let allTr = document.querySelectorAll("#mainForm tr");
        let height = 0;
        let buff = [];
        allTr.forEach(item=>{
            let btn = item.querySelector(".phoneTopBtn")
            if(btn?.innerText === "取消固定"){
                buff.push(item);
            }else{
                item.style.position = "table-row";
                item.style.backgroundColor = "none";
                item.style.removeProperty("z-index");
                item.style.removeProperty("background-color");
            }
        })
        buff.forEach(item=>{
            item.style.position = "sticky";
            item.style.top = height + "px";
            //item.style.bottom = "0px";
            height += item.getBoundingClientRect().height;
            item.style.backgroundColor = "#000";
            item.style.zIndex = "100";
        })
        height = 0;
        buff.reverse().forEach(item=>{
            item.style.bottom = height + "px";
            height += item.getBoundingClientRect().height;
        })
    }

    // 刷新显示自定义数据
    function RefreshMark(){
        let allTr = document.querySelectorAll("#mainForm tr");
        let SocData = getSocData();

        allTr.forEach(item=>{
            let socName = item.querySelector(".socName").innerText;
            socName = socName.trim().toLowerCase();
            let phoneMarkView = item.querySelector(".phoneMarkView");
            if(phoneMarkView){
                phoneMarkView.innerText = SocData[socName];
                phoneMarkView.title = SocData[socName];
            }
        })

    }

    // 初始化表格
    function initTable(){
        let allTr = document.querySelectorAll("#mainForm tr");
        let SocData = getSocData();

        for(let i = 0; i < allTr.length; i++){
            let line = allTr[i];
            let socName = line.querySelector(".socName").innerText;
            let phoneMark = line.querySelector(".phoneMark");

            socName = socName.trim().toLowerCase();

            if(!SocData[socName]){
                MarkSocPhone(socName, "");
            }

            if(!phoneMark){
                let phoneMarkEle = document.createElement("td");
                phoneMarkEle.classList.add("phoneMark");
                phoneMarkEle.style.width = "10rem";
                let text = document.createElement("input");
                text.type = "text";
                text.value = SocData[socName];
                text.onchange = function(){
                    MarkSocPhone(socName, this.value);
                    RefreshMark();
                }
                phoneMarkEle.appendChild(text);

                if(socName === ""){
                    // 第一行
                    let btn = document.createElement("button");
                    btn.classList.add("resetDataBtn");
                    btn.innerText = "重置数据";
                    btn.onclick = function(){
                        initSocData(true);
                        //location.reload();
                        initTable();
                        RefreshMark();
                    }
                    phoneMarkEle.appendChild(btn);
                }else{
                    // 其他行
                    let btn = document.createElement("button");
                    btn.classList.add("phoneTopBtn");
                    btn.innerText = "固定";
                    btn.onclick = function(){
                        if(this.innerText==="固定"){
                            this.innerText = "取消固定";
                        }else{
                            this.innerText = "固定";
                        }
                        RecalculateTopItem();
                    }
                    phoneMarkEle.appendChild(btn);
                }
                line.insertBefore(phoneMarkEle, line.firstChild);

                let phoneMark = document.createElement("td");
                phoneMark.classList.add("phoneMarkView");
                phoneMark.innerHTML = SocData[socName];
                phoneMark.title = SocData[socName];// 鼠标悬停显示完整内容
                // 卡位置，第一行不隐藏占用宽度，后续的超出隐藏
                if(socName !== ""){
                    phoneMark.style.display = "block";
                }
                phoneMark.style.width = viewWidth;
                phoneMark.style.color = "#fff";
                //超出隐藏
                phoneMark.style.overflow = "hidden";
                phoneMark.style.textOverflow = "ellipsis";
                phoneMark.style.whiteSpace = "nowrap";
                line.appendChild(phoneMark);
            }else{
                phoneMark.querySelector("input").value = SocData[socName];
            }
        }
    }
})();