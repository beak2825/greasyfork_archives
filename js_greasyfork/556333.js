// ==UserScript==
// @name         3Dモデルオートダウンローダー
// @version      1.86
// @description  3D Models Auto Downloader
// @author       HIBI&Gen&ONE
// @include      /^https?://(www\.)?sketchfab\.com/.*
// @require      https://cdnjs.cloudflare.com/ajax/libs/jszip/3.1.5/jszip.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/jszip-utils/0.0.2/jszip-utils.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/FileSaver.js/1.3.8/FileSaver.js
// @run-at       document-start
// @grant        unsafeWindow
// @grant        GM_download
// @namespace https://greasyfork.org/users/1511494
// @downloadURL https://update.greasyfork.org/scripts/556333/3D%E3%83%A2%E3%83%87%E3%83%AB%E3%82%AA%E3%83%BC%E3%83%88%E3%83%80%E3%82%A6%E3%83%B3%E3%83%AD%E3%83%BC%E3%83%80%E3%83%BC.user.js
// @updateURL https://update.greasyfork.org/scripts/556333/3D%E3%83%A2%E3%83%87%E3%83%AB%E3%82%AA%E3%83%BC%E3%83%88%E3%83%80%E3%82%A6%E3%83%B3%E3%83%AD%E3%83%BC%E3%83%80%E3%83%BC.meta.js
// ==/UserScript==

var zip = new JSZip();
let folder = zip.folder('collection');
var tabCloseFlag = false;
var button_dw = false;
var normalProcess = false;
var func_drawGeometry = /(this\._stateCache\.drawGeometry\(this\._graphicContext,t\))/g;
var fund_drawArrays = /t\.drawArrays\(t\.TRIANGLES,0,6\)/g;
var func_renderInto1 = /A\.renderInto\(n,E,R/g;
var func_renderInto2 = /g\.renderInto=function\(e,i,r/g;
var func_getResourceImage = /getResourceImage:function\(e,t\){/g;
var func_test = /apply:function\(e\){var t=e instanceof r\.Geometry;/g
var addbtnfunc;


(function() {
    'use strict';
    var window = unsafeWindow;
    console.log("[UserScript]init", window);



    //console.log("[UserScript] 再アクセスが完了したので処理を開始します", window);
    const downloadButtonSelector = 'div[id^="view"] > div > div.c-download__links > div:nth-child(2) > div > div.jv075PB9 > div > button';
    const downloadButton = document.querySelector(downloadButtonSelector);
    const closeDelay = 5000;
    console.log('[UserScript] ダウンロードボタンを探します');
    window.addEventListener('load', () =>
    {
        if (downloadButton)
        {
            console.log('[UserScript] ダウンロードボタンが見つかりました');
            downloadButton.click();
            setTimeout(() => {
                console.log("[UserScript] タブ閉じ実行 (window.close)");
                if(window.close) window.close();
                if(top.close) top.close();
            }, closeDelay);
        } else {
            normalProcess = true;
            console.log('[UserScript] 指定されたセレクタが存在しないので通常処理を続けます');
        }
    });

    var tabClosed = function() {
        if(tabCloseFlag) {
            console.log("[UserScript] タブ閉じフラグ確認");
            console.log(`[UserScript] ${closeDelay / 1000}秒カウント開始`);
            setTimeout(() =>
            {
                console.log("[UserScript] タブ閉じ実行 (window.close)");
                if(window.close) window.close();
                if(top.close) top.close();
            }, closeDelay);
        } else {
            setTimeout(tabClosed, closeDelay);
        }
    }
    if (document.readyState === "complete" || document.readyState === "interactive") {
        tabClosed();
    } else {
        window.addEventListener('load', () => {
            tabClosed();
        });
    }




    window.allmodel = [];
    var saveimagecache2 = {};
    var objects = {};
    var expected_texture_count = 0;
    var saved_texture_count = 0;
    var last_save_time = Date.now();

    var saveimage_to_list = function(url, file_name) {
        if (!saveimagecache2[url]) {
            var mdl = {
                name: file_name
            }
            saveimagecache2[url] = mdl;
            expected_texture_count++;
            console.log(`[UserScript] Texture Found: ${expected_texture_count} files pending...`);
            last_save_time = Date.now();
        }
    }

    addbtnfunc = function() {
        var p = document.evaluate("//div[@class='titlebar']", document, null, 9, null).singleNodeValue;
        setTimeout(dodownload, 1000);
    }

    var retry_count = 0;

    var dodownload = function() {
        console.log(`[UserScript] Download Check - Exp:${expected_texture_count}, Saved:${saved_texture_count}, Models:${window.allmodel.length}`);

        var idx = 0;
        window.allmodel.forEach(function(obj) {
            var mdl = {
                name: "model_" + idx,
                obj: parseobj(obj)
            }
            dosavefile(mdl);
            idx++;
        })

        var isComplete = (expected_texture_count > 0 && expected_texture_count === saved_texture_count);
        var timeSinceLastAction = Date.now() - last_save_time;
        var isTimeout = (retry_count > 10 && timeSinceLastAction > 5000);
        var isNoTextureModel = (expected_texture_count === 0 && retry_count > 5 && window.allmodel.length > 0);
        if (isComplete || isTimeout || isNoTextureModel) {
            console.log('[UserScript] 圧縮準備を行っています');
            if(isComplete) console.log("[UserScript] 全テクスチャ保存完了");
            if(isTimeout) console.log("[UserScript] タイムアウトにより強制保存");
            if(isNoTextureModel) console.log("[UserScript] テクスチャなしモデルとして保存");
            PackAll();
        } else {
            console.log(`[UserScript] 待機中... (Retry: ${retry_count})`);
            retry_count++;
            setTimeout(dodownload, 5000);
        }
    }

    const PackAll = function() {
        var count = 0;
        for (var obj in objects) {
            console.log("[UserScript] ファイル圧縮中:", obj);
            folder.file(obj, objects[obj], {
                binary: true
            });
            count++;
        }

        if(count === 0){
            console.error("[UserScript] 保存するファイルがありません");
            tabCloseFlag = true;
            return;
        }
        if(!normalProcess){
            console.log('[UserScript] 通常処理許可がありません');
            tabCloseFlag = true;
            return;
        }else{
            console.log('[UserScript] 通常処理許可を確認しました');
        }

        var file_name_el = document.getElementsByClassName('model-name__label')[0];
        var file_name = file_name_el ? file_name_el.textContent : "3D_model";

        console.log("[UserScript] ZIP作成開始...");

        folder.generateAsync({
            type: "blob"
        }).then(function(content) {
            saveAs(content, file_name + ".zip");
            console.log("[UserScript] ZIP保存を実行しました。");
            tabCloseFlag = true;

        }).catch(function(err) {
            console.error("[UserScript] ZIP生成に失敗しました:", err);
        });
    }

    var parseobj = function(obj) {
        var list = [];
        obj._primitives.forEach(function(p) {
            if (p && p.indices) {
                list.push({
                    'mode': p.mode,
                    'indices': p.indices._elements
                });
            }
        })

        var attr = obj._attributes;
        return {
            vertex: attr.Vertex._elements,
            normal: attr.Normal ? attr.Normal._elements : [],
            uv: attr.TexCoord0 ? attr.TexCoord0._elements :
                attr.TexCoord1 ? attr.TexCoord1._elements :
                attr.TexCoord2 ? attr.TexCoord2._elements :
                attr.TexCoord2 ? attr.TexCoord2._elements :
                attr.TexCoord3 ? attr.TexCoord3._elements :
                attr.TexCoord4 ? attr.TexCoord4._elements :
                attr.TexCoord5 ? attr.TexCoord5._elements :
                attr.TexCoord6 ? attr.TexCoord6._elements :
                attr.TexCoord7 ? attr.TexCoord7._elements :
                attr.TexCoord8 ? attr.TexCoord8._elements : [],
            primitives: list,
        };
    }

    var dosavefile = function(mdl) {
        var obj = mdl.obj;
        var str = '';
        str += 'mtllib ' + mdl.name + '.mtl\n';
        str += 'o ' + mdl.name + '\n';
        for (var i = 0; i < obj.vertex.length; i += 3) {
            str += 'v ';
            for (var j = 0; j < 3; ++j) {
                str += obj.vertex[i + j] + ' ';
            }
            str += '\n';
        }
        for (i = 0; i < obj.normal.length; i += 3) {
            str += 'vn ';
            for (j = 0; j < 3; ++j) {
                str += obj.normal[i + j] + ' ';
            }
            str += '\n';
        }

        for (i = 0; i < obj.uv.length; i += 2) {
            str += 'vt ';
            for (j = 0; j < 2; ++j) {
                str += obj.uv[i + j] + ' ';
            }
            str += '\n';
        }
        str += 's on \n';
        var vn = obj.normal.length != 0;
        var vt = obj.uv.length != 0;

        for (i = 0; i < obj.primitives.length; ++i) {
            var primitive = obj.primitives[i];
            if (primitive.mode == 4 || primitive.mode == 5) {
                var strip = (primitive.mode == 5);
                for (j = 0; j + 2 < primitive.indices.length; !strip ? j += 3 : j++) {
                    str += 'f ';
                    var order = [0, 1, 2];
                    if (strip && (j % 2 == 1)) {
                        order = [0, 2, 1];
                    }
                    for (var k = 0; k < 3; ++k) {
                        var faceNum = primitive.indices[j + order[k]] + 1;
                        str += faceNum;
                        if (vn || vt) {
                            str += '/';
                            if (vt) {
                                str += faceNum;
                            }
                            if (vn) {
                                str += '/' + faceNum;
                            }
                        }
                        str += ' ';
                    }
                    str += '\n';
                }
            }
        }
        str += '\n';
        var objblob = new Blob([str], {
            type: 'text/plain'
        });
        objects[mdl.name + ".obj"] = objblob;
    }

    window.attachbody = function(obj) {
        if (obj._faked != true && ((obj.stateset && obj.stateset._name) || obj._name || (obj._parents && obj._parents[0]._name))) {
            obj._faked = true;
            if (obj._name == "composer layer" || obj._name == "Ground - Geometry") return;
            window.allmodel.push(obj)
            console.log("[UserScript] オブジェクトのアタッチ中:", obj._name);
            last_save_time = Date.now();
        }
    }

    window.hook_test = function(e, idx) {
        console.log("hooked index: " + idx, e);
    }

    window.drawhookcanvas = function(e, imagemodel) {
        if ((e.width == 128 && e.height == 128) || (e.width == 32 && e.height == 32) || (e.width == 64 && e.height == 64)) {
            return e;
        }
        if (imagemodel) {
            var alpha = e.options.format;
            var filename_image = imagemodel.attributes.name;
            var uid = imagemodel.attributes.uid;
            var url_image = e.url;
            var max_size = 0;
            var obr = e;
            imagemodel.attributes.images.forEach(function(img) {
                var alpha_is_check = alpha == "A" ? img.options.format == alpha : true;
                var d = img.width;
                while (d % 2 == 0) {
                    d = d / 2;
                }
                if (img.size > max_size && alpha_is_check && d == 1) {
                    max_size = img.size;
                    url_image = img.url;
                    uid = img.uid;
                    obr = img;
                }
            });
            if (!saveimagecache2[url_image]) {
                saveimage_to_list(url_image, filename_image);
            }
            return obr;
        }
        return e;
    }

    window.drawhookimg = function(gl, t) {
        var url = t[5].currentSrc;
        var width = t[5].width;
        var height = t[5].height;

        if (!saveimagecache2[url]) {
            return;
        }
        var re = /(?:\.([^.]+))?$/;
        var ext = re.exec(saveimagecache2[url].name)[1];
        var name = saveimagecache2[url].name + ".png";
        if (ext == "png" || ext == "jpg" || ext == "jpeg") {
            var ret = saveimagecache2[url].name.replace('.' + ext, '');
            name = ret + ".png";
        }

        if (objects[name]) return;

        console.log("[UserScript] テクスチャ処理中: " + name);

        var data = new Uint8Array(width * height * 4);
        gl.readPixels(0, 0, width, height, gl.RGBA, gl.UNSIGNED_BYTE, data);

        var halfHeight = height / 2 | 0;
        var bytesPerRow = width * 4;
        var temp = new Uint8Array(width * 4);
        for (var y = 0; y < halfHeight; ++y) {
            var topOffset = y * bytesPerRow;
            var bottomOffset = (height - y - 1) * bytesPerRow;
            temp.set(data.subarray(topOffset, topOffset + bytesPerRow));
            data.copyWithin(topOffset, bottomOffset, bottomOffset + bytesPerRow);
            data.set(temp, bottomOffset);
        }

        var canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        var context = canvas.getContext('2d');
        var imageData = context.createImageData(width, height);
        imageData.data.set(data);
        context.putImageData(imageData, 0, 0);

        canvas.toBlob(function(blob) {
            objects[name] = blob;
            saved_texture_count++;
            last_save_time = Date.now();
            console.log(`[UserScript] テクスチャ保存: ${name} (${saved_texture_count}/${expected_texture_count})`);
        }, "image/png");
    }

})();

(() => {
            "use strict";
            const Event = class {
                constructor(script, target) {
                    this.script = script;
                    this.target = target;

                    this._cancel = false;
                    this._replace = null;
                    this._stop = false;
                }

                preventDefault() {
                    this._cancel = true;
                }
                stopPropagation() {
                    this._stop = true;
                }
                replacePayload(payload) {
                    this._replace = payload;
                }
            };

            let callbacks = [];
            window.addBeforeScriptExecuteListener = (f) => {
                if (typeof f !== "function") {
                    throw new Error("Event handler must be a function.");
                }
                callbacks.push(f);
            };
            window.removeBeforeScriptExecuteListener = (f) => {
                let i = callbacks.length;
                while (i--) {
                    if (callbacks[i] === f) {
                        callbacks.splice(i, 1);
                    }
                }
            };

            const dispatch = (script, target) => {
                if (script.tagName !== "SCRIPT") {
                    return;
                }

                const e = new Event(script, target);

                if (typeof window.onbeforescriptexecute === "function") {
                    try {
                        window.onbeforescriptexecute(e);
                    } catch (err) {
                        console.error(err);
                    }
                }

                for (const func of callbacks) {
                    if (e._stop) {
                        break;
                    }
                    try {
                        func(e);
                    } catch (err) {
                        console.error(err);
                    }
                }

                if (e._cancel) {
                    script.textContent = "";
                    script.remove();
                } else if (typeof e._replace === "string") {
                    script.textContent = e._replace;
                }
            };
            const observer = new MutationObserver((mutations) => {
                for (const m of mutations) {
                    for (const n of m.addedNodes) {
                        dispatch(n, m.target);
                    }
                }
            });
            observer.observe(document, {
                childList: true,
                subtree: true,
            });
        })();

(() => {
            "use strict";
            const Event = class {
                constructor(script, target) {
                    this.script = script;
                    this.target = target;

                    this._cancel = false;
                    this._replace = null;
                    this._stop = false;
                }

                preventDefault() {
                    this._cancel = true;
                }
                stopPropagation() {
                    this._stop = true;
                }
                replacePayload(payload) {
                    this._replace = payload;
                }
            };

            let callbacks = [];
            window.addBeforeScriptExecuteListener = (f) => {
                if (typeof f !== "function") {
                    throw new Error("Event handler must be a function.");
                }
                callbacks.push(f);
            };
            window.removeBeforeScriptExecuteListener = (f) => {
                let i = callbacks.length;
                while (i--) {
                    if (callbacks[i] === f) {
                        callbacks.splice(i, 1);
                    }
                }
            };

            const dispatch = (script, target) => {
                if (script.tagName !== "SCRIPT") {
                    return;
                }

                const e = new Event(script, target);

                if (typeof window.onbeforescriptexecute === "function") {
                    try {
                        window.onbeforescriptexecute(e);
                    } catch (err) {
                        console.error(err);
                    }
                }

                for (const func of callbacks) {
                    if (e._stop) {
                        break;
                    }
                    try {
                        func(e);
                    } catch (err) {
                        console.error(err);
                    }
                }

                if (e._cancel) {
                    script.textContent = "";
                    script.remove();
                } else if (typeof e._replace === "string") {
                    script.textContent = e._replace;
                }
            };
            const observer = new MutationObserver((mutations) => {
                for (const m of mutations) {
                    for (const n of m.addedNodes) {
                        dispatch(n, m.target);
                    }
                }
            });
            observer.observe(document, {
                childList: true,
                subtree: true,
            });
        })();

(() => {
            "use strict";
   　　　　 if (typeof window === 'undefined' || !window.location)
            {
                return;
             }

             try
             {
                 console.log("[UserScript] URLハッシュ判定を行います");
                 if (window.location.hash !== '#download')
                 {
                     console.log("[UserScript] ハッシュをつけ直します");
                     var newUrl = window.location.href.split('#')[0] + '#download';
                     window.location.replace(newUrl);

                     console.log("[UserScript] リロードします");
                     window.location.reload();
                  }
               } catch (e)
               {
                   console.log("[UserScript] URLエラーです");
               }
               window.onbeforescriptexecute = (e) =>
               {
                var links_as_arr = Array.from(e.target.childNodes);

                links_as_arr.forEach(function(srimgc)
                    {
                        if(srimgc instanceof HTMLScriptElement)
                        {
                            if (srimgc.src.indexOf("web/dist/") >= 0 || srimgc.src.indexOf("standaloneViewer") >= 0)
                            {
                                //setTimeout(() =>
                                //{
                                e.preventDefault();
                                e.stopPropagation();
                                var req = new XMLHttpRequest();
                                req.open('GET', srimgc.src, false);
                                req.send('');
                                var jstext = req.responseText;
                                var ret = func_renderInto1.exec(jstext);
                                if (ret)
                                {
                                    var index = ret.index + ret[0].length;
                                    var head = jstext.slice(0, index);
                                    var tail = jstext.slice(index);
                                    jstext = head + ",i" + tail;
                                    console.log("[UserScript] インジェクション: patch_0 成功" + srimgc.src);
                                }

                                ret = func_renderInto2.exec(jstext);

                                if (ret)
                                {
                                    var index = ret.index + ret[0].length;
                                    var head = jstext.slice(0, index);
                                    var tail = jstext.slice(index);
                                    jstext = head + ",image_data" + tail;
                                    console.log("[UserScript] インジェクション: patch_1 成功" + srimgc.src);
                                    if (!func_renderInto1.exec(jstext))
                                        console.log("[UserScript] patch_0は失敗した可能性があります" + srimgc.src);
                                }

                                ret = fund_drawArrays.exec(jstext);

                                if (ret)
                                {
                                    var index = ret.index + ret[0].length;
                                    var head = jstext.slice(0, index);
                                    var tail = jstext.slice(index);
                                    jstext = head + ",window.drawhookimg(t,image_data)" + tail;
                                    console.log("[UserScript] インジェクション: patch_2 成功" + srimgc.src);
                                }

                                ret = func_getResourceImage.exec(jstext);

                                if (ret)
                                {
                                    var index = ret.index + ret[0].length;
                                    var head = jstext.slice(0, index);
                                    var tail = jstext.slice(index);
                                    jstext = head + "e = window.drawhookcanvas(e,this._imageModel);" + tail;
                                    console.log("[UserScript] インジェクション: patch_3 成功" + srimgc.src);
                                }

                                ret = func_drawGeometry.exec(jstext);

                                if (ret)
                                {
                                    var index1 = ret.index + ret[1].length;
                                    var head1 = jstext.slice(0, index1);
                                    var tail1 = jstext.slice(index1);
                                    jstext = head1 + ";window.attachbody(t);" + tail1;
                                    console.log("[UserScript] インジェクション: patch_4 成功" + srimgc.src);
                                    setTimeout(addbtnfunc, 3000);
                                }
                                //},5000);
                                var idx = 0;
                                var obj = document.createElement('script');
                                obj.type = "text/javascript";
                                obj.text = jstext;
                                document.getElementsByTagName('head')[0].appendChild(obj);
                            }
                        }

                }
                );
            };
        })();