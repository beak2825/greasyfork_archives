// ==UserScript==
// @name         Guía de resolución (educativa)
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Añade una guía paso a paso para resolver problemas matemáticos (no da respuestas). Útil para estudiar y aprender procedimientos.
// @author       ChatGPT
// @match        *://*/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/555029/Gu%C3%ADa%20de%20resoluci%C3%B3n%20%28educativa%29.user.js
// @updateURL https://update.greasyfork.org/scripts/555029/Gu%C3%ADa%20de%20resoluci%C3%B3n%20%28educativa%29.meta.js
// ==/UserScript==

(function() {
  'use strict';

  /* --- UI: botón flotante --- */
  const btn = document.createElement('button');
  btn.textContent = 'Guía de resolución';
  Object.assign(btn.style, {
    position: 'fixed', right: '10px', bottom: '10px', zIndex: 999999,
    padding: '8px 12px', borderRadius: '8px', border: 'none', cursor: 'pointer',
    background: '#2b79d6', color: 'white', boxShadow: '0 2px 6px rgba(0,0,0,0.2)'
  });
  document.body.appendChild(btn);

  /* --- Modal --- */
  function createModal() {
    const modal = document.createElement('div');
    Object.assign(modal.style, {
      position: 'fixed', left: 0, top: 0, width: '100%', height: '100%', zIndex: 1000000,
      background: 'rgba(0,0,0,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center'
    });
    const card = document.createElement('div');
    Object.assign(card.style, {
      width: 'min(900px, 96%)', maxHeight: '90%', overflowY: 'auto', background: 'white', padding: '18px',
      borderRadius: '10px', boxShadow: '0 8px 30px rgba(0,0,0,0.2)'
    });
    modal.appendChild(card);

    const close = document.createElement('button');
    close.textContent = 'Cerrar';
    Object.assign(close.style, {float: 'right', marginBottom: '10px'});
    close.onclick = () => modal.remove();
    card.appendChild(close);

    const title = document.createElement('h2');
    title.textContent = 'Guía de resolución — pasos y recordatorios';
    card.appendChild(title);

    const inputLabel = document.createElement('p');
    inputLabel.textContent = 'Selecciona el enunciado en la página y luego pulsa "Analizar", o pega el enunciado abajo:';
    card.appendChild(inputLabel);

    const textarea = document.createElement('textarea');
    Object.assign(textarea.style, {width: '100%', height: '80px', marginBottom: '10px'});
    card.appendChild(textarea);

    const analyzeBtn = document.createElement('button');
    analyzeBtn.textContent = 'Analizar';
    Object.assign(analyzeBtn.style, {marginRight: '8px'});
    card.appendChild(analyzeBtn);

    const autoHint = document.createElement('div');
    autoHint.style.marginTop = '12px';
    card.appendChild(autoHint);

    analyzeBtn.onclick = () => {
      const text = (window.getSelection().toString().trim()) || textarea.value.trim();
      if (!text) {
        autoHint.innerHTML = '<em>Primero selecciona o pega el enunciado del problema.</em>';
        return;
      }
      const type = detectType(text);
      autoHint.innerHTML = renderGuide(type, text);
    };

    return modal;
  }

  btn.onclick = () => {
    const modal = createModal();
    document.body.appendChild(modal);
  };

  /* --- Detección simple del tipo de problema --- */
  function detectType(s) {
    const t = s.toLowerCase();
    if (/[0-9]\s*x\^?2|x\^2|quadratic|square|cuadr/i.test(t) || /x\s*\^?\s*2/.test(t)) return 'cuadratica';
    if (/[0-9]\s*x|solve for x|ecuación|=/.test(t) && !/x\^2/.test(t)) return 'lineal';
    if (/\barea\b|perimeter|área|perímetro|cm|m2|m²/.test(t)) return 'area';
    if (/%|por ciento|percent|percentage/.test(t)) return 'porcentaje';
    return 'general';
  }

  /* --- Render de pasos (NO CALCULA) --- */
  function renderGuide(type, text) {
    let html = `<strong>Enunciado detectado:</strong> <div style="margin:6px 0;padding:8px;background:#f6f8fb;border-radius:6px;">${escapeHtml(text)}</div>`;
    html += '<h3>Pasos recomendados</h3><ol>';
    if (type === 'cuadratica') {
      html += '<li>Identifica la forma: ax² + bx + c = 0.</li>';
      html += '<li>Si es posible, divide entre el coeficiente principal a para simplificar.</li>';
      html += '<li>Intenta factorizar: busca dos números que multiplicados den a·c y sumados den b.</li>';
      html += '<li>Si no factoriza, usa la <strong>fórmula cuadrática</strong> (solo escribe la fórmula y aplica con cuidado): x = (-b ± √(b² - 4ac)) / (2a).</li>';
      html += '<li>Comprueba las raíces sustituyéndolas en la ecuación original.</li>';
    } else if (type === 'lineal') {
      html += '<li>Expande y simplifica ambos lados si hay paréntesis.</li>';
      html += '<li>Agrupa términos con la variable a un lado y constantes al otro.</li>';
      html += '<li>Divide por el coeficiente de la variable para aislarla.</li>';
      html += '<li>Verifica substituyendo la solución en la ecuación original.</li>';
    } else if (type === 'area') {
      html += '<li>Identifica la figura (rectángulo, triángulo, círculo, trapecio, etc.).</li>';
      html += '<li>Escribe la fórmula correspondiente (ej.: rectángulo A = base·altura, triángulo A = (base·altura)/2, círculo A = πr²).</li>';
      html += '<li>Asegúrate de que las unidades sean consistentes y convierte si es necesario.</li>';
      html += '<li>Aplica la fórmula paso a paso y escribe la respuesta con unidades.</li>';
    } else if (type === 'porcentaje') {
      html += '<li>Identifica si el problema pide: porcentaje de un número, porcentaje de aumento/disminución, o qué porcentaje representa una parte del todo.</li>';
      html += '<li>Convierte el porcentaje a decimal (p. ej. 25% → 0.25) y aplica multiplicación o regla de tres según corresponda.</li>';
      html += '<li>Interpreta el resultado y verifica con estimaciones rápidas.</li>';
    } else {
      html += '<li>Lee con atención: subraya datos importantes (números, unidades, lo que piden).</li>';
      html += '<li>Relaciónalo con fórmulas conocidas o convierte a ecuaciones.</li>';
      html += '<li>Resuelve paso a paso y verifica tu respuesta.</li>';
    }
    html += '</ol>';
    html += '<h4>Recordatorios</h4><ul>';
    html += '<li>Revisa la aritmética y las unidades.</li>';
    html += '<li>Si algo no cuadra, rehace los pasos lentamente y comprueba sustituciones.</li>';
    html += '<li>Explica cada paso en voz alta o escríbelo —ayuda a entender mejor.</li>';
    html += '</ul>';
    html += '<div style="margin-top:10px;font-size:0.9em;color:#555">Este asistente <em>no</em> muestra respuestas finales. Está diseñado para ayudarte a aprender el procedimiento y practicar soluciones propias.</div>';
    return html;
  }

  function escapeHtml(str) {
    return str.replace(/[&<>"']/g, function(m){ return ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]); });
  }

})();