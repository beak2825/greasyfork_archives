// ==UserScript==
// @name         海角社区VIP视频免费看
// @namespace    haijiao_vip_video_free_see
// @version      1.0
// @description  拦截请求极其响应,对其进行修改
// @author       w2f
// @match        https://haijiao.com/*
// @icon         https://haijiao.com/images/common/project/favicon.ico
// @grant        none
// @license      MIT
// @run-at       document-start
// @require      https://scriptcat.org/lib/637/1.4.5/ajaxHooker.js#sha256=EGhGTDeet8zLCPnx8+72H15QYRfpTX4MbhyJ4lJZmyg=
// @downloadURL https://update.greasyfork.org/scripts/560388/%E6%B5%B7%E8%A7%92%E7%A4%BE%E5%8C%BAVIP%E8%A7%86%E9%A2%91%E5%85%8D%E8%B4%B9%E7%9C%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/560388/%E6%B5%B7%E8%A7%92%E7%A4%BE%E5%8C%BAVIP%E8%A7%86%E9%A2%91%E5%85%8D%E8%B4%B9%E7%9C%8B.meta.js
// ==/UserScript==

(function () {
    'use strict';
    let video_info = null;

    var my_parse = JSON.parse;//解析 JSON 字符串
    JSON.parse = function (params) {
        //这里可以添加其他逻辑比如 debugger
        let json_obj = my_parse(params);

        //console.log("json_parse params:",params); //打印劫持到的json字符串
        if (json_obj?.attachments instanceof Array) {
            //console.log("json_parse :", json_obj);
            let arr = json_obj.attachments;
            let len = arr.length;
            for (let j = 0; j < len; j++) {
                let item = arr[j];
                if (item?.video_time_length) {
                    video_info = item;
                    /*{
                        "id": 1801581,
                        "remoteUrl": "https://ts.hj25ja21a8.top/hjstore/video/20220508/0148c44d2c09980a233ad362211b0e54/49253_i_preview.m3u8",
                        "category": "video",
                        "status": 1,
                        "coverUrl": "https://test.hjbd80.top/hjstore/video/20220508/0148c44d2c09980a233ad362211b0e54/49253.jpeg.txt",
                        "video_time_length": 805
                    }*/
                    //video_info.remoteUrl = item.remoteUrl;
                    //video_info.duration = item.video_time_length;//不能读这个属性,否则跳转error
                    //video_info.id = item.id;
                    //console.log("video_info :", video_info);
                    break;
                }
            }
        }
        return json_obj;
    };

    // 如果库劫持失败，可能是其他代码对xhr/fetch进行了二次劫持，protect方法会尝试阻止xhr和fetch被改写。
    ajaxHooker.protect();
    // 为hook方法设置过滤规则，只有符合规则的请求才会触发hook
    ajaxHooker.filter([
        { type: 'xhr', url: '.m3u8', method: 'GET', async: true },//小狐狸
    ]);
    // 通过一个回调函数进行劫持，每次请求发生时自动调用回调函数。
    ajaxHooker.hook(async request => {
        request.response = async res => {
            //console.log("[tools]🔍ajaxHooker请求拦截器 修改前:", res.responseText.length);
            res.responseText = await modifyResponse_m3u8(res.responseText);
            //打印rsp
            //console.log("[tools]🔍ajaxHooker请求拦截器 修改后:", res.responseText.length);
        };
    });

    // 将xhr和fetch恢复至劫持前的状态，调用此方法后，hook方法不再生效。
    // ajaxHooker.unhook();

    //自定义rsp修改函数
    //为m3u8文件追加ts分片, 不支持追加带hash加密参数的ts分片
    async function modifyResponse_m3u8(originalText) {

        // Base64解码处理
        let flag = 0;
        try {
            const decodedText = decodeURIComponent(escape(atob(originalText)));
            //console.log('[tools]🔍 Base64解码成功，解码后长度:', decodedText.length, decodedText);
            originalText = decodedText;
            flag = 1;
        } catch (e) {
            //console.log('[tools]🔍 非Base64编码内容，直接处理');
        }

        // 修改 m3u8 内容：插入 160.ts
        let modifiedText = originalText;

        //document.querySelector("div.article.ql-editor p")?.innerText += `✅破解成功：视频时长${video_info.video_time_length}s(若获取失败则默认给30分钟，可能没有这么长，但不影响播放)`;
        if(!video_info || !video_info.video_time_length){
            video_info.video_time_length = 1800;
        }
        
        // 你可以使用正则定位插入点，比如在 ENDLIST 前加入新片段
        // TS片段配置（可扩展）
        // 配置参数
        const TS_DURATION = 1.25; // 每个片段时长(秒) ⚠️:部分网站每个ts片段时长不一致, 但目前看不影响播放,具体取决于浏览器行为
        const MAX_TS_COUNT = parseInt(video_info.video_time_length / TS_DURATION + 0.8);//30*30; // 最大生成数量 ⚠️:目前给了个很大的值,30*30*2s=30min时长, 如果能获取到真实时长这里最好修改
        //const TS_FILENAME = video_info.id + '_i{0}.ts'; //每个片段文件名 🔴:这里要拼接完整的ts地址,如果后面有参数也要加上,如果参数部分有加密hash则无法破解❌ //bug:不完全是videoid 也不完全是这个格式 [id]uHdsRav8_i{0}.ts
        const TS_PREFIX = 0; // 每个片段文件名前缀补0个数 🔴:这里一定要填对，否则拼接的ts地址不对，下载会失败

        // 预处理后的内容分析
        const lastTsMatch = originalText.match(/\n(.*?)\_i0.ts/); //⚠️: 不同站点这个匹配模式也需要改
        //console.log("[tools]🔍ajaxHooker请求拦截器 智能解析最后一个TS文件名:", lastTsMatch);
        const TS_FILENAME = lastTsMatch[1] + '_i{0}.ts';
        let startNumber = 0;//⚠️: 不同站点这个匹配模式也需要改
        let header = originalText.slice(0, originalText.indexOf("#EXTINF"));

        // 生成连续TS片段
        const fragments = Array.from({ length: MAX_TS_COUNT }, (_, i) =>
            `#EXTINF:${TS_DURATION},\n${TS_FILENAME.replace('{0}', `${(startNumber + i).toString().padStart(TS_PREFIX, '0')}`)}`
        ).join('\n');

        modifiedText = header + fragments + '\n#EXT-X-ENDLIST';
        //console.log('[tools]🔍 拼接成功，修改后m3u8内容:', modifiedText);

        // 编码为Base64
        if (flag) {
            const encodedText = btoa(unescape(encodeURIComponent(modifiedText)));
            //console.log('[tools]🔍 Base64编码成功，编码后长度:', encodedText.length);
            return encodedText;
        }

        return modifiedText;
    }


    function remove_ad() {
        document.querySelector("div.el-message-box__wrapper button")?.click();//去除 试看完毕 弹窗
    }
    setInterval(remove_ad, 1000);
})();