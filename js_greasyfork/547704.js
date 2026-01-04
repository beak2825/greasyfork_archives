// ==UserScript==
// @name         知识视频
// @namespace    http://tampermonkey.net/
// @version      2025-08-29
// @description  我爱学习
// @author       cw2012
// @match        http*://wx.zsxq.com/group/*/topic/*
// @icon         https://wx.zsxq.com/assets_dweb/images/favicon_32.ico
// @run-at       document-idle
// @grant        GM_xmlhttpRequest
// @grant        GM_download
// @connect      videos.zsxq.com
// @connect      api.zsxq.com
// @connect      auth.zsxq.com
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/547704/%E7%9F%A5%E8%AF%86%E8%A7%86%E9%A2%91.user.js
// @updateURL https://update.greasyfork.org/scripts/547704/%E7%9F%A5%E8%AF%86%E8%A7%86%E9%A2%91.meta.js
// ==/UserScript==
let topic = {};
let video = {};
setTimeout(function() {
    'use strict';

    topic.id = location.href.split('/')[6];
    getTopicInfo();
}, 4000);

function getTopicInfo(){
    const url = `https://api.zsxq.com/v2/topics/${topic.id}/info`;
    GM_xmlhttpRequest({
        url: url,
        method: 'get',
        onload: res => {
            res = res.responseText;
            res = JSON.parse(res);
            if(res.succeeded){
                res = res.resp_data.topic.talk;
                topic.title = res.text;
                if(res.hasOwnProperty('video')){
                    topic.videoId = res.video.video_id;
                    getVideoM3u8();
                }else{
                    console.log('本页面没有视频');
                }
            }else{
                alert('帖子信息获取失败');
            }
        }
    });
}

function getVideoM3u8(){
    GM_xmlhttpRequest({
        url: `https://api.zsxq.com/v2/videos/${topic.videoId}/url`,
        method: 'get',
        onload: res => {
            res = res.responseText;
            res = JSON.parse(res);
            if(res.succeeded){
                topic.videoUrl = res.resp_data.url;
                downloadM3u8AndKey();
            }else{
                alert('视频信息获取失败');
            }
        }
    });
}

function downloadM3u8AndKey(){
    let regexp = /([\d\w\-]+\.ts)/g;
    GM_xmlhttpRequest({
        url: topic.videoUrl,
        method: 'get',
        onload: res => {
            res = res.responseText;
            let tmp = res.replace(regexp, "https://videos.zsxq.com/$1");
            regexp = /#EXT-X-KEY:[^,]+,URI="([^"]+)"/;
            const match = tmp.match(regexp);
            if(match && match[1]){
                const originalUri = match[1];
                downlowdKey(originalUri);
                downloadM3u8(tmp);
            }
        }
    });
}

function downlowdKey(keyUrl){
    GM_xmlhttpRequest({
        method: "GET",
        url: keyUrl,
        timeout: 35_000,
        responseType:'blob',
        onload: function(res){
            const fileBlob = res.response;
            let keyName = `${topic.title}.bin`;
            downloadFileByBlob(fileBlob, keyName)
        },
        onerror: ()=>{
            console.error('下载出错\t' + keyUrl)
        }
    });
}

function downloadM3u8(tmp){
    const newUri = `${topic.title}.bin`;
    tmp = tmp.replace(/(#EXT-X-KEY:[^,]+,URI=")[^"]+(")/g, `$1${newUri}$2`);
    // 创建文本类型的Blob（指定MIME类型为text/plain）
    const blob = new Blob([tmp], { type: 'text/plain' });
    downloadFileByBlob(blob, topic.title + '.m3u8');
    console.log(tmp);
}

// 利用blob下载文件
function downloadFileByBlob(blobContent, filename) {
    const blobUrl = URL.createObjectURL(blobContent)
    const eleLink = document.createElement('a')
    eleLink.download = filename
    eleLink.style.display = 'none'
    eleLink.href = blobUrl
    eleLink.click();
}