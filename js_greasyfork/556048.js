// ==UserScript==
// @name         视频增强移动裁切缩放旋转倍速
// @version      1.1.2
// @description  shift+alt+c切换视频裁切/适应，+z/x放大/缩小，+q/e左/右旋转，+v/b加速减速，+m自定义倍速，+wasd移动，+r恢复。
// @author       dianclar
// @match        *://*/*
// @license      GPL
// @grant        none
// @namespace https://greasyfork.org/users/1538433
// @downloadURL https://update.greasyfork.org/scripts/556048/%E8%A7%86%E9%A2%91%E5%A2%9E%E5%BC%BA%E7%A7%BB%E5%8A%A8%E8%A3%81%E5%88%87%E7%BC%A9%E6%94%BE%E6%97%8B%E8%BD%AC%E5%80%8D%E9%80%9F.user.js
// @updateURL https://update.greasyfork.org/scripts/556048/%E8%A7%86%E9%A2%91%E5%A2%9E%E5%BC%BA%E7%A7%BB%E5%8A%A8%E8%A3%81%E5%88%87%E7%BC%A9%E6%94%BE%E6%97%8B%E8%BD%AC%E5%80%8D%E9%80%9F.meta.js
// ==/UserScript==

;(function () {
    'use strict'
    //可以修改默认视频大小
    let videostyle = 100
    //可以修改默认水平位置
    let locationleft = 0
    //可以修改默认垂直位置
    let locationtop = 0
    //可以修改默认旋转角度
    let rotation = 0
    //可以修改默认播放速度
    let speed = 1
    //可以修改缩放程度
    const stylevalue = 10
    //可以修改移动程度
    const locationvalue = 10
    //可以修改旋转程度
    const rotationvalue = 90
    //可以修改倍速程度
    const speedvalue = 5
    //可以修改是否默认缩放
    let iscover = 1
    //可以修改是否强制模式，性能大幅度下降
    const strong = 0

    const videostylex = videostyle
    const locationleftx = locationleft
    const locationtopx = locationtop
    const rotationx = rotation
    const speedx =speed

    const movd = new MutationObserver((molist) => {
        molist.forEach((moi) => {
            if (moi.target instanceof HTMLVideoElement) {
                movd.disconnect()
                videoplay()
            }
        })
    })

    function videoplay() {
        let videos = document.querySelectorAll('video')
        if (videos.length == 0) {
            movd.observe(document.documentElement, {
                attributes: true,
                attributeFilter: ['preload'],
                subtree: true
            })
            return
        }

        const mocl = new MutationObserver((molist) => {
            molist.forEach((moi) => {
                if (moi.target instanceof HTMLVideoElement) {
                    videos = document.querySelectorAll('video')
                    init()
                }
            })
        })
        let atf = ['preload']
        if (strong == 1) {
            atf.push('style')
        }
        mocl.observe(document.documentElement, {
            attributes: true,
            attributeFilter: atf,
            subtree: true
        })

        let most
        function init() {
            videos.forEach((video) => {
                video.style.position = 'absolute'
                video.style.left = '50%'
                video.style.top = '50%'
                video.style.transform = `translate(${locationleft - 50}%,${locationtop - 50}%) rotate(${rotation}deg)`
                video.style.height = videostyle + '%'
                video.style.width = videostyle + '%'
                video.playbackRate = speed
                if (iscover === 1) {
                    most = new MutationObserver(() => {
                        most.disconnect()
                        video.style.objectFit = 'cover'
                    })

                    video.style.objectFit = 'cover'
                    most.observe(video, {
                        attributes: true,
                        attributeFilter: ['style']
                    })
                }
            })
        }
        init()

        document.addEventListener('keydown', function (event) {
            if (event.shiftKey && event.altKey && event.code === 'KeyC') {
                most.disconnect()
                videos.forEach((video) => {
                    if (video.style.objectFit === 'contain') {
                        video.style.objectFit = 'cover'
                        iscover = 1
                    } else {
                        video.style.objectFit = 'contain'
                        iscover = 0
                    }
                })
            }

            if (event.shiftKey && event.altKey && event.code === 'KeyZ') {
                videostyle += stylevalue
                videos.forEach((video) => {
                    video.style.height = videostyle + '%'
                    video.style.width = videostyle + '%'
                })
            }
            if (event.shiftKey && event.altKey && event.code === 'KeyX') {
                videostyle -= stylevalue
                videos.forEach((video) => {
                    video.style.height = videostyle + '%'
                    video.style.width = videostyle + '%'
                })
            }

            if (event.shiftKey && event.altKey && event.code === 'KeyV') {
                speed += speedvalue * 0.1
                videos.forEach((video) => {
                    video.playbackRate = speed
                })
            }
            if (event.shiftKey && event.altKey && event.code === 'KeyB') {
                speed -= speedvalue * 0.1
                videos.forEach((video) => {
                    video.playbackRate = speed
                })
            }

            if (event.shiftKey && event.altKey && event.code === 'KeyE') {
                rotation += rotationvalue
                videos.forEach((video) => {
                    video.style.transform = `translate(${locationleft - 50}%,${locationtop - 50}%) rotate(${rotation}deg)`
                })
            }
            if (event.shiftKey && event.altKey && event.code === 'KeyQ') {
                rotation -= rotationvalue
                videos.forEach((video) => {
                    video.style.transform = `translate(${locationleft - 50}%,${locationtop - 50}%) rotate(${rotation}deg)`
                })
            }

            if (event.shiftKey && event.altKey && event.code === 'KeyW') {
                locationtop -= locationvalue
                videos.forEach((video) => {
                    video.style.transform = `translate(${locationleft - 50}%,${locationtop - 50}%) rotate(${rotation}deg)`
                })
            }
            if (event.shiftKey && event.altKey && event.code === 'KeyS') {
                locationtop += locationvalue
                videos.forEach((video) => {
                    video.style.transform = `translate(${locationleft - 50}%,${locationtop - 50}%) rotate(${rotation}deg)`
                })
            }
            if (event.shiftKey && event.altKey && event.code === 'KeyA') {
                locationleft -= locationvalue
                videos.forEach((video) => {
                    video.style.transform = `translate(${locationleft - 50}%,${locationtop - 50}%) rotate(${rotation}deg)`
                })
            }
            if (event.shiftKey && event.altKey && event.code === 'KeyD') {
                locationleft += locationvalue
                videos.forEach((video) => {
                    video.style.transform = `translate(${locationleft - 50}%,${locationtop - 50}%) rotate(${rotation}deg)`
                })
            }

            if (event.shiftKey && event.altKey && event.code === 'KeyM') {
                const userInput = prompt("请输入自定义倍速", speed)
                if(!isNaN(userInput)){
                    speed = userInput
                    videos.forEach((video) => {
                        video.playbackRate = speed
                    })
                }
            }

            if (event.shiftKey && event.altKey && event.code === 'KeyR') {
                videostyle = videostylex
                locationleft = locationleftx
                locationtop = locationtopx
                rotation = rotationx
                speed = speedx
                videos.forEach((video) => {
                    video.style.transform = `translate(${locationleft - 50}%,${locationtop - 50}%) rotate(${rotation}deg)`
                    video.style.height = videostyle + '%'
                    video.style.width = videostyle + '%'
                    video.playbackRate = speed
                })
            }
        })
    }
    videoplay()
})()

