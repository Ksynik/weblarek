// BasketItem.ts
import { CardBase } from './CardBase';
import { IEvents } from '../../base/Events';

export class BasketItem extends CardBase {
    protected indexElement: HTMLElement;
    protected deleteButton: HTMLButtonElement;

    constructor(container: HTMLElement, public events: IEvents) {
        super(events, container);

        this.indexElement = this.container.querySelector<HTMLElement>('.basket__item-index')!;
        this.deleteButton = this.container.querySelector<HTMLButtonElement>('.basket__item-delete')!;

        this.deleteButton.addEventListener('click', (event: MouseEvent) => {
            event.preventDefault();
            if (this.id) {
                this.events.emit('cart:removeItem', { productId: this.id });
            }
        });
    }

    set index(value: number) {
        this.indexElement.textContent = value.toString();
    }
}




