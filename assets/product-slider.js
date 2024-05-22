var swiperThumbs = new Swiper('.product__swiper--thumbs', {
  loop: true,
  spaceBetween: 16,
  slidesPerView: 6.5,
  freeMode: true,
  watchSlidesProgress: true,
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
