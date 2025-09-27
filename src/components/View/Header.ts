import { Component } from '../base/Component';
import { ensureElement } from '../../utils/utils';
import { EventEmitter } from '../base/Events';

export class Header extends Component<any> {
    protected _basketCounter: HTMLElement;
    protected _basketButton: HTMLButtonElement;
    protected events: EventEmitter;

    constructor(container: HTMLElement, events: EventEmitter) {
        super(container);
        this.events = events;
        this._basketCounter = ensureElement<HTMLElement>('.header__basket-counter', this.container);
        this._basketButton = ensureElement<HTMLButtonElement>('.header__basket', this.container);
        this._basketButton.addEventListener('click', () => {
            this.events.emit('header:basketClick');
        });
    }

    set counter(value: number) {
        this._basketCounter.textContent = value.toString();
    }
}