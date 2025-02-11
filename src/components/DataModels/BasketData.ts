import _ from "lodash"
import {IBasket} from '../../types/index'
import {Model} from '../base/Model'

export class BasketData extends Model<IBasket> {
    protected _goods: string[] = [];
    protected _total: number = 0;

    toggleOrderedLot(id: string, isIncluded: boolean, price?: number): void {
        if (isIncluded) {
            this._goods = _.uniq([...this._goods, id]);
        } else {
            this._goods = _.without(this._goods, id);

        };
        this.events.emit('basket:changed')
    }

    clearBasket() {
        this._goods.forEach(id => {
        this.toggleOrderedLot(id, false);
        this._total = 0
        });
        this.events.emit('basket:changed')
    }

    getTotal(): number {
        return this._total;
    }

    getBasketList(): string[] {
        return this._goods;
    }

    getCheckGoods(): boolean {
        if (this._goods.length > 0) {
            return true;
        } else {
            return false;
        };
    }
}