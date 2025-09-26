import  { Component } from '../base/Component';
import { IGallery } from '../../types';

export class Gallery extends Component<IGallery> {

    protected catalogElement: HTMLElement;

    constructor(container: HTMLElement) {
        super(container);
        this.catalogElement = this.container;
    }
    set catalog(cards: HTMLElement[]) {
        this.catalogElement.innerHTML = '';
        this.catalogElement.append(...cards);
    }
}