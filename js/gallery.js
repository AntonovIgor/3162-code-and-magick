(function() {

  var Key = {
    'ESC': 27,
    'LEFT': 37,
    'RIGHT': 39
  };

  var overlayGalleryContainer = document.querySelector('.overlay-gallery');
  var galleryContainer = document.querySelector('.photogallery');
  var closeGalleryBtn =  document.querySelector('.overlay-gallery-close');


  galleryContainer.addEventListener('click', function(evt) {
    if (doesHaveParent(evt.target, 'photogallery-image')) {
      showGallery();
    };
  });

  function doesHaveParent(element, className) {
    do {
      if (element.classList.contains(className)) {
        return true;
      }

      element = element.parentElement;
    } while (element);

    return false;
  }

  function showGallery() {
    overlayGalleryContainer.classList.remove('invisible');
    closeGalleryBtn.addEventListener('click', closeHandler);
    document.body.addEventListener('keydown', keyHandler);
  }

  function hideGallery() {
    overlayGalleryContainer.classList.add('invisible');
    closeGalleryBtn.removeEventListener('click', closeHandler);
    document.body.removeEventListener('keydown', keyHandler);
  }

  function closeHandler(evt) {
    evt.preventDefault();
    hideGallery();
  }

  function keyHandler(evt) {
    switch(evt.keyCode) {
      case Key.LEFT:
        console.log('show previous photo');
        break;
      case Key.RIGHT:
        console.log('show next photo');
        break;
      case Key.ESC:
        hideGallery();
        break;
      default: break;
    }
  }

})();
