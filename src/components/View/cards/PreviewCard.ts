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
    private _deleteHandlers: (() => void)[] = [];

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

    render(data: IPreviewCard): HTMLElement {
        this._image.src = data.image;
        if (data.alt) this._image.alt = data.alt;
        this._category.textContent = data.category;
        // Удаляем старые модификаторы категории
        const classList = this._category.classList;
        const classesToRemove = Array.from(classList).filter(cls => cls.startsWith('card__category_'));
        classesToRemove.forEach(cls => classList.remove(cls));
        if (data.categoryClass) {
            classList.add(`card__category_${data.categoryClass}`);
        }
        this._title.textContent = data.title;
        this._description.textContent = data.description;
        this._price.textContent = data.price !== null ? `${data.price} синапсов` : '';
        this._button.textContent = data.buttonText;
        this._button.disabled = !!data.buttonDisabled;
        return this.container;
    }

    addClickHandler(callback: () => void) {
        this._buttonClickHandlers.push(callback);
    }
    addDeleteHandler(callback: () => void) {
        this._deleteHandlers.push(callback);
    }
}