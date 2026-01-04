// ==UserScript==
// @name         MVLEMPYR Novel Tag Categorizer
// @namespace    http://tampermonkey.net/
// @version      1.6
// @description  Categorizes novel tags. Some tags may be missing or have incorrect information.
// @author       Word
// @match        https://www.mvlempyr.com/novel/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=mvlempyr.com
// @grant        none
// @license      GPL3
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/554395/MVLEMPYR%20Novel%20Tag%20Categorizer.user.js
// @updateURL https://update.greasyfork.org/scripts/554395/MVLEMPYR%20Novel%20Tag%20Categorizer.meta.js
// ==/UserScript==

(() => {
	'use strict';

	const JSON_URL = 'https://raw.githubusercontent.com/RestrictedWord/mvlempyrTags/refs/heads/main/tags.json';
	const TAG_SELECTOR = '.genere-tagslist .genre-tagsitem a[aria-label="Tags"] > div:nth-child(2)';

	const style = document.createElement('style');
	style.textContent = `
  .tagswrapper { height: 100% !important; }
`;
	document.body.appendChild(style);

	const fetchJSON = async (url) => {
		try {
			const response = await fetch(url);
			if (!response.ok) throw new Error(`Fetch failed: ${response.status}`);
			return response.json();
		} catch (error) {
			console.error('[TagCategorizer] JSON fetch failed:', error);
			return null;
		}
	};

	const findTagContainer = () => (
		[...document.querySelectorAll('.genere-tagslist')]
		.find((container) => container.querySelector(TAG_SELECTOR)) || null
	);

	const getTags = () => (
		[...new Set(
			[...document.querySelectorAll(TAG_SELECTOR)]
			.map((el) => el.textContent.trim())
			.filter(Boolean)
		)]
	);

	const categorizeTags = (tags, jsonData) => {
		const categories = {
			Uncategorized: []
		};
		const tagToCat = new Map();

		Object.entries(jsonData.tags).forEach(([cat, data]) => {
			if (Array.isArray(data.tags)) {
				categories[cat] = [];
				data.tags.forEach((t) => {
					if (t.name) tagToCat.set(t.name.trim(), cat);
				});
			}
		});

		tags.forEach((t) => {
			const cat = tagToCat.get(t);
			(cat ? categories[cat] : categories.Uncategorized).push(t);
		});

		Object.keys(categories).forEach((key) => {
			if (!categories[key].length) delete categories[key];
		});

		return categories;
	};

	const createTagElement = (name, tagObj) => {
		const span = document.createElement('span');
		span.textContent = name;

		const tooltip = [];
		if (tagObj?.description) tooltip.push(tagObj.description);
		if (tagObj?.synonyms?.length) tooltip.push(`Synonyms: ${tagObj.synonyms.join(', ')}`);

		span.title = tooltip.join('\n');
		span.style.cssText = `
      display:inline-block;
      margin:2px 3px;
      padding:3px 8px;
      border-radius:6px;
      font-size:0.82em;
      color:#e0dcff;
      background:rgba(80,60,150,0.25);
      border:1px solid rgba(140,120,255,0.2);
      transition:background 0.2s, transform 0.1s;
    `;

		span.addEventListener('mouseenter', () => {
			span.style.background = 'rgba(120,90,200,0.35)';
		});
		span.addEventListener('mouseleave', () => {
			span.style.background = 'rgba(80,60,150,0.25)';
		});

		return span;
	};

	const displayCategories = (categorized, jsonData) => {
		const container = findTagContainer();
		if (!container || document.querySelector('#tag-categories-box')) return;

		const box = document.createElement('div');
		box.id = 'tag-categories-box';
		box.style.cssText = `
      margin-top:25px;
      padding:20px;
      background:rgba(20,20,30,0.7);
      border-radius:10px;
      box-shadow:0 0 12px rgba(100,50,200,0.15);
      width:100%;
      backdrop-filter:blur(6px);
    `;

		const titleBar = document.createElement('div');
		titleBar.style.cssText = 'display:flex; align-items:center; justify-content:space-between; margin-bottom:12px; border-bottom:1px solid rgba(160,120,255,0.2); padding-bottom:5px;';

		const title = document.createElement('h3');
		title.textContent = '🏷️ Categorized Tags';
		title.style.cssText = 'font-size:1.2em; color:#c7b6ff; margin:0;';

		const collapseBtn = document.createElement('button');
		collapseBtn.textContent = 'Collapse';
		collapseBtn.style.cssText = `
      font-size:0.85em;
      padding:2px 6px;
      border:none;
      border-radius:4px;
      cursor:pointer;
      background:rgba(120,90,200,0.3);
      color:#fff;
    `;
		collapseBtn.addEventListener('click', () => {
			boxContent.style.display = boxContent.style.display === 'none' ? 'block' : 'none';
			collapseBtn.textContent = boxContent.style.display === 'none' ? 'Expand' : 'Collapse';
		});

		const toggleSiteBtn = document.createElement('button');
		toggleSiteBtn.textContent = 'Tags';
		toggleSiteBtn.style.cssText = `
      font-size:0.85em;
      padding:2px 6px;
      border:none;
      border-radius:4px;
      cursor:pointer;
      background:rgba(120,90,200,0.3);
      color:#fff;
      margin-left:8px;
    `;
		[...document.querySelectorAll('.genere-tagslist')].forEach(el => {
			el.style.display = 'none';
		});

		// Toggle button
		toggleSiteBtn.addEventListener('click', () => {
			[...document.querySelectorAll('.genere-tagslist')].forEach(el => {
				el.style.display = el.style.display === 'none' ? 'flex' : 'none';
			});
		});

		titleBar.append(title, collapseBtn, toggleSiteBtn);
		box.appendChild(titleBar);

		const boxContent = document.createElement('div');

		Object.entries(categorized).forEach(([cat, tagList]) => {
			const catData = jsonData.tags[cat] || {};
			const section = document.createElement('div');
			section.style.marginBottom = '18px';

			const catTitle = document.createElement('div');
			catTitle.textContent = cat;
			catTitle.style.cssText = `
        color:${cat === 'Uncategorized' ? '#ff6b6b' : '#bfaaff'};
        font-weight:600;
        margin-bottom:4px;
      `;

			const catDesc = document.createElement('div');
			catDesc.textContent = catData.description || '';
			catDesc.style.cssText = `
        color:#999;
        font-size:0.8em;
        margin-bottom:6px;
      `;

			const tagWrap = document.createElement('div');
			tagList.sort().forEach((name) => {
				const tagObj = (catData.tags || []).find((t) => t.name === name);
				tagWrap.appendChild(createTagElement(name, tagObj));
			});

			section.append(catTitle, catDesc, tagWrap);
			boxContent.appendChild(section);
		});

		box.appendChild(boxContent);
		container.insertAdjacentElement('afterend', box);
	};

	const run = async () => {
		const json = await fetchJSON(JSON_URL);
		if (!json?.tags) return;
		const tags = getTags();
		if (!tags.length) return;
		const categorized = categorizeTags(tags, json);
		displayCategories(categorized, json);
	};

	const observer = new MutationObserver(() => {
		const container = findTagContainer();
		if (container && !document.querySelector('#tag-categories-box')) run();
	});

	observer.observe(document.body, {
		childList: true,
		subtree: true
	});
	console.log('[TagCategorizer] Initialized and observing...');
})();