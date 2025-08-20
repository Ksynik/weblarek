import { Api } from '../base/Api';
import { IProduct, TOrder } from '../../types';

export class ServerService {
    private api: Api;

    constructor(baseUrl: string) {
        this.api = new Api(baseUrl);
    }

    getProducts(): Promise<IProduct[]> {
        return this.api.get<IProduct[]>('/products');
    }

    createOrder(order: TOrder): Promise<any> {
        return this.api.post('/orders', order, 'POST');
    }
}
