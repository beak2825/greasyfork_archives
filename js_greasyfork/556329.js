// ==UserScript==
// @name         B站外挂字幕
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  为B站视频加载本地字幕文件，支持实时滚动显示
// @author       You
// @match        https://www.bilibili.com/video/*
// @match        https://www.bilibili.com/bangumi/play/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/556329/B%E7%AB%99%E5%A4%96%E6%8C%82%E5%AD%97%E5%B9%95.user.js
// @updateURL https://update.greasyfork.org/scripts/556329/B%E7%AB%99%E5%A4%96%E6%8C%82%E5%AD%97%E5%B9%95.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 创建字幕显示区域
    let subtitleDiv = document.createElement('div');
    subtitleDiv.style.position = 'absolute';
    subtitleDiv.style.bottom = '10%';
    subtitleDiv.style.left = '50%';
    subtitleDiv.style.transform = 'translateX(-50%)';
    subtitleDiv.style.color = 'white';
    subtitleDiv.style.fontSize = '24px';
    subtitleDiv.style.textShadow = '2px 2px 4px black';
    subtitleDiv.style.zIndex = '9999';
    subtitleDiv.style.textAlign = 'center';
    subtitleDiv.style.width = '80%';
    subtitleDiv.style.minHeight = '30px';
    subtitleDiv.innerHTML = '';

    // 将字幕显示区域添加到视频容器中
    let videoContainer = document.querySelector('.bpx-player-video-wrap');
    if (videoContainer) {
        videoContainer.style.position = 'relative';
        videoContainer.appendChild(subtitleDiv);
    }

    // 创建文件输入框，用于加载字幕文件
    let fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = '.srt,.vtt,.ass';
    fileInput.style.position = 'fixed';
    fileInput.style.top = '10px';
    fileInput.style.right = '10px';
    fileInput.style.zIndex = '9999';
    document.body.appendChild(fileInput);

    let subtitles = []; // 存储解析后的字幕数组

    // 解析SRT字幕文件
    function parseSRT(text) {
        let lines = text.split(/\r?\n/);
        let subtitles = [];
        let current = {};

        for (let i = 0; i < lines.length; i++) {
            let line = lines[i].trim();
            if (!line) continue;

            // 序号
            if (!current.index) {
                current.index = parseInt(line);
                continue;
            }

            // 时间轴
            if (line.includes('-->')) {
                let times = line.split('-->');
                current.start = parseTime(times[0].trim());
                current.end = parseTime(times[1].trim());
                continue;
            }

            // 字幕文本
            if (current.start !== undefined) {
                if (current.text) {
                    current.text += '<br>' + line;
                } else {
                    current.text = line;
                }

                // 如果下一行是空行或者新的序号，则保存当前字幕
                if (i+1 < lines.length && (lines[i+1].trim() === '' || /^\d+$/.test(lines[i+1].trim()))) {
                    subtitles.push(current);
                    current = {};
                }
            }
        }

        // 添加最后一个字幕
        if (current.text) {
            subtitles.push(current);
        }

        return subtitles;
    }

    // 时间格式转换，将SRT时间格式转换为秒
    function parseTime(timeStr) {
        let parts = timeStr.split(':');
        let seconds = 0;
        if (parts.length === 3) {
            seconds += parseFloat(parts[0]) * 3600;
            seconds += parseFloat(parts[1]) * 60;
            seconds += parseFloat(parts[2].replace(',', '.'));
        }
        return seconds;
    }

    // 文件输入变化时，读取字幕文件
    fileInput.addEventListener('change', function(e) {
        let file = e.target.files[0];
        if (!file) return;

        let reader = new FileReader();
        reader.onload = function(e) {
            let text = e.target.result;
            subtitles = parseSRT(text);
        };
        reader.readAsText(file);
    });

    // 监听视频时间更新
    let video = document.querySelector('video');
    if (video) {
        video.addEventListener('timeupdate', function() {
            let currentTime = video.currentTime;
            let currentSubtitle = '';

            for (let i = 0; i < subtitles.length; i++) {
                if (currentTime >= subtitles[i].start && currentTime <= subtitles[i].end) {
                    currentSubtitle = subtitles[i].text;
                    break;
                }
            }

            subtitleDiv.innerHTML = currentSubtitle;
        });
    }
})();// ==UserScript==
// @name        New script
// @namespace   Violentmonkey Scripts
// @match       *://example.org/*
// @grant       none
// @version     1.0
// @author      -
// @description 2025/11/15 06:23:15
// ==/UserScript==
