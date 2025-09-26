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
export type TPayment = 'online' | 'offline' | 'card' | 'cash';

// Интерфейс пользователя
export interface IUser {
    payment: TPayment;
    email: string;
    phone: string;
    address: string;
}
    // Тип для объекта заказа, отправляемого на сервер
export type TOrder = {
    items: string[]; 
    price: number | null;
    payment: TPayment;
    address: string;
    email: string;
    phone: string;
};

export interface IBasket {
    items: HTMLElement[];
    price: number | null;
}
export interface IBasketItem {
    index: number;
    title: string;
    price: number | null;
}    
export interface IHeader {
    counter: number;
}

export interface IPreviewCard {
    image: string;
    alt?: string;
    category: string;
    categoryClass?: string;
    title: string;
    description: string;
    price: number | null;
    buttonText: string;
    buttonDisabled?: boolean;
}
export interface ICatalogCard {
    category: string;
    title: string;
    image: string;
    price: number | null;
}
export interface IHeader {
    counter: number;
}
export interface IModal {
    modal: HTMLElement;
}
export interface ISuccess {
    totalPrice: number;
    onClose: () => void;
}
export interface IGallery {
    catalog: HTMLElement[];
}
