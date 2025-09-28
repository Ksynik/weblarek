import { Component } from '../base/Component';
import { ensureElement } from '../../utils/utils';

export abstract class Form extends Component<{}> {
    protected formElement: HTMLFormElement;
    protected errorsElement: HTMLElement;
    protected submitButton: HTMLButtonElement;

    constructor(container: HTMLFormElement) {
        super(container);
        this.formElement = container;

        this.errorsElement = ensureElement<HTMLElement>('.form__errors', this.formElement);
        this.submitButton = ensureElement<HTMLButtonElement>('button[type="submit"]', this.formElement);

        this.formElement.addEventListener('submit', (event: SubmitEvent) => {
            event.preventDefault();
            this.handleSubmit();
        });
    }

    set errors(message: string) {
        this.errorsElement.textContent = message;
    }

    set submitButtonEnabled(isEnabled: boolean) {
        this.submitButton.disabled = !isEnabled;
    }

    protected abstract emitSubmitEvent(): void;

    protected handleSubmit(): void {
        this.emitSubmitEvent();
    }

    clear(): void {
        this.formElement.reset();
        this.errors = '';
        this.submitButtonEnabled = false;
    }
}