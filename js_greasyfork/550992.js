// ==UserScript==
// @name         移除 hcf2023.top WebGL 支持
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  完全移除 hcf2023.top 上的 WebGL 支持
// @author       You
// @match        *://hcf2023.top/*
// @match        *://*.hcf2023.top/*
// @grant        none
// @run-at       document-start
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/550992/%E7%A7%BB%E9%99%A4%20hcf2023top%20WebGL%20%E6%94%AF%E6%8C%81.user.js
// @updateURL https://update.greasyfork.org/scripts/550992/%E7%A7%BB%E9%99%A4%20hcf2023top%20WebGL%20%E6%94%AF%E6%8C%81.meta.js
// ==/UserScript==

(function() {
    'use strict';
    
    // 使用 Proxy 拦截 getContext 方法
    const originalGetContext = HTMLCanvasElement.prototype.getContext;
    
    HTMLCanvasElement.prototype.getContext = new Proxy(originalGetContext, {
        apply: function(target, thisArg, argumentsList) {
            const contextType = argumentsList[0];
            
            // 拦截所有 WebGL 相关的上下文请求
            if (contextType && typeof contextType === 'string' && 
                (contextType.includes('webgl') || contextType === 'experimental-webgl')) {
                console.log('WebGL 请求被拦截:', contextType);
                return null;
            }
            
            // 对于其他类型的上下文，正常执行
            return Reflect.apply(target, thisArg, argumentsList);
        }
    });
    
    // 彻底禁用 WebGL 相关构造函数
    const blockWebGL = () => {
        if (window.WebGLRenderingContext) {
            window.WebGLRenderingContext = null;
            delete window.WebGLRenderingContext;
        }
        
        if (window.WebGL2RenderingContext) {
            window.WebGL2RenderingContext = null;
            delete window.WebGL2RenderingContext;
        }
        
        if (window.WebGLProgram) {
            window.WebGLProgram = null;
            delete window.WebGLProgram;
        }
        
        if (window.WebGLShader) {
            window.WebGLShader = null;
            delete window.WebGLShader;
        }
        
        if (window.WebGLBuffer) {
            window.WebGLBuffer = null;
            delete window.WebGLBuffer;
        }
        
        if (window.WebGLTexture) {
            window.WebGLTexture = null;
            delete window.WebGLTexture;
        }
    };
    
    // 立即执行并监听后续的全局变量定义尝试
    blockWebGL();
    
    // 拦截可能的后续 WebGL 相关对象创建
    Object.defineProperty(window, 'WebGLRenderingContext', {
        get: () => undefined,
        set: () => {},
        configurable: false
    });
    
    Object.defineProperty(window, 'WebGL2RenderingContext', {
        get: () => undefined,
        set: () => {},
        configurable: false
    });
    
    console.log('hcf2023.top WebGL 支持已被完全移除');

    // 顺便干掉alert
    Object.defineProperty(window, 'alert', { value: function alert (data) {}});
})();