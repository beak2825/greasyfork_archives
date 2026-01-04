// ==UserScript==
// @name         AI Giải Bài Tập
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  AI studio
// @author       Tran Bao Ngoc
// @match        https://*/*
// @grant        GM_xmlhttpRequest
// @grant        GM_addStyle
// @grant        GM_setValue
// @grant        GM_getValue
// @connect      generativelanguage.googleapis.com
// @require      https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js
// @downloadURL https://update.greasyfork.org/scripts/552274/AI%20Gi%E1%BA%A3i%20B%C3%A0i%20T%E1%BA%ADp.user.js
// @updateURL https://update.greasyfork.org/scripts/552274/AI%20Gi%E1%BA%A3i%20B%C3%A0i%20T%E1%BA%ADp.meta.js
// ==/UserScript==

(async function() {
'use strict';

let GEMINI_API_KEY = GM_getValue('geminiApiKey', "");

// === UI Tối Giản Nhỏ Gọn ===
const ui = document.createElement('div');
ui.id = 'aiPanel';
ui.innerHTML = `
  <div class="ai-header">
    <h2>Trần Bảo Ngọc</h2>
    <div id="aiStatus">Ready</div>
  </div>
  <div id="apiKeySection">
    <label>API Key Gemini</label>
    <input type="password" id="apiKeyInput" value="${GEMINI_API_KEY}" placeholder="Nhập API key của bạn..." />
  </div>
  <button id="changeApiBtn" style="display:none; width: 100%; margin-bottom: 8px;">Thay đổi Key</button>
  <div class="ai-selects">
    <select id="modelSelect">
      <option value="gemini-flash-latest">⚡️ Flash</option>
      <option value="gemini-2.5-pro">✨ Pro 2.5</option>
    </select>
    <select id="lang"><option value="vi">VI</option><option value="en">EN</option></select>
    <select id="subject">
      <option>Toán</option><option>Lý</option><option>Hóa</option><option>Sinh</option><option>Sử</option><option>Địa</option><option>Văn</option><option>Anh</option><option>GDCD</option><option>Tin học</option>
    </select>
  </div>
   <div class="ai-selects">
    <select id="outputMode" style="width:100%">
      <option value="answer">Chỉ đáp án</option>
      <option value="explain">Giải thích chi tiết</option>
      <option value="custom">Tùy chỉnh...</option>
    </select>
  </div>
  <div id="customPromptSection" style="display:none; margin-bottom: 8px;">
    <label>Yêu cầu tùy chỉnh</label>
    <textarea id="customPromptInput" rows="3" placeholder="Ví dụ: Tóm tắt nội dung trong ảnh..."></textarea>
  </div>

  <div class="ai-actions">
    <button id="btnShot" disabled>📸 Kéo vùng</button>
    <button id="btnFullPage" disabled>📄 Toàn trang</button>
  </div>
  <button id="btnToggleTextMode" class="text-mode-btn" disabled>📝 Nhập câu hỏi</button>

  <div id="textInputSection" style="display: none; margin-top: 8px;">
     <label>Nhập câu hỏi của bạn vào đây</label>
     <textarea id="textQuestionInput" rows="4" placeholder="Ví dụ: Trình bày vai trò của quang hợp..."></textarea>
     <button id="btnSendTextQuestion" style="width:100%; margin-top: 4px;">Gửi câu hỏi</button>
  </div>

  <div class="ai-box">
    <label>Ảnh</label>
    <div id="imgBox"></div>
  </div>
  <div class="ai-box">
    <label>Đáp án</label>
    <div id="ansBox"></div>
  </div>
`;
document.body.appendChild(ui);


// === Lấy các phần tử DOM ===
const apiKeyInput = document.getElementById('apiKeyInput');
const apiKeySection = document.getElementById('apiKeySection');
const changeApiBtn = document.getElementById('changeApiBtn');
const aiStatus = document.getElementById('aiStatus');
const btnShot = document.getElementById('btnShot');
const btnFullPage = document.getElementById('btnFullPage');
const btnToggleTextMode = document.getElementById('btnToggleTextMode');
const textInputSection = document.getElementById('textInputSection');
const textQuestionInput = document.getElementById('textQuestionInput');
const btnSendTextQuestion = document.getElementById('btnSendTextQuestion');
const outputModeSelect = document.getElementById('outputMode');
const customPromptSection = document.getElementById('customPromptSection');
const customPromptInput = document.getElementById('customPromptInput');
const allActionButtons = [btnShot, btnFullPage, btnToggleTextMode];


// === Hàm Gửi Yêu Cầu Đến Gemini (Đã cập nhật) ===
function sendToGemini(prompt, base64Image = null) {
    const model = document.getElementById('modelSelect').value;
    const ansBox = document.getElementById('ansBox');
    const imgBox = document.getElementById('imgBox');

    ansBox.innerHTML = "⏳ Đang gửi đến Gemini...";
    ansBox.classList.add('loading');

    let parts = [{ text: prompt }];
    if (base64Image) {
        parts.push({ inlineData: { mimeType: "image/jpeg", data: base64Image } });
    }

    GM_xmlhttpRequest({
      method: "POST",
      url: `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${GEMINI_API_KEY}`,
      headers: { "Content-Type": "application/json" },
      data: JSON.stringify({
        contents: [{ parts: parts }],
        generationConfig: { "temperature": 0.2, "topP": 0.95, "topK": 40 }
      }),
      onload: r => {
        ansBox.classList.remove('loading');
        try {
          const data = JSON.parse(r.responseText);
          if (data.error) throw new Error(data.error.message);
          const result = data?.candidates?.[0]?.content?.parts?.[0]?.text || "❌ Không nhận được phản hồi.";
          
          // *** THAY ĐỔI: Ẩn ảnh khi nhận được câu trả lời ***
          if (base64Image) {
              imgBox.innerHTML = '';
          }

          typeEffect(ansBox, result.trim());
        } catch (err) {
          ansBox.innerHTML = `<b style="color:red;">Lỗi API:</b> ${err.message || "Kiểm tra F12 > Console để biết thêm chi tiết"}`;
          console.error("Lỗi Gemini:", r.responseText);
        }
      },
      onerror: err => {
        ansBox.classList.remove('loading');
        ansBox.innerHTML = `<b style="color:red;">Lỗi request:</b> ${JSON.stringify(err)}`;
      }
    });
}


// === Hàm tạo Prompt ===
function createPrompt(isImage = true) {
    const subj = document.getElementById('subject').value;
    const lang = document.getElementById('lang').value;
    const mode = document.getElementById('outputMode').value;
    const langStr = lang === 'vi' ? 'Tiếng Việt' : 'English';
    const source = isImage ? 'trong ảnh' : 'được cung cấp';

    if (mode === 'custom') {
        const customText = customPromptInput.value.trim();
        if (!customText) {
             document.getElementById('ansBox').innerHTML = '<b style="color:red;">Lỗi:</b> Vui lòng nhập yêu cầu tùy chỉnh của bạn.';
            return null;
        }
        return `${customText} (Trả lời bằng ${langStr})`;
    } else if (mode === 'answer') {
        return `Với bài tập môn ${subj} ${source}, chỉ đưa ra đáp án cuối cùng. Không giải thích. Không dùng markdown. Trả lời bằng ${langStr}.`;
    } else { // 'explain'
        return `Phân tích và giải chi tiết bài tập môn ${subj} ${source}. Suy nghĩ từng bước, đưa ra công thức và lời giải rõ ràng. Trả lời bằng ${langStr}.`;
    }
}


// === Hàm kiểm tra API Key ===
function checkApiKey(key) {
  if (!key) {
    aiStatus.textContent = 'Vui lòng nhập API Key';
    aiStatus.style.color = '#e74c3c';
    allActionButtons.forEach(b => b.disabled = true);
    apiKeySection.style.display = 'block';
    changeApiBtn.style.display = 'none';
    return;
  }

  aiStatus.textContent = '🔄 Đang kiểm tra key...';
  aiStatus.style.color = '#f1c40f';
  allActionButtons.forEach(b => b.disabled = true);


  GM_xmlhttpRequest({
    method: "POST",
    url: `https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent?key=${key}`,
    headers: { "Content-Type": "application/json" },
    data: JSON.stringify({ contents: [{ parts: [{ text: "hi" }] }] }),
    onload: function(response) {
      if (response.status === 200) {
        try {
            const data = JSON.parse(response.responseText);
            if (data.candidates) {
                aiStatus.textContent = '✅ Key hợp lệ';
                aiStatus.style.color = '#00b894';
                GEMINI_API_KEY = key;
                GM_setValue('geminiApiKey', key);
                apiKeySection.style.display = 'none';
                changeApiBtn.style.display = 'block';
                allActionButtons.forEach(b => b.disabled = false);
            } else { throw new Error("Invalid response"); }
        } catch (e) {
            aiStatus.textContent = '❌ Key không hợp lệ.';
            aiStatus.style.color = '#e74c3c';
            allActionButtons.forEach(b => b.disabled = true);
            apiKeySection.style.display = 'block';
            changeApiBtn.style.display = 'none';
        }
      } else {
        aiStatus.textContent = '❌ Key không hợp lệ/hết hạn';
        aiStatus.style.color = '#e74c3c';
        allActionButtons.forEach(b => b.disabled = true);
        apiKeySection.style.display = 'block';
        changeApiBtn.style.display = 'none';
      }
    },
    onerror: function(error) {
      aiStatus.textContent = ' Lỗi mạng khi kiểm tra key';
      aiStatus.style.color = '#e74c3c';
      allActionButtons.forEach(b => b.disabled = true);
    }
  });
}

// === Hàm xử lý chụp ảnh ===
async function handleScreenshot(options = {}) {
  const imgBox = document.getElementById('imgBox');
  const ansBox = document.getElementById('ansBox');
  imgBox.innerHTML = "🕐 Đang chụp ảnh...";
  ansBox.innerHTML = "";

  try {
    // Luôn cuộn lên đầu trang để đảm bảo chụp từ đầu khi chụp toàn trang
    if (!options.x && !options.y) {
       window.scrollTo(0, 0);
    }
    const canvas = await html2canvas(document.body, {
      ...options,
      scale: 1.5,
      useCORS: true,
      allowTaint: true
    });

    const base64 = canvas.toDataURL('image/jpeg', 0.9).split(',')[1];
    imgBox.innerHTML = `<img src="${canvas.toDataURL()}">`;
    const prompt = createPrompt(true);
    if (prompt) {
        sendToGemini(prompt, base64);
    }
  } catch (err) {
    imgBox.innerHTML = `<b style="color:red;">❌ Lỗi chụp ảnh:</b> ${err.message}`;
    ansBox.innerHTML = '';
  }
}


// === Xử lý sự kiện ===
apiKeyInput.addEventListener('blur', () => checkApiKey(apiKeyInput.value.trim()));

changeApiBtn.addEventListener('click', () => {
  apiKeySection.style.display = 'block';
  changeApiBtn.style.display = 'none';
  apiKeyInput.focus();
  allActionButtons.forEach(b => b.disabled = true);
  aiStatus.textContent = "Nhập key mới và click ra ngoài";
  aiStatus.style.color = "#f1c40f";
});

outputModeSelect.addEventListener('change', () => {
    customPromptSection.style.display = (outputModeSelect.value === 'custom') ? 'block' : 'none';
});

btnToggleTextMode.addEventListener('click', () => {
    const isVisible = textInputSection.style.display === 'block';
    textInputSection.style.display = isVisible ? 'none' : 'block';
});

btnSendTextQuestion.addEventListener('click', () => {
    const question = textQuestionInput.value.trim();
    if (!question) {
        document.getElementById('ansBox').innerHTML = '<b style="color:red;">Lỗi:</b> Vui lòng nhập câu hỏi.';
        return;
    }
    const prompt = createPrompt(false);
    if (prompt) {
        const fullPrompt = `Câu hỏi: "${question}".\n\n${prompt}`;
        document.getElementById('imgBox').innerHTML = "";
        sendToGemini(fullPrompt, null);
    }
});


// === CSS ===
GM_addStyle(`
#aiPanel {
  position: fixed; top: 30px; left: 30px; width: 280px; background: #1e1e1e;
  color: #fff; z-index: 999999; padding: 12px; border-radius: 8px; font-family: 'Segoe UI', sans-serif;
  box-shadow: 0 4px 12px rgba(0,0,0,0.3); display: none; cursor: move; font-size: 12px; border: 1px solid #333;
}
.ai-header { text-align: center; margin-bottom: 12px; border-bottom: 1px solid #333; padding-bottom: 8px; }
.ai-header h2 { margin: 0 0 4px; font-size: 14px; color: #00b894; }
#aiStatus { font-size: 10px; color: #aaa; min-height: 12px; }
#apiKeySection, .ai-selects, .ai-box, #customPromptSection, .ai-actions { margin-bottom: 8px; }
label { display: block; font-size: 11px; color: #ccc; margin-bottom: 4px; }
#apiKeyInput, textarea {
  width: 100%; box-sizing: border-box; padding: 6px; border: 1px solid #444; border-radius: 4px; background: #2a2a2a; color: #fff; font-size: 11px;
}
#apiKeyInput:focus, textarea:focus { outline: none; border-color: #00b894; }
textarea { resize: vertical; }
.ai-selects, .ai-actions { display: flex; gap: 4px; }
select, button { flex: 1; padding: 8px; border: 1px solid #444; border-radius: 4px; background: #2a2a2a; color: #fff; font-size: 11px; }
select:focus, button:focus { outline: none; border-color: #00b894; }
button { cursor: pointer; border: none; transition: background 0.2s ease; }
button:disabled { background: #555 !important; cursor: not-allowed; opacity: 0.6; }
.ai-actions button { background: #00b894; }
.ai-actions button:hover:not(:disabled) { background: #009975; }
#btnToggleTextMode { width: 100%; background: #e67e22; margin-bottom: 4px; }
#btnToggleTextMode:hover:not(:disabled) { background: #d35400; }
#btnSendTextQuestion { background: #3498db; }
#btnSendTextQuestion:hover:not(:disabled) { background: #2980b9; }
#changeApiBtn { background: #3498db; }
#changeApiBtn:hover { background: #2980b9; }
.ai-box div { min-height: 40px; background: #2a2a2a; padding: 8px; border-radius: 4px; font-size: 11px; white-space: pre-wrap; word-wrap: break-word; border: 1px solid #444; }
#imgBox img { max-width: 100%; border-radius: 4px; }
#ansBox.loading::after { content: '⏳'; display: inline-block; animation: spin 1s linear infinite; margin-left: 5px; }
@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
#aiSnipOverlay { position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.6); z-index: 2147483647; display: none; cursor: crosshair; }
#aiSnipBox { position: absolute; border: 2px dashed #00b894; background: rgba(0,184,148,0.1); z-index: 2147483648; display: none; pointer-events: none; border-radius: 4px; }
`);

// === Kéo thả panel ===
let dragging = false, dragOffset = {x:0,y:0};
ui.addEventListener('mousedown', e => {
  if (!['INPUT', 'SELECT', 'BUTTON', 'TEXTAREA'].includes(e.target.tagName)) {
    dragging = true;
    dragOffset.x = e.clientX - ui.offsetLeft;
    dragOffset.y = e.clientY - ui.offsetTop;
  }
});
document.addEventListener('mousemove', e => { if (dragging) { ui.style.left = (e.clientX - dragOffset.x) + 'px'; ui.style.top = (e.clientY - dragOffset.y) + 'px'; } });
document.addEventListener('mouseup', () => { dragging = false; });

// === Toggle bằng ShiftRight ===
document.addEventListener('keydown', e => {
  if (e.code === 'ShiftRight') {
      ui.style.display = ui.style.display === 'none' ? 'block' : 'none';
      if(ui.style.display === 'block') { checkApiKey(GM_getValue('geminiApiKey', "")); }
  }
});

// === Overlay và Chụp ảnh ===
const overlay = document.createElement('div'); overlay.id = 'aiSnipOverlay'; document.body.appendChild(overlay);
const snipBox = document.createElement('div'); snipBox.id = 'aiSnipBox'; document.body.appendChild(snipBox);
let selecting = false, startX, startY, endX, endY;

btnShot.onclick = () => {
  selecting = true;
  overlay.style.display = 'block';
  ui.style.display = 'none';
};

// --- CHỤP TOÀN BỘ TRANG ---
btnFullPage.onclick = () => {
    ui.style.display = 'none'; // Ẩn panel trước khi chụp
    setTimeout(() => {
        handleScreenshot({}).finally(() => {
            ui.style.display = 'block'; // Hiện lại panel sau khi xong
        });
    }, 150);
};


overlay.addEventListener('mousedown', e => {
  if (!selecting) return;
  startX = e.clientX; startY = e.clientY;
  snipBox.style.left = startX + 'px'; snipBox.style.top = startY + 'px';
  snipBox.style.width = '0px'; snipBox.style.height = '0px';
  snipBox.style.display = 'block';
});

overlay.addEventListener('mousemove', e => {
  if (!selecting || startX === undefined) return;
  endX = e.clientX; endY = e.clientY;
  snipBox.style.left = Math.min(startX, endX) + 'px';
  snipBox.style.top = Math.min(startY, endY) + 'px';
  snipBox.style.width = Math.abs(endX - startX) + 'px';
  snipBox.style.height = Math.abs(endY - startY) + 'px';
});

overlay.addEventListener('mouseup', async e => {
  if (!selecting || startX === undefined) return;
  const left = Math.min(startX, endX);
  const top = Math.min(startY, endY);
  const width = Math.abs(endX - startX);
  const height = Math.abs(endY - startY);
  
  selecting = false;
  overlay.style.display = 'none';
  snipBox.style.display = 'none';
  ui.style.display = 'block';
  startX = startY = endX = endY = undefined;
  
  if (width < 10 || height < 10) return;

  handleScreenshot({ x: left, y: top, width: width, height: height });
});

// === Hiệu ứng gõ chữ ===
function typeEffect(el, text, speed = 10) {
  el.innerHTML = "";
  let i = 0;
  function typing() {
    if (i < text.length) {
      el.innerHTML += text.charAt(i++);
      setTimeout(typing, speed);
    }
  };
  typing();
}

// === Khởi chạy lần đầu ===
checkApiKey(GEMINI_API_KEY);

})();