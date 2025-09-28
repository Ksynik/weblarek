import { Form } from '../Form';
import { ensureElement } from '../../../utils/utils';
import { EventEmitter } from '../../base/Events';
import { TPayment } from '../../../types';
import { User } from '../../Models/User';

export class OrderForm extends Form {
    private addressInput: HTMLInputElement;
    private paymentButtons: NodeListOf<HTMLButtonElement>;
    public events: EventEmitter;

    constructor(container: HTMLFormElement, events: EventEmitter, private user: User) {
        super(container);
        this.events = events;

        this.addressInput = ensureElement<HTMLInputElement>('input[name="address"]', this.formElement);
        this.paymentButtons = this.formElement.querySelectorAll<HTMLButtonElement>('button[name]');

        this.addressInput.addEventListener('input', () => this.onFieldChanged());

        this.paymentButtons.forEach(button => {
            button.addEventListener('click', () => this.onPaymentSelected(button.name as TPayment));
        });

        this.updateFormState();
    }

    protected emitSubmitEvent(): void {
        const address = this.addressInput.value.trim();
        const payment = this.getSelectedPayment();

        this.user.setData({ address, payment });

        const errors = this.user.validate();
        const isValid = !errors.address && !errors.payment;

        if (!isValid) {
            this.updateFormState();
            return;
        }

        this.events.emit('OrderForm:submit');
    }

    private onFieldChanged(): void {
        this.user.setData({ address: this.addressInput.value.trim() });
        this.updateFormState();
        this.events.emit('OrderForm:fieldChanged', { field: 'address', value: this.addressInput.value });
    }

    private onPaymentSelected(method: TPayment): void {
        this.user.setData({ payment: method });
        this.updatePaymentButtons(method);
        this.updateFormState();
        this.events.emit('OrderForm:paymentChanged', { method });
    }

    private updatePaymentButtons(selected: TPayment): void {
        this.paymentButtons.forEach(btn => {
            btn.classList.toggle('button_alt-active', btn.name === selected);
        });
    }

    private getSelectedPayment(): TPayment {
        const activeButton = Array.from(this.paymentButtons).find(btn => btn.classList.contains('button_alt-active'));
        return (activeButton?.name as TPayment) || '';
    }

    private updateFormState(): void {
        const errors = this.user.validate();
        const isValid = !errors.address && !errors.payment;

        this.submitButtonEnabled = isValid;
        this.errors = isValid ? '' : errors.address || errors.payment || '';
    }

    set address(value: string) {
        this.addressInput.value = value;
        this.updateFormState();
    }

    set payment(value: TPayment) {
        this.user.setData({ payment: value });
        this.updatePaymentButtons(value);
        this.updateFormState();
    }
}