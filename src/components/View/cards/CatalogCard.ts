// CatalogCard.ts (упрощенная версия)

import { CardBase } from './CardBase';
import { IEvents } from '../../base/Events';
import { ensureElement } from '../../../utils/utils';
import { mapCategoryToModifier } from '../../../utils/constants';

export class CatalogCard extends CardBase {
    cardImageElement: HTMLImageElement;
    categoryElement: HTMLElement;

    constructor(protected events: IEvents, container: HTMLElement) {
        super(events , container);

        this.categoryElement = ensureElement<HTMLElement>('.card__category', this.container);
        this.cardImageElement = ensureElement<HTMLImageElement>('.card__image', this.container);
        

        this.container.addEventListener('click', (event: MouseEvent) => {
            event.preventDefault();
            console.log('Card clicked, id:', this.id);
            this.events.emit('card:select', { id: this.id });
        });

    }

    set category(value: string) {
        this.categoryElement.textContent = value;
        this.categoryElement.className = 'card__category';
        this.categoryElement.classList.add(`card__category_${mapCategoryToModifier(value)}`);
    }
    set image(value: string) {
        this.cardImageElement.src = value;
    }
    
    get id(): string {
        return this.cardId;
    }
    set id(value: string) {
        this.cardId = value;
    }
}