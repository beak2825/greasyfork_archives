// ==UserScript==
// @name        Xmas Town Optimized (fixed)
// @version     2025.2.0
// @description Stable notification for items near you in Christmas Town (fixed item name and position parsing, and added an arrow that points to the nearest item)
// @match       https://www.torn.com/christmas_town.php*
// @grant       GM_addStyle
// @grant       GM_getValue
// @grant       GM_setValue
// @grant       GM_registerMenuCommand
// @namespace https://greasyfork.org/users/1540915
// @downloadURL https://update.greasyfork.org/scripts/559685/Xmas%20Town%20Optimized%20%28fixed%29.user.js
// @updateURL https://update.greasyfork.org/scripts/559685/Xmas%20Town%20Optimized%20%28fixed%29.meta.js
// ==/UserScript==

'use strict';

/* ---------------- CONFIG ---------------- */
let playerId = GM_getValue('playerId', null);

GM_registerMenuCommand('Set Player ID', () => {
  const input = prompt('Enter your Torn Player ID:', playerId || '');
  if (input !== null) {
    const id = input.trim();
    if (/^\d+$/.test(id)) {
      playerId = id;
      GM_setValue('playerId', id);
      alert(`Player ID set to: ${id}`);
    } else if (id === '') {
      playerId = null;
      GM_setValue('playerId', null);
      alert('Player ID cleared.');
    } else {
      alert('Invalid Player ID. Please enter a numeric ID.');
    }
  }
});

GM_registerMenuCommand('Debug: Show Position Info', () => {
  const info = [];

  // Check player element by ID
  if (playerId) {
    const playerEl = document.getElementById(`ctUser${playerId}`);
    if (playerEl) {
      info.push(`Player element found: ctUser${playerId}`);
      info.push(`Transform: ${playerEl.style.transform}`);
    } else {
      info.push(`Player element NOT found: ctUser${playerId}`);
    }
  } else {
    info.push('No Player ID configured');
  }

  // Check position span
  const posSpan = document.querySelector("span[class^='position___']");
  if (posSpan) {
    info.push(`Position span found: "${posSpan.textContent}"`);
  } else {
    info.push('Position span NOT found');
  }

  // Check items
  const items = document.querySelectorAll(".items-layer .ct-item");
  info.push(`Items found: ${items.length}`);
  items.forEach((el, i) => {
    const img = el.querySelector("img");
    info.push(`  Item ${i}: left=${el.style.left}, top=${el.style.top}, src=${img?.src || 'no-img'}`);
  });

  alert(info.join('\n'));
});

/* ---------------- CSS ---------------- */
GM_addStyle(`
.ct-item.pulse::after {
  content: "";
  position: absolute;
  inset: -12px;
  border-radius: 50%;
  background: radial-gradient(rgba(255,215,0,0.8), rgba(255,215,0,0));
  animation: pulse 1.8s infinite;
  pointer-events: none;
}

@keyframes pulse {
  0% { opacity: 0.3; }
  50% { opacity: 1; }
  100% { opacity: 0.3; }
}

#cmasnoti ul li { padding-bottom: 8px; }

/* Directional arrow indicator */
.ct-arrow-indicator {
  position: absolute;
  width: 30px;
  height: 30px;
  pointer-events: none;
  z-index: 1000;
  transition: transform 0.3s ease-out, opacity 0.3s ease-out;
  /* Center the arrow on the player, then offset by orbit radius */
  /* We'll set the actual transform via JS */
}

.ct-arrow-indicator svg {
  width: 100%;
  height: 100%;
  filter: drop-shadow(0 0 3px rgba(0,0,0,0.5));
}
`);

/* ---------------- ITEM NAME DETECTION ---------------- */
function getItemName(src) {
  if (!src) return "Item";

  // Check for new animated gif paths
  if (src.includes('/christmas_town/gifts/animated/')) {
    return "Gift";
  }
  if (src.includes('/christmas_town/chests/animated/')) {
    return "Chest";
  }
  if (src.includes('/christmas_town/keys/animated/')) {
    return "Key";
  }

  // Fallback: try to extract something meaningful from the path
  if (src.includes('gift')) return "Gift";
  if (src.includes('chest')) return "Chest";
  if (src.includes('key')) return "Key";

  return "Item";
}

/* ---------------- POSITION HELPERS ---------------- */
function parseTransform(transform) {
  // Parse transform: translate(Xpx, Ypx) and return grid coordinates
  if (!transform) return null;

  const match = transform.match(/translate\(\s*(-?\d+(?:\.\d+)?)\s*px\s*,\s*(-?\d+(?:\.\d+)?)\s*px\s*\)/);
  if (!match) return null;

  const pixelX = parseFloat(match[1]);
  const pixelY = parseFloat(match[2]);

  // Convert pixels to grid: x = pixels/30, y = -pixels/30 (y is inverted)
  const gridX = Math.round(pixelX / 30);
  const gridY = Math.round(pixelY / -30);

  return { x: gridX, y: gridY };
}

function getPlayerPos() {
  // Try to get position from player element using configured ID
  if (playerId) {
    const playerEl = document.getElementById(`ctUser${playerId}`);
    if (playerEl) {
      const pos = parseTransform(playerEl.style.transform);
      if (pos) return pos;
    }
  }

  // Fallback: try to find position from the position display span
  const posSpan = document.querySelector("span[class^='position___']");
  if (posSpan) {
    const match = posSpan.textContent.match(/(-?\d+)\s*,\s*(-?\d+)/);
    if (match) {
      return { x: parseInt(match[1]), y: parseInt(match[2]) };
    }
  }

  // Fallback: try to find the last .ct-user in .users-layer
  const usersLayer = document.querySelector('.users-layer');
  if (usersLayer) {
    const users = usersLayer.querySelectorAll('.ct-user');
    if (users.length > 0) {
      const lastUser = users[users.length - 1];
      const pos = parseTransform(lastUser.style.transform);
      if (pos) return pos;
    }
  }

  return null;
}

function getItemPos(el) {
  // Items use left/top style attributes (pixel values)
  // Same coordinate system as player transform:
  //   left = gridX * 30
  //   top = gridY * -30 (already negative for positive Y)
  const left = parseInt(el.style.left) || 0;
  const top = parseInt(el.style.top) || 0;

  const gridX = Math.round(left / 30);
  const gridY = Math.round(top / -30);

  return { x: gridX, y: gridY };
}

function getNpcPos(npcEl) {
  // NPCs use transform like players
  return parseTransform(npcEl.style.transform);
}

function formatPos(pos) {
  if (!pos) return "?";
  return `${pos.x},${pos.y}`;
}

/* ---------------- ARROW INDICATOR ---------------- */
const ORBIT_RADIUS = 30; // pixels from player center

function createArrowElement() {
  const arrow = document.createElement('div');
  arrow.className = 'ct-arrow-indicator';
  arrow.innerHTML = `
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="lime" class="bi bi-arrow-right-short" viewBox="0 0 16 16">
      <path fill-rule="evenodd" d="M4 8a.5.5 0 0 1 .5-.5h5.793L8.146 5.354a.5.5 0 1 1 .708-.708l3 3a.5.5 0 0 1 0 .708l-3 3a.5.5 0 0 1-.708-.708L10.293 8.5H4.5A.5.5 0 0 1 4 8"/>
    </svg>
  `;
  arrow.style.display = 'none';
  return arrow;
}

let arrowElement = null;
let currentArrowAngle = 0; // Track current angle for smooth transitions

function getArrowElement() {
  if (arrowElement) return arrowElement;

  // Find or wait for player element to attach arrow to
  const playerEl = playerId ? document.getElementById(`ctUser${playerId}`) : null;
  if (!playerEl) return null;

  arrowElement = createArrowElement();
  playerEl.appendChild(arrowElement);
  return arrowElement;
}

function calculateAngleToTarget(playerPos, targetPos) {
  // Calculate direction vector from player to target
  const dx = targetPos.x - playerPos.x;
  const dy = targetPos.y - playerPos.y;

  // atan2 gives angle in radians, where 0 = positive X axis (right)
  // Note: In grid coords, +Y is up, but atan2 expects standard math coords
  // Our grid: +X = right, +Y = up
  // atan2(dy, dx) where dy = target.y - player.y, dx = target.x - player.x
  const angleRad = Math.atan2(dy, dx);
  const angleDeg = angleRad * (180 / Math.PI);

  return angleDeg;
}

function normalizeAngle(angle) {
  // Normalize angle to -180 to 180 range
  while (angle > 180) angle -= 360;
  while (angle < -180) angle += 360;
  return angle;
}

function shortestAngleDelta(from, to) {
  // Find the shortest rotation direction
  let delta = normalizeAngle(to - from);
  return delta;
}

function updateArrowIndicator(playerPos, items) {
  const arrow = getArrowElement();
  if (!arrow) return;

  if (!playerPos || items.length === 0) {
    arrow.style.display = 'none';
    return;
  }

  // Find nearest item
  let nearestItem = null;
  let nearestDist = Infinity;

  items.forEach(el => {
    const itemPos = getItemPos(el);
    const dx = itemPos.x - playerPos.x;
    const dy = itemPos.y - playerPos.y;
    const dist = Math.sqrt(dx * dx + dy * dy);

    if (dist < nearestDist) {
      nearestDist = dist;
      nearestItem = itemPos;
    }
  });

  if (!nearestItem || nearestDist === 0) {
    arrow.style.display = 'none';
    return;
  }

  // Calculate opacity based on distance (fade when within 10 units)
  // 10+ units = opacity 1.0, 1 unit = opacity 0.55, 0 units = hidden
  // Range maps to 0.5-1.0 opacity
  let opacity = 1;
  if (nearestDist <= 10) {
    opacity = 0.5 + (nearestDist / 10) * 0.5; // Linear fade: 10->1.0, 5->0.75, 1->0.55
  }

  // Calculate angle to nearest item
  const targetAngle = calculateAngleToTarget(playerPos, nearestItem);

  // Calculate shortest rotation path
  const delta = shortestAngleDelta(currentArrowAngle, targetAngle);
  currentArrowAngle = currentArrowAngle + delta;

  // Convert angle to radians for positioning
  const angleRad = currentArrowAngle * (Math.PI / 180);

  // Calculate orbital position
  // Arrow orbits around player center
  // Player element has width: 8px, height: 14px with margins
  // We'll offset from the center of the player element
  const orbitX = Math.cos(angleRad) * ORBIT_RADIUS;
  const orbitY = -Math.sin(angleRad) * ORBIT_RADIUS; // Negate because CSS Y is inverted

  // Position arrow: center it (-15px for half of 30px), then apply orbit offset
  const offsetX = orbitX - 11;
  const offsetY = orbitY - 25;

  // The arrow SVG points right by default (0°)
  // We need to rotate it to point toward the target
  // In CSS, positive rotation is clockwise, but our angle system has positive as counter-clockwise
  // So we negate the angle for CSS rotation
  const cssRotation = -currentArrowAngle;

  arrow.style.transform = `translate(${offsetX}px, ${offsetY}px) rotate(${cssRotation}deg)`;
  arrow.style.opacity = opacity;
  arrow.style.display = 'block';
}

/* ---------------- UI ---------------- */
const panel = document.createElement("div");
panel.id = "cmasnoti";
panel.style.display = "none";
panel.innerHTML = `
<div class="title-green top-round">
<i class="ct-christmastown-icon"></i>
<span>Nearby</span>
</div>
<div class="bottom-round cont-gray p10">
<ul></ul>
</div>
<hr class="page-head-delimiter m-top10">
`;
document.querySelector(".content-wrapper")?.prepend(panel);

const list = panel.querySelector("ul");

/* ---------------- SCAN (THROTTLED) ---------------- */
let lastScan = 0;
const SCAN_DELAY = 900;

function scan() {
  const now = Date.now();
  if (now - lastScan < SCAN_DELAY) return;
  lastScan = now;

  list.innerHTML = "";

  const items = document.querySelectorAll(".items-layer .ct-item");
  const npcs = document.querySelectorAll(".npc");

  if (!items.length && !npcs.length) {
    panel.style.display = "none";
    updateArrowIndicator(null, []);
    return;
  }

  panel.style.display = "block";

  const playerPos = getPlayerPos();

  // Update arrow indicator to point at nearest item
  updateArrowIndicator(playerPos, Array.from(items));

  items.forEach(el => {
    el.classList.add("pulse");
    const img = el.querySelector("img");
    const name = getItemName(img?.src);
    const itemPos = getItemPos(el);

    list.insertAdjacentHTML(
      "beforeend",
      `<li>You found <strong>${name}</strong> at <strong>${formatPos(itemPos)}</strong></li>`
    );
  });

  npcs.forEach(npc => {
    const html = npc.innerHTML.toLowerCase();
    const npcPos = getNpcPos(npc);
    const posStr = formatPos(npcPos);

    if (html.includes("santa")) {
      list.insertAdjacentHTML("beforeend",
        `<li>Santa nearby at <strong>${posStr}</strong></li>`);
    }
    if (html.includes("grinch")) {
      list.insertAdjacentHTML("beforeend",
        `<li><strong>Grinch nearby</strong> at <strong>${posStr}</strong></li>`);
    }
  });
}

/* ---------------- OBSERVER ---------------- */
const root = document.getElementById("christmastownroot");
if (root) {
  new MutationObserver(scan).observe(root, {
    childList: true,
    subtree: true
  });

  // Initial scan
  scan();
}

// Also observe the #world element for transform changes (player movement)
// This provides more responsive arrow updates when moving
function observeWorldMovement() {
  const world = document.getElementById('world');
  if (!world) {
    // Retry until world element exists
    setTimeout(observeWorldMovement, 500);
    return;
  }

  let moveTimeout = null;
  const observer = new MutationObserver((mutations) => {
    // Only react to style changes on the #world element itself
    for (const mutation of mutations) {
      if (mutation.target !== world) continue;

      // Cancel any pending update
      if (moveTimeout) clearTimeout(moveTimeout);

      // Parse transition duration from the world element's style
      // Format: "transform Xs linear" or "transform Xms linear"
      let delayMs = 50; // Default fallback
      const transition = world.style.transition || '';
      const match = transition.match(/transform\s+([\d.]+)(s|ms)/);
      if (match) {
        const value = parseFloat(match[1]);
        const unit = match[2];
        delayMs = unit === 's' ? value * 1000 : value;
      }

      // Wait for transition to complete before updating arrow
      moveTimeout = setTimeout(() => {
        const items = document.querySelectorAll(".items-layer .ct-item");
        const playerPos = getPlayerPos();
        updateArrowIndicator(playerPos, Array.from(items));
      }, delayMs);
      break;
    }
  });

  // Only observe attributes on the #world element itself, not its children
  observer.observe(world, {
    attributes: true,
    attributeFilter: ['style'],
    subtree: false  // Important: don't observe children
  });
}

observeWorldMovement();