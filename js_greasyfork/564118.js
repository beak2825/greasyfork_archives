// ==UserScript==
// @name         Hitomi.la Favorites Library
// @namespace    http://tampermonkey.net/
// @version      2.2
// @description  Library to render Hitomi.la favorites page with Dual Search (Global & Local), Sort, Remove features
// @author       Test
// ==/UserScript==

(function() {
    'use strict';

    // =========================================================================
    //  1. CSS定義 (修正版)
    // =========================================================================
    const HITOMI_CSS = `
        /* --- Base & Navbar --- */
        body { margin: 0 auto; background-color: #eeeeee; font-family: Arial, Helvetica, sans-serif; }
        nav { display: inline-block; color: #fff; text-transform: uppercase; font: 18px Arial,Helvetica,sans-serif; vertical-align: middle; max-height: 100%; }
        nav ul { list-style: none; display: inline-block; margin: 0; padding: 0; }
        nav ul li { list-style: none; display: inline-block; position: relative; }
        nav > ul > li > a { padding: 10px 15px; line-height: 40px; color: inherit; text-decoration: none; }
        nav > ul > li:hover { background-color: #29313d; }
        .navbar { max-width: 1060px; background-color: #30425f; background-image: url('//ltn.gold-usergeneratedcontent.net/navbg.jpg'); height: 40px; margin: auto; position: relative; z-index: 100; }
        #logo { width: 80px; margin: 6px 17px 6px 17px; height: 28px; display: inline-block; float: left; }
        #logo img { max-height: 100%; max-width: 100%; }
        
        /* --- Global Search (Header) --- */
        .header-table { width: 300px; display: table; float: right; padding: 5px; }
        .search-input { display: table-cell; vertical-align: top; width: 100%; position: relative; }
        #query-input, textarea#query-input { 
            display: inline-block; line-height: 14px; padding: 4px 4px 4px 8px; width: 100%; height: 30px !important; 
            box-sizing: border-box; border: 1px solid #999; resize: none; overflow: hidden; vertical-align: middle;
        }
        #search-button { 
            background-color: #f0f0f0; border: 1px solid #999; text-align: center; vertical-align: middle; padding: 0; 
            width: 65px; height: 30px; line-height: 16px !important; font: bold 14px Arial,Helvetica,sans-serif; 
            color: #555555; margin-left: 10px; box-sizing: border-box; display: table-cell; cursor: pointer;
        }

        /* --- Page Layout --- */
        .container { max-width: 1060px; margin: auto; border: 1px solid #BBB; box-shadow: 0 0 10px #DDD; background-color: #fff; overflow: hidden; min-height: 100vh; }
        .top-content { background-color: #ffffff; padding: 10px 10px 0 10px; }
        .list-title { height: 35px; text-transform: capitalize; background-color: #79799a; background-image: url('//ltn.gold-usergeneratedcontent.net/h3bg.jpg'); border: 1px solid #333333; position: relative; margin-bottom: 10px; }
        h3 { position: relative; float: left; top: -15px; margin: 0 0 30px 0; padding-left: 100px; color: #ffffff; font: bold 35px Arial,Helvetica,sans-serif; text-shadow: -1px -1px 0 #333, 1px -1px 0 #333, -1px 1px 0 #333, 1px 1px 0 #333, 0 -2px 0 #333, 0 2px 0 #333, -2px 0 0 #333, 2px 0 0 #333; white-space: nowrap; overflow-x: hidden; }
        
        .gallery-content { clear: left; background-color: #fff; text-transform: capitalize; overflow: hidden; padding: 10px 10px 30px 10px; }
        .gallery-content a { text-decoration: none; color: inherit; }
        
        /* --- Gallery Cards --- */
        .dj, .cg, .acg, .manga, .anime, .imageset { z-index: 0; position: relative; width: 100%; margin: 0 0 20px 0; border-radius: 4px; background-color: #fafafa; border: 1px solid #cc9999; color: #663333; transition: opacity 0.3s, filter 0.3s; }
        .dj { border-color: #cc9999; color: #663333; } .dj:hover { border-color: #996666; }
        .cg { border-color: #9999cc; color: #333366; } .cg:hover { border-color: #666699; }
        .acg { border-color: #99cccc; color: #336666; } .acg:hover { border-color: #669999; }
        .manga { border-color: #cc99cc; color: #663366; } .manga:hover { border-color: #996699; }
        .anime { border-color: #99cc99; color: #336633; } .anime:hover { border-color: #669966; }
        .imageset { border-color: #999999; color: #696969; } .imageset:hover { border-color: #696969; }

        .gallery-content h1 { white-space: nowrap; margin: 0; padding-left: 300px; color: #ffffff; font: bold 22px Arial,Helvetica,sans-serif; overflow: hidden; }
        .dj h1 { background-color: #cc9999; text-shadow: -1px -1px 0 #663333, 1px 1px 0 #663333; }
        .cg h1 { background-color: #9999cc; text-shadow: -1px -1px 0 #333366, 1px 1px 0 #333366; }
        .acg h1 { background-color: #99cccc; text-shadow: -1px -1px 0 #336666, 1px 1px 0 #336666; }
        .manga h1 { background-color: #cc99cc; text-shadow: -1px -1px 0 #663366, 1px 1px 0 #663366; }
        .anime h1 { background-color: #99cc99; text-shadow: -1px -1px 0 #336633, 1px 1px 0 #336633; }
        .imageset h1 { background-color: #999999; text-shadow: -1px -1px 0 #696969, 1px 1px 0 #696969; }

        .gallery-content .artist-list { white-space: nowrap; margin: 0; padding: 2px 5px 2px 300px; font: bold 18px Arial,Helvetica,sans-serif; overflow: hidden; }
        .dj .artist-list { background-color: #ffcccc; }
        .cg .artist-list { background-color: #ccccff; }
        .acg .artist-list { background-color: #ccffff; }
        .manga .artist-list { background-color: #ffccff; }
        .anime .artist-list { background-color: #ccffcc; }
        .imageset .artist-list { background-color: #cccccc; }

        .dj-content { padding-left: 300px; font: bold 18px Arial,Helvetica,sans-serif; padding-bottom: 5px; }
        .dj-content table { width: 100%; margin-top: 4px; }
        .dj-content td { text-align: left; vertical-align: top; padding: 0; }
        .dj-content td:first-child { color: #666666; width: 150px; }
        .gallery-content ul { list-style-type: none; padding: 0; margin: 0; display: inline-block; }
        .gallery-content li { display: inline-block; }
        .gallery-content li:after { content: ", "; }
        .gallery-content li:last-child:after { content: ""; }
        
        .tags li, .relatedtags li { padding: 4px 0; margin: 0 4px 4px 0; display: inline-block; color: #ffffff; }
        .tags li a, .relatedtags li a { padding: 4px; background-color: #999999; border-radius: 4px; }
        .tags li a:hover, .relatedtags li a:hover { background-color: #777777; color: inherit; }
        .tags li:after, .relatedtags li:after { content: ""; }
        
        /* ★追加: タグのフォントサイズ調整 */
        .tags, .relatedtags { font-size: 12px; }

        .date { margin: 10px 0 5px 0; white-space: nowrap; padding-bottom: 4px; font-size: 14px; }
        .dj-date { color: #cc9999; } .cg-date { color: #9999cc; } .acg-date { color: #77aaaa; }
        .manga-date { color: #cc99cc; } .anime-date { color: #99cc99; } .imageset-date { color: #999999; }

        .dj-img-cont { z-index: 999; position: absolute; height: 220px; width: 300px; top: 15px; }
        .dj-img1 { z-index: 4; position: absolute; right: 2px; border: 1px solid #663333; background-color: #272733; height: 220px; max-width: 160px; min-width: 140px; text-align: center; }
        .dj-img1 img { max-height: 100%; max-width: 100%; position: relative; top: 50%; transform: translateY(-50%); }

        @media only screen and (min-width : 768px) {
            .dj-img-cont { perspective-origin: 50% 50%; perspective: 750px; transform-style: preserve-3d; }
            .dj-img1 { transform: rotateY(30deg); top: -20px; }
        }
        
        /* --- Mobile / Tablet Styles --- */
        @media (max-width : 768px) {
            .navbar { height: auto; }
            .header-table { float: none; width: 100%; }
            
            /* Hitomi Original Mobile Layout Imitation */
            .gallery-content h1, .gallery-content .artist-list { padding-left: 10px; }
            h3 { padding-left: 20px; font-size: 25px; }

            .dj-content {
                padding-left: 10px;
                padding-top: 240px; /* Space for image */
            }
            .dj-img-cont {
                left: -15px;
                top: 60px;
                width: 300px;
                height: 220px;
                /* スマホでもabsolute配置に戻す */
            }
            .dj-img1 {
                position: absolute;
                right: 2px;
                transform: none;
            }
            
            /* ★変更: Control Bar Responsive Fix (縦並び対応) */
            .control-bar {
                flex-direction: column; /* 縦並び */
                align-items: stretch;
                gap: 15px;
                padding: 15px 10px;
                height: auto;
            }
            .search-container {
                width: 100%;
                max-width: 100%; /* 横幅いっぱい */
                margin-right: 0;
            }
            .sort-container {
                position: static; /* 絶対配置解除 */
                display: flex;
                justify-content: space-between;
                align-items: center;
                width: 100%;
                margin-top: 5px;
            }
            .sort-select {
                flex-grow: 1;
                margin-left: 10px;
            }
        }

/* --- Local Favorites Control Bar (Revised) --- */
        .control-bar {
            position: relative;
            padding: 15px 20px;
            background: #fdfdfd;
            border-bottom: 1px solid #ddd;
            min-height: 40px;
        }

        /* PC: Search Container (Centered) */
        .search-container {
            width: 50%;
            max-width: 600px;
            margin: 0 auto; /* 中央寄せ */
            display: flex;
            align-items: center;
        }
        
        .fav-input-wrapper {
            position: relative;
            width: 100%;
            display: flex;
            align-items: center;
        }

        .fav-search-box {
            width: 100%;
            padding: 8px 35px 8px 10px;
            border: 1px solid #ccc;
            border-radius: 4px 0 0 4px;
            font-size: 14px;
            height: 36px;
            box-sizing: border-box;
        }
        
        .fav-search-clear {
            position: absolute;
            right: 5px;
            top: 50%;
            transform: translateY(-50%);
            cursor: pointer;
            color: #999;
            font-weight: bold;
            font-size: 18px;
            display: none;
            width: 24px;
            height: 24px;
            line-height: 24px;
            text-align: center;
            z-index: 10;
            background: transparent;
        }
        .fav-search-clear:hover { color: #555; }

        .fav-search-btn {
            padding: 0 20px;
            background: #30425f;
            color: #fff;
            border: none;
            border-radius: 0 4px 4px 0;
            cursor: pointer;
            height: 36px;
            font-weight: bold;
            flex-shrink: 0;
        }
        .fav-search-btn:hover { background: #223044; }
        
        /* PC: Sort Container (Right Aligned Absolute) */
        .sort-container {
            position: absolute;
            right: 20px;
            top: 15px;
            display: flex;
            align-items: center;
            gap: 8px;
        }
        .sort-label { font-size: 13px; color: #555; font-weight: bold; white-space: nowrap; }
        .sort-select {
            padding: 6px;
            border: 1px solid #ccc;
            border-radius: 4px;
            font-size: 13px;
            height: 36px;
            background: #fff;
        }

        /* --- Tablet & Mobile Responsive --- */
        /* 1024px以下（タブレット・スマホ）で縦並びに切り替え */
        @media (max-width: 1024px) {
            .control-bar {
                // display: flex;
                flex-direction: column;
                align-items: stretch; /* 幅いっぱいに */
                gap: 10px;
                height: auto;
            }
            .search-container {
                width: 100%;
                max-width: none;
                margin: 0;
            }
            .sort-container {
                position: static; /* 絶対配置解除 */
                width: 100%;
                justify-content: flex-end; /* 右寄せ */
            }
        }

        /* スマホ向け微調整 */
        @media (max-width: 768px) {
            nav {
                font: 14px Arial, Helvetica, sans-serif;
            }
            nav > ul > li > a {
                padding: 10px 7px;
            }
            .sort-container {
                justify-content: space-between; /* ラベル左、プルダウン右 */
            }
            .sort-select {
                flex-grow: 1;
                margin-left: 10px;
            }
        }

        /* --- Remove Button (Updated) --- */
        .remove-btn {
            position: absolute;
            right: 0px; 
            z-index: 9999; 
            background: rgba(0,0,0,0.6);
            color: #fff;
            border: none;
            padding: 4px 10px;
            border-radius: 4px;
            cursor: pointer;
            font-size: 12px;
            font-weight: bold;
            transition: background 0.2s;
        }
        .remove-btn:hover { background: #ed2553; }
        .remove-btn.undo { background: #ed2553; }
        .remove-btn.undo:hover { background: #30425f; }
        
        .card-removed { opacity: 0.4; filter: grayscale(100%); }
        .card-removed .remove-btn { pointer-events: auto; }
        .card-removed a { pointer-events: none; }
    `;

    // =========================================================================
    //  2. ヘルパー関数
    // =========================================================================
    function getClassByType(typeStr) {
        if (!typeStr) return 'dj';
        const t = typeStr.toLowerCase().replace(/\s+/g, '');
        if (t.includes('doujinshi')) return 'dj';
        if (t.includes('manga')) return 'manga';
        if (t.includes('artistcg')) return 'acg';
        if (t.includes('gamecg')) return 'cg';
        if (t.includes('anime')) return 'anime';
        if (t.includes('imageset')) return 'imageset';
        return 'dj';
    }

    function createLink(text, type) {
        if (!text || text === 'N/A') return 'N/A';
        const safeText = encodeURIComponent(text.replace(/\s+/g, ' '));
        let path = '';
        if (type === 'tag') {
            path = `/tag/${safeText}-all.html`.replace('%3A', ':');
        } else if (type === 'artist') path = `/artist/${safeText}-all.html`;
        else if (type === 'series') path = `/series/${safeText}-all.html`;
        else if (type === 'character') path = `/character/${safeText}-all.html`;
        else if (type === 'type') path = `/type/${safeText}-all.html`;
        else if (type === 'language') path = `/index-${text.toLowerCase()}.html`;
        return `<a href="${path}">${text}</a>`;
    }

    function createListHTML(items, type) {
        if (!items || items.length === 0) return 'N/A';
        if (typeof items === 'string') return items === 'N/A' ? 'N/A' : createLink(items, type);
        const validItems = items.filter(i => i !== 'N/A');
        if (validItems.length === 0) return 'N/A';
        return `<ul>${validItems.map(item => `<li>${createLink(item, type)}</li>`).join('')}</ul>`;
    }

    function parseDate(dateStr) {
        if (!dateStr) return 0;
        if (dateStr.includes('-')) {
            const d = new Date(dateStr.split('.')[0].replace(' ', 'T'));
            if (!isNaN(d.getTime())) return d.getTime();
        }
        const jpMatch = dateStr.match(/(\d+)年(\d+)月(\d+)日\s*(\d+):(\d+)/);
        if (jpMatch) {
            return new Date(jpMatch[1], jpMatch[2] - 1, jpMatch[3], jpMatch[4], jpMatch[5]).getTime();
        }
        return 0;
    }

    // =========================================================================
    //  3. 検索ロジック (Local Search)
    // =========================================================================
    function parseQuery(query) {
        const orGroups = query.split(/\s+OR\s+/i);
        return orGroups.map(groupStr => {
            const tokens = groupStr.trim().split(/[\s\u3000]+/);
            return tokens.map(token => {
                let isNegative = false;
                let t = token;
                if (t.startsWith('-')) {
                    isNegative = true;
                    t = t.substring(1);
                }
                const match = t.match(/^(id|title|artist|group|type|language|series|character|female|male|tag):(.+)$/i);
                if (match) {
                    return {
                        type: 'attribute',
                        key: match[1].toLowerCase(),
                        value: match[2].replace(/_/g, ' ').toLowerCase(),
                        negative: isNegative
                    };
                }
                return {
                    type: 'normal',
                    value: t.toLowerCase(),
                    negative: isNegative
                };
            }).filter(t => t.value !== '');
        });
    }

    function checkCondition(item, cond) {
        const info = item['gallery-info'] || {};
        const getVal = (v) => (v && v !== 'N/A') ? v.toLowerCase() : '';
        const getList = (arr) => (arr || []).filter(v => v !== 'N/A').map(v => v.toLowerCase());

        if (cond.type === 'attribute') {
            const val = cond.value;
            let targets = [];
            switch (cond.key) {
                case 'id': targets.push(String(item.id)); break;
                case 'title': targets.push(getVal(item.title)); break;
                case 'artist': targets.push(getVal(item.artist)); break;
                case 'group': targets.push(getVal(info.Group)); break;
                case 'type': targets.push(getVal(info.Type)); break;
                case 'language': targets.push(getVal(info.Language)); break;
                case 'series': targets = getList(info.Series); break;
                case 'character': targets = getList(info.Characters); break;
                case 'female': targets = getList(info.Tags).filter(t => t.endsWith(' ♀')).map(t => t.replace(' ♀', '')); break;
                case 'male': targets = getList(info.Tags).filter(t => t.endsWith(' ♂')).map(t => t.replace(' ♂', '')); break;
                case 'tag': targets = getList(info.Tags).filter(t => !t.endsWith(' ♀') && !t.endsWith(' ♂')); break;
            }
            const isMatch = targets.includes(val) || targets.some(t => t === val);
            return cond.negative ? !isMatch : isMatch;
        }
        
        const allText = [
            String(item.id),
            item.title,
            item.artist,
            info.Group,
            info.Type,
            info.Language,
            ...(info.Series || []),
            ...(info.Characters || []),
            ...(info.Tags || [])
        ].map(s => getVal(s)).join(' ');

        const isMatch = allText.includes(cond.value);
        return cond.negative ? !isMatch : isMatch;
    }

    function filterItems(items, query) {
        if (!query.trim()) return items;
        const orGroups = parseQuery(query);
        return items.filter(item => {
            return orGroups.some(andConditions => {
                return andConditions.every(cond => checkCondition(item, cond));
            });
        });
    }

    // =========================================================================
    //  4. 描画 & コントロールクラス
    // =========================================================================
    class FavoritesRenderer {
        constructor(allData, callbacks) {
            this.allData = allData;
            this.callbacks = callbacks || {};
            this.state = {
                query: '',
                sortBy: 'added_new',
                removedIds: new Set()
            };
        }

        init() {
            this.renderLayout();
            this.updateGallery();
            this.attachEvents();
            
            // Type Filterスクリプトの再初期化
            setTimeout(() => {
                if (window.HitomiTypeFilter_Reload) {
                    console.log('Reloading Type Filter Script...');
                    window.HitomiTypeFilter_Reload();
                }
            }, 100);
        }

        getFilteredAndSortedData() {
            let items = filterItems(this.allData, this.state.query);
            items.sort((a, b) => {
                const addedA = a.added_at || 0;
                const addedB = b.added_at || 0;
                const dateA = parseDate((a['gallery-info'] || {}).date);
                const dateB = parseDate((b['gallery-info'] || {}).date);

                switch (this.state.sortBy) {
                    case 'added_new': return addedB - addedA;
                    case 'added_old': return addedA - addedB;
                    case 'date_new': return dateB - dateA;
                    case 'date_old': return dateA - dateB;
                    default: return 0;
                }
            });
            return items;
        }

        renderLayout() {
            document.title = "My Favorites - Hitomi.la";
            const pageHTML = `
                <!DOCTYPE html>
                <html>
                <head>
                    <meta charset="UTF-8">
                    <title>My Favorites - Hitomi.la</title>
                    <meta name="viewport" content="width=device-width,initial-scale=1.0">
                    <style>${HITOMI_CSS}</style>
                </head>
                <body>
                    <div class="container">
                        <!-- Navbar -->
                        <div class="navbar">
                            <div id="logo"><a href="/"><img src="//ltn.gold-usergeneratedcontent.net/logo.png" alt="Logo"></a></div>
                            <nav>
                                <ul>
                                    <li><a href="/alltags-a.html">tags</a></li>
                                    <li><a href="/allartists-a.html">artists</a></li>
                                    <li><a href="/allseries-a.html">series</a></li>
                                    <li><a href="/allcharacters-a.html">characters</a></li>
                                </ul>
                            </nav>
                            
                            <!-- Global Search (Hitomi Original) -->
                            <!-- Type Filter Script attaches to this #query-input -->
                            <div class="header-table">
                                <div class="search-input">
                                    <input type="text" id="query-input" placeholder="Search..." autocomplete="off">
                                </div>
                                <button id="search-button" type="button">Search</button>
                            </div>
                        </div>

                        <!-- Top Content -->
                        <div class="top-content">
                            <div class="list-title">
                                <h3>My Favorites (<span id="fav-count">0</span>)</h3>
                            </div>
                        </div>

                        <!-- Control Bar (Local Search) -->
                        <div class="control-bar" id="fav-control-bar">
                            <div class="search-container">
                                <div class="fav-input-wrapper">
                                    <input type="text" class="fav-search-box" id="fav-query-input" placeholder="Search favorites...">
                                    <span class="fav-search-clear" id="fav-clear">×</span>
                                </div>
                                <button class="fav-search-btn" id="fav-search-btn">Search</button>
                            </div>
                            <div class="sort-container">
                                <span class="sort-label">Sort by:</span>
                                <select class="sort-select" id="fav-sort">
                                    <option value="added_new">Date Added (Newest)</option>
                                    <option value="added_old">Date Added (Oldest)</option>
                                    <option value="date_new">Date Published (Newest)</option>
                                    <option value="date_old">Date Published (Oldest)</option>
                                </select>
                            </div>
                        </div>

                        <!-- Gallery Content -->
                        <div class="gallery-content" id="fav-gallery"></div>

                        <div class="donate" style="text-align:center; padding:20px; color:#aaa;">
                            Generated by Hitomi Favorites Script
                        </div>
                    </div>
                </body>
                </html>
            `;
            document.open();
            document.write(pageHTML);
            document.close();
        }

        updateGallery() {
            const items = this.getFilteredAndSortedData();
            const container = document.getElementById('fav-gallery');
            const countSpan = document.getElementById('fav-count');
            
            if (countSpan) countSpan.textContent = items.length;
            
            if (items.length === 0) {
                container.innerHTML = '<div style="padding:20px; text-align:center; font-size:18px; color:#666;">No favorites found matching your criteria.</div>';
                return;
            }

            container.innerHTML = items.map(item => this.generateCardHTML(item)).join('');
            
            container.querySelectorAll('.remove-btn').forEach(btn => {
                btn.addEventListener('click', (e) => this.handleRemoveClick(e));
            });
        }

        generateCardHTML(item) {
            const info = item['gallery-info'] || {};
            const typeClass = getClassByType(info.Type);
            const dateDisplay = info.date || new Date(item.added_at).toLocaleString();
            
            const artistHTML = createListHTML(item.artist ? item.artist.split(', ') : [], 'artist');
            const seriesHTML = createListHTML(info.Series, 'series');
            const tagsHTML = createListHTML(info.Tags, 'tag');
            const typeLink = createLink(info.Type || 'doujinshi', 'type');
            const langLink = createLink(info.Language || 'N/A', 'language');

            const isRemoved = this.state.removedIds.has(String(item.id));
            const cardClass = isRemoved ? `${typeClass} card-removed` : typeClass;
            const btnText = isRemoved ? 'Undo' : 'Remove';
            const btnClass = isRemoved ? 'remove-btn undo' : 'remove-btn';

            return `
            <div class="${cardClass}" data-id="${item.id}">
                <button class="${btnClass}">${btnText}</button>
                <a href="${item.url}" class="lillie">
                    <div class="dj-img-cont" data-gallery-id="${item.id}">
                        <div class="dj-img1">
                            <img src="${item.thumbnail}" loading="lazy" alt="${item.title}">
                        </div>
                    </div>
                </a>
                <h1 class="lillie"><a href="${item.url}">${item.title}</a></h1>
                <div class="artist-list">${artistHTML}</div>
                <div class="dj-content">
                    <table class="dj-desc">
                        <tbody>
                            <tr><td>Series</td><td class="series-list">${seriesHTML}</td></tr>
                            <tr><td>Type</td><td>${typeLink}</td></tr>
                            <tr><td>Language</td><td>${langLink}</td></tr>
                            <tr><td>Tags</td><td class="relatedtags">${tagsHTML}</td></tr>
                        </tbody>
                    </table>
                    <p class="${typeClass}-date date">${dateDisplay}</p>
                </div>
            </div>
            `;
        }

        handleRemoveClick(e) {
            e.preventDefault();
            const btn = e.target;
            const card = btn.closest('div[data-id]');
            const id = card.getAttribute('data-id');
            const isUndo = btn.classList.contains('undo');

            if (isUndo) {
                this.state.removedIds.delete(id);
                card.classList.remove('card-removed');
                btn.classList.remove('undo');
                btn.textContent = 'Remove';
                const item = this.allData.find(i => String(i.id) === id);
                if (item && this.callbacks.onUndo) this.callbacks.onUndo(item);
            } else {
                this.state.removedIds.add(id);
                card.classList.add('card-removed');
                btn.classList.add('undo');
                btn.textContent = 'Undo';
                if (this.callbacks.onRemove) this.callbacks.onRemove(id);
            }
        }

        attachEvents() {
            // --- Global Search Event (Hitomi Original) ---
            const globalSearchBtn = document.getElementById('search-button');
            if (globalSearchBtn) {
                globalSearchBtn.addEventListener('click', (e) => {
                    e.preventDefault();
                    // Type Filter Script might have replaced input with textarea
                    const input = document.getElementById('query-input');
                    if (input) {
                        const query = input.value;
                        if (query.trim()) {
                            window.location.href = 'https://hitomi.la/search.html?' + encodeURIComponent(query);
                        }
                    }
                });
            }

            // --- Local Search Events ---
            const searchBtn = document.getElementById('fav-search-btn');
            const clearBtn = document.getElementById('fav-clear');
            const sortSelect = document.getElementById('fav-sort');
            const queryInput = document.getElementById('fav-query-input');

            const doSearch = () => {
                this.state.query = queryInput.value;
                this.updateGallery();
                clearBtn.style.display = this.state.query ? 'block' : 'none';
            };

            searchBtn.addEventListener('click', doSearch);
            
            queryInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') doSearch();
            });
            
            queryInput.addEventListener('input', () => {
                clearBtn.style.display = queryInput.value ? 'block' : 'none';
            });

            clearBtn.addEventListener('click', () => {
                queryInput.value = '';
                doSearch();
                queryInput.focus();
            });

            sortSelect.addEventListener('change', (e) => {
                this.state.sortBy = e.target.value;
                this.updateGallery();
            });
        }
    }

    // =========================================================================
    //  5. 公開
    // =========================================================================
    window.HitomiFavoritesLib = {
        render: function(data, callbacks) {
            const renderer = new FavoritesRenderer(data, callbacks);
            renderer.init();
        }
    };

})();