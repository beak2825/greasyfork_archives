// ==UserScript==
// @name         必应-今日热榜
// @namespace    https://greasyfork.org/zh-CN/users/1513778-chris-lu
// @version      2025.12.03.02
// @description  必应 Bing 搜索添加今日热榜，Microsoft Rewards点击赚积分
// @author       Chris Lu
// @match        *://*.bing.com/search*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=bing.com
// @require      https://cdnjs.cloudflare.com/ajax/libs/jquery/3.7.1/jquery.min.js#sha512-v2CJ7UaYy4JwqLDIrZUI/4hqeoQieOmAZNXBeQyjo21dadnwR+8ZaIJVT8EE2iyI61OV8e6M8PP2/4hpQINQ/g==
// @license      GPL-3.0-or-later; https://www.gnu.org/licenses/gp
// @antifeature referral-link This script includes a refer link.
// @grant        unsafeWindow
// @grant        GM_getResourceText
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/549091/%E5%BF%85%E5%BA%94-%E4%BB%8A%E6%97%A5%E7%83%AD%E6%A6%9C.user.js
// @updateURL https://update.greasyfork.org/scripts/549091/%E5%BF%85%E5%BA%94-%E4%BB%8A%E6%97%A5%E7%83%AD%E6%A6%9C.meta.js
// ==/UserScript==
GM_addStyle(`
#rebang{
padding:0px 18px;
margin-bottom:30px;
}

#ext-keywords-list{
border:solid silver 1px;
border-radius:5px;
padding:10px;
}

.col-form-label{
line-height:30px;
margin-right:10px;
}

.form-select{
margin-right:10px;
}
.row{
  display: flex;
  flex-wrap: wrap;
  margin-bottom:10px;
}

.col-sm-3{
width:25%;
}
@media only screen and (max-width: 600px) {
.col-12{
width:100%;
}.col-6{
width:50%;
}
}
.keyword-link {
font-size:14px;
overrlow:hidden;
white-space:nowrap;
margin-bottom:3px;
}`);

this.$ = this.jQuery = jQuery.noConflict(true);
const prefix = "Rebang_";
const selectedChannelKey = `${prefix}SelectedChannel`;
const limitSearchCountKey = `${prefix}LimitSearchCount`;
const currentKeywordIndexKey = `${prefix}CurrentKeywordIndex`;
const channelListKey = `${prefix}Channels`;
const autoSearchLockKey = `${prefix}AutoSearchLock`;
const autoSearchLockExpiresKey = `${prefix}AutoSearchLockExpires`;

function getAutoSearchCountKey() {
  return `${prefix}AutoSearchCount_${new Date().toISOString().split("T")[0]}`;
}

// 实现平滑滚动到页面底部的函数
function smoothScrollDownUp() {
  document.documentElement.scrollIntoView({ behavior: "smooth", block: "end" });

  setTimeout(() => {
    document.documentElement.scrollIntoView(true); // 回到顶部
  }, 1000);
}

function truncateText(str, maxlength) {
  if (str.length > maxlength) {
    return str.slice(0, maxlength - 1) + "…";
  }
  return str;
}

function getCurrentChannelKeywordsCacheKey() {
  return `${prefix}${getCurrentChannel()}`;
}

function getCurrentChannel() {
  return localStorage.getItem(selectedChannelKey) ?? "微博";
}

function showUserMessage(msg) {
  $("#ex-user-msg").text(msg);
}

function doSearch(keyword) {
  $("#sb_form_q").val(keyword);
  $("#sb_form_go").click();
}

function doAutoSearch() {
  let jobLockExpires = localStorage.getItem(autoSearchLockExpiresKey) ?? "";
  if (
    jobLockExpires.length == 0 ||
    (jobLockExpires.length > 0 && new Date(jobLockExpires) < new Date())
  ) {
    // 生成随机延迟时间
    let randomDelay = Math.floor(Math.random() * 6000) + 8000; // 生成8秒到14秒之间的随机数
    var t = new Date();
    t.setSeconds(t.getSeconds() + randomDelay / 1000);
    localStorage.setItem(autoSearchLockExpiresKey, t);

    // 获取当前搜索次数
    let currentSearchCount = Number(
      localStorage.getItem(getAutoSearchCountKey()) ?? 1
    );
    let limitSearchCount = Number($("#ext-autosearch-limit").val() ?? 50);
    let currentKeywordIndex = Number(
      localStorage.getItem(currentKeywordIndexKey) ?? 0
    );

    // 根据计数器的值选择搜索引擎
    if (currentSearchCount < limitSearchCount) {
      var cacheKey = getCurrentChannelKeywordsCacheKey();
      var keywords = JSON.parse(sessionStorage.getItem(cacheKey));

      if (keywords.length > currentKeywordIndex + 1) {
        currentSearchCount++;
        currentKeywordIndex++;
        localStorage.setItem(getAutoSearchCountKey(), currentSearchCount);
        localStorage.setItem(currentKeywordIndexKey, currentKeywordIndex);
        $("#ext-current-count").text(currentSearchCount);

        if (currentSearchCount >= limitSearchCount) {
          localStorage.setItem(autoSearchLockKey, "on");
        }
        doSearch(keywords[currentKeywordIndex - 1].title);
      } else {
        showUserMessage("当前已完成，请切换热榜。");
      }
    }
  }
}

function initChannels(channels, selectedChannel) {
  channels?.forEach(function (element) {
    var opt = new Option(element, element);
    opt.selected = element == selectedChannel;
    $("#ext-channels").append(opt);
  });

  if (localStorage.getItem(selectedChannelKey) == null) {
    localStorage.setItem(selectedChannelKey, "微博");
  }

  initKeywords(); //第一次加载
}

function initKeywords() {
  var cacheKey = getCurrentChannelKeywordsCacheKey();
  var keywords = sessionStorage.getItem(cacheKey);
  console.log(`switch to keywords ${cacheKey}`);

  if (keywords) {
    renderKeywords(JSON.parse(keywords));
    console.log(`hit keywords cache ${cacheKey}`);
  } else {
    $.ajax({
      url:
        "https://api.pearktrue.cn/api/dailyhot/?title=" + getCurrentChannel(),
      method: "GET",
      timeout: 0,
    }).done(function (response) {
      if (response.code == 200 && response.data) {
        keywords = response.data;
        sessionStorage.setItem(cacheKey, JSON.stringify(keywords));
        renderKeywords(keywords);
        console.log(`fetched keywords ${cacheKey}`);
      } else {
        showUserMessage(
          `获取热榜[${getCurrentChannel()}]关键词失败，请稍后重试。`
        );
      }
    });
  }
}

function renderKeywords(keywords) {
  $("#ext-keywords-list").empty();
  keywords.forEach(function (element, index) {
    if ($("#ext-keywords-linktype").val() == "搜索")
      $("#ext-keywords-list").append(
        `<a target='_self' class='col-sm-3 col-12 keyword-link keyword-link-search' title='${
          element.title
        }' href='javascript:void();'>${index + 1}. ${truncateText(
          element.title,
          16
        )}</a>`
      );
    else
      $("#ext-keywords-list").append(
        `<a target='_blank' class='col-sm-3 col-12 keyword-link' title='${
          element.title
        }' href='${element.url ?? element.mobileUrl}'>${
          index + 1
        }. ${truncateText(element.title, 16)}</a>`
      );
  });

  $("#ext-keywords-list").append(
    `<a target='_blank' class='col-12 keyword-link' href='https://rewards.bing.com/welcome?rh=3D3F7F7&ref=rafsrchae'>👉加入Microsoft Rewards点击🔥热🔥点🔥赚取积分！👈</a>`
  );
  $("#b_content").css("padding-top", "10px");

  $("#ext-keywords-list .keyword-link-search").click(function (e) {
    doSearch($(this).attr("title"));
  });
}

function initControls() {
  if (window.top !== window.self) {
    console.log("run in an iframe.");
  }

  if ($("#rebang").length == 0 && $("#b_content").length > 0) {
    $("#b_content").prepend(
      "<div id='rebang'><div class='row'><label class='col-form-label'><strong>今日热榜: </strong></label><select id='ext-channels' class='form-select' title='平台'></select><label class='col-form-label'><strong>点击操作: </strong></label><select id='ext-keywords-linktype' class='form-select' title='操作'><option value='搜索' selected>搜索</option><option value='打开'>打开</option></select><button id='ext-keywords-refresh' type='button'>刷新</button><label  class='col-form-label' style='margin-left:20px;'><strong>自动搜索:</strong> <span  class='col-form-label' id='ext-current-count'></span>/</label><input type='text' class='form-control' style='width:30px;margin-right:2px;' id='ext-autosearch-limit'></input><label  class='col-form-label'> 次</label><button id='ext-autosearch-lock' type='button'>开始</button><label id='ex-user-msg' class='col-form-label' style='margin-left:10px;color:red;'></label></div><div class='row' id='ext-keywords-list'></div></div><input type='hidden' id='ext-scroll-done'/>"
    );

    let channelList = sessionStorage.getItem(channelListKey);
    if (channelList !== null) {
      initChannels(JSON.parse(channelList), getCurrentChannel());
      console.log("hit Channels cache.");
    } else {
      $.ajax({
        url: "https://api.pearktrue.cn/api/dailyhot",
        method: "GET",
        timeout: 0,
      }).done(function (response) {
        if (response.code == 200 && response.data && response.data.platforms) {
          sessionStorage.setItem(
            channelListKey,
            JSON.stringify(response.data.platforms)
          );
          initChannels(response.data.platforms, getCurrentChannel());
          console.log("fetched Channels.");
        } else {
          showUserMessage(`获取热榜频道失败，请稍后重试。`);
        }
      });
    }
  }

  let currentSearchCount = localStorage.getItem(getAutoSearchCountKey()) ?? 1;
  $("#ext-current-count").text(currentSearchCount);

  $("#ext-autosearch-limit").val(localStorage.getItem(limitSearchCountKey));

  if (localStorage.getItem(autoSearchLockKey) == "on") {
    $("#ext-autosearch-lock").text("开始");
  } else {
    $("#ext-autosearch-lock").text("停止");
  }

  $("#ext-channels").change(function (e) {
    localStorage.setItem(selectedChannelKey, $(this).val());
    localStorage.setItem(currentKeywordIndexKey, 0);
    initKeywords();
  });

  $("#ext-keywords-linktype").change(function (e) {
    initKeywords();
  });

  $("#ext-autosearch-limit").change(function (e) {
    localStorage.setItem(limitSearchCountKey, $(this).val());
  });

  $("#ext-keywords-refresh").click(function (e) {
    sessionStorage.removeItem(getCurrentChannelKeywordsCacheKey());
    initKeywords();
  });

  $("#ext-autosearch-lock").click(function (e) {
    if (localStorage.getItem(autoSearchLockKey) == "on") {
      if (localStorage.getItem(limitSearchCountKey) == null) {
        showUserMessage("请先设置自动搜索次数限制！");
      } else {
        var limitSearchCount = Number(
          localStorage.getItem(limitSearchCountKey)
        );
        var currentSearchCount = Number(
          localStorage.getItem(getAutoSearchCountKey()) ?? 0
        );

        if (currentSearchCount >= limitSearchCount) {
          showUserMessage("当前搜索已达上限，请调整自动搜索次数限制后再启动！");
          return;
        } else {
          showUserMessage("");
          localStorage.setItem(autoSearchLockKey, "off");
          $(this).text("停止");
          localStorage.setItem(currentKeywordIndexKey, 0);
          $("#ex-user-msg").text("自动搜索已启动...");
        }
      }
    } else {
      localStorage.setItem(autoSearchLockKey, "on");
      $(this).text("开始");
      $("#ex-user-msg").text("");
    }
  });
}

(function () {
  "use strict";

  $(document).ready(function () {
    if (window.top === window.self) {
      this.intervalId =
        this.intervalId ||
        setInterval(function () {
          if ($("#rebang").length == 0) {
            initControls();
          }

          if (
            $("#ext-autosearch-limit").val().trim() != "" &&
            localStorage.getItem(autoSearchLockKey) != "on"
          ) {
            if ($("#ext-scroll-done").val() != "1") {
              $("#ext-scroll-done").val("1");
              smoothScrollDownUp(); // 添加执行滚动页面的操作
            }
            
            doAutoSearch();
          }
        }, 1000);
    }
  });
})();
