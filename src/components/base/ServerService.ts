import { Api } from '../base/Api';
import { IProduct, TOrder } from '../../types';


export class ServerService {
    private api: Api;
    readonly cdn: string;

    constructor(baseUrl: string, cdn: string = baseUrl) {
        const origin = (baseUrl || '').replace(/\/+$/, '');
        this.api = new Api(origin + '/api/weblarek');
        this.cdn = (cdn || origin) + '/content/weblarek';
    }

    getProductList(): Promise<IProduct[]> {
        return this.api.get<{ items: IProduct[] }>('/product/')
            .then((data) => data.items.map((item) => ({
                ...item,
                image: this.makeImageUrl(item.image)
            })));
    }

    createOrder(order: TOrder): Promise<any> {
        return this.api.post('/order', order, 'POST');
    }

    private makeImageUrl(path: string): string {
        if (!path) return '';
        if (/^https?:\/\//i.test(path)) return path;
        const needsSlash = path.startsWith('/') ? '' : '/';
        return this.cdn + needsSlash + path;
    }
}
