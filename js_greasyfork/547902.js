// ==UserScript==
// @name         宝武微学苑study
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  好好学习
// @match        http://mooc.baosteel.com/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/547902/%E5%AE%9D%E6%AD%A6%E5%BE%AE%E5%AD%A6%E8%8B%91study.user.js
// @updateURL https://update.greasyfork.org/scripts/547902/%E5%AE%9D%E6%AD%A6%E5%BE%AE%E5%AD%A6%E8%8B%91study.meta.js
// ==/UserScript==

// 定义全局cookie变量
const global_dic = {
    cookies: document.cookie || "",
    class_id: 0
};

(function () {
    'use strict';
    window.onload = function() {
        // 初始化按钮
        initButtons();
    }
    // 监听页面 DOM 变化
    const observer = new MutationObserver(async () => {
        // 判断按钮是否已存在
        if (!document.getElementById("printButton") || !document.getElementById("jumpButton")) {
            initButtons();
        }
        // 判断是否有30分钟提示弹窗
        if (document.querySelector('.ant-modal-mask')) {
            // 找到弹窗中的确定按钮并点击
            const confirmButton = document.querySelector('.ant-modal-footer').querySelector('button');
            confirmButton.click();
            await sleep(1000); // 等待1秒
            // 找到视频，判断是否暂停，如果暂停则播放
            const video = document.querySelector('video');
            if (video.paused) {
                video.play();
            }
        }
        // 判断视频是否结束
        if (document.querySelector('.video-modal').classList.contains("show")) {
            const saveButton = document.querySelectorAll('.ant-btn-danger')[1]; // 找到保存按钮
            // 忽略所有弹窗
            window.alert = function() {};
            window.confirm = function() { return true; }; // confirm 返回 true 或 false
            window.prompt = function() { return null; };            
            if (saveButton) {
                if (saveButton.disabled) {
                    console.log("保存按钮不可点，等待1分钟再试");
                    // 等待1分钟再试
                    await sleep(60000);
                }
                console.log("点击保存");
                saveButton.click();
                await sleep(3000); // 等待3秒，保存之后要向后端传输数据，再返回前端渲染。
            } else {
                // 弹窗提示报错，没有保存成功
                alert("保存失败，请手动保存");
                return;
            }
            // 判断哪个视频还没学完，则点击哪个视频，如果全部学完则跳转到下一个栏目
            const videoList = document.querySelectorAll("li.section"); // 找到视频列表
            for (let li of videoList) {
                // 如果没有 finish 就点击并退出循环
                if (!li.classList.contains("finish")) {
                    li.click(); // 模拟点击
                    return;
                }
            }
            // 更新当前课程状态为已完成
            markCourseAsCompleted(global_dic.class_id);
            // 如果全部学完则跳转到下一个栏目
            handleJumpCourse();
        }
    });
    observer.observe(document.body, { childList: true, subtree: true });

})();
// 模仿睡眠函数
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * 创建一个按钮并绑定事件
 * @param {string} id - 按钮ID
 * @param {string} text - 按钮显示文字
 * @param {number} top - 距离顶部的像素
 * @param {Function} onClick - 点击回调函数
 */
function createButton(id, text, top, onClick) {
    // 避免重复创建
    if (document.getElementById(id)) return;

    let button = document.createElement('button');
    button.id = id;
    button.innerText = text;
    button.style.position = 'fixed';
    button.style.top = `${top}px`;
    button.style.right = '10px';
    button.style.zIndex = '9999';
    button.style.padding = '6px 12px';
    button.style.backgroundColor = '#4CAF50';
    button.style.color = 'white';
    button.style.border = 'none';
    button.style.borderRadius = '5px';
    button.style.cursor = 'pointer';
    button.style.transition = 'all 0.2s ease'; // 平滑过渡

    button.addEventListener('click', async () => {
        // 点击特效：缩放、变色
        button.style.transform = 'scale(0.9)';
        button.style.backgroundColor = '#388E3C';

        // 提示用户点击成功
        let oldText = button.innerText;
        button.innerText = '✅ 已点击';

        // 恢复效果
        setTimeout(() => {
            button.style.transform = 'scale(1)';
            button.style.backgroundColor = '#4CAF50';
            button.innerText = oldText;
        }, 600);

        // 执行原本逻辑
        await onClick();
    });

    document.body.appendChild(button);
}


// 获取所有课程信息
async function getCourseInfo() {
    try {
        // 1.获取当前页面的cookie
        // const cookies = document.cookie || "";

        // 2.构造请求头
        const headers = {
            "Cookie": global_dic.cookies,
        };

        // 3.构造post数据
        // 构造 form-data 数据
        const formData = new FormData();
        formData.append("pageSize", 300);

        const url = "http://mooc.baosteel.com/qm/api/v5/subject/2652/courses"
        // 4.发送post请求
        const response = await fetch(url, {
            method: "POST",
            headers: headers,
            body: formData,
        });

        // 5.判断响应状态
        if (!response.ok) {
            console.error("课程信息请求失败:", response.status, response.statusText);
            return [];
        }

        // 6.解析JSON
        const result = await response.json();
        console.log("课程信息请求成功:", result);
        // 7.返回课程列表
        if (result && result.data && Array.isArray(result.data.list)) {
            return result.data.list;
        } else {
            console.warn("课程信息返回数据格式异常:", result);
            return [];
        }

    } catch (error) {
        console.error("课程信息请求出错:", error);
        return [];
    }
}

// 分类课程
function classifyCourses(class_list) {
    // 初始化分类结果
    const result = {
        required: {
            completed: [],   // 必修已完成
            notCompleted: [], // 必修未完成
            notStarted: []   // 必修未学习
        },
        optional: {
            completed: [],   // 选修已完成
            notCompleted: [], // 选修未完成
            notStarted: []   // 选修未学习
        }
    };

    if (!Array.isArray(class_list)) {
        console.error("class_list 数据格式错误:", class_list);
        return result;
    }

    class_list.forEach(course => {
        const {
            content_name = "未知课程",
            status_text = "未知状态",
            is_required = "N",
            content_id = null,
            score = null,
        } = course;

        const info = {
            content_name,
            status_text,
            is_required,
            content_id,
            score
        };

        // 判断课程是必修还是选修
        const category = is_required === "Y" ? result.required : result.optional;

        // 判断学习状态
        if (status_text.includes("已完成")) {
            category.completed.push(info);
        } else if (status_text.includes("进行中")) {
            category.notCompleted.push(info);
        } else if (status_text.includes("未学习")) {
            category.notStarted.push(info);
        } else {
            console.warn("未知学习状态:", status_text, "课程:", content_name);
        }
    });

    return result;
}
// 生成两个列表，一个是未完成列表，一个是已完成列表
function buildCourseLists(grouped) {
    const list1 = [
        ...grouped.required.notStarted,   // 未学习必修
        ...grouped.required.notCompleted, // 未完成必修
        ...grouped.optional.notStarted,   // 未学习选修
        ...grouped.optional.notCompleted  // 未完成选修
    ];

    const list2 = [
        ...grouped.required.completed,    // 已完成必修
        ...grouped.optional.completed     // 已完成选修
    ];

    return { list1, list2 };
}

// 存储到浏览器
function saveCourseLists(list1, list2) {
    localStorage.setItem("course_list1", JSON.stringify(list1));
    localStorage.setItem("course_list2", JSON.stringify(list2));
}

// 读取存储信息
function loadCourseLists() {
    const list1 = JSON.parse(localStorage.getItem("course_list1") || "[]");
    const list2 = JSON.parse(localStorage.getItem("course_list2") || "[]");
    return { list1, list2 };
}

// 更新（将课程从 list1 移到 list2）
function markCourseAsCompleted(courseId) {
    const { list1, list2 } = loadCourseLists();

    // 在 list1 中找到该课程
    const index = list1.findIndex(c => c.content_id === courseId);
    if (index !== -1) {
        const [course] = list1.splice(index, 1); // 移出

        // 更新课程状态为已完成
        course.status_text = "已完成";

        // 加入到 list2
        list2.push(course);

        // 保存更新后的结果
        saveCourseLists(list1, list2);

        console.log(`课程 ${course.content_name} 已移动到已完成列表`);
    } else {
        console.warn("未在未完成列表中找到课程:", courseId);
    }
}
/**
 * 打印课程信息并保存到本地
 */
async function handlePrintCourses() {
    try {
        const class_list = await getCourseInfo();
        const grouped = classifyCourses(class_list);

        console.log("课程分类结果:", grouped);

        const { list1, list2 } = buildCourseLists(grouped);
        saveCourseLists(list1, list2);

        console.log("开始学习课程列表:", list1);
        console.log("已经完成课程列表:", list2);

    } catch (err) {
        console.error("获取课程信息失败:", err);
    }
}
/**
 * 跳转到课程URL
 */
function handleJumpCourse() {
    try {
        const { list1 } = loadCourseLists();
        if (!list1 || list1.length === 0) {
            console.warn("没有找到未完成的课程列表。");
            return;
        }

        const firstCourse = list1[0];
        if (!firstCourse || !firstCourse.content_id) {
            console.warn("课程数据异常:", firstCourse);
            return;
        }
        global_dic.class_id = firstCourse.content_id;
        const courseUrl = `http://mooc.baosteel.com/#/course/${global_dic.class_id}/play`;
        console.log("跳转课程地址:", courseUrl);
        window.location.replace(courseUrl);
        window.location.reload(); // 强制刷新页面

    } catch (err) {
        console.error("跳转课程失败:", err);
    }
}
// 查询当前课程的成绩
async function queryCourseScore(course_id) {
    // http://mooc.baosteel.com/qm/api/v5/strategy/mylist
    try {
        // 1.获取当前页面的cookie
        // const cookies = document.cookie || "";

        // 2.构造请求头
        const headers = {
            "Cookie": global_dic.cookies,
        };

        // 3.构造post数据
        // 构造 form-data 数据
        const formData = new FormData();
        formData.append("course_id", course_id);

        const url = "http://mooc.baosteel.com/qm/api/v5/strategy/mylist"
        // 4.发送post请求
        const response = await fetch(url, {
            method: "POST",
            headers: headers,
            body: formData,
        });

        // 5.判断响应状态
        if (!response.ok) {
            console.error(`${course_id}课程信息请求失败:`, response.status, response.statusText);
            return 0;
        }

        // 6.解析JSON
        const result = await response.json();
        console.log(`${course_id}课程信息请求成功:`, result);
        // 7.返回课程列表
        if (result && result.data) {
            return data.csVo.score;
        } else {
            console.warn(`${course_id}课程信息返回数据格式异常:`, result);
            return 0;
        }

    } catch (error) {
        console.error(`${course_id}课程信息请求出错:`, error);
        return 0;
    }
}
// 初始化按钮
function initButtons() {
    console.log("初始化按钮");
    createButton("printButton", "1.刷新课程链接与信息", 10, handlePrintCourses);
    createButton("jumpButton", "2.点击开始自动学习跳转", 50, handleJumpCourse);
}
