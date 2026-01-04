// ==UserScript==
// @name         广西普法云平台,国家工作人员学法用法考试
// @namespace    https://wqzai.cn
// @version      1.0.0
// @description  广西普法云平台,国家工作人员学法用法考试，题库，答题！联系微信：wqzai_cn获取定制脚本,微信公众号与小程序：“气测通”已可搜题。
// @icon         https://exam.gxpf.cn/content/images/favicon.ico
// @author       wqzai
// @match        https://gxpf.sft.gxzf.gov.cn/portal/exam*
// @grant        GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/556443/%E5%B9%BF%E8%A5%BF%E6%99%AE%E6%B3%95%E4%BA%91%E5%B9%B3%E5%8F%B0%2C%E5%9B%BD%E5%AE%B6%E5%B7%A5%E4%BD%9C%E4%BA%BA%E5%91%98%E5%AD%A6%E6%B3%95%E7%94%A8%E6%B3%95%E8%80%83%E8%AF%95.user.js
// @updateURL https://update.greasyfork.org/scripts/556443/%E5%B9%BF%E8%A5%BF%E6%99%AE%E6%B3%95%E4%BA%91%E5%B9%B3%E5%8F%B0%2C%E5%9B%BD%E5%AE%B6%E5%B7%A5%E4%BD%9C%E4%BA%BA%E5%91%98%E5%AD%A6%E6%B3%95%E7%94%A8%E6%B3%95%E8%80%83%E8%AF%95.meta.js
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