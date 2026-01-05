// ==UserScript==
// @name img-viewer
// @namespace https://sharils.github.io/gist/
// @description img-viewer is a script for better picture-viewing experience.
// @match <all_urls>
// @version 1.0.0
// @grant none
// @noframes
// @downloadURL https://update.greasyfork.org/scripts/9648/img-viewer.user.js
// @updateURL https://update.greasyfork.org/scripts/9648/img-viewer.meta.js
// ==/UserScript==
(function(global) {
	"use strict";

	var Images = global.Sharils.Images = function() {};

	Images.prototype.scrollToNext = function() {
		var maybeImage,
			imageRect,
			viewportHeight;

		maybeImage = this._next();
		if (!maybeImage) {
			return null;
		}

		imageRect = maybeImage.getBoundingClientRect();
		viewportHeight = this._viewportHeight();
		if (maybeImage.height <= viewportHeight || 0 < maybeImage.top) {
			maybeImage.scrollIntoView();
		} else if (imageRect.bottom <= viewportHeight * 2) {
			global.scrollBy(0, imageRect.bottom - viewportHeight);
		} else {
			global.scrollBy(0, viewportHeight);

		}

		return maybeImage;
	};

	Images.prototype.scrollToPrevious = function() {
		var maybeImage;

		maybeImage = this._previous();

		if (maybeImage) {
			maybeImage.scrollIntoView();
		}

		return maybeImage;
	};

	Images.prototype._above = function(position, length) {
		return function(image) {
			return image.getBoundingClientRect()[position] <= length;
		};
	};

	Images.prototype._below = function(position, length) {
		return function(image) {
			return length <= image.getBoundingClientRect()[position];
		};
	};

	Images.prototype._compare = function(position, low, high) {
		return low.getBoundingClientRect()[position] -
			high.getBoundingClientRect()[position];
	};

	Images.prototype._documentImages = function() {
		return [].slice.call(global.document.images);
	};

	Images.prototype._max = function(position) {
		return function(low, high) {
			return this._compare(position, low, high) >= 0 ? low : high;
		}.bind(this);
	};

	Images.prototype._min = function(position) {
		return function(low, high) {
			return this._compare(position, low, high) <= 0 ? low : high;
		}.bind(this);
	};

	Images.prototype._next = function() {
		var images,
			maybeImage,
			partInViewportBelow,
			viewportBelowTop;

		viewportBelowTop = this._viewportHeight() + 1;

		partInViewportBelow = this._below("bottom", viewportBelowTop);

		images = this._documentImages();
		images = images.filter(partInViewportBelow);
		images = images.filter(this._visible);
		images = images.filter(this._notFixed);
		maybeImage = images.length ? images.reduce(this._min("top")) : null;

		return maybeImage;
	};

	Images.prototype._notFixed = function(image) {
		var imageTop,
			notFixed;

		imageTop = image.getBoundingClientRect().top;

		global.scrollBy(0, 1);

		notFixed = imageTop !== image.getBoundingClientRect().top;

		global.scrollBy(0, -1);

		return notFixed;
	};

	Images.prototype._previous = function() {
		var image,
			imageRect,
			images,
			inViewportAbove,
			maybeImage,
			partInViewportAbove,
			viewportAboveTop;

		partInViewportAbove = this._above("top", -1);

		images = this._documentImages();
		images = images.filter(partInViewportAbove);
		images = images.filter(this._visible);
		images = images.filter(this._notFixed);
		if (!images.length) {
			return null;
		}

		image = images.reduce(this._max("bottom"));
		imageRect = image.getBoundingClientRect();
		viewportAboveTop = imageRect.bottom - this._viewportHeight();
		if (imageRect.top <= viewportAboveTop) {
			return image;
		}

		inViewportAbove = this._below("top", viewportAboveTop);
		images = images.filter(inViewportAbove);
		maybeImage = images.length ? images.reduce(this._min("top")) : null;

		return maybeImage;
	};

	Images.prototype._viewportHeight = function() {
		return global.innerHeight;
	};

	Images.prototype._visible = function(image) {
		return 0 < image.getBoundingClientRect().height;
	};
})(this, this.Sharils = this.Sharils || {});
(function(global) {
	"use strict";

	var Controller = global.Sharils.Images.Controller = function(images) {
		this._onClick = this._onClick.bind(this);

		this._onImageRightClick = this._onLowerIPress =
			images.scrollToNext.bind(images);

		this._onImageLeftClick = this._onUpperIPress =
			images.scrollToPrevious.bind(images);

		this._onKeyPress = this._onKeyPress.bind(this);
	};

	Controller.prototype.addEventListeners = function() {
		global.addEventListener("click", this._onClick);
		global.addEventListener("keypress", this._onKeyPress);
	};

	Controller.prototype.removeEventListeners = function() {
		global.removeEventListener("click", this._onClick);
		global.removeEventListener("keypress", this._onKeyPress);
	};

	Controller.prototype._onClick = function(e) {
		var imageRect;

		if (e.target.nodeName !== "IMG") {
			return;
		}

		imageRect = e.target.getBoundingClientRect();
		if (e.screenX < imageRect.left + imageRect.width / 2) {
			this._onImageLeftClick();
		} else {
			this._onImageRightClick();
		}
	};

	Controller.prototype._onImageLeftClick = function() {
		// no operation is intended
	};

	Controller.prototype._onImageRightClick = function() {
		// no operation is intended
	};

	Controller.prototype._onKeyPress = function(e) {
		switch(e.charCode)
		{
			case 73:
				this._onUpperIPress();
				break;
			case 105:
				this._onLowerIPress();
				break;
		}
	};

	Controller.prototype._onLowerIPress = function() {
		// no operation is intended
	};

	Controller.prototype._onUpperIPress = function() {
		// no operation is intended
	};
})(this);
if (top === window) {
	new Sharils.Images.Controller(new Sharils.Images).addEventListeners();
}
