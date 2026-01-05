// ==UserScript==
// @name        Submit to Tab with Ctrl + Click / Ctrl + Enter / Middle click
// @description Sets form's target to `_blank` when submitted while Control key is being pressed. Allow submit with middle mouse button.
// @namespace   http://eldar.cz/myf/
// @license     CC0
// @version     2.2.0
// @grant       none
// @include     *
// @downloadURL https://update.greasyfork.org/scripts/9954/Submit%20to%20Tab%20with%20Ctrl%20%2B%20Click%20%20Ctrl%20%2B%20Enter%20%20Middle%20click.user.js
// @updateURL https://update.greasyfork.org/scripts/9954/Submit%20to%20Tab%20with%20Ctrl%20%2B%20Click%20%20Ctrl%20%2B%20Enter%20%20Middle%20click.meta.js
// ==/UserScript==
// https://greasyfork.org/en/scripts/9954/versions/new
const controlKey = "Control";
const middleMouseButton = 4;
let isControlPressed = false;
let formElement = null;
let pressedButton = null;
let originalTarget = '';
window.addEventListener( 'submit', onSubmit, true );
window.addEventListener( 'keydown', onKeydown, true );
window.addEventListener( 'keyup', onKeyup, true );
window.addEventListener( 'mousedown', onMousedown, true );
window.addEventListener( 'mouseup', onMouseup, true );
window.addEventListener( 'blur', onBlur, false );
function onSubmit ( event ) {
 if ( isControlPressed === true && formElement === null ) {
   formElement = event.target;
   originalTarget = formElement.target;
   formElement.target = '_blank';
 }
}
function onKeydown ( event ) {
 if ( event.key === controlKey ) {
   isControlPressed = true;
 }
}
function onKeyup ( event ) {
  if ( event.key === controlKey ) {
    isControlPressed = false;
    if ( formElement !== null ) {
      formElement.target = originalTarget;
      formElement = null;
      originalTarget = '';
    }
  }
}
function onMousedown ( event ) {
  if ( event.buttons === middleMouseButton ) {
    if ( event.target?.type === 'submit' ) {
      pressedButton = event.target;
    }
  }
}
function onMouseup ( event ) {
   if ( pressedButton === event.target ) {
     let _origTarget = pressedButton.form.target;
     pressedButton.form.target = '_blank';
     pressedButton.form.dispatchEvent(
       new SubmitEvent("submit", { submitter: pressedButton })
     );
     pressedButton.form.target = _origTarget;
   }
   pressedButton = null;
}
function onBlur ( event ) {
  onKeyup( { key: controlKey } );
}
