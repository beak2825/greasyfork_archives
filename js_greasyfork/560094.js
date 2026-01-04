// ==UserScript==
// @name        Reddit Hover Zoom (V9 - Speed Demon)
// @namespace   http://tampermonkey.net/
// @version     9.0
// @description Tốc độ tối đa. Tái sử dụng DOM để load video tức thì. Hỗ trợ Album.
// @author      Gemini
// @match       https://old.reddit.com/*
// @match       https://www.reddit.com/*
// @grant       none
// @license     MIT
// @downloadURL https://update.greasyfork.org/scripts/560094/Reddit%20Hover%20Zoom%20%28V9%20-%20Speed%20Demon%29.user.js
// @updateURL https://update.greasyfork.org/scripts/560094/Reddit%20Hover%20Zoom%20%28V9%20-%20Speed%20Demon%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // --- CẤU HÌNH ---
    const MAX_WIDTH = 800;
    const OFFSET = 20;
    const HOVER_DELAY = 10; // Giảm xuống 10ms (gần như tức thì nhưng tránh nháy)

    // --- SETUP UI (TẠO SẴN 1 LẦN DUY NHẤT) ---
    // Khung chứa
    const previewBox = document.createElement('div');
    previewBox.id = 'v9-speed-box';
    Object.assign(previewBox.style, {
        position: 'fixed', zIndex: '2147483647', display: 'none', pointerEvents: 'none',
        boxShadow: '0 5px 20px rgba(0,0,0,0.8)', background: '#000', borderRadius: '4px',
        maxWidth: MAX_WIDTH + 'px', maxHeight: '98vh', overflow: 'hidden', lineHeight: '0',
        willChange: 'top, left, width, height' // Báo trình duyệt tối ưu render
    });
    document.body.appendChild(previewBox);

    // Thẻ ẢNH (Tạo sẵn)
    const imgEl = document.createElement('img');
    Object.assign(imgEl.style, { maxWidth: '100%', maxHeight: '98vh', display: 'none', objectFit: 'contain' });
    previewBox.appendChild(imgEl);

    // Thẻ VIDEO (Tạo sẵn - Quan trọng để load nhanh)
    const vidEl = document.createElement('video');
    vidEl.muted = true; vidEl.loop = true; vidEl.controls = false; vidEl.autoplay = true; vidEl.preload = 'auto';
    Object.assign(vidEl.style, { maxWidth: '100%', maxHeight: '98vh', display: 'none', background: '#000' });
    previewBox.appendChild(vidEl);

    // --- STATE ---
    let hoverTimeout;
    let cache = {};
    let activeUrl = null; // URL đang được xử lý
    let lastX = 0, lastY = 0;

    // --- LOGIC XỬ LÝ ---
    function fastCheck(url) {
        let cleanUrl = url.split('?')[0];
        if (url.includes('imgur.com') && url.endsWith('.gifv')) return { type: 'video', src: url.replace('.gifv', '.mp4') };
        if (url.includes('preview.redd.it')) return { type: 'image', src: url.replace('preview.redd.it', 'i.redd.it').split('?')[0] };
        if (cleanUrl.match(/\.(mp4|webm)$/i)) return { type: 'video', src: url };
        if (cleanUrl.match(/\.(jpg|jpeg|png|webp|gif)$/i)) return { type: 'image', src: url };
        return null;
    }

    async function deepScan(url) {
        try {
            const res = await fetch(url.split('?')[0] + '.json');
            const data = await res.json();
            const post = data[0].data.children[0].data;

            // 1. Video
            let vid = post.secure_media?.reddit_video?.fallback_url || post.media?.reddit_video?.fallback_url || post.preview?.reddit_video_preview?.fallback_url;
            if (vid) return { type: 'video', src: vid.split('?')[0].replace(/&amp;/g, '&') };

            // 2. Cross-post Video
            if (post.crosspost_parent_list?.[0]) {
                let cross = post.crosspost_parent_list[0];
                let crossVid = cross.secure_media?.reddit_video?.fallback_url || cross.preview?.reddit_video_preview?.fallback_url;
                if (crossVid) return { type: 'video', src: crossVid.split('?')[0] };
                if (cross.is_gallery === true && cross.media_metadata) {
                     let img = extractGalleryImage(cross);
                     if (img) return { type: 'image', src: img };
                }
            }

            // 3. Album / Gallery
            if (post.is_gallery === true && post.media_metadata) {
                let img = extractGalleryImage(post);
                if (img) return { type: 'image', src: img };
            }

            // 4. Ảnh thường
            let img = post.preview?.images?.[0]?.source?.url;
            if (img) return { type: 'image', src: img.replace(/&amp;/g, '&') };

        } catch (e) { /* Bỏ qua lỗi */ }
        return null;
    }

    function extractGalleryImage(postData) {
        try {
            let items = postData.gallery_data?.items;
            let firstId = (items && items.length > 0) ? items[0].media_id : Object.keys(postData.media_metadata)[0];
            if (firstId && postData.media_metadata[firstId]?.s?.u) {
                return postData.media_metadata[firstId].s.u.replace(/&amp;/g, '&');
            }
        } catch (e) {}
        return null;
    }

    // --- HIỂN THỊ (Tối ưu hóa) ---
    function showMedia(media) {
        // Ẩn tất cả trước
        imgEl.style.display = 'none';
        vidEl.style.display = 'none';

        if (media.type === 'video') {
            // Tái sử dụng thẻ video
            vidEl.src = media.src;
            vidEl.style.display = 'block';

            // Ép chạy ngay lập tức
            const playPromise = vidEl.play();
            if (playPromise !== undefined) {
                playPromise.catch(error => {}); // Chặn lỗi nếu DOM chưa sẵn sàng
            }
        } else {
            // Tái sử dụng thẻ img
            imgEl.src = media.src;
            imgEl.style.display = 'block';
        }

        previewBox.style.display = 'block';
        updatePosition(lastX, lastY);
    }

    // --- SỰ KIỆN CHÍNH ---
    async function onHover(target, originalUrl) {
        activeUrl = originalUrl;

        // 1. Check Cache
        if (cache[originalUrl]) {
            showMedia(cache[originalUrl]);
            return;
        }

        // 2. Fast Path
        const fastResult = fastCheck(originalUrl);
        if (fastResult) {
            cache[originalUrl] = fastResult;
            if (activeUrl === originalUrl) showMedia(fastResult);
            return;
        }

        // 3. Deep Scan (Chạy song song)
        let redditUrl = originalUrl;
        if (!originalUrl.includes('/comments/') && !originalUrl.includes('/gallery/')) {
             const thing = target.closest('.thing');
             if (thing && thing.dataset.permalink) redditUrl = 'https://old.reddit.com' + thing.dataset.permalink;
             else return;
        }

        const deepResult = await deepScan(redditUrl);
        if (deepResult) {
            cache[originalUrl] = deepResult;
            if (activeUrl === originalUrl) showMedia(deepResult);
        }
    }

    // --- POSITIONING ---
    function updatePosition(x, y) {
        if (previewBox.style.display === 'none') return;
        const box = previewBox.getBoundingClientRect();
        const vw = window.innerWidth, vh = window.innerHeight;

        let top = y + OFFSET, left = x + OFFSET;
        if (left + box.width > vw - 10) left = x - box.width - OFFSET;
        if (left < 10) left = 10;
        if (top + box.height > vh - 10) top = vh - box.height - 10;
        if (top < 10) top = 10;

        previewBox.style.top = top + 'px';
        previewBox.style.left = left + 'px';
    }

    // --- EVENT LISTENERS ---
    document.body.addEventListener('mousemove', (e) => {
        lastX = e.clientX; lastY = e.clientY;
        updatePosition(lastX, lastY);
    });

    document.body.addEventListener('mouseover', (e) => {
        let target = e.target.closest('a') || e.target.closest('img');
        if (target && target.tagName === 'IMG') target = target.closest('a') || target;

        if (!target || !target.href || target.href.includes('/user/') || target.href.includes('javascript:')) return;

        // Xóa timeout cũ nếu lướt quá nhanh
        clearTimeout(hoverTimeout);

        // Gọi hàm xử lý NGAY LẬP TỨC để fetch dữ liệu (Parallel Fetching)
        // Nhưng đặt timeout hiển thị để tránh nháy nếu lướt qua cực nhanh
        const url = target.href;
        hoverTimeout = setTimeout(() => onHover(target, url), HOVER_DELAY);
    });

    document.body.addEventListener('mouseout', (e) => {
        let target = e.target.closest('a') || e.target.closest('img');
        if (target) {
            clearTimeout(hoverTimeout);
            activeUrl = null;
            previewBox.style.display = 'none';
            // Dừng video ngay lập tức để tiết kiệm tài nguyên
            vidEl.pause();
            vidEl.src = '';
            imgEl.src = '';
        }
    });

})();