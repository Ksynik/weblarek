import { IUser, TPayment } from '../../types';
import { EventEmitter } from '../base/Events';

export class User {
    payment: TPayment = '';
    email: string = '';
    phone: string = '';
    address: string = '';
    private events = new EventEmitter();

    setData(data: Partial<IUser>): void {
        if (data.payment !== undefined) this.payment = data.payment;
        if (data.email !== undefined) this.email = data.email;
        if (data.phone !== undefined) this.phone = data.phone;
        if (data.address !== undefined) this.address = data.address;
        this.events.emit('user:changed', this.getData());
    }

    getData(): IUser {
        return {
            payment: this.payment,
            email: this.email,
            phone: this.phone,
            address: this.address,
        };
    }

    clear(): void {
        this.payment = '';
        this.email = '';
        this.phone = '';
        this.address = '';
        this.events.emit('user:changed', this.getData());
    }

    getOrderErrors(): { payment?: string; address?: string } {
        const errors: { payment?: string; address?: string } = {};
        if (!this.payment) {
            errors.payment = 'Не выбран способ оплаты';
        }
        if (!this.address) {
            errors.address = 'Укажите адрес';
        }
        return errors;
    }

    getContactsErrors(): { email?: string; phone?: string } {
        const errors: { email?: string; phone?: string } = {};
        if (!this.email) {
            errors.email = 'Укажите e-mail';
        }
        if (!this.phone) {
            errors.phone = 'Укажите телефон';
        }
        return errors;
    }

    getFieldErrors(): { payment?: string; email?: string; phone?: string; address?: string } {
        return {
            ...this.getOrderErrors(),
            ...this.getContactsErrors()
        };
    }

    validate(): boolean {
        return !!(this.payment && this.email && this.phone && this.address);
    }
}