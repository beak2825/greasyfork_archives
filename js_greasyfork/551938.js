// ==UserScript==
// @name        atcoder-lf-submit
// @namespace   https://github.com/dnek
// @version     1.0
// @author      dnek
// @description Add button to submit source code with LF newlines instead of CRLF on AtCoder. Also display the byte length below the source code.
// @description:ja  AtCoderでCRLFではなくLFで改行したソースコードを提出するボタンを追加します。また、ソースコードの下にコード長を表示します。
// @homepageURL https://github.com/dnek/atcoder-lf-submit
// @match       https://atcoder.jp/contests/*/custom_test*
// @match       https://atcoder.jp/contests/*/submit*
// @match       https://atcoder.jp/contests/*/tasks/*
// @grant       none
// @license     MIT license
// @downloadURL https://update.greasyfork.org/scripts/551938/atcoder-lf-submit.user.js
// @updateURL https://update.greasyfork.org/scripts/551938/atcoder-lf-submit.meta.js
// ==/UserScript==

(function () {
	'use strict';

	const aceEditor = ace.edit('editor');
	const editorEl = document.getElementById('editor');
	const plainTextareaEl = document.getElementById('plain-textarea');
	const getSourceCode = () => {
		if (editorEl.style.display !== 'none') {
			return aceEditor.getValue();
		}
		return plainTextareaEl.value;
	};

	// add LF submit button
	const addLfSubmitButton = () => {
		const normalSubmitButton = document.getElementById('submit');

		if (normalSubmitButton === null) {
			return null;
		}

		const lfSubmitButton = document.createElement('button');
		lfSubmitButton.textContent = `${normalSubmitButton.textContent} (LF)`;
		lfSubmitButton.classList.add('btn', 'btn-success');

		lfSubmitButton.addEventListener('click', async (e) => {
			e.preventDefault();

			const form = document.querySelector('form:has(#submit)');

			const formData = new FormData(form);
			formData.set('sourceCode', getSourceCode());

			const res = await fetch(form.action, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/x-www-form-urlencoded'
				},
				body: new URLSearchParams(formData),
			});

			if (res.ok) {
				location.href = res.url;
			} else {
				alert(`failed to submit: ${res.status}`);
			}
		});

		normalSubmitButton.after(' ', lfSubmitButton);

		return lfSubmitButton;
	};

	const lfSubmitButtonOrNull = addLfSubmitButton();

	// show byte length
	const byteLengthView = document.createElement('div');
	plainTextareaEl.after(byteLengthView);

	const updateByteLength = () => {
		const byteLength = new Blob([getSourceCode()]).size;
		const isLimitExceeded = byteLength > 524288;
		byteLengthView.textContent = `${byteLength} Byte`;
		if (isLimitExceeded) {
			byteLengthView.textContent += ` (512 KiB + ${byteLength - 524288} B)`;
		}
		byteLengthView.classList.toggle('red', isLimitExceeded);

		if (lfSubmitButtonOrNull !== null) {
			lfSubmitButtonOrNull.disabled = isLimitExceeded;
		}
	};

	updateByteLength();

	aceEditor.on('input', updateByteLength);
	plainTextareaEl.addEventListener('input', updateByteLength);
})();
