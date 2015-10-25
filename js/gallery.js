'use strict';

(function() {

  var Key = {
    'ESC': 27,
    'LEFT': 37,
    'RIGHT': 39
  };


  function clamp(value, min, max) {
    return Math.min(Math.max(value, min), max);
  }

  var Gallery = function() {
    this._element = document.querySelector('.overlay-gallery');
    this._closeBtn = document.querySelector('.overlay-gallery-close');
    this._leftBtn = document.querySelector('.overlay-gallery-control-left');
    this._rightBtn = document.querySelector('.overlay-gallery-control-right');
    this._pictureElement = document.querySelector('.overlay-gallery-preview');

    this._currentPhoto = 0;
    this._photos = [];

    this._onCloseBtnClick = this._onCloseBtnClick.bind(this);
    this._onLeftBtnClick = this._onLeftBtnClick.bind(this);
    this._onRightBtnClick = this._onRightBtnClick.bind(this);
    this._onKeyDown = this._onKeyDown.bind(this);
  };



  Gallery.prototype.setPhotos = function(photos) {
    this._photos = photos;
  };

  Gallery.prototype.setCurrentPhoto = function(index) {
    var index = clamp(index, 0, this._photos.length - 1);

    if (this._currentPhoto === index) {
      return;
    }

    this._currentPhoto = index;
    this._showCurrentPhoto();
  };

  Gallery.prototype._showCurrentPhoto = function(evt) {
    this._pictureElement.innerHTML = '';

    var imageEl = new Image();
    imageEl.src = this._photos[this._currentPhoto];

    imageEl.onload = function() {
      this._pictureElement.appendChild(imageEl);
    }.bind(this);
  };

  Gallery.prototype._onKeyDown = function(evt) {
    switch (evt.keyCode) {
      case Key.LEFT:
        this.setCurrentPhoto(this._currentPhoto - 1);
        break;
      case Key.RIGHT:
        this.setCurrentPhoto(this._currentPhoto + 1);
        break;
      case Key.ESC:
        this.hide();
        break;
      default: break;
    }
  };

  Gallery.prototype._onLeftBtnClick = function(evt) {
    evt.preventDefault();
    this.setCurrentPhoto(this._currentPhoto - 1);
  };

  Gallery.prototype._onRightBtnClick = function(evt) {
    evt.preventDefault();
    this.setCurrentPhoto(this._currentPhoto + 1);
  };

  Gallery.prototype._onCloseBtnClick = function(evt) {
    evt.preventDefault();
    this.hide();
  };

  Gallery.prototype.show = function(indexOfCurrentPhoto) {
    indexOfCurrentPhoto = indexOfCurrentPhoto || 0;

    this._element.classList.remove('invisible');
    this._closeBtn.addEventListener('click', this._onCloseBtnClick);
    this._leftBtn.addEventListener('click', this._onLeftBtnClick);
    this._rightBtn.addEventListener('click', this._onRightBtnClick);
    this._currentPhoto = indexOfCurrentPhoto;

    document.body.addEventListener('keydown', this._onKeyDown);

    this._showCurrentPhoto();
  };

  Gallery.prototype.hide = function() {
    this._element.classList.add('invisible');
    this._closeBtn.removeEventListener('click', this._onCloseBtnClick);
    this._leftBtn.removeEventListener('click', this._onLeftBtnClick);
    this._rightBtn.removeEventListener('click', this._onRightBtnClick);
    document.body.removeEventListener('keydown', this._onKeyDown);

    this._photos = [];
    this._currentPhoto = 0;
  };

  window.Gallery = Gallery;

})();
