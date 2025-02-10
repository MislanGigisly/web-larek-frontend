import {CardItem, ICardsData} from '../../types/index'
import {Model} from '../base/Model'

export class CardsData extends Model<ICardsData> {
    items: CardItem[];

    getCardList (): CardItem[] {
        return this.items;
    }

   /* getCard (idCards :string[]): CardItem[] {
         idCards.map((idCard)=>{
            return this.items.find(card => card.id === idCard)

         });
    }*/

    getCard(idCards :string[]): CardItem[] {
        return this.items
            .filter(item => idCards.includes(item.id))
    }
        
    setcards (data: CardItem[]) {
        this.items = data;
        this.emitChanges('items:changed');
    }

   
}