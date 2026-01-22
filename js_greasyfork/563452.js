// ==UserScript==
// @name         ReadTheory AI Helper + OCR
// @namespace    https://example.com/readtheory-openrouter
// @version      4.0
// @description  Uses ARIA/DOM, and falls back to OCR via Tesseract.js to read blocked ReadTheory questions. No auto-answering.
// @match        https://readtheoryapp.com/*
// @license      MIT
// @grant        GM_xmlhttpRequest
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/563452/ReadTheory%20AI%20Helper%20%2B%20OCR.user.js
// @updateURL https://update.greasyfork.org/scripts/563452/ReadTheory%20AI%20Helper%20%2B%20OCR.meta.js
// ==/UserScript==

const OPENROUTER_API_KEY = "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";
const OPENROUTER_URL = "https://openrouter.ai/api/v1/chat/completions";
const MODEL = "xiaomi/mimo-v2-flash:free";

// Load Tesseract.js dynamically
function loadTesseract() {
  return new Promise((resolve, reject) => {
    if (window.Tesseract) return resolve(window.Tesseract);
    const script = document.createElement("script");
    script.src = "https://cdn.jsdelivr.net/npm/tesseract.js@4.1.1/dist/tesseract.min.js";
    script.onload = () => resolve(window.Tesseract);
    script.onerror = reject;
    document.head.appendChild(script);
  });
}

// ---------- Utilities ----------

function getVisibleRect(el) {
  try {
    const r = el.getBoundingClientRect();
    if (r.width === 0 && r.height === 0) return null;
    return r;
  } catch { return null; }
}

// Collect candidate answer buttons
function extractClickableAnswers() {
  const selector = '[role="button"], button, [role="option"], [data-answer]';
  return Array.from(document.querySelectorAll(selector))
    .map(el => ({ el, text: el.innerText || el.getAttribute("aria-label") || "" }))
    .filter(a => a.text && a.text.length > 1);
}

// Try to extract question normally (ARIA/DOM)
function extractQuestionDOM(answers) {
  if (!answers || !answers.length) return null;
  const answersTop = Math.min(...answers.map(a => getVisibleRect(a.el)?.top || Infinity));
  const nodes = document.body.querySelectorAll("*");
  for (let node of nodes) {
    const rect = getVisibleRect(node);
    if (rect && rect.top < answersTop && node.innerText && node.innerText.trim().endsWith("?")) {
      return node.innerText.trim();
    }
  }
  return null;
}

// ---------- OCR Fallback ----------

async function extractQuestionOCR(answers) {
  await loadTesseract();
  // determine bounding box: try to capture top ~30% of viewport
  const canvas = document.createElement("canvas");
  const vw = window.innerWidth;
  const vh = window.innerHeight;
  canvas.width = vw * 2; // upscale for better OCR
  canvas.height = vh * 2;
  const ctx = canvas.getContext("2d");
  // draw visible page (use html2canvas-like approach)
  try {
    ctx.scale(2,2);
    ctx.drawWindow
  } catch (e) {
    // fallback: take screenshot of window
  }

  // Instead, simple approach: use html2canvas library for full OCR
  if (!window.html2canvas) {
    await new Promise(r => {
      const s = document.createElement("script");
      s.src = "https://cdn.jsdelivr.net/npm/html2canvas@1.4.1/dist/html2canvas.min.js";
      s.onload = r;
      document.head.appendChild(s);
    });
  }

  const div = document.body;
  const screenshot = await html2canvas(div, { scale: 2 });
  const dataURL = screenshot.toDataURL("image/png");

  const { data: { text } } = await Tesseract.recognize(dataURL, "eng", { logger: m => console.log(m) });
  return text.trim();
}

// ---------- Main ----------

async function explain() {
  const answers = extractClickableAnswers();
  if (!answers || answers.length < 2) return alert("No answer buttons detected.");

  let question = extractQuestionDOM(answers);

  if (!question || question.length < 5) {
    // OCR fallback
    question = await extractQuestionOCR(answers);
    if (!question || question.length < 5) {
      return alert("❌ Could not detect question, even with OCR.");
    }
  }

  const prompt = `
You are a reading comprehension tutor.

Explain which answer is most likely correct and why.
Do not instruct the user to click or submit.

QUESTION:
${question}

OPTIONS:
${answers.map((a,i)=>`${String.fromCharCode(65+i)}. ${a.text}`).join("\n")}
`;

  GM_xmlhttpRequest({
    method: "POST",
    url: OPENROUTER_URL,
    headers: {
      "Authorization": `Bearer ${OPENROUTER_API_KEY}`,
      "Content-Type": "application/json"
    },
    data: JSON.stringify({
      model: MODEL,
      messages: [{ role: "user", content: prompt }],
      temperature: 0.2
    }),
    onload: res => {
      try {
        const data = JSON.parse(res.responseText);
        alert(data.choices[0].message.content);
      } catch { alert("AI response error."); }
    },
    onerror: () => alert("Network error contacting AI service.")
  });
}

// ---------- UI ----------

function createButton() {
  if (document.getElementById("ai-explain-btn")) return;
  const btn = document.createElement("button");
  btn.id = "ai-explain-btn";
  btn.textContent = "Explain with AI";
  btn.style.position = "fixed";
  btn.style.left = "12px";
  btn.style.top = "12px";
  btn.style.zIndex = 999999;
  btn.style.padding = "8px 10px";
  btn.style.borderRadius = "6px";
  btn.style.background = "white";
  btn.style.boxShadow = "0 2px 6px rgba(0,0,0,0.15)";
  btn.style.cursor = "pointer";
  btn.onclick = explain;
  document.body.appendChild(btn);
}

// ---------- Init ----------

createButton();