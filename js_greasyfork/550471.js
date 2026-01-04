// ==UserScript==
// @name         Bilibili 自动开启字幕
// @namespace    http://tampermonkey.net/
// @description  辣鸡 B 站到 2025 年还不支持自动开启字幕
// @version      1.4.1
// @author       Yuna (with modifications)
// @match        *://www.bilibili.com/video/*
// @grant        GM_registerMenuCommand
// @run-at       document-end
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/550471/Bilibili%20%E8%87%AA%E5%8A%A8%E5%BC%80%E5%90%AF%E5%AD%97%E5%B9%95.user.js
// @updateURL https://update.greasyfork.org/scripts/550471/Bilibili%20%E8%87%AA%E5%8A%A8%E5%BC%80%E5%90%AF%E5%AD%97%E5%B9%95.meta.js
// ==/UserScript==

( function ()
{
    'use strict';


    const CONFIG = {
        maxRetryCount: 3, retryIntervalMs: 1000, closeNotificationTimeoutMs: 3000, debug: true,
    };

    const selectorList = {
        playerContainer: ".bpx-player-video-wrap",
        videoPlayer: ".bpx-player-video-wrap video",
        notificationBox: ".bpx-player-toast-auto",
        notificationItem: ".bpx-player-toast-row.bpx-player-toast-unfold",
        languageButton: ".bpx-player-ctrl-subtitle-language-item",
        subtitleItem: ".bpx-player-ctrl-subtitle-language-item",
    };

    const classNameList = {
        isActive: "bpx-state-active",
        subtitleList: "bpx-player-ctrl-subtitle-menu-left",
        subtitleItem: "bpx-player-ctrl-subtitle-language-item",
        toastText: "bpx-player-toast-text",
        toastItem: "bpx-player-toast-item"
    };

    function log ( message )
    {
        if ( CONFIG.debug )
        {
            console.log( "[Bilibili 自动开启字幕]", message );
            notification( message );
        }
    }

    /**
     * 显示通知, Hook 到 Bilibili 的通知系统
     * @param message {string}   希望显示的消息
     * @param timeoutOfMs {number}   通知显示的时长, 单位为毫秒
     */
    function notification ( message, timeoutOfMs = CONFIG.closeNotificationTimeoutMs )
    {
        const notificationBox = document.querySelector( selectorList.notificationBox );
        if ( !notificationBox )
        {
            // 在早期阶段可能找不到通知框，可以稍微延迟或忽略
            log( "未找到通知框" );
            return;
        }

        const notificationItem = document.createElement( "div" );
        notificationItem.className = classNameList.notificationItem;
        notificationItem.innerHTML =
            `<div class="${ classNameList.toastItem }"><span class="${ classNameList.toastText }">${ message }</span></div>`;

        notificationBox.appendChild( notificationItem );
        setTimeout( () => notificationItem.remove(), timeoutOfMs );
    }


    /**
     * 尝试开启字幕
     * @returns {boolean}  是否成功开启字幕
     */
    function enableSubtitle ()
    {
        /* order 越大优先级越高, 有特殊需求的字幕可以调整 order 值 */
        const priorityList = [
            { name: "官方英文", keyWord: "en-", order: 4 },
            { name: "AI英文", keyWord: "ai-en", order: 3 },
            { name: "官方中文", keyWord: "zh-", order: 2 },
            { name: "AI中文", keyWord: "ai-zh", order: 1 },
        ].sort( ( a, b ) => b.order - a.order );

        for ( const item of priorityList )
        {
            log( `扫描：正在查找 [${ item.name }] 字幕` );
            const languageButton = document.querySelector( `${ selectorList.subtitleItem }[data-lan*="${ item.keyWord }"]` );

            if ( !languageButton )
            {
                log( `扫描：未找到 [${ item.name }] 字幕` );
                continue;
            }

            // 检查字幕是否已开启
            if ( languageButton.classList.contains( classNameList.isActive ) )
            {
                log( `[${ item.name }] 字幕已是开启状态` );
                return true;
            }

            log( `操作：已尝试开启 [${ item.name }] 字幕` );
            languageButton.click();
            return true;
        }

        log( "扫描：未在列表中找到任何优先字幕" );
        return false;
    }

    // 监听锁，防止多次重复尝试开启字幕
    let isTryingToEnableSubtitle = false;

    function enableSubtitleWithRetry ( currentRetryCount = 0 )
    {
        isTryingToEnableSubtitle = true;
        if ( currentRetryCount >= CONFIG.maxRetryCount )
        {
            log( `状态：尝试开启字幕已达最大次数 ${ CONFIG.maxRetryCount }，放弃...` );
            isTryingToEnableSubtitle = false;
            return;
        }

        if ( enableSubtitle() )
        {
            log( "状态：成功开启字幕..." );
            isTryingToEnableSubtitle = false;
            return;
        }

        log( `状态：播放器未加载，将在 ${ CONFIG.retryIntervalMs } 毫秒后再次尝试开启字幕... (${ currentRetryCount +
                                                                                               1 }/${ CONFIG.maxRetryCount })` );
        // 计算下一次重试的延迟时间, 根据当前重试次数和最大重试次数进行线性递增. 例如，第 1 次重试延迟 1 秒，第 2 次重试延迟 2 秒，以此类推。
        const nextRetryDelayMs = CONFIG.retryIntervalMs * ( currentRetryCount + 1 );
        setTimeout( () => enableSubtitleWithRetry( currentRetryCount + 1 ), nextRetryDelayMs );
    }

    function checkAndEnableSubtitle ( _, observer )
    {
        const videoPlayer = document.querySelector( selectorList.videoPlayer );

        if ( !videoPlayer )
        {
            log( "状态：播放器未加载，继续监听..." );
            return;
        }

        log( "状态：播放器已加载，停止监听..." );
        observer.disconnect();

        videoPlayer.addEventListener( "play", () =>
        {
            log( "状态：播放器开始播放，开始尝试开启字幕..." );
            if ( isTryingToEnableSubtitle )
            {
                log( "状态：正在尝试开启字幕，跳过..." );
                return;
            }
            enableSubtitleWithRetry();
        } );
    }


    function start ()
    {
        log( "状态：启动字幕自动开启脚本..." );
        const observer = new MutationObserver( checkAndEnableSubtitle );
        observer.observe( document.body, { childList: true, subtree: true } );
    }

    start();
} )();
