// ==UserScript==
// @name           Habr Comments Filter
// @name:ru        Хабр Фильтр комментов
// @namespace      habr_comments_filter
// @version        2.0.1
// @description    Hides comments with low rating.
// @description:ru Спрятать комменты с оценкой ниже выбранной.
// @author         Dystopian
// @license        WTFPL
// @match          https://habr.com/*
// @icon           https://habr.com/favicon.ico
// @grant          GM_log
// @run-at         document-end
// @downloadURL https://update.greasyfork.org/scripts/554112/Habr%20Comments%20Filter.user.js
// @updateURL https://update.greasyfork.org/scripts/554112/Habr%20Comments%20Filter.meta.js
// ==/UserScript==

(function() {
	'use strict';

	const COMMENT_HIGHLIGHT_LIGHT = '#fff7d7';
	const COMMENT_HIGHLIGHT_DARK = '#484028';

	let DEBUG = 0;
	let currentThreshold = null;
	let observer;
	let isCreatingButton = false;

	// custom log - useful for mobile version debug
	let isCustomLog = false;
	let isCustomLogCollapsed = true;
	const customLogBoxID = 'custom-log-box';
	const customLogBuffer = [];
	function getTimestamp() {
		const d = new Date();
		const pad = (n, z = 2) => ('00' + n).slice(-z);
		return `${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}.${pad(d.getMilliseconds(), 3)}`;
	}
	function formatElement(el) {
		if (!(el instanceof Element)) return String(el);
		let s = `<${el.tagName.toLowerCase()}`;
		if (el.id) s += `#${el.id}`;
		if (el.className) s += '.' + el.className.trim().replace(/\s+/g, '.');
		return s + '>';
	}
	function smartFormat(x) {
		if (x instanceof Event) return `[Event ${x.type} ${x.constructor.name}] target=${formatElement(x.target)}`;
		if (x instanceof Element) return formatElement(x);
		try {return JSON.stringify(x);}
		catch {return String(x);}
	}
	function customLog(...args) {
		const maxLines = 100;
		const msg = args.map(smartFormat).join(' ');
		customLogBuffer.push(`${getTimestamp()} ${msg}`);
		if (customLogBuffer.length > maxLines) customLogBuffer.shift();
		renderCustomLog();
	}
	function renderCustomLog() {
		let pre = document.getElementById(customLogBoxID);
		if (!pre) {
			const box = document.createElement('div');
			Object.assign(box.style, {
				position: 'fixed',
				bottom: '0',
				left: '0',
				width: '100%',
				maxHeight: '10em',
				overflowY: 'auto',
				color: 'lime',
				fontSize: '10px',
				fontFamily: 'monospace',
				zIndex: '999999',
				padding: '4px',
			});
			const btn = document.createElement('button');
			Object.assign(btn.style, {
				position: 'fixed',
				right: '4px',
				background: 'rgba(0,0,0,0.8)',
				border: '1px solid lime',
				color: 'inherit',
			});
			btn.onclick = () => {
				isCustomLogCollapsed = !isCustomLogCollapsed;
				if (isCustomLogCollapsed) {
					pre.style.display = 'none';
					box.style.height = '1.5em';
					box.style.background = '';
					btn.textContent = '+';
				} else {
					pre.style.display = '';
					box.style.height = '';
					box.style.background = 'rgba(0,0,0,0.8)';
					btn.textContent = '−';
					pre.textContent = customLogBuffer.join('\n');
					box.scrollTop = box.scrollHeight;
				}
			};
			box.appendChild(btn);
			pre = document.createElement('pre');
			pre.id = customLogBoxID;
			Object.assign(pre.style, {
				margin: '0',
				whiteSpace: 'pre-wrap',
				fontFamily: 'inherit',
				fontSize: 'inherit',
				color: 'inherit',
			});
			box.appendChild(pre);
			document.body.appendChild(box);
			isCustomLogCollapsed = !isCustomLogCollapsed;
			btn.click(); // init state
		}
		if (!isCustomLogCollapsed) {
			pre.textContent = customLogBuffer.join('\n');
			pre.parentElement.scrollTop = pre.parentElement.scrollHeight;
		}
	}
	function log(level, ...args) {
		if (DEBUG < level) return;
		if (isCustomLog) customLog(...args);
		console.log('[comments-filter]', ...args);
	}

	const cssVarName = '--good-comment-background';
	const cssColor = `var(${cssVarName})`;
	function isDarkTheme() {
		const darkLink = document.querySelector('#dark-colors');
		const lightLink = document.querySelector('#light-colors');
		if (darkLink?.media === 'all' && !darkLink.disabled) return true;
		if (lightLink?.media === 'all' && !lightLink.disabled) return false;
		return window.matchMedia('(prefers-color-scheme: dark)').matches;
	}
	function applyHighlightColor() {
		const newValue = isDarkTheme() ? COMMENT_HIGHLIGHT_DARK : COMMENT_HIGHLIGHT_LIGHT;
		const rootStyle = document.documentElement.style;
		const current = rootStyle.getPropertyValue(cssVarName).trim();
		if (current !== newValue) {
			log(1, "applyHighlightColor", current, newValue);
			rootStyle.setProperty(cssVarName, newValue);
		}
	}
	function initHighlightColors() {
		applyHighlightColor();
		const observer = new MutationObserver(applyHighlightColor);
		observer.observe(document.head, { attributes: true, subtree: true });
		const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
		mediaQuery.addEventListener('change', applyHighlightColor);
	}

	function findCommentsWrapper() {
		return document.querySelector('div.tm-comments-wrapper__wrapper');
	}
	function findCommentsTree(wrapper) {
		return wrapper.querySelector('div.tm-comments__tree');
	}
	function findCommentsHeader(wrapper) {
		return wrapper.querySelector('header.tm-comments-wrapper__header');
	}
	function getAllSections(tree) {
		return tree.querySelectorAll('section.tm-comment-thread');
	}
	 function getChildSections(section) {
		return section.querySelectorAll(':scope > div.tm-comment-thread__children > section.tm-comment-thread');
	}
   function getSectionChildrenBlock(section) {
		return section.querySelector(':scope > div.tm-comment-thread__children');
	}
	function getSectionHeader(section) {
		return section.querySelector(':scope > article > div > div.tm-comment > header.tm-comment__header');
	}
	function getSectionBody(section) {
		return section.querySelector(':scope > article > div, :scope > article > span.tm-comment-thread__ufo');
	}

	function extractCommentScore(section) {
		const span = section.querySelector(':scope > article span:is(.tm-votes-meter__value, .tm-votes-lever__score-counter)');
		if (!span) return 0;
		log(3, "extractCommentScore", span.textContent);
		return parseInt(span.textContent.trim(), 10) || 0;
	}

	function setFlag(el, key, value) {
		el.dataset[key] = value ? "1" : "";
	}
	function getFlag(el, key) {
		return el.dataset[key] === "1";
	}

	function resetCommentsFilter(tree) {
		log(1, 'resetCommentsFilter');
		tree.querySelectorAll('a.comment-placeholder').forEach(p => p.remove());
		getAllSections(tree).forEach(section => {
			section.style.display = '';
			getSectionBody(section)?.style?.setProperty('display', '');
			getSectionChildrenBlock(section)?.style?.setProperty('display', '');
			getSectionHeader(section)?.style?.setProperty('background-image', '');
			section.dataset.isGood = '';
			section.dataset.hasGood = '';
			section.dataset.hasGoodChild = '';
		});
	}

	function markComments(section, parentComment = null) {
		const score = extractCommentScore(section);
		section.dataset.score = score; // for debug
		const isGood = score >= currentThreshold;
		setFlag(section, "isGood", isGood);
		if (parentComment && isGood) setFlag(parentComment, "hasGoodChild", true);

		let hasGood = isGood;
		getChildSections(section).forEach(childSection => {
			if (markComments(childSection, section)) {
				hasGood = true;
			}
		});
		setFlag(section, "hasGood", hasGood);
		log(2, 'mark', {score, isGood, hasGood});
		return hasGood;
	}

	function collapseCommentWithPlaceholder(section, withChildren = true) {
		log(2, 'collapseCommentWithPlaceholder', section, withChildren);
		const article = section.querySelector(':scope > article');
		if (!article) return;

		const articleUfoSelector = ':scope > span.tm-comment-thread__ufo';
		const sectionChildrenBlock = getSectionChildrenBlock(section);

		// do not hide UFO without children
		if (!sectionChildrenBlock && article.querySelector(articleUfoSelector)) return;

		if (withChildren && sectionChildrenBlock) {
			sectionChildrenBlock.style.setProperty('display', 'none');
		}

		const placeholder = document.createElement('a');
		placeholder.textContent = 'раскрыть';
		placeholder.href = '#';
		placeholder.className = 'comment-placeholder';
		placeholder.style.textDecoration = 'none';
		const articleContent = article.querySelector(':scope > div, ' + articleUfoSelector);
		if (articleContent) {
			placeholder.className += ' ' + articleContent.className; // copy margin
			articleContent.style.display = 'none';
		}
		article.appendChild(placeholder);
	}

	function processCommentThread(section, isRoot = false) {
		log(2, 'processCommentThread', section, isRoot, {score: section.dataset.score, isGood: section.dataset.isGood, hasGood: section.dataset.hasGood, hasGoodChild: section.dataset.hasGoodChild});

		if (getFlag(section, "isGood") || getFlag(section, "hasGoodChild")) {
			log(2, 'isGood or hasGoodChild', section);
			if (getFlag(section, "isGood")) {
				const header = getSectionHeader(section);
				log(2, 'check header=', header);
				if (header) {
					// if header is already colored, blend it; else fill
					const headerCurrentBackgroundColor = getComputedStyle(header).backgroundColor;
					log(2, 'header color', headerCurrentBackgroundColor);
					const emptyColorComputedString = 'rgba(0, 0, 0, 0)'; // getComputedStyle returns exactly this
					// cssColor here handles cleared background right after resetCommentsFilter
					const firstGradientColor = [emptyColorComputedString, cssColor].includes(headerCurrentBackgroundColor) ? cssColor : emptyColorComputedString;
					header.style.backgroundImage = `linear-gradient(to right, ${firstGradientColor}, ${cssColor})`;
				}
			}
			getChildSections(section).forEach(childSection => {
				log(3, 'childSection', childSection, {score: childSection.dataset.score, isGood: childSection.dataset.isGood, hasGood: childSection.dataset.hasGood, hasGoodChild: childSection.dataset.hasGoodChild});
				if (getFlag(childSection, "hasGood")) {
					processCommentThread(childSection);
				} else {
					collapseCommentWithPlaceholder(childSection);
				}
			});
		} else if (getFlag(section, "hasGood")) {
			log(2, 'hasGood', section);
			collapseCommentWithPlaceholder(section, false);
			getChildSections(section).forEach(childSection => {
				if (getFlag(childSection, "hasGood")) {
					processCommentThread(childSection);
				} else {
					childSection.style.display = 'none';
				}
			});
		} else {
			if (isRoot) {
				log(2, 'bad root', section);
				section.style.display = 'none';
			} else {
				log(2, 'bad non-root', section);
				collapseCommentWithPlaceholder(section);
			}
		}
	}

	function applyCommentsFilter(tree) {
		log(0, 'applyCommentsFilter threshold=', currentThreshold);
		const roots = tree.querySelectorAll(':scope > section.tm-comment-thread');
		roots.forEach(root => {
			markComments(root);
			processCommentThread(root, true);
		});
	}

	function onPlaceholderClick(e) {
		const placeholder = e.target.closest('a.comment-placeholder');
		if (!placeholder) return;
		e.preventDefault();

		const section = placeholder.parentElement.parentElement;
		placeholder.remove();
		log(1, 'placeholder clicked', section);

		section.style.pointerEvents = 'none'; // remove pointerEvents to prevent hover popup
		section.style.display = '';
		getSectionBody(section)?.style?.setProperty('display', '');
		getSectionChildrenBlock(section)?.style?.setProperty('display', '');

		getChildSections(section).forEach(childSection => {
			if (!getFlag(childSection, "hasGood")) collapseCommentWithPlaceholder(childSection);
		});

		// get pointerEvents back
		const events = ['pointermove','mousemove','scroll'];
		const restore = (e) => {
			section.style.pointerEvents = '';
			log(1, 'event restore', e);
			events.forEach(evt => document.removeEventListener(evt, restore));
		};
		events.forEach(evt => {
			document.addEventListener(evt, restore, { passive: true });
		});
	}

	function onVotesClick(e) {
		const a = e.target.closest('a.votes-summary__item');
		if (!a) return;
		e.preventDefault();

		const score = parseInt(a.dataset.score, 10);
		log(0,'filter click score=', score, 'current=', currentThreshold);

		const wrapper = findCommentsWrapper();
		const tree = findCommentsTree(wrapper);
		if (currentThreshold === score) {
			resetCommentsFilter(tree);
			currentThreshold = null;
		} else {
			if (currentThreshold !== null) resetCommentsFilter(tree);
			currentThreshold = score;
			applyCommentsFilter(tree);
		}

		// (un)highlight summary votes
		wrapper.querySelectorAll('a.votes-summary__item').forEach(item => {
			const itemScore = parseInt(item.dataset.score, 10);
			if (currentThreshold !== null && itemScore >= currentThreshold) {
				item.style.background = cssColor;
			} else {
				item.style.background = '';
			}
		});
	}

	async function scrollAllComments() {
		log(1,"scrolling");
		const oldY = window.pageYOffset;
		const oldVis = document.body.style.visibility;
		// делаем невидимым, чтобы не мельтешило
		document.body.style.visibility = "hidden";
		for (let y = window.scrollY + window.innerHeight; y < document.scrollingElement.scrollHeight + window.innerHeight; y += window.innerHeight) {
			window.scrollTo(0, y);
			// await new Promise(r => setTimeout(r, 0)); // дать движку отработать
			await new Promise(r => requestAnimationFrame(r)); // дать движку отработать
		}
		window.scrollTo(0, oldY);
		document.body.style.visibility = oldVis;
	}

	async function buildVotesSummary(button) {
		if (observer) observer.disconnect();
		await scrollAllComments();

		const wrapper = findCommentsWrapper();
		const votes = {};
		const allSections = getAllSections(findCommentsTree(wrapper));
		const total = allSections.length;
		allSections.forEach(section => {
			const score = extractCommentScore(section);
			votes[score] = (votes[score] || 0) + 1;
			log(2, section, score);
		});

		const sorted = Object.entries(votes).sort((a,b)=>b[0]-a[0]);
		log(0, 'votes summary built', total, sorted);

		const frag = document.createDocumentFragment();
		const totalSpan = document.createElement('span');
		totalSpan.textContent = total + ': ';
		frag.appendChild(totalSpan);

		sorted.forEach(([score, count]) => {
			const a = document.createElement('a');
			a.href='#';
			a.textContent = score;
			a.className = 'votes-summary__item tm-votes-lever__score-counter';
			a.style.textDecoration = 'none';
			a.style.padding = '3px';
			if (score > 0) {
				a.classList.add('tm-votes-lever__score-counter_positive');
			} else if (score < 0) {
				a.classList.add('tm-votes-lever__score-counter_negative');
			}
			a.dataset.score = score;
			frag.appendChild(a);
			frag.append(count <= 1 ? ' ' : "(" + count + ") ");
		});

		wrapper.querySelector('#votes-summary')?.remove();
		const summary = document.createElement('div');
		summary.id = 'votes-summary';
		summary.style.color = 'var(--mine-shaft)'; // for dark theme
		summary.appendChild(frag);
		findCommentsHeader(wrapper).insertAdjacentElement('afterend', summary);
		button.disabled = false;
	}

	function createVotesButton(header) {
		log(0, 'createVotesButton', header);
		const button = document.createElement('button');
		button.id = 'comments-votes-button';
		button.textContent = 'Оценки';
		button.onclick = () => {
			button.disabled = true;
			// если есть кнопка "Показать все комментарии"
			document.querySelector('button.tm-height-limiter__expand-button')?.click();
			setTimeout(() => buildVotesSummary(button), 0); // wait for expand button
		};
		header.appendChild(button);
		isCreatingButton = false;
	}
	function ensureVotesButton(caller) {
		log(1, "ensureVotesButton", caller);
		// sometimes button disappears when comments load. We have to recreate it. We stop observer on button click
		if (isCreatingButton || document.getElementById('comments-votes-button')) return;
		const wrapper = findCommentsWrapper();
		if (!wrapper) return;
		if (!findCommentsTree(wrapper)) return;
		const header = findCommentsHeader(wrapper);
		if (!header) return;
		isCreatingButton = true;
		createVotesButton(header);
	}

	function init() {
		log(0, 'init start');
		if (!document.querySelector('div.tm-article-comments, div.tm-article-blocks')) return; // ignore pages without comments

		document.body.addEventListener('click', onVotesClick);
		document.body.addEventListener('click', onPlaceholderClick);

		ensureVotesButton(0);
		observer = new MutationObserver((mutations) => {
			for (const m of mutations) {if (m.target.closest('#' + customLogBoxID)) return;} // ignore custom log changes
			ensureVotesButton(1)
		});
		observer.observe(document.body, { childList: true, subtree: true });

		initHighlightColors();
	}

	window.addEventListener('load', init);
})();
