import { Form } from '../Form';
import { ensureElement } from '../../../utils/utils';
import { TPayment } from '../../../types';

interface IOrderForm {
    payment: TPayment;
    address: string;
}

export class OrderForm extends Form<IOrderForm> {
    protected _paymentButtons: NodeListOf<HTMLButtonElement>;
    protected _addressInput: HTMLInputElement;
    private _paymentChangeHandlers: ((method: TPayment) => void)[] = [];
    private _errorsElement: HTMLElement;

    constructor(container: HTMLFormElement) {
        super(container);

        this._paymentButtons = this.container.querySelectorAll('button[name]');
        this._addressInput = ensureElement<HTMLInputElement>('input[name="address"]', this.container);

        this._paymentButtons.forEach(button => {
            button.addEventListener('click', this.handlePaymentChange.bind(this));
        });

        this._addressInput.addEventListener('input', () => this.validate());
        this._errorsElement = ensureElement<HTMLElement>('.form__errors', this.container);
    }

    private handlePaymentChange(event: MouseEvent): void {
        const target = event.target as HTMLButtonElement;
        const paymentMethod = target.name as TPayment; 
        this.setPayment(paymentMethod);
        this._paymentChangeHandlers.forEach(handler => handler(paymentMethod));
        this.validate();
    }

    protected validate(): boolean {
        const address = this._addressInput.value.trim();
        const hasPayment = this.container.querySelector('button[name].button_active');

        const isValid = !!address && !!hasPayment;

        if (!address) {
            this._errorsElement.textContent = 'Необходимо указать адрес';
        } else {
            this._errorsElement.textContent = '';
        }

        const submitButton = this.container.querySelector('button[type="submit"]') as HTMLButtonElement;
        if (submitButton) {
            submitButton.disabled = !isValid;
        }

        return isValid;
    }

    protected getFormData(): IOrderForm {
        return {
            payment: this.getSelectedPayment(),
            address: this._addressInput.value
        };
    }

    private setPayment(method: TPayment): void {
        this._paymentButtons.forEach(button => {
            button.classList.toggle('button_active', button.name === method);
        });
    }

    private getSelectedPayment(): TPayment {
        const activeButton = this.container.querySelector('button[name].button_active') as HTMLButtonElement;
        return (activeButton?.name as TPayment) || 'card'; 
    }

    set payment(value: TPayment) {
        this.setPayment(value);
    }

    set address(value: string) {
        this._addressInput.value = value;
        this.validate();
    }

    set onPaymentChange(handler: (method: TPayment) => void) {
        this._paymentChangeHandlers.push(handler);
    }

    clear(): void {
        super.clear();
        this._paymentButtons.forEach(button => {
            button.classList.remove('button_active');
        });
    }
}