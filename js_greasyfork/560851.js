// ==UserScript==
// @name         Krunkax - levifrsn63
// @namespace    http://tampermonkey.net/
// @version      0.6(Beta)
// @description  Locks aim to the nearest player in krunker.io and shows players behind walls. Also shows a line between you and them.
// @author       levifrsn63
// @match        *://krunker.io/*
// @match        *://browserfps.com/*
// @exclude      *://krunker.io/social*
// @exclude      *://krunker.io/editor*
// @icon         https://www.google.com/s2/favicons?domain=krunker.io
// @grant        none
// @license      MIT
// @run-at       document-start
// @require      https://unpkg.com/three@0.150.0/build/three.min.js
// @downloadURL https://update.greasyfork.org/scripts/552304/Krunkax%20-%20levifrsn63.user.js
// @updateURL https://update.greasyfork.org/scripts/552304/Krunkax%20-%20levifrsn63.meta.js
// ==/UserScript==

const THREE = window.THREE;
delete window.THREE;

// LocalStorage key for persistence
const STORAGE_KEY = 'krunkax_settings';

// Default settings
const defaultSettings = {
  aimbotEnabled: true,
  aimbotOnRightMouse: true,
  espEnabled: true,
  espLines: false,
  wireframe: false,
  fovCircle: true,
  fovRadius: 200,
  aimSmoothing: false,
  antiRecoil: false,
  teamCheck: false,
  iPadMode: false,
  aimSmoothingSpeed: 30,
  antiRecoilOffset: 0,
  antiRecoilAmount: 0,
  allHacksEnabled: true,
  dialogDismissed: false,
  nearestPlayerIndicator: false
};

// Load settings from localStorage or use defaults
function loadSettings() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      return { ...defaultSettings, ...parsed };
    }
  } catch (e) {
    console.log('Error loading settings:', e);
  }
  return { ...defaultSettings };
}

// Save settings to localStorage
function saveSettings() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
  } catch (e) {
    console.log('Error saving settings:', e);
  }
}

// Clear settings from localStorage
function clearSettings() {
  try {
    localStorage.removeItem(STORAGE_KEY);
    // Reset to defaults
    Object.assign(settings, defaultSettings);
    console.log('Settings cleared and reset to defaults');
  } catch (e) {
    console.log('Error clearing settings:', e);
  }
}

// Clear all cookies and storage to unban
function unban() {
  try {
    // Clear all cookies
    document.cookie.split(';').forEach(cookie => {
      const eqPos = cookie.indexOf('=');
      const name = eqPos > -1 ? cookie.substring(0, eqPos).trim() : cookie.trim();
      document.cookie = name + '=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/';
      document.cookie = name + '=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/;domain=' + location.hostname;
      document.cookie = name + '=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/;domain=.' + location.hostname;
    });

    // Clear localStorage
    localStorage.clear();

    // Clear sessionStorage
    sessionStorage.clear();

    console.log('All cookies and storage cleared for unban');
  } catch (e) {
    console.log('Error during unban:', e);
  }
}

// Initialize settings
const settings = loadSettings();

const keyToSetting = {
  Digit5: 'aimbotEnabled',
  Digit6: 'aimbotOnRightMouse',
  Digit7: 'espEnabled',
  Digit8: 'espLines',
  Digit9: 'wireframe',
  Digit0: 'fovCircle',
  Digit1: 'aimSmoothing',
  Digit2: 'antiRecoil'
};

// Default keybinds
const defaultKeybinds = {
  aimbotEnabled: 'Digit5',
  aimbotOnRightMouse: 'Digit6',
  espEnabled: 'Digit7',
  espLines: 'Digit8',
  wireframe: 'Digit9',
  fovCircle: 'Digit0',
  aimSmoothing: 'Digit1',
  antiRecoil: 'Digit2',
  teamCheck: '',
  rightMouseAimbot: ''
};

// Custom keybinds (will be updated by user)
const customKeybinds = { ...defaultKeybinds };

const gui = createGUI();

// Create FOV circle canvas
const fovCanvas = document.createElement('canvas');
fovCanvas.style.position = 'fixed';
fovCanvas.style.top = '0';
fovCanvas.style.left = '0';
fovCanvas.style.width = '100%';
fovCanvas.style.height = '100%';
fovCanvas.style.pointerEvents = 'none';
fovCanvas.style.zIndex = '9999';

let scene;

const x = {
  window: window,
  document: document,
  querySelector: document.querySelector,
  consoleLog: console.log,
  ReflectApply: Reflect.apply,
  ArrayPrototype: Array.prototype,
  ArrayPush: Array.prototype.push,
  ObjectPrototype: Object.prototype,
  clearInterval: window.clearInterval,
  setTimeout: window.setTimeout,
  reToString: RegExp.prototype.toString,
  indexOf: String.prototype.indexOf,
  requestAnimationFrame: window.requestAnimationFrame
};

x.consoleLog( 'Waiting to inject...' );

const proxied = function ( object ) {

  // [native code]

  try {

    if ( typeof object === 'object' &&
      typeof object.parent === 'object' &&
      object.parent.type === 'Scene' &&
      object.parent.name === 'Main' ) {

      x.consoleLog( 'Found Scene!' )
      scene = object.parent;
      x.ArrayPrototype.push = x.ArrayPush;

    }

  } catch ( error ) {}

  return x.ArrayPush.apply( this, arguments );

}

const tempVector = new THREE.Vector3();

const tempObject = new THREE.Object3D();
tempObject.rotation.order = 'YXZ';

// Store target player info for indicator
let targetPlayerScreenPos = { x: null, y: null };
let targetPlayerDistance = null;

// FOV circle drawing function
function drawFOVCircle() {
  const ctx = fovCanvas.getContext('2d');
  ctx.clearRect(0, 0, fovCanvas.width, fovCanvas.height);

  if (settings.fovCircle) {
    const centerX = fovCanvas.width / 2;
    const centerY = fovCanvas.height / 2;

    ctx.beginPath();
    ctx.arc(centerX, centerY, settings.fovRadius, 0, 2 * Math.PI);
    ctx.strokeStyle = 'rgba(255, 0, 0, 0.5)';
    ctx.lineWidth = 2;
    ctx.stroke();

    // Draw crosshair
    ctx.beginPath();
    ctx.moveTo(centerX - 10, centerY);
    ctx.lineTo(centerX + 10, centerY);
    ctx.moveTo(centerX, centerY - 10);
    ctx.lineTo(centerX, centerY + 10);
    ctx.strokeStyle = 'rgba(0, 255, 0, 0.7)';
    ctx.lineWidth = 2;
    ctx.stroke();
  }

  // Draw nearest player indicator on circle around crosshair
  if (settings.nearestPlayerIndicator && targetPlayerScreenPos.x !== null && targetPlayerDistance !== null) {
    const centerX = fovCanvas.width / 2;
    const centerY = fovCanvas.height / 2;

    // Calculate direction to target
    const dx = targetPlayerScreenPos.x - centerX;
    const dy = targetPlayerScreenPos.y - centerY;
    const angle = Math.atan2(dy, dx);

    // Position indicator on 240px radius circle around crosshair
    const indicatorRadius = 240;
    const indicatorX = centerX + Math.cos(angle) * indicatorRadius;
    const indicatorY = centerY + Math.sin(angle) * indicatorRadius;

    // Draw triangle pointing toward nearest player
    const triangleSize = 12;
    ctx.save();
    ctx.translate(indicatorX, indicatorY);
    ctx.rotate(angle);

    ctx.beginPath();
    ctx.moveTo(0, -triangleSize);
    ctx.lineTo(-triangleSize / 2, triangleSize / 2);
    ctx.lineTo(triangleSize / 2, triangleSize / 2);
    ctx.closePath();

    ctx.fillStyle = 'rgba(255, 100, 100, 0.8)';
    ctx.fill();
    ctx.strokeStyle = 'rgba(255, 100, 100, 1)';
    ctx.lineWidth = 2;
    ctx.stroke();

    ctx.restore();
  }

  // Always show distance at bottom of screen if we have a target
  if (targetPlayerDistance !== null) {
    const centerX = fovCanvas.width / 2;
    const distanceText = `Closest Player: ${Math.round(targetPlayerDistance)}m`;

    ctx.font = 'bold 14px monospace';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'bottom';

    // Draw text shadow for better visibility
    ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
    ctx.fillText(distanceText, centerX + 1, fovCanvas.height - 9);

    // Draw text
    ctx.fillStyle = 'rgba(255, 255, 255, 0.95)';
    ctx.fillText(distanceText, centerX, fovCanvas.height - 10);
  }
}

// Check if point is within FOV
function isWithinFOV(screenX, screenY) {
  // When FOV circle is disabled, always return true to target closest person overall
  if (!settings.fovCircle) return true;

  const centerX = window.innerWidth / 2;
  const centerY = window.innerHeight / 2;
  const distance = Math.sqrt(
    Math.pow(screenX - centerX, 2) +
    Math.pow(screenY - centerY, 2)
  );

  return distance <= settings.fovRadius;
}

const geometry = new THREE.EdgesGeometry( new THREE.BoxGeometry( 5, 15, 5 ).translate( 0, 7.5, 0 ) );

function createBoxMaterial() {
  return new THREE.RawShaderMaterial( {
    uniforms: {
      boxColor: { value: new THREE.Color( 1.0, 0.0, 0.0 ) }
    },
    vertexShader: `

    attribute vec3 position;

    uniform mat4 projectionMatrix;
    uniform mat4 modelViewMatrix;

    void main() {

      gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
      gl_Position.z = 1.0;

    }

    `,
    fragmentShader: `

    precision mediump float;
    uniform vec3 boxColor;

    void main() {

      gl_FragColor = vec4( boxColor, 1.0 );

    }

    `
  } );
}

const material = new THREE.RawShaderMaterial( {
  vertexShader: `

  attribute vec3 position;

  uniform mat4 projectionMatrix;
  uniform mat4 modelViewMatrix;

  void main() {

    gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
    gl_Position.z = 1.0;

  }

  `,
  fragmentShader: `

  void main() {

    gl_FragColor = vec4( 1.0, 0.0, 0.0, 1.0 );

  }

  `
} );

const line = new THREE.LineSegments( new THREE.BufferGeometry(), material );

line.frustumCulled = false;

const linePositions = new THREE.BufferAttribute( new Float32Array( 100 * 2 * 3 ), 3 );
line.geometry.setAttribute( 'position', linePositions );

let injectTimer = null;
let lastRotation = { x: 0, y: 0 };
let lockedTarget = null;
let isMouseDown = false;

function animate() {

  x.requestAnimationFrame.call( x.window, animate );

  // Draw FOV circle
  drawFOVCircle();

  if ( ! scene && ! injectTimer ) {

    const el = x.querySelector.call( x.document, '#loadingBg' );

    if ( el && el.style.display === 'none' ) {

      x.consoleLog( 'Inject timer started!' );

      injectTimer = x.setTimeout.call( x.window, () => {

        x.consoleLog( 'Injected!' );
        x.ArrayPrototype.push = proxied;

      }, 2e3 );

    }

  }

  if ( scene === undefined || ! scene.children ) {

    return;

  }

  const players = [];

  let myPlayer;

  for ( let i = 0; i < scene.children.length; i ++ ) {

    const child = scene.children[ i ];

    if ( child.type === 'Object3D' ) {

      try {

        if ( child.children[ 0 ].children[ 0 ].type === 'PerspectiveCamera' ) {

          myPlayer = child;

        } else {

          players.push( child );

        }

      } catch ( err ) {}

    } else if ( child.material ) {

      child.material.wireframe = settings.wireframe;

    }

  }

  if ( ! myPlayer ) {

    x.consoleLog( 'Player not found, finding new scene.' );
    x.ArrayPrototype.push = proxied;
    return;

  }

  let counter = 0;

  let targetPlayer;
  let minDistance = Infinity;

  tempObject.matrix.copy( myPlayer.matrix ).invert()

  const camera = myPlayer.children[ 0 ].children[ 0 ];
  const validTargets = [];

  for ( let i = 0; i < players.length; i ++ ) {

    const player = players[ i ];

    if ( ! player.box ) {

      const boxMaterial = createBoxMaterial();
      const box = new THREE.LineSegments( geometry, boxMaterial );
      box.frustumCulled = false;

      player.add( box );

      player.box = box;

    }

    if ( player.position.x === myPlayer.position.x && player.position.z === myPlayer.position.z ) {

      player.box.visible = false;

      if ( line.parent !== player ) {

        player.add( line );

      }

      continue;

    }

    linePositions.setXYZ( counter ++, 0, 10, - 5 );

    tempVector.copy( player.position );
    tempVector.y += 9;
    tempVector.applyMatrix4( tempObject.matrix );

    linePositions.setXYZ(
      counter ++,
      tempVector.x,
      tempVector.y,
      tempVector.z
    );

    player.visible = (settings.allHacksEnabled && settings.espEnabled) || player.visible;
    player.box.visible = settings.allHacksEnabled && settings.espEnabled;

    const distance = player.position.distanceTo( myPlayer.position );

    // Check if player is within FOV before adding to valid targets
    tempVector.setScalar( 0 );
    player.children[ 0 ].children[ 0 ].localToWorld( tempVector );
    const targetScreen = tempVector.clone();
    targetScreen.project( camera );

    const screenX = ( targetScreen.x + 1 ) / 2 * window.innerWidth;
    const screenY = ( -targetScreen.y + 1 ) / 2 * window.innerHeight;

    if ( isWithinFOV( screenX, screenY ) ) {
      // When FOV is enabled, only target players in front (not behind)
      let isInFront = true;
      if ( settings.fovCircle ) {
        // Check if player is in front using projected Z coordinate
        isInFront = targetScreen.z < 1; // Z < 1 means in front of camera
      }

      if ( isInFront ) {
        // Team check - don't add teammates to valid targets
        if ( settings.teamCheck ) {
          // Check if both players have team property and are on same team
          if ( myPlayer.team !== undefined && player.team !== undefined && myPlayer.team === player.team ) {
            // Skip adding teammate to valid targets
          } else {
            validTargets.push({ player, distance });
          }
        } else {
          validTargets.push({ player, distance });
        }
      }
    }

  }

  // Natural target locking - only use when FOV circle is enabled
  if ( settings.fovCircle && lockedTarget ) {
    // Check if locked target is still within FOV
    const lockedStillInFOV = validTargets.find( t => t.player === lockedTarget );
    if ( lockedStillInFOV ) {
      targetPlayer = lockedTarget;
    } else {
      // Release lock if target left FOV
      lockedTarget = null;
    }
  }

  // Select nearest target from valid targets
  if ( !targetPlayer && validTargets.length > 0 ) {
    validTargets.sort( ( a, b ) => a.distance - b.distance );
    targetPlayer = validTargets[ 0 ].player;
    // Only lock target when FOV circle is enabled
    if ( settings.fovCircle ) {
      lockedTarget = targetPlayer;
    }
  }

  // Clear locked target when FOV circle is disabled
  if ( !settings.fovCircle ) {
    lockedTarget = null;
  }

  // Update ESP box colors based on targeting
  for ( let i = 0; i < players.length; i ++ ) {
    const player = players[ i ];

    if ( player.box && player.box.material && player.box.material.uniforms ) {
      // Set color to green if this player is the target, red otherwise
      if ( player === targetPlayer ) {
        player.box.material.uniforms.boxColor.value.setRGB( 0.0, 1.0, 0.0 );
      } else {
        player.box.material.uniforms.boxColor.value.setRGB( 1.0, 0.0, 0.0 );
      }
    }
  }

  // Store target player screen position and distance for indicator
  if ( targetPlayer ) {
    // Use same projection method as ESP lines
    tempVector.setScalar( 0 );
    targetPlayer.children[ 0 ].children[ 0 ].localToWorld( tempVector );
    const targetScreen = tempVector.clone();
    targetScreen.project( camera );

    targetPlayerScreenPos.x = ( targetScreen.x + 1 ) / 2 * window.innerWidth;
    targetPlayerScreenPos.y = ( -targetScreen.y + 1 ) / 2 * window.innerHeight;

    // Calculate distance (in 3D space)
    targetPlayerDistance = targetPlayer.position.distanceTo( myPlayer.position );
  } else {
    targetPlayerScreenPos.x = null;
    targetPlayerScreenPos.y = null;
    targetPlayerDistance = null;
  }

  linePositions.needsUpdate = true;
  line.geometry.setDrawRange( 0, counter );

  line.visible = settings.allHacksEnabled && settings.espLines;

  // Check if aimbot should be active
  const shouldAimbot = settings.allHacksEnabled && settings.aimbotEnabled && targetPlayer !== undefined && (
    ( settings.iPadMode && isTouching ) || // iPad mode: active when touching
    ( rightMouseAimbotKeyPressed ) || // Right mouse aimbot keybind
    ( !settings.iPadMode && settings.aimbotOnRightMouse && rightMouseDown ) || // Right mouse mode
    ( !settings.iPadMode && !settings.aimbotOnRightMouse && !rightMouseAimbotKeyPressed ) // Always on mode
  );

  if ( !shouldAimbot ) {
    // Update lastRotation with current camera position when aimbot is not active
    // This ensures smooth transition when aimbot activates
    lastRotation.x = myPlayer.children[ 0 ].rotation.x;
    lastRotation.y = myPlayer.rotation.y;
    return;

  }

  tempVector.setScalar( 0 );
  targetPlayer.children[ 0 ].children[ 0 ].localToWorld( tempVector );

  tempObject.position.copy( myPlayer.position );
  tempObject.lookAt( tempVector );

  let targetRotX = - tempObject.rotation.x;
  let targetRotY = tempObject.rotation.y + Math.PI;

  // Apply smoothing
  if ( settings.aimSmoothing ) {
    const smoothness = settings.aimSmoothingSpeed / 100;
    targetRotX = lastRotation.x + ( targetRotX - lastRotation.x ) * smoothness;
    targetRotY = lastRotation.y + ( targetRotY - lastRotation.y ) * smoothness;
  }

  lastRotation.x = targetRotX;
  lastRotation.y = targetRotY;

  // Apply offset when locked on target
  const offsetRadians = ( settings.antiRecoilOffset / 100 );
  targetRotX += offsetRadians;

  // Apply anti-recoil compensation (moves down while shooting)
  if ( settings.antiRecoil && isMouseDown ) {
    const recoilCompensation = -( settings.antiRecoilAmount / 100 );
    targetRotX += recoilCompensation;
  }

  myPlayer.children[ 0 ].rotation.x = targetRotX;
  myPlayer.rotation.y = targetRotY;

}

const el = document.createElement( 'div' );

el.innerHTML = `<style>

.dialog {
  position: absolute;
  left: 50%;
  top: 50%;
  padding: 30px;
  background: rgba(18, 18, 18, 0.98);
  border: 1px solid rgba(80, 80, 90, 0.5);
  border-radius: 8px;
  color: #e5e5e5;
  transform: translate(-50%, -50%);
  text-align: center;
  z-index: 999999;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.6);
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', sans-serif;
}

.dialog * {
  color: #e5e5e5;
}

.close {
  position: absolute;
  right: 5px;
  top: 5px;
  width: 20px;
  height: 20px;
  opacity: 0.5;
  cursor: pointer;
}

.close:before, .close:after {
  content: ' ';
  position: absolute;
  left: 50%;
  top: 50%;
  width: 100%;
  height: 20%;
  transform: translate(-50%, -50%) rotate(-45deg);
  background: #fff;
}

.close:after {
  transform: translate(-50%, -50%) rotate(45deg);
}

.close:hover {
  opacity: 1;
}

.btn {
  cursor: pointer;
  padding: 10px 20px;
  background: linear-gradient(135deg, rgba(60, 60, 70, 0.9), rgba(50, 50, 60, 0.9));
  border: 1px solid rgba(100, 100, 110, 0.3);
  border-radius: 8px;
  color: white;
  font-weight: 600;
  transition: all 0.2s ease;
}

.btn:active {
  transform: scale(0.95);
}

.btn:hover {
  background: linear-gradient(135deg, rgba(70, 70, 80, 0.95), rgba(60, 60, 70, 0.95));
}

.msg {
  position: absolute;
  left: 15px;
  bottom: 15px;
  color: #e5e5e5;
  background: rgba(18, 18, 18, 0.95);
  font-weight: 600;
  padding: 12px 20px;
  border-radius: 6px;
  border: 1px solid rgba(80, 80, 90, 0.5);
  animation: msg 0.5s forwards, msg 0.5s reverse forwards 3s;
  z-index: 999999;
  pointer-events: none;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.5);
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', sans-serif;
  display: none !important;
}

@keyframes msg {
  from {
    transform: translate(-120%, 0);
  }

  to {
    transform: none;
  }
}

.zui {
  position: fixed;
  right: 15px;
  top: 15px;
  z-index: 999;
  display: flex;
  flex-direction: column;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', sans-serif;
  font-size: 13px;
  color: #fff;
  width: 420px;
  height: 480px;
  user-select: none;
  border: 1px solid rgba(80, 80, 90, 0.5);
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.5);
  transition: all 0.3s ease;
  background: rgba(18, 18, 18, 1);
}

.zui.minimized {
  width: auto;
  height: auto;
}

.zui.minimized .zui-content,
.zui.minimized .zui-tabs,
.zui.minimized .zui-footer {
  display: none;
}

.zui.minimized .zui-header {
  padding: 8px 12px;
  border-radius: 8px;
  justify-content: space-between;
}

.zui.minimized .zui-header-title {
  display: inline-block;
}

.zui.minimized .zui-window-controls {
  position: static;
}

.zui-content {
  overflow-y: auto;
  overflow-x: hidden;
  flex: 1;
  scrollbar-width: thin;
  scrollbar-color: rgba(100, 100, 110, 0.5) transparent;
}

.zui-content::-webkit-scrollbar {
  width: 5px;
}

.zui-content::-webkit-scrollbar-track {
  background: transparent;
}

.zui-content::-webkit-scrollbar-thumb {
  background: rgba(100, 100, 110, 0.5);
  border-radius: 3px;
}

.zui-content::-webkit-scrollbar-thumb:hover {
  background: rgba(120, 120, 130, 0.7);
}

.zui-item {
  padding: 10px 14px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: rgba(25, 25, 25, 0.6);
  cursor: pointer;
  transition: all 0.2s ease;
  margin: 6px 10px;
  border-radius: 6px;
}

.zui-item.text {
  justify-content: center;
  cursor: unset;
  text-align: center;
  background: rgba(30, 30, 30, 0.8);
  font-weight: 600;
  font-size: 11px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  color: rgba(180, 180, 190, 0.9);
  margin: 12px 10px 8px 10px;
}

.zui-item:hover {
  background: rgba(30, 30, 30, 0.8);
}

.zui-item:active {
  transform: scale(0.98);
}

.zui-item span {
  color: #e5e7eb;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', sans-serif;
  font-size: 12px;
}

.zui-header {
  background: rgba(20, 20, 20, 1);
  padding: 12px 14px;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: move;
  border-bottom: 1px solid rgba(80, 80, 90, 0.4);
  position: relative;
}

.zui-header-title {
  font-size: 13px;
  font-weight: 700;
  letter-spacing: 0.5px;
  text-transform: uppercase;
  color: #ffffff;
}

.zui-window-controls {
  display: flex;
  gap: 8px;
  position: absolute;
  right: 12px;
}

.zui-window-btn {
  width: 20px;
  height: 20px;
  border-radius: 50%;
  cursor: pointer;
  transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  font-weight: bold;
  border: 2px solid;
}

.zui-window-btn.close {
  background: rgba(15, 15, 15, 1);
  border-color: rgba(15, 15, 15, 1);
  color: rgb(220, 80, 80);
}

.zui-window-btn.minimize {
  background: rgba(120, 120, 130, 0.2);
  border-color: rgba(120, 120, 130, 0.6);
  color: rgb(180, 180, 190);
}

.zui-window-btn:hover {
  transform: scale(1.05);
  opacity: 0.8;
}

.zui-window-btn:active {
  transform: scale(0.95);
}

.zui-header:hover {
  background: rgba(25, 25, 25, 1);
}

.zui-on {
  color: #10b981;
}

.zui-item-value {
  font-size: 11px;
  font-weight: 700;
  padding: 4px 10px;
  border-radius: 6px;
  background: rgba(15, 15, 15, 1);
  border: 1px solid rgba(100, 100, 110, 0.4);
}

.zui-content .zui-item-value {
  font-weight: 700;
}

.zui-tabs {
  display: flex;
  background: rgba(15, 15, 15, 0.8);
  border-bottom: 1px solid rgba(80, 80, 90, 0.4);
}

.zui-tab {
  flex: 1;
  padding: 10px;
  text-align: center;
  cursor: pointer;
  font-size: 11px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  color: rgba(140, 140, 150, 0.8);
  transition: all 0.2s ease;
  border-bottom: 2px solid transparent;
}

.zui-tab:hover {
  color: rgba(180, 180, 190, 0.9);
  background: rgba(25, 25, 25, 0.4);
}

.zui-tab.active {
  color: rgba(200, 200, 210, 1);
  border-bottom-color: rgba(120, 120, 130, 1);
  background: rgba(25, 25, 25, 0.6);
}

.zui-tab-content {
  display: none;
}

.zui-tab-content.active {
  display: block;
}

.zui-slider-container {
  padding: 12px 14px;
  background: rgba(25, 25, 25, 0.6);
  margin: 6px 10px;
  border-radius: 6px;
}

.zui-slider-label {
  display: flex;
  justify-content: space-between;
  margin-bottom: 10px;
  color: #e5e7eb;
  font-size: 12px;
  font-weight: 500;
}

.zui-slider-value {
  color: #e5e7eb;
  font-weight: 700;
}

.zui-slider {
  width: 100%;
  height: 5px;
  border-radius: 3px;
  background: rgba(30, 30, 30, 0.8);
  outline: none;
  -webkit-appearance: none;
  appearance: none;
}

.zui-slider::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background: rgb(140, 140, 150);
  cursor: pointer;
  transition: all 0.2s ease;
}

.zui-slider::-webkit-slider-thumb:hover {
  background: rgb(160, 160, 170);
  transform: scale(1.1);
}

.zui-slider::-moz-range-thumb {
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background: rgb(140, 140, 150);
  cursor: pointer;
  border: none;
  transition: all 0.2s ease;
}

.zui-slider::-moz-range-thumb:hover {
  background: rgb(160, 160, 170);
  transform: scale(1.1);
}

.zui-footer {
  padding: 8px 14px;
  background: rgba(15, 15, 15, 0.95);
  text-align: center;
  font-size: 10px;
  color: rgba(140, 140, 150, 0.6);
  border-top: 1px solid rgba(80, 80, 90, 0.4);
  font-weight: 500;
  letter-spacing: 0.3px;
}

</style>
<div class="msg" style="display: none;"></div>
<div class="dialog">${`<div class="close" onclick="this.parentNode.style.display='none';"></div>
  <big>🎯 Advanced Aimbot & ESP</big>
  <br>
  <br>
  <strong>Aimbot Controls:</strong><br>
  [5] Toggle Aimbot | [6] Right Mouse Mode<br>
  [0] FOV Circle | [1] Aim Smoothing<br>
  [2] Anti Recoil<br>
  <br>
  <strong>ESP Controls:</strong><br>
  [7] Toggle ESP | [8] ESP Lines<br>
  [9] Wireframe Mode<br>
  <br>
  <strong>UI Controls:</strong><br>
  [H] Show/Hide Help | [/] Toggle Menu<br>
  <br>
  </div>
  ` }
</div>`;

const msgEl = el.querySelector( '.msg' );
const dialogEl = el.querySelector( '.dialog' );

// Setup dialog close persistence
const closeBtn = dialogEl.querySelector( '.close' );
closeBtn.onclick = function() {
  dialogEl.style.display = 'none';
  settings.dialogDismissed = true;
  saveSettings();
};

window.addEventListener( 'DOMContentLoaded', function () {

  while ( el.children.length > 0 ) {

    document.body.appendChild( el.children[ 0 ] );

  }

  document.body.appendChild( gui );
  document.body.appendChild( fovCanvas );

  // Hide dialog if it was previously dismissed
  if ( settings.dialogDismissed ) {
    dialogEl.style.display = 'none';
  }

  // Set canvas size
  fovCanvas.width = window.innerWidth;
  fovCanvas.height = window.innerHeight;

  // Update canvas size on window resize
  window.addEventListener('resize', function() {
    fovCanvas.width = window.innerWidth;
    fovCanvas.height = window.innerHeight;
  });

} );

let rightMouseDown = false;
let isTouching = false;
let rightMouseAimbotKeyPressed = false;

function handleMouse( event ) {

  if ( event.button === 2 ) {

    rightMouseDown = event.type === 'pointerdown' ? true : false;

  }

  // Track left mouse button for shooting
  if ( event.button === 0 ) {
    isMouseDown = event.type === 'pointerdown' ? true : false;
  }

}

function handleTouch( event ) {
  // For iPad/mobile mode
  isTouching = event.type === 'touchstart' ? true : false;
}

window.addEventListener( 'pointerdown', handleMouse );
window.addEventListener( 'pointerup', handleMouse );
window.addEventListener( 'touchstart', handleTouch );
window.addEventListener( 'touchend', handleTouch );

window.addEventListener( 'keyup', function ( event ) {

  if ( x.document.activeElement && x.document.activeElement.value !== undefined ) return;

  // Check custom keybinds first
  Object.keys(customKeybinds).forEach(settingKey => {
    if (customKeybinds[settingKey] === event.code && customKeybinds[settingKey] !== '') {
      if (settingKey !== 'rightMouseAimbot') {
        toggleSetting( settingKey );
      }
    }
  });

  // Handle right mouse aimbot keybind release
  if (customKeybinds.rightMouseAimbot === event.code && customKeybinds.rightMouseAimbot !== '') {
    rightMouseAimbotKeyPressed = false;
  }

  switch ( event.code ) {

    case 'Slash' :
      if ( gui.style.display === 'none' ) {
        gui.style.display = '';
      } else {
        toggleElementVisibility( gui );
      }
      break;

    case 'KeyH' :
      toggleElementVisibility( dialogEl );
      break;

  }

} );

// Handle right mouse aimbot keybind press
window.addEventListener( 'keydown', function ( event ) {

  if ( x.document.activeElement && x.document.activeElement.value !== undefined ) return;

  // Handle right mouse aimbot keybind press
  if (customKeybinds.rightMouseAimbot === event.code && customKeybinds.rightMouseAimbot !== '') {
    rightMouseAimbotKeyPressed = true;
  }

} );

function toggleElementVisibility( el ) {

  el.style.display = el.style.display === '' ? 'none' : '';

}

function showMsg( name, bool ) {

  msgEl.innerText = name + ': ' + ( bool ? 'ON' : 'OFF' );

  msgEl.style.display = 'none';
  void msgEl.offsetWidth;
  msgEl.style.display = '';

}

animate();

function createGUI() {

  const guiEl = fromHtml( `<div class="zui">
    <div class="zui-header">
      <span class="zui-header-title">KRUNKAX AIMBOT</span>
      <div class="zui-window-controls">
        <div class="zui-window-btn minimize">-</div>
        <div class="zui-window-btn close">×</div>
      </div>
    </div>
    <div class="zui-tabs">
      <div class="zui-tab active" data-tab="cheats">Cheats</div>
      <div class="zui-tab" data-tab="settings">Settings</div>
      <div class="zui-tab" data-tab="keybinds" style="display:none;">Keybinds</div>
    </div>
    <div class="zui-content">
      <div class="zui-tab-content active" id="cheats-tab"></div>
      <div class="zui-tab-content" id="settings-tab"></div>
      <div class="zui-tab-content" id="keybinds-tab"></div>
    </div>
    <div class="zui-footer">Created by levifrsn63</div>
  </div>` );

  const headerEl = guiEl.querySelector( '.zui-header' );
  const cheatsContent = guiEl.querySelector( '#cheats-tab' );
  const settingsContent = guiEl.querySelector( '#settings-tab' );
  const keybindsContent = guiEl.querySelector( '#keybinds-tab' );
  const closeBtn = guiEl.querySelector( '.zui-window-btn.close' );
  const minimizeBtn = guiEl.querySelector( '.zui-window-btn.minimize' );
  const tabs = guiEl.querySelectorAll( '.zui-tab' );
  const tabContents = guiEl.querySelectorAll( '.zui-tab-content' );
  const keybindsTab = guiEl.querySelector( '.zui-tab[data-tab="keybinds"]' );

  // Tab switching
  tabs.forEach( tab => {
    tab.onclick = function() {
      tabs.forEach( t => t.classList.remove('active') );
      tabContents.forEach( tc => tc.classList.remove('active') );
      tab.classList.add('active');
      const tabName = tab.getAttribute('data-tab');
      guiEl.querySelector( `#${tabName}-tab` ).classList.add('active');
    };
  });

  // Close button
  closeBtn.onclick = function(e) {
    e.stopPropagation();
    guiEl.style.display = 'none';
  };

  // Minimize button
  minimizeBtn.onclick = function(e) {
    e.stopPropagation();
    guiEl.classList.toggle('minimized');
  };

  // Make draggable
  let isDragging = false;
  let currentX;
  let currentY;
  let initialX;
  let initialY;

  headerEl.addEventListener('mousedown', function(e) {
    if (e.target.classList.contains('zui-window-btn')) return;

    isDragging = true;
    initialX = e.clientX - guiEl.offsetLeft;
    initialY = e.clientY - guiEl.offsetTop;
  });

  document.addEventListener('mousemove', function(e) {
    if (isDragging) {
      e.preventDefault();
      currentX = e.clientX - initialX;
      currentY = e.clientY - initialY;

      guiEl.style.left = currentX + 'px';
      guiEl.style.top = currentY + 'px';
      guiEl.style.right = 'auto';
    }
  });

  document.addEventListener('mouseup', function() {
    isDragging = false;
  });

  const settingToKey = {};
  for ( const key in keyToSetting ) {
    settingToKey[ keyToSetting[ key ] ] = key;
  }

  // Define which settings go to which tab
  const cheatsSettings = ['aimbotEnabled', 'aimbotOnRightMouse', 'aimSmoothing', 'antiRecoil', 'teamCheck', 'fovCircle', 'espEnabled', 'espLines', 'wireframe'];
  const settingsTabSettings = ['fovRadius', 'aimSmoothingSpeed', 'antiRecoilOffset', 'antiRecoilAmount'];

  // Add section header helper
  function addSectionHeader(parent, title) {
    const headerEl = fromHtml( `<div class="zui-item text"><span>${title}</span></div>` );
    parent.appendChild( headerEl );
  }

  // Populate Cheats Tab
  // Master toggle button
  const masterToggle = fromHtml( `<div class="zui-item" style="background: rgba(40, 40, 40, 0.9); margin-bottom: 8px;">
    <span style="font-weight: 700; font-size: 13px;">Master Toggle</span>
    <span class="zui-item-value master-toggle-value"></span>
  </div>` );
  const masterToggleValue = masterToggle.querySelector( '.master-toggle-value' );

  function updateMasterToggle() {
    const value = settings.allHacksEnabled;
    masterToggleValue.innerText = value ? 'DISABLE HACKS' : 'ENABLE HACKS';
    masterToggleValue.style.color = value ? '#ef4444' : '#10b981';
    masterToggleValue.style.background = value ? 'rgba(239, 68, 68, 0.2)' : 'rgba(16, 185, 129, 0.2)';
  }

  masterToggle.onclick = function() {
    settings.allHacksEnabled = ! settings.allHacksEnabled;
  }
  updateMasterToggle();

  cheatsContent.appendChild( masterToggle );

  const masterP = '__allHacksEnabled';
  settings[ masterP ] = settings.allHacksEnabled;
  Object.defineProperty( settings, 'allHacksEnabled', {
    get() {
      return this[ masterP ];
    },
    set( value ) {
      this[ masterP ] = value;
      updateMasterToggle();
      saveSettings();
    }
  } );

  addSectionHeader(cheatsContent, 'Aimbot/Exploits');

  ['aimbotEnabled', 'aimbotOnRightMouse', 'aimSmoothing', 'antiRecoil', 'teamCheck'].forEach(prop => {
    let name = fromCamel( prop );
    let shortKey = settingToKey[ prop ];

    if ( shortKey ) {
      if ( shortKey.startsWith( 'Key' ) ) shortKey = shortKey.slice( 3 );
      if ( shortKey.startsWith( 'Digit' ) ) shortKey = shortKey.slice( 5 );
      name = `[${shortKey}] ${name}`;
    }

    const itemEl = fromHtml( `<div class="zui-item">
      <span>${name}</span>
      <span class="zui-item-value"></span>
    </div>` );
    const valueEl = itemEl.querySelector( '.zui-item-value' );

    function updateValueEl() {
      const value = settings[ prop ];
      valueEl.innerText = value ? 'ON' : 'OFF';
      valueEl.style.color = value ? '#10b981' : '#ef4444';
    }

    itemEl.onclick = function() {
      settings[ prop ] = ! settings[ prop ];
    }
    updateValueEl();

    cheatsContent.appendChild( itemEl );

    const p = `__${prop}`;
    settings[ p ] = settings[ prop ];
    Object.defineProperty( settings, prop, {
      get() {
        return this[ p ];
      },
      set( value ) {
        this[ p ] = value;
        updateValueEl();
        saveSettings();
      }
    } );
  });

  addSectionHeader(cheatsContent, 'ESP / Visual');

  ['fovCircle', 'espEnabled', 'espLines', 'nearestPlayerIndicator', 'wireframe'].forEach(prop => {
    let name = fromCamel( prop );
    let shortKey = settingToKey[ prop ];

    if ( shortKey ) {
      if ( shortKey.startsWith( 'Key' ) ) shortKey = shortKey.slice( 3 );
      if ( shortKey.startsWith( 'Digit' ) ) shortKey = shortKey.slice( 5 );
      name = `[${shortKey}] ${name}`;
    }

    const itemEl = fromHtml( `<div class="zui-item">
      <span>${name}</span>
      <span class="zui-item-value"></span>
    </div>` );
    const valueEl = itemEl.querySelector( '.zui-item-value' );

    function updateValueEl() {
      const value = settings[ prop ];
      valueEl.innerText = value ? 'ON' : 'OFF';
      valueEl.style.color = value ? '#10b981' : '#ef4444';
    }

    itemEl.onclick = function() {
      settings[ prop ] = ! settings[ prop ];
    }
    updateValueEl();

    cheatsContent.appendChild( itemEl );

    const p = `__${prop}`;
    settings[ p ] = settings[ prop ];

    // Create setter with proper closure
    const propName = prop; // Capture in closure
    Object.defineProperty( settings, prop, {
      get() {
        return this[ p ];
      },
      set( value ) {
        this[ p ] = value;
        updateValueEl();
        // Auto-disable aim smoothing when FOV is turned on
        if ( propName === 'fovCircle' && value === true ) {
          this.aimSmoothing = false;
        }
        saveSettings();
      }
    } );
  });

  // Populate Settings Tab with sliders

  // FOV Radius slider
  const fovSlider = fromHtml( `<div class="zui-slider-container">
    <div class="zui-slider-label">
      <span style="color: #e5e7eb;">FOV Radius</span>
      <span class="zui-slider-value">${settings.fovRadius}px</span>
    </div>
    <input type="range" min="50" max="400" value="${settings.fovRadius}" class="zui-slider" />
  </div>` );

  const fovSliderInput = fovSlider.querySelector( '.zui-slider' );
  const fovSliderValue = fovSlider.querySelector( '.zui-slider-value' );

  fovSliderInput.addEventListener( 'input', function() {
    settings.fovRadius = parseInt( fovSliderInput.value );
    fovSliderValue.innerText = fovSliderInput.value + 'px';
    saveSettings();
  });

  settingsContent.appendChild( fovSlider );

  // Aimbot Smoothing Speed slider
  const smoothSlider = fromHtml( `<div class="zui-slider-container">
    <div class="zui-slider-label">
      <span style="color: #e5e7eb;">Aimbot Smoothing Speed</span>
      <span class="zui-slider-value">${settings.aimSmoothingSpeed}%</span>
    </div>
    <input type="range" min="1" max="100" value="${settings.aimSmoothingSpeed}" class="zui-slider" />
  </div>` );

  const smoothSliderInput = smoothSlider.querySelector( '.zui-slider' );
  const smoothSliderValue = smoothSlider.querySelector( '.zui-slider-value' );

  smoothSliderInput.addEventListener( 'input', function() {
    settings.aimSmoothingSpeed = parseInt( smoothSliderInput.value );
    smoothSliderValue.innerText = smoothSliderInput.value + '%';
    saveSettings();
  });

  settingsContent.appendChild( smoothSlider );

  // Anti-Recoil Offset slider
  const recoilSlider = fromHtml( `<div class="zui-slider-container">
    <div class="zui-slider-label">
      <span style="color: #e5e7eb;">Aimbot Lock Offset</span>
      <span class="zui-slider-value">${settings.antiRecoilOffset.toFixed(1)}</span>
    </div>
    <input type="range" min="0" max="20" step="0.1" value="${settings.antiRecoilOffset}" class="zui-slider" />
  </div>` );

  const recoilSliderInput = recoilSlider.querySelector( '.zui-slider' );
  const recoilSliderValue = recoilSlider.querySelector( '.zui-slider-value' );

  recoilSliderInput.addEventListener( 'input', function() {
    settings.antiRecoilOffset = parseFloat( recoilSliderInput.value );
    recoilSliderValue.innerText = parseFloat(recoilSliderInput.value).toFixed(1);
    saveSettings();
  });

  settingsContent.appendChild( recoilSlider );

  // Anti-Recoil Amount slider
  const recoilAmountSlider = fromHtml( `<div class="zui-slider-container">
    <div class="zui-slider-label">
      <span style="color: #e5e7eb;">Anti-Recoil Strength</span>
      <span class="zui-slider-value">${settings.antiRecoilAmount}</span>
    </div>
    <input type="range" min="0" max="10" value="${settings.antiRecoilAmount}" class="zui-slider" />
  </div>` );

  const recoilAmountSliderInput = recoilAmountSlider.querySelector( '.zui-slider' );
  const recoilAmountSliderValue = recoilAmountSlider.querySelector( '.zui-slider-value' );

  recoilAmountSliderInput.addEventListener( 'input', function() {
    settings.antiRecoilAmount = parseInt( recoilAmountSliderInput.value );
    recoilAmountSliderValue.innerText = recoilAmountSliderInput.value;
    saveSettings();
  });

  settingsContent.appendChild( recoilAmountSlider );

  // iPad Mode toggle
  const iPadModeItem = fromHtml( `<div class="zui-item">
    <span>iPad Mode</span>
    <span class="zui-item-value"></span>
  </div>` );
  const iPadValueEl = iPadModeItem.querySelector( '.zui-item-value' );

  function updateIPadModeValue() {
    const value = settings.iPadMode;
    iPadValueEl.innerText = value ? 'ON' : 'OFF';
    iPadValueEl.style.color = value ? '#10b981' : '#ef4444';
  }

  iPadModeItem.onclick = function() {
    settings.iPadMode = ! settings.iPadMode;
  }
  updateIPadModeValue();

  settingsContent.appendChild( iPadModeItem );

  const iPadP = `__iPadMode`;
  settings[ iPadP ] = settings.iPadMode;
  Object.defineProperty( settings, 'iPadMode', {
    get() {
      return this[ iPadP ];
    },
    set( value ) {
      this[ iPadP ] = value;
      updateIPadModeValue();
      saveSettings();
    }
  } );

  // Clear Settings button
  const clearSettingsButton = fromHtml( `<div class="zui-item" style="justify-content: center; background: rgba(239, 68, 68, 0.2); cursor: pointer; margin-top: 10px;">
    <span style="font-weight: 600; color: #ef4444;">🗑️ Clear Settings</span>
  </div>` );

  clearSettingsButton.onclick = function() {
    if (confirm('Are you sure you want to reset all settings to defaults?')) {
      clearSettings();
      // Refresh the page to reload with default settings
      location.reload();
    }
  };

  settingsContent.appendChild( clearSettingsButton );

  // Unban button
  const unbanButton = fromHtml( `<div class="zui-item" style="justify-content: center; background: rgba(59, 130, 246, 0.2); cursor: pointer; margin-top: 10px;">
    <span style="font-weight: 600; color: #3b82f6;">🔓 Unban</span>
  </div>` );

  unbanButton.onclick = function() {
    if (confirm('Clear all cookies and storage to remove ban? The page will reload.')) {
      unban();
      // Refresh the page
      location.reload();
    }
  };

  settingsContent.appendChild( unbanButton );

  // Config Keybinds button
  const keybindsButton = fromHtml( `<div class="zui-item" style="justify-content: center;">
    <span style="font-weight: 600;">⌨️ Config Keybinds</span>
  </div>` );

  keybindsButton.onclick = function() {
    tabs.forEach( t => t.classList.remove('active') );
    tabContents.forEach( tc => tc.classList.remove('active') );
    keybindsTab.classList.add('active');
    keybindsContent.classList.add('active');
  };

  settingsContent.appendChild( keybindsButton );

  // Populate Keybinds Tab
  const backButton = fromHtml( `<div class="zui-item" style="justify-content: center; background: rgba(30, 30, 30, 0.9); cursor: pointer; font-weight: 600;">
    <span>← Back to Settings</span>
  </div>` );

  backButton.onclick = function() {
    tabs.forEach( t => t.classList.remove('active') );
    tabContents.forEach( tc => tc.classList.remove('active') );
    tabs[1].classList.add('active'); // Settings tab
    settingsContent.classList.add('active');
  };

  keybindsContent.appendChild( backButton );

  addSectionHeader(keybindsContent, 'Configure Keybinds');

  const keybindSettings = [
    { key: 'aimbotEnabled', label: 'Aimbot Enabled' },
    { key: 'aimbotOnRightMouse', label: 'Aimbot On Right Mouse' },
    { key: 'aimSmoothing', label: 'Aim Smoothing' },
    { key: 'antiRecoil', label: 'Anti Recoil' },
    { key: 'teamCheck', label: 'Team Check' },
    { key: 'espEnabled', label: 'ESP Enabled' },
    { key: 'espLines', label: 'ESP Lines' },
    { key: 'wireframe', label: 'Wireframe' },
    { key: 'fovCircle', label: 'FOV Circle' },
    { key: 'rightMouseAimbot', label: 'Right Mouse Aimbot Trigger' }
  ];

  keybindSettings.forEach(setting => {
    const defaultKey = defaultKeybinds[setting.key] || 'None';
    const currentKey = customKeybinds[setting.key] || 'None';

    const keybindItem = fromHtml( `<div class="zui-item" style="cursor: default;">
      <span>${setting.label} <span style="color: rgba(140, 140, 150, 0.7); font-size: 11px;">(${defaultKey})</span></span>
      <span class="zui-item-value keybind-value" data-setting="${setting.key}" style="cursor: pointer; min-width: 80px; text-align: center; background: rgba(60, 60, 70, 0.5); padding: 6px 12px; border-radius: 4px;">
        ${currentKey}
      </span>
    </div>` );

    const valueEl = keybindItem.querySelector('.keybind-value');

    valueEl.onclick = function(e) {
      e.stopPropagation();
      const originalValue = valueEl.innerText;
      valueEl.innerText = 'Press key...';
      valueEl.style.color = '#fbbf24';
      valueEl.style.background = 'rgba(251, 191, 36, 0.2)';

      const keyHandler = function(event) {
        event.preventDefault();
        event.stopPropagation();
        const newKey = event.code;
        customKeybinds[setting.key] = newKey;
        valueEl.innerText = newKey;
        valueEl.style.color = '#10b981';
        valueEl.style.background = 'rgba(16, 185, 129, 0.2)';

        window.removeEventListener('keydown', keyHandler);

        // Reset color after a moment
        setTimeout(() => {
          valueEl.style.color = '#e5e7eb';
          valueEl.style.background = 'rgba(60, 60, 70, 0.5)';
        }, 1000);
      };

      const escHandler = function(event) {
        if (event.code === 'Escape') {
          event.preventDefault();
          valueEl.innerText = originalValue;
          valueEl.style.color = '#e5e7eb';
          valueEl.style.background = 'rgba(60, 60, 70, 0.5)';
          window.removeEventListener('keydown', keyHandler);
          window.removeEventListener('keydown', escHandler);
        }
      };

      window.addEventListener('keydown', keyHandler, { once: true });
      window.addEventListener('keydown', escHandler);
    };

    keybindsContent.appendChild( keybindItem );
  });

  // Reset button at bottom
  const resetButton = fromHtml( `<div class="zui-item" style="justify-content: center; background: rgba(220, 80, 80, 0.3); margin-top: 10px; border: 1px solid rgba(220, 80, 80, 0.5);">
    <span style="font-weight: 600; color: rgb(220, 80, 80);">🔄 Reset to Defaults</span>
  </div>` );

  resetButton.onclick = function() {
    Object.keys(defaultKeybinds).forEach(key => {
      customKeybinds[key] = defaultKeybinds[key];
    });

    // Update all keybind displays
    keybindsContent.querySelectorAll('.keybind-value').forEach(el => {
      const settingKey = el.getAttribute('data-setting');
      el.innerText = customKeybinds[settingKey] || 'None';
      el.style.color = '#10b981';
      el.style.background = 'rgba(16, 185, 129, 0.2)';

      setTimeout(() => {
        el.style.color = '#e5e7eb';
        el.style.background = 'rgba(60, 60, 70, 0.5)';
      }, 1000);
    });
  };

  keybindsContent.appendChild( resetButton );

  return guiEl;

}

function fromCamel( text ) {

  const result = text.replace( /([A-Z])/g, ' $1' );
  return result.charAt( 0 ).toUpperCase() + result.slice( 1 );

}

function fromHtml( html ) {

  const div = document.createElement( 'div' );
  div.innerHTML = html;
  return div.children[ 0 ];

}

function toggleSetting( key ) {

  settings[ key ] = ! settings[ key ];
  showMsg( fromCamel( key ), settings[ key ] );

}