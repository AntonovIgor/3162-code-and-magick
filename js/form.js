(function() {
  var formContainer = document.querySelector('.overlay-container');
  var formOpenButton = document.querySelector('.reviews-controls-new');
  var formCloseButton = document.querySelector('.review-form-close');


  var reviewAuthor = formContainer.querySelector('#review-name');
  var reviewText   = formContainer.querySelector('#review-text');

  var reviewFieldsName = formContainer.querySelector('.review-fields-name');
  var reviewFieldsText = formContainer.querySelector('.review-fields-text');


  reviewAuthor.onkeyup = function(evt) {

      isEmptyString(reviewAuthor.value)
        ? setElementNotValid(reviewAuthor, reviewFieldsName)
        : setElementValid(reviewAuthor, reviewFieldsName)
  }

  reviewText.onkeyup = function(evt) {
    isEmptyString(reviewText.value)
      ? setElementNotValid(reviewText, reviewFieldsText)
      : setElementValid(reviewText, reviewFieldsText);
  }

  formOpenButton.onclick = function(evt) {
    evt.preventDefault();
    formContainer.classList.remove('invisible');
  };

  formCloseButton.onclick = function(evt) {
    evt.preventDefault();
    formContainer.classList.add('invisible');
  };

  formContainer.onsubmit = function(evt) {

      evt.preventDefault();

      if (isEmptyString(reviewAuthor.value) || isEmptyString(reviewText.value)) {
          alert('Заполните обязательные поля!');
          return;
      }

      formContainer.submit();

  };

  function isEmptyString(str) {

      if (!typeof str  == 'string') {
        return true;
      }

      return str.trim() === "";
  }

  function addRemoveClassToElement(element, addClassName, removeClassName) {
    element.classList.add(addClassName);
    element.classList.remove(removeClassName);
  }

  function showHideElement(element, visible) {
    element.style.display = !visible ? '' : 'none';
    return element;
  }

  function setElementNotValid(elementInput, elementHint) {
    showHideElement(elementHint, false);
    addRemoveClassToElement(elementInput, 'notify-error', 'notify-ok');
  }

  function setElementValid(elementInput, elementHint) {
    showHideElement(elementHint, true);
    addRemoveClassToElement(elementInput, 'notify-ok', 'notify-error');
  }


})();
