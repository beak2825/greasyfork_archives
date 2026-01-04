// ==UserScript==
// @name         Linux.do Downloader (New Version)
// @namespace    http://linux.do/
// @version      3.3.0
// @description  One-click export to Markdown with an interactive preview window. Features intelligent conversion for diagrams, image downloads, and flexible copy/download options. Draggable button position.
// @author       PastKing & Gemini
// @match        https://www.linux.do/t/topic/*
// @match        https://linux.do/t/topic/*
// @license      MIT
// @icon         https://cdn.linux.do/uploads/default/optimized/1X/3a18b4b0da3e8cf96f7eea15241c3d251f28a39b_2_32x32.png
// @grant        none
// @require      https://unpkg.com/turndown@7.1.3/dist/turndown.js
// @require      https://unpkg.com/jszip@3.10.1/dist/jszip.min.js
// @downloadURL https://update.greasyfork.org/scripts/561106/Linuxdo%20Downloader%20%28New%20Version%29.user.js
// @updateURL https://update.greasyfork.org/scripts/561106/Linuxdo%20Downloader%20%28New%20Version%29.meta.js
// ==/UserScript==

(function () {
  "use strict";

  let isDragging = false;
  let isMouseDown = false;

  // --- UI Element Creation ---

  function createButtonsContainer() {
    const container = document.createElement("div");
    container.id = "ld-downloader-container";
    container.style.cssText = `position: fixed; z-index: 9999; display: flex; gap: 10px; user-select: none;`;

    // Simplified to a single export button
    const exportButton = document.createElement("button");
    exportButton.id = "export-post-btn";
    exportButton.innerHTML = `<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" style="margin-right: 6px; vertical-align: middle;"><path d="M19 9h-4V3H9v6H5l7 7 7-7zM5 18v2h14v-2H5z"/></svg> Export`;

    exportButton.style.cssText = `padding: 12px 20px; font-size: 14px; font-weight: 600; color: #ffffff; background: linear-gradient(135deg, #0088cc 0%, #0099dd 100%); border: none; border-radius: 8px; cursor: pointer; transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1); box-shadow: 0 4px 12px rgba(0, 136, 204, 0.3); display: flex; align-items: center; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif; backdrop-filter: blur(10px); border: 1px solid rgba(255, 255, 255, 0.2);`;
    exportButton.onmouseover = function () {
      this.style.background =
        "linear-gradient(135deg, #0077bb 0%, #0088cc 100%)";
      this.style.transform = "translateY(-2px)";
      this.style.boxShadow = "0 6px 20px rgba(0, 136, 204, 0.4)";
    };
    exportButton.onmouseout = function () {
      this.style.background =
        "linear-gradient(135deg, #0088cc 0%, #0099dd 100%)";
      this.style.transform = "translateY(0)";
      this.style.boxShadow = "0 4px 12px rgba(0, 136, 204, 0.3)";
    };
    exportButton.onmousedown = function () {
      this.style.transform = "translateY(0) scale(0.98)";
    };
    exportButton.onmouseup = function () {
      this.style.transform = "translateY(-2px) scale(1)";
    };

    container.appendChild(exportButton);
    const savedPosition = JSON.parse(
      localStorage.getItem("actionButtonsPosition")
    );
    if (savedPosition) {
      container.style.left = savedPosition.left;
      container.style.top = savedPosition.top;
    } else {
      container.style.top = "20px";
      container.style.right = "20px";
    }
    document.body.appendChild(container);
    return { container, exportButton };
  }

  function createProgressToast(message) {
    const existingToast = document.getElementById("progress-toast");
    if (existingToast) existingToast.remove();
    const toast = document.createElement("div");
    toast.id = "progress-toast";
    toast.innerHTML = `<div style="display: flex; align-items: center;"><div style="width: 20px; height: 20px; border: 2px solid #ffffff; border-top: 2px solid transparent; border-radius: 50%; animation: spin 1s linear infinite; margin-right: 10px;"></div><span style="color: #ffffff; font-weight: 500;">${message}</span></div>`;
    toast.style.cssText = `position: fixed; top: 20px; right: 20px; background: linear-gradient(135deg, #0088cc 0%, #0099dd 100%); color: white; padding: 16px 24px; border-radius: 8px; box-shadow: 0 6px 20px rgba(0, 136, 204, 0.4); z-index: 10000; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif; font-size: 14px; backdrop-filter: blur(10px); border: 1px solid rgba(255, 255, 255, 0.2); transform: translateX(100%); transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);`;
    const style = document.createElement("style");
    style.textContent = `@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`;
    document.head.appendChild(style);
    document.body.appendChild(toast);
    setTimeout(() => {
      toast.style.transform = "translateX(0)";
    }, 100);
    return toast;
  }

  function removeProgressToast() {
    const toast = document.getElementById("progress-toast");
    if (toast) {
      toast.style.transform = "translateX(100%)";
      setTimeout(() => toast.remove(), 300);
    }
  }

  function showSuccessToast(message) {
    const toast = document.createElement("div");
    toast.innerHTML = `<div style="display: flex; align-items: center;"><svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" style="margin-right: 10px; color: #ffffff;"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/></svg><span style="color: #ffffff; font-weight: 500;">${message}</span></div>`;
    toast.style.cssText = `position: fixed; top: 20px; right: 20px; background: linear-gradient(135deg, #28a745 0%, #34ce57 100%); color: white; padding: 16px 24px; border-radius: 8px; box-shadow: 0 6px 20px rgba(40, 167, 69, 0.4); z-index: 10000; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif; font-size: 14px; backdrop-filter: blur(10px); border: 1px solid rgba(255, 255, 255, 0.2); transform: translateX(100%); transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);`;
    document.body.appendChild(toast);
    setTimeout(() => {
      toast.style.transform = "translateX(0)";
    }, 100);
    setTimeout(() => {
      toast.style.transform = "translateX(100%)";
      setTimeout(() => toast.remove(), 300);
    }, 3000);
  }

  /**
   * ✨ [v3.3.0] Markdown Preview Window (Wider)
   */
  function showPreviewWindow({ title, markdown, imageMap, imageCount }) {
    const existingPreview = document.getElementById("ld-preview-container");
    if (existingPreview) existingPreview.remove();
    const backdrop = document.createElement("div");
    backdrop.id = "ld-preview-backdrop";
    backdrop.style.cssText = `position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0, 0, 0, 0.5); z-index: 10001; backdrop-filter: blur(5px);`;
    const previewContainer = document.createElement("div");
    previewContainer.id = "ld-preview-container";
    previewContainer.style.cssText = `position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%); width: 90vw; max-width: 1100px; height: 85vh; background: #282c34; color: #abb2bf; border-radius: 12px; box-shadow: 0 10px 30px rgba(0, 0, 0, 0.4); z-index: 10002; display: flex; flex-direction: column; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif; overflow: hidden;`;
    const header = document.createElement("div");
    header.style.cssText = `padding: 12px 20px; background: #21252b; border-bottom: 1px solid #3c4048; display: flex; justify-content: space-between; align-items: center; flex-shrink: 0;`;
    const headerTitle = document.createElement("h3");
    headerTitle.textContent = "Markdown Preview";
    headerTitle.style.cssText = `margin: 0; font-size: 16px; color: #e6e6e6; font-weight: 600;`;
    const closeButton = document.createElement("button");
    closeButton.innerHTML = "&times;";
    closeButton.style.cssText = `background: none; border: none; font-size: 24px; color: #abb2bf; cursor: pointer; line-height: 1; padding: 0;`;
    const closePreview = () => {
      backdrop.remove();
      previewContainer.remove();
    };
    closeButton.onclick = closePreview;
    backdrop.onclick = closePreview;
    header.appendChild(headerTitle);
    header.appendChild(closeButton);
    const contentArea = document.createElement("textarea");
    contentArea.value = markdown;
    contentArea.style.cssText = `flex-grow: 1; padding: 20px; background: #282c34; color: #abb2bf; border: none; outline: none; font-family: 'Consolas', 'Monaco', monospace; font-size: 14px; line-height: 1.6; resize: none; width: 100%; box-sizing: border-box;`;
    const footer = document.createElement("div");
    footer.style.cssText = `padding: 12px 20px; background: #21252b; border-top: 1px solid #3c4048; display: flex; justify-content: flex-end; align-items: center; gap: 12px; flex-shrink: 0;`;
    const copyBtn = document.createElement("button");
    copyBtn.textContent = "Copy to Clipboard";
    copyBtn.onclick = async () => {
      try {
        await navigator.clipboard.writeText(contentArea.value);
        showSuccessToast("Copied to clipboard!");
        closePreview();
      } catch (err) {
        console.error("Failed to copy text: ", err);
        alert("Copy failed. See console for details.");
      }
    };
    const downloadBtn = document.createElement("button");
    downloadBtn.textContent = `Download ZIP (${imageCount} images)`;
    downloadBtn.onclick = async () => {
      try {
        const zip = new JSZip();
        const safeTitle = title.replace(/[<>:"/\\|?*]/g, "_");
        zip.file(`${safeTitle}.md`, contentArea.value);
        if (imageMap) {
          const imagesFolder = zip.folder("images");
          for (const [, imgInfo] of imageMap.entries()) {
            imagesFolder.file(imgInfo.fileName, imgInfo.blob);
          }
        }
        const zipBlob = await zip.generateAsync({ type: "blob" });
        const url = URL.createObjectURL(zipBlob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `${safeTitle}.zip`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        showSuccessToast("Download complete!");
        closePreview();
      } catch (err) {
        console.error("Download failed:", err);
        alert("Download failed. See console for details.");
      }
    };
    [copyBtn, downloadBtn].forEach((btn) => {
      btn.style.cssText = `padding: 8px 16px; font-size: 14px; font-weight: 600; color: #ffffff; background: linear-gradient(135deg, #0088cc 0%, #0099dd 100%); border: none; border-radius: 6px; cursor: pointer; transition: all 0.2s ease;`;
      btn.onmouseover = function () {
        this.style.background =
          "linear-gradient(135deg, #0077bb 0%, #0088cc 100%)";
      };
      btn.onmouseout = function () {
        this.style.background =
          "linear-gradient(135deg, #0088cc 0%, #0099dd 100%)";
      };
    });
    footer.appendChild(copyBtn);
    footer.appendChild(downloadBtn);
    previewContainer.appendChild(header);
    previewContainer.appendChild(contentArea);
    previewContainer.appendChild(footer);
    document.body.appendChild(backdrop);
    document.body.appendChild(previewContainer);
    contentArea.focus();
  }

  // --- Core Functionality ---

  function makeDraggable(element) {
    let startX, startY, startLeft, startTop;
    element.addEventListener("mousedown", (e) => {
      isMouseDown = true;
      isDragging = false;
      startX = e.clientX;
      startY = e.clientY;
      startLeft =
        parseInt(element.style.left) ||
        window.innerWidth - parseInt(element.style.right) - element.offsetWidth;
      startTop =
        parseInt(element.style.top) ||
        window.innerHeight -
          parseInt(element.style.bottom) -
          element.offsetHeight;
      e.preventDefault();
    });
    document.addEventListener("mousemove", (e) => {
      if (!isMouseDown) return;
      isDragging = true;
      element.style.left = `${startLeft + e.clientX - startX}px`;
      element.style.top = `${startTop + e.clientY - startY}px`;
      element.style.right = "auto";
      element.style.bottom = "auto";
    });
    document.addEventListener("mouseup", () => {
      if (isMouseDown && isDragging) {
        localStorage.setItem(
          "actionButtonsPosition",
          JSON.stringify({ left: element.style.left, top: element.style.top })
        );
      }
      isMouseDown = false;
      setTimeout(() => {
        isDragging = false;
      }, 10);
    });
  }

  async function downloadImage(url) {
    try {
      const response = await fetch(url);
      if (!response.ok)
        throw new Error(`HTTP error! Status: ${response.status}`);
      return await response.blob();
    } catch (error) {
      console.warn(`Failed to download image: ${url}`, error);
      return null;
    }
  }

  function extractImageUrls(htmlContent) {
    const tempDiv = document.createElement("div");
    tempDiv.innerHTML = htmlContent;
    return Array.from(tempDiv.querySelectorAll("img"))
      .map((img, index) => {
        const src = img.getAttribute("src");
        if (!src) return null;
        const absoluteUrl = new URL(src, window.location.href).href;
        const alt = img.getAttribute("alt") || `image_${index}`;
        const extension = (absoluteUrl.split(".").pop() || "jpg").split(
          /[?#]/
        )[0];
        const safeName = alt.replace(/[<>:"/\\|?*]/g, "_");
        const fileName = `image_${index}_${safeName}.${extension}`;
        return { originalUrl: src, absoluteUrl, fileName, alt };
      })
      .filter(Boolean);
  }

  function getArticleContent() {
    const titleElement = document.querySelector("#topic-title > div > h1");
    const contentElement = document.querySelector(
      "#post_1 > div.row > div.topic-body.clearfix > div.regular.contents > div.cooked"
    );
    if (!titleElement) {
      console.error("Could not find title element.");
      alert(
        "Error: Could not find the article title element, the script may need an update."
      );
      return null;
    }
    const contentHTML = contentElement ? contentElement.innerHTML : "";
    return { title: titleElement.textContent.trim(), content: contentHTML };
  }

  /**
   * @typedef {'flowchart' | 'sequence' | 'unknown'} MermaidDiagramType
   */

  /**
   * ✨ [v3.0.0] New Universal Mermaid Parser Entry Point - Updated for XY Charts
   */
  function processMermaidDiagrams(contentElement) {
    contentElement
      .querySelectorAll(".mermaid-diagram")
      .forEach((diagramContainer) => {
        try {
          const svg = diagramContainer.querySelector("svg");
          if (!svg) return;

          let diagramType = "unknown";
          // Check for diagram type with specific attributes first
          const ariaRole = svg.getAttribute("aria-roledescription");
          if (ariaRole === "xychart") {
            diagramType = "xychart";
          } else if (ariaRole === "stateDiagram") {
            diagramType = "state";
          } else if (svg.querySelector(".actor")) {
            diagramType = "sequence";
          } else if (svg.querySelector(".node")) {
            diagramType = "flowchart";
          }

          let mermaidCode = "";
          if (diagramType === "flowchart") {
            mermaidCode = parseFlowchartSVG(svg);
          } else if (diagramType === "sequence") {
            mermaidCode = parseSequenceSVG(svg);
          } else if (diagramType === "state") {
            mermaidCode = parseStateDiagramSVG(svg);
          } else if (diagramType === "xychart") {
            mermaidCode = parseXyChartSVG(svg);
          } else {
            throw new Error(
              `Unknown or unsupported Mermaid diagram type: "${
                ariaRole || "N/A"
              }"`
            );
          }

          const pre = document.createElement("pre");
          pre.textContent = mermaidCode;
          diagramContainer.parentNode.replaceChild(pre, diagramContainer);
        } catch (error) {
          console.error("Mermaid diagram conversion failed:", error);
          const p = document.createElement("p");
          p.textContent = `[Mermaid diagram conversion failed: ${error.message}]`;
          p.style.cssText = "color: red; border: 1px solid red; padding: 10px;";
          diagramContainer.parentNode.replaceChild(p, diagramContainer);
        }
      });
  }

  /**
   * ✨ [v3.1.2] Flowchart Parser (Hybrid Router)
   * This function detects the chart type and calls the appropriate specialized parser.
   */
  function parseFlowchartSVG(svg) {
    // The tell-tale sign of the complex, geometrically-laid-out chart is a <g class="root">
    // nested inside the main <g class="nodes"> container.
    const isComplexChart = svg.querySelector("g.cluster");

    if (isComplexChart) {
      // Use the parser designed for visually nested subgraphs
      return parseFlowchartSVG_Geometric(svg);
    } else {
      // Use the parser designed for simple, standard flowcharts
      return parseFlowchartSVG_Simple(svg);
    }
  }

  /**
   * Parser for simple flowcharts. Fast, relies on DOM structure and ordering.
   */
  function parseFlowchartSVG_Simple(svg) {
    const getTransformCoords = (el) => {
      if (!el || !el.hasAttribute("transform")) return { x: 0, y: 0 };
      const transform = el.getAttribute("transform");
      const match = /translate\(\s*([0-9.-]+)\s*,\s*([0-9.-]+)\s*\)/.exec(
        transform
      );
      return match
        ? { x: parseFloat(match[1]), y: parseFloat(match[2]) }
        : { x: 0, y: 0 };
    };

    const nodes = new Map();
    svg.querySelectorAll(".nodes > .node").forEach((nodeEl) => {
      const mermaidIdMatch = nodeEl.id.match(/flowchart-([a-zA-Z0-9_]+)-\d+/);
      if (!mermaidIdMatch) return;
      const id = mermaidIdMatch[1];
      const text = nodeEl.querySelector(".nodeLabel")?.textContent.trim() || "";
      const coords = getTransformCoords(nodeEl);
      nodes.set(id, { id, text, x: coords.x, y: coords.y });
    });

    const links = [];
    const edgePaths = Array.from(
      svg.querySelectorAll(".edgePaths > .flowchart-link")
    );
    const edgeLabels = Array.from(
      svg.querySelectorAll(".edgeLabels > .edgeLabel")
    );

    edgePaths.forEach((pathEl, index) => {
      const idParts = pathEl.id.split("_");
      if (idParts.length < 3 || idParts[0] !== "L") return;
      let label = "";
      if (edgeLabels[index]) {
        const pElement = edgeLabels[index].querySelector("p");
        if (pElement) {
          label = pElement.innerHTML.trim();
        }
      }
      links.push({
        source: idParts[1],
        dest: idParts.slice(2, idParts.length - 1).join("_"),
        type: pathEl.classList.contains("edge-pattern-dotted") ? "-.->" : "-->",
        label: label,
      });
    });

    let direction = "TD";
    if (
      links.length > 0 &&
      nodes.has(links[0].source) &&
      nodes.has(links[0].dest)
    ) {
      const n1 = nodes.get(links[0].source);
      const n2 = nodes.get(links[0].dest);
      if (Math.abs(n2.x - n1.x) > Math.abs(n2.y - n1.y)) {
        direction = "LR";
      }
    }

    let mermaidCode = `flowchart ${direction}\n`;
    const definedNodes = new Set();
    const linkLines = links
      .map((link) => {
        const sourceNode = nodes.get(link.source);
        const destNode = nodes.get(link.dest);
        if (!sourceNode || !destNode) return "";
        let sourceDef = sourceNode.id;
        if (sourceNode.text && !definedNodes.has(sourceNode.id)) {
          sourceDef = `${sourceNode.id}[${sourceNode.text}]`;
          definedNodes.add(sourceNode.id);
        }
        let destDef = destNode.id;
        if (destNode.text && !definedNodes.has(destNode.id)) {
          destDef = `${destNode.id}[${destNode.text}]`;
          definedNodes.add(destNode.id);
        }
        const labelText = link.label ? `|${link.label}|` : "";
        return `    ${sourceDef} ${link.type}${labelText} ${destDef}`;
      })
      .filter(Boolean)
      .join("\n");
    mermaidCode += linkLines;
    return "```mermaid\n" + mermaidCode.trim() + "\n```";
  }

  /**
   * Parser for complex, geometrically-laid-out flowcharts with nested subgraphs.
   * Corrected version for proper subgraph ordering and unified link generation.
   */
  function parseFlowchartSVG_Geometric(svg) {
    const diagram = {
      subgraphs: [],
      nodes: [],
      links: [],
      styles: new Map(),
      classAssignments: {},
    };
    const getTransformCoords = (el) => {
      if (!el.hasAttribute("transform")) return { x: 0, y: 0 };
      const transform = el.getAttribute("transform");
      const match = /translate\(\s*([0-9.-]+)\s*,\s*([0-9.-]+)\s*\)/.exec(
        transform
      );
      return match
        ? { x: parseFloat(match[1]), y: parseFloat(match[2]) }
        : { x: 0, y: 0 };
    };
    const getAbsoluteCoords = (el) => {
      let x = 0,
        y = 0;
      let current = el;
      while (current && current !== svg) {
        const coords = getTransformCoords(current);
        x += coords.x;
        y += coords.y;
        current = current.parentElement;
      }
      return { x, y };
    };
    const isInside = (point, rect) =>
      point.x >= rect.x &&
      point.x <= rect.x + rect.width &&
      point.y >= rect.y &&
      point.y <= rect.y + rect.height;
    const styleContent = svg.querySelector("style")?.textContent || "";
    const styleRegex = /\.([a-zA-Z0-9_-]+)\s*>\s*\*{([^}]+)}/g;
    let match;
    while ((match = styleRegex.exec(styleContent)) !== null) {
      const className = match[1];
      const cssProps = match[2]
        .replace(/!important/g, "")
        .trim()
        .replace(/\s*;\s*$/, "")
        .replace(/;/g, ",");
      diagram.styles.set(className, `classDef ${className} ${cssProps}`);
    }
    const allNodes = [];
    svg.querySelectorAll(".node").forEach((nodeEl) => {
      const mermaidIdMatch = nodeEl.id.match(/flowchart-([a-zA-Z0-9_]+)-\d+/);
      if (!mermaidIdMatch) return;
      const absCoords = getAbsoluteCoords(nodeEl);
      const styleClass = Array.from(nodeEl.classList).find((c) =>
        diagram.styles.has(c)
      );
      const node = {
        id: mermaidIdMatch[1],
        text: nodeEl.querySelector(".nodeLabel")?.textContent.trim() || "",
        styleClass: styleClass,
        x: absCoords.x,
        y: absCoords.y,
      };
      allNodes.push(node);
      if (styleClass) {
        if (!diagram.classAssignments[styleClass])
          diagram.classAssignments[styleClass] = [];
        diagram.classAssignments[styleClass].push(node.id);
      }
    });
    const allClusters = [];
    svg.querySelectorAll("g.cluster").forEach((clusterEl) => {
      const rectEl = clusterEl.querySelector(":scope > rect");
      if (!rectEl) return;
      const clusterAbsCoords = getAbsoluteCoords(clusterEl);
      const rect = {
        x: clusterAbsCoords.x + parseFloat(rectEl.getAttribute("x")),
        y: clusterAbsCoords.y + parseFloat(rectEl.getAttribute("y")),
        width: parseFloat(rectEl.getAttribute("width")),
        height: parseFloat(rectEl.getAttribute("height")),
      };
      const originalId = clusterEl.id;
      const specialClass = Array.from(clusterEl.classList).find((c) =>
        diagram.styles.has(c)
      );
      const sanitizedId = specialClass
        ? `sg_${specialClass}`
        : originalId.replace(/[\s\W]/g, "_");
      allClusters.push({
        originalId: originalId,
        sanitizedId: sanitizedId,
        title:
          clusterEl.querySelector(".cluster-label")?.textContent.trim() ||
          clusterEl.id,
        rect: rect,
        area: rect.width * rect.height,
        nodes: [],
        subgraphs: [],
        links: [], // This will no longer be used but is kept for structure
      });
    });

    // Sort by area to determine nesting hierarchy correctly
    allClusters.sort((a, b) => a.area - b.area);

    const assignedNodes = new Set();
    allClusters.forEach((parent) => {
      allNodes.forEach((node) => {
        if (!assignedNodes.has(node.id) && isInside(node, parent.rect)) {
          parent.nodes.push(node);
          assignedNodes.add(node.id);
        }
      });
      allClusters.forEach((child) => {
        if (
          parent !== child &&
          !child.parent &&
          isInside({ x: child.rect.x + 1, y: child.rect.y + 1 }, parent.rect)
        ) {
          parent.subgraphs.push(child);
          child.parent = parent;
        }
      });
    });

    diagram.nodes = allNodes.filter((n) => !assignedNodes.has(n.id));
    diagram.subgraphs = allClusters.filter((c) => !c.parent);

    // FIX #1: Sort top-level subgraphs by their vertical position (Y-coordinate)
    diagram.subgraphs.sort((a, b) => a.rect.y - b.rect.y);

    const allLinks = [];
    svg.querySelectorAll(".edgePaths path").forEach((pathEl) => {
      const idParts = pathEl.id.split("_");
      if (idParts.length < 3 || idParts[0] !== "L") return;
      allLinks.push({
        source: idParts[1],
        dest: idParts.slice(2, idParts.length - 1).join("_"),
        type: pathEl.classList.contains("edge-pattern-dotted") ? "-.->" : "-->",
      });
    });

    // FIX #2: Assign ALL links to the top-level diagram to be rendered at the end
    allLinks.forEach((link) => {
      diagram.links.push(link);
    });

    // This section is now obsolete due to FIX #2 but left for context
    // const nodeToClusterMap = new Map();
    // const mapNodesToClusters = (clusters) => { ... };
    // mapNodesToClusters(diagram.subgraphs);

    const clusterIdMap = new Map();
    allClusters.forEach((c) => clusterIdMap.set(c.originalId, c.sanitizedId));

    const generateLinkMarkdown = (link, indent) => {
      // Use original node IDs for linking
      const sourceId = link.source;
      const destId = link.dest;

      // Find the nodes to get their text for pretty definition
      const sourceNode = allNodes.find((n) => n.id === sourceId);
      const destNode = allNodes.find((n) => n.id === destId);

      // This is a simplified link generation, assuming nodes are defined elsewhere.
      // For a more robust solution, you might need to track defined nodes.
      return `${indent}${sourceId} --> ${destId}\n`;
    };

    const generateNodeDefinitions = (nodes, indent) => {
      let code = "";
      nodes.forEach((node) => {
        code += `${indent}${node.id}[${JSON.stringify(node.text)}]\n`;
      });
      return code;
    };

    const generateSubgraphMarkdown = (subgraph, indent) => {
      let code = `${indent}subgraph ${subgraph.title}\n`;
      // Generate node definitions first
      code += generateNodeDefinitions(subgraph.nodes, indent + "    ");

      // Recursively generate for sub-subgraphs
      subgraph.subgraphs.forEach((sg) => {
        code += generateSubgraphMarkdown(sg, indent + "    ");
      });
      code += `${indent}end\n`;
      return code;
    };

    let mermaidCode = "graph TD\n\n";
    // First, define all subgraphs and the nodes within them
    diagram.subgraphs.forEach((sg) => {
      mermaidCode += generateSubgraphMarkdown(sg, "    ");
      mermaidCode += "\n";
    });

    // Then, define all top-level nodes (if any)
    if (diagram.nodes.length > 0) {
      mermaidCode += "    %% Top-level nodes\n";
      mermaidCode += generateNodeDefinitions(diagram.nodes, "    ");
      mermaidCode += "\n";
    }

    // Finally, define ALL links at the end
    if (diagram.links.length > 0) {
      mermaidCode += "    %% Link definitions\n";
      // A simple map to prevent redefining nodes in links
      const definedNodesInLinks = new Set();
      diagram.links.forEach((link) => {
        const sourceNode = allNodes.find((n) => n.id === link.source);
        const destNode = allNodes.find((n) => n.id === link.dest);

        if (!sourceNode || !destNode) return;

        let sourceDef = sourceNode.id;
        // The logic to define nodes within links can be complex.
        // A simpler approach, adopted here, is to define all nodes first
        // and then just link them by ID.
        let destDef = destNode.id;

        mermaidCode += `    ${sourceDef} --> ${destDef}\n`;
      });
    }

    // Applying styles is omitted for brevity but would go here

    return (
      "```mermaid\n" +
      mermaidCode.trim().replace(/\n\s*\n\s*\n/g, "\n\n") +
      "\n```"
    );
  }

  /**
   * ✨ [v3.1.3] Sequence Diagram Parser
   */
  function parseSequenceSVG(svg) {
    const actors = [];
    svg.querySelectorAll("g > rect.actor-top").forEach((rect) => {
      const g = rect.parentElement;
      const name = rect.getAttribute("name");
      if (!name) return;
      const textEl = g.querySelector("text.actor-box");
      const label = textEl ? textEl.textContent.trim() : name;
      const lifeline = svg.querySelector(`line.actor-line[name="${name}"]`);
      if (!lifeline) return;
      const x = parseFloat(lifeline.getAttribute("x1"));
      const id = name.replace(/[\s\W]/g, "_");
      actors.push({ id, label, x });
    });
    actors.sort((a, b) => a.x - b.x);
    const findClosestActor = (x, actorList) => {
      let closest = null;
      let minDistance = Infinity;
      for (const actor of actorList) {
        const distance = Math.abs(actor.x - x);
        if (distance < minDistance) {
          minDistance = distance;
          closest = actor;
        }
      }
      return closest;
    };
    const events = [];
    const messageTexts = Array.from(svg.querySelectorAll("text.messageText"));
    svg.querySelectorAll('line[class^="messageLine"]').forEach((line) => {
      const y = parseFloat(line.getAttribute("y1"));
      const x1 = parseFloat(line.getAttribute("x1"));
      const x2 = parseFloat(line.getAttribute("x2"));
      let bestTextMatch = null;
      let minVerticalDistance = Infinity;
      for (let i = messageTexts.length - 1; i >= 0; i--) {
        const textEl = messageTexts[i];
        const textY = parseFloat(textEl.getAttribute("y"));
        const verticalDistance = y - textY;
        if (verticalDistance > 0 && verticalDistance < 50) {
          const textX = parseFloat(textEl.getAttribute("x"));
          if (textX > Math.min(x1, x2) && textX < Math.max(x1, x2)) {
            if (verticalDistance < minVerticalDistance) {
              minVerticalDistance = verticalDistance;
              bestTextMatch = { el: textEl, index: i };
            }
          }
        }
      }
      let text = "";
      if (bestTextMatch) {
        text = bestTextMatch.el.textContent.trim();
        messageTexts.splice(bestTextMatch.index, 1);
      }
      const fromActor = findClosestActor(x1, actors);
      const toActor = findClosestActor(x2, actors);
      if (!fromActor || !toActor) return;
      const isDashed = line.classList.contains("messageLine1");
      const arrow = isDashed ? "-->>" : "->>";
      events.push({
        type: "message",
        y,
        from: fromActor.id,
        to: toActor.id,
        arrow,
        text,
      });
    });
    svg.querySelectorAll("g").forEach((g) => {
      if (!g.querySelector(".labelBox")) return;
      const labelTextEl = g.querySelector(".labelText");
      const loopTextEl = g.querySelector(".loopText");
      if (!labelTextEl) return;
      const blockType = labelTextEl.textContent.trim().toLowerCase();
      const description = loopTextEl ? loopTextEl.textContent.trim() : "";
      const lines = g.querySelectorAll(".loopLine");
      if (lines.length === 0) return;
      let minY = Infinity,
        maxY = -Infinity;
      lines.forEach((line) => {
        minY = Math.min(
          minY,
          parseFloat(line.getAttribute("y1")),
          parseFloat(line.getAttribute("y2"))
        );
        maxY = Math.max(
          maxY,
          parseFloat(line.getAttribute("y1")),
          parseFloat(line.getAttribute("y2"))
        );
      });
      events.push({
        type: "start_block",
        y: minY,
        blockType,
        text: description,
      });
      events.push({ type: "end_block", y: maxY });
    });
    events.sort((a, b) => a.y - b.y);
    let mermaidCode = "sequenceDiagram\n";
    actors.forEach((actor) => {
      mermaidCode += `    participant ${actor.id} as "${actor.label}"\n`;
    });
    let indent = "    ";
    events.forEach((event) => {
      switch (event.type) {
        case "message":
          mermaidCode += `${indent}${event.from}${event.arrow}${event.to}: ${event.text}\n`;
          break;
        case "start_block":
          mermaidCode += `${indent}${event.blockType} ${event.text}\n`;
          indent += "    ";
          break;
        case "end_block":
          indent = indent.slice(0, -4);
          mermaidCode += `${indent}end\n`;
          break;
      }
    });
    return "```mermaid\n" + mermaidCode.trim() + "\n```";
  }

  /**
   * ✨ [v3.4.4] State Diagram Parser (Definitive Layout & Logic Correction)
   * Correctly associates notes with their source states and implements a logical print order.
   */
  function parseStateDiagramSVG(svg) {
    const getAbsoluteCoords = (el) => {
      let x = 0,
        y = 0;
      let current = el;
      while (current && current !== svg) {
        const transform = current.getAttribute("transform");
        if (transform) {
          const match = /translate\(\s*([0-9.-]+)\s*,\s*([0-9.-]+)\s*\)/.exec(
            transform
          );
          if (match) {
            x += parseFloat(match[1]);
            y += parseFloat(match[2]);
          }
        }
        current = current.parentElement;
      }
      return { x, y };
    };

    const distance = (p1, p2) => Math.hypot(p1.x - p2.x, p1.y - p2.y);

    const nodes = new Map();
    svg.querySelectorAll(".node").forEach((nodeEl) => {
      const rawId = nodeEl.id;
      if (!rawId) return;
      const coords = getAbsoluteCoords(nodeEl);
      let type = "state";
      if (nodeEl.querySelector(".state-start")) type = "start";
      else if (nodeEl.querySelector('g > path[fill="#ccc"]')) type = "end";
      const text = nodeEl.textContent.trim();
      const cleanId = type === "start" || type === "end" ? "[*]" : text;
      nodes.set(rawId, { id: cleanId, coords, rawId, text, notes: [] });
    });

    // 1. Associate notes with their correct state node
    svg.querySelectorAll(".statediagram-note").forEach((noteEl) => {
      const noteId = noteEl.id;
      const noteText = noteEl.textContent.trim();
      const connector = svg.querySelector(
        `.note-edge[id*="${noteId.replace("state-", "")}"]`
      );
      if (connector) {
        const stateName = connector.id.split("-")[0];
        let targetNode = null;
        nodes.forEach((node) => {
          if (node.text === stateName) {
            targetNode = node;
          }
        });
        if (targetNode) {
          const position = "right of";
          targetNode.notes.push({ text: noteText, position });
        }
      }
    });

    const transitions = [];
    const edgePaths = Array.from(
      svg.querySelectorAll("path.transition:not(.note-edge)")
    );
    const edgeLabels = Array.from(
      svg.querySelectorAll(".edgeLabels > .edgeLabel")
    );

    // 2. Parse all transitions
    edgePaths.forEach((pathEl, index) => {
      const label = edgeLabels[index]
        ? edgeLabels[index].textContent.trim()
        : "";
      const pathLength = pathEl.getTotalLength();
      if (pathLength === 0) return;

      const startPoint = pathEl.getPointAtLength(0);
      const endPoint = pathEl.getPointAtLength(pathLength);

      let closestStart = null,
        minStartDist = Infinity;
      nodes.forEach((node) => {
        const d = distance(node.coords, startPoint);
        if (d < minStartDist) {
          minStartDist = d;
          closestStart = node;
        }
      });

      let closestEnd = null,
        minEndDist = Infinity;
      nodes.forEach((node) => {
        const d = distance(node.coords, endPoint);
        if (d < minEndDist) {
          minEndDist = d;
          closestEnd = node;
        }
      });

      if (closestStart && closestEnd) {
        transitions.push({ from: closestStart, to: closestEnd, label });
      }
    });

    // 3. Assemble the code with correct grouping and layout
    let mermaidCode = "stateDiagram-v2\n";

    // Group transitions by their source node ID for logical output
    const groupedByFrom = transitions.reduce((acc, t) => {
      const fromId = t.from.id;
      if (!acc[fromId]) acc[fromId] = [];
      acc[fromId].push(t);
      return acc;
    }, {});

    // Define a logical print order for states
    const printOrder = ["[*]", "idle", "creating", "restoring", "error"];
    const printedStates = new Set();

    const printSectionFor = (stateId) => {
      if (printedStates.has(stateId)) return;

      const transitionsFromState = groupedByFrom[stateId] || [];
      const notesForState =
        Array.from(nodes.values()).find((n) => n.id === stateId)?.notes || [];

      if (transitionsFromState.length === 0 && notesForState.length === 0)
        return;

      // Print all transitions originating from this state
      transitionsFromState.forEach((t) => {
        const labelPart = t.label ? ` : ${t.label}` : "";
        mermaidCode += `    ${t.from.id} --> ${t.to.id}${labelPart}\n`;
      });

      // After printing transitions, print the notes associated WITH THIS state
      if (notesForState.length > 0) {
        // Add a blank line if transitions were also printed, for spacing
        if (transitionsFromState.length > 0) mermaidCode += "\n";
        notesForState.forEach((note) => {
          mermaidCode += `    note ${note.position} ${stateId}\n        ${note.text}\n    end note\n`;
        });
      }

      mermaidCode += "\n"; // Add a blank line after each logical block
      printedStates.add(stateId);
    };

    // Print sections in the defined logical order
    printOrder.forEach((stateId) => printSectionFor(stateId));

    // Handle any states that were not in the predefined order (for other diagrams)
    Object.keys(groupedByFrom).forEach((stateId) => printSectionFor(stateId));

    return (
      "```mermaid\n" + mermaidCode.trim().replace(/\n{3,}/g, "\n\n") + "\n```"
    );
  }

  /**
   * ✨ [v3.5.1] XY Chart Parser (Corrected)
   * Fixes a variable naming typo that caused a runtime error.
   */
  function parseXyChartSVG(svg) {
    let mermaidCode = "xychart-beta\n";

    // 1. Extract the main title
    const titleEl = svg.querySelector(".chart-title text");
    if (titleEl) {
      mermaidCode += `    title "${titleEl.textContent.trim()}"\n`;
    }

    // 2. Extract X-Axis labels (categories)
    const xAxisLabels = [];
    svg.querySelectorAll(".bottom-axis .label text").forEach((labelEl) => {
      const transform = labelEl.getAttribute("transform");
      const match = /translate\(\s*([0-9.-]+)\s*,/.exec(transform);
      if (match) {
        xAxisLabels.push({
          text: labelEl.textContent.trim(),
          x: parseFloat(match[1]),
        });
      }
    });
    xAxisLabels.sort((a, b) => a.x - b.x);
    const categoryNames = xAxisLabels.map((l) => `"${l.text}"`).join(", ");
    mermaidCode += `    x-axis [${categoryNames}]\n`;

    // 3. Extract Y-Axis title
    const yAxisTitleEl = svg.querySelector(".left-axis .title text");
    if (yAxisTitleEl) {
      mermaidCode += `    y-axis "${yAxisTitleEl.textContent.trim()}"\n`;
    }

    // 4. Reconstruct the data values from the bar plot

    // a. Create a scale function by mapping pixel Y-coordinates to Y-axis tick values
    const yTicks = [];
    svg.querySelectorAll(".left-axis .label text").forEach((tickEl) => {
      const value = parseFloat(tickEl.textContent.trim());
      if (!isNaN(value)) {
        const transform = tickEl.getAttribute("transform");
        const match = /translate\([^,]+,\s*([0-9.-]+)\s*\)/.exec(transform);
        if (match) {
          yTicks.push({ value, y: parseFloat(match[1]) });
        }
      }
    });

    // --- FIX IS HERE ---
    // The variable is now declared with the correct name: "pixelToValueScale"
    let pixelToValueScale = () => 0; // Default function returns 0

    if (yTicks.length >= 2) {
      yTicks.sort((a, b) => a.value - b.value);
      const minTick = yTicks[0];
      const maxTick = yTicks[yTicks.length - 1];

      const slope = (maxTick.y - minTick.y) / (maxTick.value - minTick.value);

      // This assignment now correctly modifies the declared variable from the outer scope.
      pixelToValueScale = (yPixel, yZero) => {
        const heightInPixels = yZero - yPixel;
        const value = heightInPixels / Math.abs(slope);
        // Round to avoid floating point inaccuracies from SVG rendering
        const roundedValue = Math.round(value);
        // If the value is very close to an integer, use it. Otherwise, use one decimal place.
        return Math.abs(roundedValue - value) < 0.05
          ? roundedValue
          : Math.round(value * 10) / 10;
      };
    }

    // b. Extract bar data, sort it, and apply the scaling function
    const barData = [];
    const yZeroLine = yTicks.find((t) => t.value === 0)?.y;

    if (yZeroLine !== undefined) {
      svg.querySelectorAll(".plot .bar-plot-0 rect").forEach((barEl) => {
        const yPixel = parseFloat(barEl.getAttribute("y"));
        const xPixel = parseFloat(barEl.getAttribute("x"));
        const value = pixelToValueScale(yPixel, yZeroLine);
        barData.push({ value, x: xPixel });
      });
    }

    barData.sort((a, b) => a.x - b.x);
    const dataValues = barData.map((d) => d.value).join(", ");
    mermaidCode += `    bar [${dataValues}]\n`;

    return "```mermaid\n" + mermaidCode.trim() + "\n```";
  }

  function createTurndownService(imageMap = null) {
    const turndownService = new TurndownService({
      headingStyle: "atx",
      codeBlockStyle: "fenced",
    });
    turndownService.addRule("mermaidBlock", {
      filter: (node) =>
        node.nodeName === "PRE" && node.textContent.startsWith("```mermaid"),
      replacement: (content, node) => "\n\n" + node.textContent + "\n\n",
    });
    turndownService.addRule("task-list-items", {
      filter: (node) =>
        node.type === "checkbox" && node.parentNode.nodeName === "LI",
      replacement: (content, node) =>
        (node.checked ? "[x] " : "[ ] ") + content,
    });
    turndownService.addRule("strikethrough", {
      filter: ["del", "s", "strike"],
      replacement: (content) => "~~" + content + "~~",
    });
    turndownService.addRule("codeBlocks", {
      filter: (node) => node.nodeName === "PRE" && node.querySelector("code"),
      replacement: (content, node) => {
        const codeElement = node.querySelector("code");
        const codeContent = codeElement
          ? codeElement.textContent
          : node.textContent;
        const language = codeElement
          ? (codeElement.className.match(/language-(\w+)/) || ["", ""])[1]
          : "";
        return `\n\n\`\`\`${language}\n${codeContent.trim()}\n\`\`\`\n\n`;
      },
    });
    turndownService.addRule("images_and_links", {
      filter: ["a", "img"],
      replacement: function (content, node) {
        if (node.nodeName === "IMG") {
          const alt = (node.alt || "").replace(/\[|\]/g, "");
          const src = node.getAttribute("src") || "";
          const title = node.title ? ` "${node.title}"` : "";
          const absoluteUrl = new URL(src, window.location.href).href;
          const path =
            imageMap && imageMap.has(src) ? imageMap.get(src) : absoluteUrl;
          return `![${alt}](${path}${title})`;
        }
        if (node.nodeName === "A") {
          const href = node.getAttribute("href") || "";
          const title = node.title ? ` "${node.title}"` : "";
          if (content.trim() === "" && !node.querySelector("img")) return "";
          const codeContent = node.querySelector("code");
          if (codeContent) {
            content = "`" + codeContent.textContent + "`";
          }
          if (content === href) return href;
          return `[${content}](${href}${title})`;
        }
        return content;
      },
    });
    return turndownService;
  }

  /**
   * Generates the full markdown content and downloads images.
   */
  async function generateFullMarkdown() {
    const article = getArticleContent();
    if (!article) return null;

    const toast = createProgressToast("Generating Markdown...");
    try {
      const contentClone = document.createElement("div");
      contentClone.innerHTML = article.content;

      const imageUrls = extractImageUrls(article.content);
      const imageMap = new Map();
      let downloadedImageCount = 0;

      const imageDownloadPromises = imageUrls.map(async (imageInfo, index) => {
        toast.querySelector("span").textContent = `Downloading image ${
          index + 1
        }/${imageUrls.length}...`;
        const imageBlob = await downloadImage(imageInfo.absoluteUrl);
        if (imageBlob) {
          downloadedImageCount++;
          return { ...imageInfo, blob: imageBlob };
        }
        return { ...imageInfo, blob: null };
      });
      const downloadedImages = await Promise.all(imageDownloadPromises);
      downloadedImages.forEach((img) => {
        if (img.blob) {
          imageMap.set(img.originalUrl, {
            path: `images/${img.fileName}`,
            blob: img.blob,
            fileName: img.fileName,
          });
        }
      });

      toast.querySelector("span").textContent = "Processing diagrams...";
      await new Promise((resolve) => setTimeout(resolve, 100));
      processMermaidDiagrams(contentClone);

      toast.querySelector("span").textContent =
        "Converting HTML to Markdown...";
      const turndownImagePaths = imageMap
        ? new Map(Array.from(imageMap.entries()).map(([k, v]) => [k, v.path]))
        : null;
      const turndownService = createTurndownService(turndownImagePaths);
      const markdownBody = turndownService.turndown(contentClone);
      const fullMarkdown = `# ${article.title}\n\n---\n\n${markdownBody}`;
      const cleanedMarkdown = fullMarkdown.replace(/\n{3,}/g, "\n\n").trim();

      removeProgressToast();
      return {
        title: article.title,
        markdown: cleanedMarkdown,
        imageMap: imageMap,
        imageCount: downloadedImageCount,
      };
    } catch (error) {
      console.error("Error generating markdown:", error);
      removeProgressToast();
      alert("Markdown generation failed. See console for details.");
      return null;
    }
  }

  /**
   * Main handler for the Export button.
   */
  async function handleAction() {
    const button = document.getElementById("export-post-btn");
    if (!button || button.disabled) return;

    const originalButtonHTML = button.innerHTML;
    button.disabled = true;
    button.style.opacity = "0.7";
    button.style.cursor = "not-allowed";
    button.innerHTML = `<div style="width: 16px; height: 16px; border: 2px solid #ffffff; border-top: 2px solid transparent; border-radius: 50%; animation: spin 1s linear infinite; margin-right: 6px;"></div>Preparing...`;

    try {
      const result = await generateFullMarkdown();
      if (result) {
        showPreviewWindow(result);
      }
    } catch (error) {
      console.error(`Error during action:`, error);
      alert(`Action failed, see console for details.`);
    } finally {
      // Reset button state after preview is shown or on error.
      button.innerHTML = originalButtonHTML;
      button.disabled = false;
      button.style.opacity = "1";
      button.style.cursor = "pointer";
    }
  }

  // --- Startup & Initialization ---

  function initializeScript() {
    if (document.getElementById("ld-downloader-container")) return;
    const { container, exportButton } = createButtonsContainer();
    makeDraggable(container);
    exportButton.addEventListener("click", () => !isDragging && handleAction());

    const observer = new MutationObserver(() => {
      if (!document.body.contains(container)) {
        document.body.appendChild(container);
      }
    });
    observer.observe(document.body, { childList: true, subtree: true });
  }

  function main() {
    console.log(
      "Linux.do Downloader: Script started, waiting for page content..."
    );
    const targetSelector = "#post_1 .cooked";
    let checkCount = 0;
    const maxChecks = 50;
    const checkInterval = setInterval(() => {
      const targetElement = document.querySelector(targetSelector);
      if (targetElement && targetElement.children.length > 0) {
        console.log(
          "Linux.do Downloader: Page content loaded, initializing UI."
        );
        clearInterval(checkInterval);
        initializeScript();
      } else if (checkCount > maxChecks) {
        console.warn(
          "Linux.do Downloader: Timeout waiting for content. Initializing anyway."
        );
        clearInterval(checkInterval);
        initializeScript();
      }
      checkCount++;
    }, 200);
  }

  main();
})();
