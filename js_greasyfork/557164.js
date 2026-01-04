// ==UserScript==
// @name         AV01.tv 1080P
// @namespace    GRSYFK0
// @version      0.0.3
// @description  尝试获取 AV01.tv 1080P 资源，需配合猫抓或其它 m3u8 嗅探工具调用本地播放器播放。
// @icon         https://www.av01.xyz/static/pwa-64x64.png
// @author       GRSYFK0
// @license      MIT
// @match        *://www.av01.tv/*
// @match        *://www.av01.media/*
// @grant        unsafeWindow
// @downloadURL https://update.greasyfork.org/scripts/557164/AV01tv%201080P.user.js
// @updateURL https://update.greasyfork.org/scripts/557164/AV01tv%201080P.meta.js
// ==/UserScript==

/* jshint esversion: 8 */

(function() {
  'use strict';

  const response_json = unsafeWindow.Response.prototype.json;
  unsafeWindow.Response.prototype.json = async function () {
    try {
      const json = await response_json.call(this);

      // 保证调用者能拿到结果
      if ( this.url && this.url.includes("playlist") ) {
        // 提取 base64 部分并解码
        const playlist_base64 = json.src.split(",")[1];
        const playlist_m3u8 = atob(playlist_base64);
        const playlist_m3u8_lines = playlist_m3u8.split("\n");

        // 提取 playlist 所含资源
        let variants = [];
        for ( let i = 0; i < playlist_m3u8_lines.length; i ++ ) {
          if ( playlist_m3u8_lines[i].startsWith("#EXT-X-STREAM-INF") ) {
            const resolution_match = playlist_m3u8_lines[i].match(/RESOLUTION=(\d+x\d+)/);
            const url = playlist_m3u8_lines[i + 1];
            const url_v_match = playlist_m3u8_lines[i + 1].match(/index45va-v(\d)/);

            if ( resolution_match && url_v_match ) {
              variants.push({
                resolution: resolution_match[1],
                url,
                url_v: url_v_match[1]
              })
            }
          }
        }

        if ( variants.length ) {
          let vod_play_list_url = [];

          // 检查 playlist 所含资源是否可用
          for ( const variant of variants ) {
            // 用 await fetch + await .text()
            const response_url = await fetch(variant.url, {
              method: "GET"
            });
            const response_url_text = await response_url.text();

            if ( response_url_text.match(/file45va-1-v\d-a1.ts/) ) {
              vod_play_list_url.push({
                name: variant.resolution,
                url: variant.url
              })
            }
          }

          // 额外逻辑：尝试补充 1080p
          if ( variants.length === 1 && variants[0].resolution === "1280x720" ) {
            const url_v = variants[0].url_v === "1" ? "2" : "1";
            const url = variants[0].url.replace(/index45va-v\d/, `index45va-v${url_v}`);
            const response_url = await fetch(url, {
              method: "GET",
              headers: {
                Range: "bytes=0-159"
              }
            });
            const response_url_text = await response_url.text();
            if ( response_url_text.match(/file45va-1-v\d-a1.ts/) ) {
              vod_play_list_url.push({
                name: "1920x1080",
                url
              })
            }
          }
          else {
            if ( variants.length === 2 && variants.every(v => v.resolution !== "1920x1080") ) {
              const url = variants[0].url.replace(/index45va-v\d/, `index45va-v3`);
              const response_url = await fetch(url, {
                method: "GET",
                headers: {
                  Range: "bytes=0-159"
                }
              });
              const response_url_text = await response_url.text();
              if ( response_url_text.match(/file45va-1-v\d-a1.ts/) ) {
                vod_play_list_url.push({
                  name: "1920x1080",
                  url
                })
              }
            }
          }

          // 按宽度排序
          vod_play_list_url.sort((a, b) => {
            // 提取宽度
            const aw = parseInt(a.name.split("x")[0], 10);
            const bw = parseInt(b.name.split("x")[0], 10);

            // 按宽度从大到小排序
            return bw - aw
          });

          console.log("[最终播放列表]", vod_play_list_url)
        }
      }

      return json // 保证原始调用者能拿到结果
    } catch (err) {
      return Promise.reject(err)
    }
  }
})();