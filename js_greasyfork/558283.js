// ==UserScript==
// @name         1panel 日志颜色覆写
// @description  1panel 管理面板的容器日志界面太唐了，此脚本用于强行覆盖样式
// @version      2025-12-08-v1.0.1
// @author       WIFI连接超时
// @match        https://demo.1panel.cn/
// @license MIT
// @icon         data:image/png;base64,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
// @namespace https://greasyfork.org/users/1405510
// @downloadURL https://update.greasyfork.org/scripts/558283/1panel%20%E6%97%A5%E5%BF%97%E9%A2%9C%E8%89%B2%E8%A6%86%E5%86%99.user.js
// @updateURL https://update.greasyfork.org/scripts/558283/1panel%20%E6%97%A5%E5%BF%97%E9%A2%9C%E8%89%B2%E8%A6%86%E5%86%99.meta.js
// ==/UserScript==

(function () {
  'use strict'

  // ----------------< 配置区 >----------------
  // 日志区域背景色
  const backgroundColor = '#fff'
  // 日志区域文字颜色匹配对照表
  const textColorMatchMap = {
    // 普通文本要深黑色
    '#dadada': '#333333',
    '#bbbbbb': '#333333',
    '#919191': '#333333',
    '#6c6c6c': '#333333',
    '#4f4f4f': '#333333',
    // 其他颜色覆写
    '#ff0000': '#ce0b48',
    '#ff7d00': '#dc6f01',
    '#03ad00': '#02c464',
    '#1daf66': '#02c464',
    '#4db9b9': '#057aef',
    '#4b709b': '#057aef',
    '#9e44c0': '#b212e3',
  }
  // 匹配色列表
  const textColorMatchList = [...Object.keys(textColorMatchMap)]
  // 匹配彩色列表
  const matchColorList = []
  // 匹配中性色列表
  const matchNeutralList = []
  for (const color of textColorMatchList) {
    const rgb = hexToRgb(color)
    if (isNeutral(rgb)) {
      matchNeutralList.push(color)
    } else {
      matchColorList.push(color)
    }
  }
  // -----------------------------------------

  // 将 rgb(xx, xx, xx) 转成 { r, g, b }
  function parseRGB(rgbStr) {
    const nums = rgbStr.match(/\d+/g).map(Number)
    return { r: nums[0], g: nums[1], b: nums[2] }
  }

  // 将 hex 转成 { r, g, b }
  function hexToRgb(hex) {
    hex = hex.replace('#', '')
    if (hex.length === 3) {
      hex = hex.split('').map(c => c + c).join('')
    }
    return {
      r: Number.parseInt(hex.slice(0, 2), 16),
      g: Number.parseInt(hex.slice(2, 4), 16),
      b: Number.parseInt(hex.slice(4, 6), 16),
    }
  }

  // 判断颜色是否为中性色
  function isNeutral(color) {
    const { r, g, b } = color
    const mean = (r + g + b) / 3
    const variance
      = ((r - mean) ** 2
        + (g - mean) ** 2
        + (b - mean) ** 2) / 3

    const std = Math.sqrt(variance)

    // 灰度阈值
    return std < 10
  }

  // 计算颜色距离 (欧氏距离)
  function colorDistance(c1, c2) {
    return Math.sqrt(
      (c1.r - c2.r) ** 2
      + (c1.g - c2.g) ** 2
      + (c1.b - c2.b) ** 2,
    )
  }

  // 返回最接近的颜色
  function findClosestHex(rgbStr) {
    const target = parseRGB(rgbStr)
    const targetIsNeutral = isNeutral(target)

    // 根据输入属于哪类，选对应的列表
    const compareList = targetIsNeutral ? matchNeutralList : matchColorList

    // 如果某一类刚好为空，则 fallback 回全列表
    const finalList = compareList.length > 0 ? compareList : textColorMatchList

    let minDist = Infinity
    let closestHex = null

    for (const hex of finalList) {
      const rgb = hexToRgb(hex)
      const dist = colorDistance(target, rgb)
      if (dist < minDist) {
        minDist = dist
        closestHex = hex
      }
    }

    return closestHex
  }

  // 计算颜色
  function computeColor(spanStyleColor) {
    // console.log('%c输入颜色          ', `background: ${spanStyleColor}`)
    if (spanStyleColor) {
      const closestHex = findClosestHex(spanStyleColor)
      // console.log('%c匹配颜色          ', `background: ${closestHex}`)
      if (closestHex) {
        // console.log('%c输出颜色          ', `background: ${textColorMatchMap[closestHex]}`)
        return textColorMatchMap[closestHex]
      }
    }
    // 默认返回第一个
    // console.log('%c默认返回          ', `background: ${textColorMatchMap[textColorMatchList[0]]}`)
    return textColorMatchMap[textColorMatchList[0]]
  }

  // 执行颜色覆写
  function doOverwrite() {
    // 日志容器
    const logContainer = document.querySelector('.log-container')
    // 覆写背景色
    logContainer.style.backgroundColor = backgroundColor

    // 对日志元素执行颜色覆写
    logContainer.querySelectorAll('span')
      .forEach((span) => {
        if (span.style.color) {
          span.style.color = computeColor(span.style.color)
        }
      })
  }

  function loop() {
    setTimeout(() => {
      try {
        doOverwrite()
      } catch {}
      loop()
    }, 100)
  }

  loop()
})()
