// ==UserScript==
// @name        Sort directories before files
// @description Sort directories before files in repository tree view
// @author      anhkhoakz
// @version     1.0.3
// @match       *://git.sr.ht/*/tree
// @match       *://git.sr.ht/*/tree/*
// @namespace   anhkhoakz
// @icon        https://git.sr.ht/static/logo.png
// @license     AGPL-3.0; https://www.gnu.org/licenses/agpl-3.0.html#license-text
// @downloadURL https://update.greasyfork.org/scripts/549097/Sort%20directories%20before%20files.user.js
// @updateURL https://update.greasyfork.org/scripts/549097/Sort%20directories%20before%20files.meta.js
// ==/UserScript==

// src/dir_to_file_sourcehut.ts
(() => {
  const treeListSelector = ".tree-list";
  const nameCellClass = "name";
  const directoryClass = "tree";
  const fileClass = "blob";
  const root = document.body;
  const treeList = root.querySelector(treeListSelector) ?? (root.matches?.(treeListSelector) ? root : null);
  if (!(treeList && treeList instanceof Element)) {
    return;
  }
  const treeListChildren = Array.from(treeList.children);
  if (treeListChildren.length === 0) {
    return;
  }
  const nameColumnCells = [];
  const directoryRowIndices = [];
  const fileRowIndices = [];
  for (const child of treeListChildren) {
    if (!(child instanceof Element && child.classList.contains(nameCellClass))) {
      continue;
    }
    nameColumnCells.push(child);
    const rowIndex = nameColumnCells.length - 1;
    if (child.classList.contains(directoryClass)) {
      directoryRowIndices.push(rowIndex);
    } else if (child.classList.contains(fileClass)) {
      fileRowIndices.push(rowIndex);
    }
  }
  const totalChildCount = treeListChildren.length;
  const rowCount = nameColumnCells.length;
  if (!rowCount) {
    return;
  }
  if (totalChildCount % rowCount !== 0) {
    return;
  }
  const columnsPerRow = totalChildCount / rowCount;
  if (!Number.isInteger(columnsPerRow) || columnsPerRow <= 0) {
    return;
  }
  if (!(directoryRowIndices.length > 0 && fileRowIndices.length > 0)) {
    return;
  }
  const reorderedFragment = document.createDocumentFragment();
  const appendRowToFragment = (rowIndex) => {
    const start = rowIndex * columnsPerRow;
    for (let c = 0;c < columnsPerRow; c++) {
      const node = treeListChildren[start + c];
      if (!node) {
        continue;
      }
      reorderedFragment.appendChild(node);
    }
  };
  for (const directoryRowIndex of directoryRowIndices) {
    appendRowToFragment(directoryRowIndex);
  }
  for (const fileRowIndex of fileRowIndices) {
    appendRowToFragment(fileRowIndex);
  }
  treeList.textContent = "";
  treeList.appendChild(reorderedFragment);
})();