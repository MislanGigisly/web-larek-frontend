import { Api, ApiListResponse } from './base/api';
import {IOrder, IOrderResult, CardItem} from "../types";

export interface IAuctionAPI {
    getLotList: () => Promise<CardItem[]>;
    getLotItem: (id: string) => Promise<CardItem>;
    orderLots: (order: IOrder) => Promise<IOrderResult>;
}

export class AuctionAPI extends Api implements IAuctionAPI {
    readonly cdn: string;

    constructor(cdn: string, baseUrl: string, options?: RequestInit) {
        super(baseUrl, options);
        this.cdn = cdn;
    }

    getLotItem(id: string): Promise<CardItem> {
        return this.get(`/product/${id}`).then(
            (item: CardItem) => ({
                ...item,
                image: this.cdn + item.image,
            })
        );
    }

    getLotList(): Promise<CardItem[]> {
        return this.get('/product').then((data: ApiListResponse<CardItem>) =>
            data.items.map((item) => ({
                ...item,
                image: this.cdn + item.image
            }))
        );
    }

    orderLots(order: IOrder): Promise<IOrderResult> {
        return this.post('/order', order).then(
            (data: IOrderResult) => data
        );
    }
}