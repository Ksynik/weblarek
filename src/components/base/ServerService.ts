import { Api } from '../base/Api';
import { IProduct, TOrder } from '../../types';
import { CDN_URL } from '../../utils/constants';


export class ServerService {
    private api: Api;
    readonly cdn: string;

    constructor(api: Api) {
        this.api = api;
        this.cdn = CDN_URL;
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
        return CDN_URL + needsSlash + path;
    }
}
