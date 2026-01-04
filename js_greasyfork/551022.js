// == vipParser.js ==
(function() {
    const videoParseList = [
        {"name": "789解析", "type": "1,3", "url": "https://jiexi.789jiexi.icu:4433/?url="},
        {"name": "极速解析", "type": "1,3", "url": "https://jx.2s0.cn/player/?url="},
        {"name": "冰豆解析", "type": "1,3", "url": "https://bd.jx.cn/?url="},
        {"name": "973解析", "type": "1,3", "url": "https://jx.973973.xyz/?url="},
        {"name": "虾米视频解析", "type": "1,3", "url": "https://jx.xmflv.com/?url="},
        {"name": "CK", "type": "1,3", "url": "https://www.ckplayer.vip/jiexi/?url="},
        {"name": "七哥解析", "type": "1,3", "url": "https://jx.nnxv.cn/tv.php?url="},
        {"name": "夜幕", "type": "1,3", "url": "https://www.yemu.xyz/?url="},
        {"name": "盘古", "type": "1,3", "url": "https://www.pangujiexi.com/jiexi/?url="},
        {"name": "playm3u8", "type": "1,3", "url": "https://www.playm3u8.cn/jiexi.php?url="},
        {"name": "七七云解析", "type": "1,3", "url": "https://jx.77flv.cc/?url="},
        {"name": "芒果TV1", "type": "1,3", "url": "https://video.isyour.love/player/getplayer?url="},
        {"name": "芒果TV2", "type": "1,3","url":"https://im1907.top/?jx="},
        {"name": "HLS解析", "type": "1,3", "url": "https://jx.hls.one/?url="},
    ];
    
    let currentIndex = 0;
    let successCounts = {};
    
    // 初始化成功率统计
    if (typeof GM_getValue !== 'undefined') {
        successCounts = GM_getValue('vipParser_successCounts', {});
    }
    
    // 获取最佳解析源
    function getBestParser() {
        let bestIndex = 0;
        let bestSuccessRate = -1;
        
        for (let i = 0; i < videoParseList.length; i++) {
            const successCount = successCounts[i] || 0;
            const successRate = successCount > 0 ? successCount / (successCount + 1) : 0;
            
            if (successRate > bestSuccessRate) {
                bestSuccessRate = successRate;
                bestIndex = i;
            }
        }
        
        currentIndex = bestIndex;
        return {
            index: bestIndex,
            parser: videoParseList[bestIndex]
        };
    }
    
    // 获取下一个解析源
    function getNextParser() {
        currentIndex = (currentIndex + 1) % videoParseList.length;
        return {
            index: currentIndex,
            parser: videoParseList[currentIndex]
        };
    }
    
    // 记录解析成功
    function recordSuccess(index) {
        successCounts[index] = (successCounts[index] || 0) + 1;
        if (typeof GM_setValue !== 'undefined') {
            GM_setValue('vipParser_successCounts', successCounts);
        }
    }
    
    // 暴露公共API
    window.vipParser = {
        getBestParser,
        getNextParser,
        recordSuccess
    };
})();
