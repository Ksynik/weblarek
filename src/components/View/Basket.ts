import  { Component } from '../base/Component';
import { ensureElement } from '../../utils/utils';
import { IBasket } from '../../types';
import { EventEmitter } from '../base/Events';


export class Basket extends Component<IBasket> {
    protected listElement: HTMLElement;
    protected priceElement: HTMLElement;
    protected buttonElement: HTMLButtonElement;
    public events: EventEmitter;

    constructor(container: HTMLElement) {
        super(container);
        this.events = new EventEmitter();

        this.listElement = ensureElement<HTMLElement>('.basket__list', this.container);
        this.priceElement = ensureElement<HTMLElement>('.basket__price', this.container);
        this.buttonElement = ensureElement<HTMLButtonElement>('.basket__button', this.container);

        this.buttonElement.addEventListener('click', () => {
            this.events.emit('basket:order');
        });
    }

    set items(items: HTMLElement[]) {
        if (items.length) {
            this.listElement.replaceChildren(...items);
            this.setDisabled(this.buttonElement, false);
        } else {
            this.listElement.innerHTML = '<li class="basket__empty">Корзина пуста</li>';
            this.setDisabled(this.buttonElement, true);
        }
    }

    set total(value: number) {
        this.setText(this.priceElement, `${value} синапсов`);
    }

    protected setText(element: HTMLElement, text: string): void {
        if (element) {
            element.textContent = text;
        }
    }

    set onOrder(callback: () => void) {
        this.events.on('basket:order', callback);
    }

    protected setDisabled(button: HTMLButtonElement, disabled: boolean): void {
        button.disabled = disabled;
    }
}
