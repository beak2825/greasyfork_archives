// ==UserScript==
// @name         继续教育（湖南师范大学）
// @namespace    http://tampermonkey.net/
// @version      2025.11.20
// @description  湖南公需科目自动学习脚本
// @author       dougen
// @match        https://jyjd.hunnu.edu.cn/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=hunnu.edu.cn
// @grant        window.onurlchange
// @license      MIT
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/553147/%E7%BB%A7%E7%BB%AD%E6%95%99%E8%82%B2%EF%BC%88%E6%B9%96%E5%8D%97%E5%B8%88%E8%8C%83%E5%A4%A7%E5%AD%A6%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/553147/%E7%BB%A7%E7%BB%AD%E6%95%99%E8%82%B2%EF%BC%88%E6%B9%96%E5%8D%97%E5%B8%88%E8%8C%83%E5%A4%A7%E5%AD%A6%EF%BC%89.meta.js
// ==/UserScript==

(function () {
    "use strict"

    const WAIT_TIME = 5000

    let latestPath = ""
    let videoIntervalId = 0
    let courseIntervalId = 0
    let currentPath = ''

    setInterval(main, WAIT_TIME)

    function main() {
        if (location.pathname != currentPath) {
            console.log("进入了新页面", location.pathname)

            currentPath = location.pathname

            clearInterval(videoIntervalId)
            clearInterval(courseIntervalId)

            if (currentPath == "/personCenter/index") {
                console.log("课程列表页面")
                courseIntervalId = setInterval(() => {
                    const result = gotoVideoPage()
                    if (!result) {
                        clearInterval(courseIntervalId)
                    }
                }, WAIT_TIME)
            }

            if (currentPath == "/personCenter/personCenterStudyDetail") {
                console.log("观看视频页面")
                videoIntervalId = setInterval(()=>{
                    checkPlaylist()
                    playVideo()
                }, WAIT_TIME)
            }
        }
    }

    function gotoVideoPage() {
        let course = getCourseList()
        if (course.length == 0) {
            return true
        }
        // 为了保证从头开始看，不用forEach
        for (let i = 0; i < course.length; i++) {
            if (course[i].progress != "100%") {
                console.log('即将对',course[i].course,'进行学习')
                course[i].button.click()
                return true
            }
        }
        console.log('当前页面的课程学习完毕，进入下一页')
        // 能执行到这里，说明前面的课程都已经学完了，继续下一页
        const nextButton = document.querySelector("button.btn-next")
        if (!nextButton.disabled) {
            nextButton.click()
            return true
        }
        console.log('已经学完所有课程')
        return false
    }

    function getCourseList() {

        const courseList = []

        document
            .querySelectorAll(".m-b10 .f-right .color-danger")
            .forEach((element) => {
            const progressText = element.textContent.trim()

            const courseName = element
            .closest(".m-b10")
            .querySelector("b")
            .textContent.trim()

            const learnButton = element
            .closest(".m-b10")
            .nextElementSibling.querySelector("div.btn-box button")

            courseList.push({
                course: courseName,
                progress: progressText,
                button: learnButton,
            })
        })
        console.log('当前课程表',courseList)
        return courseList
    }

    function playVideo() {
        let video = document.querySelector("video.jw-video")
        if (video) {
            // 屏蔽完成提示框
            let box = document.querySelector(".el-message-box__wrapper")
            let v = document.querySelector(".v-modal")
            if (box && box.style.display != "none") {
                box.style.display = "none"
                v.style.display = "none"
                console.log("关闭提示框")
            }

            // 如果播放完成，则自动播放下一个
            if (video.paused && !video.ended) {
                video.muted = true
                video.play().catch((err) => console.warn("播放失败：", err))
                console.log('检测到视频暂停，自动继续播放')
            }

            if (video.ended) {
                console.log('刷新视频进度')
                const currentPlay = document.querySelector("ul.courseMenuList>li.active span.f-left")
                currentPlay.click()
            }
        } else {
            console.warn("未获取视频标签")
        }
    }

    function checkPlaylist() {
        const playlist = document.querySelector("ul.courseMenuList").children
        for (let i = 0; i < playlist.length; i++) {
            let process = playlist[i].querySelector(".f-right").innerText
            let isActive = (playlist[i].className === 'active')
            if (process != "100%") {
                if (isActive) {
                    return
                } else {
                    console.log("当前视频播放完毕,播放下一个视频")
                    playlist[i].querySelector(".f-left").click()
                    return
                }
            }
        }
        // 如果能执行到这里，说明所有视频都已经播完了，回到课程列表
        console.log('当前课程所有视频播放完毕，返回课程列表')
        setTimeout(backToCoursePage, WAIT_TIME)
    }


    function backToCoursePage() {
        const courseLink = document.querySelector("a[href='/personCenter/index?urlActive=5'")
        if (courseLink) {
            courseLink.click()
            console.log('跳转到课程列表')
        } else {
            console.log('获取课程列表元素失败')
        }
    }
})()
