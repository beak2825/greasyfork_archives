// ==UserScript==
// @name         华医网课脚本
// @namespace    http://tampermonkey.net/
// @version      1.0.1
// @description  华医岗位课程自动播放工具：支持课程自动播放、倍速调节、全局静音切换、自动跳转下一课
// @author       ssxbs
// @match        https://jcpxkh.91huayi.com/exercise/ExerciseHome/index*
// @match        *://*/*courseware_id*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/549925/%E5%8D%8E%E5%8C%BB%E7%BD%91%E8%AF%BE%E8%84%9A%E6%9C%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/549925/%E5%8D%8E%E5%8C%BB%E7%BD%91%E8%AF%BE%E8%84%9A%E6%9C%AC.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // 配置参数：新增首次加载优化相关配置
    const CONFIG = {
        // 原有配置保持不变...
        POST_COURSE_SEL: 'div.navItem[id="/Exercise/ExerciseCourse/ExcellentIndex?package=true"]',
        IFRAME_SEL: '#student_iframe',
        COURSE_LIST_SEL: '.itemList',
        COURSE_ITEM_SEL: '.contentItem',
        COURSE_PLAY_PATHS: [
            'exercise/ExerciseCourse/CoursePlay',
            'exercise/ExerciseCourse/BJYCoursePlay'
        ],
        PAGE_CLOSE_DELAY: 2000,
        PAGE_CLOSE_RETRY: 2,
        DEBUG_MODE: true,
        PANEL_STYLE: {
            position: 'fixed',
            top: '10px',
            left: '10px',
            backgroundColor: 'rgba(0,0,0,0.8)',
            color: '#fff',
            padding: '12px',
            borderRadius: '8px',
            fontSize: '14px',
            zIndex: '99999',
            minWidth: '320px',
            maxHeight: '80vh',
            overflowY: 'auto',
            boxShadow: '0 4px 12px rgba(0,0,0,0.3)'
        },
        DRAG_HANDLE_STYLE: {
            height: '24px',
            cursor: 'move',
            margin: '-12px -12px 12px -12px',
            padding: '4px 12px',
            backgroundColor: 'rgba(50,50,100,0.5)',
            borderRadius: '8px 8px 0 0',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            userSelect: 'none'
        },
        COURSE_ITEM_STYLE: {
            padding: '8px',
            margin: '6px 0',
            backgroundColor: 'rgba(255,255,255,0.1)',
            borderRadius: '4px',
            cursor: 'pointer',
            transition: 'background-color 0.3s',
            display: 'flex',
            alignItems: 'center'
        },
        COURSE_ITEM_HOVER_STYLE: {
            backgroundColor: 'rgba(255,255,255,0.2)'
        },
        COURSE_ITEM_PLAYING_STYLE: {
            backgroundColor: 'rgba(66, 133, 244, 0.3)',
            border: '1px solid #4285f4',
            boxShadow: '0 0 8px rgba(66, 133, 244, 0.5)'
        },
        BUTTON_STYLE: {
            padding: '6px 10px',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            transition: 'all 0.2s',
            fontSize: '13px',
            fontWeight: '500',
            boxShadow: '0 1px 3px rgba(0,0,0,0.2)'
        },
        BUTTON_HOVER_STYLE: {
            transform: 'translateY(-1px)',
            boxShadow: '0 2px 5px rgba(0,0,0,0.3)'
        },
        BUTTON_COLORS: {
            speed: { background: '#4285f4', color: '#fff' },
            mute: { background: '#fbbc05', color: '#000' }
        },
        LIST_TOGGLE_STYLE: {
            padding: '3px 8px',
            border: '1px solid rgba(255,255,255,0.3)',
            borderRadius: '4px',
            backgroundColor: 'rgba(255,255,255,0.1)',
            color: '#fff',
            cursor: 'pointer',
            fontSize: '14px',
            transition: 'all 0.2s'
        },
        CHECK_INTERVAL: 1500,
        INIT_DELAY: 2000,
        DEFAULT_SPEED: 1.0,
        BPLAYER_SPEED: 2.0,
        DETECT_INTERVAL_MS: 1000,
        STARTUP_PROGRESS_CHECK_TIME: 30000,
        LEARNED_COUNTDOWN_SECONDS: 10,
        AUTO_PLAY_RETRY_INTERVAL_MS: 1000,
        PROGRESS_CHANGE_THRESHOLD: 0.1,
        MAX_NO_PROGRESS_COUNT: 30,
        PROGRESS_STALL_RETRY_SECONDS: 10,
        AUTO_MUTE_ON_PLAY: true,
        VOLUME_CONTROL_SELECTORS: [
            '#speaker', '.ccH5vm', '.volume-btn', '.bplayer-volume-btn'
        ],
        VOLUME_SLIDER_SEL: '.volume-slider, .bplayer-volume-slider, .ccH5VolumeSlider',

        // 新增：首次加载优化配置
        FIRST_LOAD_DELAY: 3000,          // 首次加载额外延迟(ms)
        RESOURCE_CHECK_RETRY: 5,         // 资源检查重试次数
        RESOURCE_CHECK_INTERVAL: 1000,   // 资源检查间隔(ms)
        FIRST_JUMP_DELAY: 1500,          // 首次跳转额外延迟(ms)
        MIN_LOADING_TIME: 2000,          // 最小加载时间(ms)
        INITIAL_OPERATION_DELAY: 1000    // 初始操作延迟(ms)
    };

    // 全局变量：新增首次加载状态标记
    let hasClickedPostCourse = false;
    let iframeDoc = null;
    let pendingCourses = [];
    let mainPanel = null;
    let checkIframeTimer = null;
    let updateCourseTimer = null;
    let playbackSpeed = CONFIG.DEFAULT_SPEED;
    let hasPlayedNext = false;
    let speedChecked = false;
    let detectorTimerId = null;
    let startupProgressTimerId = null;
    let countdownTimerId = null;
    let learnedCountdownTimerId = null;
    let countdownTimeRemaining = CONFIG.MAX_NO_PROGRESS_COUNT;
    let learnedCountdownTimeRemaining = CONFIG.LEARNED_COUNTDOWN_SECONDS;
    let isLearnedCountdownActive = false;
    let autoPlayIntervalId = null;
    let initialProgress = 0;
    let currentCourseId = null;
    let lastProgress = 0;
    let noProgressCount = 0;
    let isJumping = false;
    let hasAutoJumped = false;
    let isGlobalMuted = false;
    let muteAttempts = 0;
    const MAX_MUTE_ATTEMPTS = 5;
    let jumpAttempts = 0;
    const MAX_JUMP_ATTEMPTS = 3;
    let isDragging = false;
    let offsetX = 0;
    let offsetY = 0;
    let isCourseListExpanded = true;
    let userMuteToggle = false;
    // 新增：首次加载状态跟踪
    let isFirstLoad = true;            // 是否首次加载
    let pageLoadStartTime = 0;         // 页面加载开始时间
    let resourceCheckAttempts = 0;     // 资源检查尝试次数

    // 调试日志
    const log = (message) => {
        if (CONFIG.DEBUG_MODE) console.log(`[华医脚本] ${message}`);
    };

    // 面板拖拽功能
    const makePanelDraggable = () => {
        const dragHandle = document.createElement('div');
        dragHandle.id = 'huayiDragHandle';
        dragHandle.textContent = '拖动面板';
        Object.keys(CONFIG.DRAG_HANDLE_STYLE).forEach(key => {
            dragHandle.style[key] = CONFIG.DRAG_HANDLE_STYLE[key];
        });

        mainPanel.insertBefore(dragHandle, mainPanel.firstChild);

        dragHandle.addEventListener('mousedown', (e) => {
            isDragging = true;
            const rect = mainPanel.getBoundingClientRect();
            offsetX = e.clientX - rect.left;
            offsetY = e.clientY - rect.top;
            mainPanel.style.transition = 'none';
        });

        document.addEventListener('mousemove', (e) => {
            if (!isDragging || !mainPanel) return;

            const x = e.clientX - offsetX;
            const y = e.clientY - offsetY;
            const maxX = window.innerWidth - mainPanel.offsetWidth;
            const maxY = window.innerHeight - mainPanel.offsetHeight;
            const boundedX = Math.max(0, Math.min(x, maxX));
            const boundedY = Math.max(0, Math.min(y, maxY));

            mainPanel.style.left = `${boundedX}px`;
            mainPanel.style.top = `${boundedY}px`;
        });

        document.addEventListener('mouseup', () => {
            if (isDragging && mainPanel) {
                isDragging = false;
                mainPanel.style.transition = '';
            }
        });
    };

    // 切换课程列表展开/收起状态
    const toggleCourseList = () => {
        isCourseListExpanded = !isCourseListExpanded;
        const courseListContainer = document.getElementById('huayiCourseListContainer');
        const toggleBtn = document.getElementById('huayiListToggleBtn');

        courseListContainer.style.display = isCourseListExpanded ? 'block' : 'none';
        toggleBtn.textContent = isCourseListExpanded ? '收起列表' : '展开列表';
        localStorage.setItem('huayiCourseListExpanded', isCourseListExpanded);
    };

    // 设置音量为0
    const setVolumeToZero = () => {
        if (userMuteToggle) return;

        document.querySelectorAll('video').forEach(video => {
            try { video.volume = 0; }
            catch (e) { log(`设置video音量失败: ${e.message}`); }
        });

        document.querySelectorAll(CONFIG.VOLUME_SLIDER_SEL).forEach(slider => {
            try {
                if (slider.tagName === 'INPUT' && ['range', 'slider'].includes(slider.type)) {
                    slider.value = 0;
                    slider.dispatchEvent(new Event('change', { bubbles: true }));
                    slider.dispatchEvent(new Event('input', { bubbles: true }));
                } else if (slider.style.width !== undefined) {
                    slider.style.width = '0%';
                }
            } catch (e) {
                log(`操作音量滑块失败: ${e.message}`);
            }
        });
    };

    // 点击音量按钮尝试静音
    const clickVolumeButtons = () => {
        if (userMuteToggle) return;

        let success = false;
        CONFIG.VOLUME_CONTROL_SELECTORS.forEach(selector => {
            document.querySelectorAll(selector).forEach(button => {
                try {
                    const isMuted = button.getAttribute('data-muted') === 'true' ||
                                   button.classList.contains('muted') ||
                                   button.classList.contains('ccH5vm-mute');

                    if (!isMuted) {
                        const rect = button.getBoundingClientRect();
                        button.dispatchEvent(new MouseEvent('click', {
                            clientX: rect.left + rect.width / 2,
                            clientY: rect.top + rect.height / 2,
                            bubbles: true,
                            cancelable: true
                        }));
                        button.setAttribute('data-muted', 'true');
                        success = true;
                    } else {
                        success = true;
                    }
                } catch (e) {
                    log(`点击音量按钮(${selector})失败: ${e.message}`);
                }
            });
        });
        return success;
    };

    // 确保静音状态
    const ensureMuted = () => {
        if (userMuteToggle || !CONFIG.AUTO_MUTE_ON_PLAY) return;
        if (muteAttempts >= MAX_MUTE_ATTEMPTS) {
            log(`已尝试${MAX_MUTE_ATTEMPTS}次静音，暂停尝试`);
            return;
        }

        log(`第${muteAttempts + 1}次尝试静音...`);
        const buttonSuccess = clickVolumeButtons();
        setVolumeToZero();

        try {
            if (document.muted !== undefined) document.muted = true;
            document.querySelectorAll('video').forEach(video => video.muted = true);
            isGlobalMuted = true;
            updateMuteStatus();
        } catch (e) {
            log(`使用muted属性静音失败: ${e.message}`);
        }

        muteAttempts++;
        if (!buttonSuccess && muteAttempts < MAX_MUTE_ATTEMPTS) {
            setTimeout(ensureMuted, 2000);
        }
    };

    // 切换全局静音状态
    const toggleGlobalMute = () => {
        userMuteToggle = true;

        if (isGlobalMuted) {
            try {
                if (document.muted !== undefined) document.muted = false;
                document.querySelectorAll('video').forEach(video => {
                    video.muted = false;
                    if (video.volume === 0) video.volume = 1;
                });

                CONFIG.VOLUME_CONTROL_SELECTORS.forEach(selector => {
                    document.querySelectorAll(selector).forEach(button => {
                        button.setAttribute('data-muted', 'false');
                        button.dispatchEvent(new MouseEvent('click', { bubbles: true }));
                    });
                });
                isGlobalMuted = false;
            } catch (e) {
                log(`取消静音失败: ${e.message}`);
            }
        } else {
            try {
                if (document.muted !== undefined) document.muted = true;
                document.querySelectorAll('video').forEach(video => video.muted = true);

                CONFIG.VOLUME_CONTROL_SELECTORS.forEach(selector => {
                    document.querySelectorAll(selector).forEach(button => {
                        button.setAttribute('data-muted', 'true');
                        button.dispatchEvent(new MouseEvent('click', { bubbles: true }));
                    });
                });
                isGlobalMuted = true;
            } catch (e) {
                log(`设置静音失败: ${e.message}`);
            }
        }
        updateMuteStatus();
    };

    // 更新静音状态显示
    const updateMuteStatus = () => {
        const muteLabel = document.getElementById('videoMuteLabel');
        if (muteLabel) {
            muteLabel.textContent = `全局声音：${isGlobalMuted ? '🔇 已静音' : '🔊 未静音'}`;
        }
    };

    // 标记课程为异常
    const markCourseAsAbnormal = (courseId) => {
        if (!courseId) return;
        const courseIndex = pendingCourses.findIndex(c => c.id === courseId);
        if (courseIndex === -1) return;

        // 只有未学习的课程才会被标记为异常
        if (!pendingCourses[courseIndex].isLearned) {
            pendingCourses[courseIndex].isAbnormal = true;
            syncToLocalStorage();
            updatePendingListUI();
            updateNextVideo();
            log(`已标记课程 ${courseId} 为异常`);
        }
    };

    // 检查页面关键资源是否加载完成
    const checkPageResources = () => {
        // 检查基本DOM元素是否存在
        if (isFirstLoad && window.location.href.includes('courseware_id')) {
            // 播放页需要检查的资源
            const videoContainer = document.querySelector('video') ||
                                 document.querySelector('.bplayer-video') ||
                                 document.querySelector('.ccH5Video');

            const progressBar = document.querySelector('.bplayer-progress') ||
                              document.querySelector('.ccH5Progress');

            // 资源未加载完成
            if (!videoContainer || !progressBar) {
                resourceCheckAttempts++;
                if (resourceCheckAttempts < CONFIG.RESOURCE_CHECK_RETRY) {
                    log(`第${resourceCheckAttempts}次检查播放页资源，尚未准备就绪`);
                    return false;
                } else {
                    log(`达到最大资源检查次数(${CONFIG.RESOURCE_CHECK_RETRY})，尝试继续`);
                }
            }
        } else if (isFirstLoad) {
            // 列表页需要检查的资源
            const courseList = document.querySelector(CONFIG.COURSE_LIST_SEL) ||
                             document.querySelector(CONFIG.IFRAME_SEL);

            if (!courseList) {
                resourceCheckAttempts++;
                if (resourceCheckAttempts < CONFIG.RESOURCE_CHECK_RETRY) {
                    log(`第${resourceCheckAttempts}次检查列表页资源，尚未准备就绪`);
                    return false;
                } else {
                    log(`达到最大资源检查次数(${CONFIG.RESOURCE_CHECK_RETRY})，尝试继续`);
                }
            }
        }

        // 检查页面加载时间是否足够
        const elapsedTime = Date.now() - pageLoadStartTime;
        if (elapsedTime < CONFIG.MIN_LOADING_TIME) {
            log(`页面加载时间不足(${elapsedTime}ms)，等待至${CONFIG.MIN_LOADING_TIME}ms`);
            return false;
        }

        return true;
    };

    // 等待页面资源加载完成
    const waitForResources = (callback) => {
        if (checkPageResources()) {
            log("页面资源检查通过，执行操作");
            callback();
        } else if (resourceCheckAttempts < CONFIG.RESOURCE_CHECK_RETRY) {
            setTimeout(() => waitForResources(callback), CONFIG.RESOURCE_CHECK_INTERVAL);
        } else {
            log("资源检查超时，仍尝试执行操作");
            callback();
        }
    };

    // 清理所有资源
    const clearAllResources = () => {
        log("开始清理当前页资源...");
        [checkIframeTimer, updateCourseTimer, detectorTimerId,
         startupProgressTimerId, countdownTimerId, learnedCountdownTimerId,
         autoPlayIntervalId].forEach(timer => {
            if (timer) clearInterval(timer);
        });

        const videoElem = document.querySelector('video');
        if (videoElem) {
            videoElem.removeEventListener('ended', handleVideoEnded);
            videoElem.pause();
        }

        isLearnedCountdownActive = false;
        isJumping = false;
        jumpAttempts = 0;
        log("当前页资源清理完成");
    };

    // 关闭当前页面
    const closeCurrentPage = (retryCount = 0) => {
        if (!window.location.href.includes('courseware_id')) return;

        clearAllResources();
        setTimeout(() => {
            try {
                if (window.close()) {
                    log(`第${retryCount + 1}次关闭成功`);
                    return;
                }

                log(`第${retryCount + 1}次直接关闭失败，尝试刷新后关闭`);
                window.location.reload();
                setTimeout(() => {
                    if (window.close()) log("刷新后关闭成功");
                    else throw new Error("刷新后关闭仍失败");
                }, 1000);

            } catch (e) {
                log(`关闭失败: ${e.message}`);
                if (retryCount < CONFIG.PAGE_CLOSE_RETRY) {
                    setTimeout(() => closeCurrentPage(retryCount + 1), CONFIG.PAGE_CLOSE_DELAY);
                } else {
                    alert(`自动关闭失败（已重试${CONFIG.PAGE_CLOSE_RETRY + 1}次），请手动关闭`);
                }
            }
        }, CONFIG.PAGE_CLOSE_DELAY);
    };

    // 创建控制面板
    const createMainPanel = () => {
        if (document.getElementById('huayiMainPanel')) return;

        const storedExpanded = localStorage.getItem('huayiCourseListExpanded');
        if (storedExpanded !== null) isCourseListExpanded = storedExpanded === 'true';

        mainPanel = document.createElement('div');
        mainPanel.id = 'huayiMainPanel';
        Object.keys(CONFIG.PANEL_STYLE).forEach(key => {
            mainPanel.style[key] = CONFIG.PANEL_STYLE[key];
        });

        makePanelDraggable();

        // 状态显示区域
        const statusSection = document.createElement('div');
        statusSection.id = 'huayiStatusSection';
        statusSection.style.marginBottom = '12px';
        statusSection.style.paddingBottom = '10px';
        statusSection.style.borderBottom = '1px solid rgba(255,255,255,0.3)';

        const statusTitle = document.createElement('h4');
        statusTitle.textContent = '播放状态监控';
        statusTitle.style.margin = '0 0 8px 0';
        statusSection.appendChild(statusTitle);

        // 状态标签集合
        ['videoStatusLabel', 'videoMuteLabel', 'learnedCountdownLabel',
         'countdownLabel', 'videoProgressLabel', 'videoSpeedLabel',
         'nextVideoLabel', 'currentCourseLabel'].forEach(id => {
            const label = document.createElement('p');
            label.id = id;
            if (id === 'learnedCountdownLabel') {
                label.style.display = 'none';
                label.style.color = '#4CAF50';
            } else if (id === 'currentCourseLabel') {
                label.style.fontSize = '12px';
                label.style.color = 'rgba(255,255,255,0.7)';
            }
            statusSection.appendChild(label);
        });

        // 控制按钮区域
        const btnRow = document.createElement('div');
        btnRow.style.display = 'flex';
        btnRow.style.gap = '6px';
        btnRow.style.marginTop = '8px';
        btnRow.style.flexWrap = 'wrap';

        const speedBtn = createStyledButton('设置倍速', 'speed');
        const muteBtn = createStyledButton('切换静音', 'mute');
        btnRow.appendChild(speedBtn);
        btnRow.appendChild(muteBtn);

        statusSection.appendChild(btnRow);
        mainPanel.appendChild(statusSection);

        // 课程列表区域
        const pendingSection = document.createElement('div');
        pendingSection.id = 'huayiPendingSection';

        const pendingHeader = document.createElement('div');
        pendingHeader.style.display = 'flex';
        pendingHeader.style.alignItems = 'center';

        const pendingTitle = document.createElement('h4');
        pendingTitle.textContent = '待播放课程列表';
        pendingTitle.style.margin = '0 0 8px 0';
        pendingTitle.style.flex = '1';

        const toggleBtn = document.createElement('button');
        toggleBtn.id = 'huayiListToggleBtn';
        toggleBtn.textContent = isCourseListExpanded ? '收起列表' : '展开列表';
        Object.keys(CONFIG.LIST_TOGGLE_STYLE).forEach(key => {
            toggleBtn.style[key] = CONFIG.LIST_TOGGLE_STYLE[key];
        });
        toggleBtn.addEventListener('click', toggleCourseList);

        pendingHeader.appendChild(pendingTitle);
        pendingHeader.appendChild(toggleBtn);
        pendingSection.appendChild(pendingHeader);

        const courseListContainer = document.createElement('div');
        courseListContainer.id = 'huayiCourseListContainer';
        courseListContainer.style.display = isCourseListExpanded ? 'block' : 'none';
        pendingSection.appendChild(courseListContainer);

        const emptyTip = document.createElement('p');
        emptyTip.id = 'huayiEmptyTip';
        emptyTip.textContent = '等待加载课程数据...';
        courseListContainer.appendChild(emptyTip);

        mainPanel.appendChild(pendingSection);
        document.body.appendChild(mainPanel);

        // 绑定按钮事件
        speedBtn.onclick = () => {
            const newSpeed = prompt('请输入播放速度 (0.5-5.0):', playbackSpeed);
            if (newSpeed !== null) {
                const speedVal = parseFloat(newSpeed);
                if (!isNaN(speedVal) && speedVal >= 0.5 && speedVal <= 5.0) {
                    playbackSpeed = speedVal;
                    setVideoSpeed(playbackSpeed);
                    updateSpeed(playbackSpeed);
                    speedChecked = true;
                    clearDetectorTimer();
                } else {
                    alert('请输入有效数值 (0.5-5.0)');
                }
            }
        };

        muteBtn.onclick = toggleGlobalMute;

        // 初始化UI显示
        updateStatus(getCurrentPlayStatus());
        updateMuteStatus();
        updateLearnedCountdown(0);
        updateCountdown(countdownTimeRemaining);
        updateProgress(0, '00:00', '00:00');
        updateSpeed(playbackSpeed);
        updateNextVideo();
        updateCurrentCourseId();
    };

    // 创建带样式的按钮
    const createStyledButton = (text, type) => {
        const btn = document.createElement('button');
        btn.textContent = text;

        Object.keys(CONFIG.BUTTON_STYLE).forEach(key => {
            btn.style[key] = CONFIG.BUTTON_STYLE[key];
        });

        const colors = CONFIG.BUTTON_COLORS[type];
        if (colors) {
            btn.style.backgroundColor = colors.background;
            btn.style.color = colors.color;
        }

        btn.addEventListener('mouseover', () => {
            Object.keys(CONFIG.BUTTON_HOVER_STYLE).forEach(key => {
                btn.style[key] = CONFIG.BUTTON_HOVER_STYLE[key];
            });
        });

        btn.addEventListener('mouseout', () => {
            Object.keys(CONFIG.BUTTON_HOVER_STYLE).forEach(key => {
                btn.style[key] = '';
            });
        });

        return btn;
    };

    // 更新当前课程ID显示
    const updateCurrentCourseId = () => {
        const label = document.getElementById('currentCourseLabel');
        if (label) label.textContent = `当前课程ID: ${currentCourseId || '未设置'}`;
        updatePendingListUI();
    };

    // 点击岗位课程
    const clickPostCourse = () => {
        if (hasClickedPostCourse) return;

        // 首次加载增加延迟
        const delay = isFirstLoad ? CONFIG.FIRST_LOAD_DELAY : 0;

        setTimeout(() => {
            const postCourseElem = document.querySelector(CONFIG.POST_COURSE_SEL);
            if (!postCourseElem) {
                setTimeout(clickPostCourse, CONFIG.CHECK_INTERVAL);
                return;
            }

            try {
                postCourseElem.click();
                hasClickedPostCourse = true;
                startCheckIframe();
                // 首次操作后标记为非首次
                isFirstLoad = false;
            } catch (e) {
                log(`点击岗位课程出错: ${e.message}`);
            }
        }, delay);
    };

    // 开始检查iframe
    const startCheckIframe = () => {
        if (checkIframeTimer) clearInterval(checkIframeTimer);
        checkIframeTimer = setInterval(() => {
            iframeDoc = getIframeDocument();
            if (iframeDoc) {
                clearInterval(checkIframeTimer);
                startUpdateCourseList();
            }
        }, CONFIG.CHECK_INTERVAL);
    };

    // 获取iframe文档
    const getIframeDocument = () => {
        const iframeElem = document.querySelector(CONFIG.IFRAME_SEL);
        if (!iframeElem) return null;

        try {
            const doc = iframeElem.contentDocument || iframeElem.contentWindow.document;
            return doc && doc.querySelector(CONFIG.COURSE_LIST_SEL) ? doc : null;
        } catch (e) {
            log(`访问iframe出错: ${e.message}`);
            return null;
        }
    };

    // 解析课程项
    const parseCourseItem = (itemElem) => {
        const courseData = {
            id: '',
            name: '',
            status: '',
            onClickParams: [],
            isLearned: false,
            isAbnormal: false,
            fullUrls: [],
            originalIndex: -1,
            actualPlayPath: ''
        };

        const titleElem = itemElem.querySelector('.itemTitle');
        if (titleElem) courseData.name = titleElem.textContent.trim().replace(/^\s+|\s+$/g, '');

        const statusElem = itemElem.querySelector('.type p');
        if (statusElem) courseData.status = statusElem.textContent.trim();

        const linkElem = itemElem.querySelector('.itemText');
        if (linkElem && linkElem.hasAttribute('onclick')) {
            const onclickStr = linkElem.getAttribute('onclick');
            const paramReg = /OpenVideoPlay\(\s*'([^']*)'\s*,\s*'([^']*)'\s*,\s*(\d+)\s*,\s*(\d+)\s*\)/;
            const matchRes = onclickStr.match(paramReg);

            if (matchRes && matchRes.length >= 5) {
                courseData.id = matchRes[1];
                courseData.onClickParams = [
                    matchRes[1], matchRes[2], parseInt(matchRes[3]), parseInt(matchRes[4])
                ];

                CONFIG.COURSE_PLAY_PATHS.forEach(path => {
                    courseData.fullUrls.push(`https://jcpxkh.91huayi.com/${path}?courseware_id=${matchRes[1]}`);
                });

                courseData.actualPlayPath = onclickStr.includes('BJYCoursePlay')
                    ? CONFIG.COURSE_PLAY_PATHS[1]
                    : CONFIG.COURSE_PLAY_PATHS[0];
            }
        }

        return courseData;
    };

    // 筛选待播放课程
    const filterPendingCourses = (allCourses) => {
        const validStatus = ['观看中', '未观看'];
        return allCourses.filter(course =>
            validStatus.includes(course.status) &&
            course.id && course.name && course.fullUrls.length > 0
        );
    };

    // 更新课程列表
    const updateCourseList = () => {
        if (!iframeDoc) return;
        const courseElems = iframeDoc.querySelectorAll(CONFIG.COURSE_ITEM_SEL);

        if (courseElems.length === 0) {
            pendingCourses = [];
            syncToLocalStorage();
            updatePendingListUI();
            return;
        }

        let allCourses = Array.from(courseElems).map((elem, index) => {
            const course = parseCourseItem(elem);
            course.originalIndex = index;
            return course;
        });

        const storedCourses = getFromLocalStorage();
        if (storedCourses.length > 0) {
            allCourses = allCourses.map(course => {
                const stored = storedCourses.find(s => s.id === course.id);
                return stored ? {
                    ...course,
                    isLearned: stored.isLearned,
                    isAbnormal: stored.isAbnormal || false
                } : course;
            });
        }

        pendingCourses = filterPendingCourses(allCourses)
            .sort((a, b) => a.originalIndex - b.originalIndex);

        syncToLocalStorage();
        updatePendingListUI();
        updateNextVideo();
        log(`更新课程列表，共${pendingCourses.length}个待播放课程`);

        const isHomeEnv = window.location.href.includes('ExerciseHome/index');
        if (isHomeEnv && !hasAutoJumped && pendingCourses.length > 0) {
            // 首次跳转前等待资源加载
            waitForResources(() => {
                autoJumpToFirstValidCourse();
            });
        }
    };

    // 智能跳转课程：优化首次跳转逻辑
    const smartJumpToCourse = (course, retry = false) => {
        if (isJumping && !retry) return;
        isJumping = true;

        // 计算延迟：首次跳转或重试时增加延迟
        const delay = (isFirstLoad || retry) ? CONFIG.FIRST_JUMP_DELAY : 0;

        // 等待延迟后执行跳转
        setTimeout(() => {
            if (retry) {
                jumpAttempts++;
                if (jumpAttempts > MAX_JUMP_ATTEMPTS) {
                    log(`已尝试${MAX_JUMP_ATTEMPTS}次跳转，标记课程为异常`);
                    markCourseAsAbnormal(course.id);
                    isJumping = false;
                    return;
                }
                log(`第${jumpAttempts}次重试跳转至课程: ${course.name}`);
            } else {
                log(`开始跳转至课程: ${course.name}`);
            }

            try {
                currentCourseId = course.id;
                syncToLocalStorage();
                updateCurrentCourseId();

                const isHomeEnv = window.location.href.includes('ExerciseHome/index');
                const isPlayEnv = window.location.href.includes('courseware_id');

                // 列表页跳转：使用原生函数打开新页面
                if (isHomeEnv && iframeDoc && iframeDoc.defaultView &&
                    typeof iframeDoc.defaultView.OpenVideoPlay === 'function' &&
                    course.onClickParams.length >= 4) {

                    clearAllResources();
                    iframeDoc.defaultView.OpenVideoPlay(...course.onClickParams);
                    setTimeout(() => {
                        closeCurrentPage();
                        isJumping = false;
                        // 首次跳转后标记为非首次
                        isFirstLoad = false;
                    }, CONFIG.PAGE_CLOSE_DELAY / 2);
                    return;
                }

                // 播放页跳转：打开新窗口后关闭原页面
                const baseUrl = `https://jcpxkh.91huayi.com/${course.actualPlayPath}?courseware_id=${course.id}`;
                clearAllResources();

                let newWindow = null;
                if (isPlayEnv) {
                    newWindow = window.open(baseUrl, '_blank');
                    if (!newWindow) throw new Error("浏览器阻止了弹窗，请允许弹出窗口后重试");

                    setTimeout(() => {
                        if (newWindow && !newWindow.closed) {
                            log("新播放窗口已打开，准备关闭原页面");
                            closeCurrentPage();
                        } else {
                            throw new Error("新窗口未成功打开");
                        }
                        isJumping = false;
                        // 首次跳转后标记为非首次
                        isFirstLoad = false;
                    }, CONFIG.PAGE_CLOSE_DELAY);
                } else {
                    window.location.href = baseUrl;
                    isJumping = false;
                    // 首次跳转后标记为非首次
                    isFirstLoad = false;
                }

            } catch (e) {
                log(`跳转处理出错: ${e.message}`);
                setTimeout(() => {
                    smartJumpToCourse(course, true);
                    isJumping = false;
                }, 2000);
            }
        }, delay);
    };

    // 自动跳转至第一个有效课程
    const autoJumpToFirstValidCourse = () => {
        const validCourse = pendingCourses.find(c => !c.isLearned);
        if (!validCourse) {
            log('待播放列表中无有效课程');
            const emptyTip = document.getElementById('huayiEmptyTip');
            if (emptyTip) emptyTip.textContent = '待播放列表中无有效课程（全为已学习）';
            return;
        }

        log(`自动跳转至第一个有效课程: ${validCourse.name}`);
        hasAutoJumped = true;

        const courseItemElem = document.querySelector(`.huayiPendingCourseItem[data-course-id="${validCourse.id}"]`);
        if (courseItemElem) courseItemElem.click();
        else smartJumpToCourse(validCourse);
    };

    // 更新待播放列表UI
    const updatePendingListUI = () => {
        const listContainer = document.getElementById('huayiCourseListContainer');
        const emptyTip = document.getElementById('huayiEmptyTip');

        while (listContainer.children.length > 1) {
            listContainer.removeChild(listContainer.lastChild);
        }

        if (pendingCourses.length === 0) {
            emptyTip.textContent = '暂无待播放课程';
            return;
        }

        emptyTip.style.display = 'none';

        pendingCourses.forEach((course, index) => {
            const courseItem = document.createElement('div');
            courseItem.className = 'huayiPendingCourseItem';
            courseItem.dataset.courseId = course.id;
            courseItem.dataset.actualPath = course.actualPlayPath;

            Object.keys(CONFIG.COURSE_ITEM_STYLE).forEach(key => {
                courseItem.style[key] = CONFIG.COURSE_ITEM_STYLE[key];
            });

            const isCurrentPlaying = course.id === currentCourseId;
            if (isCurrentPlaying) {
                Object.keys(CONFIG.COURSE_ITEM_PLAYING_STYLE).forEach(key => {
                    courseItem.style[key] = CONFIG.COURSE_ITEM_PLAYING_STYLE[key];
                });
            }

            let statusLabel = '';
            if (course.isAbnormal) {
                statusLabel = `<span style="padding:2px 6px;border-radius:4px;font-size:12px;background:#f44336;color:#fff;">异常</span>`;
            } else if (course.isLearned) {
                statusLabel = `<span style="padding:2px 6px;border-radius:4px;font-size:12px;background:#9e9e9e;">已学习</span>`;
            } else {
                statusLabel = `<span style="padding:2px 6px;border-radius:4px;font-size:12px;${
                    course.status === '观看中' ? 'background:#ff9800' : 'background:#2196f3'
                }">${course.status}</span>`;
            }

            const pathLabel = course.actualPlayPath.includes('BJY') ? 'BJY路径' : '普通路径';
            const playIcon = isCurrentPlaying ? '▶️ ' : '';

            courseItem.innerHTML = `
                <span style="display:inline-block;width:20px;text-align:center;">${playIcon}${index + 1}.</span>
                <span style="margin:0 8px;flex:1;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;${
                    course.isLearned ? 'text-decoration:line-through;color:#aaa;' : ''
                }">${course.name}</span>
                <span style="font-size:11px;color:#ccc;">${pathLabel}</span>
                ${statusLabel}
            `;

            courseItem.addEventListener('click', () => {
                // 点击课程时先检查资源
                waitForResources(() => {
                    smartJumpToCourse(course);
                });
            });

            courseItem.addEventListener('mouseover', () => {
                if (isCurrentPlaying) courseItem.style.backgroundColor = 'rgba(66, 133, 244, 0.4)';
                else Object.keys(CONFIG.COURSE_ITEM_HOVER_STYLE).forEach(key => {
                    courseItem.style[key] = CONFIG.COURSE_ITEM_HOVER_STYLE[key];
                });
            });

            courseItem.addEventListener('mouseout', () => {
                if (isCurrentPlaying) {
                    courseItem.style.backgroundColor = CONFIG.COURSE_ITEM_PLAYING_STYLE.backgroundColor;
                } else {
                    Object.keys(CONFIG.COURSE_ITEM_STYLE).forEach(key => {
                        courseItem.style[key] = CONFIG.COURSE_ITEM_STYLE[key];
                    });
                }
            });

            listContainer.appendChild(courseItem);
        });
    };

    // 启动课程列表更新
    const startUpdateCourseList = () => {
        if (updateCourseTimer) clearInterval(updateCourseTimer);
        updateCourseList();
        updateCourseTimer = setInterval(updateCourseList, CONFIG.CHECK_INTERVAL * 2);
    };

    // 获取当前播放状态
    const getCurrentPlayStatus = () => {
        const bplayerWrap = document.querySelector('.bplayer-wrap');
        if (bplayerWrap) return bplayerWrap.classList.contains('bplayer-playing');

        const videoElem = document.querySelector('video');
        return videoElem ? !videoElem.paused : false;
    };

    // 获取bplayer播放按钮
    const getBplayerPlayBtn = () => document.querySelector('.bplayer-play-btn');

    // 确保播放状态
    const ensurePlaying = () => {
        const isPlaying = getCurrentPlayStatus();
        if (!isPlaying) {
            const bplayerBtn = getBplayerPlayBtn();
            const videoElem = document.querySelector('video');

            if (bplayerBtn) bplayerBtn.click();
            if (videoElem) videoElem.play().catch(err => log(`video播放出错: ${err.message}`));
        }
        return getCurrentPlayStatus();
    };

    // 启动自动播放监控
    const startAutoPlayMonitor = () => {
        if (autoPlayIntervalId) return;
        autoPlayIntervalId = setInterval(() => {
            const isPlaying = getCurrentPlayStatus();
            updateStatus(isPlaying);
            if (!isPlaying) ensurePlaying();
        }, CONFIG.AUTO_PLAY_RETRY_INTERVAL_MS);
    };

    // 停止自动播放监控
    const stopAutoPlayMonitor = () => {
        if (autoPlayIntervalId) {
            clearInterval(autoPlayIntervalId);
            autoPlayIntervalId = null;
        }
    };

    // 更新播放状态显示
    const updateStatus = (isPlaying) => {
        const label = document.getElementById('videoStatusLabel');
        if (label) label.textContent = `状态: ${isPlaying ? '正在播放' : '暂停'}`;
    };

    // 更新无进度倒计时显示
    const updateCountdown = (time) => {
        const label = document.getElementById('countdownLabel');
        if (label) {
            label.style.display = isLearnedCountdownActive ? 'none' : 'block';
            if (!isLearnedCountdownActive) label.textContent = `无进度变化: ${time} 秒后切换`;
        }
    };

    // 更新已学习倒计时显示
    const updateLearnedCountdown = (time) => {
        const label = document.getElementById('learnedCountdownLabel');
        if (label) {
            label.style.display = isLearnedCountdownActive ? 'block' : 'none';
            if (isLearnedCountdownActive) label.textContent = `已学完，${time} 秒后切换下一个`;
        }
    };

    // 更新进度显示
    const updateProgress = (progress, currentTime, totalTime) => {
        const label = document.getElementById('videoProgressLabel');
        if (label) {
            label.textContent = `当前进度: ${progress.toFixed(2)}% (${currentTime} / ${totalTime})`;
        }
    };

    // 更新倍速显示
    const updateSpeed = (speed) => {
        const label = document.getElementById('videoSpeedLabel');
        if (label) label.textContent = `播放速度: ${speed.toFixed(1)}×`;
    };

    // 更新下一个视频显示
    const updateNextVideo = () => {
        const label = document.getElementById('nextVideoLabel');
        if (!label) return;

        let nextCourse = null;
        if (currentCourseId && pendingCourses.length > 0) {
            const currentIndex = pendingCourses.findIndex(c => c.id === currentCourseId);
            if (currentIndex !== -1) {
                for (let i = currentIndex + 1; i < pendingCourses.length; i++) {
                    if (!pendingCourses[i].isLearned) {
                        nextCourse = pendingCourses[i];
                        break;
                    }
                }
            }
        }

        if (!nextCourse) nextCourse = pendingCourses.find(c => !c.isLearned);
        label.textContent = nextCourse ? `下一个视频: ${nextCourse.name}` : '下一个视频: 无未学习课程';
    };

    // 检测并设置播放速度
    const detectAndSetPlaybackSpeed = () => {
        if (speedChecked) return;
        const isBPlayer = !!document.querySelector('.bplayer-progress-bar.absolute');
        const isCcH5 = !!document.querySelector('.ccH5ProgressBar');

        if (isBPlayer && !isCcH5) {
            playbackSpeed = CONFIG.BPLAYER_SPEED;
        } else if (isCcH5) {
            playbackSpeed = CONFIG.DEFAULT_SPEED;
        } else return;

        setVideoSpeed(playbackSpeed);
        updateSpeed(playbackSpeed);
        speedChecked = true;
        clearDetectorTimer();
    };

    // 启动倍速检测定时器
    const startDetectorTimer = () => {
        clearDetectorTimer();
        if (speedChecked) return;
        detectorTimerId = setInterval(() => {
            try { detectAndSetPlaybackSpeed(); }
            catch (e) { log(`倍速检测出错: ${e.message}`); }
        }, CONFIG.DETECT_INTERVAL_MS);
    };

    // 清除倍速检测定时器
    const clearDetectorTimer = () => {
        if (detectorTimerId) {
            clearInterval(detectorTimerId);
            detectorTimerId = null;
        }
    };

    // 设置视频倍速
    const setVideoSpeed = (speed) => {
        const videoElem = document.querySelector('video') || document.querySelector('.bplayer-video video');
        if (videoElem) {
            try { videoElem.playbackRate = speed; }
            catch (e) { log(`倍速设置失败: ${e.message}`); }
        }
    };

    // 时间转秒数
    const timeToSeconds = (timeStr) => {
        if (!timeStr) return 0;
        const parts = timeStr.split(':').map(Number);
        return parts.length === 2
            ? parts[0] * 60 + parts[1]
            : parts[0] * 3600 + parts[1] * 60 + parts[2];
    };

    // 重置进度监控
    const resetProgressMonitoring = () => {
        initialProgress = getVideoProgress();
        lastProgress = initialProgress;
        noProgressCount = 0;
        countdownTimeRemaining = CONFIG.MAX_NO_PROGRESS_COUNT;
        updateCountdown(countdownTimeRemaining);
        clearCountdownTimer();
        startCountdownTimer();
    };

    // 启动进度检查定时器
    const startProgressCheckTimer = () => {
        resetProgressMonitoring();
        startupProgressTimerId = setTimeout(() => {
            const currentProgress = getVideoProgress();
            if (Math.abs(currentProgress - initialProgress) < CONFIG.PROGRESS_CHANGE_THRESHOLD) {
                log(`启动进度检查: 进度无变化，准备切换视频`);
                markCourseAsAbnormal(currentCourseId);
                playNextVideo(false);
            }
        }, CONFIG.STARTUP_PROGRESS_CHECK_TIME);
    };

    // 清除进度检查定时器
    const clearProgressCheckTimer = () => {
        if (startupProgressTimerId) {
            clearTimeout(startupProgressTimerId);
            startupProgressTimerId = null;
        }
    };

    // 启动无进度倒计时
    const startCountdownTimer = () => {
        clearCountdownTimer();
        countdownTimerId = setInterval(() => {
            if (!isLearnedCountdownActive && getCurrentPlayStatus()) {
                countdownTimeRemaining--;
                updateCountdown(countdownTimeRemaining);

                if (countdownTimeRemaining <= 0) {
                    log(`倒计时结束，准备切换视频`);
                    markCourseAsAbnormal(currentCourseId);
                    clearCountdownTimer();
                    playNextVideo(false);
                }
            }
        }, 1000);
    };

    // 清除无进度倒计时
    const clearCountdownTimer = () => {
        if (countdownTimerId) {
            clearInterval(countdownTimerId);
            countdownTimerId = null;
        }
    };

    // 启动已学习倒计时
    const startLearnedCountdown = () => {
        clearLearnedCountdownTimer();
        isLearnedCountdownActive = true;
        learnedCountdownTimeRemaining = CONFIG.LEARNED_COUNTDOWN_SECONDS;
        updateLearnedCountdown(learnedCountdownTimeRemaining);
        learnedCountdownTimerId = setInterval(() => {
            learnedCountdownTimeRemaining--;
            updateLearnedCountdown(learnedCountdownTimeRemaining);
            if (learnedCountdownTimeRemaining <= 0) {
                log(`已学完倒计时结束，准备切换视频`);
                clearLearnedCountdownTimer();
                playNextVideo(true);
            }
        }, 1000);
    };

    // 清除已学习倒计时
    const clearLearnedCountdownTimer = () => {
        if (learnedCountdownTimerId) {
            clearInterval(learnedCountdownTimerId);
            learnedCountdownTimerId = null;
        }
        isLearnedCountdownActive = false;
        updateLearnedCountdown(0);
    };

    // 自动播放视频
    const autoPlayVideo = () => {
        // 首次加载增加初始化延迟
        const delay = isFirstLoad ? CONFIG.INITIAL_OPERATION_DELAY : 0;

        setTimeout(() => {
            // 等待资源加载完成后再执行自动播放
            waitForResources(() => {
                const videoElem = document.querySelector('video');
                const bplayerBtn = getBplayerPlayBtn();
                const isPaused = !getCurrentPlayStatus();

                if (isPaused) {
                    if (bplayerBtn) bplayerBtn.click();
                    if (videoElem) videoElem.play().catch(err => log(`自动播放出错: ${err.message}`));
                }

                if (CONFIG.AUTO_MUTE_ON_PLAY && !isGlobalMuted && !userMuteToggle) {
                    muteAttempts = 0;
                    ensureMuted();
                }

                detectAndSetPlaybackSpeed();
                updateStatus(getCurrentPlayStatus());
                updateSpeed(playbackSpeed);
                updateNextVideo();
                startCountdownTimer();
                startProgressCheckTimer();
                startAutoPlayMonitor();

                // 首次播放后标记为非首次
                isFirstLoad = false;
            });
        }, delay);
    };

    // 播放下一个视频
    const playNextVideo = (shouldMarkAsLearned) => {
        clearAllResources();
        stopAutoPlayMonitor();
        clearCountdownTimer();
        clearProgressCheckTimer();

        // 无论是否异常，只要完成学习就标记为已学习
        if (shouldMarkAsLearned && currentCourseId) {
            markCurrentCourseAsLearned();
        }

        const unlearnedCourses = pendingCourses.filter(c => !c.isLearned);
        let nextCourse = null;

        if (unlearnedCourses.length > 0) {
            const currentIndex = unlearnedCourses.findIndex(c => c.id === currentCourseId);
            if (currentIndex !== -1 && currentIndex + 1 < unlearnedCourses.length) {
                nextCourse = unlearnedCourses[currentIndex + 1];
            } else {
                nextCourse = unlearnedCourses[0];
            }
        }

        if (!nextCourse) {
            log('没有可播放的未学习课程');
            isJumping = false;
            return;
        }

        log(`准备跳转至下一课，将关闭当前页面`);
        smartJumpToCourse(nextCourse);
    };

    // 处理视频结束事件
    const handleVideoEnded = () => {
        log(`视频播放结束`);
        // 视频自然结束时，强制标记为已学习，无论是否异常
        playNextVideo(true);
    };

    // 绑定视频结束事件
    const bindVideoEndedHandler = () => {
        const videoElem = document.querySelector('video');
        if (videoElem) {
            videoElem.removeEventListener('ended', handleVideoEnded);
            videoElem.addEventListener('ended', handleVideoEnded);
        }
    };

    // 绑定列表点击事件
    const bindListClickHandler = () => {
        const listGroup = document.querySelector('div.listGroup');
        if (listGroup) {
            listGroup.addEventListener('click', (e) => {
                if (e.target?.classList.contains('text')) {
                    speedChecked = false;
                    startDetectorTimer();
                    clearProgressCheckTimer();
                    clearLearnedCountdownTimer();
                    setTimeout(updateNextVideo, 500);
                }
            });
        }
    };

    // 监控视频进度
    const monitorVideoProgress = () => {
        if (isJumping) return;

        const isPlaying = getCurrentPlayStatus();
        if (!isPlaying) {
            log("状态面板显示暂停，自动恢复播放");
            ensurePlaying();
            updateStatus(getCurrentPlayStatus());
        }

        if (CONFIG.AUTO_MUTE_ON_PLAY && isPlaying && !isGlobalMuted && !userMuteToggle) {
            ensureMuted();
        }

        if (isLearnedCountdownActive) return;

        // 检查是否已学完（即使是异常课程也会检查）
        const currentProgress = getVideoProgress();
        const isLearned = currentProgress >= 99.9;

        if (isLearned) {
            if (!isLearnedCountdownActive) {
                log(`检测到课程已学完（进度: ${currentProgress.toFixed(2)}%），即使标记为异常也会标记为已学习`);
                clearCountdownTimer();
                startLearnedCountdown();
            }
            return;
        } else if (isLearnedCountdownActive) {
            clearLearnedCountdownTimer();
        }

        // 获取进度信息并更新UI
        let currentTimeElem, totalTimeElem;
        const durationContainer = document.querySelector('.text.duration');
        if (durationContainer) {
            currentTimeElem = durationContainer.querySelector('.played-time');
            totalTimeElem = durationContainer.querySelector('.total-time');
        }
        if (!currentTimeElem || !totalTimeElem) {
            currentTimeElem = document.querySelector('.ccH5TimeCurrent');
            totalTimeElem = document.querySelector('.ccH5TimeTotal');
        }

        const videoElem = document.querySelector('video');

        if (currentTimeElem && totalTimeElem) {
            const currentTime = currentTimeElem.textContent.trim();
            const totalTime = totalTimeElem.textContent.trim();
            const currentSec = timeToSeconds(currentTime);
            const totalSec = timeToSeconds(totalTime);

            if (totalSec > 0) {
                updateProgress(currentProgress, currentTime, totalTime);

                if (currentProgress >= 99.9 && !hasPlayedNext) {
                    hasPlayedNext = true;
                    playNextVideo(true);
                }
                if (currentProgress < 99.9) hasPlayedNext = false;
            }
        } else if (videoElem) {
            const cur = videoElem.currentTime || 0;
            const total = videoElem.duration || 0;
            if (total > 0) {
                const curStr = new Date(cur * 1000).toISOString().substr(11, 8);
                const totalStr = new Date(total * 1000).toISOString().substr(11, 8);
                updateProgress(currentProgress, curStr, totalStr);

                if (currentProgress >= 99.9 && !hasPlayedNext) {
                    hasPlayedNext = true;
                    playNextVideo(true);
                }
                if (currentProgress < 99.9) hasPlayedNext = false;
            }
        }

        // 检查进度变化，更新无进度计数器
        if (Math.abs(currentProgress - lastProgress) >= CONFIG.PROGRESS_CHANGE_THRESHOLD) {
            lastProgress = currentProgress;
            noProgressCount = 0;
            countdownTimeRemaining = CONFIG.MAX_NO_PROGRESS_COUNT;
            updateCountdown(countdownTimeRemaining);
        } else {
            noProgressCount++;
            if (noProgressCount === CONFIG.PROGRESS_STALL_RETRY_SECONDS) {
                log(`进度已${noProgressCount}秒无变化，尝试恢复播放`);
                ensurePlaying();
                updateStatus(getCurrentPlayStatus());
            }
        }

        // 更新UI状态
        updateStatus(isPlaying);
        if (!isPlaying) ensurePlaying();
        updateSpeed(playbackSpeed);
        if (isPlaying && speedChecked && videoElem) setVideoSpeed(playbackSpeed);
        updateNextVideo();
    };

    // 获取视频进度
    const getVideoProgress = () => {
        const videoElem = document.querySelector('video');
        const currentTimeElem = document.querySelector('.text.duration .played-time') || document.querySelector('.ccH5TimeCurrent');
        const totalTimeElem = document.querySelector('.text.duration .total-time') || document.querySelector('.ccH5TimeTotal');

        if (currentTimeElem && totalTimeElem) {
            const currentSec = timeToSeconds(currentTimeElem.textContent.trim());
            const totalSec = timeToSeconds(totalTimeElem.textContent.trim());
            return totalSec > 0 ? (currentSec / totalSec) * 100 : 0;
        } else if (videoElem) {
            return videoElem.duration > 0 ? (videoElem.currentTime / videoElem.duration) * 100 : 0;
        }
        return 0;
    };

    // 启动监控
    const startMonitoring = () => {
        createMainPanel();
        autoPlayVideo();
        setInterval(monitorVideoProgress, 1000);
        setInterval(bindVideoEndedHandler, 2000);
        startDetectorTimer();
        bindListClickHandler();
    };

    // 标记当前课程为已学习（即使是异常课程也能被标记）
    const markCurrentCourseAsLearned = () => {
        if (!currentCourseId) return;

        const curCourseIndex = pendingCourses.findIndex(c => c.id === currentCourseId);
        if (curCourseIndex === -1) return;

        // 无论是否为异常课程，只要调用此方法就标记为已学习
        if (!pendingCourses[curCourseIndex].isLearned) {
            pendingCourses[curCourseIndex].isLearned = true;
            // 标记为已学习后清除异常标记
            pendingCourses[curCourseIndex].isAbnormal = false;
            syncToLocalStorage();
            updatePendingListUI();
            updateNextVideo();
            log(`标记课程 ${currentCourseId} 为已学习（即使之前标记为异常）`);
        }
    };

    // 同步到本地存储
    const syncToLocalStorage = () => {
        localStorage.setItem('huayiPendingCourses', JSON.stringify(pendingCourses));
        localStorage.setItem('huayiCurrentCourseId', currentCourseId || '');
        localStorage.setItem('huayiCourseListExpanded', isCourseListExpanded);
    };

    // 从本地存储获取
    const getFromLocalStorage = () => {
        const stored = localStorage.getItem('huayiPendingCourses');
        return stored ? JSON.parse(stored) : [];
    };

    // 初始化函数：记录页面加载开始时间
    const init = () => {
        // 记录页面加载开始时间，用于控制最小加载时间
        pageLoadStartTime = Date.now();
        pendingCourses = getFromLocalStorage();
        currentCourseId = localStorage.getItem('huayiCurrentCourseId') || '';
        hasAutoJumped = false;
        resourceCheckAttempts = 0;

        createMainPanel();

        const isHomePage = window.location.href.includes('ExerciseHome/index');
        const isPlayPage = window.location.href.includes('courseware_id');

        if (isHomePage) {
            // 首次加载列表页增加延迟
            const delay = isFirstLoad ? CONFIG.FIRST_LOAD_DELAY : CONFIG.INIT_DELAY;
            setTimeout(() => {
                // 等待资源加载完成后再执行
                waitForResources(() => {
                    clickPostCourse();
                    startUpdateCourseList();
                });
            }, delay);
        } else if (isPlayPage) {
            // 首次加载播放页增加延迟
            const delay = isFirstLoad ? CONFIG.FIRST_LOAD_DELAY : 3000;
            setTimeout(() => {
                // 等待资源加载完成后再执行
                waitForResources(() => {
                    startMonitoring();
                    isJumping = false;
                    if (CONFIG.AUTO_MUTE_ON_PLAY && !userMuteToggle) {
                        setTimeout(ensureMuted, 1000);
                    }
                });
            }, delay);

            const urlParams = new URLSearchParams(window.location.search);
            const urlCourseId = urlParams.get('courseware_id');
            if (urlCourseId && !currentCourseId) {
                currentCourseId = urlCourseId;
                syncToLocalStorage();
                updateCurrentCourseId();
            }
            updatePendingListUI();
        }

        window.addEventListener('beforeunload', clearAllResources);
    };

    init();
})();
