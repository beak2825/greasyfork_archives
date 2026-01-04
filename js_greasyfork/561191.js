// ==UserScript==
// @name         浏览器请求hooks by bincooo
// @namespace    http://tampermonkey.net/
// @version      2026-01-03.1
// @description  浏览器请求hooks，用于临时改写请求体
// @author       bincooo
// @match        http://192.168.5.107/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=dieyuyun.com
// @require      https://code.jquery.com/jquery-3.7.1.min.js
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/561191/%E6%B5%8F%E8%A7%88%E5%99%A8%E8%AF%B7%E6%B1%82hooks%20by%20bincooo.user.js
// @updateURL https://update.greasyfork.org/scripts/561191/%E6%B5%8F%E8%A7%88%E5%99%A8%E8%AF%B7%E6%B1%82hooks%20by%20bincooo.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const globalCss = `
    .hook-textarea:focus {
        border-color: blue;
        box-shadow: 0 0 5px rgba(0, 0, 255, 0.5);
        outline: none;
        background-color: #f0f8ff;
    }`;
    $(document.head).append(`<style>${globalCss}</style>`);


    const toolbox = $(`<span
      style="position: fixed;
      top: calc(100% - 22px);
      z-index: 99999999;
      left: calc(100% - 112px);
      font-size: 12px;
      font-family: 'courier new';
      color: #616161;
      display: flex;
      align-items: center;">
      <input type=checkbox name=chk /></input>
      <a href="javascript:;" style="line-height: 16px">> 请求hook < </a>
    </span>
    `);
    $(document.body).append(toolbox);
    const consoleBox = $(`<textarea class=hook-textarea hidden style="
      position: fixed;
      width: 500px;
      height: 300px;
      top: calc(100% - 320px);
      z-index: 99999999;
      left: calc(100% - 590px);
      font-size: 12px;
      font-family: 'courier new';
      border: 1px solid;
      padding: 10px;
      background-color: white;
    " data-hidden=1></textarea>`)
    $(document.body).append(consoleBox);
    $(toolbox).find("a").click(() => {
        if (consoleBox.attr("data-hidden") == "1") {
            consoleBox.attr("data-hidden", 0);
            consoleBox.show();
            return;
        }

        consoleBox.attr("data-hidden", 1);
        consoleBox.hide();
    });

    // Your code here...
    console.log("success!");
    class CustomHttpRequest extends window.XMLHttpRequest {
        url = '';
        constructor(...args) {
            super(...args);
        }

        send() {
            let body = arguments[0];
            const checked = $(toolbox).find("input").prop("checked");
            if (body && checked) {
                // 询问用户并修改请求
                const scriptText = consoleBox.val();
                if (!!scriptText) {
                    try {
                        body = JSON.parse(body);
                        const {log, debug} = console;
                        eval(scriptText);
                        body = JSON.stringify(body);
                    } catch(err) {
                        const {log, debug} = console;
                        eval(scriptText);
                    }
                }
            }
            arguments[0] = body;
            return super.send(...arguments);
        }


        open() {
            const method = arguments[0];
            const url = arguments[1];
            this.url = url;

            let localOnreadystatechange = this.onreadystatechange;
            Object.defineProperty(this, 'onreadystatechange', {
                set(v) {
                    localOnreadystatechange = v;
                }
            });

            super.onreadystatechange = () => {
                if (this.status == 200) {
                    // const text = super.responseText;
                    // console.log(super.responseText);
                    // 询问用户并修改响应
                    // if (text) {
                    //     const userResponse = window.prompt('修改返回值', text);
                    //     this.responseText = userResponse ? userResponse : super.responseText;
                    // } else {
                    //     this.responseText = super.responseText;
                    // }
                }
                if (localOnreadystatechange) {
                    localOnreadystatechange();
                }
            }
            return super.open(...arguments);
        }
    }

    window.XMLHttpRequest = CustomHttpRequest;
})();