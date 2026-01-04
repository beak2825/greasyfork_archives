// ==UserScript==
// @name         SmashKarts Player Highlight
// @namespace    http://tampermonkey.net/
// @version      1.4
// @description  Makes all players visible by modifying shaders
// @author       Havvingyy
// @match        *://smashkarts.io/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/555702/SmashKarts%20Player%20Highlight.user.js
// @updateURL https://update.greasyfork.org/scripts/555702/SmashKarts%20Player%20Highlight.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function showPopup(message) {
        const popup = document.createElement('div');
        popup.style.position = 'fixed';
        popup.style.top = '0';
        popup.style.left = '0';
        popup.style.width = '100%';
        popup.style.backgroundColor = '#333';
        popup.style.color = '#fff';
        popup.style.padding = '10px';
        popup.style.textAlign = 'center';
        popup.style.zIndex = '9999';
        popup.style.fontFamily = 'monospace';
        popup.innerHTML = message + '<button style="margin-left:10px;background:#ff6600;color:#fff;border:none;padding:5px 10px;border-radius:5px;cursor:pointer;" onclick="this.parentNode.remove()">Close</button>';
        document.body.appendChild(popup);
    }

    showPopup("Player Red Borders Enabled!");

    const originalShader = WebGL2RenderingContext.prototype.shaderSource;

    WebGL2RenderingContext.prototype.shaderSource = function(shader, src) {
        const isPlayerShader = src.includes("hlslcc_mtx4x4unity_ObjectToWorld[4]") &&
                               src.includes("hlslcc_mtx4x4unity_MatrixVP[4]") &&
                               !src.includes("hlslcc_mtx4x4glstate_matrix_projection") &&
                               !src.includes("unity_FogParams");

        if (isPlayerShader) {
            if (src.includes("vs_COLOR0")) {
                src = src.replace(/void\s+main\(\)[\s\S]*?{([\s\S]*?)}/, `void main() {
                    gl_Position = gl_Position;
                    vs_COLOR0 = vec4(1.0, 0.0, 0.0, 1.0); // red border
                    return;
                }`);
            } else {
                src = src.replace(/return;/, `
                    vs_COLOR0 = vec4(1.0, 0.0, 0.0, 1.0); // red border
                    return;
                `);
            }
        }

        return originalShader.apply(this, [shader, src]);
    };
})();
