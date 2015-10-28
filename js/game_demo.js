'use strict';

(function() {

  /**
  * Время ожидания для параллакса
  * @const {number}
  */
  var TIMEOUT_FOR_PARALLAX = 100;

  /**
  * Контейнер с облаками
  */
  var headerCloudsContainer = document.querySelector('.header-clouds');

  changeCloudsPosition();
  initScroll();

  /**
  * Инициализация скролла. Если находимся в зоне видимости,  то
  * начинаем сдвигать облака
  */
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

  /**
  * Проверка текущей позиции облаков
  */
  function checkCloudPosition() {
    if (isVisiblePosition()) {
      window.dispatchEvent(new CustomEvent('hideBlockWithColouds'));
    }
  }

  /**
  * Обертка.Изменить позицию блока с облаками
  */
  function changeCloudsPosition() {
    changeBackgroundPosition(headerCloudsContainer, getChordsForClouds());
  }

  /**
  * Непосредственное изменение позиции блока с облаками
  * @param {Element} element
  * @param {number} newPositionX
  */
  function changeBackgroundPosition(element, newPositionX) {
    element.style.backgroundPosition = newPositionX + 'px top';
  }

  /**
  * Проврка области видимости
  */
  function isVisiblePosition() {
    var result = headerCloudsContainer.getBoundingClientRect().bottom > 0;
    return result;
  }

  /**
  * Определяем позицию для блока с облаками
  */
  function getChordsForClouds() {
    var STEP = 100;
    return headerCloudsContainer.getBoundingClientRect().bottom - STEP;
  }

})();
