// ==UserScript==
// @name         广西公需|广西专业技术人员继续教育信息管理系统
// @namespace    https://wqzai.cn
// @version      1.0.0
// @description  【300一个月授权，随便使用，期间无任何限制，秒刷视频、秒考试、秒下证书、可批量】！联系微信：wqzai_cn 获取脚本授权。
// @icon         https://exam.gxpf.cn/content/images/favicon.ico
// @author       wqzai
// @match        https://gxjxjy.rst.gxzf.gov.cn/*
// @grant        GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/556445/%E5%B9%BF%E8%A5%BF%E5%85%AC%E9%9C%80%7C%E5%B9%BF%E8%A5%BF%E4%B8%93%E4%B8%9A%E6%8A%80%E6%9C%AF%E4%BA%BA%E5%91%98%E7%BB%A7%E7%BB%AD%E6%95%99%E8%82%B2%E4%BF%A1%E6%81%AF%E7%AE%A1%E7%90%86%E7%B3%BB%E7%BB%9F.user.js
// @updateURL https://update.greasyfork.org/scripts/556445/%E5%B9%BF%E8%A5%BF%E5%85%AC%E9%9C%80%7C%E5%B9%BF%E8%A5%BF%E4%B8%93%E4%B8%9A%E6%8A%80%E6%9C%AF%E4%BA%BA%E5%91%98%E7%BB%A7%E7%BB%AD%E6%95%99%E8%82%B2%E4%BF%A1%E6%81%AF%E7%AE%A1%E7%90%86%E7%B3%BB%E7%BB%9F.meta.js
// ==/UserScript==


(function() {
    // 等待网页加载完毕
    window.onload = function () {
        if (location.href.includes('https://exam.gxpf.cn/grade.html')) {
            window.open('https://exam.gxpf.cn/grade-print-new.html?examId=self_170&examStartDateTime=2024%25E5%25B9%25B410%25E6%259C%258824%25E6%2597%25A5&score=100&examEndDateTime=2025%25E5%25B9%25B401%25E6%259C%258831%25E6%2597%25A5&examName=2024%25E5%25B9%25B4%25E5%25BA%25A6%25E5%2585%25A8%25E5%258C%25BA%25E5%259B%25BD%25E5%25AE%25B6%25E5%25B7%25A5%25E4%25BD%259C%25E4%25BA%25BA%25E5%2591%2598%25E5%25AD%25A6%25E6%25B3%2595%25E7%2594%25A8%25E6%25B3%2595%25E8%2580%2583%25E8%25AF%2595&examYear=2024', '_blank')
        }
        sleep(getAnswer)
        monitor()
    }
    
    // 延迟1秒执行
    function sleep(func){
        setTimeout(function() {
            func()
        }, 100)
    }

    // 回调函数
    function callback() {
        sleep(getAnswer)
    }
})