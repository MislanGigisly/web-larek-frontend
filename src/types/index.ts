export type CardItem  = {
    id: string;
    description: string;
    image: string;
    title: string;
    category: string;
    price: number;
}

export interface ICardsData {
    items: CardItem[]
}

export type IOrderForm = IContacts & IPurchase

export interface IContacts {
    email: string;
    phone: string;
}

export interface IPurchase {
    payment: string;
    address: string;
}

export interface IOrder extends IOrderForm {
    items: string[];
    total: number;
}

export interface IOrderResult {
    id: string;
    total: number;
}

export type FormErrors = Partial<Record<keyof IOrderForm, string>>;

export interface IBasket {
    goods: string[];
    total: number;
}
