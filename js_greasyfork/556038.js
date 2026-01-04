// ==UserScript==
// @name         Lolz.Live Threads Rework
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  Переработка главной страницы
// @author       eretly
// @match        https://lolz.live/*
// @match        https://zelenka.guru/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=lolz.live
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/556038/LolzLive%20Threads%20Rework.user.js
// @updateURL https://update.greasyfork.org/scripts/556038/LolzLive%20Threads%20Rework.meta.js
// ==/UserScript==

;(() => {
    let isProcessing = false
    const loadedThreads = new Set()
    const threadCleanupMap = new Map()

    const style = document.createElement('style')
    style.textContent = `
    .discussionListMainPage .separator {
      width: 4px !important;
      height: 4px !important;
      min-width: 4px !important;
      min-height: 4px !important;
      background: #949494 !important;
      border-radius: 50% !important;
      margin: 0 8px !important;
      display: inline-block !important;
      vertical-align: middle !important;
      opacity: 1 !important;
    }

    .thread-side-controls {
      position: absolute;
      top: 50%;
      right: 16px;
      transform: translateY(-50%);
      display: flex;
      gap: 12px;
      align-items: center;
      z-index: 10;
      opacity: 0.9;
    }

    .thread-side-controls .counter {
      display: flex !important;
      align-items: center !important;
      font-size: 14px !important;
      font-weight: 600 !important;
      border-radius: 20px !important;
      padding: 0 13px 0 5px !important;
      transition: all 0.1s ease-in-out !important;
      text-decoration: none !important;
      cursor: pointer !important;
    }

    .thread-side-controls .counter.MainPageReply {
      background: #363636 !important;
      color: #d6d6d6 !important;
    }

    .thread-side-controls .counter[style*="opacity: 0.6"],
    .thread-side-controls .counter.MainPageReply[style*="opacity: 0.6"] {
      opacity: 0.6 !important;
      background: #363636 !important;
      color: #d6d6d6 !important;
      cursor: default !important;
    }

    .thread-side-controls .counter.like {
      background: #363636 !important;
      color: #d6d6d6 !important;
    }

    .thread-side-controls .counter.like .icon-counter-main-likes,
    .thread-side-controls .counter.like .LikeLabel {
      color: #d6d6d6 !important;
    }

    .thread-side-controls .counter.unlike {
      background: #273B32 !important;
      color: #5FAD7C !important;
    }

    .thread-side-controls .counter.unlike .icon-counter-main-likes,
    .thread-side-controls .counter.unlike .LikeLabel {
      color: #5FAD7C !important;
    }

    .thread-side-controls .counter.unlike .icon-counter-main-likes {
      color: transparent !important;
      background-image: url("data:image/svg+xml,%3Csvg width='24' height='24' viewBox='0 0 24 24' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M3 9C2.4 9 2 9.40336 2 10.0084V19.9916C2 20.5966 2.4 21 3 21C3.6 21 4 20.5966 4 19.9916V10.0084C4 9.40336 3.6 9 3 9Z' fill='url(%23paint0_radial_2144_554)'/%3E%3Cpath d='M19.7013 8.86869H13.4583L14.6666 5.23232C15.1701 3.71717 13.9618 2 12.25 2C11.5451 2 10.8403 2.30303 10.4375 2.80808L6.00694 7.85859C5.40278 8.56566 5 9.47475 5 10.3838V19.6768C5 20.9899 6.00694 22 7.31596 22H16.6805C17.9895 22 19.1979 21.0909 19.6006 19.7778L21.9166 11.899C22.3194 10.3838 21.2117 8.86869 19.7013 8.86869Z' fill='url(%23paint1_radial_2144_554)'/%3E%3Cdefs%3E%3CradialGradient id='paint0_radial_2144_554' cx='0' cy='0' r='1' gradientTransform='matrix(1.36364 8.7 -1.45 9.9 2.5 11.1)' gradientUnits='userSpaceOnUse'%3E%3Cstop stop-color='%2300BA78'/%3E%3Cstop offset='1' stop-color='%2306734D'/%3E%3C/radialGradient%3E%3CradialGradient id='paint1_radial_2144_554' cx='0' cy='0' r='1' gradientTransform='matrix(11.5909 14.5 -12.325 16.5 9.25 5.5)' gradientUnits='userSpaceOnUse'%3E%3Cstop stop-color='%2300BA78'/%3E%3Cstop offset='1' stop-color='%2306734D'/%3E%3C/radialGradient%3E%3C/defs%3E%3C/svg%3E%0A") !important;
      background-size: 20px 20px !important;
      background-repeat: no-repeat !important;
      background-position: center !important;
    }

    .thread-side-controls .counter.unlike .icon-counter-main-likes.likeCounterIcon {
      color: transparent !important;
      background-image: url("data:image/svg+xml,%3Csvg width='24' height='24' viewBox='0 0 24 24' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath fill-rule='evenodd' clip-rule='evenodd' d='M1 9.48C1 5.97111 3.65774 2 7.88889 2C9.71593 2 11.0661 2.7105 12 3.51082C12.9339 2.7105 14.2841 2 16.1111 2C20.3423 2 23 5.97111 23 9.48C23 11.3254 22.2854 13.0297 21.293 14.5091C20.2998 15.9897 18.9924 17.2999 17.7111 18.3798C16.4261 19.4629 15.1397 20.3372 14.1636 20.9411C13.6749 21.2435 13.2596 21.4807 12.9558 21.6447C12.8047 21.7263 12.6762 21.7924 12.5771 21.8404C12.5289 21.8637 12.4787 21.8871 12.4229 21.8404C12.3238 21.7924 12.1953 21.7263 12.0442 21.6447C11.7404 21.4807 11.3251 21.2435 10.8364 20.9411C9.86037 20.3372 8.57405 19.4629 7.289 18.3798C6.0077 17.2999 4.70034 15.9897 3.70715 14.5091C2.71476 13.0297 1 11.3254 1 9.48Z' fill='url(%23paint0_radial_2144_551)'/%3E%3Cdefs%3E%3CradialGradient id='paint0_radial_2144_551' cx='0' cy='0' r='1' gradientUnits='userSpaceOnUse' gradientTransform='translate(6.5 5.5) rotate(44.029) scale(20.8626 22.9489)'%3E%3Cstop stop-color='%2300BA78'/%3E%3Cstop offset='1' stop-color='%2306734D'/%3E%3C/radialGradient%3E%3C/defs%3E%3C/svg%3E%0A") !important;
      background-size: 18px 18px !important;
      background-repeat: no-repeat !important;
      background-position: center !important;
    }

    .thread-side-controls .counter.MainPageReply:hover .postCounterIcon {
      background-image: url("data:image/svg+xml,%3Csvg width='24' height='24' viewBox='0 0 24 24' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath opacity='0.12' d='M21 12C21 16.9706 16.9706 21 12 21C10.8029 21 9.6603 20.7663 8.61549 20.3419C8.41552 20.2607 8.31554 20.2201 8.23472 20.202C8.15566 20.1843 8.09715 20.1778 8.01613 20.1778C7.9333 20.1778 7.84309 20.1928 7.66265 20.2229L4.10476 20.8159C3.73218 20.878 3.54589 20.909 3.41118 20.8512C3.29328 20.8007 3.19933 20.7067 3.14876 20.5888C3.09098 20.4541 3.12203 20.2678 3.18413 19.8952L3.77711 16.3374C3.80718 16.1569 3.82222 16.0667 3.82221 15.9839C3.8222 15.9028 3.81572 15.8443 3.798 15.7653C3.77988 15.6845 3.73927 15.5845 3.65806 15.3845C3.23374 14.3397 3 13.1971 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z' fill='%2300BA78'/%3E%3Cpath d='M8 9.5H12M8 13H15M12 21C16.9706 21 21 16.9706 21 12C21 7.02944 16.9706 3 12 3C7.02944 3 3 7.02944 3 12C3 13.1971 3.23374 14.3397 3.65806 15.3845C3.73927 15.5845 3.77988 15.6845 3.798 15.7653C3.81572 15.8443 3.8222 15.9028 3.82221 15.9839C3.82222 16.0667 3.80718 16.1569 3.77711 16.3374L3.18413 19.8952C3.12203 20.2678 3.09098 20.4541 3.14876 20.5888C3.19933 20.7067 3.29328 20.8007 3.41118 20.8512C3.54589 20.909 3.73218 20.878 4.10476 20.8159L7.66265 20.2229C7.84309 20.1928 7.9333 20.1778 8.01613 20.1778C8.09715 20.1778 8.15566 20.1843 8.23472 20.202C8.31554 20.2201 8.41552 20.2607 8.61549 20.3419C9.6603 20.7663 10.8029 21 12 21Z' stroke='%2300BA78' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E%0A") !important;
    }

    .thread-side-controls .counter.like:hover .icon-counter-main-likes:not(.likeCounterIcon) {
      background-image: url("data:image/svg+xml,%3Csvg width='24' height='24' viewBox='0 0 24 24' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M3 21C2.4 21 2 20.6 2 20V11C2 10.4 2.4 10 3 10C3.6 10 4 10.4 4 11V20C4 20.6 3.6 21 3 21Z' fill='%2300BA78'/%3E%3Cpath d='M16.2759 22H8.0396C6.37272 22 5 20.6 5 18.9V10.5C5 9.4 5.39221 8.4 6.07857 7.5L10.0006 3C10.5889 2.4 11.4714 2 12.4519 2C13.5305 2 14.4129 2.5 15.0013 3.3C15.5896 4.2 15.7857 5.2 15.4915 6.2L14.9032 8.1H19.0214C20.0019 8.1 20.8843 8.5 21.3746 9.3C21.9629 10.1 22.159 11.1 21.8649 12L19.8058 19.1C19.3155 20.9 17.9428 22 16.2759 22Z' fill='%2300BA78' fill-opacity='0.12'/%3E%3Cpath d='M16.2759 22H8.0396C6.37272 22 5 20.6 5 18.9V10.5C5 9.4 5.39221 8.4 6.07857 7.5L10.0006 3C10.5889 2.4 11.4714 2 12.4519 2C13.5305 2 14.4129 2.5 15.0013 3.3C15.5896 4.2 15.7857 5.2 15.4915 6.2L14.9032 8.1H19.0214C20.0019 8.1 20.8843 8.5 21.3746 9.3C21.9629 10.1 22.159 11.1 21.8649 12L19.8058 19.1C19.3155 20.9 17.9428 22 16.2759 22ZM7.64739 8.9C7.25518 9.4 7.05908 9.9 7.05908 10.5V18.9C7.05908 19.5 7.54934 20 8.13765 20H16.374C17.1584 20 17.8447 19.5 18.0408 18.7L20.0019 11.6C20.0999 11.3 20.0019 10.9 19.8058 10.6C19.6097 10.3 19.3155 10.2 19.0214 10.2H13.5305C13.2363 10.2 12.9422 10 12.7461 9.8C12.55 9.6 12.55 9.2 12.648 8.9L13.7266 5.6C13.8246 5.2 13.8246 4.8 13.5305 4.5C13.1383 3.9 12.1578 3.8 11.6675 4.4L7.64739 8.9Z' fill='%2300BA78'/%3E%3C/svg%3E%0A");
    }

    .thread-side-controls .counter.like:hover .icon-counter-main-likes.likeCounterIcon {
      background-image: url("data:image/svg+xml,%3Csvg width='24' height='24' viewBox='0 0 24 24' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath opacity='0.12' d='M16.1111 3C19.6333 3 22 6.3525 22 9.48C22 15.8138 12.1778 21 12 21C11.8222 21 2 15.8138 2 9.48C2 6.3525 4.36667 3 7.88889 3C9.91111 3 11.2333 4.02375 12 4.92375C12.7667 4.02375 14.0889 3 16.1111 3Z' fill='%2300BA78'/%3E%3Cpath d='M16.1111 3C19.6333 3 22 6.3525 22 9.48C22 15.8138 12.1778 21 12 21C11.8222 21 2 15.8138 2 9.48C2 6.3525 4.36667 3 7.88889 3C9.91111 3 11.2333 4.02375 12 4.92375C12.7667 4.02375 14.0889 3 16.1111 3Z' stroke='%2300BA78' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E%0A") !important;
    }

   .thread-toggle-icon {
      font-size: 14px;
      color: #888;
      cursor: pointer;
      opacity: 1;
      transition: all 0.2s ease;
      user-select: none;
      padding: 16px 13px;
      margin: -16px -13px;
    }
  `
    document.head.appendChild(style)

    function updatePadding(threadHeaderTitle, sideControls) {
        const controlsWidth = sideControls.offsetWidth
        const padding = controlsWidth + 15
        threadHeaderTitle.style.paddingRight = `${padding}px`
        threadHeaderTitle.style.maxWidth = `calc(100% - ${padding}px)`

        const threadHeaderBottom = threadHeaderTitle.parentElement.querySelector(".threadHeaderBottom")
        if (threadHeaderBottom) {
            threadHeaderBottom.style.paddingRight = `${padding}px`
            threadHeaderBottom.style.maxWidth = `calc(100% - ${padding}px)`
        }
    }

    function createToggleButton(thread) {
        if (thread.querySelector(".thread-toggle-icon")) return

        const threadMessage = thread.querySelector(".threadMessage")
        if (!threadMessage) return

        const threadId = thread.getAttribute("data-threadid") || thread.id

        if (threadCleanupMap.has(threadId)) {
            const cleanup = threadCleanupMap.get(threadId)
            cleanup()
            threadCleanupMap.delete(threadId)
        }

        const cleanupFunctions = []

        const sideControls = document.createElement("div")
        sideControls.className = "thread-side-controls"

        const toggleIcon = document.createElement("span")
        toggleIcon.className = "thread-toggle-icon fas fa-chevron-down"

        const originalThreadInfo = thread.querySelector(".threadInfo")
        if (originalThreadInfo) {
            const originalCounters = originalThreadInfo.querySelector(".threadCounters")
            if (originalCounters) {
                const likeButton = originalCounters.querySelector(".LikeLink")
                let replyButton = originalCounters.querySelector(".MainPageReply")

                if (!replyButton) {
                    const counters = originalCounters.querySelectorAll(".counter")
                    counters.forEach((counter) => {
                        if (counter.querySelector(".postCounterIcon")) {
                            replyButton = counter
                        }
                    })
                }

                if (likeButton) {
                    const likeClone = likeButton.cloneNode(true)
                    if (likeButton.hasAttribute('title')) {
                        likeClone.setAttribute('title', likeButton.getAttribute('title'))
                    }
                    if (likeButton.hasAttribute('data-cachedtitle')) {
                        likeClone.setAttribute('data-cachedtitle', likeButton.getAttribute('data-cachedtitle'))
                    }

                    const likeClickHandler = (e) => {
                        e.preventDefault()
                        e.stopPropagation()
                        e.stopImmediatePropagation()
                        likeButton.click()
                    }
                    likeClone.addEventListener('click', likeClickHandler, true)
                    cleanupFunctions.push(() => likeClone.removeEventListener('click', likeClickHandler, true))

                    sideControls.appendChild(likeClone)

                    setTimeout(() => {
                        if (typeof $ !== 'undefined' && $(likeClone).tooltip) {
                            $(likeClone).tooltip()
                        }
                    }, 0)

                    const syncLike = new MutationObserver(() => {
                        likeClone.className = likeButton.className
                        const originalValue = likeButton.querySelector('.value')
                        const cloneValue = likeClone.querySelector('.value')
                        if (originalValue && cloneValue) {
                            cloneValue.textContent = originalValue.textContent
                        }
                        if (likeButton.hasAttribute('title')) {
                            likeClone.setAttribute('title', likeButton.getAttribute('title'))
                        }
                        if (likeButton.hasAttribute('data-cachedtitle')) {
                            likeClone.setAttribute('data-cachedtitle', likeButton.getAttribute('data-cachedtitle'))
                        }
                    })
                    syncLike.observe(likeButton, { attributes: true, childList: true, subtree: true })
                }

                if (replyButton) {
                    const replyClone = replyButton.cloneNode(true)
                    if (replyButton.hasAttribute('title')) {
                        replyClone.setAttribute('title', replyButton.getAttribute('title'))
                    }
                    if (replyButton.hasAttribute('data-cachedtitle')) {
                        replyClone.setAttribute('data-cachedtitle', replyButton.getAttribute('data-cachedtitle'))
                    }

                    const replyClickHandler = (e) => {
                        e.preventDefault()
                        e.stopPropagation()
                        e.stopImmediatePropagation()
                        replyButton.click()
                    }
                    replyClone.addEventListener('click', replyClickHandler, true)
                    cleanupFunctions.push(() => replyClone.removeEventListener('click', replyClickHandler, true))

                    sideControls.appendChild(replyClone)

                    setTimeout(() => {
                        if (typeof XenForo !== 'undefined' && XenForo.activate) {
                            XenForo.activate(replyClone)
                        }
                        if (typeof $ !== 'undefined' && $(replyClone).tooltip) {
                            $(replyClone).tooltip()
                        }
                    }, 0)

                    const syncReply = new MutationObserver(() => {
                        const originalValue = replyButton.querySelector('.value')
                        const cloneValue = replyClone.querySelector('.value')
                        if (originalValue && cloneValue) {
                            cloneValue.textContent = originalValue.textContent
                        }
                        if (replyButton.style.opacity) {
                            replyClone.style.opacity = replyButton.style.opacity
                        }
                        if (replyButton.hasAttribute('title')) {
                            replyClone.setAttribute('title', replyButton.getAttribute('title'))
                        }
                        if (replyButton.hasAttribute('data-cachedtitle')) {
                            replyClone.setAttribute('data-cachedtitle', replyButton.getAttribute('data-cachedtitle'))
                        }
                    })
                    syncReply.observe(replyButton, { attributes: true, childList: true, subtree: true })
                }
            }
        }

        sideControls.insertBefore(toggleIcon, sideControls.firstChild)

        const separator = thread.querySelector(".threadSeperator")
        const threadLastPost = thread.querySelector(".threadLastPost")

        threadMessage.style.maxHeight = "0"
        threadMessage.style.overflow = "hidden"
        threadMessage.style.opacity = "0"
        threadMessage.style.display = "block"

        let isExpanded = false
        let resizeObserver = null

        const hideButton = document.createElement("div")
        hideButton.className = "thread-hide-button"
        hideButton.textContent = "Скрыть тему"
        hideButton.style.cssText = `
            text-align: center;
            padding: 0px;
            margin-top: 0px;
            color: #888;
            font-size: 13px;
            cursor: pointer;
            user-select: none;
            max-height: 0;
            opacity: 0;
            overflow: hidden;
            display: block;
            border-top: 1px solid rgba(136, 136, 136, 0);
        `

        const hideButtonMouseEnter = () => {
            if (isExpanded) {
                hideButton.style.color = "#666"
            }
        }

        const hideButtonMouseLeave = () => {
            if (isExpanded) {
                hideButton.style.color = "#888"
            }
        }

        const hideButtonClick = (e) => {
            e.stopPropagation()

            if (!isExpanded) {
                toggleIcon.click()
                setTimeout(() => {
                    toggleIcon.click()
                }, 300)
                return
            }

            const toggleIconRect = toggleIcon.getBoundingClientRect()
            const isToggleIconVisible = toggleIconRect.top >= 0 && toggleIconRect.bottom <= window.innerHeight

            if (!isToggleIconVisible) {
                const prevThread = thread.previousElementSibling
                let targetElement = thread

                if (prevThread && prevThread.classList.contains("discussionListItem")) {
                    targetElement = prevThread
                }

                const threadRect = targetElement.getBoundingClientRect()
                const scrollTop = window.pageYOffset || document.documentElement.scrollTop
                const threadTop = threadRect.top + scrollTop
                const targetScroll = threadTop - 80

                const startScroll = scrollTop
                const distance = targetScroll - startScroll
                const duration = 300
                const startTime = performance.now()

                function animateScroll(currentTime) {
                    const elapsed = currentTime - startTime
                    const progress = Math.min(elapsed / duration, 1)

                    const easeProgress = progress < 0.5 ? 2 * progress * progress : 1 - Math.pow(-2 * progress + 2, 2) / 2

                    window.scrollTo(0, startScroll + distance * easeProgress)

                    if (progress < 1) {
                        requestAnimationFrame(animateScroll)
                    }
                }

                requestAnimationFrame(animateScroll)
            }

            toggleIcon.click()
        }

        hideButton.addEventListener("mouseenter", hideButtonMouseEnter)
        hideButton.addEventListener("mouseleave", hideButtonMouseLeave)
        hideButton.addEventListener("click", hideButtonClick)

        cleanupFunctions.push(() => {
            hideButton.removeEventListener("mouseenter", hideButtonMouseEnter)
            hideButton.removeEventListener("mouseleave", hideButtonMouseLeave)
            hideButton.removeEventListener("click", hideButtonClick)
        })

        const toggleIconClick = async (e) => {
            e.stopPropagation()

            if (!isExpanded && !loadedThreads.has(threadId)) {
                loadedThreads.add(threadId)
            }

            isExpanded = !isExpanded

            const threadHeaderTitle = thread.querySelector(".threadHeaderTitle")
            const threadHeaderBottom = thread.querySelector(".threadHeaderBottom")
            const threadInfo = thread.querySelector(".threadInfo")
            const controls = thread.querySelector(".controls")

            if (isExpanded) {
                toggleIcon.style.transform = "rotate(180deg)"

                threadMessage.style.transition = "max-height 0.3s ease, opacity 0.3s ease"
                threadMessage.style.maxHeight = threadMessage.scrollHeight + "px"
                threadMessage.style.opacity = "1"

                if (threadInfo) {
                    threadInfo.style.display = "flex"
                    threadInfo.style.overflow = "hidden"
                    threadInfo.style.maxHeight = "0"
                    threadInfo.style.opacity = "0"
                    threadInfo.style.paddingTop = "0"
                    threadInfo.style.paddingBottom = "0"
                    threadInfo.style.borderTop = "1px solid rgba(136, 136, 136, 0)"

                    threadInfo.offsetHeight

                    requestAnimationFrame(() => {
                        threadInfo.style.transition = "max-height 0.15s ease, opacity 0.15s ease, padding 0.15s ease, border-color 0.15s ease"
                        threadInfo.style.maxHeight = "500px"
                        threadInfo.style.opacity = "1"
                        threadInfo.style.paddingTop = "12px"
                        threadInfo.style.paddingBottom = "12px"
                        threadInfo.style.borderTop = "1px solid rgba(136, 136, 136, 0.15)"

                        const threadLink = thread.querySelector('.threadHeaderTitle a')
                        if (threadLink) {
                            const threadUrl = threadLink.href

                            const threadInfoClickHandler = (e) => {
                                if (e.target.tagName === 'A' ||
                                    e.target.closest('a') ||
                                    e.target.tagName === 'BUTTON' ||
                                    e.target.closest('button') ||
                                    e.target.classList.contains('counter') ||
                                    e.target.closest('.counter')) {
                                    return
                                }

                                window.location.href = threadUrl
                            }

                            threadInfo.style.cursor = 'pointer'
                            threadInfo.addEventListener('click', threadInfoClickHandler)
                            cleanupFunctions.push(() => threadInfo.removeEventListener('click', threadInfoClickHandler))
                        }
                    })
                }

                requestAnimationFrame(() => {
                    hideButton.style.transition = "max-height 0.15s ease, opacity 0.15s ease, padding 0.15s ease, border-color 0.15s ease"
                    hideButton.style.maxHeight = "50px"
                    hideButton.style.opacity = "1"
                    hideButton.style.padding = "6px"
                    hideButton.style.borderTopColor = "rgba(136, 136, 136, 0.15)"
                })

                if (controls) {
                    controls.classList.remove("showOnHover")
                    controls.style.display = "inline"
                }

                if (threadHeaderTitle) {
                    threadHeaderTitle.style.whiteSpace = "normal"
                    threadHeaderTitle.style.overflow = "visible"
                }

                if (threadHeaderBottom) {
                    threadHeaderBottom.style.whiteSpace = "normal"
                    threadHeaderBottom.style.overflow = "visible"
                }

                async function waitForImages() {
                    const images = threadMessage.querySelectorAll("img")
                    const imagePromises = []

                    images.forEach((img) => {
                        if (img.classList.contains('icon') || img.classList.contains('emoji') || img.classList.contains('mceSmilie')) {
                            return
                        }

                        if (!img.complete) {
                            imagePromises.push(
                                new Promise((resolve) => {
                                    img.addEventListener("load", resolve, { once: true })
                                    img.addEventListener("error", resolve, { once: true })
                                    setTimeout(resolve, 5000)
                                })
                            )
                        }
                    })

                    await Promise.all(imagePromises)

                    if (isExpanded) {
                        threadMessage.style.maxHeight = threadMessage.scrollHeight + "px"
                    }
                }

                setTimeout(async () => {
                    const quoteExpands = threadMessage.querySelectorAll(".quoteExpand.quoteCut")
                    quoteExpands.forEach((quoteExpand) => {
                        if (quoteExpand && quoteExpand.offsetParent !== null) {
                            quoteExpand.click()
                        }
                    })

                    const images = threadMessage.querySelectorAll("img")
                    images.forEach((img) => {
                        if (img.classList.contains('icon') || img.classList.contains('emoji')) {
                            return
                        }

                        const parent = img.parentElement
                        if (parent && parent.tagName === 'A') {
                            return
                        }

                        const imageUrl = img.getAttribute('data-url') || img.getAttribute('src')
                        if (imageUrl && imageUrl.includes('nztcdn.com')) {
                            const link = document.createElement('a')
                            link.href = imageUrl.split('?')[0]
                            link.className = 'LbTrigger'
                            link.setAttribute('data-href', 'misc/lightbox')
                            link.setAttribute('data-fancybox', 'gallery')

                            img.parentElement.insertBefore(link, img)
                            link.appendChild(img)
                        }
                    })

                    if (typeof XenForo !== 'undefined' && XenForo.activate) {
                        XenForo.activate(threadMessage)
                    }

                    if (typeof $ !== 'undefined' && $.fancybox) {
                        const triggers = threadMessage.querySelectorAll('[data-fancybox="gallery"]')
                        if (triggers.length > 0) {
                            $(triggers).fancybox({
                                loop: true,
                                buttons: ['zoom', 'slideShow', 'fullScreen', 'close']
                            })
                        }
                    }

                    await waitForImages()
                }, 300)

                if (separator) separator.style.display = "none"

                if (!resizeObserver) {
                    resizeObserver = new ResizeObserver(() => {
                        if (isExpanded && threadMessage.style.opacity === "1") {
                            threadMessage.style.maxHeight = threadMessage.scrollHeight + "px"
                            if (threadInfo && threadInfo.style.opacity === "1") {
                                threadInfo.style.maxHeight = threadInfo.scrollHeight + "px"
                            }
                        }
                    })
                    resizeObserver.observe(threadMessage)
                }

                const spoilerButtons = threadMessage.querySelectorAll(".bbCodeSpoilerButton, .ToggleTrigger")
                spoilerButtons.forEach((button) => {
                    const spoilerClickHandler = () => {
                        setTimeout(() => {
                            if (isExpanded) {
                                threadMessage.style.maxHeight = threadMessage.scrollHeight + "px"
                            }
                        }, 300)
                    }
                    button.addEventListener("click", spoilerClickHandler)
                    cleanupFunctions.push(() => button.removeEventListener("click", spoilerClickHandler))
                })
            } else {
                toggleIcon.style.transform = "rotate(0deg)"

                threadMessage.style.transition = "max-height 0.3s ease, opacity 0.3s ease"
                threadMessage.style.maxHeight = "0"
                threadMessage.style.opacity = "0"

                if (resizeObserver) {
                    resizeObserver.disconnect()
                    resizeObserver = null
                }

                if (threadInfo) {
                    threadInfo.style.transition = "max-height 0.3s ease, opacity 0.3s ease, padding 0.3s ease, border-color 0.3s ease"
                    threadInfo.style.maxHeight = "0"
                    threadInfo.style.opacity = "0"
                    threadInfo.style.paddingTop = "0"
                    threadInfo.style.paddingBottom = "0"
                    threadInfo.style.borderTop = "1px solid rgba(136, 136, 136, 0)"

                    setTimeout(() => {
                        if (!isExpanded) {
                            threadInfo.style.display = "none"
                        }
                    }, 300)
                }

                hideButton.style.transition = "max-height 0.3s ease, opacity 0.3s ease, padding 0.3s ease, border-color 0.3s ease"
                hideButton.style.maxHeight = "0"
                hideButton.style.opacity = "0"
                hideButton.style.padding = "0px"
                hideButton.style.borderTopColor = "rgba(136, 136, 136, 0)"

                if (controls) {
                    controls.classList.add("showOnHover")
                    controls.style.display = ""
                }

                if (threadHeaderTitle) {
                    threadHeaderTitle.style.overflow = "hidden"
                    threadHeaderTitle.style.textOverflow = "ellipsis"
                    threadHeaderTitle.style.whiteSpace = "nowrap"
                }

                if (threadHeaderBottom) {
                    threadHeaderBottom.style.overflow = "hidden"
                    threadHeaderBottom.style.textOverflow = "ellipsis"
                    threadHeaderBottom.style.whiteSpace = "nowrap"
                }

                if (separator) separator.style.display = "none"
            }
        }

        toggleIcon.addEventListener("click", toggleIconClick)
        cleanupFunctions.push(() => toggleIcon.removeEventListener("click", toggleIconClick))

        const threadHeader = thread.querySelector(".threadHeader")
        if (threadHeader) {
            threadHeader.style.position = "relative"
            threadHeader.appendChild(sideControls)

            setTimeout(() => {
                if (typeof XenForo !== 'undefined' && XenForo.activate) {
                    XenForo.activate(sideControls)
                }
                if (typeof $ !== 'undefined' && $.fn.tooltip) {
                    $(sideControls).find('.Tooltip').tooltip()
                }
            }, 50)

            const threadHeaderTitle = thread.querySelector(".threadHeaderTitle")
            if (threadHeaderTitle) {
                setTimeout(() => updatePadding(threadHeaderTitle, sideControls), 0)
            }
        }

        const threadInfo = thread.querySelector(".threadInfo")
        if (threadInfo && threadInfo.parentElement) {
            threadInfo.parentElement.insertBefore(hideButton, threadInfo.nextSibling)
        }

        threadCleanupMap.set(threadId, () => {
            if (resizeObserver) {
                resizeObserver.disconnect()
                resizeObserver = null
            }
            cleanupFunctions.forEach(fn => fn())
        })
    }

    function cleanThreads() {
        if (isProcessing) return
        isProcessing = true

        setTimeout(() => {
            isProcessing = false
        }, 100)

        const latestThreadsContainer = document.querySelector(".latestThreads._insertLoadedContent")
        if (!latestThreadsContainer) return

        const threads = latestThreadsContainer.querySelectorAll(".discussionListItem")

        threads.forEach((thread) => {
            if (thread.dataset.cleaned) return
            thread.dataset.cleaned = "true"

            const threadMessage = thread.querySelector(".threadMessage")
            if (threadMessage) threadMessage.style.display = "none"

            const separator = thread.querySelector(".threadSeperator")
            if (separator) separator.style.display = "none"

            const threadLastPost = thread.querySelector(".threadLastPost")
            if (threadLastPost) threadLastPost.style.display = "none"

            const replySubmit = thread.querySelector(".replySubmit")
            if (replySubmit) replySubmit.style.display = "none"

            createToggleButton(thread)

            const threadInfo = thread.querySelector(".threadInfo")
            if (threadInfo) {
                const controlsPrefixTop = thread.querySelector(".controls_prefixes")
                if (controlsPrefixTop && !threadInfo.contains(controlsPrefixTop)) {
                    controlsPrefixTop.style.display = "none"
                }

                threadInfo.style.display = "none"
                threadInfo.style.maxHeight = "0"
                threadInfo.style.opacity = "0"
                threadInfo.style.paddingTop = "0"
                threadInfo.style.paddingBottom = "0"
                threadInfo.style.overflow = "hidden"
                threadInfo.style.transition = "max-height 0.3s ease, opacity 0.3s ease, padding 0.3s ease, border-color 0.3s ease"
                threadInfo.style.position = "static"
                threadInfo.style.borderTop = "1px solid rgba(136, 136, 136, 0)"
            }

            const threadHeader = thread.querySelector(".threadHeader")
            const threadHeaderTitle = thread.querySelector(".threadHeaderTitle")
            const threadHeaderBottom = thread.querySelector(".threadHeaderBottom")

            if (threadHeader && threadHeaderTitle && !threadHeader.dataset.hoverSetup) {
                threadHeader.dataset.hoverSetup = "true"

                threadHeaderTitle.style.overflow = "hidden"
                threadHeaderTitle.style.textOverflow = "ellipsis"
                threadHeaderTitle.style.whiteSpace = "nowrap"
                threadHeaderTitle.style.display = "block"

                if (threadHeaderBottom) {
                    threadHeaderBottom.style.display = "block"
                    threadHeaderBottom.style.overflow = "hidden"
                    threadHeaderBottom.style.textOverflow = "ellipsis"
                    threadHeaderBottom.style.whiteSpace = "nowrap"
                    threadHeaderBottom.style.color = "#949494"

                    const threadCreatorDiv = threadHeaderBottom.querySelector(".thread_creator_mobile_hidden")
                    if (threadCreatorDiv) {
                        threadCreatorDiv.style.display = "inline"
                    }

                    const threadLink = thread.querySelector('.threadHeaderTitle a')
                    if (threadLink && !threadHeaderBottom.dataset.clickSetup) {
                        threadHeaderBottom.dataset.clickSetup = "true"
                        const threadUrl = threadLink.href

                        const threadHeaderBottomClickHandler = (e) => {
                            const selection = window.getSelection()
                            if (selection && selection.toString().length > 0) {
                                return
                            }

                            if (e.target.tagName === 'A' ||
                                e.target.closest('a') ||
                                e.target.classList.contains('username') ||
                                e.target.closest('.username')) {
                                return
                            }

                            if (e.target !== threadHeaderBottom) {
                                return
                            }

                            window.location.href = threadUrl
                        }

                        threadHeaderBottom.style.cursor = 'pointer'
                        threadHeaderBottom.addEventListener('click', threadHeaderBottomClickHandler)
                    }
                }

                const threadHeaderMouseEnter = () => {
                    const isThreadExpanded = thread.querySelector(".thread-toggle-icon")?.style.transform === "rotate(180deg)"

                    if (isThreadExpanded) {
                        threadHeaderTitle.style.whiteSpace = "normal"
                        threadHeaderTitle.style.overflow = "visible"
                        if (threadHeaderBottom) {
                            threadHeaderBottom.style.whiteSpace = "normal"
                            threadHeaderBottom.style.overflow = "visible"
                        }
                    }
                }

                const threadHeaderMouseLeave = () => {
                    const isThreadExpanded = thread.querySelector(".thread-toggle-icon")?.style.transform === "rotate(180deg)"

                    if (!isThreadExpanded) {
                        threadHeaderTitle.style.overflow = "hidden"
                        threadHeaderTitle.style.textOverflow = "ellipsis"
                        threadHeaderTitle.style.whiteSpace = "nowrap"
                        if (threadHeaderBottom) {
                            threadHeaderBottom.style.overflow = "hidden"
                            threadHeaderBottom.style.textOverflow = "ellipsis"
                            threadHeaderBottom.style.whiteSpace = "nowrap"
                        }
                    }
                }

                threadHeader.addEventListener("mouseenter", threadHeaderMouseEnter)
                threadHeader.addEventListener("mouseleave", threadHeaderMouseLeave)
            }

            const hideThreadButton = thread.querySelector('.HideThread')
            if (hideThreadButton && !hideThreadButton.dataset.scrollSetup) {
                hideThreadButton.dataset.scrollSetup = "true"

                const hideThreadClickHandler = (e) => {
                    setTimeout(() => {
                        const prevThread = thread.previousElementSibling
                        let targetElement = thread

                        if (prevThread && prevThread.classList.contains("discussionListItem")) {
                            targetElement = prevThread
                        }

                        const threadRect = targetElement.getBoundingClientRect()
                        const scrollTop = window.pageYOffset || document.documentElement.scrollTop
                        const threadTop = threadRect.top + scrollTop
                        const targetScroll = threadTop - 80

                        const startScroll = scrollTop
                        const distance = targetScroll - startScroll
                        const duration = 300
                        const startTime = performance.now()

                        function animateScroll(currentTime) {
                            const elapsed = currentTime - startTime
                            const progress = Math.min(elapsed / duration, 1)

                            const easeProgress = progress < 0.5
                            ? 2 * progress * progress
                            : 1 - Math.pow(-2 * progress + 2, 2) / 2

                            window.scrollTo(0, startScroll + distance * easeProgress)

                            if (progress < 1) {
                                requestAnimationFrame(animateScroll)
                            }
                        }

                        requestAnimationFrame(animateScroll)
                    }, 100)
                }

                hideThreadButton.addEventListener('click', hideThreadClickHandler)
            }
        })
    }

    cleanThreads()

    let timeoutId = null
    const observer = new MutationObserver(() => {
        clearTimeout(timeoutId)
        timeoutId = setTimeout(() => {
            cleanThreads()
        }, 150)
    })

    const threadsRoot = document.querySelector('.latestThreads._insertLoadedContent');

    if (threadsRoot) {
        observer.observe(threadsRoot, {
            childList: true,
            subtree: true,
        });
    }

    window.addEventListener('beforeunload', () => {
        threadCleanupMap.forEach(cleanup => cleanup())
        threadCleanupMap.clear()
        observer.disconnect()
    })
})()
