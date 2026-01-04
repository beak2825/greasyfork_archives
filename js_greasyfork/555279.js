// ==UserScript==
// @name         Един Фиш само 
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Замества съдържанието на div с клас egtd-s-h-100 на localhost със зададен HTML блок
// @author       GPT
// @match        https://winbet.bg/sports*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/555279/%D0%95%D0%B4%D0%B8%D0%BD%20%D0%A4%D0%B8%D1%88%20%D1%81%D0%B0%D0%BC%D0%BE.user.js
// @updateURL https://update.greasyfork.org/scripts/555279/%D0%95%D0%B4%D0%B8%D0%BD%20%D0%A4%D0%B8%D1%88%20%D1%81%D0%B0%D0%BC%D0%BE.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 🔹 Новият HTML, който искаш да поставиш (вече със сумите на един ред)
    const newHTML = `<div class="egtd-s-h-100">
  <div class="bet-item__list egtd-s-h-100 overflow-auto egtd-custom-scrollbars">



    <!-- 🟩 Първи елемент -->
    <div class="bet-item__wrapper">
      <div class="bet-item">
        <div class="bet-item__header" style="display:flex;justify-content:space-between;align-items:center;flex-wrap:nowrap;">

          <!-- Лява част -->
          <div class="egtd-flex-ac mw-0 cursor-pointer bet-item__header-col bet-item__header-col--left" data-qid="co-btn-1" style="flex:1;min-width:0;">
            <svg viewBox="0 0 24 24"
              class="sc-dsy3en-0 iBknIj egtd-s-mr-2 egtd-s-status-icon egtd-s-status-icon--lg egtd-s-status-icon--positive color--success">
              <use href="#check-solid" />
            </svg>
            <div class="egtd-flex-col egtd-s-pr-1 mw-0">
              <div class="_1WtnK">Двойни
                <div class="NSVB1 QS4O7">
                  <div class="pMqKT HQlz- d6i2w">
                    490.00<span class="OCFRS vener">лв</span> / 250.54<span class="OCFRS vener">€</span>
                  </div>
                </div>
              </div>
              <div class="text-truncate bet-item__text--secondary" title="Нюелс Олд Бойс, 1:0">Нюелс Олд Бойс, 1:0</div>
              <span class="bet-item__text--date">12:21 ч. 08.11.2025 г.</span>
            </div>
          </div>

          <!-- Дясна част (бутон Печалба) -->
          <egtd-s-btn role="button" class="bet-button" is-disabled="true" c-size="md" c-variant="secondary"
            style="white-space:nowrap;flex-shrink:0;margin-right:0.5px;">
            <div class="-HcuO">Печалба
              <div class="NSVB1 QS4O7">
                <div class="pMqKT HQlz- d6i2w egtd-s-ml-1">
                  14100.00<span class="OCFRS vener">лв</span><br> / 7209.51<span class="OCFRS vener">€</span>
                </div>
              </div>
            </div>
          </egtd-s-btn>
        </div>
      </div>
    </div>

    <!-- 🟦 Втори елемент -->
    <div class="bet-item__wrapper">
      <div class="bet-item">
        <div class="bet-item__header" style="display:flex;justify-content:space-between;align-items:center;flex-wrap:nowrap;">

          <!-- Лява част -->
          <div class="egtd-flex-ac mw-0 cursor-pointer bet-item__header-col bet-item__header-col--left" data-qid="co-btn-2" style="flex:1;min-width:0;">
            <svg viewBox="0 0 24 24"
              class="sc-dsy3en-0 iBknIj egtd-s-mr-2 egtd-s-status-icon egtd-s-status-icon--lg egtd-s-status-icon--positive color--success">
              <use href="#check-solid" />
            </svg>
            <div class="egtd-flex-col egtd-s-pr-1 mw-0">
              <div class="_1WtnK">Двойни
                <div class="NSVB1 QS4O7">
                  <div class="pMqKT HQlz- d6i2w">
                    490.00<span class="OCFRS vener">лв</span> / 250.54<span class="OCFRS vener">€</span>
                  </div>
                </div>
              </div>
              <div class="text-truncate bet-item__text--secondary" title="Нюелс Олд Бойс, 1:0">Нюелс Олд Бойс, 1:0</div>
              <span class="bet-item__text--date">12:21 ч. 08.11.2025 г.</span>
            </div>
          </div>

          <!-- Дясна част (бутон Печалба) -->
          <egtd-s-btn role="button" class="bet-button" is-disabled="true" c-size="md" c-variant="secondary"
            style="white-space:nowrap;flex-shrink:0;margin-right:0.5px;">
            <div class="-HcuO">Печалба
              <div class="NSVB1 QS4O7">
                <div class="pMqKT HQlz- d6i2w egtd-s-ml-1">
                  14100.00<span class="OCFRS vener">лв</span><br> / 7209.51<span class="OCFRS vener">€</span>
                </div>
              </div>
            </div>
          </egtd-s-btn>
        </div>
      </div>
    </div>

  </div>
</div>`;

    // 🔹 HTML на разширения елемент (вече със сумите на един ред)
    const expandedHTML = `<div class="bet-item__wrapper">
	<div class="bet-item bet-item--open">
		<div class="egtd-flex-col bet-item__header overflow-hidden">
			<div class="egtd-flex-jb">
				<div class="egtd-flex-ac mw-0 cursor-pointer bet-item__header-col bet-item__header-col--left " data-qid="co-btn-1">
					<svg viewBox="0 0 24 24" class="sc-dsy3en-0 iBknIj egtd-s-mr-2 egtd-s-status-icon egtd-s-status-icon--lg egtd-s-status-icon--positive color--success">
						<use href="#check-solid"/>
					</svg>
					<div class="egtd-flex-col egtd-s-pr-1 mw-0">
						<div class="_1WtnK">Сингъл
							<div class="NSVB1 QS4O7">
								<div class="pMqKT HQlz- d6i2w">800.00<span class="OCFRS vener">лв</span> / 409.05<span class="OCFRS vener">€</span></div>
							</div>
						</div>
						<div class="text-truncate bet-item__text--secondary" title="" style="will-change: auto; opacity: 0; height: 0px;">3:1</div>
						<span class="bet-item__text--date">18:28 ч. 08.11.2025 г.</span>
					</div>
				</div>
				<div class="egtd-flex-col-ac justify-content-between position-relative bet-item__header-col" title="" style="will-change: auto; transform: translateX(200%);">
					<egtd-s-btn role="button" class="egtd-s-my-auto egtd-s-w-100" is-disabled="true" c-size="md" c-variant="secondary">
						<div class="-HcuO">Печалба
							<div class="NSVB1 QS4O7">
								<div class="pMqKT HQlz- d6i2w egtd-s-ml-1">9200.00<span class="OCFRS vener">лв</span> / 4704.08<span class="OCFRS vener">€</span></div>
							</div>
						</div>
					</egtd-s-btn>
				</div>
			</div>
		</div>

            <div class="_6TnS6 bi-sel">
                <div class="_5Wd9T">
                    <span class="D3BD6">3:1</span>
                    <div class="AwxPM">
                        <span class="BNLYO">11.50</span>
                        <span class="egtd-s-badge egtd-s-badge-selection-status egtd-s-badge-selection-status--positive">
                            <svg viewBox="0 0 24 24" class="sc-dsy3en-0 iBknIj egtd-s-mr-1 egtd-s-status-icon egtd-s-status-icon--md egtd-s-status-icon--positive color--success">
                                <use href="#check-solid"/>
                            </svg>Печалба
                        </span>
                    </div>
                </div>
                <div class="_2Okni">
                    <div class="tlLw1">Точен Резултат</div>
                    <div class="egtd-flex-ac">
                        <img draggable="false" class="egtd-s-spico egtd-s-spico--betslip" src="https://wbbgcdn.kubdev.com/cdn-cgi/image/fit=contain,width=60,height=60,,format=auto/sport-content/sport-icons/1001.svg">
                        <span class="WXm9U">Тигрес УАНЛ  <strong>3</strong> : <strong>1</strong> Атл. Сан Луис</span>
                    </div>
                    <span class="flex-shrink-0">01:00 ч. 09.11.2025 г.</span>
                </div>
            </div>

            <div class="bet-item__summary">
                <div class="egtd-flex-col bet-item__summary-header">
                    <div>Сингъл, 1 залог ×<br>
                        <div class="NSVB1 QS4O7">
                            <div class="pMqKT HQlz- d6i2w egtd-s-ml-1">800.00<span class="OCFRS">лв</span> / 409.05<span class="OCFRS">€</span></div>
                        </div>
                    </div>
                    <span class="egtd-s-mt-1 bet-item__text--ticket-number">№14321098767845562216</span>
                </div>
                <div class="bet-item__summary-body ">
                    <div class="egtd-s-py-1">Залог
                        <div class="NSVB1 QS4O7"><br>
                            <div class="pMqKT HQlz- d6i2w egtd-s-ml-1">800.00<span class="OCFRS">лв</span> / 409.05<span class="OCFRS">€</span></div>
                        </div>
                    </div>
                    <div class="egtd-flex-jb">
                        <div class="egtd-s-py-1">Печалба:
                            <div class="NSVB1 QS4O7"><br>
                                <div class="pMqKT HQlz- d6i2w egtd-s-ml-1">9200.00<span class="OCFRS vener">лв</span> / 4704.08<span class="OCFRS vener">€</span></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
	</div>
	</div>`;

   // 🔹 CSS за по-бърза анимация + предотвратяване на пренасянето
const style = document.createElement('style');
style.textContent = `
    .slide-out {
        animation: slideOutRight 0.25s forwards;
    }
    @keyframes slideOutRight {
        to { transform: translateX(200%); opacity: 0; }
    }

    /* 🔹 Ново правило — сумите винаги на един ред */
    .NSVB1.QS4O7 .pMqKT {
        white-space: nowrap !important;
        display: inline-block !important;
    }

    /* За сигурност — премахваме неочаквани line-breaks */
    .NSVB1.QS4O7 {
        display: inline !important;
        white-space: nowrap !important;
    }
`;
document.head.appendChild(style);

    // 🔹 Функцията за замяна
    function replaceContent() {
        const target = document.querySelector('div.egtd-s-h-100');
        if (target) {
            target.outerHTML = newHTML;

            const firstBtn = document.querySelector('[data-qid="co-btn-1"]');
            const betButton = document.querySelector('.bet-button');

            if (firstBtn && betButton) {
                firstBtn.addEventListener('click', () => {
                    betButton.classList.add('slide-out');
                    setTimeout(() => {
                        const wrapper = firstBtn.closest('.bet-item__wrapper');
                        wrapper.outerHTML = expandedHTML;
                    }, 50);
                });
            }

            console.log("✅ egtd-s-h-100 replaced successfully.");
            observer.disconnect();
        }
    }

    // 🔹 Наблюдение на DOM
    const observer = new MutationObserver(() => replaceContent());
    observer.observe(document.documentElement, { childList: true, subtree: true });

    // 🔹 Ако елементът вече е наличен
    if (document.readyState === 'interactive' || document.readyState === 'complete') {
        replaceContent();
    } else {
        document.addEventListener('DOMContentLoaded', replaceContent);
    }
})();