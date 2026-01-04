// ==UserScript==
// @name         Advanced Fetch Interceptor
// @namespace    http://tampermonkey.net/
// @version      2.1
// @description  複数パターンのfetchレスポンス書き換え
// @author       You
// @match        https://oykenkyu.blogspot.com/*
// @grant        none
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/561262/Advanced%20Fetch%20Interceptor.user.js
// @updateURL https://update.greasyfork.org/scripts/561262/Advanced%20Fetch%20Interceptor.meta.js
// ==/UserScript==
 
 (function () {
   "use strict";
 
   const originalFetch = window.fetch;
 
   // URLパターンとレスポンス変換関数のマッピング
   const interceptRules = [
     {
       // 文字列マッチ
       pattern: "pagead2.googlesyndication.com/pagead/js/adsbygoogle.js",
       handler: async (response, url) => {
         return new Response(
             "",
           {
             status: 200,
             headers: new Headers({
                 "content-length": "0",
             })
           },
         );
       },
     },
     {
       // 文字列マッチ
       pattern: "www.googletagservices.com/tag/js/gpt.js",
       handler: async (response, url) => {
         return new Response(
             "",
           {
             status: 200,
             headers: new Headers({
                 "content-length": "0",
             })
           },
         );
       },
     },
   ];
 
   window.fetch = async function (...args) {
     const [resource, config] = args;
     const url = typeof resource === "string" ? resource : resource.url;
 
     const response = await originalFetch.apply(this, args);
 
     // マッチするルールを探す
     for (const rule of interceptRules) {
       const isMatch =
         typeof rule.pattern === "string"
           ? url.includes(rule.pattern)
           : rule.pattern.test(url);
 
       if (isMatch) {
         try {
           console.log(`Intercepting: ${url}`);
           return await rule.handler(response.clone(), url);
         } catch (e) {
           console.error("Intercept error:", e);
           return response;
         }
       }
     }
 
     return response;
   };
 
   console.log("Advanced fetch interceptor loaded");
 })();