'use strict';

requirejs.config({
  baseUrl: 'js'
});

define([
  'models/review',
  'models/reviews',
  'views/photo',
  'views/review',
  'views/video',
  'form',
  'gallery',
  'game',
  'game_demo',
  'reviews'
]);
