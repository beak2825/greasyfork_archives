// ==UserScript==
// @name         zzuli统一身份认证自服务平台资料可编辑
// @version      1.0
// @license      MIT
// @description  让资料页面所有字段可编辑，恢复上传图片，请将手机号，身份证号手动补全，避免影响学校信息。仅供学习参考，请勿用于违法用途。
// @author       Dogxi | dogxi.me
// @match        https://kys.zzuli.edu.cn/authentication/authentication/views/userinfo/userinfo.html
// @icon         https://kys.zzuli.edu.cn/favicon.ico
// @grant        none
// @namespace https://greasyfork.org/users/1436051
// @downloadURL https://update.greasyfork.org/scripts/550124/zzuli%E7%BB%9F%E4%B8%80%E8%BA%AB%E4%BB%BD%E8%AE%A4%E8%AF%81%E8%87%AA%E6%9C%8D%E5%8A%A1%E5%B9%B3%E5%8F%B0%E8%B5%84%E6%96%99%E5%8F%AF%E7%BC%96%E8%BE%91.user.js
// @updateURL https://update.greasyfork.org/scripts/550124/zzuli%E7%BB%9F%E4%B8%80%E8%BA%AB%E4%BB%BD%E8%AE%A4%E8%AF%81%E8%87%AA%E6%9C%8D%E5%8A%A1%E5%B9%B3%E5%8F%B0%E8%B5%84%E6%96%99%E5%8F%AF%E7%BC%96%E8%BE%91.meta.js
// ==/UserScript==

(function () {
  "use strict";

  // 1. 解除所有readonly属性
  function makeEditable() {
    document.querySelectorAll("input[readonly]").forEach(function (input) {
      input.removeAttribute("readonly");
    });
  }

  // 2. 恢复“上传图片”按钮
  function restoreUploadButton() {
    if (!document.getElementById("upload")) {
      let uploadBox = document.getElementById("uploadBox");
      if (uploadBox) {
        let btn = document.createElement("button");
        btn.type = "button";
        btn.className = "layui-btn";
        btn.id = "upload";
        btn.textContent = "上传图片";
        uploadBox.insertBefore(btn, uploadBox.firstChild);

        // 触发layui的upload.render
        if (typeof window.layui !== "undefined" && layui.upload) {
          setTimeout(function () {
            layui.upload.render({
              elem: "#upload",
              url: window.baseUrl + "public/photoUpload",
              accept: "images",
              exts: "png|jpg|gif|jpeg",
              size: 1024,
              done: function (res, index, upload) {
                if (res.success == true) {
                  document.getElementById("appImages").src =
                    window.baseUrl +
                    "/public/getImg?path=" +
                    encodeURI(res.obj);
                  document.getElementById("imgSrc").value = res.obj;
                  layui.layer.msg(res.msg);
                } else {
                  layui.layer.msg(res.msg);
                }
              },
            });
          }, 1000);
        }
      }
    }
  }

  // 3. 自动插入“角色”字段
  function insertRoleField() {
    if (!document.querySelector('input[name="role"]')) {
      let form = document.getElementById("dataForm");
      if (form) {
        let div = document.createElement("div");
        div.className = "layui-form-item";
        div.innerHTML = `
                    <label class="layui-form-label">角色</label>
                    <div class="layui-input-inline">
                        <input type="text" name="role" value="1" class="layui-input">
                        <span style="color:#888;font-size:12px;">（1=超级管理员，2=普通管理员，3=审核员，4=编辑人员）</span>
                    </div>
                `;
        form.insertBefore(div, form.firstChild);
      }
    }
  }

  // 4. 显示/插入“确认修改”按钮，并重写其点击事件
  function showAndFixSubmitButton() {
    let submitBtn = document.getElementById("submit");
    if (!submitBtn) {
      let form = document.getElementById("dataForm");
      if (form) {
        submitBtn = document.createElement("a");
        submitBtn.className = "layui-btn";
        submitBtn.id = "submit";
        submitBtn.textContent = "确认修改";
        submitBtn.style.margin = "10px";
        form.appendChild(submitBtn);
      }
    } else {
      submitBtn.style.display = "";
    }

    // 重写点击事件
    submitBtn.onclick = function (e) {
      e.preventDefault();

      // 获取表单数据
      var form = document.getElementById("dataForm");
      var formData = new FormData(form);
      var jsonStr = {};
      for (var [key, value] of formData.entries()) {
        jsonStr[key] = value;
      }
      var memberRemarks = document.getElementById("memberRemarks")
        ? document.getElementById("memberRemarks").value
        : "";

      // 你可以在这里手动修改jsonStr的内容，比如
      // jsonStr.memberNickname = "你的新昵称";
      // jsonStr.memberImage = "你的图片路径";

      var baseUrl =
        window.baseUrl || "https://kys.zzuli.edu.cn/authentication/";

      var xhr = new XMLHttpRequest();
      xhr.open("POST", baseUrl + "/member/updateMember");
      xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
      xhr.onload = function () {
        // 尝试弹窗友好提示
        //try {
        //    var resp = JSON.parse(xhr.responseText);
        //  alert(xhr.responseText);
        //} catch {
        //    alert(xhr.responseText);
        //}
        alert(xhr.responseText);
      };
      xhr.send(
        "jsonStr=" +
          encodeURIComponent(JSON.stringify(jsonStr)) +
          "&memberRemarks=" +
          encodeURIComponent(memberRemarks)
      );
    };
  }

  // 5. 自动执行
  function init() {
    makeEditable();
    insertRoleField();
    showAndFixSubmitButton();
    restoreUploadButton();
  }

  // 6. 监听layui加载完毕后再执行
  function waitForLayui() {
    if (typeof window.layui !== "undefined" && layui.upload) {
      setTimeout(init, 500);
    } else {
      setTimeout(waitForLayui, 500);
    }
  }
  waitForLayui();

  // 7. 允许用户手动再次执行
  window.makeUserInfoEditable = init;
})();