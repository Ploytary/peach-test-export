import { Autoplay, Navigation, Pagination } from 'swiper/modules';
import { findHtmlElement } from '../../helpers/dom';
import { BrandSlider } from '../../libs/BrandSlider';

export function initCorporateLifeSection() {
  const prevButton = findHtmlElement('.corporate-life-section .brand-slider__button--prev');
  const nextButton = findHtmlElement('.corporate-life-section .brand-slider__button--next');

  new BrandSlider('.corporate-life-section__slider', {
    modules: [Autoplay, Navigation, Pagination],
    loop: true,
    navigation: {
      nextEl: nextButton,
      prevEl: prevButton,
    },
  });
}
