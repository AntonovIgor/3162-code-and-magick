'use strict';

define([
  'views/photo',
  'views/video'
], function(GalleryPhoto, GalleryVideo) {
  /**
  * Список констант с кодами нажатых клавиш
  * @enum {number}
  */
  var Key = {
    'ESC': 27,
    'LEFT': 37,
    'RIGHT': 39
  };


  /**
  * Функция возвращает значение между (но не больше)
  * min/max.
  * @param {number} value
  * @param {number} min
  * @param {number} max
  * @return {number}
  */
  function clamp(value, min, max) {
    return Math.min(Math.max(value, min), max);
  }

  /**
  * Конструктор объекта фотогалерии.
  * @constructor
  */
  var Gallery = function() {
    this._element = document.querySelector('.overlay-gallery');
    this._closeBtn = document.querySelector('.overlay-gallery-close');
    this._leftBtn = document.querySelector('.overlay-gallery-control-left');
    this._rightBtn = document.querySelector('.overlay-gallery-control-right');
    this._pictureElement = document.querySelector('.overlay-gallery-preview');

    this._currentPhoto = 0;
    this._photos = new Backbone.Collection();

    this._onCloseBtnClick = this._onCloseBtnClick.bind(this);
    this._onLeftBtnClick = this._onLeftBtnClick.bind(this);
    this._onRightBtnClick = this._onRightBtnClick.bind(this);
    this._onKeyDown = this._onKeyDown.bind(this);
  };

  /**
  * Устанавливает коллекцию изображений для отображения в фотогалерии.
  * В методе инициализируется коллекция с моделями.
  * @param {Array.<string>} photos
  */
  Gallery.prototype.setPhotos = function(photos) {
    this._photos.reset(photos.map(function(photoSource) {
      return new Backbone.Model({
        url: photoSource.src,
        preview: photoSource.preview
      });
    }));
  };

  /**
  * Устанавливает маркер номера изображения, которое требуется
  * отобразит. Номер определяется исходя из размера коллекции
  * установленных изображений.
  * @param {number} index
  */
  Gallery.prototype.setCurrentPhoto = function(index) {
    var newIndex = clamp(index, 0, this._photos.length - 1);

    if (this._currentPhoto === newIndex) {
      return;
    }

    this._currentPhoto = newIndex;
    this._showCurrentPhoto();
  };

  /**
  * Рендеренг текущего изображения
  * @private
  */
  Gallery.prototype._showCurrentPhoto = function() {
    this._pictureElement.innerHTML = '';

    var photoModel = this._photos.at(this._currentPhoto);
    var elForRendering;

    if (photoModel.get('preview')) {
      elForRendering = new GalleryVideo({ model: photoModel });
    } else {
      elForRendering = new GalleryPhoto({ model: photoModel });
    }

    elForRendering.render();
    // var imageEl = new GalleryPhoto({ model: this._photos.at(this._currentPhoto) });
    // imageEl.render();
    this._pictureElement.appendChild(elForRendering.el);
  };

  /**
  * Обработка клавиатурных нажатий. Переключение изображений с
  * помощью управляющих стрелок, закрытие галерии с помощью
  * ESC.
  * @param {Event} evt
  * @private
  */
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

  /**
  * Обработчик события нажатия клавиши стрелка влево
  * @param {Event} evt
  * @private
  */
  Gallery.prototype._onLeftBtnClick = function(evt) {
    evt.preventDefault();
    this.setCurrentPhoto(this._currentPhoto - 1);
  };

  /**
  * Обработчик события нажатия клавиши стрелка вправо
  * @param {Event} evt
  * @private
  */
  Gallery.prototype._onRightBtnClick = function(evt) {
    evt.preventDefault();
    this.setCurrentPhoto(this._currentPhoto + 1);
  };

  /**
  * Обработчик события закрытия окна галерии
  * @param {Event} evt
  * @private
  */
  Gallery.prototype._onCloseBtnClick = function(evt) {
    evt.preventDefault();
    this.hide();
  };

  /**
  * Метод отбображет окно фотогалерии и загружает установленное
  * фото. В методе выполняется иницилизация служебных переменных
  * и устанавливатся обработчики событий.
  * @param {number} indexOfCurrentPhoto
  */
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

  /**
  * Метод закрывает окно фотогалерии и снимает установленные обработчики
  * событий.
  */
  Gallery.prototype.hide = function() {
    this._element.classList.add('invisible');
    this._closeBtn.removeEventListener('click', this._onCloseBtnClick);
    this._leftBtn.removeEventListener('click', this._onLeftBtnClick);
    this._rightBtn.removeEventListener('click', this._onRightBtnClick);
    document.body.removeEventListener('keydown', this._onKeyDown);

    this._photos.reset();
    this._currentPhoto = 0;
  };

  return Gallery;
});
