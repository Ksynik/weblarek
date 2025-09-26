import { ensureElement } from '../../utils/utils';
import { IEvents } from '../base/Events';
import { Component } from '../base/Component';
import { IModal } from '../../types';

export class ModalView extends Component<IModal>  {
	protected _content: HTMLElement;
	protected _closeButton: HTMLButtonElement;
	protected container: HTMLElement;

    constructor(container: HTMLElement, public events: IEvents) {
		super(container);
		this.container = container;
		this._closeButton = ensureElement<HTMLButtonElement>(
			'.modal__close',
			container
		);
		this._content = ensureElement<HTMLElement>('.modal__content', container);
		this._closeButton.addEventListener('click', this.close.bind(this));
		this.container.addEventListener('click', this.close.bind(this));
		this._content.addEventListener('click', (event) => event.stopPropagation());
	}

	set content(value: HTMLElement | null) {
		if (value) {
			this._content.replaceChildren(value);
		} else {
			this._content.innerHTML = '';
		}
	}

	open() {
		this.container.classList.add('modal_active');
		this.events.emit('modal:open');
	}

	close() {
		this.container.classList.remove('modal_active');
		this.content = null;
		this.events.emit('modal:close');
	}

	render(data: IModal): HTMLElement {
		this.open();
		return this.container;
	}

}