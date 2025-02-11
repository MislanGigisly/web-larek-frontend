import {Component} from "./base/Component";
import {ensureElement} from "../utils/utils";

interface ICardActions {
    onClick: (event: MouseEvent) => void;
}

export interface ICard {
    title: string;
    description?: string | string[];
    image: string;
    category: string;
    price: number;
    priority?: number; 
}

export class CardUI extends Component<ICard> {
    protected _title: HTMLElement;
    protected _image?: HTMLImageElement;
    protected _description?: HTMLElement;
    protected _category?: HTMLElement;
    protected _price?: HTMLElement;
    protected _priority? :HTMLElement;
    protected _button?: HTMLButtonElement;


    constructor(protected blockName: string, container: HTMLElement, actions?: ICardActions) {
        super(container);
        this._title = ensureElement<HTMLElement>(`.${blockName}__title`, container);
        this._image = container.querySelector(`.${blockName}__image`);
        this._button = container.querySelector(`.${blockName}__button`);
        this._priority = container.querySelector('.basket__item-index');
        this._description = container.querySelector(`.${blockName}__text`);
        this._category = container.querySelector(`.${blockName}__category`);
        this._price = container.querySelector(`.${blockName}__price`);
        if (actions?.onClick) {
            if (this._button) {
                this._button.addEventListener('click', actions.onClick);
            } else {
                container.addEventListener('click', actions.onClick);
            }
        }
    }

    set id(value: string) {
        this.container.dataset.id = value;
    }

    get id(): string {
        return this.container.dataset.id || '';
    }

    set title(value: string) {
        this.setText(this._title, value);
    }

    set image(value: string) {
        if (this._image) {
        this.setImage(this._image, value, this.title)
        }
    }

    set description(value: string | string[]) {
        if (Array.isArray(value)) {
            this._description.replaceWith(...value.map(str => {
                const descTemplate = this._description.cloneNode() as HTMLElement;
                this.setText(descTemplate, str);
                return descTemplate;
            }));
        } else {
            this.setText(this._description, value);
        }
    }

    set category (value: string) {
        this.setText(this._category, value);
        this.toggleClass(this._category, 'card__category_additional', value === 'дополнительное');
        this.toggleClass(this._category, 'card__category_soft', value === 'софт-скил');
        this.toggleClass(this._category, 'card__category_hard', value === 'хард-скил');
        this.toggleClass(this._category, 'card__category_other', value === 'другое');
        this.toggleClass(this._category, 'card__category_button', value === 'кнопка')
    };

    set price(value: number) {
        if (value === null){
            this.setText(this._price, `Бесценно`);
        }else{
            this.setText(this._price, `${value} синапсов`);
        }
    }

    set priority (digit: number) {
        this.setText(this._priority, digit);
    }  
    
    set button (isActive: boolean) {
        if(isActive){
            this.setDisabled(this._button, false)
        } else {
            this.setDisabled(this._button, true)
        }
    }
};