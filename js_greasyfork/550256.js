// ==UserScript==
// @name         YJ-跨境卖家中心-商品种类物流费统计
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  跨境卖家中心商品种类标准重量物流费统计
// @author       glk
// @match        https://csp.aliexpress.com/m_apps/aepop-product-publish/*
// @icon         data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDgwIiBoZWlnaHQ9IjQ4MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBjbGFzcz0ibGF5ZXIiPjx0ZXh0IGZpbGw9IiNlZWIyMTEiIGZvbnQtZmFtaWx5PSJTZXJpZiIgZm9udC1zaXplPSI2MDAuMjQiIGZvbnQtd2VpZ2h0PSJib2xkIiBzdHJva2U9IiMwMDAiIHN0cm9rZS13aWR0aD0iMCIgdGV4dC1hbmNob3I9Im1pZGRsZSIgeD0iMjM0IiB5PSI0NTYuMzEiPkc8L3RleHQ+PHBhdGggZmlsbD0ibm9uZSIgc3Ryb2tlPSIjZDUwZjI1IiBzdHJva2Utd2lkdGg9IjQwIiBkPSJNMTg4LjUgMTM3djIyNC4wNyIvPjxwYXRoIGZpbGw9Im5vbmUiIHN0cm9rZT0iIzAwOTkyNSIgc3Ryb2tlLXdpZHRoPSIzMCIgZD0iTTIwOC41IDI1M2g2Ni42Ii8+PHBhdGggZD0iTTMwOC4xNCAxNjAuMDlMMjgyIDI1MS4zOGwyNyA3MS41MSIgZmlsbD0ibm9uZSIgc3Ryb2tlPSIjMzM2OWU4IiBzdHJva2Utd2lkdGg9IjMyIi8+PC9nPjwvc3ZnPg==
// @grant        none
// @license      Copyright glk
// @require      https://cdn.jsdelivr.net/npm/xlsx@0.18.5/dist/xlsx.full.min.js
// @require      https://code.jquery.com/jquery-3.6.0.min.js
// @require      https://cdn.jsdelivr.net/npm/ziya-utils@1.1.11/dist/ziya-utils.min.js
// @downloadURL https://update.greasyfork.org/scripts/550256/YJ-%E8%B7%A8%E5%A2%83%E5%8D%96%E5%AE%B6%E4%B8%AD%E5%BF%83-%E5%95%86%E5%93%81%E7%A7%8D%E7%B1%BB%E7%89%A9%E6%B5%81%E8%B4%B9%E7%BB%9F%E8%AE%A1.user.js
// @updateURL https://update.greasyfork.org/scripts/550256/YJ-%E8%B7%A8%E5%A2%83%E5%8D%96%E5%AE%B6%E4%B8%AD%E5%BF%83-%E5%95%86%E5%93%81%E7%A7%8D%E7%B1%BB%E7%89%A9%E6%B5%81%E8%B4%B9%E7%BB%9F%E8%AE%A1.meta.js
// ==/UserScript==

(function () {
  "use strict";
  const excelDataLocalKey = "category-weight-freightFee";
  const ID = "glk-aliexpress-statistics";
  const Volley_Url = "/h5/mtop.global.merchant.product.publish.async/1.0";
  const Weights = ZiyaUtils.generateNumberRange(0.01, 0.18, 0.005);
  // const Weights = ZiyaUtils.generateNumberRange(0.01, 0.015);

  // 使用隐藏 iframe 下载 Excel
  function downloadWithIframeExcel(data) {
    try {
      const head = data[0];
      let filename = `${head.slice(1).join("_")}.xlsx`;

      // 创建隐藏iframe
      const iframe = document.createElement("iframe");
      iframe.style.display = "none";
      document.body.appendChild(iframe);

      const doc = iframe.contentDocument || iframe.contentWindow.document;
      doc.open();
      doc.write(`
            <html>
                <head>
                    <meta charset="utf-8">
                    <script src="https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.18.5/xlsx.full.min.js"></script>
                </head>
                <body>
                    <script>
                        const data = ${JSON.stringify(data)};
                        const filename = ${JSON.stringify(filename)};
                        
                        function downloadExcel() {
                            const wb = XLSX.utils.book_new();
                            const ws = XLSX.utils.aoa_to_sheet(data);
                            XLSX.utils.book_append_sheet(wb, ws, "Sheet1");
                            
                            const wbout = XLSX.write(wb, {
                                bookType: 'xlsx',
                                type: 'base64'
                            });
                            
                            const dataURL = 'data:application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;base64,' + wbout;
                            const link = document.createElement('a');
                            link.href = dataURL;
                            link.download = filename;
                            link.click();
                        }
                        
                        // 等待XLSX库加载完成后执行
                        if (typeof XLSX !== 'undefined') {
                            downloadExcel();
                        } else {
                            window.onload = function() {
                                setTimeout(downloadExcel, 100);
                            };
                        }
                    </script>
                </body>
            </html>
        `);
      doc.close();

      // 清理iframe
      setTimeout(() => {
        document.body.removeChild(iframe);
      }, 2000);
    } catch (error) {
      console.error("iframe Excel 下载失败:", error);
    }
  }

  /**
   * 保存Execel数据
   * @param {*} key
   * @param {*} value
   */
  function setLocalExcelData(key, value) {
    const localD = ZiyaUtils.getFromLocalStorage(excelDataLocalKey);
    if (localD) {
      const data = JSON.parse(localD);
      data[key] = value;
      ZiyaUtils.saveToLocalStorage(excelDataLocalKey, JSON.stringify(data));
    } else {
      const data = {};
      data[key] = value;
      ZiyaUtils.saveToLocalStorage(excelDataLocalKey, JSON.stringify(data));
    }
  }

  /**
   * 获取Execel数据
   * @returns
   */
  function getLocalExcelData(key) {
    try {
      const localD = ZiyaUtils.getFromLocalStorage(excelDataLocalKey);
      if (localD) {
        const data = JSON.parse(localD);
        if (key) {
          return data[key];
        } else {
          return data;
        }
      }
    } catch (error) {
      return null;
    }
  }

  function convertToRows(o) {
    const weights = o[Object.keys(o)[0]].map((item) => item.weight);
    const productTypes = Object.keys(o);

    return weights.map((weight) => [
      weight,
      ...productTypes.map((type) => parseFloat(o[type].find((item) => item.weight === weight).freightFee)),
    ]);
  }

  ZiyaUtils.createAsyncTask(
    () => !!$(".next-dialog.next-closeable.next-overlay-inner").length,
    () => {
      let freightFeeList = [];
      const targetNode = $(".next-dialog.next-closeable.next-overlay-inner .next-form")[0];
      const builder = new ZiyaUtils.ScriptDomBuilder(targetNode, ID);
      const controls = builder.createMain(
        [
          {
            type: "input",
            keyword: "category",
            placeholder: "请输入种类...",
          },
          {
            type: "button",
            keyword: "start-collect",
            text: "开始采集",
            onClick: async () => {
              const categoryV = controls.getValue("category");
              if (!categoryV) {
                ZiyaUtils.showTip("请填写种类", 1.5);
                return;
              }

              freightFeeList = []

              /** 开始拦截之后的请求 */
              if (!ZiyaUtils.xhrInterceptor.isActive) {
                ZiyaUtils.xhrInterceptor.start();
                ZiyaUtils.xhrInterceptor.addRule(Volley_Url, (res, _url) => {
                  const dataStr = res.data.data;
                  /** 获取意大利服务费 */
                  const freightFeeRes = dataStr.match(/"freightFee":"([\d.]+)"/)[1];
                  console.log("freightFeeRes", freightFeeRes)
                  freightFeeList.push(freightFeeRes);
                  return res;
                });
              }

              const weightInput = document.getElementById("weight");
              const subumitButton = document.querySelector(".next-btn.next-medium.next-btn-primary");
              const loading = ZiyaUtils.createMaskLoading("采集中...");

              for (let i = 0; i < Weights.length; i++) {
                const w = Weights[i];
                console.log("请求", w);
                ZiyaUtils.compelSetInputValue(weightInput, w);
                subumitButton.click();
                await ZiyaUtils.waitForCondition(() => !subumitButton.classList.contains("next-btn-loading"));
                freightFeeList[i] = {
                  weight: w * 1000,
                  freightFee: freightFeeList[i],
                };
                console.log(`请求 ${w} 结束 \n`);
              }
              setLocalExcelData(categoryV, freightFeeList);
              loading.close();
              ZiyaUtils.showTip("采集完成！可导出文件了！✌️", 2);

              console.log(`%c 最终数据`, `color: hotpink; font-size: 20px; font-weight: bold;`, freightFeeList);
            },
          },
          {
            type: "button",
            keyword: "export-file",
            text: "😁导出单类文件",
            onClick: () => {
              const categoryV = controls.getValue("category");
              if (!categoryV) {
                ZiyaUtils.showTip("请填写种类", 1.5);
                return;
              }
              const curCategoryVData = getLocalExcelData(categoryV);
              if (curCategoryVData) {
                downloadWithIframeExcel([
                  ["重量(g)", categoryV],
                  ...curCategoryVData.map((i) => [i.weight, i.freightFee]),
                ]);
              }
            },
          },
          {
            type: "button",
            keyword: "export-merge-file",
            text: "🎉导出全类文件",
            onClick: () => {
              const curCategoryVData = getLocalExcelData();
              console.log("curCategoryVData", curCategoryVData);
              if (curCategoryVData) {
                downloadWithIframeExcel([
                  ["重量(g)", ...Object.keys(curCategoryVData)],
                  ...convertToRows(curCategoryVData),
                ]);
              }
            },
          },
        ],
        `
          #${ID} {
            display: flex;
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
