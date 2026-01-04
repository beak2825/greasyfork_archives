// ==UserScript==
// @name         西工大翱翔教务课表下载（服务于wake up课程表）
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  在翱翔教务右下角点击下载按钮，即可下载html文件，可导入wake up中
// @match        https://jwxt.nwpu.edu.cn/student/home
// @grant        GM_xmlhttpRequest
// @connect      jwxt.nwpu.edu.cn
// @icon         https://portal-minio.nwpu.edu.cn/cms/60_60-1612168704151-1620739414523.png
// @license      MIT
// @homepage     https://greasyfork.org/zh-CN/scripts/548431-%E8%A5%BF%E5%B7%A5%E5%A4%A7%E7%BF%B1%E7%BF%94%E6%95%99%E5%8A%A1%E8%AF%BE%E8%A1%A8%E4%B8%8B%E8%BD%BD-%E6%9C%8D%E5%8A%A1%E4%BA%8Ewake-up%E8%AF%BE%E7%A8%8B%E8%A1%A8
// @downloadURL https://update.greasyfork.org/scripts/548431/%E8%A5%BF%E5%B7%A5%E5%A4%A7%E7%BF%B1%E7%BF%94%E6%95%99%E5%8A%A1%E8%AF%BE%E8%A1%A8%E4%B8%8B%E8%BD%BD%EF%BC%88%E6%9C%8D%E5%8A%A1%E4%BA%8Ewake%20up%E8%AF%BE%E7%A8%8B%E8%A1%A8%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/548431/%E8%A5%BF%E5%B7%A5%E5%A4%A7%E7%BF%B1%E7%BF%94%E6%95%99%E5%8A%A1%E8%AF%BE%E8%A1%A8%E4%B8%8B%E8%BD%BD%EF%BC%88%E6%9C%8D%E5%8A%A1%E4%BA%8Ewake%20up%E8%AF%BE%E7%A8%8B%E8%A1%A8%EF%BC%89.meta.js
// ==/UserScript==

(function() {
    'use strict';


    // 创建按钮
    let btn = document.createElement("button");
    btn.innerText = "📥 下载当前课表";
    Object.assign(btn.style, {
        position: "fixed",
        bottom: "30px",
        right: "30px",
        padding: "10px 20px",
        backgroundColor: "#4CAF50",
        color: "white",
        border: "none",
        borderRadius: "8px",
        boxShadow: "0 4px 6px rgba(0,0,0,0.2)",
        cursor: "pointer",
        fontSize: "16px",
        zIndex: 9999,
        transition: "all 0.2s ease"
    });

    // 悬停效果
    btn.onmouseover = () => btn.style.backgroundColor = "#45a049";
    btn.onmouseout = () => btn.style.backgroundColor = "#4CAF50";

    // 点击按钮时下载
    btn.onclick = function() {

        // 防止重复点击
        if (document.getElementById('download-status')) return;

        // 创建提示窗口
        const statusDiv = document.createElement('div');
        statusDiv.id = 'download-status';
        statusDiv.innerText = "📥 正在下载课表...";
        Object.assign(statusDiv.style, {
            position: "fixed",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            backgroundColor: "#ccffcc", // 浅绿色
            color: "black",              // 黑色文字更清晰
            padding: "20px 30px",
            borderRadius: "8px",
            zIndex: 10000,
            fontSize: "18px",
            textAlign: "center",
            boxShadow: "0 4px 6px rgba(0,0,0,0.2)"
        });
        document.body.appendChild(statusDiv);


        // 获取 studentId
        let studentId = localStorage.getItem("cs-course-select-student-id");
        if (!studentId) {
            alert("未找到 studentId");
            document.body.removeChild(statusDiv);
            return;
        }

        // 获取 semesterId
        const iframe = document.querySelector('iframe[src="/student/for-std/course-table"]');
        if (!iframe) {
            alert("请先打开 我的课表 界面");
            document.body.removeChild(statusDiv);
            return;
        }
        let item = iframe.contentDocument.querySelector('.item');
        if (!item) {
            alert("并未找到item元素（当前课表对应的学期编号）");
            document.body.removeChild(statusDiv);
            return;
        }
        let semesterId = item.dataset.value;
        let semesterName = item.textContent;


        // 课程表 URL
        const apiUrl = `https://jwxt.nwpu.edu.cn/student/for-std/course-table/semester/${semesterId}/print-data/${studentId}`;

        GM_xmlhttpRequest({
            method: "GET",
            url: apiUrl,
            onload: function(response) {
                if (response.status === 200) {
                    let blob = new Blob([response.responseText], { type: "text/html" });
                    let url = URL.createObjectURL(blob);

                    let a = document.createElement("a");
                    a.href = url;
                    a.download = `${semesterName}.html`;
                    document.body.appendChild(a);
                    a.click();
                    document.body.removeChild(a);
                    URL.revokeObjectURL(url);

                    // 下载完成后关闭提示窗口
                    document.body.removeChild(statusDiv);

                } else {
                    alert("下载失败，状态码：" + response.status);
                    document.body.removeChild(statusDiv);
                }
            },
            onerror: function() {
                alert("下载请求出错");
                document.body.removeChild(statusDiv);
            }
        });
    };

    // 把按钮加到页面
    document.body.appendChild(btn);
})();
