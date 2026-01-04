// ==UserScript==
// @name        atcoder-piet-image-converter
// @namespace   https://github.com/dnek
// @version     1.0
// @author      dnek
// @description AtCoderで画像ファイルをPlain PPM形式に変換し、Pietのソースコードとして提出できるようにします。また、Plain PPM形式の提出結果を画像に変換して表示します。
// @description:ja  AtCoderで画像ファイルをPlain PPM形式に変換し、Pietのソースコードとして提出できるようにします。また、Plain PPM形式の提出結果を画像に変換して表示します。
// @homepageURL https://github.com/dnek/atcoder-piet-image-converter
// @match       https://atcoder.jp/contests/*/custom_test*
// @match       https://atcoder.jp/contests/*/submit*
// @match       https://atcoder.jp/contests/*/tasks/*
// @match       https://atcoder.jp/contests/*/submissions/*
// @grant       none
// @license     MIT license
// @downloadURL https://update.greasyfork.org/scripts/553186/atcoder-piet-image-converter.user.js
// @updateURL https://update.greasyfork.org/scripts/553186/atcoder-piet-image-converter.meta.js
// ==/UserScript==

(async () => {
	'use strict';

	const getEnJa = (en, ja) => LANG === 'en' ? en : ja;

	// convert image to Plain PPM
	if (document.getElementById('editor') !== null) {
		const minifyCodelSize = (rawPixelData, rawWidth, rawHeight) => {
			const arr32 = new Uint32Array(rawPixelData.buffer);
			const checkIsValidCodelSize = (codelSize) => {
				if (rawWidth % codelSize > 0 || rawHeight % codelSize > 0) {
					return false;
				}
				const codeWidth = rawWidth / codelSize;
				const codeHeight = rawHeight / codelSize;
				for (let i = 0; i < codeHeight; i++) {
					for (let j = 0; j < codeWidth; j++) {
						const topLeft = (i * rawWidth + j) * codelSize;
						const topLeftValue = arr32[topLeft];
						for (let k = 0; k < codelSize; k++) {
							for (let l = 0; l < codelSize; l++) {
								if (arr32[topLeft + k * rawWidth + l] !== topLeftValue) {
									return false;
								}
							}
						}
					}
				}
				return true;
			};
			for (let codelSize = Math.min(rawWidth, rawHeight); codelSize > 1; codelSize--) {
				if (!checkIsValidCodelSize(codelSize)) {
					continue;
				}
				const width = rawWidth / codelSize;
				const height = rawHeight / codelSize;
				const minArr32 = new Uint32Array(width * height);
				for (let i = 0; i < height; i++) {
					for (let j = 0; j < width; j++) {
						minArr32[i * width + j] = arr32[(i * rawWidth + j) * codelSize];
					}
				}
				const pixelData = new Uint8ClampedArray(minArr32.buffer);
				return { pixelData, width, height };
			}
			return {
				pixelData: rawPixelData,
				width: rawWidth,
				height: rawHeight
			};
		};

		const convertImageToPlainPpm = async (file) => {
			if (!file) {
				return;
			}

			const bitmap = await createImageBitmap(file);
			const bitmapWidth = bitmap.width;
			const bitmapHeight = bitmap.height;
			const canvas = new OffscreenCanvas(bitmapWidth, bitmapHeight);
			const ctx = canvas.getContext('2d', { alpha: false });
			ctx.drawImage(bitmap, 0, 0);
			const bitmapPixelData = ctx.getImageData(0, 0, bitmapWidth, bitmapHeight).data;
			const { pixelData, width, height } = minifyCodelSize(bitmapPixelData, bitmapWidth, bitmapHeight);
			const maxval = 85;
			const convertedValues = new Uint8Array(256);
			for (let i = 0; i < 256; i++) {
				convertedValues[i] = Math.round(i * maxval / 255);
			}
			const lines = [];
			for (let i = 0; i < height; i++) {
				const arr = [];
				for (let j = 0; j < width; j++) {
					const offset = (i * width + j) * 4;
					for (let k = 0; k < 3; k++) {
						arr.push(convertedValues[pixelData[offset + k]]);
					}
				}
				lines.push(arr.join(' '));
			}
			const sourceCodeStr = `P3${width} ${height}\n${maxval}\n${lines.join('\n')}`;

			ace.edit('editor').setValue(sourceCodeStr, 1);
			document.getElementById('plain-textarea').value = sourceCodeStr;
		};

		const imageFileInput = document.createElement('input');
		imageFileInput.type = 'file';
		imageFileInput.accept = 'image/*';
		imageFileInput.addEventListener('change', async (e) => {
			convertImageToPlainPpm(e.target.files[0]);
		});

		const convertButton = document.createElement('button');
		convertButton.textContent = getEnJa('Convert (Piet)', '変換 (Piet)');
		convertButton.classList.add('btn', 'btn-default', 'btn-sm');

		convertButton.addEventListener('click', (e) => {
			e.preventDefault();
			imageFileInput.click();
		});

		const stopAndPrevent = (e) => {
			e.stopPropagation();
			e.preventDefault();
		};
		convertButton.addEventListener('dragenter', stopAndPrevent, false);
		convertButton.addEventListener('dragover', (e) => {
			stopAndPrevent(e);
			e.dataTransfer.dropEffect = 'copy';
		}, false);
		convertButton.addEventListener('drop', (e) => {
			stopAndPrevent(e);
			convertImageToPlainPpm(e.dataTransfer.files[0]);
		}, false);

		document.querySelector('.editor-buttons').append(convertButton);
	}

	// convert Plain PPM to image
	if (document.getElementById('submission-code') !== null) {
		const testSomeTextContent = (selectors, pattern) => {
			const texts = Array.from(document.querySelectorAll(selectors), (el) => el.textContent);
			return texts.some((text) => pattern.test(text));
		};
		if (!testSomeTextContent('#submission-code ~ h4', getEnJa(/Judge Result/, /ジャッジ結果/))) {
			return;
		}
		if (!testSomeTextContent('table:has(#judge-status) td:not(:has(> a))', /Piet/)) {
			return;
		}

		const sourceCodeStr = ace.edit('submission-code').getValue();
		if (!sourceCodeStr.startsWith('P3')) {
			return;
		}

		const sourceCodeTokens = sourceCodeStr.slice(2).replace(/#.*?(\n|$)/g, '').match(/\S+/g).map(Number);
		const [width, height, maxval] = sourceCodeTokens;
		const convertedValues = new Uint8Array(256);
		for (let i = 0; i < 256; i++) {
			convertedValues[i] = Math.round(i * 255 / maxval);
		}
		const pixelData = new Uint8ClampedArray(width * height * 4);
		for (let i = 0; i < width * height; i++) {
			for (let j = 0; j < 3; j++) {
				pixelData[i * 4 + j] = convertedValues[sourceCodeTokens[3 + i * 3 + j]];
			}
			pixelData[i * 4 + 3] = 255;
		}
		const bitmap = await createImageBitmap(new ImageData(pixelData, width, height));
		const canvas = new OffscreenCanvas(width, height);
		canvas.getContext('bitmaprenderer', { alpha: false }).transferFromImageBitmap(bitmap);
		const blob = await canvas.convertToBlob();

		const previewImg = document.createElement('img');
		previewImg.style.imageRendering = 'pixelated';
		previewImg.src = URL.createObjectURL(blob);

		const headingP = document.createElement('p');
		const titleSpan = document.createElement('span');
		titleSpan.textContent = getEnJa('Preview (Piet)', 'プレビュー (Piet)');
		titleSpan.classList.add('h4');

		const zoomRatioDiv = document.createElement('div');
		let zoomIndex = 0;
		const changeZoomRatio = (newZoomIndex) => {
			zoomIndex = newZoomIndex;
			const zoomRatio = Math.pow(2, zoomIndex);
			previewImg.style.zoom = zoomRatio;
			zoomRatioDiv.textContent = `${getEnJa('zoom', '拡大率')}: ${zoomRatio * 100}%`;
		};
		changeZoomRatio(3);

		const createIconButton = (icon, label) => {
			const iconButton = document.createElement('button');
			iconButton.classList.add('btn', 'btn-default');
			iconButton.ariaLabel = label;
			const iconSpan = document.createElement('span');
			iconSpan.classList.add('glyphicon', icon);
			iconSpan.ariaHidden = true;
			iconButton.append(iconSpan);
			return iconButton;
		};

		const zoomOutButton = createIconButton('glyphicon-zoom-out', 'zoom out');
		zoomOutButton.addEventListener('click', () => changeZoomRatio(zoomIndex - 1));
		const zoomInButton = createIconButton('glyphicon-zoom-in', 'zoom in');
		zoomInButton.addEventListener('click', () => changeZoomRatio(zoomIndex + 1));

		const downloadButton = createIconButton('glyphicon-download-alt', 'download');
		downloadButton.addEventListener('click', () => {
			const linkEl = document.createElement('a');
			const submissionId = location.pathname.split('/').pop();
			linkEl.download = `atcoder-submission-${submissionId}.png`;
			linkEl.href = previewImg.src;
			linkEl.click();
		});

		const panelDiv = document.createElement('div');
		panelDiv.classList.add('panel', 'panel-default');
		panelDiv.style.backgroundColor = '#F5F5F5';
		panelDiv.style.padding = '8px';
		panelDiv.style.overflow = 'auto';
		panelDiv.append(previewImg);

		const expandButton = document.createElement('a');
		expandButton.classList.add('btn-text');
		let isExpanded = true;
		const toggleExpand = () => {
			isExpanded = !isExpanded;
			expandButton.textContent = isExpanded ? getEnJa('Collapse', '折りたたむ') : getEnJa('Expand', '拡げる');
			panelDiv.style.maxHeight = isExpanded ? 'none' : '240px';
		};
		toggleExpand();
		expandButton.addEventListener('click', toggleExpand);

		headingP.append(
			titleSpan,
			' ', zoomOutButton,
			' ', zoomInButton,
			' ', downloadButton,
			' ', expandButton,
			zoomRatioDiv
		);

		document.getElementById('submission-code').after(headingP, panelDiv);
	}
})();
