/* global Gallery: true ReviewsCollection: true ReviewView: true */
'use strict';

(function() {


  /**
   * @const
   * @type {number}
  */
  var REQUEST_FAILTURE_TIMEOUT = 10000;

  /**
  * @const
  * @type {number}
  */
  var PAGE_SIZE = 3;

  /**
  * @type {number}
  */
  var currentPage = 0;

  /**
  * @type {Element}
  */
  var reviewsContainer = document.querySelector('.reviews-list');

  /**
  * @type {Element}
  */
  var galleryContainer = document.querySelector('.photogallery');

  /**
  * @type {Gallery}
  */
  var gallery = new Gallery();

  /**
  * @type {Array}
  */
  var picturesForGallery = [];

  /**
  * @type {Element}
  */
  var reviewsFilter = document.querySelector('.reviews-filter');

  /**
  * @type {Element}
  */
  var reviewsFiltersRadioBtn = reviewsFilter.elements['reviews'];

  /**
  * @type {ReviewsCollection}
  */
  var reviewsCollection = new ReviewsCollection();

  /**
  * @type {Array.<Object>}
  */
  var initiallyLoaded = [];

  /**
  * @type {Array.<ReviewView>}
  */
  var renderedViews = [];

  /**
  * @type {Element}
  */
  var btnLoadNextPage = document.querySelector('.reviews-controls-more');



  showHideBlock(reviewsFilter, false);
  showHideBlock(btnLoadNextPage, true);

  reviewsCollection.fetch({ timeout: REQUEST_FAILTURE_TIMEOUT }).success(function(loaded, state, jqXHR) {
    initiallyLoaded = jqXHR.responseJSON;

    initFilters();
    setActiveFilter(localStorage.getItem('filterId') || 'sort-by-default');

  }).fail(function() {
    showLoadFailture();
  });

  showHideBlock(reviewsFilter, true);
  initGallery();
  initBtnLoadNextPage();



  /**
  * Инициализация кнопки для загрузки дополнительных отзывов
  */
  function initBtnLoadNextPage() {
    btnLoadNextPage.addEventListener('click', function() {
      if (isNextPageAvailable()) {
        renderReviews(currentPage++, false);
      }

      showHideBlock(btnLoadNextPage, isNextPageAvailable());
    });
  }

  /**
  * Постраничный вывод отзывов
  * @param {number} pageNumber
  * @param {boolean=} replace
  */
  function renderReviews(pageNumber, replace) {
    var reviewsFragment = document.createDocumentFragment();
    var reviewsFrom = pageNumber * PAGE_SIZE;
    var reviewsTo = reviewsFrom + PAGE_SIZE;

    if (replace) {
      while (renderedViews.length) {
        var viewToRemove = renderedViews.shift();
        reviewsContainer.removeChild(viewToRemove.el);
        viewToRemove.remove();
      }
    }

    reviewsCollection.slice(reviewsFrom, reviewsTo).forEach(function(model) {
      var view = new ReviewView({ model: model });
      view.render();
      reviewsFragment.appendChild(view.el);
      renderedViews.push(view);
    });

    reviewsContainer.appendChild(reviewsFragment);
  }

  /**
  * Отображение ошибки загрузки списка
  */
  function showLoadFailture() {
    reviewsContainer.classList.add('reviews-load-failure');
  }

  /**
  * Фильтрует список отзывов по filterId. Возвращает
  * отфильтрованный список и записывает примененный фильтр
  * в локальное хранилище.
  * @param {string} filterId
  */
  function filterReviews(filterId) {
    var filteredReviews = initiallyLoaded.slice(0);

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

        filteredReviews = initiallyLoaded.slice(0);
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

        filteredReviews = initiallyLoaded.slice(0);
        break;

    }

    localStorage.setItem('filterId', filterId);
    reviewsCollection.reset(filteredReviews);
  }

  /**
  * Функция выполняет сортировку коллекции элементов.
  * Сортировка может быть выполнена по произвольному свойству
  * объекта и в определенном направлении (asc, desc)
  * @param {Array.<Object>} items
  * @param {string} property
  * @param {string} sortType
  */
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


  /**
  * Функция позволяет скрыть произвольный элемент
  * путем добавления для него класса "Invisible".
  * @param {Element} element
  * @param {boolean} visible
  * @return {Element}
  */
  function showHideBlock(element, visible) {
    if (!visible) {
      element.classList.add('invisible');
    } else {
      element.classList.remove('invisible');
    }

    return element;
  }

  /**
  * Функция проверяет наличие очередной страницы для отображения
  * элементов.
  * @return {boolean}
  */
  function isNextPageAvailable() {
    return currentPage < Math.ceil(initiallyLoaded.length / PAGE_SIZE);
  }

  /**
  * Инициализация фильтров
  */
  function initFilters() {
    var filtersContainer = document.querySelector('.reviews-filter');

    filtersContainer.addEventListener('click', function(evt) {
      evt.preventDefault();

      var clickedFilter = evt.target;

      if (doesHaveParent(clickedFilter, 'reviews-filter-item')) {
        setActiveFilter(clickedFilter.control.id);
      }

    });
  }

  /**
  * Активизирует фильтрацию списка отзывов по filterId
  * @param {string} filterId
  */
  function setActiveFilter(filterId) {
    filterReviews(filterId);
    currentPage = 0;
    renderReviews(currentPage, true);

    reviewsFiltersRadioBtn.value = filterId;
  }

  /**
  * Функция определяет наличие класс (className) у
  * элемента (element) с учетом вложенности
  * @param {Element} element
  * @param {string} className
  */
  function doesHaveParent(element, className) {
    do {
      if (element.classList.contains(className)) {
        return true;
      }

      element = element.parentElement;
    } while (element);

    return false;
  }

  /**
  * Инициализация фотогалерии
  */
  function initGallery() {
    var imagesList = galleryContainer.querySelectorAll('a.photogallery-image');
    var imagesListArray = Array.prototype.slice.call(imagesList);
    var allImages = [];

    imagesListArray.forEach(function(item) {
      var image = item.querySelectorAll('img')[0];
      allImages.push(image.src);

      if (item['dataset'] && item['dataset'].replacementVideo) {
        picturesForGallery.push({src: image.src, preview: item['dataset'].replacementVideo});
      } else {
        picturesForGallery.push({src: image.src});
      }
    });

    galleryContainer.addEventListener('click', function(evt) {
      evt.preventDefault();

      if (doesHaveParent(evt.target, 'photogallery-image')) {
        gallery.setPhotos(picturesForGallery);
        gallery.show(allImages.indexOf(evt.target.src));
      }
    });
  }

})();
