
import { IUser, TPayment } from '../../types';
import { EventEmitter } from '../base/Events';

export class User {
    payment: TPayment = 'card';
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
        this.payment = 'card';
        this.email = '';
        this.phone = '';
        this.address = '';
        this.events.emit('user:changed', this.getData());
    }

    validate(): boolean {
        return (
            !!this.email &&
            !!this.phone &&
            !!this.address &&
            !!this.payment
        );
    }

    on<T extends object>(event: string, callback: (event: T) => void): void {
        this.events.on<T>(event, callback);
    }
}