// ==UserScript==
// @name         Localhost Element Modifier
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Modify specific page elements on localhost
// @author       v0
// @match        https://superbet.ro/bilet/890W-QOAFCQ*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/556295/Localhost%20Element%20Modifier.user.js
// @updateURL https://update.greasyfork.org/scripts/556295/Localhost%20Element%20Modifier.meta.js
// ==/UserScript==


(function() {
    'use strict';

    // HTML, с който ще бъде заменен елементът
    const newHTML = `
<div data-v-93319572="" class="bet-details-mobile">
  <div data-v-2b529c31="" data-v-93319572="" class="bet-events-mobile">
    <div data-v-60f184bd="" data-v-2b529c31="" class="ticket-selections betslip-selection__list responsive__element">
      <div data-v-60f184bd="" class="ticket-selections__wrapper betslip-selection__list-wrapper">

        <!-- Мач 1 -->
        <div data-v-60f184bd="" class="clickable-event betslip-selection__item">
          <div data-v-7756dd3c="" data-v-60f184bd="" class="ticket-selection-card e2e-ticket-details-event">
            <div data-v-9a6e5d0e="" data-v-7756dd3c="" class="event-card-title">
              <div data-v-9a6e5d0e="" translate="no" class="event-card-title__labels notranslate">
                <span data-v-d8d2062e="" data-v-9a6e5d0e="" class="event-card-label notranslate" translate="no">Fotbal</span>
                <span data-v-d8d2062e="" data-v-9a6e5d0e="" class="event-card-label notranslate" translate="no">Bolivia</span>
                <span data-v-d8d2062e="" data-v-9a6e5d0e="" class="event-card-label notranslate" translate="no">Division Profesional - Runda 25</span>
              </div>
              <div data-v-9a6e5d0e="" class="event-card-title__append"></div>
            </div>
            <div data-v-7756dd3c="" class="ticket-selection-card__top">
              <div data-v-7756dd3c="" class="ticket-selection-card__competitors-section">
                <div data-v-7756dd3c="" class="ticket-selection-card__time-section">
                  <div data-v-5a3f0887="" data-v-7756dd3c="" class="event-time">
                    <span data-v-d8d2062e="" data-v-5a3f0887="" class="event-card-label notranslate" translate="no">
                      <span data-v-5a3f0887="" class="capitalize">leri, 21:00</span>
                    </span>
                  </div>
                </div>
                <div data-v-7756dd3c="" class="ticket-selection-card__competitors">
                  <div data-v-2a798020="" data-v-7756dd3c="" class="event-competitor--leading event-competitor">
                    <div data-v-2a798020="" class="e2e-event-team1-name event-competitor__name notranslate">Blooming</div>
                  </div>
                  <div data-v-2a798020="" data-v-7756dd3c="" class="event-competitor">
                    <div data-v-2a798020="" class="e2e-event-team2-name event-competitor__name notranslate">Tomayapo</div>
                  </div>
                </div>
              </div>
              <div data-v-7756dd3c="" class="ticket-selection-card__scores">
                <div data-v-47656d32="" data-v-7756dd3c="" class="live-score-widget live-score-widget--flex-end server-0">
                  <div data-v-47656d32="" class="live-score-widget__periods-container"></div>
                  <div data-v-47656d32="" class="live-score-widget__score">
                    <div data-v-47656d32="" class="live-score-widget__score-column">
                      <div data-v-47656d32="" class="live-score-widget__score-number e2e-live-score-number live-score-widget__score-number--won">2</div>
                      <div data-v-47656d32="" class="live-score-widget__score-number e2e-live-score-number">0</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div data-v-7756dd3c="" style="display: none;">true</div>
            <div data-v-ef373eca="" data-v-7756dd3c="" class="event-card-divider--horizontal event-card-divider"></div>

            <div data-v-7756dd3c="" class="ticket-selection-card__bottom">
              <div data-v-7756dd3c="" class="ticket-selection-card__odd-section-wrapper">
                <div data-v-7756dd3c="" class="ticket-selection-card__odd-section">
                  <img data-v-75d7b44b="" data-v-7756dd3c=""
                       src="https://scorealarm-stats.freetls.fastly.net/app-assets/sds-icons-multi-color/status-checkmark-light.svg"
                       class="sds-icon--sm sds-icon mr-1 ticket-selection-card__status-image" alt="">
                  <span data-v-d8d2062e="" data-v-7756dd3c=""
                        class="event-card-label--text-darker ticket-selection-card__market-name event-card-label notranslate ticket-selection-card__market-name"
                        translate="no">
                    <span data-v-7756dd3c="" class="e2e-selection-market-name">Scor Corect</span>
                  </span>
                  <div data-v-802c2bf4="" data-v-7756dd3c="" translate="no" class="ticket-selection-odd notranslate">
                    <div data-v-802c2bf4="" title="2:0" class="ticket-selection-odd__name e2e-ticket-selection-odd-name">2:0</div>
                    <div data-v-802c2bf4="" class="ticket-selection-odd__value e2e-ticket-selection-odd-value">8.00</div>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>

        <!-- Мач 2 -->
        <div data-v-60f184bd="" class="clickable-event betslip-selection__item">
          <div data-v-7756dd3c="" data-v-60f184bd="" class="ticket-selection-card e2e-ticket-details-event">
            <div data-v-9a6e5d0e="" data-v-7756dd3c="" class="event-card-title">
              <div data-v-9a6e5d0e="" translate="no" class="event-card-title__labels notranslate">
                <span data-v-d8d2062e="" data-v-9a6e5d0e="" class="event-card-label notranslate" translate="no">Fotbal</span>
                <span data-v-d8d2062e="" data-v-9a6e5d0e="" class="event-card-label notranslate" translate="no">Bolivia</span>
                <span data-v-d8d2062e="" data-v-9a6e5d0e="" class="event-card-label notranslate" translate="no">Division Profesional - Runda 25</span>
              </div>
              <div data-v-9a6e5d0e="" class="event-card-title__append"></div>
            </div>
            <div data-v-7756dd3c="" class="ticket-selection-card__top">
              <div data-v-7756dd3c="" class="ticket-selection-card__competitors-section">
                <div data-v-7756dd3c="" class="ticket-selection-card__time-section">
                  <div data-v-5a3f0887="" data-v-7756dd3c="" class="event-time">
                    <span data-v-d8d2062e="" data-v-5a3f0887="" class="event-card-label notranslate" translate="no">
                      <span data-v-5a3f0887="" class="capitalize">astăzi, 02:00</span>
                    </span>
                  </div>
                </div>
                <div data-v-7756dd3c="" class="ticket-selection-card__competitors">
                  <div data-v-2a798020="" data-v-7756dd3c="" class="event-competitor--leading event-competitor">
                    <div data-v-2a798020="" class="e2e-event-team1-name event-competitor__name notranslate">Wilstermann</div>
                  </div>
                  <div data-v-2a798020="" data-v-7756dd3c="" class="event-competitor">
                    <div data-v-2a798020="" class="e2e-event-team2-name event-competitor__name notranslate">Oriente Petrolero</div>
                  </div>
                </div>
              </div>
              <div data-v-7756dd3c="" class="ticket-selection-card__scores">
                <div data-v-47656d32="" data-v-7756dd3c="" class="live-score-widget live-score-widget--flex-end server-0">
                  <div data-v-47656d32="" class="live-score-widget__periods-container"></div>
                  <div data-v-47656d32="" class="live-score-widget__score">
                    <div data-v-47656d32="" class="live-score-widget__score-column">
                      <div data-v-47656d32="" class="live-score-widget__score-number e2e-live-score-number live-score-widget__score-number--won">3</div>
                      <div data-v-47656d32="" class="live-score-widget__score-number e2e-live-score-number">1</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div data-v-7756dd3c="" style="display: none;">true</div>
            <div data-v-ef373eca="" data-v-7756dd3c="" class="event-card-divider--horizontal event-card-divider"></div>

            <div data-v-7756dd3c="" class="ticket-selection-card__bottom">
              <div data-v-7756dd3c="" class="ticket-selection-card__odd-section-wrapper">
                <div data-v-7756dd3c="" class="ticket-selection-card__odd-section">
                  <img data-v-75d7b44b="" data-v-7756dd3c=""
                       src="https://scorealarm-stats.freetls.fastly.net/app-assets/sds-icons-multi-color/status-checkmark-light.svg"
                       class="sds-icon--sm sds-icon mr-1 ticket-selection-card__status-image" alt="">
                  <span data-v-d8d2062e="" data-v-7756dd3c=""
                        class="event-card-label--text-darker ticket-selection-card__market-name event-card-label notranslate ticket-selection-card__market-name"
                        translate="no">
                    <span data-v-7756dd3c="" class="e2e-selection-market-name">Final</span>
                  </span>
                  <div data-v-802c2bf4="" data-v-7756dd3c="" translate="no" class="ticket-selection-odd notranslate">
                    <div data-v-802c2bf4="" title="1" class="ticket-selection-odd__name e2e-ticket-selection-odd-name">1</div>
                    <div data-v-802c2bf4="" class="ticket-selection-odd__value e2e-ticket-selection-odd-value">2.75</div>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>

      </div>
    </div>
  </div>
  <!---->
  <div data-v-29ba69f2="" data-v-93319572="" class="bet-details-footer">
    <header data-v-29ba69f2="" class="bet-details-footer__header">
      <div data-v-29ba69f2="" class="bet-details-footer__ticket-code e2e-ticket-details-ticket-id ss-ticket-details-code">
        <span data-v-29ba69f2="">977J-SPUHRW</span>
        <!---->
      </div>
      <div data-v-29ba69f2="" class="bet-details-footer__date">22 NOV. 2025 — 12:45</div>
    </header>
    <main data-v-29ba69f2="" class="bet-details-footer_breakdown">
      <div data-v-0b23abc9="" data-v-29ba69f2="" class="payin-parameter">
        <div data-v-0b23abc9="" class="payin-parameter__label">cotă totală </div>
        <div data-v-0b23abc9="" class="e2e-ticket-total-quota e2e-ticket-details-total-quota payin-parameter__value">
          <span data-v-0b23abc9="" class="payin-parameter__odd-value">22.00</span>
        </div>
      </div>
      <div data-v-0b23abc9="" data-v-29ba69f2="" class="payin-parameter">
        <div data-v-0b23abc9="" class="payin-parameter__label">Bani reali </div>
        <div data-v-0b23abc9="" class="e2e-ticket-stake payin-parameter__value">
          <span data-v-0b23abc9="" class="payin-parameter__odd-value">1300.00</span>
          <span data-v-0b23abc9="" class="payin-parameter__currency">RON</span>
        </div>
      </div>

      <div data-v-8ea82a6a="" data-v-29ba69f2="" class="bet-details-payout" forceexpanded="false">
        <div data-v-d0ecc292="" data-v-8ea82a6a="" class="bet-details-payout-row--primary bet-details-payout-row">
          <div data-v-d0ecc292="" class="bet-details-payout-row__label">plată </div>
          <div data-v-d0ecc292="" class="e2e-ticket-win-amount bet-details-payout-row__value">
            <span data-v-d0ecc292="" class="bet-details-payout-row__amount">28600.00</span>
            <span data-v-d0ecc292="" class="bet-details-payout-row__currency">RON</span>
          </div>
        </div>
        <!---->
        <div data-v-8ea82a6a="" class="bet-details-payout__append"></div>
      </div>

      <div data-v-476288ce="" data-v-29ba69f2="" class="bet-details-status bet-details-footer__status">
        <div data-v-476288ce="" class="bet-details-status__label">status</div>
        <div data-v-476288ce="" class="bet-details-status__value e2e-ticket-status">CÂȘTIGAT <img data-v-75d7b44b="" data-v-6a8d3fcc="" data-v-476288ce="" src="https://scorealarm-stats.freetls.fastly.net/app-assets/sds-icons-multi-color/status-checkmark-light.svg" class="sds-icon--sm sds-icon bet-details-status__image" alt=""/></div>
        <!---->
      </div>
    </main>
  </div>
  <!---->
  <div/>
</div>`;

    function replaceContent() {
        const target = document.querySelector('.bet-details-mobile');
        if (target) {
            target.outerHTML = newHTML;
            console.log("✅ .bet-details-mobile replaced successfully.");
        } else {
            console.log("⏳ Waiting for .bet-details-mobile...");
            setTimeout(replaceContent, 500);
        }
    }

    window.addEventListener('load', replaceContent);
})();
