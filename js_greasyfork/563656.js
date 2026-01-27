// ==UserScript==
// @name           Universal ALT Text Viewer
// @icon           data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>⛄</text></svg>
// @description    Display and copy ALT text (alternative text) for images, GIFs, and videos on Twitter, Bluesky, and Tokimeki.
// @description:ja Twitter, Bluesky, Tokimekiの画像、GIF、動画のALTテキスト（代替テキスト）を表示・コピーします。
// @namespace      https://bsky.app/profile/neon-ai.art
// @homepage       https://neon-aiart.github.io/
// @version        3.1
// @author         ねおん
// @match          https://twitter.com/*
// @match          https://x.com/*
// @match          https://bsky.app/*
// @match          https://tokimeki.blue/*
// @grant          GM_addStyle
// @run-at         document-idle
// @license        PolyForm Noncommercial 1.0.0; https://polyformproject.org/licenses/noncommercial/1.0.0/
// @downloadURL https://update.greasyfork.org/scripts/563656/Universal%20ALT%20Text%20Viewer.user.js
// @updateURL https://update.greasyfork.org/scripts/563656/Universal%20ALT%20Text%20Viewer.meta.js
// ==/UserScript==

/**
 * ==============================================================================
 * IMPORTANT NOTICE / 重要事項
 * ==============================================================================
 * Copyright (c) 2025-2026 ねおん (Neon)
 * Licensed under the PolyForm Noncommercial License 1.0.0.
 * * [JP] 本スクリプトは個人利用・非営利目的でのみ使用・改変が許可されます。
 * 無断転載、作者名の書き換え、およびクレジットの削除は固く禁じます。
 * 本スクリプトを改変・配布（フォーク）する場合は、必ず元の作者名（ねおん）
 * およびこのクレジット表記を維持してください。
 * * [EN] This script is licensed for personal and non-commercial use only.
 * Unauthorized re-uploading, modification of authorship, or removal of
 * author credits is strictly prohibited. If you fork this project, you MUST
 * retain the original credits and authorship.
 * ==============================================================================
 */

(function() {
    'use strict';

    const SCRIPT_VERSION = '3.1';

    const MINIMUM_CHARACTER_LENGTH = 12; // 最低文字数

    // 除外ALTテキスト
    const localizedImageStrings = [
        "画像", "Image", "圖片", "이미지", "Imagen", "Bild",
        "Immagine", "Imagem", "Foto", "Rasm", "Kép", "zdjęcie",
        "埋め込み動画", "埋め込みビデオプレーヤー",
    ];

    // NGワード
    const TEXTS_TO_REMOVE_REGEX = [
        /^Alt:\s*/i, // 先頭の "Alt: "
        /^\/\/Character\n1girl,\nBREAK\n\/\/Fashions\n/i, // 先頭のプロンプト定型文
    ];

    /*
     * --- プラットフォーム設定の解説 ---
     * root: 監視の起点となる要素（ポスト全体など）。ここに追加があったら中身をスキャンする。
     * targets: 対象となる画像/動画の設定リスト。
     *   - containerSelector: [必須] ALTボタンを設置する親要素（コンテナ）。
     *                        :has() や > を使って「ALTを持つ要素の親」を特定する。
     *                        ボタンはここに appendChild される。
     *   - textSelector:      [任意] コンテナ内部で実際に代替テキストを持っている要素。
     *                        省略時は containerSelector 自身から属性を探す。
     *   - attr:              [必須] 取得する属性名 ('alt', 'aria-label', 'innerText'など)。
     *                        'innerText' を指定すると属性ではなくタグの中身を取得する。
     *   - position:          ボタンの表示位置
     */
    const platformConfigs = [
        {
            name: 'Twitter/X',
            hostnames: ['twitter.com', 'x.com',],
            root: 'article[data-testid="tweet"]',
            targets: [
                {
                    containerSelector: 'div[data-testid="tweetPhoto"][aria-label]',
                    textSelector: '', // コンテナ自身を対象にするので空文字にする
                    attr: 'aria-label',
                    position: 'top: 10px; left: 12px;',
                },
                {
                    containerSelector: 'div[data-testid="tweetPhoto"]:has(video[aria-label])',
                    textSelector: 'video[aria-label]',
                    attr: 'aria-label',
                    position: 'top: 10px; left: 12px;',
                },
            ],
        },
        {
            name: 'Bluesky',
            hostnames: ['bsky.app',],
            root: 'div[data-testid*="-by-"], div[role="link"]:has(div[data-testid="userAvatarImage"])',
            targets: [
                {
                    // 画像: [data-expoimage] を利用し、アバターを弾く
                    containerSelector: 'div[data-expoimage]:has(img[alt])',
                    textSelector: 'img[alt]',
                    attr: 'alt',
                    position: 'bottom: 10px; left: 10px;',
                },
                {
                    // GIFステッカー
                    containerSelector: 'div:has(> video[aria-label])',
                    textSelector: 'video[aria-label]',
                    attr: 'aria-label',
                    position: 'bottom: 10px; left: 10px;',
                },
                {
                    // GIF・動画
                    containerSelector: 'div[aria-label]:has(video):has(figcaption)',
                    textSelector: 'figcaption',
                    attr: 'innerText',
                    position: 'bottom: 60px; left: 10px;',
                },
            ],
        },
        {
            name: 'Tokimeki',
            hostnames: ['tokimeki.blue',],
            // root: 各表示エリアの外枠
            root: 'article.timeline__item, article.notifications-item, dialog.media-content-wrap',
            targets: [
                {
                    // タイムライン・通知
                    containerSelector: 'div.timeline-image:not(.avatar div):has(img[alt])',
                    textSelector: 'img[alt]',
                    attr: 'alt',
                    position: 'bottom: 10px; left: 10px;',
                },
                {
                    // メディア詳細モーダル
                    containerSelector: 'div.media-content__image:has(img[alt])',
                    textSelector: 'img[alt]',
                    attr: 'alt',
                    position: 'bottom: 10px; left: 10px;',
                },
                {
                    // GIFステッカー
                    containerSelector: 'div.timeline-external--tenor:has(video.gif-video)',
                    textSelector: 'p.timeline-external__description',
                    attr: 'innerText',
                    position: 'top: 10px; left: 10px;',
                },
                {
                    // GIF・動画
                    containerSelector: 'div.timeline-video-wrap:has(video), div.timeline-video-wrap:has(.video-player)',
                    textSelector: '',
                    attr: 'alt',
                    position: 'bottom: 60px; right: 10px;',
                },
            ],
        },
    ];

    const currentPlatform = platformConfigs.find(p => p.hostnames.some(h => window.location.hostname.includes(h)));

    if (!currentPlatform) {
        return; // 対象外のURL
    }

    // --- スタイル ---
    GM_addStyle(`
        @import url('https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200');

        /* コピーボタンのスタイル */
        .alt-button {
            position: absolute;
            z-index: 99;
            cursor: pointer;
            background-color: rgba(29, 155, 240, 0.9);
            color: white;
            width: 30px;
            height: 30px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            opacity: 0;
            transition: opacity 0.2s ease;
            box-shadow: 0 2px 5px rgba(0,0,0,0.3);
        }

        /* 親要素に relative を強制するためのクラス（ボタンの絶対配置基準用） */
        .alt-container-relative {
            position: relative !important;
        }

        .alt-button .material-symbols-outlined {
            font-size: 18px;
            font-variation-settings: 'FILL' 1, 'wght' 400, 'GRAD' 0, 'opsz' 24;
            pointer-events: none; /* アイコン自体はクリックを透過 */
        }

        /* ツールチップ */
        .alt-tooltip {
            position: absolute;
            z-index: 10000;
            background-color: rgba(30, 30, 30, 0.95);
            top: 0;
            left: 0;
            color: white;
            padding: 8px 12px;
            border-radius: 8px;
            max-width: min(80%, 320px);
            max-height: min(72%, 480px);
            font-size: 14px;
            line-height: 1.4;
            visibility: hidden;
            opacity: 0;
            transition: opacity 0.2s ease;
            white-space: pre-wrap;
            overflow-wrap: break-word;
            overflow: auto;
            word-break: break-word;
            box-shadow: 0 4px 12px rgba(0,0,0,0.5);
            user-select: text; /* テキスト選択可能に */
            cursor: auto;
            pointer-events: auto;
        }

        /* ボタンホバー時、その親にあるリンクの反応を消す */
        .alt-button:hover {
            box-shadow:
                0 2px 5px rgba(0,0,0,0.3),  /* 元の影をそのまま記述 */
                0 0 0 1000px rgba(0,0,0,0); /* その後に判定用の透明な影を足す */
            background-color: rgba(29, 155, 240, 1.0); /* ついでに色を少し濃くしてホバー感出すのもアリ */
        }
    `);

    // --- メイン処理 ---

    // 代替テキストの有無・妥当性を判定
    function isValidAltText(text) {
        if (!text) {
            return false;
        }
        const length = Math.min(Math.max(MINIMUM_CHARACTER_LENGTH, 1), 99);
        const trimmed = text.trim();
        return trimmed.length > length && !localizedImageStrings.includes(trimmed);
    }

    /**
     * 指定された要素からテキストを取得
     * @param {HTMLElement} element - 対象要素
     * @param {string} attr - 属性名 ('alt', 'aria-label', 'innerText')
     */
    function getAltText(element, attr) {
        if (!element) {
            return null;
        }
        let text = (attr === 'innerText')
            ? element.innerText
            : (element.getAttribute(attr) || '');

        // --- NGワード（正規表現）に一致する部分をすべて消去 ---
        TEXTS_TO_REMOVE_REGEX.forEach(regex => {
            text = text.replace(regex, '');
        });
        return text.trim();
    }

    // コピーボタンを生成・設置
    function createAltButton(container, text, position) {
        if (!container || container.querySelector('.alt-button')) {
            return;
        }

        // モーダル（dialog）を判定
        const isInsideModal = container.closest('dialog');
        const appendTarget = isInsideModal ? container : document.body;

        // コンテナのスタイル調整（absolute配置の基準にするためrelativeにを付与）
        const style = window.getComputedStyle(container);
        if (style.position === 'static') {
            container.classList.add('alt-container-relative');
        }

        // コピーボタン作成
        const btn = document.createElement('div');
        btn.className = 'alt-button';
        btn.innerHTML = '<span class="material-symbols-outlined">content_copy</span>';
        btn.style.cssText += position;

        // 正規表現で position から数値部分を抽出して clamp をかける
        const applyClamp = (prop) => {
            const match = position.match(new RegExp(`${prop}:\\s*([^;]+)`));
            if (match) {
                // 5pxから、(100% - ボタン幅35px)の間に収める
                btn.style[prop] = `clamp(5px, ${match[1]}, calc(100% - 35px))`;
            }
        };
        ['top', 'bottom', 'left', 'right',].forEach(applyClamp);

        // ツールチップ作成
        const tip = document.createElement('div');
        tip.className = 'alt-tooltip';
        tip.textContent = text;

        // 判定に基づいたターゲットにアペンド
        appendTarget.appendChild(tip);

        let isHovering = { btn: false, tip: false, container: false, };

        const update = () => {
            // コンテナにマウスがあるならボタン表示
            btn.style.opacity = (isHovering.btn || isHovering.tip || isHovering.container) ? '1' : '0';

            // ボタンかチップにマウスがあるならチップ表示
            if (isHovering.btn || isHovering.tip) {
                tip.style.visibility = 'visible';
                tip.style.opacity = '1';

                // --- 座標計算のコア ---
                if (isInsideModal) {
                    // コンテナ内(v2.7方式): offsetを使う
                    const isTopArea = btn.offsetTop < (container.offsetHeight / 2);
                    tip.style.top = isTopArea
                        ? (btn.offsetTop + btn.offsetHeight + 2) + 'px'
                        : (btn.offsetTop - tip.offsetHeight - 2) + 'px';

                    if (position.includes('left')) {
                        tip.style.left = btn.offsetLeft + 'px';
                    } else {
                        tip.style.left = (btn.offsetLeft + btn.offsetWidth - tip.offsetWidth) + 'px';
                    }
                } else {
                    // Body内(v2.5拡張方式): getBoundingClientRectを使う
                    const rect = btn.getBoundingClientRect();
                    const scrollY = window.scrollY;
                    const scrollX = window.scrollX;

                    // ボタンが画面の上半分にあるか判定
                    const isTopViewport = rect.top < (window.innerHeight / 2);

                    tip.style.top = isTopViewport
                        ? (rect.bottom + scrollY + 2) + 'px' // 下に出す
                        : (rect.top + scrollY - tip.offsetHeight - 2) + 'px'; // 上に出す

                    let leftPos = rect.right + scrollX - tip.offsetWidth;
                    tip.style.left = (leftPos < 10 ? 10 : leftPos) + 'px';
                }
            } else {
                setTimeout(() => {
                    if (!isHovering.btn && !isHovering.tip) {
                        tip.style.visibility = 'hidden';
                        tip.style.opacity = '0';
                    }
                }, 200); // 少し遅れて消す（マウス移動用）
            }
        };

        // イベントリスナー
        container.addEventListener('mouseenter', () => {
            isHovering.container = true; update();
        });
        container.addEventListener('mouseleave', () => {
            isHovering.container = false; update();
        });
        btn.addEventListener('mouseenter', () => {
            isHovering.btn = true; update();
        });
        btn.addEventListener('mouseleave', () => {
            isHovering.btn = false; update();
        });
        tip.addEventListener('mouseenter', () => {
            isHovering.tip = true; update();
        });
        tip.addEventListener('mouseleave', () => {
            isHovering.tip = false; update();
        });

        // コピー機能
        btn.addEventListener('click', (e) => {
            e.preventDefault();           // 1. デフォルトの挙動（リンク移動）を阻止
            e.stopPropagation();          // 2. 親要素への伝播を阻止
            e.stopImmediatePropagation(); // 3. 同じ要素に設定された他のリスナーも阻止
            navigator.clipboard.writeText(text).then(() => {
                const icon = btn.querySelector('.material-symbols-outlined');
                icon.textContent = 'done';
                setTimeout(() => {
                    icon.textContent = 'content_copy';
                }, 1500);
            });
        }, { capture: true, }); // キャプチャリングフェーズで先に捕まえる

        container.appendChild(btn);
        console.log(`[ALT Viewer] Button added: ${text.replace(/\n/g, ' ').substring(0, 80)}...`);
    }

    // --- API Core (Tokimeki 動画用) ---
    async function fetchVideoAltForTokimeki(videoWrap) {
        const contentNode = videoWrap.closest('.timeline__content');
        const uri = contentNode?.dataset.aturi;
        if (!uri) {
            return '';
        }

        try {
            const apiUrl = `https://public.api.bsky.app/xrpc/app.bsky.feed.getPostThread?uri=${encodeURIComponent(uri)}&depth=1`;
            const res = await fetch(apiUrl);
            if (!res.ok) {
                return '';
            }

            const data = await res.json();
            const post = data.thread?.post;
            console.log('[Debug] post.embed full structure:', JSON.stringify(post.embed, null, 2));

            // 動画のALTを優先的に、なければ埋め込みのALTを取得
            let altText = post.embed?.external?.title ||
                          post.embed?.media?.external?.title ||
                          post.embed?.media?.alt ||
                          post.embed?.video?.alt ||
                          post.embed?.alt || '';

            if (!altText && post.embed?.record) {
                const q = post.embed.record.embeds?.[0];
                if (q) {
                    altText = q.external?.title ||
                              q.media?.external?.title ||
                              q.media?.alt ||
                              q.video?.alt ||
                              q.alt || '';
                }
            }

            return altText;
        } catch (e) {
            console.error('[ALT-Script] Tokimeki API Fetch Error:', e);
            return '';
        }
    }

    // ポスト要素を解析し、ターゲットを探す
    function processPost(post) {
        // console.log(`[Debug] processPost: 要素名=${post.tagName}, クラス=${post.className}, 画像数=${post.querySelectorAll(currentPlatform.image).length}`);
        currentPlatform.targets.forEach(async (cfg) => {
            // 1. まずコンテナ（ボタンを置くべき親要素）を探す
            const containers = post.querySelectorAll(cfg.containerSelector);
            // console.log(`[Debug] 見つかったコンテナ数: ${containers.length}個`);
            containers.forEach(async (con) => {
                if (!con || con.querySelector('.alt-button')) {
                    return;
                }

                // Tokimekiかつ動画コンテナの場合のみ、属性をAPIから補完
                if (currentPlatform.name === 'Tokimeki' && cfg.containerSelector.includes('.timeline-video-wrap')) {
                    // 1. 【対象チェック】中身に動画プレイヤーがないなら無視（偽物や空枠を弾く）
                    if (!con.querySelector('video, .video-player')) {
                        return;
                    }
                    // 2. 【状態チェック】すでに取得済み、または現在取得中なら無視（二重処理を弾く）
                    if (con.dataset.fetching === 'true' || isValidAltText(con.getAttribute('alt'))) {
                        return;
                    }

                    // API処理
                    con.dataset.fetching = 'true';
                    const fetchedAlt = await fetchVideoAltForTokimeki(con);

                    if (isValidAltText(fetchedAlt)) {
                        con.setAttribute('alt', fetchedAlt);
                        createAltButton(con, fetchedAlt, cfg.position);
                    }
                    con.dataset.fetching = 'false';
                    return;
                }

                // 2. コンテナ内でテキストを持つ要素を特定する
                const el = cfg.textSelector ? con.querySelector(cfg.textSelector) : con;
                // 3. テキスト取得
                const txt = getAltText(el, cfg.attr);
                if (isValidAltText(txt)) {
                    // 極端に小さい要素（アイコン等）は除外
                    if (con.offsetWidth > 0 && con.offsetWidth < 40) {
                        return;
                    }
                    // console.log(`[Debug] textSelector: ${el}, text:${txt.replace(/\n/g, ' ').substring(0, 80)}...`);
                    // el.style.border = "1px solid red";
                    // con.style.border = "2px solid lightblue"; 枠線を綺麗に付けるにはconの6階層上
                    createAltButton(con, txt, cfg.position);
                }
            });
        });
    }

    // --- 監視 ---
    const observer = new MutationObserver(mutations => {
        for (const m of mutations) {
            // 新規追加ノードの処理
            m.addedNodes.forEach(node => {
                if (node.nodeType === 1) {
                    if (node.matches && node.matches(currentPlatform.root)) {
                        processPost(node);
                    } else {
                        node.querySelectorAll(currentPlatform.root).forEach(processPost);
                    }
                }
            });
            // 既存ポスト内の変化（画像が遅れて出た場合など）をキャッチ
            const post = m.target.nodeType === 1 ? m.target.closest(currentPlatform.root) : null;
            if (post) {
                processPost(post);
            }
        }
    });

    observer.observe(document.body, { childList: true, subtree: true, });

    // 初期実行
    window.addEventListener('load', () => {
        setTimeout(() => document.querySelectorAll(currentPlatform.root).forEach(processPost), 1000);
    });
})();