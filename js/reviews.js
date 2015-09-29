(function() {

 var ratingStarsClassName = {
   '1': 'review-rating-one',
   '2': 'review-rating-two',
   '3': 'review-rating-three',
   '4': 'review-rating-four',
   '5': 'review-rating-five'
 };

 var REQUEST_FAILTURE_TIMEOUT = 10000;

 //Контейнер для помещения списка отзывов
 var reviewsContainer = document.querySelector('.reviews-list');

 // Скрываем блок с фильтрами
 var reviewsFilter = document.querySelector('.reviews-filter');
 showHideBlock(reviewsFilter, false);

 //Рендеринг списка отзывов
 renderReviews(reviews);

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

 function showHideBlock(element, visible) {
   !visible ?
    element.classList.add('invisible') :
    element.classList.remove('invisible');

    return element;
 }

})();
