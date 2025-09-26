import { IProduct } from '../../types';
import { EventEmitter } from '../base/Events';

export class ProductCatalog {
    products: IProduct[] = [];
    selectedProduct: IProduct | null = null;
    private events: EventEmitter;

     constructor() {
        this.events = new EventEmitter();
    }

    setProducts(products: IProduct[]): void {
        this.products = products;
        this.events.emit('products:changed', this.products);
        this.events.emit('items:changed', this.products);
    }

    getProducts(): IProduct[] {
        return this.products;
    }

    getProductById(id: string): IProduct | undefined {
        return this.products.find(product => product.id === id);
    }

    setSelectedProduct(product: IProduct): void {
        this.selectedProduct = product;
        this.events.emit('product:selected', product);
        this.events.emit('preview:changed', product);
    }

    getSelectedProduct(): IProduct | null {
        return this.selectedProduct;
    }
     on<T extends object>(event: string, callback: (event: T) => void): void {
        this.events.on<T>(event, callback);
    }
}