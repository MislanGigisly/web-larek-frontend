import {Form} from "./common/Form";
import {IPurchase} from "../types";
import {IEvents} from "./base/events";

export class PurchaseUI extends Form<IPurchase> {
    protected _buttonOnline: HTMLButtonElement;
    protected _buttonOffline: HTMLButtonElement;
    constructor(container: HTMLFormElement, events: IEvents) {
        super(container, events);
        this._buttonOnline = this.container.querySelector('button[name=card]')
        this._buttonOffline = this.container.querySelector('button[name=cash]')
        this._buttonOnline.addEventListener('click', ()=>{
            this.onInputChange('payment', 'Online');
        });
        this._buttonOffline.addEventListener('click', ()=>{
            this.onInputChange('payment', 'Offline');
        })
    }

    set address(value: string) {
        (this.container.elements.namedItem('address') as HTMLInputElement).value = value;
    }

    setbuttonOnline() {
        this.setDisabled(this._buttonOnline, true);
        this.setDisabled(this._buttonOffline, false)
    }
    setbuttonOffline() {
        this.setDisabled(this._buttonOffline, true);
        this.setDisabled(this._buttonOnline, false)
    }

    unpushButtons() {
        this.setDisabled(this._buttonOffline, false);
        this.setDisabled(this._buttonOnline, false)
    }

}