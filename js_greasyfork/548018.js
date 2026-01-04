// ==UserScript==
// @name         SOOP TV 이미지 난독화
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  chapi 업로드 시 난독화, ch 페이지에서 복호화
// @author       SMI
// @match        https://ch.sooplive.co.kr/*/post/*
// @grant        GM_xmlhttpRequest
// @connect      stimg.sooplive.co.kr
// @icon         https://www.google.com/s2/favicons?sz=64&domain=www.sooplive.co.kr
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/548018/SOOP%20TV%20%EC%9D%B4%EB%AF%B8%EC%A7%80%20%EB%82%9C%EB%8F%85%ED%99%94.user.js
// @updateURL https://update.greasyfork.org/scripts/548018/SOOP%20TV%20%EC%9D%B4%EB%AF%B8%EC%A7%80%20%EB%82%9C%EB%8F%85%ED%99%94.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 문자열을 32비트 해시값으로 변환 (FNV-1a)
    function stringToSeed(str) {
        let hash = 2166136261;
        for (let i = 0; i < str.length; i++) {
            hash ^= str.charCodeAt(i);
            hash = (hash * 16777619) >>> 0; // 32비트 unsigned 유지
        }
        return hash; // 0 ~ 4294967295
    }

    const now = new Date();
    const defaultSeedString = now.getFullYear().toString() +
                            (now.getMonth() + 1).toString().padStart(2, '0') +
                            now.getDate().toString().padStart(2, '0');

    // 로컬스토리지에서 시드 문자열과 활성화 상태 로드
    let seedString = localStorage.getItem('soop_seed_string') || defaultSeedString;
    let isEnabled = localStorage.getItem('soop_enabled') === 'true';
    let seed = stringToSeed(seedString);

    // 픽셀 섞기/되돌리기 함수
    function shufflePixels(seed, array) {
        let rng = seed;
        for (let i = array.length - 1; i > 0; i--) {
            rng = (rng * 1664525 + 1013904223) % 4294967296;
            const j = Math.floor((rng / 4294967296) * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
    }

    function unshufflePixels(seed, array) {
        const swaps = [];
        let rng = seed;
        for (let i = array.length - 1; i > 0; i--) {
            rng = (rng * 1664525 + 1013904223) % 4294967296;
            swaps.push([i, Math.floor((rng / 4294967296) * (i + 1))]);
        }
        for (let k = swaps.length - 1; k >= 0; k--) {
            const [i, j] = swaps[k];
            [array[i], array[j]] = [array[j], array[i]];
        }
    }

    // 정적 이미지 난독화
    function obfuscateImage(file) {
        return new Promise((resolve, reject) => {
            const img = new Image();
            img.onload = () => {
                try {
                    const canvas = document.createElement('canvas');
                    const ctx = canvas.getContext('2d');
                    canvas.width = img.naturalWidth;
                    canvas.height = img.naturalHeight;
                    ctx.drawImage(img, 0, 0);

                    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
                    const pixels = [];
                    for (let i = 0; i < imageData.data.length; i += 4) {
                        pixels.push([imageData.data[i], imageData.data[i+1], imageData.data[i+2], imageData.data[i+3]]);
                    }

                    shufflePixels(seed, pixels);

                    for (let i = 0; i < pixels.length; i++) {
                        imageData.data[i*4] = pixels[i][0];
                        imageData.data[i*4+1] = pixels[i][1];
                        imageData.data[i*4+2] = pixels[i][2];
                        imageData.data[i*4+3] = pixels[i][3];
                    }

                    ctx.putImageData(imageData, 0, 0);
                    canvas.toBlob(blob => {
                        resolve(new File([blob], file.name.replace(/\.\w+$/, ".png"), {type: "image/png"}));
                    }, "image/png");
                } catch (error) {
                    reject(error);
                }
            };
            img.onerror = () => reject(new Error('이미지 로드 실패'));
            img.src = URL.createObjectURL(file);
        });
    }

    // GIF 바이너리 레벨 픽셀 섞기 (무손실)
    function obfuscateGifBinary(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => {
                try {
                    const arrayBuffer = reader.result;
                    const data = new Uint8Array(arrayBuffer);

                    // GIF 시그니처 확인
                    const signature = String.fromCharCode(...data.slice(0, 6));
                    if (!signature.startsWith('GIF')) {
                        throw new Error('유효하지 않은 GIF 파일');
                    }

                    // GIF 헤더 정보 읽기
                    const width = data[6] | (data[7] << 8);
                    const height = data[8] | (data[9] << 8);
                    const packed = data[10];
                    const globalColorTableFlag = (packed & 0x80) !== 0;
                    const globalColorTableSize = globalColorTableFlag ? (2 << (packed & 0x07)) * 3 : 0;

                    // 메타데이터 부분은 그대로 유지하고, 이미지 데이터만 섞기
                    const newData = new Uint8Array(data.length);
                    newData.set(data); // 전체 복사

                    // 간단한 바이트 레벨 섞기 (GIF 구조를 완전히 파싱하지 않고)
                    // 헤더 이후의 데이터에서 특정 패턴의 바이트들만 섞기
                    const headerSize = 13 + globalColorTableSize;
                    if (newData.length > headerSize + 100) {
                        // 이미지 데이터 영역에서만 섞기 (헤더는 보존)
                        const dataStart = headerSize;
                        const dataEnd = newData.length - 10; // 끝부분도 보존

                        // 이미지 데이터 부분의 바이트들을 섞기
                        let rng = seed;
                        for (let i = dataEnd - 1; i > dataStart; i--) {
                            rng = (rng * 1664525 + 1013904223) % 4294967296;
                            const j = dataStart + Math.floor((rng / 4294967296) * (i - dataStart + 1));
                            [newData[i], newData[j]] = [newData[j], newData[i]];
                        }
                    }

                    const blob = new Blob([newData], { type: 'image/gif' });
                    resolve(new File([blob], file.name, { type: 'image/gif' }));
                } catch (error) {
                    console.warn('GIF 바이너리 처리 실패, 일반 이미지로 처리:', error);
                    // 실패 시 일반 이미지 처리로 fallback
                    obfuscateImage(file).then(resolve).catch(reject);
                }
            };
            reader.onerror = () => reject(new Error('파일 읽기 실패'));
            reader.readAsArrayBuffer(file);
        });
    }

    // 통합 파일 처리 함수
    async function obfuscateFile(file) {
        if (file.type === 'image/gif') {
            console.log(`GIF 난독화: ${file.name}`);
            return await obfuscateGifBinary(file);
        } else if (file.type.startsWith('image/')) {
            console.log(`이미지 난독화: ${file.name}`);
            return await obfuscateImage(file);
        }
        return file;
    }

    // FormData 처리
    async function processFormData(formData) {
        // 비활성화 상태면 원본 그대로 반환
        if (!isEnabled) return formData;

        const newFormData = new FormData();
        for (const [key, value] of formData.entries()) {
            if (value instanceof File && (value.type.startsWith('image/') || value.type === 'image/gif')) {
                const obfuscated = await obfuscateFile(value);
                newFormData.append(key, obfuscated);
            } else {
                newFormData.append(key, value);
            }
        }
        return newFormData;
    }

    // Fetch API 가로채기
    const originalFetch = window.fetch;
    window.fetch = async function(url, options = {}) {
        if (typeof url === 'string' &&
            url.includes('chapi.sooplive.co.kr') &&
            url.includes('/image') &&
            options.body instanceof FormData) {

            console.log('Fetch 업로드 감지 - 난독화 중...');
            try {
                const processedFormData = await processFormData(options.body);
                console.log(`Fetch 난독화 완료 (시드: ${seed})`);
                return originalFetch.call(this, url, {...options, body: processedFormData});
            } catch (error) {
                console.error('Fetch 난독화 실패:', error);
                return originalFetch.call(this, url, options);
            }
        }
        return originalFetch.call(this, url, options);
    };

    // XMLHttpRequest 가로채기
    const originalXHRSend = XMLHttpRequest.prototype.send;
    const originalXHROpen = XMLHttpRequest.prototype.open;

    XMLHttpRequest.prototype.open = function(method, url, ...args) {
        this._url = url;
        return originalXHROpen.call(this, method, url, ...args);
    };

    XMLHttpRequest.prototype.send = async function(body) {
        if (this._url &&
            this._url.includes('chapi.sooplive.co.kr') &&
            this._url.includes('/image') &&
            body instanceof FormData) {

            console.log('XHR 업로드 감지 - 난독화 중...');
            try {
                const processedFormData = await processFormData(body);
                console.log(`XHR 난독화 완료 (시드: ${seed})`);
                return originalXHRSend.call(this, processedFormData);
            } catch (error) {
                console.error('XHR 난독화 실패:', error);
                return originalXHRSend.call(this, body);
            }
        }
        return originalXHRSend.call(this, body);
    };

    // GIF 바이너리 레벨 복호화 (무손실)
    function deobfuscateGifBinary(img) {
        return new Promise((resolve) => {
            GM_xmlhttpRequest({
                method: 'GET',
                url: img.src.startsWith('//') ? 'https:' + img.src : img.src,
                responseType: 'arraybuffer',
                onload: (response) => {
                    try {
                        const arrayBuffer = response.response;
                        const data = new Uint8Array(arrayBuffer);

                        // GIF 시그니처 확인
                        const signature = String.fromCharCode(...data.slice(0, 6));
                        if (!signature.startsWith('GIF')) {
                            deobfuscateStaticImage(img);
                            return resolve();
                        }

                        // GIF 헤더 정보 읽기
                        const packed = data[10];
                        const globalColorTableFlag = (packed & 0x80) !== 0;
                        const globalColorTableSize = globalColorTableFlag ? (2 << (packed & 0x07)) * 3 : 0;

                        // 복호화 (난독화의 역과정)
                        const newData = new Uint8Array(data.length);
                        newData.set(data); // 전체 복사

                        const headerSize = 13 + globalColorTableSize;
                        if (newData.length > headerSize + 100) {
                            const dataStart = headerSize;
                            const dataEnd = newData.length - 10;

                            // 섞기의 역과정으로 복호화
                            const swaps = [];
                            let rng = seed;
                            for (let i = dataEnd - 1; i > dataStart; i--) {
                                rng = (rng * 1664525 + 1013904223) % 4294967296;
                                swaps.push([i, dataStart + Math.floor((rng / 4294967296) * (i - dataStart + 1))]);
                            }

                            // 역순으로 스왑 해제
                            for (let k = swaps.length - 1; k >= 0; k--) {
                                const [i, j] = swaps[k];
                                [newData[i], newData[j]] = [newData[j], newData[i]];
                            }
                        }

                        // 복호화된 GIF를 blob URL로 생성
                        const blob = new Blob([newData], { type: 'image/gif' });
                        img.src = URL.createObjectURL(blob);
                        console.log('GIF 복호화 완료');
                        resolve();
                    } catch (error) {
                        console.error('GIF 바이너리 복호화 실패:', error);
                        deobfuscateStaticImage(img);
                        resolve();
                    }
                },
                onerror: (error) => {
                    console.error('GIF 다운로드 실패:', error);
                    resolve();
                }
            });
        });
    }

    // 정적 이미지 복호화
    function deobfuscateStaticImage(img) {
        GM_xmlhttpRequest({
            method: 'GET',
            url: img.src.startsWith('//') ? 'https:' + img.src : img.src,
            responseType: 'arraybuffer',
            onload: (response) => {
                const bytes = new Uint8Array(response.response);
                let binary = '';
                bytes.forEach(byte => binary += String.fromCharCode(byte));
                const dataUrl = `data:image/png;base64,${btoa(binary)}`;

                const tempImg = new Image();
                tempImg.onload = () => {
                    const canvas = document.createElement('canvas');
                    const ctx = canvas.getContext('2d');
                    canvas.width = tempImg.naturalWidth;
                    canvas.height = tempImg.naturalHeight;
                    ctx.drawImage(tempImg, 0, 0);

                    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
                    const pixels = [];
                    for (let i = 0; i < imageData.data.length; i += 4) {
                        pixels.push([imageData.data[i], imageData.data[i+1], imageData.data[i+2], imageData.data[i+3]]);
                    }

                    unshufflePixels(seed, pixels);

                    for (let i = 0; i < pixels.length; i++) {
                        imageData.data[i*4] = pixels[i][0];
                        imageData.data[i*4+1] = pixels[i][1];
                        imageData.data[i*4+2] = pixels[i][2];
                        imageData.data[i*4+3] = pixels[i][3];
                    }

                    ctx.putImageData(imageData, 0, 0);
                    img.src = canvas.toDataURL('image/png');
                    console.log('정적 이미지 복호화 완료');
                };
                tempImg.src = dataUrl;
            },
            onerror: (error) => console.error('이미지 복호화 실패:', error)
        });
    }

    // 통합 복호화 함수
    async function deobfuscateImage(img) {
        // 비활성화 상태면 복호화하지 않음
        if (!isEnabled || img.dataset.done) return;
        img.dataset.done = 'true';

        // URL에서 파일 확장자 확인
        const url = img.src.startsWith('//') ? 'https:' + img.src : img.src;
        const isGif = url.toLowerCase().includes('.gif') || img.src.toLowerCase().includes('gif');

        if (isGif) {
            console.log('GIF 복호화 시작');
            await deobfuscateGifBinary(img);
        } else {
            console.log('정적 이미지 복호화 시작');
            deobfuscateStaticImage(img);
        }
    }

    // 이미지 스캔
    function processImages() {
        document.querySelectorAll('.post_detail img[src*="stimg.sooplive.co.kr"]:not([data-done])').forEach(deobfuscateImage);
    }

    // UI 추가 함수
    function addUI() {
        // 게시글 하단의 .btn-grid > .grid-end를 찾기
        const gridEnd = document.querySelector('.btn-grid > .grid-end');
        if (gridEnd && !document.getElementById('soop-seed-control')) {
            // 기존 버튼 스타일을 모방한 UI 생성
            const seedButton = document.createElement('button');
            seedButton.type = 'button';
            seedButton.className = 'btn-basic';
            seedButton.id = 'soop-seed-control';
            seedButton.title = '비밀번호 변경';
            seedButton.innerHTML = `<span>${isEnabled ? '🔒': '🔓'} ${seedString}</span>`;

            if(isEnabled){
                seedButton.style.borderColor = "#7398ff";
            }

            // 클릭 이벤트
            seedButton.addEventListener('click', () => {
                if (isEnabled) {
                    // 활성화 상태 → 비활성화
                    isEnabled = false;
                    localStorage.setItem('soop_enabled', 'false');
                    console.log('SOOP 난독화 비활성화');
                } else {
                    // 비활성화 상태 → 시드 입력 프롬프트 → 활성화
                    const newSeedString = prompt('게시글 비밀번호를 입력하세요:', seedString);
                    if (newSeedString !== null && newSeedString.trim() !== '') {
                        const trimmedString = newSeedString.trim();
                        seedString = trimmedString;
                        seed = stringToSeed(trimmedString);
                        isEnabled = true;

                        // 로컬스토리지에 저장
                        localStorage.setItem('soop_seed_string', seedString);
                        localStorage.setItem('soop_enabled', 'true');

                        console.log('시드 업데이트 및 활성화:', seedString, '→', seed);
                    }
                }
                // 페이지 새로고침
                location.reload();
            });

            // .grid-end의 맨 앞에 추가
            gridEnd.insertBefore(seedButton, gridEnd.firstChild);
        }
    }

    // DOM이 로드된 후 UI 추가
    function init() {
        addUI();
        processImages();
    }

    // 초기화
    setTimeout(init, 1000);
    new MutationObserver(() => {
        addUI();
        processImages();
    }).observe(document.body, {childList: true, subtree: true});

    console.log('SOOP 난독화 스크립트 활성화(시드:', seed, ')');

})();