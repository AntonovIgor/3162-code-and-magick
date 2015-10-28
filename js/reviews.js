/* global Review: true Gallery: true */
'use strict';

(function() {

  var readyState = {
    'UNSENT': 0,
    'OPENED': 1,
    'HEADERS_RECEIVED': 2,
    'LOADING': 3,
    'DONE': 4
  };

  var REQUEST_FAILTURE_TIMEOUT = 10000;
  var PAGE_SIZE = 3;
  var reviews;

  var currentReviews;
  var currentPage;

  // Контейнер для помещения списка отзывов
  var reviewsContainer = document.querySelector('.reviews-list');
  var galleryContainer = document.querySelector('.photogallery');

  var gallery = new Gallery();
  var picturesForGallery = [];

  // Скрываем блок с фильтрами
  var reviewsFilter = document.querySelector('.reviews-filter');
  var reviewsFiltersRadioBtn = reviewsFilter.elements['reviews'];

  var renderedReviews = [];

  showHideBlock(reviewsFilter, false);

  // Кнопка для загрузки дополнительных страниц
  var btnLoadNextPage = document.querySelector('.reviews-controls-more');
  showHideBlock(btnLoadNextPage, true);

  btnLoadNextPage.addEventListener('click', function() {
    if (isNextPageAvailable()) {
      renderReviews(currentReviews, currentPage++, false);
    }

    showHideBlock(btnLoadNextPage, isNextPageAvailable());
  });


 // Рендеринг списка отзывов
  loadReviewsList(function(loadedReviews) {
    reviews = loadedReviews;
    currentReviews = reviews;
    currentPage = 0;

    var filterId = localStorage.getItem('filterId') || 'reviews-all';
    setFilterForReviews(filterId);

    reviewsFiltersRadioBtn.value = filterId;

  });

  // Вновь отображаем блок с фильтрами
  showHideBlock(reviewsFilter, true);

  initFilters();
  initGallery();

  function renderReviews(arrayOfReviews, pageNumber, replace) {
    replace = typeof replace !== 'undefined' ? replace : true;
    pageNumber = pageNumber || 0;

    if (replace) {
      var el;
      while ((el = renderedReviews.shift())) {
        el.unrender();
      }

      reviewsContainer.classList.remove('reviews-load-failure');
    }

    var reviewsFragment = document.createDocumentFragment();

    var reviewsFrom = pageNumber * PAGE_SIZE;
    var reviewsTo = reviewsFrom + PAGE_SIZE;
    arrayOfReviews = arrayOfReviews.slice(reviewsFrom, reviewsTo);

    arrayOfReviews.forEach(function(item) {
      var newReviewElement = new Review(item);
      newReviewElement.render(reviewsFragment);
      renderedReviews.push(newReviewElement);
    });

    reviewsContainer.appendChild(reviewsFragment);
  }

// Загрузка списка отзывов Ajax
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

  }

  function showLoadFailture() {
    reviewsContainer.classList.add('reviews-load-failure');
  }

  function filterReviews(reviewsToFilter, filterId) {
    var filteredReviews = reviewsToFilter.slice(0);

    switch (filterId) {
      case 'reviews-good':

        filteredReviews = filteredReviews.filter(function(element) {
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
        var halfYear = new Date(today.getFullYear(), today.getMonth() - 7, today.getDate());
        filteredReviews = filteredReviews.filter(function(element) {
          return Date.parse(element.date) >= halfYear.getTime();
        });
        sortItems(filteredReviews, 'date', 'desc');
        break;

      default:

        filteredReviews = reviewsToFilter.slice(0);
        break;

    }

    localStorage.setItem('filterId', filterId);
    return filteredReviews;

  }

  function sortItems(items, property, sortType) {

    switch (sortType) {
      case 'desc':
        items.sort(function(a, b) {

          if (a[property] > b[property]) {
            return -1;
          }

          if (a[property] < b[property]) {
            return 1;
          }

        });
        break;
      case 'asc':
        items.sort(function(a, b) {

          if (a[property] > b[property]) {
            return 1;
          }

          if (a[property] < b[property]) {
            return -1;
          }
        });
        break;
      default: break;

    }

    return items;

  }

  function setFilterForReviews(filterId) {
    currentReviews = filterReviews(reviews, filterId);
    currentPage = 0;
    renderReviews(currentReviews, currentPage, true);
    showHideBlock(btnLoadNextPage, true);
  }

  function showHideBlock(element, visible) {
    if (!visible) {
      element.classList.add('invisible');
    } else {
      element.classList.remove('invisible');
    }

    return element;
  }

  function isNextPageAvailable() {
    return currentPage < Math.ceil(reviews.length / PAGE_SIZE);
  }

  function initFilters() {
    var filtersContainer = document.querySelector('.reviews-filter');

    filtersContainer.addEventListener('click', function(evt) {
      var clickedFilter = evt.target;
      setFilterForReviews(clickedFilter.id);
    });
  }

  function doesHaveParent(element, className) {
    do {
      if (element.classList.contains(className)) {
        return true;
      }

      element = element.parentElement;
    } while (element);

    return false;
  }

  // TODO
  // Таких длинных селекторов быть не должно.
  // Тем более, что ты можешь искать фотки не по всему документу, а внутри
  // .photogallery, который ты уже "нашел" и сохранил в переменную.
  function initGallery() {
    var imagesList = document.querySelectorAll('.photogallery a.photogallery-image img');
    var imagesListArray = Array.prototype.slice.call(imagesList);

    imagesListArray.forEach(function(item) {
      picturesForGallery.push(item.src);
    });

    galleryContainer.addEventListener('click', function(evt) {
      if (doesHaveParent(evt.target, 'photogallery-image')) {
        gallery.setPhotos(picturesForGallery);
        gallery.show(picturesForGallery.indexOf(evt.target.src));
      }
    });
  }

})();
