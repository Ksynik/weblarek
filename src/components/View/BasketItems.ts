import { Component } from '../base/Component';
import { ensureElement } from '../../utils/utils';
import { IBasketItem } from '../../types';

export class BasketItem extends Component<IBasketItem> {
    protected _index: HTMLElement;
    protected _title: HTMLElement;
    protected _price: HTMLElement;
    protected _deleteButton: HTMLButtonElement;
    private _deleteHandlers: (() => void)[] = [];

    constructor(container: HTMLElement) {
        super(container);

        this._index = ensureElement<HTMLElement>('.basket__item-index', this.container);
        this._title = ensureElement<HTMLElement>('.card__title', this.container);
        this._price = ensureElement<HTMLElement>('.card__price', this.container);
        this._deleteButton = ensureElement<HTMLButtonElement>('.basket__item-delete', this.container);

        this._deleteButton.addEventListener('click', (event: MouseEvent) => {
            event.preventDefault();
            this._deleteHandlers.forEach(handler => handler());
        });
    }

    set index(value: number) {
        this._index.textContent = value.toString();
    }

    set title(value: string) {
        this._title.textContent = value;
    }

    set price(value: number | null) {
        this._price.textContent = value === null ? '—' : `${value} синапсов`;
    }

    set onDelete(callback: () => void) {
        this._deleteHandlers.push(callback);
    }
}