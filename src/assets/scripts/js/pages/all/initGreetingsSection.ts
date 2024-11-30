import { MapOptions, PointMap } from '../../libs/PointMap';
import commonSprite from '@image/prepared/common/svg-sprite/common-svg-sprite.svg';
import map from '@image/raw/content/svg/map.svg';
import { createElementFromTemplate, createRefSvg } from '../../helpers/dom';

export async function initGreetingsSection() {
  const expandIcon = createRefSvg(commonSprite + '#arrow', ['svg-icon', 'point-map__button-icon']);
  const mapElement = await fetch(map).then((value) =>
    value.text().then((markup) => createElementFromTemplate(markup) as SVGElement)
  );

  const mapOptions: MapOptions = {
    title: 'Офисы компании Softline',
    map: mapElement,
    icons: {
      expand: expandIcon,
    },
    menuButtonText: 'Офисы Softline',
    regions: [
      {
        name: 'Москва',
        cities: [
          {
            city: 'Москва',
            coords: {
              xPercent: 14,
              yPercent: 42.8,
            },
            size: 'medium',
          },
        ],
      },
      {
        name: 'Центр',
        cities: [
          {
            city: 'Воронеж',
            coords: {
              xPercent: 10.2,
              yPercent: 45.7,
            },
          },
          {
            city: 'Ярославль',
            coords: {
              xPercent: 17,
              yPercent: 39.1,
            },
          },
          {
            city: 'Белгород',
            coords: {
              xPercent: 9.95,
              yPercent: 49.8,
            },
          },
        ],
      },
      {
        name: 'Северо-Запад',
        cities: [
          {
            city: 'Санкт-Петербург',
            coords: {
              xPercent: 14.6,
              yPercent: 30.3,
            },
            size: 'large',
          },
          {
            city: 'Калининград',
            coords: {
              xPercent: 5.8,
              yPercent: 29.4,
            },
          },
        ],
      },
      {
        name: 'Юг',
        cities: [
          {
            city: 'Ростов-на-Дону',
            coords: {
              xPercent: 9.2,
              yPercent: 55.5,
            },
            size: 'medium',
          },
          {
            city: 'Краснодар',
            coords: {
              xPercent: 6.7,
              yPercent: 63.5,
            },
            size: 'medium',
          },
          {
            city: 'Волгоград',
            coords: {
              xPercent: 11.4,
              yPercent: 61.2,
            },
          },
        ],
      },
      {
        name: 'Волга',
        cities: [
          {
            city: 'Казань',
            coords: {
              xPercent: 22.7,
              yPercent: 52.7,
            },
          },
          {
            city: 'Самара',
            coords: {
              xPercent: 17.7,
              yPercent: 53.8,
            },
          },
          {
            city: 'Уфа',
            coords: {
              xPercent: 23,
              yPercent: 57.8,
            },
          },
          {
            city: 'Оренбург',
            coords: {
              xPercent: 20.3,
              yPercent: 61.65,
            },
          },
          {
            city: 'Нижний Новгород',
            coords: {
              xPercent: 18,
              yPercent: 47.6,
            },
          },
        ],
      },
      {
        name: 'Урал',
        cities: [
          {
            city: 'Екатерингбург',
            coords: {
              xPercent: 28.3,
              yPercent: 56.7,
            },
          },
          {
            city: 'Челябинск',
            coords: {
              xPercent: 28.1,
              yPercent: 61.35,
            },
            size: 'medium',
          },
          {
            city: 'Пермь',
            coords: {
              xPercent: 33,
              yPercent: 52.8,
            },
            size: 'medium',
          },
          {
            city: 'Сургут',
            coords: {
              xPercent: 37.3,
              yPercent: 54.5,
            },
          },
          {
            city: 'Тюмень',
            coords: {
              xPercent: 35.6,
              yPercent: 61.3,
            },
            size: 'medium',
          },
          {
            city: 'Ижевск',
            coords: {
              xPercent: 28.75,
              yPercent: 51.5,
            },
          },
        ],
      },
      {
        name: 'Сибирь',
        cities: [
          {
            city: 'Новосибирск',
            coords: {
              xPercent: 43.55,
              yPercent: 73.7,
            },
          },
          {
            city: 'Омск',
            coords: {
              xPercent: 39.3,
              yPercent: 76.2,
            },
            size: 'medium',
          },
          {
            city: 'Томск',
            coords: {
              xPercent: 48.85,
              yPercent: 74.3,
            },
            size: 'medium',
            reverse: true,
          },
          {
            city: 'Красноярск',
            coords: {
              xPercent: 53.4,
              yPercent: 74,
            },
          },
          {
            city: 'Иркутск',
            coords: {
              xPercent: 57.9,
              yPercent: 78.4,
            },
            size: 'medium',
          },
        ],
      },
      {
        name: 'Дальний Восток',
        cities: [
          {
            city: 'Хабаровск',
            coords: {
              xPercent: 81.4,
              yPercent: 79.4,
            },
            size: 'large',
            reverse: true,
          },
          {
            city: 'Владивосток',
            coords: {
              xPercent: 80.45,
              yPercent: 89.9,
            },
            size: 'large',
          },
        ],
      },
    ],
  };
  new PointMap('.greetings-section__point-map', mapOptions);
}

// regions: [
//   {
//     name: 'Москва',
//     cities: [
//       {
//         city: 'Москва',
//         coords: {
//           xPercent: 12.2,
//           yPercent: 37.9,
//         },
//         size: 'medium',
//       },
//     ],
//   },
//   {
//     name: 'Центр',
//     cities: [
//       {
//         city: 'Воронеж',
//         coords: {
//           xPercent: 8.1,
//           yPercent: 41.5,
//         },
//       },
//       {
//         city: 'Ярославль',
//         coords: {
//           xPercent: 15.3,
//           yPercent: 33.3,
//         },
//       },
//       {
//         city: 'Белгород',
//         coords: {
//           xPercent: 7.85,
//           yPercent: 46.6,
//         },
//       },
//     ],
//   },
//   {
//     name: 'Северо-Запад',
//     cities: [
//       {
//         city: 'Санкт-Петербург',
//         coords: {
//           xPercent: 12.9,
//           yPercent: 22.4,
//         },
//         size: 'large',
//       },
//       {
//         city: 'Калининград',
//         coords: {
//           xPercent: 3.5,
//           yPercent: 21.4,
//         },
//       },
//     ],
//   },
//   {
//     name: 'Юг',
//     cities: [
//       {
//         city: 'Ростов-на-Дону',
//         coords: {
//           xPercent: 7.1,
//           yPercent: 53.5,
//         },
//         size: 'medium',
//       },
//       {
//         city: 'Краснодар',
//         coords: {
//           xPercent: 4.6,
//           yPercent: 63.7,
//         },
//         size: 'medium',
//       },
//       {
//         city: 'Волгоград',
//         coords: {
//           xPercent: 9.4,
//           yPercent: 60.7,
//         },
//       },
//     ],
//   },
//   {
//     name: 'Волга',
//     cities: [
//       {
//         city: 'Казань',
//         coords: {
//           xPercent: 21.3,
//           yPercent: 50.3,
//         },
//       },
//       {
//         city: 'Самара',
//         coords: {
//           xPercent: 16,
//           yPercent: 51.6,
//         },
//       },
//       {
//         city: 'Уфа',
//         coords: {
//           xPercent: 21.6,
//           yPercent: 56.6,
//         },
//       },
//       {
//         city: 'Оренбург',
//         coords: {
//           xPercent: 18.7,
//           yPercent: 61.35,
//         },
//       },
//       {
//         city: 'Нижний Новгород',
//         coords: {
//           xPercent: 16.4,
//           yPercent: 43.9,
//         },
//       },
//     ],
//   },
//   {
//     name: 'Урал',
//     cities: [
//       {
//         city: 'Екатерингбург',
//         coords: {
//           xPercent: 27.3,
//           yPercent: 55.3,
//         },
//       },
//       {
//         city: 'Челябинск',
//         coords: {
//           xPercent: 27.1,
//           yPercent: 60.85,
//         },
//         size: 'medium',
//       },
//       {
//         city: 'Пермь',
//         coords: {
//           xPercent: 32.2,
//           yPercent: 50.4,
//         },
//         size: 'medium',
//       },
//       {
//         city: 'Сургут',
//         coords: {
//           xPercent: 36.7,
//           yPercent: 52.5,
//         },
//       },
//       {
//         city: 'Тюмень',
//         coords: {
//           xPercent: 34.9,
//           yPercent: 60.9,
//         },
//         size: 'medium',
//       },
//       {
//         city: 'Ижевск',
//         coords: {
//           xPercent: 27.65,
//           yPercent: 48.7,
//         },
//       },
//     ],
//   },
//   {
//     name: 'Сибирь',
//     cities: [
//       {
//         city: 'Новосибирск',
//         coords: {
//           xPercent: 43.25,
//           yPercent: 76.2,
//         },
//       },
//       {
//         city: 'Омск',
//         coords: {
//           xPercent: 38.8,
//           yPercent: 79.5,
//         },
//         size: 'medium',
//       },
//       {
//         city: 'Томск',
//         coords: {
//           xPercent: 48.75,
//           yPercent: 76.9,
//         },
//         size: 'medium',
//         reverse: true,
//       },
//       {
//         city: 'Красноярск',
//         coords: {
//           xPercent: 53.6,
//           yPercent: 76.5,
//         },
//       },
//       {
//         city: 'Иркутск',
//         coords: {
//           xPercent: 58.25,
//           yPercent: 82,
//         },
//         size: 'medium',
//       },
//     ],
//   },
//   {
//     name: 'Дальний Восток',
//     cities: [
//       {
//         city: 'Хабаровск',
//         coords: {
//           xPercent: 83,
//           yPercent: 83.3,
//         },
//         size: 'large',
//         reverse: true,
//       },
//       {
//         city: 'Владивосток',
//         coords: {
//           xPercent: 81.95,
//           yPercent: 96.2,
//         },
//         size: 'large',
//       },
//     ],
//   },
// ],
