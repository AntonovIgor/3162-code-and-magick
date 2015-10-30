/* global Cookies: true */
'use strict';

define(function() {
  var formContainer = document.querySelector('.overlay-container');
  var formOpenButton = document.querySelector('.reviews-controls-new');
  var formCloseButton = document.querySelector('.review-form-close');

  var reviewForm = document.forms['review-form'];

  var reviewAuthor = reviewForm['review-name'];
  var reviewText = reviewForm['review-text'];
  var reviewMarks = reviewForm.elements['review-mark'];

  var reviewFieldsName = formContainer.querySelector('.review-fields-name');
  var reviewFieldsText = formContainer.querySelector('.review-fields-text');

  Cookies.restoreValuesFromCookies([
        { name: reviewAuthor.name, element: reviewAuthor },
        { name: 'review-mark', element: reviewMarks }
  ]);

  updateInputs(reviewAuthor, reviewFieldsName);
  updateInputs(reviewText, reviewFieldsText);

  /**
  * Обработчик события нажатия любой клавиши в поле "Автор"
  */
  reviewAuthor.onkeyup = function() {
    updateInputs(reviewAuthor, reviewFieldsName);
  };

  /**
  * Обработчик события нажатия клавиши в поле "Текст отзыва"
  */
  reviewText.onkeyup = function() {
    updateInputs(reviewText, reviewFieldsText);
  };

  /**
  * Обработчик нажатия кнопки "Открыть"
  */
  formOpenButton.onclick = function(evt) {
    evt.preventDefault();
    formContainer.classList.remove('invisible');
  };

  /**
  * Обработчик нажатия кнопки "Закрыть"
  */
  formCloseButton.onclick = function(evt) {
    evt.preventDefault();
    formContainer.classList.add('invisible');
  };

  /**
  * Обработчик отправки формы
  */
  formContainer.onsubmit = function(evt) {

    evt.preventDefault();

    if (isEmptyString(reviewAuthor.value) || isEmptyString(reviewText.value)) {
      console.log('Заполните обязательные поля!');
      return;
    }

    Cookies.saveValuesToCookies([
          { name: reviewAuthor.name, element: reviewAuthor },
          { name: 'review-mark', element: reviewMarks }
    ]);

  };

  /**
  * Провяряте строку на наличие символов
  * @param {string} str
  */
  function isEmptyString(str) {

    if (!typeof str === 'string') {
      return true;
    }

    return str.trim() === '';
  }

  /**
  * Функция добавляет или удаляет произвольный класс у элемента
  * @param {Element} element
  * @param {string} addClassName
  * @param {string} removeClassName
  */
  function addRemoveClassToElement(element, addClassName, removeClassName) {
    element.classList.add(addClassName);
    element.classList.remove(removeClassName);
  }

  /**
  * Скрывает или показывает произвольный элемент
  * @param {Element} element
  * @param {boolean} visible
  * @return {Element}
  */
  function showHideElement(element, visible) {
    element.style.display = !visible ? '' : 'none';
    return element;
  }

  /**
  * Помечает произвольное поле ввода как "Невалидное"
  * @param {Element} elementInput
  * @param {Element} elementHint
  */
  function setElementNotValid(elementInput, elementHint) {
    showHideElement(elementHint, false);
    addRemoveClassToElement(elementInput, 'notify-error', 'notify-ok');
  }

  /**
  * Помечает произвольное поле ввода как "валидное"
  * @param {Element} elementInput
  * @param {Element} elementHint
  */
  function setElementValid(elementInput, elementHint) {
    showHideElement(elementHint, true);
    addRemoveClassToElement(elementInput, 'notify-ok', 'notify-error');
  }

  /**
  * Обновляет проивзольное поле ввода. Вызывает функции
  * для установки пометки для поле ввода (не/валидный).
  * @param {Element} inputElement
  * @param {Element} elementHint
  * @return {Element}
  */
  function updateInputs(inputElement, elementHint) {

    if (isEmptyString(inputElement.value)) {
      setElementNotValid(inputElement, elementHint);
    } else {
      setElementValid(inputElement, elementHint);
    }

    return inputElement;

  }
});
