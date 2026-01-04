// ==UserScript==
// @name         豆瓣租房助手 Enhanced
// @namespace    tornado404
// @version      0.6
// @description  豆瓣租房小组智能助手 - 基于mscststs原版优化升级，新增过滤功能、智能分类、自定义标签、用户黑名单等
// @author       tornado404 (基于mscststs原版改进)
// @license      ISC
// @match        https://www.douban.com/group/*
// @grant        none
+// @require      https://code.jquery.com/jquery-3.6.0.min.js
+// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/549108/%E8%B1%86%E7%93%A3%E7%A7%9F%E6%88%BF%E5%8A%A9%E6%89%8B%20Enhanced.user.js
// @updateURL https://update.greasyfork.org/scripts/549108/%E8%B1%86%E7%93%A3%E7%A7%9F%E6%88%BF%E5%8A%A9%E6%89%8B%20Enhanced.meta.js
// ==/UserScript==
 

(function() {
    'use strict';
    
    // ==================== 样式定义区域 ====================
    // 定义所有功能相关的CSS样式，包括高亮、标签、过滤等视觉效果
    // 直接使用原生 DOM 注入样式，避免在 jQuery 未准备好时调用 $ 导致报错
    (function injectStyles(){
        const css = `

 /*禁止侧边滚动*/
 #wrapper .aside{
 position:static !important;

 }

 #group-topics td{
    border-color:#000 !important;
}
#content tr>td:nth-child(4){
    padding-right:5px;
}
#content tr>td:nth-child(1){
    padding-left:5px;
}
/*高亮*/
.msc_highlight td{
    background-color:#fff855;
}
.msc_special td{
    background-color:#7cff7ead;
}
/*灰化*/
.msc_gray td,
.msc_gray a{
    background-color:#fff;
    color:#bbb !important;
}
.msc_useless td,
.msc_useless a{
    background-color:#504e4e;
    color:#ddd !important;
}

/*押一*/
.msc_yayi{
    box-shadow: -1px 0 0px 0px #fff  , -7px 0 0px 0px #3cbe31  ;
}
/*转租*/
.msc_zhuanzu{
    position:absolute;
    width:40px;
    height:22px;
    left:-690px;
    top:3px;
    z-index:100;
    background-color:#ff4265;
    color:#fff;
    padding:3px;
    font-size:16px;
    text-align:center;
    box-shadow:3px 3px 0 0 rgba(0,0,0,0.4);
}
/*直租*/
.msc_zhizu{
    position:absolute;
    width:40px;
    height:22px;
    left:-690px;
    top:3px;
    z-index:100;
    background-color:#b679f4;
    color:#fff;
    padding:3px;
    font-size:16px;
    text-align:center;
    box-shadow:3px 3px 0 0 rgba(0,0,0,0.4);
}
/*标签*/
.msc_tag{
    position:absolute;
    left:20px;
    width:40px;
    height:22px;
    background-color:#696;
    color:#fff;
    padding:3px;
    font-size:16px;
    text-align:center;
    box-shadow:3px 3px 0 0 rgba(0,0,0,0.4);
    z-index:100000;
}

#msc_tag_ctr{
    width:300px;
    left:0;
    resize: vertical;
}

/* 屏蔽按钮样式 */
.msc_block_btn{
    background-color: #ff4444;
    color: white;
    border: none;
    padding: 2px 6px;
    font-size: 12px;
    cursor: pointer;
    border-radius: 3px;
    margin: 2px;
}

.msc_block_btn:hover{
    background-color: #cc0000;
}

/* 已屏蔽帖子样式 */
.msc_blocked{
    opacity: 0.3;
    background-color: #f0f0f0 !important;
}

.msc_blocked td{
    background-color: #f0f0f0 !important;
    color: #999 !important;
}

/* 黑名单管理界面样式 */
.msc_blacklist_item{
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 5px;
    margin: 2px 0;
    background-color: #f5f5f5;
    border-radius: 3px;
}

.msc_remove_btn{
    background-color: #ff6666;
    color: white;
    border: none;
    padding: 2px 8px;
    font-size: 11px;
    cursor: pointer;
    border-radius: 2px;
}

.msc_remove_btn:hover{
    background-color: #ff4444;
}`;
        const style = document.createElement('style');
        style.type = 'text/css';
        style.textContent = css;
        (document.head || document.documentElement).appendChild(style);
    })();

    // 等待 jQuery 可用
    function waitForjQuery(cb){
        if (window.jQuery) return cb();
        const start = Date.now();
        const iv = setInterval(()=>{
            if (window.jQuery){
                clearInterval(iv);
                cb();
            } else if (Date.now() - start > 10000){ // 最多等待 10 秒
                clearInterval(iv);
                console.warn('[豆瓣租房助手] 未检测到 jQuery，部分功能可能不可用');
                cb(); // 尝试继续执行（以防页面已自行注入 jQuery 的其它别名）
            }
        }, 50);
    }

    // 简单的事件绑定助手，兼容旧版 jQuery 和原生 DOM
    function bindClick(el, handler){
        try{
            if (el && typeof el.on === 'function') { el.on('click', handler); return; }
            if (el && typeof el.click === 'function') { el.click(handler); return; }
            const node = (el && el[0]) ? el[0] : el;
            if (node && node.addEventListener) { node.addEventListener('click', handler); return; }
        }catch(e){ /* ignore */ }
    }
$(()=>{
    // ==================== 用户界面初始化 ====================
    
    // 【原版功能】高亮关键字管理界面
    // 用户可以输入自定义关键字，匹配的帖子会显示对应标签
    $(".aside").append(`<br>关键字管理，逗号分隔，刷新后生效(最好是两个字)<br><textarea id="msc_tag_ctr"></textarea>`);
    $("#msc_tag_ctr").val(localStorage["tags"]);
    document.querySelector("#msc_tag_ctr").addEventListener("input",function(e){
        localStorage["tags"] = e.target.value
    })

    // 【新增功能】过滤关键字管理界面
    // 用户可以输入不想看到的关键字，匹配的帖子会被自动隐藏
    $(".aside").append(`<br><br>过滤关键字管理，逗号分隔，刷新后生效(最好是两个字)<br><textarea id="msc_filter_ctr"></textarea>`);
    $("#msc_filter_ctr").val(localStorage["filter_tags"]);
    document.querySelector("#msc_filter_ctr").addEventListener("input",function(e){
        localStorage["filter_tags"] = e.target.value
    })

    // ==================== 数据处理区域 ====================
    
    // 【原版功能】读取用户自定义的高亮关键字
    // 从localStorage中读取并处理用户输入的关键字，支持多种分隔符
    let tagstr = localStorage["tags"]||"";
    let tags = tagstr.replace(/(\.)|(\n)|(\s)|(，)|(。)|(，)/,",").split(",").filter(v=>v.length);

    // 【新增功能】读取用户自定义的过滤关键字
    // 从localStorage中读取过滤关键字，匹配的帖子将被隐藏
    let filter_str = localStorage["filter_tags"]||"";
    let filter_tags = filter_str.replace(/(\.)|(\n)|(\s)|(，)|(。)|(，)/,",").split(",").filter(v=>v.length);

    // 【新增功能】黑名单数据管理
    // 仅保留标题黑名单；用户黑名单已移除
    const user_blacklist = []; // 用户黑名单已移除
    let title_blacklist = JSON.parse(localStorage["title_blacklist"] || "[]");

    // 【新增功能】用户黑名单管理界面
    // 用户黑名单管理已移除，仅保留标题黑名单
    
    // 【新增功能】标题黑名单管理界面
    $(".aside").append(`<br><br><strong>标题黑名单管理，刷新后生效</strong><br><div id="msc_title_blacklist"></div>`);
    
    // 初始化黑名单显示
    updateBlacklistDisplay();

    // 黑名单管理函数
    // 用户黑名单功能已移除
    function addToUserBlacklist() { /* no-op: 用户黑名单已移除 */ }

    function addToTitleBlacklist(title) {
        if (!title_blacklist.includes(title)) {
            title_blacklist.push(title);
            localStorage["title_blacklist"] = JSON.stringify(title_blacklist);
            updateBlacklistDisplay();
        }
    }

    // 用户黑名单功能已移除
    function removeFromUserBlacklist() { /* no-op: 用户黑名单已移除 */ }

    function removeFromTitleBlacklist(title) {
        title_blacklist = title_blacklist.filter(t => t !== title);
        localStorage["title_blacklist"] = JSON.stringify(title_blacklist);
        updateBlacklistDisplay();
        location.reload(); // 刷新页面以重新显示被屏蔽的帖子
    }

    function updateBlacklistDisplay() {
        // 用户黑名单展示已移除

        // 更新标题黑名单显示
        let titleContainer = $("#msc_title_blacklist");
        titleContainer.empty();
        
        if (title_blacklist.length === 0) {
            titleContainer.html("<div style='color:#999;font-size:12px;'>暂无屏蔽标题</div>");
        } else {
            title_blacklist.forEach(title => {
                let shortTitle = title.length > 20 ? title.substring(0, 20) + "..." : title;
                let item = $(`<div class="msc_blacklist_item">
                    <span title="${title}">${shortTitle}</span>
                    <button class="msc_remove_btn">移除</button>
                </div>`);
                
                const $btn2 = item.find('.msc_remove_btn');
                bindClick($btn2, function(){
                    removeFromTitleBlacklist(title);
                });
                
                titleContainer.append(item);
            });
        }
    }

    // 注意：现在使用jQuery事件绑定，不再需要全局函数绑定

    // ==================== 核心处理函数 ====================
    // 对每个帖子标题进行分析和处理的主函数
    function solve(){
        // 【原版功能】展开完整标题
        // 将豆瓣小组中的缩略标题展开为完整标题，便于用户查看详细信息
        let rawTitleAttr = $(this).attr("title");
        let title = rawTitleAttr || $(this).text().trim();
        if (rawTitleAttr) {
            $(this).text(rawTitleAttr);
        }

        // 获取发帖用户名（从帖子行中提取）
        let username = "";
        let row = $(this).closest('tr');
        let userLink = row.find("td:nth-child(2) a");
        if (userLink.length > 0) {
            username = userLink.text().trim();
        }

        // 【新增功能】黑名单检查 - 最高优先级
        // 用户黑名单检查已移除

        // 检查标题是否在黑名单中（完整匹配）
        if (title_blacklist.includes(title)) {
            row.addClass("msc_blocked");
            row.hide();
            return;
        }

        // 【新增功能】过滤系统 - 优先级最高
        // 检查标题是否包含用户设置的过滤关键字，如果匹配则隐藏整个帖子
        // 使用模糊匹配算法，支持字符间插入其他字符的匹配
        for(let f of filter_tags){
            if((new RegExp(f.split("").join(".?"))).test(title)){
                row.hide();  // 隐藏整行
                return; // 不再执行后续的高亮逻辑，提高性能
            }
        }

        // 【新增功能】添加屏蔽按钮
        // 为每个帖子添加屏蔽用户和屏蔽标题的按钮
        if (!row.find(".msc_block_btn").length) {
            // 获取最后一个td单元格（时间列）
            let lastTd = row.find('td:last-child');
            if (!lastTd.length) { lastTd = row.children('td').last(); }
            if (!lastTd.length) { lastTd = row; }
            
            // 用户黑名单按钮已移除
            
            // 创建屏蔽标题按钮
            let blockTitleBtn = $(`<button class="msc_block_btn" title="屏蔽标题" style="position: relative; margin-left: 5px;">屏蔽标题</button>`);
            bindClick(blockTitleBtn, function(){
                addToTitleBlacklist(title);
                $(this).closest('tr').hide();
            });
            
            // 将按钮添加到最后一个td中
            lastTd.append('<br>');
            lastTd.append(blockTitleBtn);
        }

        // 【原版功能】智能分类高亮系统
        // 根据房源类型进行不同颜色的高亮标记
        
        // 两居室房源 - 黄色高亮（最受关注的房型）
        if(/(两房)|(两室)|(二房)|(二室)|(2室)|(2房)/.test(title)){
            row.addClass("msc_highlight")
        }
        // 一居室房源 - 绿色高亮
        if(/(一房)|(一室)|(1室)|(1房)/.test(title)){
            row.addClass("msc_special")
        }
        // 合租/单间信息 - 深色标记（降低优先级）
        if(/(单间)|(主卧)|(次卧)|(床位)|(青旅)|(其中一间)|(合租)|(找室友)|(寻租)|(室友)|(舍友)/.test(title)){
            row.removeClass("msc_highlight").removeClass("msc_special").removeClass("msc_gray").addClass("msc_useless")
        }
        // 求租帖子 - 灰色标记（与房源帖区分）
        if(/(求租)|(求)/.test(title)){
            row.removeClass("msc_highlight").removeClass("msc_special").removeClass("msc_useless").addClass("msc_gray")
        }
        
        // 【原版功能】特殊标记系统
        // 押一付一标记 - 左侧绿色边框
        if(/(一押)|(押一)/.test(title)){
            row.addClass("msc_yayi")
        }
        // 转租/直租标签 - 醒目彩色标签
        if(/(急转)|(转租)|(转)/.test(title)){
            row.append(`<div class="msc_zhuanzu" style="top:3px;left:${-65}px">转租</div>`)
        }else if(/(直租)/.test(title)){
            row.append(`<div class="msc_zhizu" style="top:3px;left:${-65}px">直租</div>`)
        }

        // 【原版功能】用户自定义关键字标签系统
        // 遍历用户设置的关键字，为匹配的帖子添加自定义标签
        // 支持模糊匹配，标签会显示在帖子左侧，多个标签会依次排列
        let tag_count = 0;
        tags.forEach(c=>{
            if((new RegExp(c.split("").join(".?"))).test(title)){
                row.append(`<div class="msc_tag" style="top:3px;left:${row.offset().left + (tag_count-1)*55}px">${c}</div>`)
                tag_count++;
            }
        })
    }

    // ==================== 功能应用区域 ====================
    // 等待DOM加载完成后执行
    // 在不同页面结构下更稳健地选择帖子标题链接
    waitForjQuery(function(){
        $(function() {
            const $links = $('td.title a, td.td-subject a, table.olt td a[href*="/group/topic/"], a[href*="/group/topic/"]')
                .filter(function(){ return this.href && /\/group\/topic\//.test(this.href); });
            $links.each(solve);
        });
    });
});


})();