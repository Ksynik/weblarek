import { IUser, TPayment } from '../../types';
import { EventEmitter } from '../base/Events';

export class User {
    payment: TPayment | '' = '';
    email: string = '';
    phone: string = '';
    address: string = '';
    public events = new EventEmitter();

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

    validate(): Record<string, string | null> {
        return {
            email: this.email ? null : 'Email не может быть пустым',
            phone: this.phone ? null : 'Телефон не может быть пустым',
            address: this.address ? null : 'Необходимо указать адрес',
            payment: this.payment ? null : 'Не выбран способ оплаты',
        };
    }

    isValid(): boolean {
        const errors = this.validate();
        return Object.values(errors).every(value => value === null);
    }
}