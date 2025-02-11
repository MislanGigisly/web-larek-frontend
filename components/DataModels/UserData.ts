import {IOrderForm, FormErrors, IContacts, IPurchase} from '../../types/index'
import {Model} from '../base/Model'

export class UserData extends Model<IOrderForm>  {
    protected payment: string;
    protected email: string;
    protected phone: string;
    protected address: string;
    formErrors: FormErrors = {};

    getOrderData(): IPurchase {
        return {
            payment: this.payment,
            address: this.address,
        }
    }

    getContsctsData(): IContacts {
        return {
            email: this.email,
            phone: this.phone,
        }
    }
    
    getAllUserData(): IOrderForm {
        return {
            payment: this.payment,
            email: this.email,
            address: this.address,
            phone: this.phone,
        }
    }

    clearForm(): void {
        this.payment = ""
        this.email = ""
        this.phone = ""
        this.address = ""
    }

    isValidOrder(): boolean {
        const errors: typeof this.formErrors = {};
        if (!this.payment) {
            errors.payment = 'Необходимо указать способ оплаты';
        } 
        if (!this.address) {
            errors.address = 'Необходимо указать адрес доставки';
        }
        this.formErrors = errors;
        this.events.emit('formErrors:change', this.formErrors);
        return Object.keys(errors).length === 0;
    }

    isValidContacts(): boolean {
        const errors: typeof this.formErrors = {};
        if (!this.email) {
            errors.email = 'Необходимо указать email';
        }
        if (!this.phone) {
            errors.phone = 'Необходимо указать телефон';
        }
        this.formErrors = errors;
        this.events.emit('formErrors:change', this.formErrors);
        return Object.keys(errors).length === 0;
    }

    setOrderField(field: keyof IOrderForm, value: string): void {
        this[field] = value;

        if (this.isValidOrder()) {
            this.events.emit('order:ready', this.getOrderData());
        }
    }

    setContactsField(field: keyof IOrderForm, value: string): void {
        this[field] = value;
        if (this.isValidContacts()) {
            this.events.emit('contacts:ready', this.getContsctsData());
        }
    }
}