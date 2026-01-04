// ==UserScript==
// @name         Simple Gym Helper
// @namespace    https://www.torn.com/
// @version      v1.4
// @description  Hides gym stats for stat whoring or stacking.
// @author       AngryGod
// @license      MIT
// @match        https://www.torn.com/gym.php
// @icon         https://www.google.com/s2/favicons?sz=64&domain=torn.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/552187/Simple%20Gym%20Helper.user.js
// @updateURL https://update.greasyfork.org/scripts/552187/Simple%20Gym%20Helper.meta.js
// ==/UserScript==

(function() {
    'use strict';


    function waitForElementMutation(selector, callback) {
        const observer = new MutationObserver((mutationsList, observer) => {
            for (const mutation of mutationsList) {
                if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
                    const element = document.querySelector(selector);
                    if (element) {
                        callback(element);
                        observer.disconnect(); // Stop observing once the element is found
                        return;
                    }
                }
            }
        });

        observer.observe(document.body, { childList: true, subtree: true });

    };

    $(document).ready(function() {


        waitForElementMutation('.messageWrapper___mxBvg', function(element)  {

            var Def =  $('.defense___LITyA');
            var Speed = $('.speed___qNMTy');
            var Dex = $('.dexterity___6ayVQ');
            var Str =  $('.strength___UwX1Y');
            var AllStats = $('.properties___dT3ke');

            var newCheckboxes = `
      <div style="text-align:center;">
      <Span>Please check one.</span>
        <input type="checkbox" id="Strength" name="Strength" value="Strength">
        <label for="Strength">Strength</label>

        <input type="checkbox" id="Defense" name="Defense" value="Defense">
        <label for="Defense">Defense</label>

        <input type="checkbox" id="Speed" name="Speed" value="Speed">
        <label for="Speed">Speed</label>

        <input type="checkbox" id="Dexterity" name="Dexterity" value="Dexterity">
        <label for="Dexterity">Dexterity</label>

        <input type="checkbox" id="Stacking" name="Stacking" value="Stacking">
        <label for="Stacking">Stacking</label>
      </div>
    `;
            $(".messageWrapper___mxBvg p").append(newCheckboxes);
            //setting up checkboxes
            //strength checkbox
            function SetStrength() {
                Def.css('display','none');
                Speed.css('display','none');
                Dex.css('display','none');
                Str.css('margin','0 auto');
                $('#Defense').prop('disabled', true);
                $('#Speed').prop('disabled', true);
                $('#Dexterity').prop('disabled', true);
                $('#Stacking').prop('disabled', true);
            };
            var Strengthstate = localStorage.getItem('StrengthCheckboxState');
            if (Strengthstate === 'true') {
                $('#Strength').prop('checked', true);
                SetStrength();
            } else if (Strengthstate === 'false') {
                $('#Strength').prop('checked', false);
            }
            $('#Strength').change(function() {
                if ($(this).is(':checked')) {
                    console.log('Checkbox is checked!');
                    localStorage.setItem('StrengthCheckboxState', this.checked);
                    SetStrength();
                } else {
                    console.log('Checkbox is unchecked!');
                    localStorage.removeItem('StrengthCheckboxState');
                    Def.css('display','block');
                    Speed.css('display','block');
                    Dex.css('display','block');
                    $('#Defense').prop('disabled', false);
                    $('#Speed').prop('disabled', false);
                    $('#Dexterity').prop('disabled', false);
                    $('#Stacking').prop('disabled', false);
                }
            });
            //Defense Checkbox
            function SetDefense() {
                Str.css('display','none');
                Speed.css('display','none');
                Dex.css('display','none');
                Def.css('margin','0 auto');
                $('#Strength').prop('disabled', true);
                $('#Speed').prop('disabled', true);
                $('#Dexterity').prop('disabled', true);
                $('#Stacking').prop('disabled', true);
            };
            var Defensestate = localStorage.getItem('DefenseCheckboxState');
            if (Defensestate === 'true') {
                $('#Defense').prop('checked', true);
                SetDefense();
            } else if (Defensestate === 'false') {
                $('#Defense').prop('checked', false);
            };
            $('#Defense').change(function() {
                if ($(this).is(':checked')) {
                    console.log('Checkbox is checked!');
                    localStorage.setItem('DefenseCheckboxState', this.checked);
                    SetDefense()

                } else {
                    console.log('Checkbox is unchecked!');
                    localStorage.removeItem('DefenseCheckboxState');
                    Str.css('display','block');
                    Speed.css('display','block');
                    Dex.css('display','block');
                    $('#Strength').prop('disabled', false);
                    $('#Speed').prop('disabled', false);
                    $('#Dexterity').prop('disabled', false);
                    $('#Stacking').prop('disabled', false);
                }

            });
            //Speed Checkbox
            function SetSpeed() {
                Str.css('display','none');
                Def.css('display','none');
                Dex.css('display','none');
                Speed.css('margin','0 auto');
                $('#Strength').prop('disabled', true);
                $('#Defense').prop('disabled', true);
                $('#Dexterity').prop('disabled', true);
                $('#Stacking').prop('disabled', true);
            };
            var Speedstate = localStorage.getItem('SpeedCheckboxState');
            if (Speedstate === 'true') {
                $('#Speed').prop('checked', true);
                SetSpeed();
            } else if (Speedstate === 'false') {
                $('#Speed').prop('checked', false);
            };
            $('#Speed').change(function() {
                if ($(this).is(':checked')) {
                    console.log('Checkbox is checked!');
                    localStorage.setItem('SpeedCheckboxState', this.checked);
                    SetSpeed();


                } else {
                    console.log('Checkbox is unchecked!');
                    localStorage.removeItem('SpeedCheckboxState');
                    Str.css('display','block');
                    Def.css('display','block');
                    Dex.css('display','block');
                    $('#Strength').prop('disabled', false);
                    $('#Defense').prop('disabled', false);
                    $('#Dexterity').prop('disabled', false);
                    $('#Stacking').prop('disabled', false);
                }
            });

            //Dexterity checkbox
            function SetDexterity() {
                Str.css('display','none');
                Def.css('display','none');
                Speed.css('display','none');
                Dex.css('margin','0 auto');
                $('#Strength').prop('disabled', true);
                $('#Defense').prop('disabled', true);
                $('#Speed').prop('disabled', true);
                $('#Stacking').prop('disabled', true);
            };
            var Dexteritystate = localStorage.getItem('DexterityCheckboxState');
            if (Dexteritystate === 'true') {
                $('#Dexterity').prop('checked', true);
                SetDexterity();
            } else if (Dexteritystate === 'false') {
                $('#Dexterity').prop('checked', false);
            };
            $('#Dexterity').change(function() {
                if ($(this).is(':checked')) {
                    console.log('Checkbox is checked!');
                    localStorage.setItem('DexterityCheckboxState', this.checked);
                    SetDexterity();
                } else {
                    console.log('Checkbox is unchecked!');
                    localStorage.removeItem('DexterityCheckboxState');
                    Str.css('display','block');
                    Def.css('display','block');
                    Speed.css('display','block');
                    $('#Strength').prop('disabled', false);
                    $('#Defense').prop('disabled', false);
                    $('#Speed').prop('disabled', false);
                    $('#Stacking').prop('disabled', false);
                }
            });
            //Stacking Checkbox
            var GymTrain =  $('.propertyContent___O7nDG');
            function SetStacking() {
                AllStats.css('pointer-events', 'none');
                GymTrain.css('filter','blur(1px)');
                $('#Dexterity').prop('disabled', true);
                $('#Strength').prop('disabled', true);
                $('#Defense').prop('disabled', true);
                $('#Speed').prop('disabled', true);

            };
            var Stackingstate = localStorage.getItem('StackingCheckboxState');
            if (Stackingstate === 'true') {
                $('#Stacking').prop('checked', true);
                SetStacking();
            } else if (Stackingstate === 'false') {
                $('#Stacking').prop('checked', false);
            };
            $('#Stacking').change(function() {
                if ($(this).is(':checked')) {
                    console.log('Checkbox is checked!');
                    localStorage.setItem('StackingCheckboxState', this.checked);
                    SetStacking();
                } else {
                    console.log('Checkbox is unchecked!');
                    localStorage.removeItem('StackingCheckboxState');
                    AllStats.css('pointer-events', 'auto');
                    GymTrain.css('filter','blur(0px)');
                    $('#Strength').prop('disabled', false);
                    $('#Defense').prop('disabled', false);
                    $('#Speed').prop('disabled', false);
                    $('#Dexterity').prop('disabled', false);
                }
            });

            //End of checkboxes.

        });

    });

    // Your code here...
})();