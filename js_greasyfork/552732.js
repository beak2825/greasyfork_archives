// ==UserScript==
// @name         奶昔论坛屏蔽黑名单和匿名用户
// @namespace    https://about.naixi.org/
// @version      1.0.0
// @description  自动获取奶昔论坛的黑名单和匿名用户，并屏蔽相应帖子
// @author       Nyarime
// @match        http*://*.naixi.net/*
// @grant        unsafeWindow
// @license      GPL
// @downloadURL https://update.greasyfork.org/scripts/552732/%E5%A5%B6%E6%98%94%E8%AE%BA%E5%9D%9B%E5%B1%8F%E8%94%BD%E9%BB%91%E5%90%8D%E5%8D%95%E5%92%8C%E5%8C%BF%E5%90%8D%E7%94%A8%E6%88%B7.user.js
// @updateURL https://update.greasyfork.org/scripts/552732/%E5%A5%B6%E6%98%94%E8%AE%BA%E5%9D%9B%E5%B1%8F%E8%94%BD%E9%BB%91%E5%90%8D%E5%8D%95%E5%92%8C%E5%8C%BF%E5%90%8D%E7%94%A8%E6%88%B7.meta.js
// ==/UserScript==
 
 
 
(async function () {
    'use strict';
    // 添加遮罩层
    var overlay = document.createElement('div');
    overlay.style.position = 'fixed';
    overlay.style.top = '0';
    overlay.style.left = '0';
    overlay.style.width = '100%';
    overlay.style.height = '100%';
    overlay.style.background = 'rgba(255, 255, 255, 0.98)';
    overlay.style.zIndex = '9999';
    overlay.style.display = 'flex';
    overlay.style.alignItems = 'center';
    overlay.style.justifyContent = 'center';
    var loadingText = document.createElement('p');
    loadingText.style.color = 'rgba(0, 0, 0, 0.95)';
    loadingText.style.fontFamily = 'Arial, sans-serif';
    loadingText.style.fontSize = '80px';
    loadingText.textContent = '净化中，请稍候...';
    overlay.appendChild(loadingText);
    document.body.appendChild(overlay);
    overlay.addEventListener('click', function (event) {
    event.stopPropagation();
    event.preventDefault();
    });
    overlay.addEventListener('wheel', function (event) {
    event.stopPropagation();
    event.preventDefault();
    }, { passive: false });
    overlay.style.pointerEvents = 'auto';
 
    // 移除全部匿名评论
    var commentElements = document.querySelectorAll('table[id^="pid"]');
    // 遍历评论元素并删除匿名用户评论
    commentElements.forEach(function(element) {
      // 获取评论中的用户名
      var username = element.querySelector('.pi').textContent.trim();
      // 判断是否为匿名用户评论
      if (username === '匿名') {
        // 从父元素中移除评论
        element.parentNode.removeChild(element);
      }
    });
 
 
    // 脚本内部使用，在此处修改无效
    var CONFIG = {
        blockList: [],
        blockedPIDs: [],
        blockedCount: 0
    }
 
    // 根据页数获取黑名单
    async function getBlackListByPage(page) {
        let response
        try {
            response = await fetch(`/home.php?mod=space&do=friend&view=blacklist&page=${page}`)
        } catch (e) {
            console.log('获取黑名单失败')
            console.log(e)
            return []
        }
        let html = await response.text()
        let regList = html.match(/<a\shref="space-uid-.+html">([^<].+)<\/a>/g)
        if (!regList) {
            return []
        }
        let blacklist = regList.map(i => i.replace(/<.+?>/g, ''))
        console.log(`获取第${page}页黑名单成功: `)
        console.log(blacklist)
        return blacklist
    }
 
    // 获取黑名单
    let currentPage = 1
    let finish = false
    while (!finish) {
        console.log(`获取第${currentPage}页黑名单`)
        let blacklist = await getBlackListByPage(currentPage)
        if (blacklist.length === 0) {
            finish = true
        }
        else {
            CONFIG.blockList = CONFIG.blockList.concat(blacklist)
            currentPage++
        }
    }
 
    // 移除遮罩层
    overlay.style.display = 'none';
 
    // 帖子列表页面
    var authorNodes = document.querySelectorAll('th + .by cite a')
    authorNodes.forEach(function (item) {
        if (CONFIG.blockList.includes(item.innerText.trim())) {
            var $wrapper = item.parentElement.parentElement.parentElement.parentElement
            var $list = $wrapper.parentElement
            $list.removeChild($wrapper)
            CONFIG.blockedCount++
        }
    })
 
    // 帖子列表点击下一页
    var $postList = document.querySelector('#threadlisttableid')
    if ($postList) {
        var post_mo = new MutationObserver(function (mList) {
            authorNodes = document.querySelectorAll('th + .by cite a')
            authorNodes.forEach(function (item) {
                if (CONFIG.blockList.includes(item.innerText.trim())) {
                    var $wrapper = item.parentElement.parentElement.parentElement.parentElement
                    var $list = $wrapper.parentElement
                    $list.removeChild($wrapper)
                    CONFIG.blockedCount++
                    console.log('Blocked: ' + CONFIG.blockedCount)
                }
            })
        })
        post_mo.observe($postList, {
            childList: true
        })
    }
 
    // 帖子详情页面
    authorNodes = document.querySelectorAll('.authi a.xw1');
    authorNodes.forEach(function (item) {
        if (CONFIG.blockList.includes(item.innerText.trim())) {
            var $wrapper = item.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement
            var id = Number(item.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.id.replace('pid', ''))
            CONFIG.blockedPIDs.push(id)
            var $list = $wrapper.parentElement
            $list.removeChild($wrapper)
            CONFIG.blockedCount++
        }
    })
 
    // 针对隐藏楼层
    if (unsafeWindow.blockedPIDs) {
        CONFIG.blockedPIDs.forEach(function (id) {
            for (var i = 0; i < unsafeWindow.blockedPIDs.length; i++) {
                if (unsafeWindow.blockedPIDs[i] === id) {
                    unsafeWindow.blockedPIDs.splice(i, 1)
                    CONFIG.blockedCount++
                }
            }
        })
 
        if (!unsafeWindow.blockedPIDs.length) {
            document.querySelector('#hiddenpoststip').style.display = 'none'
        }
    }
 
    // 针对点评
    let $specialComments = document.querySelectorAll('.pstl')
    $specialComments.forEach(function (item) {
        let $author = item.querySelector('.psta .xi2')
        if ($author && CONFIG.blockList.includes($author.innerText.trim())) {
            let commentId = item.parentElement.id
            item.parentElement.removeChild(item)
            // 若点评列表无内容，则隐藏点评列表
            if (document.querySelectorAll(`#${commentId} .pstl`).length === 0) {
                document.querySelector(`#${commentId}`).style.display = 'none'
            }
            CONFIG.blockedCount++
        }
    })
})();