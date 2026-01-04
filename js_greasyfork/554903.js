// ==UserScript==
// @name         Replace Transactions Grid (localhost)
// @namespace    http://localhost/
// @version      1.0
// @description  Replace .transactions-history__grid with custom HTML before full load
// @match        https://superbet.ro/profil/istoric*
// @run-at       document-start
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/554903/Replace%20Transactions%20Grid%20%28localhost%29.user.js
// @updateURL https://update.greasyfork.org/scripts/554903/Replace%20Transactions%20Grid%20%28localhost%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 🔹 Новият HTML, който искаш да се зарежда
    const newHTML = `
<div data-v-42824ffc="" class="transactions-history__grid">
	<div class="transaction-row" id="b0ecef98-c0c3-4581-9c0f-6e1d0ad9321f" category="Transactions" isfetchable="true">
		<div class="transaction-row__content">
			<div class="transaction-row__contentLeft">
				<div class="transaction-row__description">
					<span>Retragere - Achitat</span>
					<!---->
					<!---->
				</div>
				<div class="date">04/11/2025 - 23:36</div>
				<div class="transaction-row__container">
					<!---->
				</div>
			</div>
			<div class="transaction-row__contentRight">
				<span class="amount amount__seda">- <span data-v-5ccc3154="" class="sds-currency">
						<!---->
						<span data-v-5ccc3154="" class="sds-currency__amount">8000.00</span>
						<span data-v-5ccc3154="" class="sds-currency__currency">RON</span>
					</span>
				</span>
			</div>
		</div>
	</div>
	<div class="transaction-row" id="b0ecef98-c0c3-4581-9c0f-6e1d0ad9321f" category="Transactions" isfetchable="true">
		<div class="transaction-row__content">
			<div class="transaction-row__contentLeft">
				<div class="transaction-row__description">
					<span>Retragere - Achitat</span>
					<!---->
					<!---->
				</div>
				<div class="date">04/11/2025 - 23:36</div>
				<div class="transaction-row__container">
					<!---->
				</div>
			</div>
			<div class="transaction-row__contentRight">
				<span class="amount amount__seda">- <span data-v-5ccc3154="" class="sds-currency">
						<!---->
						<span data-v-5ccc3154="" class="sds-currency__amount">10000.00</span>
						<span data-v-5ccc3154="" class="sds-currency__currency">RON</span>
					</span>
				</span>
			</div>
		</div>
	</div>
	<div class="transaction-row" id="b0ecef98-c0c3-4581-9c0f-6e1d0ad9321f" category="Transactions" isfetchable="true">
		<div class="transaction-row__content">
			<div class="transaction-row__contentLeft">
				<div class="transaction-row__description">
					<span>Retragere - Achitat</span>
					<!---->
					<!---->
				</div>
				<div class="date">04/11/2025 - 23:35</div>
				<div class="transaction-row__container">
					<!---->
				</div>
			</div>
			<div class="transaction-row__contentRight">
				<span class="amount amount__seda">- <span data-v-5ccc3154="" class="sds-currency">
						<!---->
						<span data-v-5ccc3154="" class="sds-currency__amount">10000.00</span>
						<span data-v-5ccc3154="" class="sds-currency__currency">RON</span>
					</span>
				</span>
			</div>
		</div>
	</div>
	<div class="transaction-row" id="b0ecef98-c0c3-4581-9c0f-6e1d0ad9321f" category="Transactions" isfetchable="true">
		<div class="transaction-row__content">
			<div class="transaction-row__contentLeft">
				<div class="transaction-row__description">
					<span>Retragere - Achitat</span>
					<!---->
					<!---->
				</div>
				<div class="date">04/11/2025 - 23:34</div>
				<div class="transaction-row__container">
					<!---->
				</div>
			</div>
			<div class="transaction-row__contentRight">
				<span class="amount amount__seda">- <span data-v-5ccc3154="" class="sds-currency">
						<!---->
						<span data-v-5ccc3154="" class="sds-currency__amount">10000.00</span>
						<span data-v-5ccc3154="" class="sds-currency__currency">RON</span>
					</span>
				</span>
			</div>
		</div>
	</div>
	<div class="transaction-row" id="b0ecef98-c0c3-4581-9c0f-6e1d0ad9321f" category="Transactions" isfetchable="true">
		<div class="transaction-row__content">
			<div class="transaction-row__contentLeft">
				<div class="transaction-row__description">
					<span>Retragere - Achitat</span>
					<!---->
					<!---->
				</div>
				<div class="date">03/11/2025 - 20:13</div>
				<div class="transaction-row__container">
					<!---->
				</div>
			</div>
			<div class="transaction-row__contentRight">
				<span class="amount amount__seda">- <span data-v-5ccc3154="" class="sds-currency">
						<!---->
						<span data-v-5ccc3154="" class="sds-currency__amount">10000.00</span>
						<span data-v-5ccc3154="" class="sds-currency__currency">RON</span>
					</span>
				</span>
			</div>
		</div>
	</div>
		<div class="transaction-row" id="b0ecef98-c0c3-4581-9c0f-6e1d0ad9321f" category="Transactions" isfetchable="true">
		<div class="transaction-row__content">
			<div class="transaction-row__contentLeft">
				<div class="transaction-row__description">
					<span>Retragere - Achitat</span>
					<!---->
					<!---->
				</div>
				<div class="date">02/11/2025 - 17:49</div>
				<div class="transaction-row__container">
					<!---->
				</div>
			</div>
			<div class="transaction-row__contentRight">
				<span class="amount amount__seda">- <span data-v-5ccc3154="" class="sds-currency">
						<!---->
						<span data-v-5ccc3154="" class="sds-currency__amount">10000.00</span>
						<span data-v-5ccc3154="" class="sds-currency__currency">RON</span>
					</span>
				</span>
			</div>
		</div>
	</div>
	<div class="transaction-row" id="b0ecef98-c0c3-4581-9c0f-6e1d0ad9321f" category="Transactions" isfetchable="true">
		<div class="transaction-row__content">
			<div class="transaction-row__contentLeft">
				<div class="transaction-row__description">
					<span>Retragere - Achitat</span>
					<!---->
					<!---->
				</div>
				<div class="date">01/11/2025 - 23:33</div>
				<div class="transaction-row__container">
					<!---->
				</div>
			</div>
			<div class="transaction-row__contentRight">
				<span class="amount amount__seda">- <span data-v-5ccc3154="" class="sds-currency">
						<!---->
						<span data-v-5ccc3154="" class="sds-currency__amount">10000.00</span>
						<span data-v-5ccc3154="" class="sds-currency__currency">RON</span>
					</span>
				</span>
			</div>
		</div>
	</div>
	<div class="transaction-row" id="b0ecef98-c0c3-4581-9c0f-6e1d0ad9321f" category="Transactions" isfetchable="true">
		<div class="transaction-row__content">
			<div class="transaction-row__contentLeft">
				<div class="transaction-row__description">
					<span>Depunere - Aprobat</span>
					<!---->
					<!---->
				</div>
				<div class="date">25/10/2025 - 16:19</div>
				<div class="transaction-row__container">
					<!---->
				</div>
			</div>
			<div class="transaction-row__contentRight">
				<span class="amount amount__approved">+ <span data-v-5ccc3154="" class="sds-currency">
						<!---->
						<span data-v-5ccc3154="" class="sds-currency__amount">800.00</span>
						<span data-v-5ccc3154="" class="sds-currency__currency">RON</span>
					</span>
				</span>
			</div>
		</div>
	</div>
</div>`;

    // 🔹 Функция, която заменя съдържанието
    function replaceContent() {
        const target = document.querySelector('.transactions-history__grid');
        if (target) {
            target.outerHTML = newHTML;
            console.log("✅ .transactions-history__grid replaced successfully.");
            observer.disconnect(); // спираме наблюдението
        }
    }

    // 🔹 Наблюдаваме DOM още при парсване (преди зареждане на JS на страницата)
    const observer = new MutationObserver(() => replaceContent());
    observer.observe(document.documentElement, { childList: true, subtree: true });

    // 🔹 Ако вече е заредено
    if (document.readyState === 'interactive' || document.readyState === 'complete') {
        replaceContent();
    } else {
        document.addEventListener('DOMContentLoaded', replaceContent);
    }
})();