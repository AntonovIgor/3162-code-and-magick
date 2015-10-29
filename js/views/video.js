'use strict';

(function() {
  /**
   * @constructor
   * @param {Object} options
   */
  var GalleryVideo = Backbone.View.extend({

    /**
    * @override
    */
    initialize: function() {
      this._onClick = this._onClick.bind(this);
    },

    /**
     * Рендеринг элемента для отображения видео
     */
    render: function() {
      var videoEl = document.createElement('video');
      videoEl.autoplay = true;
      videoEl.loop = true;
      videoEl.poster = this.model.get('url');
      videoEl.src = this.model.get('preview');

      videoEl.addEventListener('click', this._onClick);
      this.el = videoEl;
    },

    /**
     * Запуск и остановка видео по клику
     * @private
     */
    _onClick: function() {

      if (this.el.paused) {
        this.el.play();
      } else {
        this.el.pause();
      }
    }

  });

  window.GalleryVideo = GalleryVideo;
})();
