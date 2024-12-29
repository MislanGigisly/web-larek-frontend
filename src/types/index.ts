export type CardItem  = {
    id: string;
    description: string;
    image: string;
    title: string;
    category: string;
    price: number;
}

export interface ICardsData {
    _items: Array<CardItem>
}

export type PaymentMethod = 'offline'|'online'

export interface IOrderForm {
    payment: PaymentMethod;
    email: string;
    phone: string;
    address: string;
}

export interface IBasket {
    items: CardItem[];
}
