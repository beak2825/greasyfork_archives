// ==UserScript==
// @name         YJ-跨境卖家中心-退出自动报名活动
// @namespace    http://tampermonkey.net/
// @version      0.4
// @description  跨境卖家中心平台活动自动报名退出活动
// @author       glk
// @match        https://csp.aliexpress.com/m_apps/campaigns/*
// @icon         data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDgwIiBoZWlnaHQ9IjQ4MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBjbGFzcz0ibGF5ZXIiPjx0ZXh0IGZpbGw9IiNlZWIyMTEiIGZvbnQtZmFtaWx5PSJTZXJpZiIgZm9udC1zaXplPSI2MDAuMjQiIGZvbnQtd2VpZ2h0PSJib2xkIiBzdHJva2U9IiMwMDAiIHN0cm9rZS13aWR0aD0iMCIgdGV4dC1hbmNob3I9Im1pZGRsZSIgeD0iMjM0IiB5PSI0NTYuMzEiPkc8L3RleHQ+PHBhdGggZmlsbD0ibm9uZSIgc3Ryb2tlPSIjZDUwZjI1IiBzdHJva2Utd2lkdGg9IjQwIiBkPSJNMTg4LjUgMTM3djIyNC4wNyIvPjxwYXRoIGZpbGw9Im5vbmUiIHN0cm9rZT0iIzAwOTkyNSIgc3Ryb2tlLXdpZHRoPSIzMCIgZD0iTTIwOC41IDI1M2g2Ni42Ii8+PHBhdGggZD0iTTMwOC4xNCAxNjAuMDlMMjgyIDI1MS4zOGwyNyA3MS41MSIgZmlsbD0ibm9uZSIgc3Ryb2tlPSIjMzM2OWU4IiBzdHJva2Utd2lkdGg9IjMyIi8+PC9nPjwvc3ZnPg==
// @grant        none
// @license      Copyright glk
// @require      https://cdn.jsdelivr.net/npm/xlsx@0.18.5/dist/xlsx.full.min.js
// @require      https://code.jquery.com/jquery-3.6.0.min.js
// @require      https://cdn.jsdelivr.net/npm/ziya-utils@1.1.11/dist/ziya-utils.min.js
// @downloadURL https://update.greasyfork.org/scripts/554338/YJ-%E8%B7%A8%E5%A2%83%E5%8D%96%E5%AE%B6%E4%B8%AD%E5%BF%83-%E9%80%80%E5%87%BA%E8%87%AA%E5%8A%A8%E6%8A%A5%E5%90%8D%E6%B4%BB%E5%8A%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/554338/YJ-%E8%B7%A8%E5%A2%83%E5%8D%96%E5%AE%B6%E4%B8%AD%E5%BF%83-%E9%80%80%E5%87%BA%E8%87%AA%E5%8A%A8%E6%8A%A5%E5%90%8D%E6%B4%BB%E5%8A%A8.meta.js
// ==/UserScript==

(function () {
  "use strict";
  const excelDataLocalKey = "category-weight-freightFee";
  const ID = "glk-aliexpress-statistics";
  const Volley_Url = "/h5/mtop.global.merchant.product.publish.async/1.0";
  const Weights = ZiyaUtils.generateNumberRange(0.01, 0.18, 0.005);
  // const Weights = ZiyaUtils.generateNumberRange(0.01, 0.015);

  function getCurrentTime() {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const day = String(now.getDate()).padStart(2, "0");
    const hours = String(now.getHours()).padStart(2, "0");
    const minutes = String(now.getMinutes()).padStart(2, "0");
    const seconds = String(now.getSeconds()).padStart(2, "0");

    return `${year}年${month}月${day}日 ${hours}时${minutes}分${seconds}秒`;
  }

  ZiyaUtils.createAsyncTask(
    () => !!$(".ait-tabs-tab.ait-tabs-tab-active").text().includes("已报名"),
    () => {
      let 是否正在处理当前页数据 = false;
      let isPending = false;
      const paginationWraper = $(".ait-pagination");
      const 下一页按钮 = $(".ait-pagination").find(".ait-pagination-next button")[0];
      const 商品状态列索引 = $(".ait-table-container .ait-table-header thead th")
        .filter(function () {
          return $(this).text().trim().indexOf("商品状态") !== -1;
        })
        .index();
      const 操作列索引 = $(".ait-table-container .ait-table-header thead th")
        .filter(function () {
          return $(this).text().trim().indexOf("操作") !== -1;
        })
        .index();

      async function clickButtonsSequentially() {
        let sDuration = Date.now();
        是否正在处理当前页数据 = true;
        const 所有行 = $(".ait-table-container .ait-table-body table tbody tr.ait-table-row");
        for (let i = 0; i < 所有行.length; i++) {
          const 当前行 = $(所有行[i]);
          const 当前行商品状态内容 = 当前行.find("td").eq(商品状态列索引).text().trim();

          if (
            当前行商品状态内容.indexOf("定时或关联报入") !== -1 &&
            当前行商品状态内容.indexOf("退出活动成功") === -1
          ) {
            const 申请退出按钮 = 当前行.find("button:contains('申请退出活动')");

            if (申请退出按钮.length > 0) {
              console.log("找到按钮，准备点击...", 申请退出按钮);
              申请退出按钮.click();
              console.log("点击完成，等待第一个弹框出现");
              await ZiyaUtils.sleep(1)
              const 第一个弹框中的确认按钮组 = $(".ait-modal-root .ait-modal-body .ait-modal-confirm-btns button")
              if (第一个弹框中的确认按钮组.length > 0) {
                第一个弹框中的确认按钮组[1].click();
                console.log("点击第一个弹框的退出按钮");
                await ZiyaUtils.waitForCondition(() => !$(".ait-modal-root .ait-modal-body .ait-modal-confirm-btns button").length);
                console.log("第一个弹框关闭");
              } else {
                console.log("没有第一个弹框，直接跳过")
              }
              await ZiyaUtils.waitForCondition(() => {
                // 等待弹框出现且出现可以选择的Radio组
                return !!$(".ait-modal-root .ait-modal-body .ait-radio-group label.ait-radio-wrapper").length;
              });
              console.log(
                "弹框出现，准备选择原因",
                $(".ait-modal-root .ait-modal-body .ait-radio-group label.ait-radio-wrapper")
              );
              const 第一个退出活动原因Radio = $(
                ".ait-modal-root .ait-modal-body .ait-radio-group label.ait-radio-wrapper"
              )[0];
              第一个退出活动原因Radio.click();
              const 退出活动按钮 = $(
                ".ait-modal-root .ait-modal-footer button.ait-btn-primary:contains('退出活动')"
              )[0];
              console.log("选择好了一个原因", 退出活动按钮);
              退出活动按钮.click();
              await ZiyaUtils.waitForCondition(() => {
                // 等待弹框关闭
                return !$(".ait-modal-root .ait-modal-body .ait-radio-group label.ait-radio-wrapper").length;
              });
              console.log("点击完成，继续下一个");
            }
          }
        }
        是否正在处理当前页数据 = false;
        console.log("所有按钮点击完成");
        return Date.now() - sDuration;
      }

      const builder = new ZiyaUtils.ScriptDomBuilder(paginationWraper[0], ID);
      const controls = builder.createMain(
        [
          {
            type: "button",
            keyword: "start",
            text: "执行",
            onClick: async () => {
              await clickButtonsSequentially();
              if (!ZiyaUtils.xhrInterceptor.isActive) {
                ZiyaUtils.xhrInterceptor.start();
                ZiyaUtils.xhrInterceptor.addRule(
                  "h5/mtop.global.campaign.merchants.activity.items.query",
                  (res, _url) => {
                    if (!是否正在处理当前页数据) {
                      console.log("手动下一页，分页请求成功", getCurrentTime());
                      isPending = false;
                    }
                    return res;
                  },
                  (req) => {
                    isPending = true;
                    return req
                  }
                );
              }
              const loopClickNextPage = async () => {
                // 如果不是在最后一页，就点击下一页
                if (!$(".ait-pagination").find(".ait-pagination-next").hasClass("ait-pagination-disabled") && !isPending) {
                  isPending = true;
                  下一页按钮.click();
                  console.log("自动点击下一页", getCurrentTime());
                  await ZiyaUtils.waitForCondition(() => isPending === false);
                  console.log("下一页数据获取完毕，准备处理", getCurrentTime());
                  await ZiyaUtils.sleep(5);
                  console.log("下一页数据获取完毕，开始处理", getCurrentTime());
                  const usedTime = await clickButtonsSequentially();
                  if(usedTime > 1500) {
                    console.log("处理完成，等待5秒", getCurrentTime());
                    await ZiyaUtils.sleep(5);
                  } else {
                    console.log("处理完成，等待0.5秒", getCurrentTime());
                    await ZiyaUtils.sleep(0.5);
                  }
                  loopClickNextPage();
                } else {
                  console.log("到最后一页了");
                  alert("全部处理完毕");
                  ZiyaUtils.xhrInterceptor.stop();
                }
              };
              loopClickNextPage();
            },
          },
        ],
        `
          #${ID} {
            display: inline-flex;
            align-items: center;
            gap: 5px;
            font-size: 12px;
          }

          #${ID} > input {
            width: 90px;
          }
        `
      );
    }
  );
})();
