// ==UserScript==
// @name               Twitter Media Downloader (AI Preview & Sort)
// @version            2026.01.12.1
// @description        Advanced AI with multi-band comparison, cross-correlation, luminance flow, and subject continuity for robust split-image merging. Auto-previews split images.
// @author             Mayday1212, Modified by AI
// @license MIT
// @match              https://x.com/*
// @match              https://twitter.com/*
// @grant              GM_registerMenuCommand
// @grant              GM_setValue
// @grant              GM_getValue
// @grant              GM_download
// @require            https://cdnjs.cloudflare.com/ajax/libs/jszip/3.7.1/jszip.min.js
// @namespace https://greasyfork.org/users/1282080
// @downloadURL https://update.greasyfork.org/scripts/562450/Twitter%20Media%20Downloader%20%28AI%20Preview%20%20Sort%29.user.js
// @updateURL https://update.greasyfork.org/scripts/562450/Twitter%20Media%20Downloader%20%28AI%20Preview%20%20Sort%29.meta.js
// ==/UserScript==

/* jshint esversion: 8 */
const TMD = (function () {
    let host
    let processingQueue = [];
    let isProcessing = false;
    let observer;

    const processQueue = async () => {
        if (isProcessing || processingQueue.length === 0) return;
        isProcessing = true;
        const task = processingQueue.shift();
        try {
            await task();
        } catch (e) {
            console.error(e);
        } finally {
            isProcessing = false;
            // Small delay to be nice to the CPU/Network
            setTimeout(processQueue, 300);
        }
    };

    return {
        init: async function () {
            host = location.hostname
            document.head.insertAdjacentHTML('beforeend', '<style>' + this.css + '</style>')

            // Standard mutation observer for DOM changes
            let mo = new MutationObserver(ms => ms.forEach(m => m.addedNodes.forEach(node => this.detect(node))))
            mo.observe(document.body, { childList: true, subtree: true })

            // Intersection Observer for Auto-Preview (Lazy Loading)
            observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const article = entry.target;
                        observer.unobserve(article); // Run once
                        // Add to processing queue
                        processingQueue.push(() => this.execAutoPreview(article));
                        processQueue();
                    }
                });
            }, { rootMargin: '200px' }); // Preload when slightly out of view
        },
        detect: function (node) {
            let article = node.tagName == 'ARTICLE' && node || node.tagName == 'DIV' && (node.querySelector('article') || node.closest('article'))
            if (article) this.addButtonTo(article)
        },
        addButtonTo: function (article) {
            if (article.dataset.detected) return
            article.dataset.detected = 'true'

            let status_link = article.querySelector('a[href*="/status/"]')
            if (!status_link) return

            let status_id = status_link.href.split('/status/').pop().split('/').shift()
            let btn_group = article.querySelector('div[role="group"]:last-of-type')
            if (!btn_group) return

            let btn_share = Array.from(btn_group.querySelectorAll(':scope>div>div')).pop().parentNode

            // 1. ORIGINAL BUTTON (Standard Download)
            let btn_down = btn_share.cloneNode(true)
            btn_down.removeAttribute('href');
            btn_down.querySelector('svg').innerHTML = this.svg
            this.status(btn_down, 'tmd-down')
            btn_group.insertBefore(btn_down, btn_share.nextSibling)
            btn_down.onclick = (e) => {
                e.preventDefault();
                e.stopPropagation();
                e.stopImmediatePropagation();
                this.click(btn_down, status_id, false);
            }

            // 2. MERGE BUTTON (AI Preview + Download)
            const photoLinks = Array.from(article.querySelectorAll('a[href*="/photo/"]'));
            const uniquePhotos = new Set(photoLinks.map(link => link.href.split('/photo/')[1].split('/')[0]));

            if (uniquePhotos.size > 1) {
                let btn_merge = btn_share.cloneNode(true)
                btn_merge.removeAttribute('href');
                btn_merge.querySelector('svg').innerHTML = this.svg_merge
                this.status(btn_merge, 'tmd-down tmd-merge')
                btn_group.insertBefore(btn_merge, btn_down.nextSibling)
                btn_merge.onclick = (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    e.stopImmediatePropagation();
                    this.click(btn_merge, status_id, true);
                }

                // AUTO-PREVIEW SPLIT IMAGES (Lazy)
                observer.observe(article);
            }
        },

        checkAutoPreview: function (article) {
            // Deprecated direct call, logic moved to execAutoPreview
        },

        execAutoPreview: async function (article) {
            if (article.dataset.previewed) return;

            const photoLinks = Array.from(article.querySelectorAll('a[href*="/photo/"]'));
            const uniquePhotos = new Set(photoLinks.map(link => link.href.split('/photo/')[1].split('/')[0]));

            if (uniquePhotos.size <= 1) return;

            // Use DOM images directly to avoid extra high-res fetches
            const validUrls = [];
            photoLinks.forEach(link => {
                const img = link.querySelector('img');
                if (img && img.src) {
                    validUrls.push(img.src);
                }
            });

            if (validUrls.length < 2) return;

            article.dataset.previewed = 'processing';

            try {
                const images = await Promise.all(validUrls.map(url => {
                    return new Promise((resolve, reject) => {
                        const img = new Image();
                        img.crossOrigin = "anonymous";
                        img.onload = () => resolve(img);
                        img.onerror = () => reject("Image load failed");
                        img.src = url;
                        // Handle cached case
                        if (img.complete) {
                            if (img.naturalWidth > 0) resolve(img);
                        }
                    });
                }));

                // Run AI Sort with normalized scoring
                const { images: orderedImages, score, avgScore } = this.aiSort(images);

                // THRESHOLD: Raw Score < 45000 (Calibrated for v2026.01.12.98+)
                if (avgScore < 50000) {
                    console.log(`[TMD] Auto-Previewing (Score: ${avgScore.toFixed(1)})`);
                    this.replaceGridWithPreview(article, photoLinks, orderedImages);
                    article.dataset.previewed = 'done';
                } else {
                    article.dataset.previewed = 'skipped';
                }

            } catch (e) {
                article.dataset.previewed = 'error';
                // Retry? No, prevent loops.
            }
        },

        replaceGridWithPreview: function (article, photoLinks, orderedImages) {
            // Find common ancestor container for the grid
            const findCommonAncestor = (nodes) => {
                const parents = nodes.map(n => n.parentElement);
                // Simple heuristic: go up until one parent contains all links
                let current = parents[0];
                while (current && current !== article) {
                    if (nodes.every(n => current.contains(n))) {
                        // Check if this container is "tight" (not the whole article)
                        // Usually the media container has a specific class or role,
                        // but finding the smallest common ancestor is usually correct.
                        return current;
                    }
                    current = current.parentElement;
                }
                return null;
            };

            const gridContainer = findCommonAncestor(photoLinks);
            if (!gridContainer) return;

            // Generate the composite image
            const canvas = this.generateComposite(orderedImages, true); // true = with stripes

            // Create a wrapper
            const wrapper = document.createElement('div');
            wrapper.style.width = '100%';
            wrapper.style.cursor = 'pointer';
            // wrapper.style.marginTop = '12px'; // Removed to reduce 'container' feel

            // NEW: Aggressive layout fix for Twitter's aspect-ratio container
            // We need to bust out of the "padding-bottom" spacer constraint.
            // Typically: Parent -> Spacer + AbsoluteContainer -> GridContainer
            let context = gridContainer;
            for (let i = 0; i < 3; i++) {
                if (!context) break;

                // Force current element to flow naturally
                context.style.setProperty('height', 'auto', 'important');
                context.style.setProperty('max-height', 'none', 'important');
                context.style.setProperty('min-height', '0', 'important');
                context.style.setProperty('aspect-ratio', 'unset', 'important');

                // If it's absolutely positioned, force it to relative so it takes space
                const computed = window.getComputedStyle(context);
                if (computed.position === 'absolute') {
                    context.style.setProperty('position', 'relative', 'important');
                }

                // Check siblings for the aspect-ratio spacer (typically has padding-bottom %)
                if (context.parentNode) {
                    Array.from(context.parentNode.children).forEach(sib => {
                        if (sib !== context && sib.style.paddingBottom && sib.style.paddingBottom.indexOf('%') > -1) {
                            sib.style.display = 'none';
                        }
                    });
                }

                context = context.parentNode;
            }

            const img = document.createElement('img');
            img.src = canvas.toDataURL('image/png');
            img.style.setProperty('width', '100%', 'important');
            img.style.setProperty('height', 'auto', 'important');
            img.style.setProperty('max-height', 'none', 'important');
            img.style.display = 'block';
            img.style.borderRadius = '16px';

            wrapper.appendChild(img);

            // Replace content
            // We hide the grid instead of removing to preserve potential other handlers/state
            gridContainer.style.display = 'none';
            gridContainer.parentNode.insertBefore(wrapper, gridContainer);

            // Click to download or view original
            wrapper.onclick = (e) => {
                e.preventDefault();
                e.stopPropagation();
                // Open the full preview modal
                this.showPreview(orderedImages, "AutoPreview", wrapper);
            };
        },

        click: async function (btn, status_id, shouldMerge) {
            if (btn.classList.contains('loading')) return
            this.status(btn, 'loading')

            try {
                let json = await this.fetchJson(status_id)
                let result = json.data?.tweetResult?.result?.tweet || json.data?.tweetResult?.result || json;
                let tweet = result.legacy || result;
                let user = result.core?.user_results?.result?.legacy || result.user?.legacy;
                let medias = tweet.extended_entities?.media || tweet.entities?.media;

                if (!medias) throw "No Media";

                if (shouldMerge) {
                    await this.mergeWithAI(medias, btn, `${user.screen_name}_${status_id}`)
                } else {
                    let tasks = medias.map((m, i) => ({
                        url: m.type == 'photo' ? m.media_url_https + ':orig' : m.video_info.variants.sort((a, b) => b.bitrate - a.bitrate)[0].url,
                        name: `${user.screen_name}_${status_id}_${i}.jpg`
                    }))
                    this.downloader.add(tasks, btn, status_id)
                }
            } catch (err) {
                console.error(err);
                this.status(btn, 'failed')
            }
        },

        mergeWithAI: async function (medias, btn, baseName) {
            const photoUrls = medias.filter(m => m.type === 'photo').map(m => m.media_url_https + ':orig');

            try {
                const images = await Promise.all(photoUrls.map(url => {
                    return new Promise((resolve, reject) => {
                        const img = new Image();
                        img.crossOrigin = "anonymous";
                        img.src = url;
                        img.onload = () => resolve(img);
                        img.onerror = reject;
                    });
                }));

                // Call aiSort and destructure the result
                const { images: orderedImages, score } = this.aiSort(images);
                console.log(`[TMD] AI Merge Score: ${score} (Avg: ${(score / (images.length - 1)).toFixed(1)})`);

                this.showPreview(orderedImages, baseName, btn);

            } catch (err) {
                console.error("AI Merge Error:", err);
                this.status(btn, 'failed');
            }
        },

        generateComposite: function (orderedImages, withStripes) {
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d', { willReadFrequently: true });
            const standardWidth = orderedImages[0].width;
            const gapHeight = withStripes ? Math.round(standardWidth * 0.025) : 0;

            let totalHeight = 0;
            orderedImages.forEach(img => {
                totalHeight += img.height * (standardWidth / img.width);
            });

            if (withStripes && orderedImages.length > 1) {
                totalHeight += gapHeight * (orderedImages.length - 1);
            }

            canvas.width = standardWidth;
            canvas.height = totalHeight;

            if (withStripes) {
                ctx.fillStyle = "#000000";
                ctx.fillRect(0, 0, canvas.width, canvas.height);
            }

            let yOffset = 0;
            for (let img of orderedImages) {
                const ratio = standardWidth / img.width;
                const h = img.height * ratio;
                ctx.drawImage(img, 0, yOffset, standardWidth, h);
                yOffset += h + gapHeight;
            }

            return canvas;
        },

        showPreview: function (orderedImages, baseName, btn) {
            let isStriped = false;
            let currentBlob = null;
            let currentUrl = null;

            // Scroll Lock Logic (Prevents jumping to top)
            const scrollY = window.scrollY;
            document.body.style.position = 'fixed';
            document.body.style.top = `-${scrollY}px`;
            document.body.style.width = '100%';

            const modal = document.createElement('div');
            modal.className = 'tmd-modal';
            modal.innerHTML = `
                <div class="tmd-preview-container">
                    <img class="tmd-preview-img" src="">
                    <div class="tmd-controls">
                        <button class="tmd-btn tmd-btn-stripe">Add Stripes</button>
                        <button class="tmd-btn tmd-btn-dl">Download</button>
                        <button class="tmd-btn tmd-btn-close">Close</button>
                    </div>
                </div>
            `;

            const imgEl = modal.querySelector('.tmd-preview-img');
            const btnStripe = modal.querySelector('.tmd-btn-stripe');
            const btnDl = modal.querySelector('.tmd-btn-dl');

            const updateView = async () => {
                if (currentUrl) URL.revokeObjectURL(currentUrl);
                const canvas = this.generateComposite(orderedImages, isStriped);

                currentBlob = await new Promise(resolve => canvas.toBlob(resolve, 'image/png'));
                currentUrl = URL.createObjectURL(currentBlob);
                imgEl.src = currentUrl;

                if (isStriped) {
                    btnStripe.textContent = "Remove Stripes";
                    btnStripe.classList.add('active');
                    btnDl.classList.add('tmd-btn-black');
                } else {
                    btnStripe.textContent = "Add Stripes";
                    btnStripe.classList.remove('active');
                    btnDl.classList.remove('tmd-btn-black');
                }
            };

            btnStripe.onclick = (e) => {
                e.stopPropagation();
                e.preventDefault();
                isStriped = !isStriped;
                updateView();
            };

            btnDl.onclick = (e) => {
                e.stopPropagation();
                e.preventDefault();
                const a = document.createElement('a');
                a.href = currentUrl;
                a.download = `${baseName}${isStriped ? '_striped' : ''}_merged.png`;
                a.click();
            };

            const closeFn = () => {
                document.body.removeChild(modal);
                // Restore Scroll Position
                document.body.style.position = '';
                document.body.style.top = '';
                document.body.style.width = '';
                window.scrollTo(0, scrollY);

                if (currentUrl) URL.revokeObjectURL(currentUrl);
                if (btn && btn.classList) this.status(btn, 'completed');
            };

            modal.querySelector('.tmd-btn-close').onclick = (e) => { e.stopPropagation(); e.preventDefault(); closeFn(); };
            modal.onclick = (e) => { if (e.target === modal) closeFn(); };

            document.body.appendChild(modal);
            updateView();
        },

        aiSort: function (images) {
            if (images.length <= 1) return { images: images, score: 0, avgScore: 0 };

            const sampleW = 200;
            const SAMPLE_ROWS = 7; // Increased for better gradient detection
            const COMPARE_BANDS = 3; // Compare multiple row bands for robustness

            // === COLOR SPACE HELPERS ===
            const rgbToLab = (r, g, b) => {
                let rr = r / 255, gg = g / 255, bb = b / 255;
                rr = rr > 0.04045 ? Math.pow((rr + 0.055) / 1.055, 2.4) : rr / 12.92;
                gg = gg > 0.04045 ? Math.pow((gg + 0.055) / 1.055, 2.4) : gg / 12.92;
                bb = bb > 0.04045 ? Math.pow((bb + 0.055) / 1.055, 2.4) : bb / 12.92;
                let x = (rr * 0.4124 + gg * 0.3576 + bb * 0.1805) / 0.95047;
                let y = (rr * 0.2126 + gg * 0.7152 + bb * 0.0722) / 1.00000;
                let z = (rr * 0.0193 + gg * 0.1192 + bb * 0.9505) / 1.08883;
                x = x > 0.008856 ? Math.pow(x, 1 / 3) : (7.787 * x) + 16 / 116;
                y = y > 0.008856 ? Math.pow(y, 1 / 3) : (7.787 * y) + 16 / 116;
                z = z > 0.008856 ? Math.pow(z, 1 / 3) : (7.787 * z) + 16 / 116;
                return [(116 * y) - 16, 500 * (x - y), 200 * (y - z)];
            };

            const getLuminance = (r, g, b) => 0.299 * r + 0.587 * g + 0.114 * b;

            const deltaE = (lab1, lab2) => {
                return Math.sqrt(
                    Math.pow(lab1[0] - lab2[0], 2) +
                    Math.pow(lab1[1] - lab2[1], 2) +
                    Math.pow(lab1[2] - lab2[2], 2)
                );
            };

            // === IMAGE PROCESSING ===
            const gaussianBlur = (data, width, rows) => {
                const kernel = [0.06, 0.24, 0.40, 0.24, 0.06];
                const result = new Float32Array(data.length);
                for (let row = 0; row < rows; row++) {
                    for (let x = 0; x < width; x++) {
                        let r = 0, g = 0, b = 0;
                        for (let k = -2; k <= 2; k++) {
                            const xx = Math.max(0, Math.min(width - 1, x + k));
                            const idx = (row * width + xx) * 4;
                            const w = kernel[k + 2];
                            r += data[idx] * w;
                            g += data[idx + 1] * w;
                            b += data[idx + 2] * w;
                        }
                        const idx = (row * width + x) * 4;
                        result[idx] = r;
                        result[idx + 1] = g;
                        result[idx + 2] = b;
                        result[idx + 3] = 255;
                    }
                }
                return result;
            };

            // === FEATURE EXTRACTION ===
            const data = images.map((img, index) => {
                const canvas = document.createElement('canvas');
                const ctx = canvas.getContext('2d', { willReadFrequently: true });
                canvas.width = sampleW;
                canvas.height = Math.round(img.height * (sampleW / img.width));
                ctx.drawImage(img, 0, 0, sampleW, canvas.height);

                const topRows = ctx.getImageData(0, 0, sampleW, SAMPLE_ROWS).data;
                const botRows = ctx.getImageData(0, canvas.height - SAMPLE_ROWS, sampleW, SAMPLE_ROWS).data;

                const topBlurred = gaussianBlur(topRows, sampleW, SAMPLE_ROWS);
                const botBlurred = gaussianBlur(botRows, sampleW, SAMPLE_ROWS);

                // Extract multiple row bands for comparison (not just averaged)
                const getRowBands = (data, rows, atTop) => {
                    const bands = [];
                    const offsets = atTop ? [0, 1, 2] : [rows - 1, rows - 2, rows - 3];
                    for (const rowIdx of offsets) {
                        const band = new Float32Array(sampleW * 4);
                        for (let x = 0; x < sampleW; x++) {
                            const srcIdx = (rowIdx * sampleW + x) * 4;
                            const dstIdx = x * 4;
                            band[dstIdx] = data[srcIdx];
                            band[dstIdx + 1] = data[srcIdx + 1];
                            band[dstIdx + 2] = data[srcIdx + 2];
                        }
                        bands.push(band);
                    }
                    return bands;
                };

                // Calculate average luminance for a region
                const getAvgLuminance = (data, rows) => {
                    let total = 0, count = 0;
                    for (let i = 0; i < rows * sampleW * 4; i += 4) {
                        total += getLuminance(data[i], data[i + 1], data[i + 2]);
                        count++;
                    }
                    return total / count;
                };

                // Detect how "busy" the center vs edges are (subject detection)
                const getCenterVsEdgeRatio = (data, rows) => {
                    const edgeW = Math.floor(sampleW * 0.25);
                    let edgeVar = 0, centerVar = 0;
                    let edgeCount = 0, centerCount = 0;

                    for (let row = 0; row < rows; row++) {
                        for (let x = 1; x < sampleW - 1; x++) {
                            const idx = (row * sampleW + x) * 4;
                            const prevIdx = idx - 4;
                            const diff = Math.abs(data[idx] - data[prevIdx]) +
                                Math.abs(data[idx + 1] - data[prevIdx + 1]) +
                                Math.abs(data[idx + 2] - data[prevIdx + 2]);

                            if (x < edgeW || x >= sampleW - edgeW) {
                                edgeVar += diff;
                                edgeCount++;
                            } else {
                                centerVar += diff;
                                centerCount++;
                            }
                        }
                    }
                    return (centerVar / centerCount) / Math.max(1, edgeVar / edgeCount);
                };

                // Calculate entropy (horizontal + vertical variance)
                const getEntropy = (data, rows) => {
                    let hVariance = 0, vVariance = 0;
                    for (let row = 0; row < rows; row++) {
                        for (let x = 1; x < sampleW - 1; x++) {
                            const idx = (row * sampleW + x) * 4;
                            const prevIdx = (row * sampleW + x - 1) * 4;
                            const lab1 = rgbToLab(data[prevIdx], data[prevIdx + 1], data[prevIdx + 2]);
                            const lab2 = rgbToLab(data[idx], data[idx + 1], data[idx + 2]);
                            hVariance += deltaE(lab1, lab2);
                        }
                    }
                    for (let x = 0; x < sampleW; x++) {
                        for (let row = 1; row < rows; row++) {
                            const idx = (row * sampleW + x) * 4;
                            const prevIdx = ((row - 1) * sampleW + x) * 4;
                            const lab1 = rgbToLab(data[prevIdx], data[prevIdx + 1], data[prevIdx + 2]);
                            const lab2 = rgbToLab(data[idx], data[idx + 1], data[idx + 2]);
                            vVariance += deltaE(lab1, lab2);
                        }
                    }
                    return { horizontal: hVariance, vertical: vVariance, total: hVariance + vVariance * 0.5 };
                };

                // Detect dominant edge colors (background)
                const getDominantEdgeColors = (data, rows) => {
                    const edgeWidth = Math.floor(sampleW * 0.2);
                    const colors = { left: [0, 0, 0], right: [0, 0, 0] };
                    let leftCount = 0, rightCount = 0;

                    for (let row = 0; row < rows; row++) {
                        for (let x = 0; x < edgeWidth; x++) {
                            const idx = (row * sampleW + x) * 4;
                            colors.left[0] += data[idx];
                            colors.left[1] += data[idx + 1];
                            colors.left[2] += data[idx + 2];
                            leftCount++;
                        }
                        for (let x = sampleW - edgeWidth; x < sampleW; x++) {
                            const idx = (row * sampleW + x) * 4;
                            colors.right[0] += data[idx];
                            colors.right[1] += data[idx + 1];
                            colors.right[2] += data[idx + 2];
                            rightCount++;
                        }
                    }

                    return {
                        left: rgbToLab(colors.left[0] / leftCount, colors.left[1] / leftCount, colors.left[2] / leftCount),
                        right: rgbToLab(colors.right[0] / rightCount, colors.right[1] / rightCount, colors.right[2] / rightCount)
                    };
                };

                // Edge uniformity (clean edge detection)
                const isCleanEdge = (data, rows, isTop) => {
                    const targetRow = isTop ? 0 : rows - 1;
                    let uniformity = 0, count = 0;
                    for (let x = 1; x < sampleW - 1; x++) {
                        const idx = (targetRow * sampleW + x) * 4;
                        const prevIdx = (targetRow * sampleW + x - 1) * 4;
                        const lab1 = rgbToLab(data[prevIdx], data[prevIdx + 1], data[prevIdx + 2]);
                        const lab2 = rgbToLab(data[idx], data[idx + 1], data[idx + 2]);
                        uniformity += deltaE(lab1, lab2);
                        count++;
                    }
                    return uniformity / count;
                };

                const topEntropy = getEntropy(topBlurred, SAMPLE_ROWS);
                const botEntropy = getEntropy(botBlurred, SAMPLE_ROWS);

                return {
                    img: img,
                    index: index,
                    topBands: getRowBands(topBlurred, SAMPLE_ROWS, true),
                    botBands: getRowBands(botBlurred, SAMPLE_ROWS, false),
                    topEntropy: topEntropy,
                    botEntropy: botEntropy,
                    topDominant: getDominantEdgeColors(topBlurred, SAMPLE_ROWS),
                    botDominant: getDominantEdgeColors(botBlurred, SAMPLE_ROWS),
                    topClean: isCleanEdge(topBlurred, SAMPLE_ROWS, true),
                    botClean: isCleanEdge(botBlurred, SAMPLE_ROWS, false),
                    topLuminance: getAvgLuminance(topBlurred, SAMPLE_ROWS),
                    botLuminance: getAvgLuminance(botBlurred, SAMPLE_ROWS),
                    centerRatioTop: getCenterVsEdgeRatio(topBlurred, SAMPLE_ROWS),
                    centerRatioBot: getCenterVsEdgeRatio(botBlurred, SAMPLE_ROWS),
                    aspectRatio: canvas.height / sampleW,
                    height: canvas.height
                };
            });

            // === SEAM COST CALCULATOR (Multi-band + Cross-correlation) ===
            const calculateSeam = (piece1, piece2) => {
                let totalScore = 0;

                // Compare multiple bands with decreasing weight
                const bandWeights = [1.0, 0.6, 0.3];

                for (let b = 0; b < COMPARE_BANDS; b++) {
                    const bottom = piece1.botBands[b];
                    const top = piece2.topBands[b];
                    const weight = bandWeights[b];

                    // Standard pixel comparison with edge weighting
                    for (let x = 0; x < sampleW; x++) {
                        const idx = x * 4;
                        const lab1 = rgbToLab(bottom[idx], bottom[idx + 1], bottom[idx + 2]);
                        const lab2 = rgbToLab(top[idx], top[idx + 1], top[idx + 2]);

                        const edgePos = Math.min(x, sampleW - 1 - x) / (sampleW * 0.2);
                        const posWeight = edgePos < 1 ? 3.0 - (edgePos * 2) : 1.0;

                        totalScore += deltaE(lab1, lab2) * posWeight * weight;
                    }
                }

                // Cross-correlation: try small horizontal shifts (±3px) to find best alignment
                let bestShiftScore = Infinity;
                for (let shift = -3; shift <= 3; shift++) {
                    let shiftScore = 0;
                    const bottom = piece1.botBands[0];
                    const top = piece2.topBands[0];

                    for (let x = 3; x < sampleW - 3; x++) {
                        const bottomIdx = x * 4;
                        const topIdx = (x + shift) * 4;

                        shiftScore += Math.abs(bottom[bottomIdx] - top[topIdx]) +
                            Math.abs(bottom[bottomIdx + 1] - top[topIdx + 1]) +
                            Math.abs(bottom[bottomIdx + 2] - top[topIdx + 2]);
                    }
                    bestShiftScore = Math.min(bestShiftScore, shiftScore);
                }
                totalScore += bestShiftScore * 0.5;

                // Background continuity (edge colors must match)
                const leftBgDiff = deltaE(piece1.botDominant.left, piece2.topDominant.left);
                const rightBgDiff = deltaE(piece1.botDominant.right, piece2.topDominant.right);
                totalScore += (leftBgDiff + rightBgDiff) * 8;

                // Luminance continuity (smooth light transition)
                const lumDiff = Math.abs(piece1.botLuminance - piece2.topLuminance);
                totalScore += lumDiff * 0.3;

                // Subject continuity (center should stay busy or stay empty)
                const centerDiff = Math.abs(piece1.centerRatioBot - piece2.centerRatioTop);
                totalScore += centerDiff * 20;

                return totalScore;
            };

            // === PERMUTATION GENERATOR ===
            const getPermutations = (arr) => {
                if (arr.length > 6) return null;
                let res = [];
                const permute = (m, c = []) => {
                    if (m.length === 0) res.push(c);
                    else for (let i = 0; i < m.length; i++) {
                        let curr = m.slice(); let next = curr.splice(i, 1);
                        permute(curr, c.concat(next));
                    }
                };
                permute(arr);
                return res;
            };

            // === GREEDY CHAIN BUILDER ===
            const buildChainGreedy = (pieces) => {
                let remaining = [...pieces];
                remaining.sort((a, b) => a.topClean - b.topClean);
                const chain = [remaining.shift()];
                while (remaining.length > 0) {
                    const lastPiece = chain[chain.length - 1];
                    let bestNext = null;
                    let bestScore = Infinity;
                    for (const candidate of remaining) {
                        const score = calculateSeam(lastPiece, candidate);
                        if (score < bestScore) {
                            bestScore = score;
                            bestNext = candidate;
                        }
                    }
                    chain.push(bestNext);
                    remaining = remaining.filter(p => p !== bestNext);
                }
                return chain;
            };

            // === FIND OPTIMAL ORDER ===
            const orders = getPermutations(data);
            let bestOrder = null;
            let minScore = Infinity;

            if (orders === null) {
                bestOrder = buildChainGreedy(data);
            } else {
                orders.forEach(order => {
                    let score = 0;

                    // A. Internal seam costs
                    for (let i = 0; i < order.length - 1; i++) {
                        score += calculateSeam(order[i], order[i + 1]);
                    }

                    // B. Topology penalty (first piece should have clean top, last should have clean bottom)
                    score += order[0].topEntropy.total * 10;
                    score += order[0].topClean * 80;
                    score += order[order.length - 1].botEntropy.total * 10;
                    score += order[order.length - 1].botClean * 80;

                    // Bonus for smooth gradients at boundaries
                    score -= order[0].topEntropy.vertical * 3;
                    score -= order[order.length - 1].botEntropy.vertical * 3;

                    // C. Luminance flow penalty (light usually comes from above in portraits)
                    // Top of first piece should be brighter or equal, bottom of last should be darker
                    const topPieceLumGradient = order[0].botLuminance - order[0].topLuminance;
                    const botPieceLumGradient = order[order.length - 1].botLuminance - order[order.length - 1].topLuminance;

                    // Very slight preference for typical lighting (not too strong to avoid false positives)
                    if (order[0].topLuminance > order[0].botLuminance) score -= 5;

                    // D. Aspect ratio heuristics (head pieces tend to be squarer, torso/legs taller)
                    // Weight this lightly - just a tiebreaker
                    const firstAspect = order[0].aspectRatio;
                    const lastAspect = order[order.length - 1].aspectRatio;
                    // Slight penalty if first piece is much taller than last (heads are usually not super tall)
                    if (firstAspect > lastAspect * 1.5) score += 10;

                    // E. Subject continuity through the chain
                    for (let i = 0; i < order.length - 1; i++) {
                        const flow = Math.abs(order[i].centerRatioBot - order[i + 1].centerRatioTop);
                        score += flow * 15;
                    }

                    if (score < minScore) {
                        minScore = score;
                        bestOrder = order;
                    }
                });
            }

            console.log("[AI Sort] Best order indices:", bestOrder.map(o => o.index), "Score:", minScore.toFixed(1));
            return {
                images: bestOrder.map(o => o.img),
                score: minScore,
                avgScore: minScore / Math.max(1, images.length - 1)
            };
        },

        fetchJson: async function (status_id) {
            let cookies = {}
            document.cookie.split(';').forEach(c => { let [k, v] = c.split('='); if (k) cookies[k.trim()] = (v || '').trim() })
            let variables = { "tweetId": status_id, "with_rux_injections": false, "includePromotedContent": true, "withCommunity": true, "withQuickPromoteEligibilityTweetFields": true, "withBirdwatchNotes": true, "withVoice": true, "withV2Timeline": true };
            let features = { "articles_preview_enabled": true, "c9s_tweet_anatomy_moderator_badge_enabled": true, "communities_web_enable_tweet_community_results_fetch": false, "creator_subscriptions_quote_tweet_preview_enabled": false, "creator_subscriptions_tweet_preview_api_enabled": false, "freedom_of_speech_not_reach_fetch_enabled": true, "graphql_is_translatable_rweb_tweet_is_translatable_enabled": true, "longform_notetweets_consumption_enabled": false, "longform_notetweets_inline_media_enabled": true, "longform_notetweets_rich_text_read_enabled": false, "premium_content_api_read_enabled": false, "profile_label_improvements_pcf_label_in_post_enabled": true, "responsive_web_edit_tweet_api_enabled": false, "responsive_web_enhance_cards_enabled": false, "responsive_web_graphql_exclude_directive_enabled": false, "responsive_web_graphql_skip_user_profile_image_extensions_enabled": false, "responsive_web_graphql_timeline_navigation_enabled": false, "responsive_web_grok_analysis_button_from_backend": false, "responsive_web_grok_analyze_button_fetch_trends_enabled": false, "responsive_web_grok_analyze_post_followups_enabled": false, "responsive_web_grok_image_annotation_enabled": false, "responsive_web_grok_share_attachment_enabled": false, "responsive_web_grok_show_grok_translated_post": false, "responsive_web_jetfuel_frame": false, "responsive_web_media_download_video_enabled": false, "responsive_web_twitter_article_tweet_consumption_enabled": true, "rweb_tipjar_consumption_enabled": true, "rweb_video_screen_enabled": false, "standardized_nudges_misinfo": true, "tweet_awards_web_tipping_enabled": false, "tweet_with_visibility_results_prefer_gql_limited_actions_policy_enabled": true, "tweetypie_unmention_optimization_enabled": false, "verified_phone_label_enabled": false, "view_counts_everywhere_api_enabled": true };
            let url = `https://${host}/i/api/graphql/2ICDjqPd81tulZcYrtpTuQ/TweetResultByRestId?variables=${encodeURIComponent(JSON.stringify(variables))}&features=${encodeURIComponent(JSON.stringify(features))}`
            let res = await fetch(url, { headers: { 'authorization': 'Bearer AAAAAAAAAAAAAAAAAAAAANRILgAAAAAAnNwIzUejRCOuH5E6I8xnZz4puTs%3D1Zv7ttfk8LF81IUq16cHjhLTvJu4FA33AGWWjCpTnA', 'x-twitter-active-user': 'yes', 'x-csrf-token': cookies.ct0 } })
            return await res.json();
        },

        downloader: {
            add: function (tasks, btn, status_id) {
                if (tasks.length > 1) {
                    let zip = new JSZip()
                    Promise.all(tasks.map(t => fetch(t.url).then(r => r.blob()).then(b => zip.file(t.name, b)))).then(() => {
                        zip.generateAsync({ type: 'blob' }).then(blob => {
                            const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = `twitter_${status_id}.zip`; a.click();
                            TMD.status(btn, 'completed')
                        })
                    })
                } else {
                    GM_download(tasks[0].url, tasks[0].name)
                    TMD.status(btn, 'completed')
                }
            }
        },

        status: function (btn, css) {
            btn.classList.remove('download', 'completed', 'loading', 'failed', 'tmd-merge')
            css.split(' ').forEach(c => btn.classList.add(c))
        },

        css: `
            .tmd-down { margin-left: 12px; cursor: pointer; order: 99; }
            .tmd-down svg { width: 1.25rem; height: 1.25rem; color: #71767b; fill: currentColor; }
            .tmd-down:hover svg { color: #1d9bf0; }
            .tmd-merge svg { color: #00ba7c !important; }
            .loading svg { animation: spin 1s linear infinite; }
            @keyframes spin { 100% { transform: rotate(360deg); } }
            .completed svg { color: #1d9bf0 !important; }

            /* MODAL CSS */
            .tmd-modal {
                position: fixed; top: 0; left: 0; width: 100vw; height: 100vh;
                background: rgba(0, 0, 0, 0.85); z-index: 999999;
                display: flex; flex-direction: column; align-items: center; justify-content: center;
                backdrop-filter: blur(5px);
            }
            .tmd-preview-container {
                display: flex; flex-direction: column; align-items: center;
                max-width: 90vw; max-height: 90vh;
            }
            .tmd-preview-img {
                max-width: 100%; max-height: 80vh;
                border-radius: 8px; box-shadow: 0 4px 30px rgba(0,0,0,0.5);
                object-fit: contain;
            }
            .tmd-controls {
                margin-top: 15px; display: flex; gap: 15px;
            }
            .tmd-btn {
                padding: 10px 24px; border-radius: 9999px; border: none;
                font-weight: bold; font-size: 14px; cursor: pointer;
                transition: transform 0.1s, opacity 0.2s;
            }
            .tmd-btn:active { transform: scale(0.95); }

            .tmd-btn-stripe { background: #536471; color: white; }
            .tmd-btn-stripe.active { background: #00ba7c; }

            .tmd-btn-dl { background: #1d9bf0; color: white; }
            .tmd-btn-dl:hover { background: #1a8cd8; }

            .tmd-btn-black { background: #000000 !important; border: 1px solid #333; }
            .tmd-btn-black:hover { background: #16181c !important; }

            .tmd-btn-close { background: #2f3336; color: #eff3f4; }
            .tmd-btn-close:hover { background: #474b4e; }
        `,
        svg: `<g><path d="M3,14 v5 q0,2 2,2 h14 q2,0 2,-2 v-5 M7,10 l4,4 q1,1 2,0 l4,-4 M12,3 v11" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" /></g>`,
        svg_merge: `<g><path d="M19 9h-4V3H9v6H5l7 8 7-8zM5 18v2h14v-2H5z" fill="currentColor"/></g>`
    }
})()

TMD.init()