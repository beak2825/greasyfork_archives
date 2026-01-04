// ==UserScript==
// @name         图片增强移动缩放旋转
// @version      1.0.5
// @description  图片增强，ctrl+alt+z/x放大/缩小，+q/e左/右旋转，wasd移动，+r恢复并重新读取图片。
// @author       dianclar
// @match        *://*/*
// @license      GPL
// @grant        none
// @run-at       document-body
// @namespace https://greasyfork.org/users/1538433
// @downloadURL https://update.greasyfork.org/scripts/556367/%E5%9B%BE%E7%89%87%E5%A2%9E%E5%BC%BA%E7%A7%BB%E5%8A%A8%E7%BC%A9%E6%94%BE%E6%97%8B%E8%BD%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/556367/%E5%9B%BE%E7%89%87%E5%A2%9E%E5%BC%BA%E7%A7%BB%E5%8A%A8%E7%BC%A9%E6%94%BE%E6%97%8B%E8%BD%AC.meta.js
// ==/UserScript==

;(function () {
  'use strict'

  let rotation
  let xi
  let yi
  let keydownon = false
  //可以修改缩放程度
  const stylevalue = 10
  //可以修改移动程度
  const locationvalue = 10
  //可以修改旋转程度
  const rotationvalue = 90

  let imgs = document.querySelectorAll('img')
  document.addEventListener('keydown', function (event) {
    if (event.ctrlKey && event.altKey && event.code === 'KeyR') {
      imgs = document.querySelectorAll('img')
      imgpaly()
    }
  })

  function imgpaly() {
    if (!imgs.length == 0) {
      rotation = 0
      xi = 0
      yi = 0
      imgs.forEach((img) => {
        img.style.objectFit = 'contain'
        img.style.height = ''
        img.style.width = ''
        img.style.transform = ''
      })

      if(keydownon) return
      keydownon = true

      document.addEventListener('keydown', function (event) {
        if (event.ctrlKey && event.altKey && event.code === 'KeyZ') {
          imgs.forEach((img) => {
            img.style.height = img.getBoundingClientRect().height * (100 - stylevalue) * 0.01 + 'px'
            img.style.width = img.getBoundingClientRect().width * (100 - stylevalue) * 0.01 + 'px'
          })
        }
        if (event.ctrlKey && event.altKey && event.code === 'KeyX') {
          imgs.forEach((img) => {
            img.style.height = img.getBoundingClientRect().height * (100 + stylevalue) * 0.01 + 'px'
            img.style.width = img.getBoundingClientRect().width * (100 + stylevalue) * 0.01 + 'px'
          })
        }

        if (event.ctrlKey && event.altKey && event.code === 'KeyQ') {
          rotation -= rotationvalue
          imgs.forEach((img) => {
            img.style.transform = `translateX(${xi * locationvalue}px) translateY(${yi * locationvalue}px) rotate(${rotation}deg)`
          })
        }
        if (event.ctrlKey && event.altKey && event.code === 'KeyE') {
          rotation += rotationvalue
          imgs.forEach((img) => {
            img.style.transform = `translateX(${xi * locationvalue}px) translateY(${yi * locationvalue}px) rotate(${rotation}deg)`
          })
        }

        if (event.ctrlKey && event.altKey && event.code === 'KeyW') {
          yi--
          imgs.forEach((img) => {
            img.style.transform = `translateX(${xi * locationvalue}px) translateY(${yi * locationvalue}px) rotate(${rotation}deg)`
          })
        }
        if (event.ctrlKey && event.altKey && event.code === 'KeyS') {
          yi++
          imgs.forEach((img) => {
            img.style.transform = `translateX(${xi * locationvalue}px) translateY(${yi * locationvalue}px) rotate(${rotation}deg)`
          })
        }
        if (event.ctrlKey && event.altKey && event.code === 'KeyA') {
          xi--
          imgs.forEach((img) => {
            img.style.transform = `translateX(${xi * locationvalue}px) translateY(${yi * locationvalue}px) rotate(${rotation}deg)`
          })
        }
        if (event.ctrlKey && event.altKey && event.code === 'KeyD') {
          xi++
          imgs.forEach((img) => {
            img.style.transform = `translateX(${xi * locationvalue}px) translateY(${yi * locationvalue}px) rotate(${rotation}deg)`
          })
        }
      })
    }
  }
  imgpaly()
})()
