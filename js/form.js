(function() {
  var formContainer = document.querySelector('.overlay-container');
  var formOpenButton = document.querySelector('.reviews-controls-new');
  var formCloseButton = document.querySelector('.review-form-close');

  var reviewForm = document.forms['review-form'];

  var reviewAuthor = reviewForm['review-name'];
  var reviewText   = reviewForm['review-text'];
  var reviewMarks   = reviewForm.elements['review-mark'];

  var reviewFieldsName = formContainer.querySelector('.review-fields-name');
  var reviewFieldsText = formContainer.querySelector('.review-fields-text');

  restoreValuesFromCookies([
        { name: reviewAuthor.name, element: reviewAuthor },
        { name: 'review-mark', element: reviewMarks }
  ]);

  updateInputs(reviewAuthor, reviewFieldsName);
  updateInputs(reviewText, reviewFieldsText);

  reviewAuthor.onkeyup = function(evt) {
      updateInputs(reviewAuthor, reviewFieldsName);
  }

  reviewText.onkeyup = function(evt) {
    updateInputs(reviewText, reviewFieldsText);  
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

      saveValuesToCookies([
          { name: reviewAuthor.name, element: reviewAuthor },
          { name: 'review-mark', element: reviewMarks }
      ]);

      alert("Urrraaaaa!");

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

  function restoreValuesFromCookies(arrayOfElements) {
    var saveObj;

    for (var i = 0; i < arrayOfElements.length; i++) {
      saveObj = arrayOfElements[i];

      if (Cookies.hasItem(saveObj.name)) {
        saveObj.element.value = Cookies.getItem(saveObj.name);
      }

    }
  }

  function saveValuesToCookies(arrayOfElements) {
    var saveObj;
    var myDateOfBirth = new Date(1986, 02, 12, 0, 0, 0, 0);
    var today = new Date();
    var days = Math.round((today - myDateOfBirth) / 1000 / 86400);
    var endDateForCookie = new Date(today.getFullYear(), today.getMonth(), today.getDate() + days);

    for (var i = 0; i < arrayOfElements.length; i++) {
      saveObj = arrayOfElements[i];
      Cookies.setItem(saveObj.name, saveObj.element.value, endDateForCookie);
    }

  }

  function updateInputs(inputElement, elementHint) {

    isEmptyString(inputElement.value)
      ? setElementNotValid(inputElement, elementHint)
      : setElementValid(inputElement, elementHint);

    return inputElement;

  }




})();
