// ==UserScript==
// @name         乐天排行榜评价数量下载
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  乐天排行榜评价数量下载,可筛选低评价数量的。
// @author       Haiiro
// @license      Private Use Only
// @match        https://ranking.rakuten.co.jp/*
// @require      https://code.jquery.com/jquery-3.7.0.min.js
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_deleteValue
// @run-at       document-end
// @icon         https://www.google.com/s2/favicons?sz=64&domain=1688.com

// @downloadURL https://update.greasyfork.org/scripts/555832/%E4%B9%90%E5%A4%A9%E6%8E%92%E8%A1%8C%E6%A6%9C%E8%AF%84%E4%BB%B7%E6%95%B0%E9%87%8F%E4%B8%8B%E8%BD%BD.user.js
// @updateURL https://update.greasyfork.org/scripts/555832/%E4%B9%90%E5%A4%A9%E6%8E%92%E8%A1%8C%E6%A6%9C%E8%AF%84%E4%BB%B7%E6%95%B0%E9%87%8F%E4%B8%8B%E8%BD%BD.meta.js
// ==/UserScript==

(function() {
    // ============== 3. 新的初始化逻辑 ==============
    // isRead:是否读取，是的话，在页面载入后就开始读取排行榜信息了
    // pageIds:已经读取的页面id，防止重复读取。
    // data:实际要写入表格的数据
    // const defaultConfig = {"isRead":false,"minReview":0,"pageIds":[],"data":[]};

    // 每日 TTL 存储 key
    const DAILY_KEY = "dailyInit";
    const today = getToday();
    //GM_deleteValue(DAILY_KEY);
    let config = initConfigOncePerDay();




    window.addEventListener('load', function () {
        //console.log("🌐 页面完全加载（含图片/脚本），开始执行你的代码");
        tryReadAll()
        // 你的代码
    });

    function tryReadAll(){
        //console.log(config["isRead"]);
        if(config["isRead"]){
            let  data=readPageData()
            config["data"].push(...data);
            setConfig(config)
            let flag= nextPage()
            if(!flag){
                config["isRead"]=false
                setConfig(config)
                outFile()
            }
        }
    }
    function outFile(){
        let num = config["minReview"]

        let expData =[]
        if (num==-1){
            expData=config["data"]
        }else{
            expData = config["data"].filter(sub => sub[4] <= num);
        }

        if (!Array.isArray(expData) || expData.length === 0) {
            alert("没有符合条件的商品");
            return;
        }else{
            exportHtml(expData)
            expData.unshift(["排名","图片","标题","链接","评价数量"])
            exportCSV(expData)
        }
        clear()


    }
    function buttonClick(){
        let num= validateNumber("minReview")
        if (num!=null){
            config["minReview"]=num
            config["isRead"]=true
            setConfig(config)
            firstPage()

        }

    }

    // 返回 yyyy-mm-dd
    function getToday() {
        const d = new Date();
        return `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`;
    }


    // 每天自动初始化 + 自动清理
    function initConfigOncePerDay() {

        const record = GM_getValue(DAILY_KEY, null);

        // ============== 1. 已存在当天记录：直接使用 ==============
        if (record && record.date === today) {
            //console.log("✔ 今日数据有效，无需初始化:", record.config);
            return record.config;
        }

        // ============== 2. 存在但已过期（跨日）→ 自动清理 ==============
        if (record && record.date !== today) {
            //console.log("⚠ 数据已过期（跨日），自动删除旧数据");
            GM_deleteValue(DAILY_KEY);
        }

        // ============== 3. 新的初始化逻辑 ==============
        // isRead:是否读取，是的话，在页面载入后就开始读取排行榜信息了
        // pageIds:已经读取的页面id，防止重复读取。
        // data:实际要写入表格的数据
        const defaultConfig ={"isRead":false,"minReview":0,"pageIds":[],"data":[]};

        // 写入新的今天数据
        setConfig(defaultConfig)


        //console.log("🎉 今日首次初始化，写入配置：", defaultConfig);
        return defaultConfig;
    }

    function setConfig(config){
        // 写入新的今天数据
        GM_setValue(DAILY_KEY, {
            date: today,
            config: config
        });
    }



    function waitForElement(selector, callback) {
        const observer = new MutationObserver((mutations, obs) => {
            const element = document.querySelector(selector);
            if (element) {
                callback(element);
                obs.disconnect();
            }
        });
        observer.observe(document, {
            childList: true,
            subtree: true
        });
    }

    waitForElement('.rnkContentsTitle1st', function(element) {



        $(".rnkContentsTitle1st").after("<button id='nextPage' style='margin-top:5px;' >下载评价数量</button>")
        $("#nextPage").on("click",buttonClick)
        $(".rnkContentsTitle1st").after(`<input id="minReview" type="text" placeholder="筛选评价>=n" style="margin-right: 8px;width:90px" />`)










    });
    function validateNumber(inputId) {
        let input = document.getElementById(inputId);
        let value = input.value.trim();

        if (value === "") {
            // 没填，返回 -1
            return -1;
        }

        // 检查是否整数
        if (!/^\d+$/.test(value)) {
            alert("请输入合法整数！");
            return null;
        }

        // 输入合法，返回数字
        return parseInt(value, 10);
    }

    function clear(){
        // 每日 TTL 存储 key
        GM_deleteValue(DAILY_KEY);
        config = initConfigOncePerDay();
    }



    function readPageData(){
        let result=[]
        // 查找所有 .rnkRanking_top3box 元素
        $('.rnkRanking_top3box, .rnkRanking_after4box').each(function(index, box) {
            const $box = $(box); // 当前遍历的盒子

            // 查找 .rnkRanking_starBox > div > a 并获取文本
            const $a = $box.find('.rnkRanking_starBox > div > a');

            let review=0
            if ($a.length > 0) {
                const text = $a.text().trim();
                // 优先用正则精确提取括号内的数字部分（带逗号）
                const m = text.match(/\(([\d,]+)件\)/);

                review = parseInt(m[1].replace(/,/g, ''), 10);


            }
            let order = $box.find('div.rnkRanking_rank > div').eq(0).find('div').eq(0).text().replace("位","").trim();
            if (!order){
                order = $box.find('.rnkRanking_rank .rnkRanking_rankIcon>img').attr("alt").replace("位","").trim();
            }
            let image=$box.find('div.rnkRanking_image img').attr("src")

            let title=$box.find('div.rnkRanking_itemName>a').text()
            let url=$box.find('div.rnkRanking_itemName>a').attr('href');
            result.push([order,image,title,url,review])

        });
        return result


    }
    function firstPage(){

        let url = window.location.href;

        // 删除 /p= 后面的内容
        url = url.replace(/\/p=.*$/, '');
        window.location.href = url;
    }
    function nextPage(){
        const $nextSpan = $('div.pager > a > span').filter(function() {
            return $(this).text().trim() === '>';
        });

        // 找到后，可以获取它的父 <a> 的 href
        if ($nextSpan.length > 0) {
            const href = $nextSpan.parent('a').attr('href');
            if (href) {
                //console.log('跳转到：', href);
                window.location.href = href;
                return true
            }

        } else {
            return null;
        }}

    /**
 * 将二维数组导出为 CSV 文件并自动下载
 * @param {Array<Array>} arr - 二维数组，每个子数组是一行
 * @param {string} filename - 可选，默认 "data.csv"
 */
    function exportCSV(arr, filename = "排行榜评价数量.csv") {
        if (!Array.isArray(arr) || arr.length === 0) {
            console.error("数组不能为空或非数组类型");
            return;
        }

        // 将二维数组转换成 CSV 字符串，处理双引号转义
        const csvContent = arr.map(row =>
                                   row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(",")
                                  ).join("\r\n");

        // 创建 Blob 对象
        const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });

        // 创建下载链接
        const link = document.createElement("a");
        const url = URL.createObjectURL(blob);
        link.href = url;
        link.download = filename;

        // 触发下载
        document.body.appendChild(link);
        link.click();

        // 清理
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    }



    function exportHtml(arr, filename = "排行榜评价数量.html") {
        if (!Array.isArray(arr) || arr.length === 0) {
            console.error("数组不能为空或非数组类型");
            return;
        }

        // 将二维数组转换成 CSV 字符串，处理双引号转义
        const  htmlContent = arr.map(row => `

        <div class="row" style="display: flex;width:800px">
       <div class="cell" >${row[0]}</div>
    <div class="cell"><a href="${row[3]}">
		<img src="${row[1]}"></a>
	</div>
    <div class="cell">
		<a href="${row[3]}">${row[2]}</a>

	</div>
    <div class="cell">${row[4]}</div>

    </div>`).join("\r\n");
       
        const htmlText=`
<div class="row" style="display: flex;width:800px;">
       <div class="cell" >排名</div>
    <div class="cell">图片</div>
    <div class="cell">标题</div>
    <div class="cell">评价数</div> </div>
    ${htmlContent}
<style>


.cell {
    flex: 1;                 /* 四个格子等宽 */
    padding: 10px;           /* 内边距，可调整 */
    border: 1px solid #ccc;  /* 可选边框，方便调试 */

    display: flex;           /* flex 布局 */
    align-items: center;     /* 垂直居中 */
    justify-content: flex-start; /* 左对齐 */

    min-height: 50px;        /* 高度可根据需要调整 */
}
</style>


        `

        // 创建 Blob 对象
        const blob = new Blob([htmlText], { type: "text/html;charset=utf-8;" });

        // 创建下载链接
        const link = document.createElement("a");
        const url = URL.createObjectURL(blob);
        link.href = url;
        link.download = filename;

        // 触发下载
        document.body.appendChild(link);
        link.click();

        // 清理
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    }

})();
