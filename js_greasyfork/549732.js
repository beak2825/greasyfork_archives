// ==UserScript==
// @name         联通党校-刷课程，可秒刷-indev
// @namespace    https://gitee.com/zouyongs/js-liantongdangxiao
// @version      2.43
// @description  联通党校刷课程视频。1.专题页可选课程刷课。2.在课程详情页可直接刷当前课程。
// @author       ZouYs,coralfox,CountZero
// @match        https://m.campus.chinaunicom.cn/*
// @match        *://*campus.chinaunicom.cn/*
// @include      /^https?:\/\/[^\/]*campus\.chinaunicom[^\/]*\/.*$/
// @icon         data:image/x-icon;base64,AAABAAEAICAAAAEAIACoEAAAFgAAACgAAAAgAAAAQAAAAAEAIAAAAAAAABAAABILAAASCwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAJwDlACcA5QAnAOUAJwDlACcA5QAnAOUAAAAAACcA5QAnAOUAJwDlACcA5QAnAOUAJwDlACcA5QAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAJwDlACcA5QAnAOUAJwDlBScA5RonAOUXJwDlAycA5QAnAOUAJwDlACcA5QAnAOUKJwDlHicA5RQnAOUBJwDlACcA5QAnAOUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACcA5QAnAOUAJwDlAicA5UInAOWmJwDlzycA5cwnAOWeJwDlOCcA5QAnAOUJJwDlXCcA5bcnAOXTJwDlyicA5Y0nAOUgJwDlACcA5QAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAJwDlACcA5QAnAOVQJwDl5ScA5f8nAOX/JwDl/ycA5f8nAOXcJwDlVScA5YAnAOX1JwDl/ycA5f8nAOX/JwDl/ycA5bwnAOUiJwDlACcA5QAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAnAOUAJwDlEycA5cInAOX/JwDl/ScA5eEnAOXjJwDl/icA5f8nAOXvJwDl9ycA5f8nAOX6JwDl2icA5esnAOX/JwDl/ycA5YAnAOUCJwDlAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACcA5QAnAOU7JwDl7ScA5f8nAOXKJwDlKCcA5S0nAOW4JwDl/ycA5f8nAOX/JwDl+icA5YwnAOUYJwDlVCcA5e4nAOX/JwDlvicA5RAnAOUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAJwDlACcA5UQnAOXwJwDl/ycA5bQnAOUGJwDlDCcA5ZonAOX/JwDl/ycA5f8nAOXwJwDlVycA5QAnAOUsJwDl4icA5f8nAOXIJwDlEycA5QAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAnAOUAJwDlIScA5dsnAOX/JwDl8ycA5XMnAOVqJwDl9ycA5f8nAOX/JwDl/ycA5f8nAOXRJwDlOycA5aAnAOX+JwDl/ycA5Z0nAOUGJwDlAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACcA5QAnAOUAJwDlACcA5QAnAOUAJwDlACcA5QAnAOUEJwDlfCcA5fonAOX/JwDl8icA5Z4nAOXGJwDl9ycA5ZonAOW5JwDl8icA5aMnAOW1JwDl/CcA5f8nAOXlJwDlQicA5QAnAOUAJwDlACcA5QAnAOUAJwDlACcA5QAAAAAAJwDlACcA5QAnAOUZJwDlPicA5UQnAOUkJwDlAicA5QAnAOUNJwDlhycA5fknAOX/JwDl8CcA5Z4nAOVqJwDlDScA5R8nAOV8JwDlvycA5f8nAOX/JwDl6CcA5V0nAOUCJwDlACcA5QwnAOU0JwDlRicA5TInAOUKJwDlACcA5QAnAOUDJwDlVScA5cgnAOXyJwDl+CcA5dgnAOWDJwDlFCcA5QwnAOVaJwDlnScA5fgnAOX/JwDl8icA5XInAOUEJwDlHycA5bMnAOX/JwDl/ycA5egnAOWSJwDlQScA5QAnAOU1JwDlrScA5eknAOX6JwDl5ycA5aYnAOUpJwDlACcA5VcnAOXnJwDl/ycA5f8nAOX/JwDl/ycA5f0nAOWlJwDllCcA5fInAOWkJwDlnicA5fknAOX/JwDl8icA5YcnAOW2JwDl/ycA5f8nAOXpJwDlmicA5dMnAOXbJwDlfCcA5dMnAOX/JwDl/ycA5f8nAOX/JwDl/ycA5bonAOUdJwDlwycA5f8nAOX+JwDlvScA5aEnAOXsJwDl/ycA5f8nAOX+JwDl/ycA5ewnAOVSJwDlhycA5fgnAOX/JwDl/ScA5f8nAOX/JwDl6ScA5WInAOWSJwDl/ycA5f8nAOX9JwDl/ycA5f8nAOXWJwDllicA5d8nAOX/JwDl+ycA5XMnAOX3JwDl/ycA5eMnAOUxJwDlAicA5WonAOX2JwDl/ycA5f8nAOX9JwDlgScA5QYnAOULJwDlmicA5f8nAOX/JwDl/ycA5fInAOVlJwDlACcA5SMnAOXHJwDl/ycA5f8nAOX/JwDl2icA5TsnAOUAJwDlcycA5f4nAOX/JwDloCcA5fQnAOX/JwDl6ScA5UQnAOUVJwDljScA5fsnAOX/JwDl/ycA5f4nAOWjJwDlFCcA5R8nAOW4JwDl/ycA5f8nAOX/JwDl9ycA5XYnAOUFJwDlQScA5dsnAOX/JwDl/ycA5f8nAOXiJwDlUScA5Q8nAOWHJwDl/ycA5f8nAOWcJwDltCcA5f8nAOX/JwDl3icA5c8nAOX6JwDl/ycA5fcnAOXyJwDl/ycA5e8nAOVuJwDlsycA5f8nAOX/JwDl8CcA5fonAOX/JwDl8ycA5XgnAOWUJwDl/ycA5f8nAOXvJwDl/ScA5f8nAOXrJwDlyicA5fAnAOX/JwDl8ycA5WAnAOU+JwDl1ScA5f8nAOX/JwDl/ycA5f8nAOXyJwDldycA5WUnAOXcJwDloycA5b8nAOX/JwDl/ycA5d0nAOVXJwDliicA5fknAOX/JwDl8icA5ZEnAOWxJwDluicA5UgnAOWzJwDl/ycA5f8nAOX/JwDl/ycA5f4nAOWcJwDlECcA5QAnAOU5JwDlpScA5dMnAOXZJwDlvCcA5VsnAOUGJwDlAScA5U8nAOXAJwDl/ycA5f8nAOXdJwDlTCcA5QAnAOUMJwDljScA5fgnAOX/JwDl8ScA5Y8nAOUoJwDlACcA5RwnAOWGJwDlyicA5donAOXIJwDlficA5RUnAOUAJwDlACcA5QAnAOUFJwDlHicA5SQnAOUPJwDlACcA5QAnAOUgJwDlsicA5f8nAOX/JwDl2ycA5YYnAOWAJwDlGCcA5UAnAOWbJwDlpicA5fgnAOX/JwDl+CcA5YYnAOUJJwDlACcA5QAnAOUWJwDlJicA5RQnAOUAJwDlACcA5QAAAAAAJwDlACcA5QAnAOUAJwDlACcA5QAnAOUAJwDlCCcA5ZwnAOX/JwDl/ycA5dwnAOWBJwDl0CcA5f0nAOW4JwDl2CcA5f8nAOW5JwDloicA5fgnAOX/JwDl9CcA5VgnAOUAJwDlACcA5QAnAOUAJwDlACcA5QAnAOUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACcA5QAnAOUsJwDl5icA5f8nAOXjJwDlSicA5U0nAOXoJwDl/ycA5f8nAOX/JwDl/ycA5csnAOUyJwDliScA5fonAOX/JwDlqycA5QonAOUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAJwDlACcA5UgnAOXxJwDl/ycA5a0nAOUAJwDlAScA5YsnAOX+JwDl/ycA5f8nAOXvJwDlUycA5QAnAOUlJwDl2ycA5f8nAOXIJwDlEycA5QAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAnAOUAJwDlMicA5eonAOX/JwDl1icA5U0nAOVXJwDl1ScA5f8nAOX/JwDl/ycA5fwnAOWzJwDlPycA5XgnAOX0JwDl/ycA5bUnAOUNJwDlAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACcA5QAnAOUOJwDlsicA5f8nAOX/JwDl8CcA5fMnAOX/JwDl/ycA5dQnAOXqJwDl/ycA5f4nAOXsJwDl9ycA5f8nAOX7JwDlbScA5QAnAOUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAJwDlACcA5QAnAOU1JwDlyScA5f8nAOX/JwDl/ycA5f4nAOW7JwDlLScA5V4nAOXhJwDl/ycA5f8nAOX/JwDl+CcA5ZonAOURJwDlACcA5QAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAnAOUAJwDlACcA5QAnAOUjJwDldycA5a8nAOWqJwDlbicA5RsnAOUAJwDlAScA5TcnAOWLJwDlsycA5aEnAOVdJwDlDicA5QAnAOUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAnAOUAJwDlACcA5QAnAOUAJwDlAScA5QEnAOUAJwDlACcA5QAnAOUAJwDlACcA5QAnAOUBJwDlACcA5QAnAOUAJwDlAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA////////////gQH//gAAf/wAAH/8AAA//AAAP/wAAD/8AAA//AAAPwAAAAEAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAgAAAAfwAAD/8AAA//AAAP/wAAD/8AAA//AAAf/4AAP////////////////8=
// @require      https://cdn.jsdelivr.net/npm/jsencrypt@2.3.1/bin/jsencrypt.min.js
// @require      https://fastly.jsdelivr.net/npm/jsencrypt@2.3.1/bin/jsencrypt.min.js
// @connect      app.campus.chinaunicom.cn
// @grant        unsafeWindow
// @grant        GM_xmlhttpRequest
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_deleteValue
// @downloadURL https://update.greasyfork.org/scripts/549732/%E8%81%94%E9%80%9A%E5%85%9A%E6%A0%A1-%E5%88%B7%E8%AF%BE%E7%A8%8B%EF%BC%8C%E5%8F%AF%E7%A7%92%E5%88%B7-indev.user.js
// @updateURL https://update.greasyfork.org/scripts/549732/%E8%81%94%E9%80%9A%E5%85%9A%E6%A0%A1-%E5%88%B7%E8%AF%BE%E7%A8%8B%EF%BC%8C%E5%8F%AF%E7%A7%92%E5%88%B7-indev.meta.js
// ==/UserScript==

(function () {
  "use strict";

  // 全局变量，以便不同UI函数可以访问
  var readyCheck = false;

  // [修改点]: 主入口函数
  function initializeScript() {
    // [新增功能]: 页面检测与UI选择
    const courseDetailsRegex = /course_courseDetails\/(\d+)/;
    const match = window.location.href.match(courseDetailsRegex);

    // 检查是否为课程详情页
    if (match) {
      const courseId = match[1];
      // 如果是，则渲染“刷当前课程”的专用UI
      renderSingleCourseUI(courseId);
    } else {
      // 否则，渲染原有的专题页面UI
      renderTopicUI();
    }
  }

  // [新增功能]: 渲染单个课程页面的UI
  function renderSingleCourseUI(courseId) {
    // 创建一个可拖动的小窗口
    let myWindow = document.createElement("div");
    myWindow.style.cssText = "width: 250px; height: 120px; background-color: #efefef; position: fixed; left: 50px; top: 150px; z-index: 1111; border: 1px solid #ccc; display: block; padding: 5px; box-shadow: 0 4px 8px rgba(0,0,0,0.1); border-radius: 5px;";
    document.body.appendChild(myWindow);

    // 添加可拖动的标题栏
    let myHeader = document.createElement("div");
    myHeader.style.cssText = "padding: 5px; cursor: move; z-index: 1112; background-color: #4CAF50; color: white; text-align: center; border-radius: 3px 3px 0 0;";
    myHeader.innerHTML = '<span>单个课程学习助手</span>';
    myWindow.appendChild(myHeader);
    makeDraggable(myWindow, myHeader); // 引用拖动函数

    // 添加UI内容
    let contentContainer = document.createElement("div");
    contentContainer.style.cssText = "padding-top: 10px; text-align: center;";
    contentContainer.innerHTML = `
        <button id="btn-begin-single" style="padding: 8px 16px; font-size: 16px; cursor: pointer; border: none; background-color: #2196F3; color: white; border-radius: 4px;">刷当前课程</button>
        <div id="waitInfo" style="color:blue; margin-top: 10px; height:20px; font-size: 14px;">准备就绪</div>
        <div style="background-color: #ddd; border-radius: 5px; margin-top: 5px; height: 10px;">
            <div id="myProgress" style="width: 0%; height: 10px; background-color: #4CAF50; border-radius: 5px;"></div>
        </div>
        <div id="progrssNum" style="font-size: 12px; margin-top: 2px;">0%</div>`;
    myWindow.appendChild(contentContainer);


    // 为新按钮绑定点击事件
    document.getElementById("btn-begin-single").addEventListener("click", async () => {
      const btn = document.getElementById("btn-begin-single");
      btn.disabled = true;
      btn.innerText = "正在处理...";

      try {
        showLog('正在获取课程章节信息...', 'blue', true);
        const kpointList = await getCourseInfo(courseId);

        if (!kpointList || kpointList.length === 0) {
          showLog('未能获取到课程章节。', 'red', false);
          btn.disabled = false;
          btn.innerText = "刷当前课程";
          return;
        }

        // 构造一个与 begin 函数兼容的课程对象
        const singleCourse = {
          id: courseId,
          child: kpointList
        };
        const totalSections = kpointList.length;

        showLog(`获取到 ${totalSections} 个章节，开始学习...`, 'orange', true);

        // 直接调用核心的 begin 函数来处理学习流程
        await begin([singleCourse], totalSections);

        showLog('当前课程已完成！', 'green', false);
        btn.innerText = "已完成";

      } catch (error) {
        showLog('发生错误: ' + error.message, 'red', false);
        btn.disabled = false;
        btn.innerText = "刷当前课程";
      }
    });
  }

  // [新增功能]: 实现窗口拖动逻辑的辅助函数
  function makeDraggable(element, handle) {
    let isDragging = false;
    let offsetX, offsetY;

    handle.addEventListener('mousedown', function (e) {
      isDragging = true;
      offsetX = e.clientX - element.getBoundingClientRect().left;
      offsetY = e.clientY - element.getBoundingClientRect().top;
      document.addEventListener('mousemove', onMouseMove);
      document.addEventListener('mouseup', onMouseUp);
    });

    function onMouseMove(e) {
      if (isDragging) {
        element.style.left = e.clientX - offsetX + 'px';
        element.style.top = e.clientY - offsetY + 'px';
      }
    }

    function onMouseUp() {
      isDragging = false;
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
    }
  }

  // [修改点]: 将原有的UI创建逻辑封装到此函数
  function renderTopicUI() {
    var helpHTMLSting = `<div style="width: 600px; height: 400px; overflow: auto;">
    <h1 style="color: red;text-align: center;font-weight: bold;font-size: 30px;">刷课-使用说明</h1>
    <div>
        <h3 style="font-weight: bold;font-size: 24px;">更新日志</h3>
        <h4>v2.43</h4>
        <text style="font-weight: bold">功能增强：可在课程详情页直接刷当前课程。</text><br>
        <br>
        <h4>v2.4</h4>
        <text style="font-weight: bold">临时修复党校更新后导致的失效问题，使用AI辅助编码。原作者更新后删库。</text><br>
        <text style="font-weight: bold">该版本更新者：CountZero</text><br>
        <br>
        <h4>v2.32</h4>
        <text style="font-weight: bold">1.修复showlog未定义问题(注释掉^-^,不好大改)。</text><br>
        <br>
        <h4>v2.2</h4>
        <text style="font-weight: bold">1.修复单次请求学习时长上限为179s。</text><br>
        <text>注意：仍采用的同步策略，会导致完成时间大幅提升。有需要请自行优化。</text><br>
        <text style="font-weight: bold">2.移除学时限制。</text><br>
        <text>学时有显示，但实际控制已移除。请合理、低调使用脚本。</text><br>
        <br>
        <h4>v2.1</h4>
        <text style="font-weight: bold">1.使用多个cdn源加载js资源。</text><br>
        <br>
        <h2>v2.0</h2>
        <text>1.修复失效问题；新增学时控制，防止恶意刷课；</text><br><br>
        <text >本脚本旨在<text style="color: red;font-weight: bold;">节约</text>大家时间和减少无意义的挂机播放导致的<text style="color: red;font-weight: bold;">资源浪费</text>，优质好课请大家<text style="color: red;font-weight: bold;">认真学习</text>！</text><br>
    </div>
    <div>
        <h3 style="font-weight: bold;font-size: 24px;">在哪里使用？</h3>
        <text>选择主题专栏，进入某一专区内，即页面中间有欢迎某某某的界面便可成功使用。</text>
    </div>
    <div>
        <h3 style="font-weight: bold;font-size: 24px;">如何使用？</h3>
        <text style="color: red;">注意：手动更换页码或专栏ID后，需要点击更新课程</text><br>
        <text style="color: red;">注意：每点一次开始，只能刷展示框列出的课程，刷完本页后，需手动更新页码，点击更新课程后，在点击开始</text><br>
        <h4 style="font-weight: bold;font-size: 18px;">控件解析</h4>
        <text>可手动输入专栏ID，在点击更新课程可刷其他专栏课程;<br>
            睡眠时间：每完成一个课程暂停时间，建议不小于1s；<br>
            当前页：为本页面的页码，通常第一页的页课程数最多有8个，第二页修改页课程数就可成功；<br>
            页课程数：为本页面展示的课程数量，即本次所刷的课程数量，在展示框中展示，点击一次开始，所刷课程数===页内课程数；<br>
            专栏总课程数：为此专栏中所有的课程总数，不用管；
        </text>
        <h4 style="font-weight: bold;font-size: 18px;">按钮解析</h4>
        <text>开始按钮：待提示信息变绿后，点击开始即开始刷展示框中的课程，本次所刷的课程数量=页课程数，若要刷其他的，需手动更改页码；<br>
            更新课程按钮：可更新展示框中的课程信息，在每次刷完后，需手动更新页码（也可增加页课程数，这样一次可多刷点），后点击更新课程，待展示框课程更新后可再次点击开始；<br>
            一键完成周任务课程按钮：点击即可自动完成我的学习中的每周任务。<br>
        </text>
    </div>
  </div>`;

    var newHelpString = `<div style="width: 600px; height: 400px; overflow: auto;">
    <h1 style="color: red;text-align: center;font-weight: bold;font-size: 50px;">脚本声明</h1>
    <div>
        <h3 style="font-weight: bold;font-size: 24px;">声明</h3>
        <text style="font-size: 20px;">使用本脚本请勿恶意大量刷课！！</text><br>
        <text >本脚本旨在<text style="color: red;font-weight: bold;">节约</text>大家时间和减少无意义的挂机播放导致的<text style="color: red;font-weight: bold;">资源浪费</text>，优质好课请大家<text style="color: red;font-weight: bold;">认真学习</text>！</text><br>
    </div>
    <div>

        <h3 style="font-weight: bold;font-size: 24px;">新的方法</h3>
        <text style="font-size: 18px;">为大家提供一种手动修改的方法，请勿恶意刷课，获取自身所需课时即可！</text><br>
        <text style="font-size: 18px;">在视频播放页面，按下F12打开控制台；</text><br>
        <text style="font-size: 18px;">在视频播放过程，查找到控制台左上角的top</text><br>
        点击top，选择videoTimeWorker.js这一项<br>
        之后，直接在控制台中输入：studyTime=10000（时间可根据视频时间修改，单位：s）<br>按下回车发送，再点击视频界面暂停以发送请求修改时间即可<br>
        <text style="font-size: 18px;color: red">注意，单次修改时长跨度不能超过180s</text><br>
    </div><br><br><br><br><br><br>
    <div style="color:#018bff">
         这是一个最好的时代，<br>
         科技的发展给予了每个人创造价值的可能性；<br>
         这也是一个最充满想象的时代，<br>
         每一位心怀梦想的人，终会奔向星辰大海。<br>
         <text style="color:black" x="290">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;共勉</text>
    </div>
  </div>`;
    //悬浮展示窗
    var maxTimeMonth = 20; //最大一个月20个学时，自行调整
    let show = 0;
    let showWindow = document.createElement("button");
    showWindow.style.width = "60px";
    showWindow.style.height = "40px";
    showWindow.innerText = "开刷！";
    showWindow.style.position = "fixed";
    showWindow.style.left = "0px";
    showWindow.style.top = "150px"; // [修改点 2]: 调整初始按钮位置
    showWindow.style.zIndex = "111";
    showWindow.addEventListener("click", fuc_show);

    // [修改点 3]: 修改按钮点击逻辑，实现按钮合并效果
    function fuc_show() {
      myWindow.style.display = "block";
      showWindow.style.display = "none";
    }

    document.body.appendChild(showWindow);
    let myWindow = document.createElement("div");
    myWindow.id = "mywin";
    myWindow.style.width = "300px";
    myWindow.style.height = "550px"; // 增加高度以容纳标题栏和新按钮
    myWindow.style.backgroundColor = "#efefef";
    myWindow.style.position = "fixed";
    myWindow.style.left = "50px";
    myWindow.style.top = "150px"; // [修改点 4]: 调整窗口初始位置
    myWindow.style.zIndex = "111";
    myWindow.style.display = "none";
    myWindow.style.border = "1px solid #ccc";
    document.body.appendChild(myWindow);

    // [修改点 5]: 添加可拖动的标题栏和关闭按钮
    let myHeader = document.createElement("div");
    myHeader.id = "mywin-header";
    myHeader.style.padding = "5px";
    myHeader.style.cursor = "move";
    myHeader.style.zIndex = "112";
    myHeader.style.backgroundColor = "#2196F3";
    myHeader.style.color = "white";
    myHeader.style.textAlign = "center";
    myHeader.innerHTML =
      '<span>联通党校助手</span><span id="mywin-close" style="float:right; cursor:pointer; font-weight:bold; margin-right:5px;">[X]</span>';
    myWindow.appendChild(myHeader);

    document.getElementById("mywin-close").addEventListener("click", () => {
      myWindow.style.display = "none";
      showWindow.style.display = "block";
    });

    // [修改点 6]: 实现主窗口拖动逻辑
    makeDraggable(myWindow, myHeader);

    let contentContainer = document.createElement("div"); // 创建一个容器来包裹原来的内容
    contentContainer.style.padding = "5px";
    myWindow.appendChild(contentContainer);

    var matchUrl = "campus.chinaunicom";
    if (window.location.href.includes(matchUrl)) {
      contentContainer.innerHTML = `<button id="btn-begin">开始</button>
<button id="btn-update">更新课程</button>
睡眠时间：<input id="sleeptime" value="1" style="display: inline-block;width: 40px;"> 秒
<br>专栏ID:<div id="c-id" contenteditable="true" style="display: inline-block;width: 60px;">
${
  (window.location.href.split("?")[1] &&
    window.location.href.split("?")[1].split("=")[1]) ||
  0
}</div><button id="btn-week">一键完成周任务课程</button><br>
当前页：<input id="c-cur" type="number" min="1"  step="1" value="1" style="display: inline-block;width: 40px;">
页课程数：<input id="c-size" type="number" min="8"  step="1" value="8" style="display: inline-block;width: 40px;">
<br>专栏总课程数：<div id="c-total"  style="display: inline-block;width: 20px;color: #f5083f;">0</div><br>
建议月最大学时：<div id="c-maxTime"  style="display: inline-block;width: 20px;color: #f5083f;">0</div>学时<br>
本月脚本已学学时：<div id="c-timeCur"  style="display: inline-block;width: 40px;color: #f5083f;">0</div>学时<br>
<button id="btn-help" style="color:red;margin-left:30px;">点击获取帮助</button> <button id="btn-new" style="color:red;margin-left:10px;">本脚本声明</button>
</div><div style="width:90%;margin: auto auto;border-radius: 10px;position: relative;border: 1px solid grey;height: 200px;margin-top: 0px;">
<div style="padding: 2px 5px;">
    <button id="btn-select-all" style="margin-right: 10px;">全选</button>
    <button id="btn-deselect-all">全不选</button>
</div>
<ul id="ul" style=" overflow-x: auto;white-space: nowrap;margin:0px 0px 0px 0px; overflow: auto;height: calc(100% - 30px);">
    <li><text style="color:#a5860f;">请在专栏主页使用</text></li>
</ul>
当前进度：
<div id="myProgress" style="width: 0%; height: 20px; background-color: green; position: relative; bottom: 0;">

    </div>
    <div id="progrssNum" style="display: flex;justify-content: center;position: relative; top: -20px;">0%</div>
    <div id="waitInfo" style="color:red;display: flex;justify-content: center;height:60px;word-wrap: break-word; overflow-wrap: break-word;">请在专栏主页使用</div>
</div>`;

      // [新增功能]: 为全选/全不选按钮绑定事件
      document
        .getElementById("btn-select-all")
        .addEventListener("click", () => {
          document
            .querySelectorAll(".course-checkbox")
            .forEach((checkbox) => (checkbox.checked = true));
        });
      document
        .getElementById("btn-deselect-all")
        .addEventListener("click", () => {
          document
            .querySelectorAll(".course-checkbox")
            .forEach((checkbox) => (checkbox.checked = false));
        });
    } else {
      myWindow.style.left = "60px";
      myWindow.style.top = "130px";
      myWindow.style.width = "600px";
      myWindow.style.height = "400px";
      contentContainer.innerHTML = helpHTMLSting; // 使用容器
      return;
    }
    //提示信息窗口
    var helpWindow = document.createElement("div");
    helpWindow.id = "floating-window";
    helpWindow.style.width = "600px";
    helpWindow.style.height = "400px";
    helpWindow.style.position = "fixed";
    helpWindow.style.top = "130px";
    helpWindow.style.left = "400px";
    helpWindow.style.border = "1px solid #ccc";
    helpWindow.style.background = "#f7f7f7";
    helpWindow.style.cursor = "move";
    helpWindow.style.display = "none";

    document.body.appendChild(helpWindow);
    var floatingWindow = document.getElementById("floating-window");
    var isDragging = false;
    var offsetX, offsetY;
    var showHelp = false;
    floatingWindow.addEventListener("mousedown", function (e) {
      isDragging = true;
      offsetX = e.clientX - floatingWindow.getBoundingClientRect().left;
      offsetY = e.clientY - floatingWindow.getBoundingClientRect().top;
    });

    document.addEventListener("mousemove", function (e) {
      if (isDragging) {
        floatingWindow.style.left = e.clientX - offsetX + "px";
        floatingWindow.style.top = e.clientY - offsetY + "px";
      }
    });

    document.addEventListener("mouseup", function () {
      isDragging = false;
    });
    document.addEventListener("click", function (e) {
      if (showHelp && !floatingWindow.contains(e.target) && !document.getElementById("btn-help").contains(e.target) && !document.getElementById("btn-new").contains(e.target)) {
        floatingWindow.style.display = "none";
        showHelp = false;
      }
    });
    document.getElementById("btn-help").addEventListener("click", function (e) {
      e.stopPropagation(); //防止继续冒泡
      helpWindow.innerHTML = helpHTMLSting;
      showHelp = true;
      floatingWindow.style.display = "block";
    });
    document.getElementById("btn-new").addEventListener("click", (e) => {
      e.stopPropagation(); //防止继续冒泡
      helpWindow.innerHTML = newHelpString;
      showHelp = true;
      floatingWindow.style.display = "block";
    });
    document.getElementById("c-maxTime").innerText = maxTimeMonth;
    var cTimeCur = document.getElementById("c-timeCur");
    //学时控制
    try {
      // GM_deleteValue('monthTime')
      //时间检查
      /*var timeing = GM_getValue('monthTime', null);
            if (timeing == null) {
                GM_setValue('monthTime', 0);
            }
            cTimeCur.innerText=timeing || 0
            //月份检查
            var timeDate = GM_getValue('monthTimeDate', null);
            if(timeDate==null){
                let date = {
                    'year': new Date().getFullYear(),
                    'month': new Date().getMonth() + 1,
                    'day': new Date().getDate()
                };
                GM_setValue('monthTimeDate', JSON.stringify(date)); // 转换为 JSON 字符串
                timeDate=date
            }
            if(typeof(timeDate)=='string')timeDate = JSON.parse(timeDate); // 将字符串转换成对象
            if(timeDate.month==(new Date().getMonth() + 1)){
                if(timeing>(maxTimeMonth - 5)){
                    alert('请注意，本月脚本建议学时只剩下 ' + (maxTimeMonth-timeing).toFixed(2)+'学时')
                }
                if(timeing>=maxTimeMonth){
                    alert('请注意，为防止恶意大量刷课，脚本本月已学满建议学时20学时，如有需要请自行修改源码！')
                }
            }
            else{
                GM_deleteValue('monthTime')
                GM_setValue('monthTime', 0);
                let date = {
                    'year': new Date().getFullYear(),
                    'month': new Date().getMonth() + 1,
                    'day': new Date().getDate()
                };
                GM_setValue('monthTimeDate', JSON.stringify(date));
            }*/
    } catch (err) {
      console.log(err.message);
      showLog(
        err.message + "---请刷新页面重试---持续出现，请反馈！",
        "red",
        false
      );
      return 0;
    }

    var btn_begin = document.getElementById("btn-begin");
    var waitInfo = document.getElementById("waitInfo");
    btn_begin.addEventListener("click", () => {
      if (readyCheck === true) {
        // [新增功能]: 获取所有选中的课程ID
        const selectedCourseIds = Array.from(
          document.querySelectorAll(".course-checkbox:checked")
        ).map((cb) => cb.dataset.courseId);

        // [新增功能]: 根据选中的ID从cList中筛选出课程对象
        const selectedCourses = cList.filter((course) =>
          selectedCourseIds.includes(String(course.id))
        );

        if (selectedCourses.length === 0) {
          alert("请至少选择一门课程！");
          return;
        }

        // [新增功能]: 为进度条重新计算总量
        let selectedAllCount = 0;
        for (const course of selectedCourses) {
          if (course.child && course.child.length > 0) {
            selectedAllCount += course.child.length;
          }
        }

        btn_begin.innerText = "已开始";
        showLog(
          `正在修改 ${selectedCourses.length} 门课程的学习时间中....`,
          "yellow",
          true
        );
        // [修改点]: 将筛选后的课程列表和新的总量传入begin函数
        begin(selectedCourses, selectedAllCount).then((v) => {
          btn_begin.innerText = "开始";
          if (v != 0) showLog(`本次修改已完成！`, "green", false);
        });
      } else {
        switch (Math.floor(Math.random() * 10)) {
          case 0:
          case 1:
          case 2:
          case 3:
          case 4:
            alert("请等待信息获取完成~~");
            break;
          default:
            alert("呆，刁民！");
        }
      }
    });
    var btn_week = document.getElementById("btn-week");
    var weekTaskCheck = true;
    btn_week.addEventListener("click", () => {
      /*if(parseFloat(GM_getValue('monthTime'))-maxTimeMonth > 0.000001){
                throw Error('已达最大学时，若有需要请联系我或自行更改源码！')
            }*/
      if (readyCheck && weekTaskCheck) {
        btn_week.innerText = "正在完成周任务";
        showLog(`正在完成周任务....`, "yellow", true);
        getInfoWeek().then((v) => {
          begin(v.weekList, v.count).then((v) => {
            if (v != 0) {
              weekTaskCheck = false;
              btn_week.innerText = "周任务已完成";
              showLog(`本次修改已完成！`, "green", false);
            } else {
              btn_week.innerText = "一键完成周任务";
            }
          });
        });
      } else {
        if (!weekTaskCheck) {
          alert("周任务已经完成！");
        } else {
          switch (Math.floor(Math.random() * 10)) {
            case 0:
            case 1:
            case 2:
            case 3:
            case 4:
              alert("请等待信息获取完成~~");
              break;
            default:
              alert("呆，刁民！");
          }
        }
      }
    });
    var btn_update = document.getElementById("btn-update");
    btn_update.addEventListener("click", () => {
      if (readyCheck) {
        btn_update.innerText = "正在更新";
        showLog(`正在获取课程信息中....`, "red", true);
        update(e).then((v) => {
          btn_update.innerText = "更新课程";
          showLog(`课程信息已获取~`, "green", false);
        });
      } else {
        switch (Math.floor(Math.random() * 10)) {
          case 0:
          case 1:
          case 2:
          case 3:
          case 4:
            alert("请等待信息获取完成~~");
            break;
          default:
            alert("呆，刁民！");
        }
      }
    });
  }


  // ———————————————————— 以下为通用核心函数，两个UI模式共用 ————————————————————

  //随机参数
  function randomStrFuc() {
    for (
      var n = 32,
        t = [
          "0", "1", "2", "3", "4", "5", "6", "7", "8", "9",
          "A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z",
          "a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z",
        ],
        e = "",
        c = 0; c < n; c++
    ) {
      var u = parseInt(61 * Math.random() + "");
      e += t[u];
    }
    return e;
  }
  //md5加密
  var ERROR = "input is invalid type",
    WINDOW = "object" == typeof window,
    root = WINDOW ? window : {},
    WEB_WORKER =
    (root.JS_MD5_NO_WINDOW && (WINDOW = !1),
      !WINDOW && "object" == typeof self),
    NODE_JS =
    !root.JS_MD5_NO_NODE_JS &&
    "object" == typeof process &&
    process.versions &&
    process.versions.node,
    COMMON_JS =
    (NODE_JS ? (root = global) : WEB_WORKER && (root = self),
      !root.JS_MD5_NO_COMMON_JS &&
      "object" == typeof module &&
      module.exports),
    ARRAY_BUFFER =
    !root.JS_MD5_NO_ARRAY_BUFFER && "undefined" != typeof ArrayBuffer,
    HEX_CHARS = "0123456789abcdef".split(""),
    EXTRA = [128, 32768, 8388608, -2147483648],
    SHIFT = [0, 8, 16, 24],
    OUTPUT_TYPES = [
      "hex",
      "array",
      "digest",
      "buffer",
      "arrayBuffer",
      "base64",
    ],
    BASE64_ENCODE_CHAR =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/".split(
      ""
    ),
    blocks = [],
    buffer8,
    buffer,
    buffer8,
    blocks,
    createOutputMethod =
    (ARRAY_BUFFER &&
      ((buffer = new ArrayBuffer(68)),
        (buffer8 = new Uint8Array(buffer)),
        (blocks = new Uint32Array(buffer))),
      (!root.JS_MD5_NO_NODE_JS && Array.isArray) ||
      (Array.isArray = function (t) {
        return "[object Array]" === Object.prototype.toString.call(t);
      }),
      !ARRAY_BUFFER ||
      (!root.JS_MD5_NO_ARRAY_BUFFER_IS_VIEW && ArrayBuffer.isView) ||
      (ArrayBuffer.isView = function (t) {
        return (
          "object" == typeof t &&
          t.buffer &&
          t.buffer.constructor === ArrayBuffer
        );
      }));
  //进度条
  var myProgress = document.getElementById("myProgress");
  var myProgressNum = document.getElementById("progrssNum");
  //防刁民
  function Md5(t) {
    t ?
      ((blocks[0] =
          blocks[16] =
          blocks[1] =
          blocks[2] =
          blocks[3] =
          blocks[4] =
          blocks[5] =
          blocks[6] =
          blocks[7] =
          blocks[8] =
          blocks[9] =
          blocks[10] =
          blocks[11] =
          blocks[12] =
          blocks[13] =
          blocks[14] =
          blocks[15] =
          0),
        (this.blocks = blocks),
        (this.buffer8 = buffer8)) :
      ARRAY_BUFFER ?
      ((t = new ArrayBuffer(68)),
        (this.buffer8 = new Uint8Array(t)),
        (this.blocks = new Uint32Array(t))) :
      (this.blocks = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]),
      (this.h0 =
        this.h1 =
        this.h2 =
        this.h3 =
        this.start =
        this.bytes =
        this.hBytes =
        0),
      (this.finalized = this.hashed = !1),
      (this.first = !0);
  }
  Md5.prototype.update = function (t) {
    if (!this.finalized) {
      var e,
        n = typeof t;
      if ("string" != n) {
        if ("object" != n) throw ERROR;
        if (null === t) throw ERROR;
        if (ARRAY_BUFFER && t.constructor === ArrayBuffer)
          t = new Uint8Array(t);
        else if (
          !(Array.isArray(t) || (ARRAY_BUFFER && ArrayBuffer.isView(t)))
        )
          throw ERROR;
        e = !0;
      }
      for (
        var i, r, o = 0, a = t.length, s = this.blocks, l = this.buffer8; o < a;

      ) {
        if (
          (this.hashed &&
            ((this.hashed = !1),
              (s[0] = s[16]),
              (s[16] =
                s[1] =
                s[2] =
                s[3] =
                s[4] =
                s[5] =
                s[6] =
                s[7] =
                s[8] =
                s[9] =
                s[10] =
                s[11] =
                s[12] =
                s[13] =
                s[14] =
                s[15] =
                0)),
          e)
        )
          if (ARRAY_BUFFER)
            for (r = this.start; o < a && r < 64; ++o) l[r++] = t[o];
          else
            for (r = this.start; o < a && r < 64; ++o)
              s[r >> 2] |= t[o] << SHIFT[3 & r++];
        else if (ARRAY_BUFFER)
          for (r = this.start; o < a && r < 64; ++o)
            (i = t.charCodeAt(o)) < 128 ?
            (l[r++] = i) :
            (i < 2048 ?
              (l[r++] = 192 | (i >> 6)) :
              (i < 55296 || 57344 <= i ?
                (l[r++] = 224 | (i >> 12)) :
                ((i =
                    65536 +
                    (((1023 & i) << 10) | (1023 & t.charCodeAt(++o)))),
                  (l[r++] = 240 | (i >> 18)),
                  (l[r++] = 128 | ((i >> 12) & 63))),
                (l[r++] = 128 | ((i >> 6) & 63))),
              (l[r++] = 128 | (63 & i)));
        else
          for (r = this.start; o < a && r < 64; ++o)
            (i = t.charCodeAt(o)) < 128 ?
            (s[r >> 2] |= i << SHIFT[3 & r++]) :
            (i < 2048 ?
              (s[r >> 2] |= (192 | (i >> 6)) << SHIFT[3 & r++]) :
              (i < 55296 || 57344 <= i ?
                (s[r >> 2] |= (224 | (i >> 12)) << SHIFT[3 & r++]) :
                ((i =
                    65536 +
                    (((1023 & i) << 10) | (1023 & t.charCodeAt(++o)))),
                  (s[r >> 2] |= (240 | (i >> 18)) << SHIFT[3 & r++]),
                  (s[r >> 2] |=
                    (128 | ((i >> 12) & 63)) << SHIFT[3 & r++])),
                (s[r >> 2] |= (128 | ((i >> 6) & 63)) << SHIFT[3 & r++])),
              (s[r >> 2] |= (128 | (63 & i)) << SHIFT[3 & r++]));
        (this.lastByteIndex = r),
        (this.bytes += r - this.start),
        64 <= r ?
          ((this.start = r - 64), this.hash(), (this.hashed = !0)) :
          (this.start = r);
      }
      return (
        4294967295 < this.bytes &&
        ((this.hBytes += (this.bytes / 4294967296) << 0),
          (this.bytes = this.bytes % 4294967296)),
        this
      );
    }
  };
  (Md5.prototype.finalize = function () {
    var t, e;
    this.finalized ||
      ((this.finalized = !0),
        ((t = this.blocks)[(e = this.lastByteIndex) >> 2] |= EXTRA[3 & e]),
        56 <= e &&
        (this.hashed || this.hash(),
          (t[0] = t[16]),
          (t[16] =
            t[1] =
            t[2] =
            t[3] =
            t[4] =
            t[5] =
            t[6] =
            t[7] =
            t[8] =
            t[9] =
            t[10] =
            t[11] =
            t[12] =
            t[13] =
            t[14] =
            t[15] =
            0)),
        (t[14] = this.bytes << 3),
        (t[15] = (this.hBytes << 3) | (this.bytes >>> 29)),
        this.hash());
  }),
  (Md5.prototype.hash = function () {
    var t,
      e,
      n,
      i,
      r,
      o = this.blocks,
      a = this.first ?
      ((((a =
            ((t =
                ((((t = o[0] - 680876937) << 7) | (t >>> 25)) - 271733879) <<
                  0) ^
                ((e =
                    ((((e =
                        (-271733879 ^
                          ((n =
                              ((((n =
                                  (-1732584194 ^ (2004318071 & t)) +
                                  o[1] -
                                  117830708) <<
                                12) |
                                (n >>> 20)) +
                              t) <<
                            0) &
                          (-271733879 ^ t))) +
                      o[2] -
                      1126478375) <<
                      17) |
                      (e >>> 15)) +
                    n) <<
                  0) &
                (n ^ t))) +
            o[3] -
            1316259209) <<
          22) |
          (a >>> 10)) +
        e) <<
      0 :
      ((t = this.h0),
        (a = this.h1),
        (e = this.h2),
        ((((a +=
            ((t =
                ((((t +=
                    ((n = this.h3) ^ (a & (e ^ n))) + o[0] - 680876936) <<
                  7) |
                  (t >>> 25)) +
                a) <<
              0) ^
            ((e =
                ((((e +=
                    (a ^
                      ((n =
                          ((((n += (e ^ (t & (a ^ e))) + o[1] - 389564586) <<
                            12) |
                            (n >>> 20)) +
                          t) <<
                        0) &
                      (t ^ a))) +
                  o[2] +
                  606105819) <<
                  17) |
                  (e >>> 15)) +
                n) <<
              0) &
            (n ^ t))) +
          o[3] -
          1044525330) <<
        22) |
        (a >>> 10)) +
      e) <<
      0);
    (a =
      ((((a +=
            ((t =
                ((((t += (n ^ (a & (e ^ n))) + o[4] - 176418897) << 7) |
                  (t >>> 25)) +
                a) <<
              0) ^
            ((e =
                ((((e +=
                    (a ^
                      ((n =
                          ((((n += (e ^ (t & (a ^ e))) + o[5] + 1200080426) << 12) |
                            (n >>> 20)) +
                          t) <<
                        0) &
                      (t ^ a))) +
                  o[6] -
                  1473231341) <<
                  17) |
                  (e >>> 15)) +
                n) <<
              0) &
            (n ^ t))) +
          o[7] -
          45705983) <<
        22) |
        (a >>> 10)) +
      e) <<
    0),
    (a =
      ((((a +=
            ((t =
                ((((t += (n ^ (a & (e ^ n))) + o[8] + 1770035416) << 7) |
                  (t >>> 25)) +
                a) <<
              0) ^
            ((e =
                ((((e +=
                    (a ^
                      ((n =
                          ((((n += (e ^ (t & (a ^ e))) + o[9] - 1958414417) <<
                            12) |
                            (n >>> 20)) +
                          t) <<
                        0) &
                      (t ^ a))) +
                  o[10] -
                  42063) <<
                  17) |
                  (e >>> 15)) +
                n) <<
              0) &
            (n ^ t))) +
          o[11] -
          1990404162) <<
        22) |
        (a >>> 10)) +
      e) <<
    0),
    (a =
      ((((a +=
            ((t =
                ((((t += (n ^ (a & (e ^ n))) + o[12] + 1804603682) << 7) |
                  (t >>> 25)) +
                a) <<
              0) ^
            ((e =
                ((((e +=
                    (a ^
                      ((n =
                          ((((n += (e ^ (t & (a ^ e))) + o[13] - 40341101) <<
                            12) |
                            (n >>> 20)) +
                          t) <<
                        0) &
                      (t ^ a))) +
                  o[14] -
                  1502002290) <<
                  17) |
                  (e >>> 15)) +
                n) <<
              0) &
            (n ^ t))) +
          o[15] +
          1236535329) <<
        22) |
        (a >>> 10)) +
      e) <<
    0),
    (a =
      ((((a +=
            ((n =
                ((((n +=
                    (a ^
                      (e &
                        ((t =
                            ((((t += (e ^ (n & (a ^ e))) + o[1] - 165796510) << 5) |
                              (t >>> 27)) +
                            a) <<
                          0) ^
                        a))) +
                    o[6] -
                    1069501632) <<
                  9) |
                  (n >>> 23)) +
                t) <<
              0) ^
            (t &
              ((e =
                  ((((e += (t ^ (a & (n ^ t))) + o[11] + 643717713) << 14) |
                    (e >>> 18)) +
                  n) <<
                0) ^
              n))) +
          o[0] -
          373897302) <<
        20) |
        (a >>> 12)) +
      e) <<
    0),
    (a =
      ((((a +=
            ((n =
                ((((n +=
                    (a ^
                      (e &
                        ((t =
                            ((((t += (e ^ (n & (a ^ e))) + o[5] - 701558691) << 5) |
                              (t >>> 27)) +
                            a) <<
                          0) ^
                        a))) +
                    o[10] +
                    38016083) <<
                  9) |
                  (n >>> 23)) +
                t) <<
              0) ^
            (t &
              ((e =
                  ((((e += (t ^ (a & (n ^ t))) + o[15] - 660478335) << 14) |
                    (e >>> 18)) +
                  n) <<
                0) ^
              n))) +
          o[4] -
          405537848) <<
        20) |
        (a >>> 12)) +
      e) <<
    0),
    (a =
      ((((a +=
            ((n =
                ((((n +=
                    (a ^
                      (e &
                        ((t =
                            ((((t += (e ^ (n & (a ^ e))) + o[9] + 568446438) << 5) |
                              (t >>> 27)) +
                            a) <<
                          0) ^
                        a))) +
                    o[14] -
                    1019803690) <<
                  9) |
                  (n >>> 23)) +
                t) <<
              0) ^
            (t &
              ((e =
                  ((((e += (t ^ (a & (n ^ t))) + o[3] - 187363961) << 14) |
                    (e >>> 18)) +
                  n) <<
                0) ^
              n))) +
          o[8] +
          1163531501) <<
        20) |
        (a >>> 12)) +
      e) <<
    0),
    (a =
      ((((a +=
            ((n =
                ((((n +=
                    (a ^
                      (e &
                        ((t =
                            ((((t += (e ^ (n & (a ^ e))) + o[13] - 1444681467) <<
                                5) |
                              (t >>> 27)) +
                            a) <<
                          0) ^
                        a))) +
                    o[2] -
                    51403784) <<
                  9) |
                  (n >>> 23)) +
                t) <<
              0) ^
            (t &
              ((e =
                  ((((e += (t ^ (a & (n ^ t))) + o[7] + 1735328473) << 14) |
                    (e >>> 18)) +
                  n) <<
                0) ^
              n))) +
          o[12] -
          1926607734) <<
        20) |
        (a >>> 12)) +
      e) <<
    0),
    (a =
      ((((a +=
            ((r =
                (n =
                  ((((n +=
                      ((i = a ^ e) ^
                        (t =
                          ((((t += (i ^ n) + o[5] - 378558) << 4) | (t >>> 28)) +
                            a) <<
                          0)) +
                      o[8] -
                      2022574463) <<
                    11) |
                    (n >>> 21)) +
                  t) <<
                0) ^ t) ^
            (e =
              ((((e += (r ^ a) + o[11] + 1839030562) << 16) | (e >>> 16)) +
                n) <<
              0)) +
          o[14] -
          35309556) <<
        23) |
        (a >>> 9)) +
      e) <<
    0),
    (a =
      ((((a +=
            ((r =
                (n =
                  ((((n +=
                      ((i = a ^ e) ^
                        (t =
                          ((((t += (i ^ n) + o[1] - 1530992060) << 4) |
                              (t >>> 28)) +
                            a) <<
                          0)) +
                      o[4] +
                      1272893353) <<
                    11) |
                    (n >>> 21)) +
                  t) <<
                0) ^ t) ^
            (e =
              ((((e += (r ^ a) + o[7] - 155497632) << 16) | (e >>> 16)) +
                n) <<
              0)) +
          o[10] -
          1094730640) <<
        23) |
        (a >>> 9)) +
      e) <<
    0),
    (a =
      ((((a +=
            ((r =
                (n =
                  ((((n +=
                      ((i = a ^ e) ^
                        (t =
                          ((((t += (i ^ n) + o[13] + 681279174) << 4) |
                              (t >>> 28)) +
                            a) <<
                          0)) +
                      o[0] -
                      358537222) <<
                    11) |
                    (n >>> 21)) +
                  t) <<
                0) ^ t) ^
            (e =
              ((((e += (r ^ a) + o[3] - 722521979) << 16) | (e >>> 16)) +
                n) <<
              0)) +
          o[6] +
          76029189) <<
        23) |
        (a >>> 9)) +
      e) <<
    0),
    (a =
      ((((a +=
            ((r =
                (n =
                  ((((n +=
                      ((i = a ^ e) ^
                        (t =
                          ((((t += (i ^ n) + o[9] - 640364487) << 4) |
                              (t >>> 28)) +
                            a) <<
                          0)) +
                      o[12] -
                      421815835) <<
                    11) |
                    (n >>> 21)) +
                  t) <<
                0) ^ t) ^
            (e =
              ((((e += (r ^ a) + o[15] + 530742520) << 16) | (e >>> 16)) +
                n) <<
              0)) +
          o[2] -
          995338651) <<
        23) |
        (a >>> 9)) +
      e) <<
    0),
    (a =
      ((((a +=
            ((n =
                ((((n +=
                    (a ^
                      ((t =
                          ((((t += (e ^ (a | ~n)) + o[0] - 198630844) << 6) |
                            (t >>> 26)) +
                          a) <<
                        0) |
                      ~e)) +
                    o[7] +
                    1126891415) <<
                  10) |
                  (n >>> 22)) +
                t) <<
              0) ^
            ((e =
                ((((e += (t ^ (n | ~a)) + o[14] - 1416354905) << 15) |
                  (e >>> 17)) +
                n) <<
              0) |
              ~t)) +
          o[5] -
          57434055) <<
        21) |
        (a >>> 11)) +
      e) <<
    0),
    (a =
      ((((a +=
            ((n =
                ((((n +=
                    (a ^
                      ((t =
                          ((((t += (e ^ (a | ~n)) + o[12] + 1700485571) << 6) |
                            (t >>> 26)) +
                          a) <<
                        0) |
                      ~e)) +
                    o[3] -
                    1894986606) <<
                  10) |
                  (n >>> 22)) +
                t) <<
              0) ^
            ((e =
                ((((e += (t ^ (n | ~a)) + o[10] - 1051523) << 15) |
                  (e >>> 17)) +
                n) <<
              0) |
              ~t)) +
          o[1] -
          2054922799) <<
        21) |
        (a >>> 11)) +
      e) <<
    0),
    (a =
      ((((a +=
            ((n =
                ((((n +=
                    (a ^
                      ((t =
                          ((((t += (e ^ (a | ~n)) + o[8] + 1873313359) << 6) |
                            (t >>> 26)) +
                          a) <<
                        0) |
                      ~e)) +
                    o[15] -
                    30611744) <<
                  10) |
                  (n >>> 22)) +
                t) <<
              0) ^
            ((e =
                ((((e += (t ^ (n | ~a)) + o[6] - 1560198380) << 15) |
                  (e >>> 17)) +
                n) <<
              0) |
              ~t)) +
          o[13] +
          1309151649) <<
        21) |
        (a >>> 11)) +
      e) <<
    0),
    (a =
      ((((a +=
            ((n =
                ((((n +=
                    (a ^
                      ((t =
                          ((((t += (e ^ (a | ~n)) + o[4] - 145523070) << 6) |
                            (t >>> 26)) +
                          a) <<
                        0) |
                      ~e)) +
                    o[11] -
                    1120210379) <<
                  10) |
                  (n >>> 22)) +
                t) <<
              0) ^
            ((e =
                ((((e += (t ^ (n | ~a)) + o[2] + 718787259) << 15) |
                  (e >>> 17)) +
                n) <<
              0) |
              ~t)) +
          o[9] -
          343485551) <<
        21) |
        (a >>> 11)) +
      e) <<
    0),
    this.first ?
    ((this.h0 = (t + 1732584193) << 0),
      (this.h1 = (a - 271733879) << 0),
      (this.h2 = (e - 1732584194) << 0),
      (this.h3 = (n + 271733878) << 0),
      (this.first = !1)) :
    ((this.h0 = (this.h0 + t) << 0),
      (this.h1 = (this.h1 + a) << 0),
      (this.h2 = (this.h2 + e) << 0),
      (this.h3 = (this.h3 + n) << 0));
  }),
  (Md5.prototype.hex = function () {
    this.finalize();
    var t = this.h0,
      e = this.h1,
      n = this.h2,
      i = this.h3;
    return (
      HEX_CHARS[(t >> 4) & 15] +
      HEX_CHARS[15 & t] +
      HEX_CHARS[(t >> 12) & 15] +
      HEX_CHARS[(t >> 8) & 15] +
      HEX_CHARS[(t >> 20) & 15] +
      HEX_CHARS[(t >> 16) & 15] +
      HEX_CHARS[(t >> 28) & 15] +
      HEX_CHARS[(t >> 24) & 15] +
      HEX_CHARS[(e >> 4) & 15] +
      HEX_CHARS[15 & e] +
      HEX_CHARS[(e >> 12) & 15] +
      HEX_CHARS[(e >> 8) & 15] +
      HEX_CHARS[(e >> 20) & 15] +
      HEX_CHARS[(e >> 16) & 15] +
      HEX_CHARS[(e >> 28) & 15] +
      HEX_CHARS[(e >> 24) & 15] +
      HEX_CHARS[(n >> 4) & 15] +
      HEX_CHARS[15 & n] +
      HEX_CHARS[(n >> 12) & 15] +
      HEX_CHARS[(n >> 8) & 15] +
      HEX_CHARS[(n >> 20) & 15] +
      HEX_CHARS[(n >> 16) & 15] +
      HEX_CHARS[(n >> 28) & 15] +
      HEX_CHARS[(n >> 24) & 15] +
      HEX_CHARS[(i >> 4) & 15] +
      HEX_CHARS[15 & i] +
      HEX_CHARS[(i >> 12) & 15] +
      HEX_CHARS[(i >> 8) & 15] +
      HEX_CHARS[(i >> 20) & 15] +
      HEX_CHARS[(i >> 16) & 15] +
      HEX_CHARS[(i >> 28) & 15] +
      HEX_CHARS[(i >> 24) & 15]
    );
  }),
  (Md5.prototype.toString = Md5.prototype.hex),
  (Md5.prototype.digest = function () {
    this.finalize();
    var t = this.h0,
      e = this.h1,
      n = this.h2,
      i = this.h3;
    return [
      255 & t,
      (t >> 8) & 255,
      (t >> 16) & 255,
      (t >> 24) & 255,
      255 & e,
      (e >> 8) & 255,
      (e >> 16) & 255,
      (e >> 24) & 255,
      255 & n,
      (n >> 8) & 255,
      (n >> 16) & 255,
      (n >> 24) & 255,
      255 & i,
      (i >> 8) & 255,
      (i >> 16) & 255,
      (i >> 24) & 255,
    ];
  }),
  (Md5.prototype.array = Md5.prototype.digest),
  (Md5.prototype.arrayBuffer = function () {
    this.finalize();
    var t = new ArrayBuffer(16),
      e = new Uint32Array(t);
    return (
      (e[0] = this.h0),
      (e[1] = this.h1),
      (e[2] = this.h2),
      (e[3] = this.h3),
      t
    );
  }),
  (Md5.prototype.buffer = Md5.prototype.arrayBuffer),
  (Md5.prototype.base64 = function () {
    for (var t, e, n, i = "", r = this.array(), o = 0; o < 15;)
      (t = r[o++]),
      (e = r[o++]),
      (n = r[o++]),
      (i +=
        BASE64_ENCODE_CHAR[t >>> 2] +
        BASE64_ENCODE_CHAR[63 & ((t << 4) | (e >>> 4))] +
        BASE64_ENCODE_CHAR[63 & ((e << 2) | (n >>> 6))] +
        BASE64_ENCODE_CHAR[63 & n]);
    return (
      (t = r[o]),
      i +
      (BASE64_ENCODE_CHAR[t >>> 2] +
        BASE64_ENCODE_CHAR[(t << 4) & 63] +
        "==")
    );
  });

  // let cur_url = window.location.href.split('?')
  // var id = cur_url[1];
  // var token = document.cookie.split('token=')[1].split(';')[0]
  // var timestamp=Math.floor(Date.now() / 1000);
  // var companyId=window.localStorage.getItem("companyId") || 0
  // var organizationId=window.localStorage.getItem("organizationId") || 0
  // var from='WEB'
  // var randomStr= randomStrFuc()
  var publicKey =
    "MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAooxomrujIP9vcxxNmS+Q1xxnaoxAfluwFvDR3+G+p84QMsePXDD67cLjJ+7n+79u2xoG7fVvDnzHDW+X5D/0/Dv9ajUaBpFQl3jqKwRiP3Lrx08seYzWIWDGHEjurbZrWGHRJNdoM7tEQPdPZftZC6iOm7kSjDIDiuqaIh9g3hqFSVQ5r15Dvae6qtREo1nDWKsf3tH6nkvVD2pIh3TBJUoGdfbPqnw/tNvzhwOX9tg7NjhZ8Yet1ctVt297G5HCwPSIBjhUKEtLYLk/8scPrzXnQpAU05m5WnHfDhfvvG2xoVXckveNvZhv6lvxTZqRkUBOI1pU16U9Tz4aDpCU7QIDAQAB";
  //加密参数并序列化、字符串化参数
  //返回对象，包含字符串参数和sign

  /**
   * 最重要的地方，破解sign参数
   * @param {*} e
   * @param {*} smp
   * @returns
   */
  //加密参数，返回包装数据，便于在接口中直接调用
  function encryptData(e, smp = true) {
    var t,
      c = "",
      r = Object.keys(e).sort();
    for (t in r) {
      var o = e[r[t]];
      null != o && (c += r[t] + "=" + o + "&");
    }
    if (smp) {
      console.log("字符串参数: " + c);
    }
    var key_md5 = new Md5(!0).update(c)["hex"]();
    if (smp) {
      console.log("key_md5: " + key_md5);
    }
    return { serString: c, sign: encodeURIComponent(encrypt(key_md5, smp)) };
  }
  //加密，获得sign
  function encrypt(key, smp = true) {
    var rsa = new JSEncrypt();
    rsa.setPublicKey(publicKey);
    var encryptedData = rsa.encrypt(key);
    if (smp) {
      console.log("sign: " + encryptedData);
    }
    return encryptedData;
  }
  //接口用参数
  var e = {}; // 在 renderTopicUI 中初始化
  //接口列表
  var url = {
    courseList: "https://campus.chinaunicom.cn/training/app/themeColumn/getMyAreaInfoCourse",
    courseInfo: "https://campus.chinaunicom.cn/training/app/course/info",
    studyCourse: "https://campus.chinaunicom.cn/training/app/course/playtimeV2",
    weekCourse: "https://campus.chinaunicom.cn/training/app/weekTask/list",
  };
  //每周任务
  var weekData = {}; // 在 renderTopicUI 中初始化

  var cList = []; //展示框课程
  var allCount; //待刷课程树总数，用于进度条展示

  // 在 renderTopicUI 中运行
  var matchThemeCoursesUrl = "ind_ThemeCourses";
  if (window.location.href.includes(matchThemeCoursesUrl)) {
    // 等待DOM加载
    setTimeout(() => {
        try {
            var waitInfo = document.getElementById("waitInfo");
            if (waitInfo) showLog(`正在获取课程树信息中，请稍等....`, "red", true);
          } catch (error) {
            console.error(error);
          }
    }, 1000);
  }

  // 在 renderTopicUI 中调用
  if (!window.location.href.match(/course_courseDetails\/(\d+)/)) {
    setTimeout(() => {
        const cIdElement = document.getElementById("c-id");
        if(cIdElement) {
            e = {
                token: document.cookie.split("token=")[1] && document.cookie.split("token=")[1].split(";")[0],
                timestamp: Math.floor(Date.now() / 1000),
                companyId: window.localStorage.getItem("companyId") || 0,
                from: "WEB",
                organizationId: window.localStorage.getItem("organizationId") || 0,
                randomStr: randomStrFuc(),
                id: document.getElementById("c-id").innerText,
                subjectId: "",
                status: 1,
                name: "",
                currentPage: document.getElementById("c-cur").value,
                pageSize: document.getElementById("c-size").value,
                total: 0,
              };
              weekData = {
                token: document.cookie.split("token=")[1].split(";")[0],
                timestamp: Math.floor(Date.now() / 1000),
                companyId: window.localStorage.getItem("companyId") || 0,
                from: "WEB",
                organizationId: window.localStorage.getItem("organizationId") || 0,
                randomStr: randomStrFuc(),
              };
            getData(url, e).then((v) => {
                if (v != 0) {
                  cList = v;
                  statistics().then((v) => {
                    allCount = v;
                    console.log("allCount:" + v);
                    console.log("课程树信息已获取完毕~");
                    showLog(`课程树信息已获取~可以开始`, "green", false);
                  });
                }
              });
        }
    }, 1500); // 延迟执行以确保UI元素已创建
}


  /**
   * @description: 封装提示信息
   * @return {*}
   */
  function showLog(info, color, lock) {
    const waitInfo = document.getElementById("waitInfo");
    if(waitInfo) {
        waitInfo.innerText = info;
        waitInfo.style.color = color;
    }
    readyCheck = !lock;
  }
  /**
   * @description: 统计信息，获取总数，用于进度条
   * @return {*}
   */
  async function statistics() {
    let count = 0;
    for (let ll of cList) {
      await getCourseInfo(ll.id, false).then((v) => {
        ll.child = v;
        count += v.length;
      });
    }
    return count;
  }
  /**
   * @description: 获取周任务信息
   * @return {*}
   */
  async function getInfoWeek() {
    let resData;
    let count;
    try {
      resData = await request(url.weekCourse, encryptData(weekData));
      count = 0;
      for (let ll of resData.entity.weekTaskList) {
        await getCourseInfo(ll.courseId, false).then((v) => {
          ll.child = v;
          //使用原来的begin函数，则需要改变id值为课程ID，因为原来对象中的id为专栏ID
          ll.id = ll.courseId;
          count += v.length;
        });
      }
    } catch (err) {
      console.error(err);
      showLog(
        err.message + "---请刷新页面重试---持续出现，请反馈！",
        "red",
        false
      );
      return 0;
    }

    return { weekList: resData.entity.weekTaskList, count: count };
  }
  /**
   * @description: 开始按钮事件处理函数
   * @return {*}
   */
  async function begin(list, aCount) {
    // console.log('开始专栏ID：' + window.location.href.split('?')[1].split('=')[1])
    // console.log(typeof(cList))
    const myProgress = document.getElementById("myProgress");
    const myProgressNum = document.getElementById("progrssNum");
    if(myProgress) myProgress.style.width = `0%`;
    if(myProgressNum) myProgressNum.innerText = `0%`;

    let llList = 0;
    for (let ll of list) {
      let courseId = ll.id;
      // await sleep(document.getElementById("sleeptime").value * 1000)
      for (let kk of ll.child) {
        llList++;
        kk.courseId = courseId;
        console.log("正在修改学习时间kpointId：" + kk.id + "");
        const sleepTimeInput = document.getElementById("sleeptime");
        const sleepDuration = sleepTimeInput ? sleepTimeInput.value * 1000 : 1000;
        await sleep(sleepDuration);
        let pgr = Math.round((llList / aCount) * 100);
        let v = await studyCourse(kk, pgr);
        if (v == 0) return 0;
        console.log("本次结果：" + v);
        console.log("pgr:" + pgr);
        if(myProgress) myProgress.style.width = `${pgr}%`;
        if(myProgressNum) myProgressNum.innerText = `${pgr}%`;
      }
    }
  }
  /**
   * @description: 更新按钮事件处理函数
   * @return {*}
   */
  async function update(e) {
    document.getElementById("myProgress").style.width = `0%`;
    document.getElementById("progrssNum").innerText = `0%`;
    showLog(`正在获取课程树信息中，请稍等....`, "red", true);
    e.id = document.getElementById("c-id").innerText;
    e.currentPage = document.getElementById("c-cur").value;
    e.pageSize = document.getElementById("c-size").value;
    await getData(url, e).then(async (v) => {
      if (v != 0) {
        cList = v;
        await statistics().then((v) => {
          allCount = v;
          console.log("allCount:" + v);
          console.log("课程树信息已获取完毕~");
          showLog(`课程树信息已获取~可以开始`, "green", false);
        });
      }
    });
  }
  /**
   * @description: 获取当前专栏课程信息，并展示的展示框
   * @param {*} time
   * @return {*}
   */
  async function getData(url, e) {
    try {
      const courseList = await request(url.courseList, encryptData(e));
      console.log(courseList.entity.courseList); // 打印获取的数据
      // 更新窗口数据
      document.getElementById("c-total").innerText =
        courseList.entity.page.totalResultSize;
      let li = "";
      for (let ii of courseList.entity.courseList) {
        // [新增功能]: 在课程名前添加一个复选框
        li += `<li style="margin-bottom:5px;height: 20px;width: 100%; display: flex; align-items: center;">
                 <input type="checkbox" class="course-checkbox" data-course-id="${
                   ii.id
                 }" checked style="margin-right: 5px;">
                 <span style="white-space: nowrap; overflow: hidden; text-overflow: ellipsis;" title="${
                   ii.name
                 }">
                   已看：${((ii.playTime / ii.totalPlayTime) * 100).toFixed(
                     2
                   )}%  ${ii.name}
                 </span>
               </li>`;
      }
      document.getElementById("ul").innerHTML = li;
      console.log("窗口数据已更新");
      return courseList.entity.courseList; // 返回获取的数据
    } catch (error) {
      console.error(error);
      showLog(
        error.message + "---请刷新页面重试---持续出现，请反馈！",
        "red",
        false
      );
      return 0;
    }
  }
  async function sleep(time) {
    console.log("睡眠" + time / 1000 + "s");
    if (time < 1000) time = 1000;
    return await new Promise((resolve) => setTimeout(resolve, time));
  }
  //
  /**
   * @description: 获取单个课程信息
   * @param {*} id
   * @return {*}
   */
  async function getCourseInfo(id, smp = true) {
    var signleCourse = {
      token: document.cookie.split("token=")[1].split(";")[0],
      timestamp: Math.floor(Date.now() / 1000),
      companyId: window.localStorage.getItem("companyId") || 0,
      from: "WEB",
      organizationId: window.localStorage.getItem("organizationId") || 0,
      randomStr: randomStrFuc(),
      courseId: id,
    };
    var courseInfo;
    let data;
    //发送请求
    try {
      data = await request(
        url.courseInfo,
        encryptData(signleCourse, smp),
        smp
      );
      if (smp) {
        console.log(data.entity.kpointList); // 这里打印获取的数据
      }
      courseInfo = data.entity.kpointList;
    } catch (err) {
      console.error(err);
      showLog(
        err.message + "---请刷新页面重试---持续出现，请反馈！",
        "red",
        false
      );
      return 0;
    }
    return courseInfo;
  }

  //更改课程学习时间
  async function studyCourse(courseNode, pgr = 0) {
    try {
      // 首先确定需要处理的视频列表。
      // 如果courseNode有childKpointList，则处理该列表；否则，创建一个只包含courseNode自身的列表。
      const videosToProcess = (courseNode.childKpointList && courseNode.childKpointList.length > 0) ?
        courseNode.childKpointList :
        [courseNode];

      if (videosToProcess.length > 1) {
        console.log(`课程节点 "${courseNode.name}" 包含 ${videosToProcess.length} 个子视频，将逐个处理...`);
      }

      // 父节点 courseNode 始终包含正确的 courseId。
      const parentCourseId = courseNode.courseId;

      // 遍历所有需要处理的视频。
      for (const videoNode of videosToProcess) {
        let maxStudyTime = 100; // 每次最大学习时长（秒）
        let singleStudyTime = maxStudyTime - 1; // 设置为99秒
        let courseTimeCache = 0;
        let courseTotalTime = parseTimeString(videoNode.time) || 0;

        // 如果视频总时长为0，则跳过此视频。
        if (courseTotalTime <= 0) {
          console.log(`跳过视频 "${videoNode.name}" (ID: ${videoNode.id})，因为其时长为0。`);
          continue; // 继续处理下一个视频
        }

        var study = {
          accrualType: 0,
          token: document.cookie.split("token=")[1].split(";")[0],
          timestamp: Math.floor(Date.now() / 1000),
          companyId: window.localStorage.getItem("companyId") || 0,
          from: "WEB",
          organizationId: window.localStorage.getItem("organizationId") || 0,
          randomStr: randomStrFuc(),
          type: "playback",
          kpointId: videoNode.id, // 使用当前视频的ID
          courseId: parentCourseId, // 使用父课程的ID
          breakpoint: 0,
          studyTime: 0,
        };
        console.log(`正在处理视频: "${videoNode.name}", 总时长: ${courseTotalTime}s`);
        do {
          // 累加学习时间，直到达到总时长
          if (courseTotalTime - courseTimeCache > singleStudyTime) {
            courseTimeCache += singleStudyTime;
          } else {
            courseTimeCache = courseTotalTime; // 到达最后一部分，直接设置为总时长
          }
          study.breakpoint = courseTimeCache;
          study.studyTime = courseTimeCache; // studyTime 是累积学习时长
          console.log("循环任务, 发送累计学习时长: ", study.studyTime);
          study.randomStr = randomStrFuc();
          study.timestamp = Math.floor(Date.now() / 1000);
          let res = await useGMxmlhttpRequest(
            url.studyCourse,
            encryptData(study)
          );

          // 如果API返回100（表示完成），则提前结束循环。
          if (res.entity === 100) {
            console.log(`视频 "${videoNode.name}" 已完成 (API报告100%)。`);
            break;
          }

          // 脚本原有的复杂进度条逻辑已移除，由外部的 begin 函数在调用后统一更新。

        } while (courseTimeCache < courseTotalTime);
        // 如果一个课程节点包含多个视频，在处理完一个后稍作等待。
        if (videosToProcess.length > 1) {
            const sleepTimeInput = document.getElementById("sleeptime");
            const sleepDuration = sleepTimeInput ? sleepTimeInput.value * 1000 : 1000;
            await sleep(sleepDuration || 1000);
        }
      } // 视频遍历结束

      return 1; // 表示整个 courseNode (包括其所有子视频) 都成功处理

    } catch (err) {
      showLog(
        err.message + "---请刷新页面重试---持续出现，请反馈！",
        "red",
        false
      );
      return 0; // 表示处理失败
    }
  }
  async function request(url, e, smp = true) {
    if (smp) {
      console.log("正在发送请求->url:" + url);
    }
    return fetch(url + "?" + e.serString + "sign=" + e.sign, {
      headers: {
        accept: "application/json, text/plain, */*",
        "accept-language": "zh-CN,zh;q=0.9,en;q=0.8,en-GB;q=0.7,en-US;q=0.6",
        "content-type": "application/x-www-form-urlencoded",
        "sec-ch-ua": '"Not A(Brand";v="99", "Microsoft Edge";v="121", "Chromium";v="121"',
        "sec-ch-ua-mobile": "?0",
        "sec-ch-ua-platform": '"Windows"',
        "sec-fetch-dest": "empty",
        "sec-fetch-mode": "cors",
        "sec-fetch-site": "same-site",
      },
      referrer: "https://m.campus.chinaunicom.cn/",
      referrerPolicy: "strict-origin-when-cross-origin",
      body: "",
      method: "POST",
      mode: "cors",
      credentials: "omit",
    }).then(async (v) => {
      v = await v.json();
      if (v.success && v.code == 200) {
        return v;
      } else {
        throw Error("请求错误！" + v.message);
      }
    });
  }

  async function useGMxmlhttpRequest(url, e) {
    return new Promise((resolve, reject) => {
      GM_xmlhttpRequest({
        url: url + "?" + e.serString + "sign=" + e.sign,
        method: "POST",
        headers: {
          accept: "application/json, text/plain, */*",
          "accept-language": "en-US,zh-CN;q=0.7,en;q=0.3",
          "accept-Encoding": "gzip, deflate, br, zstd",
          "content-type": "application/x-www-form-urlencoded",
          "sec-ch-ua": '"Not/A)Brand";v="8", "Chromium";v="136", "Google Chrome";v="136"',
          "sec-ch-ua-mobile": "?0",
          "sec-ch-ua-platform": '"Windows"',
          "sec-fetch-dest": "empty",
          "sec-fetch-mode": "cors",
          "sec-fetch-site": "same-origin",
          host: "campus.chinaunicom.cn",
          origin: "https://campus.chinaunicom.cn",
          referer: "https://campus.chinaunicom.cn/training/pc/curriculum.html",
          "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/136.0.7103.48 Safari/537.36",
        },
        // fetch:true,
        onload: function (res) {
          console.log("请求成功");
          console.log(res);
          let obj = JSON.parse(res.response);
          if (obj.success && obj.code == 200) {
            resolve(obj);
          } else {
            throw Error("请求错误！" + obj.message);
          }
        },
        onerror: function (err) {
            const beginBtn = document.getElementById("btn-begin") || document.getElementById("btn-begin-single");
            if (beginBtn) {
                beginBtn.innerText = "开始";
            }
          showLog(
            '修改时间失败，请选择"总是允许" 跨域请求访问资源',
            "red",
            false
          );
          throw Error("请求错误！" + err.message);
        },
      });
    });
  }

  function parseTimeString(timeStr) {
    // 如果输入为空或无效，直接返回0
    if (!timeStr) {
      return 0;
    }

    // 检查输入是否为纯数字（视为秒）
    if (!isNaN(timeStr) && !isNaN(parseFloat(timeStr))) {
      return parseInt(timeStr, 10);
    }

    let totalSeconds = 0;
    // 正则表达式，用于匹配并捕获小时、分钟和秒的数字
    // (?:(\d+)\s*小时)? 表示小时部分是可选的
    // (?:(\d+)\s*分)? 表示分钟部分是可选的
    // (?:(\d+)\s*秒)? 表示秒部分是可选的
    const regex = /(?:(\d+)\s*小时)?(?:(\d+)\s*分)?(?:(\d+)\s*秒)?/;
    const matches = timeStr.match(regex);

    if (matches) {
      // matches[1] 对应小时的数字，如果不存在则为 undefined
      const hours = parseInt(matches[1]) || 0;
      // matches[2] 对应分钟的数字
      const minutes = parseInt(matches[2]) || 0;
      // matches[3] 对应秒的数字
      const seconds = parseInt(matches[3]) || 0;

      totalSeconds = hours * 3600 + minutes * 60 + seconds;
    }

    return totalSeconds;
  }

  // [修改点]: 使用更稳定的方法来启动脚本
  if (document.readyState === "loading") {
    // 页面仍在加载，监听事件
    document.addEventListener("DOMContentLoaded", initializeScript);
  } else {
    // DOM 已加载，直接执行
    initializeScript();
  }
})();
