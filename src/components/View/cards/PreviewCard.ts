import { Component } from '../../base/Component';
import { ensureElement } from '../../../utils/utils';
import { IPreviewCard } from '../../../types';

export class PreviewCard extends Component<IPreviewCard> {
    protected _image: HTMLImageElement;
    protected _category: HTMLElement;
    protected _title: HTMLElement;
    protected _description: HTMLElement;
    protected _price: HTMLElement;
    protected _button: HTMLButtonElement;
    private _buttonClickHandlers: (() => void)[] = [];

    constructor(container: HTMLElement) {
        super(container);

        this._image = ensureElement<HTMLImageElement>('.card__image', this.container);
        this._category = ensureElement<HTMLElement>('.card__category', this.container);
        this._title = ensureElement<HTMLElement>('.card__title', this.container);
        this._description = ensureElement<HTMLElement>('.card__text', this.container);
        this._price = ensureElement<HTMLElement>('.card__price', this.container);
        this._button = ensureElement<HTMLButtonElement>('.card__button', this.container);

        this._button.addEventListener('click', () => {
            this._buttonClickHandlers.forEach(handler => handler());
        });
    }

    set image(src: string) {
        this.setImage(this._image, src);
    }

    set alt(value: string) {
        this._image.alt = value;
    }

    set category(value: string) {
        this._category.textContent = value;
    }

    set categoryClass(value: string) {
        this._category.className = 'card__category';
        this._category.classList.add(`card__category_${value}`);
    }

    set title(value: string) {
        this._title.textContent = value;
    }

    set description(value: string) {
        this._description.textContent = value;
    }

    set price(value: number | null) {
        this._price.textContent = value === null ? 'Бесценно' : `${value} синапсов`;
    }

    set buttonText(value: string) {
        this._button.textContent = value;
    }

    set buttonDisabled(value: boolean) {
        this._button.disabled = value;
    }

    set onClick(callback: () => void) {
        this._buttonClickHandlers.push(callback);
    }
}