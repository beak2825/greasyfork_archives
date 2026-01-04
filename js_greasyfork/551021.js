// ==UserScript==
// @name         Hide LinkedIn Promoted Posts with CSS
// @namespace    http://tampermonkey.net/
// @version      1.1.4
// @description  Hide promoted posts on LinkedIn feed using CSS
// @name:es      Ocultar publicaciones patrocinadas de LinkedIn con CSS
// @description:es Oculta las publicaciones patrocinadas en el feed de LinkedIn usando CSS
// @name:fr      Masquer les publications sponsorisées de LinkedIn avec CSS
// @description:fr Masque les publications sponsorisées dans le flux LinkedIn en utilisant CSS
// @name:de      LinkedIn gesponserte Beiträge mit CSS ausblenden
// @description:de Blendet gesponserte Beiträge im LinkedIn-Feed mit CSS aus
// @name:it      Nascondi i post sponsorizzati di LinkedIn con CSS
// @description:it Nasconde i post sponsorizzati nel feed di LinkedIn utilizzando CSS
// @name:pt      Ocultar postagens patrocinadas do LinkedIn com CSS
// @description:pt Oculta postagens patrocinadas no feed do LinkedIn usando CSS
// @name:zh-CN   使用CSS隐藏LinkedIn推广帖子
// @description:zh-CN 使用CSS隐藏LinkedIn信息流中的推广帖子
// @name:zh-TW   使用CSS隱藏LinkedIn推廣貼文
// @description:zh-TW 使用CSS隱藏LinkedIn動態消息中的推廣貼文
// @name:ja      LinkedInのプロモート投稿をCSSで非表示にする
// @description:ja LinkedInのフィード内のプロモート投稿をCSSを使用して非表示にします
// @name:ko      CSS로 LinkedIn 프로모션 게시물 숨기기
// @description:ko CSS를 사용하여 LinkedIn 피드에서 프로모션 게시물을 숨깁니다
// @name:ru      Скрыть рекламные посты LinkedIn с помощью CSS
// @description:ru Скрывает рекламные посты в ленте LinkedIn с использованием CSS
// @name:ar      إخفاء المنشورات الترويجية على LinkedIn باستخدام CSS
// @description:ar يخفي المنشورات الترويجية في تغذية LinkedIn باستخدام CSS
// @name:hi      CSS के साथ LinkedIn प्रायोजित पोस्ट छिपाएँ
// @description:hi CSS का उपयोग करके LinkedIn फीड में प्रायोजित पोस्ट को छिपाएँ
// @name:nl      LinkedIn gesponsorde berichten verbergen met CSS
// @description:nl Verbergt gesponsorde berichten in de LinkedIn-feed met behulp van CSS
// @name:sv      Dölj sponsrade inlägg på LinkedIn med CSS
// @description:sv Döljer sponsrade inlägg i LinkedIn-flödet med hjälp av CSS
// @name:tr      LinkedIn tanıtım gönderilerini CSS ile gizle
// @description:tr CSS kullanarak LinkedIn akışındaki tanıtım gönderilerini gizler
// @name:pl      Ukryj promowane posty na LinkedIn za pomocą CSS
// @description:pl Ukrywa promowane posty w kanale LinkedIn przy użyciu CSS
// @name:vi      Ẩn bài đăng được quảng cáo trên LinkedIn bằng CSS
// @description:vi Ẩn các bài đăng được quảng cáo trong nguồn cấp dữ liệu LinkedIn bằng cách sử dụng CSS
// @name:el      Απόκρυψη προωθημένων δημοσιεύσεων LinkedIn με CSS
// @description:el Αποκρύπτει τις προωθημένες δημοσιεύσεις στη ροή του LinkedIn χρησιμοποιώντας CSS
// @name:id      Sembunyikan Postingan Promosi LinkedIn dengan CSS
// @description:id Sembunyikan postingan promosi di umpan LinkedIn menggunakan CSS
// @namespace    http://tampermonkey.net/
// @author       aspen138
// @match        *://www.linkedin.com/feed/*
// @match        *://www.linkedin.com/feed/
// @grant        GM_addStyle
// @run-at       document-end
// @license      MIT
// @icon         https://static.licdn.com/aero-v1/sc/h/8a1a8xqjolkyjbf9n3i40oimj
// @downloadURL https://update.greasyfork.org/scripts/551021/Hide%20LinkedIn%20Promoted%20Posts%20with%20CSS.user.js
// @updateURL https://update.greasyfork.org/scripts/551021/Hide%20LinkedIn%20Promoted%20Posts%20with%20CSS.meta.js
// ==/UserScript==


(function() {
    'use strict';

    // Cache for already processed posts to avoid re-processing
    const processedPosts = new WeakSet();

    // More specific selector to reduce initial query scope
    const PROMOTED_SELECTOR = 'span[aria-hidden="true"]';
    const POST_CONTAINER_SELECTOR = '.feed-shared-update-v2[role="article"]';
    const PROMOTED_TEXT = 'Promoted';
    const HIDE_CLASS = 'hide-promoted-post';

    // Function to check if element contains promoted text
    function isPromotedSpan(span) {
        return span.textContent?.trim() === PROMOTED_TEXT;
    }

    // Function to hide a single promoted post
    function hidePromotedPost(postContainer) {
        if (!processedPosts.has(postContainer)) {
            postContainer.classList.add(HIDE_CLASS);
            processedPosts.add(postContainer);
        }
    }

    // Optimized function to find and mark promoted posts
    function markPromotedPosts(rootElement = document) {
        // Use more efficient querying strategy
        const posts = rootElement.querySelectorAll(POST_CONTAINER_SELECTOR);

        posts.forEach(post => {
            // Skip if already processed
            if (processedPosts.has(post)) return;

            // Look for promoted spans only within this post
            const promotedSpan = Array.from(
                post.querySelectorAll(PROMOTED_SELECTOR)
            ).find(isPromotedSpan);

            if (promotedSpan) {
                hidePromotedPost(post);
            }
        });
    }

    // Process only newly added nodes
    function processNewNodes(mutations) {
        const nodesToProcess = new Set();

        for (const mutation of mutations) {
            // Skip if no nodes were added
            if (!mutation.addedNodes.length) continue;

            for (const node of mutation.addedNodes) {
                // Skip text nodes and other non-element nodes
                if (node.nodeType !== Node.ELEMENT_NODE) continue;

                // Check if the node itself is a post container
                if (node.matches?.(POST_CONTAINER_SELECTOR)) {
                    nodesToProcess.add(node);
                }

                // Check for post containers within the added node
                if (node.querySelectorAll) {
                    const posts = node.querySelectorAll(POST_CONTAINER_SELECTOR);
                    posts.forEach(post => nodesToProcess.add(post));
                }
            }
        }

        // Process each unique post container once
        nodesToProcess.forEach(post => {
            if (processedPosts.has(post)) return;

            const promotedSpan = Array.from(
                post.querySelectorAll(PROMOTED_SELECTOR)
            ).find(isPromotedSpan);

            if (promotedSpan) {
                hidePromotedPost(post);
            }
        });
    }

    // Inject CSS to hide elements with the class
    GM_addStyle(`
        .${HIDE_CLASS} {
            display: none !important;
        }
    `);

    // Wait for initial page load to complete
    function initialize() {
        // Process existing posts
        markPromotedPosts();

        // Set up optimized observer
        const observer = new MutationObserver(processNewNodes);

        // Observe with more specific configuration
        observer.observe(document.body, {
            childList: true,
            subtree: true,
            attributes: false,  // Don't watch for attribute changes
            characterData: false  // Don't watch for text changes
        });
    }

    // Start when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initialize);
    } else {
        // DOM already loaded
        initialize();
    }
})();