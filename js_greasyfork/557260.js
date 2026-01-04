// ==UserScript==
// @name         AIMG Auto Image Metadata Scanner
// @name:ja      AIMG 自動メタデータスキャナー
// @namespace    https://nijiurachan.net/pc/catalog.php
// @version      1.6
// @description  画像メタデータのオンデマンド解析、Prompt/UCの抽出表示とRawデータの切り替え、コピー機能、フィルタリング付き一括ダウンロード機能を提供します
// @author       doridoridorin
// @match        https://nijiurachan.net/pc/thread.php?id=*
// @require      https://cdnjs.cloudflare.com/ajax/libs/pako/2.1.0/pako.min.js
// @require      https://cdn.jsdelivr.net/npm/exifreader@4.20.0/dist/exif-reader.min.js
// @require      https://unpkg.com/fflate@0.8.2/umd/index.js
// @grant        GM_setClipboard
// @grant        GM_xmlhttpRequest
// @grant        GM_addStyle
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/557260/AIMG%20Auto%20Image%20Metadata%20Scanner.user.js
// @updateURL https://update.greasyfork.org/scripts/557260/AIMG%20Auto%20Image%20Metadata%20Scanner.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // ==========================================
    // 1. 設定・定数定義
    // ==========================================
    // NovelAIのステルス画像（PNGデータ内に埋め込まれた情報）を識別するためのマジックナンバー
    const NOVELAI_MAGIC = "stealth_pngcomp";

    // 解析対象とする画像の拡張子（正規表現）。PNG, WebP, JPEGに対応
    const TARGET_EXTENSIONS = /\.(png|webp|jpe?g)$/i;

    // 同時に実行するHTTPリクエストの最大数。サーバー負荷軽減とブラウザの通信詰まり防止用
    const MAX_CONCURRENT_REQUESTS = 3;

    // カーテン設定用
    // 対象とするキーワード
    const TARGET_KEYWORDS = ['注意', 'グロ'];

    // カーテン（マスク）のスタイル定義
    const CURTAIN_STYLE = `
        .tm-warning-curtain {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-color: rgba(128, 128, 128, 1); /* 濃い灰色 */
            display: flex;
            justify-content: center;
            align-items: center;
            color: #fff;
            font-weight: bold;
            font-size: 14px;
            cursor: pointer;
            z-index: 1000;
            border-radius: 4px;
        }
        /* 親のAタグに必要なスタイル */
        .tm-relative-anchor {
            position: relative !important;
            display: inline-block !important; /* 画像サイズに合わせるため */
        }
    `;

    // ==========================================
    // 2. ユーティリティ (コピー・並列処理)
    // ==========================================

    /**
     * テキストをクリップボードにコピーする関数
     * 環境に応じて最適な方法（GM_setClipboard > navigator.clipboard > execCommand）を自動選択します
     */
    function copyToClipboard(text) {
        // 1. Tampermonkey等の特権関数があれば最優先で使用
        if (typeof GM_setClipboard === 'function') {
            GM_setClipboard(text);
            return;
        }
        // 2. モダンブラウザの標準APIを使用
        if (navigator.clipboard && navigator.clipboard.writeText) {
            navigator.clipboard.writeText(text).catch(err => {
                fallbackCopyTextToClipboard(text); // 失敗時はフォールバック
            });
            return;
        }
        // 3. 古い手法へフォールバック
        fallbackCopyTextToClipboard(text);
    }

    /**
     * コピー機能のフォールバック用関数（非SSL環境や古いブラウザ向け）
     * 画面外にtextareaを作成し、選択してコピーコマンドを実行します
     */
    function fallbackCopyTextToClipboard(text) {
        const textArea = document.createElement("textarea");
        textArea.value = text;
        textArea.style.position = "fixed";
        textArea.style.opacity = "0";
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        try { document.execCommand('copy'); } catch (err) {}
        document.body.removeChild(textArea);
    }

    /**
     * 並列処理の同時実行数を制限する関数 (Promise.allの制限版)
     * 一括ダウンロードや一括解析時に、サーバーへ大量のリクエストが一気に飛ばないように制御します
     * @param {Array} items - 処理対象のリスト
     * @param {Function} iterator - 各要素を実行する非同期関数
     * @param {Number} concurrency - 同時実行数
     */
    async function pMap(items, iterator, concurrency) {
        const results = [];
        const executing = [];
        for (const item of items) {
            const p = Promise.resolve().then(() => iterator(item));
            results.push(p);
            const e = p.then(() => executing.splice(executing.indexOf(e), 1));
            executing.push(e);
            if (executing.length >= concurrency) await Promise.race(executing);
        }
        return Promise.all(results);
    }

    // ==========================================
    // 3. リクエストキュー管理
    // ==========================================
    // 個別のメタデータ解析リクエストを管理するためのキュー

    const requestQueue = [];
    let activeRequests = 0;

    /**
     * キューからタスクを取り出して実行する再帰的関数
     */
    function processQueue() {
        if (activeRequests >= MAX_CONCURRENT_REQUESTS || requestQueue.length === 0) return;
        const task = requestQueue.shift();
        activeRequests++;
        task.onStart(); // ボタンの表示を「解析中」に変更

        // GM_xmlhttpRequestを使用して画像データをバイナリ(ArrayBuffer)として取得
        // 通常のfetchではCORS（クロスドメイン）制約により、外部サイトの画像をCanvasで操作できないため必須
        GM_xmlhttpRequest({
            method: "GET",
            url: task.url,
            responseType: "arraybuffer",
            onload: async (response) => {
                try {
                    // データ取得成功時に解析を実行
                    const results = await analyzeImage(response.response);
                    task.onSuccess(results);
                } catch (e) {
                    task.onError(e);
                } finally {
                    activeRequests--;
                    processQueue(); // 次のタスクへ
                }
            },
            onerror: (err) => {
                task.onError(err);
                activeRequests--;
                processQueue();
            }
        });
    }

    /**
     * 新しい解析タスクをキューに追加する関数
     */
    function addToQueue(url, callbacks) {
        requestQueue.push({ url, ...callbacks });
        processQueue();
    }

    // ==========================================
    // 4. 解析ロジック (LSB, Exif)
    // ==========================================

    /**
     * LSB (Least Significant Bit) 解析用クラス
     * 画像ピクセルのアルファチャンネルの最下位ビットに隠されたデータを読み取ります
     */
    class LSBExtractor {
        constructor(pixels, width, height) {
            this.pixels = pixels; this.width = width; this.height = height;
            this.bitsRead = 0; this.currentByte = 0; this.row = 0; this.col = 0;
        }

        // 次の1ビットを取得（NovelAIは列優先[Column-Major]でデータを埋め込む仕様）
        getNextBit() {
            if (this.col >= this.width) return null;
            const pixelIndex = (this.row * this.width + this.col) * 4; // RGBAなので4倍
            const bit = this.pixels[pixelIndex + 3] & 1; // Alphaチャンネル(+3)のLSBを取得
            this.row++;
            if (this.row >= this.height) { this.row = 0; this.col++; } // 端まで行ったら次の列へ
            return bit;
        }

        // 8ビット集めて1バイトを生成
        getOneByte() {
            this.bitsRead = 0; this.currentByte = 0;
            while (this.bitsRead < 8) {
                const bit = this.getNextBit();
                if (bit === null) return null;
                this.currentByte = (this.currentByte << 1) | bit;
                this.bitsRead++;
            }
            return this.currentByte;
        }

        // 指定バイト数分読み込む
        getNextNBytes(n) {
            const bytes = new Uint8Array(n);
            for (let i = 0; i < n; i++) {
                const byte = this.getOneByte();
                if (byte === null) throw new Error("LSB: End of data");
                bytes[i] = byte;
            }
            return bytes;
        }

        // 32ビット整数（ビッグエンディアン）を読み込む（データ長取得用）
        readUint32BE() {
            const bytes = this.getNextNBytes(4);
            const view = new DataView(bytes.buffer);
            return view.getUint32(0, false);
        }
    }

    // ファイルシグネチャ（マジックバイト）定義
    const PNG_SIGNATURE = [137, 80, 78, 71, 13, 10, 26, 10];
    const WEBP_SIGNATURE = [82, 73, 70, 70]; // "RIFF"

    function checkSignature(data, signature) {
        if (data.length < signature.length) return false;
        for (let i = 0; i < signature.length; i++) {
            if (data[i] !== signature[i]) return false;
        }
        return true;
    }

    // BlobデータをCanvasに描画してピクセルデータを取得する
    async function getPixelsFromBlob(blob) {
        return new Promise((resolve, reject) => {
            const url = URL.createObjectURL(blob);
            const img = new Image();
            img.crossOrigin = "Anonymous";
            img.onload = () => {
                const canvas = document.createElement('canvas');
                canvas.width = img.width; canvas.height = img.height;
                const ctx = canvas.getContext('2d');
                if (!ctx) return reject(new Error('Canvas Context Error'));
                ctx.drawImage(img, 0, 0);
                URL.revokeObjectURL(url);
                try {
                    const imageData = ctx.getImageData(0, 0, img.width, img.height);
                    resolve({ pixels: imageData.data, width: img.width, height: img.height });
                } catch (e) { reject(new Error("CORS or Canvas Error")); }
            };
            img.onerror = () => { URL.revokeObjectURL(url); reject(new Error('Image Load Error')); };
            img.src = url;
        });
    }

    /**
     * メイン解析関数
     * バイナリデータからExif情報とLSB情報を解析します
     */
    async function analyzeImage(arrayBuffer) {
        const results = [];
        const uint8Data = new Uint8Array(arrayBuffer);

        // ファイルタイプ判定
        let mimeType = '';
        if (checkSignature(uint8Data, PNG_SIGNATURE)) mimeType = 'image/png';
        else if (checkSignature(uint8Data, WEBP_SIGNATURE)) mimeType = 'image/webp';

        // Blob作成（WebPの場合、MIMEタイプを明示しないとImage.srcで読み込めないブラウザがあるため）
        const blob = mimeType ? new Blob([uint8Data], { type: mimeType }) : new Blob([uint8Data]);

        // --- 1. 一般的なメタデータ解析 (ExifReader使用) ---
        try {
            // @ts-ignore
            const tags = ExifReader.load(arrayBuffer, {expanded: true}); // expanded: trueで階層構造化して取得
            const generalData = {};

            // Stable Diffusion (PNGのtEXt: parameters)
            if (tags.parameters?.description) generalData['Stable Diffusion'] = tags.parameters.description;

            // NovelAI (Exif Comment - V3以前の形式)
            if (tags.exif?.Comment?.description) {
                try { generalData['NovelAI (Exif)'] = JSON.parse(tags.exif?.Comment.description); }
                catch (e) { generalData['Comment'] = tags.exif?.Comment.description; }
            }

            // NovelAI (WebP UserComment - V4以降やWebP形式)
            if (tags.exif?.UserComment) {
                // UserCommentはバイナリ形式で来る場合があるためデコードと整形を行う
                const uint8Array = new Uint8Array(tags.exif?.UserComment.value);
                const decoder = new TextDecoder("utf-16");
                const result = decoder.decode(uint8Array.slice(9)); // 先頭のヘッダをスキップ
                let cleanText = result.replace(/^UNICODE\x00/, '').replace(/^\x00+/, ''); // 不要なヌル文字等を除去
                try {
                    // NovelAI固有の署名が含まれているか確認
                    if (cleanText.includes('"signed_hash":')) {
                        const splitText = cleanText.split("Comment: ")
                        const s = splitText[1].indexOf('{');
                        const e = splitText[1].lastIndexOf('}');
                        if (s !== -1 && e !== -1) {
                            generalData['NovelAI (WebP)'] = JSON.parse(splitText[1].substring(s, e + 1));
                        }
                    } else {
                        generalData['UserComment'] = cleanText; // その他のコメント
                    }
                } catch (e) {
                    try{
                        const s = cleanText.indexOf('{');
                        const splitText = cleanText.split(', "signed_hash":');
                        if (s !== -1 && splitText[0]) {
                            generalData['NovelAI (WebP)'] = JSON.parse(splitText[0].substring(s) + "}");
                        }
                    }catch(e) {
                        generalData['UserComment'] = cleanText;
                    }
                }
            }

            // ImageDescription (一般的なフォールバック)
            if (tags.ImageDescription?.description) {
                generalData['ImageDescription'] = tags.ImageDescription.description;
            }

            if (tags.Software) generalData['Software'] = tags.Software.description;

            if (Object.keys(generalData).length > 0) results.push({ type: 'Standard Metadata', content: generalData });
        } catch (e) { /* 解析エラーは無視して続行 */ }

        // --- 2. LSB解析 (NovelAI Stealth / PNG・WebPのみ) ---
        if (mimeType) {
            try {
                const { pixels, width, height } = await getPixelsFromBlob(blob);
                const extractor = new LSBExtractor(pixels, width, height);
                // マジックナンバーを確認
                const magicString = new TextDecoder().decode(extractor.getNextNBytes(NOVELAI_MAGIC.length));
                if (magicString === NOVELAI_MAGIC) {
                    const dataLength = extractor.readUint32BE() / 8; // データ長取得
                    // @ts-ignore
                    const decompressedData = window.pako.inflate(extractor.getNextNBytes(dataLength)); // gzip解凍
                    results.push({ type: 'NovelAI Stealth', content: JSON.parse(new TextDecoder().decode(decompressedData)) });
                }
            } catch (e) { /* LSBデータ無し */ }
        }
        return results;
    }

    /**
     * 抽出されたメタデータからプロンプト情報を整理して返す関数
     * 優先順位: LSB > NovelAI(Exif/WebP) > Stable Diffusion > その他
     */
    function extractPrompts(results) {
        let prompt = ""; let uc = ""; let charPrompt = []; let charUc = []; let found = false; let software = "";

        const lsbData = results.find(r => r.type === 'NovelAI Stealth');
        const standardData = results.find(r => r.type === 'Standard Metadata');

        // NovelAI形式のJSONパース
        const parseNaiJson = (json) => {
            let content = json;
            let s = content.Source || "";
            if (json.Comment && typeof json.Comment === 'string') {
                try { content = JSON.parse(json.Comment); } catch (e) {}
            } else if (json.Comment && typeof json.Comment === 'object') content = json.Comment;

            let p = content.prompt || ""; let u = content.uc || "";
            // V4形式のキャプションオブジェクト対応
            if (!p && content.v4_prompt?.caption?.base_caption) p = content.v4_prompt.caption.base_caption;
            if (!u && content.v4_negative_prompt?.caption?.base_caption) u = content.v4_negative_prompt.caption.base_caption;
            let cp = content.v4_prompt?.caption?.char_captions || [];
            let cu = content.v4_negative_prompt?.caption?.char_captions || [];
            return { p, u, cp, cu, s };
        };

        // Stable Diffusion形式のテキストパース
        const parseSDJson = (json) => {
            const negSplit = json.split(/Negative prompt:/i);
            let p = negSplit[0].trim();
            let u = "";
            if (negSplit[1]) u = negSplit[1].split(/Steps:/i)[0].trim();
            const souSplit = json.split(/Model:/i)[1] || "";
            const s = souSplit.split(",")[0].trim() || ""
            return { p, u, s };
        };

        // 各ソースからのデータ抽出を試行
        if (lsbData && lsbData.content) {
            const extracted = parseNaiJson(lsbData.content);
            prompt = extracted.p; uc = extracted.u; charPrompt = extracted.cp; charUc = extracted.cu; found = true;software = extracted.s;
        } else if (standardData && standardData.content) {
            const content = standardData.content;
            if (content['NovelAI (Exif)']) {
                const extracted = parseNaiJson(content['NovelAI (Exif)']);
                prompt = extracted.p; uc = extracted.u; charPrompt = extracted.cp; charUc = extracted.cu; found = true;software = extracted.s;
            } else if (content['NovelAI (WebP)']) {
                const extracted = parseNaiJson(content['NovelAI (WebP)']);
                prompt = extracted.p; uc = extracted.u; charPrompt = extracted.cp; charUc = extracted.cu; found = true;software = extracted.s;
            } else if (content['Stable Diffusion']) {
                const extracted = parseSDJson(content['Stable Diffusion']);
                prompt = extracted.p; uc = extracted.u;found = true;software = extracted.s;
            } else {
                // 上記以外の汎用タグからのフォールバック
                if (content['UserComment']) {
                    const extracted = parseSDJson(content['UserComment']);
                    prompt = extracted.p; uc = extracted.u;found = true;software = extracted.s;
                } else if (content['ImageDescription']) {
                    prompt = content['ImageDescription'];
                    found = true;software = "Other";
                } else if (content['Comment']) {
                    prompt = content['Comment'];
                    found = true;software="Other";
                }
            }
        }
        return { prompt, uc, found, charPrompt, charUc, software };
    }

    // ==========================================
    // 5. UI コンポーネント
    // ==========================================

    // コピーアイコンの生成 (SVG)
    function createCopyIcon() {
        const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
        svg.setAttribute("viewBox", "0 0 24 24");
        svg.setAttribute("width", "14"); svg.setAttribute("height", "14");
        svg.style.fill = "currentColor";
        const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
        path.setAttribute("d", "M16 1H4C2.9 1 2 1.9 2 3V17H4V3H16V1ZM19 5H8C6.9 5 6 5.9 6 7V21C6 22.1 6.9 23 8 23H19C20.1 23 21 22.1 21 21V7C21 5.9 20.1 5 19 5ZM19 21H8V7H19V21Z");
        svg.appendChild(path);
        return svg;
    }

    // 詳細表示ボックスの生成 (タブ切り替え機能付き)
    function createResultDetailBox(results) {
        const container = document.createElement('div');
        Object.assign(container.style, {
            backgroundColor: 'rgba(20, 20, 20, 0.95)', color: '#eee', padding: '10px', fontSize: '12px', marginTop: '4px',
            border: '1px solid #444', borderRadius: '4px', maxWidth: '100%', overflowX: 'auto', textAlign: 'left',
            display: 'none', boxShadow: '0 4px 15px rgba(0,0,0,0.5)'
        });

        const { prompt, uc, found, charPrompt, charUc, software } = extractPrompts(results);

        // --- タブヘッダー ---
        const tabHeader = document.createElement('div');
        tabHeader.style.display = 'flex'; tabHeader.style.borderBottom = '1px solid #555'; tabHeader.style.marginBottom = '10px';

        const createTab = (text, isActive) => {
            const t = document.createElement('div'); t.textContent = text;
            Object.assign(t.style, { padding: '5px 10px', cursor: 'pointer', fontWeight: 'bold', borderBottom: isActive ? '2px solid #4CAF50' : '2px solid transparent', color: isActive ? '#fff' : '#888' });
            return t;
        };

        const tabPrompt = createTab(`📝 Prompt (${software})`, true);
        const tabRaw = createTab('📄 Raw Data', false);
        tabHeader.appendChild(tabPrompt); tabHeader.appendChild(tabRaw); container.appendChild(tabHeader);

        // --- Prompt表示エリア ---
        const viewPrompt = document.createElement('div');
        const createCopyableSection = (label, text) => {
            const wrapper = document.createElement('div'); wrapper.style.marginBottom = '10px';
            const header = document.createElement('div'); header.style.display = 'flex'; header.style.alignItems = 'center'; header.style.marginBottom = '4px';
            const title = document.createElement('span'); title.textContent = label; title.style.fontWeight = 'bold'; title.style.color = '#81C784'; title.style.marginRight = '8px';
            const copyBtn = document.createElement('button'); copyBtn.appendChild(createCopyIcon());
            Object.assign(copyBtn.style, { background: 'transparent', border: '1px solid #666', borderRadius: '3px', color: '#ccc', cursor: 'pointer', padding: '2px 6px', display: 'flex', alignItems: 'center' });

            copyBtn.onclick = (e) => {
                e.preventDefault(); e.stopPropagation(); // 親要素へのクリック伝播を阻止
                copyToClipboard(String(text));
                // コピー成功時の視覚フィードバック
                const originalColor = copyBtn.style.color; copyBtn.style.color = '#4CAF50'; copyBtn.style.borderColor = '#4CAF50';
                setTimeout(() => { copyBtn.style.color = originalColor; copyBtn.style.borderColor = '#666'; }, 1000);
            };
            header.appendChild(title); if (text) header.appendChild(copyBtn);
            const content = document.createElement('div'); content.textContent = text || "(None)";
            Object.assign(content.style, { whiteSpace: 'pre-wrap', wordBreak: 'break-word', padding: '6px', backgroundColor: '#000', borderRadius: '3px', border: '1px solid #333', color: text ? '#ddd' : '#666', fontFamily: 'Consolas, monospace', fontSize: '11px', maxHeight: '150px', overflowY: 'auto' });
            wrapper.appendChild(header); wrapper.appendChild(content); return wrapper;
        };

        if (found) {
            viewPrompt.appendChild(createCopyableSection("Prompt", prompt));
            if (uc) viewPrompt.appendChild(createCopyableSection("Negative (UC)", uc));
            for(let i = 0; charPrompt.length > i; i++) {
                viewPrompt.appendChild(createCopyableSection(`CharacterPrompt${i+1}`, charPrompt[i].char_caption || ""));
                viewPrompt.appendChild(createCopyableSection(`CharacterNegative${i+1}`, charUc[i].char_caption || ""));
            }
        } else {
            const noData = document.createElement('div'); noData.textContent = "プロンプト情報を自動抽出できませんでした。Raw Dataを確認してください。"; noData.style.color = '#aaa'; noData.style.padding = '10px';
            viewPrompt.appendChild(noData);
        }
        container.appendChild(viewPrompt);

        // --- Raw Data表示エリア ---
        const viewRaw = document.createElement('div'); viewRaw.style.display = 'none';
        const lsbData = results.find(r => r.type === 'NovelAI Stealth');
        const standardData = results.find(r => r.type === 'Standard Metadata');
        let res = "";
        if (standardData) {
            res = standardData;
        } else if(lsbData) {
            res = lsbData;
        }
        if (standardData || lsbData) {
            const title = document.createElement('div'); title.textContent = `■ ${res.type}`; title.style.color = '#64B5F6'; title.style.fontWeight = 'bold'; title.style.marginTop = '10px'; title.style.borderBottom = '1px solid #444';
            const contentPre = document.createElement('pre'); contentPre.style.whiteSpace = 'pre-wrap'; contentPre.style.wordBreak = 'break-all'; contentPre.style.margin = '5px 0 0 0'; contentPre.style.fontFamily = 'Consolas, monospace';
            contentPre.textContent = typeof res.content === 'object' ? JSON.stringify(res.content, null, 2) : res.content;
            viewRaw.appendChild(title); viewRaw.appendChild(contentPre);
        }
        container.appendChild(viewRaw);

        // タブ切り替え制御
        tabPrompt.onclick = (e) => { e.preventDefault(); e.stopPropagation(); viewPrompt.style.display = 'block'; viewRaw.style.display = 'none'; tabPrompt.style.borderBottomColor = '#4CAF50'; tabPrompt.style.color = '#fff'; tabRaw.style.borderBottomColor = 'transparent'; tabRaw.style.color = '#888'; };
        tabRaw.onclick = (e) => { e.preventDefault(); e.stopPropagation(); viewPrompt.style.display = 'none'; viewRaw.style.display = 'block'; tabRaw.style.borderBottomColor = '#2196F3'; tabRaw.style.color = '#fff'; tabPrompt.style.borderBottomColor = 'transparent'; tabPrompt.style.color = '#888'; };
        return container;
    }

    // ==========================================
    // 6. メイン UI / ロジック (個別解析ボタン)
    // ==========================================
    function attachScanner(anchor) {
        if (anchor.dataset.metaScannerAttached) return;

        const href = anchor.href;
        const childImg = anchor.querySelector('div img');
        if (!href || !TARGET_EXTENSIONS.test(href) || !childImg) return;

        anchor.dataset.metaScannerAttached = "true";

        const uiContainer = document.createElement('div');
        uiContainer.style.display = 'block'; uiContainer.style.marginTop = '2px'; uiContainer.style.textAlign = 'left'; uiContainer.style.lineHeight = '1';

        const btn = document.createElement('button');
        btn.textContent = '🔍 未解析';
        Object.assign(btn.style, {
            fontSize: '11px', padding: '3px 6px', border: 'none', borderRadius: '3px',
            backgroundColor: '#eee', color: '#555', cursor: 'pointer', boxShadow: '0 1px 2px rgba(0,0,0,0.1)'
        });
        btn.classList.add('meta-scan-btn');
        btn.dataset.status = 'unanalyzed';
        btn.dataset.href = href;

        uiContainer.appendChild(btn);
        if (anchor.nextSibling) anchor.parentNode.insertBefore(uiContainer, anchor.nextSibling);
        else anchor.parentNode.appendChild(uiContainer);

        let detailBox = null;
        let analysisPromise = null;

        // 解析開始処理 (Promiseを返すことで待機可能にする)
        const startAnalysis = () => {
            if (analysisPromise) return analysisPromise;

            analysisPromise = new Promise((resolve) => {
                if (btn.dataset.status === 'analyzed' || btn.dataset.status === 'error') {
                    resolve();
                    return;
                }

                btn.dataset.status = 'analyzing';
                addToQueue(href, {
                    onStart: () => {
                        btn.textContent = '🔄 解析中...';
                        btn.style.backgroundColor = '#FFEB3B';
                        btn.style.color = '#333';
                        btn.style.cursor = 'wait';
                    },
                    onSuccess: (results) => {
                        btn.dataset.status = 'analyzed';
                        if (results.length > 0) {
                            btn.textContent = '✅ メタデータ';
                            btn.style.backgroundColor = '#4CAF50';
                            btn.style.color = 'white';
                            btn.style.cursor = 'pointer';
                            btn.dataset.hasMeta = "true";

                            detailBox = createResultDetailBox(results);
                            uiContainer.appendChild(detailBox);

                            // クリックで詳細ボックスの表示/非表示を切り替え
                            btn.onclick = (e) => {
                                e.preventDefault(); e.stopPropagation();
                                if (detailBox.style.display === 'none') {
                                    detailBox.style.display = 'block';
                                    btn.textContent = '🔼 閉じる';
                                } else {
                                    detailBox.style.display = 'none';
                                    btn.textContent = '✅ メタデータ';
                                }
                            };
                        } else {
                            btn.textContent = '❌ 取得できませんでした';
                            btn.style.backgroundColor = 'transparent';
                            btn.style.color = '#999';
                            btn.style.opacity = '0.5';
                            btn.style.cursor = 'default';
                            btn.dataset.hasMeta = "false";
                        }
                        // ホバーイベントの解除
                        anchor.removeEventListener('mouseenter', startAnalysis);
                        btn.removeEventListener('mouseenter', startAnalysis);
                        resolve();
                    },
                    onError: (err) => {
                        console.error(err);
                        btn.textContent = '⚠️ エラー';
                        btn.style.backgroundColor = '#FFCDD2';
                        btn.style.color = '#D32F2F';
                        btn.dataset.status = 'error';
                        resolve();
                    }
                });
            });
            return analysisPromise;
        };

        btn.onclick = (e) => { e.preventDefault(); e.stopPropagation(); startAnalysis(); };
        anchor.addEventListener('mouseenter', startAnalysis); // リンクホバーで解析開始
        btn.addEventListener('mouseenter', startAnalysis); // ボタンホバーで解析開始
        btn.startMetaAnalysis = startAnalysis; // 一括解析用に関数を保持
    }

    // ==========================================
    // 7. グローバルコントロール (一括操作)
    // ==========================================
    function injectGlobalControlButtons() {
        const createContainer = () => {
            const wrapper = document.createElement('div');
            Object.assign(wrapper.style, {
                textAlign: 'center', padding: '10px', backgroundColor: 'rgba(255,255,255,0.05)',
                margin: '10px 0', borderRadius: '5px'
            });
            return wrapper;
        };

        const createButton = (text, color, onClick) => {
            const btn = document.createElement('button');
            btn.textContent = text;
            Object.assign(btn.style, {
                fontSize: '12px', padding: '6px 12px', margin: '0 5px', border: 'none', borderRadius: '4px',
                backgroundColor: color, color: 'white', cursor: 'pointer', fontWeight: 'bold', boxShadow: '0 2px 5px rgba(0,0,0,0.2)'
            });
            btn.onclick = onClick;
            return btn;
        };

        // 一括ダウンロード処理 (fflateを使用)
        const handleBulkDownload = async (onlyAnalyzed) => {
            const btns = Array.from(document.querySelectorAll('button.meta-scan-btn'));
            if (btns.length === 0) {
                alert('対象画像がありません');
                return;
            }

            let message = `${btns.length}枚の画像をダウンロードしますか？`;
            if (onlyAnalyzed) {
                message = `全${btns.length}枚の画像をチェックし、メタデータがある画像のみをダウンロードしますか？\n（未解析の画像は自動的に解析されます）`;
            }
            if (!confirm(message)) return;

            // fflateによるZIP生成のセットアップ
            // @ts-ignore
            const zip = new fflate.Zip();
            const zipData = [];

            // 圧縮データが生成されるたびに呼び出されるコールバック
            zip.ondata = (err, data, final) => {
                if (err) {
                    console.error(err);
                    return;
                }
                zipData.push(data);
                if (final) {
                    // 全ての処理が完了したらBlobを作成してダウンロード
                    const blob = new Blob(zipData, { type: 'application/zip' });
                    const a = document.createElement('a');
                    a.href = URL.createObjectURL(blob);
                    a.download = `images_${Date.now()}.zip`;
                    document.body.appendChild(a);
                    a.click();
                    document.body.removeChild(a);
                    URL.revokeObjectURL(a.href);

                    if (statusLabel.parentNode) document.body.removeChild(statusLabel);
                }
            };

            const statusLabel = document.createElement('div');
            statusLabel.style.position = 'fixed';
            statusLabel.style.top = '10px'; statusLabel.style.right = '10px';
            statusLabel.style.background = '#333'; statusLabel.style.color = '#fff';
            statusLabel.style.padding = '10px'; statusLabel.style.zIndex = '10000';
            statusLabel.textContent = '準備中...';
            document.body.appendChild(statusLabel);

            try {
                let targetBtns = [...btns];

                // 「メタデータ解析済のみ」モードの場合の事前処理
                if (onlyAnalyzed) {
                    statusLabel.textContent = 'メタデータ解析中...';
                    const unanalyzed = targetBtns.filter(b => b.dataset.status !== 'analyzed' && b.dataset.status !== 'error');

                    // 未解析分を並列処理で解析（サーバー負荷を考慮し制限付き）
                    await pMap(unanalyzed, async (btn) => {
                        if (typeof btn.startMetaAnalysis === 'function') {
                            await btn.startMetaAnalysis();
                        }
                    }, MAX_CONCURRENT_REQUESTS);

                    // メタデータ有りフラグが立っているものだけ抽出
                    targetBtns = targetBtns.filter(b => b.dataset.hasMeta === "true");
                }

                if (targetBtns.length === 0) {
                    alert('ダウンロード対象がありませんでした');
                    document.body.removeChild(statusLabel);
                    return;
                }

                statusLabel.textContent = `${targetBtns.length}枚の画像をダウンロード中...`;

                let processedCount = 0;

                // 画像ダウンロードとZIP追加の並列処理
                await pMap(targetBtns, async (btn) => {
                    const url = btn.dataset.href;
                    if (!url) return;

                    try {
                        const buffer = await new Promise((resolve, reject) => {
                            GM_xmlhttpRequest({
                                method: "GET",
                                url: url,
                                responseType: "arraybuffer",
                                onload: (response) => resolve(new Uint8Array(response.response)),
                                onerror: () => resolve(null)
                            });
                        });

                        if (buffer) {
                            const filename = url.substring(url.lastIndexOf('/') + 1) || `image_${Date.now()}.png`;
                            // ZipPassThroughを使用してデータをストリームに追加
                            // @ts-ignore
                            const file = new fflate.ZipPassThrough(filename);
                            zip.add(file);
                            file.push(buffer, true); // true = 最後のチャンク
                        }

                        processedCount++;
                        statusLabel.textContent = `ダウンロード中... ${processedCount}/${targetBtns.length}`;

                    } catch (e) {
                        console.error(e);
                    }
                }, MAX_CONCURRENT_REQUESTS);

                statusLabel.textContent = 'ZIP生成中...';
                zip.end(); // ストリームの終了を通知

            } catch (e) {
                console.error(e);
                alert('ダウンロード中にエラーが発生しました');
                if (statusLabel.parentNode) document.body.removeChild(statusLabel);
            }
        };

        // コントロールボタン群の描画
        const renderControls = (parent) => {
            const container = createContainer();

            const btnAnalyze = createButton('🚀 全画像を解析', '#2196F3', () => {
                const unanalyzedBtns = document.querySelectorAll('button.meta-scan-btn[data-status="unanalyzed"]');
                if (unanalyzedBtns.length === 0) return alert('未解析の画像はありません');
                if (!confirm(`${unanalyzedBtns.length}枚の画像を解析しますか？`)) return;
                unanalyzedBtns.forEach(b => b.startMetaAnalysis && b.startMetaAnalysis());
            });

            const btnDownload = createButton('💾 一括ダウンロード', '#FF9800', () => {
                const checkbox = container.querySelector('input[type="checkbox"]');
                handleBulkDownload(checkbox.checked);
            });

            const checkLabel = document.createElement('label');
            checkLabel.style.marginLeft = '10px';
            checkLabel.style.fontSize = '12px';
            checkLabel.style.color = '#ccc';
            checkLabel.style.cursor = 'pointer';

            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.style.marginRight = '5px';

            checkLabel.appendChild(checkbox);
            checkLabel.appendChild(document.createTextNode('メタデータ解析済のみ'));

            container.appendChild(btnAnalyze);
            container.appendChild(btnDownload);
            container.appendChild(checkLabel);

            if (parent.classList.contains('thread-nav-top')) {
                parent.insertAdjacentElement('afterend', container);
            } else {
                parent.insertAdjacentElement('beforebegin', container);
            }
        };

        const topNav = document.querySelector('.thread-nav.thread-nav-top');
        if (topNav) renderControls(topNav);

        const bottomNav = document.querySelector('.thread-nav.thread-nav-bottom');
        if (bottomNav) renderControls(bottomNav);
    }

    // ==========================================
    // 8. カーテン処理
    // ==========================================

    // スタイル適用
    if (typeof GM_addStyle !== 'undefined') {
        GM_addStyle(CURTAIN_STYLE);
    } else {
        const style = document.createElement('style');
        style.textContent = CURTAIN_STYLE;
        document.head.appendChild(style);
    }

    // メイン処理
    function applyCurtain() {
        const anchorTags = document.querySelectorAll('a div img');

        anchorTags.forEach(img => {
            const anchor = img.closest('a');
            if (!anchor) return;

            // 既にカーテンがある(tm-curtain-active)、
            // またはユーザーが一度クリックして解除した(tm-user-revealed)場合はスキップ
            if (anchor.classList.contains('tm-curtain-active') || anchor.classList.contains('tm-user-revealed')) {
                return;
            }

            const parent = anchor.parentElement;
            if (!parent) return;

            // 同階層のblockquoteを探す
            const blockquote = parent.querySelector('blockquote');

            if (blockquote) {
                const text = blockquote.textContent;
                const isTarget = TARGET_KEYWORDS.some(keyword => text.includes(keyword));

                if (isTarget) {
                    createMask(anchor);
                }
            }
        });
    }

    // カーテン作成処理
    function createMask(anchor) {
        // 重複処理防止のフラグ（カーテン適用中）
        anchor.classList.add('tm-curtain-active');
        anchor.classList.add('tm-relative-anchor');

        const mask = document.createElement('div');
        mask.className = 'tm-warning-curtain';
        mask.textContent = 'クリックで表示';

        mask.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();

            // カーテン削除
            mask.remove();

            // フラグ更新：適用中を外し、解除済み(revealed)を追加
            anchor.classList.remove('tm-curtain-active');
            anchor.classList.add('tm-user-revealed');
        });

        anchor.appendChild(mask);
    }

    // ==========================================
    // 9. 初期化
    // ==========================================
    function init() {
        // 既存のリンクに対してスキャン
        const anchors = document.querySelectorAll('a');
        anchors.forEach(attachScanner);

        let isScheduled = false;
        // 動的に追加されるコンテンツ（無限スクロール等）を監視
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                mutation.addedNodes.forEach((node) => {
                    if (node.nodeType === 1) {
                        if (node.tagName === 'A') attachScanner(node);
                        else node.querySelectorAll('a').forEach(attachScanner);
                    }
                });
            });
            // すでに次の描画フレームでの実行が予約されていれば何もしない
            if (isScheduled) return;
            isScheduled = true;
            // 次の描画タイミングまで処理を待機（間引き処理）
            requestAnimationFrame(() => {
                // カーテン処理実行
                applyCurtain();
                isScheduled = false; // 処理が終わったらフラグを下ろす
            });
        });
        observer.observe(document.body, { childList: true, subtree: true });

        // 全体操作ボタンの配置
        injectGlobalControlButtons();
    }

    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
    else init();

    // 初回実行
    // ページ読み込み完了時に実行
    window.addEventListener('load', applyCurtain);

    // 遅延読み込み等に対応する場合、少し待ってから実行（保険）
    setTimeout(applyCurtain, 1000);

})();