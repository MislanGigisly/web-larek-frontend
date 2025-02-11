import {Form} from "./common/Form";
import {IPurchase} from "../types";
import {IEvents} from "./base/events";

export class PurchaseUI extends Form<IPurchase> {
    protected _buttonOnline: HTMLElement;
    protected _buttonOffline: HTMLElement;
    constructor(container: HTMLFormElement, events: IEvents) {
        super(container, events);
        this._buttonOnline = this.container.querySelector('button[name=card]')
        this._buttonOffline = this.container.querySelector('button[name=cash]')
        this._buttonOnline.addEventListener('click', ()=>{
            this.pushButton(this._buttonOnline);
            this.onInputChange('payment', 'Online');
        });
        this._buttonOffline.addEventListener('click', ()=>{
            this.pushButton(this._buttonOffline);
            this.onInputChange('payment', 'Offline');
        })
    }

    set address(value: string) {
        (this.container.elements.namedItem('address') as HTMLInputElement).value = value;
    }
    pushButton(button: HTMLElement) {
        if (button === this._buttonOnline) {
            this.setDisabled(this._buttonOnline ,true)
            if ((this._buttonOffline.getAttribute('disabled') != 'null')){
                this.setDisabled(this._buttonOffline ,false)
            }
        } else {
            this.setDisabled(this._buttonOffline ,true)
            if ((this._buttonOnline.getAttribute('disabled') != 'null')){
                this.setDisabled(this._buttonOnline ,false)
            }
        }
    }

    unpushButtons() {
        this.setDisabled(this._buttonOffline, false);
        this.setDisabled(this._buttonOnline, false)
    }

}