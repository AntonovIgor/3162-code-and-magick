'use strict';

define([
  'game'
], function(GameData) {
  /**
  * Время ожидания для параллакса
  * @const {number}
  */
  var TIMEOUT_FOR_PARALLAX = 100;

  /**
   * ID возможных ответов функций, проверяющих успех прохождения уровня.
   * CONTINUE говорит о том, что раунд не закончен и игру нужно продолжать,
   * WIN о том, что раунд выигран, FAIL — о поражении. PAUSE о том, что игру
   * нужно прервать.
   * @enum {number}
   */
  var Verdict = {
    'CONTINUE': 0,
    'WIN': 1,
    'FAIL': 2,
    'PAUSE': 3,
    'INTRO': 4
  };

  /**
  * Инициализация игрового мира
  * @type {Game}
  */
  var game = new GameData.Game(document.querySelector('.demo'));

  /**
  * Контейнер с облаками
  */
  var headerCloudsContainer = document.querySelector('.header-clouds');

  changeCloudsPosition();
  initScroll();
  initGame();

  /**
  * Инициализация игры
  */
  function initGame() {
    game.initializeLevelAndStart();
    game.setGameStatus(Verdict.INTRO);
  }
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
      game.setGameStatus(Verdict.CONTINUE);
      window.dispatchEvent(new CustomEvent('hideBlockWithColouds'));
    } else {
      game.setGameStatus(Verdict.PAUSE);
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
});
