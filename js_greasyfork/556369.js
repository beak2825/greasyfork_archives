// ==UserScript==
// @name         三节课视频自动播放
// @namespace    http://tampermonkey.net/
// @version      0.7
// @description  浮动可拖动按钮触发播放，视频完成后自动播放下一个视频或切换章节，所有视频完成后弹窗提醒
// @author       Izuna
// @match        *://sntelelearning.b.sanjieke.cn/*
// @grant        none
// @icon         https://cdn.sanjieke.cn/upload/image/17497851484.png
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/556369/%E4%B8%89%E8%8A%82%E8%AF%BE%E8%A7%86%E9%A2%91%E8%87%AA%E5%8A%A8%E6%92%AD%E6%94%BE.user.js
// @updateURL https://update.greasyfork.org/scripts/556369/%E4%B8%89%E8%8A%82%E8%AF%BE%E8%A7%86%E9%A2%91%E8%87%AA%E5%8A%A8%E6%92%AD%E6%94%BE.meta.js
// ==/UserScript==

(function () {
  'use strict';

  // 重写 document.hidden 属性
  Object.defineProperty(document, 'hidden', {
      get: function() {
          return false; // 强制返回false
      },
      set: function() {}, // 空setter，阻止赋值修改
      configurable: false, // 禁止被重新配置/删除
      enumerable: true // 保持可枚举性，兼容原生行为
  });

  // 额外：同步重写 document.visibilityState（配套属性，避免露馅）
  // 原生中 hidden=false 对应 visibilityState="visible"，建议一并覆盖
  Object.defineProperty(document, 'visibilityState', {
      get: function() {
          return 'visible';
      },
      set: function() {},
      configurable: false,
      enumerable: true
  });

  let playStatusTimer = null; // 播放状态检查定时器
  let nodeStatusTimer = null; // 节点状态检查定时器（每分钟检查一次）
  let video = null; // 目标视频元素
  let isVideoCompleted = false; // 视频是否已完成（防止重复提醒）
  let playButton = null; // 存储创建的播放按钮（避免重复查找）

  /**
   * 创建并添加浮动可拖动的播放触发按钮
   */
  function createPlayButton() {
    // 创建按钮元素
    playButton = document.createElement('button');
    // 设置播放按钮为SVG图标
    playButton.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 16 16"><path fill="#ffffff" d="M2 1v14l12-7z"></path></svg>`;
    playButton.id = 'custom-play-trigger'; // 给按钮添加唯一ID，方便查找

    // 设置按钮样式（浮动置顶，不遮挡内容，初始即为正圆）
    playButton.style.position = 'fixed';
    playButton.style.top = '50px';
    playButton.style.right = '50px';
    playButton.style.zIndex = '9999';
    playButton.style.width = '40px';
    playButton.style.height = '40px';
    playButton.style.padding = '8px';
    playButton.style.backgroundColor = '#4CAF50';
    playButton.style.color = 'white';
    playButton.style.border = 'none';
    playButton.style.borderRadius = '50%';
    playButton.style.cursor = 'pointer';
    playButton.style.boxShadow = '0 2px 5px rgba(0,0,0,0.3)';
    playButton.style.transition = 'background-color 0.2s';
    playButton.style.display = 'flex';
    playButton.style.alignItems = 'center';
    playButton.style.justifyContent = 'center';
    playButton.style.textAlign = 'center';

    // 按钮hover效果
    playButton.addEventListener('mouseover', () => {
      playButton.style.backgroundColor = '#45a049';
    });
    playButton.addEventListener('mouseout', () => {
      if (!playButton.dataset.isDragging) {
        playButton.style.backgroundColor = '#4CAF50';
      }
    });

    // 点击事件：触发播放按钮 + 初始化视频元素 + 启动状态检查
    playButton.addEventListener('click', () => {
      // 点击时强制重置视频状态，确保从当前页面开始播放
      video = null;
      isVideoCompleted = false;
      // 清除可能存在的旧定时器
      if (nodeStatusTimer) {
        clearInterval(nodeStatusTimer);
        nodeStatusTimer = null;
      }
      triggerPlayButtons();
      initTargetVideo(true); // 强制重置并初始化目标视频元素

      // 设置视频倍速为1.25x
      setTimeout(() => {
        setPlaybackRateTo125();
      }, 1000); // 延迟设置倍速，确保视频已经开始播放

      startPlayStatusCheck(); // 启动播放状态检查
      startNodeStatusCheck(); // 启动节点状态检查（每分钟一次）
      // 点击反馈（直接操作存储的按钮变量）
      // 替换为SVG动画图标
      const svgAnimation = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><rect width="2.8" height="12" x="1" y="6" fill="#fafafa"><animate id="svgSpinnersBarsScale0" attributeName="y" begin="0;svgSpinnersBarsScale1.end-0.1s" calcMode="spline" dur="0.6s" keySplines=".36,.61,.3,.98;.36,.61,.3,.98" values="6;1;6"></animate><animate attributeName="height" begin="0;svgSpinnersBarsScale1.end-0.1s" calcMode="spline" dur="0.6s" keySplines=".36,.61,.3,.98;.36,.61,.3,.98" values="12;22;12"></animate></rect><rect width="2.8" height="12" x="5.8" y="6" fill="#fafafa"><animate attributeName="y" begin="svgSpinnersBarsScale0.begin+0.1s" calcMode="spline" dur="0.6s" keySplines=".36,.61,.3,.98;.36,.61,.3,.98" values="6;1;6"></animate><animate attributeName="height" begin="svgSpinnersBarsScale0.begin+0.1s" calcMode="spline" dur="0.6s" keySplines=".36,.61,.3,.98;.36,.61,.3,.98" values="12;22;12"></animate></rect><rect width="2.8" height="12" x="10.6" y="6" fill="#fafafa"><animate attributeName="y" begin="svgSpinnersBarsScale0.begin+0.2s" calcMode="spline" dur="0.6s" keySplines=".36,.61,.3,.98;.36,.61,.3,.98" values="6;1;6"></animate><animate attributeName="height" begin="svgSpinnersBarsScale0.begin+0.2s" calcMode="spline" dur="0.6s" keySplines=".36,.61,.3,.98;.36,.61,.3,.98" values="12;22;12"></animate></rect><rect width="2.8" height="12" x="15.4" y="6" fill="#fafafa"><animate attributeName="y" begin="svgSpinnersBarsScale0.begin+0.3s" calcMode="spline" dur="0.6s" keySplines=".36,.61,.3,.98;.36,.61,.3,.98" values="6;1;6"></animate><animate attributeName="height" begin="svgSpinnersBarsScale0.begin+0.3s" calcMode="spline" dur="0.6s" keySplines=".36,.61,.3,.98;.36,.61,.3,.98" values="12;22;12"></animate></rect><rect width="2.8" height="12" x="20.2" y="6" fill="#fafafa"><animate id="svgSpinnersBarsScale1" attributeName="y" begin="svgSpinnersBarsScale0.begin+0.4s" calcMode="spline" dur="0.6s" keySplines=".36,.61,.3,.98;.36,.61,.3,.98" values="6;1;6"></animate><animate attributeName="height" begin="svgSpinnersBarsScale0.begin+0.4s" calcMode="spline" dur="0.6s" keySplines=".36,.61,.3,.98;.36,.61,.3,.98" values="12;22;12"></animate></rect></svg>`;
      playButton.innerHTML = svgAnimation;
      playButton.style.backgroundImage = 'linear-gradient(180deg,#2af598 0%, #009efd 100%)';
      // 调整按钮尺寸为正圆
      const buttonSize = '40px'; // 统一的宽度和高度
      playButton.style.width = buttonSize;
      playButton.style.height = buttonSize;
      playButton.style.padding = '8px'; // 内部边距，确保SVG居中
      playButton.style.borderRadius = '50%';
      playButton.style.display = 'flex'; // 使用flex布局
      playButton.style.alignItems = 'center'; // 垂直居中
      playButton.style.justifyContent = 'center'; // 水平居中
    });

    // 添加拖动功能
    makeDraggable(playButton);

    // 添加到页面
    document.body.appendChild(playButton);
    console.log('播放触发按钮已添加');
  }

  /**
   * 触发页面中所有class为xgplayer-icon-play的播放按钮
   */
  function triggerPlayButtons() {
    const playButtons = document.querySelectorAll('.xgplayer-icon-play');

    if (playButtons.length > 0) {
      playButtons.forEach((button) => {
        // 模拟真实点击事件（支持冒泡，兼容播放器逻辑）
        const clickEvent = new MouseEvent('click', {
          bubbles: true,
          cancelable: true,
          view: window
        });
        button.dispatchEvent(clickEvent);
        console.log('已触发播放按钮:', button);
      });
    } else {
      console.log('未找到播放按钮（.xgplayer-icon-play）');
      alert('未找到可触发的播放按钮！');
    }
  }

  /**
   * 设置视频倍速为1.25x
   * 通过查找并点击xg-playbackrate元素中的1.25x选项来实现
   * @param {number} retryCount - 重试次数，默认为0
   * @param {number} maxRetries - 最大重试次数，默认为3
   * @returns {boolean} 是否成功设置倍速
   */
  function setPlaybackRateTo125(retryCount = 0, maxRetries = 3) {
    try {
      // 查找倍速控制元素
      const playbackRateElement = document.querySelector('xg-playbackrate.xgplayer-playbackrate');
      if (!playbackRateElement) {
        console.log('未找到倍速控制元素(xg-playbackrate.xgplayer-playbackrate)');

        // 如果没有找到倍速控制元素且还有重试次数，延迟后重试
        if (retryCount < maxRetries) {
          console.log(`尝试第${retryCount + 1}次重试设置倍速`);
          setTimeout(() => {
            setPlaybackRateTo125(retryCount + 1, maxRetries);
          }, 2000); // 延迟2秒后重试
        }
        return false;
      }

      // 查找1.25x的选项
      const rate125Element = playbackRateElement.querySelector('li[cname="1.25"]');
      if (!rate125Element) {
        console.log('未找到1.25x倍速选项');

        // 如果没有找到1.25x选项且还有重试次数，延迟后重试
        if (retryCount < maxRetries) {
          console.log(`尝试第${retryCount + 1}次重试设置倍速`);
          setTimeout(() => {
            setPlaybackRateTo125(retryCount + 1, maxRetries);
          }, 2000); // 延迟2秒后重试
        }
        return false;
      }

      // 检查是否已经是选中状态
      if (rate125Element.classList.contains('selected')) {
        console.log('视频倍速已经是1.25x');
        return true;
      }

      // 模拟点击1.25x选项
      const clickEvent = new MouseEvent('click', {
        bubbles: true,
        cancelable: true,
        view: window
      });
      rate125Element.dispatchEvent(clickEvent);
      console.log('已成功设置视频倍速为1.25x');
      return true;
    } catch (error) {
      console.error('设置视频倍速时发生错误:', error);

      // 如果发生错误且还有重试次数，延迟后重试
      if (retryCount < maxRetries) {
        console.log(`尝试第${retryCount + 1}次重试设置倍速`);
        setTimeout(() => {
          setPlaybackRateTo125(retryCount + 1, maxRetries);
        }, 2000); // 延迟2秒后重试
      }
      return false;
    }
  }

  /**
   * 初始化目标视频元素（从.video-player-container容器中查找）
   * @param {boolean} forceReset - 是否强制重置视频元素，即使已存在引用
   */
  function initTargetVideo(forceReset = false) {
    // 如果强制重置或video不存在，则重新初始化
    if (!video || forceReset) {
      // 重置完成状态
      isVideoCompleted = false;

      const videoContainer = document.querySelector('.video-player-container');
      if (!videoContainer) {
        console.log('未找到视频容器（.video-player-container）');
        return;
      }

      // 查找容器内的视频元素（支持多层嵌套）
      const foundVideo = videoContainer.querySelector('video');
      if (foundVideo) {
        video = foundVideo;
        console.log('已找到目标视频元素:', video);
      } else {
        console.log('视频容器中未找到video元素');
      }
    }
  }

  /**
   * 判断视频是否正在播放
   * @returns {boolean} 播放状态（true=正在播放）
   */
  function isPlaying() {
    if (!video) return false;
    // 排除：未加载完成（duration 为 NaN）、暂停、已结束
    return !video.paused && !video.ended && !isNaN(video.duration);
  }

  /**
   * 检查当前活跃节点是否包含node-finish-animate类
   * 如果包含，说明当前视频已完成，直接播放下一集
   */
  function checkNodeStatus() {
    // 只有在视频播放过程中才检查节点状态
    if (isVideoCompleted) return;

    try {
      // 查找当前活跃的node-item
      let currentActiveNode = document.querySelector('.node-item.node-item-active');

      // 如果没有找到活跃节点，尝试查找当前章节中的第一个node-item
      if (!currentActiveNode) {
        const currentChapterContainer = document.querySelector('.chapter-container');
        if (currentChapterContainer) {
          // 尝试在当前章节中查找第一个node-item
          currentActiveNode = currentChapterContainer.querySelector('.node-item');
          if (!currentActiveNode) {
            // 如果还是没有找到，尝试查找页面上的第一个node-item
            currentActiveNode = document.querySelector('.node-item');
          }
        } else {
          // 如果没有找到章节容器，尝试查找页面上的第一个node-item
          currentActiveNode = document.querySelector('.node-item');
        }
      }

      if (!currentActiveNode) {
        console.log('未找到当前活跃节点或任何node-item');
        return;
      }

      // 检查是否包含node-finish-animate类
      if (currentActiveNode.classList.contains('node-finish-animate')) {
        console.log('检测到当前节点已完成(node-finish-animate)，自动播放下一集');
        isVideoCompleted = true;
        clearInterval(playStatusTimer); // 清除视频播放状态检查定时器
        playStatusTimer = null;
        clearInterval(nodeStatusTimer); // 清除节点状态检查定时器
        nodeStatusTimer = null;

        // 检查当前页面是否还有其他视频可以播放
        if (hasOtherVideos()) {
          console.log('当前页面有其他视频，自动播放下一个');
          // 延迟一段时间后播放下一个视频
          setTimeout(() => {
            triggerPlayButtons();
            initTargetVideo();

            // 设置视频倍速为1.25x
            setTimeout(() => {
              setPlaybackRateTo125();
            }, 1000);

            startPlayStatusCheck();
            startNodeStatusCheck();
          }, 1000);
        } else {
          // 当前页面没有其他视频，尝试切换到下一节
          console.log('当前页面没有其他视频，尝试切换到下一节');
          setTimeout(() => {
            const nextNodeResult = nextNode();
            if (nextNodeResult.success) {
              console.log(`已切换到${nextNodeResult.chapterChanged ? '新章节' : '下一节'}`);
              // 延迟一段时间等待页面加载完成后播放视频
              setTimeout(() => {
                // 重置视频变量，确保重新初始化
                video = null;
                isVideoCompleted = false;
                triggerPlayButtons();
                initTargetVideo();

                // 设置视频倍速为1.25x
                setTimeout(() => {
                  setPlaybackRateTo125();
                }, 1000);

                startPlayStatusCheck();
                startNodeStatusCheck();
              }, 2000);
            } else {
              console.log('已无下一节内容，所有视频播放完成');
              showCompletionNotification(); // 显示完成弹窗
            }
          }, 1000);
        }
      } else {
        console.log('当前节点未完成(node-finish-animate)');
      }
    } catch (error) {
      console.error('检查节点状态时发生错误:', error);
    }
  }

  /**
   * 启动节点状态定时检查（1分钟/次）
   * 首次检查立即执行，之后每分钟执行一次
   */
  function startNodeStatusCheck() {
    // 先清除已有定时器，避免重复
    if (nodeStatusTimer) clearInterval(nodeStatusTimer);

    console.log('启动节点状态检查（立即执行首次检查，之后1分钟/次）');
    // 立即执行一次检查
    checkNodeStatus();
    // 然后每分钟检查一次
    nodeStatusTimer = setInterval(() => {
      checkNodeStatus();
    }, 30000); // 60000毫秒 = 1分钟
  }

  /**
   * 启动播放状态定时检查（1秒/次）
   */
  function startPlayStatusCheck() {
    // 先清除已有定时器，避免重复
    if (playStatusTimer) clearInterval(playStatusTimer);

    // 只有找到视频元素才启动检查
    if (!video) {
      console.log('未找到视频元素，无法启动播放状态检查');
      return;
    }

    // console.log('启动播放状态检查（1秒/次）');
    playStatusTimer = setInterval(() => {
      checkPlayStatus();
    }, 1000);
  }

  /**
   * 检查播放状态：完成则自动播放下一个视频或切换章节
   */
  function checkPlayStatus() {
    if (!video || isVideoCompleted) return;

    // 检查视频是否已结束（两种判断：原生ended属性 + 播放进度接近100%）
    const isCompleted =
      video.ended || (video.duration > 0 && video.currentTime >= video.duration - 0.5);

    if (isCompleted) {
      isVideoCompleted = true;
      clearInterval(playStatusTimer); // 移除视频播放状态检查定时器
      playStatusTimer = null;
      if (nodeStatusTimer) {
        clearInterval(nodeStatusTimer); // 移除节点状态检查定时器
        nodeStatusTimer = null;
      }
      console.log('视频播放完成');

      // 检查当前页面是否还有其他视频可以播放
      if (hasOtherVideos()) {
        console.log('当前页面有其他视频，自动播放下一个');
        // 延迟一段时间后播放下一个视频
        setTimeout(() => {
          triggerPlayButtons();
          initTargetVideo();

          // 设置视频倍速为1.25x
          setTimeout(() => {
            setPlaybackRateTo125();
          }, 1000);

          startPlayStatusCheck();
        }, 1000);
      } else {
        // 当前页面没有其他视频，尝试切换到下一节
        console.log('当前页面没有其他视频，尝试切换到下一节');
        setTimeout(() => {
          const nextNodeResult = nextNode();
          if (nextNodeResult.success) {
            console.log(`已切换到${nextNodeResult.chapterChanged ? '新章节' : '下一节'}`);
            // 延迟一段时间等待页面加载完成后播放视频
            setTimeout(() => {
              // 重置视频变量，确保重新初始化
              video = null;
              isVideoCompleted = false;
              triggerPlayButtons();
              initTargetVideo();

              // 设置视频倍速为1.25x
              setTimeout(() => {
                setPlaybackRateTo125();
              }, 1000);

              startPlayStatusCheck();
            }, 2000);
          } else {
            console.log('已无下一节内容，所有视频播放完成');
            showCompletionNotification(); // 显示完成弹窗
          }
        }, 1000);
      }
    } else {
      // 可选：打印当前播放状态（调试用）
      const status = isPlaying() ? '正在播放' : '暂停/未播放';
      // console.log(`当前播放状态：${status} | 进度：${video.currentTime.toFixed(2)}/${video.duration.toFixed(2)}s`);
    }
  }

  /**
   * 检查当前页面是否还有其他视频可以播放
   * @returns {boolean} 是否存在其他视频
   */
  function hasOtherVideos() {
    try {
      // 查找页面中所有video元素
      const allVideos = document.querySelectorAll('video');
      if (allVideos.length <= 1) {
        return false;
      }

      // 检查是否有其他未播放完成的视频
      for (let i = 0; i < allVideos.length; i++) {
        const v = allVideos[i];
        if (v !== video && !v.ended && !v.paused && !isNaN(v.duration)) {
          return true;
        }
      }

      return false;
    } catch (error) {
      console.error('检查其他视频时发生错误:', error);
      return false;
    }
  }

  /**
   * 跳转到下一个节点
   * 功能：从当前活跃节点跳转到下一个节点，如果当前章节没有下一个节点，则跳转到下一章的第一个节点
   * @param {number} [maxAttempts=5] - 章节切换失败时的最大重试次数，防止无限循环
   * @returns {Object} 返回操作结果对象
   * @returns {boolean} returnObject.success - 操作是否成功
   * @returns {boolean} returnObject.chapterChanged - 章节是否发生变化
   * @returns {string|null} returnObject.oldChapterName - 切换前的章节名称
   * @returns {string|null} returnObject.newChapterName - 切换后的章节名称
   * @throws {Error} 当无法找到当前活跃节点或下一个节点时抛出错误
   */
  function nextNode(maxAttempts = 5) {
    try {
      // 1. 找到当前活跃的 node-item
      let currentActiveNode = document.querySelector('.node-item.node-item-active');

      // 如果没有找到活跃节点，尝试查找当前章节中的第一个node-item
      if (!currentActiveNode) {
        const currentChapterContainer = document.querySelector('.chapter-container');
        if (currentChapterContainer) {
          // 尝试在当前章节中查找第一个node-item
          currentActiveNode = currentChapterContainer.querySelector('.node-item');
          if (!currentActiveNode) {
            // 如果还是没有找到，尝试查找页面上的第一个node-item
            currentActiveNode = document.querySelector('.node-item');
          }
        } else {
          // 如果没有找到章节容器，尝试查找页面上的第一个node-item
          currentActiveNode = document.querySelector('.node-item');
        }
      }

      if (!currentActiveNode) {
        throw new Error('无法找到当前活跃节点或任何node-item');
      }

      // 2. 查找当前section内的下一个node-item，如果存在则点击
      const currentSectionContainer = currentActiveNode.closest('.section-container');

      // 3. 如果找到section容器，在其中查找下一个节点
      if (currentSectionContainer) {
        const sectionNodes = Array.from(currentSectionContainer.querySelectorAll('.node-item'));
        const currentIndex = sectionNodes.indexOf(currentActiveNode);

        // 如果当前section内有下一个节点，则点击它
        if (currentIndex !== -1 && currentIndex < sectionNodes.length - 1) {
          const nextNodeInSection = sectionNodes[currentIndex + 1];
          // 触发点击事件
          nextNodeInSection.click();
          return {
            success: true,
            chapterChanged: false,
            oldChapterName: getCurrentChapterName(),
            newChapterName: getCurrentChapterName()
          };
        }
      }

      // 如果section容器不存在或没有下一个节点，继续执行章节切换逻辑

      // 3. 如果当前section内没有下一个node-item，则查找下一个chapter-container
      const currentChapterContainer = currentActiveNode.closest('.chapter-container');

      if (!currentChapterContainer) {
        throw new Error('无法找到当前章节容器');
      }

      const nextChapterContainer = currentChapterContainer.nextElementSibling;
      if (!nextChapterContainer || !nextChapterContainer.classList.contains('chapter-container')) {
        // 如果没有下一个章节，返回false表示操作失败
        return {
          success: false,
          chapterChanged: false,
          oldChapterName: getCurrentChapterName(),
          newChapterName: getCurrentChapterName()
        };
      }
      console.log('下一章节容器:', nextChapterContainer);
      if (nextChapterContainer.classList.contains('chapter-item')) {
        console.log('下一章节容器类型为chapter-item');
        const nextNode = nextChapterContainer.querySelector('.node-item');
        if (!nextNode) {
          throw new Error('无法找到下一个节点');
        }
        nextNode.click();
        return {
          success: true,
          chapterChanged: false,
          oldChapterName: getCurrentChapterName(),
          newChapterName: getCurrentChapterName()
        };
      } else if (nextChapterContainer.classList.contains('chapter-section-item')) {
        console.log('下一章节容器类型为chapter-section-item');
        // const nextChapterHeader = nextChapterContainer.querySelector('.chapter-container');
        // if (!nextChapterHeader) {
        //   throw new Error('无法找到下一章的标题容器');
        // }
        nextChapterContainer.click();

        // 点击章节标题以展开章节内容
        if (!nextChapterContainer.classList.contains('chapter-active')) {
          nextChapterContainer.click();
        }

        // 5. 跳转到下一章的第一个小节
        // 首先尝试在section-container中查找node-item
        let firstSectionNode = null;
        const nextSectionContainer = nextChapterContainer.querySelector('.section-container');

        if (nextSectionContainer) {
          // 如果存在section-container，在其中查找node-item
          firstSectionNode = nextSectionContainer.querySelector('.node-item');
        }

        // 如果在section-container中未找到，直接在chapter-container中查找node-item
        if (!firstSectionNode) {
          firstSectionNode = nextChapterContainer.querySelector('.node-item');
        }

        // 如果仍然没有找到，记录错误但不抛出异常，允许函数继续执行
        // 如果仍然没有找到，不再抛出异常，而是在后续代码中处理
        if (!firstSectionNode) {
          console.error('无法找到下一章的小节');
        }

        // 如果找到下一章的第一个小节
        if (firstSectionNode) {
          // 记录切换前的章节名称
          const oldChapterName = getCurrentChapterName();

          // 触发点击事件，跳转到下一章的第一个小节
          try {
            firstSectionNode.click();
            // 短暂延迟以确保页面状态更新完成
            setTimeout(() => {}, 50);
          } catch (clickError) {
            console.error('点击下一章第一个小节时发生错误:', clickError);
            // 即使点击失败，仍尝试获取新的章节名称以提供诊断信息
          }

          // 记录切换后的章节名称
          const newChapterName = getCurrentChapterName();

          // 判断章节是否发生变化，处理可能的null值情况
          const chapterChanged = Boolean(oldChapterName) && Boolean(newChapterName) && oldChapterName !== newChapterName;

          // 如果章节没有变化且还有尝试次数，则递归调用nextNode
          if(!chapterChanged && maxAttempts > 0){
            // 减少尝试次数并递归调用
            return nextNode(maxAttempts - 1);
          }

          return {
            success: true,
            chapterChanged: chapterChanged,
            oldChapterName: oldChapterName,
            newChapterName: newChapterName
          };
        } else {
          console.error('无法找到下一章的小节');
          return {
            success: false,
            chapterChanged: false,
            oldChapterName: getCurrentChapterName(),
            newChapterName: null
          };
        }
      }
    } catch (error) {
      console.error('跳转到下一个节点时发生错误:', error);
      return {
        success: false,
        chapterChanged: false,
        oldChapterName: null,
        newChapterName: null
      };
    }
  }

  /**
   * 获取当前活跃章节的名称
   * @returns {string|null} 返回当前活跃章节的名称，如果没有找到则返回null
   * @throws {Error} 当DOM操作失败时抛出错误
   */
  function getCurrentChapterName() {
    try {
      const activeChapter = document.querySelector('.chapter-con.chapter-active');
      if (!activeChapter) {
        activeChapter = document.querySelector('.node-name-con');
        if (!activeChapter) {
          return null;
        }
        // return null;
      }

      // 尝试获取章节标题文本，处理可能的DOM异常
      const chapterText = activeChapter.textContent;
      if (typeof chapterText !== 'string') {
        return null;
      }

      // 清理并返回章节名称
      return chapterText.trim() || null;
    } catch (error) {
      console.error('获取章节名称时发生错误:', error);
      // 遇到错误时返回null而不是抛出异常，以便nextNode函数能够继续执行
      return null;
    }
  }

  /**
   * 显示播放完成弹窗提醒
   */
  function showCompletionNotification() {
    // 检查是否已存在弹窗，避免重复显示
    if (document.getElementById('video-completion-notification')) return;

    const notification = document.createElement('div');
    notification.id = 'video-completion-notification';

    // 弹窗样式
    notification.style.position = 'fixed';
    notification.style.top = '50%';
    notification.style.left = '50%';
    notification.style.transform = 'translate(-50%, -50%)';
    notification.style.zIndex = '99999';
    notification.style.backgroundColor = 'rgba(255,255,255,0.95)';
    notification.style.border = '2px solid #4CAF50';
    notification.style.borderRadius = '10px';
    notification.style.padding = '20px 30px';
    notification.style.boxShadow = '0 5px 15px rgba(0,0,0,0.3)';
    notification.style.minWidth = '280px';
    notification.style.textAlign = 'center';

    // 弹窗内容
    const title = document.createElement('h3');
    title.innerText = '所有视频播放完成！';
    title.style.color = '#333';
    title.style.margin = '0 0 15px 0';

    const confirmBtn = document.createElement('button');
    confirmBtn.innerText = '确定';
    confirmBtn.style.padding = '8px 20px';
    confirmBtn.style.backgroundColor = '#4CAF50';
    confirmBtn.style.color = 'white';
    confirmBtn.style.border = 'none';
    confirmBtn.style.borderRadius = '5px';
    confirmBtn.style.cursor = 'pointer';

    // 关闭弹窗
    confirmBtn.addEventListener('click', () => {
      document.body.removeChild(notification);
    });

    // 组装弹窗
    notification.appendChild(title);
    notification.appendChild(confirmBtn);
    document.body.appendChild(notification);

    // 点击弹窗外部关闭
    notification.addEventListener('click', (e) => {
      if (e.target === notification) document.body.removeChild(notification);
    });

    // 10秒自动关闭
    setTimeout(() => {
      if (document.body.contains(notification)) {
        document.body.removeChild(notification);
      }
    }, 10000);
  }

  /**
   * 使按钮可拖动
   * @param {HTMLElement} element - 要拖动的按钮元素
   */
  function makeDraggable(element) {
    let pos1 = 0,
      pos2 = 0,
      pos3 = 0,
      pos4 = 0;

    element.onmousedown = dragMouseDown;

    function dragMouseDown(e) {
      e = e || window.event;
      e.preventDefault();
      // 记录初始鼠标位置
      pos3 = e.clientX;
      pos4 = e.clientY;
      // 绑定鼠标抬起和移动事件
      document.onmouseup = closeDragElement;
      document.onmousemove = elementDrag;
      // 拖动时按钮样式变化
      element.style.cursor = 'move';
      element.style.backgroundColor = '#388e3c';
      element.dataset.isDragging = 'true'; // 标记正在拖动
    }

    function elementDrag(e) {
      e = e || window.event;
      e.preventDefault();
      // 计算位置偏移
      pos1 = pos3 - e.clientX;
      pos2 = pos4 - e.clientY;
      pos3 = e.clientX;
      pos4 = e.clientY;
      // 更新按钮位置（避免超出可视区域）
      const newTop = element.offsetTop - pos2;
      const newLeft = element.offsetLeft - pos1;
      if (newTop >= 0 && newLeft >= 0) {
        element.style.top = newTop + 'px';
        element.style.left = newLeft + 'px';
      }
    }

    function closeDragElement() {
      // 停止拖动，恢复样式
      document.onmouseup = null;
      document.onmousemove = null;
      element.style.cursor = 'pointer';
      element.style.backgroundColor = '#4CAF50';
      delete element.dataset.isDragging; // 清除拖动标记
    }
  }

  // 页面加载完成后创建按钮
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', createPlayButton);
  } else {
    createPlayButton();
  }
})();
