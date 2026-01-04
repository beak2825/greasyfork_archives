// ==UserScript==
// @name         妹妹美瀑布流浏览
// @namespace    http://tampermonkey.net/
// @version      2.2
// @description  把 mmm.red 或 156.251.176.105 改造成瀑布流体验，自动加载详情页图片，大图支持鼠标悬浮放大
// @match        *://156.251.176.105/*
// @match        *://mmm.red/*
// @match        *://www.mmm999.my/*
// @grant        none
// @run-at       document-start
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/559111/%E5%A6%B9%E5%A6%B9%E7%BE%8E%E7%80%91%E5%B8%83%E6%B5%81%E6%B5%8F%E8%A7%88.user.js
// @updateURL https://update.greasyfork.org/scripts/559111/%E5%A6%B9%E5%A6%B9%E7%BE%8E%E7%80%91%E5%B8%83%E6%B5%81%E6%B5%8F%E8%A7%88.meta.js
// ==/UserScript==

(function() {
    'use strict';

    if (window.self !== window.top) return;
    try { window.stop(); } catch(e) {}

    console.log('[MMM_Log] 脚本 V2.1 启动 (优化放大镜稳定性)...');

    // =========================================================
    // 资源配置
    // =========================================================
    const LIBS = {
        tailwind: 'https://cdn.tailwindcss.com',
        react: 'https://cdn.staticfile.net/react/18.2.0/umd/react.production.min.js',
        reactDom: 'https://cdn.staticfile.net/react-dom/18.2.0/umd/react-dom.production.min.js',
        babel: 'https://cdn.staticfile.net/babel-standalone/7.23.5/babel.min.js'
    };

    // =========================================================
    // 核心 React 代码
    // =========================================================
    const reactAppCode = `
        const { useState, useEffect, useRef, useCallback, useMemo } = React;

        // --- Icons ---
        const IconImage = () => React.createElement('svg', {xmlns:"http://www.w3.org/2000/svg", width:"20", height:"20", viewBox:"0 0 24 24", fill:"none", stroke:"currentColor", strokeWidth:"2", strokeLinecap:"round", strokeLinejoin:"round"}, React.createElement('rect', {width:"18", height:"18", x:"3", y:"3", rx:"2", ry:"2"}), React.createElement('circle', {cx:"9", cy:"9", r:"2"}), React.createElement('path', {d:"m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"}));
        const IconLoader = () => React.createElement('svg', {xmlns:"http://www.w3.org/2000/svg", width:"24", height:"24", viewBox:"0 0 24 24", fill:"none", stroke:"currentColor", strokeWidth:"2", strokeLinecap:"round", strokeLinejoin:"round", className:"animate-spin"}, React.createElement('path', {d:"M21 12a9 9 0 1 1-6.219-8.56"}));
        const IconX = () => React.createElement('svg', {xmlns:"http://www.w3.org/2000/svg", width:"24", height:"24", viewBox:"0 0 24 24", fill:"none", stroke:"currentColor", strokeWidth:"2", strokeLinecap:"round", strokeLinejoin:"round"}, React.createElement('path', {d:"M18 6 6 18"}), React.createElement('path', {d:"m6 6 12 12"}));
        const IconExternalLink = () => React.createElement('svg', {xmlns:"http://www.w3.org/2000/svg", width:"16", height:"16", viewBox:"0 0 24 24", fill:"none", stroke:"currentColor", strokeWidth:"2", strokeLinecap:"round", strokeLinejoin:"round"}, React.createElement('path', {d:"M15 3h6v6"}), React.createElement('path', {d:"M10 14 21 3"}), React.createElement('path', {d:"M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"}));
        const IconPlus = () => React.createElement('svg', {xmlns:"http://www.w3.org/2000/svg", width:"16", height:"16", viewBox:"0 0 24 24", fill:"none", stroke:"currentColor", strokeWidth:"2", strokeLinecap:"round", strokeLinejoin:"round"}, React.createElement('path', {d:"M5 12h14"}), React.createElement('path', {d:"M12 5v14"}));
        const IconMinus = () => React.createElement('svg', {xmlns:"http://www.w3.org/2000/svg", width:"16", height:"16", viewBox:"0 0 24 24", fill:"none", stroke:"currentColor", strokeWidth:"2", strokeLinecap:"round", strokeLinejoin:"round"}, React.createElement('path', {d:"M5 12h14"}));
        const IconZoom = () => React.createElement('svg', {xmlns:"http://www.w3.org/2000/svg", width:"16", height:"16", viewBox:"0 0 24 24", fill:"none", stroke:"currentColor", strokeWidth:"2", strokeLinecap:"round", strokeLinejoin:"round"}, React.createElement('circle', {cx:"11", cy:"11", r:"8"}), React.createElement('path', {d:"m21 21-4.3-4.3"}));

        // --- DOM Parser ---
        const parseDOM = (htmlString) => {
            const parser = new DOMParser();
            return parser.parseFromString(htmlString, 'text/html');
        };

        // --- Hook: Window Size ---
        const useAutoColumns = () => {
            const getCols = () => {
                const w = window.innerWidth;
                if (w < 640) return 2;
                if (w < 768) return 3;
                if (w < 1024) return 4;
                if (w < 1280) return 5;
                if (w < 1536) return 6;
                return 8;
            };
            const [cols, setCols] = useState(getCols());
            useEffect(() => {
                const handleResize = () => setCols(getCols());
                window.addEventListener('resize', handleResize);
                return () => window.removeEventListener('resize', handleResize);
            }, []);
            return cols;
        };

        // --- Component: Magnifier Image (稳定版放大镜组件) ---
        const MagnifierImage = ({ src, alt }) => {
            const [zoom, setZoom] = useState(false);
            const [position, setPosition] = useState({ x: 0.5, y: 0.5 }); // 默认居中
            const imgRef = useRef(null);

            const handleMouseMove = (e) => {
                if (!imgRef.current) return;
                const { left, top, width, height } = imgRef.current.getBoundingClientRect();
                // 计算鼠标在图片上的相对位置 (0-1)
                const x = (e.clientX - left) / width;
                const y = (e.clientY - top) / height;

                // 限制在 0-1 之间，防止移出边界时的跳动
                const clampedX = Math.max(0, Math.min(1, x));
                const clampedY = Math.max(0, Math.min(1, y));

                setPosition({ x: clampedX, y: clampedY });
            };

            // 放大倍数
            const scale = 2.5;

            // 计算平移量:
            // 当鼠标在左边(0)时，图片向右平移，展示左侧细节 -> translate > 0
            // 当鼠标在右边(1)时，图片向左平移 -> translate < 0
            // 公式: (0.5 - position) * (scale - 1) * 100%
            const translateX = (0.5 - position.x) * (scale - 1) * 100;
            const translateY = (0.5 - position.y) * (scale - 1) * 100;

            return React.createElement('div', {
                className: "relative overflow-hidden flex items-center justify-center", // overflow-hidden 确保放大不溢出容器
                style: { width: '100%', height: '100%', maxHeight: '90vh' },
                onMouseEnter: () => setZoom(true),
                onMouseLeave: () => { setZoom(false); setPosition({ x: 0.5, y: 0.5 }); }, // 移出复位
                onMouseMove: handleMouseMove,
                onClick: (e) => e.stopPropagation()
            }, [
                React.createElement('img', {
                    key: 'main-img',
                    ref: imgRef,
                    src: src,
                    alt: alt,
                    className: "max-w-full max-h-[90vh] object-contain shadow-2xl rounded-lg cursor-crosshair",
                    style: {
                        // 使用 translate + scale 组合，而不是 transform-origin
                        // 这样图片框架在视觉上是固定的，内容在内部平移
                        transform: zoom
                            ? \`translate(\${translateX}%, \${translateY}%) scale(\${scale})\`
                            : 'translate(0, 0) scale(1)',
                        transition: 'transform 0.1s ease-out', // 平滑过渡
                        transformOrigin: 'center center' // 始终以中心为基准
                    }
                }),
                !zoom && React.createElement('div', {
                    key: 'hint',
                    className: "absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/50 text-white text-xs px-2 py-1 rounded backdrop-blur-sm pointer-events-none animate-pulse flex items-center gap-1"
                }, [React.createElement(IconZoom, {key:'icon'}), " 移动鼠标以放大"])
            ]);
        };

        // --- Main App ---
        function App() {
            const [photos, setPhotos] = useState([]);
            const [status, setStatus] = useState('初始化中...');
            const [selectedPhoto, setSelectedPhoto] = useState(null);

            const autoCols = useAutoColumns();
            const [manualCols, setManualCols] = useState(null);
            const numCols = manualCols ?? autoCols;

            const stateRef = useRef({
                albumQueue: [],
                currentListPage: 1,
                isFetching: false,
                hasMore: true,
                seenIds: new Set()
            });

            // 获取相册列表
            const fillAlbumQueue = async () => {
                const pageUrl = \`/list/\${stateRef.current.currentListPage}.html\`;
                setStatus(\`正在获取第 \${stateRef.current.currentListPage} 页列表...\`);
                try {
                    const res = await fetch(pageUrl);
                    if (!res.ok) return false;
                    const html = await res.text();
                    const doc = parseDOM(html);
                    const items = Array.from(doc.querySelectorAll('.item'));
                    if (items.length === 0) return false;

                    const newAlbums = items.map(item => {
                        const link = item.querySelector('a.item-link');
                        const img = item.querySelector('img.item-img');
                        if (!link) return null;
                        return {
                            url: link.href,
                            title: link.innerText.trim(),
                            id: link.getAttribute('href'),
                            cover: img ? (img.getAttribute('data-original') || img.src) : null
                        };
                    }).filter(Boolean);

                    const uniqueAlbums = newAlbums.filter(a => !stateRef.current.seenIds.has(a.id));
                    uniqueAlbums.forEach(a => stateRef.current.seenIds.add(a.id));

                    if (uniqueAlbums.length === 0) return false;
                    stateRef.current.albumQueue.push(...uniqueAlbums);
                    stateRef.current.currentListPage += 1;
                    return true;
                } catch (e) { return false; }
            };

            // 加载详情
            const loadNextBatch = async () => {
                if (stateRef.current.isFetching || !stateRef.current.hasMore) return;
                stateRef.current.isFetching = true;
                try {
                    if (stateRef.current.albumQueue.length === 0) {
                        const hasNewItems = await fillAlbumQueue();
                        if (!hasNewItems) {
                            stateRef.current.hasMore = false;
                            setStatus('没有更多内容了');
                            stateRef.current.isFetching = false;
                            return;
                        }
                    }
                    const album = stateRef.current.albumQueue.shift();
                    if (!album) { stateRef.current.isFetching = false; return; }

                    const shortTitle = album.title.length > 15 ? album.title.substring(0, 15) + '...' : album.title;
                    setStatus(\`解析: \${shortTitle}\`);

                    const res = await fetch(album.url);
                    const html = await res.text();
                    const doc = parseDOM(html);
                    const imgs = Array.from(doc.querySelectorAll('.post-item-img'));
                    if (imgs.length > 0) {
                        const albumPhotos = imgs.map((img, idx) => ({
                            url: img.getAttribute('data-original') || img.src,
                            id: \`\${album.id}-\${idx}\`,
                            albumTitle: album.title,
                            link: album.url
                        }));
                        setPhotos(prev => [...prev, ...albumPhotos]);
                    }
                } catch (e) {} finally {
                    stateRef.current.isFetching = false;
                }
            };

            useEffect(() => { loadNextBatch(); }, []);

            const observer = useRef();
            const lastElementRef = useCallback(node => {
                if (stateRef.current.isFetching) return;
                if (observer.current) observer.current.disconnect();
                observer.current = new IntersectionObserver(entries => {
                    if (entries[0].isIntersecting && stateRef.current.hasMore) loadNextBatch();
                }, { rootMargin: '200px' });
                if (node) observer.current.observe(node);
            }, [photos]);

            const photoColumns = useMemo(() => {
                const cols = Array.from({ length: numCols }, () => []);
                photos.forEach((photo, index) => cols[index % numCols].push(photo));
                return cols;
            }, [photos, numCols]);

            return (
                <div className="min-h-screen font-sans selection:bg-pink-500 selection:text-white pb-20">
                    <header className="fixed top-0 left-0 right-0 bg-gray-900/95 backdrop-blur-md z-40 border-b border-gray-800 shadow-lg transition-all duration-300">
                        <div className="max-w-[1920px] mx-auto px-4 h-14 flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <div className="w-8 h-8 bg-pink-600 rounded-lg flex items-center justify-center cursor-pointer hover:bg-pink-500 transition-colors" onClick={() => window.location.reload()}>
                                    <IconImage />
                                </div>
                                <h1 className="text-lg font-bold bg-gradient-to-r from-pink-500 to-purple-500 bg-clip-text text-transparent hidden sm:block">妹妹美 Stream</h1>
                            </div>
                            <div className="flex items-center gap-4">
                                <div className="text-xs text-gray-500 hidden md:flex items-center gap-2">
                                    {stateRef.current.isFetching && <IconLoader />}
                                    <span>{status}</span>
                                </div>
                                <div className="flex items-center bg-gray-800 rounded-lg p-1 border border-gray-700 shadow-sm">
                                    <button onClick={() => setManualCols(Math.max(1, numCols - 1))} className="p-1.5 hover:bg-gray-700 rounded text-gray-400 hover:text-white transition-colors"><IconMinus /></button>
                                    <span className="text-xs font-mono font-bold w-8 text-center cursor-pointer text-gray-300 hover:text-pink-400 select-none transition-colors" onClick={() => setManualCols(null)}>{numCols}{manualCols ? '' : 'A'}</span>
                                    <button onClick={() => setManualCols(Math.min(20, numCols + 1))} className="p-1.5 hover:bg-gray-700 rounded text-gray-400 hover:text-white transition-colors"><IconPlus /></button>
                                </div>
                            </div>
                        </div>
                    </header>

                    <main className="pt-20 px-4 w-full mx-auto max-w-[2400px]">
                        <div className="flex gap-4 items-start justify-center">
                            {photoColumns.map((colPhotos, colIndex) => (
                                <div key={colIndex} className="flex flex-col gap-4 flex-1 min-w-0">
                                    {colPhotos.map((photo, index) => {
                                        const isTrigger = colIndex === numCols - 1 && index === colPhotos.length - 1;
                                        return (
                                            <div key={photo.id} ref={isTrigger ? lastElementRef : null} className="relative group rounded-lg overflow-hidden bg-gray-800 shadow-lg hover:shadow-2xl hover:shadow-pink-500/20 transition-all duration-300 ease-out cursor-zoom-in" onClick={() => setSelectedPhoto(photo)}>
                                                <img src={photo.url} loading="lazy" alt={photo.albumTitle} className="w-full h-auto block bg-gray-800" style={{ minHeight: '150px' }} onError={(e) => { e.target.style.display = 'none'; }} />
                                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex flex-col justify-end p-3">
                                                    <p className="text-xs text-gray-200 font-medium line-clamp-2 leading-snug">{photo.albumTitle}</p>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            ))}
                        </div>
                        <div className="h-32 flex flex-col items-center justify-center text-gray-500 gap-3 mt-8">
                             {stateRef.current.isFetching ? (
                                <div className="flex items-center gap-2 px-4 py-2 bg-gray-800 rounded-full shadow-lg border border-gray-700">
                                    <div className="text-pink-500"><IconLoader /></div><span className="text-sm font-medium">正在解析下一套图...</span>
                                </div>
                             ) : !stateRef.current.hasMore && <span className="text-gray-600">-- 已经到底啦 --</span>}
                        </div>
                    </main>

                    {selectedPhoto && (
                        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/98 backdrop-blur-xl p-0 animate-[fadeIn_0.2s_ease-out]" onClick={() => setSelectedPhoto(null)}>
                            <button className="absolute top-4 right-4 p-3 bg-gray-800/50 hover:bg-gray-700 rounded-full text-white transition-colors z-50 pointer-events-auto">
                                <IconX />
                            </button>
                            {/* 使用放大镜组件 */}
                            <MagnifierImage src={selectedPhoto.url} alt={selectedPhoto.albumTitle} />
                            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-4 px-6 py-3 bg-gray-900/80 backdrop-blur-md rounded-full border border-gray-700/50 shadow-2xl pointer-events-auto transition-transform hover:scale-105 z-50">
                                <span className="text-xs text-gray-300 max-w-[200px] truncate hidden sm:block">{selectedPhoto.albumTitle}</span>
                                <div className="h-4 w-px bg-gray-600 hidden sm:block"></div>
                                <a href={selectedPhoto.url} target="_blank" className="text-sm text-blue-400 hover:text-blue-300 flex items-center gap-1"><IconExternalLink /> 原图</a>
                                <a href={selectedPhoto.link} target="_blank" className="text-sm text-pink-400 hover:text-pink-300 flex items-center gap-1"><IconExternalLink /> 来源</a>
                            </div>
                        </div>
                    )}
                </div>
            );
        }

        const root = ReactDOM.createRoot(document.getElementById('root'));
        root.render(React.createElement(App));
    `;

    // =========================================================
    // 启动流程
    // =========================================================
    const loadScript = (url) => {
        return new Promise((resolve, reject) => {
            const script = document.createElement('script');
            script.src = url;
            script.onload = resolve;
            script.onerror = reject;
            document.head.appendChild(script);
        });
    };

    const init = async () => {
        document.documentElement.innerHTML = `<!DOCTYPE html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><meta name="referrer" content="no-referrer"><title>妹妹美 Stream</title><style>body { background-color: #111827; color: white; display: flex; justify-content: center; align-items: center; min-height: 100vh; margin: 0; font-family: sans-serif; overflow-y: scroll; } #root { width: 100%; } .loading-text { font-size: 1.2rem; color: #ec4899; animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite; } @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: .5; } } .error-box { background: #374151; padding: 20px; border-radius: 8px; border: 1px solid #ef4444; color: #fca5a5; max-width: 80%; }</style></head><body><div id="root"><div style="text-align:center; padding-top: 100px;"><div class="loading-text">正在初始化...</div></div></div></body></html>`;

        try {
            await loadScript(LIBS.tailwind);
            await loadScript(LIBS.react);
            await loadScript(LIBS.reactDom);
            await loadScript(LIBS.babel);
            const compiledCode = Babel.transform(reactAppCode, { presets: ['react'] }).code;
            const scriptFn = new Function('React', 'ReactDOM', compiledCode);
            scriptFn(window.React, window.ReactDOM);
        } catch (error) {
            console.error('[MMM_Log] 启动失败:', error);
            document.getElementById('root').innerHTML = `<div style="display:flex;justify-content:center;height:100vh;align-items:center;"><div class="error-box"><h3>启动失败</h3><p>${error.message}</p><button onclick="location.reload()" style="margin-top:15px;background:#ec4899;color:white;border:none;padding:8px 16px;border-radius:4px;cursor:pointer;">刷新</button></div></div>`;
        }
    };

    init();

})();