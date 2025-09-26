import { IProduct } from '../../types';
import { EventEmitter } from '../base/Events';

export class Cart {
    private items: IProduct[] = [];
    private events: EventEmitter;

    constructor() {
        this.events = new EventEmitter();
    }

    getItems(): IProduct[] {
        return this.items;
    }

    addItem(product: IProduct): void {
        if (!this.hasItem(product.id)) {
            this.items.push(product);
            this.events.emit('cart:changed', this.items);
        }
    }

    removeItem(product: IProduct): void {
        this.items = this.items.filter(item => item.id !== product.id);
        this.events.emit('cart:changed', this.items);
    }

    clear(): void {
        this.items = [];
        this.events.emit('cart:changed', this.items);
    }

    getTotalPrice(): number {
        return this.items.reduce((sum, item) => sum + (item.price ?? 0), 0);
    }

    getCount(): number {
        return this.items.length;
    }

    hasItem(id: string): boolean {
        return this.items.some(item => item.id === id);
    }
     on(event: string, callback: (event: object) => void): void {
        this.events.on(event, callback);
    }
}