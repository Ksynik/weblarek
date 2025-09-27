import { Form } from '../Form';
import { ensureElement } from '../../../utils/utils';
import { EventEmitter } from '../../base/Events';

interface IContactsForm {
    email: string;
    phone: string;
}

export class ContactsForm extends Form<IContactsForm> {
    protected _emailInput: HTMLInputElement;
    protected _phoneInput: HTMLInputElement;
    private _errorsElement: HTMLElement;
    public events: EventEmitter;

    constructor(container: HTMLFormElement) {
        super(container);
        this.events = new EventEmitter();

        this._emailInput = ensureElement<HTMLInputElement>('input[name="email"]', this.container);
        this._phoneInput = ensureElement<HTMLInputElement>('input[name="phone"]', this.container);
        this._errorsElement = ensureElement<HTMLElement>('.form__errors', this.container);

        this._emailInput.addEventListener('input', () => {
            this.events.emit('field:changed', { field: 'email', value: this._emailInput.value });
        });

        this._phoneInput.addEventListener('input', () => {
            this.events.emit('field:changed', { field: 'phone', value: this._phoneInput.value });
        });
    }

    updateErrors(message: string): void {
        this._errorsElement.textContent = message;
    }

    setEmail(value: string) {
        this._emailInput.value = value;
        this.events.emit('field:changed', { field: 'email', value });
    }

    setPhone(value: string) {
        this._phoneInput.value = value;
        this.events.emit('field:changed', { field: 'phone', value });
    }

    updateSubmitButtonState(isValid: boolean): void {
        const submitButton = this.container.querySelector('button[type="submit"]') as HTMLButtonElement;
        if (submitButton) {
            submitButton.disabled = !isValid;
        }
    }

    getFormData(): IContactsForm {
        return {
            email: this._emailInput.value,
            phone: this._phoneInput.value,
        };
    }

    protected handleSubmit(): void {
        this.events.emit('submit', this.getFormData());
    }

    protected validate(): boolean {
        return true; // бизнес-валидация уехала в модель User
    }
}
