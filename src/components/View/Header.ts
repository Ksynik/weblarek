import { Component } from '../base/Component';
import { ensureElement } from '../../utils/utils';
import { IHeader } from '../../types';

export class Header extends Component<IHeader> {
    protected _basketCounter: HTMLElement;
    protected _basketButton: HTMLButtonElement;

    constructor(container: HTMLElement) {
        super(container);

        this._basketCounter = ensureElement<HTMLElement>('.header__basket-counter', this.container);
        this._basketButton = ensureElement<HTMLButtonElement>('.header__basket', this.container);

        this._basketButton.addEventListener('click', () => {
            this.container.dispatchEvent(new CustomEvent('header:basketClick'));
        });
    }

    set counter(value: number) {

        this._basketCounter.textContent = value.toString();
    }

    set onBasketClick(callback: () => void) {
        this.container.addEventListener('header:basketClick', callback);
    }
}