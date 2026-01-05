// ==UserScript==
// @name        Delete white background of images
// @description Replace white pixels of all images with transparent. Requires Canvas support.
// @include http://devdb.ru/*
// @grant none
// @version 0.0.1.20140630035011
// @namespace https://greasyfork.org/scripts/68
// @downloadURL https://update.greasyfork.org/scripts/68/Delete%20white%20background%20of%20images.user.js
// @updateURL https://update.greasyfork.org/scripts/68/Delete%20white%20background%20of%20images.meta.js
// ==/UserScript==
  
// History
// 2013-10-23 : Created first version 

var imgs = document.getElementsByTagName('img');

for (var i = 0;i<imgs.length;) {
    var node = imgs[i], newNode = document.createElement("canvas");
    node.parentNode.replaceChild(newNode, node);
    newNode.id = node.id;
    newNode.class = node.class;
    var width = node.width || node.clientWidth;
    var height = node.height || node.clientHeight;
    newNode.setAttribute('width', width);
    newNode.setAttribute('height', height);

    var canvas = newNode.getContext("2d");
    canvas.drawImage(node, 0, 0);
    imageData = canvas.getImageData(0,0,width,height);
    index = 0;
    for (y = 0; y < height; y++) {
        for (x = 0; x < width; x++) {
            if (imageData.data[index] > 247 &&
                imageData.data[index+1] > 247 &&
                imageData.data[index+2] > 247)
                    imageData.data[index+3] = 0;
            index += 4;
        }
    }

    canvas.putImageData(imageData, 0, 0); 
}