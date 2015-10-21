'use strict';

(function() {

  var TIMEOUT_FOR_PARALLAX = 100;
  var headerCloudsContainer = document.querySelector('.header-clouds');

  changeCloudsPosition();
  initScroll();

  function initScroll() {
    var someTimeout;
    window.addEventListener('scroll', function() {
      clearTimeout(someTimeout);
      someTimeout = setTimeout(checkCloudPosition, TIMEOUT_FOR_PARALLAX);
    });

    window.addEventListener('hideBlockWithColouds', function() {
      changeCloudsPosition();
    });
  }

  function checkCloudPosition() {
    if (isVisiblePosition()) {
      window.dispatchEvent(new CustomEvent('hideBlockWithColouds'));
    }
  }

  function changeCloudsPosition() {
    changeBackgroundPosition(headerCloudsContainer, getChordsForClouds());
  }

  function changeBackgroundPosition(element, newPositionX) {
    element.style.backgroundPosition = newPositionX + 'px';
  }

  function isVisiblePosition() {
    var result = headerCloudsContainer.getBoundingClientRect().bottom > 0;
    return result;
  }

  function getChordsForClouds() {
    var STEP = 100;
    return headerCloudsContainer.getBoundingClientRect().bottom - STEP;
  }

})();
