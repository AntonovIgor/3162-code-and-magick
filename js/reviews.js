(function() {

 var ratingStarsClassName = {
   '1': 'review-rating-one',
   '2': 'review-rating-two',
   '3': 'review-rating-three',
   '4': 'review-rating-four',
   '5': 'review-rating-five'
 };

 var readyState = {
   'UNSENT': 0,
   'OPENED': 1,
   'HEADERS_RECEIVED': 2,
   'LOADING': 3,
   'DONE': 4
 };

 var REQUEST_FAILTURE_TIMEOUT = 10000;

 //Контейнер для помещения списка отзывов
 var reviewsContainer = document.querySelector('.reviews-list');

 // Скрываем блок с фильтрами
 var reviewsFilter = document.querySelector('.reviews-filter');
 showHideBlock(reviewsFilter, false);

 //Рендеринг списка отзывов
 loadReviewsList(function(loadedReviews) {
   renderReviews(loadedReviews);
 });

 //Вновь отображаем блок с фильтрами
 showHideBlock(reviewsFilter, true);


 function renderReviews(arrayOfReviews) {
   var reviewTemplate = document.getElementById('review-template');
   var reviewsFragment = document.createDocumentFragment();

   arrayOfReviews.forEach(function(item) {
     var newReviewElement = reviewTemplate.content.children[0].cloneNode(true);
     var oldAuthorPhoto = newReviewElement.querySelector('.review-author');


     newReviewElement.querySelector('.review-rating').classList.add(ratingStarsClassName[item['rating']]);
     newReviewElement.querySelector('.review-text').textContent = item['description'];

     if (item['author']['picture']) {

      var authorPicture = new Image();
      authorPicture.src = item['author']['picture'];
      authorPicture.width = 124;
      authorPicture.height = 124;
      authorPicture.alt = item['author']['name'];
      authorPicture.classList.add('review-author');

      var authorPictureLoadTimeOut = setTimeout(function() {
        newReviewElement.classList.add('review-load-failure');
      }, REQUEST_FAILTURE_TIMEOUT);

      authorPicture.onload = function() {
        newReviewElement.replaceChild(authorPicture, oldAuthorPhoto);
        clearTimeout(authorPictureLoadTimeOut);
      };

     reviewsFragment.appendChild(newReviewElement);

   };

   reviewsContainer.appendChild(reviewsFragment);
 });

 };

//Загрузка списка отзывов Ajax
function loadReviewsList(callback) {
  var xhr = new XMLHttpRequest();
  xhr.timeout = REQUEST_FAILTURE_TIMEOUT;
  xhr.open('get', 'data/reviews.json');
  xhr.send();

  xhr.onreadystatechange = function(evt) {
    var loadedXhr = evt.target;

    switch (loadedXhr.readyState) {
      case readyState.OPENED:
      case readyState.HEADERS_RECEIVED:
      case readyState.LOADING:
        reviewsContainer.classList.add('reviews-list-loading');
        break;
      case readyState.DONE:
      default:
        if (xhr.status === 200) {
          var receivedData = loadedXhr.response;
          reviewsContainer.classList.remove('reviews-list-loading');
          callback(JSON.parse(receivedData));
        }

        if (xhr.status > 400) {
          showLoadFailture();
        }
        break;
    }
  };

  xhr.ontimeout = function() {
    showLoadFailture();
  };

};

 function showLoadFailture() {
   reviewsContainer.classList.add('reviews-load-failure')
 }



 function setFilterToReviews(reviewsToFilter, filterName) {
   var filteredReviews = reviewsToFilter.slice(0);
   switch (filterName) {
     case 'reviews-good':


       break;
     default:

   }
 }


 function showHideBlock(element, visible) {
   !visible ?
    element.classList.add('invisible') :
    element.classList.remove('invisible');

    return element;
 }

 function initFilters() {
   var filtersContainer = document.querySelector('.reviews-filter');

   //todo написать инициализацию фильтров
 }

})();
