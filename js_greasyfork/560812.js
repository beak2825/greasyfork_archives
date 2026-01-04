// ==UserScript==
// @name         Dogshit Image Replacer
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Replace all images and text with dog shit and "ai" on a specific website.
// @author       You
// @match        https://www.nua.edu.cn/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/560812/Dogshit%20Image%20Replacer.user.js
// @updateURL https://update.greasyfork.org/scripts/560812/Dogshit%20Image%20Replacer.meta.js
// ==/UserScript==

// 替换网页中的所有图片为指定图片（狗屎图片）
function replaceImagesWithDogshit() {
  const images = document.getElementsByTagName("img");
  for (let i = 0; i < images.length; i++) {
    const img = images[i];
    img.src = "https://media.istockphoto.com/id/539841138/photo/dog-shit-poo-poop-dung.jpg?s=612x612&w=0&k=20&c=mrBt5iA6wrWl9RjUmJ5E9Njqr-vPnwxgrdI-mnBWVBI=";
  }
}

// 替换网页中的所有文本为 "ai"
function replaceTextWithAi() {
  const elements = document.body.getElementsByTagName('*'); // 获取所有元素
  for (let i = 0; i < elements.length; i++) {
    const element = elements[i];
    
    // 如果该元素包含文本，替换它
    if (element.hasChildNodes()) {
      for (let j = 0; j < element.childNodes.length; j++) {
        const node = element.childNodes[j];
        
        if (node.nodeType === 3) { // 只处理文本节点
          node.nodeValue = "ai";  // 替换文本内容为 "ai"
        }
      }
    }
  }
}

// 执行替换操作
replaceImagesWithDogshit();
replaceTextWithAi();
