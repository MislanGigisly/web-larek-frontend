import { Api, ApiListResponse } from './base/api';
import {IOrder, IOrderResult, ICardsData, CardItem} from "../types";

export interface IAuctionAPI {
    getLotList: () => Promise<CardItem[]>;
    getLotItem: (id: string) => Promise<CardItem>;
    //getLotUpdate: (id: string) => Promise<LotUpdate>;
    //placeBid(id: string, bid: IBid): Promise<LotUpdate>;
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

   /* getLotUpdate(id: string): Promise<LotUpdate> {
        return this.get(`/lot/${id}/_auction`).then(
            (data: LotUpdate) => data
        );
    }*/

    getLotList(): Promise<CardItem[]> {
        return this.get('/product').then((data: ApiListResponse<CardItem>) =>
            data.items.map((item) => ({
                ...item,
                image: this.cdn + item.image
            }))
        );
    }

   /* placeBid(id: string, bid: IBid): Promise<LotUpdate> {
        return this.post(`/lot/${id}/_bid`, bid).then(
            (data: ILot) => data
        );
    }*/

    orderLots(order: IOrder): Promise<IOrderResult> {
        return this.post('/order', order).then(
            (data: IOrderResult) => data
        );
    }

}