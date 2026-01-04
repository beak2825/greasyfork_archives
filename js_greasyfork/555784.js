// ==UserScript==
// @name         超星学习通批阅自动提交
// @version      2.0
// @description  自动打开docx文件,点击快速打分后自动提交并进入下一份
// @author       wei
// @match        *://mooc2-ans.chaoxing.com/*
// @grant        none
// @run-at       document-end
// @license MIT
// @namespace https://greasyfork.org/users/1537569
// @downloadURL https://update.greasyfork.org/scripts/555784/%E8%B6%85%E6%98%9F%E5%AD%A6%E4%B9%A0%E9%80%9A%E6%89%B9%E9%98%85%E8%87%AA%E5%8A%A8%E6%8F%90%E4%BA%A4.user.js
// @updateURL https://update.greasyfork.org/scripts/555784/%E8%B6%85%E6%98%9F%E5%AD%A6%E4%B9%A0%E9%80%9A%E6%89%B9%E9%98%85%E8%87%AA%E5%8A%A8%E6%8F%90%E4%BA%A4.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 延迟执行,确保页面加载完成
    setTimeout(function() {
        // 1. 自动点击学生答案中的docx文件
        autoClickDocxFile();

        // 2. 监听快速打分按钮
        monitorFastScoreButtons();

        // 3. 添加键盘快捷键
        setupKeyboardShortcuts();

        // 4. 检测文件命名
        checkFileNaming();

    }, 1000);

    // 自动点击docx文件
    function autoClickDocxFile() {
        // 获取学生答案区域
        const studentAnswerDiv = document.querySelector('.stuAnswerWords');

        if (studentAnswerDiv) {
            // 直接查找所有docx格式的iframe
            const docxIframes = studentAnswerDiv.querySelectorAll('iframe[filename*=".docx"]');

            if (docxIframes.length > 0) {
                const firstDocx = docxIframes[0];
                const filename = firstDocx.getAttribute('filename');
                const objectid = firstDocx.getAttribute('objectid');
                console.log('找到docx文件,准备打开:', filename, 'objectid:', objectid);

                // 从页面隐藏字段获取必要参数
                const courseId = document.getElementById('courseId')?.value;
                const classId = document.getElementById('classId')?.value;
                const workId = document.getElementById('workId')?.value;
                const questionId = '405289068';
                const recordId = document.querySelector('[id^="stuanswer_"]')?.id.replace('stuanswer_', '');
                const fullScore = document.getElementById('fullScore' + recordId)?.value || '100';
                const score = document.getElementById('score' + recordId)?.value || '0';
                const stuPersonId = document.getElementById('stuPersonId')?.value;
                const teacherPersonId = document.getElementById('personId')?.value || '461204614';
                const libraryCourseId = document.getElementById('libraryCourseId')?.value;

                console.log('参数:', {courseId, classId, workId, objectid, questionId, recordId});

                // 调用check-attach接口获取预览URL
                const checkAttachUrl = `/mooc2-ans/work/check-attach?courseId=${courseId}&classId=${classId}&workId=${workId}&objectId=${objectid}&questionId=${questionId}&recordId=${recordId}&fullScore=${fullScore}&score=${score}&stuPersonId=${stuPersonId}&teacherPersonId=${teacherPersonId}&relationQuestionId=${questionId}&itemId=&type=0&libraryCourseId=${libraryCourseId}`;

                console.log('调用接口:', checkAttachUrl);

                fetch(checkAttachUrl)
                    .then(response => response.json())
                    .then(data => {
                        if (data.status && data.url) {
                            console.log('获取预览URL成功');
                            const previewUrl = data.url;

                            // 方式1: 尝试在当前窗口打开
                            try {
                                // 创建一个不可见的链接并触发点击
                                const link = document.createElement('a');
                                link.href = previewUrl;
                                link.target = '_blank';
                                link.style.display = 'none';
                                document.body.appendChild(link);
                                link.click();
                                document.body.removeChild(link);
                                console.log('已通过link元素打开文件');
                            } catch (e) {
                                console.log('link打开失败:', e.message);
                                // 方式2: 直接使用window.open
                                try {
                                    const newWindow = window.open(previewUrl, '_blank', 'noopener,noreferrer');
                                    if (!newWindow) {
                                        console.log('弹窗被拦截,尝试在当前页面打开');
                                        window.location.href = previewUrl;
                                    }
                                } catch (e2) {
                                    console.log('window.open失败:', e2.message);
                                }
                            }
                        } else {
                            console.log('获取预览URL失败:', data.msg);
                        }
                    })
                    .catch(error => {
                        console.log('请求失败:', error);
                    });

                console.log('已执行打开文件操作');
            } else {
                console.log('未找到docx文件');
            }
        }
    }

    // 鼠标模拟点击函数
    function simulateMouseClick(element) {
        // 创建鼠标事件
        const mouseDownEvent = new MouseEvent('mousedown', {
            bubbles: true,
            cancelable: true,
            view: window,
            buttons: 1
        });

        const mouseUpEvent = new MouseEvent('mouseup', {
            bubbles: true,
            cancelable: true,
            view: window
        });

        const clickEvent = new MouseEvent('click', {
            bubbles: true,
            cancelable: true,
            view: window
        });

        // 依次触发事件
        element.dispatchEvent(mouseDownEvent);
        setTimeout(() => {
            element.dispatchEvent(mouseUpEvent);
            element.dispatchEvent(clickEvent);
        }, 50);
    }

    // 键盘快捷键设置
    function setupKeyboardShortcuts() {

        document.addEventListener('keydown', function(event) {
            // 获取按下的键
            const key = event.key.toLowerCase();

            // 映射关系: z->A(100), x->B(90), c->C(70), v->D(60), b->E(50)
            const keyMap = {
                'z': 0,  // A - 100分
                'x': 1,  // B - 90分
                'c': 2,  // C - 70分
                'v': 3,  // D - 60分
                'b': 4   // E - 50分
            };

            if (key in keyMap) {
                event.preventDefault();
                const index = keyMap[key];

                // 获取快速打分按钮
                const fastScoreButtons = document.querySelectorAll('.quickScoreLi .fastScore');

                if (fastScoreButtons.length > index) {
                    const button = fastScoreButtons[index];
                    const scoreText = button.textContent;
                    console.log(`快捷键 ${key.toUpperCase()} 触发 - ${scoreText}`);

                    // 点击对应的快速打分按钮
                    button.click();
                } else {
                    console.log(`快捷键 ${key.toUpperCase()} - 按钮不存在`);
                }
            }
        });
    }

    // 检测文件命名是否正确
    function checkFileNaming() {
        const studentAnswerDiv = document.querySelector('.stuAnswerWords');

        if (!studentAnswerDiv) {
            console.log('未找到学生答案区域');
            return;
        }

        // 获取学生姓名和学号
        const nameElement = document.querySelector('.personalInfor dt');
        const idElement = document.querySelector('.personalInfor dd');

        if (!nameElement || !idElement) {
            console.log('未找到学生信息');
            return;
        }

        const studentName = nameElement.textContent.trim();
        const studentId = idElement.textContent.trim();
        const expectedName = studentName + studentId;

        console.log(`检测文件命名: 学生=${studentName}, 学号=${studentId}, 期望命名=${expectedName}`);

        // 获取所有文件
        const docxFiles = studentAnswerDiv.querySelectorAll('iframe[filename*=".docx"]');
        const zipFiles = studentAnswerDiv.querySelectorAll('iframe[filename*=".zip"]');

        let namingCorrect = true;
        let fileList = [];
        let errorFiles = [];

        // 检查docx文件
        docxFiles.forEach(file => {
            const filename = file.getAttribute('filename');
            fileList.push(filename);
            const baseName = filename.replace('.docx', '');
            if (!baseName.includes(expectedName) && baseName !== studentName + studentId) {
                namingCorrect = false;
                errorFiles.push(filename);
                console.log(`❌ docx文件命名错误: ${filename}, 应为: ${expectedName}.docx`);
            } else {
                console.log(`✓ docx文件命名正确: ${filename}`);
            }
        });

        // 检查zip文件
        zipFiles.forEach(file => {
            const filename = file.getAttribute('filename');
            fileList.push(filename);
            const baseName = filename.replace('.zip', '');
            if (!baseName.includes(expectedName) && baseName !== studentName + studentId) {
                namingCorrect = false;
                errorFiles.push(filename);
                console.log(`❌ zip文件命名错误: ${filename}, 应为: ${expectedName}.zip`);
            } else {
                console.log(`✓ zip文件命名正确: ${filename}`);
            }
        });

        // 如果命名不正确,标红提示
        if (!namingCorrect) {
            console.log('⚠️ 文件命名不正确,标红提示');
            highlightFileNamingWarning(errorFiles, expectedName);
        } else {
            console.log('✓ 所有文件命名正确');
        }

        console.log('文件列表:', fileList);
    }
    // 标红提示文件命名错误
    function highlightFileNamingWarning(errorFiles, expectedName) {
        // 获取记录ID
        const recordId = document.querySelector('[id^="stuanswer_"]')?.id.replace('stuanswer_', '');

        if (!recordId) {
            console.log('未找到recordId');
            return;
        }

        // 构建警告文本
        let warningText = '⚠️ 文件命名不正确！\n错误文件: ';
        errorFiles.forEach((file, index) => {
            warningText += `\n  ${index + 1}. ${file}`;
        });
        warningText += `\n应命名为: ${expectedName}.docx 和 ${expectedName}.zip`;

        console.log('将在批语框中添加提示:', warningText);

        // 延迟等待编辑器加载完成
        setTimeout(() => {
            try {
                // 获取UE编辑器实例
                const editor = UE.getEditor('answer' + recordId);

                if (editor) {
                    // 获取编辑器当前内容
                    const currentContent = editor.getContent();

                    // 构建HTML格式的提示
                    const warningHtml = `<div style="background-color: #ffebee; border: 2px solid #f44336; border-radius: 4px; padding: 10px; margin-bottom: 10px; color: #c62828; font-weight: bold;">
⚠️ 文件命名不正确！<br/>
错误文件: ${errorFiles.map((f, i) => `<br/>${i + 1}. ${f}`).join('')}<br/>
应命名为: ${expectedName}.docx 和 ${expectedName}.zip
</div>`;

                    // 将警告插入到编辑器开头
                    editor.setContent(warningHtml + currentContent);

                    console.log('已在批语框中添加提示信息');
                } else {
                    console.log('编辑器未加载');
                }
            } catch (e) {
                console.log('添加提示失败:', e.message);
            }
        }, 500);
    }

    // 监听快速打分按钮
    function monitorFastScoreButtons() {
        // 获取所有快速打分按钮
        const fastScoreButtons = document.querySelectorAll('.quickScoreLi .fastScore');

        fastScoreButtons.forEach(button => {
            // 为每个快速打分按钮添加监听
            button.addEventListener('click', function(e) {
                // 等待分数更新,然后自动提交
                setTimeout(function() {
                    autoSubmit();
                }, 500);
            });
        });

    }

    // 自动提交函数
    function autoSubmit() {
        // 获取提交并进入下一份按钮
        const nextButton = document.querySelector('.fanyaMarkingBootm .jb_btn_160');

        if (nextButton) {
            // 检查是否已有分数
            const scoreInput = document.getElementById('tmpscore');
            if (scoreInput && scoreInput.value && scoreInput.value !== '0') {
                console.log('自动提交: 分数=' + scoreInput.value);
                // 点击"提交并进入下一份"按钮
                nextButton.click();

                // 新页面加载后,重新自动点击docx文件
                setTimeout(function() {
                    autoClickDocxFile();
                    monitorFastScoreButtons();
                }, 2000);
            } else {
                console.log('分数为空或为0,不提交');
            }
        }
    }

})();