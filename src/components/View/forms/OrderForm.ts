import { Form } from '../Form';
import { ensureElement } from '../../../utils/utils';
import { TPayment } from '../../../types';
import { EventEmitter } from '../../base/Events';

interface IOrderForm {
    payment: TPayment;
    address: string;
}

export class OrderForm extends Form<IOrderForm> {
    protected _paymentButtons: NodeListOf<HTMLButtonElement>;
    protected _addressInput: HTMLInputElement;
    private _errorsElement: HTMLElement;
    public events: EventEmitter;

    constructor(container: HTMLFormElement) {
        super(container);
        this.events = new EventEmitter();

        this._paymentButtons = this.container.querySelectorAll('button[name]');
        this._addressInput = ensureElement<HTMLInputElement>('input[name="address"]', this.container);
        this._errorsElement = ensureElement<HTMLElement>('.form__errors', this.container);

        this._addressInput.addEventListener('input', () => {
            this.events.emit('field:changed', { field: 'address', value: this._addressInput.value });
        });

        this._paymentButtons.forEach(button => {
            button.classList.remove('button_alt-active');
            button.addEventListener('click', () => {
                const paymentMethod = button.name as TPayment;
                this.setPayment(paymentMethod);
                this.events.emit('payment:changed', { method: paymentMethod });
            });
        });
    }

    protected getFormData(): IOrderForm {
        return {
            payment: this.getSelectedPayment(),
            address: this._addressInput.value
        };
    }

    private setPayment(method: TPayment): void {
        this._paymentButtons.forEach(button => {
            button.classList.toggle('button_alt-active', button.name === method);
        });
    }

    private getSelectedPayment(): TPayment {
        const activeButton = this.container.querySelector('button[name].button_alt-active') as HTMLButtonElement;
        return (activeButton?.name as TPayment) || '';
    }

    set payment(value: TPayment) {
        this.setPayment(value);
    }

    set address(value: string) {
        this._addressInput.value = value;
        this.events.emit('field:changed', { field: 'address', value });
    }

    updateSubmitButtonState(isValid: boolean): void {
        const submitButton = this.container.querySelector('button[type="submit"]') as HTMLButtonElement;
        if (submitButton) {
            submitButton.disabled = !isValid;
        }
    }

    updateErrors(message: string): void {
        this._errorsElement.textContent = message;
    }

    protected handleSubmit(): void {
        this.events.emit('submit', this.getFormData());
    }

    protected validate(): boolean {
        return true; 
    }
}
