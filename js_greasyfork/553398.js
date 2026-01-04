// ==UserScript==
// @name        FastPay Shortcuts
// @namespace   Violentmonkey Scripts
// @match       https://webfastpay.fastpay.bg/CashierFP*
// @grant       none
// @version     1.0
// @author      Red
// @description Add shortcuts to FastPay
// @downloadURL https://update.greasyfork.org/scripts/553398/FastPay%20Shortcuts.user.js
// @updateURL https://update.greasyfork.org/scripts/553398/FastPay%20Shortcuts.meta.js
// ==/UserScript==

// IDs OF ELEMENTS
const modalSearch = "#pcSearch_DXPWMB-1"; // When you click to select casino or so on...
const modalAmountChange = "#pcCharge_DXPWMB-1";
const modalPay = "#pcPay_DXPWMB-1";
const topMenuDropdownWidget = "#main_menu_DXM0_"; // The part which is visible on hover
const topMenuDropdownPaymentButton = "#main_menu_DXI0i0_";
const listPayments = "#lbDuties_LBT tbody > tr";
const editAmountButton = "#edit_amount_button";
const markChargeButton = "#mark_charge_button";
const payButton = "#pay_button";
const collectionButton = "#collect_from_pos_terminal";
const makePaymentButton = "#make_payment";

// HELPER STYLE NAMES
const VSB = "visibility";
const VSB_T = "visible";
const VSB_F = "hidden";

const DP = "display";
const DP_F = "none";

const WITH_CARD = "С карта";

// HELPER EVENTS
const mouseDownEvent = new MouseEvent('mousedown', {
  bubbles: true,
  cancelable: true,
  view: window,
  button: 0, // 0 = left button
  buttons: 1 // buttons bitmask: 1 = left
});

// STATE TRACKING
var state = {
  topMenuDropdown: false,
  modalVisible: false,
  modalSearchVisible: false,
  modalAmountChangeVisible: false,
  modalPay: false,
  payments: [],
  selectedPayment: 0
}

// Custom class for payments
class PaymentInfo {
  constructor(rowElement) {
    this.self = $(rowElement)
    const $tds = this.self.find('td');

    this.button = $tds.eq(0).find('span');
    this.amount = parseFloat($tds.eq(7).text());

    // Add more fields based on your actual <td> layout
  }

  selected() {
    return this.self.hasClass("focused_row")
  }

  select() {
    this.self.click();
  }

  checked() {
    return this.button.hasClass("dxWeb_edtCheckBoxChecked_MetropolisBlue");
  }
}


function checkVisible(el) {
  let Jl = $(el)
  return Jl.css(VSB) == VSB_T && Jl.css(DP) != DP_F;
}

function setVisibility(el, vis) {
  let Jl = $(el);
  if (vis) {
    Jl.css(DP, "");
    Jl.css(VSB, VSB_T);
  } else {
    Jl.css(DP, DP_F);
    Jl.css(VSB, VSB_F);
  }
}

function checkState() {
  // Check the modalSearch
  state.modalSearchVisible = checkVisible(modalSearch);
  state.modalAmountChangeVisible = checkVisible(modalAmountChange);
  state.modalPay = checkVisible(modalPay);
  state.topMenuDropdown = checkVisible(topMenuDropdownWidget);

  state.modalVisible = state.modalSearchVisible || state.modalAmountChangeVisible || state.modalPay;

  // Check payments
  if (window.location.pathname.endsWith('/Payments')) {
    let rowPayments = $(listPayments);
    state.payments = [];
    rowPayments.each(function () {
      const payment = new PaymentInfo(this);
      state.payments.push(payment);
    });
  }
}



document.addEventListener('keydown', function(e) {
  // Fetch the state
  checkState();

  // Quick menu helper
  if (e.code == "Numpad1" && !state.modalVisible) {
    if (state.topMenuDropdown) {
      $(topMenuDropdownPaymentButton).click()
    } else {
      setVisibility(topMenuDropdownWidget, true);
    }
  }

  // Check and skip if not on payments screen
  if (!window.location.pathname.endsWith('/Payments')) {
    return
  }

  // Casino select helper
  if (e.code == "NumpadAdd" && state.modalSearchVisible) {
    const searchDropdown = document.getElementById('cb_contragent_B-1');
    const deepSearch = document.getElementById('searchContragentsComboBox_B-1');

    // Select casino dropdown and or open the casino picker
    if ($("#cb_contragent_I").val() == "Хазартни Игри") {
      deepSearch.dispatchEvent(mouseDownEvent); // Just open the selection right away
    } else {
      $("#cb_contragent_I").val("Хазартни Игри"); // Set the value

      searchDropdown.dispatchEvent(mouseDownEvent); // Click the dropdown
      setVisibility("#cb_contragent_DDD_PW-1", false); // Hide it for cleanliness

      setTimeout(() => {searchDropdown.dispatchEvent(mouseDownEvent);}, 200); // Close the dropdown

      setTimeout(() => {deepSearch.dispatchEvent(mouseDownEvent);}, 1000); // Wait for the selection to finish and open the casino selection
    }
  }

  // Payment helper, first check if a payment is selected
  let enterKey = e.code == "NumpadEnter";
  let zeroKey = e.code == "Numpad0";
  if ((enterKey || zeroKey) && !state.modalVisible) {
    // First select the payment if not selected
    let payment = state.payments[state.selectedPayment];
    if (!payment.selected()) { payment.select() }
    else {
      // Continue with the selected payment
      if (zeroKey) {
        // Edit the price of the payment
        $(editAmountButton).click();
      } else if (enterKey && !payment.checked()) {
        // If the payment is not checked, check it first
        $(markChargeButton).click();
        $(markChargeButton).click();
      } else if (enterKey) {
        // Open payment modal
        $(payButton).click()

        // Restore pay cash
        setTimeout(() => {
          if ($("#cb_payment_method_I").val() == WITH_CARD) {
            $("#cb_payment_method_I").val("В брой");
            $("#cb_payment_method_B-1")[0].dispatchEvent(mouseDownEvent);
            setTimeout(() => {$("#cb_payment_method_B-1")[0].dispatchEvent(mouseDownEvent);}, 200);
          }
        }, 1000)
      }
    }
  } else if (enterKey && state.modalPay) {
    // Complete the transaction or collect money with card
    if ($("#cb_payment_method_I").val() == WITH_CARD) {
      $(collectionButton).click()
    } else {
      $(makePaymentButton).click()
    }
  }

  // Switch payment methods
  if (state.modalPay && e.code == "Numpad2") {
    if ($("#cb_payment_method_I").val() == WITH_CARD) {
      $("#cb_payment_method_I").val("В брой");
      $("#cb_payment_method_B-1")[0].dispatchEvent(mouseDownEvent);
      setTimeout(() => {$("#cb_payment_method_B-1")[0].dispatchEvent(mouseDownEvent);}, 200);
    } else {
      $("#cb_payment_method_I").val(WITH_CARD);
      $("#cb_payment_method_B-1")[0].dispatchEvent(mouseDownEvent);
      setTimeout(() => {$("#cb_payment_method_B-1")[0].dispatchEvent(mouseDownEvent);}, 200);
    }
  }
});