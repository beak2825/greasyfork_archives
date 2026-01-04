// ==UserScript==
// @name         东南研究生人文素质讲座脚本
// @namespace    http://nic.seu.edu.cn/
// @version      1.2
// @description  东南大学研究生抢讲座
// @match        *://ehall.seu.edu.cn/gsapp/sys/jzxxtjapp/*
// @icon         http://pic.5tu.cn/uploads/allimg/1510/081431395820.jpg
// @match        http://ehall.seu.edu.cn/gsapp/sys/jzxxtjapp/*default/index.do?t_s=1712476611421&EMAP_LANG=zh&THEME=indigo&amp_sec_version_=1&gid_=MGRuVDdWWVRkaWkvSG5VcTBONHpjVjg2dU9BT0dNMEpQNGdiNUQ2dzQyUVJFTHFCK3V5M3BzTkdsRmdBckhxeW41Y0tGVEtiYkEyaWM1ZHBrWUY4OUE9PQ
// @icon         https://www.google.com/s2/favicons?sz=64&domain=seu.edu.cn
// @require      https://ajax.googleapis.com/ajax/libs/jquery/3.3.1/jquery.min.js
// @grant        unsafeWindow
// @grant        GM_setValue
// @grant        GM_getValue
// @license      MIT
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/556973/%E4%B8%9C%E5%8D%97%E7%A0%94%E7%A9%B6%E7%94%9F%E4%BA%BA%E6%96%87%E7%B4%A0%E8%B4%A8%E8%AE%B2%E5%BA%A7%E8%84%9A%E6%9C%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/556973/%E4%B8%9C%E5%8D%97%E7%A0%94%E7%A9%B6%E7%94%9F%E4%BA%BA%E6%96%87%E7%B4%A0%E8%B4%A8%E8%AE%B2%E5%BA%A7%E8%84%9A%E6%9C%AC.meta.js
// ==/UserScript==
// author: hly
console.log("SEU Lecture Book Script Loaded");

setTimeout(function () {
  document.querySelector("body > main > article > div").style.display = "none";
  // Hoist all_wid to be accessible in the wider scope
  let all_wid;

  //===============verify code===============
  let newVcode = document.createElement("img");
  newVcode.id = "tempImage";
  let verifyCode = document.createElement("input");
  verifyCode.id = "tempInput";
  verifyCode.style = "width:6em; height:1.2em; ";
  verifyCode.placeholder = "请输入验证码";
  let flashBtn = document.createElement("button");
  flashBtn.textContent = "获取验证码";
  flashBtn.style = "width:6em; font-size: 1.0em; margin-right:3em";
  flashBtn.addEventListener("click", function () {
    let temp_data = BH_UTILS.doSyncAjax(
      baseUrl + "/hdyy/vcode.do" + "?_=" + new Date().getTime(),
      {}
    );
    $("#tempImage").attr("src", temp_data.result);
  });

  $("h2").append(newVcode);
  $("h2").append(verifyCode);
  $("h2").append(flashBtn);

  newVcode.addEventListener("click", function () {
    let temp_data = BH_UTILS.doSyncAjax(
      baseUrl + "/hdyy/vcode.do" + "?_=" + new Date().getTime(),
      {}
    );
    $("#tempImage").attr("src", temp_data.result);
  });

  //===============time setting===============
  // Create a new time input
  let timeInput = document.createElement("input");
  timeInput.type = "time";
  timeInput.id = "myTime";
  $("h2").append(timeInput);

  //===============lecture setting===============
  let selectList = document.createElement("select");
  selectList.id = "mySelect";
  $("h2").append(selectList);

  function updateLectureList() {
    console.log("更新当前页面讲座列表...");
    // Scope the search to the table to avoid grabbing other WIDs on the page
    all_wid = $("#card_hdlb [data-x-wid]").map(function () {
        return $(this).attr("data-x-wid");
      })
      .get();

    $(selectList).empty(); // Clear existing options

    for (let i = 1; i <= all_wid.length; i++) {
      let option = document.createElement("option");
      option.value = i;
      option.text = i.toString();
      selectList.appendChild(option);
    }
    console.log(`发现该页面有 ${all_wid.length} 个讲座.`);
  }

  // Initial population of the dropdown
  updateLectureList();

  // Set up a MutationObserver to watch for table content changes (pagination)
  const targetNode = document.querySelector("#card_hdlb tbody");
  if (targetNode) {
    const config = { childList: true };
    const callback = function (mutationsList, observer) {
      // A brief delay to ensure the DOM is fully updated after the change.
      setTimeout(updateLectureList, 200);
    };
    const observer = new MutationObserver(callback);
    observer.observe(targetNode, config);
    console.log("Pagination observer 已激活");
  } else {
    console.error("无法找到讲座表格以观察分页.");
  }


  let submitBtn = document.createElement("button");
  submitBtn.textContent = "√";
  submitBtn.addEventListener("click", function () {
    let selectedTimeValue = document.getElementById("myTime").value;
    if (selectedTimeValue) {
      let [hours, minutes] = selectedTimeValue.split(":");
      let selectedTime = new Date();
      selectedTime.setHours(+hours);
      selectedTime.setMinutes(+minutes);
      selectedTime.setSeconds(0);
      selectedTime.setMilliseconds(0);

      let diff = selectedTime.getTime() - new Date().getTime();
      let verifyCode = $("#tempInput").val();
      diff += 100;

      let lectureId = selectList.value;

      if (diff < 0) {
        alert("The selected time is in the past. Please select a future time.");
      } else {
        alert(
          `将于${
            diff / 1000
          }s后抢第${lectureId}个课, 验证码为${verifyCode},点击ok后耐心等待`
        );
        let foo = { HD_WID: all_wid[lectureId - 1], vcode: verifyCode };
        console.log(foo);
        setTimeout(function () {
          let attempts = 0;
          const maxAttempts = 100;
          let currentIntervalMin = 220;
          // const currentIntervalMax = 1000;
          // const intervalIncrease = 200;

          function tryToBook() {
            if (attempts >= maxAttempts) {
              alert(`已尝试 ${maxAttempts} 次，抢座失败，脚本停止。`);
              return;
            }

            attempts++;
            console.log(`正在进行第 ${attempts} 次尝试...`);

            BH_UTILS.doAjax(baseUrl + "/hdyy/yySave.do", {
              paramJson: JSON.stringify(foo),
            })
              .done(function (data) {
                console.log("服务器返回:", data.msg);

                // Change the success condition to check for `data.success === true`
                if (data.success === true) {
                  alert(`抢座成功！服务器返回: ${JSON.stringify(data)}`);
                } else if (data.msg && data.msg.includes("人数已满")) {
                  // If the lecture is full, stop immediately.
                  alert(
                    `讲座已满，无需重试: "${data.msg}"。脚本已停止。`
                  );
                } else {
                  // For other errors (e.g., "not in booking time", "system busy"), retry.
                  console.log(`第 ${attempts} 次尝试失败，消息: ${data.msg}`);
                  // if (attempts < maxAttempts) {
                  //   const interval = currentIntervalMin;
                  //   console.log(`${interval}ms 后进行下一次尝试...`);
                  //   setTimeout(tryToBook, interval);
                  //   // 增加下次重试的基础间隔，第1s内不增加，后面再增加
                  //   // 更正,直接不增加了
                  //   // if (attempts >= 3) {
                  //   //   currentIntervalMin += intervalIncrease;
                  //   // }
                  // } else {
                  //   alert(
                  //     `已尝试 ${maxAttempts} 次，抢座失败，脚本停止。\n最后一次服务器消息: ${data.msg}`
                  //   );
                  // }
                }
              })
              .fail(function (jqXHR, textStatus, errorThrown) {
                console.error("请求失败，详细信息:", {
                  status: jqXHR.status,
                  statusText: jqXHR.statusText,
                  responseText: jqXHR.responseText,
                  textStatus: textStatus,
                  errorThrown: errorThrown,
                });
                console.log(`第 ${attempts} 次尝试时请求失败(网络错误)。`);
                if (attempts < maxAttempts) {
                  const interval = currentIntervalMin;
                    console.log(`${interval}ms 后进行下一次尝试...`);
                    setTimeout(tryToBook, interval);
                    // 增加下次重试的基础间隔，第1s内不增加，后面再增加
                    // 更正,直接不增加了
                    // if (attempts >= 3) {
                    //   currentIntervalMin += intervalIncrease;
                    // }
                } else {
                  alert(
                    `已尝试 ${maxAttempts} 次，因网络错误抢座失败，脚本停止。\n请按F12打开控制台查看详细错误信息。`
                  );
                }
              });
          }

          tryToBook(); // 开始第一次尝试
        }, diff);
      }
    } else {
      alert("Please select a time.");
    }
  });

  $("h2").append(submitBtn);
}, 1200);
