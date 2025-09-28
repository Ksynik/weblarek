import { CardBase } from './CardBase';
import { IEvents } from '../../base/Events';

export class PreviewCard extends CardBase {
    protected imageElement: HTMLImageElement;
    protected categoryElement: HTMLElement;
    protected descriptionElement: HTMLElement;
    protected buttonElement: HTMLButtonElement;

    public onClick?: () => void;

    constructor(container: HTMLElement, events: IEvents) {
        super(events, container);

        this.imageElement = this.container.querySelector<HTMLImageElement>('.card__image')!;
        this.categoryElement = this.container.querySelector<HTMLElement>('.card__category')!;
        this.descriptionElement = this.container.querySelector<HTMLElement>('.card__text')!;
        this.buttonElement = this.container.querySelector<HTMLButtonElement>('.card__button')!;

        this.buttonElement.addEventListener('click', () => {
            if (this.onClick) this.onClick();
        });
    }

    set image(src: string) { 
        if (this.imageElement) this.imageElement.src = src; 
    }
    set alt(value: string) { 
        if (this.imageElement) this.imageElement.alt = value; 
    }
    set category(value: string) { 
        if (this.categoryElement) this.categoryElement.textContent = value; 
    }
    set categoryClass(value: string) {
        if (!this.categoryElement) return;
        this.categoryElement.className = 'card__category';
        this.categoryElement.classList.add(`card__category_${value}`);
    }
    set description(value: string) { 
        if (this.descriptionElement) this.descriptionElement.textContent = value; 
    }
    set buttonText(value: string) { 
        if (this.buttonElement) this.buttonElement.textContent = value; 
    }
    set buttonDisabled(value: boolean) { 
        if (this.buttonElement) this.buttonElement.disabled = value; 
    }
}

