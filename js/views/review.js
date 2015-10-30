'use strict';

define(function() {
  /**
  * @type {Object.<string, string>}
  */
  var ratingStarsClassName = {
    '1': 'review-rating-one',
    '2': 'review-rating-two',
    '3': 'review-rating-three',
    '4': 'review-rating-four',
    '5': 'review-rating-five'
  };

  /**
  * @const
  * @type {number}
  */
  var REQUEST_FAILTURE_TIMEOUT = 10000;

  /**
  * @type {Element}
  */
  var reviewTemplate = document.getElementById('review-template');

  /**
  * @constructor
  * @extends {Backbone.View}
  */
  var ReviewView = Backbone.View.extend({

    /**
    * @override
    */
    initialize: function() {
      this._onImageLoad = this._onImageLoad.bind(this);
      this._onClick = this._onClick.bind(this);
    },

    /**
    * @type {string}
    * @override
    */
    tagName: 'article',

    /**
    * @type {string}
    * @override
    */
    className: 'review',

    /**
    * @type {Object.<string, string>}
    */
    events: {
      'click': '_onClick'
    },

    /**
    * Отрисовка отзыва
    * @override
    */
    render: function() {
      this.el.appendChild(reviewTemplate.content.children[0].cloneNode(true));


      this.el.querySelector('.review-rating').classList.add(ratingStarsClassName[this.model.get('rating')]);
      this.el.querySelector('.review-text').textContent = this.model.get('description');

      var author = this.model.get('author');

      if (author.picture) {
        var authorPicture = new Image();
        authorPicture.src = author.picture;
        authorPicture.width = 124;
        authorPicture.height = 124;
        authorPicture.alt = author.picture.name;
        authorPicture.classList.add('review-author');

        this._authorPictureLoadTimeOut = setTimeout(function() {
          this.el.classList.add('review-load-failure');
        }.bind(this), REQUEST_FAILTURE_TIMEOUT);

        authorPicture.addEventListener('load', this._onImageLoad);

      }
    },

    /**
    * Обработчик кликов по элементу
    * @param {MouseEvent} evt
    * @private
    */
    _onClick: function(evt) {
      var targetElement = evt.target;

      if (targetElement.classList.contains('review-quiz-answer')) {
        if (targetElement.classList.contains('answer-yes')) {
          this.model.ratingUp();
        } else if (targetElement.classList.contains('answer-no')) {
          this.model.ratingDown();
        }
      }
    },

    /**
    * Обработчик загрузки изображения
    * @param {Event} evt
    * @private
    */
    _onImageLoad: function(evt) {
      clearTimeout(this._authorPictureLoadTimeOut);

      var loadedImage = evt.currentTarget;
      this._cleanupImageListeners(loadedImage);

      var authorPhoto = this.el.querySelector('.review-author');
      authorPhoto.src = loadedImage.src;
    },

    /**
    * Удаление обработчиков событий на элементе
    * @param {Image} image
    * @private
    */
    _cleanupImageListeners: function(image) {
      image.removeEventListener('load', this._onImageLoad);
    }


  });
  return ReviewView;
});
