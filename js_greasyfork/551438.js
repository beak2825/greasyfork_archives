// ==UserScript==
// @name         2048增强插件
// @namespace    none
// @version      0.4.9
// @description  2048论坛帖子加载预览图和链接，内容独立显示在标题下方，悬浮图片根据宽高比自动缩放，并智能去除翻页时的重复帖子。悬浮标题1.5秒可加载全部图片。新增付费贴检测。
// @author       nonono
// @match        *://2048.cc/*
// @grant        none
// @require      https://cdnjs.cloudflare.com/ajax/libs/jquery/3.7.1/jquery.min.js
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/551438/2048%E5%A2%9E%E5%BC%BA%E6%8F%92%E4%BB%B6.user.js
// @updateURL https://update.greasyfork.org/scripts/551438/2048%E5%A2%9E%E5%BC%BA%E6%8F%92%E4%BB%B6.meta.js
// ==/UserScript==

(function ($) {
  "use strict";

  $(function () {
    const styles = `
            .userscript-content-cell { padding: 5px 0 10px !important; border: none !important; }
            .userscript-image-gallery { margin-top: 8px; display: flex; flex-wrap: wrap; gap: 8px; }
            .userscript-preview-image { height: 200px; width: auto; cursor: pointer; display: block; transition: opacity 0.2s ease; border-radius: 4px; background-color: #f0f0f0; }
            .userscript-preview-image:hover { opacity: 0.8; }
            .userscript-link, .userscript-magnet-link { padding: 5px 0; font-size: 12px; font-weight: normal; word-break: break-all; cursor: pointer; }
            .userscript-no-content-notice { color: #999; font-size: 12px; padding: 10px 0; }
            .userscript-image-count { font-size: 12px; color: #008000; margin-left: 8px; font-weight: normal; }
            #userscript-floating-image { display: none; position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%); width: auto; height: auto; max-width: 95vw; max-height: 95vh; z-index: 99999; border: 5px solid white; box-shadow: 0 10px 30px rgba(0,0,0,0.5); pointer-events: none; border-radius: 5px; }
        `;
    $("head").append(`<style>${styles}</style>`);
    $("body").append(`<img id="userscript-floating-image" src="" />`);

    $(document).on("mouseenter", ".userscript-preview-image", function () {
      const $this = $(this);
      const imageUrl = $this.attr("src");
      const naturalWidth = $this.data("naturalWidth");
      const naturalHeight = $this.data("naturalHeight");
      if (!imageUrl || !naturalWidth || !naturalHeight) return;
      const $floatingImage = $("#userscript-floating-image");
      if (naturalWidth > naturalHeight) {
        $floatingImage.css({ width: "50vw", height: "auto" });
      } else {
        $floatingImage.css({ height: "80vh", width: "auto" });
      }
      $floatingImage.attr("src", imageUrl).stop(true, true).fadeIn(100);
    });

    $(document).on("mouseleave", ".userscript-preview-image", () => {
      $("#userscript-floating-image").stop(true, true).fadeOut(100);
    });

    const ads = [".promo-container", ".nav-container", ".movie-banner", "#ads"];
    $.each(ads, (i, e) => $(e).hide());

    function copyToClipboard(text, element) {
      navigator.clipboard
        .writeText(text)
        .then(() => {
          if (element) {
            const originalText = $(element).text();
            $(element).text("已复制!").css("color", "darkred");
            setTimeout(() => {
              $(element).text(originalText).css("color", "");
            }, 1500);
          }
        })
        .catch((err) => console.error("[2048增强插件] 复制失败:", err));
    }

    if (window.location.href.includes("read.php")) {
      const readObserver = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
          if (mutation.type === "childList") {
            $(mutation.addedNodes)
              .find('.f14 a[href*="name="]')
              .addBack('.f14 a[href*="name="]')
              .each(function () {
                const $link = $(this),
                  href = $link.attr("href");
                if (href && href.includes("name=")) {
                  const st = href.substring(href.indexOf("=") + 1);
                  $link.attr(
                    "href",
                    `https://down.dataaps.com/down.php/${st}.torrent`
                  );
                }
              });
          }
        });
      });
      readObserver.observe(document.body, { childList: true, subtree: true });
    }
    const patterns = [".subject", 'th a[href*="tid"]'];
    const pattern = patterns.find((p) => $(p).length > 0);

    if (pattern) {
      function createImageElement(src, container) {
        const MIN_IMG_WIDTH = 100;
        const MIN_IMG_HEIGHT = 100;
        const $previewImg = $('<img class="userscript-preview-image" />');
        $previewImg
          .on("load", function () {
            if (
              this.naturalWidth < MIN_IMG_WIDTH ||
              this.naturalHeight < MIN_IMG_HEIGHT
            ) {
              $(this).remove();
              return;
            }
            $(this).data({
              naturalWidth: this.naturalWidth,
              naturalHeight: this.naturalHeight,
            });
          })
          .on("error", function () {
            $(this).remove();
          });
        container.append($previewImg);
        $previewImg.attr("src", src);
      }

      function expandAndShowAllImages(linkElement) {
        const $linkElement = $(linkElement);
        if ($linkElement.data("all-images-expanded")) {
          return;
        }

        const allImageUrls = $linkElement.data("allImageUrls");
        const $insertionPoint = $linkElement.closest("tr").length
          ? $linkElement.closest("tr")
          : $linkElement.closest("th, .subject");
        const $galleryContainer = $insertionPoint
          .next()
          .find(".userscript-image-gallery");

        if (
          allImageUrls &&
          allImageUrls.length > 0 &&
          $galleryContainer.length > 0
        ) {
          if (allImageUrls.length > $galleryContainer.children("img").length) {
            console.log(
              `[2048增强插件] 悬浮加载全部 ${allImageUrls.length} 张图片...`
            );
            $galleryContainer.empty();
            allImageUrls.forEach((src) => {
              createImageElement(src, $galleryContainer);
            });
            $linkElement.data("all-images-expanded", true);
          }
        }
      }

      function processPostLink(linkElement) {
        const $linkElement = $(linkElement);
        if ($linkElement.hasClass("userscript-processed")) return;

        $linkElement.addClass("userscript-processed");

        $.ajax({
          url: linkElement.href,
          method: "get",
          success: function (data) {
            const $data = $(data);
            const $titleRow = $linkElement.closest("tr");
            const $insertionPoint = $titleRow.length
              ? $titleRow
              : $linkElement.closest("th, .subject");

            // ===== 新增功能：检测付费内容 =====
            const $postContentForCheck = $data.find(".f14");
            if ($postContentForCheck.text().includes("本内容需向作者支付")) {
              $linkElement.before(
                '<span style="color: red; font-weight: bold;">【付费】</span>'
              );
            }
            // =====================================

            const $contentCell = $(
              '<td colspan="5" class="userscript-content-cell"></td>'
            );
            let contentAdded = false;

            const IGNORED_PATHS = [
              "/smilies/",
              "/faces/",
              "/rank/",
              "/level/",
              "thumb-ing.gif",
            ];

            const allImageUrls = $data
              .find('.f14 img, img[iyl-data="adblo_ck.jpg"]')
              .map(function () {
                const $imgNode = $(this);
                let imgSrc = $imgNode.data("original") || this.src;
                if (!imgSrc) return null;
                try {
                  imgSrc = new URL(imgSrc, linkElement.href).href;
                } catch (e) {
                  return null;
                }
                if ($imgNode.closest(".signature, .user-pic").length > 0)
                  return null;
                if (IGNORED_PATHS.some((path) => imgSrc.includes(path)))
                  return null;
                return imgSrc;
              })
              .get();

            const uniqueImageUrls = [...new Set(allImageUrls)];
            const totalImageCount = uniqueImageUrls.length;

            if (totalImageCount > 0) {
              $linkElement.data("allImageUrls", uniqueImageUrls);
            }

            if (totalImageCount > 0) {
              $linkElement.after(
                `<span class="userscript-image-count">[共${totalImageCount}张图片]</span>`
              );
            }

            const magnetText = (() => {
              const $postContent = $data.find(".f14");
              if (!$postContent.length) return null;
              const contentText = $postContent.text();
              const magnetMatch = contentText.match(
                /(magnet:\?xt=urn:btih:[a-f0-9]{32,40})/i
              );
              if (magnetMatch && magnetMatch[0]) return magnetMatch[0];
              const seedCodeMatch = contentText.match(/([A-F0-9]{40})/i);
              if (seedCodeMatch && seedCodeMatch[1])
                return `magnet:?xt=urn:btih:${seedCodeMatch[1]}`;
              return null;
            })();

            const downloadUrl = (() => {
              if (magnetText) return null;

              const $postContent = $data.find(".f14");
              if (!$postContent.length) return null;

              const $downloadLink = $postContent
                .find(
                  'a[href*="bt.bxmho.cn/list.php?name="], a[href*=".torrent"], a[href*="down.php/"]'
                )
                .first();
              if ($downloadLink.length > 0) {
                try {
                  return new URL($downloadLink.attr("href"), linkElement.href)
                    .href;
                } catch (e) {
                  console.warn(
                    "[2048增强插件] 解析下载链接时出错:",
                    $downloadLink.attr("href"),
                    e
                  );
                }
              }

              const contentText = $postContent.text();
              let urlMatch = contentText.match(
                /https?:\/\/bt\.bxmho\.cn\/list\.php\?name=[a-f0-9]+/i
              );
              if (urlMatch && urlMatch[0]) {
                return urlMatch[0];
              }
              const textNodes = $postContent.contents().filter(function () {
                return (
                  this.nodeType === 3 && /下载[网地]址/.test(this.nodeValue)
                );
              });
              if (textNodes.length > 0) {
                const parentText = textNodes.first().parent().text();
                const genericUrlMatch = parentText.match(/https?:\/\/[^\s<]+/);
                if (genericUrlMatch) return genericUrlMatch[0];
              }

              return null;
            })();

            if (magnetText) {
              const $magnetElement = $(
                `<div class="userscript-magnet-link">${magnetText}</div>`
              );
              $magnetElement.on("click", function () {
                copyToClipboard(magnetText, this);
              });
              $contentCell.append($magnetElement);
              contentAdded = true;
            }

            if (downloadUrl) {
              const $link = $(
                `<div class="userscript-link">${downloadUrl}</div>`
              );
              $link.on("click", function () {
                window.open(downloadUrl, "_blank");
                copyToClipboard(downloadUrl, this);
              });
              $contentCell.append($link);
              contentAdded = true;
            }

            if (totalImageCount > 0) {
              const imageLimit = 3;
              const $galleryContainer = $(
                '<div class="userscript-image-gallery"></div>'
              );
              uniqueImageUrls.slice(0, imageLimit).forEach((src) => {
                createImageElement(src, $galleryContainer);
              });

              $contentCell.append($galleryContainer);
              contentAdded = true;
            }

            if (!contentAdded) {
              $contentCell.append(
                '<div class="userscript-no-content-notice">[未在本帖中找到有效的图片或下载链接]</div>'
              );
            }

            const $finalContainer = $insertionPoint.is("tr")
              ? $("<tr></tr>").append($contentCell)
              : $contentCell;
            $insertionPoint.after($finalContainer);
          },
          error: function () {
            $linkElement.addClass("userscript-processed-error");
          },
        });
      }

      const observerOptions = {
        root: null,
        rootMargin: "300px 0px",
        threshold: 0.01,
      };
      const observer = new IntersectionObserver((entries, obs) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            processPostLink(entry.target);
            obs.unobserve(entry.target);
          }
        });
      }, observerOptions);

      const SESSION_KEY = "processedTids";
      const getUrlParam = (url, param) => {
        try {
          const urlObj = new URL(url);
          const page = urlObj.searchParams.get(param);
          return page ? parseInt(page, 10) : 1;
        } catch (e) {
          return 1;
        }
      };

      let processedTids;
      try {
        const storedTids = sessionStorage.getItem(SESSION_KEY);
        processedTids = new Set(storedTids ? JSON.parse(storedTids) : []);
      } catch (e) {
        processedTids = new Set();
      }

      const currentPage = getUrlParam(window.location.href, "page");
      const referrerPage = getUrlParam(document.referrer, "page");

      if (
        (!document.referrer.includes("thread.php") &&
          !document.referrer.includes("search.php")) ||
        currentPage <= referrerPage
      ) {
        processedTids.clear();
        console.log("[2048增强插件] 检测到后退或新会话，TID记录已重置。");
      }

      $(window).on("beforeunload", function () {
        try {
          sessionStorage.setItem(
            SESSION_KEY,
            JSON.stringify([...processedTids])
          );
        } catch (e) {
          console.error("[2048增强插件] 保存TID记录失败:", e);
        }
      });

      const $allPostLinks = $(pattern);
      const totalPostCount = $allPostLinks.length;
      let hiddenPostCount = 0;
      const hiddenPostElements = [];

      $allPostLinks.each(function () {
        const $link = $(this);
        const href = $link.attr("href");
        const tidMatch = href ? href.match(/tid=(\d+)/) : null;

        if (tidMatch) {
          const tid = tidMatch[1];
          if (processedTids.has(tid)) {
            $link.closest("tr").hide();
            hiddenPostCount++;
            hiddenPostElements.push(this);
            return;
          }
          processedTids.add(tid);
        }

        if (!$link.hasClass("userscript-processed")) {
          observer.observe(this);
        }

        let hoverTimer;
        $link
          .on("mouseenter", () => {
            if (!$link.hasClass("userscript-processed")) {
              return;
            }
            hoverTimer = setTimeout(() => {
              expandAndShowAllImages($link[0]);
            }, 1000);
          })
          .on("mouseleave", () => {
            clearTimeout(hoverTimer);
          });
      });

      if (hiddenPostCount > 0) {
        console.log(
          `[2048增强插件] 当前页面存在 ${hiddenPostCount} 个重复帖子，已隐藏。`
        );
      }

      const visiblePostCount = totalPostCount - hiddenPostCount;
      if (
        totalPostCount > 0 &&
        (hiddenPostCount === totalPostCount || visiblePostCount < 5)
      ) {
        console.warn(
          `[2048增强插件] 异常去重检测! 总帖:${totalPostCount}, 隐藏:${hiddenPostCount}。触发恢复机制。`
        );
        processedTids.clear();
        sessionStorage.removeItem(SESSION_KEY);
        console.log("[2048增强插件] 已清空所有TID记录。");
        $(hiddenPostElements).each(function () {
          const linkElement = this;
          $(linkElement).closest("tr").show();
          observer.observe(linkElement);
        });
        console.log(
          `[2048增强插件] 已恢复显示 ${hiddenPostElements.length} 个帖子并为其启用内容加载。`
        );
      }
    }
  });
})(jQuery);
