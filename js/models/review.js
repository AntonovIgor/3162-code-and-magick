'use strict';

define(function() {

  /**
   * @constructor
   * @extends {Backbone.Model}
   */
  var ReviewModel = Backbone.Model.extend({

    /** @override */
    initialize: function() {
      if (!this.get('rating')) {
        this.set('rating', 0);
      }
    },

    /**
    * Увеличить рейтинг отзыва
    */
    ratingUp: function() {
      this.set('rating', this.get('rating') + 1);
    },

    /**
    * Уменьшить рейтинг отзыва
    */
    ratingDown: function() {
      this.set('rating', this.get('rating') - 1);
    }

  });

  return ReviewModel;

});
