'use strict';

define(function() {

  var GalleryPhoto = Backbone.View.extend({
    tagName: 'img',

    render: function() {
      this.el.src = this.model.get('url');
    }
  });

  return GalleryPhoto;
});
