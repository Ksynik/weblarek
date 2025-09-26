import { Component } from '../base/Component';
import { ensureElement } from '../../utils/utils';
import { EventEmitter } from '../base/Events';
import { ISuccess } from '../../types';

export class Success extends Component<ISuccess> {
    protected _description: HTMLElement;
    protected _closeButton: HTMLButtonElement;
    public events: EventEmitter;

    constructor(container: HTMLElement) {
        super(container);
        this.events = new EventEmitter();

        this._description = ensureElement<HTMLElement>('.order-success__description', this.container);
        this._closeButton = ensureElement<HTMLButtonElement>('.order-success__close', this.container);

        this._closeButton.addEventListener('click', () => {
            this.events.emit('success:close');
        });
    }

    set totalPrice(value: number) {
        this._description.textContent = `Списано ${value} синапсов`;
    }

    set onClose(callback: () => void) {
        this.events.on('success:close', callback);
    }
}