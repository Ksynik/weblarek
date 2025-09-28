import { CardBase } from './CardBase';
import { IEvents } from '../../base/Events';
import { mapCategoryToModifier } from '../../../utils/constants';

export class CatalogCard extends CardBase {
    public buttonElement: HTMLButtonElement;
    protected imageElement: HTMLImageElement;
    protected titleElement: HTMLElement;
    protected categoryElement: HTMLElement;

    constructor(events: IEvents, container: HTMLElement) {
        super(events, container);

        this.buttonElement = this.container as HTMLButtonElement;

        this.imageElement = this.container.querySelector<HTMLImageElement>('.card__image')!;
        this.titleElement = this.container.querySelector<HTMLElement>('.card__title')!;
        this.categoryElement = this.container.querySelector<HTMLElement>('.card__category')!;

        this.buttonElement.addEventListener('click', () => {
            if (this.id) {
                this.events.emit('card:select', { id: this.id });
            }
        });
    }

    set image(src: string) { 
        if (this.imageElement) this.imageElement.src = src; 
    }
    set alt(value: string) { 
        if (this.imageElement) this.imageElement.alt = value; 
    }
    set title(value: string) { 
        if (this.titleElement) this.titleElement.textContent = value; 
    }
    set category(value: string) {
        if (!this.categoryElement) return;
        this.categoryElement.textContent = value;
        this.categoryElement.className = 'card__category';
        this.categoryElement.classList.add(`card__category_${mapCategoryToModifier(value)}`);
    }
}


