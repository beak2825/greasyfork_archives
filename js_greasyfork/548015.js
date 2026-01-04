// ==UserScript==
// @name           atb-stadium-smooth-movement
// @author         omne
// @namespace      omne
// @description    Плавная визуализация атб стадиона
// @version        0.05
// @include        /^https{0,1}:\/\/((www|qrator|my)\.(heroeswm|lordswm)\.(ru|com)|178\.248\.235\.15)\/(war|warlog).php*/
// @grant          GM_xmlhttpRequest
// @license        GNU GPLv3
// @downloadURL https://update.greasyfork.org/scripts/548015/atb-stadium-smooth-movement.user.js
// @updateURL https://update.greasyfork.org/scripts/548015/atb-stadium-smooth-movement.meta.js
// ==/UserScript==
(function() {
	if (((location.pathname.indexOf("war.php") >= 0)||(location.pathname.indexOf("warlog.php") >= 0))&&(location.href.indexOf("show_enemy") == -1)) {
		var ntimerIdn = setInterval(check2, 100);
	}

	unsafeWindow.activeAnimations = 0;
	unsafeWindow.animationQueue = [];

	function setBattlePause(state) {
		unsafeWindow.gpause = state;
	}

	function check2() {
		if ((typeof(unsafeWindow.stage) !== 'undefined') && (typeof(unsafeWindow.stage.pole) !== 'undefined') && (typeof(unsafeWindow.stage.pole.onMouseMoveFlash) === "function")) {
			if (!inserted) {
				return 0;
			}

			clearInterval(ntimerIdn);

			let stadium_button = document.createElement('div');
			stadium_button.id = "stadium_button";
			stadium_button.className = "toolbars_img";
			stadium_button.style.width = document.querySelector(".toolbars_img").style.width;
			stadium_button.innerHTML = "<img src = 'https://daily.heroeswm.ru/i/stadium.png'>";
			document.querySelector("#magicbook_button_close").after(stadium_button);


			unsafeWindow.flagAtb = -1;
			let backgroundColors = ['', '#991515', '#4b66ff', '#25C953', '#BD8500', '#B000FF', '#005C13'];

			div = document.createElement('div');
			div.setAttribute('id', 'stadium');
			div.classList.add('unsafeWindow');
			document.querySelector("#full_container").prepend(div);

			div = document.createElement('div');
			div.setAttribute('id', 'stadium_close');
			div.classList.add('btn_x');
			document.querySelector("#stadium").prepend(div);

			unsafeWindow.stadium_close = function() {
				let style = document.querySelector("#stadium").style.visibility;
				document.querySelector("#stadium").style.visibility = (style == "hidden") ? "visible" : "hidden";
			}

			div = document.createElement('div');
			div.setAttribute('id', 'atb-track');
			document.querySelector("#stadium").prepend(div);

			for (let i = 90; i >= 0; i -= 10) {
				div = document.createElement('div');
				div.setAttribute('data-position', i);
				div.classList.add("track-marker");
				div.innerHTML = i;
				if (i == 0) {
					div.innerHTML += "<BR><span>ход</span>";
				}
				document.querySelector("#atb-track").prepend(div);
			}

			damageTableStyle = document.createElement('style');
			damageTableStyle.innerHTML += "#stadium {visibility:hidden;cursor: move;user-select: none;pointer-events: all;padding:40px;z-index: 5;background-color: rgb(255 255 255 / 90%);width: 500px;aspect-ratio: 1 / 1;position: absolute;} #atb-track {width: 100%;height: 100%;border: 2px solid #444;border-radius: 50%; position: relative;/*overflow: hidden;*/background:rgb(240 240 240 / 40%);}";
			damageTableStyle.innerHTML += ".atb-runner {padding:1px;border-radius: 35%;z-index:7;position: absolute;top: 0;left: 0;background-size: contain;background-repeat: no-repeat;transform: translate(-50%, -50%); /* Центрируем картинку относительно вычисленной позиции */transition: left 0.25s linear, top 0.25s linear; /* Плавное движение */}";
			damageTableStyle.innerHTML += `
			.track-marker {
				position: absolute;
				width: 35px;
				height: 25px;
				background-color: rgba(0, 0, 0, 0.7);
				color: white;
				text-align: center;
				font-size: 14px;
				line-height: 25px;
				border-radius: 3px;
				transform: translate(-50%, -50%);
				z-index: 6;
			}
			.atb-runner:hover {
				z-index: 10;
				box-shadow: 0 0 0 3px rgba(255, 215, 0, 1);
			}
			.atb-runner.is-taking-turn {
				filter: drop-shadow(0 0 8px gold);
				animation: pulse 1s infinite alternate;
			}

			@keyframes pulse {
				from { transform: translate(-50%, -50%) scale(1); }
				to { transform: translate(-50%, -50%) scale(1.2); }
			}

			.atb-runner.is-taking-turn {
				border: 2px solid gold !important;
				box-sizing: border-box;
			}
			.track-marker span {
				color: #333;
				font-weight: bold;
			}
			`;
			document.head.appendChild(damageTableStyle);


			const draggable = document.getElementById('stadium');
			let isDragging = false;
			let startX, startY, initialX, initialY;

			draggable.addEventListener('mousedown', (e) => {
			  isDragging = true;

			  startX = e.clientX;
			  startY = e.clientY;
			  initialX = draggable.offsetLeft;
			  initialY = draggable.offsetTop;
			  draggable.style.cursor = 'grabbing';
			});

			document.addEventListener('mousemove', (e) => {
			  if (!isDragging) return;

			  const newX = initialX + (e.clientX - startX);
			  const newY = initialY + (e.clientY - startY);

			  draggable.style.left = newX + 'px';
			  draggable.style.top = newY + 'px';
			});

			document.addEventListener('mouseup', () => {
			  isDragging = false;
			  draggable.style.cursor = 'move';
			});

			draggable.addEventListener('touchstart', (e) => {
			  isDragging = true;
			  startX = e.touches[0].clientX;
			  startY = e.touches[0].clientY;
			  initialX = draggable.offsetLeft;
			  initialY = draggable.offsetTop;
			  e.preventDefault();
			});

			document.addEventListener('touchmove', (e) => {
			  if (!isDragging) return;
			  const newX = initialX + (e.touches[0].clientX - startX);
			  const newY = initialY + (e.touches[0].clientY - startY);
			  draggable.style.left = newX + 'px';
			  draggable.style.top = newY + 'px';
			  e.preventDefault();
			});

			document.addEventListener('touchend', () => {
			  isDragging = false;
			});

			function updateStadium() {
				if (unsafeWindow.activeAnimations > 0 || unsafeWindow.animationQueue.length > 0) {
					unsafeWindow.animationQueue.push(() => processStadiumUpdate());
					return;
				}
				processStadiumUpdate();
				positionTrackMarkers();
			}

			function processStadiumUpdate() {
				setBattlePause(true);

				let hasAnimations = false;
				let backgroundColors = ['', '#991515', '#4b66ff', '#25C953', '#BD8500', '#B000FF', '#005C13'];

				for (let k in unsafeWindow.stage.pole.obj) {
					let unit = unsafeWindow.stage.pole.obj[k];
					if (unit.warmachine != undefined || unit.building != undefined ||
						unit.bonus != undefined || unit.anim == undefined ||
						unit.maxinit == 0 || unit.x > 40) continue;

					let runnerElement = document.querySelector(`.atb-runner[data-id="${k}"]`);

					if (runnerElement === null) {
						runnerElement = document.createElement('div');
						runnerElement.innerHTML = "<img style='border-radius:40%' width='40px' src='/i/portraits/" + unit.anim + "p40.png'>";
						runnerElement.setAttribute('data-id', k);
						runnerElement.setAttribute('data-current-pos', '0'); // Инициализируем позицию
						runnerElement.classList.add('atb-runner');
						runnerElement.style.backgroundColor = backgroundColors[unit.owner % 2 * (-1) + 2];
						document.getElementById('atb-track').prepend(runnerElement);
					}

					if (unit.nownumber == 0) {
						runnerElement.style.display = "none";
						continue;
					} else {
						runnerElement.style.display = "block";
					}


					if (unit.nowinit <= 0) {
						runnerElement.classList.add('is-taking-turn');
					} else {
						runnerElement.classList.remove('is-taking-turn');
					}

					let currentPosition = (parseFloat(runnerElement.getAttribute('data-current-pos') || '0') + 100) % 100;
					let targetPosition = (unit.nowinit + 100) % 100;

					const shouldAnimate = Math.abs(currentPosition - targetPosition) > 0.1 &&
										 runnerElement.hasAttribute('data-initialized');



					if (!runnerElement.hasAttribute('data-initialized')) {
						runnerElement.setAttribute('data-current-pos', targetPosition);
						runnerElement.setAttribute('data-initialized', 'true');

						const track = document.getElementById('atb-track');
						const a = track.offsetWidth / 2;
						const b = track.offsetHeight / 2;
						const angle = 2 * Math.PI * (targetPosition / 100) - Math.PI / 2;
						const x = a + a * Math.cos(angle);
						const y = b + b * Math.sin(angle);

						runnerElement.style.left = x + 'px';
						runnerElement.style.top = y + 'px';
						continue;
					}

					if (shouldAnimate) {
						startSmoothAnimation(k, currentPosition, targetPosition, runnerElement);
						hasAnimations = true;
					}
				}

				if (!hasAnimations) {
					setTimeout(() => {
						setBattlePause(false);

						if (unsafeWindow.animationQueue.length > 0) {
							const nextAnimation = unsafeWindow.animationQueue.shift();
							setTimeout(nextAnimation, 50);
						}
					}, 50);
				}
			}


			function startSmoothAnimation(unitId, startPos, endPos, element) {

				if (!element || !element.isConnected) {
					unsafeWindow.activeAnimations = Math.max(0, unsafeWindow.activeAnimations - 1);
					return;
				}

				let distanceForward = (endPos - startPos + 100) % 100;
				let distanceBackward = (startPos - endPos + 100) % 100;

				if (startPos < endPos) {
					startPos += 100;
				}

				unsafeWindow.activeAnimations++;

				const duration = (startPos - endPos)*80;
				const startTime = Date.now();

				function animate() {

					if (!element || !element.isConnected) {
						unsafeWindow.activeAnimations = Math.max(0, unsafeWindow.activeAnimations - 1);
						return;
					}

					const currentTime = Date.now();
					const elapsed = currentTime - startTime;
					let progress = Math.min(elapsed / duration, 1);

					const easedProgress = progress < 0.5
						? 2 * progress * progress
						: 1 - Math.pow(-2 * progress + 2, 2) / 2;

					let currentPosition = startPos + (endPos - startPos) * easedProgress;
					let displayPosition = currentPosition % 100;

					element.setAttribute('data-current-pos', displayPosition);

					const track = document.getElementById('atb-track');
					const a = track.offsetWidth / 2;
					const b = track.offsetHeight / 2;
					const angle = 2 * Math.PI * (displayPosition / 100) - Math.PI / 2;
					const x = a + a * Math.cos(angle);
					const y = b + b * Math.sin(angle);

					element.style.left = x + 'px';
					element.style.top = y + 'px';

					if (progress < 1) {
						requestAnimationFrame(animate);
					} else {
						unsafeWindow.activeAnimations--;
						element.setAttribute('data-current-pos', endPos % 100);

						if (unsafeWindow.activeAnimations === 0) {
							setBattlePause(false);

							if (unsafeWindow.animationQueue.length > 0) {
								const nextAnimation = unsafeWindow.animationQueue.shift();
								nextAnimation();
							}
						}
					}
				}
				requestAnimationFrame(animate);
			}



			function positionTrackMarkers() {
				const track = document.getElementById('atb-track');
				const trackWidth = track.offsetWidth*0.9;
				const trackHeight = track.offsetHeight*0.9;
				const a = trackWidth / 2;
				const b = trackHeight / 2;

				const offsetFactor = 0.7;
				const markers = document.querySelectorAll('.track-marker');

				const posX = [26, 11, 11, 26, 50, 74, 89, 89, 74, 50];
				const posY = [16, 36, 64, 84, 92, 84, 64, 36, 16, 8];

				markers.forEach(marker => {
					let position = 100 - parseInt(marker.getAttribute('data-position'));
					let x = 0;
					let y = 0;
					marker.style.left = posX[9 - (position/10%10).toFixed(0)] + "%";
					marker.style.top = posY[9 - (position/10%10).toFixed(0)] + "%";
				});
			}

			let isHandlerAttached = false;
			function startATBLoop() {
				setInterval(() => {
					if (!unsafeWindow.gPause) {
						updateStadium();
					}
					const div1 = document.getElementById('stadium_close');
					const div2 = document.getElementById('stadium_button');
					if (div1 && div2 && !isHandlerAttached) {
						div1.addEventListener("mouseup", unsafeWindow.stadium_close);
						div2.addEventListener("mouseup", unsafeWindow.stadium_close);
						isHandlerAttached = true;
						// updateOrientation();
					}
				}, 50);
			}
			startATBLoop();
		}
	}
})();