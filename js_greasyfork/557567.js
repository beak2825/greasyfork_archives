// ==UserScript==
// @name         【百科】短视频
// @namespace    http://tampermonkey.net/
// @version      2025/12/04-05:52:01
// @description  【百科】短视频截图
// @author       You

// @match        https://www.douyin.com/*
// @match        https://v3-web.douyinvod.com/*
// @match        https://v26-web.douyinvod.com/*

// @match        https://www.iqiyi.com/*

// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @license      All rights reserved
// @downloadURL https://update.greasyfork.org/scripts/557567/%E3%80%90%E7%99%BE%E7%A7%91%E3%80%91%E7%9F%AD%E8%A7%86%E9%A2%91.user.js
// @updateURL https://update.greasyfork.org/scripts/557567/%E3%80%90%E7%99%BE%E7%A7%91%E3%80%91%E7%9F%AD%E8%A7%86%E9%A2%91.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    //*************************************************************************************
    //----------------------------------------全局辅助函数
    //*************************************************************************************
    // 创建总容器
    function createNav() {
        var nav = document.createElement("nav");
        nav.id = "quarkToolsNav";
        document.querySelector("body").appendChild(nav);
    }


    // 右下按键样式
    function addButton(innerHTML, bottom, right, where, onClick) {
        var mybutton = document.createElement("div");
        // var tag = document.querySelector(where);
        where.appendChild(mybutton);
        mybutton.id = innerHTML;
        mybutton.innerHTML = innerHTML;
        // mybutton.style.position = 'absolute';
        mybutton.style.position = "fixed";
        mybutton.style.bottom = bottom;
        mybutton.style.right = right;
        mybutton.style.width = "50px";
        mybutton.style.height = "45px";
        mybutton.style.background = "yellow";
        mybutton.style.opacity = "0.75";
        mybutton.style.color = "blake";
        mybutton.style.textAlign = "center";
        mybutton.style.lineHeight = "45px";
        mybutton.style.fontSize = "30px";//按钮元素的字体大小
        mybutton.style.cursor = "pointer";
        mybutton.style.zIndex = "999999";
        // 设置点击事件
        mybutton.onclick = onClick;
    }

    // 下载图片
    function downloadImage(url, filename) {
        // 使用fetch避免页面跳转
        fetch(url)
            .then(response => response.blob())
            .then(blob => {
            const blobUrl = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = blobUrl;
            a.download = filename;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(blobUrl);
        })
            .catch(error => console.error('下载失败:', error));
    }

    // 为指定video元素添加帧级控制按钮
    function addFrameControls(videoElement, options = {}) {
        /**
 * 为指定video元素添加帧级控制按钮
 * @param {HTMLVideoElement} videoElement - 目标video元素
 * @param {Object} options - 配置选项
 * @param {number} options.frameStepSmall - 小步进帧数（默认1帧）
 * @param {number} options.frameStepMedium - 中步进帧数（默认5帧）
 * @param {number} options.frameStepLarge - 大步进帧数（默认10帧）
 */
        const config = {
            frameStepSmall: 1,
            frameStepMedium: 5,
            frameStepLarge: 10,
            ...options
        };

        // 计算视频帧率（基于duration和videoHeight估算）
        const getFrameRate = () => {
            // 方法1：通过metadata获取
            if (videoElement.videoHeight && videoElement.duration) {
                // 假设为常见帧率，基于时长和分辨率估算
                const commonRates = [23.976, 24, 25, 29.97, 30, 50, 59.94, 60];
                return commonRates.find(rate =>
                                        Math.abs(videoElement.duration - Math.round(videoElement.duration * rate) / rate) < 0.1
                                       ) || 30; // 默认30fps
            }
            return 30; // 默认帧率
        };

        // 跳转到指定帧
        const seekToFrame = (frameOffset = 0) => {
            if (!videoElement.readyState) return;

            const fps = getFrameRate();
            const frameDuration = 1 / fps;
            let currentTime = videoElement.currentTime;

            // 跳到第一帧
            if (frameOffset === 'first') {
                videoElement.currentTime = 0;
            }
            // 相对帧跳转
            else if (typeof frameOffset === 'number') {
                videoElement.currentTime += frameOffset * frameDuration;
            }

            videoElement.pause();
        };

        // 创建控制按钮
        const createButton = (text, title, clickHandler) => {
            const btn = document.createElement('button');
            btn.textContent = text;
            btn.title = title;
            btn.style.cssText = `
            margin: 2px;
            padding: 4px 8px;
            font-size: 12px;
            cursor: pointer;
            background: rgba(0,0,0,0.7);
            color: white;
            border: 1px solid #666;
            border-radius: 3px;
            z-index: 1000000000000;
            opacity: 1;
        `;
            btn.addEventListener('click', clickHandler);
            return btn;
        };

        // 创建控制容器
        const controlsContainer = document.createElement('div');
        controlsContainer.style.cssText = `
        display: inline-flex;
        align-items: center;
        margin-left: 10px;
        background: rgba(0,0,0,0.8);
        padding: 4px;
        border-radius: 4px;
        z-index: 1000000000000;
        opacity: 1;
    `;

        // 添加按钮
        const buttons = [
            ['⏮️', '跳到第一帧', () => seekToFrame('first')],
            [`-${config.frameStepLarge}`, `向后${config.frameStepLarge}帧`, () => seekToFrame(-config.frameStepLarge)],
            [`-${config.frameStepMedium}`, `向后${config.frameStepMedium}帧`, () => seekToFrame(-config.frameStepMedium)],
            [`-${config.frameStepSmall}`, `向后${config.frameStepSmall}帧`, () => seekToFrame(-config.frameStepSmall)],
            [`+${config.frameStepSmall}`, `向前${config.frameStepSmall}帧`, () => seekToFrame(config.frameStepSmall)],
            [`+${config.frameStepMedium}`, `向前${config.frameStepMedium}帧`, () => seekToFrame(config.frameStepMedium)],
            [`+${config.frameStepLarge}`, `向前${config.frameStepLarge}帧`, () => seekToFrame(config.frameStepLarge)]
        ];

        buttons.forEach(([text, title, handler]) => {
            controlsContainer.appendChild(createButton(text, title, handler));
        });

        // 插入到视频控件中
        const insertControls = () => {
            const iqiyi = document.querySelector('#content div #content #video');
            if (iqiyi) {
                iqiyi.insertBefore(controlsContainer, iqiyi.firstChild);
            } else {
                // 备用方案：直接添加到video后面
                videoElement.parentElement.appendChild(controlsContainer);
            }
        };

        // 等待视频就绪
        if (videoElement.readyState >= 2) {
            insertControls();
        } else {
            videoElement.addEventListener('loadedmetadata', insertControls, { once: true });
        }
    }

    // 视频截图
    function captureAndCropVideoFrameAndDownload() {
        // 获取页面中的唯一视频标签
        let video = document.querySelector('video');

        // 创建一个 Canvas 元素
        let canvas = document.createElement('canvas');
        let ctx = canvas.getContext('2d');

        // 设置 Canvas 的尺寸和视频的尺寸一致
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;

        // 在 Canvas 上绘制视频帧
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

        // 获取像素数据
        let imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        let pixels = imageData.data;

        // 去除左侧全黑像素列
        let leftEdge = 0;
        for (let x = 0; x < canvas.width; x++) {
            let isColumnEmpty = true;
            for (let y = 0; y < canvas.height; y++) {
                let pixelIndex = (y * canvas.width + x) * 4;
                if (pixels[pixelIndex] !== 0 || pixels[pixelIndex + 1] !== 0 || pixels[pixelIndex + 2] !== 0) {
                    isColumnEmpty = false;
                    break;
                }
            }
            if (!isColumnEmpty) {
                leftEdge = x;
                break;
            }
        }

        // 去除右侧全黑像素列
        let rightEdge = canvas.width;
        for (let x = canvas.width - 1; x >= 0; x--) {
            let isColumnEmpty = true;
            for (let y = 0; y < canvas.height; y++) {
                let pixelIndex = (y * canvas.width + x) * 4;
                if (pixels[pixelIndex] !== 0 || pixels[pixelIndex + 1] !== 0 || pixels[pixelIndex + 2] !== 0) {
                    isColumnEmpty = false;
                    break;
                }
            }
            if (!isColumnEmpty) {
                rightEdge = x + 1;
                break;
            }
        }

        // 创建新的 Canvas 用于裁剪
        let croppedCanvas = document.createElement('canvas');
        let croppedCtx = croppedCanvas.getContext('2d');
        croppedCanvas.width = rightEdge - leftEdge;
        croppedCanvas.height = canvas.height;
        croppedCtx.putImageData(imageData, -leftEdge, 0);

        // 使用时间戳生成文件名
        let timestamp = new Date().getTime();
        let filename = 'screenshot_' + timestamp + '.png';

        // 将裁剪后的图像数据转换为DataURL并下载
        croppedCanvas.toBlob(function(blob) {
            let url = URL.createObjectURL(blob);
            let a = document.createElement('a');
            a.href = url;
            a.download = filename;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
        }, 'image/png');
    }

    // 安全获取嵌套对象属性（支持可选链）
    function safeGet(obj, path) {
        /**
 * 安全获取嵌套对象属性（支持可选链）
 * @param {Object} obj - 源对象
 * @param {string} path - 属性路径，如：'?.children[1]?.props?.videoList[0]?.mixInfo'
 * @returns {*} 属性值或undefined
 */
        if (!path) return obj;

        // 移除开头的'?.'，转换为常规路径
        const normalizedPath = path.startsWith('?.') ? path.substring(2) : path;

        // 分割路径为各个部分
        const segments = normalizedPath
        .split(/\.|\?\.|\[|\]/) // 分割 . ?. [ ]
        .filter(segment => segment && segment !== '') // 移除空值

        // 逐级安全访问
        return segments.reduce((current, segment) => {
            return current?.[segment];
        }, obj);
    }

    // 从React元素中安全获取嵌套数据
    function getReactData(element, path, targetKey) {
        /**
 * 从React元素中安全获取嵌套数据
 * @param {Element} element - DOM元素
 * @param {string} path - 属性路径字符串，支持可选链格式
 * @param {string} targetKey - 要提取的目标属性名
 * @returns {*} 目标属性值，未找到则返回undefined
 */
        // 查找React属性
        const reactPropKeys = Object.keys(element).filter(key =>
                                                          key.startsWith('__reactProps')
                                                         );

        if (reactPropKeys.length === 0) {
            console.warn('未找到React属性');
            return;
        }

        // 获取React props
        const reactProps = element[reactPropKeys[0]];

        try {
            // 安全解析路径
            const data = safeGet(reactProps, path);
            const targetValue = data?.[targetKey];

            console.log('获取数据成功:', { data, [targetKey]: targetValue });
            return targetValue;
        } catch (error) {
            console.error('数据解析失败:', error);
            return;
        }
    }

    // 去除视频页面悬浮搜索框
    function searchTag_go(){
        let searchButtonTag_video = document.querySelector("#douyin-right-container > div:nth-child(2) > div > div.leftContainer > div.video-detail-container.newVideoPlayer.isDanmuPlayer > div.isDark > div > div > div > button")

        if (searchButtonTag_video) {
            searchButtonTag_video.parentNode.remove();
            console.log('remove()');
        }

        let searchButtonTag_search = document.querySelector("#douyin-right-container > div:nth-child(4) > div.isDark > div > div > button")

        if (searchButtonTag_search) {
            searchButtonTag_search.parentNode.remove();
            console.log('remove()');
        }
    }




    // 抖音：开，跳转
    function douyin_openVideoInNewTab(){
        let video_Src = document.querySelector("video > source:nth-child(2)");

        if (video_Src) {
            window.open(video_Src.src);
        }
    }

    // 抖音：抖音搜索结果页面加按钮
    function douyin_searchPageCreateButton(){
        const video_list = document.querySelectorAll("#search-body-container #waterFallScrollContainer > div:has(img)");

        video_list.forEach(tagElement => {
            // 跳过本次循环，继续下一次
            if (tagElement.querySelector("div#🔗")) {
                return;
            }

            const awemeId = getReactData(
                tagElement,
                '?.children?.props?.data?.cardInfo?.mixItems[0]',
                'awemeId'
            );

            const docId = getReactData(
                tagElement,
                '?.children?.props?.data',
                'docId'
            );

            let id = awemeId || docId;

            let url = 'https://www.douyin.com/video/' + id;
            console.log('视频链接:', url);

            if (url) {
                addButton("🔗", "200px", "10px", tagElement, function() {
                    window.open(url);
                });
            }

        });


    }

    // 抖音：移除登录弹窗
    function douyin_removeLoginModal(){
        const loginModal = document?.querySelector("html > body > div[id*='login-full-panel-']");

        // 跳过本次循环，继续下一次
        if (!loginModal) {
            return;
        } else {
            loginModal.remove();
        }
    }

    // 抖音：剧名
    function douyin_getData_title() {
        const mixName = getReactData(
            document?.querySelector('#douyin-right-container div[data-e2e="video-detail"] > div.detailPage > div[data-e2e="related-video"] > div[data-e2e="aweme-mix"]'),
            '?.children[1]?.props?.children?.props?.videoList[0]?.mixInfo',
            'mixName'
        );

        console.log('mixName:', mixName);

        return mixName;
    }

    // 抖音：获取概述图
    function douyin_getData_image() {
        const cover = getReactData(
            document?.querySelector('#douyin-right-container div[data-e2e="video-detail"] > div.detailPage > div[data-e2e="related-video"] > div[data-e2e="aweme-mix"]'),
            '?.children[1]?.props?.children?.props?.videoList[0]?.mixInfo',
            'cover'
        );

        console.log('cover:', cover);

        navigator.clipboard.writeText(cover)
            .then(() => console.log('【newFilename】已复制到剪贴板：' + cover))
            .catch(err => console.warning('【newFilename】复制失败：', err));


        // https://p26-sign.douyinpic.com/obj/tos-cn-i-dy/720f8f97f48c8c678e06d42d57f1e379?lk3s=138a59ce&x-expires=1764810000&x-signature=fu%2BmQioxMsmqSRakmLiMONoV8DA%3D&from=327834062&s=PackSourceEnum_SERIES_AWEME&se=false&sc=mix_cover&biz_tag=aweme_mix&l=2025120403095348A15ABBEF29DA290DAB
        const path = cover?.split('?lk3s')[0]?.split('tos-cn-i-dy/')[1] + '.jpg';

        console.log('文件名:', path);

        // 6. 下载图片
        downloadImage(cover, path);
    }

    // 抖音：获取剧情简介
    function douyin_getData_description() {
        const desc = getReactData(
            document?.querySelector('#douyin-right-container div[data-e2e="video-detail"] > div.detailPage > div[data-e2e="related-video"] > div[data-e2e="aweme-mix"]'),
            '?.children[1]?.props?.children?.props?.videoList[0]?.mixInfo',
            'desc'
        );

        console.log('desc:', desc);

        return desc;
    }

    // 抖音：获取上映时间
    function douyin_getData_time() {
        const createTime = getReactData(
            document?.querySelector('#douyin-right-container div[data-e2e="video-detail"] > div.detailPage > div[data-e2e="related-video"] > div[data-e2e="aweme-mix"]'),
            '?.children[1]?.props?.children?.props?.videoList[0]',
            'createTime'
        );

        console.log('createTime:', createTime);
        // 输出: 2023年12月27日 (中文格式)

        const formatTimestamp = s => new Date(Number(s) * 1000).toLocaleDateString('zh-CN').replace(/\//g, '年').replace(/(?<=年\d)年/, '月') + '日';

        // 使用
        let time = formatTimestamp(createTime);
        console.log('time:', time);

        return time;
    }

    // 抖音：集数
    function douyin_getData_episodes() {
        const totalEpisode = getReactData(
            document?.querySelector('#douyin-right-container div[data-e2e="video-detail"] > div.detailPage > div[data-e2e="related-video"] > div[data-e2e="aweme-mix"]'),
            '?.children[1]?.props?.children?.props?.videoList[0]?.mixInfo',
            'totalEpisode'
        );

        console.log('totalEpisode:', totalEpisode);

        return totalEpisode;
    }

    // 抖音：拼接概述
    //《服了她满级你惹她干嘛》是一部现代都市轻喜剧，于2024年6月1日首次上线，全剧88集。
    function douyin_createQuarkDescription() {
        let title = douyin_getData_title();
        let time = douyin_getData_time();
        let episodes = douyin_getData_episodes();

        let quarkDescription = "《" + title + "》是一部" + "系列短剧，于" + time + "首次上线，共" + episodes + "集。";
        console.log('quarkDescription:', quarkDescription);

        return quarkDescription;
    }


    setTimeout(function() {
        console.log('douyin_createQuarkDescription');
        douyin_createQuarkDescription();
    }, 5000);

    // 爱奇艺：去除追踪参数
    function iqiyi_init_cleanUrl() {
        function iqiyi_cleanUrl() {
            let url = window.location.href;

            // 已经干净就无需继续执行
            if (/^https?:\/\/www\.iqiyi\.com\/[0-9a-zA-Z_-]+\.html$/.test(url)
                || !/[?&]+/.test(url)
               ) {
                return;
            }


            let cleanUrl = url.replace(/(^https?:\/\/www\.iqiyi\.com\/[0-9a-zA-Z_-]+\.html).*/, '$1');

            window.location.href = cleanUrl;
        }

        iqiyi_cleanUrl();

        // 监听URL变化（兼容单页应用SPA）
        let lastUrl = location.href;

        // MutationObserver（推荐，监听SPA路由变化）
        const observer = new MutationObserver(() => {
            const currentUrl = location.href;
            if (currentUrl !== lastUrl) {
                lastUrl = currentUrl;
                iqiyi_cleanUrl(); // URL变化后运行
            }
        });

        // 开始监听DOM变化
        observer.observe(document, {
            subtree: true,
            childList: true
        });
    }

    // 爱奇艺：剧名
    function iqiyi_getData_title() {
        let title_head = document?.querySelector('head > title')?.textContent?.replace('-电视剧全集-完整版视频在线观看-爱奇艺', '')?.trim();
        let title_element = document?.querySelector('div#root div#content div#meta_info_bk div[class*="meta_titleBtn__curus"]')?.textContent?.trim();;
        let title = title_head || title_element;
        console.log('title：' + title);

        return title;
    }

    // 爱奇艺：获取概述图
    function iqiyi_getData_image() {
        // 获取url
        const element = document?.querySelector('div#root div#content div#content div#tvg div[class*="config-page_metaPosterBackground__"]');
        const image = window.getComputedStyle(element).backgroundImage.replace(/^url\(["']?|["']?\)$/g, '');

        // 1. 解析原始URL中的尺寸和路径
        const urlParts = image.split('/');
        const filename = urlParts.pop(); // a_100591890_m_601_m9_579_772.avif
        const baseUrl = urlParts.join('/') + '/';

        // 2. 提取尺寸信息
        const sizeMatch = filename.match(/(\d+)_(\d+)\.\w+$/);
        if (!sizeMatch) {
            console.error('无法提取尺寸信息');
            return;
        }

        const originalWidth = parseInt(sizeMatch[1]); // 579
        const originalHeight = parseInt(sizeMatch[2]); // 772
        const isPortrait = originalHeight < originalWidth;

        // 3. 计算新尺寸（最小边为1080，保持纵横比）
        let newWidth, newHeight;
        if (isPortrait) {
            newHeight = 1080;
            newWidth = Math.round(originalWidth * 1080 / originalHeight);
        } else {
            newWidth = 1080;
            newHeight = Math.round(originalHeight * 1080 / originalWidth);
        }

        // 4. 生成新URL（替换尺寸，avif改为png）
        const newFilename = filename.replace(/(\d+_\d+)\.avif$/, `${newWidth}_${newHeight}.png`);
        const imageBig = baseUrl + newFilename.replace('.avif', '.png');

        navigator.clipboard.writeText(newFilename)
            .then(() => console.log('【newFilename】已复制到剪贴板：' + newFilename))
            .catch(err => console.warning('【newFilename】复制失败：', err));

        // 5. 创建path（下载文件名）
        const path = newFilename;

        console.log('新URL:', imageBig);
        console.log('新尺寸:', `${newWidth}x${newHeight}`);
        console.log('文件名:', path);

        // 6. 下载图片
        downloadImage(imageBig, path);

    }

    // 爱奇艺：获取剧情简介
    function iqiyi_getData_description() {
        let description = document?.querySelector('head > meta[name="description"]')?.content?.trim();

        return description;
    }

    // 爱奇艺：上映时间
    function iqiyi_getData_time() {
        const last_update_time = getReactData(
            document?.querySelector('div#root div#content div#selector_bk div.episode-container > div'),
            '?.children[0][0]?.props?.data',
            'last_update_time'
        );

        console.log('last_update_time:', last_update_time);
        // 输出: 2023年12月27日 (中文格式)

        const formatTimestamp = ms => new Date(Number(ms)).toLocaleDateString('zh-CN').replace(/\//g, '年').replace(/(?<=年\d)年/, '月') + '日';

        // 使用
        let time = formatTimestamp(last_update_time); // 2024年1月15日
        console.log('time:', time);

        return time;
    }

    // 爱奇艺：集数
    function iqiyi_getData_episodes() {
        const total_episode = getReactData(
            document?.querySelector('div#root div#content div#selector_bk div.globalEpisodeTitleBoxOverride'),
            '?.children[1][0]?.props?.children[0]?.props?.data',
            'total_episode'
        );

        const update_status = getReactData(
            document?.querySelector('div#root div#content div#selector_bk div.globalEpisodeTitleBoxOverride'),
            '?.children[1][0]?.props?.info',
            'update_status'
        );

        let update_status_num = update_status.match(/\d+/) ? parseInt(update_status.match(/\d+/)[0], 10) : null;

        let episodes = total_episode || update_status_num;

        console.log('total_episode:', total_episode);
        console.log('update_status_num:', update_status_num);
        console.log('episodes:', episodes);

        return episodes;
    }

    // 爱奇艺：拼接概述
    //《服了她满级你惹她干嘛》是一部现代都市轻喜剧，于2024年6月1日首次上线，全剧88集。
    function iqiyi_createQuarkDescription() {
        let title = iqiyi_getData_title();
        let time = iqiyi_getData_time();
        let episodes = iqiyi_getData_episodes();

        let quarkDescription = "《" + title + "》是一部" + "系列短剧，于" + time + "首次上线，共" + episodes + "集。";
        console.log('quarkDescription:', quarkDescription);

        return quarkDescription;
    }



    //*************************************************************************************
    //*************************************************************************************
    //----------------------------------------页面
    //*************************************************************************************
    //*************************************************************************************
    var url = window.location.href;
    console.log('url：' + url);

    var host = window.location.host;
    console.log('host：' + host);

    // 抖音
    if (url.includes("douyin")) {
        // 移除登录弹窗
        setInterval(douyin_removeLoginModal, 1000);

        // 搜索结果页面
        if (url.includes("www.douyin.com/search")) {
            console.log('搜索结果页面');

            setInterval(douyin_searchPageCreateButton, 1000);

            //
            setInterval(searchTag_go, 1000);

        }
        // 视频详情页面
        else if (url.includes('www.douyin.com/video')) {
            console.log('视频详情页面');
            addButton("概", "400px", "10px", document.querySelector("body"), function() {
                const text = douyin_createQuarkDescription();
                console.log(text);

                navigator.clipboard.writeText(text)
                    .then(() => console.log('【复制】已复制到剪贴板：' + text))
                    .catch(err => console.warning('【复制】复制失败：', err));
            });

            addButton("开", "60px", "10px", document.querySelector("body"), function() {
                douyin_openVideoInNewTab(url);
            });

            addButton("图", "240px", "10px", document.querySelector("body"), function() {
                douyin_getData_image();
            });

            addButton("介", "180px", "10px", document.querySelector("body"), function() {
                const text = douyin_getData_description();
                console.log(text);

                navigator.clipboard.writeText(text)
                    .then(() => console.log('【复制】已复制到剪贴板：' + text))
                    .catch(err => console.warning('【复制】复制失败：', err));
            });


            addButton("截", "120px", "10px", document.querySelector("body"), function() {
                // 调用函数以捕获、裁剪并下载视频帧
                captureAndCropVideoFrameAndDownload();
            });

            // 添加控件
            setTimeout(function() {
                console.log('addFrameControls');
                addFrameControls(document.querySelector('video'));
            }, 5000);

        }
        // 视频文件页面
        else if (url.includes('douyinvod.com')) {
            console.log('视频文件页面');
            addButton("截", "20px", "10px", document.querySelector("body"), function() {
                //
                // 调用函数以捕获、裁剪并下载视频帧
                captureAndCropVideoFrameAndDownload();
            });

            setTimeout(function() {
                console.log('addFrameControls');
                addFrameControls(document.querySelector('video'));
            }, 5000);
        }
    }

    // 爱奇艺
    else if (url.includes('iqiyi.com')) {
        iqiyi_init_cleanUrl();
        createNav();

        // 搜索结果页面
        if (url.includes("iqiyi.com/search")) {
            console.log('搜索结果页面');



        }
        // 视频详情页面
        else if (/https?:\/\/www\.iqiyi\.com\/v_[0-9a-zA-Z]+\.html.*/.test(url)) {
            console.log('视频详情页面');
            addButton("概", "400px", "10px", document.querySelector("nav#quarkToolsNav"), function() {
                const text = iqiyi_createQuarkDescription();
                console.log(text);

                navigator.clipboard.writeText(text)
                    .then(() => console.log('【复制】已复制到剪贴板：' + text))
                    .catch(err => console.warning('【复制】复制失败：', err));
            });

            addButton("图", "240px", "10px", document.querySelector("nav#quarkToolsNav"), function() {
                iqiyi_getData_image();
            });

            addButton("介", "180px", "10px", document.querySelector("nav#quarkToolsNav"), function() {
                const text = iqiyi_getData_description();
                console.log(text);

                navigator.clipboard.writeText(text)
                    .then(() => console.log('【复制】已复制到剪贴板：' + text))
                    .catch(err => console.warning('【复制】复制失败：', err));
            });

            addButton("截", "120px", "10px", document.querySelector("nav#quarkToolsNav"), function() {
                // 调用函数以捕获、裁剪并下载视频帧
                captureAndCropVideoFrameAndDownload();
            });

            // 添加控件
            setTimeout(function() {
                console.log('addFrameControls');
                addFrameControls(document.querySelector('video'));
            }, 5000);
        }
    }



})();