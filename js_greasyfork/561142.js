// ==UserScript==
// @name         Canvas & WebGL 指纹防护
// @namespace    http://tampermonkey.net/
// @version      1.0.0
// @description  防止Canvas和WebGL指纹识别追踪
// @author       By 9527
// @namespace    https://github.com/0xD88C/UserScript/Canvas&WebGL指纹防护-By9527_v1.0.0.js
// @match        *://*/*
// @grant        none
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/561142/Canvas%20%20WebGL%20%E6%8C%87%E7%BA%B9%E9%98%B2%E6%8A%A4.user.js
// @updateURL https://update.greasyfork.org/scripts/561142/Canvas%20%20WebGL%20%E6%8C%87%E7%BA%B9%E9%98%B2%E6%8A%A4.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 生成随机噪声
    function getRandomNoise() {
        return Math.random() * 0.0001 - 0.00005;
    }

    // ==================== Canvas 指纹防护 ====================
    
    const originalToDataURL = HTMLCanvasElement.prototype.toDataURL;
    const originalToBlob = HTMLCanvasElement.prototype.toBlob;
    const originalGetImageData = CanvasRenderingContext2D.prototype.getImageData;

    // 添加噪声到像素数据
    function addNoiseToImageData(imageData) {
        const data = imageData.data;
        for (let i = 0; i < data.length; i += 4) {
            // 对RGB通道添加微小随机噪声
            data[i] += Math.floor(getRandomNoise() * 10);     // R
            data[i + 1] += Math.floor(getRandomNoise() * 10); // G
            data[i + 2] += Math.floor(getRandomNoise() * 10); // B
            // Alpha通道保持不变
        }
        return imageData;
    }

    // 重写 toDataURL
    HTMLCanvasElement.prototype.toDataURL = function() {
        const context = this.getContext('2d');
        if (context) {
            const imageData = context.getImageData(0, 0, this.width, this.height);
            addNoiseToImageData(imageData);
            context.putImageData(imageData, 0, 0);
        }
        return originalToDataURL.apply(this, arguments);
    };

    // 重写 toBlob
    HTMLCanvasElement.prototype.toBlob = function(callback) {
        const context = this.getContext('2d');
        if (context) {
            const imageData = context.getImageData(0, 0, this.width, this.height);
            addNoiseToImageData(imageData);
            context.putImageData(imageData, 0, 0);
        }
        return originalToBlob.apply(this, arguments);
    };

    // 重写 getImageData
    CanvasRenderingContext2D.prototype.getImageData = function() {
        const imageData = originalGetImageData.apply(this, arguments);
        return addNoiseToImageData(imageData);
    };

    // ==================== WebGL 指纹防护 ====================

    const getParameterProto = WebGLRenderingContext.prototype.getParameter;
    const getParameterProto2 = WebGL2RenderingContext.prototype.getParameter;

    // 需要伪造的WebGL参数
    const webglParams = {
        // 渲染器信息
        37445: 'Intel Inc.',  // UNMASKED_VENDOR_WEBGL
        37446: 'Intel Iris OpenGL Engine',  // UNMASKED_RENDERER_WEBGL
        
        // 其他关键参数
        7936: 'WebKit',  // VENDOR
        7937: 'WebKit WebGL',  // RENDERER
        7938: 'WebGL 1.0',  // VERSION
        35724: 'WebGL GLSL ES 1.0',  // SHADING_LANGUAGE_VERSION
        
        // 数值参数添加噪声
        3379: 16384 + Math.floor(Math.random() * 100),  // MAX_TEXTURE_SIZE
        34076: 16384 + Math.floor(Math.random() * 100), // MAX_RENDERBUFFER_SIZE
        34024: 16 + Math.floor(Math.random() * 4),      // MAX_VIEWPORT_DIMS
        3386: 8 + Math.floor(Math.random() * 8),        // MAX_VERTEX_ATTRIBS
    };

    // 重写 getParameter (WebGL 1.0)
    WebGLRenderingContext.prototype.getParameter = function(parameter) {
        if (webglParams.hasOwnProperty(parameter)) {
            return webglParams[parameter];
        }
        return getParameterProto.call(this, parameter);
    };

    // 重写 getParameter (WebGL 2.0)
    if (typeof WebGL2RenderingContext !== 'undefined') {
        WebGL2RenderingContext.prototype.getParameter = function(parameter) {
            if (webglParams.hasOwnProperty(parameter)) {
                return webglParams[parameter];
            }
            return getParameterProto2.call(this, parameter);
        };
    }

    // 重写 getExtension
    const originalGetExtension = WebGLRenderingContext.prototype.getExtension;
    WebGLRenderingContext.prototype.getExtension = function(name) {
        // 阻止某些敏感扩展
        const blockedExtensions = [
            'WEBGL_debug_renderer_info',
            'WEBKIT_WEBGL_debug_renderer_info'
        ];
        
        if (blockedExtensions.includes(name)) {
            return null;
        }
        
        return originalGetExtension.call(this, name);
    };

    // 重写 getSupportedExtensions
    const originalGetSupportedExtensions = WebGLRenderingContext.prototype.getSupportedExtensions;
    WebGLRenderingContext.prototype.getSupportedExtensions = function() {
        const extensions = originalGetSupportedExtensions.call(this);
        if (extensions) {
            return extensions.filter(ext => 
                !ext.includes('debug_renderer_info')
            );
        }
        return extensions;
    };

    // ==================== AudioContext 指纹防护 (额外) ====================
    
    if (typeof AudioContext !== 'undefined') {
        const OriginalAudioContext = AudioContext;
        const OriginalOfflineAudioContext = OfflineAudioContext;

        // 添加音频噪声
        const addAudioNoise = function(buffer) {
            for (let channel = 0; channel < buffer.numberOfChannels; channel++) {
                const channelData = buffer.getChannelData(channel);
                for (let i = 0; i < channelData.length; i++) {
                    channelData[i] += getRandomNoise();
                }
            }
        };

        // 重写 OfflineAudioContext
        window.OfflineAudioContext = function() {
            const context = new OriginalOfflineAudioContext(...arguments);
            const originalStartRendering = context.startRendering;
            
            context.startRendering = function() {
                return originalStartRendering.call(this).then(buffer => {
                    addAudioNoise(buffer);
                    return buffer;
                });
            };
            
            return context;
        };
    }

    console.log('🛡️ Canvas & WebGL 指纹防护已启用');

})();
