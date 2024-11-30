import Swiper from 'swiper';
import { CSSSelector } from 'swiper/types/shared';
import { SwiperOptions } from 'swiper/types/swiper-options';

export class BrandSlider extends Swiper {
  constructor(selector: CSSSelector | HTMLElement, options?: SwiperOptions) {
    const brandOptions = {
      pagination: {
        el: '.brand-slider__pagination',
        bulletActiveClass: 'brand-slider__pagination-bullet--active',
        bulletClass: 'brand-slider__pagination-bullet',
      },
      navigation: {
        nextEl: '.brand-slider__button--next',
        prevEl: '.brand-slider__button--prev',
      },
    };

    const allOptions = Object.assign({}, brandOptions, options);
    super(selector, allOptions);
  }
}
