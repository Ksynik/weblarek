import { CardBase } from './CardBase';
import { IEvents } from '../../base/Events';
import { ensureElement } from '../../../utils/utils';
import { mapCategoryToModifier } from '../../../utils/constants';


export class CatalogCard extends CardBase {
    cardImageElement: HTMLImageElement;
    categoryElement: HTMLElement;
    priceElement: HTMLElement;
    private _price: number | null = null;

    constructor(protected events: IEvents, container: HTMLElement) {
        super(events, container);

        this.categoryElement = ensureElement<HTMLElement>('.card__category', this.container);
        this.cardImageElement = ensureElement<HTMLImageElement>('.card__image', this.container);
        this.priceElement = ensureElement<HTMLElement>('.card__price', this.container);

        this.container.addEventListener('click', (event: MouseEvent) => {
            event.preventDefault();
            this.events.emit('card:select', { id: this.id });
        });
    }

    set category(value: string) {
        this.categoryElement.textContent = value;
        this.categoryElement.classList.add(`card__category_${mapCategoryToModifier(value)}`);
    }

    set image(value: string) {
        this.cardImageElement.src = value;
    }

    get price(): number | null {
        return this._price;
    }

    set price(value: number | null) {
        this._price = value;
        if (this.priceElement) {
            this.priceElement.textContent =
                value !== null ? `${value} синапсов` : 'бесценно';
        }
    }
    
}
