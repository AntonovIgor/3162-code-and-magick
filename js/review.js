'use strict';

(function() {

  var ratingStarsClassName = {
    '1': 'review-rating-one',
    '2': 'review-rating-two',
    '3': 'review-rating-three',
    '4': 'review-rating-four',
    '5': 'review-rating-five'
  };

  var REQUEST_FAILTURE_TIMEOUT = 10000;

  var reviewTemplate = document.getElementById('review-template');

  var Review = function(data) {
    this._data = data;
  };

  Review.prototype.render = function(container) {
    var newReviewElement = reviewTemplate.content.children[0].cloneNode(true);
    var oldAuthorPhoto = newReviewElement.querySelector('.review-author');

    newReviewElement.querySelector('.review-rating').classList.add(ratingStarsClassName[this._data['rating']]);
    newReviewElement.querySelector('.review-text').textContent = this._data['description'];

    newReviewElement.querySelector('.review-rating').classList.add(ratingStarsClassName[this._data['rating']]);
    newReviewElement.querySelector('.review-text').textContent = this._data['description'];

    if (this._data['author']['picture']) {

      var authorPicture = new Image();
      authorPicture.src = this._data['author']['picture'];
      authorPicture.width = 124;
      authorPicture.height = 124;
      authorPicture.alt = this._data['author']['name'];
      authorPicture.classList.add('review-author');

      var authorPictureLoadTimeOut = setTimeout(function() {
        newReviewElement.classList.add('review-load-failure');
      }, REQUEST_FAILTURE_TIMEOUT);

      authorPicture.onload = function() {
        newReviewElement.replaceChild(authorPicture, oldAuthorPhoto);
        clearTimeout(authorPictureLoadTimeOut);
      };
    }

    container.appendChild(newReviewElement);

    this._element = newReviewElement;

  };

  Review.prototype.unrender = function() {
    this._element.parentNode.removeChild(this._element);
    this._element = null;
  };

  window.Review = Review;



})();
