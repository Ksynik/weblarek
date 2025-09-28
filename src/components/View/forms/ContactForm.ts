import { Form } from '../Form';
import { ensureElement } from '../../../utils/utils';
import { EventEmitter } from '../../base/Events';
import { User } from '../../Models/User';

export class ContactsForm extends Form {
    private emailInput: HTMLInputElement;
    private phoneInput: HTMLInputElement;
    private user: User;

    constructor(container: HTMLFormElement, public events: EventEmitter, user: User) {
        super(container);
        this.user = user;

        this.emailInput = ensureElement<HTMLInputElement>('input[name="email"]', this.formElement);
        this.phoneInput = ensureElement<HTMLInputElement>('input[name="phone"]', this.formElement);

        [this.emailInput, this.phoneInput].forEach(input =>
            ['input', 'change'].forEach(evt =>
                input.addEventListener(evt, () => this.onFieldChanged())
            )
        );

        this.updateFormState();
    }

    protected emitSubmitEvent(): void {
        const email = this.emailInput.value.trim();
        const phone = this.phoneInput.value.trim();

        this.user.setData({ email, phone });
        const errors = this.user.validate();
        const isValid = !errors.email && !errors.phone;

        if (!isValid) {
            this.updateFormState();
            return;
        }

        this.events.emit('ContactsForm:submit');
    }

    private onFieldChanged() {
        const email = this.emailInput.value.trim();
        const phone = this.phoneInput.value.trim();

        this.user.setData({ email, phone });
        this.updateFormState();

        this.events.emit('field:changed', { field: 'email', value: email });
        this.events.emit('field:changed', { field: 'phone', value: phone });
    }

    private updateFormState() {
        const errors = this.user.validate();
        const isValid = !errors.email && !errors.phone;

        this.submitButtonEnabled = isValid;
        this.errors = isValid ? '' : errors.email || errors.phone || '';
    }

    set email(value: string) {
        this.emailInput.value = value;
        this.updateFormState();
    }

    set phone(value: string) {
        this.phoneInput.value = value;
        this.updateFormState();
    }

    clear() {
        this.email = '';
        this.phone = '';
        this.user.setData({ email: '', phone: '' });
    }
}

