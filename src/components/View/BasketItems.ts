import { CardBase } from './cards/CardBase';
import { ensureElement } from '../../utils/utils';
import { IEvents } from '../base/Events';


export class BasketItem extends CardBase {
    protected _index: HTMLElement;
    protected _title: HTMLElement;
    protected _price: HTMLElement;
    protected _deleteButton: HTMLButtonElement;
    private _deleteHandlers: (() => void)[] = [];

    constructor(events: IEvents, container: HTMLElement) {
        super(events, container);

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

    addDeleteHandler(callback: () => void) {
        this._deleteHandlers.push(callback);
    }
}