// ==UserScript==
// @name         HLTIME
// @namespace    http://tampermonkey.net/
// @version      2025-09-09
// @description  计算工时
// @author       You
// @match        https://ssomanager.133.cn/manager/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=133.cn
// @grant GM_setValue
// @grant GM_getValue
// @grant GM_deleteValue
// @grant GM_addStyle
// @license GPL
// @downloadURL https://update.greasyfork.org/scripts/548917/HLTIME.user.js
// @updateURL https://update.greasyfork.org/scripts/548917/HLTIME.meta.js
// ==/UserScript==

(function() {
    'use strict';
    const csstr = `.hlbtnT{
    color: sandybrown;
    margin-left: 10px;
    line-height: 40px;
    font-size: 17px;
}

.hlbtnBg{

    background-color:orange;
    color: #f0f0f0;
    padding-left: 20px;
    padding-right: 20px;
    height: 30px;
    border-radius: 20px;
    font-size: 15px;
    display: flex;
    align-items: center;
    justify-content: center;

}

.hlxxx{
    width: 150%;
    flex-direction: row;
    display: flex;
    justify-content:space-between;
    align-items: center;
    padding: 0 0.5em;

    border-radius: 5px;

}


.hlxxdesc{
    font-size: 1.3em;
    color: #888;
    font-weight: 600;
    text-align: left;

}`

        GM_addStyle(csstr)


    !(async function () {
  var __DB;
  async function genDbKey(key) {
    var name = document.querySelector(".userInfo").innerText;
    name = name.substring(name.length - 3);
    const encoder = new TextEncoder();
    const data = encoder.encode("" + key + name);
    const hashBuffer = await crypto.subtle.digest("SHA-256", data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray
      .map((byte) => byte.toString(16).padStart(2, "0"))
      .join("");
    return hashHex;
  }

  async function getDb() {
    if (__DB) {
      return __DB;
    }

    return new Promise((r) => {
      const request = indexedDB.open("hlxxx", 1);
      request.onupgradeneeded = function (event) {
        __DB = event.target.result;
        const objectStore = __DB.createObjectStore("myObjectStore", {
          keyPath: "key",
        });
      };

      request.onerror = function (event) {
        console.error("Error opening database:", event.target.error);
        r(null);
      };

      request.onsuccess = function (event) {
        __DB = event.target.result;
        // 在此处进行数据操作
        console.log("create db succ");
        r(__DB);
      };
    });
  }

  var _KEYOBJ;
  async function genEncKey() {
    if (_KEYOBJ) {
      return _KEYOBJ;
    }
    var substl = crypto.subtle;
    let keyRaw = new TextEncoder().encode("了991");

    let key = await substl.importKey("raw", keyRaw, "PBKDF2", false, [
      "deriveBits",
    ]);

    let salt = "盐烟衍嫣彦燕言";

    let pbkdf2 = {
      name: "PBKDF2",
      hash: "SHA-256",
      iterations: 2,
      salt: new TextEncoder().encode(salt),
    };
    let af = await substl.deriveBits(pbkdf2, key, 256);
    let arrPri = new Uint8Array(af);

    _KEYOBJ = await substl.importKey("raw", arrPri, "AES-CBC", false, [
      "decrypt",
      "encrypt",
    ]);
    return _KEYOBJ;
  }

  async function encryptData(data) {
    let dataraw = new TextEncoder().encode(data);

    const iv = crypto.getRandomValues(new Uint8Array(16)); // 生成随机的初始向量 IV
    const encrypted = await crypto.subtle.encrypt(
      { name: "AES-CBC", iv: iv, length: 256 },
      await genEncKey(),
      dataraw
    );
    return { encryptedData: new Uint8Array(encrypted), iv: iv };
  }



  async function decryptData(dataObj) {
    try {
      var plain = await crypto.subtle.decrypt(
        { name: "AES-CBC", iv: dataObj.iv, length: 256 },
        await genEncKey(),
        dataObj.encryptedData
      );
      return new TextDecoder().decode(plain);
    } catch (error) {
      return null;
    }
  }

  async function setCache(key0, value) {
    key0 = await genDbKey(key0);
    if (value) {
      value = await encryptData(value);
    }

    var db = await getDb();
    const transaction = db.transaction(["myObjectStore"], "readwrite");
    const objectStore = transaction.objectStore("myObjectStore");

    // 使用 add 方法添加数据，数据对象中必须包含 "customId" 字段作为主键
    const request = objectStore.put({ key: key0, value: value });

    request.onsuccess = function (event) {
      console.log("Data added to the database.");
    };

    request.onerror = function (event) {
      console.error("Error adding data to the database:", event.target.error);
    };
  }

  async function getCache(key0) {
    key0 = await genDbKey(key0);
    var db = await getDb();
    const transaction = db.transaction(["myObjectStore"], "readonly");
    const objectStore = transaction.objectStore("myObjectStore");
    const request = objectStore.get(key0);
    return new Promise((r) => {
      request.onsuccess = async function (event) {
        const data = event.target.result;
        if (data && data.value) {
          let v = await decryptData(data.value);
          r(v);

          return;
        }
        r(null);
      };
      request.onerror = function (event) {
        console.error(
          "Error retrieving data from the database:",
          event.target.error
        );
        r(null);
      };
    });
  }

  async function doTask() {
    if (!/manager\/views\/inner.html/.test(window.location.href)) {
      console.log("0-0000000000000000000000000000");
      return;
    }

    /// 从前一个月28到这个月28
    const StartDay = 28;

    var g_data = {};

    const NoonSleep2 = 2 * 3600;
    const NoonSleep1 = 1 * 3600;
    const keySleep = "rJOIEc";
    var stime = localStorage.getItem(keySleep);
    stime = parseInt("" + stime);
    var resestTime = NoonSleep2;
    if (stime == NoonSleep1 || NoonSleep2 == stime) {
      resestTime = stime;
    }

    function getTimeValue(t) {
      if (t) {
        var timeComponets = t.split(":");
        if (timeComponets.length == 3) {
          return (
            parseInt(timeComponets[0]) * 3600 +
            parseInt(timeComponets[1]) * 60 +
            parseInt(timeComponets[2])
          );
        }
      }
    }

    function timeValueToStr(sum) {
      let h = Math.floor(sum / 3600);
      let m = Math.floor((sum - h * 3600) / 60);
      let s = sum % 60;

      return `${h}:${m}:${s}`;
    }

    async function wait(t) {
      return new Promise((r, j) => {
        setTimeout(() => {
          r(1);
        }, t * 1000);
      });
    }

    async function getCheckInData() {
      while (document.querySelector(".fc-center > h2:nth-child(1)") == null) {
        await wait(0.5);
      }

      var host = location.host;
      return new Promise((r) => {
        var httpRequest = new XMLHttpRequest();
        httpRequest.open(
          "POST",
          `https://${host}/manager/attendance/querylistByUser`,
          true
        );
        httpRequest.setRequestHeader(
          "Content-type",
          "application/x-www-form-urlencoded"
        );

        let date = document
          .querySelector(".fc-center > h2:nth-child(1)")
          .innerText.replace(/年|月/g, "");
        httpRequest.send("recordDateStr=" + date + "&userName=");
        httpRequest.onreadystatechange = function () {
          //请求后的回调接口，可将请求成功后要执行的程序写在其中
          if (httpRequest.readyState == 4 && httpRequest.status == 200) {
            //验证请求是否发送成功
            try {
              var jsonStr = httpRequest.responseText; //获取到服务端返回的数据
              var json = JSON.parse(jsonStr);
              console.log("result", json);

              let bjDate = beijingDate();

              let y = parseInt(bjDate.split("-")[0]);
              let m = parseInt(bjDate.split("-")[1]);

              let y2 = parseInt(date.split("-")[0]);
              let m2 = parseInt(date.split("-")[1]);

              if (y * 10000 + m > y2 * 10000 + m2) {
                console.log("缓存", date);
                setCache(date, jsonStr);
              } else {
                console.log("不  缓存", date);
              }

              r(json);
            } catch (error) {
              console.log(error);
              r(null);
            }
          }
        };
      });
    }

    function beijingDate() {
      return new Date(Date.now() + 8 * 3600000).toISOString().substring(0, 10);
    }

    async function getTipStr(json) {
      let ymd = beijingDate();
      let today = "" + parseInt(ymd.substring(8, 10));

      let date = document
        .querySelector(".fc-center > h2:nth-child(1)")
        .innerText.replace(/年|月/g, "");

      var showStr = "" + date;

      {
        var sum = 0;
        var dayC = 0;

        var sumAll = 0;
        for (var i = 1; i < 32; i++) {
          const element = json.data["" + i];

          if (!element) {
            break;
          }

          if (element.startTime && element.endTime) {
            var s = getTimeValue(element.startTime);
            var e = getTimeValue(element.endTime);
            if (e && s && e - s > 3600) {
              var worktitme = e - s - resestTime;
              worktitme = worktitme > 0 ? worktitme : 0;
              sum += worktitme - 8 * 3600;
              sumAll += worktitme;

              dayC += 1;
            }

            /// 补卡 扣30分钟工作时长
            if (element.isLeave == "3") {
              sum -= 30 * 60;
              sumAll -= 30 * 60;
            }
          }
        }

        let timeNotEnough = 0;
        if (sum < 0) {
          sum = -sum;
          timeNotEnough = 1;
        }

        let avg = sumAll / (dayC * 3600);

        showStr += `\nTotal:  ${timeNotEnough ? "- " : "+ "}${(
          sum / 3600
        ).toFixed(2)}\nAvg:    ${(sumAll / 3600).toFixed(
          2
        )}/${dayC} = ${avg.toFixed(2)}`;

        showStr += '\n'

        if (date != null) {
          let y = parseInt(date.split("-")[0]);
          let m = parseInt(date.split("-")[1]);
          m -= 1;
          if (m == 0) {
            m = 12;
            y -= 1;
          }

          var key = `${y}-${m}`;
          console.log("pre", key);
          var preDataStr = await getCache(key);
          if (preDataStr) {
            var preData = JSON.parse(preDataStr);
            var dataInfo = preData.data;

            var preMonthWork = 0;

            var preDayC = 0;

            /// 上个月
            //  StartDay
            for (let i = StartDay; i <= 31; i++) {
              let ele = dataInfo[`${i}`];
              if (ele && ele.isHoliday == "0") {
                var s = getTimeValue(ele.startTime);
                var e = getTimeValue(ele.endTime);
                if (e && s && e - s > 3600) {
                  var worktitme = e - s - resestTime;
                  worktitme = worktitme > 0 ? worktitme : 0;
                  preMonthWork += worktitme;

                  preDayC += 1;
                }

                /// 补卡 扣30分钟工作时长
                if (ele.isLeave == "3") {
                  preMonthWork -= 30 * 60;
                }
              }
            }

            var currentWork = 0;
            var currentDayC = 0;

            for (let i = 0; i < StartDay; i++) {
              let ele = json.data[`${i}`];
              if (ele && ele.isHoliday == "0") {
                var s = getTimeValue(ele.startTime);
                var e = getTimeValue(ele.endTime);
                if (e && s && e - s > 3600) {
                  var worktitme = e - s - resestTime;
                  worktitme = worktitme > 0 ? worktitme : 0;
                  currentWork += worktitme;
                  currentDayC += 1;
                }

                /// 补卡 扣30分钟工作时长
                if (ele.isLeave == "3") {
                  currentWork -= 30 * 60;
                }
              }
            }

            var total = (currentWork + preMonthWork) / 3600;

            console.log("preMonth", preMonthWork, preDayC);

            showStr += `\nPre28:  ${(
              (preMonthWork - 8 * preDayC * 3600) /
              3600
            ).toFixed(2)}`;

            const totalDlt = (total - (currentDayC + preDayC) * 8)
            showStr += `\nTotal: ${totalDlt.toFixed(2)} = ${(totalDlt * 60).toFixed(1)} 分`

            showStr += `\nAvg28:  ${total.toFixed(2)}/${
              currentDayC + preDayC
            } = ${(total / (currentDayC + preDayC)).toFixed(2)}`;


          } else {
            showStr += "\nNo Last Month Data";
          }
        }

        {
          let todayData = json.data[today];

          if (
            todayData["recordDate"] ==
            new Date(new Date().getTime() + 8 * 3600000)
              .toISOString()
              .substring(0, 10)
          ) {
            let todayStart = todayData.startTime;
            let v1 = getTimeValue(todayStart);
            console.log("today,", todayData, todayStart, resestTime);
            /// + 60 按分钟
            let v2 = v1 + 8 * 3600 + resestTime + 60;
            if (v2 < getTimeValue("18:00:00")) {
              v2 = getTimeValue("18:00:00");
            }
            if (!isNaN(v2)) {
              showStr += `\ntoday:  ${timeValueToStr(v2)}`;
            }
          }
        }

        return showStr;
      }
      return "error";
    }

    function updateTip(str) {
      /// 当前不在考勤页面,3s 后重试
      if (!/attenmanager\/listuseratten/.test(window.location.href)) {
        setTimeout(() => {
          updateTip(str);
        }, 3000);
        return;
      }

      var d = document.evaluate(
        '//button[contains(@class,"fc-next-button")]/..',
        document,
        null,
        XPathResult.FIRST_ORDERED_NODE_TYPE
      );
      if (d && d.singleNodeValue) {
        var div = d.singleNodeValue;

        var node = document.getElementById("re0091");
        var nodeBtn = document.getElementById("re0092");
        if (!node) {
          var nodeFather = document.createElement("div");
          nodeFather.setAttribute("class", "hlxxx");
          div.appendChild(nodeFather);

          node = document.createElement("pre");
          node.setAttribute("id", "re0091");
          node.setAttribute("class", "hlxxdesc");
          nodeFather.appendChild(node);

          nodeBtn = document.createElement("div");
          nodeBtn.setAttribute("id", "re0092");
          nodeBtn.setAttribute("class", "hlbtnBg");
          nodeBtn.onclick = async () => {
            console.log("xxxab");
            resestTime = resestTime == NoonSleep2 ? NoonSleep1 : NoonSleep2;
            localStorage.setItem(keySleep, "" + resestTime);
            let strNewTip = await getTipStr(g_data);
            updateTip(strNewTip);
            console.log("xxxa");
          };
          nodeFather.appendChild(nodeBtn);

          var nodeBtn2 = document.createElement("div");
          nodeBtn2.setAttribute("id", "reX0092");
          nodeBtn2.setAttribute("class", "hlbtnBg");
          nodeBtn2.onclick = async () => {
            fresh();
          };
          nodeBtn2.innerText = "换月重算";
          nodeFather.appendChild(nodeBtn2);
        }
        node.innerText = str;
        nodeBtn.innerText = `午休${resestTime / 3600}h,点击切换`;
        console.log("xxx", nodeBtn.innerText);
      } else {
        setTimeout(() => {
          updateTip(str);
        }, 1000);
      }
    }

    async function fresh() {
      g_data = await getCheckInData();
      var str = await getTipStr(g_data);
      updateTip(str);
    }

    fresh();
  }

  var pushState = history.pushState;
  history.pushState = function (data, unused, url) {
    pushState(data, unused, url).bind(history);
    setTimeout(() => {
      doTask();
    }, 10);
  };
  doTask();
})();

})();