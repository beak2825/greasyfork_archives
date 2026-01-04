// ==UserScript==
// @name Pixverse NSFW Video Bypass
// @match https://app.pixverse.ai/*
// @run-at document-start
// @description test
// @version 3.2
// @license MIT
// @author cptdan
// @namespace https://greasyfork.org/users/1458338
// @downloadURL https://update.greasyfork.org/scripts/551710/Pixverse%20NSFW%20Video%20Bypass.user.js
// @updateURL https://update.greasyfork.org/scripts/551710/Pixverse%20NSFW%20Video%20Bypass.meta.js
// ==/UserScript==
(function () {
 'use strict';
 const DEBUG_PREFIX = '[Pixverse Bypass]';
 const MAX_ATTEMPTS = 20;
 let savedMediaPath = null;
 let isInitialized = false;
 function log(message, ...args) {
 console.log(`${DEBUG_PREFIX} ${message}`, ...args);
 }
 function error(message, ...args) {
 console.error(`${DEBUG_PREFIX} ${message}`, ...args);
 }
 // Safe XHR Override
 function overrideXHR() {
 if (!window.XMLHttpRequest) {
 error('XMLHttpRequest not supported');
 return;
 }
 try {
 const originalOpen = XMLHttpRequest.prototype.open;
 const originalSend = XMLHttpRequest.prototype.send;
 XMLHttpRequest.prototype.open = function (method, url) {
 this.requestUrl = url;
 log('Opening request:', url);
 try {
 return originalOpen.apply(this, arguments);
 } catch (e) {
 error('Open error:', e);
 throw e;
 }
 };
 XMLHttpRequest.prototype.send = function (body) {
 log('Sending request:', this.requestUrl);
 // Capture media path
 if (this.requestUrl.includes('/media/') && body) {
 try {
 let data = body;
 if (body instanceof FormData) {
 data = Object.fromEntries(body);
 } else if (typeof body === 'string') {
 data = JSON.parse(body || '{}');
 }
 savedMediaPath = extractMediaPath(data, this.requestUrl);
 log('Captured media path:', savedMediaPath);
 } catch (e) {
 error('Error parsing request body:', e);
 }
 }
 // Handle response
 const loadHandler = function () {
 if (this.status >= 200 && this.status < 300) {
 try {
 const response = parseResponse(this);
 const modifiedData = modifyResponse(response, this.requestUrl);
 if (modifiedData) {
 Object.defineProperties(this, {
 response: { value: modifiedData, writable: true, configurable: true },
 responseText: { value: JSON.stringify(modifiedData), writable: true, configurable: true }
 });
 log('Response modified successfully for:', this.requestUrl);
 }
 } catch (e) {
 error('Response processing error:', e);
 }
 } else {
 log('Request failed with status:', this.status);
 }
 }.bind(this);
 this.addEventListener('load', loadHandler, { once: true });
 try {
 return originalSend.apply(this, arguments);
 } catch (e) {
 error('Send error:', e);
 throw e;
 }
 };
 log('XHR overrides initialized successfully');
 } catch (e) {
 error('Failed to initialize XHR overrides:', e);
 }
 }
 function extractMediaPath(data, url) {
 if (url.includes('/media/batch_upload_media')) {
 return data?.images?.[0]?.path;
 } else if (url.includes('/media/upload')) {
 return data?.path;
 }
 return null;
 }
 function parseResponse(xhr) {
 try {
 return xhr.responseType === 'json' ? xhr.response : JSON.parse(xhr.responseText || '{}');
 } catch (e) {
 error('Failed to parse response:', e);
 return {};
 }
 }
 function modifyResponse(data, url) {
 if (!data || typeof data !== 'object') return null;
 if (url.includes('/video/list/personal')) {
 return modifyVideoList(data);
 } else if (url.includes('/media/batch_upload_media')) {
 return modifyBatchUpload(data);
 } else if (url.includes('/media/upload')) {
 return modifySingleUpload(data);
 }
 return null;
 }
function modifyVideoList(data) {
 if (!data?.Resp?.data) return data;
 const videoList = JSON.parse(localStorage.getItem("videoList")) || {}
 return {
 ...data,
 Resp: {
 ...data.Resp,
 data: data.Resp.data.map(item => {
 const video_path = videoList[item.video_id] || item.video_path
 if (!videoList[item.video_id] && video_path) {
 videoList[item.video_id] = video_path
 localStorage.setItem("videoList",JSON.stringify(videoList))
 }
 return ({
 ...item,
 video_status: item.video_status === 7 ? 1 : item.video_status,
 first_frame: (item.extended === 1 && item.customer_paths?.customer_video_last_frame_url) ||
 item.customer_paths?.customer_img_url || '',
 url: video_path ? `https://media.pixverse.ai/${video_path}` : ''
 })
 })
 }
 };
 }
 function modifyBatchUpload(data) {
 if (data?.ErrCode === 400 && savedMediaPath) {
 const imageId = Date.now();
 const imageName = savedMediaPath.split('/').pop() || 'uploaded_media';
 return {
 ErrCode: 0,
 ErrMsg: "success",
 Resp: {
 result: [{
 id: imageId,
 category: 0,
 err_msg: "",
 name: imageName,
 path: savedMediaPath,
 size: 0,
 url: `https://media.pixverse.ai/${savedMediaPath}`
 }]
 }
 };
 }
 return data;
 }
 function modifySingleUpload(data) {
 if (data?.ErrCode === 400040 && savedMediaPath) {
 return {
 ErrCode: 0,
 ErrMsg: "success",
 Resp: {
 path: savedMediaPath,
 url: `https://media.pixverse.ai/${savedMediaPath}`
 }
 };
 }
 return data;
 }
 // Watermark Button Setup
 function setupWatermarkButton() {
 let attempts = 0;
 function attemptReplace() {
 try {
 const watermarkDiv = Array.from(document.querySelectorAll('div'))
 .find(el => el.textContent?.trim() === 'Watermark-free');
 if (watermarkDiv && watermarkDiv.parentNode) {
 const newButton = createWatermarkButton();
 watermarkDiv.parentNode.replaceChild(newButton, watermarkDiv);
 log('Watermark button replaced successfully');
 return true;
 } else if (attempts < MAX_ATTEMPTS) {
 attempts++;
 log('Attempting to find watermark button:', attempts);
 setTimeout(attemptReplace, 500);
 return false;
 } else {
 error('Max attempts reached for watermark button');
 return false;
 }
 } catch (e) {
 error('Error in button replacement:', e);
 return false;
 }
 }
 if (document.readyState === 'complete') {
 attemptReplace();
 } else {
 document.addEventListener('DOMContentLoaded', attemptReplace);
 }
 }
 function createWatermarkButton() {
 const button = document.createElement('button');
 button.textContent = 'Watermark-free';
 button.addEventListener('click', (e) => {
 e.preventDefault();
 e.stopPropagation();
 const videoElement = document.querySelector('.component-video > video');
 if (videoElement?.src) {
 downloadVideo(videoElement.src);
 } else {
 error('No video element found');
 alert('No video available to download');
 }
 });
 return button;
 }
 function downloadVideo(url) {
 try {
 const link = document.createElement('a');
 link.href = url;
 link.download = url.split('/').pop() || 'video.mp4';
 document.body.appendChild(link);
 link.click();
 document.body.removeChild(link);
 log('Video download initiated:', url);
 } catch (e) {
 error('Download error:', e);
 alert('Failed to download video');
 }
 }
 // Initialization
 function initialize() {
 if (isInitialized) return;
 try {
 overrideXHR();
 setupWatermarkButton();
 isInitialized = true;
 log('Script initialized successfully');
 } catch (e) {
 error('Initialization failed:', e);
 }
 }
 if (document.readyState === 'loading') {
 document.addEventListener('DOMContentLoaded', initialize);
 } else {
 initialize();
 }
})();