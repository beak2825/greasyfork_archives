// ==UserScript==
// @license MIT
// @name         javdb 过滤
// @namespace    psrx
// @version      0.4
// @description  过滤掉你不喜欢的内容
// @author       psrx
// @include      https://javdb.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/561000/javdb%20%E8%BF%87%E6%BB%A4.user.js
// @updateURL https://update.greasyfork.org/scripts/561000/javdb%20%E8%BF%87%E6%BB%A4.meta.js
// ==/UserScript==
;(function () {
  'use strict'

  const 你不喜欢的关键字 = [
    '剛毛',
    '熟女',
    '熟娘',
    'vr',
    '大便',
      'アナル',
      '糞',
      '鼻',
      '浣腸',
      '排泄',
      '失便'
  ].map((i) => i.toLowerCase())

  // 如DKWT-010,只需要写DKWT
  const 你不喜欢的番号 = [
    'vr',
].map((i) => i.toLowerCase())

  const avDoms = [...document.querySelectorAll('.movie-list .item')]
  const avs = avDoms.map((i) => {
    return {
      title: i.querySelector('.video-title').lastChild.textContent.toLowerCase(),
      id: i.querySelector('.video-title strong').textContent.toLowerCase(),
    }
  })

  avs.forEach((av, index) => {
    ;(你不喜欢的关键字.find((关键字) => av.title.includes(关键字)) ||
      你不喜欢的番号.find((番号) => av.id.includes(番号))) &&
      avDoms[index].remove()
  })
})()