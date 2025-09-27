import { Component } from '../../base/Component';
import { IEvents } from '../../base/Events';
import {ensureElement} from '../../../utils/utils';

interface CardBaseData {
    cardTitle: string;
    price: number | null;
    id: string;
}

export abstract class CardBase extends Component<CardBaseData> {
    protected titleElement: HTMLElement;
    protected priceElement: HTMLElement;
    protected cardId: string = "";


    constructor(protected events: IEvents, container: HTMLElement) {
        super(container);
        
        this.titleElement = ensureElement<HTMLElement>('.card__title', this.container);
        this.priceElement = ensureElement<HTMLElement>('.card__price', this.container);
    }

    set title(value: string) {
        this.titleElement.textContent = value;
    }

    set price(value: number | null) {
        this.priceElement.textContent = value === null ? 'Бесценно' : `${value} синапсов`;
    }

    set id(value: string) {
        this.cardId = value;
    }

    get id(): string {
        return this.cardId;
    }
}