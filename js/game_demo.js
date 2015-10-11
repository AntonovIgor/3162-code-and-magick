(function() {

  var TIMEOUT_FOR_PARALLAX = 100;
  var headerCloudsContainer = document.querySelector('.header-clouds');

  initScroll();

  function initScroll() {
    var someTimeout;
    window.addEventListener('scroll', function() {
        clearTimeout(someTimeout);
        someTimeout = setTimeout(window.dispatchEvent(new CustomEvent('hideBlockWithColouds')), TIMEOUT_FOR_PARALLAX);
    });

    window.addEventListener('hideBlockWithColouds', function() {
      changeCloudsPosition();
    })
  }

  function changeCloudsPosition() {
    if (!isVisiblePosition()) {
      return;
    }

    changeBackgroundPosition(headerCloudsContainer, getChordsForClouds());
  }

  function changeActiveParallax(active) {
    if (active) {
      initScroll();
    } else {
      window.removeEventListener('scroll', changeCloudsPosition(), false);
    }
  }

  function changeBackgroundPosition(element, newPositionX) {
    element.style.backgroundPositionX = newPositionX + 'px';
  }

  function isVisiblePosition() {
    var result = headerCloudsContainer.getBoundingClientRect().bottom > 0;

    if (!result) {
        console.log('Параллакс отключен');
        window.dispatchEvent(new CustomEvent('parallaxNeeded'));
    }

    return result;

  }

  function getChordsForClouds() {
    var STEP = 100;
    return headerCloudsContainer.getBoundingClientRect().bottom - STEP;
  }




})();
