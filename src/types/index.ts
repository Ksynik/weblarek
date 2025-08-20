// Интерфейс товара
export interface IProduct {
    id: string;
    description: string;
    image: string;
    title: string;
    category: string;
    price: number | null;
}

// Тип для способа оплаты
export type TPayment = 'card' | 'cash';

// Интерфейс пользователя
export interface IUser {
    payment: TPayment;
    email: string;
    phone: string;
    address: string;
}
    // Тип для объекта заказа, отправляемого на сервер
    export type TOrder = {
        user: IUser;
        items: IProduct[];
    };