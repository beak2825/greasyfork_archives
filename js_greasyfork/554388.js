// ==UserScript==
// @name 抖音关键词屏蔽
// @description 抖音屏蔽与相应关键词有关的视频与直播。左下角隐藏按钮进入设置页面、显示当前页面过滤数量。可批量添加关键词，用英文逗号,分割。支持导入导出。
// @namespace https://space.bilibili.com/482343
// @author jackfeng
// @license jackfeng
// @version 1.4.12 // 版本号已更新
// @include https://www.douyin.com/*
// @include https://www.douyin.com/re*
// @include https://www.douyin.com/?*
// @include https://www.douyin.com/follow
// @require https://cdnjs.cloudflare.com/ajax/libs/jquery/1.12.4/jquery.min.js
// @run-at document-end
// @grant GM_setValue
// @grant GM_getValue
// @grant GM_addValueChangeListener
// @noframes
// @downloadURL https://update.greasyfork.org/scripts/554388/%E6%8A%96%E9%9F%B3%E5%85%B3%E9%94%AE%E8%AF%8D%E5%B1%8F%E8%94%BD.user.js
// @updateURL https://update.greasyfork.org/scripts/554388/%E6%8A%96%E9%9F%B3%E5%85%B3%E9%94%AE%E8%AF%8D%E5%B1%8F%E8%94%BD.meta.js
// ==/UserScript==
var i, j, c, fl, fk, x, a, b, mo = 0,al,
    glzs = 0;

function debugx() {
    glzs++;
    $(`.xfsz_sz`).text(glzs);
    return 1; // 1 显示log； 0 隐藏log
}
var toObj = (arr) => {
    var obj = {};
    for (var temp in arr) {
        obj[arr[temp]] = true;
    }
    return obj;
};
var toArr = (obj) => {
    var arr = [];
    for (var temp in obj) {
        arr.push(temp);
    }
    return arr;
};
var together = (a, b) => {
    for (var temp = 0; temp < b.length; temp++) {
        if (b[temp] != null && b[temp] != "" && b[temp] != "null" && b[temp].length < 40) {
            a.push(b[temp] + "");
        }
    }
};
var getUniq = (arr) => Array.from(new Set(arr))
//dd 都屏蔽， bt 只屏蔽正文关键词， zz 只屏蔽昵称
var dd = GM_getValue("dd", new Array(""));
var bt = GM_getValue("golvci", new Array(""));
var zz = GM_getValue("zz", new Array(""));
var ddx = new Array();
var btx = new Array();
var zzx = new Array();
let glc = new Array(ddx, btx, zzx);
let glcx = new Array(dd, bt, zz);
let nglc = new Array();
let ml = new Array("dd", "golvci", "zz")
let xfz = 0;
together(ddx, dd);
together(btx, bt);
together(zzx, zz);

GM_addValueChangeListener('dd', function (name, old_value, new_value, remote) {
    dd = new_value;
    glc[0] = dd.concat();
    bt.push.apply(bt, dd);
    zz.push.apply(zz, dd);
})
GM_addValueChangeListener('golvci', function (name, old_value, new_value, remote) {
    bt = new_value;
    glc[1] = bt.concat();
    bt.push.apply(bt, dd);
})
GM_addValueChangeListener('zz', function (name, old_value, new_value, remote) {
    zz = new_value;
    glc[2] = zz.concat();
    zz.push.apply(zz, dd);
})

function bc() {
    //保存
    al="";
    for (var i = 0; i < 3; i++) {
        glc[i] = getUniq(glc[i]);
        glcx[i] = new Array();
        together(glcx[i], glc[i]);
        GM_setValue(ml[i], glcx[i]);
        glc[i] = new Array();
        together(glc[i], glcx[i]);
    }
    dd = glc[0].concat();
    bt = glc[1].concat();
    zz = glc[2].concat();
    bt.push.apply(bt, dd);
    zz.push.apply(zz, dd);
}
bc();

// 辅助函数：针对单视频页的“不感兴趣”操作
function gldq(x){
    // 关注页不屏蔽逻辑
    if (location.href.indexOf("/follow")>-1){
        setTimeout(function (){
            console.log("当前已关注，不屏蔽，进入下一个视频");
            $(`div.swiper-slide.swiper-slide-active div.xgplayer-playswitch div.xgplayer-playswitch-next`).click();
        },500);
        x=2;
        return;
    }

    // 检查是否已关注 (简化的判断逻辑)
    var isfollowed = false;
    // 尝试寻找关注按钮，若不可见，则可能已关注
    $(`div[data-e2e="feed-active-video"] div[data-e2e="follow-button"]`).each(function () {
        if (!$(this).is(':visible')) {
            isfollowed = true;
        }
    });

    if  (isfollowed){
        console.log("当前已关注，不屏蔽，进入下一个视频");
        $(`div.swiper-slide.swiper-slide-active div.xgplayer-playswitch div.xgplayer-playswitch-next`).click();
        return;
    }

    // 延迟递归调用 (用于确保DOM加载)
    if (x==1){
        setTimeout(function(){gldq(0);},500);
    }

    // 点击“不感兴趣”逻辑
    if (x<2){
        var yj=0;
        // 尝试点击“不感兴趣”按钮 (常见)
        $(`div[data-e2e="feed-active-video"] button[aria-label="不感兴趣"]`).each(function (){
            if (yj==0 && $(this).text().indexOf("不感兴趣")>-1){
                console.log("点击不感兴趣 ",$(this));
                $(this).click();
                yj=1;
            }
        });

        // 如果未找到“不感兴趣”，尝试点击“更多”然后点击“不感兴趣”
        if (yj==0){
             $(`div[data-e2e="feed-active-video"] button[aria-label="更多"]`).click();
             setTimeout(function(){
                 $(`div[data-e2e="not-interested-button"]`).click();
                 console.log("点击 更多 -> 不感兴趣");
             }, 200);
        }
    }

    // 无描述（跳过）逻辑
    if(x>2){
        if  (!isfollowed){
            setTimeout(function (){
               console.log("无描述，不屏蔽，进入下一个视频");
               $(`div.swiper-slide.swiper-slide-active div.xgplayer-playswitch div.xgplayer-playswitch-next`).click();
            },500);
            x=2;
            return;
        }
    }
}

// 键盘事件处理
function keydown(event) {
    //79 o 80 p
    if (event.keyCode == 79 || event.keyCode == 98) {//o，num2
        console.log("不感兴趣当前 ",$(`div[data-e2e="feed-active-video"]`).text().replace(/\n/g, " ").replace(/\s\s/g, " "));
        glzs++;
        $(`.xfsz_sz`).text(glzs);
        gldq(0);
    }
    if (event.keyCode == 73 || event.keyCode == 97) {//i，num1
        $(`div[data-e2e="feed-active-video"] div.xgplayer-playswitch div.xgplayer-playswitch-prev`).click();
    }
    if (event.keyCode == 80 || event.keyCode == 99) {//p，num3
        $(`div[data-e2e="feed-active-video"] div.xgplayer-playswitch div.xgplayer-playswitch-next`).click();
    }
}
document.addEventListener('keydown', keydown, false);

// 核心过滤逻辑（已更新选择器，支持瀑布流和单视频页）
function glyc() {

    // --- 1. 针对【单视频播放页】（如 https://www.douyin.com/video/XXXX） ---
    // 使用旧的 data-e2e 选择器，它们在单页模式下通常更稳定
    $(`div[data-e2e="feed-active-video"]`).each(function () {
        x = 0;

        var y_name = $(this).find(`[data-e2e="feed-video-author"]`).text() || $(this).find(`div.video-info-detail a[data-e2e="video-author-name"]`).text();

        if (y_name != null && y_name != al) {
            for (var j = 0; j < zz.length; j++) {
                if (zz[j] != "" && y_name.indexOf(zz[j]) > -1) {
                    x = 1;
                    console.log("单页删除 昵称 [ ", zz[j], " ] : ", y_name);
                    break;
                }
            }
            al = y_name;
        }

        var y_title = $(this).find(`[data-e2e="video-description"]`).text() || $(this).find(`div.video-info-detail div.title`).text();

        if (x == 0 && y_title != null) {
            for (j = 0; j < bt.length; j++) {
                if (bt[j] != "" && y_title.indexOf(bt[j]) > -1) {
                    console.log("单页删除 关键词 [ ", bt[j], " ] : ", y_title);
                    x = 1;
                    break;
                }
            }
        }

        var y_ad = $(this).find(`[data-e2e="ad-tag"]`).text();

        if (x == 0 && y_ad != null && y_ad.indexOf("广告") > -1) {
            console.log("单页删除 广告 : ", y_ad);
            x = 1;
        }

        if (x == 1) {
            glzs++;
            $(`.xfsz_sz`).text(glzs);
            gldq(x); // 在单视频页，执行跳过操作
        }
    });

    // --- 2. 针对【瀑布流卡片页】（首页、搜索结果页） ---
    // 使用新的卡片选择器: div.discover-video-card-item
    $(`div.discover-video-card-item:visible`).each(function () {
        var card = $(this);
        var filtered = false;

        // 2.1 获取并检查昵称（作者）
        // 新昵称选择器：span.H0ZV35Qb span.i1udsuGn
        var author_name = card.find(`span.H0ZV35Qb span.i1udsuGn`).text();
        if (author_name) {
            for (var j = 0; j < zz.length; j++) {
                if (zz[j] != "" && author_name.indexOf(zz[j]) > -1) {
                    console.log("瀑布流删除 昵称 [ ", zz[j], " ] : ", author_name);
                    filtered = true;
                    break;
                }
            }
        }

        // 2.2 获取并检查标题（描述）
        // 新标题选择器：div.bWzvoR9D
        if (!filtered) {
            var video_title = card.find(`div.bWzvoR9D`).text();
            if (video_title) {
                for (j = 0; j < bt.length; j++) {
                    if (bt[j] != "" && video_title.indexOf(bt[j]) > -1) {
                        console.log("瀑布流删除 关键词 [ ", bt[j], " ] : ", video_title);
                        filtered = true;
                        break;
                    }
                }
            }
        }

        // 2.3 检查是否为广告
        if (!filtered) {
             var title_text = card.find(`div.bWzvoR9D`).text();
             if (title_text && title_text.indexOf("广告") > -1) {
                 console.log("瀑布流删除 广告卡片");
                 filtered = true;
             }
        }


        // 2.4 执行删除/隐藏操作
        if (filtered) {
            glzs++;
            card.remove(); // 直接从DOM中移除卡片
            $(`.xfsz_sz`).text(glzs);
        }
    });

    return true;
}

var wz = location.href;
var xh;
glyc();
var MutationObserver = window.MutationObserver || window.WebKitMutationObserver || window.MozMutationObserver;
var observer = new MutationObserver(function (records) {
    records.map(function (record) {
        if (record.addedNodes) {
            glyc();
        }
    });
});
var option = {
    childList: true,
    subtree: true,
};
observer.observe(document.body, option);


//--------------左下角按钮--设置界面-------------
let wdstyle = document.createElement('style');
wdstyle.innerHTML = `
.xfsz {
    height: 50px;
    width: 50px;
    position: fixed;
    transition: 0.5s;
    z-index: 9999;
    opacity: 0;
    left: 0px;
    bottom: 0px;
  }
  .xfsz:hover {
    opacity: 1;
  }
  .xfsz_an {
    left: 1vw;
    bottom: 1vw;
    background-color: rgb(29, 161, 242);
    border-radius: 19px;
    color: #fff;
    cursor: pointer;
    font-size: 20px;
    height: 38px;
    width: 38px;
    line-height: 38px;
    position: absolute;
    text-align: center;
    z-index: 99999;
    user-select: none;
    display: block;
  }
  .xfsz_sz{
    left: 30px;
    bottom: 0px;
    background-color: #333;
    border-radius: 25px;
    color: #fff;
    cursor: pointer;
    font-size: 10px;
    height: 25px;
    width: 25px;
    line-height: 25px;
    position: absolute;
    text-align: center;
    z-index: 99999;
    user-select: none;
    display: block;
  }
  .xfck {
    display: none;
    background: #222;
    width: 700px;
    height: 640px;
    text-align: center;
    position: fixed;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    color: #fff;
    z-index: 99999;
    border: solid 3px #000000;
  }
  .xfsc {
    background: #444;
    right: 20px;
    border-radius: 35px;
    margin-bottom: 13px;
    margin-right: 10px;
    margin-left: 10px;
    cursor: pointer;
    border: solid 5px #444;
    white-space: nowrap;
    float: left;
  }
  .xfsc:hover {
    background: #000;
    border: solid 5px #000;
  }
  .xfan {
    width: 100px;
    height: 40px;
  }
  .xfyy {
    overflow: auto;
    width: 700px;
    height: 430px;
    margin: auto;
  }
  #xf_sr {
    width: 580px;
    height: 32px;
    margin: auto;
  }
  #xf_dc {
    margin-left: 40px;
    margin-right: 40px;
  }
  .xfgb {
    position: absolute;
    right: 3px;
    top: 3px;
    cursor: pointer;
    font-size: 40px;
    width: 40px;
    height: 40px;
    line-height: 40px;
  }
  .xfgb:hover {
    background: #f00;
  }
  .tabbox ul {
    list-style: none;
    display: table;
    margin: 0;
    padding-left: 70px;
    width: 1000px;
  }
  .tabbox ul li {
    float: left;
    width: 120px;
    height: 50px;
    line-height: 50px;
    font-size: 12px;
    border: 1px solid #aaccff;
    cursor: pointer;
    margin-left: 10px;
    margin-right: 10px;
  }

  .tabbox ul li:hover{
    background-color: #111;
    color: white;
    font-weight: bold;
  }
  .tabbox ul li.active {
    background-color: #004f69;
    color: white;
    font-weight: bold;
  }
  .xfan,
  #xf_sr {
    background: #333;
    color: #ddd;
  }
  .xfan:hover,
  #xf_sr:focus {
    background: #111;
    color: #fff;
  }

  `;
let wddiv = `
<div class="xfsz">
    <span class="xfsz_an" title="过滤设置">
    滤
    <span class="xfsz_sz">0
    </span>
    </span>
</div>
<div class="xfck">
    <div>抖音 过滤设置</div>
    <div class="xfgb">X
    </div>
    <div>
        <textarea type="text" name="textfield" id="xf_sr" width="auto"></textarea>
        <br>
        不同过滤词用英文 , 分隔；导入会清空已有的，替换为导入的，导入空白等于删除全部过滤词。
        <br>
        <input type="submit" name="submit" id="xf_zj" class="xfan" value="增加">
        <input type="submit" name="submit" id="xf_dc" class="xfan" value="导出">
        <input type="submit" name="submit" id="xf_dr" class="xfan" value="导入">
    </div>
    <div class="tabbox">
        　　<ul>
        　　　　<li class="active">关键词+昵称</li>
        　　　　<li>关键词</li>
        　　　　<li>昵称</li>
        　　</ul>
        <br>
        <div class="xfyy"></div>
    </div>
</div>
`;
document.body.appendChild(wdstyle);
setTimeout(() => {
    document.querySelector("body").innderHTML += wddiv;
    $(wddiv).appendTo($(`body`));
    //关闭
    $(`.xfgb`).click(function () {
        $(`.xfck`).toggle();
    })
    $(`.xfsz_an`).click(function () {
        sc();
        $(`.xfck`).toggle();
    });

    $(`.tabbox ul li`).click(function () {
        $(this).addClass("active").siblings().removeClass("active");
        //获取选中元素的下标
        var index = $(this).index();
        $(this).parent().siblings().children().eq(index).addClass("active")
            .siblings().removeClass("active");
        xfz = index;
        sc();
    })
    //删除
    function sc() {
        $(`.xfyy`).empty();
        glc[xfz].forEach(glcc => {
            let a = document.createElement("span");
            $(a).text(glcc).addClass("xfsc");
            $(a).click(function () {
                glc[xfz] = glc[xfz].filter(item => {
                    return item != $(a).text();
                })
                bc();
                sc();
            })
            $(a).appendTo($(`.xfyy`));
        });
    }
    sc();

    // 增加 - **已修复语法错误**
    $(`#xf_zj`).click(function () {
        nglc = $(`#xf_sr`).val().split(",");
        together(glc[xfz], nglc);
        glc[xfz] = getUniq(glc[xfz]);
        bc();
        sc();
        $(`#xf_sr`).val("");
    });

    // 导出
    $(`#xf_dc`).click(function () {
        let s = "";
        glc[xfz].forEach((x) => {
            s += x + ","
        })
        $(`#xf_sr`).val(s).select();
    });

    // 导入 - **已修复语法错误**
    $(`#xf_dr`).click(function () {
        glc[xfz] = $(`#xf_sr`).val().split(",");
        bc();
        sc();
        $(`#xf_sr`).val("");
    });

    function glsjy() {

    }
}, 1000);