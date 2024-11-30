import { createElementFromTemplate, findHtmlElement } from '../helpers/dom';

interface MapPoint {
  city: string;
  coords: { xPercent: number; yPercent: number };
  size?: 'small' | 'medium' | 'large';
  reverse?: boolean;
}

interface RegionRecord {
  name: string;
  cities: MapPoint[];
}

export interface MapOptions {
  title: string;
  map: SVGElement | HTMLImageElement;
  icons: {
    expand: SVGElement;
  };
  menuButtonText: string;
  regions: RegionRecord[];
}

interface RegionControlElements {
  mainMenuButton: HTMLElement;
  additionMenuItem: HTMLElement | null;
  cities: { menuItem: HTMLElement; mapPoint: HTMLElement }[];
}

const smallArrowMarkup = `<svg xmlns="http://www.w3.org/2000/svg" fill="none">
  <path fill="currentColor" d="M4 4 7.5.2h-7L4 4Z"/>
</svg>`;

export class PointMap {
  private activeRegion = 0;
  private options;
  private regionControlElements: RegionControlElements[];
  private containerElement;
  private viewportElement;
  private mapOverlayElement;
  private regionListElement;
  private expandButtonElement;
  private detailsListElement;
  private additionMenuExpanded = false;

  constructor(root: string, options: MapOptions) {
    this.options = options;
    this.regionControlElements = this.getRegionsControlElements(this.options.regions);
    const {
      containerElement,
      viewportElement,
      regionListElement,
      expandButtonElement,
      mapOverlayElement,
      detailsListElement,
    } = this.render(root);
    this.containerElement = containerElement;
    this.viewportElement = viewportElement;
    this.mapOverlayElement = mapOverlayElement;
    this.regionListElement = regionListElement;
    this.expandButtonElement = expandButtonElement;
    this.detailsListElement = detailsListElement;

    this.addEvents();
    this.switchRegion(this.activeRegion);
    this.fitRegionLists();
  }

  private render(container: string) {
    const outerContainer = findHtmlElement(container);

    const containerElement = document.createElement('article');
    containerElement.classList.add('point-map');

    const { navigationElement, regionListElement, expandButtonElement, detailsListElement } =
      this.createNavigationMenu();
    const { viewportElement, mapOverlayElement } = this.createViewport();
    containerElement.append(navigationElement, viewportElement);
    outerContainer.append(containerElement);

    return {
      containerElement,
      viewportElement,
      regionListElement,
      expandButtonElement,
      mapOverlayElement,
      detailsListElement,
    };
  }

  private addEvents() {
    this.setDragToScroll(this.viewportElement);
    this.setDragToScroll(this.regionListElement);

    this.expandButtonElement.addEventListener('click', (evt) => {
      const target = evt.target;
      if (!(target instanceof Element)) return;
      if (!target.closest('button')) return;

      this.additionMenuExpanded = !this.additionMenuExpanded;
      this.containerElement.classList.toggle('point-map--addition-menu-expanded', this.additionMenuExpanded);
    });

    this.regionControlElements.forEach((set, regionIndex) => {
      set.mainMenuButton.addEventListener('click', () => {
        if (this.activeRegion === regionIndex) return;

        this.activeRegion = regionIndex;
        this.switchRegion(this.activeRegion);
      });

      set.additionMenuItem?.addEventListener('click', () => {
        set.additionMenuItem?.classList.toggle('point-map__region-detailed-item--opened');
      });
    });
  }

  private setDragToScroll(element: HTMLElement) {
    const slider = element;
    let isDown = false;
    let startX = 0;
    let startY = 0;
    let scrollLeft = 0;
    let scrollDown = 0;

    slider.addEventListener('pointerdown', (e) => {
      isDown = true;
      startX = e.pageX - slider.offsetLeft;
      startY = e.pageY - slider.offsetTop;
      scrollLeft = slider.scrollLeft;
      scrollDown = slider.scrollTop;
    });

    slider.addEventListener('pointerleave', () => {
      isDown = false;
    });

    slider.addEventListener('pointerup', () => {
      isDown = false;
    });

    slider.addEventListener('pointermove', (e) => {
      if (!isDown) return;
      e.preventDefault();
      const x = e.pageX - slider.offsetLeft;
      const y = e.pageY - slider.offsetTop;
      const walkX = (x - startX) * 1;
      const walkY = (y - startY) * 1;
      slider.scrollLeft = scrollLeft - walkX;
      slider.scrollTop = scrollDown - walkY;
    });
  }

  private fitRegionLists() {
    const container = this.detailsListElement;
    const containerStyles = getComputedStyle(this.detailsListElement);
    const observer = new ResizeObserver(() => this.setAutoColumns(container, containerStyles));
    observer.observe(this.detailsListElement);
  }

  private setAutoColumns(element: HTMLElement, elementStyles: CSSStyleDeclaration) {
    if (element.clientWidth === 0) return;
    const detailedListWidth =
      element.clientWidth - parseFloat(elementStyles.paddingLeft) - parseFloat(elementStyles.paddingRight);
    const listItems = Array.from(element.children);

    let columns = 1;
    while (
      isColumnsFits(detailedListWidth, columns + 1, parseFloat(elementStyles.columnGap)) &&
      columns !== listItems.length
    ) {
      columns++;
    }

    this.detailsListElement.style.gridTemplateColumns = `repeat(${columns}, auto)`;

    function isColumnsFits(containerWidth: number, columnsCount: number, gap: number) {
      return (
        containerWidth -
          (gap * columnsCount - 1) -
          calcColumnsWidth(columnsCount).reduce((sum, columnWidth) => sum + columnWidth, 0) >=
        0
      );
    }

    function calcColumnsWidth(columnCount: number) {
      const columnList = [];

      let counter = 1;
      while (counter <= columnCount) {
        const column = listItems.filter((item, itemIndex) => {
          return (itemIndex + counter) % columnCount === 0;
        });
        columnList.push(column);
        counter++;
      }

      const widths = columnList.reverse().map((listItems) => {
        return listItems.reduce((acc, item) => {
          const children = Array.from(item.children);
          const child = children[1];
          const rect = child.getBoundingClientRect();
          const childWidth = rect.right - rect.left;
          return acc > childWidth ? acc : childWidth;
        }, 0);
      });

      return widths;
    }
  }

  private switchRegion(regionIndex: number) {
    this.regionControlElements.forEach((region, controlIndex) => {
      region.mainMenuButton.classList.toggle('point-map__region-button--active', regionIndex === controlIndex);
    });

    const mapPoints = this.regionControlElements[this.activeRegion].cities.map((city) => city.mapPoint);
    this.mapOverlayElement.innerHTML = '';
    this.mapOverlayElement.append(...mapPoints);
  }

  private createNavigationMenu() {
    const navigationElement = document.createElement('header');
    navigationElement.classList.add('point-map__navigation');
    const titleElement = document.createElement('h3');
    titleElement.classList.add('point-map__title');
    titleElement.textContent = this.options.title;
    navigationElement.append(titleElement);
    const { mainNavigationElement, regionListElement, expandButtonElement } = this.createMainNavigationMenu();
    const { additionNavigationElement, detailsListElement } = this.createAdditionNavigationMenu();
    navigationElement.append(mainNavigationElement, additionNavigationElement);

    return { navigationElement, regionListElement, expandButtonElement, detailsListElement };
  }

  private createMainNavigationMenu() {
    const mainNavigationElement = document.createElement('div');
    mainNavigationElement.classList.add('point-map__main-navigation');

    const expandButtonElement = document.createElement('button');
    expandButtonElement.classList.add('point-map__expand-button');
    expandButtonElement.type = 'button';
    expandButtonElement.textContent = this.options.menuButtonText;
    expandButtonElement.setAttribute('aria-label', 'Разверуть/свернуть доп меню');
    mainNavigationElement.append(expandButtonElement);
    expandButtonElement.append(this.options.icons.expand);

    const regionListElement = document.createElement('ul');
    regionListElement.classList.add('point-map__region-list');

    const regionListItems = this.regionControlElements.map((set) => {
      const regionNameElement = document.createElement('li');
      regionNameElement.classList.add('point-map__region-item');
      regionNameElement.append(set.mainMenuButton);

      return regionNameElement;
    });
    regionListElement.append(...regionListItems);
    mainNavigationElement.append(regionListElement);

    return { mainNavigationElement, regionListElement, expandButtonElement };
  }

  private createAdditionNavigationMenu() {
    const additionNavigationElement = document.createElement('div');
    additionNavigationElement.classList.add('point-map__addition-navigation');

    const detailsListElement = document.createElement('ul');
    detailsListElement.classList.add('point-map__region-detailed-list');
    additionNavigationElement.append(detailsListElement);

    const listItems = this.regionControlElements.map((set) => set.additionMenuItem);
    detailsListElement.append(...listItems.filter((item): item is HTMLLIElement => item instanceof HTMLLIElement));

    return { additionNavigationElement, detailsListElement };
  }

  private createViewport() {
    const viewportElement = document.createElement('div');
    viewportElement.classList.add('point-map__viewport');

    const mapElement = document.createElement('div');
    mapElement.classList.add('point-map__map');
    const mapImageElement = this.getMapImageElement();
    mapElement.append(mapImageElement);
    viewportElement.append(mapElement);

    const mapOverlayElement = document.createElement('div');
    mapOverlayElement.classList.add('point-map__map-overlay');
    mapElement.append(mapOverlayElement);

    return { viewportElement, mapOverlayElement };
  }

  private getMapImageElement() {
    if (this.options.map instanceof SVGElement) {
      this.options.map.setAttribute('aria-label', 'Карта');
    }
    if (this.options.map instanceof HTMLImageElement) {
      this.options.map.setAttribute('alt', 'Карта');
    }
    return this.options.map;
  }

  private getRegionsControlElements(regions: RegionRecord[]): RegionControlElements[] {
    const regionsControls: RegionControlElements[] = regions.map((region) => {
      const mainMenuButton = document.createElement('button');
      mainMenuButton.type = 'button';
      mainMenuButton.classList.add('point-map__region-button');
      mainMenuButton.textContent = region.name;

      let additionMenuDetails: HTMLElement | null = null;
      let regionDetailsitems: { menuItem: HTMLElement; mapPoint: HTMLElement }[] = [];
      if (region.cities.length) {
        const regionDetailsListElement = document.createElement('ul');
        regionDetailsListElement.classList.add('point-map__region-details-list');
        additionMenuDetails = regionDetailsListElement;

        regionDetailsitems = region.cities.map((point) => {
          const listItemElement = document.createElement('li');
          listItemElement.classList.add('point-map__region-details-item');

          const cityButtonElement = document.createElement('button');
          cityButtonElement.classList.add('button', 'point-map__city-button');
          cityButtonElement.type = 'button';
          cityButtonElement.textContent = point.city;
          listItemElement.append(cityButtonElement);
          const mapPointElement = this.createPointElement(point);

          return { menuItem: listItemElement, mapPoint: mapPointElement };
        });

        regionDetailsitems.length &&
          regionDetailsListElement.append(...regionDetailsitems.map((item) => item.menuItem));
      }

      const regionDetailedListItemElement = document.createElement('li');
      regionDetailedListItemElement.classList.add('point-map__region-detailed-item');
      const additionMenuSummary = document.createElement('span');
      additionMenuSummary.classList.add('point-map__region-summary');
      additionMenuSummary.textContent = region.name;

      const span = document.createElement('span');
      const svgIcon = createElementFromTemplate(smallArrowMarkup);
      span.textContent = ' ';
      span.append(svgIcon);
      additionMenuSummary.append(span);
      regionDetailedListItemElement.append(additionMenuSummary);
      additionMenuDetails && regionDetailedListItemElement.append(additionMenuDetails);

      return {
        mainMenuButton: mainMenuButton,
        additionMenuItem: regionDetailedListItemElement,
        cities: regionDetailsitems,
      };
    });

    const mainMenuButtonAllRegions = document.createElement('button');
    mainMenuButtonAllRegions.type = 'button';
    mainMenuButtonAllRegions.classList.add('point-map__region-button');
    mainMenuButtonAllRegions.textContent = 'Все';

    const allRegionsControls: RegionControlElements = {
      mainMenuButton: mainMenuButtonAllRegions,
      additionMenuItem: null,
      cities: regionsControls.map((region) => region.cities).flat(),
    };

    regionsControls.unshift(allRegionsControls);

    return regionsControls;
  }

  private createPointElement(point: MapPoint) {
    const mapPointElement = document.createElement('div');
    mapPointElement.classList.add('point-map__point');
    point.size
      ? mapPointElement.classList.add(`point-map__point--${point.size}`)
      : mapPointElement.classList.add(`point-map__point--small`);
    point.reverse && mapPointElement.classList.add(`point-map__point--reverse`);
    mapPointElement.style.left = `${point.coords.xPercent}%`;
    mapPointElement.style.top = `${point.coords.yPercent}%`;

    const mapPointLabelElement = document.createElement('p');
    mapPointLabelElement.classList.add('point-map__point-label');
    mapPointLabelElement.textContent = this.getShortName(point.city);
    mapPointElement.append(mapPointLabelElement);

    return mapPointElement;
  }

  private getShortName(name: string) {
    const parts = name.split(' ');
    const tail = parts.pop();
    const result = [];
    if (parts.length) {
      const chars = parts.map((part) => part.split('')[0].toLocaleUpperCase() + '.');
      result.push(...chars);
    }

    result.push(tail);
    return result.join(' ');
  }
}
