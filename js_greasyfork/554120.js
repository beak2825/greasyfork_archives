// ==UserScript==
// @name         解除阳光沙滩网站粘贴限制
// @namespace    https://github.com/anjiemo/SunnyBeach
// @version      1.2.2
// @description  解除阳光沙滩网站对粘贴操作的禁止限制
// @author       anjiemo
// @match        *://*.sunofbeach.net/*
// @grant        none
// @license      Apache-2.0 license
// @downloadURL https://update.greasyfork.org/scripts/554120/%E8%A7%A3%E9%99%A4%E9%98%B3%E5%85%89%E6%B2%99%E6%BB%A9%E7%BD%91%E7%AB%99%E7%B2%98%E8%B4%B4%E9%99%90%E5%88%B6.user.js
// @updateURL https://update.greasyfork.org/scripts/554120/%E8%A7%A3%E9%99%A4%E9%98%B3%E5%85%89%E6%B2%99%E6%BB%A9%E7%BD%91%E7%AB%99%E7%B2%98%E8%B4%B4%E9%99%90%E5%88%B6.meta.js
// ==/UserScript==

/**
 *                                  Apache License
 *                            Version 2.0, October 2018
 *                         http://www.apache.org/licenses/
 *
 *    TERMS AND CONDITIONS FOR USE, REPRODUCTION, AND DISTRIBUTION
 *
 *    1. Definitions.
 *
 *       "License" shall mean the terms and conditions for use, reproduction,
 *       and distribution as defined by Sections 1 through 9 of this document.
 *
 *       "Licensor" shall mean the copyright owner or entity authorized by
 *       the copyright owner that is granting the License.
 *
 *       "Legal Entity" shall mean the union of the acting entity and all
 *       other entities that control, are controlled by, or are under common
 *       control with that entity. For the purposes of this definition,
 *       "control" means (i) the power, direct or indirect, to cause the
 *       direction or management of such entity, whether by contract or
 *       otherwise, or (ii) ownership of fifty percent (50%) or more of the
 *       outstanding shares, or (iii) beneficial ownership of such entity.
 *
 *       "You" (or "Your") shall mean an individual or Legal Entity
 *       exercising permissions granted by this License.
 *
 *       "Source" form shall mean the preferred form for making modifications,
 *       including but not limited to software source code, documentation
 *       source, and configuration files.
 *
 *       "Object" form shall mean any form resulting from mechanical
 *       transformation or translation of a Source form, including but
 *       not limited to compiled object code, generated documentation,
 *       and conversions to other media types.
 *
 *       "Work" shall mean the work of authorship, whether in Source or
 *       Object form, made available under the License, as indicated by a
 *       copyright notice that is included in or attached to the work
 *       (an example is provided in the Appendix below).
 *
 *       "Derivative Works" shall mean any work, whether in Source or Object
 *       form, that is based on (or derived from) the Work and for which the
 *       editorial revisions, annotations, elaborations, or other modifications
 *       represent, as a whole, an original work of authorship. For the purposes
 *       of this License, Derivative Works shall not include works that remain
 *       separable from, or merely link (or bind by name) to the interfaces of,
 *       the Work and Derivative Works thereof.
 *
 *       "Contribution" shall mean any work of authorship, including
 *       the original version of the Work and any modifications or additions
 *       to that Work or Derivative Works thereof, that is intentionally
 *       submitted to Licensor for inclusion in the Work by the copyright owner
 *       or by an individual or Legal Entity authorized to submit on behalf of
 *       the copyright owner. For the purposes of this definition, "submitted"
 *       means any form of electronic, verbal, or written communication sent
 *       to the Licensor or its representatives, including but not limited to
 *       communication on electronic mailing lists, source code control systems,
 *       and issue tracking systems that are managed by, or on behalf of, the
 *       Licensor for the purpose of discussing and improving the Work, but
 *       excluding communication that is conspicuously marked or otherwise
 *       designated in writing by the copyright owner as "Not a Contribution."
 *
 *       "Contributor" shall mean Licensor and any individual or Legal Entity
 *       on behalf of whom a Contribution has been received by Licensor and
 *       subsequently incorporated within the Work.
 *
 *    2. Grant of Copyright License. Subject to the terms and conditions of
 *       this License, each Contributor hereby grants to You a perpetual,
 *       worldwide, non-exclusive, no-charge, royalty-free, irrevocable
 *       copyright license to reproduce, prepare Derivative Works of,
 *       publicly display, publicly perform, sublicense, and distribute the
 *       Work and such Derivative Works in Source or Object form.
 *
 *    3. Grant of Patent License. Subject to the terms and conditions of
 *       this License, each Contributor hereby grants to You a perpetual,
 *       worldwide, non-exclusive, no-charge, royalty-free, irrevocable
 *       (except as stated in this section) patent license to make, have made,
 *       use, offer to sell, sell, import, and otherwise transfer the Work,
 *       where such license applies only to those patent claims licensable
 *       by such Contributor that are necessarily infringed by their
 *       Contribution(s) alone or by combination of their Contribution(s)
 *       with the Work to which such Contribution(s) was submitted. If You
 *       institute patent litigation against any entity (including a
 *       cross-claim or counterclaim in a lawsuit) alleging that the Work
 *       or a Contribution incorporated within the Work constitutes direct
 *       or contributory patent infringement, then any patent licenses
 *       granted to You under this License for that Work shall terminate
 *       as of the date such litigation is filed.
 *
 *    4. Redistribution. You may reproduce and distribute copies of the
 *       Work or Derivative Works thereof in any medium, with or without
 *       modifications, and in Source or Object form, provided that You
 *       meet the following conditions:
 *
 *       (a) You must give any other recipients of the Work or
 *           Derivative Works a copy of this License; and
 *
 *       (b) You must cause any modified files to carry prominent notices
 *           stating that You changed the files; and
 *
 *       (c) You must retain, in the Source form of any Derivative Works
 *           that You distribute, all copyright, patent, trademark, and
 *           attribution notices from the Source form of the Work,
 *           excluding those notices that do not pertain to any part of
 *           the Derivative Works; and
 *
 *       (d) If the Work includes a "NOTICE" text file as part of its
 *           distribution, then any Derivative Works that You distribute must
 *           include a readable copy of the attribution notices contained
 *           within such NOTICE file, excluding those notices that do not
 *           pertain to any part of the Derivative Works, in at least one
 *           of the following places: within a NOTICE text file distributed
 *           as part of the Derivative Works; within the Source form or
 *           documentation, if provided along with the Derivative Works; or,
 *           within a display generated by the Derivative Works, if and
 *           wherever such third-party notices normally appear. The contents
 *           of the NOTICE file are for informational purposes only and
 *           do not modify the License. You may add Your own attribution
 *           notices within Derivative Works that You distribute, alongside
 *           or as an addendum to the NOTICE text from the Work, provided
 *           that such additional attribution notices cannot be construed
 *           as modifying the License.
 *
 *       You may add Your own copyright statement to Your modifications and
 *       may provide additional or different license terms and conditions
 *       for use, reproduction, or distribution of Your modifications, or
 *       for any such Derivative Works as a whole, provided Your use,
 *       reproduction, and distribution of the Work otherwise complies with
 *       the conditions stated in this License.
 *
 *    5. Submission of Contributions. Unless You explicitly state otherwise,
 *       any Contribution intentionally submitted for inclusion in the Work
 *       by You to the Licensor shall be under the terms and conditions of
 *       this License, without any additional terms or conditions.
 *       Notwithstanding the above, nothing herein shall supersede or modify
 *       the terms of any separate license agreement you may have executed
 *       with Licensor regarding such Contributions.
 *
 *    6. Trademarks. This License does not grant permission to use the trade
 *       names, trademarks, service marks, or product names of the Licensor,
 *       except as required for reasonable and customary use in describing the
 *       origin of the Work and reproducing the content of the NOTICE file.
 *
 *    7. Disclaimer of Warranty. Unless required by applicable law or
 *       agreed to in writing, Licensor provides the Work (and each
 *       Contributor provides its Contributions) on an "AS IS" BASIS,
 *       WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or
 *       implied, including, without limitation, any warranties or conditions
 *       of TITLE, NON-INFRINGEMENT, MERCHANTABILITY, or FITNESS FOR A
 *       PARTICULAR PURPOSE. You are solely responsible for determining the
 *       appropriateness of using or redistributing the Work and assume any
 *       risks associated with Your exercise of permissions under this License.
 *
 *    8. Limitation of Liability. In no event and under no legal theory,
 *       whether in tort (including negligence), contract, or otherwise,
 *       unless required by applicable law (such as deliberate and grossly
 *       negligent acts) or agreed to in writing, shall any Contributor be
 *       liable to You for damages, including any direct, indirect, special,
 *       incidental, or consequential damages of any character arising as a
 *       result of this License or out of the use or inability to use the
 *       Work (including but not limited to damages for loss of goodwill,
 *       work stoppage, computer failure or malfunction, or any and all
 *       other commercial damages or losses), even if such Contributor
 *       has been advised of the possibility of such damages.
 *
 *    9. Accepting Warranty or Additional Liability. While redistributing
 *       the Work or Derivative Works thereof, You may choose to offer,
 *       and charge a fee for, acceptance of support, warranty, indemnity,
 *       or other liability obligations and/or rights consistent with this
 *       License. However, in accepting such obligations, You may act only
 *       on Your own behalf and on Your sole responsibility, not on behalf
 *       of any other Contributor, and only if You agree to indemnify,
 *       defend, and hold each Contributor harmless for any liability
 *       incurred by, or claims asserted against, such Contributor by reason
 *       of your accepting any such warranty or additional liability.
 *
 *    END OF TERMS AND CONDITIONS
 *
 *    APPENDIX: How to apply the Apache License to your work.
 *
 *       To apply the Apache License to your work, attach the following
 *       boilerplate notice, with the fields enclosed by brackets "[]"
 *       replaced with your own identifying information. (Don't include
 *       the brackets!)  The text should be enclosed in the appropriate
 *       comment syntax for the file format. We also recommend that a
 *       file or class name and description of purpose be included on the
 *       same "printed page" as the copyright notice for easier
 *       identification within third-party archives.
 *
 *    Copyright 2018 Huang JinQun
 *
 *    Licensed under the Apache License, Version 2.0 (the "License");
 *    you may not use this file except in compliance with the License.
 *    You may obtain a copy of the License at
 *
 *        http://www.apache.org/licenses/LICENSE-2.0
 *
 *    Unless required by applicable law or agreed to in writing, software
 *    distributed under the License is distributed on an "AS IS" BASIS,
 *    WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *    See the License for the specific language governing permissions and
 *    limitations under the License.
 */

(function() {
    'use strict';

    /**
     * 解除网页粘贴限制的主要方法
     */
    function removePasteRestrictions() {
        console.log('开始解除网页粘贴限制...');

        // 定时检查并修复新创建的元素
        startMonitoring();

        console.log('网页粘贴限制解除完成！');
    }

    /**
     * 监控新创建的元素并修复它们的粘贴限制
     */
    function startMonitoring() {
        // 使用 MutationObserver 监控DOM变化
        const observer = new MutationObserver((mutations) => {
            enableContentEditablePaste();
        });
    
        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    }

    /**
     * 为可编辑div元素启用粘贴功能
     */
    function enableContentEditablePaste() {
        // 查找具有contenteditable属性的div元素
        const editableDiv = document.querySelector('div[contenteditable]');
        fixInputElement(editableDiv)
    }

    /**
     * 修复单个输入元素的粘贴限制
     */
    function fixInputElement(element) {
        // 为该元素添加粘贴事件监听器
        element.addEventListener("paste", function (event) {
            // 阻止事件冒泡
            event.stopPropagation();

            // 阻止默认粘贴行为
            event.preventDefault();

            // 初始化粘贴文本变量
            let clipboardText = '';
            // 获取事件对象（兼容不同浏览器）
            const clipboardEvent = (event.originalEvent || event);

            // 记录剪贴板数据到控制台
            console.log(clipboardEvent.clipboardData);

            // 从剪贴板获取纯文本数据
            if (clipboardEvent.clipboardData && clipboardEvent.clipboardData.getData) {
                clipboardText = clipboardEvent.clipboardData.getData('text/plain');
            } else if (window.clipboardData && window.clipboardData.getData) {
                clipboardText = window.clipboardData.getData('Text');
            }

            // 尝试使用insertText命令插入文本
            if (document.queryCommandSupported('insertText')) {
                document.execCommand('insertText', false, clipboardText);
            } else {
                // 备用方案：使用paste命令
                document.execCommand('paste', false, clipboardText);
            }
        });
    }

    /**
     * 一键解除所有限制（最彻底的方法）
     */
    function removeAllRestrictions() {
        console.log('执行彻底解除限制...');

        enableContentEditablePaste();

        console.log('所有限制已彻底解除！');

        // 显示操作反馈
        showFeedback('已解除粘贴限制！');
    }

    /**
     * 创建可拖拽的控制按钮
     */
    function addDraggableControlButton() {
        const button = document.createElement('button');
        button.innerHTML = '🔓 解除粘贴限制';
        button.id = 'paste-restriction-remover-btn';

        // 按钮样式
        button.style.cssText = `
            position: fixed;
            top: 80px;
            right: 20px;
            z-index: 10000;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            border: none;
            padding: 8px 12px;
            border-radius: 20px;
            cursor: move;
            font-size: 12px;
            font-weight: bold;
            box-shadow: 0 4px 15px rgba(0,0,0,0.2);
            user-select: none;
            transition: all 0.2s ease;
            min-width: 120px;
            backdrop-filter: blur(10px);
        `;

        // 悬停效果
        button.addEventListener('mouseenter', () => {
            if (!button.isDragging) {
                button.style.transform = 'scale(1.05)';
                button.style.boxShadow = '0 6px 20px rgba(0,0,0,0.3)';
            }
        });

        button.addEventListener('mouseleave', () => {
            if (!button.isDragging) {
                button.style.transform = 'scale(1)';
                button.style.boxShadow = '0 4px 15px rgba(0,0,0,0.2)';
            }
        });

        document.body.appendChild(button);

        // 添加优化的拖拽功能
        makeButtonDraggable(button);
    }

    /**
     * 使按钮可拖拽
     */
    function makeButtonDraggable(button) {
        let isDragging = false;
        let startX, startY, initialX, initialY;
        let animationFrameId = null;

        button.addEventListener('mousedown', startDrag);

        function startDrag(e) {
            // 阻止默认行为，避免文本选中
            e.preventDefault();
            e.stopPropagation();

            isDragging = false;
            button.isDragging = true;

            // 获取初始位置
            startX = e.clientX;
            startY = e.clientY;
            initialX = button.offsetLeft;
            initialY = button.offsetTop;

            // 添加拖动样式
            button.style.opacity = '0.9';
            button.style.cursor = 'grabbing';
            button.style.transition = 'none'; // 拖动时禁用过渡动画

            document.addEventListener('mousemove', onDrag);
            document.addEventListener('mouseup', stopDrag);

            // 阻止鼠标事件冒泡
            document.addEventListener('click', preventClickDuringDrag, true);
        }

        function onDrag(e) {
            if (!isDragging) {
                // 立即开始拖动，不需要阈值
                isDragging = true;
            }

            // 使用 requestAnimationFrame 实现流畅动画
            if (animationFrameId) {
                cancelAnimationFrame(animationFrameId);
            }

            animationFrameId = requestAnimationFrame(() => {
                // 计算移动距离
                const dx = e.clientX - startX;
                const dy = e.clientY - startY;

                // 计算新位置
                let newLeft = initialX + dx;
                let newTop = initialY + dy;

                // 边界限制（留出5px边距）
                const margin = 5;
                newTop = Math.max(margin, Math.min(newTop, window.innerHeight - button.offsetHeight - margin));
                newLeft = Math.max(margin, Math.min(newLeft, window.innerWidth - button.offsetWidth - margin));

                // 立即更新位置（不使用transform，避免急刹感）
                button.style.left = newLeft + 'px';
                button.style.top = newTop + 'px';
                button.style.right = 'auto';
            });
        }

        function stopDrag(e) {
            // 清理资源
            if (animationFrameId) {
                cancelAnimationFrame(animationFrameId);
                animationFrameId = null;
            }

            // 移除事件监听器
            document.removeEventListener('mousemove', onDrag);
            document.removeEventListener('mouseup', stopDrag);
            document.removeEventListener('click', preventClickDuringDrag, true);

            // 恢复样式
            button.style.opacity = '1';
            button.style.cursor = 'move';
            button.style.transition = 'all 0.2s ease'; // 恢复过渡动画
            button.isDragging = false;

            // 保存位置
            saveButtonPosition();

            // 如果是拖动操作，完全阻止点击事件
            if (isDragging) {
                e.preventDefault();
                e.stopPropagation();

                // 添加一个小的延迟，确保点击事件被完全阻止
                setTimeout(() => {
                    isDragging = false;
                }, 50);
            }
        }

        // 阻止拖动过程中的点击事件
        function preventClickDuringDrag(e) {
            if (isDragging) {
                e.preventDefault();
                e.stopPropagation();
                e.stopImmediatePropagation();
            }
        }

        // 保存按钮位置
        function saveButtonPosition() {
            const position = {
                left: button.style.left,
                top: button.style.top
            };
            localStorage.setItem('pasteRemoverBtnPosition', JSON.stringify(position));
        }

        // 加载保存的位置
        function loadButtonPosition() {
            const saved = localStorage.getItem('pasteRemoverBtnPosition');
            if (saved) {
                try {
                    const position = JSON.parse(saved);
                    if (position.left) button.style.left = position.left;
                    if (position.top) button.style.top = position.top;
                    button.style.right = 'auto';
                } catch (e) {
                    console.log('加载按钮位置失败:', e);
                }
            }
        }

        // 初始化时加载位置
        setTimeout(loadButtonPosition, 100);

        // 添加单独的点击事件处理器（在拖动结束后才执行）
        button.addEventListener('click', (e) => {
            // 如果是拖动操作，完全忽略点击
            if (isDragging) {
                e.preventDefault();
                e.stopPropagation();
                return;
            }

            // 只有真正的点击才执行功能
            removeAllRestrictions();
        });
    }

    /**
     * 显示操作反馈
     */
    function showFeedback(message) {
        // 移除已存在的反馈
        const existingFeedback = document.getElementById('paste-remover-feedback');
        if (existingFeedback) {
            existingFeedback.remove();
        }

        const feedback = document.createElement('div');
        feedback.id = 'paste-remover-feedback';
        feedback.textContent = message;
        feedback.style.cssText = `
            position: fixed;
            top: 20px;
            left: 50%;
            transform: translateX(-50%);
            background: #4CAF50;
            color: white;
            padding: 10px 20px;
            border-radius: 5px;
            z-index: 10001;
            font-size: 14px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.3);
            animation: fadeInOut 2s ease-in-out;
        `;

        // 添加动画样式
        if (!document.getElementById('paste-remover-styles')) {
            const style = document.createElement('style');
            style.id = 'paste-remover-styles';
            style.textContent = `
                @keyframes fadeInOut {
                    0% { opacity: 0; transform: translateX(-50%) translateY(-20px); }
                    20% { opacity: 1; transform: translateX(-50%) translateY(0); }
                    80% { opacity: 1; transform: translateX(-50%) translateY(0); }
                    100% { opacity: 0; transform: translateX(-50%) translateY(-20px); }
                }
            `;
            document.head.appendChild(style);
        }

        document.body.appendChild(feedback);

        // 2秒后自动移除
        setTimeout(() => {
            if (feedback.parentNode) {
                feedback.remove();
            }
        }, 2000);
    }

    // 提供全局方法供调用
    window.removePasteRestrictions = removePasteRestrictions;
    window.removeAllRestrictions = removeAllRestrictions;
    window.fixPasteIssues = removePasteRestrictions;

    // 自动执行
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', function() {
            removePasteRestrictions();
            setTimeout(addDraggableControlButton, 1000);
        });
    } else {
        removePasteRestrictions();
        setTimeout(addDraggableControlButton, 1000);
    }

})();