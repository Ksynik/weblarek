import { Form } from '../Form';
import { ensureElement } from '../../../utils/utils';

interface IContactsForm {
    email: string;
    phone: string;
}

export class ContactsForm extends Form<IContactsForm> {
    protected _emailInput: HTMLInputElement;
    protected _phoneInput: HTMLInputElement;

    constructor(container: HTMLFormElement) {
        super(container);

        this._emailInput = ensureElement<HTMLInputElement>('input[name="email"]', this.container);
        this._phoneInput = ensureElement<HTMLInputElement>('input[name="phone"]', this.container);

        this._emailInput.addEventListener('input', () => this.validate());
        this._phoneInput.addEventListener('input', () => this.validate());
    }

    protected validate(): boolean {
        const email = this._emailInput.value.trim();
        const phone = this._phoneInput.value.trim();

        const emailValid = this.isValidEmail(email);
        const phoneValid = this.isValidPhone(phone);
        const isValid = emailValid && phoneValid;
        
        console.log('ContactForm validation:', { email, phone, emailValid, phoneValid, isValid });
        
        const submitButton = this.container.querySelector('button[type="submit"]') as HTMLButtonElement;
        if (submitButton) {
            submitButton.disabled = !isValid;
        }
        
        return isValid;
    }

    protected getFormData(): IContactsForm {
        return {
            email: this._emailInput.value,
            phone: this._phoneInput.value
        };
    }

    protected getErrors(): string[] {
        const errors: string[] = [];
        const email = this._emailInput.value.trim();
        const phone = this._phoneInput.value.trim();

        if (!email) {
            errors.push('Укажите email');
        } else if (!this.isValidEmail(email)) {
            errors.push('Неверный формат email');
        }

        if (!phone) {
            errors.push('Укажите телефон');
        } else if (!this.isValidPhone(phone)) {
            errors.push('Неверный формат телефона');
        }

        return errors;
    }

    private isValidEmail(email: string): boolean {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    private isValidPhone(phone: string): boolean {
        const phoneRegex = /^\+7[\s-]?\(?\d{3}\)?[\s-]?\d{3}[\s-]?\d{2}[\s-]?\d{2}$/;
        return phoneRegex.test(phone);
    }

    set email(value: string) {
        this._emailInput.value = value;
        this.validate();
    }

    set phone(value: string) {
        this._phoneInput.value = value;
        this.validate();
    }
}