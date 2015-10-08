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
 var reviews;
 //var filteredReviews;

 //Контейнер для помещения списка отзывов
 var reviewsContainer = document.querySelector('.reviews-list');


 // Скрываем блок с фильтрами
 var reviewsFilter = document.querySelector('.reviews-filter');
 showHideBlock(reviewsFilter, false);

 //Рендеринг списка отзывов
 loadReviewsList(function(loadedReviews) {
   reviews = loadedReviews;
   renderReviews(reviews);
 });

 //Вновь отображаем блок с фильтрами
 showHideBlock(reviewsFilter, true);

 initFilters();


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



 function filterReviews(reviewsToFilter, filterId) {
   var filteredReviews = reviewsToFilter.slice(0);

   switch (filterId) {
     case 'reviews-good':

       filteredReviews = filteredReviews.filter(function(element, index, array) {
         return element.rating >= 3;
       });

       sortItems(filteredReviews, 'rating', 'desc');
       break;

      case 'reviews-bad':

        filteredReviews = filteredReviews.filter(function(element) {
          return element.rating <= 2;
        });

        sortItems(filteredReviews, 'rating', 'asc');
        break;

      case 'reviews-popular':

        filteredReviews = reviewsToFilter.slice(0);
        sortItems(filteredReviews, 'review-rating', 'desc');
        break;

      case 'reviews-recent':
        var today = new Date();
        var halfYear = new Date(today.getFullYear(), today.getMonth()-7, today.getDate());
        filteredReviews = filteredReviews.filter(function(element) {
          return Date.parse(element.date) >= halfYear.getTime();
        });
        sortItems(filteredReviews, 'date', 'desc');
        break;

     default:

      filteredReviews = reviewsToFilter.slice(0);
      break;

   }

   return filteredReviews;

 }

 function sortItems(items, property, sortType) {

   switch (sortType) {
     case 'desc':
       items.sort(function (a, b) {

         if (a[property] > b[property]) {
           return -1;
         };

         if (a[property] < b[property]) {
           return 1;
         }

       });
       break;
    case 'asc':
      items.sort(function (a, b) {

        if (a[property] > b[property]) {
          return 1;
        };

        if (a[property] < b[property]) {
          return -1;
        };
      });
      break;

   };

   return items;

 }

 function setFilterForReviews(filterId) {
   var filteredReviews = filterReviews(reviews, filterId);
   reviewsContainer.innerHTML = '';
   renderReviews(filteredReviews);
 }


 function showHideBlock(element, visible) {
   !visible ?
    element.classList.add('invisible') :
    element.classList.remove('invisible');

    return element;
 }

 function initFilters() {
   var filtersContainer = document.querySelector('.reviews-filter');

   filtersContainer.addEventListener('click', function(evt) {
     var clickedFilter = evt.target;
     setFilterForReviews(clickedFilter.id);
   });

 }

})();
