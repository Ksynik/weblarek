
import { IUser, TPayment } from '../../types';

export class User {
    payment: TPayment = 'card';
    email: string = '';
    phone: string = '';
    address: string = '';

    setData(data: Partial<IUser>): void {
        if (data.payment !== undefined) this.payment = data.payment;
        if (data.email !== undefined) this.email = data.email;
        if (data.phone !== undefined) this.phone = data.phone;
        if (data.address !== undefined) this.address = data.address;
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
    }

    validate(): boolean {
        return (
            !!this.email &&
            !!this.phone &&
            !!this.address &&
            !!this.payment
        );
    }
}