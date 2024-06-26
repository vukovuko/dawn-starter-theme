var swiperThumbs = new Swiper('.product__swiper--thumbs', {
  loop: true,
  spaceBetween: 8.5,
  slidesPerView: 7.5,
  freeMode: true,
  watchSlidesProgress: true,
  breakpoints: {
    1150: {
      spaceBetween: 16
    }
  }
});

var swiperMain = new Swiper('.product__swiper-main', {
  loop: true,
  spaceBetween: 10,
  navigation: {
    nextEl: '.product__swiper-button-next',
    prevEl: '.product__swiper-button-prev',
  },
  thumbs: {
    swiper: swiperThumbs,
  },
});

document.addEventListener('DOMContentLoaded', initVariantPicker);

const productForm = document.querySelector('form[data-type="add-to-cart-form"]');
const productUrl = document.querySelector('.variant-picker').dataset.url;
const sectionId = document.querySelector('.variant-picker').dataset.section;
const variantInput = productForm.querySelector('input[name="id"]');
const productVariants = JSON.parse(document.querySelector('[data-product-variants]').textContent);

function initVariantPicker() {
  const variantPicker = document.querySelector('.variant-picker');
  
  if (variantPicker) {
    variantPicker.addEventListener('click', handleVariantChange);
  }
}

function handleVariantChange(event) {
  if (event.target.tagName === 'INPUT' && event.target.type === 'radio') {
    const selectedValue = event.target.value;
    updateVariant(selectedValue);
    updatePrice(selectedValue);
  }
}

function updateVariant(selectedValue) {
  const selectedVariant = productVariants.find(variant => variant.options.includes(selectedValue));
  if (selectedVariant) {
    variantInput.value = selectedVariant.id;
    updateProductImages(selectedVariant);
  }
}

function updatePrice(selectedValue) {
  const selectedVariant = productVariants.find(variant => variant.options.includes(selectedValue));
  const requestedVariantId = selectedVariant.id;

  fetch(
    `${productUrl}?variant=${requestedVariantId}&section_id=${sectionId}`
  )
  .then((response) => response.text())
  .then((responseText) => {
    const html = new DOMParser().parseFromString(responseText, 'text/html');
    const destination = document.querySelector('.price.price--large');
    const source = html.querySelector('.price.price--large');
    
    if (destination && source) {
      destination.innerHTML = source.innerHTML;
    }
  })
  .catch((error) => {
    console.error('Error updating price:', error);
  });
}

function updateProductImages(selectedVariant) {
  const productMedia = document.querySelectorAll('.swiper-slide');
  const variantImageId = selectedVariant.featured_media ? selectedVariant.featured_media.id : null;
  let mediaIndex = -1;
  productMedia.forEach((mediaItem, index) => {
    const mediaId = parseInt(mediaItem.getAttribute('data-media-id'));
    if (mediaId === variantImageId) {
      mediaIndex = parseInt(mediaItem.getAttribute('data-swiper-slide-index'));
    }
  });
  if (!isNaN(mediaIndex) && mediaIndex !== -1) {
    swiperMain.slideTo(mediaIndex);
  }
}